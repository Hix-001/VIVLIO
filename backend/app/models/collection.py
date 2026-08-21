from sqlalchemy import Column, String, Integer, DateTime, JSON, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.core.database import Base

class BookCollection(Base):
    __tablename__ = "book_collections"

    book_id = Column(String(36), ForeignKey("books.id", ondelete="CASCADE"), primary_key=True)
    collection_id = Column(String(36), ForeignKey("collections.id", ondelete="CASCADE"), primary_key=True)
    position = Column(Integer, default=0)
    added_at = Column(DateTime, default=datetime.utcnow)

class Collection(Base):
    __tablename__ = "collections"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), default="default-user", index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    theme = Column(JSON, default=lambda: {"color": "#1a2238", "foil": "#d4af37"})
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    books = relationship("Book", secondary="book_collections", back_populates="collections")
