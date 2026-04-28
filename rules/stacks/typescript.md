# TypeScript & Node.js Specific Rules

## Syntax and Types

- Never use `any` unless integrating with poorly-typed 3rd party libraries. Use `unknown` and narrow the type cautiously.
- Prefer `interface` over `type` for object shapes as they provide better compiler performance and error messages.
- Always configure `tsconfig.json` with `"strict": true`.
- Use the `Record<K, V>` utility type for dictionaries, not `{[key: string]: any}`.

## Error Handling

- Never throw strings (`throw "error"`). Always throw subclasses of `Error`.
- When catching errors in `try/catch`, the error is always `unknown`. You must assert or check its instance before using its properties.

## Testing Tooling (Vitest / Jest)

- Use `describe` blocks to map to modules and `it` for specific assertions.
- Time manipulation: Use `vi.useFakeTimers()` (Vitest) or `jest.useFakeTimers()` (Jest).
- HTTP mocking: Use `msw` (Mock Service Worker) for integration tests, or `nock`.
- For parallel execution in CI, prefer Vitest with `--pool=threads`.

## Dependencies

- Stick to the configured package manager (`npm`, `yarn`, `pnpm`). Do not mix lockfiles.
- Prefer `import type { }` for type-only imports to reduce transpiler overhead.
