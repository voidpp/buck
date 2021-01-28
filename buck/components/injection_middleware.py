from dataclasses import dataclass

from starlette.types import ASGIApp, Scope, Receive, Send

from buck.components.broker import Broker
from .config import AppConfig
from .database import Database
from .weather_provider import WeatherProviderBase
from ..celery.scheduler import Scheduler


@dataclass
class RequestContext:
    config: AppConfig
    db: Database
    scheduler: Scheduler
    broker: Broker
    weather_provider: WeatherProviderBase


class InjectionMiddleware:

    def __init__(self, app: ASGIApp, data: dict):
        self.app = app
        self._data = data

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        for key, val in self._data.items():
            scope[key] = val

        await self.app(scope, receive, send)
