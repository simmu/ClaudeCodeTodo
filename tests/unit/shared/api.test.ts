import { describe, it, expect } from '@jest/globals';
import {
  ApiResponse,
  TodosApiSchema,
  AuthApiSchema,
  WebSocketEventSchema,
} from '../../../packages/shared/src/api';
import { TodoSchema, UserSchema } from '../../../packages/shared/src/types';

describe('ApiResponse', () => {
  it('should create a valid API response schema', () => {
    const StringApiResponse = ApiResponse(TodoSchema);
    
    const validResponse = {
      success: true,
      data: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Test Todo',
        status: 'pending' as const,
        priority: 'medium' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: '123e4567-e89b-12d3-a456-426614174001',
        syncStatus: 'synced' as const,
      },
      message: 'Success',
    };

    const result = StringApiResponse.safeParse(validResponse);
    expect(result.success).toBe(true);
  });

  it('should validate error responses', () => {
    const StringApiResponse = ApiResponse(TodoSchema);
    
    const errorResponse = {
      success: false,
      error: 'Something went wrong',
      message: 'Error occurred',
    };

    const result = StringApiResponse.safeParse(errorResponse);
    expect(result.success).toBe(true);
  });

  it('should allow optional data field', () => {
    const StringApiResponse = ApiResponse(TodoSchema);
    
    const responseWithoutData = {
      success: false,
      error: 'Not found',
    };

    const result = StringApiResponse.safeParse(responseWithoutData);
    expect(result.success).toBe(true);
  });

  it('should require success field', () => {
    const StringApiResponse = ApiResponse(TodoSchema);
    
    const responseWithoutSuccess = {
      data: 'test',
    };

    const result = StringApiResponse.safeParse(responseWithoutSuccess);
    expect(result.success).toBe(false);
  });
});

describe('TodosApiSchema', () => {
  describe('list endpoint', () => {
    it('should validate successful list response', () => {
      const validResponse = {
        success: true,
        data: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            title: 'Todo 1',
            status: 'pending' as const,
            priority: 'high' as const,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: '123e4567-e89b-12d3-a456-426614174001',
            syncStatus: 'synced' as const,
          },
        ],
      };

      const result = TodosApiSchema.list.response.safeParse(validResponse);
      expect(result.success).toBe(true);
    });
  });

  describe('create endpoint', () => {
    it('should validate create request body', () => {
      const validBody = {
        title: 'New Todo',
        description: 'Description',
        status: 'pending' as const,
        priority: 'medium' as const,
        userId: '123e4567-e89b-12d3-a456-426614174001',
      };

      const result = TodosApiSchema.create.body.safeParse(validBody);
      expect(result.success).toBe(true);
    });

    it('should validate create response', () => {
      const validResponse = {
        success: true,
        data: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          title: 'New Todo',
          status: 'pending' as const,
          priority: 'medium' as const,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: '123e4567-e89b-12d3-a456-426614174001',
          syncStatus: 'synced' as const,
        },
        message: 'Todo created',
      };

      const result = TodosApiSchema.create.response.safeParse(validResponse);
      expect(result.success).toBe(true);
    });
  });

  describe('update endpoint', () => {
    it('should validate update params', () => {
      const validParams = {
        id: '123e4567-e89b-12d3-a456-426614174000',
      };

      const result = TodosApiSchema.update.params.safeParse(validParams);
      expect(result.success).toBe(true);
    });

    it('should reject invalid UUID in params', () => {
      const invalidParams = {
        id: 'invalid-uuid',
      };

      const result = TodosApiSchema.update.params.safeParse(invalidParams);
      expect(result.success).toBe(false);
    });

    it('should validate partial update body', () => {
      const validBody = {
        title: 'Updated Title',
        priority: 'high' as const,
      };

      const result = TodosApiSchema.update.body.safeParse(validBody);
      expect(result.success).toBe(true);
    });
  });

  describe('delete endpoint', () => {
    it('should validate delete params', () => {
      const validParams = {
        id: '123e4567-e89b-12d3-a456-426614174000',
      };

      const result = TodosApiSchema.delete.params.safeParse(validParams);
      expect(result.success).toBe(true);
    });

    it('should validate delete response', () => {
      const validResponse = {
        success: true,
        data: {
          id: '123e4567-e89b-12d3-a456-426614174000',
        },
        message: 'Todo deleted',
      };

      const result = TodosApiSchema.delete.response.safeParse(validResponse);
      expect(result.success).toBe(true);
    });
  });

  describe('sync endpoint', () => {
    it('should validate sync request body', () => {
      const validBody = {
        todos: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            title: 'Synced Todo',
            status: 'pending' as const,
            priority: 'medium' as const,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: '123e4567-e89b-12d3-a456-426614174001',
            syncStatus: 'pending' as const,
          },
        ],
        lastSyncTimestamp: new Date(),
        conflicts: [],
      };

      const result = TodosApiSchema.sync.body.safeParse(validBody);
      expect(result.success).toBe(true);
    });
  });
});

