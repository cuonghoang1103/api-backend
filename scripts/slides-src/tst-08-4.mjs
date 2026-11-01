/**
 * tst-08-4 — Testing · Chapter 8 · Lesson 8.4 "Keeping the suite fast" (01/11/2026). Slug: tst-8-4-toc-do.
 * Output = chạy thật (content/courses/testing/s08/_ma.mjs): theo tầng 1,092 / 2,692 / 3,703 / 9,634 s; demo8/cham 6,14 s (11,07 s nối tiếp)
 * → demo8/nhanh 210 ms; beforeAll dùng chung ⇒ 102 thay vì 100; worker/isolate/pool 3 lần; --changed 1/14 và 6/14; shard 31+56+13; thực hành 5006 → 29 ms.
 */
import { lamDeck, js, vt, two, box, steps, c, zm } from './_tst-chung.mjs';

export const deck = { key: 'tst-08-4', code: 'TST 8.4', title: 'Keeping the suite fast', sub: 'measure, fix the cause, run less' };

const CHAM = ` ✓ demo8/cham/du-lieu.test.js (4 tests) 4733ms
   ✓ a full day refuses one more booking 1165ms
   ✓ another lab is still free 1168ms
   ✓ the evening is still free 1160ms
   ✓ the list has 100 bookings 1239ms
 ✓ demo8/cham/cho-that.test.js (2 tests) 6011ms
   ✓ a mail that works on the 3rd try is sent 3004ms
   ✓ gives up after 3 attempts with the last error 3006ms
   Duration  6.14s (tests 99%)`;
const NOI = `$ npx vitest run demo8/cham/ --no-file-parallelism
 ✓ demo8/cham/cho-that.test.js (2 tests) 6010ms
 ✓ demo8/cham/du-lieu.test.js (4 tests) 4844ms
   Duration  11.07s (tests 100%)`;
const SEED = `let repo;
beforeEach(async () => {
  repo = createMemoryRepo();
  for (let day = 1; day <= 10; day++) {
    for (let h = 8; h < 18; h++) {          // 100 bookings, one await at a time
      await bookLab(repo, { lab: 'BE-201', /* … */ });
    }
  }
});`;
const FAKE = `beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => { vi.useRealTimers(); });

it('a mail that works on the 3rd try is sent', async () => {
  const send = vi.fn().mockRejectedValueOnce(new Error('timeout'))
    .mockRejectedValueOnce(new Error('timeout')).mockResolvedValue('sent');
  const result = retry(send);
  await vi.advanceTimersByTimeAsync(1000 + 2000);
  await expect(result).resolves.toBe('sent');
});`;
const NHANH = ` ✓ demo8/nhanh/cho-that.test.js (2 tests) 7ms
 ✓ demo8/nhanh/du-lieu.test.js (4 tests) 97ms
   Duration  210ms (tests 73%, import 12%, transform 11%, worker 4%)`;
const CHUNG = ` ❯ demo8/du-lieu-chung.test.js (4 tests | 1 failed) 1289ms
   ✓ a full day refuses one more booking 8ms
   ✓ another lab is still free 12ms
   ✓ the evening is still free 11ms
   × the list has 100 bookings 11ms
AssertionError: expected [ …(102) ] to have a length of 100 but got 102`;
const CHANGED = `$ npx vitest run src/ --changed
 M src/auth/login-guard.js
   Affected  1 of 14 test files (…)
      Tests  5 passed (5)
 M src/rules/time.js
   Affected  6 of 14 test files (…)
      Tests  74 passed (74)
$ npx vitest related src/rules/time.js --run --dir src
 Test Files  6 passed (6)
      Tests  74 passed (74)`;
const SHARD = ` Test Files  5 passed (5)
      Tests  31 passed (31)
 Test Files  5 passed (5)
      Tests  56 passed (56)
 Test Files  4 passed (4)
      Tests  13 passed (13)`;
const TIMEOUT = `$ npx vitest run demo8/th84-de.test.js demo8/th84.test.js --testTimeout=500
 ✓ demo8/th84.test.js (3 tests) 30ms
   × a confirmed booking e-mails the student 506ms
   × a 31-seat booking asks the approver 501ms
   × a provider that fails twice is retried until it works 501ms
      Tests  3 failed | 3 passed (6)`;

