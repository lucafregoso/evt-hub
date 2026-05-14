# Test Strategy — evt-hub

**Philosophy:** Quality over coverage numbers. Tests must give confidence, not create ceremony.
The test suite is the executable version of the acceptance criteria in the PRD.

---

## Test pyramid

```
        ┌──────────┐
        │   E2E    │  ← Playwright (10-20 critical user journeys)
        │  (few)   │
        ├──────────┤
        │Integration│  ← Vitest + real DB/Redis (per domain, per feature)
        │  (some)  │
        ├──────────┤
        │   Unit   │  ← Vitest (state machines, business logic, utilities)
        │  (many)  │
        └──────────┘
```

---

## Unit tests (Vitest)

**What to unit test:**
- All state machines (`packages/shared/src/state-machines/`) — 100% coverage required
- All Zod validation schemas (boundary cases, invalid inputs)
- Business logic utilities in `packages/shared/src/lib/`
- Webhook signature generation/verification
- Pagination helper
- Error code generation

**What NOT to unit test:**
- Fastify route handlers (test these as integration tests)
- Prisma queries (test these as integration tests)
- SvelteKit page components (test these as E2E)

**Location:** `*.test.ts` co-located next to source file.

**Command:** `pnpm --filter=<package> test:unit` or `pnpm turbo test:unit`

**Example:**
```typescript
// packages/shared/src/state-machines/session.test.ts
import { describe, it, expect } from 'vitest'
import { transition } from './session'

describe('Session state machine', () => {
  it('allows organizer to accept a submitted session', () => {
    const result = transition('submitted', 'ORGANIZER_ACCEPT', { actorRole: 'organizer' })
    expect(result.nextStatus).toBe('accepted')
    expect(result.sideEffects).toContain('enqueue:email:acceptance')
  })

  it('prevents speaker from accepting their own session', () => {
    expect(() =>
      transition('submitted', 'ORGANIZER_ACCEPT', { actorRole: 'owner' })
    ).toThrowError('ERR_SESSION_INVALID_STATUS_TRANSITION')
  })

  it('prevents withdrawal of a withdrawn session', () => {
    expect(() =>
      transition('withdrawn', 'SPEAKER_WITHDRAW', { actorRole: 'owner' })
    ).toThrowError('ERR_SESSION_INVALID_STATUS_TRANSITION')
  })
})
```

---

## Integration tests (Vitest + real PostgreSQL + Redis)

**What to test:**
- Full HTTP request → DB → HTTP response cycle for each endpoint
- Database constraints (FK, CHECK, UNIQUE)
- Auth middleware (token validation, role checks)
- Pagination behavior
- Error responses match error catalog format (RFC 7807)
- State machine integration with DB persistence

**Setup:**
- Test DB: `DATABASE_URL_TEST` — separate from dev DB
- Each test file runs in a transaction that is rolled back after the test (no state leak)
- Or: use `vitest --pool=forks` with separate DB per worker
- Redis: real Redis instance (not mocked)

**Location:** `apps/api/tests/integration/<domain>/`

**Command:** `pnpm --filter=api test:integration`

**Pattern:**
```typescript
// apps/api/tests/integration/sessions/accept-session.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { buildApp } from '../../src/app'
import { prisma } from '@evt-hub/db'

describe('POST /api/v1/events/:eventId/sessions/:sessionId/accept', () => {
  let app: FastifyInstance
  let eventId: string
  let sessionId: string
  let organizerToken: string

  beforeAll(async () => {
    app = await buildApp({ testing: true })
    // Seed minimal test data
    const { event, session, token } = await seedTestEvent()
    eventId = event.id; sessionId = session.id; organizerToken = token
  })

  afterAll(async () => {
    await app.close()
    await cleanupTestData(eventId)
  })

  it('accepts a submitted session and notifies speaker', async () => {
    const res = await app.inject({
      method: 'POST',
      url: `/api/v1/events/${eventId}/sessions/${sessionId}/accept`,
      headers: { Authorization: `Bearer ${organizerToken}` },
      payload: { feedback: 'Great topic!' }
    })
    expect(res.statusCode).toBe(200)
    expect(res.json().status).toBe('accepted')
    // Verify email job was enqueued
    const jobs = await emailQueue.getJobs(['waiting'])
    expect(jobs.some(j => j.data.type === 'acceptance' && j.data.sessionId === sessionId)).toBe(true)
  })

  it('returns 403 when called by a speaker', async () => {
    const res = await app.inject({
      method: 'POST',
      url: `/api/v1/events/${eventId}/sessions/${sessionId}/accept`,
      headers: { Authorization: `Bearer ${speakerToken}` },
    })
    expect(res.statusCode).toBe(403)
    expect(res.json().code).toBe('ERR_AUTH_INSUFFICIENT_PERMISSIONS')
  })
})
```

---

## E2E tests (Playwright)

**What to test — 10-20 critical journeys only:**

| Journey | Actor | Description |
|---------|-------|-------------|
| CFP submission | Speaker | Login → create talk → submit to event → verify status |
| Review cycle | Reviewer | Login → open phase → score session → discussion comment |
| Accept + confirm | Organizer+Speaker | Accept session → speaker receives email → speaker confirms |
| Schedule build | Organizer | Drag session to slot → conflict warning → publish → speaker notified |
| Attendee favorites | Attendee | View public schedule → add favorites → export iCal |
| QR check-in | Attendee | Scan QR → check in → submit feedback |
| Public voting | Attendee | Vote on proposal → vote count updates |
| Travel request | Speaker | Submit travel request → admin approves → email received |

**Location:** `apps/web/e2e/`

**Command:** `pnpm --filter=web test:e2e` (requires running stack: `pnpm dev`)

**CI:** E2E runs on `release/*` and `main` branches only — not on every `feature/*` push.

---

## Testing the plugin system

**Unit:** Test that `hooks.emit()` calls registered sync handlers synchronously.
**Integration:** Test that async hook events create BullMQ jobs with correct payloads.
**Slack plugin:** Mock the Slack webhook URL; verify correct payload shape.
**Social card plugin:** Generate a card for a seed session; verify PNG output > 0 bytes.

---

## Test data strategy

- **Factories:** `apps/api/tests/factories/` — typed factory functions using `@faker-js/faker`
- **No fixtures files** — factories generate fresh data per test
- **Shared seeds:** `apps/api/tests/seeds/` — minimal consistent dataset for E2E (one org, one event, one CFP-open state)
- **Cleanup:** Each integration test cleans its own data. E2E uses `beforeAll` seed + `afterAll` cleanup.

---

## Coverage

No numeric targets. Coverage report is generated (Vitest built-in) and visible but not enforced as a gate. Coverage is a diagnostic tool, not a goal.

Gate criteria instead:
- All PRD acceptance criteria in F01–F13 have at least one integration test
- All state machine transitions have a unit test
- All error catalog codes are exercised in at least one test
