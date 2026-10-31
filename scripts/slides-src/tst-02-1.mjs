/**
 * tst-02-1 — Testing · Chapter 2 · Lesson 2.1 "Testing async code" (01/11/2026). Slug bài: tst-2-1-async.
 * Output = chạy thật Node 22.23.3 + Vitest 5.0.5 (demo2/async-quen, async-dung, dua, treo).
 */
import { lamDeck, js, vt, two, box, steps, c, zm } from './_tst-chung.mjs';

export const deck = { key: 'tst-02-1', code: 'TST 2.1', title: 'Testing async code', sub: 'await, resolves, rejects, races, timeouts' };

const SVC = `export async function bookLab(repo, input) {
  const slot = checkSlot(input.start, input.end);
  if (!slot.ok) throw new BookingError(slot.code);
  const clash = await repo.findOverlap(input.lab, input.date,
                                       input.start, input.end);
  if (clash) throw new BookingError('OVERLAP');
  return await repo.insert({ ...input, minutes: slot.minutes, status });
}   // simplified — the full file has try/catch (lesson 2.3)`;
const QUEN = `it('forgot to await: …', () => {
  const repo = createMemoryRepo();
  bookLab(repo, input).then((booking) => {
    expect(booking.status).toBe('WRONG ON PURPOSE');
  });
});`;
const QUEN_OUT = ` ❯ demo2/async-quen.test.js (2 tests | 1 failed) 6ms
   ✓ forgot to await: the assertion runs after the test has ended 1ms
…
⎯⎯⎯⎯ Unhandled Rejection ⎯⎯⎯⎯⎯
AssertionError: expected 'CONFIRMED' to be 'WRONG ON PURPOSE' // Object.is equality`;
const REJ_OUT = ` FAIL  demo2/async-quen.test.js > forgot to await rejects
Error: Promise returned by \`expect(actual).rejects.toThrow(expected)\` was not awaited. …

await expect(actual).rejects.toThrow(expected)`;
const STRICT_OUT = ` × forgot to await: the assertion runs after the test has ended 3ms
…
 FAIL  demo2/async-quen.test.js > forgot to await: the assertion runs after the test has ended
Error: expected any number of assertion, but got none`;
const DUNG = `it('stores a confirmed booking', async () => {
  const booking = await bookLab(createMemoryRepo(), input);
  expect(booking).toMatchObject({ id: 1, status: 'CONFIRMED', minutes: 120 });
});

it('rejects a second booking of the same slot with OVERLAP', async () => {
  const repo = createMemoryRepo();
  await bookLab(repo, input);
  await expect(bookLab(repo, input)).rejects.toThrow(BookingError);
  await expect(bookLab(repo, input)).rejects.toMatchObject({ code: 'OVERLAP' });
});`;
const DUNG_OUT = ` ✓ demo2/async-dung.test.js (4 tests) 93ms
   ✓ bookLab (async) (4)
     ✓ stores a confirmed booking — await the result, then assert 15ms
     ✓ resolves: assert on the promise itself 12ms
     ✓ rejects a second booking of the same slot with OVERLAP 39ms
     ✓ allows the next slot right after (10:00–12:00) 25ms`;
const DUA = `const results = await Promise.allSettled([bookLab(repo, input), bookLab(repo, input)]);
expect(results.map((r) => r.status).sort()).toEqual(['fulfilled', 'rejected']);`;
const DUA_OUT = ` FAIL  demo2/dua.test.js > two students book the same slot at the same moment: only one wins
AssertionError: expected [ 'fulfilled', 'fulfilled' ] to deeply equal [ 'fulfilled', 'rejected' ]`;
const FAILS_OUT = ` ✓ demo2/dua.test.js (1 test) 17ms
   ✓ two students book the same slot at the same moment: only one wins 17ms

 Test Files  1 passed (1)
      Tests  1 expected fail (1)`;
const TREO_OUT = ` ❯ demo2/treo.test.js (1 test | 1 failed) 5006ms
   × waits for a confirmation e-mail that never comes 5005ms

 FAIL  demo2/treo.test.js > waits for a confirmation e-mail that never comes
Error: Test timed out in 5000ms.
If this is a long-running test, pass a timeout value as the last argument or configure it globally with "testTimeout".`;

