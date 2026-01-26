# API Contract: Chat API

## Endpoint: POST /api/v1/chat

**URL**: `/api/v1/chat`
**Method**: `POST`
**Auth**: Required (Bearer JWT)

### Request Body
```json
{
  "content": "Add a task to buy groceries",
  "conversation_id": "optional-uuid-string"
}
```

### Response (200 OK)
```json
{
  "conversation_id": "uuid-string",
  "message": {
    "role": "assistant",
    "content": "I've added 'buy groceries' to your tasks."
  },
  "tool_calls": [
    {
      "name": "add_task",
      "args": {"description": "buy groceries"}
    }
  ]
}
```

### Error Responses
- **401 Unauthorized**: Missing or invalid token.
- **400 Bad Request**: Missing required fields.
- **500 Internal Server Error**: Agent logic or tool call failed.

## Tool Definitions (MCP Server)
- `add_task(description, priority?, category_id?)`
- `list_tasks(status?, category_id?)`
- `complete_task(task_id)`
- `delete_task(task_id)`
- `update_task(task_id, description?, priority?)`
