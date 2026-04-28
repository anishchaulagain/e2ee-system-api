---
description: Step-by-step process for implementing a new feature from ticket to PR
---

# Workflow: Implement a feature

## Trigger

When given a ticket ID or feature description.

## Steps (execute in order, checkpoint after each)

### 1. Understand

- Read the ticket fully.
- Read `docs/architecture.md` for relevant service context.
- Identify all files you'll likely touch. List them.
- State your understanding in one paragraph. Ask one clarifying question if needed.

### 2. Plan

Produce a numbered task list:

```
1. [file/module] — what changes and why
2. ...
```

Get confirmation before proceeding (or auto-proceed if in autonomous mode).

### 3. Branch

```bash
git checkout -b feat/<TICKET-ID>-<short-description>
```

### 4. Implement

- Work task by task from your plan.
- After each logical unit, run `sh validators/pre-commit.sh`.
- Fix any failures before moving to the next task.

### 5. Test

- Write unit tests for all new functions/modules.
- Write an integration test if you touched a service boundary.
- Run the full test suite. All tests must pass.

### 6. Commit

- Use Conventional Commits format (see `rules/git.md`).
- One commit per logical change.

### 7. PR

- Run `/review` command. Fix all BLOCKER items.
- Run `/pr` command to generate the PR description.
- Attach screenshots for any UI change.

### 8. Done

Report: ticket ID, branch name, PR title, test coverage delta, and any follow-up tickets you'd recommend.
