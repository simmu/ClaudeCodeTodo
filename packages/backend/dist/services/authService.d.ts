import { AuthUser } from '../types/shared.js';
export declare const authService: {
    register(userData: AuthUser & {
        name: string;
    }): Promise<{
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            name: string;
        };
        token: string;
    }>;
    login(userData: AuthUser): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        name: string;
    }>;
};
//# sourceMappingURL=authService.d.ts.map