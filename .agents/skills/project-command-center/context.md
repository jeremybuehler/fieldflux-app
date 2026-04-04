# Project Context Loader

## Description
Loads relevant context when switching to a project, showing where you left off and what's changed.

## Usage
````bash
cd [your-project]
claude --skill context
````

## Process

### Step 1: Load Project Profile
Read `.claude/project-profile.md` if exists.
If not, prompt: "No project profile found. Run `claude --skill project-profile` first."

### Step 2: Analyze Last Session
Check `.claude/last-session.md` (created by this skill on exit):
- When did you last work here?
- What files were you editing?
- What was the last commit message?
- Any TODO comments you added?

### Step 3: Detect Changes Since Last Session
- New commits (by others or from other machines)
- New issues/TODOs in code
- Modified dependencies
- New files added

### Step 4: Find Related Patterns
Search `.claude/learnings.md` (from other projects) for related patterns:
- Similar file names
- Similar function names  
- Similar problem domains

### Step 5: Display Context Report
````
═══════════════════════════════════════════════
  PROJECT: [Project Name]
  STATUS: [From profile]
═══════════════════════════════════════════════

📍 LAST SESSION ([X days/hours ago])
   Working on: [File path]
   Line: [Last cursor position if trackable]
   Last commit: "[Commit message]"
   
   Open questions:
   [Any TODO or FIXME comments you added]

📬 WHAT'S NEW
   [X] commits since you were here
   → [Most significant commit message]
   
   [X] new TODO comments
   → [List them]

🔗 RELATED PATTERNS (from other projects)
   → [Project Name]: Similar work in [file]
      Pattern: [One-line description]
      
💡 SUGGESTED NEXT STEP
   [AI-generated suggestion based on profile goal + last session]
   
═══════════════════════════════════════════════
Ready to work? [Press Enter]
````

### Step 6: Create Session Marker
Write `.claude/last-session.md`:
````markdown
# Last Session
**Started:** [Timestamp]
**Files:** [Currently open files]
**Branch:** [Current git branch]
````