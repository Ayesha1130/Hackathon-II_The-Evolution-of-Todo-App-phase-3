<!--
Sync Impact Report:
- Version change: (none) → 1.0.0
- Modified principles: (none - initial creation)
- Added sections: All (initial creation)
- Removed sections: (none)
- Templates requiring updates:
  - ✅ plan-template.md - Constitution Check section aligned
  - ✅ spec-template.md - Scope/requirements alignment verified
  - ✅ tasks-template.md - Task categorization verified
  - ✅ phr-template.prompt.md - PHR creation verified
- Follow-up TODOs: none
-->

# Todo Console Constitution

## Core Principles

### I. Spec-Driven Development (NON-NEGOTIABLE)

Every feature MUST start with a written specification before any code is written. Specifications MUST be approved before implementation begins.

**Rules:**
- All features MUST be specified in `specs/<feature>/spec.md` before implementation
- Specs MUST include user stories with priorities (P1, P2, P3...)
- Each user story MUST be independently testable and deliverable
- Implementation MUST strictly follow the specification
- Deviations from spec MUST be documented and approved

**Rationale:** Prevents scope creep, ensures alignment with user needs, enables incremental delivery, and makes development predictable and measurable.

### II. Clean Architecture

Application MUST follow clean architecture principles with clear separation of concerns and dependency inversion.

**Rules:**
- Domain models MUST be independent of infrastructure
- Services layer MUST contain business logic only
- CLI layer MUST be thin - orchestration only, no business logic
- Dependencies MUST point inward (CLI → Services → Models)
- No cross-layer shortcuts - layers communicate through interfaces only
- Each module MUST have a single, well-defined responsibility

**Layer Structure:**
- `src/models/` - Domain entities, no external dependencies
- `src/services/` - Business logic, depends on models only
- `src/cli/` - Command-line interface, depends on services only

**Rationale:** Enables independent testing, easy refactoring, and maintainability. Clear boundaries make the codebase understandable at a glance.

### III. In-Memory Only

Data MUST be stored in-memory only during application runtime. No file I/O, no database persistence.

**Rules:**
- All data structures MUST be in-memory (lists, dicts, sets, objects)
- NO database connections, files, or external storage
- NO persistence between application runs - fresh start on every execution
- Data loss on restart is EXPECTED behavior for this phase
- All state MUST be Python objects in process memory

**Rationale:** Eliminates complexity of storage, allows focusing on core functionality and architecture. This is explicitly Phase I scope.

### IV. CLI-First Interaction

All functionality MUST be accessible through command-line interface. No web UI, no GUI, no API endpoints.

**Rules:**
- User interaction via `stdin`, command-line arguments, and `stdout`
- Errors MUST go to `stderr`
- Commands MUST be discoverable via help flags (`--help`, `-h`)
- Output MUST be human-readable by default
- Support for structured output (JSON) when requested
- CLI must be self-documenting and intuitive

**Command Design:**
- Verbs for actions (add, list, complete, delete)
- Nouns for entities (todo, task)
- Flags for options (`--priority`, `--tag`)

**Rationale:** Simplicity, scriptability, focus on core value without UI overhead. CLI is the foundation for future layers.

### V. Test-Driven Development

Tests MUST be written before implementation. Red-Green-Refactor cycle is mandatory for all features.

**Rules:**
- Tests MUST be written BEFORE implementation code
- Tests MUST initially FAIL (Red)
- Implement code to make tests PASS (Green)
- Refactor ONLY after tests pass
- Each user story MUST have acceptance tests
- Unit tests for services and models
- Integration tests for CLI commands
- Test coverage must be >= 80%

**Test Organization:**
- `tests/unit/` - Unit tests for models and services
- `tests/integration/` - CLI command integration tests
- Use `pytest` as test framework

**Rationale:** Ensures code correctness, provides living documentation, enables confident refactoring, and catches bugs early.

### VI. Python 3.13 Standards

Code MUST follow Python 3.13+ best practices and modern Python conventions.

**Rules:**
- Use type hints everywhere (function signatures, class attributes, return types)
- Follow PEP 8 style guide (use `ruff` for linting)
- Use dataclasses for models (unless complex validation needed)
- Use `pathlib` for path handling
- Use f-strings for string formatting
- Use context managers for resource management
- Prefer composition over inheritance
- No bare `except:` clauses - catch specific exceptions

**Rationale:** Code clarity, maintainability, tooling support, and leveraging modern Python features.

### VII. Simplicity First

Keep solutions as simple as possible. Avoid premature optimization and over-engineering.

