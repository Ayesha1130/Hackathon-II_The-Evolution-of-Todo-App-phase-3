from todo.services.task_service import TaskService


def test_update_task() -> None:
    service = TaskService()
    service.add_task("Original")
    task = service.update_task(1, description="Updated")
    assert task.description == "Updated"


def test_update_category() -> None:
    service = TaskService()
    service.add_task("Test task")
    task = service.update_task(1, category="Work")
    assert task.category == "Work"
    assert task.description == "Test task"


def test_update_task_empty() -> None:
    service = TaskService()
    service.add_task("Original")
    import pytest
    with pytest.raises(ValueError, match="Task description cannot be empty"):
        service.update_task(1, "")
