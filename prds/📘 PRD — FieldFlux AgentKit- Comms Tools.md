📘 PRD — FieldFlux AgentKit: Comms Tools (SMS + Email)
1. Executive Summary

Purpose:
Enable Felix to autonomously manage customer communication through SMS and email for core field service interactions:

Appointment scheduling

Technician arrival notifications

Post-service follow-ups

Review requests and promotions

Outcome:
Technicians and office staff no longer manually send texts or emails. Customers are automatically informed, reminded, and followed-up based on service lifecycle events — with every message tracked and evaluated through LearningLoop.

2. Goals & Success Metrics
Goal	Success Metric
Automate 90%+ of customer messaging	≥ 90% of job-linked messages auto-sent via Felix
Improve customer response rate	+25% response to confirmations and follow-ups
Reduce missed appointments	−40% no-show rate
Collect more reviews	+20% reviews generated via automated follow-up
Enable LearningLoop scoring	100% telemetry events logged per message
3. Core Architecture
Felix Orchestrator
   ↕
Comms Tools (SMS + Email)
   ↕
Event Triggers (Job Scheduling, Tech Dispatch, Completion)
   ↕
LearningLoop Telemetry Layer
   ↕
Supabase (Messages, Templates, Job Context)

4. Functional Overview
4.1 Event-Driven Messaging Flow
Event	Trigger Source	Tool Invoked	Message Type	Example
Job Created	CRM / Lead intake	schedule_sms	Appointment confirmation	“Your HVAC appointment is booked for Tue 2 PM.”
Tech On Route	Dispatch system	send_sms	Arrival notification	“Jim from Winter Haven Air is en route—ETA 10:45 AM.”
Job Completed	Field app / API	schedule_sms	Post-service follow-up	“Thanks for choosing us! Rate your experience here.”
Review Request	Completion + 1 day	send_sms + send_email	Review solicitation	“We’d love feedback—tap to leave a review.”
Seasonal Promo	Marketing calendar	schedule_email	Campaign push	“Winter tune-up special — 20% off this week.”
5. Detailed Tool Specifications
5.1 send_sms

Purpose: Real-time or scheduled text message dispatch.

Inputs

{
  "recipient_phone": "+18505551234",
  "template_id": "tech_arrival_notice",
  "variables": { "tech_name": "Jim", "eta": "10:45 AM" },
  "send_at": "2025-10-27T10:30:00Z"
}


Outputs

{
  "status": "sent",
  "message_id": "sms_8934",
  "delivered": true,
  "timestamp": "2025-10-27T10:30:02Z"
}


External Services

Twilio / MessageBird for transport

Supabase table sms_logs for persistence

Telemetry

{
  "agent": "Felix",
  "tool": "send_sms",
  "metrics": { "delivered": true, "response_time_ms": 2400 }
}

5.2 schedule_sms

Purpose: Queue and manage time-based or event-based SMS jobs.

Key Features

Accepts one-time or recurring schedules

Supports conditional triggers (e.g., “send follow-up 2 hrs after job_complete”)

Cancels automatically if job status changes (e.g., cancelled job)

Database Tables

scheduled_messages: id, customer_id, trigger_event, template_id, send_at, status

Telemetry Metrics

Sent / Delivered / Failed counts

Response rate within X hours

5.3 send_email

Purpose: Multi-channel email dispatch for confirmations, promotions, and follow-ups.

Inputs

{
  "recipient_email": "mary@example.com",
  "template_id": "post_service_followup",
  "variables": { "customer_name": "Mary", "service": "HVAC tune-up" },
  "attachments": [],
  "send_at": "2025-10-27T12:00:00Z"
}


Outputs

{
  "status": "queued",
  "message_id": "email_5623",
  "open_rate": null,
  "click_rate": null
}


Providers: Resend / SendGrid
Database: email_logs table
Telemetry: opens, clicks, unsubscribes

6. Ephemeral UI Components
Component	Purpose
MessagePreviewCard	Shows message + variables before sending (for approval workflows).
MessageHistoryPanel	Displays past interactions with a customer.
ScheduleCard	Lets user adjust send time inline in chat.

All components generated dynamically via Felix orchestration.

7. LearningLoop Integration

Every message dispatch emits a telemetry payload:

{
  "agent": "Felix",
  "tool": "send_sms",
  "context": { "client_id": "winter-haven-air", "event": "job_complete" },
  "output": { "delivered": true },
  "metrics": {
    "response_rate": 0.72,
    "review_conversion": 0.18
  },
  "timestamp": "2025-10-27T13:00Z"
}


Evaluators:

Message Delivery Success

Response Rate

Review Conversion

Feedback:
LearningLoop adjusts optimal send windows, templates, and tone weightings.

8. Safety, Compliance & Settings
Area	Rule
Opt-In / Opt-Out	Manage via /unsubscribe endpoint; auto-respect “STOP” SMS.
Rate Limiting	Max 2 SMS per customer per day.
Scheduling Window	8 AM – 8 PM local time only.
Approval Mode	Optional “approve before send” for certain message types.
Audit Trail	All sends stored with timestamp + template + user context.
9. Implementation Roadmap
Phase	Deliverable	Duration
1	Twilio + Resend integrations, Supabase schemas	1 week
2	Orchestrator hooks (send_sms, send_email, schedule_sms)	1 week
3	Event trigger engine (job lifecycle)	1 week
4	LearningLoop telemetry feed + evaluators	1 week
5	UI cards (preview, scheduler)	1 week

Total: ~5 weeks to production.

10. Dependencies

Twilio / MessageBird SMS API

SendGrid / Resend email API

Supabase or Postgres

LearningLoop API endpoints

FieldFlux Job / Customer tables

11. Risks & Mitigations
Risk	Mitigation
API quota or carrier blocking	Rate-limit + exponential retry
Message duplication	Deduplication by job_id + message_type
Incorrect personalization	Strict template variable validation
Compliance violations	Built-in quiet hours + unsubscribe logic
12. Deliverables Checklist

✅ AgentKit tool definitions (send_sms, schedule_sms, send_email)
✅ API endpoints & schemas
✅ Supabase tables + migrations
✅ Ephemeral UI cards
✅ Telemetry pipeline → LearningLoop
✅ QA instrumentation & logging