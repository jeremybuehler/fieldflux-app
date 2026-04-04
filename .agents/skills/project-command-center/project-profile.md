# Project Profile Builder

## Description
Establishes baseline intelligence for a project by scanning codebase and capturing intent, status, and relationships.

## Usage
````bash
cd [your-project]
claude --skill project-profile
````

## Process

### Step 1: Automatic Scan
Analyze the current repository:
- Primary languages (TypeScript, Python, etc.)
- Framework detection (React, Next.js, FastAPI, etc.)
- Project structure (src/, components/, api/, etc.)
- Dependencies (package.json, requirements.txt, etc.)
- Recent commit patterns (last 30 days)
- Existing documentation (README.md, docs/)

### Step 2: Interactive Questions
Ask the developer these 5 questions:

1. **What problem does this solve?** (1-2 sentences)
   Example: "Manages field service technician dispatch and routing for HVAC companies"

2. **Who is this for?** (1 sentence)
   Example: "HVAC service companies with 5-50 technicians"

3. **Current status?** (Select one)
   - Prototype (exploratory, not production-ready)
   - Alpha (core features work, internal testing)
   - Beta (production-ready, external testing)
   - Production (live users/revenue)

4. **What's blocking progress?** (List main blockers or "None")
   Example: "Waiting on payment gateway integration, Need design mockups for mobile app"

5. **30-day success outcome?** (1 sentence)
   Example: "Complete technician mobile app and onboard first 3 pilot customers"

### Step 3: Generate Profile
Create `.claude/project-profile.md` in the project root:
````markdown
# Project Profile: [Project Name]

**Generated:** [Date]
**Repository:** [Git remote URL]

## Overview
**Problem:** [Answer to Q1]
**Audience:** [Answer to Q2]
**Status:** [Answer to Q3]

## Technical Stack
- **Languages:** [Detected]
- **Frameworks:** [Detected]
- **Key Dependencies:** [Top 5 dependencies]

## Current State
**Blocking Issues:**
[Answer to Q4]

**30-Day Goal:**
[Answer to Q5]

## Recent Activity
[Summary of last 10 commits]

## Code Structure
````
[Directory tree, 2 levels deep]
````

## Next Steps
[AI-generated suggestions based on goal + blocks]
````

### Step 4: Update Project Map
If `.claude/project-map.md` exists in parent directory or `~/buehlerdev-squad`, update it. Otherwise, create it.

Add this project to the ecosystem map with detected relationships to other profiled projects.