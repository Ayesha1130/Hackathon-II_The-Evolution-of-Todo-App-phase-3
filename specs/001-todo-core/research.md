# Research: Phase I Todo Core

## Decision Table

| Area | Decision | Rationale | Alternatives |
|------|----------|-----------|--------------|
| CLI Tooling | `argparse` (stdlib) | Minimal dependencies, built-in, handles subcommands well. | `click`, `typer` (rejected for simplicity principle). |
| ID Generation | Integer Auto-increment | Simplest for user interaction via CLI (typing `1` is easier than a UUID). | UUID (rejected for CLI UX). |
| Data Model | `dataclass` | Clean, built-in type hint support, minimal boilerplate. | `namedtuple`, regular classes. |
| In-memory storage | List + dict-like access | List of Task objects for ordering, ID-based lookup for speed. | Set, Pandas (over-engineered). |
| Timestamping | `datetime.datetime.now` | Standard, reliable. | `time.time`. |

## Core Architecture Decisions

### 1. Separation of Concerns
Following Clean Architecture, the `TaskService` will be the "Source of Truth" for the in-memory list. The `CLIHandler` will translate user strings into method calls on the service and format the response for display.

### 2. Dependency Inversion
`Main` will instantiate the `TaskService` and inject it into the `CLIHandler`. This allows for easy testing with a mocked service if needed later.

### 3. Error Handling
Domain-specific exceptions (e.g., `TaskNotFoundError`) will be raised by the service layer and caught by the CLI layer to be presented as human-readable error messages on `stderr`.
