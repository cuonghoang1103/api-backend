/**
 * node-08-3 — Node.js · Chapter 8 · Lesson 8.3 "requireAuth, roles, and deleting AUTHOR_ID = 1" (slide EN, đợt 7 — 01/11/2026).
 * MỘT deck, HAI tập: node-8-3 (slide 1–12) · node-8-3-2 (slide 13–28).
 *   A: lời nói dối AUTHOR_ID = 1 · 401 vs 403 · token đến từ đâu · requireAuth + sáu lần nói không · tra User có giá bao nhiêu (thật: 0,026 vs 0,664 ms, 26×) ·
 *      từng lần từ chối trên server thật (thật: NO_TOKEN, malformed, invalid signature, TOKEN_EXPIRED, 403, TOKEN_REVOKED, USER_GONE, admin 200) ·
 *      thứ tự gắn (thật: /bottom 200 công khai nhầm)
 *   B: requireRole + thứ tự (thật: admin vẫn 403 khi đảo) · vai trò → quyền · xoá lời nói dối (actor đứng đầu) · canTouch một chỗ ·
 *      bản "viết vội" (đọc 200, list thấy cả của An, đổi chủ, xoá 204) vs bản đúng (404, chỉ của mình, authorId giữ 2, 404, admin 200) — chạy thật ·
 *      vì sao 404 · mass-assignment · mệnh đề where của list · tầng route · test service không cần HTTP (thật: 5/5) · website · bài tập · tự kiểm · tóm tắt
 * Nguồn: nodejs-8-3-requireauth-phan-quyen. Output THẬT: that/c8/{authz-cost,denials,order,idor-leaky,idor,service.test} + c8notes/{auth.mw,notes.service(.leaky),notes.routes}.
 * Khác web: 0,026 / 0,664 ms (web 0,029 / 1,010) · thêm bản "viết vội" chạy thật (web chỉ chạy bản đúng) · thêm phép đo thứ tự (web chỉ nói).
 */
import { lamDeck, two, box, cards, flow, bang, J, JW, T, G, TT, dong } from './_c8-chung.mjs';
import { ma } from './_node-chung.mjs';

