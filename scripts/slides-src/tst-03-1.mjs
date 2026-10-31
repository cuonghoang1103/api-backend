/**
 * tst-03-1 — Testing · Chapter 3 · Lesson 3.1 "Stub, mock, spy, fake: what each one is" (01/11/2026). Slug: tst-3-1-phan-loai.
 * Output = chạy thật (demo3/doubles.test.js, 6 test).
 */
import { lamDeck, js, vt, two, box, steps, c, zm } from './_tst-chung.mjs';

export const deck = { key: 'tst-03-1', code: 'TST 3.1', title: 'Test doubles', sub: 'dummy, stub, spy, mock, fake' };

const NOTIFY = `export async function bookAndNotify({ repo, mailer, log = console }, input) {
  const booking = await bookLab(repo, input);
  try {
    await mailer.send(buildMail(booking, input.email));
    return { ...booking, notified: true };
  } catch (err) {
    log.warn('mail failed for booking ' + booking.id + ': ' + err.message);
    return { ...booking, notified: false };
  }
}`;
const STUB = `it('dummy: the log is required but never used on this path', async () => {
  const dummyLog = {};                         // would crash if touched
  const booking = await bookAndNotify({ repo, mailer: { send: async () => 'x' }, log: dummyLog }, input);
  expect(booking.notified).toBe(true);
});
it('stub: a mailer that always fails, to reach the catch branch', async () => {
  const stubMailer = { send: async () => { throw new Error('SMTP down'); } };
  const booking = await bookAndNotify({ repo, mailer: stubMailer, log: { warn() {} } }, input);
  expect(booking).toMatchObject({ status: 'CONFIRMED', notified: false });
});`;
const SPY = `const send = vi.fn().mockResolvedValue('msg-1');          // spy
await bookAndNotify({ repo, mailer: { send } }, input);
expect(send).toHaveBeenCalledTimes(1);
expect(send).toHaveBeenCalledWith({ to: 'an@fpt.edu.vn',
  subject: 'Booking confirmed: BE-201 on 2026-11-16 at 08:00' });

const log = { warn: vi.fn() };                              // mock
const failing = { send: vi.fn().mockRejectedValue(new Error('SMTP down')) };
await bookAndNotify({ repo, mailer: failing, log }, input);
expect(log.warn).toHaveBeenCalledWith('mail failed for booking 1: SMTP down');`;
const FAKE = `export function createFakeMailer() {
  const outbox = [];
  return {
    outbox,
    async send(mail) { outbox.push(mail); return 'msg-' + outbox.length; },
  };
}

const mailer = createFakeMailer();
await bookAndNotify({ repo: createMemoryRepo(), mailer }, { ...input, seats: 31 });
expect(mailer.outbox).toEqual([{ to: APPROVER,
  subject: 'Approval needed: 31 seats, BE-201 on 2026-11-16 at 08:00' }]);`;
const OUT = ` ✓ demo3/doubles.test.js (6 tests) 83ms
   ✓ five kinds of test double around bookAndNotify (6)
     ✓ dummy: the log is required but never used on this path 14ms
     ✓ stub: a mailer that always fails, to reach the catch branch 14ms
     ✓ spy: vi.fn records how it was called 14ms
     ✓ mock: the expectation IS the test — a warning must be logged 15ms
     ✓ fake: a working in-memory mailer — assert on its state 12ms
     ✓ vi.spyOn: watch a real object without replacing what it does 14ms`;

