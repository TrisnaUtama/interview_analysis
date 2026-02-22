FROM mcr.microsoft.com/playwright/python:v1.42.0-jammy

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    libxml2-dev \
    libxslt1-dev \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir uv

COPY pyproject.toml uv.lock* ./

RUN uv venv .venv

ENV PATH="/app/.venv/bin:$PATH"
ENV VIRTUAL_ENV="/app/.venv"

RUN uv pip install --no-cache .

COPY . .

EXPOSE 22001

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "22001"]