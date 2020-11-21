from time import time

from starlette.requests import Request
from starlette.templating import Jinja2Templates

from .components.folders import Folders

templates = Jinja2Templates(Folders.templates)


async def index_endpoint(request: Request):
    return templates.TemplateResponse(
        name = "index.jinja2",
        context = {
            "request": request,
            "is_dev": True,
            "bundle_version": time(),
            "script_lib_files": [],
        }
    )
