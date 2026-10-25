/**
 * pg-16-2 — PostgreSQL · Chapter 16 · Lesson 16.2 "Reading a real production schema" (slide EN, kiểu FU, 26/10/2026, agent c16).
 * Nguồn: content/courses/postgresql/s16-production-capstone.mjs › postgresql-16-2-luoc-do-that.
 * Output = chạy thật (video-bai-giang/src/khung/pg/that/pg-16-2.out.txt + that/c16/r-*):
 *   - đếm tại chỗ prisma/schema.prisma + prisma/migrations của cuongthai.com (26/10/2026) và git log của schema.prisma
 *   - BẢN SAO lược đồ thật dựng từ schema.prisma (prisma migrate diff --from-empty) trên PostgreSQL 16.15 + pgvector 0.8.6 + PostGIS 3.4.3
 *     (container nháp pgc16tmp, ảnh giống production) — KHÔNG có dữ liệu thật; dữ liệu giả để đo: 200 user, 2.000 thư mục, 200.000 ghi chú,
 *     50.000 bài hát, 10.000 mẩu tài liệu vector ngẫu nhiên. Container x86 giả lập trên Apple Silicon ⇒ thời gian chỉ để so tương đối, đọc Buffers.
 * Bổ sung so với web: số đo mới (602 model…), lịch sử lớn dần theo git, khoá ngoại trỏ vào users (241), FK không có chỉ mục (189/873),
 *   bảng FK từ catalog, chỉ mục trùng tiền tố, pgvector + HNSW + lỗi /dev/shm 64 MB, những gì schema.prisma không diễn tả được, songs lệch tên cột.
 */
import { lamDeck, sql, psql, sh, run, tbl, two, box, kw, cards, steps, vsd, c } from './_pg-chung.mjs';
import { mapPic, growthPic, erdFeedPic, chapterMapPic } from './pg-16-hinh.mjs';

const zm = (h, z = 1.2) => `<div style="zoom:${z}">${h}</div>`;
const P = (t) => `<p style="font-size:21px;margin:0">${t}</p>`;
export const deck = { key: 'pg-16-2', code: 'PG 16.2', title: 'Reading a real production schema', sub: 'cuongthai.com: 602 models, measured' };

