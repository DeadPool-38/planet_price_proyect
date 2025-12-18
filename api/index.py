import os
import sys
import time
import traceback

from django.core.wsgi import get_wsgi_application


_ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
_BACKEND_DIR = os.path.join(_ROOT_DIR, "backend")

if _BACKEND_DIR not in sys.path:
    sys.path.insert(0, _BACKEND_DIR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "bloquesite.settings")

_django_app = get_wsgi_application()


def _log(message: str) -> None:
    print(message, flush=True)


def app(environ, start_response):
    started_at = time.time()
    method = environ.get("REQUEST_METHOD", "?")
    path = environ.get("PATH_INFO", "")
    query = environ.get("QUERY_STRING", "")

    request_line = f"{method} {path}{'?' + query if query else ''}"

    try:
        meta = {}

        def _start_response(status, headers, exc_info=None):
            meta["status"] = status
            return start_response(status, headers, exc_info)

        _log(f"[api] {request_line}")
        response = _django_app(environ, _start_response)
        elapsed_ms = int((time.time() - started_at) * 1000)
        _log(f"[api] -> {meta.get('status', '?')} {elapsed_ms}ms")
        return response
    except Exception as exc:
        elapsed_ms = int((time.time() - started_at) * 1000)
        _log(f"[api] !! exception after {elapsed_ms}ms: {exc!r}")
        _log(traceback.format_exc())
        raise
