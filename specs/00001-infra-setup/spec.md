---
feature_branch: "00001-infra-setup"
created: "2026-05-13"
input: "E01: Infrastructure & Monorepo Setup"
spec_type: "technical"
spec_maturity: "clarified"
epic_id: "E01"
epic_sources: ["Wave 1"]
product_document: "specs/prd.md"
---

# Feature Specification: Infrastructure & Monorepo Setup

**Feature Branch**: `00001-infra-setup`  
**Created**: 2026-05-13  
**Status**: Clarified  
**Spec Type**: technical  
**Spec Maturity**: clarified  
**Epic ID**: E01  
**Epic Sources**: ["Wave 1"]  
**Product Document**: specs/prd.md

## Problem Statement

The `confhub` project lacks a structured development environment, making it difficult to manage multiple applications and shared packages consistently. Without a monorepo setup, developers face challenges with dependency drift, complex build processes, and fragmented CI/CD pipelines. Establishing this foundation is critical to enable parallel development across the API, frontend, and worker.

## Scope

### Included

- **Turborepo & pnpm Workspaces**: Root configuration for task orchestration and package management.
- **Monorepo Structure**: Creation of `apps/`, `packages/`, `plugins/`, and `infra/` directories with initial placeholder configurations.
- **CI/CD Pipeline**: Initial GitHub Actions workflow for linting, typechecking, and unit testing using Turborepo.
- **Development Environment**: Docker Compose configuration for local services (PostgreSQL, Redis).

### Excluded

- **Application Implementation**: The actual code for the API, Web, or Worker apps is out of scope.
- **Production Deployment IaC**: Infrastructure as Code for production environments is deferred to a later epic.
- **Advanced Plugin System Implementation**: The framework for plugins is in scope, but the specific plugin logic is excluded.

### Edge Cases & Boundaries

- **Local vs CI Consistency**: Ensuring that Docker and CI environments use the same Node.js and tool versions.
- **Dependency Isolation**: Preventing circular dependencies between packages in the monorepo.

## Technical Objectives

### Objective 1 - Monorepo Orchestration (Priority: P1)

Establish a high-performance monorepo foundation using pnpm workspaces and Turborepo.

**Why this priority**: Blocks all other development; required for shared package management.

**Rationale**: Enables efficient task execution (build, test, lint) and sharing of configurations across the project.

**Deliverables**:
- `pnpm-workspace.yaml` defining `apps/*`, `packages/*`, and `plugins/*`.
- `turbo.json` with task pipeline (build, test, lint, typecheck).
- Root `package.json` with workspace-level scripts.

**Validation Criteria**:
1. **Given** a new repository state, **When** running `pnpm install`, **Then** all workspace dependencies are linked correctly.
2. **Given** valid configurations, **When** running `pnpm turbo build`, **Then** the build completes successfully across all packages (even if empty).

### Objective 2 - CI/CD Pipeline Foundation (Priority: P1)

Configure GitHub Actions to enforce code quality gates on every push.

**Why this priority**: Ensures structural integrity and prevents regressions from the start.

**Rationale**: Automated checks are necessary for maintaining a healthy codebase in a monorepo.

**Deliverables**:
- `.github/workflows/ci.yml` implementing linting, typechecking, and unit testing.
- `commitlint` or similar convention enforcement.

**Validation Criteria**:
1. **Given** a pull request, **When** code is pushed, **Then** the `ci.yml` workflow is triggered.
2. **Given** a push with linting errors, **When** the workflow runs, **Then** the linting job fails.

### Objective 3 - Local Infrastructure (Priority: P2)

Provide a reproducible local development environment for backing services.

**Why this priority**: Enhances developer productivity and ensures environment parity.

**Rationale**: Developers need a consistent way to run PostgreSQL and Redis without manual setup.

**Deliverables**:
- `infra/compose/docker-compose.yml` defining `db` (PostgreSQL 16) and `redis` (7).
- `.env.example` with default development credentials.

**Validation Criteria**:
1. **Given** Docker installed, **When** running `docker compose up`, **Then** PostgreSQL and Redis containers start successfully.

### Technical Constraints

- **Node.js Version**: Must use Node.js 22.x as specified in project instructions.
- **Package Manager**: pnpm 9.x is mandatory.
- **Build Tool**: Turborepo is the required task runner.

## Integration Points

- **IP-001**: All future epics (E02+) depend on this monorepo structure for package and app placement.
- **IP-002**: CI/CD pipeline depends on Turborepo task definitions in `turbo.json`.

## Requirements

### Technical Requirements

- **TR-001**: System MUST use pnpm workspaces for all internal and external dependencies.
- **TR-002**: System MUST use Turborepo for orchestrating `build`, `lint`, `test`, and `typecheck` tasks.
- **TR-003**: System MUST include a GitHub Actions workflow that runs on every push to every branch.
- **TR-004**: System MUST provide a Docker Compose file for local PostgreSQL and Redis.
- **TR-005**: System MUST enforce Conventional Commits using commitlint and husky.
- **TR-006**: System MUST include automated security vulnerability scanning (e.g., pnpm audit) in the CI pipeline.

## Clarifications

### Session 2026-05-13
- Q: Which tool should be used to enforce Conventional Commits? -> A: commitlint with husky
- Q: Should the CI pipeline run on every push to every branch, or be limited to PRs and main/develop? -> A: Every push to every branch

## Success Criteria

### Measurable Outcomes

- **SC-001** [OBJ1]: `pnpm turbo build` completes in under 30 seconds for the initial scaffolded monorepo.
- **SC-002** [OBJ2]: GitHub Actions workflow reports status for `lint`, `typecheck`, and `test` on every PR.
- **SC-003** [OBJ3]: `docker compose ps` shows `healthy` status for both `db` and `redis` services.
- **SC-004** [OBJ2]: Security scan reports 0 critical vulnerabilities in CI.

## Stress-Test Findings

### Session 2026-05-13
- **STF-001**: Build time target only defined for empty monorepo. (Resolved: SC-001 clarified for initial scaffold)

## Assumptions & Risks

### Assumptions

- Developers have `pnpm` and `docker` installed locally.
- GitHub Actions is the chosen CI platform.

### Risks

- **Monorepo Complexity** *(likelihood: low, impact: medium)*: Initial setup overhead for developers unfamiliar with Turborepo.
- **CI Resource Limits** *(likelihood: low, impact: low)*: Potential for slow CI times if caching is not correctly configured early.

## Implementation Signals

- `NEW-CONFIG` — Root monorepo configuration (Turbo, pnpm).
- `NEW-WORKER` — GitHub Actions workflow configuration.
- `NEW-CONFIG` — Docker Compose setup for local infrastructure.
