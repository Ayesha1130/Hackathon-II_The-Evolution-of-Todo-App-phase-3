# Data Model: AI-Powered Todo Chatbot

## Entities

### Conversation
- **id**: `String(36)` (PK, UUID)
- **user_id**: `String(36)` (FK -> users.id, Indexed)
- **created_at**: `DateTime`
- **updated_at**: `DateTime`
- **Relationships**:
  - Has many **Messages**
  - Belongs to one **User**

### Message
- **id**: `String(36)` (PK, UUID)
- **conversation_id**: `String(36)` (FK -> conversations.id, Indexed)
- **role**: `Enum` (user, assistant, system, tool)
- **content**: `Text` (Markdown support)
- **timestamp**: `DateTime`
- **Relationships**:
  - Belongs to one **Conversation**

## State Transitions
- **New Chat**: Create `Conversation` -> Create first `Message` (user).
- **Agent Response**: Create `Message` (assistant or tool).
- **Cleaning/Exit**: No logical deletion of data, but the UI clears the local `conversation_id` state.
