# Logging & observability rules

## Structured logging format

All logs are JSON. Every log entry includes:

```json
{
  "timestamp": "2025-01-15T10:30:00.000Z",
  "level": "info",
  "message": "User login succeeded",
  "service": "auth-service",
  "correlationId": "req-abc-123",
  "context": {
    "userId": "usr_456",
    "method": "POST",
    "path": "/api/auth/login",
    "durationMs": 142
  }
}
```

Use a logging library (pino, winston) — never raw `console.log` in production code.

## Log levels — use correctly

| Level   | When                                            | Example                                                  |
| ------- | ----------------------------------------------- | -------------------------------------------------------- |
| `error` | Operation failed, requires attention            | DB connection lost, payment failed                       |
| `warn`  | Degraded state, system continues                | Retry attempt, fallback triggered, rate limit approached |
| `info`  | State transitions, business events              | User signed up, order placed, deployment started         |
| `debug` | Developer diagnostics, removed/disabled in prod | Variable values, cache hit/miss, SQL queries             |

- `error` = pager fires. Don't use it for expected failure paths (e.g., "user not found" is not an error, it's a 404).
- `info` should tell the story of what the system did. Reading `info` logs alone should reconstruct the user journey.

## Correlation / request IDs

- Every incoming request gets a unique `correlationId` (UUID v4 or similar).
- The ID is propagated to all downstream calls (service-to-service, database, queues).
- The ID is included in the API response headers (`X-Request-Id`).
- Every log line within that request includes the `correlationId`.

## What to log

- ✅ Incoming requests (method, path, status, duration) — at `info`
- ✅ External service calls (target, duration, success/failure) — at `info`
- ✅ Business events (user signup, order placed, payment processed) — at `info`
- ✅ Authentication events (login, logout, token refresh, failed attempts) — at `info`
- ✅ Retry attempts — at `warn`
- ✅ Startup/shutdown events — at `info`
- ✅ Configuration loaded (without secret values) — at `info` at startup

## What NEVER to log

- ❌ Passwords, tokens, API keys, session IDs
- ❌ Full credit card numbers (mask to last 4)
- ❌ PII without explicit consent (emails, phone numbers, addresses)
- ❌ Full request/response bodies (log a summary or hash instead)
- ❌ Health check requests (they flood the logs)

## Performance monitoring

- Instrument request duration (p50, p95, p99) for all API endpoints.
- Track external dependency latency (database, third-party APIs, cache).
- Monitor error rates per endpoint.
- Set up alerts on: error rate > 1%, p99 latency > 2s, 5xx spike.

## Error tracking

- Use an error tracking service (Sentry, Bugsnag, or equivalent).
- Group errors by root cause, not by message string.
- Include correlation IDs in error reports for log cross-referencing.
- Set up alerts for new error types and error rate spikes.
