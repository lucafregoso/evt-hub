---
feature_branch: "00010-attendee-portal"
created: "2026-05-13"
input: "E10: Attendee Portal"
spec_type: "product"
spec_maturity: "draft"
epic_id: "E10"
epic_sources: ["Wave 4"]
product_document: "specs/prd.md"
---

# Feature Specification: Attendee Portal

**Feature Branch**: `00010-attendee-portal`
**Created**: 2026-05-13
**Status**: Draft
**Spec Type**: product
**Spec Maturity**: draft
**Epic ID**: E10
**Epic Sources**: ["Wave 4"]
**Product Document**: specs/prd.md

## Problem Statement

Attendees need a personalized way to engage with conference sessions, such as bookmarking favorites, viewing the schedule, and checking in. Currently, there is no interface tailored for attendees.

## Scope

### Included

- **Session Browsing**: View conference schedule.
- **Favorites**: Bookmark sessions.
- **Check-in**: Basic QR code/manual check-in functionality.

### Excluded

- **Feedback System**: Session feedback is deferred.

## User Scenarios

### US1: View & Bookmark Schedule
*   **Actor**: Attendee
*   **Goal**: Find sessions of interest.
*   **Given**: Attendee is logged in.
*   **When**: They view the schedule.
*   **Then**: They can bookmark sessions.

## Requirements

- **FR-001**: System MUST allow attendees to view the conference schedule.
- **FR-002**: System MUST allow attendees to favorite sessions.

## Success Criteria

- **SC-001** [US1]: Attendee can persist session favorites.
