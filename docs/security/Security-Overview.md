# Security Overview

Purpose
- Provide baseline security guidance and checks for FieldFlux.

Focus Areas
- Authentication/Authorization: centralized middleware, membership checks, tenant isolation.
- Secrets Management: use env vars; never hardcode or fallback to insecure defaults.
- Data Handling: validate inputs, avoid logging sensitive payloads, paginate/filter tenant data at the DB layer.
- Dependencies: keep up to date; review high-risk packages.

Process
- Run `npm run security:scan` locally and in CI.
- Use PR checklist to confirm tenant filtering, validation, and secrets.
- Record material decisions as ADRs.
