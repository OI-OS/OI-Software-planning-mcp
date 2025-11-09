# How to Use OI-Software-planning-mcp - Step by Step

## Quick Start

The software planning tool helps you break down software projects into manageable tasks. Here's exactly how to use it:

---

## ⚠️ IMPORTANT: Read This First

**The server uses in-memory storage per connection.** This means:
- Each time you call a tool, it's a NEW connection
- Your planning session and todos are LOST between calls
- **You need to do everything in ONE workflow** (start → add todos → get todos)

**For now, this tool works best for:**
- Planning a project in a single session
- Getting a structured breakdown of tasks
- Exporting the plan to save elsewhere

---

## Step-by-Step Usage

### Method 1: Direct Calls (Recommended - More Reliable)

#### Step 1: Start a Planning Session

```bash
./brain-trust4 call OI-Software-planning-mcp start_planning '{"goal": "Build a React dashboard"}'
```

**What this does:**
- Creates a new planning session
- Sets your project goal
- Returns a prompt about the planning process

**Example:**
```bash
./brain-trust4 call OI-Software-planning-mcp start_planning '{"goal": "Create a task management app"}'
```

#### Step 2: Add Todos (Tasks)

```bash
./brain-trust4 call OI-Software-planning-mcp add_todo '{
  "title": "Task title here",
  "description": "Detailed description of what needs to be done",
  "complexity": 3
}'
```

**Parameters:**
- `title` (required): Short title for the task
- `description` (required): Detailed description
- `complexity` (required): Number from 0-10 (0=easy, 10=very hard)
- `codeExample` (optional): Code snippet if relevant

**Examples:**
```bash
# Simple task
./brain-trust4 call OI-Software-planning-mcp add_todo '{
  "title": "Setup React project",
  "description": "Initialize React project with TypeScript and install dependencies",
  "complexity": 3
}'

# Task with code example
./brain-trust4 call OI-Software-planning-mcp add_todo '{
  "title": "Create authentication",
  "description": "Implement JWT-based user authentication",
  "complexity": 5,
  "codeExample": "npm install jsonwebtoken bcrypt"
}'
```

**Response:** Returns the created todo with an `id` - save this ID for later!

#### Step 3: View All Todos

```bash
./brain-trust4 call OI-Software-planning-mcp get_todos
```

**What this does:**
- Returns a JSON array of all todos in your current plan
- Shows: id, title, description, complexity, isComplete status

**Example response:**
```json
[
  {
    "id": "abc123",
    "title": "Setup React project",
    "description": "Initialize React project...",
    "complexity": 3,
    "isComplete": false
  },
  {
    "id": "def456",
    "title": "Create authentication",
    "description": "Implement JWT...",
    "complexity": 5,
    "isComplete": false
  }
]
```

#### Step 4: Mark Todos as Complete

```bash
./brain-trust4 call OI-Software-planning-mcp update_todo_status '{
  "todoId": "abc123",
  "isComplete": true
}'
```

**Parameters:**
- `todoId` (required): The ID from when you created the todo (or from get_todos)
- `isComplete` (required): `true` to mark complete, `false` to mark incomplete

**Example:**
```bash
# Mark as complete
./brain-trust4 call OI-Software-planning-mcp update_todo_status '{
  "todoId": "abc123",
  "isComplete": true
}'

# Mark as incomplete
./brain-trust4 call OI-Software-planning-mcp update_todo_status '{
  "todoId": "abc123",
  "isComplete": false
}'
```

#### Step 5: Save Your Plan (Optional)

```bash
./brain-trust4 call OI-Software-planning-mcp save_plan '{
  "plan": "# Your Plan Title\n\n## Phase 1\n- Task 1\n- Task 2"
}'
```

**What this does:**
- Saves your implementation plan as formatted text
- Can include markdown formatting
- Automatically creates todos from the plan structure

**Example:**
```bash
./brain-trust4 call OI-Software-planning-mcp save_plan '{
  "plan": "# Task Management App\n\n## Phase 1: Setup\n- Setup React project (Complexity: 3)\n- Install dependencies (Complexity: 2)\n\n## Phase 2: Core Features\n- Implement auth (Complexity: 5)\n- Create task UI (Complexity: 4)"
}'
```

#### Step 6: Remove a Todo (Optional)

```bash
./brain-trust4 call OI-Software-planning-mcp remove_todo '{"todoId": "abc123"}'
```

**Example:**
```bash
./brain-trust4 call OI-Software-planning-mcp remove_todo '{"todoId": "abc123"}'
```

