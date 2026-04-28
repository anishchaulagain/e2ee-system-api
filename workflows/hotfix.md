---
description: Emergency production fix workflow with expedited review and deploy
---

# Workflow: Hotfix (production emergency)

## Trigger

Production is broken. Users are impacted. Speed matters, but correctness matters more.

## Steps

### 1. Assess severity (30 seconds)

- **P0**: Service is down, data loss risk → proceed immediately
- **P1**: Major feature broken, workaround exists → proceed after notifying team
- **P2**: Minor issue, low user impact → use normal bugfix workflow instead

If P2, stop. Use `workflows/bugfix.md`.

### 2. Branch from production

```bash
git checkout main
git pull origin main
git checkout -b hotfix/<TICKET-ID>-<short-description>
```

Hotfixes branch from `main`, not `develop`.

### 3. Reproduce & fix

- Write a failing test that captures the bug (even in a hotfix — this is non-negotiable).
- Make the smallest possible fix. No refactoring, no cleanup, no "while I'm here" changes.
- Every line you change is a line that can introduce a new bug under pressure.

### 4. Verify (do not skip)

- The failing test now passes.
- Full test suite passes (`sh validators/pre-commit.sh`).
- If the fix touches a critical path (auth, payments, data writes), test it manually too.

### 5. PR with expedited review

- Title: `[HOTFIX] [TICKET-ID] <description>`
- PR description includes:
  - Impact: what users experienced
  - Root cause: one sentence
  - Fix: what you changed and why it's minimal
  - Risk assessment: what could this fix break?
- Request review from at least one senior engineer.
- If no reviewer is available within 15 minutes AND it's P0, deploy with post-deploy review.

### 6. Deploy

- Deploy to staging, verify the fix.
- Deploy to production.
- Monitor error rates and logs for 15 minutes post-deploy.

### 7. Post-incident

- Merge hotfix branch back to `develop` (don't lose the fix).
- Create a follow-up ticket for:
  - Root cause analysis (why did this happen?)
  - Prevention (how do we prevent recurrence?)
  - Any cleanup or proper fix that the hotfix skipped
