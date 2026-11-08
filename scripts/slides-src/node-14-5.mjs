/**
 * node-14-5 — Node.js · Chapter 14 · Lesson 14.5 "Coverage, flaky tests, and CI" (slide EN, đợt 10 — 08/11/2026).
 * MỘT deck, HAI tập: node-14-5 (slide 1–10) · node-14-5-2 (slide 11–21).
 *   A: ví dụ đời thường (máy báo khói) · canEdit (slug.mjs THẬT dòng 11–15) · độ phủ chỉ slug (thật: 100 / 83,33 / 100 / 100, dòng 15) · thêm service (thật: 6/6 nhánh, 100 %) ·
 *      vẫn leo thang (thật: canEdit EDITOR = true) · độ phủ đếm gì · báo cáo đầy đủ (thật: 20 test, All 90,62 / 90,32 / 88,46 / 89,36, repo 17–25) · kiểm thử đột biến (thật 14.2: 404 → 403 ⇒ đỏ) ·
 *      bốn nguyên nhân chập chờn · bảng phần 1.
 *   B: săn test chập chờn (thật: 0/10 · shuffle hai thứ tự) · retry không phải cách sửa (tính: 30 % → 2,7 %) · chạy ở máy khác (thật: node:22-alpine sạch, npm ci 21.142 ms vs npm test 842 ms) ·
 *      workflow của website (ci-lint.yml THẬT) · thời gian thật (thật: 8 lần gần nhất 8m24s–11m51s, ĐỎ ở bước type-check; job DB 451 s) · bốn quyết định thiết kế · cái gì nên chặn merge ·
 *      website deploy (deploy-nha.sh: smoke-test + đẩy GitHub sau bộ kiểm CI trên worktree sạch) · bài tập · bảng.
 * Nguồn: nodejs-14-5-do-phu-flaky-ci. Output THẬT: that/c14/{coverage,shuffle,iso,ci-clean,ci-runs,mutate} (vitest 5.1.0 + @vitest/coverage-v8 5.1.0, Docker node:22-alpine, gh CLI chỉ đọc).
 * Khác web: báo cáo đầy đủ 20 test 90,62 % (web 21 test 83,33 %) · CI website nay 8m24s–11m51s và ĐỎ 8 lần liền ở type-check (web: 1m30s–2m8s xanh, ci-lint chỉ 1 job) ·
 *   deploy: web tả deploy.sh + người thử production + push tay — nay deploy-nha.sh tự đẩy sau bộ kiểm CI trên worktree sạch ⇒ đã sửa web.
 */
import { readFileSync } from 'node:fs';
import { lamDeck, two, box, cards, flow, bang, J, JW, TT, T, G, thanh, dong, ra } from './_c9-chung.mjs';

