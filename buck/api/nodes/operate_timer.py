from pydantic.main import BaseModel
from sqlalchemy import select

from buck.api.models import Error, TimerOperation, ValidationResult
from buck.components.node_base import NodeBase
from buck.models import Timer


class OperateTimerValidator(BaseModel):
    id: int
    operation: TimerOperation


class OperateTimerNode(NodeBase[OperateTimerValidator]):
    result_type = ValidationResult
    input_validator = OperateTimerValidator

    async def resolve(self):
        result = await self.db.execute(select(Timer.id).filter(Timer.id == self.args.id))

        if not result.first():
            return ValidationResult(errors = [Error(field_name = "id", message = "unknown")])

        return {}
