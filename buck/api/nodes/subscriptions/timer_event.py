import logging

from graphql import ResolveInfo

from buck.api.nodes.subscriptions.tools import IncrementalTimerEventFetcher
from buck.api.tools import get_field_name_list
from buck.components.injection_middleware import RequestContext
from buck.components.keys import Keys

logger = logging.getLogger(__name__)


async def resolve_timer_event(root, info: ResolveInfo):
    http_request_context: RequestContext = info.context["request"].scope[Keys.HTTP_REQUEST_CONTEXT]
    field_names = get_field_name_list(info.field_asts[0])

    fetcher = IncrementalTimerEventFetcher(http_request_context.db, field_names)

    await fetcher.initialize()

    async for _ in http_request_context.broker.subscribe.timer_events():
        events = await fetcher.fetch_next()
        for event in events:
            yield event
