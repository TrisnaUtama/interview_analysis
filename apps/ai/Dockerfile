FROM mcr.microsoft.com/playwright/python:v1.42.0-jammy

WORKDIR /app

RUN pip install --no-cache-dir uv

COPY pyproject.toml uv.lock* ./

RUN uv venv .venv && \
    uv pip install --no-cache .

COPY . .

ENV PATH="/app/.venv/bin:$PATH"
ENV VIRTUAL_ENV="/app/.venv"

EXPOSE 22001

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "22001"]
