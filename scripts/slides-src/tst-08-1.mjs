/**
 * tst-08-1 — Testing · Chapter 8 · Lesson 8.1 "Coverage: what it measures and what it cannot" (01/11/2026). Slug: tst-8-1-do-phu.
 * Output = chạy thật (Vitest 5.0.5, @vitest/coverage-v8 / coverage-istanbul 5.0.5): 96.31% ⇒ 78.91% khi bật include;
 * bộ toBeDefined 100/100/100/100 mà hai bug cài sẵn vẫn xanh; booking.test.js thật 87.5% dòng bắt được bug; JSX v8 86 vs istanbul 84 câu lệnh;
 * ngưỡng đỏ lần đầu (83.9% dòng) ⇒ chuyển test demo vào src ⇒ 95.78%; th81: 93 test, server.js + login-guard.js 100% dòng.
 * v2 (01/11, TST/v2): slide 8 thêm cột src/ đo thật — nhánh v8 109/117, istanbul 107/117 (tham số mặc định now = new Date()); trước ghi “matched”.
 */
import { lamDeck, js, vt, two, box, steps, c, zm, flow } from './_tst-chung.mjs';

export const deck = { key: 'tst-08-1', code: 'TST 8.1', title: 'Coverage', sub: 'what it measures and what it cannot' };

const LAN_DAU = `$ npx vitest run src/ --coverage --reporter=dot
      Coverage enabled with v8
      Tests  85 passed (85)
File             | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
All files        |   94.47 |     90.9 |   94.44 |   96.31 |
  server.js      |   89.58 |    79.16 |   91.66 |   94.44 | 54-56
  login-guard.js |   92.85 |    85.71 |      80 |   92.85 | 5
  service.js     |   97.14 |     87.5 |     100 |     100 | 28,52
  booking.js     |   87.09 |    96.29 |      80 |    87.5 | 46-48`;

const INCLUDE = `$ npx vitest run src/ --coverage --coverage.include='src/**/*.js'
All files        |   78.12 |    79.81 |   74.19 |   78.91 |
  app.js         |       0 |      100 |       0 |       0 | 5-15
  main.js        |       0 |        0 |       0 |       0 | 7-9
  pgRepo.js      |       0 |        0 |       0 |       0 | 5-21
  reminder.js    |       0 |      100 |       0 |       0 | 5-8
  code.js        |       0 |        0 |       0 |       0 | 2-23`;

const GAN = `it('needsApproval', () => {
  expect(() => needsApproval({ seats: 0, role: 'STUDENT' })).toThrow();
  expect(needsApproval({ seats: 5, role: 'ADMIN' })).toBeDefined();
  expect(needsApproval({ seats: 5, role: 'STUDENT' })).toBeDefined();
});
it('createBooking', () => {
  expect(createBooking({ …, seats: 31, … })).toBeTruthy();
  expect(createBooking({ …, seats: 5, … })).toBeTruthy();   // du-nhanh only
});`;
const GAN_OUT = `$ npx vitest run demo8/gan-nhu-khong.test.js --coverage …
 booking.js |     100 |    96.29 |     100 |     100 | 40
$ npx vitest run demo8/du-nhanh.test.js --coverage …
 booking.js |     100 |      100 |     100 |     100 |`;

const LOI = `planted in src/rules/booking.js:  return seats > APPROVAL_SEATS;  →  return seats >= APPROVAL_SEATS;
      Tests  5 passed (5)
planted in src/rules/booking.js:  role === 'LECTURER' || role === 'ADMIN'  →  role === 'LECTURER'
      Tests  5 passed (5)`;
const THAT = `$ npx vitest run src/rules/booking.test.js --coverage …
 booking.js |   87.09 |    96.29 |      80 |    87.5 | 46-48
planted in src/rules/booking.js:  e - s > MAX_MINUTES  →  e - s >= MAX_MINUTES
       × 08:00–12:00 (240 min) 4ms
      Tests  1 failed | 27 passed (28)`;

const CFG = `coverage: {                          // npm run test:cov
  provider: 'v8',
  include: ['src/**/*.js'],
  exclude: ['src/**/*.test.js', 'src/api/main.js',
    'src/booking/pgRepo.js', 'src/app.js'], // + who covers them
  reporter: [['text', { skipFull: false }], 'html', 'json-summary'],
  thresholds: { lines: 85, branches: 80, functions: 80, statements: 85 },
},`;
const DO = `ERROR: Coverage for lines (83.9%) does not meet global threshold (85%)
ERROR: Coverage for functions (79.31%) does not meet global threshold (80%)
ERROR: Coverage for statements (82.93%) does not meet global threshold (85%)
$ npm run test:cov
      Tests  90 passed (90)
Lines        : 95.78% ( 159/166 )`;

