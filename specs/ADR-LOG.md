# Architecture Decision Records — evt-hub

Each ADR follows the format: **Status · Context · Decision · Consequences**.
Status: `Accepted` | `Superseded by ADR-NNN` | `Deprecated`.

---

## ADR-001 — Monorepo con Turborepo + pnpm

**Status:** Accepted

**Context:** Il progetto ha più artefatti correlati (API, worker, web, shared types, DB schema, plugin) che devono condividere dipendenze TypeScript e tooling. La scelta tra polyrepo e monorepo determina il workflow quotidiano e la coerenza dei tipi condivisi.

**Decision:** Monorepo con **pnpm workspaces** + **Turborepo** per l'orchestrazione del build. Struttura: `apps/` (api, worker, web), `packages/` (db, shared, email, ui), `plugins/` (slack, social-card).

**Consequences:**
- `pnpm` è l'unico package manager consentito — npm/yarn non devono essere usati.
- Turborepo gestisce il caching incrementale dei task (`build`, `test`, `lint`).
- I tipi condivisi in `packages/shared` devono essere compilati prima che `apps/api` o `apps/web` possano essere buildati: la pipeline è `^build`.
- Breaking changes in `packages/shared` rompono tutto — usare versioning semantico interno anche per i package locali.

---

## ADR-002 — Fastify 5 come framework HTTP

**Status:** Accepted

**Context:** Serve un framework HTTP per Node.js con eccellente TypeScript support, architettura plugin-based, e performance elevate.

**Options considerati:** Express (maturo ma lento), Fastify (veloce, plugin-based), Hono (edge-first, molto leggero), NestJS (opinionated, DI nativo ma pesante).

**Decision:** **Fastify 5**. L'architettura plugin-based di Fastify si allinea naturalmente con il nostro plugin system. Supporto TypeScript nativo via `fastify.TypeBoxProvider` o Zod. 3x più veloce di Express. Schema validation JSON Schema built-in (usiamo Zod con `fastify-type-provider-zod`).

**Consequences:**
- Usare `fastify-type-provider-zod` per la validazione — non `@fastify/type-provider-typebox`.
- I plugin Fastify (auth, db, sentry) registrati con `fp()` da `fastify-plugin` per propagare le decorazioni.
- Nessun NestJS DI — la dependency injection è manuale (servizi come funzioni pure o classi semplici).
- Route registration order matters in Fastify — i plugin devono essere registrati prima delle route che li usano.

---

## ADR-003 — SvelteKit come framework frontend

**Status:** Accepted

**Context:** Serve un framework frontend moderno per le quattro viste principali: organizer dashboard, speaker portal, attendee view, reviewer panel.

**Options considerati:** Next.js (App Router), Remix, SvelteKit, Nuxt/Vue, React SPA.

**Decision:** **SvelteKit**. Bundle più leggero di Next.js, SSR built-in senza configuration overhead, TypeScript nativo, form actions riducono la complessità client-side per flussi CRUD.

**Consequences:**
- `shadcn/ui` è React-only — usare **shadcn-svelte** (port community Svelte) per i componenti UI.
- Zustand è React-only — stato client gestito con **Svelte stores** nativi (`writable`, `derived`).
- TanStack Query ha adapter SvelteKit (`@tanstack/svelte-query`) — usare quello.
- Il frontend è deployabile come SSR (Node adapter) o statico (static adapter per hosting su CDN).
- L'app deve funzionare anche in modalità API-only (senza web app): separare sempre la business logic dall'API server; il frontend è un client come gli altri.

---

## ADR-004 — Prisma + Kysely per data access

**Status:** Accepted

**Context:** Serve un ORM/query-builder type-safe per PostgreSQL che supporti migrations, relazioni complesse, e query analitiche.

**Decision:** **Prisma 6** come ORM primario (schema-first, migrations integrate, Prisma Client tipizzato). **Kysely** per query che Prisma non può esprimere: CTEs, window functions, aggregazioni complesse, query su materialized views.

