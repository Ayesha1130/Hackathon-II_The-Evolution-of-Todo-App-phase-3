#!/usr/bin/env python3
"""
Basic test script to verify the agents module structure is working correctly.
"""

import sys
import os

# Add the src directory to the path so we can import the modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from agents import Agent, Runner, function_tool


@function_tool
async def sample_tool(name: str, age: int = 25) -> str:
    """A sample tool for testing."""
    return f"Hello {name}, you are {age} years old!"


def test_agents_structure():
    """Test the basic structure of the agents module."""
    print("Testing agents module structure...")

    # Test function_tool decorator
    print(f"Function tool name: {sample_tool.__name__}")
    print(f"Is function tool: {hasattr(sample_tool, '_is_function_tool')}")
    print(f"Has schema: {hasattr(sample_tool, '_tool_schema')}")

    # Test Agent creation (without API key to avoid network calls)
    try:
        agent = Agent(
            name="TestAgent",
            instructions="You are a helpful assistant.",
            tools=[sample_tool],
            model="gpt-4-turbo-preview",
            api_key="sk-fake-test-key"  # Fake key to avoid actual API calls during testing
        )

        print(f"Created agent: {agent.name}")
        print(f"Number of tools: {len(agent._tool_map)}")

        # Test that tools are registered
        expected_tool_names = [tool.__name__ for tool in [sample_tool]]
        actual_tool_names = list(agent._tool_map.keys())
        print(f"Registered tools: {actual_tool_names}")

        assert actual_tool_names == expected_tool_names, f"Expected {expected_tool_names}, got {actual_tool_names}"

        print("\n✓ Basic agents module structure test passed!")
        return True

    except Exception as e:
        print(f"\n✗ Basic agents module structure test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    success = test_agents_structure()
    sys.exit(0 if success else 1)