**Rules:**
- Start with simplest solution that works
- Only add complexity when genuinely needed
- No abstractions unless used 3+ times
- No frameworks unless essential
- Prefer built-in libraries over external dependencies
- YAGNI (You Aren't Gonna Need It) principle applies

**Rationale:** Complexity is the enemy of maintainability. Simple code is easier to understand, test, and modify.

## Coding Standards

### Style and Formatting
- Follow PEP 8 conventions
- Use `ruff` for linting and formatting
- Maximum line length: 100 characters
- Docstrings required for all public functions and classes
- Type hints required for all function signatures

### Code Organization
- One public class per module when possible
- Functions should be < 50 lines
- Classes should be < 200 lines
- Deep nesting limited to 3 levels
- Import order: stdlib, third-party, local

### Naming Conventions
- Modules: `snake_case.py`
- Classes: `PascalCase`
- Functions: `snake_case`
- Constants: `UPPER_SNAKE_CASE`
- Private members: `_leading_underscore`

### Documentation
- Docstrings follow Google style or NumPy style (choose one and stick with it)
- Include: description, args, returns, raises, examples
- README must document installation, usage, and examples

## Error Handling Rules

### Exception Hierarchy
- Custom exceptions for domain errors (inheriting from `Exception`)
- Distinguish between expected errors (user input) and unexpected errors (bugs)
- Never silently catch and ignore exceptions

### Error Messages
- Error messages MUST be actionable and specific
- Include: what went wrong, why, and how to fix it
- User-facing errors in `stderr`, not `stdout`
- Stack traces only in debug mode (`--debug` flag)

### Error Handling Patterns
```python
# Good - specific exception, clear message
raise ValueError("Priority must be one of: low, medium, high")

# Bad - bare except
try:
    ...
except:
    pass  # NEVER do this

# Good - catch specific exceptions
try:
    todo_id = int(todo_id_str)
except ValueError:
    raise ValueError(f"Invalid todo ID: '{todo_id_str}' must be a number")
```

## CLI UX Principles

### Discoverability
- `--help` flag must explain all commands and options
- Provide usage examples in help text
- Use subcommands for organizing features (e.g., `todo add`, `todo list`)

### User Feedback
- Acknowledge successful operations (e.g., "Added todo: Buy groceries")
- Provide clear error messages (e.g., "Error: Todo not found with ID 123")
- Use progress indicators for long operations (not expected in Phase I)

### Input Validation
- Validate user input before processing
- Provide helpful error messages for invalid input
- Use sensible defaults when appropriate

### Output Formatting
- Default: human-readable, aligned columns
- Optional: JSON format for scripting (`--json` flag)
- Color coding for success/error messages (optional enhancement)

## Testing Philosophy

### Test Pyramid
- **70% Unit Tests**: Test individual functions and classes in isolation
- **20% Integration Tests**: Test interactions between components
- **10% End-to-End Tests**: Test CLI commands against the full system

### Test Quality
- Tests must be: fast, isolated, repeatable, and self-documenting
- Test names should describe the scenario, not the implementation
- Use `pytest` fixtures for setup and teardown
- Mock external dependencies (none in Phase I, but pattern for future)

### Coverage Requirements
- Minimum 80% code coverage
- 100% coverage for critical business logic paths
- Tests for all public APIs and edge cases

## Development Workflow

### Spec-Driven Cycle
1. Write specification (`spec.md`)
2. Get spec approved
3. Create plan (`plan.md`)
4. Create tasks (`tasks.md`)
5. Write tests (make them fail)
6. Implement features (make tests pass)
7. Refactor (while tests pass)
8. Update documentation

### Code Review Gates
- All code must pass linting (`ruff`)
- All tests must pass (`pytest`)
- Coverage must meet minimum threshold
- Changes must align with specification

### Commit Standards
- Commit messages: `type: description` (e.g., `feat: add todo completion`)
- Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`
- Each commit should be complete and testable

## Governance

### Amendment Process
1. Propose change with rationale
2. Update constitution version (semantic versioning)
3. Document what changed and why
4. Propagate changes to dependent templates
5. Update Sync Impact Report

### Versioning
- MAJOR: Breaking changes, principle removals, significant governance changes
- MINOR: New principle/section, expanded guidance
- PATCH: Clarifications, wording fixes, non-semantic refinements

### Compliance Review
- All PRs must verify compliance with constitution
- Complex features require explicit justification for any principle violations
- Use this constitution as the source of truth for development standards

### Non-Negotiable Rules
- Spec-Driven Development principle cannot be violated
- Test-Driven Development principle cannot be violated
- In-Memory Only rule cannot be violated in Phase I
- Any exception requires explicit team approval and documentation

**Version**: 1.0.0 | **Ratified**: 2025-12-31 | **Last Amended**: 2025-12-31
