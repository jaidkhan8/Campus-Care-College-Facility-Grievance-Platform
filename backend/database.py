"""
SQLAlchemy Database Engine and Session Management.
Provides base declarative class and DB session generators.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from backend.config import get_settings

settings = get_settings()

# Create SQLAlchemy engine with connection pooling (or SQLite thread handling)
if settings.database_url.startswith("sqlite"):
    engine = create_engine(
        settings.database_url,
        connect_args={"check_same_thread": False},
        echo=(settings.ENVIRONMENT == "development")
    )
else:
    engine = create_engine(
        settings.database_url,
        pool_pre_ping=True,
        pool_recycle=3600,
        pool_size=10,
        max_overflow=20,
        echo=(settings.ENVIRONMENT == "development")
    )

# Session factory for generating independent database sessions per request
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative base class for all database models
Base = declarative_base()


def get_db():
    """
    FastAPI dependency that yields a SQLAlchemy database session per HTTP request
    and ensures the session is closed when the request completes.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
