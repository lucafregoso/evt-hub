# Deployment & Operations (DOD) — confhub

**Status**: DRAFT | **Version**: 0.1.0

## Environments
- **Local**: Docker Compose (`infra/compose/docker-compose.yml`)
- **Staging**: `develop` branch (TBD deployment target)
- **Production**: `main` branch (TBD deployment target)

## CI/CD Pipeline
Refer to `specs/cicd-pipeline.md` for the GitHub Actions workflow.

## Secrets Management
Refer to `specs/cicd-pipeline.md` for the list of required repository secrets.

## Observability
- **Logging**: Sentry for error tracking.
- **Metrics**: TBD.
