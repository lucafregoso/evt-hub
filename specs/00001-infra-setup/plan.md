# Implementation Plan: Infrastructure & Monorepo Setup

**Branch**: `00001-infra-setup` | **Date**: 2026-05-13 | **Spec**: [spec.md](spec.md)

## Summary

**Goal**: Establish the `confhub` monorepo foundation using Turborepo, pnpm workspaces, and Docker.  
**Approach**: Scaffold the standard directory structure and configure workspace-level task orchestration and CI/CD gates.  
**Key Constraint**: Must maintain Node.js 22 and pnpm 9 compatibility across all environments.

## Technical Context

**Language/Version**: TypeScript 5.x / Node 22  
**Primary Dependencies**: Turborepo, pnpm, Docker, GitHub Actions  
**Storage**: PostgreSQL 16, Redis 7 (Local infrastructure only)  
**Testing**: Vitest (Unit/Integration), Playwright (E2E)  
**Target Platform**: Linux server (Docker), GitHub Actions  
**Project Type**: web  
**Project Mode**: brownfield  
**Performance Goals**: `pnpm turbo build` < 30s for initial scaffold  
**Constraints**: Node.js 22, pnpm 9 mandatory  
**Scale/Scope**: 3 apps, 2+ packages, 1 CI pipeline

## Instructions Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Verdict | Notes |
|-----------|---------|-------|
| I. Quality Over Coverage | PASS | Plan includes Vitest setup for unit/integration tiers. |
| II. Type-Safe Contract First | PASS | Plan includes shared package for Zod schemas. |
| III. API-First Development | PASS | Plan includes OpenAPI validation in CI. |
| IV. Agent Output Style | PASS | Plan follows concise formatting. |

## Architecture

```mermaid
C4Container
  Person(organizer, "Organizer", "Manages events and sessions")
  Person(speaker, "Speaker", "Submits and manages talks")
  
  System_Boundary(confhub, "confhub Monorepo") {
    Container(api, "API Server", "Fastify 5", "Handles business logic and data")
    Container(web, "Web App", "SvelteKit", "Frontend dashboard and portal")
    Container(worker, "Background Worker", "BullMQ", "Processes async tasks (email, webhooks)")
    ContainerDb(db, "Database", "PostgreSQL 16", "Persistent storage")
    ContainerDb(cache, "Cache/Queue", "Redis 7", "Task queue and caching")
    
    Container(shared, "Shared Package", "TypeScript", "Shared types, Zod schemas, utilities")
    Container(db_pkg, "DB Package", "Prisma/Kysely", "Database client and migrations")
  }
  
  System_Ext(github, "GitHub Actions", "CI/CD platform")
  System_Ext(docker, "Docker", "Container runtime")

  Rel(web, api, "Uses", "HTTPS/JSON")
  Rel(api, db, "Reads/Writes", "Prisma/Kysely")
  Rel(api, cache, "Enqueues jobs", "BullMQ")
  Rel(worker, cache, "Processes jobs", "BullMQ")
  Rel(worker, db, "Reads/Writes", "Prisma/Kysely")
  Rel(github, confhub, "Builds & Tests", "Turborepo")
```

## Architecture Decisions

| ID | Decision | Options Considered | Chosen | Rationale |
|----|----------|--------------------|--------|-----------|
| AD-001 | Use `turbo prune` for Docker | Manual copy / prune | `turbo prune --docker` | Optimizes image size and build caching by isolating workspace dependencies. |
| AD-002 | Shared Configurations | Inline config / shared pkg | Internal packages | Ensuring consistency of ESLint, Prettier, and TSConfig across the monorepo. |
| AD-003 | Conventional Commits | commitlint / manual | `commitlint` + `husky` | Enforces standardized commit messages for better changelog generation. |

## Data Model Summary

N/A — no persistent data in this epic (infra only).

## API Surface Summary

N/A — no API surface in this epic (infra only).

## Testing Strategy

| Tier | Tool | Scope | Mock Boundary | Install |
|------|------|-------|---------------|---------|
| Unit | Vitest | Shared logic, state machines | External services | `pnpm add -D vitest` |
| Integration | Vitest | API routes, DB interactions | Real DB/Redis | `pnpm add -D vitest` |
| Security | Redocly, pnpm audit | OpenAPI validation, Vulnerabilities | — | `pnpm add -D @redocly/cli` |
| Coverage | Vitest | Measurement of P1 paths | — | `configured` |

## Error Handling Strategy

N/A — infrastructural setup.

## Integration Points

| Spec Reference | System/Service | Technical Approach | Contract |
|----------------|----------------|--------------------|----------|
| IP-001 | All Future Epics | Standard Monorepo structure | `STRUCTURE.md` |
| IP-002 | GitHub Actions | Turborepo pipeline | `turbo.json` |

## Risk Mitigation

| Risk (from spec) | Likelihood | Impact | Mitigation | Owner |
|-------------------|------------|--------|------------|-------|
| Monorepo Complexity | L | M | Provide clear `STRUCTURE.md` and root scripts. | Architect |
| CI Resource Limits | L | L | Configure Turborepo local caching in CI. | DevOps |

## Requirement Coverage Map

| Req ID | Component(s) | File Path(s) | Notes |
|--------|--------------|--------------|-------|
| TR-001 | pnpm Workspace | `pnpm-workspace.yaml` | Defines app/pkg roots. |
| TR-002 | Turborepo Config | `turbo.json` | Task orchestration pipeline. |
| TR-003 | CI Pipeline | `.github/workflows/ci.yml` | GHA workflow for quality gates. |
| TR-004 | Local Infra | `infra/compose/docker-compose.yml` | PG/Redis setup. |
| TR-005 | Git Hooks | `package.json`, `.husky/` | Conventional Commits enforcement. |
| TR-006 | Security Scan | `.github/workflows/ci.yml` | pnpm audit in CI. |

## Project Structure

### Source Code

```text
+ apps/
  + api/                 # Fastify API
  + web/                 # SvelteKit Web
  + worker/              # BullMQ Worker
+ packages/
  + db/                  # Prisma & Kysely
  + shared/              # Types & Schemas
  + config/              # Shared ESLint/TSConfig (Refactoring target)
+ infra/
  + compose/
    + docker-compose.yml
+ .github/
  + workflows/
    + ci.yml
~ package.json           # Updated with husky/commitlint
~ turbo.json             # Updated with full pipeline
~ pnpm-workspace.yaml    # Defined roots
```

**Patterns to reuse**: Existing directory structure in `STRUCTURE.md`.  
**Naming conventions**: Kebab-case for directories, PascalCase for classes (TS).

## Implementation Hints

- **[HINT-001]** Dependency Management: Always use `workspace:*` for internal packages.
- **[HINT-002]** Docker: Ensure `.dockerignore` excludes `node_modules` to prevent context bloat.
- **[HINT-003]** Turborepo: Task dependencies in `turbo.json` must be strictly defined to avoid race conditions.
