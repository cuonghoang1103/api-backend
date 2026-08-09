/**
 * PostgreSQL — Mục 0: Giới thiệu khoá học & Hướng dẫn học.
 * Song ngữ EN/VI qua .ml-en / .ml-vi (số lượng phải bằng nhau, mỗi bài 1–1).
 * LUẬT SOẠN:
 *  - Mọi output psql/SQL phải CHẠY THẬT (PostgreSQL 15.4, localhost:5433, db pgcourse)
 *    rồi chép đúng, kể cả khoảng trắng canh cột.
 *  - KHÔNG backtick trần trong content (dùng &#96;); mọi `${` trong code mẫu → \${;
 *    mọi < > trong code → &lt; &gt;; & trong code → &amp;.
 */
const REF = '?ref=%2Fcourses%2Fpostgresql%2Flearn&reflabel=PostgreSQL';

export default {
  title: 'Section 0 — Introduction & How to Study|||Mục 0 — Giới thiệu khoá học & Hướng dẫn học',
  description: 'Đọc trước tiên: khoá học này dạy gì, học theo cách nào, cài đặt PostgreSQL ra sao, và mô hình tư duy quan trọng nhất — cơ sở dữ liệu là một máy chủ bạn nói chuyện bằng SQL.',
  lessons: [
    /* ─────────────────────────── 0.1 ─────────────────────────── */
    {
      title: '0.1 — About this course & the full roadmap|||0.1 — Về khoá học này & bản đồ toàn khoá',
      slug: 'postgresql-0-1-gioi-thieu',
      type: 'VIDEO',
      isFreePreview: true,
      // Video lịch sử: chính Michael Stonebraker — người khởi xướng dự án POSTGRES
      // tại UC Berkeley (Giải Turing 2014) — nói về các mục tiêu của Postgres.
      video: { url: 'https://youtu.be/S87qY2fubHA', durationSeconds: 0 },
      description: 'PostgreSQL là gì, ai tạo ra và vì sao, nó khác MySQL/SQLite thế nào, dùng ở đâu — và bản đồ 16 chương.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>PostgreSQL — from zero to running it in production</h2>
<p class="lead">This course teaches you to think in <strong>relations and query plans</strong> the way a professional backend engineer does: not "write some SQL and hope it's fast" but understanding what the database actually stores on disk, why one query is a thousand times slower than another, and how to make it correct and fast under real load. Every single query in this course is run against a real PostgreSQL server — if a result is shown, you are seeing the actual output, not a guess.</p>

<h3>What problem does a database solve?</h3>
<p>An application without a database keeps everything in memory (variables, arrays) — and loses all of it the moment it restarts. A database is the part of your system that <strong>remembers</strong>: it stores data durably on disk, lets many users read and write it at the same time without corrupting it, answers questions about it in milliseconds, and guarantees that a half-finished change never becomes permanent. PostgreSQL does all four exceptionally well.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Store durably</span><span class="v">Write once; it survives crashes, restarts, and power loss (that is what "ACID durability" means).</span></div>
  <div class="kv"><span class="k">Query fast</span><span class="v">Find 20 rows out of a million in under a millisecond — <em>if</em> you understand indexes (Chapter 9–10).</span></div>
  <div class="kv"><span class="k">Many users at once</span><span class="v">Thousands of concurrent reads and writes without two of them clobbering each other (Chapter 11: MVCC).</span></div>
  <div class="kv"><span class="k">All-or-nothing</span><span class="v">A transaction either fully happens or fully doesn't — never half. Money is never lost mid-transfer.</span></div>
</div>

<h3>What is PostgreSQL, who made it, and what did it grow out of?</h3>
<p>The story starts at <strong>UC Berkeley</strong>. In the 1970s, professor <strong>Michael Stonebraker</strong> (Turing Award, 2014) built <strong>Ingres</strong>, one of the first relational databases. In <strong>1986</strong> he started a successor project to fix Ingres's limitations and add richer data types — he called it <strong>POSTGRES</strong> ("post-Ingres"). In 1994 two Berkeley grad students, Andrew Yu and Jolly Chen, replaced its old query language with <strong>SQL</strong> and called it <strong>Postgres95</strong>. In <strong>1996</strong> it went fully open source and was renamed <strong>PostgreSQL</strong> to reflect the SQL support. The video above is Stonebraker himself explaining what he was trying to build.</p>
<p>The key point: PostgreSQL is a <strong>community-owned, open-source</strong> project — no single company controls it, and it has been developed continuously for nearly 30 years. That is exactly why it is trusted for serious systems: it isn't going anywhere, and it has had decades to get correctness right.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Who &amp; when</span><span class="v">Berkeley, Michael Stonebraker's POSTGRES from 1986; open-sourced as PostgreSQL in 1996. Free forever, no owner.</span></div>
  <div class="kv"><span class="k">What it is</span><span class="v">A relational database server (an "object-relational" one) that you talk to over the network using SQL.</span></div>
  <div class="kv"><span class="k">Where it's used</span><span class="v">Apple, Instagram, Reddit, Spotify — and this site's entire backend. The default choice for new serious apps.</span></div>
  <div class="kv"><span class="k">Why learn it</span><span class="v">"PostgreSQL" and "SQL" are near the top of nearly every backend job listing; and the skills transfer to every SQL database.</span></div>
</div>

<h3>PostgreSQL vs MySQL vs SQLite — when to reach for which</h3>
<p>You will hear these three names constantly. They are all SQL databases, but they occupy different niches. This course is about PostgreSQL, but knowing the landscape tells you <em>why</em> it's the default.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">SQLite</span><span class="v">A database in a single file, embedded inside your app — no server. Perfect for a phone app, a desktop tool, tests. Not for many writers at once.</span></div>
  <div class="kv"><span class="k">MySQL</span><span class="v">A server like Postgres, very popular, historically simpler. PostgreSQL has richer types (JSONB, arrays), stricter correctness, and a stronger query planner.</span></div>
  <div class="kv"><span class="k">PostgreSQL</span><span class="v">A server with the richest feature set: JSONB, full-text search, window functions, CTEs, real ACID with MVCC. The safe default for a web backend.</span></div>
</div>
<div class="callout ok">Rule of thumb: if you're building a web app's backend and you're not sure which database to pick — pick PostgreSQL. You will not outgrow it for a very long time, and everything you learn here is standard SQL that transfers elsewhere.</div>

<h3>The roadmap — 4 stages, 16 chapters</h3>
<p>Each stage builds on the one before it. You cannot read a query plan (Chapter 10) if joins (Chapter 5) never clicked, and you cannot tune an index (Chapter 9) if you don't know the data types it's built on (Chapter 2).</p>
<div class="lz-map">
  <div class="lz-stage">Stage 1 · Foundations</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Why PostgreSQL exists</div><div class="lz-nsub">Relational model, ACID, client-server, vs MySQL/SQLite, when to use it</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Data types</div><div class="lz-nsub">numeric, text, boolean, timestamptz, uuid, enum, array, jsonb — pick the right one</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Tables, constraints &amp; schema design</div><div class="lz-nsub">Primary/foreign keys, unique, check, not null, generated &amp; identity columns</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Inserting &amp; querying</div><div class="lz-nsub">INSERT, SELECT, WHERE, ORDER BY, LIMIT, DISTINCT, UPSERT (ON CONFLICT)</div></div></div>
  <div class="lz-stage">Stage 2 · Querying deeper</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Joins</div><div class="lz-nsub">inner, left, right, full, self, cross and lateral joins — combining tables</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Aggregation &amp; grouping</div><div class="lz-nsub">GROUP BY, HAVING, count/sum/avg, FILTER, GROUPING SETS</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Subqueries &amp; CTEs</div><div class="lz-nsub">Scalar/correlated subqueries, WITH, recursive CTEs</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Window functions</div><div class="lz-nsub">ROW_NUMBER, RANK, LAG/LEAD, running totals, frames</div></div></div>
  <div class="lz-stage">Stage 3 · Performance &amp; internals</div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Indexes</div><div class="lz-nsub">B-tree, partial, expression, composite, covering, GIN, GiST, BRIN</div></div></div>
  <div class="lz-node"><div class="lz-badge">10</div><div class="lz-nbody"><div class="lz-ntitle">EXPLAIN ANALYZE &amp; the planner</div><div class="lz-nsub">Seq scan vs index scan, cost, buffers, statistics, why a query is slow</div></div></div>
  <div class="lz-node"><div class="lz-badge">11</div><div class="lz-nbody"><div class="lz-ntitle">Transactions &amp; concurrency</div><div class="lz-nsub">ACID, isolation levels, MVCC, row locks, deadlocks</div></div></div>
  <div class="lz-node"><div class="lz-badge">12</div><div class="lz-nbody"><div class="lz-ntitle">Functions, triggers &amp; views</div><div class="lz-nsub">PL/pgSQL, triggers, views, materialized views</div></div></div>
  <div class="lz-stage">Stage 4 · In production</div>
  <div class="lz-node"><div class="lz-badge">13</div><div class="lz-nbody"><div class="lz-ntitle">JSONB &amp; full-text search</div><div class="lz-nsub">jsonb operators, GIN indexes, tsvector/tsquery, trigram search</div></div></div>
  <div class="lz-node"><div class="lz-badge">14</div><div class="lz-nbody"><div class="lz-ntitle">Connections, pooling &amp; operating</div><div class="lz-nsub">Connection pool, PgBouncer, VACUUM/autovacuum, bloat, monitoring</div></div></div>
  <div class="lz-node"><div class="lz-badge">15</div><div class="lz-nbody"><div class="lz-ntitle">Backup, replication &amp; scaling</div><div class="lz-nsub">pg_dump, WAL, streaming replication, partitioning, read replicas</div></div></div>
  <div class="lz-node"><div class="lz-badge">16</div><div class="lz-nbody"><div class="lz-ntitle">PostgreSQL in production &amp; capstone</div><div class="lz-nsub">Prisma &amp; migrations, this site's real schema, a production checklist</div></div></div>
</div>

<h3>Who this is for</h3>
<p>You need <strong>no prior database experience</strong>. If you can use a terminal and you've written a little code in any language, you're ready. Chapter 1 starts from the very beginning. If you've done the Node.js course (Chapter 7 was Prisma/PostgreSQL), this course is the deep dive into the database itself that Chapter 7 only sampled.</p>
<div class="callout ok">Time budget: roughly <strong>2–3 hours per chapter</strong> if you type every query and run it yourself. 16 chapters ≈ 40–50 hours to genuinely absorb. The goal is not to finish — it's to reach the point where you can look at a slow query, read its plan, and know exactly what to fix.</div>
<div class="note-ct">This site (cuongthai.com) runs on PostgreSQL 15.4 in production: roughly 248 tables, 95 migrations, a 6,980-line schema, storing every user, post, message, course and note you see. When a chapter says "here's how it's done in production", it means <em>here</em> — including the real connection-pool math (12 clients × pool 10 = 120 &gt; the 100-connection limit) that Chapter 14 dissects.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice track: PostgreSQL on Code Lab</span><span class="lc-sub">Hands-on SQL exercises with solutions — the companion drills for this course.</span></span>
</a>
<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://www.postgresql.org/docs/" target="_blank" rel="noopener">
  <span class="lc-ico">🐘</span>
  <span class="lc-body"><span class="lc-title">postgresql.org/docs — the official manual</span><span class="lc-sub">The authoritative reference. More accurate and current than any blog or tutorial.</span></span>
</a>
<a class="link-card dl" href="https://youtu.be/dTN3zLDPT38" target="_blank" rel="noopener">
  <span class="lc-ico">▶️</span>
  <span class="lc-body"><span class="lc-title">"What Led to the Success of PostgreSQL" — Mike Stonebraker (DataCamp)</span><span class="lc-sub">The co-creator on why Postgres won. A short, first-hand history.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>PostgreSQL — từ số 0 tới vận hành trên production</h2>
<p class="lead">Khoá này dạy bạn tư duy theo <strong>quan hệ và kế hoạch truy vấn</strong> như một kỹ sư backend chuyên nghiệp: không phải "viết đại vài câu SQL rồi mong nó nhanh" mà là hiểu cơ sở dữ liệu thật sự lưu gì trên đĩa, vì sao truy vấn này chậm gấp nghìn lần truy vấn kia, và làm sao để nó vừa đúng vừa nhanh dưới tải thật. Mọi truy vấn trong khoá đều chạy trên một máy chủ PostgreSQL thật — nếu có kết quả hiện ra, bạn đang thấy đúng output thật, không phải phỏng đoán.</p>

<h3>Cơ sở dữ liệu giải quyết vấn đề gì?</h3>
<p>Một ứng dụng không có cơ sở dữ liệu giữ mọi thứ trong bộ nhớ (biến, mảng) — và mất sạch ngay khi khởi động lại. Cơ sở dữ liệu là phần trong hệ thống của bạn biết <strong>ghi nhớ</strong>: nó lưu dữ liệu bền vững trên đĩa, cho nhiều người đọc và ghi cùng lúc mà không làm hỏng dữ liệu, trả lời câu hỏi trong vài mili-giây, và bảo đảm một thay đổi làm dở dang không bao giờ trở thành vĩnh viễn. PostgreSQL làm cả bốn việc đó cực tốt.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Lưu bền vững</span><span class="v">Ghi một lần; nó sống sót qua sập máy, khởi động lại và mất điện (đó chính là "tính bền vững" của ACID).</span></div>
  <div class="kv"><span class="k">Truy vấn nhanh</span><span class="v">Tìm 20 dòng trong một triệu dòng trong chưa tới một mili-giây — <em>nếu</em> bạn hiểu chỉ mục (Chương 9–10).</span></div>
  <div class="kv"><span class="k">Nhiều người cùng lúc</span><span class="v">Hàng nghìn lượt đọc/ghi đồng thời mà không cái nào đè lên cái nào (Chương 11: MVCC).</span></div>
  <div class="kv"><span class="k">Được ăn cả, ngã về không</span><span class="v">Một giao dịch hoặc xảy ra trọn vẹn, hoặc không xảy ra gì — không bao giờ nửa vời. Tiền không bao giờ mất giữa lúc chuyển.</span></div>
</div>

<h3>PostgreSQL là gì, ai tạo ra, và nó lớn lên từ đâu?</h3>
<p>Câu chuyện bắt đầu ở <strong>Đại học California, Berkeley (UC Berkeley)</strong>. Thập niên 1970, giáo sư <strong>Michael Stonebraker</strong> (Giải Turing năm 2014) xây <strong>Ingres</strong>, một trong những cơ sở dữ liệu quan hệ đầu tiên. Năm <strong>1986</strong> ông khởi động một dự án kế thừa để khắc phục hạn chế của Ingres và thêm kiểu dữ liệu phong phú hơn — ông đặt tên là <strong>POSTGRES</strong> ("post-Ingres", tức "hậu-Ingres"). Năm 1994, hai nghiên cứu sinh Berkeley là Andrew Yu và Jolly Chen thay ngôn ngữ truy vấn cũ của nó bằng <strong>SQL</strong> và gọi là <strong>Postgres95</strong>. Năm <strong>1996</strong> nó trở thành mã nguồn mở hoàn toàn và đổi tên thành <strong>PostgreSQL</strong> để phản ánh việc hỗ trợ SQL. Video phía trên là chính Stonebraker kể ông đã muốn xây gì.</p>
<p>Điểm mấu chốt: PostgreSQL là một dự án <strong>mã nguồn mở, thuộc về cộng đồng</strong> — không một công ty nào sở hữu nó, và nó đã được phát triển liên tục gần 30 năm. Đó chính là lý do nó được tin dùng cho những hệ thống nghiêm túc: nó sẽ không biến mất, và nó đã có mấy chục năm để làm cho phần "đúng đắn" thật sự đúng.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Ai &amp; khi nào</span><span class="v">Berkeley, dự án POSTGRES của Michael Stonebraker từ 1986; mở nguồn thành PostgreSQL năm 1996. Miễn phí mãi mãi, không chủ sở hữu.</span></div>
  <div class="kv"><span class="k">Nó là gì</span><span class="v">Một máy chủ cơ sở dữ liệu quan hệ (chính xác là "đối tượng-quan hệ") mà bạn nói chuyện qua mạng bằng SQL.</span></div>
  <div class="kv"><span class="k">Dùng ở đâu</span><span class="v">Apple, Instagram, Reddit, Spotify — và toàn bộ backend của trang này. Lựa chọn mặc định cho ứng dụng nghiêm túc mới.</span></div>
  <div class="kv"><span class="k">Vì sao học</span><span class="v">"PostgreSQL" và "SQL" nằm gần đầu hầu hết tin tuyển dụng backend; và kỹ năng chuyển được sang mọi cơ sở dữ liệu SQL khác.</span></div>
</div>

<h3>PostgreSQL vs MySQL vs SQLite — khi nào chọn cái nào</h3>
<p>Bạn sẽ nghe ba cái tên này liên tục. Cả ba đều là cơ sở dữ liệu SQL, nhưng chiếm những vị trí khác nhau. Khoá này về PostgreSQL, nhưng biết cả bức tranh sẽ cho bạn hiểu <em>vì sao</em> nó là mặc định.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">SQLite</span><span class="v">Một cơ sở dữ liệu nằm gọn trong một file, nhúng thẳng vào ứng dụng — không có máy chủ. Hoàn hảo cho app điện thoại, công cụ desktop, hay chạy test. Không hợp cho nhiều người ghi cùng lúc.</span></div>
  <div class="kv"><span class="k">MySQL</span><span class="v">Một máy chủ như Postgres, rất phổ biến, trước đây đơn giản hơn. PostgreSQL có kiểu dữ liệu phong phú hơn (JSONB, mảng), khắt khe hơn về tính đúng, và bộ lập kế hoạch truy vấn mạnh hơn.</span></div>
  <div class="kv"><span class="k">PostgreSQL</span><span class="v">Máy chủ với bộ tính năng giàu nhất: JSONB, full-text search, hàm cửa sổ, CTE, ACID thật với MVCC. Mặc định an toàn cho backend web.</span></div>
</div>
<div class="callout ok">Quy tắc bỏ túi: nếu bạn đang xây backend cho một web app và chưa chắc chọn cơ sở dữ liệu nào — hãy chọn PostgreSQL. Bạn sẽ không "lớn quá cỡ" nó trong rất lâu, và mọi thứ học ở đây đều là SQL chuẩn, chuyển được sang chỗ khác.</div>

<h3>Bản đồ toàn khoá — 4 giai đoạn, 16 chương</h3>
<p>Mỗi giai đoạn dựa trên giai đoạn trước. Bạn không đọc nổi một kế hoạch truy vấn (Chương 10) nếu phần JOIN (Chương 5) chưa thông, và không tinh chỉnh được chỉ mục (Chương 9) nếu chưa biết các kiểu dữ liệu nó dựng trên đó (Chương 2).</p>
<div class="lz-map">
  <div class="lz-stage">Giai đoạn 1 · Nền tảng</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Vì sao PostgreSQL tồn tại</div><div class="lz-nsub">Mô hình quan hệ, ACID, client-server, vs MySQL/SQLite, khi nào dùng</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Kiểu dữ liệu</div><div class="lz-nsub">numeric, text, boolean, timestamptz, uuid, enum, array, jsonb — chọn đúng kiểu</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Bảng, ràng buộc &amp; thiết kế lược đồ</div><div class="lz-nsub">Khoá chính/ngoại, unique, check, not null, cột generated &amp; identity</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Chèn &amp; truy vấn</div><div class="lz-nsub">INSERT, SELECT, WHERE, ORDER BY, LIMIT, DISTINCT, UPSERT (ON CONFLICT)</div></div></div>
  <div class="lz-stage">Giai đoạn 2 · Truy vấn sâu hơn</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">JOIN</div><div class="lz-nsub">inner, left, right, full, self, cross và lateral join — ghép các bảng</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Tổng hợp &amp; gom nhóm</div><div class="lz-nsub">GROUP BY, HAVING, count/sum/avg, FILTER, GROUPING SETS</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Truy vấn con &amp; CTE</div><div class="lz-nsub">Truy vấn con vô hướng/tương quan, WITH, CTE đệ quy</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Hàm cửa sổ</div><div class="lz-nsub">ROW_NUMBER, RANK, LAG/LEAD, tổng luỹ tiến, khung (frame)</div></div></div>
  <div class="lz-stage">Giai đoạn 3 · Hiệu năng &amp; bên trong</div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Chỉ mục</div><div class="lz-nsub">B-tree, partial, biểu thức, tổ hợp, covering, GIN, GiST, BRIN</div></div></div>
  <div class="lz-node"><div class="lz-badge">10</div><div class="lz-nbody"><div class="lz-ntitle">EXPLAIN ANALYZE &amp; bộ lập kế hoạch</div><div class="lz-nsub">Seq scan vs index scan, cost, buffers, thống kê, vì sao truy vấn chậm</div></div></div>
  <div class="lz-node"><div class="lz-badge">11</div><div class="lz-nbody"><div class="lz-ntitle">Giao dịch &amp; đồng thời</div><div class="lz-nsub">ACID, các mức cô lập, MVCC, khoá dòng, deadlock</div></div></div>
  <div class="lz-node"><div class="lz-badge">12</div><div class="lz-nbody"><div class="lz-ntitle">Hàm, trigger &amp; view</div><div class="lz-nsub">PL/pgSQL, trigger, view, materialized view</div></div></div>
  <div class="lz-stage">Giai đoạn 4 · Trên production</div>
  <div class="lz-node"><div class="lz-badge">13</div><div class="lz-nbody"><div class="lz-ntitle">JSONB &amp; full-text search</div><div class="lz-nsub">Toán tử jsonb, chỉ mục GIN, tsvector/tsquery, tìm kiếm trigram</div></div></div>
  <div class="lz-node"><div class="lz-badge">14</div><div class="lz-nbody"><div class="lz-ntitle">Kết nối, pool &amp; vận hành</div><div class="lz-nsub">Connection pool, PgBouncer, VACUUM/autovacuum, bloat, giám sát</div></div></div>
  <div class="lz-node"><div class="lz-badge">15</div><div class="lz-nbody"><div class="lz-ntitle">Sao lưu, nhân bản &amp; mở rộng</div><div class="lz-nsub">pg_dump, WAL, streaming replication, phân mảnh, read replica</div></div></div>
  <div class="lz-node"><div class="lz-badge">16</div><div class="lz-nbody"><div class="lz-ntitle">PostgreSQL trong production &amp; capstone</div><div class="lz-nsub">Prisma &amp; migration, lược đồ thật của trang này, một checklist production</div></div></div>
</div>

<h3>Khoá này dành cho ai</h3>
<p>Bạn <strong>không cần</strong> kinh nghiệm cơ sở dữ liệu nào trước. Nếu bạn dùng được terminal và đã viết chút code bằng bất kỳ ngôn ngữ nào, bạn đã sẵn sàng. Chương 1 bắt đầu từ đầu. Nếu bạn đã học khoá Node.js (Chương 7 là Prisma/PostgreSQL), khoá này là phần đào sâu vào chính cơ sở dữ liệu mà Chương 7 mới chỉ nếm thử.</p>
<div class="callout ok">Ngân sách thời gian: khoảng <strong>2–3 giờ mỗi chương</strong> nếu bạn gõ và tự chạy mọi truy vấn. 16 chương ≈ 40–50 giờ để thấm thật sự. Mục tiêu không phải "học cho xong" — mà là tới được điểm bạn nhìn một truy vấn chậm, đọc kế hoạch của nó, và biết chính xác cần sửa gì.</div>
<div class="note-ct">Trang này (cuongthai.com) chạy trên PostgreSQL 15.4 ở production: khoảng 248 bảng, 95 migration, lược đồ 6.980 dòng, lưu mọi user, bài đăng, tin nhắn, khoá học và ghi chú bạn thấy. Khi một chương nói "đây là cách làm trong production", nghĩa là <em>ở đây</em> — kể cả bài toán connection-pool thật (12 client × pool 10 = 120 &gt; giới hạn 100 kết nối) mà Chương 14 mổ xẻ.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Track thực hành: PostgreSQL trên Code Lab</span><span class="lc-sub">Bài tập SQL thực hành có lời giải — phần luyện tập đi kèm khoá này.</span></span>
</a>
<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://www.postgresql.org/docs/" target="_blank" rel="noopener">
  <span class="lc-ico">🐘</span>
  <span class="lc-body"><span class="lc-title">postgresql.org/docs — tài liệu chính thức</span><span class="lc-sub">Nguồn tham chiếu chuẩn mực. Chính xác và cập nhật hơn mọi blog hay tutorial.</span></span>
</a>
<a class="link-card dl" href="https://youtu.be/dTN3zLDPT38" target="_blank" rel="noopener">
  <span class="lc-ico">▶️</span>
  <span class="lc-body"><span class="lc-title">"What Led to the Success of PostgreSQL" — Mike Stonebraker (DataCamp)</span><span class="lc-sub">Người đồng sáng tạo nói về vì sao Postgres thắng. Một mẩu lịch sử ngắn, kể từ người trong cuộc.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 0.2 ─────────────────────────── */
    {
      title: '0.2 — How to study this course|||0.2 — Cách học khoá này',
      slug: 'postgresql-0-2-cach-hoc',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Cách học hiệu quả nhất: gõ lại mọi truy vấn, luôn đọc kế hoạch, và "chạy mới biết" thay vì đọc suông.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>How to actually learn SQL (not just read about it)</h2>
<p class="lead">SQL looks deceptively easy to read — which is exactly why so many people can read it and not write it. The trap is that a query can be <em>syntactically fine, return rows, and still be wrong or a thousand times too slow</em>. You only build the instinct to spot that by running queries yourself against real data. This lesson is the method.</p>

<h3>The one rule: type it and run it</h3>
<p>Do not read this course like a novel. Keep a terminal open with <code>psql</code> next to the lesson. Every time you see a query, type it (don't copy-paste — typing forces you to read every token) and run it. When a lesson shows an output, predict it <strong>before</strong> you scroll, then check. The gap between your prediction and reality is where the learning happens.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-st">Read the query</div><div class="lz-sd">Say out loud what you think it returns and roughly how fast.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-st">Run it</div><div class="lz-sd">In psql, on the same sample data the lesson uses.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-st">Compare</div><div class="lz-sd">Did the rows match? Was it fast? If not — why? That "why" is the lesson.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-st">Break it</div><div class="lz-sd">Change a JOIN to a different type, drop the WHERE, remove the index — see what happens.</div></div>
</div>

<h3>Reading, not memorising</h3>
<p>Nobody memorises SQL syntax. Professionals keep the official docs open and look things up constantly. What you're building here is not a memory of syntax — it's a <strong>mental model</strong>: how rows are stored, what an index really is, why a JOIN can explode into millions of rows, what a transaction actually locks. Once the model is right, the syntax is a five-second lookup.</p>
<div class="callout ok">The single most valuable skill in this whole course is reading <code>EXPLAIN ANALYZE</code> (Chapter 10). Everything before it teaches you to write correct queries; that chapter teaches you to know <em>why</em> one is slow. Do not skip it.</div>

<h3>The five habits of someone good at SQL</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Always LIMIT while exploring</span><span class="v">On a big table, a bare <code>SELECT *</code> can return millions of rows and freeze your terminal. Add <code>LIMIT 20</code> until you know the shape.</span></div>
  <div class="kv"><span class="k">Read the plan before blaming the query</span><span class="v">Slow? Run <code>EXPLAIN ANALYZE</code> first. The plan tells you if it's a missing index, a bad join, or too much data — don't guess.</span></div>
  <div class="kv"><span class="k">Let the database do the work</span><span class="v">Filtering, sorting, aggregating and joining in SQL is far faster than pulling rows into your app and looping. The database is built for it.</span></div>
  <div class="kv"><span class="k">Never trust input in a query string</span><span class="v">Always use parameters, never string-concatenate values into SQL (that's SQL injection). Chapter 4 and the Node.js course both show this live.</span></div>
  <div class="kv"><span class="k">Wrap multi-step changes in a transaction</span><span class="v">If step 2 fails, step 1 should roll back. <code>BEGIN; … COMMIT;</code> — Chapter 11.</span></div>
</div>

<h3>What "real output" means in this course</h3>
<p>Throughout the course you'll see boxes like this — they are the <em>actual</em> result of running the query on a real PostgreSQL 15.4 server, copied verbatim:</p>
<div class="out">
 tong | co_body
------+---------
    3 |       2
(1 row)
</div>
<p>When a query is claimed to be slow, you'll see its real timing from <code>EXPLAIN ANALYZE</code>. When one is claimed to error, you'll see the real error message and its code (like <code>23505 duplicate key value violates unique constraint</code>). Nothing in this course is "probably right".</p>
<div class="note-ct">Why this matters: on this site, a database mistake is not abstract. A missing index once turned a feed query from 0.1 ms into 100 ms under load; a connection-pool miscalculation once hit the "sorry, too many clients already" wall in production. Every number in this course is the kind of number that decides whether a page loads or times out.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Do the drills after each chapter</span><span class="lc-sub">The Code Lab PostgreSQL track turns each chapter's ideas into hands-on exercises.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Cách thật sự học SQL (không chỉ đọc về nó)</h2>
<p class="lead">SQL trông dễ đọc một cách đánh lừa — và đó chính là lý do rất nhiều người đọc được nó mà không viết được. Cái bẫy là một truy vấn có thể <em>đúng cú pháp, trả về dòng, mà vẫn sai hoặc chậm gấp nghìn lần</em>. Bạn chỉ xây được bản năng nhận ra điều đó bằng cách tự chạy truy vấn trên dữ liệu thật. Bài này là phương pháp.</p>

<h3>Một quy tắc duy nhất: gõ và chạy</h3>
<p>Đừng đọc khoá này như đọc tiểu thuyết. Mở sẵn một terminal với <code>psql</code> bên cạnh bài học. Mỗi lần thấy một truy vấn, hãy gõ nó (đừng copy-paste — gõ buộc bạn đọc từng token) rồi chạy. Khi một bài hiện output, hãy đoán nó <strong>trước khi</strong> cuộn xuống, rồi kiểm. Khoảng cách giữa dự đoán của bạn và thực tế chính là chỗ việc học diễn ra.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-st">Đọc truy vấn</div><div class="lz-sd">Nói to ra bạn nghĩ nó trả về gì và nhanh cỡ nào.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-st">Chạy nó</div><div class="lz-sd">Trong psql, trên đúng dữ liệu mẫu mà bài dùng.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-st">So sánh</div><div class="lz-sd">Các dòng có khớp không? Có nhanh không? Nếu không — vì sao? Cái "vì sao" đó là bài học.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-st">Phá nó</div><div class="lz-sd">Đổi JOIN sang loại khác, bỏ WHERE, xoá chỉ mục — xem chuyện gì xảy ra.</div></div>
</div>

<h3>Đọc tra cứu, không học thuộc</h3>
<p>Không ai học thuộc cú pháp SQL. Dân chuyên nghiệp luôn mở tài liệu chính thức và tra cứu liên tục. Cái bạn đang xây ở đây không phải trí nhớ về cú pháp — mà là một <strong>mô hình tư duy</strong>: dòng được lưu thế nào, chỉ mục thật sự là gì, vì sao một JOIN có thể nổ thành hàng triệu dòng, một giao dịch thật sự khoá cái gì. Khi mô hình đã đúng, cú pháp chỉ là chuyện tra cứu năm giây.</p>
<div class="callout ok">Kỹ năng giá trị nhất trong cả khoá này là đọc <code>EXPLAIN ANALYZE</code> (Chương 10). Mọi thứ trước đó dạy bạn viết truy vấn đúng; chương đó dạy bạn biết <em>vì sao</em> một truy vấn chậm. Đừng bỏ qua nó.</div>

<h3>Năm thói quen của người giỏi SQL</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Luôn LIMIT khi thăm dò</span><span class="v">Trên bảng lớn, một <code>SELECT *</code> trần có thể trả về hàng triệu dòng và làm đơ terminal. Thêm <code>LIMIT 20</code> cho tới khi bạn biết hình dạng dữ liệu.</span></div>
  <div class="kv"><span class="k">Đọc kế hoạch trước khi trách truy vấn</span><span class="v">Chậm à? Chạy <code>EXPLAIN ANALYZE</code> trước. Kế hoạch nói cho bạn là thiếu chỉ mục, join tồi, hay quá nhiều dữ liệu — đừng đoán.</span></div>
  <div class="kv"><span class="k">Để cơ sở dữ liệu làm việc</span><span class="v">Lọc, sắp xếp, tổng hợp và join trong SQL nhanh hơn nhiều so với kéo dòng về app rồi lặp. Cơ sở dữ liệu sinh ra để làm việc đó.</span></div>
  <div class="kv"><span class="k">Đừng bao giờ tin dữ liệu nhét thẳng vào chuỗi truy vấn</span><span class="v">Luôn dùng tham số, không bao giờ nối chuỗi giá trị vào SQL (đó là SQL injection). Chương 4 và khoá Node.js đều minh hoạ trực tiếp.</span></div>
  <div class="kv"><span class="k">Bọc thay đổi nhiều bước trong một giao dịch</span><span class="v">Nếu bước 2 hỏng, bước 1 phải cuộn ngược. <code>BEGIN; … COMMIT;</code> — Chương 11.</span></div>
</div>

<h3>"Output thật" trong khoá này nghĩa là gì</h3>
<p>Suốt khoá bạn sẽ thấy những khối như thế này — chúng là kết quả <em>thật</em> của việc chạy truy vấn trên một máy chủ PostgreSQL 15.4 thật, chép nguyên văn:</p>
<div class="out">
 tong | co_body
------+---------
    3 |       2
(1 row)
</div>
<p>Khi một truy vấn được nói là chậm, bạn sẽ thấy thời gian thật của nó từ <code>EXPLAIN ANALYZE</code>. Khi một truy vấn được nói là lỗi, bạn sẽ thấy đúng thông báo lỗi và mã của nó (như <code>23505 duplicate key value violates unique constraint</code>). Không có gì trong khoá này là "chắc là đúng".</p>
<div class="note-ct">Vì sao điều này quan trọng: trên trang này, một lỗi cơ sở dữ liệu không hề trừu tượng. Một chỉ mục bị thiếu từng biến một truy vấn feed từ 0,1 ms thành 100 ms dưới tải; một phép tính sai về connection-pool từng đâm vào bức tường "sorry, too many clients already" trên production. Mọi con số trong khoá này là loại con số quyết định một trang tải được hay bị time-out.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Làm bài luyện sau mỗi chương</span><span class="lc-sub">Track PostgreSQL trên Code Lab biến ý tưởng mỗi chương thành bài tập thực hành.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 0.3 ─────────────────────────── */
    {
      title: '0.3 — Installing PostgreSQL & meeting psql|||0.3 — Cài đặt PostgreSQL & làm quen psql',
      slug: 'postgresql-0-3-cai-dat',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Cài PostgreSQL (Docker hoặc bản gốc), kết nối bằng psql, và chạy câu lệnh SQL đầu tiên — với output THẬT.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>Installing PostgreSQL and running your first query</h2>
<p class="lead">There are two ways to get a PostgreSQL server: install it natively, or run it in Docker. Docker is the fastest way to a clean, disposable database and it's what this course uses for its examples — but native installs are what you'll often meet in the wild, so we cover both. Then we connect with <code>psql</code>, the command-line client, and run real SQL.</p>

<h3>Option A — Docker (recommended for this course)</h3>
<p>If you have Docker, one command gives you a fully working PostgreSQL 15 server. It listens on port 5432 inside the container; we map it to a host port so <code>psql</code> can reach it:</p>
<pre><code><span class="tok-comment"># Start a throwaway PostgreSQL 15 server</span>
docker run -d --name pg15 \\
  -e POSTGRES_PASSWORD=123456 \\
  -p 5433:5432 \\
  postgres:15

<span class="tok-comment"># Check it's up</span>
docker ps</code></pre>
<p>The <code>-e POSTGRES_PASSWORD=123456</code> sets the password for the default <code>postgres</code> superuser. <code>-p 5433:5432</code> means "connect to port 5433 on my machine to reach port 5432 in the container". The data lives inside the container — good enough for learning; Chapter 15 covers keeping it safe with volumes and backups.</p>

<h3>Option B — Native install</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">macOS</span><span class="v"><code>brew install postgresql@15</code> then <code>brew services start postgresql@15</code>. Or use the Postgres.app one-click app.</span></div>
  <div class="kv"><span class="k">Ubuntu/Debian</span><span class="v"><code>sudo apt install postgresql</code> — it starts automatically and listens on port 5432.</span></div>
  <div class="kv"><span class="k">Windows</span><span class="v">The EnterpriseDB installer from postgresql.org, which bundles the server + psql + pgAdmin.</span></div>
</div>

<h3>Connecting with psql</h3>
<p><code>psql</code> is the official terminal client — a REPL where you type SQL and meta-commands. Connect to the Docker server above like this (it will prompt for the password, <code>123456</code>):</p>
<pre><code>psql -h localhost -p 5433 -U postgres</code></pre>
<p>Once connected, <code>\\conninfo</code> confirms exactly where you are — a good habit before running anything destructive:</p>
<div class="out">You are connected to database "pgcourse" as user "postgres" on host "localhost" (address "::1") at port "5433".</div>
<p>And <code>SELECT version();</code> shows the exact server build. This is the real output from the server this course runs on:</p>
<div class="out">                                                          version
---------------------------------------------------------------------------------------------------------------------------
 PostgreSQL 15.4 (Debian 15.4-2.pgdg120+1) on aarch64-unknown-linux-gnu, compiled by gcc (Debian 12.2.0-14) 12.2.0, 64-bit
(1 row)</div>

<h3>Server, database, table — the three levels</h3>
<p>One PostgreSQL <strong>server</strong> holds many <strong>databases</strong>; each database holds many <strong>tables</strong>. When you connect you're always inside exactly one database. Let's create one for this course and switch into it:</p>
<pre><code><span class="tok-comment">-- run while connected to the default 'postgres' database</span>
CREATE DATABASE pgcourse;
<span class="tok-comment">-- then in psql, switch into it:</span>
\\c pgcourse</code></pre>

<h3>Your first table and query</h3>
<p>Here is the running example we'll use across early chapters — a simple <code>notes</code> table. Type this in and run it:</p>
<pre><code>CREATE TABLE notes (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title      varchar(200) NOT NULL,
  body       text,
  pinned     boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO notes (title, body) VALUES
  ('Learn PostgreSQL', 'Day one'),
  ('Buy coffee', NULL),
  ('Read the manual', 'The EXPLAIN chapter');

SELECT id, title, pinned, created_at FROM notes ORDER BY id;</code></pre>
<p>PostgreSQL confirms each statement, then returns the rows. This is the real output:</p>
<div class="out">CREATE TABLE
INSERT 0 3
 id |      title       | pinned |          created_at
----+------------------+--------+-------------------------------
  1 | Learn PostgreSQL | f      | 2026-08-09 21:09:17.721548+00
  2 | Buy coffee       | f      | 2026-08-09 21:09:17.721548+00
  3 | Read the manual  | f      | 2026-08-09 21:09:17.721548+00
(3 rows)</div>
<p>Notice: <code>id</code> filled itself in (1, 2, 3) because of <code>GENERATED ALWAYS AS IDENTITY</code>; <code>pinned</code> defaulted to <code>f</code> (false); <code>created_at</code> defaulted to the current time; and the two rows inserted in the same statement share the exact same timestamp because <code>now()</code> returns the time the <em>transaction</em> started, not each row. Chapter 2 explains every one of these types.</p>

<h3>The psql meta-commands you'll use daily</h3>
<p>Commands starting with a backslash are <strong>psql meta-commands</strong> (they're not SQL — they're the client's shortcuts). The most important:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">\\l</span><span class="v">List all databases on the server.</span></div>
  <div class="kv"><span class="k">\\c dbname</span><span class="v">Connect to (switch into) a different database.</span></div>
  <div class="kv"><span class="k">\\dt</span><span class="v">List the tables in the current database.</span></div>
  <div class="kv"><span class="k">\\d tablename</span><span class="v">Describe one table — its columns, types, and indexes.</span></div>
  <div class="kv"><span class="k">\\x</span><span class="v">Toggle expanded display (one column per line) — great for wide rows.</span></div>
  <div class="kv"><span class="k">\\q</span><span class="v">Quit psql.</span></div>
</div>
<p><code>\\dt</code> right now shows the one table we made:</p>
<div class="out">         List of relations
 Schema | Name  | Type  |  Owner
--------+-------+-------+----------
 public | notes | table | postgres
(1 row)</div>
<p>And <code>\\d notes</code> describes it — every column, its type, whether it's nullable, its default, and the primary-key index PostgreSQL created automatically:</p>
<div class="out">                                    Table "public.notes"
   Column   |           Type           | Collation | Nullable |           Default
------------+--------------------------+-----------+----------+------------------------------
 id         | bigint                   |           | not null | generated always as identity
 title      | character varying(200)   |           | not null |
 body       | text                     |           |          |
 pinned     | boolean                  |           | not null | false
 created_at | timestamp with time zone |           | not null | now()
Indexes:
    "notes_pkey" PRIMARY KEY, btree (id)</div>
<div class="pitfall">
<p><strong>Common first-timer confusion:</strong> "I typed a query and nothing happened." In psql, a statement doesn't run until you end it with a semicolon <code>;</code> and press Enter. If your prompt changed from <code>pgcourse=#</code> to <code>pgcourse-#</code>, psql is still waiting for you to finish the statement — type the <code>;</code>. Also, GUI tools like <strong>pgAdmin</strong>, <strong>DBeaver</strong>, or <strong>TablePlus</strong> are lovely, but learn <code>psql</code> first: it's on every server, needs no setup, and is what you'll fall back to when something is on fire at 2am.</p>
</div>
<div class="note-ct">This course's examples run on a Postgres reachable at <code>localhost:5433</code> (a Docker container), and the "100 Ngày Database" series on this site uses the very same setup. If you match it — Docker, port 5433, password 123456 — every query in this course will produce the exact output shown.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Set up your practice database</span><span class="lc-sub">The Code Lab track walks you through the same install and gives you data to query.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Cài đặt PostgreSQL và chạy truy vấn đầu tiên</h2>
<p class="lead">Có hai cách để có một máy chủ PostgreSQL: cài bản gốc, hoặc chạy trong Docker. Docker là cách nhanh nhất để có một cơ sở dữ liệu sạch, dùng xong bỏ, và là cách khoá này dùng cho các ví dụ — nhưng bản cài gốc là thứ bạn thường gặp ngoài đời, nên ta nói cả hai. Sau đó ta kết nối bằng <code>psql</code>, client dòng lệnh, và chạy SQL thật.</p>

<h3>Cách A — Docker (khuyên dùng cho khoá này)</h3>
<p>Nếu bạn có Docker, một lệnh cho bạn một máy chủ PostgreSQL 15 chạy đầy đủ. Nó lắng nghe cổng 5432 bên trong container; ta ánh xạ ra một cổng của máy để <code>psql</code> với tới:</p>
<pre><code><span class="tok-comment"># Khởi động một máy chủ PostgreSQL 15 dùng xong bỏ</span>
docker run -d --name pg15 \\
  -e POSTGRES_PASSWORD=123456 \\
  -p 5433:5432 \\
  postgres:15

<span class="tok-comment"># Kiểm tra nó đang chạy</span>
docker ps</code></pre>
<p><code>-e POSTGRES_PASSWORD=123456</code> đặt mật khẩu cho superuser mặc định tên <code>postgres</code>. <code>-p 5433:5432</code> nghĩa là "kết nối tới cổng 5433 trên máy tôi để với tới cổng 5432 trong container". Dữ liệu nằm bên trong container — đủ cho việc học; Chương 15 sẽ nói cách giữ nó an toàn bằng volume và sao lưu.</p>

<h3>Cách B — Cài bản gốc</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">macOS</span><span class="v"><code>brew install postgresql@15</code> rồi <code>brew services start postgresql@15</code>. Hoặc dùng app Postgres.app bấm-một-nút.</span></div>
  <div class="kv"><span class="k">Ubuntu/Debian</span><span class="v"><code>sudo apt install postgresql</code> — nó tự khởi động và lắng nghe cổng 5432.</span></div>
  <div class="kv"><span class="k">Windows</span><span class="v">Bộ cài EnterpriseDB từ postgresql.org, gói sẵn máy chủ + psql + pgAdmin.</span></div>
</div>

<h3>Kết nối bằng psql</h3>
<p><code>psql</code> là client terminal chính thức — một REPL nơi bạn gõ SQL và các lệnh meta. Kết nối tới máy chủ Docker phía trên như sau (nó sẽ hỏi mật khẩu, <code>123456</code>):</p>
<pre><code>psql -h localhost -p 5433 -U postgres</code></pre>
<p>Khi đã kết nối, <code>\\conninfo</code> xác nhận chính xác bạn đang ở đâu — một thói quen tốt trước khi chạy bất cứ thứ gì có thể phá dữ liệu:</p>
<div class="out">You are connected to database "pgcourse" as user "postgres" on host "localhost" (address "::1") at port "5433".</div>
<p>Và <code>SELECT version();</code> hiện đúng bản build của máy chủ. Đây là output thật từ chính máy chủ khoá này chạy trên đó:</p>
<div class="out">                                                          version
---------------------------------------------------------------------------------------------------------------------------
 PostgreSQL 15.4 (Debian 15.4-2.pgdg120+1) on aarch64-unknown-linux-gnu, compiled by gcc (Debian 12.2.0-14) 12.2.0, 64-bit
(1 row)</div>

<h3>Máy chủ, cơ sở dữ liệu, bảng — ba cấp</h3>
<p>Một <strong>máy chủ</strong> PostgreSQL chứa nhiều <strong>cơ sở dữ liệu</strong>; mỗi cơ sở dữ liệu chứa nhiều <strong>bảng</strong>. Khi kết nối, bạn luôn ở bên trong đúng một cơ sở dữ liệu. Hãy tạo một cái cho khoá này rồi chuyển vào:</p>
<pre><code><span class="tok-comment">-- chạy khi đang kết nối tới cơ sở dữ liệu mặc định 'postgres'</span>
CREATE DATABASE pgcourse;
<span class="tok-comment">-- rồi trong psql, chuyển vào nó:</span>
\\c pgcourse</code></pre>

<h3>Bảng đầu tiên và truy vấn đầu tiên</h3>
<p>Đây là ví dụ xuyên suốt ta sẽ dùng qua các chương đầu — một bảng <code>notes</code> đơn giản. Gõ vào và chạy:</p>
<pre><code>CREATE TABLE notes (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title      varchar(200) NOT NULL,
  body       text,
  pinned     boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO notes (title, body) VALUES
  ('Learn PostgreSQL', 'Day one'),
  ('Buy coffee', NULL),
  ('Read the manual', 'The EXPLAIN chapter');

SELECT id, title, pinned, created_at FROM notes ORDER BY id;</code></pre>
<p>PostgreSQL xác nhận từng câu lệnh, rồi trả về các dòng. Đây là output thật:</p>
<div class="out">CREATE TABLE
INSERT 0 3
 id |      title       | pinned |          created_at
----+------------------+--------+-------------------------------
  1 | Learn PostgreSQL | f      | 2026-08-09 21:09:17.721548+00
  2 | Buy coffee       | f      | 2026-08-09 21:09:17.721548+00
  3 | Read the manual  | f      | 2026-08-09 21:09:17.721548+00
(3 rows)</div>
<p>Để ý: <code>id</code> tự điền (1, 2, 3) nhờ <code>GENERATED ALWAYS AS IDENTITY</code>; <code>pinned</code> mặc định thành <code>f</code> (false); <code>created_at</code> mặc định thành thời điểm hiện tại; và hai dòng chèn trong cùng một câu lệnh chia sẻ đúng cùng một mốc thời gian, vì <code>now()</code> trả về thời điểm <em>giao dịch</em> bắt đầu, chứ không phải từng dòng. Chương 2 giải thích từng kiểu một trong số này.</p>

<h3>Các lệnh meta của psql bạn dùng hằng ngày</h3>
<p>Các lệnh bắt đầu bằng dấu gạch chéo ngược là <strong>lệnh meta của psql</strong> (chúng không phải SQL — mà là lối tắt của client). Quan trọng nhất:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">\\l</span><span class="v">Liệt kê mọi cơ sở dữ liệu trên máy chủ.</span></div>
  <div class="kv"><span class="k">\\c tendb</span><span class="v">Kết nối (chuyển vào) một cơ sở dữ liệu khác.</span></div>
  <div class="kv"><span class="k">\\dt</span><span class="v">Liệt kê các bảng trong cơ sở dữ liệu hiện tại.</span></div>
  <div class="kv"><span class="k">\\d tenbang</span><span class="v">Mô tả một bảng — cột, kiểu, và chỉ mục của nó.</span></div>
  <div class="kv"><span class="k">\\x</span><span class="v">Bật/tắt kiểu hiển thị mở rộng (mỗi cột một dòng) — rất hợp cho dòng rộng.</span></div>
  <div class="kv"><span class="k">\\q</span><span class="v">Thoát psql.</span></div>
</div>
<p><code>\\dt</code> ngay lúc này hiện đúng một bảng ta vừa tạo:</p>
<div class="out">         List of relations
 Schema | Name  | Type  |  Owner
--------+-------+-------+----------
 public | notes | table | postgres
(1 row)</div>
<p>Và <code>\\d notes</code> mô tả nó — từng cột, kiểu của nó, có cho phép NULL không, giá trị mặc định, và chỉ mục khoá chính mà PostgreSQL tự tạo:</p>
<div class="out">                                    Table "public.notes"
   Column   |           Type           | Collation | Nullable |           Default
------------+--------------------------+-----------+----------+------------------------------
 id         | bigint                   |           | not null | generated always as identity
 title      | character varying(200)   |           | not null |
 body       | text                     |           |          |
 pinned     | boolean                  |           | not null | false
 created_at | timestamp with time zone |           | not null | now()
Indexes:
    "notes_pkey" PRIMARY KEY, btree (id)</div>
<div class="pitfall">
<p><strong>Nhầm lẫn thường gặp của người mới:</strong> "Tôi gõ truy vấn mà không thấy gì xảy ra." Trong psql, một câu lệnh chưa chạy cho tới khi bạn kết thúc nó bằng dấu chấm phẩy <code>;</code> rồi nhấn Enter. Nếu dấu nhắc của bạn đổi từ <code>pgcourse=#</code> thành <code>pgcourse-#</code>, psql vẫn đang chờ bạn kết thúc câu lệnh — hãy gõ dấu <code>;</code>. Ngoài ra, các công cụ đồ hoạ như <strong>pgAdmin</strong>, <strong>DBeaver</strong>, hay <strong>TablePlus</strong> rất dễ chịu, nhưng hãy học <code>psql</code> trước: nó có trên mọi máy chủ, không cần cài đặt gì, và là thứ bạn quay về khi có sự cố lúc 2 giờ sáng.</p>
</div>
<div class="note-ct">Ví dụ của khoá này chạy trên một Postgres với tới được ở <code>localhost:5433</code> (một container Docker), và loạt "100 Ngày Database" trên trang này dùng đúng cùng thiết lập đó. Nếu bạn làm khớp — Docker, cổng 5433, mật khẩu 123456 — mọi truy vấn trong khoá sẽ cho đúng output như hiển thị.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Dựng cơ sở dữ liệu luyện tập của bạn</span><span class="lc-sub">Track Code Lab dẫn bạn qua đúng bước cài này và cho bạn dữ liệu để truy vấn.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 0.4 ─────────────────────────── */
    {
      title: '0.4 — The mental model: a server you talk to in SQL|||0.4 — Mô hình tư duy: một máy chủ bạn nói chuyện bằng SQL',
      slug: 'postgresql-0-4-mo-hinh',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Mô hình client-server, SQL là ngôn ngữ khai báo, và dự án "Notes" xuyên suốt khoá — cộng một cái nhìn thoáng qua sự phong phú kiểu dữ liệu của Postgres.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>The one mental model that makes everything click</h2>
<p class="lead">Before any syntax, internalise this: PostgreSQL is a <strong>separate program</strong> — a server — running on its own, often on a different machine from your app. Your app is a <strong>client</strong> that opens a connection over the network, sends text (SQL), and gets rows back. Almost every confusing thing about databases becomes obvious once you hold this picture firmly.</p>

<h3>Client and server, not a library</h3>
<p>A beginner's instinct is to imagine the database as "part of my code". It isn't. Your Node/Python/Go app and PostgreSQL are two processes that talk over a socket. That single fact explains a huge amount:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Why connections cost</span><span class="v">Opening a connection means a network round-trip + authentication. That's why apps use a <em>pool</em> of reused connections (Chapter 14) — the Node.js course measured a fresh connection at 8 ms vs 0.38 ms reused.</span></div>
  <div class="kv"><span class="k">Why there's a connection limit</span><span class="v">Each connection is a real server process using memory. The default cap is 100. Exceed it and you get <code>too many clients already</code> — a real production incident on this site.</span></div>
  <div class="kv"><span class="k">Why SQL is text</span><span class="v">You send a query <em>string</em> across the wire. That's also why never building that string from user input matters — it's how SQL injection happens.</span></div>
  <div class="kv"><span class="k">Why the DB survives your app</span><span class="v">Restart your app and the data is still there — it lives in the server's files, not your app's memory.</span></div>
</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-st">Client connects</div><div class="lz-sd">Your app (or psql) opens a TCP connection and authenticates.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-st">Client sends SQL</div><div class="lz-sd">A query string like <code>SELECT * FROM notes WHERE pinned</code>.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-st">Server plans &amp; runs</div><div class="lz-sd">The planner picks a strategy (scan? use an index?), executes it against data on disk.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-st">Server returns rows</div><div class="lz-sd">Results travel back over the connection. The client displays or uses them.</div></div>
</div>

<h3>SQL is declarative — you say what, not how</h3>
<p>This is the second big idea. In most programming you write <em>how</em> to do something: loop over the array, check each item, collect matches. In SQL you write <em>what</em> you want and the database figures out how:</p>
<pre><code>SELECT title FROM notes WHERE pinned = true ORDER BY created_at DESC;</code></pre>
<p>You never told PostgreSQL to "loop over rows" or "use the index on <code>created_at</code>". You described the result you want; the <strong>query planner</strong> decides the actual strategy — and it might choose a sequential scan, an index scan, a sort, or skip the sort entirely if an index already provides the order. That gap between <em>what you asked</em> and <em>how it ran</em> is the entire subject of Chapter 10, and it's why the same query can be fast or catastrophically slow depending on indexes and data size.</p>
<div class="callout ok">Because SQL is declarative, the way to make a query faster is usually <strong>not</strong> to rewrite the query — it's to give the planner a better option (an index) or better information (up-to-date statistics). You change the <em>how</em> without touching the <em>what</em>.</div>

<h3>A glimpse of why PostgreSQL, specifically</h3>
<p>Postgres isn't just "tables of numbers and text". Its type system is unusually rich — you can store structured JSON, arrays, UUIDs, precise timestamps and time intervals as first-class values, and query into them. Here's one query touching several at once (real output):</p>
<pre><code>SELECT
  '{"lang":"vi","tags":["db","sql"]}'::jsonb  AS data,
  array[1,2,3]                                 AS nums,
  gen_random_uuid()                            AS id,
  now()::date                                  AS today,
  '3 days'::interval                           AS span;</code></pre>
<div class="out">                 data                  |  nums   |                  id                  |   today    |  span
---------------------------------------+---------+--------------------------------------+------------+--------
 {"lang": "vi", "tags": ["db", "sql"]} | {1,2,3} | de9ac9ba-a4e4-4dd0-84cd-2efa8255cd4a | 2026-08-09 | 3 days
(1 row)</div>
<p>And you can reach <em>into</em> the JSON with operators — <code>-&gt;&gt;</code> extracts a field as text:</p>
<pre><code>SELECT ('{"lang":"vi","tags":["db","sql"]}'::jsonb) -&gt;&gt; 'lang' AS lang;</code></pre>
<div class="out"> lang
------
 vi
(1 row)</div>
<p>MySQL and SQLite can do some of this, but Postgres does the most of it, the most correctly. Chapter 2 covers every one of these types properly, and Chapter 13 goes deep on JSONB.</p>

<h3>The running project: a Notes API's database</h3>
<p>Throughout the early chapters we build up the database behind a small "Notes" app — the same example the Node.js course used, so the two dovetail. It grows chapter by chapter: a <code>notes</code> table (done), then <code>users</code> who own notes (foreign keys, Chapter 3), then tags (many-to-many joins, Chapter 5), then search and indexes as it fills with data. By Chapter 16 you'll understand not just the toy version but how this very site's 248-table schema is organised.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lt">Chapters 1–4</span><span class="lz-ld">One table: types, constraints, inserting and selecting the notes.</span></div>
  <div class="lz-layer"><span class="lz-lt">Chapters 5–8</span><span class="lz-ld">Many tables: users, tags, joins, aggregation, "notes per user", "top tags".</span></div>
  <div class="lz-layer"><span class="lz-lt">Chapters 9–12</span><span class="lz-ld">Millions of rows: indexes, query plans, transactions, triggers that keep counts in sync.</span></div>
  <div class="lz-layer"><span class="lz-lt">Chapters 13–16</span><span class="lz-ld">Production: JSON fields, full-text search, pooling, backups — and the real schema.</span></div>
</div>
<div class="note-ct">The Node.js course's Chapter 7 built a Notes API from the <em>application</em> side (Prisma, connection pools, N+1 queries). This course builds the same idea from the <em>database</em> side — so if you've done both, the connection-pool numbers, the N+1 problem, and the index that made a query 222× faster will all click into one complete picture.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Ready? Chapter 1 starts the real thing</span><span class="lc-sub">Next up: the relational model and ACID — why this design has outlasted every trend.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Một mô hình tư duy làm mọi thứ sáng ra</h2>
<p class="lead">Trước mọi cú pháp, hãy thấm điều này: PostgreSQL là một <strong>chương trình riêng biệt</strong> — một máy chủ — chạy độc lập, thường trên một máy khác với app của bạn. App của bạn là một <strong>client</strong> mở kết nối qua mạng, gửi văn bản (SQL), và nhận về các dòng. Gần như mọi thứ khó hiểu về cơ sở dữ liệu trở nên hiển nhiên khi bạn giữ chắc bức tranh này.</p>

<h3>Client và server, không phải một thư viện</h3>
<p>Bản năng của người mới là hình dung cơ sở dữ liệu như "một phần trong code của tôi". Không phải vậy. App Node/Python/Go của bạn và PostgreSQL là hai tiến trình nói chuyện qua một socket. Chỉ một sự thật đó giải thích được rất nhiều:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Vì sao kết nối tốn kém</span><span class="v">Mở một kết nối nghĩa là một vòng đi-về qua mạng + xác thực. Đó là lý do app dùng một <em>pool</em> các kết nối tái sử dụng (Chương 14) — khoá Node.js đo một kết nối mới mất 8 ms so với 0,38 ms khi tái sử dụng.</span></div>
  <div class="kv"><span class="k">Vì sao có giới hạn kết nối</span><span class="v">Mỗi kết nối là một tiến trình máy chủ thật, dùng bộ nhớ. Giới hạn mặc định là 100. Vượt nó là bạn nhận <code>too many clients already</code> — một sự cố production thật trên trang này.</span></div>
  <div class="kv"><span class="k">Vì sao SQL là văn bản</span><span class="v">Bạn gửi một <em>chuỗi</em> truy vấn qua đường truyền. Đó cũng là lý do việc không bao giờ dựng chuỗi đó từ dữ liệu người dùng lại quan trọng — SQL injection xảy ra như thế.</span></div>
  <div class="kv"><span class="k">Vì sao DB sống lâu hơn app</span><span class="v">Khởi động lại app mà dữ liệu vẫn còn — nó nằm trong file của máy chủ, không phải bộ nhớ app của bạn.</span></div>
</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-st">Client kết nối</div><div class="lz-sd">App của bạn (hoặc psql) mở một kết nối TCP và xác thực.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-st">Client gửi SQL</div><div class="lz-sd">Một chuỗi truy vấn như <code>SELECT * FROM notes WHERE pinned</code>.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-st">Server lập kế hoạch &amp; chạy</div><div class="lz-sd">Bộ lập kế hoạch chọn chiến lược (quét? dùng chỉ mục?), thực thi trên dữ liệu ở đĩa.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-st">Server trả về dòng</div><div class="lz-sd">Kết quả đi ngược qua kết nối. Client hiển thị hoặc dùng chúng.</div></div>
</div>

<h3>SQL là khai báo — bạn nói CÁI GÌ, không nói LÀM SAO</h3>
<p>Đây là ý tưởng lớn thứ hai. Trong đa số lập trình bạn viết <em>làm sao</em> để làm một việc: lặp qua mảng, kiểm từng phần tử, gom những cái khớp. Trong SQL bạn viết <em>cái gì</em> bạn muốn và cơ sở dữ liệu tự tìm cách:</p>
<pre><code>SELECT title FROM notes WHERE pinned = true ORDER BY created_at DESC;</code></pre>
<p>Bạn không hề bảo PostgreSQL "lặp qua các dòng" hay "dùng chỉ mục trên <code>created_at</code>". Bạn mô tả kết quả mình muốn; <strong>bộ lập kế hoạch truy vấn</strong> quyết định chiến lược thật sự — và nó có thể chọn quét tuần tự, quét chỉ mục, sắp xếp, hay bỏ luôn bước sắp xếp nếu một chỉ mục đã cung cấp sẵn thứ tự. Khoảng cách giữa <em>cái bạn hỏi</em> và <em>cách nó chạy</em> chính là toàn bộ nội dung Chương 10, và là lý do cùng một truy vấn có thể nhanh hoặc chậm thảm hoạ tuỳ chỉ mục và cỡ dữ liệu.</p>
<div class="callout ok">Vì SQL là khai báo, cách làm một truy vấn nhanh hơn thường <strong>không</strong> phải viết lại truy vấn — mà là cho bộ lập kế hoạch một lựa chọn tốt hơn (một chỉ mục) hoặc thông tin tốt hơn (thống kê cập nhật). Bạn đổi <em>cách làm</em> mà không đụng tới <em>cái gì</em>.</div>

<h3>Thoáng nhìn vì sao lại chọn PostgreSQL</h3>
<p>Postgres không chỉ là "các bảng số và chữ". Hệ thống kiểu của nó phong phú khác thường — bạn có thể lưu JSON có cấu trúc, mảng, UUID, mốc thời gian chính xác và khoảng thời gian như những giá trị hạng nhất, và truy vấn vào bên trong chúng. Đây là một truy vấn chạm tới vài kiểu cùng lúc (output thật):</p>
<pre><code>SELECT
  '{"lang":"vi","tags":["db","sql"]}'::jsonb  AS data,
  array[1,2,3]                                 AS nums,
  gen_random_uuid()                            AS id,
  now()::date                                  AS today,
  '3 days'::interval                           AS span;</code></pre>
<div class="out">                 data                  |  nums   |                  id                  |   today    |  span
---------------------------------------+---------+--------------------------------------+------------+--------
 {"lang": "vi", "tags": ["db", "sql"]} | {1,2,3} | de9ac9ba-a4e4-4dd0-84cd-2efa8255cd4a | 2026-08-09 | 3 days
(1 row)</div>
<p>Và bạn có thể với <em>vào trong</em> JSON bằng toán tử — <code>-&gt;&gt;</code> trích một trường ra dạng text:</p>
<pre><code>SELECT ('{"lang":"vi","tags":["db","sql"]}'::jsonb) -&gt;&gt; 'lang' AS lang;</code></pre>
<div class="out"> lang
------
 vi
(1 row)</div>
<p>MySQL và SQLite làm được một phần việc này, nhưng Postgres làm nhiều nhất, và đúng nhất. Chương 2 nói tử tế về từng kiểu, còn Chương 13 đào sâu JSONB.</p>

<h3>Dự án xuyên suốt: cơ sở dữ liệu của một Notes API</h3>
<p>Qua các chương đầu, ta dựng dần cơ sở dữ liệu đứng sau một app "Notes" nhỏ — cùng ví dụ mà khoá Node.js dùng, để hai khoá khớp vào nhau. Nó lớn dần từng chương: một bảng <code>notes</code> (xong), rồi <code>users</code> sở hữu các note (khoá ngoại, Chương 3), rồi tag (join nhiều-nhiều, Chương 5), rồi tìm kiếm và chỉ mục khi nó đầy dữ liệu. Tới Chương 16 bạn sẽ hiểu không chỉ phiên bản đồ chơi mà cả cách lược đồ 248 bảng của chính trang này được tổ chức.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lt">Chương 1–4</span><span class="lz-ld">Một bảng: kiểu dữ liệu, ràng buộc, chèn và chọn các note.</span></div>
  <div class="lz-layer"><span class="lz-lt">Chương 5–8</span><span class="lz-ld">Nhiều bảng: users, tag, join, tổng hợp, "số note mỗi user", "tag nhiều nhất".</span></div>
  <div class="lz-layer"><span class="lz-lt">Chương 9–12</span><span class="lz-ld">Hàng triệu dòng: chỉ mục, kế hoạch truy vấn, giao dịch, trigger giữ bộ đếm đồng bộ.</span></div>
  <div class="lz-layer"><span class="lz-lt">Chương 13–16</span><span class="lz-ld">Production: trường JSON, full-text search, pool, sao lưu — và lược đồ thật.</span></div>
</div>
<div class="note-ct">Chương 7 của khoá Node.js dựng một Notes API từ phía <em>ứng dụng</em> (Prisma, connection pool, truy vấn N+1). Khoá này dựng cùng ý tưởng đó từ phía <em>cơ sở dữ liệu</em> — nên nếu bạn học cả hai, các con số connection-pool, bài toán N+1, và cái chỉ mục làm một truy vấn nhanh 222× sẽ ghép lại thành một bức tranh trọn vẹn.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Sẵn sàng chưa? Chương 1 bắt đầu vào việc thật</span><span class="lc-sub">Tiếp theo: mô hình quan hệ và ACID — vì sao thiết kế này sống dai hơn mọi trào lưu.</span></span>
</a>
</div>
`,
    },
  ],
};
