/**
 * tst-01-4 — Testing · Chapter 1 · Lesson 1.4 "Pure functions and edge cases" (01/11/2026). Slug bài: tst-1-4-ham-thuan.
 * Output = chạy thật Vitest 5.0.5 + fast-check 4.10.2 (bug cài tạm: < 14; Math.round trong formatTime).
 */
import { lamDeck, js, vt, two, box, steps, c, zm, vsd } from './_tst-chung.mjs';

export const deck = { key: 'tst-01-4', code: 'TST 1.4', title: 'Pure functions and edge cases', sub: 'EP · BVA · decision tables · properties' };

/** Trục số cho BR-05: các phân vùng và điểm biên. */
const truc = (opts = {}) => {
  const { diem = false } = opts;
  const W = 1110, H = diem ? 230 : 200, y = 110, x0 = 80, x1 = 1030, lo = -3, hi = 18;
  const X = (v) => x0 + (v - lo) * (x1 - x0) / (hi - lo);
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial">`;
  s += `<rect x="${x0}" y="${y - 26}" width="${X(-0.5) - x0}" height="52" fill="#c0392b22" stroke="#c0392b" stroke-width="2"/>`;
  s += `<rect x="${X(-0.5)}" y="${y - 26}" width="${X(14.5) - X(-0.5)}" height="52" fill="#2f7d4f22" stroke="#2f7d4f" stroke-width="2"/>`;
  s += `<rect x="${X(14.5)}" y="${y - 26}" width="${x1 - X(14.5)}" height="52" fill="#c0392b22" stroke="#c0392b" stroke-width="2"/>`;
  s += `<text x="${(x0 + X(-0.5)) / 2}" y="${y - 40}" text-anchor="middle" font-size="19" font-weight="800" fill="#a52a1d">invalid: &lt; 0</text>`;
  s += `<text x="${(X(-0.5) + X(14.5)) / 2}" y="${y - 40}" text-anchor="middle" font-size="19" font-weight="800" fill="#1f6b40">valid: 0 … 14 days ahead</text>`;
  s += `<text x="${(X(14.5) + x1) / 2}" y="${y - 40}" text-anchor="middle" font-size="19" font-weight="800" fill="#a52a1d">invalid: &gt; 14</text>`;
  for (let v = lo; v <= hi; v++) {
    s += `<line x1="${X(v)}" y1="${y + 26}" x2="${X(v)}" y2="${y + 34}" stroke="#888" stroke-width="1.5"/>`;
    if (v % 1 === 0 && (v === 0 || v === 14 || v === -1 || v === 15 || v === 1 || v === 13 || v === 7)) s += `<text x="${X(v)}" y="${y + 54}" text-anchor="middle" font-size="16" fill="#555">${v}</text>`;
  }
  if (diem) {
    for (const v of [-1, 0, 1, 13, 14, 15]) {
      const ok = v >= 0 && v <= 14;
      s += `<circle cx="${X(v)}" cy="${y}" r="12" fill="${ok ? '#2f7d4f' : '#c0392b'}" stroke="#fff" stroke-width="3"/>`;
    }
    s += `<text x="${X(7)}" y="${y + 92}" text-anchor="middle" font-size="18" fill="#333">BVA points: −1 · 0 · 1 · 13 · 14 · 15 — on each boundary and one step either side</text>`;
  } else {
    for (const v of [-2, 7, 16]) s += `<circle cx="${X(v)}" cy="${y}" r="12" fill="#336791" stroke="#fff" stroke-width="3"/>`;
    s += `<text x="${X(7)}" y="${y + 84}" text-anchor="middle" font-size="18" fill="#333">EP: one value per partition is enough to represent it (e.g. −2 · 7 · 16)</text>`;
  }
  return s + '</svg>';
};

