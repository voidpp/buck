import asyncio

from buck.components.broker import Broker
from buck.components.database import Database
from buck.models import TimerEvent, TimerEventType


async def do_alarm(timer_id: int, db_url: str, redis_url: str, is_last: bool):
    db = Database(db_url)

    async with db.transaction() as session:
        events = [TimerEvent(timer_id = timer_id, type = TimerEventType.ALARM)]

        if is_last:
            events.append(TimerEvent(timer_id = timer_id, type = TimerEventType.STOP))

        session.add_all(events)

    broker = Broker(redis_url)
    await broker.publish.timer_events()


def alarm(timer_id: int, db_url: str, redis_url: str, is_last: bool):
    asyncio.run(do_alarm(timer_id, db_url, redis_url, is_last))
