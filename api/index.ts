import express from "express";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { registerRoutes } from "../server/routes";

// Create a single Express app instance reused across invocations
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let initialized = false;
async function ensureInitialized() {
  if (initialized) return;
  await registerRoutes(app); // sets up all /api/* routes and middleware
  initialized = true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await ensureInitialized();
  // Delegate handling to Express app
  // @ts-ignore - Express is a request handler
  return app(req, res);
}

