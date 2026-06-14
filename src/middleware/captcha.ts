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
 */
import { Request, Response, NextFunction } from 'express';
import { verifyTurnstileToken } from '../services/captcha.service.js';
import { AppError } from './errorHandler.js';

export async function captchaMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  // Skip if not configured (development without env vars)
  if (!process.env.TURNSTILE_SECRET_KEY) {
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
