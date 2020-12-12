from buck.celery.scheduler import Scheduler
from buck.components.config import load

config = load()

scheduler = Scheduler(config)

app = scheduler.celery_app
