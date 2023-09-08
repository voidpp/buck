from graphene import Field, List, ObjectType

from buck.api import models
from buck.api.nodes.subscriptions.running_timers import resolve_running_timers
from buck.api.nodes.subscriptions.timer_event import resolve_timer_event


class Subscription(ObjectType):
    timer_event = Field(models.TimerEvent, resolver=resolve_timer_event)
    running_timers = List(models.RunningTimer, resolver=resolve_running_timers)
