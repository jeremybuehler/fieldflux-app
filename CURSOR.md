# CURSOR.md

This repo is configured for rapid development inside Cursor. Use this guide for day-to-day workflows, quick commands, testing, and deployment.

## Stack Overview
- **Frontend**: React 18 + TypeScript, Vite (`client/`, built to `dist/public`)
- **Backend**: Express (TypeScript) with Vite dev middleware (`server/index.ts`)
- **DB**: PostgreSQL + Drizzle ORM (`shared/schema.ts`, migrations in `migrations/`)
- **Auth/Tenancy**: JWT-based auth, multi-tenant resolution, OIDC optional
- **UI**: Tailwind CSS + shadcn/ui

## Quick Start (Dev)
1) Ensure Node 20+, Postgres available; set env vars (see below)
2) Install deps: `npm install`
3) Apply schema: `npm run db:push`
4) Start dev server: `npm run dev`

Dev server boots Express and serves the Vite client. App listens on `http://localhost:8080` (Express) with Vite proxying client assets.

## Environment Variables
Create `.env` (copy from `.env.example` if present). Minimum:
```
DATABASE_URL=postgresql://user:pass@host:5432/db
OPENAI_API_KEY=sk-...
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-jwt-refresh-secret
SESSION_SECRET=your-session-secret
```
Optional:
```
GOOGLE_ANALYTICS_PROPERTY_ID=...
GOOGLE_PLACES_API_KEY=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
DISABLE_AUTH=true          # dev only
DEMO_MODE=true             # optional demo login
```

Drizzle config requires `DATABASE_URL` at startup (`drizzle.config.ts`). Server logs a warning if `DATABASE_URL` is missing and uses in-memory fallbacks for some operations, but DB features will be limited.

## Common Commands
```
# Dev / Build / Run
npm run dev                 # Start Express (dev) + Vite
npm run build               # Vite build + esbuild server bundles to dist/
npm start                   # Run production server from dist/index.js

# Type-check & tests
npm run check               # tsc
npm test                    # vitest
npm run test:unit
npm run test:integration
npm run test:e2e            # Playwright
npm run e2e:headed          # Playwright headed
npm run e2e:report          # Open Playwright HTML report
npm run test:coverage

# Database (Drizzle)
npm run db:push             # Apply schema to DB
npm run db:generate         # Generate migrations from schema
npm run db:migrate          # Run migrations
npm run seed:tenants        # Seed demo tenants

# Context docs sync (docs/context/*)
npm run context:refresh     # Regenerate Endpoints.md + Schema summaries

# Security & Performance
npm run security:scan
npm run perf:load           # API/DB/frontend perf bundle
npm run perf:api            # Artillery or k6
npm run perf:db
npm run perf:frontend       # Lighthouse + bundle analysis
npm run perf:report
```

## Health Check & Quick Verification
- Health endpoint: `GET /api/health`
  - Returns overall status and sub-checks (database, OpenAI key present, analytics, error monitoring).
  - Non-healthy states return `503` as appropriate.

Example quick check (server running):
```
curl -s http://localhost:8080/api/health | jq
```

## Testing
- **Unit/Integration**: Vitest. See `tests/README.md` for patterns and utilities.
- **E2E**: Playwright configured via `playwright.config.ts` (defaults to baseURL `http://localhost:8080`).
- **API Collections**: Newman scripts under `tests/api`.
- **Performance**: Artillery + k6 + Lighthouse with scripts under `tests/performance`.

Notes:
- Install browsers for Playwright: `npx playwright install`.
- E2E webServer config will build+start the app automatically when not in CI.

## Project Structure
```
client/           # React app (root set by Vite)
server/           # Express server, routes, services
shared/           # Drizzle schema and shared types
migrations/       # Drizzle migrations
docs/             # Product/tech docs; context docs under docs/context
tests/            # Unit, integration, e2e, performance
dist/             # Build output (client under dist/public)
```

Key files:
- `server/index.ts`: server entry; sets security headers, rate limits, error handlers, Vite dev or static serve, listens on `PORT` (default 8080).
- `server/routes.ts`: registers `/api/*` routes, includes `/api/health` with detailed checks.
- `server/db.ts`: Drizzle Postgres client. Requires `DATABASE_URL` for DB-backed features.
- `vite.config.ts`: Vite + aliases `@`, `@shared`, `@assets`; output to `dist/public`.
- `drizzle.config.ts`: Uses `DATABASE_URL` and `shared/schema.ts`.

## Deployment
- Vercel supported (`vercel.json`, `server/serverless.ts`, `api/index.js`).
- Build command: `npm run build`
- Output directory: `dist/public`
- API routes: serverless under `/api/*` or deployed Node server using `dist/index.js`.
- Set env vars in hosting platform (server vars plus `VITE_` prefix for client where applicable).

See also: `README.md` (Deployment), `AGENTS.md` (Vercel notes), `infrastructure/` (Azure bicep templates).

## Troubleshooting
- Missing `DATABASE_URL`: Drizzle config will throw during tooling; server may warn and fall back in limited mode. Provide a valid Postgres connection for full functionality.
- Health endpoint not healthy: check DB connectivity, OpenAI key presence, analytics property ID, and error monitor status in response.
- Playwright fails to reach app: ensure nothing else uses port 8080; set `PLAYWRIGHT_BASE_URL` if needed.
- Build issues: ensure Node 20+, run `npm run check` and fix type errors. Clear `dist/` and retry.
- CSS/UI not updating: confirm Vite is running; check Tailwind `content` globs in `tailwind.config.ts`.

## Cursor Tips
- Use the Context scripts: `npm run context:refresh` after changing routes or schema to keep docs up-to-date.
- Grep endpoints quickly: search `/api/` handlers under `server/routes.ts` and `server/routes/*`.
- Quick smoke test: `curl http://localhost:8080/api/health` before running e2e.

---
Last updated: 2025-09-10