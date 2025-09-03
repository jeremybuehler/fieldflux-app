import express from "express";
import type { Request, Response } from "express";
import { registerRoutes } from "./routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let initialized = false;
async function ensureInitialized() {
  if (initialized) return;
  await registerRoutes(app);
  initialized = true;
}

export default async function handler(req: Request, res: Response) {
  await ensureInitialized();
  // @ts-ignore Express request handler signature
  return app(req, res);
}
