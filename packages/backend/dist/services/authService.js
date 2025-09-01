import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/db.js';
import { HttpError } from '../middleware/errorHandler.js';
export const authService = {
    async register(userData) {
        const existingUser = await prisma.user.findUnique({
            where: { email: userData.email },
        });
        if (existingUser) {
            throw new HttpError(400, 'User already exists');
        }
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        const user = await prisma.user.create({
            data: {
                email: userData.email,
                name: userData.name,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
        return { user, token };
    },
    async login(userData) {
        const user = await prisma.user.findUnique({
            where: { email: userData.email },
        });
        if (!user) {
            throw new HttpError(401, 'Invalid credentials');
        }
        const isValidPassword = await bcrypt.compare(userData.password, user.password);
        if (!isValidPassword) {
            throw new HttpError(401, 'Invalid credentials');
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            token,
        };
    },
    async getProfile(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            throw new HttpError(404, 'User not found');
        }
        return user;
    },
};
//# sourceMappingURL=authService.js.map