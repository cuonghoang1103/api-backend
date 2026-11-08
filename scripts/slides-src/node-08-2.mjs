/**
 * node-08-2 — Node.js · Chapter 8 · Lesson 8.2 "JWT, refresh tokens and rotation" (slide EN, đợt 7 — 01/11/2026).
 * MỘT deck, HAI tập: node-8-2 (slide 1–14) · node-8-2-2 (slide 15–30).
 *   A: hai cách nhớ đăng nhập · mổ JWT bằng tay (thật: 217 ký tự, exp − iat = 900 s) · base64url ≠ mã hoá · đòn 1 sửa payload (thật: invalid signature) ·
 *      đòn 2 decode (thật: ra ADMIN) · đòn 3 alg none + nhầm thuật toán (thật: jsonwebtoken 9.0.3 chặn cả hai) · bộ kiểm tự viết (thật: ADMIN hai lần) ·
 *      chốt algorithms/issuer/audience (thật: audience invalid) · hết hạn + ignoreExpiration · giá kiểm (thật: verify 48.103/s, 0,021 ms) ·
 *      không lấy lại được token đã phát
 *   B: ba lối thoát · refresh token không phải JWT (thật) · bảng RefreshSession · issueSession · rotate (dùng lại ⇒ thu hồi cả họ) ·
 *      chạy thật trên server (thật: REUSE_DETECTED 2 phiên, rồi REFRESH_REVOKED) · hai tab cùng refresh (thật: tab 2 làm cả họ chết) ·
 *      sự cố production tái hiện (thật: 200 ⇒ 4 s sau 401 TOKEN_EXPIRED, cookie 30 ngày) · interceptor refresh MỘT lần (thật: 200) · khoá bí mật ·
 *      website · bài tập · tự kiểm · tóm tắt
 * Nguồn: nodejs-8-2-jwt-access-refresh. Output THẬT: that/c8/{jwt-anatomy,jwt-attacks,jwt-speed,refresh-token,rotation,incident} + c8notes/{tokens,session}.
 * Khác web: alg none với jsonwebtoken 9.0.3 báo "jwt signature is required" (web không ghi) · verify 48.103/s (web 26.113) · thêm phép đo hai tab (web không có).
 */
import { lamDeck, two, box, cards, flow, bang, tep, P, J, JW, T, G, TT, dong, so } from './_c8-chung.mjs';
import { ra, ma } from './_node-chung.mjs';

