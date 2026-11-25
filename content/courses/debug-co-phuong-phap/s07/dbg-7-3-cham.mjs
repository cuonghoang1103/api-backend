/**
 * 7.3 — Truy vấn chậm: đọc EXPLAIN ANALYZE vừa đủ để tìm nguyên nhân (soạn 24/11/2026, máy nhà Linux).
 * Output THẬT: PostgreSQL 16.16 (container dbg-pg), DB labflow_lon (2.000 phòng, 50.000 người, 2.000.000 lượt đặt — tools/c73-nap.sql),
 * auto_explain + log_min_duration_statement, API Prisma 6.19.3 của bài 7.1 — scratchpad/dbg/lab/ch7 (tools/c73-*.sql/.sh; o-73-*.txt).
 */
import { nguon, lienKet } from '../_chung.mjs';
import { NAP_LON } from './_ma-7.mjs';
import { EX_A, EX_B, EX_C, THONG_KE, LOG_CHAM, LOG_SERVER, TIMEOUT, JOIN_INDEX } from './_ra-7.mjs';

const ma = (s, lang = 'js') => `<pre><code class="language-${lang}">${s}</code></pre>`;
const ra = (s) => `<div class="out">${s}</div>`;

const MA_SUA_C = ma(`-- Sửa C: chỉ mục biểu thức khớp ĐÚNG biểu thức trong WHERE…
CREATE INDEX "NguoiDung_email_lower_idx" ON "NguoiDung" (lower(email));
-- …hoặc chuẩn hoá khi ghi (lưu email đã lower) và so sánh bằng "=" như thường.
-- LIKE '%x%' (ký tự đại diện ở đầu) không dùng được B-tree: cần pg_trgm + GIN, xem khoá PostgreSQL.`, 'sql');

const MA_PRISMA_INDEX = ma(`model DatLich {
  // …
  @@index([phongId, batDau])   // Prisma KHÔNG tự tạo index cho khoá ngoại trên PostgreSQL — phải khai báo
  @@index([nguoiId])
}`, 'prisma');

const BANG_DOC_EN = `<table>
<thead><tr><th>Read this</th><th>It tells you</th><th>Suspicious when</th></tr></thead>
<tbody>
<tr><td>The innermost node with the biggest <code>actual time</code></td><td>Where the time goes (times are cumulative upwards)</td><td>It is a <code>Seq Scan</code> on a big table returning few rows</td></tr>
<tr><td><code>rows=</code> (estimate) vs <code>actual … rows=</code></td><td>Whether the planner knew the data</td><td>Off by 10× or more — the plan was chosen for a different table</td></tr>
<tr><td><code>Rows Removed by Filter</code></td><td>Work thrown away</td><td>Millions removed to keep a handful</td></tr>
<tr><td><code>loops=</code></td><td>How many times the node ran (multiply!)</td><td>Inner side of a Nested Loop with <code>loops</code> in the thousands</td></tr>
<tr><td><code>Buffers: shared hit / read</code></td><td>8 kB pages from cache / from disk</td><td>Tens of thousands of pages for a tiny result</td></tr>
<tr><td><code>Sort Method: external merge  Disk</code></td><td>The sort did not fit in <code>work_mem</code></td><td>Usually a symptom of a bad row estimate above it</td></tr>
</tbody></table>`;

const BANG_DOC_VI = `<table>
<thead><tr><th>Đọc chỗ này</th><th>Nó cho biết</th><th>Đáng nghi khi</th></tr></thead>
<tbody>
<tr><td>Nút trong cùng có <code>actual time</code> lớn nhất</td><td>Thời gian tiêu ở đâu (thời gian cộng dồn lên trên)</td><td>Đó là <code>Seq Scan</code> trên bảng lớn mà trả về rất ít dòng</td></tr>
<tr><td><code>rows=</code> (ước lượng) so với <code>actual … rows=</code></td><td>Planner có hiểu dữ liệu không</td><td>Lệch từ 10 lần trở lên — plan được chọn cho một bảng khác hẳn</td></tr>
<tr><td><code>Rows Removed by Filter</code></td><td>Công sức bị vứt đi</td><td>Bỏ hàng triệu dòng để giữ vài dòng</td></tr>
<tr><td><code>loops=</code></td><td>Nút chạy bao nhiêu lần (hãy nhân lên!)</td><td>Vế trong của Nested Loop với <code>loops</code> hàng nghìn</td></tr>
<tr><td><code>Buffers: shared hit / read</code></td><td>Số trang 8 kB lấy từ cache / từ đĩa</td><td>Hàng chục nghìn trang cho một kết quả bé tí</td></tr>
<tr><td><code>Sort Method: external merge  Disk</code></td><td>Phép sắp xếp không vừa <code>work_mem</code></td><td>Thường là triệu chứng của ước lượng dòng sai ở phía trên</td></tr>
</tbody></table>`;

