from pydantic import ValidationError as PydanticValidationError
from pydantic.main import BaseModel

from buck.api.models import InstanceResult
from buck.api.tools import error_list_from_pydantic_error
from buck.components.node_base import NodeBase, ValidationError
from buck.models import Timer, TimerEvent, TimerEventType


class StartTimerValidator(BaseModel):
    length: int
    name: str = None
    predefined_timer_id: int = None  # TODO


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
