/**
 * tst-08-2 — Testing · Chapter 8 · Lesson 8.2 "Mutation testing: testing your tests" (01/11/2026). Slug: tst-8-2-mutation.
 * Output = chạy thật (StrykerJS 10.1.1, vitest-runner 10.1.1, Vitest 5.0.5): bộ 100% độ phủ của 8.1 ⇒ 41,49% (39/94);
 * bộ unit thật 88,96% → 9 test mới → 98,16%; Date.parse tương đương; 0,768 s vs 10,531 s; incremental 10 s → 2 s; sandbox sót 20 file/170 test.
 */
import { lamDeck, js, vt, two, box, steps, c, zm, flow, tbl } from './_tst-chung.mjs';

export const deck = { key: 'tst-08-2', code: 'TST 8.2', title: 'Mutation testing', sub: 'testing your tests with StrykerJS' };

const CFG = `export default {
  testRunner: 'vitest',
  vitest: { configFile: 'vitest.config.js', dir: 'src' },
  mutate: ['src/rules/**/*.js', '!src/**/*.test.js'],
  coverageAnalysis: 'perTest',
  reporters: ['clear-text', 'progress', 'html'],
  thresholds: { high: 90, low: 80, break: 80 },
  tempDirName: '.stryker-tmp',
};`;
const SANDBOX = `$ ls .stryker-tmp && npm run test:unit
sandbox-2n9pUw
 ✓ .stryker-tmp/sandbox-2n9pUw/src/api/server.test.js (12 tests) 231ms
 Test Files  20 passed (20)
      Tests  170 passed (170)`;
const YEU = `$ npx stryker run demo8/stryker.yeu.config.mjs
[Survived] EqualityOperator
src/rules/booking.js:14:7
-     if (e <= s) return { ok: false, code: 'END_BEFORE_START' };
+     if (e < s) return { ok: false, code: 'END_BEFORE_START' };
[Survived] BooleanLiteral
src/rules/booking.js:13:54
-     if (s % STEP !== 0 || e % STEP !== 0) return { ok: false, code: …
+     if (s % STEP !== 0 || e % STEP !== 0) return { ok: true, code: …
…
File        |  total | covered | # killed | # timeout | # survived | # no cov | # errors |
All files   |  41.49 |   41.49 |       39 |         0 |         55 |        0 |        0 |
06:28:50 (32884) ERROR MutationTestReportHelper Final mutation score 41.49 under breaking threshold 60, …`;
const LAN_DAU = `File        |  total | covered | # killed | # timeout | # survived | # no cov | # errors |
All files   |  88.96 |   92.95 |      144 |         1 |         11 |        7 |        0 |
 booking.js |  92.55 |   97.75 |       87 |         0 |          2 |        5 |        0 |
 cancel.js  | 100.00 |  100.00 |        7 |         0 |          0 |        0 |        0 |
 code.js    |  84.21 |   94.12 |       15 |         1 |          1 |        2 |        0 |
 days.js    |  84.62 |   84.62 |       11 |         0 |          2 |        0 |        0 |
 time.js    |  80.00 |   80.00 |       24 |         0 |          6 |        0 |        0 |
06:29:35 (34762) INFO MutationTestExecutor Done in 9 seconds.`;
const SONG = `[Survived] EqualityOperator
src/rules/booking.js:25:35
-     if (!Number.isInteger(seats) || seats < 1) {
+     if (!Number.isInteger(seats) || seats <= 1) {
[Survived] Regex
src/rules/time.js:3:13
-     const m = /^([0-9]{2}):([0-9]{2})$/.exec(text);
+     const m = /([0-9]{2}):([0-9]{2})$/.exec(text);
[Survived] ConditionalExpression
src/rules/time.js:4:7
-     if (!m) throw new TypeError('Invalid time "' + text + …
+     if (false) throw new TypeError('Invalid time "' + text + …`;
const GAPS = `it('one seat is a valid booking', () => {          // seats < 1  →  seats <= 1
  expect(needsApproval({ seats: 1, role: 'STUDENT' })).toBe(false);
});
it.each(['08:000', '108:00'])('refuses %s', (text) => {  // ^ and $ removed
  expect(() => parseTime(text))
    .toThrow('Invalid time "' + text + '", expected HH:MM');
});
it('the TypeError is ours, not a crash on null', () => {  // if (!m) → if (false)
  expect(() => parseTime('7:00')).toThrow('expected HH:MM');
});`;
const SAU = `File        |  total | covered | # killed | # timeout | # survived | # no cov | # errors |
All files   |  98.16 |   98.16 |      159 |         1 |          3 |        0 |        0 |
 booking.js | 100.00 |  100.00 |       94 |         0 |          0 |        0 |        0 |
…
 time.js    | 100.00 |  100.00 |       30 |         0 |          0 |        0 |        0 |`;
