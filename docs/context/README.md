# Context Docs

This folder is the single source of truth for FieldFlux product and technical context. Keep it current as features evolve.

- Product-Context.md: vision, goals, personas, outcomes
- Architecture.md: system overview, build/runtime, envs
- Data-Model.md: schema overview and tenancy notes
- Endpoints.md: generated index of `/api/*` routes (run generators)
- Roadmap.md: Now/Next/Later with acceptance criteria

Update triggers
- Changing routes → regenerate Endpoints.md
- Changing shared/schema.ts → regenerate Data-Model.md (Schema Summary)
- Major decisions → add an ADR under `docs/decisions/`

Maintenance
- Run `npm run context:refresh` after schema/route changes
- Link PRs to any updated context sections
