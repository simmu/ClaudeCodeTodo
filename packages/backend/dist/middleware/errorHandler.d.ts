import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
export interface AppError extends Error {
    statusCode?: number;
}
export declare class HttpError extends Error implements AppError {
    statusCode: number;
    constructor(statusCode: number, message: string);
}
export declare const errorHandler: (err: Error | AppError | ZodError, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const asyncHandler: (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=errorHandler.d.ts.map