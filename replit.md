# FieldPulse - AI-Powered Marketing Platform

## Overview

This is FieldPulse - Where Field Service Meets Smart Marketing. A comprehensive marketing automation platform that transforms how field service professionals connect with customers. From intelligent content creation to automated lead management, FieldPulse helps professionals showcase their expertise and grow their business effortlessly.

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
  - Implemented Smart UI Spacing Optimizer system with intelligent spacing, typography, and component classes
  - Enhanced dashboard with modern card designs, gradient backgrounds, colored icon containers, and improved visual hierarchy
  - Created comprehensive UI optimization library for consistent design system across application
- June 26, 2025: Critical dashboard TypeScript error resolution:
  - Successfully resolved blank dashboard issue caused by UI optimizer TypeScript errors
  - Completely rewrote dashboard-simple.tsx with clean, direct Tailwind styling
  - Removed problematic UI optimizer function calls that caused "ui is not defined" errors
  - Implemented modern dashboard design with gradient background, metric cards, and hover animations
  - Dashboard now displays properly with professional interface featuring social media management, performance analytics, and activity timeline
- June 27, 2025: Multi-Platform Post Scheduling Wizard implementation:
  - Created comprehensive step-by-step wizard for social media scheduling
  - Added platform selection for Facebook, Instagram, Twitter/X, and LinkedIn
  - Implemented global content creation with platform-specific customization
  - Added date/time scheduling with optimal posting time recommendations
  - Created review and preview functionality before scheduling
  - Fixed navigation consistency - Social Media Management now properly navigates to dedicated page
  - Updated sidebar navigation to route to /social with proper breadcrumbs
  - Enhanced social media page with tabbed interface (Multi-Platform Wizard and Quick Post)
  - Updated button labels from "Need an idea?" to "Get Ideas" and "Generate Content" to "Generate Post"
- June 29, 2025: Mobile responsiveness improvements:
  - Hidden header badges (AI Powered, Winter Haven FL) on mobile screens to center text better
  - Changed dashboard header alignment to center on mobile, left-align on larger screens
  - Improved mobile user experience with cleaner, focused header layout
  - Maintained logout button visibility across all screen sizes
- June 29, 2025: Final branding established as FieldPulse:
  - Maintained focus on field service professionals as primary target market
  - Established "FieldPulse" as the final brand name
  - Updated tagline to "Where Field Service Meets Smart Marketing"
  - Positioned as platform for HVAC, plumbing, electrical, landscaping, and field service professionals
  - Maintained field service-specific messaging and content throughout platform
  - Focused on content creation and messaging for field service industry needs
- July 7, 2025: Added GoDaddy Configuration page:
  - Created comprehensive GoDaddy integration page with domain management capabilities
  - Added three-tab interface: Connection, Domains, and Settings
  - Implemented API key configuration with sandbox/production environment selection
  - Added domain management interface with auto-renewal and privacy settings
  - Created webhook configuration for domain notifications
  - Added detailed setup instructions for GoDaddy Developer account
  - Integrated GoDaddy page into navigation (top navigation and mobile sidebar)
  - Positioned as complete domain management solution within FieldPulse platform
- July 7, 2025: Implemented Replit Authentication system:
  - Added complete Replit Auth integration with OpenID Connect
  - Created new landing page with professional header containing Login/Sign-Up button
  - Updated main CTA from "Sign in with Replit" to "Get Started" with additional "Already have an account?" option
  - Set up PostgreSQL database with users and sessions tables for persistent authentication
  - Added proper authentication routes: /api/login, /api/logout, /api/callback, /api/auth/user
  - Implemented authenticated user flow that redirects to dashboard upon successful login
  - Fixed authentication error handling to prevent undefined claims issues
- July 7, 2025: Implemented Google Search Console Integration for Real Keyword Data:
  - Added googleapis package for Google Search Console API access
  - Extended GoogleAnalyticsService to include Search Console authentication and data retrieval
  - Created intelligent fallback system between live Search Console data and demo data
  - Implemented real-time status monitoring for API connections and site verification
  - Added comprehensive setup instructions with step-by-step guidance for adding websites to Search Console
  - Created /api/search-console/status endpoint for monitoring integration health
  - Enhanced Keywords page with live/demo data indicators and automatic refresh functionality
  - Service account properly configured for both Google Analytics and Search Console APIs
  - System automatically switches from demo to live data once Search Console properties are configured
