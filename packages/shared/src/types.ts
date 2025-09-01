import { z } from 'zod';

export const TodoStatus = z.enum(['pending', 'completed', 'archived']);
export type TodoStatus = z.infer<typeof TodoStatus>;

export const TodoPriority = z.enum(['low', 'medium', 'high']);
export type TodoPriority = z.infer<typeof TodoPriority>;

export const TodoSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  status: TodoStatus,
  priority: TodoPriority,
  dueDate: z.date().optional(),
  tags: z.array(z.string()).default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string().uuid(),
  syncStatus: z.enum(['synced', 'pending', 'conflict']).default('synced'),
  lastSyncedAt: z.date().optional(),
});

export type Todo = z.infer<typeof TodoSchema>;

export const CreateTodoSchema = TodoSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  syncStatus: true,
  lastSyncedAt: true,
});

export type CreateTodo = z.infer<typeof CreateTodoSchema>;

export const UpdateTodoSchema = CreateTodoSchema.partial();
export type UpdateTodo = z.infer<typeof UpdateTodoSchema>;

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

export const AuthUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type AuthUser = z.infer<typeof AuthUserSchema>;

export const SyncPayloadSchema = z.object({
  todos: z.array(TodoSchema),
  lastSyncTimestamp: z.date(),
  conflicts: z.array(z.object({
    todoId: z.string().uuid(),
    serverVersion: TodoSchema,
    clientVersion: TodoSchema,
  })).default([]),
});

export type SyncPayload = z.infer<typeof SyncPayloadSchema>;