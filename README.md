# FieldPulse - Replace 5 Marketing Tools with One

## Overview

FieldPulse is a comprehensive marketing automation platform designed specifically for field service businesses. It consolidates social media management, content creation, lead tracking, review monitoring, and analytics into one affordable solution for HVAC, plumbing, electrical, landscaping, and other field service professionals.

## Technology Stack

### Architecture
- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js + TypeScript  
- **Database**: PostgreSQL + Drizzle ORM
- **UI**: Tailwind CSS + shadcn/ui components
- **State**: TanStack Query for server state
- **Authentication**: Replit Auth (OpenID Connect)

### Deployment
- **Production**: Azure Container Apps + PostgreSQL Flexible Server
- **Development**: Replit-optimized with auto-scaling
- **Infrastructure**: Azure Bicep templates with automated CI/CD
- **Container Registry**: GitHub Container Registry (GHCR)

## Key Features

### Core Marketing Tools
- **Social Media Management**: Multi-platform scheduling (Facebook, Instagram, Twitter/X, LinkedIn)
- **AI Content Generation**: OpenAI-powered content creation for field service industries
- **Lead Management**: Automated lead tracking, scoring, and follow-up workflows
- **Review Monitoring**: AI-powered review response generation and sentiment analysis
- **Analytics Dashboard**: Comprehensive reporting with Google Analytics and Search Console integration

### Field Service Integrations
- **Google Services**: Analytics, Search Console, Places API for local SEO
- **Twilio SMS**: Customer notifications, appointment confirmations, emergency alerts
- **WordPress/GoDaddy**: Automated blog publishing and domain management
- **Weather Integration**: Location-based weather data for service scheduling

## Database Schema

### Core Tables
- `users` - Authentication and user management
- `clients` - Multi-tenant client management for white-label
- `social_posts` - Social media content scheduling
- `leads` - Customer lead tracking and management
- `reviews` - Review monitoring and AI response management
- `analytics_reports` - Performance metrics and reporting
- `seo_keywords` - Keyword tracking and Search Console integration

### Configuration Tables
- `client_configurations` - Per-client API keys and settings
- `social_media_configs` - Platform authentication tokens
- `social_media_analytics` - Cross-platform performance metrics

## Development Commands

```bash
# Development
npm run dev          # Start development server (client + server)
npm run build        # Build production client and server
npm run start        # Start production server
npm run check        # TypeScript type checking

# Database
npm run db:push      # Push schema changes to PostgreSQL
npm run db:generate  # Generate migration files
npm run db:migrate   # Run database migrations
```

## Azure Deployment

### Infrastructure Components
- **Resource Groups**: Platform (apps) + Data (database) separation
- **Container Apps**: Scalable application hosting with managed identity
- **PostgreSQL Flexible Server**: Managed database with SSL and high availability
- **Key Vault**: Secure secrets management for API keys and connection strings
- **Application Insights**: Monitoring, logging, and availability testing
- **GitHub Actions**: Automated CI/CD with retry logic and error handling

### Deployment Pipeline
1. **Build Phase**: Multi-stage Docker build with Vite and esbuild
2. **Infrastructure Phase**: Azure Bicep template deployment with retry logic
3. **Application Phase**: Container Apps deployment with GHCR authentication
4. **Database Phase**: Automated schema migrations with PostgreSQL
5. **Validation Phase**: Health checks and end-to-end testing

### Security Features
- **Managed Identity**: Azure AD authentication for service-to-service communication
- **Key Vault Integration**: Encrypted storage for sensitive configuration
- **Container Registry**: GitHub token-based authentication for private images
- **SSL/TLS**: End-to-end encryption with Azure-managed certificates

## Recent Deployment Progress

### Completed Infrastructure Fixes (2025-07-10)
✅ **Docker Build**: Multi-stage build with Vite dependency resolution  
✅ **PostgreSQL**: Complete SQLite → PostgreSQL schema conversion  
✅ **Bicep Templates**: All scoping errors and cross-resource dependencies resolved  
✅ **Authentication**: Optimized from 13 to 2 Azure logins (85% efficiency improvement)  
✅ **Error Handling**: Comprehensive retry logic and API response management  
✅ **Azure Resources**: Key Vault, Application Insights, PostgreSQL configuration fixes  
✅ **Container Registry**: GitHub Container Registry authentication for private images  

### Current Status
- **Infrastructure Deployment**: All Azure resources deploying successfully
- **Application Deployment**: Container Apps with proper GHCR authentication
- **Database Migration**: PostgreSQL schema and connection validation
- **Next Phase**: End-to-end health checks and production validation

## Configuration

### Required Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# AI Services  
OPENAI_API_KEY=sk-...

# Google Services
VITE_GA_MEASUREMENT_ID=G-...
GOOGLE_ANALYTICS_KEY=...
GOOGLE_SEARCH_CONSOLE_KEY=...

# Communication
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...

# Social Media (stored in database per client)
FACEBOOK_ACCESS_TOKEN=...
INSTAGRAM_ACCESS_TOKEN=...
TWITTER_API_KEY=...
LINKEDIN_ACCESS_TOKEN=...
```

### Path Aliases
- `@/` → `client/src/`
- `@shared/` → `shared/`
- `@assets/` → `attached_assets/`

## Company: FieldService

FieldService develops marketing automation tools specifically for field service professionals. Our mission is to help HVAC, plumbing, electrical, landscaping, and other service businesses consolidate expensive marketing subscriptions into one affordable, industry-focused platform.

**Value Proposition**: "Replace 5 Marketing Tools with One" - Eliminate multiple expensive marketing subscriptions with our all-in-one platform for social media management, content creation, lead tracking, review monitoring, and analytics.