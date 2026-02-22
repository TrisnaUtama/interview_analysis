from celery import Celery

from app.core.settings.index import settings

celery = Celery("tasks", broker=f"{settings.redis.REDIS_URL}/0")
celery.autodiscover_tasks(["app.tasks.job_analysis"])
