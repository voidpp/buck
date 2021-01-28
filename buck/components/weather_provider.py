from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Type, TypeVar, Generic

from httpx import AsyncClient
from pydantic import BaseModel

from .config import Weather


@dataclass
class CurrentWeather:
    temperature: float
    conditions_image_url: str


ConfigType = TypeVar('ConfigType', BaseModel, object)


class WeatherProviderBase(ABC, Generic[ConfigType]):
    name: str
    config_validator: Type[BaseModel]
    config: ConfigType

    def __init__(self, config_data: dict):
        self.config = self.config_validator(**config_data)

    @abstractmethod
    async def get_current_weather(self, city: str) -> CurrentWeather:
        pass


class ClaudeWeatherConfig(BaseModel):
    api_url: str


class ClaudeWeatherProvider(WeatherProviderBase[ClaudeWeatherConfig]):
    name = "claude"
    config_validator = ClaudeWeatherConfig

    async def get_current_weather(self, city: str) -> CurrentWeather:
        async with AsyncClient() as http_client:
            resp = await http_client.get(f"{self.config.api_url}idokep/current/{city}")
            data = resp.json()
            return CurrentWeather(
                data['value'],
                data['img'],
            )


class OpenWeatherMapConfig(BaseModel):
    api_key: str


class OpenWeatherMapProvider(WeatherProviderBase[OpenWeatherMapConfig]):
    name = "open_weather_map"
    config_validator = OpenWeatherMapConfig

    async def get_current_weather(self, city: str) -> CurrentWeather:
        url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&APPID={self.config.api_key}&units=metric"
        async with AsyncClient() as http_client:
            resp = await http_client.get(url)
            data = resp.json()
            icon = data['weather'][0]['icon']
            return CurrentWeather(
                data['main']['temp'],
                f"http://openweathermap.org/img/wn/{icon}@2x.png",
            )


providers: list[Type[WeatherProviderBase]] = [
    ClaudeWeatherProvider,
    OpenWeatherMapProvider,
]


def create_weather_provider(config: Weather) -> WeatherProviderBase:
    for provider_cls in providers:
        if provider_cls.name == config.type:
            return provider_cls(config.config)
