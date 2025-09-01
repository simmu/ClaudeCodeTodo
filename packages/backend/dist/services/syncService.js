import prisma from '../utils/db.js';
import { HttpError } from '../middleware/errorHandler.js';
export const syncService = {
    async syncTodos(userId, syncPayload) {
        const { todos: clientTodos, lastSyncTimestamp } = syncPayload;
        // Get server todos modified after last sync
        const serverTodos = await prisma.todo.findMany({
            where: {
                userId,
                updatedAt: {
                    gt: lastSyncTimestamp,
                },
            },
        });
        // Convert server todos to client format
        const formattedServerTodos = serverTodos.map(todo => ({
            ...todo,
            status: todo.status.toLowerCase(),
            priority: todo.priority.toLowerCase(),
            syncStatus: todo.syncStatus.toLowerCase(),
        }));
        const conflicts = [];
        const toUpdate = [];
        const toCreate = [];
        // Process client todos
        for (const clientTodo of clientTodos) {
            const serverTodo = formattedServerTodos.find(t => t.id === clientTodo.id);
            if (serverTodo) {
                // Check for conflicts
                if (serverTodo.updatedAt > clientTodo.updatedAt) {
                    conflicts.push({
                        todoId: clientTodo.id,
                        serverVersion: serverTodo,
                        clientVersion: clientTodo,
                    });
                }
                else if (clientTodo.updatedAt > serverTodo.updatedAt) {
                    // Client version is newer, update server
                    toUpdate.push(clientTodo);
                }
            }
            else {
                // Todo doesn't exist on server, create it
                toCreate.push(clientTodo);
            }
        }
        // Perform updates
        const updatePromises = toUpdate.map(todo => prisma.todo.update({
            where: { id: todo.id },
            data: {
                title: todo.title,
                description: todo.description,
                status: todo.status.toUpperCase(),
                priority: todo.priority.toUpperCase(),
                dueDate: todo.dueDate,
                tags: todo.tags,
                updatedAt: todo.updatedAt,
            },
        }));
        // Perform creates
        const createPromises = toCreate.map(todo => prisma.todo.create({
            data: {
                id: todo.id,
                title: todo.title,
                description: todo.description,
                status: todo.status.toUpperCase(),
                priority: todo.priority.toUpperCase(),
                dueDate: todo.dueDate,
                tags: todo.tags,
                createdAt: todo.createdAt,
                updatedAt: todo.updatedAt,
                userId,
            },
        }));
        await Promise.all([...updatePromises, ...createPromises]);
        // Get all current todos for the user
        const allTodos = await prisma.todo.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
        });
        const formattedTodos = allTodos.map(todo => ({
            ...todo,
            status: todo.status.toLowerCase(),
            priority: todo.priority.toLowerCase(),
            syncStatus: todo.syncStatus.toLowerCase(),
        }));
        return {
            todos: formattedTodos,
            conflicts,
            lastSyncTimestamp: new Date(),
        };
    },
    async resolveConflict(userId, todoId, resolution) {
        const todo = await prisma.todo.findFirst({
            where: { id: todoId, userId },
        });
        if (!todo) {
            throw new HttpError(404, 'Todo not found');
        }
        if (resolution === 'server') {
            // Mark as synced, no changes needed
            const updatedTodo = await prisma.todo.update({
                where: { id: todoId },
                data: { syncStatus: 'SYNCED' },
            });
            return {
                ...updatedTodo,
                status: updatedTodo.status.toLowerCase(),
                priority: updatedTodo.priority.toLowerCase(),
                syncStatus: updatedTodo.syncStatus.toLowerCase(),
            };
        }
        // If client resolution, the client should send the resolved version
        throw new HttpError(400, 'Client resolution requires sending the resolved todo data');
    },
    async getLastSyncTimestamp(userId) {
        const lastTodo = await prisma.todo.findFirst({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
            select: { updatedAt: true },
        });
        return {
            lastSyncTimestamp: lastTodo?.updatedAt || new Date(0),
        };
    },
};
//# sourceMappingURL=syncService.js.map