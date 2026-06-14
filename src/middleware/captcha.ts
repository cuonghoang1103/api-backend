/**
 * CAPTCHA verification middleware.
 *
 * Reads the Turnstile token from `cf-turnstile-response` header or `cf-turnstile-response` body field,
 * verifies it via Cloudflare, and rejects with 403 if invalid.
 *
 * Usage:
 *   router.post('/login', captchaMiddleware, handler);
 *   router.post('/register', captchaMiddleware, handler);
 *
 * If TURNSTILE_SECRET_KEY is not set, middleware is a no-op (dev mode).
 *
 * Bypass rules (intentional, to avoid lockouts for trusted accounts when
 * the Turnstile widget can't load — e.g. corporate networks blocking
 * challenges.cloudflare.com, browser extensions stripping the script,
 * or the admin signing in from a region where the widget fails to
 * render):
 *   1. TURNSTILE_SECRET_KEY is not set  → skip
 *   2. Body's `username` / `email` matches ADMIN_EMAILS env (CSV)  → skip
 *   3. Body's `username` / `email` belongs to a user that already has
 *      role `admin` in the DB  → skip
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

function getBypassAdminSet(): Set<string> {
  const raw = process.env.ADMIN_EMAILS || process.env.ADMIN_USERNAME || '';
  return new Set(
    raw
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
}

async function isAdminLogin(req: Request): Promise<boolean> {
  const body = (req.body ?? {}) as Record<string, unknown>;
  const raw = String(
    body.username ?? body.email ?? body.userId ?? ''
  ).trim();
  if (!raw) return false;

  const lower = raw.toLowerCase();
  const allow = getBypassAdminSet();
  if (allow.has(lower)) return true;

  // DB lookup — only proceed if the account actually has role `admin`.
  // We try email first, then username.
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
    if (!user) return false;
    return user.roles.some((ur: { role: { name: string } }) => {
      const name = (ur.role?.name ?? '').toUpperCase();
      return name === 'ADMIN' || name === 'ROLE_ADMIN';
    });
  } catch (err) {
    console.warn('[captcha] Bypass lookup failed, falling back to captcha check:', err);
    return false;
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

  // Bypass for admin logins — see file header for rationale.
  if (await isAdminLogin(req)) {
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
