from graphene import Scalar


def coerce_long(value):
    try:
        num = int(value)
    except ValueError:
        try:
            num = int(float(value))
        except ValueError:
            return None
    return num


class Long(Scalar):
    serialize = coerce_long
    parse_value = coerce_long

    @staticmethod
    def parse_literal(node):
        return node.value
