/**
 * tst-03-3 — Testing · Chapter 3 · Lesson 3.3 "When mocks make tests worthless" (01/11/2026). Slug: tst-3-3-qua-da.
 * Output = chạy thật: cài bug status (mock xanh, fake đỏ), "refactor" thêm cột (test quá chi tiết đỏ, fake xanh).
 */
import { lamDeck, js, vt, two, box, steps, c, zm } from './_tst-chung.mjs';

export const deck = { key: 'tst-03-3', code: 'TST 3.3', title: 'When mocks make tests worthless', sub: 'mock-heavy vs fake-based, measured' };

const MOCKY = `vi.mock('../src/booking/service.js', () => ({ bookLab: vi.fn() }));

it('a 31-seat student booking e-mails the student', async () => {
  vi.mocked(bookLab).mockResolvedValue({ id: 1, lab: 'BE-201',
    date: '2026-11-16', start: '08:00', status: 'CONFIRMED' });
  const send = vi.fn().mockResolvedValue('m');
  await bookAndNotify({ repo: {}, mailer: { send } }, input);   // 31 seats
  expect(send).toHaveBeenCalledWith(expect.objectContaining({ to: 'an@fpt.edu.vn' }));
});`;
const FAKEY = `it('a 31-seat student booking is PENDING and goes to the approver', async () => {
  const mailer = createFakeMailer();
  const booking = await bookAndNotify({ repo: createMemoryRepo(), mailer }, input);
  expect(booking).toMatchObject({ status: 'PENDING', notified: true });
  expect(mailer.outbox.map((m) => m.to)).toEqual([APPROVER]);
});`;
const BUG = `planted in src/booking/service.js:
  needsApproval(input) ? 'PENDING' : 'CONFIRMED'  →  'CONFIRMED'

 ✓ demo3/qua-da-mock.test.js (2 tests) 3ms
   ✓ a 31-seat student booking e-mails the student 1ms
   ✓ passes the input to bookLab unchanged 0ms
 ❯ demo3/qua-da-fake.test.js (2 tests | 1 failed) 33ms
   × a 31-seat student booking is PENDING and goes to the approver 19ms
   ✓ the booking is really stored 13ms`;
const DETAIL = `it('checks for an overlap, then inserts exactly this row', async () => {
  const repo = { findOverlap: vi.fn().mockResolvedValue(null),
                 insert: vi.fn().mockResolvedValue({ id: 1 }) };
  await bookLab(repo, input);
  expect(repo.findOverlap).toHaveBeenCalledWith('BE-201', '2026-11-16', '08:00', '10:00');
  expect(repo.insert).toHaveBeenCalledWith({ ...input, minutes: 120, status: 'CONFIRMED' });
});`;
const REFACTOR = `planted in src/booking/service.js:
  minutes: slot.minutes, status });  →  minutes: slot.minutes, status, source: 'web' });

 ❯ demo3/qua-chi-tiet.test.js (1 test | 1 failed) 6ms
   × checks for an overlap, then inserts exactly this row 6ms
 ✓ demo3/qua-da-fake.test.js (2 tests) 28ms
AssertionError: expected "vi.fn()" to be called with arguments: [ { lab: 'BE-201', …(7) } ]
+     "source": "web",`;

export const slides = lamDeck({ chuong: 'Chapter 3 — Test doubles without lying to yourself', bai: '3.3' }, [
  { cover: true, t: 'When mocks make<br>tests worthless', sub: 'Chapter 3 · Lesson 3.3 — one planted bug, one harmless change, two kinds of test' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>A test that only checks its own mock — green on a real bug</li>
    <li>A test glued to the implementation — red on a harmless change</li>
    <li>Both measured with one planted change each</li>
    <li>Five smells of mock overuse, and the fix for each</li>
    <li>The question to ask of every test: what bug would this catch?</li></ul>` },
  { t: 'A mock-heavy test', body: js(MOCKY, { sm: true, hl: [4, 5, 8] }) + box('Read it again', 'BR-06 says 31 student seats need approval. The test hard-codes CONFIRMED in the mock, then checks that the student got the confirmation. It tests the mock, not LabFlow.', 'do2') },
  { t: 'The same scenario with fakes', body: zm(js(FAKEY, { hl: [3, 4] }), 1.1) + two(box('Real rules, fake infrastructure', `Real ${c('bookLab')}, ${c('checkSlot')} and ${c('needsApproval')}; only storage and e-mail are stand-ins.`, 'xanh'), box('Asserts what a user sees', 'The booking is PENDING and exactly one mail went to the approver. No line of the test mentions how bookLab works inside.', 'xanh')) },
  { t: 'Plant one bug: who notices?', body: zm(vt(BUG, { title: 'terminal — node scripts/thu-loi.mjs … (status always CONFIRMED)', sm: false }), 1.02) +
    box('Measured', 'The mock-heavy file stays fully green — the bug ships. The fake-based test fails with “expected PENDING, received CONFIRMED”.', 'do2') },
  { t: 'An over-specified test', body: js(DETAIL, { hl: [5, 6] }) + two(box('Glued to the implementation', `It does not check the outcome; it checks <i>which calls</i> ${c('bookLab')} makes, with every argument, field by field.`, 'do2'), box('Looks thorough', 'Two exact assertions, every field spelled out — it feels safe. Next slide: what happens when someone stores one more column.', 'lam')) },
  { t: 'A harmless change: who complains?', body: vt(REFACTOR, { title: 'terminal — store one more column (no behaviour change)', fs: 14 }) +
    box('Measured', 'The over-specified test turns red although nothing a user sees changed. The fake-based tests stay green. Ten such tests and every refactor becomes a day of “fixing tests”.', 'do2') },
  { t: 'Five smells and their fixes', body: zm(`<table class="t"><tr><th>Smell</th><th>Fix</th></tr>
    <tr><td>The mock returns the answer the test then checks</td><td>run the real logic; fake only I/O</td></tr>
    <tr><td>${c('toHaveBeenCalledWith')} on every internal call</td><td>assert the outcome (state)</td></tr>
    <tr><td>More setup lines for mocks than for the scenario</td><td>a reusable fake (repo, mailer)</td></tr>
    <tr><td>${c('vi.mock')} of your own business modules</td><td>inject dependencies (lesson 3.4)</td></tr>
    <tr><td>Every refactor turns tests red</td><td>test through the public behaviour</td></tr></table>`, 1.1) },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      'Rewrite the mock-heavy test with real bookLab, memory repo and fake mailer',
      'Run it with the status bug planted — it must turn red',
      'Rewrite the over-specified test to assert the stored booking instead',
    ]) + box('Done when', `${c('demo3/th33.test.js')}: 2 passed; with the status bug only the first is red; with the extra column both stay green.`, 'xanh') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>A test is worth what it would catch: plant a bug and look</li>
    <li>Mocking the code under test proves nothing about it</li>
    <li>Interaction checks on internals break on harmless changes</li>
    <li>Real logic + fake infrastructure catches the bug and survives the refactor</li>
    <li>Use mocks for outgoing side effects, not for the logic you are testing</li></ul>` },
]);
