# AGENTS.md — Conference Management Platform (evt-hub)

> Read this file before any task. It contains **non-discoverable landmines and constraints** not visible from the codebase alone.
> Modules with their own AGENTS.md: `apps/api/`, `apps/worker/`, `apps/web/`, `packages/db/`, `plugins/`.

---

## Non-discoverable commands

```bash
# Always use pnpm from root — never npm/yarn inside a workspace
pnpm dev                     # Starts all services via Turborepo
pnpm dev --filter=api        # Only the API
pnpm dev --filter=web        # Only SvelteKit

# Database (always run from packages/db, NOT from root)
pnpm --filter=db db:migrate  # Apply Prisma migrations
pnpm --filter=db db:generate # Regenerate Prisma client after schema change
pnpm --filter=db db:reset    # ⚠ Drops and recreates dev DB (irreversible)

# Tests
pnpm test                    # All Vitest unit/integration tests
pnpm --filter=web test:e2e   # Playwright (requires running stack first: pnpm dev)

# After any schema change: MANDATORY sequence
# 1. Edit packages/db/prisma/schema.prisma
# 2. pnpm --filter=db db:migrate (creates migration)
# 3. pnpm --filter=db db:generate (regenerates client)
# 4. Restart apps/api and apps/worker

# Plugins
pnpm --filter=@evt-hub/plugin-slack dev   # Dev mode for built-in Slack plugin
```

---

## Landmines

**Prisma vs Kysely boundary** — Use Prisma for all standard CRUD. Reach for Kysely (in `packages/db/src/kysely.ts`) only for: CTEs, window functions, complex multi-table aggregations, materialized view queries. Never mix both in the same service function. Import Kysely client as `import { db as kyselyDb }` to distinguish from Prisma `import { prisma }`.

**Session status transitions are validated in `packages/shared/src/state-machines/session.ts`**, not in the API route. Never directly update `session.status` via Prisma without going through the state machine's `transition()` function — it enforces guards and fires side-effect hooks.

**Materialized views are NOT auto-refreshed.** `mv_speaker_stats` and `mv_topic_stats` are refreshed by a BullMQ job in `apps/worker/src/processors/refresh-stats.ts`. If you change session status logic, check whether a refresh job is enqueued. The `REFRESH MATERIALIZED VIEW CONCURRENTLY` statement requires the view to have a unique index — both views have one; do not drop those indexes.

**Plugin hooks are typed in `packages/shared/src/events/`** — when adding a new domain event, add the type there first, then emit via `hooks.emit()` in the API. Never add new hook names as string literals inline; all hook names live in `packages/shared/src/events/hook-names.ts`.

**SSE connections live on `GET /api/v1/sse/:eventId`** — these are long-lived. Do not add middleware that buffers the response body on this route. The route must set `Connection: keep-alive` and `X-Accel-Buffering: no` (for Nginx). This is already configured but easy to break with new middleware.

**JWT refresh token is in httpOnly cookie named `__Host-refresh`** — the `__Host-` prefix enforces Secure + no Domain + Path=/. Do not rename this cookie. Frontend API client (in `apps/web/src/lib/api/client.ts`) sends `credentials: 'include'` — this must remain.

**Offset pagination max is 100** — enforced by Zod schema in `packages/shared/src/schemas/pagination.ts`. Do not hardcode different limits in routes. Always use the shared `paginationSchema`.

**SvelteKit uses `shadcn-svelte`** (not React's `shadcn/ui`). Import components from `$lib/components/ui/`, never from `@shadcn/ui`. The two APIs differ slightly. Check `apps/web/src/lib/components/ui/` before installing new UI packages.

**Email templates use Svelte components** in `packages/email/src/templates/` compiled to HTML via `@svelte-email` — not React Email. Do not install `@react-email/components`.

**Webhooks use HMAC-SHA256 signature** — header `X-evt-hub-Signature: sha256=<hex>`. The signing key is `WEBHOOK_SECRET` per integration (stored in `event_integrations.config.secret`, not in `.env`). Signature verification code is in `packages/shared/src/lib/webhook-signature.ts` — use it, don't rewrite.

---

## Task-specific constraints

**Adding a new API endpoint:**
1. Define the Zod request/response schema in `packages/shared/src/schemas/<domain>.ts`
2. Register the route in `apps/api/src/routes/<domain>/index.ts`
3. Add the operation to `docs/openapi/openapi.yaml` (manually for now — no code-gen yet)
4. Write integration test in `apps/api/tests/integration/<domain>/`

**Adding a new domain event (plugin hook):**
1. Add hook name constant to `packages/shared/src/events/hook-names.ts`
2. Add TypeScript type to `packages/shared/src/events/payloads.ts`
3. Emit via `hooks.emit(HOOK_NAMES.X, payload)` in service
4. Document in `docs/asyncapi/asyncapi.yaml`

**Adding a new plugin:**
1. Create `plugins/<name>/` with `package.json` referencing `@evt-hub/plugin-sdk`
2. Export a `PluginManifest` as default from `index.ts`
3. Add package to `pnpm-workspace.yaml` and `plugins/` list in `.env` `PLUGINS_ENABLED`

**Changing session status logic:**
1. Edit `packages/shared/src/state-machines/session.ts`
2. Add/modify guard in the transitions map
3. Update `docs/specs/state-machines.md`
4. Write unit test in `packages/shared/tests/state-machines/session.test.ts`

**Database migration rules:**
- Migrations are named `YYYYMMDDHHMMSS_description.sql` (Prisma handles this)
- Never edit a migration file after it has been applied (even locally)
- Migrations must be backward-compatible for zero-downtime deploy: additive first, then remove in the next release
- Boolean columns default FALSE, nullable columns default NULL (never empty string)

---

## Scope & routing

| Module | AGENTS.md location | Notes |
|--------|-------------------|-------|
| API routes + services | `apps/api/AGENTS.md` | Fastify plugin quirks, route registration order |
| BullMQ workers | `apps/worker/AGENTS.md` | Job naming, retry config |
| SvelteKit frontend | `apps/web/AGENTS.md` | SvelteKit-specific gotchas, form actions |
| DB schema + migrations | `packages/db/AGENTS.md` | Prisma quirks, migration rules |
| Built-in plugins | `plugins/AGENTS.md` | Plugin SDK constraints |

---

## Spec files (read before implementing a feature)

| Artefact | Path |
|----------|------|
| PRD (user stories, AC, business rules) | `docs/PRD_Conference_Management_Platform_v1.docx` |
| Database schema | `docs/schema.sql` |
| OpenAPI 3.1 spec | `docs/openapi/openapi.yaml` *(TODO)* |
| AsyncAPI 3.0 spec | `docs/asyncapi/asyncapi.yaml` *(TODO)* |
| Error catalog | `docs/specs/error-catalog.md` |
| State machines | `docs/specs/state-machines.md` |
| ADRs | `docs/adr/` |
