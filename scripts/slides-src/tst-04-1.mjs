/**
 * tst-04-1 — Testing · Chapter 4 · Lesson 4.1 "Why a real database beats a mocked one" (01/11/2026). Slug: tst-4-1-vi-sao.
 * Output = chạy thật trên PostgreSQL 17 (Testcontainers): lỗi tranh chấp Ch2 không ràng buộc ⇒ 2 lượt đặt; có EXCLUDE ⇒ 23P01 ⇒ OVERLAP.
 */
import { lamDeck, js, vt, two, box, steps, c, zm } from './_tst-chung.mjs';

export const deck = { key: 'tst-04-1', code: 'TST 4.1', title: 'Why a real database', sub: 'bugs that only real SQL shows' };

const REPO = `async findOverlap(lab, date, start, end) {
  const { rows } = await db.query(
    'SELECT id FROM bookings WHERE lab = $1 AND date = $2 AND start_time < $4 AND $3 < end_time LIMIT 1',
    [lab, date, start, end]);
  return rows[0] ?? null;
},
async insert(b) {
  try { … INSERT INTO bookings (…) VALUES ($1, …, $9) RETURNING id … }
  catch (err) {
    if (err.code === '23P01') throw new BookingError('OVERLAP', { cause: err }); // exclusion_violation
    throw err;
  }
}`;
const SCHEMA = `CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE bookings (
  id serial PRIMARY KEY,  lab text NOT NULL,  date date NOT NULL,
  start_time time NOT NULL,  end_time time NOT NULL,
  seats int NOT NULL CHECK (seats > 0),  …
  CONSTRAINT no_overlap EXCLUDE USING gist (
    lab WITH =,
    tsrange(date + start_time, date + end_time, '[)') WITH &&
  )
);`;
const KHONG = `$ TST_SCHEMA=demo4/schema-khong-rang-buoc.sql npm run test:int -- demo4/dua.int.test.js
[setup] PostgreSQL container ready in … ms
 ❯ demo4/dua.int.test.js (1 test | 1 failed)
   × two students book the same slot at the same moment: only one wins (real PostgreSQL)
AssertionError: expected [ 'fulfilled', 'fulfilled' ] to deeply equal [ 'fulfilled', 'rejected' ]`;
const CO = `$ npm run test:int -- demo4/dua.int.test.js demo4/sqlite-vs-pg.int.test.js
[setup] PostgreSQL container ready in 1156 ms
 ✓ demo4/dua.int.test.js (1 test) 24ms
   ✓ two students book the same slot at the same moment: only one wins (real PostgreSQL) 22ms
 ✓ demo4/sqlite-vs-pg.int.test.js (2 tests) 20ms
   ✓ SQLite stores the text "thirty" in an INTEGER column 1ms
   ✓ PostgreSQL refuses it: 22P02 invalid input syntax for type integer 18ms`;
const SQLITE = `db.exec('CREATE TABLE bookings (id INTEGER PRIMARY KEY, seats INTEGER NOT NULL)');
db.prepare('INSERT INTO bookings (seats) VALUES (?)').run('thirty');
// → { seats: 'thirty', type: 'text' }   (node:sqlite, SQLite's “type affinity”)

await client.query('INSERT INTO bookings (…, seats, …) VALUES (…, $1, …)', ['thirty']);
// → error 22P02: invalid input syntax for type integer: "thirty"`;

