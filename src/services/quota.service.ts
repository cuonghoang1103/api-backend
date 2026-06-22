/**
 * ============================================================
 * Quota Service — Redis-backed rate limit tracker
 *
 * Track per-user request counts with auto-reset windows:
 * - Per-minute: 30 requests (chat, expensive AI calls)
 * - Per-day:    500 requests (free tier cap)
 * - Per-month:  10000 requests (long-term cap)
 *
 * Storage: Redis with TTL auto-expiry
 * Key format:
 *   quota:{userId}:minute:{YYYY-MM-DD-HH-mm}
 *   quota:{userId}:day:{YYYY-MM-DD}
 *   quota:{userId}:month:{YYYY-MM}
 *
 * Why not use express-rate-limit for this?
 * - express-rate-limit is in-memory (per-instance), doesn't share between workers
 * - We need cross-process aggregation
 * - We need to expose quota to UI (not just enforce on backend)
 * ============================================================
 */

import { prisma } from '../config/database.js';
import { config } from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { createClient } from 'redis';

// ─── Redis client (lazy init) ───────────────────────────
let _redis: ReturnType<typeof createClient> | null = null;

async function getRedis(): Promise<ReturnType<typeof createClient>> {
  if (_redis && _redis.isOpen) return _redis;
  if (!_redis) {
    _redis = createClient({
      socket: { host: config.redisHost, port: config.redisPort },
      password: config.redisPassword || undefined,
      database: config.redisDb,
    });
    _redis.on('error', (err: Error) => {
      logger.error('Redis error', { error: err.message });
    });
  }
  await _redis.connect();
  return _redis;
}

// ─── Quota limits (env-overridable) ──────────────────────
export const QUOTA_LIMITS = {
  perMinute: parseInt(process.env.QUOTA_PER_MINUTE || '30', 10),
  perDay: parseInt(process.env.QUOTA_PER_DAY || '500', 10),
  perMonth: parseInt(process.env.QUOTA_PER_MONTH || '10000', 10),
} as const;