**Consequences:**
- Il Prisma schema in `packages/db/prisma/schema.prisma` è la source of truth per il modello dati.
- La `schema.sql` in `docs/` è documentazione/reference — il DB reale è gestito da Prisma migrations.
- Due client: `prisma` (da `@prisma/client`) e `kyselyDb` (da `packages/db/src/kysely.ts`). Importare per nome per distinguerli.
- Dopo ogni modifica a `schema.prisma`: `pnpm --filter=db db:migrate` + `pnpm --filter=db db:generate`.
- Non usare Prisma `$queryRaw` — usare Kysely se serve SQL raw.

---

## ADR-005 — JWT stateless + httpOnly refresh cookie

**Status:** Accepted

**Context:** Serve un meccanismo di autenticazione che funzioni per: web browser (sicuro contro XSS), client API (Bearer token), e sia stateless per scalabilità.

**Decision:** **JWT stateless a due token**: access token (15 min, in memoria nel client) + refresh token (30 giorni, httpOnly cookie `__Host-refresh`). Web client usa cookie; API client usa `Authorization: Bearer <access_token>`.

**Consequences:**
- Access token non revocabile prima della scadenza (15 min window accettata per v1).
- Refresh token in cookie `__Host-` impone: flag `Secure`, no `Domain`, `Path=/` — non modificare il nome o gli attributi.
- MFA (TOTP/passkey) è deferred a v2.
- Logout invalida il refresh token server-side (tabella `refresh_token_blocklist` in Redis, TTL 30d).
- API key per developer (P5) sono generate separatamente, non basate su JWT.

---

## ADR-006 — Plugin system ibrido (sync hooks + async BullMQ)

**Status:** Accepted

**Context:** Serve un plugin system che supporti sia operazioni leggere/sincrone (logging, validazioni custom) sia operazioni pesanti/asincrone (Slack, social card, webhook delivery).

**Decision:** **Ibrido**: EventEmitter Node.js per hook sincroni (devono completarsi in < 50ms) + BullMQ jobs per hook asincroni. I plugin dichiarano nel manifest se ogni hook è `sync` o `async`. Il core emette il domain event; se il plugin è async, l'handler del core enqueue un job BullMQ invece di chiamare direttamente il plugin.

**Consequences:**
- Hook sincroni bloccano la request — non usarli per operazioni I/O.
- La lista dei hook names è in `packages/shared/src/events/hook-names.ts` — non usare stringhe literals inline.
- Il worker (`apps/worker`) è il runtime per i plugin async. Se il worker non è attivo, gli hook async sono in coda (non persi, grazie a Redis persistente).
- Plugin esterni (NPM) vengono caricati dinamicamente — il sandboxing è basato su trust (v1 non isola con worker_thread o child_process).

---

## ADR-007 — PostgreSQL full-text search

**Status:** Accepted

**Context:** Serve ricerca testuale su sessioni, speaker, e talk (barra di ricerca globale).

**Options considerati:** PostgreSQL FTS (tsvector + GIN index), Meilisearch, Typesense, Elasticsearch.

**Decision:** **PostgreSQL FTS**. Nessuna infrastruttura aggiuntiva. Sufficiente per la scala delle conferenze (< 50.000 sessioni per istanza). Colonne `search_vector tsvector` pre-calcolate con trigger PostgreSQL su tabelle `sessions` e `speakers`.

**Consequences:**
- Nessuna typo tolerance nativa — accettato per v1.
- Le colonne `search_vector` devono essere aggiornate dai trigger — verificare che i trigger siano attivi dopo ogni migration che cambia le colonne indicizzate.
- Se la qualità della ricerca diventa un pain point in v2, Meilisearch può essere aggiunto come layer separato senza cambiare il modello dati.

---

## ADR-008 — Server-Sent Events (SSE) per real-time

**Status:** Accepted

**Context:** Serve aggiornamento real-time dell'UI per: dashboard review (contatori live), submission counter, notifiche in-app.

