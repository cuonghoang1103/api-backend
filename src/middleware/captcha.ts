/**
 * Soft captcha middleware for routes where a Turnstile token is OPTIONAL.
 *
 * Why soft mode?
 *   The user-flow for /register /forgot-password is: user has no
 *   account yet → can't be matched against the DB → captchaMiddleware
 *   would always 403 "CAPTCHA verification required" on a brand new
 *   identity. That's especially painful when the Turnstile widget
 *   itself fails to render (CDN blocked, browser extension stripping
 *   3rd-party scripts, mobile data saver) — the user sees a 403 with
 *   no widget to click and no way to recover.
 *
 *   For these routes the email-OTP step is the real security gate.
 *   This middleware:
 *     • If a `cf-turnstile-response` token is present → verify it
 *       (normal strict check). Invalid token → 403.
 *     • If no token → accept the request. We log it so abuse is
 *       still visible to ops.
 *
 * `required` mode (the original captchaMiddleware) stays available for
 * flows that genuinely need a challenge on every request (e.g. a
 * public unauthenticated form with no other anti-abuse layer).
 *
 * Reads the Turnstile token from `cf-turnstile-response` header or
 * `cf-turnstile-response` body field, verifies it via Cloudflare, and
 * rejects with 403 if invalid.
 *
 * Usage:
 *   router.post('/login', captchaMiddleware, handler);
 *   router.post('/register', captchaMiddleware, handler);
 *
 * Master switch: set CAPTCHA_REQUIRED=false in env to disable the
 * check globally. This is the supported way to turn it off for users
 * who can't see the Turnstile widget (CDN blocked by corporate
 * firewall, browser extension stripping 3rd-party scripts, etc.).
 *
 * Per-request bypass rules (run when CAPTCHA_REQUIRED is not 'false'):
 *   1. TURNSTILE_SECRET_KEY is not set  → skip
 *   2. CAPTCHA_REQUIRED=false          → skip
 *   3. Body's `username` / `email` matches ADMIN_EMAILS env (CSV) → skip
 *   4. Body's `username` / `email` belongs to a user that already has
 *      role `admin` in the DB  → skip
 *   5. Body's `username` / `email` belongs to a user with
 *      email_verified = true (i.e. they passed OTP) → skip
 *
 * The bypass lookup is best-effort and DB-failure-tolerant — if the DB
 * is down, the request still proceeds through the regular captcha check
 * (i.e. fail-safe open only for the allow-list, fail-safe closed for
 * everyone else).
 */
import { Request, Response, NextFunction } from 'express';
import { verifyTurnstileToken } from '../services/captcha.service.js';
import { AppError } from './errorHandler.js';
import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';

function captchaRequired(): boolean {
  // Default ON when the secret is configured. Opt-out via env.
  if (process.env.CAPTCHA_REQUIRED === 'false') return false;
  if (process.env.CAPTCHA_REQUIRED === '0') return false;
  return true;
}

function getBypassAdminSet(): Set<string> {
  const raw = process.env.ADMIN_EMAILS || process.env.ADMIN_USERNAME || '';
  return new Set(
    raw
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
}

/**
 * Returns 'bypass' if the request body identifies a trusted user
 * (admin, or an account that has completed email verification). We
 * allow the bypass for verified users because the email-OTP flow
 * already proved they control the email address — the captcha adds
 * friction without adding security. Returns 'require' otherwise.
 */
async function shouldBypassCaptcha(req: Request): Promise<'bypass' | 'require'> {
  const body = (req.body ?? {}) as Record<string, unknown>;
  const raw = String(
    body.username ?? body.email ?? body.userId ?? '',
  ).trim();
  if (!raw) return 'require';

  const lower = raw.toLowerCase();
  const allow = getBypassAdminSet();
  if (allow.has(lower)) return 'bypass';

  // DB lookup — only bypass if the account is admin or email-verified.
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: raw, mode: 'insensitive' } },
          { username: { equals: raw, mode: 'insensitive' } },
        ],
      },
      include: { roles: { include: { role: true } } },
    });
    if (!user) return 'require';
    if (user.emailVerified) return 'bypass';
    const isAdmin = user.roles.some((ur: { role: { name: string } }) => {
      const name = (ur.role?.name ?? '').toUpperCase();
      return name === 'ADMIN' || name === 'ROLE_ADMIN';
    });
    return isAdmin ? 'bypass' : 'require';
  } catch (err) {
    logger.warn('captcha bypass lookup failed, falling back to captcha check', { error: err instanceof Error ? err.message : String(err) });
    return 'require';
  }
}

export async function captchaMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  // Skip if not configured (development without env vars)
  if (!process.env.TURNSTILE_SECRET_KEY) {
    return next();
  }

  // Master kill-switch
  if (!captchaRequired()) {
    return next();
  }

  // Bypass for admin logins & email-verified users — see file header.
  if ((await shouldBypassCaptcha(req)) === 'bypass') {
    return next();
  }

  // Token can be in header (preferred) or body
  const token =
    (req.headers['cf-turnstile-response'] as string | undefined) ??
    (typeof req.body === 'object' && req.body !== null
      ? (req.body as Record<string, unknown>)['cf-turnstile-response']
      : undefined);

  if (!token || typeof token !== 'string') {
    next(new AppError('CAPTCHA verification required', 403, 'CAPTCHA_REQUIRED'));
    return;
  }

  const result = await verifyTurnstileToken(token, req.ip);

  if (!result.success) {
    next(new AppError('CAPTCHA verification failed', 403, 'CAPTCHA_INVALID'));
    return;
  }

  next();
}

/**
 * Soft variant — see file header. Used on /register and
 * /forgot-password where email-OTP is the actual security gate.
 */
export async function softCaptchaMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  if (!process.env.TURNSTILE_SECRET_KEY) {
    return next();
  }
  if (!captchaRequired()) {
    return next();
  }

  // Bypass for admin/verified-user logins (login flow only — register
  // has no account yet, so this lookup will normally return 'require').
  if ((await shouldBypassCaptcha(req)) === 'bypass') {
    return next();
  }

  const token =
    (req.headers['cf-turnstile-response'] as string | undefined) ??
    (typeof req.body === 'object' && req.body !== null
      ? (req.body as Record<string, unknown>)['cf-turnstile-response']
      : undefined);

  if (!token || typeof token !== 'string' || token.length === 0) {
    // Soft mode: missing token is OK — email-OTP is the real gate.
    // Still log a warning so ops can see when many requests are
    // skipping the challenge (could indicate bot pressure).
 if (process.env.NODE_ENV !== 'test') {
 logger.warn('captcha soft-mode: no Turnstile token', { path: req.path });
 }
    return next();
  }

  const result = await verifyTurnstileToken(token, req.ip);

  if (!result.success) {
    // A token WAS supplied but it's invalid — that's a real abuse
    // signal, reject it.
    next(new AppError('CAPTCHA verification failed', 403, 'CAPTCHA_INVALID'));
    return;
  }

  next();
}
