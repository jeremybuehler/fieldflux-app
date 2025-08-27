# FieldFlux - Replit Project Documentation

## Overview
FieldFlux is a comprehensive marketing automation platform for field service professionals (HVAC, plumbing, electrical, landscaping). It unifies intelligent content creation, review management, lead generation, and business analytics to streamline marketing efforts and drive business growth for field service companies. The platform aims to be a leading solution for smart, efficient, and AI-powered marketing in the field service industry.

## User Preferences
- **Design Direction**: User approved the FieldFlux field service brand theme with safety-orange (#F97316) and navy (#0E2545) colors
- **Visual Style**: Prefers professional field service aesthetic over harsh gradients - likes organic outdoor elements (hills, sky, grass textures)
- **Color Palette**: Confirmed preference for authentic field service colors: safety orange, navy, sky blue, meadow green, sunflower accents

## System Architecture
FieldFlux is a full-stack TypeScript application with a unique canvas-based interface.
-   **Frontend**: React 18 + TypeScript + Vite, utilizing Tailwind CSS, shadcn/ui, and a custom FieldFlux design system with field service industry branding. Features include:
    - **Authentication Flow**: Protected Felix interface requiring user login from landing page
    - **Canvas Interface Architecture**: Felix AI assistant as primary left-panel interface with business application windows floating as draggable, resizable canvas windows on the right
    - **Felix Chat System**: Intelligent conversational interface that opens business function windows (Social Media, Leads, Reviews, Analytics, Keywords, Website, Settings) through user interaction
    - **Window Management**: Each business function appears in dedicated canvas windows with color-coded headers, drag/drop positioning, minimize/maximize controls
    - **Color System**: Safety-orange primary (#F97316), navy branding (#0E2545), with functional window colors (blue for social, green for leads, yellow for reviews, purple for analytics)
    - **Visual Elements**: Professional chat interface with Felix branding, clean canvas workspace, and authentic field service aesthetic
    - **Responsive Design**: Optimized for desktop with professional business application layout
    State management is handled by TanStack Query, and client-side routing by Wouter.
-   **Backend**: Express.js + TypeScript, with a PostgreSQL database managed by Drizzle ORM.
-   **Authentication**: Replit Auth with OpenID Connect - Landing page shown at root, Felix canvas interface accessible at /felix after authentication.
-   **Build System**: Vite for the client and esbuild for the server.
-   **Core Design Principles**: Felix-first conversational interface with professional canvas-based business application windows. Emphasizes AI-guided workflow with drag-and-drop window management for field service marketing tools. Each function (social media, leads, reviews, analytics) opens in dedicated floating windows with intelligent positioning and state management.

## External Dependencies
-   **Database**: @neondatabase/serverless (PostgreSQL), drizzle-orm
-   **AI**: openai (for GPT-4)
-   **Frontend Libraries**: @tanstack/react-query, wouter, @radix-ui/react-\*, tailwindcss, lucide-react
-   **API Integrations**:
    -   OpenAI GPT-4: Content generation, AI assistance, lead scoring, personalized onboarding/plan generation.
    -   Google Analytics 4: Performance metrics and insights.
    -   Google Search Console: SEO keyword tracking.
    -   Google Places API: Business reviews and location data.
    -   Twilio SMS: Customer communication.
    -   WordPress REST API: Blog content publishing.