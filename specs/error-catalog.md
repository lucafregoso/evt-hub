# Error Catalog — evt-hub

All API errors follow **RFC 7807 Problem Details**:

```json
{
  "type": "https://evt-hub.io/errors/<error-slug>",
  "title": "Human-readable error title",
  "status": 422,
  "detail": "Specific context for this occurrence.",
  "code": "ERR_EXAMPLE_CODE",
  "instance": "/api/v1/the/requested/path"
}
```

The `ApplicationError` class in `packages/shared/src/errors/application-error.ts` generates this format. Always throw `ApplicationError` — never plain `Error` in service code.

---

## AUTH

| Code | HTTP | Title | When |
|------|------|-------|------|
| `ERR_AUTH_INVALID_CREDENTIALS` | 401 | Invalid Credentials | Wrong email/password |
| `ERR_AUTH_TOKEN_EXPIRED` | 401 | Token Expired | JWT access token expired |
| `ERR_AUTH_TOKEN_INVALID` | 401 | Invalid Token | Malformed or tampered JWT |
| `ERR_AUTH_REFRESH_TOKEN_INVALID` | 401 | Invalid Refresh Token | Refresh token missing, expired, or revoked |
| `ERR_AUTH_INSUFFICIENT_PERMISSIONS` | 403 | Insufficient Permissions | User lacks required role for this action |
| `ERR_AUTH_EMAIL_NOT_VERIFIED` | 403 | Email Not Verified | Action requires verified email |
| `ERR_AUTH_RATE_LIMITED` | 429 | Too Many Requests | Auth endpoint rate limit exceeded |
| `ERR_AUTH_SSO_FAILED` | 502 | SSO Authentication Failed | External SSO provider returned error |

---

## ORGANIZATION & EVENT

| Code | HTTP | Title | When |
|------|------|-------|------|
| `ERR_ORG_NOT_FOUND` | 404 | Organization Not Found | Organization slug/id does not exist |
| `ERR_EVENT_NOT_FOUND` | 404 | Event Not Found | Event slug/id does not exist |
| `ERR_EVENT_CFP_CLOSED` | 403 | CFP Closed | Submission attempted after cfp_close_at |
| `ERR_EVENT_CFP_NOT_OPEN_YET` | 403 | CFP Not Yet Open | Submission attempted before cfp_open_at |
| `ERR_EVENT_PRIVATE_NO_CODE` | 403 | Access Code Required | Private event requires valid access code |
| `ERR_EVENT_HAS_ACTIVE_SESSIONS` | 409 | Event Has Active Sessions | Cannot delete event with accepted/scheduled sessions |
| `ERR_EVENT_DUPLICATE_SLUG` | 409 | Slug Already Taken | Event slug already used in this organization |
| `ERR_SERIES_NOT_FOUND` | 404 | Series Not Found | Event series slug/id does not exist |
| `ERR_LOCATION_NOT_FOUND` | 404 | Location Not Found | Location id does not exist in this event |

---

## SESSION & TALK

| Code | HTTP | Title | When |
|------|------|-------|------|
| `ERR_SESSION_NOT_FOUND` | 404 | Session Not Found | Session id does not exist |
| `ERR_SESSION_INVALID_STATUS_TRANSITION` | 422 | Invalid Status Transition | Attempted transition not allowed by state machine (detail includes allowed transitions) |
| `ERR_SESSION_ALREADY_SCHEDULED` | 409 | Session Already Scheduled | Cannot perform action on a scheduled session |
| `ERR_SESSION_WITHDRAWAL_NOT_ALLOWED` | 422 | Withdrawal Not Allowed | Cannot withdraw a confirmed or scheduled session without organizer intervention |
| `ERR_SESSION_OWNER_REQUIRED` | 422 | Owner Required | Session must have at least one speaker with role=owner |
| `ERR_SESSION_MAX_PROPOSALS_REACHED` | 422 | Max Proposals Reached | Speaker reached max_proposals limit for this event |
| `ERR_TALK_NOT_FOUND` | 404 | Talk Not Found | Talk id does not exist |
| `ERR_TALK_NOT_OWNED` | 403 | Talk Not Owned | Authenticated user does not own this talk |
| `ERR_COSPEAKER_INVITE_EXPIRED` | 410 | Invite Expired | Co-speaker invitation token expired (7 days) |
| `ERR_COSPEAKER_INVITE_INVALID` | 400 | Invalid Invite Token | Co-speaker invitation token malformed or already used |

---

## SCHEDULE

| Code | HTTP | Title | When |
|------|------|-------|------|
| `ERR_SCHEDULE_VERSION_NOT_FOUND` | 404 | Schedule Version Not Found | |
| `ERR_SCHEDULE_VERSION_ALREADY_PUBLISHED` | 409 | Already Published | Attempt to publish an already-published version |
| `ERR_SCHEDULE_SPEAKER_CONFLICT` | 409 | Speaker Conflict | Speaker double-booked in overlapping slots (detail includes conflicting session ids) |
| `ERR_SCHEDULE_SLOT_OVERLAP` | 409 | Slot Overlap | Time slot overlaps with existing slot in same agenda_day |
| `ERR_SCHEDULE_SESSION_NOT_SCHEDULABLE` | 422 | Session Not Schedulable | Session status is not accepted or confirmed |

