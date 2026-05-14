# Implementation Plan: Speaker Management

**Branch**: `00005-speaker-mgmt` | **Date**: 2026-05-13 | **Spec**: [spec.md](spec.md)

## Summary
**Goal**: Implement Speaker profile management (CRUD).  
**Approach**: Define Speaker entity and endpoints.

## Implementation Plan

### Phase 1: Delivery
- [ ] T001 [OBJ1] {FR-001} Update Prisma schema with Speaker entity.
- [ ] T002 [OBJ1] {FR-001} Implement Speaker service in `apps/api/src/services/speaker.ts`.
- [ ] T003 [OBJ1] {FR-001,FR-002} Implement speaker profile CRUD endpoints in `apps/api/src/routes/speakers.ts`.
