/**
 * pg-16-1 — PostgreSQL · Chapter 16 · Lesson 16.1 "Prisma & migrations, seen from the database" (slide EN, kiểu FU, 26/10/2026, agent c16).
 * Nguồn: content/courses/postgresql/s16-production-capstone.mjs › postgresql-16-1-prisma-migration.
 * Output = chạy thật (video-bai-giang/src/khung/pg/that/pg-16-1.out.txt + that/c16/*):
 *   - dự án Prisma 5.22.0 nhỏ "CT Shop" (that/c16/shop) trên PostgreSQL 17.11 (pgcourse17, DB c16 = dev, c16_prod = "production")
 *   - lược đồ + 236 migration THẬT của cuongthai.com (chép chỉ-đọc) trên PostgreSQL 16.15 + pgvector 0.8.6 (container nháp pgc16tmp,
 *     dựng từ ảnh giống production): migrate dev ⇒ P3006 thật; migrate deploy vào DB rỗng ⇒ 25 ✓, #26 P3018/42P07, rồi P3009.
 * Bổ sung so với web: checksum = sha256 của file, sửa file đã áp ⇒ "modified after it was applied", nhật ký truy vấn Prisma (include ⇒ 2 câu,
 *   $transaction ⇒ BEGIN/COMMIT), migration hỏng giữa chừng có lùi sạch không (đo: có — cả file chạy trong một giao dịch ngầm), khoá của từng DDL
 *   (pg_locks), đo 1 triệu dòng, hàng đợi khoá 3 phiên + lock_timeout, CONCURRENTLY trong migration (25001), đổi tên cột/enum, bài học seed 08/08.
 */
import { lamDeck, sql, psql, sh, run, tbl, two, box, kw, cards, steps, vsd, c } from './_pg-chung.mjs';
import { blueprintPic, lifecyclePic, replayPic, expandPic, lockQueuePic } from './pg-16-hinh.mjs';

const zm = (h, z = 1.2) => `<div style="zoom:${z}">${h}</div>`;
const P = (t) => `<p style="font-size:21px;margin:0">${t}</p>`;
export const deck = { key: 'pg-16-1', code: 'PG 16.1', title: 'Prisma & migrations, seen from the database', sub: 'schema.prisma → migration.sql → _prisma_migrations' };

