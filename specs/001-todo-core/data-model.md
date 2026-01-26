# Data Model: Phase I Todo Core

## Task Entity

The core domain object representing a todo item.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `id` | `int` | Unique identifier | Positive integer, auto-generated |
| `description` | `str` | Task summary | Required, non-empty, stripped of whitespace |
| `is_completed` | `bool` | Current status | Default `False` |
| `created_at` | `datetime` | When task was added | System-generated on creation |

## Persistence Mapping (In-Memory)

- **Collection**: `List[Task]`
- **ID Source**: A simple `_next_id: int` counter in the `TaskService`
- **Search**: Linear search by ID for small lists; can be optimized with a dict mapping if performance becomes an issue (not expected in Phase I).
