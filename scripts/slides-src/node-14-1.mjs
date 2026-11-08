/**
 * node-14-1 — Node.js · Chapter 14 · Lesson 14.1 "What a test costs and what it buys" (slide EN, đợt 10 — 08/11/2026).
 * MỘT deck, MỘT tập node-14-1 (18 slide).
 *   ví dụ đời thường (thử con ốc · thử động cơ · lái thử) · vì sao cần bộ test · ba loại test đo thật (thật: 0,001 / 2,398 / 2,110 ms mỗi test, trung vị 5 vòng) ·
 *   logic thuần (thật: slugify 0,0004 ms, 2.355.643 lần/s, 5.649×) · mỗi loại bắt lỗi gì · bất ngờ e2e ≈ integration · chọn runner (thật: node:test 0,09 / 0,58 s ·
 *   vitest 5.1.0 0,49 / 1,36 s · jest 30.5.2 0,44 / 0,96 s) · cân nặng (thật: vitest 35 gói 38 MB · jest 278 gói 50 MB · node:test 0) · runner có sẵn (thật: # tests 6) ·
 *   bẫy thư mục trần (thật: MODULE_NOT_FOUND) · jest ESM (thật: "Must use import to load ES Module" ⇒ cờ --experimental-vm-modules) · chọn cái nào ·
 *   website (thật: 190 tệp test trong npm test, 43 tệp DB; money.test.ts THẬT dòng 1–9) · bài tập · bảng.
 * Nguồn: nodejs-14-1-vi-sao-test. Output THẬT: that/c14/{pyramid,runners,runners-pkg,nodetest,jest-esm} (Node 22.23.3, vitest 5.1.0, jest 30.5.2, supertest 7.3.2,
 *   Express 5.3.0, zod 4.6.7, pg 8.23.1, PostgreSQL 17 Docker `node14-pg` 127.0.0.1:4888, đã gỡ). Dự án mẫu: that/c14/notes.
 * Khác web: e2e 2,110 vs integration 2,398 ms (web 3,3 / 5,5) · vitest 5.1.0 KHÔNG nhanh hơn jest ở cả hai cỡ (web: vitest 4.1.10 0,76/2,20, jest 0,86 (*) / 2,08) ·
 *   gói: vitest 35 / 38 MB, jest 278 / 50 MB (web 75 / 34, 322 / 43) · thông báo jest 30.5.2 khác ("Must use import to load ES Module", web "Cannot use import statement") ·
 *   website: 190 tệp test (web: 3 tệp, 20 test, 1297 ms) ⇒ đã sửa web.
 */
import { readFileSync } from 'node:fs';
import { lamDeck, two, box, cards, flow, bang, J, TT, T, G, thanh, dong, ra } from './_c9-chung.mjs';

