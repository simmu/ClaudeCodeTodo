import { z } from 'zod';
import { TodoSchema, CreateTodoSchema, UpdateTodoSchema, UserSchema, SyncPayloadSchema } from './types.js';

export const ApiResponse = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    message: z.string().optional(),
  });

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export const TodosApiSchema = {
  list: {
    response: ApiResponse(z.array(TodoSchema)),
  },
  create: {
    body: CreateTodoSchema,
    response: ApiResponse(TodoSchema),
  },
  update: {
    params: z.object({ id: z.string().uuid() }),
    body: UpdateTodoSchema,
    response: ApiResponse(TodoSchema),
  },
  delete: {
    params: z.object({ id: z.string().uuid() }),
    response: ApiResponse(z.object({ id: z.string() })),
  },
  sync: {
    body: SyncPayloadSchema,
    response: ApiResponse(SyncPayloadSchema),
  },
};

export const AuthApiSchema = {
  login: {
    body: z.object({
      email: z.string().email(),
      password: z.string().min(8),
    }),
    response: ApiResponse(z.object({
      user: UserSchema,
      token: z.string(),
    })),
  },
  register: {
    body: z.object({
      email: z.string().email(),
      password: z.string().min(8),
      name: z.string().min(1).max(100),
    }),
    response: ApiResponse(z.object({
      user: UserSchema,
      token: z.string(),
    })),
  },
  me: {
    response: ApiResponse(UserSchema),
  },
};

export const WebSocketEventSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('todo:created'),
    payload: TodoSchema,
  }),
  z.object({
    type: z.literal('todo:updated'),
    payload: TodoSchema,
  }),
  z.object({
    type: z.literal('todo:deleted'),
    payload: z.object({ id: z.string().uuid() }),
  }),
  z.object({
    type: z.literal('sync:conflict'),
    payload: z.object({
      todoId: z.string().uuid(),
      serverVersion: TodoSchema,
      clientVersion: TodoSchema,
    }),
  }),
]);

export type WebSocketEvent = z.infer<typeof WebSocketEventSchema>;