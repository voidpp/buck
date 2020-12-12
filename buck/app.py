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
from .index import index_endpoint

config = load()

context = RequestContext(
    config,
    Database(str(config.database)),
    Scheduler(config),
    Broker(config.redis)
)

app = Starlette(
    debug = True,
    routes = [
        Mount('/static', app = StaticFiles(directory = Folders.static), name = "static"),
        Route('/api/graphql', GraphQLApp(schema, executor_class = AsyncioExecutor)),
        Route('/{path:path}', index_endpoint),
        WebSocketRoute('/api/subscribe', SubscriptionApp(schema)),
    ],
    middleware = [
        Middleware(InjectionMiddleware, data = {Keys.HTTP_REQUEST_CONTEXT: context}),
    ],
)
