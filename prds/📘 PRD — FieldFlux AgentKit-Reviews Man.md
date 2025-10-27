📘 PRD — FieldFlux AgentKit: Reviews Management Tools
1. Executive Summary

Purpose:
Enable Felix to autonomously manage all customer review workflows across platforms (Google, Facebook, Yelp, etc.).
This module will:

Continuously fetch and analyze reviews.

Detect sentiment patterns and alert the user.

Draft or post replies automatically based on tone and rules.

Solicit new reviews post-service via SMS and email (integrates with Comms Tools).

Send telemetry to LearningLoop for feedback scoring and behavior improvement.

Outcome:
Field service owners maintain strong online reputations without manually checking multiple platforms or crafting every reply.

2. Goals & Success Metrics
Goal	Metric
Automate review response workflow	≥ 85% of reviews handled without human input
Increase average review rating	+0.3 average star increase in 90 days
Reduce negative sentiment incidence	−20% negative reviews through proactive alerts
Improve review generation rate	+25% more new reviews from automated requests
Achieve full observability	100% of review actions logged to LearningLoop
3. Core Architecture
Felix Orchestrator
   ↕
Reviews Tools (fetch, analyze, reply, request)
   ↕
Platform APIs (Google, Facebook, Yelp)
   ↕
LearningLoop (telemetry, scoring, feedback)
   ↕
Supabase (reviews table, sentiment logs)

4. Functional Overview
Feature	Description	Trigger / Source
Fetch Reviews	Pull new reviews from connected platforms via APIs	Cron (hourly)
Analyze Sentiment	Detect tone, emotion, and key phrases using LLM models	Post-fetch
Reply to Review	Auto-respond or draft for approval	New review detected
Request Review	Triggered after job completion	send_sms / send_email from Comms
Flag Anomalies	Detect pattern of recurring complaints	LearningLoop evaluator signal
5. Detailed Tool Specifications
5.1 fetch_reviews

Purpose: Retrieve and normalize reviews from all connected platforms.

Inputs

{
  "platforms": ["google", "facebook"],
  "since": "2025-10-20T00:00:00Z"
}


Outputs

{
  "reviews": [
    {
      "id": "g_rev_123",
      "platform": "google",
      "rating": 5,
      "text": "Great service!",
      "author": "Mary K.",
      "timestamp": "2025-10-27T08:45:00Z"
    }
  ]
}


Database Tables:

reviews_raw

reviews_normalized

Telemetry:
Log new review counts, average rating, platform ratio.

5.2 analyze_sentiment

Purpose: Classify review tone and extract key topics.

Inputs

{ "review_id": "g_rev_123", "text": "Great service and quick response!" }


Outputs

{
  "sentiment": "positive",
  "confidence": 0.94,
  "themes": ["speed", "service quality"]
}


Model: GPT-4 / Claude sentiment classifier
Telemetry: Sentiment distribution, recurring topics

5.3 reply_review

Purpose: Draft or send responses automatically.

Modes:

Auto-reply: Positive or neutral reviews (no approval)

Approve-first: Negative or mixed sentiment

Inputs

{
  "review_id": "g_rev_456",
  "sentiment": "negative",
  "tone": "empathetic",
  "personalization": { "customer_name": "Alex" },
  "approval_required": true
}


Outputs

{ "status": "drafted", "reply": "Alex, thank you for the feedback..." }


External APIs: Google My Business, Facebook Graph
Telemetry: Response latency, sentiment delta post-reply

5.4 request_review

Purpose: Solicit new reviews after service completion.
Uses Comms Tool (send_sms / send_email) to deliver link.

Inputs

{
  "customer_id": "cust_245",
  "platforms": ["google"],
  "trigger_event": "job_complete",
  "delay_hours": 2
}


Outputs

{ "status": "queued", "links_sent": 1 }


LearningLoop Metrics:

Request → Review Conversion Rate

Platform Distribution

5.5 flag_anomaly

Purpose: Identify recurring negative themes or sudden drops in sentiment.
Triggered by LearningLoop evaluator or batch analyzer.

Outputs

{
  "alert": "Recurring issue detected: 'slow response time'",
  "occurrences": 3,
  "time_window_days": 7
}


UI Action: Felix notifies user → “Want me to address this in next post or training note?”

6. Ephemeral UI Components
Component	Purpose
ReviewListCard	Scrollable list of latest reviews with sentiment icons
ReplyPreviewCard	Editable draft before posting
SentimentSummaryWidget	Charts weekly sentiment shifts
AnomalyAlertCard	Pops up when patterns detected
7. LearningLoop Integration

Every review event emits telemetry:

{
  "agent": "Felix",
  "tool": "reply_review",
  "context": { "client_id": "winter-haven-air", "platform": "google" },
  "input": { "sentiment": "negative" },
  "output": { "status": "posted" },
  "metrics": { "response_time_min": 12, "sentiment_shift": +0.3 },
  "timestamp": "2025-10-27T13:30Z"
}


Evaluators:

Response latency

Sentiment improvement

Customer engagement post-reply

Feedback:
LearningLoop tunes Felix’s tone and escalation thresholds (e.g., “auto-reply to mild negatives”).

8. Safety & Governance
Rule	Enforcement
Approval required for <3-star reviews	Ephemeral UI confirmation
Replies must avoid sensitive data	Regex + LLM content filter
Audit trail for all replies	Logged in review_logs
Escalation threshold	Alert if ≥3 negatives in 48h
9. Implementation Roadmap
Phase	Deliverable	Duration
1	Platform API connectors (Google, Facebook)	1 week
2	Sentiment analysis + anomaly detection	1 week
3	Auto-reply + approval flow	1 week
4	Review request automation + LearningLoop feed	1 week
5	UI components (cards, alerts, analytics widgets)	1 week

Total: ~5 weeks

10. Dependencies

Google Business Profile API

Facebook Graph API

Supabase (reviews storage)

Comms Tools for outbound review requests

LearningLoop evaluators (sentiment_scoring, response_effectiveness)

11. Risks & Mitigations
Risk	Mitigation
API quota limits	Cache and stagger polling intervals
Inaccurate sentiment classification	Confidence threshold + human override
Negative public reply errors	Approval gate + templated fallback
Multi-platform sync lag	Timestamp deduplication by review_id
12. Deliverables Checklist

✅ AgentKit definitions (fetch_reviews, analyze_sentiment, reply_review, request_review, flag_anomaly)
✅ API integrations
✅ Database schemas
✅ LearningLoop telemetry feed
✅ Ephemeral UI components
✅ QA and sandbox environment