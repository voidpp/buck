from pydantic import ValidationError as PydanticValidationError, validator
from pydantic.main import BaseModel
from pydantic.types import constr
from pytimeparse.timeparse import timeparse
from sqlalchemy import select

from buck.api.models import InstanceResult, Error, InvalidTimedeltaError
from buck.api.tools import error_list_from_pydantic_error
from buck.components.node_base import NodeBase, ValidationError
from buck.models import PredefinedTimer, Group


def update_model(model, data: dict):
    for key, value in data.items():
        setattr(model, key, value)


class SavePredefinedTimerValidator(BaseModel):
    name: constr(min_length = 3)
    length: str
    id: int = None
    group_name: str = None

    @validator('length')
    def validate_length(cls, value: str):
        if not timeparse(value):
            raise InvalidTimedeltaError()
        return value


class SavePredefinedTimerNode(NodeBase[SavePredefinedTimerValidator]):
    result_type = InstanceResult
    input_validator = SavePredefinedTimerValidator

    _existing_timer: PredefinedTimer

    async def validate(self):
        try:
            self.input_validator(**self._kwargs)
        except PydanticValidationError as e:
            raise ValidationError(InstanceResult(errors = error_list_from_pydantic_error(e)))

        if self.args.id:
            result = await self.db.execute(select(PredefinedTimer).filter(PredefinedTimer.id == self.args.id))
            row = result.first()
            if row:
                self._existing_timer = row.PredefinedTimer
            else:
                raise ValidationError(InstanceResult(errors = [Error(path = ["id"], type = "value_error.unknown")]))

        result = await self.db.execute(select(PredefinedTimer.id).filter(PredefinedTimer.name == self.args.name))

        timer = result.first()

        if timer and self.args.id != timer.id:
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
        group_id = await self.get_group_id()

        if self.args.id:
            self._existing_timer.name = self.args.name
            self._existing_timer.length = self.args.length
            self._existing_timer.group_id = group_id
            await self.db.flush()
            return InstanceResult(id = self.args.id)

        else:
            predefined_timer = PredefinedTimer(
                length = self.args.length,
                name = self.args.name,
                group_id = group_id,
            )
            self.db.add(predefined_timer)
            await self.db.flush()

            return InstanceResult(id = predefined_timer.id)
