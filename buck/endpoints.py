from starlette.requests import Request
from starlette.responses import RedirectResponse
from starlette.templating import Jinja2Templates

from .components.folders import Folders
from .tools import get_app_version, is_dev_mode

templates = Jinja2Templates(Folders.templates)


def render_template(request: Request, name: str):
    return templates.TemplateResponse(
        name = name,
        context = {
            "request": request,
            "is_dev": is_dev_mode(),
            "app_version": get_app_version(),
        }
    )


async def rpi_kiosk(request: Request):
    return render_template(request, "rpi-kiosk.jinja2")


async def admin(request: Request):
    return render_template(request, "admin.jinja2")


async def index(request: Request):
    return RedirectResponse(url='/admin')
