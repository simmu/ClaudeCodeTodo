import jwt from 'jsonwebtoken';
import { HttpError } from './errorHandler.js';
export const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        throw new HttpError(401, 'Access denied. No token provided.');
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        throw new HttpError(401, 'Invalid token.');
    }
};
//# sourceMappingURL=auth.js.map