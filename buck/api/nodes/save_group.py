from pydantic.main import BaseModel
from sqlalchemy import select

from buck import models
from buck.api.models import InstanceResult, Error
from buck.components.node_base import NodeBase


class SaveGroupValidator(BaseModel):
    name: str
    id: int = None


class SaveGroupNode(NodeBase[SaveGroupValidator]):
    result_type = InstanceResult
    input_validator = SaveGroupValidator

    async def resolve(self):

        async with self.db.begin():
            if self.args.id:
                result = await self.db.execute(select(models.Group).filter(models.Group.id == self.args.id))
                rows = result.first()
                if rows:
                    group = rows.Group
                    group.name = self.args.name
                else:
                    return InstanceResult(errors = [Error(field_name = 'id', message = 'unknown')])
            else:
                group = models.Group(name = self.args.name)
                self.db.add(group)

            await self.db.flush()

            return InstanceResult(id = group.id)
