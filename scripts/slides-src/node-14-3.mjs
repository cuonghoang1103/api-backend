/**
 * node-14-3 — Node.js · Chapter 14 · Lesson 14.3 "Testing the HTTP layer with supertest" (slide EN, đợt 10 — 08/11/2026).
 * MỘT deck, MỘT tập node-14-3 (15 slide).
 *   ví dụ đời thường (thử món qua cửa trước) · nhà máy tạo app (src/app.mjs THẬT) · test HTTP đầu tiên · hợp đồng thành khẳng định (401 · 422 + fields · 201 + dòng trong DB · 409) ·
 *   chạy thật (thật: 6 test, 147 ms trong tệp, 525 ms cả lệnh, PostgreSQL 17) · giá so với 12 unit (5 + 3 ms) · test đáng giá nhất (404 + dữ liệu không đổi) ·
 *   website: IDOR thread:join (commit a8e998e95 THẬT) · bẫy mock service trong test route · chi tiết giá supertest (thật từ 14.1: 2,398 vs 2,110 ms) · hai thói quen · bài tập · bảng.
 * Nguồn: nodejs-14-3-supertest. Output THẬT: that/c14/{http,pyramid,unit} (vitest 5.1.0, supertest 7.3.2, Express 5.3.0, zod 4.6.7, pg 8.23.1, PostgreSQL 17 Docker node14-pg).
 * Khác web: 6 test HTTP 147 ms (web 117) · chênh lệch supertest vs server sống 0,29 ms/yêu cầu (web 2,2 ms) ⇒ 600 yêu cầu ≈ 0,17 s (web 1,3 s) — tính từ số đo 14.1.
 */
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { lamDeck, two, box, cards, flow, bang, J, JW, TT, thanh, dong } from './_c9-chung.mjs';

export const deck = { key: 'node-14-3', code: 'NODE 14.3', title: 'Testing the HTTP layer with supertest', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e';
const R = (ten, re) => dong(`c14/${ten}`, re);
const num = (s, re) => Number((s.match(re) ?? [0, 'NaN'])[1].replace(/,/g, ''));
const NOTES = (f) => readFileSync(`/Users/admin/Documents/video-bai-giang/src/khung/node/that/c14/notes/${f}`, 'utf8').replace(/\s+$/, '').split('\n');
const L = (f, a, b) => NOTES(f).slice(a - 1, b).join('\n');
const HT = num(R('http', /http\.int\.test\.mjs \(6 tests\)/), /\) (\d+)ms/), HD = num(R('http', /Duration/), /Duration\s+(\d+)ms/);
const PI = num(R('pyramid', /^integration/), /= ([\d.]+) ms per/), PE = num(R('pyramid', /^e2e/), /= ([\d.]+) ms per/);
const LOG = execFileSync('git', ['-C', '/Users/admin/Downloads/api-backend', 'show', '-s', '--format=%h %ad%n%s', '--date=short', 'a8e998e95'], { encoding: 'utf8' }).trim();

const cuaSvg = `<svg data-k="cua" viewBox="0 0 1100 200" width="1100" height="200" font-family="Arial">
<rect x="10" y="10" width="520" height="180" rx="16" fill="${CAM}12" stroke="${CAM}" stroke-width="3"/><text x="34" y="85" font-size="50">🥄</text><text x="110" y="62" font-size="22" font-weight="700" fill="${CAM}">taste the sauce in the kitchen</text><text x="110" y="94" font-size="18" fill="#444">the recipe is right — but was it served?</text><text x="34" y="160" font-size="20" font-weight="700" fill="${CAM}">= a unit test of the service</text>
<rect x="570" y="10" width="520" height="180" rx="16" fill="${NODE}12" stroke="${NODE}" stroke-width="3"/><text x="594" y="85" font-size="50">🚪</text><text x="670" y="62" font-size="22" font-weight="700" fill="${NODE}">order through the front door</text><text x="670" y="94" font-size="18" fill="#444">menu, waiter, kitchen, plate, bill</text><text x="594" y="160" font-size="20" font-weight="700" fill="${NODE}">= an HTTP test with supertest</text>
</svg>`;

