from pydantic.main import BaseModel
from sqlalchemy import select

from buck import models
from buck.api.models import InstanceResult, Error
from buck.components.node_base import NodeBase


class DeleteGroupValidator(BaseModel):
    id: int


class DeleteGroupNode(NodeBase[DeleteGroupValidator]):
    result_type = InstanceResult
    input_validator = DeleteGroupValidator

    async def resolve(self):
        async with self.session.begin():
            result = await self.session.execute(select(models.Group).filter(models.Group.id == self.args.id))
            rows = result.first()
            if not rows:
                return InstanceResult(errors = [Error(field_name = 'id', message = 'unknown')])

            self.session.delete(rows.Group)

            await self.session.flush()

            return InstanceResult(id = self.args.id)
