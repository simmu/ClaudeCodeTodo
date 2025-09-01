import { Router } from 'express';
import { z } from 'zod';
import { syncService } from '../services/syncService.js';
import { validate } from '../middleware/validation.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

// All sync routes require authentication
router.use(authenticate);

const SyncPayloadSchema = z.object({
  todos: z.array(z.object({
    id: z.string().uuid(),
    title: z.string().min(1).max(200),
    description: z.string().max(1000).optional(),
    status: z.enum(['pending', 'completed', 'archived']),
    priority: z.enum(['low', 'medium', 'high']),
    dueDate: z.string().datetime().transform(str => new Date(str)).optional(),
    tags: z.array(z.string()).default([]),
    createdAt: z.string().datetime().transform(str => new Date(str)),
    updatedAt: z.string().datetime().transform(str => new Date(str)),
    userId: z.string().uuid(),
    syncStatus: z.enum(['synced', 'pending', 'conflict']).default('synced'),
    lastSyncedAt: z.string().datetime().transform(str => new Date(str)).optional(),
  })),
  lastSyncTimestamp: z.string().datetime().transform(str => new Date(str)),
  conflicts: z.array(z.object({
    todoId: z.string().uuid(),
    serverVersion: z.any(),
    clientVersion: z.any(),
  })).default([]),
});

const ConflictResolutionSchema = z.object({
  todoId: z.string().uuid(),
  resolution: z.enum(['client', 'server']),
  resolvedTodo: z.any().optional(),
});

// POST /api/sync - Sync todos
router.post('/', validate(SyncPayloadSchema), asyncHandler(async (req: AuthRequest, res) => {
  const result = await syncService.syncTodos(req.userId!, req.body);
  res.json({
    message: 'Sync completed successfully',
    ...result,
  });
}));

// GET /api/sync/timestamp - Get last sync timestamp
router.get('/timestamp', asyncHandler(async (req: AuthRequest, res) => {
  const result = await syncService.getLastSyncTimestamp(req.userId!);
  res.json(result);
}));

// POST /api/sync/resolve-conflict - Resolve sync conflict
router.post('/resolve-conflict', validate(ConflictResolutionSchema), asyncHandler(async (req: AuthRequest, res) => {
  const { todoId, resolution } = req.body;
  const result = await syncService.resolveConflict(req.userId!, todoId, resolution);
  res.json({
    message: 'Conflict resolved successfully',
    todo: result,
  });
}));

export { router as syncRoutes };