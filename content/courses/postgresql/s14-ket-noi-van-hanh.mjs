/**
 * PostgreSQL — Chương 14: Kết nối, pool & vận hành (Giai đoạn 4 — Trên production).
 * Giá kết nối đo thật bằng driver pg: 4,403 ms/truy vấn khi mở mới vs 0,186 ms khi tái
 * dùng (23,7×), pool max 10 → 0,205 ms · cạn kết nối THẬT ở đúng 100:
 * "sorry, too many clients already" · bài toán 12 client × pool 10 = 120 > 100 của
 * chính cuongthai.com (nêu ở s00-intro) · autovacuum ngưỡng 50 + 0,2×n ·
 * pg_stat_statements: truy vấn 2 lượt ăn 51,1 ms nhiều hơn truy vấn 5 lượt ăn 12,7 ms.
 * Output CHẠY THẬT trên PostgreSQL 16.13.
 * LUẬT: < > trong code/out → &lt; &gt;; & → &amp;; backtick → &#96;; ${ → \${.
 * Khối .out LUÔN đóng </div> (KHÔNG </code></pre>).
 */
const REF = '?ref=%2Fcourses%2Fpostgresql%2Flearn&reflabel=PostgreSQL';

export default {
  title: 'Chapter 14 — Connections, pooling & operating|||Chương 14 — Kết nối, pool & vận hành',
  description: 'Chương đầu tiên không nói về việc viết SQL mà về việc GIỮ CHO một cơ sở dữ liệu sống. Một kết nối tốn bao nhiêu, vì sao hết kết nối là kiểu sập phổ biến nhất của một app Node.js, pool ở tầng app so với PgBouncer, autovacuum và bloat, và ba khung nhìn thống kê trả lời được câu hỏi "sao nó chậm thế".',
  lessons: [
    /* ─────────────────────────── 14.1 ─────────────────────────── */
    {
      title: '14.1 — What a connection costs|||14.1 — Một kết nối tốn những gì',
      slug: 'postgresql-14-1-gia-ket-noi',
      type: 'LESSON',
      isFreePreview: true,
      description: 'PostgreSQL cấp cho mỗi kết nối một TIẾN TRÌNH của hệ điều hành, chứ không phải một luồng. Đo thật bằng driver pg: mở kết nối mới cho từng truy vấn đắt gấp 23,7 lần tái dùng, và máy chủ từ chối ở đúng kết nối thứ 100 bằng một thông báo bạn sẽ nhận ra.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.1 · Phase 4 — In production</span>
<h2>One connection is one process</h2>
<p class="lead">Everything so far assumed you had a connection. This chapter is about the connection itself, and it starts with the fact that shapes every decision downstream: <strong>PostgreSQL forks an operating-system process for each client connection.</strong> Not a thread, not a lightweight handle — a real process with its own memory.</p>
<p>That is a deliberate design choice with real benefits (a crashing backend cannot corrupt the others), and it makes connections expensive enough that managing them is a first-class production concern.</p>

<h3>Measure it</h3>
<p>Three ways of running 50 trivial queries from Node.js with the <code>pg</code> driver, against the same local server:</p>
<pre><code><span class="tok-comment">// A. một kết nối MỚI cho mỗi truy vấn</span>
<span class="tok-keyword">for</span> (<span class="tok-keyword">let</span> i = 0; i &lt; 50; i++) {
  <span class="tok-keyword">const</span> c = <span class="tok-keyword">new</span> pg.Client(CFG);
  <span class="tok-keyword">await</span> c.connect(); <span class="tok-keyword">await</span> c.query(<span class="tok-string">'SELECT 1'</span>); <span class="tok-keyword">await</span> c.end();
}
<span class="tok-comment">// B. MỘT kết nối, tái dùng</span>
<span class="tok-comment">// C. pool (max 10)</span></code></pre>
<div class="out">kết nối MỚI mỗi truy vấn :   220.14 ms cho 50 → 4.403 ms/truy vấn
MỘT kết nối tái dùng     :     9.29 ms cho 50 → 0.186 ms/truy vấn
pool (max 10)            :    10.27 ms cho 50 → 0.205 ms/truy vấn

→ mở kết nối mới đắt gấp 23.7 lần so với tái dùng</div>
<p>Read the middle number: the query itself takes <strong>0.186 ms</strong>. Opening a connection to run it takes <strong>4.4 ms</strong> — so 96% of the time was setup, on a server on the same machine with no network in between. Across a real network, TLS handshake included, the gap is wider.</p>
<p>Line C is the important one. A pool costs 0.205 ms — essentially the same as a hand-managed single connection — while still letting many requests run at once. <strong>That is the whole argument for pooling, in one measurement.</strong></p>

<h3>The wall: max_connections</h3>
<p>The server will not fork processes forever. Ask it where the limit is:</p>
<pre><code><span class="tok-keyword">SHOW</span> max_connections;
<span class="tok-keyword">SHOW</span> superuser_reserved_connections;</code></pre>
<div class="out"> max_connections | superuser_reserved_connections
-----------------+--------------------------------
 100             | 3</div>
<p>100 is the default, and it is what cuongthai.com runs in production. Now open connections in a loop until it refuses:</p>
<div class="out">mở được 100 kết nối trước khi hỏng
LỖI: sorry, too many clients already</div>
<p><code>sorry, too many clients already</code> is one of the most recognisable failures in production PostgreSQL, and it does not degrade gracefully — every new request fails instantly, including the one you would use to investigate. That is what <code>superuser_reserved_connections</code> protects: three slots kept back so an administrator can still get in and see what happened. (The loop above reached 100 because it connected <em>as</em> a superuser and so could use the reserve; an application role stops at 97.)</p>

<h3>The arithmetic that causes it</h3>
<p>The limit is not usually reached by one greedy client. It is reached by multiplication:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Each process has its own pool</span><span class="lz-d">A pool size of 10 is per Node.js process, not per application. Two containers means two pools.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Count every process that connects</span><span class="lz-d">Web containers, background workers, cron jobs, a migration runner, your own <code>psql</code>, a metrics exporter, and any admin tool.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Multiply, then compare</span><span class="lz-d">cuongthai.com's own case, from Chapter 0: <strong>12 clients × pool 10 = 120 &gt; the 100-connection limit.</strong> The system is over-subscribed at rest — it only survives because all 12 are rarely busy at once, which is precisely why the failure arrives during a traffic spike rather than during testing.</span></div>
</div>
<div class="callout warn">The dangerous property of this bug is that it is invisible until it is total. Under normal load the pools sit half-empty and nothing looks wrong. The first time every client is busy simultaneously, the 101st connection fails — and because a failing health check often triggers a restart, which opens fresh connections, the system can drive itself further into the wall.</div>

<h3>Check your real usage</h3>
<pre><code><span class="tok-keyword">SELECT</span> count(*) <span class="tok-keyword">AS</span> dang_dung,
       (<span class="tok-keyword">SELECT</span> setting::int <span class="tok-keyword">FROM</span> pg_settings <span class="tok-keyword">WHERE</span> name=<span class="tok-string">'max_connections'</span>) <span class="tok-keyword">AS</span> toi_da
<span class="tok-keyword">FROM</span> pg_stat_activity;</code></pre>
<div class="out"> dang_dung | toi_da
-----------+--------
         6 |    100
(1 row)</div>
<p>Run that against production and group it by <code>usename</code> and <code>application_name</code> to find out who is actually holding the connections. Very often the answer is a service nobody remembered was connected.</p>
<div class="pitfall"><p><strong>Trap — "fixing" connection exhaustion by raising <code>max_connections</code>.</strong> It looks like the obvious remedy and it is usually the wrong one. Every connection slot costs memory whether used or not, and each <em>active</em> backend can allocate <code>work_mem</code> — potentially several times over for a query with multiple sorts or hashes. Raising the limit to 500 on a 6 GB VPS converts a clean "too many clients" error into the operating-system OOM killer terminating the postmaster, which is a far worse outage: the first failure refuses new work while protecting what is running, the second takes the database down entirely. Beyond roughly a few hundred backends, PostgreSQL also spends a growing share of its time on cross-process bookkeeping, so throughput <em>falls</em> as you add connections. The real fixes are the next lesson's: pool properly, size the pools to what the server can serve, and put PgBouncer in front when process count is genuinely large.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: measure the 23.7× yourself, then hit the wall on purpose</span><span class="lc-sub">The Code Lab track ships the Node.js script that produced both outputs.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.1 · Giai đoạn 4 — Trên production</span>
<h2>Một kết nối là một TIẾN TRÌNH</h2>
<p class="lead">Mọi thứ tới giờ đều giả định rằng bạn ĐÃ có một kết nối. Chương này nói về chính cái kết nối đó, và nó bắt đầu bằng sự thật định hình mọi quyết định phía sau: <strong>PostgreSQL fork một TIẾN TRÌNH của hệ điều hành cho mỗi kết nối client.</strong> Không phải một luồng, không phải một handle nhẹ — một tiến trình thật với bộ nhớ riêng.</p>
<p>Đó là một lựa chọn thiết kế có chủ đích và có lợi ích thật (một backend sập không làm hỏng những cái khác), và nó làm cho kết nối đắt đủ để việc QUẢN LÝ chúng trở thành mối bận tâm hạng nhất trên production.</p>

<h3>Đo nó</h3>
<p>Ba cách chạy 50 truy vấn tầm thường từ Node.js bằng driver <code>pg</code>, tới cùng một máy chủ cục bộ:</p>
<pre><code><span class="tok-comment">// A. một kết nối MỚI cho mỗi truy vấn</span>
<span class="tok-keyword">for</span> (<span class="tok-keyword">let</span> i = 0; i &lt; 50; i++) {
  <span class="tok-keyword">const</span> c = <span class="tok-keyword">new</span> pg.Client(CFG);
  <span class="tok-keyword">await</span> c.connect(); <span class="tok-keyword">await</span> c.query(<span class="tok-string">'SELECT 1'</span>); <span class="tok-keyword">await</span> c.end();
}
<span class="tok-comment">// B. MỘT kết nối, tái dùng</span>
<span class="tok-comment">// C. pool (max 10)</span></code></pre>
<div class="out">kết nối MỚI mỗi truy vấn :   220.14 ms cho 50 → 4.403 ms/truy vấn
MỘT kết nối tái dùng     :     9.29 ms cho 50 → 0.186 ms/truy vấn
pool (max 10)            :    10.27 ms cho 50 → 0.205 ms/truy vấn

→ mở kết nối mới đắt gấp 23.7 lần so với tái dùng</div>
<p>Đọc con số ở giữa: bản thân truy vấn tốn <strong>0,186 ms</strong>. Mở một kết nối để chạy nó tốn <strong>4,4 ms</strong> — tức 96% thời gian là khâu chuẩn bị, trên một máy chủ nằm CÙNG máy, không có mạng ở giữa. Qua mạng thật, kèm bắt tay TLS, khoảng cách còn rộng hơn.</p>
<p>Dòng C mới là dòng quan trọng. Một pool tốn 0,205 ms — gần như đúng bằng một kết nối đơn tự quản — mà vẫn cho phép nhiều request chạy cùng lúc. <strong>Đó là toàn bộ lý lẽ cho việc dùng pool, gói trong một phép đo.</strong></p>

<h3>Bức tường: max_connections</h3>
<p>Máy chủ sẽ không fork tiến trình mãi mãi. Hỏi nó xem giới hạn nằm ở đâu:</p>
<pre><code><span class="tok-keyword">SHOW</span> max_connections;
<span class="tok-keyword">SHOW</span> superuser_reserved_connections;</code></pre>
<div class="out"> max_connections | superuser_reserved_connections
-----------------+--------------------------------
 100             | 3</div>
<p>100 là mặc định, và đó cũng là con số cuongthai.com đang chạy trên production. Giờ mở kết nối trong một vòng lặp cho tới khi nó từ chối:</p>
<div class="out">mở được 100 kết nối trước khi hỏng
LỖI: sorry, too many clients already</div>
<p><code>sorry, too many clients already</code> là một trong những kiểu hỏng dễ nhận ra nhất của PostgreSQL trên production, và nó KHÔNG suy giảm mềm — mọi request mới đều hỏng ngay lập tức, kể cả cái mà bạn định dùng để đi điều tra. Đó chính là thứ mà <code>superuser_reserved_connections</code> bảo vệ: ba suất được giữ lại để một quản trị viên vẫn vào được và xem chuyện gì đã xảy ra. (Vòng lặp ở trên chạm được 100 vì nó kết nối VỚI TƯ CÁCH superuser nên dùng được cả phần dự trữ; một role ứng dụng sẽ dừng ở 97.)</p>

<h3>Phép tính gây ra nó</h3>
<p>Giới hạn thường không bị chạm bởi MỘT client tham lam. Nó bị chạm bởi PHÉP NHÂN:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Mỗi tiến trình có pool RIÊNG</span><span class="lz-d">Pool cỡ 10 là tính theo từng tiến trình Node.js, không phải theo cả ứng dụng. Hai container nghĩa là hai pool.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Đếm MỌI tiến trình có kết nối</span><span class="lz-d">Container web, worker chạy nền, job cron, bộ chạy migration, chính cái <code>psql</code> của bạn, một exporter đo đạc, và mọi công cụ quản trị.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Nhân lên, rồi so</span><span class="lz-d">Chính trường hợp của cuongthai.com, nêu ở Chương 0: <strong>12 client × pool 10 = 120 &gt; giới hạn 100 kết nối.</strong> Hệ thống đã vượt mức ngay khi đứng yên — nó chỉ sống được vì hiếm khi cả 12 cùng bận một lúc, và đó chính xác là lý do sự cố tới vào lúc lưu lượng tăng vọt chứ không phải lúc đang test.</span></div>
</div>
<div class="callout warn">Tính chất nguy hiểm của con bug này là nó VÔ HÌNH cho tới khi nó TOÀN PHẦN. Ở tải bình thường các pool nằm vơi một nửa và chẳng có gì trông có vẻ sai. Lần đầu tiên mọi client cùng bận đồng thời, kết nối thứ 101 hỏng — và vì một health check hỏng thường kích hoạt restart, mà restart thì mở kết nối mới, hệ thống có thể tự lái mình đâm sâu hơn vào tường.</div>

<h3>Kiểm mức dùng THẬT của bạn</h3>
<pre><code><span class="tok-keyword">SELECT</span> count(*) <span class="tok-keyword">AS</span> dang_dung,
       (<span class="tok-keyword">SELECT</span> setting::int <span class="tok-keyword">FROM</span> pg_settings <span class="tok-keyword">WHERE</span> name=<span class="tok-string">'max_connections'</span>) <span class="tok-keyword">AS</span> toi_da
<span class="tok-keyword">FROM</span> pg_stat_activity;</code></pre>
<div class="out"> dang_dung | toi_da
-----------+--------
         6 |    100
(1 row)</div>
<p>Chạy câu đó trên production rồi gom nhóm theo <code>usename</code> và <code>application_name</code> để tìm xem AI đang thật sự giữ các kết nối. Rất thường xuyên câu trả lời là một service mà không ai nhớ là nó còn đang cắm vào.</p>
<div class="pitfall"><p><strong>Bẫy — "sửa" việc cạn kết nối bằng cách TĂNG <code>max_connections</code>.</strong> Nó trông như phương thuốc hiển nhiên và thường là phương thuốc SAI. Mỗi suất kết nối tốn bộ nhớ dù có dùng hay không, và mỗi backend ĐANG HOẠT ĐỘNG có thể cấp phát <code>work_mem</code> — có khi vài lần cho một truy vấn có nhiều phép sắp hoặc băm. Nâng giới hạn lên 500 trên một VPS 6 GB là biến một lỗi "too many clients" sạch sẽ thành việc OOM killer của hệ điều hành giết postmaster, và đó là sự cố TỆ HƠN NHIỀU: lỗi thứ nhất từ chối việc mới trong khi vẫn bảo vệ những gì đang chạy, lỗi thứ hai hạ gục cả cơ sở dữ liệu. Vượt quá khoảng vài trăm backend, PostgreSQL còn tiêu ngày càng nhiều thời gian cho việc sổ sách giữa các tiến trình, nên thông lượng GIẢM khi bạn thêm kết nối. Cách sửa thật nằm ở bài sau: dùng pool cho đúng, chỉnh cỡ pool theo đúng cái máy chủ phục vụ nổi, và đặt PgBouncer phía trước khi số tiến trình thật sự lớn.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: tự đo con số 23,7 lần, rồi cố tình đâm vào tường</span><span class="lc-sub">Nhánh Code Lab kèm sẵn script Node.js đã sinh ra cả hai output.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 14.2 ─────────────────────────── */
    {
      title: '14.2 — Pooling: in the app, and in front of it|||14.2 — Pool: trong app, và đứng trước app',
      slug: 'postgresql-14-2-pool-pgbouncer',
      type: 'LESSON',
      description: 'Cách chỉnh cỡ pool cho đúng (công thức, và vì sao pool LỚN thường làm mọi thứ CHẬM đi), khi nào app pool là đủ và khi nào cần PgBouncer, ba chế độ của PgBouncer, và đúng những tính năng bị hỏng ở chế độ transaction.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.2 · Phase 4 — In production</span>
<h2>Two layers, two different jobs</h2>
<p class="lead">The previous lesson measured why you pool. This one is about how much, and about the second pooler you may or may not need. Getting this wrong is the difference between a database that shrugs off a traffic spike and one that falls over during it.</p>

<h3>Sizing: smaller than you think</h3>
<p>The instinct is that a bigger pool serves more users. It does not, past a point — because a connection that is <em>waiting</em> for a CPU or a disk is not doing work, it is adding contention. The widely used starting formula:</p>
<div class="out">pool_size ≈ (số nhân CPU × 2) + số đĩa hiệu dụng</div>
<p>On a 4-core VPS with SSD storage that lands around <strong>9–10</strong>, which is why 10 is such a common default. The point is not the formula's precision — it is the direction it points. A pool of 100 against a 4-core server does not give you 100× the throughput; it gives you 100 processes competing for 4 cores, more context switching, more lock contention, and worse latency for everyone.</p>
<div class="callout ok">A request waiting 3 ms for a pool slot and then running in 1 ms is <strong>faster</strong> than 100 requests all starting immediately and each taking 200 ms because they are fighting each other. Queueing is a feature. The pool's job is to protect the database from the application.</div>

<h3>Then multiply, and compare to the limit</h3>
<p>From lesson 14.1, the arithmetic that actually matters:</p>
<div class="out">tổng kết nối = (số tiến trình kết nối) × (pool mỗi tiến trình)

cuongthai.com:  12 × 10 = 120   >   max_connections = 100   ❌</div>
<p>Two honest ways out. Either shrink the pools until the product fits under the limit with headroom — 12 × 6 = 72 leaves room for <code>psql</code>, migrations and the reserve — or put a pooler in front so the 120 application-side connections share far fewer real ones.</p>

<h3>PgBouncer: a pool for the pools</h3>
<p>An application pool holds real PostgreSQL connections open. <strong>PgBouncer</strong> sits between the application and the database and multiplexes: hundreds of client connections, a handful of server connections. It is a tiny single-process daemon, and for a fleet of processes it is the standard answer.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t"><code>session</code> mode</span><span class="lz-d">A server connection is tied to a client for its whole session. Safe — everything works exactly as without PgBouncer — but it barely multiplexes, so it buys little.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t"><code>transaction</code> mode</span><span class="lz-d">A server connection is assigned per <em>transaction</em> and returned immediately after <code>COMMIT</code>. This is where the huge ratios come from (500 clients over 20 server connections), and it is what almost everyone runs. It also breaks things — see below.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t"><code>statement</code> mode</span><span class="lz-d">A server connection per statement. Multi-statement transactions are impossible. Very rarely the right choice.</span></div>
</div>

<h3>What transaction mode breaks</h3>
<p>Because consecutive transactions from one client can land on different backends, anything that lives in <em>session</em> state stops being reliable:</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Prepared statements</span><span class="lz-lnote">Prepared on one backend, invisible on the next. This is the source of Prisma's <code>prepared statement "s0" already exists</code> errors behind PgBouncer — the fix is <code>pgbouncer=true</code> in the connection URL, which disables the prepared-statement cache.</span></div>
<div class="lz-layer"><span class="lz-lname"><code>SET</code> / session variables</span><span class="lz-lnote"><code>SET search_path</code>, <code>SET TIME ZONE</code>, <code>SET ROLE</code> apply to whichever backend happened to serve that transaction. Use the <code>SET LOCAL</code> form inside an explicit transaction instead.</span></div>
<div class="lz-layer"><span class="lz-lname">Advisory locks &amp; temp tables</span><span class="lz-lnote">Session-scoped advisory locks and <code>CREATE TEMP TABLE</code> both bind to a backend you no longer control. Use transaction-scoped advisory locks (<code>pg_advisory_xact_lock</code>) or drop the pattern.</span></div>
<div class="lz-layer"><span class="lz-lname"><code>LISTEN</code>/<code>NOTIFY</code></span><span class="lz-lnote">Does not work at all in transaction mode — <code>LISTEN</code> is inherently session-scoped. Notification consumers need a direct connection that bypasses PgBouncer.</span></div>
</div>
<div class="callout warn">Migrations deserve a direct connection too. Prisma explicitly supports this: <code>DATABASE_URL</code> through PgBouncer for the application, <code>DIRECT_URL</code> straight to PostgreSQL for <code>prisma migrate</code>. A migration that takes advisory locks or runs long DDL through a transaction-mode pooler is asking for a failure that is hard to diagnose afterwards.</div>

<h3>Deciding</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">→</span><span class="lz-t">App pool only</span><span class="lz-d">A handful of processes, and (processes × pool) fits comfortably under <code>max_connections</code>. Simplest thing that works — do not add a component you do not need.</span></div>
<div class="lz-step"><span class="lz-k">→</span><span class="lz-t">Add PgBouncer</span><span class="lz-d">Many processes, serverless or autoscaling workloads where process count is unpredictable, or you have already tuned pools down and still do not fit. Run it in <code>transaction</code> mode, set <code>pgbouncer=true</code> for Prisma, and keep a direct URL for migrations and any listener.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — adding PgBouncer without shrinking the application pools.</strong> PgBouncer limits how many <em>server</em> connections exist; it does nothing about how many client connections your app opens toward it. Twelve processes with pool 10 still open 120 connections — they now terminate at PgBouncer instead of PostgreSQL, and if <code>default_pool_size</code> is smaller, requests queue there instead. That is often exactly what you want, but the failure mode has simply moved: instead of <code>too many clients already</code> you get client-side timeouts waiting for a PgBouncer slot, with no error in the PostgreSQL log at all, so the first place you look is the one place with no evidence. Watch <code>SHOW POOLS;</code> on the PgBouncer admin console (<code>cl_waiting</code> is the number to alarm on) and size <code>default_pool_size</code> against the CPU formula above, not against your client count.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: compute your own pool budget, then break a prepared statement on purpose</span><span class="lc-sub">The Code Lab track walks through the Prisma + PgBouncer configuration.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.2 · Giai đoạn 4 — Trên production</span>
<h2>Hai tầng, hai công việc khác nhau</h2>
<p class="lead">Bài trước đã ĐO vì sao phải dùng pool. Bài này nói về BAO NHIÊU, và về cái pool thứ hai mà bạn có thể cần hoặc không. Làm sai chỗ này là khác biệt giữa một cơ sở dữ liệu nhún vai trước một đợt tăng lưu lượng và một cái đổ gục ngay trong đợt đó.</p>

<h3>Chỉnh cỡ: NHỎ hơn bạn tưởng</h3>
<p>Bản năng mách rằng pool lớn hơn thì phục vụ được nhiều người hơn. KHÔNG phải vậy, khi đã qua một ngưỡng — vì một kết nối đang <em>CHỜ</em> CPU hoặc đĩa thì không làm việc, nó chỉ thêm tranh chấp. Công thức khởi điểm được dùng rộng rãi:</p>
<div class="out">pool_size ≈ (số nhân CPU × 2) + số đĩa hiệu dụng</div>
<p>Trên một VPS 4 nhân với ổ SSD, con số rơi vào khoảng <strong>9–10</strong>, và đó là lý do 10 là một mặc định phổ biến đến thế. Điểm mấu chốt không phải độ chính xác của công thức — mà là HƯỚNG nó chỉ. Một pool 100 trên máy chủ 4 nhân không cho bạn thông lượng gấp 100 lần; nó cho bạn 100 tiến trình giành nhau 4 nhân, nhiều chuyển ngữ cảnh hơn, nhiều tranh chấp khoá hơn, và độ trễ TỆ HƠN cho tất cả mọi người.</p>
<div class="callout ok">Một request chờ 3 ms để có suất pool rồi chạy trong 1 ms thì <strong>NHANH HƠN</strong> 100 request cùng khởi động ngay lập tức mà mỗi cái mất 200 ms vì chúng đang đánh nhau. Xếp hàng là một TÍNH NĂNG. Việc của pool là BẢO VỆ cơ sở dữ liệu khỏi ứng dụng.</div>

<h3>Rồi nhân lên, và so với giới hạn</h3>
<p>Từ bài 14.1, phép tính thật sự quan trọng:</p>
<div class="out">tổng kết nối = (số tiến trình kết nối) × (pool mỗi tiến trình)

cuongthai.com:  12 × 10 = 120   >   max_connections = 100   ❌</div>
<p>Có hai lối ra trung thực. Hoặc thu nhỏ các pool cho tới khi tích số lọt xuống dưới giới hạn và còn dư chỗ — 12 × 6 = 72 chừa chỗ cho <code>psql</code>, migration và phần dự trữ — hoặc đặt một bộ pool phía trước để 120 kết nối phía ứng dụng dùng chung ít kết nối thật hơn nhiều.</p>

<h3>PgBouncer: một pool cho các pool</h3>
<p>Pool của ứng dụng giữ mở các kết nối PostgreSQL THẬT. <strong>PgBouncer</strong> đứng giữa ứng dụng và cơ sở dữ liệu rồi ghép kênh: hàng trăm kết nối client, một nhúm kết nối máy chủ. Nó là một daemon một-tiến-trình bé xíu, và với một đàn tiến trình thì nó là câu trả lời tiêu chuẩn.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Chế độ <code>session</code></span><span class="lz-d">Một kết nối máy chủ bị buộc vào một client suốt cả phiên. An toàn — mọi thứ chạy y như khi không có PgBouncer — nhưng nó gần như không ghép kênh, nên mua được rất ít.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Chế độ <code>transaction</code></span><span class="lz-d">Một kết nối máy chủ được gán theo từng <em>GIAO DỊCH</em> và trả lại NGAY sau <code>COMMIT</code>. Đây là chỗ sinh ra các tỉ lệ khổng lồ (500 client trên 20 kết nối máy chủ), và là thứ gần như ai cũng chạy. Nó CŨNG làm hỏng vài thứ — xem bên dưới.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Chế độ <code>statement</code></span><span class="lz-d">Một kết nối máy chủ cho mỗi câu lệnh. Giao dịch nhiều câu lệnh là bất khả. Rất hiếm khi là lựa chọn đúng.</span></div>
</div>

<h3>Chế độ transaction làm hỏng những gì</h3>
<p>Vì các giao dịch liên tiếp từ MỘT client có thể rơi vào những backend KHÁC NHAU, mọi thứ sống trong trạng thái <em>PHIÊN</em> đều thôi đáng tin:</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Prepared statement</span><span class="lz-lnote">Chuẩn bị ở backend này, vô hình ở backend sau. Đây là nguồn gốc của lỗi <code>prepared statement "s0" already exists</code> của Prisma khi đứng sau PgBouncer — cách sửa là <code>pgbouncer=true</code> trong URL kết nối, nó tắt bộ đệm prepared statement.</span></div>
<div class="lz-layer"><span class="lz-lname"><code>SET</code> / biến phiên</span><span class="lz-lnote"><code>SET search_path</code>, <code>SET TIME ZONE</code>, <code>SET ROLE</code> áp lên đúng cái backend TÌNH CỜ phục vụ giao dịch đó. Hãy dùng dạng <code>SET LOCAL</code> bên trong một giao dịch tường minh thay thế.</span></div>
<div class="lz-layer"><span class="lz-lname">Advisory lock &amp; bảng tạm</span><span class="lz-lnote">Advisory lock phạm vi phiên và <code>CREATE TEMP TABLE</code> đều buộc vào một backend mà bạn không còn kiểm soát. Hãy dùng advisory lock phạm vi giao dịch (<code>pg_advisory_xact_lock</code>) hoặc bỏ hẳn mẫu đó.</span></div>
<div class="lz-layer"><span class="lz-lname"><code>LISTEN</code>/<code>NOTIFY</code></span><span class="lz-lnote">HOÀN TOÀN không chạy ở chế độ transaction — <code>LISTEN</code> vốn dĩ thuộc phạm vi phiên. Bên tiêu thụ thông báo cần một kết nối TRỰC TIẾP đi vòng qua PgBouncer.</span></div>
</div>
<div class="callout warn">Migration cũng xứng đáng có kết nối trực tiếp. Prisma hỗ trợ điều này một cách tường minh: <code>DATABASE_URL</code> đi qua PgBouncer cho ứng dụng, <code>DIRECT_URL</code> đi thẳng vào PostgreSQL cho <code>prisma migrate</code>. Một migration lấy advisory lock hoặc chạy DDL dài xuyên qua một bộ pool chế độ transaction là đang cầu một kiểu hỏng rất khó chẩn đoán về sau.</div>

<h3>Quyết định</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">→</span><span class="lz-t">Chỉ pool ở app</span><span class="lz-d">Một nhúm tiến trình, và (tiến trình × pool) lọt thoải mái dưới <code>max_connections</code>. Thứ đơn giản nhất mà chạy được — đừng thêm một thành phần bạn không cần.</span></div>
<div class="lz-step"><span class="lz-k">→</span><span class="lz-t">Thêm PgBouncer</span><span class="lz-d">Nhiều tiến trình, tải kiểu serverless hoặc tự co giãn nơi số tiến trình không đoán được, hoặc bạn đã hạ pool xuống rồi mà vẫn không lọt. Chạy nó ở chế độ <code>transaction</code>, đặt <code>pgbouncer=true</code> cho Prisma, và giữ một URL trực tiếp cho migration và cho mọi bên lắng nghe.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — thêm PgBouncer mà KHÔNG thu nhỏ pool của ứng dụng.</strong> PgBouncer giới hạn số kết nối <em>MÁY CHỦ</em> tồn tại; nó không làm gì với số kết nối client mà app của bạn mở về phía nó. Mười hai tiến trình với pool 10 vẫn mở 120 kết nối — giờ chúng kết thúc ở PgBouncer thay vì ở PostgreSQL, và nếu <code>default_pool_size</code> nhỏ hơn thì request xếp hàng ở ĐÓ. Đó thường đúng là điều bạn muốn, nhưng kiểu hỏng chỉ đơn giản là ĐÃ DI CHUYỂN: thay vì <code>too many clients already</code> bạn nhận timeout phía client khi chờ một suất PgBouncer, mà log của PostgreSQL thì KHÔNG có lỗi nào cả — nên chỗ đầu tiên bạn nhìn vào lại đúng là chỗ không có bằng chứng. Hãy theo dõi <code>SHOW POOLS;</code> ở bảng quản trị của PgBouncer (<code>cl_waiting</code> là con số cần đặt cảnh báo) và chỉnh <code>default_pool_size</code> theo công thức CPU ở trên, chứ không theo số client của bạn.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: tự tính ngân sách pool, rồi cố tình làm hỏng một prepared statement</span><span class="lc-sub">Nhánh Code Lab dẫn qua cấu hình Prisma + PgBouncer.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 14.3 ─────────────────────────── */
    {
      title: '14.3 — VACUUM, autovacuum and bloat|||14.3 — VACUUM, autovacuum và bloat',
      slug: 'postgresql-14-3-vacuum-bloat',
      type: 'LESSON',
      description: 'Cái giá của MVCC từ Chương 11, giờ là việc phải VẬN HÀNH. Ngưỡng autovacuum tính ra được (50 + 0,2×n) và vì sao nó quá thưa với bảng lớn, autovacuum chạy thật đo được, truy vấn tìm bảng phình, và mối nguy transaction ID wraparound.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.3 · Phase 4 — In production</span>
<h2>The maintenance MVCC makes necessary</h2>
<p class="lead">Chapter 11 showed that an <code>UPDATE</code> leaves the old row version behind, and that a 100,000-row table grew from 4,608 kB to 13 MB after two rounds of updates. That was the mechanism. This lesson is the operations: who cleans it up, when they decide to, and what happens when they cannot keep up.</p>

<h3>Autovacuum's actual threshold</h3>
<p>Autovacuum is a background process that vacuums tables when they have accumulated enough dead rows. "Enough" is computed, and you can read the inputs:</p>
<pre><code><span class="tok-keyword">SELECT</span> name, setting, unit <span class="tok-keyword">FROM</span> pg_settings
<span class="tok-keyword">WHERE</span> name <span class="tok-keyword">LIKE</span> <span class="tok-string">'autovacuum%'</span> <span class="tok-keyword">ORDER BY</span> name;</code></pre>
<div class="out">              name               | setting | unit
---------------------------------+---------+------
 autovacuum                      | on      |
 autovacuum_analyze_scale_factor | 0.1     |
 autovacuum_analyze_threshold    | 50      |
 autovacuum_naptime              | 60      | s
 autovacuum_vacuum_scale_factor  | 0.2     |
 autovacuum_vacuum_threshold     | 50      |
(6 rows)</div>
<p>The rule is:</p>
<div class="out">ngưỡng = autovacuum_vacuum_threshold + autovacuum_vacuum_scale_factor × số_dòng
       = 50 + 0.2 × số_dòng</div>
<p>Work that through for a table with a million rows:</p>
<div class="out">ngưỡng = 50 + 0.2 × 1 000 000 = 200 050 dead tuple</div>
<p><strong>Two hundred thousand dead rows before autovacuum even considers the table.</strong> On a small table that is fine. On a large, frequently-updated one it means the table is allowed to bloat by 20% before anything happens — and each pass then has more work to do, so it takes longer and interferes more. This is the single most common autovacuum misconfiguration, and it is a default, not a mistake anyone made.</p>

<h3>Watch it fire</h3>
<p>Give a small table an aggressive threshold, make 1,000 rows dead, and wait:</p>
<pre><code><span class="tok-keyword">ALTER TABLE</span> av_demo <span class="tok-keyword">SET</span> (autovacuum_vacuum_threshold = 100, autovacuum_vacuum_scale_factor = 0);
<span class="tok-keyword">UPDATE</span> av_demo <span class="tok-keyword">SET</span> v = v || <span class="tok-string">'!'</span>;   <span class="tok-comment">-- 1000 dòng chết</span></code></pre>
<div class="out">[15s] autovacuum_count=0 · n_dead_tup=1000 · last_autovacuum=chưa
[30s] autovacuum_count=1 · n_dead_tup=0    · last_autovacuum=2026-08-26 10:46:33+00

 n_live_tup | n_dead_tup | autovacuum_count |        last_autovacuum
------------+------------+------------------+-------------------------------
       1000 |          0 |                1 | 2026-08-26 10:46:33.600584+00</div>
<p>Nothing at 15 seconds, done by 30. Autovacuum wakes every <code>autovacuum_naptime</code> (60 s) and checks; it is not instant and it is not meant to be. Note the per-table <code>ALTER TABLE … SET</code> — <strong>tuning autovacuum per table is the right move</strong>, far better than changing the global default and affecting tables that were fine.</p>
<div class="callout ok">For a large, write-heavy table, a scale factor of 0.01 with a threshold of 1,000 means "vacuum after about 1% churn" instead of 20%. More frequent, much smaller passes. Set it on the two or three tables that actually churn, and leave the rest at the defaults.</div>

<h3>Finding what is bloated</h3>
<p>One query, safe to run on production, answers "which table needs attention":</p>
<pre><code><span class="tok-keyword">SELECT</span> relname, n_live_tup, n_dead_tup,
       <span class="tok-keyword">CASE WHEN</span> n_live_tup &gt; 0
            <span class="tok-keyword">THEN</span> round(100.0 * n_dead_tup / n_live_tup, 1)
            <span class="tok-keyword">ELSE</span> 0 <span class="tok-keyword">END</span> <span class="tok-keyword">AS</span> phan_tram_chet,
       pg_size_pretty(pg_relation_size(relid)) <span class="tok-keyword">AS</span> kich_thuoc
<span class="tok-keyword">FROM</span> pg_stat_user_tables
<span class="tok-keyword">WHERE</span> n_dead_tup &gt; 0
<span class="tok-keyword">ORDER BY</span> n_dead_tup <span class="tok-keyword">DESC</span> <span class="tok-keyword">LIMIT</span> 5;</code></pre>
<div class="out"> relname | n_live_tup | n_dead_tup | phan_tram_chet | kich_thuoc
---------+------------+------------+----------------+------------
 av_demo |       1000 |       1000 |          100.0 | 88 kB
(1 row)</div>
<p>Sustained high <code>phan_tram_chet</code> on a table means autovacuum is not keeping up with it — either the threshold is too high for its churn rate, or something is preventing cleanup entirely.</p>

<h3>VACUUM vs VACUUM FULL, again</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>VACUUM</code></span><span class="lz-lnote">Marks dead space reusable by the same table. Does <strong>not</strong> shrink the file (Chapter 11 measured this: 13 MB before, 13 MB after). Does not block reads or writes. This is what autovacuum runs.</span></div>
<div class="lz-layer"><span class="lz-lname"><code>VACUUM FULL</code></span><span class="lz-lnote">Rewrites the table, returning space to the OS. Takes <code>ACCESS EXCLUSIVE</code> — blocks everything, including <code>SELECT</code> — and needs room for a second copy. Never routine.</span></div>
<div class="lz-layer"><span class="lz-lname"><code>pg_repack</code></span><span class="lz-lnote">An extension that achieves what <code>VACUUM FULL</code> does without the long exclusive lock. On a busy production table this is the tool you want.</span></div>
<div class="lz-layer"><span class="lz-lname"><code>ANALYZE</code></span><span class="lz-lnote">A different job that autovacuum also does: refreshing the planner statistics from Chapter 10. Bad plans right after a bulk load are usually missing <code>ANALYZE</code>, not missing indexes.</span></div>
</div>

<div class="pitfall"><p><strong>Trap — transaction ID wraparound, the failure that stops writes entirely.</strong> Row visibility uses a 32-bit transaction counter, so it wraps. <code>VACUUM</code> has a second job besides cleaning dead rows: <em>freezing</em> old rows so they stay visible after the counter wraps. If vacuuming is blocked long enough, PostgreSQL starts warning, then refuses all new transactions with <em>database is not accepting commands to avoid wraparound data loss</em> — a full write outage requiring single-user-mode recovery. Three things block vacuum and all were met earlier in this course: a long-running transaction or an <code>idle in transaction</code> session pinning an old snapshot (11.1), an abandoned replication slot holding WAL (Chapter 15), and a prepared transaction nobody committed. Monitor it with one query — <code>SELECT datname, age(datfrozenxid) FROM pg_database ORDER BY 2 DESC;</code> — and treat a rising number as urgent, not interesting. Default <code>autovacuum_freeze_max_age</code> is 200 million; the hard stop is around 2 billion.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: tune a table's autovacuum and watch it fire within 30 seconds</span><span class="lc-sub">The Code Lab track reproduces the threshold arithmetic and the bloat query.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.3 · Giai đoạn 4 — Trên production</span>
<h2>Việc bảo trì mà MVCC bắt buộc phải có</h2>
<p class="lead">Chương 11 đã chỉ ra rằng một lệnh <code>UPDATE</code> để lại phiên bản dòng cũ phía sau, và một bảng 100.000 dòng phình từ 4.608 kB lên 13 MB sau hai lượt cập nhật. Đó là CƠ CHẾ. Bài này là VẬN HÀNH: ai dọn nó, họ quyết định dọn lúc nào, và chuyện gì xảy ra khi họ theo không kịp.</p>

<h3>Ngưỡng THẬT của autovacuum</h3>
<p>Autovacuum là một tiến trình nền, nó vacuum các bảng khi chúng đã tích đủ dòng chết. "Đủ" là một con số ĐƯỢC TÍNH, và bạn đọc được các đầu vào:</p>
<pre><code><span class="tok-keyword">SELECT</span> name, setting, unit <span class="tok-keyword">FROM</span> pg_settings
<span class="tok-keyword">WHERE</span> name <span class="tok-keyword">LIKE</span> <span class="tok-string">'autovacuum%'</span> <span class="tok-keyword">ORDER BY</span> name;</code></pre>
<div class="out">              name               | setting | unit
---------------------------------+---------+------
 autovacuum                      | on      |
 autovacuum_analyze_scale_factor | 0.1     |
 autovacuum_analyze_threshold    | 50      |
 autovacuum_naptime              | 60      | s
 autovacuum_vacuum_scale_factor  | 0.2     |
 autovacuum_vacuum_threshold     | 50      |
(6 rows)</div>
<p>Quy tắc là:</p>
<div class="out">ngưỡng = autovacuum_vacuum_threshold + autovacuum_vacuum_scale_factor × số_dòng
       = 50 + 0,2 × số_dòng</div>
<p>Tính thử cho một bảng một triệu dòng:</p>
<div class="out">ngưỡng = 50 + 0,2 × 1 000 000 = 200 050 dead tuple</div>
<p><strong>HAI TRĂM NGHÌN dòng chết trước khi autovacuum thậm chí NGÓ tới cái bảng.</strong> Với bảng nhỏ thì ổn. Với một bảng lớn và bị cập nhật thường xuyên, nó nghĩa là bảng được phép phình 20% trước khi có bất cứ chuyện gì xảy ra — và mỗi lượt dọn khi đó lại có nhiều việc hơn, nên nó lâu hơn và cản trở nhiều hơn. Đây là kiểu cấu hình sai autovacuum phổ biến nhất, và nó là một MẶC ĐỊNH, chứ không phải lỗi do ai gây ra.</p>

<h3>Nhìn nó chạy</h3>
<p>Cho một bảng nhỏ một ngưỡng gắt, làm 1.000 dòng chết đi, rồi chờ:</p>
<pre><code><span class="tok-keyword">ALTER TABLE</span> av_demo <span class="tok-keyword">SET</span> (autovacuum_vacuum_threshold = 100, autovacuum_vacuum_scale_factor = 0);
<span class="tok-keyword">UPDATE</span> av_demo <span class="tok-keyword">SET</span> v = v || <span class="tok-string">'!'</span>;   <span class="tok-comment">-- 1000 dòng chết</span></code></pre>
<div class="out">[15s] autovacuum_count=0 · n_dead_tup=1000 · last_autovacuum=chưa
[30s] autovacuum_count=1 · n_dead_tup=0    · last_autovacuum=2026-08-26 10:46:33+00

 n_live_tup | n_dead_tup | autovacuum_count |        last_autovacuum
------------+------------+------------------+-------------------------------
       1000 |          0 |                1 | 2026-08-26 10:46:33.600584+00</div>
<p>Ở giây thứ 15 chưa có gì, tới giây 30 đã xong. Autovacuum thức dậy mỗi <code>autovacuum_naptime</code> (60 giây) rồi kiểm tra; nó không tức thì và cũng không cần phải tức thì. Để ý cái <code>ALTER TABLE … SET</code> theo TỪNG BẢNG — <strong>chỉnh autovacuum theo từng bảng mới là nước đi đúng</strong>, tốt hơn nhiều so với đổi mặc định toàn cục rồi ảnh hưởng tới những bảng vốn đang ổn.</p>
<div class="callout ok">Với một bảng lớn nặng ghi, scale factor 0,01 kèm ngưỡng 1.000 nghĩa là "vacuum sau khoảng 1% biến động" thay vì 20%. Dọn thường xuyên hơn, mỗi lượt nhỏ hơn NHIỀU. Hãy đặt nó cho hai hoặc ba bảng THẬT SỰ biến động, và để yên phần còn lại ở mặc định.</div>

<h3>Tìm xem cái nào đang phình</h3>
<p>Một truy vấn, chạy an toàn trên production, trả lời "bảng nào cần để mắt":</p>
<pre><code><span class="tok-keyword">SELECT</span> relname, n_live_tup, n_dead_tup,
       <span class="tok-keyword">CASE WHEN</span> n_live_tup &gt; 0
            <span class="tok-keyword">THEN</span> round(100.0 * n_dead_tup / n_live_tup, 1)
            <span class="tok-keyword">ELSE</span> 0 <span class="tok-keyword">END</span> <span class="tok-keyword">AS</span> phan_tram_chet,
       pg_size_pretty(pg_relation_size(relid)) <span class="tok-keyword">AS</span> kich_thuoc
<span class="tok-keyword">FROM</span> pg_stat_user_tables
<span class="tok-keyword">WHERE</span> n_dead_tup &gt; 0
<span class="tok-keyword">ORDER BY</span> n_dead_tup <span class="tok-keyword">DESC</span> <span class="tok-keyword">LIMIT</span> 5;</code></pre>
<div class="out"> relname | n_live_tup | n_dead_tup | phan_tram_chet | kich_thuoc
---------+------------+------------+----------------+------------
 av_demo |       1000 |       1000 |          100.0 | 88 kB
(1 row)</div>
<p><code>phan_tram_chet</code> cao KÉO DÀI trên một bảng nghĩa là autovacuum đang theo không kịp nó — hoặc ngưỡng quá cao so với nhịp biến động, hoặc có thứ gì đó đang chặn hẳn việc dọn dẹp.</p>

<h3>VACUUM và VACUUM FULL, một lần nữa</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>VACUUM</code></span><span class="lz-lnote">Đánh dấu chỗ chết là dùng lại được BỞI CHÍNH bảng đó. <strong>KHÔNG</strong> co nhỏ file (Chương 11 đã đo: trước 13 MB, sau vẫn 13 MB). Không chặn đọc hay ghi. Đây là thứ autovacuum chạy.</span></div>
<div class="lz-layer"><span class="lz-lname"><code>VACUUM FULL</code></span><span class="lz-lnote">Viết lại cả bảng, trả chỗ về cho hệ điều hành. Lấy khoá <code>ACCESS EXCLUSIVE</code> — chặn MỌI thứ, kể cả <code>SELECT</code> — và cần chỗ trống cho một bản sao thứ hai. Không bao giờ là việc thường ngày.</span></div>
<div class="lz-layer"><span class="lz-lname"><code>pg_repack</code></span><span class="lz-lnote">Một phần mở rộng đạt được điều <code>VACUUM FULL</code> làm mà KHÔNG cần cái khoá độc quyền dài. Trên một bảng production bận rộn thì đây mới là công cụ bạn muốn.</span></div>
<div class="lz-layer"><span class="lz-lname"><code>ANALYZE</code></span><span class="lz-lnote">Một việc KHÁC mà autovacuum cũng làm: làm mới thống kê cho bộ lập kế hoạch ở Chương 10. Plan tồi ngay sau một đợt nạp dữ liệu lớn thường là do THIẾU <code>ANALYZE</code>, chứ không phải thiếu chỉ mục.</span></div>
</div>

<div class="pitfall"><p><strong>Bẫy — transaction ID wraparound, kiểu hỏng CHẶN ĐỨNG mọi lệnh ghi.</strong> Khả năng nhìn thấy của một dòng dùng một bộ đếm giao dịch 32 bit, nên nó QUAY VÒNG. <code>VACUUM</code> có một việc thứ hai ngoài dọn dòng chết: <em>ĐÓNG BĂNG</em> các dòng cũ để chúng vẫn nhìn thấy được sau khi bộ đếm quay vòng. Nếu việc vacuum bị chặn đủ lâu, PostgreSQL bắt đầu cảnh báo, rồi TỪ CHỐI mọi giao dịch mới với dòng <em>database is not accepting commands to avoid wraparound data loss</em> — một sự cố mất ghi toàn phần, phải cứu bằng chế độ một-người-dùng. Ba thứ chặn vacuum, và cả ba đều đã gặp trong khoá này: một giao dịch chạy dài hoặc một phiên <code>idle in transaction</code> đang ghim ảnh chụp cũ (11.1), một replication slot bị bỏ rơi đang giữ WAL (Chương 15), và một prepared transaction không ai commit. Hãy giám sát bằng một truy vấn — <code>SELECT datname, age(datfrozenxid) FROM pg_database ORDER BY 2 DESC;</code> — và coi con số đang tăng là chuyện KHẨN CẤP, chứ không phải chuyện thú vị. Mặc định <code>autovacuum_freeze_max_age</code> là 200 triệu; điểm dừng cứng ở khoảng 2 tỉ.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: chỉnh autovacuum cho một bảng và nhìn nó chạy trong vòng 30 giây</span><span class="lc-sub">Nhánh Code Lab tái hiện phép tính ngưỡng và truy vấn tìm bloat.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 14.4 ─────────────────────────── */
    {
      title: '14.4 — Monitoring: answering "why is it slow?"|||14.4 — Giám sát: trả lời câu "sao nó chậm thế?"',
      slug: 'postgresql-14-4-giam-sat',
      type: 'LESSON',
      description: 'Ba khung nhìn trả lời được câu hỏi đó: pg_stat_activity cho "ngay lúc này", pg_stat_statements cho "theo thời gian" — đo thật một truy vấn chạy 2 lượt ăn 51,1 ms nhiều hơn cả truy vấn chạy 5 lượt ăn 12,7 ms — và pg_stat_user_indexes cho các chỉ mục không ai dùng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.4 · Phase 4 — In production</span>
<h2>Three views, and what each one answers</h2>
<p class="lead">"The site is slow" is not a diagnosis. PostgreSQL ships with enough introspection to turn it into one, and the whole skill is knowing which view answers which question. There are three you will use constantly.</p>

<h3>pg_stat_activity — what is happening right now</h3>
<pre><code><span class="tok-keyword">SELECT</span> pid, state, wait_event_type, wait_event,
       now()-xact_start <span class="tok-keyword">AS</span> tuoi_giao_dich, left(query,40) <span class="tok-keyword">AS</span> truy_van
<span class="tok-keyword">FROM</span> pg_stat_activity
<span class="tok-keyword">WHERE</span> backend_type=<span class="tok-string">'client backend'</span>;</code></pre>
<div class="out"> pid  | state  | wait_event_type | wait_event |                 truy_van
------+--------+-----------------+------------+------------------------------------------
 5372 | active |                 |            | SELECT pid, state, wait_event_type, wait
(1 row)</div>
<p>The <code>state</code> column is the one to read first:</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>active</code></span><span class="lz-lnote">Running a query right now. If several are active and slow, look at <code>wait_event</code> — a row of <code>Lock</code> waits means contention (Chapter 11), <code>IO</code> means disk.</span></div>
<div class="lz-layer"><span class="lz-lname"><code>idle</code></span><span class="lz-lnote">Connected, doing nothing, holding no transaction. Harmless — this is what a healthy pool looks like at rest.</span></div>
<div class="lz-layer"><span class="lz-lname"><code>idle in transaction</code></span><span class="lz-lnote">The dangerous one. An open transaction doing nothing: holding locks, pinning a snapshot, blocking vacuum everywhere (11.1, 14.3). Any of these older than a few minutes is a bug.</span></div>
<div class="lz-layer"><span class="lz-lname"><code>idle in transaction (aborted)</code></span><span class="lz-lnote">Same, plus the transaction has already errored — the state from lesson 11.1 where every further command is refused. The application is not handling an error somewhere.</span></div>
</div>
<p>Two things you can do from here: <code>pg_cancel_backend(pid)</code> cancels the running query and is safe; <code>pg_terminate_backend(pid)</code> kills the whole connection and is the blunter tool. Use cancel first.</p>

<h3>pg_stat_statements — what has been expensive over time</h3>
<p>This is an extension and it must be preloaded, which requires a restart — do it before you need it:</p>
<pre><code><span class="tok-comment"># postgresql.conf</span>
shared_preload_libraries = <span class="tok-string">'pg_stat_statements'</span>
<span class="tok-comment"># rồi khởi động lại, rồi:</span>
<span class="tok-keyword">CREATE EXTENSION</span> pg_stat_statements;</code></pre>
<p>Then it answers the question that matters. A workload of eight queries — five cheap ones, two expensive ones, one aggregate:</p>
<pre><code><span class="tok-keyword">SELECT</span> calls,
       round(total_exec_time::numeric,1) <span class="tok-keyword">AS</span> tong_ms,
       round(mean_exec_time::numeric,2)  <span class="tok-keyword">AS</span> tb_ms,
       rows, left(query,52) <span class="tok-keyword">AS</span> truy_van
<span class="tok-keyword">FROM</span> pg_stat_statements
<span class="tok-keyword">ORDER BY</span> total_exec_time <span class="tok-keyword">DESC</span> <span class="tok-keyword">LIMIT</span> 5;</code></pre>
<div class="out"> calls | tong_ms | tb_ms | rows |                  truy_van
-------+---------+-------+------+--------------------------------------------
     2 |    51.1 | 25.54 |    2 | SELECT count(*) FROM big WHERE val LIKE $1
     1 |    15.6 | 15.63 |    1 | SELECT sum(id) FROM big
     5 |    12.7 |  2.55 |    5 | SELECT count(*) FROM big WHERE bucket = $1
(3 rows)</div>
<p>Read the first and third rows together. The <code>LIKE</code> query ran <strong>twice</strong> and consumed <strong>51.1 ms</strong>; the indexed query ran <strong>five times</strong> and consumed <strong>12.7 ms</strong>. Sort by <code>calls</code> and you would optimise the wrong one.</p>
<div class="callout ok"><strong>Always order by <code>total_exec_time</code>.</strong> It is the only column that captures real impact — a 2 ms query called 100,000 times matters more than a 3-second report run nightly, and neither <code>calls</code> nor <code>mean_exec_time</code> alone will tell you that. Notice too that literals are replaced with <code>$1</code>: the same query with different values is grouped into one row, which is what makes the totals meaningful.</div>

<h3>pg_stat_user_indexes — indexes nobody uses</h3>
<p>Chapter 9 warned that an unused index is pure cost: it slows every write and occupies disk while helping nothing. This finds them:</p>
<pre><code><span class="tok-keyword">SELECT</span> relname, indexrelname, idx_scan,
       pg_size_pretty(pg_relation_size(indexrelid)) <span class="tok-keyword">AS</span> kich_thuoc
<span class="tok-keyword">FROM</span> pg_stat_user_indexes
<span class="tok-keyword">WHERE</span> idx_scan = 0
<span class="tok-keyword">ORDER BY</span> pg_relation_size(indexrelid) <span class="tok-keyword">DESC</span>;</code></pre>
<p><code>idx_scan = 0</code> means it has never been used since statistics were last reset. Two cautions before you drop anything: the counters reset when you run <code>pg_stat_reset()</code> or restore the database, so check <code>stats_reset</code> in <code>pg_stat_database</code> first; and a unique index may exist to enforce a constraint rather than to speed a query, so an unused one can still be doing essential work.</p>

<h3>A short list worth alarming on</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Connections used vs <code>max_connections</code></span><span class="lz-d">Alarm well before 100% — at 80% you still have time to act (14.1).</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Oldest transaction age</span><span class="lz-d"><code>max(now()-xact_start)</code>. Catches the stuck transaction that blocks vacuum before it causes bloat, not after.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Dead-tuple ratio on your busiest tables</span><span class="lz-d">From 14.3. Rising and staying high means autovacuum is losing.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t"><code>age(datfrozenxid)</code></span><span class="lz-d">The wraparound counter. Boring for years, then an outage — which is exactly why it belongs on a dashboard.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Cache hit ratio</span><span class="lz-d"><code>SELECT sum(blks_hit)*100.0/sum(blks_hit+blks_read) FROM pg_stat_database;</code> — a healthy OLTP database sits above 99%. A sustained drop means the working set stopped fitting in RAM.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — installing pg_stat_statements during the incident.</strong> It needs <code>shared_preload_libraries</code>, which needs a <strong>restart</strong> — so the moment you most want the data is the moment you cannot get it without making the outage worse, and even after the restart the view starts empty, having recorded nothing about what just happened. Enable it on day one, when a restart costs nothing. The same logic applies to <code>log_min_duration_statement</code> (log every query slower than, say, 500 ms) and <code>log_lock_waits</code>: both are cheap, both are set-and-forget, and both answer questions that are unanswerable afterwards. Observability you switch on during the fire only tells you about the next fire.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: run a mixed workload, then find the expensive query by total time</span><span class="lc-sub">The Code Lab track reproduces the 51.1 ms vs 12.7 ms result.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.4 · Giai đoạn 4 — Trên production</span>
<h2>Ba khung nhìn, và mỗi cái trả lời điều gì</h2>
<p class="lead">"Trang web chậm" không phải một CHẨN ĐOÁN. PostgreSQL có sẵn đủ công cụ tự soi để biến nó thành chẩn đoán, và toàn bộ kỹ năng nằm ở chỗ biết khung nhìn nào trả lời câu hỏi nào. Có ba cái bạn sẽ dùng liên tục.</p>

<h3>pg_stat_activity — chuyện gì đang xảy ra NGAY LÚC NÀY</h3>
<pre><code><span class="tok-keyword">SELECT</span> pid, state, wait_event_type, wait_event,
       now()-xact_start <span class="tok-keyword">AS</span> tuoi_giao_dich, left(query,40) <span class="tok-keyword">AS</span> truy_van
<span class="tok-keyword">FROM</span> pg_stat_activity
<span class="tok-keyword">WHERE</span> backend_type=<span class="tok-string">'client backend'</span>;</code></pre>
<div class="out"> pid  | state  | wait_event_type | wait_event |                 truy_van
------+--------+-----------------+------------+------------------------------------------
 5372 | active |                 |            | SELECT pid, state, wait_event_type, wait
(1 row)</div>
<p>Cột <code>state</code> là cột phải đọc trước tiên:</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>active</code></span><span class="lz-lnote">Đang chạy một truy vấn ngay lúc này. Nếu nhiều cái cùng active và cùng chậm, hãy nhìn <code>wait_event</code> — một dãy chờ <code>Lock</code> nghĩa là tranh chấp (Chương 11), <code>IO</code> nghĩa là đĩa.</span></div>
<div class="lz-layer"><span class="lz-lname"><code>idle</code></span><span class="lz-lnote">Đang kết nối, không làm gì, không giữ giao dịch nào. Vô hại — một pool khoẻ mạnh lúc rảnh trông đúng như vậy.</span></div>
<div class="lz-layer"><span class="lz-lname"><code>idle in transaction</code></span><span class="lz-lnote">Cái NGUY HIỂM. Một giao dịch đang mở mà không làm gì: đang giữ khoá, đang ghim ảnh chụp, đang chặn vacuum ở khắp nơi (11.1, 14.3). Bất kỳ cái nào già hơn vài phút đều là một con bug.</span></div>
<div class="lz-layer"><span class="lz-lname"><code>idle in transaction (aborted)</code></span><span class="lz-lnote">Y như trên, cộng thêm việc giao dịch ĐÃ lỗi — đúng cái trạng thái ở bài 11.1 nơi mọi lệnh tiếp theo đều bị từ chối. Ứng dụng đang không xử lý một lỗi ở đâu đó.</span></div>
</div>
<p>Hai việc bạn làm được từ đây: <code>pg_cancel_backend(pid)</code> huỷ truy vấn đang chạy và AN TOÀN; <code>pg_terminate_backend(pid)</code> giết cả kết nối và là công cụ thô bạo hơn. Hãy dùng cancel trước.</p>

<h3>pg_stat_statements — cái gì đã ĐẮT theo thời gian</h3>
<p>Đây là một phần mở rộng và nó phải được nạp trước, tức là cần KHỞI ĐỘNG LẠI — hãy làm việc đó TRƯỚC khi bạn cần tới nó:</p>
<pre><code><span class="tok-comment"># postgresql.conf</span>
shared_preload_libraries = <span class="tok-string">'pg_stat_statements'</span>
<span class="tok-comment"># rồi khởi động lại, rồi:</span>
<span class="tok-keyword">CREATE EXTENSION</span> pg_stat_statements;</code></pre>
<p>Rồi nó trả lời câu hỏi thật sự quan trọng. Một khối việc gồm tám truy vấn — năm cái rẻ, hai cái đắt, một phép tổng hợp:</p>
<pre><code><span class="tok-keyword">SELECT</span> calls,
       round(total_exec_time::numeric,1) <span class="tok-keyword">AS</span> tong_ms,
       round(mean_exec_time::numeric,2)  <span class="tok-keyword">AS</span> tb_ms,
       rows, left(query,52) <span class="tok-keyword">AS</span> truy_van
<span class="tok-keyword">FROM</span> pg_stat_statements
<span class="tok-keyword">ORDER BY</span> total_exec_time <span class="tok-keyword">DESC</span> <span class="tok-keyword">LIMIT</span> 5;</code></pre>
<div class="out"> calls | tong_ms | tb_ms | rows |                  truy_van
-------+---------+-------+------+--------------------------------------------
     2 |    51.1 | 25.54 |    2 | SELECT count(*) FROM big WHERE val LIKE $1
     1 |    15.6 | 15.63 |    1 | SELECT sum(id) FROM big
     5 |    12.7 |  2.55 |    5 | SELECT count(*) FROM big WHERE bucket = $1
(3 rows)</div>
<p>Hãy đọc dòng thứ nhất và dòng thứ ba CÙNG NHAU. Truy vấn <code>LIKE</code> chạy <strong>HAI</strong> lượt và ngốn <strong>51,1 ms</strong>; truy vấn có chỉ mục chạy <strong>NĂM</strong> lượt và ngốn <strong>12,7 ms</strong>. Sắp theo <code>calls</code> thì bạn sẽ đi tối ưu nhầm cái.</p>
<div class="callout ok"><strong>LUÔN sắp theo <code>total_exec_time</code>.</strong> Đó là cột DUY NHẤT nắm được tác động thật — một truy vấn 2 ms gọi 100.000 lần quan trọng hơn một báo cáo 3 giây chạy mỗi đêm, và cả <code>calls</code> lẫn <code>mean_exec_time</code> đứng một mình đều không nói cho bạn biết điều đó. Cũng để ý các hằng số đã bị thay bằng <code>$1</code>: cùng một truy vấn với giá trị khác nhau được gom vào MỘT dòng, và chính điều đó làm các con số tổng có ý nghĩa.</div>

<h3>pg_stat_user_indexes — những chỉ mục KHÔNG AI dùng</h3>
<p>Chương 9 đã cảnh báo rằng một chỉ mục không ai dùng là chi phí thuần: nó làm chậm mọi lệnh ghi và chiếm đĩa mà chẳng giúp gì. Câu này tìm ra chúng:</p>
<pre><code><span class="tok-keyword">SELECT</span> relname, indexrelname, idx_scan,
       pg_size_pretty(pg_relation_size(indexrelid)) <span class="tok-keyword">AS</span> kich_thuoc
<span class="tok-keyword">FROM</span> pg_stat_user_indexes
<span class="tok-keyword">WHERE</span> idx_scan = 0
<span class="tok-keyword">ORDER BY</span> pg_relation_size(indexrelid) <span class="tok-keyword">DESC</span>;</code></pre>
<p><code>idx_scan = 0</code> nghĩa là nó chưa từng được dùng kể từ lần thống kê được reset gần nhất. Hai điều cần cẩn trọng trước khi xoá bất cứ thứ gì: các bộ đếm bị reset khi bạn chạy <code>pg_stat_reset()</code> hoặc khôi phục cơ sở dữ liệu, nên hãy kiểm <code>stats_reset</code> trong <code>pg_stat_database</code> trước; và một chỉ mục unique có thể tồn tại để THỰC THI một ràng buộc chứ không phải để tăng tốc truy vấn, nên một cái "không được dùng" vẫn có thể đang làm việc thiết yếu.</p>

<h3>Một danh sách ngắn đáng đặt cảnh báo</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Kết nối đang dùng so với <code>max_connections</code></span><span class="lz-d">Cảnh báo TRƯỚC 100% một quãng xa — ở 80% bạn vẫn còn thời gian để hành động (14.1).</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Tuổi của giao dịch già nhất</span><span class="lz-d"><code>max(now()-xact_start)</code>. Bắt được cái giao dịch kẹt đang chặn vacuum TRƯỚC khi nó gây bloat, chứ không phải sau.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Tỉ lệ dead tuple trên các bảng bận nhất</span><span class="lz-d">Từ bài 14.3. Tăng rồi ở lì trên cao nghĩa là autovacuum đang thua.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t"><code>age(datfrozenxid)</code></span><span class="lz-d">Bộ đếm wraparound. Nhàm chán suốt nhiều năm, rồi thành một sự cố — và đó CHÍNH LÀ lý do nó thuộc về một bảng điều khiển.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Tỉ lệ trúng cache</span><span class="lz-d"><code>SELECT sum(blks_hit)*100.0/sum(blks_hit+blks_read) FROM pg_stat_database;</code> — một cơ sở dữ liệu OLTP khoẻ nằm trên 99%. Tụt kéo dài nghĩa là tập dữ liệu làm việc đã thôi vừa với RAM.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — cài pg_stat_statements NGAY TRONG lúc đang có sự cố.</strong> Nó cần <code>shared_preload_libraries</code>, mà cái đó cần <strong>KHỞI ĐỘNG LẠI</strong> — nên đúng cái lúc bạn thèm dữ liệu nhất lại là lúc bạn không lấy được nó mà không làm sự cố tệ thêm, và ngay cả sau khi khởi động lại thì khung nhìn cũng bắt đầu từ RỖNG, chẳng ghi lại gì về chuyện vừa xảy ra. Hãy bật nó từ NGÀY ĐẦU, khi một lần khởi động lại chẳng tốn gì. Cùng logic đó áp cho <code>log_min_duration_statement</code> (ghi log mọi truy vấn chậm hơn, ví dụ, 500 ms) và <code>log_lock_waits</code>: cả hai đều rẻ, cả hai đều bật-rồi-quên, và cả hai đều trả lời những câu hỏi mà sau đó thì không thể trả lời được nữa. Thứ quan trắc bạn bật lên GIỮA đám cháy chỉ kể cho bạn nghe về đám cháy LẦN SAU.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: chạy một khối việc hỗn hợp, rồi tìm ra truy vấn đắt theo TỔNG thời gian</span><span class="lc-sub">Nhánh Code Lab tái hiện kết quả 51,1 ms so với 12,7 ms.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 14.5 ─────────────────────────── */
    {
      title: '14.5 — Chapter 14 quiz|||14.5 — Kiểm tra Chương 14',
      slug: 'postgresql-14-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Tám câu về giá kết nối, max_connections, chỉnh cỡ pool, PgBouncer transaction mode, ngưỡng autovacuum, wraparound, và đọc pg_stat_statements.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on connections, pooling and operations. Answer from memory; the questions follow the lesson order.</p>
<div class="callout ok">Aim for 7/8. The two that matter most in real work: why raising <code>max_connections</code> is the wrong fix (14.1), and why <code>pg_stat_statements</code> must be ordered by <code>total_exec_time</code> (14.4).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về kết nối, pool và vận hành. Trả lời bằng trí nhớ; các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Hai câu quan trọng nhất trong việc thật: vì sao TĂNG <code>max_connections</code> là cách sửa SAI (14.1), và vì sao <code>pg_stat_statements</code> phải sắp theo <code>total_exec_time</code> (14.4).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'PostgreSQL allocates what per client connection?|||PostgreSQL cấp phát cái gì cho mỗi kết nối client?',
            options: [
              'A lightweight thread|||Một luồng nhẹ',
              'A full operating-system PROCESS with its own memory — which is why connections are expensive and limited|||Một TIẾN TRÌNH đầy đủ của hệ điều hành với bộ nhớ riêng — và đó là lý do kết nối vừa đắt vừa bị giới hạn',
              'A shared buffer slot|||Một suất trong bộ đệm chung',
              'Nothing until a query runs|||Không gì cả cho tới khi có truy vấn chạy',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Measured: a query takes 0.186 ms reused, but 4.403 ms when a new connection is opened for it. What does that mean in practice?|||Đo được: một truy vấn tốn 0,186 ms khi tái dùng kết nối, nhưng 4,403 ms khi mở kết nối mới cho nó. Trong thực tế điều đó nghĩa là gì?',
            options: [
              'The query is badly written|||Truy vấn viết tệ',
              'About 96% of the time was connection setup, not work — so pooling (measured at 0.205 ms) is essentially free reuse|||Khoảng 96% thời gian là khâu thiết lập kết nối chứ không phải làm việc — nên dùng pool (đo được 0,205 ms) gần như là tái dùng miễn phí',
              'The server is misconfigured|||Máy chủ cấu hình sai',
              'New connections are always faster after warmup|||Kết nối mới luôn nhanh hơn sau khi khởi động',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Your app hits "sorry, too many clients already". Why is raising max_connections to 500 usually wrong?|||App của bạn gặp "sorry, too many clients already". Vì sao tăng max_connections lên 500 thường là SAI?',
            options: [
              'It requires a licence|||Nó cần giấy phép',
              'Every slot costs memory and each active backend can allocate work_mem — on a small VPS you trade a clean error for the OOM killer, and throughput FALLS past a few hundred backends|||Mỗi suất tốn bộ nhớ và mỗi backend đang hoạt động có thể cấp phát work_mem — trên một VPS nhỏ bạn đổi một lỗi sạch sẽ lấy OOM killer, và thông lượng còn GIẢM khi vượt vài trăm backend',
              'max_connections cannot be changed|||max_connections không đổi được',
              'It is right; always raise it|||Nó đúng; cứ tăng lên',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'cuongthai.com runs 12 client processes with pool size 10 against max_connections=100. What is the problem?|||cuongthai.com chạy 12 tiến trình client với pool cỡ 10 trên max_connections=100. Vấn đề là gì?',
            options: [
              'Nothing; pools are shared|||Không có gì; các pool dùng chung',
              '12 × 10 = 120 > 100 — the system is over-subscribed at rest and only survives because all 12 are rarely busy at once, so it fails during a traffic spike|||12 × 10 = 120 > 100 — hệ thống đã vượt mức ngay lúc đứng yên và chỉ sống được vì hiếm khi cả 12 cùng bận, nên nó hỏng đúng lúc lưu lượng tăng vọt',
              'The pool size should be 100|||Cỡ pool nên là 100',
              'Only the first process can connect|||Chỉ tiến trình đầu tiên kết nối được',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Behind PgBouncer in transaction mode, which of these stops working reliably?|||Đứng sau PgBouncer ở chế độ transaction, thứ nào sau đây thôi hoạt động đáng tin?',
            options: [
              'Ordinary SELECT statements|||Các câu SELECT thông thường',
              'Prepared statements, SET session variables, session-scoped advisory locks, temp tables and LISTEN/NOTIFY — anything held in SESSION state|||Prepared statement, biến phiên SET, advisory lock phạm vi phiên, bảng tạm và LISTEN/NOTIFY — mọi thứ giữ trong trạng thái PHIÊN',
              'Transactions|||Giao dịch',
              'Indexes|||Chỉ mục',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'With defaults, when does autovacuum first consider a 1,000,000-row table?|||Với các giá trị mặc định, autovacuum ngó tới một bảng 1.000.000 dòng lần đầu khi nào?',
            options: [
              'After 50 dead tuples|||Sau 50 dead tuple',
              'At 50 + 0.2 × 1,000,000 = 200,050 dead tuples — so it may bloat ~20% first; tune it per table with ALTER TABLE|||Ở mức 50 + 0,2 × 1.000.000 = 200.050 dead tuple — nên nó có thể phình ~20% trước đã; hãy chỉnh theo TỪNG BẢNG bằng ALTER TABLE',
              'Every 60 seconds regardless|||Cứ 60 giây một lần bất kể thế nào',
              'Only when you run VACUUM manually|||Chỉ khi bạn tự chạy VACUUM',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is transaction ID wraparound and what causes it?|||Transaction ID wraparound là gì và cái gì gây ra nó?',
            options: [
              'A replication feature|||Một tính năng nhân bản',
              'The 32-bit transaction counter wraps; VACUUM must freeze old rows first. If vacuum is blocked long enough — by a long transaction, an abandoned replication slot, or a prepared transaction — PostgreSQL REFUSES ALL WRITES|||Bộ đếm giao dịch 32 bit quay vòng; VACUUM phải đóng băng các dòng cũ trước. Nếu vacuum bị chặn đủ lâu — bởi một giao dịch dài, một replication slot bị bỏ rơi, hay một prepared transaction — PostgreSQL TỪ CHỐI MỌI LỆNH GHI',
              'A disk-full error|||Một lỗi đầy đĩa',
              'It only affects replicas|||Nó chỉ ảnh hưởng bản sao',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In pg_stat_statements a query with 2 calls shows 51.1 ms total; another with 5 calls shows 12.7 ms total. Which do you optimise, and which column should you sort by?|||Trong pg_stat_statements, một truy vấn 2 lượt gọi hiện 51,1 ms tổng; cái khác 5 lượt gọi hiện 12,7 ms tổng. Bạn tối ưu cái nào, và nên sắp theo cột nào?',
            options: [
              'The 5-call one; sort by calls|||Cái 5 lượt; sắp theo calls',
              'The 2-call one; sort by total_exec_time — it is the only column that captures real impact|||Cái 2 lượt; sắp theo total_exec_time — đó là cột duy nhất nắm được tác động thật',
              'Neither; sort by rows|||Không cái nào; sắp theo rows',
              'The one with the highest mean_exec_time, always|||Cái có mean_exec_time cao nhất, luôn luôn',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
