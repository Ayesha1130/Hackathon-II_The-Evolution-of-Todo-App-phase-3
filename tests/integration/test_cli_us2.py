import pytest
from todo.services.task_service import TaskService
from todo.cli.handler import CLIHandler


@pytest.fixture
def cli_handler() -> CLIHandler:
    service = TaskService()
    return CLIHandler(service)


def test_cli_complete_task(cli_handler: CLIHandler, capsys: pytest.CaptureFixture[str]) -> None:
    cli_handler.run(["add", "Task 1"])
    cli_handler.run(["complete", "1"])
    out, err = capsys.readouterr()
    assert "Marked task 1 as complete." in out


def test_cli_incomplete_task(cli_handler: CLIHandler, capsys: pytest.CaptureFixture[str]) -> None:
    cli_handler.run(["add", "Task 1"])
    cli_handler.run(["complete", "1"])
    cli_handler.run(["incomplete", "1"])
    out, err = capsys.readouterr()
    assert "Marked task 1 as incomplete." in out


def test_cli_list_shows_status(cli_handler: CLIHandler, capsys: pytest.CaptureFixture[str]) -> None:
    cli_handler.run(["add", "Incomplete task"])
    cli_handler.run(["add", "Complete task"])
    cli_handler.run(["complete", "2"])
    cli_handler.run(["list"])
    out, err = capsys.readouterr()
    assert "[General]" in out
    assert "1    [ ]      Incomplete task" in out
    assert "2    [x]      Complete task" in out
