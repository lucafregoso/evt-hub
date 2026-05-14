---
description: "Task list for Database Schema & Shared Packages"
---

# Tasks: Database Schema & Shared Packages

**Input**: Design documents from `specs/00002-db-schema/`
**Prerequisites**: `plan.md`, `spec.md`

## Phase 1: Foundational

- [ ] T001 [P] {TR-001} Initialize packages/db with Prisma schema.
- [ ] T002 [P] {TR-003} Initialize packages/shared with initial Zod export.

---

## Phase 2: Delivery (Priority: P1) 🎯 MVP

- [ ] T003 [OBJ1] {TR-001} Define User, Event, Session in schema.prisma.
- [ ] T004 [OBJ1] {TR-002} [COMPLETES TR-001,TR-002] Configure Kysely type generator.
- [ ] T005 [OBJ2] {TR-003} [COMPLETES TR-003] Export shared Zod schemas in packages/shared.

---

## Dependencies

Setup (Phase 1) → Delivery (Phase 2)
