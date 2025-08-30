import type { Express, RequestHandler } from "express";

export type AuthProvider = {
  isAuthenticated: RequestHandler;
};

export async function configureAuth(app: Express): Promise<AuthProvider> {
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

