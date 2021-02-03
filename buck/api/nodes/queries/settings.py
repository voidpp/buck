from buck.components.graphene_pydantic import object_type_from_pydantic
from buck.components.node_base import NodeBase
from buck.components.settings import Settings


class SettingsNode(NodeBase):
    result_type = object_type_from_pydantic(Settings)

    async def resolve(self):
        settings = await self.request_context.settings_manager.load()
        return settings.dict()
