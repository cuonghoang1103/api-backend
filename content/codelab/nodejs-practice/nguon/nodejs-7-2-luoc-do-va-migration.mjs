/** Node.js 7.2 — Lược đồ và migration sống sót trên production: SQL thật của migration, cột NOT NULL trên bảng có dữ liệu (nullable → backfill → siết), lịch sử _prisma_migrations, P3018 → P3009, soát migration rủi ro. */
import { modul, cs, q, tn, jsBai, goi, sqlBai, notesDb, luocDoNotes
  , sau, chan, duoc } from './_node-c6-8.mjs';

/* ── 1. Trắc nghiệm ── */
const E1 = cs({
  ten: '7.2 · 1 — migrate dev, deploy, status, diff, resolve: which one, where, and why', kho: 'EASY', phut: 8,
  en: 'A migration is the only code that runs once, against data you cannot recreate, usually while users are online. Six questions from lesson 7.2’s rehearsal on a table that has rows.',
  vi: 'Migration là đoạn code duy nhất chạy một lần, trên dữ liệu bạn không tạo lại được, thường khi người dùng đang online. Sáu câu hỏi từ buổi diễn tập của bài 7.2 trên một bảng đã có dữ liệu.',
  cau: [
    q('c1', ['Which command runs in CI against production?', 'Lệnh nào chạy trong CI trên production?'],
      ['migrate deploy — applies pending files in order, never creates a file, never resets, never asks', 'migrate dev — it keeps the schema and the database in sync', 'db push — it is the fastest', 'migrate reset — it guarantees a clean state'],
      ['migrate dev is development only, and it is exactly the command that offers to reset when it cannot reconcile.', 'migrate dev chỉ cho môi trường phát triển, và chính nó là lệnh đề nghị reset khi không khớp được.']),
    q('c2', ['Someone added a column with psql at 2 a.m. <code>npx prisma migrate status</code> prints “Database schema is up to date!”. Why?', 'Ai đó thêm một cột bằng psql lúc 2 giờ sáng. <code>npx prisma migrate status</code> in "Database schema is up to date!". Vì sao?'],
      ['status only reads the _prisma_migrations history table; it never compares real columns', 'psql changes are invisible to PostgreSQL until a restart', 'Prisma ignores columns whose names end in _col', 'status compares only table names, and no table was added'],
      ['To resolve drift honestly: put the diff output into a real migration file and mark it applied.', 'Xử lý lệch thật thà: đưa output của diff vào một tệp migration thật rồi đánh dấu đã áp dụng.']),
    q('c3', ['<code>ALTER TABLE "Note" ADD COLUMN "slug" TEXT NOT NULL;</code> on a table with rows fails with 23502 (P3018). The deploy is retried. What do you get now?', '<code>ALTER TABLE "Note" ADD COLUMN "slug" TEXT NOT NULL;</code> trên bảng có dữ liệu hỏng với 23502 (P3018). Deploy được chạy lại. Giờ bạn nhận gì?'],
      ['P3009 — a failed migration is recorded, and no migration can deploy any more, including a teammate’s innocent one', 'The same 23502 again, nothing else changes', 'Success — Prisma fills the column with empty strings on the second try', 'P2002, because the unique index already exists'],
      ['P3018 is the first failure; P3009 is every attempt after it. A stuck migration is an outage of your ability to ship.', 'P3018 là lần hỏng đầu; P3009 là mọi lần sau đó. Migration bị kẹt là sự cố mất khả năng phát hành.']),
    q('c4', ['Before touching anything after P3018, what is the only question that matters?', 'Trước khi đụng vào gì sau P3018, câu hỏi duy nhất quan trọng là gì?'],
      ['How much of it applied? Check the columns and the history table', 'Which developer wrote the migration, so they can fix it themselves?', 'Can we raise the statement timeout and simply deploy it again?', 'Is the shadow database up to date with the production schema?'],
      ['Here: no slug column, applied_steps_count = 0, no finished_at — PostgreSQL ran the DDL in a transaction and rolled back. Then resolve --rolled-back is honest.', 'Ở đây: không có cột slug, applied_steps_count = 0, không có finished_at — PostgreSQL chạy DDL trong transaction và đã rollback. Khi đó resolve --rolled-back là trung thực.']),
    q('c5', ['Why should you never reach for <code>migrate resolve --applied</code> “to make the red go away”?', 'Vì sao không bao giờ dùng <code>migrate resolve --applied</code> "cho hết đỏ"?'],
      ['It records a success that never happened; later migrations build on a lie', 'It deletes the failed migration file from the repository for good', 'It drops and recreates the whole database from the migration files', 'It only works with SQLite and corrupts PostgreSQL databases'],
      ['Use --applied only when you finished the work by hand and verified it.', 'Chỉ dùng --applied khi bạn đã tự làm xong việc bằng tay và kiểm lại.']),
    q('c6', ['You forget <code>notes Note[]</code> on model User. What happens?', 'Bạn quên <code>notes Note[]</code> trong model User. Chuyện gì xảy ra?'],
      ['prisma generate stops: the relation is “missing an opposite relation field”', 'The foreign key column authorId is silently not created in the table', 'Deleting a user no longer cascades to the notes that user wrote', 'Nothing at all, because a back-relation is only an optional hint'],
      ['Every relation is two fields. The back-relation creates no column; it is how you write include: { notes: true }. Two relations to the same model need @relation("Name") on each pair.', 'Mỗi quan hệ là hai trường. Quan hệ ngược không tạo cột; nó là cách bạn viết include: { notes: true }. Hai quan hệ tới cùng model cần @relation("Tên") cho mỗi cặp.']),
  ],
  goiY: [['Separate the history table (what Prisma believes) from the real schema (what PostgreSQL has).', 'Tách bảng lịch sử (điều Prisma tin) khỏi lược đồ thật (thứ PostgreSQL có).'], ['On production the safe set is tiny: deploy, status, diff — and resolve only after a human checked.', 'Trên production tập lệnh an toàn rất nhỏ: deploy, status, diff — và resolve chỉ sau khi con người đã kiểm.']],
  loi: [['Running migrate dev against a real database and accepting the reset prompt.', 'Chạy migrate dev trên CSDL thật và đồng ý lời mời reset.'], ['resolve --applied on a migration that never finished.', 'resolve --applied cho migration chưa bao giờ chạy xong.']],
  tns: [tn('drift', 'lệch lược đồ', 'CSDL khác lịch sử migration.'), tn('P3018 / P3009', 'P3018 / P3009', 'Migration hỏng / đã có migration hỏng nên chặn mọi migration.'), tn('shadow database', 'CSDL bóng', 'CSDL tạm migrate dev dùng để so.')],
  kn: ['migrations', 'Prisma Migrate'],
});

