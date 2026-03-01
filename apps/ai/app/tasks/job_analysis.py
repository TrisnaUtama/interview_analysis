import httpx
from asgiref.sync import async_to_sync
from celery.utils.log import get_task_logger

from app.core.celery import celery
from app.core.settings.index import settings
from app.models.jobs import AnalysisCallbackPayload

logger = get_task_logger(__name__)


@celery.task(
    name="process_job_analysis",
    bind=True,
    max_retries=3,
    default_retry_delay=30,
)
def process_job_analysis(
    self,
    job_description_id: str,
    job_id: str,
    url: str | None = None,
    raw_text: str | None = None,
):
    try:
        async_to_sync(_run)(job_description_id, url, raw_text)
    except Exception as exc:
        logger.error(f"Task failed for job_description_id={job_description_id}: {exc}")
        async_to_sync(_send_callback)(
            AnalysisCallbackPayload(
                job_description_id=job_description_id,
                raw_text="",
                parsed_text="",
                keywords=[],
                status="failed",
                error=str(exc),
            )
        )
        raise self.retry(exc=exc)


async def _run(
    job_description_id: str,
    url: str | None,
    raw_text: str | None,
) -> None:
    from app.services.job_analysis import AnalyzerService

    content = raw_text

    if url:
        from app.services.crawler import JobCrawler

        logger.info(f"Crawling URL: {url}")
        async with JobCrawler() as crawler:
            result = await crawler.crawl(url)
            content = result.markdown  # type: ignore
            logger.info(f"Crawled {len(content or '')} chars")

    if not content:
        raise ValueError("No content: url and raw_text are both empty")

    logger.info("Running AI analysis...")
    analyzer = AnalyzerService()
    analysis = await analyzer.analyze_job_description(content)

    payload = AnalysisCallbackPayload(
        job_description_id=job_description_id,
        raw_text=analysis.raw_text,
        parsed_text=analysis.parsed_text,
        keywords=analysis.keywords,
        status="completed",
    )
    await _send_callback(payload)


async def _send_callback(payload: AnalysisCallbackPayload) -> None:
    url = f"{settings.app.MAIN_API_URL}api/v1/internal/jobs/{payload.job_description_id}/analysis"

    async with httpx.AsyncClient() as client:
        response = await client.patch(
            url,
            json=payload.model_dump(),
            headers={
                "Content-Type": "application/json",
                "X-Internal-Secret": settings.app.AI_APP_KEY,
            },
            timeout=15.0,
        )
        response.raise_for_status()
        logger.info(f"Callback sent: {response.status_code}")
