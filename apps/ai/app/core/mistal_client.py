from app.core.settings.index import settings
from mistralai import Mistral


def mistral_client() -> Mistral:
    return Mistral(api_key=settings.ai.MISTRAL_API_KEY)
