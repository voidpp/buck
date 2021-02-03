from buck.components.broker import Broker
from buck.components.subscription_app import SubscriptionApp
from graphql.execution.executors.asyncio import AsyncioExecutor
from starlette.applications import Starlette
from starlette.graphql import GraphQLApp
from starlette.middleware import Middleware
from starlette.routing import Route, Mount, WebSocketRoute
from starlette.staticfiles import StaticFiles

from .api.schema import schema
from .celery.scheduler import Scheduler
from .components.config import load
from .components.database import Database
from .components.folders import Folders
from .components.injection_middleware import InjectionMiddleware, RequestContext
from .components.keys import Keys
from .components.settings import SettingsManager
from .components.weather_provider import create_weather_provider
from .endpoints import rpi_kiosk, admin, index

config = load()

broker = Broker(config.redis)

context = RequestContext(
    config,
    Database(str(config.database)),
    Scheduler(config),
    broker,
    create_weather_provider(config.weather),
    SettingsManager(config.redis, broker),
)

app = Starlette(
    debug = True,
    routes = [
        Mount('/static', app = StaticFiles(directory = Folders.static), name = "static"),
        Route('/api/graphql', GraphQLApp(schema, executor_class = AsyncioExecutor)),
        Route('/rpi-kiosk', rpi_kiosk),
        Route('/admin/{path:path}', admin),
        Route('/', index),
        WebSocketRoute('/api/subscribe', SubscriptionApp(schema)),
    ],
    middleware = [
        Middleware(InjectionMiddleware, data = {Keys.HTTP_REQUEST_CONTEXT: context}),
    ],
)
