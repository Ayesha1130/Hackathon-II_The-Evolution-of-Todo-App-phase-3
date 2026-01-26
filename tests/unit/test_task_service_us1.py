import pytest
from todo.services.task_service import TaskService
from todo.models.task import Task


def test_add_task() -> None:
    service = TaskService()
    task = service.add_task("Test task")
    assert isinstance(task, Task)
    assert task.id == 1
    assert task.description == "Test task"
    assert task.category == "General"  # Check default category
    assert task.is_completed is False


def test_add_task_with_category() -> None:
    service = TaskService()
    task = service.add_task("Test task", "Study")
    assert task.category == "Study"


def test_list_tasks_empty() -> None:
    service = TaskService()
    assert service.list_tasks() == []


def test_list_tasks_populated() -> None:
    service = TaskService()
    service.add_task("Task 1")
    service.add_task("Task 2")
    tasks = service.list_tasks()
    assert len(tasks) == 2
    assert tasks[0].description == "Task 1"
    assert tasks[1].description == "Task 2"


def test_delete_task() -> None:
    service = TaskService()
    service.add_task("Task to delete")
    service.delete_task(1)
    assert service.list_tasks() == []


def test_add_task_empty_description() -> None:
    service = TaskService()
    with pytest.raises(ValueError, match="Task description cannot be empty"):
        service.add_task("")
