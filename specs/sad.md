# Software Architecture Document (SAD) — confhub

**Status**: DRAFT | **Version**: 0.1.0

## System Overview
`confhub` is a TypeScript monorepo using Turborepo and pnpm. It follows a modular monolith architecture for the API, with a separate worker for background tasks and a SvelteKit frontend.

## Directory Structure
Refer to `specs/STRUCTURE.md` for the detailed monorepo layout.

## Data Model
Refer to `packages/db/prisma/schema.prisma` (Source of Truth).
We use Prisma for migrations and standard CRUD, and Kysely for complex read queries.

## State Machines
Refer to `specs/state-machines.md` for formal session and travel lifecycle specs.

## Error Handling
Refer to `specs/error-catalog.md` for standardized application error codes.

## Design Patterns
- **Stateless Services**: Business logic in `apps/api/src/services/`.
- **Domain Hooks**: Event-driven internal communication via `EventEmitter`.
- **Contract-First**: Zod schemas in `packages/shared` validate all boundaries.
- **Plugin System**: Async hook dispatching via BullMQ to isolated plugins.

## Infrastructure
- **API**: Fastify 5
- **Frontend**: SvelteKit + shadcn-svelte
- **Worker**: BullMQ
- **Cache/Queue**: Redis 7
- **Database**: PostgreSQL 16
