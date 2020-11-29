from pydantic.main import BaseModel
from sqlalchemy import select

from buck import models
from buck.api.models import InstanceResult, Error
from buck.components.node_base import NodeBase


class DeletePredefinedTimerValidator(BaseModel):
    id: int


class DeletePredefinedTimerNode(NodeBase[DeletePredefinedTimerValidator]):
    result_type = InstanceResult
    input_validator = DeletePredefinedTimerValidator

    async def resolve(self):
        result = await self.db.execute(select(models.PredefinedTimer).filter(models.PredefinedTimer.id == self.args.id))
        rows = result.first()
        if not rows:
            return InstanceResult(errors = [Error(field_name = 'id', message = 'unknown')])

        self.db.delete(rows.PredefinedTimer)

        await self.db.flush()

        return InstanceResult(id = self.args.id)
