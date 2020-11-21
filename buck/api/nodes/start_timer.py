from pydantic.main import BaseModel

from buck.api.models import InstanceResult
from buck.components.node_base import NodeBase
from buck.models import Timer, TimerEvent, TimerEventType


class StartTimerValidator(BaseModel):
    length: int
    name: str = None


class StartTimerNode(NodeBase):
    result_type = InstanceResult
    input_validator = StartTimerValidator

    async def resolve(self):
        async with self.db.begin():
            timer = Timer(**self.args.dict())
            self.db.add(timer)
            event = TimerEvent(type = TimerEventType.START, timer = timer)
            self.db.add(event)
            await self.db.flush()
            id_ = timer.id

        return InstanceResult(id = id_)
