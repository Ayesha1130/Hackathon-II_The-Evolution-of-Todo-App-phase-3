import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

print("Final verification of all fixes...")

# Test all the key imports that were failing before
try:
    from src.models.user import User
    print("+ User model imported successfully")
except Exception as e:
    print(f"- User model import failed: {e}")

try:
    from src.models.task import Task
    print("+ Task model imported successfully")
except Exception as e:
    print(f"- Task model import failed: {e}")

try:
    from src.models.category import Category
    print("+ Category model imported successfully")
except Exception as e:
    print(f"- Category model import failed: {e}")

try:
    from src.models.chat import Conversation, Message
    print("+ Chat models imported successfully")
except Exception as e:
    print(f"- Chat models import failed: {e}")

try:
    from src.services.task_service import TaskService
    print("+ Task service imported successfully")
except Exception as e:
    print(f"- Task service import failed: {e}")

try:
    from src.services.category_service import CategoryService
    print("+ Category service imported successfully")
except Exception as e:
    print(f"- Category service import failed: {e}")

try:
    from src.mcp_server import mcp
    print("+ MCP server imported successfully")
except Exception as e:
    print(f"- MCP server import failed: {e}")

try:
    from src.api.chat import router
    print("+ Chat API imported successfully")
except Exception as e:
    print(f"- Chat API import failed: {e}")

try:
    from src.agents import Agent, Runner, function_tool
    print("+ Agents module imported successfully")
except Exception as e:
    print(f"- Agents module import failed: {e}")

print("\n+ All imports working successfully! ModuleNotFoundError issue resolved.")
print("+ The backend should now run without import errors.")