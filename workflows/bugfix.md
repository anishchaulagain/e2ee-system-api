---
description: Reproduce-first workflow for fixing a bug with minimal change
---

# Workflow: Fix a bug

## Steps

### 1. Reproduce

Write a failing test that captures the exact bug before touching any implementation.
This is non-negotiable — the test IS the bug report.

### 2. Root cause

Trace the call stack. Identify the single point of failure.
State: "The root cause is [X] because [Y]. The fix is [Z]."

### 3. Fix

Make the minimal change that fixes the root cause.
Resist the urge to refactor unrelated things in the same PR.

### 4. Verify

- The failing test you wrote in step 1 now passes.
- No other tests regressed.
- Run `sh validators/pre-commit.sh`.

### 5. PR

Use `/pr`. In the description include:

- How to reproduce the bug (before fix)
- Root cause explanation
- Why this fix is correct and minimal
