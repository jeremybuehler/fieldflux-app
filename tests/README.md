# FieldFlux Testing Infrastructure

This document provides comprehensive information about the testing infrastructure implemented for FieldFlux.

## Overview

FieldFlux now includes a robust testing infrastructure with:
- **Unit Tests**: Fast, isolated tests for individual components and functions
- **Integration Tests**: API endpoint testing with mocked external services
- **Error Handling**: Comprehensive error management and logging
- **Rate Limiting**: API protection against abuse
- **Request Validation**: Type-safe input validation using Zod

## Test Structure

```
tests/
├── setup/
│   ├── unit.setup.ts           # Unit test configuration and mocks
│   └── integration.setup.ts    # Integration test helpers and MSW setup
├── unit/
│   └── lib/
│       ├── errors.test.ts      # Error handling tests
│       ├── logger.test.ts      # Logging system tests
│       └── validation.test.ts  # Request validation tests
├── integration/
│   ├── analytics.test.ts       # Analytics API integration tests
│   ├── leads.test.ts          # Lead management API tests
│   └── social.test.ts         # Social media API tests
└── e2e/
    └── playwright.config.ts    # End-to-end test configuration
```

## Running Tests

### All Tests
```bash
npm test
```

### Unit Tests Only
```bash
npm run test:unit
```

### Integration Tests Only
```bash
npm run test:integration
```

### End-to-End Tests
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:coverage
```

### Watch Mode (Development)
```bash
npm run test:watch
```

### Test UI (Interactive)
```bash
npm run test:ui
```

## Error Handling Infrastructure

### Features Implemented

1. **Centralized Error Handling**
   - Custom error classes for different scenarios
   - Consistent error response format
   - Safe error messages (no internal details leaked)
   - Stack traces only in development

2. **Structured Logging**
   - Correlation IDs for request tracing
   - JSON structured logs in production
   - Human-readable logs in development
   - Automatic request/response logging

3. **Request Validation**
   - Zod-based schema validation
   - Type-safe request parsing
   - Detailed validation error messages
   - Sanitization helpers for security

4. **Rate Limiting**
   - Configurable rate limits per endpoint type
   - Memory-based storage (production should use Redis)
   - Tenant and user-scoped rate limiting
   - Bypass mechanism for development

### Error Types

- `ValidationError` (400) - Invalid input data
- `UnauthorizedError` (401) - Authentication required
- `ForbiddenError` (403) - Access denied
- `NotFoundError` (404) - Resource not found
- `ConflictError` (409) - Resource already exists
- `RateLimitError` (429) - Too many requests
- `ExternalServiceError` (502) - Third-party API failure
- `DatabaseError` (500) - Database operation failure

### Usage Examples

```typescript
import { ValidationError, asyncHandler } from '@server/lib/errors';
import { validators } from '@server/lib/validation';

