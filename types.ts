
export interface User {
  id: string;
  email: string;
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum TaskStatus {
  TODO = 'to do',
  IN_PROGRESS = 'in progress',
  DONE = 'done',
  BLOCKED = 'blocked',
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null; // ISO string or null
  creationDate: string; // ISO string
  category?: string;
}

export interface ParsedTaskData {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string; // Expecting "YYYY-MM-DD" or similar from AI
  category?: string;
}

export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>; // Password optional for demo
  register: (email: string, password?: string) => Promise<void>; // Password optional for demo
  logout: () => void;
}

export interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  fetchTasks: () => Promise<void>;
  addTask: (taskData: Omit<Task, 'id' | 'userId' | 'creationDate' | 'status'>, naturalLanguageInput: string) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  parseTaskWithAI: (naturalLanguageInput: string) => Promise<ParsedTaskData | null>;
}

// For Gemini API related types, we will use the ones from "@google/genai" directly.
// We might add specific response parsing types here if needed.