---

### Method 2: Natural Language (Easier but Less Reliable)

#### Step 1: Start Planning

```bash
./oi "start planning build a React dashboard"
```

#### Step 2: Add Todos

```bash
./oi "add todo setup React project with complexity 3"
./oi "add todo implement authentication with complexity 5"
```

#### Step 3: View Todos

```bash
./oi "get todos"
# or
./oi "list todos"
```

#### Step 4: Complete Todo

```bash
./oi "complete todo abc123"
```

#### Step 5: Save Plan

```bash
./oi "save plan # My Plan Title..."
```

---

## Complete Example Workflow

Here's a complete example of planning a React app:

```bash
# 1. Start planning
./brain-trust4 call OI-Software-planning-mcp start_planning '{"goal": "Build a React todo app"}'

# 2. Add todos
./brain-trust4 call OI-Software-planning-mcp add_todo '{
  "title": "Setup project",
  "description": "Create React app with TypeScript",
  "complexity": 2
}'

./brain-trust4 call OI-Software-planning-mcp add_todo '{
  "title": "Create task list component",
  "description": "Build the main task list UI with add/edit/delete",
  "complexity": 4
}'

./brain-trust4 call OI-Software-planning-mcp add_todo '{
  "title": "Add local storage",
  "description": "Persist tasks to browser local storage",
  "complexity": 3
}'

# 3. View all todos
./brain-trust4 call OI-Software-planning-mcp get_todos

# 4. Mark first todo as complete (use ID from get_todos response)
./brain-trust4 call OI-Software-planning-mcp update_todo_status '{
  "todoId": "todo-id-here",
  "isComplete": true
}'

# 5. Save the plan
./brain-trust4 call OI-Software-planning-mcp save_plan '{
  "plan": "# React Todo App Plan\n\n## Setup\n- Setup project (Complexity: 2)\n\n## Features\n- Create task list component (Complexity: 4)\n- Add local storage (Complexity: 3)"
}'
```

---

## Understanding Complexity Scores

- **0-2**: Very easy (simple setup, basic tasks)
- **3-5**: Medium (standard features, moderate complexity)
- **6-8**: Hard (complex features, integrations)
- **9-10**: Very hard (architectural changes, major refactoring)

**Examples:**
- Setup project: 2-3
- Create simple component: 3-4
- Implement authentication: 5-6
- Database migration: 7-8
- Major architecture change: 9-10

---

## Common Issues & Solutions

### Error: "No active goal. Start a new planning session first."

**Problem:** You're trying to use a tool before starting a planning session.

**Solution:** Always call `start_planning` first:
```bash
./brain-trust4 call OI-Software-planning-mcp start_planning '{"goal": "Your goal"}'
```

### Error: Todos disappear between calls

**Problem:** The server uses in-memory storage per connection.

**Solution:** This is expected behavior. Do your entire workflow in one session, or save your plan and start fresh.

### Error: "Invalid todoId"

**Problem:** The todo ID doesn't exist or is incorrect.

**Solution:** Get the correct ID by calling `get_todos` first:
```bash
./brain-trust4 call OI-Software-planning-mcp get_todos
```

---

## Tips for Best Results

1. **Start with a clear goal** - Be specific about what you're building
2. **Break down into small tasks** - Each todo should be a single, actionable item
3. **Use realistic complexity scores** - Be honest about difficulty
4. **Add code examples** - Include relevant code snippets when helpful
5. **Save your plan** - Export it to a file or document for reference

---

## Quick Reference

| Action | Direct Call | Natural Language |
|--------|-------------|------------------|
| Start planning | `./brain-trust4 call OI-Software-planning-mcp start_planning '{"goal": "..."}'` | `./oi "start planning ..."` |
| Add todo | `./brain-trust4 call OI-Software-planning-mcp add_todo '{...}'` | `./oi "add todo ..."` |
| Get todos | `./brain-trust4 call OI-Software-planning-mcp get_todos` | `./oi "get todos"` |
| Complete todo | `./brain-trust4 call OI-Software-planning-mcp update_todo_status '{...}'` | `./oi "complete todo ..."` |
| Save plan | `./brain-trust4 call OI-Software-planning-mcp save_plan '{...}'` | `./oi "save plan ..."` |
| Remove todo | `./brain-trust4 call OI-Software-planning-mcp remove_todo '{...}'` | `./oi "remove todo ..."` |

---

That's it! You now know how to use the software planning tool. Start with `start_planning`, add your todos, and track your progress.

