#!/usr/bin/env node
import { promises as fs } from "fs";
import path from "path";

const findings = [];

async function exists(p) { try { await fs.access(p); return true; } catch { return false; } }

async function main() {
  const cwd = process.cwd();

  // server/index.ts logging
  const serverIndex = path.resolve(cwd, "server", "index.ts");
  if (await exists(serverIndex)) {
    const s = await fs.readFile(serverIndex, "utf-8");
    if (s.includes("capturedJsonResponse") || /res\.json\s*=\s*function/.test(s)) {
      findings.push({ level: "warn", file: "server/index.ts", msg: "Response JSON is logged; redact or summarize." });
    }
  }

  // routes: default_key and header-based auth
  const routes = path.resolve(cwd, "server", "routes.ts");
  if (await exists(routes)) {
    const s = await fs.readFile(routes, "utf-8");
    if (s.includes("default_key")) findings.push({ level: "error", file: "server/routes.ts", msg: "Insecure OpenAI key fallback (default_key)." });
    if (/req\.get\(['"]user['"]\)/.test(s)) findings.push({ level: "warn", file: "server/routes.ts", msg: "Endpoints check req.get('user'); use auth middleware." });
  }

  // storage: chained where in getMembership
  const storage = path.resolve(cwd, "server", "storage.ts");
  if (await exists(storage)) {
    const s = await fs.readFile(storage, "utf-8");
    // Limit search window near the function to avoid false positives
    const m = s.match(/async\s+getMembership\([\s\S]*?\)\s*{([\s\S]*?)}/);
    if (m) {
      const body = m[1];
      if (/\.where\([\s\S]{0,300}?\.where\(/.test(body)) {
        findings.push({ level: "error", file: "server/storage.ts", msg: "getMemberOk, do you ahship() chains .where() twice; combine with and(...)." });
      }
    }
  }

  // .env.example keys
  const envEx = path.resolve(cwd, ".env.example");
  if (await exists(envEx)) {
    const s = await fs.readFile(envEx, "utf-8");
    for (const key of ["DATABASE_URL", "OPENAI_API_KEY"]) if (!s.includes(key)) findings.push({ level: "warn", file: ".env.example", msg: `Missing ${key}` });
  }

  if (findings.length === 0) {
    console.log("Security scan: no findings.");
  } else {
    console.log("Security scan findings:\n");
    let errors = 0;
    for (const f of findings) { if (f.level === "error") errors++; console.log(`- [${f.level.toUpperCase()}] ${f.file}: ${f.msg}`); }
    if (errors > 0) process.exit(1);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
