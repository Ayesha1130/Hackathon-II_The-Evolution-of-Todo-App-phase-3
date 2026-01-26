---
id: 007
title: List Tasks by Category
stage: misc
date: 2025-12-31
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-todo-core
branch: 001-todo-core
user: dell
command: none
labels: ["feature", "categories", "listing", "grouping"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/todo/services/task_service.py
 - src/todo/cli/handler.py
 - tests/integration/test_cli_us2.py
 - tests/integration/test_category_list.py
tests:
 - pytest tests
---

## Prompt

list tasks by category

## Response snapshot

I've enhanced the `list` command to automatically group tasks by category when no filter is provided. I also added a `--category` (or `-c`) filter to the `list` command to show tasks for a specific category only. Additionally, I added a new `list-categories` command to display all unique categories currently in use. Existing tests were updated, and new integration tests for category listing and filtering were added.

## Outcome

- ✅ Impact: Users can now better organize and view their tasks by category.
- 🧪 Tests: 24 tests passed (added new tests for category listing).
- 📁 Files: Modified service and CLI handler, updated tests, and created a new test file.
- 🔁 Next prompts: None.
- 🧠 Reflection: Grouping tasks by category visually in the CLI provides a better overview than a single table with a category column.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
