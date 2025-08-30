import type { Request, Response, NextFunction } from "express";
import { storage } from "./storage";

export async function tenantResolver(req: Request, _res: Response, next: NextFunction) {
  try {
    const host = req.headers["x-forwarded-host"] || req.headers.host || "";
    const hostname = Array.isArray(host) ? host[0] : host;
    const domain = (hostname || "").split(":")[0].toLowerCase();

    const tenant = await storage.getTenantByDomain(domain);
    // Attach minimal tenant context
    (req as any).tenant = tenant || null;
  } catch (e) {
    (req as any).tenant = null;
  }
  next();
}