export const slides = lamDeck({ chuong: 'Chapter 8 — Coverage, quality and flaky tests', bai: '8.1' }, [
  { cover: true, t: 'Coverage: what it measures<br>and what it cannot', sub: 'Chapter 8 · Lesson 8.1 — a map of untested code, not a grade' },
  { t: 'What you will be able to do after this lesson', to: true, giua: true, body: `<ul>
    <li>Turn on coverage in Vitest and read all four columns</li>
    <li>Find files that no test even loads</li>
    <li>Tell line coverage from branch coverage — and what neither measures</li>
    <li>Choose between the v8 and istanbul providers</li>
    <li>Set thresholds that stop coverage from sliding back</li></ul>` },
  { t: 'How coverage is collected', body: flow([
      { t: 'Count', s: 'v8 or istanbul', mau: '#336791' },
      { t: 'Run tests', s: 'counters go up', mau: '#336791' },
      { t: 'Map to source', s: 'lines, branches', mau: '#336791' },
      { t: 'Report', s: 'text · html · json', mau: '#2e7d32' },
      { t: 'Thresholds', s: 'exit code 1', mau: '#b85a2b' },
    ], { h: 170, fs: 22 }) +
    zm(two(box('v8', 'The V8 engine inside Node counts which blocks of code it executes. Your code runs unchanged. The default in Vitest.', 'lam'),
      box('istanbul', 'Rewrites every file first, inserting a counter before each statement and branch, then runs the rewritten code. Works on any engine.', 'lam')) +
    box('One thing it never records', 'Whether a test looked at the result. Coverage = what RAN.', 'do2'), 1.15) },
  { t: 'Reading the report', body: vt(LAN_DAU, { title: 'terminal — the unit suite with --coverage (full-coverage files hidden)', fs: 15 }) +
    two(box('Branch', `Both ways of every ${c('if')}, ${c('? :')}, ${c('||')}, ${c('??')} and default parameter.`, 'lam'),
      box('Uncovered Line #s', 'The most useful column: where to look next. 54–56 in server.js are the error paths.', 'xanh')) },
  { t: 'Files nobody imports are invisible', body: vt(INCLUDE, { title: 'terminal — the same 85 tests, every source file counted', fs: 15 }) +
    two(box('96.31% was really 78.91%', 'Without include, a file with no test is not 0% — it is not in the report at all.', 'do2'),
      box('Then decide file by file', `Write tests (reminder.js, code.js), or exclude with a reason: ${c('pgRepo.js: test:int')}.`, 'xanh')) },
  { t: '100% coverage, checking nothing', body: js(GAN, { hl: [3, 4, 8] }) + vt(GAN_OUT, { title: 'terminal — coverage of booking.js only', fs: 16 }) +
    box('Line 40', `The ${c("'CONFIRMED'")} side of ${c('? :')} never ran: lines 100%, branches 96.29% (HTML: “branch not covered”). One more call — 100% everywhere.`, 'lam') },
  { t: 'Two planted bugs survive 100%', body: vt(LOI, { title: 'terminal — thu-loi.mjs on the 100% suite', fs: 15 }) +
    vt(THAT, { title: 'terminal — the real booking.test.js of Chapter 1', fs: 15 }) +
    box('Conditions are not measured', `${c("role === 'ADMIN'")} was evaluated (branch covered) but never true in any check. That is condition coverage / MC/DC — Vitest does not measure it.`, 'do2') },
  { t: 'v8 or istanbul?', body: zm(`<table class="t"><tr><th></th><th colspan="2">web/ JSX, same 16 tests</th><th colspan="2">src/ plain JS, same 116 tests</th></tr>
    <tr><th></th><th>v8</th><th>istanbul</th><th>v8</th><th>istanbul</th></tr>
    <tr><td>Statements</td><td>70/86</td><td>68/84</td><td>226/233</td><td>226/233</td></tr>
    <tr><td>Branches</td><td>52/66</td><td>52/66</td><td>109/117</td><td>107/117</td></tr>
    <tr><td>Functions</td><td>12/18</td><td>12/18</td><td>62/64</td><td>62/64</td></tr>
    <tr><td>Lines</td><td>56/67</td><td>54/65</td><td>186/189</td><td>186/189</td></tr></table>`, 1.0) +
    two(box('Pick one, write it down', `JSX: compiled first, mapped back differently. src/: istanbul counts an unused default ${c('now = new Date()')} (cancel.js, days.js) as a missed branch; v8 does not. Never compare across providers.`, 'lam'),
      box('Spring Boot: JaCoCo', `Same idea as v8 (bytecode agent), same counters (instruction, line, branch, method), and a ${c('check')} goal with minimum ratios.`, 'xanh')) },
  { t: 'Thresholds as a ratchet', body: js(CFG) + vt(DO, { title: 'terminal — npm run test:cov, before / after promoting the demo tests', fs: 15 }) +
    two(box('Wrong fixes', 'Lower the thresholds, or exclude real code. Demo-folder tests protect nothing.', 'do2'),
      box('Ratchet', 'Just under today’s level; raise as tests are added; never lower to merge.', 'xanh')) },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      `Cover ${c('server.js 54–56')}: database down while booking → ${c('503 STORAGE_DOWN')}; any other error → ${c('500 INTERNAL')}, nothing else in the body`,
      `Decide whether ${c('login-guard.js 5')} (the default real clock) deserves a test`,
      `Run ${c('src/ demo8/th81.test.js')} with coverage on those two files`,
    ]) + box('Done when', `93 tests pass, both files show 100% lines, and each test would fail if the status or the body were wrong.`, 'xanh') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Coverage records what ran — never whether it was checked</li>
    <li>Set ${c('include')}: 96.31% was really 78.91%</li>
    <li>Branches find what lines miss; conditions are not measured</li>
    <li>100% with ${c('toBeDefined()')} let two bugs through</li>
    <li>Do not chase 100%: use the report as a map of untested code</li></ul>` },
]);
