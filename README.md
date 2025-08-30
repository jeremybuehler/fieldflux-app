
# FieldFlux - Intelligent Field Service Marketing

## Overview

FieldFlux is a comprehensive marketing intelligence platform designed for field service professionals to transform marketing, lead generation, and business management through advanced technological solutions. From intelligent content creation to automated lead management, FieldFlux helps professionals showcase their expertise and grow their business effortlessly.

**Tagline**: "Where Field Service Meets Smart Marketing"

## System Architecture

The application follows a full-stack architecture with:

- **Frontend**: React 18 with TypeScript, built using Vite
- **Backend**: Express.js server with TypeScript  
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side routing
- **Authentication**: Optional OpenID Connect (configurable) or session-based

## Key Features

### Current Implementation
- **Intelligent Content Creation**: AI-native social media posts, blog articles, and customer responses using OpenAI GPT-4
- **Review Management**: Automated review responses with Google Places API integration
- **Performance Analytics**: Real-time business insights with Google Analytics integration
- **Lead Management**: Automated lead tracking and qualification system
- **Multi-Platform Publishing**: Unified content scheduling across Facebook, Instagram, Twitter/X, and LinkedIn
- **Keyword Tracking**: Google Search Console integration for SEO performance monitoring
- **Business Intelligence**: Comprehensive reports and actionable recommendations
- **SMS Communication**: Twilio integration for customer messaging
- **Weather Integration**: Real-time weather data for location-based marketing

### Landing Page & Authentication
- **Professional Landing Page**: Modern design with clear value proposition
- **Authentication System**: OIDC-ready (configure your provider) or disabled in dev
- **Demo Access**: Try before you buy functionality
- **Mobile Responsive**: Optimized for all devices

### Modern UI/UX
- **Protocol Design System**: Enhanced with modern Protocol template styling
- **Glass Morphism Effects**: Modern visual design elements
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Dark Mode Support**: Complete dark mode implementation
- **Professional Branding**: Clean, field service-focused design system
- **Real-time Updates**: Live data synchronization with TanStack Query

## Target Market

**Primary Focus**: Field Service Professionals
- HVAC technicians and contractors
- Plumbing and electrical services  
- Landscaping and lawn care
- Pest control and cleaning services
- Home repair and maintenance

**Value Proposition**: "Intelligent Field Service Marketing"
- Replace 5+ marketing tools with one platform
- Reduce marketing costs by 80%
- Save 18+ hours weekly through automation
- Increase leads by 300% with consistent engagement

## Technical Architecture

### Frontend Technologies
- **React 18**: Modern component-based UI framework
- **TypeScript**: Type-safe development with comprehensive error checking
- **Tailwind CSS**: Utility-first styling with Protocol design system
- **Vite**: Fast development server and optimized production builds
- **TanStack Query**: Efficient server state management and caching
- **Wouter**: Lightweight client-side routing solution
- **shadcn/ui**: Accessible primitive components

### Backend Infrastructure
- **Express.js**: RESTful API server with middleware architecture
- **PostgreSQL**: Robust relational database with Drizzle ORM
- **OpenAI API**: Advanced AI content generation and processing
- **Google APIs**: Analytics, Search Console, and Places integration
- **Authentication (OIDC-ready)**: Secure authentication via OpenID Connect
- **Twilio SMS**: Customer communication and notifications

### Database Schema
- **Users & Sessions**: Authentication and user management
- **Content Management**: WordPress posts, social media content
- **Business Data**: Leads, tasks, activities, and analytics
- **Reviews & Keywords**: SEO performance and reputation management
- **SMS Communication**: Message templates and history

### API Integrations
- **Google Analytics 4**: Real-time performance metrics
- **Google Search Console**: Keyword tracking and SEO insights
- **Google Places API**: Business reviews and location data
- **Twilio SMS**: Customer communication and notifications
- **OpenAI GPT-4**: Intelligent content generation
- **WordPress REST API**: Blog content publishing

## Project Structure

```
FieldFlux/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── dashboard/  # Dashboard-specific components
│   │   │   ├── social/     # Social media components
│   │   │   └── ui/         # shadcn/ui components
│   │   ├── pages/          # Route pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility libraries
├── server/                 # Express.js backend
│   ├── services/           # External service integrations
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # Database layer
│   └── index.ts            # Server entry point
├── shared/                 # Shared TypeScript schemas
└── docs/                   # Documentation files
```

## Getting Started

