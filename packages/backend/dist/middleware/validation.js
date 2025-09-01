import { ZodError } from 'zod';
export const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: error.errors.map(e => ({
                        path: e.path.join('.'),
                        message: e.message,
                    })),
                });
            }
            next(error);
        }
    };
};
//# sourceMappingURL=validation.js.map