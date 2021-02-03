from enum import Enum

from pydantic.main import BaseModel
from sqlalchemy import select

from buck.api.models import Error, ValidationResult
from buck.components.node_base import NodeBase
from buck.models import Timer, TimerEventType, TimerEvent


class TimerOperation(Enum):
    PAUSE = 'PAUSE'
    UNPAUSE = 'UNPAUSE'
    STOP = 'STOP'


class OperateTimerValidator(BaseModel):
    id: int
    operation: TimerOperation


operation_to_event_type = {
    TimerOperation.PAUSE: TimerEventType.PAUSE,
    TimerOperation.UNPAUSE: TimerEventType.START,
    TimerOperation.STOP: TimerEventType.STOP,
}


class OperateTimerNode(NodeBase[OperateTimerValidator]):
    result_type = ValidationResult
    input_validator = OperateTimerValidator

    async def validate(self):
        self._args = self.input_validator(**self._kwargs)

    async def resolve(self):
        async with self.session.begin():
            result = await self.session.execute(select(Timer).filter(Timer.id == self.args.id))

            row = result.one_or_none()

            if not row:
                return ValidationResult(errors = [Error(field_name = "id", message = "unknown")])

            timer: Timer = row[0]

            event = TimerEvent(timer_id = self.args.id, type = operation_to_event_type[self.args.operation])

            self.session.add(event)
            await self.session.flush()

            if self.args.operation == TimerOperation.UNPAUSE:
                await self.scheduler.set_alarm(timer.id, timer.length, self.session)
            else:
                self.scheduler.remove_alarm(self.args.id)

        await self.request_context.broker.publish.timer_events()

        return {}
