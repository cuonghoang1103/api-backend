/**
 * tst-08-3 — Testing · Chapter 8 · Lesson 8.3 "Flaky tests: finding and fixing them" (01/11/2026). Slug: tst-8-3-flaky.
 * Output = chạy thật (s08/_ma.mjs): đồng hồ thật đỏ 06:19 / xanh sau 07:00; ngẫu nhiên 21/100; thứ tự 0/20 vs 13/20 khi xáo + seed;
 * mạng 28/100; tranh chấp 33/100; retry 17/50 → 0/50 ("Tests 1 passed", "(retry x1)"); quarantine tag; bản sửa 0/20.
 */
import { lamDeck, js, vt, two, box, steps, c, zm, flow } from './_tst-chung.mjs';

export const deck = { key: 'tst-08-3', code: 'TST 8.3', title: 'Flaky tests', sub: 'reproduce, quarantine, fix the cause' };

const GIO = `const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
expect(daysAheadVN(tomorrow)).toBe(1);`;
const SANG = `$ date '+%H:%M %Z' && npx vitest run demo8/gio-that.test.js
06:19 +07
   × a booking for tomorrow is 1 day ahead 5ms
AssertionError: expected +0 to be 1 // Object.is equality
      Tests  1 failed (1)`;
const SAU = `$ date '+%H:%M %Z' && npx vitest run demo8/gio-that.test.js
07:01 +07
   ✓ a booking for tomorrow is 1 day ahead 2ms
      Tests  1 passed (1)`;
const NGAU = `$ npx vitest run demo8/ngau-nhien.test.js --repeats=99 --reporter=dot
 FAIL  demo8/ngau-nhien.test.js > a student booking for a normal class …
AssertionError: expected true to be false // Object.is equality
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/21]⎯
      Tests  1 failed (1)`;
const MANG = `$ npx vitest run demo8/mang.test.js --repeats=99 --reporter=dot
 FAIL  demo8/mang.test.js > sends the booking confirmation
Error: Test timed out in 100ms.
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/28]⎯
      Tests  1 failed (1)`;
const THU_TU = `const guard = createLoginGuard(() => Date.parse('2026-11-16T08:00:00Z'));   // shared
it('a user with no failures is not locked', () => {
  expect(guard.isLocked('an@fpt.edu.vn')).toBe(false);
});
it('5 wrong passwords lock the account', () => {
  for (let i = 0; i < 5; i++) guard.recordFailure('an@fpt.edu.vn');
  expect(guard.isLocked('an@fpt.edu.vn')).toBe(true);
});`;
const LAP = `$ node scripts/lap-lai.mjs 20 demo8/thu-tu.test.js
red in 0/20 runs (9.9 s)
$ node scripts/lap-lai.mjs 20 demo8/thu-tu.test.js --sequence.shuffle
red in 13/20 runs (10.0 s)
seeds of red runs: 1793489700951, 1793489701473, …
$ npx vitest run demo8/thu-tu.test.js --sequence.shuffle --sequence.seed=1793489700951
      Running tests with seed "1793489700951"
   × a user with no failures is not locked 3ms
   ✓ 5 wrong passwords lock the account 0ms
      Tests  1 failed | 2 passed (3)`;
const DUA = `$ npx vitest run demo8/dua-lech.test.js --repeats=99 --reporter=dot
 FAIL  demo8/dua-lech.test.js > two students book the same slot at once: exactly one wins
AssertionError: expected [ 'fulfilled', 'fulfilled' ] to deeply equal [ 'fulfilled', 'rejected' ]
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/33]⎯`;
const RETRY = `$ node scripts/lap-lai.mjs 50 demo8/dua-lech.test.js
red in 17/50 runs (28.9 s)
$ node scripts/lap-lai.mjs 50 demo8/dua-lech.test.js --retry=2
red in 0/50 runs (30.7 s)
$ npx vitest run demo8/dua-lech.test.js --retry=2      ← the 5th of 6 runs
   ✓ two students book the same slot at once: exactly one wins 88ms (retry x1)
      Tests  1 passed (1)`;
