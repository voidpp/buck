from pydantic.main import BaseModel
from sqlalchemy import select

from buck.api.models import Error, InstanceResult
from buck.components.node_base import NodeBase
from buck.models import Timer, PredefinedTimer


class SaveTimerValidator(BaseModel):
    timer_id: int
    name: str = None
    group_id: int = None


class SaveTimerNode(NodeBase[SaveTimerValidator]):
    result_type = InstanceResult
    input_validator = SaveTimerValidator

    async def resolve(self):
        result = await self.db.execute(select(Timer).filter(Timer.id == self.args.timer_id))

        rows = result.first()

        if not rows:
            return InstanceResult(errors = [Error(field_name = "timer_id", message = "unknown")])

        timer = rows.Timer

        if not self.args.name or not timer.name:
            return InstanceResult(errors = [Error(field_name = "name", message = "mandatory")])

        async with self.db.begin():
            predefined_timer = PredefinedTimer(
                length = timer.length,
                name = self.args.name or timer.name,
                group_id = self.args.group_id,
            )
            self.db.add(predefined_timer)

        return InstanceResult(id = predefined_timer.id)
