# FieldFlux - Replit Project Documentation

## Overview
FieldFlux is a comprehensive marketing automation platform for field service professionals (HVAC, plumbing, electrical, landscaping). It unifies intelligent content creation, review management, lead generation, and business analytics to streamline marketing efforts and drive business growth for field service companies. The platform aims to be a leading solution for smart, efficient, and AI-powered marketing in the field service industry.

## User Preferences
- **Design Direction**: User approved the FieldFlux field service brand theme with safety-orange (#F97316) and navy (#0E2545) colors
- **Visual Style**: Prefers professional field service aesthetic over harsh gradients - likes organic outdoor elements (hills, sky, grass textures)
- **Color Palette**: Confirmed preference for authentic field service colors: safety orange, navy, sky blue, meadow green, sunflower accents

## System Architecture
FieldFlux is a full-stack TypeScript application with a professional business application interface.
-   **Frontend**: React 18 + TypeScript + Vite, utilizing Tailwind CSS, shadcn/ui, and a custom FieldFlux design system with field service industry branding. Features include:
    - **Authentication Flow**: Protected business application requiring user login from landing page
    - **Professional Dashboard Layout**: Traditional sidebar navigation with dedicated pages for each business function (Dashboard, Social Media, Leads, Reviews, Analytics, Keywords, Website, Settings)
    - **Felix AI Assistant**: Slide-in panel from the right accessible via orange button - serves as intelligent assistant within the application to help with tasks and provide guidance
    - **Business Application Pages**: Full-featured pages for social media management, lead tracking, review management, analytics dashboard, SEO tools, and website management
    - **Color System**: Safety-orange primary (#F97316), navy branding (#0E2545), with consistent FieldFlux brand colors throughout the application
    - **Visual Elements**: Professional business application aesthetic with sidebar navigation, header with user menu, and clean page layouts
    - **Felix Integration**: AI assistant appears as fixed slide-in panel from the right that can be opened/closed while working in any application page
    State management is handled by TanStack Query, and client-side routing by Wouter.
-   **Backend**: Express.js + TypeScript, with a PostgreSQL database managed by Drizzle ORM.
-   **Authentication**: Replit Auth with OpenID Connect - Landing page shown at root, business application accessible at /dashboard after authentication.
-   **Build System**: Vite for the client and esbuild for the server.
-   **Core Design Principles**: Professional business application with Felix as an intelligent assistant. Users navigate through dedicated pages for each business function while Felix provides contextual help and guidance through a floating chat interface. Emphasizes productivity and workflow efficiency for field service marketing management.

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