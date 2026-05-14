## Research Report

**Context**: Researching best practices for setting up a Turborepo monorepo with pnpm workspaces, Docker, and GitHub Actions for the `confhub` project.

## pnpm Workspaces & Monorepo Structure
- **Key findings**: pnpm workspaces provide efficient dependency management via the workspace protocol (`workspace:*`). Standard monorepo layout separates `apps/` from shared `packages/`.
- **Recommended**: Use `pnpm-workspace.yaml` to define application and library locations. Centralize shared configurations (ESLint, Prettier, tsconfig) in internal packages within `packages/`.
- **Avoid**: Installing duplicate dependencies across different packages; use workspace-level dependencies for common tools.
### Sources
- https://pnpm.io/workspaces — Official pnpm workspaces documentation.
- https://turbo.build/repo/docs/handbook/structuring-your-repository — Turborepo handbook on repository structure.

## Turborepo Task Orchestration
- **Key findings**: `turbo.json` defines the task pipeline and caching strategy. Remote caching can significantly speed up CI/CD by sharing build artifacts.
- **Recommended**: Define clear task dependencies (e.g., `build` depends on `^build`). Use the `--filter` flag to run tasks only on affected packages.
- **Avoid**: Overly complex task pipelines that lead to circular dependencies.
### Sources
- https://turbo.build/repo/docs/core-concepts/pipelines — Turborepo pipeline documentation.
- https://turbo.build/repo/docs/core-concepts/caching — Turborepo caching guide.

## Docker Optimization in Monorepos
- **Key findings**: `turbo prune` is essential for creating lean Docker images by extracting only the necessary files for a specific target.
- **Recommended**: Use multi-stage Docker builds. First, use `turbo prune --scope=<app> --docker` to isolate dependencies. Then, use pnpm to install and build.
- **Avoid**: Copying the entire monorepo into the Docker image, which bloats image size and breaks caching.
### Sources
- https://turbo.build/repo/docs/handbook/deploying-with-docker — Turborepo guide for Docker deployments.

## GitHub Actions for Turborepo
- **Key findings**: Optimizing workflows involves path-based triggers and utilizing Turborepo's change detection.
- **Recommended**: Use `actions/setup-node` with pnpm caching enabled. Use `pnpm turbo run build test lint --filter=...[origin/main]` to only run tasks on changed code in PRs.
- **Avoid**: Running the full test suite and build for every push if only a subset of packages changed.
### Sources
- https://turbo.build/repo/docs/core-concepts/remote-caching/github-actions — Turborepo GitHub Actions integration.

### Summary
The monorepo should use pnpm workspaces for dependency management and Turborepo for task orchestration. Docker builds must be optimized using `turbo prune` to ensure fast and small images. CI/CD in GitHub Actions should leverage Turborepo's filtering to only run tasks on affected packages.

### Sources Index
| URL | Topic | Fetched |
|-----|-------|---------|
| https://pnpm.io/workspaces | pnpm Workspaces | 2026-05-13 |
| https://turbo.build/repo/docs/handbook/structuring-your-repository | Monorepo Structure | 2026-05-13 |
| https://turbo.build/repo/docs/core-concepts/pipelines | Turborepo Pipelines | 2026-05-13 |
| https://turbo.build/repo/docs/handbook/deploying-with-docker | Docker & Turborepo | 2026-05-13 |
| https://turbo.build/repo/docs/core-concepts/remote-caching/github-actions | GitHub Actions | 2026-05-13 |
