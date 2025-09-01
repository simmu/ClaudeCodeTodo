import { z } from 'zod';
export declare const TodoStatus: z.ZodEnum<["pending", "completed", "archived"]>;
export type TodoStatus = z.infer<typeof TodoStatus>;
export declare const TodoPriority: z.ZodEnum<["low", "medium", "high"]>;
export type TodoPriority = z.infer<typeof TodoPriority>;
export declare const TodoSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["pending", "completed", "archived"]>;
    priority: z.ZodEnum<["low", "medium", "high"]>;
    dueDate: z.ZodOptional<z.ZodDate>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    userId: z.ZodString;
    syncStatus: z.ZodDefault<z.ZodEnum<["synced", "pending", "conflict"]>>;
    lastSyncedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
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
}, {
    status: "pending" | "completed" | "archived";
    id: string;
    title: string;
    priority: "low" | "medium" | "high";
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    description?: string | undefined;
    dueDate?: Date | undefined;
    tags?: string[] | undefined;
    syncStatus?: "pending" | "synced" | "conflict" | undefined;
    lastSyncedAt?: Date | undefined;
}>;
export type Todo = z.infer<typeof TodoSchema>;
export declare const CreateTodoSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["pending", "completed", "archived"]>;
    priority: z.ZodEnum<["low", "medium", "high"]>;
    dueDate: z.ZodOptional<z.ZodDate>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    userId: z.ZodString;
    syncStatus: z.ZodDefault<z.ZodEnum<["synced", "pending", "conflict"]>>;
    lastSyncedAt: z.ZodOptional<z.ZodDate>;
}, "id" | "createdAt" | "updatedAt" | "syncStatus" | "lastSyncedAt">, "strip", z.ZodTypeAny, {
    status: "pending" | "completed" | "archived";
    title: string;
    priority: "low" | "medium" | "high";
    tags: string[];
    userId: string;
    description?: string | undefined;
    dueDate?: Date | undefined;
}, {
    status: "pending" | "completed" | "archived";
    title: string;
    priority: "low" | "medium" | "high";
    userId: string;
    description?: string | undefined;
    dueDate?: Date | undefined;
    tags?: string[] | undefined;
}>;
export type CreateTodo = z.infer<typeof CreateTodoSchema>;
export declare const UpdateTodoSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["pending", "completed", "archived"]>>;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    priority: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
    dueDate: z.ZodOptional<z.ZodOptional<z.ZodDate>>;
    tags: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
    userId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status?: "pending" | "completed" | "archived" | undefined;
    title?: string | undefined;
    description?: string | undefined;
    priority?: "low" | "medium" | "high" | undefined;
    dueDate?: Date | undefined;
    tags?: string[] | undefined;
    userId?: string | undefined;
}, {
    status?: "pending" | "completed" | "archived" | undefined;
    title?: string | undefined;
    description?: string | undefined;
    priority?: "low" | "medium" | "high" | undefined;
    dueDate?: Date | undefined;
    tags?: string[] | undefined;
    userId?: string | undefined;
}>;
export type UpdateTodo = z.infer<typeof UpdateTodoSchema>;
export declare const UserSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    name: z.ZodString;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    name: string;
}, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    name: string;
}>;
export type User = z.infer<typeof UserSchema>;
export declare const AuthUserSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type AuthUser = z.infer<typeof AuthUserSchema>;
export declare const SyncPayloadSchema: z.ZodObject<{
    todos: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        status: z.ZodEnum<["pending", "completed", "archived"]>;
        priority: z.ZodEnum<["low", "medium", "high"]>;
        dueDate: z.ZodOptional<z.ZodDate>;
        tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
        userId: z.ZodString;
        syncStatus: z.ZodDefault<z.ZodEnum<["synced", "pending", "conflict"]>>;
        lastSyncedAt: z.ZodOptional<z.ZodDate>;
    }, "strip", z.ZodTypeAny, {
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
    }, {
        status: "pending" | "completed" | "archived";
        id: string;
        title: string;
        priority: "low" | "medium" | "high";
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        description?: string | undefined;
        dueDate?: Date | undefined;
        tags?: string[] | undefined;
        syncStatus?: "pending" | "synced" | "conflict" | undefined;
        lastSyncedAt?: Date | undefined;
    }>, "many">;
    lastSyncTimestamp: z.ZodDate;
    conflicts: z.ZodDefault<z.ZodArray<z.ZodObject<{
        todoId: z.ZodString;
        serverVersion: z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            status: z.ZodEnum<["pending", "completed", "archived"]>;
            priority: z.ZodEnum<["low", "medium", "high"]>;
            dueDate: z.ZodOptional<z.ZodDate>;
            tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            createdAt: z.ZodDate;
            updatedAt: z.ZodDate;
            userId: z.ZodString;
            syncStatus: z.ZodDefault<z.ZodEnum<["synced", "pending", "conflict"]>>;
            lastSyncedAt: z.ZodOptional<z.ZodDate>;
        }, "strip", z.ZodTypeAny, {
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
        }, {
            status: "pending" | "completed" | "archived";
            id: string;
            title: string;
            priority: "low" | "medium" | "high";
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            description?: string | undefined;
            dueDate?: Date | undefined;
            tags?: string[] | undefined;
            syncStatus?: "pending" | "synced" | "conflict" | undefined;
            lastSyncedAt?: Date | undefined;
        }>;
        clientVersion: z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            status: z.ZodEnum<["pending", "completed", "archived"]>;
            priority: z.ZodEnum<["low", "medium", "high"]>;
            dueDate: z.ZodOptional<z.ZodDate>;
            tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            createdAt: z.ZodDate;
            updatedAt: z.ZodDate;
            userId: z.ZodString;
            syncStatus: z.ZodDefault<z.ZodEnum<["synced", "pending", "conflict"]>>;
            lastSyncedAt: z.ZodOptional<z.ZodDate>;
        }, "strip", z.ZodTypeAny, {
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
        }, {
            status: "pending" | "completed" | "archived";
            id: string;
            title: string;
            priority: "low" | "medium" | "high";
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            description?: string | undefined;
            dueDate?: Date | undefined;
            tags?: string[] | undefined;
            syncStatus?: "pending" | "synced" | "conflict" | undefined;
            lastSyncedAt?: Date | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        todoId: string;
        serverVersion: {
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
    }, {
        todoId: string;
        serverVersion: {
            status: "pending" | "completed" | "archived";
            id: string;
            title: string;
            priority: "low" | "medium" | "high";
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            description?: string | undefined;
            dueDate?: Date | undefined;
            tags?: string[] | undefined;
            syncStatus?: "pending" | "synced" | "conflict" | undefined;
            lastSyncedAt?: Date | undefined;
        };
        clientVersion: {
            status: "pending" | "completed" | "archived";
            id: string;
            title: string;
            priority: "low" | "medium" | "high";
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            description?: string | undefined;
            dueDate?: Date | undefined;
            tags?: string[] | undefined;
            syncStatus?: "pending" | "synced" | "conflict" | undefined;
            lastSyncedAt?: Date | undefined;
        };
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    todos: {
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
    }[];
    lastSyncTimestamp: Date;
    conflicts: {
        todoId: string;
        serverVersion: {
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
}, {
    todos: {
        status: "pending" | "completed" | "archived";
        id: string;
        title: string;
        priority: "low" | "medium" | "high";
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        description?: string | undefined;
        dueDate?: Date | undefined;
        tags?: string[] | undefined;
        syncStatus?: "pending" | "synced" | "conflict" | undefined;
        lastSyncedAt?: Date | undefined;
    }[];
    lastSyncTimestamp: Date;
    conflicts?: {
        todoId: string;
        serverVersion: {
            status: "pending" | "completed" | "archived";
            id: string;
            title: string;
            priority: "low" | "medium" | "high";
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            description?: string | undefined;
            dueDate?: Date | undefined;
            tags?: string[] | undefined;
            syncStatus?: "pending" | "synced" | "conflict" | undefined;
            lastSyncedAt?: Date | undefined;
        };
        clientVersion: {
            status: "pending" | "completed" | "archived";
            id: string;
            title: string;
            priority: "low" | "medium" | "high";
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            description?: string | undefined;
            dueDate?: Date | undefined;
            tags?: string[] | undefined;
            syncStatus?: "pending" | "synced" | "conflict" | undefined;
            lastSyncedAt?: Date | undefined;
        };
    }[] | undefined;
}>;
export type SyncPayload = z.infer<typeof SyncPayloadSchema>;
//# sourceMappingURL=shared.d.ts.map