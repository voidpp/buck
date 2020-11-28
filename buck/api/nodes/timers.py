from graphene import List
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from buck import models
from buck.components.node_base import NodeBase
from ..models import Timer
from ..tools import get_field_name_list, is_in_string_list


class TimersNode(NodeBase):
    result_type = List(Timer)

    async def resolve(self):
        stmt = select(models.Timer)

        field_names = get_field_name_list(self._info.field_asts[0])

        if is_in_string_list('.events.', field_names):
            stmt = stmt.options(selectinload(models.Timer.events))

        result = await self.db.execute(stmt)

        rows = result.all()

        return [r[0] for r in rows]
