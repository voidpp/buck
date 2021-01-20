import os
import time

import psutil
from graphene import ObjectType, Field, String, Int, List, Float

from buck.api.types import Long
from buck.components.node_base import NodeBase
from buck.tools import get_app_version


class Memory(ObjectType):
    total = Long()
    available = Long()
    used = Long()
    percent = Float()
    free = Long()


class SystemStats(ObjectType):
    uptime = Int()
    load = List(Float)
    memory = Field(Memory)

    @staticmethod
    def resolve_uptime(root, info):
        return int(time.time() - psutil.boot_time())

    @staticmethod
    def resolve_load(root, info):
        return os.getloadavg()

    @staticmethod
    def resolve_memory(root, info):
        mem_data = psutil.virtual_memory()
        return Memory(
            total = mem_data.total,
            available = mem_data.available,
            used = mem_data.used,
            percent = mem_data.percent,
            free = mem_data.free,
        )


class DebugInfo(ObjectType):
    version = String()
    system_stats = Field(SystemStats)

    @staticmethod
    def resolve_version(root, info):
        return get_app_version()

    @staticmethod
    def resolve_system_stats(root, info):
        return SystemStats()


class DebugInfoNode(NodeBase):
    result_type = DebugInfo

    async def resolve(self):
        return DebugInfo()
