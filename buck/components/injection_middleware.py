from dataclasses import dataclass

from starlette.types import ASGIApp, Scope, Receive, Send

from .config import AppConfig
from .database import Database
from .keys import Keys


@dataclass
class RequestContext:
    config: AppConfig
    db: Database


class InjectionMiddleware:

    def __init__(self, app: ASGIApp, context: RequestContext):
        self.app = app
        self._context = context

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        scope[Keys.HTTP_REQUEST_CONTEXT] = self._context

        await self.app(scope, receive, send)
