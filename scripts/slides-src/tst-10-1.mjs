/**
 * tst-10-1 — Testing · Chapter 10 · Lesson 10.1 "TDD in practice: red, green, refactor" (01/11/2026). Slug: tst-10-1-tdd.
 * Output = chạy thật (s10/_ma.mjs): 7 bước TDD của BR-09 (demo10/tdd/1-do … 7-refactor), bộ cuối 14 test, Stryker 100% (45/45) trên waitlist.js;
 * classicist vs mockist: refactor remove trả dòng ⇒ mockist-v1 đỏ NOT_FOUND, classicist xanh; bug splice trả mảng ⇒ mockist xanh, classicist đỏ 2 test.
 */
import { lamDeck, js, vt, two, box, steps, c, zm, flow } from './_tst-chung.mjs';

export const deck = { key: 'tst-10-1', code: 'TST 10.1', title: 'TDD in practice: red, green, refactor', sub: 'a waitlist, one test at a time' };

const T1 = `it('puts the first student at position 1', () => {
  expect(joinWaitlist([], { userId: 'an', holderId: 'binh' }))
    .toEqual({ ok: true, position: 1, queue: [{ userId: 'an' }] });
});`;
const B1 = `$ npx vitest run demo10/tdd/1-do
     × puts the first student at position 1 4ms
AssertionError: expected undefined to deeply equal { ok: true, position: 1, …(1) }
      Tests  1 failed (1)`;
const X1 = `export function joinWaitlist(queue, { userId }) {
  // fake it: the simplest code that passes
  return { ok: true, position: 1, queue: [{ userId }] };
}`;
const B2 = `$ npx vitest run demo10/tdd/2-do
     × puts the next student behind the ones already waiting 5ms
AssertionError: expected { ok: true, position: 1, …(1) }
  to deeply equal { ok: true, position: 2, …(1) }
-   "position": 2,
+   "position": 1,
      Tests  1 failed | 1 passed (2)`;
const X2 = `export function joinWaitlist(queue, { userId }) {
  const next = [...queue, { userId }];
  return { ok: true, position: next.length,
           queue: next };
}`;
const B34 = `$ npx vitest run demo10/tdd/3-do
     × refuses a student who is already waiting 4ms
     × refuses a fourth student: at most 3 wait for one slot 1ms
      Tests  2 failed | 2 passed (4)
$ npx vitest run demo10/tdd/4-do
     × refuses the student who already holds the slot 5ms
AssertionError: expected { ok: true, position: 1, …(1) }
  to deeply equal { ok: false, code: 'IS_HOLDER' }
      Tests  1 failed | 4 passed (5)`;
const X4 = `if (userId === holderId)
  return { ok: false, code: 'IS_HOLDER' };
if (queue.some((w) => w.userId === userId))
  return { ok: false, code: 'ALREADY_WAITING' };
if (queue.length >= WAITLIST_MAX)
  return { ok: false, code: 'WAITLIST_FULL' };`;
const T6 = `const offer = { userId: 'an', expiresAt: new Date('2026-11-16T10:30:00+07:00') };

it('accepts at 10:29, one minute before the offer expires', () => {
  expect(acceptOffer(offer, new Date('2026-11-16T10:29:00+07:00')))
    .toEqual({ ok: true });
});
it('refuses at 10:30: the offer has expired', () => { … OFFER_EXPIRED … });`;
const B56 = `$ npx vitest run demo10/tdd/5-do
TypeError: offerNext is not a function
      Tests  2 failed | 5 passed (7)
$ npx vitest run demo10/tdd/6-do
TypeError: acceptOffer is not a function
      Tests  2 failed | 7 passed (9)
$ npx vitest run demo10/tdd/6-xanh
      Tests  9 passed (9)`;
const X6 = `export function acceptOffer(offer, now) {
  if (now.getTime() >= offer.expiresAt.getTime())
    return { ok: false, code: 'OFFER_EXPIRED' };
  return { ok: true };
}`;
const X7 = `const refuse = (code) => ({ ok: false, code });
…
const [first, ...rest] = queue;
return { offer: { userId: first.userId,
                  expiresAt: minutesLater(now, OFFER_MINUTES) },
         queue: rest };
…
return now < offer.expiresAt
  ? { ok: true } : refuse('OFFER_EXPIRED');`;