/* ── 2. Migration ba bước: nullable → backfill → siết ── */
const DB_NO_SLUG = notesDb({ slug: false, tag: false });
const SLUG_DUNG = `-- prisma/migrations/20260727170000_add_slug/migration.sql — the version that survives a table with rows
ALTER TABLE "Note" ADD COLUMN "slug" TEXT;                        -- 1. nullable first: every existing row can take NULL
UPDATE "Note" SET "slug" = 'note-' || "id" WHERE "slug" IS NULL;  -- 2. backfill from something unique (the id)
ALTER TABLE "Note" ALTER COLUMN "slug" SET NOT NULL;              -- 3. then tighten
CREATE UNIQUE INDEX "Note_slug_key" ON "Note"("slug");            -- the @unique of the schema
`;
const SLUG_SAI = `-- prisma/migrations/20260727170000_add_slug/migration.sql — generated by migrate dev
ALTER TABLE "Note" ADD COLUMN "slug" TEXT NOT NULL;
CREATE UNIQUE INDEX "Note_slug_key" ON "Note"("slug");
`;
const THEM_3 = `INSERT INTO "Note" (title, body, pinned, "authorId", "createdAt", "updatedAt") VALUES
  ('Late note A', '', false, 2, '2026-08-01 09:00', '2026-08-01 09:00'), ('Late note B', '', true, 3, '2026-08-01 10:00', '2026-08-01 10:00'), ('Late note C', '', false, 1, '2026-08-02 09:00', '2026-08-02 09:00');
DELETE FROM "Note" WHERE id = 4;`;
const E2 = sqlBai({
  ten: '7.2 · 2 — Rewrite the add_slug migration so it survives a table that has rows', kho: 'MEDIUM', phut: 15,
  en: `<p>The schema gained <code>slug String @unique</code> on <code>Note</code>, and <code>migrate dev</code> generated the two-line migration in the starter. On a table with rows it dies with <code>ERROR: column "slug" of relation "Note" contains null values</code> (23502 ⇒ P3018). Rewrite it in the three steps of lesson 7.2 so it applies on <b>any</b> table:</p>
<ol><li>add <code>"slug"</code> as <code>TEXT</code>, <b>nullable</b>;</li><li>backfill every row with <code>'note-' || "id"</code>;</li><li>set it <code>NOT NULL</code>;</li><li>create the unique index <code>"Note_slug_key"</code>.</li></ol>
<p>The grader runs your file on the sample database (10 notes, no slug column), then checks the data and the constraints. A hidden check runs it on different rows (some added, one deleted), so the backfill must not hard-code ids.</p>`,
  vi: `<p>Lược đồ có thêm <code>slug String @unique</code> trên <code>Note</code>, và <code>migrate dev</code> sinh ra migration hai dòng trong code khởi đầu. Trên bảng có dữ liệu nó chết với <code>ERROR: column "slug" of relation "Note" contains null values</code> (23502 ⇒ P3018). Viết lại theo ba bước của bài 7.2 để nó chạy được trên <b>mọi</b> bảng:</p>
<ol><li>thêm <code>"slug"</code> kiểu <code>TEXT</code>, <b>cho phép NULL</b>;</li><li>điền mọi dòng bằng <code>'note-' || "id"</code>;</li><li>đặt <code>NOT NULL</code>;</li><li>tạo chỉ mục unique <code>"Note_slug_key"</code>.</li></ol>
<p>Máy chấm chạy tệp của bạn trên CSDL mẫu (10 ghi chú, chưa có cột slug), rồi kiểm dữ liệu và ràng buộc. Một kiểm ẩn chạy trên các dòng khác (thêm vài dòng, xoá một dòng), nên bước điền không được ghi cứng id.</p>`,
  yc: [['Plain PostgreSQL statements, no BEGIN/COMMIT (the grader wraps your file in a transaction, like migrate deploy).', 'Câu lệnh PostgreSQL thường, không BEGIN/COMMIT (máy chấm tự bọc tệp trong transaction, như migrate deploy).'], ['Keep the index name <code>"Note_slug_key"</code> — Prisma looks for it.', 'Giữ tên chỉ mục <code>"Note_slug_key"</code> — Prisma tìm đúng tên này.']],
  giai: SLUG_DUNG, khoi: SLUG_SAI,
  csdl: DB_NO_SLUG, ld: luocDoNotes({ slug: false, tag: false }),
  kiem: [
    sau(['Every note got slug = note-ID', 'Mọi ghi chú có slug = note-ID'], `SELECT id, slug FROM "Note" ORDER BY id`, { thuTu: true }),
    sau(['slug is NOT NULL now', 'slug giờ là NOT NULL'], `SELECT is_nullable, data_type FROM information_schema.columns WHERE table_name = 'Note' AND column_name = 'slug'`),
    chan(['A duplicate slug is rejected (unique index)', 'slug trùng bị từ chối (chỉ mục unique)'], `INSERT INTO "Note" (title, slug, "authorId", "createdAt", "updatedAt") VALUES ('dup', 'note-1', 1, now(), now())`, '23505'),
    chan(['A note without slug is rejected', 'Ghi chú không có slug bị từ chối'], `INSERT INTO "Note" (title, "authorId", "createdAt", "updatedAt") VALUES ('no slug', 1, now(), now())`, '23502'),
    sau(['The index is called "Note_slug_key"', 'Chỉ mục tên "Note_slug_key"'], `SELECT indexname FROM pg_indexes WHERE tablename = 'Note' AND indexdef LIKE '%UNIQUE%slug%'`),
    sau(['Hidden: other rows — the backfill uses each row’s own id', 'Ẩn: dòng khác — bước điền dùng id của chính từng dòng'], `SELECT id, slug FROM "Note" ORDER BY id`, { thuTu: true, an: true, themCsdl: THEM_3 }),
  ],
  sai: [SLUG_SAI, `ALTER TABLE "Note" ADD COLUMN "slug" TEXT;\nUPDATE "Note" SET "slug" = 'note';\nALTER TABLE "Note" ALTER COLUMN "slug" SET NOT NULL;\nCREATE UNIQUE INDEX "Note_slug_key" ON "Note"("slug");`, `ALTER TABLE "Note" ADD COLUMN "slug" TEXT DEFAULT 'x';\nCREATE INDEX "Note_slug_key" ON "Note"("slug");`],
  goiY: [['Step 1 is the same ALTER TABLE without NOT NULL. Step 2 is an UPDATE with string concatenation <code>||</code>.', 'Bước 1 là cùng câu ALTER TABLE nhưng bỏ NOT NULL. Bước 2 là một UPDATE với phép nối chuỗi <code>||</code>.'], ['Step 3: <code>ALTER TABLE "Note" ALTER COLUMN "slug" SET NOT NULL;</code>. Quote the camelCase column names: <code>"authorId"</code>, not <code>authorId</code>.', 'Bước 3: <code>ALTER TABLE "Note" ALTER COLUMN "slug" SET NOT NULL;</code>. Đặt tên cột camelCase trong ngoặc kép: <code>"authorId"</code>, không phải <code>authorId</code>.']],
  loi: [['Keeping <code>ADD COLUMN … NOT NULL</code> without a default on a table with rows — 23502, P3018, then P3009 blocks every deploy.', 'Giữ <code>ADD COLUMN … NOT NULL</code> không có mặc định trên bảng có dữ liệu — 23502, P3018, rồi P3009 chặn mọi deploy.'], ['Backfilling with a constant (<code>\'note\'</code>): the column is filled, and the unique index then fails on duplicates.', 'Điền bằng hằng số (<code>\'note\'</code>): cột có dữ liệu, rồi chỉ mục unique hỏng vì trùng.'], ['Using <code>DEFAULT \'x\'</code> to make the error disappear: every row gets the same slug and the column keeps a default nobody wanted.', 'Dùng <code>DEFAULT \'x\'</code> cho hết lỗi: mọi dòng cùng một slug và cột giữ một mặc định không ai muốn.']],
  gt: ['Each step is safe on its own and safe to stop after: adding a nullable column never fails, the backfill derives a unique value from the primary key, and SET NOT NULL succeeds because no NULL is left. The same shape — add, copy, tighten — covers renames and type changes while users are online.', 'Mỗi bước tự nó an toàn và dừng sau nó cũng an toàn: thêm cột cho phép NULL không bao giờ hỏng, bước điền lấy giá trị duy nhất từ khoá chính, và SET NOT NULL thành công vì không còn NULL. Cùng hình dạng — thêm, chép, siết — dùng được cho đổi tên và đổi kiểu khi người dùng đang online.'],
  tns: [tn('backfill', 'điền dữ liệu cũ', 'Gán giá trị cho các dòng đã có.'), tn('23502', '23502', 'not_null_violation.')],
  kn: ['migrations', 'zero-downtime'],
});

