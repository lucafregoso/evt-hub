# Implementation Plan: Schedule Builder

**Branch**: `00007-schedule-builder` | **Date**: 2026-05-13 | **Spec**: [spec.md](spec.md)

## Summary
**Goal**: Implement Schedule Builder.  
**Approach**: Define Schedule Slot and conflict validation.

## Implementation Plan

### Phase 1: Delivery
- [ ] T001 [OBJ1] {FR-001} Update Prisma schema with Slot entity.
- [ ] T002 [OBJ1] {FR-001} Implement Schedule service.
- [ ] T003 [OBJ1] {FR-002} Implement conflict validation logic.
- [ ] T004 [OBJ1] {FR-001} Implement schedule endpoint in `apps/api/src/routes/schedules.ts`.
