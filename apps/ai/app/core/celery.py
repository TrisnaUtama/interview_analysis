from celery import Celery
from app.core.settings.index import settings

celery = Celery(
    "tasks",
    broker=f"{settings.redis.REDIS_URL}/0",
    backend=f"{settings.redis.REDIS_URL}/1",
)

celery.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Jakarta",
    enable_utc=True,
    broker_transport_options={"visibility_timeout": 3600},
    task_always_eager=False,
    worker_prefetch_multiplier=1,
)

celery.autodiscover_tasks(["app.tasks.job_analysis", "app.tasks.resume_analysis"])
