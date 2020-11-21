from pydantic.main import BaseModel

from buck.api.models import InstanceResult
from buck.components.node_base import NodeBase
from buck.models import PredefinedTimer


class PredefineTimerValidator(BaseModel):
    name: str
    length: int
    group_id: int = None


class PredefineTimerNode(NodeBase[PredefineTimerValidator]):
    result_type = InstanceResult
    input_validator = PredefineTimerValidator

    async def resolve(self):
        async with self.db.begin():
            predefined_timer = PredefinedTimer(
                length = self.args.length,
                name = self.args.name,
                group_id = self.args.group_id,
            )
            self.db.add(predefined_timer)

        return InstanceResult(id = predefined_timer.id)