export const slides = lamDeck({ chuong: 'Chapter 3 — Test doubles without lying to yourself', bai: '3.1' }, [
  { cover: true, t: 'Stub, mock, spy, fake:<br>what each one is', sub: 'Chapter 3 · Lesson 3.1 — five kinds of stand-in, one booking e-mail' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Why tests need stand-ins for e-mail, databases and clocks</li>
    <li>The five names — dummy, stub, spy, mock, fake — and what each one is for</li>
    <li>${c('vi.fn')} and ${c('vi.spyOn')} in Vitest</li>
    <li>State verification vs interaction verification</li>
    <li>A rule of thumb for choosing</li></ul>` },
  { t: 'New in LabFlow Lite: e-mail after booking', body: js(NOTIFY, { hl: [4, 7] }) + two(box('Two dependencies', `${c('repo')} stores the booking, ${c('mailer')} sends the e-mail. Both are <b>passed in</b>, so a test can hand over stand-ins.`, 'lam'), box('A rule inside', 'A failed e-mail must not undo a saved booking: it is logged and the result says notified: false.', 'lam')) },
  { t: 'Five kinds of test double', body: zm(`<table class="t"><tr><th>Double</th><th>What it does</th><th>In this lesson</th></tr>
    <tr><td><b>Dummy</b></td><td>fills a parameter, never used</td><td>an empty ${c('log')} object</td></tr>
    <tr><td><b>Stub</b></td><td>returns or throws canned answers</td><td>a mailer that always throws</td></tr>
    <tr><td><b>Spy</b></td><td>records calls, checked afterwards</td><td>${c('vi.fn()')} as ${c('send')}</td></tr>
    <tr><td><b>Mock</b></td><td>the expected call <i>is</i> the test</td><td>${c('log.warn')} must be called with…</td></tr>
    <tr><td><b>Fake</b></td><td>a small working implementation</td><td>in-memory repo, mailer with an outbox</td></tr></table>`, 1.12) +
    box('Where the names come from', 'Gerard Meszaros, <i>xUnit Test Patterns</i> (2007). “Test double” = the stunt double of a film. In Vitest all of them are built from plain objects, <code class="i">vi.fn</code> and <code class="i">vi.spyOn</code>.', 'lam') },
  { t: 'Dummy and stub', body: js(STUB, { sm: true, hl: [7] }) + box('Stub = control the input from a dependency', 'The stub makes the mailer fail on purpose — the same trick as the broken repository of lesson 2.3 — so the catch branch runs.', 'xanh') },
  { t: 'Spy and mock with vi.fn', body: js(SPY, { hl: [3, 4, 10] }) + two(box('Spy', 'Records every call; you decide afterwards what matters.', 'lam'), box('Mock', 'The test exists to check this interaction: “a warning is logged”.', 'lam')) },
  { t: 'Fake: a small working implementation', body: js(FAKE, { sm: true, hl: [5, 11] }) + box('State verification', `Instead of asking “was ${c('send')} called with…”, look at the result: what is in the outbox. Fakes are reusable across many tests.`, 'xanh') },
  { t: 'Six doubles, six green tests', body: zm(vt(OUT, { title: 'terminal — npx vitest run demo3/doubles.test.js', sm: false }), 1.05) +
    box('vi.spyOn on a real object', `${c("vi.spyOn(mailer, 'send')")} counts the calls while the real fake still runs — the outbox has one mail. ${c('restoreMocks: true')} in our config puts it back after the test.`, 'lam') },
  { t: 'State or interaction?', body: two(box('Assert state (preferred)', `<ul style="font-size:20px"><li>outbox, stored rows, returned value</li><li>survives refactoring</li><li>needs a fake or the real thing</li></ul>`, 'xanh'), box('Assert interaction', `<ul style="font-size:20px"><li>${c('toHaveBeenCalledWith')}</li><li>right when the call <b>is</b> the behaviour (send mail, log, charge a card)</li><li>breaks when internals change</li></ul>`, 'do2')) +
    box('Rule of thumb', 'Use the real thing when it is fast and deterministic (pure rules). Use a fake for storage. Use a stub to force errors. Use a spy/mock only for outgoing side effects nobody can observe otherwise.', 'lam') },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      'A 31-seat booking e-mails the approver — use the fake mailer',
      'A failing mailer keeps the booking stored (repo.count() is 1) — use a stub',
      'The approver mail mentions “31 seats” — use a spy with expect.stringContaining',
    ]) + box('Done when', `${c('demo3/th31.test.js')}: 3 passed.`, 'xanh') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>A test double stands in for a slow or uncontrollable dependency</li>
    <li>Dummy fills, stub answers, spy records, mock expects, fake works</li>
    <li>${c('vi.fn')} creates spies/stubs; ${c('vi.spyOn')} watches a real object</li>
    <li>Prefer asserting state; assert interactions only for side effects</li>
    <li>Dependencies passed in = doubles are easy</li></ul>` },
]);
