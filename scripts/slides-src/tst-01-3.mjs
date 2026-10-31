/**
 * tst-01-3 — Testing · Chapter 1 · Lesson 1.3 "Naming and organising tests" (01/11/2026). Slug bài: tst-1-3-ten-test.
 * Output = chạy thật Vitest 5.0.5 (demo/ten, ten-xau với bug BR-05 cài tạm, th13 trước/sau, .only có/không CI=true).
 */
import { lamDeck, js, vt, two, box, steps, cards, c, zm, vsd } from './_tst-chung.mjs';

export const deck = { key: 'tst-01-3', code: 'TST 1.3', title: 'Naming and organising tests', sub: 'Names are documentation' };

const BAD = ` FAIL  demo/ten-xau.test.js > test 2
AssertionError: expected false to be true // Object.is equality`;
const GOOD = ` FAIL  demo/bien.test.js > isWithinBookingWindow (BR-05: at most 14 days ahead) > 14 days ahead → true
AssertionError: expected false to be true // Object.is equality`;
const TREE = ` ✓ demo/ten.test.js (7 tests | 1 todo) 3ms
   ✓ checkSlot (7)
     ✓ when the slot is valid (1)
       ✓ returns ok with the length in minutes 1ms
     ✓ when the slot breaks a rule (5)
       ✓ rejects 06:30–08:00 with OUTSIDE_HOURS 0ms
       ✓ rejects 20:00–21:30 with OUTSIDE_HOURS 0ms
       ✓ rejects 08:15–09:00 with OFF_GRID 0ms
       ✓ rejects 10:00–09:00 with END_BEFORE_START 0ms
       ✓ rejects 08:00–12:30 with TOO_LONG 0ms
     □ rejects a slot on a day the lab is closed`;
const BEFORE = ` ✓ demo/th13-truoc.test.js (5 tests) 2ms
   ✓ test 1 1ms
   ✓ test 2 0ms
   ✓ test 3 0ms
   ✓ test 4 0ms
   ✓ test 5 0ms`;
const AFTER = ` ✓ demo/th13-sau.test.js (5 tests) 2ms
   ✓ parseTime (5)
     ✓ converts 00:00 to 0 minutes 1ms
     ✓ converts 07:00 to 420 minutes 0ms
     ✓ converts 12:30 to 750 minutes 0ms
     ✓ converts 21:00 to 1260 minutes 0ms
     ✓ converts 23:59 to 1439 minutes 0ms`;
const ONLY_CI = `$ CI=true npx vitest run demo/ten.test.js
 ❯ demo/ten.test.js (7 tests | 1 failed | 5 skipped | 1 todo) 1ms
       × returns ok with the length in minutes

 FAIL  demo/ten.test.js > checkSlot > when the slot is valid > returns ok…
Error: [Vitest] Unexpected .only modifier. Remove it or pass --allowOnly argument to bypass this error`;
const ONLY_LOCAL = `$ npx vitest run demo/ten.test.js
 ✓ demo/ten.test.js (7 tests | 5 skipped | 1 todo) 2ms
       ✓ returns ok with the length in minutes 1ms
       ↓ rejects 06:30–08:00 with OUTSIDE_HOURS
       ↓ …
      Tests  1 passed | 5 skipped | 1 todo (7)`;

