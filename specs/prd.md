# Product Requirements Document (PRD) — evt-hub

**Status**: DRAFT | **Version**: 0.1.0

## Vision
`evt-hub` is an open-source session management platform designed for organizers of tech conferences and community events. It streamlines the lifecycle of an event from Call for Papers (CFP) to scheduling and on-site attendee engagement.

## Core Features (F01–F13)

### F01: Authentication & Authorization
- **Objective**: Secure access for organizers, speakers, reviewers, and attendees.
- **Requirements**:
  - JWT-based auth with refresh tokens.
  - Role-based access control (RBAC): ADMIN, ORGANIZER, SPEAKER, REVIEWER, ATTENDEE.

### F02: Events Management
- **Objective**: Create and manage conference events.
- **Requirements**:
  - CRUD for events (name, date, location, description).
  - Manage event locations (rooms/stages).

### F03: Event Series
- **Objective**: Group recurring events into a series.
- **Requirements**:
  - Group events by series (e.g., "DevConf 2024", "DevConf 2025").

### F04: Session Management (CFP)
- **Objective**: Manage the Call for Papers process.
- **Requirements**:
  - Speakers can submit sessions.
  - Organizers can accept/reject sessions via state machine transitions.

### F05: Speaker Management
- **Objective**: Maintain speaker profiles and history.
- **Requirements**:
  - CRUD for speaker profiles (bio, social links).
  - Track speaker stats across events.

### F06: Talks & Proposals
- **Objective**: Manage the content of proposed sessions.
- **Requirements**:
  - Track revisions and versions of talk abstracts.

### F07: Review System
- **Objective**: Structured review process for submissions.
- **Requirements**:
  - Multiple review phases.
  - Scoring and internal comments for reviewers.

### F08: Schedule Builder
- **Objective**: Visual tool to organize sessions into slots.
- **Requirements**:
  - Slot management and conflict checking.
  - Schedule versioning and publishing.

### F09: Travel & Logistics
- **Objective**: Manage speaker travel requests.
- **Requirements**:
  - Travel request submissions and approvals.
  - Booking tracking.

### F10: Attendee Engagement
- **Objective**: Features for event attendees.
- **Requirements**:
  - Personalized favorites list.
  - QR-based check-in.
  - Session feedback and comments.

### F11: Analytics & Stats
- **Objective**: Real-time insights into the event.
- **Requirements**:
  - Attendee counts, session popularity, review distribution.

### F12: Server-Sent Events (SSE)
- **Objective**: Real-time updates for the dashboard.
- **Requirements**:
  - Push notifications for schedule changes, new submissions, and review updates.

### F13: Plugin System
- **Objective**: Extensibility via async hooks.
- **Requirements**:
  - Slack notifications, social card generation, webhook support.

## Success Criteria
- **Organizers** can publish a full conference schedule with no conflicts.
- **Speakers** can track the status of their submission from draft to published.
- **Attendees** can view a real-time schedule on mobile devices.
