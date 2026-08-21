from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ReadingHistoryUpdate(BaseModel):
    last_page: int
    last_spread: Optional[int] = 0
    total_pages: Optional[int] = 0
    reading_time_minutes: Optional[int] = 0
    completed: Optional[bool] = False

class ReadingHistoryResponse(BaseModel):
    id: str
    book_id: str
    user_id: str
    last_page: int
    last_spread: int
    total_pages: int
    reading_time_minutes: int
    completed: bool
    last_read_at: datetime

    class Config:
        from_attributes = True
