/**
 * PostgreSQL · 16.1 — Prisma và migration. Chạy được trên PGlite: migration "replay được" (bug shadow DB thật của kho mã này:
 * UNIQUE rồi CREATE INDEX trùng tên ⇒ 42P07), và NOT NULL an toàn trên bảng lớn (lock_timeout, backfill, CHECK NOT VALID →
 * VALIDATE → SET NOT NULL). Bảng khoá của từng lệnh DDL đã ĐO bằng pg_locks trên PGlite (PostgreSQL 18) trước khi soạn.
 */
import { mod, pg, cs, q, bang1, sau, chan, ma, CT_SHOP, LUOC_DO_CT_SHOP, pre, tn } from './_chung.mjs';

const POST_MUSIC = `CREATE TABLE post (id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY, title text NOT NULL);
CREATE TABLE post_music (
  id      int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  post_id int NOT NULL REFERENCES post(id),
  track   text NOT NULL);
INSERT INTO post (title) VALUES ('Một'), ('Hai'), ('Ba');
INSERT INTO post_music (post_id, track) VALUES (1, 'lofi'), (2, 'jazz');`;
const LD_PM = { en: `<h4>Tables</h4>${pre(`post (id, title)
post_music (id, post_id → post, track)   -- 2 rows; schema.prisma now says: post_id Int @unique`)}`, vi: `<h4>Bảng</h4>${pre(`post (id, title)
post_music (id, post_id → post, track)   -- 2 dòng; schema.prisma giờ ghi: post_id Int @unique`)}` };
const NOTE_NULL = `${CT_SHOP}
UPDATE orders SET note = NULL WHERE id IN (2, 5, 9);`;

