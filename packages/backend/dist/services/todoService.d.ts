import { CreateTodo, UpdateTodo } from '../types/shared.js';
export declare const todoService: {
    getTodos(userId: string, filters?: {
        status?: string;
        priority?: string;
        search?: string;
        limit?: number;
        offset?: number;
    }): Promise<{
        todos: {
            status: string;
            priority: string;
            syncStatus: string;
            id: string;
            title: string;
            description: string | null;
            dueDate: Date | null;
            tags: string[];
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            lastSyncedAt: Date | null;
        }[];
        pagination: {
            total: number;
            limit: number;
            offset: number;
            hasMore: boolean;
        };
    }>;
    getTodoById(id: string, userId: string): Promise<{
        status: string;
        priority: string;
        syncStatus: string;
        id: string;
        title: string;
        description: string | null;
        dueDate: Date | null;
        tags: string[];
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        lastSyncedAt: Date | null;
    }>;
    createTodo(todoData: CreateTodo, userId: string): Promise<{
        status: string;
        priority: string;
        syncStatus: string;
        id: string;
        title: string;
        description: string | null;
        dueDate: Date | null;
        tags: string[];
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        lastSyncedAt: Date | null;
    }>;
    updateTodo(id: string, todoData: UpdateTodo, userId: string): Promise<{
        status: string;
        priority: string;
        syncStatus: string;
        id: string;
        title: string;
        description: string | null;
        dueDate: Date | null;
        tags: string[];
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        lastSyncedAt: Date | null;
    }>;
    deleteTodo(id: string, userId: string): Promise<{
        message: string;
    }>;
    toggleTodo(id: string, userId: string): Promise<{
        status: string;
        priority: string;
        syncStatus: string;
        id: string;
        title: string;
        description: string | null;
        dueDate: Date | null;
        tags: string[];
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        lastSyncedAt: Date | null;
    }>;
};
//# sourceMappingURL=todoService.d.ts.map