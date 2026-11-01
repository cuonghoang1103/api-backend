/**
 * tst-lab-8 — Testing · Chapter 8 · Lab 8 "Strong and stable: from 3/8 to 8/8, in any order" (01/11/2026). Slug bài: tst-8-5-lab-chat-luong.
 * Output = chạy thật: bộ yếu 100% dòng / 93,75% nhánh, đỏ 10/20 lần khi xáo, xanh 4/10 thứ tự, 3/8; lời giải 100%, 10/10, 8/8 (10,2 s);
 * Stryker trên checkin.js 98,65% (sống: no-show hôm nay) → 100%.
 */
import { lamDeck, js, vt, two, box, steps, c, zm } from './_tst-chung.mjs';

export const deck = { key: 'tst-lab-8', code: 'TST Lab 8', title: 'Lab 8 — Strong and stable', sub: 'from 100% coverage and 3/8 mutants to 8/8, in any order' };

const CODE = `export function checkIn(booking, now) {
  if (booking.status !== 'CONFIRMED') return { ok: false, code: 'NOT_CONFIRMED' };
  const start = parseTime(booking.start);
  const t = parseTime(now);
  if (t < start - EARLY) return { ok: false, code: 'TOO_EARLY' };   // EARLY = 10
  if (t > start + GRACE) return { ok: false, code: 'NO_SHOW' };     // GRACE = 15
  return { ok: true, late: t > start };
}
export function bannedUntil(noShows, today) {
  const t = dayNumber(today);
  const recent = noShows.map(dayNumber).filter((d) => d <= t && t - d < LOOKBACK_DAYS);
  if (recent.length < STRIKES) return null;                         // 3 in 30 days
  const end = Math.max(...recent) + BAN_DAYS;                       // + 7 days
  return end < t ? null : isoDate(end);
}`;
const WEAK = `const log = createNoShowLog();          // one log for the whole file
it('on time', () => {
  expect(checkIn(booking, '08:05')).toBeTruthy();
});
it('too late', () => {
  expect(checkIn(booking, '09:00').code).toBeDefined();
});
it('records a no-show', () => {
  log.record('an', '2026-11-01');
  expect(log.datesFor('an')).toHaveLength(1);
});`;
const WEAKOUT = `      Tests  8 passed (8)
 checkin.js |     100 |    93.75 |     100 |     100 | 30
red in 0/20 runs (10.6 s)
red in 10/20 runs (10.3 s)       ← --sequence.shuffle
✘ green in 4/10 shuffled orders
3/8 mutants killed`;
const REF = `it.each([
  ['07:49', { ok: false, code: 'TOO_EARLY' }],
  ['07:50', { ok: true, late: false }],
  ['08:00', { ok: true, late: false }],
  ['08:01', { ok: true, late: true }],
  ['08:15', { ok: true, late: true }],
  ['08:16', { ok: false, code: 'NO_SHOW' }],
])('at %s → %o', (now, expected) => {
  expect(checkIn(booking, now)).toEqual(expected);
});`;
const REFOUT = `✔ green in 10/10 shuffled orders
✔ killed    #1 check-in refused exactly 10 …
…
✔ killed    #8 the last day of the ban is …

8/8 mutants killed
real 9.709s`;