const NGUON = [
  nguon('🐘', 'PostgreSQL 16 — Using EXPLAIN', 'Đọc cost, rows, actual time, loops; EXPLAIN ANALYZE thật sự chạy câu lệnh.', 'https://www.postgresql.org/docs/16/using-explain.html'),
  nguon('🐘', 'PostgreSQL 16 — auto_explain', 'Ghi plan của câu chậm vào log server: log_min_duration, log_analyze.', 'https://www.postgresql.org/docs/16/auto-explain.html'),
  nguon('🐘', 'PostgreSQL 16 — Client Connection Defaults', 'statement_timeout, lock_timeout, idle_in_transaction_session_timeout.', 'https://www.postgresql.org/docs/16/runtime-config-client.html'),
  nguon('🧯', 'GitLab — Postmortem of database outage of January 31 (2017)', 'Tải cao + trễ đồng bộ, gỡ lỗi vội trên nhầm máy chủ: xoá thư mục dữ liệu của DB chính, mất ~6 giờ dữ liệu.', 'https://about.gitlab.com/blog/2017/02/10/postmortem-of-database-outage-of-january-31/'),
  lienKet({ khoa: 'postgresql', bai: 'postgresql-10-1-doc-explain', title: 'PostgreSQL 10.1 — Đọc một plan: EXPLAIN vs EXPLAIN ANALYZE', sub: 'Đào sâu cost model, mọi loại nút. Bài này chỉ dạy mức "tìm ra nguyên nhân".', cta: 'Mở bài →' }),
  lienKet({ khoa: 'postgresql', bai: 'postgresql-9-3-khong-dung-selectivity-partial', title: 'PostgreSQL 9.3 — Khi chỉ mục KHÔNG được dùng', sub: 'Độ chọn lọc, hàm trên cột, partial index — đầy đủ hơn mục 3 và 4.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'postgresql', bai: 'postgresql-10-2-chien-luoc-join', title: 'PostgreSQL 10.2 — Chiến lược JOIN: Nested Loop, Hash & Merge', sub: 'Vì sao ước lượng 1 dòng làm planner chọn Nested Loop (mục 5).', cta: 'Mở bài →' }),
  lienKet({ khoa: 'prisma-orm', bai: 'pr-9-3-chi-muc', title: 'Prisma ORM 9.3 — Chỉ mục mà truy vấn Prisma dùng được', sub: '@@index, thứ tự cột, chỉ mục cho các mẫu where/orderBy hay gặp.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '7.3 — Slow queries: reading EXPLAIN ANALYZE just enough to find the cause|||7.3 — Truy vấn chậm: đọc EXPLAIN ANALYZE vừa đủ để tìm nguyên nhân',
  slug: 'dbg-7-3-cham',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đọc EXPLAIN (ANALYZE, BUFFERS) để tìm nguyên nhân, không phải để tối ưu sâu — đo thật trên 2 triệu lượt đặt: thiếu index khoá ngoại (Prisma không tự tạo) ⇒ Parallel Seq Scan 28,9 ms, 16.327 trang, thêm index ⇒ 0,04 ms; "batDau"::date và lower(email) làm index vô dụng (34,6 ms / 10 ms so với 0,22 ms / 0,02 ms); thống kê cũ ước 1 dòng thật 300.000 ⇒ Nested Loop 592 ms, ANALYZE xong ⇒ Hash Join 178 ms; bắt câu chậm trên server bằng log_min_duration_statement + auto_explain; statement_timeout chặn câu đắt; index nguoiId làm bản join của Prisma bài 7.1 từ 21 ms còn 3 ms.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>Slow query: find the cause, not a hundred tricks</h2>
<p class="lead">Tuning PostgreSQL is a whole course (the PostgreSQL course, chapters 9–10). Debugging a slow query is narrower and more urgent: which node of the plan takes the time, and which of five common causes put it there. You need to read <code>EXPLAIN ANALYZE</code> well enough to point at one line and say "this". Data for this lesson: a separate database <code>labflow_lon</code> with 2,000 rooms, 50,000 students and 2,000,000 bookings (170 MB), built by one SQL script.</p>

<h3>An everyday picture: finding a book in the library</h3>
<p>Without a catalogue, you walk every shelf (Seq Scan). With a catalogue sorted by author, you jump to the right shelf (Index Scan) — but only if you search by author; asking for "authors whose name in lowercase is…" means walking again. And if the librarian's notes say the history section has one book when it really has 300,000, she will plan to carry them one at a time.</p>
<details><summary>tools/c73-nap.sql — 2 million deterministic bookings</summary>${ma(NAP_LON, 'sql')}</details>

<h3>1. How to read a plan in 60 seconds</h3>
<p><code>EXPLAIN</code> shows the plan the planner <em>intends</em>; <code>EXPLAIN (ANALYZE, BUFFERS)</code> <strong>runs</strong> the statement and adds what really happened. Two consequences: never run <code>EXPLAIN ANALYZE</code> on an <code>UPDATE</code>/<code>DELETE</code> outside <code>BEGIN … ROLLBACK</code>; and on production, run it on a replica or with a <code>statement_timeout</code>.</p>
${BANG_DOC_EN}

<h3>2. Cause 1 — no index on the foreign key</h3>
${ra(EX_A)}
<p>Before the index: a <code>Parallel Seq Scan</code> of the whole table — 3 processes, each removing 666,667 rows to keep about 3, reading 16,327 pages (128 MB) for 10 rows: 28.9 ms. After <code>CREATE INDEX (phongId, batDau)</code>: a <code>Bitmap Index Scan</code>, 13 pages, 0.040 ms — about 700 times less work. 29 ms sounds harmless until the calendar page runs it 40 times per request, or 200 users open it at 8:00.</p>
<p>The trap: PostgreSQL creates an index for primary keys and <code>UNIQUE</code>, but <strong>not</strong> for foreign keys, and Prisma Migrate does not add one either (MySQL does). Look at <code>\\d "DatLich"</code> from lesson 7.1: two foreign keys, one index (the primary key). Declare them:</p>
${MA_PRISMA_INDEX}

<h3>3. Cause 2 — a function on the indexed column</h3>
${ra(EX_B)}
<p>Same index on <code>"batDau"</code>, two ways to say "bookings on 2 March". <code>"batDau"::date = '2026-03-02'</code> asks the database to compute a new value for every row, which the index on the raw column cannot answer: Seq Scan, 34.6 ms. The half-open range on the raw column uses the index (<code>Index Only Scan</code>, 0.22 ms) — the same rewrite that fixed the time-zone bug in lesson 7.2. Rule: keep the column naked on one side of the comparison.</p>
${ra(EX_C)}
${MA_SUA_C}

<h3>4. Cause 3 — the planner believes old statistics</h3>
<p>The planner chooses between plans using statistics collected by <code>ANALYZE</code> (autovacuum runs it in the background). Right after a big import or a migration, the statistics can describe a table that no longer exists. Here autovacuum is disabled on one table so you can see it clearly:</p>
${ra(THONG_KE)}
<p>The single line to read is <code>rows=1</code> (estimate) vs <code>actual … rows=300000</code>. Believing there is one row with <code>'MOI'</code>, the planner chose Nested Loops: the index lookups ran <code>loops=300000</code> times and the sort spilled to disk — 592 ms. After <code>ANALYZE</code> the estimate is 125,722 per worker and the plan becomes Hash Joins: 178 ms, 3.3 times faster, with no code change. <code>pg_stat_user_tables.n_mod_since_analyze</code> and <code>last_autoanalyze</code> tell you whether this is your problem.</p>

<h3>5. On a real server: let PostgreSQL report slow queries itself</h3>
<p>On staging or production nobody sits typing <code>EXPLAIN</code>. Ask the server to log every statement slower than a threshold, and to log its plan:</p>
${ra(LOG_CHAM)}
${ra(LOG_SERVER)}
<p>The plan in the log is the plan of that execution, with those parameters — the one you need when "it is only slow sometimes". Set it per database (<code>ALTER DATABASE … SET log_min_duration_statement = '500ms'</code>) or in <code>postgresql.conf</code>; <code>auto_explain.log_analyze</code> adds overhead to every statement, so on production keep the threshold high or sample (<code>auto_explain.sample_rate</code>). Together with <code>pg_stat_statements</code> (7.1) this answers "which query?" before "why?".</p>

<h3>6. Closing the loop with lesson 7.1</h3>
${ra(JOIN_INDEX)}
<p>The Prisma <code>relationLoadStrategy: 'join'</code> version from 7.1 was slower than the two-query version. Its <code>LEFT JOIN LATERAL</code> runs a subquery per user, and without an index on <code>"nguoiId"</code> each subquery scanned the bookings table. One index: from ~21 ms down to 3–5 ms. Fixing N+1 and fixing indexes are the same investigation.</p>

<h3>Hacker corner (and incident): slow queries as a weapon, and debugging under pressure</h3>
<p>Any endpoint that lets a user trigger an expensive query — unbounded search, <code>LIKE '%…%'</code> on a big table, a free-form report — can be called in a loop to exhaust the database's CPU and connections. Defences: pagination limits enforced on the server, rate limits, and a <code>statement_timeout</code> for the application role so a single statement cannot run forever:</p>
${ra(TIMEOUT)}
<p>The incident side: on 31 January 2017, GitLab.com was under heavy load from spam, replication to the secondary database lagged, and while debugging late at night an engineer ran a directory deletion on the <em>primary</em> instead of the secondary. About 300 GB were removed and roughly six hours of data were lost, partly because several backup methods turned out not to work (GitLab's public postmortem). Lessons for your first production database session: read-only first, make the host visible in your prompt (<code>\\conninfo</code>, psql <code>%M</code>), never run destructive commands while tired and alone, and test restores, not only backups.</p>

<h3>On the job</h3>
<p>When a client says "màn hình tìm kiếm chậm", send back: the statement (from <code>pg_stat_statements</code> or the slow log), the plan with <code>BUFFERS</code>, the one node you blame, the proposed index or rewrite, and the before/after timing on a copy of production-sized data. A plan measured on a 300-row dev database proves nothing: the planner chooses differently on 2 million rows — as you just saw.</p>

<h3>🧪 Practice (40 min)</h3>
<div class="callout ok">
<ol>
<li>Build <code>labflow_lon</code> with <code>tools/c73-nap.sql</code>. Run query A before and after the index; record pages read and time.</li>
<li>Write the "bookings of 2 March" query three ways (<code>::date</code>, <code>date_trunc</code>, half-open range) and say which ones can use the index.</li>
<li>Reproduce the stale-statistics plan, then fix it with <code>ANALYZE</code>; point at the <code>rows=</code> mismatch in your own words.</li>
<li>Enable <code>log_min_duration_statement</code> + <code>auto_explain</code> for your session and find your slowest query in <code>docker logs dbg-pg</code>.</li>
<li>Add <code>@@index([nguoiId])</code> in <code>schema.prisma</code>, run <code>prisma db push</code>, and re-measure the 7.1 join strategy.</li>
</ol>
<p><strong>Done when:</strong> for each slow query you can name the node, the cause (one of the five), and show the timing before and after.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Seq Scan / Index Scan</span><span class="v">Read the whole table / jump through an index.</span></div>
  <div class="kv"><span class="k">Bitmap / Index Only Scan</span><span class="v">Collect matching pages first / answer from the index without the table.</span></div>
  <div class="kv"><span class="k">Row estimate</span><span class="v">The planner's guess of rows per node, from <code>ANALYZE</code> statistics.</span></div>
  <div class="kv"><span class="k">Buffers</span><span class="v">8 kB pages touched: <code>hit</code> from cache, <code>read</code> from disk.</span></div>
  <div class="kv"><span class="k">auto_explain</span><span class="v">Extension that logs plans of slow statements.</span></div>
  <div class="kv"><span class="k">statement_timeout</span><span class="v">Cancels any statement running longer than the limit.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Find the node with the most time; compare estimated and actual rows; multiply by loops.</li>
<li>Foreign keys have no index by default in PostgreSQL and Prisma — add them.</li>
<li>Functions or casts on the indexed column disable the index; rewrite as a range on the raw column.</li>
<li>Stale statistics produce wrong plans; <code>ANALYZE</code> after big data changes.</li>
<li>On servers, let <code>log_min_duration_statement</code>, <code>auto_explain</code> and <code>pg_stat_statements</code> find the query.</li>
<li>Measure on production-sized data; protect the database with <code>statement_timeout</code>.</li>
</ul>
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>Truy vấn chậm: tìm nguyên nhân, không cần trăm mẹo</h2>
<p class="lead">Tinh chỉnh PostgreSQL là cả một khoá học (khoá PostgreSQL, chương 9–10). Gỡ lỗi một truy vấn chậm hẹp hơn và gấp hơn: nút nào của plan ngốn thời gian, và nguyên nhân nào trong năm nguyên nhân hay gặp đã đặt nó ở đó. Bạn cần đọc <code>EXPLAIN ANALYZE</code> đủ tốt để chỉ vào một dòng và nói "đây". Dữ liệu cho bài này: một database riêng <code>labflow_lon</code> với 2.000 phòng, 50.000 sinh viên và 2.000.000 lượt đặt (170 MB), dựng bằng một tệp SQL.</p>

<h3>Liên tưởng đời thường: tìm sách trong thư viện</h3>
<p>Không có mục lục, bạn đi dọc mọi kệ (Seq Scan). Có mục lục xếp theo tên tác giả, bạn nhảy thẳng tới đúng kệ (Index Scan) — nhưng chỉ khi bạn tìm theo tác giả; hỏi "tác giả có tên viết thường là…" là lại phải đi bộ. Và nếu sổ ghi chép của cô thủ thư nói khu sử học có một cuốn trong khi thật ra có 300.000 cuốn, cô sẽ lên kế hoạch bê từng cuốn một.</p>
<details><summary>tools/c73-nap.sql — 2 triệu lượt đặt tất định</summary>${ma(NAP_LON, 'sql')}</details>

<h3>1. Đọc một plan trong 60 giây</h3>
<p><code>EXPLAIN</code> cho thấy plan mà planner <em>định</em> chạy; <code>EXPLAIN (ANALYZE, BUFFERS)</code> <strong>chạy thật</strong> câu lệnh và thêm vào điều đã thật sự xảy ra. Hai hệ quả: đừng bao giờ chạy <code>EXPLAIN ANALYZE</code> với <code>UPDATE</code>/<code>DELETE</code> ngoài <code>BEGIN … ROLLBACK</code>; và trên production, chạy trên bản replica hoặc kèm <code>statement_timeout</code>.</p>
${BANG_DOC_VI}

<h3>2. Nguyên nhân 1 — khoá ngoại không có index</h3>
${ra(EX_A)}
<p>Trước khi có index: <code>Parallel Seq Scan</code> cả bảng — 3 tiến trình, mỗi tiến trình bỏ 666.667 dòng để giữ khoảng 3 dòng, đọc 16.327 trang (128 MB) cho 10 dòng: 28,9 ms. Sau <code>CREATE INDEX (phongId, batDau)</code>: một <code>Bitmap Index Scan</code>, 13 trang, 0,040 ms — ít việc hơn khoảng 700 lần. 29 ms nghe vô hại cho tới khi trang lịch gọi nó 40 lần mỗi request, hoặc 200 người cùng mở lúc 8 giờ sáng.</p>
<p>Cái bẫy: PostgreSQL tự tạo index cho khoá chính và <code>UNIQUE</code>, nhưng <strong>không</strong> tạo cho khoá ngoại, và Prisma Migrate cũng không thêm (MySQL thì có). Xem lại <code>\\d "DatLich"</code> ở bài 7.1: hai khoá ngoại, một index (khoá chính). Hãy khai báo:</p>
${MA_PRISMA_INDEX}

<h3>3. Nguyên nhân 2 — hàm bọc cột có index</h3>
${ra(EX_B)}
<p>Cùng một index trên <code>"batDau"</code>, hai cách nói "các lượt ngày 2 tháng 3". <code>"batDau"::date = '2026-03-02'</code> bắt cơ sở dữ liệu tính một giá trị mới cho mọi dòng, thứ mà index trên cột gốc không trả lời được: Seq Scan, 34,6 ms. Khoảng nửa mở trên cột gốc dùng được index (<code>Index Only Scan</code>, 0,22 ms) — cũng chính cách viết lại đã sửa lỗi múi giờ ở bài 7.2. Luật: để cột "trần trụi" ở một vế của phép so sánh.</p>
${ra(EX_C)}
${MA_SUA_C}

<h3>4. Nguyên nhân 3 — planner tin vào thống kê cũ</h3>
<p>Planner chọn giữa các plan dựa trên thống kê do <code>ANALYZE</code> thu thập (autovacuum chạy nó ở nền). Ngay sau một đợt nhập dữ liệu lớn hay một migration, thống kê có thể mô tả một cái bảng không còn tồn tại. Ở đây autovacuum bị tắt trên một bảng để bạn thấy rõ:</p>
${ra(THONG_KE)}
<p>Dòng duy nhất cần đọc là <code>rows=1</code> (ước lượng) so với <code>actual … rows=300000</code>. Tin rằng chỉ có một dòng <code>'MOI'</code>, planner chọn Nested Loop: các lần tra index chạy <code>loops=300000</code> lần và phép sắp xếp tràn xuống đĩa — 592 ms. Sau <code>ANALYZE</code> ước lượng thành 125.722 mỗi worker và plan chuyển sang Hash Join: 178 ms, nhanh gấp 3,3 lần, không sửa một dòng mã. <code>pg_stat_user_tables.n_mod_since_analyze</code> và <code>last_autoanalyze</code> cho bạn biết đây có phải vấn đề của mình không.</p>

<h3>5. Trên server thật: để PostgreSQL tự báo câu chậm</h3>
<p>Trên staging hay production không ai ngồi gõ <code>EXPLAIN</code>. Hãy bảo server ghi log mọi câu chậm hơn một ngưỡng, kèm plan của nó:</p>
${ra(LOG_CHAM)}
${ra(LOG_SERVER)}
<p>Plan trong log là plan của đúng lần chạy đó, với đúng tham số đó — thứ bạn cần khi "chỉ thỉnh thoảng mới chậm". Đặt theo database (<code>ALTER DATABASE … SET log_min_duration_statement = '500ms'</code>) hoặc trong <code>postgresql.conf</code>; <code>auto_explain.log_analyze</code> làm mọi câu lệnh tốn thêm chi phí, nên trên production hãy để ngưỡng cao hoặc lấy mẫu (<code>auto_explain.sample_rate</code>). Cùng với <code>pg_stat_statements</code> (7.1), nó trả lời "câu nào?" trước khi hỏi "vì sao?".</p>

<h3>6. Khép vòng với bài 7.1</h3>
${ra(JOIN_INDEX)}
<p>Bản <code>relationLoadStrategy: 'join'</code> của Prisma ở bài 7.1 chậm hơn bản hai câu. <code>LEFT JOIN LATERAL</code> của nó chạy một truy vấn con cho mỗi người dùng, và không có index trên <code>"nguoiId"</code> thì mỗi truy vấn con quét cả bảng lượt đặt. Một index: từ ~21 ms xuống 3–5 ms. Sửa N+1 và sửa index là cùng một cuộc điều tra.</p>

<h3>Góc hacker (và sự cố): truy vấn chậm làm vũ khí, và gỡ lỗi khi đang rối</h3>
<p>Endpoint nào cho người dùng kích hoạt một truy vấn đắt — tìm kiếm không giới hạn, <code>LIKE '%…%'</code> trên bảng lớn, báo cáo tuỳ ý — đều có thể bị gọi liên tục để vắt cạn CPU và kết nối của cơ sở dữ liệu. Phòng thủ: giới hạn phân trang ép ở server, giới hạn tần suất, và <code>statement_timeout</code> cho role của ứng dụng để không câu lệnh nào chạy mãi:</p>
${ra(TIMEOUT)}
<p>Phía sự cố: ngày 31/01/2017, GitLab.com bị spam tải nặng, bản đồng bộ sang DB phụ bị trễ, và trong lúc gỡ lỗi khuya một kỹ sư chạy lệnh xoá thư mục trên máy <em>chính</em> thay vì máy phụ. Khoảng 300 GB bị xoá và mất chừng sáu giờ dữ liệu, một phần vì nhiều cách sao lưu hoá ra không chạy (postmortem công khai của GitLab). Bài học cho lần đầu bạn ngồi trước DB production: chỉ đọc trước, cho tên máy hiện trên dấu nhắc (<code>\\conninfo</code>, <code>%M</code> của psql), không chạy lệnh phá huỷ khi mệt và một mình, và thử khôi phục chứ không chỉ sao lưu.</p>

<h3>Tình huống đi làm</h3>
<p>Khi khách báo "màn hình tìm kiếm chậm", hãy gửi lại: câu lệnh (từ <code>pg_stat_statements</code> hoặc log câu chậm), plan có <code>BUFFERS</code>, đúng một nút bạn kết luận là thủ phạm, index hoặc cách viết lại đề xuất, và thời gian trước/sau trên bản sao dữ liệu cỡ production. Một plan đo trên DB dev 300 dòng chẳng chứng minh được gì: planner chọn khác hẳn với 2 triệu dòng — như bạn vừa thấy.</p>

<h3>🧪 Thực hành (40 phút)</h3>
<div class="callout ok">
<ol>
<li>Dựng <code>labflow_lon</code> bằng <code>tools/c73-nap.sql</code>. Chạy truy vấn A trước và sau khi có index; ghi số trang đọc và thời gian.</li>
<li>Viết truy vấn "các lượt ngày 2 tháng 3" theo ba cách (<code>::date</code>, <code>date_trunc</code>, khoảng nửa mở) và nói cách nào dùng được index.</li>
<li>Tái hiện plan do thống kê cũ, rồi sửa bằng <code>ANALYZE</code>; chỉ ra chỗ lệch <code>rows=</code> bằng lời của bạn.</li>
<li>Bật <code>log_min_duration_statement</code> + <code>auto_explain</code> cho phiên của bạn và tìm câu chậm nhất trong <code>docker logs dbg-pg</code>.</li>
<li>Thêm <code>@@index([nguoiId])</code> vào <code>schema.prisma</code>, chạy <code>prisma db push</code>, đo lại chiến lược join của bài 7.1.</li>
</ol>
<p><strong>Đạt khi:</strong> với mỗi truy vấn chậm, bạn gọi tên được nút, nguyên nhân (một trong năm), và cho thấy thời gian trước/sau.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Seq Scan / Index Scan</span><span class="v">Đọc cả bảng / nhảy qua index.</span></div>
  <div class="kv"><span class="k">Bitmap / Index Only Scan</span><span class="v">Gom các trang khớp trước / trả lời từ index, không cần bảng.</span></div>
  <div class="kv"><span class="k">Ước lượng dòng</span><span class="v">Planner đoán số dòng mỗi nút, dựa trên thống kê của <code>ANALYZE</code>.</span></div>
  <div class="kv"><span class="k">Buffers</span><span class="v">Số trang 8 kB đã chạm: <code>hit</code> từ cache, <code>read</code> từ đĩa.</span></div>
  <div class="kv"><span class="k">auto_explain</span><span class="v">Extension ghi plan của các câu lệnh chậm vào log.</span></div>
  <div class="kv"><span class="k">statement_timeout</span><span class="v">Huỷ mọi câu lệnh chạy lâu hơn giới hạn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Tìm nút tốn nhiều thời gian nhất; so dòng ước lượng với dòng thật; nhân với loops.</li>
<li>Khoá ngoại mặc định không có index trong PostgreSQL và Prisma — hãy thêm.</li>
<li>Hàm hoặc ép kiểu trên cột có index làm index vô dụng; viết lại thành khoảng trên cột gốc.</li>
<li>Thống kê cũ sinh plan sai; <code>ANALYZE</code> sau mỗi đợt thay đổi dữ liệu lớn.</li>
<li>Trên server, để <code>log_min_duration_statement</code>, <code>auto_explain</code> và <code>pg_stat_statements</code> tìm ra câu lệnh.</li>
<li>Đo trên dữ liệu cỡ production; bảo vệ cơ sở dữ liệu bằng <code>statement_timeout</code>.</li>
</ul>
${NGUON}
</div>
`,
};
