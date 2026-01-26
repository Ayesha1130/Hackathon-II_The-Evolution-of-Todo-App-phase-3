# Implementation Plan: Phase I Todo Core

**Branch**: `001-todo-core` | **Date**: 2025-12-31 | **Spec**: [specs/001-todo-core/spec.md](specs/001-todo-core/spec.md)
**Input**: Feature specification from `/specs/001-todo-core/spec.md`

## Summary

This plan outlines the implementation of a basic, in-memory Todo CLI application using Python 3.13+. The architecture follows Clean Architecture principles with three distinct layers: Models (domain entities), Services (business logic), and CLI (interaction controller). Data is stored exclusively in process memory using Python data structures, adhering to the "In-Memory Only" constitutional principle for Phase I.

## Technical Context

**Language/Version**: Python 3.13+
**Primary Dependencies**: standard library only (argparse for CLI, dataclasses for models)
**Storage**: In-memory (List of Task objects)
**Testing**: pytest
**Target Platform**: CLI (Windows/macOS/Linux)
**Project Type**: single project
**Performance Goals**: < 100ms response time per operation
**Constraints**: No persistence (disk/DB), strictly in-memory, Python 3.13 standards (type hints everywhere)
**Scale/Scope**: Phase I MVP - Basic CRUD operations

## Constitution Check

*GATE: Must pass before Phase 1 design.*

| Principle | Status | Justification / Check |
|-----------|--------|----------------------|
| I. Spec-Driven Development | ✅ | Spec `001-todo-core/spec.md` exists and is approved. |
| II. Clean Architecture | ✅ | Layers clearly defined: models, services, cli. Dependencies point inward. |
| III. In-Memory Only | ✅ | Plan confirms NO persistence; volatile storage check in SC-004. |
| IV. CLI-First | ✅ | Interaction via CLI commands/subcommands only. |
| V. Test-Driven Development | ✅ | pytest integration and unit test structure included. |
| VI. Python 3.13 Standards | ✅ | Using type hints, dataclasses, and modern Python features. |
| VII. Simplicity First | ✅ | No external frameworks (like FastAPI or Typer) chosen; using stdlib. |

## Project Structure

### Documentation (this feature)

```text
specs/001-todo-core/
├── plan.md              # This file
├── research.md          # Implementation decisions and rationale
├── data-model.md        # Task entity definition
├── quickstart.md        # How to run and test the app
├── contracts/           # Service and CLI interaction contracts
│   └── service_api.md   # TaskService interface definition
└── tasks.md             # Implementation tasks (generated later)
```

### Source Code (repository root)

```text
src/
├── __init__.py
├── main.py              # Entry point & DI container
├── cli/                 # CLI Layer
│   ├── __init__.py
│   └── handler.py       # Argument parsing and output formatting
├── services/            # Service Layer
│   ├── __init__.py
│   └── task_service.py  # Business logic and in-memory storage
└── models/              # Model Layer
    ├── __init__.py
    └── task.py          # Task dataclass
```

**Structure Decision**: Option 1 (Single Project) chosen for simplicity and to match the Python package structure required for clean layer separation.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
