# FieldFlux Authentication System

## Overview

FieldFlux implements a comprehensive JWT-based authentication system with secure session management, role-based access control, and multi-tenant support. The system provides complete user lifecycle management from registration to profile updates.

## Architecture

### Components

```
Authentication System
├── Frontend (React)
│   ├── AuthContext - Global authentication state
│   ├── AuthForm - Universal authentication UI
│   ├── ProtectedRoute - Route-level protection
│   ├── UserProfile - Profile management
│   └── Auth Pages - Login, register, reset, verify
├── Backend (Express.js)
│   ├── authService - Business logic layer
│   ├── authMiddleware - Request authentication
│   ├── authRoutes - API endpoints
│   └── Email Service - Verification & reset emails
└── Database (PostgreSQL)
    ├── users - User accounts & profiles
    ├── sessions - Active user sessions
    ├── tenants - Multi-tenant support
    └── tenant_memberships - User-tenant relationships
```

### Security Features

- **JWT Tokens**: Short-lived access tokens (15 minutes) with refresh capability
- **Password Security**: Bcrypt hashing with strong password requirements
- **Email Verification**: Required for account activation
- **Rate Limiting**: Protection against brute force attacks
- **CSRF Protection**: Cross-site request forgery prevention
- **Session Management**: Secure session tracking and cleanup
- **Role-Based Access**: Admin, manager, user permission levels

## User Flow

### Registration Process
1. User submits registration form
2. Server validates email uniqueness and password strength
3. User account created with `emailVerified: false`
4. Verification email sent with secure token
5. User clicks email link to verify account
6. Account activated and user redirected to dashboard

### Login Process
1. User submits login credentials
2. Server validates email and password
3. JWT access token (15 min) and refresh token (30 days) generated
4. User authenticated and redirected to dashboard
5. Automatic token refresh on API requests

### Password Reset Process
1. User requests password reset with email
2. Server generates secure reset token
3. Reset email sent with token link
4. User clicks link and enters new password
5. Password updated and user redirected to login

## API Endpoints

### Public Endpoints (No Authentication Required)

```typescript
// User Registration
POST /api/auth/register
Body: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
Response: { user: User, tokens: { access, refresh } }

// User Login
POST /api/auth/login
Body: {
  email: string;
  password: string;
  rememberMe?: boolean;
}
Response: { user: User, tokens: { access, refresh } }

// Password Reset Request
POST /api/auth/forgot-password
Body: { email: string }
Response: { message: string }

// Password Reset with Token
POST /api/auth/reset-password
Body: { token: string; password: string }
Response: { message: string }

// Email Verification
POST /api/auth/verify-email
Body: { token: string }
Response: { message: string }
```

### Protected Endpoints (Authentication Required)

```typescript
// Get Current User
GET /api/auth/user
Headers: { Authorization: "Bearer <access_token>" }
Response: { user: User }

// Refresh Access Token
POST /api/auth/refresh
Body: { refreshToken: string }
Response: { tokens: { access, refresh } }

// Update User Profile
PUT /api/auth/profile
Body: { firstName?: string; lastName?: string }
Response: { user: User }

// Change Password
POST /api/auth/change-password
Body: { currentPassword: string; newPassword: string }
Response: { message: string }

// Resend Verification Email
POST /api/auth/resend-verification
Response: { message: string }

// Logout User
POST /api/auth/logout
Response: { message: string }

// Get User Sessions
GET /api/auth/sessions
Response: { sessions: Session[] }

// Revoke Session
DELETE /api/auth/sessions/:sessionId
Response: { message: string }
```

## Frontend Implementation

### AuthContext Usage

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { 
    user, 
    isAuthenticated, 
    isLoading,
    login,
    logout,
    register,
    updateProfile 
  } = useAuth();

  // Use authentication state and methods
}
```

### Protected Routes

```typescript
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Basic protection
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>

// Role-based protection
<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>

// Email verification required
<ProtectedRoute requireEmailVerified={true}>
  <PremiumFeatures />
</ProtectedRoute>
```

### Authentication Forms

```typescript
import AuthForm from '@/components/auth/AuthForm';

// Login form
<AuthForm
  mode="login"
  onSubmit={handleLogin}
  loading={loading}
  error={error}
/>

// Registration form
<AuthForm
  mode="register"
  onSubmit={handleRegister}
  loading={loading}
  error={error}
/>
```

## Backend Implementation

### Authentication Middleware

```typescript
// Protect routes
import { authenticateToken } from '@/middleware/authMiddleware';

app.get('/api/protected', authenticateToken, (req, res) => {
  // Access authenticated user via req.user
});

