from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..api.deps import get_current_user
from ..models import Category, Task, User
from ..models.database import get_db
from ..schemas.task import TaskCreate, TaskResponse, TaskUpdate

router = APIRouter()


@router.get("", response_model=List[TaskResponse])
async def get_tasks(
    category_id: Optional[str] = Query(None, description="Filter by category ID"),
    status_filter: Optional[str] = Query(
        None, alias="status", description="Filter by status: 'active' or 'completed'"
    ),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get all tasks for the current user with optional filters."""
    query = select(Task).where(Task.user_id == current_user.id)

    if category_id:
        query = query.where(Task.category_id == category_id)

    if status_filter == "active":
        query = query.where(Task.is_completed == False)
    elif status_filter == "completed":
        query = query.where(Task.is_completed == True)

    query = query.order_by(Task.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new task."""
    if task_data.category_id:
        result = await db.execute(
            select(Category).where(
                Category.id == task_data.category_id,
                Category.user_id == current_user.id,
            )
        )
        if not result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid category ID"
            )

    new_task = Task(user_id=current_user.id, **task_data.model_dump())
    db.add(new_task)
    await db.commit()
    await db.refresh(new_task)
    return new_task


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a single task by ID."""
    result = await db.execute(
        select(Task).where(Task.id == task_id, Task.user_id == current_user.id)
    )
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: str,
    task_data: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update a task's description, priority, or category."""
    result = await db.execute(
        select(Task).where(Task.id == task_id, Task.user_id == current_user.id)
    )
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    update_data = task_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)

    await db.commit()
    await db.refresh(task)
    return task


@router.patch("/{task_id}/toggle", response_model=TaskResponse)
async def toggle_task_completion(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Toggle a task's completion status."""
    result = await db.execute(
        select(Task).where(Task.id == task_id, Task.user_id == current_user.id)
    )
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.is_completed = not task.is_completed
    await db.commit()
    await db.refresh(task)
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a task."""
    result = await db.execute(
        select(Task).where(Task.id == task_id, Task.user_id == current_user.id)
    )
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    await db.delete(task)
    await db.commit()
    return None