/**
 * node-14-2 — Node.js · Chapter 14 · Lesson 14.2 "Unit tests, test doubles, and tests that assert nothing" (slide EN, đợt 10 — 08/11/2026).
 * MỘT deck, HAI tập: node-14-2 (slide 1–11) · node-14-2-2 (slide 12–23).
 *   A: ví dụ đời thường (đóng thế trên phim trường) · hình dạng một test · đặt tên · vì sao service không test được · tiêm phụ thuộc · năm loại hàng giả · fakeRepo + 409 ·
 *      chạy thật (thật: 12 test, 2 tệp, 111 ms) · bảng phần 1.
 *   B: test phân quyền 404 · thời gian là phụ thuộc (thật: 2 test 20 phút giả 4 ms vs 1 test chờ thật 1.605 ms) · tham số now = Date.now() · bốn test xanh mà không kiểm gì
 *      (thật vitest 5.1.0: bắt 1 và 2, lọt 3 và 4 · node:test: lọt 1 và 3, t.plan bắt 3) · expect.assertions (thật: bắt 3, lọt 4) · bẻ code cố ý (thật: 404 → 403 ⇒ 1 đỏ) ·
 *      website (cv.test.ts THẬT dòng 1–7) · bốn luật · bài tập · bảng.
 * Nguồn: nodejs-14-2-unit-test. Output THẬT: that/c14/{unit,time,green,mutate} (Node 22.23.3, vitest 5.1.0). Mã: that/c14/notes/{src,tests,green,nt-checks}.
 * Khác web: vitest 5.1.0 in "Duration 111ms (transform 57%, …)" thay vì ms từng pha · 1.605 ms (web 1.610) · vitest 5 báo ca 1 bằng HAI lỗi (sai thông điệp + "was not awaited") ·
 *   node:test in thêm "generated asynchronous activity after the test ended" cho ca 1 (vẫn tính pass) · website: không còn "3 tệp" (190 tệp) ⇒ đã sửa web.
 */
import { readFileSync } from 'node:fs';
import { lamDeck, two, box, cards, flow, bang, J, TT, T, G, thanh, dong } from './_c9-chung.mjs';

