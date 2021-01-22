from invoke import task

from buck.celery.tools import get_task_info_list


@task
def show_scheduled_tasks(c, hide_revoked = False):
    from buck.celery.app import scheduler
    tasks = get_task_info_list(scheduler.celery_app)
    for ctask in tasks:
        print(ctask)

