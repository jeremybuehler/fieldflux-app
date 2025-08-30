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
  const store = process.env.DATABASE_URL
    ? new PgStore({ conString: process.env.DATABASE_URL, ttl: sessionTtl, tableName: "sessions" })
    : undefined;

  return session({
    secret: process.env.SESSION_SECRET || "change-me",
    store,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl,
    },
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
  const callbackUrl =
    process.env.OIDC_CALLBACK_URL || `${process.env.BASE_URL || "http://localhost:8080"}/api/callback`;

  if (!issuerUrl || !clientId || !clientSecret) {
    throw new Error("Missing OIDC_ISSUER_URL, OIDC_CLIENT_ID, or OIDC_CLIENT_SECRET");
  }

  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const discovered = await oidc.Issuer.discover(issuerUrl);
  const oidcClient = new discovered.Client({ client_id: clientId, client_secret: clientSecret });

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
    { name: "oidc", client: oidcClient, params: { scope: "openid email profile offline_access" }, callbackURL: callbackUrl },
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
    const discovered = await oidc.Issuer.discover(issuerUrl);
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

