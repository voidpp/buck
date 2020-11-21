from invoke import task

from tasks.assets import Frontend


@task
def uvicorn(c):
    c.run(f"uvicorn buck.app:app --host 127.0.0.1 --port 9000 --reload")


@task
def webpack(c):
    Frontend.transpile(c, True)
