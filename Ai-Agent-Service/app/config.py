from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    api_base_url: str
    api_service_token: str

    ai_provider: str = "gemini"  # gemini or llama

    gemini_api_key: str = ""

    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama2"

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    return Settings()
