// lab3/starter/index.js — Lab 3: LabFlow ID's session layer. Replace every TODO; keep the exported name and the returned methods.
// store = { insert(row), get(digest), update(digest, fields), delete(digest), deleteByUser(userId) } (the grader passes one).
// Allowed: node:crypto, ../../src/crypto (newToken, tokenDigest). Grade: node scripts/cham-lab-3.mjs lab3/my
export function sessionLayer({ store, now = () => Date.now(), idleMs = 30 * 60e3, absoluteMs = 12 * 3600e3, touchEveryMs = 60e3,
  origins = ['http://localhost:4800'] }) {
  throw new Error('TODO sessionLayer');
  // return {
  //   async start(req, res, userId) {},      // new session, cookie __Host-lfid_ses, destroy any session the request carried
  //   async load(req, res, next) {},         // req.session = row | null; idle / absolute timeouts; throttled last-seen
  //   async end(req, res) {},                // delete the row, clear the cookie with the same attributes
  //   async endAll(userId) {},               // every session of this user ⇒ number deleted
  //   csrf(req, res, next) {},               // unsafe methods from another site ⇒ 403
  // };
}
