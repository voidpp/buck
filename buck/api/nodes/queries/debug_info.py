import os
import time

import psutil
from gpiozero import CPUTemperature, BadPinFactory
from graphene import ObjectType, Field, String, Int, List, Float, Boolean
from graphql import ResolveInfo

from buck.api.types import Long
from buck.celery.scheduler import Tasks
from buck.celery.tools import get_task_info_list
from buck.components.node_base import NodeBase, get_request_context
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
    cpu_temp = Float()

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

    @staticmethod
    def resolve_cpu_temp(root, info):
        try:
            cpu_temp = CPUTemperature()
        except BadPinFactory:
            return None
        return cpu_temp.cpu


class CeleryTask(ObjectType):
    eta = String()
    is_revoked = Boolean()


class AlarmTask(CeleryTask):
    timer_id = Int()
    is_last = Boolean()


class CeleryTaskList(ObjectType):
    alarm = List(AlarmTask)


class DebugInfo(ObjectType):
    version = String()
    system_stats = Field(SystemStats)
    celery_tasks = Field(CeleryTaskList)

    @staticmethod
    def resolve_version(root, info):
        return get_app_version()

    @staticmethod
    def resolve_system_stats(root, info):
        return SystemStats()

    @staticmethod
    def resolve_celery_tasks(root, info: ResolveInfo):
        req_context = get_request_context(info)
        task_list = get_task_info_list(req_context.scheduler.celery_app)
        alarm_tasks = []
        for task in task_list:
            if task.name == Tasks.ALARM.name.lower():
                alarm_tasks.append(AlarmTask(
                    timer_id = task.args[0],
                    is_last = task.args[3],
                    eta = task.eta,
                    is_revoked = task.is_revoked,
                ))
        return CeleryTaskList(alarm = alarm_tasks)


class DebugInfoNode(NodeBase):
    result_type = DebugInfo

    async def resolve(self):
        return DebugInfo()
