// lab3/yeu/index.js — a FIRST ATTEMPT that "works": An signs in, /me knows her, sign-out answers ok.
import { randomBytes } from 'node:crypto';

export function sessionLayer({ store, now = () => Date.now(), idleMs = 30 * 60e3 }) {
  const read = (req) => (req.headers.cookie ?? '').match(/(?:^|; )__Host-lfid_ses=([^;]+)/)?.[1];
  return {
    async start(req, res, userId) {
      const token = randomBytes(32).toString('base64url');
      await store.insert({ digest: token, userId, lastSeenAt: now() });          // the token is the key
      res.append('Set-Cookie', `__Host-lfid_ses=${token}; Path=/; HttpOnly; Secure; SameSite=Lax`);
    },
    async load(req, res, next) {
      req.session = null;
      const token = read(req);
      const s = token && (await store.get(token));
      if (s && now() - s.lastSeenAt <= idleMs) {
        await store.update(token, { lastSeenAt: now() });
        req.session = s;
      }
      next();
    },
    async end(req, res) {
      const token = read(req);
      if (token) await store.delete(token);
      res.append('Set-Cookie', '__Host-lfid_ses=deleted');
    },
    async endAll(userId) { return store.deleteByUser(userId); },
    csrf(req, res, next) { next(); },
  };
}
