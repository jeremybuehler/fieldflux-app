import passport from "passport";
import * as oidc from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";
import type { Express } from "express";
import { storage } from "./storage";

const strategyCache = new Map<string, boolean>();

export async function ensureTenantOidcStrategy(app: Express, tenantId: number) {
  const key = `oidc:${tenantId}`;
  if (strategyCache.has(key)) return key;

  const connection = await storage.getTenantOauthConnection(tenantId);
  const issuerUrl = connection?.issuerUrl || process.env.OIDC_ISSUER_URL;
  const clientId = connection?.clientId || process.env.OIDC_CLIENT_ID;
  const clientSecret = connection?.clientSecret || process.env.OIDC_CLIENT_SECRET;
  const organization = connection?.organization; // For Auth0 orgs

  if (!issuerUrl || !clientId || !clientSecret) {
    throw new Error("OIDC not configured for tenant");
  }

  const discovered = await oidc.Issuer.discover(issuerUrl);
  const client = new discovered.Client({ client_id: clientId, client_secret: clientSecret });

  const verify: VerifyFunction = async (tokens, verified) => {
    const user: any = {};
    user.claims = tokens.claims();
    user.access_token = tokens.access_token;
    user.refresh_token = tokens.refresh_token;
    user.expires_at = user.claims?.exp;
    try {
      const claims: any = user.claims || {};
      await storage.upsertUser({
        id: claims.sub || claims.email,
        email: claims.email,
        firstName: claims.given_name || claims.first_name,
        lastName: claims.family_name || claims.last_name,
        profileImageUrl: claims.picture || claims.profile_image_url,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        subscriptionStatus: "free",
        subscriptionPlan: "free",
        subscriptionCurrentPeriodEnd: null,
      } as any);
    } catch {}
    verified(null, user);
  };

  const strategy = new Strategy(
    {
      name: key,
      client,
      params: { scope: "openid email profile offline_access", ...(organization ? { organization } : {}) },
      callbackURL: `${process.env.BASE_URL || ""}/api/callback`,
    } as any,
    verify,
  );

  passport.use(strategy);
  if (!(app as any)._passportInitialized) {
    app.use(passport.initialize());
    app.use(passport.session?.() as any);
    (app as any)._passportInitialized = true;
  }
  passport.serializeUser((user: any, cb) => cb(null, user));
  passport.deserializeUser((user: any, cb) => cb(null, user));

  strategyCache.set(key, true);
  return key;
}
