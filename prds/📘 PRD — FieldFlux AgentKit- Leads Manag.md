📘 PRD — FieldFlux AgentKit: Leads Management Tools
1. Executive Summary

Purpose:
Transform lead handling from manual CRM entry into an autonomous, real-time system.
Felix will capture, route, and nurture leads automatically, ensuring no inquiry slips through the cracks.

Scope:

Capture inbound leads from forms, calls, ads, chat, and imports

Qualify and enrich leads (source, urgency, service type)

Route to the right technician or salesperson

Schedule follow-ups (SMS / email)

Record telemetry for LearningLoop scoring (speed-to-lead, conversion probability, response effectiveness)

2. Goals & Success Metrics
Goal	Metric
Automate lead capture	≥ 95 % of leads auto-ingested into CRM
Reduce response latency	≤ 5 min average first contact
Increase lead → customer conversion	+ 20 % in 90 days
Full traceability	100 % telemetry coverage in LearningLoop
Improve follow-up compliance	≥ 90 % of unreached leads re-contacted
3. Core Architecture
Inbound Sources (Web, Ads, Phone, Integrations)
  ↓
Felix Orchestrator
  ↓
Leads Tools (capture, route, follow-up)
  ↓
Comms Tools (SMS / Email)
  ↓
LearningLoop Telemetry + Scoring
  ↓
Supabase Leads DB + CRM Sync

4. Functional Overview
Feature	Description	Trigger / Source
Capture Lead	Parse incoming form / API data, create lead record	Webhook, Ad form, Landing page
Enrich Lead	Detect service type, urgency, region	Post-capture
Route Lead	Assign to tech or sales based on availability	On capture
Follow-Up Lead	Auto-send text / email if no response in X hrs	Timer
Score Lead	LearningLoop evaluates conversion probability	Post-interaction
5. Detailed Tool Specifications
5.1 capture_lead

Purpose: Normalize and record any inbound lead.

Inputs

{
  "source": "google_ads",
  "payload": {
    "name": "John Doe",
    "phone": "+18505551234",
    "email": "john@example.com",
    "service": "AC Repair",
    "message": "Need same-day service"
  }
}


Outputs

{
  "lead_id": "lead_54321",
  "priority": "high",
  "assigned_to": null,
  "status": "new"
}


Database: leads_raw, leads_enriched
Telemetry: capture source, time-to-create (sec)

5.2 enrich_lead

Purpose: Apply basic qualification and context enrichment.

Logic

LLM classifies intent (“repair”, “install”, “maintenance”)

Geo-lookup via zip → service zone

Urgency tag based on text keywords (“ASAP”, “leaking”, etc.)

Outputs

{
  "lead_id": "lead_54321",
  "service_type": "repair",
  "urgency": "high",
  "region": "Downtown",
  "confidence": 0.91
}

5.3 route_lead

Purpose: Assign lead to the best technician or sales rep.

Inputs

{
  "lead_id": "lead_54321",
  "criteria": { "region": "Downtown", "skill": "HVAC" }
}


Outputs

{
  "assigned_to": "tech_204",
  "contact_method": "sms",
  "status": "assigned"
}


Integration: FieldFlux Technician availability API
Telemetry: assignment latency (sec)

5.4 follow_up_lead

Purpose: Re-engage unresponsive prospects.

Trigger: If no response within X hours (post-route)

Inputs

{
  "lead_id": "lead_54321",
  "channel": "sms",
  "template_id": "follow_up_24h"
}


Outputs

{ "status": "sent", "message_id": "sms_9284" }


Telemetry: response rate, conversion vs. follow-up time.

5.5 score_lead

Purpose: Predict conversion likelihood using LearningLoop data.
Inputs = lead attributes + historical performance.
Outputs = probability (0–1) + recommended next action.

{
  "lead_id": "lead_54321",
  "score": 0.82,
  "recommendation": "Schedule tech call within 2 hrs"
}

6. Ephemeral UI Components
Component	Purpose
LeadCard	Displays lead info + priority + action buttons
AssignmentCard	Inline view to change tech or re-route
FollowUpCard	Shows pending contacts + quick SMS templates
LeadInsightsWidget	Conversion probability + LearningLoop trend graph
7. LearningLoop Integration

Every lead event emits structured telemetry:

{
  "agent": "Felix",
  "tool": "route_lead",
  "context": { "client_id": "winter-haven-air" },
  "input": { "region": "Downtown", "urgency": "high" },
  "output": { "assigned_to": "tech_204" },
  "metrics": { "assignment_latency": 42 },
  "timestamp": "2025-10-27T13:45Z"
}


Evaluators

Speed-to-lead

Follow-up success rate

Conversion score accuracy

Feedback
LearningLoop adjusts lead-priority weightings and follow-up timing.

8. Safety & Governance
Rule	Enforcement
Duplicate lead detection	Email + phone hash match before create
PII protection	Mask before telemetry export
Assignment limits	Max 10 open leads per tech
Manual override	Ephemeral UI approval button
9. Implementation Roadmap
Phase	Deliverable	Duration
1	Lead capture API + Supabase schema	1 week
2	Enrichment engine + LearningLoop feed	1 week
3	Routing logic + technician API integration	1 week
4	Follow-up + Comms tool hooks	1 week
5	Lead scoring + UI components	1 week

Total: ~5 weeks to production.

10. Dependencies

Comms Tools (SMS/Email)

Technician availability API

Supabase lead tables + indexes

LearningLoop evaluators (lead_latency, conversion_rate)

11. Risks & Mitigations
Risk	Mitigation
Duplicate submissions	Hash + throttle API
Unreachable contacts	Validate numbers / emails
Overloaded technicians	Dynamic assignment cap
False positive priority	LLM confidence threshold > 0.8
12. Deliverables Checklist

✅ AgentKit definitions (capture_lead, enrich_lead, route_lead, follow_up_lead, score_lead)
✅ Supabase schemas + API endpoints
✅ LearningLoop telemetry feed + evaluators
✅ Ephemeral UI cards for lead workflow
✅ QA + sandbox demo scripts