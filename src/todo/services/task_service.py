from typing import List, Optional, Tuple
from todo.models.task import Task
from todo.services.exceptions import TaskNotFoundError
from todo.services.persistence import PersistenceStrategy


class TaskService:
    """Manages the life cycle of tasks with optional persistence."""

    def __init__(self, persistence: Optional[PersistenceStrategy] = None) -> None:
        self._persistence = persistence
        if self._persistence:
            self._tasks, self._next_id = self._persistence.load()
        else:
            self._tasks: List[Task] = []
            self._next_id: int = 1

    def _persist(self) -> None:
        """Helper to trigger persistence if strategy is available."""
        if self._persistence:
            self._persistence.save(self._tasks, self._next_id)

    def add_task(self, description: str, category: str = "General") -> Task:
        """Add a new task."""
        task = Task(id=self._next_id, description=description, category=category)
        self._tasks.append(task)
        self._next_id += 1
        self._persist()
        return task

    def list_tasks(self, category: Optional[str] = None) -> List[Task]:
        """List tasks, optionally filtered by category."""
        if category:
            return [
                t for t in self._tasks if t.category.lower() == category.strip().lower()
            ]
        return self._tasks

    def get_categories(self) -> List[str]:
        """Get a sorted list of unique categories."""
        return sorted(list(set(task.category for task in self._tasks)))

    def update_task(
        self,
        task_id: int,
        description: Optional[str] = None,
        category: Optional[str] = None,
    ) -> Task:
        """Update a task's fields."""
        task = self._find_task(task_id)

        if description is not None:
            if not description.strip():
                raise ValueError("Task description cannot be empty")
            task.description = description.strip()

        if category is not None:
            if not category.strip():
                task.category = "General"
            else:
                task.category = category.strip()

        self._persist()
        return task

    def set_completed(self, task_id: int, completed: bool) -> Task:
        """Set completion status of a task."""
        task = self._find_task(task_id)
        task.is_completed = completed
        self._persist()
        return task

    def delete_task(self, task_id: int) -> None:
        """Delete a task."""
        task = self._find_task(task_id)
        self._tasks.remove(task)
        self._persist()

    def _find_task(self, task_id: int) -> Task:
        """Find a task by its ID or raise TaskNotFoundError."""
        for task in self._tasks:
            if task.id == task_id:
                return task
        raise TaskNotFoundError(task_id)
