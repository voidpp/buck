from time import time

from starlette.requests import Request
from starlette.templating import Jinja2Templates

from .components.folders import Folders
from .components.injection_middleware import RequestContext
from .components.keys import Keys

templates = Jinja2Templates(Folders.templates)


async def index_endpoint(request: Request):
    context: RequestContext = request.scope[Keys.HTTP_REQUEST_CONTEXT]

    return templates.TemplateResponse(
        name = "index.jinja2",
        context = {
            "request": request,
            "is_dev": True,
            "bundle_version": time(),
            "script_lib_files": [],
            "claude_api_url": context.config.claude_api_url,
        }
    )
