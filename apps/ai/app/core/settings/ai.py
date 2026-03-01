from pydantic_settings import BaseSettings, SettingsConfigDict


class AISettings(BaseSettings):
    OPENAI_API_KEY: str = "abcdefg"
    OPENAI_BASE_URL: str = "ssddsd"
    WHISPER_SERVICE_URL: str = "kdakndjad"
    OPENROUTER_API_KEY: str = "bjsabiuusfa"
    RATE_LIMIT_INTERVAL: float = 6.0
    LLM_MAX_RETRIES: int = 3
    LLM_TIMEOUT: int = 30
    LITELLM_MASTER_KEY: str = ""
    LITELLM_API_KEY: str = ""
    ELEVENLABS_API_KEY: str = ""
    ELEVENLABS_DEFAULT_VOICE_ID: str = ""
    MISTRAL_API_KEY: str = ""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
