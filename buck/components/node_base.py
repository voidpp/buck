from abc import ABC, abstractmethod
from typing import Type, TypeVar, Generic

from graphene import Field
from graphene.utils.orderedtype import OrderedType
from graphql import ResolveInfo
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from .graphene_pydantic import create_class_property_dict
from .injection_middleware import RequestContext
from .keys import Keys
from ..celery.scheduler import Scheduler

InputType = TypeVar('InputType', BaseModel, object)


class NoArgumentsDefinedError(Exception):
    pass


class ValidationError(Exception):
    def __init__(self, result):
        super().__init__("ValidationError")
        self.result = result


def get_request_context(info: ResolveInfo) -> RequestContext:
    return info.context["request"].scope[Keys.HTTP_REQUEST_CONTEXT]


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
    def session(self) -> AsyncSession:
        return self._info.context[Keys.API_CONTEXT_SESSION]

    @property
    def scheduler(self) -> Scheduler:
        return self.request_context.scheduler

    @property
    def request_context(self) -> RequestContext:
        return get_request_context(self._info)

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
