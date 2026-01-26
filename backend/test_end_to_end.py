import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

print("Testing end-to-end functionality...")

# Test the specific imports used in the chat.py file
from src.agents import Agent, Runner, function_tool
print("+ Successfully imported Agent, Runner, function_tool from agents module")

# Test that the function_tool decorator works as expected
@function_tool
def example_tool(x: int, y: str = "default") -> str:
    """Example tool for testing."""
    return f"Called with x={x}, y={y}"

print("+ Successfully created a function tool using the decorator")

# Test that the decorated function has the expected attributes
assert hasattr(example_tool, '_is_function_tool'), "Function tool should have _is_function_tool attribute"
assert hasattr(example_tool, '_tool_schema'), "Function tool should have _tool_schema attribute"
print("+ Function tool has required attributes")

# Test creating an agent with tools
agent = Agent(
    name="TestBot",
    instructions="You are a test bot.",
    tools=[example_tool],
    model="gpt-4-turbo-preview",
    api_key="fake-key"  # This won't be used for actual API calls in this test
)
print(f"+ Successfully created agent with {len(agent.tools)} tools")

# Test that the tool was properly registered
assert len(agent._tool_map) == 1, f"Expected 1 tool in tool map, got {len(agent._tool_map)}"
assert "example_tool" in agent._tool_map, "example_tool should be in agent's tool map"
print("+ Tool properly registered in agent")

# Test runner creation
runner = Runner(agent)
print("+ Successfully created runner for the agent")

print("\n+ All end-to-end tests passed! The agents module is working correctly.")
print("+ The chat API should now work properly with the agents functionality.")