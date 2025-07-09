# FieldPulse - AI-Powered Marketing Platform

## Overview

This is FieldPulse - Where Field Service Meets Smart Marketing. A comprehensive marketing intelligence platform designed for field service professionals to transform marketing, lead generation, and business management through advanced technological solutions. From intelligent content creation to automated lead management, FieldPulse helps professionals showcase their expertise and grow their business effortlessly.

## System Architecture

The application follows a full-stack architecture with:

- **Frontend**: React with TypeScript, built using Vite
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side routing

## Key Components

### Frontend Architecture
- **React Components**: Modular component structure with shadcn/ui design system
- **TypeScript**: Full type safety across client and server
- **Tailwind CSS**: Utility-first CSS framework with custom HVAC branding variables
- **TanStack Query**: Server state management and caching
- **Wouter**: Lightweight routing solution

### Backend Architecture
- **Express.js**: RESTful API server with middleware for logging and error handling
- **TypeScript**: Type-safe server implementation
- **Drizzle ORM**: Type-safe database operations with PostgreSQL
- **OpenAI Integration**: AI-powered content generation for marketing materials

### Database Schema
The application manages several core entities:
- **Users**: Authentication and user management
- **WordPress Posts**: Blog content management
- **Social Posts**: Social media content scheduling
- **Leads**: Customer lead tracking and management
- **Tasks**: Marketing task automation
- **Activities**: Activity feed for user actions
- **SEO Keywords**: Keyword tracking and performance

### UI Design System
- **shadcn/ui**: Modern, accessible component library
- **Custom HVAC Branding**: Industry-specific color scheme (blue, orange, gray)
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Dark Mode Support**: Complete dark mode implementation

## Data Flow

1. **Client Requests**: React components make API calls using TanStack Query
2. **API Layer**: Express.js routes handle business logic and database operations
3. **Database Operations**: Drizzle ORM manages PostgreSQL interactions
4. **AI Integration**: OpenAI API generates marketing content when requested
5. **Real-time Updates**: Query client invalidation keeps UI synchronized

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **openai**: AI content generation
- **@tanstack/react-query**: Server state management
- **wouter**: Client-side routing

### UI Dependencies
- **@radix-ui/react-***: Accessible primitive components
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **recharts**: Chart visualization

### Development Tools
- **typescript**: Type safety
- **vite**: Build tool and dev server
- **esbuild**: Server bundling for production

## Deployment Strategy

The application is configured for Replit deployment with:

- **Development**: `npm run dev` - Runs both client and server in development mode
- **Build**: `npm run build` - Creates optimized production builds
- **Production**: `npm run start` - Serves the production application
- **Database**: Uses PostgreSQL with Drizzle migrations
- **Environment**: Node.js 20 with TypeScript support

### Replit Configuration
- **Port 5000**: Main application server
- **Auto-scaling**: Configured for automatic scaling
- **Database**: PostgreSQL 16 module enabled
- **Build Process**: Vite for client, esbuild for server

## Key Features

### Current Implementation
- **Intelligent Content Creation**: AI-powered social media posts, blog articles, and customer responses
- **Review Management**: Automated review responses with Google Places API integration
- **Performance Analytics**: Real-time business insights with Google Analytics integration
- **Lead Management**: Automated lead tracking and qualification system
- **Multi-Platform Publishing**: Unified content scheduling across social media platforms
- **Keyword Tracking**: Google Search Console integration for SEO performance monitoring
- **Business Intelligence**: Comprehensive reports and actionable recommendations

### Authentication & Security
- **Replit Authentication**: Seamless OpenID Connect integration
- **PostgreSQL Database**: Persistent user data and session management
- **Secure API Integration**: Protected credentials for third-party services

### Modern UI/UX
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Professional Branding**: Clean, field service-focused design system
- **Intuitive Navigation**: Streamlined user experience with contextual actions
- **Real-time Updates**: Live data synchronization with TanStack Query

## Recent Updates