export const slides = lamDeck({ chuong: 'Chapter 14 — Testing', bai: '14.3' }, [
  { cover: true, t: 'Testing the HTTP layer<br>with supertest', sub: 'Chapter 6 said status codes are a contract. A contract nobody re-checks is a comment. This lesson makes it executable — through the real router, real validation, real error handler and a real database.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>The one structural change: an app factory that does not listen</li>
<li>The first HTTP test, and what request(app) really does</li>
<li>The contract written as assertions: 401 · 422 · 201 · 409 · 404</li>
<li>The test that pays for the whole file — and the bug it would have caught here</li>
<li>The trap of mocking the service, and two habits that keep this level cheap</li>
</ul>` + box('Why it matters to you', 'None of the twelve unit tests of 14.2 would notice a missing express.json(), an error handler registered too early, or a route mounted at /note.', 'lam') },

  { t: 'An everyday picture: the front door', to: true, giua: true, body: cuaSvg + two(
    box('The kitchen can be perfect', 'and the waiter still bring the wrong plate, or the door be locked. The unit test tasted the sauce; nobody ordered a meal.', 'cam'),
    box('So order one — through the front door', 'A real request through the real middleware, router, validation and error handler, all the way to the table and back.', 'xanh')) },

  { t: 'One structural change: the app factory', to: true, giua: true, body: J(L('src/app.mjs', 11, 14) + '\n  …\n' + L('src/app.mjs', 30, 32), { sm: false, hl: [1, 6] }) +
    J(`// src/server.mjs — the ONLY file that may call listen
import { createApp } from './app.mjs';
createApp({ service: realService, auth: jwtAuth }).listen(3000);`, { sm: false, hl: [3] }) +
    box('Why', 'A file that calls listen() at import time cannot be imported by a test — importing it starts a server. And the factory takes its dependencies as arguments, so one test file can use a fake service and another a real database, with no environment variable.', 'xanh') },

  { t: 'The first HTTP test', to: true, giua: true, body: J(L('tests/http.int.test.mjs', 26, 29), { sm: false, hl: [2, 3] }) +
    flow([{ t: 'request(app)', s: 'the Express app, not a URL', mau: LAM }, { t: 'listen(0)', s: 'an ephemeral port', mau: CAM }, { t: 'real HTTP', s: 'over 127.0.0.1', mau: NODE }, { t: 'close', s: 'no leaked server', mau: LAM }], { h: 120 }) +
    box('No listen() in your test, no port to pick', 'supertest binds the app to a random free port, sends a genuine request over the loopback, and closes the server again.', 'lam') },

  { t: 'The contract, spelled out as assertions', to: true, giua: true, body: J(L('tests/http.int.test.mjs', 30, 41), { sm: true, hl: [4, 10, 11] }) +
    two(box('422 names the field', 'The SHAPE of the error is part of the contract: the client reads fields[0].path to show "title" in red.', 'lam'),
      box('201 — and check the database', 'The status says "created". A second assertion asks PostgreSQL whether a row for user 7 really exists.', 'xanh')) },

  { t: '409 on a duplicate — and the run', to: true, giua: true, body: J(L('tests/http.int.test.mjs', 42, 46), { sm: false, hl: [3, 4] }) +
    TT('c14/http', 1, 10, 'npx vitest run tests/http.int.test.mjs · real PostgreSQL 17 · real', { hl: [5, 8], n: 104, sm: false }) },

  { t: 'What it costs — and why pay it', to: true, giua: true, body: thanh([['12 unit tests (14.2)', 8, NODE, '5 + 3 ms inside the files'], [`6 HTTP tests`, HT, LAM, `${HT} ms inside the file`]], { w: 1100, x0: 290, wMax: 520, h0: 58, chu: 22, ghi: 'time inside the test files · real' }) +
    two(box(`~${Math.round(HT / 6)} ms per HTTP test`, 'Six round trips plus real SQL. That ratio is why not EVERY test lives here.', 'cam'),
      box('…and why SOME must', 'None of the unit tests would notice: express.json() missing · the error handler registered before the routes · the router mounted at /note.', 'xanh')) +
    box('Measured on this machine', `Six HTTP tests: ${HT} ms of test time, ${HD} ms for the whole command (startup, imports, the database connection).`, 'lam') },

  { t: 'The test that pays for the whole file', to: true, giua: true, body: JW(L('tests/http.int.test.mjs', 54, 60), 92, [4, 6], { sm: true }) +
    two(box('Status AND effect', 'Checking only the 404 lets a future refactor answer 404 and still perform the update. The second assertion reads the row back: the title is unchanged.', 'xanh'),
      box('Chapter 8, enforced', 'User 8 must not be able to edit user 7\'s note — and must not even learn that it exists.', 'lam')) },

  { t: 'How cuongthai.com does it — the bug this test would catch', to: true, giua: true, body: J(`// before — src/socket/messaging.socket.ts
socket.on('thread:join', (threadId) => {
  if (typeof threadId === 'number') socket.join(\`thread:\${threadId}\`);
});`, { sm: false, hl: [3] }) + J(`# ${LOG.split('\n')[0]}\n# ${LOG.split('\n')[1]}`, { sm: true }) +
    two(box('A real IDOR, found while writing chapter 11', 'Authentication ran once, at the handshake. Any logged-in user could join someone else\'s conversation (sequential ids) and receive its messages live.', 'do2'),
      box('Authentication once, authorization every time', 'The fix re-checks participation on every event and fails closed. One test — "B joins A\'s thread and is denied" — finds it in a draft instead of a breach report.', 'xanh')) },

  { t: 'Pitfall — mocking the service in a route test', to: true, giua: true, body: J(`const fakeService = { create: async () => { throw Object.assign(new Error('x'), { status: 409 }); } };
const app = createApp({ service: fakeService, auth: headerAuth });
// "409 on a duplicate slug" now passes — but it only proves Express forwards err.status`, { sm: true, hl: [3] }) +
    two(box('What it really tests', '"When the service throws status 409, Express answers 409" — a fact about Express, not about your app. The duplicate rule lives BELOW the route.', 'do2'),
      box('Use the real service + a real database', 'for the tests that assert rules. Use a fake service only for what you cannot produce otherwise — "the database is down → 503".', 'xanh')) +
    flow([{ t: 'route', s: 'status codes', mau: LAM }, { t: 'service', s: 'ownership, duplicates', mau: CAM }, { t: 'database', s: 'UNIQUE, lengths', mau: DO }], { h: 100 }) },

  { t: 'The cost detail from lesson 14.1, explained', to: true, giua: true, body: two(
    box('supertest', 'EVERY request(app): create a server → listen(0) → send → close. Never a leaked port — at the price of a whole server lifecycle per request.', 'cam'),
    box('a long-lived server', 'listen() once in beforeAll, close it in afterAll, every request reuses it. Faster — but closing it is now your job.', 'lam')) +
    thanh([['supertest (14.1)', PI, CAM, `${PI} ms per request`], ['listen once (14.1)', PE, LAM, `${PE} ms per request`]], { w: 1100, x0: 290, wMax: 520, h0: 56, chu: 22, ghi: 'median of 5 rounds of 100 · real' }) +
    box('Measure before optimising', `${(PI - PE).toFixed(2)} ms per request: 6 tests ≈ ${((PI - PE) * 6).toFixed(1)} ms, 600 tests ≈ ${((PI - PE) * 600 / 1000).toFixed(2)} s per file (computed from the numbers above). The shape of your suite decides which side of the line you are on.`, 'xanh') },

  { t: 'Two habits that keep this level cheap', to: true, giua: true, body: J(`// ✗ a thenable that is never awaited: a silent green test (14.2)
request(app).post('/notes').send({ title: 'Hi' }).expect(201);
// ✓
await request(app).post('/notes').send({ title: 'Hi' }).expect(201);`, { sm: false, hl: [2, 4] }) + J(`// ✗ breaks on the next migration (id, createdAt, a new column…)
expect(res.body).toEqual({ id: 1, title: 'Hi', slug: 'hi', … });
// ✓ only what the contract promises
expect(res.body.slug).toBe('hi');`, { sm: false, hl: [2, 4] }) +
    two(box('1 · await every supertest call', 'It is a thenable; un-awaited, it is exactly the hollow green test of 14.2.', 'cam'),
      box('2 · assert on the fields the contract promises', 'Not on the whole body with toEqual — that goes red for reasons unrelated to the rule.', 'lam')) },

  { t: 'Exercise', to: true, giua: true, body: box('Exercise', 'Add DELETE /notes/:id to the Notes API. Write the HTTP tests that pin its contract: 401 without a user, 404 for a note that is not yours (and the row still exists afterwards), 204 for your own (and the row is gone), 404 for a second delete of the same id.', '') +
    flow([{ t: '401', s: 'no x-user-id', mau: DO }, { t: '404', s: 'not yours · row stays', mau: CAM }, { t: '204', s: 'yours · row gone', mau: NODE }, { t: '404', s: 'deleting it again', mau: LAM }], { h: 110 }) +
    `<div data-k="dapan">${box('Answer', 'Four tests in one describe, each awaiting request(app).delete(`/notes/${id}`). The two that matter most assert on the database too: SELECT count(*) … WHERE id = $1 after the forbidden delete (still 1) and after your own (0). Run them inside the per-test transaction of 14.4 so they cannot see each other\'s rows.', 'xanh')}</div>` },

  { t: 'The HTTP layer — in one table', to: true, giua: true, body: bang(['', 'measured here', 'the rule'], [
    ['createApp({ service, auth })', 'importable, never listens', 'a factory, then one server.mjs'],
    ['6 HTTP tests + PostgreSQL', `${HT} ms inside the file`, 'some tests here, not all'],
    ['404 for another user\'s note', 'status AND the row unchanged', 'assert the effect'],
    ['a mocked service', 'tests Express, not your rules', 'real service for rules'],
    ['supertest vs listen once', `${PI} vs ${PE} ms per request`, 'measure before optimising'],
  ], { co: 21 }) + box('Next: 14.4 — a real database', 'The race a fake repository will never show, three ways to isolate tests, a throw-away container — and the trap this lesson walked into.', 'lam') },
]);
