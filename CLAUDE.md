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

FieldPulse is a full-stack field service marketing platform designed to "Replace 5 Marketing Tools with One" for field service businesses with client-server architecture:

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