- July 7, 2025: Enhanced Settings Page Tab Visibility:
  - Improved tab contrast and styling for better readability
  - Added colored backgrounds and active states for SMS (blue) and Social (purple) tabs
  - Enhanced content styling with theme-appropriate colors and better visual separation
  - Fixed hard-to-see tab issue with stronger text contrast and hover effects
- July 7, 2025: Implemented Real Reviews Data Integration:
  - Created Google Reviews service with Google My Business API integration
  - Added real review data fetching from Google Business profiles
  - Updated Reviews page to display live data with status indicators
  - Implemented analytics endpoints for real review metrics and sentiment analysis
  - Added fallback to demo data when Google services aren't configured
  - Enhanced review response generation with business-appropriate messaging
- July 7, 2025: Google Places API Integration Completed:
  - Successfully implemented Google Places API for real business reviews
  - Added comprehensive business search functionality with 20+ results per query
  - Created real-time review fetching from actual Google Business profiles
  - Implemented business selection interface with live review data
  - System now fetches authentic reviews with ratings, dates, and reviewer information
  - Enhanced error handling with detailed Google Cloud Console setup instructions
  - Platform successfully switched from demo data to real Google review data
- July 7, 2025: Google Places API (New) Full Implementation Success:
  - Resolved API authorization issues by implementing correct Google Places API (New) endpoint
  - Uses regular API key with proper headers (X-Goog-Api-Key, X-Goog-FieldMask) 
  - Successfully tested: McDonald's NYC (5,928 reviews, 3.8 rating), 20 business search results
  - Created new GooglePlacesNewService with native fetch API calls to places.googleapis.com/v1/
  - Real reviewer data with authentic names, photos, detailed comments, and timestamps
  - Business search and review fetching fully operational with live Google Places data
- July 7, 2025: Enhanced Reviews Management and Restructured Analytics:
  - Added complete review response generation with AI-powered professional replies
  - Implemented review management actions: Generate Response, Flag for Follow-up, View Full Review
  - Created comprehensive Business Intelligence Dashboard replacing basic Analytics page
  - Renamed "Analytics" to "Reports" with actionable business insights and recommendations
  - Integrated performance metrics, traffic sources, keyword rankings, and review analytics
  - Added exportable reports with time period filtering and actionable business recommendations
- July 7, 2025: Implemented White-label and Multi-client Configuration System:
  - Added Business Configuration tab with business search default settings for Google Places API
  - Created comprehensive white-label configuration system for agency deployments
  - Added client branding controls: custom colors, logos, contact information, domain settings
  - Extended database schema with clients and clientConfigurations tables for multi-tenant support
  - Implemented business details management: name, address, phone, email, website, industry, timezone
  - Added business search default configuration to optimize Google Places API review fetching
  - Created white-label mode toggle for agencies to rebrand KasamaAI with their own identity
- January 9, 2025: Landing page redirect issue resolution and demo enhancement:
  - Fixed authentication routing to allow users to remain on landing page after login
  - Updated App.tsx to make landing page always accessible at root path
  - Enhanced landing page with authentication-aware UI (shows "Go to Dashboard" when authenticated)
  - Created interactive demo section with visual dashboard preview and "Try Live Demo" button
  - Added comprehensive onboarding implementation plan with 4-phase approach over 8 weeks
  - Strengthened call-to-action with trust indicators and social proof messaging

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
Branding: Evolved from "Dave AI" to "HVAC Pro AI" to "FieldPro AI" to "FieldPulse" to "MarketPulse" and finally to "KasamaAI - Where Business Meets Smart Marketing" as a white-label platform with compelling, customer-focused messaging that emphasizes effortless automation and business growth.
Personalization: UI should reflect logged-in user's first name instead of generic references.
Market Focus: Universal white-label platform for all business types - service providers, consultants, retailers, contractors, professionals, etc.
Twilio Integration: User has Twilio account - implementing SMS features for lead follow-ups, appointment confirmations, and customer notifications.