export const slides = lamDeck({ chuong: 'Chapter 16 — PostgreSQL in production & capstone', bai: '16.1' }, [
  { cover: true, t: 'Prisma & migrations,<br>seen from the database', sub: 'schema.prisma → migration.sql → _prisma_migrations ·<br>shadow database · failed deploys · changes without downtime' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Every Prisma word ↔ the SQL you already know (with Prisma's <b>real query log</b>)</li>
<li>What a migration <b>is</b>: a file, a checksum, a row in <code class="i">_prisma_migrations</code></li>
<li><code class="i">migrate dev</code> vs <code class="i">migrate deploy</code> vs <code class="i">db push</code> — and the <b>shadow database</b></li>
<li>A real <b>P3006</b> in cuongthai.com's own history — replayed, measured</li>
<li>A failed deploy (<b>P3018 → P3009</b>) and the protocol for it</li>
<li>Changing a live table safely: <b>expand / contract</b>, locks, <code class="i">lock_timeout</code>, <code class="i">CONCURRENTLY</code>, renames</li>
</ul>` },

  { t: 'Everyday example: a floor plan and a renovation log', giua: true, body: `
${blueprintPic()}
${P('A builder never repaints yesterday’s page of the log. To change the house they <b>add a new numbered step</b>, and every house (your laptop, the test server, production) gets the same steps in the same order — each house keeps its own stamp book of which steps it already has.')}` },

  { t: 'The ORM is not a different database', body: `
<table class="t" style="font-size:18px">
<tr><th style="width:250px">Prisma</th><th>What it really is (chapter)</th></tr>
<tr><td><code class="i">model Customer { }</code> + <code class="i">@@map</code></td><td>a <code class="i">CREATE TABLE</code> (Ch 3); <code class="i">@@map("customer")</code> = the real table name</td></tr>
<tr><td><code class="i">@id</code> · <code class="i">@unique</code></td><td><code class="i">PRIMARY KEY</code> · <code class="i">UNIQUE</code> — each brings a <b>B-tree index</b> (Ch 9)</td></tr>
<tr><td><code class="i">@relation</code></td><td>a <code class="i">FOREIGN KEY</code> (Ch 3); <code class="i">onDelete: Cascade</code> = <code class="i">ON DELETE CASCADE</code></td></tr>
<tr><td><code class="i">@@index([a, b])</code></td><td>a composite index — column ORDER matters (Ch 9); Prisma won’t warn, EXPLAIN will</td></tr>
<tr><td><code class="i">$transaction</code></td><td><code class="i">BEGIN … COMMIT</code> (Ch 11) — same isolation levels, same retry needs</td></tr>
<tr><td><code class="i">prisma migrate</code></td><td>plain SQL files, applied in order, recorded in <code class="i">_prisma_migrations</code></td></tr>
</table>
${zm(psql(`— include: { orders: true }  ⇒  TWO queries, not a JOIN
prisma:query SELECT "customer"."id", "customer"."email", … FROM "customer" WHERE 1=1 OFFSET $1
prisma:query SELECT "orders"."id", "orders"."customer_id", … FROM "orders" WHERE "orders"."customer_id" IN ($1,$2,$3) OFFSET $4
— $transaction([create, update])
prisma:query BEGIN
prisma:query INSERT INTO "orders" ("customer_id","status","created_at") VALUES ($1,CAST($2::text AS "OrderStatus"),$3) RETURNING …
prisma:query UPDATE "customer" SET "phone" = $1 WHERE ("customer"."id" = $2 AND 1=1) RETURNING …
prisma:query COMMIT`, { sm: true, title: 'Prisma 5.22 query log (log: query) — PostgreSQL 17.11 · trimmed', hl: [3, 5, 8] }), 0.93)}` },

  { t: 'A tiny schema, its first migration (real)', giua: true, body: `
${two(sql(`model Customer {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  createdAt DateTime @default(now()) @map("created_at")
  orders    Order[]
  @@map("customer")
}
model Order {
  id         Int  @id @default(autoincrement())
  customerId Int  @map("customer_id")
  status     OrderStatus @default(PENDING)
  createdAt  DateTime @default(now()) @map("created_at")
  customer   Customer @relation(fields: [customerId],
                                references: [id])
  @@index([customerId, createdAt(sort: Desc)])
  @@map("orders")
}`, { sm: true, lang: 'typescript' }),
  zm(sh(`$ npx prisma migrate dev --name init
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "c16",
  schema "public" at "127.0.0.1:54317"

Applying migration \`20261025195842_init\`

The following migration(s) have been created
and applied from new schema changes:

migrations/
  └─ 20261025195842_init/
    └─ migration.sql

Your database is now in sync with your schema.
✔ Generated Prisma Client (v5.22.0) to ./client`, { sm: true, title: 'terminal — Prisma 5.22.0 → PostgreSQL 17.11', hl: [7, 13] }), 0.92))}
${P('<code class="i">enum OrderStatus { PENDING PAID SHIPPED }</code> sits below (not shown). The folder name is a <b>UTC timestamp</b> + your name — order = name order.')}` },

  { t: 'The migration is just SQL you can read', giua: true, body: `
${two(sql(`-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'SHIPPED');
-- CreateTable
CREATE TABLE "customer" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE UNIQUE INDEX "customer_email_key" ON "customer"("email");
CREATE INDEX "orders_customer_id_created_at_idx"
    ON "orders"("customer_id", "created_at" DESC);
-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_fkey"
  FOREIGN KEY ("customer_id") REFERENCES "customer"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;`, { sm: true, hl: [2, 12, 16] }),
  `<div>${box('Read it like Chapter 3', '<code class="i">@unique</code> became a <b>UNIQUE INDEX</b>, <code class="i">@relation</code> a <b>FOREIGN KEY</b>, the enum a real <code class="i">CREATE TYPE</code>. <code class="i">orders</code> table trimmed here.', 'lam')}
${box('Prisma’s defaults, made visible', '<code class="i">ON DELETE RESTRICT</code> is the default for a required relation. <code class="i">TIMESTAMP(3)</code> = no time zone, millisecond precision (Ch 2). Didn’t want that? Change the schema <b>before</b> the first deploy.', '')}
${box('Review rule', 'Every migration.sql is reviewed like code. You are approving SQL that will lock real tables.', 'xanh')}</div>`, 'r64')}` },

  { t: 'The stamp book: _prisma_migrations (real)', giua: true, body: `
${zm(psql(`c16=# SELECT migration_name, left(checksum, 12) AS checksum, finished_at, applied_steps_count FROM _prisma_migrations;
   migration_name    |   checksum   |          finished_at          | applied_steps_count
---------------------+--------------+-------------------------------+---------------------
 20261025195842_init | 67f8d90e5ece | 2026-10-26 02:58:42.076939+07 |                   1

$ shasum -a 256 prisma/migrations/20261025195842_init/migration.sql
67f8d90e5ece2ad43668a7b1619e656fa89084aeda3a2eb67a0e2b7568819aa6  …/migration.sql

$ echo '-- edited after applying' >> …/migration.sql && npx prisma migrate dev
The migration \`20261025195842_init\` was modified after it was applied.
? We need to reset the "public" schema at "127.0.0.1:54317"
Do you want to continue? All data will be lost. › no
Reset cancelled.`, { sm: true, title: 'psql 17.11 + terminal — c16 (dev)', hl: [4, 7, 10] }), 1.0)}
${two(box('checksum = SHA-256 of the file', 'Prisma stores a fingerprint of every applied file. Change one byte and the fingerprint no longer matches the history.', 'lam'),
  box('Never edit an applied migration', 'On dev it asks to <b>wipe the database</b>; on production the file and the history now disagree. Fix forward with a <b>new</b> migration.', 'bad'))}` },

  { t: 'One migration’s life: laptop → git → CI → production', giua: true, body: `
${lifecyclePic()}
${cards([
    ['migrate dev — laptop only', 'Diffs schema vs history, <b>writes</b> a new migration, applies it, checks it on a shadow DB. Can offer to <b>reset</b>.'],
    ['migrate deploy — servers', 'Applies pending files in order. No shadow, no generation, no reset, no prompts. cuongthai.com runs it in the backend container on every deploy.'],
    ['db push — prototypes', 'Pushes the schema with <b>no migration file</b>. On production it destroys the history migrate deploy depends on.'],
  ])}` },

  { t: 'The shadow database — and a real P3006', giua: true, body: `
${two(`<div>${box('What it is', 'A throw-away database that <code class="i">migrate dev</code> creates, replays <b>every</b> migration into from zero, compares, then drops. It proves your history still builds a database.', 'lam')}
${box('So one bad old migration…', '…breaks <code class="i">migrate dev</code> for <b>everyone, forever</b> — even though production never runs it again.', 'bad')}</div>`,
  zm(sh(`$ npx prisma migrate dev --schema schema.prisma --name thu
Prisma schema loaded from schema.prisma
Datasource "db": PostgreSQL database "ct_dev",
  schema "public" at "127.0.0.1:54326"

Error: P3006

Migration \`20260706130000_add_music_and_profile\`
failed to apply cleanly to the shadow database.
Error:
ERROR: relation "post_music_post_id_key" already exists
   0: sql_schema_connector::validate_migrations
           with namespaces=None`, { sm: true, title: 'terminal — the REAL cuongthai.com schema + 236 migrations · PostgreSQL 16.15', hl: [6, 10] }), 1.0), 'r46')}
${P('Not hypothetical: this is cuongthai.com’s own <code class="i">prisma/</code> folder (a read-only copy) against an empty PostgreSQL 16 — the version production runs.')}` },

  { t: 'Why it fails — and how far the damage goes (real)', body: `
${sql(`-- 20260706130000_add_music_and_profile/migration.sql, lines 48–49 (real)
ALTER TABLE "post_music" ADD CONSTRAINT "post_music_post_id_key" UNIQUE ("post_id");
CREATE INDEX "post_music_post_id_key" ON "post_music"("post_id");`, { sm: true, hl: [2, 3] })}
${two(`<div>${box('Same name twice', 'A <b>UNIQUE constraint creates an index named after the constraint</b>. The next line creates a second index with that name ⇒ <code class="i">42P07</code>. On PostgreSQL this fails <b>every</b> time.', 'bad')}
${box('Production is fine…', 'The migration is <b>recorded as applied</b> there, so <code class="i">migrate deploy</code> skips it — however it got through back then.', 'lam')}</div>`,
  `<div>${replayPic({ w: 640, cw: 13, ch: 19 })}
${box('…but history can’t build a new database', '<code class="i">migrate deploy</code> into an empty DB stops at #26 (P3018). A new server, CI or disaster recovery must start from a <b>dump</b> (Ch 15), not from migrations.', '')}</div>`, 'r46')}` },

  { t: 'This repo’s rule: hand-write, deploy, check drift', giua: true, body: `
${steps([
    'Write <code class="i">prisma/migrations/&lt;timestamp&gt;_&lt;name&gt;/migration.sql</code> by hand (timestamp = <b>now, UTC</b>, so it sorts last)',
    'Apply with <code class="i">npx prisma migrate deploy</code> — no shadow database needed',
    'Prove schema.prisma and the database agree:',
  ])}
${two(zm(sh(`$ npx prisma migrate diff \\
    --from-schema-datasource prisma/schema.prisma \\
    --to-schema-datamodel  prisma/schema.prisma --script
-- This is an empty migration.`, { sm: true, title: 'terminal — no drift ✓', hl: [4] }), 1.05),
  zm(sh(`$ npx prisma migrate diff … --script   # a day earlier
-- DropIndex
DROP INDEX "orders_status_idx";

-- DropTable
DROP TABLE "big_customer";`, { sm: true, title: 'terminal — drift ✗ (real)', hl: [3, 6] }), 1.05))}
${P('Right: an index made by hand but missing from <code class="i">@@index</code>, and a test table created outside migrations. Prisma’s next migration would <b>drop</b> both.')}` },

  { t: 'Trap: a required column on a table that has rows (real)', giua: true, body: `
${two(sql(`model Customer {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
  phone String          // ← new, required
}`, { sm: true, lang: 'typescript', hl: [5] }),
  zm(sh(`$ npx prisma migrate dev --create-only --name add_phone
⚠️ We found changes that cannot be executed:
  • Step 0 Added the required column \`phone\` to the
    \`customer\` table without a default value. There are
    3 rows in this table, it is not possible to execute
    this step.
Prisma Migrate created the following migration without
applying it 20261025195957_add_phone`, { sm: true, title: 'terminal — dev warns…', hl: [3] }), 1.0), 'r46')}
${zm(sh(`$ DATABASE_URL=…/c16_prod npx prisma migrate deploy      # …production has rows too
Applying migration \`20261025195957_add_phone\`
Error: P3018
A migration failed to apply. New migrations cannot be applied before the error is recovered from.
Migration name: 20261025195957_add_phone
Database error code: 23502
ERROR: column "phone" of relation "customer" contains null values`, { sm: true, title: 'terminal — …and the deploy fails (real, c16_prod)', hl: [3, 7] }), 1.0)}` },

  { t: 'When a migration fails on deploy: STOP, then read', body: `
${two(zm(sh(`$ npx prisma migrate deploy        # the next deploy
Error: P3009
migrate found failed migrations in the target
database, new migrations will not be applied.
The \`20261025195957_add_phone\` migration started
at 2026-10-25 20:00:16.436374 UTC failed

c16_prod=# SELECT migration_name, finished_at
           FROM _prisma_migrations;
 20261025195842_init      | 2026-10-26 03:00:14.893309+07
 20261025195957_add_phone |

c16_prod=# \\d customer
   Column   |              Type
 id         | integer
 email      | text
 name       | text
 created_at | timestamp(3) without time zone`, { sm: true, title: 'terminal + psql — c16_prod (trimmed)', hl: [2, 11] }), 0.98),
  steps([
    '<b>Read the real error.</b> Which statement failed? Prisma sent the whole file as one script ⇒ PostgreSQL ran it in <b>one implicit transaction</b> — the failed migration rolled back completely.',
    '<b>Inspect the real schema</b> (<code class="i">\\d</code>): no <code class="i">phone</code>. Compare with what the file wanted: <code class="i">migrate diff --from-url "$DATABASE_URL" --to-schema-datamodel prisma/schema.prisma --script</code>.',
    '<b>Then decide, deliberately — a person, not a script.</b> Here: nothing applied ⇒ <code class="i">migrate resolve --rolled-back</code>, fix the file, deploy again.',
  ]), 'r46')}
${box('Never “just make it go away”', '<code class="i">migrate resolve --applied</code> on a half-applied migration tells Prisma a lie that nothing detects until a later migration fails for nonsense reasons. cuongthai.com’s rule: report the error, don’t auto-resolve.', 'bad')}` },

  { t: 'Expand → backfill → contract (no downtime)', giua: true, body: `
${expandPic()}
${zm(sh(`$ npx prisma migrate resolve --rolled-back 20261025195957_add_phone    # after checking: nothing applied
Migration 20261025195957_add_phone marked as rolled back.
$ npx prisma migrate deploy     # A = the fixed add_phone: ALTER TABLE "customer" ADD COLUMN "phone" TEXT;
All migrations have been successfully applied.
c16_prod=# UPDATE customer SET phone = '0900000' || id WHERE phone IS NULL;      -- backfill
$ npx prisma migrate deploy     # B = 20261025201000_phone_not_null (CHECK NOT VALID → VALIDATE → SET NOT NULL)
All migrations have been successfully applied.
$ npx prisma migrate diff --from-url "$DATABASE_URL" --to-schema-datamodel prisma/schema.prisma --script
-- This is an empty migration.`, { sm: true, title: 'terminal + psql — c16_prod, real', hl: [9] }), 0.92)}` },

  { t: 'Which lock does each DDL take? (real, 1,000,000 rows)', body: `
${tbl(['statement on big_customer (1,000,000 rows)', '\\timing', 'lock held (pg_locks)'], [
    ['ADD COLUMN is_vip bool NOT NULL DEFAULT false', '0.566 ms', 'AccessExclusive (a blink)'],
    ['ADD COLUMN ref_code uuid NOT NULL DEFAULT gen_random_uuid()', '1,197.666 ms', 'AccessExclusive — table REWRITTEN'],
    ['ALTER COLUMN phone SET NOT NULL (scans every row)', '59.073 ms', 'AccessExclusive'],
    ['ADD CONSTRAINT phone_nn CHECK (phone IS NOT NULL) NOT VALID', '0.562 ms', 'AccessExclusive (a blink)'],
    ['VALIDATE CONSTRAINT phone_nn (scans every row)', '50.287 ms', 'ShareUpdateExclusive'],
    ['ALTER COLUMN phone SET NOT NULL (uses the valid CHECK)', '0.421 ms', 'AccessExclusive (a blink)'],
  ], { cap: 'measured on PostgreSQL 17.11 — the uuid default changed the file: filenode 45889 → 45898', hl: [1], o: [[4, 2], [5, 1]] })}
${two(zm(psql(`BEGIN; <DDL>; SELECT mode FROM pg_locks WHERE …; ROLLBACK;
         lenh            |           mode
-------------------------+--------------------------
 VALIDATE CONSTRAINT     | ShareUpdateExclusiveLock
 ALTER COLUMN … NOT NULL | AccessExclusiveLock
 CREATE INDEX            | ShareLock`, { sm: true, title: 'psql 17.11 — c16 (trimmed)', hl: [4, 5] }), 1.0),
  box('Read the right column', '<b>AccessExclusive</b>: nobody else touches the table — not even a <code class="i">SELECT</code>. <b>ShareUpdateExclusive</b> lets reads <b>and writes</b> continue — that is why the slow scan goes into VALIDATE. A <b>constant</b> default is metadata only (PG 11+); a per-row default rewrites the table.', 'bad'), 'r46')}` },

  { t: 'Lock queue: a 1-row SELECT waits 6 s (real)', giua: true, body: `
${lockQueuePic()}
${two(zm(psql(` app          | state  | wait_type | wait_event
--------------+--------+-----------+------------
 ss-app       | active | Timeout   | PgSleep
 ss-migration | active | Lock      | relation
 ss-user      | active | Lock      | relation`, { sm: true, title: 'pg_stat_activity at second 3.5', hl: [4, 5] }), 1.0),
  zm(psql(`SET lock_timeout = '2s';
ALTER TABLE customer ADD COLUMN note text;
ERROR:  canceling statement due to lock timeout
Time: 2004.017 ms

-- session ss-user, same run:
SELECT id, email FROM customer WHERE id = 1;
Time: 969.242 ms`, { sm: true, title: 'same run, with lock_timeout (trimmed)', hl: [3, 8] }), 1.0))}` },

  { t: 'CONCURRENTLY inside a Prisma migration (real)', giua: true, body: `
${vsd(zm(sh(`-- migration.sql (two statements)
CREATE INDEX CONCURRENTLY "orders_status_idx"
  ON "orders"("status");
ALTER TABLE "orders" ALTER COLUMN "status"
  SET DEFAULT 'PENDING';

$ npx prisma migrate deploy
Error: P3018
Database error code: 25001
ERROR: CREATE INDEX CONCURRENTLY cannot run
inside a transaction block`, { sm: true, title: 'terminal', hl: [9, 10] }), 1.08),
  zm(sh(`-- migration.sql (ONE statement, alone)
CREATE INDEX CONCURRENTLY "orders_status_idx"
  ON "orders"("status");

$ npx prisma migrate deploy
Applying migration \`20261025202000_orders_status_idx\`
All migrations have been successfully applied.

-- and in schema.prisma, so diff stays empty:
@@index([status])`, { sm: true, title: 'terminal', hl: [6, 10] }), 1.08), '✗ Two statements ⇒ one implicit transaction', '✓ Alone in its own migration file')}
${P('Prisma never generates <code class="i">CONCURRENTLY</code> — you hand-write it. Real count: <b>0 of 236</b> cuongthai.com migrations use it.')}` },

  { t: 'Renaming a column: Prisma generates DROP + ADD', giua: true, body: `
${two(zm(sh(`-- schema: name → fullName @map("full_name")
$ npx prisma migrate dev --create-only
⚠️  Warnings for the current datasource:
  • You are about to drop the column \`name\` on
    the \`customer\` table, which still contains
    3 non-null values.

-- generated migration.sql
ALTER TABLE "customer" DROP COLUMN "name",
ADD COLUMN     "full_name" TEXT NOT NULL;`, { sm: true, title: 'terminal — what Prisma wrote', hl: [4, 9] }), 1.0),
  zm(psql(`-- edited by hand before it ever ran
ALTER TABLE "customer"
  RENAME COLUMN "name" TO "full_name";

c16=# SELECT id, full_name, phone FROM customer;
 id | full_name |  phone
----+-----------+----------
  1 | An        | 09000001
  2 | Bình      | 09000002
  3 | Chi       | 09000003`, { sm: true, title: 'psql 17.11 — data kept', hl: [3] }), 1.0))}
${box('Rename is instant — but which code is running?', 'cuongthai.com’s deploy swaps the image <b>then</b> runs <code class="i">migrate deploy</code>: for a moment old code meets the new schema. For busy tables rename by <b>expand/contract</b>: add <code class="i">full_name</code>, write both, backfill, switch reads, drop <code class="i">name</code> a release later.', '')}` },

  { t: 'Enum rename — and the seed that broke production', body: `
${two(zm(psql(`-- Prisma's generated version (trimmed)
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM
  ('AWAITING_PAYMENT', 'PAID', 'SHIPPED');
ALTER TABLE "orders" ALTER COLUMN "status"
  TYPE "OrderStatus_new"
  USING ("status"::text::"OrderStatus_new");
ERROR:  invalid input value for enum
  "OrderStatus_new": "PENDING"`, { sm: true, title: 'psql 17.11 — rows still say PENDING', hl: [8] }), 1.1),
  zm(psql(`-- hand-written instead (PostgreSQL 10+)
ALTER TYPE "OrderStatus"
  RENAME VALUE 'PENDING' TO 'AWAITING_PAYMENT';

c16=# SELECT status, count(*) FROM orders GROUP BY 1;
      status      | count
------------------+-------
 AWAITING_PAYMENT |     2
 PAID             |     1
 SHIPPED          |     1`, { sm: true, title: 'psql 17.11 — old rows follow', hl: [3, 7] }), 1.1))}
${box('Real incident, 2026-08-08', 'cuongthai.com renamed <code class="i">ContentType.CODE → CODE_REVIEW</code>. The whole checklist passed — and the <b>seed broke on production</b>, because <code class="i">seed.ts</code> kept its own hand-copied union and <code class="i">tsc</code> never checks <code class="i">prisma/**</code>. Same run here: <code class="i">invalid input value for enum "OrderStatus": "PENDING"</code> at runtime. Fix: import enums from <code class="i">@prisma/client</code>, type-check and <b>run</b> the seed.', 'bad')}` },

  { t: 'Exercise: a required column, zero downtime', body: `
${two(`<div>${box('Task', '<code class="i">orders</code> has rows. Add <code class="i">shipping_fee numeric(12,2)</code>, finally <b>NOT NULL</b>. Write the migrations as files, apply with <code class="i">migrate deploy</code>, end with an empty <code class="i">migrate diff</code>.', '')}
${box('Hints', '① nullable first ② fill old rows in batches ③ CHECK NOT VALID → VALIDATE → SET NOT NULL, with <code class="i">lock_timeout</code>.', 'lam')}</div>`,
  sql(`-- A  20261026090000_fee_expand
ALTER TABLE "orders" ADD COLUMN "shipping_fee" DECIMAL(12,2);

-- backfill (a script, repeat until 0 rows)
UPDATE "orders" SET "shipping_fee" = 30000
 WHERE id IN (SELECT id FROM "orders"
   WHERE "shipping_fee" IS NULL LIMIT 1000);

-- B  20261027090000_fee_not_null
SET lock_timeout = '3s';
ALTER TABLE "orders" ADD CONSTRAINT "fee_nn"
  CHECK ("shipping_fee" IS NOT NULL) NOT VALID;
ALTER TABLE "orders" VALIDATE CONSTRAINT "fee_nn";
ALTER TABLE "orders" ALTER COLUMN "shipping_fee" SET NOT NULL;
ALTER TABLE "orders" DROP CONSTRAINT "fee_nn";`, { sm: true }), 'r46')}
${two(P('Schema: <code class="i">shippingFee Decimal? @db.Decimal(12, 2) @map("shipping_fee")</code> after A, drop the <code class="i">?</code> after B. A and B ship in <b>separate releases</b>.'),
  zm(sh(`UPDATE 5
UPDATE 0
Applying migration \`20261027090000_fee_not_null\`
-- This is an empty migration.`, { sm: true, title: 'real run on c16 (trimmed): backfill ×2 · deploy B · diff', hl: [4] }), 1.0), 'r46')}` },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>Where does Prisma remember that a migration ran, and what does it compare to notice an edited file?</li>
<li>Why does one bad old migration break <code class="i">migrate dev</code> for everyone, while production keeps working?</li>
<li>A deploy shows <b>P3018</b>, then <b>P3009</b>. What three things do you do before touching <code class="i">migrate resolve</code>?</li>
</ol>
${box('Answers', '① <code class="i">_prisma_migrations</code>; the SHA-256 <b>checksum</b> of the file. ② the shadow DB replays every file from zero; prod has it recorded as applied and skips it. ③ read the real error · inspect the schema (<code class="i">\\d</code>, <code class="i">migrate diff --from-url</code>) · decide deliberately (rolled back? fix forward).', 'xanh')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Prisma is a naming layer — <b>read the SQL</b> it writes and logs</li>
<li>Migration = file + checksum + row in <code class="i">_prisma_migrations</code>; never edit an applied one</li>
<li><code class="i">migrate dev</code> (laptop, shadow DB) · <code class="i">migrate deploy</code> (servers) · no <code class="i">db push</code> on prod</li>
<li>Failed deploy ⇒ stop, read, inspect, decide — no auto-resolve</li>
<li>Live tables: expand/contract, know the lock, <code class="i">lock_timeout</code>, <code class="i">CONCURRENTLY</code> alone</li>
</ul>
${box('Next — 16.2', 'Reading a real production schema: cuongthai.com’s 602 models, measured, and how to find your way around one you did not write.', 'lam')}` },
]);
