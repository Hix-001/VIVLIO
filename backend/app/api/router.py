from fastapi import APIRouter
from app.api.endpoints import books, reading, collections, auth

api_router = APIRouter()

api_router.include_router(books.router)
api_router.include_router(reading.router)
api_router.include_router(collections.router)
api_router.include_router(auth.router)
