import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { StorageData, Goal, ImplementationPlan, Todo } from './types.js';

export class Storage {
  private storagePath: string;
  private data: StorageData;

  constructor() {
    // Store data in the OI-Software-planning-mcp directory
    // Get the directory of the current module (src/storage.ts or build/storage.js)
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    // Go up from src/ or build/ to the server root directory
    // In development: src/storage.ts -> src/ -> OI-Software-planning-mcp/
    // In production: build/storage.js -> build/ -> OI-Software-planning-mcp/
    const serverRoot = path.resolve(__dirname, '..');
    this.storagePath = path.join(serverRoot, 'data.json');
    this.data = {
      goals: {},
      plans: {},
      currentGoalId: null,
    };
  }

  async initialize(): Promise<void> {
    try {
      // Create data directory if it doesn't exist
      const dataDir = path.dirname(this.storagePath);
      await fs.mkdir(dataDir, { recursive: true });

      // Try to read existing data
      const data = await fs.readFile(this.storagePath, 'utf-8');
      this.data = JSON.parse(data);
    } catch (error) {
      // If file doesn't exist or can't be read, use default empty data
      await this.save();
    }
  }

  private async save(): Promise<void> {
    await fs.writeFile(this.storagePath, JSON.stringify(this.data, null, 2));
  }

  async createGoal(description: string): Promise<Goal> {
    const goal: Goal = {
      id: Date.now().toString(),
      description,
      createdAt: new Date().toISOString(),
    };

    this.data.goals[goal.id] = goal;
    this.data.currentGoalId = goal.id; // Set as current goal
    await this.save();
    return goal;
  }

  async getCurrentGoal(): Promise<Goal | null> {
    if (!this.data.currentGoalId) {
      return null;
    }
    return this.data.goals[this.data.currentGoalId] || null;
  }

  async setCurrentGoal(goalId: string): Promise<void> {
    if (!this.data.goals[goalId]) {
      throw new Error(`Goal ${goalId} does not exist`);
    }
    this.data.currentGoalId = goalId;
    await this.save();
  }

  async getGoal(id: string): Promise<Goal | null> {
    return this.data.goals[id] || null;
  }

  async createPlan(goalId: string): Promise<ImplementationPlan> {
    const plan: ImplementationPlan = {
      goalId,
      todos: [],
      updatedAt: new Date().toISOString(),
    };

    this.data.plans[goalId] = plan;
    await this.save();
    return plan;
  }

  async getPlan(goalId: string): Promise<ImplementationPlan | null> {
    return this.data.plans[goalId] || null;
  }

  async addTodo(
    goalId: string,
    { title, description, complexity, codeExample }: Omit<Todo, 'id' | 'isComplete' | 'createdAt' | 'updatedAt'>
  ): Promise<Todo> {
    const plan = await this.getPlan(goalId);
    if (!plan) {
      throw new Error(`No plan found for goal ${goalId}`);
    }

    const todo: Todo = {
      id: Date.now().toString(),
      title,
      description,
      complexity,
      codeExample,
      isComplete: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    plan.todos.push(todo);
    plan.updatedAt = new Date().toISOString();
    await this.save();
    return todo;
  }

  async removeTodo(goalId: string, todoId: string): Promise<void> {
    const plan = await this.getPlan(goalId);
    if (!plan) {
      throw new Error(`No plan found for goal ${goalId}`);
    }

    plan.todos = plan.todos.filter((todo: Todo) => todo.id !== todoId);
    plan.updatedAt = new Date().toISOString();
    await this.save();
  }

  async updateTodoStatus(goalId: string, todoId: string, isComplete: boolean): Promise<Todo> {
    const plan = await this.getPlan(goalId);
    if (!plan) {
      throw new Error(`No plan found for goal ${goalId}`);
    }

    const todo = plan.todos.find((t: Todo) => t.id === todoId);
    if (!todo) {
      throw new Error(`No todo found with id ${todoId}`);
    }

    todo.isComplete = isComplete;
    todo.updatedAt = new Date().toISOString();
    plan.updatedAt = new Date().toISOString();
    await this.save();
    return todo;
  }

  async getTodos(goalId: string): Promise<Todo[]> {
    const plan = await this.getPlan(goalId);
    return plan?.todos || [];
  }
}

export const storage = new Storage();
