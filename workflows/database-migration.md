---
description: Safe database schema changes with backward compatibility and backfill
---

# Workflow: Database migration

## Trigger

Any change to the database schema: new tables, columns, indexes, constraints, or data transformations.

## Steps

### 1. Plan the migration

Before writing any SQL or ORM code, answer:

- What is the schema change?
- Is this change backward-compatible with the currently deployed code?
- Will there be a data backfill? How large is the affected dataset?
- Does this need to be split into multiple migrations (for zero-downtime)?

### 2. Check backward compatibility

The **current running code** must work with the **new schema** during rollout. This means:

#### Safe changes (single-step)

- ✅ Adding a nullable column
- ✅ Adding a column with a default value
- ✅ Adding a new table
- ✅ Adding an index (use `CREATE INDEX CONCURRENTLY` on large tables)

#### Unsafe changes (multi-step required)

- ⚠️ **Renaming a column**: Step 1 — add new column + write to both. Step 2 — backfill. Step 3 — switch reads. Step 4 — drop old column.
- ⚠️ **Changing a column type**: Step 1 — add new column. Step 2 — dual-write. Step 3 — backfill. Step 4 — switch. Step 5 — drop.
- ⚠️ **Dropping a column**: Step 1 — stop writing. Step 2 — deploy. Step 3 — drop column in next migration.
- ⚠️ **Adding NOT NULL constraint**: Step 1 — backfill existing nulls. Step 2 — add constraint.

### 3. Write the migration

- Use the project's migration tool (Prisma Migrate, Knex, TypeORM, raw SQL).
- Follow naming convention: `YYYYMMDDHHMMSS_descriptive_name`
- Include both `up` and `down` functions.
- Never modify an existing migration that has been deployed.

### 4. Test the migration

- Run `up` on a copy of production data (or realistic seed data).
- Run `down` to verify rollback works.
- Check that the application works with the new schema.
- For large tables: estimate migration duration. If > 1 minute, plan for off-peak deployment.

### 5. Data backfill (if needed)

- Backfills run as a separate step, not inside the schema migration.
- Backfills are idempotent — safe to run multiple times.
- Process in batches (1000 rows at a time) to avoid locking the table.
- Log progress: "Processed 5000/50000 rows."

### 6. Deploy

- Run migration in staging first. Verify.
- Run migration in production during low-traffic window (if destructive).
- Monitor database metrics: lock wait time, query latency, connection pool.

### 7. PR

- Title: `[TICKET-ID] migration: <what changed>`
- Description includes:
  - What schema change and why
  - Backward compatibility assessment
  - Backfill strategy (if any)
  - Estimated migration duration
  - Rollback plan
