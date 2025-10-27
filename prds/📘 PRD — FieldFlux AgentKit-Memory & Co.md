📘 PRD — FieldFlux AgentKit: Memory & Context Layer
1. Executive Summary

Purpose
Establish a structured memory system that enables Felix to maintain context over time — remembering client details, tone preferences, seasonal trends, and past outcomes — to deliver continuously personalized and improving performance.

Scope

Multi-tiered memory (short-, mid-, long-term)

Context persistence across sessions and agents

Event-based memory updates from all other modules (Leads, Reviews, Social, Comms, Analytics)

Bi-directional LearningLoop sync for memory reinforcement

Privacy and retention compliance

Outcome
Felix evolves from a stateless chatbot into an adaptive marketing intelligence system that “knows” each business like a loyal account manager.

2. Goals & Success Metrics
Goal	Metric
Persistent personalization	100% context retrieval accuracy per user
Continuous learning loop	100% of telemetry events stored & indexed
Reduce repetitive queries	≥ 70% fewer re-asks of previously answered items
Adaptive tone/style alignment	≥ 85% alignment score per LearningLoop evaluator
Real-time recall	< 250ms average memory fetch latency
3. Core Architecture
Felix Orchestrator
    ↕
Memory & Context Layer
    ↕
LearningLoop (feedback + evaluation signals)
    ↕
Supabase (context_store, memory_store, embeddings)
    ↕
Other Modules (Leads, Reviews, Social, Analytics)

4. Memory Types & Lifecycles
Memory Tier	Duration	Purpose	Storage
Short-Term	Session only	Current chat context, ongoing task	In-memory (Redis / local cache)
Mid-Term	30 days	Recent interactions, preferences, campaign data	Supabase JSONB
Long-Term	Indefinite (opt-outable)	Learned behaviors, seasonal patterns, success heuristics	pgvector embeddings + summaries
5. Functional Overview
Function	Description
store_interaction	Log every task, message, and outcome
retrieve_context	Fetch context relevant to current request
update_preferences	Adjust tone, style, or behavior rules
summarize_history	Compress session memory into long-term summary
forget_context	Manually delete specific records for compliance
learning_sync	Ingest LearningLoop evaluation results to update memory weights
6. Detailed Tool Specifications
6.1 store_interaction

Purpose:
Persist every relevant user-agent interaction or action Felix takes.

Inputs

{
  "interaction_type": "review_reply",
  "content": "Thanks for the kind words, Mary!",
  "metadata": { "sentiment": "positive", "platform": "google" },
  "outcome": "posted",
  "timestamp": "2025-10-27T15:45Z"
}


Outputs

{ "status": "stored", "memory_id": "mem_4738" }


Telemetry: logged to LearningLoop as event + outcome.

6.2 retrieve_context

Purpose:
Fetch relevant past actions or facts to inform new reasoning.

Inputs

{ "query": "customer sentiment last 30 days" }


Outputs

{
  "context_summary": "18 reviews, avg 4.8⭐, 92% positive",
  "related_actions": ["replied_to_5_negative_reviews"]
}


Mechanism:

Query vector embeddings via pgvector

Rank by semantic similarity + recency

6.3 update_preferences

Purpose:
Adjust personalization based on user approvals, tone analysis, or explicit requests.

Inputs

{
  "user_id": "client_001",
  "preference_type": "tone",
  "value": "friendly-professional"
}


Outputs

{ "status": "updated", "scope": "global" }


LearningLoop feedback:
Logs tone effectiveness → updates preference confidence weighting.

6.4 summarize_history

Purpose:
Generate long-term summaries from accumulated interactions for efficiency.
Process:

Aggregate last 30 days of logs

Compress via LLM into semantic summary

Store as vector embedding in long_term_memory

Output Example

{
  "summary": "Customer prefers empathetic tone, highest engagement from morning posts, negative reviews drop after proactive SMS follow-up."
}

6.5 forget_context

Purpose:
Enable users to remove stored data.
Implements compliance (GDPR/CCPA equivalent).

Inputs

{ "scope": "customer_id", "value": "cust_238" }


Deletes from all memory tiers and LearningLoop references.

6.6 learning_sync

Purpose:
Receive feedback from LearningLoop evaluators and update long-term weights.

Example Feedback Event

{
  "agent": "Felix",
  "signal_type": "tone_performance",
  "metric": 0.92,
  "context_ref": "post_184",
  "recommendation": "maintain current tone"
}


Updates preference model in-memory and persists summary.

7. Ephemeral UI Components
Component	Purpose
MemoryInspectorPanel	Shows what Felix remembers + forget buttons
PreferenceCard	Editable tone, timing, and style settings
HistorySummaryCard	Daily/weekly context roll-up summaries
FeedbackReflectionCard	Displays LearningLoop insights integrated into Felix’s personality
8. LearningLoop Integration

Telemetry example:

{
  "agent": "Felix",
  "tool": "update_preferences",
  "context": { "client_id": "winter-haven-air" },
  "metrics": { "tone_alignment_score": 0.85 },
  "timestamp": "2025-10-27T16:30Z"
}


Evaluators

Context relevance score

Memory recall accuracy

Tone/style alignment effectiveness

Adaptation latency

Feedback Loop

Event logged to LearningLoop

Evaluator grades success

Felix adjusts confidence and summarization weights

Preference model tuned accordingly

9. Security & Privacy
Area	Safeguard
Personally Identifiable Info (PII)	Hash + encrypt sensitive values
Retention Policy	12-month max unless opted in for historical learning
Right to Erasure	Immediate deletion via forget_context
Role-Based Access	Context memory scoped by authenticated client ID
Telemetry Minimization	Store only anonymized metadata in LearningLoop
10. Implementation Roadmap
Phase	Deliverable	Duration
1	Supabase schemas (context_store, memory_store, preferences)	1 week
2	Memory tool functions (store, retrieve, update, forget)	1 week
3	Vector search + summarization engine (pgvector + LLM summarizer)	1 week
4	LearningLoop sync & feedback adapter	1 week
5	Ephemeral UI panels & privacy controls	1 week

Total: ~5 weeks to production

11. Dependencies

Supabase (JSONB + pgvector extensions)

LearningLoop telemetry + evaluators (memory_accuracy, tone_alignment)

Orchestrator (for context injection)

All other modules (data emitters)

12. Risks & Mitigations
Risk	Mitigation
Memory drift (outdated context)	Auto-summarize weekly with LLM compression
Privacy concerns	Full audit trail + deletion API
Latency under heavy query load	Caching + vector index optimization
Overfitting tone/style	Weighted recency bias (decay older data)
13. Deliverables Checklist

✅ AgentKit definitions (store_interaction, retrieve_context, update_preferences, summarize_history, forget_context, learning_sync)
✅ Supabase schemas + pgvector setup
✅ LearningLoop evaluators + telemetry feed
✅ UI panels for transparency & control
✅ QA tests (recall accuracy, latency, deletion verification)

This Memory & Context layer closes the loop on Felix’s transformation from a reactive assistant to an autonomous, self-improving marketing operator.
It’s the bridge between agent cognition and operational reality.