import os
from time import time
from importlib.metadata import version

from starlette.requests import Request
from starlette.templating import Jinja2Templates

from .components.folders import Folders
from .components.injection_middleware import RequestContext
from .components.keys import Keys

templates = Jinja2Templates(Folders.templates)


async def index_endpoint(request: Request):
    context: RequestContext = request.scope[Keys.HTTP_REQUEST_CONTEXT]
    is_dev_mode = bool(os.environ.get(Keys.DEV_MODE, 0))
    version_str = time() if is_dev_mode else version("buck")

    return templates.TemplateResponse(
        name = "index.jinja2",
        context = {
            "request": request,
            "is_dev": is_dev_mode,
            "bundle_version": version_str,
            "script_lib_files": [],
            "claude_api_url": context.config.claude_api_url,
        }
    )
