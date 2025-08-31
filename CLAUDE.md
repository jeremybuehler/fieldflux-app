# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands

- `npm run dev` - Start development server with hot reload (client + server)
- `npm run build` - Build production client (Vite) and server (esbuild)
- `npm run start` - Start production server (requires build first)
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes to PostgreSQL

### Testing

This project does not currently have test scripts configured.

## Architecture Overview

FieldFlux is a full-stack field service marketing platform designed to "Replace 5 Marketing Tools with One" for field service businesses with client-server architecture:

- **Client**: React + TypeScript + Vite in `/client` folder
- **Server**: Express.js + TypeScript in `/server` folder  
- **Database**: PostgreSQL with Drizzle ORM, schema in `/shared/schema.ts`
- **Deployment**: Optimized for Replit with port 5000

### Key Technologies

- **Frontend**: React 18, TypeScript, Wouter routing, TanStack Query, Tailwind CSS
- **Backend**: Express.js, TypeScript, Drizzle ORM, PostgreSQL
- **UI Components**: shadcn/ui with Radix UI primitives
- **Authentication**: Replit Auth with OpenID Connect
- **AI Integration**: OpenAI API for content generation
- **External APIs**: Google Analytics, Google Places, Twilio SMS

## Project Structure

```
client/src/
├── components/     # React components organized by feature
├── pages/          # Route components (dashboard, social, leads, etc.)
├── lib/            # Services and utilities
├── hooks/          # Custom React hooks
└── main.tsx        # React app entry point

server/
├── index.ts        # Express server entry point
├── routes.ts       # API route definitions
├── services/       # External API integrations
└── db.ts           # Database connection

shared/
└── schema.ts       # Drizzle database schema and types
```

## Database Schema

The application uses PostgreSQL with comprehensive schema including:

- `users` - Replit authentication
- `wordpress_posts` - Blog content management
- `social_posts` - Social media scheduling
- `leads` - Lead management and tracking
- `reviews` - Customer review management
- `analytics_reports` - Performance reporting
- `social_media_configs` - Platform API configurations
- `clients` - White-label client management
- `client_configurations` - Per-client settings and API keys

## Important Configuration

### Path Aliases

- `@/` → `client/src/`
- `@shared/` → `shared/`
- `@assets/` → `attached_assets/`

### Environment Variables

- `DATABASE_URL` - PostgreSQL connection (required)
- `VITE_GA_MEASUREMENT_ID` - Google Analytics tracking ID
- `OPENAI_API_KEY` - OpenAI API key for content generation
- `REPLIT_DB_URL` - Database URL for Replit deployment

### Port Configuration

- Development: Vite dev server + Express API on port 5000
- Production: Express serves both API and static files on port 5000

## Development Patterns

### API Routes

- All API endpoints are prefixed with `/api`
- Express routes defined in `server/routes.ts`
- Database operations use Drizzle ORM with type safety

### State Management

- TanStack Query for server state and caching
- React hooks for local state management
- Authentication state managed via `useAuth` hook

### UI Components

- shadcn/ui components in `client/src/components/ui/`
- Custom components organized by feature in `client/src/components/`
- Tailwind CSS with custom design tokens for branding

### Authentication Flow

- Replit Auth handles login/logout
- Authenticated routes protected by `useAuth` hook
- Session management with PostgreSQL sessions table

## External Service Integrations

### Google Services

- Google Analytics for web analytics
- Google Places API for business location data
- Google Search Console for SEO keywords

### Social Media APIs

- Facebook/Instagram Business APIs
- Twitter/X API v2
- LinkedIn API for professional networks

### Communication Services

- Twilio SMS for customer notifications
- WordPress/GoDaddy for blog publishing

## Common Development Tasks

### Adding New Database Tables

1. Update `shared/schema.ts` with new table definition
2. Create insert schema and TypeScript types
3. Run `npm run db:push` to apply changes

### Creating New API Endpoints

1. Add route handler in `server/routes.ts`
2. Use Drizzle ORM for database operations
3. Implement proper error handling and validation

### Adding New React Components

1. Create component in appropriate `client/src/components/` subdirectory
2. Use shadcn/ui components and Tailwind for styling
3. Implement proper TypeScript interfaces

### Database Operations

- Use Drizzle ORM for all database interactions
- Leverage generated TypeScript types for type safety
- Connection configured in `server/db.ts`

## Platform-Specific Notes

### Replit Deployment

- Uses Replit-specific Vite plugins for development
- Optimized for Replit's containerized environment
- Database provisioned through Replit PostgreSQL service
- Authentication integrated with Replit's user system

### Security Considerations

- API keys stored in environment variables
- Social media tokens encrypted in database
- Session management with secure cookies
- CORS configured for production deployment

## Field Service Focus

### Target Industries

- HVAC (Heating, Ventilation, Air Conditioning)
- Plumbing and pipe services
- Electrical contractors
- Landscaping and lawn care
- Pest control services
- Cleaning services
- Other field service businesses

### Core Value Proposition

"Replace 5 Marketing Tools with One" - consolidating social media management, review monitoring, customer communication, content creation, and analytics into one affordable platform specifically designed for field service professionals.

### Content Generation

All AI-powered content generation is optimized for field service industries, including:

