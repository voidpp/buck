import asyncio

from invoke import task

from buck.components.config import load
from buck.components.database import Database
from buck.models import TimerEvent


@task
def clean(c):
    """remove recursively generated and cache files (*.pyc)"""
    from pathlib import Path

    for path in Path().rglob("*.pyc"):
        path.unlink()

    print("*.pyc files deleted")


@task
def build(c):
    """Build a production version of frontend and python package"""
    from tasks.typescript import build

    build(c, "production")
    c.run("poetry build")


@task
def truncate_timer_events(c):
    asyncio.run(_truncate_timer_events())


async def _truncate_timer_events():
    config = load()
    db = Database(str(config.database))
    async with db.session() as session:
        await session.execute(f"truncate table {TimerEvent.__tablename__};")
        await session.commit()
