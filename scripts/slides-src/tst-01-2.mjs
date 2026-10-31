/**
 * tst-01-2 — Testing · Chapter 1 · Lesson 1.2 "Matchers that say what you mean" (01/11/2026). Slug bài: tst-1-2-matcher.
 * Output = chạy thật Vitest 5.0.5 (demo/matcher, demo/strict, snapshot -u với bug cài tạm seats >= 20).
 */
import { lamDeck, js, vt, two, box, steps, c, zm } from './_tst-chung.mjs';

export const deck = { key: 'tst-01-2', code: 'TST 1.2', title: 'Matchers', sub: 'Say what you mean' };

const TOBE = ` FAIL  demo/matcher.test.js > toBe vs toEqual > toBe on an object
AssertionError: expected { lab: 'BE-201', start: '08:00', …(3) } to be { lab: 'BE-201', start: '08:00', …(3) } // Object.is equality

If it should pass with deep equality, replace "toBe" with "toStrictEqual"

Expected: { lab: 'BE-201', start: '08:00', …(3) }
Received: serializes to the same string`;
const STRICT = ` FAIL  demo/strict.test.js > toStrictEqual does not
AssertionError: expected { lab: 'BE-201', start: '08:00', …(4) } to strictly equal { lab: 'BE-201', start: '08:00', …(3) }

- Expected
+ Received

  {
    "end": "10:00",
    "lab": "BE-201",
    "minutes": 120,
+   "note": undefined,
    "start": "08:00",
    "status": "CONFIRMED",
  }`;
const FLOAT = ` FAIL  demo/matcher.test.js > numbers > usage of 30 + 120 + 60 minutes is 25% (toBe)
AssertionError: expected 0.24999999999999997 to be 0.25 // Object.is equality

- Expected
+ Received

- 0.25
+ 0.24999999999999997`;
const THROW = ` FAIL  demo/matcher.test.js > errors > without a wrapper function
TypeError: Invalid time "7h", expected HH:MM
 ❯ parseTime src/rules/time.js:4:17
 ❯ demo/matcher.test.js:33:12`;
const SNAPFAIL = ` FAIL  demo/strict.test.js > inline snapshot
Error: Snapshot \`inline snapshot 1\` mismatched

- Expected
+ Received

  {
    …
    "start": "08:00",
-   "status": "CONFIRMED",
+   "status": "PENDING",
  }`;
const SNAPU = `$ npx vitest run demo/strict.test.js -t inline -u
   ✓ inline snapshot 4ms

  Snapshots  1 updated
      Tests  1 passed | 3 skipped (4)`;

