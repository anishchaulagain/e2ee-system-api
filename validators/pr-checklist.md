# PR checklist — machine-readable

Claude grades each item before raising a PR.
Items marked [BLOCKER] must be PASS before the PR is opened.

## Code

- [BLOCKER] No `console.log` / debug statements left in production code
- [BLOCKER] No hardcoded secrets, URLs, or environment-specific values
- [BLOCKER] TypeScript compiles with zero errors (`npx tsc --noEmit`)
- [BLOCKER] Lint passes with zero errors (`npx eslint .`)
- [ ] No functions longer than 50 lines without explanation
- [ ] No new TODOs without a linked ticket

## Tests

- [BLOCKER] All existing tests pass
- [BLOCKER] New code has test coverage
- [ ] Tests are readable and named clearly
- [ ] Edge cases are tested

## PR hygiene

- [BLOCKER] PR title follows `[TICKET-ID] verb noun` format
- [BLOCKER] PR description explains what and why
- [ ] PR is < 500 lines changed (or explanation given)
- [ ] Screenshots attached for UI changes
- [ ] CHANGELOG or release notes updated if user-facing