describe('AuthApiSchema', () => {
  describe('login endpoint', () => {
    it('should validate login request body', () => {
      const validBody = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = AuthApiSchema.login.body.safeParse(validBody);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidBody = {
        email: 'invalid-email',
        password: 'password123',
      };

      const result = AuthApiSchema.login.body.safeParse(invalidBody);
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const invalidBody = {
        email: 'test@example.com',
        password: 'short',
      };

      const result = AuthApiSchema.login.body.safeParse(invalidBody);
      expect(result.success).toBe(false);
    });

    it('should validate login response', () => {
      const validResponse = {
        success: true,
        data: {
          user: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            email: 'test@example.com',
            name: 'Test User',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          token: 'jwt-token-here',
        },
      };

      const result = AuthApiSchema.login.response.safeParse(validResponse);
      expect(result.success).toBe(true);
    });
  });

  describe('register endpoint', () => {
    it('should validate register request body', () => {
      const validBody = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const result = AuthApiSchema.register.body.safeParse(validBody);
      expect(result.success).toBe(true);
    });

    it('should reject empty name', () => {
      const invalidBody = {
        email: 'test@example.com',
        password: 'password123',
        name: '',
      };

      const result = AuthApiSchema.register.body.safeParse(invalidBody);
      expect(result.success).toBe(false);
    });
  });

  describe('me endpoint', () => {
    it('should validate user profile response', () => {
      const validResponse = {
        success: true,
        data: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: 'test@example.com',
          name: 'Test User',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      const result = AuthApiSchema.me.response.safeParse(validResponse);
      expect(result.success).toBe(true);
    });
  });
});

describe('WebSocketEventSchema', () => {
  it('should validate todo:created event', () => {
    const validEvent = {
      type: 'todo:created',
      payload: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'New Todo',
        status: 'pending' as const,
        priority: 'medium' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: '123e4567-e89b-12d3-a456-426614174001',
        syncStatus: 'synced' as const,
      },
    };

    const result = WebSocketEventSchema.safeParse(validEvent);
    expect(result.success).toBe(true);
  });

  it('should validate todo:updated event', () => {
    const validEvent = {
      type: 'todo:updated',
      payload: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Updated Todo',
        status: 'completed' as const,
        priority: 'high' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: '123e4567-e89b-12d3-a456-426614174001',
        syncStatus: 'synced' as const,
      },
    };

    const result = WebSocketEventSchema.safeParse(validEvent);
    expect(result.success).toBe(true);
  });

  it('should validate todo:deleted event', () => {
    const validEvent = {
      type: 'todo:deleted',
      payload: {
        id: '123e4567-e89b-12d3-a456-426614174000',
      },
    };

    const result = WebSocketEventSchema.safeParse(validEvent);
    expect(result.success).toBe(true);
  });

  it('should validate sync:conflict event', () => {
    const baseTodo = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Conflicted Todo',
      status: 'pending' as const,
      priority: 'medium' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: '123e4567-e89b-12d3-a456-426614174001',
      syncStatus: 'conflict' as const,
    };

    const validEvent = {
      type: 'sync:conflict',
      payload: {
        todoId: '123e4567-e89b-12d3-a456-426614174000',
        serverVersion: baseTodo,
        clientVersion: { ...baseTodo, title: 'Different Title' },
      },
    };

    const result = WebSocketEventSchema.safeParse(validEvent);
    expect(result.success).toBe(true);
  });

  it('should reject invalid event type', () => {
    const invalidEvent = {
      type: 'invalid:event',
      payload: {},
    };

    const result = WebSocketEventSchema.safeParse(invalidEvent);
    expect(result.success).toBe(false);
  });

  it('should reject mismatched event type and payload', () => {
    const invalidEvent = {
      type: 'todo:created',
      payload: { id: 'some-id' }, // Should be a full todo object
    };

    const result = WebSocketEventSchema.safeParse(invalidEvent);
    expect(result.success).toBe(false);
  });
});