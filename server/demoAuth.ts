import type { Express, RequestHandler } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

// Demo user data
const DEMO_USER = {
  id: "demo_user_123",
  email: "demo@fieldflux.com", 
  firstName: "Jeremy",
  lastName: "Buehler",
  profileImageUrl: null,
};

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  return session({
    secret: process.env.SESSION_SECRET || 'demo-secret-key-12345',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to false for development
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.use(getSession());

  // Demo login route
  app.post("/api/login", async (req, res) => {
    try {
      // Create or get demo user
      await storage.upsertUser(DEMO_USER);
      
      // Set user session
      (req.session as any).user = DEMO_USER;
      
      res.json({ 
        success: true, 
        message: "Demo login successful",
        user: DEMO_USER 
      });
    } catch (error) {
      console.error("Demo login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Demo logout route
  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true, message: "Logged out successfully" });
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = (req.session as any)?.user;
  
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Attach user to request for routes to use
  (req as any).user = {
    claims: {
      sub: user.id,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
      profile_image_url: user.profileImageUrl
    }
  };
  
  next();
};