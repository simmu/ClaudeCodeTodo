import { z } from 'zod';
export declare const ApiResponse: <T extends z.ZodType>(dataSchema: T) => z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<T>;
    error: z.ZodOptional<z.ZodString>;
    message: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    success: z.ZodBoolean;
    data: z.ZodOptional<T>;
    error: z.ZodOptional<z.ZodString>;
    message: z.ZodOptional<z.ZodString>;
}>, any> extends infer T_1 ? { [k in keyof T_1]: T_1[k]; } : never, z.baseObjectInputType<{
    success: z.ZodBoolean;
    data: z.ZodOptional<T>;
    error: z.ZodOptional<z.ZodString>;
    message: z.ZodOptional<z.ZodString>;
}> extends infer T_2 ? { [k_1 in keyof T_2]: T_2[k_1]; } : never>;
export type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
};
export declare const TodosApiSchema: {
    list: {
        response: z.ZodObject<{
            success: z.ZodBoolean;
            data: z.ZodOptional<z.ZodArray<z.ZodObject<{
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
            }>, "many">>;
            error: z.ZodOptional<z.ZodString>;
            message: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            success: boolean;
            message?: string | undefined;
            data?: {
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
            }[] | undefined;
            error?: string | undefined;
        }, {
            success: boolean;
            message?: string | undefined;
            data?: {
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
            }[] | undefined;
            error?: string | undefined;
        }>;
    };
    create: {
        body: z.ZodObject<Omit<{
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
        response: z.ZodObject<{
            success: z.ZodBoolean;
            data: z.ZodOptional<z.ZodObject<{
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
            }>>;
            error: z.ZodOptional<z.ZodString>;
            message: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            success: boolean;
            message?: string | undefined;
            data?: {
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
            } | undefined;
            error?: string | undefined;
        }, {
            success: boolean;
            message?: string | undefined;
            data?: {
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
            } | undefined;
            error?: string | undefined;
        }>;
    };
    update: {
        params: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
        body: z.ZodObject<{
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
        response: z.ZodObject<{
            success: z.ZodBoolean;
            data: z.ZodOptional<z.ZodObject<{
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
            }>>;
            error: z.ZodOptional<z.ZodString>;
            message: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            success: boolean;
            message?: string | undefined;
            data?: {
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
            } | undefined;
            error?: string | undefined;
        }, {
            success: boolean;
            message?: string | undefined;
            data?: {
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
            } | undefined;
            error?: string | undefined;
        }>;
    };
    delete: {
        params: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
        response: z.ZodObject<{
            success: z.ZodBoolean;
            data: z.ZodOptional<z.ZodObject<{
                id: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                id: string;
            }, {
                id: string;
            }>>;
            error: z.ZodOptional<z.ZodString>;
            message: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            success: boolean;
            message?: string | undefined;
            data?: {
                id: string;
            } | undefined;
            error?: string | undefined;
        }, {
            success: boolean;
            message?: string | undefined;
            data?: {
                id: string;
            } | undefined;
            error?: string | undefined;
        }>;
    };
    sync: {
        body: z.ZodObject<{
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
        response: z.ZodObject<{
            success: z.ZodBoolean;
            data: z.ZodOptional<z.ZodObject<{
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
            }>>;
            error: z.ZodOptional<z.ZodString>;
            message: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            success: boolean;
            message?: string | undefined;
            data?: {
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
            } | undefined;
            error?: string | undefined;
        }, {
            success: boolean;
            message?: string | undefined;
            data?: {
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
            } | undefined;
            error?: string | undefined;
        }>;
    };
};
export declare const AuthApiSchema: {
    login: {
        body: z.ZodObject<{
            email: z.ZodString;
            password: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            email: string;
            password: string;
        }, {
            email: string;
            password: string;
        }>;
        response: z.ZodObject<{
            success: z.ZodBoolean;
            data: z.ZodOptional<z.ZodObject<{
                user: z.ZodObject<{
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
                token: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                user: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    name: string;
                };
                token: string;
            }, {
                user: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    name: string;
                };
                token: string;
            }>>;
            error: z.ZodOptional<z.ZodString>;
            message: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            success: boolean;
            message?: string | undefined;
            data?: {
                user: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    name: string;
                };
                token: string;
            } | undefined;
            error?: string | undefined;
        }, {
            success: boolean;
            message?: string | undefined;
            data?: {
                user: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    name: string;
                };
                token: string;
            } | undefined;
            error?: string | undefined;
        }>;
    };
    register: {
        body: z.ZodObject<{
            email: z.ZodString;
            password: z.ZodString;
            name: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            email: string;
            name: string;
            password: string;
        }, {
            email: string;
            name: string;
            password: string;
        }>;
        response: z.ZodObject<{
            success: z.ZodBoolean;
            data: z.ZodOptional<z.ZodObject<{
                user: z.ZodObject<{
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
                token: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                user: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    name: string;
                };
                token: string;
            }, {
                user: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    name: string;
                };
                token: string;
            }>>;
            error: z.ZodOptional<z.ZodString>;
            message: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            success: boolean;
            message?: string | undefined;
            data?: {
                user: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    name: string;
                };
                token: string;
            } | undefined;
            error?: string | undefined;
        }, {
            success: boolean;
            message?: string | undefined;
            data?: {
                user: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    name: string;
                };
                token: string;
            } | undefined;
            error?: string | undefined;
        }>;
    };
    me: {
        response: z.ZodObject<{
            success: z.ZodBoolean;
            data: z.ZodOptional<z.ZodObject<{
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
            }>>;
            error: z.ZodOptional<z.ZodString>;
            message: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            success: boolean;
            message?: string | undefined;
            data?: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                name: string;
            } | undefined;
            error?: string | undefined;
        }, {
            success: boolean;
            message?: string | undefined;
            data?: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                name: string;
            } | undefined;
            error?: string | undefined;
        }>;
    };
};
export declare const WebSocketEventSchema: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"todo:created">;
    payload: z.ZodObject<{
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
    type: "todo:created";
    payload: {
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
    type: "todo:created";
    payload: {
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
}>, z.ZodObject<{
    type: z.ZodLiteral<"todo:updated">;
    payload: z.ZodObject<{
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
    type: "todo:updated";
    payload: {
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
    type: "todo:updated";
    payload: {
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
}>, z.ZodObject<{
    type: z.ZodLiteral<"todo:deleted">;
    payload: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "todo:deleted";
    payload: {
        id: string;
    };
}, {
    type: "todo:deleted";
    payload: {
        id: string;
    };
}>, z.ZodObject<{
    type: z.ZodLiteral<"sync:conflict">;
    payload: z.ZodObject<{
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
    }>;
}, "strip", z.ZodTypeAny, {
    type: "sync:conflict";
    payload: {
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
    };
}, {
    type: "sync:conflict";
    payload: {
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
    };
}>]>;
export type WebSocketEvent = z.infer<typeof WebSocketEventSchema>;
//# sourceMappingURL=api.d.ts.map