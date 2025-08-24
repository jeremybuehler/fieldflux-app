# FieldFlux - Replit Project Documentation

## Overview
FieldFlux is a comprehensive marketing automation platform for field service professionals (HVAC, plumbing, electrical, landscaping). It unifies intelligent content creation, review management, lead generation, and business analytics to streamline marketing efforts and drive business growth for field service companies. The platform aims to be a leading solution for smart, efficient, and AI-powered marketing in the field service industry.

## User Preferences
- **Design Direction**: User approved the FieldFlux field service brand theme with safety-orange (#F97316) and navy (#0E2545) colors
- **Visual Style**: Prefers professional field service aesthetic over harsh gradients - likes organic outdoor elements (hills, sky, grass textures)
- **Color Palette**: Confirmed preference for authentic field service colors: safety orange, navy, sky blue, meadow green, sunflower accents

## System Architecture
FieldFlux is a full-stack TypeScript application.
-   **Frontend**: React 18 + TypeScript + Vite, utilizing Tailwind CSS, shadcn/ui, and a custom FieldFlux design system with field service industry branding. Features include:
    - **Authentication Flow**: Protected Felix interface requiring user login from landing page
    - **Canvas Window System**: Draggable, resizable floating windows for business functions over Felix chat
    - **Color System**: Safety-orange primary (#F97316), navy branding (#0E2545), sky blues, meadow greens, and sunflower accents
    - **Visual Elements**: Organic outdoor textures (.fx-hills background), subtle grain effects (.fx-grain), and field service aesthetic
    - **Animations**: Modern transitions with professional hover effects and authentic field worker imagery
    - **Typography**: Strong, readable fonts that convey trust and competence for field service professionals
    State management is handled by TanStack Query, and client-side routing by Wouter.
-   **Backend**: Express.js + TypeScript, with a PostgreSQL database managed by Drizzle ORM.
-   **Authentication**: Replit Auth with OpenID Connect - Felix only accessible after authentication.
-   **Build System**: Vite for the client and esbuild for the server.
-   **Core Design Principles**: Professional field service aesthetic with safety-orange and navy color scheme, emphasizing trust, competence, and industry authenticity. Organic outdoor elements reflect the field service environment. Key features include AI-powered content generation, lead scoring, and personalized onboarding, alongside robust analytics and communication tools optimized for HVAC, plumbing, electrical, and landscaping professionals.

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