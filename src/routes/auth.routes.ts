import { Router, type Response, type Request, type NextFunction } from 'express';
import { body } from 'express-validator';
import { authService } from '../services/auth.service.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import type { ApiResponse, AuthResponse } from '../types/index.js';

const router = Router();

// ─── POST /api/v1/auth/login ─────────────────────────────
router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  async (req: Request, res: Response<ApiResponse<AuthResponse>>, next: NextFunction) => {
    try {
      const { username, password } = req.body;
      const result = await authService.login(username, password, {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      });

      res.cookie('backend_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/',
      });

      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

// ─── POST /api/v1/auth/register ──────────────────────────
router.post(
  '/register',
  [
    body('username')
      .isLength({ min: 3, max: 50 })
      .withMessage('Username must be 3-50 characters')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username can only contain letters, numbers, and underscores'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('email').isEmail().withMessage('Valid email is required'),
  ],
  validate,
  async (req: Request, res: Response<ApiResponse<AuthResponse>>, next: NextFunction) => {
    try {
      const result = await authService.register(req.body);
      res.cookie('backend_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/',
      });
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

// ─── POST /api/v1/auth/verify-email ─────────────────────
router.post(
  '/verify-email',
  [body('token').notEmpty().withMessage('Token is required')],
  validate,
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      await authService.verifyEmail(req.body.token);
      res.json({ success: true, message: 'Email đã được xác thực. Bạn có thể đăng nhập ngay.' });
    } catch (error) {
      next(error);
    }
  },
);

// ─── POST /api/v1/auth/resend-verification ──────────────
router.post(
  '/resend-verification',
  [body('email').isEmail().withMessage('Valid email is required')],
  validate,
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const result = await authService.resendVerificationEmail(req.body.email);
      // Always return the same response to prevent email enumeration
      res.json({
        success: true,
        message: 'Nếu email tồn tại và chưa được xác thực, chúng tôi đã gửi link xác thực mới.',
        data: { sent: result.sent },
      });
    } catch (error) {
      next(error);
    }
  },
);
// ─── POST /api/v1/auth/oauth/register ───────────────────
router.post(
  '/oauth/register',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('provider').notEmpty().withMessage('Provider is required'),
    body('providerId').notEmpty().withMessage('Provider ID is required'),
  ],
  validate,
  async (req: Request, res: Response<ApiResponse<AuthResponse>>, next: NextFunction) => {
    try {
      const result = await authService.oauthRegister(req.body);
      res.cookie('backend_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      });
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

// ─── GET /api/v1/auth/role ──────────────────────────────
router.get(
  '/role',
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const email = req.query.email as string;
      if (!email) {
        res.status(400).json({ success: false, message: 'Email is required' });
        return;
      }
      const result = await authService.getRoleByEmail(email);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

// ─── POST /api/v1/auth/change-password ─────────────────
router.post(
  '/change-password',
  authenticate,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  ],
  validate,
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      await authService.changePassword(req.userId!, req.body.currentPassword, req.body.newPassword);
      res.clearCookie('backend_token');
      res.json({ success: true, message: 'Password changed successfully. Please log in again.' });
    } catch (error) {
      next(error);
    }
  },
);

// ─── POST /api/v1/auth/forgot-password ──────────────────
router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('Valid email is required')],
  validate,
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const token = await authService.forgotPassword(req.body.email);
      res.json({
        success: true,
        message: 'If an account with that email exists, a reset link has been sent.',
        ...(process.env.NODE_ENV === 'development' && token ? { data: { token } } : {}),
      });
    } catch (error) {
      next(error);
    }
  },
);

// ─── POST /api/v1/auth/reset-password ───────────────────
router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Token is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      await authService.resetPassword(req.body.token, req.body.newPassword);
      res.json({ success: true, message: 'Password has been reset successfully.' });
    } catch (error) {
      next(error);
    }
  },
);

// ─── POST /api/v1/auth/logout ───────────────────────────
router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('backend_token');
  res.json({ success: true, message: 'Logged out successfully.' });
});

export default router;
