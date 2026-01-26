from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..api.deps import get_current_user
from ..models import Category, User
from ..models.database import get_db
from ..schemas.category import CategoryCreate, CategoryResponse, CategoryUpdate

router = APIRouter()


@router.get("", response_model=List[CategoryResponse])
async def get_categories(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get all categories for the current user."""
    result = await db.execute(
        select(Category)
        .where(Category.user_id == current_user.id)
        .order_by(Category.name)
    )
    return result.scalars().all()


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    category_data: CategoryCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new category."""
    result = await db.execute(
        select(Category).where(
            Category.user_id == current_user.id, Category.name == category_data.name
        )
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A category with this name already exists.",
        )

    new_category = Category(user_id=current_user.id, **category_data.model_dump())
    db.add(new_category)
    await db.commit()
    await db.refresh(new_category)
    return new_category


@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: str,
    category_data: CategoryUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update a category's name or color."""
    result = await db.execute(
        select(Category).where(
            Category.id == category_id, Category.user_id == current_user.id
        )
    )
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    update_data = category_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(category, key, value)

    await db.commit()
    await db.refresh(category)
    return category


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    category_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Delete a category. Tasks associated with this category will have their
    category_id set to null.
    """
    result = await db.execute(
        select(Category).where(
            Category.id == category_id, Category.user_id == current_user.id
        )
    )
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    await db.delete(category)
    await db.commit()
    return None