export const slides = lamDeck({ chuong: 'Chapter 16 — PostgreSQL in production & capstone', bai: '16.2' }, [
  { cover: true, t: 'Reading a real<br>production schema', sub: 'cuongthai.com’s own schema — 602 models, measured ·<br>how to find your way around one you did not write' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The real numbers of the schema behind this site — and how fast they <b>grow</b></li>
<li>Its <b>center of gravity</b>, read from the catalog</li>
<li>A 4-step way into a schema you did not write — applied to the real <b>feed</b> tables</li>
<li>Prisma relations ↔ SQL: back-relations, named relations, named <code class="i">@@unique</code></li>
<li>What the indexes say about reads · FKs with no index · the one stats query that finds missing indexes</li>
<li>pgvector in the real schema, and what <code class="i">schema.prisma</code> <b>cannot</b> say</li>
</ul>` },

  { t: 'Everyday example: a city map, not a phone book', giua: true, body: `
${mapPic()}
${P('Nobody learns a city by reading its street directory from A to Z. You start at one place you know and follow the roads out from it. A schema of 600 tables is the same: start from <b>one feature</b>, follow its foreign keys.')}` },

  { t: 'The numbers, counted today (26 Oct 2026)', giua: true, body: `
${two(tbl(['in the repository', 'measured with', 'count'], [
    ['lines of schema.prisma', '<code class="i">wc -l</code>', '<b>17,382</b>'],
    ['models', '<code class="i">grep -c \'^model \'</code>', '<b>602</b>'],
    ['enums', '<code class="i">grep -c \'^enum \'</code>', '57'],
    ['migrations', '<code class="i">ls -d prisma/migrations/*/</code>', '<b>236</b>'],
    ['@@index · @@unique', '<code class="i">grep -c</code>', '807 · 229'],
    ['@relation', '<code class="i">grep -c</code>', '1,075'],
  ], { cap: 'cuongthai.com repository, 26 Oct 2026', hl: [1, 3] }),
  zm(psql(` bang | chi_muc | khoa_ngoai | enum
------+---------+------------+------
  603 |    1751 |        873 |   57
(1 row)`, { sm: true, title: 'psql — the same schema built in PostgreSQL 16.15', hl: [3] }), 1.15), 'r64')}
${two(box('Two sources, one schema', 'Left: the files in git. Right: the catalog of a database built from <code class="i">schema.prisma</code> — 602 models + PostGIS’s <code class="i">spatial_ref_sys</code> = 603 tables.', 'lam'),
  box('Every row of this page lives there', 'Users, posts, messages, notes, courses, lessons — including the lesson you are reading now.', ''))}` },

  { t: 'A schema is not designed once — it grows', giua: true, body: `
${growthPic()}
${two(box('Measured from git', '<code class="i">git show &lt;commit&gt;:prisma/schema.prisma</code> at the start of each month: 122 → 248 → 278 → 365 → <b>602</b> models in four months; 236 migrations.', 'lam'),
  box('So the mechanism must be migrations', 'Chapter 0 of this course said 248 tables, 95 migrations — true on the day it was written. A schema keeps changing as long as the product does; only an ordered, replayable history keeps every database in step.', 'xanh'))}` },

  { t: 'The center of gravity, read from the catalog', giua: true, body: `
${two(zm(psql(`SELECT confrelid::regclass AS bang_dich,
       count(*) AS so_khoa_ngoai_tro_toi
FROM pg_constraint WHERE contype = 'f'
GROUP BY 1 ORDER BY 2 DESC LIMIT 6;
   bang_dich   | so_khoa_ngoai_tro_toi
---------------+-----------------------
 users         |                   241
 work_projects |                   115
 work_issues   |                    38
 languages     |                    15
 work_spaces   |                    15
 work_classes  |                    13`, { sm: true, title: 'psql 16.15 — ct_replica', hl: [7] }), 1.2),
  `<div>${box('users: 241 foreign keys point at it', 'The <code class="i">User</code> model has 287 fields, 241 of them relation fields. Posts, comments, messages, notes, uploads, sessions… everything ends at a user.', 'lam')}
${box('What that means in practice', 'Almost every interesting query joins <code class="i">users</code>, so its primary key is the hottest index in the database — and any migration that locks <code class="i">users</code> (16.1) blocks nearly everything.', 'bad')}</div>`, 'r46')}` },

  { t: 'Approaching a schema you did not write', to: true, giua: true, body: `
${steps([
    '<b>Don’t read top to bottom.</b> 17,382 lines in file order teach nothing. Start from a <b>feature</b> you can see in the product and find its table.',
    '<b>Follow the foreign keys outward.</b> Two hops cover a feature — the same skill as reading a query plan from the inside out (Ch 10).',
    '<b>Let the indexes tell you how the data is read.</b> 807 <code class="i">@@index</code> = 807 statements about read patterns.',
    '<b>Read migrations for history.</b> The schema shows the present; the migration names say how — and often <b>why</b> — it got here.',
  ])}` },

  { t: 'Steps 1–2 on the real feed tables', giua: true, body: `
${erdFeedPic()}
${P('Feed → <code class="i">social_posts</code> (author → users) → <code class="i">social_comments</code> (post, user, and <b>two</b> links to itself: parent and root) → <code class="i">post_music</code> (one per post) → <code class="i">songs</code>. Five tables, the whole feature.')}` },

  { t: 'Prisma relations ↔ SQL: back-relations and names', giua: true, body: `
${two(sql(`model SocialComment {      // schema.prisma, trimmed
  postId   Int  @map("post_id")
  parentId Int? @map("parent_id")
  rootId   Int? @map("root_id")
  post   SocialPost @relation(fields: [postId],
           references: [id], onDelete: Cascade)
  parent SocialComment? @relation("CommentReplies",
           fields: [parentId], references: [id])
  root   SocialComment? @relation("CommentThread",
           fields: [rootId], references: [id])
  replies  SocialComment[] @relation("CommentReplies")
  inThread SocialComment[] @relation("CommentThread")
}`, { sm: true, lang: 'typescript', hl: [7, 9, 11, 12] }),
  zm(psql(`Foreign-key constraints:
 "social_comments_parent_id_fkey" FOREIGN KEY (parent_id)
   REFERENCES social_comments(id) ON DELETE CASCADE
 "social_comments_post_id_fkey" FOREIGN KEY (post_id)
   REFERENCES social_posts(id) ON DELETE CASCADE
 "social_comments_root_id_fkey" FOREIGN KEY (root_id)
   REFERENCES social_comments(id) ON DELETE CASCADE
 "social_comments_user_id_fkey" FOREIGN KEY (user_id)
   REFERENCES users(id) ON DELETE CASCADE`, { sm: true, title: '\\d social_comments (trimmed: ON UPDATE CASCADE dropped)', hl: [2, 6] }), 1.0))}
${two(box('Back-relation', '<code class="i">replies SocialComment[]</code> creates <b>no column</b>: it is the other end of <code class="i">parent</code>. Every relation needs both ends, or <code class="i">prisma generate</code> fails.', 'lam'),
  box('Named relations', 'Two relations to the <b>same</b> table (parent, root) must carry names — <code class="i">"CommentReplies"</code>, <code class="i">"CommentThread"</code> — so Prisma knows which ends pair up.', ''))}` },

  { t: 'A named @@unique lives in Prisma, not PostgreSQL', giua: true, body: `
${two(sql(`model NoteSubjectShare {          // schema.prisma
  ownerId     Int @map("owner_id")
  recipientId Int @map("recipient_id")
  owner     User @relation("NoteSubjectSharesOwned", …)
  recipient User @relation("NoteSubjectSharesReceived", …)
  @@unique([subjectId, recipientId],
           name: "uk_note_subject_share")
}
// src/services/notesShare.service.ts:287 (real)
const share = await prisma.noteSubjectShare.findUnique({
  where: {
    uk_note_subject_share: { subjectId,
                             recipientId: userId },
  },
});`, { sm: true, lang: 'typescript', hl: [6, 7, 12] }),
  zm(psql(`Indexes:
 "note_subject_shares_pkey" PRIMARY KEY, btree (id)
 "idx_note_subject_share_owner" btree (owner_id)
 "idx_note_subject_share_recipient" btree (recipient_id)
 "note_subject_shares_subject_id_recipient_id_key"
     UNIQUE, btree (subject_id, recipient_id)`, { sm: true, title: '\\d note_subject_shares (replica, trimmed)', hl: [5, 6] }), 1.05))}
${box('Two traps in one model', 'Two relations to <code class="i">User</code> ⇒ both need names. And <code class="i">name:</code> only renames the <b>Prisma</b> key: queries must say <code class="i">uk_note_subject_share</code> (not the default <code class="i">subjectId_recipientId</code>), while the index in PostgreSQL keeps its default name (that is <code class="i">map:</code>’s job).', 'bad')}` },

  { t: 'Step 3: the indexes tell you how data is read', body: `
${two(zm(psql(`Indexes:   -- \\d social_posts (replica)
 "social_posts_pkey" PRIMARY KEY, btree (id)
 "idx_social_posts_author" btree (author_id)
 "idx_social_posts_author_created" btree (author_id, created_at DESC)
 "idx_social_posts_content_trgm" gin (content gin_trgm_ops)
 "idx_social_posts_created" btree (created_at DESC)
 "idx_social_posts_newscat_created" btree (news_category, created_at DESC)
 "idx_social_posts_status_created" btree (status, created_at DESC)
 "idx_social_posts_type_created" btree (type, created_at DESC)
 "idx_social_posts_vidcat_created" btree (video_category_id, created_at DESC)
 "idx_social_posts_vis_status_created" btree (visibility, status, created_at DESC)
 "idx_social_posts_visibility" btree (visibility)`, { sm: true, title: 'psql 16.15 — 11 indexes on one table', hl: [3, 4, 5, 12] }), 0.98),
  `<div>${box('Read them as sentences', '<code class="i">(author_id, created_at DESC)</code> = “newest posts of one author”. <code class="i">(type, created_at DESC)</code> = the feed tabs. <code class="i">gin_trgm_ops</code> = search inside the text (Ch 13).', 'lam')}
${box('Spot a prefix', '<code class="i">idx_social_posts_author</code> is a prefix of <code class="i">…_author_created</code>, <code class="i">…_visibility</code> of <code class="i">…_vis_status_created</code> (Ch 9): usually redundant — every write maintains both. Check <code class="i">idx_scan</code> on production <b>before</b> dropping.', '')}</div>`, 'r64')}` },

  { t: 'Foreign keys with no index (real count)', giua: true, body: `
${two(sql(`SELECT count(*) AS fk_total,
  count(*) FILTER (WHERE NOT EXISTS (
    SELECT 1 FROM pg_index i
    WHERE i.indrelid = fk.conrelid
      AND (i.indkey::int2[])
          [0:cardinality(fk.conkey)-1]
          @> fk.conkey
      AND (i.indkey::int2[])
          [0:cardinality(fk.conkey)-1]
          <@ fk.conkey)) AS fk_no_index
FROM (SELECT conrelid, conkey
      FROM pg_constraint
      WHERE contype = 'f') fk;`, { sm: true }),
  `<div>${zm(psql(` fk_total | fk_no_index
----------+-------------
      873 |         189
(1 row)

-- same test, GROUP BY confrelid:
 tro_toi | count
---------+-------
 users   |    75`, { sm: true, title: 'psql 16.15 — ct_replica (trimmed)', hl: [3, 9] }), 1.15)}
${box('Does it matter? Sometimes', 'PostgreSQL never indexes FK columns for you (Ch 9). It hurts when the <b>parent row is deleted or its key updated</b> (each check scans the child), or when you query/join by that column. A lookup table you never delete from can live without it.', 'lam')}</div>`, 'r46')}
${P('Deleting one user fires <b>75</b> foreign-key checks with no index behind them — each a scan of the child table, like the trigger Lab 5 measured at 74.6 ms before its index and 0.2 ms after.')}` },

  { t: 'Who is being read by Seq Scan? (real)', body: `
${two(zm(psql(`SELECT relname, seq_scan, seq_tup_read, idx_scan, n_live_tup
FROM pg_stat_user_tables ORDER BY seq_scan DESC LIMIT 3;
 relname | seq_scan | seq_tup_read | idx_scan | n_live_tup
---------+----------+--------------+----------+------------
 songs   |      201 |     10050000 |        0 |      50000

-- the page "songs I uploaded":
EXPLAIN (ANALYZE, BUFFERS, COSTS OFF) SELECT id FROM songs
 WHERE uploaded_by_id = 7 ORDER BY created_at DESC LIMIT 20;
   ->  Seq Scan on songs (actual time=0.057..14.440 rows=250 loops=1)
         Filter: (uploaded_by_id = 7)
         Rows Removed by Filter: 49750
         Buffers: shared hit=711`, { sm: true, title: 'psql 16.15 — replica, fake data (50,000 songs, 200 page views)', hl: [5, 10, 13] }), 1.02),
  zm(psql(`CREATE INDEX CONCURRENTLY idx_songs_uploader_created
  ON songs (uploaded_by_id, created_at DESC);
CREATE INDEX

EXPLAIN (ANALYZE, BUFFERS, COSTS OFF) …same query…
 Limit (actual time=0.154..0.185 rows=20 loops=1)
   Buffers: shared hit=22
   ->  Index Scan using idx_songs_uploader_created
         on songs (actual time=0.151..0.180 rows=20)
         Index Cond: (uploaded_by_id = 7)`, { sm: true, title: 'the fix (Ch 9 · Lab 5)', hl: [7, 8] }), 1.02))}
${box('Read the row', '<b>large n_live_tup + high seq_scan + idx_scan 0</b> = a table read front-to-back on every request: a missing index, found without reading a line of app code. Pages read: <b>714 → 22</b>.', 'xanh')}` },

  { t: 'pgvector in the real schema', giua: true, body: `
${two(sql(`model DocumentChunk {         // schema.prisma (real)
  documentType String @map("document_type")
  /// Prisma does not understand vector(N)
  embeddingVec Unsupported("vector(384)")?
                 @map("embedding_vec")
  @@index([documentType, documentId])
}`, { sm: true, lang: 'typescript', hl: [4] }),
  sql(`-- 20260910061546_document_chunks_pgvector (real)
CREATE EXTENSION IF NOT EXISTS vector;
ALTER TABLE document_chunks
  ADD COLUMN IF NOT EXISTS embedding_vec vector(384);
CREATE INDEX IF NOT EXISTS
  idx_document_chunks_embedding_hnsw ON document_chunks
  USING hnsw (embedding_vec vector_cosine_ops);`, { sm: true, hl: [5, 6, 7] }))}
${two(sql(`// src/services/ai.service.ts (real): Prisma can't ⇒ $queryRaw
await prisma.$queryRaw\`
  SELECT content, document_id, document_type
    FROM document_chunks
   WHERE embedding_vec IS NOT NULL
   ORDER BY embedding_vec <=> \${lit}::vector
   LIMIT \${topK}\`;`, { sm: true, lang: 'typescript', hl: [6] }),
  box('What it does', 'A question becomes 384 numbers; <code class="i">&lt;=&gt;</code> is cosine distance; the closest chunks feed the site’s AI assistant (RAG). ' + kw('HNSW', 'graph index for nearest neighbours') + ' The column is <code class="i">Unsupported</code> so Prisma keeps it but never reads it.', 'lam'))}` },

  { t: 'pgvector, run for real — and a Docker surprise', body: `
${two(zm(psql(`-- 10,000 chunks, random vectors (fake data)
EXPLAIN (ANALYZE, COSTS OFF) SELECT id FROM document_chunks
 WHERE embedding_vec IS NOT NULL
 ORDER BY embedding_vec <=> :q LIMIT 5;
   ->  Sort (actual time=7.061..7.063 rows=5 loops=1)
         Sort Key: ((document_chunks.embedding_vec <=> $0))
         ->  Seq Scan on document_chunks (… rows=10000 …)

-- after the HNSW index:
   ->  Index Scan using idx_document_chunks_embedding_hnsw
         on document_chunks (actual time=4.487..4.501 rows=5)
         Order By: (embedding_vec <=> $0)`, { sm: true, title: 'psql 16.15 + pgvector 0.8.6 (trimmed)', hl: [7, 10, 12] }), 0.98),
  zm(psql(`CREATE INDEX idx_document_chunks_embedding_hnsw
  ON document_chunks USING hnsw (embedding_vec vector_cosine_ops);
ERROR:  could not resize shared memory segment
  "/PostgreSQL.2819730712" to 63999360 bytes:
  No space left on device

$ df -h /dev/shm            -- inside the container
shm  64M  3.1M  61M  5% /dev/shm

SET max_parallel_maintenance_workers = 0;
CREATE INDEX idx_document_chunks_embedding_hnsw …;
CREATE INDEX
Time: 20139.980 ms (00:20.140)`, { sm: true, title: 'psql 16.15 — container started with Docker defaults', hl: [3, 5, 8] }), 0.98))}
${box('Two lessons', 'An index changes the plan from “read all, sort” to “walk the graph” — the gap grows with the table. And a <b>parallel</b> index build needs shared memory: Docker gives a container only <b>64 MB of /dev/shm</b> unless the compose file sets <code class="i">shm_size</code>.', 'lam')}` },

  { t: 'What schema.prisma cannot say', giua: true, body: `
${two(zm(sh(`$ npx prisma migrate diff --from-empty \\
    --to-schema-datamodel schema.prisma --script > full.sql
-- full.sql: 16,482 lines · 602 CREATE TABLE · 57 CREATE TYPE
$ psql -v ON_ERROR_STOP=1 -d ct_thu < full.sql
ERROR:  cannot use column reference in DEFAULT expression
LINE 37: ...itle_fold" TEXT DEFAULT lower(translate((COALESCE(title, '':...
                                                              ^`, { sm: true, title: 'terminal — the real schema.prisma, PostgreSQL 16.15', hl: [5] }), 1.0),
  `<div>${cards([
    ['Generated columns', '<code class="i">title_fold</code> is a GENERATED column in the database; Prisma only knows <code class="i">dbgenerated(…)</code> ⇒ its own DDL fails.'],
    ['Special indexes', 'HNSW, expression and partial indexes live in hand-written migrations — a database built from the schema <b>lacks</b> them.'],
    ['Extensions & types', '<code class="i">vector</code>, PostGIS, <code class="i">pg_trgm</code> must exist first (our build stopped at <code class="i">gin_trgm_ops</code>).'],
  ], 1)}</div>`, 'r46')}
${P('So <code class="i">schema.prisma</code> is a good map, not the territory. The territory is the database — ask it with <code class="i">\\d</code>.')}` },

  { t: 'Trap: assuming the data matches the schema', body: `
${two(`<div>${box('Real, on this site (CLAUDE.md, 2026-08-25)', 'Code said <code class="i">/blog/&lt;slug&gt;</code> and <code class="i">/tech-trends/&lt;slug&gt;</code> <b>could not</b> collide: two tables, two endpoints. Production answered 200 on <b>both</b> — a merge had copied rows to the new table without deleting the old. One <code class="i">curl</code> settled it.', 'bad')}
${box('The rule', 'Code tells you what is <b>possible</b>. Only the data tells you what is <b>true</b>. When the question is about state, ask the state.', 'xanh')}</div>`,
  `<div>${sql(`// schema.prisma (real) — no @map on these fields
model Song {
  audioUrl   String  @db.VarChar(700)
  coverImage String? @db.VarChar(700)
  isActive   Boolean @default(true)
  @@map("songs")
}
-- 20260706130000_add_music_and_profile (real)
CREATE TABLE "songs" (
    "audio_url" VARCHAR(700) NOT NULL,
    "cover_image" VARCHAR(700),
    "is_active" BOOLEAN NOT NULL DEFAULT true, …`, { sm: true, lang: 'typescript', hl: [3, 10] })}
${box('Two files, two answers', 'Which column name does production really have? Not something you can settle by reading — only <code class="i">\\d songs</code> on the real database can.', '')}</div>`, 'r46')}` },

  { t: 'Every chapter shows up in one real schema', giua: true, body: `
${chapterMapPic()}
${P('Nothing in 602 models is new: keys, indexes, transactions, JSONB, search, pools. What changes at this size is <b>how you find</b> the part that matters — and that you verify against the database, not the file.')}` },

  { t: 'Exercise: which index carries this lookup?', body: `
${two(`<div>${box('Task', 'Deleting a notes folder cascades to <code class="i">notes WHERE subject_id = …</code>. <code class="i">notes</code> has 9 indexes, all starting with <code class="i">user_id</code>. Which one does the lookup use, how many pages does it read, and what would fix it?', '')}
${box('Hints', '<code class="i">EXPLAIN (ANALYZE, BUFFERS)</code> · Ch 9: a B-tree on <code class="i">(user_id, subject_id, …)</code> can be used for <code class="i">subject_id</code> alone — by reading the whole index.', 'lam')}</div>`,
  zm(psql(`-- before (200,000 fake notes)
 Bitmap Heap Scan on notes (actual time=3.824..5.033 rows=100)
   Buffers: shared hit=340
   ->  Bitmap Index Scan on idx_notes_user_tree
         Index Cond: (subject_id = 500)
         Buffers: shared hit=240
CREATE INDEX CONCURRENTLY idx_notes_subject ON notes (subject_id);
-- after
 Bitmap Heap Scan on notes (actual time=0.034..0.186 rows=100)
   Buffers: shared hit=102
   ->  Bitmap Index Scan on idx_notes_subject
         Buffers: shared hit=2`, { sm: true, title: 'psql 16.15 — replica (trimmed)', hl: [4, 6, 12] }), 1.0), 'r46')}
${P('No Seq Scan anywhere — and still <b>240 index pages for 100 rows</b>. Not every missing index shows up as <code class="i">seq_scan</code>; <code class="i">BUFFERS</code> tells the truth.')}` },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>You must fix a bug in a feature of a 600-table schema you have never seen. What are your first two moves?</li>
<li>A table: n_live_tup 50,000 · seq_scan 201 · idx_scan 0. What is it telling you, and what do you check next?</li>
<li>Name two things a database built from <code class="i">schema.prisma</code> alone would lack.</li>
</ol>
${box('Answers', '① find the feature’s table, follow its FKs out (2 hops) · ② read front-to-back on every request ⇒ find the query (pg_stat_statements / EXPLAIN), add the index CONCURRENTLY · ③ any two: HNSW / expression / partial indexes, generated columns, extensions such as vector or pg_trgm.', 'xanh')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>cuongthai.com today: 602 models, 236 migrations — 365 → 602 models in October alone</li>
<li><code class="i">users</code> is the center: 241 FKs point at it — its locks and its index matter most</li>
<li>Enter by a feature, follow FKs; read indexes as sentences; read migrations for history</li>
<li><code class="i">pg_stat_user_tables</code> + <code class="i">BUFFERS</code> find missing indexes without reading app code</li>
<li>schema.prisma is the map; the database is the territory — ask it</li>
</ul>
${box('Next — 16.3', 'The production checklist: every chapter as something you can verify in an afternoon — with the incidents this site really had.', 'lam')}` },
]);