**Options considerati:** WebSocket (bidirezionale, più complesso), SSE (unidirezionale, semplice), polling (nessuna infrastruttura aggiuntiva).

**Decision:** **SSE**. Tutte le notifiche real-time sono server→client. Nessuna esigenza di comunicazione client→server in tempo reale (per quello si usano le normali API REST). SSE funziona con HTTP/2, è built-in nel browser, e si riconnette automaticamente.

**Consequences:**
- Route SSE `GET /api/v1/sse/:eventId` — connessione long-lived, non aggiungere middleware che bufferizza il body.
- Header obbligatori: `Content-Type: text/event-stream`, `Cache-Control: no-cache`, `X-Accel-Buffering: no`.
- In deploy multi-istanza, usare Redis pub/sub per propagare gli eventi tra istanze (fan-out).
- Il client deve gestire il reconnect automatico (built-in nel browser via `EventSource`).

---

## ADR-009 — GitFlow come branching strategy

**Status:** Accepted

**Context:** Solo developer, serve una strategia che fornisca un percorso chiaro per feature, release, e hotfix.

**Decision:** **GitFlow** con branch: `main` (produzione), `develop` (integrazione), `feature/xxx`, `release/x.y.z`, `hotfix/xxx`.

**Consequences:**
- Nessun commit diretto su `main` o `develop` — solo via PR/merge.
- Branch `feature/xxx` da `develop`, merge su `develop` via PR.
- Branch `release/x.y.z` da `develop`, merge su `main` + `develop` con tag.
- Branch `hotfix/xxx` da `main`, merge su `main` + `develop`.
- Commit message format: `type(scope): description` — tipi: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`.

---

## ADR-010 — Offset pagination

**Status:** Accepted

**Context:** Serve una strategia di paginazione per le liste API.

**Decision:** **Offset/limit** con parametri `?limit=N&offset=N`. Default: `limit=20`. Max: `limit=100` (enforced da Zod schema). Response include `{ data: [], meta: { total, limit, offset, has_more } }`.

**Consequences:**
- Performance degrada per offset > 10.000 righe — accettato per la scala delle conferenze.
- Usare il schema `paginationSchema` di `packages/shared/src/schemas/pagination.ts` — non hardcodare limiti nelle route.
- Se un endpoint specifico necessita di cursor pagination in futuro, può essere aggiunto come `?cursor=` senza breaking change.

---

## ADR-011 — Licenza MIT

**Status:** Accepted

**Context:** Serve scegliere una licenza open-source per il progetto.

**Decision:** **MIT License**. Massima permissività, nessuna restrizione su uso commerciale, nessun copyleft.

**Consequences:**
- Chi fa deploy può modificare il codice senza rilasciare le modifiche.
- I plugin della community possono usare qualsiasi licenza.
- Il file `LICENSE` deve essere incluso in ogni distribuzione.

---

## ADR-012 — URL versioning + risorse annidate

**Status:** Accepted

**Context:** Serve una convenzione per l'URL structure delle API e una strategia di versioning.

**Decision:**
- Versioning: **URL prefix** `/api/v1/`. Breaking changes → nuovo major version con periodo di deprecazione ≥ 6 mesi. L'header `Sunset` viene aggiunto agli endpoint deprecati.
- URL structure: **annidate dove c'è ownership forte** (`/events/:id/sessions`), **piatte altrimenti** (`/speakers`, `/tags`). Max 2 livelli di nesting.
- Breaking change definition: rimozione campo, cambio tipo campo, cambio semantica endpoint, rimozione endpoint.

**Consequences:**
- Aggiungere campi opzionali NON è una breaking change — non richiede nuovo version.
- `/api/v1/` e `/api/v2/` possono coesistere durante la transizione.
- La OpenAPI spec documenta la versione corrente — ogni version ha il suo file `docs/openapi/v1.yaml`.
- Le deprecation sono segnalate con header `Deprecation: true` e `Sunset: <date>`.
