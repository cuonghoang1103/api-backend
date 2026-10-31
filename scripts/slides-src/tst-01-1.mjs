/**
 * tst-01-1 — Testing · Chapter 1 · Lesson 1.1 "Anatomy of a test: arrange, act, assert" (01/11/2026). Slug bài: tst-1-1-cau-truc.
 * Output = chạy thật Node 22.23.3 + Vitest 5.0.5 trên labflow-lite (demo/aaa, nhieu-ly-do, soft, vitest.strict.config).
 */
import { lamDeck, js, vt, two, box, steps, cards, c, zm } from './_tst-chung.mjs';

export const deck = { key: 'tst-01-1', code: 'TST 1.1', title: 'Anatomy of a test', sub: 'Arrange, act, assert' };

const RULES_A = `export const OPEN = 7 * 60;       // 07:00
export const CLOSE = 21 * 60;     // 21:00
export const STEP = 30;           // BR-04: 30-minute grid
export const MAX_MINUTES = 240;   // Lite-1: at most 4 hours

export function checkSlot(start, end) {
  const s = parseTime(start);
  const e = parseTime(end);
  if (s % STEP !== 0 || e % STEP !== 0) return { ok: false, code: 'OFF_GRID' };
  if (e <= s) return { ok: false, code: 'END_BEFORE_START' };
  if (s < OPEN || e > CLOSE) return { ok: false, code: 'OUTSIDE_HOURS' };
  if (e - s > MAX_MINUTES) return { ok: false, code: 'TOO_LONG' };
  return { ok: true, minutes: e - s };
}`;
const RULES_B = `export function needsApproval({ seats, role }) {
  if (!Number.isInteger(seats) || seats < 1) {
    throw new RangeError('seats must be a positive integer, got ' + seats);
  }
  if (role === 'LECTURER' || role === 'ADMIN') return false;
  return seats > APPROVAL_SEATS;               // BR-06: > 30
}

export function createBooking({ lab, seats, role, start, end }) {
  const slot = checkSlot(start, end);
  if (!slot.ok) throw new Error(slot.code);
  return { lab, start, end, minutes: slot.minutes,
    status: needsApproval({ seats, role }) ? 'PENDING' : 'CONFIRMED' };
}`;
const AAA = `it('a 31-seat booking by a student waits for approval', () => {
  // Arrange — build the input
  const input = { lab: 'BE-201', seats: 31, role: 'STUDENT',
                  start: '08:00', end: '10:00' };

  // Act — call the ONE thing under test
  const booking = createBooking(input);

  // Assert — check the result
  expect(booking.status).toBe('PENDING');
});`;
const AAA_OUT = `$ npx vitest run demo/aaa.test.js

 ✓ demo/aaa.test.js (2 tests) 2ms
   ✓ a 31-seat booking by a student waits for approval 1ms
   ✓ checks nothing at all 0ms

 Test Files  1 passed (1)
      Tests  2 passed (2)`;
const REQ_OUT = `$ npx vitest run demo/aaa.test.js --config demo/vitest.strict.config.js

 ❯ demo/aaa.test.js (2 tests | 1 failed) 4ms
   ✓ a 31-seat booking by a student waits for approval 1ms
   × checks nothing at all 2ms

 FAIL  demo/aaa.test.js > checks nothing at all
Error: expected any number of assertion, but got none
 ❯ demo/aaa.test.js:15:1`;
const MANY = `it('booking works', () => {
  const b = createBooking({ lab: 'BE-201', seats: 31,
    role: 'STUDENT', start: '08:00', end: '10:00' });
  expect(b.status).toBe('CONFIRMED');   // wrong expectation here…
  expect(b.minutes).toBe(120);          // …so these two lines
  expect(b.lab).toBe('BE-201');         // never run
});`;
const MANY_OUT = ` FAIL  demo/nhieu-ly-do.test.js > booking works
AssertionError: expected 'PENDING' to be 'CONFIRMED'

Expected: "CONFIRMED"
Received: "PENDING"

 ❯ demo/nhieu-ly-do.test.js:6:20
      Tests  1 failed (1)`;
