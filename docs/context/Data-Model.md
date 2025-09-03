# Data Model

The system uses Postgres with Drizzle ORM. Tenancy is attached progressively via `tenantId` on domain tables.

Generated Summary
- See `Schema-Summary.md` for a generated list of tables and columns.

Notes
- Keep `migrations/` in sync with `shared/schema.ts`.
- Use `npm run db:generate` + `npm run db:migrate` (or `db:push`) to apply changes.
- Filter queries by `tenantId` for multi-tenant safety.
