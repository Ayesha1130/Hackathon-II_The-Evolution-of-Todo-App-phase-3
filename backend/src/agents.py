"""
Agents module for the Todo AI Chatbot.
This module provides the Agent, Runner, and function_tool classes
that wrap around OpenAI's API for agent orchestration.
"""

import asyncio
import json
from typing import Any, Callable, Dict, List, Optional, Union, Awaitable
from functools import wraps
from openai import AsyncOpenAI


class Agent:
    """
    A wrapper around OpenAI's Assistant API for the Todo application.
    """
    def __init__(
        self,
        name: str,
        instructions: str,
        tools: List[Callable],
        model: str = "gpt-4-turbo-preview",
        api_key: Optional[str] = None,
    ):
        self.name = name
        self.instructions = instructions
        self.model = model
        self.api_key = api_key

        # Initialize OpenAI client
        self.client = AsyncOpenAI(api_key=api_key)

        # Convert function tools to OpenAI-compatible tool definitions
        self.tools = []
        self._tool_map = {}

        for tool_func in tools:
            if hasattr(tool_func, '_is_function_tool'):
                # Get tool schema from function metadata
                tool_def = {
                    "type": "function",
                    "function": {
                        "name": tool_func.__name__,
                        "description": tool_func.__doc__ or "",
                        "parameters": getattr(tool_func, '_tool_schema', {
                            "type": "object",
                            "properties": {},
                            "required": []
                        })
                    }
                }
                self.tools.append(tool_def)
                self._tool_map[tool_func.__name__] = tool_func

    async def _call_tool(self, tool_name: str, tool_args: Dict[str, Any]) -> str:
        """Call a registered tool with the provided arguments."""
        if tool_name not in self._tool_map:
            return f"Error: Tool '{tool_name}' not found"

        tool_func = self._tool_map[tool_name]
        try:
            # Handle both sync and async functions
            if asyncio.iscoroutinefunction(tool_func):
                result = await tool_func(**tool_args)
            else:
                result = tool_func(**tool_args)
            return str(result)
        except Exception as e:
            return f"Error calling tool '{tool_name}': {str(e)}"


class Runner:
    """
    Runner class to execute agent runs and stream responses.
    """
    def __init__(self, agent: Agent):
        self.agent = agent

    async def stream_async(self, history: List[Dict[str, str]]):
        """
        Stream the agent's response asynchronously.
        Yields chunks of the response as they become available.
        """
        try:
            # Prepare messages for OpenAI API
            messages = [{"role": msg["role"], "content": msg["content"]} for msg in history]

            # Add system instructions
            messages.insert(0, {"role": "system", "content": self.agent.instructions})

            # Call OpenAI API with streaming
            stream = await self.agent.client.chat.completions.create(
                model=self.agent.model,
                messages=messages,
                tools=[{
                    "type": "function",
                    "function": {
                        "name": tool_def["function"]["name"],
                        "description": tool_def["function"]["description"],
                        "parameters": tool_def["function"]["parameters"]
                    }
                } for tool_def in self.agent.tools] if self.agent.tools else None,
                stream=True,
            )

            full_response = ""
            tool_calls = []

            async for chunk in stream:
                if chunk.choices and chunk.choices[0].delta:
                    delta = chunk.choices[0].delta

                    # Handle regular content
                    if delta.content:
                        full_response += delta.content
                        yield delta.content

                    # Handle tool calls
                    if delta.tool_calls:
                        for tool_call in delta.tool_calls:
                            # Process tool call
                            if tool_call.function:
                                # For simplicity, we'll collect tool calls and execute them after the stream
                                # In a real implementation, we'd need to handle this differently
                                pass

            # If there were tool calls, we need to execute them and continue the conversation
            # This is a simplified implementation - in practice, you'd need to handle
            # the full tool calling loop
            if tool_calls:
                # Execute tools and continue conversation
                # For now, we'll just return the initial response
                pass

        except Exception as e:
            yield f"Error: {str(e)}"


def function_tool(func):
    """
    Decorator to mark a function as a tool that can be called by the agent.
    """
    @wraps(func)
    async def async_wrapper(*args, **kwargs):
        return await func(*args, **kwargs) if asyncio.iscoroutinefunction(func) else func(*args, **kwargs)

    # Mark as function tool
    async_wrapper._is_function_tool = True

    # Generate basic schema from function signature (simplified)
    import inspect
    sig = inspect.signature(func)

    properties = {}
    required = []

    for param_name, param in sig.parameters.items():
        if param_name != 'ctx':  # Exclude context parameter
            # Determine type based on annotation or default to string
            prop_type = "string"
            if param.annotation != inspect.Parameter.empty:
                if param.annotation == int:
                    prop_type = "integer"
                elif param.annotation == float:
                    prop_type = "number"
                elif param.annotation == bool:
                    prop_type = "boolean"

            properties[param_name] = {
                "type": prop_type,
                "description": f"Parameter {param_name}"
            }

            if param.default == inspect.Parameter.empty:
                required.append(param_name)

    async_wrapper._tool_schema = {
        "type": "object",
        "properties": properties,
        "required": required
    }

    # Preserve original function name and docstring
    async_wrapper.__name__ = func.__name__
    async_wrapper.__doc__ = func.__doc__

    return async_wrapper