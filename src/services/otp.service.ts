/**
 * OTP Service — 6-digit one-time codes for email verification and password reset.
 *
 * Storage: Redis with TTL
 * Key format:
 *   otp:{type}:{email} = "123456"  (TTL 300s for verify, 600s for reset)
 *   otp:{type}:{email}:attempts = <count>  (TTL same as OTP, for brute-force protection)
 *
 * Why not reuse the existing EmailVerificationToken / PasswordResetToken tables?
 * - They're long tokens meant for email links (24h for verify, 1h for reset).
 * - OTPs need short TTLs (5-10 min), and brute-force attempt tracking.
 * - Adding both creates inconsistency — pick one model per flow.
 *
 * Migration plan: keep tables for backward compat (verify-email-link still works
 * for users who click the link in email), but new flows use OTP. After 30 days
 * the tables can be dropped if OTP adoption is full.
 */
import { getRedis } from '../config/redis.js';

export type OtpType = 'verify' | 'reset';

const OTP_LENGTH = 6;
const VERIFY_TTL_SECONDS = 5 * 60; // 5 minutes
const RESET_TTL_SECONDS = 10 * 60; // 10 minutes
const MAX_ATTEMPTS = 5;

export interface OtpSendResult {
  /** Always true to avoid email enumeration. Caller should not reveal whether email exists. */
  sent: boolean;
  /** The OTP code — only returned in development for testing. NEVER expose in production. */
  devCode?: string;
}

/**
 * Generate a 6-digit OTP and store it in Redis with TTL.
 * Also resets the attempt counter for this email.
 */
export async function generateOtp(
  email: string,
  type: OtpType,
): Promise<OtpSendResult> {
  const normalized = email.toLowerCase().trim();
  const key = otpKey(normalized, type);
  const attemptsKey = attemptsKeyFor(normalized, type);

  // Generate cryptographically random 6-digit code
  const code = await generateSecureCode();
  const ttl = type === 'verify' ? VERIFY_TTL_SECONDS : RESET_TTL_SECONDS;

  const redis = await getRedis();
  // SETEX = SET with expiration. Overwrites any previous OTP.
  await redis.set(key, code, { EX: ttl });
  // Reset attempts counter when new OTP is generated
  await redis.del(attemptsKey);

  return {
    sent: true,
    ...(process.env.NODE_ENV === 'development' ? { devCode: code } : {}),
  };
}

/**
 * Verify an OTP. Returns true on success, false on failure.
 * Increments attempt counter on every call; locks after MAX_ATTEMPTS.
 * On success, the OTP is deleted (one-time use).
 */
export async function verifyOtp(
  email: string,
  code: string,
  type: OtpType,
): Promise<{ valid: boolean; reason?: 'NOT_FOUND' | 'EXPIRED' | 'TOO_MANY_ATTEMPTS' | 'INVALID' }> {
  const normalized = email.toLowerCase().trim();
  const key = otpKey(normalized, type);
  const attemptsKey = attemptsKeyFor(normalized, type);

  const redis = await getRedis();
  const stored = await redis.get(key);

  if (!stored) {
    return { valid: false, reason: 'NOT_FOUND' };
  }

  // Check brute-force attempts
  const attemptsStr = await redis.get(attemptsKey);
  const attempts = attemptsStr ? parseInt(attemptsStr, 10) : 0;
  if (attempts >= MAX_ATTEMPTS) {
    return { valid: false, reason: 'TOO_MANY_ATTEMPTS' };
  }

  // Constant-time comparison to prevent timing attacks
  if (!constantTimeEqual(stored, code)) {
    // Increment attempts; set TTL to match OTP TTL
    const ttl = await redis.ttl(key);
    if (ttl > 0) {
      await redis.set(attemptsKey, String(attempts + 1), { EX: ttl });
    }
    return { valid: false, reason: 'INVALID' };
  }

  // Success — delete OTP and attempts counter
  await redis.del(key);
  await redis.del(attemptsKey);
  return { valid: true };
}

/**
 * Get remaining TTL for an OTP (used in frontend countdown).
 * Returns 0 if not found.
 */
export async function getOtpTtl(email: string, type: OtpType): Promise<number> {
  const normalized = email.toLowerCase().trim();
  const key = otpKey(normalized, type);
  const redis = await getRedis();
  const ttl = await redis.ttl(key);
  return ttl > 0 ? ttl : 0;
}

// ─── Internal helpers ──────────────────────────────────

function otpKey(email: string, type: OtpType): string {
  return `otp:${type}:${email}`;
}

function attemptsKeyFor(email: string, type: OtpType): string {
  return `otp:${type}:${email}:attempts`;
}

async function generateSecureCode(): Promise<string> {
  // crypto.randomInt is cryptographically secure and unbiased
  const { randomInt } = await import('crypto');
  // Range: 0 to 999999, padded to 6 digits
  const n = randomInt(0, 1_000_000);
  return n.toString().padStart(OTP_LENGTH, '0');
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
