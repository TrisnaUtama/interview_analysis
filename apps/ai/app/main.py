from fastapi import FastAPI
from app.routers import health

app = FastAPI(
    title="AI Interview - AI Service",
    version="1.0.0",
)

app.include_router(health.router, tags=["Health"])
