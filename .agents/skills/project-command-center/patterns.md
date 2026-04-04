# Cross-Project Pattern Search

## Description
Searches across all profiled projects for existing solutions to common problems.

## Usage
````bash
claude --skill patterns "authentication flow"
claude --skill patterns "file upload"
claude --skill patterns "email notifications"
````

## Process

### Step 1: Parse Search Query
Extract key concepts from the query:
- Technical terms (authentication, upload, websocket, etc.)
- Domain terms (appointment, claim, certification, etc.)
- Action terms (send, validate, process, etc.)

### Step 2: Search Project Profiles
Scan all `.claude/project-profile.md` files in:
- Current directory tree
- Sibling directories (same parent)
- `~/[known project directories]`

Match against:
- Project descriptions
- File names in structure
- Recent commit messages
- Dependency names

### Step 3: Search Captured Learnings
Scan all `.claude/learnings.md` files for matches:
- Full-text search on query terms
- Semantic matching on similar concepts

### Step 4: Scan Actual Code (If Promising)
For top 3 matching projects:
- Search for relevant file names
- Search for class/function names matching query
- Extract file paths and brief context

### Step 5: Display Results
````
═══════════════════════════════════════════════
  PATTERN SEARCH: "[Query]"
═══════════════════════════════════════════════

🎯 FOUND IN YOUR PROJECTS

1. [Project Name] - [Status]
   File: [path/to/implementation.ts]
   Pattern: [One-line description]
   
   Key learning:
   "[Relevant captured learning]"
   
   💻 View code:
   cat [full-path]
   
   ---

2. [Project Name] - [Status]
   [Similar structure]

═══════════════════════════════════════════════

📚 BEST PRACTICE (from your experience)
[Synthesized advice from multiple implementations]

💡 RECOMMENDATION
Based on your current project ([Current Project]):
[Specific suggestion with reasoning]

Generate boilerplate from [Project Name] pattern? [Y/n]
````

### Step 6: Optional Code Generation
If user confirms, extract the pattern from source project and adapt to current project:
- Update imports for current tech stack
- Adjust naming conventions
- Add TODO comments for customization
- Place in appropriate directory