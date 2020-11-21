from graphene import List
from pydantic.main import BaseModel
from sqlalchemy import select

from buck import models
from buck.components.node_base import NodeBase
from ..models import TimerEvent


class TimerEventsValidator(BaseModel):
    timer_id: int


class TimerEventsNode(NodeBase[TimerEventsValidator]):
    result_type = List(TimerEvent)
    input_validator = TimerEventsValidator

    async def resolve(self):
        result = await self.db.execute(select(models.TimerEvent).filter(models.TimerEvent.timer_id == self.args.timer_id))

        rows = result.all()

        return [r[0] for r in rows]
