import logging

from graphene import ObjectType, List
from graphql import ResolveInfo

from buck.api import models
from buck.api.nodes.subscriptions.running_timers import RunningTimersSubscription
from buck.api.nodes.subscriptions.tools import IncrementalTimerEventFetcher
from buck.api.tools import get_field_name_list
from buck.components.injection_middleware import RequestContext
from buck.components.keys import Keys

logger = logging.getLogger(__name__)


class Subscription(ObjectType, RunningTimersSubscription):
    timer_events = List(models.TimerEvent)

    @staticmethod
    async def resolve_timer_events(root, info: ResolveInfo):
        http_request_context: RequestContext = info.context['request'].scope[Keys.HTTP_REQUEST_CONTEXT]
        field_names = get_field_name_list(info.field_asts[0])
        async with http_request_context.db.session() as session:
            fetcher = IncrementalTimerEventFetcher(session, field_names)

            await fetcher.initialize()

            async for _ in http_request_context.broker.subscribe.timer_events():
                yield await fetcher.fetch_next()
