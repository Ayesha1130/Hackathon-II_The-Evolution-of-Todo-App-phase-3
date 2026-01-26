import sys
from todo.services.task_service import TaskService
from todo.services.persistence import JSONPersistenceStrategy
from todo.cli.handler import CLIHandler


def main() -> None:
    """Application entry point and dependency injection container."""
    # Wire up dependencies
    persistence = JSONPersistenceStrategy(".todo_tasks.json")
    service = TaskService(persistence=persistence)
    handler = CLIHandler(service)

    # Run the application
    handler.run(sys.argv[1:])


if __name__ == "__main__":
    main()
