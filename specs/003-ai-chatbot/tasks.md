# Tasks: AI-Powered Todo Chatbot

**Input**: Design documents from `/specs/003-ai-chatbot/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are NOT explicitly requested as a separate TDD phase, but integration validation is required at each story checkpoint.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 [P] Install backend dependencies (`openai-agents-sdk`, `mcp-sdk`) in `backend/pyproject.toml`
- [ ] T002 [P] Install frontend dependencies (`@openai/chatkit-react`) in `frontend/package.json`
- [ ] T003 Configure environment variables (OPENAI_API_KEY) in `.env` templates

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure for data persistence and agent connectivity

- [ ] T004 [P] Create Conversation model in `backend/src/models/conversation.py`
- [ ] T005 [P] Create Message model in `backend/src/models/message.py`
- [ ] T006 [P] Update `backend/src/models/__init__.py` to export new models
- [ ] T007 Generate and run Alembic migration for new tables in `backend/alembic/versions/`
- [ ] T008 [P] Initialize FastMCP server in `backend/src/mcp/server.py`
- [ ] T009 [P] Implement base Agent logic in `backend/src/services/agent_service.py`
- [ ] T010 Implement stateless history retrieval service in `backend/src/services/history_service.py`

**Checkpoint**: Foundation ready - Data models and core AI services are in place.

---

## Phase 3: User Story 1 - Natural Language Task Creation (Priority: P1) 🎯 MVP

**Goal**: Allow users to create tasks using natural language prompts.

**Independent Test**: Send "Add task buy milk" to chat and verify task exists in DB.

### Implementation for User Story 1

- [ ] T011 [P] [US1] Define `add_task` tool in `backend/src/mcp/server.py`
- [ ] T012 [US1] Implement POST `/api/v1/chat` endpoint in `backend/src/api/chat.py`
- [ ] T013 [P] [US1] Create Chat interface page in `frontend/src/app/chat/page.tsx`
- [ ] T014 [US1] Integrate ChatKit Provider and Chat Component in `frontend/src/app/chat/page.tsx`
- [ ] T015 [US1] Implement message persistence (save to DB) in `/api/v1/chat` logic

**Checkpoint**: User Story 1 (MVP) is fully functional.

---

## Phase 4: User Story 2 - Task Management via Chat (Priority: P1)

**Goal**: List, toggle, and delete tasks through conversation.

**Independent Test**: Use commands like "list my tasks" and verify the output matches active tasks.

### Implementation for User Story 2

- [ ] T016 [P] [US2] Define `list_tasks` and `complete_task` tools in `backend/src/mcp/server.py`
- [ ] T017 [P] [US2] Define `delete_task` and `update_task` tools in `backend/src/mcp/server.py`
- [ ] T018 [US2] Update Agent instructions in `backend/src/services/agent_service.py` to handle management intents.
- [ ] T019 [US2] Refine Chat UI bubble components for tool output display in `frontend/src/components/chat/`

**Checkpoint**: Full conversational task management suite is complete.

---

## Phase 5: User Story 3 - Conversational Context & Continuity (Priority: P2)

**Goal**: Ensure the agent remembers previous turns in the current conversation.

**Independent Test**: Ask "What did I just add?" and verify the correct response.

### Implementation for User Story 3

- [ ] T020 [US3] Implement context-windowing for history retrieval in `backend/src/services/history_service.py` (fetch last N messages)
- [ ] T021 [US3] Update chat API to handle and return `conversation_id` for session continuity.

---

## Phase 6: User Story 4 - Ending the Conversation (Priority: P3)

**Goal**: Friendly exit/goodbye logic and session cleanup.

**Independent Test**: Send "bye" and confirm the agent provides a closing message.

### Implementation for User Story 4

- [ ] T022 [US4] Add "Exit/Goodbye" intent detection to agent instructions in `backend/src/services/agent_service.py`
- [ ] T023 [P] [US4] Implement clear-session handler in frontend chat hook in `frontend/src/hooks/useChat.ts`

---

## Phase 7: Polish & Cross-Cutting Concerns

- [ ] T024 [P] Add Loading/Streaming indicators to the Chat UI.
- [ ] T025 [P] Security hardening: Ensure agent cannot perform actions outside user context.
- [ ] T026 Final validation of `quickstart.md` scenarios.

---

## Dependencies & Execution Order

1. **Phase 1 & 2** are strictly blocking. Models and migrations MUST exist before any AI logic.
2. **Phase 3 (US1)** is the MVP. It must be completed and tested before moving to management or context tasks.
3. **Phase 4 & 5** can proceed in parallel once Phase 3 integration is verified.
4. **Phase 6 & 7** are for refinement and final polish.
