import asyncio
import httpx
from celery.utils.log import get_task_logger

from app.core.celery import celery
from app.core.settings.index import settings
from app.services.resume_analysis import ResumeService

logger = get_task_logger(__name__)

INTERNAL_HEADERS = {
    "Content-Type": "application/json",
    "X-Internal-Secret": settings.app.MAIN_API_KEY,
}


@celery.task(
    bind=True,
    name="process_resume",
    max_retries=3,
    default_retry_delay=10,
)
def process_resume_task(self, resume_id: str, file_url: str):
    logger.info(f"Starting resume processing | resume_id={resume_id}")

    try:
        service = ResumeService()
        result = asyncio.get_event_loop().run_until_complete(
            service.process(resume_id, file_url)
        )

        asyncio.get_event_loop().run_until_complete(
            _callback_success(
                resume_id=resume_id,
                raw_text=result.raw_text,
                parsed_data=result.parsed_data.model_dump(),
            )
        )

        logger.info(f"Resume processed successfully | resume_id={resume_id}")

    except Exception as e:
        logger.error(f"Failed | resume_id={resume_id} | error={str(e)}")
        try:
            raise self.retry(exc=e)
        except self.MaxRetriesExceededError:
            asyncio.get_event_loop().run_until_complete(
                _callback_failed(resume_id, str(e))
            )


async def _callback_success(resume_id: str, raw_text: str, parsed_data: dict):
    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.post(
            f"{settings.app.MAIN_API_URL}api/v1/internal/resumes/{resume_id}/callback",
            json={"raw_text": raw_text, "parsed_data": parsed_data},
            headers=INTERNAL_HEADERS,
        )
        response.raise_for_status()
        logger.info(f"Callback success sent | status={response.status_code}")


async def _callback_failed(resume_id: str, error: str):
    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.post(
            f"{settings.app.MAIN_API_URL}api/v1/internal/resumes/{resume_id}/callback",
            json={"status": "failed", "error": error},
            headers=INTERNAL_HEADERS,
        )
        response.raise_for_status()
        logger.info(f"Callback failed sent | status={response.status_code}")
