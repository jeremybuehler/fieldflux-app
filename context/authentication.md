# Authentication Context

## Purpose
Authentication is FieldFlux's comprehensive security system that manages user identity, session handling, and access control for field service businesses. Built on Replit Auth with OpenID Connect (OIDC) integration, it provides secure, scalable authentication while supporting multi-tenant architecture and role-based permissions.

## Components

### Primary Components
- **`Replit Auth`** (`/server/replitAuth.ts`) - Primary authentication provider integration
- **`OIDC Authentication`** (`/server/oidcAuth.ts`) - OpenID Connect implementation
- **`Auth Manager`** (`/server/authManager.ts`) - Authentication strategy coordination
- **`Session Management`** - PostgreSQL-based session storage and lifecycle
- **`Access Control`** - Route protection and permission enforcement

### Supporting Components
- **Auth middleware** - Request authentication and authorization
- **Session store** - PostgreSQL session persistence
- **User context** - Request-scoped user information
- **Security headers** - CSRF and security policy enforcement

## Status
- **Implementation**: ✅ Replit Auth integration functional
- **Session Management**: ✅ PostgreSQL session store implemented
- **OIDC Support**: ✅ OpenID Connect flow working
- **Multi-tenant Support**: ✅ Tenant-aware authentication
- **Security Hardening**: 🔄 Basic security implemented, advanced features needed

## Technical Details

### Authentication Architecture
```typescript
// Authentication strategy management
export class AuthManager {
  private strategies: Map<string, AuthStrategy> = new Map();

  constructor() {
    // Register authentication strategies
    this.strategies.set('replit', new ReplitAuthStrategy());
    this.strategies.set('oidc', new OIDCAuthStrategy());
  }

  async authenticate(strategy: string, credentials: any) {
    const authStrategy = this.strategies.get(strategy);
    if (!authStrategy) {
      throw new Error(`Unknown authentication strategy: ${strategy}`);
    }
    return await authStrategy.authenticate(credentials);
  }
}
```

### Session Configuration
```typescript
// Express session configuration
app.use(session({
  store: new PostgresSessionStore({
    pool: db,
    tableName: 'sessions',
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax'
  },
  name: 'fieldflux-session'
}));
```

### User Authentication Flow
```typescript
// Protected route middleware
export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Authentication required',
      redirectUrl: '/api/login'
    });
  }
  
  // Add user context to request
  req.userContext = {
    userId: req.user.id,
    email: req.user.email,
    tenantId: req.user.tenantId
  };
  
  next();
};

// Role-based authorization
export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};
```

### Database Integration
```sql
-- Session storage table
CREATE TABLE sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);
CREATE INDEX IDX_session_expire ON sessions(expire);

-- User authentication data
CREATE TABLE users (
  id VARCHAR PRIMARY KEY,           -- Replit user ID
  email VARCHAR UNIQUE,             -- Email address
  first_name VARCHAR,               -- First name
  last_name VARCHAR,                -- Last name
  profile_image_url VARCHAR,        -- Avatar URL
  role VARCHAR DEFAULT 'user',      -- user, admin, owner
  tenant_id INTEGER REFERENCES tenants(id),
  is_active BOOLEAN DEFAULT TRUE,   -- Account status
  last_login TIMESTAMP,             -- Last authentication
  login_count INTEGER DEFAULT 0,    -- Usage tracking
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## User Workflows

### User Registration and Onboarding
1. **Initial Registration**:
   - User clicks login/signup on FieldFlux landing page
   - Redirected to Replit Auth or OIDC provider
   - Authentication completed with provider
   - User returned to FieldFlux with auth token
   - Account created in PostgreSQL users table

2. **Profile Completion**:
   - Business information collection
   - Service type selection (HVAC, plumbing, etc.)
   - Initial configuration and preferences
   - Tenant assignment or creation
   - Welcome email and onboarding sequence

3. **First Login Experience**:
   - Authentication validation and session creation
   - User context establishment
   - Dashboard access with guided tour
   - Essential integration setup prompts
   - Usage analytics tracking initialization

### Session Management Lifecycle
1. **Session Creation**:
   - Successful authentication triggers session creation
   - Session data stored in PostgreSQL sessions table
   - Secure session cookie sent to client
   - User context cached for request efficiency
   - Session expiration set based on security policy

2. **Session Validation**:
   - Every request validates session cookie
   - Session data retrieved from PostgreSQL
   - User permissions and roles verified
   - Tenant context established for multi-tenant isolation
   - Activity logging for security auditing

3. **Session Termination**:
   - Explicit logout removes session from database
   - Session expiration cleanup via background job
   - Security-triggered session invalidation
   - Device-specific session management
   - Audit trail for session lifecycle events

### Multi-tenant Authentication
1. **Tenant Association**:
   - User authentication validates tenant access
   - Tenant context attached to user session
   - Row-level security policies enforced
   - API access scoped to tenant data
   - Cross-tenant access prevention

2. **White-label Support**:
   - Custom domain authentication handling
   - Tenant-specific branding and configuration
   - Isolated user namespaces
   - Tenant-aware session management
   - Billing and subscription isolation

## Integration Points

### Frontend Applications
- **React Frontend** - Authentication state management and protected routes
- **Mobile Apps** - OAuth token-based authentication for native apps
- **Third-party Integrations** - API key authentication for external services
- **Admin Tools** - Enhanced permissions and access control

### External Services
- **Replit Auth** - Primary authentication provider
- **OpenID Connect** - Standards-based authentication
- **Social Login** - Google, Facebook, LinkedIn integration
- **Enterprise SSO** - SAML and OAuth enterprise integration
- **Audit Systems** - Security event logging and monitoring

### Internal Systems
- **Database** - User data and session management
- **API Gateway** - Request authentication and routing
- **Monitoring** - Authentication metrics and alerting
- **Compliance** - Audit trails and security reporting

## Success Metrics

### Authentication Performance
- **Login Success Rate**: >99.5% successful authentication attempts
- **Session Response Time**: <50ms for session validation
- **Authentication Latency**: <200ms end-to-end login flow
- **Session Storage Performance**: <10ms PostgreSQL session queries
- **Token Refresh Success**: >99% automatic token renewal

### Security Benchmarks
- **Failed Login Attempts**: <1% of total authentication attempts
- **Session Hijacking**: Zero successful session compromise incidents
- **Password Security**: N/A (using OAuth providers)
- **Account Takeover**: Zero successful account compromise incidents
- **Multi-factor Authentication**: 90%+ adoption rate (when available)

### User Experience Metrics
- **Login Abandonment**: <5% users abandon login flow
- **Single Sign-On Success**: >95% SSO authentication success
- **Mobile Authentication**: Consistent experience across devices
- **Error Recovery**: Clear error messaging and recovery flows
- **Onboarding Completion**: >80% users complete initial setup

## Security Architecture

### Authentication Security
```typescript
// CSRF protection
import csrf from 'csurf';
app.use(csrf({ 
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
}));

