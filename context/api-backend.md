# API Backend Context

## Purpose
The API Backend is FieldFlux's server-side infrastructure built with Express.js and TypeScript, providing RESTful APIs, authentication, database operations, and third-party service integrations. It serves as the central data hub for all client applications and handles business logic for field service marketing automation.

## Components

### Primary Components
- **`Express Server`** (`/server/index.ts`) - Main application server and middleware
- **`Route Handlers`** (`/server/routes.ts`) - API endpoint definitions and controllers
- **`Database Layer`** (`/server/db.ts`) - PostgreSQL connection and Drizzle ORM
- **`Authentication System`** (`/server/auth.ts`, `/server/replitAuth.ts`) - User authentication and session management
- **`Service Layer`** (`/server/services/`) - External API integrations and business logic

### Supporting Components
- **Middleware stack** - CORS, compression, error handling, logging
- **Service integrations** - OpenAI, Google APIs, Twilio, social media platforms
- **Tenant management** - Multi-tenant architecture support
- **File storage** - Asset management and file uploads

## Status
- **Implementation**: ✅ Core Express server and routing functional
- **Authentication**: ✅ Replit Auth integration working
- **Database**: ✅ PostgreSQL with Drizzle ORM implemented
- **API Endpoints**: ✅ Major endpoints implemented, some need optimization
- **External Services**: 🔄 OpenAI integrated, social media APIs in development

## Technical Details

### Server Architecture
```
server/
├── index.ts              # Main Express application entry point
├── routes.ts             # Primary API route definitions
├── db.ts                 # Database connection and configuration
├── auth.ts               # Authentication middleware
├── replitAuth.ts         # Replit-specific authentication
├── authManager.ts        # Authentication strategy management
├── oidcAuth.ts           # OpenID Connect authentication
├── tenant.ts             # Multi-tenant support utilities
├── storage.ts            # File storage and asset management
├── vite.ts               # Vite development integration
└── services/             # External service integrations
    ├── aiCoachService.ts         # AI-powered business coaching
    ├── emailService.ts           # Email delivery and campaigns
    ├── felixAI.ts               # AI content generation
    ├── leadScoringService.ts    # Lead qualification algorithms
    ├── stripeService.ts         # Payment processing
    ├── subscriptionPlansService.ts # Subscription management
    ├── google-analytics.ts      # Google Analytics integration
    ├── google-places.ts         # Google Places API
    ├── google-reviews.ts        # Google Reviews management
    └── felix/                   # Legacy Felix AI service
        └── felix-service.ts
```

### API Endpoint Structure
```
/api/
├── /auth                 # Authentication and session management
├── /users               # User profile and account management
├── /leads               # Lead management and CRM
├── /social              # Social media management
├── /reviews             # Review monitoring and responses
├── /analytics           # Performance metrics and reporting
├── /content             # Content generation and management
├── /communications      # Email and SMS campaigns
├── /settings           # Configuration and preferences
├── /integrations       # Third-party service connections
└── /webhooks           # External service callbacks
```

### Database Integration
```typescript
// Drizzle ORM with PostgreSQL
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema';

// Connection management
const connection = postgres(DATABASE_URL);
export const db = drizzle(connection, { schema });

// Type-safe queries
const leads = await db.select().from(schema.leads).where(eq(schema.leads.userId, userId));
```

### Authentication Flow
```typescript
// Replit Auth integration
import { ReplitAuth } from '@replit/auth';

// Session-based authentication
app.use(session({
  store: new PostgresSessionStore(db),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// Protected route middleware
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};
```

## User Workflows

### API Request Lifecycle
1. **Request Ingress**:
   - Client sends HTTP request to Express server
   - CORS middleware validates origin and headers
   - Compression middleware optimizes response size
   - Request logging captures incoming requests

2. **Authentication & Authorization**:
   - Session validation against PostgreSQL store
   - User authentication status verification
   - Route-specific permission checking
   - Multi-tenant context establishment

3. **Business Logic Processing**:
   - Route handler executes business logic
   - Database queries using Drizzle ORM
   - External service API calls as needed
   - Data validation and transformation

4. **Response Generation**:
   - JSON response formatting
   - Error handling and status codes
   - Response compression and optimization
   - Request completion logging

### External Service Integration
1. **AI Content Generation** (OpenAI GPT-4o):
   - Prompt engineering for field service content
   - Token usage optimization and monitoring
   - Response caching for efficiency
   - Fallback handling for service outages

2. **Google Services Integration**:
   - Google Analytics for website tracking
   - Google My Business for local SEO
   - Google Places for location data
   - OAuth 2.0 authentication flow

3. **Communication Services**:
   - Email delivery via SMTP/SendGrid
   - SMS messaging through Twilio
   - Template processing and personalization
   - Delivery tracking and analytics

## Integration Points

### Client Applications
- **React Frontend** - Primary web application interface
- **Mobile Apps** - Future iOS/Android applications
- **Third-party Integrations** - Webhook endpoints for external services
- **Admin Tools** - Administrative interfaces and utilities

### External Services
- **Database** - PostgreSQL with connection pooling
- **AI Services** - OpenAI GPT-4o for content generation
- **Google APIs** - Analytics, Places, My Business
- **Communication** - Email and SMS service providers
- **Payment Processing** - Stripe for subscriptions
- **File Storage** - Cloud storage for assets and media

