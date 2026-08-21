from sqlalchemy import Column, String, Integer, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.core.database import Base

class ReadingHistory(Base):
    __tablename__ = "reading_history"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), default="default-user", index=True)
    book_id = Column(String(36), ForeignKey("books.id", ondelete="CASCADE"), nullable=False, index=True)
    last_page = Column(Integer, default=0)
    last_spread = Column(Integer, default=0)
    total_pages = Column(Integer, default=0)
    reading_time_minutes = Column(Integer, default=0)
    completed = Column(Boolean, default=False)
    last_read_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    book = relationship("Book", back_populates="reading_history")
