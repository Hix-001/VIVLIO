from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime
from app.schemas.book import BookResponse

class CollectionBase(BaseModel):
    name: str
    description: Optional[str] = None
    theme: Optional[Dict[str, str]] = None
    sort_order: Optional[int] = 0

class CollectionCreate(CollectionBase):
    pass

class CollectionResponse(CollectionBase):
    id: str
    user_id: str
    created_at: datetime
    books: List[BookResponse] = []

    class Config:
        from_attributes = True
