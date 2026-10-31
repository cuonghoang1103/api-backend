/**
 * tst-lab-1 — Testing · Chapter 1 · Lab 1 "Test the LabFlow Lite rules — kill 8 mutants" (01/11/2026). Slug bài: tst-1-5-lab-quy-tac.
 * Output = chạy thật: bộ test yếu (1/8) và lời giải (8/8, 40 test) với scripts/dot-bien.mjs.
 */
import { lamDeck, js, vt, two, box, steps, c, zm, flow } from './_tst-chung.mjs';

export const deck = { key: 'tst-lab-1', code: 'TST Lab 1', title: 'Lab 1 — kill 8 mutants', sub: 'Test the LabFlow Lite rules' };

const WEAK = `$ node scripts/dot-bien.mjs
✘ SURVIVED  #1 BR-05: 14 days ahead rejected
✘ SURVIVED  #2 BR-06: 30 seats needs approval
✘ SURVIVED  #3 slot ending at 21:00 rejected
✘ SURVIVED  #4 exactly 4 hours rejected
✘ SURVIVED  #5 zero-length slot accepted
✘ SURVIVED  #6 ADMIN needs approval
✘ SURVIVED  #7 "24:00" accepted
✔ killed    #8 formatTime rounds the hour

1/8 mutants killed`;
const STRONG = `$ node scripts/dot-bien.mjs
✔ killed    #1 BR-05: 14 days ahead rejected
✔ killed    #2 BR-06: 30 seats needs approval
✔ killed    #3 slot ending at 21:00 rejected
✔ killed    #4 exactly 4 hours rejected
✔ killed    #5 zero-length slot accepted
✔ killed    #6 ADMIN needs approval
✔ killed    #7 "24:00" accepted
✔ killed    #8 formatTime rounds the hour

8/8 mutants killed`;

