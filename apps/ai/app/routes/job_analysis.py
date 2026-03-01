from celery.result import AsyncResult
from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel
from typing import Optional

from app.core.celery import celery
from app.core.settings.index import settings
from app.tasks.job_analysis import process_job_analysis

router = APIRouter(prefix="/jobs", tags=["Jobs"])


def verify_internal_secret(request: Request) -> None:
    secret = request.headers.get("X-Internal-Secret", "")
    if not secret or secret != settings.app.AI_APP_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized"
        )


class ProcessJobRequest(BaseModel):
    job_description_id: str
    job_id: str
    source_type: str
    source_url: Optional[str] = None
    raw_text: Optional[str] = None


@router.post("/process", status_code=status.HTTP_202_ACCEPTED)
async def process_job(
    req: ProcessJobRequest,
    _: None = Depends(verify_internal_secret),
):
    if req.source_type == "manual" and not req.raw_text:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="raw_text required for manual source_type",
        )

    if req.source_type == "url" and not req.source_url:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="source_url required for url source_type",
        )

    task = process_job_analysis.delay(  # type: ignore
        job_description_id=req.job_description_id,
        job_id=req.job_id,
        url=req.source_url,
        raw_text=req.raw_text,
    )

    return {
        "message": "Job analysis queued",
        "task_id": task.id,
        "job_description_id": req.job_description_id,
    }


@router.get("/task/{task_id}", status_code=status.HTTP_200_OK)
async def get_task_status(
    task_id: str,
    _: None = Depends(verify_internal_secret),
):
    result = AsyncResult(task_id, app=celery)

    return {
        "task_id": task_id,
        "status": result.status,
        "result": result.result if result.ready() else None,
    }
