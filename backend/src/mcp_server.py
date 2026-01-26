from mcp.server.fastmcp import FastMCP, Context
from sqlalchemy.ext.asyncio import AsyncSession
from .services.task_service import TaskService
from .services.category_service import CategoryService
from .schemas.task import TaskCreate, TaskUpdate
from typing import List, Optional, Annotated

mcp = FastMCP("TodoManager")

@mcp.tool()
async def add_task(
    description: str,
    priority: str = "medium",
    category_id: Optional[str] = None,
    ctx: Context = None
) -> str:
    """
    Add a new todo task.

    Args:
        description: The task content.
        priority: high, medium, or low.
        category_id: Optional ID of the category.
    """
    db: AsyncSession = ctx.request_context.get("db")
    user_id: str = ctx.request_context.get("user_id")

    if not db or not user_id:
        return "Error: Database session or user context not provided to tool."

    service = TaskService(db, user_id)
    task_data = TaskCreate(description=description, priority=priority, category_id=category_id)
    task = await service.add_task(task_data)
    return f"Successfully created task '{task.description}' with ID {task.id}."

@mcp.tool()
async def list_tasks(
    status: Optional[str] = None,
    category_id: Optional[str] = None,
    ctx: Context = None
) -> str:
    """
    List existing todo tasks.

    Args:
        status: Filter by 'active' or 'completed'.
        category_id: Filter by specific category.
    """
    db: AsyncSession = ctx.request_context.get("db")
    user_id: str = ctx.request_context.get("user_id")

    if not db or not user_id:
        return "Error: Database session or user context missing."

    service = TaskService(db, user_id)
    tasks = await service.list_tasks(category_id=category_id, status=status)

    if not tasks:
        return "No tasks found."

    res = "Your tasks:\n"
    for t in tasks:
        status_icon = "✅" if t.is_completed else "⭕"
        res += f"- {status_icon} [{t.id[:8]}] {t.description} (Priority: {t.priority})\n"
    return res

@mcp.tool()
async def complete_task(task_id: str, ctx: Context = None) -> str:
    """Mark a task as completed using its ID."""
    db: AsyncSession = ctx.request_context.get("db")
    user_id: str = ctx.request_context.get("user_id")

    if not db or not user_id:
        return "Error: Context missing."

    service = TaskService(db, user_id)
    task = await service.toggle_completed(task_id, True)
    if task:
        return f"Task '{task.description}' marked as completed."
    return "Task not found."

@mcp.tool()
async def delete_task(task_id: str, ctx: Context = None) -> str:
    """Delete a task using its ID."""
    db: AsyncSession = ctx.request_context.get("db")
    user_id: str = ctx.request_context.get("user_id")

    if not db or not user_id:
        return "Error: Context missing."

    service = TaskService(db, user_id)
    success = await service.delete_task(task_id)
    if success:
        return "Task deleted successfully."
    return "Task not found or could not be deleted."

@mcp.tool()
async def update_task(
    task_id: str,
    description: Optional[str] = None,
    priority: Optional[str] = None,
    ctx: Context = None
) -> str:
    """Update description or priority of an existing task."""
    db: AsyncSession = ctx.request_context.get("db")
    user_id: str = ctx.request_context.get("user_id")

    if not db or not user_id:
        return "Error: Context missing."

    service = TaskService(db, user_id)
    update_data = TaskUpdate(description=description, priority=priority)
    task = await service.update_task(task_id, update_data)
    if task:
        return f"Task updated: {task.description}."
    return "Task not found."

@mcp.tool()
async def add_category(name: str, color: str = "#3B82F6", ctx: Context = None) -> str:
    """Create a new category for organizing tasks."""
    db: AsyncSession = ctx.request_context.get("db")
    user_id: str = ctx.request_context.get("user_id")

    if not db or not user_id:
        return "Error: Context missing."

    service = CategoryService(db, user_id)
    try:
        category = await service.create_category(name=name, color=color)
        return f"Category '{category.name}' created successfully with ID {category.id}."
    except Exception as e:
        return f"Error creating category: {str(e)}"

@mcp.tool()
async def list_categories(ctx: Context = None) -> str:
    """List all available categories."""
    db: AsyncSession = ctx.request_context.get("db")
    user_id: str = ctx.request_context.get("user_id")

    if not db or not user_id:
        return "Error: Context missing."

    service = CategoryService(db, user_id)
    categories = await service.list_categories()

    if not categories:
        return "No categories found."

    res = "Categories:\n"
    for c in categories:
        res += f"- {c.name} (ID: {c.id[:8]}, Color: {c.color})\n"
    return res

@mcp.tool()
async def delete_category(category_id: str, ctx: Context = None) -> str:
    """Delete a category by its ID."""
    db: AsyncSession = ctx.request_context.get("db")
    user_id: str = ctx.request_context.get("user_id")

    if not db or not user_id:
        return "Error: Context missing."

    service = CategoryService(db, user_id)
    success = await service.delete_category(category_id)
    if success:
        return f"Category deleted successfully."
    return "Category not found or could not be deleted."