export const deck = { key: 'node-14-5', code: 'NODE 14.5', title: 'Coverage, flaky tests, and CI', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const R = (ten, re) => dong(`c14/${ten}`, re);
const num = (s, re) => Number((s.match(re) ?? [0, 'NaN'])[1].replace(/,/g, ''));
const NOTES = (f) => readFileSync(`/Users/admin/Documents/video-bai-giang/src/khung/node/that/c14/notes/${f}`, 'utf8').replace(/\s+$/, '').split('\n');
const L = (f, a, b) => NOTES(f).slice(a - 1, b).join('\n');
const CI = readFileSync('/Users/admin/Downloads/api-backend/.github/workflows/ci-lint.yml', 'utf8').split('\n');
const ciAt = (re) => CI.findIndex((l) => re.test(l));
const CIL = (re, n = 1) => CI.slice(ciAt(re), ciAt(re) + n);
const hlOf = (lines, res) => lines.map((l, i) => (res.some((r) => r.test(l)) ? i + 1 : 0)).filter(Boolean);
const CIX = [...CIL(/^on:/, 7), '      …', ...CIL(/^  backend-lint:/, 4), ...CIL(/- uses: actions\/setup-node@v4/, 1), ...CIL(/node-version: '22'/, 1), ...CIL(/run: npm ci --no-audit/, 1), ...CIL(/run: npx tsc --noEmit/, 1), ...CIL(/name: Unit tests/, 1), ...CIL(/run: npm test$/, 1), ...CIL(/name: ESLint/, 2)];
const RV = ra('c14/ci-runs').split('\n');
const RVX = [RV[0], ...RV.slice(1, 5), '…', RV.find((l) => l.startsWith('$ gh run view')), ...RV.filter((l) => /^(CT Work|Frontend|Backend)|451 s|TypeScript type-check/.test(l))];
const CC = { ci: num(R('ci-clean', /^npm ci:/), /npm ci: (\d+) ms/), test: num(R('ci-clean', /^npm ci:/), /npm test: (\d+) ms/) };
const RUNS = ra('c14/ci-runs').split('\n').filter((l) => /^(failure|success)/.test(l));
const mmss = (l) => { const m = l.match(/(\d+)m(\d+)s/); return Number(m[1]) * 60 + Number(m[2]); };
const RMIN = Math.min(...RUNS.map(mmss)), RMAX = Math.max(...RUNS.map(mmss));

const khoiSvg = `<svg data-k="khoi" viewBox="0 0 1100 200" width="1100" height="200" font-family="Arial">
<rect x="10" y="10" width="520" height="180" rx="16" fill="${CAM}12" stroke="${CAM}" stroke-width="3"/><text x="34" y="85" font-size="50">🚨</text><text x="110" y="62" font-size="22" font-weight="700" fill="${CAM}">a smoke detector</text><text x="110" y="94" font-size="18" fill="#444">silent does NOT mean "no fire risk"</text><text x="34" y="160" font-size="20" font-weight="700" fill="${CAM}">= coverage: low is news, high proves little</text>
<rect x="570" y="10" width="520" height="180" rx="16" fill="${NODE}12" stroke="${NODE}" stroke-width="3"/><text x="594" y="85" font-size="50">🧯</text><text x="670" y="62" font-size="22" font-weight="700" fill="${NODE}">a fire drill</text><text x="670" y="94" font-size="18" fill="#444">start a small fire on purpose, watch</text><text x="594" y="160" font-size="20" font-weight="700" fill="${NODE}">= break the code, see a test go red</text>
</svg>`;

export const slides = lamDeck({ chuong: 'Chapter 14 — Testing', bai: '14.5' }, [
  // ── PART 1 ──
  { cover: true, t: 'Coverage, flaky tests,<br>and CI', sub: 'Three things stand between a suite that exists and a suite that protects you: knowing what it does not check, knowing which failures are lies, and running it somewhere that is not your laptop.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>A privilege escalation that survives 100 % coverage — measured</li>
<li>What coverage actually counts, and the technique that answers the real question</li>
<li>Flaky tests: four causes, all measured in this chapter, and how to hunt them</li>
<li>Running the suite on a clean machine, and the CI this site really runs</li>
<li>What should — and should not — block a merge</li>
</ul>` + box('Why it matters to you', 'A green badge and a 100 % number are easy to get. This lesson is about whether they mean anything.', 'lam') },

  { t: 'An everyday picture: the smoke detector', to: true, giua: true, body: khoiSvg + two(
    box('A silent detector', 'tells you no smoke reached it. It does not tell you the wiring is safe.', 'cam'),
    box('A fire drill', 'tells you whether people actually get out. You learn by causing the event on purpose.', 'xanh')) +
    flow([{ t: 'coverage report', s: 'what RAN', mau: CAM }, { t: 'mutation', s: 'what would go RED', mau: NODE }, { t: 'flaky hunt', s: 'which failures LIE', mau: DO }, { t: 'CI', s: 'not your laptop', mau: LAM }], { h: 110 }) },

  { t: 'The whole authorization rule', to: true, giua: true, body: J(L('src/slug.mjs', 11, 16), { sm: false, hl: [5] }) +
    TT('c14/coverage', 2, 7, 'npx vitest run tests/slug.test.mjs --coverage · the unit tests of 14.2 · real', { hl: [5], n: 104, sm: false }) +
    box('100 % of statements, functions and lines', 'The only imperfect number is branches — 83.33 % — and it points at line 15, the return in canEdit.', 'cam') },

  { t: 'Add the service tests — 100 % everywhere', to: true, giua: true, body: TT('c14/coverage', 9, 9, 'slug.test + service.test, coverage of slug.mjs only · real', { hl: [1], n: 112, sm: true }) +
    TT('c14/coverage', 11, 11, 'node -e "canEdit({ id: 2, role: \'EDITOR\' }, { authorId: 1 })" · real', { hl: [1], n: 104, sm: false }) +
    two(box('Six of six branches covered', 'All four metrics read 100 % for slug.mjs.', 'xanh'),
      box('…and any EDITOR can edit every note', 'No test anywhere says this is intended. The report is telling the truth about what it measures — just not about what you need.', 'do2')) +
    flow([{ t: 'user 2, EDITOR', s: 'not the author', mau: CAM }, { t: 'canEdit(…)', s: 'returns true', mau: DO }, { t: 'every note', s: 'editable', mau: DO }], { h: 110 }) },

  { t: 'What coverage actually counts', to: true, giua: true, body: flow([
    { t: 'service test: a USER', s: 'id ≠ authorId', mau: LAM }, { t: 'authorId === id', s: 'evaluated: false', mau: CAM }, { t: "role === 'EDITOR'", s: 'evaluated: false', mau: CAM }, { t: 'both sides ran', s: 'branch "covered"', mau: NODE }], { h: 130 }) +
    J(`return note.authorId === user.id || user.role === 'EDITOR';
//     └──── evaluated (false) ────┘    └─ evaluated (false) ─┘   → V8: both sides ran = 100 %
//     the case { role: 'EDITOR' } → TRUE was never produced by any test`, { sm: false, hl: [1] }) +
    cards([
      ['Coverage answers ONLY', '"was this line or branch executed while the tests ran?"'],
      ['It does NOT answer', '"would any test go RED if this line were wrong?"'],
      ['So', 'a suite with not one assertion still reaches 100 % in all four columns.'],
    ], 3) },

  { t: 'Read the uncovered column, not the percentage', to: true, giua: true, body: TT('c14/coverage', 13, 29, 'the four files of this chapter, coverage over src/ · real', { hl: [11, 13], n: 104, sm: true }) +
    two(box('A low number is real information', 'notes.repo.mjs 17–25: the 23505 → 409 branch of 14.4 is never exercised by these tests — a genuine to-do item.', 'cam'),
      box('A high number is not a certificate', 'slug.mjs at 100 % still holds the EDITOR escalation.', 'do2')) },

  { t: 'The technique that answers the real question', to: true, giua: true, body: T([G('c14/mutate', 2, 2), G('c14/mutate', 7, 7), G('c14/mutate', 12, 12), ...ra('c14/mutate').split('\n').filter((l) => /Tests\s+1 failed/.test(l))].join('\n'), 'mutate.sh (14.2) · the code changed on purpose · real', { hl: [2, 4], sm: false }) +
    cards([['by hand', '|| → &&, 404 → 403, >= → > on your ten most dangerous lines — an afternoon'], ['automated', 'mutation testing: Stryker in the Node ecosystem changes the code for you'], ['what it finds', 'tests that stay green when the code is wrong']], 3) +
    box('For canEdit', "Swap || for && and run the suite: if nothing goes red, nobody has tested the EDITOR rule — exactly the hole above.", 'xanh') },

  { t: 'Flaky tests: four causes, all measured in this chapter', to: true, giua: true, body: cards([
    ['shared state', '4 files TRUNCATE one table: red 10 times out of 10, "expected 79 to be 20" (14.4)'],
    ['leftover garbage', 'one row left by another script: "expected 2 to be 1", nothing in the test changed (14.4)'],
    ['real time', 'a boundary asserted with the system clock — right today, wrong on the day the clocks change (14.2)'],
    ['concurrency', 'the 23505 race: whether it shows depends on how warm the pool is (14.4)'],
  ], 2) + flow([{ t: 'a red build', s: 'nobody reads it', mau: DO }, { t: '"just re-run"', s: 'it goes green', mau: CAM }, { t: 'a real failure', s: 'gets re-run too', mau: DO }], { h: 100 }) + box('Worse than no test', 'A flaky test trains the team to re-run CI instead of reading it — and then a real failure gets re-run too.', 'do2') },

  { t: 'Part 1 in one table', to: true, giua: true, body: bang(['', 'measured', 'the rule'], [
    ['unit tests only', 'slug.mjs branches 83.33 %, line 15', 'read the uncovered column'],
    ['+ service tests', '100 / 100 / 100 / 100', '…and still wrong'],
    ["canEdit({ role: 'EDITOR' })", 'true', 'coverage ≠ correctness'],
    ['20 tests, all of src/', 'repo 17–25 uncovered', 'a real to-do list'],
    ['404 → 403 on purpose', '1 test went red', 'mutate to prove a test'],
    ['4 causes of flaky tests', 'shared state · leftovers · clock · race', 'all measured in 14.2 and 14.4'],
  ], { co: 21 }) + box('Part 2', 'Hunting a flaky test, why retry is not a fix, and running it all in CI — with this site\'s real numbers.', 'lam') },

  // ── PART 2 ──
  { t: 'Hunting a flaky test', to: true, giua: true, body: J(`# 1 · run it in a loop — flakiness shows up as a rate
for i in $(seq 1 10); do npx vitest run iso/shared; done   # 0/10: not flaky, reliably broken

# 2 · shuffle the order — exposes order dependence
npx vitest run tests/slug.test.mjs --sequence.shuffle --reporter=verbose`, { sm: false, hl: [2, 5] }) +
    two(TT('c14/shuffle', 2, 4, 'run 1 · real', { n: 64, sm: true }), TT('c14/shuffle', 9, 11, 'run 2 · real', { n: 64, sm: true })) +
    box('A test that only passes in one order', 'depends on another test\'s leftovers. Shuffle shows it in one run instead of on a random Tuesday.', 'cam') },

  { t: 'Pitfall — retry: 3 is not a fix', to: true, giua: true, body: bang(['a test that fails…', 'with retry: 3, it fails…', 'what it hides'], [
    ['30 % of runs', '0.3 × 0.3 × 0.3 = 2.7 % of runs (computed)', 'the shared state is still there'],
    ['10 % of runs', '0.1 % of runs (computed)', 'until it causes a production incident'],
  ], { co: 21 }) + two(box('One legitimate use', 'A test that genuinely depends on an external system you do not control.', 'lam'),
      box('Everything else', 'gets isolated, not retried.', 'xanh')) +
    flow([{ t: 'flaky', s: '30 %', mau: DO }, { t: 'retry: 3', s: 'looks fixed: 2.7 %', mau: CAM }, { t: 'the cause', s: 'still in the code', mau: DO }], { h: 110 }) },

  { t: 'Running it somewhere that is not your laptop', to: true, giua: true, body: TT('c14/ci-clean', 2, 12, 'ci-clean.sh · a FRESH node:22-alpine container, the repo copied in without node_modules · real', { hl: [3, 4, 10, 12], n: 116, sm: true }) +
    thanh([['npm ci', CC.ci, CAM, `${CC.ci.toLocaleString('en-US')} ms`], ['npm test (20 tests)', CC.test, NODE, `${CC.test} ms`]], { w: 1100, x0: 260, wMax: 560, h0: 54, chu: 21, ghi: 'inside the clean container · real' }) },

  { t: 'Why a clean machine', to: true, giua: true, body: cards([
    ['no leftover rows', 'the trap of 14.4 cannot happen on a machine that never ran anything'],
    ['no stale node_modules', 'npm ci rebuilds exactly the lockfile — chapter 4'],
    ['no forgotten export', 'the env variable you set in October and forgot is not there'],
  ], 3) + box(`Install dominates, tests do not`, `${Math.round(CC.ci / CC.test)}× more time installing than testing here. "Our tests are too slow for CI" is almost never true at this size.`, 'xanh') +
    flow([{ t: 'checkout', s: 'a clean copy', mau: LAM }, { t: 'npm ci', s: 'the lockfile, exactly', mau: CAM }, { t: 'type-check', s: 'tsc --noEmit', mau: LAM }, { t: 'tests', s: 'unit + DB', mau: NODE }], { h: 110 }) },

  { t: "This site's CI — the real file", to: true, giua: true, body: J(CIX.join('\n'), { sm: true, hl: hlOf(CIX, [/paths:/, /timeout-minutes/, /npm ci/, /npm test/, /continue-on-error/, /node-version/]) }) },

  { t: 'What it costs today — measured', to: true, giua: true, body: T(RVX.join('\n'), 'gh run list / gh run view · ci-lint.yml · 08/11/2026 · real', { hl: hlOf(RVX, [/^failure/, /451 s/, /failure .*TypeScript/]), sm: true }) +
    box(`${Math.floor(RMIN / 60)}m${String(RMIN % 60).padStart(2, '0')}s – ${Math.floor(RMAX / 60)}m${String(RMAX % 60).padStart(2, '0')}s, and red`, 'The DB-test job is the long pole (451 s). The last 8 runs failed at the type-check step — a gate doing its job; the question is how long a red gate stays red.', 'do2') },

  { t: 'Four design decisions visible in that file', to: true, giua: true, body: cards([
    ['paths: filter', 'Editing the README does not run CI — the signal stays meaningful and the queue short.'],
    ['npm ci, not npm install', 'Chapter 4: install moved to a newer version, ci stayed on the lockfile.'],
    ['blocking vs advisory', 'tsc and tests block; ESLint is continue-on-error. A lint warning blocking a hotfix teaches people to ignore CI.'],
    ['tests that skip without a secret', 'The AI fabrication test exits 0 when no key is set, so forks and laptops can still run the suite.'],
  ], 2) + box('timeout-minutes: 10', 'A hung job must die instead of hanging forever — one line, easy to forget.', 'lam') },

  { t: 'What should block a merge', to: true, giua: true, body: two(
    box('Block', 'the type check · tests whose failure means WRONG, not untidy · once tests touch a database, migrations that apply cleanly on an empty schema.', 'xanh'),
    box('Inform, do not block', 'style opinions · coverage thresholds · lint warnings.', 'cam')) +
    box('The one-minute rule', 'Every gate a developer cannot fix in under a minute is a gate they will eventually learn to bypass.', 'do2') +
    flow([{ t: 'tsc', s: 'block', mau: NODE }, { t: 'tests', s: 'block', mau: NODE }, { t: 'migrations', s: 'block', mau: NODE }, { t: 'lint · coverage', s: 'inform', mau: CAM }], { h: 110 }) },

  { t: 'How cuongthai.com deploys', to: true, giua: true, body: flow([
    { t: 'commit', s: 'local main', mau: LAM }, { t: 'deploy-nha.sh', s: 'build at home → GHCR', mau: CAM }, { t: 'VPS swaps', s: 'then a smoke test', mau: NODE }, { t: 'CI checks', s: 'on a clean worktree', mau: TIM }, { t: 'push', s: 'only if green', mau: LAM }], { h: 130, fs: 18 }) +
    two(box('Not push-to-deploy, on purpose', 'Two deploy workflows racing each other on every push caused real outages in July 2026. Deploying is a script you run, never a side effect of pushing.', 'cam'),
      box('A smoke test is an end-to-end test', 'After the swap it curls core GET routes and fails the deploy on any 404 — the route was never mounted, the container runs a stale image. No unit test can catch "what got deployed is not what you built".', 'xanh')) },

  { t: 'Exercise', to: true, giua: true, body: box('Exercise', 'Your CI takes 9 minutes and one test fails about one run in five. A teammate proposes three changes: (1) add retry: 3; (2) add --no-file-parallelism; (3) raise the coverage threshold to 90 % and make it blocking. What do you actually do?', '') +
    flow([{ t: 'retry: 3', s: '?', mau: DO }, { t: '--no-file-parallelism', s: '?', mau: CAM }, { t: 'coverage ≥ 90 % blocks', s: '?', mau: LAM }], { h: 110 }) +
    `<div data-k="dapan">${box('Answer', 'None of the three. First find the cause: loop the failing file 10×, shuffle the order, look for shared tables or leftover rows (14.4) and real clocks (14.2). Isolate it — a schema per file or a transaction per test. Then look at where the 9 minutes go: here npm ci and type-check dominate the tests. Keep coverage informational and mutate your ten riskiest lines instead.', 'xanh')}</div>` },

  { t: 'Coverage, flaky tests and CI — in one table', to: true, giua: true, body: bang(['', 'measured here', 'the rule'], [
    ['100 % coverage, slug.mjs', "canEdit lets any EDITOR in", 'coverage ≠ correctness'],
    ['shared table, 10 runs', '0/10', 'isolate, never retry'],
    ['clean container', `npm ci ${CC.ci.toLocaleString('en-US')} ms vs tests ${CC.test} ms`, 'install dominates'],
    ["this site's CI", `${Math.floor(RMIN / 60)}–${Math.ceil(RMAX / 60)} min, DB job 451 s`, 'block on what means WRONG'],
    ['deploy', 'smoke test + CI on a clean worktree', 'check what you shipped'],
    ['retry: 3 on a 30 % flake', '2.7 % (computed)', 'hides, does not fix'],
  ], { co: 21 }) + box('Next: Chapter 15 — logs and observability', 'What your app says about itself in production — and the metrics the queues of chapter 13 needed.', 'lam') },
]);
