FROM python:3.12-slim

WORKDIR /app

RUN pip install --no-cache-dir uv

COPY pyproject.toml uv.lock* ./

RUN uv venv .venv

ENV PATH="/app/.venv/bin:$PATH"
ENV VIRTUAL_ENV="/app/.venv"

RUN uv sync --no-cache

RUN playwright install chromium --with-deps

COPY . .

EXPOSE 22001

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "22001"]