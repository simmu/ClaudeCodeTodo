import prisma from '../utils/db.js';
import { HttpError } from '../middleware/errorHandler.js';
export const todoService = {
    async getTodos(userId, filters) {
        const { status, priority, search, limit = 50, offset = 0 } = filters || {};
        const where = { userId };
        if (status) {
            where.status = status.toUpperCase();
        }
        if (priority) {
            where.priority = priority.toUpperCase();
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [todos, total] = await Promise.all([
            prisma.todo.findMany({
                where,
                orderBy: [
                    { priority: 'desc' },
                    { createdAt: 'desc' },
                ],
                take: limit,
                skip: offset,
            }),
            prisma.todo.count({ where }),
        ]);
        return {
            todos: todos.map(todo => ({
                ...todo,
                status: todo.status.toLowerCase(),
                priority: todo.priority.toLowerCase(),
                syncStatus: todo.syncStatus.toLowerCase(),
            })),
            pagination: {
                total,
                limit,
                offset,
                hasMore: offset + limit < total,
            },
        };
    },
    async getTodoById(id, userId) {
        const todo = await prisma.todo.findFirst({
            where: { id, userId },
        });
        if (!todo) {
            throw new HttpError(404, 'Todo not found');
        }
        return {
            ...todo,
            status: todo.status.toLowerCase(),
            priority: todo.priority.toLowerCase(),
            syncStatus: todo.syncStatus.toLowerCase(),
        };
    },
    async createTodo(todoData, userId) {
        const todo = await prisma.todo.create({
            data: {
                ...todoData,
                userId,
                status: (todoData.status?.toUpperCase() || 'PENDING'),
                priority: (todoData.priority?.toUpperCase() || 'MEDIUM'),
            },
        });
        return {
            ...todo,
            status: todo.status.toLowerCase(),
            priority: todo.priority.toLowerCase(),
            syncStatus: todo.syncStatus.toLowerCase(),
        };
    },
    async updateTodo(id, todoData, userId) {
        const existingTodo = await prisma.todo.findFirst({
            where: { id, userId },
        });
        if (!existingTodo) {
            throw new HttpError(404, 'Todo not found');
        }
        const updateData = { ...todoData };
        if (todoData.status) {
            updateData.status = todoData.status.toUpperCase();
        }
        if (todoData.priority) {
            updateData.priority = todoData.priority.toUpperCase();
        }
        const todo = await prisma.todo.update({
            where: { id },
            data: updateData,
        });
        return {
            ...todo,
            status: todo.status.toLowerCase(),
            priority: todo.priority.toLowerCase(),
            syncStatus: todo.syncStatus.toLowerCase(),
        };
    },
    async deleteTodo(id, userId) {
        const existingTodo = await prisma.todo.findFirst({
            where: { id, userId },
        });
        if (!existingTodo) {
            throw new HttpError(404, 'Todo not found');
        }
        await prisma.todo.delete({
            where: { id },
        });
        return { message: 'Todo deleted successfully' };
    },
    async toggleTodo(id, userId) {
        const todo = await prisma.todo.findFirst({
            where: { id, userId },
        });
        if (!todo) {
            throw new HttpError(404, 'Todo not found');
        }
        const newStatus = todo.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
        const updatedTodo = await prisma.todo.update({
            where: { id },
            data: { status: newStatus },
        });
        return {
            ...updatedTodo,
            status: updatedTodo.status.toLowerCase(),
            priority: updatedTodo.priority.toLowerCase(),
            syncStatus: updatedTodo.syncStatus.toLowerCase(),
        };
    },
};
//# sourceMappingURL=todoService.js.map