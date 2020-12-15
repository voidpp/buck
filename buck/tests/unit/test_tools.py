from datetime import datetime, timedelta
from unittest.mock import MagicMock

import pytest
from pytest import raises

from buck.models import TimerEventType, TimerEvent
from buck.tools import calc_elapsed_time, CountdownCalcError, calc_countdowns, LazyString, calc_remaining_times
from buck.tools import parse_timer_lengths, TimeLengthParseError


class TestParseTimerLengths:

    def test_simple_length(self):
        assert parse_timer_lengths('10s') == [10]

    def test_multiple_lengths(self):
        assert parse_timer_lengths('10s, 20s') == [10, 20]

    def test_invalid_length(self):
        with raises(TimeLengthParseError):
            parse_timer_lengths('dsfsd')


def past(diff_in_seconds: int) -> datetime:
    return datetime.now() - timedelta(seconds = diff_in_seconds)


class TestCalcElapsedTime:

    def test_just_started(self):
        events = [TimerEvent(type = TimerEventType.START, time = past(0))]

        assert calc_elapsed_time(events) == 0

    def test_never_paused(self):
        diff = 30
        events = [TimerEvent(type = TimerEventType.START, time = past(diff))]

        assert calc_elapsed_time(events) == diff

    def test_once_paused(self):
        events = [
            TimerEvent(type = TimerEventType.START, time = past(60)),
            TimerEvent(type = TimerEventType.PAUSE, time = past(30)),
        ]

        assert calc_elapsed_time(events) == 30

    def test_restarted(self):
        events = [
            TimerEvent(type = TimerEventType.START, time = past(60)),
            TimerEvent(type = TimerEventType.PAUSE, time = past(30)),
            TimerEvent(type = TimerEventType.START, time = past(10)),
        ]

        assert calc_elapsed_time(events) == 40

    def test_error_on_invalid_type(self):
        with raises(CountdownCalcError):
            calc_elapsed_time([TimerEvent(type = TimerEventType.STOP)])

    def test_error_on_duplicated_type(self):
        with raises(CountdownCalcError):
            calc_elapsed_time([
                TimerEvent(type = TimerEventType.START, time = past(65)),
                TimerEvent(type = TimerEventType.START, time = past(60)),
            ])

    def test_error_on_wrong_time(self):
        with raises(CountdownCalcError):
            calc_elapsed_time([
                TimerEvent(type = TimerEventType.START, time = past(60)),
                TimerEvent(type = TimerEventType.PAUSE, time = past(65)),
            ])


class TestLazyString:

    def test_serializing(self):
        ls = LazyString(lambda: 1 + 1)

        assert str(ls) == "2"

    def test_only_called_once(self):
        mock = MagicMock()
        mock.return_value = "1"
        ls = LazyString(mock)

        assert f"{ls}{ls}{ls}" == "111"
        assert mock.call_count == 1


@pytest.mark.parametrize('msg, lengths, elapsed, result', [
    ("simple time, no elapsed", [60], 0, [60]),
    ("simple time, some elapsed", [60], 15, [45]),
    ('multiple_time_zero_elapsed', [20, 30], 0, [20, 50]),
    ('multiple_time_some_elapsed', [20, 30], 10, [10, 40]),
    ('multiple_time_elapsed_over_the_first', [20, 30], 35, [15]),

])
def test_calc_countdowns(msg, lengths, elapsed, result):
    res = calc_countdowns(lengths, elapsed)
    assert res == result


@pytest.mark.parametrize('msg, lengths, elapsed, result', [
    ("simple time, no elapsed", [60], 0, [60]),
    ("simple time, some elapsed", [60], 15, [45]),
    ('multiple time zero elapsed', [20, 30], 0, [20, 30]),
    ('multiple time some elapsed', [20, 30], 10, [10, 30]),
    ('multiple time elapsed over the first', [20, 30], 35, [15]),

])
def test_calc_remaining_times(msg, lengths, elapsed, result):
    assert calc_remaining_times(lengths, elapsed) == result
