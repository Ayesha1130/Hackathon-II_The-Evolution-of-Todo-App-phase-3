# Research: AI-Powered Todo Chatbot

## Decision: OpenAI Agents SDK for Orchestration
- **Rationale**: Provides a Python-native, clean interface for tool calling and multi-agent logic if needed in the future. Better alignment with OpenAI's newer SDKs compared to LangChain for simple agentic tasks.
- **Alternatives considered**:
  - **LangChain**: Too heavy for this scope.
  - **Manual API calls**: Hard to manage tool call loops and context windowing.

## Decision: FastMCP for Tool Exposure
- **Rationale**: Part of the official MCP SDK. Allows us to expose local `task_service` methods as standard tools that the Agent can consume via a uniform protocol.
- **Alternatives considered**:
  - **Custom JSON Schemas**: High maintenance; MCP automates the schema generation from type hints and docstrings.

## Decision: OpenAI ChatKit for Frontend
- **Rationale**: Minimal setup for conversational interfaces in Next.js. Handles message streaming and state syncing with the backend session secret.
- **Alternatives considered**:
  - **Custom React state**: Requires building the entire message list, streaming logic, and UI (bubble system) from scratch.

## Decision: Stateless History Loading
- **Rationale**: To keep the Backend scalable and simple, we will fetch the last 10 messages from the DB and inject them into the Agents SDK `Runner.run` call for every incoming POST request.
- **Alternatives considered**:
  - **Persistent Sessions**: Agent SDK supports `SQLiteSession`, but this adds complexity to a distributed or multiple-worker setup.