// Security headers
import helmet from 'helmet';
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Rate limiting
import rateLimit from 'express-rate-limit';
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth', authLimiter);
```

### Session Security
```typescript
// Secure session configuration
const sessionConfig = {
  store: new PostgresSessionStore(db),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: true, // Extend session on activity
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true, // Prevent XSS
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax' as const // CSRF protection
  },
  name: 'fieldflux-session',
  genid: () => {
    return require('crypto').randomBytes(32).toString('hex');
  }
};
```

### Access Control Implementation
```typescript
// Permission-based access control
export const hasPermission = (permission: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userPermissions = req.user?.permissions || [];
    
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: permission,
        available: userPermissions
      });
    }
    
    next();
  };
};

// Tenant isolation middleware
export const requireTenant = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user?.tenantId) {
    return res.status(403).json({ error: 'Tenant access required' });
  }
  
  // Set tenant context for database queries
  req.tenantId = req.user.tenantId;
  next();
};
```

## Current Challenges

### Authentication Complexity
- Managing multiple authentication providers (Replit, OIDC)
- Handling authentication state across different client types
- Balancing security requirements with user experience
- Supporting enterprise authentication requirements
- Maintaining authentication consistency during provider updates

### Session Management
- Optimizing PostgreSQL session storage performance
- Implementing distributed session management for scaling
- Handling session cleanup and garbage collection
- Managing concurrent sessions across devices
- Supporting offline authentication scenarios

### Security Compliance
- Implementing comprehensive audit trails
- Meeting enterprise security requirements
- Supporting compliance frameworks (SOC 2, ISO 27001)
- Managing security vulnerabilities and updates
- Implementing advanced threat detection

## Future Roadmap

### Phase 1 (Next 30 days)
- Implement multi-factor authentication support
- Add comprehensive audit logging system
- Create session management dashboard
- Enhance security monitoring and alerting

### Phase 2 (30-60 days)
- Add enterprise SSO integration (SAML, Azure AD)
- Implement advanced threat detection
- Create device management and trusted device tracking
- Add API key authentication for third-party integrations

### Phase 3 (60-90 days)
- Implement zero-trust authentication architecture
- Add biometric authentication support
- Create advanced user behavior analytics
- Implement automated security response system

## Compliance and Auditing

### Audit Trail Implementation
```sql
-- Authentication audit log
CREATE TABLE auth_audit_log (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR,
  event_type VARCHAR,              -- login, logout, failed_login, password_change
  ip_address INET,                 -- Source IP address
  user_agent TEXT,                 -- Browser/client information
  success BOOLEAN,                 -- Event success status
  failure_reason TEXT,             -- Reason for failure
  session_id VARCHAR,              -- Associated session
  tenant_id INTEGER,               -- Tenant context
  metadata JSONB,                  -- Additional event data
  created_at TIMESTAMP DEFAULT NOW()
);

