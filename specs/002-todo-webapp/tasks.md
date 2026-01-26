---

description: "Implementation tasks for full-stack Todo web application"
---

# Tasks: Todo Web Application

**Input**: Design documents from `/specs/002-todo-webapp/`
**Prerequisites**: plan.md (✅ complete), spec.md (✅ complete)

**Tests**: Include unit and integration tests for backend; component and E2E tests for frontend

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Project Setup (Shared Infrastructure)

**Purpose**: Initialize project structure for both frontend and backend

- [ ] T001 [P] Create backend/ directory structure per plan.md
- [ ] T002 [P] Create frontend/ directory structure per plan.md
- [ ] T003 [P] Create shared/ directory for TypeScript types
- [ ] T004 Initialize backend project with pyproject.toml and Python 3.13
- [ ] T005 Initialize frontend project with Next.js 14, TypeScript, Tailwind
- [ ] T006 [P] Configure ruff linting for backend (pyproject.toml)
- [ ] T007 [P] Configure ESLint and Prettier for frontend
- [ ] T008 Create .env.example files for backend/ and frontend/
- [ ] T009 Create .gitignore for full-stack project

**Checkpoint**: Project structure ready, both frontend and backend can be developed independently

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Backend Foundation

- [ ] T010 Setup Neon PostgreSQL connection in backend/src/config.py
- [ ] T011 [P] Create SQLAlchemy models (User, Task, Category) in backend/src/models/
- [ ] T012 [P] Create Pydantic schemas in backend/src/schemas/
- [ ] T013 Create database engine and session management in backend/src/models/database.py
- [ ] T014 Setup Alembic for database migrations in backend/alembic/
- [ ] T015 Implement password hashing with bcrypt in backend/src/utils/security.py
- [ ] T016 Implement JWT token creation/validation in backend/src/utils/security.py
- [ ] T017 Create authentication dependencies (get_current_user) in backend/src/api/deps.py
- [ ] T018 Setup FastAPI app with CORS middleware in backend/src/main.py
- [ ] T019 [P] Implement basic error handling and exception handlers
- [ ] T020 [P] Setup logging configuration in backend/src/config.py

### Frontend Foundation

- [ ] T021 [P] Setup Next.js 14 app with App Router structure
- [ ] T022 [P] Configure Tailwind CSS with design tokens matching reference
- [ ] T023 Create API client wrapper in frontend/src/lib/api/client.ts
- [ ] T024 Create TypeScript types in shared/types/index.ts
- [ ] T025 Setup Better Auth client configuration in frontend/src/lib/auth/client.ts
- [ ] T026 Create auth hooks (useAuth) in frontend/src/lib/auth/hooks.ts
- [ ] T027 [P] Create shared UI components (Button, Input, Card, Badge, Modal) in frontend/src/components/ui/
- [ ] T028 [P] Create layout components (Header, Sidebar) in frontend/src/components/layout/
- [ ] T029 Setup React Query provider and query client in frontend/src/app/layout.tsx

### Database & Migration

- [ ] T030 Run initial Alembic migration to create tables
- [ ] T031 Verify database connection and run health check

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Account Creation & Authentication (Priority: P1) 🎯 MVP

**Goal**: Users can create accounts and log in to access their personalized dashboard

**Independent Test**: Complete signup flow, receive confirmation, log in, access dashboard - delivers secure, persistent task management

### Backend Tests for US1

- [ ] T032 [P] [US1] Unit test for password hashing in backend/tests/unit/test_security.py
- [ ] T033 [P] [US1] Unit test for JWT token creation/validation in backend/tests/unit/test_security.py
- [ ] T034 [P] [US1] Integration test for POST /auth/signup in backend/tests/integration/test_auth.py
- [ ] T035 [P] [US1] Integration test for POST /auth/login in backend/tests/integration/test_auth.py

### Backend Implementation for US1

- [ ] T036 [US1] Implement signup endpoint in backend/src/api/auth.py
- [ ] T037 [US1] Implement login endpoint in backend/src/api/auth.py
- [ ] T038 [US1] Implement logout endpoint in backend/src/api/auth.py
- [ ] T039 [US1] Implement token refresh endpoint in backend/src/api/auth.py
- [ ] T040 [US1] Add input validation for email/password in auth schemas
- [ ] T041 [US1] Add rate limiting middleware for auth endpoints