export const deck = { key: 'node-14-1', code: 'NODE 14.1', title: 'What a test costs and what it buys', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const R = (ten, re) => dong(`c14/${ten}`, re);
const num = (s, re) => Number((s.match(re) ?? [0, 'NaN'])[1].replace(/,/g, ''));
const PY = { u: num(R('pyramid', /^unit/), /= ([\d.]+) ms per/), i: num(R('pyramid', /^integration/), /= ([\d.]+) ms per/), e: num(R('pyramid', /^e2e/), /= ([\d.]+) ms per/),
  p: num(R('pyramid', /^slugify/), /-> ([\d.]+) ms per/), ps: num(R('pyramid', /^slugify/), /· ([\d,]+) calls/), x: num(R('pyramid', /per call =/), /= ([\d,]+)x/) };
const RU = ['node:test', 'vitest', 'jest'].map((k) => { const l = R('runners', new RegExp(`^${k}`)); const m = l.match(/([\d.]+) s\s+([\d.]+) s/); return [k, Number(m[1]), Number(m[2])]; });
const WEB = readFileSync('/Users/admin/Downloads/api-backend/src/services/finance/money.test.ts', 'utf8').split('\n');
const PKG = JSON.parse(readFileSync('/Users/admin/Downloads/api-backend/package.json', 'utf8')).scripts.test.split(/\s+/).filter((x) => /\.test\.(ts|mjs)$/.test(x));
const NOTES = (f) => readFileSync(`/Users/admin/Documents/video-bai-giang/src/khung/node/that/c14/notes/${f}`, 'utf8').replace(/\s+$/, '');

const xeSvg = `<svg data-k="xe" viewBox="0 0 1100 220" width="1100" height="220" font-family="Arial">
<rect x="10" y="15" width="340" height="190" rx="16" fill="${NODE}12" stroke="${NODE}" stroke-width="3"/><text x="30" y="88" font-size="50">🔩</text><text x="100" y="62" font-size="22" font-weight="700" fill="${NODE}">test one bolt</text><text x="100" y="92" font-size="18" fill="#444">on the bench · seconds</text><text x="30" y="170" font-size="20" font-weight="700" fill="${NODE}">= unit test</text>
<rect x="380" y="15" width="340" height="190" rx="16" fill="${LAM}12" stroke="${LAM}" stroke-width="3"/><text x="400" y="88" font-size="50">⚙️</text><text x="470" y="62" font-size="22" font-weight="700" fill="${LAM}">run the engine</text><text x="470" y="92" font-size="18" fill="#444">parts together · minutes</text><text x="400" y="170" font-size="20" font-weight="700" fill="${LAM}">= integration test</text>
<rect x="750" y="15" width="340" height="190" rx="16" fill="${CAM}12" stroke="${CAM}" stroke-width="3"/><text x="770" y="88" font-size="50">🚗</text><text x="840" y="62" font-size="22" font-weight="700" fill="${CAM}">drive the car</text><text x="840" y="92" font-size="18" fill="#444">the whole thing · an hour</text><text x="770" y="170" font-size="20" font-weight="700" fill="${CAM}">= end-to-end test</text>
</svg>`;

export const slides = lamDeck({ chuong: 'Chapter 14 — Testing', bai: '14.1' }, [
  { cover: true, t: 'What a test costs<br>and what it buys', sub: 'One rule, checked three ways and timed. Three runners on the same 1,000 tests. The question is not whether to test — it is what each second of test time buys.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>Why a project needs a suite at all — the chapter-12 change that breaks chapter 8</li>
<li>Unit, integration, end-to-end: the same assertion, timed three ways</li>
<li>node:test vs vitest vs jest — measured, not argued</li>
<li>The built-in runner, its one trap, and where jest costs you a day</li>
<li>Which runner to choose, and what this site actually runs</li>
</ul>` + box('Why it matters to you', 'Tests are the only thing that re-checks chapter 8 every time you touch chapter 12. Knowing their price lets you buy the right ones.', 'lam') },

  { t: 'An everyday picture: the car factory', to: true, giua: true, body: xeSvg + two(
    box('Each level catches different faults', 'A bolt can be perfect and the engine still leak; an engine can run and the car still pull left. You need some of each.', 'lam'),
    box('…at very different prices', 'You can test a thousand bolts in the time it takes to drive the car once. That price ratio decides the shape of your suite.', 'cam')) },

  { t: 'Why a suite at all', to: true, giua: true, body: flow([
    { t: 'chapter 8', s: 'ownership: 404, not 403', mau: LAM }, { t: 'chapter 12', s: 'you add a cache', mau: CAM }, { t: 'nothing re-checks', s: 'chapter 8 silently breaks', mau: DO }, { t: 'a test suite', s: 'the re-check, automated', mau: NODE }], { h: 130 }) +
    two(box('Running it once and looking', 'Works while a feature is new and you are the only person touching it.', 'cam'),
      box('Stops working', 'The moment a change in one place breaks something you wrote months ago — because nothing in your workflow looks there again.', 'do2')) +
    cards([['🔁 re-checks everything', 'every rule, every time, in seconds'], ['📜 writes the rules down', 'a failing test names the broken invariant'], ['🛠 lets you change code', 'refactor without fear — the suite tells you']], 3) },

  { t: 'Three kinds of test, measured', to: true, giua: true, body: TT('c14/pyramid', 2, 4, 'node pyramid.mjs · one rule: "POST /notes → 201 and the slug comes from the title" · 100 each · median of 5 rounds · real', { hl: [1, 2, 3], n: 104, sm: false }) +
    thanh([['unit', PY.u, NODE, `${PY.u} ms per test`], ['integration', PY.i, LAM, `${PY.i} ms per test`], ['end-to-end', PY.e, CAM, `${PY.e} ms per test`]], { log: true, w: 1100, x0: 200, wMax: 640, h0: 56, chu: 22, ghi: 'ms per test · log scale · real' }) +
    box('Same rule, three prices', 'unit = the service with a fake repository · integration = supertest + a real PostgreSQL table · end-to-end = a real server listening + a real HTTP client.', 'lam') },

  { t: 'The pure logic alone', to: true, giua: true, body: TT('c14/pyramid', 5, 6, 'node pyramid.mjs · slugify() 100,000 times · real', { hl: [1, 2], n: 104, sm: false }) +
    two(box('Read it as a budget', `A 10-second suite holds about ${Math.round(10000 / PY.p / 1e6)} million pure-logic checks — or about ${Math.round(10000 / PY.i).toLocaleString('en-US')} integration tests.`, 'xanh'),
      box('Not as a verdict', 'Both suites take ten seconds. They do not catch the same bugs — which is the next slide.', 'cam')) +
    J(`slugify('Hello World ' + i)          // the business rule, nothing else: ~${PY.p} ms
request(app).post('/notes').send(…)   // the same rule through Express, zod, SQL: ~${PY.i} ms`, { sm: false, hl: [1, 2] }) +
    flow([{ t: 'slugify()', s: `${PY.p} ms`, mau: NODE }, { t: 'HTTP + SQL', s: `${PY.i} ms`, mau: LAM }, { t: 'ratio', s: `${PY.x.toLocaleString('en-US')}×`, mau: DO }], { h: 110 }) },

  { t: 'What each level catches', to: true, giua: true, body: cards([
    ['🔩 unit', 'One function, every dependency faked. Logic errors, boundary errors, arithmetic errors.'],
    ['⚙️ integration', 'Route + service + a real database. SQL errors, constraint violations, status codes, authorisation.'],
    ['🚗 end-to-end', 'A real server on a port, a real client. Assembly errors: middleware in the wrong order, a route never mounted.'],
  ], 3) + bang(['a real bug', 'the cheapest level that sees it'], [
    ['slugify keeps a trailing dash', 'unit'], ['a duplicate slug answers 500 instead of 409', 'integration (needs the real UNIQUE constraint)'], ['the router is mounted at /note instead of /notes', 'end-to-end (or an HTTP test of the real app)'],
  ], { co: 21 }) + box('So: many cheap ones, some expensive ones', 'Every rule at the cheapest level that can see it — and the rules a cheap level is blind to, one level up.', 'xanh') },

  { t: 'The surprise in that table', to: true, giua: true, body: two(box(`end-to-end ${PY.e} ms`, 'server.listen() ONCE, every request reuses it.', 'lam'), box(`integration ${PY.i} ms`, 'supertest builds and tears down an HTTP server for EVERY request.', 'cam')) +
    flow([{ t: 'request(app)', s: 'create a server', mau: LAM }, { t: 'listen(0)', s: 'a random port', mau: LAM }, { t: 'send', s: 'one request', mau: NODE }, { t: 'close', s: 'tear it down', mau: CAM }], { h: 120 }) +
    box('Measure your own suite', 'The end-to-end number is LOWER than the integration one — against every pyramid diagram ever drawn. A tool detail, not a law of nature (lesson 14.3 comes back to it).', 'do2') },

  { t: 'Choosing a runner — with numbers', to: true, giua: true, body: TT('c14/runners', 2, 5, 'node runners.mjs · same machine · wall-clock time of the whole command · best of 3 · real', { hl: [2], n: 104, sm: false }) +
    thanh(RU.flatMap(([k, a, b]) => [[`${k} · 6`, a, k === 'node:test' ? NODE : k === 'vitest' ? CAM : LAM, `${a} s`], [`${k} · 1000`, b, k === 'node:test' ? NODE : k === 'vitest' ? CAM : LAM, `${b} s`]]), { w: 1100, x0: 250, wMax: 600, h0: 40, chu: 19, ghi: 'seconds, whole command · real' }) },

  { t: 'What each runner adds to node_modules', to: true, giua: true, body: TT('c14/runners-pkg', 1, 8, 'a fresh install in an empty folder · npm 10, Node 22 · real', { hl: [2, 5, 8], n: 110, sm: false }) +
    two(box('node:test', 'Ships with Node. Nothing to install, nothing to upgrade, nothing that a Vite release can make obsolete.', 'xanh'),
      box('vitest · jest', 'Tens to hundreds of packages in devDependencies — each one a version to keep up with.', 'cam')) },

  { t: 'Two results that do not match the marketing', to: true, giua: true, body: two(
    box('"vitest is much faster than jest"', `Not for plain unit tests on a Node backend: here jest was ahead at both sizes (${RU[2][1]} vs ${RU[1][1]} s, ${RU[2][2]} vs ${RU[1][2]} s). Vitest's real edge is in a Vite front-end, where it reuses the app's own transform pipeline.`, 'cam'),
    box('The built-in runner won everywhere', `${RU[0][1]} s for 6 tests — the loop you run hundreds of times a day while typing — and ${RU[0][2]} s for 1,000.`, 'xanh')) +
    thanh([['vitest · 1000 tests', RU[1][2], CAM, `${RU[1][2]} s`], ['jest · 1000 tests', RU[2][2], LAM, `${RU[2][2]} s`], ['node:test · 1000 tests', RU[0][2], NODE, `${RU[0][2]} s`]], { w: 1100, x0: 280, wMax: 560, h0: 48, chu: 20, ghi: 'best of 3 · real' }) +
    box('Numbers from one machine, on one day', 'They will differ on yours. That is the point: measure before you adopt a tool for its speed.', 'lam') },

  { t: 'What the built-in runner looks like', to: true, giua: true, body: J(NOTES('nodetest/slug.test.mjs').split('\n').slice(0, 9).join('\n'), { sm: true, hl: [1, 2] }) +
    T(G('c14/nodetest', 1, 1) + '\n…\n' + G('c14/nodetest', 54, 57) + '\n' + G('c14/nodetest', 61, 63), "node --test, then --test-reporter=dot · real", { hl: [3, 6, 9], sm: true }) +
    box('No install, no config file', 'Plus --watch, --test-only, --test-name-pattern, and built-in coverage (--experimental-test-coverage).', 'xanh') },

  { t: 'Pitfall — a bare directory is not a glob', to: true, giua: true, body: TT('c14/nodetest', 64, 69, 'node --test nodetest/ · real', { hl: [1, 5], n: 104, sm: false }) +
    two(box('Why', 'The argument is resolved as ONE file to execute — and nodetest/ is a folder.', 'do2'),
      box('Fix', "Pass a quoted glob: node --test 'nodetest/**/*.test.mjs' — or pass nothing and let Node discover *.test.* files itself.", 'xanh')) +
    J(`node --test nodetest/                  # ✗ "Cannot find module …/nodetest"
node --test 'nodetest/**/*.test.mjs'   # ✓ quoted, so Node expands it (not your shell)
node --test                            # ✓ finds **/*.test.{js,mjs,cjs} by itself`, { sm: false, hl: [2, 3] }) },

  { t: 'Where jest costs you a day', to: true, giua: true, body: T(G('c14/jest-esm', 1, 5, 110) + '\n' + G('c14/jest-esm', 14, 15) + '\n' + G('c14/jest-esm', 19, 20, 110) + '\n' + G('c14/jest-esm', 22, 22) + '\n…\n' + G('c14/jest-esm', 32, 33), 'npx jest, then NODE_OPTIONS=--experimental-vm-modules npx jest · "type": "module", .mjs files · real', { hl: [5, 7, 8, 10, 12], sm: true }) +
    two(box('The price', 'A flag that prints an ExperimentalWarning, a jest.config with testMatch for .mjs, and vi.fn → jest.fn when you port tests.', 'cam'),
      box('Not hard — but paid per project', 'And again each time a contributor\'s editor autocompletes the other runner\'s API.', 'lam')) },

  { t: 'So which one', to: true, giua: true, body: cards([
    ['A pure Node backend (JS, or TS via tsx)', 'node:test — zero dependencies, fastest on the small suites you run all day.'],
    ['A Vite / React front-end in the same repo', 'vitest — shares the transform, the config and the matchers with the front-end.'],
    ['An older repo with thousands of jest tests', 'keep jest — the migration buys you nothing in the tables above.'],
  ], 3) + two(J(`// vitest
expect(slugify('Hi A')).toBe('hi-a');
expect(fn).toHaveBeenCalledWith(7);`, { sm: false }), J(`// node:test
assert.equal(slugify('Hi A'), 'hi-a');
assert.equal(fn.mock.calls[0].arguments[0], 7);`, { sm: false })) + box('This chapter writes its examples in vitest', 'Its expect API is the one you will meet in interviews and existing repos, and its failure output reads best while you learn. Everything converts mechanically: expect(x).toBe(y) → assert.equal(x, y).', 'lam') },

  { t: 'How cuongthai.com does it', to: true, giua: true, body: J(WEB.slice(0, 9).join('\n'), { sm: false, hl: [2, 4] }) +
    two(box(`node:test only — ${PKG.length} test files today`, `npm test lists ${PKG.length} files (${PKG.filter((x) => x.includes('.db.test')).length} of them database tests that run only with WORK_DB_TEST=1), run by tsx --test. No jest, no vitest in devDependencies.`, 'xanh'),
      box('The selection rule, written down', 'money.test.ts: "Pure functions — no DB, no network — so they run fast and deterministically in CI." Decimal-safe money, HALF_UP rounding, payment signatures: expensive to get wrong, cheap to check.', 'lam')) },

  { t: 'Exercise', to: true, giua: true, body: flow([{ t: '(a) 300 unit tests', s: 'a price calculator', mau: NODE }, { t: '(b) 40 HTTP tests', s: '401 without a token', mau: LAM }, { t: '(c) 1 browser test', s: 'log in, create a note', mau: CAM }], { h: 110 }) + box('Exercise', 'Your Express API has 40 routes. You have one afternoon. Rank these by "bugs caught per second of test time": (a) 300 unit tests for a price calculator, (b) one supertest test per route for 401 without a token, (c) one browser test that logs in and creates a note. Which runner for a backend-only repo?', '') +
    `<div data-k="dapan">${box('Answer', `(a) almost free (${PY.p} ms each) and catches arithmetic and boundary bugs — write them. (b) ~${PY.i} ms each, 40 tests ≈ 0.1 s, and catches a route that forgot auth — the cheapest security test you will ever write. (c) seconds, catches assembly errors — write ONE as a smoke test, not hundreds. Runner: node:test (${RU[0][1]} s for a small suite, zero dependencies).`, 'xanh')}</div>` },

  { t: 'What a test costs — in one table', to: true, giua: true, body: bang(['', 'measured here', 'the rule'], [
    ['unit (fake repo)', `${PY.u} ms per test`, 'most of your tests'],
    ['integration (HTTP + PostgreSQL)', `${PY.i} ms per test`, 'the rules a fake cannot see'],
    ['end-to-end (server once + fetch)', `${PY.e} ms per test`, 'a few, for assembly'],
    ['node:test · vitest · jest, 6 tests', `${RU[0][1]} · ${RU[1][1]} · ${RU[2][1]} s`, 'measure before you choose'],
    ['jest + ES modules', 'needs --experimental-vm-modules', 'a cost paid per project'],
  ], { co: 21 }) + box('Next: 14.2 — unit tests', 'The shape of a test, the change that makes a service testable, five test doubles, fake time — and four tests that pass while checking nothing.', 'lam') },
]);
