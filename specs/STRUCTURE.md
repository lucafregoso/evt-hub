# STRUCTURE.md — Monorepo layout (evt-hub)

```
evt-hub/
│
├── apps/
│   ├── api/                     # Fastify 5 API server (port 3001)
│   │   ├── src/
│   │   │   ├── routes/          # Route handlers per domain (F01–F13)
│   │   │   │   ├── auth/        # POST /login /register /logout /refresh
│   │   │   │   ├── events/      # CRUD + /locations /sessions /stats
│   │   │   │   ├── series/      # CRUD event series
│   │   │   │   ├── sessions/    # CRUD + /comments /votes /feedback
│   │   │   │   ├── speakers/    # CRUD + /stats
│   │   │   │   ├── talks/       # CRUD
│   │   │   │   ├── reviews/     # review phases + reviews
│   │   │   │   ├── schedule/    # versions + slots + conflict check
│   │   │   │   ├── travel/      # travel requests + bookings
│   │   │   │   ├── attendees/   # favorites + check-in + feedback
│   │   │   │   ├── stats/       # cross-event analytics
│   │   │   │   └── sse/         # Server-Sent Events endpoint
│   │   │   ├── services/        # Business logic (stateless functions)
│   │   │   ├── plugins/         # Fastify plugins (auth, db, sentry, cors, rate-limit)
│   │   │   ├── hooks/           # Domain event emitter (wraps EventEmitter)
│   │   │   └── lib/             # Utilities (pagination, errors, response-helpers)
│   │   ├── tests/
│   │   │   ├── unit/
│   │   │   └── integration/     # Supertest-style HTTP tests against real DB
│   │   ├── AGENTS.md            # Fastify-specific gotchas
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── worker/                  # BullMQ job processor (no HTTP server)
│   │   ├── src/
│   │   │   ├── processors/      # One file per queue: email, webhook, plugin-async, stats-refresh
│   │   │   ├── plugin-loader/   # Dynamic plugin loading + async hook dispatch
│   │   │   └── lib/             # BullMQ client factory, retry config
│   │   ├── AGENTS.md
│   │   └── package.json
│   │
│   └── web/                     # SvelteKit frontend (port 5173 in dev)
│       ├── src/
│       │   ├── routes/          # SvelteKit file-based routing
│       │   │   ├── (organizer)/ # Dashboard, events, schedule builder
│       │   │   ├── (speaker)/   # Speaker portal, talks, proposals
│       │   │   ├── (reviewer)/  # Review queue, scoring
│       │   │   ├── (attendee)/  # Public schedule, favorites, check-in
│       │   │   └── api/         # SvelteKit API routes (thin proxies or form actions)
│       │   └── lib/
│       │       ├── components/
│       │       │   └── ui/      # shadcn-svelte components
│       │       ├── stores/      # Svelte writable/derived stores (client state)
│       │       └── api/         # Typed API client (fetch wrappers, TanStack Query hooks)
│       ├── e2e/                 # Playwright tests
│       ├── AGENTS.md
│       └── package.json
│
├── packages/
│   ├── db/                      # Prisma schema + migrations + both DB clients
│   │   ├── prisma/
│   │   │   ├── schema.prisma    # SOURCE OF TRUTH for DB schema
│   │   │   └── migrations/      # Never edit applied migrations
│   │   ├── src/
│   │   │   ├── client.ts        # PrismaClient singleton (export: prisma)
│   │   │   └── kysely.ts        # Kysely instance for complex queries (export: kyselyDb)
│   │   ├── AGENTS.md
│   │   └── package.json
│   │
│   ├── shared/                  # Shared TypeScript types, Zod schemas, constants
│   │   ├── src/
│   │   │   ├── types/           # TS interfaces (generated from Prisma + manual additions)
│   │   │   ├── schemas/         # Zod schemas for API request/response validation
│   │   │   │   └── pagination.ts  # ← shared pagination schema (always use this)
│   │   │   ├── errors/          # ApplicationError class + error codes (see error-catalog.md)
│   │   │   ├── events/
│   │   │   │   ├── hook-names.ts  # ← all domain event hook names (no inline strings)
│   │   │   │   └── payloads.ts    # ← typed payloads for each hook
│   │   │   ├── state-machines/  # Session, Travel, ScheduleVersion state machines
│   │   │   └── lib/
│   │   │       └── webhook-signature.ts  # HMAC-SHA256 signing/verification
│   │   └── package.json
│   │
│   ├── email/                   # Email templates (Svelte components → HTML via @svelte-email)
│   │   ├── src/templates/       # One .svelte file per email type
│   │   └── package.json
│   │
│   └── ui/                      # Shared Svelte UI components (beyond shadcn-svelte)
│       ├── src/components/
│       └── package.json
│
├── plugins/
│   ├── slack/                   # Built-in Slack notification plugin
│   │   ├── src/
│   │   │   └── index.ts         # Exports PluginManifest as default
│   │   └── package.json
│   └── social-card/             # Built-in social card generator (Satori → PNG)
│       ├── src/
│       │   ├── index.ts         # Exports PluginManifest as default
│       │   └── templates/       # Card design templates (SVG via Satori)
│       └── package.json
│
├── docs/
│   ├── adr/                     # Architecture Decision Records
│   │   └── ADR-LOG.md
│   ├── openapi/
│   │   └── openapi.yaml         # TODO: OpenAPI 3.1 spec
│   ├── asyncapi/
│   │   └── asyncapi.yaml        # TODO: AsyncAPI 3.0 spec
│   └── specs/
│       ├── error-catalog.md     # Standardized error codes
│       └── state-machines.md    # Formal state machine specs
│
├── infra/
│   ├── docker/                  # Dockerfiles
│   │   ├── api.Dockerfile
│   │   ├── worker.Dockerfile
│   │   └── web.Dockerfile
│   ├── compose/
│   │   ├── docker-compose.yml   # Dev: external services only
│   │   └── docker-compose.prod.yml  # Prod: full stack
│   └── k8s/                     # Kubernetes manifests (TODO)
│
├── AGENTS.md                    # ← AI coding context (you are here)
├── .env.example                 # All environment variables with descriptions
├── .env                         # (gitignored)
├── turbo.json                   # Turborepo pipeline config
├── package.json                 # Root workspace package.json
├── pnpm-workspace.yaml          # pnpm workspaces definition
└── LICENSE                      # MIT
```
