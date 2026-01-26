import argparse
import sys
from typing import List
from todo.services.task_service import TaskService
from todo.services.exceptions import TodoError, TaskNotFoundError


class CLIHandler:
    """Handles CLI argument parsing and output formatting."""

    def __init__(self, service: TaskService) -> None:
        self.service = service
        self.parser = self._setup_parser()

    def _setup_parser(self) -> argparse.ArgumentParser:
        """Setup the main parser and subcommands."""
        parser = argparse.ArgumentParser(
            description="Phase I Todo In-Memory CLI App",
            prog="todo"
        )
        subparsers = parser.add_subparsers(dest="command", help="Available commands")

        # add command
        add_parser = subparsers.add_parser("add", help="Add a new task")
        add_parser.add_argument("description", help="Task description")
        add_parser.add_argument(
            "-c", "--category", default="General", help="Task category"
        )

        # list command
        list_parser = subparsers.add_parser("list", help="List tasks")
        list_parser.add_argument("-c", "--category", help="Filter by category")

        # list-categories command
        subparsers.add_parser("list-categories", help="List all unique categories")

        # complete command
        complete_parser = subparsers.add_parser("complete", help="Mark a task as complete")
        complete_parser.add_argument("id", type=int, help="Task ID")

        # incomplete command
        incomplete_parser = subparsers.add_parser("incomplete", help="Mark a task as incomplete")
        incomplete_parser.add_argument("id", type=int, help="Task ID")

        # update command
        update_parser = subparsers.add_parser("update", help="Update a task")
        update_parser.add_argument("id", type=int, help="Task ID")
        update_parser.add_argument("-d", "--description", help="New description")
        update_parser.add_argument("-c", "--category", help="New category")

        # delete command
        delete_parser = subparsers.add_parser("delete", help="Delete a task")
        delete_parser.add_argument("id", type=int, help="Task ID")

        return parser

    def run(self, args: List[str]) -> None:
        """Parse arguments and dispatch to command handlers."""
        if not args:
            self.parser.print_help()
            return

        parsed_args = self.parser.parse_args(args)

        try:
            self._dispatch(parsed_args)
        except TaskNotFoundError as e:
            print(str(e), file=sys.stderr)
            sys.exit(1)
        except TodoError as e:
            print(f"Error: {str(e)}", file=sys.stderr)
            sys.exit(1)
        except ValueError as e:
            print(f"Error: {str(e)}", file=sys.stderr)
            sys.exit(1)
        except Exception as e:
            print(f"Unexpected error: {str(e)}", file=sys.stderr)
            sys.exit(1)

    def _dispatch(self, args: argparse.Namespace) -> None:
        """Dispatch to specific command handlers."""
        if args.command == "add":
            self._handle_add(args.description, args.category)
        elif args.command == "list":
            self._handle_list(args.category)
        elif args.command == "list-categories":
            self._handle_list_categories()
        elif args.command == "complete":
            self._handle_complete(args.id)
        elif args.command == "incomplete":
            self._handle_incomplete(args.id)
        elif args.command == "update":
            self._handle_update(args.id, args.description, args.category)
        elif args.command == "delete":
            self._handle_delete(args.id)
        else:
            self.parser.print_help()

    def _handle_add(self, description: str, category: str) -> None:
        task = self.service.add_task(description, category)
        print(f"Added task: {task.description} [{task.category}] (ID: {task.id})")

    def _handle_list(self, category_filter: str = None) -> None:
        if category_filter:
            tasks = self.service.list_tasks(category=category_filter)
            if not tasks:
                print(f"No tasks found in category: {category_filter}")
                return
            print(f"Tasks in category: {category_filter}")
            self._print_task_table(tasks)
        else:
            tasks = self.service.list_tasks()
            if not tasks:
                print("No tasks found.")
                return

            # Group by category
            categories = self.service.get_categories()
            for cat in categories:
                cat_tasks = [t for t in tasks if t.category == cat]
                print(f"\n[{cat}]")
                self._print_task_table(cat_tasks)

    def _handle_list_categories(self) -> None:
        categories = self.service.get_categories()
        if not categories:
            print("No categories found.")
            return
        print("Categories:")
        for cat in categories:
            print(f"- {cat}")

    def _print_task_table(self, tasks: List) -> None:
        """Helper to print a formatted table of tasks."""
        print(f"{'ID':<4} {'Status':<8} {'Description'}")
        print("-" * 40)
        for task in tasks:
            status = "[x]" if task.is_completed else "[ ]"
            print(f"{task.id:<4} {status:<8} {task.description}")

    def _handle_complete(self, task_id: int) -> None:
        task = self.service.set_completed(task_id, True)
        print(f"Marked task {task_id} as complete.")

    def _handle_incomplete(self, task_id: int) -> None:
        task = self.service.set_completed(task_id, False)
        print(f"Marked task {task_id} as incomplete.")

    def _handle_update(
        self, task_id: int, description: str = None, category: str = None
    ) -> None:
        if description is None and category is None:
            print("Error: Nothing to update. Provide --description or --category.")
            return
        task = self.service.update_task(task_id, description, category)
        print(f"Updated task {task_id}.")

    def _handle_delete(self, task_id: int) -> None:
        self.service.delete_task(task_id)
        print(f"Deleted task with ID: {task_id}")
