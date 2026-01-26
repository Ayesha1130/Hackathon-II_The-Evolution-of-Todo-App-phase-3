import pytest
from todo.services.task_service import TaskService
from todo.cli.handler import CLIHandler


@pytest.fixture
def cli_handler() -> CLIHandler:
    service = TaskService()
    return CLIHandler(service)


def test_cli_update_task(cli_handler: CLIHandler, capsys: pytest.CaptureFixture[str]) -> None:
    cli_handler.run(["add", "Original"])
    cli_handler.run(["update", "1", "--description", "Updated"])
    out, err = capsys.readouterr()
    assert "Updated task 1." in out


def test_cli_update_non_existent(cli_handler: CLIHandler, capsys: pytest.CaptureFixture[str]) -> None:
    with pytest.raises(SystemExit):
        cli_handler.run(["update", "999", "--description", "New"])
    out, err = capsys.readouterr()
    assert "Error: Task not found with ID 999" in err
