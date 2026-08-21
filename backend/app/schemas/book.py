from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime

class BookBase(BaseModel):
    title: str
    author: Optional[str] = "Unknown"
    subtitle: Optional[str] = None
    description: Optional[str] = None
    year: Optional[str] = None
    cloth_color: Optional[str] = "#1a2238"
    cloth_roughness: Optional[str] = "0.88"
    cloth_metalness: Optional[str] = "0.05"
    foil_color: Optional[str] = "#d4af37"
    foil_metalness: Optional[str] = "0.95"
    foil_roughness: Optional[str] = "0.15"
    theme_glow: Optional[str] = "rgba(212, 175, 55, 0.25)"
    theme_hue: Optional[str] = "#1a2238"
    dimensions: Optional[Dict[str, float]] = None

class BookCreate(BookBase):
    pdf_url: str
    pages: Optional[int] = 0

class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    subtitle: Optional[str] = None
    description: Optional[str] = None
    year: Optional[str] = None
    cloth_color: Optional[str] = None
    foil_color: Optional[str] = None

class BookResponse(BookBase):
    id: str
    user_id: str
    pdf_url: str
    cover_url: Optional[str] = None
    pages: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
