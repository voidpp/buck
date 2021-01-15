from graphene import List, ObjectType, String

from buck.components.node_base import NodeBase


class Sound(ObjectType):
    file_name = String()
    title = String()


class SoundsNode(NodeBase):
    result_type = List(Sound)

    async def resolve(self):
        sounds = self.request_context.config.sounds
        return [Sound(file_name = s.filename, title = s.title) for s in sounds]
