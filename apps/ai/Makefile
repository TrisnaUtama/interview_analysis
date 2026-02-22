dev:
	uv run uvicorn app.main:app --reload --port 22001 --host 0.0.0.0

celery:
	uv run celery -A app.core.celery worker -c 4 -l info