export const deck = { key: 'node-14-2', code: 'NODE 14.2', title: 'Unit tests, test doubles, and tests that assert nothing', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const NOTES = (f) => readFileSync(`/Users/admin/Documents/video-bai-giang/src/khung/node/that/c14/notes/${f}`, 'utf8').replace(/\s+$/, '').split('\n');
const L = (f, a, b) => NOTES(f).slice(a - 1, b).join('\n');
const WEB = readFileSync('/Users/admin/Downloads/api-backend/src/services/cv/cv.test.ts', 'utf8').split('\n');

const phimSvg = `<svg data-k="phim" viewBox="0 0 1100 200" width="1100" height="200" font-family="Arial">
${[['🧍', 'dummy', 'an extra in the', 'background', '#64748b'], ['📦', 'stub', 'a cardboard prop:', 'always the same', CAM], ['🎥', 'spy', 'a hidden camera:', 'records every move', LAM], ['🎭', 'mock', 'an actor with a', 'script to follow', DO], ['🍳', 'fake', 'a set kitchen', 'that really cooks', NODE]].map(([e, t, a, b, m], i) => `<rect x="${10 + i * 218}" y="10" width="206" height="180" rx="14" fill="${m}12" stroke="${m}" stroke-width="3"/><text x="${113 + i * 218}" y="70" text-anchor="middle" font-size="44">${e}</text><text x="${113 + i * 218}" y="108" text-anchor="middle" font-size="23" font-weight="700" fill="${m}">${t}</text><text x="${113 + i * 218}" y="140" text-anchor="middle" font-size="17" fill="#444">${a}</text><text x="${113 + i * 218}" y="164" text-anchor="middle" font-size="17" fill="#444">${b}</text>`).join('')}
</svg>`;

export const slides = lamDeck({ chuong: 'Chapter 14 — Testing', bai: '14.2' }, [
  // ── PART 1 ──
  { cover: true, t: 'Unit tests, test doubles,<br>and tests that<br>assert nothing', sub: 'A unit test is cheap because it touches nothing outside the function. Whether that is possible is decided by the application code — so this lesson changes the application.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>The shape of a test, and a name that says which rule broke</li>
<li>Why the Notes service could not be unit-tested — and the one-line change</li>
<li>Five kinds of test double, and when to assert on calls</li>
<li>The authorization test worth more than the rest, and time as a dependency</li>
<li>Four tests that pass while checking nothing — and the habit that catches them</li>
</ul>` + box('Why it matters to you', 'A green suite feels like safety. This lesson shows how to make sure the green actually means something.', 'lam') },

  { t: 'An everyday picture: the film set', to: true, giua: true, body: phimSvg + two(
    box('Doubles stand in for the real thing', 'A film does not blow up a real car for every take. A test does not hit a real database for every check.', 'lam'),
    box('…and they only work if the scene allows it', 'If the script says "only THIS car, bolted to the set", nobody can swap it. Code that imports its database cannot swap it either.', 'cam')) },

  { t: 'The shape of a test', to: true, giua: true, body: J(L('tests/slug.test.mjs', 1, 15), { sm: false, hl: [6, 12] }) +
    box('Arrange · act · assert', 'Set up the input, call the thing, check the result — every time, in that order. Here all three fit on one line.', 'xanh') },

  { t: 'A name that states the rule', to: true, giua: true, body: two(J(`it('works', () => { … });`, { sm: false }), J(`it('caps the length at 60', () => { … });`, { sm: false, hl: [1] })) +
    two(box('Six months later, in CI: "works" failed', 'Somebody has to open the file and read the body to learn what broke.', 'do2'),
      box('"caps the length at 60" failed', 'The failure report alone tells the next person which invariant broke.', 'xanh')) +
    bang(['vague', 'states the rule'], [["it('works')", "it('caps the length at 60')"], ["it('test update')", "it('404s (not 403) when the note belongs to someone else')"], ["it('error case')", "it('rejects a duplicate slug with 409')"]], { co: 20 }) +
    flow([{ t: 'describe("slugify")', s: 'the unit', mau: LAM }, { t: 'it("caps the length at 60")', s: 'the rule', mau: NODE }, { t: 'expect(…).toBe(60)', s: 'the proof', mau: CAM }], { h: 110 }) },

  { t: 'Why the service could not be tested', to: true, giua: true, body: J(`import { db } from './db.mjs';                 // ← welded to PostgreSQL
export async function create(actor, input) {
  const existing = await db.query('SELECT …');
  …
}`, { sm: false, hl: [1] }) +
    two(box('Nothing wrong at runtime', 'It works in production. It is untestable in a unit test: calling create() at all needs a running PostgreSQL.', 'cam'),
      box('So every test becomes an integration test', 'At the integration price from 14.1 — and you still cannot easily make "the database threw" happen on demand.', 'do2')) +
    flow([{ t: 'a unit test', s: 'calls create()', mau: NODE }, { t: 'import { db }', s: 'fixed at load time', mau: CAM }, { t: 'db.query', s: 'opens a socket', mau: DO }, { t: 'PostgreSQL', s: 'must be running', mau: LAM }], { h: 110 }) },

  { t: 'The fix: pass the dependency in', to: true, giua: true, body: J(L('src/notes.service.mjs', 6, 15), { sm: false, hl: [1, 4, 6] }) +
    flow([{ t: 'production', s: 'createNotesService(createNotesRepo(pool))', mau: LAM }, { t: 'the SAME service code', s: 'two speeds', mau: NODE }, { t: 'a test', s: 'createNotesService(fakeRepo())', mau: CAM }], { h: 110, fs: 18 }) },

  { t: 'The five kinds of test double', to: true, giua: true, body: cards([
    ['Dummy', 'Fills a parameter slot; never actually called.'],
    ['Stub', 'Returns a canned value: findBySlug: async () => null.'],
    ['Spy', 'Records each call so you can inspect it later.'],
    ['Mock', 'A stub plus an expectation about HOW it must be called.'],
    ['Fake', 'A tiny but genuinely working implementation — a repository backed by a Map.'],
    ['State vs interaction', 'Assert on the RESULT when you can; on "was it called" only when the call IS the behaviour.'],
  ], 3) + J(`const stub = { findBySlug: async () => null };                 // stub: a canned answer
const spy  = vi.fn(async (n) => ({ id: 1, ...n }));              // spy: records spy.mock.calls
const fake = new Map();                                          // fake: a tiny working store`, { sm: false, hl: [1, 2, 3] }) },

  { t: 'A fake repository, and a test about a call', to: true, giua: true, body: J(L('tests/service.test.mjs', 5, 14) + '\n…\n' + L('tests/service.test.mjs', 24, 29), { sm: true, hl: [3, 14, 15] }) +
    box('Here the call IS the behaviour', 'A duplicate slug must never reach the database. So besides "409", the test pins "insert was not called".', 'xanh') },

  { t: 'Run it', to: true, giua: true, body: TT('c14/unit', 1, 11, 'npx vitest run tests/slug.test.mjs tests/service.test.mjs · vitest 5.1.0 · real', { hl: [5, 6, 9], n: 104, sm: false }) +
    two(box('Twelve tests, a few milliseconds of real work', '3 ms + 5 ms inside the files. The rest of the ~111 ms is the runner starting — the startup that 14.1 measured separately.', 'xanh'),
      box('vitest 5 prints shares, not milliseconds', '"transform 57 %, import 23 %, tests 13 %": most of the time is preparing the files, not running them.', 'lam')) },

  { t: 'Part 1 in one table', to: true, giua: true, body: bang(['', 'what', 'the rule'], [
    ['shape', 'arrange · act · assert', 'one behaviour per test'],
    ['name', "it('caps the length at 60')", 'the name states the rule'],
    ['testability', 'createNotesService(repo)', 'inject what you want to replace'],
    ['doubles', 'dummy · stub · spy · mock · fake', 'assert on the outcome first'],
    ['12 tests', '2 files, 3 + 5 ms inside, ~111 ms total', 'the runner start dominates'],
  ], { co: 21 }) + box('Part 2', 'The authorization test, time as a dependency, four tests that check nothing, and the habit that catches them.', 'lam') },

  // ── PART 2 ──
  { t: 'The authorization test worth more than the rest', to: true, giua: true, body: J(L('tests/service.test.mjs', 30, 35), { sm: false, hl: [4, 5] }) +
    two(box('The rule from chapter 8', 'A note that belongs to someone else answers 404, never 403 — a 403 confirms the note exists.', 'lam'),
      box('Invisible when it breaks', 'Nothing crashes, the app keeps working, only an attacker notices. Exactly the rule a test must hold in place.', 'do2')) +
    flow([{ t: 'user 7 asks', s: 'to edit note 5', mau: LAM }, { t: 'note 5', s: 'belongs to user 99', mau: CAM }, { t: 'expect', s: '404 · update NOT called', mau: NODE }], { h: 110 }) },

  { t: 'Time is a dependency too', to: true, giua: true, body: J(L('tests/time.test.mjs', 5, 14), { sm: true, hl: [3, 6, 8] }) +
    TT('c14/time', 1, 10, 'npx vitest run tests/time.test.mjs · 2 tests, 20 simulated minutes · real', { hl: [5], n: 104, sm: true }) +
    box('Fake timers make the clock an input', 'vi.setSystemTime and vi.advanceTimersByTime move time instantly — including to the exact millisecond before and at the 15-minute boundary.', 'xanh') },

  { t: 'The same rule with real time', to: true, giua: true, body: TT('c14/time', 11, 21, 'npx vitest run tests/time-real.test.mjs · 1 test that WAITS 1.5 s for real · real', { hl: [5, 6], n: 104, sm: false }) +
    thanh([['fake timers · 2 tests', 4, NODE, '4 ms · 20 simulated minutes'], ['real wait · 1 test', 1605, DO, '1,605 ms · checks less']], { log: true, w: 1100, x0: 300, wMax: 480, h0: 56, chu: 21, ghi: 'time inside the test files · log scale · real' }) },

  { t: 'The enabling detail is in the app, not the test', to: true, giua: true, body: J(L('src/session.mjs', 1, 5), { sm: false, hl: [3] }) +
    two(box('A clock with a default', 'isExpired(session, now = Date.now()) — production passes nothing; a test passes any moment it likes.', 'xanh'),
      box('Even without fake timers', 'isExpired(s, s.createdAt + TTL_MS - 1) is false, isExpired(s, s.createdAt + TTL_MS) is true. The boundary is testable by signature alone.', 'lam')) +
    J(`it('boundary, no timers at all', () => {
  const s = { createdAt: 0 };
  expect(isExpired(s, TTL_MS - 1)).toBe(false);
  expect(isExpired(s, TTL_MS)).toBe(true);
});`, { sm: false, hl: [3, 4] }) },

  { t: 'Four tests that pass while checking nothing', to: true, giua: true, body: J(L('green/four.test.mjs', 1, 17), { sm: true, hl: [6, 9, 12, 15] }) +
    box('Every one of these looks like a test', 'It is counted, it turns the suite green — and it verifies precisely nothing about the code.', 'do2') },

  { t: 'Under vitest 5.1.0', to: true, giua: true, body: TT('c14/green', 1, 9, 'npx vitest run green/four.test.mjs · real', { hl: [6, 7, 8, 9], n: 104, sm: false }) +
    T(G('c14/green', 29, 30, 110), 'the second failure for case 1 · real', { sm: true }) +
    two(box('Caught: 1 and 2', 'vitest flags the missing awaits — case 1 even twice: the wrong message AND "was not awaited".', 'xanh'),
      box('Missed: 3 and 4', 'From the runner\'s point of view nothing bad happened: no assertion ran (3), or it ran and the catch ate it (4).', 'do2')) },

  { t: 'Under node:test — and t.plan', to: true, giua: true, body: T([G('c14/green', 90, 90), G('c14/green', 96, 96), G('c14/green', 116, 116), G('c14/green', 122, 122), G('c14/green', 128, 128), G('c14/green', 135, 136)].join('\n'), 'node --test nt-checks/four-node.test.mjs · real', { hl: [1, 3, 5], sm: false }) +
    T(G('c14/green', 131, 131, 108), 'what node:test printed for case 1 — and still counted it as a pass · real', { sm: true }) +
    two(box('The one real difference', 'assert.rejects() without await passes in node:test; vitest flags it.', 'cam'),
      box('…and node:test has t.plan(n)', 'which catches the callback that never ran (case 3) — the case vitest missed.', 'xanh')) },

  { t: "vitest's guard: expect.assertions(n)", to: true, giua: true, body: J(L('green/fix.test.mjs', 4, 11), { sm: false, hl: [2, 6] }) +
    TT('c14/green', 72, 79, 'npx vitest run green/fix.test.mjs · real', { hl: [2, 3, 8], n: 104, sm: false }) +
    box('Read the second line honestly', 'It caught case 3 and NOT case 4: in the swallowed catch the assertion really ran — and failed — so the counter says 1. No flag saves you from catch {} around your own assertion.', 'do2') },

  { t: 'The only proof that a test tests something', to: true, giua: true, body: TT('c14/mutate', 1, 14, 'mutate.sh · change the 404 to 403 in the service on purpose, run, restore · real', { hl: [2, 6, 9, 11], n: 110, sm: true }) +
    box('Break the code on purpose — watch it go red', 'Ten seconds, the single highest-value habit of this chapter. A test that stays green when the code is wrong is decoration — the branch bug in 14.5 survives 100 % coverage for exactly this reason.', 'xanh') },

  { t: 'How cuongthai.com does it', to: true, giua: true, body: J(WEB.slice(0, 7).join('\n'), { sm: false, hl: [2, 5, 6] }) +
    two(box('src/services/cv/cv.test.ts, real lines 1–7', 'The CV bullet linter is a pure function over text — so its tests never touch a database and run in milliseconds.', 'lam'),
      box('The assertion that matters', 'The CI step that runs the linter\'s golden set says why: it "fails the build if the CV bullet linter regresses — especially if it starts marking STRONG bullets WEAK" — the quiet false positive that would ruin every review.', 'xanh')) },

  { t: 'A unit test that can actually fail', to: true, giua: true, body: cards([
    ['1 · arrange, act, assert', 'A test that does not fit this shape is usually testing more than one thing.'],
    ['2 · inject what you replace', 'A service that builds its own database client cannot be tested without one.'],
    ['3 · assert on the outcome', '"save was called once" passes after a refactor that broke the behaviour; "the record has status paid" does not.'],
    ['4 · make it fail once, on purpose', 'A test that has never failed might be asserting nothing.'],
  ], 2) + box('Exercise', 'Write a test for "a note can be edited by its author or an ADMIN". Then break canEdit on purpose three ways (|| → &&, drop the ADMIN line, author check → !==) and count how many of your tests go red for each.', '') },

  { t: 'Unit tests — in one table', to: true, giua: true, body: bang(['', 'measured here', 'the rule'], [
    ['12 unit tests', '3 + 5 ms of work, ~111 ms with startup', 'cheap enough for every rule'],
    ['20 simulated minutes vs 1.5 s real', '4 ms vs 1,605 ms', 'inject the clock'],
    ['4 hollow tests, vitest', 'caught 1, 2 · missed 3, 4', 'await every async assertion'],
    ['4 hollow tests, node:test', 'missed 1, 3 · t.plan caught 3', 'count your assertions'],
    ['404 → 403 on purpose', '1 failed | 5 passed', 'break it to prove it'],
    ['expect.assertions(1)', 'caught 3 · missed 4', 'never catch {} your own assertion'],
  ], { co: 21 }) + box('Next: 14.3 — the HTTP layer', 'An app factory, supertest, the contract as assertions — and the IDOR this site really shipped.', 'lam') },
]);