- Seasonal maintenance tips
- Emergency service promotions
- Customer education content
- Industry-specific social media posts
- Field service professional messaging

## Company Information

### FieldService Company

FieldService is a technology company focused on empowering field service professionals with modern marketing tools. Founded to address the unique challenges faced by service-based businesses, FieldService develops software solutions that help HVAC, plumbing, electrical, landscaping, and other field service professionals grow their businesses.

### What FieldService Provides

- **Marketing Automation**: Streamlined social media management, content creation, and lead nurturing
- **Industry-Specific Solutions**: Tools designed specifically for field service professionals
- **Cost-Effective Platform**: Consolidates multiple expensive marketing tools into one affordable solution
- **AI-Powered Content**: Generates relevant, engaging content tailored to field service industries
- **Lead Management**: Comprehensive lead tracking, follow-up automation, and customer communication
- **Review Management**: Monitors and responds to customer reviews across platforms
- **Analytics & Reporting**: Provides insights into marketing performance and ROI

### Value Proposition

"Replace 5 Marketing Tools with One" - FieldService eliminates the need for multiple expensive marketing subscriptions by providing an all-in-one platform that includes social media management, content creation, lead tracking, review monitoring, and analytics - all optimized for field service businesses.

## Current Development Status

### Azure Deployment Initiative

**Status**: In Progress - GitHub Workflows Created but Failing
**Date**: July 9, 2025

#### GitHub Issues Created

- **19 GitHub Issues** total covering Azure deployment infrastructure
- **4 Epics** (#6-9): Infrastructure, CI/CD, Database, Monitoring
- **10 Implementation Issues** (#10-18): Specific deployment tasks
- **Phase 1 Overview** (#19): Development environment focus

#### Current Blocker: Authentication Failures

**Issue**: GitHub Actions workflows failing due to missing Azure authentication secrets

**Failed Workflows**:

- `Deploy Infrastructure` - Missing Azure credentials
- `Deploy Application` - Missing Azure credentials  
- `Database Migration` - Missing Azure credentials

**Required Secrets** (Not Configured):

- `AZURE_CLIENT_ID` - Azure Service Principal client ID
- `AZURE_TENANT_ID` - Azure tenant ID
- `AZURE_SUBSCRIPTION_ID` - Azure subscription ID

#### Next Steps

1. **Fix Authentication**: Configure required Azure secrets or disable workflows
2. **Azure Setup**: Create Azure Service Principal with appropriate permissions
3. **Infrastructure**: Deploy Azure resources (Container Apps, PostgreSQL, Key Vault)
4. **Application**: Deploy FieldFlux to Azure Container Apps

#### Development Environment Focus

- **Scope**: Development environment only (not integration/production)
- **Timeline**: 4 weeks
- **Budget**: ~$45/month
- **Architecture**: Container Apps + PostgreSQL + Key Vault + Application Insights

### Local Development Status

- **Application**: Fully functional locally
- **Database**: SQLite files present (`FieldFlux.db`, `sqlite:FieldFlux.db`)
- **Branch**: `main` branch up to date
- **Recent Changes**: Azure deployment workflows, rebranding from FieldFlux to KasamaAI back to FieldFlux

## Deployment Scripts Optimization

### Major Workflow Efficiency Improvements (July 10, 2025)

**Problem Solved**: Reduced GitHub Actions complexity from 13 separate Azure logins to 2

- **Before**: 4 separate workflow files with multiple jobs each requiring individual authentication
- **After**: 1 unified `deploy-FieldFlux.yml` workflow with sequential steps in single job
- **Result**: 85% reduction in authentication overhead + faster deployment pipeline

**New Unified Pipeline**:

1. **Validation Phase**: TypeScript type checking + Bicep template validation
2. **Build Phase**: Application build + container image creation/push to GHCR
3. **Infrastructure Phase**: Deploy Azure resources via Bicep templates
4. **Application Phase**: Deploy container to Azure Container Apps
5. **Database Phase**: Run database migrations
6. **Health Check Phase**: Validate deployment with retry logic
7. **Rollback Phase**: Automatic cleanup on failure

**Key Features**:

- **Single authentication context** shared across all deployment phases
- **Environment support**: dev/staging/prod with matrix deployment capability
- **Container registry**: GitHub Container Registry with SHA + latest tagging
- **Error handling**: Comprehensive rollback and cleanup procedures
- **Health validation**: Automated endpoint testing with retry logic

**Secrets Configuration**:

- ✅ AZURE_CLIENT_ID, AZURE_TENANT_ID, AZURE_SUBSCRIPTION_ID, AZURE_CLIENT_SECRET
- ✅ OPENAI_API_KEY (placeholder for AI features)
- ✅ GITHUB_TOKEN (automatic for container registry access)

### Current Status

- **New Workflow**: `deploy-FieldFlux.yml` created and tested
- **Legacy Workflows**: Pending removal after validation
- **Active Deployment**: Testing unified workflow in development environment

### Next Steps

1. ✅ **Authentication Fixed**: All Azure secrets configured
2. 🔄 **Testing**: Unified workflow currently running
3. **Cleanup**: Remove old workflows after successful validation
4. **Documentation**: Update deployment procedures
