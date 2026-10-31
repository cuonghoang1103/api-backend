/**
 * tst-lab-2 — Testing · Chapter 2 · Lab 2 "Async, time and errors — kill 8 mutants" (01/11/2026). Slug bài: tst-2-5-lab-bat-dong-bo.
 * Output = chạy thật: bộ test yếu (5 test xanh, 0/8) và lời giải (22 test chương 2, 62 cả dự án, 8/8) với scripts/dot-bien-2.mjs.
 */
import { lamDeck, vt, two, box, steps, c, zm, flow } from './_tst-chung.mjs';

export const deck = { key: 'tst-lab-2', code: 'TST Lab 2', title: 'Lab 2 — async, time, errors', sub: 'kill 8 mutants in LabFlow Lite' };

const WEAK = `$ node scripts/dot-bien-2.mjs
✘ SURVIVED  #1 Lite-3: cancel exactly 60 min before refused
✘ SURVIVED  #2 BR-02: locks after 6 failures, not 5
✘ SURVIVED  #3 BR-02: still locked at exactly 15:00
✘ SURVIVED  #4 success does not reset the counter
✘ SURVIVED  #5 retry waits 1 s every time (no back-off)
✘ SURVIVED  #6 retry makes one attempt too few
✘ SURVIVED  #7 lookup failure leaks the raw error
✘ SURVIVED  #8 days counted in UTC, not Viet Nam time

0/8 mutants killed`;
const WEAK_RUN = ` ✓ src/weak2.test.js (5 tests) 16ms
   ✓ cancel two hours before is allowed 1ms
   ✓ 16 November is 14 days after 2 November (midday) 1ms
   ✓ ten failures lock the account 0ms
   ✓ retry returns the result 1ms
   ✓ bookLab stores a booking 12ms`;
const STRONG = `$ node scripts/dot-bien-2.mjs
✔ killed    #1 Lite-3: cancel exactly 60 min before refused
✔ killed    #2 BR-02: locks after 6 failures, not 5
✔ killed    #3 BR-02: still locked at exactly 15:00
✔ killed    #4 success does not reset the counter
✔ killed    #5 retry waits 1 s every time (no back-off)
✔ killed    #6 retry makes one attempt too few
✔ killed    #7 lookup failure leaks the raw error
✔ killed    #8 days counted in UTC, not Viet Nam time

8/8 mutants killed`;

const FULL = ` Test Files  7 passed (7)
      Tests  62 passed (62)
   Duration  175ms (tests 40%, import 32%, transform 20%, worker 8%)`;

