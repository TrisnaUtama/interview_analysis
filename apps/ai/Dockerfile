FROM python:3.12-slim AS builder

WORKDIR /app

RUN pip install --no-cache-dir uv

COPY . .

RUN uv venv .venv && \
    uv pip install --no-cache -e .

FROM python:3.12-slim AS runner

WORKDIR /app

COPY --from=builder /app/.venv /app/.venv

ENV PATH="/app/.venv/bin:$PATH"
ENV VIRTUAL_ENV="/app/.venv"

RUN playwright install chromium --with-deps

COPY . .

EXPOSE 22001

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "22001"]