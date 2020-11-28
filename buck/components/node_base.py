from abc import ABC, abstractmethod
from typing import Type, TypeVar, Generic

from graphene import Field
from graphene.utils.orderedtype import OrderedType
from graphql import ResolveInfo
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from .graphene_pydantic import create_class_property_dict
from .keys import Keys

InputType = TypeVar('InputType', BaseModel, object)


class NoArgumentsDefinedError(Exception):
    pass


class ValidationError(Exception):
    def __init__(self, result):
        super().__init__("ValidationError")
        self.result = result


class NodeBase(ABC, Generic[InputType]):
    result_type: OrderedType
    input_validator: Type[BaseModel] = None
    description: str = None

    _info: ResolveInfo
    _args: InputType = None

    def __init__(self, root, info, **kwargs):
        self._root = root
        self._info = info

        self._kwargs = kwargs

    @abstractmethod
    async def resolve(self):
        pass

    @property
    def db(self) -> AsyncSession:
        return self._info.context[Keys.API_CONTEXT_SESSION]

    @property
    def args(self) -> InputType:
        if not self.input_validator:
            raise NoArgumentsDefinedError
        if self._args:
            return self._args
        self._args = self.input_validator.construct(**self._kwargs)
        return self._args

    async def validate(self):
        pass

    @classmethod
    async def _resolve(cls, root, info, **kwargs):
        obj = cls(root, info, **kwargs)

        try:
            await obj.validate()
        except ValidationError as e:
            return e.result

        return await obj.resolve()

    @classmethod
    def field(cls) -> Field:
        return Field(
            type = cls.result_type,
            args = create_class_property_dict(cls.input_validator) if cls.input_validator else None,
            resolver = cls._resolve,
            description = cls.description,
        )
