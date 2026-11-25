/**
 * 7.1 — Nhìn thấy SQL thật: log truy vấn Prisma, Hibernate, pg_stat_statements (soạn 24/11/2026, máy nhà Linux).
 * Output THẬT: PostgreSQL 16.16 (container dbg-pg, pg_stat_statements), API Express 5 + Prisma 6.19.3 (Node 22.22),
 * dịch vụ Spring Boot 4.1.1 + Hibernate ORM 7.4.5 (JDK 25) — scratchpad/dbg/lab/ch7 (tools/c71-*.sh, o-71-*.txt).
 * Mã: s07/_ma-7.mjs; output: s07/_ra-7.mjs (sinh tự động từ o-*.txt).
 */
import { nguon, lienKet } from '../_chung.mjs';
import { SCHEMA, SEED, DB_TS, APP_TS, TRE, J_DATCHO, J_REPO, J_PROPS, PGSS } from './_ma-7.mjs';
import { N1_LOI, N1_LOI_CUOI, N1_DO, N1_SUA_SQL, PGSS as RA_PGSS, BIND, J_EAGER, J_GRAPH, J_LAZY, J_OSIV } from './_ra-7.mjs';

const ma = (s, lang = 'js') => `<pre><code class="language-${lang}">${s}</code></pre>`;
const ra = (s) => `<div class="out">${s}</div>`;

const MA_LOG_PRISMA = ma(`// Prisma 6: log 'query' dạng sự kiện để có cả tham số và thời gian
const prisma = new PrismaClient({ log: [{ emit: 'event', level: 'query' }, 'warn', 'error'] });
prisma.$on('query', (e) => console.log(\`prisma:query \${e.duration}ms \${e.query}  params=\${e.params}\`));

// Cách nhanh không sửa mã (in SQL ra stderr, KHÔNG có tham số):  DEBUG="prisma:query" npm run dev`);

const MA_N1 = ma(`// LỖI N+1 — trông vô hại: một vòng for và một await
const ds = await prisma.nguoiDung.findMany({ orderBy: { id: 'asc' }, take: 100 });       // 1 truy vấn
for (const n of ds) {
  const luot = await prisma.datLich.findMany({ where: { nguoiId: n.id, trangThai: 'DA_DUYET' } });  // +1 MỖI người
  kq.push({ id: n.id, ten: n.ten, soLuot: luot.length });
}

// SỬA — để ORM nạp quan hệ một lần
const ds = await prisma.nguoiDung.findMany({
  orderBy: { id: 'asc' }, take: 100,
  relationLoadStrategy: 'query',                     // mặc định: 2 truy vấn (… WHERE "nguoiId" IN ($2, $3, …))
  include: { datLich: { where: { trangThai: 'DA_DUYET' }, select: { batDau: true } } },
});`);

const MA_HIB_PROPS = ma(`# Chỉ ở dev/test. Hibernate 6/7 đổi tên category so với Hibernate 5 — mẹo cũ trên mạng nhiều cái không còn chạy.
logging.level.org.hibernate.SQL=DEBUG                    # câu SQL (qua logger, có thời gian + luồng)
logging.level.org.hibernate.orm.jdbc.bind=TRACE          # giá trị tham số "?" (Hibernate 5 là org.hibernate.type.descriptor.sql)
spring.jpa.properties.hibernate.generate_statistics=true
logging.level.org.hibernate.session.metrics=DEBUG        # "executing N JDBC statements" mỗi phiên
# spring.jpa.show-sql=true  → in thẳng ra stdout, không tham số, không qua logger: tránh dùng`, 'properties');

const MA_HIB_SUA = ma(`public interface DatChoRepo extends JpaRepository&lt;DatCho, Long&gt; {
  List&lt;DatCho&gt; findByNguoiDat(String nguoiDat);                  // N+1 nếu sau đó đụng d.getPhong()

  @EntityGraph(attributePaths = "phong")                          // SỬA 1: LEFT JOIN phong trong cùng câu
  List&lt;DatCho&gt; findWithPhongByNguoiDat(String nguoiDat);

  @Query("select d from DatCho d join fetch d.phong where d.nguoiDat = :nd")   // SỬA 2: JOIN FETCH
  List&lt;DatCho&gt; layKemPhong(String nd);
}

@ManyToOne(fetch = FetchType.LAZY)   // luôn ghi rõ LAZY: mặc định của @ManyToOne/@OneToOne là EAGER
private Phong phong;`, 'java');