const BUG = ` ❯ demo/bien.test.js (19 tests | 1 failed | 9 skipped) 7ms
   ❯ isWithinBookingWindow (BR-05: at most 14 days ahead) (10)
     ✓ -1 days ahead → false 1ms
     ✓ 0 days ahead → true 0ms
     ✓ 1 days ahead → true 0ms
     ✓ 13 days ahead → true 0ms
     × 14 days ahead → true 3ms
     ✓ 15 days ahead → false 0ms
…
AssertionError: expected false to be true // Object.is equality`;
const PROP_BUG = ` FAIL  demo/thuoc-tinh.test.js > formatTime then parseTime gives back the same minute (0..1439)
Error: Property failed after 8 tests
{ seed: 981865028, path: "7:4", endOnFailure: true }
Counterexample: [390]
Shrunk 1 time(s)`;

export const slides = lamDeck({ chuong: 'Chapter 1 — Your first unit tests', bai: '1.4' }, [
  { cover: true, t: 'Pure functions<br>and edge cases', sub: 'Chapter 1 · Lesson 1.4 — equivalence partitions, boundaries, decision tables, properties' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Why pure functions are the cheapest code to test</li>
    <li><b>Equivalence partitioning</b>: one value per class of inputs</li>
    <li><b>Boundary value analysis</b>: where off-by-one bugs live — caught for real</li>
    <li>Invalid inputs: ${c('1.5')}, ${c('NaN')}, ${c("'3'")}, ${c('null')}</li>
    <li><b>Decision tables</b> turned into ${c('it.each')}</li>
    <li><b>Property-based testing</b> with fast-check: let the machine find the counterexample</li></ul>` },
  { t: 'Pure functions: the easiest code to test', body: vsd(
      `<p style="font-size:21px"><b>Same input → same output</b>, and nothing else changes.</p><ul style="font-size:20px"><li>${c('checkSlot')}, ${c('isWithinBookingWindow')}</li><li>${c('needsApproval')}, ${c('parseTime')}</li><li>no clock, no database, no network</li></ul><p style="font-size:20px">Test = call it with a value, compare. Milliseconds.</p>`,
      `<p style="font-size:21px">Reads or changes the <b>outside world</b>.</p><ul style="font-size:20px"><li>${c('Date.now()')}, ${c('Math.random()')}</li><li>saving to PostgreSQL, sending e-mail</li><li>calling another API</li></ul><p style="font-size:20px">Needs control of time, fakes or a real database — Chapters 2, 3, 4.</p>`,
      '✓ Pure', '⚠ Impure') + box('Design tip', 'Keep the rules pure and push the impure parts to the edges. LabFlow Lite’s rules take “days ahead” as a number instead of reading today’s date — so they are trivial to test.', 'xanh') },
  { t: 'Equivalence partitioning (EP): one value per class', body: truc() + `<table class="t" style="font-size:17px"><tr><th>Partition</th><th>Representative</th><th>Expected</th></tr><tr><td>below the window</td><td>−2</td><td>false</td></tr><tr><td>inside the window</td><td>7</td><td>true</td></tr><tr><td>beyond the window</td><td>16</td><td>false</td></tr><tr><td>not an integer</td><td>1.5 · NaN · '3' · null</td><td>false</td></tr></table>` + box('BR-05: at most 14 days ahead', `Values in one partition behave the same, so one value represents the whole partition: four partitions ⇒ at least four tests.`, 'lam') },
  { t: 'Boundary value analysis (BVA): bugs live at the edges', body: truc({ diem: true }) + `<table class="t"><tr><th>Boundary</th><th>Values tested</th><th>Catches</th></tr><tr><td>lower (0 = today)</td><td>−1 · 0 · 1</td><td>${c('> 0')} instead of ${c('>= 0')}</td></tr><tr><td>upper (14)</td><td>13 · 14 · 15</td><td>${c('< 14')} instead of ${c('<= 14')}</td></tr></table>` + box('Why the edges', `Developers write ${c('<')} where they meant ${c('<=')}, or start counting at 1 instead of 0. Those mistakes change behaviour <b>only</b> at the boundary — 7 or 16 would never catch them.`, 'do2') },
  { t: 'The six boundary values as one table', body: js(`describe('isWithinBookingWindow (BR-05: at most 14 days ahead)', () => {
  it.each([
    [-1, false],   // lower boundary - 1
    [0, true],     // lower boundary: today
    [1, true],     // lower boundary + 1
    [13, true],    // upper boundary - 1
    [14, true],    // upper boundary: "exactly 14 is still valid"
    [15, false],   // upper boundary + 1
  ])('%i days ahead → %s', (days, expected) => {
    expect(isWithinBookingWindow(days)).toBe(expected);
  });
});`, { hl: [7] }) },
  { t: 'Caught for real: the off-by-one at 14', body: two(vt(BUG, { title: 'with daysAhead < MAX_DAYS_AHEAD planted' }), `<div>${box('One row red', `Only the row on the boundary fails. A test with 7 days passes with both the right and the wrong code.`, 'do2')}${box('Same as SWT301', `This is the BVA you practise for the PE — two-value (on + outside) or three-value boundaries — now executed automatically on every save.`, 'lam')}</div>`, 'r64') },
  { t: 'Invalid inputs are a partition too', body: two(js(`it.each([1.5, NaN, '3', null])(
  'rejects a non-integer input: %s',
  (value) => {
    expect(isWithinBookingWindow(value)).toBe(false);
  });

export function isWithinBookingWindow(daysAhead) {
  return Number.isInteger(daysAhead)
    && daysAhead >= 0
    && daysAhead <= MAX_DAYS_AHEAD;
}`, { hl: [8] }), `<div style="font-size:20px">${steps([
      `${c('1.5')} — a fraction of a day`,
      `${c('NaN')} — what ${c("Number('abc')")} gives you`,
      `${c("'3'")} — a string from a form field`,
      `${c('null')} — a missing value`,
    ])}${box('Why it matters', `Without ${c('Number.isInteger')}, ${c("'3' <= 14")} is ${c('true')} in JavaScript (the string is converted). These rows prove the guard exists.`, 'do2')}</div>`, 'r64') },
  { t: 'checkSlot: partitions and boundaries per rule', body: zm(`<table class="t"><tr><th>Rule</th><th>Valid side (boundary)</th><th>Invalid side (boundary)</th><th>Expected code</th></tr>
    <tr><td>Grid 30 min</td><td>08:00, 08:30</td><td>08:15 (start), 09:10 (end)</td><td>${c('OFF_GRID')}</td></tr>
    <tr><td>End after start</td><td>08:00–08:30 (30 min)</td><td>09:00–09:00 (0 min), 10:00–09:00</td><td>${c('END_BEFORE_START')}</td></tr>
    <tr><td>Opening hours</td><td>07:00–08:00, 20:00–21:00</td><td>06:30–08:00, 20:00–21:30</td><td>${c('OUTSIDE_HOURS')}</td></tr>
    <tr><td>Max 4 hours</td><td>08:00–12:00 (240)</td><td>08:00–12:30 (270)</td><td>${c('TOO_LONG')}</td></tr></table>`, 1.12) +
    box('On a 30-minute grid', 'The “one step outside” value is 30 minutes away, not 1 minute: 240 → 270, 21:00 → 21:30. Choose boundaries in the units the rule really uses.', 'lam') },
  { t: 'Decision table: two conditions → one action', body: zm(`<table class="t"><tr><th>Rule #</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th></tr>
    <tr><td><b>C1</b> role</td><td>STUDENT</td><td>STUDENT</td><td>LECTURER</td><td>LECTURER</td><td>ADMIN</td><td>ADMIN</td></tr>
    <tr><td><b>C2</b> seats &gt; 30?</td><td>no (30)</td><td>yes (31)</td><td>no (30)</td><td>yes (31)</td><td>no (30)</td><td>yes (31)</td></tr>
    <tr><td><b>A</b> needs approval</td><td>✗</td><td class="c">✓</td><td>✗</td><td>✗</td><td>✗</td><td>✗</td></tr></table>`, 1.15) +
    box('Read it', `Only one combination needs approval: a student with more than 30 seats. Choose the seat values <b>at the boundary</b> (30 and 31), so each column also tests BR-06’s edge.`, 'lam') },
  { t: 'Decision table → it.each, column by column', body: js(`describe('needsApproval — decision table (role × seats > 30)', () => {
  it.each([
    { role: 'STUDENT', seats: 30, expected: false },
    { role: 'STUDENT', seats: 31, expected: true },
    { role: 'LECTURER', seats: 30, expected: false },
    { role: 'LECTURER', seats: 31, expected: false },
    { role: 'ADMIN', seats: 30, expected: false },
    { role: 'ADMIN', seats: 31, expected: false },
  ])('$role with $seats seats → $expected', ({ role, seats, expected }) => {
    expect(needsApproval({ role, seats })).toBe(expected);
  });
});`) + box('One row per column', 'If the business adds a role, the table gets two rows — and the review shows exactly which combinations are covered.', 'xanh') },
  { t: 'Property-based testing: state a rule, let the machine pick inputs', body: two(js(`import fc from 'fast-check';

it('formatTime then parseTime gives back the same minute', () => {
  fc.assert(
    fc.property(fc.integer({ min: 0, max: 1439 }), (minutes) => {
      return parseTime(formatTime(minutes)) === minutes;
    }),
  );
});`, { sm: true }), `<div style="font-size:20px">${steps([
      `Describe <b>all</b> valid inputs: integers 0 … 1439`,
      `State a <b>property</b> true for every one: format then parse is a round trip`,
      `fast-check tries 100 random inputs (by default)`,
      `On failure it <b>shrinks</b> to a simpler counterexample and prints the seed`,
    ])}</div>`, 'r64') + box('Set up once', `${c('npm install --save-dev fast-check@4')} — it works inside any Vitest ${c('it')}. Properties complement examples; they do not replace them.`, 'lam') },
  { t: 'The counterexample, found automatically', body: vt(PROP_BUG, { title: 'with Math.round instead of Math.floor in formatTime', fs: 15 }) +
    two(box('Read it', `${c('formatTime(390)')}: 390 / 60 = 6.5, rounded to 7 ⇒ ${c("'07:30'")} ⇒ parsed back as 450, not 390.`, 'do2'),
      box('Reproduce it', `Random inputs differ each run; the <b>seed</b> replays this exact run: ${c('fc.assert(…, { seed: 981865028, path: "7:4" })')}.`, 'lam')) +
    box('Shrinking', `After the first failure fast-check tries smaller inputs that still fail. Another run of the same test reported ${c('[30]')} — ${c("formatTime(30)")} gives ${c("'01:30'")} — equally wrong, and simpler to debug.`, 'xanh') },
  { t: 'Which technique for which rule?', body: `<table class="t"><tr><th>Technique</th><th>Use it for</th><th>LabFlow Lite example</th></tr>
    <tr><td><b>Equivalence partitions</b></td><td>ranges and categories</td><td>days ahead: &lt; 0 · 0–14 · &gt; 14 · non-integer</td></tr>
    <tr><td><b>Boundary values</b></td><td>every ${c('<')}, ${c('<=')}, ${c('>')}, limit</td><td>−1 0 1 13 14 15 · 30/31 seats · 240/270 min</td></tr>
    <tr><td><b>Decision table</b></td><td>combinations of conditions</td><td>role × seats &gt; 30</td></tr>
    <tr><td><b>Property-based</b></td><td>rules true for all inputs (round trips, invariants)</td><td>format ↔ parse for every minute</td></tr></table>` +
    box('They combine', 'Partitions tell you which classes exist, boundaries pick the values, decision tables handle combinations, properties guard everything in between.', 'xanh') },
  { t: 'Practice (20 minutes)', to: true, body: steps([
      `Design the BVA rows for Lite-1 (at most 240 minutes) on the 30-minute grid`,
      `Write them as one ${c('it.each')} of objects: start, end, expected`,
      `Plant ${c('e - s >= MAX_MINUTES')} and check that exactly one row turns red`,
      `Extra: write a property “${c('checkSlot')} never returns ok with more than 240 minutes”`,
    ]) + box('Done when', `4 rows pass on the real code, and the planted bug turns only the <b>08:00–12:00</b> row red.`, 'xanh') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Pure functions: same input → same output — test them directly, cheaply</li>
    <li>EP: one value per class of inputs, invalid classes included</li>
    <li>BVA: on each boundary and one step either side — off-by-one bugs live there</li>
    <li>Decision tables: one row per combination, boundary values in each</li>
    <li>Property-based: state what is always true; fast-check finds and shrinks the counterexample</li>
    <li>SWT301 designs these cases on paper — here they run on every save</li></ul>` },
]);
