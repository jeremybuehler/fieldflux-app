# FieldFlux - Replit Project Documentation

## Overview
FieldFlux is a comprehensive marketing automation platform for field service professionals (HVAC, plumbing, electrical, landscaping). It unifies intelligent content creation, review management, lead generation, and business analytics to streamline marketing efforts and drive business growth for field service companies. The platform aims to be a leading solution for smart, efficient, and AI-powered marketing in the field service industry.

## User Preferences
No specific user preferences were provided in the original `replit.md` for how the user wants to communicate with the AI, preferred explanation style, working methodology, interaction style, or how the agent should work or make changes to the codebase.

## System Architecture
FieldFlux is a full-stack TypeScript application.
-   **Frontend**: React 18 + TypeScript + Vite, utilizing Tailwind CSS, shadcn/ui, and a custom FieldPulse/FieldFlux design system. It incorporates modern UI effects like glass morphism, gradient accents, hover animations (`hover-lift`, `hover-glow`), and protocol-specific animations (`animate-float`, `animate-pulse-glow`, `animate-protocol-fade-in`, `animate-shimmer`). Status indicators have modern styling with glow effects. State management is handled by TanStack Query, and client-side routing by Wouter.
-   **Backend**: Express.js + TypeScript, with a PostgreSQL database managed by Drizzle ORM.
-   **Authentication**: Replit Auth with OpenID Connect.
-   **Build System**: Vite for the client and esbuild for the server.
-   **Core Design Principles**: Emphasis on a modern, professional aesthetic with a slate and teal color scheme, intuitive user experience, and mobile responsiveness. Key features include AI-powered content generation, lead scoring, and personalized onboarding, alongside robust analytics and communication tools.

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