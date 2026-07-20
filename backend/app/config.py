"""
Application configuration — loads from .env file.
Uses pydantic-settings for type-safe config management.
"""

from pathlib import Path
from pydantic_settings import BaseSettings

# Project root is two levels up from this file (backend/app/config.py → project root)
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    """All app settings, auto-loaded from .env file."""

    # App
    APP_NAME: str = "IntelliPlant"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = f"sqlite:///{PROJECT_ROOT / 'data' / 'intelliplant.db'}"

    # ChromaDB (deprecated, using FAISS)
    CHROMA_PERSIST_DIR: str = str(PROJECT_ROOT / "data" / "chroma_db")
    
    # FAISS DB
    FAISS_PERSIST_DIR: str = str(PROJECT_ROOT / "data" / "faiss_index")
    # File uploads
    UPLOAD_DIR: str = str(PROJECT_ROOT / "data" / "uploads")

    # LLM
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""

    # Embedding
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"

    # CORS
    FRONTEND_URL: str = "http://localhost:5173"

    class Config:
        env_file = str(PROJECT_ROOT / "backend" / ".env")
        env_file_encoding = "utf-8"


# Singleton instance — import this everywhere
settings = Settings()
