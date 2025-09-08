# Repository Guidelines

## Project Structure & Module Organization
- `server/`: Express app (`index.ts`, `routes.ts`, `vite.ts`, `storage.ts`).
- `shared/`: Cross-cutting TS types and Drizzle schema (`@shared/*`).
- `client/`: Static `index.html`; app UI lives in `client/src/`.
- `migrations/`: Drizzle migrations; keep in sync with `shared/schema.ts`.
- `tests/`: Manual scenarios and notes (no runner yet).
- Supporting: `drizzle.config.ts`, `vite.config.ts`.

## Build, Test, and Development Commands
- `npm run dev`: Start Express in dev; Vite serves client.
- `npm run build`: Build client (Vite) + bundle server to `dist/` (esbuild).
- `npm start`: Run production server from `dist/index.js`.
- `npm run check`: Type-check with `tsc` (no emit).
- `npm run db:push|db:generate|db:migrate`: Manage Drizzle schema/migrations.
- Quick check: `curl http://localhost:8080/api/health`.

## Coding Style & Naming Conventions
- TypeScript strict; prefer explicit types on public APIs.
- Formatting: 2-space indent, semicolons, double quotes.
- Server files: `kebab-case.ts` in `server/`.
- React components: `PascalCase.tsx` in `client/src/components`.
- Shared imports via `@shared/*`; keep shared logic in `shared/`.

## Testing Guidelines
- No test runner yet; verify endpoints with curl/REST client.
- Document scenarios under `tests/` as `feature-name.md` (steps, expected results).
- If adding tests, propose `vitest` (unit) and `playwright` (e2e). Include minimal setup docs.

## Commit & Pull Request Guidelines
- Conventional Commits: `type(scope)!: short imperative summary`.
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- Subject ≤ 72 chars; wrap body ~100; explain motivation/outcome; link issues (e.g., `Closes #123`).
- Include in PRs: clear description, screenshots for UI, DB/migration notes, env changes, and how to test.

## Security & Configuration Tips
- Copy `.env.example` → `.env`. Required: `DATABASE_URL`, `OPENAI_API_KEY`. Client vars use `VITE_` prefix.
- Never commit secrets; rotate demo keys; avoid logging sensitive data; validate external inputs.

## Architecture Overview
- Dev: Express + Vite middleware. Prod: esbuild-bundled server in `dist/`.
- Data: Postgres + Drizzle ORM; migrations in `migrations/`.
- Optional integrations: OpenAI, Twilio, Google Analytics/Places.
- Multi-tenancy & Auth: Tenant from `Host` via `tenant_domains`; OIDC via `oauth_connections` (Auth0 Orgs via `organization`).
- Vercel: `npm run build`; output `dist/public`; API under `api/index.ts`; SPA rewrites via `vercel.json`.
