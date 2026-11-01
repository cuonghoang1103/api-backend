/**
 * tst-lab-10 — Testing · Chapter 10 · Lab 10 "Test-first feature, pinned legacy, safe refactor" (01/11/2026). Slug: tst-10-5-lab-tdd-code-cu.
 * Output = chạy thật (s10/_ma.mjs): bộ yếu 1/8 (105-yeu); lời giải 3 dòng xanh + 8/8 (105-ref); bẫy !!club.member ⇒ dòng 'yes' đỏ (105-truot).
 */
import { lamDeck, js, vt, two, box, steps, c, zm } from './_tst-chung.mjs';

export const deck = { key: 'tst-lab-10', code: 'TST Lab 10', title: 'Test-first feature, pinned legacy, safe refactor', sub: 'from 1/8 to 8/8' };

const V0 = `export function clubFee(club, lab, date, start, end, seats) {
  var hrs = (parseInt(end.substr(0, 2)) * 60 …) / 60;
  var price = hrs * PRICES[lab.substr(0, 2)];
  var today = new Date(); // the QUOTE day
  if (today.getDay() == 0 || today.getDay() == 6)
    price = price * 1.5;
  if (club.member == true) price = price * 0.8;
  if (seats > 40) price = price + 100000;
  if (hrs >= 4) price = price - 50000;
  if (price < 0) price = 0;
  return Math.round(price / 1000) * 1000;
}`;
const YEU = `$ node scripts/dot-bien-10.mjs lab10/yeu/recurring.test.js lab10/yeu/clubFee.test.js
✔ lab10/yeu/clubFee.test.js is green on lab10/clubFee.v0.js
✔ lab10/yeu/recurring.test.js is green on lab10/recurring.ref.js
✔ lab10/yeu/clubFee.test.js is green on your src/legacy/clubFee.js (after your refactor)
✘ SURVIVED  #1 an event for exactly 40 seats pays the big-event fee
✘ SURVIVED  #2 a 4-hour event loses its long-event discount
✘ SURVIVED  #3 prices are rounded down instead of to the nearest 1,000
✘ SURVIVED  #4 Sunday is no longer charged the weekend rate
✘ SURVIVED  #5 the series starts one week late
✘ SURVIVED  #6 a 15-week series is refused
✘ SURVIVED  #7 a class on the last day of term is dropped
✔ killed    #8 a class is booked on a holiday
1/8 mutants killed`;
const REF = `$ node scripts/dot-bien-10.mjs
✔ src/legacy/clubFee.test.js is green on lab10/clubFee.v0.js
✔ src/rules/recurring.test.js is green on lab10/recurring.ref.js
✔ src/legacy/clubFee.test.js is green on your src/legacy/clubFee.js (after your refactor)
✔ killed    #1 an event for exactly 40 seats pays the big-event fee
…
✔ killed    #8 a class is booked on a holiday
8/8 mutants killed`;
const TRUOT = `planted in src/legacy/clubFee.js:  member: club.member == true  →  member: !!club.member
     × quoted on WED: member yes, BE-201 08:00–10:00, 30 seats ⇒ 400000 VND 4ms
AssertionError: expected 320000 to be 400000 // Object.is equality
      Tests  1 failed | 13 passed (14)`;

