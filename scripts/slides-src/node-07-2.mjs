/**
 * node-07-2 — Node.js · Chapter 7 · Lesson 7.2 "The schema, and migrations that survive production" (slide EN, kiểu FU, đợt 6 — 01/11/2026). MỘT deck, HAI tập:
 *   7.2a (node-7-2)   = slide 1–15: migration là code chạy một lần trên dữ liệu không tạo lại được · lược đồ v1 + từng thuộc tính · quên quan hệ ngược (P1012 thật) ·
 *                       migrate dev --name init (thật) · migration.sql là sản phẩm bàn giao · 7.10: migrate dev KHÔNG sinh client (thật) · bảng _prisma_migrations ·
 *                       tên migration là giờ UTC (thật: 20261031… lúc máy ghi 1/11 05:42 +07) · bản đồ lệnh · quy trình 4 bước · bài tập đọc SQL · tự kiểm · tóm tắt
 *   7.2b (node-7-2-2) = slide 16–31: migration 2 trên bảng có dữ liệu (thật) · bảng nối NoteTag · drift: psql sửa nóng, migrate status vẫn "up to date" (thật) ·
 *                       migrate diff cần shadow DB (lỗi thật) ⇒ thêm shadowDatabaseUrl ⇒ diff ra đúng SQL · migrate dev đòi reset (thật) · sửa drift trung thực (thật:
 *                       diff ⇒ tệp migration ⇒ resolve --applied ⇒ in sync) · diễn tập P3018 ⇒ P3009 (thật) · kiểm đã áp bao nhiêu · resolve --rolled-back + 3 bước
 *                       (thật) · lịch sử giữ cả hai lần · sửa tệp đã áp: deploy im lặng, dev đòi reset (thật) · mẫu 3 bước tổng quát · bài tập đổi tên cột · tự kiểm · tóm tắt
 * Nguồn: s07-prisma.mjs › nodejs-7-2-luoc-do-va-migration. Output THẬT (prisma 7.10.1, PostgreSQL 17.11): that/c7/{mig-1,mig-norel,mig-2,mig-drift,mig-drift2,
 * mig-drift3,mig-fail,mig-fix,mig-checksum} + schema-v1/v2/norel.prisma + add-slug-bad/good.sql.
 * Khác web CÓ THẬT (đã sửa bài web): migrate dev ở 7.10 KHÔNG còn sinh lại client (phải chạy prisma generate).
 */
import { lamDeck, two, three, box, kw, bang, cards, flow, cot, tep, gay, gon, P, Q, J, T } from './_c7-chung.mjs';
import { ra } from './_node-chung.mjs';

export const deck = { key: 'node-07-2', code: 'NODE 7.2', title: 'The schema, and migrations that survive production', sub: 'Node.js — from zero to production' };
const CAM = '#e08a1e', NODE = '#15803d', LAM = '#336791', DO = '#b0281a', TIM = '#7c3aed';
/** Output thật, bỏ 3 dòng đầu lặp lại của Prisma CLI, bẻ dòng dài. */
const G = (ten, a, b, n = 104) => gay(gon(ra(ten, a, b)), n).replace(/\n+$/, '');
const TT = (ten, a, b, title, o = {}) => T(G(ten, a, b, o.n), title, o);

