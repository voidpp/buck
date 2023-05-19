from invoke import task

from tasks.assets import Collection, apollo_query_typedefs

generate = Collection("generate")


@task
def build(c, mode="development"):
    from .assets import Frontend

    all(c)
    Frontend.transpile(c, False, mode)


@generate.task()
def schema(c):
    """generate schema.graphql from the graphene schema"""
    from graphql.utils import schema_printer

    from buck.api.schema import schema
    from buck.components.folders import Folders

    file_path = Folders.frontend / "schema.graphql"
    file_path.write_text(schema_printer.print_schema(schema))
    print("schema.graphql has been written")


@generate.task()
def query_type_definitions(c):
    """generate typescript definitions files for the inline graphql queries"""
    apollo_query_typedefs(c)


@generate.task()
def all(c):
    """generate all typescript stuff"""
    schema(c)
    query_type_definitions(c)