export const slides = lamDeck({ chuong: 'Chapter 10 — TDD and testing in real teams', bai: 'Lab 10' }, [
  { cover: true, t: 'Lab 10 — Test-first feature,<br>pinned legacy, safe refactor', sub: 'Chapter 10 lab · about 90 minutes · one grader, three green lines, 8 planted bugs' },
  { t: 'Your mission', to: true, giua: true, body: steps([
      `<b>A</b> — pin the legacy quote ${c('clubFee')} with characterization tests on a fixed clock: every number, LF-212 and NaN included`,
      `<b>B</b> — build BR-10 ${c('weeklyDates')} test-first; log each red → green step`,
      `<b>C</b> — refactor the quote into ${c('src/rules/clubFee.js')}; the pin does not change by one character`,
      `Prove it: ${c('node scripts/dot-bien-10.mjs')} — three green lines and 8/8`,
    ]) },
  { t: 'The code you inherit, and the rule you build', body: two(js(V0, { hl: [4, 5, 6] }),
      '<div>' + box('Pin, do not fix', `LF-212: the weekend rate reads ${c('new Date()')} — the day the quote is made; ${c('date')} is never read. An unknown building gives ${c('NaN')}. Both get a test.`, 'do2') +
      box('BR-10 weeklyDates', `Same weekday for ${c('weeks')} weeks (1–15, else BAD_WEEKS). Holiday ⇒ skipped, not extended. After ${c('until')} ⇒ AFTER_TERM. Start after term ⇒ STARTS_AFTER_TERM.`, 'lam') + '</div>', 'r64') +
    box('What v0 really computes (read, then pin)', `Price per hour: BE 200,000 · AL 350,000 VND × hours → ×1.5 on a weekend → ×0.8 for a member → +100,000 above 40 seats → −50,000 from 4 hours → nearest 1,000.`, 'xanh') },
  { t: 'Eight planted bugs', body: zm(`<table class="t"><tr><th>#</th><th>Bug</th><th>What a user notices</th></tr>
    <tr><td>1</td><td>v0: ${c('seats >= 40')}</td><td>exactly 40 seats pays the big-event fee</td></tr>
    <tr><td>2</td><td>v0: ${c('hrs > 4')}</td><td>a 4-hour event loses its discount</td></tr>
    <tr><td>3</td><td>v0: ${c('Math.floor')}</td><td>262,500 quoted 262,000, not 263,000</td></tr>
    <tr><td>4</td><td>v0: Sunday dropped</td><td>a Sunday quote misses the weekend rate</td></tr>
    <tr><td>5</td><td>BR-10: ${c('7 * (i + 1)')}</td><td>the series starts one week late</td></tr>
    <tr><td>6</td><td>BR-10: ${c('weeks >= MAX_WEEKS')}</td><td>a full 15-week term is refused</td></tr>
    <tr><td>7</td><td>BR-10: ${c('>= toDay(until)')}</td><td>the last day of term loses its class</td></tr>
    <tr><td>8</td><td>BR-10: no holiday check</td><td>a class is booked on a holiday</td></tr></table>`, 1.02) },
  { t: 'The first attempt: green, and 1/8', body: vt(YEU, { title: 'terminal — real clock, toBeGreaterThan, counting dates', fs: 13.5 }) +
    two(box('Why #1–#4 live', `${c('toBeGreaterThan(0)')} is true for every wrong price. No 40/41 seats, no 4 h, no 262,500, no Sunday.`, 'do2'),
      box('Why #5–#7 live', `${c('dates.length')} is 3 even a week late; nobody tries 15 weeks or the last day of term.`, 'do2')) },
  { t: 'The reference: three green lines, 8/8', body: vt(REF, { title: 'terminal — the grader on the reference solution (26 tests, ~6 s)', fs: 14 }) +
    vt(TRUOT, { title: 'the pin at work — a reviewer “simplifies” the wrapper to !!club.member', fs: 13 }) +
    box('Why it is red', `v0 says ${c('== true')}: ${c('1')} is a member, ${c("'yes'")} is not. ${c("!!'yes'")} would give one club 20% off.`, 'xanh') },
  { t: 'Rubric (10 points, pass 7)', to: true, body: zm(`<table class="t"><tr><th>Criterion</th><th>Points</th></tr>
    <tr><td>8 mutants (0.5 each)</td><td>4</td></tr>
    <tr><td>TDD evidence: each weeklyDates test red before its code (log or commits)</td><td>1.5</td></tr>
    <tr><td>Pin with a fixed clock, LF-212 and NaN included</td><td>1.5</td></tr>
    <tr><td>Characterization unchanged, green on v0 and on the refactor</td><td>1.5</td></tr>
    <tr><td>Exact assertions; names state the boundary</td><td>1</td></tr>
    <tr><td>No real clock, no shared state</td><td>0.5</td></tr></table>`, 1.08) },
  { t: 'Hints, from light to strong', to: true, giua: true, body: steps([
      `Characterize: fixed clock, expect ${c('0')}, copy the real number from the failure`,
      'Rows: 40/41 seats · 3.5/4 h · AL 30 min on Sunday · Saturday quote for a Wednesday event · unknown building',
      `BR-10 test list first: 3 weeks · holiday · ends on ${c('until')} · 1, 15, 0, 16, 2.5 weeks · start after term · Dec → Jan`,
      `Compare whole objects with ${c('toEqual')}; keep v0’s order of operations in the refactor`,
    ]) },
  { t: 'Before you call it done', to: true, giua: true, body: `<ul>
    <li>${c('node scripts/dot-bien-10.mjs')}: three ✔ lines and <b>8/8 mutants killed</b></li>
    <li>${c('lab10/TDD-LOG.md')} or ${c('git log')}: every weeklyDates test red before its code</li>
    <li>The characterization file has not changed since Job A; LF-212 and NaN are pinned, not fixed</li>
    <li>No real clock, no ${c('toBeGreaterThan')} instead of a known number; ${c('npm run test:unit')} green</li></ul>` },
]);