/* ── 3. Migration thứ hai: version + bảng nối nhiều-nhiều ── */
const DB_NO_TAG = notesDb({ slug: true, tag: false, version: false });
const TAG_DUNG = `-- prisma/migrations/20260727163003_add_tags_and_version/migration.sql
-- AlterTable: safe on a table with rows, because every existing row can take the default
ALTER TABLE "Note" ADD COLUMN "version" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(40) NOT NULL,
    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable: a many-to-many relation IS a table with two foreign keys and a compound primary key
CREATE TABLE "NoteTag" (
    "noteId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    CONSTRAINT "NoteTag_pkey" PRIMARY KEY ("noteId", "tagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- AddForeignKey: deleting a note (or a tag) removes its links, enforced by PostgreSQL
ALTER TABLE "NoteTag" ADD CONSTRAINT "NoteTag_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "NoteTag" ADD CONSTRAINT "NoteTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
`;
const TAG_KHOI = `-- prisma/migrations/20260727163003_add_tags_and_version/migration.sql
-- Write the migration here: version column, "Tag", "NoteTag"
ALTER TABLE "Note" ADD COLUMN "version" INTEGER NOT NULL;
CREATE TABLE "Tag" ("id" SERIAL PRIMARY KEY, "name" VARCHAR(40) NOT NULL);
CREATE TABLE "NoteTag" ("noteId" INTEGER NOT NULL, "tagId" INTEGER NOT NULL);
`;
const E3 = sqlBai({
  ten: '7.2 · 3 — Write the add_tags_and_version migration by hand, the way Prisma generates it', kho: 'MEDIUM', phut: 18,
  en: `<p>Lesson 7.2’s second migration: tags and a version column. The generated SQL is ordinary SQL you must be able to read in a pull request — so write it yourself. On the sample database (10 notes, no <code>version</code>, no tag tables):</p>
<ul><li><code>"Note"."version"</code> — <code>INTEGER NOT NULL DEFAULT 1</code> (safe on a table with rows: every row takes the default).</li>
<li><code>"Tag"</code> — <code>"id" SERIAL</code> primary key, <code>"name" VARCHAR(40) NOT NULL</code>, unique index <code>"Tag_name_key"</code>.</li>
<li><code>"NoteTag"</code> — <code>"noteId"</code>, <code>"tagId"</code> (both <code>INTEGER NOT NULL</code>), compound primary key <code>("noteId", "tagId")</code>, a foreign key to <code>"Note"("id")</code> and one to <code>"Tag"("id")</code>, both <code>ON DELETE CASCADE</code>.</li></ul>`,
  vi: `<p>Migration thứ hai của bài 7.2: tag và cột version. SQL được sinh ra là SQL bình thường mà bạn phải đọc được trong pull request — nên hãy tự viết. Trên CSDL mẫu (10 ghi chú, chưa có <code>version</code>, chưa có bảng tag):</p>
<ul><li><code>"Note"."version"</code> — <code>INTEGER NOT NULL DEFAULT 1</code> (an toàn trên bảng có dữ liệu: mọi dòng nhận mặc định).</li>
<li><code>"Tag"</code> — khoá chính <code>"id" SERIAL</code>, <code>"name" VARCHAR(40) NOT NULL</code>, chỉ mục unique <code>"Tag_name_key"</code>.</li>
<li><code>"NoteTag"</code> — <code>"noteId"</code>, <code>"tagId"</code> (đều <code>INTEGER NOT NULL</code>), khoá chính ghép <code>("noteId", "tagId")</code>, một khoá ngoại tới <code>"Note"("id")</code> và một tới <code>"Tag"("id")</code>, cả hai <code>ON DELETE CASCADE</code>.</li></ul>`,
  yc: [['Run on a table that has rows.', 'Chạy được trên bảng đã có dữ liệu.'], ['Constraints live in the database, not in your service code.', 'Ràng buộc nằm trong CSDL, không nằm trong code service.']],
  giai: TAG_DUNG, khoi: TAG_KHOI,
  csdl: DB_NO_TAG, ld: luocDoNotes({ slug: true, tag: false, version: false }),
  kiem: [
    sau(['Existing notes have version = 1', 'Ghi chú cũ có version = 1'], `SELECT count(*) AS notes, min(version) AS lo, max(version) AS hi FROM "Note"`),
    duoc(['A note can be tagged', 'Gắn tag cho ghi chú được'], `INSERT INTO "Tag" (name) VALUES ('work'); INSERT INTO "NoteTag" ("noteId", "tagId") VALUES (1, 1)`),
    chan(['The same tag twice on one note is rejected (compound PK)', 'Gắn cùng tag hai lần lên một ghi chú bị từ chối (khoá ghép)'], `INSERT INTO "Tag" (name) VALUES ('work'); INSERT INTO "NoteTag" ("noteId", "tagId") VALUES (1, 1), (1, 1)`, '23505'),
    chan(['A link to a note that does not exist is rejected (FK)', 'Liên kết tới ghi chú không tồn tại bị từ chối (FK)'], `INSERT INTO "Tag" (name) VALUES ('work'); INSERT INTO "NoteTag" ("noteId", "tagId") VALUES (999, 1)`, '23503'),
    chan(['Tag names are unique', 'Tên tag là duy nhất'], `INSERT INTO "Tag" (name) VALUES ('work'), ('work')`, '23505'),
    sau(['Hidden: deleting a note and a tag cascades to NoteTag', 'Ẩn: xoá ghi chú và tag thì NoteTag bị xoá theo'], `INSERT INTO "Tag" (name) VALUES ('a'), ('b'); INSERT INTO "NoteTag" VALUES (1, 1), (2, 1), (2, 2), (3, 2); DELETE FROM "Note" WHERE id = 2; DELETE FROM "Tag" WHERE name = 'b'; SELECT "noteId", "tagId" FROM "NoteTag" ORDER BY 1, 2`, { an: true }),
    sau(['Hidden: a new note gets version 1 by default', 'Ẩn: ghi chú mới nhận version 1 mặc định'], `INSERT INTO "Note" (title, slug, "authorId", "createdAt", "updatedAt") VALUES ('new', 'note-new', 1, now(), now()); SELECT version FROM "Note" WHERE slug = 'note-new'`, { an: true }),
  ],
  sai: [TAG_KHOI, TAG_DUNG.replace(/ ON DELETE CASCADE ON UPDATE CASCADE/g, ''), TAG_DUNG.replace('CONSTRAINT "NoteTag_pkey" PRIMARY KEY ("noteId", "tagId")', 'CONSTRAINT "NoteTag_pkey" PRIMARY KEY ("noteId")')],
  goiY: [['Write it in the order Prisma does: AlterTable, CreateTable ×2, CreateIndex, AddForeignKey ×2.', 'Viết theo thứ tự Prisma làm: AlterTable, CreateTable ×2, CreateIndex, AddForeignKey ×2.'], ['The compound key is <code>CONSTRAINT "NoteTag_pkey" PRIMARY KEY ("noteId", "tagId")</code>; a foreign key is <code>ALTER TABLE "NoteTag" ADD CONSTRAINT … FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE CASCADE</code>.', 'Khoá ghép là <code>CONSTRAINT "NoteTag_pkey" PRIMARY KEY ("noteId", "tagId")</code>; khoá ngoại là <code>ALTER TABLE "NoteTag" ADD CONSTRAINT … FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE CASCADE</code>.']],
  loi: [['<code>version INTEGER NOT NULL</code> without DEFAULT — the most common way a migration fails on production.', '<code>version INTEGER NOT NULL</code> không có DEFAULT — cách phổ biến nhất để migration hỏng trên production.'], ['A primary key on noteId alone: a note can then have only one tag.', 'Khoá chính chỉ trên noteId: khi đó một ghi chú chỉ có được một tag.'], ['Foreign keys without ON DELETE CASCADE: deleting a tagged note fails with 23503.', 'Khoá ngoại thiếu ON DELETE CASCADE: xoá ghi chú có tag hỏng với 23503.']],
  gt: ['Writing the join table explicitly (instead of Prisma’s implicit many-to-many) is what lets you add columns later — who attached the tag, and when. And every rule the checks exercise — no duplicate link, no link to a missing note, links disappear with their note — is enforced by PostgreSQL itself, so no bug in a service can break it.', 'Viết bảng nối tường minh (thay vì nhiều-nhiều ngầm của Prisma) cho phép sau này thêm cột — ai gắn tag, lúc nào. Và mọi luật mà các kiểm thử — không trùng liên kết, không liên kết tới ghi chú không có, liên kết biến mất theo ghi chú — đều do chính PostgreSQL thực thi, nên không lỗi service nào phá được.'],
  tns: [tn('join table', 'bảng nối', 'Hai khoá ngoại + khoá chính ghép.'), tn('compound primary key', 'khoá chính ghép'), tn('ON DELETE CASCADE', 'xoá theo')],
  kn: ['migrations', 'many-to-many'],
});

