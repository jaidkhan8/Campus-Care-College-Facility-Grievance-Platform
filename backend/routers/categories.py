"""
Categories API Router.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from backend.database import get_db
from backend.models import Category, UserRole
from backend.schemas import CategoryCreate, CategoryResponse
from backend.dependencies import require_role

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.get("", response_model=List[CategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    """
    Publicly lists all available campus complaint categories.
    """
    return db.query(Category).order_by(Category.name.asc()).all()


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    category_in: CategoryCreate,
    db: Session = Depends(get_db),
    _admin = Depends(require_role(UserRole.ADMIN))
):
    """
    Admin only: Creates a new complaint category.
    """
    existing = db.query(Category).filter(Category.name.ilike(category_in.name.strip())).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A category with this name already exists"
        )
    
    category = Category(
        name=category_in.name.strip(),
        description=category_in.description,
        icon=category_in.icon or "tag"
    )
    db.add(category)
    db.commit()
    db.refresh(category)
    return category
