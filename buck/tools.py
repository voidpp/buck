import os
from datetime import datetime
from importlib.metadata import version
from time import time
from typing import Callable

from pytimeparse.timeparse import timeparse

from buck.components.keys import Keys
from buck.models import TimerEventType, TimerEvent


class TimeLengthParseError(Exception):
    pass


class CountdownCalcError(Exception):
    pass


def is_dev_mode() -> bool:
    return bool(os.environ.get(Keys.DEV_MODE, 0))


def get_app_version() -> str:
    pkg_version = version("buck")
    return f"{pkg_version}-{int(time())}" if is_dev_mode() else pkg_version


def calc_elapsed_time(events: list[TimerEvent]) -> int:
    start_events = []
    pause_events = []
    now = datetime.now()

    last_event = None

    for event in events:
        if event.type == TimerEventType.START:
            start_events.append(event)
        elif event.type == TimerEventType.PAUSE:
            pause_events.append(event)
        else:
            raise CountdownCalcError("calc_elapsed_time can handle only start and pause event types, got %s", event.type)

        if last_event is not None:
            if last_event.type == event.type:
                raise CountdownCalcError("%s event must follow a %s event, not %s", last_event.type, event.type, last_event.type)

            if event.time < last_event.time:
                raise CountdownCalcError("wrong order of events!")

        last_event = event

    sections: list[tuple[datetime, datetime]] = []

    for idx, start_event in enumerate(start_events):
        pause_time = now if idx >= len(pause_events) else pause_events[idx].time
        sections.append((
            start_event.time,
            pause_time
        ))

    seconds = 0

    for (start_time, end_time) in sections:
        diff = end_time - start_time
        seconds += diff.total_seconds()

    return round(seconds)


def parse_timer_lengths(value: str) -> list[int]:
    time_delta_strings = value.split(',')
    lengths = []
    for val in time_delta_strings:
        if seconds := timeparse(val):
            lengths.append(seconds)
        else:
            raise TimeLengthParseError(val)

    return lengths


def calc_countdowns(lengths: list[int], total_elapsed_time: int) -> list[int]:
    if sum(lengths) < total_elapsed_time:
        raise CountdownCalcError("elapsed more time than the orig length, wtf?")

    res = []

    prev_len = 0
    for length in lengths:
        time = prev_len + length - total_elapsed_time
        if time > 0:
            res.append(time)
        prev_len += length

    return res


def calc_remaining_times(lengths: list[int], total_elapsed_time: int) -> list[int]:
    res = []
    elapsed_time = total_elapsed_time

    for length in lengths:
        res.append(length - elapsed_time)

        elapsed_time -= length
        if elapsed_time < 0:
            elapsed_time = 0

    return list(filter(lambda i: i > 0, res))


class LazyString:

    def __init__(self, resolver: Callable):
        self._resolver = resolver
        self._value = None

    def __str__(self):
        if not self._value:
            self._value = str(self._resolver())
        return self._value
