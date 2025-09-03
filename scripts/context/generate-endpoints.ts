#!/usr/bin/env tsx
import { promises as fs } from "fs";
import path from "path";

async function run() {
  const routesPath = path.resolve(process.cwd(), "server", "routes.ts");
  const outPath = path.resolve(process.cwd(), "docs", "context", "Endpoints.md");
  const src = await fs.readFile(routesPath, "utf-8");

  const endpointRegex = /\bapp\.(get|post|put|delete|patch)\s*\(\s*(["'`])([^"'`]+)\2/gi;
  const endpoints: { method: string; path: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = endpointRegex.exec(src))) {
    const method = m[1].toUpperCase();
    const route = m[3];
    if (route.startsWith("/api/")) {
      endpoints.push({ method, path: route });
    }
  }

  // Deduplicate and sort
  const unique = Array.from(new Map(endpoints.map(e => [e.method+" "+e.path, e])).values())
    .sort((a, b) => a.path.localeCompare(b.path) || a.method.localeCompare(b.method));

  const lines: string[] = [];
  lines.push("# Endpoints (Generated)\n");
  lines.push("Generated from server/routes.ts. Do not edit by hand.\n");
  if (unique.length === 0) {
    lines.push("No /api routes found.\n");
  } else {
    lines.push("Method | Path\n--- | ---\n");
    for (const e of unique) {
      lines.push(`${e.method} | ${e.path}`);
    }
    lines.push("");
  }

  await fs.writeFile(outPath, lines.join("\n"), "utf-8");
  console.log(`Wrote ${unique.length} endpoints to ${path.relative(process.cwd(), outPath)}`);
}

run().catch((err) => {
  console.error("Failed to generate endpoints:", err);
  process.exit(1);
});

