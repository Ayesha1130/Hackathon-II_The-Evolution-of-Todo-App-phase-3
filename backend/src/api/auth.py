from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .deps import get_current_user
from ..models import User
from ..models.database import get_db
from ..schemas.auth import Message, Token
from ..schemas.user import UserCreate, UserLogin, UserResponse
from ..utils.security import (
    create_access_token,
    create_refresh_token,
    get_password_hash,
    verify_password,
)
from src.config import settings

router = APIRouter()


@router.post("/signup", response_model=Message, status_code=status.HTTP_201_CREATED)
async def signup(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db),
):
    """Register a new user account."""
    if user_data.password != user_data.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Passwords do not match"
        )

    result = await db.execute(select(User).where(User.email == user_data.email))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    hashed_password = get_password_hash(user_data.password)
    #new_user = User(email=user_data.email, hashed_password=hashed_password)

    new_user = User(
        email=user_data.email, 
        hashed_password=hashed_password,
        full_name=user_data.full_name if hasattr(user_data, 'full_name') else None,
        is_active=True # Default active rakhein
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return Message(message="Account created successfully")


@router.post("/login", response_model=Token)
async def login(
    credentials: UserLogin,
    db: AsyncSession = Depends(get_db),
):
    """Authenticate user and return JWT tokens."""
    result = await db.execute(select(User).where(User.email == credentials.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Account is deactivated"
        )

    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    refresh_token_expires = timedelta(days=settings.refresh_token_expire_days)

    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    refresh_token = create_refresh_token(
        data={"sub": str(user.id)}, expires_delta=refresh_token_expires
    )

    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
    )


@router.post("/logout", response_model=Message)
async def logout(current_user: User = Depends(get_current_user)):
    """Log out current user (client should discard tokens)."""
    return Message(message="Logged out successfully")


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user profile."""
    return current_user