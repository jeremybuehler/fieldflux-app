# FieldFlux Authentication Testing Infrastructure

This comprehensive testing suite validates the security, functionality, and reliability of FieldFlux's JWT-based analytics authentication system.

## 🎯 **Overview**

The authentication system implements enterprise-grade security with:
- **JWT-based authentication** with role-based access control
- **API key management** for programmatic access
- **Session security** with suspicious activity detection
- **Rate limiting** and audit logging
- **Multi-level authorization** (viewer, analyst, admin, owner)

## 📁 **Test Structure**

```
tests/auth/
├── README.md                           # This documentation
├── authentication.config.ts            # Test configuration and utilities
├── run-auth-tests.sh                   # Test runner script
└── ../
    ├── unit/server/
    │   ├── analyticsTokenService.test.ts    # JWT token service tests
    │   └── analyticsAuthMiddleware.test.ts  # Middleware security tests
    ├── integration/
    │   └── analyticsAuthRoutes.test.ts      # API endpoint tests
    ├── security/
    │   └── authenticationSecurity.test.ts   # Security vulnerability tests
    └── e2e/
        └── authenticationFlow.spec.ts       # End-to-end flow tests
```

## 🧪 **Test Categories**

### 1. **Unit Tests** 
**Location**: `tests/unit/server/`

#### Analytics Token Service (`analyticsTokenService.test.ts`)
- ✅ JWT token generation and validation
- ✅ Access token lifecycle management  
- ✅ Refresh token handling
- ✅ API key generation and security
- ✅ Role-based scope assignment
- ✅ Token revocation and cleanup
- ✅ Cryptographic security validation

#### Analytics Auth Middleware (`analyticsAuthMiddleware.test.ts`)
- ✅ JWT authentication validation
- ✅ Scope-based authorization
- ✅ Session security and hijacking prevention
- ✅ Rate limiting enforcement
- ✅ Audit logging functionality
- ✅ Data filtering based on access levels
- ✅ Error handling and edge cases

### 2. **Integration Tests**
**Location**: `tests/integration/`

#### Auth Routes (`analyticsAuthRoutes.test.ts`)
- ✅ Token generation endpoints
- ✅ Token refresh functionality
- ✅ API key management
- ✅ Token validation endpoints
- ✅ Authentication middleware integration
- ✅ Error handling and validation
- ✅ Rate limiting enforcement

### 3. **Security Tests**
**Location**: `tests/security/`

#### Authentication Security (`authenticationSecurity.test.ts`)
- ✅ JWT algorithm confusion attacks
- ✅ Token manipulation prevention
- ✅ Privilege escalation attempts
- ✅ Session hijacking detection
- ✅ Timing attack resistance
- ✅ Input validation and sanitization
- ✅ Information disclosure prevention
- ✅ Cross-tenant access prevention

### 4. **End-to-End Tests**
**Location**: `tests/e2e/`

#### Authentication Flow (`authenticationFlow.spec.ts`)
- ✅ Complete authentication workflows
- ✅ Token generation and usage
- ✅ API key management flows
- ✅ Access control validation
- ✅ Concurrent access handling
- ✅ Security policy enforcement

## 🚀 **Running Tests**

### Quick Start
```bash
# Run all authentication tests
./tests/auth/run-auth-tests.sh

# Run with performance benchmarks
./tests/auth/run-auth-tests.sh --performance

# Skip coverage report generation
./tests/auth/run-auth-tests.sh --no-coverage
```

### Individual Test Suites
```bash
# Unit tests only
npm run test tests/unit/server/analyticsTokenService.test.ts
npm run test tests/unit/server/analyticsAuthMiddleware.test.ts

# Integration tests
npm run test tests/integration/analyticsAuthRoutes.test.ts

# Security tests
npm run test tests/security/authenticationSecurity.test.ts

# E2E tests (requires running server)
npm run test:e2e tests/e2e/authenticationFlow.spec.ts
```

### Coverage Reports
```bash
# Generate coverage for authentication tests
npm run test:coverage -- tests/unit/server/analytics* tests/integration/analyticsAuth* tests/security/authentication*
```

## 🔧 **Configuration**

### Environment Variables
```bash
NODE_ENV=test                    # Test environment
JWT_SECRET=your-test-secret      # JWT signing secret (auto-generated for tests)
DATABASE_URL=postgresql://...    # Test database connection
API_BASE_URL=http://localhost:5000  # Base URL for E2E tests
```

### Test Configuration
Key settings in `authentication.config.ts`:
- **JWT Settings**: Algorithm, issuer, audience, expiration
- **Security Thresholds**: Rate limits, session timeouts, suspicious activity
- **Access Levels**: Viewer, analyst, admin, owner configurations
- **Test Data**: Mock users, tokens, and malicious input patterns

## 🛡️ **Security Test Coverage**

### Vulnerability Prevention
- ✅ **Algorithm Confusion**: Prevents JWT algorithm manipulation
- ✅ **Token Tampering**: Validates signature integrity
- ✅ **Privilege Escalation**: Enforces scope-based authorization
- ✅ **Session Hijacking**: Detects suspicious activity patterns
- ✅ **Timing Attacks**: Consistent response times
- ✅ **Information Disclosure**: Sanitized error messages
- ✅ **Cross-Tenant Access**: Tenant isolation validation
- ✅ **Input Validation**: Malicious input sanitization

