---
id: 002
title: Core todo feature specification
stage: spec
date: 2025-12-31
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-todo-core
branch: 001-todo-core
user: unknown
command: /sp.specify
labels: ["spec", "todo-core", "requirements"]
links:
  spec: specs/001-todo-core/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-todo-core/spec.md
  - specs/001-todo-core/checklists/requirements.md
tests:
  - Acceptance scenarios defined in spec.md
---

## Prompt

Create speckit.specify for Phase I Todo In-Memory CLI App.

Include:
- User journeys
- Functional requirements:
  - Add task
  - Delete task
  - Update task
  - View task list
  - Mark task complete/incomplete
- Non-functional requirements
- Acceptance criteria for each feature

Do not include implementation details.

## Response snapshot

Created feature specification for `001-todo-core`:
- 3 User Stories with priorities (P1: CRUD, P2: Status, P3: Update)
- 8 Functional Requirements (FR-001 to FR-008)
- 4 Non-Functional Requirements (In-memory, performance, UX, errors)
- 4 Measurable Success Criteria
- Quality checklist created and validated (all items passed)

## Outcome

- ✅ Impact: Established clear, testable requirements for the core todo functionality without implementation leak.
- 🧪 Tests: 6 Acceptance scenarios and 4 measurable outcomes defined.
- 📁 Files: `specs/001-todo-core/spec.md`, `specs/001-todo-core/checklists/requirements.md`
- 🔁 Next prompts: /sp.plan to design implementation architecture
- 🧠 Reflection: The prompt was straightforward. I used standard CRUD patterns for a CLI todo app and enforced the "in-memory only" constraint from the constitution.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Moving to architecture planning
