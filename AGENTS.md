# Repository Guidelines

## Project Structure & Module Organization
- `server/`: Express app (`index.ts`, `routes.ts`, `vite.ts`, `storage.ts`).
- `shared/`: Cross‑cutting TypeScript types and Drizzle ORM schema.
- `client/`: Static entry (`index.html`); add UI under `client/src/` when needed.
- `migrations/`: Drizzle migrations; keep in sync with `shared/schema.ts`.
- `tests/`: Manual scenarios and notes (no automated runner yet).
- Supporting: `docker-compose.yml` (Postgres), `Dockerfile`, `drizzle.config.ts`, `vite.config.ts`.

## Build, Test, and Development Commands
- `npm run dev`: Start Express in development (Vite middleware serves client).
- `npm run build`: Build client with Vite and bundle server to `dist/` via esbuild.
- `npm start`: Run production server from `dist/index.js`.
- `npm run check`: Type check with `tsc` (no emit).
- `npm run db:push`: Apply schema to the database.
- `npm run db:generate` / `npm run db:migrate`: Create/apply Drizzle migrations.
- Example: `docker-compose up -d` to start local Postgres.

## Coding Style & Naming Conventions
- TypeScript strict mode; prefer explicit types for public APIs.
- Indentation: 2 spaces; use semicolons; double quotes to match existing files.
- Server files: `kebab-case.ts` in `server/`; shared modules in `shared/` via `@shared/*` path alias.
- React components (when added): `PascalCase.tsx` under `client/src/components`.

## Testing Guidelines
- Framework: none configured yet. Use curl or REST client to verify endpoints.
  - Example: `curl http://localhost:8080/api/health`.
- Keep test docs in `tests/`; prefer naming like `feature-name.md`.
- If adding automated tests, propose `vitest` for unit tests and `playwright` for e2e.

## Commit & Pull Request Guidelines
- Format (Conventional Commits): `type(scope)!: short imperative summary`
  - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
  - Scopes: `server`, `client`, `shared`, `db`, `infra`, `tests`, `docs`.
  - Breaking changes: add `!` after scope and a `BREAKING CHANGE:` footer.
- Body: explain motivation and outcome; reference issues (e.g., `Closes #123`).
- Line length: 72 chars for subject; wrap body at ~100.
- Examples:
  - `feat(shared): add socialMediaAnalytics table`
  - `fix(server): validate Twilio phone number format`
  - `refactor(server): extract GA service from routes`
  - `chore(db): generate drizzle migration for leads`

## Security & Configuration Tips
- Copy `.env.example` to `.env`. Required: `DATABASE_URL`, `OPENAI_API_KEY`. Optional: Twilio, Google Analytics/Places, Replit.
- Client‑side env vars must be prefixed with `VITE_`.
- Never commit secrets; rotate keys used for demos.
- Validate external inputs (Twilio numbers, IDs) and avoid logging sensitive data.

## Architecture Overview
- Express server with Vite in dev, bundled via esbuild for prod.
- Postgres + Drizzle ORM (`shared/schema.ts`); migrations tracked in `migrations/`.
- Optional integrations: OpenAI, Twilio, Google Analytics/Places.
