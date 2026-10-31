/**
 * tst-02-2 — Testing · Chapter 2 · Lesson 2.2 "Controlling time: fake timers, dates and time zones" (01/11/2026). Slug: tst-2-2-thoi-gian.
 * Output = chạy thật (demo2/mui-gio dưới TZ=Asia/Ho_Chi_Minh và TZ=UTC, dong-ho, retry-that/gia).
 */
import { lamDeck, js, vt, two, box, steps, c, zm } from './_tst-chung.mjs';

export const deck = { key: 'tst-02-2', code: 'TST 2.2', title: 'Controlling time', sub: 'fake timers, dates, time zones' };

const CANCEL = `// Lite-3: cancel until 60 minutes before the start
export function canCancel(startsAt, now = new Date()) {
  const minutesLeft = (startsAt.getTime() - now.getTime()) / 60000;
  return minutesLeft >= CANCEL_LIMIT_MINUTES;
}`;
const NAIVE = `export function daysAheadNaive(dateText, now = new Date()) {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);          // local midnight
  return Math.round((new Date(dateText) - today) / 86400000);
}`;
const VN = `const VN_OFFSET_MS = 7 * 60 * 60 * 1000;
export function daysAheadVN(dateText, now = new Date()) {
  const todayVN = new Date(now.getTime() + VN_OFFSET_MS)
    .toISOString().slice(0, 10);       // today's date in Viet Nam
  return Math.round((Date.parse(dateText + 'T00:00:00Z')
    - Date.parse(todayVN + 'T00:00:00Z')) / DAY_MS);
}`;
const TZVN = `$ TZ=Asia/Ho_Chi_Minh npx vitest run demo2/mui-gio.test.js
 ✓ demo2/mui-gio.test.js (2 tests) 2ms
   ✓ naive: 16 November is 14 days ahead 1ms
   ✓ VN calendar: 16 November is 14 days ahead 0ms`;
const TZUTC = `$ TZ=UTC npx vitest run demo2/mui-gio.test.js
 ❯ demo2/mui-gio.test.js (2 tests | 1 failed) 6ms
   × naive: 16 November is 14 days ahead 5ms
   ✓ VN calendar: 16 November is 14 days ahead 0ms
…
AssertionError: expected 15 to be 14 // Object.is equality`;
const FAKE = `beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-11-16T07:00:00+07:00'));
});
afterEach(() => {
  vi.useRealTimers();
});

it('“now” is frozen', () => {
  expect(new Date().toISOString()).toBe('2026-11-16T00:00:00.000Z');
});`;
const DONGHO = ` ✓ demo2/dong-ho.test.js (5 tests) 5ms
   ✓ canCancel (Lite-3: until 60 minutes before) (4)
     ✓ “now” is frozen: new Date() returns the time we set 3ms
     ✓ at 07:59 a 09:00 booking can be cancelled: true 1ms
     ✓ at 08:00 a 09:00 booking can be cancelled: true 0ms
     ✓ at 08:01 a 09:00 booking can be cancelled: false 0ms
   ✓ login guard (BR-02) with fake timers (1)
     ✓ unlocks exactly 15 minutes after the 5th failure 0ms`;
const LOCK = `it('unlocks exactly 15 minutes after the 5th failure', () => {
  const guard = createLoginGuard();
  for (let i = 0; i < 5; i++) guard.recordFailure('an@fpt.edu.vn');
  expect(guard.isLocked('an@fpt.edu.vn')).toBe(true);

  vi.advanceTimersByTime(15 * 60 * 1000 - 1); // 14:59.999 later
  expect(guard.isLocked('an@fpt.edu.vn')).toBe(true);

  vi.advanceTimersByTime(1);                  // exactly 15:00 later
  expect(guard.isLocked('an@fpt.edu.vn')).toBe(false);
});`;
const RETRY = ` ✓ demo2/retry-gia.test.js (2 tests) 5ms
   ✓ fake timers: waits 1 s, then 2 s, between attempts 3ms
   ✓ fake timers: gives up after 3 attempts with the last error 1ms
 ✓ demo2/retry-that.test.js (1 test) 3006ms
   ✓ real timers: succeeds on the 3rd attempt (and really waits) 3005ms`;
