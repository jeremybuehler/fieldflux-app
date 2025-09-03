# Security Runbook

Routine
- Run `npm run security:scan` and fix errors before merging.
- Review PR checklist; require tenant scoping for new data paths.
- Rotate demo keys regularly; never commit real secrets.

Incident
- Disable affected endpoints; rotate impacted secrets.
- Add a HOTFIX ADR with root cause and remediation.
- Backfill tests or scans that would have caught it.
