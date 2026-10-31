/**
 * tst-03-4 — Testing · Chapter 3 · Lesson 3.4 "Designing code that is easy to test" (01/11/2026). Slug: tst-3-4-thiet-ke.
 * Output = chạy thật: book-hard không double ⇒ ECONNREFUSED; cần 2 vi.mock + đồng hồ giả (21 dòng) vs bản tiêm (11 dòng).
 */
import { lamDeck, js, vt, two, box, steps, c, zm, flow } from './_tst-chung.mjs';

export const deck = { key: 'tst-03-4', code: 'TST 3.4', title: 'Designing code that is easy to test', sub: 'injection, pure core, ports and adapters' };

const HARD = `import { pool } from './db.js';         // module-level connection pool
import { sendMail } from './smtp.js';     // module-level mail client

export async function bookHard(input) {
  const today = new Date().toISOString().slice(0, 10);   // the real clock
  if (input.date < today) throw new Error('PAST_DATE');
  …checkSlot…
  const clash = await pool.query('SELECT id FROM bookings WHERE …', […]);
  if (clash.rows.length > 0) throw new Error('OVERLAP');
  const { rows } = await pool.query('INSERT INTO bookings … RETURNING id', […]);
  await sendMail(input.email, 'Booking ' + status.toLowerCase());
  return { id: rows[0].id, status };
}`;
const THAT = ` × books BE-201 (no doubles at all) 7ms
AssertionError: promise rejected "Error: connect ECONNREFUSED 127.0.0.1:1 { …(5) }" instead of resolving
Caused by: Error: connect ECONNREFUSED 127.0.0.1:1
 ❯ bookHard demo3/kho/book-hard.js:11:17`;
const KHO = `vi.mock('./kho/db.js', () => ({ pool: { query: vi.fn() } }));
vi.mock('./kho/smtp.js', () => ({ sendMail: vi.fn() }));
beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date('2026-11-02T09:00:00+07:00')); });
afterEach(() => vi.useRealTimers());

it('books BE-201 (two module mocks, a frozen clock, queries in order)', async () => {
  vi.mocked(pool.query)
    .mockResolvedValueOnce({ rows: [] })            // 1st call must be the SELECT
    .mockResolvedValueOnce({ rows: [{ id: 7 }] });  // 2nd call must be the INSERT
  await expect(bookHard(input)).resolves.toEqual({ id: 7, status: 'CONFIRMED' });
  expect(sendMail).toHaveBeenCalledWith('an@fpt.edu.vn', 'Booking confirmed');
});`;
const DE = `it('books BE-201 (dependencies passed in)', async () => {
  const mailer = createFakeMailer();
  await expect(bookAndNotify({ repo: createMemoryRepo(), mailer }, input))
    .resolves.toMatchObject({ id: 1, status: 'CONFIRMED' });
  expect(mailer.outbox[0].to).toBe('an@fpt.edu.vn');
});`;
const CORE = `// Pure: which e-mail a booking needs. No I/O, so it is tested without any double.
export function buildMail(booking, studentEmail) {
  const when = booking.lab + ' on ' + booking.date + ' at ' + booking.start;
  if (booking.status === 'CONFIRMED') return { to: studentEmail, subject: 'Booking confirmed: ' + when };
  return { to: APPROVER, subject: 'Approval needed: ' + booking.seats + ' seats, ' + when };
}`;

