# Analytics JWT Authentication System

## Overview

The Analytics JWT Authentication system provides comprehensive security for all Google Analytics and analytics-related endpoints in the FieldFlux application. It implements multi-layered security with JWT tokens, role-based access control, rate limiting, and audit logging.

## Architecture

### Components

1. **Authentication Middleware** (`analyticsAuthMiddleware.ts`)
   - JWT token validation with enhanced security checks
   - Scope-based permission enforcement
   - Dynamic rate limiting based on user access level
   - Audit logging for compliance
   - Data filtering based on access scope

2. **Token Service** (`analyticsTokenService.ts`)
   - JWT token generation and validation
   - Refresh token management
   - API key generation for programmatic access
   - Token revocation and cleanup

3. **Storage Extensions** (`storage-extensions.ts`)
   - In-memory storage for tokens, API keys, and audit logs
   - Session activity tracking
   - Token metadata management

4. **Auth Routes** (`analyticsAuthRoutes.ts`)
   - REST endpoints for token management
   - Token generation, refresh, and revocation
   - API key management
   - Token validation endpoints

## Security Features

### 1. JWT Token Security

- **Algorithm**: HS256 (HMAC with SHA-256)
- **Issuer/Audience Validation**: Prevents token reuse across systems
- **Expiration**: Short-lived access tokens (1 hour), longer refresh tokens (7 days)
- **JTI (JWT ID)**: Unique identifier for token revocation
- **Token Revocation**: Real-time revocation checking

### 2. Access Control

#### Access Levels
- **Viewer**: Limited metrics access (sessions, pageviews, users)
- **Analyst**: Standard analytics access with reporting capabilities
- **Admin**: Full analytics access including real-time data
- **Owner**: Complete access with administrative capabilities

#### Permission Scopes
```typescript
ANALYTICS_SCOPES = {
  READ_METRICS: 'analytics:read:metrics',
  READ_TRAFFIC: 'analytics:read:traffic',
  READ_PAGES: 'analytics:read:pages',
  READ_LOCATIONS: 'analytics:read:locations',
  READ_DEVICES: 'analytics:read:devices',
  READ_REALTIME: 'analytics:read:realtime',
  READ_KEYWORDS: 'analytics:read:keywords',
  READ_REVIEWS: 'analytics:read:reviews',
  GENERATE_REPORTS: 'analytics:generate:reports',
  EXPORT_DATA: 'analytics:export:data',
  ADMIN_CONFIG: 'analytics:admin:config',
  FULL_ACCESS: 'analytics:*'
}
```

### 3. Rate Limiting

Dynamic rate limiting based on access level:
- **Viewer**: 100 requests/15min (1x multiplier)
- **Analyst**: 200 requests/15min (2x multiplier)
- **Admin**: 500 requests/15min (5x multiplier)
- **Owner**: 1000 requests/15min (10x multiplier)

### 4. Data Filtering

Response data is filtered based on access scope:
- **Limited**: Basic metrics only
- **Standard**: Full metrics without sensitive data
- **Full**: Complete access to all data

### 5. Audit Logging

Comprehensive logging includes:
- Authentication attempts
- API access patterns
- Failed authorization attempts
- Token generation/revocation events
- Data access with user context

## API Endpoints

### Authentication Endpoints

#### Generate Token Pair
```http
POST /api/analytics/auth/token
Authorization: Bearer <standard-jwt>
Content-Type: application/json

{
  "scopes": ["analytics:read:metrics", "analytics:read:traffic"],
  "analyticsRole": "analyst"
}

Response:
{
  "accessToken": "eyJ0eXAiOiJKV1Q...",
  "refreshToken": "eyJ0eXAiOiJKV1Q...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "scope": "analytics:read:metrics analytics:read:traffic"
}
```

#### Refresh Access Token
```http
POST /api/analytics/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJ0eXAiOiJKV1Q..."
}

Response:
{
  "accessToken": "eyJ0eXAiOiJKV1Q...",
  "tokenType": "Bearer",
  "expiresIn": 3600
}
```

#### Generate API Key
```http
POST /api/analytics/auth/api-key
Authorization: Bearer <standard-jwt>
Content-Type: application/json

{
  "keyName": "Production Analytics API",
  "scopes": ["analytics:read:metrics", "analytics:generate:reports"],
  "description": "API key for automated reporting"
}

Response:
{
  "apiKey": "ffa_...base64url...",
  "keyName": "Production Analytics API",
  "scopes": ["analytics:read:metrics", "analytics:generate:reports"],
  "createdAt": "2025-01-15T10:30:00Z",
  "expiresAt": "2025-02-14T10:30:00Z"
}
```

#### Revoke Tokens
```http
POST /api/analytics/auth/revoke
Authorization: Bearer <standard-jwt>
Content-Type: application/json

// Revoke specific token
{
  "token": "eyJ0eXAiOiJKV1Q..."
}

// Or revoke all user tokens
{
  "all": true
}

Response:
{
  "message": "Token(s) revoked successfully"
}
```

### Protected Analytics Endpoints

All analytics endpoints now require authentication:

```http
GET /api/analytics/metrics?period=30d
Authorization: Bearer <analytics-jwt>

GET /api/analytics/traffic-sources?period=7d
Authorization: Bearer <analytics-jwt>

GET /api/analytics/realtime
Authorization: Bearer <analytics-jwt>

# Or using API key
GET /api/analytics/metrics?period=30d
X-API-Key: ffa_...base64url...
```

