/**
 * Read-through cache helper (P2-3) — a thin layer over the shared Redis
 * client for HOT, GLOBAL read paths (public landing counts, category
 * lists, etc.).
 *
 * Design goals:
 * - **Graceful degradation:** if Redis is down/unreachable, every call
 *   transparently falls back to the fetcher and NEVER throws. A cache
 *   outage must not take the site down — it just removes the speedup.
 * - **Single-flight (in-process):** concurrent misses for the same key
 *   share ONE fetcher call instead of stampeding Postgres. The backend
 *   currently runs a single process (see P2-17), so in-process
 *   coalescing covers the real stampede case without the complexity /
 *   failure modes of a distributed lock. When we move to multi-process,
 *   the short TTLs bound the worst case to N concurrent refetches.
 * - **JSON transport:** values are JSON-serialised. Callers must only
 *   cache plain-data (the output is JSON-encoded to the client anyway,
 *   so Date→ISO-string round-tripping is response-identical). Do NOT
 *   cache anything that varies per viewer under a shared key.
 *
 * Keys follow the codebase's colon-namespaced convention, all prefixed
 * `cache:` so they're easy to SCAN/flush and never collide with the
 * quota/otp namespaces.
 */
import { getRedis } from '../config/redis.js';
import { logger } from './logger.js';

/** In-process de-dupe of concurrent fetches for the same key. */
const inflight = new Map<string, Promise<unknown>>();

/**
 * Read `key` from Redis; on miss, run `fetchFn`, store the result with a
 * `ttlSeconds` expiry, and return it. Falls back to `fetchFn` (no cache)
 * on any Redis error.
 */
export async function cached<T>(key: string, ttlSeconds: number, fetchFn: () => Promise<T>): Promise<T> {
  // ── 1) Try to serve from cache ────────────────────────────────────
  try {
    const redis = await getRedis();
    const hit = await redis.get(key);
    if (hit !== null) {
      try {
        return JSON.parse(hit) as T;
      } catch {
        // Corrupt entry — fall through and refetch (also overwrites it).
        logger.warn('cache: corrupt entry, refetching', { key });
      }
    }
  } catch (err) {
    // Redis unavailable — bypass the cache entirely for this call.
    logger.warn('cache: read failed, bypassing', { key, error: (err as Error).message });
    return fetchFn();
  }

  // ── 2) Miss: coalesce concurrent fetches for the same key ─────────
  const pending = inflight.get(key);
  if (pending) return pending as Promise<T>;

  const promise = (async () => {
    const value = await fetchFn();
    // Best-effort write; a failed write must not fail the request.
    try {
      const redis = await getRedis();
      await redis.set(key, JSON.stringify(value), { EX: ttlSeconds });
    } catch (err) {
      logger.warn('cache: write failed', { key, error: (err as Error).message });
    }
    return value;
  })().finally(() => {
    inflight.delete(key);
  });

  inflight.set(key, promise);
  return promise as Promise<T>;
}

/**
 * Delete one or more exact cache keys. Best-effort — never throws.
 * Use from mutation paths to invalidate a GLOBAL cached read.
 */
export async function invalidateCache(...keys: string[]): Promise<void> {
  if (keys.length === 0) return;
  try {
    const redis = await getRedis();
    await redis.del(keys);
  } catch (err) {
    logger.warn('cache: invalidation failed', { keys, error: (err as Error).message });
  }
}

// ── Well-known cache keys (single source of truth) ──────────────────
export const CacheKeys = {
  videoCategoriesActive: 'cache:videoCategories:active',
  languagesGlobal: 'cache:lang:languages',
  interviewTaxonomy: 'cache:interview:taxonomy',
} as const;
