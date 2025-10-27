📘 PRD — FieldFlux AgentKit: Analytics & Insights Tools
1. Executive Summary

Purpose
Give Felix continuous situational awareness and the ability to explain why things happen in marketing.
Analytics Tools transform fragmented metrics into stories, alerts, and adaptive signals for every agent module (Leads, Reviews, Social, Comms).

Scope

Real-time metric ingestion and correlation

Trend, anomaly, and opportunity detection

Automated reports and conversational summaries

LearningLoop telemetry ingestion and evaluator feedback

Data → behavior loops (insight → action → validation)

Outcome
Every FieldFlux user sees one narrative feed of performance, generated and updated by Felix himself.

2. Goals & Success Metrics
Goal	Metric
Centralize marketing analytics	100 % of data flow through Analytics API
Automate insight generation	≥ 80 % of weekly reports LLM-authored
Improve response time to issues	< 1 hr from anomaly to alert
Adaptive learning efficiency	+25 % precision in LearningLoop recommendations
Cross-module feedback loop	All modules emit & consume Analytics signals
3. Core Architecture
Data Sources (Social, Leads, Reviews, Comms)
      ↓
Analytics Collector API
      ↓
Analytics Tools (generate_report, detect_trends, surface_anomalies)
      ↓
LearningLoop Evaluators & Feedback
      ↓
Felix Orchestrator (Insight Reasoning)
      ↓
Ephemeral UI (Reports, Charts, Alerts)

4. Functional Overview
Tool	Purpose	Trigger
generate_report	Summarize performance for period	Scheduled / User request
detect_trends	Identify positive/negative momentum	Hourly batch
surface_anomalies	Alert for outliers or drops	Event-driven
correlate_signals	Relate metrics across domains	Evaluator pipeline
forecast_performance	Predict next cycle metrics	Weekly batch
5. Detailed Tool Specifications
5.1 generate_report

Inputs

{ "range": "last_7_days", "channels": ["social", "leads", "reviews"] }


Outputs

{
  "summary": "Leads ↑12 %, Engagement steady, Reviews +0.2⭐",
  "metrics": {
    "total_leads": 247,
    "engagement_rate": 0.873,
    "avg_rating": 4.8
  },
  "insights": ["Fall-campaign lifted reach by 15 %"]
}


Features

Auto-generated narrative paragraphs

LLM-driven plain-English explanations

Export PDF/HTML for email delivery
Telemetry: generation latency, metric variance, report consumption rate

5.2 detect_trends

Compares time-series signals to previous periods.
Output

{ "metric": "engagement_rate", "direction": "up", "delta": 0.15 }


LearningLoop Metrics: trend strength, seasonal pattern confidence

5.3 surface_anomalies

LLM detects outliers and contextual reasons.
Example Insight:

“Engagement on Instagram fell 18 % Monday after posting off-season content.”
Telemetry: anomaly score, alert response time

5.4 correlate_signals

Maps relationships between events (e.g., review sentiment ↔ lead conversion).
Output

{
  "correlation": "negative",
  "between": ["response_time", "review_rating"],
  "r_value": -0.63
}


Used by Felix to propose cross-module actions:

“Reducing reply time could raise ratings 0.4 ⭐.”

5.5 forecast_performance

Predicts next period metrics with time-series model.
Outputs

{ "metric": "lead_volume", "predicted_value": 260, "confidence": 0.87 }


LearningLoop feeds actual results back for model tuning.

6. Ephemeral UI Components
Component	Purpose
InsightFeedCard	Daily digest of key insights (“Leads ↑ 12 %”)
AnomalyAlertCard	Real-time notifications with action buttons
TrendChartWidget	Sparkline visualization for top metrics
PerformanceReportView	PDF/HTML report with export options
7. LearningLoop Integration

Example telemetry:

{
  "agent": "Felix",
  "tool": "detect_trends",
  "context": { "client_id": "winter-haven-air" },
  "metrics": {
    "metric": "conversion_rate",
    "trend_direction": "up",
    "delta": 0.05
  },
  "timestamp": "2025-10-27T16:00Z"
}


Evaluators

signal_confidence

anomaly_accuracy

prediction_error

insight_value_score

Feedback
LearningLoop weights metric importance and improves alert thresholds.

8. Safety & Governance
Rule	Enforcement
Data retention	90-day rolling window per client
PII scrubbing	All telemetry anonymized
Rate limits	Max 1 insight per metric per hour
Approval before publishing external reports	Ephemeral UI confirmation
9. Implementation Roadmap
Phase	Deliverable	Duration
1	Collector API + Supabase schema (metrics_raw, insights)	1 week
2	Report & Trend engines + LearningLoop hooks	1 week
3	Anomaly + Correlation detectors	1 week
4	Forecast module + Evaluator feedback	1 week
5	Ephemeral UI dashboards	1 week

Total: ≈ 5 weeks to production.

10. Dependencies

Inputs from Social, Leads, Reviews, Comms modules

LearningLoop evaluators (trend_accuracy, insight_value)

Supabase (time-series metrics store)

Charting library (React + Recharts)

11. Risks & Mitigations
Risk	Mitigation
Data gaps from API outages	Backfill scheduler + averaging
False positives in anomaly detection	Confidence threshold > 0.8
LLM hallucination in reports	Cross-check with numeric data
Slow queries on large data sets	Materialized views + indexing
12. Deliverables Checklist

✅ AgentKit definitions (generate_report, detect_trends, surface_anomalies, correlate_signals, forecast_performance)
✅ Collector API + Supabase schemas
✅ LearningLoop telemetry + evaluators
✅ Ephemeral UI widgets and dashboards
✅ QA + sandbox dataset