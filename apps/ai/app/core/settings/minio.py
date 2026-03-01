from pydantic_settings import BaseSettings, SettingsConfigDict


class MinioSettings(BaseSettings):
    MINIO_ENDPOINT: str = ""
    MINIO_ACCESS_KEY:str =""
    MINIO_SECRET_KEY: str=""
    MINIO_USE_SSL: bool = False
    MINIO_BUCKET_INTERVIEW: str =""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
