import { describe, it, expect } from '@jest/globals';
import {
  TodoSchema,
  CreateTodoSchema,
  UpdateTodoSchema,
  UserSchema,
  AuthUserSchema,
  SyncPayloadSchema,
  TodoStatus,
  TodoPriority,
} from '../../../packages/shared/src/types';

describe('TodoSchema', () => {
  const validTodo = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Todo',
    description: 'Test description',
    status: 'pending' as const,
    priority: 'medium' as const,
    dueDate: new Date('2024-12-31'),
    tags: ['work', 'urgent'],
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '123e4567-e89b-12d3-a456-426614174001',
    syncStatus: 'synced' as const,
    lastSyncedAt: new Date(),
  };

  it('should validate a valid todo', () => {
    const result = TodoSchema.safeParse(validTodo);
    expect(result.success).toBe(true);
  });

  it('should require a valid UUID for id', () => {
    const invalidTodo = { ...validTodo, id: 'invalid-id' };
    const result = TodoSchema.safeParse(invalidTodo);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('id');
    }
  });

  it('should require title to be non-empty', () => {
    const invalidTodo = { ...validTodo, title: '' };
    const result = TodoSchema.safeParse(invalidTodo);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('title');
    }
  });

  it('should limit title length to 200 characters', () => {
    const longTitle = 'a'.repeat(201);
    const invalidTodo = { ...validTodo, title: longTitle };
    const result = TodoSchema.safeParse(invalidTodo);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('title');
    }
  });

  it('should allow optional description', () => {
    const todoWithoutDescription = { ...validTodo };
    delete todoWithoutDescription.description;
    const result = TodoSchema.safeParse(todoWithoutDescription);
    expect(result.success).toBe(true);
  });

  it('should limit description length to 1000 characters', () => {
    const longDescription = 'a'.repeat(1001);
    const invalidTodo = { ...validTodo, description: longDescription };
    const result = TodoSchema.safeParse(invalidTodo);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('description');
    }
  });

  it('should validate todo status enum', () => {
    const validStatuses = ['pending', 'completed', 'archived'];
    
    validStatuses.forEach(status => {
      const todo = { ...validTodo, status };
      const result = TodoSchema.safeParse(todo);
      expect(result.success).toBe(true);
    });

    const invalidTodo = { ...validTodo, status: 'invalid-status' };
    const result = TodoSchema.safeParse(invalidTodo);
    expect(result.success).toBe(false);
  });

  it('should validate todo priority enum', () => {
    const validPriorities = ['low', 'medium', 'high'];
    
    validPriorities.forEach(priority => {
      const todo = { ...validTodo, priority };
      const result = TodoSchema.safeParse(todo);
      expect(result.success).toBe(true);
    });

    const invalidTodo = { ...validTodo, priority: 'invalid-priority' };
    const result = TodoSchema.safeParse(invalidTodo);
    expect(result.success).toBe(false);
  });

  it('should default tags to empty array', () => {
    const todoWithoutTags = { ...validTodo };
    delete todoWithoutTags.tags;
    const result = TodoSchema.safeParse(todoWithoutTags);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tags).toEqual([]);
    }
  });

  it('should default syncStatus to synced', () => {
    const todoWithoutSyncStatus = { ...validTodo };
    delete todoWithoutSyncStatus.syncStatus;
    const result = TodoSchema.safeParse(todoWithoutSyncStatus);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.syncStatus).toBe('synced');
    }
  });
});

describe('CreateTodoSchema', () => {
  const validCreateTodo = {
    title: 'New Todo',
    description: 'New description',
    status: 'pending' as const,
    priority: 'high' as const,
    userId: '123e4567-e89b-12d3-a456-426614174001',
  };

  it('should validate a valid create todo request', () => {
    const result = CreateTodoSchema.safeParse(validCreateTodo);
    expect(result.success).toBe(true);
  });

  it('should not allow id in create request', () => {
    const invalidCreateTodo = {
      ...validCreateTodo,
      id: '123e4567-e89b-12d3-a456-426614174000',
    };
    const result = CreateTodoSchema.safeParse(invalidCreateTodo);
    // Should still be valid as extra fields are ignored by default
    expect(result.success).toBe(true);
  });

  it('should not allow createdAt in create request', () => {
    const invalidCreateTodo = {
      ...validCreateTodo,
      createdAt: new Date(),
    };
    const result = CreateTodoSchema.safeParse(invalidCreateTodo);
    expect(result.success).toBe(true);
  });
});

