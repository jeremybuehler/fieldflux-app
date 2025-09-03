#!/usr/bin/env tsx
import { promises as fs } from "fs";
import path from "path";

type Finding = { level: "error" | "warn"; file: string; message: string };

async function exists(p: string) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function scan() {
  const findings: Finding[] = [];

  // 1) Logging of JSON bodies in server/index.ts
  const serverIndex = path.resolve(process.cwd(), "server", "index.ts");
  if (await exists(serverIndex)) {
    const src = await fs.readFile(serverIndex, "utf-8");
    if (src.includes("capturedJsonResponse") || src.match(/res\.json\s*=\s*function/)) {
      findings.push({ level: "warn", file: "server/index.ts", message: "Response JSON is logged; consider redacting or summarizing to avoid leaking sensitive data." });
    }
  }

  // 2) OpenAI fallback key
  const routesFile = path.resolve(process.cwd(), "server", "routes.ts");
  if (await exists(routesFile)) {
    const src = await fs.readFile(routesFile, "utf-8");
    if (src.includes("default_key")) {
      findings.push({ level: "error", file: "server/routes.ts", message: "OpenAI API key fallback detected (default_key). Remove insecure defaults; fail fast if missing." });
    }
    // Endpoints using ad-hoc auth checks instead of middleware
    const badAuth = src.match(/req\.get\(['"]user['"]\)/g)?.length || 0;
    if (badAuth > 0) {
      findings.push({ level: "warn", file: "server/routes.ts", message: "Endpoints rely on req.get('user') header checks. Use centralized isAuthenticated/requireMembership middleware." });
    }
  }

  // 3) Membership query double-where in storage
  const storageFile = path.resolve(process.cwd(), "server", "storage.ts");
  if (await exists(storageFile)) {
    const src = await fs.readFile(storageFile, "utf-8");
    if (src.includes("getMembership") && src.match(/\.where\(/g)?.length && src.match(/getMembership[\s\S]*?\.where\([\s\S]*?\.where\(/)) {
      findings.push({ level: "error", file: "server/storage.ts", message: "getMembership() chains .where() twice; combine with and(...) to avoid dropping conditions." });
    }
  }

  // 4) Env placeholders in .env.example
  const envExample = path.resolve(process.cwd(), ".env.example");
  if (await exists(envExample)) {
    const src = await fs.readFile(envExample, "utf-8");
    const required = ["DATABASE_URL", "OPENAI_API_KEY"]; 
    for (const key of required) {
      if (!src.includes(key)) {
        findings.push({ level: "warn", file: ".env.example", message: `Missing ${key} in .env.example` });
      }
    }
  }

  // Print report
  let errors = 0;
  if (findings.length === 0) {
    console.log("Security scan: no findings.");
  } else {
    console.log("Security scan findings:\n");
    for (const f of findings) {
      if (f.level === "error") errors++;
      console.log(`- [${f.level.toUpperCase()}] ${f.file}: ${f.message}`);
    }
  }

  if (errors > 0) process.exit(1);
}

scan().catch((e) => {
  console.error("Security scan failed:", e);
  process.exit(1);
});

