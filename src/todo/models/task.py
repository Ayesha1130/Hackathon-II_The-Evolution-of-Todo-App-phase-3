from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional


@dataclass
class Task:
    """Core domain object representing a todo item."""

    id: int
    description: str
    category: str = "General"
    is_completed: bool = False
    created_at: datetime = field(default_factory=datetime.now)

    def __post_init__(self) -> None:
        """Validate task fields after initialization."""
        if not self.description or not self.description.strip():
            raise ValueError("Task description cannot be empty")
        self.description = self.description.strip()

        if not self.category or not self.category.strip():
            self.category = "General"
        self.category = self.category.strip()

    def to_dict(self) -> dict:
        """Convert task to a JSON-serializable dictionary."""
        return {
            "id": self.id,
            "description": self.description,
            "category": self.category,
            "is_completed": self.is_completed,
            "created_at": self.created_at.isoformat(),
        }

    @classmethod
    def from_dict(cls, data: dict) -> "Task":
        """Reconstruct task from a dictionary."""
        return cls(
            id=data["id"],
            description=data["description"],
            category=data.get("category", "General"),
            is_completed=data["is_completed"],
            created_at=datetime.fromisoformat(data["created_at"]),
        )