### Frontend Tests for US1

- [ ] T042 [P] [US1] Unit test for SignupForm component in frontend/tests/unit/auth/SignupForm.test.tsx
- [ ] T043 [P] [US1] Unit test for LoginForm component in frontend/tests/unit/auth/LoginForm.test.tsx
- [ ] T044 [P] [US1] E2E test for signup flow in frontend/tests/e2e/auth.spec.ts

### Frontend Implementation for US1

- [ ] T045 [US1] Create SignupForm component in frontend/src/components/auth/SignupForm.tsx
- [ ] T046 [US1] Create LoginForm component in frontend/src/components/auth/LoginForm.tsx
- [ ] T047 [US1] Create login page at frontend/src/app/(auth)/login/page.tsx
- [ ] T048 [US1] Create signup page at frontend/src/app/(auth)/signup/page.tsx
- [ ] T049 [US1] Integrate Better Auth with signup flow
- [ ] T050 [US1] Add form validation with error messages
- [ ] T051 [US1] Redirect to dashboard on successful auth

**Checkpoint**: Users can create accounts, log in, and access protected dashboard

---

## Phase 4: User Story 2 - Dashboard & Task List View (Priority: P1) 🎯 MVP

**Goal**: Users see their tasks displayed in a clean, organized list matching the reference design

**Independent Test**: Log in and view dashboard with tasks displayed per design - delivers immediate task visibility

### Backend Tests for US2

- [ ] T052 [P] [US2] Integration test for GET /tasks in backend/tests/integration/test_tasks.py

### Backend Implementation for US2

- [ ] T053 [US2] Create TaskService with list_tasks method in backend/src/services/task_service.py
- [ ] T054 [US2] Implement GET /tasks endpoint with category/status filters in backend/src/api/tasks.py

### Frontend Tests for US2

- [ ] T055 [P] [US2] Unit test for TaskList component in frontend/tests/unit/components/TaskList.test.tsx
- [ ] T056 [P] [US2] Unit test for TaskItem component in frontend/tests/unit/components/TaskItem.test.tsx
- [ ] T057 [P] [US2] E2E test for dashboard view in frontend/tests/e2e/dashboard.spec.ts

### Frontend Implementation for US2

- [ ] T058 [US2] Create TaskItem component in frontend/src/components/tasks/TaskItem.tsx
- [ ] T059 [US2] Create TaskList component in frontend/src/components/tasks/TaskList.tsx
- [ ] T060 [US2] Create useTasks React Query hook in frontend/src/hooks/useTasks.ts
- [ ] T061 [US2] Implement dashboard page at frontend/src/app/(dashboard)/page.tsx
- [ ] T062 [US2] Create dashboard layout with sidebar at frontend/src/app/(dashboard)/layout.tsx
- [ ] T063 [US2] Style task cards to match reference design (checkbox, priority badge, status)
- [ ] T064 [US2] Handle empty state with "Add your first task" prompt

**Checkpoint**: Dashboard displays all user tasks matching reference design

---

## Phase 5: User Story 3 - Task CRUD Operations (Priority: P1) 🎯 MVP

**Goal**: Users can create, read, update, and delete tasks

**Independent Test**: Create a task, view it, update its description, delete it - delivers complete task management

### Backend Tests for US3

- [ ] T065 [P] [US3] Unit test for TaskService CRUD methods in backend/tests/unit/test_task_service.py
- [ ] T066 [P] [US3] Integration test for POST /tasks in backend/tests/integration/test_tasks.py
- [ ] T067 [P] [US3] Integration test for PUT /tasks/:id in backend/tests/integration/test_tasks.py
- [ ] T068 [P] [US3] Integration test for DELETE /tasks/:id in backend/tests/integration/test_tasks.py

### Backend Implementation for US3

