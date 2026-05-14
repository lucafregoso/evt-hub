---
feature_branch: "00003-auth-service"
created: "2026-05-13"
input: "E03: Auth Service"
spec_type: "technical"
spec_maturity: "draft"
epic_id: "E03"
epic_sources: ["Wave 1"]
product_document: "specs/prd.md"
---

# Feature Specification: Auth Service

**Feature Branch**: `00003-auth-service`
**Created**: 2026-05-13
**Status**: Draft
**Spec Type**: technical
**Spec Maturity**: draft
**Epic ID**: E03
**Epic Sources**: ["Wave 1"]
**Product Document**: specs/prd.md

## Problem Statement

The application requires a centralized authentication service to manage user identities, sessions, and role-based access control (RBAC). Currently, there is no mechanism to secure API routes or identify users, which blocks implementation of any user-dependent functionality.

## Scope

### Included

- **Authentication**: JWT-based login, registration, and refresh token rotation.
- **RBAC**: Middleware to enforce roles (ADMIN, ORGANIZER, SPEAKER, REVIEWER, ATTENDEE).
- **Session Management**: Secure cookie-based refresh token handling.

### Excluded

- **SSO Implementation**: OAuth2 (Google/GitHub) is planned for a later phase.
- **Password Reset Flow**: Standard password reset emails are out of scope for the MVP.

## Technical Objectives

### Objective 1 - Auth Core (Priority: P1)

Implement Fastify-based JWT authentication and session management.

**Deliverables**:
- Auth service in `apps/api/src/services/auth`.
- JWT middleware.

**Validation Criteria**:
1. User can login with email/password and receive valid tokens.

### Objective 2 - Authorization Middleware (Priority: P1)

Implement role-based access control (RBAC).

**Deliverables**:
- RBAC middleware in `apps/api/src/middleware/auth.ts`.

**Validation Criteria**:
1. Restricted routes reject unauthorized roles.

## Technical Constraints

- **Storage**: PostgreSQL 16
- **Validation**: Zod (via `packages/shared`)
- **Runtime**: Node 22 / Fastify 5

## Requirements

- **TR-001**: System MUST use JWT tokens for authentication.
- **TR-002**: System MUST enforce RBAC on protected API routes.

## Success Criteria

- **SC-001** [OBJ1]: User can authenticate and receive session tokens.
- **SC-002** [OBJ2]: RBAC middleware prevents unauthorized access to protected routes.

## Implementation Signals

- `NEW-API-ROUTE` — Auth-related endpoints.
- `NEW-MIDDLEWARE` — RBAC enforcement.
