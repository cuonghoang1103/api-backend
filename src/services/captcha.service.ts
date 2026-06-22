/**
 * CAPTCHA Service — Cloudflare Turnstile verification.
 *
 * Why Cloudflare Turnstile?
 * - Free, unlimited
 * - Invisible (no user interaction required, no "I'm not a robot" puzzle)
 * - Privacy-friendly (no Google tracking)
 * - 1-line widget integration
 *
 * Setup:
 * 1. https://dash.cloudflare.com/?to=/:account/turnstile  → Add widget
 * 2. Copy Site Key (public, used in frontend) and Secret Key (private, used here)
 * 3. Add to .env:
 *    TURNSTILE_SITE_KEY=0x4AAAA...
 *    TURNSTILE_SECRET_KEY=0x4AAAA...
 *
 * If the env vars are NOT set, this service is disabled (returns true for all).
 * This is intentional for development — production MUST have these set.
 *
 * Reference: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */

import { logger } from '../utils/logger.js';

const TURNSTILE_VERIFY_URL =
 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

interface TurnstileVerifyResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
  action?: string;
  cdata?: string;
}

/**
 * Verify a Turnstile token. Returns true if the token is valid.
 * Returns true if the service is not configured (dev mode).
 */
export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string,
): Promise<{ success: boolean; error?: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  // If not configured, skip verification (development mode)
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      logger.error('TURNSTILE_SECRET_KEY not set in production!');
      return { success: false, error: 'CAPTCHA not configured' };
    }
    return { success: true };
  }

  if (!token || token.length === 0) {
    return { success: false, error: 'CAPTCHA token missing' };
  }

  try {
    const body = new URLSearchParams();
    body.append('secret', secret);
    body.append('response', token);
    if (remoteIp) body.append('remoteip', remoteIp);

    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!res.ok) {
      logger.error('Turnstile API error', { status: res.status });
      return { success: false, error: 'CAPTCHA service unavailable' };
    }

    const data = (await res.json()) as TurnstileVerifyResponse;

    if (!data.success) {
      logger.warn('Verification failed', { codes: data['error-codes'] });
      return { success: false, error: data['error-codes']?.join(', ') || 'Verification failed' };
    }

    return { success: true };
  } catch (err) {
    logger.error('Network error', { error: err instanceof Error ? err.message : String(err) });
    return { success: false, error: 'CAPTCHA service error' };
  }
}

/**
 * Returns the public site key for the frontend widget.
 * Returns null if not configured (frontend will skip the widget).
 */
export function getTurnstileSiteKey(): string | null {
  return process.env.TURNSTILE_SITE_KEY || null;
}
