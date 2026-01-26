import json
import os
from abc import ABC, abstractmethod
from typing import List, Tuple
from todo.models.task import Task


class PersistenceStrategy(ABC):
    """Abstract base class for task persistence."""

    @abstractmethod
    def save(self, tasks: List[Task], next_id: int) -> None:
        """Save tasks and the next ID counter."""
        pass

    @abstractmethod
    def load(self) -> Tuple[List[Task], int]:
        """Load tasks and the next ID counter."""
        pass


class JSONPersistenceStrategy(PersistenceStrategy):
    """JSON file-based persistence strategy."""

    def __init__(self, file_path: str) -> None:
        self.file_path = file_path

    def save(self, tasks: List[Task], next_id: int) -> None:
        """Serialize tasks and ID to a JSON file."""
        data = {
            "next_id": next_id,
            "tasks": [task.to_dict() for task in tasks]
        }
        with open(self.file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4)

    def load(self) -> Tuple[List[Task], int]:
        """Deserialize tasks and ID from a JSON file."""
        if not os.path.exists(self.file_path):
            return [], 1

        try:
            with open(self.file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                next_id = data.get("next_id", 1)
                tasks = [Task.from_dict(t) for t in data.get("tasks", [])]
                return tasks, next_id
        except (json.JSONDecodeError, KeyError, ValueError):
            # Fallback for corrupted or old-format files
            return [], 1
