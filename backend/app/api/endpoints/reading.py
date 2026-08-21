from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.core.database import get_db
from app.core.security import get_current_user_optional
from app.models.reading_history import ReadingHistory
from app.models.book import Book
from app.schemas.reading import ReadingHistoryResponse, ReadingHistoryUpdate

router = APIRouter(prefix="/reading", tags=["reading"])

@router.get("/{book_id}", response_model=ReadingHistoryResponse)
def get_reading_progress(
    book_id: str,
    user_id: str = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    history = db.query(ReadingHistory).filter(
        ReadingHistory.book_id == book_id,
        ReadingHistory.user_id == user_id
    ).first()
    
    if not history:
        # Create initial empty history
        book = db.query(Book).filter(Book.id == book_id).first()
        if not book:
            raise HTTPException(status_code=404, detail="Book not found")
            
        history = ReadingHistory(
            book_id=book_id,
            user_id=user_id,
            last_page=0,
            last_spread=0,
            total_pages=book.pages or 0,
            reading_time_minutes=0,
            completed=False
        )
        db.add(history)
        db.commit()
        db.refresh(history)
        
    return history

@router.post("/{book_id}", response_model=ReadingHistoryResponse)
def update_reading_progress(
    book_id: str,
    progress_data: ReadingHistoryUpdate,
    user_id: str = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    history = db.query(ReadingHistory).filter(
        ReadingHistory.book_id == book_id,
        ReadingHistory.user_id == user_id
    ).first()
    
    if not history:
        history = ReadingHistory(
            book_id=book_id,
            user_id=user_id,
            last_page=progress_data.last_page,
            last_spread=progress_data.last_spread or 0,
            total_pages=progress_data.total_pages or 0,
            reading_time_minutes=progress_data.reading_time_minutes or 0,
            completed=progress_data.completed or False,
            last_read_at=datetime.utcnow()
        )
        db.add(history)
    else:
        history.last_page = progress_data.last_page
        if progress_data.last_spread is not None:
            history.last_spread = progress_data.last_spread
        if progress_data.total_pages:
            history.total_pages = progress_data.total_pages
        if progress_data.reading_time_minutes:
            history.reading_time_minutes += progress_data.reading_time_minutes
        if progress_data.completed is not None:
            history.completed = progress_data.completed
        history.last_read_at = datetime.utcnow()
        
    db.commit()
    db.refresh(history)
    return history
