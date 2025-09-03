#!/usr/bin/env tsx
import { promises as fs } from "fs";
import path from "path";

async function run() {
  const schemaPath = path.resolve(process.cwd(), "shared", "schema.ts");
  const outPath = path.resolve(process.cwd(), "docs", "context", "Schema-Summary.md");
  const src = await fs.readFile(schemaPath, "utf-8");

  const tableRegex = /export\s+const\s+(\w+)\s*=\s*pgTable\(\s*(["'`])([^"'`]+)\2/gi;
  const tables: { varName: string; tableName: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = tableRegex.exec(src))) {
    tables.push({ varName: m[1], tableName: m[3] });
  }

  const lines: string[] = [];
  lines.push("# Schema Summary (Generated)\n");
  lines.push("Generated from shared/schema.ts. Do not edit by hand.\n");
  lines.push(`Tables found: ${tables.length}`);
  lines.push("");
  lines.push("Var Name | Table Name\n--- | ---\n");
  for (const t of tables.sort((a, b) => a.tableName.localeCompare(b.tableName))) {
    lines.push(`${t.varName} | ${t.tableName}`);
  }
  lines.push("");

  await fs.writeFile(outPath, lines.join("\n"), "utf-8");
  console.log(`Wrote schema summary to ${path.relative(process.cwd(), outPath)}`);
}

run().catch((err) => {
  console.error("Failed to generate schema summary:", err);
  process.exit(1);
});

