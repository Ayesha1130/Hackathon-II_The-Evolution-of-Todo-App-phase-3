from functools import lru_cache
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables (.env)
    Compatible with Pydantic v2.
    """

    # =========================
    # Pydantic Settings Config
    # =========================
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",  # Ignore extra fields from .env and environment to avoid errors
    )

    # =========================
    # Application
    # =========================
    app_name: str = "Todo API"
    environment: str = "development"
    debug: bool = True

    # =========================
    # Database
    # =========================
    database_host: str = "localhost"
    database_port: int = 5432
    database_name: str = "todo_app"
    database_user: str = "postgres"
    database_password: str = "password"
    database_url: Optional[str] = None

    # =========================
    # JWT Authentication
    # =========================
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7

    # =========================
    # CORS
    # =========================
    cors_origins: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    # =========================
    # Security
    # =========================
    bcrypt_rounds: int = 12

    # =========================
    # AI (OpenAI)
    # =========================
    openai_api_key: Optional[str] = None  # Gets from OPENAI_API_KEY environment variable
    openai_model_name: str = "gpt-4-turbo-preview"

    # =========================
    # Database URLs
    # =========================
    @property
    def async_database_url(self) -> str:
        """Async DB URL for SQLAlchemy"""
        if self.database_url:
            return (
                self.database_url.replace("postgresql://", "postgresql+asyncpg://", 1)
                .split("?")[0]
            )
        return (
            f"postgresql+asyncpg://{self.database_user}:{self.database_password}"
            f"@{self.database_host}:{self.database_port}/{self.database_name}"
        )

    @property
    def sync_database_url(self) -> str:
        """Sync DB URL for Alembic"""
        if self.database_url:
            return self.database_url
        return (
            f"postgresql://{self.database_user}:{self.database_password}"
            f"@{self.database_host}:{self.database_port}/{self.database_name}"
        )


# =========================
# Settings Instance
# =========================
@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
