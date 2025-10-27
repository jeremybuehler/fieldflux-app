🧰 FieldFlux AgentKit — Tool Specification Layer

Each tool is a micro-service-style module with:

interface AgentTool {
  name: string;
  category: "social" | "leads" | "reviews" | "comms" | "analytics" | "memory";
  description: string;
  inputs: JSONSchema;
  outputs: JSONSchema;
  execute: (params, context) => Promise<Result>;
  telemetry: (result, context) => LearningLoopEvent;
}

1. Comms Tools (SMS / Email / Notifications)

Felix uses these to engage and update customers automatically.
They run off event triggers (job scheduled, tech on route, job complete).

1.1 SMS Toolset
send_sms

Purpose: Core SMS dispatch utility.
Trigger sources: manual (user), automated (scheduler, event hooks).
Inputs:

{
  "recipient_phone": "+18505551234",
  "template_id": "tech_arrival_notice",
  "variables": { "tech_name": "Jim", "eta": "10:45 AM" },
  "send_at": "2025-10-27T10:30:00Z"
}


Outputs:

{ "status": "sent", "message_id": "sms_8934", "delivered": true }


Telemetry: Sent/delivered timestamps, click-through (if link).

schedule_sms

Purpose: Batch or recurring message scheduling (e.g. next-day reminders).
Variants:

Scheduled Messages: “Maintenance appointment tomorrow”

Tech Arrival Timing Text: triggered when job changes to “On Route.”

Post-Service Follow-Up: sent 1–3 hrs after job marked complete.
Data Dependencies: FieldFlux Jobs table → job_status, technician_name, scheduled_time.

LearningLoop Metrics:

Delivery rate

Response rate

Conversion (review received / lead booked)

send_email

Identical structure to send_sms but uses SendGrid or Resend.
Templates stored in /templates/email/.
Telemetry includes open/click metrics.

2. Reviews Management Tools

Felix’s “ReputationOps” brain.

2.1 fetch_reviews

Pulls latest reviews from connected platforms.
Inputs: { "platforms": ["google", "facebook"], "since": "2025-10-20" }
Outputs: list of reviews w/ metadata (rating, sentiment, keywords).

2.2 analyze_sentiment

LLM classifier assigns tone + emotion labels.
Outputs sentiment distribution, top themes, anomalies.

2.3 reply_review

Modes:

Auto (positive reviews)

Semi-auto (negative → request approval)
Inputs:

{
  "review_id": "g_rev_789",
  "sentiment": "negative",
  "tone": "empathetic",
  "personalization": { "customer_name": "Mary" },
  "approval_required": true
}


Outputs: "reply_drafted" | "posted"
Telemetry: Sentiment improvement, response time.

2.4 request_review

Triggered by job completion event.

Sends SMS or email with Google/Yelp link.

Tracks conversion: request → review posted.
Learning metric: Review generation rate.

3. Leads Tools
3.1 capture_lead

Forms or inbound channel ingestion.
Parses: name, service_type, source, urgency, message.

3.2 route_lead

Decides who gets the lead based on location, skill, availability.
Uses get_technician_availability → sends SMS/email assignment.

3.3 follow_up_lead

If lead hasn’t responded within X hours, auto-text/email.
Learning metric: Response conversion vs. channel/time.

4. Social Tools
4.1 generate_post_copy

LLM-based content generation given prompt or context.
Inputs: { "topic": "HVAC fall maintenance", "tone": "friendly" }.

4.2 publish_post

Connects to Facebook/Instagram/Threads/LinkedIn via OAuth tokens.
Accepts multi-channel payloads and scheduling time.
Telemetry: engagement metrics, posting success, platform reach.

4.3 schedule_campaign

Handles campaign sequences (e.g., “3 posts per week for October”).
Integrates with LearningLoop to optimize timing.

5. Analytics Tools
5.1 generate_report

Compiles KPIs across leads, reviews, socials.
Scheduled weekly or on demand.

5.2 detect_trends

Uses LearningLoop metrics + internal logs to find anomalies:

“Engagement down 15% vs. last month on Instagram.”

5.3 surface_anomalies

Triggers Felix to message user:

“3 reviews mention ‘slow response time’ this week — want me to address that?”

6. Memory & Context Tools
6.1 store_interaction

Logs user/agent conversations, actions, and outcomes to Supabase.

6.2 retrieve_context

Fetches relevant memory entries when Felix reasons.

6.3 update_preferences

Adjusts tone, channel, or scheduling based on user approval feedback.

7. LearningLoop Event Contract

All tools push event data to LearningLoop using this schema:

{
  "agent": "Felix",
  "tool": "send_sms",
  "context": { "client_id": "winter-haven-air", "business_type": "HVAC" },
  "input": { "template": "follow_up", "send_at": "2025-10-27T13:00Z" },
  "output": { "success": true },
  "metrics": { "response_rate": 0.64 },
  "timestamp": "2025-10-27T13:15Z"
}


Evaluators within LearningLoop compute:

score.success_probability

score.engagement_value

score.sentiment_delta

Those feed back into Felix’s adaptive memory.

8. Tool Execution Flow

Trigger: user request, event hook, or schedule.

Orchestrator reasoning: decide which tool(s) to invoke.

Tool execute() — performs API call or DB update.

Telemetry emit() — sends results to LearningLoop.

Evaluation feedback — LearningLoop adjusts Felix’s heuristics.

9. Immediate Dev Priorities (Phase 1)

Implement Comms Tools:

send_sms, schedule_sms, send_email

Event triggers: job_scheduled, tech_on_route, job_complete

Implement Reviews Tools:

fetch_reviews, reply_review, request_review

Google Business Profile + LearningLoop feedback scoring

Connect to LearningLoop ingestion endpoint

Telemetry per tool execution

Create Ephemeral UI Cards

SMS preview, Review reply preview, Post confirmation