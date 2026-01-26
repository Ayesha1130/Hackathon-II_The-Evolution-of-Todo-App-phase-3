#!/usr/bin/env python3
"""
Test script to verify the agents module is working correctly.
"""

import asyncio
import sys
import os

# Add the src directory to the path so we can import the modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from agents import Agent, Runner, function_tool
from config import settings


@function_tool
async def sample_tool(name: str, age: int = 25) -> str:
    """A sample tool for testing."""
    return f"Hello {name}, you are {age} years old!"


async def test_agents_module():
    """Test the agents module functionality."""
    print("Testing agents module...")

    # Create a sample agent
    agent = Agent(
        name="TestAgent",
        instructions="You are a helpful assistant.",
        tools=[sample_tool],
        model="gpt-4-turbo-preview",
        api_key=settings.openai_api_key
    )

    print(f"Created agent: {agent.name}")
    print(f"Tools: {[tool.__name__ for tool in agent._tool_map.values()]}")

    # Test with a simple history
    history = [
        {"role": "user", "content": "Say hello!"}
    ]

    print("\nTesting stream_async...")
    try:
        runner = Runner(agent)
        response_chunks = []

        # Collect all chunks
        async for chunk in runner.stream_async(history):
            response_chunks.append(chunk)
            print(f"Received chunk: {chunk}")

        full_response = "".join(response_chunks)
        print(f"\nFull response: {full_response}")

        print("\n✓ Agents module test passed!")
        return True

    except Exception as e:
        print(f"\n✗ Agents module test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    if not settings.openai_api_key:
        print("Warning: OPENAI_API_KEY not set. Tests may fail due to missing API key.")
        print("Please set OPENAI_API_KEY in your environment or .env file.")

    success = asyncio.run(test_agents_module())
    sys.exit(0 if success else 1)