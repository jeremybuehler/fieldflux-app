## Summary
- Briefly describe the problem and the outcome.
- Reference issues (e.g., Closes #123).

## Changes
- High‑level bullets of what changed (server/client/shared/db/infra).

## Screenshots / Demos (UI)
- Before/After or short GIF (if applicable).

## How To Test
- Dev: `npm run dev` then visit `http://localhost:8080`.
- Health: `curl http://localhost:8080/api/health`.
- Include any special steps, seed data, or flags.

## Database Notes
- Migrations: `npm run db:generate` / `npm run db:migrate` / `npm run db:push`.
- Describe schema changes and backward compatibility.

## Checklist
- [ ] Conventional Commit: `type(scope)!: subject` (subject ≤ 72 chars)
- [ ] Linked issues included (e.g., `Closes #...`)
- [ ] Code compiles: `npm run build` and `npm run check`
- [ ] Tests added/updated OR manual test steps documented
- [ ] API routes documented/updated (if changed)
- [ ] DB migration generated/applied and noted
- [ ] Docs updated (AGENTS.md/README/API notes if relevant)
- [ ] Secrets not committed; `.env` changes documented (use `VITE_` for client)
- [ ] Security considerations reviewed (validation/logging of sensitive data)

## Additional Notes
- Risks, roll‑out plan, or follow‑ups.
