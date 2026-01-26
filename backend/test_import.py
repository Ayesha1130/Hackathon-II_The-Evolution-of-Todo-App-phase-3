import sys
import os
# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import the chat module
try:
    from src.api.chat import router
    print("SUCCESS: Chat API module imports successfully")
except ImportError as e:
    print(f"IMPORT ERROR: {e}")
    import traceback
    traceback.print_exc()
except Exception as e:
    print(f"OTHER ERROR: {e}")
    import traceback
    traceback.print_exc()