const BANG_N1_EN = `<table>
<thead><tr><th>Where you look</th><th>What N+1 looks like there</th></tr></thead>
<tbody>
<tr><td>ORM query log</td><td>One query, then the <em>same</em> query repeated with only the parameter changing (<code>params=[1,…]</code>, <code>[2,…]</code>, <code>[3,…]</code>)</td></tr>
<tr><td>Per-request counter</td><td>Query count grows with the page size: 10 rows → 11 queries, 100 rows → 101</td></tr>
<tr><td><code>pg_stat_statements</code></td><td>One statement whose <code>calls</code> is ~N times the calls of the statement next to it (500 vs 5 below)</td></tr>
<tr><td>Timing</td><td>Fast on the laptop (DB on localhost), slow on staging/prod (each round trip costs a network hop)</td></tr>
</tbody></table>`;

const BANG_N1_VI = `<table>
<thead><tr><th>Nhìn ở đâu</th><th>N+1 hiện ra thế nào</th></tr></thead>
<tbody>
<tr><td>Log truy vấn của ORM</td><td>Một câu, rồi <em>cùng một câu</em> lặp lại, chỉ khác tham số (<code>params=[1,…]</code>, <code>[2,…]</code>, <code>[3,…]</code>)</td></tr>
<tr><td>Bộ đếm theo request</td><td>Số truy vấn tăng theo cỡ trang: 10 dòng → 11 câu, 100 dòng → 101 câu</td></tr>
<tr><td><code>pg_stat_statements</code></td><td>Một câu có <code>calls</code> gấp ~N lần câu đứng cạnh nó (500 so với 5 ở dưới)</td></tr>
<tr><td>Thời gian</td><td>Nhanh trên laptop (DB ở localhost), chậm trên staging/prod (mỗi vòng hỏi–đáp tốn một chặng mạng)</td></tr>
</tbody></table>`;

