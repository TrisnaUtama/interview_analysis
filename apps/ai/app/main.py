from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from scalar_fastapi import get_scalar_api_reference

from app.core.settings.index import settings
from app.routes import job_analysis


app = FastAPI(
    title=settings.app.APP_NAME,
    version=settings.app.VERSION,
    docs_url=settings.app.DOCS_URL,
    redoc_url=settings.app.REDOCS_URL,
    openapi_url=settings.app.OPENAPI_URL,
)

origins = [
    origin.strip()
    for origin in settings.app.CORS_ALLOW_ORIGINS.split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(job_analysis.router, prefix="/ai/v1")


@app.get("/health", status_code=status.HTTP_200_OK, summary="Health Check")
async def health_check():
    return {"status": "ok", "detail": None}


@app.get("/scalar", include_in_schema=False, response_class=HTMLResponse)
def get_scalar():
    return get_scalar_api_reference(
        title=settings.app.APP_NAME,
        openapi_url=app.openapi_url,
    )
