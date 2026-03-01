from fastapi import APIRouter, Header, HTTPException, status
from pydantic import BaseModel

from app.core.settings.index import settings
from app.tasks.resume_analysis import process_resume_task

router = APIRouter(prefix="/resumes", tags=["Resumes"])


class AnalyzeResumeRequest(BaseModel):
    resume_id: str
    file_path: str


@router.post("/analyze")
def analyze_resume(
    payload: AnalyzeResumeRequest,
    x_internal_secret: str = Header(default=None),
):
    if x_internal_secret != settings.app.APP_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid internal secret"
        )

    process_resume_task.delay(payload.resume_id, payload.file_path)  # type: ignore

    return {"status": "processing", "resume_id": payload.resume_id}
