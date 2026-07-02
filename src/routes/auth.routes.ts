import { Router, type Response, type Request, type NextFunction } from 'express';
import { body } from 'express-validator';
import { authService } from '../services/auth.service.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { softCaptchaMiddleware } from '../middleware/captcha.js';
import type { ApiResponse, AuthResponse } from '../types/index.js';

const router = Router();

// ─── POST /api/v1/auth/login ─────────────────────────────
router.post(
  '/login',
  // Soft captcha: an unverified user logging in from a fresh
  // browser/device may not have a Turnstile token yet (CDN
  // blocked, ad-blocker stripping 3rd-party scripts, mobile data
  // saver). The strict middleware would 403 them with no path
  // forward. With soft mode, the email-verified bypass still
  // applies, AND a missing token is allowed (just logged). An
  // INVALID token is still rejected so real abuse is blocked.
  softCaptchaMiddleware,
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
  // Soft captcha — email-OTP is the real security gate for new
  // accounts. Hard captcha would block users whose Turnstile widget
  // can't load (CDN blocked, browser extension, mobile data saver).
  softCaptchaMiddleware,
  [
    body('username')
      .isLength({ min: 3, max: 50 })
      .withMessage('Username must be 3-50 characters')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username can only contain letters, numbers, and underscores'),
    body('password')
      .isLength({ min: 12, max: 100 })
      .withMessage('Password must be at least 12 characters')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least 1 uppercase letter')
      .matches(/[a-z]/)
      .withMessage('Password must contain at least 1 lowercase letter')
      .matches(/[0-9]/)
      .withMessage('Password must contain at least 1 number')
      .matches(/[^A-Za-z0-9]/)
      .withMessage('Password must contain at least 1 special character'),
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

// ─── POST /api/v1/auth/verify-email-otp ──────────────────
// 6-digit OTP verification (replaces the long token-link flow)
router.post(
  '/verify-email-otp',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('code').matches(/^\d{6}$/).withMessage('Code must be 6 digits'),
  ],
  validate,
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      await authService.verifyEmailOtp(req.body.email, req.body.code);
      res.json({ success: true, message: 'Email đã được xác thực. Bạn có thể đăng nhập ngay.' });
    } catch (error) {
      next(error);
    }
  },
);

// ─── POST /api/v1/auth/resend-otp ────────────────────────
router.post(
  '/resend-otp',
  [body('email').isEmail().withMessage('Valid email is required')],
  validate,
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const result = await authService.resendVerificationOtp(req.body.email);
      // Always return the same response to prevent email enumeration
      res.json({
        success: true,
        message: 'Nếu email tồn tại và chưa được xác thực, chúng tôi đã gửi mã OTP mới.',
        data: { sent: result.sent, ttl: result.ttl },
      });
    } catch (error) {
      next(error);
    }
  },
);

// ─── POST /api/v1/auth/verify-email (token link — backward compat) ───
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

