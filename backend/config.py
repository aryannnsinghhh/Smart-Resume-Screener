"""
Configuration settings for the Resume Screener application
"""
import os
from typing import Optional
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Application settings"""
    
    # Application
    APP_NAME: str = "Smart Resume Screener"
    APP_VERSION: str = "2.0.0"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # API Keys
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./resume_screener.db")
    
    # LLM Settings
    LLM_MODEL: str = os.getenv("LLM_MODEL", "gpt-3.5-turbo")
    LLM_EXTRACTION_TEMPERATURE: float = float(os.getenv("LLM_EXTRACTION_TEMPERATURE", "0.3"))
    LLM_SCORING_TEMPERATURE: float = float(os.getenv("LLM_SCORING_TEMPERATURE", "0.5"))
    LLM_MAX_TOKENS_EXTRACTION: int = int(os.getenv("LLM_MAX_TOKENS_EXTRACTION", "1500"))
    LLM_MAX_TOKENS_SCORING: int = int(os.getenv("LLM_MAX_TOKENS_SCORING", "1000"))
    
    # File Upload Settings
    MAX_FILE_SIZE_MB: int = int(os.getenv("MAX_FILE_SIZE_MB", "10"))
    ALLOWED_FILE_EXTENSIONS: list = [".pdf"]
    
    # Pagination
    DEFAULT_PAGE_SIZE: int = int(os.getenv("DEFAULT_PAGE_SIZE", "100"))
    MAX_PAGE_SIZE: int = int(os.getenv("MAX_PAGE_SIZE", "1000"))
    
    # CORS
    CORS_ORIGINS: list = os.getenv("CORS_ORIGINS", "*").split(",")
    
    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    LOG_FILE: str = os.getenv("LOG_FILE", "resume_screener.log")
    
    # Admin Authentication
    ADMIN_USERNAME: str = os.getenv("ADMIN_USERNAME", "admin")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "admin123")
    SESSION_SECRET_KEY: str = os.getenv("SESSION_SECRET_KEY", "your-secret-key-change-in-production")
    
    @classmethod
    def validate(cls) -> bool:
        """Validate critical settings"""
        if not cls.OPENAI_API_KEY or cls.OPENAI_API_KEY == "sk-REPLACE_ME":
            raise ValueError("OPENAI_API_KEY must be set in .env file")
        return True


# Create settings instance
settings = Settings()

# Validate on import
try:
    settings.validate()
except ValueError as e:
    print(f"Warning: {e}")
