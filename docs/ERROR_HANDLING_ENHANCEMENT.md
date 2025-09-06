# Enhanced Error Handling and Monitoring System

This document outlines the comprehensive error handling and monitoring system implemented for the FieldFlux application.

## 🎯 Overview

The enhanced error handling system provides:
- **Centralized Error Management**: All errors are processed through a unified middleware system
- **Structured Error Responses**: Consistent JSON error responses with metadata
- **Correlation ID Tracking**: Request tracing across all operations  
- **Error Monitoring & Analytics**: Real-time error pattern detection and analysis
- **Health Check Integration**: Error status included in system health monitoring
- **Multi-tenant Security**: Secure error logging with tenant isolation

## 📁 File Structure

```
server/lib/
├── errors.ts           # Centralized error classes and middleware
├── logger.ts           # Structured logging with correlation tracking  
└── error-monitor.ts    # Error monitoring and analytics system

server/routes.ts        # Enhanced with asyncHandler and monitoring endpoints
```

## 🏗️ Core Components

### 1. Error Classes (`server/lib/errors.ts`)

#### Base Error Class
```typescript
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly metadata?: Record<string, any>;
}
```

#### Specialized Error Classes
- **ValidationError (400)**: Data validation failures with field-level details
- **UnauthorizedError (401)**: Authentication failures
- **ForbiddenError (403)**: Authorization failures  
- **NotFoundError (404)**: Resource not found errors
- **ConflictError (409)**: Resource conflict errors
- **RateLimitError (429)**: Rate limiting violations
- **ExternalServiceError (502)**: Third-party service failures
- **DatabaseError (500)**: Database operation failures

#### AsyncHandler Wrapper
```typescript
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
```

### 2. Structured Logging (`server/lib/logger.ts`)

#### Features
- **Correlation ID Tracking**: Unique UUID for each request
- **Contextual Logging**: User ID, tenant ID, endpoint, method
- **Sensitive Data Sanitization**: Automatic redaction of passwords, tokens, keys
- **Performance Monitoring**: Request timing and memory usage
- **Environment-Aware Formatting**: JSON for production, human-readable for development

#### Usage Example
```typescript
logger.error('Database operation failed', {
  correlationId: req.correlationId,
  userId: req.user?.id,
  tenantId: req.tenant?.id,
  endpoint: req.path,
  method: req.method
}, error);
```

### 3. Error Monitoring (`server/lib/error-monitor.ts`)

#### Capabilities
- **Pattern Detection**: Groups similar errors by type, endpoint, and message
- **Frequency Analysis**: Hourly and daily error occurrence tracking
- **Anomaly Detection**: Identifies error spikes and unusual patterns
- **Critical Endpoint Identification**: Highlights endpoints with high error rates
- **Memory Management**: Automatic cleanup of old error data

#### Key Methods
```typescript
// Track error occurrence
errorMonitor.trackError(error, {
  correlationId,
  endpoint,
  method,
  statusCode,
  userId,
  tenantId
});

// Get error statistics
const stats = errorMonitor.getErrorStats({
  limit: 50,
  sortBy: 'count',
  timeframe: 'day'
});

// Detect anomalies
const anomalies = errorMonitor.detectAnomalies();
```

## 🛣️ Enhanced Route Handling

### Before (Basic Try-Catch)
```typescript
app.get('/api/data', async (req, res) => {
  try {
    const data = await getData();
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
```

### After (Enhanced Error Handling)
```typescript
app.get('/api/data', requireMembership(), asyncHandler(async (req: any, res) => {
  if (!req.tenant?.id) {
    throw new ValidationError('Valid tenant context required');
  }

  const data = await getData(req.tenant.id);
  
  logger.info('Data retrieved successfully', {
    correlationId: req.correlationId,
    tenantId: req.tenant.id,
    recordCount: data.length
  });

  res.json(data);
}));
```

## 📊 Monitoring Endpoints

### Health Check Endpoint
```http
GET /api/health
```

