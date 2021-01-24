from enum import Enum

from graphene import List
from pydantic.main import BaseModel
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload


from buck import models
from buck.api.models import PredefinedTimer
from buck.api.tools import get_field_name_list, is_in_string_list
from buck.components.node_base import NodeBase


class PredefinedTimersSort(Enum):
    NAME = "name"
    LAST_USED = "last_used"


class PredefinedTimersValidator(BaseModel):
    sort_by: PredefinedTimersSort = None


class PredefinedTimersNode(NodeBase[PredefinedTimersValidator]):
    result_type = List(PredefinedTimer)
    input_validator = PredefinedTimersValidator

    async def resolve(self):
        stmt = select(models.PredefinedTimer)

        field_names = get_field_name_list(self._info.field_asts[0])

        if is_in_string_list('.group.', field_names):
            stmt = stmt.options(selectinload(models.PredefinedTimer.group))

        if self.args.sort_by == PredefinedTimersSort.NAME.value:
            stmt = stmt.order_by(models.PredefinedTimer.name)

        result = await self.session.execute(stmt)

        rows = result.all()

        timers: list[models.PredefinedTimer] = [r[0] for r in rows]

        if self.args.sort_by == PredefinedTimersSort.LAST_USED.value:
            await self.sort_timers_by_usage(timers)

        return timers

    async def sort_timers_by_usage(self, timers: list[models.PredefinedTimer]):

        stmt = select(func.max(models.Timer.id), models.Timer.predefined_timer_id). \
            filter(models.Timer.predefined_timer_id.in_([t.id for t in timers])). \
            group_by(models.Timer.predefined_timer_id)

        result = await self.session.execute(stmt)

        order_data = {}

        for row in result.all():
            (timer_id, predefined_timer_id) = row
            order_data[predefined_timer_id] = timer_id

        timers.sort(key = lambda t: order_data.get(t.id, 0), reverse = True)
