from pydantic_settings import BaseSettings, SettingsConfigDict


class RedisSettings(BaseSettings):
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_EXTERNAL_PORT: int = 14002
    REDIS_PASSWORD: str = ""
    REDIS_USER: str = ""

    @property
    def REDIS_URL(self) -> str:
        if self.REDIS_PASSWORD:
            return f"redis://:{self.REDIS_PASSWORD}@{self.REDIS_HOST}:{self.REDIS_EXTERNAL_PORT}"

        return f"redis://{self.REDIS_HOST}:{self.REDIS_EXTERNAL_PORT}"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
