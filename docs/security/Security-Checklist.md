# Security Checklist

- Auth enforced via middleware (no ad-hoc header checks)
- Tenant isolation: queries filtered by `tenantId`
- Input validation: zod schemas at boundaries
- Logging: no sensitive payloads; minimal metadata
- Secrets: loaded from env; no defaults checked into code
- DB migrations: reviewed for exposure risks
- External calls: timeouts, error handling, and rate limits considered
