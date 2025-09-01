import Dexie from 'dexie';
import type { Table } from 'dexie';
import type { Todo, CreateTodo, User } from '../../../../shared/src/types';

export interface LocalTodo extends Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'userId'> {
  id?: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface LocalUser extends Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
  id?: number;
  createdAt: Date;
  updatedAt: Date;
}

export class TodoDatabase extends Dexie {
  todos!: Table<LocalTodo>;
  users!: Table<LocalUser>;

  constructor() {
    super('TodoDatabase');
    this.version(1).stores({
      todos: '++id, title, status, priority, dueDate, createdAt, updatedAt, userId, syncStatus',
      users: '++id, email, name, createdAt, updatedAt'
    });
  }
}

export const db = new TodoDatabase();

// Todo operations
export const todoService = {
  async getAllTodos(userId: string): Promise<LocalTodo[]> {
    return await db.todos.where('userId').equals(userId).toArray();
  },

  async getTodo(id: number): Promise<LocalTodo | undefined> {
    return await db.todos.get(id);
  },

  async addTodo(todoData: CreateTodo & { userId: string }): Promise<LocalTodo> {
    const now = new Date();
    const todo: Omit<LocalTodo, 'id'> = {
      ...todoData,
      createdAt: now,
      updatedAt: now,
      syncStatus: 'pending'
    };
    const id = await db.todos.add(todo as LocalTodo);
    return { ...todo, id } as LocalTodo;
  },

  async updateTodo(id: number, updates: Partial<LocalTodo>): Promise<void> {
    await db.todos.update(id, {
      ...updates,
      updatedAt: new Date(),
      syncStatus: 'pending'
    });
  },

  async deleteTodo(id: number): Promise<void> {
    await db.todos.delete(id);
  },

  async toggleTodo(id: number): Promise<void> {
    const todo = await db.todos.get(id);
    if (todo) {
      await db.todos.update(id, {
        status: todo.status === 'completed' ? 'pending' : 'completed',
        updatedAt: new Date(),
        syncStatus: 'pending'
      });
    }
  },

  async clearCompleted(userId: string): Promise<void> {
    await db.todos.where('userId').equals(userId).and(todo => todo.status === 'completed').delete();
  }
};

// User operations
export const userService = {
  async getCurrentUser(): Promise<LocalUser | undefined> {
    return await db.users.orderBy('createdAt').last();
  },

  async addUser(userData: Omit<LocalUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<LocalUser> {
    const now = new Date();
    const user: Omit<LocalUser, 'id'> = {
      ...userData,
      createdAt: now,
      updatedAt: now
    };
    const id = await db.users.add(user as LocalUser);
    return { ...user, id } as LocalUser;
  },

  async updateUser(id: number, updates: Partial<LocalUser>): Promise<void> {
    await db.users.update(id, {
      ...updates,
      updatedAt: new Date()
    });
  }
};