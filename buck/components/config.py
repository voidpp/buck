import logging
import logging.config
from typing import List

from configpp.soil import Config
from configpp.tree import Tree, Settings, DatabaseLeaf, NodeBase

logger = logging.getLogger(__name__)

tree = Tree(Settings(
    convert_underscores_to_hypens = True,
    convert_camel_case_to_hypens = True,
))


class Sound(NodeBase):
    filename: str
    title: str


@tree.root()
class AppConfig:
    database: DatabaseLeaf
    logger: dict
    redis: str
    sounds: List[Sound]
    claude_api_url: str = ""


def load() -> AppConfig:
    config_loader = Config('buck.yaml')

    if not config_loader.load():
        raise Exception("config not loaded")

    app_config: AppConfig = tree.load(config_loader.data)

    logging.config.dictConfig(app_config.logger)

    logger.debug("config loaded from %s", config_loader.path)

    return app_config
