/**
 * /api/v1/auth/mfa — MFA (TOTP) step-up cho admin.
 *
 * Mọi route dùng `authenticate` (KHÔNG `requireAdmin`): đây chính là lối để
 * lấy được claim `mfaAt`, nên nó không được đòi `mfaAt` — kể cả khi
 * `ADMIN_MFA_ENFORCE=true`. `/setup` và `/enable` tự kiểm vai trò admin.
 *
 * Giới hạn tốc độ: ngoài `authLimiter` chung của /auth (theo IP), mỗi cặp
 * user+IP có thêm một xô riêng. Chống dò mã thật sự nằm ở bộ đếm sai mã
 * 5 lần/15 phút/user trong mfa.service.ts (không phụ thuộc IP).
 */
import { Router, type Request, type Response, type NextFunction, type RequestHandler } from 'express';
import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { getRedis } from '../config/redis.js';
import { logger } from '../utils/logger.js';
import { authService } from '../services/auth.service.js';
import * as mfa from '../services/mfa/mfa.service.js';

const router = Router();

function ipCua(req: Request): string {
  const xff = (req.headers['x-forwarded-for'] as string | undefined)
    ?.split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return xff?.[xff.length - 1] || req.ip || 'unknown';
}

const sendCommand = async (...args: string[]): Promise<unknown> => (await getRedis()).sendCommand(args);

function taoLimiter(prefix: string, windowMs: number, max: number): RequestHandler {
  const lim = rateLimit({
    windowMs,
    max,
    store: new RedisStore({ sendCommand: sendCommand as never, prefix }),
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => `u:${req.userId ?? 0}|ip:${ipCua(req)}`,
    message: {
      success: false,
      message: 'Thao tác MFA quá dày, chờ một lát. / Too many MFA requests, please wait.',
      code: 'MFA_RATE_LIMITED',
    },
  });
  // Fail-open như mọi limiter khác của repo: Redis chết không được làm 500
  // cả lối xác minh (bộ đếm sai mã vẫn có bản trong bộ nhớ).
  return (req, res, next) =>
    lim(req, res, (err?: unknown) => {
      if (err) {
        logger.warn('[mfa] rate-limit store lỗi — cho qua', { error: err instanceof Error ? err.message : String(err) });
        return next();
      }
      next();
    });
}

const limDoc = taoLimiter('rl:mfa:doc:', 60_000, 60);
const limGhi = taoLimiter('rl:mfa:ghi:', 15 * 60_000, 20);

/**
 * Đặt cookie `backend_token` y như `/api/auth/login` + `/api/auth/refresh`
 * (Next) đang đặt: httpOnly, secure ở production, sameSite=lax, path=/,
 * 7 ngày. Proxy `/api/v1/[[...path]]` chuyển nguyên `Set-Cookie` về trình
 * duyệt, nên request được THỬ LẠI ngay sau đó mang token mới có `mfaAt`.
 * App (desktop/iOS) không dùng cookie thì đọc `data.token` trong thân.
 */
function datCookie(res: Response, token: string): void {
  res.cookie('backend_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

const maTotp = body('code').optional({ values: 'falsy' }).isString().trim().matches(/^\d{6}$/).withMessage('Mã gồm 6 chữ số / Code must be 6 digits');
const maKhoiPhuc = body('recoveryCode').optional({ values: 'falsy' }).isString().trim().isLength({ min: 10, max: 16 }).withMessage('Mã khôi phục không hợp lệ / Invalid recovery code');
const motTrongHai = body().custom((b) => {
  if (!b?.code && !b?.recoveryCode) throw new Error('Cần mã 6 số hoặc mã khôi phục / Provide code or recoveryCode');
  return true;
});

// GET /status
router.get('/status', authenticate, limDoc, async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ success: true, data: await mfa.trangThai(req.userId!, req.user) });
  } catch (e) { next(e); }
});

// POST /setup — chỉ admin, sinh secret TẠM
router.post('/setup', authenticate, limGhi, async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.setHeader('Cache-Control', 'no-store');
    res.json({ success: true, data: await mfa.batDauThietLap(req.userId!, ipCua(req)) });
  } catch (e) { next(e); }
});

// POST /enable {code}
router.post(
  '/enable',
  authenticate,
  limGhi,
  [body('code').isString().trim().matches(/^\d{6}$/).withMessage('Mã gồm 6 chữ số / Code must be 6 digits')],
  validate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { recoveryCodes, mfaAt } = await mfa.batMfa(req.userId!, req.body.code, ipCua(req));
      const auth = await authService.capTokenSauMfa(req.userId!, mfaAt);
      datCookie(res, auth.token);
      res.setHeader('Cache-Control', 'no-store');
      res.json({ success: true, data: { ...auth, recoveryCodes, mfaAt } });
    } catch (e) { next(e); }
  },
);

// POST /verify {code | recoveryCode} — step-up
router.post(
  '/verify',
  authenticate,
  limGhi,
  [maTotp, maKhoiPhuc, motTrongHai],
  validate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { mfaAt, usedRecoveryCode } = await mfa.xacMinh(
        req.userId!,
        { code: req.body.code, recoveryCode: req.body.recoveryCode },
        ipCua(req),
      );
      const auth = await authService.capTokenSauMfa(req.userId!, mfaAt);
      datCookie(res, auth.token);
      res.json({ success: true, data: { ...auth, mfaAt, usedRecoveryCode } });
    } catch (e) { next(e); }
  },
);

// POST /disable {code | recoveryCode}
router.post(
  '/disable',
  authenticate,
  limGhi,
  [maTotp, maKhoiPhuc, motTrongHai],
  validate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await mfa.tatMfa(req.userId!, { code: req.body.code, recoveryCode: req.body.recoveryCode }, ipCua(req));
      res.json({ success: true, data: { enabled: false } });
    } catch (e) { next(e); }
  },
);

// POST /recovery-codes {code}
router.post(
  '/recovery-codes',
  authenticate,
  limGhi,
  [body('code').isString().trim().matches(/^\d{6}$/).withMessage('Mã gồm 6 chữ số / Code must be 6 digits')],
  validate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.setHeader('Cache-Control', 'no-store');
      res.json({ success: true, data: await mfa.sinhLaiMaKhoiPhuc(req.userId!, req.body.code, ipCua(req)) });
    } catch (e) { next(e); }
  },
);

export default router;
