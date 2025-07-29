
# FieldFlux - Replit Project Documentation

## Project Overview

FieldFlux is a comprehensive marketing automation platform for field service professionals (HVAC, plumbing, electrical, landscaping) built on Replit. The platform combines intelligent content creation, review management, lead generation, and business analytics into a unified solution.

## Architecture Overview

### Full-Stack TypeScript Application
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: Tailwind CSS + shadcn/ui + Protocol design system
- **Authentication**: Replit Auth with OpenID Connect
- **State Management**: TanStack Query for server state

### Core Technology Stack
- **Build System**: Vite for client, esbuild for server
- **Styling**: Tailwind CSS with Protocol template integration
- **Components**: shadcn/ui with custom HVAC branding
- **Database ORM**: Drizzle with PostgreSQL
- **API Integrations**: OpenAI, Google APIs, Twilio SMS
- **Routing**: Wouter for client-side navigation

## Database Schema

### Core Tables
```sql
-- User management
users (id, email, name, created_at)
user_sessions (id, user_id, session_token, expires_at)

-- Content management
wordpress_posts (id, user_id, title, content, status, published_at)
social_posts (id, user_id, content, platform, scheduled_for, status)
reviews (id, user_id, source, rating, content, response, created_at)

-- Business data
leads (id, user_id, name, email, phone, source, status, score)
tasks (id, user_id, title, description, status, due_date)
activities (id, user_id, action, description, created_at)

-- Analytics and tracking
seo_keywords (id, user_id, keyword, position, clicks, impressions)
analytics_reports (id, user_id, report_type, data, generated_at)
```

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **openai**: AI content generation
- **@tanstack/react-query**: Server state management
- **wouter**: Client-side routing
- **@radix-ui/react-***: Accessible primitive components
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library

### API Integrations
- **OpenAI GPT-4**: Content generation and AI assistance
- **Google Analytics 4**: Performance metrics and insights
- **Google Search Console**: SEO keyword tracking
- **Google Places API**: Business reviews and location data
- **Twilio SMS**: Customer communication
- **WordPress REST API**: Blog content publishing

## Replit Configuration

### Environment Setup
- **Node.js**: Version 20 with TypeScript support
- **PostgreSQL**: Version 16 module enabled
- **Port Configuration**: Main server on port 5000
- **Build Process**: Vite for frontend, esbuild for backend
- **Hot Reload**: Enabled for development

### Deployment Configuration
- **Development**: `npm run dev` - Concurrent client and server
- **Production**: `npm run build && npm run start`
- **Database**: Automatic PostgreSQL connection via Replit
- **Secrets**: Environment variables managed via Replit Secrets

## Recent Major Updates

### January 2025 - Brand Updates & AI Enhancement
- **Brand Rebranding**: Updated from "FieldPulse" to "FieldFlux" across all platform references
- **AI Lead Scoring System**: Comprehensive OpenAI-native lead scoring with analytics dashboard
- **Professional Landing Page**: Complete redesign with clean, modern aesthetic and improved footer
- **Personalized AI Coach**: Full implementation with engagement tracking, goal setting, and analytics
- **Replit Auth Integration**: Seamless authentication with OpenID Connect
- **Protocol Design System**: Modern UI with glass morphism effects and gradient accents
- **Mobile Responsiveness**: Enhanced mobile experience across all pages
- **Brand Positioning**: Finalized "Intelligent Field Service Marketing" messaging

### December 2024 - Core Platform Enhancement
- **Multi-Platform Social Scheduling**: Comprehensive wizard for Facebook, Instagram, Twitter, LinkedIn
- **Enhanced Analytics Dashboard**: Real-time metrics with chart visualizations
- **Review Management System**: AI-native response generation
- **Lead Qualification Engine**: Automated scoring and follow-up systems

### November 2024 - Database & Infrastructure
- **PostgreSQL Migration**: Complete transition from in-memory to persistent storage
- **Drizzle ORM Integration**: Type-safe database operations
- **Google APIs Integration**: Analytics, Search Console, Places API
- **Twilio SMS Service**: Customer communication capabilities

### October 2024 - UI/UX Improvements
- **Protocol Template Integration**: Modern design system implementation
- **CSS Architecture Optimization**: Fixed import order and compilation issues
- **Responsive Design Enhancement**: Mobile-first approach with Tailwind breakpoints
- **Component Library Standardization**: shadcn/ui with custom HVAC branding

## Current File Structure

### Frontend Architecture (`client/src/`)
```
components/
├── dashboard/          # Dashboard-specific components
│   ├── sidebar.tsx            # Main navigation
│   ├── metrics-grid.tsx       # KPI display
│   ├── social-scheduler.tsx   # Content scheduling
│   ├── reviews-panel.tsx      # Review management
│   ├── analytics-chart.tsx    # Data visualization
│   └── weather-widget.tsx     # Location-based data
├── social/             # Social media components
│   ├── multi-platform-wizard.tsx  # Publishing wizard
│   └── enhanced-scheduler.tsx      # Advanced scheduling
├── ui/                 # shadcn/ui components
└── layout/             # Layout components

pages/
├── landing.tsx         # Marketing landing page
├── dashboard.tsx       # Main application dashboard
├── social.tsx          # Social media management
├── leads.tsx           # Lead management
├── analytics.tsx       # Business analytics
├── reviews.tsx         # Review management
├── settings.tsx        # Configuration
└── not-found.tsx       # 404 page

hooks/
├── useAuth.ts          # Authentication state
├── use-analytics.tsx   # Analytics data
└── use-mobile.tsx      # Mobile responsiveness

lib/
├── ai-service.ts       # OpenAI integration
├── analytics-service.ts # Google Analytics
├── social-media-service.ts # Social platforms
├── twilio-service.ts   # SMS functionality
└── utils.ts            # Utility functions
```