export const slides = lamDeck({ chuong: 'Chapter 8 — Coverage, quality and flaky tests', bai: '8.4' }, [
  { cover: true, t: 'Keeping the suite<br>fast', sub: 'Chapter 8 · Lesson 8.4 — measure first, fix the cause, then run less' },
  { t: 'What you will be able to do after this lesson', to: true, giua: true, body: `<ul>
    <li>Measure a suite by layer, by file and by test</li>
    <li>Read Vitest’s Duration line: tests, import, transform, environment</li>
    <li>Fix slow tests at the cause — without checking less</li>
    <li>Choose workers, pool and isolation from a measurement</li>
    <li>Run only what a change affects; shard the rest</li></ul>` },
  { t: 'Measure first: one number per layer', body: zm(`<table class="t"><tr><th>Layer</th><th>Tests</th><th>Wall time</th><th>Per test</th><th>Pays for</th></tr>
    <tr><td>unit</td><td>100</td><td>1.092 s</td><td>~11 ms</td><td>Node processes, imports</td></tr>
    <tr><td>components (jsdom)</td><td>16</td><td>2.692 s</td><td>~170 ms</td><td>a document per file, rendering</td></tr>
    <tr><td>integration</td><td>11</td><td>3.703 s</td><td>~340 ms</td><td>PostgreSQL 17 in a container</td></tr>
    <tr><td>end-to-end</td><td>9</td><td>9.634 s</td><td>~1 s</td><td>Vite build, server, Chromium</td></tr></table>`, 1.02) +
    two(box('Same 200 checks, two layers', `${c('200 unit checks 3ms')} · ${c('200 HTTP requests through Express 192ms')} — test each rule at the lowest layer that can see it.`, 'lam'),
      box('Read the Duration line', `${c('tests 99%')}: the tests wait. ${c('import / transform / environment')}: start-up cost. Different causes, different fixes.`, 'xanh')) },
  { t: 'Find the slow tests', body: vt(CHAM, { title: 'terminal — npx vitest run demo8/cham/', fs: 15 }) +
    two(box('cho-that.test.js', `${c('retry()')} really waits 1 s, then 2 s — the real clock, three seconds per test.`, 'do2'),
      box('du-lieu.test.js', `${c('beforeEach')} books 100 slots, one await at a time, ~5 ms per query — ~1.2 s before any check.`, 'do2')) },
  { t: 'Parallel files hide slowness', body: vt(NOI, { title: 'terminal — the same two files, one after the other', fs: 16 }) +
    two(box('6.14 s vs 11.07 s', 'In parallel the run lasts as long as the slowest file, not the sum. Nothing got faster.', 'lam'),
      box('Why it comes back', 'Two CPU cores on CI, or forty slow files instead of two, and the sum is back. Parallelism multiplies a fast suite; it does not cure one that waits.', 'do2')) },
  { t: 'Fix the cause: check the wait, build less data', body: js(FAKE, { sm: true, hl: [1, 7] }) +
    vt(NHANH, { title: 'terminal — npx vitest run demo8/nhanh/  (same six behaviours)', fs: 15 }) +
    box('6.14 s → 210 ms, about 29×', `Fake timers check the 1 s + 2 s waits instead of sleeping; each data test builds the one booking it talks about.`, 'xanh') },
  { t: 'The trap: faster by sharing data', body: js(SEED.replace('beforeEach', 'beforeAll'), { sm: true, hl: [2] }) +
    vt(CHUNG, { title: 'terminal — demo8/du-lieu-chung.test.js, in file order', fs: 14 }) +
    box('Shared + written = flaky (lesson 8.3)', 'Two tests wrote into the shared repository, so the list had 102. Share only data that no test writes.', 'do2') },
  { t: 'Workers, isolation and pools — measured', body: zm(`<table class="t"><tr><th>Option (3 runs)</th><th>src/ — 100 tests</th><th>web/ — 16 tests</th></tr>
    <tr><td>default (forks, isolated, parallel)</td><td>1.150 · 0.979 · 1.062 s</td><td>2.624 · 2.162 · 2.107 s</td></tr>
    <tr><td>${c('--maxWorkers=1')}</td><td>2.306 · 2.276 · 2.156 s</td><td>2.705 · 2.783 · 2.740 s</td></tr>
    <tr><td>${c('--no-isolate')}</td><td>0.894 · 0.926 · 0.859 s</td><td>2.106 · 2.148 · 2.083 s</td></tr>
    <tr><td>${c('--pool=threads')}</td><td>0.946 · 0.898 · 0.990 s</td><td>—</td></tr></table>`, 1.02) +
    two(box('Isolation protects you', `A fresh module cache per file: ${c('vi.mock')}, spies, fake clocks and module state cannot leak into the next file.`, 'lam'),
      box('--no-isolate: ~0.15 s here', 'Buys almost nothing and brings back shared-state flakiness between files. Measure your own project first.', 'do2')) },
  { t: 'Run less, split the rest', body: two(vt(CHANGED, { title: 'terminal — --changed (git) and related', fs: 15 }),
      vt(SHARD, { title: 'terminal — --shard=1/3 · 2/3 · 3/3', fs: 16 })) +
    two(box('--changed and related', 'Only test files that import the changed file — 1 of 14, or 6 of 14 for time.js. Great while working; run everything before merging.', 'lam'),
      box('Shards split files, not time', `31 + 56 + 13 = 100, none twice. ${c('--reporter=blob')} + ${c('--mergeReports')} → one report (CI matrix: Chapter 9).`, 'xanh')) },
  { t: 'Practice (15 minutes)', body: steps([
      `Run ${c('demo8/th84-de.test.js')}: green, 5006 ms — a sleep “for the e-mail”, real retry waits`,
      `Rewrite it: ${c('await bookAndNotify(…)')}, fake timers for ${c('retry')} — 29 ms`,
    ]) + vt(TIMEOUT, { title: 'terminal — a guard: --testTimeout=500', fs: 14 }) +
    box('Done when', 'Under 100 ms, green with --testTimeout=500, and still red if “Booking confirmed” or the number of attempts changes.', 'xanh') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Measure by layer, file and test; read the Duration line</li>
    <li>Real waits are the usual cause: fake the clock, await the work</li>
    <li>Build only the data a test needs — 6.14 s became 210 ms</li>
    <li>Parallelism hides slowness; shared data brings flakiness back</li>
    <li>Keep isolation; run less while working, everything before merge</li></ul>` },
]);
