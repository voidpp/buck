from starlette.requests import Request
from starlette.templating import Jinja2Templates

from .components.folders import Folders
from .components.injection_middleware import RequestContext
from .components.keys import Keys
from .tools import get_app_version, is_dev_mode

templates = Jinja2Templates(Folders.templates)


async def index_endpoint(request: Request):
    context: RequestContext = request.scope[Keys.HTTP_REQUEST_CONTEXT]

    return templates.TemplateResponse(
        name = "index.jinja2",
        context = {
            "request": request,
            "is_dev": is_dev_mode(),
            "bundle_version": get_app_version(),
            "script_lib_files": [],
            "claude_api_url": context.config.claude_api_url,
        }
    )
