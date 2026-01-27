from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .models.database import async_engine, Base
from .api import auth, tasks, categories, chat
from .api.exceptions import setup_exception_handlers

# ---------------- Logging ----------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# ---------------- Lifespan ----------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Starting Todo Backend API")
    
    # Tables automatically banayen (Phase 3 ke liye zaroori hai)
    try:
        async with async_engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("✅ Database tables verified/created")
    except Exception as e:
        logger.error(f"❌ Database error: {e}")
        
    yield
    logger.info("🛑 Shutting down Todo Backend API")
    await async_engine.dispose()

# ---------------- App ----------------
app = FastAPI(
    title=settings.app_name,
    description="Todo Application Backend",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# ---------------- Exception Handlers ----------------
setup_exception_handlers(app)

# ---------------- CORS ----------------
# Isse safe aur open banaya hai taake frontend connect ho sake
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # settings.cors_origins ki jagah list use ki hai safety ke liye
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- Routers ----------------
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(tasks.router, prefix="/api/v1/tasks", tags=["Tasks"])
app.include_router(categories.router, prefix="/api/v1/categories", tags=["Categories"])
app.include_router(chat.router, prefix="/api/v1/chat", tags=["Chat"])

# ---------------- Health Check ----------------
@app.get("/api/health", tags=["Health"])
async def health_check():
    return {"status": "healthy", "environment": settings.environment}

@app.get("/", include_in_schema=False)
async def root():
    return {"message": "Todo API is running"}