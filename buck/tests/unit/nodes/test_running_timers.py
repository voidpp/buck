from datetime import datetime, timedelta
from typing import Callable

from pytest import fixture

from buck.api.models import TimerState
from buck.api.nodes.queries.running_timers import RunningTimersFetcher
from buck.models import TimerEvent, TimerEventType, Timer


@fixture
def past_factory() -> Callable[[int], datetime]:
    now = datetime.now()

    def factory(diff_in_seconds: int = 0):
        return now - timedelta(seconds = diff_in_seconds)

    return factory


class TestGetRunningTimers:

    def test_just_started(self, past_factory):
        events = [
            TimerEvent(type = TimerEventType.START, timer_id = 1, time = past_factory()),
        ]
        timers = {
            1: Timer(name = "t1", length = '1m'),
        }

        fetcher = RunningTimersFetcher.create(timers, events)
        timers = fetcher.calculate()

        assert len(timers) == 1
        assert timers[0].elapsed_time == 0
        assert len(timers[0].lengths) == 1

    def test_started_earlier(self, past_factory):
        events = [
            TimerEvent(type = TimerEventType.START, timer_id = 1, time = past_factory(30)),
        ]
        timers = {
            1: Timer(name = "t1", length = '1m'),
        }

        fetcher = RunningTimersFetcher.create(timers, events)
        timers = fetcher.calculate()

        assert len(timers) == 1
        assert timers[0].elapsed_time == 30

    def test_overtime(self, past_factory):
        events = [
            TimerEvent(type = TimerEventType.START, timer_id = 1, time = past_factory(90)),
        ]
        timers = {
            1: Timer(name = "t1", length = '1m'),
        }

        fetcher = RunningTimersFetcher.create(timers, events)
        timers = fetcher.calculate()

        assert len(timers) == 0

    def test_stopped(self, past_factory):
        events = [
            TimerEvent(type = TimerEventType.START, timer_id = 1, time = past_factory(90)),
            TimerEvent(type = TimerEventType.STOP, timer_id = 1, time = past_factory(30)),
        ]
        timers = {
            1: Timer(name = "t1", length = '2m'),
        }

        fetcher = RunningTimersFetcher.create(timers, events)
        timers = fetcher.calculate()

        assert len(timers) == 0

    def test_pause(self, past_factory):
        events = [
            TimerEvent(type = TimerEventType.START, timer_id = 1, time = past_factory(90)),
            TimerEvent(type = TimerEventType.PAUSE, timer_id = 1, time = past_factory(80)),
        ]
        timers = {
            1: Timer(name = "t1", length = '2m'),
        }

        fetcher = RunningTimersFetcher.create(timers, events)
        timers = fetcher.calculate()

        assert len(timers) == 1
        assert timers[0].elapsed_time == 10
        assert timers[0].state == TimerState.PAUSED

    def test_unpause(self, past_factory):
        events = [
            TimerEvent(type = TimerEventType.START, timer_id = 1, time = past_factory(90)),
            TimerEvent(type = TimerEventType.PAUSE, timer_id = 1, time = past_factory(80)),
            TimerEvent(type = TimerEventType.START, timer_id = 1, time = past_factory(70)),
        ]
        timers = {
            1: Timer(name = "t1", length = '2m'),
        }

        fetcher = RunningTimersFetcher.create(timers, events)
        timers = fetcher.calculate()

        assert len(timers) == 1
        assert timers[0].elapsed_time == 80
        assert timers[0].state == TimerState.STARTED

    def test_remaining_times_multiple(self, past_factory):
        events = [
            TimerEvent(type = TimerEventType.START, timer_id = 1, time = past_factory()),
        ]
        timers = {
            1: Timer(name = "t1", length = '1m, 2m, 2m'),
        }

        fetcher = RunningTimersFetcher.create(timers, events)
        timers = fetcher.calculate()

        assert timers[0].remaining_times == [60, 120, 120]
