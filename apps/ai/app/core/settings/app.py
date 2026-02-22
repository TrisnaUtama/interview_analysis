from pydantic_settings import BaseSettings, SettingsConfigDict


class AppSettings(BaseSettings):
    APP_NAME: str = "INTERVIEW APP"
    VERSION: str = "0.0.1"
    DOCS_URL: str | None = None
    REDOCS_URL: str | None = None
    OPENAPI_URL: str = "/openapi.json"
    API_VERSION: str = ""
    CORS_ALLOW_ORIGINS: str = ""

    SITE_URL: str = "http://localhost:9000"
    FRONTEND_URL: str = "http://localhost:5173"

    MAIN_API_URL: str = ""
    MAIN_API_KEY: str = ""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