export const deck = { key: 'node-08-2', code: 'NODE 8.2', title: 'JWT, refresh tokens and rotation', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const VERIFY = dong('c8/jwt-speed', /verify/).match(/-> ([\d,]+) per second/)[1];

/** Ba phần màu của một JWT thật (cắt bớt cho vừa). */
function baPhan() {
  const h = ra('c8/jwt-anatomy', 2, 2).split(': ')[1], p = ra('c8/jwt-anatomy', 3, 3).split(': ')[1], s = ra('c8/jwt-anatomy', 4, 4).split(': ')[1];
  const ct = (t, n) => (t.length > n ? t.slice(0, n) + '…' : t);
  const w = 1110, H = 210;
  const part = (x, wd, m, title, txt, sub) => `<rect x="${x}" y="64" width="${wd}" height="70" rx="10" fill="${m}14" stroke="${m}" stroke-width="2.5"/>` +
    `<text x="${x + wd / 2}" y="50" text-anchor="middle" font-size="22" font-weight="800" fill="${m}">${title}</text>` +
    `<text x="${x + wd / 2}" y="106" text-anchor="middle" font-size="17" font-family="monospace" fill="${m}">${txt}</text>` +
    `<text x="${x + wd / 2}" y="166" text-anchor="middle" font-size="19" fill="#444">${sub}</text>`;
  return `<svg data-k="baphan" viewBox="0 0 ${w} ${H}" width="${w}" height="${H}" font-family="Arial">` +
    part(0, 300, DO, 'header', ct(h, 24), 'which algorithm signed it') +
    `<text x="315" y="112" font-size="34" font-weight="900" fill="#333">.</text>` +
    part(335, 430, TIM, 'payload', ct(p, 36), 'the claims: who, when, until when') +
    `<text x="780" y="112" font-size="34" font-weight="900" fill="#333">.</text>` +
    part(800, 310, LAM, 'signature', ct(s, 24), 'HMAC(header.payload, secret)') +
    `<text x="0" y="200" font-size="16" fill="#777">a real token from jwt-anatomy.mjs, cut short to fit · ${ra('c8/jwt-anatomy', 5, 5)}</text></svg>`;
}

export const slides = lamDeck({ chuong: 'Chapter 8 — Authentication & authorisation', bai: '8.2' }, [
  { cover: true, t: 'JWT, refresh tokens<br>and rotation', sub: 'Checking a password costs 22 ms. You cannot do that on every request — so what do you hand back instead?' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>A JWT taken apart by hand: what is inside, and who can read it</li>
<li>Three attacks on our own tokens, run for real: edit, decode, lie about the algorithm</li>
<li>The one property nobody warns you about: a JWT cannot be taken back</li>
<li>Short access token + long refresh token, rotation, and catching a stolen token</li>
<li>A real production incident, re-created, and the client-side fix</li>
</ul>` + box('Why it matters to you', 'Almost every API you will build or call uses tokens. Most real breaches in this area come from four or five lines of code — the ones in this lesson.', 'lam') },

  { t: 'Two ways to remember that someone logged in', to: true, giua: true, body: two(
    box('Server-side session', 'Keep the session in a database, give the client an opaque id. Each request looks it up once.<br><b>Revoke</b> = delete one row. <b>Cost</b> = one lookup per request.', 'lam'),
    box('JWT (stateless)', 'Sign the user\'s identity into the token itself. Check it with the secret, no lookup.<br><b>Revoke</b> = impossible until it expires. <b>Cost</b> = zero per request.', 'cam')) +
    box('Neither is "the modern one"', 'They trade the same thing in opposite directions. This lesson deliberately uses both: a short stateless access token for speed, and a long stateful refresh token for control.', 'xanh') +
    box('If you took SDN302 lesson 5.1', 'There Passport keeps a session id in a cookie and looks it up in MongoDB — the left column.', '') },

  { t: 'Take one JWT apart by hand', to: true, giua: true, body: J(ma('c8/jwt-anatomy', 5, 7), { sm: false }) +
    TT('c8/jwt-anatomy', 2, 5, 'node jwt-anatomy.mjs · real', { n: 112 }) + baPhan() },

  { t: 'The most misunderstood thing about JWT', to: true, giua: true, body: J(ma('c8/jwt-anatomy', 13, 15), { sm: false, hl: [1] }) +
    TT('c8/jwt-anatomy', 7, 10, 'node jwt-anatomy.mjs · real', { n: 112, hl: [2] }) +
    two(box('base64url is an encoding, not encryption', 'Anyone holding the token — the browser, a log reader — reads every claim. No secret needed.', 'do2'),
      box('So never put in a payload', 'Phone numbers, addresses, internal notes, other people\'s ids. The signature gives <b>integrity</b> (nobody can change it), never <b>secrecy</b>.', 'cam')) },

  { t: 'Attack 1 — edit the payload', to: true, giua: true, body: J(ma('c8/jwt-attacks', 9, 14), { sm: false, hl: [5] }) +
    TT('c8/jwt-attacks', 2, 3, 'node jwt-attacks.mjs · real', { hl: [2] }) +
    box('Blocked — the part JWT does really well', 'The signature covers exactly header.payload. Change one byte and the signature no longer matches; without the secret, nobody can compute a new one.', 'xanh') },

  { t: 'Attack 2 — decode instead of verify', to: true, giua: true, body: J(ma('c8/jwt-attacks', 16, 17), { sm: false }) +
    TT('c8/jwt-attacks', 5, 6, 'node jwt-attacks.mjs · the SAME forged token · real', { hl: [2], n: 112 }) +
    box('Search your code today', 'jwt.decode exists to read a token you already trust ("logged in as…" in the client). Anywhere in server-side auth, it means anyone can write their own payload.', 'cam') +
    bang(['', 'jwt.decode(token)', 'jwt.verify(token, SECRET, opts)'], [['checks the signature', 'no', 'yes'], ['checks exp, iss, aud', 'no', 'yes'], ['forged token', 'returns the payload', 'throws']], { co: 22 }) },

  { t: 'Attack 3 — lie about the algorithm', to: true, giua: true, body: JW(ma('c8/jwt-attacks', 20, 20) + '\n' + ma('c8/jwt-attacks', 25, 27), 104, [3, 4], { sm: false }) +
    TT('c8/jwt-attacks', 8, 13, 'node jwt-attacks.mjs · jsonwebtoken 9.0.3 · real', { n: 112 }) +
    box('Honest result: the library blocked both', 'alg none needs a signature; HS256 with an RSA public key is refused, because version 9 picks the allowed algorithms from the key type.', 'lam') },

  { t: 'The real victim: the hand-written verifier', to: true, giua: true, body: JW(ma('c8/jwt-attacks', 32, 43), 100, [3, 4, 5], { sm: false }) +
    TT('c8/jwt-attacks', 16, 17, 'node jwt-attacks.mjs · real', { hl: [1, 2] }) },

  { t: 'Pin it: the server decides, the token does not vote', to: true, giua: true, body: J(ma('c8notes/tokens', 15, 16), { sm: false, hl: [2] }) +
    JW(ma('c8/jwt-attacks', 48, 49), 100, [], { sm: false }) + TT('c8/jwt-attacks', 19, 20, 'node jwt-attacks.mjs · real', { hl: [2] }) +
    two(box('algorithms', 'Kills the whole class of algorithm attacks, whatever the library version.', 'xanh'),
      box('issuer + audience', 'Stops a valid token from another of your systems (or another app at the same identity provider) being replayed here.', 'xanh')) },

  { t: 'Expiry, and the flag that must stay off', to: true, giua: true, body: JW(ma('c8/jwt-attacks', 52, 55), 100, [4], { sm: false }) +
    TT('c8/jwt-attacks', 22, 24, 'node jwt-attacks.mjs · real', { hl: [3], n: 110 }) +
    box('ignoreExpiration: true is not a debugging helper', 'It switches off the only revocation a stateless token has. The one legitimate place is inside a refresh flow that re-checks the account in the database anyway.', 'do2') },

  { t: 'What does checking a token cost?', to: true, giua: true, body: TT('c8/jwt-speed', 2, 3, 'node jwt-speed.mjs · 10,000 each · real', { hl: [2] }) +
    bang(['check', 'per second (one core)', 'when'], [
      ['argon2id password (lesson 8.1)', dong('c8/hash-speed', /^argon2id \(OWASP/).match(/([\d.]+) per second/)[1], 'once, at login'],
      ['jwt.verify', VERIFY, 'every request'],
    ], { co: 24, hl: [1] }) +
    box('That ratio is the whole argument for tokens', 'Pay for the expensive question once at login, then answer the cheap one on every request after that.', 'xanh') +
    flow([{ t: 'POST /login', s: 'argon2: ~22 ms, once', mau: CAM }, { t: 'token', s: 'stored by the client', mau: LAM }, { t: 'GET /notes ×1000', s: 'verify: 0.021 ms each', mau: NODE }], { h: 130 }) },

  { t: 'The problem: you cannot take a JWT back', to: true, giua: true, body: flow([
    { t: '08:58', s: 'token signed, exp 09:13', mau: LAM }, { t: '09:00', s: 'account deleted', mau: DO }, { t: '09:05', s: 'token still verifies ✓', mau: DO }, { t: '09:13', s: 'finally expires', mau: NODE },
  ]) + two(
    box('Not a bug in your code', 'Correct signature, not expired: verify never touches your database. That is the definition of "stateless".', 'cam'),
    box('So the real question is', 'How long may a token you can no longer stop stay valid? The answer decides the whole design that follows.', 'lam')) +
    box('If you took API Design lesson 6.1', 'LabFlow\'s access token also lives 15 minutes (900 seconds) and is rejected after 16 — the same number we use here.', '') },

  { t: 'Three ways out — the industry chose the third', to: true, giua: true, body: cards([
    ['Block-list every token', 'Now every request looks something up. You rebuilt server sessions, with a worse experience.'],
    ['Very long-lived tokens', 'Convenient, and a stolen token works for weeks. No.'],
    ['Short access + long refresh', 'Access 15 minutes: cannot be revoked, but nearly worthless. Refresh 30 days: in your database, revoked with one UPDATE.'],
  ], 3) + flow([{ t: 'login', s: 'argon2 once', mau: LAM }, { t: 'every request', s: 'verify access, no DB', mau: NODE }, { t: '401 expired', s: 'POST /auth/refresh', mau: CAM }, { t: 'rotate', s: 'old marked used, new pair', mau: TIM }]) },

  { t: 'A refresh token is NOT a JWT', to: true, giua: true, body: J(ma('c8notes/tokens', 18, 20), { sm: false }) +
    TT('c8/refresh-token', 2, 4, 'node refresh-token.mjs · real', { n: 112 }) +
    two(box('Why not sign it?', 'It is checked against the database on every use anyway, so a signature buys nothing — and a signed token you cannot revoke is the problem we are escaping.', 'lam'),
      box('Plain SHA-256 is right here', 'Lesson 8.1 needed slow hashing because people choose guessable passwords. 256 random bits leave nothing to guess.', 'xanh')) },

  { t: 'The table', to: true, giua: true, body: P(tep('c8/schema-auth.prisma', 59, 74), { hl: [4, 5, 7, 8] }) +
    box('familyId is the interesting column', 'One login starts a family; each rotation adds a row to it. That is what makes theft detectable.', 'lam') },

  { t: 'Issue a session', to: true, giua: true, body: J(ma('c8notes/session', 9, 21), { sm: false, hl: [1, 6] }) +
    box('One function, two callers', 'Login: no familyId, a new family starts. Refresh: the existing familyId, the chain continues. userAgent feeds the "active sessions" screen.', 'lam') },

  { t: 'Rotation, and why "reused" means "stolen"', to: true, giua: true, body: JW(ma('c8notes/session', 30, 44), 104, [3, 4, 5, 6, 7, 8]) +
    box('Each refresh token works once', 'Used twice can only mean two holders. You cannot tell which one is the thief, so you revoke the whole family: the real user logs in again with a password the thief does not have.', 'cam') },

  { t: 'Run it against the real server', to: true, giua: true, body: TT('c8/rotation', 3, 15, 'node client/rotation.mjs · Notes API on :4370 · real', { n: 112, hl: [10, 13] }) +
    box('Step 4 is the design working', 'An\'s new token was revoked with the family. Annoying for her once; worthless to the thief forever.', 'xanh') },

  { t: 'The table afterwards', to: true, giua: true, body: TT('c8/rotation', 17, 20, 'the RefreshSession rows of that family · real') + bang(['row', 'used', 'revoked', 'meaning'], [
    ['1', 'true', 'true', 'the token the thief replayed'],
    ['2', 'false', 'true', 'An\'s valid new token, burned with the family'],
  ], { co: 24 }) + box('Detection, not prevention', 'Rotation does not stop a theft. It turns it into an event you notice after at most one refresh, instead of a silent 30-day backdoor.', 'lam') },

  { t: 'The catch: two tabs refreshing at once', to: true, giua: true, body: TT('c8/rotation', 22, 25, 'node client/rotation.mjs · step 6 · real', { n: 104, hl: [3] }) +
    two(box('What happened', 'Both tabs sent the same refresh token in the same instant. Tab 1 won; tab 2 looked exactly like a thief, and the whole family died — including tab 1\'s brand-new pair.', 'do2'),
      box('A false alarm that logs real users out', 'Common fixes: let the browser refresh in one place only, or accept the same token again for a few seconds. The Authentication course measures this race in lesson 5.5.', 'cam')) },

  { t: 'A production incident this design prevents', to: true, giua: true, body: cards([
    ['JWT_EXPIRES_IN=24h', 'the access token died after one day'],
    ['cookie: 7 days', 'the cookie carrying it lived a week'],
    ['no working /auth/refresh', 'the frontend proxy called a route that did not exist'],
  ], 3) + box('This project, July 2026', 'For six days out of seven the browser faithfully sent a token the server had declared dead, with no way to renew it. Users saw a logged-in page where every button failed.', 'do2') +
    box('Two clocks', 'Token lifetime and cookie lifetime are different clocks, and nothing keeps them in sync. Equal them exactly, or have a refresh route bridge the gap.', 'cam') },

  { t: 'Re-created: a 3-second token in a 30-day cookie', to: true, giua: true, body: TT('c8/incident', 2, 7, 'ACCESS_TTL=3s COOKIE_MAX_AGE_MS=30 days · node client/incident.mjs · real', { n: 104, hl: [5] }) +
    flow([{ t: 'login', s: 'token + cookie set', mau: NODE }, { t: '+3 s', s: 'token expires', mau: DO }, { t: '+4 s … +30 days', s: 'cookie still sent', mau: CAM }, { t: 'every call', s: '401 TOKEN_EXPIRED', mau: DO }]) +
    box('The page still looks logged in', 'The cookie is there; the token inside it is dead. Exactly what users saw for six days.', 'do2') },

  { t: 'The fix: refresh once, then retry', to: true, giua: true, body: J(ma('c8/incident', 19, 28), { sm: false, hl: [3, 4, 5, 7] }) +
    TT('c8/incident', 9, 10, 'node client/incident.mjs · real', { n: 104 }) +
    box('"Once" is the important word', 'Without that limit, an expired refresh token produces an endless retry loop. If refresh fails too, log out for real.', 'cam') },

  { t: 'The secret key', to: true, giua: true, body: cards([
    ['Length', 'HS256 needs at least 32 random bytes: <code class="i">openssl rand -base64 32</code>. A short human secret can be brute-forced offline from any token you issued.'],
    ['Where', 'An environment variable, never the repository. Losing it means "anyone can mint an admin token".'],
    ['Rotation', 'Changing the secret kills every access token at once. With 15-minute tokens + refresh, that is 15 annoying minutes, not an outage.'],
    ['HS256 or RS256', 'HS256 when one service signs and verifies. RS256 when many verify but only one may sign: they get the public key, not the power to forge.'],
  ], 2) + J(ma('c8notes/tokens', 5, 6), { sm: false }) },

  { t: 'This website', to: true, giua: true, body: cards([
    ['HS256, pinned', 'issuer, audience and algorithms all checked on verify.'],
    ['POST /api/v1/auth/refresh', 'Exists because of the incident above; the axios layer refreshes once on 401 and replays the request.'],
    ['Opaque refresh tokens', 'Stored as SHA-256 and rotated on every use: a stolen one gives at most one refresh.'],
  ], 3) + box('Going further', 'The Authentication course spends chapters 4 and 5 here: decoding by hand, the alg field, every claim, JWKS, rotation and the refresh race.', 'lam') +
    box('If you took SDN302 lesson 5.2', 'Its token lives one day and there is no refresh — fine for an exam project; this lesson is what changes when it has to run for real.', '') },

  { t: 'Exercise', to: true, giua: true, body: J("// a teammate's middleware\nconst payload = jwt.decode(req.headers.authorization?.slice(7));\nif (!payload) return res.status(401).end();\nreq.user = { id: payload.sub, role: payload.role };", { sm: false, hl: [2] }) +
    box('Exercise', 'Find the hole, show the one-line attack, and write the corrected line. Then: the user is made admin at 10:00 — when does the new role reach this middleware?', '') +
    `<div data-k="dapan">${box('Answer', 'jwt.decode checks nothing: anyone base64-encodes {"sub":"1","role":"ADMIN"} and is admin. Fix: <code class="i">jwt.verify(token, SECRET, { algorithms: [\'HS256\'], issuer, audience })</code>. The role is baked into the token, so it only changes at the next refresh (up to 15 minutes) — unless you load the user from the database (lesson 8.3).', 'xanh')}</div>` },

  { t: 'Self-check', to: true, giua: true, body: `<ol>
<li>Who can read a JWT payload, and what does the signature guarantee?</li>
<li>What is the difference between jwt.decode and jwt.verify?</li>
<li>Why must the server, not the token, choose the algorithm?</li>
<li>Why is a refresh token random bytes and not a JWT?</li>
<li>What does it mean when an already-used refresh token comes back?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. Anyone; integrity, not secrecy. &nbsp;2. decode only reads, verify checks the signature and claims. &nbsp;3. Otherwise alg none or HS256-with-the-public-key forge admin. &nbsp;4. It is checked in the database anyway, and a signed token cannot be revoked. &nbsp;5. Two holders: revoke the whole family.', 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `<ul>
<li>A JWT is readable by anyone: integrity, never secrecy</li>
<li>decode ≠ verify; pin algorithms, issuer and audience on the server</li>
<li>A hand-written verifier that trusts header.alg handed out admin twice</li>
<li>Access 15 minutes (${VERIFY} checks per second, no database) + refresh 30 days (revocable row)</li>
<li>Rotation turns a theft into a detected event — mind the two-tab race</li>
<li>Token lifetime and cookie lifetime are two clocks: bridge them with a refresh route</li>
</ul>` + box('Next: lesson 8.3', 'requireAuth, roles, and deleting the AUTHOR_ID = 1 lie from chapter 7.', 'lam') },
]);
