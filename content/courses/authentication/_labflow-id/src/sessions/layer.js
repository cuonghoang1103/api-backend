// src/sessions/layer.js — Chapter 3 = Lab 3 reference: a server-side session behind a cookie that JavaScript cannot read.
// store = { insert(row), get(digest), update(digest, fields), delete(digest), deleteByUser(userId) } — PostgreSQL, Redis or memory.
import { newToken, tokenDigest } from '../crypto/index.js';

export const COOKIE = '__Host-lfid_ses';                       // __Host-: Secure, Path=/, no Domain — enforced by the browser
const ATTRS = 'Path=/; HttpOnly; Secure; SameSite=Lax';

/** Read one cookie from the Cookie header (no library: lesson 0.1's parser). */
export function readCookie(header, name = COOKIE) {
  for (const part of String(header ?? '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return null;
}

export function sessionLayer({ store, now = () => Date.now(), idleMs = 30 * 60e3, absoluteMs = 12 * 3600e3,
  touchEveryMs = 60e3, origins = ['http://localhost:4800'] }) {
  const setCookie = (res, token) => res.append('Set-Cookie', `${COOKIE}=${token}; ${ATTRS}; Max-Age=${absoluteMs / 1000}`);
  const clearCookie = (res) => res.append('Set-Cookie', `${COOKIE}=; ${ATTRS}; Max-Age=0`); // same attributes, or it is a new cookie

  /** After a successful sign-in (or any privilege change): a NEW session; the old one, if any, is destroyed (lesson 3.3). */
  async function start(req, res, userId) {
    const old = readCookie(req.headers.cookie);
    if (old) await store.delete(tokenDigest(old));
    const token = newToken('lfid_ses');
    const t = now();
    await store.insert({ digest: tokenDigest(token), userId, createdAt: t, expiresAt: t + absoluteMs, lastSeenAt: t, authAt: t,
      ip: req.ip ?? null, userAgent: req.headers['user-agent'] ?? null });
    setCookie(res, token);
  }

  /** Middleware: req.session = the row, or null. Expired (idle or absolute) ⇒ deleted and the cookie cleared. */
  async function load(req, res, next) {
    req.session = null;
    const token = readCookie(req.headers.cookie);
    if (token) {
      const digest = tokenDigest(token);
      const s = await store.get(digest);
      const t = now();
      if (!s) clearCookie(res);
      else if (t >= s.expiresAt || t - s.lastSeenAt >= idleMs) { await store.delete(digest); clearCookie(res); }
      else {
        if (t - s.lastSeenAt >= touchEveryMs) await store.update(digest, { lastSeenAt: t }); // not a write per request (3.1)
        req.session = { ...s, digest };
      }
    }
    next();
  }

  async function end(req, res) {
    const token = readCookie(req.headers.cookie);
    if (token) await store.delete(tokenDigest(token));
    clearCookie(res);
  }

  const endAll = (userId) => store.deleteByUser(userId);

  /** CSRF layer 2 (lesson 3.4): a state-changing request must come from our own origin. */
  function csrf(req, res, next) {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
    const site = req.headers['sec-fetch-site'];
    if (site) return site === 'same-origin' || site === 'none' ? next() : res.status(403).json({ error: 'CROSS_SITE_REQUEST' });
    const origin = req.headers.origin;
    if (origin && !origins.includes(origin)) return res.status(403).json({ error: 'CROSS_SITE_REQUEST' });
    next();                                                     // no browser metadata at all: curl, a mobile app — not a CSRF vector
  }

  return { start, load, end, endAll, csrf };
}
