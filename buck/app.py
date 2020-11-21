from graphql.execution.executors.asyncio import AsyncioExecutor
from starlette.applications import Starlette
from starlette.graphql import GraphQLApp
from starlette.middleware import Middleware
from starlette.routing import Route, Mount
from starlette.staticfiles import StaticFiles

from .api.schema import schema
from .components.config import load
from .components.database import Database
from .components.folders import Folders
from .components.injection_middleware import InjectionMiddleware, RequestContext
from .index import index_endpoint

config = load()

db = Database(str(config.database))

app = Starlette(
    debug = True,
    routes = [
        Mount('/static', app = StaticFiles(directory = Folders.static), name = "static"),
        Route('/api/graphql', GraphQLApp(schema, executor_class = AsyncioExecutor)),
        Route('/{path:path}', index_endpoint),
    ],
    middleware = [
        Middleware(InjectionMiddleware, context = RequestContext(config, db)),
    ],
)
