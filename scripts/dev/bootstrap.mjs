#!/usr/bin/env node
import { spawnSync } from "node:child_process";

function log(msg) { console.log(`[dev:bootstrap] ${msg}`); }

const PORT = process.env.PORT || 3000;
log(`Using PORT=${PORT}`);

// Check auth endpoint quickly
try {
  const res = await fetch(`http://localhost:${PORT}/api/health`).catch(()=>null);
  if (!res) {
    log(`Server not running yet. Start it with: npm run dev`);
  } else {
    log(`Health: ${res.status}`);
  }
} catch {}

log(`Tips:\n- Ensure .env has DISABLE_AUTH=true for local dev.\n- Open http://localhost:${PORT}\n- Auth check: curl http://localhost:${PORT}/api/auth/user`);