export const slides = lamDeck({ chuong: 'Chapter 4 — Integration tests with a real database', bai: '4.1' }, [
  { cover: true, t: 'Why a real database<br>beats a mocked one', sub: 'Chapter 4 · Lesson 4.1 — the Chapter 2 race, finally fixed and proven' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>A PostgreSQL adapter for the same repository port</li>
    <li>The Chapter 2 race on real PostgreSQL — and the constraint that ends it</li>
    <li>Why SQLite in tests does not prove PostgreSQL works</li>
    <li>Which bugs only a real database can show</li>
    <li>What it costs, measured</li></ul>` },
  { t: 'createPgRepo: the same port, real SQL', body: js(REPO, { sm: true, hl: [3, 10] }) + box('Same two methods as createMemoryRepo', `${c('bookLab')} does not change — that is the ports-and-adapters idea from lesson 3.4. Only the adapter now speaks SQL, and translates the database’s error code ${c('23P01')} into our ${c('OVERLAP')}.`, 'lam') },
  { t: 'BR-04 inside the database', body: js(SCHEMA, { sm: true, hl: [7, 8, 9] }) + two(box('EXCLUDE … WITH &&', 'No two rows of the same lab may have overlapping time ranges. The database checks it atomically, for every connection, every server.', 'xanh'), box("'[)'", 'Start included, end excluded: 08:00–10:00 and 10:00–12:00 do not overlap. btree_gist lets “lab WITH =” join the index.', 'lam')) },
  { t: 'The Chapter 2 race, on real PostgreSQL', body: vt(KHONG, { title: 'terminal — schema WITHOUT the constraint', fs: 14 }) +
    box('The bug is real, not an artefact of the fake', 'Two connections check “is it free?” before either inserts — both win, BE-201 is double-booked. The in-memory repo showed it in Chapter 2; PostgreSQL shows it the same way.', 'do2') },
  { t: 'With the constraint: one wins, one gets OVERLAP', body: vt(CO, { title: 'terminal — npm run test:int', fs: 14 }) +
    two(box('Who stopped it?', `In five runs the rejected booking’s ${c('cause.code')} was ${c('23P01')} every time: the <b>database</b> caught what ${c('findOverlap')} could not.`, 'xanh'), box('One line in bookLab', `${c('if (err instanceof BookingError) throw err;')} — otherwise the catch from lesson 2.3 would turn OVERLAP into STORAGE_DOWN.`, 'lam')) },
  { t: 'SQLite is not PostgreSQL', body: js(SQLITE, { hl: [3, 6] }) + two(box('Same SQL, different rules', 'SQLite happily stores text in an INTEGER column (“type affinity”); PostgreSQL refuses it with 22P02.', 'do2'), box('What it means for tests', 'A suite on a different engine can pass while production fails. Test against the database — and the major version — you deploy.', 'lam')) + box('Measured', `Both behaviours are green tests in ${c('demo4/sqlite-vs-pg.int.test.js')} (Node’s built-in ${c('node:sqlite')} prints an ExperimentalWarning in Node 22).`, 'xanh') },
  { t: 'Bugs only a real database shows', body: zm(`<table class="t"><tr><th>Bug</th><th>Fake repo</th><th>Real PostgreSQL</th></tr>
    <tr><td>Concurrent check-then-insert</td><td>only if you simulate it</td><td>caught by the constraint</td></tr>
    <tr><td>SQL typo, wrong placeholder ($3 vs $4)</td><td>never runs SQL</td><td>error or wrong rows</td></tr>
    <tr><td>Types: text in int, “25:00” as time</td><td>accepts anything</td><td>22P02, 22008</td></tr>
    <tr><td>CHECK / NOT NULL / UNIQUE</td><td>not modelled</td><td>23514, 23502, 23505</td></tr>
    <tr><td>Boundaries in SQL (&lt; vs &lt;=)</td><td>its own JS, not your SQL</td><td>exactly your query</td></tr></table>`, 1.08) },
  { t: 'What it costs, measured', body: zm(`<table class="t"><tr><th>Suite</th><th>Tests</th><th>Time (Vitest)</th></tr>
    <tr><td>Unit (${c('npm run test:unit')})</td><td>73</td><td>0.24 s</td></tr>
    <tr><td>Integration, fresh PostgreSQL 17 per run</td><td>11</td><td>1.85 s (container ready in ≈ 1.2–2.1 s)</td></tr></table>`, 1.15) +
    box('So keep both', 'Rules and decisions in fast unit tests (Chapters 1–3); a smaller set of integration tests for SQL, constraints and transactions. That is the pyramid of lesson 0.2, now with real numbers.', 'xanh') },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      `Turn the Chapter 2 ${c('it.fails')} race into a passing PostgreSQL test: exactly one row in the table`,
      `Insert an end time of ${c("'25:00'")} and assert PostgreSQL’s error code`,
    ]) + box('Done when', `${c('npm run test:int -- demo4/th41.int.test.js')}: 2 passed.`, 'xanh') + box('Hint', `Insert straight through ${c('createPgRepo(pool).insert')} so the database, not your JavaScript, has to refuse it.`, 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Same port, new adapter: ${c('createPgRepo')}</li>
    <li>The race is real; an exclusion constraint makes the database refuse it</li>
    <li>Map database error codes (${c('23P01')}) to your own (${c('OVERLAP')})</li>
    <li>SQLite ≠ PostgreSQL: test the engine you deploy</li>
    <li>Integration tests cost seconds — keep them few and focused</li></ul>` },
]);
