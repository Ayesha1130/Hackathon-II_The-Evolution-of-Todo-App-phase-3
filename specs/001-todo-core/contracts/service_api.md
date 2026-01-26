# TaskService Interface Contract

The `TaskService` manages the in-memory life cycle of tasks.

## Methods

### `add_task(description: str) -> Task`
- **Input**: Raw description string
- **Logic**: Validate, generate ID, set timestamp, append to list
- **Output**: The newly created `Task` object

### `list_tasks() -> List[Task]`
- **Output**: All tasks in order of creation

### `update_task(task_id: int, description: str) -> Task`
- **Input**: Target ID, new description
- **Errors**: `TaskNotFoundError` if ID invalid
- **Output**: The updated `Task` object

### `set_completed(task_id: int, completed: bool) -> Task`
- **Input**: Target ID, status flag
- **Errors**: `TaskNotFoundError` if ID invalid
- **Output**: The updated `Task` object

### `delete_task(task_id: int) -> None`
- **Input**: Target ID
- **Errors**: `TaskNotFoundError` if ID invalid
