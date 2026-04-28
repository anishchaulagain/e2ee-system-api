---
description: Safe refactoring workflow — test-first, incremental, behavior-preserving
---

# Workflow: Refactor existing code

## Trigger

When improving code structure without changing external behavior.

## Golden rule

**If there's no test covering the behavior before you touch it, write the test first.**
Refactoring without tests is just editing with hope.

## Steps

### 1. Define scope

State in one sentence: "I am refactoring [X] to achieve [Y]."
Examples:

- "I am extracting the validation logic from `UserController` into `UserValidator` to follow SRP."
- "I am replacing the hand-rolled cache with Redis to improve consistency."

Do NOT combine refactoring with feature work. Separate PRs.

### 2. Ensure test coverage

- Check existing test coverage for all code you plan to touch.
- If coverage < 80% for the affected code, write tests FIRST in a separate commit.
- The tests must pass both before and after the refactor — that's how you prove behavior is preserved.

### 3. Refactor incrementally

- Make one structural change at a time.
- Run `sh validators/pre-commit.sh` after each change.
- If tests break, your refactor changed behavior — undo and rethink.

### 4. No behavior changes

- No new features. No bug fixes. No "while I'm in here" changes.
- If you find a bug during refactoring, note it and file a separate ticket.

### 5. Verify

- All existing tests still pass.
- No new test failures.
- Performance is not degraded (check response times if applicable).
- Run the `/review` command.

### 6. PR

- Title format: `[TICKET-ID] refactor: <what and why>`
- Description must explain:
  - What was wrong with the old structure
  - What the new structure is
  - How you verified behavior is preserved
  - What tests cover the refactored code
