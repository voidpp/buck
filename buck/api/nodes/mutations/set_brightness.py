from graphene import Boolean
from pydantic import BaseModel
from rpi_backlight import Backlight

from buck.components.node_base import NodeBase


class SetBrightnessValidator(BaseModel):
    brightness: int
    fade_duration: float = 0


class SetBrightnessNode(NodeBase[SetBrightnessValidator]):
    result_type = Boolean
    input_validator = SetBrightnessValidator

    async def resolve(self):
        sysfs_path = self.request_context.config.backlight_sysfs_path

        if not sysfs_path:
            return False

        backlight = Backlight(sysfs_path)

        with backlight.fade(self.args.fade_duration or 0):
            backlight.brightness = self.args.brightness

        return True
