from pydantic import ValidationError as PydanticValidationError, validator
from pydantic.main import BaseModel

from buck.api.models import InstanceResult, InvalidTimedeltaError
from buck.api.tools import error_list_from_pydantic_error
from buck.components.node_base import NodeBase, ValidationError
from buck.models import Timer, TimerEvent, TimerEventType
from buck.tools import parse_timer_lengths, TimeLengthParseError


class StartTimerValidator(BaseModel):
    length: str
    name: str = None
    sound_file: str = None
    predefined_timer_id: int = None  # TODO

    @validator('length')
    def validate_length(cls, value: str):
        try:
            parse_timer_lengths(value)
        except TimeLengthParseError as e:
            raise InvalidTimedeltaError()  # TODO: test this
        return value


class StartTimerNode(NodeBase):
    result_type = InstanceResult
    input_validator = StartTimerValidator

    async def validate(self):
        try:
            self.input_validator(**self._kwargs)
        except PydanticValidationError as e:
            raise ValidationError(InstanceResult(errors = error_list_from_pydantic_error(e)))

    async def resolve(self):
        async with self.session.begin():
            timer = Timer(**self.args.dict())
            self.session.add(timer)
            event = TimerEvent(type = TimerEventType.START, timer = timer)
            self.session.add(event)
            await self.session.flush()
            timer_id = timer.id
            timer_length = timer.length

        await self.scheduler.set_alarm(timer_id, timer_length, self.session)

        self.request_context.broker.publish.timer_events()

        return InstanceResult(id = timer_id)


"""
    - startTimer (3m, 10m)
        - create timer
        - create START timer_event and publish
        - add celery tasks (alarm.apply_async)
            - params:
                - timer_id x, countdown: 180s
                - timer_id x, countdown: 600s
            - store tasks ids in redis with timer id
    - pause at 90s
        - revoke all the tasks with this timer_id
        - create PAUSE timer_event and publish
    - unpause
        - create START timer_event and publish
        - calculate running length based on timer_event table
        - add task(s) accordingly
    - first alarm task called
        - create ALARM timer_event and publish
    - second(final) alarm task called
        - create ALARM timer_event and publish
        - create STOP timer_event and publish
"""
