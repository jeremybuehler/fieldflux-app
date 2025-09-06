import * as oidc from "openid-client";
import passport from "passport";
import { Strategy, type VerifyFunction } from "openid-client/passport";
import session from "express-session";
import connectPg from "connect-pg-simple";
import type { Express, RequestHandler } from "express";
import { storage } from "./storage";

function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const PgStore = connectPg(session);
  const isProduction = process.env.NODE_ENV === "production";
  
  // 🔐 SECURITY: Validate session secret in production
  const sessionSecret = process.env.SESSION_SECRET;
  if (isProduction && (!sessionSecret || sessionSecret === "change-me")) {
    throw new Error("Production requires a secure SESSION_SECRET. Please set a random 32+ character string.");
  }
  
  const store = process.env.DATABASE_URL
    ? new PgStore({ 
        conString: process.env.DATABASE_URL, 
        ttl: Math.floor(sessionTtl / 1000), // Convert to seconds for PostgreSQL
        tableName: "sessions",
        createTableIfMissing: false // Security: Require table to be created manually
      })
    : undefined;

  if (isProduction && !store) {
    console.warn("⚠️  SESSION WARNING: Using memory store in production. Sessions will not persist across restarts.");
  }

  return session({
    secret: sessionSecret || "dev-secret-change-in-production",
    store,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction, // Only require HTTPS in production
      maxAge: sessionTtl,
      sameSite: isProduction ? 'strict' : 'lax', // Stricter CSRF protection in production
    },
    name: 'fieldflux.sid', // Custom session name for security
  });
}

async function upsertUserFromClaims(claims: any) {
  try {
    await storage.upsertUser({
      id: claims["sub"] || claims["email"] || "anonymous",
      email: claims["email"],
      firstName: claims["given_name"] || claims["name"],
      lastName: claims["family_name"],
      profileImageUrl: claims["picture"],
    });
  } catch {
    // no-op if storage schema differs; this is a stub
  }
}

export async function setupAuth(app: Express) {
  const issuerUrl = process.env.OIDC_ISSUER_URL;
  const clientId = process.env.OIDC_CLIENT_ID;
  const clientSecret = process.env.OIDC_CLIENT_SECRET;
  const baseUrl = process.env.BASE_URL || process.env.VERCEL_URL || "http://localhost:8080";
  const callbackUrl = process.env.OIDC_CALLBACK_URL || `${baseUrl}/api/callback`;

  // 🔐 SECURITY: Strict validation of OIDC configuration
  if (!issuerUrl || !clientId || !clientSecret) {
    console.error("❌ OIDC CONFIGURATION ERROR:");
    console.error(`   OIDC_ISSUER_URL: ${issuerUrl ? '✓ Set' : '❌ Missing'}`);
    console.error(`   OIDC_CLIENT_ID: ${clientId ? '✓ Set' : '❌ Missing'}`);
    console.error(`   OIDC_CLIENT_SECRET: ${clientSecret ? '✓ Set' : '❌ Missing'}`);
    throw new Error("OIDC authentication requires OIDC_ISSUER_URL, OIDC_CLIENT_ID, and OIDC_CLIENT_SECRET");
  }
  
  console.log("🔐 Configuring OIDC authentication:");
  console.log(`   Issuer: ${issuerUrl}`);
  console.log(`   Client ID: ${clientId.substring(0, 8)}...`);
  console.log(`   Callback URL: ${callbackUrl}`);
  
  // Validate issuer URL format
  try {
    new URL(issuerUrl);
  } catch (error) {
    throw new Error(`Invalid OIDC_ISSUER_URL format: ${issuerUrl}`);
  }

  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // 🔌 OIDC Discovery with retry logic
  let discovered;
  let attempts = 0;
  const maxAttempts = 3;
  
  while (attempts < maxAttempts) {
    try {
      console.log(`🔍 Discovering OIDC configuration from ${issuerUrl} (attempt ${attempts + 1}/${maxAttempts})`);
      discovered = await (oidc as any).Issuer.discover(issuerUrl);
      console.log("✅ OIDC discovery successful");
      break;
    } catch (error) {
      attempts++;
      console.error(`❌ OIDC discovery attempt ${attempts} failed:`, error instanceof Error ? error.message : error);
      
      if (attempts >= maxAttempts) {
        console.error("❌ OIDC discovery failed after all attempts");
        throw new Error(`OIDC discovery failed: Unable to discover ${issuerUrl}. Please verify the issuer URL is correct and accessible.`);
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
    }
  }
  
  const oidcClient = new discovered.Client({ client_id: clientId, client_secret: clientSecret });
  console.log("✅ OIDC client initialized successfully");

  const verify: VerifyFunction = async (tokens, verified) => {
    const user: any = {};
    user.claims = tokens.claims();
    user.access_token = tokens.access_token;
    user.refresh_token = tokens.refresh_token;
    user.expires_at = user.claims?.exp;
    await upsertUserFromClaims(user.claims);
    verified(null, user);
  };

  const strategy = new Strategy(
    { name: "oidc", client: oidcClient, params: { scope: "openid email profile offline_access" }, callbackURL: callbackUrl } as any,
    verify,
  );
  passport.use(strategy);

  passport.serializeUser((user: any, cb) => cb(null, user));
  passport.deserializeUser((user: any, cb) => cb(null, user));

  app.get("/api/login", passport.authenticate("oidc", { prompt: "login consent" }));
  app.get(
    "/api/callback",
    passport.authenticate("oidc", { successReturnToOrRedirect: "/dashboard", failureRedirect: "/api/login" }),
  );
  app.get("/api/logout", (req, res) => {
    req.logout(() => res.redirect("/"));
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user: any = req.user;
  if (!req.isAuthenticated?.() || !user?.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) return next();
  try {
    const issuerUrl = process.env.OIDC_ISSUER_URL!;
    const discovered = await (oidc as any).Issuer.discover(issuerUrl);
    const clientId = process.env.OIDC_CLIENT_ID!;
    const clientSecret = process.env.OIDC_CLIENT_SECRET!;
    const oidcClient = new discovered.Client({ client_id: clientId, client_secret: clientSecret });
    const tokens = await oidcClient.refresh(user.refresh_token);
    user.claims = tokens.claims();
    user.access_token = tokens.access_token;
    user.refresh_token = tokens.refresh_token;
    user.expires_at = user.claims?.exp;
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
};
