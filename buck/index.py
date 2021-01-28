from starlette.requests import Request
from starlette.templating import Jinja2Templates

from .components.folders import Folders
from .tools import get_app_version, is_dev_mode

templates = Jinja2Templates(Folders.templates)


async def index_endpoint(request: Request):
    return templates.TemplateResponse(
        name = "index.jinja2",
        context = {
            "request": request,
            "is_dev": is_dev_mode(),
            "bundle_version": get_app_version(),
            "script_lib_files": [],
        }
    )
