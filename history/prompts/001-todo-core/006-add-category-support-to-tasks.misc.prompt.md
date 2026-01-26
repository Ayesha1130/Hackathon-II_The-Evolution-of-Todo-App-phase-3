---
id: 006
title: Add Category Support to Tasks
stage: misc
date: 2025-12-31
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-todo-core
branch: 001-todo-core
user: dell
command: none
labels: ["feature", "categories", "cli"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/todo/models/task.py
 - src/todo/services/task_service.py
 - src/todo/cli/handler.py
 - tests/unit/test_task_service_us1.py
 - tests/unit/test_task_service_us3.py
 - tests/integration/test_cli_us1.py
 - tests/integration/test_cli_us2.py
 - tests/integration/test_cli_us3.py
tests:
 - pytest tests
---

## Prompt

Now, I want to **add categories** for tasks so that each task can belong to a category like Study, Work, Personal, Health.

Requirements:
1. The `add` command should accept an optional `--category` argument.
2. If no category is provided, default should be "General".
3. The `list` command should display the category of each task in its output.
4. Keep all existing functionality working.
5. The code should remain clean, modular, and ready-to-run.

## Response snapshot

I've updated the `Task` model, `TaskService`, and `CLIHandler` to support categories. The `add` and `update` commands now support the `--category` (or `-c`) flag, and the `list` command displays the category column. Existing tests have been updated to reflect the new interface and output format.

## Outcome

- ✅ Impact: Tasks can now be categorized, improving organization in the CLI app.
- 🧪 Tests: 21 tests passed (3 added, 4 updated for interface changes).
- 📁 Files: Modified core model, service, and CLI handler, plus all related tests.
- 🔁 Next prompts: None.
- 🧠 Reflection: Updating the CLI interface (positional -> flags for update) broke existing integration tests, requiring a sweep of the test suite.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
