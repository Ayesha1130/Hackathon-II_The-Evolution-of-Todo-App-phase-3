import asyncio
import json
import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from ..agents import Agent, Runner, function_tool
from ..config import settings
from ..mcp_server import (
    add_category,
    add_task,
    complete_task,
    delete_category,
    delete_task,
    list_categories,
    list_tasks,
    update_task,
)
from ..models import Conversation, Message, MessageRole, User
from .deps import get_current_user, get_db

router = APIRouter()


class ChatRequest(BaseModel):
    content: str
    conversation_id: Optional[str] = None


SYSTEM_INSTRUCTIONS = """
You are a helpful Todo Manager Assistant.
You can help users create, list, update, and delete tasks and categories.
Use the provided tools to interact with the user's database.
If the user wants to end the conversation (e.g., 'bye', 'exit', 'quit', 'goodbye'),
confirm clearly by saying 'Goodbye!' and nothing else.
Use a friendly but professional tone.
"""


def get_todo_agent(db: AsyncSession, user_id: str):
    """Factory to create a configured Agent with tools for the current user."""

    class MockContext:
        """A mock context to pass db session and user_id to tool functions."""

        def __init__(self, db_session, user_id_str):
            self.request_context = {"db": db_session, "user_id": user_id_str}

    ctx = MockContext(db, user_id)

    @function_tool
    async def ai_add_task(
        description: str, priority: str = "medium", category_id: Optional[str] = None
    ) -> str:
        return await add_task(description, priority, category_id, ctx=ctx)

    @function_tool
    async def ai_list_tasks(
        status: Optional[str] = None, category_id: Optional[str] = None
    ) -> str:
        return await list_tasks(status, category_id, ctx=ctx)

    @function_tool
    async def ai_complete_task(task_id: str) -> str:
        return await complete_task(task_id, ctx=ctx)

    @function_tool
    async def ai_delete_task(task_id: str) -> str:
        return await delete_task(task_id, ctx=ctx)

    @function_tool
    async def ai_update_task(
        task_id: str,
        description: Optional[str] = None,
        priority: Optional[str] = None,
    ) -> str:
        return await update_task(task_id, description, priority, ctx=ctx)

    @function_tool
    async def ai_add_category(name: str, color: str = "#3B82F6") -> str:
        return await add_category(name, color, ctx=ctx)

    @function_tool
    async def ai_list_categories() -> str:
        return await list_categories(ctx=ctx)

    @function_tool
    async def ai_delete_category(category_id: str) -> str:
        return await delete_category(category_id, ctx=ctx)

    return Agent(
        name="TodoAgent",
        instructions=SYSTEM_INSTRUCTIONS,
        tools=[
            ai_add_task,
            ai_list_tasks,
            ai_complete_task,
            ai_delete_task,
            ai_update_task,
            ai_add_category,
            ai_list_categories,
            ai_delete_category,
        ],
        model=settings.openai_model_name,
        api_key=settings.openai_api_key,
    )


@router.post("/")
async def chat_with_agent(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Handles a chat message and streams the agent's response."""
    conv_id = request.conversation_id
    if conv_id:
        result = await db.execute(
            select(Conversation).where(
                Conversation.id == conv_id, Conversation.user_id == current_user.id
            )
        )
        conversation = result.scalar_one_or_none()
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
    else:
        conversation = Conversation(id=str(uuid.uuid4()), user_id=current_user.id)
        db.add(conversation)
        await db.commit()
        await db.refresh(conversation)
        conv_id = conversation.id

    history_result = await db.execute(
        select(Message)
        .where(Message.conversation_id == conv_id)
        .order_by(Message.created_at)
        .limit(20)
    )
    history = [
        {"role": msg.role.value, "content": msg.content}
        for msg in history_result.scalars()
    ]

    history.append({"role": "user", "content": request.content})
    user_msg_db = Message(
        conversation_id=conv_id, role=MessageRole.USER, content=request.content
    )
    db.add(user_msg_db)
    await db.commit()

    agent = get_todo_agent(db, current_user.id)

    async def event_generator():
        full_reply = ""
        yield f"data: {json.dumps({'conversation_id': conv_id})}\n\n"
        try:
            runner = Runner(agent)
            async for chunk in runner.stream_async(history):
                full_reply += chunk
                yield f"data: {json.dumps({'chunk': chunk})}\n\n"
                await asyncio.sleep(0.01)

            assistant_msg_db = Message(
                conversation_id=conv_id,
                role=MessageRole.ASSISTANT,
                content=full_reply,
            )
            db.add(assistant_msg_db)
            await db.commit()

            exit_session = "goodbye" in full_reply.lower()
            yield f"data: {json.dumps({'exit_session': exit_session, 'done': True})}\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'error': str(e), 'done': True})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")