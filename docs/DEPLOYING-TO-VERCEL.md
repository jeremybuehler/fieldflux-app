# Deploying to Vercel

This repository is preconfigured for Vercel. The client builds to `dist/public` and the API runs as a serverless function at `api/index.js` (proxying to `dist/serverless.cjs`).

## One‑Time Setup
- Connect repo: Import the GitHub repo into Vercel (project already exists: `fieldflux-73hp1vixd-buehlerdev.vercel.app`).
- Build settings:
  - Install: use default (npm ci)
  - Build: `npm run build`
  - Output: `dist/public`
- Framework preset: None (Vite SPA + custom serverless function).

## Required Environment Variables
Set in Vercel → Project → Settings → Environment Variables. Do not commit secrets to git.
- `OPENAI_API_KEY`: OpenAI API key.
- `DATABASE_URL`: Postgres connection string (optional; falls back to in‑memory for demo).
- Optional/dev toggles: `DEMO_MODE=true` or `DISABLE_AUTH=true`.
- Optional integrations (set only if used):
  - `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`
  - `GOOGLE_ANALYTICS_PROPERTY_ID`, `GOOGLE_PLACES_API_KEY`

## Routes & Rewrites
- SPA: files under `dist/public`.
- API: requests to `/api/*` are rewritten to `api/index` per `vercel.json`.
- Health check: `GET /api/health`.

## Verify Deployment
1) Trigger a deployment (push to main or Redeploy in Vercel).
2) Visit the site: `https://fieldflux-73hp1vixd-buehlerdev.vercel.app/`.
3) Health: `https://fieldflux-73hp1vixd-buehlerdev.vercel.app/api/health` should return 200.

## Local Notes
- Secrets are managed in Vercel. Local env files are ignored by git.
- The repo already ignores: `.env`, `.env.local`, `.vercel`, `dist/`, and `node_modules/` in `.gitignore`.
