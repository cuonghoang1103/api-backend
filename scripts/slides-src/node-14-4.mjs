/**
 * node-14-4 — Node.js · Chapter 14 · Lesson 14.4 "Testing against a real database" (slide EN, đợt 10 — 08/11/2026).
 * MỘT deck, HAI tập: node-14-4 (slide 1–11) · node-14-4-2 (slide 12–22).
 *   A: ví dụ đời thường (tập lái trên sân tập vs ra đường thật) · phép đo phân định (thật: repo giả 201 ×5 · DB thật 4 × 500 code 23505, 1 dòng · đã sửa 4 × 409) ·
 *      vì sao 500 · sửa ở repository (notes.repo.mjs THẬT) · 22001 (thật) · pool nguội/ấm (thật: cả hai đều đua trên máy quay) · ba cách cô lập · cách 1 transaction (mã THẬT) · bảng phần 1.
 *   B: cách 2 TRUNCATE (thật: 0/10, "expected 79 to be 20") · cách 3 schema mỗi tệp · ba cách đo (thật: 0/10 0,83 s · 10/10 1,36 s · 10/10 0,87 s) · O(max) vs O(sum) ·
 *      CSDL lấy từ đâu (thật: docker run 443 ms · pg_isready 2.015 ms · SELECT 1 thật 2.345 / 2.402 ms, lỗi giữa chừng) · pg_isready nói dối · chọn gì ·
 *      cái bẫy (thật: một dòng sót ⇒ "expected 2 to be 1", "expected 1 to be +0") · hai phòng thủ · website (nay CÓ 43 tệp test DB + job CI Postgres) · bốn điều · bài tập · bảng.
 * Nguồn: nodejs-14-4-db-that. Output THẬT: that/c14/{race,iso,container,trap,http} (vitest 5.1.0, pg 8.23.1, PostgreSQL 17 Docker node14-pg + node14-throw, đã gỡ).
 * Khác web: pool NGUỘI cũng đua (web: nguội ra 201 409 409 409 409) · tuần tự 1,36 s vs song song 0,87 s (web 1,37 / 0,89; test time web 731/260 ms, ở đây 163/242 ms vì cạnh tranh CPU) ·
 *   container: pg_isready 2.015 ms, kết nối thật 2.345 ms (web 954 / 1.149) · website: "không có test DB, CI không bao giờ dựng PostgreSQL" — SAI từ đợt 6a (10/2026) ⇒ đã sửa web.
 */
import { readFileSync } from 'node:fs';
import { lamDeck, two, box, cards, flow, bang, J, JW, TT, T, G, thanh, dong, ra } from './_c9-chung.mjs';

