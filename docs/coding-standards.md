# Coding Standards

> **Customize this file for your project.** These are project-specific conventions that Claude follows.
> This supplements the rules in `rules/` with codebase-specific vocabulary and patterns.

## Naming conventions

| Element             | Convention               | Example                           |
| ------------------- | ------------------------ | --------------------------------- |
| Files (components)  | PascalCase               | `UserProfile.tsx`                 |
| Files (utilities)   | camelCase                | `formatDate.ts`                   |
| Files (tests)       | Mirror source            | `UserProfile.test.tsx`            |
| Variables/functions | camelCase                | `getUserById`                     |
| Constants           | UPPER_SNAKE              | `MAX_RETRY_COUNT`                 |
| Types/Interfaces    | PascalCase               | `UserProfile`, `CreateOrderInput` |
| Enums               | PascalCase (members too) | `OrderStatus.Pending`             |
| Database tables     | snake_case, plural       | `user_profiles`                   |
| Database columns    | snake_case               | `created_at`                      |
| API routes          | kebab-case, plural       | `/api/v1/user-profiles`           |
| Environment vars    | UPPER_SNAKE              | `DATABASE_URL`                    |

## Import order

Enforce this order (configure ESLint `import/order`):

```typescript
// 1. Node built-ins
import path from "path";

// 2. External packages
import express from "express";
import { z } from "zod";

// 3. Internal aliases (@/)
import { AppError } from "@/lib/errors";
import { logger } from "@/lib/logger";

// 4. Relative imports
import { validateInput } from "./validators";
import type { CreateUserInput } from "./types";
```

## Function design

```typescript
// ✅ Good: Pure, typed, single responsibility
function calculateDiscount(price: number, tier: CustomerTier): number {
  const rates: Record<CustomerTier, number> = {
    [CustomerTier.Standard]: 0,
    [CustomerTier.Premium]: 0.1,
    [CustomerTier.Enterprise]: 0.2,
  };
  return price * (rates[tier] ?? 0);
}

// ❌ Bad: Side effects, untyped, does too much
function processOrder(order) {
  console.log(order); // Side effect
  order.discount = 0.1; // Mutation
  db.save(order); // Side effect
  sendEmail(order.email); // Side effect
  return order;
}
```

## Error creation pattern

```typescript
// Always use the error hierarchy from lib/errors.ts
import { NotFoundError, ValidationError } from "@/lib/errors";

// ✅ Throw typed errors with context
throw new NotFoundError("USER_NOT_FOUND", `User ${userId} does not exist`, {
  userId,
  searchedBy: "id",
});

// ❌ Never throw raw strings or generic errors
throw new Error("User not found");
throw "something went wrong";
```

## Service layer pattern

```typescript
// Services contain business logic, receive dependencies via constructor
class OrderService {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly paymentService: PaymentService,
    private readonly logger: Logger,
  ) {}

  async createOrder(input: CreateOrderInput): Promise<Order> {
    // Validate business rules (not input schema — that's the controller's job)
    // Orchestrate across repositories and services
    // Return domain objects, not HTTP-shaped responses
  }
}
```

## Comment philosophy

```typescript
// ✅ Explain WHY, not WHAT
// We retry 3 times because the payment gateway has intermittent 502s
// during their maintenance window (see incident INC-456)
await retry(() => paymentService.charge(amount), { maxAttempts: 3 });

// ❌ Don't restate the code
// Increment counter by 1
counter += 1;
```

## Project-specific vocabulary

<!-- Replace these with your actual domain terms -->

| Term        | Meaning                          | Don't use                 |
| ----------- | -------------------------------- | ------------------------- |
| `User`      | An authenticated account holder  | `Customer`, `Account`     |
| `Order`     | A completed purchase transaction | `Purchase`, `Transaction` |
| `Workspace` | A team's shared environment      | `Org`, `Team`, `Tenant`   |

## File length limits

| Type       | Max lines | If exceeded...              |
| ---------- | --------- | --------------------------- |
| Component  | 200       | Extract sub-components      |
| Service    | 300       | Extract to smaller services |
| Controller | 150       | Delegate to services        |
| Test file  | 400       | Split by describe block     |
| Utility    | 100       | One utility per file        |