- [ ] T069 [US3] Implement add_task method in backend/src/services/task_service.py
- [ ] T070 [US3] Implement update_task method in backend/src/services/task_service.py
- [ ] T071 [US3] Implement delete_task method in backend/src/services/task_service.py
- [ ] T072 [US3] Implement POST /tasks endpoint in backend/src/api/tasks.py
- [ ] T073 [US3] Implement GET /tasks/:id endpoint in backend/src/api/tasks.py
- [ ] T074 [US3] Implement PUT /tasks/:id endpoint in backend/src/api/tasks.py
- [ ] T075 [US3] Implement DELETE /tasks/:id endpoint in backend/src/api/tasks.py
- [ ] T076 [US3] Add input validation for task descriptions (non-empty, trimmed)

### Frontend Tests for US3

- [ ] T077 [P] [US3] Unit test for TaskForm component in frontend/tests/unit/components/TaskForm.test.tsx
- [ ] T078 [P] [US3] E2E test for task creation/deletion in frontend/tests/e2e/tasks.spec.ts

### Frontend Implementation for US3

- [ ] T079 [US3] Create TaskForm component in frontend/src/components/tasks/TaskForm.tsx
- [ ] T080 [US3] Add "Add Task" button and modal trigger in dashboard
- [ ] T081 [US3] Implement task creation with description input
- [ ] T082 [US3] Add edit functionality to TaskItem (edit button opens modal)
- [ ] T083 [US3] Implement task deletion with confirmation dialog
- [ ] T084 [US3] Connect form to React Query hooks for optimistic updates

**Checkpoint**: Users can fully manage tasks (create, read, update, delete)

---

## Phase 6: User Story 4 - Task Completion Toggle (Priority: P1) 🎯 MVP

**Goal**: Users can mark tasks as complete/incomplete to track progress

**Independent Test**: Check/uncheck tasks and verify status changes - delivers progress visualization

### Backend Tests for US4

- [ ] T085 [P] [US4] Integration test for PATCH /tasks/:id/toggle in backend/tests/integration/test_tasks.py

### Backend Implementation for US4

- [ ] T086 [US4] Implement set_completed method in backend/src/services/task_service.py
- [ ] T087 [US4] Implement PATCH /tasks/:id/toggle endpoint in backend/src/api/tasks.py

### Frontend Tests for US4

- [ ] T088 [P] [US4] Unit test for TaskCheckbox component in frontend/tests/unit/components/TaskCheckbox.test.tsx
- [ ] T089 [P] [US4] E2E test for completion toggle in frontend/tests/e2e/tasks.spec.ts

### Frontend Implementation for US4

- [ ] T090 [US4] Create TaskCheckbox component in frontend/src/components/tasks/TaskCheckbox.tsx
- [ ] T091 [US4] Integrate checkbox with toggle API endpoint
- [ ] T092 [US4] Add optimistic update for immediate UI feedback
- [ ] T093 [US4] Apply green styling and strikethrough for completed tasks
- [ ] T094 [US4] Add status filter (All/Active/Completed) in sidebar

**Checkpoint**: Users can toggle task completion with visual feedback

---

## Phase 7: User Story 5 - Category/Project Organization (Priority: P2)

**Goal**: Users can organize tasks by category for work, personal, and other life areas

**Independent Test**: Create tasks in different categories, filter by category - delivers organized task visibility

### Backend Tests for US5

- [ ] T095 [P] [US5] Unit test for CategoryService in backend/tests/unit/test_category_service.py
- [ ] T096 [P] [US5] Integration test for GET /categories in backend/tests/integration/test_categories.py

### Backend Implementation for US5

- [ ] T097 [US5] Implement CategoryService in backend/src/services/category_service.py
- [ ] T098 [US5] Create category endpoints in backend/src/api/categories.py:
  - GET /categories (list)
  - POST /categories (create)
  - PUT /categories/:id (update)
  - DELETE /categories/:id (delete)
- [ ] T099 [US5] Update task endpoints to accept category_id

### Frontend Tests for US5

- [ ] T100 [P] [US5] Unit test for CategoryList component in frontend/tests/unit/components/CategoryList.test.tsx
- [ ] T101 [P] [US5] E2E test for category filtering in frontend/tests/e2e/categories.spec.ts

### Frontend Implementation for US5

- [ ] T102 [US5] Create CategoryList component in frontend/src/components/categories/CategoryList.tsx
- [ ] T103 [US5] Add category selection to TaskForm
- [ ] T104 [US5] Implement sidebar category filtering
- [ ] T105 [US5] Create category management page at frontend/src/app/(dashboard)/categories/page.tsx
- [ ] T106 [US5] Auto-create categories when adding tasks with new category names

