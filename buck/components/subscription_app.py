from buck.components.asgi_subscription_server import AsgiSubscriptionServer
from graphene import Schema
from starlette.requests import HTTPConnection


class SubscriptionApp:

    def __init__(self, schema: Schema):
        self.server = AsgiSubscriptionServer(schema = schema)

    async def __call__(self, scope, receive, send):
        request_context = HTTPConnection(scope)
        await self.server.handle(scope, receive, send, request_context)
