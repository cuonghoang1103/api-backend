/**
 * PostgreSQL — Mục 0: Giới thiệu khoá học & Hướng dẫn học.
 * Song ngữ EN/VI qua .ml-en / .ml-vi (số lượng phải bằng nhau, mỗi bài 1–1).
 * LUẬT SOẠN:
 *  - Mọi output psql/SQL phải CHẠY THẬT (PostgreSQL 17, Docker postgres:17, localhost:5444, db pgcourse)
 *    rồi chép đúng, kể cả khoảng trắng canh cột.
 *  - KHÔNG backtick trần trong content (dùng &#96;); mọi `${` trong code mẫu → \${;
 *    mọi < > trong code → &lt; &gt;; & trong code → &amp;.
 */
import G001 from './giang/pg-00-1.mjs';
import G002 from './giang/pg-00-2.mjs';
import G003 from './giang/pg-00-3.mjs';
import G004 from './giang/pg-00-4.mjs';
import G005 from './giang/pg-00-5.mjs';
import { img } from './_slides.mjs';

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
${G001}
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
<div class="note-ct">This site (cuongthai.com) runs on PostgreSQL 16 in production: roughly 248 tables, 95 migrations, a 6,980-line schema, storing every user, post, message, course and note you see. When a chapter says "here's how it's done in production", it means <em>here</em> — including the real connection-pool math (12 clients × pool 10 = 120 &gt; the 100-connection limit) that Chapter 14 dissects.</div>
<div class="pitfall"><p><strong>Trap — treating the database as a detail you can swap later.</strong> "We will start with SQLite and move to Postgres when we grow" sounds prudent and is usually the most expensive decision in the project. Chapter 18 of the Node.js course makes the point in one line: <em>data outlives code</em>. You can replace every service, every framework and every language while the schema stays; you cannot replace the schema while the data stays. Migrating a live database is a one-way door with downtime, dual writes and a backfill — measured in weeks. Choosing PostgreSQL on day one costs nothing extra, because the free tier of every host offers it and the SQL you write is more portable, not less.</p></div>
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
<div class="note-ct">Trang này (cuongthai.com) chạy trên PostgreSQL 16 ở production: khoảng 248 bảng, 95 migration, lược đồ 6.980 dòng, lưu mọi user, bài đăng, tin nhắn, khoá học và ghi chú bạn thấy. Khi một chương nói "đây là cách làm trong production", nghĩa là <em>ở đây</em> — kể cả bài toán connection-pool thật (12 client × pool 10 = 120 &gt; giới hạn 100 kết nối) mà Chương 14 mổ xẻ.</div>
<div class="pitfall"><p><strong>Bẫy — coi cơ sở dữ liệu là một chi tiết có thể thay sau.</strong> "Cứ bắt đầu bằng SQLite rồi lớn lên thì chuyển sang Postgres" nghe thận trọng và thường là quyết định ĐẮT NHẤT của cả dự án. Chương 18 khoá Node.js nói gọn trong một dòng: <em>dữ liệu sống lâu hơn mã</em>. Bạn thay được mọi service, mọi framework và mọi ngôn ngữ trong khi lược đồ vẫn ở đó; bạn KHÔNG thay được lược đồ trong khi dữ liệu vẫn ở đó. Di chuyển một cơ sở dữ liệu đang sống là một cánh cửa MỘT CHIỀU kèm downtime, ghi kép và một đợt nạp lại — đo bằng TUẦN. Chọn PostgreSQL ngay ngày đầu không tốn thêm gì, vì gói miễn phí của mọi nhà cung cấp đều có nó và SQL bạn viết còn khả chuyển HƠN, chứ không kém.</p></div>
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
${G002}
<div class="ml-en">
<h3>Two ways to study this course</h3>
<p>The course has <strong>17 chapters</strong> (Chapter 17 compares SQL Server, MySQL, PostgreSQL and MongoDB), <strong>9 labs</strong> on one growing project called CT Shop, a quiz per chapter and a final exam (practical PE + multiple-choice FE). You can walk it in two ways — the same labs and the same exam, a different amount of slow reading.</p>
<div class="anh-slide"><img src="${img('pg-00-2', 12)}" alt="PG 0.2 — the two study paths: full path and shortcut" loading="lazy" width="1280" height="720" /><p class="chu-thich">The two lanes: the <strong>full path</strong> visits every station in order; the <strong>shortcut</strong> leaves after lesson 0.4, goes through lesson 0.5, skims Chapters 1–7 and rejoins at Chapter 8.</p></div>
<ul>
<li><strong>Full path — you are new to databases.</strong> Section 0 → Chapter 17 strictly in order, type and run every query, do all 9 labs and every quiz, then the exam. About 2–3 hours per chapter (45–55 hours).</li>
<li><strong>Shortcut — you already know SQL Server, DBI202 or MySQL.</strong> Read lesson <strong>0.5 “From SQL Server / MySQL to PostgreSQL”</strong> (the lesson right after 0.4), skim Chapters 2–7 (lessons tagged <em>“Know SQL Server? You can skim”</em>), study Chapters 8–17 carefully, and still do <strong>every lab</strong> and the exam.</li>
</ul>
<table>
<tr><th>Chapters</th><th>Topic</th><th>Full path</th><th>Shortcut</th></tr>
<tr><td>0 – 1</td><td>Intro, psql, why PostgreSQL, ACID</td><td>read all</td><td>read (short — the PostgreSQL process model is new)</td></tr>
<tr><td>2 – 7</td><td>Types, tables, INSERT/SELECT, JOIN, GROUP BY, subqueries, CTE</td><td>read all + type every query</td><td><strong>skim</strong> — slides and traps</td></tr>
<tr><td>8</td><td>Window functions</td><td>read all + type</td><td><strong>study</strong></td></tr>
<tr><td>9 – 10</td><td>Indexes, EXPLAIN, the planner</td><td>read all + type</td><td><strong>study</strong></td></tr>
<tr><td>11 – 12</td><td>MVCC, locks, functions, triggers, views</td><td>read all + type</td><td><strong>study</strong></td></tr>
<tr><td>13 – 16</td><td>JSONB, search, pools, backup, replication, Prisma</td><td>read all + type</td><td><strong>study</strong></td></tr>
<tr><td>17</td><td>SQL Server · MySQL · PostgreSQL · MongoDB</td><td>read all</td><td><strong>study</strong></td></tr>
<tr><td>Labs 1 – 9</td><td>CT Shop</td><td colspan="2">everyone does all 9 labs</td></tr>
</table>
<div class="callout ok">General theory — ERD, normalization, primary and foreign keys — is explained here in a few minutes, just enough to build CT Shop. For the full theory, every such lesson links to the <strong>DBI202 — Introduction to Databases</strong> course (<a href="/courses/introduction-to-databases" target="_blank" rel="noopener">cuongthai.com/courses/introduction-to-databases</a>).</div>
</div>
<div class="ml-vi">
<h3>Hai đường học khoá này</h3>
<p>Khoá có <strong>17 chương</strong> (Chương 17 so sánh SQL Server, MySQL, PostgreSQL và MongoDB), <strong>9 lab</strong> trên một dự án lớn dần tên CT Shop, một quiz mỗi chương và bài thi cuối khoá (thực hành PE + trắc nghiệm FE). Bạn có thể đi hai cách — cùng các lab, cùng bài thi, chỉ khác lượng đọc chậm.</p>
<div class="anh-slide"><img src="${img('pg-00-2', 12)}" alt="PG 0.2 — hai đường học: đường đầy đủ và đường tắt" loading="lazy" width="1280" height="720" /><p class="chu-thich">Hai làn đường: <strong>đường đầy đủ</strong> đi qua mọi trạm theo thứ tự; <strong>đường tắt</strong> rẽ ra sau bài 0.4, đi qua bài 0.5, lướt Chương 1–7 và nhập lại ở Chương 8.</p></div>
<ul>
<li><strong>Đường đầy đủ — bạn mới tinh về cơ sở dữ liệu.</strong> Mục 0 → Chương 17 đúng thứ tự, tự gõ và chạy mọi truy vấn, làm đủ 9 lab và mọi quiz, rồi thi cuối khoá. Khoảng 2–3 giờ mỗi chương (45–55 giờ).</li>
<li><strong>Đường tắt — bạn đã học SQL Server, DBI202 hoặc MySQL.</strong> Đọc bài <strong>0.5 “Từ SQL Server / MySQL sang PostgreSQL”</strong> (bài ngay sau 0.4), lướt Chương 2–7 (các bài có nhãn <em>“Đã biết SQL Server? Có thể lướt”</em>), học kỹ Chương 8–17, và vẫn làm <strong>đủ mọi lab</strong> cùng bài thi.</li>
</ul>
<table>
<tr><th>Chương</th><th>Nội dung</th><th>Đường đầy đủ</th><th>Đường tắt</th></tr>
<tr><td>0 – 1</td><td>Giới thiệu, psql, vì sao PostgreSQL, ACID</td><td>đọc hết</td><td>đọc (ngắn — mô hình tiến trình của PostgreSQL là mới)</td></tr>
<tr><td>2 – 7</td><td>Kiểu dữ liệu, bảng, INSERT/SELECT, JOIN, GROUP BY, truy vấn con, CTE</td><td>đọc hết + gõ mọi truy vấn</td><td><strong>lướt</strong> — slide và phần bẫy</td></tr>
<tr><td>8</td><td>Hàm cửa sổ</td><td>đọc hết + gõ</td><td><strong>học kỹ</strong></td></tr>
<tr><td>9 – 10</td><td>Chỉ mục, EXPLAIN, bộ lập kế hoạch</td><td>đọc hết + gõ</td><td><strong>học kỹ</strong></td></tr>
<tr><td>11 – 12</td><td>MVCC, khoá, hàm, trigger, view</td><td>đọc hết + gõ</td><td><strong>học kỹ</strong></td></tr>
<tr><td>13 – 16</td><td>JSONB, tìm kiếm, pool, sao lưu, nhân bản, Prisma</td><td>đọc hết + gõ</td><td><strong>học kỹ</strong></td></tr>
<tr><td>17</td><td>SQL Server · MySQL · PostgreSQL · MongoDB</td><td>đọc hết</td><td><strong>học kỹ</strong></td></tr>
<tr><td>Lab 1 – 9</td><td>CT Shop</td><td colspan="2">ai cũng làm đủ 9 lab</td></tr>
</table>
<div class="callout ok">Lý thuyết chung — ERD, chuẩn hoá, khoá chính và khoá ngoại — được giảng ở đây trong vài phút, vừa đủ để dựng CT Shop. Muốn học sâu hơn, mỗi bài như vậy có link sang khoá <strong>DBI202 — Nhập môn cơ sở dữ liệu</strong> (<a href="/courses/introduction-to-databases" target="_blank" rel="noopener">cuongthai.com/courses/introduction-to-databases</a>).</div>
</div>
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
<p>Throughout the course you'll see boxes like this — they are the <em>actual</em> result of running the query on a real PostgreSQL server, copied verbatim (PostgreSQL 17; a few later chapters were first run on 15.4 — the results are the same, only version numbers and timings differ):</p>
<div class="out">
 tong | co_body
------+---------
    3 |       2
(1 row)
</div>
<p>When a query is claimed to be slow, you'll see its real timing from <code>EXPLAIN ANALYZE</code>. When one is claimed to error, you'll see the real error message and its code (like <code>23505 duplicate key value violates unique constraint</code>). Nothing in this course is "probably right".</p>
<div class="note-ct">Why this matters: on this site, a database mistake is not abstract. A missing index once turned a feed query from 0.1 ms into 100 ms under load; a connection-pool miscalculation once hit the "sorry, too many clients already" wall in production. Every number in this course is the kind of number that decides whether a page loads or times out.</div>
<div class="pitfall"><p><strong>Trap — reading SQL instead of running it.</strong> SQL is unusually easy to read and unusually hard to predict. A query that <em>looks</em> like it returns one row per order returns four when a join fans out; a <code>LEFT JOIN</code> that <em>looks</em> preserved becomes an inner join because of one condition in the wrong clause. Neither is visible on the page — both are obvious the moment you run the query and count the rows. Every chapter here ships with real output for exactly that reason. Type the query, run it, and compare the row count against what you expected <em>before</em> reading the explanation. The gap between the two is where the learning is.</p></div>
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
<p>Suốt khoá bạn sẽ thấy những khối như thế này — chúng là kết quả <em>thật</em> của việc chạy truy vấn trên một máy chủ PostgreSQL thật, chép nguyên văn (PostgreSQL 17; vài chương sau được chạy lần đầu trên 15.4 — kết quả như nhau, chỉ khác số phiên bản và thời gian đo):</p>
<div class="out">
 tong | co_body
