import asyncio
import logging
from asyncio import create_task

import adafruit_veml7700
import board
import busio
from rpi_backlight import Backlight

from buck.components.broker import Broker
from buck.components.config import AppConfig
from buck.components.settings import SettingsManager

logger = logging.getLogger(__name__)


def exponential_ease_out(p: float) -> float:
    return p if (p == 1.0) else 1 - pow(2, -10 * p)


class AutoBacklight:

    def __init__(self, config: AppConfig):
        self._config = config
        self._broker = Broker(config.redis)
        self._settings_manager = SettingsManager(config.redis, self._broker)
        self._control_task = None

    async def run(self):
        if not self._config.auto_backlight:
            logger.info("Auto backlight is not configured - exiting...")
            return
        await self._start_stop()
        await self._wait_for_settings_change()

    async def _is_enabled(self):
        settings = await self._settings_manager.load()
        return settings.is_auto_backlight_enabled

    async def _wait_for_settings_change(self):
        async for _ in self._broker.subscribe.settings():
            await self._start_stop()

    async def _start_stop(self):
        is_enabled = await self._is_enabled()
        logger.debug("start/restart: is_enabled: %s", is_enabled)

        if is_enabled and not self._control_task:
            logger.debug("starting the control task...")
            self._control_task = create_task(self._control())
            return

        if not is_enabled and self._control_task:
            logger.debug("stopping the control task...")
            self._control_task.cancel()
            self._control_task = None

    async def _control_test(self):
        while True:
            print("control test!")
            await asyncio.sleep(1)

    async def _control(self):
        config = self._config.auto_backlight

        backlight = Backlight(self._config.backlight_sysfs_path)
        i2c = busio.I2C(board.SCL, board.SDA)
        veml7700 = adafruit_veml7700.VEML7700(i2c)
        backlight.fade_duration = config.fade_duration

        while True:
            light = veml7700.light
            rel_light = min(1, light / config.light_max)
            brightness = round(exponential_ease_out(min(1, rel_light)) * 100)
            limited_brightness = max(config.brightness_min, brightness)
            backlight.brightness = limited_brightness
            logger.debug("light: %s, rel_light: %s, brightness: %s, limited_brightness: %s", light, rel_light, brightness, limited_brightness)
            await asyncio.sleep(config.refresh)
