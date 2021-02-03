from graphene import Boolean

from buck.components.node_base import NodeBase
from buck.components.settings import Settings


class SaveSettingsNode(NodeBase[Settings]):
    input_validator = Settings
    result_type = Boolean

    async def resolve(self):
        settings = await self.request_context.settings_manager.load()
        data = settings.dict()
        data.update(self.args.dict())
        await self.request_context.settings_manager.save(Settings(**data))
        return True
