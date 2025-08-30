import type { Express, RequestHandler } from "express";
import { storage } from "./storage";

export type AuthProvider = {
  isAuthenticated: RequestHandler;
};

export async function configureAuth(app: Express): Promise<AuthProvider> {
  // Demo mode: transparently authenticate as demo user
  if (process.env.DEMO_MODE === "true") {
    const demoHandler: RequestHandler = async (req: any, _res, next) => {
      const demoClaims = {
        sub: "demo@fieldflux.local",
        email: "demo@fieldflux.local",
        first_name: "Demo",
        last_name: "User",
      };
      req.user = { claims: demoClaims };
      try {
        // Ensure demo user and membership exist
        await storage.upsertUser({
          id: demoClaims.sub,
          email: demoClaims.email,
          firstName: demoClaims.first_name,
          lastName: demoClaims.last_name,
          profileImageUrl: null,
          stripeCustomerId: null,
          stripeSubscriptionId: null,
          subscriptionStatus: "free",
          subscriptionPlan: "free",
          subscriptionCurrentPeriodEnd: null,
        } as any);
        const tenant = req.tenant;
        if (tenant) {
          const member = await storage.getMembership(tenant.id, demoClaims.sub);
          if (!member) {
            await storage.createMembership(tenant.id, demoClaims.sub, 'owner');
          }
        }
      } catch {}
      next();
    };
    return { isAuthenticated: demoHandler };
  }
  // Prefer explicit generic OIDC if configured
  if (process.env.OIDC_ISSUER_URL && process.env.OIDC_CLIENT_ID && process.env.OIDC_CLIENT_SECRET) {
    const oidcAuth = await import("./oidcAuth");
    await oidcAuth.setupAuth(app);
    return { isAuthenticated: oidcAuth.isAuthenticated };
  }

  // If running in a Replit OIDC environment, use the existing integration
  if (process.env.REPLIT_DOMAINS) {
    const replitAuth = await import("./replitAuth");
    await replitAuth.setupAuth(app);
    return { isAuthenticated: replitAuth.isAuthenticated };
  }

  // Development or explicitly disabled auth: allow all requests
  if (process.env.DISABLE_AUTH === "true" || app.get("env") === "development") {
    return {
      isAuthenticated: (_req, _res, next) => next(),
    };
  }

  // Default: require auth (return 401). Plug in your OIDC/session here later.
  return {
    isAuthenticated: (_req, res, _next) => res.status(401).json({ message: "Unauthorized" }),
  };
}