export const slides = lamDeck({ chuong: 'Chapter 8 — Coverage, quality and flaky tests', bai: 'Lab 8' }, [
  { cover: true, t: 'Lab 8 — Strong and stable:<br>from 3/8 to 8/8, in any order', sub: 'Chapter 8 lab · 60–90 minutes · coverage, mutants and a shuffled order, graded by a script' },
  { t: 'Your mission', to: true, giua: true, body: steps([
      `Two new rules: ${c('checkIn')} (BR-07) and ${c('bannedUntil')} (BR-08)`,
      'A teammate’s tests: green, 100% of lines — measure what they are worth',
      `Rewrite ${c('src/rules/checkin.test.js')} from the rules’ boundaries`,
      `${c('node scripts/dot-bien-8.mjs')}: green in 10/10 shuffled orders and 8/8 mutants`,
    ]) + box('Two checks, one file', 'First the file runs in ten shuffled orders (seeds 1–10). Then eight bugs are planted one at a time, and each must turn it red.', 'lam') },
  { t: 'The code under test', body: js(CODE, { sm: true, hl: [5, 6, 7, 11, 12, 14] }) +
    box('Six boundaries', 'For an 08:00 booking: 07:50, 08:00, 08:15. For a ban: the 30-day window, the third no-show, the last banned day.', 'lam') },
  { t: 'The 8 planted bugs', body: zm(`<table class="t" style="font-size:17px"><tr><th>#</th><th>Planted bug</th><th>What a user would notice</th></tr>
    <tr><td>1</td><td>${c('t <= start - EARLY')}</td><td>arriving exactly 10 minutes early is “too early”</td></tr>
    <tr><td>2</td><td>${c('t >= start + GRACE')}</td><td>08:15 already counts as a no-show</td></tr>
    <tr><td>3</td><td>${c('late: t >= start')}</td><td>exactly on time is recorded as late</td></tr>
    <tr><td>4</td><td>${c("status === 'CANCELLED'")}</td><td>a booking waiting for approval checks in</td></tr>
    <tr><td>5</td><td>${c('t - d <= LOOKBACK_DAYS')}</td><td>a no-show 30 days ago still counts</td></tr>
    <tr><td>6</td><td>${c('recent.length <= STRIKES')}</td><td>three no-shows bring no ban</td></tr>
    <tr><td>7</td><td>${c('Math.min(...recent)')}</td><td>the ban counts from the first no-show</td></tr>
    <tr><td>8</td><td>${c('end <= t ? null')}</td><td>the last day of the ban is free</td></tr></table>`, 1.05) },
  { t: 'The first attempt: green, 100% — and weak', body: js(WEAK, { sm: true, hl: [1, 3, 6] }) +
    two(vt(WEAKOUT, { title: 'measured', fs: 13 }), box('Why it is weak', `No boundary values (07:00, 08:05, 09:00); ${c('toBeTruthy')} passes for any result object; one shared ${c('log')} ties two tests to their order; “a ban ends” never reaches line 30.`, 'do2')) },
  { t: 'The reference: 8 of 8, in any order', body: js(REF, { sm: true, hl: [2, 3, 5, 6] }) +
    two(vt(REFOUT, { title: 'node scripts/dot-bien-8.mjs', fs: 13 }), box('What made the difference', `Boundary tables, ${c('toEqual')} on whole results, a fresh log per test, “today” as a string. Bonus: Stryker found one more gap (a no-show dated today): 98.65% → 100%.`, 'xanh')) },
  { t: 'Rubric (10 points)', body: zm(`<table class="t"><tr><th>Criterion</th><th>Points</th><th>How it is checked</th></tr>
    <tr><td>Mutants killed</td><td>4 (0.5 each)</td><td>${c('node scripts/dot-bien-8.mjs')}</td></tr>
    <tr><td>Green in 10 shuffled orders</td><td>1.5</td><td>same script, first line</td></tr>
    <tr><td>Boundaries named in ${c('it.each')} titles</td><td>1.5</td><td>read the tests</td></tr>
    <tr><td>Exact assertions: no ${c('toBeTruthy')} / ${c('toBeDefined')}</td><td>1</td><td>read the tests</td></tr>
    <tr><td>100% branch coverage of checkin.js</td><td>1</td><td>${c('--coverage')}</td></tr>
    <tr><td>No real clock, no shared mutable state</td><td>1</td><td>read the tests</td></tr></table>`, 1.08) },
  { t: 'Hints, from gentle to strong', to: true, body: steps([
      `Table for 08:00: 07:49, 07:50, 08:00, 08:01, 08:15, 08:16 — assert with ${c('toEqual')}`,
      `${c('PENDING')} and ${c('CANCELLED')} → ${c("{ ok: false, code: 'NOT_CONFIRMED' }")}`,
      `Today is ${c("'2026-11-12'")}: three no-shows → ${c("'2026-11-17'")}, in any order; two → ${c('null')}`,
      '2026-10-13 is 30 days back, 10-14 is 29; banned on 11-17, free on 11-18',
      `A fresh log per test, then ${c('lap-lai.mjs 20 … --sequence.shuffle')}`,
    ]) },
  { t: 'Before you call it done', to: true, giua: true, body: `<ul>
    <li>${c('node scripts/dot-bien-8.mjs')}: <b>10/10 orders</b> and <b>8/8 mutants killed</b></li>
    <li>100% branches for ${c('checkin.js')} with ${c('--coverage')}</li>
    <li>No ${c('toBeTruthy')}, no ${c('new Date()')}, no shared ${c('log')}</li>
    <li>${c('npm run test:unit')} green — 116 tests in 15 files</li>
    <li>Bonus: ${c('npx stryker run --mutate src/rules/checkin.js')} at 100%</li></ul>` },
]);
