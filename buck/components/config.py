import logging
import logging.config
import os
from pathlib import Path
from typing import List

from pydantic import BaseModel
from ruamel import yaml

from buck.components.keys import Keys

logger = logging.getLogger(__name__)


def replace_hyphen(name: str) -> str:
    return name.replace("_", "-")


class AutoDeHyphensModel(BaseModel):
    class Config:
        alias_generator = replace_hyphen


class Sound(BaseModel):
    filename: str
    title: str


class Weather(BaseModel):
    type: str
    config: dict


class AutoBacklight(AutoDeHyphensModel):
    light_max: int
    brightness_min: int
    fade_duration: float
    refresh: float


class AppConfig(AutoDeHyphensModel):
    database: str
    logger: dict
    redis: str
    sounds: List[Sound]
    auto_backlight: AutoBacklight = None
    backlight_sysfs_path: str = ""
    weather: Weather = None


def load() -> AppConfig:
    config_file_path = Path(os.environ.get(Keys.CONFIG_FILE))
    if not config_file_path.is_file():
        raise Exception("could not load the config")

    data = yaml.safe_load(config_file_path.read_bytes())

    app_config: AppConfig = AppConfig(**data)

    logging.config.dictConfig(app_config.logger)

    logger.debug("config loaded from %s", config_file_path)

    return app_config
