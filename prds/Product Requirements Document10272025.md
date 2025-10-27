Product Requirements Document
FieldFlux: Felix Agent-First Transformation (v2.0)
1. Executive Summary

Objective:
Redesign Felix from a chat-style advisor into an autonomous marketing operator that executes tasks, learns from outcomes, and communicates through an ephemeral conversational UI.

Vision:

FieldFlux becomes the first agentic marketing OS for field service providers — a system that thinks, acts, and improves instead of a dashboard that waits for clicks.

2. Goals & Success Metrics
Goal	Metric
Replace static dashboard flows with agentic interaction	≥ 80% of actions initiated through Felix chat
Achieve autonomous execution of low-risk tasks	100% of routine posts, follow-ups, and review replies automated
Close the Learning Loop	Real-time telemetry + outcome scoring via LearningLoop.tech
Reduce user setup & navigation time	≥ 60% reduction in average task time
Improve marketing KPIs	+20% avg engagement, +15% lead conversion over 60 days
3. Core Architecture
Frontend (Ephemeral UI Layer)
     ↕
Felix Orchestrator (Reasoning + Context Engine)
     ↕
AgentKit Tool Layer (Action Modules)
     ↕
LearningLoop Telemetry Layer (Observability + Adaptation)
     ↕
FieldFlux Data Stores (Leads, Reviews, Social, Analytics)

4. Felix Orchestrator

Responsibilities

Parse user intent → map to AgentKit functions.

Maintain multi-turn reasoning (stateful memory).

Request UI elements (cards, buttons, confirmations) as needed.

Send telemetry events to LearningLoop after every action.

Retrieve context from memory and FieldFlux data APIs.

Tech

Node.js/TypeScript orchestrator service

OpenAI/Anthropic model API access

Context store (Supabase/Postgres)

Event bus → LearningLoop ingestion API

5. AgentKit Tool Layer

Each tool = independently callable function registered with Felix.
All tools share a common schema:

interface AgentTool {
  name: string;
  description: string;
  inputSchema: JSONSchema;
  outputSchema: JSONSchema;
  execute: (params, context) => Promise<T>;
  telemetry: (result, context) => LearningLoopEvent;
}

Core Tools
Category	Tool	Description
Social	generate_post_copy, publish_post, schedule_campaign	Content ideation, publishing, scheduling
Leads	capture_lead, route_lead, follow_up	Intake & nurturing
Reviews	fetch_reviews, analyze_sentiment, reply_review	Cross-platform reputation management
Comms	send_sms, send_email, respond_inquiry	Automated communication
Analytics	generate_report, detect_trends, surface_anomalies	Continuous marketing observability
Memory	store_interaction, retrieve_context, update_preferences	Long-term personalization
6. Ephemeral UI (Front-End)

Pattern:
Felix is the permanent anchor. UI components surface contextually and dissolve after completion.

Components

ActionCard: for posts/reviews/leads

ConfirmationDialog: user approvals

QuickMetricsStrip: transient stats summary

ProgressToast: shows action status

Tech

React 18 + shadcn/ui

Socket connection to Felix Orchestrator

Context-aware component renderer (renders cards from agent prompts)

7. LearningLoop Integration

Purpose: Provide observability, scoring, and adaptive feedback.

Event Payload

{
  "agent": "Felix",
  "tool": "publish_post",
  "client": "winter-haven-air",
  "inputs": { "channel": "facebook", "tone": "friendly" },
  "outputs": { "success": true, "id": "fb_1234" },
  "metrics": { "engagement_rate": 0.83 },
  "timestamp": "2025-10-27T12:45:00Z"
}


APIs Used

POST /api/events → send telemetry

GET /api/evaluations/:clientId → fetch scored insights

WebSocket feed for live metric updates

Feedback Loop

Felix emits event → LearningLoop logs & scores.

Evaluators compute success/failure & deltas.

LearningLoop returns signals → memory updates (tone, timing, channel).

Felix reasoning weights updated → improved future choices.

8. Memory & Context Management

Short-Term (session):
User intent, current actions, confirmation status.

Mid-Term (30 days):
Action history, post performance, tone preferences.

Long-Term:
Business rhythm patterns (seasonal), success heuristics from LearningLoop.

Storage: Supabase JSONB tables + pgvector for embeddings.

9. Autonomy & Safety Rules
Action Type	Execution Mode	Safety Requirement
Review Reply (positive)	Auto	none
Review Reply (negative)	Approve-first	must show user card
Social Post	Approve-first (can toggle full auto)	preview + confirm
SMS/Email Follow-up	Auto with cooldown	limit: 2/day/customer
Analytics Reports	Auto	periodic summary only
10. Implementation Phases
Phase 1 — Foundation (Weeks 1-3)

Build Orchestrator service skeleton

Register AgentKit tools with mock outputs

Connect to LearningLoop ingestion API

Render ephemeral UI components

Phase 2 — Execution (Weeks 4-6)

Implement real API integrations (Meta, Google, Twilio)

Add approval safety workflows

Establish telemetry feedback routes

Phase 3 — Intelligence (Weeks 7-10)

Add evaluators + scoring in LearningLoop

Implement preference learning (memory updates)

Adaptive reasoning per client

Phase 4 — Observability & QA (Weeks 11-12)

Build Felix QA dashboard (action log + score trend)

Conduct HITL validation cycles with real users

11. Developer Deliverables
Area	Deliverable
Backend	felix-orchestrator service (Node/TypeScript)
Frontend	Ephemeral UI component library
Integration	LearningLoop event & scoring pipeline
Database	Context + memory tables
API	REST + WebSocket endpoints for agent actions
QA	Internal dashboard for reasoning trace review
12. Security & Compliance

OAuth for channel integrations (Facebook, Google, LinkedIn).

Supabase Row Level Security for client data isolation.

Log redaction for PII in telemetry events.

Signed webhook verification for LearningLoop callbacks.

13. Future Enhancements

Voice interface for mobile field techs.

GPT-4/Claude hybrid orchestration for reasoning variance.

Dynamic pricing/recommendations via predictive analytics.

Plugin marketplace (custom automations per trade vertical).

Summary:
This PRD re-casts FieldFlux as an agent-driven marketing platform. Felix becomes the single point of interaction; the dashboard evolves into a contextual mirror.
LearningLoop powers continuous optimization — the product literally learns from its own behavior.