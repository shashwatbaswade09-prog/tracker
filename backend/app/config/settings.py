from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # App settings
    APP_NAME: str = "Nexus API"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = "sqlite:///./nexus.db"
    
    # JWT Settings
    SECRET_KEY: str = "nexus-super-secret-key-change-in-production-2024"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # CORS
    ALLOWED_ORIGINS: list = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://nexus-frontend-2oc.pages.dev",
        "https://0eabcd01.nexus-frontend-2oc.pages.dev"
    ]
    
    # Chatbot (for future AI integration)
    OPENAI_API_KEY: str = ""
    
    # Email Settings (SMTP)
    SMTP_SERVER: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""  # Your email
    SMTP_PASSWORD: str = ""  # App password (not regular password)
    FROM_EMAIL: str = "noreply@nexus.com"
    SUPPORT_EMAIL: str = ""  # Email where support tickets go
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()
