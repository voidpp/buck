import logging
import time

from graphene import ObjectType, Field, String, Schema as BaseSchema
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.requests import Request

from buck.components.injection_middleware import RequestContext
from buck.components.keys import Keys
from .nodes.mutations.delete_group import DeleteGroupNode
from .nodes.mutations.delete_predefined_timer import DeletePredefinedTimerNode
from .nodes.mutations.operate_timer import OperateTimerNode
from .nodes.mutations.save_group import SaveGroupNode
from .nodes.mutations.save_predefined_timer import SavePredefinedTimerNode
from .nodes.mutations.save_timer import SaveTimerNode
from .nodes.mutations.start_timer import StartTimerNode
from .nodes.queries.groups import GroupsNode
from .nodes.queries.predefined_timers import PredefinedTimersNode
from .nodes.queries.running_timers import RunningTimersNode
from .nodes.queries.sounds import SoundsNode
from .nodes.queries.timer_events import TimerEventsNode
from .nodes.queries.timers import TimersNode
from .nodes.subscriptions import Subscription

logger = logging.getLogger(__name__)


class Query(ObjectType):
    groups = GroupsNode.field()
    ping = Field(String, resolver = lambda root, info: 'pong')
    predefined_timers = PredefinedTimersNode.field()
    timers = TimersNode.field()
    timer_events = TimerEventsNode.field()
    running_timers = RunningTimersNode.field()
    sounds = SoundsNode.field()


class Mutation(ObjectType):
    delete_group = DeleteGroupNode.field()
    delete_predefined_timer = DeletePredefinedTimerNode.field()
    operate_timer = OperateTimerNode.field()
    save_group = SaveGroupNode.field()
    save_predefined_timer = SavePredefinedTimerNode.field()
    save_timer = SaveTimerNode.field()
    start_timer = StartTimerNode.field()


class Schema(BaseSchema):

    async def execute(self, *args, **kwargs):
        start = time.perf_counter()

        context = kwargs["context"]
        request: Request = context["request"]

        http_request_context: RequestContext = request.scope[Keys.HTTP_REQUEST_CONTEXT]

        async with AsyncSession(http_request_context.db.engine) as session:
            context[Keys.API_CONTEXT_SESSION] = session
            result = await super().execute(*args, **kwargs)

        duration = round((time.perf_counter() - start) * 1000, 2)
        logger.info("Processed GraphQL query (%s ms):\n%s\nVariables: %s" % (duration, args[0], kwargs.get("variables")))

        return result


schema = Schema(query = Query, mutation = Mutation, subscription = Subscription)