**Checkpoint**: Users can organize tasks by category with sidebar filtering

---

## Phase 8: User Story 6 - Priority Management (Priority: P2)

**Goal**: Users can set priority levels (High/Medium/Low) with color-coded badges

**Independent Test**: Create tasks with different priorities, verify color badges - delivers visual urgency indicators

### Backend Tests for US6

- [ ] T107 [P] [US6] Integration test for priority in task schemas in backend/tests/unit/test_schemas.py

### Backend Implementation for US6

- [ ] T108 [US6] Update Task schema to include priority enum (high/medium/low)
- [ ] T109 [US6] Update Task model to include priority field with default 'medium'
- [ ] T110 [US6] Add priority filter to GET /tasks endpoint

### Frontend Tests for US6

- [ ] T111 [P] [US6] Unit test for PriorityBadge component in frontend/tests/unit/components/PriorityBadge.test.tsx

### Frontend Implementation for US6

- [ ] T112 [US6] Create PriorityBadge component in frontend/src/components/tasks/PriorityBadge.tsx
- [ ] T113 [US6] Add priority selector to TaskForm (High/Medium/Low dropdown)
- [ ] T114 [US6] Style badges: High=Red, Medium=Amber, Low=Green
- [ ] T115 [US6] Update TaskItem to display priority badge
- [ ] T116 [US6] Add priority filter in sidebar

**Checkpoint**: Tasks display color-coded priority badges

---

## Phase 9: User Story 7 - Progress Analytics (Priority: P3)

**Goal**: Users see statistics about task completion for motivation

**Independent Test**: Complete tasks, view dashboard statistics - delivers productivity feedback

### Backend Tests for US7

- [ ] T117 [P] [US7] Integration test for GET /stats in backend/tests/integration/test_stats.py

### Backend Implementation for US7

- [ ] T118 [US7] Implement stats endpoint in backend/src/api/stats.py:
  - Total tasks count
  - Completed tasks count
  - Completion percentage
  - Tasks by priority
  - Tasks by category

### Frontend Tests for US7

- [ ] T119 [P] [US7] Unit test for ProgressWidget in frontend/tests/unit/components/ProgressWidget.test.tsx
- [ ] T120 [P] [US7] Unit test for StatsCard in frontend/tests/unit/components/StatsCard.test.tsx

### Frontend Implementation for US7

- [ ] T121 [US7] Create ProgressWidget component in frontend/src/components/stats/ProgressWidget.tsx
- [ ] T122 [US7] Create StatsCard component in frontend/src/components/stats/StatsCard.tsx
- [ ] T123 [US7] Create useStats hook in frontend/src/hooks/useStats.ts
- [ ] T124 [US7] Add statistics display to dashboard sidebar
- [ ] T125 [US7] Display "X tasks completed" style cards matching reference design

**Checkpoint**: Dashboard shows productivity statistics

---

## Phase 10: User Story 8 - Responsive Mobile Design (Priority: P2)

**Goal**: App works well on mobile devices for task management on the go

**Independent Test**: Access app on mobile viewport, verify layout adapts - delivers anywhere access

### Frontend Implementation for US8

- [ ] T126 [US8] Implement responsive grid/flex layouts with Tailwind breakpoints
- [ ] T127 [US8] Create mobile navigation (hamburger menu) in Header component
- [ ] T128 [US8] Make touch targets large enough (min 44px) for mobile taps
- [ ] T129 [US8] Ensure TaskForm works well as modal on mobile
- [ ] T130 [US8] Test and fix layout issues on iPhone and Android viewports
- [ ] T131 [US8] Ensure sidebar collapses to hamburger menu on mobile

### Testing for US8

- [ ] T132 [P] [US8] Manual testing checklist for mobile viewport
- [ ] T133 [P] [US8] Verify touch interactions work correctly

**Checkpoint**: App is fully functional on mobile devices

---

## Phase 11: Data Import Script

**Purpose**: Migrate Phase 1 JSON data to PostgreSQL

