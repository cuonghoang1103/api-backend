// src/ops/ratelimit.js — Chapter 11 (11.3): rate limiting that survives real traffic. A FIXED-WINDOW counter per key
// (in production this counter lives in Redis so every instance shares it — an in-process counter lets one node's share
// of the traffic through N times over). allow() increments the key's count in the current window and says whether the
// request is under the limit. The store is injected (a Map here; a Redis client in production) and the clock too.
/**
 * allow(store, key, { limit, windowMs, now }) ⇒ { ok, remaining, count }.
 * store: a Map of `${key}:${windowStart}` → count. Fixed window: count resets when the window rolls over.
 */
export function allow(store, key, { limit, windowMs, now }) {
  const windowStart = Math.floor(now / windowMs) * windowMs;
  const bucket = `${key}:${windowStart}`;
  const count = (store.get(bucket) || 0) + 1;
  store.set(bucket, count);
  return { ok: count <= limit, remaining: Math.max(0, limit - count), count };
}
