---
id: 36
title: Research technical details for AI Chatbot implementation
stage: misc
date: 2026-01-05
surface: agent
model: claude-sonnet-4-5-20250929
feature: 003-ai-chatbot
branch: null
user: dell
command: research
labels: ["openai-agents-sdk", "chatkit", "mcp", "sqlmodel", "history-management"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - none
tests:
 - none
---

## Prompt

Research technical details for:
1. OpenAI Agents SDK: How to define an agent with tools and handle stateless conversation history loading.
2. OpenAI ChatKit: How to integrate it into a Next.js 14 (App Router) project with the existing Tailwind/Axios setup.
3. Official MCP SDK (Python): How to create an MCP server that exposes local service methods (task_service, category_service) as tools.
4. SQLModel/SQLAlchemy: Mapping relationships for Conversation and Message with User and Task.
Identify best practices for stateless chat history management in a FastAPI/Next.js stack.

## Response snapshot

I have completed the technical research for the AI Chatbot implementation:
- OpenAI Agents SDK: Defined tools via decorators and managed history using `Runner.run` with manual list injection or `SQLiteSession`.
- OpenAI ChatKit: Integrated via a backend session endpoint and a frontend widget using `@openai/chatkit-react` and `useChatKit`.
- MCP SDK: Used `FastMCP` with `@mcp.tool()` decorators to expose local service methods.
- SQLModel: Defined relationships between User, Task, Conversation, and Message using `Relationship` attributes and `back_populates`.
- History Management: Recommended a multi-tier approach including Redis for short-term cache and SQL for long-term persistence.

## Outcome

- ✅ Impact: Provided architectural and technical foundation for Phase 3 AI Chatbot.
- 🧪 Tests: n/a
- 📁 Files: Created PHR 036.
- 🔁 Next prompts: Proceed with ADR creation if architectural decisions are finalized.
- 🧠 Reflection: The research successfully addressed all five points with specific code patterns and SDK references.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): n/a
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