------+---------
    3 |       2
(1 row)
</div>
<p>Khi một truy vấn được nói là chậm, bạn sẽ thấy thời gian thật của nó từ <code>EXPLAIN ANALYZE</code>. Khi một truy vấn được nói là lỗi, bạn sẽ thấy đúng thông báo lỗi và mã của nó (như <code>23505 duplicate key value violates unique constraint</code>). Không có gì trong khoá này là "chắc là đúng".</p>
<div class="note-ct">Vì sao điều này quan trọng: trên trang này, một lỗi cơ sở dữ liệu không hề trừu tượng. Một chỉ mục bị thiếu từng biến một truy vấn feed từ 0,1 ms thành 100 ms dưới tải; một phép tính sai về connection-pool từng đâm vào bức tường "sorry, too many clients already" trên production. Mọi con số trong khoá này là loại con số quyết định một trang tải được hay bị time-out.</div>
<div class="pitfall"><p><strong>Bẫy — ĐỌC SQL thay vì CHẠY nó.</strong> SQL dễ đọc một cách bất thường và khó ĐOÁN một cách bất thường. Một truy vấn TRÔNG như trả một dòng mỗi đơn hàng lại trả bốn khi cú join bung ra; một <code>LEFT JOIN</code> TRÔNG như được giữ nguyên lại thành inner join vì một điều kiện đặt sai mệnh đề. Không cái nào nhìn thấy được trên trang giấy — cả hai đều hiển nhiên ngay khoảnh khắc bạn chạy truy vấn và ĐẾM DÒNG. Mọi chương ở đây đều kèm kết quả chạy thật đúng vì lý do ấy. Hãy gõ truy vấn, chạy nó, và so số dòng với con số bạn TRÔNG ĐỢI — trước khi đọc phần giải thích. Khoảng cách giữa hai con số chính là chỗ có bài học.</p></div>
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
${G003}
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>Installing PostgreSQL and running your first query</h2>
<p class="lead">There are two ways to get a PostgreSQL server: install it natively, or run it in Docker. Docker is the fastest way to a clean, disposable database and it's what this course uses for its examples — but native installs are what you'll often meet in the wild, so we cover both. Then we connect with <code>psql</code>, the command-line client, and run real SQL.</p>

<h3>Option A — Docker (recommended for this course)</h3>
<p>If you have Docker, one command gives you a fully working PostgreSQL 17 server. It listens on port 5432 inside the container; we map it to a host port so <code>psql</code> can reach it:</p>
<pre><code class="language-bash"><span class="tok-comment"># Start a throwaway PostgreSQL 17 server</span>
docker run -d --name pg17 \\
  -e POSTGRES_PASSWORD=123456 \\
  -p 5444:5432 \\
  postgres:17

<span class="tok-comment"># Check it's up</span>
docker ps</code></pre>
<p>The <code>-e POSTGRES_PASSWORD=123456</code> sets the password for the default <code>postgres</code> superuser. <code>-p 5444:5432</code> means "connect to port 5444 on my machine to reach port 5432 in the container". The data lives inside the container — good enough for learning; Chapter 15 covers keeping it safe with volumes and backups.</p>

<h3>Option B — Native install</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">macOS</span><span class="v"><code>brew install postgresql@17</code> then <code>brew services start postgresql@17</code>. Or use the Postgres.app one-click app.</span></div>
  <div class="kv"><span class="k">Ubuntu/Debian</span><span class="v"><code>sudo apt install postgresql</code> — it starts automatically and listens on port 5432.</span></div>
  <div class="kv"><span class="k">Windows</span><span class="v">The EnterpriseDB installer from postgresql.org, which bundles the server + psql + pgAdmin.</span></div>
</div>

<h3>Connecting with psql</h3>
<p><code>psql</code> is the official terminal client — a REPL where you type SQL and meta-commands. Connect to the Docker server above like this (it will prompt for the password, <code>123456</code>):</p>
<pre><code class="language-bash">psql -h localhost -p 5444 -U postgres</code></pre>
<p>Once connected, <code>\\conninfo</code> confirms exactly where you are — a good habit before running anything destructive:</p>
<div class="out">You are connected to database "pgcourse" as user "postgres" on host "localhost" (address "::1") at port "5444".</div>
<p>And <code>SELECT version();</code> shows the exact server build. This is the real output from the server this course runs on:</p>
<div class="out">                                                          version
----------------------------------------------------------------------------------------------------------------------------
 PostgreSQL 17.11 (Debian 17.11-1.pgdg13+2) on aarch64-unknown-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit
(1 row)</div>

<h3>Server, database, table — the three levels</h3>
<p>One PostgreSQL <strong>server</strong> holds many <strong>databases</strong>; each database holds many <strong>tables</strong>. When you connect you're always inside exactly one database. Let's create one for this course and switch into it:</p>
<pre><code class="language-sql"><span class="tok-comment">-- run while connected to the default 'postgres' database</span>
CREATE DATABASE pgcourse;
<span class="tok-comment">-- then in psql, switch into it:</span>
\\c pgcourse</code></pre>

