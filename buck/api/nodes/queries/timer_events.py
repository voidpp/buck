from graphene import List
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from buck import models
from buck.components.node_base import NodeBase
from buck.api.models import TimerEvent
from buck.api.tools import get_field_name_list, is_in_string_list


class TimerEventsNode(NodeBase):
    result_type = List(TimerEvent)

    async def resolve(self):
        stmt = select(models.TimerEvent)

        field_names = get_field_name_list(self._info.field_asts[0])

        if is_in_string_list('.timer.', field_names):
            stmt = stmt.options(selectinload(models.TimerEvent.timer))

        result = await self.session.execute(stmt)

        rows = result.all()

        return [r[0] for r in rows]
