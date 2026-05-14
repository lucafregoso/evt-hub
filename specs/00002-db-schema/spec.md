---
feature_branch: "00002-db-schema"
created: "2026-05-13"
input: "E02: Database Schema & Shared Packages"
spec_type: "technical"
spec_maturity: "draft"
epic_id: "E02"
epic_sources: ["Wave 1"]
product_document: "specs/prd.md"
---

# Feature Specification: Database Schema & Shared Packages

**Feature Branch**: `00002-db-schema`
**Created**: 2026-05-13
**Status**: Draft
**Spec Type**: technical
**Spec Maturity**: draft
**Epic ID**: E02
**Epic Sources**: ["Wave 1"]
**Product Document**: specs/prd.md

## Problem Statement

The `confhub` project lacks a centralized database schema and shared type definitions. This leads to fragmented data models across services, inconsistent validation logic, and missing runtime type safety. Implementing a unified database and shared package layer is essential for system integrity and developer velocity.

## Scope

### Included

- **`packages/db`**: Prisma schema definition with generated Kysely types.
- **`packages/shared`**: Zod schemas, TypeScript types, and shared utilities.
- **CI/CD Integration**: DB migration/linting/typechecking in CI.
- **Utility Scripts**: Post-install hooks to keep generated types in sync.

### Excluded

- **Migration Logic**: Business logic for data migration is excluded from this epic (infra/schema focus).
- **Application Logic**: Business-layer implementations are excluded.

### Edge Cases & Boundaries

- **Sync Strategy**: Ensuring types generated from Prisma remain in sync with runtime validation schemas (Zod).

## Technical Objectives

### Objective 1 - Database Layer (Priority: P1)

Define a unified Prisma schema that supports all core entities.

**Deliverables**:
- `packages/db/prisma/schema.prisma`
- Kysely type generator integration.
- Database migration support.

**Validation Criteria**:
1. Schema defines core entities (Event, Session, Speaker, User) as defined in the PRD.
2. `pnpm db:generate` produces correct Kysely types.

### Objective 2 - Shared Schema/Types (Priority: P1)

Expose validated, reusable schemas and types.

**Deliverables**:
- `packages/shared/src/zod.ts` (generated/extended Zod schemas).
- `packages/shared/src/types.ts` (shared TS interfaces).

**Validation Criteria**:
1. All API endpoints can use shared Zod schemas for input validation.

### Technical Constraints

- **Storage**: PostgreSQL 16
- **Database Client**: Prisma + Kysely
- **Validation**: Zod
- **Build**: Turborepo

## Requirements

### Technical Requirements

- **TR-001**: System MUST use Prisma as the source of truth for the database schema.
- **TR-002**: System MUST generate Kysely type definitions automatically.
- **TR-003**: System MUST provide Zod schemas for all database-backed entities in `packages/shared`.

## Success Criteria

- **SC-001** [OBJ1]: `pnpm db:generate` completes successfully.
- **SC-002** [OBJ2]: All shared schemas in `packages/shared` are importable by other workspaces.

## Implementation Signals

- `NEW-ENTITY` — Database schema entities defined.
- `NEW-CONFIG` — Prisma/Kysely generator configuration.
