# Learning Capture System

## Description
Captures insights, decisions, and patterns while working for future reference.

## Usage
````bash
claude --skill capture "Learned that A* algorithm works better than Dijkstra for skill-weighted routing"
claude --skill capture "Decision: Using Zustand instead of Redux for simpler state management"
claude --skill capture "Bug fix: Photo validation needs to check EXIF data before upload"
````

## Process

### Step 1: Parse Input
Detect learning type:
- **Insight:** "Learned that...", "Discovered...", "Found that..."
- **Decision:** "Decided...", "Choosing...", "Going with..."
- **Bug Fix:** "Fixed...", "Bug...", "Issue was..."
- **Pattern:** "Always...", "Should...", "Best to..."
- **General:** [Anything else]

### Step 2: Enrich Context
Automatically capture:
- Current project name
- Current file (if in a file)
- Current git branch
- Timestamp
- Related files (from git status)

### Step 3: Generate Tags
Auto-tag based on content:
- Technical terms (algorithm, database, API, auth, etc.)
- Domain terms (routing, claims, certification, etc.)
- Category (performance, security, UX, architecture, etc.)

### Step 4: Append to Learning Log
Create/append to `.claude/learnings.md`:
````markdown
## [Timestamp] - [Learning Type]
**Project:** [Project Name]
**Context:** [Current file or "general"]
**Tags:** #[tag1] #[tag2] #[tag3]

[The learning, exactly as user wrote it]

**Related:**
- [Git branch if relevant]
- [Other projects this might apply to]

---
````

### Step 5: Update Cross-References
If this learning relates to patterns in other projects:
- Add cross-reference to those project profiles
- Update project map with new relationship

### Step 6: Confirm
````
✅ Captured learning in [Project Name]
   Tags: #[tag1] #[tag2]
   Related to: [Other projects if any]
   
   This will surface when working on: [Related contexts]
````