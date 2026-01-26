# Quickstart: AI-Powered Todo Chatbot (Phase 3)

## Prerequisites
- OpenAI API Key (Environment variable `OPENAI_API_KEY`)
- Phase 2 Backend (`FastAPI`) and Frontend (`Next.js`) running.

## Backend Setup
1. **Migrations**: Run `alembic upgrade head` to create `conversations` and `messages` tables.
2. **MCP Server**: Start the local MCP server (if running separately) or ensure the FastAPI app initializes `FastMCP`.
3. **Agent Service**: Verify the `OpenAI Agents SDK` is configured with the correct model and tools.

## Frontend Setup
1. **Dependencies**: Run `npm install @openai/chatkit-react`.
2. **Layout**: Navigate to `/chat` in the application to access the new conversational UI.

## Testing the AI
1. Login to the application.
2. Go to the Chat page.
3. Type: "List my tasks".
4. Type: "Add a task to drink more water".
5. Verify the task appears in the main dashboard.
6. Type: "Goodbye" and check for the exit intent response.
