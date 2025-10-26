import session from "express-session";
import connectPg from "connect-pg-simple";
import type { Express, RequestHandler } from "express";
import { storage } from "./storage";

// Mock user for bypass mode
const MOCK_USER = {
  id: "bypass-user-123",
  email: "test@fieldflux.local",
  firstName: "Test",
  lastName: "User",
  profileImageUrl: null,
  claims: {
    sub: "bypass-user-123",
    email: "test@fieldflux.local",
    first_name: "Test",
    last_name: "User",
    profile_image_url: null,
    exp: Math.floor(Date.now() / 1000) + 86400 * 365, // 1 year
  }
};

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET || "bypass-dev-secret",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Allow HTTP for local dev
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  // Simple session middleware - no Passport, no OIDC
  app.use(getSession());

  // Ensure mock user exists in database
  try {
    await storage.upsertUser({
      id: MOCK_USER.id,
      email: MOCK_USER.email,
      firstName: MOCK_USER.firstName,
      lastName: MOCK_USER.lastName,
      profileImageUrl: MOCK_USER.profileImageUrl,
    });
  } catch (err) {
    console.log("Mock user already exists or DB not ready");
  }

  // Simple login - just set the session
  app.get("/api/login", (req, res) => {
    (req.session as any).user = MOCK_USER;
    req.session.save(() => {
      res.redirect("/dashboard");
    });
  });

  // Simple logout
  app.get("/api/logout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  });
}

// Middleware that either requires auth or uses mock user
export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = (req.session as any)?.user;

  // If no session, create one with mock user
  if (!user) {
    (req.session as any).user = MOCK_USER;
    req.session.save(() => {
      req.user = MOCK_USER as any;
      next();
    });
    return;
  }

  // User exists in session
  req.user = user as any;
  next();
};
