from graphene import List
from graphql.language.ast import Field
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from buck import models
from buck.components.node_base import NodeBase
from ..models import Timer


def get_field_name_list(field: Field) -> list[str]:
    names = []

    for sub_field in field.selection_set.selections:  # type: Field
        if sub_field.selection_set:
            names += get_field_name_list(sub_field)
        else:
            names.append(sub_field.name.value)

    return [field.name.value + '.' + n for n in names]


def is_in_string_list(search: str, data: list[str]) -> bool:
    return len([i for i in data if search in i]) > 0


class TimersNode(NodeBase):
    result_type = List(Timer)

    async def resolve(self):
        field_names = get_field_name_list(self._info.field_asts[0])

        stmt = select(models.Timer)

        if is_in_string_list('.events.', field_names):
            stmt = stmt.options(selectinload(models.Timer.events))

        result = await self.db.execute(stmt)

        rows = result.all()

        return [r[0] for r in rows]
