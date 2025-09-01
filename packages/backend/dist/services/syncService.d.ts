import { SyncPayload } from '../types/shared.js';
export declare const syncService: {
    syncTodos(userId: string, syncPayload: SyncPayload): Promise<{
        todos: {
            status: "pending" | "completed" | "archived";
            priority: "low" | "medium" | "high";
            syncStatus: "synced" | "pending" | "conflict";
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
        conflicts: {
            todoId: string;
            serverVersion: {
                status: "pending" | "completed" | "archived";
                priority: "low" | "medium" | "high";
                syncStatus: "synced" | "pending" | "conflict";
                id: string;
                title: string;
                description: string | null;
                dueDate: Date | null;
                tags: string[];
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                lastSyncedAt: Date | null;
            };
            clientVersion: {
                status: "pending" | "completed" | "archived";
                id: string;
                title: string;
                priority: "low" | "medium" | "high";
                tags: string[];
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                syncStatus: "pending" | "synced" | "conflict";
                description?: string | undefined;
                dueDate?: Date | undefined;
                lastSyncedAt?: Date | undefined;
            };
        }[];
        lastSyncTimestamp: Date;
    }>;
    resolveConflict(userId: string, todoId: string, resolution: "client" | "server"): Promise<{
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
    getLastSyncTimestamp(userId: string): Promise<{
        lastSyncTimestamp: Date;
    }>;
};
//# sourceMappingURL=syncService.d.ts.map