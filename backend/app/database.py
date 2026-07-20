"""
Database engine & session setup using SQLAlchemy.

- Creates SQLite DB file on first run
- Provides `get_db()` dependency for FastAPI routes
- `init_db()` creates all tables from our models
"""

from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.config import settings

# Ensure the data directory exists
db_path = Path(settings.DATABASE_URL.replace("sqlite:///", ""))
db_path.parent.mkdir(parents=True, exist_ok=True)

# SQLAlchemy engine — connect_args needed for SQLite thread safety
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False},  # SQLite-specific
    echo=settings.DEBUG,  # Log SQL queries in debug mode
)

# Session factory — each request gets its own session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all our ORM models
Base = declarative_base()


def get_db():
    """
    FastAPI dependency that provides a DB session per request.
    Automatically closes session after request completes.
    
    Usage in routes:
        @router.get("/items")
        def get_items(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all tables. Called once on app startup."""
    from app.models import models  # noqa: F401 — import to register models
    Base.metadata.create_all(bind=engine)
