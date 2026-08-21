from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user_optional
from app.models.collection import Collection, BookCollection
from app.schemas.collection import CollectionResponse, CollectionCreate

router = APIRouter(prefix="/collections", tags=["collections"])

@router.get("/", response_model=List[CollectionResponse])
def list_collections(
    user_id: str = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    return db.query(Collection).order_by(Collection.sort_order.asc()).all()

@router.post("/", response_model=CollectionResponse)
def create_collection(
    col_data: CollectionCreate,
    user_id: str = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    col = Collection(
        user_id=user_id,
        name=col_data.name,
        description=col_data.description,
        theme=col_data.theme or {"color": "#1a2238", "foil": "#d4af37"},
        sort_order=col_data.sort_order or 0
    )
    db.add(col)
    db.commit()
    db.refresh(col)
    return col
