# Threat Model (Draft)

Assets
- User identities, tenant data, API keys, content drafts, analytics.

Trust Boundaries
- Browser ↔ Server ↔ External APIs (OpenAI, Google, Twilio) ↔ Postgres.

Key Risks
- Cross-tenant data access due to missing `tenantId` filters.
- Leaked secrets/default API keys and verbose logs with PII.
- Insufficient auth on select endpoints (header-based checks).

Mitigations
- Enforce `requireMembership()` + tenant scoping at storage layer.
- Fail fast on missing secrets; remove insecure fallbacks.
- Redact logs; validate all inputs with zod.