### Attack Simulations
- **Brute Force**: Rate limiting effectiveness
- **Token Replay**: Revocation and expiration validation
- **CSRF**: Token binding and validation
- **XSS**: Input sanitization testing
- **SQL Injection**: Prepared statement validation

## 📊 **Test Metrics and KPIs**

### Performance Benchmarks
- **Authentication**: < 100ms response time
- **Token Generation**: < 50ms processing time
- **API Key Creation**: < 25ms processing time
- **Timing Variance**: < 50ms difference (anti-timing attack)

### Security Metrics
- **Token Entropy**: ≥ 128 bits randomness
- **Session Security**: Suspicious activity detection
- **Access Control**: 100% scope enforcement
- **Rate Limiting**: Configurable thresholds per role

### Coverage Targets
- **Unit Tests**: ≥ 95% code coverage
- **Integration Tests**: ≥ 90% endpoint coverage
- **Security Tests**: 100% attack vector coverage
- **E2E Tests**: 100% critical path coverage

## 🐛 **Troubleshooting**

### Common Issues

#### Tests Failing Due to Environment
```bash
# Ensure test environment is set
export NODE_ENV=test

# Check database connectivity
pg_isready -h localhost -p 5432

# Verify dependencies
npm install
```

#### JWT Secret Issues
```bash
# Ensure JWT_SECRET is set for tests
export JWT_SECRET="test-jwt-secret-minimum-32-characters-long"

# Check secret strength (production)
echo $JWT_SECRET | wc -c  # Should be ≥ 32 characters
```

#### Database Connection Issues
```bash
# Create test database
createdb fieldflux_test

# Run migrations
npm run db:push

# Check connection
psql postgresql://test:test@localhost:5432/fieldflux_test
```

#### Playwright E2E Issues
```bash
# Install Playwright browsers
npx playwright install

# Run in headed mode for debugging
npm run test:e2e -- --headed tests/e2e/authenticationFlow.spec.ts
```

### Debug Mode
```bash
# Enable verbose logging
DEBUG=* npm run test tests/unit/server/analyticsTokenService.test.ts

# Run with debugging
node --inspect-brk node_modules/.bin/vitest tests/security/authenticationSecurity.test.ts
```

## 📝 **Test Data and Fixtures**

### Mock User Data
```typescript
const testUser = {
  id: 'test-user-123',
  email: 'test@fieldflux.example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'admin',
  subscriptionPlan: 'professional',
  analyticsEnabled: true
};
```

### Test Token Payloads
```typescript
const tokenPayload = {
  sub: 'test-user-123',
  email: 'test@fieldflux.example.com',
  analyticsRole: 'admin',
  scopes: ['analytics:*'],
  type: 'access',
  jti: crypto.randomUUID()
};
```

### Security Test Vectors
- **XSS Payloads**: `<script>alert("xss")</script>`
- **SQL Injection**: `'; DROP TABLE users; --`
- **Path Traversal**: `../../../etc/passwd`
- **Long Strings**: 10,000+ character inputs
- **Unicode Issues**: Null bytes, control characters

## 🔄 **Continuous Integration**

### GitHub Actions Integration
```yaml
# .github/workflows/auth-tests.yml
name: Authentication Tests
on: [push, pull_request]
jobs:
  auth-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: ./tests/auth/run-auth-tests.sh --no-coverage
```

### Pre-commit Hooks
```bash
# Install pre-commit hooks
npm install --save-dev husky

# Add authentication test validation
echo './tests/auth/run-auth-tests.sh --no-coverage' > .husky/pre-commit
```

## 📈 **Monitoring and Alerting**

### Security Monitoring
- **Failed Authentication Attempts**: Alert on > 10 failures/hour
- **Suspicious Activity**: Alert on session anomalies
- **Token Abuse**: Alert on high token generation rates
- **API Key Misuse**: Monitor for revoked key usage

### Performance Monitoring
- **Authentication Latency**: Alert if > 200ms average
- **Token Generation**: Alert if > 100ms average
- **Database Queries**: Monitor query performance
- **Rate Limit Hits**: Track rate limiting effectiveness

## 🤝 **Contributing**

### Adding New Tests
1. **Identify Test Category**: Unit, integration, security, or E2E
2. **Follow Naming Convention**: `[feature].[testType].test.ts`
3. **Use Test Configuration**: Import from `authentication.config.ts`
4. **Include Security Validation**: Always test for common vulnerabilities
5. **Update Documentation**: Add to this README

### Test Standards
- **AAA Pattern**: Arrange, Act, Assert
- **Descriptive Names**: Clear test purpose
- **Independent Tests**: No test interdependencies
- **Mock External Services**: Use vi.mock for dependencies
- **Security First**: Always include negative test cases

### Code Review Checklist
- ✅ Tests cover all code paths
- ✅ Security vulnerabilities tested
- ✅ Error conditions handled
- ✅ Performance within thresholds
- ✅ Documentation updated
- ✅ CI/CD integration working

---

## 📞 **Support**

For questions about the authentication testing infrastructure:

1. **Check Documentation**: This README and inline code comments
2. **Run Debug Tests**: Use `--verbose` flag for detailed output
3. **Review Logs**: Check test output for specific error messages
4. **Security Questions**: Consult `tests/security/` for security test patterns

---

**Last Updated**: January 2025  
**Test Coverage**: 95%+ authentication system coverage  
**Security Status**: ✅ All critical vulnerabilities tested and prevented