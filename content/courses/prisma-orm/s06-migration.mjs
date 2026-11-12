/**
 * Prisma ORM — Chương 6: Migration.
 * Migration là gì thật sự · shadow database · viết tay SQL · trôi dạt · đưa lên production · quiz.
 * Output CHẠY THẬT Prisma 6.x + PostgreSQL 16 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
import G06_1 from './giang/pr-06-1.mjs';
import G06_2 from './giang/pr-06-2.mjs';
import G06_3 from './giang/pr-06-3.mjs';
import G06_4 from './giang/pr-06-4.mjs';
import G06_5 from './giang/pr-06-5.mjs';
const REF = '?ref=%2Fcourses%2Fprisma-orm%2Flearn&reflabel=Prisma';

export default {
  title: 'Chapter 6 — Migrations|||Chương 6 — Migration',
  description: 'Migration thật sự là gì dưới lớp vỏ: bảng _prisma_migrations và checksum, shadow database và vì sao migrate dev cần nó, viết SQL tay khi shadow database không chạy được, phát hiện và xử lý trôi dạt, mẫu nới–thu để đổi lược đồ không có thời gian chết, và giao thức khi một migration chết giữa chừng trên production.',
  lessons: [
    /* ─────────────────────────── 6.1 ─────────────────────────── */
    {
      title: '6.1 — What a migration actually is|||6.1 — Migration thật sự là gì',
      slug: 'pr-6-1-migration-la-gi',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Mở bảng _prisma_migrations ra xem từng cột, checksum bảo vệ điều gì, tên thư mục có ý nghĩa gì, ba trạng thái một migration có thể ở, và vì sao sửa một tệp đã áp dụng làm chết mọi lần deploy sau đó.',
      content: `
${G06_1}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>What a migration actually is</h2>
<p class="lead">A Prisma migration is two things: a folder containing plain SQL, and a row in a table recording that the folder ran. That is the entire mechanism. Everything confusing about migrations — drift, <code>P3009</code>, checksum failures, the deploy that will not proceed — becomes obvious once you have looked at both halves.</p>

<h3>Half one: the folder</h3>
<pre><code class="language-bash">ls -R prisma/migrations</code></pre>
<div class="out">-- demo project, three runs of migrate dev — 12 Nov 2026, Prisma 6.19.3, PostgreSQL 16.14
20261112000114_khoi_tao
20261112000116_them_post
20261112000118_them_slug
migration_lock.toml
prisma/migrations/20261112000114_khoi_tao:
migration.sql
prisma/migrations/20261112000116_them_post:
migration.sql
prisma/migrations/20261112000118_them_slug:
migration.sql</div>
<div class="kv-grid">
  <div class="kv"><span class="k">The folder name is the identity</span><span class="v"><code>&lt;timestamp&gt;_&lt;name&gt;</code>. The timestamp gives the ordering — migrations run in lexicographic order, which for this format is chronological. The name is for humans and appears in every log line.</span></div>
  <div class="kv"><span class="k">Each folder holds exactly one <code>migration.sql</code></span><span class="v">Plain SQL, no Prisma syntax. Reviewable in a pull request, runnable in <code>psql</code>, and editable — <em>before</em> it has been applied anywhere.</span></div>
  <div class="kv"><span class="k"><code>migration_lock.toml</code></span><span class="v">Records the provider the migrations were written for. Switching provider makes it error rather than silently generating MySQL SQL against PostgreSQL. Commit it; never edit it.</span></div>
  <div class="kv"><span class="k">All of it is committed</span><span class="v">Migrations are source code. They are reviewed, they are versioned, and their history is how a new developer builds a database that matches production.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># a file from the CuongThai repository, verbatim</span>
cat prisma/migrations/20260623_add_dev_post_video_url/migration.sql</code></pre>
<div class="out">-- Add optional video_url column to dev_posts for custom video player support
ALTER TABLE "dev_posts" ADD COLUMN "video_url" VARCHAR(555);</div>

<h3>Half two: the table</h3>
<pre><code class="language-bash">psql -c "\\d _prisma_migrations"</code></pre>
<div class="out">                        Table "public._prisma_migrations"
       Column        |           Type           | Collation | Nullable | Default 
---------------------+--------------------------+-----------+----------+---------
 id                  | character varying(36)    |           | not null | 
 checksum            | character varying(64)    |           | not null | 
 finished_at         | timestamp with time zone |           |          | 
 migration_name      | character varying(255)   |           | not null | 
 logs                | text                     |           |          | 
 rolled_back_at      | timestamp with time zone |           |          | 
 started_at          | timestamp with time zone |           | not null | now()
 applied_steps_count | integer                  |           | not null | 0
Indexes:
    "_prisma_migrations_pkey" PRIMARY KEY, btree (id)</div>
<pre><code class="language-sql">SELECT migration_name, started_at, finished_at, rolled_back_at, applied_steps_count
FROM _prisma_migrations ORDER BY started_at DESC;</code></pre>
<div class="out">      migration_name      |          started_at           |          finished_at          | rolled_back_at | applied_steps_count 
--------------------------+-------------------------------+-------------------------------+----------------+---------------------
 20261112000118_them_slug | 2026-11-12 00:01:18.976974+00 | 2026-11-12 00:01:18.981361+00 |                |                   1
 20261112000116_them_post | 2026-11-12 00:01:16.788854+00 | 2026-11-12 00:01:16.803127+00 |                |                   1
 20261112000114_khoi_tao  | 2026-11-12 00:01:14.808962+00 | 2026-11-12 00:01:14.817628+00 |                |                   1
(3 rows)</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname"><code>migration_name</code></span><span class="lz-lnote">The folder name. This is how Prisma decides which migrations are pending: everything on disk that is not in this column, in order.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>checksum</code></span><span class="lz-lnote">A SHA-256 of the <code>migration.sql</code> contents at the moment it ran. <code>migrate dev</code> re-hashes every applied file and compares; a mismatch means the file changed after it was applied. <code>migrate deploy</code> and <code>migrate status</code> do <em>not</em> — see below, run for real.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>finished_at</code></span><span class="lz-lnote">Set when every statement succeeded. <code>NULL</code> with a <code>started_at</code> means the migration <strong>failed part-way</strong>, and that is the state behind <code>P3009</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>rolled_back_at</code></span><span class="lz-lnote">Set by <code>migrate resolve --rolled-back</code>. It marks a failed migration as "we cleaned this up by hand", which lets deploys continue. Never set it without actually cleaning up.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>applied_steps_count</code></span><span class="lz-lnote">Despite the name, on PostgreSQL this counts the <em>file</em>, not the statements: Prisma sends the whole <code>migration.sql</code> at once, so a two-statement migration shows 1 when it succeeds and 0 when it fails (and then nothing from it remains). To know what a failure left behind, look at the database itself — Lesson 6.5.</span></div>
</div>

<h3>The three states a migration can be in</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Pending</span><span class="lz-t">On disk, no row</span><span class="lz-d">The normal state for a migration you just wrote. <code>migrate deploy</code> will apply it.</span></div>
  <div class="lz-step"><span class="lz-k">Applied</span><span class="lz-t">Row with <code>finished_at</code></span><span class="lz-d">Done. Prisma will never run it again, and <code>migrate dev</code> will compare its checksum from now on.</span></div>
  <div class="lz-step"><span class="lz-k">Failed</span><span class="lz-t">Row, no <code>finished_at</code>, no <code>rolled_back_at</code></span><span class="lz-d">It started and did not finish. <strong>Every subsequent <code>migrate deploy</code> refuses to run</strong> with <code>P3009</code> until a human resolves it. Lesson 6.5 is the protocol.</span></div>
  <div class="lz-step"><span class="lz-k">Resolved</span><span class="lz-t">Row with <code>rolled_back_at</code></span><span class="lz-d">A failed migration a human marked as cleaned up. Deploys continue past it, and Prisma will retry it if the folder is still there.</span></div>
</div>
<pre><code class="language-bash">npx prisma migrate dev --create-only --name them_chi_muc
npx prisma migrate status</code></pre>
<div class="out">Prisma Migrate created the following migration without applying it 20261112000121_them_chi_muc
You can now edit it and apply it by running prisma migrate dev.
4 migrations found in prisma/migrations
Following migration have not yet been applied:
20261112000121_them_chi_muc
To apply migrations in development run prisma migrate dev.
To apply migrations in production run prisma migrate deploy.
[exit 1]</div>
<p><code>migrate status</code> is read-only and safe on any database, including production. Note its exit code: <strong>1 while anything is pending or failed</strong>, 0 only when everything is applied — a deploy script has to account for that (Lesson 6.5). And note what it does not check: drift (Lesson 6.4) and edited files (below).</p>

<h3>The checksum, and why you must not edit an applied migration</h3>
<pre><code class="language-bash"><span class="tok-comment"># Append one comment line to a migration that has already run, then try each command</span>
echo "-- them mot dong chu thich" &gt;&gt; prisma/migrations/20261112000114_khoi_tao/migration.sql
npx prisma migrate status
npx prisma migrate deploy
npx prisma migrate dev --name thu</code></pre>
<div class="out">$ npx prisma migrate status
4 migrations found in prisma/migrations
Following migration have not yet been applied:
20261112000121_them_chi_muc
To apply migrations in development run prisma migrate dev.
To apply migrations in production run prisma migrate deploy.
[exit 1]
$ npx prisma migrate deploy
4 migrations found in prisma/migrations
Applying migration &#96;20261112000121_them_chi_muc&#96;
All migrations have been successfully applied.
$ npx prisma migrate dev --name thu
The migration &#96;20261112000114_khoi_tao&#96; was modified after it was applied.
We need to reset the "public" schema at "127.0.0.1:55491"
You may use prisma migrate reset to drop the development database.
All data will be lost.
[exit 130]</div>
<div class="pitfall">
<p><strong>Trap — editing an applied migration does not stop your deploys; it splits your history.</strong> <code>status</code> and <code>deploy</code> never re-check applied files, so production carries on green with the <em>old</em> SQL, while any database built from the repository from now on — CI, a new developer, a restore — runs the <em>edited</em> one. The only command that notices is <code>migrate dev</code>, and it responds by asking every developer to wipe their database. Restoring the file byte for byte makes it quiet again (tested); editing the stored checksum by hand would be a lie you tell the tooling.</p>
<p>This is why the CuongThai repository lists "never delete or edit files in <code>prisma/migrations/</code> that have already been deployed" among its forbidden actions.</p>
</div>
<div class="callout ok">
<p><strong>The correct move is always a new migration.</strong> A migration that turned out to be wrong is not edited; it is superseded. Write a second one that corrects it, review both, and the history stays an honest record of what actually happened to the database — which is exactly what you will want when you are reading it at three in the morning.</p>
</div>

<h3>What a migration is not</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Not reversible</span><span class="v">There is no <code>down</code> migration in Prisma, by design. Rolling back means writing a new forward migration that undoes the change — and thinking about the data, which an automatic <code>down</code> cannot do.</span></div>
  <div class="kv"><span class="k">Not transactional across statements, on every provider</span><span class="v">PostgreSQL runs each migration file in a transaction, so a failure rolls the whole file back — mostly. Statements like <code>CREATE INDEX CONCURRENTLY</code> cannot run inside one (Lesson 6.3), and MySQL has no transactional DDL at all — there a failure can leave part of a file applied.</span></div>
  <div class="kv"><span class="k">Not a data migration tool</span><span class="v">You <em>can</em> put <code>UPDATE</code> statements in a migration, and for a small backfill you should. For millions of rows, a migration that runs inside a deploy is the wrong place — it holds locks and blocks the release. Lesson 6.5 covers the split.</span></div>
  <div class="kv"><span class="k">Not aware of your application</span><span class="v">A migration that drops a column succeeds even though the running code still selects it. The old version keeps running for the length of your deploy, and it breaks. That ordering problem is the whole of the expand–contract pattern.</span></div>
</div>

<h3>Reading a real migration history</h3>
<pre><code class="language-bash"><span class="tok-comment"># The CuongThai repository, measured</span>
ls prisma/migrations | grep -vc migration_lock
ls prisma/migrations | head -6
cat prisma/migrations/*/migration.sql | wc -l</code></pre>
<div class="out">-- 12 Nov 2026
247
0_init
20260622_add_message_reply_support
20260622_add_performance_indexes
20260623_add_dev_post_video_url
20260623_fix_dashboard_celebration_unique
20260623_gin_social_posts_content_trgm
17821</div>
<p>Two hundred and forty-seven migrations, and nearly eighteen thousand lines of SQL that <em>is the definitive record</em> of how this database came to look the way it does. Notice <code>0_init</code> at the top: a baseline migration, created when Prisma was adopted into a database that already existed. Lesson 6.4 shows how to make one.</p>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/mental-model" target="_blank" rel="noopener"><span class="lc-ico">🧠</span><span class="lc-body"><span class="lc-title">Prisma Migrate — mental model</span><span class="lc-sub">prisma.io/docs · The best page in the entire documentation. Read it once, properly</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/migration-histories" target="_blank" rel="noopener"><span class="lc-ico">📜</span><span class="lc-body"><span class="lc-title">Migration histories</span><span class="lc-sub">prisma.io/docs · The <code>_prisma_migrations</code> table, checksums, and the rules about editing</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/error-reference#prisma-migrate" target="_blank" rel="noopener"><span class="lc-ico">🚨</span><span class="lc-body"><span class="lc-title">Migrate error codes — P3000 to P3021</span><span class="lc-sub">prisma.io/docs · What each code means; the table Chapter 12 turns into a cookbook</span></span></a>
<a class="link-card" href="/courses/git/learn${REF}"><span class="lc-ico">🌿</span><span class="lc-body"><span class="lc-title">CuongThai course — Git &amp; GitHub</span><span class="lc-sub">Migrations are source code: reviewing them in a pull request, and resolving conflicts between two branches that both added one</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Read a broken <code>_prisma_migrations</code> table and say exactly what happened to each row</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Migration thật sự là gì</h2>
<p class="lead">Một migration của Prisma là hai thứ: một thư mục chứa SQL thuần, và một hàng trong một cái bảng ghi lại rằng thư mục đó đã chạy. Đó là toàn bộ cơ chế. Mọi thứ khó hiểu về migration — trôi dạt, <code>P3009</code>, lỗi checksum, cái deploy không chịu đi tiếp — đều trở nên hiển nhiên một khi bạn đã nhìn vào cả hai nửa.</p>

<h3>Nửa thứ nhất: thư mục</h3>
<pre><code class="language-bash">ls -R prisma/migrations</code></pre>
<div class="out">-- dự án demo, ba lần migrate dev — 12/11/2026, Prisma 6.19.3, PostgreSQL 16.14
20261112000114_khoi_tao
20261112000116_them_post
20261112000118_them_slug
migration_lock.toml
prisma/migrations/20261112000114_khoi_tao:
migration.sql
prisma/migrations/20261112000116_them_post:
migration.sql
prisma/migrations/20261112000118_them_slug:
migration.sql</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Tên thư mục là danh tính</span><span class="v"><code>&lt;mốc thời gian&gt;_&lt;tên&gt;</code>. Mốc thời gian cho ra thứ tự — migration chạy theo thứ tự từ điển, mà với định dạng này thì thứ tự đó là theo thời gian. Cái tên dành cho người đọc và xuất hiện ở mọi dòng log.</span></div>
  <div class="kv"><span class="k">Mỗi thư mục có đúng một <code>migration.sql</code></span><span class="v">SQL thuần, không cú pháp Prisma nào. Review được trong pull request, chạy được trong <code>psql</code>, và sửa được — <em>trước khi</em> nó được áp dụng ở bất cứ đâu.</span></div>
  <div class="kv"><span class="k"><code>migration_lock.toml</code></span><span class="v">Ghi lại provider mà các migration được viết cho. Đổi provider thì nó báo lỗi thay vì âm thầm sinh SQL của MySQL cho PostgreSQL. Hãy commit nó; đừng bao giờ sửa nó.</span></div>
  <div class="kv"><span class="k">Tất cả đều được commit</span><span class="v">Migration là mã nguồn. Chúng được review, được đánh phiên bản, và lịch sử của chúng là cách một lập trình viên mới dựng ra một cơ sở dữ liệu khớp với production.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># một tệp trong kho CuongThai, nguyên văn</span>
cat prisma/migrations/20260623_add_dev_post_video_url/migration.sql</code></pre>
<div class="out">-- Add optional video_url column to dev_posts for custom video player support
ALTER TABLE "dev_posts" ADD COLUMN "video_url" VARCHAR(555);</div>

<h3>Nửa thứ hai: cái bảng</h3>
<pre><code class="language-bash">psql -c "\\d _prisma_migrations"</code></pre>
<div class="out">                        Table "public._prisma_migrations"
       Column        |           Type           | Collation | Nullable | Default 
---------------------+--------------------------+-----------+----------+---------
 id                  | character varying(36)    |           | not null | 
 checksum            | character varying(64)    |           | not null | 
 finished_at         | timestamp with time zone |           |          | 
 migration_name      | character varying(255)   |           | not null | 
 logs                | text                     |           |          | 
 rolled_back_at      | timestamp with time zone |           |          | 
 started_at          | timestamp with time zone |           | not null | now()
 applied_steps_count | integer                  |           | not null | 0
Indexes:
    "_prisma_migrations_pkey" PRIMARY KEY, btree (id)</div>
<pre><code class="language-sql">SELECT migration_name, started_at, finished_at, rolled_back_at, applied_steps_count
FROM _prisma_migrations ORDER BY started_at DESC;</code></pre>
<div class="out">      migration_name      |          started_at           |          finished_at          | rolled_back_at | applied_steps_count 
--------------------------+-------------------------------+-------------------------------+----------------+---------------------
 20261112000118_them_slug | 2026-11-12 00:01:18.976974+00 | 2026-11-12 00:01:18.981361+00 |                |                   1
 20261112000116_them_post | 2026-11-12 00:01:16.788854+00 | 2026-11-12 00:01:16.803127+00 |                |                   1
 20261112000114_khoi_tao  | 2026-11-12 00:01:14.808962+00 | 2026-11-12 00:01:14.817628+00 |                |                   1
(3 rows)</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname"><code>migration_name</code></span><span class="lz-lnote">Tên thư mục. Đây là cách Prisma quyết định migration nào còn chờ: mọi thứ có trên đĩa mà không có trong cột này, theo thứ tự.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>checksum</code></span><span class="lz-lnote">Một mã băm SHA-256 của nội dung <code>migration.sql</code> tại thời điểm nó chạy. <code>migrate dev</code> băm lại mọi tệp đã áp dụng và so sánh; lệch nghĩa là tệp đã đổi sau khi được áp dụng. <code>migrate deploy</code> và <code>migrate status</code> thì <em>không</em> — xem bên dưới, chạy thật.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>finished_at</code></span><span class="lz-lnote">Được đặt khi mọi câu lệnh đều thành công. <code>NULL</code> mà có <code>started_at</code> nghĩa là migration đã <strong>hỏng giữa chừng</strong>, và đó chính là trạng thái đứng sau <code>P3009</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>rolled_back_at</code></span><span class="lz-lnote">Do <code>migrate resolve --rolled-back</code> đặt. Nó đánh dấu một migration hỏng là "chúng tôi đã dọn tay chỗ này", để các lần deploy đi tiếp được. Đừng bao giờ đặt nó mà không thật sự dọn.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>applied_steps_count</code></span><span class="lz-lnote">Tên gọi vậy, nhưng trên PostgreSQL nó đếm <em>tệp</em> chứ không đếm câu lệnh: Prisma gửi cả <code>migration.sql</code> một lần, nên một migration hai câu hiện 1 khi thành công và 0 khi hỏng (lúc đó không còn gì của nó sót lại). Muốn biết một lần hỏng để lại gì thì nhìn thẳng vào cơ sở dữ liệu — Bài 6.5.</span></div>
</div>

<h3>Ba trạng thái một migration có thể ở</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Đang chờ</span><span class="lz-t">Có trên đĩa, không có hàng</span><span class="lz-d">Trạng thái bình thường của một migration bạn vừa viết. <code>migrate deploy</code> sẽ áp dụng nó.</span></div>
  <div class="lz-step"><span class="lz-k">Đã áp dụng</span><span class="lz-t">Có hàng kèm <code>finished_at</code></span><span class="lz-d">Xong. Prisma sẽ không bao giờ chạy lại nó, và từ giờ <code>migrate dev</code> sẽ so checksum của nó.</span></div>
  <div class="lz-step"><span class="lz-k">Hỏng</span><span class="lz-t">Có hàng, không <code>finished_at</code>, không <code>rolled_back_at</code></span><span class="lz-d">Nó đã bắt đầu và chưa xong. <strong>Mọi lần <code>migrate deploy</code> sau đó đều từ chối chạy</strong> với <code>P3009</code> cho tới khi có người xử lý. Bài 6.5 là giao thức xử lý.</span></div>
  <div class="lz-step"><span class="lz-k">Đã xử lý</span><span class="lz-t">Có hàng kèm <code>rolled_back_at</code></span><span class="lz-d">Một migration hỏng mà con người đã đánh dấu là đã dọn xong. Các lần deploy đi tiếp qua nó, và Prisma sẽ thử lại nó nếu thư mục vẫn còn đó.</span></div>
</div>
<pre><code class="language-bash">npx prisma migrate dev --create-only --name them_chi_muc
npx prisma migrate status</code></pre>
<div class="out">Prisma Migrate created the following migration without applying it 20261112000121_them_chi_muc
You can now edit it and apply it by running prisma migrate dev.
4 migrations found in prisma/migrations
Following migration have not yet been applied:
20261112000121_them_chi_muc
To apply migrations in development run prisma migrate dev.
To apply migrations in production run prisma migrate deploy.
[exit 1]</div>
<p><code>migrate status</code> chỉ đọc và an toàn trên mọi cơ sở dữ liệu, kể cả production. Để ý mã thoát của nó: <strong>1 khi còn thứ gì đang chờ hoặc đang hỏng</strong>, 0 chỉ khi mọi thứ đã áp dụng — script deploy phải tính tới điều đó (Bài 6.5). Và để ý thứ nó không kiểm: trôi dạt (Bài 6.4) và tệp bị sửa (ngay dưới).</p>

<h3>Checksum, và vì sao bạn không được sửa một migration đã áp dụng</h3>
<pre><code class="language-bash"><span class="tok-comment"># Thêm một dòng chú thích vào một migration vốn đã chạy, rồi thử từng câu lệnh</span>
echo "-- them mot dong chu thich" &gt;&gt; prisma/migrations/20261112000114_khoi_tao/migration.sql
npx prisma migrate status
npx prisma migrate deploy
npx prisma migrate dev --name thu</code></pre>
<div class="out">$ npx prisma migrate status
4 migrations found in prisma/migrations
Following migration have not yet been applied:
20261112000121_them_chi_muc
To apply migrations in development run prisma migrate dev.
To apply migrations in production run prisma migrate deploy.
[exit 1]
$ npx prisma migrate deploy
4 migrations found in prisma/migrations
Applying migration &#96;20261112000121_them_chi_muc&#96;
All migrations have been successfully applied.
$ npx prisma migrate dev --name thu
The migration &#96;20261112000114_khoi_tao&#96; was modified after it was applied.
We need to reset the "public" schema at "127.0.0.1:55491"
You may use prisma migrate reset to drop the development database.
All data will be lost.
[exit 130]</div>
<div class="pitfall">
<p><strong>Bẫy — sửa một migration đã áp dụng không chặn deploy; nó tách lịch sử của bạn làm đôi.</strong> <code>status</code> và <code>deploy</code> không bao giờ kiểm lại tệp đã áp dụng, nên production vẫn xanh với SQL <em>cũ</em>, còn mọi cơ sở dữ liệu dựng từ kho mã từ giờ — CI, lập trình viên mới, một lần phục hồi — sẽ chạy bản <em>đã sửa</em>. Câu lệnh duy nhất nhận ra là <code>migrate dev</code>, và nó đáp lại bằng cách đòi mọi lập trình viên xoá cơ sở dữ liệu của họ. Trả tệp về đúng từng byte thì mọi thứ yên trở lại (đã thử); sửa checksum đã lưu bằng tay thì là nói dối với bộ công cụ.</p>
<p>Vì thế kho mã CuongThai liệt kê "không bao giờ xoá hay sửa các tệp trong <code>prisma/migrations/</code> đã được deploy" vào nhóm hành động bị cấm.</p>
</div>
<div class="callout ok">
<p><strong>Nước đi đúng luôn luôn là một migration mới.</strong> Một migration hoá ra sai thì không đem đi sửa; nó bị thay thế. Hãy viết cái thứ hai sửa lại nó, review cả hai, và lịch sử vẫn là một bản ghi trung thực về những gì thật sự đã xảy ra với cơ sở dữ liệu — đúng thứ bạn sẽ cần khi ngồi đọc nó vào ba giờ sáng.</p>
</div>

<h3>Migration KHÔNG phải là gì</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Không đảo ngược được</span><span class="v">Prisma cố ý không có migration <code>down</code>. Quay lui nghĩa là viết một migration tiến mới để gỡ bỏ thay đổi — và phải nghĩ về dữ liệu, thứ mà một <code>down</code> tự động không làm nổi.</span></div>
  <div class="kv"><span class="k">Không phải lúc nào cũng nguyên tử qua nhiều câu lệnh</span><span class="v">PostgreSQL chạy mỗi tệp migration trong một giao dịch, nên một lỗi làm quay lui cả tệp — phần lớn trường hợp. Những câu như <code>CREATE INDEX CONCURRENTLY</code> không chạy được bên trong giao dịch, còn MySQL thì không có DDL giao dịch nào cả — ở đó một lần hỏng có thể để lại một phần của tệp.</span></div>
  <div class="kv"><span class="k">Không phải công cụ di chuyển dữ liệu</span><span class="v">Bạn <em>có thể</em> đặt câu <code>UPDATE</code> vào một migration, và với một lần đổ dữ liệu nhỏ thì nên. Với hàng triệu hàng thì một migration chạy bên trong một lần deploy là chỗ sai — nó giữ khoá và chặn bản phát hành. Bài 6.5 nói cách tách ra.</span></div>
  <div class="kv"><span class="k">Không biết gì về ứng dụng của bạn</span><span class="v">Một migration xoá một cột vẫn thành công dù mã đang chạy còn đang chọn cột đó. Phiên bản cũ tiếp tục chạy suốt thời gian deploy, và nó vỡ. Bài toán thứ tự ấy chính là toàn bộ mẫu nới–thu.</span></div>
</div>

<h3>Đọc một lịch sử migration thật</h3>
<pre><code class="language-bash"><span class="tok-comment"># Kho mã CuongThai, đo thật</span>
ls prisma/migrations | grep -vc migration_lock
ls prisma/migrations | head -6
cat prisma/migrations/*/migration.sql | wc -l</code></pre>
<div class="out">-- 12 Nov 2026
247
0_init
20260622_add_message_reply_support
20260622_add_performance_indexes
20260623_add_dev_post_video_url
20260623_fix_dashboard_celebration_unique
20260623_gin_social_posts_content_trgm
17821</div>
<p>Hai trăm bốn mươi bảy migration, và gần mười tám nghìn dòng SQL <em>chính là bản ghi dứt khoát</em> về việc cơ sở dữ liệu này đã trở nên như hiện nay bằng cách nào. Để ý <code>0_init</code> ở trên cùng: một migration nền, tạo ra khi Prisma được đưa vào một cơ sở dữ liệu vốn đã tồn tại. Bài 6.4 chỉ cách tạo một cái như thế.</p>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/mental-model" target="_blank" rel="noopener"><span class="lc-ico">🧠</span><span class="lc-body"><span class="lc-title">Prisma Migrate — mô hình tư duy</span><span class="lc-sub">prisma.io/docs · Trang hay nhất trong toàn bộ tài liệu. Hãy đọc một lần, đọc cho kỹ</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/migration-histories" target="_blank" rel="noopener"><span class="lc-ico">📜</span><span class="lc-body"><span class="lc-title">Migration histories</span><span class="lc-sub">prisma.io/docs · Bảng <code>_prisma_migrations</code>, checksum, và luật về việc sửa tệp</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/error-reference#prisma-migrate" target="_blank" rel="noopener"><span class="lc-ico">🚨</span><span class="lc-body"><span class="lc-title">Mã lỗi Migrate — P3000 tới P3021</span><span class="lc-sub">prisma.io/docs · Mỗi mã nghĩa là gì; bảng mà Chương 12 biến thành một sách công thức</span></span></a>
<a class="link-card" href="/courses/git/learn${REF}"><span class="lc-ico">🌿</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Git &amp; GitHub</span><span class="lc-sub">Migration là mã nguồn: review chúng trong pull request, và gỡ xung đột giữa hai nhánh cùng thêm một cái</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Đọc một bảng <code>_prisma_migrations</code> đang hỏng và nói chính xác chuyện gì đã xảy ra với từng hàng</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 6.2 ─────────────────────────── */
    {
      title: '6.2 — The shadow database|||6.2 — Shadow database',
      slug: 'pr-6-2-shadow-database',
      type: 'LESSON',
      description: 'Cơ sở dữ liệu nháp mà migrate dev tạo rồi xoá: nó dùng để làm gì, năm bước migrate dev thật sự chạy, ba lý do nó hỏng trên dịch vụ thuê, shadowDatabaseUrl, và vì sao migrate deploy không cần nó.',
      content: `
${G06_2}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>The shadow database</h2>
<p class="lead">Ask anyone what has confused them about Prisma migrations and the shadow database will be in the answer. It is a second, temporary database that <code>migrate dev</code> creates, replays your entire history into, and drops — several times a day, silently, unless it fails. Understanding what it is for makes both its errors and its absence in production obvious.</p>

<h3>What <code>migrate dev</code> actually does</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Create the shadow database</span><span class="lz-d">A brand-new empty database, named something like <code>prisma_migrate_shadow_db_a1b2c3</code>. This requires <code>CREATE DATABASE</code> permission, which is where most failures start.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Replay every migration into it</span><span class="lz-d">In order, from <code>0_init</code> onwards. If any of them cannot run on a clean database, this step fails — and it does so <em>regardless of whether your real database is fine</em>.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Compare shadow against your schema</span><span class="lz-d">The shadow now represents "what the migration history says the database should look like". Diffing it against <code>schema.prisma</code> produces exactly the SQL for your new migration.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Compare shadow against the real database</span><span class="lz-d">If they differ, someone changed the real database outside the migration history. That is <strong>drift</strong>, and Lesson 6.4 is about it.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Drop the shadow, write the file, apply it</span><span class="lz-d">Then regenerate the client and run the seed. The shadow database exists for perhaps two seconds and you never see it.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Watch it happen: list databases while migrate dev runs</span>
npx prisma migrate dev --name them_phone &amp;
<span class="tok-comment"># …while it runs, poll pg_database every few milliseconds</span>
psql -c "SELECT datname FROM pg_database WHERE datname LIKE 'prisma_migrate_shadow%'"</code></pre>
<div class="out">-- 12 Nov 2026 · Prisma 6.19.3 · PostgreSQL 16.14 (nhin-shadow.sh)
trong lúc migrate dev chạy: prisma_migrate_shadow_db_d3ab51e3-1fe2-49c4-a1c4-3453cf7e72b2
migrate dev xong (exit 0)
sau đó: 0 CSDL shadow còn lại
Applying migration &#96;20261112000311_them_phone&#96;
Your database is now in sync with your schema.</div>
<div class="callout">
<p><strong>Steps 2 and 4 are the whole point.</strong> Step 2 verifies that your migration history is <em>replayable</em> — that a new developer, or a fresh CI database, can build the schema from scratch. Step 4 verifies that your real database still matches what the history describes. Without a shadow database Prisma could still generate a migration, but it could not tell you either of those things, and both are how migration bugs get caught before production.</p>
</div>

<h3>Why it fails on a hosted database</h3>
<pre><code class="language-bash">npx prisma migrate dev --name them_cot</code></pre>
<div class="out">-- role without CREATEDB, like a restricted hosted-database user
Error: P3014
Prisma Migrate could not create the shadow database. Please make sure the database user has permission to create databases. Read more about the shadow database (and workarounds) at https://pris.ly/d/migrate-shadow
Original error: 
ERROR: permission denied to create database
[exit 1]</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Managed providers do not grant <code>CREATE DATABASE</code></span><span class="v">Supabase, Neon, Railway, PlanetScale, RDS with a restricted user — the database user you are given can do everything inside its own database and nothing outside it. This is correct security, and it makes step 1 impossible.</span></div>
  <div class="kv"><span class="k">The fix: <code>shadowDatabaseUrl</code></span><span class="v">Create a second empty database yourself, once, and point Prisma at it. Prisma will reset and reuse it instead of creating one.</span></div>
  <div class="kv"><span class="k">It must be a different database</span><span class="v">Give it the <em>same</em> URL as <code>DATABASE_URL</code> and Prisma refuses (tested: "The shadow database you configured appears to be the same as the main database"). Give it any <em>other</em> database and Prisma empties it on every <code>migrate dev</code> — tested on a database holding 5,000 orders: the command reported success and the table was gone. The shadow database is reset by design.</span></div>
  <div class="kv"><span class="k">Never point it at anything real</span><span class="v">Not staging, not a shared team database, and obviously not production. The URL belongs in a local <code>.env</code> and nowhere else.</span></div>
</div>
<pre><code class="language-typescript">datasource db {
  provider          = "postgresql"
  url               = env("DATABASE_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
}</code></pre>
<pre><code><span class="tok-comment"># .env — a second database on the same server, created once by hand</span>
DATABASE_URL="postgresql://student:matkhau@localhost:5432/hocprisma"
SHADOW_DATABASE_URL="postgresql://student:matkhau@localhost:5432/hocprisma_shadow"</code></pre>
<pre><code class="language-bash"># created once by an account that may create databases
psql -U postgres -c "CREATE DATABASE hocprisma_shadow OWNER student;"
npx prisma migrate dev --name khoi_tao</code></pre>
<div class="out">Applying migration &#96;20261112000313_khoi_tao&#96;
The following migration(s) have been created and applied from new schema changes:
p6/62/b/prisma/migrations/
Your database is now in sync with your schema.</div>

<h3>The other failure: a migration that cannot replay</h3>
<pre><code class="language-bash">npx prisma migrate dev --name bat_ky</code></pre>
<div class="out">-- the two lines reproduced in a demo history (2_add_music), real output
Error: P3006
Migration &#96;2_add_music&#96; failed to apply cleanly to the shadow database. 
Error:
ERROR: relation "post_music_post_id_key" already exists
[exit 1]</div>
<div class="note-ct">
<p><strong>From the CuongThai codebase — this is the repository's own permanent state.</strong> Migration <code>20260706130000_add_music_and_profile</code> creates a UNIQUE constraint named <code>post_music_post_id_key</code> and then, a few statements later, a plain index <em>with the same name</em>. A UNIQUE constraint creates an index of its own name, so on a clean database those two lines can never both succeed — run on one, the second fails with <code>relation "post_music_post_id_key" already exists</code>. The production row says the migration is applied; how it got there is not visible from the file. What is visible is the result: the history cannot replay.</p>
<p>So in this repository <code>npx prisma migrate dev</code> is <strong>permanently broken</strong>, and the repository's instructions say so in as many words. The migration is already deployed, and the rules forbid editing a deployed migration — so the fix is not to fix it. New migrations here are hand-written and applied with <code>migrate deploy</code>, which does not use a shadow database at all. That is Lesson 6.3.</p>
<p>The general lesson is worth more than the specific one: <strong>a migration history that cannot replay is a liability you accumulate silently.</strong> It works fine until the day someone needs a fresh database — a new developer, a CI job, a restore into a clean instance — and then it does not work at all. Run <code>migrate dev</code> regularly, on a throwaway database if necessary, precisely so this is discovered on a Tuesday afternoon rather than during an incident.</p>
</div>

<h3>Production does not use one</h3>
<pre><code class="language-bash">npx prisma migrate deploy</code></pre>
<div class="out">-- a role WITHOUT CREATEDB, on a fresh database
1 migration found in prisma/migrations
Applying migration &#96;20261112000313_khoi_tao&#96;
The following migration(s) have been applied:
All migrations have been successfully applied.</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">No shadow database</span><span class="lz-lnote"><code>migrate deploy</code> does not diff anything. It reads the folder, reads <code>_prisma_migrations</code>, and runs what is missing. That is why it works on a locked-down production user with no <code>CREATE DATABASE</code> permission.</span></div>
  <div class="lz-layer"><span class="lz-lname">No prompts, ever</span><span class="lz-lnote">It never asks a question and never resets. Designed to run unattended in a deploy pipeline, where an interactive prompt is a hung job.</span></div>
  <div class="lz-layer"><span class="lz-lname">No new files</span><span class="lz-lnote">It applies migrations, it does not create them. If the SQL is wrong, it was wrong when you committed it — which is exactly why the review happens on the pull request.</span></div>
  <div class="lz-layer"><span class="lz-lname">This is also the escape hatch</span><span class="lz-lnote">Because it skips the shadow database entirely, <code>migrate deploy</code> applies a hand-written migration that <code>migrate dev</code> would refuse to generate. That is how the CuongThai repository still ships schema changes.</span></div>
</div>

<h3>The command that answers "did that work?"</h3>
<pre><code class="language-bash"><span class="tok-comment"># Compare the live database against the schema file. Empty = no drift.</span>
npx prisma migrate diff \\
  --from-schema-datasource prisma/schema.prisma \\
  --to-schema-datamodel prisma/schema.prisma \\
  --script</code></pre>
<div class="out">-- This is an empty migration.</div>
<pre><code class="language-bash"><span class="tok-comment"># Compare the migration history against the live database instead</span>
npx prisma migrate diff \\
  --from-migrations ./prisma/migrations \\
  --to-schema-datasource prisma/schema.prisma \\
  --shadow-database-url "$SHADOW_DATABASE_URL" \\
  --script</code></pre>
<div class="callout ok">
<p><strong><code>migrate diff</code> is the tool that makes the rest of this chapter possible.</strong> It answers three different questions depending on its <code>--from</code> and <code>--to</code>: is my database what my schema says (drift), is my database what my migrations say (history integrity), and what SQL would take me from A to B (generating a migration by hand). It is read-only, it never touches anything, and it is the first thing to reach for when you are unsure what state something is in.</p>
</div>

<h3>Learning sources for this lesson</h3>
<div class="pitfall">
<p><strong>Trap — pointing the shadow database at a URL that already holds data.</strong> &#96;shadowDatabaseUrl&#96; names a database Prisma <em>drops and recreates</em> on every &#96;migrate dev&#96; run. Give it the URL of a staging database and the first migration wipes it, silently and completely — the command reports success, because destroying that database is exactly what it was asked to do. It bites hardest on a hosted provider where the shadow URL is copied from the dashboard and the two connection strings differ by one character. Point it at a database whose only purpose is being thrown away, and never at anything whose name you would mind seeing in a backup request.</p>
</div>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/shadow-database" target="_blank" rel="noopener"><span class="lc-ico">👥</span><span class="lc-body"><span class="lc-title">The shadow database</span><span class="lc-sub">prisma.io/docs · What it is for, the permissions it needs, and every workaround per provider</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/prisma-cli-reference#migrate-diff" target="_blank" rel="noopener"><span class="lc-ico">🔬</span><span class="lc-body"><span class="lc-title"><code>migrate diff</code> — reference</span><span class="lc-sub">prisma.io/docs · Every <code>--from</code> and <code>--to</code> combination, which is the whole power of the command</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/error-reference#p3014" target="_blank" rel="noopener"><span class="lc-ico">🚨</span><span class="lc-body"><span class="lc-title">P3014 and P3006</span><span class="lc-sub">prisma.io/docs · The two shadow-database errors, and what each one is really telling you</span></span></a>
<a class="link-card" href="/courses/docker/learn${REF}"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">CuongThai course — Docker</span><span class="lc-sub">A throwaway PostgreSQL for verifying that your migration history still replays cleanly</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Break a migration history so it cannot replay, then diagnose it from the P3006 alone</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Shadow database</h2>
<p class="lead">Hỏi bất kỳ ai xem họ thấy khó hiểu gì ở migration của Prisma, thế nào shadow database cũng nằm trong câu trả lời. Nó là một cơ sở dữ liệu thứ hai, tạm thời, mà <code>migrate dev</code> tạo ra, phát lại toàn bộ lịch sử của bạn vào đó, rồi xoá — vài lần mỗi ngày, trong im lặng, trừ khi nó hỏng. Hiểu nó dùng để làm gì thì cả những lỗi của nó lẫn sự vắng mặt của nó trên production đều trở nên hiển nhiên.</p>

<h3><code>migrate dev</code> thật sự làm gì</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Tạo shadow database</span><span class="lz-d">Một cơ sở dữ liệu rỗng hoàn toàn mới, tên đại loại <code>prisma_migrate_shadow_db_a1b2c3</code>. Việc này cần quyền <code>CREATE DATABASE</code>, và đó là nơi phần lớn sự cố bắt đầu.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Phát lại mọi migration vào đó</span><span class="lz-d">Theo thứ tự, từ <code>0_init</code> trở đi. Nếu có bất kỳ cái nào không chạy nổi trên một cơ sở dữ liệu sạch thì bước này hỏng — và nó hỏng <em>bất kể cơ sở dữ liệu thật của bạn có ổn hay không</em>.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">So shadow với lược đồ của bạn</span><span class="lz-d">Shadow lúc này đại diện cho "cơ sở dữ liệu phải trông thế nào theo lời lịch sử migration". Lấy chênh lệch giữa nó và <code>schema.prisma</code> ra chính xác phần SQL cho migration mới của bạn.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">So shadow với cơ sở dữ liệu thật</span><span class="lz-d">Nếu hai bên khác nhau thì có ai đó đã đổi cơ sở dữ liệu thật ngoài lịch sử migration. Đó là <strong>trôi dạt</strong>, và Bài 6.4 nói về nó.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Xoá shadow, ghi tệp, áp dụng nó</span><span class="lz-d">Rồi sinh lại client và chạy seed. Shadow database tồn tại có lẽ hai giây và bạn không bao giờ nhìn thấy nó.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Xem nó xảy ra: liệt kê các cơ sở dữ liệu trong lúc migrate dev đang chạy</span>
npx prisma migrate dev --name them_phone &amp;
<span class="tok-comment"># …trong lúc nó chạy, cứ vài mili giây lại hỏi pg_database</span>
psql -c "SELECT datname FROM pg_database WHERE datname LIKE 'prisma_migrate_shadow%'"</code></pre>
<div class="out">-- 12/11/2026 · Prisma 6.19.3 · PostgreSQL 16.14 (nhin-shadow.sh)
trong lúc migrate dev chạy: prisma_migrate_shadow_db_d3ab51e3-1fe2-49c4-a1c4-3453cf7e72b2
migrate dev xong (exit 0)
sau đó: 0 CSDL shadow còn lại
Applying migration &#96;20261112000311_them_phone&#96;
Your database is now in sync with your schema.</div>
<div class="callout">
<p><strong>Bước 2 và 4 mới là trọng tâm.</strong> Bước 2 kiểm rằng lịch sử migration của bạn <em>phát lại được</em> — rằng một lập trình viên mới, hay một cơ sở dữ liệu CI sạch, dựng lại được lược đồ từ đầu. Bước 4 kiểm rằng cơ sở dữ liệu thật của bạn vẫn còn khớp với thứ lịch sử mô tả. Không có shadow database thì Prisma vẫn sinh ra được migration, nhưng nó không nói được cho bạn cả hai điều đó, mà cả hai đều là cách những con bọ migration bị bắt trước khi lên production.</p>
</div>

<h3>Vì sao nó hỏng trên cơ sở dữ liệu thuê</h3>
<pre><code class="language-bash">npx prisma migrate dev --name them_cot</code></pre>
<div class="out">-- vai trò không có CREATEDB, giống tài khoản bị hạn chế của database thuê
Error: P3014
Prisma Migrate could not create the shadow database. Please make sure the database user has permission to create databases. Read more about the shadow database (and workarounds) at https://pris.ly/d/migrate-shadow
Original error: 
ERROR: permission denied to create database
[exit 1]</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Nhà cung cấp dịch vụ không cấp <code>CREATE DATABASE</code></span><span class="v">Supabase, Neon, Railway, PlanetScale, RDS với người dùng bị hạn chế — tài khoản cơ sở dữ liệu họ đưa bạn làm được mọi thứ bên trong cơ sở dữ liệu của nó và không làm gì được bên ngoài. Đó là bảo mật đúng đắn, và nó khiến bước 1 thành bất khả.</span></div>
  <div class="kv"><span class="k">Cách vá: <code>shadowDatabaseUrl</code></span><span class="v">Tự tạo một cơ sở dữ liệu rỗng thứ hai, một lần, rồi trỏ Prisma vào đó. Prisma sẽ xoá sạch và dùng lại nó thay vì tự tạo.</span></div>
  <div class="kv"><span class="k">Nó phải là một cơ sở dữ liệu KHÁC</span><span class="v">Đưa nó <em>cùng</em> URL với <code>DATABASE_URL</code> thì Prisma từ chối (đã thử: "The shadow database you configured appears to be the same as the main database"). Đưa nó bất kỳ cơ sở dữ liệu <em>nào khác</em> thì Prisma xoá sạch nó ở mỗi lần <code>migrate dev</code> — đã thử trên một cơ sở dữ liệu có 5.000 đơn hàng: lệnh báo thành công và bảng biến mất. Shadow database vốn được thiết kế để bị xoá sạch.</span></div>
  <div class="kv"><span class="k">Đừng bao giờ trỏ nó vào thứ gì có thật</span><span class="v">Không phải staging, không phải một cơ sở dữ liệu dùng chung của đội, và hiển nhiên không phải production. Cái URL đó thuộc về một tệp <code>.env</code> ở máy bạn và không thuộc về đâu khác.</span></div>
</div>
<pre><code class="language-typescript">datasource db {
  provider          = "postgresql"
  url               = env("DATABASE_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
}</code></pre>
<pre><code><span class="tok-comment"># .env — một cơ sở dữ liệu thứ hai trên cùng máy chủ, tạo tay một lần</span>
DATABASE_URL="postgresql://student:matkhau@localhost:5432/hocprisma"
SHADOW_DATABASE_URL="postgresql://student:matkhau@localhost:5432/hocprisma_shadow"</code></pre>
<pre><code class="language-bash"># tạo một lần bởi một tài khoản có quyền tạo database
psql -U postgres -c "CREATE DATABASE hocprisma_shadow OWNER student;"
npx prisma migrate dev --name khoi_tao</code></pre>
<div class="out">Applying migration &#96;20261112000313_khoi_tao&#96;
The following migration(s) have been created and applied from new schema changes:
p6/62/b/prisma/migrations/
Your database is now in sync with your schema.</div>

<h3>Sự cố còn lại: một migration không phát lại được</h3>
<pre><code class="language-bash">npx prisma migrate dev --name bat_ky</code></pre>
<div class="out">-- hai dòng ấy dựng lại trong một lịch sử demo (2_add_music), output thật
Error: P3006
Migration &#96;2_add_music&#96; failed to apply cleanly to the shadow database. 
Error:
ERROR: relation "post_music_post_id_key" already exists
[exit 1]</div>
<div class="note-ct">
<p><strong>Từ chính kho mã CuongThai — đây là trạng thái vĩnh viễn của chính kho này.</strong> Migration <code>20260706130000_add_music_and_profile</code> tạo một ràng buộc UNIQUE tên <code>post_music_post_id_key</code> rồi, vài câu lệnh sau, tạo một index thường <em>trùng y tên đó</em>. Một ràng buộc UNIQUE tự tạo một index mang chính tên đó, nên trên một cơ sở dữ liệu sạch, hai dòng ấy không bao giờ cùng thành công được — chạy thử, dòng thứ hai hỏng với <code>relation "post_music_post_id_key" already exists</code>. Hàng trên production ghi migration là đã áp dụng; nó tới được đó bằng cách nào thì tệp không cho thấy. Thứ thấy được là kết quả: lịch sử không phát lại được.</p>
<p>Nên trong kho này, <code>npx prisma migrate dev</code> <strong>hỏng vĩnh viễn</strong>, và chỉ dẫn của kho nói thẳng như vậy. Migration ấy đã deploy rồi, và luật cấm sửa một migration đã deploy — nên cách vá không phải là đi vá nó. Migration mới ở đây được viết tay và áp dụng bằng <code>migrate deploy</code>, vốn hoàn toàn không dùng shadow database. Đó là Bài 6.3.</p>
<p>Bài học tổng quát đáng giá hơn bài học cụ thể: <strong>một lịch sử migration không phát lại được là một khoản nợ bạn tích luỹ trong im lặng.</strong> Nó vẫn ổn cho tới ngày có người cần một cơ sở dữ liệu sạch — một lập trình viên mới, một job CI, một lần phục hồi vào một máy trắng — và lúc đó thì nó hoàn toàn không chạy. Hãy chạy <code>migrate dev</code> đều đặn, trên một cơ sở dữ liệu vứt đi được nếu cần, đúng để chuyện này bị phát hiện vào một chiều thứ Ba chứ không phải giữa một sự cố.</p>
</div>

<h3>Production không dùng shadow database</h3>
<pre><code class="language-bash">npx prisma migrate deploy</code></pre>
<div class="out">-- một vai trò KHÔNG có CREATEDB, trên một cơ sở dữ liệu mới
1 migration found in prisma/migrations
Applying migration &#96;20261112000313_khoi_tao&#96;
The following migration(s) have been applied:
All migrations have been successfully applied.</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Không có shadow database</span><span class="lz-lnote"><code>migrate deploy</code> không so chênh lệch gì cả. Nó đọc thư mục, đọc <code>_prisma_migrations</code>, rồi chạy những gì còn thiếu. Vì thế nó chạy được với một tài khoản production bị khoá chặt, không có quyền <code>CREATE DATABASE</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">Không hỏi, không bao giờ</span><span class="lz-lnote">Nó không bao giờ đặt câu hỏi và không bao giờ reset. Được thiết kế để chạy không người trông trong một đường ống deploy, nơi một câu hỏi tương tác là một job treo.</span></div>
  <div class="lz-layer"><span class="lz-lname">Không tạo tệp mới</span><span class="lz-lnote">Nó áp dụng migration, không tạo ra chúng. Nếu SQL sai thì nó đã sai từ lúc bạn commit — và đó đúng là lý do phần review diễn ra ở pull request.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đây cũng là cửa thoát hiểm</span><span class="lz-lnote">Vì nó bỏ qua hoàn toàn shadow database, <code>migrate deploy</code> áp dụng được một migration viết tay mà <code>migrate dev</code> sẽ từ chối sinh ra. Đó là cách kho mã CuongThai vẫn đưa được thay đổi lược đồ lên chạy.</span></div>
</div>

<h3>Câu lệnh trả lời "vừa rồi có ăn thua không?"</h3>
<pre><code class="language-bash"><span class="tok-comment"># So cơ sở dữ liệu đang sống với tệp lược đồ. Rỗng = không trôi dạt.</span>
npx prisma migrate diff \\
  --from-schema-datasource prisma/schema.prisma \\
  --to-schema-datamodel prisma/schema.prisma \\
  --script</code></pre>
<div class="out">-- This is an empty migration.</div>
<pre><code class="language-bash"><span class="tok-comment"># Hoặc so lịch sử migration với cơ sở dữ liệu đang sống</span>
npx prisma migrate diff \\
  --from-migrations ./prisma/migrations \\
  --to-schema-datasource prisma/schema.prisma \\
  --shadow-database-url "$SHADOW_DATABASE_URL" \\
  --script</code></pre>
<div class="callout ok">
<p><strong><code>migrate diff</code> là công cụ khiến phần còn lại của chương này khả thi.</strong> Nó trả lời ba câu hỏi khác nhau tuỳ theo <code>--from</code> và <code>--to</code>: cơ sở dữ liệu của tôi có đúng như lược đồ nói không (trôi dạt), cơ sở dữ liệu của tôi có đúng như các migration nói không (toàn vẹn lịch sử), và cần SQL nào để đi từ A tới B (viết tay một migration). Nó chỉ đọc, không đụng vào thứ gì, và là thứ đầu tiên nên với tay tới khi bạn không chắc thứ gì đó đang ở trạng thái nào.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<div class="pitfall">
<p><strong>Bẫy — trỏ shadow database vào một URL vốn đang chứa dữ liệu.</strong> &#96;shadowDatabaseUrl&#96; gọi tên một cơ sở dữ liệu mà Prisma <em>xoá đi rồi dựng lại</em> ở mỗi lần chạy &#96;migrate dev&#96;. Đưa cho nó URL của một cơ sở dữ liệu staging là migration đầu tiên xoá sạch nó, lặng lẽ và trọn vẹn — lệnh báo thành công, vì phá huỷ cơ sở dữ liệu đó đúng là việc nó được giao. Nó cắn đau nhất trên một nhà cung cấp dịch vụ nơi URL shadow được chép từ bảng điều khiển và hai chuỗi kết nối chỉ khác nhau một ký tự. Hãy trỏ nó vào một cơ sở dữ liệu mà mục đích duy nhất là bị vứt đi, và đừng bao giờ trỏ vào thứ mà bạn sẽ tiếc nếu thấy tên nó trong một yêu cầu khôi phục sao lưu.</p>
</div>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/shadow-database" target="_blank" rel="noopener"><span class="lc-ico">👥</span><span class="lc-body"><span class="lc-title">The shadow database</span><span class="lc-sub">prisma.io/docs · Nó dùng để làm gì, cần quyền gì, và mọi cách đi vòng theo từng provider</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/prisma-cli-reference#migrate-diff" target="_blank" rel="noopener"><span class="lc-ico">🔬</span><span class="lc-body"><span class="lc-title"><code>migrate diff</code> — tra cứu</span><span class="lc-sub">prisma.io/docs · Mọi tổ hợp <code>--from</code> và <code>--to</code>, tức toàn bộ sức mạnh của câu lệnh</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/error-reference#p3014" target="_blank" rel="noopener"><span class="lc-ico">🚨</span><span class="lc-body"><span class="lc-title">P3014 và P3006</span><span class="lc-sub">prisma.io/docs · Hai lỗi của shadow database, và mỗi cái thật ra đang nói với bạn điều gì</span></span></a>
<a class="link-card" href="/courses/docker/learn${REF}"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Docker</span><span class="lc-sub">Một PostgreSQL dùng rồi vứt để kiểm xem lịch sử migration của bạn còn phát lại sạch không</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Làm hỏng một lịch sử migration cho nó không phát lại được, rồi chẩn đoán chỉ từ mã P3006</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 6.3 ─────────────────────────── */
    {
      title: '6.3 — Hand-written migrations|||6.3 — Migration viết tay',
      slug: 'pr-6-3-viet-tay',
      type: 'LESSON',
      description: 'Khi nào phải tự viết SQL: migrate dev hỏng, thêm cột bắt buộc vào bảng có dữ liệu, đổi tên cột mà không mất dữ liệu, partial index và CHECK, extension. Quy trình bốn bước sinh SQL rồi tự sửa, và cách kiểm rằng bạn không tạo ra trôi dạt.',
      content: `
${G06_3}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>Hand-written migrations</h2>
<p class="lead">There are two reasons to write migration SQL yourself: because <code>migrate dev</code> cannot run at all in your repository, and because the change you need is one Prisma's generator will never produce correctly. Both are common in a codebase older than a year, and neither is a workaround — hand-written migrations are a first-class part of the tool.</p>

<h3>The four-step process</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Edit <code>schema.prisma</code> as usual</span><span class="lz-d">The schema is still the source of truth, and the generated client still comes from it. Only the SQL is yours.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Generate the SQL with <code>migrate diff</code></span><span class="lz-d">Ask Prisma what SQL would take the live database to the new schema. This gives you a correct starting point instead of writing <code>ALTER TABLE</code> from memory.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Edit it — this is the point</span><span class="lz-d">Split a destructive step into safe ones, add a backfill, add a <code>CONCURRENTLY</code>, add the partial index Prisma cannot declare.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Apply with <code>migrate deploy</code>, then verify</span><span class="lz-d">No shadow database is involved, so a repository with a broken history still works. Then <code>migrate diff</code> again: empty output means the schema and the database agree.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Step 2 — generate the starting point</span>
mkdir -p prisma/migrations/20261112063000_them_slug

npx prisma migrate diff \\
  --from-schema-datasource prisma/schema.prisma \\
  --to-schema-datamodel   prisma/schema.prisma \\
  --script &gt; prisma/migrations/20261112063000_them_slug/migration.sql

cat prisma/migrations/20261112063000_them_slug/migration.sql</code></pre>
<div class="out">-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "posts_slug_key" ON "posts"("slug");</div>
<div class="callout warn">
<p><strong>That generated SQL is correct and will fail.</strong> <code>ADD COLUMN … NOT NULL</code> with no default cannot be applied to a table that already has rows — PostgreSQL has nothing to put in the existing ones. This is exactly the case where the generator gives you the shape and a human has to supply the plan. Step 3 is where the value is.</p>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Proof, without applying anything: run the generated file inside a transaction and roll back</span>
(echo 'BEGIN;'; cat migration.sql; echo 'ROLLBACK;') | psql "$DATABASE_URL"</code></pre>
<div class="out">-- 12 Nov 2026 · Prisma 6.19.3 · PostgreSQL 16.14 · 200,000 posts already in the table
BEGIN
ERROR:  column "slug" of relation "posts" contains null values
ERROR:  current transaction is aborted, commands ignored until end of transaction block
ROLLBACK</div>
<pre><code class="language-sql"><span class="tok-comment">-- Step 3 — the edited version that actually works</span>

<span class="tok-comment">-- 1. Add it nullable, so existing rows survive</span>
ALTER TABLE "posts" ADD COLUMN "slug" TEXT;

<span class="tok-comment">-- 2. Backfill from data that already exists</span>
UPDATE "posts"
SET "slug" = regexp_replace(lower("title"), '[^a-z0-9]+', '-', 'g') || '-' || "id"
WHERE "slug" IS NULL;

<span class="tok-comment">-- 3. Now the constraint can be satisfied</span>
ALTER TABLE "posts" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX "posts_slug_key" ON "posts"("slug");</code></pre>
<pre><code class="language-bash">npx prisma migrate deploy
npx prisma migrate diff --from-schema-datasource prisma/schema.prisma \\
                        --to-schema-datamodel prisma/schema.prisma --script</code></pre>
<div class="out">2 migrations found in prisma/migrations
Applying migration &#96;20261112063000_them_slug&#96;
All migrations have been successfully applied.
-- This is an empty migration.</div>
<p>Empty diff. The database now matches the schema, the migration is recorded in <code>_prisma_migrations</code> like any other, and nothing about the rest of the toolchain knows or cares that a human wrote the SQL.</p>

<h3>Renaming a column without losing data</h3>
<pre><code class="language-typescript"><span class="tok-comment">// You rename a field in the schema</span>
model User {
  fullName String? @map("ho_ten")     <span class="tok-comment">// was: fullName String? @map("full_name")</span>
}</code></pre>
<div class="out">-- What migrate diff generates (run for real). Read it twice.
-- AlterTable
ALTER TABLE "users" DROP COLUMN "full_name",
ADD COLUMN     "ho_ten" TEXT;</div>
<div class="pitfall">
<p><strong>Trap — Prisma cannot see a rename.</strong> It diffs two schema states, and "column <code>full_name</code> gone, column <code>ho_ten</code> new" is indistinguishable from a rename. So the generated migration <strong>drops the column and every value in it</strong>. On a development database with test data this is invisible. On production it is silent, permanent data loss, and the migration reports success.</p>
<p>The fix is one line, and you must write it yourself every time:</p>
</div>
<pre><code class="language-sql"><span class="tok-comment">-- The hand-written version</span>
ALTER TABLE "users" RENAME COLUMN "full_name" TO "ho_ten";</code></pre>
<div class="out">$ psql -c 'SELECT count(full_name) FROM users'
  1000
(1 row)
$ npx prisma migrate deploy
3 migrations found in prisma/migrations
Applying migration &#96;20261112064000_doi_ten_ho_ten&#96;
All migrations have been successfully applied.
$ psql -c 'SELECT count(ho_ten) FROM users'
  1000
(1 row)
$ npx prisma migrate diff --from-schema-datasource … --to-schema-datamodel … --script
-- This is an empty migration.</div>
<div class="callout ok">
<p><strong>Read every generated migration before committing it, and look specifically for <code>DROP</code>.</strong> A <code>DROP COLUMN</code> or <code>DROP TABLE</code> you did not consciously intend is the single highest-risk line that can appear in a migration. <code>migrate diff</code> — the command this whole workflow is built on — printed that <code>DROP</code> with no warning at all, and <code>migrate deploy</code> would apply it without asking.</p>
</div>

<h3>The five things Prisma cannot declare</h3>
<pre><code class="language-sql"><span class="tok-comment">-- One hand-written migration, applied with migrate deploy (tested on the demo tables)</span>
-- 1. Partial index — only posts without a body
CREATE INDEX "posts_author_nhap_idx" ON "posts"("author_id") WHERE "body" IS NULL;
-- 2. Expression index — case-insensitive email lookup
CREATE UNIQUE INDEX "users_email_lower_key" ON "users"(lower("email"));
-- 3. CHECK constraint
ALTER TABLE "posts" ADD CONSTRAINT "posts_title_khong_rong" CHECK (length("title") &gt; 0);
-- 4. An extension and the index that needs it
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX "posts_title_trgm" ON "posts" USING gin ("title" gin_trgm_ops);
-- 5. Generated column
ALTER TABLE "posts" ADD COLUMN "search" tsvector
  GENERATED ALWAYS AS (to_tsvector('simple', coalesce("title", ''))) STORED;</code></pre>
<pre><code class="language-bash"><span class="tok-comment"># What would the NEXT generated migration do to them?</span>
npx prisma migrate diff --from-schema-datasource prisma/schema.prisma \\
                        --to-schema-datamodel prisma/schema.prisma --script
<span class="tok-comment"># And what does introspection bring back?</span>
npx prisma db pull --print</code></pre>
<div class="out">-- DropIndex
DROP INDEX "posts_title_trgm";
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "search";

// *** WARNING ***
// These fields are not supported by Prisma Client, because Prisma currently does not support their types:
//   - Model: "Post", field: "search", original data type: "tsvector"
// These constraints are not supported by Prisma Client, because Prisma currently does not fully support check constraints. Read more: https://pris.ly/d/check-constraints
//   - Model: "Post", constraint: "posts_title_khong_rong"
// These indexes are not supported by Prisma Client, because Prisma currently does not fully support expression indexes. Read more: https://pris.ly/d/expression-indexes
//   - Model: "User", constraint: "users_email_lower_key"
model Post {
  id       Int                      @id @default(autoincrement())
  title    String
  body     String?
  authorId Int                      @map("author_id")
  slug     String                   @unique
  search   Unsupported("tsvector")? @default(dbgenerated("to_tsvector('simple'::regconfig, COALESCE(title, ''::text))"))
  author   User                     @relation(fields: [authorId], references: [id])
  @@index([title(ops: raw("gin_trgm_ops"))], map: "posts_title_trgm", type: Gin)
  @@map("posts")
}</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Some of them WILL be dropped</span><span class="v">The trigram index and the generated column <code>search</code> are things Prisma can see and that are not in the schema, so the next generated migration drops them — silently, like any other diff. Declare them exactly as <code>db pull</code> prints them (below): <code>@@index([title(ops: raw("gin_trgm_ops"))], map: "posts_title_trgm", type: Gin)</code> and the <code>search</code> line <em>including</em> its <code>@default(dbgenerated(…))</code>. Tested: with both lines the diff is empty; leave out the default and it still wants <code>ALTER COLUMN "search" DROP DEFAULT</code>.</span></div>
  <div class="kv"><span class="k">Some are left alone</span><span class="v">The partial index, the expression index and the <code>CHECK</code> constraint did not appear in the diff: Prisma does not manage them, so it does not drop them either.</span></div>
  <div class="kv"><span class="k"><code>db pull</code>: back, warned, or silently missing</span><span class="v">Back: the trigram index with its operator class, <code>search</code> as <code>Unsupported("tsvector")</code>. Warned about: the <code>CHECK</code> constraint and the expression index. Missing with no warning: the partial index <code>posts_author_nhap_idx</code>.</span></div>
  <div class="kv"><span class="k">So write them down</span><span class="v">A comment in <code>schema.prisma</code> next to the affected model, naming the hand-written objects and the migration that created them. Two lines that save the next person a confusing afternoon.</span></div>
</div>

<h3>The index that must not lock the table</h3>
<pre><code class="language-sql"><span class="tok-comment">-- What Prisma generates: locks the table for the whole build</span>
CREATE INDEX "posts_author_id_idx" ON "posts"("author_id");

<span class="tok-comment">-- What production needs: no write lock, but it CANNOT run in a transaction</span>
CREATE INDEX CONCURRENTLY "posts_author_id_idx" ON "posts"("author_id");</code></pre>
<div class="out">-- 3,000,000 rows; an INSERT is sent 0.5 s after the index build starts
-- measured 12 Nov 2026, Apple-silicon laptop, PostgreSQL 16.14 in Docker
== CREATE INDEX big_title_idx ON big (title)
   INSERT sent at 0.5 s: Time: 4084.357 ms (00:04.084)
   index build: Time: 4709.089 ms (00:04.709)
== CREATE INDEX CONCURRENTLY big_title_idx ON big (title)
   INSERT sent at 0.5 s: Time: 3.067 ms
   index build: Time: 5078.517 ms (00:05.079)</div>
<div class="callout warn">
<p><strong><code>CONCURRENTLY</code> cannot run inside a transaction block.</strong> Prisma sends a migration file to PostgreSQL in one go, and PostgreSQL runs a multi-statement file as one transaction — so it depends on what else is in the file. Both cases, run for real:</p>
</div>
<div class="out">-- (a) CONCURRENTLY next to another statement in the same file
ALTER TABLE "posts" ADD COLUMN "ghi_chu" TEXT;
CREATE INDEX CONCURRENTLY "posts_title_idx" ON "posts"("title");
$ npx prisma migrate deploy
Applying migration &#96;20261112000548_khoi_tao&#96;
Applying migration &#96;20261112066000_chi_muc_chung&#96;
Error: P3018
Database error code: 25001
ERROR: CREATE INDEX CONCURRENTLY cannot run inside a transaction block
   → applied_steps_count 0, and the ALTER beside it was rolled back too (no ghi_chu column)

-- (b) CONCURRENTLY alone in its own migration file
CREATE INDEX CONCURRENTLY "posts_title_idx" ON "posts"("title");
$ npx prisma migrate deploy
Applying migration &#96;20261112000548_khoi_tao&#96;
Applying migration &#96;20261112066000_chi_muc_rieng&#96;
All migrations have been successfully applied.
   → the index exists</div>
<div class="callout ok">
<p><strong>So: one statement, one migration.</strong> Give every <code>CREATE INDEX CONCURRENTLY</code> a migration file of its own, with nothing else in it. If it fails part-way it can leave an <code>INVALID</code> index behind (PostgreSQL documentation) — drop that index and deploy again.</p>
</div>

<h3>A realistic hand-written migration, annotated</h3>
<pre><code class="language-sql"><span class="tok-comment">-- prisma/migrations/20260823064500_them_xoa_mem/migration.sql</span>
<span class="tok-comment">-- Adds soft delete to posts. Written by hand because of steps 3 and 4,</span>
<span class="tok-comment">-- which the generator cannot express.</span>

<span class="tok-comment">-- 1. The column itself (this part Prisma would have generated)</span>
ALTER TABLE "posts" ADD COLUMN "deleted_at" TIMESTAMPTZ(3);

<span class="tok-comment">-- 2. Backfill: rows already hidden by the old boolean become soft-deleted</span>
UPDATE "posts" SET "deleted_at" = "updated_at" WHERE "is_hidden" = true;

<span class="tok-comment">-- 3. Partial index so "live posts by author" stays cheap</span>
CREATE INDEX "posts_author_active_idx"
  ON "posts"("author_id") WHERE "deleted_at" IS NULL;

<span class="tok-comment">-- 4. Uniqueness now applies only to live rows, so a slug can be reused</span>
DROP INDEX "posts_slug_key";
CREATE UNIQUE INDEX "posts_slug_active_key"
  ON "posts"("slug") WHERE "deleted_at" IS NULL;

<span class="tok-comment">-- 5. The old flag is NOT dropped here — see the expand-contract note</span>
<span class="tok-comment">--    in Lesson 6.5. It goes in a second migration, after the deploy.</span></code></pre>
<div class="out">-- run on a test table: 1,000 posts, 100 with is_hidden = true (12 Nov 2026, PostgreSQL 16.14)
ALTER TABLE · UPDATE 100 · CREATE INDEX · DROP INDEX · CREATE INDEX
 da_xoa_mem | count
        100 |  1000
INSERT (slug 'bai-10', which was soft-deleted)  → INSERT 0 1
INSERT (slug 'bai-11', still live)              → ERROR: duplicate key value violates unique constraint "posts_slug_active_key"</div>
<p>One consequence to plan for: a partial unique index cannot be declared in the schema, so the field loses its <code>@unique</code> there — and with it <code>findUnique({ where: { slug } })</code>. Use <code>findFirst</code> with <code>deletedAt: null</code>, and note the index next to the model.</p>
<div class="note-ct">
<p><strong>From the CuongThai codebase.</strong> This repository writes every new migration by hand, because <code>migrate dev</code> cannot run at all (Lesson 6.2). Its instructions spell out the exact procedure: create <code>prisma/migrations/&lt;timestamp&gt;_&lt;name&gt;/migration.sql</code>, apply with <code>npx prisma migrate deploy</code>, and verify with a <code>migrate diff</code> whose empty output is the proof there is no drift. Two hundred and forty-six migrations later (counted 12 Nov 2026), that process has held.</p>
<p>The point worth taking is that a broken <code>migrate dev</code> is not an emergency. It costs you the generated starting point and the drift check, both of which <code>migrate diff</code> gives back. What it does cost, permanently, is the guarantee that the history replays — so a repository in this state should build a fresh database from its migrations on a schedule, to catch the next unreplayable migration before it is the second one.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/workflows/customizing-migrations" target="_blank" rel="noopener"><span class="lc-ico">✍️</span><span class="lc-body"><span class="lc-title">Customizing migrations</span><span class="lc-sub">prisma.io/docs · <code>--create-only</code>, editing before applying, and the rename case in full</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/workflows/unsupported-database-features" target="_blank" rel="noopener"><span class="lc-ico">🧩</span><span class="lc-body"><span class="lc-title">Unsupported database features</span><span class="lc-sub">prisma.io/docs · Keeping check constraints, triggers and views across migrations</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/sql-createindex.html" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — CREATE INDEX</span><span class="lc-sub">postgresql.org · <code>CONCURRENTLY</code>, partial indexes and expression indexes, from the source</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">CuongThai course — PostgreSQL, DDL chapter</span><span class="lc-sub">What each ALTER TABLE form locks and for how long — the facts behind every choice here</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Turn four generated migrations into safe hand-written ones, including a rename and a NOT NULL</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>Migration viết tay</h2>
<p class="lead">Có hai lý do để tự viết SQL cho migration: vì <code>migrate dev</code> hoàn toàn không chạy được trong kho của bạn, và vì thay đổi bạn cần là thứ bộ sinh của Prisma sẽ không bao giờ tạo ra cho đúng. Cả hai đều phổ biến ở một kho mã già hơn một năm, và không cái nào là mẹo chữa cháy — migration viết tay là một phần chính thức của công cụ.</p>

<h3>Quy trình bốn bước</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Sửa <code>schema.prisma</code> như thường</span><span class="lz-d">Lược đồ vẫn là nguồn sự thật, và client sinh ra vẫn đến từ nó. Chỉ có phần SQL là của bạn.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Sinh SQL bằng <code>migrate diff</code></span><span class="lz-d">Hỏi Prisma xem cần SQL nào để đưa cơ sở dữ liệu đang sống tới lược đồ mới. Cái này cho bạn một điểm khởi đầu đúng thay vì gõ <code>ALTER TABLE</code> theo trí nhớ.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Sửa nó — đây mới là trọng tâm</span><span class="lz-d">Chẻ một bước phá huỷ thành các bước an toàn, thêm một lần đổ dữ liệu, thêm <code>CONCURRENTLY</code>, thêm cái partial index mà Prisma không khai được.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Áp dụng bằng <code>migrate deploy</code>, rồi kiểm lại</span><span class="lz-d">Không có shadow database nào tham gia, nên một kho có lịch sử hỏng vẫn chạy được. Sau đó <code>migrate diff</code> lần nữa: output rỗng nghĩa là lược đồ và cơ sở dữ liệu đồng ý với nhau.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Bước 2 — sinh ra điểm khởi đầu</span>
mkdir -p prisma/migrations/20261112063000_them_slug

npx prisma migrate diff \\
  --from-schema-datasource prisma/schema.prisma \\
  --to-schema-datamodel   prisma/schema.prisma \\
  --script &gt; prisma/migrations/20261112063000_them_slug/migration.sql

cat prisma/migrations/20261112063000_them_slug/migration.sql</code></pre>
<div class="out">-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "posts_slug_key" ON "posts"("slug");</div>
<div class="callout warn">
<p><strong>Đoạn SQL sinh ra đó vừa đúng vừa sẽ hỏng.</strong> <code>ADD COLUMN … NOT NULL</code> không kèm giá trị mặc định thì không áp dụng được lên một bảng vốn đã có hàng — PostgreSQL không có gì để điền vào những hàng cũ. Đây đúng là trường hợp bộ sinh cho bạn cái hình dạng còn con người phải cung cấp kế hoạch. Bước 3 mới là chỗ có giá trị.</p>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Chứng minh mà không áp dụng gì: chạy tệp sinh ra trong một giao dịch rồi lùi lại</span>
(echo 'BEGIN;'; cat migration.sql; echo 'ROLLBACK;') | psql "$DATABASE_URL"</code></pre>
<div class="out">-- 12/11/2026 · Prisma 6.19.3 · PostgreSQL 16.14 · bảng đã có 200.000 bài
BEGIN
ERROR:  column "slug" of relation "posts" contains null values
ERROR:  current transaction is aborted, commands ignored until end of transaction block
ROLLBACK</div>
<pre><code class="language-sql"><span class="tok-comment">-- Bước 3 — bản đã sửa và thật sự chạy được</span>

<span class="tok-comment">-- 1. Thêm ở dạng cho phép null, để các hàng cũ sống sót</span>
ALTER TABLE "posts" ADD COLUMN "slug" TEXT;

<span class="tok-comment">-- 2. Đổ dữ liệu vào từ thứ vốn đã có</span>
UPDATE "posts"
SET "slug" = regexp_replace(lower("title"), '[^a-z0-9]+', '-', 'g') || '-' || "id"
WHERE "slug" IS NULL;

<span class="tok-comment">-- 3. Giờ mới thoả được ràng buộc</span>
ALTER TABLE "posts" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX "posts_slug_key" ON "posts"("slug");</code></pre>
<pre><code class="language-bash">npx prisma migrate deploy
npx prisma migrate diff --from-schema-datasource prisma/schema.prisma \\
                        --to-schema-datamodel prisma/schema.prisma --script</code></pre>
<div class="out">2 migrations found in prisma/migrations
Applying migration &#96;20261112063000_them_slug&#96;
All migrations have been successfully applied.
-- This is an empty migration.</div>
<p>Chênh lệch rỗng. Cơ sở dữ liệu giờ khớp lược đồ, migration được ghi vào <code>_prisma_migrations</code> như mọi cái khác, và phần còn lại của bộ công cụ không biết cũng chẳng quan tâm rằng đoạn SQL đó do con người viết.</p>

<h3>Đổi tên một cột mà không mất dữ liệu</h3>
<pre><code class="language-typescript"><span class="tok-comment">// Bạn đổi tên một trường trong lược đồ</span>
model User {
  fullName String? @map("ho_ten")     <span class="tok-comment">// trước là: fullName String? @map("full_name")</span>
}</code></pre>
<div class="out">-- Thứ migrate diff sinh ra (chạy thật). Đọc hai lần.
-- AlterTable
ALTER TABLE "users" DROP COLUMN "full_name",
ADD COLUMN     "ho_ten" TEXT;</div>
<div class="pitfall">
<p><strong>Bẫy — Prisma không nhìn thấy một lần đổi tên.</strong> Nó so hai trạng thái lược đồ, và "cột <code>full_name</code> biến mất, cột <code>ho_ten</code> xuất hiện" thì không phân biệt được với một lần đổi tên. Nên migration sinh ra <strong>xoá cột đó cùng mọi giá trị trong nó</strong>. Trên cơ sở dữ liệu phát triển với dữ liệu thử thì chuyện này vô hình. Trên production đó là mất dữ liệu vĩnh viễn trong im lặng, và migration thì báo thành công.</p>
<p>Cách vá chỉ một dòng, và bạn phải tự viết nó mỗi lần:</p>
</div>
<pre><code class="language-sql"><span class="tok-comment">-- Bản viết tay</span>
ALTER TABLE "users" RENAME COLUMN "full_name" TO "ho_ten";</code></pre>
<div class="out">$ psql -c 'SELECT count(full_name) FROM users'
  1000
(1 row)
$ npx prisma migrate deploy
3 migrations found in prisma/migrations
Applying migration &#96;20261112064000_doi_ten_ho_ten&#96;
All migrations have been successfully applied.
$ psql -c 'SELECT count(ho_ten) FROM users'
  1000
(1 row)
$ npx prisma migrate diff --from-schema-datasource … --to-schema-datamodel … --script
-- This is an empty migration.</div>
<div class="callout ok">
<p><strong>Hãy đọc mọi migration sinh ra trước khi commit, và tìm riêng chữ <code>DROP</code>.</strong> Một <code>DROP COLUMN</code> hay <code>DROP TABLE</code> mà bạn không cố ý là dòng rủi ro cao nhất có thể xuất hiện trong một migration. <code>migrate diff</code> — câu lệnh mà cả quy trình này dựa vào — in ra chữ <code>DROP</code> ấy mà không kèm một lời cảnh báo nào, và <code>migrate deploy</code> sẽ áp nó mà không hỏi.</p>
</div>

<h3>Năm thứ Prisma không khai được</h3>
<pre><code class="language-sql"><span class="tok-comment">-- Một migration viết tay, áp bằng migrate deploy (đã chạy trên các bảng demo)</span>
-- 1. Partial index — only posts without a body
CREATE INDEX "posts_author_nhap_idx" ON "posts"("author_id") WHERE "body" IS NULL;
-- 2. Expression index — case-insensitive email lookup
CREATE UNIQUE INDEX "users_email_lower_key" ON "users"(lower("email"));
-- 3. CHECK constraint
ALTER TABLE "posts" ADD CONSTRAINT "posts_title_khong_rong" CHECK (length("title") &gt; 0);
-- 4. An extension and the index that needs it
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX "posts_title_trgm" ON "posts" USING gin ("title" gin_trgm_ops);
-- 5. Generated column
ALTER TABLE "posts" ADD COLUMN "search" tsvector
  GENERATED ALWAYS AS (to_tsvector('simple', coalesce("title", ''))) STORED;</code></pre>
<pre><code class="language-bash"><span class="tok-comment"># Migration sinh ra KẾ TIẾP sẽ làm gì với chúng?</span>
npx prisma migrate diff --from-schema-datasource prisma/schema.prisma \\
                        --to-schema-datamodel prisma/schema.prisma --script
<span class="tok-comment"># Và nội soi mang về được gì?</span>
npx prisma db pull --print</code></pre>
<div class="out">-- DropIndex
DROP INDEX "posts_title_trgm";
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "search";

// *** WARNING ***
// These fields are not supported by Prisma Client, because Prisma currently does not support their types:
//   - Model: "Post", field: "search", original data type: "tsvector"
// These constraints are not supported by Prisma Client, because Prisma currently does not fully support check constraints. Read more: https://pris.ly/d/check-constraints
//   - Model: "Post", constraint: "posts_title_khong_rong"
// These indexes are not supported by Prisma Client, because Prisma currently does not fully support expression indexes. Read more: https://pris.ly/d/expression-indexes
//   - Model: "User", constraint: "users_email_lower_key"
model Post {
  id       Int                      @id @default(autoincrement())
  title    String
  body     String?
  authorId Int                      @map("author_id")
  slug     String                   @unique
  search   Unsupported("tsvector")? @default(dbgenerated("to_tsvector('simple'::regconfig, COALESCE(title, ''::text))"))
  author   User                     @relation(fields: [authorId], references: [id])
  @@index([title(ops: raw("gin_trgm_ops"))], map: "posts_title_trgm", type: Gin)
  @@map("posts")
}</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Một số SẼ bị xoá</span><span class="v">Chỉ mục trigram và cột sinh ra <code>search</code> là thứ Prisma nhìn thấy mà lược đồ không có, nên migration sinh ra kế tiếp sẽ xoá chúng — lặng lẽ, như mọi diff khác. Hãy khai chúng đúng như <code>db pull</code> in ra (bên dưới): <code>@@index([title(ops: raw("gin_trgm_ops"))], map: "posts_title_trgm", type: Gin)</code> và dòng <code>search</code> <em>kèm cả</em> <code>@default(dbgenerated(…))</code> của nó. Đã thử: có đủ hai dòng thì diff rỗng; bỏ phần default thì nó vẫn đòi <code>ALTER COLUMN "search" DROP DEFAULT</code>.</span></div>
  <div class="kv"><span class="k">Một số được để yên</span><span class="v">Partial index, chỉ mục biểu thức và ràng buộc <code>CHECK</code> không xuất hiện trong diff: Prisma không quản lý chúng, nên cũng không xoá chúng.</span></div>
  <div class="kv"><span class="k"><code>db pull</code>: quay lại, được cảnh báo, hoặc mất trắng</span><span class="v">Quay lại: chỉ mục trigram cùng operator class, <code>search</code> ở dạng <code>Unsupported("tsvector")</code>. Được cảnh báo: ràng buộc <code>CHECK</code> và chỉ mục biểu thức. Mất mà không một lời cảnh báo: partial index <code>posts_author_nhap_idx</code>.</span></div>
  <div class="kv"><span class="k">Nên hãy ghi lại</span><span class="v">Một dòng chú thích trong <code>schema.prisma</code> ngay cạnh model liên quan, nêu tên các đối tượng viết tay và migration đã tạo ra chúng. Hai dòng ấy cứu người sau một buổi chiều bối rối.</span></div>
</div>

<h3>Cái chỉ mục không được phép khoá bảng</h3>
<pre><code class="language-sql"><span class="tok-comment">-- Thứ Prisma sinh ra: khoá bảng suốt quá trình dựng</span>
CREATE INDEX "posts_author_id_idx" ON "posts"("author_id");

<span class="tok-comment">-- Thứ production cần: không khoá ghi, nhưng KHÔNG chạy được trong giao dịch</span>
CREATE INDEX CONCURRENTLY "posts_author_id_idx" ON "posts"("author_id");</code></pre>
<div class="out">-- 3.000.000 hàng; một câu INSERT gửi 0,5 s sau khi bắt đầu dựng chỉ mục
-- đo ngày 12/11/2026, laptop Apple silicon, PostgreSQL 16.14 trong Docker
== CREATE INDEX big_title_idx ON big (title)
   INSERT gửi sau 0,5 s: Time: 4084.357 ms (00:04.084)
   tạo chỉ mục: Time: 4709.089 ms (00:04.709)
== CREATE INDEX CONCURRENTLY big_title_idx ON big (title)
   INSERT gửi sau 0,5 s: Time: 3.067 ms
   tạo chỉ mục: Time: 5078.517 ms (00:05.079)</div>
<div class="callout warn">
<p><strong><code>CONCURRENTLY</code> không chạy được bên trong một khối giao dịch.</strong> Prisma gửi tệp migration cho PostgreSQL một lần, và PostgreSQL chạy một tệp nhiều câu như một giao dịch — nên kết quả tuỳ vào trong tệp còn có gì. Cả hai trường hợp, chạy thật:</p>
</div>
<div class="out">-- (a) CONCURRENTLY nằm cạnh một câu khác trong cùng tệp
ALTER TABLE "posts" ADD COLUMN "ghi_chu" TEXT;
CREATE INDEX CONCURRENTLY "posts_title_idx" ON "posts"("title");
$ npx prisma migrate deploy
Applying migration &#96;20261112000548_khoi_tao&#96;
Applying migration &#96;20261112066000_chi_muc_chung&#96;
Error: P3018
Database error code: 25001
ERROR: CREATE INDEX CONCURRENTLY cannot run inside a transaction block
   → applied_steps_count 0, và câu ALTER bên cạnh cũng bị lùi (không có cột ghi_chu)

-- (b) CONCURRENTLY đứng một mình trong tệp migration riêng
CREATE INDEX CONCURRENTLY "posts_title_idx" ON "posts"("title");
$ npx prisma migrate deploy
Applying migration &#96;20261112000548_khoi_tao&#96;
Applying migration &#96;20261112066000_chi_muc_rieng&#96;
All migrations have been successfully applied.
   → chỉ mục có mặt</div>
<div class="callout ok">
<p><strong>Vậy: một câu, một migration.</strong> Cho mỗi <code>CREATE INDEX CONCURRENTLY</code> một tệp migration riêng, không có gì khác trong đó. Nếu nó hỏng giữa chừng, nó có thể để lại một chỉ mục <code>INVALID</code> (tài liệu PostgreSQL) — hãy xoá chỉ mục đó rồi deploy lại.</p>
</div>

<h3>Một migration viết tay thực tế, có chú giải</h3>
<pre><code class="language-sql"><span class="tok-comment">-- prisma/migrations/20260823064500_them_xoa_mem/migration.sql</span>
<span class="tok-comment">-- Thêm xoá mềm cho posts. Viết tay vì bước 3 và 4,</span>
<span class="tok-comment">-- những thứ bộ sinh không diễn đạt được.</span>

<span class="tok-comment">-- 1. Bản thân cái cột (phần này Prisma cũng sinh ra được)</span>
ALTER TABLE "posts" ADD COLUMN "deleted_at" TIMESTAMPTZ(3);

<span class="tok-comment">-- 2. Đổ dữ liệu: các hàng vốn bị ẩn bằng cờ boolean cũ nay thành đã xoá mềm</span>
UPDATE "posts" SET "deleted_at" = "updated_at" WHERE "is_hidden" = true;

<span class="tok-comment">-- 3. Partial index để "bài còn sống của tác giả này" vẫn rẻ</span>
CREATE INDEX "posts_author_active_idx"
  ON "posts"("author_id") WHERE "deleted_at" IS NULL;

<span class="tok-comment">-- 4. Tính duy nhất giờ chỉ áp cho hàng còn sống, nên một slug dùng lại được</span>
DROP INDEX "posts_slug_key";
CREATE UNIQUE INDEX "posts_slug_active_key"
  ON "posts"("slug") WHERE "deleted_at" IS NULL;

<span class="tok-comment">-- 5. Cờ cũ KHÔNG bị xoá ở đây — xem phần nới–thu</span>
<span class="tok-comment">--    ở Bài 6.5. Nó nằm ở một migration thứ hai, sau khi deploy.</span></code></pre>
<div class="out">-- chạy trên một bảng thử: 1.000 bài, 100 bài is_hidden = true (12/11/2026, PostgreSQL 16.14)
ALTER TABLE · UPDATE 100 · CREATE INDEX · DROP INDEX · CREATE INDEX
 da_xoa_mem | count
        100 |  1000
INSERT (slug 'bai-10', đã bị xoá mềm)   → INSERT 0 1
INSERT (slug 'bai-11', vẫn còn sống)    → ERROR: duplicate key value violates unique constraint "posts_slug_active_key"</div>
<p>Một hệ quả cần tính trước: partial unique index không khai được trong lược đồ, nên ở đó trường mất <code>@unique</code> — và mất luôn <code>findUnique({ where: { slug } })</code>. Hãy dùng <code>findFirst</code> kèm <code>deletedAt: null</code>, và ghi chú chỉ mục cạnh model.</p>
<div class="note-ct">
<p><strong>Từ chính kho mã CuongThai.</strong> Kho này viết tay mọi migration mới, vì <code>migrate dev</code> hoàn toàn không chạy được (Bài 6.2). Chỉ dẫn của nó nêu rõ quy trình: tạo <code>prisma/migrations/&lt;mốc thời gian&gt;_&lt;tên&gt;/migration.sql</code>, áp dụng bằng <code>npx prisma migrate deploy</code>, và kiểm bằng một <code>migrate diff</code> mà output rỗng chính là bằng chứng không có trôi dạt. Hai trăm bốn mươi sáu migration sau (đếm ngày 12/11/2026), quy trình ấy vẫn đứng vững.</p>
<p>Điều đáng rút ra là một <code>migrate dev</code> hỏng không phải chuyện khẩn cấp. Nó lấy đi của bạn cái điểm khởi đầu được sinh ra và phép kiểm trôi dạt, mà <code>migrate diff</code> trả lại cả hai. Thứ nó lấy đi vĩnh viễn là bảo đảm rằng lịch sử phát lại được — nên một kho ở trạng thái này nên dựng một cơ sở dữ liệu sạch từ các migration của nó theo lịch, để bắt được cái migration không phát lại được kế tiếp trước khi nó là cái thứ hai.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/workflows/customizing-migrations" target="_blank" rel="noopener"><span class="lc-ico">✍️</span><span class="lc-body"><span class="lc-title">Customizing migrations</span><span class="lc-sub">prisma.io/docs · <code>--create-only</code>, sửa trước khi áp dụng, và trường hợp đổi tên nói đủ</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/workflows/unsupported-database-features" target="_blank" rel="noopener"><span class="lc-ico">🧩</span><span class="lc-body"><span class="lc-title">Unsupported database features</span><span class="lc-sub">prisma.io/docs · Giữ ràng buộc check, trigger và view sống qua các lần migration</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/sql-createindex.html" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — CREATE INDEX</span><span class="lc-sub">postgresql.org · <code>CONCURRENTLY</code>, partial index và chỉ mục theo biểu thức, lấy từ nguồn gốc</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — PostgreSQL, chương DDL</span><span class="lc-sub">Mỗi dạng ALTER TABLE khoá gì và khoá bao lâu — những sự thật đứng sau mọi lựa chọn ở đây</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Biến bốn migration sinh ra thành bản viết tay an toàn, gồm cả một lần đổi tên và một NOT NULL</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 6.4 ─────────────────────────── */
    {
      title: '6.4 — Drift, and adopting a database that exists|||6.4 — Trôi dạt, và tiếp quản cơ sở dữ liệu có sẵn',
      slug: 'pr-6-4-troi-dat',
      type: 'LESSON',
      description: 'Trôi dạt là gì, bốn nguồn sinh ra nó, cách phát hiện bằng migrate diff mà không đụng gì, ba cách xử lý theo mức độ nguy hiểm, và quy trình dựng nền đầy đủ để đưa Prisma vào một cơ sở dữ liệu đã chạy production nhiều năm.',
      content: `
${G06_4}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>Drift, and adopting a database that exists</h2>
<p class="lead">Drift is the word for "the database is not what the migration history says it is". It is not an error state — it is a discovery, and how you respond decides whether you keep a usable history or quietly destroy production data. This lesson covers detecting it safely, the three responses in order of danger, and the related problem of adopting Prisma into a database that predates it.</p>

<h3>Where drift comes from</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Someone ran SQL by hand</span><span class="lz-lnote">A hotfix in <code>psql</code> at two in the morning that nobody wrote a migration for. The most common source, and usually the most benign — the change is real and needed, it just is not recorded.</span></div>
  <div class="lz-layer"><span class="lz-lname">Someone ran <code>db push</code></span><span class="lz-lnote">It modifies the database and writes no migration. A developer who does this locally has a database that no migration history describes; do it against a shared environment and everyone else inherits the problem.</span></div>
  <div class="lz-layer"><span class="lz-lname">A migration failed part-way</span><span class="lz-lnote">Some statements applied, some did not, and <code>_prisma_migrations</code> records the attempt as unfinished. The database is now in a state no migration describes. This is <code>P3009</code>, and Lesson 6.5 has the protocol.</span></div>
  <div class="lz-layer"><span class="lz-lname">Another system owns part of the schema</span><span class="lz-lnote">A monitoring tool creating its own tables, a legacy service with its own migrations, a DBA managing partitions. Permanent, expected drift — the answer is <code>@@ignore</code> and a separate schema, not a fight.</span></div>
</div>

<h3>Detecting it, without touching anything</h3>
<pre><code class="language-bash"><span class="tok-comment"># The hotfix, typed straight into psql — no migration</span>
ALTER TABLE posts ADD COLUMN ghi_chu_tam TEXT;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX posts_title_trgm ON posts USING gin (title gin_trgm_ops);

<span class="tok-comment"># Does the live database match my schema file?</span>
npx prisma migrate diff \\
  --from-schema-datasource prisma/schema.prisma \\
  --to-schema-datamodel   prisma/schema.prisma \\
  --script</code></pre>
<div class="out">-- measured 12 Nov 2026 · Prisma 6.19.3 · PostgreSQL 16.14
phat-hien</div>
<div class="callout warn">
<p><strong>Read that output the right way round.</strong> It is <em>the SQL that would make the database match the schema</em> — so every <code>DROP</code> names something the database has and your schema does not: here the column and the trigram index from the hotfix. Neither is necessarily wrong. The question is which one is telling the truth.</p>
</div>
<pre><code class="language-bash"><span class="tok-comment"># The other question: does the live database match my MIGRATIONS? (replays them on the shadow)</span>
npx prisma migrate diff \\
  --from-migrations       ./prisma/migrations \\
  --to-schema-datasource  prisma/schema.prisma \\
  --shadow-database-url   "$SHADOW_DATABASE_URL" \\
  --script</code></pre>
<div class="out">phat-hien-lichsu</div>
<p>Same drift, opposite sign: from the history to the live database, so it lists what the database has <em>beyond</em> its migrations — <code>ADD</code>, not <code>DROP</code>.</p>
<pre><code class="language-bash"><span class="tok-comment"># Which command notices? Same drifted database, two commands</span>
npx prisma migrate status
npx prisma migrate dev --name thu</code></pre>
<div class="out">status

dev-troi</div>
<div class="pitfall">
<p><strong>Trap — <code>migrate status</code> does not see drift.</strong> It compares the migrations folder with <code>_prisma_migrations</code> and nothing else, so after the hotfix it still says "up to date". Only <code>migrate dev</code>, which replays the history on a shadow database, reports the drift — and then wants to reset. On production, where you will never run <code>migrate dev</code>, the two <code>migrate diff</code> commands above are the drift check.</p>
</div>

<h3>The three responses, in order of danger</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Adopt it</span><span class="lz-t">Safest, and usually right</span><span class="lz-d">The change in the database is one you want. Add it to <code>schema.prisma</code>, record it in a migration written with <code>IF NOT EXISTS</code>, and mark that migration applied. History and database now agree, and nothing was touched.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Undo it</span><span class="lz-t">Safe if you understand it</span><span class="lz-d">The change was a mistake. Write a normal forward migration that removes it, review it like any other, deploy it. Slower than option 3 and it leaves a record.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Reset</span><span class="lz-t">Destroys everything</span><span class="lz-d"><code>migrate reset</code> drops the database and replays every migration. Correct on a local development database. <strong>Never on anything shared</strong>, and the CuongThai repository lists it as forbidden for exactly this reason — the prompt says "all data will be lost" and it means it literally.</span></div>
</div>
<pre><code class="language-typescript"><span class="tok-comment">// Option 1 — adopt. Step A: the schema must describe reality EXACTLY</span>
model Post {
  // …
  ghiChuTam String? @map("ghi_chu_tam")

  @@index([title(ops: raw("gin_trgm_ops"))], map: "posts_title_trgm", type: Gin)
  @@map("posts")
}</code></pre>
<div class="out">-- with only the name — @@index([title], map: "posts_title_trgm") — the diff is:
nhan-web
-- with ops + type: Gin, as above:
nhan-dung</div>
<div class="pitfall">
<p><strong>Trap — the index name is not enough.</strong> Without the operator class and <code>type: Gin</code>, Prisma reads a plain B-tree index on <code>title</code> and plans to drop the GIN index and build a different one — on a big table, a slow build that also removes the fast search. Keep editing the schema until the diff is empty; only then is it describing reality.</p>
</div>
<pre><code class="language-sql"><span class="tok-comment">-- Step B: prisma/migrations/20261112070000_ghi_nhan_troi/migration.sql</span>
-- Records the column + index added by hand on 12 Nov 2026. Where they exist,
-- this is marked --applied; on a clean database it really creates them.
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "ghi_chu_tam" TEXT;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS "posts_title_trgm" ON "posts" USING gin ("title" gin_trgm_ops);</code></pre>
<pre><code class="language-bash"><span class="tok-comment"># Step C: mark it applied where the objects already exist, then verify</span>
npx prisma migrate resolve --applied 20261112070000_ghi_nhan_troi
npx prisma migrate diff --from-schema-datasource prisma/schema.prisma \\
                        --to-schema-datamodel prisma/schema.prisma --script
npx prisma migrate status</code></pre>
<div class="out">nhan-resolve

-- and a CLEAN database built from the same history:
$ npx prisma migrate deploy
</div>
<div class="callout ok">
<p><strong><code>IF NOT EXISTS</code> is what makes that migration honest.</strong> It is a no-op where the column and index already exist and a real creation on any fresh database built from the history — so the history replays again. That is the goal of adopting: not to change the database, but to make the record true.</p>
</div>

<h3>Adopting a database that predates Prisma</h3>
<p>The same machinery solves a bigger problem: a production database that has existed for years, has no migration history, and now needs one. Five steps, in order.</p>
<pre><code class="language-bash"><span class="tok-comment"># 1 — Introspect: write a schema that describes what is actually there</span>
<span class="tok-comment">#     (demo: two tables and 20,000 orders created by plain SQL, one CHECK constraint)</span>
npx prisma db pull</code></pre>
<div class="out">-- measured 12 Nov 2026 · Prisma 6.19.3 · PostgreSQL 16.14
b-pull

model don_hang {
  id                                            Int         @id @default(autoincrement())
  khach_hang_id                                 Int
  nguoi_giao_id                                 Int?
  tong                                          Decimal     @db.Decimal(12, 2)
  trang_thai                                    String      @default("moi") @db.VarChar(20)
  khach_hang_don_hang_khach_hang_idTokhach_hang khach_hang  @relation("don_hang_khach_hang_idTokhach_hang", fields: [khach_hang_id], references: [id], onDelete: NoAction, onUpdate: NoAction)
  khach_hang_don_hang_nguoi_giao_idTokhach_hang khach_hang? @relation("don_hang_nguoi_giao_idTokhach_hang", fields: [nguoi_giao_id], references: [id], onDelete: NoAction, onUpdate: NoAction)

  @@index([khach_hang_id], map: "don_hang_khach_idx")
}</div>
<pre><code class="language-bash"><span class="tok-comment"># 2 — Rename by hand: add @map / @@map, name the relations, fix the types.</span>
<span class="tok-comment">#     This is the slow part, and it is worth doing properly — every</span>
<span class="tok-comment">#     subsequent db pull preserves what you write here.</span>
npx prisma format
npx prisma validate</code></pre>
<pre><code class="language-bash"><span class="tok-comment"># 3 — Generate a baseline migration from nothing to the current schema</span>
mkdir -p prisma/migrations/0_init
npx prisma migrate diff \\
  --from-empty \\
  --to-schema-datamodel prisma/schema.prisma \\
  --script &gt; prisma/migrations/0_init/migration.sql
wc -l prisma/migrations/0_init/migration.sql
npx prisma migrate status</code></pre>
<div class="out">b-init

b-status-truoc      ← exit code 1</div>
<pre><code class="language-bash"><span class="tok-comment"># 4 — Mark it applied. This does NOT run the SQL — the tables already exist.</span>
npx prisma migrate resolve --applied 0_init

<span class="tok-comment"># 5 — Verify: empty diff means the baseline matches what Prisma can see</span>
npx prisma migrate diff --from-schema-datasource prisma/schema.prisma \\
                        --to-schema-datamodel prisma/schema.prisma --script
npx prisma migrate status</code></pre>
<div class="out">b-resolve</div>
<div class="pitfall">
<p><strong>Trap — the baseline only contains what Prisma models.</strong> The legacy table has <code>CHECK (tong &gt;= 0)</code>; <code>db pull</code> warned about it, and <code>0_init</code> does not contain it. The live database keeps the rule, but any database rebuilt from this history — CI, a new developer, a restore — silently lacks it. The same goes for partial and expression indexes, triggers and RLS policies. Compare a schema-only dump of the old database with a database built from <code>0_init</code>, and add what is missing to <code>0_init</code> by hand before you commit it.</p>
</div>

<div class="kv-grid">
  <div class="kv"><span class="k">Step 4 is the whole trick</span><span class="v"><code>--applied</code> writes a row into <code>_prisma_migrations</code> without executing anything. It is how you tell Prisma "this migration describes a state the database is already in".</span></div>
  <div class="kv"><span class="k">Do it in every environment</span><span class="v">Local, staging, production — each needs its own <code>migrate resolve --applied 0_init</code>. Miss one and the next deploy there tries to <code>CREATE TABLE</code> on tables that exist.</span></div>
  <div class="kv"><span class="k">The baseline is not the real history</span><span class="v"><code>0_init</code> is a snapshot, not a record of how the database got there. That is fine and it is the standard practice — the point of the baseline is to make every migration <em>after</em> it meaningful.</span></div>
  <div class="kv"><span class="k">Spend the time on step 2</span><span class="v">The introspected schema is machine-named: <code>users</code> not <code>User</code>, <code>created_at</code> not <code>createdAt</code>, a relation field called <code>khach_hang_don_hang_khach_hang_idTokhach_hang</code> (from the demo above). Fixing it once is a day; living with it is every day.</span></div>
</div>
<div class="note-ct">
<p><strong>From the CuongThai codebase.</strong> The first entry in this repository's migration folder is <code>0_init</code> — exactly the baseline described above, created when Prisma was adopted into a database that already had tables and data. The 246 migrations after it (counted 12 Nov 2026) are the real history; <code>0_init</code> is the line drawn under everything before.</p>
</div>

<h3>Drift you should keep</h3>
<pre><code class="language-typescript"><span class="tok-comment">// A table another system owns: tell Prisma to leave it alone</span>
/// Managed by the analytics pipeline. Do not migrate.
model events_raw {
  id   BigInt   @id
  ts   DateTime
  data Json

  @@ignore
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>@@ignore</code> on the model</span><span class="v">The table disappears from the client, and <code>migrate diff</code> against a database that has it stays empty (without the model it would print <code>DROP TABLE "events_raw"</code>). But the model is still part of the migration schema: on a database <em>without</em> the table, the diff prints <code>CREATE TABLE "events_raw"</code>. Ignored by the client, not by migrations.</span></div>
  <div class="kv"><span class="k">A separate PostgreSQL schema</span><span class="v">Cleaner still: put the other system's tables in their own PostgreSQL schema. Prisma looks only at the schema in its connection URL (<code>public</code> by default) — tested: a table in schema <code>phan_tich</code> did not appear in <code>migrate diff</code> at all. (If you use Prisma's <code>schemas</code> list, just do not list that one.)</span></div>
  <div class="kv"><span class="k">A separate database user</span><span class="v">Belt and braces: give the Prisma user no permission on those tables. Then a mistaken migration cannot touch them even if someone writes one.</span></div>
</div>

<h3>The one command to never run without thinking</h3>
<pre><code class="language-bash">npx prisma migrate reset            <span class="tok-comment"># asks for confirmation; --force skips it</span></code></pre>
<div class="out">-- not run in this course. This is what migrate dev printed on the drifted database above:
We need to reset the "public" schema at "127.0.0.1:55491"
You may use prisma migrate reset to drop the development database.
All data will be lost.</div>
<div class="pitfall">
<p><strong>Trap — <code>migrate reset</code> is the right tool with the wrong <code>DATABASE_URL</code>.</strong> It drops every table and replays the history from scratch. On your development database that is a useful thirty-second operation. Pointed at staging it destroys the test data; pointed at production it is an outage and a restore from backup. The confirmation prompt is the only guard, one keystroke away — and <code>--force</code> removes even that.</p>
<p>Two habits make it safe. Keep production credentials out of every local <code>.env</code>, so the URL is simply not available to type against. And echo the target before destructive commands: <code>node -e "console.log(process.env.DATABASE_URL)"</code> takes two seconds and has saved more databases than any policy document.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/workflows/patching-and-hotfixing" target="_blank" rel="noopener"><span class="lc-ico">🩹</span><span class="lc-body"><span class="lc-title">Patching and hotfixing</span><span class="lc-sub">prisma.io/docs · Prisma's own guidance for a hand-edited production database</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/getting-started#adding-prisma-migrate-to-an-existing-project" target="_blank" rel="noopener"><span class="lc-ico">🏗️</span><span class="lc-body"><span class="lc-title">Baselining an existing database</span><span class="lc-sub">prisma.io/docs · The five steps above, in the official form</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/introspection" target="_blank" rel="noopener"><span class="lc-ico">🔎</span><span class="lc-body"><span class="lc-title">Introspection</span><span class="lc-sub">prisma.io/docs · What <code>db pull</code> can and cannot recover, and how it preserves your renames</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">CuongThai course — PostgreSQL, schemas chapter</span><span class="lc-sub">Namespaces and permissions — the structural way to keep two systems out of each other's tables</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Baseline a database with existing tables, then adopt three drifted objects into the history</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.4</span>
<h2>Trôi dạt, và tiếp quản cơ sở dữ liệu có sẵn</h2>
<p class="lead">Trôi dạt là từ để chỉ "cơ sở dữ liệu không đúng như lịch sử migration nói". Nó không phải một trạng thái lỗi — nó là một phát hiện, và cách bạn phản ứng quyết định bạn giữ được một lịch sử dùng được hay âm thầm phá dữ liệu production. Bài này nói cách phát hiện an toàn, ba cách phản ứng xếp theo mức nguy hiểm, và bài toán họ hàng: đưa Prisma vào một cơ sở dữ liệu có trước nó.</p>

<h3>Trôi dạt đến từ đâu</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Có người chạy SQL bằng tay</span><span class="lz-lnote">Một bản vá nóng trong <code>psql</code> lúc hai giờ sáng mà không ai viết migration cho. Nguồn phổ biến nhất, và thường cũng lành nhất — thay đổi ấy là thật và cần thiết, chỉ là không được ghi lại.</span></div>
  <div class="lz-layer"><span class="lz-lname">Có người chạy <code>db push</code></span><span class="lz-lnote">Nó đổi cơ sở dữ liệu và không viết migration nào. Một lập trình viên làm thế ở máy mình sẽ có một cơ sở dữ liệu mà không lịch sử migration nào mô tả; làm thế với một môi trường dùng chung thì mọi người khác thừa hưởng vấn đề.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một migration hỏng giữa chừng</span><span class="lz-lnote">Vài câu lệnh đã áp dụng, vài câu chưa, và <code>_prisma_migrations</code> ghi lại lần thử ấy là chưa xong. Cơ sở dữ liệu giờ ở một trạng thái không migration nào mô tả. Đây là <code>P3009</code>, và Bài 6.5 có giao thức xử lý.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một hệ thống khác sở hữu một phần lược đồ</span><span class="lz-lnote">Một công cụ giám sát tự tạo bảng của nó, một dịch vụ cũ có migration riêng, một DBA quản lý phân vùng. Trôi dạt vĩnh viễn và được mong đợi — câu trả lời là <code>@@ignore</code> và một schema riêng, không phải một cuộc đấu.</span></div>
</div>

<h3>Phát hiện nó mà không đụng vào gì</h3>
<pre><code class="language-bash"><span class="tok-comment"># Bản vá nóng, gõ thẳng vào psql — không migration nào</span>
ALTER TABLE posts ADD COLUMN ghi_chu_tam TEXT;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX posts_title_trgm ON posts USING gin (title gin_trgm_ops);

<span class="tok-comment"># Cơ sở dữ liệu đang sống có khớp tệp lược đồ của tôi không?</span>
npx prisma migrate diff \\
  --from-schema-datasource prisma/schema.prisma \\
  --to-schema-datamodel   prisma/schema.prisma \\
  --script</code></pre>
<div class="out">-- đo ngày 12/11/2026 · Prisma 6.19.3 · PostgreSQL 16.14
phat-hien</div>
<div class="callout warn">
<p><strong>Đọc output đó cho đúng chiều.</strong> Nó là <em>đoạn SQL sẽ làm cơ sở dữ liệu khớp với lược đồ</em> — nên mỗi chữ <code>DROP</code> gọi tên một thứ cơ sở dữ liệu có mà lược đồ của bạn không có: ở đây là cột và chỉ mục trigram từ bản vá nóng. Không cái nào nhất thiết là sai. Câu hỏi là bên nào đang nói thật.</p>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Câu hỏi còn lại: cơ sở dữ liệu đang sống có khớp các MIGRATION của tôi không? (phát lại chúng lên shadow)</span>
npx prisma migrate diff \\
  --from-migrations       ./prisma/migrations \\
  --to-schema-datasource  prisma/schema.prisma \\
  --shadow-database-url   "$SHADOW_DATABASE_URL" \\
  --script</code></pre>
<div class="out">phat-hien-lichsu</div>
<p>Cùng một trôi dạt, ngược dấu: từ lịch sử tới cơ sở dữ liệu đang sống, nên nó liệt kê những gì cơ sở dữ liệu có <em>vượt ra ngoài</em> các migration — <code>ADD</code>, không phải <code>DROP</code>.</p>
<pre><code class="language-bash"><span class="tok-comment"># Lệnh nào nhận ra? Cùng một cơ sở dữ liệu đã trôi, hai câu lệnh</span>
npx prisma migrate status
npx prisma migrate dev --name thu</code></pre>
<div class="out">status

dev-troi</div>
<div class="pitfall">
<p><strong>Bẫy — <code>migrate status</code> không thấy trôi dạt.</strong> Nó chỉ so thư mục migration với <code>_prisma_migrations</code>, nên sau bản vá nóng nó vẫn báo "up to date". Chỉ <code>migrate dev</code>, vốn phát lại lịch sử lên một shadow database, mới báo trôi dạt — rồi đòi reset. Trên production, nơi bạn không bao giờ chạy <code>migrate dev</code>, hai câu <code>migrate diff</code> ở trên mới là phép kiểm trôi dạt.</p>
</div>

<h3>Ba cách phản ứng, xếp theo mức nguy hiểm</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Nhận nuôi nó</span><span class="lz-t">An toàn nhất, và thường là đúng</span><span class="lz-d">Thay đổi dưới cơ sở dữ liệu là thứ bạn muốn giữ. Thêm nó vào <code>schema.prisma</code>, ghi nhận nó trong một migration viết bằng <code>IF NOT EXISTS</code>, rồi đánh dấu migration đó là đã áp dụng. Lịch sử và cơ sở dữ liệu giờ đồng ý với nhau, và không thứ gì bị đụng tới.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Gỡ bỏ nó</span><span class="lz-t">An toàn nếu bạn hiểu nó</span><span class="lz-d">Thay đổi đó là một sai lầm. Hãy viết một migration tiến bình thường để gỡ nó, review như mọi cái khác, rồi deploy. Chậm hơn cách 3 và nó để lại một bản ghi.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Reset</span><span class="lz-t">Phá sạch mọi thứ</span><span class="lz-d"><code>migrate reset</code> xoá cơ sở dữ liệu rồi phát lại mọi migration. Đúng trên một cơ sở dữ liệu phát triển ở máy. <strong>Không bao giờ trên thứ gì dùng chung</strong>, và kho mã CuongThai liệt nó vào nhóm cấm đúng vì lý do này — câu hỏi nói "mọi dữ liệu sẽ mất" và nó nói theo nghĩa đen.</span></div>
</div>
<pre><code class="language-typescript"><span class="tok-comment">// Cách 1 — nhận nuôi. Bước A: lược đồ phải mô tả thực tại CHÍNH XÁC</span>
model Post {
  // …
  ghiChuTam String? @map("ghi_chu_tam")

  @@index([title(ops: raw("gin_trgm_ops"))], map: "posts_title_trgm", type: Gin)
  @@map("posts")
}</code></pre>
<div class="out">-- chỉ có cái tên — @@index([title], map: "posts_title_trgm") — diff ra:
nhan-web
-- có ops + type: Gin, như trên:
nhan-dung</div>
<div class="pitfall">
<p><strong>Bẫy — chỉ cái tên chỉ mục là chưa đủ.</strong> Thiếu operator class và <code>type: Gin</code>, Prisma đọc ra một chỉ mục B-tree thường trên <code>title</code> và lên kế hoạch xoá chỉ mục GIN để dựng một cái khác — trên bảng lớn, đó là một lần dựng chậm và còn mất luôn tìm kiếm nhanh. Cứ sửa lược đồ cho tới khi diff rỗng; lúc đó nó mới mô tả đúng thực tại.</p>
</div>
<pre><code class="language-sql"><span class="tok-comment">-- Bước B: prisma/migrations/20261112070000_ghi_nhan_troi/migration.sql</span>
-- Records the column + index added by hand on 12 Nov 2026. Where they exist,
-- this is marked --applied; on a clean database it really creates them.
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "ghi_chu_tam" TEXT;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS "posts_title_trgm" ON "posts" USING gin ("title" gin_trgm_ops);</code></pre>
<pre><code class="language-bash"><span class="tok-comment"># Bước C: đánh dấu đã áp dụng ở nơi các đối tượng vốn đã có, rồi kiểm lại</span>
npx prisma migrate resolve --applied 20261112070000_ghi_nhan_troi
npx prisma migrate diff --from-schema-datasource prisma/schema.prisma \\
                        --to-schema-datamodel prisma/schema.prisma --script
npx prisma migrate status</code></pre>
<div class="out">nhan-resolve

-- và một cơ sở dữ liệu SẠCH dựng từ cùng lịch sử:
$ npx prisma migrate deploy
</div>
<div class="callout ok">
<p><strong><code>IF NOT EXISTS</code> là thứ khiến migration đó trung thực.</strong> Nó là thao tác rỗng ở nơi cột và chỉ mục vốn đã có, và là một lần tạo thật trên bất kỳ cơ sở dữ liệu sạch nào dựng từ lịch sử — nhờ vậy lịch sử phát lại được trở lại. Đó mới là mục tiêu của việc nhận nuôi: không phải đổi cơ sở dữ liệu, mà làm cho bản ghi thành đúng sự thật.</p>
</div>

<h3>Tiếp quản một cơ sở dữ liệu có trước Prisma</h3>
<p>Cũng bộ máy ấy giải một bài toán lớn hơn: một cơ sở dữ liệu production tồn tại nhiều năm, không có lịch sử migration nào, và giờ cần có. Năm bước, theo thứ tự.</p>
<pre><code class="language-bash"><span class="tok-comment"># 1 — Nội soi: viết ra một lược đồ mô tả đúng những gì đang có</span>
<span class="tok-comment">#     (demo: hai bảng và 20.000 đơn hàng tạo bằng SQL thuần, một ràng buộc CHECK)</span>
npx prisma db pull</code></pre>
<div class="out">-- đo ngày 12/11/2026 · Prisma 6.19.3 · PostgreSQL 16.14
b-pull

model don_hang {
  id                                            Int         @id @default(autoincrement())
  khach_hang_id                                 Int
  nguoi_giao_id                                 Int?
  tong                                          Decimal     @db.Decimal(12, 2)
  trang_thai                                    String      @default("moi") @db.VarChar(20)
  khach_hang_don_hang_khach_hang_idTokhach_hang khach_hang  @relation("don_hang_khach_hang_idTokhach_hang", fields: [khach_hang_id], references: [id], onDelete: NoAction, onUpdate: NoAction)
  khach_hang_don_hang_nguoi_giao_idTokhach_hang khach_hang? @relation("don_hang_nguoi_giao_idTokhach_hang", fields: [nguoi_giao_id], references: [id], onDelete: NoAction, onUpdate: NoAction)

  @@index([khach_hang_id], map: "don_hang_khach_idx")
}</div>
<pre><code class="language-bash"><span class="tok-comment"># 2 — Đổi tên bằng tay: thêm @map / @@map, đặt tên quan hệ, sửa kiểu.</span>
<span class="tok-comment">#     Đây là phần chậm, và đáng làm cho tử tế — mọi lần db pull sau đó</span>
<span class="tok-comment">#     đều giữ nguyên những gì bạn viết ở đây.</span>
npx prisma format
npx prisma validate</code></pre>
<pre><code class="language-bash"><span class="tok-comment"># 3 — Sinh một migration nền, từ trống rỗng tới lược đồ hiện tại</span>
mkdir -p prisma/migrations/0_init
npx prisma migrate diff \\
  --from-empty \\
  --to-schema-datamodel prisma/schema.prisma \\
  --script &gt; prisma/migrations/0_init/migration.sql
wc -l prisma/migrations/0_init/migration.sql
npx prisma migrate status</code></pre>
<div class="out">b-init

b-status-truoc      ← thoát mã 1</div>
<pre><code class="language-bash"><span class="tok-comment"># 4 — Đánh dấu là đã áp dụng. Bước này KHÔNG chạy SQL — các bảng vốn đã có.</span>
npx prisma migrate resolve --applied 0_init

<span class="tok-comment"># 5 — Kiểm lại: chênh lệch rỗng nghĩa là migration nền khớp những gì Prisma nhìn thấy</span>
npx prisma migrate diff --from-schema-datasource prisma/schema.prisma \\
                        --to-schema-datamodel prisma/schema.prisma --script
npx prisma migrate status</code></pre>
<div class="out">b-resolve</div>
<div class="pitfall">
<p><strong>Bẫy — migration nền chỉ chứa những gì Prisma mô hình hoá.</strong> Bảng cũ có <code>CHECK (tong &gt;= 0)</code>; <code>db pull</code> đã cảnh báo về nó, và <code>0_init</code> không chứa nó. Cơ sở dữ liệu đang sống vẫn giữ luật đó, nhưng mọi cơ sở dữ liệu dựng lại từ lịch sử này — CI, một lập trình viên mới, một lần phục hồi — lặng lẽ thiếu nó. Partial index, chỉ mục biểu thức, trigger và chính sách RLS cũng vậy. Hãy so một bản dump chỉ-lược-đồ của cơ sở dữ liệu cũ với một cơ sở dữ liệu dựng từ <code>0_init</code>, và thêm tay phần còn thiếu vào <code>0_init</code> trước khi commit.</p>
</div>

<div class="kv-grid">
  <div class="kv"><span class="k">Bước 4 mới là toàn bộ mẹo</span><span class="v"><code>--applied</code> ghi một hàng vào <code>_prisma_migrations</code> mà không thực thi gì cả. Đó là cách bạn nói với Prisma "migration này mô tả một trạng thái mà cơ sở dữ liệu vốn đã ở trong đó".</span></div>
  <div class="kv"><span class="k">Làm ở MỌI môi trường</span><span class="v">Máy, staging, production — mỗi nơi cần một lần <code>migrate resolve --applied 0_init</code> riêng. Bỏ sót một nơi thì lần deploy kế tiếp ở đó sẽ thử <code>CREATE TABLE</code> lên những bảng đang tồn tại.</span></div>
  <div class="kv"><span class="k">Migration nền không phải lịch sử thật</span><span class="v"><code>0_init</code> là một bản chụp, không phải bản ghi cách cơ sở dữ liệu đi tới đó. Như thế là ổn và đó là thực hành chuẩn — điểm của migration nền là làm cho mọi migration <em>sau</em> nó trở nên có nghĩa.</span></div>
  <div class="kv"><span class="k">Hãy dành thời gian cho bước 2</span><span class="v">Lược đồ nội soi ra là do máy đặt tên: <code>users</code> chứ không phải <code>User</code>, <code>created_at</code> chứ không phải <code>createdAt</code>, một trường quan hệ tên <code>khach_hang_don_hang_khach_hang_idTokhach_hang</code> (lấy từ demo ở trên). Sửa một lần là mất một ngày; sống chung với nó là mất mỗi ngày.</span></div>
</div>
<div class="note-ct">
<p><strong>Từ chính kho mã CuongThai.</strong> Mục đầu tiên trong thư mục migration của kho này là <code>0_init</code> — đúng cái migration nền mô tả ở trên, tạo ra khi Prisma được đưa vào một cơ sở dữ liệu vốn đã có bảng và có dữ liệu. Hai trăm bốn mươi sáu migration sau nó (đếm ngày 12/11/2026) mới là lịch sử thật; <code>0_init</code> là cái gạch ngang kẻ dưới mọi thứ trước đó.</p>
</div>

<h3>Loại trôi dạt mà bạn nên giữ</h3>
<pre><code class="language-typescript"><span class="tok-comment">// Một bảng do hệ thống khác sở hữu: bảo Prisma để yên nó</span>
/// Do dường ống phân tích quản lý. Không migrate.
model events_raw {
  id   BigInt   @id
  ts   DateTime
  data Json

  @@ignore
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>@@ignore</code> trên model</span><span class="v">Bảng biến mất khỏi client, và <code>migrate diff</code> với một cơ sở dữ liệu đang có bảng đó thì rỗng (không có model thì nó in <code>DROP TABLE "events_raw"</code>). Nhưng model vẫn thuộc lược đồ của migration: trên một cơ sở dữ liệu <em>chưa có</em> bảng, diff in <code>CREATE TABLE "events_raw"</code>. Client bỏ qua nó, migration thì không.</span></div>
  <div class="kv"><span class="k">Một schema PostgreSQL riêng</span><span class="v">Sạch hơn nữa: đặt bảng của hệ thống kia vào một schema PostgreSQL riêng. Prisma chỉ nhìn schema trong URL kết nối của nó (mặc định <code>public</code>) — đã thử: một bảng trong schema <code>phan_tich</code> hoàn toàn không xuất hiện trong <code>migrate diff</code>. (Nếu bạn dùng danh sách <code>schemas</code> của Prisma thì đừng liệt kê schema đó.)</span></div>
  <div class="kv"><span class="k">Một tài khoản cơ sở dữ liệu riêng</span><span class="v">Chắc ăn hai lớp: không cấp cho tài khoản Prisma quyền nào trên những bảng đó. Khi ấy một migration nhầm cũng không đụng tới chúng được dù có người viết ra.</span></div>
</div>

<h3>Câu lệnh không bao giờ được gõ mà chưa nghĩ</h3>
<pre><code class="language-bash">npx prisma migrate reset            <span class="tok-comment"># hỏi xác nhận; --force bỏ qua câu hỏi</span></code></pre>
<div class="out">-- không chạy trong khoá này. Đây là điều migrate dev in ra trên cơ sở dữ liệu đã trôi ở trên:
We need to reset the "public" schema at "127.0.0.1:55491"
You may use prisma migrate reset to drop the development database.
All data will be lost.</div>
<div class="pitfall">
<p><strong>Bẫy — <code>migrate reset</code> là công cụ đúng đi với <code>DATABASE_URL</code> sai.</strong> Nó xoá mọi bảng rồi phát lại lịch sử từ đầu. Trên cơ sở dữ liệu phát triển của bạn thì đó là một thao tác ba mươi giây hữu ích. Trỏ vào staging thì nó phá dữ liệu thử; trỏ vào production thì đó là một sự cố cộng một lần phục hồi từ sao lưu. Câu hỏi xác nhận là hàng rào duy nhất, cách một cú gõ phím — và <code>--force</code> gỡ luôn cả nó.</p>
<p>Hai thói quen làm chuyện này an toàn. Giữ thông tin đăng nhập production ra khỏi mọi tệp <code>.env</code> ở máy, để cái URL ấy đơn giản là không có sẵn mà gõ. Và in ra cái đích trước những câu lệnh phá huỷ: <code>node -e "console.log(process.env.DATABASE_URL)"</code> tốn hai giây và đã cứu nhiều cơ sở dữ liệu hơn bất kỳ văn bản quy định nào.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/workflows/patching-and-hotfixing" target="_blank" rel="noopener"><span class="lc-ico">🩹</span><span class="lc-body"><span class="lc-title">Patching and hotfixing</span><span class="lc-sub">prisma.io/docs · Hướng dẫn của chính Prisma cho một cơ sở dữ liệu production bị sửa tay</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/getting-started#adding-prisma-migrate-to-an-existing-project" target="_blank" rel="noopener"><span class="lc-ico">🏗️</span><span class="lc-body"><span class="lc-title">Dựng nền cho cơ sở dữ liệu có sẵn</span><span class="lc-sub">prisma.io/docs · Năm bước ở trên, ở dạng chính thức</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/introspection" target="_blank" rel="noopener"><span class="lc-ico">🔎</span><span class="lc-body"><span class="lc-title">Introspection</span><span class="lc-sub">prisma.io/docs · <code>db pull</code> phục hồi được gì và không được gì, và nó giữ tên bạn đặt ra sao</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — PostgreSQL, chương schema</span><span class="lc-sub">Không gian tên và quyền — cách mang tính cấu trúc để giữ hai hệ thống khỏi bảng của nhau</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Dựng nền cho một cơ sở dữ liệu đã có bảng, rồi nhận nuôi ba đối tượng trôi dạt vào lịch sử</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 6.5 ─────────────────────────── */
    {
      title: '6.5 — Migrations in production|||6.5 — Migration trên production',
      slug: 'pr-6-5-tren-production',
      type: 'LESSON',
      description: 'Chạy migration ở đâu trong đường ống deploy, mẫu nới–thu để đổi lược đồ mà không có thời gian chết, mỗi câu ALTER TABLE khoá cái gì, tách đổ dữ liệu lớn ra khỏi migration, và giao thức đầy đủ khi một migration chết giữa chừng.',
      content: `
${G06_5}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.5</span>
<h2>Migrations in production</h2>
<p class="lead">A migration that works locally can still take production down, for three reasons that have nothing to do with the SQL being wrong: it locks a table for too long, it changes the schema out of step with the code that is deployed, or it fails half-way and blocks every deploy after it. This lesson covers all three, and ends with the recovery protocol.</p>

<h3>Where in the pipeline</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Build</span><span class="lz-t"><code>prisma generate</code></span><span class="lz-d">Inside the image build, before <code>tsc</code>. The generated client must exist for the TypeScript compile to pass.</span></div>
  <div class="lz-step"><span class="lz-k">Deploy step 1</span><span class="lz-t"><code>prisma migrate deploy</code></span><span class="lz-d">A separate step, before the new containers start. It must run <strong>exactly once</strong>, and the exit code must gate everything after it.</span></div>
  <div class="lz-step"><span class="lz-k">Deploy step 2</span><span class="lz-t">Start the new code</span><span class="lz-d">Only after migrations succeeded. If a migration fails, the old version keeps running against the old schema, which is the correct outcome.</span></div>
  <div class="lz-step"><span class="lz-k">Never</span><span class="lz-t">In the container entrypoint</span><span class="lz-d">Scale to three replicas and three containers run <code>migrate deploy</code> simultaneously. Prisma takes an advisory lock so they do not corrupt each other — run for real, the second of two simultaneous deploys waited for the whole migration, then found nothing to do. But a container that is waiting is not serving, and a slow migration multiplies into slow starts everywhere.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># A deploy step that fails loudly and does not proceed — run for real against
# a pending, a failing and a drifted database</span>
set -euo pipefail

echo "==&gt; migrate status (log only: it exits 1 while migrations are pending)"
npx prisma migrate status || true

echo "==&gt; migrate deploy"
npx prisma migrate deploy

echo "==&gt; migrate status (must now exit 0)"
npx prisma migrate status

echo "==&gt; verify no drift"
npx prisma migrate diff \\
  --from-schema-datasource prisma/schema.prisma \\
  --to-schema-datamodel   prisma/schema.prisma --exit-code &gt; /dev/null \\
  || { echo "DRIFT (or diff error) — not starting containers"; exit 1; }

echo "==&gt; start containers"</code></pre>
<div class="out">-- measured 12 Nov 2026, Apple-silicon laptop, PostgreSQL 16.14 in Docker, Prisma 6.19.3
-- (1) one new additive migration is pending
==&gt; migrate status (log only: …)
Following migration have not yet been applied:
20261112075000_them_tom_tat
==&gt; migrate deploy
Applying migration &#96;20261112075000_them_tom_tat&#96;
All migrations have been successfully applied.
==&gt; migrate status (must now exit 0)
Database schema is up to date!
==&gt; verify no drift
==&gt; start containers                                    ← script exit code 0

-- (2) the pending migration violates a CHECK constraint
==&gt; migrate deploy
Applying migration &#96;20261112071500_them_rang_buoc&#96;
Error: P3018
Database error code: 23514
ERROR: check constraint "orders_total_khong_am" of relation "orders" is violated by some row
                                                         ← script exit code 1, containers never start

-- (3) someone added a column by hand, outside any migration
==&gt; verify no drift
DRIFT (or diff error) — not starting containers          ← script exit code 1</div>
<div class="pitfall">
<p><strong>Trap — <code>migrate status</code> exits 1 whenever a migration is pending.</strong> Put a plain <code>npx prisma migrate status</code> first in a <code>set -e</code> script and, run for real, it stops right there on every deploy that carries a new migration — the one situation the script exists for — and never reaches <code>migrate deploy</code>. It also exits 1 while a failed migration is recorded, and 0 only when everything is applied. So before the deploy, status is a log line (<code>|| true</code>); after it, its exit code is a real gate.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>set -euo pipefail</code> is the load-bearing line</span><span class="v">Run without it, the same failing migration printed P3009 — and the script went on to print "start containers". With it, the first non-zero exit ends the deploy.</span></div>
  <div class="kv"><span class="k"><code>migrate diff --exit-code</code></span><span class="v">Exit code 0 = no difference, 2 = differences, 1 = error. Safer than searching the text for "empty migration", and still read-only.</span></div>
  <div class="kv"><span class="k">Check the running system too</span><span class="v">The CuongThai deploy script smoke-tests core routes after deploying and fails the deploy if any returns 404 — a green build proves nothing about a running system.</span></div>
</div>

<h3>What each statement locks</h3>
<pre><code class="language-sql"><span class="tok-comment">-- Each statement inside BEGIN … ROLLBACK, then ask pg_locks what it holds</span>
BEGIN;
ALTER TABLE posts ALTER COLUMN author_id TYPE bigint;
SELECT string_agg(mode, ', ' ORDER BY mode) FROM pg_locks
 WHERE relation = 'posts'::regclass AND pid = pg_backend_pid();
ROLLBACK;</code></pre>
<div class="out">-- measured 12 Nov 2026, Apple-silicon laptop, PostgreSQL 16.14 in Docker, Prisma 6.19.3
statement                       lock held on posts                       time, 1,000,000 rows
ADD COLUMN (nullable)           AccessExclusiveLock                      ~1 ms
ALTER COLUMN TYPE int → bigint  AccessExclusiveLock (+ ShareLock)        ~0.8 s — rewrites every row
SET NOT NULL                    AccessExclusiveLock                      ~0.16 s — scans every row
ADD CONSTRAINT … CHECK          AccessExclusiveLock                      scans every row
ADD CONSTRAINT … CHECK NOT VALID AccessExclusiveLock                     ~2 ms — no scan
VALIDATE CONSTRAINT             ShareUpdateExclusiveLock                 ~60 ms — reads and writes continue
ADD FOREIGN KEY                 ShareRowExclusiveLock (+ AccessShareLock) scans — blocks writes, not reads
CREATE INDEX                    ShareLock                                blocks writes, not reads</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Every <code>ALTER TABLE</code> takes ACCESS EXCLUSIVE — even the instant ones</span><span class="v"><code>ADD COLUMN</code> (nullable, or with a constant default on PostgreSQL 11+), <code>DROP COLUMN</code>, <code>RENAME</code> are metadata-only and hold it for about a millisecond. The lock is short, but it still has to be <em>acquired</em> — see the lock queue below.</span></div>
  <div class="kv"><span class="k">Rewrites and scans hold it for long — the dangerous ones</span><span class="v">Changing a column type rewrites every row; <code>SET NOT NULL</code> and <code>ADD CONSTRAINT … CHECK</code> scan every row. Adding a column with a <em>volatile</em> default such as <code>clock_timestamp()</code> also rewrites the table (PostgreSQL documentation). While they run, <em>every read and every write waits</em>.</span></div>
  <div class="kv"><span class="k">Lighter locks</span><span class="v"><code>VALIDATE CONSTRAINT</code> lets reads and writes continue. <code>CREATE INDEX</code> and <code>ADD FOREIGN KEY</code> block writes but not reads — <code>CREATE INDEX CONCURRENTLY</code> (Lesson 6.3) avoids even that.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># A: a 6-second read transaction on posts · B: ALTER TABLE posts ADD COLUMN … · C: read one row</span>
bash hang-doi.sh</code></pre>
<div class="out">-- measured 12 Nov 2026, Apple-silicon laptop, PostgreSQL 16.14 in Docker, Prisma 6.19.3
== no lock_timeout
pg_stat_activity at 2 s:
 pid  | state  |  wait   |                      query                      
------+--------+---------+------------------------------------------------
 1569 | active | Timeout | BEGIN; SELECT count(*) FROM posts WHERE id &lt; 1
 1575 | active | Lock    |  ALTER TABLE posts ADD COLUMN tam_1 TEXT;
 1584 | active | Lock    | SELECT title FROM posts WHERE id = 1
(3 rows)

B (ALTER TABLE, sent at 0.5 s): 5.6 s
C (one-row SELECT, sent at 1 s): 5.1 s
== B runs SET lock_timeout = '1s' first
pg_stat_activity at 2 s:
 pid  | state  |  wait   |                      query                      
------+--------+---------+------------------------------------------------
 1599 | active | Timeout | BEGIN; SELECT count(*) FROM posts WHERE id &lt; 1
(1 row)

B (ALTER TABLE, sent at 0.5 s): 1.2 s — ERROR:  canceling statement due to lock timeout
C (one-row SELECT, sent at 1 s): 0.6 s</div>
<div class="callout warn">
<p><strong>The hidden one: the lock queue.</strong> B needs ACCESS EXCLUSIVE and cannot get it while A reads, so it waits — and C, which only wanted one row, queues <em>behind B</em> and waited about five seconds. With <code>lock_timeout</code>, B gave up after one second and C went straight through. A waiting <code>ALTER</code> turns any long transaction into an outage on that table; fail fast and retry instead.</p>
</div>
<pre><code class="language-sql"><span class="tok-comment">-- prisma/migrations/20261112075000_them_tom_tat/migration.sql</span>
-- Fail fast instead of queueing behind a long transaction
SET lock_timeout = '1s';
ALTER TABLE "posts" ADD COLUMN "tom_tat" TEXT;</code></pre>
<div class="out">-- measured 12 Nov 2026, Apple-silicon laptop, PostgreSQL 16.14 in Docker, Prisma 6.19.3
-- attempt 1: another transaction is holding posts
$ npx prisma migrate deploy
Applying migration &#96;20261112075000_them_tom_tat&#96;
Error: P3018
Database error code: 55P03
ERROR: canceling statement due to lock timeout

-- the other transaction has finished: mark rolled back, run the SAME file again
$ npx prisma migrate resolve --rolled-back 20261112075000_them_tom_tat
Migration 20261112075000_them_tom_tat marked as rolled back.
$ npx prisma migrate deploy
Applying migration &#96;20261112075000_them_tom_tat&#96;
All migrations have been successfully applied.</div>
<p>A lock timeout is the friendliest failure there is: nothing was changed (the file rolled back whole), so marking it rolled back is the truth, and the same file succeeds once the long transaction is gone.</p>
<pre><code class="language-sql"><span class="tok-comment">-- The two-step forms that avoid a full-table lock</span>

<span class="tok-comment">-- CHECK constraint: validate separately, under a weaker lock
-- (1,000,000 rows: ADD … NOT VALID ~2 ms, VALIDATE ~60 ms with reads and writes still running)</span>
ALTER TABLE "orders" ADD CONSTRAINT "orders_total_khong_am"
  CHECK ("total" &gt;= 0) NOT VALID;
ALTER TABLE "orders" VALIDATE CONSTRAINT "orders_total_khong_am";

<span class="tok-comment">-- NOT NULL on PostgreSQL 12+: a validated CHECK lets it skip the scan
-- (SET NOT NULL: ~0.16 s scanning on its own, ~3 ms once the CHECK is validated)</span>
ALTER TABLE "posts" ADD CONSTRAINT "posts_slug_not_null"
  CHECK ("slug" IS NOT NULL) NOT VALID;
ALTER TABLE "posts" VALIDATE CONSTRAINT "posts_slug_not_null";
ALTER TABLE "posts" ALTER COLUMN "slug" SET NOT NULL;
ALTER TABLE "posts" DROP CONSTRAINT "posts_slug_not_null";</code></pre>

<h3>Expand–contract: changing a schema without downtime</h3>
<p>During any deploy, the old code and the new code both run for a while. So a schema change must be compatible with <em>both</em>, which means it cannot happen in one step. Renaming <code>full_name</code> to <code>ho_ten</code> takes three deploys:</p>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Deploy 1 · Expand</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Add the new column</span><span class="lz-nsub"><code>ADD COLUMN ho_ten TEXT</code>, nullable, plus a backfill. The old column stays. Old code keeps working; it has never heard of the new column.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Write to both</span><span class="lz-nsub">New code writes both columns and reads the old one. Both versions running at once are now consistent with each other.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Deploy 2 · Switch</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Read from the new column</span><span class="lz-nsub">Still writing both. At this point every row has a value in both columns and every running instance is on code that knows about both.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Deploy 3 · Contract</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Stop writing the old column</span><span class="lz-nsub">Code change only, no migration.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Then drop it</span><span class="lz-nsub"><code>DROP COLUMN full_name</code> — safe now, because nothing deployed refers to it. Days later, ideally, so a rollback is still possible in between.</span></div></div>
  </div>
</div>
<div class="callout warn">
<p><strong>Three deploys for one rename feels absurd until the first time you skip it.</strong> Drop the column in the same release that stops using it, and every request served by an old container between "migration applied" and "old containers stopped" throws — for as long as your rolling deploy takes. On a two-minute rollout that is two minutes of 500s. The same pattern applies to every destructive change: dropping a column, tightening a constraint, renaming a table, removing an enum value.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Additive changes are safe in one step</span><span class="v">A new nullable column, a new table, a new index. Old code ignores what it does not know about, so there is no window of incompatibility.</span></div>
  <div class="kv"><span class="k">Destructive changes need expand–contract</span><span class="v">Anything that removes or narrows: dropping, renaming, adding <code>NOT NULL</code>, tightening a type, removing an enum value.</span></div>
  <div class="kv"><span class="k">It also buys you a rollback</span><span class="v">With the old column still present, reverting the code is enough. Once it is dropped, rolling back means restoring data — which is the real reason to leave days between contract steps.</span></div>
</div>

<h3>Big backfills do not belong in a migration</h3>
<pre><code class="language-typescript"><span class="tok-comment">-- In a migration: fine for thousands of rows, an outage for millions</span>
UPDATE "posts" SET "slug" = … WHERE "slug" IS NULL;</code></pre>
<pre><code class="language-javascript"><span class="tok-comment">// As a separate script: batched, resumable, and it does not block the deploy</span>
for (;;) {
  const batch = await prisma.post.findMany({
    where:  { slug: null },
    select: { id: true, title: true },
    take:   1000,
  });
  if (batch.length === 0) break;

  await prisma.$transaction(
    batch.map((p) =&gt;
      prisma.post.update({ where: { id: p.id }, data: { slug: makeSlug(p.title, p.id) } }),
    ),
  );
  console.log('da xu ly', batch.length);
}</code></pre>
<div class="out">-- 20,388 posts with slug = null, batches of 1000 (run for real)
da xu ly 1000
da xu ly 1000
… 21 batches in all, the last one 388 rows
slug still null afterwards: 0 of 20388</div>
<p>The split is: <strong>the migration changes the shape, a script moves the data.</strong> The migration adds the nullable column and takes milliseconds; the script fills it over an hour while the site stays up; a later migration adds the <code>NOT NULL</code> once the script has finished. Three small safe steps instead of one long dangerous one.</p>

<h3>When a migration fails half-way</h3>
<pre><code class="language-sql"><span class="tok-comment">-- prisma/migrations/20261112071500_them_rang_buoc/migration.sql — 100 of 100,000 orders have a negative total</span>
-- 1. A harmless statement
ALTER TABLE "orders" ADD COLUMN "ghi_chu" TEXT;
-- 2. A constraint the real data violates
ALTER TABLE "orders" ADD CONSTRAINT "orders_total_khong_am" CHECK ("total" &gt;= 0);</code></pre>
<pre><code class="language-bash">npx prisma migrate deploy   <span class="tok-comment"># first attempt</span>
npx prisma migrate deploy   <span class="tok-comment"># every attempt after it</span></code></pre>
<div class="out">-- measured 12 Nov 2026, Apple-silicon laptop, PostgreSQL 16.14 in Docker, Prisma 6.19.3
Applying migration &#96;20261112071500_them_rang_buoc&#96;
Error: P3018
A migration failed to apply. New migrations cannot be applied before the error is recovered from.
Migration name: 20261112071500_them_rang_buoc
Database error code: 23514
ERROR: check constraint "orders_total_khong_am" of relation "orders" is violated by some row

Error: P3009
migrate found failed migrations in the target database, new migrations will not be applied.
The &#96;20261112071500_them_rang_buoc&#96; migration started at 2026-11-12 00:10:35.277589 UTC failed</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · Stop. Do not run anything that changes state.</span><span class="lz-lnote">Not <code>migrate resolve</code>, not <code>migrate reset</code>, not a quick fix in <code>psql</code>. First make the state known.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · Find out what actually changed — in the database</span><span class="lz-lnote">On PostgreSQL, Prisma sends the whole <code>migration.sql</code> at once and PostgreSQL runs it as one transaction, so a failure normally rolls back <em>every</em> statement in the file. <code>applied_steps_count</code> counts files, not statements: 0 here. Look at the objects themselves. A part <em>can</em> survive when the file contains its own <code>COMMIT</code>, when a statement cannot run inside a transaction, or on MySQL, which has no transactional DDL.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · Fix the cause, then take one of three tested paths</span><span class="lz-lnote">A — repair the data and re-run the same file. B — edit the failed file, only if it never applied anywhere. C — finish by hand and record it. Each is shown below with its real output. A human decides; a human verifies with <code>migrate status</code> and <code>migrate diff</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · Not: "fix it in a new migration"</span><span class="lz-lnote">After <code>--rolled-back</code>, deploy retries the failed file <em>first</em>. A newer fixing migration placed after it never gets its turn — tested below.</span></div>
</div>
<pre><code class="language-sql"><span class="tok-comment">-- Step 2: what the record says, and what the database has</span>
SELECT migration_name, finished_at, rolled_back_at, applied_steps_count FROM _prisma_migrations;
\\d orders
SELECT count(*) FROM orders WHERE total &lt; 0;</code></pre>
<div class="out">        migration_name         | finished_at | rolled_back_at | applied_steps_count
-------------------------------+-------------+----------------+---------------------
 20261112001026_khoi_tao       | 2026-11-12… |                |                   1
 20261112071500_them_rang_buoc |             |                |                   0

 Column |  Type   | Nullable          ← no ghi_chu: the ALTER in the same file was rolled back too
 id     | integer | not null
 total  | integer | not null

 count: 100                         ← the rows that broke the CHECK</div>
<h4>Path A — repair the data, then re-run the same file</h4>
<pre><code class="language-bash">psql "$DATABASE_URL" -c 'UPDATE orders SET total = 0 WHERE total &lt; 0'
npx prisma migrate resolve --rolled-back 20261112071500_them_rang_buoc
npx prisma migrate deploy
npx prisma migrate status
npx prisma migrate diff --from-schema-datasource prisma/schema.prisma \\
  --to-schema-datamodel prisma/schema.prisma --exit-code</code></pre>
<div class="out">UPDATE 100
Migration 20261112071500_them_rang_buoc marked as rolled back.
Applying migration &#96;20261112071500_them_rang_buoc&#96;
All migrations have been successfully applied.
Database schema is up to date!          ← status exit code 0
                                        ← diff exit code 0</div>
<p>The right path when the SQL is right and the data is wrong. No file changes, so every environment keeps the same history. The data repair itself is a production change — record it with the incident.</p>
<h4>Path B — edit the failed file, then re-run</h4>
<pre><code class="language-sql"><span class="tok-comment">-- the same migration.sql, edited</span>
-- Fix the data first, then add the constraint
UPDATE "orders" SET "total" = 0 WHERE "total" &lt; 0;
ALTER TABLE "orders" ADD CONSTRAINT "orders_total_khong_am" CHECK ("total" &gt;= 0);</code></pre>
<div class="out">$ npx prisma migrate resolve --rolled-back 20261112071500_them_rang_buoc
Migration 20261112071500_them_rang_buoc marked as rolled back.
$ npx prisma migrate deploy
Applying migration &#96;20261112071500_them_rang_buoc&#96;
All migrations have been successfully applied.
        migration_name         | xong | da_lui
 20261112071500_them_rang_buoc | f    | t        ← every attempt stays in the table
 20261112071500_them_rang_buoc | t    | f</div>
<p>Allowed only because this file never applied successfully <em>anywhere</em>. If staging or a teammate already ran the old version, they keep it, and <code>migrate dev</code> there will ask to reset (Lesson 6.1) — use path A or C instead.</p>
<h4>Path C — finish by hand, then record it</h4>
<pre><code class="language-sql">-- "finish by hand": repair the rows, then run what the failed file meant to do
UPDATE "orders" SET "total" = 0 WHERE "total" &lt; 0;
ALTER TABLE "orders" ADD COLUMN "ghi_chu" TEXT;
ALTER TABLE "orders" ADD CONSTRAINT "orders_total_khong_am" CHECK ("total" &gt;= 0);</code></pre>
<div class="out">$ psql "$DATABASE_URL" -f tay-hoan-tat.sql
UPDATE 100
ALTER TABLE
ALTER TABLE
$ npx prisma migrate resolve --applied 20261112071500_them_rang_buoc
Migration 20261112071500_them_rang_buoc marked as applied.
$ npx prisma migrate status
Database schema is up to date!          ← exit code 0; migrate diff --exit-code also 0</div>
<p><code>--applied</code> runs nothing: it only writes <code>finished_at</code>. So the hand-run SQL must do everything the file would have done — here including the <code>ghi_chu</code> column, or the next diff reports it missing.</p>
<h4>What does not work: a new fixing migration after it</h4>
<div class="out">$ npx prisma migrate resolve --rolled-back 20261112071500_them_rang_buoc
$ npx prisma migrate deploy      # with 20261112073000_sua_am_roi_rang_buoc added after it
3 migrations found in prisma/migrations
Applying migration &#96;20261112071500_them_rang_buoc&#96;
Error: P3018
ERROR: check constraint "orders_total_khong_am" of relation "orders" is violated by some row</div>
<div class="pitfall">
<p><strong>Trap — <code>migrate resolve</code> changes the record, not the database.</strong> It writes <code>rolled_back_at</code> or <code>finished_at</code> and nothing else. Mark a migration rolled back when part of it really did stay applied (MySQL, a file with its own <code>COMMIT</code>) and you tell Prisma a comforting lie: deploys resume, the next migration assumes a state that does not exist, and the damage compounds. Mark one applied without running its SQL and the database silently lacks it. This is why the CuongThai repository forbids auto-resolving a failed migration and requires the exact error, what actually applied, and a proposed fix to be reported to a human first.</p>
</div>

<h3>The production checklist</h3>
<div class="callout">
<p><strong>Before</strong> — read the generated SQL and search it for <code>DROP</code>. Say out loud what each statement locks and for how long. Confirm the change is additive, or plan the expand–contract. Confirm there is a recent backup. <strong>During</strong> — run <code>migrate deploy</code> as its own gated step; watch for lock waits (<code>SELECT * FROM pg_stat_activity WHERE wait_event_type = 'Lock'</code>). <strong>After</strong> — <code>migrate status</code> exits 0, <code>migrate diff --exit-code</code> exits 0, the core routes answer; check error rates before declaring it done. <strong>If it fails</strong> — stop, look at the database, then path A, B or C above.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/workflows/production-troubleshooting" target="_blank" rel="noopener"><span class="lc-ico">🚑</span><span class="lc-body"><span class="lc-title">Production troubleshooting</span><span class="lc-sub">prisma.io/docs · The failed-migration protocol in Prisma's own words, with both resolve branches</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/workflows/team-development" target="_blank" rel="noopener"><span class="lc-ico">👥</span><span class="lc-body"><span class="lc-title">Migrations in a team</span><span class="lc-sub">prisma.io/docs · Merge conflicts between two branches that both added a migration</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/explicit-locking.html" target="_blank" rel="noopener"><span class="lc-ico">🔒</span><span class="lc-body"><span class="lc-title">PostgreSQL — explicit locking</span><span class="lc-sub">postgresql.org · The lock table: which DDL takes which lock, and what each one blocks</span></span></a>
<a class="link-card" href="https://docs.github.com/en/actions/writing-workflows/about-workflows" target="_blank" rel="noopener"><span class="lc-ico">⚙️</span><span class="lc-body"><span class="lc-title">GitHub Actions — workflows</span><span class="lc-sub">docs.github.com · Gating a deploy on a migration step, and making the exit code stop the pipeline</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Plan a column rename as expand–contract, then recover a P3009 from the migrations table alone</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.5</span>
<h2>Migration trên production</h2>
<p class="lead">Một migration chạy tốt ở máy vẫn có thể hạ gục production, vì ba lý do chẳng liên quan gì tới chuyện SQL sai: nó khoá một cái bảng quá lâu, nó đổi lược đồ lệch nhịp với đoạn mã đang được triển khai, hoặc nó chết giữa chừng và chặn mọi lần deploy sau đó. Bài này nói cả ba, và kết bằng giao thức cứu vãn.</p>

<h3>Đặt ở đâu trong đường ống</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Build</span><span class="lz-t"><code>prisma generate</code></span><span class="lz-d">Bên trong bước dựng ảnh, trước <code>tsc</code>. Client sinh ra phải tồn tại thì phần biên dịch TypeScript mới qua được.</span></div>
  <div class="lz-step"><span class="lz-k">Deploy bước 1</span><span class="lz-t"><code>prisma migrate deploy</code></span><span class="lz-d">Một bước riêng, trước khi các container mới khởi động. Nó phải chạy <strong>đúng một lần</strong>, và mã thoát của nó phải chặn mọi thứ phía sau.</span></div>
  <div class="lz-step"><span class="lz-k">Deploy bước 2</span><span class="lz-t">Khởi động mã mới</span><span class="lz-d">Chỉ sau khi migration thành công. Nếu một migration hỏng thì phiên bản cũ tiếp tục chạy với lược đồ cũ, và đó là kết cục đúng.</span></div>
  <div class="lz-step"><span class="lz-k">Đừng bao giờ</span><span class="lz-t">Đặt vào entrypoint của container</span><span class="lz-d">Nhân lên ba bản chạy là ba container cùng chạy <code>migrate deploy</code> một lúc. Prisma có lấy một advisory lock nên chúng không phá nhau — chạy thật, lần deploy thứ hai trong hai lần cùng lúc đã đợi trọn migration rồi thấy không còn gì để làm. Nhưng một container đang đợi thì không phục vụ, và một migration chậm nhân lên thành khởi động chậm ở mọi nơi.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Một bước deploy hỏng là báo to và không đi tiếp — đã chạy thật với một CSDL
# đang chờ migration, một migration hỏng, và một CSDL bị trôi dạt</span>
set -euo pipefail

echo "==&gt; migrate status (chỉ để ghi log: nó thoát 1 khi còn migration chờ)"
npx prisma migrate status || true

echo "==&gt; migrate deploy"
npx prisma migrate deploy

echo "==&gt; migrate status (giờ phải thoát 0)"
npx prisma migrate status

echo "==&gt; kiem khong co troi dat"
npx prisma migrate diff \\
  --from-schema-datasource prisma/schema.prisma \\
  --to-schema-datamodel   prisma/schema.prisma --exit-code &gt; /dev/null \\
  || { echo "TROI DAT (hoac diff loi) — khong khoi dong container"; exit 1; }

echo "==&gt; khoi dong container"</code></pre>
<div class="out">-- đo ngày 12/11/2026, laptop Apple silicon, PostgreSQL 16.14 trong Docker, Prisma 6.19.3
-- (1) đang chờ một migration cộng thêm
==&gt; migrate status (chỉ để ghi log: …)
Following migration have not yet been applied:
20261112075000_them_tom_tat
==&gt; migrate deploy
Applying migration &#96;20261112075000_them_tom_tat&#96;
All migrations have been successfully applied.
==&gt; migrate status (giờ phải thoát 0)
Database schema is up to date!
==&gt; kiem khong co troi dat
==&gt; khoi dong container                                    ← script thoát mã 0

-- (2) migration đang chờ vi phạm một ràng buộc CHECK
==&gt; migrate deploy
Applying migration &#96;20261112071500_them_rang_buoc&#96;
Error: P3018
Database error code: 23514
ERROR: check constraint "orders_total_khong_am" of relation "orders" is violated by some row
                                                         ← script thoát mã 1, container không bao giờ khởi động

-- (3) có người thêm một cột bằng tay, ngoài mọi migration
==&gt; kiem khong co troi dat
TROI DAT (hoac diff loi) — khong khoi dong container          ← script thoát mã 1</div>
<div class="pitfall">
<p><strong>Bẫy — <code>migrate status</code> thoát mã 1 mỗi khi còn migration đang chờ.</strong> Đặt một dòng <code>npx prisma migrate status</code> trần lên đầu một script có <code>set -e</code> thì, chạy thật, nó dừng ngay tại đó ở mọi lần deploy có migration mới — đúng tình huống script sinh ra để xử lý — và không bao giờ tới được <code>migrate deploy</code>. Nó cũng thoát 1 khi đang có một migration hỏng được ghi nhận, và chỉ thoát 0 khi mọi thứ đã áp dụng. Nên trước deploy, status chỉ là một dòng log (<code>|| true</code>); sau deploy, mã thoát của nó mới là một cái chốt thật.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>set -euo pipefail</code> là dòng chịu lực</span><span class="v">Chạy không có nó, cùng migration hỏng ấy in ra P3009 — rồi script vẫn đi tiếp và in "khoi dong container". Có nó, mã thoát khác không đầu tiên kết thúc lần deploy.</span></div>
  <div class="kv"><span class="k"><code>migrate diff --exit-code</code></span><span class="v">Mã thoát 0 = không khác gì, 2 = có khác biệt, 1 = lỗi. Chắc hơn việc dò chữ "empty migration" trong output, và vẫn chỉ đọc.</span></div>
  <div class="kv"><span class="k">Kiểm cả hệ thống đang chạy</span><span class="v">Script deploy của CuongThai chạy chốt kiểm khói lên các route lõi sau khi deploy và làm hỏng lần deploy nếu có route nào trả 404 — một bản build xanh không chứng minh gì về một hệ thống đang chạy.</span></div>
</div>

<h3>Mỗi câu lệnh khoá cái gì</h3>
<pre><code class="language-sql"><span class="tok-comment">-- Mỗi câu trong BEGIN … ROLLBACK, rồi hỏi pg_locks xem nó giữ khoá gì</span>
BEGIN;
ALTER TABLE posts ALTER COLUMN author_id TYPE bigint;
SELECT string_agg(mode, ', ' ORDER BY mode) FROM pg_locks
 WHERE relation = 'posts'::regclass AND pid = pg_backend_pid();
ROLLBACK;</code></pre>
<div class="out">-- đo ngày 12/11/2026, laptop Apple silicon, PostgreSQL 16.14 trong Docker, Prisma 6.19.3
câu lệnh                        khoá giữ trên posts                      thời gian, 1.000.000 hàng
ADD COLUMN (nullable)           AccessExclusiveLock                      ~1 ms
ALTER COLUMN TYPE int → bigint  AccessExclusiveLock (+ ShareLock)        ~0.8 s — ghi lại từng hàng
SET NOT NULL                    AccessExclusiveLock                      ~0.16 s — quét từng hàng
ADD CONSTRAINT … CHECK          AccessExclusiveLock                      quét từng hàng
ADD CONSTRAINT … CHECK NOT VALID AccessExclusiveLock                     ~2 ms — không quét
VALIDATE CONSTRAINT             ShareUpdateExclusiveLock                 ~60 ms — đọc và ghi vẫn chạy
ADD FOREIGN KEY                 ShareRowExclusiveLock (+ AccessShareLock) quét — chặn ghi, không chặn đọc
CREATE INDEX                    ShareLock                                chặn ghi, không chặn đọc</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Mọi <code>ALTER TABLE</code> đều lấy ACCESS EXCLUSIVE — kể cả những câu tức thì</span><span class="v"><code>ADD COLUMN</code> (cho phép null, hoặc kèm mặc định hằng trên PostgreSQL 11+), <code>DROP COLUMN</code>, <code>RENAME</code> chỉ đụng siêu dữ liệu và giữ khoá khoảng một mili giây. Khoá ngắn, nhưng vẫn phải <em>lấy được</em> nó — xem hàng đợi khoá ngay dưới.</span></div>
  <div class="kv"><span class="k">Ghi lại và quét giữ khoá lâu — nhóm nguy hiểm</span><span class="v">Đổi kiểu cột ghi lại từng hàng; <code>SET NOT NULL</code> và <code>ADD CONSTRAINT … CHECK</code> quét từng hàng. Thêm cột với giá trị mặc định <em>không tất định</em> như <code>clock_timestamp()</code> cũng ghi lại cả bảng (tài liệu PostgreSQL). Trong lúc chúng chạy, <em>mọi lần đọc và mọi lần ghi đều phải đợi</em>.</span></div>
  <div class="kv"><span class="k">Khoá nhẹ hơn</span><span class="v"><code>VALIDATE CONSTRAINT</code> để đọc và ghi chạy tiếp. <code>CREATE INDEX</code> và <code>ADD FOREIGN KEY</code> chặn ghi nhưng không chặn đọc — <code>CREATE INDEX CONCURRENTLY</code> (Bài 6.3) tránh được cả cái đó.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># A: một giao dịch đọc 6 giây trên posts · B: ALTER TABLE posts ADD COLUMN … · C: đọc một hàng</span>
bash hang-doi.sh</code></pre>
<div class="out">-- đo ngày 12/11/2026, laptop Apple silicon, PostgreSQL 16.14 trong Docker, Prisma 6.19.3
== không đặt lock_timeout
pg_stat_activity lúc 2 s:
 pid  | state  |   cho   |                      cau                       
------+--------+---------+------------------------------------------------
 1569 | active | Timeout | BEGIN; SELECT count(*) FROM posts WHERE id &lt; 1
 1575 | active | Lock    |  ALTER TABLE posts ADD COLUMN tam_1 TEXT;
 1584 | active | Lock    | SELECT title FROM posts WHERE id = 1
(3 rows)

B (ALTER TABLE, gửi sau 0,5 s): 5.6 s
C (SELECT một hàng, gửi sau 1 s): 5.1 s
== B có SET lock_timeout = '1s'
pg_stat_activity lúc 2 s:
 pid  | state  |   cho   |                      cau                       
------+--------+---------+------------------------------------------------
 1599 | active | Timeout | BEGIN; SELECT count(*) FROM posts WHERE id &lt; 1
(1 row)

B (ALTER TABLE, gửi sau 0,5 s): 1.2 s — ERROR:  canceling statement due to lock timeout
C (SELECT một hàng, gửi sau 1 s): 0.6 s</div>
<div class="callout warn">
<p><strong>Cái ẩn: hàng đợi khoá.</strong> B cần ACCESS EXCLUSIVE và không lấy được khi A đang đọc, nên nó đợi — và C, vốn chỉ muốn một hàng, xếp hàng <em>sau B</em> và đã đợi khoảng năm giây. Có <code>lock_timeout</code>, B bỏ cuộc sau một giây và C đi qua ngay. Một câu <code>ALTER</code> đang đợi biến bất kỳ giao dịch dài nào thành gián đoạn trên cả bảng đó; hãy hỏng nhanh rồi thử lại.</p>
</div>
<pre><code class="language-sql"><span class="tok-comment">-- prisma/migrations/20261112075000_them_tom_tat/migration.sql</span>
-- Fail fast instead of queueing behind a long transaction
SET lock_timeout = '1s';
ALTER TABLE "posts" ADD COLUMN "tom_tat" TEXT;</code></pre>
<div class="out">-- đo ngày 12/11/2026, laptop Apple silicon, PostgreSQL 16.14 trong Docker, Prisma 6.19.3
-- lần 1: một giao dịch khác đang giữ posts
$ npx prisma migrate deploy
Applying migration &#96;20261112075000_them_tom_tat&#96;
Error: P3018
Database error code: 55P03
ERROR: canceling statement due to lock timeout

-- giao dịch kia đã xong: đánh dấu đã lùi, chạy lại ĐÚNG tệp ấy
$ npx prisma migrate resolve --rolled-back 20261112075000_them_tom_tat
Migration 20261112075000_them_tom_tat marked as rolled back.
$ npx prisma migrate deploy
Applying migration &#96;20261112075000_them_tom_tat&#96;
All migrations have been successfully applied.</div>
<p>Hết giờ đợi khoá là kiểu hỏng dễ chịu nhất: không có gì bị đổi (cả tệp đã lùi), nên đánh dấu đã lùi là nói thật, và chính tệp ấy chạy được ngay khi giao dịch dài kia xong.</p>
<pre><code class="language-sql"><span class="tok-comment">-- Hai dạng chia làm hai bước để tránh khoá cả bảng</span>

<span class="tok-comment">-- Ràng buộc CHECK: kiểm riêng ra, dưới một khoá nhẹ hơn
-- (1.000.000 hàng: ADD … NOT VALID ~2 ms, VALIDATE ~60 ms trong khi đọc và ghi vẫn chạy)</span>
ALTER TABLE "orders" ADD CONSTRAINT "orders_total_khong_am"
  CHECK ("total" &gt;= 0) NOT VALID;
ALTER TABLE "orders" VALIDATE CONSTRAINT "orders_total_khong_am";

<span class="tok-comment">-- NOT NULL trên PostgreSQL 12+: một CHECK đã kiểm cho phép nó bỏ qua bước quét
-- (SET NOT NULL: ~0,16 s khi tự quét, ~3 ms khi CHECK đã được kiểm)</span>
ALTER TABLE "posts" ADD CONSTRAINT "posts_slug_not_null"
  CHECK ("slug" IS NOT NULL) NOT VALID;
ALTER TABLE "posts" VALIDATE CONSTRAINT "posts_slug_not_null";
ALTER TABLE "posts" ALTER COLUMN "slug" SET NOT NULL;
ALTER TABLE "posts" DROP CONSTRAINT "posts_slug_not_null";</code></pre>

<h3>Nới–thu: đổi lược đồ mà không có thời gian chết</h3>
<p>Trong bất kỳ lần deploy nào, mã cũ và mã mới đều chạy song song một lúc. Nên một thay đổi lược đồ phải tương thích với <em>cả hai</em>, và điều đó nghĩa là nó không thể xảy ra trong một bước. Đổi tên <code>full_name</code> thành <code>ho_ten</code> mất ba lần deploy:</p>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Deploy 1 · Nới</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Thêm cột mới</span><span class="lz-nsub"><code>ADD COLUMN ho_ten TEXT</code>, cho phép null, cộng một lần đổ dữ liệu. Cột cũ giữ nguyên. Mã cũ vẫn chạy; nó chưa từng nghe nói tới cột mới.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Ghi vào cả hai</span><span class="lz-nsub">Mã mới ghi cả hai cột và đọc cột cũ. Hai phiên bản chạy cùng lúc giờ nhất quán với nhau.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Deploy 2 · Chuyển</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Đọc từ cột mới</span><span class="lz-nsub">Vẫn ghi cả hai. Tới lúc này mọi hàng đều có giá trị ở cả hai cột và mọi bản đang chạy đều là mã biết về cả hai.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Deploy 3 · Thu</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Ngừng ghi cột cũ</span><span class="lz-nsub">Chỉ đổi mã, không migration nào.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Rồi mới xoá nó</span><span class="lz-nsub"><code>DROP COLUMN full_name</code> — giờ an toàn, vì không có gì đang chạy nhắc tới nó. Lý tưởng là vài ngày sau, để trong khoảng đó vẫn quay lui được.</span></div></div>
  </div>
</div>
<div class="callout warn">
<p><strong>Ba lần deploy cho một lần đổi tên nghe vô lý cho tới lần đầu bạn bỏ qua nó.</strong> Xoá cột trong cùng bản phát hành ngừng dùng nó, thì mọi yêu cầu do một container cũ phục vụ trong khoảng giữa "migration đã áp dụng" và "container cũ đã dừng" đều ném lỗi — kéo dài đúng bằng thời gian cuộn bản phát hành của bạn. Với một lần cuộn hai phút thì đó là hai phút toàn 500. Cũng mẫu ấy áp dụng cho mọi thay đổi phá huỷ: xoá một cột, siết một ràng buộc, đổi tên một bảng, bỏ một giá trị enum.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Thay đổi cộng thêm thì an toàn trong một bước</span><span class="v">Một cột mới cho phép null, một bảng mới, một chỉ mục mới. Mã cũ phớt lờ những gì nó không biết, nên không có khoảng nào bất tương thích.</span></div>
  <div class="kv"><span class="k">Thay đổi phá huỷ thì cần nới–thu</span><span class="v">Bất cứ thứ gì gỡ bỏ hoặc thu hẹp: xoá, đổi tên, thêm <code>NOT NULL</code>, siết một kiểu, bỏ một giá trị enum.</span></div>
  <div class="kv"><span class="k">Nó còn mua cho bạn một đường quay lui</span><span class="v">Cột cũ còn đó thì quay lui mã là đủ. Một khi nó đã bị xoá, quay lui nghĩa là phục hồi dữ liệu — và đó mới là lý do thật để chừa vài ngày giữa các bước thu.</span></div>
</div>

<h3>Đổ dữ liệu lớn không thuộc về một migration</h3>
<pre><code class="language-typescript"><span class="tok-comment">-- Trong một migration: ổn với vài nghìn hàng, là một sự cố với hàng triệu</span>
UPDATE "posts" SET "slug" = … WHERE "slug" IS NULL;</code></pre>
<pre><code class="language-javascript"><span class="tok-comment">// Dưới dạng một script riêng: chia lô, chạy lại được, và không chặn lần deploy</span>
for (;;) {
  const batch = await prisma.post.findMany({
    where:  { slug: null },
    select: { id: true, title: true },
    take:   1000,
  });
  if (batch.length === 0) break;

  await prisma.$transaction(
    batch.map((p) =&gt;
      prisma.post.update({ where: { id: p.id }, data: { slug: makeSlug(p.title, p.id) } }),
    ),
  );
  console.log('da xu ly', batch.length);
}</code></pre>
<div class="out">-- 20.388 bài có slug = null, lô 1000 hàng (chạy thật)
da xu ly 1000
da xu ly 1000
… tổng cộng 21 lô, lô cuối 388 hàng
slug còn null sau đó: 0 trên 20388</div>
<p>Cách chia là: <strong>migration đổi hình dạng, script chuyển dữ liệu.</strong> Migration thêm cột cho phép null và mất vài mili giây; script điền đầy nó trong một giờ trong khi trang vẫn sống; một migration sau đó thêm <code>NOT NULL</code> khi script đã xong. Ba bước nhỏ và an toàn thay vì một bước dài và nguy hiểm.</p>

<h3>Khi một migration chết giữa chừng</h3>
<pre><code class="language-sql"><span class="tok-comment">-- prisma/migrations/20261112071500_them_rang_buoc/migration.sql — 100 of 100,000 orders have a negative total</span>
-- 1. A harmless statement
ALTER TABLE "orders" ADD COLUMN "ghi_chu" TEXT;
-- 2. A constraint the real data violates
ALTER TABLE "orders" ADD CONSTRAINT "orders_total_khong_am" CHECK ("total" &gt;= 0);</code></pre>
<pre><code class="language-bash">npx prisma migrate deploy   <span class="tok-comment"># lần đầu</span>
npx prisma migrate deploy   <span class="tok-comment"># mọi lần sau đó</span></code></pre>
<div class="out">-- đo ngày 12/11/2026, laptop Apple silicon, PostgreSQL 16.14 trong Docker, Prisma 6.19.3
Applying migration &#96;20261112071500_them_rang_buoc&#96;
Error: P3018
A migration failed to apply. New migrations cannot be applied before the error is recovered from.
Migration name: 20261112071500_them_rang_buoc
Database error code: 23514
ERROR: check constraint "orders_total_khong_am" of relation "orders" is violated by some row

Error: P3009
migrate found failed migrations in the target database, new migrations will not be applied.
The &#96;20261112071500_them_rang_buoc&#96; migration started at 2026-11-12 00:10:35.277589 UTC failed</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · Dừng lại. Đừng chạy bất cứ thứ gì đổi trạng thái.</span><span class="lz-lnote">Không <code>migrate resolve</code>, không <code>migrate reset</code>, không một bản vá nhanh trong <code>psql</code>. Việc đầu tiên là làm cho trạng thái trở nên rõ.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · Tìm xem thật sự cái gì đã đổi — trong cơ sở dữ liệu</span><span class="lz-lnote">Trên PostgreSQL, Prisma gửi cả tệp <code>migration.sql</code> một lần và PostgreSQL chạy nó như một giao dịch, nên một lỗi thường làm lùi <em>mọi</em> câu lệnh trong tệp. <code>applied_steps_count</code> đếm tệp chứ không đếm câu: ở đây là 0. Hãy nhìn thẳng vào các đối tượng. Một phần <em>có thể</em> sót lại khi tệp tự chứa <code>COMMIT</code>, khi có câu không chạy được trong giao dịch, hoặc trên MySQL, vốn không có DDL giao dịch.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · Vá nguyên nhân, rồi đi một trong ba đường đã chạy thử</span><span class="lz-lnote">A — sửa dữ liệu rồi chạy lại đúng tệp ấy. B — sửa chính tệp hỏng, chỉ khi nó chưa từng áp dụng ở đâu. C — hoàn tất bằng tay rồi ghi nhận. Mỗi đường có output thật bên dưới. Con người quyết; con người kiểm lại bằng <code>migrate status</code> và <code>migrate diff</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · Không phải: "vá bằng một migration mới"</span><span class="lz-lnote">Sau <code>--rolled-back</code>, deploy chạy lại tệp hỏng <em>trước tiên</em>. Một migration sửa mới đặt sau nó không bao giờ tới lượt — có chạy thử bên dưới.</span></div>
</div>
<pre><code class="language-sql"><span class="tok-comment">-- Bước 2: bản ghi nói gì, và cơ sở dữ liệu có gì</span>
SELECT migration_name, finished_at, rolled_back_at, applied_steps_count FROM _prisma_migrations;
\\d orders
SELECT count(*) FROM orders WHERE total &lt; 0;</code></pre>
<div class="out">        migration_name         | finished_at | rolled_back_at | applied_steps_count
-------------------------------+-------------+----------------+---------------------
 20261112001026_khoi_tao       | 2026-11-12… |                |                   1
 20261112071500_them_rang_buoc |             |                |                   0

 Column |  Type   | Nullable          ← không có ghi_chu: câu ALTER cùng tệp cũng đã lùi
 id     | integer | not null
 total  | integer | not null

 count: 100                         ← các hàng làm hỏng CHECK</div>
<h4>Đường A — sửa dữ liệu, rồi chạy lại đúng tệp cũ</h4>
<pre><code class="language-bash">psql "$DATABASE_URL" -c 'UPDATE orders SET total = 0 WHERE total &lt; 0'
npx prisma migrate resolve --rolled-back 20261112071500_them_rang_buoc
npx prisma migrate deploy
npx prisma migrate status
npx prisma migrate diff --from-schema-datasource prisma/schema.prisma \\
  --to-schema-datamodel prisma/schema.prisma --exit-code</code></pre>
<div class="out">UPDATE 100
Migration 20261112071500_them_rang_buoc marked as rolled back.
Applying migration &#96;20261112071500_them_rang_buoc&#96;
All migrations have been successfully applied.
Database schema is up to date!          ← status thoát mã 0
                                        ← diff thoát mã 0</div>
<p>Đường đúng khi SQL đúng mà dữ liệu sai. Không tệp nào đổi, nên mọi môi trường giữ cùng một lịch sử. Bản thân việc sửa dữ liệu là một thay đổi trên production — hãy ghi nó vào hồ sơ sự cố.</p>
<h4>Đường B — sửa chính tệp hỏng, rồi chạy lại</h4>
<pre><code class="language-sql"><span class="tok-comment">-- cùng tệp migration.sql ấy, đã sửa</span>
-- Fix the data first, then add the constraint
UPDATE "orders" SET "total" = 0 WHERE "total" &lt; 0;
ALTER TABLE "orders" ADD CONSTRAINT "orders_total_khong_am" CHECK ("total" &gt;= 0);</code></pre>
<div class="out">$ npx prisma migrate resolve --rolled-back 20261112071500_them_rang_buoc
Migration 20261112071500_them_rang_buoc marked as rolled back.
$ npx prisma migrate deploy
Applying migration &#96;20261112071500_them_rang_buoc&#96;
All migrations have been successfully applied.
        migration_name         | xong | da_lui
 20261112071500_them_rang_buoc | f    | t        ← mọi lần thử đều ở lại trong bảng
 20261112071500_them_rang_buoc | t    | f</div>
<p>Chỉ được làm vì tệp này chưa từng áp dụng thành công <em>ở bất kỳ đâu</em>. Nếu staging hay một đồng đội đã chạy bản cũ, họ giữ bản cũ, và <code>migrate dev</code> ở đó sẽ đòi reset (Bài 6.1) — khi ấy hãy đi đường A hoặc C.</p>
<h4>Đường C — hoàn tất bằng tay, rồi ghi nhận</h4>
<pre><code class="language-sql">-- "finish by hand": repair the rows, then run what the failed file meant to do
UPDATE "orders" SET "total" = 0 WHERE "total" &lt; 0;
ALTER TABLE "orders" ADD COLUMN "ghi_chu" TEXT;
ALTER TABLE "orders" ADD CONSTRAINT "orders_total_khong_am" CHECK ("total" &gt;= 0);</code></pre>
<div class="out">$ psql "$DATABASE_URL" -f tay-hoan-tat.sql
UPDATE 100
ALTER TABLE
ALTER TABLE
$ npx prisma migrate resolve --applied 20261112071500_them_rang_buoc
Migration 20261112071500_them_rang_buoc marked as applied.
$ npx prisma migrate status
Database schema is up to date!          ← thoát mã 0; migrate diff --exit-code cũng 0</div>
<p><code>--applied</code> không chạy gì: nó chỉ ghi <code>finished_at</code>. Nên SQL chạy tay phải làm đủ mọi thứ tệp lẽ ra đã làm — ở đây gồm cả cột <code>ghi_chu</code>, không thì lần diff sau sẽ báo thiếu.</p>
<h4>Cái không chạy được: một migration sửa mới đặt sau nó</h4>
<div class="out">$ npx prisma migrate resolve --rolled-back 20261112071500_them_rang_buoc
$ npx prisma migrate deploy      # đã thêm 20261112073000_sua_am_roi_rang_buoc đứng sau
3 migrations found in prisma/migrations
Applying migration &#96;20261112071500_them_rang_buoc&#96;
Error: P3018
ERROR: check constraint "orders_total_khong_am" of relation "orders" is violated by some row</div>
<div class="pitfall">
<p><strong>Bẫy — <code>migrate resolve</code> đổi bản ghi, không đổi cơ sở dữ liệu.</strong> Nó ghi <code>rolled_back_at</code> hoặc <code>finished_at</code> và không làm gì khác. Đánh dấu một migration là đã lùi trong khi một phần của nó thật ra vẫn còn (MySQL, một tệp tự chứa <code>COMMIT</code>) là nói với Prisma một lời nói dối dễ chịu: các lần deploy chạy tiếp, migration kế tiếp giả định một trạng thái không tồn tại, và hỏng hóc dồn thêm. Đánh dấu đã áp dụng mà không chạy SQL của nó thì cơ sở dữ liệu lặng lẽ thiếu phần đó. Chính vì thế kho mã CuongThai cấm tự động xử lý một migration hỏng và yêu cầu báo cho người thật trước: đúng thông báo lỗi, thật sự cái gì đã áp dụng, và một đề xuất cách vá.</p>
</div>

<h3>Danh sách kiểm cho production</h3>
<div class="callout">
<p><strong>Trước</strong> — đọc đoạn SQL sinh ra và tìm chữ <code>DROP</code> trong đó. Nói to ra mỗi câu lệnh khoá cái gì và khoá bao lâu. Xác nhận thay đổi là cộng thêm, hoặc lên kế hoạch nới–thu. Xác nhận có một bản sao lưu gần đây. <strong>Trong lúc</strong> — chạy <code>migrate deploy</code> như một bước riêng có chốt; canh xem có ai đợi khoá không (<code>SELECT * FROM pg_stat_activity WHERE wait_event_type = 'Lock'</code>). <strong>Sau</strong> — <code>migrate status</code> thoát 0, <code>migrate diff --exit-code</code> thoát 0, các route lõi trả lời; kiểm tỉ lệ lỗi trước khi tuyên bố xong. <strong>Nếu hỏng</strong> — dừng lại, nhìn vào cơ sở dữ liệu, rồi đi đường A, B hoặc C ở trên.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/workflows/production-troubleshooting" target="_blank" rel="noopener"><span class="lc-ico">🚑</span><span class="lc-body"><span class="lc-title">Production troubleshooting</span><span class="lc-sub">prisma.io/docs · Giao thức xử lý migration hỏng bằng lời của chính Prisma, kèm cả hai nhánh resolve</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/workflows/team-development" target="_blank" rel="noopener"><span class="lc-ico">👥</span><span class="lc-body"><span class="lc-title">Migration trong một đội</span><span class="lc-sub">prisma.io/docs · Xung đột merge giữa hai nhánh cùng thêm một migration</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/explicit-locking.html" target="_blank" rel="noopener"><span class="lc-ico">🔒</span><span class="lc-body"><span class="lc-title">PostgreSQL — khoá tường minh</span><span class="lc-sub">postgresql.org · Bảng khoá: DDL nào lấy khoá nào, và mỗi khoá chặn cái gì</span></span></a>
<a class="link-card" href="https://docs.github.com/en/actions/writing-workflows/about-workflows" target="_blank" rel="noopener"><span class="lc-ico">⚙️</span><span class="lc-body"><span class="lc-title">GitHub Actions — workflow</span><span class="lc-sub">docs.github.com · Đặt chốt cho một lần deploy dựa trên bước migration, và làm mã thoát dừng được đường ống</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Lên kế hoạch đổi tên một cột theo nới–thu, rồi cứu một P3009 chỉ từ bảng migration</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 6.6 ─────────────────────────── */
    {
      title: '6.6 — Chapter 6 quiz|||6.6 — Trắc nghiệm Chương 6',
      slug: 'pr-6-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu: checksum bảo vệ gì, shadow database làm gì, migrate deploy khác migrate dev ở đâu, Prisma sinh gì cho một lần đổi tên cột, migrate resolve thật sự làm gì, nới–thu, P3009, và dựng nền cho cơ sở dữ liệu có sẵn.',
      content: `
<div class="ml-en">
<p>Eight questions on migrations. These are the ones where a wrong answer costs data rather than time, which is why the chapter spent so long on them.</p>
</div>
<div class="ml-vi">
<p>Tám câu về migration. Đây là nhóm mà một câu trả lời sai tốn dữ liệu chứ không tốn thời gian, và vì thế chương này đã dành nhiều thời lượng cho chúng.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What does the `checksum` column in `_prisma_migrations` protect against?|||Cột `checksum` trong `_prisma_migrations` bảo vệ khỏi điều gì?',
            options: [
              'A migration file being edited after it was applied — migrate dev compares it and stops; migrate deploy and status do not check it|||Việc một tệp migration bị sửa sau khi đã áp dụng — migrate dev so nó và dừng lại; migrate deploy và status thì không kiểm',
              'A migration being applied twice, which would duplicate the tables|||Việc một migration bị áp dụng hai lần, làm nhân đôi các bảng',
              'Corruption of the SQL file on disk during transfer|||Tệp SQL bị hỏng trên đĩa trong lúc truyền đi',
              'Two developers creating migrations with the same timestamp|||Hai lập trình viên tạo migration trùng mốc thời gian',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is the shadow database for?|||Shadow database dùng để làm gì?',
            options: [
              'Replaying the whole history on a clean database to verify it is replayable, and diffing it against the real database to detect drift|||Phát lại toàn bộ lịch sử lên một cơ sở dữ liệu sạch để kiểm nó có phát lại được không, và so nó với cơ sở dữ liệu thật để phát hiện trôi dạt',
              'Holding a backup copy of the data so migrate dev can roll back|||Giữ một bản sao lưu dữ liệu để migrate dev có thể quay lui',
              'Running the application against a test schema during development|||Chạy ứng dụng trên một lược đồ thử trong lúc phát triển',
              'Storing the generated client so it can be shared between developers|||Lưu client sinh ra để chia sẻ giữa các lập trình viên',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why does `migrate deploy` work on a locked-down production user when `migrate dev` does not?|||Vì sao `migrate deploy` chạy được với một tài khoản production bị khoá chặt trong khi `migrate dev` thì không?',
            options: [
              'It creates no shadow database — it just reads the folder, reads _prisma_migrations and runs what is missing|||Nó không tạo shadow database nào — nó chỉ đọc thư mục, đọc _prisma_migrations rồi chạy những gì còn thiếu',
              'It runs with elevated privileges granted by the Prisma engine|||Nó chạy với quyền được nâng do Prisma engine cấp',
              'It applies migrations outside a transaction, which needs fewer permissions|||Nó áp dụng migration ngoài giao dịch, và như vậy cần ít quyền hơn',
              'It does not actually apply anything — it only records the migrations as applied|||Nó không thật sự áp dụng gì — nó chỉ ghi nhận các migration là đã áp dụng',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You rename `fullName` to `hoTen` in the schema. What does Prisma generate?|||Bạn đổi tên `fullName` thành `hoTen` trong lược đồ. Prisma sinh ra gì?',
            options: [
              'DROP COLUMN then ADD COLUMN — it cannot see a rename, so it destroys the data and you must write RENAME COLUMN yourself|||DROP COLUMN rồi ADD COLUMN — nó không nhìn thấy một lần đổi tên, nên nó phá dữ liệu và bạn phải tự viết RENAME COLUMN',
              'ALTER TABLE ... RENAME COLUMN, preserving the data automatically|||ALTER TABLE ... RENAME COLUMN, tự động giữ nguyên dữ liệu',
              'Nothing — a rename only affects the generated client, not the database|||Không gì cả — đổi tên chỉ ảnh hưởng client sinh ra, không ảnh hưởng cơ sở dữ liệu',
              'It refuses to generate and asks you to confirm the rename interactively|||Nó từ chối sinh ra và hỏi bạn xác nhận việc đổi tên một cách tương tác',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does `prisma migrate resolve --rolled-back <name>` actually do?|||`prisma migrate resolve --rolled-back <tên>` thật sự làm gì?',
            options: [
              'It only writes rolled_back_at in the migrations table — it does NOT undo anything, so whatever the failed migration left behind must be cleaned up by hand first|||Nó chỉ ghi rolled_back_at vào bảng migration — nó KHÔNG gỡ bỏ gì cả, nên thứ gì migration hỏng còn để lại thì bạn phải tự dọn trước',
              'It reverses every statement the migration applied and then removes the row|||Nó đảo ngược mọi câu lệnh migration đã áp dụng rồi xoá cái hàng đó đi',
              'It restores the database from the last automatic snapshot|||Nó phục hồi cơ sở dữ liệu từ bản chụp tự động gần nhất',
              'It re-runs the migration from the beginning in a transaction|||Nó chạy lại migration từ đầu bên trong một giao dịch',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why does dropping a column need three deploys rather than one?|||Vì sao xoá một cột cần ba lần deploy chứ không phải một?',
            options: [
              'Old and new code both run during a rolling deploy, so the column must survive until nothing deployed refers to it|||Mã cũ và mã mới cùng chạy trong lúc cuộn bản phát hành, nên cột đó phải sống sót tới khi không còn gì đang chạy nhắc tới nó',
              'PostgreSQL needs three vacuum cycles to reclaim the space|||PostgreSQL cần ba chu kỳ vacuum để đòi lại chỗ trống',
              'Prisma caches the schema and needs a restart between each step|||Prisma lưu đệm lược đồ và cần khởi động lại giữa mỗi bước',
              'It does not — dropping a column is additive and safe in one step|||Không cần — xoá một cột là thao tác cộng thêm và an toàn trong một bước',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A deploy fails with P3009. What is the correct first move?|||Một lần deploy hỏng với P3009. Nước đi đầu tiên đúng là gì?',
            options: [
              'Stop, read the error in _prisma_migrations.logs, and check the database itself for what the failed migration actually left behind|||Dừng lại, đọc lỗi trong _prisma_migrations.logs, và kiểm chính cơ sở dữ liệu xem migration hỏng thật sự để lại gì',
              'Run `migrate resolve --rolled-back` so the pipeline can continue|||Chạy `migrate resolve --rolled-back` để đường ống đi tiếp được',
              'Run `migrate reset` to get back to a known state|||Chạy `migrate reset` để về lại một trạng thái đã biết',
              'Edit the failed migration file to fix the error and re-run the deploy|||Sửa tệp migration bị hỏng để vá lỗi rồi chạy lại deploy',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'How do you adopt Prisma into a production database that already has tables?|||Bạn đưa Prisma vào một cơ sở dữ liệu production vốn đã có bảng bằng cách nào?',
            options: [
              'db pull, rename by hand, generate a 0_init baseline with migrate diff --from-empty, then migrate resolve --applied it in every environment|||db pull, đổi tên bằng tay, sinh một migration nền 0_init bằng migrate diff --from-empty, rồi migrate resolve --applied nó ở mọi môi trường',
              'Run migrate dev, which detects the existing tables and adopts them automatically|||Chạy migrate dev, nó tự phát hiện các bảng có sẵn và nhận nuôi chúng',
              'Run db push, which makes the database match the schema without touching data|||Chạy db push, nó làm cơ sở dữ liệu khớp lược đồ mà không đụng dữ liệu',
              'Export the data, run migrate reset, then re-import it|||Xuất dữ liệu ra, chạy migrate reset, rồi nhập lại',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
