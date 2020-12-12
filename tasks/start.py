from invoke import Collection

from tasks.assets import Frontend, MultiprocessTask

mp_tasks = MultiprocessTask('all')


@mp_tasks.add
def uvicorn(c):
    c.run(f"uvicorn buck.app:app --host 0.0.0.0 --port 9000 --reload")


@mp_tasks.add
def webpack(c):
    Frontend.transpile(c, True)


@mp_tasks.add
def celery(c):
    c.run("celery -A buck.celery.app worker --loglevel=info --statedb=./celery.state")


start_collection = Collection('start')
mp_tasks.add_to_collection(start_collection)