### January 2025
- **Landing Page Enhancements**: Simplified hero section with clear value proposition
- **Brand Positioning**: Finalized "Intelligent Field Service Marketing" tagline
- **User Experience**: Removed authentication barriers from marketing content
- **Visual Design**: Streamlined branding elements for better conversion focus

### July 2025
- **Google Integrations**: Added Search Console, Analytics, and Places APIs
- **Authentication System**: Implemented Replit Auth with persistent sessions
- **Business Intelligence**: Enhanced reporting with real-time data sources
- **Multi-client Support**: Added white-label capabilities for agencies

### Previous Milestones
- **Core Platform**: Built comprehensive marketing automation foundation
- **AI Integration**: Implemented OpenAI-powered content generation
- **Mobile Optimization**: Developed responsive design system
- **Database Migration**: Transitioned from in-memory to PostgreSQL storage

## Technical Architecture

### Frontend Technologies
- **React 18**: Modern component-based UI framework
- **TypeScript**: Type-safe development with comprehensive error checking
- **Tailwind CSS**: Utility-first styling with custom field service branding
- **Vite**: Fast development server and optimized production builds
- **TanStack Query**: Efficient server state management and caching
- **Wouter**: Lightweight client-side routing solution

### Backend Infrastructure
- **Express.js**: RESTful API server with middleware architecture
- **PostgreSQL**: Robust relational database with Drizzle ORM
- **OpenAI API**: Advanced AI content generation and processing
- **Google APIs**: Analytics, Search Console, and Places integration
- **Replit Auth**: Secure authentication with OpenID Connect

### Database Schema
- **Users & Sessions**: Authentication and user management
- **Content Management**: WordPress posts, social media content
- **Business Data**: Leads, tasks, activities, and analytics
- **Reviews & Keywords**: SEO performance and reputation management
- **Multi-tenant Support**: Client configurations and white-label settings

### API Integrations
- **Google Analytics**: Real-time performance metrics
- **Google Search Console**: Keyword tracking and SEO insights
- **Google Places API**: Business reviews and location data
- **Twilio SMS**: Customer communication and notifications
- **OpenAI GPT**: Intelligent content generation

## Getting Started

### Prerequisites
- Node.js 20+ with npm package manager
- PostgreSQL database (automatically configured in Replit)
- API keys for Google services (Analytics, Search Console, Places)

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables in Replit Secrets
4. Run database migrations: `npm run db:push`
5. Start development server: `npm run dev`

### Configuration
Set up the following environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `GOOGLE_ANALYTICS_PROPERTY_ID`: GA4 property ID
- `GOOGLE_PLACES_API_KEY`: Google Places API key
- `VITE_GA_MEASUREMENT_ID`: Frontend analytics tracking

### Deployment
- **Development**: `npm run dev` (Vite + Express)
- **Production**: `npm run build && npm run start`
- **Database**: Automatic migrations via Drizzle ORM

## Target Market

**Primary Focus**: Field Service Professionals
- HVAC technicians and contractors
- Plumbing and electrical services
- Landscaping and lawn care
- Pest control and cleaning services
- Home repair and maintenance

**Value Proposition**: "Intelligent Field Service Marketing"
- Consolidate 5+ marketing tools into one platform
- Reduce marketing costs by 80%
- Save 18+ hours weekly through automation
- Increase leads by 300% with consistent engagement

## Development Guidelines

### Code Standards
- TypeScript for type safety across client and server
- ESLint and Prettier for consistent code formatting
- Component-based architecture with reusable UI elements
- TanStack Query for all server state management
- Tailwind CSS for styling with custom design tokens

### Database Operations
- Use Drizzle ORM for all database interactions
- Implement proper error handling and validation
- Follow PostgreSQL best practices for performance
- Maintain data integrity with foreign key constraints

### API Design
- RESTful endpoints with consistent response formats
- Proper HTTP status codes and error messages
- Rate limiting and authentication middleware
- Comprehensive API documentation