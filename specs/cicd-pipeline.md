# CI/CD Pipeline Specification — confhub

**Platform:** GitHub Actions (recommended — free tier sufficient for solo developer, native integration con GitHub, ampio ecosistema di actions)

**Branching model:** GitFlow (main, develop, feature/*, release/*, hotfix/*)

---

## Pipeline overview

| Trigger | Pipeline | Goal |
|---------|----------|------|
| Push to `feature/*` | `ci.yml` | Lint + typecheck + unit tests |
| Push to `develop` | `ci.yml` + `deploy-staging.yml` | Full CI + deploy staging |
| PR to `develop` | `pr.yml` | CI + preview deploy |
| Push to `release/*` | `ci.yml` + `integration.yml` | Full CI + integration tests |
| Push to `main` | `ci.yml` + `deploy-prod.yml` | Full CI + deploy production |
| Push to `hotfix/*` | `ci.yml` + `hotfix-deploy.yml` | Full CI + expedited deploy |

---

## Pipeline: `ci.yml` (mandatory gates, tutti i branch)

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: ['**']
  pull_request:
    branches: [develop, main]

jobs:
  setup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: latest }
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile

  lint-typecheck:
    needs: setup
    runs-on: ubuntu-latest
    steps:
      - run: pnpm turbo lint typecheck

  test-unit:
    needs: setup
    runs-on: ubuntu-latest
    steps:
      - run: pnpm turbo test:unit

  test-integration:
    needs: setup
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env: { POSTGRES_DB: confhub_test, POSTGRES_USER: confhub, POSTGRES_PASSWORD: test }
        ports: ['5432:5432']
        options: --health-cmd pg_isready
      redis:
        image: redis:7-alpine
        ports: ['6379:6379']
        options: --health-cmd "redis-cli ping"
    env:
      DATABASE_URL: postgresql://confhub:test@localhost:5432/confhub_test
      REDIS_URL: redis://localhost:6379
    steps:
      - run: pnpm --filter=db db:migrate
      - run: pnpm turbo test:integration

  openapi-validate:
    needs: setup
    runs-on: ubuntu-latest
    steps:
      - run: npx @redocly/cli lint docs/openapi/openapi.yaml

  schema-check:
    needs: setup
    runs-on: ubuntu-latest
    steps:
      # Verify no uncommitted Prisma migration drift
      - run: pnpm --filter=db db:generate && git diff --exit-code packages/db/prisma/
```

## Gate rules
- **All gates must pass** before merge to `develop` or `main`.
- `openapi-validate` runs Redocly linter — fails if OpenAPI spec has errors or is out of sync with route definitions.
- `schema-check` fails if `prisma generate` produces uncommitted changes (prevents schema drift).

---

## Pipeline: `deploy-staging.yml` (push to `develop`)

```yaml
name: Deploy Staging
on:
  push:
    branches: [develop]
jobs:
  deploy:
    needs: [lint-typecheck, test-unit, test-integration]
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Build Docker images
        run: docker buildx bake -f infra/docker/bake.hcl
      - name: Deploy to staging
        # Options: fly deploy / docker compose pull + restart / kubectl apply
        # Decided at infra setup time
        run: echo "TODO: configure deployment target"
```

---

## Secrets required (GitHub repository secrets)

| Secret | Description |
|--------|-------------|
| `DATABASE_URL_PROD` | Production DB connection string |
| `DATABASE_URL_STAGING` | Staging DB connection string |
| `JWT_SECRET_PROD` | Production JWT secret |
| `JWT_REFRESH_SECRET_PROD` | Production JWT refresh secret |
| `S3_ACCESS_KEY_PROD` | Production S3/MinIO key |
| `S3_SECRET_KEY_PROD` | Production S3/MinIO secret |
| `SENTRY_DSN` | Sentry DSN (same for staging + prod, different environments) |
| `SMTP_HOST_PROD` | Production SMTP credentials |
| `DEPLOY_HOST` | SSH host for VPS deploy (if using docker compose) |
| `DEPLOY_KEY` | SSH private key for VPS deploy |

---

## Conventional commits

Required format (enforced by `commitlint` in CI):
```
type(scope): short description

Types: feat | fix | docs | refactor | test | chore | perf | ci | revert
Scope: api | worker | web | db | shared | plugins | infra

Examples:
feat(api): add SSE endpoint for real-time dashboard updates
fix(db): resolve Prisma migration drift in sessions table
chore(infra): update docker-compose postgres to 16.3
```

---

## Branch protection rules (GitHub settings)

For `main`:
- Require PR before merging: ✓
- Required status checks: lint-typecheck, test-unit, test-integration, openapi-validate, schema-check
- Require signed commits: ✓ (recommended)
- Delete branch on merge: ✓

For `develop`:
- Require PR before merging: ✓ (feature → develop)
- Required status checks: lint-typecheck, test-unit, test-integration
