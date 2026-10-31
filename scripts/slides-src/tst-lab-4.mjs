/**
 * tst-lab-4 — Testing · Chapter 4 · Lab 4 "Integration tests for the PostgreSQL adapter — kill 8 mutants" (01/11/2026).
 * Slug bài: tst-4-5-lab-tich-hop. Output = chạy thật: bộ yếu 3 test xanh → 0/8; lời giải 11 test → 8/8 (mỗi đột biến một PostgreSQL mới).
 */
import { lamDeck, vt, two, box, steps, c, zm } from './_tst-chung.mjs';

export const deck = { key: 'tst-lab-4', code: 'TST Lab 4', title: 'Lab 4 — the database adapter', sub: 'kill 8 mutants in SQL and schema' };

const WEAK_RUN = ` ✓ test/integration/weak4.int.test.js (3 tests) 30ms
   ✓ stores a booking in PostgreSQL 22ms
   ✓ finds an overlapping booking 3ms
   ✓ rejects the same booking twice 3ms`;
const WEAK = `✘ SURVIVED  #1 a booking ending at 10:00 blocks one starting at 10:00
✘ SURVIVED  #2 a booking starting at 10:00 blocks one ending at 10:00
✘ SURVIVED  #3 a booking in any lab blocks the slot
✘ SURVIVED  #4 a booking on any day blocks the slot
✘ SURVIVED  #5 constraint violation not recognised
✘ SURVIVED  #6 constraint treats back-to-back bookings as overlapping
✘ SURVIVED  #7 database accepts 0 seats
✘ SURVIVED  #8 OVERLAP from the database becomes STORAGE_DOWN

0/8 mutants killed`;
const STRONG = `✔ killed    #1 a booking ending at 10:00 blocks one starting at 10:00
✔ killed    #2 a booking starting at 10:00 blocks one ending at 10:00
✔ killed    #3 a booking in any lab blocks the slot
✔ killed    #4 a booking on any day blocks the slot
✔ killed    #5 constraint violation not recognised
✔ killed    #6 constraint treats back-to-back bookings as overlapping
✔ killed    #7 database accepts 0 seats
✔ killed    #8 OVERLAP from the database becomes STORAGE_DOWN

8/8 mutants killed`;

export const slides = lamDeck({ chuong: 'Chapter 4 — Integration tests with a real database', bai: 'Lab 4' }, [
  { cover: true, t: 'Lab 4 — the database adapter:<br>kill 8 mutants', sub: 'Chapter 4 lab · 75 minutes · every mutant gets a fresh PostgreSQL' },
  { t: 'Your mission', to: true, giua: true, body: steps([
      `Write ${c('test/integration/pgRepo.int.test.js')} for ${c('createPgRepo')}, the schema and ${c('bookLab')} on PostgreSQL`,
      'Isolated tests: TRUNCATE (or ROLLBACK) — every test starts empty',
      `Run ${c('node scripts/dot-bien-4.mjs')}: 8 bugs in SQL, schema and error mapping`,
      'A good suite turns red for every one — 8/8 “killed”',
    ]) + box('New this time', 'Two mutants change the schema file, not JavaScript. Only a test against a real database can notice them.', 'lam') },
  { t: 'The 8 planted bugs', body: zm(`<table class="t" style="font-size:17px"><tr><th>#</th><th>File</th><th>Original</th><th>Planted bug</th></tr>
    <tr><td>1</td><td>pgRepo.js</td><td>${c('start_time < $4')}</td><td>${c('start_time <= $4')}</td></tr>
    <tr><td>2</td><td>pgRepo.js</td><td>${c('$3 < end_time')}</td><td>${c('$3 <= end_time')}</td></tr>
    <tr><td>3</td><td>pgRepo.js</td><td>${c('lab = $1 AND')}</td><td>${c('$1::text IS NOT NULL AND')}</td></tr>
    <tr><td>4</td><td>pgRepo.js</td><td>${c('date = $2 AND')}</td><td>${c('$2::date IS NOT NULL AND')}</td></tr>
    <tr><td>5</td><td>pgRepo.js</td><td>${c("err.code === '23P01'")}</td><td>${c("err.code === '23505'")}</td></tr>
    <tr><td>6</td><td>schema.sql</td><td>${c("'[)'")}</td><td>${c("'[]'")}</td></tr>
    <tr><td>7</td><td>schema.sql</td><td>${c('NOT NULL CHECK (seats > 0)')}</td><td>${c('NOT NULL')}</td></tr>
    <tr><td>8</td><td>service.js</td><td>${c('if (err instanceof BookingError) throw err;')}</td><td>(removed)</td></tr></table>`, 1.02) },
  { t: 'A typical first attempt: 0 of 8', body: vt(WEAK_RUN, { title: 'terminal — 3 tests, all green', fs: 16 }) +
    two(vt(WEAK, { title: 'node scripts/dot-bien-4.mjs', fs: 12 }), box('Why nothing was caught', 'Clearly overlapping times only, one lab, one day, and the second booking is stopped by findOverlap — so the constraint, the boundaries and the error mapping are never exercised.', 'do2'), 'r64') },
  { t: 'The reference solution: 8 of 8', body: two(`<div>${vt(STRONG, { title: '11 tests, a fresh PostgreSQL per mutant', fs: 12 })}${vt(' Test Files  1 passed (1)\n      Tests  11 passed (11)', { title: 'npm run test:int -- test/integration', fs: 15 })}</div>`, box('What made the difference', `<ul style="font-size:19px"><li>a table of slots: touching, overlapping, other lab, other day</li><li>insert directly to test the constraint without ${c('findOverlap')}</li><li>0 seats → ${c('23514')}</li><li>a “blind” repo whose ${c('findOverlap')} returns null</li></ul>`, 'xanh'), 'r64') },
  { t: 'Rubric (10 points)', body: zm(`<table class="t"><tr><th>Criterion</th><th>Points</th><th>How it is checked</th></tr>
    <tr><td>Mutants killed</td><td>4 (0.5 each)</td><td>${c('node scripts/dot-bien-4.mjs')}</td></tr>
    <tr><td>Boundaries of the SQL and the constraint (touching slots both ways, other lab, other day)</td><td>2</td><td>read the table</td></tr>
    <tr><td>Isolation: every test starts empty; no order dependence</td><td>2</td><td>run one file, one test, in any order</td></tr>
    <tr><td>Database errors asserted by code (${c('23P01')}, ${c('23514')}) and mapped to ${c('OVERLAP')}</td><td>1</td><td>read the tests</td></tr>
    <tr><td>Unit suite still separate and green (${c('npx vitest run src/')}), names clear</td><td>1</td><td>${c('npx vitest run src/')}</td></tr></table>`, 1.02) },
  { t: 'Hints, from gentle to strong', to: true, body: steps([
      'Put one booking 08:00–10:00 in BE-201, then ask findOverlap about six neighbours',
      `Call ${c('repo.insert')} directly to reach the constraint without ${c('findOverlap')}`,
      `For mutant #8: wrap the repo so ${c('findOverlap')} always returns null`,
      `Check the error code PostgreSQL returns, not its message`,
    ]) },
  { t: 'Before you call it done', to: true, giua: true, body: `<ul>
    <li>${c('npm run test:int -- test/integration')} green; ${c('npx vitest run src/')} green without Docker</li>
    <li>${c('node scripts/dot-bien-4.mjs')} prints <b>8/8 mutants killed</b></li>
    <li>${c('git diff')} shows only test files — the schema is restored</li>
    <li>Commit: ${c('test: PostgreSQL adapter and constraints (Lab 4, 8/8)')}</li></ul>` },
]);