/* ── 4. migrate status / P3009 từ bảng lịch sử ── */
function migrateStatus(files, history) {
  // a row is applied when it finished and was not rolled back; a FAILED row has neither
  const live = history.filter((r) => r.rolled_back_at == null);
  const applied = live.filter((r) => r.finished_at != null).map((r) => r.migration_name);
  const failed = live.filter((r) => r.finished_at == null).map((r) => r.migration_name);
  const known = new Set(files);
  const pending = files.filter((f) => !applied.includes(f) && !failed.includes(f));
  const missingLocally = [...new Set(applied)].filter((m) => !known.has(m));     // in the database, not in the repo
  const result = { applied, pending, failed, missingLocally, canDeploy: failed.length === 0 };
  if (failed.length) result.error = 'P3009';      // one failed row blocks EVERY migration, including the innocent ones
  return result;
}
const H = (name, finished, rolled = null, steps = finished ? 1 : 0) => ({ migration_name: name, finished_at: finished, rolled_back_at: rolled, applied_steps_count: steps });
const FILES = ['20260727162756_init', '20260727163003_add_tags_and_version', '20260727170000_add_slug'];
const E4 = jsBai({
  ten: '7.2 · 4 — Write migrateStatus(files, history): read _prisma_migrations like Prisma does', kho: 'MEDIUM', phut: 15,
  en: `<p>“Prisma keeps a table in your database listing what has been applied. Nothing else — no magic.” Write <code>migrateStatus(files, history)</code>. <code>files</code> = migration folder names in the repo (sorted); <code>history</code> = rows of <code>_prisma_migrations</code> <code>{ migration_name, finished_at, rolled_back_at, applied_steps_count }</code> (times are strings or <code>null</code>). A name may appear in several rows (the lesson’s history holds both attempts of add_slug). Return:</p>
<ul><li><code>applied</code>: names of rows with <code>finished_at</code> set and <code>rolled_back_at</code> null, in history order.</li>
<li><code>failed</code>: names of rows with neither <code>finished_at</code> nor <code>rolled_back_at</code>. Rolled-back rows are ignored.</li>
<li><code>pending</code>: files (in file order) that are neither applied nor failed.</li>
<li><code>missingLocally</code>: applied names that are not in <code>files</code> (each once).</li>
<li><code>canDeploy</code>: <code>true</code> unless something failed; when it is <code>false</code> also set <code>error: "P3009"</code>.</li></ul>`,
  vi: `<p>"Prisma giữ một bảng trong CSDL liệt kê những gì đã áp dụng. Không gì khác — không phép màu." Viết <code>migrateStatus(files, history)</code>. <code>files</code> = tên các thư mục migration trong repo (đã sắp); <code>history</code> = các dòng của <code>_prisma_migrations</code> <code>{ migration_name, finished_at, rolled_back_at, applied_steps_count }</code> (thời gian là chuỗi hoặc <code>null</code>). Một tên có thể xuất hiện ở nhiều dòng (lịch sử của bài giữ cả hai lần thử add_slug). Trả về:</p>
<ul><li><code>applied</code>: tên các dòng có <code>finished_at</code> và <code>rolled_back_at</code> là null, theo thứ tự lịch sử.</li>
<li><code>failed</code>: tên các dòng không có cả <code>finished_at</code> lẫn <code>rolled_back_at</code>. Dòng đã rollback bị bỏ qua.</li>
<li><code>pending</code>: các tệp (theo thứ tự tệp) không applied cũng không failed.</li>
<li><code>missingLocally</code>: tên applied mà không có trong <code>files</code> (mỗi tên một lần).</li>
<li><code>canDeploy</code>: <code>true</code> trừ khi có cái hỏng; khi <code>false</code> thì đặt thêm <code>error: "P3009"</code>.</li></ul>`,
  yc: [['Judge each ROW, then the names.', 'Xét từng DÒNG, rồi mới tới tên.'], ['Only add <code>error</code> when deploy is blocked.', 'Chỉ thêm <code>error</code> khi deploy bị chặn.']],
  goiY: [['First drop rows with <code>rolled_back_at</code>; the rest are either finished (applied) or not (failed).', 'Trước hết bỏ các dòng có <code>rolled_back_at</code>; phần còn lại hoặc đã xong (applied) hoặc chưa (failed).'], ['A rolled-back attempt plus a later successful attempt of the same name ⇒ applied, not failed.', 'Một lần thử đã rollback cộng một lần thử sau thành công cùng tên ⇒ applied, không phải failed.']],
  loi: [['Treating a rolled-back row as failed: after an honest <code>resolve --rolled-back</code> you would still be blocked.', 'Coi dòng đã rollback là hỏng: sau một lần <code>resolve --rolled-back</code> thật thà bạn vẫn bị chặn.'], ['Thinking status compares columns — it reads exactly this table and nothing else, which is why drift by psql is invisible to it.', 'Nghĩ status so sánh các cột — nó đọc đúng bảng này và không gì khác, nên lệch do psql là vô hình với nó.']],
  gt: ['This is all migrate status and migrate deploy know: rows of a history table. A row without finished_at is a migration that started and did not finish — Prisma cannot know how much of it ran, so it refuses to compute anything after it (P3009) until a human says what happened.', 'Đây là tất cả những gì migrate status và migrate deploy biết: các dòng của một bảng lịch sử. Dòng không có finished_at là migration đã bắt đầu mà chưa xong — Prisma không biết nó đã chạy bao nhiêu, nên từ chối tính tiếp (P3009) cho tới khi con người nói chuyện gì đã xảy ra.'],
  kn: ['migrations', 'Prisma Migrate'],
  tns: [tn('_prisma_migrations', 'bảng lịch sử migration'), tn('rolled back', 'đã hoàn tác')],
  dau: `function migrateStatus(files, history) {
  // Write your solution here
  const applied = history.map((r) => r.migration_name);
  return { applied, pending: files.filter((f) => !applied.includes(f)), failed: [], missingLocally: [], canDeploy: true };
}
`,
  giai: migrateStatus,
  cases: [
    { goi: goi('migrateStatus', FILES, [H(FILES[0], '2026-07-27 16:27:56'), H(FILES[1], '2026-07-27 16:30:03')]), moTa: ['add_slug is pending', 'add_slug đang chờ'] },
    { goi: goi('migrateStatus', FILES, [H(FILES[0], '2026-07-27 16:27:56'), H(FILES[1], '2026-07-27 16:30:03'), H(FILES[2], null)]), moTa: ['add_slug failed ⇒ P3009', 'add_slug hỏng ⇒ P3009'] },
    { goi: goi('migrateStatus', FILES, [H(FILES[0], '16:27:56'), H(FILES[1], '16:30:03'), H(FILES[2], null, '16:40:00', 0), H(FILES[2], '16:41:10')]), moTa: ['Rolled back, then applied again (the lesson’s audit trail)', 'Rollback rồi áp dụng lại (dấu vết kiểm toán của bài)'] },
    { goi: goi('migrateStatus', [...FILES, '20260801090000_add_index'], [H(FILES[0], 'x'), H(FILES[1], null), H('20260720000000_hotfix_from_laptop', 'y')]), an: true },
    { goi: goi('migrateStatus', FILES, []), an: true },
    { goi: goi('migrateStatus', FILES.slice(0, 2), [H(FILES[0], 'a'), H(FILES[1], null, 'b', 0)]), an: true },
  ],
  saiMau: [
    migrateStatus.toString().replace('const live = history.filter((r) => r.rolled_back_at == null);', 'const live = history;'),
  ],
});

