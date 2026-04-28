# Always-on rules — apply to every task without exception

1. **Never skip tests.** If time pressure is cited as a reason, note it in the PR but still write the tests.
2. **Never hardcode secrets.** Use `process.env.VAR_NAME`. Document required vars in `.env.example`.
3. **Always handle errors.** No empty catch blocks. Log with enough context to debug in production.
4. **Always use strict typing.** Configure tsconfig with `"strict": true`. Fix, don't suppress.
5. **Always write the sad path.** For every function, ask: what happens if the input is null, empty, or malformed?
6. **Never force-push to main or develop.**
7. **Never merge your own PR** without another human review (or at minimum, a /review pass).
8. **Always check for existing utilities** before writing new ones. Read the utils/ and lib/ directories.
9. **Always prefer explicit over implicit.** Magic is a liability in production codebases.
10. **Log at the right level.** DEBUG for dev noise. INFO for state transitions. WARN for degraded state. ERROR for failures.
