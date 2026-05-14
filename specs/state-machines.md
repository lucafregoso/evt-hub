# State Machines — evt-hub

All state machines live in `packages/shared/src/state-machines/`.
Use the `transition(currentState, event, context)` exported function — never update status directly via Prisma.

---

## 1. Session State Machine

**File:** `packages/shared/src/state-machines/session.ts`

### States

| State | Visible to speaker? | Description |
|-------|--------------------|----|
| `submitted` | ✓ | Speaker has submitted the proposal |
| `pending_accepted` | ✗ | Organizer has tentatively accepted (waitlist / under hold) |
| `pending_rejected` | ✗ | Organizer has tentatively rejected (not yet communicated) |
| `accepted` | ✓ | Officially accepted — speaker is notified |
| `rejected` | ✓ | Officially rejected — speaker is notified |
| `confirmed` | ✓ | Speaker confirmed participation |
| `withdrawn` | ✓ | Speaker withdrew the proposal |
| `scheduled` | ✓ | Session is assigned to ≥1 time_slot in a published schedule |

### Transitions

| From | Event | To | Guard | Side Effects |
|------|-------|----|-------|-------------|
| `submitted` | `ORGANIZER_PENDING_ACCEPT` | `pending_accepted` | role=organizer | — |
| `submitted` | `ORGANIZER_PENDING_REJECT` | `pending_rejected` | role=organizer | — |
| `submitted` | `ORGANIZER_ACCEPT` | `accepted` | role=organizer | → enqueue email `acceptance` to speaker |
| `submitted` | `ORGANIZER_REJECT` | `rejected` | role=organizer | → enqueue email `rejection` to speaker |
| `pending_accepted` | `ORGANIZER_ACCEPT` | `accepted` | role=organizer | → enqueue email `acceptance` to speaker |
| `pending_accepted` | `ORGANIZER_REJECT` | `rejected` | role=organizer | → enqueue email `rejection` to speaker |
| `pending_rejected` | `ORGANIZER_ACCEPT` | `accepted` | role=organizer | → enqueue email `acceptance` to speaker |
| `pending_rejected` | `ORGANIZER_REJECT` | `rejected` | role=organizer | → enqueue email `rejection` to speaker |
| `accepted` | `SPEAKER_CONFIRM` | `confirmed` | role=owner OR role=organizer | → enqueue email `confirmation_ack` to organizer |
| `accepted` | `SPEAKER_WITHDRAW` | `withdrawn` | role=owner | → emit hook `session.withdrawn`; notify organizer |
| `accepted` | `SYSTEM_SCHEDULE` | `scheduled` | system (on slot assignment) | → emit hook `session.scheduled` |
| `confirmed` | `SPEAKER_WITHDRAW` | `withdrawn` | role=owner | → emit hook `session.withdrawn`; notify organizer |
| `confirmed` | `SYSTEM_SCHEDULE` | `scheduled` | system (on slot assignment) | → emit hook `session.scheduled` |
| `scheduled` | `SYSTEM_DESCHEDULE` | `confirmed` | system (on slot removal) | → emit hook `session.descheduled` |
| `rejected` | `ORGANIZER_ACCEPT` | `accepted` | role=organizer | → enqueue email `acceptance` to speaker |

### Terminal States
`withdrawn` is terminal. A withdrawn session cannot be re-submitted; the speaker must create a new session.

### Notes
- `pending_*` states are invisible to speaker: API returns these as `submitted` in speaker-facing responses.
- Status changes are always written with audit log entry (session_status_log table).

---

## 2. Travel Request State Machine

**File:** `packages/shared/src/state-machines/travel-request.ts`

### States

| State | Description |
|-------|-------------|
| `requested` | Speaker has submitted a travel request |
| `approved` | Admin approved the request (not yet booked) |
| `booked` | Admin has made the actual booking (flight/hotel) |
| `reimbursed` | Reimbursement payment processed |
| `rejected` | Admin rejected the request |

### Transitions