export const slides = lamDeck({ chuong: 'Chapter 2 — Async code, time and errors', bai: '2.1' }, [
  { cover: true, t: 'Testing async code', sub: 'Chapter 2 · Lesson 2.1 — await, resolves/rejects, races and timeouts' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Why a forgotten ${c('await')} can turn a wrong test green</li>
    <li>${c('async')} tests, ${c('resolves')} and ${c('rejects')} — always awaited</li>
    <li>How ${c('requireAssertions')} and Vitest catch the forgotten await</li>
    <li>A real race: two bookings of the same slot at the same moment</li>
    <li>${c('it.fails')} to document a known bug</li>
    <li>Timeouts: what a promise that never settles looks like</li></ul>` },
  { t: 'Most backend code is async', body: js(SVC, { hl: [4, 7] }) + box('Why it matters for tests', `${c('findOverlap')} and ${c('insert')} talk to a database, so they return <b>promises</b>. The test must wait for them — otherwise it ends before the work is done.`, 'lam') },
  { t: 'Trap 1: .then without await — the test is green', body: js(QUEN, { sm: true }) + vt(QUEN_OUT, { title: 'terminal — without requireAssertions', fs: 14 }) +
    box('What happened', 'The test function returned before the promise settled, so it passed. The failing expect ran <b>later</b> and surfaced only as an “Unhandled Rejection” — if the file was still running. Next time it may vanish.', 'do2') },
  { t: 'Trap 2: rejects without await', body: js(`it('forgot to await rejects', () => {
  expect(bookLab(repo, { ...input, start: '06:00' }))
    .rejects.toThrow('THIS IS NOT THE CODE');
});`, { sm: true }) + vt(REJ_OUT, { title: 'terminal — Vitest 5 detects it', fs: 14 }) +
    box('Good news', `Vitest 5 fails the test and even prints the fix: ${c('await expect(actual).rejects.toThrow(expected)')}.`, 'xanh') },
  { t: 'requireAssertions catches trap 1 as well', body: js(`// vitest.config.js (since Lab 1)
export default defineConfig({
  test: {
    reporters: ['tree'],
    expect: { requireAssertions: true },
  },
});`, { hl: [5] }) + vt(STRICT_OUT, { title: 'terminal — with expect.requireAssertions: true (Lab 1 config)', fs: 15 }) +
    box('Why', `When the test function returns, no ${c('expect')} has run yet — so “expected any number of assertion, but got none”. One config line, both traps covered.`, 'xanh') },
  { t: 'The right way: async test + await', body: js(DUNG, { sm: true }) + two(box('resolves', `${c('await expect(promise).resolves.toMatchObject(…)')} — asserts the value the promise fulfils with.`, 'lam'), box('rejects', `${c('await expect(promise).rejects.toThrow(Class)')} or ${c('.toMatchObject({ code })')} — asserts the error.`, 'lam')) },
  { t: 'Four async tests, all green', body: zm(vt(DUNG_OUT, { title: 'terminal — Vitest 5.0.5', sm: false }), 1.1) + box('Note the times', 'Each test takes 10–40 ms because the in-memory repo waits 5 ms per call, like a database round trip. Still fast — but no longer microseconds.', 'lam') },
  { t: 'A real race: two students, one slot, same moment', body: js(DUA, { sm: true }) + vt(DUA_OUT, { title: 'terminal — both bookings succeeded', fs: 13 }) +
    two(box('The bug the async test found', 'Both requests checked for an overlap <b>before</b> either had inserted, so both saw a free slot.', 'do2'), box('Why allSettled', `${c('Promise.allSettled')} starts both bookings at once and waits for both — even if one rejects — so you can count winners and losers.`, 'lam')) },
  { t: 'Why both succeed: the timeline', body: zm(`<table class="t"><tr><th>Time</th><th>Booking A</th><th>Booking B</th></tr>
    <tr><td>0 ms</td><td>${c('checkSlot')} ok</td><td>${c('checkSlot')} ok</td></tr>
    <tr><td>0–5 ms</td><td>${c('findOverlap')} … waiting</td><td>${c('findOverlap')} … waiting</td></tr>
    <tr><td>5 ms</td><td>no clash found</td><td>no clash found</td></tr>
    <tr><td>5–10 ms</td><td>${c('insert')} → id 1</td><td>${c('insert')} → id 2</td></tr></table>`, 1.15) +
    box('The real fix', '“Check, then write” is not atomic. A database constraint does it in one step — Chapter 4 adds an exclusion constraint in PostgreSQL and this test goes green.', 'xanh') },
  { t: 'it.fails: document a known bug honestly', body: js(`// Known bug: check-then-insert is not atomic — fixed in Chapter 4 (DB constraint)
it.fails('two students book the same slot … only one wins', async () => { … });`) + vt(FAILS_OUT, { title: 'terminal', sm: false }) +
    box('Better than skip', `${c('it.fails')} passes while the bug exists and turns <b>red when someone fixes it</b> — reminding them to switch it back to ${c('it')}.`, 'xanh') },
  { t: 'Timeouts: a promise that never settles', body: js(`it('waits for a confirmation e-mail that never comes', async () => {
  const sent = await new Promise(() => {}); // never resolves
  expect(sent).toBe(true);
});`, { sm: true }) + vt(TREO_OUT, { title: 'terminal — 5 seconds wasted', fs: 14 }) +
    box('Rule', `The default ${c('testTimeout')} is 5000 ms. Do not just raise it — find what never resolves (a missing mock, a real network call) or control the time (lesson 2.2).`, 'lam') },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      'Rewrite both “forgot to await” tests correctly',
      `Test that a 31-seat student booking is stored as ${c('PENDING')}, using ${c('resolves')}`,
      'Test that the same slot in another lab (BE-305) is accepted',
      `Mark the race test with ${c('it.fails')} and add a comment pointing to Chapter 4`,
    ]) + box('Done when', `${c('demo2/th21.test.js')} shows 4 passed, and ${c('demo2/dua.test.js')} with ${c('it.fails')} reports “1 expected fail”.`, 'xanh') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Async code returns promises — the test must ${c('await')} them</li>
    <li>${c('.then')} without await can be green while wrong; un-awaited ${c('rejects')} fails in Vitest 5</li>
    <li>${c('requireAssertions')} catches assertions that run too late</li>
    <li>${c('await expect(p).resolves')} / ${c('rejects')} for values and errors</li>
    <li>Async tests can reveal races; ${c('it.fails')} documents a known bug</li>
    <li>A 5000 ms timeout means something never settled — fix the cause</li></ul>` },
]);
