from pydantic import ValidationError as PydanticValidationError
from pydantic.main import BaseModel
from pydantic.types import constr, conint
from sqlalchemy import select

from buck.api.models import InstanceResult, Error
from buck.api.tools import error_list_from_pydantic_error
from buck.components.node_base import NodeBase, ValidationError
from buck.models import PredefinedTimer, Group


class PredefineTimerValidator(BaseModel):
    name: constr(min_length = 3)
    length: conint(gt = 5)
    group_name: str = None


class PredefineTimerNode(NodeBase[PredefineTimerValidator]):
    result_type = InstanceResult
    input_validator = PredefineTimerValidator

    async def validate(self):
        try:
            self.input_validator(**self._kwargs)
        except PydanticValidationError as e:
            raise ValidationError(InstanceResult(errors = error_list_from_pydantic_error(e)))

        result = await self.db.execute(select(PredefinedTimer.id).filter(PredefinedTimer.name == self.args.name))
        if result.first():
            raise ValidationError(InstanceResult(errors = [Error(path = ["name"], type = "value_error.not_unique")]))

    async def get_group_id(self):
        if not self.args.group_name:
            return None

        group_result = await self.db.execute(select(Group.id).filter(Group.name == self.args.group_name))
        if group := group_result.first():
            return group.id

        group = Group(name = self.args.group_name)
        self.db.add(group)
        await self.db.flush()
        return group.id

    async def resolve(self):

        predefined_timer = PredefinedTimer(
            length = self.args.length,
            name = self.args.name,
            group_id = await self.get_group_id(),
        )
        self.db.add(predefined_timer)
        await self.db.flush()

        return InstanceResult(id = predefined_timer.id)
