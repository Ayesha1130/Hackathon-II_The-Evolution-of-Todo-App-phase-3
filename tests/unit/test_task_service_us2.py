from todo.services.task_service import TaskService


def test_set_completed_true() -> None:
    service = TaskService()
    service.add_task("Test task")
    task = service.set_completed(1, True)
    assert task.is_completed is True


def test_set_completed_false() -> None:
    service = TaskService()
    service.add_task("Test task")
    service.set_completed(1, True)
    task = service.set_completed(1, False)
    assert task.is_completed is False
