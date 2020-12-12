from dataclasses import dataclass

from buck.components.broker import Broker
from starlette.types import ASGIApp, Scope, Receive, Send

from .config import AppConfig
from .database import Database
from ..celery.scheduler import Scheduler


@dataclass
class RequestContext:
    config: AppConfig
    db: Database
    scheduler: Scheduler
    broker: Broker


class InjectionMiddleware:

    def __init__(self, app: ASGIApp, data: dict):
        self.app = app
        self._data = data

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        for key, val in self._data.items():
            scope[key] = val

        await self.app(scope, receive, send)
