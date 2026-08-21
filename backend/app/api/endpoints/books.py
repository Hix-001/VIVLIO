from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import uuid
import aiofiles

from app.core.database import get_db
from app.core.config import get_settings
from app.core.security import get_current_user_optional
from app.models.book import Book
from app.models.collection import Collection, BookCollection
from app.schemas.book import BookResponse, BookCreate, BookUpdate
from app.services.pdf_processor import PDFProcessor

router = APIRouter(prefix="/books", tags=["books"])
settings = get_settings()

@router.get("/", response_model=List[BookResponse])
def list_books(
    search: Optional[str] = Query(None),
    collection_id: Optional[str] = Query(None),
    user_id: str = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    query = db.query(Book)
    
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            (Book.title.ilike(search_fmt)) |
            (Book.author.ilike(search_fmt)) |
            (Book.subtitle.ilike(search_fmt))
        )
        
    if collection_id:
        query = query.join(Book.collections).filter(Collection.id == collection_id)
        
    return query.order_by(Book.created_at.asc()).all()

@router.get("/{book_id}", response_model=BookResponse)
def get_book(
    book_id: str,
    db: Session = Depends(get_db)
):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@router.post("/upload", response_model=BookResponse)
async def upload_pdf_book(
    file: UploadFile = File(...),
    title: Optional[str] = Form(None),
    author: Optional[str] = Form(None),
    subtitle: Optional[str] = Form(None),
    collection_id: Optional[str] = Form(None),
    user_id: str = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    
    file_bytes = await file.read()
    if len(file_bytes) > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(status_code=400, detail="PDF exceeds maximum allowed upload size.")

    # Save to uploads directory
    clean_filename = f"{uuid.uuid4().hex}_{file.filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, clean_filename)
    
    async with aiofiles.open(file_path, "wb") as f:
        await f.write(file_bytes)
        
    # Extract metadata and derive palette
    pdf_info = PDFProcessor.extract_metadata(file_bytes, file.filename)
    book_id = f"book-{uuid.uuid4().hex[:8]}"
    
    book = Book(
        id=book_id,
        user_id=user_id,
        title=title or pdf_info["title"],
        author=author or pdf_info["author"],
        subtitle=subtitle or f"Uploaded {file.filename}",
        description=f"Personal uploaded edition of {file.filename}",
        year=str(os.path.getmtime(file_path)),
        pdf_url=f"/uploads/{clean_filename}",
        pages=pdf_info["pages"],
        cloth_color=pdf_info["cloth_color"],
        foil_color=pdf_info["foil_color"],
        theme_glow=pdf_info["theme_glow"],
        theme_hue=pdf_info["cloth_color"],
        dimensions={"width": 1.5, "height": 2.2, "depth": 0.4}
    )
    
    db.add(book)
    db.commit()
    db.refresh(book)
    
    # Optionally attach to collection
    if collection_id:
        junction = BookCollection(book_id=book.id, collection_id=collection_id)
        db.add(junction)
        db.commit()
        
    return book

@router.delete("/{book_id}")
def delete_book(
    book_id: str,
    db: Session = Depends(get_db)
):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
        
    # If in uploads, remove physical file
    if book.pdf_url.startswith("/uploads/"):
        local_path = os.path.join(settings.UPLOAD_DIR, os.path.basename(book.pdf_url))
        if os.path.exists(local_path):
            os.remove(local_path)
            
    db.delete(book)
    db.commit()
    return {"message": "Book deleted successfully", "id": book_id}