// Route with validation and error handling
app.post('/api/leads', 
  validators.createLead,
  asyncHandler(async (req, res) => {
    const lead = await createLead(req.body);
    res.status(201).json({ success: true, data: lead });
  })
);
```

## Testing Best Practices

### Unit Tests

1. **Test Structure**: Use AAA pattern (Arrange, Act, Assert)
2. **Mocking**: Mock external dependencies and services
3. **Isolation**: Each test should be independent
4. **Coverage**: Aim for 70%+ code coverage

Example:
```typescript
describe('ValidationError', () => {
  it('should create error with correct status code', () => {
    // Arrange
    const message = 'Invalid input';
    const metadata = { field: 'email' };
    
    // Act
    const error = new ValidationError(message, metadata);
    
    // Assert
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.metadata).toEqual(metadata);
  });
});
```

### Integration Tests

1. **Database Setup**: Use test database with clean state
2. **External APIs**: Mock with MSW (Mock Service Worker)
3. **Authentication**: Use test auth headers
4. **Performance**: Include performance assertions

Example:
```typescript
describe('POST /api/leads', () => {
  it('should create lead successfully', async () => {
    const leadData = TestApiHelper.createTestLead();
    
    const response = await request(app)
      .post('/api/leads')
      .set(TestApiHelper.getAuthHeaders())
      .send(leadData)
      .expect(201);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe(leadData.email);
  });
});
```

## Configuration Files

### Vitest Unit Config (`vitest.config.unit.ts`)
- Environment: jsdom for React component testing
- Setup files for mocks and custom matchers
- Coverage thresholds at 70%
- 10-second test timeout

### Vitest Integration Config (`vitest.config.integration.ts`)
- Environment: node for server testing
- Sequential execution for database consistency
- 30-second timeout for API calls
- Separate process isolation

## Custom Test Utilities

### Custom Matchers
- `toBeValidUUID()` - Validates UUID format
- `toBeValidEmail()` - Validates email format
- `toHaveValidStructure(structure)` - Validates object shape

### Test Helpers
- `TestApiHelper` - Creates test data and auth headers
- `TestDatabase` - Database setup and cleanup utilities
- `PerformanceHelper` - Measures and asserts execution times

### Mock Responses
Pre-configured mock responses for:
- OpenAI API responses
- Google Analytics data
- Twilio SMS responses
- Social media API responses

## Rate Limiting Configuration

### Default Limits
- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 attempts per 15 minutes
- **AI Generation**: 50 requests per hour
- **Social Posting**: 20 posts per hour
- **Email Sending**: 10 emails per hour

### Custom Rate Limiters
```typescript
import { createTenantRateLimit } from '@server/lib/rate-limit';

const customRateLimit = createTenantRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 requests per tenant per hour
  message: 'Tenant rate limit exceeded'
});

app.use('/api/custom', customRateLimit);
```

## Environment Variables for Testing

```env
NODE_ENV=test
DATABASE_URL=postgresql://test:test@localhost:5432/fieldflux_test
OPENAI_API_KEY=test-openai-key
GOOGLE_ANALYTICS_PROPERTY_ID=test-ga-property
TWILIO_ACCOUNT_SID=test-twilio-sid
TWILIO_AUTH_TOKEN=test-twilio-token
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Test
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
```

## Production Considerations

### Logging
- Use structured JSON logging in production
- Implement log aggregation (ELK, Splunk, etc.)
- Set up monitoring and alerting on error logs

### Rate Limiting
- Replace memory storage with Redis for distributed systems
- Implement sliding window rate limiting
- Add rate limit monitoring and alerting

### Error Handling
- Integrate with error tracking services (Sentry, Rollbar)
- Implement error recovery mechanisms
- Set up health checks and circuit breakers

### Database Testing
- Use separate test databases
- Implement database seeding and migration testing
- Test database connection pooling and failover

## Troubleshooting

### Common Issues

1. **Tests failing with "Module not found"**
   - Check path aliases in vitest config
   - Ensure mock files exist and are properly imported

2. **Integration tests timing out**
   - Check if test database is running
   - Verify external service mocks are configured
   - Increase timeout values if needed

3. **Coverage reports missing files**
   - Update coverage exclude patterns
   - Check file naming conventions
   - Ensure test files are in correct directories

### Debugging Tests

1. **Use test.only() for focused testing**
2. **Enable verbose logging with VITEST_SUPPRESS_LOGS=false**
3. **Use the interactive test UI with npm run test:ui**
4. **Add console.log statements (removed by test setup by default)**

## Future Enhancements

1. **Database Integration Testing**
   - Real database testing with Docker
   - Migration testing
   - Performance testing with large datasets

2. **End-to-End Testing**
   - Playwright configuration for full user flows
   - Visual regression testing
   - Cross-browser testing

3. **Load Testing**
   - Artillery or k6 integration
   - Performance benchmarking
   - Scalability testing

4. **Security Testing**
   - Automated security scans
   - Penetration testing integration
   - Dependency vulnerability scanning

## Contributing

When adding new features:

1. **Add unit tests** for all new functions and classes
2. **Add integration tests** for new API endpoints
3. **Update validation schemas** for new input types
4. **Document any new error types** or rate limits
5. **Ensure tests pass** before submitting PRs

For questions or issues with the testing infrastructure, please refer to the test files for examples or create an issue in the repository.