// ─── POST /api/v1/auth/resend-verification (token link — backward compat) ───
router.post(
  '/resend-verification',
  [body('email').isEmail().withMessage('Valid email is required')],
  validate,
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const result = await authService.resendVerificationEmail(req.body.email);
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

// ─── POST /api/v1/auth/oauth/token ────────────────────────
// Issued by the Next.js OAuth callback page (/api/auth/oauth/token) AFTER
// NextAuth has confirmed a Google/GitHub sign-in. This endpoint runs the
// same oauthRegister flow as above (auto-creates the user on first login,
// links the OAuth provider on subsequent logins) and sets the httpOnly
// `backend_token` cookie. Without this cookie the OAuth user would be
// authenticated in the client store but every server-side auth check
// (course enrollment, music history, etc.) would 401 with
// "No authentication token provided".
//
// NOTE: this route is intentionally NOT protected by captchaMiddleware
// (it's a programmatic server-to-server call from our own /oauth-callback
// page, not a user-facing form), and it does NOT require authenticate
// (we just want to issue a fresh JWT for the OAuth user).
router.post(
  '/oauth/token',
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

// ─── GET /api/v1/auth/captcha-config ─────────────────────
// Returns the public Turnstile site key + whether CAPTCHA is enabled.
// Frontend uses this to decide whether to render the widget and what key
// to pass it. The secret key NEVER leaves the backend.
//
// `required` is the *effective* flag — false if the master kill-switch
// (CAPTCHA_REQUIRED=false) is set OR if the secret isn't configured.
// `enabled` (kept for back-compat) just reflects whether the secret
// exists; the widget still needs to render in that case unless
// `required` is false.
router.get(
  '/captcha-config',
  (_req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const hasSecret = !!process.env.TURNSTILE_SECRET_KEY;
      const killSwitch =
        process.env.CAPTCHA_REQUIRED === 'false' ||
        process.env.CAPTCHA_REQUIRED === '0';
      res.json({
        success: true,
        data: {
          enabled: hasSecret && !killSwitch,
          siteKey: process.env.TURNSTILE_SITE_KEY ?? null,
          provider: 'cloudflare-turnstile',
          required: hasSecret && !killSwitch,
        },
      });
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

// ─── POST /api/v1/auth/forgot-password (sends 6-digit OTP) ───
router.post(
  '/forgot-password',
  // Soft captcha for the same reason as /login: a user trying to
  // recover a forgotten password is already in a high-friction
  // state; making them also solve a CAPTCHA they may not be able
  // to render is a terrible UX. The email-OTP step is the real
  // anti-abuse layer here.
  softCaptchaMiddleware,
  [body('email').isEmail().withMessage('Valid email is required')],
  validate,
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const result = await authService.forgotPassword(req.body.email);
      // Always return the same response to prevent email enumeration
      res.json({
        success: true,
        message: 'Nếu email tồn tại, chúng tôi đã gửi mã OTP đặt lại mật khẩu.',
        data: { sent: result.sent, ttl: result.ttl },
        // Dev only: include the OTP in dev mode for easy testing
        ...(process.env.NODE_ENV === 'development' && result.ttl > 0
          ? { devHint: 'OTP was sent. Check email or backend logs.' }
          : {}),
      });
    } catch (error) {
      next(error);
    }
  },
);

// ─── POST /api/v1/auth/reset-password-otp (verify OTP + new password) ───
router.post(
  '/reset-password-otp',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('code').matches(/^\d{6}$/).withMessage('Code must be 6 digits'),
    body('newPassword').isLength({ min: 12, max: 100 }).withMessage('Password must be at least 12 characters'),
  ],
  validate,
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      await authService.resetPasswordWithOtp(req.body.email, req.body.code, req.body.newPassword);
      res.json({ success: true, message: 'Mật khẩu đã được đặt lại thành công.' });
    } catch (error) {
      next(error);
    }
  },
);

// ─── POST /api/v1/auth/reset-password (token link — backward compat) ───
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

// ─── POST /api/v1/auth/refresh ──────────────────────────
// Reissue a fresh JWT from the caller's current (possibly just-expired)
// token so a session self-heals instead of dying silently after 24h
// while the 7-day cookie is still present. NOT behind `authenticate`
// (that would reject the expired token); we read the token manually and
// the service verifies it with ignoreExpiration + re-checks the account.
// The Next.js /api/auth/refresh proxy calls this and re-sets the cookie.
router.post(
  '/refresh',
  async (req: Request, res: Response<ApiResponse<AuthResponse>>, next: NextFunction) => {
    try {
      const header = req.headers.authorization;
      const token = header?.startsWith('Bearer ')
        ? header.slice(7)
        : (req.cookies?.backend_token as string | undefined);
      if (!token) {
        throw new AppError('No active session to refresh', 401, 'NO_SESSION');
      }
      const result = await authService.refreshToken(token);
      res.json({ success: true, data: result });
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