const B7 = `$ npx vitest run demo10/tdd/7-refactor
      Tests  9 passed (9)
$ npx stryker run --mutate src/rules/waitlist.js
INFO Instrumenter Instrumented 1 source file(s) with 45 mutant(s)
File         |  total | covered | # killed | # timeout | # survived
All files    | 100.00 |  100.00 |       45 |         0 |          0
INFO MutationTestReportHelper Final mutation score of 100.00 …`;
const MOCK = `const repo = {
  findById: vi.fn().mockResolvedValue(booking),
  remove: vi.fn().mockResolvedValue(undefined),
};
…
expect(repo.findById).toHaveBeenCalledWith(7);
expect(repo.remove).toHaveBeenCalledWith(7);`;
const V1 = `$ npx vitest run demo10/truong-phai/mockist-v1.test.js …/classicist.test.js
     × removes the booking, updates the waitlist and mails the first student
 ✓ demo10/truong-phai/classicist.test.js (3 tests) 62ms
BookingError: NOT_FOUND
      Tests  1 failed | 3 passed (4)`;
const SPLICE = `planted in src/booking/service.js:  rows.splice(i, 1)[0]  →  rows.splice(i, 1)
 ✓ demo10/truong-phai/mockist.test.js (1 test) 3ms
 ❯ demo10/truong-phai/classicist.test.js (3 tests | 2 failed) 61ms
AssertionError: expected { cancelled: undefined, …(1) } to deeply equal { cancelled: 1, …(1) }
      Tests  2 failed | 2 passed (4)`;

