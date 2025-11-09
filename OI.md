# OI-Software-planning-mcp MCP Server - OI OS Installation Guide

This guide provides comprehensive installation instructions for AI agents installing the OI-Software-planning-mcp MCP server in OI OS (Brain Trust 4) environments.

## Table of Contents

1. [AI Agent Quick Installation](#ai-agent-quick-installation)
2. [Prerequisites](#prerequisites)
3. [Full Installation Steps](#full-installation-steps)
4. [Connecting to OI OS](#connecting-to-oi-os)
5. [Creating Intent Mappings](#creating-intent-mappings)
6. [Creating Parameter Rules](#creating-parameter-rules)
7. [Parameter Extractors](#parameter-extractors)
8. [Verification & Testing](#verification--testing)
9. [Troubleshooting](#troubleshooting)
10. [Tool Reference](#tool-reference)

---

## AI Agent Quick Installation

**⚠️ For AI Agents: Use Direct Calls for Reliability**

AI agents should prefer **direct `brain-trust4 call` commands** over natural language queries for maximum reliability. Natural language commands can timeout or have parameter extraction issues. Direct calls bypass intent mapping and parameter extraction, providing consistent results.

**Example:**
```bash
# ✅ RECOMMENDED for AI agents: Direct call
./brain-trust4 call OI-Software-planning-mcp start_planning '{"goal": "Create a React dashboard"}'

# ⚠️ FALLBACK: Natural language (may timeout or fail parameter extraction)
./oi "start planning create a React dashboard"
```

For AI agents using OI OS, execute the following commands:

```bash
# 1. Install the server
./oi install https://github.com/OI-OS/OI-Software-planning-mcp.git

# 2. Build the project
cd MCP-servers/OI-Software-planning-mcp
npm install
npm run build

# 3. Connect the server to OI OS
cd ../../
./brain-trust4 connect OI-Software-planning-mcp node -- "$(pwd)/MCP-servers/OI-Software-planning-mcp/build/index.js"

# 4. Create intent mappings and parameter rules
sqlite3 brain-trust4.db << 'SQL'
BEGIN TRANSACTION;

-- Intent mappings for OI-Software-planning-mcp
INSERT OR REPLACE INTO intent_mappings (keyword, server_name, tool_name, priority) VALUES
('start planning', 'OI-Software-planning-mcp', 'start_planning', 10),
('start software planning', 'OI-Software-planning-mcp', 'start_planning', 10),
('plan software', 'OI-Software-planning-mcp', 'start_planning', 10),
('new planning session', 'OI-Software-planning-mcp', 'start_planning', 10),
('add todo', 'OI-Software-planning-mcp', 'add_todo', 10),
('create todo', 'OI-Software-planning-mcp', 'add_todo', 10),
('add task', 'OI-Software-planning-mcp', 'add_todo', 10),
('create task', 'OI-Software-planning-mcp', 'add_todo', 10),
('get todos', 'OI-Software-planning-mcp', 'get_todos', 10),
('list todos', 'OI-Software-planning-mcp', 'get_todos', 10),
('show todos', 'OI-Software-planning-mcp', 'get_todos', 10),
('get tasks', 'OI-Software-planning-mcp', 'get_todos', 10),
('update todo', 'OI-Software-planning-mcp', 'update_todo_status', 10),
('complete todo', 'OI-Software-planning-mcp', 'update_todo_status', 10),
('mark todo complete', 'OI-Software-planning-mcp', 'update_todo_status', 10),
('save plan', 'OI-Software-planning-mcp', 'save_plan', 10),
('save implementation plan', 'OI-Software-planning-mcp', 'save_plan', 10),
('remove todo', 'OI-Software-planning-mcp', 'remove_todo', 10),
('delete todo', 'OI-Software-planning-mcp', 'remove_todo', 10);

-- Parameter rules
INSERT OR REPLACE INTO parameter_rules (server_name, tool_name, tool_signature, required_fields, field_generators, patterns) VALUES
('OI-Software-planning-mcp', 'start_planning', 'OI-Software-planning-mcp::start_planning', '["goal"]',
 '{"goal": {"FromQuery": "OI-Software-planning-mcp::start_planning.goal"}}', '[]'),

('OI-Software-planning-mcp', 'add_todo', 'OI-Software-planning-mcp::add_todo', '["title", "description", "complexity"]',
 '{"title": {"FromQuery": "OI-Software-planning-mcp::add_todo.title"}, "description": {"FromQuery": "OI-Software-planning-mcp::add_todo.description"}, "complexity": {"FromQuery": "OI-Software-planning-mcp::add_todo.complexity"}, "codeExample": {"FromQuery": "OI-Software-planning-mcp::add_todo.codeExample"}}', '[]'),

('OI-Software-planning-mcp', 'get_todos', 'OI-Software-planning-mcp::get_todos', '[]',
 '{}', '[]'),

('OI-Software-planning-mcp', 'update_todo_status', 'OI-Software-planning-mcp::update_todo_status', '["todoId", "isComplete"]',
 '{"todoId": {"FromQuery": "OI-Software-planning-mcp::update_todo_status.todoId"}, "isComplete": {"FromQuery": "OI-Software-planning-mcp::update_todo_status.isComplete"}}', '[]'),

('OI-Software-planning-mcp', 'save_plan', 'OI-Software-planning-mcp::save_plan', '["plan"]',
 '{"plan": {"FromQuery": "OI-Software-planning-mcp::save_plan.plan"}}', '[]'),

('OI-Software-planning-mcp', 'remove_todo', 'OI-Software-planning-mcp::remove_todo', '["todoId"]',
 '{"todoId": {"FromQuery": "OI-Software-planning-mcp::remove_todo.todoId"}}', '[]');

COMMIT;
SQL

# 5. Parameter extractors are already in parameter_extractors.toml.default
# See "Parameter Extractors" section for complete list

# 6. Verify installation
./oi list | grep OI-Software-planning-mcp
./brain-trust4 call OI-Software-planning-mcp start_planning '{"goal": "Test planning session"}'
```

---

## Prerequisites

- **Node.js 18+** - Required for running the MCP server
- **OI OS / Brain Trust 4** - The OI OS platform
- **TypeScript** - For building (installed as dev dependency)

---

## Full Installation Steps

### Step 1: Install the Server

```bash
# From your OI OS project root
./oi install https://github.com/OI-OS/OI-Software-planning-mcp.git
```

**Note:** If `./oi install` fails with "Not connected" error, manually clone and build:

```bash
cd MCP-servers
git clone https://github.com/OI-OS/OI-Software-planning-mcp.git
cd OI-Software-planning-mcp
npm install
npm run build
```

### Step 2: Connect to OI OS

```bash
# From OI OS project root
./brain-trust4 connect OI-Software-planning-mcp node -- "$(pwd)/MCP-servers/OI-Software-planning-mcp/build/index.js"
```

### Step 3: Verify Connection

```bash
./oi list | grep OI-Software-planning-mcp
./brain-trust4 tools OI-Software-planning-mcp
```

You should see 6 tools listed:
- `start_planning`
- `add_todo`
- `get_todos`
- `update_todo_status`
- `save_plan`
- `remove_todo`

---

## Creating Intent Mappings

Intent mappings connect natural language queries to specific MCP server tools. Create them using SQL INSERT statements.

### Database Location

```bash
sqlite3 brain-trust4.db
```

### All Intent Mappings

```sql
BEGIN TRANSACTION;

INSERT OR REPLACE INTO intent_mappings (keyword, server_name, tool_name, priority) VALUES
('start planning', 'OI-Software-planning-mcp', 'start_planning', 10),
('start software planning', 'OI-Software-planning-mcp', 'start_planning', 10),
('plan software', 'OI-Software-planning-mcp', 'start_planning', 10),
('new planning session', 'OI-Software-planning-mcp', 'start_planning', 10),
('add todo', 'OI-Software-planning-mcp', 'add_todo', 10),
('create todo', 'OI-Software-planning-mcp', 'add_todo', 10),
('add task', 'OI-Software-planning-mcp', 'add_todo', 10),
('create task', 'OI-Software-planning-mcp', 'add_todo', 10),
('get todos', 'OI-Software-planning-mcp', 'get_todos', 10),
('list todos', 'OI-Software-planning-mcp', 'get_todos', 10),
('show todos', 'OI-Software-planning-mcp', 'get_todos', 10),
('get tasks', 'OI-Software-planning-mcp', 'get_todos', 10),
('update todo', 'OI-Software-planning-mcp', 'update_todo_status', 10),
('complete todo', 'OI-Software-planning-mcp', 'update_todo_status', 10),
('mark todo complete', 'OI-Software-planning-mcp', 'update_todo_status', 10),
('save plan', 'OI-Software-planning-mcp', 'save_plan', 10),
('save implementation plan', 'OI-Software-planning-mcp', 'save_plan', 10),
('remove todo', 'OI-Software-planning-mcp', 'remove_todo', 10),
('delete todo', 'OI-Software-planning-mcp', 'remove_todo', 10);

COMMIT;
```

### Verifying Intent Mappings

```bash
sqlite3 brain-trust4.db "SELECT * FROM intent_mappings WHERE server_name = 'OI-Software-planning-mcp' ORDER BY tool_name, keyword;"
```

---

## Creating Parameter Rules

Parameter rules define which fields are required and how to extract them from natural language queries. The OI OS parameter engine **only extracts required fields** - optional fields are skipped even if extractors exist.

### All Parameter Rules

```sql
BEGIN TRANSACTION;

INSERT OR REPLACE INTO parameter_rules (server_name, tool_name, tool_signature, required_fields, field_generators, patterns) VALUES
('OI-Software-planning-mcp', 'start_planning', 'OI-Software-planning-mcp::start_planning', '["goal"]',
 '{"goal": {"FromQuery": "OI-Software-planning-mcp::start_planning.goal"}}', '[]'),

('OI-Software-planning-mcp', 'add_todo', 'OI-Software-planning-mcp::add_todo', '["title", "description", "complexity"]',
 '{"title": {"FromQuery": "OI-Software-planning-mcp::add_todo.title"}, "description": {"FromQuery": "OI-Software-planning-mcp::add_todo.description"}, "complexity": {"FromQuery": "OI-Software-planning-mcp::add_todo.complexity"}, "codeExample": {"FromQuery": "OI-Software-planning-mcp::add_todo.codeExample"}}', '[]'),

('OI-Software-planning-mcp', 'get_todos', 'OI-Software-planning-mcp::get_todos', '[]',
 '{}', '[]'),

('OI-Software-planning-mcp', 'update_todo_status', 'OI-Software-planning-mcp::update_todo_status', '["todoId", "isComplete"]',
 '{"todoId": {"FromQuery": "OI-Software-planning-mcp::update_todo_status.todoId"}, "isComplete": {"FromQuery": "OI-Software-planning-mcp::update_todo_status.isComplete"}}', '[]'),

('OI-Software-planning-mcp', 'save_plan', 'OI-Software-planning-mcp::save_plan', '["plan"]',
 '{"plan": {"FromQuery": "OI-Software-planning-mcp::save_plan.plan"}}', '[]'),

('OI-Software-planning-mcp', 'remove_todo', 'OI-Software-planning-mcp::remove_todo', '["todoId"]',
 '{"todoId": {"FromQuery": "OI-Software-planning-mcp::remove_todo.todoId"}}', '[]');

COMMIT;
```

### Verifying Parameter Rules

```bash
sqlite3 brain-trust4.db "SELECT tool_name, required_fields FROM parameter_rules WHERE server_name = 'OI-Software-planning-mcp';"
```

---

## Parameter Extractors

Parameter extractors parse natural language queries to extract values for tool parameters. These are configured in `parameter_extractors.toml.default`.

### All Parameter Extractors

Add these to `parameter_extractors.toml.default`:

```toml
# ============================================================================
# OI-SOFTWARE-PLANNING-MCP EXTRACTION PATTERNS
# ============================================================================

# start_planning
"OI-Software-planning-mcp::start_planning.goal" = "template:{{query}}"

# add_todo
"OI-Software-planning-mcp::add_todo.title" = "keyword:after_todo,after_task,after_add,after_create"
"OI-Software-planning-mcp::add_todo.description" = "template:{{query}}"
"OI-Software-planning-mcp::add_todo.complexity" = "conditional:if_matches:\\d+|then:regex:(?:complexity|complex|difficulty|score)[\\s:]+(\\d+)|else:regex:\\b([0-9]|10)\\b"
"OI-Software-planning-mcp::add_todo.codeExample" = "conditional:if_contains:code example,code snippet,example code|then:regex:(?:code(?:\\s+example|\\s+snippet)?|example\\s+code)[\\s:]+(.+?)(?:\\s+description|\\s+complexity|$)|else:default:null"

# get_todos (no parameters)

# update_todo_status
"OI-Software-planning-mcp::update_todo_status.todoId" = "regex:(?:todo|task)[\\s_-]?(?:id|#)?[\\s:]+([A-Za-z0-9_-]+)|regex:\\b([A-Za-z0-9_-]{8,})\\b"
"OI-Software-planning-mcp::update_todo_status.isComplete" = "conditional:if_contains:complete,done,finished,mark complete|then:default:true|else:conditional:if_contains:incomplete,not done,unfinished,mark incomplete|then:default:false|else:default:true"

# save_plan
"OI-Software-planning-mcp::save_plan.plan" = "template:{{query}}"

# remove_todo
"OI-Software-planning-mcp::remove_todo.todoId" = "regex:(?:todo|task)[\\s_-]?(?:id|#)?[\\s:]+([A-Za-z0-9_-]+)|regex:\\b([A-Za-z0-9_-]{8,})\\b"
```

**Note:** These extractors are pre-configured in `parameter_extractors.toml.default`. No additional configuration is needed.

---

## Verification & Testing

### Test 1: List Tools

```bash
./brain-trust4 tools OI-Software-planning-mcp
```

Should show 6 tools.

### Test 2: Direct Tool Call

```bash
# Start a planning session
./brain-trust4 call OI-Software-planning-mcp start_planning '{"goal": "Create a React dashboard application"}'

# Add a todo
./brain-trust4 call OI-Software-planning-mcp add_todo '{"title": "Setup project", "description": "Initialize React project with dependencies", "complexity": 3}'

# Get todos
./brain-trust4 call OI-Software-planning-mcp get_todos
```

### Test 3: Natural Language Query

```bash
./oi "start planning create a React dashboard"
./oi "add todo setup project structure with complexity 5"
./oi "get todos"
```

---

## Troubleshooting

### Server Connection Issues

**Error:** `Connection failed during initialization`

**Solutions:**
1. Verify server connection: `./oi status OI-Software-planning-mcp`
2. Restart server connection: `./brain-trust4 connect OI-Software-planning-mcp node -- "$(pwd)/MCP-servers/OI-Software-planning-mcp/build/index.js"`
3. Check server logs for errors
4. Verify build completed: `ls -la MCP-servers/OI-Software-planning-mcp/build/index.js`

### Parameter Extraction Fails

**Error:** Natural language queries don't extract parameters correctly

**Solutions:**
1. Use direct calls instead: `./brain-trust4 call OI-Software-planning-mcp start_planning '{...}'`
2. Check parameter extractors in `parameter_extractors.toml.default`
3. Verify intent mappings exist: `sqlite3 brain-trust4.db "SELECT * FROM intent_mappings WHERE server_name = 'OI-Software-planning-mcp';"`

### No Active Goal Error

**Error:** `No active goal. Start a new planning session first.`

**Solution:** Always call `start_planning` before using other tools. The server uses persistent storage, so once you start a session, it remains active across connections:

```bash
./brain-trust4 call OI-Software-planning-mcp start_planning '{"goal": "Your goal here"}'
```

### Persistent Storage

**✅ The server now uses persistent storage!**

- Planning sessions persist across connections
- Data is stored in `~/.software-planning-tool/data.json`
- The current goal is automatically loaded on each connection
- You can call tools in separate commands without losing state

**Storage Location:** `~/.software-planning-tool/data.json`

This file contains all goals, plans, todos, and the current active goal ID. You can safely back up this file to preserve your planning sessions.

---

## Tool Reference

### start_planning

Start a new planning session with a goal.

**Parameters:**
- `goal` (string, required): The software development goal to plan

**Example:**
```bash
./brain-trust4 call OI-Software-planning-mcp start_planning '{"goal": "Create a React-based dashboard application"}'
```

### add_todo

Add a new todo item to the current plan.

**Parameters:**
- `title` (string, required): Title of the todo item
- `description` (string, required): Detailed description of the todo item
- `complexity` (number, required): Complexity score (0-10)
- `codeExample` (string, optional): Optional code example

**Example:**
```bash
./brain-trust4 call OI-Software-planning-mcp add_todo '{
  "title": "Set up project structure",
  "description": "Initialize React project with necessary dependencies",
  "complexity": 3,
  "codeExample": "npx create-react-app dashboard"
}'
```

### get_todos

Get all todos in the current plan.

**Parameters:** None

**Example:**
```bash
./brain-trust4 call OI-Software-planning-mcp get_todos
```

### update_todo_status

Update the completion status of a todo item.

**Parameters:**
- `todoId` (string, required): ID of the todo item
- `isComplete` (boolean, required): New completion status

**Example:**
```bash
./brain-trust4 call OI-Software-planning-mcp update_todo_status '{"todoId": "abc123", "isComplete": true}'
```

### save_plan

Save the current implementation plan.

**Parameters:**
- `plan` (string, required): The implementation plan text to save

**Example:**
```bash
./brain-trust4 call OI-Software-planning-mcp save_plan '{
  "plan": "# Dashboard Implementation Plan\n\n## Phase 1: Setup\n- Initialize React project\n- Install dependencies"
}'
```

### remove_todo

Remove a todo item from the current plan.

**Parameters:**
- `todoId` (string, required): ID of the todo item to remove

**Example:**
```bash
./brain-trust4 call OI-Software-planning-mcp remove_todo '{"todoId": "abc123"}'
```

---

## Resources

The server provides 2 resources:

- `planning://current-goal` - The current software development goal being planned
- `planning://implementation-plan` - The current implementation plan with todos

---

Made with ❤️ using the Model Context Protocol