### Prerequisites
- Node.js 20+ with npm package manager
- PostgreSQL database (local via Docker or managed)
- API keys for Google services and OpenAI

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure environment variables
4. Run database migrations: `npm run db:push`
5. Start development server: `npm run dev`

### Environment Variables
Set the following in `.env` (local) or Vercel Project Settings → Environment Variables:
```
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
GOOGLE_ANALYTICS_PROPERTY_ID=GA_MEASUREMENT_ID
GOOGLE_PLACES_API_KEY=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
```

Optional:
- `DISABLE_AUTH=true` to bypass authentication in development.

### Development Commands
- **Development**: `npm run dev` (Vite + Express)
- **Build**: `npm run build` (Production builds)
- **Start**: `npm run start` (Production server)
- **Database**: `npm run db:push` (Apply schema changes)

## Recent Updates

### January 2025
- **Landing Page Redesign**: Professional marketing-focused landing page
- **Authentication Integration**: OIDC-ready hooks and middleware (provider optional)
- **Protocol Design System**: Modern UI with glass morphism effects
- **Mobile Optimization**: Enhanced responsive design across all pages
- **Multi-Platform Scheduling**: Comprehensive social media wizard

### Previous Milestones
- **Core Platform**: Built comprehensive marketing automation foundation
- **AI Integration**: Implemented OpenAI-native content generation
- **Google Integrations**: Added Analytics, Search Console, and Places APIs
- **Database Migration**: Transitioned to PostgreSQL with Drizzle ORM
- **Business Intelligence**: Enhanced reporting with real-time data

## API Documentation

### Core Endpoints
- `GET /api/auth/user` - Get current user
- `POST /api/social/posts` - Create social media post
- `GET /api/reviews` - Fetch business reviews
- `POST /api/ai/generate-content` - Generate AI content
- `GET /api/analytics/reports` - Get analytics data
- `POST /api/sms/send` - Send SMS message

### Authentication
If authentication is enabled (OIDC/session), API endpoints may require auth; development defaults may allow unauthenticated access.

## Development Guidelines

### Code Standards
- TypeScript for type safety across client and server
- ESLint and Prettier for consistent code formatting
- Component-based architecture with reusable UI elements
- TanStack Query for all server state management
- Tailwind CSS with Protocol design system

### Database Operations
- Use Drizzle ORM for all database interactions
- Implement proper error handling and validation
- Follow PostgreSQL best practices for performance
- Maintain data integrity with foreign key constraints

## Deployment

### Vercel Deployment
- Repo contains `vercel.json` and `api/index.ts` for serverless API.
- Build settings:
  - Build Command: `npm run build`
  - Output Directory: `dist/public`
- Environment Variables: set in Vercel dashboard (`DATABASE_URL`, `OPENAI_API_KEY`, optional Google/Twilio; client vars use `VITE_` prefix).
- After deploy, SPA routes are served statically; API available under `/api/*`.

### Authentication (OIDC Stub)
- Configure a generic OIDC provider via env:
  - `OIDC_ISSUER_URL`, `OIDC_CLIENT_ID`, `OIDC_CLIENT_SECRET`, `OIDC_CALLBACK_URL`, `SESSION_SECRET`.
- Login URL: `/api/login`, Callback: `/api/callback`, Logout: `/api/logout`.
- In development, set `DISABLE_AUTH=true` to bypass auth.

### Performance Considerations
- Vite for fast client builds
- esbuild for optimized server bundling
- TanStack Query for efficient data caching
- PostgreSQL indexing for database performance

## Future Roadmap

### Planned Features
- **Customer Onboarding**: Guided setup wizard for new users
- **Advanced Analytics**: Machine learning insights
- **Team Collaboration**: Multi-user workspace support
- **White-Label Solution**: Agency customization
- **Mobile App**: Native iOS/Android applications

### Integration Expansions
- **CRM Systems**: Salesforce, HubSpot
- **Email Marketing**: Mailchimp, Constant Contact
- **Calendar Systems**: Google Calendar, Outlook
- **Payment Processing**: Stripe, PayPal

## Support & Community

### Documentation
- Setup guides for all integrations
- API documentation with examples
- Video tutorials for key features
- Best practices for field service marketing

### Getting Help
- GitHub Issues for bug reports
- Community discussions for feature requests
- Email support for enterprise customers
- Video calls for technical implementation

## License

This project is proprietary software developed for field service professionals. All rights reserved.

## Contributing

FieldFlux is actively developed. For feature requests or bug reports, please contact the development team through the appropriate channels.

---

**FieldFlux - Transforming Field Service Marketing Through Intelligent Automation**