const CACH_LY = `// LAB-142 (owner: an, fix by 2026-11-20): double booking under load — lesson 8.3
it('two students book the same slot at once: exactly one wins',
  { tags: ['quarantine'] }, async () => { … });
// vitest.config.js
tags: [{ name: 'quarantine', description: 'known flaky: has an issue and an owner, …' }],`;
const CACH_LY_RA = `$ npx vitest run demo8/cach-ly.test.js --tagsFilter='!quarantine'
   ✓ 31 seats need approval 1ms
   ↓ two students book the same slot at once: exactly one wins
      Tests  1 passed | 1 skipped (2)
$ npx vitest run demo8/cach-ly.test.js --tagsFilter=quarantine --repeats=19
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/8]⎯
      Tests  1 failed | 1 skipped (2)`;
const SUA = `$ npx vitest run demo8/da-sua.test.js --repeats=99 --sequence.shuffle
      Tests  11 passed (11)
$ node scripts/lap-lai.mjs 20 demo8/da-sua.test.js --sequence.shuffle
red in 0/20 runs (13.4 s)`;

export const slides = lamDeck({ chuong: 'Chapter 8 — Coverage, quality and flaky tests', bai: '8.3' }, [
  { cover: true, t: 'Flaky tests:<br>finding and fixing them', sub: 'Chapter 8 · Lesson 8.3 — five causes made red on purpose, measured, and fixed where they live' },
  { t: 'What you will be able to do after this lesson', to: true, giua: true, body: `<ul>
    <li>Name the five usual causes of a flaky test</li>
    <li>Turn “sometimes red” into a number: N red runs out of 100</li>
    <li>Replay a red test order exactly with a seed</li>
    <li>Explain, with numbers, why retries hide bugs</li>
    <li>Quarantine a flaky test with an owner and a date — then fix the cause</li></ul>` },
  { t: 'Same code, two results', body: two(box('Definition', 'A <b>flaky test</b> passes and fails on the <b>same code</b>. Something the test does not control decides: the clock, a random number, which test ran first, the network, or timing.', 'lam'),
      box('Google, 2016 (Testing Blog)', '≈ 1.5% of all test runs flaky.<br>Almost 16% of tests have some flakiness.<br>≈ 84% of pass→fail transitions on CI involve a flaky test.', 'do2')) +
    box('Why it matters', `Once red can mean “just run it again”, a real failure looks exactly like noise. Lesson 7.3 met this in the browser; here we go down to Vitest, where one run takes 0.1 s — so we can afford ${c('--repeats=99')}.`, 'xanh') },
  { t: 'Cause 1: the real clock', body: js(GIO, { sm: true, hl: [1] }) + vt(SANG, { title: 'run before 07:00 in Viet Nam', fs: 14 }) + vt(SAU, { title: 'the same file, run after 07:00', fs: 14 }) +
    box('The date is UTC', `At 06:19 (UTC+7) it is still yesterday in UTC, so “tomorrow in UTC” is today in Viet Nam. Fix: pass the clock in — ${c('daysAheadVN(date, now)')} — and test 06:30 on purpose.`, 'do2') },
  { t: 'Causes 2 and 4: random data and the network', body: vt(NGAU, { title: 'demo8/ngau-nhien.test.js — “any realistic class size”: 1–40 seats', fs: 13 }) + vt(MANG, { title: 'demo8/mang.test.js — a real server answers in 20–140 ms, the test allows 100 ms', fs: 13 }) +
    two(box('21 red out of 100', `Seats &gt; 30 need approval (BR-06). Fix: name the cases — 1, 30, 31, 40 — or a seeded property test (lesson 1.4).`, 'lam'),
      box('28 red out of 100', `A unit test over the network tests the network. Fix: fake the provider at the boundary (msw, lesson 3.2).`, 'lam')) },
  { t: 'Cause 3: order and shared state', body: js(THU_TU, { sm: true, hl: [1] }) + vt(LAP, { title: 'terminal — 20 fresh processes each, then one red seed replayed', fs: 12.5 }) +
    box('The seed of a red run is your bug report', `Shuffled: 13 red in 20. The seed replays the same order — same test, same line. Copy it before “re-run”. Fix: a ${c('beforeEach')} that builds a new guard.`, 'xanh') },
  { t: 'Cause 5: a race — the test is right', body: vt(DUA, { title: 'demo8/dua-lech.test.js — lookups take 5 + 0–40 ms, like a busy database', fs: 13 }) +
    two(box('33 out of 100: double booking', 'Lesson 2.1: every run (fixed 5 ms). Lesson 7.3: [201, 201] by accident. With uneven timing: one run in three — how a real race looks in production.', 'do2'),
      box('Fix the app, not the test', 'A sleep or a retry would delete the only evidence. PostgreSQL: the EXCLUDE constraint of lesson 4.1. In memory: one booking per lab at a time.', 'xanh')) },
  { t: 'Retries hide bugs. Measured', body: vt(RETRY, { title: 'terminal — the same race test, 50 fresh runs each', fs: 14 }) +
    two(box('17/50 → 0/50', 'The double booking is still there. Only the evidence is gone — and Vitest’s summary says “passed”. The only trace is “(retry x1)” at the end of one line.', 'do2'),
      box('Rules that work', 'No retries locally. On CI at most 1–2, only for slow infrastructure. Every passed-on-retry test is reported and gets an issue.', 'lam')) },
  { t: 'Quarantine, not a graveyard', body: js(CACH_LY, { sm: true, hl: [1, 3] }) + vt(CACH_LY_RA, { title: 'terminal — the main job and the quarantine job', fs: 12 }) +
    box('Hospital rules', `Main job: ${c("--tagsFilter='!quarantine'")} — 1 passed, 1 skipped (visible, not lost). Quarantine job: non-blocking, still finds the bug 8 times in 20. Every tag has an issue, an owner and a date.`, 'xanh') },
  { t: 'Five causes, five fixes', body: zm(`<table class="t"><tr><th>Cause</th><th>Measured</th><th>Fix at the cause</th></tr>
    <tr><td>real clock</td><td>red at 06:19, green after 07:00</td><td>inject the clock</td></tr>
    <tr><td>random data</td><td>21 / 100</td><td>name the cases, boundary first</td></tr>
    <tr><td>order + shared state</td><td>0/20 → 13/20 shuffled</td><td>fresh state per test</td></tr>
    <tr><td>network</td><td>28 / 100</td><td>fake at the boundary</td></tr>
    <tr><td>race in the app</td><td>33 / 100</td><td>fix the app</td></tr></table>`, 0.95) +
    vt(SUA, { title: 'demo8/da-sua.test.js — all five fixed', fs: 13 }) +
    flow([{ t: 'Detect' }, { t: 'Reproduce', s: 'repeats · seed' }, { t: 'Quarantine', s: 'tag · owner' }, { t: 'Fix', s: 'the cause' }, { t: 'Prove', s: '100 runs' }], { h: 110, fs: 18 }) },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      `${c('demo8/th83-de.test.js')} is green in file order. Run it 20× in order and 20× shuffled with ${c('lap-lai.mjs')}`,
      `Replay the first red seed with ${c('--sequence.seed')}: which test fails, and why?`,
      `Fix it without deleting a test; prove it with 20 shuffled runs`,
    ]) + box('Measured', `0/20 in order, 8/20 shuffled · the seed run: “Test timed out in 5000ms” — fake timers leaked from the other test.`, 'lam') +
    box('Done when', `${c('afterEach(() => { vi.useRealTimers(); })')} — red in 0/20 shuffled runs.`, 'xanh') },
]);
