from dataclasses import dataclass

from celery import Celery
from celery.app.control import Inspect


@dataclass
class CeleryTaskInfo:
    name: str
    args: list
    eta: str
    is_revoked: bool


def get_task_info_list(celery_app: Celery) -> list[CeleryTaskInfo]:
    inspector = Inspect(app = celery_app)

    scheduled_tasks = inspector.scheduled()
    revoked_tasks = inspector.revoked()

    if scheduled_tasks is None:
        print('Worker not found. Exiting.')
        return []

    res = []

    for host, tasks in scheduled_tasks.items():
        revoked = revoked_tasks.get(host, [])
        for task_data in tasks:
            is_revoked = task_data['request']['id'] in revoked

            res.append(CeleryTaskInfo(
                task_data['request']['name'],
                task_data['request']['args'],
                task_data['eta'],
                is_revoked,
            ))

    return res