| From | Event | To | Guard | Side Effects |
|------|-------|----|-------|-------------|
| `requested` | `ADMIN_APPROVE` | `approved` | role=organizer/admin | → enqueue email `travel_approved` to speaker |
| `requested` | `ADMIN_REJECT` | `rejected` | role=organizer/admin | → enqueue email `travel_rejected` to speaker (detail includes reason) |
| `approved` | `ADMIN_BOOK` | `booked` | role=organizer/admin | → enqueue email `travel_booked` to speaker (detail includes booking details) |
| `approved` | `ADMIN_REJECT` | `rejected` | role=organizer/admin | → enqueue email `travel_rejected` to speaker |
| `booked` | `ADMIN_REIMBURSE` | `reimbursed` | role=organizer/admin | → enqueue email `travel_reimbursed` to speaker |

### Terminal States
`rejected` and `reimbursed` are terminal.

### Precondition
Travel requests can only be created for sessions in state `confirmed` or `scheduled`, and only if `event.travel_management_enabled = true`.

---

## 3. Schedule Version State Machine

**File:** `packages/shared/src/state-machines/schedule-version.ts`

### States

| State | Description |
|-------|-------------|
| `draft` | Working copy, not visible to speakers or public |
| `published` | Active version, visible to speakers and public |

### Transitions

| From | Event | To | Guard | Side Effects |
|------|-------|----|-------|-------------|
| `draft` | `ORGANIZER_PUBLISH` | `published` | role=organizer | → set previous published version to archived; diff against previous published; for each speaker with changed slots → enqueue email `schedule_updated`; emit hook `schedule.published` |

### Rules
- Only one version per agenda can be `published` at a time.
- Publishing a new version automatically archives the previously published one (new state: `archived` — stored as `is_published=false` with `archived_at` timestamp).
- The diff compares `(session_id, starts_at, ends_at, agenda_day_id)` between versions. If any of these changed for a session, the speaker receives a notification.
- A draft version always exists. When a draft is published, a new empty draft is automatically created for the next iteration.

---

## 4. Email Delivery State Machine

**File:** `packages/shared/src/state-machines/email-log.ts`
*(Managed by BullMQ worker + SMTP provider webhook)*

### States

| State | Description |
|-------|-------------|
| `queued` | Job created in BullMQ, not yet sent |
| `sending` | SMTP connection active |
| `sent` | Accepted by SMTP server (no delivery confirmation yet) |
| `delivered` | Delivery confirmed by provider webhook |
| `bounced` | Permanent delivery failure (invalid email) |
| `failed` | Transient failure (retried up to 3 times) |

### Retry Policy
`failed` → re-queued with BullMQ exponential backoff: 1 min, 5 min, 15 min. After 3 attempts → `permanently_failed` (logged, no further retries). Sentry alert on `permanently_failed`.

---

## Implementation Pattern

```typescript
// packages/shared/src/state-machines/session.ts

export type SessionStatus =
  | 'submitted' | 'pending_accepted' | 'pending_rejected'
  | 'accepted' | 'rejected' | 'confirmed' | 'withdrawn' | 'scheduled';

export type SessionTransitionEvent =
  | 'ORGANIZER_ACCEPT' | 'ORGANIZER_REJECT'
  | 'ORGANIZER_PENDING_ACCEPT' | 'ORGANIZER_PENDING_REJECT'
  | 'SPEAKER_CONFIRM' | 'SPEAKER_WITHDRAW'
  | 'SYSTEM_SCHEDULE' | 'SYSTEM_DESCHEDULE';

export interface TransitionContext {
  actorRole: 'organizer' | 'admin' | 'owner' | 'system';
}

export function transition(
  current: SessionStatus,
  event: SessionTransitionEvent,
  ctx: TransitionContext
): { nextStatus: SessionStatus; sideEffects: string[] } {
  // Implementation validates guard, returns next state + side effects to fire
  // Throws ApplicationError(ERR_SESSION_INVALID_STATUS_TRANSITION) if transition not allowed
}
```
