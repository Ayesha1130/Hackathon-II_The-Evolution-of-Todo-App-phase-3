# src/models/database.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, DateTime
from sqlalchemy.sql import func
import uuid

# Handle both relative import and direct import scenarios
try:
    from ..config import settings
except (ValueError, ImportError):
    from src.config import settings

Base = declarative_base()

def generate_uuid() -> str:
    return str(uuid.uuid4())

class TimestampMixin:
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

# Async engine & session
async_engine = create_async_engine(
    settings.async_database_url,
    echo=settings.debug,
)

async_session_local = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Dependency
async def get_db():
    async with async_session_local() as session:
        try:
            yield session
        finally:
            await session.close()
