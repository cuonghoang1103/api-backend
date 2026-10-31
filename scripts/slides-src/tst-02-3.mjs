/**
 * tst-02-3 — Testing · Chapter 2 · Lesson 2.3 "Testing errors and failure paths" (01/11/2026). Slug: tst-2-3-loi.
 * Output = chạy thật (demo2/loi, try-catch-bay với/không requireAssertions).
 */
import { lamDeck, js, vt, two, box, steps, c, zm, flow } from './_tst-chung.mjs';

export const deck = { key: 'tst-02-3', code: 'TST 2.3', title: 'Testing errors', sub: 'failure paths, causes, catch branches' };

const ERR = `export class BookingError extends Error {
  constructor(code, options) {
    super(code, options);          // options.cause keeps the original error
    this.name = 'BookingError';
    this.code = code;              // what the API and the UI switch on
  }
}`;
const CATCH = `  let clash;
  try {
    clash = await repo.findOverlap(input.lab, input.date, input.start, input.end);
  } catch (err) {
    throw new BookingError('STORAGE_DOWN', { cause: err });
  }
  if (clash) throw new BookingError('OVERLAP');`;
const ASSERT = `it('a rule violation is a BookingError with the rule code', async () => {
  const error = await bookLab(createMemoryRepo(), { ...input, start: '06:00' })
    .catch((e) => e);
  expect(error).toBeInstanceOf(BookingError);
  expect(error).toMatchObject({ name: 'BookingError', code: 'OUTSIDE_HOURS',
                                message: 'OUTSIDE_HOURS' });
});`;
const BROKEN = `it('a database failure becomes STORAGE_DOWN and keeps the original cause', async () => {
  const brokenRepo = {
    findOverlap: async () => { throw new Error('connect ECONNREFUSED 127.0.0.1:5432'); },
    insert: async () => { throw new Error('should not be called'); },
  };
  const error = await bookLab(brokenRepo, input).catch((e) => e);
  expect(error.code).toBe('STORAGE_DOWN');
  expect(error.cause.message).toBe('connect ECONNREFUSED 127.0.0.1:5432');
});`;
const LOI_OUT = ` ✓ demo2/loi.test.js (3 tests) 3ms
   ✓ bookLab — failure paths (3)
     ✓ a rule violation is a BookingError with the rule code 2ms
     ✓ a database failure becomes STORAGE_DOWN and keeps the original cause 0ms
     ✓ a failure while saving is also STORAGE_DOWN 0ms`;
const TRY = `it('rejects 06:00 (try/catch style — but the input is valid!)', async () => {
  try {
    await bookLab(createMemoryRepo(), input); // oops: 08:00, not 06:00
  } catch (err) {
    expect(err.code).toBe('OUTSIDE_HOURS');
  }
});`;
const TRY_LOOSE = ` ✓ demo2/try-catch-bay.test.js (1 test) 14ms
   ✓ rejects 06:00 (try/catch style — but the input is valid!) 14ms`;
const TRY_STRICT = ` × rejects 06:00 (try/catch style — but the input is valid!) 15ms
 FAIL  demo2/try-catch-bay.test.js > rejects 06:00 (try/catch style — but the input is valid!)
Error: expected any number of assertion, but got none`;