/* ── 5. Soát migration rủi ro trước khi merge ── */
function lintMigration(sql, rowsIn) {
  const out = [];
  const name = (s) => s.replace(/"/g, '');
  // split into statements, dropping -- comments and blank parts
  const stmts = sql.split('\n').map((l) => l.replace(/--.*$/, '')).join('\n').split(';').map((s) => s.trim()).filter(Boolean);
  const backfilled = new Set();                                   // "table.column" values set by an UPDATE earlier in this file
  stmts.forEach((s, i) => {
    const n = i + 1;
    let m;
    if ((m = /^UPDATE\s+("?\w+"?)\s+SET\s+("?\w+"?)/i.exec(s))) backfilled.add(name(m[1]) + '.' + name(m[2]));
    if ((m = /^ALTER\s+TABLE\s+("?\w+"?)\s+ADD\s+COLUMN\s+("?\w+"?)\s+(.*)$/is.exec(s))) {
      const table = name(m[1]), column = name(m[2]), rest = m[3];
      if (/NOT\s+NULL/i.test(rest) && !/DEFAULT/i.test(rest) && (rowsIn[table] || 0) > 0) out.push({ statement: n, level: 'error', code: 'NOT_NULL_WITHOUT_DEFAULT', table, column });
    }
    if ((m = /^ALTER\s+TABLE\s+("?\w+"?)\s+ALTER\s+COLUMN\s+("?\w+"?)\s+SET\s+NOT\s+NULL/i.exec(s))) {
      const table = name(m[1]), column = name(m[2]);
      if ((rowsIn[table] || 0) > 0 && !backfilled.has(table + '.' + column)) out.push({ statement: n, level: 'error', code: 'TIGHTEN_BEFORE_BACKFILL', table, column });
    }
    if ((m = /^ALTER\s+TABLE\s+("?\w+"?)\s+DROP\s+COLUMN\s+("?\w+"?)/i.exec(s))) out.push({ statement: n, level: 'warning', code: 'DROP_COLUMN', table: name(m[1]), column: name(m[2]) });
    if ((m = /^ALTER\s+TABLE\s+("?\w+"?)\s+RENAME\s+COLUMN\s+("?\w+"?)/i.exec(s))) out.push({ statement: n, level: 'warning', code: 'RENAME_COLUMN', table: name(m[1]), column: name(m[2]) });
    if ((m = /^DROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?("?\w+"?)/i.exec(s))) out.push({ statement: n, level: 'warning', code: 'DROP_TABLE', table: name(m[1]), column: null });
  });
  return out;
}
const E5 = jsBai({
  ten: '7.2 · 5 — Write lintMigration(sql, rowsIn): flag the statements that fail or lose data on production', kho: 'HARD', phut: 30,
  en: `<p>“Read it in code review the way you read any other change — an ALTER TABLE … NOT NULL on a big table is a lock; a DROP COLUMN is data you will never get back.” Automate the review. <code>lintMigration(sql, rowsIn)</code> gets a <code>migration.sql</code> text and <code>rowsIn</code> = <code>{ tableName: rowCount }</code> of production. Remove <code>--</code> comments, split on <code>;</code>, number the non-empty statements from 1, and report <code>{ statement, level, code, table, column }</code> in order (names without quotes):</p>
<ul><li><code>ALTER TABLE t ADD COLUMN c … NOT NULL</code> with no <code>DEFAULT</code>, on a table with rows ⇒ <code>error</code>, <code>NOT_NULL_WITHOUT_DEFAULT</code>.</li>
<li><code>ALTER TABLE t ALTER COLUMN c SET NOT NULL</code> on a table with rows, when no earlier statement in the file was <code>UPDATE t SET c …</code> ⇒ <code>error</code>, <code>TIGHTEN_BEFORE_BACKFILL</code>.</li>
<li><code>ALTER TABLE t DROP COLUMN c</code> ⇒ <code>warning</code>, <code>DROP_COLUMN</code>; <code>ALTER TABLE t RENAME COLUMN c …</code> ⇒ <code>warning</code>, <code>RENAME_COLUMN</code> (old code still reading <code>c</code> breaks — add, copy, then drop); <code>DROP TABLE [IF EXISTS] t</code> ⇒ <code>warning</code>, <code>DROP_TABLE</code>, <code>column: null</code>.</li></ul>
<p>Keywords are case-insensitive; identifiers may or may not be quoted. Tables missing from <code>rowsIn</code> have 0 rows. Only the FIRST <code>SET</code> column of an UPDATE counts as backfilled.</p>`,
  vi: `<p>"Đọc nó khi review như mọi thay đổi khác — một ALTER TABLE … NOT NULL trên bảng lớn là một khoá; một DROP COLUMN là dữ liệu bạn không bao giờ lấy lại được." Hãy tự động hoá việc review. <code>lintMigration(sql, rowsIn)</code> nhận chữ của <code>migration.sql</code> và <code>rowsIn</code> = <code>{ tênBảng: sốDòng }</code> của production. Bỏ chú thích <code>--</code>, tách theo <code>;</code>, đánh số các câu không rỗng từ 1, và báo <code>{ statement, level, code, table, column }</code> theo thứ tự (tên không có ngoặc kép):</p>
<ul><li><code>ALTER TABLE t ADD COLUMN c … NOT NULL</code> không có <code>DEFAULT</code>, trên bảng có dữ liệu ⇒ <code>error</code>, <code>NOT_NULL_WITHOUT_DEFAULT</code>.</li>
<li><code>ALTER TABLE t ALTER COLUMN c SET NOT NULL</code> trên bảng có dữ liệu, khi trước đó trong tệp không có câu <code>UPDATE t SET c …</code> ⇒ <code>error</code>, <code>TIGHTEN_BEFORE_BACKFILL</code>.</li>
<li><code>ALTER TABLE t DROP COLUMN c</code> ⇒ <code>warning</code>, <code>DROP_COLUMN</code>; <code>ALTER TABLE t RENAME COLUMN c …</code> ⇒ <code>warning</code>, <code>RENAME_COLUMN</code> (code cũ còn đọc <code>c</code> sẽ hỏng — thêm, chép, rồi mới bỏ); <code>DROP TABLE [IF EXISTS] t</code> ⇒ <code>warning</code>, <code>DROP_TABLE</code>, <code>column: null</code>.</li></ul>
<p>Từ khoá không phân biệt hoa thường; định danh có thể có hoặc không có ngoặc kép. Bảng không có trong <code>rowsIn</code> coi như 0 dòng. Chỉ cột ĐẦU TIÊN sau <code>SET</code> của UPDATE được tính là đã điền.</p>`,
  yc: [['Statements are numbered after comments are removed and empty parts dropped.', 'Đánh số câu sau khi bỏ chú thích và bỏ phần rỗng.'], ['Return an empty array for a clean migration.', 'Migration sạch thì trả mảng rỗng.']],
  goiY: [['Normalise first: <code>sql.split("\\n").map(l => l.replace(/--.*$/, "")).join("\\n").split(";").map(s => s.trim()).filter(Boolean)</code>.', 'Chuẩn hoá trước: <code>sql.split("\\n").map(l => l.replace(/--.*$/, "")).join("\\n").split(";").map(s => s.trim()).filter(Boolean)</code>.'], ['One regex per rule, e.g. <code>/^ALTER\\s+TABLE\\s+("?\\w+"?)\\s+ADD\\s+COLUMN\\s+("?\\w+"?)\\s+(.*)$/is</code>; strip quotes with <code>.replace(/"/g, "")</code>. Remember UPDATEs in a Set of <code>"table.column"</code>.', 'Mỗi luật một regex, ví dụ <code>/^ALTER\\s+TABLE\\s+("?\\w+"?)\\s+ADD\\s+COLUMN\\s+("?\\w+"?)\\s+(.*)$/is</code>; bỏ ngoặc kép bằng <code>.replace(/"/g, "")</code>. Nhớ các UPDATE trong một Set <code>"bảng.cột"</code>.']],
  loi: [['Flagging NOT NULL with a DEFAULT — <code>ADD COLUMN "version" INTEGER NOT NULL DEFAULT 1</code> is the safe pattern the lesson uses.', 'Báo lỗi NOT NULL có DEFAULT — <code>ADD COLUMN "version" INTEGER NOT NULL DEFAULT 1</code> là mẫu an toàn bài dùng.'], ['Flagging an empty table: a NOT NULL column on a table with 0 rows cannot fail.', 'Báo lỗi bảng rỗng: cột NOT NULL trên bảng 0 dòng không thể hỏng.'], ['Forgetting that the regex must be case-insensitive and tolerate missing quotes: hand-written migrations rarely look like generated ones.', 'Quên regex phải không phân biệt hoa thường và chấp nhận thiếu ngoặc kép: migration viết tay hiếm khi giống migration sinh ra.']],
  gt: ['The two errors are the two ways the lesson’s add_slug could fail on production: a NOT NULL column with nothing to fill it, or a tightening that runs before the backfill. The warnings are the irreversible ones — they are not wrong, but a human must decide them deliberately. A check like this in CI catches them before migrate deploy turns them into P3018.', 'Hai lỗi chính là hai cách add_slug của bài có thể hỏng trên production: cột NOT NULL không có gì để điền, hoặc siết chặt chạy trước khi điền. Các cảnh báo là thứ không đảo ngược được — chúng không sai, nhưng con người phải quyết định có chủ ý. Phép kiểm này trong CI bắt chúng trước khi migrate deploy biến chúng thành P3018.'],
  kn: ['migrations', 'code review', 'regex'],
  tns: [tn('lint', 'soát lỗi tĩnh', 'Kiểm code mà không chạy nó.'), tn('irreversible', 'không đảo ngược được')],
  dau: `function lintMigration(sql, rowsIn) {
  // Write your solution here
  const out = [];
  sql.split(';').forEach((s, i) => {
    if (/NOT NULL/.test(s)) out.push({ statement: i + 1, level: 'error', code: 'NOT_NULL_WITHOUT_DEFAULT', table: 'Note', column: 'slug' });
  });
  return out;
}
`,
  giai: lintMigration,
  cases: [
    { goi: goi('lintMigration', SLUG_SAI, { Note: 751000 }), moTa: ['The generated add_slug on a table with rows', 'add_slug sinh tự động trên bảng có dữ liệu'] },
    { goi: goi('lintMigration', SLUG_DUNG, { Note: 751000 }), moTa: ['The three-step version is clean', 'Bản ba bước sạch'] },
    { goi: goi('lintMigration', TAG_DUNG, { Note: 751000 }), moTa: ['NOT NULL DEFAULT 1 is safe', 'NOT NULL DEFAULT 1 là an toàn'] },
    { goi: goi('lintMigration', `alter table note add column slug text;\nalter table note alter column slug set not null; -- forgot the backfill\nALTER TABLE "Note" DROP COLUMN "hotfix_col";\nDROP TABLE IF EXISTS "OldTag";\n`, { note: 12 }), an: true },
    { goi: goi('lintMigration', `ALTER TABLE "User" ADD COLUMN "tokenVersion" INTEGER NOT NULL;\nALTER TABLE "User" RENAME COLUMN "name" TO "fullName";\n\n;`, { Note: 5 }), an: true, moTa: ['Empty table: no error for NOT NULL; rename still warned', 'Bảng rỗng: không lỗi NOT NULL; đổi tên vẫn cảnh báo'] },
    { goi: goi('lintMigration', `UPDATE "Note" SET "body" = '', "slug" = 'x';\nALTER TABLE "Note" ALTER COLUMN "slug" SET NOT NULL;\nALTER TABLE "Note" ALTER COLUMN "body" SET NOT NULL;`, { Note: 3 }), an: true },
  ],
  saiMau: [
    lintMigration.toString().replace(" && (rowsIn[table] || 0) > 0) out.push({ statement: n, level: 'error', code: 'NOT_NULL_WITHOUT_DEFAULT'", ") out.push({ statement: n, level: 'error', code: 'NOT_NULL_WITHOUT_DEFAULT'"),
    lintMigration.toString().replace("&& !/DEFAULT/i.test(rest) ", ''),
  ],
});

export default modul('nodejs-7-2-luoc-do-va-migration', '7.2 The schema, and migrations that survive production', [E1, E2, E3, E4, E5]);
