/**
 * tst-05-2 — Testing · Chapter 5 · Lesson 5.2 "Testing authentication and authorisation" (01/11/2026). Slug: tst-5-2-xac-thuc.
 * Output = chạy thật: demo5/auth (8 xanh): thiếu/sai/giả/hết hạn ⇒ 401, sinh viên ở route admin ⇒ 403, đọc lượt của người khác ⇒ 404.
 */
import { lamDeck, js, vt, two, box, steps, c, zm } from './_tst-chung.mjs';

export const deck = { key: 'tst-05-2', code: 'TST 5.2', title: 'Testing auth', sub: '401, 403, 404 and the role in the body' };

const AUTH = `export function createAuth({ secret, now = () => new Date() }) {
  const key = new TextEncoder().encode(secret);
  return {
    async sign({ id, role }, ttlSeconds = 3600) { … HS256, exp = iat + ttl … },
    async verify(token) {
      const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'], currentDate: now() });
      return { id: payload.sub, role: payload.role };
    },
  };
}`;
const MW = `const requireUser = async (req, res, next) => {
  const header = req.get('authorization') ?? '';
  if (!header.startsWith('Bearer ')) return fail(res, 401, 'UNAUTHENTICATED');
  try { req.user = await auth.verify(header.slice(7)); }
  catch { return fail(res, 401, 'UNAUTHENTICATED'); }
  next();
};
const requireRole = (role) => (req, res, next) =>
  (req.user.role === role ? next() : fail(res, 403, 'FORBIDDEN'));`;
const EXP = `it('a token issued at 09:00 for 1 hour is refused at 10:01', async () => {
  let clock = new Date('2030-01-01T09:00:00Z');
  const { app, bearer } = makeApi({ now: () => clock });
  const auth = await bearer('an');
  expect((await request(app).get('/api/bookings/1').set('Authorization', auth)).status).toBe(404);
  clock = new Date('2030-01-01T10:01:00Z');
  expect((await request(app).get('/api/bookings/1').set('Authorization', auth)).status).toBe(401);
});`;
const IDOR = `const mine = booking && (booking.userId === req.user.id || req.user.role === 'ADMIN');
if (!mine) return fail(res, 404, 'NOT_FOUND');   // someone else's booking looks missing`;
const OUT = ` ✓ demo5/auth.test.js (8 tests) 90ms
   ✓ authentication: who are you? → 401 (5)
     ✓ no Authorization header → 401 15ms
     ✓ not a Bearer token → 401 4ms
     ✓ a random string → 401 2ms
     ✓ a token signed with another secret → 401 4ms
     ✓ a token issued at 09:00 for 1 hour is refused at 10:01 9ms
   ✓ authorisation: are you allowed? → 403 / 404 (3)
     ✓ a student on the admin list → 403; an admin → 200 10ms
     ✓ student B cannot read student A's booking — it looks missing (404) 43ms
     ✓ a student cannot make themselves ADMIN through the body 3ms`;

export const slides = lamDeck({ chuong: 'Chapter 5 — Testing HTTP APIs', bai: '5.2' }, [
  { cover: true, t: 'Testing authentication<br>and authorisation', sub: 'Chapter 5 · Lesson 5.2 — who are you, and what may you see?' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Real tokens in tests, signed with a test secret</li>
    <li>401 vs 403 vs 404 — and why someone else’s data answers 404</li>
    <li>Forged and expired tokens, with a controlled clock</li>
    <li>The role must come from the token, never from the body</li>
    <li>Access control as a table: every role × own / other’s data</li></ul>` },
  { t: 'Tokens: sign and verify, clock as a parameter', body: js(AUTH, { sm: true, hl: [6] }) + two(box('Real JWTs in tests', `${c('makeApi()')} signs real HS256 tokens with a test secret. No auth mocks: the same ${c('jwtVerify')} runs as in production.`, 'xanh'), box('currentDate: now()', 'The clock decides whether a token has expired — so a test can move time, as in lesson 2.2.', 'lam')) },
  { t: 'Two questions, two status codes', body: js(MW, { sm: true, hl: [3, 5, 9] }) + zm(`<table class="t"><tr><th>Status</th><th>Question</th><th>LabFlow example</th></tr>
    <tr><td><b>401</b></td><td>Who are you? (no valid identity)</td><td>missing, forged or expired token</td></tr>
    <tr><td><b>403</b></td><td>I know you — you may not</td><td>a student on /api/admin/bookings</td></tr>
    <tr><td><b>404</b></td><td>Not found — or not yours</td><td>another student’s booking</td></tr></table>`, 1.05) },
  { t: 'Expired tokens, with a controlled clock', body: js(EXP, { sm: true, hl: [2, 6, 7] }) + box('Why 2030?', 'The clock is fully controlled, so the date does not matter — a far-future date also makes sure no real clock could accidentally agree. Lab 5 plants a bug that ignores the given clock.', 'lam') },
  { t: 'Someone else’s booking looks missing', body: js(IDOR, { hl: [2] }) + two(box('IDOR', '“Insecure Direct Object Reference”: change /bookings/1 to /bookings/2 and read another person’s data. OWASP lists broken access control as the top web risk.', 'do2'), box('404, not 403', 'A 403 would confirm that booking 2 exists. 404 tells an attacker nothing.', 'xanh')) + zm(`<table class="t"><tr><th>Who asks for booking 1 (made by An)</th><th>Status</th></tr><tr><td>An (owner)</td><td>200</td></tr><tr><td>Bình (another student)</td><td>404</td></tr><tr><td>a lecturer</td><td>404</td></tr><tr><td>an admin</td><td>200</td></tr></table>`, 1.0) },
  { t: 'Eight auth tests, all green', body: zm(vt(OUT, { title: 'terminal — npx vitest run demo5/auth.test.js', sm: false }), 1.0) +
    box('The role comes from the token', `The body schema is strict: ${c('{ ..., role: "ADMIN" }')} is refused with 400 “Unrecognized key”. Trusting a role in the body is a privilege-escalation bug.`, 'do2') },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      'A lecturer on the admin list → 403',
      'A token issued at 09:00 for one hour: still valid at 09:59:59, refused at exactly 10:00:00',
    ]) + box('Done when', `${c('demo5/th52.test.js')}: 3 passed.`, 'xanh') + box('Time limits are boundaries', 'Same technique as lessons 1.4 and 2.2: test on the limit and just before it.', 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Use real tokens with a test secret — no auth mocks</li>
    <li>401 who are you · 403 not allowed · 404 not found or not yours</li>
    <li>Control the clock to test expiry at its boundary</li>
    <li>Take identity and role from the token, never from the body</li>
    <li>Someone else’s data must look missing (IDOR)</li></ul>` },
]);
