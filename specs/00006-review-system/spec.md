---
feature_branch: "00006-review-system"
created: "2026-05-13"
input: "E06: Review System"
spec_type: "product"
spec_maturity: "draft"
epic_id: "E06"
epic_sources: ["Wave 2"]
product_document: "specs/prd.md"
---

# Feature Specification: Review System

**Feature Branch**: `00006-review-system`
**Created**: 2026-05-13
**Status**: Draft
**Spec Type**: product
**Spec Maturity**: draft
**Epic ID**: E06
**Epic Sources**: ["Wave 2"]
**Product Document**: specs/prd.md

## Problem Statement

Organizers need a structured review process to evaluate talk submissions for events. Currently, submissions have no review track, making it impossible to manage quality or selection.

## Scope

### Included

- **Review Assignment**: Assigning reviewers to sessions.
- **Review Submission**: Reviewers can score and comment on sessions.
- **Review Overview**: Organizers can view aggregate scores.

### Excluded

- **Public Review**: Peer review is not in scope.
- **Automated Scoring**: Machine-based score aggregation is deferred.

## User Scenarios

### US1: Review a Submission
*   **Actor**: Reviewer
*   **Goal**: Provide feedback on a session proposal.
*   **Given**: Reviewer is assigned to the session.
*   **When**: They submit score and comments.
*   **Then**: Review record is persisted.

## Requirements

- **FR-001**: System MUST allow organizers to assign reviewers to submissions.
- **FR-002**: System MUST allow reviewers to submit scores and comments.

## Success Criteria

- **SC-001** [US1]: Review submission is persisted.