<h3>Your first table and query</h3>
<p>Here is the running example we'll use across early chapters — a simple <code>notes</code> table. Type this in and run it:</p>
<pre><code class="language-sql">CREATE TABLE notes (
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
<div class="note-ct">This course's examples run on a Postgres reachable at <code>localhost:5444</code> (a Docker container), and the "100 Ngày Database" series on this site uses the very same setup. If you match it — Docker <code>postgres:17</code>, port 5444, password 123456 — every query in this course will produce the exact output shown.</div>
<h3>Three ways to get a PostgreSQL to practise on</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Docker</span><span class="lz-lnote">One command, no system packages, and <code>docker rm</code> undoes everything. Best for a course: you can break it freely and start again in seconds.</span></div>
<div class="lz-layer"><span class="lz-lname">Native install</span><span class="lz-lnote">Faster and always running, but it puts a service on your machine with its own user, data directory and upgrade path. Worth it once Postgres is part of your daily work.</span></div>
<div class="lz-layer"><span class="lz-lname">A managed cloud instance</span><span class="lz-lnote">Free tiers exist and need no setup. The catch for learning is latency on every query and no access to the server log or config — two things Chapter 10 needs.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — losing your practice data to <code>docker rm</code> and calling it a Docker problem.</strong> A container without a named volume keeps its data inside the container's writable layer, so removing the container removes the database — silently, with no warning, and it is the single most common way people lose a day of work in this course. Always start it with <code>-v pgdata:/var/lib/postgresql/data</code>. The same rule matters far more later: the day you run PostgreSQL in Docker on a real server, that one flag is the difference between a restart and a restore from backup.</p></div>
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
<p>Nếu bạn có Docker, một lệnh cho bạn một máy chủ PostgreSQL 17 chạy đầy đủ. Nó lắng nghe cổng 5432 bên trong container; ta ánh xạ ra một cổng của máy để <code>psql</code> với tới:</p>
<pre><code class="language-bash"><span class="tok-comment"># Khởi động một máy chủ PostgreSQL 17 dùng xong bỏ</span>
docker run -d --name pg17 \\
  -e POSTGRES_PASSWORD=123456 \\
  -p 5444:5432 \\
  postgres:17

<span class="tok-comment"># Kiểm tra nó đang chạy</span>
docker ps</code></pre>
<p><code>-e POSTGRES_PASSWORD=123456</code> đặt mật khẩu cho superuser mặc định tên <code>postgres</code>. <code>-p 5444:5432</code> nghĩa là "kết nối tới cổng 5444 trên máy tôi để với tới cổng 5432 trong container". Dữ liệu nằm bên trong container — đủ cho việc học; Chương 15 sẽ nói cách giữ nó an toàn bằng volume và sao lưu.</p>

<h3>Cách B — Cài bản gốc</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">macOS</span><span class="v"><code>brew install postgresql@17</code> rồi <code>brew services start postgresql@17</code>. Hoặc dùng app Postgres.app bấm-một-nút.</span></div>
  <div class="kv"><span class="k">Ubuntu/Debian</span><span class="v"><code>sudo apt install postgresql</code> — nó tự khởi động và lắng nghe cổng 5432.</span></div>
  <div class="kv"><span class="k">Windows</span><span class="v">Bộ cài EnterpriseDB từ postgresql.org, gói sẵn máy chủ + psql + pgAdmin.</span></div>
</div>

<h3>Kết nối bằng psql</h3>
<p><code>psql</code> là client terminal chính thức — một REPL nơi bạn gõ SQL và các lệnh meta. Kết nối tới máy chủ Docker phía trên như sau (nó sẽ hỏi mật khẩu, <code>123456</code>):</p>
<pre><code class="language-bash">psql -h localhost -p 5444 -U postgres</code></pre>
<p>Khi đã kết nối, <code>\\conninfo</code> xác nhận chính xác bạn đang ở đâu — một thói quen tốt trước khi chạy bất cứ thứ gì có thể phá dữ liệu:</p>
<div class="out">You are connected to database "pgcourse" as user "postgres" on host "localhost" (address "::1") at port "5444".</div>
<p>Và <code>SELECT version();</code> hiện đúng bản build của máy chủ. Đây là output thật từ chính máy chủ khoá này chạy trên đó:</p>
<div class="out">                                                          version
----------------------------------------------------------------------------------------------------------------------------
 PostgreSQL 17.11 (Debian 17.11-1.pgdg13+2) on aarch64-unknown-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit
(1 row)</div>

<h3>Máy chủ, cơ sở dữ liệu, bảng — ba cấp</h3>
<p>Một <strong>máy chủ</strong> PostgreSQL chứa nhiều <strong>cơ sở dữ liệu</strong>; mỗi cơ sở dữ liệu chứa nhiều <strong>bảng</strong>. Khi kết nối, bạn luôn ở bên trong đúng một cơ sở dữ liệu. Hãy tạo một cái cho khoá này rồi chuyển vào:</p>
<pre><code class="language-sql"><span class="tok-comment">-- chạy khi đang kết nối tới cơ sở dữ liệu mặc định 'postgres'</span>
CREATE DATABASE pgcourse;
<span class="tok-comment">-- rồi trong psql, chuyển vào nó:</span>
\\c pgcourse</code></pre>

<h3>Bảng đầu tiên và truy vấn đầu tiên</h3>
<p>Đây là ví dụ xuyên suốt ta sẽ dùng qua các chương đầu — một bảng <code>notes</code> đơn giản. Gõ vào và chạy:</p>
<pre><code class="language-sql">CREATE TABLE notes (
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
<div class="note-ct">Ví dụ của khoá này chạy trên một Postgres với tới được ở <code>localhost:5444</code> (một container Docker), và loạt "100 Ngày Database" trên trang này dùng đúng cùng thiết lập đó. Nếu bạn làm khớp — Docker <code>postgres:17</code>, cổng 5444, mật khẩu 123456 — mọi truy vấn trong khoá sẽ cho đúng output như hiển thị.</div>
<h3>Ba cách có một PostgreSQL để tập</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Docker</span><span class="lz-lnote">Một câu lệnh, không cài gói hệ thống, và <code>docker rm</code> hoàn tác mọi thứ. Hợp nhất cho một khoá học: bạn phá thoải mái rồi dựng lại trong vài giây.</span></div>
<div class="lz-layer"><span class="lz-lname">Cài thẳng lên máy</span><span class="lz-lnote">Nhanh hơn và luôn chạy, nhưng nó đặt một dịch vụ lên máy bạn kèm user riêng, thư mục dữ liệu riêng và đường nâng cấp riêng. Đáng làm khi Postgres đã thành việc hằng ngày.</span></div>
<div class="lz-layer"><span class="lz-lname">Một instance đám mây có quản lý</span><span class="lz-lnote">Có gói miễn phí và không phải cài gì. Cái vướng khi HỌC là độ trễ ở mọi truy vấn và không truy cập được log lẫn config của máy chủ — hai thứ Chương 10 cần.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — mất sạch dữ liệu tập vì <code>docker rm</code> rồi đổ cho Docker.</strong> Một container không có volume đặt tên sẽ giữ dữ liệu bên trong lớp ghi của chính container, nên xoá container là xoá luôn cơ sở dữ liệu — im lặng, không cảnh báo, và đó là cách phổ biến NHẤT khiến người ta mất một ngày làm việc trong khoá này. Luôn khởi động nó với <code>-v pgdata:/var/lib/postgresql/data</code>. Cùng luật ấy còn quan trọng hơn nhiều về sau: cái ngày bạn chạy PostgreSQL trong Docker trên một máy chủ thật, đúng một cái cờ ấy là khác biệt giữa một cú khởi động lại và một cú phục hồi từ bản sao lưu.</p></div>
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
${G004}
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
<pre><code class="language-sql">SELECT title FROM notes WHERE pinned = true ORDER BY created_at DESC;</code></pre>
<p>You never told PostgreSQL to "loop over rows" or "use the index on <code>created_at</code>". You described the result you want; the <strong>query planner</strong> decides the actual strategy — and it might choose a sequential scan, an index scan, a sort, or skip the sort entirely if an index already provides the order. That gap between <em>what you asked</em> and <em>how it ran</em> is the entire subject of Chapter 10, and it's why the same query can be fast or catastrophically slow depending on indexes and data size.</p>
<div class="callout ok">Because SQL is declarative, the way to make a query faster is usually <strong>not</strong> to rewrite the query — it's to give the planner a better option (an index) or better information (up-to-date statistics). You change the <em>how</em> without touching the <em>what</em>.</div>

<h3>A glimpse of why PostgreSQL, specifically</h3>
<p>Postgres isn't just "tables of numbers and text". Its type system is unusually rich — you can store structured JSON, arrays, UUIDs, precise timestamps and time intervals as first-class values, and query into them. Here's one query touching several at once (real output):</p>
<pre><code class="language-sql">SELECT
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
<pre><code class="language-sql">SELECT ('{"lang":"vi","tags":["db","sql"]}'::jsonb) -&gt;&gt; 'lang' AS lang;</code></pre>
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
<div class="pitfall"><p><strong>Trap — designing the schema around today's screens.</strong> A table that mirrors the current UI — <code>dashboard_row</code>, <code>profile_card</code> — feels productive and traps you the moment the design changes, because the data now has the shape of a layout rather than the shape of the business. Model the <em>things that exist</em> and the relationships between them: a user, an order, an order line. Screens are then queries over those things, and a redesign is a new query rather than a migration. The rule of thumb that survives: if you can name it in a sentence about the business without mentioning the word "page", it is probably a table.</p></div>
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
<pre><code class="language-sql">SELECT title FROM notes WHERE pinned = true ORDER BY created_at DESC;</code></pre>
<p>Bạn không hề bảo PostgreSQL "lặp qua các dòng" hay "dùng chỉ mục trên <code>created_at</code>". Bạn mô tả kết quả mình muốn; <strong>bộ lập kế hoạch truy vấn</strong> quyết định chiến lược thật sự — và nó có thể chọn quét tuần tự, quét chỉ mục, sắp xếp, hay bỏ luôn bước sắp xếp nếu một chỉ mục đã cung cấp sẵn thứ tự. Khoảng cách giữa <em>cái bạn hỏi</em> và <em>cách nó chạy</em> chính là toàn bộ nội dung Chương 10, và là lý do cùng một truy vấn có thể nhanh hoặc chậm thảm hoạ tuỳ chỉ mục và cỡ dữ liệu.</p>
<div class="callout ok">Vì SQL là khai báo, cách làm một truy vấn nhanh hơn thường <strong>không</strong> phải viết lại truy vấn — mà là cho bộ lập kế hoạch một lựa chọn tốt hơn (một chỉ mục) hoặc thông tin tốt hơn (thống kê cập nhật). Bạn đổi <em>cách làm</em> mà không đụng tới <em>cái gì</em>.</div>

<h3>Thoáng nhìn vì sao lại chọn PostgreSQL</h3>
<p>Postgres không chỉ là "các bảng số và chữ". Hệ thống kiểu của nó phong phú khác thường — bạn có thể lưu JSON có cấu trúc, mảng, UUID, mốc thời gian chính xác và khoảng thời gian như những giá trị hạng nhất, và truy vấn vào bên trong chúng. Đây là một truy vấn chạm tới vài kiểu cùng lúc (output thật):</p>
<pre><code class="language-sql">SELECT
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
<pre><code class="language-sql">SELECT ('{"lang":"vi","tags":["db","sql"]}'::jsonb) -&gt;&gt; 'lang' AS lang;</code></pre>
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
<div class="pitfall"><p><strong>Bẫy — thiết kế lược đồ theo các MÀN HÌNH của hôm nay.</strong> Một cái bảng phản chiếu giao diện hiện tại — <code>dashboard_row</code>, <code>profile_card</code> — cho cảm giác làm được việc và giam bạn lại ngay khoảnh khắc thiết kế thay đổi, vì dữ liệu giờ mang hình dạng của một BỐ CỤC thay vì hình dạng của NGHIỆP VỤ. Hãy mô hình hoá <em>những thứ TỒN TẠI</em> và quan hệ giữa chúng: một người dùng, một đơn hàng, một dòng hàng. Khi ấy màn hình chỉ còn là các truy vấn trên những thứ đó, và một đợt thiết kế lại là một truy vấn mới chứ không phải một cú migration. Quy tắc ngón tay cái sống sót được: nếu bạn gọi tên nó được trong một câu về NGHIỆP VỤ mà không cần nhắc chữ "trang", thì nhiều khả năng nó là một cái bảng.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Sẵn sàng chưa? Chương 1 bắt đầu vào việc thật</span><span class="lc-sub">Tiếp theo: mô hình quan hệ và ACID — vì sao thiết kế này sống dai hơn mọi trào lưu.</span></span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 0.5 (MỚI — đường tắt cho người đã biết SQL Server / MySQL) ─────────────────────────── */
    {
      title: '0.5 — From SQL Server / MySQL to PostgreSQL|||0.5 — Từ SQL Server / MySQL sang PostgreSQL',
      slug: 'postgresql-0-5-tu-sql-server-mysql',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bài đường tắt cho người đã học SQL Server (DBI202) hoặc MySQL: cùng một CSDL nhỏ chạy thật trên SQL Server 2022, MySQL 8.4 và PostgreSQL 17 — cái gì giữ nguyên, cái gì đổi tên (TOP, IDENTITY, NVARCHAR, ISNULL, OUTPUT, MERGE…), và những cái bẫy cùng câu chữ khác kết quả (collation, chia nguyên, chuỗi rỗng, tên có ngoặc kép).',
      content: `
${G005}
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.5 · The shortcut</span>
<h2>From SQL Server / MySQL to PostgreSQL</h2>
<p class="lead">If you learned SQL on SQL Server (DBI202, SSMS, T-SQL) or on MySQL (XAMPP, Workbench), you already know most of PostgreSQL. This lesson maps what you know onto it in one sitting: the <strong>same</strong> tiny database on three servers, the <strong>same</strong> questions, every output real. You will meet three kinds of difference — things that are the <strong>same</strong>, things that are only <strong>renamed</strong>, and <strong>traps</strong> where the same text gives a different answer without any error.</p>
<div class="callout ok">New to SQL? Skip this lesson and start at Chapter 1 — every chapter teaches PostgreSQL from zero. Come back here the day you meet SQL Server or MySQL at work.</div>

<h3>The lab: one database, three servers</h3>
<p>Every result below was produced on 25/10/2026 by running the same scripts on <strong>SQL Server 2022</strong> (16.0.4305, Docker image <code>mcr.microsoft.com/mssql/server:2022-latest</code>, client <code>sqlcmd</code>), <strong>MySQL 8.4.13</strong> (<code>mysql:8.4</code>, client <code>mysql</code>) and <strong>PostgreSQL 17.11</strong> (the course machine from lesson 0.3: <code>postgres:17</code> on port 5444, client <code>psql</code>). You can run them yourself:</p>
<pre><code class="language-bash"># MySQL 8.4 — port 33306 on your machine
docker run -d --name pgcourse-mysql -p 127.0.0.1:33306:3306 -e MYSQL_ROOT_PASSWORD=123456 mysql:8.4
docker exec -it pgcourse-mysql mysql -uroot -p123456

# SQL Server 2022 — on Apple Silicon add --platform linux/amd64 (runs through Rosetta)
docker run -d --platform linux/amd64 --name pgcourse-mssql -p 127.0.0.1:14331:1433 \\
  -e ACCEPT_EULA=Y -e MSSQL_SA_PASSWORD='Pg_Course123' mcr.microsoft.com/mssql/server:2022-latest
docker exec -it pgcourse-mssql /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'Pg_Course123' -C

# PostgreSQL 17 — the container from lesson 0.3
psql -h localhost -p 5444 -U postgres</code></pre>
<p>The database is called <code>ctmini</code>: a 5-row <code>product</code> table and a 3-row <code>customer</code> table. Here is the PostgreSQL version; the other two differ only in the types you will meet below (<code>IDENTITY</code>/<code>AUTO_INCREMENT</code>, <code>NVARCHAR</code>, <code>BIT</code>/<code>TINYINT(1)</code>, <code>DATETIME2</code>/<code>DATETIME</code>):</p>
<pre><code class="language-sql">CREATE DATABASE ctmini;   -- then \\c ctmini
CREATE TABLE product (
  id         int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sku        text          NOT NULL UNIQUE,
  name       text          NOT NULL,
  price      numeric(12,2) NOT NULL,
  stock      int           NOT NULL DEFAULT 0,
  is_active  boolean       NOT NULL DEFAULT true,
  created_at timestamptz   NOT NULL DEFAULT now()
);
INSERT INTO product (sku, name, price, stock, is_active) VALUES
 ('BUT-01',   'Bút bi Thiên Long',      5000, 120, true),
 ('VO-02',    'Vở kẻ ngang 200 trang', 18000,  40, true),
 ('THUOC-03', 'Thước kẻ 30cm',          7000,   0, false),
 ('BALO-04',  'Balo chống gù',        450000,   8, true),
 ('MAY-05',   'Máy tính Casio fx-580',690000,  15, true);
CREATE TABLE customer (
  id        int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email     text NOT NULL UNIQUE,
  full_name text NOT NULL,
  phone     text
);
INSERT INTO customer (email, full_name, phone) VALUES
 ('an@ctshop.vn',  'Nguyễn Văn An', '0901000001'),
 ('binh@ctshop.vn','Trần Thị Bình', NULL),
 ('chi@ctshop.vn', 'Lê Minh Chi',   '');</code></pre>

<h3>Same question, same answer</h3>
<p>“Stock value of every active product, biggest first.” The three queries differ only in how they test <code>is_active</code>:</p>
<pre><code class="language-sql">-- SQL Server / MySQL
SELECT sku, price * stock AS stock_value FROM product WHERE is_active = 1 ORDER BY stock_value DESC;
-- PostgreSQL
SELECT sku, price * stock AS stock_value FROM product WHERE is_active ORDER BY stock_value DESC;</code></pre>
<div class="out">   sku   | stock_value
---------+-------------
 MAY-05  | 10350000.00
 BALO-04 |  3600000.00
 VO-02   |   720000.00
 BUT-01  |   600000.00
(4 rows)</div>
<p>sqlcmd and mysql print the same four rows and numbers in their own table style. That is the good news: SELECT, WHERE, JOIN, GROUP BY, HAVING, ORDER BY, subqueries, CTEs, window functions, PRIMARY / FOREIGN KEY, CHECK and transactions all mean the same thing on the three servers.</p>

<h3>Cheat sheet</h3>
<table>
<tr><th>What</th><th>SQL Server</th><th>MySQL</th><th>PostgreSQL</th></tr>
<tr><td>First N rows</td><td><code>SELECT TOP 3 …</code></td><td><code>… LIMIT 3</code></td><td><code>… LIMIT 3</code> / <code>FETCH FIRST 3 ROWS ONLY</code></td></tr>
<tr><td>Auto number</td><td><code>INT IDENTITY(1,1)</code></td><td><code>INT AUTO_INCREMENT</code></td><td><code>int GENERATED ALWAYS AS IDENTITY</code></td></tr>
<tr><td>Unicode text</td><td><code>NVARCHAR(n)</code> + <code>N'…'</code></td><td><code>VARCHAR(n)</code> (utf8mb4)</td><td><code>text</code></td></tr>
<tr><td>Current time</td><td><code>GETDATE()</code>, <code>SYSDATETIME()</code></td><td><code>NOW()</code></td><td><code>now()</code></td></tr>
<tr><td>NULL fallback</td><td><code>ISNULL(a, b)</code></td><td><code>IFNULL(a, b)</code></td><td><code>COALESCE(a, b)</code> (all three have it)</td></tr>
<tr><td>Join strings</td><td><code>a + b</code></td><td><code>CONCAT(a, b)</code></td><td><code>a || b</code></td></tr>
<tr><td>True / false</td><td><code>BIT</code></td><td><code>TINYINT(1)</code></td><td><code>boolean</code></td></tr>
<tr><td>Date + time</td><td><code>DATETIME2</code> / <code>DATETIMEOFFSET</code></td><td><code>DATETIME</code> / <code>TIMESTAMP</code></td><td><code>timestamp</code> / <code>timestamptz</code></td></tr>
<tr><td>Rows you just wrote</td><td><code>OUTPUT inserted.id</code></td><td>— (<code>LAST_INSERT_ID()</code>)</td><td><code>RETURNING id</code></td></tr>
<tr><td>Upsert</td><td><code>MERGE</code></td><td><code>ON DUPLICATE KEY UPDATE</code></td><td><code>ON CONFLICT … DO UPDATE</code></td></tr>
<tr><td>Server-side code</td><td>T-SQL procedure</td><td>stored procedure + <code>DELIMITER</code></td><td>PL/pgSQL function</td></tr>
<tr><td>Namespace</td><td>database → schema <code>dbo</code></td><td>database = schema</td><td>database → schema <code>public</code></td></tr>
<tr><td>Quoting names</td><td><code>[Order Note]</code></td><td><code>&#96;Order Note&#96;</code></td><td><code>"Order Note"</code> (and case folding)</td></tr>
<tr><td><code>'abc' = 'ABC'</code></td><td>true (CI collation)</td><td>true (ai_ci: accents too)</td><td>false → <code>ILIKE</code> / <code>lower()</code></td></tr>
<tr><td><code>7 / 2</code></td><td>3</td><td>3.5000</td><td>3</td></tr>
<tr><td><code>'' = ' '</code></td><td>true (pads spaces)</td><td>false</td><td>false</td></tr>
<tr><td>Update just one row</td><td><code>UPDATE TOP (1)</code></td><td><code>… ORDER BY … LIMIT 1</code></td><td>no LIMIT → <code>WHERE id = (subquery)</code></td></tr>
<tr><td>Tools</td><td>SSMS, sqlcmd</td><td>Workbench, mysql</td><td>psql, pgAdmin, DBeaver</td></tr>
</table>

<h3>Renamed 1 — TOP → LIMIT</h3>
<pre><code class="language-sql">SELECT sku, price FROM product ORDER BY price DESC LIMIT 3;
SELECT sku, price FROM product ORDER BY price DESC OFFSET 1 FETCH FIRST 2 ROWS ONLY;
SELECT TOP 3 sku FROM product;</code></pre>
<div class="out">   sku   |   price
---------+-----------
 MAY-05  | 690000.00
 BALO-04 | 450000.00
 VO-02   |  18000.00
(3 rows)

   sku   |   price
---------+-----------
 BALO-04 | 450000.00
 VO-02   |  18000.00
(2 rows)

ERROR:  syntax error at or near "3"
LINE 1: SELECT TOP 3 sku FROM product;
                   ^</div>
<p><code>OFFSET … FETCH FIRST … ROWS ONLY</code> is the SQL standard and also works on SQL Server (<code>OFFSET 1 ROWS FETCH NEXT 2 ROWS ONLY</code>, which gave the same two rows there). <code>TOP</code> exists only in SQL Server.</p>

<h3>Renamed 2 — IDENTITY → GENERATED ALWAYS AS IDENTITY</h3>
<p>All three number new rows automatically. The difference shows when you try to write the id yourself:</p>
<pre><code class="language-sql">INSERT INTO product (id, sku, name, price) VALUES (99, 'X-99', 'Thử', 1);</code></pre>
<div class="out">ERROR:  cannot insert a non-DEFAULT value into column "id"
DETAIL:  Column "id" is an identity column defined as GENERATED ALWAYS.
HINT:  Use OVERRIDING SYSTEM VALUE to override.</div>
<p>SQL Server refuses too (<code>Msg 544 … Cannot insert explicit value for identity column in table 'product' when IDENTITY_INSERT is set to OFF.</code>). MySQL accepts 99 without a word — and the next automatic id becomes 100. In older PostgreSQL code you will see <code>serial</code>; new tables use IDENTITY (Chapter 3.1). To get the new id back, PostgreSQL uses <code>RETURNING id</code> (below) instead of <code>SCOPE_IDENTITY()</code> / <code>LAST_INSERT_ID()</code>.</p>

<h3>Renamed 3 — NVARCHAR → text</h3>
<p>SQL Server with its default collation <code>SQL_Latin1_General_CP1_CI_AS</code> cannot store “ở” or “ẻ” in a VARCHAR column — and even an NVARCHAR column loses them if the literal has no <code>N</code> prefix:</p>
<div class="out">a                              b                              len_b       bytes_b
------------------------------ ------------------------------ ----------- -----------
V? k? ngang                    V? k? ngang                             11          22
V? k? ngang                    Vở kẻ ngang                             11          22</div>
<p>(row 1: <code>'Vở kẻ ngang'</code> without N; row 2: <code>N'Vở kẻ ngang'</code> into VARCHAR <code>a</code> and NVARCHAR <code>b</code>.) MySQL 8 uses utf8mb4 by default and PostgreSQL databases are UTF-8, so there is nothing to remember:</p>
<pre><code class="language-sql">SELECT 'Vở kẻ ngang'::text AS a, length('Vở kẻ ngang') AS chars, octet_length('Vở kẻ ngang') AS bytes;</code></pre>
<div class="out">      a      | chars | bytes
-------------+-------+-------
 Vở kẻ ngang |    11 |    15
(1 row)</div>

<h3>Renamed 4 — GETDATE() → now(), DATETIME2 → timestamptz</h3>
<p>We inserted <code>'2026-10-25 09:00:00 +07:00'</code> into a DATETIME2 and a DATETIMEOFFSET column on SQL Server: DATETIME2 kept <code>2026-10-25 09:00:00.0000000</code> and silently dropped the +07:00; DATETIMEOFFSET kept the offset (<code>02:00 +00:00</code> in UTC). MySQL and PostgreSQL behave the same way with their two types — a plain one and a zone-aware one:</p>
<pre><code class="language-sql">CREATE TEMP TABLE t_ts (a timestamp, b timestamptz);
SET TIME ZONE 'Asia/Ho_Chi_Minh';
INSERT INTO t_ts VALUES ('2026-10-25 09:00', '2026-10-25 09:00');
SET TIME ZONE 'UTC';
SELECT a, b FROM t_ts;</code></pre>
<div class="out">          a          |           b
---------------------+------------------------
 2026-10-25 09:00:00 | 2026-10-25 02:00:00+00
(1 row)</div>
<p>MySQL printed <code>2026-10-25 09:00:00</code> for DATETIME and <code>2026-10-25 02:00:00</code> for TIMESTAMP after the same steps. The current time is <code>now()</code> in PostgreSQL; <code>SELECT GETDATE();</code> fails with <code>function getdate() does not exist</code>. Chapter 2.3 explains why <code>timestamptz</code> is the right default.</p>

<h3>Renamed 5 — ISNULL / IFNULL → COALESCE, + / CONCAT → ||</h3>
<pre><code class="language-sql">SELECT full_name, COALESCE(phone, 'n/a') FROM customer;
SELECT ISNULL(phone, 'n/a') FROM customer;</code></pre>
<div class="out">   full_name   |  coalesce
---------------+------------
 Nguyễn Văn An | 0901000001
 Trần Thị Bình | n/a
 Lê Minh Chi   |
(3 rows)

ERROR:  function isnull(text, unknown) does not exist</div>
<p><code>COALESCE</code> works on all three — make it your habit. For strings, NULL behaves differently per function. With <code>phone</code> NULL:</p>
<table>
<tr><th>Expression</th><th>Result</th></tr>
<tr><td>SQL Server <code>'Phone: ' + phone</code></td><td>NULL</td></tr>
<tr><td>SQL Server <code>CONCAT('Phone: ', phone)</code></td><td><code>Phone: </code> (skips NULL)</td></tr>
<tr><td>MySQL <code>CONCAT('Phone: ', phone)</code></td><td>NULL</td></tr>
<tr><td>PostgreSQL <code>'Phone: ' || phone</code></td><td>NULL</td></tr>
<tr><td>PostgreSQL <code>concat('Phone: ', phone)</code></td><td><code>Phone: </code> (skips NULL)</td></tr>
</table>
<div class="pitfall"><p><strong>Trap — <code>||</code> in MySQL means OR.</strong> <code>SELECT 'BUT' || '-01'</code> returned <code>1</code> on MySQL 8.4 “with 2 warnings”: both strings were turned into numbers and OR-ed. In PostgreSQL the same text joins strings.</p></div>

<h3>Renamed 6 — BIT / TINYINT(1) → boolean</h3>
<p>SQL Server's BIT and MySQL's TINYINT(1) are really numbers (in MySQL <code>TRUE + TRUE</code> is <code>2</code>). PostgreSQL has a real boolean type:</p>
<pre><code class="language-sql">SELECT sku, is_active FROM product WHERE is_active;
SELECT sku FROM product WHERE is_active = 1;
SELECT sku FROM product WHERE NOT is_active;</code></pre>
<div class="out">   sku   | is_active
---------+-----------
 BUT-01  | t
 VO-02   | t
 BALO-04 | t
 MAY-05  | t
(4 rows)

ERROR:  operator does not exist: boolean = integer
LINE 1: SELECT sku FROM product WHERE is_active = 1;
                                                ^
HINT:  No operator matches the given name and argument types. You might need to add explicit type casts.
   sku
----------
 THUOC-03
(1 row)</div>
<p>SQL Server is the mirror image: <code>WHERE is_active = 1</code> works, the bare <code>WHERE is_active</code> fails with <code>Msg 4145 … An expression of non-boolean type specified in a context where a condition is expected</code>.</p>

<h3>Renamed 7 — OUTPUT → RETURNING</h3>
<pre><code class="language-sql">INSERT INTO product (sku, name, price) VALUES ('GOM-07', 'Gôm tẩy', 3000) RETURNING id, sku;
UPDATE product SET price = price * 1.1 WHERE sku = 'GOM-07' RETURNING price AS new_price;</code></pre>
<div class="out"> id |  sku
----+--------
  6 | GOM-07
(1 row)

INSERT 0 1
 new_price
-----------
   3300.00
(1 row)

UPDATE 1</div>
<p>On SQL Server the same is <code>OUTPUT inserted.id, inserted.sku</code> (and <code>OUTPUT deleted.price AS old_price, inserted.price AS new_price</code> for the update: 3000.00 → 3300.00). MySQL 8.4 has no RETURNING — the statement fails with error 1064, and you run a second query <code>SELECT LAST_INSERT_ID()</code>.</p>

<h3>Renamed 8 — MERGE / ON DUPLICATE KEY → ON CONFLICT</h3>
<p>Thirty more pens arrive: add them if <code>BUT-01</code> exists, otherwise insert it.</p>
<pre><code class="language-sql">-- SQL Server
MERGE product AS t
USING (VALUES ('BUT-01', N'Bút bi Thiên Long', 5000, 30)) AS s(sku, name, price, stock)
  ON t.sku = s.sku
WHEN MATCHED THEN UPDATE SET stock = t.stock + s.stock
WHEN NOT MATCHED THEN INSERT (sku, name, price, stock) VALUES (s.sku, s.name, s.price, s.stock);

-- MySQL 8  (reports "2 rows affected" when it updates)
INSERT INTO product (sku, name, price, stock) VALUES ('BUT-01', 'Bút bi Thiên Long', 5000, 30) AS s
  ON DUPLICATE KEY UPDATE stock = product.stock + s.stock;

-- PostgreSQL
INSERT INTO product (sku, name, price, stock) VALUES ('BUT-01', 'Bút bi Thiên Long', 5000, 30)
  ON CONFLICT (sku) DO UPDATE SET stock = product.stock + EXCLUDED.stock
  RETURNING sku, stock;</code></pre>
<div class="out">  sku   | stock
--------+-------
 BUT-01 |   150
(1 row)

INSERT 0 1</div>
<p>All three end at 150. PostgreSQL names the conflict target <code>(sku)</code> — there must be a UNIQUE index or constraint on it — and calls the row you tried to insert <code>EXCLUDED</code>. PostgreSQL 15+ also has MERGE; ON CONFLICT remains the everyday upsert (Chapter 4.1).</p>

<h3>Renamed 9 — T-SQL procedures → PL/pgSQL functions</h3>
<pre><code class="language-sql">CREATE OR REPLACE FUNCTION stock_value(min_price numeric) RETURNS numeric
LANGUAGE plpgsql AS $$
DECLARE
  total numeric;
BEGIN
  SELECT sum(price * stock) INTO total FROM product WHERE price &gt;= min_price;
  RETURN total;
END;
$$;
SELECT stock_value(10000) AS total;</code></pre>
<div class="out">    total
-------------
 14670000.00
(1 row)</div>
<p>The T-SQL version (<code>CREATE OR ALTER PROCEDURE stock_value @min_price DECIMAL(12,2) AS BEGIN … END</code>, called with <code>EXEC stock_value @min_price = 10000</code>) and the MySQL one (<code>DELIMITER //</code> … <code>CALL stock_value(10000)</code>) both returned 14670000.00. What changes: no <code>@</code> on variables, no DELIMITER — the body is a string between <code>$$ … $$</code> — and a function is used inside SELECT. Chapter 12 teaches PL/pgSQL.</p>

<h3>Renamed 10 — dbo / database / public</h3>
<p>SQL Server: server → database → schema (default <code>dbo</code>) → table. MySQL: a “database” and a “schema” are the same thing (<code>SELECT DATABASE(), SCHEMA()</code> both said <code>ctmini</code>). PostgreSQL: server → database → schema (default <code>public</code>) → table, and you cannot join tables across two databases in one query — use schemas inside one database instead.</p>
<pre><code class="language-sql">SELECT current_schema();
SHOW search_path;</code></pre>
<div class="out"> current_schema
----------------
 public
(1 row)

   search_path
-----------------
 "$user", public
(1 row)</div>

<h3>Renamed 11 — quoting names, and case folding</h3>
<p><code>[Order Note]</code> in SQL Server, <code>&#96;Order Note&#96;</code> in MySQL, <code>"Order Note"</code> in PostgreSQL. The real difference is case. PostgreSQL turns every unquoted name into lower case; a quoted name is kept exactly:</p>
<pre><code class="language-sql">CREATE TABLE "Customer" (id int);
SELECT * FROM Customer;          -- reads the table customer, not "Customer"
SELECT * FROM "Order note";      -- the table is "Order Note"</code></pre>
<div class="out"> id |     email      |   full_name   |   phone
----+----------------+---------------+------------
  1 | an@ctshop.vn   | Nguyễn Văn An | 0901000001
  2 | binh@ctshop.vn | Trần Thị Bình |
  3 | chi@ctshop.vn  | Lê Minh Chi   |
(3 rows)

ERROR:  relation "Order note" does not exist</div>
<p>SQL Server with a CI collation does not care (<code>SELECT * FROM PRODUCT WHERE SKU = 'BUT-01'</code> worked). MySQL on Linux treats <strong>table</strong> names as case-sensitive (<code>ERROR 1146 … Table 'ctmini.PRODUCT' doesn't exist</code>) but not column names. The PostgreSQL rule that saves you: <strong>lower_snake_case, never quotes</strong>.</p>

<h3>Trap 1 — comparing text (collation)</h3>
<table>
<tr><th>Query on product.name</th><th>SQL Server</th><th>MySQL</th><th>PostgreSQL</th></tr>
<tr><td><code>= 'BÚT BI THIÊN LONG'</code></td><td>1 row</td><td>1 row</td><td>0 rows</td></tr>
<tr><td><code>LIKE 'balo%'</code></td><td>1 row</td><td>1 row</td><td>0 rows</td></tr>
<tr><td><code>= 'But bi Thien Long'</code> (no accents)</td><td>0 rows</td><td>1 row</td><td>0 rows</td></tr>
</table>
<p>SQL Server's default collation is <strong>C</strong>ase-<strong>I</strong>nsensitive and <strong>A</strong>ccent-<strong>S</strong>ensitive. MySQL 8's <code>utf8mb4_0900_ai_ci</code> is accent-insensitive <em>and</em> case-insensitive. PostgreSQL compares exactly. Two fixes:</p>
<pre><code class="language-sql">SELECT sku, name FROM product WHERE name ILIKE 'balo%';
SELECT sku, name FROM product WHERE lower(name) = lower('BÚT BI THIÊN LONG');</code></pre>
<div class="out">   sku   |     name
---------+---------------
 BALO-04 | Balo chống gù
(1 row)

  sku   |       name
--------+-------------------
 BUT-01 | Bút bi Thiên Long
(1 row)</div>
<p>Accent-insensitive search (“but bi” finding “Bút bi”) needs the <code>unaccent</code> extension and trigram indexes — Chapter 13.</p>

<h3>Trap 2 — dividing integers</h3>
<table>
<tr><th>Expression</th><th>SQL Server</th><th>MySQL</th><th>PostgreSQL</th></tr>
<tr><td><code>7 / 2</code></td><td>3</td><td>3.5000</td><td>3</td></tr>
<tr><td><code>SUM(stock) / COUNT(*)</code></td><td>36</td><td>36.6000</td><td>36</td></tr>
<tr><td><code>AVG(stock)</code> (int column)</td><td>36</td><td>36.6000</td><td>36.6000000000000000</td></tr>
</table>
<p>A MySQL report that showed 36.6 silently shows 36 after you move it. No error — just a wrong number. In PostgreSQL say what you mean: <code>avg(stock)</code>, <code>sum(stock)::numeric / count(*)</code>, or <code>round(avg(stock), 1)</code> → 36.6. (Note that SQL Server truncates even <code>AVG</code> of an int column.)</p>

<h3>Trap 3 — empty string, spaces and NULL</h3>
<table>
<tr><th>Real result on ctmini</th><th>SQL Server</th><th>MySQL</th><th>PostgreSQL</th></tr>
<tr><td><code>'' = ' '</code></td><td>equal</td><td>different</td><td>different</td></tr>
<tr><td><code>'abc' = 'abc   '</code></td><td>equal</td><td>different</td><td>different</td></tr>
<tr><td>length of <code>'abc   '</code></td><td><code>LEN</code> = 3</td><td><code>CHAR_LENGTH</code> = 6</td><td><code>length</code> = 6</td></tr>
<tr><td><code>COUNT(*)</code> · <code>COUNT(phone)</code> · <code>COUNT(NULLIF(phone, ''))</code></td><td>3 · 2 · 1</td><td>3 · 2 · 1</td><td>3 · 2 · 1</td></tr>
</table>
<p>On all three an empty string is a real value, not NULL (Oracle is the odd one out) — so <code>COUNT(phone)</code> counts Chi's empty phone, and <code>NULLIF(phone, '')</code> turns '' into NULL when you mean “no phone”. What bites when moving from SQL Server: it pads strings with spaces before comparing, so trailing spaces never mattered there. In PostgreSQL they do — trim input (<code>trim()</code>) or forbid it with a CHECK.</p>

<h3>Trap 4 — UPDATE with a row limit</h3>
<pre><code class="language-sql">UPDATE product SET stock = stock - 1 WHERE stock &gt; 0 ORDER BY price DESC LIMIT 1;   -- MySQL style
UPDATE product SET stock = stock - 1
WHERE id = (SELECT id FROM product WHERE stock &gt; 0 ORDER BY price DESC LIMIT 1)
RETURNING sku, stock;</code></pre>
<div class="out">ERROR:  syntax error at or near "ORDER"
LINE 1: ...ATE product SET stock = stock - 1 WHERE stock &gt; 0 ORDER BY p...
                                                             ^
  sku   | stock
--------+-------
 MAY-05 |    14
(1 row)

UPDATE 1</div>
<p>MySQL accepts the first form. SQL Server's <code>UPDATE TOP (1) product SET stock = stock - 1 WHERE stock &gt; 0</code> runs but cannot take an ORDER BY — it changed <code>BUT-01</code> (stock 120 → 119), not the most expensive product. PostgreSQL makes you choose the row explicitly in a subquery.</p>

<h3>Tools</h3>
<table>
<tr><th>Task</th><th>SQL Server (sqlcmd / SSMS)</th><th>MySQL (mysql / Workbench)</th><th>PostgreSQL (psql)</th></tr>
<tr><td>List databases</td><td><code>SELECT name FROM sys.databases</code></td><td><code>SHOW DATABASES;</code></td><td><code>\\l</code></td></tr>
<tr><td>Switch database</td><td><code>USE ctmini;</code></td><td><code>USE ctmini;</code></td><td><code>\\c ctmini</code></td></tr>
<tr><td>List tables</td><td><code>SELECT * FROM INFORMATION_SCHEMA.TABLES</code></td><td><code>SHOW TABLES;</code></td><td><code>\\dt</code></td></tr>
<tr><td>Describe a table</td><td><code>EXEC sp_help 'product'</code></td><td><code>DESCRIBE product;</code></td><td><code>\\d product</code></td></tr>
<tr><td>Run what you typed</td><td><code>GO</code></td><td><code>;</code></td><td><code>;</code></td></tr>
</table>
<p>GUIs: SSMS, MySQL Workbench, and for PostgreSQL pgAdmin (official) or DBeaver Community (free, opens all three side by side). This course stays in psql because it shows exactly what the server says.</p>

<h3>In a real project: Prisma hides some of it, not all</h3>
<p>cuongthai.com runs PostgreSQL through Prisma. Prisma translates the syntax for you — <code>mode: 'insensitive'</code>, which appears in 195 places in this site's backend, is sent to PostgreSQL as a real <code>ILIKE</code> (query log of <code>prisma.user.findFirst({ where: { email: { equals: raw, mode: 'insensitive' } } })</code>):</p>
<div class="out">SELECT "public"."users"."id" FROM "public"."users" WHERE "public"."users"."email" ILIKE $1 LIMIT $2 OFFSET $3</div>
<p>But an ORM cannot change the database's rules: <code>DateTime</code> becomes <code>timestamp(3)</code> <em>without</em> time zone (the DATETIME2 problem again), <code>@default(autoincrement())</code> becomes <code>SERIAL</code>, integer division is still integer division. You still need this lesson.</p>

<h3>Exercise</h3>
<ol>
<li>Translate the T-SQL <code>SELECT TOP 2 sku, name + ' (' + CAST(stock AS VARCHAR(10)) + ')' AS label FROM product WHERE is_active = 1 ORDER BY stock DESC;</code></li>
<li>Translate <code>SELECT full_name, ISNULL(NULLIF(phone, ''), 'no phone') FROM customer;</code></li>
<li>The MySQL query <code>SELECT sku, name FROM product WHERE name LIKE 'balo%';</code> returns one row. Make PostgreSQL return it too.</li>
<li>A MySQL report showed <code>SUM(stock) / COUNT(*)</code> = 36.6. Make PostgreSQL show 36.6.</li>
</ol>
<details><summary>Answers (real output)</summary>
<pre><code class="language-sql">SELECT sku, name || ' (' || stock || ')' AS label FROM product WHERE is_active ORDER BY stock DESC LIMIT 2;
SELECT full_name, COALESCE(NULLIF(phone, ''), 'no phone') AS phone FROM customer;
SELECT sku, name FROM product WHERE name ILIKE 'balo%';
SELECT sum(stock) / count(*) AS wrong, round(avg(stock), 1) AS right_avg FROM product;</code></pre>
<div class="out">  sku   |           label
--------+----------------------------
 BUT-01 | Bút bi Thiên Long (120)
 VO-02  | Vở kẻ ngang 200 trang (40)
(2 rows)

   full_name   |   phone
---------------+------------
 Nguyễn Văn An | 0901000001
 Trần Thị Bình | no phone
 Lê Minh Chi   | no phone
(3 rows)

   sku   |     name
---------+---------------
 BALO-04 | Balo chống gù
(1 row)

 wrong | right_avg
-------+-----------
    36 |      36.6
(1 row)</div>
</details>

<h3>Your route from here</h3>
<p>Skim Chapters 1–7: the lessons of Chapters 2–7 carry the tag <em>“⏩ Know SQL Server or MySQL already? You can skim”</em> — read the slides and the traps, run the examples. Then study <strong>Chapters 8–17</strong> carefully (window functions, indexes, EXPLAIN, transactions and MVCC, PL/pgSQL, JSONB, operations, replication), and do every lab and the final exam. Chapter 17 comes back to this comparison in depth — SQL Server, MySQL, PostgreSQL and MongoDB on the same data, and how to choose.</p>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practise the PostgreSQL way</span><span class="lc-sub">Code Lab PostgreSQL — then Chapter 1: why PostgreSQL exists.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.5 · Đường tắt</span>
<h2>Từ SQL Server / MySQL sang PostgreSQL</h2>
<p class="lead">Nếu bạn đã học SQL trên SQL Server (DBI202, SSMS, T-SQL) hoặc MySQL (XAMPP, Workbench), bạn đã biết phần lớn PostgreSQL rồi. Bài này ánh xạ những gì bạn biết sang PostgreSQL trong một lần ngồi: <strong>cùng</strong> một CSDL nhỏ trên ba máy chủ, <strong>cùng</strong> câu hỏi, mọi output đều thật. Bạn sẽ gặp ba loại khác biệt — thứ <strong>giữ nguyên</strong>, thứ chỉ <strong>đổi tên</strong>, và những cái <strong>bẫy</strong> nơi cùng một câu chữ cho kết quả khác mà không báo lỗi gì.</p>
<div class="callout ok">Mới học SQL lần đầu? Bỏ qua bài này, bắt đầu từ Chương 1 — chương nào cũng dạy PostgreSQL từ số 0. Ngày nào đi làm gặp SQL Server hay MySQL thì quay lại đây.</div>

<h3>Phòng thí nghiệm: một CSDL, ba máy chủ</h3>
<p>Mọi kết quả dưới đây được tạo ngày 25/10/2026 bằng cách chạy cùng các script trên <strong>SQL Server 2022</strong> (16.0.4305, image Docker <code>mcr.microsoft.com/mssql/server:2022-latest</code>, client <code>sqlcmd</code>), <strong>MySQL 8.4.13</strong> (<code>mysql:8.4</code>, client <code>mysql</code>) và <strong>PostgreSQL 17.11</strong> (máy của khoá từ bài 0.3: <code>postgres:17</code> cổng 5444, client <code>psql</code>). Bạn tự chạy được:</p>
<pre><code class="language-bash"># MySQL 8.4 — cổng 33306 trên máy bạn
docker run -d --name pgcourse-mysql -p 127.0.0.1:33306:3306 -e MYSQL_ROOT_PASSWORD=123456 mysql:8.4
docker exec -it pgcourse-mysql mysql -uroot -p123456

# SQL Server 2022 — máy Apple Silicon thêm --platform linux/amd64 (chạy qua Rosetta)
docker run -d --platform linux/amd64 --name pgcourse-mssql -p 127.0.0.1:14331:1433 \\
  -e ACCEPT_EULA=Y -e MSSQL_SA_PASSWORD='Pg_Course123' mcr.microsoft.com/mssql/server:2022-latest
docker exec -it pgcourse-mssql /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'Pg_Course123' -C

# PostgreSQL 17 — container từ bài 0.3
psql -h localhost -p 5444 -U postgres</code></pre>
<p>CSDL tên <code>ctmini</code>: bảng <code>product</code> 5 dòng và bảng <code>customer</code> 3 dòng. Đây là bản PostgreSQL; hai bản kia chỉ khác ở các kiểu bạn sẽ gặp ngay dưới (<code>IDENTITY</code>/<code>AUTO_INCREMENT</code>, <code>NVARCHAR</code>, <code>BIT</code>/<code>TINYINT(1)</code>, <code>DATETIME2</code>/<code>DATETIME</code>):</p>
<pre><code class="language-sql">CREATE DATABASE ctmini;   -- rồi \\c ctmini
CREATE TABLE product (
  id         int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sku        text          NOT NULL UNIQUE,
  name       text          NOT NULL,
  price      numeric(12,2) NOT NULL,
  stock      int           NOT NULL DEFAULT 0,
  is_active  boolean       NOT NULL DEFAULT true,
  created_at timestamptz   NOT NULL DEFAULT now()
);
INSERT INTO product (sku, name, price, stock, is_active) VALUES
 ('BUT-01',   'Bút bi Thiên Long',      5000, 120, true),
 ('VO-02',    'Vở kẻ ngang 200 trang', 18000,  40, true),
 ('THUOC-03', 'Thước kẻ 30cm',          7000,   0, false),
 ('BALO-04',  'Balo chống gù',        450000,   8, true),
 ('MAY-05',   'Máy tính Casio fx-580',690000,  15, true);
CREATE TABLE customer (
  id        int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email     text NOT NULL UNIQUE,
  full_name text NOT NULL,
  phone     text
);
INSERT INTO customer (email, full_name, phone) VALUES
 ('an@ctshop.vn',  'Nguyễn Văn An', '0901000001'),
 ('binh@ctshop.vn','Trần Thị Bình', NULL),
 ('chi@ctshop.vn', 'Lê Minh Chi',   '');</code></pre>

<h3>Cùng câu hỏi, cùng đáp án</h3>
<p>“Giá trị tồn kho của mọi sản phẩm đang bán, lớn nhất trước.” Ba câu lệnh chỉ khác ở cách kiểm <code>is_active</code>:</p>
<pre><code class="language-sql">-- SQL Server / MySQL
SELECT sku, price * stock AS stock_value FROM product WHERE is_active = 1 ORDER BY stock_value DESC;
-- PostgreSQL
SELECT sku, price * stock AS stock_value FROM product WHERE is_active ORDER BY stock_value DESC;</code></pre>
<div class="out">   sku   | stock_value
---------+-------------
 MAY-05  | 10350000.00
 BALO-04 |  3600000.00
 VO-02   |   720000.00
 BUT-01  |   600000.00
(4 rows)</div>
<p>sqlcmd và mysql in đúng bốn dòng và các con số đó theo kiểu bảng của riêng chúng. Đó là tin vui: SELECT, WHERE, JOIN, GROUP BY, HAVING, ORDER BY, truy vấn con, CTE, hàm cửa sổ, PRIMARY / FOREIGN KEY, CHECK và giao dịch mang cùng một nghĩa trên cả ba máy chủ.</p>

<h3>Bảng tra nhanh</h3>
<table>
<tr><th>Việc</th><th>SQL Server</th><th>MySQL</th><th>PostgreSQL</th></tr>
<tr><td>N dòng đầu</td><td><code>SELECT TOP 3 …</code></td><td><code>… LIMIT 3</code></td><td><code>… LIMIT 3</code> / <code>FETCH FIRST 3 ROWS ONLY</code></td></tr>
<tr><td>Số tự tăng</td><td><code>INT IDENTITY(1,1)</code></td><td><code>INT AUTO_INCREMENT</code></td><td><code>int GENERATED ALWAYS AS IDENTITY</code></td></tr>
<tr><td>Chữ Unicode</td><td><code>NVARCHAR(n)</code> + <code>N'…'</code></td><td><code>VARCHAR(n)</code> (utf8mb4)</td><td><code>text</code></td></tr>
<tr><td>Giờ hiện tại</td><td><code>GETDATE()</code>, <code>SYSDATETIME()</code></td><td><code>NOW()</code></td><td><code>now()</code></td></tr>
<tr><td>Thay thế NULL</td><td><code>ISNULL(a, b)</code></td><td><code>IFNULL(a, b)</code></td><td><code>COALESCE(a, b)</code> (cả ba đều có)</td></tr>
<tr><td>Nối chuỗi</td><td><code>a + b</code></td><td><code>CONCAT(a, b)</code></td><td><code>a || b</code></td></tr>
<tr><td>Đúng / sai</td><td><code>BIT</code></td><td><code>TINYINT(1)</code></td><td><code>boolean</code></td></tr>
<tr><td>Ngày + giờ</td><td><code>DATETIME2</code> / <code>DATETIMEOFFSET</code></td><td><code>DATETIME</code> / <code>TIMESTAMP</code></td><td><code>timestamp</code> / <code>timestamptz</code></td></tr>
<tr><td>Dòng vừa ghi</td><td><code>OUTPUT inserted.id</code></td><td>— (<code>LAST_INSERT_ID()</code>)</td><td><code>RETURNING id</code></td></tr>
<tr><td>Upsert</td><td><code>MERGE</code></td><td><code>ON DUPLICATE KEY UPDATE</code></td><td><code>ON CONFLICT … DO UPDATE</code></td></tr>
<tr><td>Mã trong máy chủ</td><td>procedure T-SQL</td><td>stored procedure + <code>DELIMITER</code></td><td>hàm PL/pgSQL</td></tr>
<tr><td>Không gian tên</td><td>database → schema <code>dbo</code></td><td>database = schema</td><td>database → schema <code>public</code></td></tr>
<tr><td>Ngoặc cho tên</td><td><code>[Order Note]</code></td><td><code>&#96;Order Note&#96;</code></td><td><code>"Order Note"</code> (và đổi chữ thường)</td></tr>
<tr><td><code>'abc' = 'ABC'</code></td><td>đúng (collation CI)</td><td>đúng (ai_ci: bỏ cả dấu)</td><td>sai → <code>ILIKE</code> / <code>lower()</code></td></tr>
<tr><td><code>7 / 2</code></td><td>3</td><td>3.5000</td><td>3</td></tr>
<tr><td><code>'' = ' '</code></td><td>đúng (đệm dấu cách)</td><td>sai</td><td>sai</td></tr>
<tr><td>Chỉ sửa một dòng</td><td><code>UPDATE TOP (1)</code></td><td><code>… ORDER BY … LIMIT 1</code></td><td>không có LIMIT → <code>WHERE id = (truy vấn con)</code></td></tr>
<tr><td>Công cụ</td><td>SSMS, sqlcmd</td><td>Workbench, mysql</td><td>psql, pgAdmin, DBeaver</td></tr>
</table>

<h3>Đổi tên 1 — TOP → LIMIT</h3>
<pre><code class="language-sql">SELECT sku, price FROM product ORDER BY price DESC LIMIT 3;
SELECT sku, price FROM product ORDER BY price DESC OFFSET 1 FETCH FIRST 2 ROWS ONLY;
SELECT TOP 3 sku FROM product;</code></pre>
<div class="out">   sku   |   price
---------+-----------
 MAY-05  | 690000.00
 BALO-04 | 450000.00
 VO-02   |  18000.00
(3 rows)

   sku   |   price
---------+-----------
 BALO-04 | 450000.00
 VO-02   |  18000.00
(2 rows)

ERROR:  syntax error at or near "3"
LINE 1: SELECT TOP 3 sku FROM product;
                   ^</div>
<p><code>OFFSET … FETCH FIRST … ROWS ONLY</code> là chuẩn SQL, chạy được cả trên SQL Server (<code>OFFSET 1 ROWS FETCH NEXT 2 ROWS ONLY</code> cũng ra đúng hai dòng đó). <code>TOP</code> chỉ có ở SQL Server.</p>

<h3>Đổi tên 2 — IDENTITY → GENERATED ALWAYS AS IDENTITY</h3>
<p>Cả ba đều tự đánh số dòng mới. Khác biệt lộ ra khi bạn tự ghi id:</p>
<pre><code class="language-sql">INSERT INTO product (id, sku, name, price) VALUES (99, 'X-99', 'Thử', 1);</code></pre>
<div class="out">ERROR:  cannot insert a non-DEFAULT value into column "id"
DETAIL:  Column "id" is an identity column defined as GENERATED ALWAYS.
HINT:  Use OVERRIDING SYSTEM VALUE to override.</div>
<p>SQL Server cũng từ chối (<code>Msg 544 … Cannot insert explicit value for identity column in table 'product' when IDENTITY_INSERT is set to OFF.</code>). MySQL nhận 99 không một lời — và id tự động kế tiếp thành 100. Mã PostgreSQL cũ hay dùng <code>serial</code>; bảng mới dùng IDENTITY (Chương 3.1). Muốn lấy lại id mới, PostgreSQL dùng <code>RETURNING id</code> (bên dưới) thay cho <code>SCOPE_IDENTITY()</code> / <code>LAST_INSERT_ID()</code>.</p>

<h3>Đổi tên 3 — NVARCHAR → text</h3>
<p>SQL Server với collation mặc định <code>SQL_Latin1_General_CP1_CI_AS</code> không lưu được “ở”, “ẻ” trong cột VARCHAR — và ngay cả cột NVARCHAR cũng mất chúng nếu chuỗi không có tiền tố <code>N</code>:</p>
<div class="out">a                              b                              len_b       bytes_b
------------------------------ ------------------------------ ----------- -----------
V? k? ngang                    V? k? ngang                             11          22
V? k? ngang                    Vở kẻ ngang                             11          22</div>
<p>(dòng 1: <code>'Vở kẻ ngang'</code> không có N; dòng 2: <code>N'Vở kẻ ngang'</code> vào cột VARCHAR <code>a</code> và NVARCHAR <code>b</code>.) MySQL 8 mặc định utf8mb4 còn database PostgreSQL là UTF-8, nên chẳng có gì phải nhớ:</p>
<pre><code class="language-sql">SELECT 'Vở kẻ ngang'::text AS a, length('Vở kẻ ngang') AS chars, octet_length('Vở kẻ ngang') AS bytes;</code></pre>
<div class="out">      a      | chars | bytes
-------------+-------+-------
 Vở kẻ ngang |    11 |    15
(1 row)</div>

<h3>Đổi tên 4 — GETDATE() → now(), DATETIME2 → timestamptz</h3>
<p>Ta chèn <code>'2026-10-25 09:00:00 +07:00'</code> vào một cột DATETIME2 và một cột DATETIMEOFFSET trên SQL Server: DATETIME2 giữ <code>2026-10-25 09:00:00.0000000</code> và lặng lẽ bỏ mất +07:00; DATETIMEOFFSET giữ múi (<code>02:00 +00:00</code> theo UTC). MySQL và PostgreSQL cũng y như vậy với hai kiểu của chúng — một kiểu trơn, một kiểu biết múi giờ:</p>
<pre><code class="language-sql">CREATE TEMP TABLE t_ts (a timestamp, b timestamptz);
SET TIME ZONE 'Asia/Ho_Chi_Minh';
INSERT INTO t_ts VALUES ('2026-10-25 09:00', '2026-10-25 09:00');
SET TIME ZONE 'UTC';
SELECT a, b FROM t_ts;</code></pre>
<div class="out">          a          |           b
---------------------+------------------------
 2026-10-25 09:00:00 | 2026-10-25 02:00:00+00
(1 row)</div>
<p>Sau đúng các bước đó MySQL in <code>2026-10-25 09:00:00</code> cho DATETIME và <code>2026-10-25 02:00:00</code> cho TIMESTAMP. Giờ hiện tại trong PostgreSQL là <code>now()</code>; <code>SELECT GETDATE();</code> báo <code>function getdate() does not exist</code>. Chương 2.3 giải thích vì sao <code>timestamptz</code> là lựa chọn mặc định đúng.</p>

<h3>Đổi tên 5 — ISNULL / IFNULL → COALESCE, + / CONCAT → ||</h3>
<pre><code class="language-sql">SELECT full_name, COALESCE(phone, 'n/a') FROM customer;
SELECT ISNULL(phone, 'n/a') FROM customer;</code></pre>
<div class="out">   full_name   |  coalesce
---------------+------------
 Nguyễn Văn An | 0901000001
 Trần Thị Bình | n/a
 Lê Minh Chi   |
(3 rows)

ERROR:  function isnull(text, unknown) does not exist</div>
<p><code>COALESCE</code> chạy trên cả ba — hãy biến nó thành thói quen. Với chuỗi, NULL cư xử khác nhau tuỳ hàm. Khi <code>phone</code> là NULL:</p>
<table>
<tr><th>Biểu thức</th><th>Kết quả</th></tr>
<tr><td>SQL Server <code>'Phone: ' + phone</code></td><td>NULL</td></tr>
<tr><td>SQL Server <code>CONCAT('Phone: ', phone)</code></td><td><code>Phone: </code> (bỏ qua NULL)</td></tr>
<tr><td>MySQL <code>CONCAT('Phone: ', phone)</code></td><td>NULL</td></tr>
<tr><td>PostgreSQL <code>'Phone: ' || phone</code></td><td>NULL</td></tr>
<tr><td>PostgreSQL <code>concat('Phone: ', phone)</code></td><td><code>Phone: </code> (bỏ qua NULL)</td></tr>
</table>
<div class="pitfall"><p><strong>Bẫy — <code>||</code> trong MySQL nghĩa là OR.</strong> <code>SELECT 'BUT' || '-01'</code> trả về <code>1</code> trên MySQL 8.4 “kèm 2 cảnh báo”: hai chuỗi bị đổi thành số rồi OR với nhau. Trong PostgreSQL cùng câu chữ đó là nối chuỗi.</p></div>

<h3>Đổi tên 6 — BIT / TINYINT(1) → boolean</h3>
<p>BIT của SQL Server và TINYINT(1) của MySQL thật ra là số (trong MySQL <code>TRUE + TRUE</code> bằng <code>2</code>). PostgreSQL có kiểu boolean thật:</p>
<pre><code class="language-sql">SELECT sku, is_active FROM product WHERE is_active;
SELECT sku FROM product WHERE is_active = 1;
SELECT sku FROM product WHERE NOT is_active;</code></pre>
<div class="out">   sku   | is_active
---------+-----------
 BUT-01  | t
 VO-02   | t
 BALO-04 | t
 MAY-05  | t
(4 rows)

ERROR:  operator does not exist: boolean = integer
LINE 1: SELECT sku FROM product WHERE is_active = 1;
                                                ^
HINT:  No operator matches the given name and argument types. You might need to add explicit type casts.
   sku
----------
 THUOC-03
(1 row)</div>
<p>SQL Server thì ngược lại như soi gương: <code>WHERE is_active = 1</code> chạy, còn <code>WHERE is_active</code> trần báo <code>Msg 4145 … An expression of non-boolean type specified in a context where a condition is expected</code>.</p>

<h3>Đổi tên 7 — OUTPUT → RETURNING</h3>
<pre><code class="language-sql">INSERT INTO product (sku, name, price) VALUES ('GOM-07', 'Gôm tẩy', 3000) RETURNING id, sku;
UPDATE product SET price = price * 1.1 WHERE sku = 'GOM-07' RETURNING price AS new_price;</code></pre>
<div class="out"> id |  sku
----+--------
  6 | GOM-07
(1 row)

INSERT 0 1
 new_price
-----------
   3300.00
(1 row)

UPDATE 1</div>
<p>Trên SQL Server tương đương là <code>OUTPUT inserted.id, inserted.sku</code> (và <code>OUTPUT deleted.price AS old_price, inserted.price AS new_price</code> cho lệnh cập nhật: 3000.00 → 3300.00). MySQL 8.4 không có RETURNING — câu lệnh báo lỗi 1064, và bạn chạy thêm câu <code>SELECT LAST_INSERT_ID()</code>.</p>

<h3>Đổi tên 8 — MERGE / ON DUPLICATE KEY → ON CONFLICT</h3>
<p>Về thêm 30 cây bút: nếu <code>BUT-01</code> đã có thì cộng thêm, chưa có thì chèn mới.</p>
<pre><code class="language-sql">-- SQL Server
MERGE product AS t
USING (VALUES ('BUT-01', N'Bút bi Thiên Long', 5000, 30)) AS s(sku, name, price, stock)
  ON t.sku = s.sku
WHEN MATCHED THEN UPDATE SET stock = t.stock + s.stock
WHEN NOT MATCHED THEN INSERT (sku, name, price, stock) VALUES (s.sku, s.name, s.price, s.stock);

-- MySQL 8  (báo "2 rows affected" khi là cập nhật)
INSERT INTO product (sku, name, price, stock) VALUES ('BUT-01', 'Bút bi Thiên Long', 5000, 30) AS s
  ON DUPLICATE KEY UPDATE stock = product.stock + s.stock;

-- PostgreSQL
INSERT INTO product (sku, name, price, stock) VALUES ('BUT-01', 'Bút bi Thiên Long', 5000, 30)
  ON CONFLICT (sku) DO UPDATE SET stock = product.stock + EXCLUDED.stock
  RETURNING sku, stock;</code></pre>
<div class="out">  sku   | stock
--------+-------
 BUT-01 |   150
(1 row)

INSERT 0 1</div>
<p>Cả ba đều ra 150. PostgreSQL nêu rõ cột xung đột <code>(sku)</code> — ở đó phải có chỉ mục hoặc ràng buộc UNIQUE — và gọi dòng bạn định chèn là <code>EXCLUDED</code>. PostgreSQL 15+ cũng có MERGE; ON CONFLICT vẫn là cách upsert hằng ngày (Chương 4.1).</p>

<h3>Đổi tên 9 — procedure T-SQL → hàm PL/pgSQL</h3>
<pre><code class="language-sql">CREATE OR REPLACE FUNCTION stock_value(min_price numeric) RETURNS numeric
LANGUAGE plpgsql AS $$
DECLARE
  total numeric;
BEGIN
  SELECT sum(price * stock) INTO total FROM product WHERE price &gt;= min_price;
  RETURN total;
END;
$$;
SELECT stock_value(10000) AS total;</code></pre>
<div class="out">    total
-------------
 14670000.00
(1 row)</div>
<p>Bản T-SQL (<code>CREATE OR ALTER PROCEDURE stock_value @min_price DECIMAL(12,2) AS BEGIN … END</code>, gọi bằng <code>EXEC stock_value @min_price = 10000</code>) và bản MySQL (<code>DELIMITER //</code> … <code>CALL stock_value(10000)</code>) cũng trả 14670000.00. Cái đổi: biến không có <code>@</code>, không cần DELIMITER — thân hàm là một chuỗi giữa <code>$$ … $$</code> — và hàm được dùng ngay trong SELECT. Chương 12 dạy PL/pgSQL.</p>

<h3>Đổi tên 10 — dbo / database / public</h3>
<p>SQL Server: máy chủ → database → schema (mặc định <code>dbo</code>) → bảng. MySQL: “database” và “schema” là một (<code>SELECT DATABASE(), SCHEMA()</code> đều ra <code>ctmini</code>). PostgreSQL: máy chủ → database → schema (mặc định <code>public</code>) → bảng, và một câu truy vấn không join được bảng ở hai database khác nhau — hãy dùng nhiều schema trong một database.</p>
<pre><code class="language-sql">SELECT current_schema();
SHOW search_path;</code></pre>
<div class="out"> current_schema
----------------
 public
(1 row)

   search_path
-----------------
 "$user", public
(1 row)</div>

<h3>Đổi tên 11 — ngoặc cho tên, và chuyện chữ hoa thường</h3>
<p><code>[Order Note]</code> ở SQL Server, <code>&#96;Order Note&#96;</code> ở MySQL, <code>"Order Note"</code> ở PostgreSQL. Khác biệt thật nằm ở chữ hoa thường. PostgreSQL đổi mọi tên không có ngoặc kép thành chữ thường; tên có ngoặc kép được giữ y nguyên:</p>
<pre><code class="language-sql">CREATE TABLE "Customer" (id int);
SELECT * FROM Customer;          -- đọc bảng customer, KHÔNG phải "Customer"
SELECT * FROM "Order note";      -- bảng tên là "Order Note"</code></pre>
<div class="out"> id |     email      |   full_name   |   phone
----+----------------+---------------+------------
  1 | an@ctshop.vn   | Nguyễn Văn An | 0901000001
  2 | binh@ctshop.vn | Trần Thị Bình |
  3 | chi@ctshop.vn  | Lê Minh Chi   |
(3 rows)

ERROR:  relation "Order note" does not exist</div>
<p>SQL Server với collation CI chẳng để ý (<code>SELECT * FROM PRODUCT WHERE SKU = 'BUT-01'</code> vẫn chạy). MySQL trên Linux phân biệt hoa thường với tên <strong>bảng</strong> (<code>ERROR 1146 … Table 'ctmini.PRODUCT' doesn't exist</code>) nhưng không với tên cột. Luật của PostgreSQL cứu bạn: <strong>chữ_thường_gạch_dưới, không bao giờ dùng ngoặc kép</strong>.</p>

<h3>Bẫy 1 — so sánh chữ (collation)</h3>
<table>
<tr><th>Truy vấn trên product.name</th><th>SQL Server</th><th>MySQL</th><th>PostgreSQL</th></tr>
<tr><td><code>= 'BÚT BI THIÊN LONG'</code></td><td>1 dòng</td><td>1 dòng</td><td>0 dòng</td></tr>
<tr><td><code>LIKE 'balo%'</code></td><td>1 dòng</td><td>1 dòng</td><td>0 dòng</td></tr>
<tr><td><code>= 'But bi Thien Long'</code> (không dấu)</td><td>0 dòng</td><td>1 dòng</td><td>0 dòng</td></tr>
</table>
<p>Collation mặc định của SQL Server là <strong>C</strong>ase-<strong>I</strong>nsensitive, <strong>A</strong>ccent-<strong>S</strong>ensitive (không phân biệt hoa thường, có phân biệt dấu). <code>utf8mb4_0900_ai_ci</code> của MySQL 8 bỏ qua dấu <em>và</em> hoa thường. PostgreSQL so khớp chính xác. Hai cách sửa:</p>
<pre><code class="language-sql">SELECT sku, name FROM product WHERE name ILIKE 'balo%';
SELECT sku, name FROM product WHERE lower(name) = lower('BÚT BI THIÊN LONG');</code></pre>
<div class="out">   sku   |     name
---------+---------------
 BALO-04 | Balo chống gù
(1 row)

  sku   |       name
--------+-------------------
 BUT-01 | Bút bi Thiên Long
(1 row)</div>
<p>Tìm kiếm bỏ dấu (gõ “but bi” ra “Bút bi”) cần extension <code>unaccent</code> và chỉ mục trigram — Chương 13.</p>

<h3>Bẫy 2 — chia số nguyên</h3>
<table>
<tr><th>Biểu thức</th><th>SQL Server</th><th>MySQL</th><th>PostgreSQL</th></tr>
<tr><td><code>7 / 2</code></td><td>3</td><td>3.5000</td><td>3</td></tr>
<tr><td><code>SUM(stock) / COUNT(*)</code></td><td>36</td><td>36.6000</td><td>36</td></tr>
<tr><td><code>AVG(stock)</code> (cột int)</td><td>36</td><td>36.6000</td><td>36.6000000000000000</td></tr>
</table>
<p>Một báo cáo MySQL từng hiện 36.6 chuyển sang sẽ lặng lẽ hiện 36. Không lỗi — chỉ là con số sai. Trong PostgreSQL hãy nói rõ ý mình: <code>avg(stock)</code>, <code>sum(stock)::numeric / count(*)</code>, hoặc <code>round(avg(stock), 1)</code> → 36.6. (Để ý SQL Server cắt cả <code>AVG</code> của cột số nguyên.)</p>

<h3>Bẫy 3 — chuỗi rỗng, dấu cách và NULL</h3>
<table>
<tr><th>Kết quả thật trên ctmini</th><th>SQL Server</th><th>MySQL</th><th>PostgreSQL</th></tr>
<tr><td><code>'' = ' '</code></td><td>bằng</td><td>khác</td><td>khác</td></tr>
<tr><td><code>'abc' = 'abc   '</code></td><td>bằng</td><td>khác</td><td>khác</td></tr>
<tr><td>độ dài <code>'abc   '</code></td><td><code>LEN</code> = 3</td><td><code>CHAR_LENGTH</code> = 6</td><td><code>length</code> = 6</td></tr>
<tr><td><code>COUNT(*)</code> · <code>COUNT(phone)</code> · <code>COUNT(NULLIF(phone, ''))</code></td><td>3 · 2 · 1</td><td>3 · 2 · 1</td><td>3 · 2 · 1</td></tr>
</table>
<p>Ở cả ba, chuỗi rỗng là một giá trị thật, không phải NULL (Oracle mới là kẻ khác người) — nên <code>COUNT(phone)</code> vẫn đếm số điện thoại rỗng của Chi, và <code>NULLIF(phone, '')</code> đổi '' thành NULL khi bạn muốn hiểu là “không có số”. Chỗ cắn người khi chuyển từ SQL Server: nó đệm dấu cách trước khi so, nên dấu cách cuối chưa bao giờ quan trọng ở đó. Ở PostgreSQL thì có — hãy cắt dữ liệu vào (<code>trim()</code>) hoặc cấm bằng CHECK.</p>

<h3>Bẫy 4 — UPDATE giới hạn số dòng</h3>
<pre><code class="language-sql">UPDATE product SET stock = stock - 1 WHERE stock &gt; 0 ORDER BY price DESC LIMIT 1;   -- kiểu MySQL
UPDATE product SET stock = stock - 1
WHERE id = (SELECT id FROM product WHERE stock &gt; 0 ORDER BY price DESC LIMIT 1)
RETURNING sku, stock;</code></pre>
<div class="out">ERROR:  syntax error at or near "ORDER"
LINE 1: ...ATE product SET stock = stock - 1 WHERE stock &gt; 0 ORDER BY p...
                                                             ^
  sku   | stock
--------+-------
 MAY-05 |    14
(1 row)

UPDATE 1</div>
<p>MySQL nhận cách viết đầu. <code>UPDATE TOP (1) product SET stock = stock - 1 WHERE stock &gt; 0</code> của SQL Server chạy được nhưng không kèm được ORDER BY — nó sửa <code>BUT-01</code> (tồn 120 → 119), không phải sản phẩm đắt nhất. PostgreSQL bắt bạn chọn dòng một cách tường minh trong truy vấn con.</p>

<h3>Công cụ</h3>
<table>
<tr><th>Việc</th><th>SQL Server (sqlcmd / SSMS)</th><th>MySQL (mysql / Workbench)</th><th>PostgreSQL (psql)</th></tr>
<tr><td>Liệt kê database</td><td><code>SELECT name FROM sys.databases</code></td><td><code>SHOW DATABASES;</code></td><td><code>\\l</code></td></tr>
<tr><td>Chuyển database</td><td><code>USE ctmini;</code></td><td><code>USE ctmini;</code></td><td><code>\\c ctmini</code></td></tr>
<tr><td>Liệt kê bảng</td><td><code>SELECT * FROM INFORMATION_SCHEMA.TABLES</code></td><td><code>SHOW TABLES;</code></td><td><code>\\dt</code></td></tr>
<tr><td>Mô tả bảng</td><td><code>EXEC sp_help 'product'</code></td><td><code>DESCRIBE product;</code></td><td><code>\\d product</code></td></tr>
<tr><td>Chạy thứ vừa gõ</td><td><code>GO</code></td><td><code>;</code></td><td><code>;</code></td></tr>
</table>
<p>Giao diện đồ hoạ: SSMS, MySQL Workbench, còn PostgreSQL có pgAdmin (chính chủ) hoặc DBeaver Community (miễn phí, mở cả ba cạnh nhau). Khoá này ở lại với psql vì nó cho thấy đúng nguyên văn máy chủ nói gì.</p>

<h3>Trong dự án thật: Prisma che bớt, không che hết</h3>
<p>cuongthai.com chạy PostgreSQL qua Prisma. Prisma dịch cú pháp hộ bạn — <code>mode: 'insensitive'</code>, xuất hiện ở 195 chỗ trong backend của trang này, được gửi sang PostgreSQL thành <code>ILIKE</code> thật (nhật ký truy vấn của <code>prisma.user.findFirst({ where: { email: { equals: raw, mode: 'insensitive' } } })</code>):</p>
<div class="out">SELECT "public"."users"."id" FROM "public"."users" WHERE "public"."users"."email" ILIKE $1 LIMIT $2 OFFSET $3</div>
<p>Nhưng ORM không đổi được luật của cơ sở dữ liệu: <code>DateTime</code> thành <code>timestamp(3)</code> <em>không</em> múi giờ (lại là chuyện DATETIME2), <code>@default(autoincrement())</code> thành <code>SERIAL</code>, chia nguyên vẫn là chia nguyên. Bạn vẫn cần bài này.</p>

<h3>Bài tập</h3>
<ol>
<li>Dịch câu T-SQL <code>SELECT TOP 2 sku, name + ' (' + CAST(stock AS VARCHAR(10)) + ')' AS label FROM product WHERE is_active = 1 ORDER BY stock DESC;</code></li>
<li>Dịch <code>SELECT full_name, ISNULL(NULLIF(phone, ''), 'no phone') FROM customer;</code></li>
<li>Câu MySQL <code>SELECT sku, name FROM product WHERE name LIKE 'balo%';</code> trả về một dòng. Làm PostgreSQL trả về dòng đó.</li>
<li>Một báo cáo MySQL hiện <code>SUM(stock) / COUNT(*)</code> = 36.6. Làm PostgreSQL hiện 36.6.</li>
</ol>
<details><summary>Đáp án (output thật)</summary>
<pre><code class="language-sql">SELECT sku, name || ' (' || stock || ')' AS label FROM product WHERE is_active ORDER BY stock DESC LIMIT 2;
SELECT full_name, COALESCE(NULLIF(phone, ''), 'no phone') AS phone FROM customer;
SELECT sku, name FROM product WHERE name ILIKE 'balo%';
SELECT sum(stock) / count(*) AS wrong, round(avg(stock), 1) AS right_avg FROM product;</code></pre>
<div class="out">  sku   |           label
--------+----------------------------
 BUT-01 | Bút bi Thiên Long (120)
 VO-02  | Vở kẻ ngang 200 trang (40)
(2 rows)

   full_name   |   phone
---------------+------------
 Nguyễn Văn An | 0901000001
 Trần Thị Bình | no phone
 Lê Minh Chi   | no phone
(3 rows)

   sku   |     name
---------+---------------
 BALO-04 | Balo chống gù
(1 row)

 wrong | right_avg
-------+-----------
    36 |      36.6
(1 row)</div>
</details>

<h3>Lộ trình của bạn từ đây</h3>
<p>Lướt Chương 1–7: các bài của Chương 2–7 có nhãn <em>“⏩ Đã biết SQL Server/MySQL? Có thể lướt”</em> — xem slide và phần bẫy, chạy thử ví dụ. Rồi học kỹ <strong>Chương 8–17</strong> (hàm cửa sổ, chỉ mục, EXPLAIN, giao dịch và MVCC, PL/pgSQL, JSONB, vận hành, nhân bản), làm đủ mọi lab và bài thi cuối. Chương 17 quay lại phép so sánh này thật sâu — SQL Server, MySQL, PostgreSQL và MongoDB trên cùng dữ liệu, và cách chọn.</p>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Luyện theo cách của PostgreSQL</span><span class="lc-sub">Code Lab PostgreSQL — rồi sang Chương 1: vì sao PostgreSQL tồn tại.</span></span>
</a>
</div>
`,
    },
  ],
};