---

## REVIEW

| Code | HTTP | Title | When |
|------|------|-------|------|
| `ERR_REVIEW_PHASE_NOT_FOUND` | 404 | Review Phase Not Found | |
| `ERR_REVIEW_PHASE_NOT_ACTIVE` | 422 | Review Phase Not Active | Phase hasn't started or has ended |
| `ERR_REVIEW_DUPLICATE` | 409 | Already Reviewed | Reviewer already submitted a review for this session in this phase |
| `ERR_REVIEW_NOT_ASSIGNED` | 403 | Not Assigned | Reviewer not assigned to review this session/track |
| `ERR_REVIEW_NOT_FOUND` | 404 | Review Not Found | |

---

## VOTING

| Code | HTTP | Title | When |
|------|------|-------|------|
| `ERR_VOTE_VOTING_DISABLED` | 422 | Voting Disabled | Public voting not enabled for this event |
| `ERR_VOTE_PERIOD_CLOSED` | 422 | Voting Period Closed | Vote attempted outside voting_open_at / voting_close_at window |
| `ERR_VOTE_DUPLICATE` | 409 | Already Voted | Voter fingerprint/email/user already voted on this session |
| `ERR_VOTE_SELF_VOTE` | 403 | Self-Vote Not Allowed | Speaker cannot vote on their own proposal |
| `ERR_VOTE_SESSION_NOT_VOTABLE` | 422 | Session Not Votable | Session status is not submitted or accepted |

---

## ACCESS CODES

| Code | HTTP | Title | When |
|------|------|-------|------|
| `ERR_ACCESS_CODE_INVALID` | 403 | Invalid Access Code | Code does not exist or does not match event |
| `ERR_ACCESS_CODE_EXPIRED` | 403 | Access Code Expired | Code has passed expires_at |
| `ERR_ACCESS_CODE_MAX_USES_REACHED` | 403 | Access Code Exhausted | Code has reached max_uses limit |

---

## TRAVEL MANAGEMENT

| Code | HTTP | Title | When |
|------|------|-------|------|
| `ERR_TRAVEL_NOT_ENABLED` | 422 | Travel Management Disabled | Event has travel_management_enabled=false |
| `ERR_TRAVEL_REQUEST_NOT_FOUND` | 404 | Travel Request Not Found | |
| `ERR_TRAVEL_INVALID_STATUS_TRANSITION` | 422 | Invalid Travel Status Transition | Attempted transition not in state machine |
| `ERR_TRAVEL_SESSION_NOT_CONFIRMED` | 422 | Session Not Confirmed | Travel request only allowed for confirmed/scheduled sessions |

---

## COMMUNICATION

| Code | HTTP | Title | When |
|------|------|-------|------|
| `ERR_EMAIL_TEMPLATE_NOT_FOUND` | 404 | Email Template Not Found | |
| `ERR_EMAIL_SEND_FAILED` | 502 | Email Send Failed | SMTP provider returned error |
| `ERR_WEBHOOK_SIGNATURE_INVALID` | 401 | Invalid Webhook Signature | HMAC-SHA256 signature mismatch |

---

## PLUGINS

| Code | HTTP | Title | When |
|------|------|-------|------|
| `ERR_PLUGIN_NOT_FOUND` | 404 | Plugin Not Found | Plugin name not in registry |
| `ERR_PLUGIN_ALREADY_ACTIVE` | 409 | Plugin Already Active | Attempt to enable an already-active plugin |
| `ERR_PLUGIN_LOAD_FAILED` | 500 | Plugin Load Failed | Dynamic import of plugin package failed |
| `ERR_PLUGIN_HOOK_TIMEOUT` | 504 | Plugin Hook Timeout | Sync hook exceeded 50ms timeout |

---

## GENERIC

| Code | HTTP | Title | When |
|------|------|-------|------|
| `ERR_VALIDATION` | 400 | Validation Error | Zod schema validation failed (detail includes field errors) |
| `ERR_NOT_FOUND` | 404 | Not Found | Generic resource not found fallback |
| `ERR_CONFLICT` | 409 | Conflict | Generic conflict fallback |
| `ERR_UNPROCESSABLE` | 422 | Unprocessable | Generic business rule violation |
| `ERR_INTERNAL` | 500 | Internal Server Error | Unhandled exception (logged to Sentry) |
| `ERR_SERVICE_UNAVAILABLE` | 503 | Service Unavailable | DB or Redis not reachable |
| `ERR_GATEWAY_TIMEOUT` | 504 | Gateway Timeout | Upstream service (SMTP, S3) timed out |
