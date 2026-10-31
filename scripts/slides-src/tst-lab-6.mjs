/**
 * tst-lab-6 — Testing · Chapter 6 · Lab 6 "React components: kill 8 mutants" (01/11/2026). Slug bài: tst-6-5-lab-react.
 * Output = chạy thật: bộ yếu 4 test xanh → 1/8; lời giải 16 test → 8/8; npm run test:unit vẫn 85 xanh.
 */
import { lamDeck, vt, two, box, steps, c, zm } from './_tst-chung.mjs';

export const deck = { key: 'tst-lab-6', code: 'TST Lab 6', title: 'Lab 6 — React components', sub: 'kill 8 mutants in a form and a list' };

const WEAK = `✘ SURVIVED  #1 errors are not announced as alerts
✘ SURVIVED  #2 labels no longer point at their inputs
✘ SURVIVED  #3 a double click books twice
✘ SURVIVED  #4 201 seats allowed in the browser
✘ SURVIVED  #5 server field errors are dropped
✔ killed    #6 pending and confirmed messages swapped
✘ SURVIVED  #7 403 shown as a generic failure
✘ SURVIVED  #8 Try again does nothing

1/8 mutants killed`;
const WEAKRUN = ` ✓ web/weak6.test.jsx (4 tests) 62ms
   ✓ submits the form 40ms
   ✓ shows an error for a taken slot 9ms
   ✓ shows the list 8ms
   ✓ shows something when the list fails 4ms`;
const STRONG = `✔ killed    #1 errors are not announced as alerts
✔ killed    #2 labels no longer point at their inputs
✔ killed    #3 a double click books twice
✔ killed    #4 201 seats allowed in the browser
✔ killed    #5 server field errors are dropped
✔ killed    #6 pending and confirmed messages swapped
✔ killed    #7 403 shown as a generic failure
✔ killed    #8 Try again does nothing

8/8 mutants killed`;

export const slides = lamDeck({ chuong: 'Chapter 6 — Testing React components', bai: 'Lab 6' }, [
  { cover: true, t: 'Lab 6 — React components:<br>kill 8 mutants', sub: 'Chapter 6 lab · 75 minutes · graded by a script, not by opinion' },
  { t: 'Your mission', to: true, giua: true, body: steps([
      `Write ${c('web/BookingForm.test.jsx')} and ${c('web/AdminBookings.test.jsx')}`,
      'Query by role and label, type with user-event, wait with findBy',
      `Run ${c('node scripts/dot-bien-6.mjs')}: 8 bugs in the form and the admin list`,
      'A good suite turns red for every one — 8/8 “killed”',
    ]) + box('New this time', 'Two of the bugs are accessibility bugs: nothing looks different on screen, but a screen-reader user loses the error or the label.', 'do2') },
  { t: 'The 8 planted bugs', body: zm(`<table class="t" style="font-size:17px"><tr><th>#</th><th>File</th><th>Planted bug</th><th>What a user would notice</th></tr>
    <tr><td>1</td><td>BookingForm</td><td>${c('role="status"')} for errors too</td><td>screen readers do not interrupt with the error</td></tr>
    <tr><td>2</td><td>BookingForm</td><td>${c('htmlFor={name}')} instead of the input id</td><td>clicking a label does nothing; fields are unnamed</td></tr>
    <tr><td>3</td><td>BookingForm</td><td>button never disabled</td><td>a double click books twice</td></tr>
    <tr><td>4</td><td>BookingForm</td><td>${c('seats > 201')}</td><td>201 seats reach the server</td></tr>
    <tr><td>5</td><td>BookingForm</td><td>server field errors dropped</td><td>the form says nothing after a 400</td></tr>
    <tr><td>6</td><td>BookingForm</td><td>PENDING / CONFIRMED messages swapped</td><td>“Booked” for a booking that waits</td></tr>
    <tr><td>7</td><td>AdminBookings</td><td>403 treated as a failure</td><td>“Try again” for someone who is not an admin</td></tr>
    <tr><td>8</td><td>AdminBookings</td><td>Try again does nothing</td><td>the user is stuck on the error</td></tr></table>`, 1.02) },
  { t: 'A typical first attempt: 1 of 8', body: vt(WEAKRUN, { title: 'npm run test:web — 4 tests, all green', fs: 16 }) +
    two(vt(WEAK, { title: 'node scripts/dot-bien-6.mjs', fs: 12 }), box('Why so little was caught', `${c('querySelector')} + ${c('fireEvent')} never touch a label; ${c('findByText')} ignores roles; one happy path per screen; no 400, no 403, no retry.`, 'do2'), 'r64') },
  { t: 'The reference solution: 8 of 8', body: two(`<div>${vt(STRONG, { title: '16 tests in web/', fs: 12 })}${vt(' Test Files  2 passed (2)\n      Tests  16 passed (16)', { title: 'npm run test:web', fs: 15 })}</div>`, box('What made the difference', `<ul style="font-size:19px"><li>every field found by its label</li><li>${c('findByRole("alert")')} vs ${c('"status"')}</li><li>a held promise + a second click</li><li>seats 0 · 1 · 200 · 201</li><li>400, 409, 422, 500, 403 and retry</li></ul>`, 'xanh'), 'r64') },
  { t: 'Rubric (10 points)', body: zm(`<table class="t"><tr><th>Criterion</th><th>Points</th><th>How it is checked</th></tr>
    <tr><td>Mutants killed</td><td>4 (0.5 each)</td><td>${c('node scripts/dot-bien-6.mjs')}</td></tr>
    <tr><td>Queries by role/label only — no querySelector, no test id</td><td>2</td><td>read the tests</td></tr>
    <tr><td>Every state: busy, 400 on a field, 409/422/500 alerts, 403, empty, retry</td><td>2</td><td>read the tests</td></tr>
    <tr><td>user-event with ${c('await')}; findBy for anything that appears later</td><td>1</td><td>read the tests</td></tr>
    <tr><td>Fast and isolated: cleanup, no real network</td><td>1</td><td>${c('npm run test:web')}</td></tr></table>`, 1.05) },
  { t: 'Hints, from gentle to strong', to: true, body: steps([
      'Find every field with getByLabelText — a broken label then breaks the test',
      `Errors must be ${c("findByRole('alert')")}, successes ${c("findByRole('status')")}`,
      `Hold the answer with ${c('deferred()')} and click the busy button again`,
      'Seats on both sides of both limits: 0, 1, 200, 201',
      `A stub client answering 500 then 200 tests “Try again”`,
    ]) },
  { t: 'Before you call it done', to: true, giua: true, body: `<ul>
    <li>${c('npm run test:web')} green; ${c('npm run test:unit')} still 85 green</li>
    <li>${c('node scripts/dot-bien-6.mjs')} prints <b>8/8 mutants killed</b></li>
    <li>No ${c('querySelector')} or ${c('getByTestId')} in your tests</li>
    <li>${c('git diff web/')} shows only test files</li>
    <li>Commit: ${c('test: LabFlow Lite React screens (Lab 6, 8/8)')}</li></ul>` },
]);
