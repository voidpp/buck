import json

from aioredis import Redis
from pydantic import BaseModel

from buck.components.broker import Broker
from buck.components.redis import create_client


class Settings(BaseModel):
    """
        config: doesnt change when the app is running
        settings: the user can change it (eg via web)
    """

    is_auto_backlight_enabled: bool = True


SETTINGS_CACHE_KEY = "buck_settings"


class SettingsManager:
    def __init__(self, redis_url: str, broker: Broker):
        self._redis_url = redis_url
        self._broker = broker

    async def load(self) -> Settings:
        async with create_client(self._redis_url) as client:  # type: Redis
            raw_data = await client.get(SETTINGS_CACHE_KEY)
            return Settings(**(json.loads(raw_data) if raw_data else {}))

    async def save(self, data: Settings):
        async with create_client(self._redis_url) as client:  # type: Redis
            await client.set(SETTINGS_CACHE_KEY, json.dumps(data.dict()))
            await self._broker.publish.settings()
