import time

from graphene import ObjectType, Field, String, Schema as BaseSchema
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.requests import Request

from buck.components.injection_middleware import RequestContext
from buck.components.keys import Keys
from .nodes.delete_group import DeleteGroupNode
from .nodes.delete_predefined_timer import DeletePredefinedTimerNode
from .nodes.groups import GroupsNode
from .nodes.operate_timer import OperateTimerNode
from .nodes.predefine_timer import PredefineTimerNode
from .nodes.predefined_timers import PredefinedTimersNode
from .nodes.save_group import SaveGroupNode
from .nodes.save_timer import SaveTimerNode
from .nodes.start_timer import StartTimerNode
from .nodes.timer_events import TimerEventsNode
from .nodes.timers import TimersNode


class Query(ObjectType):
    groups = GroupsNode.field()
    ping = Field(String, resolver = lambda root, info: 'pong')
    predefined_timers = PredefinedTimersNode.field()
    timers = TimersNode.field()
    timer_events = TimerEventsNode.field()


class Mutation(ObjectType):
    delete_group = DeleteGroupNode.field()
    delete_predefined_timer = DeletePredefinedTimerNode.field()
    predefine_timer = PredefineTimerNode.field()
    save_group = SaveGroupNode.field()
    save_timer = SaveTimerNode.field()
    start_timer = StartTimerNode.field()
    operate_timer = OperateTimerNode.field()


class Schema(BaseSchema):

    async def execute(self, *args, **kwargs):
        start = time.perf_counter()

        context = kwargs["context"]
        request: Request = context["request"]

        http_request_context: RequestContext = request.scope[Keys.HTTP_REQUEST_CONTEXT]

        async with AsyncSession(http_request_context.db.engine) as session:
            async with session.begin():
                context[Keys.API_CONTEXT_SESSION] = session
                result = await super().execute(*args, **kwargs)

        duration = round((time.perf_counter() - start) * 1000, 2)
        print("Processed GraphQL query (%s ms):\n%s\nVariables: %s" % (duration, args[0], kwargs.get("variables")))

        return result


schema = Schema(query = Query, mutation = Mutation)
