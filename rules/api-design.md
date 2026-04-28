# API design rules

## URL conventions

- Use plural nouns for resources: `/api/users`, `/api/orders`
- Use kebab-case for multi-word resources: `/api/user-profiles`
- Nest for clear ownership: `/api/users/:userId/orders`
- Max nesting depth: 2 levels. Beyond that, promote to a top-level resource with a filter.
- No verbs in URLs (use HTTP methods instead): ❌ `/api/getUsers` → ✅ `GET /api/users`

## HTTP methods

| Method   | Purpose          | Idempotent | Response code         |
| -------- | ---------------- | ---------- | --------------------- |
| `GET`    | Read resource(s) | Yes        | 200                   |
| `POST`   | Create resource  | No         | 201 + Location header |
| `PUT`    | Full replace     | Yes        | 200                   |
| `PATCH`  | Partial update   | Yes        | 200                   |
| `DELETE` | Remove resource  | Yes        | 204 (no body)         |

## Request / response envelope

### Success response

```json
{
  "data": { ... },
  "meta": {
    "requestId": "req-abc-123"
  }
}
```

### Collection response (paginated)

```json
{
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 142,
    "totalPages": 8
  },
  "meta": {
    "requestId": "req-abc-123"
  }
}
```

### Error response

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Email is required",
    "details": [ ... ]
  },
  "meta": {
    "requestId": "req-abc-123"
  }
}
```

## Pagination

- Use cursor-based pagination for large/real-time datasets.
- Use offset-based (`?page=1&pageSize=20`) for admin UIs and small datasets.
- Default page size: 20. Max page size: 100 (enforced server-side).
- Always return total count and pagination metadata.

## Versioning

- Use URL versioning: `/api/v1/users`
- Breaking changes = new version. Additive changes are fine within a version.
- Support at most 2 versions simultaneously. Deprecate with 6-month notice.
- Return `Deprecation` header on deprecated endpoints.

## Input validation

- Validate all inputs at the API boundary using a schema library (zod, joi, yup).
- Return specific field-level errors, not generic "invalid input".
- Sanitize strings (trim whitespace, normalize unicode) before validation.
- Reject unknown fields by default (strict schema parsing).

## Headers

Always include in responses:

- `X-Request-Id` — correlation ID
- `Content-Type` — always explicit
- `Cache-Control` — explicit caching intent, even if `no-store`

## Rate limiting

- Apply rate limits to all public endpoints.
- Return `429 Too Many Requests` with `Retry-After` header.
- Use sliding window algorithm, not fixed window.
- Rate limit by API key or IP, not by endpoint alone.

## CORS

- Never use `Access-Control-Allow-Origin: *` in production.
- Whitelist specific origins.
- Restrict allowed methods and headers to what's actually needed.
