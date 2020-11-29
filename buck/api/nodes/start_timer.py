from pydantic import ValidationError as PydanticValidationError, validator
from pydantic.main import BaseModel
from pytimeparse.timeparse import timeparse

from buck.api.models import InstanceResult, InvalidTimedeltaError
from buck.api.tools import error_list_from_pydantic_error
from buck.components.node_base import NodeBase, ValidationError
from buck.models import Timer, TimerEvent, TimerEventType


class StartTimerValidator(BaseModel):
    length: str
    name: str = None
    predefined_timer_id: int = None  # TODO

    @validator('length')
    def validate_length(cls, value: str):
        if not timeparse(value):
            raise InvalidTimedeltaError()
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
        timer = Timer(**self.args.dict())
        self.db.add(timer)
        event = TimerEvent(type = TimerEventType.START, timer = timer)
        self.db.add(event)
        await self.db.flush()
        return InstanceResult(id = timer.id)
