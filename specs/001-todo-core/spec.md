# Feature Specification: Phase I Todo Core

**Feature Branch**: `001-todo-core`
**Created**: 2025-12-31
**Status**: Draft
**Input**: User description: "Phase I Todo In-Memory CLI App. Include: User journeys, Functional requirements (Add task, Delete task, Update task, View task list, Mark task complete/incomplete), Non-functional requirements, Acceptance criteria for each feature. Do not include implementation details."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Basic Task Management (Priority: P1)

As a user, I want to add, list, and delete tasks so that I can keep track of my work in a simple list.

**Why this priority**: Correctly managing the lifecycle of a task is the core value proposition. Without this, the app has no utility.

**Independent Test**: Can be fully tested by adding three tasks, listing them to verify they appear correctly, and then deleting one to verify it disappears while others remain.

**Acceptance Scenarios**:

1. **Given** no tasks exist, **When** I add a task with description "Buy milk", **Then** the task "Buy milk" is saved as incomplete.
2. **Given** "Buy milk" exists, **When** I list all tasks, **Then** "Buy milk" appears in the output with its status.
3. **Given** "Buy milk" exists with ID 1, **When** I delete task with ID 1, **Then** "Buy milk" is removed and listing tasks shows an empty list.

---

### User Story 2 - Task Progress Tracking (Priority: P2)

As a user, I want to mark tasks as complete or incomplete so that I can track what work I have finished.

**Why this priority**: Tracking completion status is what distinguishes a todo list from a simple scratchpad.

**Independent Test**: Can be fully tested by creating a task, marking it complete, verifying the status change in the list, and then marking it incomplete again to verify the toggle works.

**Acceptance Scenarios**:

1. **Given** an incomplete task "Submit report", **When** I mark it as complete, **Then** the task status is updated to "Complete".
2. **Given** a complete task "Submit report", **When** I mark it as incomplete, **Then** the task status is updated back to "Incomplete".

---

### User Story 3 - Task Refinement (Priority: P3)

As a user, I want to update the description of an existing task so that I can correct typos or change task details.

**Why this priority**: Helps maintain data accuracy without needing to delete and recreate tasks.

**Independent Test**: Can be fully tested by adding a task, updating its description, and verifying the new description appears in the list.

**Acceptance Scenarios**:

1. **Given** a task with description "Email John", **When** I update its description to "Email John about the project", **Then** the task description is updated and the list reflects the new name.

---

### Edge Cases

- **Invalid ID**: What happens when a user tries to update, delete, or complete a task with an ID that does not exist?
- **Empty Description**: How does the system handle an attempt to add a task with no description or only whitespace?
- **Duplicate Tasks**: Does the system allow multiple tasks with the exact same description? (Assumption: Yes, they are distinguished by ID).
- **ID Reuse**: After deleting a task, does its ID get reused immediately? (Assumption: No, IDs should increment for a single session to avoid confusion).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to add new tasks with a text description.
- **FR-002**: System MUST assign a unique numerical identifier (ID) to each new task.
- **FR-003**: System MUST allow users to view a list of all existing tasks, including their ID, description, and completion status.
- **FR-004**: System MUST allow users to mark a task as complete using its numerical ID.
- **FR-005**: System MUST allow users to mark a task as incomplete using its numerical ID.
- **FR-006**: System MUST allow users to update the description of an existing task using its ID.
- **FR-007**: System MUST allow users to delete a task permanently using its ID.
- **FR-008**: System MUST validate that the provided task ID exists before attempting update, status change, or deletion.

### Non-Functional Requirements

- **NFR-001**: **Volatile Storage**: All data MUST be kept in-memory; no persistence to disk or database.
- **NFR-002**: **Performance**: CLI response time for any operation MUST be under 100ms.
- **NFR-003**: **UX**: CLI output MUST be formatted in a clear, readable tabular or list-based format. The application MUST be runnable as a Python module using `python -m todo`.
- **NFR-004**: **Error Handling**: System MUST provide human-readable error messages for invalid inputs (e.g., non-numeric IDs, empty descriptions).
- **NFR-005**: **Structure**: System MUST follow the `src-layout` standard with the core logic contained within the `todo` package.

### Key Entities *(include if feature involves data)*

- **Task**: Represents a single item in the todo list.
  - **ID**: Unique numerical identifier.
  - **Description**: Textual summary of the task.
  - **Status**: Boolean or Enum representing whether it is Complete or Incomplete.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: User can add a task and see it in the list in under 3 seconds total interaction time.
- **SC-002**: 100% of valid operations (add, list, update, complete, delete) succeed as expected.
- **SC-003**: 100% of invalid operations (invalid IDs, empty input) result in a helpful error message without crashing.
- **SC-004**: All data is successfully cleared when the CLI application exits (verifying in-memory constraint).
