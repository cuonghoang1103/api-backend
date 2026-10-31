/**
 * tst-04-4 — Testing · Chapter 4 · Lesson 4.4 "Isolation: transactions, truncation, seed data" (01/11/2026). Slug: tst-4-4-co-lap.
 * Output = chạy thật: rò dữ liệu giữa 2 test (B đỏ OVERLAP); 20 test TRUNCATE 69 ms vs 20 test ROLLBACK 54 ms.
 */
import { lamDeck, js, vt, two, box, steps, c, zm } from './_tst-chung.mjs';

export const deck = { key: 'tst-04-4', code: 'TST 4.4', title: 'Isolation between tests', sub: 'truncate, rollback, factories' };

const RORI = `it('A: a student books BE-201 at 08:00', async () => {
  await expect(bookLab(createPgRepo(pool), input)).resolves.toMatchObject({ status: 'CONFIRMED' });
});

it('B: a lecturer books BE-201 at 08:00 for 40 seats', async () => {
  await expect(bookLab(createPgRepo(pool), { ...input, role: 'LECTURER', seats: 40 }))
    .resolves.toMatchObject({ status: 'CONFIRMED' });
});`;
const RORI_OUT = ` ❯ demo4/ro-ri.int.test.js (2 tests | 1 failed) 25ms
   ✓ A: a student books BE-201 at 08:00 19ms
   × B: a lecturer books BE-201 at 08:00 for 40 seats 4ms
AssertionError: promise rejected "BookingError: OVERLAP { code: 'OVERL…' }" instead of resolving`;
const TRUNC = `beforeEach(() => pool.query('TRUNCATE bookings RESTART IDENTITY'));`;
const TX = `beforeEach(async () => {
  client = await pool.connect();          // one connection for the whole test…
  await client.query('BEGIN');
});
afterEach(async () => {
  await client.query('ROLLBACK');         // …and nothing it wrote survives
  client.release();
});
// in the test: bookLab(createPgRepo(client), input)`;
const DO = ` ✓ demo4/truncate.int.test.js (20 tests) 77ms
 ✓ demo4/giao-dich.int.test.js (20 tests) 56ms
      Tests  40 passed (40)`;
const FACTORY = `let n = 0;
// A valid booking with sensible defaults; each call gets its own lab
export function makeBooking(overrides = {}) {
  n += 1;
  return { lab: 'LAB-' + n, date: '2026-11-16', seats: 20, role: 'STUDENT',
           start: '08:00', end: '10:00', ...overrides };
}

const booking = await bookLab(repo, makeBooking({ seats: 31 }));   // only what matters`;

export const slides = lamDeck({ chuong: 'Chapter 4 — Integration tests with a real database', bai: '4.4' }, [
  { cover: true, t: 'Isolation: transactions,<br>truncation, seed data', sub: 'Chapter 4 · Lesson 4.4 — a shared database is shared state' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>How one test’s rows break the next test — measured</li>
    <li>Isolation 1: TRUNCATE before each test</li>
    <li>Isolation 2: a transaction per test, rolled back</li>
    <li>Why test files take turns on one database</li>
    <li>Factories: test data with sensible defaults</li></ul>` },
  { t: 'Two tests, no cleanup', body: js(RORI) + two(box('Each test is correct on its own', 'A lecturer may book 40 seats without approval (Lite-2). Run alone, B passes.', 'lam'), box('Together they are not', 'Run after A, BE-201 at 08:00 is already taken — the database remembers what A did.', 'do2')) + vt(' ↓ A: a student books BE-201 at 08:00\n ✓ B: a lecturer books BE-201 at 08:00 for 40 seats', { title: 'npm run test:int -- demo4/ro-ri.int.test.js -t lecturer  (B alone)', fs: 15 }) },
  { t: 'The second test inherits the first test’s row', body: zm(vt(RORI_OUT, { title: 'terminal — npm run test:int -- demo4/ro-ri.int.test.js', fs: 15 }), 1.12) +
    two(box('A passes', 'It found BE-201 free and booked it — and nothing removed that row afterwards.', 'lam'), box('B fails', 'Same slot, same lab: OVERLAP, exactly as the constraint should answer.', 'lam')) +
    box('Order-dependent again', 'The same disease as the leaked mock of lesson 2.4 — this time the leaked state is a row in a table. In a big suite it shows up as “fails on CI, passes on my machine”.', 'do2') },
  { t: 'Isolation 1: TRUNCATE before each test', body: zm(js(TRUNC), 1.2) + js(`// test/integration/pgRepo.int.test.js
beforeAll(() => { pool = openPool(); repo = createPgRepo(pool); });
beforeEach(() => pool.query('TRUNCATE bookings RESTART IDENTITY'));
afterAll(() => pool.end());`, { sm: true }) + two(box('What it does', `Deletes every row and, with ${c('RESTART IDENTITY')}, resets ${c('serial')} ids to 1 — so ${c('id: 1')} assertions are stable.`, 'lam'), box('Works with anything', 'Concurrent tests (the race), several connections, code that commits — all fine, because the table really is emptied.', 'xanh')) },
  { t: 'Isolation 2: a transaction per test', body: js(TX, { hl: [3, 6] }) + box('Limit', `All queries must go through that one ${c('client')}. It cannot test concurrency (the race needs two connections) or code that commits on its own. Use TRUNCATE there.`, 'do2') },
  { t: 'Both work — measured', body: zm(vt(DO, { title: 'terminal — 20 tests each', sm: false }), 1.3) + box('Our numbers', '20 rolled-back tests 56 ms, 20 truncated tests 77 ms — close at this size. Choose by what the test needs, not by a few milliseconds.', 'lam') },
  { t: 'One database: files take turns', body: zm(`<table class="t"><tr><th>Option</th><th>Isolation between files</th><th>Cost</th></tr>
    <tr><td>${c('fileParallelism: false')} (this course)</td><td>files run one after another</td><td>slower as the suite grows</td></tr>
    <tr><td>One schema or database per worker</td><td>full, files in parallel</td><td>more setup code</td></tr>
    <tr><td>Fresh database per run (global setup)</td><td>between runs, not between tests</td><td>needs TRUNCATE/ROLLBACK as well</td></tr></table>`, 1.1) +
    box('Why it matters', 'With parallel files, a TRUNCATE in file A can empty the table in the middle of a test in file B — a failure you can never reproduce on demand.', 'do2') },
  { t: 'Factories: data with sensible defaults', body: js(FACTORY, { hl: [9] }) + box('Only what matters is visible', 'The test says “31 seats”; everything else is a valid default. A unique lab per call means two tests do not collide by accident.', 'xanh') },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      'Inside a rolled-back transaction, store a 31-seat booking and read its status back with SQL',
      'In the next test, prove the table is empty',
      `Use ${c('makeBooking')} for the data`,
    ]) + box('Done when', `${c('npm run test:int -- demo4/th44.int.test.js')}: 2 passed.`, 'xanh') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>A shared database is shared state: rows leak between tests</li>
    <li>TRUNCATE … RESTART IDENTITY: simple, works with concurrency</li>
    <li>BEGIN/ROLLBACK: clean, but one connection, no commits</li>
    <li>One database ⇒ files take turns (or one schema per worker)</li>
    <li>Factories keep test data short and collision-free</li></ul>` },
]);
