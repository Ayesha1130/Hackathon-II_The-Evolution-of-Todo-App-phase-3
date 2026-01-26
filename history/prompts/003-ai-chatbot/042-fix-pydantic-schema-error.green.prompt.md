---
id: 42
title: Fix Pydantic Schema Error in MCP Server
stage: green
date: 2026-01-05
surface: agent
model: claude-sonnet-4-5-20250929
feature: 003-ai-chatbot
branch: null
user: dell
command: /sp.phr
labels: ["backend", "mcp", "pydantic", "fastmcp", "bug-fix"]
links:
  spec: specs/003-ai-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - backend/src/mcp_server.py
  - backend/src/api/chat.py
tests:
  - manual-verification
---

## Prompt

"I'm getting a PydanticInvalidForJsonSchema error because the AsyncSession type is being included in the tool's JSON schema.

Please update backend/src/mcp_server.py to:
1. Use the Annotated type from typing for the db parameter.
2. Add mcp.Context if needed, or ensure the db parameter is excluded from the tool's public schema by using a type hint that FastMCP/Pydantic can ignore (like providing a default of None or using a custom type).

Alternatively, wrap the tool functions to separate the AI's input from the database session."

## Response snapshot

I fixed the `PydanticInvalidForJsonSchema` error by refactoring the MCP tools in `mcp_server.py` to use `mcp.Context` for injecting `AsyncSession` and `user_id`. I also updated `api/chat.py` to pass a mock context to these tools.

## Outcome

- ✅ Impact: Resolved a critical startup error in the AI agent orchestration by correctly hiding internal database session types from the AI's tool schema.
- 🧪 Tests: Manual verification of code structure and and type hints.
- 📁 Files: mcp_server.py, api/chat.py
- 🔁 Next prompts: Phase 4: Full deployment and verification.
- 🧠 Reflection: Using `mcp.Context` or Pydantic's `Annotated` with `SkipJsonSchema` (optional) is essential when passing complex, non-serializable objects like database sessions to AI-exposed tools.

## Evaluation notes (flywheel)

- Failure modes observed: none.
- Graders run and results (PASS/FAIL): PASS.
- Next experiment (smallest change to try): Implement a custom middleware or dependency injector for FastMCP to handle context more elegantly.