export const slides = lamDeck({ chuong: 'Chapter 1 — Your first unit tests', bai: 'Lab 1' }, [
  { cover: true, t: 'Lab 1 — test the rules,<br>kill 8 mutants', sub: 'Chapter 1 lab · 60–90 minutes · graded by a script, not by opinion' },
  { t: 'Your mission', to: true, giua: true, body: steps([
      `Write ${c('src/rules/booking.test.js')} and ${c('src/rules/time.test.js')} for LabFlow Lite’s rules`,
      `Everything must be green on the real code`,
      `Then run ${c('node scripts/dot-bien.mjs')}: it plants 8 bugs, one at a time`,
      `A good suite turns red for <b>every</b> planted bug — 8/8 “killed”`,
    ]) + box('Why this way', 'Coverage tells you which lines ran. Mutation testing tells you whether your tests would <b>notice</b> if those lines were wrong.', 'lam') },
  { t: 'The rules under test', body: `<table class="t"><tr><th>Function</th><th>Rule</th></tr>
    <tr><td>${c('checkSlot(start, end)')}</td><td>30-minute grid · end after start · inside 07:00–21:00 · at most 240 minutes</td></tr>
    <tr><td>${c('isWithinBookingWindow(days)')}</td><td>integer from 0 to 14 (BR-05)</td></tr>
    <tr><td>${c('needsApproval({ seats, role })')}</td><td>seats a positive integer · lecturers/admins never · students above 30 (BR-06)</td></tr>
    <tr><td>${c('createBooking(input)')}</td><td>combines the two; throws the rule code on a bad slot</td></tr>
    <tr><td>${c('parseTime')} · ${c('formatTime')}</td><td>"HH:MM" ↔ minutes; TypeError / RangeError for bad input</td></tr></table>` +
    box('Source', 'The code is in lessons 0.3 and 1.1. Do not change it — the mutation script searches for exact lines.', 'do2') },
  { t: 'How the mutation check works', body: flow([
      { t: 'Plant 1 bug', s: 'edit one line', mau: '#c0392b' },
      { t: 'Run your tests', s: 'vitest run src/', mau: '#336791' },
      { t: 'Red? killed ✔', s: 'green? survived ✘', mau: '#e08a1e' },
      { t: 'Restore', s: 'always, even on error', mau: '#2f7d4f' },
    ], { h: 130, fs: 22 }) + `<table class="t" style="font-size:17px"><tr><th>#</th><th>File</th><th>Original line contains</th><th>Planted bug</th></tr><tr><td>1</td><td>booking.js</td><td>${c('daysAhead <= MAX_DAYS_AHEAD')}</td><td>${c('daysAhead < MAX_DAYS_AHEAD')}</td></tr><tr><td>2</td><td>booking.js</td><td>${c('return seats > APPROVAL_SEATS;')}</td><td>${c('return seats >= APPROVAL_SEATS;')}</td></tr><tr><td>3</td><td>booking.js</td><td>${c('e > CLOSE')}</td><td>${c('e >= CLOSE')}</td></tr><tr><td>4</td><td>booking.js</td><td>${c('e - s > MAX_MINUTES')}</td><td>${c('e - s >= MAX_MINUTES')}</td></tr><tr><td>5</td><td>booking.js</td><td>${c('if (e <= s)')}</td><td>${c('if (e < s)')}</td></tr><tr><td>6</td><td>booking.js</td><td>${c("role === 'LECTURER' || role === 'ADMIN'")}</td><td>${c("role === 'LECTURER'")}</td></tr><tr><td>7</td><td>time.js</td><td>${c('h > 23')}</td><td>${c('h > 24')}</td></tr><tr><td>8</td><td>time.js</td><td>${c('Math.floor(minutes / 60)')}</td><td>${c('Math.round(minutes / 60)')}</td></tr></table>` },
  { t: 'A typical first attempt: 1 of 8', body: two(vt(WEAK, { title: 'two happy-path tests for checkSlot + the 0.3 time tests' }), `<div>${box('Green is not enough', `The suite was <b>green</b> — 5 tests passed. Yet 7 of 8 bugs would reach users unnoticed.`, 'do2')}${box('Read each survivor', `Every ✘ names a rule and a boundary you did not test: 14 days, 30 seats, 21:00, 240 minutes, a zero-length slot, ADMIN, 24:00.`, 'lam')}</div>`, 'r64') },
  { t: 'The reference solution: 8 of 8', body: two(vt(STRONG, { title: '40 tests: boundaries, decision table, invalid input, a property' }), `<div>${box('What made the difference', `<ul style="font-size:19px"><li>boundary rows: 07:00, 21:00, 30 min, 240 min, 0 min</li><li>BVA for 14 days and 30/31 seats</li><li>every role in the decision table</li><li>bad times: “24:00”, “07:60”, “7:00”</li><li>the round-trip property</li></ul>`, 'xanh')}</div>`, 'r64') },
  { t: 'Rubric (10 points)', body: zm(`<table class="t"><tr><th>Criterion</th><th>Points</th><th>How it is checked</th></tr>
    <tr><td>Mutants killed</td><td>4 (0.5 each)</td><td>${c('node scripts/dot-bien.mjs')}</td></tr>
    <tr><td>Boundary values for every limit (14 d, 30 seats, 07:00/21:00, 240 min)</td><td>2</td><td>read the tables</td></tr>
    <tr><td>Invalid input with the right error class (seats 0/2.5, bad times, non-integer days)</td><td>1</td><td>${c('toThrow(RangeError | TypeError)')}</td></tr>
    <tr><td>Names and structure: describe per function, it.each for tables, names state rule + result</td><td>2</td><td>read the report tree</td></tr>
    <tr><td>Hygiene: green on real code, no ${c('.only')}/${c('.skip')}, every test asserts, under 1 s</td><td>1</td><td>${c('npm test')} with ${c('requireAssertions')}</td></tr></table>`, 1.05) +
    box('Pass mark', '7/10. Aim for 10: every point here is a habit you will use at work.', 'xanh') },
  { t: 'Hints, from gentle to strong', to: true, body: steps([
      'Write the rules as a list of sentences first; each sentence is a test name',
      'For every number in a rule, write the value on it and one step either side',
      `For ${c('needsApproval')}, draw the 3 × 2 decision table before coding`,
      'Run the mutation script early; read each survivor as “the test I forgot”',
      'Still stuck: compare with the reference solution at the end of the lesson — after trying',
    ]) },
  { t: 'Before you call it done', to: true, giua: true, body: `<ul>
    <li>${c('npm test')} green on the real code, no ${c('.only')} or ${c('.skip')}</li>
    <li>${c('node scripts/dot-bien.mjs')} prints <b>8/8 mutants killed</b></li>
    <li>${c('git diff src/rules/booking.js src/rules/time.js')} is empty — the script restored everything</li>
    <li>The report tree reads like the rules list</li>
    <li>Commit: ${c('test: rules suite for LabFlow Lite (8/8 mutants)')}</li></ul>` },
]);