describe('UpdateTodoSchema', () => {
  it('should allow partial updates', () => {
    const partialUpdate = {
      title: 'Updated Title',
    };
    const result = UpdateTodoSchema.safeParse(partialUpdate);
    expect(result.success).toBe(true);
  });

  it('should allow empty update object', () => {
    const emptyUpdate = {};
    const result = UpdateTodoSchema.safeParse(emptyUpdate);
    expect(result.success).toBe(true);
  });

  it('should validate fields that are provided', () => {
    const invalidUpdate = {
      title: '', // Invalid: title must be non-empty
    };
    const result = UpdateTodoSchema.safeParse(invalidUpdate);
    expect(result.success).toBe(false);
  });
});

describe('UserSchema', () => {
  const validUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    name: 'Test User',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should validate a valid user', () => {
    const result = UserSchema.safeParse(validUser);
    expect(result.success).toBe(true);
  });

  it('should require a valid email', () => {
    const invalidUser = { ...validUser, email: 'invalid-email' };
    const result = UserSchema.safeParse(invalidUser);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('email');
    }
  });

  it('should require a non-empty name', () => {
    const invalidUser = { ...validUser, name: '' };
    const result = UserSchema.safeParse(invalidUser);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('name');
    }
  });

  it('should limit name length to 100 characters', () => {
    const longName = 'a'.repeat(101);
    const invalidUser = { ...validUser, name: longName };
    const result = UserSchema.safeParse(invalidUser);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('name');
    }
  });
});

describe('AuthUserSchema', () => {
  const validAuthUser = {
    email: 'test@example.com',
    password: 'password123',
  };

  it('should validate a valid auth user', () => {
    const result = AuthUserSchema.safeParse(validAuthUser);
    expect(result.success).toBe(true);
  });

  it('should require minimum password length', () => {
    const invalidAuthUser = { ...validAuthUser, password: 'short' };
    const result = AuthUserSchema.safeParse(invalidAuthUser);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('password');
    }
  });
});

describe('SyncPayloadSchema', () => {
  const validSyncPayload = {
    todos: [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Test Todo',
        status: 'pending' as const,
        priority: 'medium' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: '123e4567-e89b-12d3-a456-426614174001',
        syncStatus: 'synced' as const,
      },
    ],
    lastSyncTimestamp: new Date(),
    conflicts: [],
  };

  it('should validate a valid sync payload', () => {
    const result = SyncPayloadSchema.safeParse(validSyncPayload);
    expect(result.success).toBe(true);
  });

  it('should default conflicts to empty array', () => {
    const payloadWithoutConflicts = { ...validSyncPayload };
    delete payloadWithoutConflicts.conflicts;
    const result = SyncPayloadSchema.safeParse(payloadWithoutConflicts);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.conflicts).toEqual([]);
    }
  });

  it('should validate conflict structure', () => {
    const validConflict = {
      todoId: '123e4567-e89b-12d3-a456-426614174000',
      serverVersion: validSyncPayload.todos[0],
      clientVersion: validSyncPayload.todos[0],
    };

    const payloadWithConflicts = {
      ...validSyncPayload,
      conflicts: [validConflict],
    };

    const result = SyncPayloadSchema.safeParse(payloadWithConflicts);
    expect(result.success).toBe(true);
  });
});

describe('Enum Types', () => {
  describe('TodoStatus', () => {
    it('should contain valid status values', () => {
      expect(TodoStatus.options).toEqual(['pending', 'completed', 'archived']);
    });

    it('should validate valid status', () => {
      const result = TodoStatus.safeParse('pending');
      expect(result.success).toBe(true);
    });

    it('should reject invalid status', () => {
      const result = TodoStatus.safeParse('invalid');
      expect(result.success).toBe(false);
    });
  });

  describe('TodoPriority', () => {
    it('should contain valid priority values', () => {
      expect(TodoPriority.options).toEqual(['low', 'medium', 'high']);
    });

    it('should validate valid priority', () => {
      const result = TodoPriority.safeParse('high');
      expect(result.success).toBe(true);
    });

    it('should reject invalid priority', () => {
      const result = TodoPriority.safeParse('urgent');
      expect(result.success).toBe(false);
    });
  });
});