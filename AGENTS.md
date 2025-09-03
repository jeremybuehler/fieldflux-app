# Repository Guidelines

## Project Structure & Module Organization
- `server/`: Express app (`index.ts`, `routes.ts`, `vite.ts`, `storage.ts`).
- `shared/`: Cross‑cutting TypeScript types and Drizzle schema (`@shared/*`).
- `client/`: Static entry `index.html`; add UI under `client/src/`.
- `migrations/`: Drizzle migrations (keep in sync with `shared/schema.ts`).
- `tests/`: Manual scenarios and notes (no automated runner yet).
- Supporting: `docker-compose.yml`, `Dockerfile`, `drizzle.config.ts`, `vite.config.ts`.

## Build, Test, and Development Commands
- `npm run dev`: Start Express in dev; Vite serves client.
- `npm run build`: Build client with Vite; bundle server to `dist/` via esbuild.
- `npm start`: Run production server from `dist/index.js`.
- `npm run check`: Type‑check with `tsc` (no emit).
- `npm run db:push` | `db:generate` | `db:migrate`: Manage Drizzle schema/migrations.
- `docker-compose up -d`: Start local Postgres.
- Quick check: `curl http://localhost:8080/api/health`.

## Coding Style & Naming Conventions
- TypeScript strict; prefer explicit types on public APIs.
- Indentation 2 spaces; use semicolons; double quotes.
- Server files: `kebab-case.ts` in `server/`. React: `PascalCase.tsx` in `client/src/components`.
- Shared modules live in `shared/` and import via `@shared/*`.

## Testing Guidelines
- No framework configured yet; verify endpoints with curl/REST client.
- Document scenarios in `tests/` as `feature-name.md`.
- If adding tests, propose `vitest` (unit) and `playwright` (e2e).

## Commit & Pull Request Guidelines
- Conventional Commits: `type(scope)!: short imperative summary`.
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- Subject ≤ 72 chars; wrap body ~100; explain motivation and outcome; link issues (e.g., `Closes #123`).
- Examples: `feat(shared): add socialMediaAnalytics table`; `fix(server): validate Twilio phone number format`.

## Security & Configuration Tips
- Copy `.env.example` → `.env`. Required: `DATABASE_URL`, `OPENAI_API_KEY`. Client vars use `VITE_` prefix.
- Never commit secrets; rotate demo keys. Validate external inputs; avoid logging sensitive data.

## Architecture Overview
- Dev: Express + Vite middleware. Prod: esbuild‑bundled server in `dist/`.
- Data: Postgres + Drizzle ORM; migrations tracked in `migrations/`.
- Integrations (optional): OpenAI, Twilio, Google Analytics/Places.
- Vercel: `npm run build`; output `dist/public`; API under `api/index.ts`; SPA rewrites via `vercel.json`.

## Multi‑Tenancy & Auth
- Tenant resolution from `Host` via `tenant_domains`.
- Per‑tenant OIDC via `oauth_connections` (supports Auth0 Orgs via `organization`).
- Set `DEMO_MODE=true` for a frictionless demo user; `DISABLE_AUTH=true` for local dev.
- Add `tenantId` to domain tables and filter by `req.tenant.id` progressively.