export const deck = { key: 'node-08-3', code: 'NODE 8.3', title: 'requireAuth, roles, and deleting AUTHOR_ID = 1', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const A = dong('c8/authz-cost', /only/).match(/median ([\d.]+) ms/)[1], B = dong('c8/authz-cost', /findUnique/).match(/median ([\d.]+) ms/)[1];
const LAN = dong('c8/authz-cost', /findUnique/).match(/\((\d+)x/)[1];

export const slides = lamDeck({ chuong: 'Chapter 8 — Authentication & authorisation', bai: '8.3' }, [
  { cover: true, t: 'requireAuth, roles,<br>and deleting AUTHOR_ID = 1', sub: 'Who is asking is not a parameter you can bolt on at the last minute.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>401 versus 403, and why mixing them up breaks your client</li>
<li>A complete <code class="i">requireAuth</code> and every way it says no, run on the real server</li>
<li>Why we look the user up on every request anyway, and what that costs</li>
<li>Middleware order: the mistake that makes a route public without any error</li>
<li>Ownership: the IDOR hole, run for real, closed with one rule in one place</li>
</ul>` + box('Why it matters to you', 'Broken access control is number one on the OWASP Top 10. It needs no exploit code — just a logged-in user typing another number into the URL.', 'lam') },

  { t: 'The lie at the top of the notes service', to: true, giua: true, body: J(ma('c7notes/notes.service', 1, 11), { hl: [4, 8] }) +
    box('Since chapter 7, every note belongs to user 1', 'There was no way to know who was asking. Deleting this one line touches every function in the service — that is today\'s work.', 'cam') },

  { t: 'Two different questions', to: true, giua: true, body: two(
    box('Authentication → 401', '<b>Who are you?</b> Missing, malformed or expired credentials. Retrying with a valid token may work.', 'lam'),
    box('Authorisation → 403', '<b>May you do this?</b> "I know exactly who you are, and no." Retrying with the same token never works.', 'cam')) +
    bang(['mistake', 'what the client then does'], [
      ['403 for an expired token', 'logs the user out instead of calling /auth/refresh'],
      ['401 for a permission problem', 'refreshes forever into a wall'],
    ], { co: 24 }) + box('The client reacts to the status', 'So the status is part of your API contract, exactly like in chapter 6.', 'xanh') },

  { t: 'Where the token comes from', to: true, giua: true, body: J(ma('c8notes/auth.mw', 6, 10), { sm: false, hl: [3, 4] }) + two(
    box('Header first', 'Mobile apps and server-to-server calls have no cookie jar; they send <code class="i">Authorization: Bearer …</code>.', 'lam'),
    box('Cookie as a fallback', 'A browser app is safer with an HttpOnly cookie (lesson 8.4). Accepting both costs three lines.', 'lam')) +
    box('slice(7)', '"Bearer " is exactly 7 characters: B-e-a-r-e-r plus one space.', '') },

  { t: 'The middleware, and every way it says no', to: true, giua: true, body: J(ma('c8notes/auth.mw', 12, 34), { hl: [3, 9, 10, 17, 18, 19] }) },

  { t: 'Six refusals, six machine-readable codes', to: true, giua: true, body: bang(['code', 'means', 'the client should'], [
    ['NO_TOKEN', 'nothing sent', 'show the login screen'],
    ['TOKEN_INVALID', 'malformed or wrong signature', 'log out'],
    ['TOKEN_EXPIRED', 'signature fine, exp passed', 'call /auth/refresh once, retry'],
    ['USER_GONE', 'account deleted', 'log out'],
    ['TOKEN_REVOKED', 'tokenVersion changed (lesson 8.4)', 'log out'],
    ['FORBIDDEN (403)', 'known user, wrong role', 'show "not allowed", do NOT refresh'],
  ], { co: 22, hl: [2] }) + box('All 401 except the last', 'Same status, different code: the code is what lets the client react differently.', 'lam') },

  { t: 'Why look the user up in the database at all?', to: true, giua: true, body: TT('c8/authz-cost', 2, 3, 'node authz-cost.mjs · median of 2,000 each · real', { hl: [2] }) +
    cards([
      ['A deleted account stops NOW', 'Not "within 15 minutes".'],
      ['A role change applies NOW', 'Demote an admin and the next request is a normal user. A role baked into the token lies until it expires.'],
      ['Revocation works', 'tokenVersion (lesson 8.4) needs this row.'],
    ], 3) + box(`${LAN}× slower, still under a millisecond`, 'On a route that spends 10–50 ms on its real query. The honest question is not "stateful or not" but "how stale may this decision be?" For roles and account status: not at all. When you grow, cache it in Redis (chapter 12) — do not drop it.', 'xanh') },

  { t: 'Every refusal, run on the real server', to: true, giua: true, body: TT('c8/denials', 3, 13, 'node client/denials.mjs · Notes API on :4370 · real', { hl: [8], n: 104 }) +
    box('Number 3 is the test that matters', 'A perfect payload — sub 1, role ADMIN, right issuer and audience, not expired — signed with a different secret. Everything about it is right except the key. That is the whole security boundary, and it held.', 'xanh') },

  { t: 'Role, revocation, deleted account', to: true, giua: true, body: TT('c8/denials', 15, 25, 'node client/denials.mjs · real', { hl: [2, 11], n: 104 }) +
    box('403 only once', 'An is known and valid — she just is not an admin. Everything else is "I cannot trust this token", so it is 401.', 'lam') },

  { t: 'Mounting order decides whether this runs at all', to: true, giua: true, body: J(ma('c8/order', 12, 18), { sm: false, hl: [2, 7] }) + TT('c8/order', 2, 3, 'node order.mjs · real', { hl: [2] }) +
    box('No error, no warning', 'router.use(requireAuth) protects only the routes declared AFTER it. Tests stay green: they all send a token.', 'do2') },

  { t: 'Protect at router level, at the top', to: true, giua: true, body: J(ma('c8notes/notes.routes', 7, 8), { sm: false, hl: [2] }) +
    two(box('Forgetting = a locked door', 'Guard the whole router first, then let single routes opt out on purpose.', 'xanh'),
      box('Per-route guards', 'Forgetting one = an open door. This website found routes where requireAdmin was simply missing.', 'do2')) +
    flow([{ t: 'request', mau: LAM }, { t: 'requireAuth', s: 'declared first', mau: NODE }, { t: 'GET / · POST / …', s: 'all declared after', mau: LAM }, { t: 'response', mau: LAM }], { h: 130 }) +
    box('If you took API Design lesson 6.2', 'The same idea one level up: "deny by default" — a missing rule means no access.', 'lam') },

  // ───────── phần B (tập node-8-3-2) ─────────
  { t: 'Roles', to: true, giua: true, body: J(ma('c8notes/auth.mw', 36, 39), { sm: false }) +
    J("// authenticate first, authorise second — in that order\nrouter.delete('/users/:id', requireAuth, requireRole('ADMIN'), handler);", { sm: false, hl: [2] }) +
    TT('c8/order', 4, 5, 'node order.mjs · the two orders · real', { hl: [2] }) +
    box('Swapped, even the admin gets 403', 'requireRole reads req.user, which only requireAuth sets. The error message then sends you looking in the wrong place.', 'do2') },

  { t: 'When two roles are not enough', to: true, giua: true, body: two(
    box('Adding a role to role checks', 'Every route that says requireRole(\'ADMIN\') must be edited. Forty booleans later, nobody knows who can do what.', 'do2'),
    box('Permissions instead', '<code class="i">requirePermission(\'note:delete:any\')</code>, with roles mapped to permission sets. A new role = one table edit.', 'xanh')) +
    bang(['role', 'note:read:own', 'note:delete:own', 'note:delete:any'], [['USER', '✓', '✓', '—'], ['MODERATOR', '✓', '✓', '✓ (reported only)'], ['ADMIN', '✓', '✓', '✓']], { co: 22 }) +
    box('This course stops at two roles', 'The Authentication course (lesson 9.2, RBAC) and the next step after it — ABAC, ReBAC, multi-tenant — are where to go next.', 'lam') },

  { t: 'Now delete the lie', to: true, giua: true, body: (
    J("// BEFORE — chapter 7\nconst AUTHOR_ID = 1;\nexport async function list({ page, limit, q }) {\n  const where = { authorId: AUTHOR_ID, … };\n}", { sm: false, hl: [2] }) +
    J("// AFTER — chapter 8, actor first\nexport async function list(actor, { page, limit, q }) {\n  const where = { authorId: actor.id, … };\n}", { sm: false, hl: [2, 3] })) +
    box('A deliberate inconvenience', 'You cannot call a service function without answering "on whose behalf?". Forgetting the ownership check becomes a syntax-level mistake instead of a silent hole.', 'xanh') +
    box('The alternative', 'Reading a global "current user" from somewhere — exactly how those holes appear.', 'do2') },

  { t: 'One rule, in one place', to: true, giua: true, body: J(ma('c8notes/notes.service', 4, 5) + '\n\n' + ma('c8notes/notes.service', 19, 23) + '\n\n' + ma('c8notes/notes.service', 31, 41), { hl: [2, 6, 11, 12, 17] }) },

  { t: 'The "quick" version this replaces', to: true, giua: true, body: J(ma('c8notes/notes.service.leaky', 4, 5) + '\n  …\n' + ma('c8notes/notes.service.leaky', 12, 17), { hl: [2, 4, 9] }) +
    box('Logged in = allowed', 'It checks that someone is logged in, never that the note is theirs. It passes every test you write with your own account.', 'do2') +
    cards([['list', 'authorId dropped from where in a refactor'], ['get', 'finds the note by id, never asks whose it is'], ['update', 'data: patch — whatever the client sent']], 3) },

  { t: 'The hole, run for real: IDOR', to: true, giua: true, body: TT('c8/idor-leaky', 3, 16, 'node client/idor-leaky.mjs · the quick service · real', { hl: [2, 5, 8, 11], n: 100 }) +
    box('IDOR (tham chiếu trực tiếp không an toàn)', 'Insecure Direct Object Reference: a normal user, a valid token, another id in the URL. No exploit code. Binh read, re-owned and deleted An\'s data.', 'do2') },

  { t: 'The same script, after the fix', to: true, giua: true, body: TT('c8/idor', 3, 16, 'node client/idor.mjs · canTouch + actor · real', { hl: [2, 5, 8, 11, 14], n: 100 }) +
    box('Same URL, same method, three outcomes', 'Binh: 404. An: her note. The admin: 200. That is authorisation working.', 'xanh') },

  { t: 'Why 404 and not 403', to: true, giua: true, body: two(
    box('403 says "it exists, but not for you"', 'Walk the ids and you map the whole database: how many notes, when they were created, which ids are gaps.', 'do2'),
    box('404 says nothing', 'Indistinguishable from a note that never existed.', 'xanh')) +
    bang(['use', 'when'], [['403', 'the user already knows the resource exists (a team workspace they can see but not edit)'], ['404', 'knowing it exists is itself information they should not have (anything private)']], { co: 22 }) +
    box('If you took API Design lesson 6.2', 'There a matrix logs in as every person and asks for every booking: 8 wrong cells on the quick build, 0 after one policy table + 404. Put that script next to your tests.', 'lam') },

  { t: 'Two more holes in the same handler', to: true, giua: true, body: J(ma('c8notes/notes.service', 31, 35), { sm: false, hl: [3] }) +
    box('1 · Mass assignment', 'data: patch passes anything the client sent, even fields your form never shows. Destructuring drops id and authorId (authorId stayed 2 above). Stronger: the zod allow-list from chapter 6.', 'cam') +
    box('2 · The list query', 'Drop authorId in a refactor and everyone sees everything (quick run, step 2: total = 2). Keep it in the service, where actor is mandatory.', 'do2') },

  { t: 'The route layer now', to: true, giua: true, body: J(ma('c8notes/notes.routes', 17, 21), { sm: false, hl: [2] }) +
    flow([{ t: 'requireAuth', s: 'who are you? → 401', mau: LAM }, { t: 'requireRole', s: 'role enough? → 403', mau: CAM }, { t: 'service (canTouch)', s: 'is THIS one yours? → 404', mau: NODE }]) +
    box('Three layers, three questions, three statuses', 'The first two are middleware because they apply to a group of routes. The third cannot be: it needs the actual row from the database.', 'lam') },

  { t: 'Test it without a single HTTP request', to: true, giua: true, body: J(ma('c8/service.test', 14, 18), { sm: false }) +
    TT('c8/service.test', 2, 9, 'node --test service.test.mjs · real') +
    box('Because the rule lives in the service', 'get(binh, 1) must be null. Testing it needs no server, no token, no curl.', 'xanh') },

  { t: 'This website', to: true, giua: true, body: cards([
    ['Guard at router level', 'Because an audit found routes where requireAdmin was simply forgotten.'],
    ['canTouch, version four', 'Notes can be shared, so it is "owner, admin, or an active share" — still one function every handler calls.'],
    ['401 vs 403 strictly', 'The axios layer refreshes on 401 only; a 403 is shown, never retried.'],
  ], 3) + flow([{ t: 'GET /notes/:id', mau: LAM }, { t: 'requireAuth', mau: LAM }, { t: 'canTouch(note, user)', s: 'owner · admin · share', mau: NODE }, { t: '200 / 404', mau: CAM }], { h: 130 }) +
    box('Going further', 'The Authentication course, lesson 9.5: where the check lives, and how to make forgetting it impossible.', 'lam') },

  { t: 'Exercise', to: true, giua: true, body: J("router.get('/notes/:id/comments', requireAuth, async (req, res) => {\n  const comments = await prisma.comment.findMany({ where: { noteId: Number(req.params.id) } });\n  res.json(comments);\n});", { sm: false, hl: [2] }) +
    box('Exercise', 'A new endpoint lists the comments of a note. It requires login. Is it safe? Describe the attack, then fix it with what this lesson built, and say what status a stranger should get.', '') +
    `<div data-k="dapan">${box('Answer', 'It is IDOR again: any logged-in user reads the comments of any note. Fix: <code class="i">const note = await service.get(req.user, id); if (!note) throw notFound(id);</code> before reading comments — so the stranger gets 404, through the same canTouch.', 'xanh')}</div>` },

  { t: 'Self-check', to: true, giua: true, body: `<ol>
<li>Expired token: 401 or 403? Wrong role: 401 or 403? Why does it matter?</li>
<li>What does the database lookup in requireAuth buy you?</li>
<li>router.use(requireAuth) at the bottom of the file: what happens?</li>
<li>Why is actor the first parameter of every service function?</li>
<li>Someone else's private note: 403 or 404?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. 401 (refresh may help), 403 (it never will); the client\'s reaction depends on it. &nbsp;2. Deletion, role changes and revocation apply immediately. &nbsp;3. The routes above it are public, silently. &nbsp;4. You cannot call it without saying on whose behalf. &nbsp;5. 404.', 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `<ul>
<li>401 = "I do not know you", 403 = "I know you, and no" — clients depend on the difference</li>
<li>requireAuth: six refusals, each with its own code; one user lookup (${A} → ${B} ms) makes deletion, role change and revocation instant</li>
<li>Order: router.use(requireAuth) at the top; requireAuth before requireRole</li>
<li>actor first in every service function; one canTouch; 404 for other people's private data</li>
<li>Drop id/authorId from the body (or allow-list with zod); keep authorId in the list query</li>
</ul>` + box('Next: lesson 8.4', 'Where the browser keeps the token: cookies, CSRF, logging out everywhere, and rate-limiting the login.', 'lam') },
]);
