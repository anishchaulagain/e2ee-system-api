# Performance rules

## Frontend performance

### Bundle size

- Set a bundle size budget. Alert if main bundle exceeds 200KB gzipped.
- Use dynamic imports / `React.lazy()` for routes and heavy components.
- Audit bundle with `npx bundlephobia` or webpack-bundle-analyzer before adding deps.
- Tree-shake: prefer ESM imports (`import { x } from 'lib'`) over namespace imports (`import * as lib`).

### Rendering

- No unnecessary re-renders. Use `React.memo`, `useMemo`, `useCallback` where profiling shows benefit — not everywhere.
- Never compute derived state in render. Use `useMemo` or compute upstream.
- Virtualize long lists (>100 items) with `react-window` or similar.
- Images: use `next/image` or equivalent for lazy loading, proper sizing, and format optimization.

### Core Web Vitals targets

- **LCP** (Largest Contentful Paint): < 2.5s
- **INP** (Interaction to Next Paint): < 200ms
- **CLS** (Cumulative Layout Shift): < 0.1

## Backend performance

### Response times

- API endpoints: p95 < 500ms for reads, p95 < 1s for writes
- Database queries: p95 < 100ms (log anything above 500ms)
- External API calls: set timeouts (5s default, 30s max)

### Blocking operations

- Never block the main thread / event loop with synchronous I/O.
- CPU-intensive tasks (image processing, PDF generation) go to a job queue, not a request handler.
- Use streams for large file uploads/downloads — don't buffer entire files in memory.

### Caching strategy

- Cache at the right layer: browser (Cache-Control headers), CDN, application (Redis), database (query cache).
- Every cache entry has a TTL. No infinite caches.
- Cache invalidation strategy documented per cache layer.
- Cache keys include version/hash to prevent stale data across deployments.

### Database performance

- See `rules/database.md` for N+1 prevention, indexing, and connection pooling.
- Use `EXPLAIN ANALYZE` to verify query plans for complex queries.
- Batch writes where possible (bulk insert instead of loop-insert).

## Common anti-patterns to flag

- ❌ Fetching data you don't render
- ❌ Synchronous file reads in request handlers
- ❌ Unbounded `Promise.all()` (use batching for 100+ concurrent promises)
- ❌ JSON.parse/stringify on large objects in hot paths
- ❌ Creating new Date/RegExp objects inside tight loops
- ❌ Loading entire tables into memory for filtering (use database WHERE)
