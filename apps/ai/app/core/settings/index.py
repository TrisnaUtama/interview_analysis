from pydantic_settings import BaseSettings, SettingsConfigDict

from app.core.settings.ai import AISettings
from app.core.settings.app import AppSettings
from app.core.settings.redis import RedisSettings
from app.core.settings.minio import MinioSettings


class Settings(BaseSettings):
    app: AppSettings = AppSettings()
    ai: AISettings = AISettings()
    redis: RedisSettings = RedisSettings()
    minio: MinioSettings = MinioSettings()
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
