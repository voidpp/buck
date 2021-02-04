from buck.components.config import AppConfig
from buck.components.graphene_pydantic import object_type_from_pydantic
from buck.components.node_base import NodeBase

app_config_object_type = object_type_from_pydantic(AppConfig, ignored_fields = ["database", "redis", "logger"])


class ConfigNode(NodeBase):
    result_type = app_config_object_type

    async def resolve(self):
        return self.request_context.config.dict()
