# /ticket — Scaffold a ticket from a brief

Given a brief description of work, produce a well-formed engineering ticket.

## Output format:

**Title**: `[Component] Verb + noun phrase` (max 60 chars)

**Type**: Feature | Bug | Chore | Spike

**Priority**: P0 / P1 / P2 / P3 — justify briefly

**Story** (if feature):

> As a [persona], I want [capability] so that [outcome].

**Problem statement** (if bug):

> When [context], [action] causes [unexpected result]. Expected: [correct behavior].

**Acceptance criteria** (use Given/When/Then or bullet checklist):

- [ ]
- [ ]
- [ ]

## **Out of scope**:

**Technical notes** (optional):

<!-- Architecture hints, files likely touched, gotchas -->

**Estimate**: XS (1) / S (2) / M (3) / L (5) / XL (8) — with rationale

**Labels**: (e.g. `backend`, `auth`, `perf`, `tech-debt`)

**Dependencies**: (other tickets that must land first)
