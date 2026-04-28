# /pr — Raise a Pull Request

## Steps Claude MUST follow in order:

1. Detect the base branch: run `git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@'` to find the default branch (usually `main` or `develop`). If that fails, try `develop` then `main`.
2. Run `git diff <base-branch>...HEAD --stat` to understand scope.
3. Run `sh validators/pre-commit.sh`. If it fails, fix all issues first. Do not proceed.
4. Run through `validators/pr-checklist.md` line by line. Self-grade each item.
5. If any BLOCKER item is unchecked, fix it. Do not raise the PR.
6. Read the commit messages on this branch. Identify the ticket number (e.g. ENG-1234).
7. Generate the PR using this exact structure:

---

## PR Title

`[TICKET-ID] <imperative verb> <what changed>`
Example: `[ENG-1234] Add rate limiting to public API endpoints`

## Description

<!-- 2–4 sentences: what changed and why, not how -->

## Ticket

[TICKET-ID](link-to-ticket)

## Type of change

- [ ] Bug fix
- [ ] New feature
- [ ] Refactor (no behavior change)
- [ ] Chore / dependency update
- [ ] Breaking change

## How to test

<!-- Step-by-step repro or test instructions for the reviewer -->

1.
2.
3.

## Checklist

- [ ] Tests added / updated
- [ ] Types pass (`npx tsc --noEmit`)
- [ ] Lint passes (`npx eslint .`)
- [ ] No hardcoded secrets or env values
- [ ] Relevant docs updated
- [ ] Self-reviewed diff line by line

## Screenshots / recordings

<!-- Required for any UI change -->

## Notes for reviewer

<!-- Tradeoffs, follow-ups, or things to pay special attention to -->
