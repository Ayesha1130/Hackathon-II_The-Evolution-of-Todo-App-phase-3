import pytest
from todo.services.task_service import TaskService
from todo.cli.handler import CLIHandler

@pytest.fixture
def cli_handler() -> CLIHandler:
    service = TaskService()
    return CLIHandler(service)

def test_cli_list_filter_category(cli_handler: CLIHandler, capsys: pytest.CaptureFixture[str]) -> None:
    cli_handler.run(["add", "Work task", "--category", "Work"])
    cli_handler.run(["add", "Home task", "--category", "Home"])
    capsys.readouterr()  # Clear buffer

    # Filter by Work
    cli_handler.run(["list", "--category", "Work"])
    out, err = capsys.readouterr()
    assert "Tasks in category: Work" in out
    assert "Work task" in out
    assert "Home task" not in out

def test_cli_list_categories(cli_handler: CLIHandler, capsys: pytest.CaptureFixture[str]) -> None:
    cli_handler.run(["add", "Task 1", "--category", "A"])
    cli_handler.run(["add", "Task 2", "--category", "B"])

    cli_handler.run(["list-categories"])
    out, err = capsys.readouterr()
    assert "Categories:" in out
    assert "- A" in out
    assert "- B" in out

def test_cli_list_grouping(cli_handler: CLIHandler, capsys: pytest.CaptureFixture[str]) -> None:
    cli_handler.run(["add", "Task 1", "--category", "Work"])
    cli_handler.run(["add", "Task 2", "--category", "Home"])

    cli_handler.run(["list"])
    out, err = capsys.readouterr()
    assert "[Work]" in out
    assert "Task 1" in out
    assert "[Home]" in out
    assert "Task 2" in out
