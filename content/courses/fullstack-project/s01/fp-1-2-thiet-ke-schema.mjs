/**
 * 1.2 — Thiết kế mô hình dữ liệu trên giấy (soạn 24/11/2026, agent fsp).
 * Output THẬT: docs/schema-nhap.sql + docs/thu-schema.sql của dự án mẫu ChiaSe chạy trong container postgres:18-alpine
 * (PostgreSQL 18.7, --memory 2g --cpus 2); stderr gộp trong container (2>&1) để đúng thứ tự; đã bỏ tiền tố "psql:/tmp/t.sql:N:".
 */
import { lienKet, spring, esc } from '../_chung.mjs';

const THE = [
  lienKet({ khoa: 'postgresql', bai: 'postgresql-3-1-khoa-chinh', title: 'PostgreSQL 3.1 — Khoá chính: danh tính của một dòng', sub: 'Đào sâu: số tự tăng, identity, UUID — ưu nhược.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'postgresql', bai: 'postgresql-3-3-rang-buoc-cot', title: 'PostgreSQL 3.3 — Ràng buộc cột: NOT NULL, DEFAULT, UNIQUE, CHECK', sub: 'Mọi ràng buộc dùng trong bài này, giải thích từng cái.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'postgresql', bai: 'postgresql-2-4-uuid-enum-array-jsonb', title: 'PostgreSQL 2.4 — UUID, enum, array & jsonb', sub: 'Vì sao trạng thái bài dùng CHECK thay vì enum ở bản nháp.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'postgresql', bai: 'postgresql-lab-1-luoc-do-ct-shop', title: 'PostgreSQL Lab 1 — CT Shop: từ ERD tới lược đồ chạy được', sub: 'Thêm một bài luyện cùng dạng nếu muốn chắc tay.', cta: 'Mở bài →' }),
].join('\n');

const SQL_NHAP = `-- Bản nháp lược đồ ChiaSe — viết TRƯỚC khi có Prisma, để kiểm thiết kế bằng dữ liệu thật.
-- Chạy: psql -f docs/schema-nhap.sql   (PostgreSQL 18: có sẵn hàm uuidv7())

CREATE TABLE users (
  id            uuid PRIMARY KEY DEFAULT uuidv7(),
  email         text        NOT NULL,
  password_hash text        NOT NULL,
  display_name  varchar(50) NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);
-- Email không phân biệt hoa thường: "An@Mail.com" và "an@mail.com" là MỘT người
CREATE UNIQUE INDEX users_email_lower_key ON users (lower(email));

CREATE TABLE posts (
  id         uuid PRIMARY KEY DEFAULT uuidv7(),
  author_id  uuid         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      varchar(120) NOT NULL,
  body       text         NOT NULL,
  image_key  text,                                   -- KHOÁ ảnh trong kho (vd posts/2026/11/x.webp), không lưu URL đầy đủ
  status     text         NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at timestamptz  NOT NULL DEFAULT now()
);
CREATE INDEX posts_feed_idx ON posts (status, created_at DESC, id DESC);

CREATE TABLE comments (
  id         uuid PRIMARY KEY DEFAULT uuidv7(),
  post_id    uuid          NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id  uuid          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body       varchar(1000) NOT NULL,
  created_at timestamptz   NOT NULL DEFAULT now()
);
CREATE INDEX comments_post_idx ON comments (post_id, created_at);

-- Quan hệ n-n: một người thích nhiều bài, một bài được nhiều người thích
CREATE TABLE likes (
  user_id    uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id    uuid        NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, post_id)                     -- thích hai lần = vi phạm khoá chính
);`;

const OUT_THU = `INSERT INTO users (email, password_hash, display_name) VALUES
  ('an@vi-du.local',  'x', 'An'),
  ('binh@vi-du.local','x', 'Bình');
INSERT 0 2
INSERT INTO users (email, password_hash, display_name) VALUES ('AN@vi-du.local', 'x', 'An giả');
ERROR:  duplicate key value violates unique constraint "users_email_lower_key"
DETAIL:  Key (lower(email))=(an@vi-du.local) already exists.
…
INSERT INTO likes (user_id, post_id)
  SELECT u.id, p.id FROM users u, posts p WHERE u.email = 'binh@vi-du.local' AND p.title = 'Bài đầu tiên';
ERROR:  duplicate key value violates unique constraint "likes_pkey"
DETAIL:  Key (user_id, post_id)=(01a20d44-b116-76d0-9700-5fff2999b677, 01a20d44-b119-795a-a6f6-6e3635f24d30) already exists.
INSERT INTO posts (author_id, title, body, status) SELECT id, 'X', 'Y', 'deleted' FROM users LIMIT 1;
ERROR:  new row for relation "posts" violates check constraint "posts_status_check"
DETAIL:  Failing row contains (01a20d44-b12f-7407-b2c9-bdb8518be4bf, 01a20d44-b116-71a9-8600-c01f7b7e81b6, X, Y, null, deleted, 2026-11-24 11:15:35.343057+00).
SELECT p.title, u.display_name AS tac_gia,
       (SELECT count(*) FROM comments c WHERE c.post_id = p.id) AS so_binh_luan,
       (SELECT count(*) FROM likes l WHERE l.post_id = p.id)    AS so_thich
FROM posts p JOIN users u ON u.id = p.author_id
WHERE p.status = 'published' ORDER BY p.created_at DESC, p.id DESC;
    title     | tac_gia | so_binh_luan | so_thich
--------------+---------+--------------+----------
 Bài đầu tiên | An      |            1 |        1
(1 row)

SELECT id, uuid_extract_timestamp(id) AS tao_luc FROM posts ORDER BY id;
                  id                  |          tao_luc
--------------------------------------+----------------------------
 01a20d44-b119-795a-a6f6-6e3635f24d30 | 2026-11-24 11:15:35.321+00
 01a20d44-b120-7efd-89d7-0f49a53e9382 | 2026-11-24 11:15:35.328+00
(2 rows)

DELETE FROM posts WHERE title = 'Bài đầu tiên';
DELETE 1
SELECT (SELECT count(*) FROM comments) AS con_binh_luan, (SELECT count(*) FROM likes) AS con_thich;
 con_binh_luan | con_thich
---------------+-----------
             0 |         0
(1 row)`;

const OUT_ID = `SELECT id, title FROM posts_kieu_cu;      -- bảng dùng bigint IDENTITY
 id | title
----+-------
  1 | a
  2 | b
  3 | c
(3 rows)

SELECT uuidv7() AS v7_1, uuidv7() AS v7_2, gen_random_uuid() AS v4;
                 v7_1                 |                 v7_2                 |                  v4
--------------------------------------+--------------------------------------+--------------------------------------
 01a20d52-9f47-72ca-bf0f-1b92ff7db05a | 01a20d52-9f47-7315-817f-7a1825bfcd18 | 9224346b-5070-4c0e-ae4d-a18ff40db2ab
(1 row)`;

const ERD_EN = `erDiagram
  USERS ||--o{ POSTS : writes
  USERS ||--o{ COMMENTS : writes
  POSTS ||--o{ COMMENTS : has
  USERS ||--o{ LIKES : gives
  POSTS ||--o{ LIKES : receives`;

const ERD_VI = `erDiagram
  USERS ||--o{ POSTS : "viết"
  USERS ||--o{ COMMENTS : "viết"
  POSTS ||--o{ COMMENTS : "có"
  USERS ||--o{ LIKES : "thả"
  POSTS ||--o{ LIKES : "nhận"`;

const LENH = `docker run -d --name chiase-pg-nhap --memory 2g --memory-swap 2g --cpus 2 \\
  -e POSTGRES_PASSWORD=nhap postgres:18-alpine
docker exec -i chiase-pg-nhap psql -U postgres &lt; docs/schema-nhap.sql
docker exec -i chiase-pg-nhap psql -U postgres -e &lt; docs/thu-schema.sql
docker rm -f chiase-pg-nhap        # xong thì dọn`;

export default {
  title: '1.2 — Designing the data model on paper|||1.2 — Thiết kế mô hình dữ liệu trên giấy',
  slug: 'fp-1-2-thiet-ke-schema',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Từ user story ra bảng: danh từ thành bảng, động từ thành quan hệ; 1-n, n-n với bảng nối khoá chính ghép; chọn kiểu (UUIDv7 thay số tăng dần — bài học Parler, timestamptz, lưu khoá ảnh); ràng buộc làm CSDL tự từ chối dữ liệu sai; đặt tên nhất quán — và KIỂM thiết kế bằng SQL chạy thật trên PostgreSQL 18.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Data model</span>
<h2>Design tables from the stories, then prove the design with real SQL — before any ORM</h2>
<p class="lead">The database outlives every screen and every framework you put on top of it. In this lesson you turn ChiaSe's user stories into four tables, draw the diagram, and — the step most tutorials skip — <strong>run the design on a real PostgreSQL</strong> with five tests that must fail or succeed exactly as intended. Prisma arrives in Chapter 2 and will generate the same tables; knowing the SQL first means you will understand what it generates.</p>

<h3>Everyday picture: a school's paper records</h3>
<p>A school keeps one card per student, one card per class, and a register that says which student is in which class. Nobody writes the student's full address on every register line — the register points to the student card. That is a relational database: one table per kind of thing, and links (foreign keys) instead of copies.</p>

<h3>From stories to tables: nouns and verbs</h3>
<ul>
<li><strong>Nouns</strong> that have their own life become tables: user, post, comment.</li>
<li><strong>Verbs</strong> between nouns become relations: a user <em>writes</em> posts (1-n), a post <em>has</em> comments (1-n), a user <em>likes</em> posts (n-n).</li>
<li><strong>Adjectives</strong> become columns: a post is <em>draft</em> or <em>published</em> → <code>status</code>.</li>
</ul>
<pre><code class="language-mermaid">${esc(ERD_EN)}</code></pre>
<p>Read <code>||--o{</code> as "exactly one … to zero or many". A many-to-many relation (users ↔ posts through likes) always needs a <strong>junction table</strong>: <code>likes(user_id, post_id)</code>.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Nouns → tables</span><span class="lz-d">users, posts, comments</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Verbs → relations</span><span class="lz-d">writes (1-n), has (1-n), likes (n-n → junction table)</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Types + constraints</span><span class="lz-d">uuidv7, timestamptz, UNIQUE, CHECK, FK + ON DELETE</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">SQL draft</span><span class="lz-d">docs/schema-nhap.sql</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Five tests</span><span class="lz-d">three refused, two correct results — on a real PostgreSQL</span></div>
</div>
<h3>Decisions, one by one</h3>
<table>
<thead><tr><th>Decision</th><th>Choice</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Primary key type</td><td><code>uuid</code> with <code>uuidv7()</code> (built into PostgreSQL 18)</td><td>Not guessable like 1, 2, 3 (Parler); unlike random UUIDv4 it grows with time, so new rows land at the end of the index</td></tr>
<tr><td>Email uniqueness</td><td><code>UNIQUE INDEX … (lower(email))</code></td><td>"AN@…" and "an@…" are the same person</td></tr>
<tr><td>Time columns</td><td><code>timestamptz</code></td><td>Stores an absolute moment; displayed in each user's time zone</td></tr>
<tr><td>Post status</td><td><code>text</code> + <code>CHECK (status IN (…))</code></td><td>The database itself refuses "deleted" or typos</td></tr>
<tr><td>Image</td><td><code>image_key</code> (e.g. <code>posts/2026/11/x.webp</code>), nullable</td><td>The domain/CDN may change; the key does not</td></tr>
<tr><td>Delete a post</td><td><code>ON DELETE CASCADE</code> on comments and likes</td><td>A real delete, no orphans (Parler kept "deleted" posts)</td></tr>
<tr><td>One like per person</td><td><code>PRIMARY KEY (user_id, post_id)</code></td><td>Enforced by the database, even if two requests race</td></tr>
<tr><td>Feed order</td><td>Index <code>(status, created_at DESC, id DESC)</code></td><td>Matches the feed query exactly; <code>id</code> breaks ties (Chapter 5)</td></tr>
</tbody>
</table>
<p><strong>Naming:</strong> tables plural <code>snake_case</code>, columns <code>snake_case</code>, foreign keys <code>&lt;thing&gt;_id</code>. In TypeScript (Prisma) models will be singular <code>PascalCase</code> with <code>camelCase</code> fields, mapped with <code>@@map</code>/<code>@map</code>. Pick once, never mix.</p>

<h3>The draft, as SQL</h3>
<pre><code class="language-sql">${esc(SQL_NHAP)}</code></pre>

<h3>Prove it: five tests on a real PostgreSQL 18</h3>
<p>Start a throw-away database in Docker, load the draft, run the test script (<code>docs/thu-schema.sql</code> in the repo):</p>
<pre><code class="language-bash">${LENH}</code></pre>
<p>Real output (three expected errors, two expected results):</p>
<div class="out">${esc(OUT_THU)}</div>
<ol>
<li>Same email in different case → refused by <code>users_email_lower_key</code>. ✔</li>
<li>Second like by the same person → refused by <code>likes_pkey</code>. ✔</li>
<li>Status "deleted" → refused by <code>posts_status_check</code>. ✔</li>
<li>Feed query returns only the published post, with 1 comment and 1 like. ✔</li>
<li>Deleting the post removes its comment and like (0 and 0). ✔</li>
</ol>
<p>A design that has passed these five tests in ten minutes will save you hours of "why is there a duplicate like?" in Chapter 7.</p>

<h3>⚠️ Hacker corner: sequential ids, and what UUIDv7 does <em>not</em> fix</h3>
<div class="out">${esc(OUT_ID)}</div>
<ul>
<li>With <code>IDENTITY</code> ids, anyone who sees post 2 knows posts 1 and 3 exist and can script <code>/api/posts/1 … /api/posts/9999999</code> — exactly how Parler was scraped in 2021.</li>
<li>UUIDv7 is not guessable, but notice: <code>uuid_extract_timestamp(id)</code> printed the creation time. <strong>UUIDv7 reveals when a row was created</strong>. Fine for posts (they show a date anyway); think twice for things whose creation time is private.</li>
<li>Most important: an unguessable id is <strong>not</strong> access control. If <code>GET /api/posts/:id</code> returns drafts of other users, the id format does not matter. Every route checks permission (Chapter 4).</li>
</ul>

<h3>Common traps</h3>
<div class="pitfall co-tieu-de"><p><strong>Storing the full image URL.</strong> When you move from MinIO to R2, or add a CDN, every row is wrong. Store the key; build the URL in one function.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Storing comment_count in posts on day one.</strong> It is a cache that must be updated on every insert/delete and can drift. Count first; denormalise only when measured slow (Chapter 5 measures).</p></div>
<div class="pitfall co-tieu-de"><p><strong>A <code>likes</code> table with its own id and no unique pair.</strong> Then two fast clicks create two likes. Let the database say no.</p></div>

${spring(true, 'In Spring Data JPA the same model becomes @Entity classes: @ManyToOne author on Post, @OneToMany comments, and a Like entity with @EmbeddedId for the composite key. The SQL above is what Flyway will run.', [
  ['sb-6-1-entity-repository', 'Spring Boot 6.1 — Entities and repositories'],
  ['sb-6-3-quan-he-jpa', 'Spring Boot 6.3 — Relationships: @ManyToOne, @OneToMany, @ManyToMany'],
  ['sb-8-2-viet-migration', 'Spring Boot 8.2 — Versioned migration scripts (Flyway)'],
])}

<h3>🎤 Interview corner</h3>
<ol>
<li><strong>"How do you model a many-to-many relation?"</strong> — A junction table with two foreign keys; usually a composite primary key on the pair so duplicates are impossible.</li>
<li><strong>"Auto-increment or UUID?"</strong> — Auto-increment: small, fast, but guessable and leaks counts. UUIDv4: random, bad index locality. UUIDv7: time-ordered and unguessable — but reveals creation time. Either way, check permissions.</li>
<li><strong>"What does ON DELETE CASCADE do, and when is it dangerous?"</strong> — Deletes child rows with the parent. Dangerous when the child data has value of its own (orders when deleting a customer) — then use RESTRICT or soft delete with a purge job.</li>
<li><strong>"Why timestamptz instead of timestamp?"</strong> — It stores an absolute instant; timestamp without zone is ambiguous across servers and users in different zones.</li>
</ol>

<h3>🧪 Lab 1.2 (45 min) — your ERD and a draft that passes five tests</h3>
<div class="callout ok">
<ol>
<li>For your topic, list nouns/verbs from your stories; draw the ERD in <code>docs/erd.md</code> (mermaid <code>erDiagram</code>).</li>
<li>Write <code>docs/schema-nhap.sql</code> with types, NOT NULL, UNIQUE, CHECK, foreign keys with an explicit ON DELETE, and one index for your main list query.</li>
<li>Write <code>docs/thu-schema.sql</code> with at least five tests: three that must be <em>refused</em> and two that must return the right data. Run them with the Docker commands above, then remove the container.</li>
</ol>
<p><strong>Rubric (10 pts):</strong> ERD matches stories incl. one n-n (2) · every FK has a deliberate ON DELETE (2) · uniqueness enforced in the DB where a story needs it (2) · five tests, all behaving as expected, output saved (3) · consistent naming (1).</p>
</div>
<details><summary>Solution hints</summary>
<p>ChiaSe's full draft is shown above and lives in <code>docs/schema-nhap.sql</code>. If your "refused" test is accepted, your constraint is missing — not your test. Typical misses: unique email without <code>lower()</code>, a like table without the composite key, a FK without ON DELETE (default is NO ACTION — deleting the parent fails with an error, which may or may not be what you want: decide).</p>
</details>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ERD</span><span class="v">Entity-relationship diagram: tables and how they relate.</span></div>
  <div class="kv"><span class="k">foreign key</span><span class="v">A column that must match a primary key in another table.</span></div>
  <div class="kv"><span class="k">junction table</span><span class="v">The table that implements an n-n relation.</span></div>
  <div class="kv"><span class="k">composite key</span><span class="v">A primary key made of several columns.</span></div>
  <div class="kv"><span class="k">UUIDv7</span><span class="v">A 128-bit id starting with a millisecond timestamp, then random bits.</span></div>
  <div class="kv"><span class="k">CHECK constraint</span><span class="v">A rule every row must satisfy, enforced by the database.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Nouns → tables, verbs → relations, adjectives → columns; n-n needs a junction table.</li>
<li>Let the database refuse bad data: UNIQUE on lower(email), composite PK on likes, CHECK on status, FK with explicit ON DELETE.</li>
<li>Prove the design with a throw-away PostgreSQL and five tests before writing an ORM model.</li>
<li>UUIDv7 stops guessing, reveals creation time, and never replaces permission checks.</li>
</ul>
${THE}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Mô hình dữ liệu</span>
<h2>Thiết kế bảng từ user story, rồi chứng minh thiết kế bằng SQL thật — trước khi có ORM</h2>
<p class="lead">Cơ sở dữ liệu sống lâu hơn mọi màn hình và mọi framework bạn đặt lên nó. Trong bài này bạn biến user story của ChiaSe thành bốn bảng, vẽ sơ đồ, và — bước mà phần lớn tutorial bỏ qua — <strong>chạy thiết kế trên một PostgreSQL thật</strong> với năm phép thử phải hỏng hoặc đúng y như dự tính. Prisma tới ở Chương 2 và sẽ sinh ra đúng các bảng này; biết SQL trước thì bạn hiểu nó sinh ra cái gì.</p>

<h3>Liên tưởng đời thường: hồ sơ giấy của trường học</h3>
<p>Trường giữ mỗi học sinh một tấm thẻ, mỗi lớp một tấm thẻ, và một sổ ghi học sinh nào ở lớp nào. Không ai chép lại địa chỉ đầy đủ của học sinh vào từng dòng sổ — dòng sổ chỉ trỏ tới thẻ học sinh. Đó chính là cơ sở dữ liệu quan hệ: mỗi loại đối tượng một bảng, và liên kết (khoá ngoại) thay vì bản sao.</p>

<h3>Từ story ra bảng: danh từ và động từ</h3>
<ul>
<li><strong>Danh từ</strong> có đời sống riêng thành bảng: người dùng, bài viết, bình luận.</li>
<li><strong>Động từ</strong> giữa các danh từ thành quan hệ: người dùng <em>viết</em> bài (1-n), bài <em>có</em> bình luận (1-n), người dùng <em>thích</em> bài (n-n).</li>
<li><strong>Tính từ</strong> thành cột: bài là <em>nháp</em> hay <em>đã đăng</em> → <code>status</code>.</li>
</ul>
<pre><code class="language-mermaid">${esc(ERD_VI)}</code></pre>
<p>Đọc <code>||--o{</code> là "đúng một … tới không hoặc nhiều". Quan hệ nhiều-nhiều (người dùng ↔ bài qua lượt thích) luôn cần một <strong>bảng nối</strong>: <code>likes(user_id, post_id)</code>.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Danh từ → bảng</span><span class="lz-d">users, posts, comments</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Động từ → quan hệ</span><span class="lz-d">viết (1-n), có (1-n), thích (n-n → bảng nối)</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Kiểu + ràng buộc</span><span class="lz-d">uuidv7, timestamptz, UNIQUE, CHECK, khoá ngoại + ON DELETE</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">SQL nháp</span><span class="lz-d">docs/schema-nhap.sql</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Năm phép thử</span><span class="lz-d">ba bị từ chối, hai ra đúng — trên PostgreSQL thật</span></div>
</div>
<h3>Từng quyết định một</h3>
<table>
<thead><tr><th>Quyết định</th><th>Chọn</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>Kiểu khoá chính</td><td><code>uuid</code> với <code>uuidv7()</code> (có sẵn trong PostgreSQL 18)</td><td>Không đoán được như 1, 2, 3 (Parler); khác UUIDv4 ngẫu nhiên, nó tăng theo thời gian nên dòng mới nằm cuối chỉ mục</td></tr>
<tr><td>Email duy nhất</td><td><code>UNIQUE INDEX … (lower(email))</code></td><td>"AN@…" và "an@…" là cùng một người</td></tr>
<tr><td>Cột thời gian</td><td><code>timestamptz</code></td><td>Lưu một thời điểm tuyệt đối; hiển thị theo múi giờ của từng người</td></tr>
<tr><td>Trạng thái bài</td><td><code>text</code> + <code>CHECK (status IN (…))</code></td><td>Chính CSDL từ chối "deleted" hay gõ nhầm</td></tr>
<tr><td>Ảnh</td><td><code>image_key</code> (vd <code>posts/2026/11/x.webp</code>), cho phép rỗng</td><td>Tên miền/CDN có thể đổi; khoá thì không</td></tr>
<tr><td>Xoá bài</td><td><code>ON DELETE CASCADE</code> ở comments và likes</td><td>Xoá thật, không để dòng mồ côi (Parler giữ bài "đã xoá")</td></tr>
<tr><td>Mỗi người thích một lần</td><td><code>PRIMARY KEY (user_id, post_id)</code></td><td>CSDL ép, kể cả khi hai request tranh nhau</td></tr>
<tr><td>Thứ tự bảng tin</td><td>Chỉ mục <code>(status, created_at DESC, id DESC)</code></td><td>Khớp đúng truy vấn bảng tin; <code>id</code> phân xử khi trùng giờ (Chương 5)</td></tr>
</tbody>
</table>
<p><strong>Đặt tên:</strong> bảng số nhiều <code>snake_case</code>, cột <code>snake_case</code>, khoá ngoại <code>&lt;thứ&gt;_id</code>. Trong TypeScript (Prisma), model là danh từ số ít <code>PascalCase</code>, trường <code>camelCase</code>, ánh xạ bằng <code>@@map</code>/<code>@map</code>. Chọn một lần, không bao giờ trộn.</p>

<h3>Bản nháp, viết bằng SQL</h3>
<pre><code class="language-sql">${esc(SQL_NHAP)}</code></pre>

<h3>Chứng minh: năm phép thử trên PostgreSQL 18 thật</h3>
<p>Dựng một CSDL dùng-một-lần trong Docker, nạp bản nháp, chạy script thử (<code>docs/thu-schema.sql</code> trong repo):</p>
<pre><code class="language-bash">${LENH}</code></pre>
<p>Output thật (ba lỗi mong đợi, hai kết quả mong đợi):</p>
<div class="out">${esc(OUT_THU)}</div>
<ol>
<li>Cùng email khác hoa thường → bị <code>users_email_lower_key</code> từ chối. ✔</li>
<li>Cùng một người thích lần hai → bị <code>likes_pkey</code> từ chối. ✔</li>
<li>Trạng thái "deleted" → bị <code>posts_status_check</code> từ chối. ✔</li>
<li>Truy vấn bảng tin chỉ trả bài đã đăng, kèm 1 bình luận và 1 lượt thích. ✔</li>
<li>Xoá bài kéo theo bình luận và lượt thích của nó (còn 0 và 0). ✔</li>
</ol>
<p>Một thiết kế đã qua năm phép thử này trong mười phút sẽ cứu bạn hàng giờ hỏi "sao lại có lượt thích trùng?" ở Chương 7.</p>

<h3>⚠️ Góc hacker: ID tăng dần, và điều UUIDv7 KHÔNG sửa được</h3>
<div class="out">${esc(OUT_ID)}</div>
<ul>
<li>Với ID kiểu <code>IDENTITY</code>, ai thấy bài số 2 là biết có bài 1 và 3, và viết script gọi <code>/api/posts/1 … /api/posts/9999999</code> — đúng cách Parler bị cào năm 2021.</li>
<li>UUIDv7 không đoán được, nhưng để ý: <code>uuid_extract_timestamp(id)</code> in ra thời điểm tạo. <strong>UUIDv7 để lộ lúc dòng được tạo</strong>. Với bài viết thì không sao (bài vốn hiện ngày đăng); với thứ mà thời điểm tạo là riêng tư thì cân nhắc.</li>
<li>Quan trọng nhất: ID không đoán được <strong>không phải</strong> là kiểm soát truy cập. Nếu <code>GET /api/posts/:id</code> trả cả bản nháp của người khác thì dạng ID chẳng còn ý nghĩa. Route nào cũng phải kiểm quyền (Chương 4).</li>
</ul>

<h3>Bẫy hay gặp</h3>
<div class="pitfall co-tieu-de"><p><strong>Lưu URL ảnh đầy đủ.</strong> Khi chuyển từ MinIO sang R2, hoặc thêm CDN, mọi dòng đều sai. Lưu khoá; dựng URL trong một hàm duy nhất.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Lưu comment_count trong posts ngay ngày đầu.</strong> Đó là một bộ đệm phải cập nhật ở mỗi lần thêm/xoá và có thể lệch. Cứ đếm trước; chỉ "phi chuẩn hoá" khi đã đo thấy chậm (Chương 5 đo).</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bảng <code>likes</code> có id riêng mà không có cặp duy nhất.</strong> Khi đó bấm nhanh hai lần là ra hai lượt thích. Để CSDL nói "không".</p></div>

${spring(false, 'Trong Spring Data JPA, cùng mô hình này thành các lớp @Entity: Post có @ManyToOne author, @OneToMany comments, và một entity Like dùng @EmbeddedId cho khoá ghép. Đoạn SQL ở trên chính là thứ Flyway sẽ chạy.', [
  ['sb-6-1-entity-repository', 'Spring Boot 6.1 — Entity và repository'],
  ['sb-6-3-quan-he-jpa', 'Spring Boot 6.3 — Quan hệ: @ManyToOne, @OneToMany, @ManyToMany'],
  ['sb-8-2-viet-migration', 'Spring Boot 8.2 — Viết migration có đánh số phiên bản (Flyway)'],
])}

<h3>🎤 Góc phỏng vấn</h3>
<ol>
<li><strong>"Mô hình hoá quan hệ nhiều-nhiều thế nào?"</strong> — Một bảng nối có hai khoá ngoại; thường đặt khoá chính ghép trên cặp đó để không thể trùng.</li>
<li><strong>"Số tự tăng hay UUID?"</strong> — Tự tăng: nhỏ, nhanh, nhưng đoán được và lộ số lượng. UUIDv4: ngẫu nhiên, chỉ mục kém liền mạch. UUIDv7: tăng theo thời gian và không đoán được — nhưng lộ thời điểm tạo. Dù chọn gì vẫn phải kiểm quyền.</li>
<li><strong>"ON DELETE CASCADE làm gì, khi nào nguy hiểm?"</strong> — Xoá dòng con theo dòng cha. Nguy hiểm khi dữ liệu con có giá trị riêng (đơn hàng khi xoá khách hàng) — lúc đó dùng RESTRICT, hoặc xoá mềm kèm việc dọn định kỳ.</li>
<li><strong>"Sao dùng timestamptz mà không dùng timestamp?"</strong> — Nó lưu một thời điểm tuyệt đối; timestamp không múi giờ thì mơ hồ khi máy chủ và người dùng ở nhiều múi giờ khác nhau.</li>
</ol>

<h3>🧪 Lab 1.2 (45 phút) — ERD của bạn và bản nháp qua năm phép thử</h3>
<div class="callout ok">
<ol>
<li>Với đề tài của bạn, liệt kê danh từ/động từ từ các story; vẽ ERD trong <code>docs/erd.md</code> (mermaid <code>erDiagram</code>).</li>
<li>Viết <code>docs/schema-nhap.sql</code> có kiểu, NOT NULL, UNIQUE, CHECK, khoá ngoại với ON DELETE ghi rõ, và một chỉ mục cho truy vấn danh sách chính.</li>
<li>Viết <code>docs/thu-schema.sql</code> có ít nhất năm phép thử: ba phép phải bị <em>từ chối</em> và hai phép phải trả đúng dữ liệu. Chạy bằng các lệnh Docker ở trên, rồi xoá container.</li>
</ol>
<p><strong>Thang chấm (10 điểm):</strong> ERD khớp story, có một quan hệ n-n (2) · mọi khoá ngoại có ON DELETE chọn có chủ ý (2) · tính duy nhất do CSDL ép ở chỗ story cần (2) · năm phép thử chạy đúng như dự tính, có lưu output (3) · đặt tên nhất quán (1).</p>
</div>
<details><summary>Gợi ý lời giải</summary>
<p>Bản nháp đầy đủ của ChiaSe ở ngay trên và nằm trong <code>docs/schema-nhap.sql</code>. Nếu phép thử "phải bị từ chối" lại được nhận, thì thiếu ràng buộc — không phải phép thử sai. Hay sót: email duy nhất mà thiếu <code>lower()</code>, bảng thích không có khoá ghép, khoá ngoại không ghi ON DELETE (mặc định là NO ACTION — xoá dòng cha sẽ báo lỗi, có thể đúng hoặc không đúng ý bạn: hãy tự quyết).</p>
</details>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ERD</span><span class="v">Sơ đồ thực thể-quan hệ: các bảng và cách chúng liên kết.</span></div>
  <div class="kv"><span class="k">foreign key (khoá ngoại)</span><span class="v">Cột bắt buộc khớp khoá chính của bảng khác.</span></div>
  <div class="kv"><span class="k">junction table (bảng nối)</span><span class="v">Bảng hiện thực quan hệ n-n.</span></div>
  <div class="kv"><span class="k">composite key (khoá ghép)</span><span class="v">Khoá chính gồm nhiều cột.</span></div>
  <div class="kv"><span class="k">UUIDv7</span><span class="v">ID 128 bit bắt đầu bằng mốc thời gian theo mili giây, sau đó là bit ngẫu nhiên.</span></div>
  <div class="kv"><span class="k">CHECK constraint</span><span class="v">Luật mọi dòng phải thoả, do CSDL ép.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Danh từ → bảng, động từ → quan hệ, tính từ → cột; n-n cần bảng nối.</li>
<li>Để CSDL từ chối dữ liệu sai: UNIQUE trên lower(email), khoá ghép ở likes, CHECK ở status, khoá ngoại có ON DELETE rõ ràng.</li>
<li>Chứng minh thiết kế bằng một PostgreSQL dùng-một-lần và năm phép thử trước khi viết model ORM.</li>
<li>UUIDv7 chặn việc đoán ID, để lộ thời điểm tạo, và không bao giờ thay được việc kiểm quyền.</li>
</ul>
${THE}
</div>
`,
};
