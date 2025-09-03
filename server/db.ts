import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

// In dev without a DB, allow falling back to in-memory storage.
// Export an undefined db if DATABASE_URL is not set; callers should guard.
export let db: any;
if (process.env.DATABASE_URL) {
  const sql = postgres(process.env.DATABASE_URL);
  db = drizzle(sql, { schema });
} else {
  console.warn("DATABASE_URL not set; using in-memory storage fallback.");
}
