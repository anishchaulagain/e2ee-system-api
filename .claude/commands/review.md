# /review — Self-review staged changes

Run this before every commit. Claude acts as a skeptical senior reviewer.

## Review checklist (Claude grades each item pass/fail/na):

### Correctness

- [ ] Logic handles all edge cases (empty, null, max values, concurrent access)
- [ ] No off-by-one errors
- [ ] Async paths are all awaited; no floating promises
- [ ] Race conditions considered

### Code quality

- [ ] Functions are ≤40 lines. If longer, explain why in a comment.
- [ ] No code duplication — shared logic is extracted
- [ ] Variable/function names are descriptive and consistent with codebase conventions
- [ ] No dead code, no commented-out blocks

### Types & safety

- [ ] No `any`, no type assertions without justification
- [ ] All function signatures are fully typed
- [ ] External data (API responses, env vars) is validated at the boundary

### Tests

- [ ] Unit tests cover the happy path
- [ ] Unit tests cover at least 2 failure/edge-case paths
- [ ] Test names follow: `should [behavior] when [condition]`
- [ ] No test mocks leak between tests

### Security

- [ ] No secrets, tokens, or PII in code or logs
- [ ] User input is validated/sanitized before use
- [ ] No new dependencies with known CVEs (`npm audit`)

### Performance

- [ ] No N+1 queries introduced
- [ ] No synchronous blocking in hot paths
- [ ] Large data sets are paginated or streamed

## Output

Print a table: Item | Pass/Fail/NA | Comment
Then print a summary: READY TO COMMIT or ISSUES FOUND (list blockers).