const STEP = `const result = retry(mailer);              // start, do not await yet
await vi.advanceTimersByTimeAsync(0);
expect(mailer).toHaveBeenCalledTimes(1);   // first attempt at once
await vi.advanceTimersByTimeAsync(999);
expect(mailer).toHaveBeenCalledTimes(1);   // 1 s not over yet
await vi.advanceTimersByTimeAsync(1);
expect(mailer).toHaveBeenCalledTimes(2);   // second attempt at 1 000 ms
await vi.advanceTimersByTimeAsync(2000);
expect(mailer).toHaveBeenCalledTimes(3);   // third, 2 000 ms later
await expect(result).resolves.toBe('sent');`;

export const slides = lamDeck({ chuong: 'Chapter 2 — Async code, time and errors', bai: '2.2' }, [
  { cover: true, t: 'Controlling time', sub: 'Chapter 2 · Lesson 2.2 — fake timers, frozen dates and the UTC+7 trap' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Time is an <b>input</b>: a test that reads the real clock is not repeatable</li>
    <li>The time-zone bug that passes on your laptop and fails in CI — measured</li>
    <li>${c('vi.useFakeTimers')} + ${c('vi.setSystemTime')}: freeze “now”</li>
    <li>${c('vi.advanceTimersByTime')}: 15 minutes in 0 ms (BR-02 lock-out)</li>
    <li>Injecting a clock instead — and when to prefer it</li>
    <li>Retry with back-off: 3 seconds real vs 3 ms fake</li></ul>` },
  { t: 'Time is an input', body: js(CANCEL) + two(box('The problem', `${c('now')} defaults to the real clock. A test written at 08:00 can pass today and fail at 08:30 tomorrow — nothing in the code changed.`, 'do2'), box('Two ways to control it', `Pass ${c('now')} yourself (injection), or freeze the clock for the whole test with fake timers. This lesson shows both.`, 'xanh')) },
  { t: 'Time zones: two ways to count “days ahead”', body: `<div class="tcap" style="color:#a52a1d;font-size:18px;font-weight:800">✗ Naive: local midnight</div>${js(NAIVE, { sm: true })}<div class="tcap" style="color:#1f6b40;font-size:18px;font-weight:800">✓ Viet Nam calendar on any server</div>${js(VN, { sm: true })}` +
    box('BR-05 in LabFlow', 'Students live in UTC+7. “14 days ahead” must be counted in Viet Nam’s calendar — even when the server runs in UTC.', 'lam') },
  { t: 'Same test, two time zones', body: vt(TZVN, { title: 'your laptop in Viet Nam', sm: false }) + vt(TZUTC, { title: 'a CI server or Docker container (UTC)', sm: false }) +
    box('06:30 on 2 November in Viet Nam is 23:30 on 1 November in UTC', 'The naive version counts from 1 November on the server: 15 days, and a valid booking is refused.', 'do2') },
  { t: 'Why servers see a different “today”', body: zm(`<table class="t"><tr><th>Moment</th><th>Viet Nam (UTC+7)</th><th>Server (UTC)</th><th>Naive days to 16 Nov</th></tr>
    <tr><td>06:30, 2 Nov (VN)</td><td>2 Nov</td><td>1 Nov, 23:30</td><td>14 on laptop · <b>15</b> on server</td></tr>
    <tr><td>12:00, 2 Nov (VN)</td><td>2 Nov</td><td>2 Nov, 05:00</td><td>14 · 14</td></tr>
    <tr><td>00:00, 3 Nov (VN)</td><td>3 Nov</td><td>2 Nov, 17:00</td><td>13 on laptop · <b>14</b> on server</td></tr></table>`, 1.15) +
    box('Habit', `Run the suite once with ${c('TZ=UTC npm run test:unit')} before pushing, and pick test times near midnight — that is where the bug lives.`, 'xanh') },
  { t: 'Fake timers: freeze “now”', body: js(FAKE, { hl: [2, 3, 6] }) + box('Always restore', `${c('vi.useRealTimers()')} in ${c('afterEach')}. Otherwise the next test in the same file still lives in your frozen time — measured below in practice step 4.`, 'do2') },
  { t: 'Boundaries in time: 61, 60, 59 minutes before', body: zm(vt(DONGHO, { title: 'terminal — npx vitest run demo2/dong-ho.test.js', sm: false }), 1.05) +
    box('Same technique as Chapter 1', 'A time limit is a boundary: test on it (08:00 — exactly 60 min before 09:00) and one minute either side.', 'lam') },
  { t: 'BR-02: jump 15 minutes in 0 ms', body: js(LOCK, { hl: [6, 9] }) + box('advanceTimersByTime', `Moves the fake clock forward: ${c('Date.now()')} and pending ${c('setTimeout')}s jump with it. The test runs in under a millisecond.`, 'xanh') },
  { t: 'Two ways to control time', body: `<table class="t"><tr><th></th><th>Inject a clock</th><th>Fake timers</th></tr>
    <tr><td><b>Example</b></td><td>${c('createLoginGuard(() => clock)')}</td><td>${c('vi.useFakeTimers()')}</td></tr>
    <tr><td><b>How</b></td><td>the code takes ${c('now')} as a parameter</td><td>Vitest replaces Date and timers globally</td></tr>
    <tr><td><b>Needs code change?</b></td><td>yes — design for it</td><td>no</td></tr>
    <tr><td><b>Controls setTimeout?</b></td><td>no</td><td>yes</td></tr>
    <tr><td><b>Risk</b></td><td>none — pure</td><td>forgetting to restore leaks into other tests</td></tr>
    <tr><td><b>Use for</b></td><td>rules that read the date (canCancel, lock-out)</td><td>code that waits: retry, debounce, timeouts</td></tr></table>` +
    box('This course', 'Rules take ‘now’ as a parameter (Lab 2 reference uses an injected clock); timers are faked only where code really waits.', 'lam') },
  { t: 'Retry with back-off: 3 s real, 3 ms fake', body: vt(RETRY, { title: 'terminal — same retry(), two kinds of time', sm: false }) +
    box('Why this matters', 'Ten such tests with real timers add half a minute to every run — and slow suites get skipped. Fake timers make them instant and exact.', 'do2') },
  { t: 'Step through time with advanceTimersByTimeAsync', body: js(STEP, { sm: true, hl: [4, 6, 8] }) +
    box('Async version', `${c('advanceTimersByTimeAsync')} also lets promises settle between timers — needed when the waiting code uses ${c('await')}.`, 'lam') },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      `Freeze the clock at 08:00 and test bookings 59, 60 and 61 minutes away`,
      `After a lock expires, show that 4 new failures do not lock and the 5th does`,
      `Run ${c('demo2/mui-gio.test.js')} with ${c('TZ=UTC')} and ${c('TZ=Asia/Ho_Chi_Minh')}`,
      `Freeze 2020 in test A without restoring: watch test B (“today is in 2026”) fail`,
    ]) + box('Done when', `${c('demo2/th22.test.js')}: 4 passed; the naive time-zone test fails only under ${c('TZ=UTC')}; B fails only after A (“expected 2020 …”).`, 'xanh') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Time is an input — never let a unit test read the real clock</li>
    <li>Count calendar days in the users’ zone; test with ${c('TZ=UTC')} too</li>
    <li>${c('useFakeTimers')} + ${c('setSystemTime')} freeze “now”; restore in ${c('afterEach')}</li>
    <li>${c('advanceTimersByTime(Async)')} jumps minutes in microseconds</li>
    <li>Inject a clock into rules; fake timers for code that waits</li>
    <li>Time limits are boundaries: on, just before, just after</li></ul>` },
]);
