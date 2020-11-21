from sqlalchemy.ext.asyncio import create_async_engine


class Database:

    def __init__(self, url: str):
        self._url = url
        self.engine = create_async_engine(url, echo = True)
