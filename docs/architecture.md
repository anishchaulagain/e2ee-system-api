# Architecture Overview

> **Customize this file for your project.** Replace the sections below with your actual architecture.
> Claude reads this file automatically on every session to understand the system's structure.

## System overview

<!-- One paragraph describing what this system does and who uses it. -->

This is a [web app / API / platform] that [does X] for [audience].

## Tech stack

| Layer    | Technology                                         |
| -------- | -------------------------------------------------- |
| Frontend | <!-- e.g. Next.js 14, React 18, TypeScript 5 -->   |
| Backend  | <!-- e.g. Node.js 20, Express 4, TypeScript 5 -->  |
| Database | <!-- e.g. PostgreSQL 16 via Prisma ORM -->         |
| Cache    | <!-- e.g. Redis 7 -->                              |
| Queue    | <!-- e.g. BullMQ -->                               |
| Auth     | <!-- e.g. NextAuth / custom JWT -->                |
| Hosting  | <!-- e.g. Vercel (frontend), AWS ECS (backend) --> |
| CI/CD    | <!-- e.g. GitHub Actions -->                       |

## Directory structure

```
src/
├── controllers/    # HTTP request handlers — thin, delegate to services
├── services/       # Business logic — pure where possible
├── repositories/   # Database access — all queries live here
├── models/         # Type definitions and domain entities
├── middleware/      # Auth, logging, error handling, rate limiting
├── lib/            # Shared utilities (errors, logger, config)
├── jobs/           # Background job processors
└── routes/         # Route definitions and grouping
tests/
├── factories/      # Test data builders
├── mocks/          # Shared mock implementations
├── integration/    # Cross-boundary tests
└── e2e/            # End-to-end user journey tests
```

## Key data flows

<!-- Describe the 2–3 most important data flows in the system. -->

### Example: User signup

```
Client → POST /api/v1/auth/signup
  → AuthController.signup()
    → UserService.createUser()
      → UserRepository.insert()
      → EmailService.sendVerification()
    → return 201 + user DTO
```

## Service boundaries

<!-- If you have multiple services, describe how they communicate. -->

| Service                 | Responsibility           | Communication        |
| ----------------------- | ------------------------ | -------------------- |
| <!-- api-service -->    | <!-- Core REST API -->   | <!-- HTTP -->        |
| <!-- worker-service --> | <!-- Background jobs --> | <!-- Redis queue --> |

## Database schema (key tables)

<!-- List the 5–10 most important tables and their relationships. -->

| Table    | Purpose          | Key relationships                         |
| -------- | ---------------- | ----------------------------------------- |
| `users`  | User accounts    | Has many `orders`                         |
| `orders` | Purchase records | Belongs to `user`, has many `order_items` |

## Environment-specific notes

| Environment | URL                           | Notes                       |
| ----------- | ----------------------------- | --------------------------- |
| Local       | `http://localhost:3000`       | Uses Docker Compose for DB  |
| Staging     | `https://staging.example.com` | Auto-deploys from `develop` |
| Production  | `https://app.example.com`     | Manual deploy from `main`   |

## Deployment

<!-- How does code get from PR to production? -->

1. PR merged to `develop` → auto-deploy to staging
2. QA verification on staging
3. `develop` merged to `main` → manual deploy to production
4. Monitor error rates and latency for 15 minutes post-deploy
