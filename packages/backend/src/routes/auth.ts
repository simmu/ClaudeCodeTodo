import { Router } from 'express';
import { z } from 'zod';
import { authService } from '../services/authService.js';
import { validate } from '../middleware/validation.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(100),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Register
router.post('/register', validate(RegisterSchema), asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json({
    message: 'User registered successfully',
    ...result,
  });
}));

// Login
router.post('/login', validate(LoginSchema), asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.json({
    message: 'Login successful',
    ...result,
  });
}));

// Get Profile
router.get('/profile', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const user = await authService.getProfile(req.userId!);
  res.json({ user });
}));

export { router as authRoutes };