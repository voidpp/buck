import logging
from typing import List, Union

from aioredis import Channel, Redis

from buck.components.redis import create_client

logger = logging.getLogger(__name__)


class ChannelKey:
    TIMER_EVENTS = 'timer_events'
    SETTINGS = 'settings'


StringList = Union[str, List[str]]


def listize(val: StringList):
    return list(map(str, val if isinstance(val, list) else [val]))


class StringChain:

    def __init__(self, prefix: Union[str, List[str]], parent: 'StringChain' = None):
        self._parent = parent
        self._prefix = listize(prefix)

    def __call__(self, *msg) -> str:
        return ':'.join(self.prefix + list(map(str, msg)))

    @property
    def prefix(self) -> List[str]:
        res = []
        if self._parent:
            res += self._parent.prefix
        res += self._prefix
        return res


class Subscriber:

    def __init__(self, sc: StringChain, url: str):
        self._sc = StringChain("subscribe", sc)
        self._url = url

    async def _subscribe(self, channel_name: str):
        sc = StringChain(channel_name, self._sc)
        logger.debug(sc("start"))

        async with create_client(self._url) as client:
            channel: Channel = (await client.subscribe(channel_name))[0]
            async for msg in channel.iter():
                logger.debug(sc("event msg: '%s'"), msg.decode())
                yield msg

    async def timer_events(self):
        async for msg in self._subscribe(ChannelKey.TIMER_EVENTS):
            yield msg

    async def settings(self):
        async for msg in self._subscribe(ChannelKey.SETTINGS):
            yield msg


class Publisher:

    def __init__(self, sc: StringChain, url: str):
        self._sc = StringChain("publish", sc)
        self._url = url

    async def timer_events(self):
        logger.debug(self._sc(ChannelKey.TIMER_EVENTS))
        async with create_client(self._url) as client:  # type: Redis
            await client.publish(ChannelKey.TIMER_EVENTS, "update")

    async def settings(self):
        logger.debug(self._sc(ChannelKey.SETTINGS))
        async with create_client(self._url) as client:  # type: Redis
            await client.publish(ChannelKey.SETTINGS, "update")


class Broker:

    def __init__(self, url: str):
        sc = StringChain("broker")
        self._subscriber = Subscriber(sc, url)
        self._publisher = Publisher(sc, url)

    @property
    def subscribe(self) -> Subscriber:
        return self._subscriber

    @property
    def publish(self) -> Publisher:
        return self._publisher
