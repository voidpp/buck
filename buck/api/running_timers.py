import logging
from collections import defaultdict
from dataclasses import dataclass
from typing import Iterable

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from buck.api.models import RunningTimer, TimerState
from buck.models import TimerEvent, TimerEventType, Timer
from buck.tools import calc_elapsed_time, parse_timer_lengths, calc_countdowns

logger = logging.getLogger(__name__)


@dataclass
class RunningTimersFetcherData:
    timers: dict[int, Timer]
    events: list[TimerEvent]


class RunningTimersFetcher:

    def __init__(self, session: AsyncSession = None):
        self._session = session
        self._timers: dict[int, Timer] = {}
        self._events: list[TimerEvent] = []

    @classmethod
    def create(cls, timers: dict[int, Timer], events: list[TimerEvent]) -> 'RunningTimersFetcher':
        instance = cls(None)
        instance._timers = timers
        instance._events = events
        return instance

    async def add_events(self, events: list[TimerEvent]) -> bool:
        new_timer_ids: set[int] = set()
        new_events = []
        for event in events:
            if event.type == TimerEventType.ALARM:
                continue
            new_events.append(event)
            if event.timer_id not in self._timers:
                new_timer_ids.add(event.timer_id)

        if not new_events:
            return False

        self._events += new_events

        await self.fetch_timers(new_timer_ids)

        return True

    async def fetch(self) -> list[RunningTimer]:
        await self.fetch_timers()
        await self.fetch_events()
        return self.calculate()

    async def fetch_timers(self, timer_ids: Iterable[int] = None):
        qs = select(Timer)
        if timer_ids:
            qs = qs.filter(Timer.id.in_(timer_ids))
        timers_result = await self._session.execute(qs)
        timers = {r[0].id: r[0] for r in timers_result.all()}
        self._timers.update(timers)

    async def fetch_events(self):
        qs = select(TimerEvent).filter(TimerEvent.type != TimerEventType.ALARM)
        self._events += [r[0] for r in (await self._session.execute(qs)).all()]

    def calculate(self) -> list[RunningTimer]:
        timer_events: dict[int, list[TimerEvent]] = defaultdict(list)

        for event in self._events:
            if event.type == TimerEventType.STOP:
                try:
                    del timer_events[event.timer_id]
                except KeyError:
                    # logger.warning("unknown timer %s", event.timer_id)
                    pass
                continue
            timer_events[event.timer_id].append(event)

        res = []

        for timer_id, events in timer_events.items():
            try:
                timer = self._timers[timer_id]
            except KeyError:
                # logger.warning("unknown timer %s", timer_id)
                continue
            elapsed_time = calc_elapsed_time(events)
            lengths = parse_timer_lengths(timer.length)
            if elapsed_time > sum(lengths):
                continue
            last_event = events[-1:][0]
            res.append(RunningTimer(
                id = timer.id,
                name = timer.name or timer.length,
                elapsed_time = elapsed_time,
                lengths = lengths,
                state = TimerState.STARTED if last_event.type == TimerEventType.START else TimerState.PAUSED,
                remaining_times = calc_countdowns(lengths, elapsed_time),
            ))

        return res
