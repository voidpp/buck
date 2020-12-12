from buck.components.config import AppConfig
from celery import Celery


def create_celery_app(config: AppConfig) -> Celery:
    return Celery("buck", broker = config.redis)
