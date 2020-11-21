from graphene import List
from sqlalchemy import select

from buck import models
from buck.api.models import PredefinedTimer
from buck.components.node_base import NodeBase


class PredefinedTimersNode(NodeBase):
    result_type = List(PredefinedTimer)

    async def resolve(self):
        result = await self.db.execute(select(models.PredefinedTimer))

        rows = result.all()

        return [r[0] for r in rows]
