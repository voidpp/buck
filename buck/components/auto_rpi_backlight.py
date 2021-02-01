import logging
import time

import adafruit_veml7700
import board
import busio
from rpi_backlight import Backlight

from .config import load


def exponential_ease_out(p: float) -> float:
    return p if (p == 1.0) else 1 - pow(2, -10 * p)


def main():
    config = load()

    logger = logging.getLogger(__name__)

    light_max = config.auto_backlight.light_max
    brightness_min = config.auto_backlight.brightness_min
    fade_duration = config.auto_backlight.fade_duration
    refresh = config.auto_backlight.refresh

    backlight = Backlight(config.backlight_sysfs_path)
    i2c = busio.I2C(board.SCL, board.SDA)
    veml7700 = adafruit_veml7700.VEML7700(i2c)
    backlight.fade_duration = fade_duration

    while 1:
        light = veml7700.light
        rel_light = min(1, light / light_max)
        brightness = round(exponential_ease_out(min(1, rel_light)) * 100)
        limited_brightness = max(brightness_min, brightness)
        backlight.brightness = limited_brightness
        logger.debug("light: %s, rel_light: %s, brightness: %s, limited_brightness: %s", light, rel_light, brightness, limited_brightness)
        time.sleep(refresh)
