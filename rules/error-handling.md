# Error handling rules

## Error class hierarchy

All application errors extend a base `AppError` class from `lib/errors.ts` (or equivalent):

```
AppError (base)
├── ValidationError     → 400
├── AuthenticationError → 401
├── AuthorizationError  → 403
├── NotFoundError       → 404
├── ConflictError       → 409
├── RateLimitError      → 429
└── InternalError       → 500
```

Every custom error includes:

- `code` — machine-readable string (e.g., `USER_NOT_FOUND`, `INVALID_EMAIL`)
- `message` — human-readable explanation
- `statusCode` — HTTP status
- `context` — optional metadata for debugging (never exposed to client)

## API error response shape

All error responses follow this exact shape — no exceptions:

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Email is required",
    "details": [{ "field": "email", "reason": "required" }]
  }
}
```

- Never return raw error messages from libraries or databases.
- Never expose stack traces outside development.
- Always include a correlation/request ID in error responses for traceability.

## Error handling rules

1. **No empty catch blocks.** Every catch must either recover, rethrow, or log with context.
2. **No `catch (e: any)`.** Type the error. Use `instanceof` checks for known error types.
3. **Catch at the boundary, not everywhere.** Controllers/route handlers catch and translate. Business logic throws.
4. **Async errors must be caught.** No floating promises. Use `Promise.allSettled` when partial failure is acceptable.
5. **Log the cause chain.** When wrapping errors, preserve the original via `{ cause: originalError }`.

## Retry semantics

- **Retryable:** Network timeouts, 502/503/504, database connection errors, rate limits (with backoff)
- **Non-retryable:** 400 validation errors, 401/403 auth errors, 404 not found, business logic violations
- Retries use exponential backoff with jitter. Max 3 attempts.
- Every retry is logged at WARN level.

## React / frontend error boundaries

- One top-level error boundary wraps the entire app (crash fallback).
- One error boundary per route/page (isolates page-level failures).
- Error boundaries show a user-friendly message + "try again" button, never a stack trace.
- Log caught errors to your error tracking service (Sentry, etc.).

## What NOT to do

- ❌ `catch (e) {}` — silent swallowing
- ❌ `catch (e) { console.log(e) }` — logging without structure or context
- ❌ Returning success status codes with error payloads
- ❌ Throwing strings (`throw "something went wrong"`)
- ❌ Using HTTP 500 for client errors
