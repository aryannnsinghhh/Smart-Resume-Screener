"""
Database configuration and session management
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Database URL - SQLite for local development (easily switchable to PostgreSQL)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./resume_screener.db")

# For PostgreSQL, use:
# DATABASE_URL = "postgresql://user:password@localhost/resume_screener"

# Create engine
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL, 
        connect_args={"check_same_thread": False}  # Needed for SQLite
    )
else:
    engine = create_engine(DATABASE_URL)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class for models
Base = declarative_base()


def get_db():
    """
    Dependency function to get database session
    Usage in FastAPI endpoints: db: Session = Depends(get_db)
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """
    Initialize database - create all tables
    Call this on application startup
    """
    from backend.models import Candidate, ScreeningRecord, Experience, Education
    Base.metadata.create_all(bind=engine)
    print("✓ Database initialized successfully")
