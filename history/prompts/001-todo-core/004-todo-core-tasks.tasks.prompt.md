---
id: 004
title: Implementation tasks for todo core
stage: tasks
date: 2025-12-31
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-todo-core
branch: 001-todo-core
user: unknown
command: /sp.tasks
labels: ["tasks", "todo-core", "backlog"]
links:
  spec: specs/001-todo-core/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-todo-core/tasks.md
tests:
  - 27 tasks generated including 6 test-specific tasks (TDD mandated)
---

## Prompt

/sp.tasks
Generate speckit.tasks for Phase I Todo In-Memory Python CLI App.

Rules:
- Base all tasks strictly on speckit.plan and speckit.specify
- No task should include implementation code
- Each task must be atomic and testable
- Each task must reference:
  - speckit.specify section
  - speckit.plan section

Cover tasks for:
- Data model
- In-memory storage
- Business logic
- CLI interface
- Application entry point
- Error handling

## Response snapshot

Generated 27 atomic tasks for `001-todo-core` implementation:
- Phase 1: Setup (T001-T003) - project structure, ruff, README.
- Phase 2: Foundational (T004-T008) - Task model, service skeleton, CLI base, DI.
- Phase 3: User Story 1 (T009-T014) - CRUD operations (add, list, delete) + Tests.
- Phase 4: User Story 2 (T015-T019) - Progress tracking (complete/incomplete) + Tests.
- Phase 5: User Story 3 (T020-T023) - Description updates + Tests.
- Phase 6: Polish (T024-T027) - Type hints, coverage, final validation.

All tasks follow the strict checklist format and provide exact file paths.

## Outcome

- ✅ Impact: Complete, actionable backlog created for implementation. Tasks are organized for incremental delivery and parallel execution where possible.
- 🧪 Tests: 6 targeted test tasks (Unit + Integration) ensure TDD compliance from the start.
- 📁 Files: `specs/001-todo-core/tasks.md`
- 🔁 Next prompts: /sp.implement to begin high-fidelity implementation
- 🧠 Reflection: Organizing tasks by user story maintains focus on deliverables and ensures each story is independently verifiable.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Implementation of foundational tasks
