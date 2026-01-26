import pytest
import sys
from io import StringIO
from todo.services.task_service import TaskService
from todo.cli.handler import CLIHandler


@pytest.fixture
def cli_handler() -> CLIHandler:
    service = TaskService()
    return CLIHandler(service)


def test_cli_add_task(cli_handler: CLIHandler, capsys: pytest.CaptureFixture[str]) -> None:
    cli_handler.run(["add", "Buy milk"])
    out, err = capsys.readouterr()
    assert "Added task: Buy milk [General] (ID: 1)" in out


def test_cli_add_task_with_category(cli_handler: CLIHandler, capsys: pytest.CaptureFixture[str]) -> None:
    cli_handler.run(["add", "Study math", "--category", "School"])
    out, err = capsys.readouterr()
    assert "Added task: Study math [School] (ID: 1)" in out


def test_cli_list_tasks(cli_handler: CLIHandler, capsys: pytest.CaptureFixture[str]) -> None:
    cli_handler.run(["add", "Task 1"])
    cli_handler.run(["list"])
    out, err = capsys.readouterr()
    assert "1" in out
    assert "Task 1" in out


def test_cli_delete_task(cli_handler: CLIHandler, capsys: pytest.CaptureFixture[str]) -> None:
    cli_handler.run(["add", "To delete"])
    cli_handler.run(["delete", "1"])
    out, err = capsys.readouterr()
    assert "Deleted task with ID: 1" in out


def test_cli_delete_non_existent(cli_handler: CLIHandler, capsys: pytest.CaptureFixture[str]) -> None:
    with pytest.raises(SystemExit):
        cli_handler.run(["delete", "999"])
    out, err = capsys.readouterr()
    assert "Error: Task not found with ID 999" in err