export default mod('postgresql-16-1-prisma-migration', '16.1 Prisma and migrations: the ORM is not a different database', [
  cs({
    t: 'Every Prisma word is SQL you already know', k: 'EASY', p: 6, kn: ['model / @id / @unique / @relation / @@index', '$transaction', 'migrate deploy'], tag: ['prisma', 'migration'], loai: 'table',
    en: '<p>Match each Prisma concept with the PostgreSQL feature it generates.</p>', vi: '<p>Ghép mỗi khái niệm Prisma với tính năng PostgreSQL mà nó sinh ra.</p>',
    bang: [bang1('b1', ['Prisma → PostgreSQL', 'Prisma → PostgreSQL'], [{ ma: 'p', ten: 'Prisma' }, { ma: 's', ten: 'SQL', luaChon: ['CREATE TABLE', 'PRIMARY KEY / UNIQUE + B-tree index', 'FOREIGN KEY … ON DELETE CASCADE', 'composite index (column order matters)', 'BEGIN … COMMIT', 'apply pending migration files in order'] }], [
      { o: { p: 'model Order { … } @@map("orders")' }, a: { s: 'CREATE TABLE' } },
      { o: { p: 'id Int @id · email String @unique' }, a: { s: 'PRIMARY KEY / UNIQUE + B-tree index' } },
      { o: { p: 'customer Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)' }, a: { s: 'FOREIGN KEY … ON DELETE CASCADE' } },
      { o: { p: '@@index([customerId, createdAt])' }, a: { s: 'composite index (column order matters)' } },
      { o: { p: 'prisma.$transaction(async (tx) => { … })' }, a: { s: 'BEGIN … COMMIT' } },
      { o: { p: 'npx prisma migrate deploy' }, a: { s: 'apply pending migration files in order' } },
    ], ['The ORM is a naming layer over chapters 3, 9 and 11. When something misbehaves, read the generated SQL in prisma/migrations/ and EXPLAIN the generated queries.', 'ORM chỉ là một lớp đặt tên phủ lên chương 3, 9 và 11. Khi có gì sai, đọc SQL sinh ra trong prisma/migrations/ và EXPLAIN các truy vấn sinh ra.'])],
    gy: [['Each line has exactly one SQL counterpart.', 'Mỗi dòng có đúng một bản tương ứng SQL.'], ['migrate deploy never generates anything.', 'migrate deploy không bao giờ sinh ra gì.']],
    lhg: [['Thinking @@index order is irrelevant — it is the leading-column rule of chapter 9.', 'Tưởng thứ tự trong @@index không quan trọng — đó là luật cột dẫn đầu của chương 9.'], ['Confusing migrate deploy with migrate dev.', 'Nhầm migrate deploy với migrate dev.']],
    tn: [tn('ORM', 'lớp ánh xạ đối tượng – quan hệ')],
  }),

  cs({
    t: 'Predict the lock a migration takes', k: 'MEDIUM', p: 8, kn: ['ACCESS EXCLUSIVE vs SHARE', 'CREATE INDEX CONCURRENTLY', 'NOT VALID + VALIDATE'], tag: ['migration', 'locks'], loai: 'table',
    en: '<p>Which table lock does each statement take on the table it changes? (Measured with pg_locks inside a transaction.)</p>', vi: '<p>Mỗi lệnh lấy khoá bảng nào trên bảng nó thay đổi? (Đã đo bằng pg_locks trong một giao dịch.)</p>',
    bang: [bang1('b1', ['DDL → lock', 'DDL → khoá'], [{ ma: 'd', ten: 'Statement / Lệnh' }, { ma: 'l', ten: 'Lock / Khoá', luaChon: ['ACCESS EXCLUSIVE', 'SHARE', 'SHARE ROW EXCLUSIVE', 'SHARE UPDATE EXCLUSIVE'] }], [
      { o: { d: "ALTER TABLE orders ADD COLUMN channel text NOT NULL DEFAULT 'web'" }, a: { l: 'ACCESS EXCLUSIVE' } },
      { o: { d: 'CREATE INDEX ON orders (note)' }, a: { l: 'SHARE' } },
      { o: { d: 'CREATE INDEX CONCURRENTLY ON orders (note)' }, a: { l: 'SHARE UPDATE EXCLUSIVE' } },
      { o: { d: 'ALTER TABLE stock_movement ADD CONSTRAINT … FOREIGN KEY (order_id) REFERENCES orders NOT VALID' }, a: { l: 'SHARE ROW EXCLUSIVE' } },
      { o: { d: 'ALTER TABLE stock_movement VALIDATE CONSTRAINT …' }, a: { l: 'SHARE UPDATE EXCLUSIVE' } },
      { o: { d: 'ALTER TABLE orders ALTER COLUMN note SET NOT NULL' }, a: { l: 'ACCESS EXCLUSIVE' } },
    ], ['ACCESS EXCLUSIVE blocks even SELECT — fine for a metadata-only change (ADD COLUMN with a constant default, PostgreSQL 11+), deadly if it scans or rewrites. SHARE blocks writes for the whole index build. SHARE UPDATE EXCLUSIVE lets reads AND writes continue: that is why CONCURRENTLY and VALIDATE are the safe halves of a migration.', 'ACCESS EXCLUSIVE chặn cả SELECT — ổn với thay đổi chỉ siêu dữ liệu (ADD COLUMN có mặc định hằng, PostgreSQL 11+), chết người nếu phải quét hay viết lại. SHARE chặn ghi suốt thời gian dựng chỉ mục. SHARE UPDATE EXCLUSIVE cho đọc LẪN ghi tiếp tục: vì thế CONCURRENTLY và VALIDATE là nửa an toàn của một migration.'])],
    gy: [['Which ones still let INSERT/UPDATE run?', 'Lệnh nào vẫn cho INSERT/UPDATE chạy?'], ['Verify on your server: BEGIN; &lt;DDL&gt;; SELECT mode FROM pg_locks WHERE relation = \'orders\'::regclass; ROLLBACK;', 'Kiểm trên máy bạn: BEGIN; &lt;DDL&gt;; SELECT mode FROM pg_locks WHERE relation = \'orders\'::regclass; ROLLBACK;']],
    lhg: [['Plain CREATE INDEX on a busy table from an ORM migration — writes queue for minutes.', 'CREATE INDEX thường trên bảng bận từ migration của ORM — lệnh ghi xếp hàng nhiều phút.'], ['Forgetting that any ACCESS EXCLUSIVE request waits behind long transactions and blocks everyone queued after it — set lock_timeout.', 'Quên rằng mọi yêu cầu ACCESS EXCLUSIVE phải chờ sau giao dịch dài và chặn mọi người xếp sau nó — hãy đặt lock_timeout.']],
    tn: [tn('lock mode', 'chế độ khoá'), tn('lock_timeout', 'thời hạn chờ khoá')],
  }),

  pg({
    csdl: POST_MUSIC, tenCsdl: 'migration', ld: LD_PM,
    t: 'A migration that can be replayed (the shadow-database bug)', k: 'MEDIUM', p: 10, kn: ['UNIQUE creates an index with the constraint\'s name', '42P07 duplicate relation', 'shadow database replay'], tag: ['migration', 'prisma'],
    en: `<p>This repository has a migration that applied once and can never be replayed on a shadow database:</p>${pre(`ALTER TABLE "post_music" ADD CONSTRAINT "post_music_post_id_key" UNIQUE ("post_id");
CREATE INDEX "post_music_post_id_key" ON "post_music"("post_id");`)}<p>Write the migration for <code>post_id Int @unique</code> the way it should have been: post_id becomes unique, backed by exactly <b>one</b> index named <code>post_music_post_id_key</code>.</p>`,
    vi: `<p>Kho mã này có một migration đã áp dụng một lần và không bao giờ phát lại được trên shadow database:</p>${pre(`ALTER TABLE "post_music" ADD CONSTRAINT "post_music_post_id_key" UNIQUE ("post_id");
CREATE INDEX "post_music_post_id_key" ON "post_music"("post_id");`)}<p>Viết migration cho <code>post_id Int @unique</code> theo đúng cách lẽ ra phải viết: post_id thành duy nhất, có đúng <b>một</b> chỉ mục tên <code>post_music_post_id_key</code> phía sau.</p>`,
    yc: [['Either <code>CREATE UNIQUE INDEX "post_music_post_id_key" ON "post_music"("post_id");</code> (what Prisma generates) or the UNIQUE constraint alone.', 'Hoặc <code>CREATE UNIQUE INDEX "post_music_post_id_key" ON "post_music"("post_id");</code> (thứ Prisma sinh ra), hoặc chỉ ràng buộc UNIQUE.'], ['Run it twice in your head on an empty database: it must succeed.', 'Hình dung chạy nó trên một CSDL trống: nó phải thành công.']],
    giai: `CREATE UNIQUE INDEX "post_music_post_id_key" ON "post_music"("post_id");   -- one statement, one index, replayable`,
    kiem: [
      sau(['Exactly one index on post_id, and it is unique', 'Đúng một chỉ mục trên post_id, và nó là duy nhất'], "SELECT c.relname AS index_name, i.indisunique AS is_unique FROM pg_index i JOIN pg_class c ON c.oid = i.indexrelid WHERE i.indrelid = 'post_music'::regclass AND NOT i.indisprimary ORDER BY 1", { thuTu: true }),
      chan(['A second track for post 1 is refused', 'Bản nhạc thứ hai cho bài 1 bị từ chối'], "INSERT INTO post_music (post_id, track) VALUES (1, 'rock')", '23505'),
      ma(['No second CREATE INDEX with the same name', 'Không có CREATE INDEX thứ hai trùng tên'], '\\bCREATE\\s+INDEX\\b', true),
    ],
    sai: [
      'ALTER TABLE "post_music" ADD CONSTRAINT "post_music_post_id_key" UNIQUE ("post_id"); CREATE INDEX "post_music_post_id_key" ON "post_music"("post_id");',
      'CREATE INDEX "post_music_post_id_key" ON "post_music"("post_id");',
    ],
    gy: [['A UNIQUE constraint builds its own index and gives it the constraint\'s name.', 'Ràng buộc UNIQUE tự dựng chỉ mục và đặt cho nó tên của ràng buộc.'], ['The bug fails every time with 42P07 relation "post_music_post_id_key" already exists.', 'Lỗi xảy ra mọi lần với 42P07 relation "post_music_post_id_key" already exists.']],
    lhg: [['A plain (non-unique) index — the schema says @unique, the database accepts duplicates.', 'Chỉ mục thường (không duy nhất) — lược đồ ghi @unique, CSDL vẫn nhận bản trùng.'], ['"Fixing" the already-applied migration file — its checksum no longer matches _prisma_migrations.', '"Sửa" tệp migration đã áp dụng — checksum không còn khớp _prisma_migrations.']],
    gt: ['<p>The original file was applied on production only because its history row says so; on any fresh database (the shadow DB of migrate dev) it fails with P3006. The fix in a real repository is a NEW migration or a baseline — never editing an applied file. Here you write what the file should have said.</p>', '<p>Tệp gốc chỉ "đã áp dụng" trên production vì dòng lịch sử nói vậy; trên mọi CSDL mới (shadow DB của migrate dev) nó hỏng với P3006. Cách sửa trong kho mã thật là một migration MỚI hoặc một baseline — không bao giờ sửa tệp đã áp dụng. Ở đây bạn viết điều tệp đó lẽ ra phải ghi.</p>'],
    tn: [tn('shadow database', 'CSDL bóng'), tn('replayable', 'phát lại được')],
  }),

  pg({
    csdl: NOTE_NULL, tenCsdl: 'ctshop', ld: LUOC_DO_CT_SHOP,
    t: 'NOT NULL on a big table without a long lock', k: 'HARD', p: 15, kn: ['SET LOCAL lock_timeout', 'backfill', 'CHECK … NOT VALID + VALIDATE', 'SET NOT NULL using a validated CHECK'], tag: ['migration', 'locks', 'ctshop'],
    en: '<p>Make <code>orders.note</code> NOT NULL (empty string for the rows that have none) the way you would on a 50-million-row table: (1) <code>SET LOCAL lock_timeout = \'2s\'</code> so the migration fails fast instead of queueing everyone behind it; (2) backfill the NULLs; (3) add <code>orders_note_not_null CHECK (note IS NOT NULL) NOT VALID</code>, then <code>VALIDATE</code> it (no write-blocking scan); (4) <code>SET NOT NULL</code> — PostgreSQL uses the validated CHECK and skips the scan; (5) drop the now redundant CHECK.</p>',
    vi: '<p>Biến <code>orders.note</code> thành NOT NULL (chuỗi rỗng cho các dòng chưa có) theo cách bạn làm trên bảng 50 triệu dòng: (1) <code>SET LOCAL lock_timeout = \'2s\'</code> để migration hỏng nhanh thay vì bắt mọi người xếp hàng sau nó; (2) điền các NULL; (3) thêm <code>orders_note_not_null CHECK (note IS NOT NULL) NOT VALID</code>, rồi <code>VALIDATE</code> (quét không chặn ghi); (4) <code>SET NOT NULL</code> — PostgreSQL dùng CHECK đã kiểm và bỏ qua việc quét; (5) xoá CHECK giờ đã thừa.</p>',
    yc: [['On production, (2) runs in batches and (3)–(5) are separate short transactions; here they run in one.', 'Trên production, (2) chạy theo lô và (3)–(5) là các giao dịch ngắn riêng; ở đây chúng chạy trong một.'], ['Order matters: SET NOT NULL before the backfill fails with 23502.', 'Thứ tự quan trọng: SET NOT NULL trước khi điền sẽ hỏng với 23502.']],
    giai: `SET LOCAL lock_timeout = '2s';                                     -- fail fast, never queue the site behind us
UPDATE orders SET note = '' WHERE note IS NULL;                     -- backfill (in batches on a big table)
ALTER TABLE orders ADD CONSTRAINT orders_note_not_null CHECK (note IS NOT NULL) NOT VALID;   -- instant
ALTER TABLE orders VALIDATE CONSTRAINT orders_note_not_null;       -- scans, but reads and writes continue
ALTER TABLE orders ALTER COLUMN note SET NOT NULL;                  -- uses the validated CHECK: no scan
ALTER TABLE orders DROP CONSTRAINT orders_note_not_null;`,
    kiem: [
      sau(['note is NOT NULL and the helper CHECK is gone', 'note là NOT NULL và CHECK phụ đã bỏ'], "SELECT a.attnotnull AS not_null, (SELECT count(*) FROM pg_constraint WHERE conrelid = 'orders'::regclass AND conname = 'orders_note_not_null') AS helper_check, (SELECT count(*) FROM orders WHERE note = '') AS backfilled FROM pg_attribute a WHERE a.attrelid = 'orders'::regclass AND a.attname = 'note'"),
      chan(['A NULL note is refused from now on', 'Từ nay note NULL bị từ chối'], 'INSERT INTO orders (customer_id, note) VALUES (1, NULL)', '23502'),
      ma(['Sets lock_timeout first', 'Đặt lock_timeout trước'], 'lock_timeout'),
      ma(['Uses a NOT VALID CHECK', 'Dùng CHECK NOT VALID'], 'NOT\\s+VALID'),
    ],
    sai: [
      "SET LOCAL lock_timeout = '2s'; ALTER TABLE orders ALTER COLUMN note SET NOT NULL; UPDATE orders SET note = '' WHERE note IS NULL;",
      "UPDATE orders SET note = '' WHERE note IS NULL; ALTER TABLE orders ALTER COLUMN note SET NOT NULL;",
      "SET LOCAL lock_timeout = '2s'; UPDATE orders SET note = '' WHERE note IS NULL; ALTER TABLE orders ADD CONSTRAINT orders_note_not_null CHECK (note IS NOT NULL) NOT VALID; ALTER TABLE orders VALIDATE CONSTRAINT orders_note_not_null; ALTER TABLE orders ALTER COLUMN note SET NOT NULL;",
    ],
    gy: [['VALIDATE takes SHARE UPDATE EXCLUSIVE: reads and writes continue during the scan.', 'VALIDATE lấy SHARE UPDATE EXCLUSIVE: đọc và ghi vẫn tiếp tục trong lúc quét.'], ['SET NOT NULL still takes ACCESS EXCLUSIVE, but only for an instant when a valid CHECK proves it.', 'SET NOT NULL vẫn lấy ACCESS EXCLUSIVE, nhưng chỉ trong khoảnh khắc khi một CHECK hợp lệ đã chứng minh điều đó.']],
    lhg: [['SET NOT NULL directly on a big table — ACCESS EXCLUSIVE for the whole scan, the site stops.', 'SET NOT NULL thẳng trên bảng lớn — ACCESS EXCLUSIVE suốt lượt quét, web đứng.'], ['No lock_timeout — the ALTER waits behind one long report and every request queues behind the ALTER.', 'Không lock_timeout — lệnh ALTER chờ sau một báo cáo dài và mọi yêu cầu xếp hàng sau lệnh ALTER.']],
    gt: ['<p>The pattern (expand → backfill → validate → enforce) turns one long exclusive lock into several short or non-blocking steps. The ORM will not write it for you: you edit the generated migration SQL by hand.</p>', '<p>Mẫu này (mở rộng → điền → kiểm → áp đặt) biến một khoá độc quyền dài thành vài bước ngắn hoặc không chặn. ORM không viết nó cho bạn: bạn tự sửa SQL migration được sinh ra.</p>'],
    tn: [tn('backfill', 'điền dữ liệu cũ'), tn('NOT VALID', 'chưa kiểm dữ liệu cũ')],
  }),

  cs({
    t: 'migrate dev, migrate deploy, db push — and a failed deploy', k: 'EASY', p: 6, kn: ['shadow database', 'migrate resolve', 'migrate diff'], tag: ['prisma', 'migration'],
    en: '<p>Lesson 16.1 in four questions.</p>', vi: '<p>Bài 16.1 trong bốn câu.</p>',
    cau: [
      q('q1', ['Which command runs on production during a deploy?', 'Lệnh nào chạy trên production khi deploy?'], ['prisma migrate deploy', 'prisma migrate dev', 'prisma db push', 'prisma migrate reset'], ['deploy applies pending files only: no shadow DB, no generation, no reset.', 'deploy chỉ áp các tệp còn chờ: không shadow DB, không sinh, không reset.']),
      q('q2', ['What is the shadow database used for?', 'Shadow database dùng để làm gì?'], ['migrate dev replays every migration there to detect drift', 'it is a hot standby kept in sync with production', 'it stores old row versions so a migration can roll back', 'it is where prisma db push writes before production'], ['That is why a non-replayable old migration breaks migrate dev forever after.', 'Đó là lý do một migration cũ không phát lại được làm hỏng migrate dev mãi về sau.']),
      q('q3', ['A migration failed halfway on deploy (P3009). What do you do first?', 'Một migration hỏng giữa chừng khi deploy (P3009). Bạn làm gì trước?'], ['read the error and inspect the real schema before deciding anything', 'run prisma migrate resolve --applied', 'run prisma db push to force the schema', 'edit the migration file and redeploy'], ['resolve --applied lies to Prisma about a half-applied change; find out what actually ran first (\\d, migrate diff --from-url).', 'resolve --applied nói dối Prisma về một thay đổi mới áp nửa chừng; hãy tìm xem cái gì đã thật sự chạy trước (\\d, migrate diff --from-url).']),
      q('q4', ['Why is prisma db push dangerous on production?', 'Vì sao prisma db push nguy hiểm trên production?'], ['it changes the schema with no migration file, so the history drifts', 'it is much slower than migrate deploy on big tables', 'it needs a shadow database on the production server', 'it only works with SQLite, not with PostgreSQL'], ['After a push, the database and prisma/migrations disagree — the drift every later deploy trips over.', 'Sau một lần push, CSDL và prisma/migrations lệch nhau — thứ lệch mà mọi lần deploy sau vấp phải.']),
    ],
    gy: [['dev = generate + shadow; deploy = apply only.', 'dev = sinh + shadow; deploy = chỉ áp dụng.'], ['When in doubt, look at the real schema.', 'Khi nghi ngờ, nhìn lược đồ thật.']],
    lhg: [['Auto-resolving a failed migration.', 'Tự động resolve một migration hỏng.'], ['Using db push "just this once" on production.', 'Dùng db push "chỉ lần này" trên production.']],
    tn: [tn('migration history', 'lịch sử migration'), tn('drift', 'độ lệch lược đồ')],
  }),
]);