export const deck = { key: 'node-14-4', code: 'NODE 14.4', title: 'Testing against a real database', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const R = (ten, re) => dong(`c14/${ten}`, re);
const num = (s, re) => Number((s.match(re) ?? [0, 'NaN'])[1].replace(/,/g, ''));
const NOTES = (f) => readFileSync(`/Users/admin/Documents/video-bai-giang/src/khung/node/that/c14/notes/${f}`, 'utf8').replace(/\s+$/, '').split('\n');
const L = (f, a, b) => NOTES(f).slice(a - 1, b).join('\n');
const ISO = ['parallel, one shared', 'sequential', 'parallel, one schema'].map((k) => { const l = R('iso', new RegExp(`^${k}`)); return { pass: num(l, /(\d+)\/10/), wall: num(l, /([\d.]+) s/) }; });
const CT = { run: num(R('container', /docker run/), /(\d+) ms/), ready: num(R('container', /pg_isready/), /(\d+) ms/), psql: num(R('container', /psql inside/), /(\d+) ms/), node: num(R('container', /Node \(pg\)/), /(\d+) ms/) };
const CI = readFileSync('/Users/admin/Downloads/api-backend/.github/workflows/ci-lint.yml', 'utf8').split('\n');
const PKG = JSON.parse(readFileSync('/Users/admin/Downloads/api-backend/package.json', 'utf8')).scripts.test.split(/\s+/).filter((x) => /\.test\.(ts|mjs)$/.test(x));
const NDB = PKG.filter((x) => x.includes('.db.test')).length;
const ciAt = (re) => CI.findIndex((l) => re.test(l));
const TR = ra('c14/trap').split('\n'), trAt = (re, k = 0) => TR.map((l, i) => [l, i]).filter(([l]) => re.test(l))[k][1] + 1;
const RACE = readFileSync('/Users/admin/Documents/video-bai-giang/src/khung/node/that/c14/race.mjs', 'utf8').split('\n');

const sanSvg = `<svg data-k="san" viewBox="0 0 1100 200" width="1100" height="200" font-family="Arial">
<rect x="10" y="10" width="520" height="180" rx="16" fill="${CAM}12" stroke="${CAM}" stroke-width="3"/><text x="34" y="85" font-size="50">🚧</text><text x="110" y="62" font-size="22" font-weight="700" fill="${CAM}">a driving range with cones</text><text x="110" y="94" font-size="18" fill="#444">no other cars, no rain, no rush hour</text><text x="34" y="160" font-size="20" font-weight="700" fill="${CAM}">= a fake repository</text>
<rect x="570" y="10" width="520" height="180" rx="16" fill="${LAM}12" stroke="${LAM}" stroke-width="3"/><text x="594" y="85" font-size="50">🚦</text><text x="670" y="62" font-size="22" font-weight="700" fill="${LAM}">a real street at 5 p.m.</text><text x="670" y="94" font-size="18" fill="#444">five cars reach the junction at once</text><text x="594" y="160" font-size="20" font-weight="700" fill="${LAM}">= PostgreSQL with its constraints</text>
</svg>`;

export const slides = lamDeck({ chuong: 'Chapter 14 — Testing', bai: '14.4' }, [
  // ── PART 1 ──
  { cover: true, t: 'Testing against<br>a real database', sub: 'A fake repository answers whatever you told it. A real table has opinions — unique constraints, column widths, isolation, and a clock that runs between two statements. Measured.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>The measurement that settles "do we need a real database in tests"</li>
<li>Two errors a fake will never raise: 23505 and 22001</li>
<li>Isolation, three ways — rollback, TRUNCATE, a schema per file — measured</li>
<li>Where the database comes from, and the probe that lies</li>
<li>The trap this lesson walked into, and what this site does today</li>
</ul>` + box('Why it matters to you', 'Your unit suite is green. This lesson shows the same code answering 500 four times out of five against a real table.', 'lam') },

  { t: 'An everyday picture: the range and the street', to: true, giua: true, body: sanSvg + two(
    box('The range is where you learn', 'Fast, safe, repeatable — exactly what unit tests with a fake are for.', 'xanh'),
    box('The street is where it matters', 'Some things only happen when five cars meet at the same junction. You find them on a real street, or in production.', 'do2')) },

  { t: 'The measurement that settles the argument', to: true, giua: true, body: TT('c14/race', 2, 6, 'node race.mjs · 5 concurrent POST /notes with the same title · real PostgreSQL 17 · real', { hl: [1, 3, 4], n: 104, sm: false }) +
    two(box('The unit suite: green', 'The fake repository has no constraint — five creates of the same title, five 201s.', 'cam'),
      box('A real table: 4 × 500', 'Check-then-act: all five checks saw "no such slug", all five inserted; the UNIQUE constraint stopped four — as 500s.', 'do2')) +
    flow([{ t: '5 requests', s: 'same title, same instant', mau: LAM }, { t: '5 × findBySlug', s: 'all: "not taken"', mau: CAM }, { t: '5 × INSERT', s: 'UNIQUE lets one through', mau: DO }, { t: 'rows = 1', s: 'the data is fine', mau: NODE }], { h: 110 }) },

  { t: 'Why a 500 and not a 409', to: true, giua: true, body: flow([
    { t: 'INSERT', s: 'duplicate slug', mau: LAM }, { t: 'pg throws', s: 'code 23505 · no status', mau: DO }, { t: 'error handler', s: 'err.status ?? 500', mau: CAM }, { t: 'the user sees', s: 'Internal Server Error', mau: DO }], { h: 130 }) +
    J(L('src/app.mjs', 30, 30), { sm: false, hl: [1] }) +
    TT('c14/race', 5, 6, 'node race.mjs · what the 4 failed requests carried, and what the client got · real', { hl: [1], n: 110, sm: true }) +
    box('Plainly a 409 — answered as a 500', 'The error carries a PostgreSQL code but no HTTP status, so the handler falls through to its default — and even leaks the constraint name to the client.', 'do2') },

  { t: 'The fix belongs in the repository', to: true, giua: true, body: JW(L('src/notes.repo.mjs', 12, 20), 96, [6], { sm: false }) +
    TT('c14/race', 7, 7, 'node race.mjs · the same 5 requests with the fixed repository · real', { hl: [1], n: 104, sm: false }) +
    two(box('The pre-check stays', 'It saves a round trip in the common case and gives a nicer message.', 'lam'),
      box('The constraint is the rule', 'Validation in application code is a courtesy. The UNIQUE constraint is what actually enforces it.', 'xanh')) },

  { t: 'What else a fake will never tell you: 22001', to: true, giua: true, body: TT('c14/race', 8, 8, 'node race.mjs · a 201-character title straight into the table · real', { hl: [1], n: 104, sm: false }) +
    J(L('src/app.mjs', 5, 5) + '\n' + readFileSync('/Users/admin/Documents/video-bai-giang/src/khung/node/that/c14/notes/schema.sql', 'utf8').split('\n')[2], { sm: false, hl: [1, 2] }) +
    flow([{ t: 'zod', s: 'max(200) → 500', mau: CAM }, { t: 'migration', s: 'forgotten', mau: DO }, { t: 'varchar(200)', s: 'unchanged', mau: LAM }, { t: 'a 300-char title', s: '22001 → 500', mau: DO }], { h: 110 }) +
    box('Two limits that must agree', 'zod caps the title at 200, the column is varchar(200). The day someone widens zod to 500 and forgets the migration, no unit test can notice — the fake accepts any string. An integration test notices at once.', 'cam') },

  { t: 'A race you could not reproduce', to: true, giua: true, body: TT('c14/race', 3, 4, 'node race.mjs · a COLD pool (no connection yet) vs a WARM one (5 opened first) · real', { hl: [1, 2], n: 104, sm: false }) +
    two(box('On this machine: both race', 'The web lesson measured a cold pool serialising the five requests by accident (201 409 409 409 409) — connections 2–5 were still shaking hands.', 'lam'),
      box('The lesson stands', 'A concurrency bug you cannot reproduce may be hiding behind a warm-up cost. Open and warm the connections, then fire.', 'cam')) +
    JW(RACE.find((l) => l.startsWith('const warm')).replace(/\)\)\.then/, '))\n  .then'), 70, [1], { sm: false }) },

  { t: 'Isolation: three ways', to: true, giua: true, body: cards([
    ['1 · a transaction per test', 'BEGIN before, ROLLBACK after. The fastest correct answer.'],
    ['2 · TRUNCATE between tests', 'Simple — and it defeats parallel test files.'],
    ['3 · a schema per test file', 'Parallel AND correct.'],
  ], 3) + box('The problem they solve', 'Tests that share a table see each other\'s rows. A test that passes alone and fails in the suite is the first symptom.', 'cam') +
    flow([{ t: 'file A', s: 'inserts 20', mau: LAM }, { t: 'the SAME table', s: 'shared by everyone', mau: DO }, { t: 'file B', s: 'counts… 40?', mau: CAM }], { h: 110 }) },

  { t: 'Way 1 — a transaction per test', to: true, giua: true, body: J(L('tests/http.int.test.mjs', 10, 23), { sm: true, hl: [4, 8, 10, 12, 14] }) +
    two(box('The critical detail', 'The app is built around the SAME client that holds the transaction. Give it the pool and its queries run on another connection — outside your transaction — and the rollback cleans nothing.', 'do2'),
      box('Cost and limit', 'A BEGIN and a ROLLBACK per test, well under a millisecond. It cannot test code that manages its own transactions (that needs savepoints).', 'lam')) },

  { t: 'Part 1 in one table', to: true, giua: true, body: bang(['', 'measured', 'the rule'], [
    ['fake repo, 5 concurrent', '201 201 201 201 201', 'a fake has no constraints'],
    ['real table, naive repo', '4 × 500, code 23505', 'map driver errors in the repository'],
    ['real table, fixed repo', '4 × 409, 1 × 201', 'the constraint is the rule'],
    ['201-character title', 'code 22001', 'zod and the column must agree'],
    ['a transaction per test', 'BEGIN / ROLLBACK on ONE client', 'build the app on that client'],
  ], { co: 21 }) + box('Part 2', 'TRUNCATE vs a schema per file, measured · where the database comes from · the trap · what this site does.', 'lam') },

  // ── PART 2 ──
  { t: 'Way 2 — TRUNCATE between tests', to: true, giua: true, body: JW(L('iso/shared/f2.test.mjs', 3, 11), 100, [2, 7, 8], { sm: true }) +
    T(G('c14/iso', 3, 3) + '\n' + G('c14/iso', 7, 9), 'node iso.mjs · 4 such files, run in parallel, 10 times · real', { hl: [1], sm: false }) +
    box('Not flaky — reliably broken', 'Each file truncates the table the others are halfway through filling. 0 out of 10.', 'do2') },

  { t: 'Way 3 — a schema per test file', to: true, giua: true, body: JW(L('iso/schema/f1.test.mjs', 3, 12), 100, [1, 6, 7, 10], { sm: true }) +
    box('Each file gets its own copy of the table', 'test_w1, test_w2… are created in beforeAll and dropped in afterAll. Files can run side by side and never see each other.', 'xanh') +
    flow([{ t: 'f1', s: 'test_w1.notes', mau: NODE }, { t: 'f2', s: 'test_w2.notes', mau: NODE }, { t: 'f3', s: 'test_w3.notes', mau: NODE }, { t: 'f4', s: 'test_w4.notes', mau: NODE }], { h: 100 }) },

  { t: 'All three, ten runs each', to: true, giua: true, body: TT('c14/iso', 2, 5, 'node iso.mjs · 4 files × 20 inserts · real', { hl: [2, 3, 4], n: 108, sm: false }) +
    thanh([['parallel, shared table', ISO[0].wall, DO, `${ISO[0].wall} s · ${ISO[0].pass}/10 pass`], ['sequential', ISO[1].wall, CAM, `${ISO[1].wall} s · ${ISO[1].pass}/10 pass`], ['parallel, schema per file', ISO[2].wall, NODE, `${ISO[2].wall} s · ${ISO[2].pass}/10 pass`]], { w: 1100, x0: 320, wMax: 460, h0: 56, chu: 21, ghi: 'wall time, median of 10 · real' }) +
    box('Correct AND fast is possible', 'The schema-per-file run is as fast as the broken one and as correct as the slow one.', 'xanh') },

  { t: 'Why "sequential" is worse than it looks', to: true, giua: true, body: two(
    box('--no-file-parallelism fixes correctness', `…and costs ${(ISO[1].wall / ISO[2].wall).toFixed(1)}× the wall time here. A schema per file fixes correctness and costs nothing.`, 'cam'),
    box('The gap grows with every file', 'In parallel the run is bounded by the SLOWEST file; sequentially by their SUM. O(max) becomes O(sum) — forever.', 'do2')) +
    bang(['test files (an illustration: 250 ms each)', 'parallel ≈ max', 'sequential ≈ sum'], [['4 files', '≈ 0.25 s', '≈ 1 s'], ['40 files', '≈ 0.25 s × 40 / your cores', '≈ 10 s'], ['400 files', 'still bounded by cores', '≈ 100 s']], { co: 20 }) +
    flow([{ t: 'a suite goes flaky', s: 'shared state', mau: DO }, { t: 'the reflex', s: '--no-file-parallelism', mau: CAM }, { t: 'it works', s: 'but CI slows every week', mau: CAM }, { t: 'the real fix', s: 'isolate, do not serialise', mau: NODE }], { h: 120 }) },

  { t: 'Where the database comes from', to: true, giua: true, body: TT('c14/container', 2, 5, 'node container.mjs · docker run postgres:17, then probe every 10 ms · real', { hl: [1, 2, 3, 4], n: 104, sm: false }) +
    thanh([['docker run returns', CT.run, LAM, `${CT.run} ms`], ['pg_isready says OK', CT.ready, CAM, `${CT.ready} ms`], ['a real SELECT 1 works', CT.node, NODE, `${CT.node} ms`]], { w: 1100, x0: 300, wMax: 520, h0: 52, chu: 21, ghi: 'from "docker run" · real' }) +
    box('The honest price of a clean database per run', `About ${(CT.node / 1000).toFixed(1)} s — cheap against a CI job of minutes, expensive against the 0.1 s loop you run while typing.`, 'lam') },

  { t: 'Pitfall — pg_isready lies during initialisation', to: true, giua: true, body: TT('c14/container', 6, 11, 'node container.mjs · errors seen AFTER pg_isready had said OK · real', { hl: [3, 4, 5], n: 116, sm: true }) +
    two(box('Why', 'The image starts a TEMPORARY server to run its init scripts, shuts it down, then starts the real one. pg_isready happily answers during that window.', 'cam'),
      box('Wait for a real query', `Loop on SELECT 1 until it succeeds — not on a health probe. This ${CT.node - CT.ready} ms window is a whole genre of "works locally, fails in CI".`, 'xanh')) },

  { t: 'The trap this lesson walked into', to: true, giua: true, body: TT('c14/trap', 1, 9, 'trap.sh · one row left behind by the race demo · the naive version of the suite · real', { hl: [2, 8, 9], n: 104, sm: false }) +
    T([G('c14/trap', trAt(/^ FAIL/), trAt(/^ FAIL/) + 1), G('c14/trap', trAt(/^ FAIL/, 1), trAt(/^ FAIL/, 1) + 1)].join('\n'), 'the two failures · real', { sm: false, hl: [2, 4] }) +
    box('Neither the tests nor the code changed a character', 'A separate script (the race demo) had left one row in the table. The suite went red anyway.', 'do2') },

  { t: 'Two defences — use both', to: true, giua: true, body: J(`// 1 · assert relative to what THIS test created
SELECT count(*) FROM notes WHERE author_id = 7
// 2 · start the suite from a KNOWN state
beforeAll(() => pool.query('TRUNCATE notes RESTART IDENTITY'))`, { sm: false, hl: [2, 4] }) +
    T(G('c14/trap', trAt(/http\.int\.test\.mjs \(6 tests\)/), trAt(/http\.int\.test\.mjs \(6 tests\)/) + 3), 'npx vitest run tests/http.int.test.mjs — the suite with both defences, same leftover row · real', { hl: [2], sm: false }) +
    box('Rollback isolates tests from EACH OTHER', 'It does nothing about state that was already in the table when the suite started.', 'cam') },

  { t: 'How cuongthai.com does it — today', to: true, giua: true, body: J([...CI.slice(ciAt(/^  work-db-tests:/), ciAt(/^  work-db-tests:/) + 1), '    …', ...CI.slice(ciAt(/image: pgvector/), ciAt(/image: pgvector/) + 1), ...CI.slice(ciAt(/--health-cmd/), ciAt(/--health-cmd/) + 1), '    …', ...CI.slice(ciAt(/Build test DB from migrations/), ciAt(/Build test DB from migrations/) + 2), ...CI.slice(ciAt(/name: CT Work DB tests \(WORK_DB_TEST/), ciAt(/name: CT Work DB tests \(WORK_DB_TEST/) + 2)].join('\n'), { sm: true, hl: [1, 3, 4] }) +
    two(box(`${NDB} database test files, a Postgres job in CI`, 'Since October 2026 CI starts a pgvector PostgreSQL, rebuilds the schema from the migration history, and runs the CT Work database tests file by file.', 'xanh'),
      box('Note the health check', 'The service waits on pg_isready — the probe from two slides ago. The test step runs after the schema has been built by real queries, which is what makes it safe.', 'cam')) },

  { t: 'What only a real database can tell you', to: true, giua: true, body: cards([
    ['1 · whether the SQL is valid', 'A fake accepts any query; a real database rejects a typo\'d column the moment the test runs.'],
    ['2 · whether the constraint fires', 'Unique, foreign key, check, cascade — a mock returns whatever you told it.'],
    ['3 · whether the transaction rolls back', 'The behaviour under a mid-transaction failure — exactly what a fake cannot simulate.'],
    ['4 · at a price you can measure', 'A container per suite: seconds. Per test: minutes. Rollback per test keeps it fast.'],
  ], 2) + box('Exercise', 'Add a test that two concurrent PATCHes renaming two notes to the same title both answer 409-or-200 — never 500. Run it against the fake and against PostgreSQL; explain the difference.', '') },

  { t: 'A real database — in one table', to: true, giua: true, body: bang(['', 'measured here', 'the rule'], [
    ['5 concurrent duplicates', 'fake: 5 × 201 · real: 4 × 500 → 4 × 409', 'map 23505 to 409'],
    ['4 files, shared table', `${ISO[0].pass}/10 pass`, 'never share a table across files'],
    ['sequential vs schema per file', `${ISO[1].wall} s vs ${ISO[2].wall} s, both 10/10`, 'isolate, do not serialise'],
    ['throw-away container', `ready ${CT.ready} ms, usable ${CT.node} ms`, 'wait for a real query'],
    ['one leftover row', 'expected 2 to be 1', 'assert relative + start clean'],
  ], { co: 21 }) + box('Next: 14.5 — coverage, flaky tests and CI', 'A privilege escalation that survives 100 % coverage, the four causes of flaky tests, and running it all somewhere that is not your laptop.', 'lam') },
]);
