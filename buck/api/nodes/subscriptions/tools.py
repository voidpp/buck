from sqlalchemy import desc, select
from sqlalchemy.orm import selectinload

from buck.api.tools import is_in_string_list
from buck.components.database import Database
from buck.models import TimerEvent


class IncrementalTimerEventFetcher:
    def __init__(self, db: Database, field_names: list[str] = None):
        self.db = db
        self.last_id = None
        self.field_names = field_names or []

    async def initialize(self):
        async with self.db.session() as session:
            result = await session.execute(select(TimerEvent.id).order_by(desc(TimerEvent.id)))
            event = result.first()
            self.last_id = event.id if event else 0

    async def fetch_next(self) -> list[TimerEvent]:
        qs = select(TimerEvent).filter(TimerEvent.id > self.last_id)

        if is_in_string_list(".timer.", self.field_names):
            qs = qs.options(selectinload(TimerEvent.timer))

        async with self.db.session() as session:
            result = await session.execute(qs)
            events = [r[0] for r in result.all()]

        if len(events):
            self.last_id = events[-1:][0].id

        return events
