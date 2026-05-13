<!-- template-version: 2 -->
# confhub Project Instructions

## Core Principles

### I. Quality Over Coverage

Tests must give confidence, not create ceremony. We prioritize testing state machines, business logic, and critical user journeys over hitting arbitrary coverage numbers.

- **Rule**: All state machine transitions and acceptance criteria MUST have test coverage.
- **Rationale**: Prevents regression in complex logic without the overhead of testing boilerplate.

### II. Type-Safe Contract First

We use TypeScript, Zod, and Prisma as the single source of truth for our data models and API contracts.

- **Rule**: All API requests and responses MUST be validated with Zod schemas defined in `packages/shared`.
- **Rationale**: Ensures consistency between the API, worker, and frontend, catching errors at compile time.

### III. API-First Development

The API is the primary consumer of our business logic.

- **Rule**: All new features MUST start with an OpenAPI/AsyncAPI spec update or a formal route definition before implementation.
- **Rationale**: Facilitates parallel development of the frontend and worker.

### IV. Agent Output Style

All agent output MUST be concise and outcome-oriented. This principle supersedes any verbose defaults.

- **Progress reports**: Facts and outcomes only — no narration, no restating the task.
- **Artifacts**: Emit required sections only — no preamble paragraphs, no summary epilogues.
- **Reasoning**: Omit unless the user asks "why" or the decision is non-obvious.
- **Errors / blockers**: State the problem, the attempted fix, and the result — nothing else.
- **Phase-boundary reports**: ≤ 5 bullet points.
- **Preserve without compressing**: Artifact template structure and required sections; explicit decision / registration / validation guidance in shared skills; delegation constraints and sub-agent role definitions; existing size limits (spec ≤ 10 KB, research ≤ 4 KB, stories ≤ 200 words).

## Technology Stack

- **Language/Runtime**: TypeScript 5.x / Node 22
- **Frameworks**: Fastify 5 (API), SvelteKit (Web), BullMQ (Worker), Turborepo (Monorepo)
- **Storage**: PostgreSQL 16 (via Prisma & Kysely), Redis 7
- **Infrastructure**: Docker, GitHub Actions

## Testing & Quality Policy

- **Coverage Target**: none (Quality over numbers)
- **Required QC Categories**: linting, static analysis, security scanning
- **Test Strategy**: Unit (Vitest) + Integration (Vitest/Real DB) + E2E (Playwright)
- **Linting / Formatting**: ESLint + Prettier

## Source Code Layout

- **Policy**: PRESERVE_EXISTING_LAYOUT
- **Convention**: Monorepo with `apps/`, `packages/`, `plugins/`, and `infra/`.

## Development Workflow

- **Branching**: GitFlow (main, develop, feature/*, release/*)
- **Commit Convention**: Conventional Commits
- **CI Requirements**: All tests pass, lint clean, no type errors, OpenAPI validation

## Governance

- Project instructions supersede all other documentation and practices.
- Amendments require a version bump with ISO-dated changelog entry.
- All implementations MUST pass the Instructions Check gate during planning.
- Complexity beyond these principles MUST be justified and documented.

**Version**: 1.0.0 | **Last Amended**: 2026-05-13
