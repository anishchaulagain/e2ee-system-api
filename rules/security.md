# Security rules

## Input validation

- All user-supplied input is validated at the system boundary (API layer, form submission).
- Use a schema validation library (zod, yup, joi) — don't write bespoke validators.
- Never trust `Content-Type` headers alone. Validate the body structure.
- Reject unknown/extra fields by default (strict schema parsing).
- Sanitize strings: trim whitespace, normalize unicode, strip control characters.

## Authentication & authorization

- AuthZ checks happen server-side, never trust client-supplied roles.
- Use short-lived tokens. Refresh token rotation enabled.
- Never log tokens, passwords, or session IDs.
- Implement account lockout after repeated failed login attempts (5 attempts → 15 min lockout).
- Use `httpOnly`, `secure`, `sameSite=strict` flags on session cookies.

## Secrets

- No secrets in code, config files, or commit history.
- Use a secrets manager (AWS Secrets Manager, Vault, Doppler) in production.
- `.env` files are gitignored. `.env.example` documents keys without values (see `templates/.env.example`).
- Rotate secrets on a regular schedule. Document rotation procedure per secret type.
- If a secret is accidentally committed, rotate it immediately — don't just remove the commit.

## Dependencies

- Run `npm audit --audit-level=high` before every PR (enforced in `validators/pre-commit.sh`).
- Pin dependency versions in `package.json`. Use lockfiles (`package-lock.json`).
- Use `npm ci` (not `npm install`) in CI/CD to ensure deterministic installs from lockfile.
- Review changelogs on major version bumps before upgrading.
- Audit new dependencies before adding: check download count, maintenance status, and license.

## Security headers (Express / Node.js)

- Use `helmet` middleware to set security headers by default.
- Required headers:

| Header                      | Value                                 | Purpose                                      |
| --------------------------- | ------------------------------------- | -------------------------------------------- |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Force HTTPS                                  |
| `X-Content-Type-Options`    | `nosniff`                             | Prevent MIME sniffing                        |
| `X-Frame-Options`           | `DENY`                                | Prevent clickjacking                         |
| `Content-Security-Policy`   | Configured per app                    | Prevent XSS, data injection                  |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`     | Control referer leakage                      |
| `X-XSS-Protection`          | `0`                                   | Disable legacy XSS filter (CSP is preferred) |

## CSRF protection

- All state-changing requests (POST, PUT, PATCH, DELETE) must include a CSRF token.
- Use the `csurf` middleware or framework-native CSRF protection.
- CSRF tokens are tied to the user session, not a global secret.

## File upload security

- Validate file type by magic bytes, not just file extension.
- Enforce maximum file size (default: 10MB, configurable per endpoint).
- Store uploads outside the webroot. Serve via a separate handler with access control.
- Scan for malware in production (ClamAV or cloud-based scanning).
- Generate unique filenames server-side — never use the user-provided filename directly.

## CORS

- Never use `Access-Control-Allow-Origin: *` in production.
- Whitelist specific origins.
- Restrict allowed methods and headers to what's actually needed.

## SSRF protection

- When making server-side HTTP requests with user-supplied URLs:
  - Validate and whitelist allowed domains/protocols.
  - Block requests to private/internal IP ranges (`127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`).
  - Set strict timeouts on outbound requests.

## SQL / NoSQL injection prevention

- **Always** use parameterized queries or the ORM's query builder.
- Never concatenate user input into query strings.
- For MongoDB: reject `$` prefixed keys in user input to prevent operator injection.

```typescript
// ✅ Parameterized (safe)
const user = await db.query("SELECT * FROM users WHERE id = $1", [userId]);

// ❌ Concatenated (vulnerable)
const user = await db.query(`SELECT * FROM users WHERE id = '${userId}'`);
```

## OWASP awareness

Actively guard against:

- Injection (SQL, NoSQL, command)
- Broken access control
- Insecure deserialization
- Security misconfiguration
- XSS (escape all user content rendered in HTML)
- Broken authentication
- Sensitive data exposure
- Insufficient logging & monitoring

## Rate limiting

- Apply rate limiting to all public-facing endpoints (see `rules/api-design.md`).
- Stricter limits on auth endpoints (login, signup, password reset): 5 req/min.
- Return `429 Too Many Requests` with `Retry-After` header.

## Logging security events

- Log all authentication events (login, logout, failed attempts, token refresh).
- Log all authorization failures (403s).
- Log admin actions (user creation, permission changes, data export).
- Never log: passwords, tokens, full credit card numbers, PII (see `rules/logging.md`).