export const slides = lamDeck({ chuong: 'Chapter 2 — Async code, time and errors', bai: 'Lab 2' }, [
  { cover: true, t: 'Lab 2 — async, time and errors:<br>kill 8 mutants', sub: 'Chapter 2 lab · 90 minutes · graded by a script, not by opinion' },
  { t: 'Your mission', to: true, giua: true, body: steps([
      `Write tests for four modules: ${c('cancel.js')}, ${c('days.js')}, ${c('login-guard.js')}, ${c('retry.js')} — plus the failure paths of ${c('service.js')}`,
      'Every test is repeatable: no real clock, no real waiting, no luck',
      `Run ${c('node scripts/dot-bien-2.mjs')}: it plants 8 bugs, one at a time`,
      `A good suite turns red for <b>every</b> planted bug — 8/8 “killed”`,
    ]) + box('Same method as Lab 1', 'This time the bugs hide in time limits, back-off delays, catch branches and time zones — exactly what this chapter taught.', 'lam') },
  { t: 'The code under test', body: zm(`<table class="t"><tr><th>Module</th><th>Rule</th><th>Lesson</th></tr>
    <tr><td>${c('canCancel(startsAt, now)')}</td><td>Lite-3: cancel until 60 minutes before the start</td><td>2.2</td></tr>
    <tr><td>${c('daysAheadVN(dateText, now)')}</td><td>BR-05 days counted in Viet Nam’s calendar, on any server</td><td>2.2</td></tr>
    <tr><td>${c('createLoginGuard(now)')}</td><td>BR-02: 5 failures lock for 15 minutes; success resets</td><td>2.2</td></tr>
    <tr><td>${c('retry(fn, { attempts, delayMs })')}</td><td>3 attempts, waits 1 s then 2 s, rethrows the last error</td><td>2.2</td></tr>
    <tr><td>${c('bookLab(repo, input)')}</td><td>rule codes · ${c('OVERLAP')} · ${c('STORAGE_DOWN')} with ${c('cause')}</td><td>2.1 · 2.3</td></tr></table>`, 1.08) +
    box('Do not change the source', 'The mutation script searches for exact lines. Change the code and the script stops with “Mutant N: not found”.', 'do2') },
  { t: 'The 8 planted bugs', body: `<table class="t" style="font-size:17px"><tr><th>#</th><th>File</th><th>Original</th><th>Planted bug</th></tr>
    <tr><td>1</td><td>cancel.js</td><td>${c('minutesLeft >= CANCEL_LIMIT_MINUTES')}</td><td>${c('>')}</td></tr>
    <tr><td>2</td><td>login-guard.js</td><td>${c('s.failures >= MAX_FAILURES')}</td><td>${c('>')}</td></tr>
    <tr><td>3</td><td>login-guard.js</td><td>${c('s.lockedUntil > now()')}</td><td>${c('>=')}</td></tr>
    <tr><td>4</td><td>login-guard.js</td><td>${c('state.delete(email);')}</td><td>${c('void email;')}</td></tr>
    <tr><td>5</td><td>retry.js</td><td>${c('delayMs * i')}</td><td>${c('delayMs')}</td></tr>
    <tr><td>6</td><td>retry.js</td><td>${c('i <= attempts')}</td><td>${c('i < attempts')}</td></tr>
    <tr><td>7</td><td>service.js</td><td>${c("throw new BookingError('STORAGE_DOWN', { cause: err })")}</td><td>${c('throw err;')}</td></tr>
    <tr><td>8</td><td>days.js</td><td>${c('now.getTime() + VN_OFFSET_MS')}</td><td>${c('now.getTime()')}</td></tr></table>` +
    flow([{ t: 'Plant 1 bug', s: 'edit one line', mau: '#c0392b' }, { t: 'vitest run src/', s: 'your tests', mau: '#336791' }, { t: 'Red = killed', s: 'green = survived', mau: '#e08a1e' }, { t: 'Restore', s: 'always', mau: '#2f7d4f' }], { h: 110, fs: 20 }) },
  { t: 'A typical first attempt: 0 of 8', body: vt(WEAK_RUN, { title: 'terminal — 5 tests, all green', fs: 16 }) +
    two(vt(WEAK, { title: 'and not one bug noticed', fs: 13 }), box('Why every mutant survived', 'Two hours before (not 60 min), midday (not near midnight), ten failures (not exactly 5), a retry that succeeds at once, only the happy path of bookLab. Each test stays far away from the line where the bug lives.', 'do2'), 'r64') },
  { t: 'The reference solution: 8 of 8', body: two(`<div>${vt(STRONG, { title: '22 tests in 5 new files (62 with Lab 1)', fs: 13 })}${vt(FULL, { title: 'npm test — whole suite, also under TZ=UTC', fs: 15 })}</div>`, box('What made the difference', `<ul style="font-size:19px"><li>59 / 60 / 61 minutes before the start</li><li>exactly 4 and 5 failures; 14:59.999 and 15:00</li><li>4 failures, a success, 1 more: not locked</li><li>${c('advanceTimersByTimeAsync')}: 999 / 1 000 / 2 999 / 3 000 ms</li><li>a repo that throws: ${c('code')} + ${c('cause')}</li><li>06:30 Viet Nam time = 23:30 UTC the day before</li></ul>`, 'xanh'), 'r64') },
  { t: 'Rubric (10 points)', body: zm(`<table class="t"><tr><th>Criterion</th><th>Points</th><th>How it is checked</th></tr>
    <tr><td>Mutants killed</td><td>4 (0.5 each)</td><td>${c('node scripts/dot-bien-2.mjs')}</td></tr>
    <tr><td>Time controlled: injected clock or fake timers, always restored; no real waiting</td><td>2</td><td>suite under 1 s · ${c('useRealTimers')} in ${c('afterEach')}</td></tr>
    <tr><td>Async done right: every promise awaited, rejections with ${c('rejects')}</td><td>1.5</td><td>${c('requireAssertions')} · read the code</td></tr>
    <tr><td>Errors asserted by code and cause, not by message wording</td><td>1</td><td>${c('toMatchObject({ code })')}</td></tr>
    <tr><td>Repeatable: green under ${c('TZ=UTC')} and ${c('TZ=Asia/Ho_Chi_Minh')}, ten runs in a row</td><td>1</td><td>run it</td></tr>
    <tr><td>Names state rule + moment + result; no ${c('.only')}/${c('.skip')}</td><td>0.5</td><td>read the report tree</td></tr></table>`, 1.02) +
    box('Pass mark', '7/10. Mutants killed alone cannot pass you — a suite that kills 8 but sleeps 3 real seconds loses the time points.', 'xanh') },
  { t: 'Hints, from gentle to strong', to: true, body: steps([
      'For every limit in the table (60 min, 5 failures, 15 min, 1 s/2 s, 3 attempts) test on it and one step either side',
      `${c('createLoginGuard(() => clock)')}: move ${c('clock')} yourself — no fake timers needed`,
      `For retry: start it, then ${c('await vi.advanceTimersByTimeAsync(999)')} and count the calls`,
      `For #7: a repo whose ${c('findOverlap')} throws — assert ${c('code')} and ${c('cause.message')}`,
      `For #8: pick a “now” between 00:00 and 07:00 Viet Nam time`,
    ]) },
  { t: 'Before you call it done', to: true, giua: true, body: `<ul>
    <li>${c('npm test')} green, under one second, no ${c('.only')} / ${c('.skip')}</li>
    <li>${c('TZ=UTC npm test')} is green too</li>
    <li>${c('node scripts/dot-bien-2.mjs')} prints <b>8/8 mutants killed</b></li>
    <li>${c('node scripts/dot-bien.mjs')} (Lab 1) still prints 8/8</li>
    <li>${c('git diff src/')} shows only test files</li>
    <li>Commit: ${c('test: async, time and error paths (Lab 2, 8/8 mutants)')}</li></ul>` },
]);
