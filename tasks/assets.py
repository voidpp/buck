import multiprocessing
from typing import Callable

from invoke import Collection as CollectionBase
from invoke import Context, Task

from buck.components.folders import Folders


class Frontend:
    @staticmethod
    def transpile(context: Context, watch: bool, mode="development"):
        command = ["npx", "webpack"]

        if watch:
            command.append("--watch")

        command.append("--output-path ./buck/static/js")

        command.append(f"--mode {mode}")

        context.run(" ".join(command))


class Collection(CollectionBase):
    def task(self, *args, **kwargs):
        def decor(func):
            self.add_task(Task(func, *args, **kwargs))
            return func

        return decor


def apollo_query_typedefs(context: Context, watch: bool = False):
    context.run("npx graphql-codegen")


class MultiprocessTask(Task):
    _tasks: list[Callable]

    def __init__(self, name: str):
        self._tasks = []
        super().__init__(self._handler, name=name)

    def add(self, func):
        self._tasks.append(func)
        return func

    def add_to_collection(self, coll: Collection):
        for task in self._tasks:
            coll.add_task(Task(task))
        coll.add_task(self)

    def _handler(self, c, **kwargs):
        for task in self._tasks:
            name = task.__name__
            if kwargs.get(name):
                multiprocessing.Process(target=task, args=(c,)).start()

    def argspec(self, body):
        spec_dict = {}

        for task in self._tasks:
            spec_dict[task.__name__] = True

        return list(spec_dict.keys()), spec_dict
