# Project Plan — evt-hub

**Status**: DRAFT | **Version**: 0.1.0

## Execution Waves

### Wave 1: Core Foundation (The Monorepo & Auth)
- **Epic E01**: Infrastructure & Monorepo Setup (Turbo, pnpm, Docker)
- **Epic E02**: Database Schema & Shared Packages (@evt-hub/db, @evt-hub/shared)
- **Epic E03**: Auth Service (F01) - Login, Register, Roles

### Wave 2: Event & Session Lifecycle
- **Epic E04**: Event Management (F02, F03)
- **Epic E05**: Speaker Portal & Submission (F04, F05, F06)
- **Epic E06**: Review System (F07)

### Wave 3: Scheduling & Logistics
- **Epic E07**: Schedule Builder (F08)
- **Epic E08**: Travel & Logistics (F09)
- **Epic E09**: Plugin System & Worker (F13)

### Wave 4: Attendee Experience & Analytics
- **Epic E10**: Attendee Portal (F10)
- **Epic E11**: Real-time Dashboard (F12, F11)

## Initial Epics (Wave 1)

### Epic E01: Infrastructure & Monorepo Setup
- [ ] Initialize Turborepo with apps/packages structure
- [ ] Configure CI/CD pipeline (GitHub Actions)
- [ ] Setup Docker Compose for local development

### Epic E02: Database & Shared
- [ ] Implement Prisma schema in `packages/db`
- [ ] Define shared types and Zod schemas in `packages/shared`
- [ ] Setup Kysely for complex queries

### Epic E03: Auth Service
- [ ] Fastify API with JWT authentication
- [ ] Role-based middleware
- [ ] User registration and login flow
