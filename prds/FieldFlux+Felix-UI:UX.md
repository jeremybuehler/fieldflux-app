🎨 FieldFlux + Felix — UI/UX & Implementation Specification
1. ✨ Product Philosophy

North Star:

“Zero dashboards. One conversation. Instant marketing momentum.”

FieldFlux isn’t another marketing platform — it’s a chat-first, context-aware control system.
Felix is the primary UI. Everything else is ephemeral and adaptive.

Chat = OS — the conversation is the workspace.

Ephemeral UI — only surfaces when needed.

Observability-first — everything Felix does is transparent and traceable.

No cognitive load — every decision either happens automatically or gets a single-click confirmation.

2. 🧩 Core UX Hierarchy
Felix Chat (Main Interaction Surface)
    ↳ Contextual Cards (ephemeral UI)
        ↳ Mini Dashboards / Quick Stats
            ↳ Deep Dive Pages (optional drill-downs)


Felix Chat is the default view across all modules (Dashboard, Social, Leads, Reviews, Analytics).
Other pages serve primarily as contextual anchors for data, not navigation hubs.

3. 💬 Primary Screens & Components
3.1. Home / Dashboard (/dashboard)

Purpose: daily operational pulse.

Element	Description
Welcome Message	Felix greets user (“Good morning! 4 new leads, 2 reviews, 1 campaign post today.”)
Goal Button	CTA: “Set Today’s Goals” opens a GoalCard
Performance Snapshot	Cards: Leads, Reviews, Conversion, Engagement
Recent Activity Feed	Pulls from event logs (lead captured, review posted, campaign launched)
Quick Actions	Buttons → Create Post, Add Lead, Manage Reviews, View Analytics
Felix Chat Bubble (persistent)	Docked in lower right, active in every page

Visual Style:

Clean, minimalist card layout (shadcn Card + Tailwind grid-cols-2)

Gradient header (from-sky-50 to-white)

Subtle motion via framer-motion fade-ins

3.2. Felix Chat Interface (/ai-coach)

Purpose: Primary OS — all commands and reasoning flow through here.

💬 Chat Input Area

textarea + send button

Slash commands (/post, /leads, /review, /report)

Voice input (optional future integration)

🧠 Chat Stream
Message Type	Visual Cue
Felix (Reasoning)	Yellow border, small ⚙️ icon animating (thinking state)
User Command	Simple text bubble (blue accent)
Ephemeral Card Embed	Inline card (post preview, report summary, anomaly alert)
Action Feedback	Inline confirmation (“✅ Scheduled post for 9am tomorrow”)
🪶 Sample Flow
User: "Felix, post something about our fall special."
Felix: [typing animation] "Got it. Here's a quick draft 👇"
→ [PostPreviewCard appears with editable caption + image picker]
User: "Looks good."
Felix: "Perfect. Scheduled for 9am tomorrow. Want me to cross-post to Threads?"

3.3. Ephemeral UI Components
Component	Purpose	Trigger	Interaction
PostPreviewCard	Review/edit generated post	/post command	Inline confirm/edit
LeadCard	View lead summary & follow-up	New lead event	Tap to call / send SMS
ReviewReplyCard	Approve or edit AI reply	New review fetched	Inline approval
InsightCard	Highlight anomaly/trend	Analytics signal	“Show me more” or “Auto-adjust”
GoalCard	Set daily targets	User click “Set Goals”	Multi-field ephemeral form
MemoryInspectorCard	View/forget context	“What do you remember about…”	Inline memory list
TaskSummaryCard	Recap completed actions	Post-execution	Appears briefly, fades out

Behavioral Rule:
Ephemeral components auto-dismiss after interaction or 90s idle timeout.

3.4. Deep Dive Pages (Optional)

While Felix handles 90% in-chat, each category still has a deep dive for reference or manual override:

Page	Purpose	Felix Context
/social	Post queue + performance charts	“Show me my social calendar”
/leads	Lead list + contact history	“Open my leads list”
/reviews	Review list + sentiment graph	“Show my Google reviews”
/analytics	KPI dashboard	“Show me performance this month”
/website	Landing page builder (future)	“Edit my website banner”

Each uses consistent layout:

Sidebar: Felix’s suggestions (Next Actions)

Main: Responsive grid with cards

Top Bar: Context-sensitive commands

4. 🧠 Interaction Design Principles
Principle	Description
Conversational Delegation	Every workflow expressible in plain English.
Contextual Surfacing	Felix only shows UI when relevant.
Reflective Transparency	Every action ends with a summary (“I replied to 3 reviews.”).
Progressive Disclosure	Simple chat first; deeper insight only when user asks.
Adaptive Tone	Felix matches user tone dynamically (friendly/professional).
5. 🎛 Design System Overview
Layer	Framework / Library	Purpose
Frontend	Next.js 14 (App Router)	Page & layout architecture
UI Kit	shadcn/ui + TailwindCSS	Cards, modals, typography
Animation	Framer Motion	Chat bubbles & fade transitions
Charting	Recharts	KPI visualizations
Icons	Lucide-react	Unified iconography
Theme	Tailwind theming w/ CSS vars	Light/Dark/System modes

