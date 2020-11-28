from graphene import List
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from buck import models
from buck.api.models import PredefinedTimer
from buck.api.tools import get_field_name_list, is_in_string_list
from buck.components.node_base import NodeBase


class PredefinedTimersNode(NodeBase):
    result_type = List(PredefinedTimer)

    async def resolve(self):
        stmt = select(models.PredefinedTimer)

        field_names = get_field_name_list(self._info.field_asts[0])

        if is_in_string_list('.group.', field_names):
            stmt = stmt.options(selectinload(models.PredefinedTimer.group))

        result = await self.db.execute(stmt)

        rows = result.all()

        return [r[0] for r in rows]
