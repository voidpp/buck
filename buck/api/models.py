from enum import Enum

from graphene import Int, ObjectType, String, List
from graphene_sqlalchemy import SQLAlchemyObjectType

from buck import models


class Timer(SQLAlchemyObjectType):
    class Meta:
        model = models.Timer

    id = Int(required = True)


class TimerEvent(SQLAlchemyObjectType):
    class Meta:
        model = models.TimerEvent

    id = Int(required = True)


class PredefinedTimer(SQLAlchemyObjectType):
    class Meta:
        model = models.PredefinedTimer

    id = Int(required = True)


class Group(SQLAlchemyObjectType):
    class Meta:
        model = models.Group

    id = Int(required = True)


class Error(ObjectType):
    field_name = String()
    message = String()


class ValidationResult(ObjectType):
    errors = List(Error)


class InstanceResult(ValidationResult):
    id = Int()


class TimerOperation(Enum):
    PAUSE = 'PAUSE'
    UNPAUSE = 'UNPAUSE'
    STOP = 'STOP'
