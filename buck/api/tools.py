from graphql.language.ast import Field
from pydantic import ValidationError

from buck.api.models import Error


def error_list_from_pydantic_error(error: ValidationError) -> list[Error]:
    res = []
    for err in error.errors():
        res.append(Error(
            path = err['loc'],
            type = err['type'],
            context = err.get('ctx'),
        ))

    return res


def get_field_name_list(field: Field) -> list[str]:
    names = []

    for sub_field in field.selection_set.selections:  # type: Field
        if sub_field.selection_set:
            names += get_field_name_list(sub_field)
        else:
            names.append(sub_field.name.value)

    return [field.name.value + '.' + n for n in names]


def is_in_string_list(search: str, data: list[str]) -> bool:
    return len([i for i in data if search in i]) > 0
