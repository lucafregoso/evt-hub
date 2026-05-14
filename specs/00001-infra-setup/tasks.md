---
description: "Task list for Infrastructure & Monorepo Setup"
---

# Tasks: Infrastructure & Monorepo Setup

**Input**: Design documents from `specs/00001-infra-setup/`
**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`

## Project Mode

`Brownfield`

## Phase 1: Setup (Repository / Workspace Delta)

- [X] T001 Update root package.json with workspace scripts, husky, and commitlint {TR-005}
- [X] T002 [P] Update pnpm-workspace.yaml with app and package roots {TR-001}
- [X] T003 [P] Update turbo.json with task pipeline and global dependencies {TR-002}
- [X] T004 [P] Create .env.example with default infrastructure credentials {TR-004}

---

## Phase 2: Work Item 1 - Monorepo Orchestration (Priority: P1) 🎯 MVP

- [X] T005 [P] [OBJ1] {TR-001} Finalize pnpm workspace links and dependency protocol
- [X] T006 [OBJ1] {TR-002} [COMPLETES TR-001,TR-002] Verify turbo build completes successfully for initial scaffold

---

## Phase 3: Work Item 2 - CI/CD Pipeline Foundation (Priority: P1) 🎯 MVP

- [X] T007 [P] [OBJ2] {TR-003,TR-006} Create .github/workflows/ci.yml with lint, test, audit, and redocly jobs
- [X] T008 [OBJ2] {TR-003,TR-006} [COMPLETES TR-003,TR-006] Verify CI pipeline triggers and passes on push
- [X] T009 [OBJ2] {TR-005} [COMPLETES TR-005] Initialize husky and commitlint hooks in .husky/

---

## Phase 4: Work Item 3 - Local Infrastructure (Priority: P2)

- [X] T010 [P] [OBJ3] {TR-004} Create infra/compose/docker-compose.yml with PG 16 and Redis 7
- [X] T011 [OBJ3] {TR-004} [COMPLETES TR-004] Verify docker compose up starts healthy services

---

## Dependencies

Setup (Phase 1) → Delivery Work Items (Phase 2-4)

- Phase 2 (Orchestration) depends on Phase 1 (Setup) configs.
- Phase 3 (CI/CD) depends on Phase 2 (Orchestration) task definitions.
- Phase 4 (Local Infra) can run in parallel with Phase 3.
- Tasks marked `[P]` can run in parallel within their phase.