### Internal Systems
- **Authentication** - Replit Auth and custom session management
- **Logging** - Application and access log management
- **Monitoring** - Performance metrics and health checks
- **Caching** - Redis for session and data caching

## Success Metrics

### Performance KPIs
- **Response Time**: <200ms average for API endpoints
- **Throughput**: Handle 1000+ concurrent requests
- **Uptime**: 99.9% availability target
- **Error Rate**: <1% failed requests
- **Database Performance**: <50ms average query time

### Scalability Metrics
- **Horizontal Scaling**: Auto-scaling based on CPU/memory usage
- **Database Connections**: Efficient connection pooling
- **Memory Usage**: <512MB per instance
- **CPU Utilization**: <70% average load
- **Concurrent Users**: Support for 10,000+ active sessions

### Security Benchmarks
- **Authentication Success**: 100% for valid credentials
- **Session Management**: Secure session handling with timeouts
- **API Security**: Rate limiting and request validation
- **Data Protection**: Encryption at rest and in transit
- **Vulnerability Scanning**: Regular security assessments

## Technical Architecture

### Middleware Stack
```typescript
// Express middleware configuration
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(helmet()); // Security headers
app.use(morgan('combined')); // Request logging
```

### Error Handling
```typescript
// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.status === 401) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (err.status === 403) {
    return res.status(403).json({ error: 'Access forbidden' });
  }
  
  res.status(500).json({ error: 'Internal server error' });
});
```

### Database Operations
```typescript
// Type-safe database operations with Drizzle
export async function createLead(leadData: NewLead) {
  try {
    const [lead] = await db.insert(schema.leads)
      .values(leadData)
      .returning();
    return lead;
  } catch (error) {
    console.error('Failed to create lead:', error);
    throw new Error('Lead creation failed');
  }
}

export async function getLeadsByUser(userId: string) {
  return await db.select()
    .from(schema.leads)
    .where(eq(schema.leads.userId, userId))
    .orderBy(desc(schema.leads.createdAt));
}
```

## Current Challenges

### Performance Optimization
- Database query optimization for complex joins
- API response caching for frequently requested data
- Connection pooling optimization for PostgreSQL
- Memory management for large file uploads
- Rate limiting implementation for API protection

### Integration Management
- Managing multiple external API rate limits
- Handling service outages and fallback strategies
- Maintaining API compatibility across service updates
- Secure credential storage and rotation
- Monitoring integration health and performance

### Scalability Planning
- Horizontal scaling preparation for increased load
- Database sharding strategy for multi-tenant growth
- Microservices architecture consideration
- Load balancing and traffic distribution
- Auto-scaling policies and thresholds

## Future Roadmap

### Phase 1 (Next 30 days)
- Complete social media API integrations
- Implement advanced caching layer with Redis
- Add comprehensive API documentation
- Enhance error handling and logging

### Phase 2 (30-60 days)
- Microservices architecture migration planning
- Advanced monitoring and alerting system
- API versioning and backward compatibility
- Performance optimization and profiling

### Phase 3 (60-90 days)
- GraphQL API implementation
- Real-time features with WebSocket support
- Advanced security features and compliance
- Machine learning model serving infrastructure

## Security Considerations

### Authentication & Authorization
```typescript
// JWT token validation
const validateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

### Data Protection
- **Encryption**: All sensitive data encrypted at rest
- **HTTPS**: TLS 1.3 for all API communications
- **Input Validation**: Comprehensive request validation
- **SQL Injection Prevention**: Parameterized queries only
- **XSS Protection**: Content Security Policy headers

### API Security
- **Rate Limiting**: Prevent abuse and DDoS attacks
- **CORS Configuration**: Strict origin validation
- **Request Size Limits**: Prevent resource exhaustion
- **Security Headers**: Helmet.js for security best practices
- **Audit Logging**: Complete request/response logging

## Deployment Architecture

### Production Environment
```yaml
# Docker container configuration
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Environment Configuration
```typescript
// Environment-specific settings
const config = {
  development: {
    database: process.env.DEV_DATABASE_URL,
    redis: process.env.DEV_REDIS_URL,
    logLevel: 'debug'
  },
  production: {
    database: process.env.DATABASE_URL,
    redis: process.env.REDIS_URL,
    logLevel: 'error'
  }
};
```

### Monitoring & Observability
- **Health Check Endpoints**: `/api/health`, `/api/status`
- **Metrics Collection**: Prometheus integration
- **Log Aggregation**: Structured JSON logging
- **Performance Monitoring**: APM tool integration
- **Alert Configuration**: Critical error notifications

## Database Optimization

### Query Performance
```sql
-- Indexed queries for common operations
CREATE INDEX idx_leads_user_created ON leads(user_id, created_at);
CREATE INDEX idx_social_posts_scheduled ON social_posts(user_id, scheduled_at);
CREATE INDEX idx_reviews_platform_date ON reviews(user_id, platform, review_date);
```

### Connection Management
```typescript
// Connection pooling configuration
const poolConfig = {
  max: 20,           // Maximum pool size
  min: 4,            // Minimum pool size
  idle: 10000,       // Idle timeout
  acquire: 60000,    // Connection acquisition timeout
  evict: 1000        // Connection eviction interval
};
```

### Caching Strategy
```typescript
// Redis caching implementation
const getCachedData = async (key: string) => {
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached);
  }
  return null;
};

const setCachedData = async (key: string, data: any, ttl: number = 3600) => {
  await redis.setex(key, ttl, JSON.stringify(data));
};
```