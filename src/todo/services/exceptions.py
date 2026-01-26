class TodoError(Exception):
    """Base exception for all todo-related errors."""
    pass


class TaskNotFoundError(TodoError):
    """Raised when a task with a specific ID is not found."""

    def __init__(self, task_id: int):
        self.task_id = task_id
        super().__init__(f"Error: Task not found with ID {task_id}")


class ValidationError(TodoError):
    """Raised when task input validation fails."""
    pass
