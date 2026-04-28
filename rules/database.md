# Database rules

## Migrations

1. **Every schema change is a migration.** No manual SQL, no ORM sync, no "just update the model."
2. **Migrations are forward-only in production.** Write `up` and `down`, but never run `down` in prod — write a corrective `up` instead.
3. **Naming convention:** `YYYYMMDDHHMMSS_descriptive_name` (e.g., `20250115120000_add_email_index_to_users`)
4. **One concern per migration.** Don't mix table creation with data backfill.
5. **Backward-compatible changes only.** The old code must work with the new schema during rollout.

### Backward compatibility rules

- ✅ Add a new column (with default or nullable)
- ✅ Add a new table
- ✅ Add an index
- ❌ Rename a column (two-step: add new → backfill → drop old)
- ❌ Drop a column that's still read by current code
- ❌ Change a column type without a migration path

## Queries

1. **No raw SQL in business logic.** Use the project's ORM/query builder. Raw SQL is allowed only in migrations and performance-critical queries (with a comment explaining why).
2. **Select only the columns you need.** No `SELECT *` outside of `count(*)`.
3. **Always paginate list queries.** No unbounded `findMany()`. Enforce a max limit server-side.
4. **Use transactions for multi-step writes.** If two writes must succeed together, wrap in a transaction.

## N+1 prevention

- Use eager loading / joins for related data accessed in loops.
- Review every endpoint that returns collections — does it query inside a loop?
- Add query logging in development to detect N+1 patterns.

## Indexes

- Every foreign key column has an index.
- Every column used in `WHERE` or `ORDER BY` frequently gets an index.
- Composite indexes: most selective column first.
- Don't over-index — each index slows writes. Justify new indexes with query patterns.

## Connection management

- Use connection pooling. Never open a connection per request.
- Set pool size based on environment (dev: 5, prod: 20–50).
- Handle connection failures gracefully — retry with backoff, not crash.
- Close connections on app shutdown (graceful shutdown handler).

## Data integrity

- Use database-level constraints (NOT NULL, UNIQUE, CHECK, FK) in addition to app-level validation.
- Never trust the app alone — the database is the last line of defense.
- Use `ON DELETE CASCADE` or `ON DELETE RESTRICT` intentionally. Document the choice.

## Sensitive data

- Encrypt PII at rest in production (field-level or disk encryption).
- Hash passwords with bcrypt/argon2 — never store plaintext.
- Audit logs for access to sensitive tables (who accessed what, when).
- Mask sensitive fields in development database seeds.

## Performance

- Set query timeouts (30s max for web requests, longer for background jobs).
- Log slow queries (>500ms) at WARN level.
- Monitor connection pool usage — alert when pool exhaustion is near.
- Use read replicas for heavy read workloads when applicable.
