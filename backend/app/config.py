import os
from pydantic_settings import BaseSettings, SettingsConfigDict

# Get the directory where config.py lives, and attach ".env" to it
env_path = os.path.join(os.path.dirname(__file__), ".env")

_base_config = SettingsConfigDict(
    env_file=env_path, extra="ignore", env_ignore_empty=True
)


class SecuritySettings(BaseSettings):
    JWT_SECRET: str
    JWT_ALGORITHM: str

    model_config = _base_config


class DatabaseSettings(BaseSettings):
    POSTGRES_SERVER: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    POSTGRES_PORT: int

    # REDIS_HOST_OLD: str
    # REDIS_PORT_OLD: int

    REDIS_URL: str
    model_config = _base_config

    @property
    def postgres_url(self) -> str:
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}?ssl=require"


db_settings = DatabaseSettings()  # pyright: ignore
security_settings = SecuritySettings()  # pyright: ignore
