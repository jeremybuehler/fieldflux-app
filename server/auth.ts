import type { Express, RequestHandler } from "express";
import { storage } from "./storage";
import { enforceProductionSecurity } from "./config/envValidation";

export type AuthProvider = {
  isAuthenticated: RequestHandler;
};

export async function configureAuth(app: Express): Promise<AuthProvider> {
  // 🔐 SECURITY: Validate production environment configuration
  const envConfig = enforceProductionSecurity();
  const { isProduction, hasOIDC, hasReplit } = envConfig;

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
  if (hasOIDC) {
    const oidcAuth = await import("./oidcAuth");
    await oidcAuth.setupAuth(app);
    return { isAuthenticated: oidcAuth.isAuthenticated };
  }

  // If running in a Replit OIDC environment, use the existing integration
  if (hasReplit) {
    const replitAuth = await import("./replitAuth");
    await replitAuth.setupAuth(app);
    return { isAuthenticated: replitAuth.isAuthenticated };
  }

  // Development or explicitly disabled auth: allow all requests (NON-PRODUCTION ONLY)
  if (process.env.DISABLE_AUTH === "true" || app.get("env") === "development") {
    // 🔐 SECURITY: Prevent auth bypass in production
    if (isProduction) {
      console.error("❌ PRODUCTION SECURITY ERROR:");
      console.error("   DISABLE_AUTH=true is not allowed in production environments.");
      console.error("   Authentication bypass blocked for security.");
      throw new Error("Authentication bypass disabled in production. Please configure OIDC.");
    }
    const devHandler: RequestHandler = async (req: any, _res, next) => {
      // Attach a predictable dev user so client routes behind login work
      const devClaims = {
        sub: "dev@fieldflux.local",
        email: "dev@fieldflux.local",
        first_name: "Dev",
        last_name: "User",
      };
      req.user = { claims: devClaims };
      try {
        // Ensure dev user and (optional) membership exist to satisfy downstream code
        await storage.upsertUser({
          id: devClaims.sub,
          email: devClaims.email,
          firstName: devClaims.first_name,
          lastName: devClaims.last_name,
          profileImageUrl: null,
          stripeCustomerId: null,
          stripeSubscriptionId: null,
          subscriptionStatus: "free",
          subscriptionPlan: "free",
          subscriptionCurrentPeriodEnd: null,
        } as any);
        const tenant = req.tenant;
        if (tenant) {
          const member = await storage.getMembership(tenant.id, devClaims.sub);
          if (!member) {
            await storage.createMembership(tenant.id, devClaims.sub, 'owner');
          }
        }
      } catch {}
      next();
    };
    return { isAuthenticated: devHandler };
  }

  // 🔐 FALLBACK SECURITY: Strict authentication required
  // This fallback should only be reached in misconfigured environments
  console.warn("⚠️  AUTHENTICATION WARNING: No auth provider configured, defaulting to strict mode");
  return {
    isAuthenticated: (_req, res, _next) => {
      console.error("Authentication required but no provider configured");
      res.status(401).json({ 
        message: "Unauthorized", 
        error: "Authentication provider not configured",
        hint: isProduction 
          ? "Production requires OIDC_ISSUER_URL, OIDC_CLIENT_ID, and OIDC_CLIENT_SECRET" 
          : "Development mode: set DISABLE_AUTH=true or configure OIDC"
      });
    },
  };
}
