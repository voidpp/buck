from buck.api.nodes.queries.running_timers import RunningTimersFetcher
from buck.models import TimerEvent, TimerEventType, Timer
from buck.tests.unit.assets import past


class TestGetRunningTimers:

    def test_just_started(self):
        events = [
            TimerEvent(type = TimerEventType.START, timer_id = 1, time = past()),
        ]
        timers = {
            1: Timer(name = "t1", length = '1m'),
        }

        fetcher = RunningTimersFetcher.create(timers, events)
        timers = fetcher.calculate()

        assert len(timers) == 1
        assert timers[0].elapsed_time == 0
        assert len(timers[0].lengths) == 1

    def test_started_earlier(self):
        events = [
            TimerEvent(type = TimerEventType.START, timer_id = 1, time = past(30)),
        ]
        timers = {
            1: Timer(name = "t1", length = '1m'),
        }

        fetcher = RunningTimersFetcher.create(timers, events)
        timers = fetcher.calculate()

        assert len(timers) == 1
        assert timers[0].elapsed_time == 30

    def test_overtime(self):
        events = [
            TimerEvent(type = TimerEventType.START, timer_id = 1, time = past(90)),
        ]
        timers = {
            1: Timer(name = "t1", length = '1m'),
        }

        fetcher = RunningTimersFetcher.create(timers, events)
        timers = fetcher.calculate()

        assert len(timers) == 0

    def test_stopped(self):
        events = [
            TimerEvent(type = TimerEventType.START, timer_id = 1, time = past(90)),
            TimerEvent(type = TimerEventType.STOP, timer_id = 1, time = past(30)),
        ]
        timers = {
            1: Timer(name = "t1", length = '2m'),
        }

        fetcher = RunningTimersFetcher.create(timers, events)
        timers = fetcher.calculate()

        assert len(timers) == 0

    # TODO test timer state
