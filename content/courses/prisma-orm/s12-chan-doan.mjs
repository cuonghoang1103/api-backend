/**
 * Prisma ORM — Chương 12: Chẩn đoán, và đi tiếp về đâu.
 * Năm phút đầu · bảy hình dáng hỏng hóc và mã lỗi P· · bộ công cụ · giám sát · kết khoá · thi cuối.
 * Output CHẠY THẬT Prisma 6.x + PostgreSQL 16 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fprisma-orm%2Flearn&reflabel=Prisma';

export default {
  title: 'Chapter 12 — Diagnosing Prisma, and where to go next|||Chương 12 — Chẩn đoán Prisma, và đi tiếp về đâu',
  description: 'Mọi sự cố Prisma nghe giống nhau lúc bắt đầu: "cái API chết rồi". Chương này biến câu đó thành một quy trình phân loại có thứ tự, bảy hình dáng hỏng hóc phân biệt được bằng đúng mã lỗi và ba câu lệnh, một bộ công cụ chẩn đoán dùng được mà không làm mọi thứ tệ hơn, và một bảng giám sát đủ để biết trước. Rồi nó kết lại cả khoá học.',
  lessons: [
    /* ─────────────────────────── 12.1 ─────────────────────────── */
    {
      title: '12.1 — The first five minutes|||12.1 — Năm phút đầu tiên',
      slug: 'pr-12-1-nam-phut-dau',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Một quy trình phân loại có thứ tự: câu hỏi ĐẦU TIÊN không phải "lỗi gì" mà là "vừa có gì thay đổi"; bốn lệnh trả lời được 80% sự cố; và luật rằng bạn không được sửa bất cứ thứ gì cho tới khi biết mình đang ở nhánh nào.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.1</span>
<h2>The first five minutes</h2>
<p class="lead">Every Prisma incident starts the same way — someone says the API is broken — and the temptation is to start fixing. Five minutes of ordered triage beats an hour of guessing, and the order matters more than the commands: what changed, then what is failing, then why, and only then what to do about it.</p>

<h3>Question 0 — what changed?</h3>
<pre><code><span class="tok-comment"># Almost every incident has an answer here</span>
git log --oneline -10
docker inspect cuonghoangdev_backend --format '{{.Created}} {{.Config.Image}}'
npx prisma migrate status</code></pre>
<div class="out">27c31f2 courses(prisma): Chuong 11
ff0f92d courses(prisma): Chuong 10
2026-08-23T13:41:02Z ghcr.io/cuonghoang1103/cuongthaidev-backend:latest

1 migration found in prisma/migrations
Following migration have not yet been applied:
20260823140000_them_cot_diem            ← đây rồi</div>
<div class="callout ok">
<p><strong>A database that has been fine for weeks does not spontaneously break.</strong> Something moved: a deploy, a migration, a config change, a data volume crossing a threshold, a certificate expiring. Establishing <em>what</em> moved takes three commands and eliminates most of the search space. Skipping it is how people spend forty minutes tuning a connection pool that was never the problem.</p>
</div>

<h3>The triage order</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Is the process alive?</span><span class="lz-d"><code>docker ps</code>. A container in <code>Restarting</code> is Lesson 11.1 — the engine cannot load, or the client cannot construct. Nothing else matters until this is green, and no database query will tell you.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Can it reach the database?</span><span class="lz-d"><code>docker exec … node -e "…$queryRaw&#96;SELECT 1&#96;"</code>. This separates "Prisma is broken" from "the network is broken" from "the database is down" — three very different incidents that produce the same user report.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Is the schema current?</span><span class="lz-d"><code>prisma migrate status</code>. Pending migrations, a failed migration, drift. Lesson 11.3's window lives here, and the symptom is always "some endpoints work and some 500".</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Is it slow or is it failing?</span><span class="lz-d">Two completely different investigations. Failing → read the error code, Lesson 12.2. Slow → measure, Lesson 9.1. Deciding which one you are in is the single highest-value five seconds of the incident.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Everyone, or one user?</span><span class="lz-d">One user usually means data — a row that violates an assumption, a NULL where the code expects a value. Everyone means infrastructure or schema. The <code>where</code> clause of your investigation depends entirely on this answer.</span></div>
</div>

<h3>The four commands</h3>
<pre><code><span class="tok-comment"># 1. Is the container up, and for how long?</span>
docker ps -a --filter name=backend --format 'table {{.Status}}\\t{{.Image}}'</code></pre>
<div class="out">STATUS                    IMAGE
Up 4 minutes              ghcr.io/…/backend:latest      ← khoi dong lai 4 phut truoc</div>
<pre><code><span class="tok-comment"># 2. Can it talk to the database at all?</span>
docker exec cuonghoangdev_backend node -e \\
  "const{PrismaClient}=require('@prisma/client');const p=new PrismaClient();
   p.\\$queryRaw\\&#96;SELECT now()\\&#96;.then(r=&gt;console.log('OK',r)).catch(e=&gt;console.log('LOI',e.code,e.message.split('\\n')[0]))"</code></pre>
<div class="out">LOI P1001 Can't reach database server at &#96;postgres:5432&#96;</div>
<pre><code><span class="tok-comment"># 3. What is the database itself doing?</span>
psql "$DATABASE_URL" -c "SELECT state, count(*) FROM pg_stat_activity
                         WHERE datname = current_database() GROUP BY state;"</code></pre>
<div class="out">        state        | count
---------------------+-------
 idle                |    97
 active              |     3               ← 100 ket noi, max_connections = 100</div>
<pre><code><span class="tok-comment"># 4. What did the app log at the moment it broke?</span>
docker logs cuonghoangdev_backend --since 15m 2&gt;&amp;1 | grep -iE 'prisma|P[0-9]{4}|error' | head -30</code></pre>
<div class="out">[13:41:07] PrismaClientInitializationError: P1001
[13:41:09] PrismaClientKnownRequestError: P2024 Timed out fetching a new
           connection from the connection pool (pool_timeout=10)
[13:41:09] … x 214</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Read the error code, not the sentence</span><span class="lz-lnote">Prisma's messages are written for a developer at a terminal; the code is written for you at 2am. <code>P1001</code>, <code>P2002</code>, <code>P2024</code>, <code>P3009</code> each mean exactly one thing, and Lesson 12.2 is the table.</span></div>
  <div class="lz-layer"><span class="lz-lname">Read the FIRST error, not the loudest</span><span class="lz-lnote">The log above has 214 <code>P2024</code>s and one <code>P1001</code>. The pool timeouts are the <em>consequence</em>: the database went away, connections could not be established, requests queued for a connection that never came. Fixing pool timeouts here would be fixing a symptom.</span></div>
  <div class="lz-layer"><span class="lz-lname">Note the time, and compare it to the deploy</span><span class="lz-lnote">Four minutes of uptime and errors starting at 13:41 is one story; six days of uptime and errors starting at 13:41 is a completely different one. The container's <code>Created</code> timestamp is the cheapest correlation you will get.</span></div>
  <div class="lz-layer"><span class="lz-lname">Do not restart yet</span><span class="lz-lnote">A restart clears the evidence: the connection state, the in-memory metrics, the log context. It also "fixes" about a third of incidents temporarily, which is exactly why it is so tempting and so expensive — the same thing happens again in six hours with no more information than the first time.</span></div>
</div>

<h3>What not to do, in order of how much it costs</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">❌ <code>prisma migrate reset</code></span><span class="v">Deletes every row. There is no incident this is the answer to. It exists for a developer's local database and the word "production" should never appear in the same terminal session.</span></div>
  <div class="kv"><span class="k">❌ <code>prisma db push</code> against production</span><span class="v">Makes the database match the schema file with no migration record, so the history and the database silently disagree from then on. Every future <code>migrate deploy</code> is now unpredictable.</span></div>
  <div class="kv"><span class="k">❌ <code>migrate resolve</code> on a failed migration</span><span class="v">Marking a partially-applied migration as applied hides which statements ran. Read the migration, check the database, decide with a human — Lesson 12.2 has the procedure.</span></div>
  <div class="kv"><span class="k">❌ Raising <code>pool_timeout</code> because you see <code>P2024</code></span><span class="v">It converts fast failures into slow ones and pushes the queue further up the stack. <code>P2024</code> is a symptom of something holding connections; find that, per Lesson 9.4.</span></div>
</div>
<div class="note-ct">
<p><strong>The habit that shortens every incident: write the timeline as you go.</strong> Three lines in a scratch file — <em>13:41 container restarted · 13:41 P1001 begins · 13:47 postgres container OOM in dmesg</em> — and the cause is usually visible before you have finished writing it. It also means the post-mortem is already half-written, and the next person who sees the same symptom finds a document instead of a memory. Every incident in this course's case studies was reconstructed from exactly that kind of note.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/error-reference" target="_blank" rel="noopener"><span class="lc-ico">🔢</span><span class="lc-body"><span class="lc-title">Prisma — error reference</span><span class="lc-sub">prisma.io/docs · Every P-code, with the condition that produces it</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/monitoring-stats.html" target="_blank" rel="noopener"><span class="lc-ico">📊</span><span class="lc-body"><span class="lc-title">PostgreSQL — the statistics views</span><span class="lc-sub">postgresql.org · pg_stat_activity and friends, the first place to look</span></span></a>
<a class="link-card" href="https://sre.google/sre-book/effective-troubleshooting/" target="_blank" rel="noopener"><span class="lc-ico">🧭</span><span class="lc-body"><span class="lc-title">Google SRE — effective troubleshooting</span><span class="lc-sub">sre.google · The general method this lesson is a Prisma-shaped instance of</span></span></a>
<a class="link-card" href="/courses/linux-bash/learn${REF}"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">CuongThai course — Linux &amp; Bash</span><span class="lc-sub">Reading logs, dmesg and process state when the container is the suspect</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Four broken deployments, one triage checklist, five minutes each</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.1</span>
<h2>Năm phút đầu tiên</h2>
<p class="lead">Mọi sự cố Prisma đều bắt đầu giống hệt nhau — có người bảo API hỏng rồi — và cám dỗ là lao vào sửa. Năm phút phân loại CÓ THỨ TỰ thắng một tiếng đoán mò, và cái THỨ TỰ còn quan trọng hơn cả các câu lệnh: vừa có gì thay đổi, rồi cái gì đang hỏng, rồi vì sao, và chỉ tới lúc đó mới tính làm gì với nó.</p>

<h3>Câu hỏi số 0 — vừa có gì thay đổi?</h3>
<pre><code><span class="tok-comment"># Gần như mọi sự cố đều có câu trả lời ở đây</span>
git log --oneline -10
docker inspect cuonghoangdev_backend --format '{{.Created}} {{.Config.Image}}'
npx prisma migrate status</code></pre>
<div class="out">27c31f2 courses(prisma): Chuong 11
ff0f92d courses(prisma): Chuong 10
2026-08-23T13:41:02Z ghcr.io/cuonghoang1103/cuongthaidev-backend:latest

1 migration found in prisma/migrations
Following migration have not yet been applied:
20260823140000_them_cot_diem            ← đây rồi</div>
<div class="callout ok">
<p><strong>Một cơ sở dữ liệu chạy êm hàng tuần thì không TỰ NHIÊN hỏng.</strong> Có thứ gì đó đã dịch chuyển: một lần deploy, một migration, một thay đổi cấu hình, một khối dữ liệu vượt qua ngưỡng, một chứng chỉ hết hạn. Xác định thứ ĐÃ dịch chuyển tốn ba câu lệnh và loại bỏ phần lớn không gian tìm kiếm. Bỏ qua nó chính là cách người ta ngồi bốn mươi phút chỉnh một cái connection pool vốn chưa từng là vấn đề.</p>
</div>

<h3>Thứ tự phân loại</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Tiến trình còn sống không?</span><span class="lz-d"><code>docker ps</code>. Một container đang <code>Restarting</code> là Bài 11.1 — engine không nạp được, hoặc client không dựng được. Chưa xanh cái này thì không gì khác quan trọng, và sẽ không có truy vấn cơ sở dữ liệu nào nói cho bạn biết.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Nó với tới cơ sở dữ liệu được không?</span><span class="lz-d"><code>docker exec … node -e "…$queryRaw&#96;SELECT 1&#96;"</code>. Cái này tách "Prisma hỏng" khỏi "mạng hỏng" khỏi "cơ sở dữ liệu chết" — ba sự cố rất khác nhau mà cùng cho ra một lời than của người dùng.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Lược đồ đã mới chưa?</span><span class="lz-d"><code>prisma migrate status</code>. Migration còn chờ, migration đã thất bại, trôi dạt. Cái cửa sổ của Bài 11.3 sống ở đây, và triệu chứng luôn là "vài endpoint chạy, vài cái 500".</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Nó CHẬM hay nó HỎNG?</span><span class="lz-d">Hai cuộc điều tra hoàn toàn khác nhau. Hỏng → đọc mã lỗi, Bài 12.2. Chậm → đo, Bài 9.1. Quyết định mình đang ở nhánh nào là năm giây có giá trị nhất của cả sự cố.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Mọi người, hay MỘT người?</span><span class="lz-d">Một người thường nghĩa là DỮ LIỆU — một hàng vi phạm giả định, một NULL ở chỗ mã chờ một giá trị. Mọi người nghĩa là hạ tầng hoặc lược đồ. Mệnh đề <code>where</code> của cuộc điều tra phụ thuộc hoàn toàn vào câu trả lời này.</span></div>
</div>

<h3>Bốn câu lệnh</h3>
<pre><code><span class="tok-comment"># 1. Container có chạy không, và chạy được bao lâu rồi?</span>
docker ps -a --filter name=backend --format 'table {{.Status}}\\t{{.Image}}'</code></pre>
<div class="out">STATUS                    IMAGE
Up 4 minutes              ghcr.io/…/backend:latest      ← khoi dong lai 4 phut truoc</div>
<pre><code><span class="tok-comment"># 2. Nó có nói chuyện được với cơ sở dữ liệu không?</span>
docker exec cuonghoangdev_backend node -e \\
  "const{PrismaClient}=require('@prisma/client');const p=new PrismaClient();
   p.\\$queryRaw\\&#96;SELECT now()\\&#96;.then(r=&gt;console.log('OK',r)).catch(e=&gt;console.log('LOI',e.code,e.message.split('\\n')[0]))"</code></pre>
<div class="out">LOI P1001 Can't reach database server at &#96;postgres:5432&#96;</div>
<pre><code><span class="tok-comment"># 3. Bản thân cơ sở dữ liệu đang làm gì?</span>
psql "$DATABASE_URL" -c "SELECT state, count(*) FROM pg_stat_activity
                         WHERE datname = current_database() GROUP BY state;"</code></pre>
<div class="out">        state        | count
---------------------+-------
 idle                |    97
 active              |     3               ← 100 ket noi, max_connections = 100</div>
<pre><code><span class="tok-comment"># 4. Ứng dụng ghi gì vào nhật ký ĐÚNG lúc nó hỏng?</span>
docker logs cuonghoangdev_backend --since 15m 2&gt;&amp;1 | grep -iE 'prisma|P[0-9]{4}|error' | head -30</code></pre>
<div class="out">[13:41:07] PrismaClientInitializationError: P1001
[13:41:09] PrismaClientKnownRequestError: P2024 Timed out fetching a new
           connection from the connection pool (pool_timeout=10)
[13:41:09] … x 214</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Đọc MÃ LỖI, đừng đọc câu văn</span><span class="lz-lnote">Thông báo của Prisma viết cho một lập trình viên đang ngồi trước terminal; cái MÃ thì viết cho bạn lúc hai giờ sáng. <code>P1001</code>, <code>P2002</code>, <code>P2024</code>, <code>P3009</code> mỗi cái nghĩa đúng một thứ, và Bài 12.2 chính là cái bảng đó.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đọc lỗi ĐẦU TIÊN, đừng đọc lỗi ỒN NHẤT</span><span class="lz-lnote">Nhật ký ở trên có 214 cái <code>P2024</code> và một cái <code>P1001</code>. Đám timeout pool là HỆ QUẢ: cơ sở dữ liệu biến mất, không mở được kết nối, request xếp hàng chờ một kết nối không bao giờ tới. Sửa timeout pool ở đây là sửa triệu chứng.</span></div>
  <div class="lz-layer"><span class="lz-lname">Ghi lại GIỜ, rồi so với lần deploy</span><span class="lz-lnote">Bốn phút uptime và lỗi bắt đầu lúc 13:41 là một câu chuyện; sáu ngày uptime và lỗi bắt đầu lúc 13:41 là một câu chuyện HOÀN TOÀN khác. Dấu thời gian <code>Created</code> của container là mối tương quan rẻ nhất bạn có được.</span></div>
  <div class="lz-layer"><span class="lz-lname">ĐỪNG khởi động lại vội</span><span class="lz-lnote">Khởi động lại xoá sạch bằng chứng: trạng thái kết nối, chỉ số trong bộ nhớ, ngữ cảnh nhật ký. Nó cũng "chữa" được chừng một phần ba sự cố TẠM THỜI, và đó chính xác là lý do nó vừa cám dỗ vừa đắt đỏ — cùng chuyện đó lặp lại sau sáu tiếng, với đúng lượng thông tin của lần đầu.</span></div>
</div>

<h3>Những việc KHÔNG được làm, xếp theo mức độ tốn kém</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">❌ <code>prisma migrate reset</code></span><span class="v">Xoá SẠCH mọi hàng. Không có sự cố nào mà đây là câu trả lời. Nó tồn tại cho cơ sở dữ liệu tại máy của lập trình viên, và chữ "production" không bao giờ nên xuất hiện trong cùng một phiên terminal.</span></div>
  <div class="kv"><span class="k">❌ <code>prisma db push</code> lên production</span><span class="v">Ép cơ sở dữ liệu khớp với file lược đồ mà KHÔNG ghi lại migration nào, nên từ đó trở đi lịch sử và cơ sở dữ liệu lặng lẽ bất đồng. Mọi lần <code>migrate deploy</code> về sau đều không đoán trước được.</span></div>
  <div class="kv"><span class="k">❌ <code>migrate resolve</code> lên một migration đã thất bại</span><span class="v">Đánh dấu một migration áp dở dang là "đã áp" sẽ che mất chuyện câu lệnh nào đã chạy. Hãy ĐỌC migration, KIỂM cơ sở dữ liệu, và quyết định cùng một con người — Bài 12.2 có quy trình.</span></div>
  <div class="kv"><span class="k">❌ Nâng <code>pool_timeout</code> vì thấy <code>P2024</code></span><span class="v">Nó biến những cú hỏng nhanh thành hỏng chậm và đẩy hàng đợi lên cao hơn trong ngăn xếp. <code>P2024</code> là TRIỆU CHỨNG của thứ gì đó đang giữ kết nối; hãy đi tìm thứ đó, theo Bài 9.4.</span></div>
</div>
<div class="note-ct">
<p><strong>Thói quen rút ngắn MỌI sự cố: viết dòng thời gian NGAY TRONG LÚC làm.</strong> Ba dòng trong một file nháp — <em>13:41 container khởi động lại · 13:41 P1001 bắt đầu · 13:47 container postgres bị OOM trong dmesg</em> — và nguyên nhân thường lộ ra trước khi bạn viết xong. Nó cũng có nghĩa là bản mổ xẻ sau sự cố đã viết xong một nửa, và người tiếp theo gặp cùng triệu chứng sẽ tìm thấy một tài liệu thay vì một ký ức. Mọi sự cố trong các nghiên cứu tình huống của khoá này đều được dựng lại từ đúng loại ghi chú ấy.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/error-reference" target="_blank" rel="noopener"><span class="lc-ico">🔢</span><span class="lc-body"><span class="lc-title">Prisma — tra cứu mã lỗi</span><span class="lc-sub">prisma.io/docs · Mọi mã P, kèm điều kiện sinh ra nó</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/monitoring-stats.html" target="_blank" rel="noopener"><span class="lc-ico">📊</span><span class="lc-body"><span class="lc-title">PostgreSQL — các khung nhìn thống kê</span><span class="lc-sub">postgresql.org · pg_stat_activity và họ hàng, chỗ nhìn đầu tiên</span></span></a>
<a class="link-card" href="https://sre.google/sre-book/effective-troubleshooting/" target="_blank" rel="noopener"><span class="lc-ico">🧭</span><span class="lc-body"><span class="lc-title">Google SRE — gỡ rối hiệu quả</span><span class="lc-sub">sre.google · Phương pháp tổng quát mà bài này là một hiện thân hình-dạng-Prisma của nó</span></span></a>
<a class="link-card" href="/courses/linux-bash/learn${REF}"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Linux &amp; Bash</span><span class="lc-sub">Đọc nhật ký, dmesg và trạng thái tiến trình khi container là nghi phạm</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Bốn bản triển khai hỏng, một danh sách phân loại, mỗi cái năm phút</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 12.2 ─────────────────────────── */
    {
      title: '12.2 — Seven failure shapes, told apart by their code|||12.2 — Bảy hình dáng hỏng hóc, phân biệt bằng mã lỗi',
      slug: 'pr-12-2-bay-hinh-dang',
      type: 'LESSON',
      description: 'Từ P1001 tới P3018: bảy nhóm hỏng hóc, mỗi nhóm có một nguyên nhân gốc và một hành động khác hẳn nhau. Kèm quy trình cho migration thất bại — cái nhóm duy nhất mà việc tự động sửa có thể phá hỏng dữ liệu vĩnh viễn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.2</span>
<h2>Seven failure shapes, told apart by their code</h2>
<p class="lead">Prisma's error codes are the most underused diagnostic tool in the stack. Each one names a specific condition, and grouping them into seven shapes turns "the API is throwing errors" into a decision you can make in about ten seconds. Six of the seven have a mechanical fix; the seventh is the one where doing something is worse than doing nothing.</p>

<h3>Shape 1 — it never started</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>P1000</code> Authentication failed</span><span class="v">Wrong user or password in <code>DATABASE_URL</code>. Usually a deploy that picked up a stale env file, or a password rotated in the database but not in <code>/opt/cuonghoangdev/.env</code>.</span></div>
  <div class="kv"><span class="k"><code>P1001</code> Can't reach database server</span><span class="v">DNS, network, or the database is not running. From inside the container: <code>getent hosts postgres</code> then <code>nc -zv postgres 5432</code>. It is almost never Prisma.</span></div>
  <div class="kv"><span class="k"><code>P1003</code> Database does not exist</span><span class="v">The URL points at a database name that was never created — common on a fresh VPS or after a volume was recreated. Note that the volume being recreated also means the data is gone.</span></div>
  <div class="kv"><span class="k">Engine load error / "did not initialize yet"</span><span class="v">Lesson 11.1 and 11.2: the wrong <code>binaryTargets</code>, or <code>prisma generate</code> never ran in the image. The container restart-loops and the deploy reports success.</span></div>
</div>

<h3>Shape 2 — the data said no</h3>
<pre><code>await prisma.user.create({ data: { email: 'an@vidu.com', username: 'an' } });</code></pre>
<div class="out">PrismaClientKnownRequestError: P2002
Unique constraint failed on the fields: (&#96;email&#96;)
meta: { target: [ 'email' ] }</div>
<pre><code><span class="tok-comment">// Handle it, do not pre-check it</span>
try {
  return await prisma.user.create({ data });
} catch (e) {
  if (e instanceof Prisma.PrismaClientKnownRequestError &amp;&amp; e.code === 'P2002') {
    const cot = (e.meta?.target as string[])?.join(', ') ?? 'khong ro';
    throw new HttpError(409, &#96;\${cot} da ton tai&#96;);
  }
  throw e;
}</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k"><code>P2002</code></span><span class="lz-t">Unique constraint</span><span class="lz-d">A duplicate. <code>e.meta.target</code> names the columns, which is what turns a 500 into a useful 409. On a soft-deleted row this is Lesson 10.5's partial-index problem, not a real duplicate.</span></div>
  <div class="lz-step"><span class="lz-k"><code>P2003</code></span><span class="lz-t">Foreign key constraint</span><span class="lz-d">Pointing at a parent that does not exist, or deleting a parent whose children have <code>onDelete: Restrict</code>. <code>e.meta.field_name</code> tells you which relation.</span></div>
  <div class="lz-step"><span class="lz-k"><code>P2000</code> / <code>P2011</code></span><span class="lz-t">Too long / null in a NOT NULL</span><span class="lz-d">A <code>VarChar(255)</code> receiving 300 characters, or a required field arriving as <code>undefined</code> from an API body that was never validated. Validate at the edge and these stop existing.</span></div>
  <div class="lz-step"><span class="lz-k">The pattern</span><span class="lz-t">Catch, do not check</span><span class="lz-d">"Query first, then insert if absent" is a race: two requests both see nothing and both insert. Let the constraint decide and catch <code>P2002</code> — the database is the only thing that can answer atomically.</span></div>
</div>

<h3>Shape 3 — the row was not there</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>P2025</code> Record not found</span><span class="v">From <code>update</code>, <code>delete</code>, or <code>findUniqueOrThrow</code>. Usually a legitimate 404 — but if it appears in bursts, suspect a soft-delete filter or a tenant scope that changed.</span></div>
  <div class="kv"><span class="k"><code>P2018</code> Required connected records not found</span><span class="v">A nested <code>connect</code> pointing at an id that does not exist. Common when a client sends a stale id after a delete.</span></div>
  <div class="kv"><span class="k"><code>null</code> from <code>findUnique</code></span><span class="v">Not an error at all, which is the danger: the code carries on and fails three lines later on <code>.email</code> of <code>null</code>. Use <code>findUniqueOrThrow</code> where absence is genuinely impossible.</span></div>
  <div class="kv"><span class="k">Zero rows from <code>updateMany</code></span><span class="v">Silently returns <code>{ count: 0 }</code>. If the update was supposed to happen, nothing tells you it did not — check the count when it matters.</span></div>
</div>

<h3>Shape 4 — the pool ran out</h3>
<div class="out">P2024 Timed out fetching a new connection from the connection pool.
More info: http://pris.ly/d/connection-pool
(Current connection pool timeout: 10, connection limit: 33)</div>
<pre><code><span class="tok-comment">-- The question P2024 is really asking: who is holding them?</span>
SELECT state, count(*), max(now() - state_change)::interval(0) AS lau_nhat
FROM pg_stat_activity WHERE datname = current_database()
GROUP BY state ORDER BY 2 DESC;</code></pre>
<div class="out">        state        | count |  lau_nhat
---------------------+-------+-----------
 idle in transaction |    28 | 00:06:44    ← đây
 idle                |     4 | 00:00:12
 active              |     1 | 00:00:00</div>
<div class="callout warn">
<p><strong>Twenty-eight connections stuck in <code>idle in transaction</code> is never a pool-size problem.</strong> It is Lesson 7.1: an interactive <code>$transaction</code> doing an HTTP call, a file upload, or an AI request while holding a transaction open. Raising <code>connection_limit</code> buys minutes and makes the eventual failure bigger. The fix is to move the slow work outside the transaction — and <code>idle_in_transaction_session_timeout</code> is the backstop that turns a silent hang into a loud error.</p>
</div>

<h3>Shape 5 — the transaction gave up</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>P2028</code> Transaction API error</span><span class="v">Usually "Transaction already closed": the interactive transaction exceeded its <code>timeout</code> (5s by default) and everything after that point runs outside it. Raise <code>timeout</code> only after checking why it is slow.</span></div>
  <div class="kv"><span class="k"><code>P2034</code> Write conflict or deadlock</span><span class="v">Two transactions touching the same rows in opposite orders, or a serialisation failure under <code>Serializable</code>. This one is <em>expected</em> — retry with backoff, as Lesson 7.5 describes. It is not a bug unless the rate is climbing.</span></div>
  <div class="kv"><span class="k"><code>P1017</code> Server has closed the connection</span><span class="v">The database or a pooler dropped it: an idle timeout, a failover, a restart, or PgBouncer killing a session. Prisma reconnects, but any in-flight transaction is lost.</span></div>
  <div class="kv"><span class="k">Deadlocks in the PostgreSQL log</span><span class="v"><code>deadlock detected</code> in the server log names both statements and the exact lock cycle. That is far more useful than the Prisma-side error, and it is the first place to look when <code>P2034</code> repeats.</span></div>
</div>

<h3>Shape 6 — the migration failed</h3>
<div class="out">P3009 migrate found failed migrations in the target database

The &#96;20260823140000_them_cot_diem&#96; migration started at 2026-08-23 14:00:03 UTC
failed with: ERROR: column "diem" of relation "SocialPost" already exists

Prisma Migrate will not apply any further migrations until this is resolved.</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">STOP. Do not auto-fix.</span><span class="lz-lnote">This is the one shape where the obvious command makes things permanently worse. <code>migrate resolve --applied</code> on a partially-applied migration tells Prisma the whole file ran when only some of it did, and every later migration is then built on a false assumption.</span></div>
  <div class="lz-layer"><span class="lz-lname">1 — Read the migration file</span><span class="lz-lnote">Which statement failed, and which ones ran before it? Prisma applies the file inside a transaction on PostgreSQL, so usually nothing was committed — but a migration containing <code>COMMIT</code>, or one run through a tool that split it, may have applied partially.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 — Check the database against the history</span><span class="lz-lnote"><code>npx prisma migrate diff --from-migrations ./prisma/migrations --to-database-url "$DATABASE_URL" --script</code>. This is the ground truth: what the database has that the history does not, and vice versa.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 — Report, then decide with a human</span><span class="lz-lnote">The exact error, the migration name, whether it applied partially, and a proposed fix. Then act. On production, this step is not optional — auto-resolving a partially applied migration can silently corrupt schema and data, and it is on this codebase's forbidden list for exactly that reason.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>P3006</code> is different — it is the shadow database</span><span class="lz-lnote">A shadow-database failure never touched production; it means a past migration cannot replay from scratch. On this repository that is permanent: <code>20260706130000_add_music_and_profile</code> creates a unique constraint and an index with the same name. Already deployed, so it must not be edited — which is why migrations here are hand-written and applied with <code>migrate deploy</code>.</span></div>
</div>

<h3>Shape 7 — nothing is failing</h3>
<pre><code><span class="tok-comment">// No error. The wrong answer.</span>
const bai = await prisma.socialPost.findMany({ where: { authorId } });
<span class="tok-comment">// → includes soft-deleted rows, because this is a raw-ish path</span>
<span class="tok-comment">//   the extension does not cover, or an include that bypasses it</span></code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Slow, not broken</span><span class="lz-t">Chapter 9</span><span class="lz-d">Latency rising, no errors, CPU on the database climbing. Measure first: rank by <code>count × duration</code>, then look at the plan. Do not tune the pool.</span></div>
  <div class="lz-step"><span class="lz-k">Wrong rows</span><span class="lz-t">A missing filter</span><span class="lz-d">Soft-deleted rows appearing, another tenant's data, an <code>include</code> the extension does not reach. Lesson 10.5's three gaps are the checklist.</span></div>
  <div class="lz-step"><span class="lz-k">Wrong times</span><span class="lz-t">Timezones</span><span class="lz-d">Everything is UTC in the database and <code>Date</code> in JavaScript is UTC too — until something formats it with the server's locale. "Off by seven hours" is never a Prisma bug.</span></div>
  <div class="lz-step"><span class="lz-k">Wrong numbers</span><span class="lz-t">Decimal and BigInt</span><span class="lz-d">Lesson 10.2: <code>Decimal + number</code> concatenates, <code>count(*)</code> is a BigInt. Both produce plausible wrong values rather than errors, which is why they survive review.</span></div>
  <div class="lz-step"><span class="lz-k">"It was working yesterday"</span><span class="lz-t">Back to 12.1</span><span class="lz-d">Something changed. The absence of an error does not mean the absence of a deploy.</span></div>
</div>
<div class="note-ct">
<p><strong>Keep this table where the on-call person can find it.</strong> A one-page mapping from code to shape to action — pinned in the team channel, or a file at the repository root — is worth more at 2am than any amount of documentation nobody can find. The only line that must be exact is shape 6: <em>a failed migration is reported, never auto-resolved.</em> Everything else can be re-derived under pressure; that one cannot be undone.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/error-reference" target="_blank" rel="noopener"><span class="lc-ico">🔢</span><span class="lc-body"><span class="lc-title">Prisma — error reference</span><span class="lc-sub">prisma.io/docs · The authoritative list: every P-code and its meta fields</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/workflows/patching-and-hotfixing" target="_blank" rel="noopener"><span class="lc-ico">🩹</span><span class="lc-body"><span class="lc-title">Prisma — failed migrations</span><span class="lc-sub">prisma.io/docs · The official procedure, and what resolve actually does</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/errcodes-appendix.html" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — error codes</span><span class="lc-sub">postgresql.org · The SQLSTATE behind each Prisma code, when you need more detail</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/debugging-and-troubleshooting/handling-exceptions-and-errors" target="_blank" rel="noopener"><span class="lc-ico">🎣</span><span class="lc-body"><span class="lc-title">Prisma — handling errors</span><span class="lc-sub">prisma.io/docs · The error classes, and narrowing them in TypeScript</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Seven broken states, one code each — name the shape before you read the fix</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.2</span>
<h2>Bảy hình dáng hỏng hóc, phân biệt bằng mã lỗi</h2>
<p class="lead">Mã lỗi của Prisma là công cụ chẩn đoán ÍT được dùng nhất trong cả ngăn xếp. Mỗi mã gọi tên một điều kiện cụ thể, và gom chúng thành bảy hình dáng biến "API đang ném lỗi" thành một quyết định bạn ra được trong chừng mười giây. Sáu trên bảy có cách vá máy móc; cái thứ bảy là chỗ mà LÀM GÌ ĐÓ còn tệ hơn không làm gì.</p>

<h3>Hình dáng 1 — nó chưa từng khởi động được</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>P1000</code> Xác thực thất bại</span><span class="v">Sai user hoặc mật khẩu trong <code>DATABASE_URL</code>. Thường là một lần deploy vớ phải file env cũ, hoặc mật khẩu đã xoay trong cơ sở dữ liệu mà chưa xoay trong <code>/opt/cuonghoangdev/.env</code>.</span></div>
  <div class="kv"><span class="k"><code>P1001</code> Không với tới máy chủ</span><span class="v">DNS, mạng, hoặc cơ sở dữ liệu không chạy. Từ bên trong container: <code>getent hosts postgres</code> rồi <code>nc -zv postgres 5432</code>. Gần như không bao giờ là lỗi Prisma.</span></div>
  <div class="kv"><span class="k"><code>P1003</code> Cơ sở dữ liệu không tồn tại</span><span class="v">URL trỏ tới một tên cơ sở dữ liệu chưa từng được tạo — hay gặp trên VPS mới hoặc sau khi một volume bị tạo lại. Lưu ý: volume bị tạo lại cũng có nghĩa là DỮ LIỆU đã mất.</span></div>
  <div class="kv"><span class="k">Lỗi nạp engine / "did not initialize yet"</span><span class="v">Bài 11.1 và 11.2: sai <code>binaryTargets</code>, hoặc <code>prisma generate</code> chưa từng chạy trong ảnh. Container quay vòng khởi động lại còn deploy thì báo thành công.</span></div>
</div>

<h3>Hình dáng 2 — dữ liệu nói KHÔNG</h3>
<pre><code>await prisma.user.create({ data: { email: 'an@vidu.com', username: 'an' } });</code></pre>
<div class="out">PrismaClientKnownRequestError: P2002
Unique constraint failed on the fields: (&#96;email&#96;)
meta: { target: [ 'email' ] }</div>
<pre><code><span class="tok-comment">// Hãy BẮT nó, đừng kiểm trước</span>
try {
  return await prisma.user.create({ data });
} catch (e) {
  if (e instanceof Prisma.PrismaClientKnownRequestError &amp;&amp; e.code === 'P2002') {
    const cot = (e.meta?.target as string[])?.join(', ') ?? 'khong ro';
    throw new HttpError(409, &#96;\${cot} da ton tai&#96;);
  }
  throw e;
}</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k"><code>P2002</code></span><span class="lz-t">Ràng buộc duy nhất</span><span class="lz-d">Một bản trùng. <code>e.meta.target</code> gọi tên các cột, và đó chính là thứ biến một lỗi 500 thành một mã 409 hữu ích. Nếu vướng vào một hàng đã xoá mềm thì đây là bài toán chỉ-mục-từng-phần của Bài 10.5, không phải trùng thật.</span></div>
  <div class="lz-step"><span class="lz-k"><code>P2003</code></span><span class="lz-t">Ràng buộc khoá ngoại</span><span class="lz-d">Trỏ tới một cha không tồn tại, hoặc xoá một cha có con mang <code>onDelete: Restrict</code>. <code>e.meta.field_name</code> nói cho bạn biết quan hệ nào.</span></div>
  <div class="lz-step"><span class="lz-k"><code>P2000</code> / <code>P2011</code></span><span class="lz-t">Quá dài / null vào cột NOT NULL</span><span class="lz-d">Một <code>VarChar(255)</code> nhận 300 ký tự, hoặc một trường bắt buộc tới nơi dưới dạng <code>undefined</code> từ một body API chưa từng được kiểm. Kiểm ở BIÊN thì mấy cái này thôi tồn tại.</span></div>
  <div class="lz-step"><span class="lz-k">Nguyên tắc</span><span class="lz-t">BẮT lỗi, đừng KIỂM trước</span><span class="lz-d">"Truy vấn trước, chưa có thì chèn" là một cuộc đua: hai request cùng thấy trống và cùng chèn. Hãy để ràng buộc quyết định rồi bắt <code>P2002</code> — cơ sở dữ liệu là thứ DUY NHẤT trả lời được một cách nguyên tử.</span></div>
</div>

<h3>Hình dáng 3 — không có hàng nào ở đó</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>P2025</code> Không tìm thấy bản ghi</span><span class="v">Từ <code>update</code>, <code>delete</code>, hoặc <code>findUniqueOrThrow</code>. Thường là một mã 404 chính đáng — nhưng nếu nó tới thành TỪNG CHÙM thì hãy nghi một bộ lọc soft delete hoặc một phạm vi tenant vừa đổi.</span></div>
  <div class="kv"><span class="k"><code>P2018</code> Thiếu bản ghi cần nối</span><span class="v">Một <code>connect</code> lồng nhau trỏ tới một id không tồn tại. Hay gặp khi client gửi lên một id cũ sau một lần xoá.</span></div>
  <div class="kv"><span class="k"><code>null</code> từ <code>findUnique</code></span><span class="v">Không phải lỗi gì cả, và đó mới là chỗ nguy: mã chạy tiếp rồi chết ba dòng sau ở <code>.email</code> của <code>null</code>. Dùng <code>findUniqueOrThrow</code> ở chỗ mà sự vắng mặt là THẬT SỰ bất khả thi.</span></div>
  <div class="kv"><span class="k">Không hàng nào từ <code>updateMany</code></span><span class="v">Lặng lẽ trả về <code>{ count: 0 }</code>. Nếu lệnh cập nhật đó LẼ RA phải xảy ra thì chẳng có gì báo cho bạn biết nó đã không xảy ra — hãy kiểm cái count ở những chỗ điều đó quan trọng.</span></div>
</div>

<h3>Hình dáng 4 — pool đã cạn</h3>
<div class="out">P2024 Timed out fetching a new connection from the connection pool.
More info: http://pris.ly/d/connection-pool
(Current connection pool timeout: 10, connection limit: 33)</div>
<pre><code><span class="tok-comment">-- Câu hỏi P2024 THẬT SỰ đang đặt ra: ai đang giữ chúng?</span>
SELECT state, count(*), max(now() - state_change)::interval(0) AS lau_nhat
FROM pg_stat_activity WHERE datname = current_database()
GROUP BY state ORDER BY 2 DESC;</code></pre>
<div class="out">        state        | count |  lau_nhat
---------------------+-------+-----------
 idle in transaction |    28 | 00:06:44    ← đây
 idle                |     4 | 00:00:12
 active              |     1 | 00:00:00</div>
<div class="callout warn">
<p><strong>Hai mươi tám kết nối kẹt ở <code>idle in transaction</code> KHÔNG BAO GIỜ là vấn đề kích thước pool.</strong> Đó là Bài 7.1: một <code>$transaction</code> tương tác đang gọi HTTP, đang tải file, hay đang gọi AI trong khi vẫn ôm một giao dịch mở. Nâng <code>connection_limit</code> mua thêm được vài phút và làm cú hỏng cuối cùng to hơn. Cách vá là ĐƯA việc chậm ra NGOÀI giao dịch — và <code>idle_in_transaction_session_timeout</code> là lưới đỡ biến một cú treo im lặng thành một lỗi ồn ào.</p>
</div>

<h3>Hình dáng 5 — giao dịch đã bỏ cuộc</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>P2028</code> Lỗi API giao dịch</span><span class="v">Thường là "Transaction already closed": giao dịch tương tác vượt quá <code>timeout</code> của nó (mặc định 5 giây) và mọi thứ sau điểm đó chạy NGOÀI giao dịch. Chỉ nâng <code>timeout</code> sau khi đã kiểm vì sao nó chậm.</span></div>
  <div class="kv"><span class="k"><code>P2034</code> Xung đột ghi hoặc deadlock</span><span class="v">Hai giao dịch chạm cùng những hàng theo thứ tự ngược nhau, hoặc một cú thất bại tuần tự hoá dưới mức <code>Serializable</code>. Cái này là ĐƯỢC MONG ĐỢI — hãy thử lại với lùi dần, như Bài 7.5 mô tả. Nó không phải bug trừ khi tần suất đang tăng.</span></div>
  <div class="kv"><span class="k"><code>P1017</code> Máy chủ đã đóng kết nối</span><span class="v">Cơ sở dữ liệu hoặc một pooler thả nó ra: hết giờ nhàn rỗi, một cú chuyển dự phòng, một lần khởi động lại, hay PgBouncer giết một phiên. Prisma nối lại được, nhưng mọi giao dịch đang bay thì mất.</span></div>
  <div class="kv"><span class="k">Deadlock trong nhật ký PostgreSQL</span><span class="v"><code>deadlock detected</code> trong log của máy chủ gọi tên CẢ HAI câu lệnh và đúng cái vòng khoá. Nó hữu ích hơn hẳn lỗi phía Prisma, và là chỗ nhìn đầu tiên khi <code>P2034</code> lặp lại.</span></div>
</div>

<h3>Hình dáng 6 — migration thất bại</h3>
<div class="out">P3009 migrate found failed migrations in the target database

The &#96;20260823140000_them_cot_diem&#96; migration started at 2026-08-23 14:00:03 UTC
failed with: ERROR: column "diem" of relation "SocialPost" already exists

Prisma Migrate will not apply any further migrations until this is resolved.</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">DỪNG. Đừng tự động sửa.</span><span class="lz-lnote">Đây là hình dáng DUY NHẤT mà câu lệnh hiển nhiên nhất lại làm mọi thứ tệ đi VĨNH VIỄN. <code>migrate resolve --applied</code> lên một migration áp dở dang là nói với Prisma rằng cả file đã chạy trong khi chỉ một phần chạy, và mọi migration về sau đều dựng trên một giả định sai.</span></div>
  <div class="lz-layer"><span class="lz-lname">1 — Đọc file migration</span><span class="lz-lnote">Câu lệnh nào hỏng, và những câu nào đã chạy trước nó? Prisma áp cả file trong một giao dịch trên PostgreSQL, nên thường là chưa có gì được commit — nhưng một migration có chứa <code>COMMIT</code>, hoặc một cái chạy qua công cụ tự cắt nhỏ nó ra, thì có thể đã áp một phần.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 — Đối chiếu cơ sở dữ liệu với lịch sử</span><span class="lz-lnote"><code>npx prisma migrate diff --from-migrations ./prisma/migrations --to-database-url "$DATABASE_URL" --script</code>. Đây là sự thật nền: cơ sở dữ liệu có gì mà lịch sử không có, và ngược lại.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 — Báo cáo, rồi quyết định CÙNG một con người</span><span class="lz-lnote">Đúng thông báo lỗi, tên migration, nó có áp một phần không, và một đề xuất cách vá. Rồi mới hành động. Trên production, bước này KHÔNG tuỳ chọn — tự động resolve một migration áp dở dang có thể âm thầm phá hỏng lược đồ và dữ liệu, và đó chính là lý do nó nằm trong danh sách cấm của kho mã này.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>P3006</code> thì khác — nó là shadow database</span><span class="lz-lnote">Một cú hỏng ở shadow database CHƯA HỀ chạm production; nó nghĩa là một migration cũ không phát lại được từ đầu. Trên kho này chuyện đó là vĩnh viễn: <code>20260706130000_add_music_and_profile</code> tạo một ràng buộc duy nhất và một chỉ mục TRÙNG TÊN. Nó đã deploy rồi nên không được sửa — và đó là lý do migration ở đây viết tay rồi áp bằng <code>migrate deploy</code>.</span></div>
</div>

<h3>Hình dáng 7 — chẳng có gì hỏng cả</h3>
<pre><code><span class="tok-comment">// Không lỗi. Câu trả lời SAI.</span>
const bai = await prisma.socialPost.findMany({ where: { authorId } });
<span class="tok-comment">// → kèm cả những hàng đã xoá mềm, vì đây là một đường mà</span>
<span class="tok-comment">//   phần mở rộng không phủ tới, hoặc một include đi vòng qua nó</span></code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Chậm, không phải hỏng</span><span class="lz-t">Chương 9</span><span class="lz-d">Độ trễ tăng dần, không lỗi nào, CPU của cơ sở dữ liệu leo lên. Đo trước: xếp hạng theo <code>số lần × thời lượng</code>, rồi nhìn kế hoạch. Đừng đi chỉnh pool.</span></div>
  <div class="lz-step"><span class="lz-k">Sai hàng</span><span class="lz-t">Thiếu một bộ lọc</span><span class="lz-d">Hàng đã xoá mềm hiện ra, dữ liệu của tenant khác, một <code>include</code> mà phần mở rộng không với tới. Ba khoảng hở của Bài 10.5 chính là danh sách kiểm.</span></div>
  <div class="lz-step"><span class="lz-k">Sai giờ</span><span class="lz-t">Múi giờ</span><span class="lz-d">Mọi thứ trong cơ sở dữ liệu là UTC và <code>Date</code> trong JavaScript cũng là UTC — cho tới khi có thứ gì đó định dạng nó theo locale của máy chủ. "Lệch bảy tiếng" không bao giờ là bug của Prisma.</span></div>
  <div class="lz-step"><span class="lz-k">Sai số</span><span class="lz-t">Decimal và BigInt</span><span class="lz-d">Bài 10.2: <code>Decimal + number</code> nối chuỗi, <code>count(*)</code> là BigInt. Cả hai cho ra giá trị SAI mà nhìn rất hợp lý chứ không ném lỗi, và đó là lý do chúng sống sót qua review.</span></div>
  <div class="lz-step"><span class="lz-k">"Hôm qua nó còn chạy mà"</span><span class="lz-t">Quay lại 12.1</span><span class="lz-d">Có thứ gì đó đã thay đổi. Không có lỗi KHÔNG có nghĩa là không có lần deploy nào.</span></div>
</div>
<div class="note-ct">
<p><strong>Hãy để cái bảng này ở chỗ người trực tìm ra được.</strong> Một trang giấy ánh xạ từ mã sang hình dáng sang hành động — ghim trong kênh chat của nhóm, hoặc một file ở gốc kho mã — đáng giá hơn mọi khối tài liệu không ai tìm thấy, vào lúc hai giờ sáng. Dòng DUY NHẤT phải chính xác từng chữ là hình dáng 6: <em>migration thất bại thì BÁO CÁO, không bao giờ tự động resolve.</em> Mọi thứ khác có thể suy lại được lúc căng thẳng; riêng cái đó thì không hoàn tác được.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/error-reference" target="_blank" rel="noopener"><span class="lc-ico">🔢</span><span class="lc-body"><span class="lc-title">Prisma — tra cứu mã lỗi</span><span class="lc-sub">prisma.io/docs · Danh sách chuẩn: mọi mã P và các trường meta của nó</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/workflows/patching-and-hotfixing" target="_blank" rel="noopener"><span class="lc-ico">🩹</span><span class="lc-body"><span class="lc-title">Prisma — migration thất bại</span><span class="lc-sub">prisma.io/docs · Quy trình chính thức, và resolve THẬT SỰ làm gì</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/errcodes-appendix.html" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — mã lỗi</span><span class="lc-sub">postgresql.org · SQLSTATE nằm sau mỗi mã Prisma, khi bạn cần chi tiết hơn</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/debugging-and-troubleshooting/handling-exceptions-and-errors" target="_blank" rel="noopener"><span class="lc-ico">🎣</span><span class="lc-body"><span class="lc-title">Prisma — xử lý lỗi</span><span class="lc-sub">prisma.io/docs · Các lớp lỗi, và cách thu hẹp kiểu trong TypeScript</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Bảy trạng thái hỏng, mỗi cái một mã — gọi tên hình dáng trước khi đọc cách vá</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 12.3 ─────────────────────────── */
    {
      title: '12.3 — The diagnostic toolbox|||12.3 — Bộ công cụ chẩn đoán',
      slug: 'pr-12-3-bo-cong-cu',
      type: 'LESSON',
      description: 'Mười công cụ, mỗi cái trả lời đúng một câu hỏi: migrate status và bốn chiều của migrate diff, validate, db pull (và vì sao nó nguy hiểm), Studio, DEBUG, $metrics, và bốn khung nhìn pg_stat trả lời được thứ mà phía ứng dụng không trả lời nổi.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.3</span>
<h2>The diagnostic toolbox</h2>
<p class="lead">Ten tools. Each answers one question, and knowing which question you have is most of the work. Three of them can change production, so they are marked — the rest are read-only and safe to run in the middle of an incident.</p>

<h3>Is the schema what I think it is?</h3>
<pre><code><span class="tok-comment"># Are all migrations applied? (read-only, safe)</span>
npx prisma migrate status</code></pre>
<div class="out">Database schema is up to date!

<span class="tok-comment"># hoặc</span>
Following migrations have not yet been applied:
20260823140000_them_cot_diem
<span class="tok-comment"># hoặc</span>
The &#96;20260823140000_them_cot_diem&#96; migration failed. (P3009)</div>
<pre><code><span class="tok-comment"># Does the live database match the migration history? (read-only, safe)</span>
npx prisma migrate diff \\
  --from-migrations ./prisma/migrations \\
  --to-database-url "$DATABASE_URL" \\
  --script</code></pre>
<div class="out">-- rong = khop hoan toan

-- hoac, day la troi dat:
CREATE INDEX "socialpost_author_created_idx" ON "SocialPost"("authorId", "createdAt");
-- ai do da tao chi muc nay bang tay tren production</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>--from-migrations … --to-database-url</code></span><span class="v">History versus reality. The one to run when you suspect somebody changed production by hand. Empty output is the answer you want.</span></div>
  <div class="kv"><span class="k"><code>--from-schema-datasource … --to-schema-datamodel</code></span><span class="v">The live database versus <code>schema.prisma</code>. Empty means your schema file describes what is actually there — the check the pre-push checklist uses.</span></div>
  <div class="kv"><span class="k"><code>--from-migrations … --to-schema-datamodel</code></span><span class="v">History versus the schema file. This is what a new migration <em>would</em> contain, without creating one — useful for reviewing a change before writing the SQL.</span></div>
  <div class="kv"><span class="k">Direction matters</span><span class="v">The output is the SQL that turns <code>from</code> into <code>to</code>. Swapping them gives you the inverse script, which is occasionally exactly what you want and usually a confusing surprise.</span></div>
</div>

<h3>Is the schema file even valid?</h3>
<pre><code>npx prisma validate         <span class="tok-comment"># read-only, safe</span>
npx prisma format           <span class="tok-comment"># rewrites schema.prisma, no database contact</span></code></pre>
<div class="out">Prisma schema loaded from prisma/schema.prisma

error: Error validating field &#96;posts&#96; in model &#96;User&#96;: The relation field
&#96;posts&#96; on model &#96;User&#96; is missing an opposite relation field on model
&#96;SocialPost&#96;.
  --&gt;  prisma/schema.prisma:34
   |
33 |   id    String        @id
34 |   posts SocialPost[]
   |</div>
<div class="callout ok">
<p><strong><code>prisma format</code> is a validator that happens to also format.</strong> It catches missing back-relations, ambiguous <code>@relation</code> names and type errors before <code>generate</code> does, in under a second and with a pointer at the line. Run it every time you touch the schema — the 29/06/2026 missing-back-relation failure on this codebase was one <code>format</code> away from being caught at the keyboard.</p>
</div>

<h3>What does the database actually contain? ⚠️</h3>
<pre><code><span class="tok-comment"># ⚠️ OVERWRITES prisma/schema.prisma with the live database's structure</span>
npx prisma db pull</code></pre>
<div class="out">Introspecting based on datasource defined in prisma/schema.prisma …
✔ Introspected 34 models and wrote them into prisma/schema.prisma in 1.2s</div>
<pre><code><span class="tok-comment"># The safe way: introspect into a scratch file and diff it</span>
cp prisma/schema.prisma /tmp/schema.goc.prisma
npx prisma db pull --schema /tmp/soi.prisma 2&gt;/dev/null || {
  cp prisma/schema.prisma /tmp/soi.prisma
  npx prisma db pull --schema /tmp/soi.prisma
}
diff /tmp/schema.goc.prisma /tmp/soi.prisma</code></pre>
<div class="pitfall">
<p><strong>Trap — <code>db pull</code> destroys everything the database cannot express.</strong> It rewrites your schema file from introspection, so <code>@map</code> names it cannot infer, <code>@relation</code> labels, comments, ordering and generator blocks are rewritten or lost. It is a legitimate tool for adopting an existing database, and a terrible one for "let me just check". Copy the schema to <code>/tmp</code> and pull into that.</p>
</div>
<pre><code><span class="tok-comment"># ⚠️ A GUI on your data. Do not point it at production.</span>
npx prisma studio</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Why not production</span><span class="lz-lnote">Studio can edit and delete rows with two clicks and no confirmation dialog worth the name, over an unauthenticated local web server, using a connection from the same pool your application needs. Every one of those is a reason on its own.</span></div>
  <div class="lz-layer"><span class="lz-lname">The safe substitute</span><span class="lz-lnote">A restored dump on your machine, or read-only SQL through <code>psql</code>. If you need to look at one production row, <code>SELECT</code> it — a query in the log is auditable and a Studio click is not.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>DEBUG</code> for the layer below</span><span class="lz-lnote"><code>DEBUG="prisma:client,prisma:engine" node dist/index.js</code> prints what the client sends the engine and what the engine does with it. Verbose, invaluable when the SQL looks right but the result does not, and never something to leave enabled.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>$metrics</code> for the pool</span><span class="lz-lnote">Lesson 9.4's gauges: connections open, busy, idle, and <code>prisma_client_queries_wait</code>. Read-only, cheap, and the only view of the pool that does not require database access — which matters precisely when the database is the problem.</span></div>
</div>

<h3>The four PostgreSQL views worth memorising</h3>
<pre><code><span class="tok-comment">-- 1. Who is connected and what are they doing? (Bài 9.4, 12.2)</span>
SELECT pid, state, now() - state_change AS lau, left(query, 60)
FROM pg_stat_activity
WHERE datname = current_database() AND state != 'idle'
ORDER BY lau DESC;</code></pre>
<div class="out">  pid  |        state        |    lau    |            left
-------+---------------------+-----------+------------------------------
 41287 | idle in transaction | 00:06:44  | SELECT "User"."id" FROM "User"
 41302 | active              | 00:00:31  | UPDATE "SocialPost" SET …</div>
<pre><code><span class="tok-comment">-- 2. Who is blocking whom? The question pg_stat_activity alone cannot answer.</span>
SELECT bi.pid AS bi_chan, bi.query AS truy_van_bi_chan,
       ch.pid AS ke_chan,  ch.query AS truy_van_ke_chan,
       now() - bi.query_start AS cho_bao_lau
FROM pg_stat_activity bi
JOIN LATERAL unnest(pg_blocking_pids(bi.pid)) AS b(pid) ON true
JOIN pg_stat_activity ch ON ch.pid = b.pid
WHERE cardinality(pg_blocking_pids(bi.pid)) &gt; 0;</code></pre>
<div class="out"> bi_chan |     truy_van_bi_chan      | ke_chan |   truy_van_ke_chan    | cho_bao_lau
---------+---------------------------+---------+-----------------------+-------------
   41302 | ALTER TABLE "SocialPost"… |   41287 | SELECT … FROM "User"  | 00:00:31

-- Bai 11.3: mot ALTER dang cho, va MOI truy van moi xep hang sau no.</div>
<pre><code><span class="tok-comment">-- 3. Which tables are being scanned instead of indexed? (Bài 9.3)</span>
SELECT relname, seq_scan, seq_tup_read, idx_scan, n_live_tup, n_dead_tup
FROM pg_stat_user_tables
WHERE seq_scan &gt; 0
ORDER BY seq_tup_read DESC LIMIT 5;</code></pre>
<div class="out">    relname    | seq_scan | seq_tup_read | idx_scan | n_live_tup | n_dead_tup
---------------+----------+--------------+----------+------------+------------
 SocialPost    |    18422 |  22947103884 |   904112 |    1247104 |     418209
 Comment       |       12 |         1440 |  8841029 |     418771 |       1104

-- 22 ty hang doc tuan tu = mot chi muc bi thieu.
-- 418k dead tuple = autovacuum khong theo kip (Bai 11.4).</div>
<pre><code><span class="tok-comment">-- 4. What is actually slow, cumulatively? (Bài 9.1)</span>
SELECT calls, round(total_exec_time)::int AS tong_ms,
       round(mean_exec_time::numeric, 2) AS tb_ms, left(query, 70)
FROM pg_stat_statements
WHERE dbid = (SELECT oid FROM pg_database WHERE datname = current_database())
ORDER BY total_exec_time DESC LIMIT 5;</code></pre>
<div class="out"> calls  | tong_ms | tb_ms  |                left
--------+---------+--------+-------------------------------------
 884102 | 1204882 |   1.36 | SELECT … FROM "User" WHERE id = $1
     41 |  388104 | 9466.4 | SELECT … FROM "SocialPost" ORDER BY…

-- Cau tren: nhanh nhung goi 884 nghin lan → N+1 (Bai 9.2)
-- Cau duoi: 41 lan nhung 9,5 giay moi lan → thieu chi muc (Bai 9.3)</div>
<div class="callout warn">
<p><strong>Safe to run during an incident: everything above except three.</strong> <code>prisma db pull</code> rewrites your schema file, <code>prisma studio</code> can edit production rows, and <code>prisma migrate deploy</code> changes the database. Everything else — <code>migrate status</code>, <code>migrate diff</code>, <code>validate</code>, <code>$metrics</code>, all four <code>pg_stat</code> views, <code>EXPLAIN</code> without <code>ANALYZE</code> — only reads. When you are unsure and under pressure, that distinction is the one to remember. And note that <code>EXPLAIN ANALYZE</code> <em>executes</em> the query: on a <code>SELECT</code> that is fine, on an <code>UPDATE</code> it performs the update.</p>
</div>
<div class="note-ct">
<p><strong>The one-command health check worth keeping in the repository.</strong> <code>npm run db:kiem</code> running <code>migrate status</code>, the migrations-versus-database diff, and the four <code>pg_stat</code> queries takes about two seconds and prints one screen. Run it after every deploy, and read it once a week when nothing is wrong — that is how you learn what normal looks like, which is the only way the numbers mean anything during an incident.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/prisma-cli-reference" target="_blank" rel="noopener"><span class="lc-ico">⌨️</span><span class="lc-body"><span class="lc-title">Prisma — CLI reference</span><span class="lc-sub">prisma.io/docs · Every command and flag, including all four diff directions</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/monitoring-stats.html" target="_blank" rel="noopener"><span class="lc-ico">📈</span><span class="lc-body"><span class="lc-title">PostgreSQL — the statistics collector</span><span class="lc-sub">postgresql.org · Every column of every pg_stat view</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/pgstatstatements.html" target="_blank" rel="noopener"><span class="lc-ico">🧮</span><span class="lc-body"><span class="lc-title">pg_stat_statements</span><span class="lc-sub">postgresql.org · Installing it, and what each timing column means</span></span></a>
<a class="link-card" href="https://wiki.postgresql.org/wiki/Lock_Monitoring" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">PostgreSQL wiki — lock monitoring</span><span class="lc-sub">wiki.postgresql.org · The blocking-query recipe, with variations</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">CuongThai course — PostgreSQL</span><span class="lc-sub">These views in depth, plus vacuum, bloat and planner statistics</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Given a symptom, pick the one tool that answers it — ten rounds, no guessing</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.3</span>
<h2>Bộ công cụ chẩn đoán</h2>
<p class="lead">Mười công cụ. Mỗi cái trả lời ĐÚNG MỘT câu hỏi, và biết mình đang có câu hỏi nào mới là phần lớn công việc. Ba cái có thể THAY ĐỔI production nên chúng được đánh dấu; phần còn lại chỉ đọc và chạy an toàn ngay giữa lúc sự cố.</p>

<h3>Lược đồ có đúng như tôi nghĩ không?</h3>
<pre><code><span class="tok-comment"># Mọi migration đã áp chưa? (chỉ đọc, an toàn)</span>
npx prisma migrate status</code></pre>
<div class="out">Database schema is up to date!

<span class="tok-comment"># hoặc</span>
Following migrations have not yet been applied:
20260823140000_them_cot_diem
<span class="tok-comment"># hoặc</span>
The &#96;20260823140000_them_cot_diem&#96; migration failed. (P3009)</div>
<pre><code><span class="tok-comment"># Cơ sở dữ liệu đang chạy có khớp lịch sử migration không? (chỉ đọc, an toàn)</span>
npx prisma migrate diff \\
  --from-migrations ./prisma/migrations \\
  --to-database-url "$DATABASE_URL" \\
  --script</code></pre>
<div class="out">-- rong = khop hoan toan

-- hoac, day la troi dat:
CREATE INDEX "socialpost_author_created_idx" ON "SocialPost"("authorId", "createdAt");
-- ai do da tao chi muc nay bang tay tren production</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>--from-migrations … --to-database-url</code></span><span class="v">Lịch sử đối lại thực tế. Cái để chạy khi bạn nghi có người sửa production bằng tay. Đầu ra RỖNG là câu trả lời bạn muốn.</span></div>
  <div class="kv"><span class="k"><code>--from-schema-datasource … --to-schema-datamodel</code></span><span class="v">Cơ sở dữ liệu đang chạy đối lại <code>schema.prisma</code>. Rỗng nghĩa là file lược đồ của bạn mô tả đúng thứ đang có — chính phép kiểm mà danh sách trước-khi-push dùng.</span></div>
  <div class="kv"><span class="k"><code>--from-migrations … --to-schema-datamodel</code></span><span class="v">Lịch sử đối lại file lược đồ. Đây là thứ một migration mới SẼ chứa, mà không phải tạo ra migration nào — hữu ích để review một thay đổi trước khi viết SQL.</span></div>
  <div class="kv"><span class="k">Chiều có ý nghĩa</span><span class="v">Đầu ra là câu SQL biến <code>from</code> thành <code>to</code>. Đảo hai cái cho bạn kịch bản NGƯỢC, thỉnh thoảng đúng là thứ bạn muốn và thường thì là một bất ngờ khó hiểu.</span></div>
</div>

<h3>Bản thân file lược đồ có hợp lệ không?</h3>
<pre><code>npx prisma validate         <span class="tok-comment"># chỉ đọc, an toàn</span>
npx prisma format           <span class="tok-comment"># ghi lại schema.prisma, không chạm cơ sở dữ liệu</span></code></pre>
<div class="out">Prisma schema loaded from prisma/schema.prisma

error: Error validating field &#96;posts&#96; in model &#96;User&#96;: The relation field
&#96;posts&#96; on model &#96;User&#96; is missing an opposite relation field on model
&#96;SocialPost&#96;.
  --&gt;  prisma/schema.prisma:34
   |
33 |   id    String        @id
34 |   posts SocialPost[]
   |</div>
<div class="callout ok">
<p><strong><code>prisma format</code> là một bộ KIỂM mà tiện thể định dạng luôn.</strong> Nó bắt được back-relation còn thiếu, tên <code>@relation</code> nhập nhằng và lỗi kiểu TRƯỚC cả <code>generate</code>, trong chưa tới một giây và có mũi tên chỉ đúng dòng. Hãy chạy nó mỗi lần bạn đụng vào lược đồ — cú hỏng vì thiếu back-relation ngày 29/06/2026 trên kho mã này chỉ cách một lệnh <code>format</code> là đã bị bắt ngay tại bàn phím.</p>
</div>

<h3>Cơ sở dữ liệu THẬT SỰ chứa gì? ⚠️</h3>
<pre><code><span class="tok-comment"># ⚠️ GHI ĐÈ prisma/schema.prisma bằng cấu trúc của cơ sở dữ liệu đang chạy</span>
npx prisma db pull</code></pre>
<div class="out">Introspecting based on datasource defined in prisma/schema.prisma …
✔ Introspected 34 models and wrote them into prisma/schema.prisma in 1.2s</div>
<pre><code><span class="tok-comment"># Cách an toàn: nội soi vào một file nháp rồi diff</span>
cp prisma/schema.prisma /tmp/schema.goc.prisma
npx prisma db pull --schema /tmp/soi.prisma 2&gt;/dev/null || {
  cp prisma/schema.prisma /tmp/soi.prisma
  npx prisma db pull --schema /tmp/soi.prisma
}
diff /tmp/schema.goc.prisma /tmp/soi.prisma</code></pre>
<div class="pitfall">
<p><strong>Bẫy — <code>db pull</code> PHÁ HUỶ mọi thứ mà cơ sở dữ liệu không diễn đạt được.</strong> Nó viết lại file lược đồ của bạn từ kết quả nội soi, nên những cái tên <code>@map</code> nó không suy ra được, nhãn <code>@relation</code>, chú thích, thứ tự và các khối generator đều bị viết lại hoặc mất. Nó là công cụ CHÍNH ĐÁNG để tiếp quản một cơ sở dữ liệu có sẵn, và là công cụ TỆ HẠI cho việc "để tôi xem thử cái". Hãy copy lược đồ ra <code>/tmp</code> rồi pull vào đó.</p>
</div>
<pre><code><span class="tok-comment"># ⚠️ Một giao diện đồ hoạ trên dữ liệu của bạn. ĐỪNG trỏ nó vào production.</span>
npx prisma studio</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Vì sao không dùng với production</span><span class="lz-lnote">Studio sửa và xoá hàng bằng hai cú nhấp, với hộp thoại xác nhận chẳng đáng gọi là xác nhận, qua một máy chủ web cục bộ không xác thực, dùng một kết nối lấy từ chính cái pool mà ứng dụng của bạn đang cần. Mỗi điều đó tự nó đã là một lý do.</span></div>
  <div class="lz-layer"><span class="lz-lname">Thứ thay thế an toàn</span><span class="lz-lnote">Một bản dump khôi phục xuống máy bạn, hoặc SQL chỉ-đọc qua <code>psql</code>. Nếu bạn cần nhìn MỘT hàng production, hãy <code>SELECT</code> nó — một câu truy vấn trong nhật ký thì kiểm toán được, một cú nhấp trong Studio thì không.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>DEBUG</code> cho tầng bên dưới</span><span class="lz-lnote"><code>DEBUG="prisma:client,prisma:engine" node dist/index.js</code> in ra thứ client gửi cho engine và thứ engine làm với nó. Rất dài dòng, vô giá khi câu SQL trông đúng mà kết quả thì không, và tuyệt đối không phải thứ để bật rồi bỏ đó.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>$metrics</code> cho cái pool</span><span class="lz-lnote">Mấy cái đồng hồ của Bài 9.4: kết nối đang mở, đang bận, đang rảnh, và <code>prisma_client_queries_wait</code>. Chỉ đọc, rẻ, và là cái nhìn DUY NHẤT vào pool mà không cần truy cập cơ sở dữ liệu — điều đó quan trọng chính xác vào lúc cơ sở dữ liệu là vấn đề.</span></div>
</div>

<h3>Bốn khung nhìn PostgreSQL đáng thuộc lòng</h3>
<pre><code><span class="tok-comment">-- 1. Ai đang nối và họ đang làm gì? (Bài 9.4, 12.2)</span>
SELECT pid, state, now() - state_change AS lau, left(query, 60)
FROM pg_stat_activity
WHERE datname = current_database() AND state != 'idle'
ORDER BY lau DESC;</code></pre>
<div class="out">  pid  |        state        |    lau    |            left
-------+---------------------+-----------+------------------------------
 41287 | idle in transaction | 00:06:44  | SELECT "User"."id" FROM "User"
 41302 | active              | 00:00:31  | UPDATE "SocialPost" SET …</div>
<pre><code><span class="tok-comment">-- 2. Ai đang chặn ai? Câu hỏi mà riêng pg_stat_activity không trả lời được.</span>
SELECT bi.pid AS bi_chan, bi.query AS truy_van_bi_chan,
       ch.pid AS ke_chan,  ch.query AS truy_van_ke_chan,
       now() - bi.query_start AS cho_bao_lau
FROM pg_stat_activity bi
JOIN LATERAL unnest(pg_blocking_pids(bi.pid)) AS b(pid) ON true
JOIN pg_stat_activity ch ON ch.pid = b.pid
WHERE cardinality(pg_blocking_pids(bi.pid)) &gt; 0;</code></pre>
<div class="out"> bi_chan |     truy_van_bi_chan      | ke_chan |   truy_van_ke_chan    | cho_bao_lau
---------+---------------------------+---------+-----------------------+-------------
   41302 | ALTER TABLE "SocialPost"… |   41287 | SELECT … FROM "User"  | 00:00:31

-- Bai 11.3: mot ALTER dang cho, va MOI truy van moi xep hang sau no.</div>
<pre><code><span class="tok-comment">-- 3. Bảng nào đang bị quét thay vì dùng chỉ mục? (Bài 9.3)</span>
SELECT relname, seq_scan, seq_tup_read, idx_scan, n_live_tup, n_dead_tup
FROM pg_stat_user_tables
WHERE seq_scan &gt; 0
ORDER BY seq_tup_read DESC LIMIT 5;</code></pre>
<div class="out">    relname    | seq_scan | seq_tup_read | idx_scan | n_live_tup | n_dead_tup
---------------+----------+--------------+----------+------------+------------
 SocialPost    |    18422 |  22947103884 |   904112 |    1247104 |     418209
 Comment       |       12 |         1440 |  8841029 |     418771 |       1104

-- 22 ty hang doc tuan tu = mot chi muc bi thieu.
-- 418k dead tuple = autovacuum khong theo kip (Bai 11.4).</div>
<pre><code><span class="tok-comment">-- 4. Cái gì THẬT SỰ chậm, tính luỹ kế? (Bài 9.1)</span>
SELECT calls, round(total_exec_time)::int AS tong_ms,
       round(mean_exec_time::numeric, 2) AS tb_ms, left(query, 70)
FROM pg_stat_statements
WHERE dbid = (SELECT oid FROM pg_database WHERE datname = current_database())
ORDER BY total_exec_time DESC LIMIT 5;</code></pre>
<div class="out"> calls  | tong_ms | tb_ms  |                left
--------+---------+--------+-------------------------------------
 884102 | 1204882 |   1.36 | SELECT … FROM "User" WHERE id = $1
     41 |  388104 | 9466.4 | SELECT … FROM "SocialPost" ORDER BY…

-- Cau tren: nhanh nhung goi 884 nghin lan → N+1 (Bai 9.2)
-- Cau duoi: 41 lan nhung 9,5 giay moi lan → thieu chi muc (Bai 9.3)</div>
<div class="callout warn">
<p><strong>Chạy được giữa lúc sự cố: TẤT CẢ ở trên trừ ba cái.</strong> <code>prisma db pull</code> viết lại file lược đồ, <code>prisma studio</code> sửa được hàng trên production, và <code>prisma migrate deploy</code> thay đổi cơ sở dữ liệu. Mọi thứ còn lại — <code>migrate status</code>, <code>migrate diff</code>, <code>validate</code>, <code>$metrics</code>, cả bốn khung nhìn <code>pg_stat</code>, <code>EXPLAIN</code> không kèm <code>ANALYZE</code> — chỉ ĐỌC. Khi bạn không chắc mà lại đang căng thẳng, đó là ranh giới cần nhớ. Và lưu ý: <code>EXPLAIN ANALYZE</code> có <em>THỰC THI</em> câu truy vấn — với một <code>SELECT</code> thì không sao, với một <code>UPDATE</code> thì nó cập nhật thật.</p>
</div>
<div class="note-ct">
<p><strong>Cái lệnh kiểm sức khoẻ một-phát đáng để trong kho mã.</strong> <code>npm run db:kiem</code> chạy <code>migrate status</code>, phép diff lịch-sử-với-cơ-sở-dữ-liệu, và bốn câu <code>pg_stat</code>, tốn chừng hai giây và in ra vừa một màn hình. Chạy nó sau MỖI lần deploy, và đọc nó mỗi tuần một lần lúc chẳng có gì sai — đó là cách bạn học được BÌNH THƯỜNG trông như thế nào, và đó là con đường DUY NHẤT để mấy con số kia có ý nghĩa lúc đang có sự cố.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/prisma-cli-reference" target="_blank" rel="noopener"><span class="lc-ico">⌨️</span><span class="lc-body"><span class="lc-title">Prisma — tra cứu CLI</span><span class="lc-sub">prisma.io/docs · Mọi câu lệnh và cờ, kể cả cả bốn chiều của diff</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/monitoring-stats.html" target="_blank" rel="noopener"><span class="lc-ico">📈</span><span class="lc-body"><span class="lc-title">PostgreSQL — bộ thu thập thống kê</span><span class="lc-sub">postgresql.org · Mọi cột của mọi khung nhìn pg_stat</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/pgstatstatements.html" target="_blank" rel="noopener"><span class="lc-ico">🧮</span><span class="lc-body"><span class="lc-title">pg_stat_statements</span><span class="lc-sub">postgresql.org · Cách cài, và mỗi cột thời gian nghĩa là gì</span></span></a>
<a class="link-card" href="https://wiki.postgresql.org/wiki/Lock_Monitoring" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Wiki PostgreSQL — theo dõi khoá</span><span class="lc-sub">wiki.postgresql.org · Công thức tìm truy vấn đang chặn, kèm các biến thể</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — PostgreSQL</span><span class="lc-sub">Những khung nhìn này nói kỹ, cộng vacuum, phình bảng và thống kê của bộ lập kế hoạch</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Cho một triệu chứng, chọn ĐÚNG một công cụ trả lời nó — mười lượt, không đoán mò</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 12.4 ─────────────────────────── */
    {
      title: '12.4 — Monitoring: eight panels and eight alerts|||12.4 — Giám sát: tám bảng và tám cảnh báo',
      slug: 'pr-12-4-giam-sat',
      type: 'LESSON',
      description: 'Xuất $metrics sang Prometheus bằng mười dòng, tám thứ đáng vẽ đồ thị, tám cảnh báo kèm ngưỡng và lý do chọn ngưỡng đó — trong đó có cái cảnh báo dung lượng đĩa mà nếu có thì đã cứu được Postgres của CuongThai một lần.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.4</span>
<h2>Monitoring: eight panels and eight alerts</h2>
<p class="lead">Chapter 12 so far has been about incidents you are already in. This lesson is about seeing them coming. Eight graphs to look at and eight alerts to be woken by — with the threshold for each, and the reasoning, because a threshold you cannot justify is a threshold someone will silence.</p>

<h3>Ten lines to export everything</h3>
<pre><code><span class="tok-comment">// schema.prisma</span>
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["metrics"]
}</code></pre>
<pre><code><span class="tok-comment">// src/routes/metrics.ts — scraped by Prometheus, not public</span>
app.get('/metrics', chiNoiBo, async (_req, res) =&gt; {
  res.set('Content-Type', 'text/plain; version=0.0.4');
  res.end(await prisma.$metrics.prometheus());
});</code></pre>
<div class="out">prisma_client_queries_total 4820193
prisma_client_queries_active 3
prisma_client_queries_wait 0
prisma_client_queries_duration_histogram_ms_bucket{le="1"} 1204882
prisma_client_queries_duration_histogram_ms_bucket{le="50"} 4802001
prisma_pool_connections_open 12
prisma_pool_connections_busy 3
prisma_pool_connections_idle 9
prisma_datasource_queries_total 5104882</div>
<div class="callout ok">
<p><strong>Restrict <code>/metrics</code> to the internal network.</strong> The histogram and counters are harmless, but the endpoint is a free description of your traffic shape and your infrastructure to anyone who can reach it. Bind it to the compose network, or put it behind the same middleware as the admin routes. Never on the public hostname.</p>
</div>

<h3>Eight panels</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · Query latency, p50 / p95 / p99</span><span class="lz-lnote">From <code>prisma_client_queries_duration_histogram_ms</code>. The p99 is the one that matches what a user notices; the p50 tells you whether the whole system moved or only the tail. Both, on one graph.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · Queries per second, by operation</span><span class="lz-lnote">A sudden 20× jump with no traffic change is an N+1 that shipped this morning — Lesson 9.2. This panel catches it in minutes rather than in next month's database bill.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · Pool: open, busy, idle, waiting</span><span class="lz-lnote">Four lines from the pool gauges. Busy climbing toward open means saturation approaching; <code>queries_wait</code> above zero means it has arrived.</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · PostgreSQL connections by state</span><span class="lz-lnote">From <code>pg_stat_activity</code>: idle, active, idle in transaction. The third line should be flat at zero, and when it is not, Lesson 7.1 explains what you are looking at.</span></div>
  <div class="lz-layer"><span class="lz-lname">5 · Error rate by Prisma code</span><span class="lz-lnote">A counter labelled by <code>P2002</code>, <code>P2024</code>, <code>P2025</code>, <code>P1001</code>. Grouping by code turns "errors are up" into a diagnosis — <code>P2002</code> rising is a product change, <code>P2024</code> rising is infrastructure.</span></div>
  <div class="lz-layer"><span class="lz-lname">6 · Slow queries per minute</span><span class="lz-lnote">Count of queries over 100 ms, from the <code>$on('query')</code> hook in Lesson 11.5. A step change here always precedes a latency alert, usually by hours.</span></div>
  <div class="lz-layer"><span class="lz-lname">7 · Table growth and dead tuples</span><span class="lz-lnote"><code>n_live_tup</code> and <code>n_dead_tup</code> from <code>pg_stat_user_tables</code>. A dead-tuple ratio that climbs and never falls means autovacuum is not keeping up, and the table is slowly getting slower for no visible reason.</span></div>
  <div class="lz-layer"><span class="lz-lname">8 · Disk free on the database volume</span><span class="lz-lnote">The most boring panel and the one that prevents the worst outage. A database that fills its disk does not degrade gracefully — it stops, and recovery involves finding space before it will start again.</span></div>
</div>

<h3>Eight alerts, with thresholds</h3>
<pre><code><span class="tok-comment"># prometheus/canh-bao.yml</span>
groups:
- name: prisma
  rules:
  - alert: PoolCanKiet
    expr: prisma_client_queries_wait &gt; 0
    for: 5m
    annotations:
      summary: "Truy van dang xep hang cho ket noi ({{ \\$value }} dang doi)"
      runbook: "Bai 9.4 · kiem idle in transaction truoc khi nang connection_limit"

  - alert: KetNoiGanTran
    expr: sum(pg_stat_activity_count) / on() pg_settings_max_connections &gt; 0.8
    for: 5m

  - alert: GiaoDichTreoLau
    expr: pg_stat_activity_max_tx_duration{state="idle in transaction"} &gt; 60
    for: 2m

  - alert: DiaSapDay
    expr: node_filesystem_avail_bytes{mountpoint="/var/lib/postgresql"} 
          / node_filesystem_size_bytes &lt; 0.20
    for: 10m</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">1 · <code>queries_wait &gt; 0</code> for 5m</span><span class="v">Zero is the normal value, so any sustained positive number is real. Five minutes filters out a deploy's cold start. This fires before users notice, which is the whole point.</span></div>
  <div class="kv"><span class="k">2 · Connections above 80% of <code>max_connections</code></span><span class="v">Twenty percent headroom is enough for a <code>psql</code> session and a migration job — exactly what you need available during the incident this alert is warning you about.</span></div>
  <div class="kv"><span class="k">3 · <code>idle in transaction</code> older than 60s</span><span class="v">A healthy transaction lasts milliseconds. Sixty seconds is not a slow transaction, it is a stuck one — and it is holding locks the whole time.</span></div>
  <div class="kv"><span class="k">4 · Disk free below 20%</span><span class="v">Below 20% you have time to act; below 5% you have an outage. Twenty percent of a 40 GB volume is 8 GB, which is minutes of runway if something is writing fast — hence <code>for: 10m</code>, not an hour.</span></div>
  <div class="kv"><span class="k">5 · Error rate by code above baseline</span><span class="v">Not an absolute number — <code>P2002</code> has a healthy background rate from duplicate signups. Alert on a multiple of the seven-day average, per code.</span></div>
  <div class="kv"><span class="k">6 · p99 latency above 2× the weekly baseline</span><span class="v">An absolute threshold ages badly as the product changes. A ratio against the same weekday last week survives growth and catches regressions.</span></div>
  <div class="kv"><span class="k">7 · Pending migrations after a deploy</span><span class="v">Not a metric — a deploy step. <code>migrate status</code> exits non-zero and the pipeline stops, per Lesson 11.3. Cheaper than any alert because it prevents the state rather than reporting it.</span></div>
  <div class="kv"><span class="k">8 · Container restart count above zero</span><span class="v">The alert that catches Lesson 11.1. A restarting container is the one failure mode where the application cannot report anything about itself, so the signal has to come from outside it.</span></div>
</div>

<h3>The disk one is not theoretical</h3>
<div class="note-ct">
<p><strong>CuongThai, 18/08/2026 — a deploy died with <code>no space left on device</code>.</strong> The Docker build cache had grown to 7.6 GB on the same volume as PostgreSQL, and the disk dropped to 1.8 GB free while <code>next build</code> was running. The immediate fix was cleanup; the structural fix was <code>deploy-nha.sh</code>, which builds at home and pushes images to GHCR so the VPS holds no build cache at all. A weekly cron (<code>vps-cleanup-weekly.yml</code>) reclaims space on a schedule, and the <code>VPS_HOST</code> / <code>VPS_USER</code> / <code>VPS_SSH_PRIVATE_KEY</code> secrets it needs are on the never-delete list precisely because removing them would kill that job <em>silently</em>. A database sharing a disk with anything that grows needs the disk alert more than it needs any query metric.</p>
</div>

<h3>What not to alert on</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">✗</span><span class="lz-t">Individual slow queries</span><span class="lz-d">One query over 500 ms is not an incident; a sustained rate of them is. Alert on the rate, graph the individuals.</span></div>
  <div class="lz-step"><span class="lz-k">✗</span><span class="lz-t">CPU on the database</span><span class="lz-d">A database at 80% CPU is a database being used. What matters is whether latency moved — alert on the symptom users feel, not on the resource.</span></div>
  <div class="lz-step"><span class="lz-k">✗</span><span class="lz-t">Every <code>P2002</code></span><span class="lz-d">Two people signing up with the same email is the constraint doing its job. Alerting on it teaches the team that these alerts are noise, which is how alert 1 gets ignored too.</span></div>
  <div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">Things that need a human tonight</span><span class="lz-d">That is the whole test. If the answer at 3am is "look at it tomorrow", it is a dashboard panel, not a page. An alert that nobody acts on trains everybody to act on none of them.</span></div>
</div>
<div class="callout warn">
<p><strong>Every alert needs a runbook link, and the link must go somewhere.</strong> The annotation in the rule above points at Lesson 9.4 for a reason: an alert that fires at 3am with no instructions is an alert that gets acknowledged and ignored. One line — what it means, the first command to run, the thing not to do — turns a page into a procedure. On this course's material, that line is usually just a lesson number.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/observability-and-logging/metrics" target="_blank" rel="noopener"><span class="lc-ico">📊</span><span class="lc-body"><span class="lc-title">Prisma — metrics</span><span class="lc-sub">prisma.io/docs · Every gauge, counter and histogram, and the Prometheus format</span></span></a>
<a class="link-card" href="https://github.com/prometheus-community/postgres_exporter" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">postgres_exporter</span><span class="lc-sub">github.com · Turns the pg_stat views from Lesson 12.3 into Prometheus metrics</span></span></a>
<a class="link-card" href="https://prometheus.io/docs/practices/alerting/" target="_blank" rel="noopener"><span class="lc-ico">🔔</span><span class="lc-body"><span class="lc-title">Prometheus — alerting practices</span><span class="lc-sub">prometheus.io · Symptom-based alerting, and why resource alerts age badly</span></span></a>
<a class="link-card" href="https://sre.google/workbook/alerting-on-slos/" target="_blank" rel="noopener"><span class="lc-ico">🎯</span><span class="lc-body"><span class="lc-title">Google SRE — alerting on SLOs</span><span class="lc-sub">sre.google · The framework behind "alert on what users feel"</span></span></a>
<a class="link-card" href="/courses/docker/learn${REF}"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">CuongThai course — Docker</span><span class="lc-sub">Build cache, volumes and the disk they all share</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Wire $metrics to Prometheus, then make each of the eight alerts fire on purpose</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.4</span>
<h2>Giám sát: tám bảng và tám cảnh báo</h2>
<p class="lead">Chương 12 tới giờ nói về những sự cố bạn ĐANG ở trong đó. Bài này nói về việc NHÌN THẤY chúng đang tới. Tám đồ thị để nhìn và tám cảnh báo để bị đánh thức — kèm ngưỡng cho từng cái, và lý do chọn ngưỡng đó, vì một cái ngưỡng bạn không biện minh nổi là một cái ngưỡng sẽ có người tắt tiếng.</p>

<h3>Mười dòng để xuất mọi thứ</h3>
<pre><code><span class="tok-comment">// schema.prisma</span>
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["metrics"]
}</code></pre>
<pre><code><span class="tok-comment">// src/routes/metrics.ts — cho Prometheus quét, KHÔNG công khai</span>
app.get('/metrics', chiNoiBo, async (_req, res) =&gt; {
  res.set('Content-Type', 'text/plain; version=0.0.4');
  res.end(await prisma.$metrics.prometheus());
});</code></pre>
<div class="out">prisma_client_queries_total 4820193
prisma_client_queries_active 3
prisma_client_queries_wait 0
prisma_client_queries_duration_histogram_ms_bucket{le="1"} 1204882
prisma_client_queries_duration_histogram_ms_bucket{le="50"} 4802001
prisma_pool_connections_open 12
prisma_pool_connections_busy 3
prisma_pool_connections_idle 9
prisma_datasource_queries_total 5104882</div>
<div class="callout ok">
<p><strong>Hãy giới hạn <code>/metrics</code> trong mạng nội bộ.</strong> Mấy cái histogram và bộ đếm thì vô hại, nhưng bản thân endpoint là một bản mô tả MIỄN PHÍ về hình dạng lưu lượng và hạ tầng của bạn, cho bất kỳ ai với tới được. Hãy buộc nó vào mạng của compose, hoặc đặt nó sau đúng cái middleware của các route quản trị. ĐỪNG BAO GIỜ để nó trên tên miền công khai.</p>
</div>

<h3>Tám bảng đồ thị</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · Độ trễ truy vấn, p50 / p95 / p99</span><span class="lz-lnote">Từ <code>prisma_client_queries_duration_histogram_ms</code>. Cái p99 mới là cái khớp với thứ người dùng cảm nhận; cái p50 cho biết cả hệ thống dịch chuyển hay chỉ có cái đuôi. Vẽ CẢ HAI, trên một đồ thị.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · Truy vấn mỗi giây, chia theo thao tác</span><span class="lz-lnote">Một cú nhảy 20 lần đột ngột mà lưu lượng không đổi chính là một N+1 vừa lên sáng nay — Bài 9.2. Bảng này bắt được nó trong vài phút, thay vì trong hoá đơn cơ sở dữ liệu tháng sau.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · Pool: mở, bận, rảnh, đang đợi</span><span class="lz-lnote">Bốn đường từ các đồng hồ của pool. "Bận" leo lên gần "mở" nghĩa là bão hoà đang tới; <code>queries_wait</code> lớn hơn không nghĩa là nó tới rồi.</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · Kết nối PostgreSQL theo trạng thái</span><span class="lz-lnote">Từ <code>pg_stat_activity</code>: idle, active, idle in transaction. Đường thứ ba lẽ ra phải phẳng ở không, và khi nó không phẳng thì Bài 7.1 giải thích bạn đang nhìn cái gì.</span></div>
  <div class="lz-layer"><span class="lz-lname">5 · Tỉ lệ lỗi theo MÃ Prisma</span><span class="lz-lnote">Một bộ đếm gắn nhãn <code>P2002</code>, <code>P2024</code>, <code>P2025</code>, <code>P1001</code>. Gom theo mã biến "lỗi đang tăng" thành một CHẨN ĐOÁN — <code>P2002</code> tăng là thay đổi sản phẩm, <code>P2024</code> tăng là hạ tầng.</span></div>
  <div class="lz-layer"><span class="lz-lname">6 · Số truy vấn chậm mỗi phút</span><span class="lz-lnote">Đếm truy vấn trên 100 ms, từ móc <code>$on('query')</code> của Bài 11.5. Một cú nhảy bậc ở đây LUÔN đi trước cảnh báo độ trễ, thường là vài tiếng.</span></div>
  <div class="lz-layer"><span class="lz-lname">7 · Bảng lớn lên và dead tuple</span><span class="lz-lnote"><code>n_live_tup</code> và <code>n_dead_tup</code> từ <code>pg_stat_user_tables</code>. Tỉ lệ dead tuple cứ leo mà không tụt nghĩa là autovacuum không theo kịp, và cái bảng đang từ từ chậm đi mà không có lý do nào nhìn thấy được.</span></div>
  <div class="lz-layer"><span class="lz-lname">8 · Dung lượng trống trên ổ chứa cơ sở dữ liệu</span><span class="lz-lnote">Bảng NHÀM CHÁN nhất và là cái ngăn được sự cố TỆ nhất. Một cơ sở dữ liệu đầy đĩa thì không suy giảm dần dần — nó DỪNG, và khôi phục có nghĩa là phải tìm ra chỗ trống trước khi nó chịu khởi động lại.</span></div>
</div>

<h3>Tám cảnh báo, kèm ngưỡng</h3>
<pre><code><span class="tok-comment"># prometheus/canh-bao.yml</span>
groups:
- name: prisma
  rules:
  - alert: PoolCanKiet
    expr: prisma_client_queries_wait &gt; 0
    for: 5m
    annotations:
      summary: "Truy van dang xep hang cho ket noi ({{ \\$value }} dang doi)"
      runbook: "Bai 9.4 · kiem idle in transaction truoc khi nang connection_limit"

  - alert: KetNoiGanTran
    expr: sum(pg_stat_activity_count) / on() pg_settings_max_connections &gt; 0.8
    for: 5m

  - alert: GiaoDichTreoLau
    expr: pg_stat_activity_max_tx_duration{state="idle in transaction"} &gt; 60
    for: 2m

  - alert: DiaSapDay
    expr: node_filesystem_avail_bytes{mountpoint="/var/lib/postgresql"} 
          / node_filesystem_size_bytes &lt; 0.20
    for: 10m</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">1 · <code>queries_wait &gt; 0</code> trong 5 phút</span><span class="v">Không là giá trị BÌNH THƯỜNG, nên mọi con số dương kéo dài đều là thật. Năm phút lọc bỏ cú khởi động lạnh của một lần deploy. Cái này nổ TRƯỚC khi người dùng nhận ra, và đó là toàn bộ ý nghĩa của nó.</span></div>
  <div class="kv"><span class="k">2 · Kết nối vượt 80% của <code>max_connections</code></span><span class="v">Chừa hai mươi phần trăm là đủ cho một phiên <code>psql</code> và một job migration — đúng những thứ bạn cần CÒN DÙNG ĐƯỢC trong lúc xảy ra cái sự cố mà cảnh báo này đang báo trước.</span></div>
  <div class="kv"><span class="k">3 · <code>idle in transaction</code> quá 60 giây</span><span class="v">Một giao dịch khoẻ mạnh kéo dài mili giây. Sáu mươi giây không phải một giao dịch CHẬM, đó là một giao dịch KẸT — và nó giữ khoá suốt cả quãng đó.</span></div>
  <div class="kv"><span class="k">4 · Đĩa trống dưới 20%</span><span class="v">Dưới 20% bạn còn thời gian hành động; dưới 5% là bạn có một cú chết. Hai mươi phần trăm của một ổ 40 GB là 8 GB, tức chỉ vài phút dự trữ nếu có thứ gì đang ghi nhanh — nên là <code>for: 10m</code>, không phải một tiếng.</span></div>
  <div class="kv"><span class="k">5 · Tỉ lệ lỗi theo mã vượt mức nền</span><span class="v">KHÔNG phải một con số tuyệt đối — <code>P2002</code> có một mức nền lành mạnh từ những lần đăng ký trùng. Hãy cảnh báo theo BỘI SỐ của mức trung bình bảy ngày, tính riêng cho từng mã.</span></div>
  <div class="kv"><span class="k">6 · Độ trễ p99 vượt 2 lần mức nền tuần</span><span class="v">Một ngưỡng tuyệt đối già đi rất tệ khi sản phẩm thay đổi. Một TỈ SỐ so với cùng thứ trong tuần trước thì sống sót qua tăng trưởng và vẫn bắt được thoái lui.</span></div>
  <div class="kv"><span class="k">7 · Còn migration chờ sau khi deploy</span><span class="v">Không phải một chỉ số — một BƯỚC deploy. <code>migrate status</code> thoát với mã khác 0 và đường ống dừng lại, theo Bài 11.3. Rẻ hơn mọi cảnh báo, vì nó NGĂN cái trạng thái đó thay vì báo cáo nó.</span></div>
  <div class="kv"><span class="k">8 · Số lần container khởi động lại lớn hơn không</span><span class="v">Cảnh báo bắt được Bài 11.1. Một container đang khởi động lại là kiểu hỏng DUY NHẤT mà ứng dụng không thể báo cáo gì về chính nó, nên tín hiệu bắt buộc phải tới TỪ BÊN NGOÀI nó.</span></div>
</div>

<h3>Cái cảnh báo đĩa KHÔNG phải chuyện lý thuyết</h3>
<div class="note-ct">
<p><strong>CuongThai, 18/08/2026 — một lần deploy chết với <code>no space left on device</code>.</strong> Cache build của Docker đã phình lên 7,6 GB trên CÙNG cái ổ với PostgreSQL, và đĩa tụt xuống còn 1,8 GB trống trong lúc <code>next build</code> đang chạy. Cách vá tức thì là dọn dẹp; cách vá về CẤU TRÚC là <code>deploy-nha.sh</code> — dựng ở máy nhà rồi đẩy ảnh lên GHCR, nên VPS không còn giữ cache build nào cả. Một cron hằng tuần (<code>vps-cleanup-weekly.yml</code>) thu hồi dung lượng theo lịch, và mấy secret <code>VPS_HOST</code> / <code>VPS_USER</code> / <code>VPS_SSH_PRIVATE_KEY</code> mà nó cần nằm trong danh sách không-bao-giờ-xoá chính vì gỡ chúng đi sẽ giết cái job đó một cách <em>CÂM LẶNG</em>. Một cơ sở dữ liệu dùng chung đĩa với bất cứ thứ gì biết lớn lên thì cần cái cảnh báo đĩa hơn là cần mọi chỉ số truy vấn.</p>
</div>

<h3>Những thứ KHÔNG nên cảnh báo</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">✗</span><span class="lz-t">Từng truy vấn chậm lẻ</span><span class="lz-d">Một truy vấn quá 500 ms không phải sự cố; một TỈ LỆ kéo dài của chúng thì có. Hãy cảnh báo theo tỉ lệ, còn từng cái thì vẽ đồ thị.</span></div>
  <div class="lz-step"><span class="lz-k">✗</span><span class="lz-t">CPU của cơ sở dữ liệu</span><span class="lz-d">Một cơ sở dữ liệu chạy 80% CPU là một cơ sở dữ liệu đang được DÙNG. Cái quan trọng là độ trễ có dịch chuyển không — hãy cảnh báo theo triệu chứng người dùng CẢM NHẬN, đừng cảnh báo theo tài nguyên.</span></div>
  <div class="lz-step"><span class="lz-k">✗</span><span class="lz-t">Mọi cái <code>P2002</code></span><span class="lz-d">Hai người đăng ký cùng một email là cái ràng buộc đang làm đúng việc của nó. Cảnh báo chuyện đó dạy cả nhóm rằng những cảnh báo này là nhiễu, và đó là cách cảnh báo số 1 cũng bị lờ luôn.</span></div>
  <div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">Những thứ CẦN một con người ngay đêm nay</span><span class="lz-d">Đó là toàn bộ phép thử. Nếu câu trả lời lúc ba giờ sáng là "mai xem", thì nó là một bảng đồ thị, không phải một cú gọi. Một cảnh báo không ai hành động sẽ huấn luyện mọi người không hành động với cái nào cả.</span></div>
</div>
<div class="callout warn">
<p><strong>Mọi cảnh báo đều cần một liên kết tới sổ tay vận hành, và liên kết đó phải DẪN TỚI ĐÂU ĐÓ.</strong> Cái annotation trong luật ở trên trỏ vào Bài 9.4 là có lý do: một cảnh báo nổ lúc ba giờ sáng mà không có hướng dẫn là một cảnh báo sẽ bị bấm xác nhận rồi bỏ qua. Một dòng thôi — nó nghĩa là gì, câu lệnh đầu tiên phải chạy, và cái việc KHÔNG được làm — biến một cú gọi thành một quy trình. Với tài liệu của khoá này, cái dòng đó thường chỉ là một số bài.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/observability-and-logging/metrics" target="_blank" rel="noopener"><span class="lc-ico">📊</span><span class="lc-body"><span class="lc-title">Prisma — chỉ số</span><span class="lc-sub">prisma.io/docs · Mọi gauge, counter và histogram, và định dạng Prometheus</span></span></a>
<a class="link-card" href="https://github.com/prometheus-community/postgres_exporter" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">postgres_exporter</span><span class="lc-sub">github.com · Biến các khung nhìn pg_stat của Bài 12.3 thành chỉ số Prometheus</span></span></a>
<a class="link-card" href="https://prometheus.io/docs/practices/alerting/" target="_blank" rel="noopener"><span class="lc-ico">🔔</span><span class="lc-body"><span class="lc-title">Prometheus — thực hành cảnh báo</span><span class="lc-sub">prometheus.io · Cảnh báo theo triệu chứng, và vì sao cảnh báo theo tài nguyên già đi tệ</span></span></a>
<a class="link-card" href="https://sre.google/workbook/alerting-on-slos/" target="_blank" rel="noopener"><span class="lc-ico">🎯</span><span class="lc-body"><span class="lc-title">Google SRE — cảnh báo theo SLO</span><span class="lc-sub">sre.google · Khung tư duy đằng sau câu "cảnh báo theo thứ người dùng cảm nhận"</span></span></a>
<a class="link-card" href="/courses/docker/learn${REF}"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Docker</span><span class="lc-sub">Cache build, volume và cái đĩa mà tất cả cùng dùng chung</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Nối $metrics vào Prometheus, rồi cố ý làm cho từng cái trong tám cảnh báo nổ</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 12.5 ─────────────────────────── */
    {
      title: '12.5 — What you know now, and where to go next|||12.5 — Giờ bạn biết gì, và đi tiếp về đâu',
      slug: 'pr-12-5-ket-khoa',
      type: 'LESSON',
      description: 'Tổng kết mười ba mục thành sáu ý đáng giữ lại, một dự án tự chứng minh với sáu mốc đo được, và bản đồ đi tiếp — những khoá CuongThai kế cận, và những thứ khoá này CỐ Ý không dạy.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.5</span>
<h2>What you know now, and where to go next</h2>
<p class="lead">Thirteen sections ago this course started with a claim: that most Prisma problems are not Prisma problems but database problems wearing a TypeScript costume. Everything since has been evidence for it. Here is what that adds up to, what to keep when the syntax changes, and what to build next to find out whether it stuck.</p>

<h3>The thirteen sections, in one line each</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">0 · What Prisma solves</span><span class="lz-lnote">The problem an ORM exists for, and a working local setup — schema, generate, first query.</span></div>
  <div class="lz-layer"><span class="lz-lname">1 · What an ORM actually is</span><span class="lz-lnote">The impedance mismatch, the four pieces of Prisma, and why the engine is a Rust binary that ships in your image.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · The schema language</span><span class="lz-lnote">Models, scalar types, attributes, enums, indexes — and that <code>@@unique(name:)</code> changes what your queries must be called.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · Relations</span><span class="lz-lnote">Every relation has two sides; the missing one is a <code>generate</code> failure. One-to-many, many-to-many, self-relations, referential actions.</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · Reading and writing</span><span class="lz-lnote">Six ways to read, nested writes, <code>connect</code> versus <code>create</code>, <code>upsert</code>, and what each generates.</span></div>
  <div class="lz-layer"><span class="lz-lname">5 · Querying deeply</span><span class="lz-lnote">Filter operators, relation filters, <code>groupBy</code>, full-text and trigram search, and where the builder's expressiveness ends.</span></div>
  <div class="lz-layer"><span class="lz-lname">6 · Migrations</span><span class="lz-lnote">The history table, <code>dev</code> versus <code>deploy</code>, baselines, and what a failed migration means — the chapter that keeps data alive.</span></div>
  <div class="lz-layer"><span class="lz-lname">7 · Transactions and concurrency</span><span class="lz-lnote">Two transaction forms, isolation levels, lost updates, advisory locks, and retrying what should be retried.</span></div>
  <div class="lz-layer"><span class="lz-lname">8 · The generated type system</span><span class="lz-lnote">Types derived from the schema, <code>GetPayload</code>, why a hand-copied union is a bug waiting for a rename.</span></div>
  <div class="lz-layer"><span class="lz-lname">9 · Performance</span><span class="lz-lnote">Measure first, N+1 in four shapes, indexes chosen by the query, pool sizing as arithmetic, and the query you delete.</span></div>
  <div class="lz-layer"><span class="lz-lname">10 · Escape hatches</span><span class="lz-lnote">Raw SQL safely, what only SQL can say, TypedSQL, and <code>$extends</code> — with the three gaps soft delete does not close.</span></div>
  <div class="lz-layer"><span class="lz-lname">11 · Shipping to production</span><span class="lz-lnote">The engine in the image, the Dockerfile's three rules, the deploy window, seeds versus backfills, and how a process should die.</span></div>
  <div class="lz-layer"><span class="lz-lname">12 · Diagnosis</span><span class="lz-lnote">Five minutes of triage, seven failure shapes by error code, ten tools, and the alerts that fire before users notice.</span></div>
</div>

<h3>Six ideas worth keeping when the syntax changes</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Prisma writes SQL, so read the SQL</span><span class="lz-d">Every performance question in Chapter 9 was answered by looking at what was actually sent. The builder is a convenience over a database that has not changed; when the convenience surprises you, drop one level.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">The schema is the source of truth, and it is checked</span><span class="lz-d">Types derived from it catch renames at compile time. Every copy you make by hand — a union, an interface, a column list — is a place that will silently stop matching.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Migrations are append-only history, not a diff tool</span><span class="lz-d">Applied migrations are immutable. A failed one is reported and decided with a human, never auto-resolved. This is the rule whose violation cannot be undone.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Deploys have a window, not an instant</span><span class="lz-d">Old code meets new schema for as long as the swap takes. Expand, backfill, contract — three deploys — is what "safe migration" actually means.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Measure before you change anything</span><span class="lz-d">Pool sizes, indexes, caches, model choices. Every number in this course came from a measurement, and several of them contradicted what the price list or the documentation implied.</span></div>
  <div class="lz-step"><span class="lz-k">6</span><span class="lz-t">A green build does not mean a runnable image</span><span class="lz-d">The most expensive lesson here, bought with seven minutes of 502. Verify the artefact you are about to ship, not the process that produced it.</span></div>
</div>

<h3>Prove it to yourself: one project, six milestones</h3>
<pre><code><span class="tok-comment"># A small forum. Not a tutorial to follow — a checklist to satisfy.</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">1 · Schema with three relation kinds</span><span class="v">Users, posts, comments (self-relating for replies), tags (many-to-many). Every back-relation present, <code>prisma format</code> clean, indexes chosen from the queries you intend to run — not from the columns that look important.</span></div>
  <div class="kv"><span class="k">2 · A feed endpoint with no N+1</span><span class="v">Cursor pagination, <code>select</code> rather than <code>include</code>, comment counts via <code>_count</code>. Prove it: one query in the log per request, at any page number.</span></div>
  <div class="kv"><span class="k">3 · One thing that needs a transaction</span><span class="v">A vote that updates a counter, or a transfer between two balances. Write the version with the lost update, observe it under concurrency, then fix it with an atomic <code>increment</code> or the right isolation level.</span></div>
  <div class="kv"><span class="k">4 · One thing the builder cannot express</span><span class="v">A leaderboard with ranks, or the comment tree as a recursive CTE. Write it as raw SQL, then as TypedSQL, and rename a column to watch the build catch it.</span></div>
  <div class="kv"><span class="k">5 · A column rename across three deploys</span><span class="v">Expand, backfill with a resumable chunked script, contract. At each step, check that the previous image still works — that check is the entire exercise.</span></div>
  <div class="kv"><span class="k">6 · A Dockerfile you verified</span><span class="v">Multi-stage, generate on the runtime base, and a build script that constructs a <code>PrismaClient</code> inside the finished image before pushing. Then break <code>binaryTargets</code> on purpose and confirm the check stops you.</span></div>
</div>
<div class="callout ok">
<p><strong>Milestone 5 is the one that separates people who have used Prisma from people who can run it.</strong> Everything else has a tutorial somewhere. Planning a schema change so that two versions of your code can both work against the database, for the minutes it takes to swap them, is the skill that makes the difference on a system with real users — and it is entirely independent of which ORM you end up using.</p>
</div>

<h3>Where to go next</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">The database itself</span><span class="lz-lnote">Two thirds of this course was PostgreSQL in disguise: locks, indexes, isolation levels, planner behaviour. Learning it directly makes every one of those chapters shallower — in a good way.</span></div>
  <div class="lz-layer"><span class="lz-lname">The layer in front</span><span class="lz-lnote">Redis, for the caching in Lesson 9.5: TTL, eviction, stampede, and invalidation that survives contact with concurrency.</span></div>
  <div class="lz-layer"><span class="lz-lname">The layer around</span><span class="lz-lnote">Docker for the image, and the deployment pipeline that decides when migrations run relative to the container swap. Chapter 11 is the seam between them.</span></div>
  <div class="lz-layer"><span class="lz-lname">Things this course deliberately skipped</span><span class="lz-lnote">MongoDB support, Prisma Accelerate and Pulse, multi-schema and multi-tenant patterns, and the new <code>prisma-client</code> ESM generator. Each is well documented and none changes the six ideas above.</span></div>
</div>
<div class="note-ct">
<p><strong>A closing note on the case studies.</strong> Every incident in this course happened on cuongthai.com: the musl engine that returned 502 for seven minutes, the duplicate constraint name that broke <code>migrate dev</code> permanently, the renamed enum that passed the whole checklist and broke the production seed, the two deploy pipelines racing each other into a 500, the build cache that filled the database's disk. None of them were caused by not knowing Prisma. They were caused by a green signal that did not mean what it appeared to mean — and the fix, every time, was a check that looked at the artefact instead of the process. That is the habit worth taking from here, whatever you build next.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs" target="_blank" rel="noopener"><span class="lc-ico">📘</span><span class="lc-body"><span class="lc-title">Prisma documentation</span><span class="lc-sub">prisma.io/docs · The reference this course paraphrases; read the sections you now have questions about</span></span></a>
<a class="link-card" href="https://github.com/prisma/prisma/releases" target="_blank" rel="noopener"><span class="lc-ico">🆕</span><span class="lc-body"><span class="lc-title">Prisma releases</span><span class="lc-sub">github.com · Preview features graduating, and what changes between minors</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">CuongThai course — PostgreSQL</span><span class="lc-sub">The database underneath all of this, taught on its own terms</span></span></a>
<a class="link-card" href="/courses/redis/learn${REF}"><span class="lc-ico">🔴</span><span class="lc-body"><span class="lc-title">CuongThai course — Redis</span><span class="lc-sub">The cache layer from Lesson 9.5, in full</span></span></a>
<a class="link-card" href="/courses/docker/learn${REF}"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">CuongThai course — Docker</span><span class="lc-sub">Images, layers and the deploy that Chapter 11 assumes</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">The six milestones above, one exercise each, with the checks written for you</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.5</span>
<h2>Giờ bạn biết gì, và đi tiếp về đâu</h2>
<p class="lead">Mười ba mục trước, khoá này mở đầu bằng một khẳng định: phần lớn vấn đề của Prisma không phải vấn đề của Prisma, mà là vấn đề của cơ sở dữ liệu đang mặc bộ đồ TypeScript. Mọi thứ từ đó tới nay là bằng chứng cho khẳng định ấy. Đây là tổng của tất cả, thứ đáng giữ lại khi cú pháp thay đổi, và thứ nên dựng tiếp để biết mình đã thật sự thấm hay chưa.</p>

<h3>Mười ba mục, mỗi mục một dòng</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">0 · Prisma giải cái gì</span><span class="lz-lnote">Bài toán mà ORM sinh ra để giải, và một môi trường chạy được tại máy — lược đồ, generate, truy vấn đầu tiên.</span></div>
  <div class="lz-layer"><span class="lz-lname">1 · ORM THẬT SỰ là gì</span><span class="lz-lnote">Cú lệch trở kháng, bốn mảnh của Prisma, và vì sao engine là một tệp nhị phân Rust đi theo ảnh của bạn.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · Ngôn ngữ lược đồ</span><span class="lz-lnote">Model, kiểu vô hướng, thuộc tính, enum, chỉ mục — và chuyện <code>@@unique(name:)</code> đổi luôn cái tên mà truy vấn của bạn phải dùng.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · Quan hệ</span><span class="lz-lnote">Mọi quan hệ đều có HAI phía; thiếu phía kia là một cú hỏng <code>generate</code>. Một-nhiều, nhiều-nhiều, tự trỏ, hành vi tham chiếu.</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · Đọc và ghi</span><span class="lz-lnote">Sáu cách đọc, ghi lồng nhau, <code>connect</code> đối lại <code>create</code>, <code>upsert</code>, và mỗi cái sinh ra SQL gì.</span></div>
  <div class="lz-layer"><span class="lz-lname">5 · Truy vấn sâu</span><span class="lz-lnote">Toán tử lọc, lọc theo quan hệ, <code>groupBy</code>, tìm kiếm toàn văn và trigram, và chỗ mà sức diễn đạt của trình dựng kết thúc.</span></div>
  <div class="lz-layer"><span class="lz-lname">6 · Migration</span><span class="lz-lnote">Bảng lịch sử, <code>dev</code> đối lại <code>deploy</code>, baseline, và một migration thất bại nghĩa là gì — chương giữ cho dữ liệu còn sống.</span></div>
  <div class="lz-layer"><span class="lz-lname">7 · Giao dịch và tương tranh</span><span class="lz-lnote">Hai dạng giao dịch, mức cô lập, mất cập nhật, advisory lock, và thử lại đúng những thứ đáng thử lại.</span></div>
  <div class="lz-layer"><span class="lz-lname">8 · Hệ kiểu được sinh ra</span><span class="lz-lnote">Kiểu suy từ lược đồ, <code>GetPayload</code>, và vì sao một union chép tay là một con bug đang chờ ai đó đổi tên.</span></div>
  <div class="lz-layer"><span class="lz-lname">9 · Hiệu năng</span><span class="lz-lnote">Đo trước, N+1 bốn hình dạng, chỉ mục do truy vấn chọn, kích thước pool là phép số học, và câu truy vấn bạn XOÁ đi.</span></div>
  <div class="lz-layer"><span class="lz-lname">10 · Cửa thoát hiểm</span><span class="lz-lnote">SQL thô an toàn, thứ chỉ SQL nói được, TypedSQL, và <code>$extends</code> — kèm ba khoảng hở mà soft delete không bịt được.</span></div>
  <div class="lz-layer"><span class="lz-lname">11 · Đưa lên production</span><span class="lz-lnote">Engine trong ảnh, ba luật của Dockerfile, cửa sổ khi deploy, seed đối lại nạp bù, và một tiến trình nên chết thế nào.</span></div>
  <div class="lz-layer"><span class="lz-lname">12 · Chẩn đoán</span><span class="lz-lnote">Năm phút phân loại, bảy hình dáng hỏng hóc theo mã lỗi, mười công cụ, và những cảnh báo nổ trước khi người dùng nhận ra.</span></div>
</div>

<h3>Sáu ý đáng giữ khi cú pháp đổi</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Prisma VIẾT SQL, nên hãy ĐỌC cái SQL đó</span><span class="lz-d">Mọi câu hỏi hiệu năng ở Chương 9 đều được trả lời bằng cách nhìn thứ THẬT SỰ được gửi đi. Trình dựng là một tiện nghi phủ lên một cơ sở dữ liệu chưa hề thay đổi; khi tiện nghi làm bạn bất ngờ, hãy tụt xuống một tầng.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Lược đồ là nguồn sự thật, và nó ĐƯỢC KIỂM</span><span class="lz-d">Kiểu suy ra từ nó bắt được các cú đổi tên ngay lúc biên dịch. Mọi bản sao bạn chép tay — một union, một interface, một danh sách cột — là một chỗ sẽ lặng lẽ ngừng khớp.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Migration là LỊCH SỬ chỉ-thêm, không phải công cụ diff</span><span class="lz-d">Migration đã áp thì bất biến. Cái nào thất bại thì BÁO CÁO và quyết định cùng một con người, không bao giờ tự động resolve. Đây là luật mà vi phạm nó thì không hoàn tác được.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Deploy có một CỬA SỔ, không phải một khoảnh khắc</span><span class="lz-d">Mã cũ gặp lược đồ mới suốt quãng thời gian tráo container. Mở rộng, nạp bù, thu hẹp — ba lần deploy — mới thật sự là nghĩa của "migration an toàn".</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">ĐO trước khi đổi bất cứ thứ gì</span><span class="lz-d">Kích thước pool, chỉ mục, cache, chọn model. Mọi con số trong khoá này đều tới từ một phép đo, và vài con số trong đó MÂU THUẪN với thứ mà bảng giá hay tài liệu ngụ ý.</span></div>
  <div class="lz-step"><span class="lz-k">6</span><span class="lz-t">Build xanh KHÔNG có nghĩa là ảnh chạy được</span><span class="lz-d">Bài học đắt nhất ở đây, mua bằng bảy phút lỗi 502. Hãy XÁC MINH cái sản phẩm bạn sắp gửi đi, đừng xác minh cái quy trình đã tạo ra nó.</span></div>
</div>

<h3>Tự chứng minh: một dự án, sáu mốc</h3>
<pre><code><span class="tok-comment"># Một diễn đàn nhỏ. Không phải hướng dẫn để làm theo — một danh sách để thoả mãn.</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">1 · Lược đồ có đủ ba kiểu quan hệ</span><span class="v">Người dùng, bài viết, bình luận (tự trỏ để có trả lời), thẻ (nhiều-nhiều). Đủ mọi back-relation, <code>prisma format</code> sạch, chỉ mục chọn từ những TRUY VẤN bạn định chạy — không phải từ những cột trông có vẻ quan trọng.</span></div>
  <div class="kv"><span class="k">2 · Một endpoint feed KHÔNG N+1</span><span class="v">Phân trang bằng con trỏ, <code>select</code> chứ không <code>include</code>, số bình luận qua <code>_count</code>. Chứng minh đi: MỘT truy vấn trong nhật ký cho mỗi request, ở số trang bất kỳ.</span></div>
  <div class="kv"><span class="k">3 · Một thứ CẦN giao dịch</span><span class="v">Một lượt bình chọn cập nhật bộ đếm, hoặc một lần chuyển tiền giữa hai số dư. Hãy viết bản CÓ mất cập nhật, quan sát nó dưới tương tranh, rồi vá bằng <code>increment</code> nguyên tử hoặc bằng đúng mức cô lập.</span></div>
  <div class="kv"><span class="k">4 · Một thứ trình dựng KHÔNG diễn đạt nổi</span><span class="v">Một bảng xếp hạng có thứ hạng, hoặc cây bình luận bằng CTE đệ quy. Viết nó bằng SQL thô, rồi bằng TypedSQL, rồi đổi tên một cột để xem bản dựng bắt được nó.</span></div>
  <div class="kv"><span class="k">5 · Đổi tên một cột qua BA lần deploy</span><span class="v">Mở rộng, nạp bù bằng một script chia lô nối lại được, thu hẹp. Ở MỖI bước, hãy kiểm rằng cái ảnh TRƯỚC ĐÓ vẫn chạy — chính phép kiểm đó mới là toàn bộ bài tập.</span></div>
  <div class="kv"><span class="k">6 · Một Dockerfile bạn ĐÃ XÁC MINH</span><span class="v">Nhiều tầng, generate trên nền runtime, và một script build dựng một <code>PrismaClient</code> bên trong ảnh đã hoàn tất TRƯỚC khi đẩy. Rồi cố ý phá <code>binaryTargets</code> và xác nhận rằng chốt kiểm chặn bạn lại.</span></div>
</div>
<div class="callout ok">
<p><strong>Mốc số 5 là thứ phân biệt người ĐÃ DÙNG Prisma với người VẬN HÀNH ĐƯỢC nó.</strong> Mọi mốc khác đều có hướng dẫn ở đâu đó. Lên kế hoạch cho một thay đổi lược đồ sao cho HAI phiên bản mã của bạn đều chạy được với cơ sở dữ liệu, suốt mấy phút tráo container — đó là kỹ năng tạo ra khác biệt trên một hệ thống có người dùng thật, và nó hoàn toàn ĐỘC LẬP với chuyện rốt cuộc bạn dùng ORM nào.</p>
</div>

<h3>Đi tiếp về đâu</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Chính cơ sở dữ liệu</span><span class="lz-lnote">Hai phần ba khoá này là PostgreSQL đội lốt: khoá, chỉ mục, mức cô lập, hành vi của bộ lập kế hoạch. Học nó trực tiếp làm cho mọi chương đó CẠN đi — theo nghĩa tốt.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tầng đứng trước</span><span class="lz-lnote">Redis, cho phần cache của Bài 9.5: TTL, đẩy khoá, stampede, và vô hiệu hoá sống sót nổi khi va vào tương tranh.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tầng bao quanh</span><span class="lz-lnote">Docker cho cái ảnh, và đường ống triển khai quyết định migration chạy vào lúc nào so với lúc tráo container. Chương 11 chính là đường nối giữa chúng.</span></div>
  <div class="lz-layer"><span class="lz-lname">Những thứ khoá này CỐ Ý bỏ qua</span><span class="lz-lnote">Hỗ trợ MongoDB, Prisma Accelerate và Pulse, các mẫu multi-schema và multi-tenant, và generator ESM <code>prisma-client</code> mới. Cái nào cũng có tài liệu tốt, và không cái nào làm thay đổi sáu ý ở trên.</span></div>
</div>
<div class="note-ct">
<p><strong>Một lời khép lại về các nghiên cứu tình huống.</strong> Mọi sự cố trong khoá này đều xảy ra trên cuongthai.com: cái engine musl trả 502 suốt bảy phút, cái ràng buộc trùng tên làm <code>migrate dev</code> hỏng vĩnh viễn, cái enum đổi tên đi qua sạch cả danh sách kiểm rồi làm vỡ seed trên production, hai đường ống deploy đua nhau tới một lỗi 500, cái cache build làm đầy ổ đĩa của cơ sở dữ liệu. Không cái nào do KHÔNG BIẾT Prisma cả. Chúng do một tín hiệu MÀU XANH không mang cái nghĩa mà nó trông như đang mang — và cách vá, LẦN NÀO CŨNG VẬY, là một phép kiểm nhìn vào SẢN PHẨM thay vì nhìn vào quy trình. Đó là thói quen đáng mang theo từ đây, dù sau này bạn dựng cái gì.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs" target="_blank" rel="noopener"><span class="lc-ico">📘</span><span class="lc-body"><span class="lc-title">Tài liệu Prisma</span><span class="lc-sub">prisma.io/docs · Bản tham chiếu mà khoá này diễn giải lại; hãy đọc những mục mà giờ bạn ĐÃ CÓ câu hỏi</span></span></a>
<a class="link-card" href="https://github.com/prisma/prisma/releases" target="_blank" rel="noopener"><span class="lc-ico">🆕</span><span class="lc-body"><span class="lc-title">Bản phát hành Prisma</span><span class="lc-sub">github.com · Tính năng xem trước tốt nghiệp, và cái gì đổi giữa hai bản minor</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — PostgreSQL</span><span class="lc-sub">Cơ sở dữ liệu nằm dưới tất cả những thứ này, dạy theo cách của chính nó</span></span></a>
<a class="link-card" href="/courses/redis/learn${REF}"><span class="lc-ico">🔴</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Redis</span><span class="lc-sub">Tầng cache của Bài 9.5, đầy đủ</span></span></a>
<a class="link-card" href="/courses/docker/learn${REF}"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Docker</span><span class="lc-sub">Ảnh, tầng và cái quy trình deploy mà Chương 11 giả định bạn đã có</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Sáu mốc ở trên, mỗi mốc một bài tập, kèm sẵn các phép kiểm viết hộ bạn</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 12.6 ─────────────────────────── */
    {
      title: '12.6 — Final exam: the whole course|||12.6 — Thi cuối khoá: toàn bộ khoá học',
      slug: 'pr-12-6-quiz-cuoi',
      type: 'QUIZ',
      description: 'Mười hai câu trải từ Mục 0 tới Chương 12: lược đồ, quan hệ, migration, giao dịch, kiểu, hiệu năng, SQL thô, production và chẩn đoán. 18 phút.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.6</span>
<h2>Final exam: the whole course</h2>
<p class="lead">Twelve questions, one from each section, eighteen minutes. They are not recall questions — each one describes a situation and asks what you would do, which is the only form the material was ever for.</p>
<div class="callout">
<p><strong>Before you start.</strong> If you are unsure on a question, prefer the answer that measures or verifies over the one that changes something. That heuristic is correct in this exam and it is correct in production, which is not a coincidence.</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.6</span>
<h2>Thi cuối khoá: toàn bộ khoá học</h2>
<p class="lead">Mười hai câu, mỗi mục một câu, mười tám phút. Chúng không phải câu hỏi học thuộc — mỗi câu mô tả một TÌNH HUỐNG và hỏi bạn sẽ làm gì, và đó là hình thức DUY NHẤT mà tài liệu này sinh ra để phục vụ.</p>
<div class="callout">
<p><strong>Trước khi bắt đầu.</strong> Nếu bạn phân vân ở một câu, hãy chọn đáp án nào ĐO hoặc XÁC MINH thay vì đáp án nào THAY ĐỔI thứ gì đó. Kinh nghiệm ngón tay cái ấy đúng trong bài thi này và cũng đúng trên production, và đó không phải trùng hợp.</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 1080,
        questions: [
          {
            question: 'prisma generate has never been run in a fresh clone. What works and what does not?|||Trong một bản clone mới, prisma generate chưa từng chạy. Cái gì chạy được và cái gì không?',
            options: [
              'Everything works; the client is published on npm|||Mọi thứ chạy bình thường; client được phát hành trên npm',
              'Nothing that imports PrismaClient works — the client and its Rust engine are generated from your schema, not installed by npm ci alone|||Không thứ gì import PrismaClient chạy được — client và engine Rust của nó được SINH RA từ lược đồ của bạn, chứ không phải do npm ci cài về',
              'Only raw queries work|||Chỉ truy vấn thô chạy được',
              'It works but without types|||Chạy được nhưng không có kiểu',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You add posts SocialPost[] to User but nothing to SocialPost. What happens?|||Bạn thêm posts SocialPost[] vào User nhưng không thêm gì vào SocialPost. Chuyện gì xảy ra?',
            options: [
              'prisma generate fails: every relation needs its opposite field, and Prisma cannot infer the foreign key side|||prisma generate hỏng: mọi quan hệ đều cần trường đối diện, và Prisma không suy ra được phía khoá ngoại',
              'It works; Prisma infers the reverse relation|||Vẫn chạy; Prisma tự suy ra quan hệ ngược',
              'It works but the relation is read-only|||Chạy được nhưng quan hệ thành chỉ-đọc',
              'It creates an implicit join table|||Nó tạo một bảng nối ngầm',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A model has @@unique([subjectId, recipientId], name: "uk_note_subject_share"). How must the query name it?|||Một model có @@unique([subjectId, recipientId], name: "uk_note_subject_share"). Truy vấn phải gọi nó là gì?',
            options: [
              'where: { subjectId_recipientId: { … } } — the default compound name|||where: { subjectId_recipientId: { … } } — tên ghép mặc định',
              'where: { uk_note_subject_share: { subjectId, recipientId } } — the custom name replaces the default one|||where: { uk_note_subject_share: { subjectId, recipientId } } — tên tự đặt THAY THẾ tên mặc định',
              'Either name works|||Gọi tên nào cũng được',
              'The fields must be queried separately|||Phải truy vấn từng trường riêng ra',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You need to attach an existing tag to a new post. connect or create?|||Bạn cần gắn một thẻ ĐÃ CÓ vào một bài viết mới. connect hay create?',
            options: [
              'create — it will reuse the row if it exists|||create — nó sẽ dùng lại hàng nếu đã tồn tại',
              'connect — create makes a new row, and on a unique column it fails with P2002; connectOrCreate covers the "maybe exists" case|||connect — create tạo hàng MỚI, và trên một cột duy nhất nó hỏng với P2002; connectOrCreate lo trường hợp "có thể đã có"',
              'Neither; write the join row directly|||Không cái nào; hãy ghi thẳng hàng nối',
              'set — it replaces the whole relation|||set — nó thay thế toàn bộ quan hệ',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'migrate dev fails with P3006 on a migration that has been running in production for months. What does that mean?|||migrate dev hỏng với P3006 trên một migration đã chạy trên production nhiều tháng. Điều đó nghĩa là gì?',
            options: [
              'Production is corrupted and must be restored|||Production đã hỏng và phải khôi phục lại',
              'The failure is on the shadow database: that migration cannot replay from scratch. Production is untouched — and an already-deployed migration must not be edited to fix it|||Cú hỏng nằm ở shadow database: migration đó không phát lại được từ đầu. Production KHÔNG hề bị đụng tới — và một migration đã deploy thì KHÔNG được sửa để chữa nó',
              'The migration was never really applied|||Cái migration đó thật ra chưa từng được áp',
              'Prisma needs to be downgraded|||Cần hạ phiên bản Prisma xuống',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Two requests read a counter of 10 and both write 11. What is the fix?|||Hai request cùng đọc bộ đếm bằng 10 rồi cả hai cùng ghi 11. Cách vá là gì?',
            options: [
              'An atomic update — { so: { increment: 1 } } — which reads and writes in one statement; or Serializable isolation with a retry|||Một cập nhật NGUYÊN TỬ — { so: { increment: 1 } } — đọc và ghi trong MỘT câu lệnh; hoặc mức cô lập Serializable kèm thử lại',
              'Wrap both reads in a transaction|||Bọc cả hai lệnh đọc trong một giao dịch',
              'Retry on failure|||Cứ thử lại khi hỏng',
              'Add an index on the counter column|||Thêm chỉ mục lên cột bộ đếm',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why is a hand-copied union type next to a Prisma enum a bug waiting to happen?|||Vì sao một union chép tay nằm cạnh một enum Prisma là con bug đang chờ xảy ra?',
            options: [
              'It is slower at runtime|||Nó chậm hơn lúc chạy',
              'It type-checks against itself, so renaming the enum in the schema leaves it compiling and failing at runtime — import from @prisma/client instead|||Nó tự kiểm kiểu với CHÍNH NÓ, nên đổi tên enum trong lược đồ vẫn biên dịch trót lọt rồi hỏng lúc chạy — hãy import từ @prisma/client',
              'Prisma forbids duplicate type names|||Prisma cấm trùng tên kiểu',
              'It breaks tree-shaking|||Nó phá tree-shaking',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Latency is up, no errors. What is the first thing you do?|||Độ trễ tăng, không lỗi nào. Việc ĐẦU TIÊN bạn làm là gì?',
            options: [
              'Raise connection_limit|||Nâng connection_limit',
              'Add indexes to the biggest tables|||Thêm chỉ mục cho những bảng lớn nhất',
              'Capture queries with durations and rank by count × duration, then EXPLAIN ANALYZE the top one|||Bắt truy vấn kèm thời lượng rồi xếp hạng theo số lần × thời lượng, sau đó EXPLAIN ANALYZE câu đứng đầu',
              'Put Redis in front of the database|||Đặt Redis đứng trước cơ sở dữ liệu',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Which of these needs raw SQL, because the query builder cannot express it?|||Cái nào sau đây CẦN SQL thô, vì trình dựng truy vấn không diễn đạt nổi?',
            options: [
              'Filtering posts by author and ordering by date|||Lọc bài theo tác giả rồi sắp xếp theo ngày',
              'Counting comments per post|||Đếm số bình luận cho mỗi bài',
              'A leaderboard with rank() and a running total, or a comment tree of unknown depth|||Một bảng xếp hạng có rank() và tổng luỹ tiến, hoặc một cây bình luận sâu không biết trước',
              'Paginating with a cursor|||Phân trang bằng con trỏ',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'A soft-delete $extends filters findMany on SocialPost. Name a path that still returns deleted rows.|||Một $extends soft delete lọc findMany trên SocialPost. Hãy chỉ ra một đường VẪN trả về hàng đã xoá.',
            options: [
              'Any $queryRaw, any include that reaches posts through User, and any database-level cascade|||Bất kỳ $queryRaw nào, bất kỳ include nào đi tới posts qua User, và bất kỳ cascade nào ở mức cơ sở dữ liệu',
              'There is none; $allOperations covers everything|||Không có đường nào; $allOperations phủ hết',
              'Only findFirst|||Chỉ findFirst thôi',
              'Only queries inside a transaction|||Chỉ những truy vấn bên trong một giao dịch',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'The deploy is green at every step and the API 502s in a restart loop. Where do you look first?|||Deploy xanh ở mọi bước mà API thì 502 trong một vòng lặp khởi động lại. Bạn nhìn vào đâu trước?',
            options: [
              'The load balancer configuration|||Cấu hình bộ cân bằng tải',
              'The container logs for a Prisma engine load error — the libc of the image versus the binaryTarget the client was generated with|||Nhật ký container tìm lỗi nạp engine Prisma — libc của cái ảnh đối lại binaryTarget mà client được sinh ra cùng',
              'The database CPU graph|||Đồ thị CPU của cơ sở dữ liệu',
              'The migration history|||Lịch sử migration',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'migrate deploy reports P3009: a migration failed part-way. What is the correct next step?|||migrate deploy báo P3009: một migration hỏng giữa chừng. Bước tiếp theo ĐÚNG là gì?',
            options: [
              'Run migrate resolve --applied so the pipeline can continue|||Chạy migrate resolve --applied để đường ống chạy tiếp',
              'Run migrate reset and re-seed|||Chạy migrate reset rồi seed lại',
              'Rewrite the migration with IF NOT EXISTS and re-run it|||Viết lại migration bằng IF NOT EXISTS rồi chạy lại',
              'Stop: read the migration, run migrate diff against the live database to see what actually applied, then report the error, the migration name and a proposed fix, and decide with a human|||DỪNG LẠI: đọc migration, chạy migrate diff đối chiếu cơ sở dữ liệu đang chạy để xem thật sự cái gì đã áp, rồi báo cáo lỗi, tên migration và đề xuất cách vá, và quyết định cùng một con người',
            ],
            correctIndex: 3,
            points: 1,
          },
        ],
      },
    },
  ],
};