const SOFT_OUT = ` FAIL  demo/soft.test.js > booking fields (soft)
AssertionError: expected 'PENDING' to be 'CONFIRMED'
 ❯ demo/soft.test.js:6:25
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯
 FAIL  demo/soft.test.js > booking fields (soft)
AssertionError: expected 120 to be 90
 ❯ demo/soft.test.js:7:26
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯
      Tests  1 failed (1)`;

export const slides = lamDeck({ chuong: 'Chapter 1 — Your first unit tests', bai: '1.1' }, [
  { cover: true, t: 'Anatomy of a test:<br>arrange, act, assert', sub: 'Chapter 1 · Lesson 1.1 — the shape every good test shares' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The LabFlow Lite rules you will test all chapter</li>
    <li>The parts of a test: ${c('describe')}, ${c('it')}, ${c('expect')}</li>
    <li><b>Arrange · Act · Assert</b> — the three-paragraph shape</li>
    <li>The test that checks nothing — and how to make it fail</li>
    <li><b>One reason to fail</b> per test, and ${c('expect.soft')}</li>
    <li>F.I.R.S.T. — five properties of a good unit test; JUnit ↔ Vitest</li></ul>` },
  { t: 'The code under test (1/2): checkSlot', body: js(RULES_A, { sm: true, hl: [9, 10, 11, 12] }) +
    box('Four ways to say no, one way to say yes', `Off the 30-minute grid · end not after start · outside 07:00–21:00 · longer than 240 minutes. Otherwise ${c('{ ok: true, minutes }')}.`, 'lam') },
  { t: 'The code under test (2/2): approval and booking', body: js(RULES_B, { sm: true }) +
    box('Read it like a spec', `Seats must be a positive integer · lecturers and admins never need approval · students need it above 30 seats · ${c('createBooking')} combines both rules.`, 'lam') },
  { t: 'The parts of a test', body: js(`import { describe, it, expect } from 'vitest';
import { createBooking } from './booking.js';

describe('createBooking', () => {
  it('confirms a 20-seat student booking', () => {
    const b = createBooking({ lab: 'BE-201', seats: 20,
      role: 'STUDENT', start: '08:00', end: '10:00' });
    expect(b.status).toBe('CONFIRMED');
  });
});`, { sm: true, hl: [4, 5, 8] }) + cards([
      ['describe', 'a <b>group</b>, named after the thing under test'],
      ['it', '<b>one test</b>: a sentence that must be true'],
      ['expect(actual)', 'what the code <b>produced</b>'],
      ['.toBe(expected)', 'the <b>matcher</b>: what it should be'],
    ], 4) + box('Read the names together', `${c('describe')} + ${c('it')} form a sentence in the report: “createBooking › confirms a 20-seat student booking”. Lesson 1.3 is all about writing that sentence well.`, 'lam') },
  { t: 'Arrange · Act · Assert', body: js(AAA, { sm: true, hl: [3, 7, 10] }) + two(steps([
      '<b>Arrange</b> — build exactly the input this test needs',
      '<b>Act</b> — call the one thing being tested, once',
      '<b>Assert</b> — check the result',
    ]), box('Why bother', 'A reader sees in two seconds what is set up, what is done, and what is claimed. Blank lines between the three are enough — comments are optional.', 'xanh')) },
  { t: 'Trap: a test with no assertion is always green', body: js(`it('checks nothing at all', () => {
  createBooking({ lab: 'BE-201', seats: 31,
    role: 'STUDENT', start: '08:00', end: '10:00' });
});`, { sm: true }) + vt(AAA_OUT, { title: 'terminal — Vitest 5.0.5' }) +
    box('Green ≠ checked', `The second test passes because nothing inside it can fail — it only proves ${c('createBooking')} did not throw. It reads like a test and protects nothing.`, 'do2') },
  { t: 'Make “no assertion” a failure', body: js(`// demo/vitest.strict.config.js
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    reporters: ['tree'],
    expect: { requireAssertions: true },
  },
});`, { sm: true, hl: [6] }) + vt(REQ_OUT, { title: 'terminal — Vitest 5.0.5' }) +
    box('A one-line safety net', `With ${c('requireAssertions')} every test must call ${c('expect')} at least once. Teams switch it on in the main config.`, 'xanh') },
  { t: 'One test, one reason to fail', body: js(MANY, { sm: true, hl: [4] }) + vt(MANY_OUT, { title: 'terminal — the first expect stops the test' }) +
    box('What you lose', `The first failing ${c('expect')} throws and ends the test. Is ${c('minutes')} right? Is ${c('lab')} right? You cannot know. And the name “booking works” tells you nothing.`, 'do2') },
  { t: 'Two fixes: split, or expect.soft', body: two(box('Split (usually best)', `<p style="font-size:19px">One behaviour per test, named after it:</p>${js(`it('needs approval above 30 seats', …)
it('lasts 120 minutes from 08:00 to 10:00', …)
it('keeps the lab code', …)`, { sm: true })}`, 'xanh'), `<div>${box('expect.soft', `Keeps going after a failure and reports <b>all</b> of them — useful when several fields belong to one behaviour.`, 'lam')}${vt(SOFT_OUT, { title: 'two failures reported, one test' })}</div>`) },
  { t: 'F.I.R.S.T. — five properties of a good unit test', body: cards([
      ['⚡ Fast', 'Milliseconds. You run them hundreds of times a day.'],
      ['🧱 Isolated', 'No test depends on another, or on the order they run in.'],
      ['🔁 Repeatable', 'Same result on every machine, every time: no real clock, network or random.'],
      ['✅ Self-validating', 'It says pass or fail by itself — nobody reads logs to decide.'],
      ['⏱ Timely', 'Written with the code, not weeks later “if there is time”.'],
      ['📚 Source', 'Popularised by Robert C. Martin’s <i>Clean Code</i> (2008), chapter on unit tests.'],
    ], 3) },
  { t: 'From JUnit (SWT301) to Vitest', body: zm(`<table class="t"><tr><th>JUnit 5 (Java)</th><th>Vitest (JavaScript)</th><th>Note</th></tr>
    <tr><td>${c('class BookingTest')}</td><td>${c("describe('Booking', …)")}</td><td>a group</td></tr>
    <tr><td>${c('@Test void needsApproval()')}</td><td>${c("it('needs approval …', …)")}</td><td>one test</td></tr>
    <tr><td>${c('assertEquals(expected, actual)')}</td><td>${c('expect(actual).toBe(expected)')}</td><td><b>order is reversed!</b></td></tr>
    <tr><td>${c('@BeforeEach')}</td><td>${c('beforeEach(…)')}</td><td>Arrange shared by tests</td></tr>
    <tr><td>${c('assertThrows(X.class, () -> …)')}</td><td>${c('expect(() => …).toThrow(X)')}</td><td>lesson 1.2</td></tr></table>`, 1.1) +
    box('Classic slip', `In JUnit the <b>expected</b> value comes first; in Vitest the <b>actual</b> one goes into ${c('expect')}. Swap them and the failure message lies: “expected 420 to be 450”.`, 'do2') },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      `Write an AAA test: a <b>lecturer</b> booking 31 seats, 13:00–15:30, is ${c('CONFIRMED')}`,
      `Write a second test for the same booking: it lasts <b>150</b> minutes`,
      `Copy the “booking works” test, run it, then split it into three named tests`,
      `Run the no-assertion test with ${c('requireAssertions')} and watch it fail`,
    ]) + box('Done when', `${c('demo/th11.test.js')} shows <b>2 passed</b>, your split file shows three tests with clear names, and the strict config turns “checks nothing” red.`, 'xanh') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>${c('describe')} groups, ${c('it')} states one fact, ${c('expect…toBe')} checks it</li>
    <li>Arrange · Act · Assert: input, one action, the claim</li>
    <li>No assertion ⇒ always green; ${c('requireAssertions')} catches it</li>
    <li>One reason to fail per test; ${c('expect.soft')} when fields belong together</li>
    <li>F.I.R.S.T.: fast, isolated, repeatable, self-validating, timely</li>
    <li>JUnit ${c('assertEquals(expected, actual)')} vs Vitest ${c('expect(actual)')}</li></ul>` },
]);