export const slides = lamDeck({ chuong: 'Chapter 3 — Test doubles without lying to yourself', bai: '3.4' }, [
  { cover: true, t: 'Designing code<br>that is easy to test', sub: 'Chapter 3 · Lesson 3.4 — the same feature written twice, and what each costs the tests' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Code that reaches for the database, mailer and clock by itself</li>
    <li>What its test costs: two module mocks, a frozen clock, call order</li>
    <li>Passing dependencies in (lightweight dependency injection)</li>
    <li>A pure core with a thin I/O shell</li>
    <li>Ports and adapters, explained with LabFlow Lite</li></ul>` },
  { t: 'The “quick” version', body: js(HARD, { sm: true, hl: [1, 2, 5] }) + box('Three hidden inputs', 'A database pool, a mail client and the clock — none of them visible in the signature bookHard(input).', 'do2') },
  { t: 'Testing it without doubles', body: zm(vt(THAT, { title: 'terminal — DATABASE_URL=…127.0.0.1:1 npx vitest run demo3/kho-that.test.js', sm: false }), 1.05) +
    two(box('With no database', 'connect ECONNREFUSED — the test cannot even start the feature.', 'do2'), box('With a real one', 'It writes real rows and sends real e-mail on every run — and after 16 November it throws PAST_DATE.', 'do2')) +
    box('Every hidden input becomes a test problem', 'The pool, the mail client and the clock are not parameters, so the test cannot hand over stand-ins. It must patch modules (vi.mock) and freeze time.', 'lam') },
  { t: 'Testing it with doubles: 21 lines, 3 tricks', body: js(KHO, { sm: true, hl: [1, 2, 3, 8, 9] }) + box('Fragile', 'It knows that the SELECT comes before the INSERT. Swap the two queries, add a third, and the test breaks while the feature still works.', 'do2') },
  { t: 'Dependencies passed in: 11 lines, no tricks', body: js(DE, { hl: [3] }) + two(box('bookAndNotify({ repo, mailer, log }, input)', 'Everything it talks to is a parameter. Production passes the real ones, tests pass fakes. No vi.mock, no module order, no hoisting.', 'xanh'), box('Same green, measured', `${c('demo3/kho.test.js')} 21 lines · ${c('demo3/de-test.test.js')} 11 lines — both green; only the first one depends on the order of the SQL queries.`, 'lam')) },
  { t: 'A pure core: no doubles at all', body: js(CORE, { hl: [2] }) + js(`it.each([
  [{ ...base, status: 'CONFIRMED', seats: 20 }, 'an@fpt.edu.vn', 'Booking confirmed: BE-201 on 2026-11-16 at 08:00'],
  [{ ...base, status: 'PENDING', seats: 31 }, APPROVER, 'Approval needed: 31 seats, BE-201 on 2026-11-16 at 08:00'],
])('buildMail(%o) → %s', (booking, to, subject) => {
  expect(buildMail(booking, 'an@fpt.edu.vn')).toEqual({ to, subject });
});`, { sm: true }) + box('Functional core, imperative shell', `Decisions live in pure functions (${c('buildMail')}, ${c('checkSlot')}, ${c('needsApproval')}) and are tested with plain tables. A thin shell (${c('bookAndNotify')}) does the I/O and is tested with a few fakes.`, 'xanh') },
  { t: 'Ports and adapters in LabFlow Lite', body: flow([{ t: 'bookAndNotify', s: 'core: rules + flow', mau: '#336791' }, { t: 'port: mailer.send', s: 'what the core needs', mau: '#e08a1e' }, { t: 'createHttpMailer', s: 'adapter · production', mau: '#2f7d4f' }, { t: 'createFakeMailer', s: 'adapter · tests', mau: '#7a3d12' }], { h: 120, fs: 19 }) +
    flow([{ t: 'bookLab', s: 'core', mau: '#336791' }, { t: 'port: repo', s: 'findOverlap · insert', mau: '#e08a1e' }, { t: 'createMemoryRepo', s: 'adapter · tests', mau: '#7a3d12' }, { t: 'createPgRepo', s: 'adapter · Chapter 4', mau: '#2f7d4f' }], { h: 120, fs: 19 }) +
    box('Same idea in Spring Boot', 'Constructor injection: a @Service receives its repository and mail sender in the constructor; unit tests pass Mockito mocks or fakes, and the Spring context is not needed.', 'lam') },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      `Test ${c('buildMail')} with an ${c('it.each')} table — three rows, no doubles`,
      `Rewrite ${c('reminder.js')} as ${c('createReminder({ mailer })')}`,
      'Test it with the fake mailer — no vi.mock',
    ]) + box('Done when', `${c('demo3/th34.test.js')}: 4 passed.`, 'xanh') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Hidden dependencies make tests slow, fragile or impossible</li>
    <li>Pass dependencies in; give them small interfaces (ports)</li>
    <li>Keep decisions pure; keep I/O in a thin shell</li>
    <li>Adapters: real ones in production, fakes in tests</li>
    <li>Needing ${c('vi.mock')} for your own code is a design signal</li></ul>` },
]);