export const slides = lamDeck({ chuong: 'Chapter 1 — Your first unit tests', bai: '1.2' }, [
  { cover: true, t: 'Matchers that say<br>what you mean', sub: 'Chapter 1 · Lesson 1.2 — toBe, toEqual, numbers, errors, snapshots' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Why ${c('toBe')} fails on two identical-looking objects</li>
    <li>${c('toEqual')} vs ${c('toStrictEqual')} vs ${c('toMatchObject')}</li>
    <li>Why 30 + 120 + 60 minutes is not exactly 25% — and ${c('toBeCloseTo')}</li>
    <li>The truthy trap: matchers that pass for the wrong reason</li>
    <li>Testing errors: the wrapper function and ${c('toThrow')}</li>
    <li>Snapshots, and how ${c('-u')} can quietly accept a bug</li></ul>` },
  { t: 'A matcher is the comparison', body: `<table class="t"><tr><th>Question you ask</th><th>Matcher</th></tr>
    <tr><td>Same primitive value (number, string, boolean)?</td><td>${c('toBe(420)')}</td></tr>
    <tr><td>Same structure and values (objects, arrays)?</td><td>${c('toEqual({…})')} · ${c('toStrictEqual({…})')}</td></tr>
    <tr><td>Contains these fields (ignore the rest)?</td><td>${c("toMatchObject({ status: 'PENDING' })")}</td></tr>
    <tr><td>Close enough (decimals)?</td><td>${c('toBeCloseTo(0.25)')}</td></tr>
    <tr><td>Array has an item / a length?</td><td>${c("toContain('OFF_GRID')")} · ${c('toHaveLength(3)')}</td></tr>
    <tr><td>Throws?</td><td>${c('toThrow(RangeError)')} · ${c('toThrow(/positive/)')}</td></tr>
    <tr><td>The opposite of any of these</td><td>${c('.not.toBe(…)')}</td></tr></table>` },
  { t: 'toBe uses Object.is — two objects are never “the same”', body: js(`expect(createBooking(input)).toBe({ lab: 'BE-201', start: '08:00',
  end: '10:00', minutes: 120, status: 'CONFIRMED' });   // ✗ fails`, { sm: true }) + vt(TOBE, { title: 'terminal — Vitest 5.0.5', fs: 13 }) +
    box('Read the hint', `Same content, different objects in memory. ${c('toBe')} asks “is it the very same object?” Vitest even suggests the fix: a deep-equality matcher.`, 'lam') },
  { t: 'toEqual · toStrictEqual · toMatchObject', body: `<table class="t"><tr><th>Matcher</th><th>Compares</th><th>Ignores</th><th>Use it when</th></tr>
    <tr><td>${c('toEqual')}</td><td>all values, recursively</td><td>properties that are ${c('undefined')}, class types</td><td>plain data, most of the time</td></tr>
    <tr><td>${c('toStrictEqual')}</td><td>all values + ${c('undefined')} keys + types</td><td>nothing</td><td>an extra or missing key would be a bug (API output)</td></tr>
    <tr><td>${c('toMatchObject')}</td><td>only the fields you list</td><td>every other field</td><td>you care about 1–2 fields of a big object</td></tr></table>` +
    box('Rule of thumb', `Start with ${c('toEqual')}. Move to ${c('toStrictEqual')} for data that leaves your system; ${c('toMatchObject')} when the test is about one field.`, 'xanh') },
  { t: 'toStrictEqual catches the key toEqual ignores', body: js(`it('toEqual ignores an undefined property', () => {
  expect({ ...createBooking(input), note: undefined })
    .toEqual({ lab: 'BE-201', start: '08:00',
      end: '10:00', minutes: 120, status: 'CONFIRMED' });
});   // ✓ passes
it('toStrictEqual does not', () => { /* same */ });   // ✗ fails`, { sm: true }) + vt(STRICT, { title: 'terminal — the extra key is shown with +' }) },
  { t: 'Decimals: 30 + 120 + 60 minutes is not exactly 25%', body: js(`export function usageRate(bookings) {
  let rate = 0;
  for (const b of bookings) rate += b.minutes / (CLOSE - OPEN);
  return rate;
}

expect(usageRate([{ minutes: 30 }, { minutes: 120 },
  { minutes: 60 }])).toBe(0.25);   // 210 / 840 = 0.25 … ?`, { sm: true }) + vt(FLOAT, { title: 'terminal — real output' }) +
    box('Why', `${c('30/840')}, ${c('120/840')}, ${c('60/840')} cannot be stored exactly in binary; adding three rounded values lands one tiny step below 0.25. Same family as ${c('0.1 + 0.2')}.`, 'lam') },
  { t: 'toBeCloseTo: compare decimals with a tolerance', body: js(`expect(usageRate([{ minutes: 30 }, { minutes: 120 }, { minutes: 60 }]))
  .toBeCloseTo(0.25);                 // ✓ default: 2 decimal places

expect(usageRate([{ minutes: 120 }, { minutes: 30 }]))
  .toBeCloseTo(0.1786, 4);            // ✓ |difference| < 0.00005`) +
    two(box('When', `Any result computed with ${c('/')}, ${c('*')} or ${c('Math')} on decimals: rates, averages, money in floats.`, 'lam'),
      box('Better still for money', `Store integers (cents, minutes) and only divide for display — then ${c('toBe')} is exact.`, 'xanh')) },
  { t: 'The truthy trap: green for the wrong reason', body: js(`it('an invalid slot is still truthy', () => {
  expect(checkSlot('06:30', '08:00')).toBeTruthy();
});   // ✓ passes — but 06:30 is INVALID!`) +
    box('Why it passes', `${c('checkSlot')} always returns an object, and every object is truthy — even ${c("{ ok: false }")}. The test checks nothing about the rule.`, 'do2') +
    box('Say what you mean', `${c("expect(checkSlot('06:30', '08:00')).toEqual({ ok: false, code: 'OUTSIDE_HOURS' })")} — the exact answer, or at least ${c('toMatchObject({ ok: false })')}.`, 'xanh') },
  { t: 'Errors: pass a function, not a result', body: js(`it('without a wrapper function', () => {
  expect(parseTime('7h')).toThrow();      // ✗
});

it('with a wrapper function', () => {
  expect(() => parseTime('7h')).toThrow(TypeError);
  expect(() => parseTime('7h')).toThrow(/expected HH:MM/);
});   // ✓`, { sm: true }) + vt(THROW, { title: 'terminal — the error escapes the test' }) +
    box('Why the arrow', `Without ${c('() =>')} JavaScript runs ${c("parseTime('7h')")} <b>before</b> ${c('expect')} is even called; the error escapes and the test crashes. With the arrow, ${c('toThrow')} calls it and catches the error.`, 'lam') },
  { t: 'Three ways to say which error', body: `<table class="t"><tr><th>Assertion</th><th>Passes when the function throws…</th></tr>
    <tr><td>${c('toThrow()')}</td><td>anything at all (weak — avoid alone)</td></tr>
    <tr><td>${c('toThrow(RangeError)')}</td><td>an error of that class (or a subclass)</td></tr>
    <tr><td>${c('toThrow(/positive integer/)')}</td><td>an error whose message matches the regex</td></tr>
    <tr><td>${c("toThrow('OUTSIDE_HOURS')")}</td><td>an error whose message contains that text</td></tr></table>` +
    box('LabFlow Lite example', `${c("expect(() => needsApproval({ role: 'STUDENT', seats: 0 })).toThrow(RangeError)")} — class first, then the message if it matters to users.`, 'xanh') },
  { t: 'Snapshots: Vitest writes the expected value for you', body: js(`it('inline snapshot', () => {
  expect(createBooking(input)).toMatchInlineSnapshot();
});
// first run ⇒ Vitest fills it in:
  expect(createBooking(input)).toMatchInlineSnapshot(\`
    {
      "end": "10:00",
      "lab": "BE-201",
      "minutes": 120,
      "start": "08:00",
      "status": "CONFIRMED",
    }
  \`);`, { sm: true }) + box('What it is good for', `Big outputs you do not want to type: rendered HTML, a long JSON response, an error report. The next run compares against the stored text. The stored text lives inside your test file, so it is reviewed in the pull request.`, 'lam') },
  { t: 'Snapshot trap: -u accepts whatever the code does now', body: two(vt(SNAPFAIL, { title: 'after a bug: approval from 20 seats' }), `<div>${vt(SNAPU, { title: 'then someone types -u…' })}${box('The bug is now the “expected” value', `${c('-u')} rewrote the snapshot to ${c("'PENDING'")}. The test is green and protects the bug. Review snapshot diffs like code.`, 'do2')}${box('Before typing -u', 'Ask: did I <b>mean</b> to change this behaviour? If not, the red snapshot just caught a bug.', 'xanh')}</div>`) },
  { t: 'Cheat sheet', body: zm(`<table class="t"><tr><th>Situation</th><th>Use</th><th>Avoid</th></tr>
    <tr><td>number, string, boolean</td><td>${c('toBe')}</td><td>—</td></tr>
    <tr><td>object / array result</td><td>${c('toEqual')}, ${c('toStrictEqual')}</td><td>${c('toBe')}</td></tr>
    <tr><td>one field of a big object</td><td>${c('toMatchObject')}, ${c('toHaveProperty')}</td><td>snapshotting everything</td></tr>
    <tr><td>decimals</td><td>${c('toBeCloseTo')}</td><td>${c('toBe(0.25)')}</td></tr>
    <tr><td>errors</td><td>${c('() =>')} + ${c('toThrow(Class)')}</td><td>${c('toThrow()')} alone</td></tr>
    <tr><td>“is it valid?” results</td><td>the exact expected object</td><td>${c('toBeTruthy')}</td></tr></table>`, 1.1) },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      `${c('needsApproval')} with 0 seats throws a ${c('RangeError')} whose message mentions “positive integer”`,
      `${c('usageRate')} of 120 + 30 minutes is about 0.1786 (4 decimal places)`,
      `${c("checkSlot('08:10', '09:00')")} is not ok, and has no ${c('minutes')} property`,
      `Rewrite the ${c('toBeTruthy')} test so it would fail if ${c('checkSlot')} accepted 06:30`,
    ]) + box('Done when', `Your file shows <b>4 passed</b>; then change ${c('OPEN')} to ${c('6 * 60')} and your rewritten test turns red — so does the usage test, because the day is now 15 hours long.`, 'xanh') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>${c('toBe')} = same value / same object; objects need ${c('toEqual')}</li>
    <li>${c('toStrictEqual')} also checks ${c('undefined')} keys and types; ${c('toMatchObject')} checks only what you list</li>
    <li>Decimals: ${c('toBeCloseTo')}, or keep integers</li>
    <li>${c('toBeTruthy')} on objects proves nothing — assert the exact answer</li>
    <li>Errors: ${c('expect(() => …).toThrow(Class or /message/)')}</li>
    <li>Snapshots save typing; ${c('-u')} can bless a bug — review the diff</li></ul>` },
]);
