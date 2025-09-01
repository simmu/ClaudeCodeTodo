import { Router } from 'express';
import { z } from 'zod';
import { todoService } from '../services/todoService.js';
import { validate } from '../middleware/validation.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
const router = Router();
// All todo routes require authentication
router.use(authenticate);
const CreateTodoSchema = z.object({
    title: z.string().min(1).max(200),
    description: z.string().max(1000).optional(),
    status: z.enum(['pending', 'completed', 'archived']).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    dueDate: z.string().datetime().transform(str => new Date(str)).optional(),
    tags: z.array(z.string()).default([]),
});
const UpdateTodoSchema = CreateTodoSchema.partial();
const QuerySchema = z.object({
    status: z.enum(['pending', 'completed', 'archived']).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    search: z.string().optional(),
    limit: z.string().transform(str => parseInt(str, 10)).refine(num => num > 0 && num <= 100).optional(),
    offset: z.string().transform(str => parseInt(str, 10)).refine(num => num >= 0).optional(),
});
// GET /api/todos - Get all todos for user
router.get('/', asyncHandler(async (req, res) => {
    const filters = QuerySchema.parse(req.query);
    const result = await todoService.getTodos(req.userId, filters);
    res.json(result);
}));
// GET /api/todos/:id - Get specific todo
router.get('/:id', asyncHandler(async (req, res) => {
    const todo = await todoService.getTodoById(req.params.id, req.userId);
    res.json({ todo });
}));
// POST /api/todos - Create new todo
router.post('/', validate(CreateTodoSchema), asyncHandler(async (req, res) => {
    const todo = await todoService.createTodo(req.body, req.userId);
    res.status(201).json({
        message: 'Todo created successfully',
        todo,
    });
}));
// PUT /api/todos/:id - Update todo
router.put('/:id', validate(UpdateTodoSchema), asyncHandler(async (req, res) => {
    const todo = await todoService.updateTodo(req.params.id, req.body, req.userId);
    res.json({
        message: 'Todo updated successfully',
        todo,
    });
}));
// DELETE /api/todos/:id - Delete todo
router.delete('/:id', asyncHandler(async (req, res) => {
    const result = await todoService.deleteTodo(req.params.id, req.userId);
    res.json(result);
}));
// PATCH /api/todos/:id/toggle - Toggle todo completion status
router.patch('/:id/toggle', asyncHandler(async (req, res) => {
    const todo = await todoService.toggleTodo(req.params.id, req.userId);
    res.json({
        message: 'Todo status toggled successfully',
        todo,
    });
}));
export { router as todoRoutes };
//# sourceMappingURL=todos.js.map