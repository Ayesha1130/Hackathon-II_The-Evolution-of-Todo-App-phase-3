---

description: "Task list for Phase I Todo Core implementation"
---

# Tasks: Phase I Todo Core

**Input**: Design documents from `/specs/001-todo-core/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: TDD approach is mandated by the constitution. All implementation tasks for user stories include test tasks that MUST be written and FAIL before implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/todo/`, `tests/` at repository root
- Paths shown below assume `src-layout` with `todo` package structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure (`src/todo/models`, `src/todo/services`, `src/todo/cli`, `tests/unit`, `tests/integration`)
- [x] T002 [P] Initialize Python project and configure ruff in `pyproject.toml`
- [x] T003 [P] Create initial `README.md` with usage instructions from `quickstart.md`

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create `Task` dataclass in `src/todo/models/task.py` per `data-model.md`
- [x] T005 Implement `TaskNotFoundError` and base exception handling logic in `src/todo/services/exceptions.py`
- [x] T006 [P] Create `TaskService` skeleton in `src/todo/services/task_service.py`
- [x] T007 Setup `argparse` base structure and `--help` in `src/todo/cli/handler.py`
- [x] T008 [P] Initialize dependency injection in `src/todo/__main__.py` (Main → CLIHandler → TaskService)

**Checkpoint**: Foundation ready - user story implementation can now begin in priority order

---

## Phase 3: User Story 1 - Basic Task Management (Priority: P1) 🎯 MVP

**Goal**: As a user, I want to add, list, and delete tasks so that I can keep track of my work in a simple list.

**Independent Test**: Use CLI to add "Task 1", "Task 2", list them, then delete "Task 1" and list again.

### Tests for User Story 1
> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T009 [P] [US1] Unit tests for `add_task`, `list_tasks`, and `delete_task` in `tests/unit/test_task_service_us1.py`
- [x] T010 [P] [US1] Integration tests for `add`, `list`, and `delete` commands in `tests/integration/test_cli_us1.py`

### Implementation for User Story 1

- [x] T011 [US1] Implement `add_task` with ID generation in `src/todo/services/task_service.py`
- [x] T012 [US1] Implement `list_tasks` and `delete_task` in `src/todo/services/task_service.py`
- [x] T013 [US1] Implement `add`, `list`, and `delete` subcommands in `src/todo/cli/handler.py`
- [x] T014 [US1] Add validation for empty description in `add_task` and catch `TaskNotFoundError` in CLI layer

**Checkpoint**: User Story 1 is fully functional and testable independently.

---

## Phase 4: User Story 2 - Task Progress Tracking (Priority: P2)

**Goal**: As a user, I want to mark tasks as complete or incomplete so that I can track what work I have finished.

**Independent Test**: Add task, complete it, list it to verify status, then uncomplete it and verify.

### Tests for User Story 2

- [x] T015 [P] [US2] Unit tests for `set_completed` in `tests/unit/test_task_service_us2.py`
- [x] T016 [P] [US2] Integration tests for `complete` and `incomplete` commands in `tests/integration/test_cli_us2.py`

### Implementation for User Story 2

- [x] T017 [US2] Implement `set_completed(task_id, completed)` in `src/todo/services/task_service.py`
- [x] T018 [US2] Implement `complete` and `incomplete` subcommands in `src/todo/cli/handler.py`
- [x] T019 [US2] Update `list` command display to show completion checkboxes `[ ]` vs `[x]`

**Checkpoint**: User Story 2 is functional and integrated.

---

## Phase 5: User Story 3 - Task Refinement (Priority: P3)

**Goal**: As a user, I want to update the description of an existing task so that I can correct typos or change task details.

**Independent Test**: Add task, update its description, verify with list.

### Tests for User Story 3

- [x] T020 [P] [US3] Unit tests for `update_task` in `tests/unit/test_task_service_us3.py`
- [x] T021 [P] [US3] Integration tests for `update` command in `tests/integration/test_cli_us3.py`

### Implementation for User Story 3

- [x] T022 [US3] Implement `update_task(task_id, description)` in `src/todo/services/task_service.py`
- [x] T023 [US3] Implement `update` subcommand in `src/todo/cli/handler.py`

**Checkpoint**: All core user stories are independently functional.

---

## Phase 6: Polish & Technical Debt

**Purpose**: Improvements and structural refinements

- [x] T024 [P] Verify type hints coverage using `mypy` or similar validation
- [x] T025 Run full test suite with coverage report (`pytest --cov=todo`)
- [x] T026 [P] Final documentation review and `README.md` cleanup
- [x] T027 Run `quickstart.md` manual validation flow
- [x] T028 Refactor project to `src-layout` with `todo` package structure and update all imports

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Phase 1 completion. BLOCKS ALL USER STORIES.
- **User Stories (Phase 3-5)**: All depend on Phase 2 completion.
  - US1 (Phase 3) is the MVP and should be completed first.
  - US2 and US3 are independent of each other but depend on the existence of tasks created in US1.
- **Polish (Phase 6)**: Depends on all user stories completion.

### Implementation Strategy

1. **MVP First**: Complete Phase 1, 2, and 3.
2. **STOP and VALIDATE**: Verify US1 works perfectly according to `spec.md`.
3. **Incremental Delivery**: Add Phase 4 (Status) then Phase 5 (Updates).
4. **Final Polish**: Complete Phase 6 and verify all success criteria from `spec.md`.
