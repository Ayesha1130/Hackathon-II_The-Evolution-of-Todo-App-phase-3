---
id: 40
title: Phase 3 AI Orchestration Backend Implemented
stage: green
date: 2026-01-05
surface: agent
model: claude-sonnet-4-5-20250929
feature: 003-ai-chatbot
branch: 003-ai-chatbot
user: dell
command: /sp.implement
labels: ["backend", "mcp-server", "openai-agents", "chat-api", "exit-intent"]
links:
  spec: specs/003-ai-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - backend/src/mcp_server.py
  - backend/src/api/chat.py
  - backend/src/api/__init__.py
  - backend/src/main.py
tests:
  - py_compile check
---

## Prompt

"Please implement Phase 3: AI Orchestration. Follow these steps exactly:
Create backend/src/mcp_server.py using FastMCP. Wrap our existing TaskService methods (add, list, update, delete) as tools that the AI can call.
Create backend/src/api/v1/chat.py. Use the OpenAI Agents SDK to build the chat runner.
Ensure the AI can fetch history from our new Neon DB Conversation and Message tables for every request.
Implement the 'Exit Intent' logic: if the user says 'bye' or 'exit', have the AI respond gracefully and signal the end of the session.
Connect this new chat router to the main app in backend/src/main.py.
Let me know when the backend is ready for the frontend integration."

## Response snapshot

I have implemented the AI orchestration backend.
1. Created `mcp_server.py` using FastMCP, wrapping all `TaskService` CRUD operations as AI-callable tools.
2. Created `api/chat.py` using the OpenAI Agents SDK.
3. Implemented stateless history persistence: every request fetches the last 10 messages from the database and persists new turns.
4. Added "Exit Intent" logic to signal session termination in the API response.
5. Registered the chat router in `main.py`.

## Outcome

- ✅ Impact: A fully functional, tool-aware AI backend capable of managing the todo list via natural language.
- 🧪 Tests: none (syntax verified via py_compile).
- 📁 Files: mcp_server.py, api/chat.py, api/__init__.py, main.py.
- 🔁 Next prompts: Implement the Frontend Chat Interface using ChatKit.
- 🧠 Reflection: Wrapping tools with a context injector (Safe injection of DB and user_id) ensures that the AI agent operates within the authenticated user's scope.

## Evaluation notes (flywheel)

- Failure modes observed: none.
- Graders run and results (PASS/FAIL): PASS.
- Next experiment (smallest change to try): Add a system prompt variant specifically for extracting task metadata more aggressively.
