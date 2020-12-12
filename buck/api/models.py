from graphene import Int, ObjectType, String, List, JSONString, Enum, Field
from graphene_sqlalchemy import SQLAlchemyObjectType
from pydantic import PydanticValueError

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
    path = List(String)
    type = String()
    context = JSONString()


class ValidationResult(ObjectType):
    errors = List(Error)


class InstanceResult(ValidationResult):
    id = Int()


class InvalidTimedeltaError(PydanticValueError):
    code = "timedelta"
    msg_template = ""


class TimerState(Enum):
    STARTED = 'STARTED'
    PAUSED = 'PAUSED'


class RunningTimer(ObjectType):
    id = Int()
    name = String()
    state = Field(TimerState)
    elapsed_time = Int()
    lengths = List(Int)
    remaining_times = List(Int)

    def __eq__(self, other):
        return self.__dict__ == other.__dict__

    def __repr__(self):
        return f"<RunningTimer name={self.name}, elapsed_time={self.elapsed_time}, remaining={self.remaining_times}>"
