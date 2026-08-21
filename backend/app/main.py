from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.core.config import get_settings
from app.core.database import Base, engine, SessionLocal
import app.models  # Register all models with Base.metadata
from app.api.router import api_router
from app.services.seeder import seed_default_collection_if_empty

settings = get_settings()

# Initialize Database Schema
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed initial collection on startup
@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        seed_default_collection_if_empty(db)
    finally:
        db.close()

# Mount Static Directories for PDF & asset serving
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Mount existing 'book' folder (checks both local and parent directory)
book_folder = "book" if os.path.exists("book") else os.path.join("..", "book")
if os.path.exists(book_folder):
    app.mount("/book", StaticFiles(directory=book_folder), name="book")

# Mount existing 'music' folder
music_folder = "music" if os.path.exists("music") else os.path.join("..", "music")
if os.path.exists(music_folder):
    app.mount("/music", StaticFiles(directory=music_folder), name="music")

# Attach API routes
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
