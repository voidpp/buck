import logging
from asyncio import sleep, create_task, Task, wait, FIRST_COMPLETED, Event
from typing import Callable

from graphene import List
from graphql import ResolveInfo

from buck.api.models import RunningTimer, TimerState
from buck.api.nodes.subscriptions.tools import IncrementalTimerEventFetcher
from buck.api.running_timers import RunningTimersFetcher
from buck.components.asgi_subscription_server import AsgiConnectionContext
from buck.components.broker import Broker
from buck.components.injection_middleware import RequestContext
from buck.components.keys import Keys
from buck.tools import LazyString

logger = logging.getLogger(__name__)


async def wait_for_new_events(event_fetcher: IncrementalTimerEventFetcher, timer_fetcher: RunningTimersFetcher, broker: Broker,
                              event: Event):
    async for _ in broker.subscribe.timer_events():
        fetched_new_events = await event_fetcher.fetch_next()
        logger.debug("new events received (%s)", LazyString(lambda: [e.id for e in fetched_new_events]))

        if await timer_fetcher.add_events(fetched_new_events):
            event.set()


def calc_refresh(timers: list[RunningTimer]) -> bool:
    return bool(sum([(1 if t.state == TimerState.STARTED else 0) for t in timers]))


class RunningTimersSubscription:
    running_timers = List(RunningTimer)

    @staticmethod
    async def resolve_running_timers(root, info: ResolveInfo):
        http_request_context: RequestContext = info.context['request'].scope[Keys.HTTP_REQUEST_CONTEXT]
        connection: AsgiConnectionContext = info.context['connection_context']

        # TODO: this is a really long lasting session, and maybe this is wrong
        async with http_request_context.db.session() as session:
            event_fetcher = IncrementalTimerEventFetcher(session)
            timer_fetcher = RunningTimersFetcher(session)

            await event_fetcher.initialize()

            logger.debug("yield initial list")
            result = await timer_fetcher.fetch()

            yield result

            event = Event()

            wait_for_new_events_task = create_task(wait_for_new_events(event_fetcher, timer_fetcher, http_request_context.broker, event))

            # this is (almost) the weirdest shit i ever seen in python
            # calling the Task.cancel its not really necessary, but if we dont store the result of the create_task in some variable
            # the python GC will throw out the wait_for_new_events coroutine, so it will stop listening...
            connection.on_close = connection.on_stop = wait_for_new_events_task.cancel

            refresh = calc_refresh(result)

            while True:
                event.clear()

                tasks: list[Task] = [create_task(event.wait())]

                if refresh:
                    tasks.append(create_task(sleep(1)))

                await wait(tasks, return_when = FIRST_COMPLETED)

                for task in tasks:
                    if not task.done():
                        task.cancel()

                new_result = timer_fetcher.calculate()
                refresh = calc_refresh(new_result)
                if new_result != result:
                    logger.debug("yield list %s", new_result)
                    yield new_result
                    result = new_result
