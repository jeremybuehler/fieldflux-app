# FieldPulse - AI-Powered Marketing Platform

## Overview

This is FieldPulse - Where Field Service Meets Smart Marketing. A comprehensive marketing automation platform that transforms how field service providers connect with customers. From intelligent content creation to automated lead management, FieldPulse helps service professionals showcase their expertise and grow their business effortlessly.

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

## Recent Changes
- June 24, 2025: Initial HVAC marketing dashboard setup with basic components
- June 24, 2025: Enhanced FieldPulse AI agent with comprehensive features:
  - Added reviews management system with AI-powered response generation
  - Integrated GoDaddy WordPress publishing capabilities  
  - Enhanced analytics reporting with comprehensive metrics and charts
  - Added lead qualification system with automated scoring
  - Extended database schema for reviews and analytics reports
  - Improved UI with additional dashboard panels
- June 24, 2025: Added PostgreSQL database integration with full data persistence
- June 24, 2025: Created comprehensive Settings page with detailed configuration instructions:
  - WordPress/GoDaddy integration setup with step-by-step instructions
  - Google Analytics configuration with GA4 measurement ID setup
  - Added navigation to settings page in sidebar
- June 24, 2025: Implemented AI-powered content generation features:
  - Added "Need an idea?" functionality with GPT-4o integration
  - Created intelligent topic suggestion system for blog and social media posts
  - Enhanced UX with Use This/Try Another/No Thanks workflow options
- June 24, 2025: Added weather integration and authentication framework:
  - Integrated real-time weather widget for Winter Haven, FL location
  - Created professional marketing landing page as default entry point
  - Implemented login/signup system with demo access (admin/demo123)
  - Added proper navigation flow between landing page and dashboard
- June 24, 2025: Rebranded from "Dave AI" to "HVAC Pro AI" for professional presentation:
  - Updated all branding throughout the application
  - Switched to in-memory storage to resolve database connection issues
  - Prepared for personalized UI with user's first name integration
- June 24, 2025: Rebranded to universal Field Service Providers platform:
  - Changed from HVAC-specific to "FieldPro AI" for broader market appeal
  - Updated messaging to focus on social media content marketing for all field service industries
  - Repositioned as universal platform for HVAC, plumbing, electrical, landscaping, pest control, etc.
- June 24, 2025: Final rebrand to "FieldPulse":
  - Changed to "FieldPulse - Where Field Service Meets Smart Marketing"
  - Enhanced messaging with compelling taglines and customer-focused language
  - Positioned as effortless marketing automation that transforms service calls into success stories
  - Maintains focus on field service providers across all industries
- June 24, 2025: Enhanced navigation and added Twilio SMS integration:
  - Fixed sidebar navigation links to properly route to dedicated pages
  - Created Social Media and Lead Management pages with dedicated functionality
  - Added comprehensive Twilio SMS service for customer communication
  - Implemented SMS templates for lead follow-ups, appointment confirmations, and emergency alerts
- June 25, 2025: Mobile responsiveness improvements:
  - Implemented mobile-first sidebar with hamburger menu and slide-in animation
  - Added proper mobile overlay and touch-friendly navigation
  - Enhanced landing page responsiveness with optimized spacing and text sizing
  - Improved dashboard and social media page layouts for mobile devices
- June 25, 2025: Landing page and credential management improvements:
  - Fixed difficult-to-read gradient on landing page by switching from dark blue to light slate theme
  - Improved text contrast and readability with darker text on lighter background
  - Added comprehensive credential management interfaces in Settings page
  - Created Twilio SMS configuration section with Account SID, Auth Token, and Phone Number fields
  - Added social media platform credential management for Facebook, Instagram, Twitter, and LinkedIn
  - Included detailed setup instructions for each integration with proper secret environment variable names
- June 25, 2025: UI improvements and dashboard fixes:
  - Fixed large gap between sidebar and dashboard content by removing excessive left padding
  - Resolved blank settings page by implementing complete settings interface with mobile sidebar
  - Removed "Generate Content" button from dashboard header as requested
  - Enhanced landing page readability by switching from dark gradient to light theme
  - Added comprehensive credential management for Twilio SMS, Facebook, Twitter, Instagram, and LinkedIn
  - Improved mobile responsiveness across settings page with proper form layouts
  - Applied consistent spacing fix across all main pages (dashboard, settings, social, leads)

## Architecture Updates
- **Database Schema**: Added `reviews` and `analytics_reports` tables with PostgreSQL backend
- **Storage**: Migrated from in-memory storage to PostgreSQL with Drizzle ORM
- **API Endpoints**: Extended with review management, GoDaddy integration, analytics reporting, topic generation, and weather data
- **UI Components**: Added ReviewsPanel, GoDaddyIntegration, AnalyticsReports, WeatherWidget, and Settings page
- **Navigation**: Enhanced sidebar with settings page and proper routing between landing and dashboard
- **AI Features**: Enhanced OpenAI integration for review responses, content generation, and intelligent topic suggestions
- **Authentication**: Implemented user authentication framework with landing page, login/signup forms, and demo access
- **Weather Integration**: Added real-time weather display for Winter Haven, FL with temperature and rain forecast

## User Preferences

Preferred communication style: Simple, everyday language.
API Keys: Will provide Google Analytics ID in the morning.
Branding: Evolved from "Dave AI" to "HVAC Pro AI" to "FieldPro AI" and finally to "FieldPulse - Where Field Service Meets Smart Marketing" with compelling, customer-focused messaging that emphasizes effortless automation and business growth.
Personalization: UI should reflect logged-in user's first name instead of generic "Dave" references.
Market Focus: Universal platform for all field service providers - HVAC, plumbing, electrical, landscaping, pest control, etc.
Twilio Integration: User has Twilio account - implementing SMS features for lead follow-ups, appointment confirmations, and customer notifications.