// Role-based protection
app.get('/api/admin', authenticateToken, requireRole('admin'), handler);
```

### Service Layer Usage

```typescript
import { authService } from '@/services/authService';

// Register user
const { user, tokens } = await authService.registerUser({
  email,
  password,
  firstName,
  lastName
});

// Authenticate user
const { user, tokens } = await authService.authenticateUser(email, password);

// Verify email
await authService.verifyEmail(token);
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  email_verification_token VARCHAR(255),
  email_verification_expires TIMESTAMP,
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMP,
  role VARCHAR(50) DEFAULT 'user',
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Sessions Table
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  refresh_token VARCHAR(255) UNIQUE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Multi-Tenancy Tables
```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tenant_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member', -- owner, admin, member
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, tenant_id)
);
```

## Security Configuration

### Environment Variables

```bash
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters
JWT_REFRESH_SECRET=your-refresh-token-secret-key
SESSION_SECRET=your-session-secret-for-cookies

# Token Expiry (in seconds)
JWT_ACCESS_EXPIRY=900      # 15 minutes
JWT_REFRESH_EXPIRY=2592000 # 30 days

# Email Configuration
EMAIL_FROM=noreply@yourdomain.com
SMTP_HOST=smtp.youremailprovider.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password

# Security
BCRYPT_ROUNDS=12
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION=900 # 15 minutes

# Development
NODE_ENV=development
DISABLE_AUTH=false
```

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&)

### Rate Limiting

- **Login attempts**: 5 attempts per IP per 15 minutes
- **Password reset**: 3 requests per email per hour
- **Email verification**: 5 requests per email per hour
- **API requests**: 100 requests per user per minute

## Error Handling

### Common Error Responses

```typescript
// Authentication errors
{
  error: "INVALID_CREDENTIALS",
  message: "Invalid email or password"
}

// Validation errors
{
  error: "VALIDATION_ERROR",
  message: "Password must be at least 8 characters",
  field: "password"
}

// Token errors
{
  error: "TOKEN_EXPIRED",
  message: "Access token has expired"
}

// Permission errors
{
  error: "INSUFFICIENT_PERMISSIONS",
  message: "Admin role required"
}
```

## Testing

### Unit Tests
- Password hashing and validation
- JWT token generation and verification
- Email service functionality
- Service layer methods

### Integration Tests
- Authentication endpoints
- Protected route access
- Role-based permissions
- Multi-tenant isolation

### End-to-End Tests
- Complete registration flow
- Login and logout process
- Password reset workflow
- Email verification process

## Monitoring & Logging

### Security Events Logged
- Failed login attempts
- Password reset requests
- Email verification attempts
- Token refresh operations
- Role changes and permissions

### Metrics Tracked
- Active user sessions
- Authentication success/failure rates
- Password reset completion rates
- Email verification rates

## Troubleshooting

### Common Issues

**Authentication failing for valid users**
- Check JWT_SECRET configuration
- Verify token expiry settings
- Check user email verification status

**Email verification not working**
- Verify SMTP configuration
- Check email service logs
- Confirm token generation

**Protected routes not working**
- Ensure AuthProvider wraps application
- Check token storage in browser
- Verify middleware order on backend

**Session not persisting**
- Check refresh token configuration
- Verify session storage settings
- Check CORS configuration

### Debug Mode

Set `DEBUG=auth:*` to enable detailed authentication logging:

```bash
DEBUG=auth:* npm run dev
```

## Migration Guide

### From Legacy Authentication

1. **Data Migration**: Export existing user data
2. **Password Reset**: Force password reset for all users
3. **Email Verification**: Send verification emails to existing users
4. **Role Assignment**: Map existing permissions to new role system
5. **Session Cleanup**: Clear all existing sessions

### Upgrading Authentication

1. **Backup Database**: Always backup before migration
2. **Run Migrations**: Apply new schema changes
3. **Update Environment**: Add new configuration variables
4. **Test Thoroughly**: Verify all authentication flows
5. **Monitor**: Watch for issues during rollout

## Best Practices

### Security
- Always use HTTPS in production
- Rotate JWT secrets regularly
- Implement proper session timeout
- Monitor for suspicious activity
- Use strong password policies

### Performance
- Implement token caching
- Optimize database queries
- Use connection pooling
- Monitor authentication latency
- Cache user permissions

### User Experience
- Provide clear error messages
- Implement smooth loading states
- Auto-refresh expired tokens
- Remember user preferences
- Offer password strength indicators

## Support

For authentication-related issues:
1. Check this documentation
2. Review server logs for errors
3. Test with debug mode enabled
4. Verify environment configuration
5. Contact development team if needed
