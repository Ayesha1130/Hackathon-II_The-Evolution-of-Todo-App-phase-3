# Quickstart: Phase I Todo Core

## Installation

1. Ensure Python 3.13+ is installed.
2. Clone the repository.
3. Install development dependencies:
   ```bash
   pip install pytest ruff
   ```

## Running the App

The app is run via the `main.py` entry point:

```bash
python src/main.py --help
```

### Commands

- **Add a task**: `python src/main.py add "Buy milk"`
- **List tasks**: `python src/main.py list`
- **Complete task**: `python src/main.py complete 1`
- **Update task**: `python src/main.py update 1 "Buy organic milk"`
- **Delete task**: `python src/main.py delete 1`

## Running Tests

```bash
pytest
```

## Linting

```bash
ruff check .
```