Color Palette:

Primary: #1d4ed8 (blue)

Secondary: #0ea5e9 (sky)

Accent: #facc15 (gold — Felix highlight)

Neutrals: #f9fafb, #1f2937

Alerts: #dc2626 (error), #16a34a (success)

6. 🧩 Component Architecture & Directory Structure
/apps
 ├── felix-core/
 │   ├── orchestrator.ts
 │   ├── planner/
 │   ├── executor/
 │   ├── feedback/
 │   └── memory/
 ├── fieldflux-ui/
 │   ├── app/
 │   │   ├── dashboard/
 │   │   ├── leads/
 │   │   ├── reviews/
 │   │   ├── social/
 │   │   ├── analytics/
 │   │   └── ai-coach/
 │   ├── components/
 │   │   ├── chat/
 │   │   ├── cards/
 │   │   ├── charts/
 │   │   ├── navigation/
 │   │   └── ephemeral/
 │   ├── hooks/
 │   └── styles/
 ├── agentkit/
 │   ├── comms/
 │   ├── leads/
 │   ├── reviews/
 │   ├── social/
 │   ├── analytics/
 │   └── memory/
 ├── learningloop-adapter/
 │   ├── telemetry/
 │   ├── evaluators/
 │   ├── feedback/
 │   └── client.ts
 └── supabase/
     ├── migrations/
     ├── schemas/
     └── triggers/

7. 🧭 UX Scenarios & Interaction Journeys
Scenario 1 — “Inbound Lead Conversion”
1️⃣ Lead submitted via website form
2️⃣ Felix (background): capture_lead → enrich_lead → route_lead
3️⃣ Chat: “New lead from Downtown: AC repair. Route to Mike?”
4️⃣ User: “Yes”
5️⃣ Felix: “Done. Sent SMS to customer and booked Mike for 3PM.”
→ [TaskSummaryCard pops in, fades after 5s]

Scenario 2 — “Social Post Creation”
1️⃣ User: “Create a post about winter prep.”
2️⃣ Felix: “Got it. Here's one.”
→ [PostPreviewCard: editable caption + image]
3️⃣ User edits and hits confirm.
4️⃣ Felix: “Scheduled for 9AM tomorrow on FB + IG.”
→ [InsightCard next day: “Post reached +22% more engagement!”]

Scenario 3 — “Performance Insight Loop”
1️⃣ Analytics triggers anomaly: engagement ↓15%
2️⃣ Felix: “Hey — engagement dipped yesterday. Want to auto-optimize timing?”
→ [InsightCard: options “Yes / No / View Report”]
3️⃣ User: “Yes”
4️⃣ Felix: Adjusts posting schedule + logs improvement
5️⃣ Memory updates pattern for future reasoning

8. 🧩 Integration Hooks for LearningLoop

Each UI interaction emits ui_event telemetry:

{
  "agent": "Felix",
  "interaction": "approval_card_confirm",
  "module": "social",
  "duration_ms": 1800,
  "outcome": "approved"
}


LearningLoop evaluators score:

Responsiveness latency

User correction frequency

UI clarity satisfaction (inferred via feedback ratio)

This data helps Felix improve when and how he surfaces cards.

9. 🛡️ Accessibility & UX Safeguards
Concern	Mitigation
Cognitive overload	Minimal visible UI, conversational hierarchy
Accessibility	ARIA roles, keyboard shortcuts, voice compatibility
Mobile optimization	Bottom-sheet modal for ephemeral cards
Timeouts	UI auto-dismiss after 90s idle
Error feedback	Inline Toast + visual red highlight
User control	"Undo last action" ephemeral toast

10. 🧰 Optional Deliverables

✅ Design System Figma Kit

Component library (Cards, Chat Bubbles, Alerts, Charts)

Brand assets & motion specs (Framer variants)

✅ UI Component Library (Storybook)

Live previews of each card and chat interaction

✅ Developer API Docs (TypeDoc + Swagger)

AgentKit endpoint documentation

Telemetry payload reference

Orchestrator function contracts

✅ AI Behavior Profiles

YAML configs defining Felix tone/personality by client type (HVAC, Plumbing, Electrical)

Used by update_preferences() and LearningLoop evaluators

✅ Testing Suite

Integration tests (Playwright)

LLM reasoning trace QA (LearningLoop hooks)

🧠 UX Summary
Design Trait	Description
Conversational Core	Felix is the only visible “interface.”
Adaptive Feedback	Every UI element responds to behavior data.
Performance Transparency	All data flows through observable dashboards.
Low Friction	Single-tap confirmations, no deep menus.
Human-AI Synergy	Felix does the work; user stays in control.