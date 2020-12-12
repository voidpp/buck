import json
import logging
from enum import Enum

from celery import Task
from redis import Redis
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from buck.celery.factory import create_celery_app
from buck.celery.tasks import alarm
from buck.components.config import AppConfig
from buck.models import TimerEvent, TimerEventType
from buck.tools import calc_countdowns, parse_timer_lengths, calc_elapsed_time

logger = logging.getLogger(__name__)


class Wrapper:
    def __init__(self, func: callable):
        self.func = func

    @property
    def name(self):
        return self.func.__name__


class Tasks(Enum):
    ALARM = Wrapper(alarm)


def create_alarm_key(timer_id: int) -> str:
    return f"buck_timer_{timer_id}"


class Scheduler:
    def __init__(self, config: AppConfig):
        self._config = config
        self._celery = create_celery_app(config)

        for wrapper in Tasks:
            logger.info("Registering tasks to celery: %s", wrapper.value.name)
            self._celery.task(wrapper.value.func, name = wrapper.value.name)

    @property
    def celery_app(self):
        return self._celery

    def _get_task(self, task: Tasks) -> Task:
        return self._celery.tasks[task.value.name]

    def create_redis(self):
        return Redis.from_url(self._config.redis)

    async def set_alarm(self, timer_id: int, timer_length: str, db: AsyncSession):
        task_func = self._get_task(Tasks.ALARM)

        query = select(TimerEvent). \
            filter(TimerEvent.timer_id == timer_id). \
            filter(TimerEvent.type.in_([TimerEventType.START, TimerEventType.PAUSE]))

        rows = await db.execute(query)

        countdowns = calc_countdowns(parse_timer_lengths(timer_length), calc_elapsed_time([r.TimerEvent for r in rows]))

        logger.debug("scheduling alarm for timer %s in %s", timer_id, countdowns)

        redis = self.create_redis()
        task_id_list = []

        for idx, countdown in enumerate(countdowns, 1):
            args = [timer_id, str(self._config.database), self._config.redis, len(countdowns) == idx]
            task = task_func.apply_async(args, countdown = countdown)
            task_id_list.append(task.task_id)

        redis.set(create_alarm_key(timer_id), json.dumps(task_id_list))

    def remove_alarm(self, timer_id: int):

        redis = self.create_redis()

        if raw_task_list := redis.get(create_alarm_key(timer_id)):
            for task_id in json.loads(raw_task_list):
                self._celery.control.revoke(task_id)