export const slides = lamDeck({ chuong: 'Chapter 1 — Your first unit tests', bai: '1.3' }, [
  { cover: true, t: 'Naming and<br>organising tests', sub: 'Chapter 1 · Lesson 1.3 — names are documentation, tables replace copy-paste' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Why a test name is the first thing you read when CI is red</li>
    <li>A naming pattern: unit › situation › expected result</li>
    <li>Nesting ${c('describe')} so the report reads like a specification</li>
    <li>${c('it.each')}: one table instead of five copy-pasted tests</li>
    <li>${c('todo')}, ${c('skip')}, ${c('only')} — and the ${c('.only')} that CI rejects</li>
    <li>Where test files live, and how one file is organised</li></ul>` },
  { t: 'The same bug, two names', body: vt(BAD, { title: '✗ name: “test 2” — what broke? open the file to find out' }) + vt(GOOD, { title: '✓ name: what the rule says — the red line is already the diagnosis', fs: 13 }) +
    box('Same planted bug', `${c('daysAhead < MAX_DAYS_AHEAD')} instead of ${c('<=')}. Left: you must open the file. Right: “14 days ahead → true” and “BR-05” tell you the rule and the boundary before you open anything.`, 'lam') },
  { t: 'A naming pattern that works', body: `<table class="t"><tr><th>Part</th><th>Where it goes</th><th>Example</th></tr>
    <tr><td><b>Unit</b> under test</td><td>outer ${c('describe')}</td><td>${c("describe('checkSlot')")}</td></tr>
    <tr><td><b>Situation</b> / input</td><td>inner ${c('describe')} or the start of ${c('it')}</td><td>${c("describe('when the slot breaks a rule')")}</td></tr>
    <tr><td><b>Expected</b> result</td><td>${c('it')}, as a sentence</td><td>${c("it('rejects 06:30–08:00 with OUTSIDE_HOURS')")}</td></tr></table>` +
    two(box('Avoid', `<ul style="font-size:19px"><li>“test 1”, “works”, “should work”</li><li>the function name only: “checkSlot”</li><li>how, not what: “calls parseTime twice”</li></ul>`, 'do2'),
      box('Prefer', `<ul style="font-size:19px"><li>the rule in plain words</li><li>the boundary value in the name</li><li>the expected code / status / number</li></ul>`, 'xanh')) },
  { t: 'Nested describe: the report reads like a spec', body: two(js(`describe('checkSlot', () => {
  describe('when the slot is valid', () => {
    it('returns ok with the length in minutes', …);
  });

  describe('when the slot breaks a rule', () => {
    it.each([ … five rows … ])(
      'rejects $start–$end with $code', …);
  });

  it.todo('rejects a slot on a day the lab is closed');
});`, { sm: true }), vt(TREE, { title: 'npx vitest run demo/ten.test.js' })) +
    box('Two levels are enough', `Unit, then situation. Three or more nested ${c('describe')} usually means the test file is doing too much.`, 'lam') },
  { t: 'it.each: one table, many tests', body: two(js(`// rows as arrays → %s %i %j in the name
it.each([
  ['00:00', 0],
  ['07:00', 420],
  ['23:59', 1439],
])('converts %s to %i minutes', (text, minutes) => {
  expect(parseTime(text)).toBe(minutes);
});`, { sm: true }), js(`// rows as objects → $name in the name
it.each([
  { start: '06:30', end: '08:00', code: 'OUTSIDE_HOURS' },
  { start: '08:15', end: '09:00', code: 'OFF_GRID' },
])('rejects $start–$end with $code',
  ({ start, end, code }) => {
    expect(checkSlot(start, end))
      .toEqual({ ok: false, code });
  });`, { sm: true }).replace('<pre class="vs sm">', '<pre class="vs sm" style="font-size:14px">')) +
    box('Why it matters', `Each row becomes a <b>separate test</b> with its own name and its own red line. Adding a case = adding a row. Objects with ${c('$name')} read better than ${c('%s')} once there are 3+ columns.`, 'xanh') +
    box('Name placeholders', `${c('%s')} string · ${c('%i')} integer · ${c('%j')} JSON · ${c('%#')} row index · ${c('$start')} a property of the row object`, 'lam') },
  { t: 'Before and after: five copy-pasted tests → one table', body: two(vt(BEFORE, { title: 'before: test 1 … test 5' }), vt(AFTER, { title: 'after: it.each with a name template' })) +
    box('Same five checks, same speed', 'Only the readability changed — and the next person can add row six in ten seconds.', 'lam') },
  { t: 'todo, skip, only', body: `<table class="t"><tr><th>Modifier</th><th>Meaning</th><th>Report shows</th><th>Safe to commit?</th></tr>
    <tr><td>${c("it.todo('…')")}</td><td>a test you still have to write</td><td>□ todo</td><td>yes — it is a reminder</td></tr>
    <tr><td>${c('it.skip(…)')}</td><td>temporarily not run</td><td>↓ skipped</td><td>with a comment and a ticket</td></tr>
    <tr><td>${c('it.only(…)')}</td><td>run only this one (and other .only)</td><td>everything else ↓</td><td><b>never</b></td></tr></table>` +
    box('Why .only is dangerous', 'Locally it silently skips every other test — the run is green and proves almost nothing.', 'do2') },
  { t: '.only: silent locally, a hard error in CI', body: vt(ONLY_LOCAL, { title: 'on your laptop' }) + vt(ONLY_CI, { title: 'with CI=true (as on GitHub Actions)', fs: 13 }) +
    box('Vitest protects you', `In CI, Vitest refuses ${c('.only')} (the ${c('allowOnly')} option defaults to off there). Locally, nothing stops you — check ${c('git diff')} before committing.`, 'lam') },
  { t: 'Where test files live', body: two(box('Next to the code (this course)', `${js(`src/rules/
├─ booking.js
├─ booking.test.js
├─ time.js
└─ time.test.js`, { lang: 'text' })}<p style="font-size:19px;margin-top:8px">Easy to find, easy to move together, imports are short (${c("'./booking.js'")}).</p>`, 'xanh'),
      box('A separate test/ folder', `${js(`src/rules/booking.js
test/rules/booking.test.js
test/api/bookings.test.js`, { lang: 'text' })}<p style="font-size:19px;margin-top:8px">Common for integration/e2e tests. Vitest finds both: any ${c('*.test.*')} / ${c('*.spec.*')} outside ${c('node_modules')}.</p>`, 'lam')) },
  { t: 'Inside one test file', body: steps([
      `<b>Imports</b> first: ${c('vitest')}, then the code under test`,
      `<b>One ${c('describe')} per exported function</b>, in the same order as the source file`,
      `<b>Shared test data</b> as ${c('const')} at the top of the describe — or ${c('beforeEach')} when each test must get a fresh copy`,
      `<b>Happy path first</b>, then each rule violation, then invalid input`,
      `<b>Helpers</b> (e.g. ${c('makeBooking({ seats: 31 })')}) when the same Arrange repeats three times or more`,
    ]) + box('Goal', 'A newcomer reads the file top to bottom and learns the rules of the module.', 'xanh') },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      `Plant ${c('daysAhead < MAX_DAYS_AHEAD')} and compare the red lines of “test 2” and a well-named test`,
      `Turn the five copy-pasted ${c('parseTime')} tests into one ${c('it.each')} with a name template`,
      `Add ${c('it.todo')} for a rule you have not tested yet`,
      `Add ${c('.only')} to one test, run with ${c('CI=true')}, read the error, remove it`,
    ]) + box('Done when', `The report shows <b>converts 07:00 to 420 minutes</b>-style names, one □ todo, and the ${c('.only')} is gone from your diff.`, 'xanh') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>A test name is the first line you read when CI is red — make it the diagnosis</li>
    <li>Unit › situation › expected result; put the boundary in the name</li>
    <li>Two levels of ${c('describe')} are usually enough</li>
    <li>${c('it.each')} turns copy-paste into a table; every row is its own test</li>
    <li>${c('todo')} is fine, ${c('skip')} needs a reason, ${c('only')} never gets committed</li>
    <li>Test files next to the code; one describe per function</li></ul>` },
]);