export const slides = lamDeck({ chuong: 'Chapter 7 — PostgreSQL & Prisma', bai: '7.2' }, [
  /* ───── 7.2a (node-7-2): slide 1–15 ───── */
  { cover: true, t: 'The schema, and migrations<br>that survive production', sub: 'Everything else can be redeployed. A migration runs once, on data you cannot recreate.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: two(
    box('Part 1 (this video)', '<ul><li>The schema: a description, not a script</li><li>What <code class="i">migrate dev</code> really does</li><li>Where the history lives</li><li>Which command for which place</li></ul>', 'xanh'),
    box('Part 2 (next video)', '<ul><li>A second migration on a table with data</li><li>Drift: when the database and history disagree</li><li>Drill: a migration that dies halfway</li><li>Recovering in the safe order</li></ul>', 'lam')) +
    box('Run for real', 'prisma 7.10.1 + PostgreSQL 17.11. Every output below is copied from that run, including the failures.', 'cam') +
    box('You need', 'The Notes project from lesson 7.1 (Prisma installed, DATABASE_URL in .env) and PostgreSQL running in Docker.', 'lam') },

  { t: 'Why migrations deserve their own lesson', to: true, giua: true, body: cards([
    ['🏠 Renovating with people inside', 'Your app keeps serving users while the table changes underneath. You cannot ask everyone to leave.'],
    ['1️⃣ Runs once', 'A migration is the only code that runs exactly once per environment. A bug cannot be "redeployed away".'],
    ['💾 On data you cannot recreate', 'Code can be rebuilt from git. Rows that users typed cannot.'],
  ], 3) + box('Migration (bước chuyển lược đồ)', 'a numbered SQL file that moves the database from one shape to the next. Applied in order, recorded in a history table.', 'lam') +
    box('This lesson\'s plan', 'Write the Notes schema, then break a migration on purpose, so the first time you meet the incident at work is your second time.', 'cam') },

  { t: 'The schema is a description, not a script', to: true, giua: true, body: P(tep('c7/schema-v1.prisma', 10, 29)) },

  { t: 'What each attribute really does', to: true, giua: true, body: bang(['attribute', 'what it becomes in PostgreSQL'], [
    ['<code class="i">@id @default(autoincrement())</code>', 'primary key on a SERIAL column (a sequence)'],
    ['<code class="i">@unique</code>', 'a real UNIQUE index — the one that raises P2002 in lesson 7.6'],
    ['<code class="i">@db.VarChar(200)</code>', 'VARCHAR(200); without it, String becomes TEXT'],
    ['<code class="i">@updatedAt</code>', 'Prisma writes the time on every update — in your process, not a database trigger'],
    ['<code class="i">@relation(… onDelete: Cascade)</code>', 'a foreign key: delete a user ⇒ their notes go too, enforced by PostgreSQL'],
    ['<code class="i">notes Note[]</code> on User', 'the back-relation: <b>no column</b>; it is what lets you write include: { notes: true }'],
  ], { co: 21 }) + box('Every relation is two fields', 'One on each side. Two relations between the same two models (author and lastEditor) need names: @relation("NoteAuthor"), @relation("NoteEditor").', 'cam') },

  { t: 'Forget the back-relation, and generate stops', to: true, giua: true, body: TT('c7/mig-norel', 1, 13, 'schema without notes Note[] · npx prisma generate · real', { hl: [4], n: 112 }) +
    two(box('Read the error', 'P1012: the relation field author on model Note is missing an opposite relation field on model User.', 'do2'),
      box('Fix', 'Add <code class="i">notes Note[]</code> to User, or run <code class="i">npx prisma format</code> and let it add the field for you.', 'xanh')) },

  { t: 'migrate dev: what it really does', to: true, giua: true, body: TT('c7/mig-1', 1, 21, 'npx prisma migrate dev --name init · ls -R prisma/migrations · real', { hl: [4, 8, 9, 10] }) +
    two(box('Four steps', 'Compare schema with the database ⇒ write a new SQL file ⇒ apply it ⇒ record it in the history table.', 'lam'),
      box('migration_lock.toml', 'Records which database the migrations were written for (postgresql). Commit it too.', '')) },

  { t: 'The SQL file is the real deliverable', to: true, giua: true, body: Q(G('c7/mig-1', 33, 44, 120) + '\n-- (CreateIndex "User_email_key" …)\n' + G('c7/mig-1', 49, 50, 120)) +
    box('Review it like any other code', 'An ALTER TABLE … NOT NULL on a big table is a lock; a DROP COLUMN is data you will not get back. The schema says the intent; this file says what will happen to production.', 'cam') },

  { t: 'In 7.10, migrate dev no longer generates the client', to: true, giua: true, body: TT('c7/mig-1', 51, 52, 'right after migrate dev · real') +
    TT('c7/mig-2', 50, 63, 'so run it yourself: npx prisma generate · real') +
    box('Old tutorials (and Prisma 5/6) say otherwise', '"migrate dev … then regenerates the client" is no longer true. After every schema change: migrate dev, then <b>prisma generate</b>, or your code imports a client that does not know the new column.', 'do2') },

  { t: 'Where the history lives', to: true, giua: true, body: TT('c7/mig-1', 53, 59, 'date (laptop, +07) · then the history table · real', { hl: [2, 6], sm: false }) +
    two(box('_prisma_migrations', 'A normal table inside your database: one row per applied migration. No magic, nothing else.', 'lam'),
      box('Timestamps are UTC', 'The migration is called <b>20261031224238</b>: 22:42 on 31 October, UTC. The laptop said 05:42 on 1 November. Check the clock before you say "it ran 7 hours late".', 'cam')) },

  { t: 'Which command, where', to: true, giua: true, body: bang(['command', 'what it does', 'where'], [
    ['<code class="i">migrate dev</code>', 'compares, writes a new SQL file, applies it — and offers to wipe the database when it cannot reconcile', 'your machine only'],
    ['<code class="i">migrate deploy</code>', 'applies pending files in order; never creates, never resets, never asks', 'production, CI'],
    ['<code class="i">migrate status</code>', 'reads the history table: pending or failed', 'anywhere'],
    ['<code class="i">migrate resolve</code>', 'marks a failed migration rolled-back or applied', 'a human decision'],
    ['<code class="i">db push</code>', 'pushes the schema with no migration file', 'throw-away prototypes'],
    ['<code class="i">migrate reset</code>', 'drops everything and replays', 'never on production'],
  ], { co: 18, hl: [1] }) + box('If you took PostgreSQL lesson 16.1', 'You read these same commands from the database side, including a real P3006 in this website\'s own history.', 'xanh') },

  { t: 'The everyday loop', to: true, giua: true, body: flow([
    { t: '1 · edit', s: 'schema.prisma', mau: LAM }, { t: '2 · migrate dev', s: 'writes the SQL file', mau: NODE }, { t: '3 · commit', s: 'the SQL file + schema', mau: CAM }, { t: '4 · migrate deploy', s: 'on production / CI', mau: TIM },
  ], { h: 160, fs: 22 }) + three(
    box('Then generate', 'Run <code class="i">prisma generate</code> after step 2 (7.10 does not do it for you).', 'cam'),
    box('Same files everywhere', 'Every environment applies the same files in the same order.', 'lam'),
    box('Never on production', '<code class="i">migrate dev</code>, <code class="i">db push</code>, <code class="i">migrate reset</code>.', 'do2')) +
    box('A rule written down at this website', 'Its project rules forbid migrate reset and db push on production, and forbid resolving a failed migration automatically — because it happened here once.', 'cam') },

  { t: 'Exercise: review this migration', to: true, giua: true, body: box('Your task', 'A teammate opens a pull request: the schema adds <code class="i">phone String</code> to User (required), and removes <code class="i">pinned</code> from Note. Without running anything, which two lines of the generated SQL should stop the review, and why?', '') +
    box('Hint', 'Think about rows that already exist, and about data that cannot come back.', 'lam') +
    `<div data-k="dapan">${box('Answer', '<code class="i">ADD COLUMN "phone" TEXT NOT NULL</code> fails on a table with rows (part 2 shows exactly this). <code class="i">DROP COLUMN "pinned"</code> deletes data for good. Ask: default or backfill first? Is pinned really unused?', 'xanh')}</div>` },

  { t: 'Self-check (part 1)', to: true, giua: true, body: `<ol>
<li>Does <code class="i">notes Note[]</code> create a column? What is it for?</li>
<li>After <code class="i">migrate dev</code> on Prisma 7.10, what must you still run?</li>
<li>Where does Prisma record which migrations were applied?</li>
<li>Which command is the only one allowed on production?</li>
</ol>
${box('Try first', 'Pause and answer before you look.', 'lam')}
<div data-k="dapan">${box('Answers', '1. No column; it is the back-relation that makes include possible. &nbsp;2. prisma generate. &nbsp;3. The _prisma_migrations table in the same database. &nbsp;4. migrate deploy.', 'xanh')}</div>` },

  { t: 'Summary (part 1)', to: true, giua: true, body: `<ul>
<li>A migration runs once, on data you cannot recreate: review it like code</li>
<li>schema.prisma describes the target; the generated <b>migration.sql</b> is what production runs</li>
<li>Every relation is two fields; a missing back-relation stops generate (P1012)</li>
<li>Prisma 7.10: <code class="i">migrate dev</code> no longer generates the client — run <code class="i">prisma generate</code></li>
<li>History = the _prisma_migrations table; names use UTC time</li>
<li>Production runs <code class="i">migrate deploy</code> and nothing else</li>
</ul>` + box('Next', 'Part 2: a migration on a table with data, drift, and a migration that dies halfway.', 'lam') },

  /* ───── 7.2b (node-7-2-2): slide 16–31 ───── */
  { t: 'A second change, on a table that has rows', to: true, giua: true, body: two(TT('c7/mig-2', 1, 6, 'two real notes already exist · real'), box('The change', 'A <b>version</b> column (lesson 7.6 uses it) and tags: a Tag model plus a NoteTag join model.', 'lam')) +
    P(tep('c7/schema-v2.prisma', 19, 31), { hl: [9, 12] }) },

  { t: 'migrate dev, second time', to: true, giua: true, body: TT('c7/mig-2', 7, 21, 'npx prisma migrate dev --name add_tags_and_version · real', { hl: [4], sm: false }) +
    two(box('Same four steps', 'Compare, write 20261031224253_add_tags_and_version/migration.sql, apply, record.', 'xanh'),
      box('Then generate', 'The client must learn the new column and models: npx prisma generate.', 'cam')) },

  { t: 'What it changed', to: true, giua: true, body: Q(G('c7/mig-2', 23, 24, 120) + '\n\n-- (CreateTable "Tag" …)\n\n' + G('c7/mig-2', 34, 40, 120), { hl: [2] }) + two(
    box('NOT NULL DEFAULT 1 is safe', 'Every existing row gets the default. A required column <b>without</b> a default on a table with rows is the classic production failure — next.', 'xanh'),
    box('Many-to-many = a join table', 'NoteTag: two foreign keys, a composite primary key. Written explicitly, it can grow columns later (who tagged, when).', 'lam')) },

  { t: 'Drift: a 2 a.m. hot-fix with psql', to: true, giua: true, body: TT('c7/mig-drift', 1, 11, 'someone adds a column by hand · then migrate status · real', { hl: [1, 7] }) +
    two(box('Drift (trôi lệch)', 'the database contains something the migration history never heard of.', 'lam'),
      box('Surprise one', '<code class="i">migrate status</code> says <b>up to date</b>. It only reads the history table; it never compares real columns.', 'do2')) +
    box('Why it matters', 'The next migration is planned from history. A column nobody recorded can collide with it, or be dropped by it.', 'cam') },

  { t: 'The command that really compares: migrate diff', to: true, giua: true, body: TT('c7/mig-drift', 12, 15, 'first try · real', { n: 112 }) +
    two(P(tep('c7/config-shadow.ts.txt', 9, 12)), TT('c7/mig-drift2', 3, 7, 'with a shadow database · real', { n: 58 })) +
    box('Shadow database (CSDL bóng)', 'an empty scratch database where Prisma replays your migration files to learn what they produce. Read the result: "to go from what the migrations describe to what the database really is, run this".', 'lam') },

  { t: 'migrate dev refuses to guess', to: true, giua: true, body: TT('c7/mig-drift', 16, 34, 'npx prisma migrate dev while drift exists · real', { hl: [11, 12, 14, 15], n: 112 }) +
    box('On your laptop, reset is fine. On production it is data loss', 'That is why production only ever runs migrate deploy. If you see this offer on a real database: stop, and read the drift summary — someone changed the database outside migrations.', 'do2') },

  { t: 'Fixing drift honestly', to: true, giua: true, body: TT('c7/mig-drift3', 1, 21, 'diff ⇒ a real migration file ⇒ resolve --applied ⇒ check · real', { hl: [3, 9, 15], n: 118 }) +
    box('Why --applied is right here', 'The column already exists. We wrote it down as a migration and told Prisma it is done; then we added the field to schema.prisma. History matches reality again.', 'xanh') },

  { t: 'Drill: a required column, no default, rows exist', to: true, giua: true, body: TT('c7/mig-fail', 1, 22, 'npx prisma migrate deploy · real', { hl: [11, 15, 19], n: 112 }) +
    box('P3018 = the first failure', 'PostgreSQL error 23502: the new column would be NULL in rows that already exist.', 'do2') },

  { t: 'Run it again: P3009 blocks everything', to: true, giua: true, body: TT('c7/mig-fail', 25, 36, 'second deploy (CI retry, or a teammate\'s push) · real', { hl: [5, 7], n: 112 }) +
    two(box('From now on', 'No migration deploys at all — including your teammate\'s unrelated one. A stuck migration is an "we cannot ship" incident.', 'do2'),
      box('Before touching anything', 'Ask the only question that matters: <b>how much of it was applied?</b> Check the database and the history table.', 'cam')) },

  { t: 'How much was applied? Check, do not guess', to: true, giua: true, body: two(
    TT('c7/mig-fail', 38, 49, 'columns of Note · real', { n: 60 }),
    TT('c7/mig-fail', 51, 57, 'SELECT … FROM _prisma_migrations · real', { n: 52 })) +
    box('Read it', 'No slug column. applied_steps_count = 0, no finished_at. PostgreSQL runs DDL inside a transaction, so the migration rolled itself back completely. Lucky — and that is exactly why you check.', 'xanh') },

  { t: 'Recover in the safe order', to: true, giua: true, body: TT('c7/mig-fix', 1, 7, '1 · tell Prisma the failed run left nothing behind · real') +
    Q(tep('c7/add-slug-good.sql'), { hl: [2, 4, 6] }) + TT('c7/mig-fix', 33, 38, '3 · after migrate deploy · real') },

  { t: 'The history keeps both attempts', to: true, giua: true, body: TT('c7/mig-fix', 39, 47, 'the audit trail · real', { hl: [7, 8], sm: false }) + two(
    box('That is correct', 'An audit trail, not a cover-up. The failed run is rolled_back = t; the good one applied 1 step.', 'xanh'),
    box('Never reach for --applied to clear the red', 'It tells Prisma "this ran". If that is false, every later migration starts from a wrong point. Use --rolled-back when nothing was touched (checked above); --applied only when you finished the work by hand and verified it.', 'do2')) },

  { t: 'Never edit a migration that was applied', to: true, giua: true, body: TT('c7/mig-checksum', 1, 23, 'append a comment to the applied init migration · real', { hl: [11, 18], n: 112 }) +
    box('Silent on production, loud on a teammate\'s laptop', 'deploy says nothing; the next migrate dev sees a changed checksum and wants to reset. A mistake in an old file is fixed with a <b>new</b> migration.', 'cam') },

  { t: 'The three-step pattern works for every change', to: true, giua: true, body: flow([
    { t: 'expand', s: 'add, allow NULL', mau: LAM }, { t: 'migrate data', s: 'backfill', mau: NODE }, { t: 'contract', s: 'tighten / drop old', mau: TIM },
  ], { h: 150, fs: 23 }) + three(
    box('Add a required column', 'nullable ⇒ backfill ⇒ SET NOT NULL', 'lam'),
    box('Rename a column', 'add new ⇒ copy ⇒ code writes both ⇒ drop old', 'xanh'),
    box('Change a type', 'new column ⇒ convert ⇒ switch reads ⇒ drop old', 'cam')) +
    box('Each step is safe alone, and safe to stop after', 'That is what makes it deployable while users are online. PostgreSQL lesson 16.1 and DBI202 lesson 5.3 (ALTER TABLE on a table with data) show the same idea from the SQL side.', '') },

  { t: 'Exercise: rename title to heading, safely', to: true, giua: true, body: box('Your task', 'Production has a million notes and the API reads and writes <code class="i">title</code>. Write the steps (migrations and deploys) to rename the column to <code class="i">heading</code> with no downtime and no lost writes.', '') +
    box('Hint', 'Expand, migrate data, contract. Think about the code that runs between two migrations.', 'lam') +
    `<div data-k="dapan">${box('Answer', '1. migration: ADD COLUMN heading (nullable). 2. deploy code that writes <b>both</b>. 3. migration: UPDATE … SET heading = title WHERE heading IS NULL. 4. deploy code that reads heading. 5. migration: SET NOT NULL, then DROP COLUMN title.', 'xanh')}</div>` },

  { t: 'Self-check (part 2)', to: true, giua: true, body: `<ol>
<li>Why did <code class="i">migrate status</code> say "up to date" while drift existed?</li>
<li>What does migrate diff need to compare a migrations folder?</li>
<li>P3018 vs P3009: which is which?</li>
<li>When is <code class="i">resolve --rolled-back</code> the right call?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. It reads only the history table. &nbsp;2. A shadow database (shadowDatabaseUrl). &nbsp;3. P3018 = the first failure; P3009 = every deploy after, blocked. &nbsp;4. When you checked that the failed run left nothing behind.', 'xanh')}</div>` },

  { t: 'Summary (part 2)', to: true, giua: true, body: `<ul>
<li>Adding NOT NULL <b>with</b> a default is safe; without one, on a table with rows, it fails (23502 ⇒ P3018)</li>
<li>Drift: <code class="i">status</code> cannot see it, <code class="i">migrate diff</code> (with a shadow DB) can; fix it as a real migration</li>
<li>After a failure: stop, check what was applied, then <code class="i">resolve --rolled-back</code>, rewrite in three steps, deploy</li>
<li>Never edit an applied migration; never <code class="i">--applied</code> just to clear the red</li>
<li>Expand ⇒ migrate data ⇒ contract, for every risky change</li>
</ul>` + box('Next: lesson 7.3', 'CRUD and transactions: swap the Notes API onto PostgreSQL, and prove a rollback.', 'lam') },
]);
