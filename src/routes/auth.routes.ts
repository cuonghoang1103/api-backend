import { timingSafeEqual } from 'node:crypto';
import { Router, type Response, type Request, type NextFunction } from 'express';
import { body } from 'express-validator';
import { authService } from '../services/auth.service.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { softCaptchaMiddleware } from '../middleware/captcha.js';
import type { ApiResponse, AuthResponse } from '../types/index.js';
import mfaRoutes from './mfa.routes.js';
import { laLoiGoiNoiBo, xacMinhOAuth } from '../services/xacMinhOAuth.js';
import { luuTokenApple } from '../services/appleSiwa.service.js';
import {
  chuyenHuongLoi, doiMa, khoMacDinh, laMaApp, laNhaCungCapQuaWeb, laThu, laTrangThai, taoMa, type MaApp,
} from '../services/maDangNhapApp.js';
import { logger } from '../utils/logger.js';

const router = Router();

// MFA (TOTP) step-up cho admin — /api/v1/auth/mfa/*. Xem routes/mfa.routes.ts.
router.use('/mfa', mfaRoutes);

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
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 ngày (08/11/2026) — gia hạn trượt ở frontend lib/hetPhien.ts
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
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 ngày (08/11/2026) — gia hạn trượt ở frontend lib/hetPhien.ts
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
    // Ảnh đại diện nhà cung cấp trả về — KHÔNG bắt buộc (Apple không có).
    // Phải là https: `luuAnhOAuth` tải ảnh này về, nên đây là một URL do
    // client cung cấp mà máy chủ sẽ đi gọi — chặn http/ftp/file ngay ở cửa.
    body('avatarUrl').optional({ values: 'falsy' }).isURL({ protocols: ['https'], require_protocol: true })
      .withMessage('avatarUrl must be an https URL'),
  ],
  validate,
  async (req: Request, res: Response<ApiResponse<AuthResponse>>, next: NextFunction) => {
    try {
      // ⛔ Trước 18/10/2026 route này cấp phiên cho BẤT KỲ email nào gửi lên (chiếm tài khoản).
      // Giờ phải có bằng chứng: chữ ký nội bộ của máy chủ Next, hoặc token Apple/Google hợp lệ.
      const xm = await xacMinhOAuth(req.headers as Record<string, unknown>, req.body);
      if (!xm.ok) {
        logger.warn('[oauth] từ chối cấp phiên', { lyDo: xm.lyDo, provider: req.body?.provider, ip: req.ip });
        throw new AppError('Không xác minh được đăng nhập với nhà cung cấp. Thử đăng nhập lại.', 401, 'OAUTH_UNVERIFIED');
      }
      const result = await authService.oauthRegister(req.body);
      // Sign in with Apple: đổi authorizationCode lấy refresh token (mã hoá) để thu hồi khi xoá tài khoản. Chạy nền.
      if (xm.cach === 'apple' && req.body?.authorizationCode) {
        void luuTokenApple(result.userId, xm.aud, String(req.body.providerId), String(req.body.authorizationCode));
      }
      res.cookie('backend_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 ngày (08/11/2026) — gia hạn trượt ở frontend lib/hetPhien.ts
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
    // Ảnh đại diện nhà cung cấp trả về — KHÔNG bắt buộc (Apple không có).
    // Phải là https: `luuAnhOAuth` tải ảnh này về, nên đây là một URL do
    // client cung cấp mà máy chủ sẽ đi gọi — chặn http/ftp/file ngay ở cửa.
    body('avatarUrl').optional({ values: 'falsy' }).isURL({ protocols: ['https'], require_protocol: true })
      .withMessage('avatarUrl must be an https URL'),
  ],
  validate,
  async (req: Request, res: Response<ApiResponse<AuthResponse>>, next: NextFunction) => {
    try {
      // ⛔ Trước 18/10/2026 route này cấp phiên cho BẤT KỲ email nào gửi lên (chiếm tài khoản).
      // Giờ phải có bằng chứng: chữ ký nội bộ của máy chủ Next, hoặc token Apple/Google hợp lệ.
      const xm = await xacMinhOAuth(req.headers as Record<string, unknown>, req.body);
      if (!xm.ok) {
        logger.warn('[oauth] từ chối cấp phiên', { lyDo: xm.lyDo, provider: req.body?.provider, ip: req.ip });
        throw new AppError('Không xác minh được đăng nhập với nhà cung cấp. Thử đăng nhập lại.', 401, 'OAUTH_UNVERIFIED');
      }
      const result = await authService.oauthRegister(req.body);
      // Sign in with Apple: đổi authorizationCode lấy refresh token (mã hoá) để thu hồi khi xoá tài khoản. Chạy nền.
      if (xm.cach === 'apple' && req.body?.authorizationCode) {
        void luuTokenApple(result.userId, xm.aud, String(req.body.providerId), String(req.body.authorizationCode));
      }
      res.cookie('backend_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 ngày (08/11/2026) — gia hạn trượt ở frontend lib/hetPhien.ts
        path: '/',
      });
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

// ─── Đăng nhập app di động QUA WEB (16/11/2026) ───────────
// App mở ASWebAuthenticationSession tới cuongthai.com/dang-nhap-app → web đăng nhập Google/GitHub bằng NextAuth →
// máy chủ Next gọi /app/tao-ma (chữ ký nội bộ) → chuyển hướng `<scheme>://dang-nhap?ma=…&trangThai=…` → app gọi
// /app/doi-ma kèm mã xác minh PKCE. Luật bảo mật: đầu file services/maDangNhapApp.ts.

// POST /api/v1/auth/app/tao-ma — CHỈ máy chủ Next (đã xác minh đăng nhập ở NextAuth).
router.post(
  '/app/tao-ma',
  (req: Request, _res: Response, next: NextFunction) => {
    // Chặn TRƯỚC khi kiểm thân: bên ngoài không được biết gì về tuyến này ngoài 401.
    if (!laLoiGoiNoiBo(req.headers as Record<string, unknown>)) {
      next(new AppError('Unauthorized', 401, 'NOI_BO_ONLY'));
      return;
    }
    next();
  },
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('provider').custom((v) => laNhaCungCapQuaWeb(v)).withMessage('provider must be google or github'),
    body('providerId').isString().notEmpty().withMessage('Provider ID is required'),
    body('avatarUrl').optional({ values: 'falsy' }).isURL({ protocols: ['https'], require_protocol: true })
      .withMessage('avatarUrl must be an https URL'),
    body('app').custom((v) => laMaApp(v)).withMessage('app không được phép'),
    body('trangThai').custom((v) => laTrangThai(v)).withMessage('trangThai sai định dạng'),
    body('thu').custom((v) => laThu(v)).withMessage('thu sai định dạng'),
  ],
  validate,
  async (req: Request, res: Response<ApiResponse<{ chuyenHuong: string }>>, next: NextFunction) => {
    try {
      const { email, fullName, provider, providerId, avatarUrl, app, trangThai, thu } = req.body as Record<string, string>;
      let userId: number;
      try {
        const r = await authService.oauthRegister({ email, fullName, provider, providerId, avatarUrl });
        userId = r.userId;
      } catch (e) {
        // Tài khoản bị khoá / vô hiệu / là agent ⇒ báo VỀ APP (qua scheme cố định) để app hiện câu dễ hiểu,
        // thay vì bỏ người dùng đứng trên trang lỗi trong cửa sổ đăng nhập.
        if (e instanceof AppError && e.statusCode === 403) {
          res.json({ success: true, data: { chuyenHuong: chuyenHuongLoi(app as MaApp, trangThai, e.code ?? 'FORBIDDEN') } });
          return;
        }
        throw e;
      }
      const { chuyenHuong } = await taoMa(await khoMacDinh(), { userId, app, trangThai, thu });
      res.json({ success: true, data: { chuyenHuong } });
    } catch (error) {
      next(error);
    }
  },
);

// POST /api/v1/auth/app/doi-ma — app đổi mã một lần lấy phiên (cùng dạng AuthResponse với /login, /oauth/token).
router.post(
  '/app/doi-ma',
  [
    body('ma').isString().notEmpty(),
    body('app').isString().notEmpty(),
    body('trangThai').isString().notEmpty(),
    body('maXacMinh').isString().notEmpty(),
  ],
  validate,
  async (req: Request, res: Response<ApiResponse<AuthResponse>>, next: NextFunction) => {
    try {
      const kq = await doiMa(await khoMacDinh(), req.body);
      if (!kq.ok) {
        logger.warn('[app-dang-nhap] từ chối đổi mã', { lyDo: kq.lyDo, app: String(req.body?.app ?? '').slice(0, 20), ip: req.ip });
        // Một câu chung cho mọi lý do — không cho người dò biết sai ở khâu nào.
        throw new AppError('Mã đăng nhập không hợp lệ hoặc đã hết hạn. Thử đăng nhập lại.', 400, 'APP_LOGIN_CODE_INVALID');
      }
      const result = await authService.capPhienChoApp(kq.userId, { ip: req.ip, userAgent: req.headers['user-agent'] });
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
// Internal-only: the NextAuth server calls this (server→server) during token
// refresh to keep the role/roleVersion fresh. Requires the internal HMAC
// signature (x-cuongthai-noi-bo) or a matching X-Internal-Token, so external
// callers can't enumerate users / probe roles.
router.get(
  '/role',
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      // 10/11/2026: BẮT BUỘC lời gọi nội bộ. Trước đây INTERNAL_API_SECRET chưa từng được đặt trên VPS ⇒ chốt cũ
      // là no-op ⇒ bất kỳ ai cũng tra được role/roleVersion của một email. Nay nhận một trong hai:
      // chữ ký HMAC x-cuongthai-noi-bo (máy chủ Next luôn gửi — lib/auth.ts) hoặc X-Internal-Token khớp secret.
      const secret = process.env.INTERNAL_API_SECRET;
      // 15/11/2026: so bằng timingSafeEqual (không `===`) — `===` dừng ở ký tự lệch đầu tiên, lộ dần secret qua thời gian phản hồi.
      const tok = req.headers['x-internal-token'];
      const a = typeof tok === 'string' ? Buffer.from(tok) : null; const b = secret ? Buffer.from(secret) : null;
      const quaSecret = !!a && !!b && a.length === b.length && timingSafeEqual(a, b);
      if (!quaSecret && !laLoiGoiNoiBo(req.headers as Record<string, unknown>)) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
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
    body('newPassword').isLength({ min: 12, max: 100 }).withMessage('New password must be at least 12 characters'),
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
    body('newPassword').isLength({ min: 12, max: 100 }).withMessage('Password must be at least 12 characters'),
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

// ─── POST /api/v1/auth/logout-all (15/11/2026) ──────────
// "Đăng xuất mọi thiết bị khác": tăng roleVersion ⇒ mọi JWT khác chết ngay (authenticate + /auth/refresh so phiên bản);
// máy đang bấm nhận cặp token MỚI trong `data` để ở lại. Client không lưu token mới thì cũng bị đăng xuất — an toàn.
router.post('/logout-all', authenticate, async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const data = await authService.dangXuatMoiThietBi(req.userId!, req.user?.mfaAt);
    res.json({ success: true, message: 'Đã đăng xuất mọi thiết bị khác.', data });
  } catch (error) {
    next(error);
  }
});

export default router;
