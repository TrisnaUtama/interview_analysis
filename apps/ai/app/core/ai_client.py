from litellm import AsyncOpenAI
from app.core.settings.index import settings


def create_ai_client() -> AsyncOpenAI:
    return AsyncOpenAI(
        api_key=settings.ai.LITELLM_MASTER_KEY,
        base_url=settings.ai.OPENAI_BASE_URL,
        timeout=settings.ai.LLM_TIMEOUT,
        max_retries=settings.ai.LLM_MAX_RETRIES,
    )
