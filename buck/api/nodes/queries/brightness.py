from graphene import Int
from rpi_backlight import Backlight

from buck.components.node_base import NodeBase


class BrightnessNode(NodeBase):
    result_type = Int

    async def resolve(self):
        sysfs_path = self.request_context.config.backlight_sysfs_path

        if not sysfs_path:
            return 0

        backlight = Backlight(sysfs_path)
        return backlight.brightness
