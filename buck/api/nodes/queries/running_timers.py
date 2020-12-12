from graphene import List

from buck.api.models import RunningTimer
from buck.api.running_timers import RunningTimersFetcher
from buck.components.node_base import NodeBase


class RunningTimersNode(NodeBase):
    result_type = List(RunningTimer)

    async def resolve(self):
        fetcher = RunningTimersFetcher(self.session)
        return await fetcher.fetch()
