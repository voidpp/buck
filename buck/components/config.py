import logging
import logging.config
import os
from typing import List

from configpp.soil import Config, Transport, Location
from configpp.tree import Tree, Settings, DatabaseLeaf, NodeBase

from buck.components.keys import Keys

logger = logging.getLogger(__name__)

tree = Tree(Settings(
    convert_underscores_to_hypens = True,
    convert_camel_case_to_hypens = True,
))


class Sound(NodeBase):
    filename: str
    title: str


class Weather(NodeBase):
    type: str
    config: dict


class AutoBacklight(NodeBase):
    light_max: int
    brightness_min: int
    fade_duration: float
    refresh: float


@tree.root()
class AppConfig:
    database: DatabaseLeaf
    logger: dict
    redis: str
    sounds: List[Sound]
    auto_backlight: AutoBacklight
    backlight_sysfs_path: str = ""
    weather: Weather = None


# TODO: move to configpp
class EnvOnlyTransport(Transport):
    def __init__(self, env_var_name: str):
        super().__init__(locations = [Location(os.environ.get(env_var_name))])


def load() -> AppConfig:
    config_loader = Config('buck.yaml', transport = EnvOnlyTransport(Keys.CONFIG_FOLDER))

    if not config_loader.load():
        raise Exception("config not loaded")

    app_config: AppConfig = tree.load(config_loader.data)

    logging.config.dictConfig(app_config.logger)

    logger.debug("config loaded from %s", config_loader.path)

    return app_config
