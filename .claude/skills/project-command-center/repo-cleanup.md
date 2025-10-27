# Repository Consolidation Planner

## Description
Audits all repositories and generates a consolidation plan to reduce cognitive overhead.

## Usage
````bash
# Run from any directory with GitHub access
claude --skill repo-cleanup
````

## Configuration
Before first run, specify your GitHub username:
````bash
export GITHUB_USER="jeremybuehler"
````

Or the skill will prompt for it.

## Process

### Step 1: Discover All Repositories
List all repos for the user:
````bash
gh repo list [username] --limit 100 --json name,updatedAt,isPrivate,isArchived,primaryLanguage
````

(Requires GitHub CLI: `gh` installed and authenticated)

### Step 2: Categorize Each Repository
For each repo, determine:

**Activity Status:**
- Active: Updated within 30 days
- Recent: Updated within 90 days
- Stale: Updated 90+ days ago
- Archived: Already archived

**Type Detection:**
- Product: Has users, docs, or production code
- Framework: Reusable code, library, template
- Experiment: POC, sandbox, learning
- Duplicate: Similar name/purpose to another repo

**Relationship Detection:**
- Standalone: Independent project
- Part of: Belongs to larger project (e.g., claim-compass-demo → claim-compass)
- Feeds into: Provides code/patterns to other projects

### Step 3: Identify Known Focus Projects
Check for these 5 repositories:
- fieldflux (or variants)
- twain-certify
- claim-compass (or variants)
- mindwell
- learning-loop (or learningloop, learning_loop variants)

Mark these as PROTECTED - DO NOT consolidate/archive.

### Step 4: Generate Consolidation Plan

Create `~/.claude/repo-cleanup-plan.md`:
````markdown
# Repository Consolidation Plan
**Generated:** [Date]
**Total Repositories:** [X]

## Active Focus Projects (PROTECTED) [5]
✓ jeremybuehler/fieldflux
✓ jeremybuehler/twain-certify
✓ jeremybuehler/claim-compass
✓ jeremybuehler/mindwell
✓ jeremybuehler/learning-loop

DO NOT archive, consolidate, or modify these.

---

## Consolidation Candidates [~10-15]

### ClaimCompass Family (5 repos → 1)
**Keep:** claim-compass (canonical)
**Merge into canonical:**
- claim-compass-demo → Extract unique demo data
- claim-compass-base → Extract base templates
- claimcompass → Duplicate, archive
- claim-compass-os → Merge OS-specific code

**Action Plan:**
```bash
# 1. Clone all related repos
# 2. Identify unique code in each
# 3. Create feature branches in canonical
# 4. Migrate unique code
# 5. Archive old repos
```

### FieldFlux Family (3-4 repos → 1)
**Keep:** fieldflux (canonical)
**Merge into canonical:**
[Similar structure]

---

## Infrastructure Hub [Recommend Creating]

**Create:** jeremybuehler/buehler-frameworks
**Purpose:** Shared code, patterns, templates used across all 5 projects

**Migrate these repos:**
- SuperClaude_Framework → Core framework
- sme-agents → Agent patterns
- buehler-ai → AI utilities
- agents (forked) → Custom agent templates

**Benefit:** Single source of truth for cross-project patterns

---

## Archive Candidates [~15-20]

### Not Touched in 90+ Days
- [repo1] - Last updated: [date]
- [repo2] - Last updated: [date]
[etc.]

**Action:** Archive on GitHub (still accessible, just marked inactive)

---

## Delete Candidates [~5]

### True Duplicates (No Unique Commits)
- [repo] - Exact duplicate of [other repo]

**Action:** Delete after confirming no unique content

---

## Keep As-Is [~5-10]

### Public Showcase / Forked Learning
- jeremybuehler (profile)
- idea-2-startup (active)
- metriport (forked, tracking upstream)
- system-prompts-and-models-of-ai-tools (public reference)

**Reason:** Public-facing or tracking external projects

---

## Execution Timeline

**Week 1: Consolidate Duplicates**
- [ ] Merge ClaimCompass family
- [ ] Merge FieldFlux family
- Estimated time: 4-6 hours

**Week 2: Create Infrastructure Hub**
- [ ] Create buehler-frameworks repo
- [ ] Migrate shared code
- [ ] Update imports in 5 focus projects
- Estimated time: 3-4 hours

**Week 3: Archive Stale Projects**
- [ ] Archive 90+ day old repos
- [ ] Document what each contained
- Estimated time: 1 hour

**Week 4: Review & Cleanup**
- [ ] Confirm no broken dependencies
- [ ] Update documentation
- [ ] Delete true duplicates
- Estimated time: 2 hours

---

## Expected Outcome

**Before:**
- 45 repositories
- 20+ context switches
- Duplicative patterns
- Cognitive overload

**After:**
- 5 focus projects (protected)
- 1 infrastructure hub
- 5-10 showcase/reference repos
- ~15 total = 67% reduction

**Mental overhead reduced by ~70%**
````

### Step 5: Interactive Confirmation
````
═══════════════════════════════════════════════
  REPOSITORY CLEANUP ANALYSIS COMPLETE
═══════════════════════════════════════════════

📊 SUMMARY
   Total repos: [X]
   Protected: 5
   Consolidate: [X]
   Archive: [X]
   Delete: [X]
   Keep: [X]
   
   → Final count: [X] repos (down from [original])

📄 Full plan saved to:
   ~/.claude/repo-cleanup-plan.md

⚠️  IMPORTANT
   This is a PLAN only. No changes have been made.
   Review the plan carefully before executing.

📋 NEXT STEPS
   1. Review: cat ~/.claude/repo-cleanup-plan.md
   2. Start with Week 1 (consolidations)
   3. Execute manually or use generated scripts
   
═══════════════════════════════════════════════
Ready to start? [Y/n]
````