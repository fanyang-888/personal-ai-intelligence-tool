from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment (see `.env.example`)."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    database_url: str
    app_env: str
    source_fetch_user_agent: str

    openai_api_key: str | None = None
    redis_url: str | None = None


settings = Settings()