## Usage Examples

### 1. Web Application (Frontend)

```javascript
// 1. Get analytics token
const response = await fetch('/api/analytics/auth/token', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${userJWT}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    scopes: ['analytics:read:metrics', 'analytics:read:traffic']
  })
});

const { accessToken, refreshToken } = await response.json();

// 2. Use analytics token
const analyticsResponse = await fetch('/api/analytics/metrics', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const metrics = await analyticsResponse.json();
```

### 2. Programmatic Access (API Key)

```javascript
// 1. Generate API key (one-time setup)
const keyResponse = await fetch('/api/analytics/auth/api-key', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${userJWT}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    keyName: 'Automated Reports',
    scopes: ['analytics:read:metrics', 'analytics:generate:reports']
  })
});

const { apiKey } = await keyResponse.json();

// 2. Use API key for requests
const analyticsResponse = await fetch('/api/analytics/metrics', {
  headers: {
    'X-API-Key': apiKey
  }
});

const metrics = await analyticsResponse.json();
```

### 3. Refresh Token Flow

```javascript
async function refreshAnalyticsToken() {
  try {
    const response = await fetch('/api/analytics/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
    
    if (response.ok) {
      const { accessToken } = await response.json();
      return accessToken;
    }
  } catch (error) {
    // Redirect to re-authentication
    window.location.href = '/login';
  }
}
```

## Security Best Practices

### 1. Token Storage
- Store access tokens in memory (not localStorage)
- Store refresh tokens in secure HTTP-only cookies
- Never expose tokens in URLs or logs

### 2. API Key Management
- Rotate API keys regularly (30-day expiration)
- Use minimum required scopes
- Monitor API key usage
- Revoke unused keys immediately

### 3. Network Security
- Always use HTTPS in production
- Implement proper CORS policies
- Monitor for unusual access patterns

### 4. Error Handling
- Don't expose sensitive information in errors
- Log security events for monitoring
- Implement proper retry logic with backoff

## Monitoring and Alerting

### Key Metrics to Monitor

1. **Authentication Failures**
   - Failed JWT validations
   - Invalid API key attempts
   - Expired token usage

2. **Rate Limiting**
   - Rate limit violations
   - Unusual request patterns
   - API quota exhaustion

3. **Security Events**
   - Token revocation events
   - Session security violations
   - Suspicious access patterns

### Alerting Thresholds

- Authentication failure rate > 5%
- Rate limit violations > 10/hour
- API key brute force attempts
- Unusual geographic access patterns

## Migration Guide

### From Unprotected Endpoints

1. **Update Client Code**
   ```javascript
   // Before
   fetch('/api/analytics/metrics')
   
   // After
   fetch('/api/analytics/metrics', {
     headers: {
       'Authorization': `Bearer ${analyticsToken}`
     }
   })
   ```

2. **Handle Authentication Errors**
   ```javascript
   async function makeAnalyticsRequest(url) {
     let response = await fetch(url, {
       headers: { 'Authorization': `Bearer ${accessToken}` }
     });
     
     if (response.status === 401) {
       // Token expired, refresh it
       accessToken = await refreshAnalyticsToken();
       response = await fetch(url, {
         headers: { 'Authorization': `Bearer ${accessToken}` }
       });
     }
     
     return response.json();
   }
   ```

### Testing

1. **Unit Tests**
   - JWT validation logic
   - Permission checking
   - Rate limiting behavior

2. **Integration Tests**
   - End-to-end token flows
   - API key authentication
   - Error scenarios

3. **Security Tests**
   - Token tampering attempts
   - Privilege escalation tests
   - Rate limiting bypass attempts

## Troubleshooting

### Common Issues

1. **"Invalid access token"**
   - Check token expiration
   - Verify JWT secret configuration
   - Confirm token format

2. **"Required scope not found"**
   - Check user's access level
   - Verify scope configuration
   - Confirm endpoint requirements

3. **"Rate limit exceeded"**
   - Check request frequency
   - Verify user's rate limit multiplier
   - Implement exponential backoff

4. **"Session security violation"**
   - Check for concurrent sessions
   - Verify IP consistency
   - Review session activity patterns

### Debug Mode

Enable debug logging:
```bash
export DEBUG=analytics:auth
export LOG_LEVEL=debug
```

This provides detailed logging of:
- Token validation steps
- Permission checks
- Rate limiting decisions
- Security violations

## Production Deployment

### Environment Variables

```bash
# Required
JWT_SECRET=your-strong-secret-here
NODE_ENV=production

# Optional (with defaults)
ANALYTICS_TOKEN_EXPIRY=1h
ANALYTICS_REFRESH_EXPIRY=7d
ANALYTICS_API_KEY_EXPIRY=30d
```

### Database Setup

For production, implement database-backed storage:

1. Create tables for tokens, API keys, and audit logs
2. Implement proper indexing for performance
3. Set up cleanup jobs for expired tokens
4. Configure backup and recovery procedures

### Monitoring Setup

1. Set up log aggregation (e.g., ELK stack)
2. Configure security event alerting
3. Implement metrics dashboards
4. Set up automated security scanning

## Conclusion

The Analytics JWT Authentication system provides enterprise-grade security for analytics data access while maintaining developer-friendly APIs. It supports both interactive web applications and programmatic access through API keys, with comprehensive audit trails and monitoring capabilities.

For questions or support, refer to the security documentation or contact the development team.