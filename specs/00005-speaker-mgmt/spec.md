---
feature_branch: "00005-speaker-mgmt"
created: "2026-05-13"
input: "E05: Speaker Management"
spec_type: "product"
spec_maturity: "draft"
epic_id: "E05"
epic_sources: ["Wave 2"]
product_document: "specs/prd.md"
---

# Feature Specification: Speaker Management

**Feature Branch**: `00005-speaker-mgmt`
**Created**: 2026-05-13
**Status**: Draft
**Spec Type**: product
**Spec Maturity**: draft
**Epic ID**: E05
**Epic Sources**: ["Wave 2"]
**Product Document**: specs/prd.md

## Problem Statement

Organizers need to maintain comprehensive speaker profiles, including bios, contact information, and session history across multiple events. Currently, there is no system to manage speaker information, making it impossible to organize speakers for the conference.

## Scope

### Included

- **Speaker CRUD**: Create, read, update, delete speaker profiles.
- **Profile Management**: Upload bio, social links, and contact details.

### Excluded

- **Public Speaker Directory**: A public facing speaker listing page is out of scope for this epic.
- **Automated Bio Generation**: AI-based bio improvements are deferred.

## User Scenarios

### US1: Speaker Registration
*   **Actor**: Speaker
*   **Goal**: Create a profile to submit sessions.
*   **Given**: Speaker has an authenticated account.
*   **When**: They complete their profile.
*   **Then**: Profile record is saved.

## Requirements

- **FR-001**: System MUST allow speakers to manage their own profiles.
- **FR-002**: System MUST allow organizers to view and manage speaker records.

## Success Criteria

- **SC-001** [US1]: Speaker profile is persisted and retrievable.
