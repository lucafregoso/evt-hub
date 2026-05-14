# Implementation Plan: Review System

**Branch**: `00006-review-system` | **Date**: 2026-05-13 | **Spec**: [spec.md](spec.md)

## Summary
**Goal**: Implement a structured review system for session submissions.  
**Approach**: Define Review entity and CRUD endpoints.

## Implementation Plan

### Phase 1: Delivery
- [ ] T001 [OBJ1] {FR-001} Update Prisma schema with Review entity.
- [ ] T002 [OBJ1] {FR-001} Implement Review service in `apps/api/src/services/review.ts`.
- [ ] T003 [OBJ1] {FR-001,FR-002} Implement review CRUD endpoints in `apps/api/src/routes/reviews.ts`.
