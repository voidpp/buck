import asyncio
import logging

from buck.components.config import load
from .controller import AutoBacklight


def main():
    config = load()
    logger = logging.getLogger(__name__)

    logger.debug("auto-rpi-backlight app started")

    app = AutoBacklight(config)

    asyncio.run(app.run())