const NGUON = [
  nguon('📘', 'Prisma ORM — Logging', 'log query/info/warn/error, emit: "event", sự kiện query có query, params, duration.', 'https://www.prisma.io/docs/orm/prisma-client/observability-and-logging/logging'),
  nguon('📘', 'Prisma ORM — Relations and joins (relationLoadStrategy)', '"query" (nhiều câu, IN) và "join" (LATERAL + JSON) — khi nào dùng cái nào.', 'https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries'),
  nguon('📗', 'Hibernate ORM 7 User Guide', 'Fetching, batch fetching, entity graph, logging category org.hibernate.SQL / orm.jdbc.bind.', 'https://docs.jboss.org/hibernate/orm/7.0/userguide/html_single/Hibernate_User_Guide.html'),
  nguon('🐘', 'PostgreSQL 16 — pg_stat_statements', 'Cài bằng shared_preload_libraries, các cột calls/rows/total_exec_time/mean_exec_time.', 'https://www.postgresql.org/docs/16/pgstatstatements.html'),
  nguon('🔐', 'Facebook — Keeping Passwords Secure (21/03/2019)', 'Facebook xác nhận mật khẩu người dùng nằm dạng chữ thường trong hệ thống log nội bộ.', 'https://about.fb.com/news/2019/03/keeping-passwords-secure/'),
  nguon('📰', 'Krebs on Security — Facebook Stored Hundreds of Millions of User Passwords in Plain Text for Years (2019)', 'Bài điều tra gốc: hàng trăm triệu mật khẩu trong log, hàng nghìn nhân viên tra được.', 'https://krebsonsecurity.com/2019/03/facebook-stored-hundreds-of-millions-of-user-passwords-in-plain-text-for-years/'),
  lienKet({ khoa: 'prisma-orm', bai: 'pr-9-2-n-cong-1', title: 'Prisma ORM 9.2 — N+1 ở đủ mọi dạng', sub: 'Các biến thể N+1 trong Prisma (lồng include, resolver GraphQL) — chi tiết hơn bài này.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'spring-boot', bai: 'sb-7-1-n-cong-1', title: 'Spring Boot 7.1 — Vấn đề N+1: phát hiện và sửa', sub: 'Phía JPA: fetch join, entity graph, batch size, DTO projection.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'postgresql', bai: 'postgresql-1-4-dong-chay-truy-van', title: 'PostgreSQL 1.4 — Một truy vấn chảy qua Postgres ra sao', sub: 'Parse → plan → execute: nền để hiểu vì sao mỗi câu đều có giá.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '7.1 — Seeing the real SQL: Prisma and Hibernate query logs, pg_stat_statements|||7.1 — Nhìn thấy SQL thật: log truy vấn Prisma, Hibernate, pg_stat_statements',
  slug: 'dbg-7-1-sql-that',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bật log truy vấn đúng cách rồi nhìn N+1 bằng mắt: trang /nguoi-dung bắn 101 câu SQL (~66 ms trên laptop, ~305 ms khi DB cách 2 ms) — sửa bằng include còn 2 câu (~5 ms / ~9 ms); relationLoadStrategy "join" 1 câu nhưng chậm hơn vì thiếu index. Hibernate 7.4: @ManyToOne mặc định EAGER bắn N+1 cả khi chỉ đếm; LAZY + open-in-view=false ⇒ LazyInitializationException; batch_fetch_size ⇒ "= any (?)". pg_stat_statements lộ N+1 qua calls 500 so với 5; chạy lại câu có $1 trong psql bằng \\bind. Góc hacker: log tham số làm lộ mật khẩu (Facebook 2019).',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>The ORM wrote SQL for you. Go and read it.</h2>
<p class="lead">"The page is slow", "the number is wrong", "it hangs" — when the database is involved, the first step is always the same: see the SQL that actually reached PostgreSQL, with its parameters, how many times, and how long each took. An ORM (Prisma, Hibernate/JPA) is a translator; most database bugs are translation surprises. This lesson turns the translation on in both of your stacks, then uses it to catch the most common surprise of all: N+1.</p>

<h3>An everyday picture: the canteen order</h3>
<p>You need lunch for 100 classmates. You can walk to the canteen, order one box, walk back, and repeat 100 times — or hand over one list. Each trip is short, so with the canteen next door (a database on <code>localhost</code>) the first way feels fine. Move the canteen to the next building (a database in another zone) and the same plan takes all afternoon. N+1 is the 100 trips. The cure is not a faster walk; it is one list.</p>

<h3>The setup for this chapter</h3>
<p>Everything below ran on the course machine: <strong>PostgreSQL 16.16</strong> in a container (<code>dbg-pg</code>, 127.0.0.1:45432, started with <code>shared_preload_libraries=pg_stat_statements</code>, <code>log_lock_waits=on</code>, <code>deadlock_timeout=1s</code>), an <strong>Express 5 + Prisma 6.19.3</strong> API on Node 22 (port 41710), and a small <strong>Spring Boot 4.1.1 + Hibernate 7.4.5</strong> service on JDK 25 (port 41712). The seed is deterministic (no <code>random()</code>): 100 rooms, 300 students, 3,000 bookings, 3,600 payments, 2,000 equipment rentals. A tiny TCP proxy on 45433 adds 1 ms each way, to imitate a database that is not on your laptop.</p>
<details><summary>schema.prisma, seed.sql, src/db.ts, src/app.ts, tools/tre.mjs</summary>${ma(SCHEMA, 'prisma')}${ma(SEED, 'sql')}${ma(DB_TS, 'ts')}${ma(APP_TS, 'ts')}${ma(TRE)}</details>

<h3>1. Turning on the query log — Prisma</h3>
${MA_LOG_PRISMA}
<p>Use the <em>event</em> form: it gives you the parameters (<code>params</code>) and the duration in milliseconds. Our API also counts queries per request and returns the count in an <code>X-So-Truy-Van</code> header — a one-line habit that makes N+1 impossible to miss.</p>
<div class="callout warn"><p><strong>Real surprise while building this lesson:</strong> the first version stored the counter in <code>AsyncLocalStorage</code>, and every request reported <strong>0</strong> queries. Prisma 6.19 fires the <code>query</code> event from its engine callback, <em>outside</em> the request's async context — <code>getStore()</code> returned <code>undefined</code> 101 times out of 101 (the <code>mat_ngu_canh</code> column below). So the counter is global and the middleware takes the difference, which is exact only while one request runs at a time. Good enough on a dev machine; under load use <code>pg_stat_statements</code> (section 4) or tracing.</p></div>

<h3>2. N+1, seen with your own eyes</h3>
${MA_N1}
${ra(N1_LOI)}
${ra(N1_LOI_CUOI)}
<p>Read the log the way you would read a stack trace: the first line is the list, and then the <em>same</em> statement repeats with only <code>$1</code> changing. That repetition is the fingerprint. Now measure, both on the laptop and through the 2 ms proxy:</p>
${ra(N1_DO)}
<p>Three findings, all measured: (1) on localhost the bug costs ~66 ms instead of ~5 ms — easy to ignore in a demo; (2) with a 2 ms round trip the same code costs ~305 ms — every query pays the network once, 101 × ~2 ms; (3) the "one big JOIN" (<code>relationLoadStrategy: 'join'</code>) sends a single query but is <em>slower</em> than the two-query version here. Fewer queries is the goal, not a religion: measure.</p>
${ra(N1_SUA_SQL)}
<p>The <code>include</code> version is two statements: the users, then every booking with <code>"nguoiId" IN ($2, $3, …)</code>. The join version is a <code>LEFT JOIN LATERAL</code> that builds JSON per user. Lesson 7.3 shows why it is slow here (no index on <code>"nguoiId"</code>, so each lateral subquery scans the table) and that one <code>CREATE INDEX</code> makes it the fastest.</p>
${BANG_N1_EN}

<h3>3. Turning on the query log — Hibernate 7 (Spring Boot 4)</h3>
${MA_HIB_PROPS}
<p>Our service lists one student's bookings with the room name. The entity has a plain <code>@ManyToOne private Phong phong;</code>. The <code>/dem</code> endpoint only counts the bookings — it never touches <code>phong</code>:</p>
${ra(J_EAGER)}
<p>Five statements to count 40 rows. JPA's default for <code>@ManyToOne</code> and <code>@OneToOne</code> is <strong>EAGER</strong>, and with a derived query (<code>findByNguoiDat</code> → JPQL) Hibernate loads each distinct room with its own select. (Only 4 rooms here, because the persistence context caches the ones it already has — with 400 distinct rooms you would see 401.) The session metrics line is the counter you want in every debugging session.</p>
<p>Switch to <code>LAZY</code> and you meet the other half of the trap:</p>
${ra(J_LAZY)}
<ul>
<li><strong>LAZY + <code>open-in-view=false</code></strong>: the proxy is touched after the transaction ended → <code>LazyInitializationException … no session</code>, HTTP 500. Loud, which is good.</li>
<li><strong>LAZY + open-in-view on</strong> (the Spring Boot default): no error, and the N+1 is back — silently, during JSON serialisation. Spring Boot even warns you at startup:</li>
</ul>
${ra(J_OSIV)}
<ul>
<li><strong><code>default_batch_fetch_size=16</code></strong>: still lazy, but rooms load in one <code>where p1_0.id = any (?)</code> — the Hibernate twin of Prisma's <code>IN (…)</code>.</li>
<li><strong>Entity graph / JOIN FETCH</strong>: one statement with the join:</li>
</ul>
${ra(J_GRAPH)}
${MA_HIB_SUA}
<details><summary>DatCho.java, DatChoRepo.java, application.properties of the demo service</summary>${ma(J_DATCHO, 'java')}${ma(J_REPO, 'java')}${ma(J_PROPS, 'properties')}</details>

<h3>4. The database's own view: pg_stat_statements</h3>
<p>ORM logs show one process. <code>pg_stat_statements</code> shows every client of the database — your API, a cron job, a teammate's DBeaver — aggregated by statement shape (literals replaced by <code>$n</code>). It needs <code>shared_preload_libraries = 'pg_stat_statements'</code> (restart) and <code>CREATE EXTENSION pg_stat_statements</code> once per database. On managed services (RDS, Cloud SQL, Supabase) it is usually already loaded.</p>
${ma(PGSS, 'sql')}
${ra(RA_PGSS)}
<p>After five page loads: one statement with <code>calls = 5</code>, its neighbour with <code>calls = 500</code>. A ratio of exactly the page size is N+1, even if you have never seen the code. On a shared server, sort by <code>total_exec_time</code> instead to find what costs the database the most; reset with <code>pg_stat_statements_reset()</code> before a measurement.</p>

<h3>5. Re-running the exact query in psql</h3>
<p>Copy the statement from the log as it is, keep the <code>$1</code>, <code>$2</code>, and bind the parameters with psql's <code>\\bind</code> (psql 16+). You test the same text the ORM sent — not your paraphrase of it, which may use a different plan. The error for a missing parameter is precise:</p>
${ra(BIND)}
<p>In DBeaver or DataGrip, paste the statement and fill the parameter dialog. With older psql, use <code>PREPARE q AS …; EXECUTE q(3, 'DA_DUYET');</code>.</p>

<h3>Hacker corner: the query log is a leak</h3>
<p>Look again at the Hibernate trace: <code>binding parameter (1:VARCHAR) &lt;- [SE1801]</code>. The bind logger prints every value — including password hashes, reset tokens, phone numbers, national ID numbers — and log pipelines copy them to places with much wider access than the database. In March 2019 Facebook confirmed that hundreds of millions of user passwords had been stored in plain text in internal logs, searchable by thousands of employees (Krebs on Security; Facebook newsroom "Keeping Passwords Secure"). Rules: parameter logging only on dev/test with fake data; never enable <code>orm.jdbc.bind=TRACE</code> or Prisma <code>params</code> logging on production; if you need it during an incident, turn it on for minutes, on one instance, and purge the logs afterwards. Lesson 10.2 comes back to this.</p>

<h3>On the job</h3>
<p>Typical OJT ticket: "Danh sách đơn hàng chậm trên UAT, local nhanh". Before touching code, attach three numbers to the ticket: query count for the request, total DB time, and the statement with the highest <code>calls</code> in <code>pg_stat_statements</code>. In a code review, the question "how many queries does this endpoint run for 100 rows?" catches most N+1 bugs before they ship. Many teams add a test that asserts the count (Hibernate <code>Statistics.getPrepareStatementCount()</code>, or a Prisma counter like ours).</p>

<h3>🧪 Practice (40 min)</h3>
<div class="callout ok">
<ol>
<li>Start <code>dbg-pg</code> and the API; call <code>/nguoi-dung</code> with <code>LOG_SQL=1</code>. Count the statements and point at the repeated one.</li>
<li>Run <code>tools/c71-n1.sh</code> (through the 45433 proxy too). Explain in one sentence why the bug costs ~13× on the laptop but ~35× through the proxy.</li>
<li>In the Spring service, call <code>/dem</code> and <code>/lich</code> with EAGER, then LAZY with and without open-in-view. Write down the statement count for each case.</li>
<li>Reset <code>pg_stat_statements</code>, load the page 5 times, and identify N+1 using only that view.</li>
<li>Copy one statement from the log and re-run it in psql with <code>\\bind</code>.</li>
</ol>
<p><strong>Done when:</strong> for each run you can state the number of statements, their total time, and which line of code produced them.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">N+1</span><span class="v">One query for a list, then one more query per row of that list.</span></div>
  <div class="kv"><span class="k">EAGER / LAZY</span><span class="v">Load a relation immediately with the entity, or only when it is touched.</span></div>
  <div class="kv"><span class="k">Open Session in View</span><span class="v">Keeps the persistence context open during rendering; lazy loads then run silently there.</span></div>
  <div class="kv"><span class="k">Batch fetching</span><span class="v">Loads many lazy relations in one <code>IN</code> / <code>= any (?)</code> query.</span></div>
  <div class="kv"><span class="k">pg_stat_statements</span><span class="v">PostgreSQL extension that aggregates calls, rows and time per statement shape.</span></div>
  <div class="kv"><span class="k">\\bind</span><span class="v">psql 16 command that runs a statement with <code>$n</code> parameters.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Every database bug starts with the real SQL: statement, parameters, count, time.</li>
<li>N+1 has a fingerprint: the same statement repeated with one parameter changing; count grows with page size.</li>
<li>Localhost hides N+1; network latency multiplies it. Measure with a delay, not only on the laptop.</li>
<li><code>@ManyToOne</code> is EAGER by default; LAZY without a fetch plan either throws or hides N+1 behind open-in-view.</li>
<li><code>pg_stat_statements</code> shows N+1 from the database side, for every client.</li>
<li>Never log parameter values on production.</li>
</ul>
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>ORM đã viết SQL hộ bạn. Hãy đi đọc nó.</h2>
<p class="lead">"Trang chậm", "số sai", "treo luôn" — hễ dính tới cơ sở dữ liệu, bước đầu tiên luôn giống nhau: nhìn thấy câu SQL đã thật sự tới PostgreSQL, kèm tham số, bao nhiêu lần, mỗi lần mất bao lâu. ORM (Prisma, Hibernate/JPA) là một người phiên dịch; phần lớn lỗi cơ sở dữ liệu là những bất ngờ trong bản dịch. Bài này bật bản dịch lên ở cả hai stack của bạn, rồi dùng nó bắt bất ngờ phổ biến nhất: N+1.</p>

<h3>Liên tưởng đời thường: đi mua cơm hộ cả lớp</h3>
<p>Bạn cần mua cơm cho 100 bạn cùng lớp. Có thể đi xuống căng tin, gọi một hộp, đi về, lặp lại 100 lần — hoặc đưa cô bán hàng một tờ danh sách. Mỗi chuyến đi ngắn, nên khi căng tin ở ngay cạnh (DB trên <code>localhost</code>) cách đầu vẫn thấy ổn. Dời căng tin sang toà bên kia (DB ở vùng khác) thì cùng kế hoạch ấy mất cả buổi chiều. N+1 chính là 100 chuyến đi. Thuốc chữa không phải đi nhanh hơn, mà là một tờ danh sách.</p>

<h3>Môi trường của chương này</h3>
<p>Mọi thứ dưới đây chạy thật trên máy của khoá: <strong>PostgreSQL 16.16</strong> trong container (<code>dbg-pg</code>, 127.0.0.1:45432, khởi động với <code>shared_preload_libraries=pg_stat_statements</code>, <code>log_lock_waits=on</code>, <code>deadlock_timeout=1s</code>), một API <strong>Express 5 + Prisma 6.19.3</strong> trên Node 22 (cổng 41710), và một dịch vụ nhỏ <strong>Spring Boot 4.1.1 + Hibernate 7.4.5</strong> trên JDK 25 (cổng 41712). Dữ liệu mẫu tất định (không dùng <code>random()</code>): 100 phòng, 300 sinh viên, 3.000 lượt đặt, 3.600 lần thanh toán, 2.000 lượt thuê thiết bị. Một proxy TCP tí hon ở cổng 45433 thêm 1 ms mỗi chiều, giả lập DB không nằm trên laptop của bạn.</p>
<details><summary>schema.prisma, seed.sql, src/db.ts, src/app.ts, tools/tre.mjs</summary>${ma(SCHEMA, 'prisma')}${ma(SEED, 'sql')}${ma(DB_TS, 'ts')}${ma(APP_TS, 'ts')}${ma(TRE)}</details>

<h3>1. Bật log truy vấn — Prisma</h3>
${MA_LOG_PRISMA}
<p>Dùng dạng <em>event</em>: nó cho bạn cả tham số (<code>params</code>) và thời gian tính bằng mili giây. API của chúng ta còn đếm số truy vấn mỗi request và trả về qua header <code>X-So-Truy-Van</code> — một thói quen một dòng khiến N+1 không thể lọt.</p>
<div class="callout warn"><p><strong>Bất ngờ thật khi dựng bài này:</strong> bản đầu cất bộ đếm trong <code>AsyncLocalStorage</code>, và request nào cũng báo <strong>0</strong> truy vấn. Prisma 6.19 bắn sự kiện <code>query</code> từ callback của engine, <em>ngoài</em> ngữ cảnh bất đồng bộ của request — <code>getStore()</code> trả <code>undefined</code> 101 lần trên 101 (cột <code>mat_ngu_canh</code> bên dưới). Nên bộ đếm để toàn cục và middleware lấy hiệu trước/sau, chỉ đúng khi mỗi lúc có một request. Đủ dùng trên máy dev; khi có tải, dùng <code>pg_stat_statements</code> (mục 4) hoặc tracing.</p></div>

<h3>2. N+1, nhìn tận mắt</h3>
${MA_N1}
${ra(N1_LOI)}
${ra(N1_LOI_CUOI)}
<p>Đọc log như đọc stack trace: dòng đầu là danh sách, sau đó <em>cùng một câu</em> lặp lại, chỉ <code>$1</code> đổi. Sự lặp lại ấy là dấu vân tay. Giờ đo, cả trên laptop lẫn qua proxy 2 ms:</p>
${ra(N1_DO)}
<p>Ba phát hiện, đều đo được: (1) trên localhost lỗi chỉ tốn ~66 ms thay vì ~5 ms — dễ bỏ qua khi demo; (2) khi mỗi vòng hỏi–đáp mất 2 ms, cùng đoạn mã tốn ~305 ms — câu nào cũng trả tiền mạng một lần, 101 × ~2 ms; (3) bản "một câu JOIN to" (<code>relationLoadStrategy: 'join'</code>) chỉ gửi một câu nhưng ở đây lại <em>chậm hơn</em> bản hai câu. Ít truy vấn là mục tiêu, không phải tín điều: hãy đo.</p>
${ra(N1_SUA_SQL)}
<p>Bản <code>include</code> là hai câu: lấy người dùng, rồi lấy mọi lượt đặt với <code>"nguoiId" IN ($2, $3, …)</code>. Bản join là một <code>LEFT JOIN LATERAL</code> dựng JSON cho từng người. Bài 7.3 chỉ ra vì sao nó chậm ở đây (không có index trên <code>"nguoiId"</code>, nên mỗi truy vấn con lateral quét cả bảng) và một lệnh <code>CREATE INDEX</code> biến nó thành bản nhanh nhất.</p>
${BANG_N1_VI}

<h3>3. Bật log truy vấn — Hibernate 7 (Spring Boot 4)</h3>
${MA_HIB_PROPS}
<p>Dịch vụ của chúng ta liệt kê lượt đặt của một sinh viên kèm tên phòng. Entity khai báo trơn <code>@ManyToOne private Phong phong;</code>. Endpoint <code>/dem</code> chỉ đếm số lượt — không hề đụng tới <code>phong</code>:</p>
${ra(J_EAGER)}
<p>Năm câu SQL để đếm 40 dòng. Mặc định của JPA cho <code>@ManyToOne</code> và <code>@OneToOne</code> là <strong>EAGER</strong>, và với truy vấn dẫn xuất từ tên hàm (<code>findByNguoiDat</code> → JPQL), Hibernate nạp từng phòng khác nhau bằng một câu riêng. (Ở đây chỉ 4 phòng vì persistence context nhớ sẵn phòng đã nạp — có 400 phòng khác nhau thì bạn sẽ thấy 401 câu.) Dòng session metrics chính là bộ đếm bạn nên bật trong mọi lần gỡ lỗi.</p>
<p>Đổi sang <code>LAZY</code> và bạn gặp nửa còn lại của cái bẫy:</p>
${ra(J_LAZY)}
<ul>
<li><strong>LAZY + <code>open-in-view=false</code></strong>: proxy bị đụng sau khi transaction đã đóng → <code>LazyInitializationException … no session</code>, HTTP 500. Ồn ào — và thế là tốt.</li>
<li><strong>LAZY + open-in-view bật</strong> (mặc định của Spring Boot): không lỗi, và N+1 quay lại — lặng lẽ, ngay lúc chuyển sang JSON. Spring Boot còn cảnh báo bạn lúc khởi động:</li>
</ul>
${ra(J_OSIV)}
<ul>
<li><strong><code>default_batch_fetch_size=16</code></strong>: vẫn lazy, nhưng các phòng được nạp bằng một câu <code>where p1_0.id = any (?)</code> — anh em sinh đôi của <code>IN (…)</code> bên Prisma.</li>
<li><strong>Entity graph / JOIN FETCH</strong>: một câu có join:</li>
</ul>
${ra(J_GRAPH)}
${MA_HIB_SUA}
<details><summary>DatCho.java, DatChoRepo.java, application.properties của dịch vụ demo</summary>${ma(J_DATCHO, 'java')}${ma(J_REPO, 'java')}${ma(J_PROPS, 'properties')}</details>

<h3>4. Góc nhìn của chính cơ sở dữ liệu: pg_stat_statements</h3>
<p>Log của ORM chỉ cho thấy một tiến trình. <code>pg_stat_statements</code> cho thấy mọi client của cơ sở dữ liệu — API của bạn, một cron job, DBeaver của đồng nghiệp — gộp theo hình dạng câu lệnh (giá trị cụ thể thay bằng <code>$n</code>). Nó cần <code>shared_preload_libraries = 'pg_stat_statements'</code> (khởi động lại) và <code>CREATE EXTENSION pg_stat_statements</code> một lần cho mỗi database. Trên dịch vụ có quản lý (RDS, Cloud SQL, Supabase) thường đã nạp sẵn.</p>
${ma(PGSS, 'sql')}
${ra(RA_PGSS)}
<p>Sau năm lần tải trang: một câu có <code>calls = 5</code>, câu bên cạnh có <code>calls = 500</code>. Tỉ lệ đúng bằng cỡ trang chính là N+1, kể cả khi bạn chưa từng thấy mã nguồn. Trên server dùng chung, sắp theo <code>total_exec_time</code> để tìm thứ làm cơ sở dữ liệu tốn sức nhất; gọi <code>pg_stat_statements_reset()</code> trước mỗi lần đo.</p>

<h3>5. Chạy lại đúng câu đó trong psql</h3>
<p>Chép nguyên câu lệnh từ log, giữ <code>$1</code>, <code>$2</code>, rồi gắn tham số bằng <code>\\bind</code> của psql (psql 16 trở lên). Bạn thử đúng văn bản ORM đã gửi — chứ không phải câu bạn tự viết lại, vốn có thể chạy theo plan khác. Thông báo lỗi khi thiếu tham số rất chính xác:</p>
${ra(BIND)}
<p>Trong DBeaver hay DataGrip, dán câu lệnh rồi điền hộp thoại tham số. Với psql cũ, dùng <code>PREPARE q AS …; EXECUTE q(3, 'DA_DUYET');</code>.</p>

<h3>Góc hacker: log truy vấn là một chỗ rò rỉ</h3>
<p>Nhìn lại dòng trace của Hibernate: <code>binding parameter (1:VARCHAR) &lt;- [SE1801]</code>. Logger tham số in mọi giá trị — cả hash mật khẩu, token đặt lại mật khẩu, số điện thoại, số CCCD — và đường ống gom log chép chúng tới những nơi có quyền truy cập rộng hơn cơ sở dữ liệu rất nhiều. Tháng 3/2019 Facebook xác nhận hàng trăm triệu mật khẩu người dùng đã nằm dạng chữ thường trong log nội bộ, hàng nghìn nhân viên tra được (Krebs on Security; thông cáo "Keeping Passwords Secure" của Facebook). Luật: chỉ log tham số ở dev/test với dữ liệu giả; không bao giờ bật <code>orm.jdbc.bind=TRACE</code> hay log <code>params</code> của Prisma trên production; nếu buộc phải bật khi đang xử lý sự cố, bật vài phút, trên một instance, rồi xoá log sau đó. Bài 10.2 sẽ quay lại chuyện này.</p>

<h3>Tình huống đi làm</h3>
<p>Ticket OJT điển hình: "Danh sách đơn hàng chậm trên UAT, local nhanh". Trước khi sửa mã, gắn ba con số vào ticket: số truy vấn của request, tổng thời gian DB, và câu có <code>calls</code> cao nhất trong <code>pg_stat_statements</code>. Khi review mã, câu hỏi "endpoint này chạy bao nhiêu truy vấn cho 100 dòng?" chặn được phần lớn lỗi N+1 trước khi lên môi trường thật. Nhiều nhóm thêm test khẳng định số câu (Hibernate <code>Statistics.getPrepareStatementCount()</code>, hoặc bộ đếm Prisma như của chúng ta).</p>

<h3>🧪 Thực hành (40 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>dbg-pg</code> và API; gọi <code>/nguoi-dung</code> với <code>LOG_SQL=1</code>. Đếm số câu và chỉ ra câu bị lặp.</li>
<li>Chạy <code>tools/c71-n1.sh</code> (cả qua proxy 45433). Giải thích trong một câu vì sao lỗi gấp ~13 lần trên laptop nhưng ~35 lần qua proxy.</li>
<li>Trong dịch vụ Spring, gọi <code>/dem</code> và <code>/lich</code> với EAGER, rồi LAZY có và không có open-in-view. Ghi số câu SQL của từng trường hợp.</li>
<li>Reset <code>pg_stat_statements</code>, tải trang 5 lần, và nhận ra N+1 chỉ bằng view đó.</li>
<li>Chép một câu từ log và chạy lại trong psql bằng <code>\\bind</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> với mỗi lần chạy, bạn nói được số câu SQL, tổng thời gian, và dòng mã nào sinh ra chúng.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">N+1</span><span class="v">Một truy vấn lấy danh sách, rồi thêm một truy vấn cho mỗi dòng của danh sách đó.</span></div>
  <div class="kv"><span class="k">EAGER / LAZY</span><span class="v">Nạp quan hệ ngay cùng entity, hoặc chỉ khi bị đụng tới.</span></div>
  <div class="kv"><span class="k">Open Session in View</span><span class="v">Giữ persistence context mở trong lúc dựng phản hồi; lazy load lặng lẽ chạy ở đó.</span></div>
  <div class="kv"><span class="k">Batch fetching</span><span class="v">Nạp nhiều quan hệ lazy trong một câu <code>IN</code> / <code>= any (?)</code>.</span></div>
  <div class="kv"><span class="k">pg_stat_statements</span><span class="v">Extension của PostgreSQL gộp số lần gọi, số dòng, thời gian theo hình dạng câu lệnh.</span></div>
  <div class="kv"><span class="k">\\bind</span><span class="v">Lệnh psql 16 chạy câu lệnh có tham số <code>$n</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mọi lỗi cơ sở dữ liệu bắt đầu bằng SQL thật: câu lệnh, tham số, số lần, thời gian.</li>
<li>N+1 có dấu vân tay: cùng một câu lặp lại, chỉ đổi một tham số; số câu tăng theo cỡ trang.</li>
<li>Localhost che N+1; độ trễ mạng nhân nó lên. Đo cả khi có độ trễ, không chỉ trên laptop.</li>
<li><code>@ManyToOne</code> mặc định là EAGER; LAZY mà không có kế hoạch nạp thì hoặc ném lỗi, hoặc giấu N+1 sau open-in-view.</li>
<li><code>pg_stat_statements</code> cho thấy N+1 từ phía cơ sở dữ liệu, với mọi client.</li>
<li>Không bao giờ log giá trị tham số trên production.</li>
</ul>
${NGUON}
</div>
`,
};
