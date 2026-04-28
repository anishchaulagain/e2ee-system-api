# Python Specific Rules

## Syntax and Types

- Use Python type hints (`typing` module) comprehensively across all function signatures and complex variables.
- Aim for passing `mypy --strict` on newly written code.
- Prefer explicit iteration (list comprehensions) over `map`/`filter` for readability.
- Use `f-strings` for string formatting, not `%s` or `.format()`.

## Error Handling

- Catch the most specific exception possible, never a bare `except:`.
- Use custom exception classes inheriting from `Exception` for domain-specific errors.
- Always use `raise ValueError(...) from e` to chain exceptions when re-raising.

## Testing Tooling (pytest)

- Use `pytest` uniformly for all tests. Group tests using classes `class TestModule:` if they share state, or prefix functions with `test_`.
- Time manipulation: Use `freezegun` or `time-machine`.
- HTTP mocking: Use `responses` or `vcrpy`. Keep HTTP mocking close to the request boundaries.
- Mocking objects: Use `unittest.mock.patch` judiciously. Avoid deep patching.
- Use pytest fixtures to handle state setup instead of global variables or `setUp` methods where possible.

## Dependencies

- Document exact versions in `requirements.txt`, `Pipfile`, or `pyproject.toml`.
- Always verify you are operating within the current virtual environment before installing packages.