export const slides = lamDeck({ chuong: 'Chapter 10 — TDD and testing in real teams', bai: '10.1' }, [
  { cover: true, t: 'TDD in practice:<br>red, green, refactor', sub: 'Chapter 10 · Lesson 10.1 — a real LabFlow feature, built one failing test at a time' },
  { t: 'What you will be able to do after this lesson', to: true, giua: true, body: `<ul>
    <li>Write a <b>test list</b> before any code, then work through it one test at a time</li>
    <li>Make each test fail <b>for the right reason</b>, then pass with the simplest code</li>
    <li>Use Fake It, Triangulate and Obvious Implementation on purpose</li>
    <li>Refactor only on green — and measure what the tests are worth</li>
    <li>Choose between classicist and mockist tests, and know when TDD does not fit</li></ul>` },
  { t: 'The loop: test list, red, green, refactor', to: true, body: flow([{ t: 'Test list', s: 'cases you know' }, { t: 'Red', s: 'one test, fails', mau: '#c0392b' }, { t: 'Green', s: 'simplest code', mau: '#2f7d4f' }, { t: 'Refactor', s: 'tests stay green', mau: '#b85a2b' }, { t: 'Next item', s: 'until list empty' }], { h: 190, fs: 22 }) +
    two(box('Canon TDD (Kent Beck)', `1. Write a list of test scenarios · 2. Turn <b>one</b> item into a runnable test · 3. Make it (and all previous tests) pass · 4. Optionally refactor · 5. Repeat until the list is empty.`, 'lam'),
      box('Three ways to green', `<b>Fake It</b> — return a constant. <b>Triangulate</b> — a second example forces real code. <b>Obvious Implementation</b> — when you already know it, just type it.`, 'xanh')) },
  { t: 'BR-09 and the test list first', to: true, body: two(box('BR-09 — waitlist for a taken slot', `At most <b>3</b> students wait for one slot · the student who holds the slot cannot wait for it · when the slot is freed it is <b>offered</b> to the first in line for <b>30 minutes</b> · the offer can be accepted until it expires.`, 'lam'),
      steps(['first student → position 1', 'next student → behind the others', 'already waiting → ALREADY_WAITING', 'fourth student → WAITLIST_FULL', 'holder joins → IS_HOLDER (found while listing)', 'slot freed → offer to the first, 30 minutes', 'accept at 10:29 ✓ · at 10:30 OFFER_EXPIRED'])) },
  { t: 'Red for the right reason, then fake it', body: js(T1, { sm: true }) + vt(B1, { title: 'step 1 — the function exists but returns nothing', fs: 15 }) +
    two(js(X1, { sm: true, hl: [2] }), box('Why fake it?', `The test is green in seconds and proves the test itself works. A constant is not cheating: the <b>next</b> test will break it.`, 'xanh')) },
  { t: 'Triangulate, then let the list add edge cases', body: two(vt(B2, { title: 'step 2 — a second example', fs: 13 }) + js(X2, { sm: true, hl: [2, 3] }),
      vt(B34, { title: 'steps 3 and 4 — from the test list', fs: 13 }) + js(X4, { sm: true, hl: [1] })) +
    box('The test list found IS_HOLDER', `Nobody asked “can the holder wait for their own slot?” until it was written down as a test. Writing ${c('ALREADY_WAITING')} before ${c('WAITLIST_FULL')} also decided which message a student in a full line gets.`, '') },
  { t: 'Time is a parameter: 10:29 and 10:30', body: js(T6, { sm: true, hl: [3, 7] }) +
    two(vt(B56, { title: 'steps 5 and 6', fs: 14 }), js(X6, { sm: true, hl: [2] })) + (box('Boundary first', `The rule says “until it expires”. The two tests pin the exact minute: 10:29 is accepted, 10:30 is not. ${c('now')} is passed in — no fake timers needed.`, 'lam')) },
  { t: 'Refactor on green — and what TDD bought', body: two(js(X7, { sm: true, hl: [8, 9] }), box('Measured', `Every mutant of ${c('waitlist.js')} killed: <b>45/45</b>. Lesson 8.2’s suite written to reach 100% coverage killed only <b>41.49%</b>. Tests written first check behaviour, so they bite.`, 'xanh'), 'r64') +
    vt(B7, { title: 'same 9 tests after the refactor · Stryker on the result', fs: 14 }) },
  { t: 'Classicist or mockist: one refactor, two results', body: two(js(MOCK, { sm: true, hl: [6, 7] }),
      box('The refactor', `${c('cancelBooking')} first called ${c('findById')} then ${c('remove')}. Now ${c('remove')} returns the row — one call, same behaviour.`, 'lam')) +
    vt(V1, { title: 'after the refactor — the mockist test breaks, behaviour did not', fs: 13.5 }) +
    vt(SPLICE, { title: 'a real bug in the repo — the mockist test cannot see it', fs: 13.5 }) },
  { t: 'When TDD fits — and when it does not', body: zm(`<table class="t"><tr><th>Situation</th><th>TDD?</th><th>Instead</th></tr>
    <tr><td>Business rule, pure function (BR-09)</td><td>✅ best case</td><td>—</td></tr>
    <tr><td>Bug report you can reproduce</td><td>✅ red test first</td><td>—</td></tr>
    <tr><td>Exploring a UI or a new library</td><td>❌</td><td>spike, throw it away, then test-first</td></tr>
    <tr><td>Requirement still unclear</td><td>⚠️</td><td>ask, write examples (ATDD) first</td></tr>
    <tr><td>Legacy code with no seams</td><td>⚠️</td><td>characterization tests (10.2)</td></tr></table>`, 1.15) +
    box('Mocks or real objects?', `Real collaborators inside your code (repo in memory, Map), a fake or mock only at the boundary you do not own (the mailer).`, 'xanh') },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      `Write three tests for ${c('leaveWaitlist(queue, userId)')}: leave and move up · ${c('NOT_WAITING')} · queue unchanged`,
      `Run them against an empty function — red for the right reason`,
      `Write the simplest code that turns all three green, then refactor`,
    ]) + box('Measured', `Empty function: ${c('Tests 2 failed | 1 passed (3)')} — “never changes the queue” is green by accident. Solution: ${c('Tests 3 passed (3)')}.`, 'lam') +
    box('Done when', 'All three green; the first two seen red for the reason their names say — and you know why the third was green too early.', 'xanh') },
]);
