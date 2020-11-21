import logging.config

from configpp.soil import Config
from configpp.tree import Tree, Settings, DatabaseLeaf

tree = Tree(Settings(
    convert_underscores_to_hypens = True,
    convert_camel_case_to_hypens = True,
))


@tree.root()
class AppConfig:
    database: DatabaseLeaf
    logger: dict
    redis: str


def load() -> AppConfig:
    config_loader = Config('buck.yaml')

    if not config_loader.load():
        raise Exception("config not loaded")

    app_config: AppConfig = tree.load(config_loader.data)

    logging.config.dictConfig(app_config.logger)

    return app_config