export const slides = lamDeck({ chuong: 'Chapter 2 — Async code, time and errors', bai: '2.3' }, [
  { cover: true, t: 'Testing errors<br>and failure paths', sub: 'Chapter 2 · Lesson 2.3 — error codes, causes and the catch branch nobody tests' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Errors are part of the contract: a class, a code, a cause</li>
    <li>Asserting an error: instance, code, message, cause</li>
    <li>Reaching the ${c('catch')} branch with a hand-made broken repository</li>
    <li>The try/catch test that passes when nothing is thrown</li>
    <li>A checklist of failure paths to guess before they happen</li></ul>` },
  { t: 'Errors are part of the contract', body: js(ERR, { hl: [3, 5] }) + two(box('Why a code', `The API maps ${c('OVERLAP')} to HTTP 409 and the UI shows “this slot is taken”. Tests assert the <b>code</b>, which is stable — not a long message that may be reworded.`, 'lam'), box('Why a cause', `${c('{ cause: err }')} keeps the original database error for the logs, while users see a clean ${c('STORAGE_DOWN')}.`, 'lam')) },
  { t: 'Asserting an error: instance, code, message', body: js(ASSERT, { sm: true }) +
    box('The .catch((e) => e) pattern', `Turns a rejection into a value, so you can make several assertions on the error object. ${c('rejects.toMatchObject')} is the one-line alternative.`, 'xanh') },
  { t: 'The catch branch nobody tests', body: js(CATCH, { hl: [4, 5] }) + box('Why it is forgotten', 'In development the database is always up, so this branch never runs. Without a test, deleting the try/catch — or throwing the wrong code — goes unnoticed until the first outage in production.', 'do2') },
  { t: 'Reach it with a broken repository', body: js(BROKEN, { sm: true }) + box('A hand-made fake', `Any object with the same two async methods will do. It throws on purpose so the code under test takes its ${c('catch')} branch. Chapter 3 names this a <b>stub</b>.`, 'lam') },
  { t: 'All three failure paths, green', body: zm(vt(LOI_OUT, { title: 'terminal — npx vitest run demo2/loi.test.js', sm: false }), 1.1) +
    flow([{ t: 'ECONNREFUSED', s: 'driver error', mau: '#7a3d12' }, { t: 'catch', s: 'in bookLab', mau: '#e08a1e' }, { t: 'STORAGE_DOWN', s: 'BookingError', mau: '#c0392b' }, { t: 'HTTP 503', s: 'Chapter 5', mau: '#336791' }], { h: 120, fs: 20 }) + box('Users and logs see different things', `The user gets a clean ${c('STORAGE_DOWN')} (later HTTP 503 “try again”); the log keeps ${c('error.cause')} — the real driver message an engineer needs at 2 a.m.`, 'lam') },
  { t: 'Trap: a try/catch test that passes when nothing throws', body: js(TRY, { sm: true }) + vt(TRY_LOOSE, { title: 'terminal — without requireAssertions: green!', sm: false }) +
    box('Why', `The input is valid, nothing is thrown, the ${c('catch')} block never runs, so no ${c('expect')} runs — and a test without a failing expect passes.`, 'do2') },
  { t: 'Two fixes', body: vt(TRY_STRICT, { title: 'terminal — with requireAssertions (our config)', fs: 15 }) + js(`it('rejects 06:00', async () => {
  await expect(bookLab(createMemoryRepo(), { ...input, start: '06:00' }))
    .rejects.toMatchObject({ code: 'OUTSIDE_HOURS' });
});`, { sm: true }) + two(box('Fix 1: assertion guard', `${c('requireAssertions')} in the config, or ${c('expect.assertions(1)')} in this one test.`, 'lam'), box('Fix 2 (better): no try/catch', `${c("await expect(bookLab(repo, bad)).rejects.toMatchObject({ code: 'OUTSIDE_HOURS' })")} fails loudly if nothing is thrown.`, 'xanh')) },
  { t: 'Guess the failures before they happen', body: zm(`<table class="t"><tr><th>Failure path</th><th>How to provoke it in a test</th><th>Expected</th></tr>
    <tr><td>Invalid input</td><td>06:00, 12:30, seats 0</td><td>rule code, DB never called</td></tr>
    <tr><td>Conflict</td><td>book the same slot twice</td><td>${c('OVERLAP')}</td></tr>
    <tr><td>Database down on read</td><td>repo whose ${c('findOverlap')} throws</td><td>${c('STORAGE_DOWN')} + cause</td></tr>
    <tr><td>Database fails on write</td><td>repo whose ${c('insert')} throws</td><td>${c('STORAGE_DOWN')}</td></tr>
    <tr><td>Never answers</td><td>a promise that never settles + fake timers</td><td>a timeout error (Chapter 3)</td></tr></table>`, 1.1) +
    box('Error guessing', 'This list is the experience-based technique from SWT301 6.1, written as code.', 'lam') },
  { t: 'Which assertion for which error?', body: `<table class="t"><tr><th>Code under test</th><th>Assertion</th></tr>
    <tr><td>sync function throws</td><td>${c('expect(() => fn()).toThrow(Class | /msg/)')}</td></tr>
    <tr><td>async function rejects</td><td>${c('await expect(fn()).rejects.toThrow(Class)')}</td></tr>
    <tr><td>need the code / cause</td><td>${c("await expect(p).rejects.toMatchObject({ code: 'X' })")}</td></tr>
    <tr><td>several checks on one error</td><td>${c('const e = await p.catch((e) => e)')} then ${c('expect(e)…')}</td></tr>
    <tr><td>avoid</td><td>try/catch without an assertion guard · ${c('toThrow()')} with no argument</td></tr></table>` },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      `A failing ${c('insert')} becomes ${c('STORAGE_DOWN')} with “disk full” as the cause`,
      `An invalid slot (08:00–12:30) never reaches the database — prove the repo was not called`,
      'Rewrite the try/catch trap with rejects',
      `Delete the first try/catch in ${c('bookLab')}: which test turns red?`,
    ]) + box('Done when', `${c('demo2/th23.test.js')}: 2 passed. Without the try/catch only the “database failure” test turns red — <b>expected undefined to be 'STORAGE_DOWN'</b>.`, 'xanh') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Give errors a class, a stable code and a cause</li>
    <li>Assert the code (and the cause), not the wording</li>
    <li>Reach catch branches with a repository that fails on purpose</li>
    <li>Try/catch tests can pass when nothing throws — prefer rejects</li>
    <li>List failure paths up front: invalid, conflict, down, slow</li></ul>` },
]);
