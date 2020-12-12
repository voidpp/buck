import logging
from typing import List, Union

from aioredis import Channel
from buck.components.redis import create_client
from redis import Redis

logger = logging.getLogger(__name__)

CHANNEL_KEY_TIMER_EVENTS = 'timer_events'

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
        async for msg in self._subscribe(CHANNEL_KEY_TIMER_EVENTS):
            yield msg


class Publisher:

    def __init__(self, sc: StringChain, url: str):
        self._sc = StringChain("publish", sc)
        self._redis = Redis.from_url(url)

    def timer_events(self):
        logger.debug(self._sc(CHANNEL_KEY_TIMER_EVENTS))
        self._redis.publish(CHANNEL_KEY_TIMER_EVENTS, "update")


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
