from sqlalchemy import Column, String, Integer, DateTime, JSON, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.core.database import Base

class Book(Base):
    __tablename__ = "books"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), default="default-user", index=True)
    title = Column(String(255), nullable=False, index=True)
    author = Column(String(255), default="Unknown", index=True)
    subtitle = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    year = Column(String(50), nullable=True)
    
    # PDF & Assets
    pdf_url = Column(String(512), nullable=False)
    cover_url = Column(String(512), nullable=True)
    pages = Column(Integer, default=0)
    
    # 3D Presentation & Binding Themes
    cloth_color = Column(String(50), default="#1a2238")
    cloth_roughness = Column(String(50), default="0.88")
    cloth_metalness = Column(String(50), default="0.05")
    foil_color = Column(String(50), default="#d4af37")
    foil_metalness = Column(String(50), default="0.95")
    foil_roughness = Column(String(50), default="0.15")
    theme_glow = Column(String(50), default="rgba(212, 175, 55, 0.25)")
    theme_hue = Column(String(50), default="#1a2238")
    dimensions = Column(JSON, default=lambda: {"width": 1.5, "height": 2.2, "depth": 0.4})
    
    metadata_json = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    reading_history = relationship("ReadingHistory", back_populates="book", cascade="all, delete-orphan")
    collections = relationship("Collection", secondary="book_collections", back_populates="books")