-- Automatic audit logging
CREATE OR REPLACE FUNCTION log_auth_event(
  p_user_id VARCHAR,
  p_event_type VARCHAR,
  p_ip_address INET,
  p_user_agent TEXT,
  p_success BOOLEAN DEFAULT TRUE,
  p_failure_reason TEXT DEFAULT NULL,
  p_session_id VARCHAR DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS void AS $$
BEGIN
  INSERT INTO auth_audit_log (
    user_id, event_type, ip_address, user_agent, 
    success, failure_reason, session_id, metadata
  ) VALUES (
    p_user_id, p_event_type, p_ip_address, p_user_agent,
    p_success, p_failure_reason, p_session_id, p_metadata
  );
END;
$$ LANGUAGE plpgsql;
```

### Security Monitoring
```typescript
// Security event monitoring
export const securityMonitor = {
  logFailedLogin: async (req: Request, userId?: string, reason?: string) => {
    await db.select().from(schema.authAuditLog).insert({
      userId,
      eventType: 'failed_login',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      success: false,
      failureReason: reason,
      metadata: { 
        timestamp: new Date().toISOString(),
        requestId: req.get('X-Request-ID')
      }
    });
  },

  logSuccessfulLogin: async (req: Request, userId: string, sessionId: string) => {
    await db.select().from(schema.authAuditLog).insert({
      userId,
      eventType: 'login',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      success: true,
      sessionId,
      metadata: {
        timestamp: new Date().toISOString(),
        loginMethod: 'replit_auth'
      }
    });
  },

  checkSuspiciousActivity: async (userId: string) => {
    // Check for multiple failed logins
    const recentFailures = await db.select()
      .from(schema.authAuditLog)
      .where(and(
        eq(schema.authAuditLog.userId, userId),
        eq(schema.authAuditLog.eventType, 'failed_login'),
        gte(schema.authAuditLog.createdAt, new Date(Date.now() - 15 * 60 * 1000))
      ));

    if (recentFailures.length >= 5) {
      // Implement account lockout or additional security measures
      await this.lockAccount(userId, '15 minutes', 'Multiple failed login attempts');
    }
  }
};
```

### Compliance Features
```typescript
// GDPR compliance features
export const gdprCompliance = {
  exportUserData: async (userId: string) => {
    // Export all user data for GDPR data portability
    const userData = await db.select()
      .from(schema.users)
      .where(eq(schema.users.id, userId));
      
    const sessionData = await db.select()
      .from(schema.sessions)
      .where(like(schema.sessions.sess, `%"user":{"id":"${userId}"%`));
      
    return {
      profile: userData[0],
      sessions: sessionData,
      auditTrail: await this.getUserAuditTrail(userId)
    };
  },

  deleteUserData: async (userId: string) => {
    // GDPR right to be forgotten implementation
    const transaction = await db.transaction();
    
    try {
      // Anonymize audit logs (keep for security)
      await transaction.update(schema.authAuditLog)
        .set({ userId: 'DELETED_USER' })
        .where(eq(schema.authAuditLog.userId, userId));
        
      // Delete user sessions
      await transaction.delete(schema.sessions)
        .where(like(schema.sessions.sess, `%"user":{"id":"${userId}"%`));
        
      // Delete user account
      await transaction.delete(schema.users)
        .where(eq(schema.users.id, userId));
        
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
```

## Performance Optimization

### Session Store Optimization
```sql
-- Session table optimization
CREATE INDEX CONCURRENTLY idx_sessions_expire ON sessions(expire) WHERE expire > NOW();
CREATE INDEX CONCURRENTLY idx_sessions_sid_hash ON sessions USING hash(sid);

-- Automatic session cleanup
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM sessions WHERE expire < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;

-- Schedule hourly session cleanup
SELECT cron.schedule('cleanup-sessions', '0 * * * *', 'SELECT cleanup_expired_sessions();');
```

### Authentication Caching
```typescript
// Redis-based authentication caching
import { Redis } from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

export const authCache = {
  setUserSession: async (sessionId: string, userData: any, ttl: number = 86400) => {
    await redis.setex(`session:${sessionId}`, ttl, JSON.stringify(userData));
  },

  getUserSession: async (sessionId: string) => {
    const cached = await redis.get(`session:${sessionId}`);
    return cached ? JSON.parse(cached) : null;
  },

  invalidateUserSession: async (sessionId: string) => {
    await redis.del(`session:${sessionId}`);
  },

  setUserPermissions: async (userId: string, permissions: string[], ttl: number = 3600) => {
    await redis.setex(`permissions:${userId}`, ttl, JSON.stringify(permissions));
  },

  getUserPermissions: async (userId: string) => {
    const cached = await redis.get(`permissions:${userId}`);
    return cached ? JSON.parse(cached) : null;
  }
};
```