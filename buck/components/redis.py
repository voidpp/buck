from asyncio import CancelledError
from contextlib import asynccontextmanager

from aioredis import Redis, create_redis_pool


@asynccontextmanager
async def create_client(url: str) -> Redis:
    client_ = await create_redis_pool(url)
    try:
        yield client_
    except CancelledError:
        pass
    finally:
        client_.close()
        await client_.wait_closed()