### Backend Architecture (`server/`)
```
services/
├── google-analytics.ts    # GA4 integration
├── google-places.ts       # Business reviews
└── google-reviews.ts      # Review processing

index.ts                   # Express server entry
routes.ts                  # API endpoint definitions
storage.ts                 # Database layer with Drizzle
db.ts                      # Database configuration
replitAuth.ts             # Authentication middleware
```

## API Endpoints

### Authentication
- `GET /api/auth/user` - Get current user info
- `POST /api/auth/logout` - End user session

### Content Management
- `GET /api/social/posts` - Retrieve social media posts
- `POST /api/social/posts` - Create new social post
- `POST /api/ai/generate-content` - AI content generation
- `GET /api/wordpress/posts` - WordPress blog posts

### Business Data
- `GET /api/leads` - Customer leads
- `POST /api/leads` - Add new lead
- `GET /api/reviews` - Business reviews
- `POST /api/reviews/respond` - AI review responses

### Analytics & Reporting
- `GET /api/analytics/reports` - Business performance data
- `GET /api/keywords` - SEO keyword tracking
- `GET /api/weather` - Location weather data

### Communication
- `POST /api/sms/send` - Send SMS messages
- `GET /api/sms/templates` - Message templates

## Development Workflow

### Local Development
1. **Environment Setup**: Configure Replit Secrets
2. **Database Initialization**: `npm run db:push`
3. **Development Server**: `npm run dev`
4. **Hot Reload**: Automatic refresh on file changes

### Production Deployment
1. **Build Process**: `npm run build`
2. **Production Server**: `npm run start`
3. **Database Migrations**: Automatic via Drizzle
4. **Environment**: Production secrets via Replit

## Key Features Implementation Status

### ✅ Completed Features
- Professional landing page with authentication
- Multi-platform social media scheduling
- AI-native content generation with OpenAI
- Google Analytics and Search Console integration
- Review management with automated responses
- Lead generation and qualification system
- SMS communication via Twilio
- Real-time weather integration
- Mobile-responsive design with Protocol UI
- PostgreSQL database with persistent storage

### 🚧 In Development
- Customer onboarding wizard system
- Advanced analytics dashboard enhancements
- Team collaboration features
- White-label customization options

### 📋 Planned Features
- Mobile application (iOS/Android)
- Advanced automation workflows
- CRM system integrations
- Email marketing platform connections

## Performance Optimizations

### Frontend Performance
- **Vite Build System**: Fast development and optimized production builds
- **TanStack Query**: Efficient server state caching
- **Code Splitting**: Lazy loading for route components
- **Image Optimization**: Optimized asset delivery

### Backend Performance
- **Database Indexing**: Optimized PostgreSQL queries
- **API Caching**: Redis-like caching strategies
- **Connection Pooling**: Efficient database connections
- **Rate Limiting**: API protection and throttling

## Security Considerations

### Authentication & Authorization
- **Replit Auth**: Secure OpenID Connect implementation
- **Session Management**: Secure token-based sessions
- **API Security**: Authenticated endpoints with middleware
- **Data Protection**: Environment variables via Replit Secrets

### Data Privacy
- **GDPR Compliance**: User data protection standards
- **API Key Security**: Secure third-party service integration
- **Database Security**: PostgreSQL security best practices

## Troubleshooting Common Issues

### Development Issues
- **CSS Compilation**: Ensure Tailwind imports are in correct order
- **Database Connection**: Verify PostgreSQL module is enabled
- **API Keys**: Check Replit Secrets configuration
- **Hot Reload**: Restart dev server if changes not reflecting

### Production Issues
- **Build Failures**: Check TypeScript compilation errors
- **Database Migrations**: Ensure schema changes are applied
- **API Rate Limits**: Monitor third-party service quotas
- **Performance**: Optimize queries and caching strategies

## Monitoring & Analytics

### Application Monitoring
- **Error Tracking**: Console logging and error boundaries
- **Performance Metrics**: API response times and database queries
- **User Analytics**: Google Analytics 4 integration
- **Business Metrics**: Lead generation and conversion tracking

## Future Architecture Considerations

### Scalability Planning
- **Microservices**: Potential service decomposition
- **Caching Strategy**: Redis implementation for high-traffic scenarios
- **CDN Integration**: Asset delivery optimization
- **Database Sharding**: Multi-tenant data isolation

### Technology Evolution
- **React 19**: Planned upgrade with concurrent features
- **Next.js Migration**: Potential SSR implementation
- **GraphQL**: API optimization consideration
- **WebSocket**: Real-time features implementation

---

**Last Updated**: January 2025  
**Project Status**: Production Ready  
**Deployment**: Replit Platform  
**Team**: Active Development