// ─── Time helpers (UTC based, for predictable resets) ───
function minuteKey(d: Date = new Date()): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  const h = String(d.getUTCHours()).padStart(2, '0');
  const min = String(d.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${day}-${h}-${min}`;
}
function dayKey(d: Date = new Date()): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function monthKey(d: Date = new Date()): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

// ─── Public types ────────────────────────────────────────
export interface QuotaStatus {
  used: { minute: number; day: number; month: number };
  limit: { minute: number; day: number; month: number };
  remaining: { minute: number; day: number; month: number };
  resetAt: {
    minute: string; // ISO
    day: string;    // ISO (00:00 UTC of next day)
    month: string;  // ISO (1st of next month UTC)
  };
  resetIn: { minute: number; day: number; month: number }; // seconds until reset
  source: 'redis' | 'postgres_fallback';
}

export interface QuotaCheckResult {
  allowed: boolean;
  reason?: string; // 'minute' | 'day' | 'month'
  status: QuotaStatus;
}

/**
 * Increment quota counter for a user (atomic).
 * Returns the new status snapshot.
 */
export async function incrementQuota(userId: string): Promise<QuotaStatus> {
  const now = new Date();
  const mKey = minuteKey(now);
  const dKey = dayKey(now);
  const moKey = monthKey(now);

  const redis = await getRedis();
  const pipe = redis.multi();
  pipe.incr(`quota:${userId}:minute:${mKey}`);
  pipe.expire(`quota:${userId}:minute:${mKey}`, 65); // 65s TTL (minute window + buffer)
  pipe.incr(`quota:${userId}:day:${dKey}`);
  pipe.expire(`quota:${userId}:day:${dKey}`, 90000); // ~25h TTL
  pipe.incr(`quota:${userId}:month:${moKey}`);
  pipe.expire(`quota:${userId}:month:${moKey}`, 35 * 24 * 3600); // ~35 days

  const results = await pipe.exec();
  if (!results) throw new Error('Redis pipe.exec returned null');

  const minuteCount = Number(results[0]);
  const dayCount = Number(results[2]);
  const monthCount = Number(results[4]);

  return buildStatus(now, minuteCount, dayCount, monthCount);
}

/**
 * Read current quota WITHOUT incrementing.
 * Useful for displaying to the user.
 */
export async function getQuotaStatus(userId: string): Promise<QuotaStatus> {
  const now = new Date();
  const mKey = minuteKey(now);
  const dKey = dayKey(now);
  const moKey = monthKey(now);

  try {
    const redis = await getRedis();
    const [m, d, mo] = await Promise.all([
      redis.get(`quota:${userId}:minute:${mKey}`),
      redis.get(`quota:${userId}:day:${dKey}`),
      redis.get(`quota:${userId}:month:${moKey}`),
    ]);
    return buildStatus(
      now,
      Number(m || 0),
      Number(d || 0),
      Number(mo || 0)
    );
  } catch (err) {
    // Redis down — fall back to Postgres count from chat_messages
    logger.warn('Redis unavailable, falling back to Postgres', { error: (err as Error).message });
    return await getPostgresFallbackQuota(userId, now);
  }
}

/**
 * Check if a user can make a request (does NOT increment).
 * Use this in middleware to check before processing.
 */
export async function checkQuota(userId: string): Promise<QuotaCheckResult> {
  const status = await getQuotaStatus(userId);
  if (status.used.minute >= status.limit.minute) {
    return { allowed: false, reason: 'minute', status };
  }
  if (status.used.day >= status.limit.day) {
    return { allowed: false, reason: 'day', status };
  }
  if (status.used.month >= status.limit.month) {
    return { allowed: false, reason: 'month', status };
  }
  return { allowed: true, status };
}

/**
 * Express middleware: enforce quota on a route.
 * Increments counter, returns 429 if exceeded.
 */
export function quotaMiddleware() {
  return async (req: any, res: any, next: any) => {
    // Anonymous users (no auth) get a shared "guest" bucket
    const userId = req.user?.id || req.userId || `guest:${req.ip || 'unknown'}`;

    try {
      const status = await incrementQuota(userId);

      // Set standard rate-limit headers (RFC draft)
      res.setHeader('X-Quota-Limit-Minute', String(status.limit.minute));
      res.setHeader('X-Quota-Limit-Day', String(status.limit.day));
      res.setHeader('X-Quota-Remaining-Minute', String(Math.max(0, status.limit.minute - status.used.minute)));
      res.setHeader('X-Quota-Remaining-Day', String(Math.max(0, status.limit.day - status.used.day)));
      res.setHeader('X-Quota-Reset-Minute', String(status.resetIn.minute));
      res.setHeader('X-Quota-Reset-Day', String(status.resetIn.day));

      // Hard cap checks
      if (status.used.minute > status.limit.minute) {
        return res.status(429).json({
          success: false,
          message: `Quota exceeded: max ${status.limit.minute} requests/minute. Try again in ${status.resetIn.minute}s.`,
          code: 'QUOTA_EXCEEDED_MINUTE',
          quota: status,
        });
      }
      if (status.used.day > status.limit.day) {
        return res.status(429).json({
          success: false,
          message: `Daily quota exceeded (${status.limit.day}/day). Resets at ${status.resetAt.day} (${status.resetIn.day}s).`,
          code: 'QUOTA_EXCEEDED_DAY',
          quota: status,
        });
      }
      if (status.used.month > status.limit.month) {
        return res.status(429).json({
          success: false,
          message: `Monthly quota exceeded (${status.limit.month}/month). Resets at ${status.resetAt.month}.`,
          code: 'QUOTA_EXCEEDED_MONTH',
          quota: status,
        });
      }

      // Attach to request for handlers that want to display
      req.quotaStatus = status;
      next();
    } catch (err) {
      // If Redis fails, log + let request through (fail-open)
      logger.error('Middleware error, allowing request', { error: (err as Error).message });
      next();
    }
  };
}

// ─── Helpers ─────────────────────────────────────────────
function buildStatus(
  now: Date,
  minuteCount: number,
  dayCount: number,
  monthCount: number
): QuotaStatus {
  // Reset timestamps (UTC)
  const nextMinute = new Date(now);
  nextMinute.setUTCSeconds(0, 0);
  nextMinute.setUTCMinutes(nextMinute.getUTCMinutes() + 1);

  const nextDay = new Date(now);
  nextDay.setUTCHours(24, 0, 0, 0);

  const nextMonth = new Date(now);
  nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1, 1);
  nextMonth.setUTCHours(0, 0, 0, 0);

  return {
    used: { minute: minuteCount, day: dayCount, month: monthCount },
    limit: {
      minute: QUOTA_LIMITS.perMinute,
      day: QUOTA_LIMITS.perDay,
      month: QUOTA_LIMITS.perMonth,
    },
    remaining: {
      minute: Math.max(0, QUOTA_LIMITS.perMinute - minuteCount),
      day: Math.max(0, QUOTA_LIMITS.perDay - dayCount),
      month: Math.max(0, QUOTA_LIMITS.perMonth - monthCount),
    },
    resetAt: {
      minute: nextMinute.toISOString(),
      day: nextDay.toISOString(),
      month: nextMonth.toISOString(),
    },
    resetIn: {
      minute: Math.max(0, Math.floor((nextMinute.getTime() - now.getTime()) / 1000)),
      day: Math.max(0, Math.floor((nextDay.getTime() - now.getTime()) / 1000)),
      month: Math.max(0, Math.floor((nextMonth.getTime() - now.getTime()) / 1000)),
    },
    source: 'redis',
  };
}

/**
 * Postgres fallback: count chat_messages for the user today/month.
 * Less accurate (only counts chat, not all API calls) but works if Redis is down.
 */
async function getPostgresFallbackQuota(userId: string, _now: Date): Promise<QuotaStatus> {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setUTCHours(0, 0, 0, 0);
  const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

  let dayCount = 0;
  let monthCount = 0;
  // userId in our schema is Int — convert safely
  const userIdNum = Number(userId);
  if (!Number.isNaN(userIdNum)) {
    try {
      dayCount = await prisma.chatMessage.count({
        where: {
          session: { userId: userIdNum },
          role: 'user',
          createdAt: { gte: startOfDay },
        },
      });
      monthCount = await prisma.chatMessage.count({
        where: {
          session: { userId: userIdNum },
          role: 'user',
          createdAt: { gte: startOfMonth },
        },
      });
    } catch (err) {
      logger.error('Postgres fallback failed', { error: (err as Error).message });
    }
  }

  // Fake minute count: 0 (we can't reconstruct it from DB)
  return buildStatus(now, 0, dayCount, monthCount).source === 'redis'
    ? { ...buildStatus(now, 0, dayCount, monthCount), source: 'postgres_fallback' as const }
    : { ...buildStatus(now, 0, dayCount, monthCount), source: 'postgres_fallback' as const };
}

/**
 * Manual reset (admin tool — useful for support cases).
 */
export async function resetUserQuota(userId: string, scope: 'minute' | 'day' | 'month' | 'all' = 'all'): Promise<void> {
  const redis = await getRedis();
  const patterns: string[] = [];
  if (scope === 'minute' || scope === 'all') patterns.push(`quota:${userId}:minute:*`);
  if (scope === 'day' || scope === 'all') patterns.push(`quota:${userId}:day:*`);
  if (scope === 'month' || scope === 'all') patterns.push(`quota:${userId}:month:*`);

  for (const pattern of patterns) {
    // SCAN to find all matching keys (safer than KEYS in production)
    let cursor = 0;
    do {
      const reply = await redis.scan(cursor, { MATCH: pattern, COUNT: 100 });
      cursor = Number(reply.cursor);
      if (reply.keys.length > 0) {
        await redis.del(reply.keys);
      }
    } while (cursor !== 0);
  }
}

/**
 * Get aggregated quota stats for admin dashboard.
 */
export async function getAggregateQuota(): Promise<{
  totalActiveUsers: number;
  totalRequestsToday: number;
  totalRequestsThisMonth: number;
  topUsers: { userId: string; count: number }[];
}> {
  const redis = await getRedis();
  const dKey = dayKey();
  const moKey = monthKey();

  let dayCount = 0;
  let monthCount = 0;
  let cursor = 0;
  const userCounts: Map<string, number> = new Map();

  do {
    const reply = await redis.scan(cursor, { MATCH: `quota:*:day:${dKey}`, COUNT: 200 });
    cursor = Number(reply.cursor);
    for (const key of reply.keys) {
      const val = await redis.get(key);
      if (val) {
        const count = Number(val);
        dayCount += count;
        const m = key.match(/^quota:([^:]+):/);
        if (m) userCounts.set(m[1], (userCounts.get(m[1]) || 0) + count);
      }
    }
  } while (cursor !== 0);

  cursor = 0;
  do {
    const reply = await redis.scan(cursor, { MATCH: `quota:*:month:${moKey}`, COUNT: 200 });
    cursor = Number(reply.cursor);
    for (const key of reply.keys) {
      const val = await redis.get(key);
      if (val) monthCount += Number(val);
    }
  } while (cursor !== 0);

  const topUsers = Array.from(userCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([userId, count]) => ({ userId, count }));

  return {
    totalActiveUsers: userCounts.size,
    totalRequestsToday: dayCount,
    totalRequestsThisMonth: monthCount,
    topUsers,
  };
}

/**
 * Test/utility: ensure Redis is reachable at startup.
 */
export async function pingQuotaRedis(): Promise<boolean> {
  try {
    const r = await getRedis();
    return await r.ping() === 'PONG';
  } catch {
    return false;
  }
}

// Re-export for routes
export { AppError };
