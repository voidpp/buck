from invoke import task


@task
def transpile(c):
    from .assets import Frontend
    Frontend.transpile(c, False)
