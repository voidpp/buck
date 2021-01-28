from graphene import ObjectType, Field, Float, String
from pydantic import BaseModel

from buck.components.node_base import NodeBase


class CurrentWeather(ObjectType):
    temperature = Float()
    conditions_image_url = String()


class WeatherNodeValidator(BaseModel):
    city: str


class WeatherNode(NodeBase[WeatherNodeValidator]):
    result_type = CurrentWeather
    input_validator = WeatherNodeValidator

    async def resolve(self):
        weather_data = await self.request_context.weather_provider.get_current_weather(self.args.city)
        return weather_data