- [ ] T134 Create import script at scripts/import_phase1.py
- [ ] T135 Read .todo_tasks.json from Phase 1
- [ ] T136 Parse JSON and create database records for each task
- [ ] T137 Handle category migration (create categories from task categories)
- [ ] T138 Add user association (require --user-id flag or interactive selection)
- [ ] T139 Add dry-run mode for testing
- [ ] T140 Document import process in IMPORT.md

---

## Phase 12: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

### Documentation

- [ ] T141 Update README.md with full-stack setup instructions
- [ ] T142 Create IMPORT.md for Phase 1 data migration
- [ ] T143 Update quickstart.md with development workflow

### Testing & Quality

- [ ] T144 Run full backend test suite with coverage report
- [ ] T145 Run full frontend test suite with coverage report
- [ ] T146 Fix any linting issues in backend (ruff)
- [ ] T147 Fix any linting issues in frontend (ESLint)
- [ ] T148 Achieve 80%+ test coverage on critical paths

### Security

- [ ] T149 Audit environment variables for missing secrets
- [ ] T150 Verify CORS is restricted to frontend origins
- [ ] T151 Add rate limiting for unauthenticated endpoints

### Performance

- [ ] T152 Add database indexes for common query patterns
- [ ] T153 Configure response compression in FastAPI
- [ ] T154 Verify Lighthouse score 90+ for frontend

### User Experience

- [ ] T155 Add loading states (spinners) for async operations
- [ ] T156 Add toast notifications for success/error feedback
- [ ] T157 Add empty states for all list views
- [ ] T158 Add confirmation dialogs for destructive actions (delete)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 - **BLOCKS all user stories**
- **Phase 3-10 (User Stories)**: All depend on Phase 2
  - User stories can proceed in parallel after Phase 2
  - Or sequentially in priority order (P1 → P2 → P3)
- **Phase 11 (Import)**: Depends on Phase 2 (database ready)
- **Phase 12 (Polish)**: Depends on all desired user stories

### User Story Dependencies

| Story | Priority | Can Start After |
|-------|----------|-----------------|
| US1 | P1 | Phase 2 complete |
| US2 | P1 | Phase 2 complete |
| US3 | P1 | Phase 2 complete |
| US4 | P1 | Phase 2 complete + US2 (for list view) |
| US5 | P2 | Phase 2 complete |
| US6 | P2 | Phase 2 complete + US3 (for task form) |
| US7 | P3 | Phase 2 complete + US4 (for stats) |
| US8 | P2 | Phase 3 complete (dashboard layout) |

### Parallel Opportunities

- All Setup tasks (T001-T009) marked [P] can run in parallel
- All Foundational tasks (T010-T029) marked [P] can run in parallel
- Once Foundational is done, all user stories can start in parallel
- Tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel

---

## Implementation Strategy

### MVP First (P1 Stories Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: Authentication (US1)
4. Complete Phase 4: Dashboard (US2)
5. Complete Phase 5: Task CRUD (US3)
6. Complete Phase 6: Completion Toggle (US4)
7. **STOP and VALIDATE**: Test P1 stories independently
8. Deploy/demo MVP with basic task management

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add US1 → Test → Deploy/Demo (Auth ready!)
3. Add US2 → Test → Deploy/Demo (Dashboard ready!)
4. Add US3 → Test → Deploy/Demo (CRUD ready!)
5. Add US4 → Test → Deploy/Demo (Toggle ready!)
6. Continue with P2/P3 stories...

---

## Task Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| Phase 1 | T001-T009 | Project Setup |
| Phase 2 | T010-T031 | Foundational Infrastructure |
| Phase 3 | T032-T051 | US1: Authentication |
| Phase 4 | T052-T064 | US2: Dashboard View |
| Phase 5 | T065-T084 | US3: Task CRUD |
| Phase 6 | T085-T094 | US4: Completion Toggle |
| Phase 7 | T095-T106 | US5: Categories |
| Phase 8 | T107-T116 | US6: Priority Management |
| Phase 9 | T117-T125 | US7: Progress Analytics |
| Phase 10 | T126-T133 | US8: Mobile Design |
| Phase 11 | T134-T140 | Data Import Script |
| Phase 12 | T141-T158 | Polish & Cross-Cutting |

**Total Tasks: 158**

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
