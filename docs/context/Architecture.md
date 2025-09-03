# Architecture

- Server: Express + TypeScript; Vite middleware in dev, esbuild bundle in prod.
- Client: React 18 + Vite + Tailwind; output in `dist/public`.
- Data: Postgres + Drizzle ORM (`shared/schema.ts`); migrations in `migrations/`.
- Auth: Demo/disabled in dev; per-tenant OIDC supported; sessions optional.
- Hosting: Vercel serverless entry `api/index.js`; SPA rewrites via `vercel.json`.

Key Paths
- Server: `server/index.ts`, `server/routes.ts`, `server/storage.ts`
- Client: `client/index.html`, `client/src/*`
- Shared: `shared/schema.ts`
- Build: `vite.config.ts`, `drizzle.config.ts`

Settings Architecture
- Settings page: `client/src/pages/settings.tsx`.
- Tabs are modularized into components under `client/src/pages/settings/sections/`:
  - `WordPressSection.tsx`
  - `AnalyticsSection.tsx`
  - `TwilioSection.tsx`
  - `SocialSection.tsx`
  - `BusinessSection.tsx`
- White-label section lives in `client/src/pages/settings/sections/WhiteLabelSection.tsx` and uses FieldFlux naming.

Tenant Scoping
- Storage reads support optional tenant-scoped filters for low‑risk tables.
- See `server/storage.ts` methods like `getAllWordPressPosts(tenantId?)`, `getLead(id, tenantId?)`, etc.
- In routes, obtain `tenantId` from `req.tenant.id` (see `server/tenant.ts`) and pass into storage when needed.
