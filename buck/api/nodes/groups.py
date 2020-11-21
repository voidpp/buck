from graphene import List
from sqlalchemy import select

from buck import models
from buck.components.node_base import NodeBase
from ..models import Group


class GroupsNode(NodeBase):
    result_type = List(Group)

    async def resolve(self):
        result = await self.db.execute(select(models.Group))

        rows = result.all()

        return [r[0] for r in rows]
