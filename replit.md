# HVAC Marketing Dashboard

## Overview

This is a full-stack HVAC marketing automation platform built for service contractors. The application helps HVAC businesses manage their digital marketing activities through content generation, social media scheduling, lead management, and SEO optimization.

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

## Changelog
- June 24, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.