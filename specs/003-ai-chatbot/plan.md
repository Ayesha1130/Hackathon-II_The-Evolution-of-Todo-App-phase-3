# Implementation Plan: AI-Powered Todo Chatbot

**Branch**: `003-ai-chatbot` | **Date**: 2026-01-05 | **Spec**: [specs/003-ai-chatbot/spec.md](spec.md)
**Input**: Feature specification from `/specs/003-ai-chatbot/spec.md`

## Summary

The goal is to evolve the existing Todo application into an AI-powered ecosystem using natural language. We will implement a backend **MCP Server** (FastMCP) to expose local task services as tools, an **Agent Orchestrator** (OpenAI Agents SDK) to process user intents and manage tool calls, and a **Conversational Frontend** (OpenAI ChatKit) integrated into the Next.js app. The system will persist conversations and messages in the PostgreSQL database while maintaining a stateless API layer.

## Technical Context

**Language/Version**: Python 3.12 (Backend), TypeScript/Next.js 14 (Frontend)
**Primary Dependencies**:
- Backend: `openai-agents-sdk`, `mcp-sdk`, `fastapi`, `sqlmodel`
- Frontend: `@openai/chatkit-react`, `axios`, `react-query`
**Storage**: PostgreSQL (Neon) for Tasks, Categories, Conversations, and Messages.
**Testing**: `pytest` (Backend), `jest`/`testing-library` (Frontend)
**Target Platform**: Web (Next.js 14 App Router)
**Project Type**: Web application (Frontend + Backend)
**Performance Goals**: < 1s response time for agent intent recognition (excluding tool execution).
**Constraints**: Stateless backend (sessions managed via DB records), JWT-only authentication.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Smallest viable diff: Focus only on Chat and MCP Server.
- [x] No hardcoded secrets: Use `.env` for OpenAI Keys.
- [x] Testable: Every MCP tool must have a corresponding integration test.

## Project Structure

### Documentation (this feature)

```text
specs/003-ai-chatbot/
├── plan.md              # This file
├── research.md          # Research findings on Agents SDK & ChatKit
├── data-model.md        # Conversation and Message entities
├── quickstart.md        # Setup guide for the chatbot
├── contracts/           # API contract for /chat endpoint
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── api/
│   │   └── chat.py      # New chat endpoint
│   ├── models/
│   │   ├── conversation.py
│   │   └── message.py
│   ├── services/
│   │   └── agent_service.py # OpenAI Agents entry point
│   └── mcp/
│       └── server.py        # FastMCP Server definition
└── tests/

frontend/
├── src/
│   ├── app/
│   │   └── chat/        # Conversational UI route
│   ├── components/
│   │   └── chat/        # ChatKit wraps
│   └── services/
│       └── chat.service.ts
└── tests/
```

**Structure Decision**: Web application structure. Backend extends the existing FastAPI layout with a new `/mcp` and `/api/chat` layer. Frontend adds a dedicated chat route and components.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| MCP Server | Standardizing tool access for multiple potential agents | Simple function calls are harder to scale for external tools |
| Stateless History | Scalability and easier multi-device sync | In-memory session is not persistent across restarts |
