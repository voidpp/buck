from pydantic import ValidationError as PydanticValidationError, validator
from pydantic.main import BaseModel
from pydantic.types import constr
from sqlalchemy import select

from buck.api.models import InstanceResult, Error, InvalidTimedeltaError
from buck.api.tools import error_list_from_pydantic_error
from buck.components.node_base import NodeBase, ValidationError
from buck.models import PredefinedTimer, Group
from buck.tools import parse_timer_lengths, TimeLengthParseError


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
        try:
            parse_timer_lengths(value)
        except TimeLengthParseError as e:
            raise InvalidTimedeltaError(e)  # TODO: test this
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
            result = await self.session.execute(select(PredefinedTimer).filter(PredefinedTimer.id == self.args.id))
            row = result.first()
            if row:
                self._existing_timer = row.PredefinedTimer
            else:
                raise ValidationError(InstanceResult(errors = [Error(path = ["id"], type = "value_error.unknown")]))

        result = await self.session.execute(select(PredefinedTimer.id).filter(PredefinedTimer.name == self.args.name))

        timer = result.first()

        if timer and self.args.id != timer.id:
            raise ValidationError(InstanceResult(errors = [Error(path = ["name"], type = "value_error.not_unique")]))

    async def get_group_id(self):
        if not self.args.group_name:
            return None

        group_result = await self.session.execute(select(Group.id).filter(Group.name == self.args.group_name))
        if group := group_result.first():
            return group.id

        group = Group(name = self.args.group_name)
        self.session.add(group)
        await self.session.flush()
        return group.id

    async def resolve(self):
        group_id = await self.get_group_id()

        async with self.session.begin():
            if self.args.id:
                self._existing_timer.name = self.args.name
                self._existing_timer.length = self.args.length
                self._existing_timer.group_id = group_id
                await self.session.flush()
                return InstanceResult(id = self.args.id)

            else:
                predefined_timer = PredefinedTimer(
                    length = self.args.length,
                    name = self.args.name,
                    group_id = group_id,
                )
                self.session.add(predefined_timer)
                await self.session.flush()

                return InstanceResult(id = predefined_timer.id)