**Response Example:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "memory": {
    "used": 128,
    "total": 256,
    "external": 64
  },
  "checks": {
    "database": { "status": "healthy", "responseTime": 25 },
    "openai": { "status": "configured", "apiKeyPresent": true },
    "analytics": { "status": "configured", "propertyIdPresent": true },
    "errorMonitoring": {
      "status": "healthy",
      "recentErrors": 0,
      "anomalies": 0,
      "criticalAnomalies": 0,
      "totalTrackedErrors": 15
    }
  }
}
```

### System Status Endpoint
```http
GET /api/system/status
```

**Response includes:**
- Application metadata (name, version, environment)
- System information (platform, Node.js version, memory)
- Configuration status (database, auth mode, services)
- Service health (OpenAI, Twilio, Analytics)

### Error Statistics Endpoint
```http
GET /api/system/errors?limit=50&sortBy=count&timeframe=day
```

**Query Parameters:**
- `limit`: Number of error records to return (default: 50)
- `sortBy`: Sort criteria - `count`, `recent`, or `frequency` (default: `count`)
- `timeframe`: Time window - `hour`, `day`, or `all` (default: `all`)

### Error Trends Endpoint
```http
GET /api/system/errors/trends
```

**Response includes:**
- Hourly and daily error frequency charts
- Most common error types
- Critical endpoints with high error rates
- Total error counts and unique error types

### Recent Errors Endpoint
```http
GET /api/system/errors/recent?limit=100
```

### Error Anomalies Endpoint
```http
GET /api/system/errors/anomalies
```

**Detects:**
- **Error Spikes**: Current hour errors 3x higher than average
- **New Error Types**: Errors that first occurred within the last hour
- **Critical Severity**: Errors occurring 5x more than average

## 🚨 Error Response Format

All API errors return a consistent structure:

```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR", 
    "statusCode": 400,
    "correlationId": "abc-123-def-456",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "metadata": {
      "validationErrors": [
        {
          "field": "email",
          "message": "Invalid email format"
        }
      ]
    }
  }
}
```

### Error Codes
- `VALIDATION_ERROR`: Data validation failures
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Resource conflict
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `EXTERNAL_SERVICE_ERROR`: Third-party service failure
- `DATABASE_ERROR`: Database operation failure
- `INTERNAL_ERROR`: Unexpected system error

## 🔒 Security Features

### Multi-Tenant Error Tracking
- Errors are tracked per tenant to prevent data leakage
- Security events (unauthorized access attempts) are logged separately
- Correlation IDs allow tracing requests across tenant boundaries

### Sensitive Data Protection
- Automatic sanitization of sensitive fields in logs:
  - `password`, `token`, `key`, `secret`, `auth`, `credential`
  - `authorization`, `cookie`, `x-api-key`, `x-auth-token` headers
- Stack traces only included in development environment
- Error messages sanitized in production for unknown errors

### Rate Limiting Integration
- Rate limit violations automatically tracked as `RateLimitError`
- IP address and user information logged for rate limit breaches
- Integration with existing rate limiting middleware

## 📈 Operational Benefits

### Proactive Monitoring
- **Anomaly Detection**: Automatically identifies unusual error patterns
- **Trend Analysis**: Visualizes error frequency over time
- **Critical Endpoint Alerting**: Highlights endpoints with high failure rates

### Debugging & Troubleshooting
- **Correlation Tracking**: Follow requests across all system operations
- **Contextual Logging**: Rich metadata for every logged operation
- **Error Grouping**: Similar errors grouped for pattern analysis

### Performance Insights
- **Response Time Tracking**: Request timing included in all logs
- **Memory Monitoring**: System resource usage tracked
- **Database Health**: Connection and query performance monitoring

## 🚀 Implementation Status

✅ **Completed Enhancements:**
- Centralized error handling middleware
- Structured error classes with proper inheritance
- AsyncHandler wrapper for consistent async error catching  
- Correlation ID middleware for request tracing
- Comprehensive error monitoring and analytics system
- Enhanced health check endpoints with error status
- Structured logging with contextual information
- Error anomaly detection for proactive monitoring
- Multi-tenant error tracking with security logging
- Production-grade error response formatting

## 🔧 Usage Guidelines

### For Route Handlers
1. **Always use `asyncHandler`** for async routes:
   ```typescript
   app.get('/api/route', asyncHandler(async (req, res) => {
     // Route logic here
   }));
   ```

2. **Use appropriate error classes**:
   ```typescript
   if (!data) {
     throw new NotFoundError('Resource');
   }
   if (validationResult.error) {
     throw new ValidationError('Invalid input', { 
       validationErrors: validationResult.error.details 
     });
   }
   ```

3. **Include contextual logging**:
   ```typescript
   logger.info('Operation completed', {
     correlationId: req.correlationId,
     tenantId: req.tenant?.id,
     operation: 'data-fetch'
   });
   ```

### For Monitoring
- Check `/api/health` for overall system status
- Use `/api/system/errors/anomalies` for proactive alerting
- Monitor `/api/system/errors/trends` for pattern analysis
- Set up alerts for critical anomalies in production

## 🎯 Next Steps

For further enhancement, consider:
1. **External Monitoring Integration**: Connect to services like DataDog, NewRelic, or Sentry
2. **Error Dashboards**: Build visual dashboards for error analytics
3. **Automated Alerting**: Set up alerts for critical error conditions
4. **Error Budgets**: Implement SLA-based error thresholds
5. **Performance Correlation**: Link error rates with system performance metrics

---

This enhanced error handling system provides production-grade error management, monitoring, and operational insights for the FieldFlux application, ensuring robust and maintainable error handling across all system operations.