const TD = `$ node -e "console.log(Date.parse('2026-11-16'), Date.parse('2026-11-16T00:00:00Z'))"
1794787200000 1794787200000`;
const INC = `$ npx stryker run --incremental …      (first run)
06:30:37 (40491) INFO MutationTestExecutor Done in 10 seconds.
	Result:		163 of 163 mutant result(s) are reused.
06:30:44 (41314) INFO MutationTestExecutor Done in 2 seconds.
	Tests:		1 files changed (+2 -1)
	Result:		158 of 163 mutant result(s) are reused.
06:30:48 (41633) INFO MutationTestExecutor Done in 2 seconds.`;
const TH = `$ npx stryker run --mutate src/lib/retry.js
[Survived] ConditionalExpression
src/lib/retry.js:9:11
-         if (i < attempts) await new Promise((resolve) => setTimeout(…
+         if (true) await new Promise((resolve) => setTimeout(…
[Survived] EqualityOperator
src/lib/retry.js:9:11
+         if (i <= attempts) await new Promise((resolve) => setTimeout(…
 retry.js |  85.71 |   85.71 |       12 |         0 |          2 |        0 |        0 |`;

export const slides = lamDeck({ chuong: 'Chapter 8 — Coverage, quality and flaky tests', bai: '8.2' }, [
  { cover: true, t: 'Mutation testing:<br>testing your tests', sub: 'Chapter 8 · Lesson 8.2 — if somebody breaks this code, will a test go red?' },
  { t: 'What you will be able to do after this lesson', to: true, giua: true, body: `<ul>
    <li>Install and configure StrykerJS for a Vitest project</li>
    <li>Read a report: killed, survived, no coverage, timeout, two scores</li>
    <li>Turn every surviving mutant into the test that was missing</li>
    <li>Recognise an equivalent mutant — and stop chasing it</li>
    <li>Decide when the extra run time is worth paying</li></ul>` },
  { t: 'From hand-made mutants to a tool', body: two(
      box('Labs 1–7: by hand', `${c('scripts/dot-bien*.mjs')}: 8 mutants a person picked, one at a time — change a line, run the tests, restore. Red = killed, green = survived.`, 'lam'),
      box('Stryker: by operator', `Every place an operator fits: ${c('<')} → ${c('<=')}, condition → ${c('true')}/${c('false')}, string → ${c('""')}, drop ${c('^')}/${c('$')}, ${c('+')} → ${c('-')}. 163 mutants in ${c('src/rules')}.`, 'xanh')) +
    flow([{ t: 'Instrument', s: 'create all mutants' }, { t: 'Dry run', s: 'green? who covers what' }, { t: 'Each mutant', s: 'only covering tests' }, { t: 'Status', s: 'killed · survived · no cov', mau: '#b85a2b' }, { t: 'Score', s: 'below break → exit 1', mau: '#b85a2b' }], { h: 150, fs: 19 }) +
    box('Same words, every tool', `Killed = a test went red. Survived = everything stayed green: a bug your suite would let through. The question is never “did the line run?” but “would anyone notice if it were wrong?”`, 'do2') },
  { t: 'Setting up Stryker for Vitest', body: two(js(CFG, { sm: true, hl: [3, 5, 7, 8] }),
      box('Why each line', `${c("dir: 'src'")}: the dry run must be green, and ${c('demo*/')} is red on purpose. ${c('perTest')}: a mutant runs only the tests that reach it. ${c('break: 80')}: the command fails below 80%.`, 'lam'), 'r64') +
    vt(SANDBOX, { title: 'terminal — after one crashed Stryker run', fs: 13 }) +
    box('Exclude .stryker-tmp/ from Vitest and git', 'A crashed run leaves a copy of the project there, and vitest run src/ matches its src/ folder too: 85 tests became 170.', 'do2') },
  { t: 'Same suite: 100% coverage, 41.49% killed', body: vt(YEU, { title: 'terminal — the toBeDefined() suite of lesson 8.1 (100% lines, branches, functions)', fs: 13 }) +
    two(box('Coverage said', 'Every line and every branch of booking.js ran.', 'lam'), box('Mutation testing says', 'A zero-minute slot and a reversed OFF_GRID rule both pass: toBeDefined() is true for any answer.', 'do2')) },
  { t: 'The real suite: 88.96%. Reading the report', body: vt(LAN_DAU, { title: 'terminal — npx stryker run (163 mutants, 9 processes)', fs: 14 }) +
    zm(tbl(['Status', 'Meaning'], [
      ['killed / timeout', 'a test went red, or the code hung — detected'],
      ['survived', 'tests ran on the change and stayed green'],
      ['no cov', 'no test reaches this code (the 0% lines of 8.1)'],
      ['total vs covered', '145 ÷ 163 = 88.96% · 145 ÷ 156 = 92.95%'],
    ]), 1.05) },
  { t: 'Every survivor is a missing test', body: vt(SONG, { title: 'terminal — three of the 11 survivors', fs: 14 }) +
    two(box('Boundary and pattern', 'Nobody tested 1 seat (the smallest valid value). Without ^ or $, "108:00" and "08:000" read as 08:00.', 'lam'),
      box('Green for the wrong reason', 'Without the check, m[1] of null throws a TypeError too. toThrow(TypeError) stays green: assert the message.', 'do2')) },
  { t: 'Nine tests later: 98.16%', body: js(GAPS, { sm: true }) + vt(SAU, { title: 'terminal — npx stryker run, with src/rules/mutation-gaps.test.js', fs: 14 }) +
    box('One file, one comment per mutant', 'The new tests live in mutation-gaps.test.js, so the reference tests of Chapters 1–2 stay as taught. 3 survivors are left — on purpose.', 'xanh') },
  { t: 'Equivalent mutants: no test can kill them', body: vt(TD, { title: 'terminal — days.js: deleting \'T00:00:00Z\' changes nothing', fs: 16 }) +
    two(box('Equivalent', `A date-only ISO string is already midnight UTC. Record it next to the code: ${c('// Stryker disable next-line StringLiteral: …')}`, 'lam'),
      box('A judgement call', 'The random generator’s arithmetic can be killed with a golden-value test, which would pin the exact generator. Accepted here, reason written down.', 'xanh')) +
    box('The score is not the goal either', '98.16% with three explained survivors beats 100% reached by pinning internals. Gate with break just below today’s score.', 'do2') },
  { t: 'The cost, and how to pay less', body: two(zm(tbl(['Command', 'Measured'], [
      ['npm run test:unit', '0.768 s'],
      ['npx stryker run (perTest)', '10.531 s'],
      ['--coverageAnalysis off', '11.177 s'],
      ['--concurrency 1', '38.370 s'],
      ['all of src/ (465 mutants)', '28.486 s'],
    ]), 1.0), box('Read the numbers', 'Stryker runs the suite once per mutant: 14× the plain suite here, 50× with one process. perTest barely helps a fast suite; it matters when tests hit HTTP or a database.', 'lam')) +
    vt(INC, { title: 'terminal — incremental mode (reports/stryker-incremental.json)', fs: 13 }) +
    box('Where it fits', 'Not on every save. On pull requests (incremental, or --mutate for changed files) and nightly, with the HTML report kept as a CI artifact. Java: PIT does the same for JUnit.', 'lam') },
  { t: 'Practice (15 minutes)', body: steps([
      `Run ${c('npx stryker run --mutate src/lib/retry.js')}`,
      'Say what each survivor means for a user',
      `Kill both in ${c('src/lib/retry-last.test.js')} with fake timers`,
    ]) + vt(TH, { title: 'terminal — before', fs: 13 }) +
    two(box('The bug they share', 'After the 3rd failed attempt, retry still waits 3 more seconds. runAllTimersAsync jumps over that wait, so the old test cannot see it.', 'do2'),
      box('Done when', `Advance exactly ${c('1000 + 2000')} ms and demand that retry already gave up: retry.js 14 killed, 0 survived (100.00).`, 'xanh')) },
]);
