/**
 * api-12-2 — API Design · Chapter 12 · Lesson 12.2 "Migrations, constraints and seed data" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: s12-du-an-cuoi-khoa.mjs › api-12-11-migration. Output = chạy thật src/migrate.js, src/seed-pg.js, perf/migration-locks.mjs trên PostgreSQL 18.4.
 */
import { lamDeck, sql, http, two, box, vsd } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 12 — Capstone', bai: '12.2' };

export const deck = { key: 'api-12-2', code: 'API 12.2', title: 'Migrations, constraints and seed data', sub: 'Getting the schema in safely' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Migrations, constraints, seed', sub: 'A schema that changes only through<br>numbered files that run once.' },

  { t: 'A 60-line migration runner', giua: true, body: sql(`await db.query('SELECT pg_advisory_lock($1)', [LOCK]);        // 1) one runner at a time, any machine
const done = …SELECT version, checksum FROM schema_migrations…;  // 2) what is already applied
for (const f of files) {                                        //    001_core.sql, 002_outbox.sql … in order
  if (done.has(f) && done.get(f) !== sha256(sql)) throw …;      // 3) applied file EDITED ⇒ stop
  await db.query('BEGIN'); await db.query(sql);                 // 4) one transaction per file
  await db.query('INSERT INTO schema_migrations …'); await db.query('COMMIT');
}`, { lang: 'javascript', sm: true, hl: [1, 4] }) + two(box('Why not CREATE TABLE IF NOT EXISTS at start-up?', 'Works once; cannot add a column, keeps no history, and two instances starting together race. Chapters 8–10 had three of those.', 'do2'), box('Same ideas as', 'Flyway, Prisma Migrate, Knex: ordered files, a history table, checksums, a lock.', 'lam')) },

  { t: 'Run it, run it again', body: http(`$ npm run -s db:status
  CHƯA áp 001_core.sql   …   CHƯA áp 004_issues.sql
$ npm run -s db:migrate
  áp 001_core.sql (58 ms)
  áp 002_outbox.sql (5 ms)
  áp 003_shared_state.sql (15 ms)
  áp 004_issues.sql (5 ms)
xong: áp 4 migration
$ npm run -s db:migrate
không có migration mới
$ psql "$DATABASE_URL" -c 'SELECT version, checksum, ms … FROM schema_migrations'
 001_core.sql         | ed7a40c43343 | 58 | 11:58:30
 002_outbox.sql       | b0c90a7db3f1 |  5 | 11:58:30
 …`, { wrap: true }) + box('Idempotent by design', 'The second run does nothing — so a deploy script can call it every time.', 'xanh') },

  { t: 'The mistakes everybody makes once', body: http(`$ echo '-- sửa một dòng chú thích' >> migrations/002_outbox.sql && npm run -s db:migrate
migration DỪNG: 002_outbox.sql đã áp nhưng nội dung ĐÃ BỊ SỬA (checksum b0c90a7db3f1 ⇒ 302e7ffe0ea0). Đừng sửa migration đã chạy — viết tệp mới.
$ printf "CREATE TABLE lab_photos (…);\\n…\\n…REFERENCS labs;\\n" > migrations/005_lab_photos.sql && npm run -s db:migrate
migration DỪNG: 005_lab_photos.sql hỏng, đã ROLLBACK cả tệp: syntax error at or near "REFERENCS"
$ psql … -Atc "SELECT to_regclass('lab_photos') IS NULL, (SELECT count(*) FROM schema_migrations)"
t|4
$ (INSTANCE=A npm run -s db:migrate … & INSTANCE=B npm run -s db:migrate … & wait)
[A] xong: áp 4 migration
[B] chờ khoá migration 62 ms (instance khác đang chạy)
[B] không có migration mới`, { sm: true, wrap: 'any' }) + two(box('Edited history', 'Checksum mismatch ⇒ stop. Revert the edit; write 005.', 'do2'), box('Half a migration', 'DDL runs in a transaction: the table of statement 1 is gone, history still 4 rows.', 'xanh')) },

  { t: 'Migrations that lock production', body: http(`$ node perf/migration-locks.mjs          # 1,000,000 rows; one INSERT sent 100 ms after each statement
ADD COLUMN seats int NOT NULL DEFAULT 1                    migration     1 ms · INSERT của người dùng chờ     3 ms
ADD COLUMN token text DEFAULT md5(random()::text)          migration  3209 ms · INSERT của người dùng chờ  3109 ms
CREATE INDEX ON (user_id, start_at)                        migration  3449 ms · INSERT của người dùng chờ  3348 ms
CREATE INDEX CONCURRENTLY ON (user_id, start_at)           migration  4881 ms · INSERT của người dùng chờ     1 ms`, { sm: true, wrap: true }) + http(`$ … 005_bookings_lab_start.sql (CREATE INDEX CONCURRENTLY …) && npm run -s db:migrate
migration DỪNG: … CREATE INDEX CONCURRENTLY cannot run inside a transaction block
$ … first line "-- migrate:no-transaction" && npm run -s db:migrate
  áp 005_bookings_lab_start.sql (5 ms)`, { sm: true, wrap: true }) + vsd('<p>A volatile default rewrites the table; a plain CREATE INDEX blocks writes — a student pressing “Book” waits 3 s.</p>', '<p>Constant defaults (catalogue only), CONCURRENTLY for indexes (one statement per no-transaction file), backfills in batches.</p>', '✗ locks the hot table', '✓ non-blocking forms') },

  { t: 'Constraints at work, then the deploy-day rule', giua: true, body: http(`$ psql … INSERT … ('lab_1', 'usr_2', '2029-01-10 09:00+07', '2029-01-10 11:00+07')
ERROR:  conflicting key value violates exclusion constraint "bookings_no_overlap"
$ psql … INSERT … ('2029-01-10 12:00+07', '2029-01-10 11:00+07')
ERROR:  new row for relation "bookings" violates check constraint "bookings_time_order"
DETAIL:  Failing row contains (10003, bk_10003, …)
$ psql … INSERT … ('lab_9', …)
ERROR:  … violates foreign key constraint "bookings_lab_id_fkey"`, { sm: true, wrap: true }) + two(box('Expand, then contract', 'Old and new code run together during a deploy. Add the column (nullable or constant default) ⇒ write both ⇒ backfill ⇒ read new ⇒ drop old in a later release.', 'lam'), box('Summary · next', 'Numbered files, one transaction each, checksum, advisory lock, repeatable seeds, non-blocking DDL. Next (12.3): the API on top — one pool, transactions.', 'xanh')) },
]);
