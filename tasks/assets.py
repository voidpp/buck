from invoke import Context, Collection as CollectionBase, Task

from buck.components.folders import Folders


class Frontend:

    @staticmethod
    def transpile(context: Context, watch: bool):
        command = ['npx', 'webpack']

        if watch:
            command.append('--watch')

        command.append('--output-path ./buck/static')

        context.run(' '.join(command))


class Collection(CollectionBase):

    def task(self, *args, **kwargs):
        def decor(func):
            self.add_task(Task(func, *args, **kwargs))
            return func

        return decor


def apollo_query_typedefs(context: Context, watch: bool = False):
    # well. the working directory cannot be set to 'apollo codegen:generate' so we need to cd to it (globalTypes.ts must be inside the
    # assets/ts folder to be importable)
    from pathlib import Path
    import shutil

    for path in Path().rglob('__generated__'):
        shutil.rmtree(path)

    print("__generated__ directories deleted")

    command = [
        "npx apollo codegen:generate",
        "--target typescript",
        f"--localSchemaFile=schema.graphql",
        "--includes=./**/*.ts*",
        "--tagName=gql",
    ]

    if watch:
        command.append('--watch')

    with context.cd(Folders.frontend.__str__()):
        context.run(' '.join(command))
