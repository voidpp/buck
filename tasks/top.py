from invoke import task


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
