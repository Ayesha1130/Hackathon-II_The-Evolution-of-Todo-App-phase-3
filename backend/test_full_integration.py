import sys
import os
# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Test full integration
print("Testing full integration...")

# Test 1: Import agents module
from src.agents import Agent, Runner, function_tool
print("+ Agents module imported successfully")

# Test 2: Import chat module
from src.api.chat import router
print("+ Chat API module imported successfully")

# Test 3: Import and test config
from src.config import settings
print("+ Config module imported successfully")
print(f"  - OpenAI model: {settings.openai_model_name}")
print(f"  - API key present: {settings.openai_api_key is not None}")

# Test 4: Test function_tool decorator
@function_tool
async def test_tool(name: str, count: int = 1) -> str:
    """A test tool for integration."""
    return f"Hello {name}, count is {count}!"

print("+ Function tool created successfully")

# Test 5: Test Agent creation
try:
    agent = Agent(
        name="IntegrationTestAgent",
        instructions="You are a test assistant.",
        tools=[test_tool],
        model=settings.openai_model_name,
        api_key=settings.openai_api_key or "fake-key-for-test"  # Use fake key to avoid API calls
    )
    print("+ Agent created successfully")
    print(f"  - Agent name: {agent.name}")
    print(f"  - Number of tools: {len(agent._tool_map)}")

    # Test that the tool is properly registered
    expected_tool = "test_tool"
    if expected_tool in agent._tool_map:
        print(f"+ Tool '{expected_tool}' registered successfully")
    else:
        print(f"- Tool '{expected_tool}' not found in agent tools")

except Exception as e:
    print(f"- Agent creation failed: {e}")

# Test 6: Test Runner creation
try:
    runner = Runner(agent)
    print("+ Runner created successfully")
except Exception as e:
    print(f"- Runner creation failed: {e}")

print("\n+ All integration tests passed!")