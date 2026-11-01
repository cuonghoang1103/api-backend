/**
 * API Design — Chương 12: Dự án cuối khoá — đưa LabFlow lên PostgreSQL + Redis và ra production (soạn chi tiết 01/11/2026).
 * Output CHẠY THẬT: Node v22.23.3, Express 5.3.0, PostgreSQL 18.4 (:55432, CSDL labflow_app/labflow_load/labflow_test), Redis 8.2.2 (:6390),
 * hai instance A :4200 / B :4201 sau proxy kiểm sức khoẻ :8180 (perf/proxy-health.mjs), worker (relay outbox + hàng đợi email), autocannon 8.0.0.
 * 12.1 kiểm kê trạng thái trong RAM (đo: mất khi khởi động lại, đặt trùng hai bk_1, 304 sai, vé/API key bị từ chối) + lược đồ, timestamptz(3)
 * (µs làm mất 900/1.000 dòng khi phân trang); 12.2 migration (checksum, advisory lock, DDL trong transaction, khoá bảng 1 triệu dòng: DEFAULT
 * volatile / CREATE INDEX giữ INSERT > 3 s, CONCURRENTLY 1 ms) + ràng buộc + seed; 12.3 store memory|pg, một pool (Ch11 có 7), pool cạn ⇒ 503,
 * 50 lượt cùng khung giờ: RAM 2 / PG 1, “tối đa 3 lượt” không khoá 5–8 / có khoá 3; 12.4 rate limit Lua trên Redis (5 rồi 429 qua 2 instance),
 * idempotency ghi trước câu trả lời, ETag từ SEQUENCE, UPDATE … WHERE version (mất bản sửa 11/20 ⇒ 0/20), Redis sập; 12.5 cache danh sách phòng,
 * outbox + relay LISTEN/NOTIFY (p50 1,0 ms vs hỏi vòng 946 ms), email đồng bộ p50 311 ms + 500 khi sập vs hàng đợi 3,6 ms, relay sập: 21 sự kiện /
 * 20 email; 12.6 đo tải lại bằng script Chương 8 (danh sách nhanh 1,4–2,2 lần, ghi 2,7–3,2 lần, labs −29…−37%) + OpenAPI 2.4.0 không phá vỡ, drift
 * 40/40; 12.7 checklist triển khai (cấu hình hỏng sớm, /health vs /ready khi CSDL sập, tắt êm 622 × 502 ⇒ 0, log JSON + X-Request-Id, /metrics
 * cổng riêng, sao lưu + khôi phục thử, smoke test 12 bước); Lab 12 chuyển issues lên PostgreSQL + lab/grade-lab12.mjs (khởi đầu 0/10, lời giải
 * 10/10); 12.8 bảng bằng chứng, README, STAR, dòng CV; 12.9 học tiếp; bài thi cuối khoá 20 câu.
 * Slide: api-12-1 … api-12-9 + api-lab-12. Tệp sinh một lần bằng script ngoài repo — từ nay SỬA THẲNG tệp này (luật thoát ký tự _HOP-DONG.md mục 3).
 * GIỮ slug khung api-12-1-thiet-ke (12.1), api-12-2-xay-dung (12.3), api-12-3-mo-rong (12.5), api-12-4-tong-ket (12.8) và title chương;
 * bài MỚI: 12.2 api-12-11-migration, 12.4 api-12-5-chia-se, 12.6 api-12-6-do-tai, 12.7 api-12-7-trien-khai, lab api-12-9-lab,
 * 12.9 api-12-8-hoc-tiep, thi cuối khoá api-12-10-thi-cuoi-khoa (QUIZ 20 câu, 1800 s).
 */

import G121 from './giang/api-12-1.mjs';
import G122 from './giang/api-12-2.mjs';
import G123 from './giang/api-12-3.mjs';
import G124 from './giang/api-12-4.mjs';
import G125 from './giang/api-12-5.mjs';
import G126 from './giang/api-12-6.mjs';
import G127 from './giang/api-12-7.mjs';
import GL12 from './giang/api-lab-12.mjs';
import G128 from './giang/api-12-8.mjs';
import G129 from './giang/api-12-9.mjs';

export default {
  title: 'Chapter 12 — Capstone: design and build a production API|||Chương 12 — Dự án cuối khoá: thiết kế và dựng một API production',
  description: 'Dự án cuối khoá: LabFlow từ RAM lên PostgreSQL + Redis, hai instance, outbox và hàng đợi, đo tải lại, hợp đồng 2.4.0, checklist triển khai, câu chuyện phỏng vấn và bài thi cuối khoá.',
  lessons: [
    /* ─────────────────────────── 12.1 ─────────────────────────── */
    {
      title: '12.1 — The capstone plan: what still lives in RAM, and a schema that keeps the rules|||12.1 — Kế hoạch dự án cuối khoá: thứ gì còn trong RAM, và lược đồ giữ được luật',
      slug: 'api-12-1-thiet-ke',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Mở đầu chương: học xong làm được gì. Kiểm kê trạng thái trong RAM và đo thiệt hại trên hai instance (mất khi khởi động lại, đặt trùng hai bk_1, 304 sai, vé và API key bị từ chối), thiết kế lược đồ PostgreSQL giữ luật bằng ràng buộc, timestamptz(3) (µs làm mất 900/1.000 dòng khi phân trang).',
      content: `${G121}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.1</span>
<h2>The capstone plan: what still lives in RAM, and a schema that keeps the rules</h2>
<p class="lead">For eleven chapters LabFlow kept its data in JavaScript arrays. That was a deliberate shortcut — and Chapters 8–10 kept writing “this waits for Chapter 12”. Now we pay the debt: first we measure exactly what breaks with RAM, then we design the PostgreSQL schema and the migrations that replace it.</p>

<div class="callout ok">
<p><strong>After Chapter 12 you can:</strong></p>
<ul>
  <li>list every piece of in-memory state in a Node API, say what it breaks with a restart or a second instance, and decide where it belongs — PostgreSQL, Redis, or nowhere (12.1);</li>
  <li>turn resources into tables whose constraints enforce the business rules, and ship them with numbered, checksummed migrations (12.1); run the API on one connection pool with transactions, so fifty simultaneous bookings produce exactly one (12.2);</li>
  <li>run two instances that agree on rate limits, idempotency keys, ETags and tickets (12.3); add a cache and a notification queue fed by a transactional outbox (12.4);</li>
  <li>re-measure the load with the Chapter 8 scripts and prove the contract did not break (12.5); deploy with a checklist — config, readiness, graceful shutdown, logs, metrics, backup, smoke test (12.6); then tell the whole project as an interview story with your own numbers (12.7).</li>
</ul>
<p><strong>Why it is worth learning:</strong> a project that “works on my laptop” is a school exercise; a project that survives a restart, a second server and a broken email provider is something you can put on your CV and defend for twenty minutes. Every company interview for a backend role eventually asks “how did you store it, and what happens when two users do it at once?” — this chapter gives you measured answers.</p>
</div>

<h3>The brief: what “production” means for LabFlow</h3>
<p>Think of a student café moving from a notebook to a cash register. The notebook worked while one person served; with two cashiers and a shift change, the notebook is the problem. For LabFlow “production” means five testable promises:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Survives a restart</span><span class="lz-d">data on disk, not in a process</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Two instances agree</span><span class="lz-d">limits, keys, ETags, tickets shared</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Rules hold under races</span><span class="lz-d">constraints + transactions</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Slow things are async</span><span class="lz-d">cache, outbox, queue</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Deploys are boring</span><span class="lz-d">checklist, smoke test, numbers</span></div>
</div>
<p>One code base serves both worlds: <code>LABFLOW_STORE=memory</code> (the default, so <code>npm test</code> still needs no database) and <code>LABFLOW_STORE=pg</code>. That switch is what lets every “before” and “after” in this chapter run on the same code.</p>

<h3>Inventory: everything that still lives in RAM</h3>
<p>Before designing anything, list the state. On the Chapter 11 code (<code>labflow-api-ch11.zip</code>) one search finds it:</p>
<pre><code class="language-bash">grep -rnE "new Map\\(\\)|^export const (labs|devices|users|bookings|issues|waitlist|versions) =|const counters|const ring = \\[\\]" src | grep -vE "reports|inflight|deprecation" | cut -c1-64 | sed 's/ *$//'</code></pre>
<div class="out">src/idempotency.js:8:const store = new Map();   // "usr_1:&lt;khoá&gt;
src/events.js:12:const ring = [];
src/rateLimit.js:7:  const buckets = new Map();
src/db.js:3:export const labs = [
src/db.js:10:export const devices = [
src/db.js:17:export const users = [
src/db.js:33:export const bookings = seedBookings(Number(process
src/db.js:34:export const issues = seedIssues(Number(process.env
src/db.js:36:const counters = { bk: bookings.length, dev: device
src/auth.js:41:export const apiKeys = new Map();
src/tickets.js:6:const tickets = new Map();
src/httpCache.js:7:export const versions = { bookings: 0, labs:
src/jobs.js:31:const mem = new Map();                    // id ⇒
src/jobs.js:32:const results = new Map();                // id ⇒
src/routes/waitlist.js:15:export const waitlist = [];   // { id,</div>
<table>
<tr><th>State</th><th>Restart</th><th>Two instances</th><th>Goes to</th></tr>
<tr><td>labs, devices, users, bookings, issues, waitlist, API keys</td><td>lost</td><td>each instance sees its own</td><td>PostgreSQL tables</td></tr>
<tr><td><code>counters</code> (bk_1, bk_2…)</td><td>restart at 1</td><td>the same id twice</td><td>PostgreSQL sequences</td></tr>
<tr><td>idempotency store</td><td>lost</td><td>same key ⇒ two bookings</td><td>PostgreSQL table (8.3 started it)</td></tr>
<tr><td>rate-limit buckets</td><td>reset</td><td>limit × N</td><td>Redis (short-lived, shared)</td></tr>
<tr><td>list versions for ETags</td><td>reset</td><td>stale 304</td><td>PostgreSQL sequence</td></tr>
<tr><td>realtime tickets</td><td>lost</td><td>valid on one instance only</td><td>Redis with a 30 s TTL</td></tr>
<tr><td>event ring, jobs (memory modes)</td><td>lost</td><td>split</td><td>Redis Stream / BullMQ (Chapter 10 already)</td></tr>
</table>
<p>Rule of thumb: <strong>the truth</strong> (things you would be sued for losing) goes to PostgreSQL; <strong>shared but disposable</strong> state with a short life goes to Redis; caches that tolerate staleness may stay local.</p>

<h3>Measure the damage first</h3>
<p>Two instances A (:4200) and B (:4201) run the RAM store behind a small health-checking proxy (:8180, <code>perf/proxy-health.mjs</code>). First, book on A, restart A, read it back:</p>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code} %header{location}\\n' http://localhost:4200/v2/bookings \\
  -H "Authorization: Bearer $(cat lan.jwt)" \\
  --json '{"labId":"lab_1","period":{"start":"2027-04-05T08:00:00+07:00","end":"2027-04-05T10:00:00+07:00"}}' | tee created.txt</code></pre>
<div class="out">201 /v2/bookings/bk_1</div>
<pre><code class="language-bash">curl -s -o /dev/null -w "GET $(cut -d' ' -f2 created.txt) sau khi khởi động lại: %{http_code}\\n" "http://localhost:4200$(cut -d' ' -f2 created.txt)" \\
  -H "Authorization: Bearer $(cat lan.jwt)"</code></pre>
<div class="out">GET /v2/bookings/bk_1 sau khi khởi động lại: 404</div>
<p>Then through the proxy, which alternates A and B:</p>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code} instance=%header{labflow-instance} %header{location}\\n' http://localhost:8180/v2/bookings \\
  -H "Authorization: Bearer $(cat lan.jwt)" \\
  --json '{"labId":"lab_2","period":{"start":"2027-04-06T08:00:00+07:00","end":"2027-04-06T10:00:00+07:00"}}' | tee created.txt</code></pre>
<div class="out">201 instance=B /v2/bookings/bk_1</div>
<pre><code class="language-bash">for i in 1 2; do curl -s -o /dev/null -w "GET $(cut -d' ' -f3 created.txt): %{http_code} instance=%header{labflow-instance}\\n" "http://localhost:8180$(cut -d' ' -f3 created.txt)" -H "Authorization: Bearer $(cat lan.jwt)"; done</code></pre>
<div class="out">GET /v2/bookings/bk_1: 404 instance=A
GET /v2/bookings/bk_1: 200 instance=B</div>
<pre><code class="language-bash">for i in 1 2; do curl -s -o /dev/null -w '%{http_code} instance=%header{labflow-instance} %header{location}\\n' http://localhost:8180/v2/bookings -H "Authorization: Bearer $(cat lan.jwt)" --json '{"labId":"lab_3","period":{"start":"2027-04-07T08:00:00+07:00","end":"2027-04-07T10:00:00+07:00"}}'; done</code></pre>
<div class="out">201 instance=A /v2/bookings/bk_1
201 instance=B /v2/bookings/bk_2</div>
<p>The second request for the <em>same lab and slot</em> succeeded on the other instance — a double booking — and both instances handed out <code>bk_1</code>. The quieter bugs are worse, because nothing looks broken:</p>
<pre><code class="language-bash">curl -s -D - -o /dev/null 'http://localhost:4200/v2/bookings?labId=lab_3' \\
  -H "Authorization: Bearer $(cat lan.jwt)" | grep -i '^etag' | tr \\
  -d '\\r' | tee etag.txt</code></pre>
<div class="out">ETag: "bookings-v1-JMolGI-8rCeg27eS"</div>
<pre><code class="language-bash">curl -s -o /dev/null -w 'đặt ở B: %{http_code} %header{location}\\n' http://localhost:4201/v2/bookings \\
  -H "Authorization: Bearer $(cat lan.jwt)" \\
  --json '{"labId":"lab_3","period":{"start":"2027-04-08T08:00:00+07:00","end":"2027-04-08T10:00:00+07:00"}}'</code></pre>
<div class="out">đặt ở B: 201 /v2/bookings/bk_3</div>
<pre><code class="language-bash">curl -s -o /dev/null -w 'hỏi lại A: %{http_code}\\n' 'http://localhost:4200/v2/bookings?labId=lab_3' \\
  -H "Authorization: Bearer $(cat lan.jwt)" \\
  -H "If-None-Match: $(cut -d' ' -f2 etag.txt)"</code></pre>
<div class="out">hỏi lại A: 304</div>
<p>A answered <code>304 Not Modified</code>: “your copy is still current” — but B had just added <code>bk_3</code> to lab_3. A's list version lives in A's memory, so A never heard of the write. The browser keeps showing a list without the new booking.</p>
<pre><code class="language-bash">curl -s -X POST http://localhost:4200/v2/realtime/tickets \\
  -H "Authorization: Bearer $(cat lan.jwt)" | jq -r .ticket &gt; tkt.txt; echo "vé từ A: $(cut -c1-10 tkt.txt)…"</code></pre>
<div class="out">vé từ A: tkt_Z4B6qU…</div>
<pre><code class="language-bash">curl -s -o /dev/null -w 'SSE ở B: %{http_code}\\n' --max-time 2 "http://localhost:4201/v2/events/stream?ticket=$(cat tkt.txt)"</code></pre>
<div class="out">SSE ở B: 401</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4200/v2/me/api-keys \\
  -H "Authorization: Bearer $(cat lan.jwt)" | jq -r .key &gt; key.txt; echo "khoá tạo ở A: $(cut -c1-12 key.txt)…"</code></pre>
<div class="out">khoá tạo ở A: lf_live_8v9q…</div>
<pre><code class="language-bash">for p in 4200 4201; do curl -s -o /dev/null -w ":$p GET /v2/me bằng khoá: %{http_code}\\n" http://localhost:$p/v2/me -H "Authorization: Bearer $(cat key.txt)"; done</code></pre>
<div class="out">:4200 GET /v2/me bằng khoá: 200
:4201 GET /v2/me bằng khoá: 401</div>
<p>Six failures, one cause. Chapter 8 (8.3) measured three of them; the stale 304, the ticket and the API key are new here, and none of them throws an error in a log.</p>

<h3>From resources to tables</h3>
<p>The contract stays: clients still see <code>"id": "bk_42"</code>, the same fields, the same errors. Only the storage changes. The map of the schema:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">users · labs</span><span class="lz-lnote">email UNIQUE, role CHECK, password_hash · code UNIQUE, capacity CHECK &gt; 0, retired_at</span></div>
  <div class="lz-layer"><span class="lz-lname">devices → labs</span><span class="lz-lnote">serial_no UNIQUE, status CHECK, version for If-Match</span></div>
  <div class="lz-layer"><span class="lz-lname">bookings → labs, users</span><span class="lz-lnote">EXCLUDE overlapping active bookings, CHECK end &gt; start, version</span></div>
  <div class="lz-layer"><span class="lz-lname">waitlist · issues (Lab 12) · api_keys</span><span class="lz-lnote">Lab 7 queue · broken devices · sha256 of keys only</span></div>
  <div class="lz-layer"><span class="lz-lname">outbox · idempotency_keys · schema_migrations</span><span class="lz-lnote">events in the same transaction (12.4) · shared keys (12.3) · history of the schema</span></div>
</div>
<p>Five design rules, each from an earlier chapter:</p>
<ol>
  <li><strong>Keep the public id shape.</strong> A number from a sequence, exposed as text: <code>seq bigint</code> plus <code>id text GENERATED ALWAYS AS ('bk_' || seq)</code>. Cursors (3.2) keep working.</li>
  <li><strong>One rule, one constraint.</strong> “No overlapping active bookings” becomes <code>EXCLUDE USING gist</code> (11.6); “end after start” a <code>CHECK</code>; “a lab exists” a foreign key. The API checks first for friendly errors; the database is the last line that cannot be raced.</li>
  <li><strong>Index the queries you serve.</strong> “My bookings, newest first” ⇒ <code>(user_id, created_at DESC, seq DESC)</code>; managers' list ⇒ <code>(created_at DESC, seq DESC)</code> (3.2).</li>
  <li><strong>A <code>version</code> column</strong> wherever clients send <code>If-Match</code> (5.4) or events carry an order (10.6).</li>
  <li><strong>Time is <code>timestamptz(3)</code></strong> — milliseconds, not microseconds. Next section explains why.</li>
</ol>

<h3>Why timestamptz(3): 900 rows that disappear</h3>
<p>PostgreSQL stores time to the microsecond; a JavaScript <code>Date</code> — and therefore the ISO string inside our cursor — keeps milliseconds. A keyset page asks for rows “older than (created_at, seq) of the last row”; if the cursor lost three digits, rows from the same millisecond as the page edge vanish. <code>perf/precision.mjs</code> pages through 1,000 rows, 100 at a time, with exactly the SQL of the store:</p>
<pre><code class="language-bash">node perf/precision.mjs</code></pre>
<div class="out">1.000 dòng trong MỘT câu INSERT (nhập lô, seed) timestamptz     có 1000 · đi hết các trang thấy  100 (1 trang)  ⇐ SÓT 900
1.000 dòng trong MỘT câu INSERT (nhập lô, seed) timestamptz(3)  có 1000 · đi hết các trang thấy 1000 (10 trang)
1.000 câu INSERT liên tiếp                     timestamptz     có 1000 · đi hết các trang thấy  989 (10 trang)  ⇐ SÓT 11
1.000 câu INSERT liên tiếp                     timestamptz(3)  có 1000 · đi hết các trang thấy 1000 (10 trang)</div>
<p>A bulk insert in one statement gives every row the same <code>now()</code> (the transaction start), so the second page starts “before” all of them: 900 rows lost, no error. One INSERT per row lost 11 in this run (61 and 58 in earlier runs: it depends on how many rows land in the same millisecond). With <code>timestamptz(3)</code> the database stores exactly what the cursor carries: 1,000 of 1,000.</p>
<a class="link-card" href="https://www.postgresql.org/docs/18/datatype-datetime.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: PostgreSQL 18 — Date/Time Types (read 1 Nov 2026)</span><span class="lc-sub">“timestamp … accept an optional precision value p which specifies the number of fractional digits retained in the seconds field … The allowed range of p is from 0 to 6.”</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>In interviews / at work</h3>
<ul>
  <li><strong>“Why not keep the rule in the API?”</strong> Because every check-then-write in application code is a race once there are two instances; the constraint is the only place every path goes through. The API still checks first, for a helpful error.</li>
  <li><strong>“Why are your ids strings?”</strong> The contract promised opaque <code>bk_42</code> in Chapter 1; the database generates them from a sequence, so clients never noticed the move.</li>
  <li><strong>“What did you keep out of the database?”</strong> Rate-limit buckets and realtime tickets: shared but short-lived, so Redis with a TTL; losing them costs a retry, not data.</li>
</ul>

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok"><ol>
  <li>Unzip the final project, start two RAM instances and the proxy (commands in <code>docs/chay-theo-bai.txt</code>), and reproduce the stale 304: an ETag from A, a booking on B, the old ETag back to A.</li>
  <li>Run <code>node perf/precision.mjs</code> and explain to a friend, without the word “microsecond”, why 900 rows vanished.</li>
  <li>For the waitlist table, write which constraint enforces each Lab 7 rule, and which rule cannot be a constraint (hint: the position is computed).</li>
</ol>
<p><strong>Done when:</strong> you can say in one sentence where each of the seven RAM items went, and why.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">In-memory state</span><span class="v">Data held in a process's variables — lost on restart, invisible to other instances.</span></div>
  <div class="kv"><span class="k">Instance</span><span class="v">One running copy of the API process; production runs two or more behind a load balancer.</span></div>
  <div class="kv"><span class="k">Source of truth</span><span class="v">The one place whose answer wins; for LabFlow, PostgreSQL.</span></div>
  <div class="kv"><span class="k">Exclusion constraint</span><span class="v">No two rows may match an operator — here, overlapping time ranges in one lab.</span></div>
  <div class="kv"><span class="k">Generated column</span><span class="v">A column computed from others (<code>'bk_' || seq</code>), never written by hand.</span></div>
  <div class="kv"><span class="k">Timestamp precision</span><span class="v">How many fractional digits of a second are kept; <code>(3)</code> = milliseconds, like JavaScript.</span></div>
  <div class="kv"><span class="k">Stale 304</span><span class="v">“Not modified” answered from an out-of-date version number — the client keeps old data.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Seven kinds of in-memory state; with two instances we measured: a booking lost on restart, invisible on A, a double booking with two <code>bk_1</code>, a stale 304, a ticket and an API key rejected on B.</li>
  <li>The truth goes to PostgreSQL, short-lived shared state to Redis; the public contract (ids, fields, errors) does not change.</li>
  <li>Schema rules: keep the id shape, one rule one constraint, index the queries you serve, a <code>version</code> where order matters.</li>
  <li><code>timestamptz(3)</code> matches the millisecond cursor: microseconds lost 900 of 1,000 rows on a bulk insert, 11–61 on single inserts.</li>
  <li>Next lesson: getting this schema into a database safely — migrations, constraints at work, seed data.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.1</span>
<h2>Kế hoạch dự án cuối khoá: thứ gì còn nằm trong RAM, và một lược đồ giữ được luật</h2>
<p class="lead">Suốt mười một chương, LabFlow giữ dữ liệu trong mảng JavaScript. Đó là đường tắt có chủ ý — và Chương 8–10 cứ ghi “chờ Chương 12”. Giờ là lúc trả nợ: trước hết đo chính xác RAM làm hỏng những gì, rồi thiết kế lược đồ (schema) PostgreSQL và các migration thay thế nó.</p>

<div class="callout ok">
<p><strong>Học xong Chương 12 bạn làm được:</strong></p>
<ul>
  <li>liệt kê mọi trạng thái nằm trong bộ nhớ của một API Node, nói được nó hỏng gì khi khởi động lại hay khi có instance thứ hai, và quyết định nó thuộc về đâu — PostgreSQL, Redis, hay không đâu cả (12.1);</li>
  <li>biến tài nguyên thành bảng có ràng buộc (constraint) giữ luật nghiệp vụ, đưa lên bằng migration đánh số, có checksum (12.1); chạy API trên một pool kết nối với transaction, để năm mươi lượt đặt cùng lúc chỉ ra đúng một (12.2);</li>
  <li>chạy hai instance thống nhất về giới hạn tần suất, khoá idempotency, ETag và vé realtime (12.3); thêm cache và hàng đợi thông báo nạp từ transactional outbox (12.4);</li>
  <li>đo tải lại bằng chính script Chương 8 và chứng minh hợp đồng không vỡ (12.5); triển khai theo checklist — cấu hình, readiness, tắt êm, log, metrics, sao lưu, smoke test (12.6); rồi kể cả dự án thành câu chuyện phỏng vấn bằng số đo của chính mình (12.7).</li>
</ul>
<p><strong>Vì sao đáng học:</strong> dự án “chạy trên máy em” là bài tập trên lớp; dự án sống sót qua một lần khởi động lại, một máy chủ thứ hai và một nhà cung cấp email bị sập mới là thứ bạn ghi vào CV và bảo vệ được hai mươi phút. Phỏng vấn backend nào rồi cũng hỏi “em lưu nó thế nào, và chuyện gì xảy ra khi hai người cùng làm một lúc?” — chương này cho bạn câu trả lời có số đo.</p>
</div>

<h3>Đề bài: “production” với LabFlow nghĩa là gì</h3>
<p>Hãy nghĩ tới quán cà phê sinh viên chuyển từ cuốn sổ sang máy tính tiền. Cuốn sổ ổn khi chỉ một người bán; có hai thu ngân và đổi ca thì chính cuốn sổ là vấn đề. Với LabFlow, “production” nghĩa là năm lời hứa kiểm được:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Sống qua khởi động lại</span><span class="lz-d">dữ liệu trên đĩa, không trong tiến trình</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Hai instance khớp nhau</span><span class="lz-d">giới hạn, khoá, ETag, vé dùng chung</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Luật đứng vững khi đua</span><span class="lz-d">ràng buộc + transaction</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Việc chậm chạy nền</span><span class="lz-d">cache, outbox, hàng đợi</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Triển khai nhàm chán</span><span class="lz-d">checklist, smoke test, số đo</span></div>
</div>
<p>Một bộ mã phục vụ cả hai thế giới: <code>LABFLOW_STORE=memory</code> (mặc định, nên <code>npm test</code> vẫn không cần CSDL) và <code>LABFLOW_STORE=pg</code>. Chính công tắc này cho phép mọi cặp “trước” và “sau” trong chương chạy trên cùng một bộ mã.</p>

<h3>Kiểm kê: mọi thứ còn nằm trong RAM</h3>
<p>Trước khi thiết kế, hãy liệt kê trạng thái. Trên mã Chương 11 (<code>labflow-api-ch11.zip</code>), một lệnh tìm là ra:</p>
<pre><code class="language-bash">grep -rnE "new Map\\(\\)|^export const (labs|devices|users|bookings|issues|waitlist|versions) =|const counters|const ring = \\[\\]" src | grep -vE "reports|inflight|deprecation" | cut -c1-64 | sed 's/ *$//'</code></pre>
<div class="out">src/idempotency.js:8:const store = new Map();   // "usr_1:&lt;khoá&gt;
src/events.js:12:const ring = [];
src/rateLimit.js:7:  const buckets = new Map();
src/db.js:3:export const labs = [
src/db.js:10:export const devices = [
src/db.js:17:export const users = [
src/db.js:33:export const bookings = seedBookings(Number(process
src/db.js:34:export const issues = seedIssues(Number(process.env
src/db.js:36:const counters = { bk: bookings.length, dev: device
src/auth.js:41:export const apiKeys = new Map();
src/tickets.js:6:const tickets = new Map();
src/httpCache.js:7:export const versions = { bookings: 0, labs:
src/jobs.js:31:const mem = new Map();                    // id ⇒
src/jobs.js:32:const results = new Map();                // id ⇒
src/routes/waitlist.js:15:export const waitlist = [];   // { id,</div>
<table>
<tr><th>Trạng thái</th><th>Khởi động lại</th><th>Hai instance</th><th>Chuyển về</th></tr>
<tr><td>labs, devices, users, bookings, issues, waitlist, API key</td><td>mất</td><td>mỗi instance thấy bản của mình</td><td>bảng PostgreSQL</td></tr>
<tr><td><code>counters</code> (bk_1, bk_2…)</td><td>đếm lại từ 1</td><td>cùng một id hai lần</td><td>sequence PostgreSQL</td></tr>
<tr><td>kho idempotency</td><td>mất</td><td>cùng khoá ⇒ hai lượt đặt</td><td>bảng PostgreSQL (bài 8.3 đã bắt đầu)</td></tr>
<tr><td>xô token rate limit</td><td>về đầy</td><td>giới hạn × N</td><td>Redis (ngắn hạn, dùng chung)</td></tr>
<tr><td>số phiên bản danh sách cho ETag</td><td>về 0</td><td>304 sai</td><td>sequence PostgreSQL</td></tr>
<tr><td>vé realtime</td><td>mất</td><td>chỉ hợp lệ ở một instance</td><td>Redis, TTL 30 s</td></tr>
<tr><td>vòng sự kiện, việc nền (chế độ memory)</td><td>mất</td><td>bị chia đôi</td><td>Redis Stream / BullMQ (đã có từ Chương 10)</td></tr>
</table>
<p>Luật nhớ nhanh: <strong>sự thật</strong> (thứ mất là bị kiện) về PostgreSQL; trạng thái <strong>dùng chung nhưng bỏ được</strong>, sống ngắn, về Redis; cache chịu được dữ liệu hơi cũ thì có thể để tại chỗ.</p>

<h3>Đo thiệt hại trước đã</h3>
<p>Hai instance A (:4200) và B (:4201) chạy kho RAM sau một proxy nhỏ có kiểm sức khoẻ (:8180, <code>perf/proxy-health.mjs</code>). Đầu tiên đặt ở A, khởi động lại A, rồi đọc lại:</p>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code} %header{location}\\n' http://localhost:4200/v2/bookings \\
  -H "Authorization: Bearer $(cat lan.jwt)" \\
  --json '{"labId":"lab_1","period":{"start":"2027-04-05T08:00:00+07:00","end":"2027-04-05T10:00:00+07:00"}}' | tee created.txt</code></pre>
<div class="out">201 /v2/bookings/bk_1</div>
<pre><code class="language-bash">curl -s -o /dev/null -w "GET $(cut -d' ' -f2 created.txt) sau khi khởi động lại: %{http_code}\\n" "http://localhost:4200$(cut -d' ' -f2 created.txt)" \\
  -H "Authorization: Bearer $(cat lan.jwt)"</code></pre>
<div class="out">GET /v2/bookings/bk_1 sau khi khởi động lại: 404</div>
<p>Rồi đi qua proxy, nó chia lần lượt cho A và B:</p>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code} instance=%header{labflow-instance} %header{location}\\n' http://localhost:8180/v2/bookings \\
  -H "Authorization: Bearer $(cat lan.jwt)" \\
  --json '{"labId":"lab_2","period":{"start":"2027-04-06T08:00:00+07:00","end":"2027-04-06T10:00:00+07:00"}}' | tee created.txt</code></pre>
<div class="out">201 instance=B /v2/bookings/bk_1</div>
<pre><code class="language-bash">for i in 1 2; do curl -s -o /dev/null -w "GET $(cut -d' ' -f3 created.txt): %{http_code} instance=%header{labflow-instance}\\n" "http://localhost:8180$(cut -d' ' -f3 created.txt)" -H "Authorization: Bearer $(cat lan.jwt)"; done</code></pre>
<div class="out">GET /v2/bookings/bk_1: 404 instance=A
GET /v2/bookings/bk_1: 200 instance=B</div>
<pre><code class="language-bash">for i in 1 2; do curl -s -o /dev/null -w '%{http_code} instance=%header{labflow-instance} %header{location}\\n' http://localhost:8180/v2/bookings -H "Authorization: Bearer $(cat lan.jwt)" --json '{"labId":"lab_3","period":{"start":"2027-04-07T08:00:00+07:00","end":"2027-04-07T10:00:00+07:00"}}'; done</code></pre>
<div class="out">201 instance=A /v2/bookings/bk_1
201 instance=B /v2/bookings/bk_2</div>
<p>Request thứ hai cho <em>cùng phòng, cùng khung giờ</em> vẫn thành công ở instance kia — đặt trùng — và cả hai instance cùng phát ra <code>bk_1</code>. Những lỗi im lặng còn tệ hơn, vì nhìn không thấy gì hỏng:</p>
<pre><code class="language-bash">curl -s -D - -o /dev/null 'http://localhost:4200/v2/bookings?labId=lab_3' \\
  -H "Authorization: Bearer $(cat lan.jwt)" | grep -i '^etag' | tr \\
  -d '\\r' | tee etag.txt</code></pre>
<div class="out">ETag: "bookings-v1-JMolGI-8rCeg27eS"</div>
<pre><code class="language-bash">curl -s -o /dev/null -w 'đặt ở B: %{http_code} %header{location}\\n' http://localhost:4201/v2/bookings \\
  -H "Authorization: Bearer $(cat lan.jwt)" \\
  --json '{"labId":"lab_3","period":{"start":"2027-04-08T08:00:00+07:00","end":"2027-04-08T10:00:00+07:00"}}'</code></pre>
<div class="out">đặt ở B: 201 /v2/bookings/bk_3</div>
<pre><code class="language-bash">curl -s -o /dev/null -w 'hỏi lại A: %{http_code}\\n' 'http://localhost:4200/v2/bookings?labId=lab_3' \\
  -H "Authorization: Bearer $(cat lan.jwt)" \\
  -H "If-None-Match: $(cut -d' ' -f2 etag.txt)"</code></pre>
<div class="out">hỏi lại A: 304</div>
<p>A trả <code>304 Not Modified</code>: “bản bạn đang giữ vẫn mới” — nhưng B vừa thêm <code>bk_3</code> vào lab_3. Số phiên bản danh sách nằm trong bộ nhớ của A, nên A không hề biết có lệnh ghi. Trình duyệt tiếp tục hiện danh sách thiếu lượt đặt mới.</p>
<pre><code class="language-bash">curl -s -X POST http://localhost:4200/v2/realtime/tickets \\
  -H "Authorization: Bearer $(cat lan.jwt)" | jq -r .ticket &gt; tkt.txt; echo "vé từ A: $(cut -c1-10 tkt.txt)…"</code></pre>
<div class="out">vé từ A: tkt_Z4B6qU…</div>
<pre><code class="language-bash">curl -s -o /dev/null -w 'SSE ở B: %{http_code}\\n' --max-time 2 "http://localhost:4201/v2/events/stream?ticket=$(cat tkt.txt)"</code></pre>
<div class="out">SSE ở B: 401</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4200/v2/me/api-keys \\
  -H "Authorization: Bearer $(cat lan.jwt)" | jq -r .key &gt; key.txt; echo "khoá tạo ở A: $(cut -c1-12 key.txt)…"</code></pre>
<div class="out">khoá tạo ở A: lf_live_8v9q…</div>
<pre><code class="language-bash">for p in 4200 4201; do curl -s -o /dev/null -w ":$p GET /v2/me bằng khoá: %{http_code}\\n" http://localhost:$p/v2/me -H "Authorization: Bearer $(cat key.txt)"; done</code></pre>
<div class="out">:4200 GET /v2/me bằng khoá: 200
:4201 GET /v2/me bằng khoá: 401</div>
<p>Sáu lỗi, một nguyên nhân. Bài 8.3 đã đo ba lỗi; 304 sai, vé và API key là mới, và không lỗi nào ném một dòng báo lỗi vào log.</p>

<h3>Từ tài nguyên ra bảng</h3>
<p>Hợp đồng giữ nguyên: client vẫn thấy <code>"id": "bk_42"</code>, cùng các trường, cùng các lỗi. Chỉ chỗ lưu thay đổi. Bản đồ lược đồ:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">users · labs</span><span class="lz-lnote">email UNIQUE, role CHECK, password_hash · code UNIQUE, capacity CHECK &gt; 0, retired_at</span></div>
  <div class="lz-layer"><span class="lz-lname">devices → labs</span><span class="lz-lnote">serial_no UNIQUE, status CHECK, version cho If-Match</span></div>
  <div class="lz-layer"><span class="lz-lname">bookings → labs, users</span><span class="lz-lnote">EXCLUDE lượt còn hiệu lực chồng giờ, CHECK kết thúc &gt; bắt đầu, version</span></div>
  <div class="lz-layer"><span class="lz-lname">waitlist · issues (Lab 12) · api_keys</span><span class="lz-lnote">hàng chờ Lab 7 · báo hỏng thiết bị · chỉ lưu sha256 của khoá</span></div>
  <div class="lz-layer"><span class="lz-lname">outbox · idempotency_keys · schema_migrations</span><span class="lz-lnote">sự kiện trong cùng transaction (12.4) · khoá dùng chung (12.3) · lịch sử của lược đồ</span></div>
</div>
<p>Năm luật thiết kế, mỗi luật từ một chương trước:</p>
<ol>
  <li><strong>Giữ hình dạng id công khai.</strong> Một con số từ sequence, lộ ra dạng chữ: <code>seq bigint</code> cùng <code>id text GENERATED ALWAYS AS ('bk_' || seq)</code>. Con trỏ (cursor, bài 3.2) vẫn chạy.</li>
  <li><strong>Một luật, một ràng buộc.</strong> “Không có hai lượt còn hiệu lực chồng giờ” thành <code>EXCLUDE USING gist</code> (11.6); “kết thúc sau bắt đầu” thành <code>CHECK</code>; “phòng phải tồn tại” thành khoá ngoại (foreign key). API vẫn kiểm trước để báo lỗi dễ hiểu; CSDL là tuyến cuối cùng không ai đua qua được.</li>
  <li><strong>Đánh index theo truy vấn mình phục vụ.</strong> “Lượt của tôi, mới nhất trước” ⇒ <code>(user_id, created_at DESC, seq DESC)</code>; danh sách của quản lý ⇒ <code>(created_at DESC, seq DESC)</code> (3.2).</li>
  <li><strong>Cột <code>version</code></strong> ở mọi chỗ client gửi <code>If-Match</code> (5.4) hay sự kiện cần thứ tự (10.6).</li>
  <li><strong>Thời gian là <code>timestamptz(3)</code></strong> — mili giây, không phải micro giây. Mục sau giải thích vì sao.</li>
</ol>

<h3>Vì sao timestamptz(3): 900 dòng biến mất</h3>
<p>PostgreSQL lưu thời gian tới micro giây; <code>Date</code> của JavaScript — và do đó chuỗi ISO nằm trong con trỏ — chỉ giữ mili giây. Một trang keyset hỏi “các dòng cũ hơn (created_at, seq) của dòng cuối”; nếu con trỏ mất ba chữ số, các dòng cùng mili giây với mép trang biến mất. <code>perf/precision.mjs</code> đi qua 1.000 dòng, mỗi trang 100, bằng đúng câu SQL của store:</p>
<pre><code class="language-bash">node perf/precision.mjs</code></pre>
<div class="out">1.000 dòng trong MỘT câu INSERT (nhập lô, seed) timestamptz     có 1000 · đi hết các trang thấy  100 (1 trang)  ⇐ SÓT 900
1.000 dòng trong MỘT câu INSERT (nhập lô, seed) timestamptz(3)  có 1000 · đi hết các trang thấy 1000 (10 trang)
1.000 câu INSERT liên tiếp                     timestamptz     có 1000 · đi hết các trang thấy  989 (10 trang)  ⇐ SÓT 11
1.000 câu INSERT liên tiếp                     timestamptz(3)  có 1000 · đi hết các trang thấy 1000 (10 trang)</div>
<p>Nhập lô bằng một câu lệnh cho mọi dòng cùng một <code>now()</code> (giờ bắt đầu transaction), nên trang thứ hai bắt đầu “trước” tất cả chúng: mất 900 dòng, không một báo lỗi. Mỗi dòng một câu INSERT lần này mất 11 (các lần trước 61 và 58: tuỳ có bao nhiêu dòng rơi vào cùng một mili giây). Với <code>timestamptz(3)</code>, CSDL lưu đúng thứ con trỏ mang theo: đủ 1.000/1.000.</p>
<a class="link-card" href="https://www.postgresql.org/docs/18/datatype-datetime.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: PostgreSQL 18 — Date/Time Types (đọc ngày 01/11/2026)</span><span class="lc-sub">“timestamp … nhận độ chính xác p tuỳ chọn, là số chữ số thập phân giữ lại ở phần giây … p cho phép từ 0 tới 6.”</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Khi phỏng vấn / đi làm</h3>
<ul>
  <li><strong>“Sao không để luật ở API?”</strong> Vì mọi kiểu kiểm-rồi-ghi trong code ứng dụng là một cuộc đua khi có hai instance; ràng buộc là chỗ duy nhất mọi đường đi đều phải qua. API vẫn kiểm trước để có lỗi dễ hiểu.</li>
  <li><strong>“Sao id là chuỗi?”</strong> Hợp đồng đã hứa <code>bk_42</code> mờ đục từ Chương 1; CSDL sinh nó từ sequence, nên client không hề biết ta đã chuyển nhà.</li>
  <li><strong>“Em để cái gì ngoài CSDL?”</strong> Xô rate limit và vé realtime: dùng chung nhưng sống ngắn, nên để Redis có TTL; mất chúng chỉ tốn một lần thử lại, không mất dữ liệu.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Giải nén dự án cuối khoá, chạy hai instance kho RAM và proxy (lệnh trong <code>docs/chay-theo-bai.txt</code>), rồi tái hiện 304 sai: lấy ETag ở A, đặt ở B, gửi ETag cũ về A.</li>
  <li>Chạy <code>node perf/precision.mjs</code> và giải thích cho một người bạn, không dùng chữ “micro giây”, vì sao 900 dòng biến mất.</li>
  <li>Với bảng waitlist, ghi ràng buộc nào giữ từng luật của Lab 7, và luật nào không thể thành ràng buộc (gợi ý: vị trí là thứ được tính).</li>
</ol>
<p><strong>Đạt khi:</strong> bạn nói được trong một câu bảy món RAM đi đâu, và vì sao.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">In-memory state (trạng thái trong bộ nhớ)</span><span class="v">Dữ liệu nằm trong biến của một tiến trình — mất khi khởi động lại, instance khác không thấy.</span></div>
  <div class="kv"><span class="k">Instance (bản chạy)</span><span class="v">Một bản tiến trình API đang chạy; production chạy hai bản trở lên sau load balancer.</span></div>
  <div class="kv"><span class="k">Source of truth (nguồn sự thật)</span><span class="v">Chỗ duy nhất mà câu trả lời của nó là đúng; với LabFlow là PostgreSQL.</span></div>
  <div class="kv"><span class="k">Exclusion constraint (ràng buộc loại trừ)</span><span class="v">Không hai dòng nào được khớp một toán tử — ở đây là khoảng giờ chồng nhau trong một phòng.</span></div>
  <div class="kv"><span class="k">Generated column (cột sinh)</span><span class="v">Cột tính từ cột khác (<code>'bk_' || seq</code>), không ai ghi tay.</span></div>
  <div class="kv"><span class="k">Timestamp precision (độ mịn thời gian)</span><span class="v">Giữ bao nhiêu chữ số lẻ của giây; <code>(3)</code> = mili giây, như JavaScript.</span></div>
  <div class="kv"><span class="k">Stale 304 (304 sai)</span><span class="v">“Không đổi” trả lời từ một số phiên bản cũ — client giữ dữ liệu cũ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Bảy loại trạng thái trong bộ nhớ; với hai instance đã đo: lượt đặt mất khi khởi động lại, không thấy ở A, đặt trùng với hai <code>bk_1</code>, 304 sai, vé và API key bị B từ chối.</li>
  <li>Sự thật về PostgreSQL, trạng thái dùng chung ngắn hạn về Redis; hợp đồng công khai (id, trường, lỗi) không đổi.</li>
  <li>Luật lược đồ: giữ hình dạng id, một luật một ràng buộc, đánh index theo truy vấn, có <code>version</code> ở chỗ cần thứ tự.</li>
  <li><code>timestamptz(3)</code> khớp con trỏ mili giây: để micro giây thì mất 900/1.000 dòng khi nhập lô, 11–61 dòng khi chèn từng dòng.</li>
  <li>Bài sau: đưa lược đồ này vào CSDL một cách an toàn — migration, ràng buộc khi chạy thật, dữ liệu mẫu.</li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── 12.2 ─────────────────────────── */
    {
      title: '12.2 — Migrations, constraints and seed data: getting the schema in safely|||12.2 — Migration, ràng buộc và dữ liệu mẫu: đưa lược đồ vào CSDL an toàn',
      slug: 'api-12-11-migration',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bộ chạy migration 60 dòng (checksum, advisory lock, mỗi tệp một transaction), ràng buộc từ chối SQL sai, seed chạy lại được, migration khoá bảng 1 triệu dòng (DEFAULT volatile, CREATE INDEX > 3 s vs CONCURRENTLY 1 ms), mở rộng/thu gọn.',
      content: `${G122}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.2</span>
<h2>Migrations, constraints and seed data: getting the schema in safely</h2>
<p class="lead">Lesson 12.1 decided <em>what</em> the tables are. This lesson is about <em>how</em> they get into a database you cannot simply wipe: numbered migrations that run once, refuse edited history and never run twice at the same time; constraints you can watch refusing bad data; and the ALTER statements that silently lock production for seconds.</p>
<p><strong>What you can do after it:</strong> write and run append-only migrations with LabFlow's 60-line runner (and recognise the same rules in Flyway or Prisma), seed a database repeatably, and tell a safe migration from one that blocks every booking for three seconds. <strong>Why it matters:</strong> the most common way a student project “loses the database” is a schema change run by hand — and the most common production incident on a deploy day is a migration that locks a hot table.</p>
<h3>What a migration file looks like</h3>
<p><code>migrations/001_core.sql</code> creates every table of 12.1 in one file; <code>002_outbox.sql</code>, <code>003_shared_state.sql</code> and <code>004_issues.sql</code> follow (Lab 12 is the fourth). The heart of 001:</p>
<pre><code class="language-sql">CREATE TABLE bookings (
  seq           bigint GENERATED BY DEFAULT AS IDENTITY UNIQUE,
  id            text GENERATED ALWAYS AS ('bk_' || seq) STORED PRIMARY KEY,
  lab_id        text NOT NULL REFERENCES labs,
  user_id       text NOT NULL REFERENCES users,
  start_at      timestamptz(3) NOT NULL,
  end_at        timestamptz(3) NOT NULL,
  status        text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CHECKED_IN', 'CANCELLED')),
  created_at    timestamptz(3) NOT NULL DEFAULT now(),
  version       int NOT NULL DEFAULT 1,
  CONSTRAINT bookings_time_order CHECK (end_at &gt; start_at),
  CONSTRAINT bookings_no_overlap EXCLUDE USING gist (lab_id WITH =, tstzrange(start_at, end_at) WITH &amp;&amp;)
    WHERE (status &lt;&gt; 'CANCELLED')
);</code></pre>
<h3>Migrations: a numbered, append-only history</h3>
<p>Chapters 8–10 created three tables with <code>CREATE TABLE IF NOT EXISTS</code> when a module loaded. That works once; it cannot add a column, has no history, and two instances starting together race. Production schemas change only through <strong>migrations</strong>: numbered SQL files, applied in order, each recorded. LabFlow's runner, <code>src/migrate.js</code> (~60 lines), does four things — the same ideas as Flyway, Prisma Migrate or Knex:</p>
<pre><code class="language-javascript">await db.query('SELECT pg_advisory_lock($1)', [LOCK]);          // 1) only ONE runner at a time, across machines
const done = …SELECT version, checksum FROM schema_migrations…;    // 2) what is already applied
for (const f of files) {                                          //    001_core.sql, 002_outbox.sql … in order
  if (done.has(f) &amp;&amp; done.get(f) !== sha256(sql)) throw …;        // 3) an applied file was EDITED ⇒ stop
  await db.query('BEGIN'); await db.query(sql);                   // 4) one transaction per file:
  await db.query('INSERT INTO schema_migrations …'); await db.query('COMMIT');   //    all of it or none of it
}</code></pre>
<pre><code class="language-bash">npm run -s db:status</code></pre>
<div class="out">  CHƯA áp 001_core.sql
  CHƯA áp 002_outbox.sql
  CHƯA áp 003_shared_state.sql
  CHƯA áp 004_issues.sql</div>
<pre><code class="language-bash">npm run -s db:migrate</code></pre>
<div class="out">  áp 001_core.sql (58 ms)
  áp 002_outbox.sql (5 ms)
  áp 003_shared_state.sql (15 ms)
  áp 004_issues.sql (5 ms)
xong: áp 4 migration</div>
<pre><code class="language-bash">npm run -s db:migrate</code></pre>
<div class="out">không có migration mới</div>
<pre><code class="language-bash">psql "$DATABASE_URL" -c 'SELECT version, checksum, ms, applied_at::time(0) FROM schema_migrations ORDER BY version'</code></pre>
<div class="out">       version        |   checksum   | ms | applied_at 
----------------------+--------------+----+------------
 001_core.sql         | ed7a40c43343 | 58 | 11:58:30
 002_outbox.sql       | b0c90a7db3f1 |  5 | 11:58:30
 003_shared_state.sql | c47edd9300b7 | 15 | 11:58:30
 004_issues.sql       | e44b7b8ae458 |  5 | 11:58:30
(4 rows)</div>
<p>Run it twice and nothing happens — that is what lets a deploy script call it every time. Now the two mistakes everybody makes once. Editing a file that already ran:</p>
<pre><code class="language-bash">echo '-- sửa một dòng chú thích' &gt;&gt; migrations/002_outbox.sql &amp;&amp; npm run -s db:migrate; echo "exit $?"</code></pre>
<div class="out">migration DỪNG: 002_outbox.sql đã áp nhưng nội dung ĐÃ BỊ SỬA (checksum b0c90a7db3f1 ⇒ 302e7ffe0ea0). Đừng sửa migration đã chạy — viết tệp mới.
exit 1</div>
<p>The checksum catches it. The fix is never “edit and force”: revert the edit and write <code>005_…sql</code>. A migration that fails halfway (a typo in its third statement):</p>
<pre><code class="language-bash">printf "CREATE TABLE lab_photos (id text PRIMARY KEY, lab_id text NOT NULL REFERENCES labs);\\nALTER TABLE lab_photos ADD COLUMN url text NOT NULL CHECK (url LIKE 'https://%%');\\nALTER TABLE lab_photos ADD COLUMN size_kb int NOT NULL REFERENCS labs;\\n" &gt; migrations/005_lab_photos.sql &amp;&amp; npm run -s db:migrate; echo "exit $?"</code></pre>
<div class="out">migration DỪNG: 005_lab_photos.sql hỏng, đã ROLLBACK cả tệp: syntax error at or near "REFERENCS"
exit 1</div>
<pre><code class="language-bash">psql "$DATABASE_URL" -Atc "SELECT to_regclass('lab_photos') IS NULL AS khong_co_bang, (SELECT count(*) FROM schema_migrations) AS so_migration"</code></pre>
<div class="out">t|4</div>
<p>The table from the first statement does not exist and the history still has four rows — PostgreSQL runs DDL inside transactions, so a broken file leaves no half-built schema. And two instances starting at the same moment:</p>
<pre><code class="language-bash">(INSTANCE=A npm run -s db:migrate | sed 's/^/[A] /' &amp; INSTANCE=B npm run -s db:migrate | sed 's/^/[B] /' &amp; wait)</code></pre>
<div class="out">[A]   áp 001_core.sql (38 ms)
[A]   áp 002_outbox.sql (3 ms)
[A]   áp 003_shared_state.sql (14 ms)
[A]   áp 004_issues.sql (6 ms)
[A] xong: áp 4 migration
[B] chờ khoá migration 62 ms (instance khác đang chạy)
[B] không có migration mới</div>
<a class="link-card" href="https://www.postgresql.org/docs/18/explicit-locking.html#ADVISORY-LOCKS" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: PostgreSQL 18 — Advisory Locks (read 1 Nov 2026)</span><span class="lc-sub">“Once acquired at session level, an advisory lock is held until explicitly released or the session ends … the system does not enforce their use — it is up to the application to use them correctly.”</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>Seed data</h3>
<p>The fixed course data (3 users, 4 labs, 3 devices, <code>SEED_BOOKINGS</code>, <code>SEED_ISSUES</code>) goes in with <code>npm run db:seed</code>, 5,000 rows per statement with <code>unnest</code>. Rows that exist are skipped, so it is safe to repeat; sequences restart just after the largest seeded id.</p>
<pre><code class="language-bash">SEED_BOOKINGS=10000 SEED_ISSUES=60 npm run -s db:seed</code></pre>
<div class="out">seed labflow_demo: users 3 · labs 4 · devices 3 · bookings 10000 · issues 60 (1805 ms)</div>
<pre><code class="language-bash">SEED_BOOKINGS=10000 SEED_ISSUES=60 npm run -s db:seed</code></pre>
<div class="out">seed labflow_demo: users 3 · labs 4 · devices 3 · bookings 10000 · issues 60 (457 ms)</div>

<h3>Constraints are the last line of defence</h3>
<p>With the seed loaded, try to break the rules directly in SQL — bypassing the API completely:</p>
<pre><code class="language-bash">psql "$DATABASE_URL" -Atc "SELECT conname || ': ' || pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid = 'bookings'::regclass AND contype &lt;&gt; 'n' ORDER BY conname"</code></pre>
<div class="out">bookings_lab_id_fkey: FOREIGN KEY (lab_id) REFERENCES labs(id)
bookings_no_overlap: EXCLUDE USING gist (lab_id WITH =, tstzrange(start_at, end_at) WITH &amp;&amp;) WHERE ((status &lt;&gt; 'CANCELLED'::text))
bookings_pkey: PRIMARY KEY (id)
bookings_seq_key: UNIQUE (seq)
bookings_status_check: CHECK ((status = ANY (ARRAY['PENDING'::text, 'CHECKED_IN'::text, 'CANCELLED'::text])))
bookings_time_order: CHECK ((end_at &gt; start_at))
bookings_user_id_fkey: FOREIGN KEY (user_id) REFERENCES users(id)</div>
<pre><code class="language-bash">psql "$DATABASE_URL" -c "INSERT INTO bookings (lab_id, user_id, start_at, end_at) VALUES ('lab_1', 'usr_1', '2029-01-10 08:00+07', '2029-01-10 10:00+07') RETURNING id" -c "INSERT INTO bookings (lab_id, user_id, start_at, end_at) VALUES ('lab_1', 'usr_2', '2029-01-10 09:00+07', '2029-01-10 11:00+07')"</code></pre>
<div class="out">    id    
----------
 bk_10001
(1 row)

INSERT 0 1
ERROR:  conflicting key value violates exclusion constraint "bookings_no_overlap"
DETAIL:  Key (lab_id, tstzrange(start_at, end_at))=(lab_1, ["2029-01-10 09:00:00+07","2029-01-10 11:00:00+07")) conflicts with existing key (lab_id, tstzrange(start_at, end_at))=(lab_1, ["2029-01-10 08:00:00+07","2029-01-10 10:00:00+07")).</div>
<pre><code class="language-bash">psql "$DATABASE_URL" -c "INSERT INTO bookings (lab_id, user_id, start_at, end_at) VALUES ('lab_1', 'usr_2', '2029-01-10 12:00+07', '2029-01-10 11:00+07')"</code></pre>
<div class="out">ERROR:  new row for relation "bookings" violates check constraint "bookings_time_order"
DETAIL:  Failing row contains (10003, bk_10003, lab_1, usr_2, 2029-01-10 12:00:00+07, 2029-01-10 11:00:00+07, null, PENDING, 2026-11-01 11:58:35.621+07, null, null, 1).</div>
<pre><code class="language-bash">psql "$DATABASE_URL" -c "INSERT INTO bookings (lab_id, user_id, start_at, end_at) VALUES ('lab_9', 'usr_2', '2029-01-10 12:00+07', '2029-01-10 13:00+07')"</code></pre>
<div class="out">ERROR:  insert or update on table "bookings" violates foreign key constraint "bookings_lab_id_fkey"
DETAIL:  Key (lab_id)=(lab_9) is not present in table "labs".</div>
<p>The overlap is refused with the conflicting range in the message; the impossible time range and the unknown lab too. Note <code>bk_10003</code> in the CHECK failure: the failed INSERT already consumed a sequence value. <strong>Ids have gaps</strong> and that is fine — they identify, they do not count.</p>


<h3>Migrations that lock production</h3>
<p>A migration runs against a table that users are writing to <em>right now</em>. Many DDL statements take a lock that makes every INSERT wait until they finish. <code>perf/migration-locks.mjs</code> builds a 1,000,000-row bookings table, starts each statement, and 100 ms later sends one ordinary INSERT from another connection — the wait it measures is what a student pressing “Book” would feel:</p>
<pre><code class="language-bash">node perf/migration-locks.mjs</code></pre>
<div class="out">ADD COLUMN seats int NOT NULL DEFAULT 1                    migration     1 ms · INSERT của người dùng chờ     3 ms
ADD COLUMN token text DEFAULT md5(random()::text)          migration  3209 ms · INSERT của người dùng chờ  3109 ms
CREATE INDEX ON (user_id, start_at)                        migration  3449 ms · INSERT của người dùng chờ  3348 ms
CREATE INDEX CONCURRENTLY ON (user_id, start_at)           migration  4881 ms · INSERT của người dùng chờ     1 ms</div>
<table>
<tr><th>Statement</th><th>Why</th><th>Safe pattern</th></tr>
<tr><td><code>ADD COLUMN … DEFAULT 1</code></td><td>a constant default is stored once in the catalogue (PostgreSQL 11+): 1 ms</td><td>fine as is</td></tr>
<tr><td><code>ADD COLUMN … DEFAULT md5(random()…)</code></td><td>a volatile default must be computed per row ⇒ the whole table is rewritten under lock</td><td>add the column empty, fill in batches, then set the default</td></tr>
<tr><td><code>CREATE INDEX</code></td><td>blocks writes while it reads 1M rows</td><td><code>CREATE INDEX CONCURRENTLY</code>: slower, writes keep flowing</td></tr>
</table>
<p>One catch: <code>CONCURRENTLY</code> refuses to run inside a transaction, and our runner wraps each file in one. A file can opt out with a first line <code>-- migrate:no-transaction</code> (the same idea as Flyway's per-script setting) — at the price of “all or nothing”, so such a file holds exactly one statement:</p>
<pre><code class="language-bash">printf 'CREATE INDEX CONCURRENTLY bookings_lab_start ON bookings (lab_id, start_at);\\n' &gt; migrations/005_bookings_lab_start.sql &amp;&amp; npm run -s db:migrate; echo "exit $?"</code></pre>
<div class="out">migration DỪNG: 005_bookings_lab_start.sql hỏng, đã ROLLBACK cả tệp: CREATE INDEX CONCURRENTLY cannot run inside a transaction block
exit 1</div>
<pre><code class="language-bash">printf -- '-- migrate:no-transaction\\nCREATE INDEX CONCURRENTLY bookings_lab_start ON bookings (lab_id, start_at);\\n' &gt; migrations/005_bookings_lab_start.sql &amp;&amp; npm run -s db:migrate; echo "exit $?"</code></pre>
<div class="out">  áp 005_bookings_lab_start.sql (5 ms)
xong: áp 1 migration
exit 0</div>
<div class="pitfall"><p><strong>Trap — testing migrations on an empty database.</strong> On your laptop every ALTER takes 1 ms because the tables are empty. Rehearse on a copy with production-sized data (the restore drill of 12.7 gives you one) before the real deploy.</p></div>

<h3>On deploy day: expand, then contract</h3>
<p>During a rolling deploy old and new code run <em>together</em> against one database, so every schema change must work with both. Renaming a column in one step breaks every old instance still running. Split it: <strong>expand</strong> (add the new column, nullable or with a constant default — 1 ms above), deploy code that writes both, backfill in batches, deploy code that reads only the new one, then <strong>contract</strong> (drop the old column) in a later release. Migrations run before the new code starts (12.7).</p>

<h3>In interviews / at work</h3>
<ul>
  <li><strong>“How do you change the schema in production?”</strong> Numbered, append-only migrations, applied by the deploy before the new code; never edited after they run (the checksum refuses); slow DDL replaced by its non-blocking form.</li>
  <li><strong>“Do you write down migrations?”</strong> Rarely in practice: rolling back a schema that already has new data is risky; we roll <em>forward</em> with a new migration, and keep backups (12.7).</li>
  <li><strong>“Two servers deploy at once — who migrates?”</strong> Both may try; an advisory lock lets one run while the other waits and then finds nothing to do.</li>
</ul>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok"><ol>
  <li>Create a database <code>labflow_mine</code>, run <code>npm run db:migrate</code> twice and <code>npm run db:status</code>; seed with <code>SEED_BOOKINGS=2000</code>.</li>
  <li>Write <code>005_lab_photos.sql</code> (a table with a foreign key to labs and a <code>CHECK</code> that the URL starts with <code>https://</code>); apply it, insert a row with an <code>http://</code> URL and read the error.</li>
  <li>Edit <code>005</code> after it ran and confirm the runner stops; revert. Then add <code>006</code> with an index on <code>lab_photos(lab_id)</code> using <code>CONCURRENTLY</code>.</li>
</ol>
<p><strong>Done when:</strong> <code>schema_migrations</code> has six rows, the bad insert fails with the name of your constraint, and <code>006</code> starts with <code>-- migrate:no-transaction</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Migration</span><span class="v">A numbered, append-only schema change, applied once and recorded.</span></div>
  <div class="kv"><span class="k">Checksum</span><span class="v">A hash of an applied migration; a mismatch means someone edited history.</span></div>
  <div class="kv"><span class="k">Advisory lock</span><span class="v">An application-named lock in PostgreSQL; here, “one migration runner at a time”.</span></div>
  <div class="kv"><span class="k">Transactional DDL</span><span class="v">CREATE/ALTER inside a transaction, so a failed file leaves nothing behind.</span></div>
  <div class="kv"><span class="k">Table rewrite</span><span class="v">An ALTER that copies every row under a lock — seconds on a big table.</span></div>
  <div class="kv"><span class="k">CREATE INDEX CONCURRENTLY</span><span class="v">Builds an index without blocking writes; slower and not allowed in a transaction.</span></div>
  <div class="kv"><span class="k">Seed</span><span class="v">Fixed starting data loaded by a script that is safe to rerun.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Migrations are numbered SQL files, one transaction each, recorded with a checksum; running them twice does nothing.</li>
  <li>An edited applied file is refused; a broken file is rolled back whole; two runners queue on an advisory lock.</li>
  <li>Constraints refuse bad rows even from raw SQL — overlap (EXCLUDE), time order (CHECK), unknown lab (FK); failed inserts leave gaps in ids.</li>
  <li>On 1M rows: constant default 1 ms, volatile default and plain CREATE INDEX each held an INSERT for over 3 s; CONCURRENTLY kept it at 1 ms.</li>
  <li>Seeds are repeatable (<code>ON CONFLICT DO NOTHING</code>, then move the sequences).</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-cs3-1" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">You met this in PRJ301 — ⭐ CS.3 (1): HikariCP, Flyway, JdbcTemplate</span><span class="lc-sub">Same: numbered migrations run once, recorded with a checksum, never edited after they ran. Different: here you write the runner yourself (advisory lock, one transaction per file) and measure which DDL blocks writes on 1M rows. Not taken PRJ301? This lesson stands on its own.</span></span>
  <span class="lc-cta">OPEN LESSON →</span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.2</span>
<h2>Migration, ràng buộc và dữ liệu mẫu: đưa lược đồ vào CSDL một cách an toàn</h2>
<p class="lead">Bài 12.1 quyết định bảng <em>là gì</em>. Bài này nói chúng vào một CSDL không thể xoá đi làm lại <em>như thế nào</em>: migration đánh số chạy đúng một lần, từ chối lịch sử bị sửa và không bao giờ chạy hai bản cùng lúc; ràng buộc mà bạn tận mắt thấy từ chối dữ liệu sai; và những câu ALTER âm thầm khoá production vài giây.</p>
<p><strong>Học xong bạn làm được:</strong> viết và chạy migration chỉ-viết-thêm bằng bộ chạy 60 dòng của LabFlow (và nhận ra đúng những luật ấy trong Flyway hay Prisma), nạp dữ liệu mẫu chạy lại được, và phân biệt migration an toàn với migration chặn mọi lượt đặt ba giây. <strong>Vì sao quan trọng:</strong> cách phổ biến nhất mà đồ án sinh viên “mất CSDL” là đổi lược đồ bằng tay — và sự cố production hay gặp nhất ngày triển khai là một migration khoá bảng đang nóng.</p>
<h3>Một tệp migration trông thế nào</h3>
<p><code>migrations/001_core.sql</code> tạo mọi bảng của bài 12.1 trong một tệp; tiếp theo là <code>002_outbox.sql</code>, <code>003_shared_state.sql</code> và <code>004_issues.sql</code> (tệp thứ tư là Lab 12). Phần lõi của 001:</p>
<pre><code class="language-sql">CREATE TABLE bookings (
  seq           bigint GENERATED BY DEFAULT AS IDENTITY UNIQUE,
  id            text GENERATED ALWAYS AS ('bk_' || seq) STORED PRIMARY KEY,
  lab_id        text NOT NULL REFERENCES labs,
  user_id       text NOT NULL REFERENCES users,
  start_at      timestamptz(3) NOT NULL,
  end_at        timestamptz(3) NOT NULL,
  status        text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CHECKED_IN', 'CANCELLED')),
  created_at    timestamptz(3) NOT NULL DEFAULT now(),
  version       int NOT NULL DEFAULT 1,
  CONSTRAINT bookings_time_order CHECK (end_at &gt; start_at),
  CONSTRAINT bookings_no_overlap EXCLUDE USING gist (lab_id WITH =, tstzrange(start_at, end_at) WITH &amp;&amp;)
    WHERE (status &lt;&gt; 'CANCELLED')
);</code></pre>
<h3>Migration: lịch sử đánh số, chỉ được viết thêm</h3>
<p>Chương 8–10 tạo ba bảng bằng <code>CREATE TABLE IF NOT EXISTS</code> lúc một module được nạp. Cách đó chạy được một lần; nó không thêm được cột, không có lịch sử, và hai instance khởi động cùng lúc sẽ đua nhau. Lược đồ production chỉ đổi qua <strong>migration</strong>: tệp SQL đánh số, áp theo thứ tự, mỗi tệp được ghi sổ. Bộ chạy của LabFlow, <code>src/migrate.js</code> (~60 dòng), làm bốn việc — cùng ý tưởng với Flyway, Prisma Migrate hay Knex:</p>
<pre><code class="language-javascript">await db.query('SELECT pg_advisory_lock($1)', [LOCK]);          // 1) chỉ MỘT bộ chạy tại một thời điểm, kể cả khác máy
const done = …SELECT version, checksum FROM schema_migrations…;    // 2) cái gì đã áp rồi
for (const f of files) {                                          //    001_core.sql, 002_outbox.sql … theo thứ tự
  if (done.has(f) &amp;&amp; done.get(f) !== sha256(sql)) throw …;        // 3) tệp đã áp bị SỬA ⇒ dừng
  await db.query('BEGIN'); await db.query(sql);                   // 4) mỗi tệp một transaction:
  await db.query('INSERT INTO schema_migrations …'); await db.query('COMMIT');   //    hoặc tất cả, hoặc không gì
}</code></pre>
<pre><code class="language-bash">npm run -s db:status</code></pre>
<div class="out">  CHƯA áp 001_core.sql
  CHƯA áp 002_outbox.sql
  CHƯA áp 003_shared_state.sql
  CHƯA áp 004_issues.sql</div>
<pre><code class="language-bash">npm run -s db:migrate</code></pre>
<div class="out">  áp 001_core.sql (58 ms)
  áp 002_outbox.sql (5 ms)
  áp 003_shared_state.sql (15 ms)
  áp 004_issues.sql (5 ms)
xong: áp 4 migration</div>
<pre><code class="language-bash">npm run -s db:migrate</code></pre>
<div class="out">không có migration mới</div>
<pre><code class="language-bash">psql "$DATABASE_URL" -c 'SELECT version, checksum, ms, applied_at::time(0) FROM schema_migrations ORDER BY version'</code></pre>
<div class="out">       version        |   checksum   | ms | applied_at 
----------------------+--------------+----+------------
 001_core.sql         | ed7a40c43343 | 58 | 11:58:30
 002_outbox.sql       | b0c90a7db3f1 |  5 | 11:58:30
 003_shared_state.sql | c47edd9300b7 | 15 | 11:58:30
 004_issues.sql       | e44b7b8ae458 |  5 | 11:58:30
(4 rows)</div>
<p>Chạy hai lần thì lần sau không làm gì — đó là điều cho phép script triển khai gọi nó mọi lần. Giờ là hai lỗi ai cũng mắc một lần. Sửa một tệp đã chạy:</p>
<pre><code class="language-bash">echo '-- sửa một dòng chú thích' &gt;&gt; migrations/002_outbox.sql &amp;&amp; npm run -s db:migrate; echo "exit $?"</code></pre>
<div class="out">migration DỪNG: 002_outbox.sql đã áp nhưng nội dung ĐÃ BỊ SỬA (checksum b0c90a7db3f1 ⇒ 302e7ffe0ea0). Đừng sửa migration đã chạy — viết tệp mới.
exit 1</div>
<p>Checksum bắt được. Cách sửa không bao giờ là “sửa rồi ép”: hoàn tác chỗ sửa và viết <code>005_…sql</code>. Một migration hỏng giữa chừng (gõ sai ở câu lệnh thứ ba):</p>
<pre><code class="language-bash">printf "CREATE TABLE lab_photos (id text PRIMARY KEY, lab_id text NOT NULL REFERENCES labs);\\nALTER TABLE lab_photos ADD COLUMN url text NOT NULL CHECK (url LIKE 'https://%%');\\nALTER TABLE lab_photos ADD COLUMN size_kb int NOT NULL REFERENCS labs;\\n" &gt; migrations/005_lab_photos.sql &amp;&amp; npm run -s db:migrate; echo "exit $?"</code></pre>
<div class="out">migration DỪNG: 005_lab_photos.sql hỏng, đã ROLLBACK cả tệp: syntax error at or near "REFERENCS"
exit 1</div>
<pre><code class="language-bash">psql "$DATABASE_URL" -Atc "SELECT to_regclass('lab_photos') IS NULL AS khong_co_bang, (SELECT count(*) FROM schema_migrations) AS so_migration"</code></pre>
<div class="out">t|4</div>
<p>Bảng của câu lệnh đầu không tồn tại và lịch sử vẫn bốn dòng — PostgreSQL chạy DDL trong transaction, nên một tệp hỏng không để lại lược đồ dở dang. Và hai instance khởi động cùng một lúc:</p>
<pre><code class="language-bash">(INSTANCE=A npm run -s db:migrate | sed 's/^/[A] /' &amp; INSTANCE=B npm run -s db:migrate | sed 's/^/[B] /' &amp; wait)</code></pre>
<div class="out">[A]   áp 001_core.sql (38 ms)
[A]   áp 002_outbox.sql (3 ms)
[A]   áp 003_shared_state.sql (14 ms)
[A]   áp 004_issues.sql (6 ms)
[A] xong: áp 4 migration
[B] chờ khoá migration 62 ms (instance khác đang chạy)
[B] không có migration mới</div>
<a class="link-card" href="https://www.postgresql.org/docs/18/explicit-locking.html#ADVISORY-LOCKS" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: PostgreSQL 18 — Advisory Locks (đọc ngày 01/11/2026)</span><span class="lc-sub">“Khoá advisory lấy ở mức phiên (session) được giữ tới khi nhả rõ ràng hoặc phiên kết thúc … hệ thống không ép dùng — ứng dụng phải tự dùng cho đúng.”</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Dữ liệu mẫu (seed)</h3>
<p>Dữ liệu cố định của khoá (3 người dùng, 4 phòng, 3 thiết bị, <code>SEED_BOOKINGS</code>, <code>SEED_ISSUES</code>) vào bằng <code>npm run db:seed</code>, 5.000 dòng mỗi câu lệnh nhờ <code>unnest</code>. Dòng đã có thì bỏ qua, nên chạy lại an toàn; sequence bắt đầu ngay sau id mẫu lớn nhất.</p>
<pre><code class="language-bash">SEED_BOOKINGS=10000 SEED_ISSUES=60 npm run -s db:seed</code></pre>
<div class="out">seed labflow_demo: users 3 · labs 4 · devices 3 · bookings 10000 · issues 60 (1805 ms)</div>
<pre><code class="language-bash">SEED_BOOKINGS=10000 SEED_ISSUES=60 npm run -s db:seed</code></pre>
<div class="out">seed labflow_demo: users 3 · labs 4 · devices 3 · bookings 10000 · issues 60 (457 ms)</div>

<h3>Ràng buộc là tuyến phòng thủ cuối</h3>
<p>Đã có dữ liệu mẫu, giờ thử phá luật thẳng bằng SQL — bỏ qua API hoàn toàn:</p>
<pre><code class="language-bash">psql "$DATABASE_URL" -Atc "SELECT conname || ': ' || pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid = 'bookings'::regclass AND contype &lt;&gt; 'n' ORDER BY conname"</code></pre>
<div class="out">bookings_lab_id_fkey: FOREIGN KEY (lab_id) REFERENCES labs(id)
bookings_no_overlap: EXCLUDE USING gist (lab_id WITH =, tstzrange(start_at, end_at) WITH &amp;&amp;) WHERE ((status &lt;&gt; 'CANCELLED'::text))
bookings_pkey: PRIMARY KEY (id)
bookings_seq_key: UNIQUE (seq)
bookings_status_check: CHECK ((status = ANY (ARRAY['PENDING'::text, 'CHECKED_IN'::text, 'CANCELLED'::text])))
bookings_time_order: CHECK ((end_at &gt; start_at))
bookings_user_id_fkey: FOREIGN KEY (user_id) REFERENCES users(id)</div>
<pre><code class="language-bash">psql "$DATABASE_URL" -c "INSERT INTO bookings (lab_id, user_id, start_at, end_at) VALUES ('lab_1', 'usr_1', '2029-01-10 08:00+07', '2029-01-10 10:00+07') RETURNING id" -c "INSERT INTO bookings (lab_id, user_id, start_at, end_at) VALUES ('lab_1', 'usr_2', '2029-01-10 09:00+07', '2029-01-10 11:00+07')"</code></pre>
<div class="out">    id    
----------
 bk_10001
(1 row)

INSERT 0 1
ERROR:  conflicting key value violates exclusion constraint "bookings_no_overlap"
DETAIL:  Key (lab_id, tstzrange(start_at, end_at))=(lab_1, ["2029-01-10 09:00:00+07","2029-01-10 11:00:00+07")) conflicts with existing key (lab_id, tstzrange(start_at, end_at))=(lab_1, ["2029-01-10 08:00:00+07","2029-01-10 10:00:00+07")).</div>
<pre><code class="language-bash">psql "$DATABASE_URL" -c "INSERT INTO bookings (lab_id, user_id, start_at, end_at) VALUES ('lab_1', 'usr_2', '2029-01-10 12:00+07', '2029-01-10 11:00+07')"</code></pre>
<div class="out">ERROR:  new row for relation "bookings" violates check constraint "bookings_time_order"
DETAIL:  Failing row contains (10003, bk_10003, lab_1, usr_2, 2029-01-10 12:00:00+07, 2029-01-10 11:00:00+07, null, PENDING, 2026-11-01 11:58:35.621+07, null, null, 1).</div>
<pre><code class="language-bash">psql "$DATABASE_URL" -c "INSERT INTO bookings (lab_id, user_id, start_at, end_at) VALUES ('lab_9', 'usr_2', '2029-01-10 12:00+07', '2029-01-10 13:00+07')"</code></pre>
<div class="out">ERROR:  insert or update on table "bookings" violates foreign key constraint "bookings_lab_id_fkey"
DETAIL:  Key (lab_id)=(lab_9) is not present in table "labs".</div>
<p>Lượt chồng giờ bị từ chối, thông báo kèm luôn khoảng giờ đang xung đột; khoảng giờ vô lý và phòng không tồn tại cũng vậy. Để ý <code>bk_10003</code> trong lỗi CHECK: câu INSERT hỏng đã tiêu một giá trị của sequence. <strong>Id có lỗ hổng</strong> và điều đó bình thường — id để nhận diện, không để đếm.</p>


<h3>Migration khoá production</h3>
<p>Migration chạy trên bảng mà người dùng đang ghi <em>ngay lúc này</em>. Nhiều câu DDL lấy một khoá khiến mọi INSERT phải chờ tới khi chúng xong. <code>perf/migration-locks.mjs</code> dựng bảng 1.000.000 lượt đặt, chạy từng câu lệnh, và 100 ms sau gửi một câu INSERT bình thường từ kết nối khác — thời gian chờ đo được chính là cảm giác của sinh viên đang bấm “Đặt”:</p>
<pre><code class="language-bash">node perf/migration-locks.mjs</code></pre>
<div class="out">ADD COLUMN seats int NOT NULL DEFAULT 1                    migration     1 ms · INSERT của người dùng chờ     3 ms
ADD COLUMN token text DEFAULT md5(random()::text)          migration  3209 ms · INSERT của người dùng chờ  3109 ms
CREATE INDEX ON (user_id, start_at)                        migration  3449 ms · INSERT của người dùng chờ  3348 ms
CREATE INDEX CONCURRENTLY ON (user_id, start_at)           migration  4881 ms · INSERT của người dùng chờ     1 ms</div>
<table>
<tr><th>Câu lệnh</th><th>Vì sao</th><th>Cách an toàn</th></tr>
<tr><td><code>ADD COLUMN … DEFAULT 1</code></td><td>mặc định là hằng số được lưu một lần trong catalogue (PostgreSQL 11+): 1 ms</td><td>cứ thế mà dùng</td></tr>
<tr><td><code>ADD COLUMN … DEFAULT md5(random()…)</code></td><td>mặc định thay đổi theo dòng phải tính cho từng dòng ⇒ cả bảng bị viết lại trong lúc khoá</td><td>thêm cột rỗng, điền theo lô, rồi mới đặt mặc định</td></tr>
<tr><td><code>CREATE INDEX</code></td><td>chặn ghi trong lúc đọc 1 triệu dòng</td><td><code>CREATE INDEX CONCURRENTLY</code>: chậm hơn, nhưng ghi vẫn chảy</td></tr>
</table>
<p>Một điểm vướng: <code>CONCURRENTLY</code> không chịu chạy trong transaction, mà bộ chạy của ta bọc mỗi tệp trong một transaction. Tệp có thể xin miễn bằng dòng đầu <code>-- migrate:no-transaction</code> (cùng ý tưởng với tuỳ chọn theo từng script của Flyway) — đổi lại mất “tất cả hoặc không gì”, nên tệp loại này chỉ chứa đúng một câu lệnh:</p>
<pre><code class="language-bash">printf 'CREATE INDEX CONCURRENTLY bookings_lab_start ON bookings (lab_id, start_at);\\n' &gt; migrations/005_bookings_lab_start.sql &amp;&amp; npm run -s db:migrate; echo "exit $?"</code></pre>
<div class="out">migration DỪNG: 005_bookings_lab_start.sql hỏng, đã ROLLBACK cả tệp: CREATE INDEX CONCURRENTLY cannot run inside a transaction block
exit 1</div>
<pre><code class="language-bash">printf -- '-- migrate:no-transaction\\nCREATE INDEX CONCURRENTLY bookings_lab_start ON bookings (lab_id, start_at);\\n' &gt; migrations/005_bookings_lab_start.sql &amp;&amp; npm run -s db:migrate; echo "exit $?"</code></pre>
<div class="out">  áp 005_bookings_lab_start.sql (5 ms)
xong: áp 1 migration
exit 0</div>
<div class="pitfall"><p><strong>Bẫy — thử migration trên CSDL rỗng.</strong> Trên máy bạn ALTER nào cũng mất 1 ms vì bảng trống. Diễn tập trên bản sao có dữ liệu cỡ production (bài diễn tập khôi phục 12.7 cho bạn một bản) trước khi triển khai thật.</p></div>

<h3>Ngày triển khai: mở rộng trước, thu gọn sau</h3>
<p>Khi triển khai cuốn chiếu (rolling deploy), mã cũ và mã mới chạy <em>cùng lúc</em> trên một CSDL, nên mọi thay đổi lược đồ phải chạy được với cả hai. Đổi tên một cột trong một bước làm hỏng mọi instance cũ còn đang chạy. Hãy tách: <strong>mở rộng</strong> (expand — thêm cột mới, cho phép NULL hoặc mặc định hằng số — 1 ms như trên), triển khai mã ghi cả hai, điền dữ liệu cũ theo lô, triển khai mã chỉ đọc cột mới, rồi mới <strong>thu gọn</strong> (contract — xoá cột cũ) ở một lần phát hành sau. Migration chạy trước khi mã mới khởi động (12.7).</p>

<h3>Khi phỏng vấn / đi làm</h3>
<ul>
  <li><strong>“Em đổi lược đồ trên production thế nào?”</strong> Migration đánh số, chỉ viết thêm, được bước triển khai áp trước khi chạy mã mới; không bao giờ sửa sau khi đã chạy (checksum từ chối); câu DDL chậm thay bằng dạng không chặn.</li>
  <li><strong>“Em có viết migration ngược (down) không?”</strong> Thực tế ít khi: lùi một lược đồ đã có dữ liệu mới rất rủi ro; ta tiến <em>tới</em> bằng migration mới, và giữ bản sao lưu (12.7).</li>
  <li><strong>“Hai máy chủ cùng triển khai — ai chạy migration?”</strong> Cả hai có thể thử; advisory lock để một bên chạy, bên kia chờ rồi thấy không còn gì để làm.</li>
</ul>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
  <li>Tạo CSDL <code>labflow_mine</code>, chạy <code>npm run db:migrate</code> hai lần và <code>npm run db:status</code>; nạp mẫu với <code>SEED_BOOKINGS=2000</code>.</li>
  <li>Viết <code>005_lab_photos.sql</code> (bảng có khoá ngoại tới labs và <code>CHECK</code> URL bắt đầu bằng <code>https://</code>); áp nó, chèn một dòng URL <code>http://</code> và đọc lỗi.</li>
  <li>Sửa <code>005</code> sau khi đã chạy và xác nhận bộ chạy dừng; hoàn tác. Rồi thêm <code>006</code> tạo index trên <code>lab_photos(lab_id)</code> bằng <code>CONCURRENTLY</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>schema_migrations</code> có sáu dòng, câu chèn sai báo lỗi kèm tên ràng buộc của bạn, và <code>006</code> mở đầu bằng <code>-- migrate:no-transaction</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Migration (thay đổi lược đồ)</span><span class="v">Một thay đổi lược đồ đánh số, chỉ viết thêm, áp đúng một lần và được ghi sổ.</span></div>
  <div class="kv"><span class="k">Checksum (mã kiểm)</span><span class="v">Băm của migration đã áp; lệch nghĩa là có người sửa lịch sử.</span></div>
  <div class="kv"><span class="k">Advisory lock (khoá tư vấn)</span><span class="v">Khoá do ứng dụng đặt tên trong PostgreSQL; ở đây là “mỗi lúc một bộ chạy migration”.</span></div>
  <div class="kv"><span class="k">Transactional DDL (DDL trong transaction)</span><span class="v">CREATE/ALTER chạy trong transaction, nên tệp hỏng không để lại gì.</span></div>
  <div class="kv"><span class="k">Table rewrite (viết lại bảng)</span><span class="v">Câu ALTER chép lại mọi dòng trong lúc khoá — vài giây với bảng lớn.</span></div>
  <div class="kv"><span class="k">CREATE INDEX CONCURRENTLY (tạo index không chặn)</span><span class="v">Dựng index mà không chặn ghi; chậm hơn và không được chạy trong transaction.</span></div>
  <div class="kv"><span class="k">Seed (dữ liệu mẫu)</span><span class="v">Dữ liệu khởi đầu cố định, nạp bằng script chạy lại an toàn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Migration là các tệp SQL đánh số, mỗi tệp một transaction, ghi sổ kèm checksum; chạy hai lần thì lần sau không làm gì.</li>
  <li>Tệp đã áp bị sửa thì bị từ chối; tệp hỏng được rollback trọn; hai bộ chạy xếp hàng trên advisory lock.</li>
  <li>Ràng buộc từ chối dòng sai kể cả từ SQL viết tay — chồng giờ (EXCLUDE), thứ tự giờ (CHECK), phòng lạ (FK); INSERT hỏng để lại lỗ trong id.</li>
  <li>Trên 1 triệu dòng: mặc định hằng số 1 ms, mặc định thay đổi theo dòng và CREATE INDEX thường mỗi cái giữ một INSERT hơn 3 s; CONCURRENTLY giữ nó ở 1 ms.</li>
  <li>Seed chạy lại được (<code>ON CONFLICT DO NOTHING</code>, rồi dời sequence).</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-cs3-1" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Bạn đã gặp ở PRJ301 — ⭐ CS.3 (1): HikariCP, Flyway, JdbcTemplate</span><span class="lc-sub">Giống: migration đánh số chạy một lần, ghi kèm checksum, đã chạy thì không sửa. Khác: ở đây bạn tự viết bộ chạy (advisory lock, mỗi file một transaction) và đo câu DDL nào chặn ghi trên 1 triệu dòng. Chưa học PRJ301? Bài này tự đủ.</span></span>
  <span class="lc-cta">MỞ BÀI →</span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 12.3 ─────────────────────────── */
    {
      title: '12.3 — Building on PostgreSQL: one pool, transactions, and rules the database enforces|||12.3 — Dựng trên PostgreSQL: một pool, transaction và luật do CSDL giữ',
      slug: 'api-12-2-xay-dung',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Store memory|pg chạy cùng 18 test, một pool thay bảy pool, pool cạn ⇒ 503 + Retry-After, lượt đặt là transaction: 50 lượt cùng khung giờ qua hai instance RAM 2 / PostgreSQL 1, luật tối đa 3 lượt không khoá lọt 5–8 / có khoá 3, keyset từ index.',
      content: `${G123}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.3</span>
<h2>Building on PostgreSQL: one pool, transactions, and rules the database enforces</h2>
<p class="lead">The schema exists; now every route must use it. This lesson moves LabFlow's routes onto a store interface, gives each instance one connection pool sized on purpose, writes a booking as a transaction, and repeats Lesson 11.6's race — fifty people, one slot — through the real API on two instances.</p>
<p><strong>What you can do after it:</strong> put a database behind an existing API without changing its contract, size a pool from <code>max_connections</code>, turn database errors into the right HTTP codes, and prove with a race script that a rule holds across instances. <strong>Why it matters:</strong> “we moved from in-memory to PostgreSQL and the tests stayed green” is the sentence that makes a capstone credible.</p>

<h3>One interface, two stores</h3>
<p>Routes stop touching arrays. They call <code>store.getBooking()</code>, <code>store.createBooking()</code>… and <code>src/store/index.js</code> picks the implementation once, at start-up:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">route</span><span class="lz-t">validate + authorize</span><span class="lz-d">HTTP only: 400, 401, 404, view</span></div>
  <div class="lz-step"><span class="lz-k">store</span><span class="lz-t">the same 39 async functions</span><span class="lz-d">getBooking, createBooking, listBookings…</span></div>
  <div class="lz-step"><span class="lz-k">memory.js</span><span class="lz-t">arrays (Chapters 1–11)</span><span class="lz-d">npm test, no database</span></div>
  <div class="lz-step"><span class="lz-k">pg.js</span><span class="lz-t">SQL + transactions</span><span class="lz-d">LABFLOW_STORE=pg</span></div>
</div>
<p>The payoff: the <em>same</em> test files run against both. Five new tests in <code>test/capstone.test.mjs</code> cover the rules that only matter with real concurrency; the outbox test runs only where an outbox exists:</p>
<pre><code class="language-bash">DATABASE_URL=postgres://labflow@localhost:55432/labflow_test npm run -s test:pg 2&gt;&amp;1 | grep -E "^seed|^ℹ (tests|pass|fail|skipped)|12\\.[0-9]:"</code></pre>
<div class="out">seed labflow_test: users 3 · labs 4 · devices 3 · bookings 0 · issues 0 (5 ms)
✔ 12.3: 20 request cùng đặt MỘT khung giờ ⇒ đúng 1 lượt 201, 19 lượt 409 kèm conflictWith (69.824833ms)
✔ 12.3: một sinh viên bấm 6 lượt song song ⇒ chỉ 3 lượt được (TOO_MANY_ACTIVE_BOOKINGS) (12.659875ms)
✔ 12.4: hai quản lý cùng sửa MỘT thiết bị với cùng If-Match ⇒ một 200, một 412 (5.779667ms)
✔ 12.3: phân trang con trỏ qua 30 lượt tạo liên tiếp — không trùng, không sót (86.538084ms)
✔ 12.5: lượt đặt bị 409 KHÔNG để lại sự kiện; lượt 201 có đúng một sự kiện (outbox cùng transaction) (5.255666ms)
ℹ tests 18
ℹ pass 18
ℹ fail 0
ℹ skipped 0</div>
<p><code>npm test</code> on the RAM store gives 17 passed and 1 skipped (the outbox test). <code>npm run test:pg</code> first rebuilds <code>labflow_test</code> from the migrations — and refuses to wipe any database whose name does not end in <code>_test</code>.</p>

<h3>One pool per instance, sized on purpose</h3>
<p>Opening a PostgreSQL connection costs a process on the server and a few milliseconds of handshake, so apps keep a <strong>pool</strong> of open connections and lend them out. Chapter 11's code had grown seven separate pools:</p>
<pre><code class="language-bash">grep -rn "new pg.Pool" src | sed -E 's/connectionString: [^,]+, //' | cut -c1-110</code></pre>
<div class="out">src/worker.js:52:  const db = new pg.Pool({ max: 3 });
src/idempotency-pg.js:7:const pool = new pg.Pool({ max: 5 });
src/exportTask.js:6:export const pool = new pg.Pool({ max: 5 });
src/routes/notes.js:11:const primary = new pg.Pool({ max: 5 });
src/routes/notes.js:12:const replica = new pg.Pool({ max: 5 });
src/routes/webhooks.js:12:export const pool = new pg.Pool({ max: 3 });
src/routes/stats.js:7:const pool = new pg.Pool({ max: 10 });</div>
<p>Now there is one, in <code>src/pg.js</code>, and every module borrows from it (the two left in <code>notes.js</code>/<code>stats.js</code> are Chapter 9’s replica demos, loaded only with <code>LABFLOW_PG=1</code>):</p>
<pre><code class="language-javascript">export const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  max: config.poolMax,                       // 10 per instance; instances × max must fit max_connections
  connectionTimeoutMillis: config.poolWaitMs, // 2 s: pool empty ⇒ FAIL instead of waiting forever (pg's default is 0 = forever)
  statement_timeout: 5000,                    // a query running &gt; 5 s is cancelled by PostgreSQL itself
  application_name: 'labflow-api-A',          // visible in pg_stat_activity
});
pool.on('error', (e) =&gt; console.error('pg pool:', e.message));   // an idle connection dying must not kill the process</code></pre>
<p>A pool is a queue. Twenty queries of 100 ms against two connections need a full second — whoever waits longer than the timeout gets an error:</p>
<pre><code class="language-bash">MAX=2 WAIT=0 node perf/pool.mjs</code></pre>
<div class="out">max=2 chờ tối đa ∞ ms · 20 truy vấn 100 ms: xong 20 (nhanh nhất 103 ms, chậm nhất 1028 ms) · lỗi 0 · tổng 1028 ms</div>
<pre><code class="language-bash">MAX=2 WAIT=500 node perf/pool.mjs</code></pre>
<div class="out">max=2 chờ tối đa 500 ms · 20 truy vấn 100 ms: xong 10 (nhanh nhất 104 ms, chậm nhất 517 ms) · lỗi 10 sau ~502 ms: "timeout exceeded when trying to connect" · tổng 517 ms</div>
<pre><code class="language-bash">MAX=10 WAIT=500 node perf/pool.mjs</code></pre>
<div class="out">max=10 chờ tối đa 500 ms · 20 truy vấn 100 ms: xong 20 (nhanh nhất 103 ms, chậm nhất 207 ms) · lỗi 0 · tổng 207 ms</div>
<p>With no timeout, ten requests would hang 0.5–1 s; with 500 ms they fail fast, and LabFlow turns that failure into <code>503 DEPENDENCY_DOWN</code> + <code>Retry-After</code> (8.4) — a client can retry; a hung request just holds a socket. How big may the pools be? Ask the server:</p>
<pre><code class="language-bash">psql postgres://labflow@localhost:55432/labflow_app -Atc "SHOW max_connections" -c "SHOW superuser_reserved_connections"</code></pre>
<div class="out">100
3</div>
<p>100 slots minus 3 for superusers: two API instances × 10 + the worker's 10 + the relay's listener + a migration runner = 32. Eight instances would need 82 — near the ceiling, which is when you put PgBouncer in front (<a href="/courses/postgresql/learn?lessonSlug=postgresql-14-2-pool-pgbouncer">PostgreSQL 14.2</a>). The live picture while the stack runs:</p>
<pre><code class="language-bash">psql "$DATABASE_URL" -c "SELECT application_name, state, count(*) FROM pg_stat_activity WHERE datname = current_database() AND backend_type = 'client backend' GROUP BY 1, 2 ORDER BY 1, 2"</code></pre>
<div class="out"> application_name | state  | count 
------------------+--------+-------
 labflow-api-A    | idle   |     2
 labflow-api-B    | idle   |     3
 labflow-relay    | idle   |     1
 labflow-worker   | idle   |     1
 psql             | active |     1
(5 rows)</div>
<a class="link-card" href="https://node-postgres.com/apis/pool" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: node-postgres — pg.Pool (read 1 Nov 2026)</span><span class="lc-sub">max defaults to 10; connectionTimeoutMillis “by default is 0 which means no timeout”; “when a client is sitting idly in the pool it can still emit errors” — listen for 'error'.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>A booking is a transaction</h3>
<p><code>createBooking</code> in the pg store does three reads and two writes that must succeed or fail together:</p>
<pre><code class="language-javascript">b = await tx(async (c) =&gt; {                                   // BEGIN … COMMIT, ROLLBACK on any error
  if (!(await c.query('SELECT 1 FROM labs WHERE id = $1 AND retired_at IS NULL', [labId])).rowCount)
    throw new HttpError(422, 'UNKNOWN_LAB', { id: labId });
  if (role === 'STUDENT') {
    await c.query('SELECT 1 FROM users WHERE id = $1 FOR UPDATE', [userId]);   // this user's requests queue here
    const n = …count active bookings of userId…;
    if (n &gt;= 3) throw new HttpError(422, 'TOO_MANY_ACTIVE_BOOKINGS', { max: 3 });
  }
  const row = …INSERT INTO bookings … RETURNING *…;           // EXCLUDE may refuse ⇒ 23P01
  await outbox(c, 'created', row);                             // the event, same transaction (12.5)
  return row;
});</code></pre>
<p>Fifty managers press “Book” for the same lab and slot, through the proxy, so both instances receive about half. First the RAM store, then PostgreSQL:</p>
<pre><code class="language-bash">node perf/race-api.mjs slot 50</code></pre>
<div class="out">50 request cùng đặt lab_1 2027-06-01 07:00–09:00: 201@A×1  201@B×1  409@A×24  409@B×24
GET /v2/bookings khung giờ đó (qua proxy): 1 lượt PENDING</div>
<pre><code class="language-bash">node perf/race-api.mjs slot 50</code></pre>
<div class="out">50 request cùng đặt lab_1 2027-06-01 07:00–09:00: 409@B×25  409@A×24  201@A×1
GET /v2/bookings khung giờ đó (qua proxy): 1 lượt PENDING</div>
<p>RAM: one winner <em>per instance</em> — two bookings for one room (the list shows one, because each instance only sees its own). PostgreSQL: the EXCLUDE constraint lets exactly one INSERT through; the 49 others get the Chapter 2 <code>409 BOOKING_CONFLICT</code> with <code>conflictWith</code>, which the store finds after catching <code>23P01</code>.</p>
<p>The quieter rule is “a student holds at most three active bookings”. Counting then inserting is a race even inside one database. We ran An's ten simultaneous requests three times without the <code>FOR UPDATE</code> line (<code>LABFLOW_NO_USER_LOCK=1</code>, a learning switch) and three times with it:</p>
<div class="out">nolock #1: An bấm 10 lượt (10 khung giờ khác nhau) cùng lúc: 201×8  422×2  — luật: tối đa 3 lượt còn hiệu lực
lock #1: An bấm 10 lượt (10 khung giờ khác nhau) cùng lúc: 201×3  422×7  — luật: tối đa 3 lượt còn hiệu lực</div>
<p>Three runs each (first runs shown): without the lock 8, 6 and 5 bookings got through; with it, 3, 3 and 3. Without the lock each transaction counted before any of the others committed. Locking <em>the user's row</em> makes one student's requests queue, while other students are not blocked at all — a lock as narrow as the rule.</p>

<h3>Database errors become HTTP errors</h3>
<table>
<tr><th>From PostgreSQL</th><th>Means</th><th>LabFlow answers</th></tr>
<tr><td><code>23P01</code> exclusion_violation</td><td>overlapping active booking</td><td>409 BOOKING_CONFLICT + conflictWith</td></tr>
<tr><td><code>23505</code> unique_violation</td><td>serial number taken (a race past the route's check)</td><td>409 DUPLICATE_SERIAL</td></tr>
<tr><td><code>ECONNREFUSED</code>, <code>57P01</code>, pool timeout</td><td>database unreachable or restarting</td><td>503 DEPENDENCY_DOWN, Retry-After 5</td></tr>
<tr><td><code>57014</code> statement timeout</td><td>a query ran over 5 s</td><td>503, Retry-After 1</td></tr>
<tr><td>anything else</td><td>a bug</td><td>500 — details only in the log (12.7)</td></tr>
</table>
<p>One function, <code>asHttp(e)</code> in <code>src/pg.js</code>, does this mapping; nothing else in the code knows SQLSTATE codes.</p>

<h3>Pages come straight from an index</h3>
<p>The cursor from Chapter 3 becomes a keyset condition, <code>(created_at, seq) &lt; ($1, $2)</code>, and the 12.1 index serves it without sorting. On 10,000 seeded bookings, “my bookings” for An:</p>
<pre><code class="language-bash">psql "$DATABASE_URL" -c "EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY ON) SELECT * FROM bookings WHERE user_id = 'usr_1' ORDER BY created_at DESC, seq DESC LIMIT 21"</code></pre>
<div class="out">                                     QUERY PLAN                                      
-------------------------------------------------------------------------------------
 Limit (actual rows=21.00 loops=1)
   Buffers: shared hit=4
   -&gt;  Index Scan using bookings_user_newest on bookings (actual rows=21.00 loops=1)
         Index Cond: (user_id = 'usr_1'::text)
         Index Searches: 1
         Buffers: shared hit=4
 Planning:
   Buffers: shared hit=220
 Planning Time: 0.443 ms
 Execution Time: 0.028 ms
(10 rows)</div>
<p>21 rows read from the index, 0.028 ms. <code>Server-Timing</code> shows the same list through the API (three calls for Lan, three for An):</p>
<pre><code class="language-bash">for t in lan an; do for i in 1 2 3; do curl -s -o /dev/null -D - 'http://localhost:4200/v2/bookings?limit=20' -H "Authorization: Bearer $(cat $t.jwt)" | grep -i '^server-timing' | tr -d '\\r' | sed "s/^/$t: /"; done; done</code></pre>
<div class="out">lan: Server-Timing: auth;dur=0.14, user;dur=0.68, validate;dur=1.15, db;dur=1.46, total;dur=5.24
lan: Server-Timing: auth;dur=0.07, user;dur=0.64, validate;dur=0.07, db;dur=0.57, total;dur=2.20
lan: Server-Timing: auth;dur=0.10, user;dur=0.54, validate;dur=0.14, db;dur=0.48, total;dur=2.03
an: Server-Timing: auth;dur=0.07, user;dur=0.77, validate;dur=0.09, db;dur=0.71, total;dur=2.48
an: Server-Timing: auth;dur=0.07, user;dur=0.56, validate;dur=0.07, db;dur=0.50, total;dur=1.83
an: Server-Timing: auth;dur=0.06, user;dur=0.42, validate;dur=0.07, db;dur=0.49, total;dur=1.64</div>
<p>The query (<code>db</code>) takes 0.48–1.46 ms; the RAM store, filtering and sorting 10,000 objects in JavaScript, measured 0.70–8.67 ms the same way (first call cold) — an index beats an array scan even across a network hop. What got slower is <code>user</code>: looking the caller up by primary key on every request (0.42–0.77 ms, against 0.03–0.22 ms in RAM). That buys a real guarantee — a deleted or demoted user is refused immediately, not when the token expires.</p>
<div class="pitfall"><p><strong>Trap — <code>SELECT *</code> then sort in JavaScript.</strong> It “works” on 100 rows and collapses on 100,000. Push filters, order and <code>LIMIT</code> into SQL and check the plan with <code>EXPLAIN</code> — 3.2 showed OFFSET 900,000 at 78 ms.</p></div>

<h3>In interviews / at work</h3>
<ul>
  <li><strong>“How did you size the pool?”</strong> From <code>max_connections</code>: 100 − 3 reserved, divided among instances, worker and tools; a 2-second wait timeout so an empty pool fails fast as 503.</li>
  <li><strong>“Fifty people book the same slot?”</strong> Exactly one 201 — measured through two instances — because an exclusion constraint, not the code, decides.</li>
  <li><strong>“Where does FOR UPDATE go?”</strong> On the narrowest row the rule is about: here the student's row, so one student's requests queue and nobody else waits.</li>
</ul>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok"><ol>
  <li>Run <code>npm test</code> and <code>npm run test:pg</code>; then, on <code>labflow_test</code> only, run <code>ALTER TABLE bookings DROP CONSTRAINT bookings_no_overlap</code> and rerun the tests without the reset step (<code>LABFLOW_STORE=pg LABFLOW_REDIS= node --test</code>) — watch which test turns red.</li>
  <li>Start the stack with <code>PG_POOL_MAX=2 PG_POOL_WAIT_MS=200</code> and hit <code>GET /v2/bookings</code> with <code>npx autocannon -c 50 -d 5</code>; count the 503s and read one response's <code>Retry-After</code>.</li>
  <li>Run <code>node perf/race-api.mjs quota 10</code> with and without <code>LABFLOW_NO_USER_LOCK=1</code> (reset the database between runs).</li>
</ol>
<p><strong>Done when:</strong> both test commands are green on a clean checkout, you have a 503 with <code>Retry-After</code> from a starved pool, and the locked run never lets more than three through.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Store / repository</span><span class="v">The layer that hides where data lives; routes call its functions, not SQL.</span></div>
  <div class="kv"><span class="k">Connection pool</span><span class="v">A fixed set of open database connections lent to requests; a queue when all are busy.</span></div>
  <div class="kv"><span class="k">max_connections</span><span class="v">The server's limit on simultaneous connections; all pools together must fit under it.</span></div>
  <div class="kv"><span class="k">Transaction</span><span class="v">Statements that commit together or roll back together.</span></div>
  <div class="kv"><span class="k">SELECT … FOR UPDATE</span><span class="v">Locks the rows read until commit; others touching them wait.</span></div>
  <div class="kv"><span class="k">SQLSTATE</span><span class="v">PostgreSQL's five-character error code (23P01, 23505, 57014…), mapped once to HTTP.</span></div>
  <div class="kv"><span class="k">Statement timeout</span><span class="v">A per-query time limit enforced by the database itself.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Routes call a store; <code>LABFLOW_STORE</code> picks RAM or PostgreSQL, and the same 18 tests run against both (17 + 1 skipped / 18 green).</li>
  <li>One pool per instance (was seven): max 10, a 2 s wait timeout ⇒ 503 + Retry-After instead of hanging; size it from <code>max_connections</code>.</li>
  <li>50 simultaneous bookings through two instances: RAM 2 winners, PostgreSQL exactly 1 (EXCLUDE); 49 get 409 with <code>conflictWith</code>.</li>
  <li>“Max three active bookings”: 5–8 slipped through without a row lock, 3 every time with <code>FOR UPDATE</code> on the user's row.</li>
  <li>Keyset pages read 21 index rows in 0.028 ms; the list's db time dropped below the RAM version; the per-request user lookup is the price of instant revocation.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/postgresql/learn?lessonSlug=postgresql-14-1-gia-ket-noi" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">PostgreSQL course — 14.1: What a connection costs</span><span class="lc-sub">Same: max_connections is a budget and every pool spends from it. There: one process per connection, 6.8 ms to open vs 0.4 ms to reuse, the server refusing client 101 — then 14.2 puts PgBouncer in front.</span></span>
  <span class="lc-cta">OPEN LESSON →</span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.3</span>
<h2>Dựng trên PostgreSQL: một pool, transaction, và luật do CSDL giữ</h2>
<p class="lead">Lược đồ đã có; giờ mọi route phải dùng nó. Bài này chuyển các route của LabFlow sang một giao diện store, cho mỗi instance một pool kết nối có kích thước tính toán, viết lượt đặt thành một transaction, và lặp lại cuộc đua của bài 11.6 — năm mươi người, một khung giờ — qua API thật trên hai instance.</p>
<p><strong>Học xong bạn làm được:</strong> đặt một CSDL sau một API có sẵn mà không đổi hợp đồng, tính kích thước pool từ <code>max_connections</code>, đổi lỗi CSDL thành đúng mã HTTP, và chứng minh bằng script đua rằng một luật đứng vững qua nhiều instance. <strong>Vì sao quan trọng:</strong> “bọn em chuyển từ bộ nhớ sang PostgreSQL và test vẫn xanh” là câu làm dự án cuối khoá đáng tin.</p>

<h3>Một giao diện, hai kho</h3>
<p>Route thôi đụng vào mảng. Chúng gọi <code>store.getBooking()</code>, <code>store.createBooking()</code>… và <code>src/store/index.js</code> chọn bản cài đặt một lần, lúc khởi động:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">route</span><span class="lz-t">kiểm dữ liệu + quyền</span><span class="lz-d">chỉ việc HTTP: 400, 401, 404, view</span></div>
  <div class="lz-step"><span class="lz-k">store</span><span class="lz-t">cùng 39 hàm async</span><span class="lz-d">getBooking, createBooking, listBookings…</span></div>
  <div class="lz-step"><span class="lz-k">memory.js</span><span class="lz-t">mảng (Chương 1–11)</span><span class="lz-d">npm test, không cần CSDL</span></div>
  <div class="lz-step"><span class="lz-k">pg.js</span><span class="lz-t">SQL + transaction</span><span class="lz-d">LABFLOW_STORE=pg</span></div>
</div>
<p>Phần thưởng: <em>cùng</em> các tệp test chạy được trên cả hai. Năm test mới trong <code>test/capstone.test.mjs</code> phủ những luật chỉ có ý nghĩa khi có đồng thời thật; test outbox chỉ chạy ở nơi có outbox:</p>
<pre><code class="language-bash">DATABASE_URL=postgres://labflow@localhost:55432/labflow_test npm run -s test:pg 2&gt;&amp;1 | grep -E "^seed|^ℹ (tests|pass|fail|skipped)|12\\.[0-9]:"</code></pre>
<div class="out">seed labflow_test: users 3 · labs 4 · devices 3 · bookings 0 · issues 0 (5 ms)
✔ 12.3: 20 request cùng đặt MỘT khung giờ ⇒ đúng 1 lượt 201, 19 lượt 409 kèm conflictWith (69.824833ms)
✔ 12.3: một sinh viên bấm 6 lượt song song ⇒ chỉ 3 lượt được (TOO_MANY_ACTIVE_BOOKINGS) (12.659875ms)
✔ 12.4: hai quản lý cùng sửa MỘT thiết bị với cùng If-Match ⇒ một 200, một 412 (5.779667ms)
✔ 12.3: phân trang con trỏ qua 30 lượt tạo liên tiếp — không trùng, không sót (86.538084ms)
✔ 12.5: lượt đặt bị 409 KHÔNG để lại sự kiện; lượt 201 có đúng một sự kiện (outbox cùng transaction) (5.255666ms)
ℹ tests 18
ℹ pass 18
ℹ fail 0
ℹ skipped 0</div>
<p><code>npm test</code> trên kho RAM cho 17 đạt và 1 bỏ qua (test outbox). <code>npm run test:pg</code> dựng lại <code>labflow_test</code> từ migration trước — và từ chối xoá mọi CSDL có tên không kết thúc bằng <code>_test</code>.</p>

<h3>Mỗi instance một pool, kích thước có tính toán</h3>
<p>Mở một kết nối PostgreSQL tốn một tiến trình bên máy chủ và vài mili giây bắt tay, nên ứng dụng giữ một <strong>pool</strong> (bể) kết nối mở sẵn rồi cho mượn. Mã Chương 11 đã mọc ra bảy pool riêng:</p>
<pre><code class="language-bash">grep -rn "new pg.Pool" src | sed -E 's/connectionString: [^,]+, //' | cut -c1-110</code></pre>
<div class="out">src/worker.js:52:  const db = new pg.Pool({ max: 3 });
src/idempotency-pg.js:7:const pool = new pg.Pool({ max: 5 });
src/exportTask.js:6:export const pool = new pg.Pool({ max: 5 });
src/routes/notes.js:11:const primary = new pg.Pool({ max: 5 });
src/routes/notes.js:12:const replica = new pg.Pool({ max: 5 });
src/routes/webhooks.js:12:export const pool = new pg.Pool({ max: 3 });
src/routes/stats.js:7:const pool = new pg.Pool({ max: 10 });</div>
<p>Giờ chỉ còn một, ở <code>src/pg.js</code>, mọi module mượn từ đó (hai pool còn lại ở <code>notes.js</code>/<code>stats.js</code> là bài replica của Chương 9, chỉ nạp khi có <code>LABFLOW_PG=1</code>):</p>
<pre><code class="language-javascript">export const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  max: config.poolMax,                       // 10 mỗi instance; số instance × max phải lọt max_connections
  connectionTimeoutMillis: config.poolWaitMs, // 2 s: pool cạn ⇒ BÁO LỖI thay vì chờ mãi (mặc định của pg là 0 = chờ mãi)
  statement_timeout: 5000,                    // câu lệnh chạy &gt; 5 s bị chính PostgreSQL huỷ
  application_name: 'labflow-api-A',          // thấy được trong pg_stat_activity
});
pool.on('error', (e) =&gt; console.error('pg pool:', e.message));   // một kết nối rảnh bị đứt không được làm chết tiến trình</code></pre>
<p>Pool là một hàng đợi. Hai mươi truy vấn 100 ms trên hai kết nối cần trọn một giây — ai chờ quá thời hạn thì nhận lỗi:</p>
<pre><code class="language-bash">MAX=2 WAIT=0 node perf/pool.mjs</code></pre>
<div class="out">max=2 chờ tối đa ∞ ms · 20 truy vấn 100 ms: xong 20 (nhanh nhất 103 ms, chậm nhất 1028 ms) · lỗi 0 · tổng 1028 ms</div>
<pre><code class="language-bash">MAX=2 WAIT=500 node perf/pool.mjs</code></pre>
<div class="out">max=2 chờ tối đa 500 ms · 20 truy vấn 100 ms: xong 10 (nhanh nhất 104 ms, chậm nhất 517 ms) · lỗi 10 sau ~502 ms: "timeout exceeded when trying to connect" · tổng 517 ms</div>
<pre><code class="language-bash">MAX=10 WAIT=500 node perf/pool.mjs</code></pre>
<div class="out">max=10 chờ tối đa 500 ms · 20 truy vấn 100 ms: xong 20 (nhanh nhất 103 ms, chậm nhất 207 ms) · lỗi 0 · tổng 207 ms</div>
<p>Không có thời hạn, mười request treo 0,5–1 s; có 500 ms thì chúng hỏng nhanh, và LabFlow đổi lỗi đó thành <code>503 DEPENDENCY_DOWN</code> + <code>Retry-After</code> (8.4) — client thử lại được; request treo thì chỉ giữ chiếm socket. Pool được phép lớn tới đâu? Hỏi máy chủ:</p>
<pre><code class="language-bash">psql postgres://labflow@localhost:55432/labflow_app -Atc "SHOW max_connections" -c "SHOW superuser_reserved_connections"</code></pre>
<div class="out">100
3</div>
<p>100 chỗ trừ 3 cho superuser: hai instance API × 10 + worker 10 + kết nối nghe của relay + một bộ chạy migration = 32. Tám instance sẽ cần 82 — sát trần, đó là lúc đặt PgBouncer phía trước (<a href="/courses/postgresql/learn?lessonSlug=postgresql-14-2-pool-pgbouncer">PostgreSQL 14.2</a>). Bức tranh thật lúc cả bộ đang chạy:</p>
<pre><code class="language-bash">psql "$DATABASE_URL" -c "SELECT application_name, state, count(*) FROM pg_stat_activity WHERE datname = current_database() AND backend_type = 'client backend' GROUP BY 1, 2 ORDER BY 1, 2"</code></pre>
<div class="out"> application_name | state  | count 
------------------+--------+-------
 labflow-api-A    | idle   |     2
 labflow-api-B    | idle   |     3
 labflow-relay    | idle   |     1
 labflow-worker   | idle   |     1
 psql             | active |     1
(5 rows)</div>
<a class="link-card" href="https://node-postgres.com/apis/pool" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: node-postgres — pg.Pool (đọc ngày 01/11/2026)</span><span class="lc-sub">max mặc định 10; connectionTimeoutMillis “mặc định là 0, nghĩa là không có thời hạn”; “kết nối đang rảnh trong pool vẫn có thể phát lỗi” — phải nghe sự kiện 'error'.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Một lượt đặt là một transaction</h3>
<p><code>createBooking</code> của kho pg làm ba lần đọc và hai lần ghi phải cùng thành hoặc cùng hỏng:</p>
<pre><code class="language-javascript">b = await tx(async (c) =&gt; {                                   // BEGIN … COMMIT, lỗi bất kỳ ⇒ ROLLBACK
  if (!(await c.query('SELECT 1 FROM labs WHERE id = $1 AND retired_at IS NULL', [labId])).rowCount)
    throw new HttpError(422, 'UNKNOWN_LAB', { id: labId });
  if (role === 'STUDENT') {
    await c.query('SELECT 1 FROM users WHERE id = $1 FOR UPDATE', [userId]);   // request của người này xếp hàng ở đây
    const n = …đếm lượt còn hiệu lực của userId…;
    if (n &gt;= 3) throw new HttpError(422, 'TOO_MANY_ACTIVE_BOOKINGS', { max: 3 });
  }
  const row = …INSERT INTO bookings … RETURNING *…;           // EXCLUDE có thể từ chối ⇒ 23P01
  await outbox(c, 'created', row);                             // sự kiện, cùng transaction (12.5)
  return row;
});</code></pre>
<p>Năm mươi quản lý cùng bấm “Đặt” cho cùng phòng, cùng khung giờ, qua proxy, nên mỗi instance nhận chừng một nửa. Trước là kho RAM, sau là PostgreSQL:</p>
<pre><code class="language-bash">node perf/race-api.mjs slot 50</code></pre>
<div class="out">50 request cùng đặt lab_1 2027-06-01 07:00–09:00: 201@A×1  201@B×1  409@A×24  409@B×24
GET /v2/bookings khung giờ đó (qua proxy): 1 lượt PENDING</div>
<pre><code class="language-bash">node perf/race-api.mjs slot 50</code></pre>
<div class="out">50 request cùng đặt lab_1 2027-06-01 07:00–09:00: 409@B×25  409@A×24  201@A×1
GET /v2/bookings khung giờ đó (qua proxy): 1 lượt PENDING</div>
<p>RAM: mỗi <em>instance</em> một người thắng — hai lượt đặt cho một phòng (danh sách chỉ hiện một, vì mỗi instance chỉ thấy phần của mình). PostgreSQL: ràng buộc EXCLUDE cho đúng một câu INSERT đi qua; 49 người còn lại nhận <code>409 BOOKING_CONFLICT</code> của Chương 2 kèm <code>conflictWith</code>, store tìm ra nó sau khi bắt lỗi <code>23P01</code>.</p>
<p>Luật lặng lẽ hơn là “một sinh viên giữ tối đa ba lượt còn hiệu lực”. Đếm rồi chèn là một cuộc đua kể cả trong một CSDL. Mười request cùng lúc của An được chạy ba lần khi bỏ dòng <code>FOR UPDATE</code> (<code>LABFLOW_NO_USER_LOCK=1</code>, công tắc chỉ để học) và ba lần khi có nó:</p>
<div class="out">nolock #1: An bấm 10 lượt (10 khung giờ khác nhau) cùng lúc: 201×8  422×2  — luật: tối đa 3 lượt còn hiệu lực
lock #1: An bấm 10 lượt (10 khung giờ khác nhau) cùng lúc: 201×3  422×7  — luật: tối đa 3 lượt còn hiệu lực</div>
<p>Ba lần mỗi kiểu (in lần đầu): không khoá thì lọt 8, 6 rồi 5 lượt; có khoá thì 3, 3 và 3. Không khoá, mỗi transaction đếm xong trước khi những cái khác kịp commit. Khoá <em>dòng của người dùng</em> làm request của một sinh viên xếp hàng, còn sinh viên khác không bị chặn chút nào — khoá hẹp đúng bằng luật.</p>

<h3>Lỗi CSDL thành lỗi HTTP</h3>
<table>
<tr><th>Từ PostgreSQL</th><th>Nghĩa là</th><th>LabFlow trả</th></tr>
<tr><td><code>23P01</code> exclusion_violation</td><td>lượt còn hiệu lực chồng giờ</td><td>409 BOOKING_CONFLICT + conflictWith</td></tr>
<tr><td><code>23505</code> unique_violation</td><td>số serial đã có (đua lọt qua phần kiểm của route)</td><td>409 DUPLICATE_SERIAL</td></tr>
<tr><td><code>ECONNREFUSED</code>, <code>57P01</code>, hết thời hạn mượn pool</td><td>CSDL không tới được hoặc đang khởi động lại</td><td>503 DEPENDENCY_DOWN, Retry-After 5</td></tr>
<tr><td><code>57014</code> statement timeout</td><td>câu lệnh chạy quá 5 s</td><td>503, Retry-After 1</td></tr>
<tr><td>còn lại</td><td>một con bug</td><td>500 — chi tiết chỉ nằm trong log (12.7)</td></tr>
</table>
<p>Một hàm duy nhất, <code>asHttp(e)</code> trong <code>src/pg.js</code>, làm việc ánh xạ này; không chỗ nào khác trong mã biết tới mã SQLSTATE.</p>

<h3>Trang lấy thẳng từ index</h3>
<p>Con trỏ của Chương 3 thành điều kiện keyset <code>(created_at, seq) &lt; ($1, $2)</code>, và index của bài 12.1 phục vụ nó mà không phải sắp xếp. Trên 10.000 lượt đặt mẫu, “lượt của tôi” với An:</p>
<pre><code class="language-bash">psql "$DATABASE_URL" -c "EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY ON) SELECT * FROM bookings WHERE user_id = 'usr_1' ORDER BY created_at DESC, seq DESC LIMIT 21"</code></pre>
<div class="out">                                     QUERY PLAN                                      
-------------------------------------------------------------------------------------
 Limit (actual rows=21.00 loops=1)
   Buffers: shared hit=4
   -&gt;  Index Scan using bookings_user_newest on bookings (actual rows=21.00 loops=1)
         Index Cond: (user_id = 'usr_1'::text)
         Index Searches: 1
         Buffers: shared hit=4
 Planning:
   Buffers: shared hit=220
 Planning Time: 0.443 ms
 Execution Time: 0.028 ms
(10 rows)</div>
<p>21 dòng đọc từ index, 0,028 ms. <code>Server-Timing</code> cho thấy cùng danh sách qua API (ba lần gọi cho Lan, ba cho An):</p>
<pre><code class="language-bash">for t in lan an; do for i in 1 2 3; do curl -s -o /dev/null -D - 'http://localhost:4200/v2/bookings?limit=20' -H "Authorization: Bearer $(cat $t.jwt)" | grep -i '^server-timing' | tr -d '\\r' | sed "s/^/$t: /"; done; done</code></pre>
<div class="out">lan: Server-Timing: auth;dur=0.14, user;dur=0.68, validate;dur=1.15, db;dur=1.46, total;dur=5.24
lan: Server-Timing: auth;dur=0.07, user;dur=0.64, validate;dur=0.07, db;dur=0.57, total;dur=2.20
lan: Server-Timing: auth;dur=0.10, user;dur=0.54, validate;dur=0.14, db;dur=0.48, total;dur=2.03
an: Server-Timing: auth;dur=0.07, user;dur=0.77, validate;dur=0.09, db;dur=0.71, total;dur=2.48
an: Server-Timing: auth;dur=0.07, user;dur=0.56, validate;dur=0.07, db;dur=0.50, total;dur=1.83
an: Server-Timing: auth;dur=0.06, user;dur=0.42, validate;dur=0.07, db;dur=0.49, total;dur=1.64</div>
<p>Truy vấn (<code>db</code>) mất 0,48–1,46 ms; kho RAM, lọc và sắp 10.000 object trong JavaScript, đo cùng cách được 0,70–8,67 ms (lần gọi đầu còn nguội) — index thắng quét mảng dù phải đi qua mạng. Thứ chậm đi là <code>user</code>: mỗi request tra người gọi theo khoá chính (0,42–0,77 ms, so với 0,03–0,22 ms trong RAM). Đổi lại một bảo đảm thật — người dùng bị xoá hay bị hạ quyền bị từ chối ngay, không phải đợi token hết hạn.</p>
<div class="pitfall"><p><strong>Bẫy — <code>SELECT *</code> rồi sắp trong JavaScript.</strong> Nó “chạy” với 100 dòng và sập với 100.000. Đẩy lọc, thứ tự và <code>LIMIT</code> vào SQL rồi xem kế hoạch bằng <code>EXPLAIN</code> — bài 3.2 đã cho thấy OFFSET 900.000 mất 78 ms.</p></div>

<h3>Khi phỏng vấn / đi làm</h3>
<ul>
  <li><strong>“Em tính kích thước pool thế nào?”</strong> Từ <code>max_connections</code>: 100 − 3 chỗ dành riêng, chia cho các instance, worker và công cụ; thời hạn chờ 2 giây để pool cạn thì hỏng nhanh thành 503.</li>
  <li><strong>“Năm mươi người đặt cùng một khung giờ?”</strong> Đúng một 201 — đo qua hai instance — vì ràng buộc loại trừ, không phải code, là bên quyết định.</li>
  <li><strong>“FOR UPDATE đặt ở đâu?”</strong> Trên dòng hẹp nhất mà luật nói tới: ở đây là dòng của sinh viên, nên request của một sinh viên xếp hàng còn không ai khác phải chờ.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
  <li>Chạy <code>npm test</code> và <code>npm run test:pg</code>; rồi, CHỈ trên <code>labflow_test</code>, chạy <code>ALTER TABLE bookings DROP CONSTRAINT bookings_no_overlap</code> và chạy lại test mà không có bước dựng lại (<code>LABFLOW_STORE=pg LABFLOW_REDIS= node --test</code>) — xem test nào đỏ.</li>
  <li>Chạy cả bộ với <code>PG_POOL_MAX=2 PG_POOL_WAIT_MS=200</code> và bắn <code>GET /v2/bookings</code> bằng <code>npx autocannon -c 50 -d 5</code>; đếm số 503 và đọc <code>Retry-After</code> của một câu trả lời.</li>
  <li>Chạy <code>node perf/race-api.mjs quota 10</code> có và không có <code>LABFLOW_NO_USER_LOCK=1</code> (dựng lại CSDL giữa hai lần).</li>
</ol>
<p><strong>Đạt khi:</strong> hai lệnh test xanh trên bản checkout sạch, bạn có một 503 kèm <code>Retry-After</code> từ pool bị bỏ đói, và lần chạy có khoá không bao giờ cho quá ba lượt.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Store / repository (kho dữ liệu)</span><span class="v">Lớp che chỗ dữ liệu nằm; route gọi hàm của nó, không viết SQL.</span></div>
  <div class="kv"><span class="k">Connection pool (bể kết nối)</span><span class="v">Một nhóm kết nối CSDL mở sẵn cho request mượn; hết thì thành hàng đợi.</span></div>
  <div class="kv"><span class="k">max_connections (số kết nối tối đa)</span><span class="v">Giới hạn kết nối đồng thời của máy chủ; mọi pool cộng lại phải nằm dưới nó.</span></div>
  <div class="kv"><span class="k">Transaction (giao dịch)</span><span class="v">Các câu lệnh cùng commit hoặc cùng rollback.</span></div>
  <div class="kv"><span class="k">SELECT … FOR UPDATE (khoá dòng)</span><span class="v">Khoá các dòng đã đọc tới khi commit; ai đụng vào phải chờ.</span></div>
  <div class="kv"><span class="k">SQLSTATE (mã lỗi SQL)</span><span class="v">Mã lỗi năm ký tự của PostgreSQL (23P01, 23505, 57014…), ánh xạ sang HTTP một lần.</span></div>
  <div class="kv"><span class="k">Statement timeout (giới hạn thời gian câu lệnh)</span><span class="v">Thời hạn cho từng truy vấn, do chính CSDL thi hành.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Route gọi store; <code>LABFLOW_STORE</code> chọn RAM hay PostgreSQL, và cùng 18 test chạy trên cả hai (17 + 1 bỏ qua / 18 xanh).</li>
  <li>Mỗi instance một pool (trước có bảy): tối đa 10, chờ quá 2 s ⇒ 503 + Retry-After thay vì treo; tính kích thước từ <code>max_connections</code>.</li>
  <li>50 lượt đặt cùng lúc qua hai instance: RAM 2 người thắng, PostgreSQL đúng 1 (EXCLUDE); 49 người nhận 409 kèm <code>conflictWith</code>.</li>
  <li>“Tối đa ba lượt còn hiệu lực”: không khoá dòng thì lọt 5–8, khoá <code>FOR UPDATE</code> dòng người dùng thì luôn đúng 3.</li>
  <li>Trang keyset đọc 21 dòng index trong 0,028 ms; thời gian db của danh sách thấp hơn bản RAM; tra người dùng mỗi request là cái giá của việc thu hồi quyền tức thì.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/postgresql/learn?lessonSlug=postgresql-14-1-gia-ket-noi" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Khoá PostgreSQL — 14.1: Một kết nối tốn những gì</span><span class="lc-sub">Giống: max_connections là ngân sách, pool nào cũng tiêu vào đó. Ở đó: mỗi kết nối một tiến trình, mở mới 6,8 ms so với tái dùng 0,4 ms, máy chủ từ chối client thứ 101 — rồi bài 14.2 đặt PgBouncer đứng trước.</span></span>
  <span class="lc-cta">MỞ BÀI →</span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 12.4 ─────────────────────────── */
    {
      title: '12.4 — Two instances, one truth: rate limits, idempotency, ETags and tickets shared|||12.4 — Hai instance, một sự thật: dùng chung rate limit, idempotency, ETag và vé',
      slug: 'api-12-5-chia-se',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Xô token Lua nguyên tử trên Redis (5 × 201 rồi 429 qua A và B), khoá idempotency ghi trước câu trả lời, ETag từ SEQUENCE dùng chung, khoá lạc quan trong câu UPDATE (mất bản sửa 11/20 ⇒ 0/20), Redis sập: cái gì mở cửa, cái gì 503.',
      content: `${G124}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.4</span>
<h2>Two instances, one truth: rate limits, idempotency, ETags and tickets shared</h2>
<p class="lead">Data in PostgreSQL fixed the loudest bugs of 12.1. Four quieter ones remain, because they were never “data”: rate-limit buckets, idempotency keys, list versions for ETags, realtime tickets. This lesson moves each to a shared place, adds one-statement optimistic locking, and then switches Redis off to see what still works.</p>
<p><strong>What you can do after it:</strong> run a stateless API on N instances, implement a shared token bucket with one atomic Lua script, make retries and ETags correct across instances, and decide what an API does when its cache store dies. <strong>Why it matters:</strong> “stateless” is the first word interviewers expect when you say “two servers” — this lesson shows what it costs to make that true.</p>

<h3>The 12.1 probes, again</h3>
<p>Same commands, same proxy, same two instances — now with <code>LABFLOW_STORE=pg</code> and Redis:</p>
<pre><code class="language-bash">for i in 1 2; do curl -s -o /dev/null -w '%{http_code} instance=%header{labflow-instance} %header{location}\\n' http://localhost:8180/v2/bookings -H "Authorization: Bearer $(cat lan.jwt)" --json '{"labId":"lab_3","period":{"start":"2027-04-07T08:00:00+07:00","end":"2027-04-07T10:00:00+07:00"}}'; done</code></pre>
<div class="out">201 instance=A /v2/bookings/bk_3
409 instance=B </div>
<pre><code class="language-bash">curl -s -D - -o /dev/null 'http://localhost:4200/v2/bookings?labId=lab_3' \\
  -H "Authorization: Bearer $(cat lan.jwt)" | grep -i '^etag' | tr \\
  -d '\\r' | tee etag.txt</code></pre>
<div class="out">ETag: "bookings-v3-JMolGI-8rCeg27eS"</div>
<pre><code class="language-bash">curl -s -o /dev/null -w 'đặt ở B: %{http_code} %header{location}\\n' http://localhost:4201/v2/bookings \\
  -H "Authorization: Bearer $(cat lan.jwt)" \\
  --json '{"labId":"lab_3","period":{"start":"2027-04-08T08:00:00+07:00","end":"2027-04-08T10:00:00+07:00"}}'</code></pre>
<div class="out">đặt ở B: 201 /v2/bookings/bk_5</div>
<pre><code class="language-bash">curl -s -o /dev/null -w 'hỏi lại A: %{http_code}\\n' 'http://localhost:4200/v2/bookings?labId=lab_3' \\
  -H "Authorization: Bearer $(cat lan.jwt)" \\
  -H "If-None-Match: $(cut -d' ' -f2 etag.txt)"</code></pre>
<div class="out">hỏi lại A: 200</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4200/v2/realtime/tickets \\
  -H "Authorization: Bearer $(cat lan.jwt)" | jq -r .ticket &gt; tkt.txt; echo "vé từ A: $(cut -c1-10 tkt.txt)…"</code></pre>
<div class="out">vé từ A: tkt_vhmifo…</div>
<pre><code class="language-bash">curl -s -o /dev/null -w 'SSE ở B: %{http_code}\\n' --max-time 2 "http://localhost:4201/v2/events/stream?ticket=$(cat tkt.txt)"</code></pre>
<div class="out">SSE ở B: 200</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4200/v2/me/api-keys \\
  -H "Authorization: Bearer $(cat lan.jwt)" | jq -r .key &gt; key.txt; echo "khoá tạo ở A: $(cut -c1-12 key.txt)…"</code></pre>
<div class="out">khoá tạo ở A: lf_live_Dqad…</div>
<pre><code class="language-bash">for p in 4200 4201; do curl -s -o /dev/null -w ":$p GET /v2/me bằng khoá: %{http_code}\\n" http://localhost:$p/v2/me -H "Authorization: Bearer $(cat key.txt)"; done</code></pre>
<div class="out">:4200 GET /v2/me bằng khoá: 200
:4201 GET /v2/me bằng khoá: 200</div>
<p>Restarting A no longer loses anything: the restart probe now prints 200 where 12.1 printed 404. The second request for the slot gets 409 (and burns <code>bk_4</code> — the next booking is <code>bk_5</code>); A no longer answers 304 after B wrote; B accepts A's ticket and A's API key. Now each mechanism, and what it is made of.</p>

<h3>A shared token bucket: one Lua script</h3>
<p>Chapter 5's bucket lived in a <code>Map</code>, so two instances gave everyone twice the limit (8.3: 8 of 8 bookings passed a limit of 5). Moving the numbers to Redis is not enough: “read tokens, compute, write back” from two instances is the same race as counting bookings. Redis runs a Lua script <strong>atomically</strong> — nothing else executes while it runs — so the whole read-compute-write is one step:</p>
<pre><code class="language-lua">local cap, rate = tonumber(ARGV[1]), tonumber(ARGV[2])
local t = redis.call('TIME')                            -- Redis's clock, not each server's
local nowS = tonumber(t[1]) + tonumber(t[2]) / 1000000
local b = redis.call('HMGET', KEYS[1], 'tokens', 'at')
local tokens = math.min(cap, (tonumber(b[1]) or cap) + (nowS - (tonumber(b[2]) or nowS)) * rate)
local ok = 0
if tokens &gt;= 1 then tokens = tokens - 1; ok = 1 end
redis.call('HSET', KEYS[1], 'tokens', tostring(tokens), 'at', tostring(nowS))
redis.call('EXPIRE', KEYS[1], math.ceil(cap / rate) + 1)   -- an idle bucket disappears by itself
return {ok, tostring(tokens)}</code></pre>
<p>The clock comes from Redis (<code>TIME</code>), so two app servers whose clocks disagree by a second still refill the bucket correctly. Eight bookings by Lan through the proxy:</p>
<pre><code class="language-bash">for d in 10 11 12 13 14 15 16 17; do curl -s -o /dev/null -w "%{http_code} instance=%header{labflow-instance} ratelimit=%header{ratelimit}\\n" http://localhost:8180/v2/bookings -H "Authorization: Bearer $(cat lan.jwt)" --json "{\\"labId\\":\\"lab_2\\",\\"period\\":{\\"start\\":\\"2027-04-\${d}T08:00:00+07:00\\",\\"end\\":\\"2027-04-\${d}T10:00:00+07:00\\"}}"; done</code></pre>
<div class="out">201 instance=B ratelimit="booking";r=4;t=12
201 instance=A ratelimit="booking";r=3;t=24
201 instance=B ratelimit="booking";r=2;t=36
201 instance=A ratelimit="booking";r=1;t=48
201 instance=B ratelimit="booking";r=0;t=60
429 instance=A ratelimit="booking";r=0;t=12
429 instance=B ratelimit="booking";r=0;t=12
429 instance=A ratelimit="booking";r=0;t=12</div>
<pre><code class="language-bash">redis-cli -p 6390 --scan --pattern 'labflow:rl:*'</code></pre>
<div class="out">labflow:rl:booking:usr_3
labflow:rl:login:::ffff:127.0.0.1|lan@labflow.example</div>
<p>Five pass, alternating A and B, and the <code>RateLimit</code> header counts down 4, 3, 2, 1, 0 across both — one bucket, <code>labflow:rl:booking:usr_3</code>.</p>
<a class="link-card" href="https://redis.io/docs/latest/develop/programmability/eval-intro/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: Redis — Scripting with Lua (read 1 Nov 2026)</span><span class="lc-sub">“Redis guarantees the script's atomic execution. While executing the script, all server activities are blocked during its entire runtime.” Keys a script touches must be passed as KEYS.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>Idempotency keys every instance sees</h3>
<p>8.3 already moved the keys into a PostgreSQL table, where <code>INSERT … ON CONFLICT DO NOTHING</code> lets exactly one instance claim a key. One detail changed here: Chapter 5 wrote “done + the response” <em>after</em> the response had left (on the connection's <code>close</code>). A client that retries immediately — through the proxy, on the other instance — could arrive before that write and get <code>409 IDEMPOTENCY_IN_PROGRESS</code>. We saw exactly that once, in the very first smoke run of this chapter, and could not reproduce it in later runs: a window of about one millisecond. Rare is not never, so the record is now written <em>before</em> the response is sent:</p>
<pre><code class="language-javascript">res.json = (body) =&gt; {
  saved = true;
  save({ status: res.statusCode, body, location: res.get('Location') })   // UPDATE … state = 'done'
    .finally(() =&gt; json(body));                                          // only then does the client get its 201
  return res;
};</code></pre>
<pre><code class="language-bash">(npx autocannon -c 50 -d 12 -H "Authorization=Bearer tok_lan" 'http://localhost:8180/v2/bookings?limit=100' &gt; /dev/null 2&gt;&amp;1 &amp;) ; sleep 1; N=20 node perf/idem-replay.mjs</code></pre>
<div class="out">20 lần "nhận 201 rồi gửi lại ngay": phát lại đúng ×20</div>
<p>Twenty “201, then retry at once” pairs under background load: all twenty replayed the stored 201, none created a second booking.</p>

<h3>ETags from a version every instance shares</h3>
<p>The stale 304 of 12.1 came from <code>versions.bookings++</code> in one process. The fix is a PostgreSQL <code>SEQUENCE</code> (migration 003): every write calls <code>nextval('bookings_list_version')</code>, every list request reads <code>last_value</code> before computing anything. Two details matter:</p>
<ul>
  <li>A sequence takes no row lock, so fifty concurrent bookings do not queue on one “version” row.</li>
  <li><code>nextval</code> runs <strong>after</strong> COMMIT. Bump first and a reader could cache the old list under the new version — a 304 that hides a booking. Bump after, and the worst case is one extra 200.</li>
</ul>

<h3>Optimistic locking in one statement</h3>
<p>Chapter 5's <code>If-Match</code> compared ETags in JavaScript, then wrote — safe in one process, a race across two. Two managers read <code>dev_1</code>'s ETag and PATCH it at the same time through the proxy. With the check-then-write version (<code>LABFLOW_NAIVE_UPDATE=1</code>, learning switch) and then the real one:</p>
<pre><code class="language-bash">node perf/race-api.mjs etag-n 20</code></pre>
<div class="out">20 lần hai người cùng PATCH với cùng If-Match: cả hai 200 (MẤT một bản sửa) ×11 · 200 + 412 ×9</div>
<pre><code class="language-bash">node perf/race-api.mjs etag-n 20</code></pre>
<div class="out">20 lần hai người cùng PATCH với cùng If-Match: cả hai 200 (MẤT một bản sửa) ×0 · 200 + 412 ×20</div>
<p>11 of 20 trials lost an edit silently: both got 200, the second overwrote the first. The real store puts the condition into the write itself — <code>UPDATE devices SET … , version = version + 1 WHERE id = $1 AND version = $2</code> — zero rows means someone was first, and the route answers 412 with the current ETag. 20 of 20 correct.</p>

<h3>When Redis is down</h3>
<p>Redis now holds rate limits, tickets, the cache, the event stream and the queues — but not the truth. Decide per feature what happens without it, then test it:</p>
<pre><code class="language-bash">redis-cli -p 6390 shutdown nosave; sleep 1</code></pre>
<pre><code class="language-bash">for d in 20 21 22 23 24 25 26; do curl -s -o /dev/null -w "%{http_code} instance=%header{labflow-instance} ratelimit=%header{ratelimit}\\n" http://localhost:8180/v2/bookings -H "Authorization: Bearer $(cat lan.jwt)" --json "{\\"labId\\":\\"lab_2\\",\\"period\\":{\\"start\\":\\"2027-04-\${d}T08:00:00+07:00\\",\\"end\\":\\"2027-04-\${d}T10:00:00+07:00\\"}}"; done</code></pre>
<div class="out">201 instance=B ratelimit="booking";r=4;t=12
201 instance=A ratelimit="booking";r=4;t=12
201 instance=B ratelimit="booking";r=3;t=24
201 instance=A ratelimit="booking";r=3;t=24
201 instance=B ratelimit="booking";r=2;t=36
201 instance=A ratelimit="booking";r=2;t=36
201 instance=B ratelimit="booking";r=1;t=48</div>
<pre><code class="language-bash">curl -s http://localhost:4200/ready; echo</code></pre>
<div class="out">{
  "status": "ready",
  "store": "pg",
  "database": "up",
  "redis": "down"
}</div>
<pre><code class="language-bash">curl -s -o /dev/null -w 'GET /v2/labs: %{http_code} cache=%header{labflow-cache}\\n' http://localhost:8180/v2/labs</code></pre>
<div class="out">GET /v2/labs: 200 cache=BYPASS</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:8180/v2/realtime/tickets \\
  -H "Authorization: Bearer $(cat lan.jwt)" | jq -c '{status, code}'</code></pre>
<div class="out">{"status":503,"code":"DEPENDENCY_DOWN"}</div>
<pre><code class="language-bash">psql postgres://labflow@localhost:55432/labflow_app -c "SELECT count(*) AS chua_phat FROM outbox WHERE published_at IS NULL"</code></pre>
<div class="out"> chua_phat 
-----------
         7
(1 row)</div>
<table>
<tr><th>Feature</th><th>Without Redis</th><th>Why that choice</th></tr>
<tr><td>rate limit</td><td><strong>fails open</strong> to each instance's own bucket (7 × 201 above)</td><td>a limiter must not take the site down; abuse for a minute beats an outage</td></tr>
<tr><td>labs cache</td><td>BYPASS — read PostgreSQL</td><td>a cache is an accelerator, never a dependency</td></tr>
<tr><td>tickets</td><td>503 + Retry-After</td><td>cannot be honoured safely across instances — say so</td></tr>
<tr><td>/ready</td><td>still 200, <code>"redis": "down"</code></td><td>only the database makes an instance useless</td></tr>
<tr><td>events</td><td>wait in the outbox (12.5)</td><td>the booking is committed; delivery is late, not lost</td></tr>
</table>
<p>When Redis came back (empty — it was started without persistence), the worker recreated its consumer groups, the seven waiting outbox rows went out, and the worker log showed seven emails, <code>ntf_bk_1_v1</code> to <code>ntf_bk_7_v1</code>, each “đã gửi (lần 1, 300 ms)”:</p>
<pre><code class="language-bash">psql postgres://labflow@localhost:55432/labflow_app -c "SELECT count(*) FILTER (WHERE published_at IS NULL) AS chua_phat, count(*) AS tong, max(published_at - created_at) AS cho_lau_nhat FROM outbox"</code></pre>
<div class="out"> chua_phat | tong | cho_lau_nhat 
-----------+------+--------------
         0 |    7 | 00:00:02.094
(1 row)</div>
<div class="pitfall"><p><strong>Trap — a Redis client without an <code>'error'</code> listener.</strong> The first time we stopped Redis, the worker process died with <code>Unhandled 'error' event … SocketClosedUnexpectedlyError</code>: Node kills a process when an EventEmitter emits <code>'error'</code> and nobody listens. Every client in <code>src/worker.js</code> now logs errors and reconnects, and the stream loops retry instead of calling <code>process.exit</code>.</p></div>

<h3>In interviews / at work</h3>
<ul>
  <li><strong>“Is your API stateless?”</strong> The processes are: anything two requests must agree on lives in PostgreSQL (truth) or Redis (short-lived), and we tested six probes across two instances.</li>
  <li><strong>“Why Lua for the rate limiter?”</strong> Read-compute-write must be atomic across instances; a script runs atomically in Redis, and its clock is Redis's own.</li>
  <li><strong>“Your cache store dies — what then?”</strong> Decided per feature: limits fail open, cache bypasses, tickets 503, data unaffected — and measured.</li>
</ul>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok"><ol>
  <li>Through the proxy, send six bookings as An within a minute; then wait 12 s and send one more. Explain each <code>RateLimit</code> header.</li>
  <li>Run <code>node perf/race-api.mjs etag-n 20</code> with <code>LABFLOW_NAIVE_UPDATE=1</code> and without; record lost updates.</li>
  <li>Stop Redis with <code>redis-cli -p 6390 shutdown nosave</code>, make two bookings, start Redis again and confirm both emails arrive (<code>tmp/mail.jsonl</code>).</li>
</ol>
<p><strong>Done when:</strong> the sixth booking is 429 regardless of which instance served it, the naive run loses at least one edit and the real one none, and no email is missing after the outage.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Stateless instance</span><span class="v">A process that keeps nothing two requests must agree on; any instance can serve any request.</span></div>
  <div class="kv"><span class="k">Atomic script</span><span class="v">A Redis Lua script runs with nothing interleaved — read-compute-write as one step.</span></div>
  <div class="kv"><span class="k">Fail open / fail closed</span><span class="v">When a check's dependency is down: allow (open) or refuse (closed) — chosen per feature.</span></div>
  <div class="kv"><span class="k">Lost update</span><span class="v">Two writers start from the same version; the later silently overwrites the earlier.</span></div>
  <div class="kv"><span class="k">Conditional UPDATE</span><span class="v"><code>… WHERE version = $n</code>: the check and the write are one statement.</span></div>
  <div class="kv"><span class="k">Sequence</span><span class="v">A lock-free, non-transactional counter in PostgreSQL; here, the shared list version.</span></div>
  <div class="kv"><span class="k">Consumer group</span><span class="v">Redis Stream readers that share messages and acknowledge them (10.5).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>The six 12.1 probes on PostgreSQL + Redis: data survives, 409 instead of a double booking, no stale 304, tickets and API keys work on any instance.</li>
  <li>Rate limit: one atomic Lua script with Redis's clock — 5 × 201 then 429, counted across A and B.</li>
  <li>Idempotency records are written before the response; 20 of 20 immediate retries replayed under load.</li>
  <li>List ETags read a shared SEQUENCE bumped after commit; If-Match is enforced inside the UPDATE: lost edits 11/20 ⇒ 0/20.</li>
  <li>Redis down: limits fail open, cache bypasses, tickets 503, /ready stays 200; events wait in the outbox and arrive when it returns.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-12-4-nguyen-tu-rate-limit-lock" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Node.js course — 12.4: Atomicity: rate limiting and locks done right</span><span class="lc-sub">Same: read-then-write races and a token bucket in Redis. There: the INCR-then-EXPIRE bug, three algorithms compared, distributed locks. Here: one bucket shared by two API instances.</span></span>
  <span class="lc-cta">OPEN LESSON →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-7-3-lua" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Redis course — 7.3: Lua: moving the logic into the server</span><span class="lc-sub">Why a script is atomic, KEYS vs ARGV, and the conversion rules the bucket script above obeys (floats truncate, so it returns tostring).</span></span>
  <span class="lc-cta">OPEN LESSON →</span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.4</span>
<h2>Hai instance, một sự thật: dùng chung rate limit, idempotency, ETag và vé</h2>
<p class="lead">Đưa dữ liệu vào PostgreSQL đã sửa những lỗi ồn ào nhất của bài 12.1. Còn bốn lỗi lặng lẽ hơn, vì chúng chưa bao giờ là “dữ liệu”: xô token rate limit, khoá idempotency, số phiên bản danh sách cho ETag, vé realtime. Bài này đưa từng thứ về một chỗ dùng chung, thêm khoá lạc quan (optimistic locking) trong một câu lệnh, rồi tắt Redis xem cái gì còn chạy.</p>
<p><strong>Học xong bạn làm được:</strong> chạy một API phi trạng thái (stateless) trên N instance, cài một xô token dùng chung bằng một script Lua nguyên tử, làm cho thử lại và ETag đúng qua nhiều instance, và quyết định API làm gì khi kho cache chết. <strong>Vì sao quan trọng:</strong> “stateless” là chữ đầu tiên người phỏng vấn chờ nghe khi bạn nói “hai máy chủ” — bài này cho thấy cái giá để chữ đó thành thật.</p>

<h3>Các phép thử của bài 12.1, chạy lại</h3>
<p>Cùng lệnh, cùng proxy, cùng hai instance — giờ với <code>LABFLOW_STORE=pg</code> và Redis:</p>
<pre><code class="language-bash">for i in 1 2; do curl -s -o /dev/null -w '%{http_code} instance=%header{labflow-instance} %header{location}\\n' http://localhost:8180/v2/bookings -H "Authorization: Bearer $(cat lan.jwt)" --json '{"labId":"lab_3","period":{"start":"2027-04-07T08:00:00+07:00","end":"2027-04-07T10:00:00+07:00"}}'; done</code></pre>
<div class="out">201 instance=A /v2/bookings/bk_3
409 instance=B </div>
<pre><code class="language-bash">curl -s -D - -o /dev/null 'http://localhost:4200/v2/bookings?labId=lab_3' \\
  -H "Authorization: Bearer $(cat lan.jwt)" | grep -i '^etag' | tr \\
  -d '\\r' | tee etag.txt</code></pre>
<div class="out">ETag: "bookings-v3-JMolGI-8rCeg27eS"</div>
<pre><code class="language-bash">curl -s -o /dev/null -w 'đặt ở B: %{http_code} %header{location}\\n' http://localhost:4201/v2/bookings \\
  -H "Authorization: Bearer $(cat lan.jwt)" \\
  --json '{"labId":"lab_3","period":{"start":"2027-04-08T08:00:00+07:00","end":"2027-04-08T10:00:00+07:00"}}'</code></pre>
<div class="out">đặt ở B: 201 /v2/bookings/bk_5</div>
<pre><code class="language-bash">curl -s -o /dev/null -w 'hỏi lại A: %{http_code}\\n' 'http://localhost:4200/v2/bookings?labId=lab_3' \\
  -H "Authorization: Bearer $(cat lan.jwt)" \\
  -H "If-None-Match: $(cut -d' ' -f2 etag.txt)"</code></pre>
<div class="out">hỏi lại A: 200</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4200/v2/realtime/tickets \\
  -H "Authorization: Bearer $(cat lan.jwt)" | jq -r .ticket &gt; tkt.txt; echo "vé từ A: $(cut -c1-10 tkt.txt)…"</code></pre>
<div class="out">vé từ A: tkt_vhmifo…</div>
<pre><code class="language-bash">curl -s -o /dev/null -w 'SSE ở B: %{http_code}\\n' --max-time 2 "http://localhost:4201/v2/events/stream?ticket=$(cat tkt.txt)"</code></pre>
<div class="out">SSE ở B: 200</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4200/v2/me/api-keys \\
  -H "Authorization: Bearer $(cat lan.jwt)" | jq -r .key &gt; key.txt; echo "khoá tạo ở A: $(cut -c1-12 key.txt)…"</code></pre>
<div class="out">khoá tạo ở A: lf_live_Dqad…</div>
<pre><code class="language-bash">for p in 4200 4201; do curl -s -o /dev/null -w ":$p GET /v2/me bằng khoá: %{http_code}\\n" http://localhost:$p/v2/me -H "Authorization: Bearer $(cat key.txt)"; done</code></pre>
<div class="out">:4200 GET /v2/me bằng khoá: 200
:4201 GET /v2/me bằng khoá: 200</div>
<p>Khởi động lại A không còn mất gì: phép thử khởi động lại giờ in 200 ở chỗ bài 12.1 in 404. Request thứ hai cho cùng khung giờ nhận 409 (và đốt mất <code>bk_4</code> — lượt kế tiếp là <code>bk_5</code>); A không còn trả 304 sau khi B ghi; B nhận vé và API key của A. Giờ đi qua từng cơ chế, và nó làm bằng gì.</p>

<h3>Xô token dùng chung: một script Lua</h3>
<p>Xô của Chương 5 nằm trong một <code>Map</code>, nên hai instance cho mỗi người gấp đôi hạn mức (8.3: 8/8 lượt đặt lọt qua giới hạn 5). Chỉ chuyển con số sang Redis là chưa đủ: “đọc số token, tính, ghi lại” từ hai instance là đúng cuộc đua của việc đếm lượt đặt. Redis chạy một script Lua <strong>nguyên tử</strong> (atomic) — không lệnh nào khác chen vào lúc script chạy — nên cả đọc-tính-ghi là một bước:</p>
<pre><code class="language-lua">local cap, rate = tonumber(ARGV[1]), tonumber(ARGV[2])
local t = redis.call('TIME')                            -- đồng hồ của Redis, không phải của từng máy chủ
local nowS = tonumber(t[1]) + tonumber(t[2]) / 1000000
local b = redis.call('HMGET', KEYS[1], 'tokens', 'at')
local tokens = math.min(cap, (tonumber(b[1]) or cap) + (nowS - (tonumber(b[2]) or nowS)) * rate)
local ok = 0
if tokens &gt;= 1 then tokens = tokens - 1; ok = 1 end
redis.call('HSET', KEYS[1], 'tokens', tostring(tokens), 'at', tostring(nowS))
redis.call('EXPIRE', KEYS[1], math.ceil(cap / rate) + 1)   -- xô không ai dùng tự biến mất
return {ok, tostring(tokens)}</code></pre>
<p>Đồng hồ lấy từ Redis (<code>TIME</code>), nên hai máy chủ ứng dụng lệch nhau một giây vẫn rót xô đúng. Tám lượt đặt của Cô Lan qua proxy:</p>
<pre><code class="language-bash">for d in 10 11 12 13 14 15 16 17; do curl -s -o /dev/null -w "%{http_code} instance=%header{labflow-instance} ratelimit=%header{ratelimit}\\n" http://localhost:8180/v2/bookings -H "Authorization: Bearer $(cat lan.jwt)" --json "{\\"labId\\":\\"lab_2\\",\\"period\\":{\\"start\\":\\"2027-04-\${d}T08:00:00+07:00\\",\\"end\\":\\"2027-04-\${d}T10:00:00+07:00\\"}}"; done</code></pre>
<div class="out">201 instance=B ratelimit="booking";r=4;t=12
201 instance=A ratelimit="booking";r=3;t=24
201 instance=B ratelimit="booking";r=2;t=36
201 instance=A ratelimit="booking";r=1;t=48
201 instance=B ratelimit="booking";r=0;t=60
429 instance=A ratelimit="booking";r=0;t=12
429 instance=B ratelimit="booking";r=0;t=12
429 instance=A ratelimit="booking";r=0;t=12</div>
<pre><code class="language-bash">redis-cli -p 6390 --scan --pattern 'labflow:rl:*'</code></pre>
<div class="out">labflow:rl:booking:usr_3
labflow:rl:login:::ffff:127.0.0.1|lan@labflow.example</div>
<p>Năm lượt qua, xen kẽ A và B, và header <code>RateLimit</code> đếm 4, 3, 2, 1, 0 xuyên qua cả hai — một cái xô duy nhất, <code>labflow:rl:booking:usr_3</code>.</p>
<a class="link-card" href="https://redis.io/docs/latest/develop/programmability/eval-intro/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: Redis — Scripting with Lua (đọc ngày 01/11/2026)</span><span class="lc-sub">“Redis bảo đảm script chạy nguyên tử. Trong lúc script chạy, mọi hoạt động khác của máy chủ bị chặn suốt thời gian đó.” Khoá mà script đụng tới phải truyền qua KEYS.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Khoá idempotency mọi instance đều thấy</h3>
<p>Bài 8.3 đã chuyển khoá vào bảng PostgreSQL, nơi <code>INSERT … ON CONFLICT DO NOTHING</code> chỉ cho đúng một instance giành được khoá. Ở đây đổi một chi tiết: Chương 5 ghi “xong + câu trả lời” <em>sau khi</em> câu trả lời đã đi (lúc kết nối <code>close</code>). Client thử lại ngay — qua proxy, rơi vào instance kia — có thể tới trước lần ghi đó và nhận <code>409 IDEMPOTENCY_IN_PROGRESS</code>. Ta đã thấy đúng chuyện đó một lần, ở lần smoke test đầu tiên của chương, và không tái hiện được ở các lần sau: một khe hở cỡ một mili giây. Hiếm không phải là không bao giờ, nên giờ bản ghi được ghi <em>trước khi</em> câu trả lời rời server:</p>
<pre><code class="language-javascript">res.json = (body) =&gt; {
  saved = true;
  save({ status: res.statusCode, body, location: res.get('Location') })   // UPDATE … state = 'done'
    .finally(() =&gt; json(body));                                          // rồi client mới nhận 201
  return res;
};</code></pre>
<pre><code class="language-bash">(npx autocannon -c 50 -d 12 -H "Authorization=Bearer tok_lan" 'http://localhost:8180/v2/bookings?limit=100' &gt; /dev/null 2&gt;&amp;1 &amp;) ; sleep 1; N=20 node perf/idem-replay.mjs</code></pre>
<div class="out">20 lần "nhận 201 rồi gửi lại ngay": phát lại đúng ×20</div>
<p>Hai mươi cặp “nhận 201 rồi gửi lại ngay” trong lúc có tải nền: cả hai mươi được phát lại đúng 201 đã lưu, không lượt đặt thứ hai nào.</p>

<h3>ETag từ một số phiên bản mọi instance cùng đọc</h3>
<p>304 sai của bài 12.1 đến từ <code>versions.bookings++</code> trong một tiến trình. Cách sửa là một <code>SEQUENCE</code> PostgreSQL (migration 003): mọi lệnh ghi gọi <code>nextval('bookings_list_version')</code>, mọi request danh sách đọc <code>last_value</code> trước khi tính bất cứ gì. Hai chi tiết quan trọng:</p>
<ul>
  <li>Sequence không khoá dòng nào, nên năm mươi lượt đặt cùng lúc không phải xếp hàng trên một dòng “phiên bản”.</li>
  <li><code>nextval</code> chạy <strong>sau</strong> COMMIT. Tăng trước thì người đọc có thể cache danh sách cũ dưới số phiên bản mới — một 304 giấu mất lượt đặt. Tăng sau thì tệ nhất là thêm một lần 200.</li>
</ul>

<h3>Khoá lạc quan trong một câu lệnh</h3>
<p><code>If-Match</code> của Chương 5 so ETag trong JavaScript rồi mới ghi — an toàn trong một tiến trình, là cuộc đua qua hai tiến trình. Hai quản lý đọc ETag của <code>dev_1</code> rồi cùng PATCH qua proxy. Với bản kiểm-rồi-ghi (<code>LABFLOW_NAIVE_UPDATE=1</code>, công tắc chỉ để học) và bản thật:</p>
<pre><code class="language-bash">node perf/race-api.mjs etag-n 20</code></pre>
<div class="out">20 lần hai người cùng PATCH với cùng If-Match: cả hai 200 (MẤT một bản sửa) ×11 · 200 + 412 ×9</div>
<pre><code class="language-bash">node perf/race-api.mjs etag-n 20</code></pre>
<div class="out">20 lần hai người cùng PATCH với cùng If-Match: cả hai 200 (MẤT một bản sửa) ×0 · 200 + 412 ×20</div>
<p>11/20 lần thử mất một bản sửa mà không ai hay: cả hai nhận 200, người sau ghi đè người trước. Kho thật đặt điều kiện vào chính câu ghi — <code>UPDATE devices SET … , version = version + 1 WHERE id = $1 AND version = $2</code> — 0 dòng nghĩa là có người tới trước, và route trả 412 kèm ETag hiện tại. Đúng 20/20.</p>

<h3>Khi Redis sập</h3>
<p>Redis giờ giữ rate limit, vé, cache, dòng sự kiện và các hàng đợi — nhưng không giữ sự thật. Quyết định cho từng tính năng nó làm gì khi thiếu Redis, rồi thử:</p>
<pre><code class="language-bash">redis-cli -p 6390 shutdown nosave; sleep 1</code></pre>
<pre><code class="language-bash">for d in 20 21 22 23 24 25 26; do curl -s -o /dev/null -w "%{http_code} instance=%header{labflow-instance} ratelimit=%header{ratelimit}\\n" http://localhost:8180/v2/bookings -H "Authorization: Bearer $(cat lan.jwt)" --json "{\\"labId\\":\\"lab_2\\",\\"period\\":{\\"start\\":\\"2027-04-\${d}T08:00:00+07:00\\",\\"end\\":\\"2027-04-\${d}T10:00:00+07:00\\"}}"; done</code></pre>
<div class="out">201 instance=B ratelimit="booking";r=4;t=12
201 instance=A ratelimit="booking";r=4;t=12
201 instance=B ratelimit="booking";r=3;t=24
201 instance=A ratelimit="booking";r=3;t=24
201 instance=B ratelimit="booking";r=2;t=36
201 instance=A ratelimit="booking";r=2;t=36
201 instance=B ratelimit="booking";r=1;t=48</div>
<pre><code class="language-bash">curl -s http://localhost:4200/ready; echo</code></pre>
<div class="out">{
  "status": "ready",
  "store": "pg",
  "database": "up",
  "redis": "down"
}</div>
<pre><code class="language-bash">curl -s -o /dev/null -w 'GET /v2/labs: %{http_code} cache=%header{labflow-cache}\\n' http://localhost:8180/v2/labs</code></pre>
<div class="out">GET /v2/labs: 200 cache=BYPASS</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:8180/v2/realtime/tickets \\
  -H "Authorization: Bearer $(cat lan.jwt)" | jq -c '{status, code}'</code></pre>
<div class="out">{"status":503,"code":"DEPENDENCY_DOWN"}</div>
<pre><code class="language-bash">psql postgres://labflow@localhost:55432/labflow_app -c "SELECT count(*) AS chua_phat FROM outbox WHERE published_at IS NULL"</code></pre>
<div class="out"> chua_phat 
-----------
         7
(1 row)</div>
<table>
<tr><th>Tính năng</th><th>Không có Redis</th><th>Vì sao chọn vậy</th></tr>
<tr><td>rate limit</td><td><strong>mở cửa</strong> (fail open), lùi về xô riêng của từng instance (7 × 201 ở trên)</td><td>bộ giới hạn không được tự làm sập trang; bị lạm dụng một phút còn hơn sập</td></tr>
<tr><td>cache danh sách phòng</td><td>BYPASS — đọc PostgreSQL</td><td>cache là đồ tăng tốc, không bao giờ là phụ thuộc</td></tr>
<tr><td>vé realtime</td><td>503 + Retry-After</td><td>không thể giữ đúng lời hứa qua các instance — nói thẳng ra</td></tr>
<tr><td>/ready</td><td>vẫn 200, <code>"redis": "down"</code></td><td>chỉ CSDL mới làm instance vô dụng</td></tr>
<tr><td>sự kiện</td><td>chờ trong outbox (12.5)</td><td>lượt đặt đã commit; giao trễ, không mất</td></tr>
</table>
<p>Khi Redis quay lại (rỗng — nó chạy không lưu đĩa), worker dựng lại các nhóm consumer, bảy dòng outbox đang chờ được phát, và log worker ghi bảy email, từ <code>ntf_bk_1_v1</code> tới <code>ntf_bk_7_v1</code>, mỗi dòng “đã gửi (lần 1, 300 ms)”:</p>
<pre><code class="language-bash">psql postgres://labflow@localhost:55432/labflow_app -c "SELECT count(*) FILTER (WHERE published_at IS NULL) AS chua_phat, count(*) AS tong, max(published_at - created_at) AS cho_lau_nhat FROM outbox"</code></pre>
<div class="out"> chua_phat | tong | cho_lau_nhat 
-----------+------+--------------
         0 |    7 | 00:00:02.094
(1 row)</div>
<div class="pitfall"><p><strong>Bẫy — client Redis không có trình nghe <code>'error'</code>.</strong> Lần đầu tắt Redis, tiến trình worker chết với <code>Unhandled 'error' event … SocketClosedUnexpectedlyError</code>: Node giết tiến trình khi một EventEmitter phát <code>'error'</code> mà không ai nghe. Giờ mọi client trong <code>src/worker.js</code> ghi log lỗi và tự nối lại, còn các vòng đọc stream thử lại thay vì gọi <code>process.exit</code>.</p></div>

<h3>Khi phỏng vấn / đi làm</h3>
<ul>
  <li><strong>“API của em có stateless không?”</strong> Tiến trình thì có: mọi thứ hai request phải thống nhất đều nằm ở PostgreSQL (sự thật) hoặc Redis (ngắn hạn), và đã thử sáu phép thử qua hai instance.</li>
  <li><strong>“Sao dùng Lua cho rate limiter?”</strong> Đọc-tính-ghi phải nguyên tử qua các instance; script chạy nguyên tử trong Redis, và dùng đồng hồ của chính Redis.</li>
  <li><strong>“Kho cache chết thì sao?”</strong> Quyết định theo từng tính năng: giới hạn mở cửa, cache bỏ qua, vé trả 503, dữ liệu không ảnh hưởng — và đã đo.</li>
</ul>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
  <li>Qua proxy, gửi sáu lượt đặt bằng tài khoản An trong một phút; chờ 12 s rồi gửi thêm một. Giải thích từng header <code>RateLimit</code>.</li>
  <li>Chạy <code>node perf/race-api.mjs etag-n 20</code> có <code>LABFLOW_NAIVE_UPDATE=1</code> và không có; ghi số lần mất cập nhật.</li>
  <li>Tắt Redis bằng <code>redis-cli -p 6390 shutdown nosave</code>, đặt hai lượt, bật Redis lại và xác nhận đủ hai email (<code>tmp/mail.jsonl</code>).</li>
</ol>
<p><strong>Đạt khi:</strong> lượt thứ sáu luôn là 429 dù instance nào phục vụ, bản ngây thơ mất ít nhất một bản sửa còn bản thật không mất cái nào, và không thiếu email nào sau sự cố.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Stateless instance (instance phi trạng thái)</span><span class="v">Tiến trình không giữ thứ gì hai request phải thống nhất; instance nào cũng phục vụ được request nào.</span></div>
  <div class="kv"><span class="k">Atomic script (script nguyên tử)</span><span class="v">Script Lua trong Redis chạy không bị chen ngang — đọc-tính-ghi thành một bước.</span></div>
  <div class="kv"><span class="k">Fail open / fail closed (mở cửa / đóng cửa khi hỏng)</span><span class="v">Khi phụ thuộc của một phép kiểm sập: cho qua (open) hay từ chối (closed) — chọn theo từng tính năng.</span></div>
  <div class="kv"><span class="k">Lost update (mất cập nhật)</span><span class="v">Hai người ghi bắt đầu từ cùng phiên bản; người sau lặng lẽ ghi đè người trước.</span></div>
  <div class="kv"><span class="k">Conditional UPDATE (cập nhật có điều kiện)</span><span class="v"><code>… WHERE version = $n</code>: phép kiểm và lệnh ghi là một câu lệnh.</span></div>
  <div class="kv"><span class="k">Sequence (bộ đếm)</span><span class="v">Bộ đếm không khoá, không theo transaction của PostgreSQL; ở đây là số phiên bản danh sách dùng chung.</span></div>
  <div class="kv"><span class="k">Consumer group (nhóm consumer)</span><span class="v">Các bên đọc Redis Stream chia nhau tin và xác nhận đã xử lý (10.5).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Sáu phép thử của bài 12.1 trên PostgreSQL + Redis: dữ liệu sống sót, 409 thay cho đặt trùng, hết 304 sai, vé và API key dùng được ở mọi instance.</li>
  <li>Rate limit: một script Lua nguyên tử, dùng đồng hồ của Redis — 5 × 201 rồi 429, đếm chung qua A và B.</li>
  <li>Bản ghi idempotency được ghi trước câu trả lời; 20/20 lần gửi lại ngay được phát lại khi đang có tải.</li>
  <li>ETag danh sách đọc một SEQUENCE dùng chung, tăng sau commit; If-Match thi hành ngay trong câu UPDATE: mất bản sửa 11/20 ⇒ 0/20.</li>
  <li>Redis sập: giới hạn mở cửa, cache bỏ qua, vé 503, /ready vẫn 200; sự kiện chờ trong outbox và tới khi Redis quay lại.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-12-4-nguyen-tu-rate-limit-lock" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Khoá Node.js — 12.4: Tính nguyên tử: giới hạn tần suất và khoá phân tán</span><span class="lc-sub">Giống: tranh chấp đọc-rồi-ghi và token bucket trên Redis. Ở đó: bug INCR rồi EXPIRE, so ba thuật toán, khoá phân tán. Ở đây: một xô dùng chung cho hai instance API.</span></span>
  <span class="lc-cta">MỞ BÀI →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-7-3-lua" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Khoá Redis — 7.3: Lua: chuyển logic vào bên trong máy chủ</span><span class="lc-sub">Vì sao script là nguyên tử, KEYS khác ARGV, và các luật chuyển kiểu mà script xô ở trên tuân theo (số thực bị cắt, nên nó trả tostring).</span></span>
  <span class="lc-cta">MỞ BÀI →</span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 12.5 ─────────────────────────── */
    {
      title: '12.5 — Making it scale: a cache, a transactional outbox and a notification queue|||12.5 — Làm nó chịu tải: cache, transactional outbox và hàng đợi thông báo',
      slug: 'api-12-3-mo-rong',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Cache danh sách phòng không thể làm sập API, outbox trong transaction lượt đặt + relay LISTEN/NOTIFY (p50 1,0 ms vs 946 ms), email trong request (311 ms, 500 khi sập) vs hàng đợi (3,6 ms, thử lại tới khi giao), relay sập: 21 sự kiện mà đúng 20 email.',
      content: `${G125}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.5</span>
<h2>Making it scale: a cache, a transactional outbox and a notification queue</h2>
<p class="lead">Two jobs remain from the brief: read the hottest list without asking the database every time, and email students when a booking is made or cancelled — without making them wait for the email, without losing an email when something crashes, and without sending one twice. Chapter 10 drew the outbox on a whiteboard; here it runs on the real bookings table.</p>
<p><strong>What you can do after it:</strong> add a cache that can never take the API down, publish events with a transactional outbox and a relay, move slow side effects to a queue, and show with numbers what each choice costs. <strong>Why it matters:</strong> “send an email after the order” is the classic interview follow-up, and the wrong answer (send it inside the request) fails in exactly the ways measured below.</p>

<h3>A cache for the labs list</h3>
<p><code>GET /v2/labs</code> is the first call of every app start and the data almost never changes. It goes through the cache-aside helper of 9.2: look in Redis, on a miss read PostgreSQL and store the result for 60 s (+0–10% jitter), with single-flight so fifty simultaneous misses do one query:</p>
<pre><code class="language-bash">for i in 1 2 3; do curl -s -o /dev/null -D - http://localhost:4200/v2/labs | grep -iE '^(labflow-cache|server-timing)' | tr -d '\\r' | paste -sd' ' -; done</code></pre>
<div class="out">LabFlow-Cache: MISS Server-Timing: validate;dur=1.01, cache;dur=1.69, db;dur=13.80, total;dur=22.98
LabFlow-Cache: HIT Server-Timing: validate;dur=0.04, cache;dur=2.35, total;dur=8.38
LabFlow-Cache: HIT Server-Timing: validate;dur=0.04, cache;dur=0.58, total;dur=1.96</div>
<pre><code class="language-bash">redis-cli -p 6390 --scan --pattern 'labflow:labs:*'</code></pre>
<div class="out">labflow:labs:v1:||</div>
<pre><code class="language-bash">redis-cli -p 6390 ttl 'labflow:labs:v1:||'</code></pre>
<div class="out">60</div>
<pre><code class="language-bash">for i in 1 2 3; do curl -s -o /dev/null -D - http://localhost:4200/v2/labs | grep -iE '^(labflow-cache|server-timing)' | tr -d '\\r' | paste -sd' ' -; done</code></pre>
<div class="out">Server-Timing: validate;dur=1.16, db;dur=2.14, total;dur=6.22
Server-Timing: validate;dur=0.12, db;dur=1.32, total;dur=4.09
Server-Timing: validate;dur=0.04, db;dur=1.01, total;dur=1.87</div>
<p>Be honest about what this shows: on one laptop a Redis hit (1.96 ms total once warm) is not faster than PostgreSQL's 1.87 ms — both are a localhost round trip. The cache's value is <strong>load taken off the database</strong>: a thousand app starts at 07:00 cost one query per minute instead of a thousand. 12.6 measures it under load. Two rules make it safe: the key includes every filter (<code>labflow:labs:v1:building|minCapacity|q</code>, the <code>v1</code> lets a deploy change the shape), and every Redis error is treated as a miss — the 12.4 outage answered <code>cache=BYPASS</code> with a 200.</p>

<h3>The outbox: an event exists if and only if the booking does</h3>
<p>Chapter 10 measured the problem: saving a booking and then publishing its event (a <strong>dual write</strong>) lost 342 events when the publisher failed in between (10.3). In the pg store the event is a row in <code>outbox</code>, inserted <em>in the same transaction</em> as the booking:</p>
<pre><code class="language-javascript">async function outbox(c, kind, b) {                                   // c = the booking's transaction
  await c.query('INSERT INTO outbox (type, subject, data) VALUES ($1, $2, $3)',
    [&#96;labflow.booking.\${kind}.v1&#96;, b.id, bookingEvent(b)]);           // no PII in data (10.3)
  await c.query("SELECT pg_notify('labflow_outbox', '')");           // delivered only if the transaction commits
}</code></pre>
<p>A rolled-back booking leaves no event, a committed one always has one — <code>test/capstone.test.mjs</code> checks both. A <strong>relay</strong> in the worker moves rows to the Redis Stream that SSE, WebSocket and webhooks already read:</p>
<pre><code class="language-sql">BEGIN;
SELECT * FROM outbox WHERE published_at IS NULL ORDER BY id LIMIT 100
  FOR UPDATE SKIP LOCKED;                     -- two relays never take the same rows
-- for each row: XADD labflow:events …        (Redis)
UPDATE outbox SET published_at = now() WHERE id = ANY($1);
COMMIT;</code></pre>
<p>The relay sleeps until <code>NOTIFY</code> wakes it (PostgreSQL delivers it at COMMIT), with a 1-second poll as a safety net. From the moment the API returns 201 to the moment an SSE client holds the event — twenty bookings, first with LISTEN/NOTIFY, then with polling only (<code>RELAY_LISTEN=0</code>):</p>
<pre><code class="language-bash">N=20 node perf/event-lag.mjs</code></pre>
<div class="out">20 lượt đặt: từ 201 tới sự kiện SSE — p50 1.0 ms · p90 3.1 ms · chậm nhất 6.6 ms · nhanh nhất 0.5 ms</div>
<pre><code class="language-bash">N=20 node perf/event-lag.mjs</code></pre>
<div class="out">20 lượt đặt: từ 201 tới sự kiện SSE — p50 946.0 ms · p90 967.0 ms · chậm nhất 982.6 ms · nhanh nhất 889.1 ms</div>
<a class="link-card" href="https://www.postgresql.org/docs/18/sql-notify.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: PostgreSQL 18 — NOTIFY (read 1 Nov 2026)</span><span class="lc-sub">“If a NOTIFY is executed inside a transaction, the notify events are not delivered until and unless the transaction is committed.” SELECT … SKIP LOCKED: “can be used to avoid lock contention with multiple consumers accessing a queue-like table.”</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>Email: in the request, or in a queue?</h3>
<p>The email provider here is a fake (<code>src/mailer.js</code>): 300 ms per message, like an HTTPS call to SES or Resend, and a file switch that makes it fail. First the naive design, <code>LABFLOW_NOTIFY=sync</code>: send inside <code>POST /v2/bookings</code>. Then the provider goes down:</p>
<pre><code class="language-bash">N=20 START_DAY=30 node perf/notify-cost.mjs</code></pre>
<div class="out">20 lượt POST /v2/bookings: p50 311.0 ms · chậm nhất 327.4 ms · mã 201 ×20</div>
<pre><code class="language-bash">psql postgres://labflow@localhost:55432/labflow_app -Atc "SELECT 'lượt đặt trong bảng: ' || count(*) FROM bookings"</code></pre>
<div class="out">lượt đặt trong bảng: 20</div>
<pre><code class="language-bash">touch mail-down; cd labflow-ch12 &amp;&amp; N=5 START_DAY=60 node perf/notify-cost.mjs</code></pre>
<div class="out">5 lượt POST /v2/bookings: p50 311.1 ms · chậm nhất 313.8 ms · mã 500 INTERNAL ×5</div>
<pre><code class="language-bash">psql postgres://labflow@localhost:55432/labflow_app -Atc "SELECT 'lượt đặt trong bảng: ' || count(*) FROM bookings"</code></pre>
<div class="out">lượt đặt trong bảng: 25</div>
<pre><code class="language-bash">N=1 START_DAY=60 node perf/notify-cost.mjs; rm -f ../mail-down</code></pre>
<div class="out">1 lượt POST /v2/bookings: p50 14.8 ms · chậm nhất 14.8 ms · mã 409 BOOKING_CONFLICT ×1</div>
<p>Every booking now costs the user 300 ms more. Worse, with the provider down the student sees <code>500</code> — but the table grew from 20 to 25: the bookings exist. The student presses again and gets <code>409 BOOKING_CONFLICT</code> against their own booking. A side effect inside the request turned a working booking into a confusing error.</p>
<p>The queued design (the default): the worker reads <code>booking.created</code> and <code>booking.cancelled</code> from the stream (consumer group <code>notify</code>), adds a BullMQ job per email, and a mailer worker sends it, retrying with exponential backoff:</p>
<pre><code class="language-bash">N=20 START_DAY=0 node perf/notify-cost.mjs</code></pre>
<div class="out">20 lượt POST /v2/bookings: p50 3.6 ms · chậm nhất 6.4 ms · mã 201 ×20</div>
<pre><code class="language-bash">touch mail-down; cd labflow-ch12 &amp;&amp; N=5 START_DAY=90 node perf/notify-cost.mjs</code></pre>
<div class="out">5 lượt POST /v2/bookings: p50 6.4 ms · chậm nhất 19.6 ms · mã 201 ×5</div>
<pre><code class="language-bash">sleep 8; rm -f mail-down; sleep 8; grep -E 'thư ntf' log-w12.log | cut -c1-118</code></pre>
<div class="out">04:07:57.297 [w1] thư ntf_bk_1_v1 hỏng lần 1: MAIL_PROVIDER_DOWN: 503 từ nhà cung cấp email
04:07:57.301 [w1] thư ntf_bk_2_v1 hỏng lần 1: MAIL_PROVIDER_DOWN: 503 từ nhà cung cấp email
04:07:57.307 [w1] thư ntf_bk_3_v1 hỏng lần 1: MAIL_PROVIDER_DOWN: 503 từ nhà cung cấp email
04:07:57.310 [w1] thư ntf_bk_4_v1 hỏng lần 1: MAIL_PROVIDER_DOWN: 503 từ nhà cung cấp email
04:07:57.315 [w1] thư ntf_bk_5_v1 hỏng lần 1: MAIL_PROVIDER_DOWN: 503 từ nhà cung cấp email
04:07:58.693 [w1] thư ntf_bk_2_v1 hỏng lần 2: MAIL_PROVIDER_DOWN: 503 từ nhà cung cấp email
04:07:58.795 [w1] thư ntf_bk_5_v1 hỏng lần 2: MAIL_PROVIDER_DOWN: 503 từ nhà cung cấp email
04:07:59.204 [w1] thư ntf_bk_1_v1 hỏng lần 2: MAIL_PROVIDER_DOWN: 503 từ nhà cung cấp email
04:07:59.507 [w1] thư ntf_bk_4_v1 hỏng lần 2: MAIL_PROVIDER_DOWN: 503 từ nhà cung cấp email
04:07:59.609 [w1] thư ntf_bk_3_v1 hỏng lần 2: MAIL_PROVIDER_DOWN: 503 từ nhà cung cấp email
04:08:01.644 [w1] thư ntf_bk_2_v1 hỏng lần 3: MAIL_PROVIDER_DOWN: 503 từ nhà cung cấp email
04:08:01.849 [w1] thư ntf_bk_5_v1 hỏng lần 3: MAIL_PROVIDER_DOWN: 503 từ nhà cung cấp email
04:08:02.670 [w1] thư ntf_bk_1_v1 hỏng lần 3: MAIL_PROVIDER_DOWN: 503 từ nhà cung cấp email
04:08:02.670 [w1] thư ntf_bk_4_v1 hỏng lần 3: MAIL_PROVIDER_DOWN: 503 từ nhà cung cấp email
04:08:03.886 [w1] thư ntf_bk_3_v1 hỏng lần 3: MAIL_PROVIDER_DOWN: 503 từ nhà cung cấp email
04:08:07.664 [w1] thư ntf_bk_4_v1 → lan@labflow.example: đã gửi (lần 4, 302 ms)
04:08:08.374 [w1] thư ntf_bk_1_v1 → lan@labflow.example: đã gửi (lần 4, 302 ms)
04:08:08.577 [w1] thư ntf_bk_2_v1 → lan@labflow.example: đã gửi (lần 4, 302 ms)
04:08:09.290 [w1] thư ntf_bk_5_v1 → lan@labflow.example: đã gửi (lần 4, 302 ms)
04:08:11.936 [w1] thư ntf_bk_3_v1 → lan@labflow.example: đã gửi (lần 4, 302 ms)</div>
<p>p50 3.6 ms per booking normally and 6.4 ms while the provider was down, all 201; each email failed three times and went out on the fourth try after the provider recovered.</p>

<h3>At-least-once, exactly one email</h3>
<p>The outbox guarantees “at least once”, never “exactly once”: if the relay dies after <code>XADD</code> but before <code>UPDATE … published_at</code>, the row is published again. <code>RELAY_CRASH=0.15</code> (learning switch) kills the relay at random just there:</p>
<pre><code class="language-bash">N=20 START_DAY=0 node perf/notify-cost.mjs</code></pre>
<div class="out">20 lượt POST /v2/bookings: p50 4.3 ms · chậm nhất 19.8 ms · mã 201 ×20</div>
<pre><code class="language-bash">sleep 2; grep 'relay "chết"' log-w12.log | cut -c1-90</code></pre>
<div class="out">04:09:58.114 [w1] relay "chết" sau XADD outbox #5 (RELAY_CRASH)</div>
<pre><code class="language-bash">psql postgres://labflow@localhost:55432/labflow_app -Atc "SELECT 'outbox: ' || count(*) || ' dòng, chưa phát ' || count(*) FILTER (WHERE published_at IS NULL) FROM outbox"</code></pre>
<div class="out">outbox: 20 dòng, chưa phát 16</div>
<pre><code class="language-bash">./restart-w.sh &gt; /dev/null; t0=$(date +%s); until [ "$(wc -l &lt; mail12.jsonl)" -ge 20 ] || [ $(( $(date +%s) - t0 )) -gt 90 ]; do sleep 1; done; echo "đủ thư sau khi khởi động lại: $(( $(date +%s) - t0 )) s"</code></pre>
<div class="out">đủ thư sau khi khởi động lại: 30 s</div>
<pre><code class="language-bash">psql postgres://labflow@localhost:55432/labflow_app -Atc "SELECT 'outbox: ' || count(*) || ' dòng, chưa phát ' || count(*) FILTER (WHERE published_at IS NULL) FROM outbox"</code></pre>
<div class="out">outbox: 20 dòng, chưa phát 0</div>
<pre><code class="language-bash">echo "sự kiện trong stream: $(redis-cli -p 6390 xlen labflow:events) · thư đã gửi: $(wc -l &lt; mail12.jsonl | tr -d ' ') · thư trùng: $(jq -r .id mail12.jsonl | sort | uniq -d | wc -l | tr -d ' ')"</code></pre>
<div class="out">sự kiện trong stream: 21 · thư đã gửi: 20 · thư trùng: 0</div>
<p>21 events for 20 bookings — one duplicate — and still exactly 20 emails. Three layers make that true: the job id is <code>ntf_&lt;booking&gt;_v&lt;version&gt;</code>, so BullMQ ignores a second job with the same id; the mailer passes the same id as the provider's idempotency key; and on start the worker re-reads stream messages it had read but not acknowledged (Redis's pending list) before taking new ones. The jobs the dead worker was holding came back after its lock expired — that is the 30 s.</p>
<div class="pitfall"><p><strong>Trap — reading a consumer group only with <code>'&gt;'</code>.</strong> <code>'&gt;'</code> returns only never-delivered messages. Messages delivered to a consumer that crashed before <code>XACK</code> stay pending forever unless you read them again with id <code>0</code> (or <code>XAUTOCLAIM</code> them from a dead consumer).</p></div>

<h3>In interviews / at work</h3>
<ul>
  <li><strong>“Send an email when an order is placed?”</strong> Not in the request: outbox row in the order's transaction, relay to a stream, queue with retries, idempotency key per email. Measured: +300 ms and 500s with sync, ~4 ms and nothing lost with the queue.</li>
  <li><strong>“Can events be duplicated?”</strong> Yes — at-least-once; we produced one with a crash and deduplicated by a deterministic job id.</li>
  <li><strong>“Does your cache make it faster?”</strong> Per request, barely on localhost; it removes repeated database work at peak, and it can never take the API down.</li>
</ul>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok"><ol>
  <li>Run <code>N=20 node perf/event-lag.mjs</code> with and without <code>RELAY_LISTEN=0</code> on the worker; explain the ~1 s.</li>
  <li>Create <code>tmp/mail-down</code>, make three bookings, delete it after 10 s; follow the retries in the worker log and count lines in <code>tmp/mail.jsonl</code>.</li>
  <li>Cancel one booking twice from two terminals at once; confirm one 200, one 409, and exactly one cancellation email.</li>
</ol>
<p><strong>Done when:</strong> no booking request waits for email, no email is lost across the outage, and no email is sent twice.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cache-aside</span><span class="v">Read the cache; on a miss read the database and fill the cache.</span></div>
  <div class="kv"><span class="k">Dual write</span><span class="v">Writing to two systems in sequence; a failure between them leaves them disagreeing.</span></div>
  <div class="kv"><span class="k">Transactional outbox</span><span class="v">The event is a row written in the same transaction as the data it describes.</span></div>
  <div class="kv"><span class="k">Relay</span><span class="v">A process that moves outbox rows to the message system and marks them published.</span></div>
  <div class="kv"><span class="k">LISTEN / NOTIFY</span><span class="v">PostgreSQL's built-in wake-up signal, delivered at commit.</span></div>
  <div class="kv"><span class="k">At-least-once delivery</span><span class="v">Nothing is lost, but something may arrive twice; consumers deduplicate.</span></div>
  <div class="kv"><span class="k">Pending entries list</span><span class="v">Stream messages delivered to a consumer but not yet acknowledged.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Labs list: cache-aside with jitter and single-flight; a hit is ~2 ms like the database on localhost — the win is fewer queries at peak, and Redis errors are misses.</li>
  <li>Outbox row + <code>pg_notify</code> in the booking's transaction; relay with <code>FOR UPDATE SKIP LOCKED</code>: event lag p50 1.0 ms with NOTIFY, 946 ms polling every second.</li>
  <li>Email inside the request: p50 311 ms, and 5 × 500 for 5 saved bookings when the provider failed.</li>
  <li>Email through the queue: p50 3.6 ms (6.4 ms during the outage), all 201 during the outage, delivered on the 4th attempt after recovery.</li>
  <li>A relay crash duplicated one event (21 for 20); job ids and the pending-list re-read kept it at exactly 20 emails.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-13-1-vi-sao-hang-doi" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Node.js course — 13.1: A request is not a place to do work</span><span class="lc-sub">Same: slow work leaves the request, and you measure why. Here the email goes behind a transactional outbox and BullMQ: booking p50 311 ms → 3.6 ms, and a mail outage no longer fails bookings.</span></span>
  <span class="lc-cta">OPEN LESSON →</span>
</a>
<a class="link-card" href="/courses/background-jobs/learn?lessonSlug=job-6-2-outbox" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Go deeper: Queues & Background Jobs — 6.2 Transactional outbox with Postgres</span><span class="lc-sub">Being written: outbox, relay and consumers as a pattern of their own.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>
<a class="link-card" href="/courses/system-design/learn?lessonSlug=sysd-6-4-thong-bao" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Go deeper: System Design in Practice — 6.4 A notification system</span><span class="lc-sub">Being written: in-app, push and email with preferences, quiet hours and batching.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-12-5-pubsub-streams" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">The mechanism underneath — Node.js lesson 12.5: Pub/Sub vs Streams</span><span class="lc-sub">Why the outbox relay writes to a Stream and not a channel, measured: an offline Pub/Sub subscriber loses messages (PUBLISH → 0), a consumer group recovers a crashed worker's jobs (PENDING 2 → XAUTOCLAIM → 0), and an untrimmed stream keeps growing.</span></span>
  <span class="lc-cta">OPEN NODE.JS LESSON →</span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.5</span>
<h2>Làm nó chịu tải: cache, transactional outbox và hàng đợi thông báo</h2>
<p class="lead">Đề bài còn hai việc: đọc danh sách nóng nhất mà không hỏi CSDL mỗi lần, và gửi email cho sinh viên khi đặt hay huỷ — không bắt họ chờ email, không mất email khi có gì đó chết, và không gửi hai lần. Chương 10 vẽ outbox trên bảng trắng; ở đây nó chạy trên bảng bookings thật.</p>
<p><strong>Học xong bạn làm được:</strong> thêm một cache không bao giờ làm sập được API, phát sự kiện bằng transactional outbox và relay, đẩy việc phụ chậm sang hàng đợi, và chỉ ra bằng số mỗi lựa chọn tốn gì. <strong>Vì sao quan trọng:</strong> “gửi email sau khi đặt hàng” là câu hỏi nối kinh điển trong phỏng vấn, và câu trả lời sai (gửi ngay trong request) hỏng đúng theo những cách đo dưới đây.</p>

<h3>Cache cho danh sách phòng</h3>
<p><code>GET /v2/labs</code> là lời gọi đầu tiên mỗi lần mở app và dữ liệu gần như không đổi. Nó đi qua hàm cache-aside của bài 9.2: tìm trong Redis, trượt thì đọc PostgreSQL và lưu kết quả 60 s (+0–10% jitter), kèm single-flight để năm mươi lần trượt cùng lúc chỉ chạy một truy vấn:</p>
<pre><code class="language-bash">for i in 1 2 3; do curl -s -o /dev/null -D - http://localhost:4200/v2/labs | grep -iE '^(labflow-cache|server-timing)' | tr -d '\\r' | paste -sd' ' -; done</code></pre>
<div class="out">LabFlow-Cache: MISS Server-Timing: validate;dur=1.01, cache;dur=1.69, db;dur=13.80, total;dur=22.98
LabFlow-Cache: HIT Server-Timing: validate;dur=0.04, cache;dur=2.35, total;dur=8.38
LabFlow-Cache: HIT Server-Timing: validate;dur=0.04, cache;dur=0.58, total;dur=1.96</div>
<pre><code class="language-bash">redis-cli -p 6390 --scan --pattern 'labflow:labs:*'</code></pre>
<div class="out">labflow:labs:v1:||</div>
<pre><code class="language-bash">redis-cli -p 6390 ttl 'labflow:labs:v1:||'</code></pre>
<div class="out">60</div>
<pre><code class="language-bash">for i in 1 2 3; do curl -s -o /dev/null -D - http://localhost:4200/v2/labs | grep -iE '^(labflow-cache|server-timing)' | tr -d '\\r' | paste -sd' ' -; done</code></pre>
<div class="out">Server-Timing: validate;dur=1.16, db;dur=2.14, total;dur=6.22
Server-Timing: validate;dur=0.12, db;dur=1.32, total;dur=4.09
Server-Timing: validate;dur=0.04, db;dur=1.01, total;dur=1.87</div>
<p>Hãy trung thực về điều này cho thấy: trên một máy, trúng Redis (1,96 ms tổng khi đã ấm) không nhanh hơn PostgreSQL 1,87 ms — cả hai đều là một vòng localhost. Giá trị của cache là <strong>bớt việc cho CSDL</strong>: một nghìn lần mở app lúc 07:00 tốn một truy vấn mỗi phút thay vì một nghìn. Bài 12.6 đo nó khi có tải. Hai luật làm nó an toàn: khoá chứa mọi bộ lọc (<code>labflow:labs:v1:building|minCapacity|q</code>, chữ <code>v1</code> cho phép một lần triển khai đổi hình dạng), và mọi lỗi Redis được coi là trượt — sự cố ở bài 12.4 trả <code>cache=BYPASS</code> với mã 200.</p>

<h3>Outbox: có sự kiện khi và chỉ khi có lượt đặt</h3>
<p>Chương 10 đã đo vấn đề: lưu lượt đặt rồi mới phát sự kiện (<strong>ghi kép</strong>, dual write) làm mất 342 sự kiện khi bên phát hỏng ở giữa (10.3). Trong kho pg, sự kiện là một dòng trong <code>outbox</code>, chèn <em>trong cùng transaction</em> với lượt đặt:</p>
<pre><code class="language-javascript">async function outbox(c, kind, b) {                                   // c = transaction của lượt đặt
  await c.query('INSERT INTO outbox (type, subject, data) VALUES ($1, $2, $3)',
    [&#96;labflow.booking.\${kind}.v1&#96;, b.id, bookingEvent(b)]);           // data không có dữ liệu cá nhân (10.3)
  await c.query("SELECT pg_notify('labflow_outbox', '')");           // chỉ được giao nếu transaction commit
}</code></pre>
<p>Lượt đặt bị rollback không để lại sự kiện, lượt đã commit luôn có — <code>test/capstone.test.mjs</code> kiểm cả hai. Một <strong>relay</strong> (bộ chuyển tiếp) trong worker chuyển các dòng sang Redis Stream mà SSE, WebSocket và webhook vốn đang đọc:</p>
<pre><code class="language-sql">BEGIN;
SELECT * FROM outbox WHERE published_at IS NULL ORDER BY id LIMIT 100
  FOR UPDATE SKIP LOCKED;                     -- hai relay không bao giờ lấy trùng dòng
-- với mỗi dòng: XADD labflow:events …        (Redis)
UPDATE outbox SET published_at = now() WHERE id = ANY($1);
COMMIT;</code></pre>
<p>Relay ngủ cho tới khi <code>NOTIFY</code> đánh thức (PostgreSQL giao nó lúc COMMIT), kèm hỏi vòng mỗi 1 giây làm lưới an toàn. Từ lúc API trả 201 tới lúc client SSE cầm được sự kiện — hai mươi lượt đặt, trước với LISTEN/NOTIFY, sau chỉ hỏi vòng (<code>RELAY_LISTEN=0</code>):</p>
<pre><code class="language-bash">N=20 node perf/event-lag.mjs</code></pre>
<div class="out">20 lượt đặt: từ 201 tới sự kiện SSE — p50 1.0 ms · p90 3.1 ms · chậm nhất 6.6 ms · nhanh nhất 0.5 ms</div>
<pre><code class="language-bash">N=20 node perf/event-lag.mjs</code></pre>
<div class="out">20 lượt đặt: từ 201 tới sự kiện SSE — p50 946.0 ms · p90 967.0 ms · chậm nhất 982.6 ms · nhanh nhất 889.1 ms</div>
<a class="link-card" href="https://www.postgresql.org/docs/18/sql-notify.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: PostgreSQL 18 — NOTIFY (đọc ngày 01/11/2026)</span><span class="lc-sub">“NOTIFY chạy trong transaction thì sự kiện không được giao cho tới khi, và chỉ khi, transaction commit.” SELECT … SKIP LOCKED: “dùng được để tránh tranh khoá khi nhiều bên cùng đọc một bảng kiểu hàng đợi.”</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Email: trong request, hay qua hàng đợi?</h3>
<p>Nhà cung cấp email ở đây là đồ giả (<code>src/mailer.js</code>): 300 ms mỗi thư, như một lời gọi HTTPS tới SES hay Resend, và một tệp công tắc làm nó hỏng. Trước hết là thiết kế ngây thơ, <code>LABFLOW_NOTIFY=sync</code>: gửi ngay trong <code>POST /v2/bookings</code>. Rồi nhà cung cấp sập:</p>
<pre><code class="language-bash">N=20 START_DAY=30 node perf/notify-cost.mjs</code></pre>
<div class="out">20 lượt POST /v2/bookings: p50 311.0 ms · chậm nhất 327.4 ms · mã 201 ×20</div>
<pre><code class="language-bash">psql postgres://labflow@localhost:55432/labflow_app -Atc "SELECT 'lượt đặt trong bảng: ' || count(*) FROM bookings"</code></pre>
<div class="out">lượt đặt trong bảng: 20</div>
<pre><code class="language-bash">touch mail-down; cd labflow-ch12 &amp;&amp; N=5 START_DAY=60 node perf/notify-cost.mjs</code></pre>
<div class="out">5 lượt POST /v2/bookings: p50 311.1 ms · chậm nhất 313.8 ms · mã 500 INTERNAL ×5</div>
<pre><code class="language-bash">psql postgres://labflow@localhost:55432/labflow_app -Atc "SELECT 'lượt đặt trong bảng: ' || count(*) FROM bookings"</code></pre>
<div class="out">lượt đặt trong bảng: 25</div>
<pre><code class="language-bash">N=1 START_DAY=60 node perf/notify-cost.mjs; rm -f ../mail-down</code></pre>
<div class="out">1 lượt POST /v2/bookings: p50 14.8 ms · chậm nhất 14.8 ms · mã 409 BOOKING_CONFLICT ×1</div>
<p>Mỗi lượt đặt giờ tốn của người dùng thêm 300 ms. Tệ hơn, khi nhà cung cấp sập sinh viên thấy <code>500</code> — nhưng bảng tăng từ 20 lên 25: các lượt đặt có thật. Sinh viên bấm lại và nhận <code>409 BOOKING_CONFLICT</code> với chính lượt của mình. Một việc phụ nằm trong request đã biến lượt đặt thành công thành một lỗi khó hiểu.</p>
<p>Thiết kế qua hàng đợi (mặc định): worker đọc <code>booking.created</code> và <code>booking.cancelled</code> từ stream (nhóm consumer <code>notify</code>), thêm một job BullMQ cho mỗi email, và một worker gửi thư làm việc đó, thử lại lùi dần theo cấp số nhân:</p>
<pre><code class="language-bash">N=20 START_DAY=0 node perf/notify-cost.mjs</code></pre>
<div class="out">20 lượt POST /v2/bookings: p50 3.6 ms · chậm nhất 6.4 ms · mã 201 ×20</div>
<pre><code class="language-bash">touch mail-down; cd labflow-ch12 &amp;&amp; N=5 START_DAY=90 node perf/notify-cost.mjs</code></pre>
<div class="out">5 lượt POST /v2/bookings: p50 6.4 ms · chậm nhất 19.6 ms · mã 201 ×5</div>
<pre><code class="language-bash">sleep 8; rm -f mail-down; sleep 8; grep -E 'thư ntf' log-w12.log | cut -c1-118</code></pre>
<div class="out">04:07:57.297 [w1] thư ntf_bk_1_v1 hỏng lần 1: MAIL_PROVIDER_DOWN: 503 từ nhà cung cấp email
04:07:57.301 [w1] thư ntf_bk_2_v1 hỏng lần 1: MAIL_PROVIDER_DOWN: 503 từ nhà cung cấp email
04:07:57.307 [w1] thư ntf_bk_3_v1 hỏng lần 1: MAIL_PROVIDER_DOWN: 503 từ nhà cung cấp email
04:07:57.310 [w1] thư ntf_bk_4_v1 hỏng lần 1: MAIL_PROVIDER_DOWN: 503 từ nhà cung cấp email
04:07:57.315 [w1] thư ntf_bk_5_v1 hỏng lần 1: MAIL_PROVIDER_DOWN: 503 từ nhà cung cấp email
04:07:58.693 [w1] thư ntf_bk_2_v1 hỏng lần 2: MAIL_PROVIDER_DOWN: 503 từ nhà cung cấp email
04:07:58.795 [w1] thư ntf_bk_5_v1 hỏng lần 2: MAIL_PROVIDER_DOWN: 503 từ nhà cung cấp email
04:07:59.204 [w1] thư ntf_bk_1_v1 hỏng lần 2: MAIL_PROVIDER_DOWN: 503 từ nhà cung cấp email
04:07:59.507 [w1] thư ntf_bk_4_v1 hỏng lần 2: MAIL_PROVIDER_DOWN: 503 từ nhà cung cấp email
04:07:59.609 [w1] thư ntf_bk_3_v1 hỏng lần 2: MAIL_PROVIDER_DOWN: 503 từ nhà cung cấp email
04:08:01.644 [w1] thư ntf_bk_2_v1 hỏng lần 3: MAIL_PROVIDER_DOWN: 503 từ nhà cung cấp email
04:08:01.849 [w1] thư ntf_bk_5_v1 hỏng lần 3: MAIL_PROVIDER_DOWN: 503 từ nhà cung cấp email
04:08:02.670 [w1] thư ntf_bk_1_v1 hỏng lần 3: MAIL_PROVIDER_DOWN: 503 từ nhà cung cấp email
04:08:02.670 [w1] thư ntf_bk_4_v1 hỏng lần 3: MAIL_PROVIDER_DOWN: 503 từ nhà cung cấp email
04:08:03.886 [w1] thư ntf_bk_3_v1 hỏng lần 3: MAIL_PROVIDER_DOWN: 503 từ nhà cung cấp email
04:08:07.664 [w1] thư ntf_bk_4_v1 → lan@labflow.example: đã gửi (lần 4, 302 ms)
04:08:08.374 [w1] thư ntf_bk_1_v1 → lan@labflow.example: đã gửi (lần 4, 302 ms)
04:08:08.577 [w1] thư ntf_bk_2_v1 → lan@labflow.example: đã gửi (lần 4, 302 ms)
04:08:09.290 [w1] thư ntf_bk_5_v1 → lan@labflow.example: đã gửi (lần 4, 302 ms)
04:08:11.936 [w1] thư ntf_bk_3_v1 → lan@labflow.example: đã gửi (lần 4, 302 ms)</div>
<p>p50 3,6 ms mỗi lượt đặt lúc bình thường và 6,4 ms khi nhà cung cấp sập, toàn bộ 201; mỗi email hỏng ba lần rồi đi ở lần thử thứ tư sau khi nhà cung cấp hồi lại.</p>

<h3>Giao ít nhất một lần, đúng một email</h3>
<p>Outbox bảo đảm “ít nhất một lần”, không bao giờ “đúng một lần”: nếu relay chết sau <code>XADD</code> nhưng trước <code>UPDATE … published_at</code>, dòng đó được phát lại. <code>RELAY_CRASH=0.15</code> (công tắc chỉ để học) giết relay ngẫu nhiên đúng chỗ đó:</p>
<pre><code class="language-bash">N=20 START_DAY=0 node perf/notify-cost.mjs</code></pre>
<div class="out">20 lượt POST /v2/bookings: p50 4.3 ms · chậm nhất 19.8 ms · mã 201 ×20</div>
<pre><code class="language-bash">sleep 2; grep 'relay "chết"' log-w12.log | cut -c1-90</code></pre>
<div class="out">04:09:58.114 [w1] relay "chết" sau XADD outbox #5 (RELAY_CRASH)</div>
<pre><code class="language-bash">psql postgres://labflow@localhost:55432/labflow_app -Atc "SELECT 'outbox: ' || count(*) || ' dòng, chưa phát ' || count(*) FILTER (WHERE published_at IS NULL) FROM outbox"</code></pre>
<div class="out">outbox: 20 dòng, chưa phát 16</div>
<pre><code class="language-bash">./restart-w.sh &gt; /dev/null; t0=$(date +%s); until [ "$(wc -l &lt; mail12.jsonl)" -ge 20 ] || [ $(( $(date +%s) - t0 )) -gt 90 ]; do sleep 1; done; echo "đủ thư sau khi khởi động lại: $(( $(date +%s) - t0 )) s"</code></pre>
<div class="out">đủ thư sau khi khởi động lại: 30 s</div>
<pre><code class="language-bash">psql postgres://labflow@localhost:55432/labflow_app -Atc "SELECT 'outbox: ' || count(*) || ' dòng, chưa phát ' || count(*) FILTER (WHERE published_at IS NULL) FROM outbox"</code></pre>
<div class="out">outbox: 20 dòng, chưa phát 0</div>
<pre><code class="language-bash">echo "sự kiện trong stream: $(redis-cli -p 6390 xlen labflow:events) · thư đã gửi: $(wc -l &lt; mail12.jsonl | tr -d ' ') · thư trùng: $(jq -r .id mail12.jsonl | sort | uniq -d | wc -l | tr -d ' ')"</code></pre>
<div class="out">sự kiện trong stream: 21 · thư đã gửi: 20 · thư trùng: 0</div>
<p>21 sự kiện cho 20 lượt đặt — một bản trùng — mà vẫn đúng 20 email. Ba lớp làm điều đó thành thật: id của job là <code>ntf_&lt;lượt đặt&gt;_v&lt;version&gt;</code>, nên BullMQ bỏ qua job thứ hai cùng id; worker gửi thư truyền chính id đó làm khoá idempotency cho nhà cung cấp; và khi khởi động, worker đọc lại những tin stream nó đã đọc nhưng chưa xác nhận (danh sách chờ của Redis) trước khi lấy tin mới. Các job worker chết đang giữ quay lại sau khi khoá của chúng hết hạn — đó là 30 s.</p>
<div class="pitfall"><p><strong>Bẫy — đọc nhóm consumer chỉ bằng <code>'&gt;'</code>.</strong> <code>'&gt;'</code> chỉ trả tin chưa từng được giao. Tin đã giao cho một consumer chết trước khi <code>XACK</code> nằm chờ mãi, trừ khi bạn đọc lại bằng id <code>0</code> (hoặc <code>XAUTOCLAIM</code> chúng từ consumer đã chết).</p></div>

<h3>Khi phỏng vấn / đi làm</h3>
<ul>
  <li><strong>“Gửi email khi có đơn hàng?”</strong> Không trong request: dòng outbox trong transaction của đơn, relay sang stream, hàng đợi có thử lại, khoá idempotency cho mỗi email. Đo được: đồng bộ thì +300 ms và lỗi 500, hàng đợi thì ~4 ms và không mất gì.</li>
  <li><strong>“Sự kiện có bị trùng không?”</strong> Có — ít nhất một lần; ta tạo ra một bản trùng bằng một lần sập và khử trùng bằng id job tất định.</li>
  <li><strong>“Cache có làm nhanh hơn không?”</strong> Từng request thì gần như không trên localhost; nó bỏ việc lặp lại cho CSDL lúc cao điểm, và không bao giờ làm sập được API.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
  <li>Chạy <code>N=20 node perf/event-lag.mjs</code> có và không có <code>RELAY_LISTEN=0</code> trên worker; giải thích con số ~1 s.</li>
  <li>Tạo tệp <code>tmp/mail-down</code>, đặt ba lượt, xoá tệp sau 10 s; theo dõi các lần thử lại trong log worker và đếm dòng trong <code>tmp/mail.jsonl</code>.</li>
  <li>Huỷ một lượt hai lần từ hai terminal cùng lúc; xác nhận một 200, một 409, và đúng một email huỷ.</li>
</ol>
<p><strong>Đạt khi:</strong> không request đặt phòng nào chờ email, không email nào mất qua sự cố, và không email nào gửi hai lần.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cache-aside (cache đứng bên)</span><span class="v">Đọc cache; trượt thì đọc CSDL rồi lấp vào cache.</span></div>
  <div class="kv"><span class="k">Dual write (ghi kép)</span><span class="v">Ghi vào hai hệ thống nối tiếp; hỏng ở giữa thì hai bên lệch nhau.</span></div>
  <div class="kv"><span class="k">Transactional outbox (hộp thư đi trong giao dịch)</span><span class="v">Sự kiện là một dòng ghi trong cùng transaction với dữ liệu nó mô tả.</span></div>
  <div class="kv"><span class="k">Relay (bộ chuyển tiếp)</span><span class="v">Tiến trình chuyển dòng outbox sang hệ thống tin nhắn rồi đánh dấu đã phát.</span></div>
  <div class="kv"><span class="k">LISTEN / NOTIFY (nghe / báo)</span><span class="v">Tín hiệu đánh thức có sẵn trong PostgreSQL, giao lúc commit.</span></div>
  <div class="kv"><span class="k">At-least-once delivery (giao ít nhất một lần)</span><span class="v">Không mất gì, nhưng có thể tới hai lần; bên nhận tự khử trùng.</span></div>
  <div class="kv"><span class="k">Pending entries list (danh sách chờ xác nhận)</span><span class="v">Tin stream đã giao cho một consumer mà chưa được xác nhận.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Danh sách phòng: cache-aside có jitter và single-flight; trúng cache ~2 ms như CSDL trên localhost — cái lợi là bớt truy vấn lúc cao điểm, và lỗi Redis coi như trượt.</li>
  <li>Dòng outbox + <code>pg_notify</code> trong transaction của lượt đặt; relay dùng <code>FOR UPDATE SKIP LOCKED</code>: độ trễ sự kiện p50 1,0 ms với NOTIFY, 946 ms khi hỏi vòng mỗi giây.</li>
  <li>Email trong request: p50 311 ms, và 5 × 500 cho 5 lượt đặt đã lưu khi nhà cung cấp hỏng.</li>
  <li>Email qua hàng đợi: p50 3,6 ms (6,4 ms trong sự cố), toàn bộ 201 khi nhà cung cấp sập, giao ở lần thử thứ tư sau khi hồi.</li>
  <li>Relay sập làm trùng một sự kiện (21 cho 20); id job và việc đọc lại danh sách chờ giữ đúng 20 email.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-13-1-vi-sao-hang-doi" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Khoá Node.js — 13.1: Request không phải chỗ để làm việc nặng</span><span class="lc-sub">Giống: việc chậm rời khỏi request, và đo để biết vì sao. Ở đây email đi sau transactional outbox và BullMQ: p50 của lượt đặt 311 ms → 3,6 ms, và mail sập không còn làm hỏng lượt đặt.</span></span>
  <span class="lc-cta">MỞ BÀI →</span>
</a>
<a class="link-card" href="/courses/background-jobs/learn?lessonSlug=job-6-2-outbox" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Đi sâu: Queues & Background Jobs — 6.2 Transactional outbox với Postgres</span><span class="lc-sub">Đang soạn: outbox, relay và consumer thành một mẫu riêng.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<a class="link-card" href="/courses/system-design/learn?lessonSlug=sysd-6-4-thong-bao" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Đi sâu: System Design thực chiến — 6.4 Hệ thông báo</span><span class="lc-sub">Đang soạn: trong app, push và email với tuỳ chọn, giờ yên lặng và gom lô.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-12-5-pubsub-streams" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Cơ chế bên dưới — Node.js bài 12.5: Pub/Sub hay Streams</span><span class="lc-sub">Vì sao relay của outbox ghi vào Stream chứ không phải một kênh, đo thật: thuê bao Pub/Sub offline mất tin (PUBLISH → 0), consumer group thu hồi job của worker sập (PENDING 2 → XAUTOCLAIM → 0), và stream không cắt thì phình mãi.</span></span>
  <span class="lc-cta">MỞ BÀI NODE.JS →</span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 12.6 ─────────────────────────── */
    {
      title: '12.6 — Re-measuring the load, and the final contract|||12.6 — Đo tải lại, và hợp đồng cuối cùng',
      slug: 'api-12-6-do-tai',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Cùng script Chương 8 trên bốn cấu hình: danh sách nhanh 1,4–2,2 lần, ghi 2,7–3,2 lần, danh sách phòng chậm 29–37%, hai instance trên một máy; OpenAPI 2.4.0: 0 thay đổi phá vỡ, drift 40/40 — và vì sao test hợp đồng không bắt được đặt trùng.',
      content: `${G126}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.6</span>
<h2>Re-measuring the load, and the final contract</h2>
<p class="lead">Moving to PostgreSQL added network hops, transactions and a user lookup to every request. Did LabFlow get slower? Opinions are cheap; Chapter 8's scripts are still in the project. This lesson runs them again on four setups, explains every surprise, and then proves the contract clients depend on did not move.</p>
<p><strong>What you can do after it:</strong> design a fair before/after load comparison on a shared machine, read autocannon output, explain why a database can beat an in-memory array, and publish a new API version with a machine-checked “no breaking change”. <strong>Why it matters:</strong> “we migrated and nothing regressed” is only believable with a table — and only honest with its error bars.</p>

<h3>Same scripts, four setups</h3>
<p>Each setup gets 10,000 seeded bookings and the two test-only limits from Chapter 8 (<code>LABFLOW_IP_LIMIT=1000000/60</code>, <code>LABFLOW_BOOKING_LIMIT=1000000/60</code>). Then the same five measurements: <code>autocannon -c 10 -d 10</code> on the labs list, on the bookings list as Lan (manager, all 10,000) and as An (her ~5,000), <code>perf/write-load.mjs</code> for POST, and <code>perf/mixed.mjs</code> for logins under load:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">RAM · 1 instance</span><span class="lz-lnote"><code>LABFLOW_STORE=memory</code> — the Chapter 8 design, today's code</span></div>
  <div class="lz-layer"><span class="lz-lname">PostgreSQL · 1 instance</span><span class="lz-lnote"><code>LABFLOW_STORE=pg LABFLOW_CACHE_MODE=none</code></span></div>
  <div class="lz-layer"><span class="lz-lname">PostgreSQL + Redis cache · 1 instance</span><span class="lz-lnote">the production configuration, measured directly on :4200</span></div>
  <div class="lz-layer"><span class="lz-lname">PostgreSQL + cache · 2 instances</span><span class="lz-lnote">through the health-checking proxy :8180, same laptop</span></div>
</div>
<p>The laptop is shared with other work, so the whole set ran three times and <code>uptime</code> was recorded around each round (1-minute load average): round 1 6.3 → 53.0, round 2 53.0 → 77.5, round 3 17.1 → 36.9. Round 2 started under heavy outside load and is left out. One raw result from round 1, before and after:</p>
<pre><code class="language-bash">npx autocannon -c 10 -d 10 -H "Authorization=Bearer $(cat ../lan.jwt)" "$BASE/v2/bookings?limit=20" 2&gt;&amp;1 | grep -E 'Stat|Latency|Req/Sec|requests in|non 2xx'</code></pre>
<div class="out">│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%   │ Avg     │ Stdev   │ Max   │
│ Latency │ 5 ms │ 6 ms │ 16 ms │ 20 ms │ 7.12 ms │ 3.62 ms │ 71 ms │
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5% │ Avg     │ Stdev  │ Min     │
│ Req/Sec   │ 1,152   │ 1,152   │ 1,272   │ 1,499 │ 1,317.5 │ 122.52 │ 1,152   │
13k requests in 10.01s, 105 MB read</div>
<pre><code class="language-bash">npx autocannon -c 10 -d 10 -H "Authorization=Bearer $(cat ../lan.jwt)" "$BASE/v2/bookings?limit=20" 2&gt;&amp;1 | grep -E 'Stat|Latency|Req/Sec|requests in|non 2xx'</code></pre>
<div class="out">│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%  │ Avg     │ Stdev   │ Max   │
│ Latency │ 2 ms │ 3 ms │ 5 ms  │ 6 ms │ 2.99 ms │ 0.99 ms │ 21 ms │
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg     │ Stdev  │ Min     │
│ Req/Sec   │ 2,533   │ 2,533   │ 2,899   │ 2,985   │ 2,865.2 │ 125.24 │ 2,532   │
29k requests in 10.01s, 229 MB read</div>

<h3>The table (average req/s, rounds 1 and 3)</h3>
<table>
<tr><th>Endpoint</th><th>Ch8 (RAM)</th><th>RAM today</th><th>PostgreSQL</th><th>PG + cache</th><th>PG + cache, 2 inst.</th></tr>
<tr><td>GET /v2/labs</td><td>9,414</td><td>7,851 · 8,091</td><td>5,549 · 5,093</td><td>6,000 · 5,317</td><td>6,029 · 4,218</td></tr>
<tr><td>GET /v2/bookings?limit=20 (Lan, all)</td><td>1,084</td><td>1,318 · 1,471</td><td>2,865 · 2,456</td><td>2,756 · 2,830</td><td>3,392 · 2,339</td></tr>
<tr><td>GET /v2/bookings?limit=20 (An, own)</td><td>—</td><td>1,734 · 1,910</td><td>2,798 · 2,593</td><td>2,879 · 3,016</td><td>3,333 · 2,733</td></tr>
<tr><td>POST /v2/bookings</td><td>—</td><td>644 · 621</td><td>2,028 · 1,705</td><td>2,131 · 2,196</td><td>1,239 · 1,070</td></tr>
<tr><td>POST /v2/auth/login (mixed.mjs)</td><td>113.6</td><td>119.8 · 113.8</td><td>111.4 · 99.1</td><td>124.6 · 110.4</td><td>70.7 · 145.4</td></tr>
</table>
<p>Read it slowly — three of the four results are not what most people predict:</p>
<ul>
  <li><strong>Lists got 1.4–2.2× faster.</strong> The RAM store filters and <em>sorts</em> 10,000 objects for every request; PostgreSQL walks 21 rows of an index (12.3). An index beats an array even across a network hop.</li>
  <li><strong>Writes got 2.7–3.2× faster.</strong> Each RAM booking scans the whole array twice (overlap, active count) — O(n), and n grows during the test. PostgreSQL answers both with indexes inside one transaction, outbox row included.</li>
  <li><strong>The labs list got slower</strong> (−29% to −37%): four rows, no sorting, so nothing beats memory. The Redis cache wins part of it back (+4% to +8%) — on one laptop a cache hit and a query cost about the same (12.5); its value is the load it keeps off PostgreSQL.</li>
  <li><strong>Two instances on one laptop are not reliably faster.</strong> They share the same CPU cores and add a proxy hop; the spread between rounds (2,339–3,392 for one endpoint) is larger than any gain. Instances add <em>availability</em> here; capacity comes from separate machines.</li>
  <li><strong>Logins did not change</strong> (~100–125/s): scrypt is CPU-bound by design (8.2). The 70.7 vs 145.4 for two instances is noise from the shared machine — report it as such.</li>
</ul>
<div class="pitfall"><p><strong>Trap — one run, one number.</strong> On this machine the same configuration measured 4,218 and 6,029 req/s. Run each setup at least twice, record the load average, discard runs taken under heavy outside load, and publish ranges.</p></div>

<h3>Where the time goes now</h3>
<p>The 12.3 <code>Server-Timing</code> breakdown names the next optimisation: <code>user</code>, the primary-key lookup of the caller on every request (0.42–0.77 ms), is now as large as the query itself. Two honest options: cache the user record for 30 s in the instance (a demoted user keeps rights for up to 30 s), or trust the role inside the JWT (up to 15 minutes). Measure, then choose — and write the choice in the README.</p>

<h3>The final contract: 2.4.0</h3>
<p>Chapter 12 changed what clients can <em>rely on</em>, not what they <em>send</em> or <em>receive</em>: every response now has <code>X-Request-Id</code>, and every data operation documents <code>503 DEPENDENCY_DOWN</code> with <code>Retry-After</code>. The Chapter 7 gate decides whether that is safe:</p>
<pre><code class="language-bash">npm run -s api:diff; echo "exit $?"</code></pre>
<div class="out">✓ không có thay đổi phá vỡ
exit 0</div>
<pre><code class="language-bash">diff -u openapi/openapi-v2.3.0.yaml openapi/openapi.yaml | grep -E '^\\+[^+]' | cut -c1-118 | sed -n '1,12p'</code></pre>
<div class="out">+  version: 2.4.0
+    2.4.0 (Chapter 12 — PostgreSQL in production): same resources, same shapes. What changed is what
+    clients can rely on: every response carries &#96;X-Request-Id&#96; (quote it when reporting a problem), and any
+    operation that reads or writes data may answer &#96;503 DEPENDENCY_DOWN&#96; with &#96;Retry-After&#96; while the
+    database is unreachable — retry with the same &#96;Idempotency-Key&#96;.
+        '503': { $ref: '#/components/responses/Unavailable' }
+        '503': { $ref: '#/components/responses/Unavailable' }
+        '503': { $ref: '#/components/responses/Unavailable' }
+        '503': { $ref: '#/components/responses/Unavailable' }
+        '503': { $ref: '#/components/responses/Unavailable' }
+        '503': { $ref: '#/components/responses/Unavailable' }
+            X-Request-Id: { $ref: '#/components/headers/X-Request-Id' }</div>
<pre><code class="language-bash">for f in openapi-v2.3.0 openapi; do echo "$f: $(grep -c "'503'" openapi/$f.yaml) thao tác khai 503"; done</code></pre>
<div class="out">openapi-v2.3.0: 4 thao tác khai 503
openapi: 16 thao tác khai 503</div>
<pre><code class="language-bash">npx redocly lint openapi/openapi.yaml 2&gt;&amp;1 | grep -E 'valid|error|warning'</code></pre>
<div class="out">validating openapi/openapi.yaml...
openapi/openapi.yaml: validated in 60ms
Woohoo! Your API description is valid. 🎉</div>
<p>A spec that lints and diffs cleanly can still lie about the server. The drift checker (7.2) sends 40 real requests and validates every answer against the document — on the PostgreSQL stack, then on two RAM instances:</p>
<pre><code class="language-bash">BASE=http://localhost:8180/v2 node openapi/check-drift.mjs &gt; ../drift.txt; echo "✓ $(grep -c '^✓' ../drift.txt) · ✗ $(grep -c '^✗' ../drift.txt)"; grep '^✗' ../drift.txt | head -5</code></pre>
<div class="out">✓ 40 · ✗ 0</div>
<pre><code class="language-bash">BASE=http://localhost:8180/v2 node openapi/check-drift.mjs &gt; ../drift-mem.txt; echo "✓ $(grep -c '^✓' ../drift-mem.txt) · ✗ $(grep -c '^✗' ../drift-mem.txt)"; grep '^✗' ../drift-mem.txt | head -5</code></pre>
<div class="out">✓ 40 · ✗ 0</div>
<p>Both 40/40. Now look at the same requests side by side (RAM left, PostgreSQL right):</p>
<pre><code class="language-bash">paste -d'|' &lt;(sed -n 8,16p drift-mem.txt) &lt;(sed -n 8,16p drift-pg.txt) | column -t -s'|'</code></pre>
<div class="out">✓ POST /bookings → 201              ✓ POST /bookings → 409
✓ POST /bookings → 400              ✓ POST /bookings → 400
✓ GET /bookings?limit=1 → 200       ✓ GET /bookings?limit=1 → 200
✓ GET /bookings/bk_1 → 200          ✓ GET /bookings/bk_1 → 200
✓ GET /bookings/bk_1 → 200          ✓ GET /bookings/bk_1 → 403
✓ GET /bookings/bk_1/receipt → 404  ✓ GET /bookings/bk_1/receipt → 404
✓ POST /bookings/bk_1/cancel → 403  ✓ POST /bookings/bk_1/cancel → 200
✓ POST /bookings/bk_1/cancel → 200  ✓ POST /bookings/bk_1/cancel → 409
✓ POST /devices/dev_1/issues → 201  ✓ POST /devices/dev_1/issues → 201</div>
<p>On RAM, Bình's booking for An's slot was accepted (201 — a double booking), Bình read “bk_1” (his own, on the other instance) and An's cancel was refused with 403. Every answer still matched the schema. <strong>A contract test checks shapes, not truth</strong> — which is why 12.3 added tests that check behaviour across instances.</p>
<a class="link-card" href="https://spec.openapis.org/oas/v3.1.0" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: OpenAPI Specification 3.1.0 (read 1 Nov 2026)</span><span class="lc-sub">The Responses Object maps each status code to a description, headers and content; documenting 503 and X-Request-Id is additive — the shapes of existing responses did not change.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>In interviews / at work</h3>
<ul>
  <li><strong>“Did moving to a database make it slower?”</strong> Measured: lists 1.4–2.2× faster, writes 2.7–3.2× faster, the tiny labs list about a third slower — and why each one moved.</li>
  <li><strong>“How do you know a load test is valid?”</strong> Same script, same data, several runs, load average recorded, ranges published, outliers explained.</li>
  <li><strong>“Is adding a 503 to the spec a breaking change?”</strong> Not for shapes; but clients must handle it — the description tells them to retry with the same Idempotency-Key.</li>
</ul>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok"><ol>
  <li>On your machine, run the five measurements for RAM and PostgreSQL twice each; fill the table with your numbers and your load averages.</li>
  <li>Cache the user lookup for 30 s in <code>requireAuth</code> on a branch; measure the bookings list again and write one sentence on the trade-off.</li>
  <li>Rename a response field in a copy of <code>openapi.yaml</code> and run <code>node openapi/diff.mjs</code>; confirm exit code 1.</li>
</ol>
<p><strong>Done when:</strong> your table has ranges, not single numbers, and you can explain the direction of every change.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Throughput</span><span class="v">Requests completed per second at a given concurrency.</span></div>
  <div class="kv"><span class="k">Load average</span><span class="v">How many processes wanted the CPU recently — high means your measurement competes.</span></div>
  <div class="kv"><span class="k">Regression</span><span class="v">A change that made a measured quality worse.</span></div>
  <div class="kv"><span class="k">Additive change</span><span class="v">New optional things in a contract; existing clients keep working.</span></div>
  <div class="kv"><span class="k">Drift check</span><span class="v">Real requests validated against the spec: does the document describe the server?</span></div>
  <div class="kv"><span class="k">Behaviour test</span><span class="v">A test of what happened (one booking, one 412), not only of the response shape.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Same Chapter 8 scripts, four setups, rounds 1 and 3 (round 2 discarded: it started at load average 53).</li>
  <li>PostgreSQL: lists 1.4–2.2× and writes 2.7–3.2× faster than RAM (indexes beat O(n) scans); labs list −29% to −37%, cache wins back 4–8%.</li>
  <li>Two instances on one laptop add availability, not capacity; logins stay CPU-bound at ~100–125/s.</li>
  <li>OpenAPI 2.4.0: X-Request-Id and 503 documented on 16 operations; 0 breaking changes, lint clean, drift 40/40.</li>
  <li>Contract checks pass even on a double-booking RAM pair — behaviour tests are what catch it.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.6</span>
<h2>Đo tải lại, và hợp đồng cuối cùng</h2>
<p class="lead">Chuyển sang PostgreSQL thêm vào mỗi request những chặng mạng, transaction và một lần tra người dùng. LabFlow có chậm đi không? Ý kiến thì rẻ; script của Chương 8 vẫn nằm trong dự án. Bài này chạy lại chúng trên bốn cấu hình, giải thích mọi điều bất ngờ, rồi chứng minh hợp đồng mà client dựa vào không xê dịch.</p>
<p><strong>Học xong bạn làm được:</strong> thiết kế một phép so trước/sau công bằng trên máy dùng chung, đọc output autocannon, giải thích vì sao một CSDL có thể thắng một mảng trong bộ nhớ, và phát hành phiên bản API mới kèm kết luận “không phá vỡ” do máy kiểm. <strong>Vì sao quan trọng:</strong> “bọn em chuyển CSDL mà không có gì chậm đi” chỉ đáng tin khi có bảng — và chỉ trung thực khi có cả biên độ dao động.</p>

<h3>Cùng script, bốn cấu hình</h3>
<p>Mỗi cấu hình có 10.000 lượt đặt mẫu và hai giới hạn chỉ-để-test của Chương 8 (<code>LABFLOW_IP_LIMIT=1000000/60</code>, <code>LABFLOW_BOOKING_LIMIT=1000000/60</code>). Rồi cùng năm phép đo: <code>autocannon -c 10 -d 10</code> trên danh sách phòng, trên danh sách lượt đặt với Cô Lan (quản lý, cả 10.000) và với An (~5.000 lượt của em), <code>perf/write-load.mjs</code> cho POST, và <code>perf/mixed.mjs</code> cho đăng nhập khi có tải:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">RAM · 1 instance</span><span class="lz-lnote"><code>LABFLOW_STORE=memory</code> — thiết kế của Chương 8, mã của hôm nay</span></div>
  <div class="lz-layer"><span class="lz-lname">PostgreSQL · 1 instance</span><span class="lz-lnote"><code>LABFLOW_STORE=pg LABFLOW_CACHE_MODE=none</code></span></div>
  <div class="lz-layer"><span class="lz-lname">PostgreSQL + cache Redis · 1 instance</span><span class="lz-lnote">cấu hình production, đo thẳng vào :4200</span></div>
  <div class="lz-layer"><span class="lz-lname">PostgreSQL + cache · 2 instance</span><span class="lz-lnote">qua proxy kiểm sức khoẻ :8180, cùng một máy</span></div>
</div>
<p>Máy dùng chung với việc khác, nên cả bộ chạy ba lượt và <code>uptime</code> được ghi trước sau mỗi lượt (load average 1 phút): lượt 1 6,3 → 53,0, lượt 2 53,0 → 77,5, lượt 3 17,1 → 36,9. Lượt 2 bắt đầu khi máy đang bị tải nặng từ bên ngoài nên bị loại. Một kết quả thô của lượt 1, trước và sau:</p>
<pre><code class="language-bash">npx autocannon -c 10 -d 10 -H "Authorization=Bearer $(cat ../lan.jwt)" "$BASE/v2/bookings?limit=20" 2&gt;&amp;1 | grep -E 'Stat|Latency|Req/Sec|requests in|non 2xx'</code></pre>
<div class="out">│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%   │ Avg     │ Stdev   │ Max   │
│ Latency │ 5 ms │ 6 ms │ 16 ms │ 20 ms │ 7.12 ms │ 3.62 ms │ 71 ms │
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5% │ Avg     │ Stdev  │ Min     │
│ Req/Sec   │ 1,152   │ 1,152   │ 1,272   │ 1,499 │ 1,317.5 │ 122.52 │ 1,152   │
13k requests in 10.01s, 105 MB read</div>
<pre><code class="language-bash">npx autocannon -c 10 -d 10 -H "Authorization=Bearer $(cat ../lan.jwt)" "$BASE/v2/bookings?limit=20" 2&gt;&amp;1 | grep -E 'Stat|Latency|Req/Sec|requests in|non 2xx'</code></pre>
<div class="out">│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%  │ Avg     │ Stdev   │ Max   │
│ Latency │ 2 ms │ 3 ms │ 5 ms  │ 6 ms │ 2.99 ms │ 0.99 ms │ 21 ms │
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg     │ Stdev  │ Min     │
│ Req/Sec   │ 2,533   │ 2,533   │ 2,899   │ 2,985   │ 2,865.2 │ 125.24 │ 2,532   │
29k requests in 10.01s, 229 MB read</div>

<h3>Bảng số (req/s trung bình, lượt 1 và 3)</h3>
<table>
<tr><th>Endpoint</th><th>Ch8 (RAM)</th><th>RAM hôm nay</th><th>PostgreSQL</th><th>PG + cache</th><th>PG + cache, 2 inst.</th></tr>
<tr><td>GET /v2/labs</td><td>9.414</td><td>7.851 · 8.091</td><td>5.549 · 5.093</td><td>6.000 · 5.317</td><td>6.029 · 4.218</td></tr>
<tr><td>GET /v2/bookings?limit=20 (Lan, tất cả)</td><td>1.084</td><td>1.318 · 1.471</td><td>2.865 · 2.456</td><td>2.756 · 2.830</td><td>3.392 · 2.339</td></tr>
<tr><td>GET /v2/bookings?limit=20 (An, của em)</td><td>—</td><td>1.734 · 1.910</td><td>2.798 · 2.593</td><td>2.879 · 3.016</td><td>3.333 · 2.733</td></tr>
<tr><td>POST /v2/bookings</td><td>—</td><td>644 · 621</td><td>2.028 · 1.705</td><td>2.131 · 2.196</td><td>1.239 · 1.070</td></tr>
<tr><td>POST /v2/auth/login (mixed.mjs)</td><td>113,6</td><td>119,8 · 113,8</td><td>111,4 · 99,1</td><td>124,6 · 110,4</td><td>70,7 · 145,4</td></tr>
</table>
<p>Đọc chậm — ba trong bốn kết quả không như phần đông dự đoán:</p>
<ul>
  <li><strong>Danh sách nhanh lên 1,4–2,2 lần.</strong> Kho RAM lọc và <em>sắp xếp</em> 10.000 object cho mỗi request; PostgreSQL đi 21 dòng của một index (12.3). Index thắng mảng kể cả khi phải qua mạng.</li>
  <li><strong>Ghi nhanh lên 2,7–3,2 lần.</strong> Mỗi lượt đặt trong RAM quét cả mảng hai lần (chồng giờ, đếm lượt còn hiệu lực) — O(n), và n lớn dần trong lúc đo. PostgreSQL trả lời cả hai bằng index trong một transaction, kể cả dòng outbox.</li>
  <li><strong>Danh sách phòng chậm đi</strong> (−29% tới −37%): bốn dòng, không sắp xếp, nên không gì thắng được bộ nhớ. Cache Redis lấy lại một phần (+4% tới +8%) — trên một máy, trúng cache và một truy vấn tốn ngang nhau (12.5); giá trị của nó là phần tải được giữ khỏi PostgreSQL.</li>
  <li><strong>Hai instance trên một máy không chắc nhanh hơn.</strong> Chúng dùng chung nhân CPU và thêm một chặng proxy; độ dao động giữa các lượt (2.339–3.392 cho một endpoint) lớn hơn mọi phần lợi. Ở đây instance thêm <em>tính sẵn sàng</em>; sức chứa đến từ những máy riêng.</li>
  <li><strong>Đăng nhập không đổi</strong> (~100–125/s): scrypt tốn CPU có chủ ý (8.2). Con số 70,7 so với 145,4 của hai instance là nhiễu của máy dùng chung — hãy báo đúng như thế.</li>
</ul>
<div class="pitfall"><p><strong>Bẫy — một lần chạy, một con số.</strong> Trên máy này cùng một cấu hình đo được 4.218 và 6.029 req/s. Chạy mỗi cấu hình ít nhất hai lần, ghi load average, bỏ lượt đo khi máy bị tải nặng từ bên ngoài, và công bố khoảng.</p></div>

<h3>Thời gian giờ đi đâu</h3>
<p>Bảng <code>Server-Timing</code> của bài 12.3 chỉ ra việc tối ưu tiếp theo: <code>user</code>, lần tra người gọi theo khoá chính ở mọi request (0,42–0,77 ms), giờ lớn ngang chính câu truy vấn. Hai lựa chọn trung thực: cache bản ghi người dùng 30 s trong instance (người bị hạ quyền còn giữ quyền tới 30 s), hoặc tin vai trò nằm trong JWT (tới 15 phút). Đo, rồi chọn — và ghi lựa chọn vào README.</p>

<h3>Hợp đồng cuối cùng: 2.4.0</h3>
<p>Chương 12 đổi thứ client có thể <em>dựa vào</em>, không đổi thứ họ <em>gửi</em> hay <em>nhận</em>: mọi câu trả lời giờ có <code>X-Request-Id</code>, và mọi thao tác dữ liệu khai <code>503 DEPENDENCY_DOWN</code> kèm <code>Retry-After</code>. Cổng kiểm của Chương 7 phán xem điều đó có an toàn không:</p>
<pre><code class="language-bash">npm run -s api:diff; echo "exit $?"</code></pre>
<div class="out">✓ không có thay đổi phá vỡ
exit 0</div>
<pre><code class="language-bash">diff -u openapi/openapi-v2.3.0.yaml openapi/openapi.yaml | grep -E '^\\+[^+]' | cut -c1-118 | sed -n '1,12p'</code></pre>
<div class="out">+  version: 2.4.0
+    2.4.0 (Chapter 12 — PostgreSQL in production): same resources, same shapes. What changed is what
+    clients can rely on: every response carries &#96;X-Request-Id&#96; (quote it when reporting a problem), and any
+    operation that reads or writes data may answer &#96;503 DEPENDENCY_DOWN&#96; with &#96;Retry-After&#96; while the
+    database is unreachable — retry with the same &#96;Idempotency-Key&#96;.
+        '503': { $ref: '#/components/responses/Unavailable' }
+        '503': { $ref: '#/components/responses/Unavailable' }
+        '503': { $ref: '#/components/responses/Unavailable' }
+        '503': { $ref: '#/components/responses/Unavailable' }
+        '503': { $ref: '#/components/responses/Unavailable' }
+        '503': { $ref: '#/components/responses/Unavailable' }
+            X-Request-Id: { $ref: '#/components/headers/X-Request-Id' }</div>
<pre><code class="language-bash">for f in openapi-v2.3.0 openapi; do echo "$f: $(grep -c "'503'" openapi/$f.yaml) thao tác khai 503"; done</code></pre>
<div class="out">openapi-v2.3.0: 4 thao tác khai 503
openapi: 16 thao tác khai 503</div>
<pre><code class="language-bash">npx redocly lint openapi/openapi.yaml 2&gt;&amp;1 | grep -E 'valid|error|warning'</code></pre>
<div class="out">validating openapi/openapi.yaml...
openapi/openapi.yaml: validated in 60ms
Woohoo! Your API description is valid. 🎉</div>
<p>Một tài liệu lint sạch và diff sạch vẫn có thể nói sai về server. Bộ kiểm trôi (drift, 7.2) gửi 40 request thật và kiểm từng câu trả lời theo tài liệu — trên cả bộ PostgreSQL, rồi trên hai instance RAM:</p>
<pre><code class="language-bash">BASE=http://localhost:8180/v2 node openapi/check-drift.mjs &gt; ../drift.txt; echo "✓ $(grep -c '^✓' ../drift.txt) · ✗ $(grep -c '^✗' ../drift.txt)"; grep '^✗' ../drift.txt | head -5</code></pre>
<div class="out">✓ 40 · ✗ 0</div>
<pre><code class="language-bash">BASE=http://localhost:8180/v2 node openapi/check-drift.mjs &gt; ../drift-mem.txt; echo "✓ $(grep -c '^✓' ../drift-mem.txt) · ✗ $(grep -c '^✗' ../drift-mem.txt)"; grep '^✗' ../drift-mem.txt | head -5</code></pre>
<div class="out">✓ 40 · ✗ 0</div>
<p>Cả hai 40/40. Giờ nhìn cùng các request đặt cạnh nhau (RAM bên trái, PostgreSQL bên phải):</p>
<pre><code class="language-bash">paste -d'|' &lt;(sed -n 8,16p drift-mem.txt) &lt;(sed -n 8,16p drift-pg.txt) | column -t -s'|'</code></pre>
<div class="out">✓ POST /bookings → 201              ✓ POST /bookings → 409
✓ POST /bookings → 400              ✓ POST /bookings → 400
✓ GET /bookings?limit=1 → 200       ✓ GET /bookings?limit=1 → 200
✓ GET /bookings/bk_1 → 200          ✓ GET /bookings/bk_1 → 200
✓ GET /bookings/bk_1 → 200          ✓ GET /bookings/bk_1 → 403
✓ GET /bookings/bk_1/receipt → 404  ✓ GET /bookings/bk_1/receipt → 404
✓ POST /bookings/bk_1/cancel → 403  ✓ POST /bookings/bk_1/cancel → 200
✓ POST /bookings/bk_1/cancel → 200  ✓ POST /bookings/bk_1/cancel → 409
✓ POST /devices/dev_1/issues → 201  ✓ POST /devices/dev_1/issues → 201</div>
<p>Với RAM, lượt đặt của Bình vào khung giờ của An được nhận (201 — đặt trùng), Bình đọc “bk_1” (của chính em, ở instance kia) và lệnh huỷ của An bị từ chối 403. Câu trả lời nào cũng khớp lược đồ. <strong>Test hợp đồng kiểm hình dạng, không kiểm sự thật</strong> — vì thế bài 12.3 mới thêm test kiểm hành vi qua nhiều instance.</p>
<a class="link-card" href="https://spec.openapis.org/oas/v3.1.0" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: OpenAPI Specification 3.1.0 (đọc ngày 01/11/2026)</span><span class="lc-sub">Responses Object gắn mỗi mã trạng thái với mô tả, header và nội dung; khai thêm 503 và X-Request-Id là thay đổi thêm vào — hình dạng các câu trả lời cũ không đổi.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Khi phỏng vấn / đi làm</h3>
<ul>
  <li><strong>“Chuyển sang CSDL có làm chậm đi không?”</strong> Đã đo: danh sách nhanh lên 1,4–2,2 lần, ghi nhanh lên 2,7–3,2 lần, danh sách phòng nhỏ xíu chậm đi chừng một phần ba — và vì sao mỗi thứ đổi như vậy.</li>
  <li><strong>“Làm sao biết một phép đo tải là hợp lệ?”</strong> Cùng script, cùng dữ liệu, nhiều lượt, có ghi load average, công bố khoảng, giải thích điểm lệch.</li>
  <li><strong>“Thêm 503 vào tài liệu có phá vỡ không?”</strong> Không phá hình dạng; nhưng client phải xử lý nó — phần mô tả dặn thử lại với cùng Idempotency-Key.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
  <li>Trên máy bạn, chạy năm phép đo cho RAM và PostgreSQL, mỗi cái hai lần; điền bảng bằng số của bạn và load average của bạn.</li>
  <li>Trên một nhánh, cache lần tra người dùng 30 s trong <code>requireAuth</code>; đo lại danh sách lượt đặt và viết một câu về sự đánh đổi.</li>
  <li>Đổi tên một trường của câu trả lời trong bản sao <code>openapi.yaml</code> rồi chạy <code>node openapi/diff.mjs</code>; xác nhận mã thoát 1.</li>
</ol>
<p><strong>Đạt khi:</strong> bảng của bạn có khoảng, không phải một con số, và bạn giải thích được hướng thay đổi của mọi ô.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Throughput (thông lượng)</span><span class="v">Số request hoàn thành mỗi giây ở một mức đồng thời.</span></div>
  <div class="kv"><span class="k">Load average (tải trung bình)</span><span class="v">Gần đây có bao nhiêu tiến trình muốn dùng CPU — cao nghĩa là phép đo của bạn phải tranh.</span></div>
  <div class="kv"><span class="k">Regression (thụt lùi)</span><span class="v">Thay đổi làm một chất lượng đo được tệ đi.</span></div>
  <div class="kv"><span class="k">Additive change (thay đổi thêm vào)</span><span class="v">Thêm thứ tuỳ chọn mới vào hợp đồng; client cũ vẫn chạy.</span></div>
  <div class="kv"><span class="k">Drift check (kiểm trôi)</span><span class="v">Request thật được kiểm theo tài liệu: tài liệu có mô tả đúng server không?</span></div>
  <div class="kv"><span class="k">Behaviour test (test hành vi)</span><span class="v">Test chuyện gì đã xảy ra (một lượt đặt, một 412), không chỉ hình dạng câu trả lời.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Cùng script Chương 8, bốn cấu hình, lượt 1 và 3 (lượt 2 bị loại: bắt đầu ở load average 53).</li>
  <li>PostgreSQL: danh sách nhanh 1,4–2,2 lần và ghi nhanh 2,7–3,2 lần so với RAM (index thắng quét O(n)); danh sách phòng −29% tới −37%, cache lấy lại 4–8%.</li>
  <li>Hai instance trên một máy thêm tính sẵn sàng, không thêm sức chứa; đăng nhập vẫn bị CPU giới hạn ở ~100–125/s.</li>
  <li>OpenAPI 2.4.0: khai X-Request-Id và 503 trên 16 thao tác; 0 thay đổi phá vỡ, lint sạch, drift 40/40.</li>
  <li>Kiểm hợp đồng vẫn qua trên cặp RAM đặt trùng — test hành vi mới bắt được nó.</li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── 12.7 ─────────────────────────── */
    {
      title: '12.7 — The deployment checklist: config, readiness, graceful shutdown, logs, backups, smoke test|||12.7 — Checklist triển khai: cấu hình, readiness, tắt êm, log, sao lưu, smoke test',
      slug: 'api-12-7-trien-khai',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Cấu hình hỏng sớm, /health và /ready khi CSDL sập, tắt êm đo được (622 × 502 ⇒ 0), bẫy kiểm sức khoẻ quá khắt khe, log JSON có X-Request-Id, /metrics cổng riêng, sao lưu + khôi phục thử, smoke test đầu-cuối.',
      content: `${G127}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.7</span>
<h2>The deployment checklist: config, readiness, graceful shutdown, logs, backups, smoke test</h2>
<p class="lead">Code that passes its tests can still fail on deploy day: a missing secret, traffic sent to an instance that is shutting down, a log where one request cannot be found, a backup nobody restored. This lesson turns each into a checklist item with a measured “before and after”.</p>
<p><strong>What you can do after it:</strong> make an instance refuse to start with bad config, separate liveness from readiness, shut down without dropping a request, emit logs and metrics an operator can use, prove a backup restores, and run a smoke test after every deploy. <strong>Why it matters:</strong> these seven items are what “production-ready” means in a code review — and most student projects have none of them.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · Config &amp; secrets</span><span class="lz-lnote">environment variables, checked at start; refuse to run if wrong</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · Health vs readiness</span><span class="lz-lnote">/health = process alive · /ready = can serve now (database reachable, not draining)</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · Graceful shutdown</span><span class="lz-lnote">SIGTERM ⇒ not ready ⇒ drain ⇒ finish in-flight ⇒ close pools ⇒ exit 0</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · Logs &amp; metrics</span><span class="lz-lnote">one JSON line per request with X-Request-Id · /metrics on a private port</span></div>
  <div class="lz-layer"><span class="lz-lname">5 · Migrations first</span><span class="lz-lnote">expand → deploy code → contract; never a breaking schema change in one step</span></div>
  <div class="lz-layer"><span class="lz-lname">6 · Backup + restore drill</span><span class="lz-lnote">a backup counts only after a restore was tested</span></div>
  <div class="lz-layer"><span class="lz-lname">7 · Smoke test</span><span class="lz-lnote">a real user's path through the public URL; red ⇒ roll back</span></div>
</div>

<h3>1 · Config: fail fast, list everything</h3>
<p>Config is “everything that is likely to vary between deploys”, kept in environment variables, never in the repository. <code>src/config.js</code> reads it once and <code>checkConfig()</code> refuses to start with a list of <em>all</em> problems — not the first one, so a deploy does not fail three times in a row:</p>
<pre><code class="language-bash">NODE_ENV=production node src/server.js; echo "exit $?"</code></pre>
<div class="out">LabFlow không khởi động — cấu hình thiếu/sai (3):
  • LABFLOW_JWT_SECRET (bí mật ký JWT, ≥ 32 byte ngẫu nhiên)
  • DATABASE_URL (postgres://user:pass@host:5432/db)
  • LABFLOW_REDIS (redis://host:6379 — rate limit, vé realtime, sự kiện, hàng đợi)
exit 1</div>
<pre><code class="language-bash">NODE_ENV=production LABFLOW_JWT_SECRET=$(openssl rand -hex 32) DATABASE_URL=postgres://labflow@localhost:55432/labflow_app LABFLOW_REDIS=redis://localhost:6390 LABFLOW_CHAOS=1 node src/server.js; echo "exit $?"</code></pre>
<div class="out">LabFlow không khởi động — cấu hình thiếu/sai (1):
  • LABFLOW_CHAOS là biến CHỈ để học — gỡ khỏi môi trường production
exit 1</div>
<p>The second run had every real variable plus one learning switch (<code>LABFLOW_CHAOS</code>) — refused too. Exiting before the port opens never hurts a user; failing on the first request does.</p>
<a class="link-card" href="https://12factor.net/config" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: The Twelve-Factor App — III. Config (read 1 Nov 2026)</span><span class="lc-sub">“The twelve-factor app stores config in environment variables.” Litmus test: the codebase “could be made open source at any moment, without compromising any credentials”.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>2 · Health is not readiness</h3>
<p><code>/health</code> answers “is the process alive?” — a supervisor restarts it if not. <code>/ready</code> answers “should traffic come here?” — it now pings PostgreSQL (1 s timeout), reports Redis, and says <code>draining</code> during shutdown. Stop the database under a running instance:</p>
<pre><code class="language-bash">pg_ctl -D pgdata stop -m fast &gt; /dev/null; sleep 1</code></pre>
<pre><code class="language-bash">curl -s -o /dev/null -w '/health %{http_code}\\n' http://localhost:4200/health; curl -s -w '\\n' http://localhost:4200/ready</code></pre>
<div class="out">/health 200
{
  "status": "degraded",
  "store": "pg",
  "database": "down",
  "redis": "up"
}</div>
<pre><code class="language-bash">curl -s -o /dev/null -w 'GET /v2/labs: %{http_code} cache=%header{labflow-cache}\\n' http://localhost:4200/v2/labs</code></pre>
<div class="out">GET /v2/labs: 200 cache=HIT</div>
<pre><code class="language-bash">curl -s -i http://localhost:4200/v2/bookings \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"labId":"lab_1","period":{"start":"2030-02-01T08:00:00+07:00","end":"2030-02-01T09:00:00+07:00"}}' \\
  -H 'X-Request-Id: req-db-down' | grep -iE '^(HTTP|Retry-After)|"code"'</code></pre>
<div class="out">HTTP/1.1 503 Service Unavailable
Retry-After: 5
  "code": "DEPENDENCY_DOWN"</div>
<p>Alive (200) but not ready (503) — a restart would not help; labs still came from the Redis cache; the booking got <code>503 DEPENDENCY_DOWN</code> + <code>Retry-After: 5</code>, not a 500; the pool's dead idle connections did not kill the process (the <code>'error'</code> listener of 12.3). When the database came back, <code>/ready</code> returned 200 within two seconds and the same booking got 201 — no restart.</p>

<h3>3 · Graceful shutdown, measured</h3>
<p>Every deploy stops the old process with SIGTERM; Kubernetes, Docker and systemd all do, then SIGKILL after a grace period (30 s by default in Kubernetes). The order inside <code>src/server.js</code>:</p>
<pre><code class="language-javascript">lifecycle.draining = true;                       // 1) /ready ⇒ 503: the load balancer stops sending NEW requests
await sleep(SHUTDOWN_DRAIN_MS);                  // 2) …but it checks every few seconds — keep serving meanwhile
lifecycle.emit('shutdown'); closeAllWs(wss);     // 3) SSE streams end, WebSockets get 1012: reconnect elsewhere
await new Promise((r) =&gt; { server.close(r); server.closeIdleConnections(); });   // 4) finish in-flight, accept nothing new
await store.close();                             // 5) close the pool, exit 0 (a timer forces it after SHUTDOWN_GRACE_MS)</code></pre>
<p>The test: 20 clients loop on <code>GET /v2/bookings</code> through the health-checking proxy; after 2 s instance A gets SIGTERM. First with <code>LABFLOW_SHUTDOWN=abrupt</code> (exit at once, as if the code above did not exist), then with a 1.5 s drain:</p>
<pre><code class="language-bash">KILL_PID=$(lsof -ti tcp:4200 -sTCP:LISTEN) AT=2000 SECONDS=6 node perf/shutdown.mjs</code></pre>
<div class="out">  2006 ms: gửi SIGTERM tới PID 3450
trước 200: 2419 · sau SIGTERM 200: 4505 · sau SIGTERM 502: 622 · sau SIGTERM UND_ERR_SOCKET: 2</div>
<pre><code class="language-bash">sleep 1; grep -h -E 'shutdown|ngừng gửi' log-a12.log log-p12.log | cut -c1-130</code></pre>
<div class="out">   6.5 s  :4200 không trả lời (ECONNREFUSED) 2 lần liền ⇒ ngừng gửi</div>
<pre><code class="language-bash">KILL_PID=$(lsof -ti tcp:4200 -sTCP:LISTEN) AT=2000 SECONDS=6 node perf/shutdown.mjs</code></pre>
<div class="out">  2000 ms: gửi SIGTERM tới PID 3809
trước 200: 3134 · sau SIGTERM 200: 8493</div>
<pre><code class="language-bash">sleep 1; grep -h -E 'shutdown|ngừng gửi' log-a12.log log-p12.log | cut -c1-130</code></pre>
<div class="out">{"time":"2026-11-01T04:44:53.083Z","level":"info","msg":"shutdown","instance":"A","signal":"SIGTERM","drainMs":1500}
{"time":"2026-11-01T04:44:54.584Z","level":"info","msg":"shutdown complete","instance":"A","ms":1501}
   6.5 s  :4200 KHÔNG sẵn sàng (/ready 503) 2 lần liền ⇒ ngừng gửi</div>
<p>Abrupt: 622 × <code>502</code> and 2 broken sockets — users in flight plus everyone sent to A before the proxy noticed. Graceful: zero errors; A said “not ready”, the proxy removed it, A finished its work and exited 1.5 s after the signal.</p>
<div class="pitfall"><p><strong>Trap — a health check that is too strict.</strong> Our first proxy dropped an instance after <em>one</em> check slower than 400 ms. Under load B's <code>/ready</code> was slower, so B was removed in the first half-second, then A was killed — and the proxy answered <code>503</code> 64,926 times in four seconds. Real load balancers wait seconds and want several failures in a row (nginx <code>max_fails</code>, HAProxy <code>fall</code>); ours now uses 1 s and two.</p></div>
<a class="link-card" href="https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: Kubernetes — Termination of Pods (read 1 Nov 2026)</span><span class="lc-sub">First TERM; “the default terminationGracePeriodSeconds setting is 30 seconds”; terminating endpoints are not ready; then SIGKILL.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>4 · Logs and metrics an operator can use</h3>
<p>With <code>LABFLOW_LOG_FORMAT=json</code> (the production default) every request is one JSON line; <code>X-Request-Id</code> is accepted from the proxy or generated, and returned to the client — the id a user quotes in a bug report:</p>
<pre><code class="language-bash">curl -s -o /dev/null -D - http://localhost:4200/v2/bookings?limit=2 \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'X-Request-Id: smoke-7f3a' | grep -i '^x-request-id'</code></pre>
<div class="out">X-Request-Id: smoke-7f3a</div>
<pre><code class="language-bash">grep '"smoke-7f3a"' log-a12.log | jq -c .</code></pre>
<div class="out">{"time":"2026-11-01T04:47:24.068Z","level":"info","msg":"request","instance":"A","reqId":"smoke-7f3a","method":"GET","path":"/v2/bookings","route":"/v2/bookings","status":200,"ms":8.1,"userId":"usr_3"}</div>
<p>Never log the Authorization header, passwords, tokens, connection strings or personal data (OWASP). Metrics — counters and histograms in Prometheus text format — live on a <strong>separate port</strong> (<code>METRICS_PORT</code>, bound to 127.0.0.1); the public port answers 404:</p>
<pre><code class="language-bash">curl -s http://127.0.0.1:9464/metrics | grep -E 'bookings",(status|le="0.01")|_count.*bookings|pg_pool|event_loop'</code></pre>
<div class="out">labflow_http_requests_total{method="GET",route="/v2/bookings",status="200"} 1
labflow_http_request_duration_seconds_bucket{method="GET",route="/v2/bookings",le="0.01"} 1
labflow_http_request_duration_seconds_count{method="GET",route="/v2/bookings"} 1
# HELP labflow_pg_pool_connections Connections in this instance pool
# TYPE labflow_pg_pool_connections gauge
labflow_pg_pool_connections{state="total"} 1
labflow_pg_pool_connections{state="idle"} 1
labflow_pg_pool_connections{state="waiting"} 0
labflow_pg_pool_max 10
# HELP labflow_event_loop_delay_p99_seconds Event loop delay p99 since start
# TYPE labflow_event_loop_delay_p99_seconds gauge
labflow_event_loop_delay_p99_seconds 0.013451</div>
<pre><code class="language-bash">curl -s -o /dev/null -w 'cổng công khai /metrics: %{http_code}\\n' http://localhost:4200/metrics</code></pre>
<div class="out">cổng công khai /metrics: 404</div>
<p>Labels use the route template (<code>/v2/bookings/:id</code>), never the real id: Prometheus's own naming guide warns that every label combination is a new time series — no user ids, no unbounded values.</p>
<h3>5 · Migrations go first</h3>
<p>Deploy-day order: backup ⇒ <code>npm run db:migrate</code> (one runner, advisory lock) ⇒ start new instances ⇒ smoke test ⇒ drain the old ones. Schema changes that old code cannot survive go in two releases — expand/contract, lesson 12.2.</p>

<h3>6 · A backup counts only after a restore</h3>
<p><code>ops/backup.sh</code> dumps with <code>pg_dump --format=custom</code>, restores into a scratch database and compares row counts:</p>
<pre><code class="language-bash">DATABASE_URL=postgres://labflow@localhost:55432/labflow_app bash ops/backup.sh ../backups</code></pre>
<div class="out">dump: ../backups/labflow-20261101T044512Z.dump (148K, 1 s)
NOTICE:  database "labflow_restore_check" does not exist, skipping
restore: 0 s
gốc:       users=3 bookings=10000 outbox=0 migrations=4
khôi phục: users=3 bookings=10000 outbox=0 migrations=4
KHỚP — bản sao lưu dùng được</div>
<p>148 KB and about a second for 10,000 bookings. <code>pg_dump</code> takes a consistent snapshot without blocking writers, but a nightly dump can lose a day — PostgreSQL <a href="/courses/postgresql/learn?lessonSlug=postgresql-15-1-pg-dump">15.1</a> covers pg_dump in depth, <a href="/courses/postgresql/learn?lessonSlug=postgresql-15-2-wal-pitr">15.2</a> WAL archiving and point-in-time recovery.</p>

<h3>7 · The smoke test</h3>
<p><code>ops/smoke.mjs</code> walks one real user's path through the public URL — health, readiness, the contract URL, login, an idempotent booking and its replay, a read that may hit the other instance, the cancel, both events over SSE and both emails — and cleans up after itself:</p>
<pre><code class="language-bash">MAIL_LOG=$PWD/../mail12.jsonl node ops/smoke.mjs http://localhost:8180</code></pre>
<div class="out">✓ GET /health                                         31 ms
✓ GET /ready (CSDL + Redis)                            4 ms  store=pg database=up redis=up
✓ GET /openapi.yaml                                    2 ms  version 2.4.0
✓ GET /v2/labs                                         6 ms  3 phòng
✓ POST /v2/auth/login                                 41 ms
✓ POST /v2/realtime/tickets + mở SSE                 310 ms
✓ POST /v2/bookings (Idempotency-Key)                 16 ms  bk_10001
✓ POST lại cùng khoá ⇒ phát lại, không tạo thêm        6 ms
✓ GET /v2/bookings/{id} (đọc lại, có thể ở instance khác)     3 ms
✓ POST /v2/bookings/{id}/cancel (tự dọn)               4 ms
✓ SSE nhận created + cancelled của lượt này           54 ms  created → cancelled
✓ email thông báo đã đi (MAIL_LOG)                   304 ms  ntf_bk_10001_v1, ntf_bk_10001_v2
SMOKE ĐẠT: mọi bước xanh</div>
<p>Exit code 0 or 1: a deploy script runs it after starting new instances and rolls back on red.</p>

<h3>In interviews / at work</h3>
<ul>
  <li><strong>“Liveness vs readiness?”</strong> Alive = do not restart me; ready = send me traffic. A database outage makes LabFlow alive but not ready — restarting would not help.</li>
  <li><strong>“How do you deploy without errors?”</strong> Readiness goes 503 on SIGTERM, a drain longer than the load balancer's check interval, server.close for in-flight requests — measured 622 errors ⇒ 0.</li>
</ul>

<h3>🧪 Practice (40 min)</h3>
<div class="callout ok"><ol>
  <li>Start with <code>NODE_ENV=production</code> and nothing set; add variables one by one until it starts. Then set <code>LABFLOW_JWT_SECRET=short</code> and read the message.</li>
  <li>Run the shutdown test with <code>SHUTDOWN_DRAIN_MS=0</code>; explain any errors with the proxy's check interval.</li>
  <li>Run <code>bash ops/backup.sh</code>, then drop a table in the scratch copy and show the script says LỆCH.</li>
</ol>
<p><strong>Done when:</strong> you can recite the deploy-day order (backup, migrate, start, smoke, drain) and show a measured run for each step.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Fail fast</span><span class="v">Refuse to start with invalid config instead of failing on the first request.</span></div>
  <div class="kv"><span class="k">Liveness / readiness</span><span class="v">Alive (do not restart) vs able to serve now (send traffic).</span></div>
  <div class="kv"><span class="k">Draining</span><span class="v">Not accepting new work while finishing what is in flight.</span></div>
  <div class="kv"><span class="k">Correlation id</span><span class="v"><code>X-Request-Id</code>: one id that follows a request through logs and services.</span></div>
  <div class="kv"><span class="k">Cardinality</span><span class="v">How many distinct label values a metric has; unbounded ⇒ unbounded memory.</span></div>
  <div class="kv"><span class="k">Expand / contract</span><span class="v">Schema change in two releases so old and new code both work in between.</span></div>
  <div class="kv"><span class="k">Restore drill</span><span class="v">Restoring a backup on purpose to prove it works.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Config in environment variables, validated at start: all problems listed, exit 1, learning switches refused in production.</li>
  <li>Database down: /health 200, /ready 503, writes 503 + Retry-After, cached reads still 200, process survives; back ⇒ 201.</li>
  <li>Graceful shutdown under load: abrupt 622 × 502 ⇒ graceful 0 errors; health checks need seconds and repeated failures.</li>
  <li>JSON logs with X-Request-Id; Prometheus metrics on a private port with route-template labels.</li>
  <li>Expand/contract migrations first; backups proven by restore; a smoke test of 12 steps decides every deploy.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/deploy-vps/learn?lessonSlug=deploy-3-2-tat-tu-te" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Deploy to a VPS — 3.2: Graceful shutdown, and the drain I got wrong</span><span class="lc-sub">SIGTERM vs SIGKILL, idle connections, and how long systemd or Docker waits.</span></span>
  <span class="lc-cta">OPEN LESSON →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/observability-monitoring/learn?lessonSlug=obs-8-1-bon-luot-tham-do" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Observability — 8.1: Four probes, four different questions</span><span class="lc-sub">Liveness, readiness, startup, deep checks — and what no probe may do.</span></span>
  <span class="lc-cta">OPEN LESSON →</span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.7</span>
<h2>Checklist triển khai: cấu hình, readiness, tắt êm, log, sao lưu, smoke test</h2>
<p class="lead">Mã qua hết test vẫn có thể hỏng vào ngày triển khai: thiếu một bí mật, request bị gửi tới instance đang tắt, một request không tìm thấy trong log, một bản sao lưu chưa ai từng khôi phục. Bài này biến mỗi thứ thành một mục checklist có số đo “trước và sau”.</p>
<p><strong>Học xong bạn làm được:</strong> làm instance từ chối khởi động khi cấu hình sai, tách liveness khỏi readiness, tắt mà không rơi request nào, xuất log và metrics người vận hành dùng được, chứng minh bản sao lưu khôi phục được, và chạy smoke test sau mỗi lần triển khai. <strong>Vì sao quan trọng:</strong> bảy mục này chính là nghĩa của “sẵn sàng cho production” khi review mã — và phần lớn đồ án sinh viên không có mục nào.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · Cấu hình &amp; bí mật</span><span class="lz-lnote">biến môi trường, kiểm lúc khởi động; sai thì từ chối chạy</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · Health và readiness</span><span class="lz-lnote">/health = tiến trình còn sống · /ready = phục vụ được ngay (CSDL tới được, không đang tắt)</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · Tắt êm</span><span class="lz-lnote">SIGTERM ⇒ hết sẵn sàng ⇒ xả ⇒ làm nốt request dở ⇒ đóng pool ⇒ thoát 0</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · Log &amp; metrics</span><span class="lz-lnote">mỗi request một dòng JSON có X-Request-Id · /metrics ở cổng riêng</span></div>
  <div class="lz-layer"><span class="lz-lname">5 · Migration đi trước</span><span class="lz-lnote">mở rộng ⇒ triển khai mã ⇒ thu gọn; không đổi lược đồ phá vỡ trong một bước</span></div>
  <div class="lz-layer"><span class="lz-lname">6 · Sao lưu + diễn tập khôi phục</span><span class="lz-lnote">bản sao lưu chỉ tính khi đã thử khôi phục</span></div>
  <div class="lz-layer"><span class="lz-lname">7 · Smoke test</span><span class="lz-lnote">đi đúng đường của người dùng thật qua URL công khai; đỏ ⇒ quay lui</span></div>
</div>

<h3>1 · Cấu hình: hỏng sớm, liệt kê đủ</h3>
<p>Cấu hình là “mọi thứ có thể khác nhau giữa các lần triển khai”, để trong biến môi trường, không bao giờ trong kho mã. <code>src/config.js</code> đọc một lần và <code>checkConfig()</code> từ chối khởi động kèm danh sách <em>mọi</em> vấn đề — không chỉ cái đầu tiên, để một lần triển khai không hỏng ba lần liền:</p>
<pre><code class="language-bash">NODE_ENV=production node src/server.js; echo "exit $?"</code></pre>
<div class="out">LabFlow không khởi động — cấu hình thiếu/sai (3):
  • LABFLOW_JWT_SECRET (bí mật ký JWT, ≥ 32 byte ngẫu nhiên)
  • DATABASE_URL (postgres://user:pass@host:5432/db)
  • LABFLOW_REDIS (redis://host:6379 — rate limit, vé realtime, sự kiện, hàng đợi)
exit 1</div>
<pre><code class="language-bash">NODE_ENV=production LABFLOW_JWT_SECRET=$(openssl rand -hex 32) DATABASE_URL=postgres://labflow@localhost:55432/labflow_app LABFLOW_REDIS=redis://localhost:6390 LABFLOW_CHAOS=1 node src/server.js; echo "exit $?"</code></pre>
<div class="out">LabFlow không khởi động — cấu hình thiếu/sai (1):
  • LABFLOW_CHAOS là biến CHỈ để học — gỡ khỏi môi trường production
exit 1</div>
<p>Lần chạy thứ hai có đủ biến thật cộng thêm một công tắc chỉ-để-học (<code>LABFLOW_CHAOS</code>) — cũng bị từ chối. Thoát trước khi mở cổng không hại ai; hỏng ở request đầu tiên thì có.</p>
<a class="link-card" href="https://12factor.net/config" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: The Twelve-Factor App — III. Config (đọc ngày 01/11/2026)</span><span class="lc-sub">“Ứng dụng twelve-factor lưu cấu hình trong biến môi trường.” Phép thử: kho mã “có thể công khai mã nguồn bất cứ lúc nào mà không lộ thông tin đăng nhập nào”.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>2 · Health không phải readiness</h3>
<p><code>/health</code> trả lời “tiến trình còn sống không?” — trình giám sát khởi động lại nếu không. <code>/ready</code> trả lời “có nên gửi request tới đây không?” — giờ nó ping PostgreSQL (thời hạn 1 s), báo tình trạng Redis, và nói <code>draining</code> khi đang tắt. Tắt CSDL dưới một instance đang chạy:</p>
<pre><code class="language-bash">pg_ctl -D pgdata stop -m fast &gt; /dev/null; sleep 1</code></pre>
<pre><code class="language-bash">curl -s -o /dev/null -w '/health %{http_code}\\n' http://localhost:4200/health; curl -s -w '\\n' http://localhost:4200/ready</code></pre>
<div class="out">/health 200
{
  "status": "degraded",
  "store": "pg",
  "database": "down",
  "redis": "up"
}</div>
<pre><code class="language-bash">curl -s -o /dev/null -w 'GET /v2/labs: %{http_code} cache=%header{labflow-cache}\\n' http://localhost:4200/v2/labs</code></pre>
<div class="out">GET /v2/labs: 200 cache=HIT</div>
<pre><code class="language-bash">curl -s -i http://localhost:4200/v2/bookings \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"labId":"lab_1","period":{"start":"2030-02-01T08:00:00+07:00","end":"2030-02-01T09:00:00+07:00"}}' \\
  -H 'X-Request-Id: req-db-down' | grep -iE '^(HTTP|Retry-After)|"code"'</code></pre>
<div class="out">HTTP/1.1 503 Service Unavailable
Retry-After: 5
  "code": "DEPENDENCY_DOWN"</div>
<p>Còn sống (200) nhưng không sẵn sàng (503) — khởi động lại cũng vô ích; danh sách phòng vẫn trả từ cache Redis; lượt đặt nhận <code>503 DEPENDENCY_DOWN</code> + <code>Retry-After: 5</code>, không phải 500; kết nối rảnh trong pool chết mà tiến trình không chết (trình nghe <code>'error'</code> của bài 12.3). Khi CSDL trở lại, <code>/ready</code> trả 200 trong vòng hai giây và chính lượt đặt đó được 201 — không khởi động lại.</p>

<h3>3 · Tắt êm, có số đo</h3>
<p>Mỗi lần triển khai dừng tiến trình cũ bằng SIGTERM; Kubernetes, Docker và systemd đều vậy, rồi SIGKILL sau một thời gian ân hạn (mặc định 30 s ở Kubernetes). Thứ tự trong <code>src/server.js</code>:</p>
<pre><code class="language-javascript">lifecycle.draining = true;                       // 1) /ready ⇒ 503: load balancer ngừng gửi request MỚI
await sleep(SHUTDOWN_DRAIN_MS);                  // 2) …nhưng nó vài giây mới kiểm một lần — vẫn phục vụ trong lúc chờ
lifecycle.emit('shutdown'); closeAllWs(wss);     // 3) SSE kết thúc, WebSocket nhận 1012: nối lại chỗ khác
await new Promise((r) =&gt; { server.close(r); server.closeIdleConnections(); });   // 4) làm nốt request dở, không nhận mới
await store.close();                             // 5) đóng pool, thoát 0 (quá SHUTDOWN_GRACE_MS thì hẹn giờ cắt)</code></pre>
<p>Phép thử: 20 client gọi liên tục <code>GET /v2/bookings</code> qua proxy có kiểm sức khoẻ; sau 2 s instance A nhận SIGTERM. Trước với <code>LABFLOW_SHUTDOWN=abrupt</code> (thoát ngay, như thể đoạn mã trên không tồn tại), sau với thời gian xả 1,5 s:</p>
<pre><code class="language-bash">KILL_PID=$(lsof -ti tcp:4200 -sTCP:LISTEN) AT=2000 SECONDS=6 node perf/shutdown.mjs</code></pre>
<div class="out">  2006 ms: gửi SIGTERM tới PID 3450
trước 200: 2419 · sau SIGTERM 200: 4505 · sau SIGTERM 502: 622 · sau SIGTERM UND_ERR_SOCKET: 2</div>
<pre><code class="language-bash">sleep 1; grep -h -E 'shutdown|ngừng gửi' log-a12.log log-p12.log | cut -c1-130</code></pre>
<div class="out">   6.5 s  :4200 không trả lời (ECONNREFUSED) 2 lần liền ⇒ ngừng gửi</div>
<pre><code class="language-bash">KILL_PID=$(lsof -ti tcp:4200 -sTCP:LISTEN) AT=2000 SECONDS=6 node perf/shutdown.mjs</code></pre>
<div class="out">  2000 ms: gửi SIGTERM tới PID 3809
trước 200: 3134 · sau SIGTERM 200: 8493</div>
<pre><code class="language-bash">sleep 1; grep -h -E 'shutdown|ngừng gửi' log-a12.log log-p12.log | cut -c1-130</code></pre>
<div class="out">{"time":"2026-11-01T04:44:53.083Z","level":"info","msg":"shutdown","instance":"A","signal":"SIGTERM","drainMs":1500}
{"time":"2026-11-01T04:44:54.584Z","level":"info","msg":"shutdown complete","instance":"A","ms":1501}
   6.5 s  :4200 KHÔNG sẵn sàng (/ready 503) 2 lần liền ⇒ ngừng gửi</div>
<p>Thoát ngay: 622 × <code>502</code> và 2 socket gãy — người đang chờ cộng mọi người bị gửi tới A trước khi proxy kịp biết. Tắt êm: không lỗi nào; A báo “chưa sẵn sàng”, proxy gỡ nó ra, A làm nốt việc rồi thoát 1,5 s sau tín hiệu.</p>
<div class="pitfall"><p><strong>Bẫy — kiểm sức khoẻ quá khắt khe.</strong> Proxy đầu tiên của ta gỡ một instance chỉ sau <em>một</em> lần kiểm chậm hơn 400 ms. Khi có tải, <code>/ready</code> của B chậm hơn thế, nên B bị gỡ ngay nửa giây đầu, rồi A bị tắt — và proxy trả <code>503</code> 64.926 lần trong bốn giây. Load balancer thật chờ tính bằng giây và cần nhiều lần trượt liên tiếp (nginx <code>max_fails</code>, HAProxy <code>fall</code>); proxy của ta giờ chờ 1 s và cần hai lần.</p></div>
<a class="link-card" href="https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: Kubernetes — Termination of Pods (đọc ngày 01/11/2026)</span><span class="lc-sub">Gửi TERM trước; “terminationGracePeriodSeconds mặc định là 30 giây”; endpoint đang tắt không còn sẵn sàng; rồi SIGKILL.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>4 · Log và metrics người vận hành dùng được</h3>
<p>Với <code>LABFLOW_LOG_FORMAT=json</code> (mặc định ở production) mỗi request là một dòng JSON; <code>X-Request-Id</code> nhận từ proxy hoặc tự sinh, và trả lại cho client — chính mã người dùng đọc lên khi báo lỗi:</p>
<pre><code class="language-bash">curl -s -o /dev/null -D - http://localhost:4200/v2/bookings?limit=2 \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'X-Request-Id: smoke-7f3a' | grep -i '^x-request-id'</code></pre>
<div class="out">X-Request-Id: smoke-7f3a</div>
<pre><code class="language-bash">grep '"smoke-7f3a"' log-a12.log | jq -c .</code></pre>
<div class="out">{"time":"2026-11-01T04:47:24.068Z","level":"info","msg":"request","instance":"A","reqId":"smoke-7f3a","method":"GET","path":"/v2/bookings","route":"/v2/bookings","status":200,"ms":8.1,"userId":"usr_3"}</div>
<p>Không bao giờ ghi vào log header Authorization, mật khẩu, token, chuỗi kết nối hay dữ liệu cá nhân (OWASP). Metrics — bộ đếm và histogram dạng văn bản của Prometheus — nằm ở <strong>cổng riêng</strong> (<code>METRICS_PORT</code>, chỉ nghe 127.0.0.1); cổng công khai trả 404:</p>
<pre><code class="language-bash">curl -s http://127.0.0.1:9464/metrics | grep -E 'bookings",(status|le="0.01")|_count.*bookings|pg_pool|event_loop'</code></pre>
<div class="out">labflow_http_requests_total{method="GET",route="/v2/bookings",status="200"} 1
labflow_http_request_duration_seconds_bucket{method="GET",route="/v2/bookings",le="0.01"} 1
labflow_http_request_duration_seconds_count{method="GET",route="/v2/bookings"} 1
# HELP labflow_pg_pool_connections Connections in this instance pool
# TYPE labflow_pg_pool_connections gauge
labflow_pg_pool_connections{state="total"} 1
labflow_pg_pool_connections{state="idle"} 1
labflow_pg_pool_connections{state="waiting"} 0
labflow_pg_pool_max 10
# HELP labflow_event_loop_delay_p99_seconds Event loop delay p99 since start
# TYPE labflow_event_loop_delay_p99_seconds gauge
labflow_event_loop_delay_p99_seconds 0.013451</div>
<pre><code class="language-bash">curl -s -o /dev/null -w 'cổng công khai /metrics: %{http_code}\\n' http://localhost:4200/metrics</code></pre>
<div class="out">cổng công khai /metrics: 404</div>
<p>Nhãn dùng mẫu route (<code>/v2/bookings/:id</code>), không bao giờ dùng id thật: chính hướng dẫn đặt tên của Prometheus cảnh báo mỗi tổ hợp nhãn là một chuỗi thời gian mới — không id người dùng, không giá trị không giới hạn.</p>
<h3>5 · Migration đi trước</h3>
<p>Thứ tự ngày triển khai: sao lưu ⇒ <code>npm run db:migrate</code> (một bộ chạy, advisory lock) ⇒ chạy instance mới ⇒ smoke test ⇒ xả instance cũ. Thay đổi lược đồ mà mã cũ không chịu nổi thì tách làm hai lần phát hành — mở rộng/thu gọn, bài 12.2.</p>

<h3>6 · Bản sao lưu chỉ tính khi đã khôi phục</h3>
<p><code>ops/backup.sh</code> dump bằng <code>pg_dump --format=custom</code>, khôi phục vào một CSDL nháp và so số dòng:</p>
<pre><code class="language-bash">DATABASE_URL=postgres://labflow@localhost:55432/labflow_app bash ops/backup.sh ../backups</code></pre>
<div class="out">dump: ../backups/labflow-20261101T044512Z.dump (148K, 1 s)
NOTICE:  database "labflow_restore_check" does not exist, skipping
restore: 0 s
gốc:       users=3 bookings=10000 outbox=0 migrations=4
khôi phục: users=3 bookings=10000 outbox=0 migrations=4
KHỚP — bản sao lưu dùng được</div>
<p>148 KB và chừng một giây cho 10.000 lượt đặt. <code>pg_dump</code> chụp nhất quán mà không chặn người ghi, nhưng dump mỗi đêm có thể mất một ngày — PostgreSQL <a href="/courses/postgresql/learn?lessonSlug=postgresql-15-1-pg-dump">15.1</a> dạy kỹ pg_dump, <a href="/courses/postgresql/learn?lessonSlug=postgresql-15-2-wal-pitr">15.2</a> lưu trữ WAL và khôi phục theo thời điểm.</p>

<h3>7 · Smoke test</h3>
<p><code>ops/smoke.mjs</code> đi đúng đường của một người dùng thật qua URL công khai — health, readiness, URL hợp đồng, đăng nhập, một lượt đặt idempotent và lần phát lại, một lần đọc có thể rơi vào instance kia, lệnh huỷ, cả hai sự kiện qua SSE và cả hai email — rồi tự dọn:</p>
<pre><code class="language-bash">MAIL_LOG=$PWD/../mail12.jsonl node ops/smoke.mjs http://localhost:8180</code></pre>
<div class="out">✓ GET /health                                         31 ms
✓ GET /ready (CSDL + Redis)                            4 ms  store=pg database=up redis=up
✓ GET /openapi.yaml                                    2 ms  version 2.4.0
✓ GET /v2/labs                                         6 ms  3 phòng
✓ POST /v2/auth/login                                 41 ms
✓ POST /v2/realtime/tickets + mở SSE                 310 ms
✓ POST /v2/bookings (Idempotency-Key)                 16 ms  bk_10001
✓ POST lại cùng khoá ⇒ phát lại, không tạo thêm        6 ms
✓ GET /v2/bookings/{id} (đọc lại, có thể ở instance khác)     3 ms
✓ POST /v2/bookings/{id}/cancel (tự dọn)               4 ms
✓ SSE nhận created + cancelled của lượt này           54 ms  created → cancelled
✓ email thông báo đã đi (MAIL_LOG)                   304 ms  ntf_bk_10001_v1, ntf_bk_10001_v2
SMOKE ĐẠT: mọi bước xanh</div>
<p>Mã thoát 0 hoặc 1: script triển khai chạy nó sau khi bật instance mới và quay lui khi đỏ.</p>

<h3>Khi phỏng vấn / đi làm</h3>
<ul>
  <li><strong>“Liveness khác readiness thế nào?”</strong> Sống = đừng khởi động lại tôi; sẵn sàng = hãy gửi request cho tôi. Sự cố CSDL làm LabFlow còn sống nhưng chưa sẵn sàng — khởi động lại cũng vô ích.</li>
  <li><strong>“Triển khai mà không lỗi bằng cách nào?”</strong> Readiness thành 503 khi nhận SIGTERM, thời gian xả dài hơn chu kỳ kiểm của load balancer, server.close cho request đang dở — đo được 622 lỗi ⇒ 0.</li>
</ul>

<h3>🧪 Thực hành (40 phút)</h3>
<div class="callout ok"><ol>
  <li>Khởi động với <code>NODE_ENV=production</code> mà không đặt gì; thêm từng biến cho tới khi chạy được. Rồi đặt <code>LABFLOW_JWT_SECRET=short</code> và đọc thông báo.</li>
  <li>Chạy phép thử tắt với <code>SHUTDOWN_DRAIN_MS=0</code>; giải thích lỗi (nếu có) bằng chu kỳ kiểm của proxy.</li>
  <li>Chạy <code>bash ops/backup.sh</code>, rồi xoá một bảng trong bản nháp và cho thấy script báo LỆCH.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đọc thuộc thứ tự ngày triển khai (sao lưu, migrate, bật, smoke, xả) và có một lần chạy đo được cho mỗi bước.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Fail fast (hỏng sớm)</span><span class="v">Từ chối khởi động với cấu hình sai thay vì hỏng ở request đầu tiên.</span></div>
  <div class="kv"><span class="k">Liveness / readiness (còn sống / sẵn sàng)</span><span class="v">Còn sống (đừng khởi động lại) khác với phục vụ được ngay (hãy gửi request).</span></div>
  <div class="kv"><span class="k">Draining (xả)</span><span class="v">Không nhận việc mới trong lúc làm nốt việc đang dở.</span></div>
  <div class="kv"><span class="k">Correlation id (mã tương quan)</span><span class="v"><code>X-Request-Id</code>: một mã theo request đi qua log và các dịch vụ.</span></div>
  <div class="kv"><span class="k">Cardinality (số giá trị nhãn)</span><span class="v">Một metric có bao nhiêu giá trị nhãn khác nhau; không giới hạn ⇒ bộ nhớ không giới hạn.</span></div>
  <div class="kv"><span class="k">Expand / contract (mở rộng / thu gọn)</span><span class="v">Đổi lược đồ qua hai lần phát hành để mã cũ và mới cùng chạy được ở giữa.</span></div>
  <div class="kv"><span class="k">Restore drill (diễn tập khôi phục)</span><span class="v">Cố ý khôi phục một bản sao lưu để chứng minh nó dùng được.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Cấu hình nằm trong biến môi trường, kiểm lúc khởi động: liệt kê mọi lỗi, thoát 1, từ chối công tắc chỉ-để-học ở production.</li>
  <li>CSDL sập: /health 200, /ready 503, ghi trả 503 + Retry-After, đọc có cache vẫn 200, tiến trình sống; CSDL về ⇒ 201.</li>
  <li>Tắt êm khi có tải: thoát ngay 622 × 502 ⇒ tắt êm 0 lỗi; kiểm sức khoẻ cần thời hạn tính bằng giây và nhiều lần trượt liên tiếp.</li>
  <li>Log JSON có X-Request-Id; metrics Prometheus ở cổng riêng với nhãn là mẫu route.</li>
  <li>Migration đi trước theo mở rộng/thu gọn; sao lưu được chứng minh bằng khôi phục; smoke test 12 bước quyết định mọi lần triển khai.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/deploy-vps/learn?lessonSlug=deploy-3-2-tat-tu-te" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Deploy lên VPS — 3.2: Tắt tử tế, và cái bước xả tôi viết sai</span><span class="lc-sub">SIGTERM khác SIGKILL, kết nối rỗi, và systemd hay Docker chờ bao lâu.</span></span>
  <span class="lc-cta">MỞ BÀI →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/observability-monitoring/learn?lessonSlug=obs-8-1-bon-luot-tham-do" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Observability — 8.1: Bốn lượt thăm dò, bốn câu hỏi khác nhau</span><span class="lc-sub">Liveness, readiness, startup, kiểm sâu — và điều không probe nào được làm.</span></span>
  <span class="lc-cta">MỞ BÀI →</span>
</a>
</div>
`,
    },
    /* ─────────────────────────── Lab 12 ─────────────────────────── */
    {
      title: 'Lab 12 — Move device issues to PostgreSQL, and prove it on two instances|||Lab 12 — Chuyển báo hỏng thiết bị lên PostgreSQL, và chứng minh trên hai instance',
      slug: 'api-12-9-lab',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Viết migration 004_issues.sql (index duy nhất có điều kiện, cột hạng) và store issues-pg.js (transaction hai bảng, UPDATE có điều kiện); bộ chấm lab/grade-lab12.mjs trên hai instance: khởi đầu 0/10, lời giải 10/10.',
      content: `${GL12}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lab 12</span>
<h2>Lab 12 — Move device issues to PostgreSQL, and prove it on two instances</h2>
<p class="lead">Bookings, labs, devices and users now live in PostgreSQL. One resource was left behind on purpose: <strong>issues</strong> — the broken-device reports you built in Lab 1, paginated in Lab 3 and protected with <code>If-Match</code> in Lab 5. In the starter they still live in each instance's RAM. Your job: give them a table, a store, and a grader score of 10/10 on two instances.</p>
<p><strong>What you practise:</strong> the whole 12.1–12.4 loop on a resource you know — a migration with the right constraints, a store that keeps the API contract, a transaction that changes two tables, and optimistic locking inside an UPDATE. <strong>Why it is worth it:</strong> it is the capstone in miniature; if you can do this alone, you can do it for your own project's next table.</p>

<a class="link-card" href="https://media.cuongthai.com/files/academy/API/v1/labflow-api-final.zip" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Download: LabFlow API, final version (labflow-api-final.zip, 443 KB)</span><span class="lc-sub">Everything of Chapters 1–12: PostgreSQL store + migrations, Redis, worker, outbox, ops/ (dev-stack, smoke, backup), perf/ scripts, OpenAPI 2.4.0, Lab 12 starter + solution + grader. README.txt lists the commands of every lesson; npm ci && npm test needs no database.</span></span>
  <span class="lc-cta">DOWNLOAD →</span>
</a>

<h3>Start: the starter scores 0</h3>
<p>The final zip contains the solution, so first put the starter in place (keep a copy of the solution to compare later):</p>
<pre><code class="language-bash">cp src/store/issues-pg.js ../issues-pg.solution.js &amp;&amp; cp migrations/004_issues.sql ../004_issues.solution.sql
cp lab/lab12/issues-pg-starter.js src/store/issues-pg.js &amp;&amp; rm migrations/004_issues.sql
dropdb labflow_lab12; createdb labflow_lab12
export DATABASE_URL=postgres://labflow@localhost:55432/labflow_lab12
npm run db:migrate &amp;&amp; SEED_ISSUES=60 npm run db:seed
bash ops/dev-stack.sh start LABFLOW_REPORT_LIMIT=1000/60     # A :4200, B :4201, worker, proxy :8180
node lab/grade-lab12.mjs</code></pre>
<pre><code class="language-bash">node lab/grade-lab12.mjs</code></pre>
<div class="out">✗ 0/1  bảng issues + index duy nhất có điều kiện cho báo hỏng ĐANG MỞ — chưa có bảng issues (đã chạy npm run db:migrate?)
✗ 0/2  báo hỏng tạo ở A đọc được ở B (cùng nội dung) — GET iss_1 ở B: 404
✗ 0/2  6 báo hỏng CÙNG tiêu đề gửi đồng thời vào A và B ⇒ đúng một 201, năm 409 DUPLICATE_ISSUE — nhận 201,201,409,409,409,409
✗ 0/1  báo hỏng HIGH ở A ⇒ thiết bị MAINTENANCE khi đọc ở B — dev_3 ở B: AVAILABLE
✗ 0/2  hai quản lý cùng resolve với cùng If-Match (một ở A, một ở B) ⇒ một 200, một 412 — nhận 200,200
✗ 0/1  dữ liệu nằm trong PostgreSQL (không phải RAM của instance) — relation "issues" does not exist
✗ 0/1  GET /v2/issues phân trang con trỏ xen kẽ A/B — không trùng, không sót — relation "issues" does not exist
TỔNG: 0/10</div>
<p>Every check fails for a reason you have seen in this chapter: no table, an issue invisible on the other instance, two winners for one “open” title, a device status written into one process's memory, two managers both resolving the same issue.</p>

<h3>The tasks</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">A</span><span class="lz-t">Migration</span><span class="lz-d"><code>migrations/004_issues.sql</code> — table, constraints, indexes</span></div>
  <div class="lz-step"><span class="lz-k">B</span><span class="lz-t">Store</span><span class="lz-d"><code>src/store/issues-pg.js</code> — same 5 functions as issues-memory.js</span></div>
  <div class="lz-step"><span class="lz-k">C</span><span class="lz-t">Prove</span><span class="lz-d"><code>npm run test:pg</code> green + grader 10/10</span></div>
</div>
<p><strong>Part A — the table.</strong> Keep the contract: ids <code>iss_1, iss_2…</code> (sequence + generated text id, as bookings), fields as in Lab 1, a <code>version</code> for <code>If-Match</code>, <code>timestamptz(3)</code> times. Two rules belong in the database:</p>
<ul>
  <li>“A device cannot have two <em>open</em> issues with the same title, compared the way a reader compares (case and accents ignored)” ⇒ a <strong>partial unique index</strong> <code>… (device_id, title_key) WHERE status = 'OPEN'</code>. <code>title_key</code> is <code>fold(title)</code> computed by the app — <code>unaccent()</code> is not IMMUTABLE, so PostgreSQL refuses it in an index.</li>
  <li>Sorting by <code>-severity</code> needs an order the database understands: a generated <code>severity_rank</code> (LOW 1, MEDIUM 2, HIGH 3).</li>
</ul>
<p><strong>Part B — the store.</strong> <code>listDeviceIssues</code>, <code>createIssue</code>, <code>listIssues</code>, <code>getIssue</code>, <code>resolveIssue</code>, same inputs and outputs as <code>issues-memory.js</code>:</p>
<ul>
  <li><code>createIssue</code>: insert; if severity is HIGH, set the device to MAINTENANCE <strong>in the same transaction</strong>; map <code>23505</code> on your index to <code>409 DUPLICATE_ISSUE</code> with <code>existing</code> = the open issue's id.</li>
  <li><code>resolveIssue(id, resolution, expectedVersion)</code>: one <code>UPDATE … WHERE id = $1 AND status = 'OPEN' AND ($3 IS NULL OR version = $3)</code>; zero rows ⇒ return <code>null</code> (version moved ⇒ 412) or <code>'ALREADY'</code> (409) — the route already knows both.</li>
  <li><code>listIssues</code>: keyset on <code>(created_at, seq)</code> or <code>(severity_rank, seq)</code>, <code>LIMIT limit + 1</code>; the cursor carries the severity name, convert it to its rank.</li>
</ul>

<h3>Rubric — 10 points, checked by the grader</h3>
<table>
<tr><th>Pts</th><th>Check</th><th>Lesson</th></tr>
<tr><td>1</td><td><code>issues</code> table exists with a UNIQUE index whose predicate mentions OPEN</td><td>12.1–12.2</td></tr>
<tr><td>2</td><td>an issue created on A reads back on B with the same content</td><td>12.3</td></tr>
<tr><td>2</td><td>6 reports with one title, sent at once to A and B by three users ⇒ one 201, five 409 <code>DUPLICATE_ISSUE</code> with <code>existing</code></td><td>12.3</td></tr>
<tr><td>1</td><td>a HIGH report on A ⇒ the device is MAINTENANCE when read on B</td><td>12.3</td></tr>
<tr><td>2</td><td>two managers resolve with the same <code>If-Match</code>, one on A, one on B ⇒ one 200, one 412</td><td>12.4</td></tr>
<tr><td>1</td><td>the row is in PostgreSQL (the grader SELECTs it)</td><td>12.1</td></tr>
<tr><td>1</td><td><code>GET /v2/issues</code> paged 5 at a time, alternating A and B ⇒ every row once</td><td>3.2, 12.1</td></tr>
</table>

<h3>Reference solution</h3>
<p>Try first; then compare with <code>../004_issues.solution.sql</code> and <code>../issues-pg.solution.js</code>. The heart of each:</p>
<pre><code class="language-sql">CREATE TABLE issues (
  seq           bigint GENERATED BY DEFAULT AS IDENTITY UNIQUE,
  id            text GENERATED ALWAYS AS ('iss_' || seq) STORED PRIMARY KEY,
  device_id     text NOT NULL REFERENCES devices ON DELETE CASCADE,
  title         text NOT NULL,
  title_key     text NOT NULL,
  severity      text NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH')),
  severity_rank smallint GENERATED ALWAYS AS (CASE severity WHEN 'LOW' THEN 1 WHEN 'MEDIUM' THEN 2 ELSE 3 END) STORED,
  status        text NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'RESOLVED')),
  version       int NOT NULL DEFAULT 1,
  …
);
CREATE UNIQUE INDEX issues_open_title ON issues (device_id, title_key) WHERE status = 'OPEN';</code></pre>
<pre><code class="language-javascript">return await tx(async (c) =&gt; {
  const row = (await c.query(&#96;INSERT INTO issues (device_id, reported_by, title, title_key, severity, description)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *&#96;, [deviceId, reportedBy, title, fold(title), severity, description ?? null])).rows[0];
  if (severity === 'HIGH') await c.query("UPDATE devices SET status = 'MAINTENANCE', version = version + 1 WHERE id = $1", [deviceId]);
  return toIssue(row);
});            // 23505 on issues_open_title ⇒ 409 DUPLICATE_ISSUE + existing</code></pre>
<p>Put the solution files back, restart both instances (<code>bash ops/dev-stack.sh start …</code>), then migrate (only <code>004</code> runs), seed the 60 sample issues and grade again:</p>
<pre><code class="language-bash">npm run -s db:migrate &amp;&amp; SEED_ISSUES=60 npm run -s db:seed</code></pre>
<div class="out">  áp 004_issues.sql (5 ms)
xong: áp 1 migration
seed labflow_lab12: users 3 · labs 4 · devices 3 · bookings 0 · issues 60 (24 ms)</div>
<pre><code class="language-bash">node lab/grade-lab12.mjs</code></pre>
<div class="out">✓ 1/1  bảng issues + index duy nhất có điều kiện cho báo hỏng ĐANG MỞ — issues_open_title
✓ 2/2  báo hỏng tạo ở A đọc được ở B (cùng nội dung) — iss_61
✓ 2/2  6 báo hỏng CÙNG tiêu đề gửi đồng thời vào A và B ⇒ đúng một 201, năm 409 DUPLICATE_ISSUE — 201,409,409,409,409,409
✓ 1/1  báo hỏng HIGH ở A ⇒ thiết bị MAINTENANCE khi đọc ở B — dev_3 MAINTENANCE
✓ 2/2  hai quản lý cùng resolve với cùng If-Match (một ở A, một ở B) ⇒ một 200, một 412 — ETag "iss_61-v1": 200,412
✓ 1/1  dữ liệu nằm trong PostgreSQL (không phải RAM của instance) — iss_61: RESOLVED, version 2
✓ 1/1  GET /v2/issues phân trang con trỏ xen kẽ A/B — không trùng, không sót — 63 báo hỏng / 13 trang
TỔNG: 10/10</div>
<div class="pitfall"><p><strong>Trap — bumping the device's <code>version</code>.</strong> Setting MAINTENANCE changes the device, so its ETag must change too (<code>version = version + 1</code>); otherwise a manager holding the old ETag can overwrite the status without a 412.</p></div>

<h3>Hand-in</h3>
<ul>
  <li>Your <code>004_issues.sql</code> and <code>issues-pg.js</code>, the grader output (10/10) and <code>npm run test:pg</code> output.</li>
  <li>Three sentences: which rule you put in the database, which in a transaction, and which in the WHERE clause — and why each belongs there.</li>
</ul>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Partial unique index</span><span class="v">Uniqueness only for rows matching a predicate — here, open issues.</span></div>
  <div class="kv"><span class="k">IMMUTABLE function</span><span class="v">Same input ⇒ same output forever; only these may appear in indexes.</span></div>
  <div class="kv"><span class="k">Rank column</span><span class="v">A generated number that gives an enum a business order for sorting and cursors.</span></div>
  <div class="kv"><span class="k">Two-table transaction</span><span class="v">The issue and the device status change commit together or not at all.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>The starter scores 0/10 on two instances; the reference solution 10/10.</li>
  <li>Database: partial unique index for “one open issue per title”; app: <code>fold()</code> for the key; transaction: issue + device status; UPDATE: <code>If-Match</code>.</li>
  <li>The API contract — ids, fields, 409 <code>DUPLICATE_ISSUE</code>, 412 — did not change; only where the data lives did.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/testing/learn?lessonSlug=tst-4-4-co-lap" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Testing course — 4.4: Isolation: transactions, truncation and seed data</span><span class="lc-sub">Here npm run test:pg rebuilds labflow_test from the migrations before each run. That lesson measures the alternatives: TRUNCATE before each test, a transaction per test, files taking turns, factories for test data.</span></span>
  <span class="lc-cta">OPEN LESSON →</span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Lab 12</span>
<h2>Lab 12 — Chuyển báo hỏng thiết bị lên PostgreSQL, và chứng minh trên hai instance</h2>
<p class="lead">Lượt đặt, phòng, thiết bị và người dùng đã nằm trong PostgreSQL. Một tài nguyên được cố ý để lại: <strong>issues</strong> — báo hỏng thiết bị bạn dựng ở Lab 1, phân trang ở Lab 3 và bảo vệ bằng <code>If-Match</code> ở Lab 5. Trong bản khởi đầu chúng vẫn nằm trong RAM của từng instance. Việc của bạn: cho chúng một bảng, một store, và điểm 10/10 của bộ chấm trên hai instance.</p>
<p><strong>Bạn luyện gì:</strong> trọn vòng 12.1–12.4 trên một tài nguyên quen thuộc — migration có đúng ràng buộc, store giữ nguyên hợp đồng API, một transaction đổi hai bảng, và khoá lạc quan nằm trong câu UPDATE. <strong>Vì sao đáng làm:</strong> đây là dự án cuối khoá thu nhỏ; tự làm được bài này thì bạn làm được cho bảng tiếp theo của đồ án mình.</p>

<a class="link-card" href="https://media.cuongthai.com/files/academy/API/v1/labflow-api-final.zip" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Tải về: LabFlow API bản cuối khoá (labflow-api-final.zip, 443 KB)</span><span class="lc-sub">Toàn bộ Chương 1–12: kho PostgreSQL + migration, Redis, worker, outbox, ops/ (dev-stack, smoke, backup), script perf/, OpenAPI 2.4.0, Lab 12 khởi đầu + lời giải + bộ chấm. README.txt ghi lệnh của từng bài; npm ci && npm test không cần CSDL.</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>Bắt đầu: bản khởi đầu được 0 điểm</h3>
<p>Gói zip cuối khoá chứa lời giải, nên trước hết đặt bản khởi đầu vào chỗ (giữ một bản lời giải để so sau):</p>
<pre><code class="language-bash">cp src/store/issues-pg.js ../issues-pg.solution.js &amp;&amp; cp migrations/004_issues.sql ../004_issues.solution.sql
cp lab/lab12/issues-pg-starter.js src/store/issues-pg.js &amp;&amp; rm migrations/004_issues.sql
dropdb labflow_lab12; createdb labflow_lab12
export DATABASE_URL=postgres://labflow@localhost:55432/labflow_lab12
npm run db:migrate &amp;&amp; SEED_ISSUES=60 npm run db:seed
bash ops/dev-stack.sh start LABFLOW_REPORT_LIMIT=1000/60     # A :4200, B :4201, worker, proxy :8180
node lab/grade-lab12.mjs</code></pre>
<pre><code class="language-bash">node lab/grade-lab12.mjs</code></pre>
<div class="out">✗ 0/1  bảng issues + index duy nhất có điều kiện cho báo hỏng ĐANG MỞ — chưa có bảng issues (đã chạy npm run db:migrate?)
✗ 0/2  báo hỏng tạo ở A đọc được ở B (cùng nội dung) — GET iss_1 ở B: 404
✗ 0/2  6 báo hỏng CÙNG tiêu đề gửi đồng thời vào A và B ⇒ đúng một 201, năm 409 DUPLICATE_ISSUE — nhận 201,201,409,409,409,409
✗ 0/1  báo hỏng HIGH ở A ⇒ thiết bị MAINTENANCE khi đọc ở B — dev_3 ở B: AVAILABLE
✗ 0/2  hai quản lý cùng resolve với cùng If-Match (một ở A, một ở B) ⇒ một 200, một 412 — nhận 200,200
✗ 0/1  dữ liệu nằm trong PostgreSQL (không phải RAM của instance) — relation "issues" does not exist
✗ 0/1  GET /v2/issues phân trang con trỏ xen kẽ A/B — không trùng, không sót — relation "issues" does not exist
TỔNG: 0/10</div>
<p>Phép kiểm nào cũng trượt vì một lý do bạn đã gặp trong chương: chưa có bảng, báo hỏng không thấy ở instance kia, hai người thắng cho một tiêu đề “đang mở”, trạng thái thiết bị ghi vào bộ nhớ của một tiến trình, hai quản lý cùng xử lý một báo hỏng.</p>

<h3>Các việc phải làm</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">A</span><span class="lz-t">Migration</span><span class="lz-d"><code>migrations/004_issues.sql</code> — bảng, ràng buộc, index</span></div>
  <div class="lz-step"><span class="lz-k">B</span><span class="lz-t">Store</span><span class="lz-d"><code>src/store/issues-pg.js</code> — đúng 5 hàm như issues-memory.js</span></div>
  <div class="lz-step"><span class="lz-k">C</span><span class="lz-t">Chứng minh</span><span class="lz-d"><code>npm run test:pg</code> xanh + bộ chấm 10/10</span></div>
</div>
<p><strong>Phần A — bảng.</strong> Giữ hợp đồng: id <code>iss_1, iss_2…</code> (sequence + id chữ sinh tự động, như bookings), các trường như Lab 1, cột <code>version</code> cho <code>If-Match</code>, thời gian <code>timestamptz(3)</code>. Hai luật thuộc về CSDL:</p>
<ul>
  <li>“Một thiết bị không có hai báo hỏng <em>đang mở</em> cùng tiêu đề, so như người đọc (không phân biệt hoa thường, dấu)” ⇒ một <strong>index duy nhất có điều kiện</strong> (partial unique index) <code>… (device_id, title_key) WHERE status = 'OPEN'</code>. <code>title_key</code> là <code>fold(title)</code> do ứng dụng tính — <code>unaccent()</code> không IMMUTABLE nên PostgreSQL không cho dùng trong index.</li>
  <li>Sắp theo <code>-severity</code> cần một thứ tự CSDL hiểu được: cột sinh <code>severity_rank</code> (LOW 1, MEDIUM 2, HIGH 3).</li>
</ul>
<p><strong>Phần B — store.</strong> <code>listDeviceIssues</code>, <code>createIssue</code>, <code>listIssues</code>, <code>getIssue</code>, <code>resolveIssue</code>, cùng đầu vào đầu ra với <code>issues-memory.js</code>:</p>
<ul>
  <li><code>createIssue</code>: chèn; nếu mức độ HIGH thì đặt thiết bị MAINTENANCE <strong>trong cùng transaction</strong>; đổi lỗi <code>23505</code> của index thành <code>409 DUPLICATE_ISSUE</code> với <code>existing</code> = id báo hỏng đang mở.</li>
  <li><code>resolveIssue(id, resolution, expectedVersion)</code>: một câu <code>UPDATE … WHERE id = $1 AND status = 'OPEN' AND ($3 IS NULL OR version = $3)</code>; 0 dòng ⇒ trả <code>null</code> (version đã đổi ⇒ 412) hoặc <code>'ALREADY'</code> (409) — route đã biết xử lý cả hai.</li>
  <li><code>listIssues</code>: keyset trên <code>(created_at, seq)</code> hoặc <code>(severity_rank, seq)</code>, <code>LIMIT limit + 1</code>; con trỏ mang tên mức độ, đổi nó sang hạng.</li>
</ul>

<h3>Thang chấm — 10 điểm, bộ chấm tự kiểm</h3>
<table>
<tr><th>Điểm</th><th>Phép kiểm</th><th>Bài</th></tr>
<tr><td>1</td><td>có bảng <code>issues</code> với index UNIQUE mà điều kiện nhắc tới OPEN</td><td>12.1–12.2</td></tr>
<tr><td>2</td><td>báo hỏng tạo ở A đọc lại được ở B, cùng nội dung</td><td>12.3</td></tr>
<tr><td>2</td><td>6 báo hỏng cùng tiêu đề, ba người gửi cùng lúc vào A và B ⇒ một 201, năm 409 <code>DUPLICATE_ISSUE</code> kèm <code>existing</code></td><td>12.3</td></tr>
<tr><td>1</td><td>báo hỏng HIGH ở A ⇒ thiết bị là MAINTENANCE khi đọc ở B</td><td>12.3</td></tr>
<tr><td>2</td><td>hai quản lý xử lý với cùng <code>If-Match</code>, một ở A, một ở B ⇒ một 200, một 412</td><td>12.4</td></tr>
<tr><td>1</td><td>dòng dữ liệu nằm trong PostgreSQL (bộ chấm SELECT nó)</td><td>12.1</td></tr>
<tr><td>1</td><td><code>GET /v2/issues</code> mỗi trang 5, xen kẽ A và B ⇒ mỗi dòng đúng một lần</td><td>3.2, 12.1</td></tr>
</table>

<h3>Lời giải tham khảo</h3>
<p>Tự làm trước; rồi so với <code>../004_issues.solution.sql</code> và <code>../issues-pg.solution.js</code>. Phần lõi của mỗi tệp:</p>
<pre><code class="language-sql">CREATE TABLE issues (
  seq           bigint GENERATED BY DEFAULT AS IDENTITY UNIQUE,
  id            text GENERATED ALWAYS AS ('iss_' || seq) STORED PRIMARY KEY,
  device_id     text NOT NULL REFERENCES devices ON DELETE CASCADE,
  title         text NOT NULL,
  title_key     text NOT NULL,
  severity      text NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH')),
  severity_rank smallint GENERATED ALWAYS AS (CASE severity WHEN 'LOW' THEN 1 WHEN 'MEDIUM' THEN 2 ELSE 3 END) STORED,
  status        text NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'RESOLVED')),
  version       int NOT NULL DEFAULT 1,
  …
);
CREATE UNIQUE INDEX issues_open_title ON issues (device_id, title_key) WHERE status = 'OPEN';</code></pre>
<pre><code class="language-javascript">return await tx(async (c) =&gt; {
  const row = (await c.query(&#96;INSERT INTO issues (device_id, reported_by, title, title_key, severity, description)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *&#96;, [deviceId, reportedBy, title, fold(title), severity, description ?? null])).rows[0];
  if (severity === 'HIGH') await c.query("UPDATE devices SET status = 'MAINTENANCE', version = version + 1 WHERE id = $1", [deviceId]);
  return toIssue(row);
});            // 23505 trên issues_open_title ⇒ 409 DUPLICATE_ISSUE + existing</code></pre>
<p>Đặt lại hai tệp lời giải, khởi động lại hai instance (<code>bash ops/dev-stack.sh start …</code>), rồi migrate (chỉ <code>004</code> chạy), nạp 60 báo hỏng mẫu và chấm lại:</p>
<pre><code class="language-bash">npm run -s db:migrate &amp;&amp; SEED_ISSUES=60 npm run -s db:seed</code></pre>
<div class="out">  áp 004_issues.sql (5 ms)
xong: áp 1 migration
seed labflow_lab12: users 3 · labs 4 · devices 3 · bookings 0 · issues 60 (24 ms)</div>
<pre><code class="language-bash">node lab/grade-lab12.mjs</code></pre>
<div class="out">✓ 1/1  bảng issues + index duy nhất có điều kiện cho báo hỏng ĐANG MỞ — issues_open_title
✓ 2/2  báo hỏng tạo ở A đọc được ở B (cùng nội dung) — iss_61
✓ 2/2  6 báo hỏng CÙNG tiêu đề gửi đồng thời vào A và B ⇒ đúng một 201, năm 409 DUPLICATE_ISSUE — 201,409,409,409,409,409
✓ 1/1  báo hỏng HIGH ở A ⇒ thiết bị MAINTENANCE khi đọc ở B — dev_3 MAINTENANCE
✓ 2/2  hai quản lý cùng resolve với cùng If-Match (một ở A, một ở B) ⇒ một 200, một 412 — ETag "iss_61-v1": 200,412
✓ 1/1  dữ liệu nằm trong PostgreSQL (không phải RAM của instance) — iss_61: RESOLVED, version 2
✓ 1/1  GET /v2/issues phân trang con trỏ xen kẽ A/B — không trùng, không sót — 63 báo hỏng / 13 trang
TỔNG: 10/10</div>
<div class="pitfall"><p><strong>Bẫy — quên tăng <code>version</code> của thiết bị.</strong> Đặt MAINTENANCE là đổi thiết bị, nên ETag của nó cũng phải đổi (<code>version = version + 1</code>); không thì quản lý đang giữ ETag cũ ghi đè được trạng thái mà không gặp 412.</p></div>

<h3>Nộp bài</h3>
<ul>
  <li><code>004_issues.sql</code> và <code>issues-pg.js</code> của bạn, output bộ chấm (10/10) và output <code>npm run test:pg</code>.</li>
  <li>Ba câu: luật nào bạn đặt trong CSDL, luật nào trong transaction, luật nào trong vế WHERE — và vì sao mỗi luật thuộc về chỗ đó.</li>
</ul>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Partial unique index (index duy nhất có điều kiện)</span><span class="v">Duy nhất chỉ với các dòng khớp điều kiện — ở đây là báo hỏng đang mở.</span></div>
  <div class="kv"><span class="k">IMMUTABLE function (hàm bất biến)</span><span class="v">Cùng đầu vào ⇒ luôn cùng kết quả; chỉ hàm loại này được dùng trong index.</span></div>
  <div class="kv"><span class="k">Rank column (cột hạng)</span><span class="v">Con số sinh tự động cho một enum thứ tự nghiệp vụ để sắp và làm con trỏ.</span></div>
  <div class="kv"><span class="k">Two-table transaction (transaction hai bảng)</span><span class="v">Báo hỏng và việc đổi trạng thái thiết bị cùng commit hoặc cùng không.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Bản khởi đầu được 0/10 trên hai instance; lời giải tham khảo 10/10.</li>
  <li>CSDL: index duy nhất có điều kiện cho “một báo hỏng mở mỗi tiêu đề”; ứng dụng: <code>fold()</code> làm khoá; transaction: báo hỏng + trạng thái thiết bị; UPDATE: <code>If-Match</code>.</li>
  <li>Hợp đồng API — id, trường, 409 <code>DUPLICATE_ISSUE</code>, 412 — không đổi; chỉ chỗ dữ liệu nằm là đổi.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/testing/learn?lessonSlug=tst-4-4-co-lap" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Khoá Testing — 4.4: Cô lập: transaction, xoá bảng và dữ liệu mẫu</span><span class="lc-sub">Ở đây test:pg dựng lại labflow_test từ migration trước mỗi lượt chạy. Bài đó đo các cách khác: TRUNCATE trước mỗi test, mỗi test một transaction, các file chạy lần lượt, factory cho dữ liệu test.</span></span>
  <span class="lc-cta">MỞ BÀI →</span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 12.8 ─────────────────────────── */
    {
      title: '12.8 — Review, documentation and your interview story|||12.8 — Rà soát, tài liệu và câu chuyện kể khi phỏng vấn',
      slug: 'api-12-4-tong-ket',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bảng bằng chứng trước → sau từ số đo của chính bạn, README đọc trong hai phút, ba câu chuyện STAR, dòng CV yếu và mạnh, demo năm phút bằng script.',
      content: `${G128}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.8</span>
<h2>Review, documentation and your interview story</h2>
<p class="lead">LabFlow now does what it promised. The last skill is to make someone else believe it in five minutes: a README a reviewer reads in two, a page of numbers you measured yourself, three STAR stories, CV lines with numbers in them, and a demo that cannot go wrong.</p>
<p><strong>What you can do after it:</strong> present this API — or your own capstone — as engineering work with evidence, answer the follow-ups, and turn the course's measurements into CV bullets. <strong>Why it matters:</strong> two candidates with the same project get different offers; the difference is almost always how they talk about it.</p>

<h3>Your evidence sheet</h3>
<p>Interviewers remember numbers that came from your own machine. One page, before → after, each with the lesson that produced it:</p>
<table>
<tr><th>Claim</th><th>Measured</th><th>Where</th></tr>
<tr><td>No double booking across instances</td><td>50 at once through 2 instances: RAM 2 bookings ⇒ PostgreSQL 1 (+49 × 409)</td><td>12.3</td></tr>
<tr><td>“Max 3 active bookings” holds under races</td><td>10 at once: 5–8 got through ⇒ 3 every time with a row lock</td><td>12.3</td></tr>
<tr><td>Paging never loses rows</td><td>bulk insert: 900 of 1,000 rows lost with µs timestamps ⇒ 0 with <code>timestamptz(3)</code></td><td>12.1</td></tr>
<tr><td>Rate limit is global</td><td>8.3: 8/8 passed a limit of 5 ⇒ 5 × 201 then 429 across A and B</td><td>12.4</td></tr>
<tr><td>No lost edits</td><td>same If-Match from two managers: 11/20 lost ⇒ 0/20</td><td>12.4</td></tr>
<tr><td>Emails never slow a booking</td><td>p50 311 ms and 500s when mail is down ⇒ 3.6 ms, all 201, retried to delivery</td><td>12.5</td></tr>
<tr><td>Events are never lost</td><td>dual write lost 342 (10.3) ⇒ outbox: 21 events for 20 bookings, 20 emails</td><td>12.5</td></tr>
<tr><td>Throughput did not regress</td><td>see the 12.6 table: lists 1.4–2.2× and writes 2.7–3.2× faster on PostgreSQL than in RAM</td><td>12.6</td></tr>
<tr><td>Deploys lose no requests</td><td>SIGTERM under load: abrupt exit 622 × 502 ⇒ graceful drain 0 errors</td><td>12.7</td></tr>
<tr><td>Contract unchanged</td><td>2.3.0 ⇒ 2.4.0: 0 breaking changes; drift check 40/40 on the PostgreSQL store</td><td>12.6</td></tr>
</table>
<p>And the size of the thing, counted rather than estimated:</p>
<pre><code class="language-bash">echo "thao tác OpenAPI: $(grep -c 'operationId:' openapi/openapi.yaml) · migration: $(ls migrations | wc -l | tr -d ' ') · bảng: $(grep -c '^CREATE TABLE' migrations/*.sql | awk -F: '{s+=$2} END {print s}')"</code></pre>
<div class="out">thao tác OpenAPI: 29 · migration: 4 · bảng: 11</div>
<pre><code class="language-bash">echo "mã nguồn src/: $(find src -name '*.js' | wc -l | tr -d ' ') tệp, $(find src -name '*.js' -exec cat {} + | wc -l | tr -d ' ') dòng · script đo perf/: $(ls perf/*.mjs | wc -l | tr -d ' ') · test: $(ls test/*.test.mjs | wc -l | tr -d ' ') tệp"</code></pre>
<div class="out">mã nguồn src/: 73 tệp, 3617 dòng · script đo perf/: 34 · test: 4 tệp</div>
<pre><code class="language-bash">npm test 2&gt;&amp;1 | grep -E '^ℹ (tests|pass|fail|skipped)' | paste -sd' ' -</code></pre>
<div class="out">ℹ tests 18 ℹ pass 17 ℹ fail 0 ℹ skipped 1</div>

<h3>A README a reviewer reads in two minutes</h3>
<p>A reviewer opens your repository between two meetings. The first screen must answer: what is it, how do I run it, why should I believe it works.</p>
<pre><code class="language-markdown"># LabFlow API — lab and device booking for a university
Node 22 · Express 5 · PostgreSQL 18 · Redis 8 · OpenAPI 3.1 (29 operations)

## Run it (3 commands)        npm ci · npm run db:migrate &amp;&amp; npm run db:seed · bash ops/dev-stack.sh start
## What it guarantees          one booking per slot (EXCLUDE), ≤ 3 active per student, no lost edits (If-Match)
## Evidence                    table of measurements + the script that produced each (perf/*.mjs)
## Architecture                1 diagram: 2 API instances · PostgreSQL · Redis · worker (relay + email queue)
## Operations                  /health, /ready, graceful shutdown, JSON logs, /metrics, backup + restore drill
## What I would do next        3 honest lines (see 12.9)</code></pre>

<h3>Three STAR stories</h3>
<p>STAR — <strong>S</strong>ituation, <strong>T</strong>ask, <strong>A</strong>ction, <strong>R</strong>esult — is how behavioural and project questions are answered. MIT's career office suggests roughly 20% situation, 10% task, 60% action, 10% result, “I” statements, and quantified results.</p>
<a class="link-card" href="https://capd.mit.edu/resources/the-star-method-for-behavioral-interviews/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: MIT CAPD — The STAR method for behavioral interviews (read 1 Nov 2026)</span><span class="lc-sub">Situation ~20%, Task ~10%, Action ~60%, Result ~10%; “most of your response should focus on your Actions”; “highlight quantifiable results”; prepare 3–5 stories, do not script them word for word.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>
<div class="callout ok">
<p><strong>1 · “Tell me about a bug you fixed.”</strong></p>
<p><em>S:</em> Our lab-booking API moved from one process to two behind a load balancer. <em>T:</em> I had to make sure two students could never book the same room at the same time. <em>A:</em> I first reproduced it: 50 parallel requests through the proxy produced two bookings, one per instance, because the overlap check ran in each process's memory. I moved the rule into PostgreSQL as an exclusion constraint on the lab and time range, mapped its error code 23P01 to our existing 409 response, and added a test that fires 20 requests at once. <em>R:</em> exactly one 201 and 49 409s in every run, through both instances, with no change to the API contract.</p>
<p><strong>2 · “A time you found a hidden problem.”</strong></p>
<p><em>S:</em> After moving to PostgreSQL, list pages looked fine. <em>T:</em> I wanted proof that cursor pagination never skipped rows. <em>A:</em> I wrote a script that pages through 1,000 rows; with a bulk insert it found only 100 — the database kept microseconds, our cursor milliseconds. I changed the columns to <code>timestamptz(3)</code> and kept the script as a test. <em>R:</em> 1,000 of 1,000 rows, and a bug that would have hidden data from users never shipped.</p>
<p><strong>3 · “How do you handle a slow third-party service?”</strong></p>
<p><em>S:</em> Students should get an email for each booking; the provider takes ~300 ms and sometimes fails. <em>T:</em> Bookings had to stay fast and correct. <em>A:</em> I measured sending inside the request: +300 ms, and when the provider failed the user saw 500 although the booking was saved. I moved the email behind a transactional outbox and a queue with retries and an idempotency key per email. <em>R:</em> p50 3.6 ms instead of 311 ms, every booking 201 during a provider outage, emails delivered after recovery, and a forced crash produced zero duplicate emails.</p>
</div>

<h3>CV lines: weak and strong</h3>
<table>
<tr><th>Weak</th><th>Strong</th></tr>
<tr><td>Built a REST API with Node.js and PostgreSQL.</td><td>Designed and built a booking REST API (Node 22, Express 5, PostgreSQL, Redis; OpenAPI 3.1, 29 operations) running on two instances with zero double bookings under 50 concurrent requests.</td></tr>
<tr><td>Used Redis for caching and rate limiting.</td><td>Made rate limiting global across instances with an atomic Redis Lua token bucket (5 req/min per user, measured), and cached the hottest endpoint with fallback to the database when Redis is down.</td></tr>
<tr><td>Implemented notifications.</td><td>Moved email out of the request path with a transactional outbox and BullMQ queue: booking p50 311 ms → 3.6 ms, no lost or duplicate emails in crash tests.</td></tr>
</table>
<div class="pitfall"><p><strong>Trap — numbers you cannot defend.</strong> “Handles 10,000 users” invites “how did you measure that?”. Quote only what your scripts printed, with the machine (“on my laptop, two instances”), and say what you did not test.</p></div>

<h3>A five-minute demo that cannot go wrong</h3>
<ol>
  <li><strong>0:00</strong> one sentence of problem + the architecture diagram.</li>
  <li><strong>0:30</strong> <code>node ops/smoke.mjs</code> against the running stack — twelve green lines in a few seconds.</li>
  <li><strong>1:30</strong> <code>node perf/race-api.mjs slot 50</code> — “fifty clicks, one booking”.</li>
  <li><strong>2:30</strong> stop Redis — bookings still 201; start it — the outbox drains, emails arrive.</li>
  <li><strong>3:30</strong> the OpenAPI page and the breaking-change diff: “clients never noticed”.</li>
  <li><strong>4:30</strong> what you would do next — honest limits (one PostgreSQL, no PITR, fake mail provider).</li>
</ol>
<p>Rehearse it with the commands in a script; never type a long command live.</p>

<h3>In interviews / at work</h3>
<ul>
  <li><strong>“What was the hardest part?”</strong> Pick a story with a measurement (1 or 3 above), not “learning PostgreSQL”.</li>
  <li><strong>“What would break first at 10× load?”</strong> Logins (scrypt is CPU-bound, ~100–125/s per instance measured in 12.6), then database connections; you know where to look because you measured.</li>
  <li><strong>“What did you not do?”</strong> Point-in-time recovery, multi-region, a real email provider, load tests on production-like hardware — saying this is a strength.</li>
</ul>

<h3>🧪 Practice (40 min)</h3>
<div class="callout ok"><ol>
  <li>Write your own evidence sheet: ten rows, each with a number <em>you</em> produced and the command that produced it.</li>
  <li>Write three STAR stories (≤ 150 words each), read them aloud with a 90-second timer each.</li>
  <li>Record the five-minute demo once on your screen; watch it and remove every second of typing.</li>
</ol>
<p><strong>Done when:</strong> every number in your README and CV can be reproduced by a command in the repository.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">STAR</span><span class="v">Situation, Task, Action, Result — the structure for project and behavioural answers.</span></div>
  <div class="kv"><span class="k">Evidence sheet</span><span class="v">Your claims, each with a measured number and the script that produced it.</span></div>
  <div class="kv"><span class="k">Quantified result</span><span class="v">An outcome with a number and a baseline: “311 ms → 3.6 ms”.</span></div>
  <div class="kv"><span class="k">Smoke test</span><span class="v">A short end-to-end check that the deployed system works at all (12.7).</span></div>
  <div class="kv"><span class="k">Honest limits</span><span class="v">What you did not build or test, said before the interviewer asks.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>One page of before → after numbers, each from your own scripts, beats any adjective.</li>
  <li>The README answers what, how to run, why to believe — in the first screen.</li>
  <li>STAR: mostly Action, always a quantified Result; three prepared stories cover most project questions.</li>
  <li>CV lines name the stack, the guarantee and the measurement.</li>
  <li>Demo from scripts in five minutes, ending with honest limits.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/software-architecture-and-design/learn?lessonSlug=swd392-slide-cs5-1" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">You met this in SWD392 — ⭐ CS.5 (1): diagrams in Report 3/4</span><span class="lc-sub">Same: documents a grader can follow — architecture and database diagrams in their place, names that match the code. Different: here the reader is a reviewer with two minutes, so the README carries one diagram, the decisions and measured evidence.</span></span>
  <span class="lc-cta">OPEN LESSON →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/software-development-project/learn?lessonSlug=swp391-7-2-report-presentation" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">You met this in SWP391 — 7.2: The final presentation (40%)</span><span class="lc-sub">Same: a short demo in front of reviewers, planned step by step, with questions you can predict. Different: here every step is a script that cannot go wrong and every claim is a number you can rerun. Not taken SWP391? This lesson stands on its own.</span></span>
  <span class="lc-cta">OPEN LESSON →</span>
</a>
<a class="link-card" href="/courses/interview-prep/learn?lessonSlug=pv-2-2-star" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Go deeper: IT Interview Prep — 2.2 STAR stories from your projects</span><span class="lc-sub">Being written: more STAR practice; the three stories of this lesson are your starting set.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.8</span>
<h2>Rà soát, tài liệu và câu chuyện kể khi phỏng vấn</h2>
<p class="lead">LabFlow giờ làm đúng những gì nó hứa. Kỹ năng cuối cùng là làm người khác tin điều đó trong năm phút: một README người review đọc trong hai phút, một trang số đo chính tay bạn đo, ba câu chuyện STAR, những dòng CV có con số, và một buổi demo không thể hỏng.</p>
<p><strong>Học xong bạn làm được:</strong> trình bày API này — hoặc đồ án của chính bạn — như một công trình kỹ thuật có bằng chứng, trả lời các câu hỏi nối, và biến số đo của khoá học thành gạch đầu dòng trong CV. <strong>Vì sao quan trọng:</strong> hai ứng viên cùng một dự án nhận hai lời mời khác nhau; khác biệt gần như luôn nằm ở cách họ kể về nó.</p>

<h3>Bảng bằng chứng của bạn</h3>
<p>Người phỏng vấn nhớ những con số đến từ chính máy của bạn. Một trang, trước → sau, mỗi dòng kèm bài đã tạo ra nó:</p>
<table>
<tr><th>Khẳng định</th><th>Đã đo</th><th>Ở đâu</th></tr>
<tr><td>Không đặt trùng qua nhiều instance</td><td>50 lượt cùng lúc qua 2 instance: RAM 2 lượt đặt ⇒ PostgreSQL 1 (+49 × 409)</td><td>12.3</td></tr>
<tr><td>“Tối đa 3 lượt còn hiệu lực” đứng vững khi đua</td><td>10 lượt cùng lúc: lọt 5–8 ⇒ luôn đúng 3 khi khoá dòng</td><td>12.3</td></tr>
<tr><td>Phân trang không bao giờ mất dòng</td><td>nhập lô: mất 900/1.000 dòng với thời gian µs ⇒ 0 với <code>timestamptz(3)</code></td><td>12.1</td></tr>
<tr><td>Rate limit là toàn cục</td><td>8.3: lọt 8/8 qua giới hạn 5 ⇒ 5 × 201 rồi 429 qua cả A và B</td><td>12.4</td></tr>
<tr><td>Không mất bản sửa</td><td>hai quản lý cùng If-Match: mất 11/20 ⇒ 0/20</td><td>12.4</td></tr>
<tr><td>Email không bao giờ làm chậm lượt đặt</td><td>p50 311 ms và lỗi 500 khi mail sập ⇒ 3,6 ms, toàn 201, thử lại tới khi giao được</td><td>12.5</td></tr>
<tr><td>Sự kiện không bao giờ mất</td><td>ghi kép mất 342 (10.3) ⇒ outbox: 21 sự kiện cho 20 lượt đặt, 20 email</td><td>12.5</td></tr>
<tr><td>Thông lượng không thụt lùi</td><td>bảng 12.6: danh sách nhanh 1,4–2,2 lần và ghi nhanh 2,7–3,2 lần trên PostgreSQL so với RAM</td><td>12.6</td></tr>
<tr><td>Triển khai không rơi request</td><td>SIGTERM khi có tải: thoát ngay 622 × 502 ⇒ tắt êm 0 lỗi</td><td>12.7</td></tr>
<tr><td>Hợp đồng không đổi</td><td>2.3.0 ⇒ 2.4.0: 0 thay đổi phá vỡ; kiểm trôi 40/40 trên kho PostgreSQL</td><td>12.6</td></tr>
</table>
<p>Và kích thước của sản phẩm, đếm chứ không ước:</p>
<pre><code class="language-bash">echo "thao tác OpenAPI: $(grep -c 'operationId:' openapi/openapi.yaml) · migration: $(ls migrations | wc -l | tr -d ' ') · bảng: $(grep -c '^CREATE TABLE' migrations/*.sql | awk -F: '{s+=$2} END {print s}')"</code></pre>
<div class="out">thao tác OpenAPI: 29 · migration: 4 · bảng: 11</div>
<pre><code class="language-bash">echo "mã nguồn src/: $(find src -name '*.js' | wc -l | tr -d ' ') tệp, $(find src -name '*.js' -exec cat {} + | wc -l | tr -d ' ') dòng · script đo perf/: $(ls perf/*.mjs | wc -l | tr -d ' ') · test: $(ls test/*.test.mjs | wc -l | tr -d ' ') tệp"</code></pre>
<div class="out">mã nguồn src/: 73 tệp, 3617 dòng · script đo perf/: 34 · test: 4 tệp</div>
<pre><code class="language-bash">npm test 2&gt;&amp;1 | grep -E '^ℹ (tests|pass|fail|skipped)' | paste -sd' ' -</code></pre>
<div class="out">ℹ tests 18 ℹ pass 17 ℹ fail 0 ℹ skipped 1</div>

<h3>Một README người review đọc trong hai phút</h3>
<p>Người review mở kho mã của bạn giữa hai cuộc họp. Màn hình đầu tiên phải trả lời: nó là gì, chạy thế nào, vì sao nên tin nó chạy đúng.</p>
<pre><code class="language-markdown"># LabFlow API — đặt phòng lab và thiết bị cho trường đại học
Node 22 · Express 5 · PostgreSQL 18 · Redis 8 · OpenAPI 3.1 (29 thao tác)

## Chạy (3 lệnh)               npm ci · npm run db:migrate &amp;&amp; npm run db:seed · bash ops/dev-stack.sh start
## Bảo đảm                     mỗi khung giờ một lượt (EXCLUDE), ≤ 3 lượt mỗi sinh viên, không mất bản sửa (If-Match)
## Bằng chứng                  bảng số đo + script tạo ra từng con số (perf/*.mjs)
## Kiến trúc                   1 sơ đồ: 2 instance API · PostgreSQL · Redis · worker (relay + hàng đợi email)
## Vận hành                    /health, /ready, tắt êm, log JSON, /metrics, sao lưu + diễn tập khôi phục
## Việc tiếp theo              3 dòng trung thực (xem 12.9)</code></pre>

<h3>Ba câu chuyện STAR</h3>
<p>STAR — <strong>S</strong>ituation (bối cảnh), <strong>T</strong>ask (nhiệm vụ), <strong>A</strong>ction (hành động), <strong>R</strong>esult (kết quả) — là khung trả lời câu hỏi hành vi và câu hỏi về dự án. Phòng hướng nghiệp MIT gợi ý chừng 20% bối cảnh, 10% nhiệm vụ, 60% hành động, 10% kết quả, nói bằng “tôi”, và kết quả có con số.</p>
<a class="link-card" href="https://capd.mit.edu/resources/the-star-method-for-behavioral-interviews/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: MIT CAPD — The STAR method for behavioral interviews (đọc ngày 01/11/2026)</span><span class="lc-sub">Bối cảnh ~20%, nhiệm vụ ~10%, hành động ~60%, kết quả ~10%; “phần lớn câu trả lời nên tập trung vào hành động”; “nêu kết quả đo đếm được”; chuẩn bị 3–5 câu chuyện, đừng học thuộc từng chữ.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<div class="callout ok">
<p><strong>1 · “Kể về một con bug em đã sửa.”</strong></p>
<p><em>S:</em> API đặt phòng lab của nhóm chuyển từ một tiến trình sang hai, đứng sau load balancer. <em>T:</em> Tôi phải bảo đảm hai sinh viên không bao giờ đặt trùng một phòng cùng giờ. <em>A:</em> Tôi tái hiện trước: 50 request song song qua proxy tạo ra hai lượt đặt, mỗi instance một, vì phép kiểm chồng giờ chạy trong bộ nhớ của từng tiến trình. Tôi chuyển luật vào PostgreSQL thành ràng buộc loại trừ trên phòng và khoảng giờ, đổi mã lỗi 23P01 thành câu trả lời 409 sẵn có, và thêm test bắn 20 request cùng lúc. <em>R:</em> đúng một 201 và 49 lần 409 ở mọi lần chạy, qua cả hai instance, không đổi hợp đồng API.</p>
<p><strong>2 · “Một lần em phát hiện vấn đề bị che giấu.”</strong></p>
<p><em>S:</em> Sau khi chuyển sang PostgreSQL, các trang danh sách trông vẫn ổn. <em>T:</em> Tôi muốn bằng chứng rằng phân trang con trỏ không bao giờ bỏ sót dòng. <em>A:</em> Tôi viết script đi qua 1.000 dòng; với dữ liệu nhập lô nó chỉ thấy 100 — CSDL giữ micro giây, con trỏ của chúng tôi giữ mili giây. Tôi đổi cột sang <code>timestamptz(3)</code> và giữ script làm test. <em>R:</em> đủ 1.000/1.000 dòng, và một con bug giấu dữ liệu khỏi người dùng không bao giờ lên production.</p>
<p><strong>3 · “Em xử lý một dịch vụ bên ngoài chậm thế nào?”</strong></p>
<p><em>S:</em> Sinh viên cần nhận email cho mỗi lượt đặt; nhà cung cấp mất ~300 ms và thỉnh thoảng hỏng. <em>T:</em> Lượt đặt phải vẫn nhanh và đúng. <em>A:</em> Tôi đo việc gửi ngay trong request: +300 ms, và khi nhà cung cấp hỏng người dùng thấy 500 dù lượt đặt đã lưu. Tôi chuyển email ra sau transactional outbox và một hàng đợi có thử lại và khoá idempotency cho mỗi email. <em>R:</em> p50 3,6 ms thay vì 311 ms, mọi lượt đặt đều 201 khi nhà cung cấp sập, email được giao sau khi hồi, và một lần cố ý làm sập không sinh email trùng nào.</p>
</div>

<h3>Dòng CV: yếu và mạnh</h3>
<table>
<tr><th>Yếu</th><th>Mạnh</th></tr>
<tr><td>Xây REST API bằng Node.js và PostgreSQL.</td><td>Thiết kế và xây REST API đặt phòng (Node 22, Express 5, PostgreSQL, Redis; OpenAPI 3.1, 29 thao tác) chạy trên hai instance, không đặt trùng lần nào với 50 request đồng thời.</td></tr>
<tr><td>Dùng Redis làm cache và rate limit.</td><td>Làm rate limit toàn cục qua các instance bằng xô token Lua nguyên tử trên Redis (5 request/phút mỗi người, đã đo), và cache endpoint nóng nhất có đường lùi về CSDL khi Redis sập.</td></tr>
<tr><td>Làm tính năng thông báo.</td><td>Đưa email ra khỏi đường request bằng transactional outbox và hàng đợi BullMQ: p50 lượt đặt 311 ms → 3,6 ms, không mất và không trùng email trong các phép thử sập.</td></tr>
</table>
<div class="pitfall"><p><strong>Bẫy — con số không bảo vệ được.</strong> “Chịu được 10.000 người dùng” sẽ kéo theo câu “em đo bằng cách nào?”. Chỉ trích những gì script của bạn in ra, kèm máy đo (“trên laptop của em, hai instance”), và nói rõ cái gì chưa thử.</p></div>

<h3>Năm phút demo không thể hỏng</h3>
<ol>
  <li><strong>0:00</strong> một câu nêu vấn đề + sơ đồ kiến trúc.</li>
  <li><strong>0:30</strong> <code>node ops/smoke.mjs</code> vào bộ đang chạy — mười hai dòng xanh trong vài giây.</li>
  <li><strong>1:30</strong> <code>node perf/race-api.mjs slot 50</code> — “năm mươi cú bấm, một lượt đặt”.</li>
  <li><strong>2:30</strong> tắt Redis — lượt đặt vẫn 201; bật lại — outbox xả, email tới.</li>
  <li><strong>3:30</strong> trang OpenAPI và diff thay đổi phá vỡ: “client không hề nhận ra”.</li>
  <li><strong>4:30</strong> việc tiếp theo — giới hạn trung thực (một PostgreSQL, chưa có PITR, nhà cung cấp mail giả).</li>
</ol>
<p>Diễn tập bằng các lệnh đặt sẵn trong script; không bao giờ gõ lệnh dài trực tiếp.</p>

<h3>Khi phỏng vấn / đi làm</h3>
<ul>
  <li><strong>“Phần khó nhất là gì?”</strong> Chọn một câu chuyện có số đo (1 hoặc 3 ở trên), đừng nói “học PostgreSQL”.</li>
  <li><strong>“Tải gấp 10 thì cái gì hỏng trước?”</strong> Đăng nhập (scrypt tốn CPU, ~100–125/s mỗi instance đo ở 12.6), rồi tới kết nối CSDL; bạn biết nhìn vào đâu vì bạn đã đo.</li>
  <li><strong>“Em chưa làm gì?”</strong> Khôi phục tới một thời điểm, nhiều vùng, nhà cung cấp email thật, đo tải trên phần cứng giống production — nói ra điều này là điểm mạnh.</li>
</ul>

<h3>🧪 Thực hành (40 phút)</h3>
<div class="callout ok"><ol>
  <li>Viết bảng bằng chứng của bạn: mười dòng, mỗi dòng một con số <em>bạn</em> tạo ra và lệnh tạo ra nó.</li>
  <li>Viết ba câu chuyện STAR (≤ 150 từ mỗi câu), đọc to mỗi câu trong 90 giây.</li>
  <li>Quay màn hình buổi demo năm phút một lần; xem lại và bỏ mọi giây gõ phím.</li>
</ol>
<p><strong>Đạt khi:</strong> mọi con số trong README và CV của bạn đều tái tạo được bằng một lệnh trong kho mã.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">STAR</span><span class="v">Bối cảnh, Nhiệm vụ, Hành động, Kết quả — khung trả lời câu hỏi dự án và hành vi.</span></div>
  <div class="kv"><span class="k">Evidence sheet (bảng bằng chứng)</span><span class="v">Các khẳng định của bạn, mỗi cái kèm con số đã đo và script tạo ra nó.</span></div>
  <div class="kv"><span class="k">Quantified result (kết quả định lượng)</span><span class="v">Kết quả có số và có mốc so: “311 ms → 3,6 ms”.</span></div>
  <div class="kv"><span class="k">Smoke test (kiểm khói)</span><span class="v">Phép kiểm đầu-cuối ngắn xem hệ thống đã triển khai có chạy không (12.7).</span></div>
  <div class="kv"><span class="k">Honest limits (giới hạn trung thực)</span><span class="v">Những gì bạn chưa làm hay chưa thử, nói ra trước khi bị hỏi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Một trang số trước → sau, mỗi số từ script của chính bạn, hơn mọi tính từ.</li>
  <li>README trả lời là gì, chạy thế nào, vì sao nên tin — ngay màn hình đầu.</li>
  <li>STAR: phần lớn là Hành động, luôn có Kết quả định lượng; ba câu chuyện chuẩn bị sẵn phủ hầu hết câu hỏi về dự án.</li>
  <li>Dòng CV nêu công nghệ, điều được bảo đảm và con số đo.</li>
  <li>Demo bằng script trong năm phút, kết thúc bằng giới hạn trung thực.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/software-architecture-and-design/learn?lessonSlug=swd392-slide-cs5-1" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Bạn đã gặp ở SWD392 — ⭐ CS.5 (1): sơ đồ trong Report 3/4</span><span class="lc-sub">Giống: tài liệu người chấm đọc theo được — sơ đồ kiến trúc và CSDL đúng chỗ, tên khớp code. Khác: ở đây người đọc là người review có hai phút, nên README mang một sơ đồ, các quyết định và bằng chứng đo được.</span></span>
  <span class="lc-cta">MỞ BÀI →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/software-development-project/learn?lessonSlug=swp391-7-2-report-presentation" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Bạn đã gặp ở SWP391 — 7.2: Thuyết trình cuối kỳ (40%)</span><span class="lc-sub">Giống: một buổi demo ngắn trước người chấm, lên kế hoạch từng bước, câu hỏi đoán trước được. Khác: ở đây bước nào cũng là script không thể hỏng và khẳng định nào cũng là con số chạy lại được. Chưa học SWP391? Bài này tự đủ.</span></span>
  <span class="lc-cta">MỞ BÀI →</span>
</a>
<a class="link-card" href="/courses/interview-prep/learn?lessonSlug=pv-2-2-star" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Đi sâu: IT Interview Prep — 2.2 Câu chuyện STAR từ dự án của bạn</span><span class="lc-sub">Đang soạn: luyện STAR thêm; ba câu chuyện của bài này là bộ khởi đầu.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 12.9 ─────────────────────────── */
    {
      title: '12.9 — Where to go next: from LabFlow to your next project|||12.9 — Học tiếp gì: từ LabFlow tới dự án kế tiếp',
      slug: 'api-12-8-hoc-tiep',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Những gì bạn làm được sau cả khoá, ba con đường cho ba tháng tới, bản đồ các khoá đi sâu từng phần của LabFlow, sáu hướng mở rộng LabFlow làm dự án portfolio.',
      content: `${G129}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.9</span>
<h2>Where to go next: from LabFlow to your next project</h2>
<p class="lead">You started this course with <code>curl</code> and one Express route. You finish it with an API on PostgreSQL and Redis, two instances, an outbox, a queue, a contract checked by machines and a deploy checklist — and numbers for every claim. This last lesson maps what you can do now, the courses that go deeper on each part, and six ways to keep LabFlow growing as your portfolio project.</p>
<p><strong>What you can do after it:</strong> choose a learning road for the next months with a concrete plan, and extend LabFlow on your own without a tutorial. <strong>Why it matters:</strong> a course ends; the habit of building, measuring and writing it down is what employers hire.</p>

<h3>What you can do now</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Contract (Ch1–4, 7)</span><span class="lz-lnote">resources and methods, RFC 9457 errors, cursor pages, versions and deprecation, OpenAPI 3.1 with drift and breaking-change checks</span></div>
  <div class="lz-layer"><span class="lz-lname">Reliability and security (Ch5–6)</span><span class="lz-lnote">idempotency keys, retries with backoff, rate limits, ETags and If-Match; JWT, BOLA, OWASP API Top 10, CORS</span></div>
  <div class="lz-layer"><span class="lz-lname">Systems (Ch8–10)</span><span class="lz-lnote">latency budgets, load tests, payload size, multiple instances, load shedding; HTTP and Redis caches, replicas; 202 jobs, events, SSE/WebSocket, webhooks</span></div>
  <div class="lz-layer"><span class="lz-lname">Interview (Ch11)</span><span class="lz-lnote">a 45-minute plan, estimates from measured capacity, three classic designs</span></div>
  <div class="lz-layer"><span class="lz-lname">Production (Ch12)</span><span class="lz-lnote">schema and migrations, pool and transactions, shared state, outbox and queue, re-measured load, deploy checklist, your story</span></div>
</div>

<a class="link-card" href="https://media.cuongthai.com/files/academy/API/v1/labflow-api-final.zip" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Download: LabFlow API, final version (labflow-api-final.zip, 443 KB)</span><span class="lc-sub">Everything of Chapters 1–12: PostgreSQL store + migrations, Redis, worker, outbox, ops/ (dev-stack, smoke, backup), perf/ scripts, OpenAPI 2.4.0, Lab 12 starter + solution + grader. README.txt lists the commands of every lesson; npm ci && npm test needs no database.</span></span>
  <span class="lc-cta">DOWNLOAD →</span>
</a>

<h3>Three roads for the next three months</h3>
<table>
<tr><th>Road</th><th>For you if…</th><th>Order</th></tr>
<tr><td><strong>Backend job</strong></td><td>you want an internship or junior role in Node.js</td><td>Testing → Node.js (Ch13 queues, Ch15 observability, Ch17 deploy) → Deploy to a VPS → put LabFlow online</td></tr>
<tr><td><strong>Operations-minded</strong></td><td>12.7 was your favourite lesson</td><td>Docker → Deploy to a VPS → Observability &amp; Monitoring → GitHub Actions → PostgreSQL Ch14–16</td></tr>
<tr><td><strong>Interview season</strong></td><td>you apply within a month</td><td>re-do Lab 11 timed → System Design (being written) → your three STAR stories from 12.8, rehearsed aloud</td></tr>
</table>

<h3>The course map: where each part of LabFlow goes deeper</h3>
<table>
<tr><th>Course</th><th>What it adds to what you built</th><th>Start at</th></tr>
<tr><td>Testing</td><td>Vitest, a real database in tests (the 12.3 idea, systematically), API tests, Playwright, mutation testing, CI</td><td><a href="/courses/testing/learn?lessonSlug=tst-4-1-vi-sao">4.1</a></td></tr>
<tr><td>Node.js (video series)</td><td>Prisma and migrations, Redis, BullMQ, structured logs and metrics, profiling, Docker deploy — on another project</td><td><a href="/courses/nodejs/learn?lessonSlug=nodejs-13-1-vi-sao-hang-doi">13.1</a></td></tr>
<tr><td>PostgreSQL</td><td>indexes and EXPLAIN in depth, transactions and locks, pooling with PgBouncer, backups with WAL and replication</td><td><a href="/courses/postgresql/learn?lessonSlug=postgresql-14-2-pool-pgbouncer">14.2</a></td></tr>
<tr><td>Redis</td><td>data structures, Lua and atomicity, streams and consumer groups, persistence</td><td><a href="/courses/redis/learn?lessonSlug=rd-7-3-lua">7.3</a></td></tr>
<tr><td>Docker</td><td>images, Compose for dev and prod, healthchecks, the first week in production</td><td><a href="/courses/docker/learn?lessonSlug=dk-16-2-compose-dev-prod">16.2</a></td></tr>
<tr><td>Deploy to a VPS</td><td>systemd, nginx, zero-downtime deploys, secrets, backups proven by restore</td><td><a href="/courses/deploy-vps/learn?lessonSlug=deploy-3-2-tat-tu-te">3.2</a></td></tr>
<tr><td>Observability &amp; Monitoring</td><td>logs, correlation ids, metrics, alerts and probes — what 12.7 started</td><td><a href="/courses/observability-monitoring/learn?lessonSlug=obs-8-1-bon-luot-tham-do">8.1</a></td></tr>
<tr><td>Authentication</td><td>refresh tokens, OAuth, sessions, MFA — beyond Chapter 6's JWT</td><td><a href="/courses/authentication">course</a></td></tr>
<tr><td>System Design · Background Jobs · Software Architecture · Interview Prep</td><td>being written: rate limiters and notification systems at scale, outbox/saga, STAR practice</td><td><a href="/courses/system-design">course</a> · <a href="/courses/system-design/learn?lessonSlug=sysd-5-2-redis-lua">5.2</a></td></tr>
</table>

<h3>Keep LabFlow alive: six extensions</h3>
<p>Each one reuses the chapter's pattern — design the contract, put the rule in the right place, measure, write it down. Ordered by difficulty:</p>
<ol>
  <li><strong>Waitlist auto-promotion</strong> (easy): when <code>booking.cancelled</code> arrives from the outbox, offer the slot to the first person waiting with a 10-minute hold — the expired-hold trap of 11.6 included.</li>
  <li><strong>Weekly restore drill</strong> (easy): run <code>ops/backup.sh</code> from a scheduler and alert when it prints LỆCH.</li>
  <li><strong>API-key plans</strong> (medium): free 60 req/min, partner 600 — the Lua bucket with capacity from the key's plan, and <code>RateLimit-Policy</code> that says so.</li>
  <li><strong>Audit log</strong> (medium): every change to bookings and devices written to an append-only table in the same transaction; an endpoint for managers with cursor pages.</li>
  <li><strong>Recurring bookings</strong> (hard): “every Tuesday 14:00 for 10 weeks” as one request, all-or-nothing, with a 409 that lists exactly which weeks clash.</li>
  <li><strong>Several campuses</strong> (hard): a <code>campus_id</code> on every table and PostgreSQL row-level security so one campus can never read another's data — BOLA (6.2) enforced by the database.</li>
</ol>
<div class="callout ok"><p><strong>Rule for every extension:</strong> before writing code, add the operation to <code>openapi.yaml</code> and run the breaking-change diff; after writing it, add one behaviour test and one measurement to your evidence sheet.</p></div>

<h3>In interviews / at work</h3>
<ul>
  <li><strong>“What would you add next?”</strong> One extension above, with the rule it needs and where that rule lives — not “microservices”.</li>
  <li><strong>“What did this course not cover?”</strong> Multi-region, event sourcing, Kubernetes operations, GraphQL federation — know they exist and why you did not need them yet.</li>
</ul>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok"><ol>
  <li>Pick a road; write a four-week plan with one deliverable per week (a lesson finished, a measurement, a commit).</li>
  <li>Pick one LabFlow extension; write its OpenAPI operation and the single sentence that says where its rule is enforced.</li>
  <li>Take the final exam below without notes, then reread the lessons its explanations point to.</li>
</ol>
<p><strong>Done when:</strong> your plan is in your repository's README under “What I would do next”, with dates.</p></div>

<h3>📌 Summary</h3>
<ul>
  <li>You can design, build, measure, deploy and explain an API — with evidence for each claim.</li>
  <li>Three roads: backend job, operations-minded, interview season — each with a course order.</li>
  <li>Every part of LabFlow has a course that goes deeper: Testing, Node.js, PostgreSQL, Redis, Docker, Deploy to a VPS, Observability.</li>
  <li>Six extensions keep LabFlow growing; each starts in the contract and ends in a measurement.</li>
  <li>Next: the 20-question final exam over the whole course.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.9</span>
<h2>Học tiếp gì: từ LabFlow tới dự án kế tiếp của bạn</h2>
<p class="lead">Bạn bắt đầu khoá học với <code>curl</code> và một route Express. Bạn kết thúc với một API trên PostgreSQL và Redis, hai instance, một outbox, một hàng đợi, một hợp đồng do máy kiểm và một checklist triển khai — kèm con số cho mọi khẳng định. Bài cuối này vẽ lại những gì bạn làm được, các khoá đi sâu hơn cho từng phần, và sáu cách để LabFlow tiếp tục lớn thành dự án portfolio của bạn.</p>
<p><strong>Học xong bạn làm được:</strong> chọn một con đường học cho vài tháng tới với kế hoạch cụ thể, và tự mở rộng LabFlow không cần hướng dẫn. <strong>Vì sao quan trọng:</strong> khoá học thì kết thúc; thói quen xây, đo và ghi lại mới là thứ nhà tuyển dụng thuê.</p>

<h3>Bạn làm được gì bây giờ</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Hợp đồng (Ch1–4, 7)</span><span class="lz-lnote">tài nguyên và phương thức, lỗi RFC 9457, trang con trỏ, phiên bản và khai tử, OpenAPI 3.1 có kiểm trôi và kiểm thay đổi phá vỡ</span></div>
  <div class="lz-layer"><span class="lz-lname">Tin cậy và bảo mật (Ch5–6)</span><span class="lz-lnote">khoá idempotency, thử lại lùi dần, rate limit, ETag và If-Match; JWT, BOLA, OWASP API Top 10, CORS</span></div>
  <div class="lz-layer"><span class="lz-lname">Hệ thống (Ch8–10)</span><span class="lz-lnote">ngân sách độ trễ, đo tải, kích thước payload, nhiều instance, bỏ bớt tải; cache HTTP và Redis, replica; việc 202, sự kiện, SSE/WebSocket, webhook</span></div>
  <div class="lz-layer"><span class="lz-lname">Phỏng vấn (Ch11)</span><span class="lz-lnote">khung 45 phút, ước lượng từ sức chứa đã đo, ba đề kinh điển</span></div>
  <div class="lz-layer"><span class="lz-lname">Production (Ch12)</span><span class="lz-lnote">lược đồ và migration, pool và transaction, trạng thái dùng chung, outbox và hàng đợi, đo tải lại, checklist triển khai, câu chuyện của bạn</span></div>
</div>

<a class="link-card" href="https://media.cuongthai.com/files/academy/API/v1/labflow-api-final.zip" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Tải về: LabFlow API bản cuối khoá (labflow-api-final.zip, 443 KB)</span><span class="lc-sub">Toàn bộ Chương 1–12: kho PostgreSQL + migration, Redis, worker, outbox, ops/ (dev-stack, smoke, backup), script perf/, OpenAPI 2.4.0, Lab 12 khởi đầu + lời giải + bộ chấm. README.txt ghi lệnh của từng bài; npm ci && npm test không cần CSDL.</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>Ba con đường cho ba tháng tới</h3>
<table>
<tr><th>Con đường</th><th>Hợp với bạn nếu…</th><th>Thứ tự</th></tr>
<tr><td><strong>Đi làm backend</strong></td><td>bạn muốn thực tập hoặc vị trí junior Node.js</td><td>Testing → Node.js (Ch13 hàng đợi, Ch15 observability, Ch17 deploy) → Deploy lên VPS → đưa LabFlow lên mạng</td></tr>
<tr><td><strong>Thiên vận hành</strong></td><td>bài 12.7 là bài bạn thích nhất</td><td>Docker → Deploy lên VPS → Observability &amp; Monitoring → GitHub Actions → PostgreSQL Ch14–16</td></tr>
<tr><td><strong>Mùa phỏng vấn</strong></td><td>bạn nộp đơn trong vòng một tháng</td><td>làm lại Lab 11 có bấm giờ → System Design (đang soạn) → ba câu chuyện STAR của bài 12.8, tập nói to</td></tr>
</table>

<h3>Bản đồ khoá học: mỗi phần của LabFlow đi sâu ở đâu</h3>
<table>
<tr><th>Khoá</th><th>Thêm gì vào thứ bạn đã xây</th><th>Bắt đầu ở</th></tr>
<tr><td>Testing</td><td>Vitest, CSDL thật trong test (ý của bài 12.3, làm bài bản), test API, Playwright, mutation testing, CI</td><td><a href="/courses/testing/learn?lessonSlug=tst-4-1-vi-sao">4.1</a></td></tr>
<tr><td>Node.js (chuỗi video)</td><td>Prisma và migration, Redis, BullMQ, log có cấu trúc và metrics, profiling, deploy Docker — trên một dự án khác</td><td><a href="/courses/nodejs/learn?lessonSlug=nodejs-13-1-vi-sao-hang-doi">13.1</a></td></tr>
<tr><td>PostgreSQL</td><td>index và EXPLAIN chuyên sâu, transaction và khoá, pool với PgBouncer, sao lưu bằng WAL và nhân bản</td><td><a href="/courses/postgresql/learn?lessonSlug=postgresql-14-2-pool-pgbouncer">14.2</a></td></tr>
<tr><td>Redis</td><td>cấu trúc dữ liệu, Lua và tính nguyên tử, stream và nhóm consumer, lưu đĩa</td><td><a href="/courses/redis/learn?lessonSlug=rd-7-3-lua">7.3</a></td></tr>
<tr><td>Docker</td><td>image, Compose cho dev và prod, healthcheck, tuần đầu trên production</td><td><a href="/courses/docker/learn?lessonSlug=dk-16-2-compose-dev-prod">16.2</a></td></tr>
<tr><td>Deploy lên VPS</td><td>systemd, nginx, triển khai không gián đoạn, bí mật, sao lưu được chứng minh bằng khôi phục</td><td><a href="/courses/deploy-vps/learn?lessonSlug=deploy-3-2-tat-tu-te">3.2</a></td></tr>
<tr><td>Observability &amp; Monitoring</td><td>log, mã tương quan, metrics, cảnh báo và probe — phần bài 12.7 mới mở đầu</td><td><a href="/courses/observability-monitoring/learn?lessonSlug=obs-8-1-bon-luot-tham-do">8.1</a></td></tr>
<tr><td>Authentication</td><td>refresh token, OAuth, session, MFA — vượt khỏi JWT của Chương 6</td><td><a href="/courses/authentication">khoá</a></td></tr>
<tr><td>System Design · Background Jobs · Software Architecture · Interview Prep</td><td>đang soạn: rate limiter và hệ thống thông báo ở quy mô lớn, outbox/saga, luyện STAR</td><td><a href="/courses/system-design">khoá</a> · <a href="/courses/system-design/learn?lessonSlug=sysd-5-2-redis-lua">5.2</a></td></tr>
</table>

<h3>Giữ LabFlow sống: sáu hướng mở rộng</h3>
<p>Hướng nào cũng dùng lại khuôn của chương — thiết kế hợp đồng, đặt luật đúng chỗ, đo, ghi lại. Xếp theo độ khó:</p>
<ol>
  <li><strong>Tự đẩy người trong hàng chờ lên</strong> (dễ): khi <code>booking.cancelled</code> tới từ outbox, mời người chờ đầu tiên với chỗ giữ 10 phút — kể cả bẫy chỗ giữ hết hạn của bài 11.6.</li>
  <li><strong>Diễn tập khôi phục hằng tuần</strong> (dễ): chạy <code>ops/backup.sh</code> theo lịch và báo động khi nó in LỆCH.</li>
  <li><strong>Gói API key</strong> (vừa): miễn phí 60 request/phút, đối tác 600 — xô Lua lấy dung tích theo gói của khoá, và <code>RateLimit-Policy</code> nói rõ điều đó.</li>
  <li><strong>Nhật ký thay đổi</strong> (vừa): mọi thay đổi của bookings và devices ghi vào một bảng chỉ-thêm trong cùng transaction; một endpoint cho quản lý có trang con trỏ.</li>
  <li><strong>Lượt đặt lặp lại</strong> (khó): “thứ Ba 14:00 trong 10 tuần” là một request, tất cả hoặc không gì, với 409 liệt kê chính xác tuần nào trùng.</li>
  <li><strong>Nhiều cơ sở</strong> (khó): <code>campus_id</code> trên mọi bảng và row-level security của PostgreSQL để cơ sở này không bao giờ đọc được dữ liệu cơ sở kia — BOLA (6.2) do chính CSDL thi hành.</li>
</ol>
<div class="callout ok"><p><strong>Luật cho mọi hướng mở rộng:</strong> trước khi viết mã, thêm thao tác vào <code>openapi.yaml</code> và chạy diff thay đổi phá vỡ; sau khi viết, thêm một test hành vi và một số đo vào bảng bằng chứng của bạn.</p></div>

<h3>Khi phỏng vấn / đi làm</h3>
<ul>
  <li><strong>“Em sẽ thêm gì tiếp?”</strong> Một hướng ở trên, kèm luật nó cần và luật đó nằm ở đâu — không phải “microservices”.</li>
  <li><strong>“Khoá này chưa dạy gì?”</strong> Nhiều vùng, event sourcing, vận hành Kubernetes, GraphQL federation — biết chúng tồn tại và vì sao bạn chưa cần tới.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
  <li>Chọn một con đường; viết kế hoạch bốn tuần, mỗi tuần một sản phẩm (một bài học xong, một số đo, một commit).</li>
  <li>Chọn một hướng mở rộng LabFlow; viết thao tác OpenAPI của nó và một câu nói luật của nó được thi hành ở đâu.</li>
  <li>Làm bài thi cuối khoá ngay sau đây, không mở tài liệu, rồi đọc lại những bài mà lời giải thích chỉ tới.</li>
</ol>
<p><strong>Đạt khi:</strong> kế hoạch nằm trong README của kho mã, dưới mục “Việc tiếp theo”, có ngày tháng.</p></div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Bạn thiết kế, xây, đo, triển khai và giải thích được một API — có bằng chứng cho từng khẳng định.</li>
  <li>Ba con đường: đi làm backend, thiên vận hành, mùa phỏng vấn — mỗi đường một thứ tự khoá học.</li>
  <li>Mỗi phần của LabFlow có một khoá đi sâu hơn: Testing, Node.js, PostgreSQL, Redis, Docker, Deploy lên VPS, Observability.</li>
  <li>Sáu hướng mở rộng giữ LabFlow tiếp tục lớn; hướng nào cũng bắt đầu ở hợp đồng và kết thúc bằng một số đo.</li>
  <li>Tiếp theo: bài thi cuối khoá 20 câu cho cả khoá.</li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── Thi cuối khoá ─────────────────────────── */
    {
      title: 'Final exam — the whole course in 20 situations|||Bài thi cuối khoá — cả khoá trong 20 tình huống',
      slug: 'api-12-10-thi-cuoi-khoa',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Bài thi cuối khoá API & System Design: 20 câu tình huống trên LabFlow trải từ Mục 0 tới Chương 12, 30 phút, mỗi câu có giải thích vì sao đúng và vì sao phương án hấp dẫn nhất lại sai.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Final exam</span>
<h2>The whole course in 20 situations</h2>
<p class="lead">This is the last page of API &amp; System Design. Twenty questions, thirty minutes, spread from “which status code?” in Chapter 2 to “how do you shut down without dropping a request?” in Chapter 12. None asks for a definition: each describes something that happened to LabFlow — most of them measured while the course was written — and asks what you would do.</p>
<p>How to take it: once, without notes, in one sitting. Then read every explanation, including those you got right; each says why the most tempting wrong answer is wrong and which lesson to reread. Below 15 correct? The self-check list tells you where to go back.</p>
<h3>Self-check before you start</h3>
<p>Tick what you can do WITHOUT looking anything up:</p>
<ul>
<li><strong>Contract (Section 0 – Chapter 4).</strong> I can model resources and methods, choose between 400, 404, 409 and 422, return RFC 9457 problems, page with a cursor instead of OFFSET, and add v2 without breaking v1 (including new enum values).</li>
<li><strong>Reliability and security (Chapters 5–6).</strong> I can make POST safe to retry with Idempotency-Key, back off with jitter, rate-limit with RateLimit headers, protect edits with If-Match, verify JWTs strictly and answer 404 for other people's records.</li>
<li><strong>Contract tooling (Chapter 7).</strong> I can write OpenAPI 3.1, check drift against the running server and block breaking changes in CI.</li>
<li><strong>Systems (Chapters 8–10).</strong> I can read a latency budget, load-test fairly, keep CPU work off the event loop, shed load with 503 + Retry-After, cache with the right Cache-Control, answer 202 + a job for slow work, publish events with an outbox and receive webhooks idempotently.</li>
<li><strong>Interview (Chapter 11).</strong> I can run the 45-minute plan, size a problem from measured capacity and defend a design with evidence.</li>
<li><strong>Production (Chapter 12).</strong> I can move state to PostgreSQL and Redis with migrations, transactions and constraints, share state across instances, re-measure the load, deploy with a checklist and tell the project as three STAR stories.</li>
</ul>
<p class="note-ct">Thank you for building LabFlow all the way. You can now design an API, make it hold under real conditions, and prove it with your own numbers — the next thirty minutes are the proof.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài thi cuối khoá</span>
<h2>Cả khoá trong 20 tình huống</h2>
<p class="lead">Đây là trang cuối của khoá API &amp; System Design. Hai mươi câu, ba mươi phút, trải từ “mã trạng thái nào?” ở Chương 2 tới “tắt máy thế nào để không rơi request nào?” ở Chương 12. Không câu nào hỏi định nghĩa: mỗi câu kể một chuyện đã xảy ra với LabFlow — phần lớn đã được đo trong lúc soạn khoá — và hỏi bạn sẽ làm gì.</p>
<p>Cách làm: một lượt, không mở tài liệu, ngồi một mạch. Rồi đọc mọi lời giải thích, kể cả của câu bạn làm đúng; mỗi lời giải thích nói vì sao phương án sai hấp dẫn nhất lại sai và cần đọc lại bài nào. Dưới 15 câu? Danh sách tự kiểm bên dưới chỉ chỗ quay lại.</p>
<h3>Tự kiểm trước khi làm</h3>
<p>Đánh dấu những gì bạn làm được mà KHÔNG phải tra cứu:</p>
<ul>
<li><strong>Hợp đồng (Mục 0 – Chương 4).</strong> Tôi mô hình hoá được tài nguyên và phương thức, chọn đúng giữa 400, 404, 409 và 422, trả lỗi RFC 9457, phân trang bằng con trỏ thay cho OFFSET, và thêm v2 mà không làm vỡ v1 (kể cả giá trị enum mới).</li>
<li><strong>Tin cậy và bảo mật (Chương 5–6).</strong> Tôi làm POST thử lại an toàn bằng Idempotency-Key, lùi dần có jitter, giới hạn tần suất kèm header RateLimit, bảo vệ việc sửa bằng If-Match, kiểm JWT chặt chẽ và trả 404 cho bản ghi của người khác.</li>
<li><strong>Công cụ hợp đồng (Chương 7).</strong> Tôi viết được OpenAPI 3.1, kiểm trôi với server đang chạy và chặn thay đổi phá vỡ trong CI.</li>
<li><strong>Hệ thống (Chương 8–10).</strong> Tôi đọc được ngân sách độ trễ, đo tải công bằng, đưa việc tốn CPU ra khỏi event loop, bỏ bớt tải bằng 503 + Retry-After, cache với Cache-Control đúng, trả 202 + tài nguyên công việc cho việc chậm, phát sự kiện bằng outbox và nhận webhook idempotent.</li>
<li><strong>Phỏng vấn (Chương 11).</strong> Tôi chạy được khung 45 phút, ước lượng bài toán từ sức chứa đã đo và bảo vệ thiết kế bằng bằng chứng.</li>
<li><strong>Production (Chương 12).</strong> Tôi chuyển trạng thái sang PostgreSQL và Redis bằng migration, transaction và ràng buộc, dùng chung trạng thái giữa các instance, đo tải lại, triển khai theo checklist và kể dự án thành ba câu chuyện STAR.</li>
</ul>
<p class="note-ct">Cảm ơn bạn đã dựng LabFlow tới tận đây. Giờ bạn thiết kế được một API, làm nó đứng vững trong điều kiện thật, và chứng minh bằng chính con số của mình — ba mươi phút tới là bằng chứng.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 1800,
        questions: [
          {
            question: "A mobile client sends POST /v2/bookings for a lab that does not exist. Which answer fits the contract LabFlow uses since Chapter 2?|||Client di động gửi POST /v2/bookings cho một phòng không tồn tại. Câu trả lời nào đúng hợp đồng LabFlow dùng từ Chương 2?",
            options: [
              "400 VALIDATION_FAILED, because any wrong value in the body is a validation error|||400 VALIDATION_FAILED, vì mọi giá trị sai trong body đều là lỗi kiểm dữ liệu",
              "422 UNKNOWN_LAB as application/problem+json: well-formed, but meaningless for the business|||422 UNKNOWN_LAB dạng application/problem+json: đúng hình dạng nhưng vô nghĩa về nghiệp vụ",
              "404 LAB_NOT_FOUND, because the URL the client called points to nothing|||404 LAB_NOT_FOUND, vì URL client gọi không trỏ tới thứ gì",
              "409 BOOKING_CONFLICT, because the booking clashes with the current state of the labs|||409 BOOKING_CONFLICT, vì lượt đặt đụng với trạng thái hiện tại của các phòng",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: The body parsed and matched the schema (so not 400); the URL /v2/bookings exists (so not 404); nothing clashes (so not 409). A valid shape that names an unknown lab is 422 (Lesson 2.2). 400 is tempting because the value is “wrong”, but 400 is for shapes the schema rejects.|||VI: Body đọc được và khớp lược đồ (nên không phải 400); URL /v2/bookings tồn tại (nên không 404); không có gì xung đột (nên không 409). Hình dạng đúng mà nêu một phòng lạ là 422 (bài 2.2). 400 hấp dẫn vì giá trị “sai”, nhưng 400 dành cho hình dạng bị lược đồ từ chối.",
          },
          {
            question: "A manager pages through 1,000,000 bookings. Why does LabFlow use a cursor instead of ?offset=?|||Một quản lý lật trang qua 1.000.000 lượt đặt. Vì sao LabFlow dùng con trỏ thay cho ?offset=?",
            options: [
              "OFFSET is not supported by PostgreSQL 18 on tables that have a primary key, so the planner rejects deep offsets|||PostgreSQL 18 không hỗ trợ OFFSET trên bảng có khoá chính, nên planner từ chối offset sâu",
              "Cursors make every response smaller (fewer bytes per page), and that smaller payload is what made the deep pages fast|||Con trỏ làm mỗi câu trả lời nhỏ hơn (ít byte mỗi trang), và chính payload nhỏ đó làm trang sâu nhanh",
              "Offsets cannot be cached by browsers or proxies, while cursor URLs can be cached for 60 s like the labs list|||Offset không cache được ở trình duyệt hay proxy, còn URL con trỏ cache được 60 s như danh sách phòng",
              "OFFSET 900000 read and skipped 900,000 rows (78 ms); keyset seeks to the position (0.064 ms) and never repeats or skips rows|||OFFSET 900000 đọc rồi bỏ 900.000 dòng (78 ms); keyset nhảy thẳng tới vị trí (0,064 ms) và không lặp hay sót dòng",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: Lesson 3.1–3.2 measured OFFSET 900,000 at 78.3 ms against 0.064 ms for keyset, and showed offsets repeating rows when data changes. The response size is the same 20 rows either way, so the size answer is the tempting wrong one.|||VI: Bài 3.1–3.2 đo OFFSET 900.000 mất 78,3 ms so với 0,064 ms của keyset, và cho thấy offset lặp dòng khi dữ liệu đổi. Kích thước câu trả lời vẫn là 20 dòng dù cách nào, nên phương án kích thước là phương án sai hấp dẫn.",
          },
          {
            question: "Version 2 added the status CHECKED_IN. What does an old v1 client receive for a checked-in booking?|||Phiên bản 2 thêm trạng thái CHECKED_IN. Client v1 cũ nhận gì cho một lượt đã check-in?",
            options: [
              "PENDING — v1 never shows a value it was not designed for; the view maps it|||PENDING — v1 không bao giờ thấy giá trị nó không được thiết kế cho; view ánh xạ lại",
              "CHECKED_IN, because adding an enum value is always a safe change|||CHECKED_IN, vì thêm giá trị enum luôn là thay đổi an toàn",
              "A 410 Gone, because v1 cannot describe the booking any more|||410 Gone, vì v1 không còn mô tả được lượt đặt đó",
              "null in the status field, so the client knows the value is unknown|||null ở trường status, để client biết giá trị không xác định",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: Adding a value to an enum a client RECEIVES can break clients with exhaustive switches (Lesson 4.1), so v1's view maps CHECKED_IN to PENDING (4.4). B is the common belief that additions are always safe — true for new optional fields, not for new values in a response enum.|||VI: Thêm giá trị vào enum mà client NHẬN có thể làm vỡ client có switch đầy đủ (bài 4.1), nên view của v1 đổi CHECKED_IN thành PENDING (4.4). B là niềm tin phổ biến rằng thêm thì luôn an toàn — đúng với trường tuỳ chọn mới, không đúng với giá trị mới trong enum của câu trả lời.",
          },
          {
            question: "A phone sends POST /v2/bookings with Idempotency-Key k1, the network drops the 201, and the app retries with k1 but a DIFFERENT lab. What should LabFlow answer?|||Điện thoại gửi POST /v2/bookings với Idempotency-Key k1, mạng làm rơi câu 201, app thử lại với k1 nhưng phòng KHÁC. LabFlow nên trả gì?",
            options: [
              "201 with the original booking, marked Idempotent-Replayed|||201 kèm lượt đặt ban đầu, đánh dấu Idempotent-Replayed",
              "201 with a new booking for the new lab, because the body changed|||201 với một lượt đặt mới cho phòng mới, vì body đã đổi",
              "422 IDEMPOTENCY_KEY_REUSED: the same key was used for a different request|||422 IDEMPOTENCY_KEY_REUSED: cùng khoá mà dùng cho request khác",
              "409 IDEMPOTENCY_IN_PROGRESS with Retry-After, until the first request expires|||409 IDEMPOTENCY_IN_PROGRESS kèm Retry-After, tới khi request đầu hết hạn",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: The key is stored with a fingerprint of method, URL and body (Lesson 5.1); a different body under the same key is a client bug and gets 422. Replaying (A) would hide the bug and book the wrong lab; 409 (D) is only for a request still running.|||VI: Khoá được lưu kèm dấu vân tay của phương thức, URL và body (bài 5.1); body khác dưới cùng khoá là lỗi của client và nhận 422. Phát lại (A) sẽ che lỗi và đặt nhầm phòng; 409 (D) chỉ dành cho request đang chạy.",
          },
          {
            question: "Two lab managers open device dev_1, both edit it, both send PATCH with If-Match: \"dev_1-v3\". With two API instances on PostgreSQL, what makes exactly one of them get 412?|||Hai quản lý cùng mở thiết bị dev_1, cùng sửa, cùng gửi PATCH với If-Match: \"dev_1-v3\". Với hai instance trên PostgreSQL, điều gì làm đúng một người nhận 412?",
            options: [
              "Comparing the ETag in JavaScript before the UPDATE, in each instance|||So ETag bằng JavaScript trước câu UPDATE, ở từng instance",
              "A Redis lock around the request, released when the response is sent|||Một khoá Redis bọc request, nhả khi gửi câu trả lời",
              "SERIALIZABLE isolation for every request that has an If-Match header|||Mức cô lập SERIALIZABLE cho mọi request có header If-Match",
              "UPDATE … SET version = version + 1 WHERE id = $1 AND version = 3; zero rows ⇒ 412|||UPDATE … SET version = version + 1 WHERE id = $1 AND version = 3; 0 dòng ⇒ 412",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: Lesson 12.4 measured the check-then-write version losing an edit in 11 of 20 trials across two instances; putting the condition in the UPDATE itself gave 0 of 20. A looks right because it worked in one process (Chapter 5) — two processes race between the check and the write.|||VI: Bài 12.4 đo bản kiểm-rồi-ghi mất một bản sửa 11/20 lần qua hai instance; đặt điều kiện ngay trong câu UPDATE cho 0/20. A trông đúng vì nó chạy được trong một tiến trình (Chương 5) — hai tiến trình thì đua nhau giữa lúc kiểm và lúc ghi.",
          },
          {
            question: "Student Bình requests GET /v2/bookings/bk_7/receipt, a booking that belongs to An. What should he get, and why?|||Sinh viên Bình gọi GET /v2/bookings/bk_7/receipt, lượt đặt của An. Bình nên nhận gì, và vì sao?",
            options: [
              "404 — not 403: answering “forbidden” would confirm that bk_7 exists (BOLA, Lesson 6.2)|||404 — không phải 403: trả “bị cấm” là xác nhận bk_7 tồn tại (BOLA, bài 6.2)",
              "403 FORBIDDEN, because he is authenticated but not the owner of the record|||403 FORBIDDEN, vì đã đăng nhập nhưng không phải chủ bản ghi",
              "401 UNAUTHENTICATED, so that the app asks him to log in again as An|||401 UNAUTHENTICATED, để app yêu cầu đăng nhập lại bằng tài khoản An",
              "200 with the receipt but without An's email, since receipts are not secret|||200 kèm biên nhận nhưng bỏ email của An, vì biên nhận không phải bí mật",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: Object-level authorization is OWASP API1; for records with personal data LabFlow answers 404 so an attacker cannot enumerate ids (6.2). 403 is the textbook-looking answer, but it leaks existence; trimming fields (D) still leaks the booking.|||VI: Kiểm quyền theo đối tượng là OWASP API1; với bản ghi có dữ liệu cá nhân LabFlow trả 404 để kẻ tấn công không dò được id (6.2). 403 trông như đáp án sách giáo khoa nhưng làm lộ sự tồn tại; cắt bớt trường (D) vẫn lộ lượt đặt.",
          },
          {
            question: "The team edits openapi.yaml for 2.4.0. What tells you, in CI, whether old clients will break?|||Nhóm sửa openapi.yaml cho bản 2.4.0. Trong CI, cái gì cho biết client cũ có vỡ không?",
            options: [
              "redocly lint passing, because a valid document cannot break clients|||redocly lint xanh, vì tài liệu hợp lệ thì không làm vỡ client",
              "The drift checker passing on the new server: every response matches the new spec|||Bộ kiểm trôi xanh trên server mới: mọi câu trả lời khớp tài liệu mới",
              "A diff of the old and the new document that fails on removed fields, new required inputs, changed types|||Một phép diff tài liệu cũ và mới, đỏ khi bỏ trường, thêm đầu vào bắt buộc, đổi kiểu",
              "Regenerating the TypeScript client and checking that it compiles|||Sinh lại client TypeScript và kiểm nó biên dịch được",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: Breaking changes are a property of the difference between versions (Lessons 4.1, 7.4); openapi/diff.mjs exits 1 on them, and 2.3.0 → 2.4.0 printed none (12.6). Lint (A) and drift (B) check one document at a time — 12.6 even showed drift 40/40 on a double-booking server.|||VI: Thay đổi phá vỡ là tính chất của phần KHÁC NHAU giữa hai phiên bản (bài 4.1, 7.4); openapi/diff.mjs thoát 1 khi gặp chúng, và 2.3.0 → 2.4.0 không có cái nào (12.6). Lint (A) và kiểm trôi (B) chỉ xét từng tài liệu — 12.6 còn cho thấy drift 40/40 trên một server đặt trùng.",
          },
          {
            question: "At 07:00 hundreds of students log in at once and the labs list becomes slow for everyone. What did Chapter 8 change first, and with what result?|||Lúc 07:00 hàng trăm sinh viên đăng nhập cùng lúc và danh sách phòng chậm với mọi người. Chương 8 đổi gì trước, kết quả ra sao?",
            options: [
              "Added Redis in front of the users table, which made each login about ten times faster at 07:00|||Thêm Redis trước bảng users, làm mỗi lần đăng nhập nhanh gấp chừng mười lần lúc 07:00",
              "Moved scrypt to its asynchronous form so hashing leaves the event loop: logins 30 ⇒ 114/s, labs p99 463 ⇒ 8 ms|||Chuyển scrypt sang dạng bất đồng bộ để băm rời event loop: đăng nhập 30 ⇒ 114/s, p99 danh sách phòng 463 ⇒ 8 ms",
              "Lowered the scrypt cost parameter so each password check takes about one millisecond|||Giảm tham số độ khó của scrypt để mỗi lần kiểm mật khẩu chỉ mất chừng một mili giây",
              "Started a second instance on the same laptop, which doubled the logins per second|||Bật instance thứ hai trên cùng máy, làm số lần đăng nhập mỗi giây tăng gấp đôi",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: Synchronous scrypt blocked the single event loop, so every request queued behind password hashing; the async version runs it on the thread pool (Lesson 8.2). Lowering the cost (C) weakens password security; a second instance on one laptop (D) shares the same cores — 12.6 measured no reliable gain.|||VI: scrypt đồng bộ chặn event loop duy nhất, nên mọi request xếp hàng sau việc băm mật khẩu; bản bất đồng bộ chạy nó trên thread pool (bài 8.2). Giảm độ khó (C) làm yếu bảo mật mật khẩu; instance thứ hai trên một máy (D) dùng chung nhân CPU — 12.6 đo không thấy lợi chắc chắn.",
          },
          {
            question: "GET /v2/bookings returns a student's own bookings. Which Cache-Control is right?|||GET /v2/bookings trả lượt đặt của chính một sinh viên. Cache-Control nào đúng?",
            options: [
              "private, no-cache — only the browser may keep it, and must revalidate with the ETag|||private, no-cache — chỉ trình duyệt được giữ, và phải hỏi lại bằng ETag",
              "public, max-age=60 — the response is identical for everyone for a minute|||public, max-age=60 — câu trả lời giống nhau cho mọi người trong một phút",
              "no-store on every response, because any caching of an API is unsafe|||no-store cho mọi câu trả lời, vì cache API là không an toàn",
              "max-age=31536000 with the ETag in the URL, like a static file|||max-age=31536000 kèm ETag trong URL, như tệp tĩnh",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: Per-user data must never sit in a shared cache: Lesson 9.1 showed a single word “public” making a shared cache serve An's bookings to Bình. no-cache still allows the cheap 304 path (ETag checked before the query). no-store (C) is safe but throws away revalidation.|||VI: Dữ liệu riêng từng người không bao giờ được nằm trong cache dùng chung: bài 9.1 cho thấy chỉ một chữ “public” làm cache dùng chung đưa lượt đặt của An cho Bình. no-cache vẫn cho đường 304 rẻ (ETag kiểm trước truy vấn). no-store (C) an toàn nhưng bỏ mất việc hỏi lại.",
          },
          {
            question: "Exporting a whole semester takes 114 s and the edge proxy cuts requests at 100 s. What is the contract-level fix from Chapter 10?|||Xuất cả học kỳ mất 114 s và proxy ở biên cắt request ở giây 100. Cách sửa ở mức hợp đồng của Chương 10 là gì?",
            options: [
              "Raise every proxy timeout on the path to 300 s, so the single long request has time to finish|||Nâng mọi timeout của proxy trên đường đi lên 300 s, để request dài duy nhất kịp xong",
              "Stream the CSV in chunks as it is produced, so the proxy sees bytes before the 100-second limit|||Truyền CSV từng mẩu ngay khi tạo ra, để proxy thấy dữ liệu trước mốc 100 giây",
              "POST /v2/exports answers 202 Accepted with Location: /v2/jobs/{id}; the client polls the job and downloads the result|||POST /v2/exports trả 202 Accepted kèm Location: /v2/jobs/{id}; client hỏi trạng thái việc rồi tải kết quả",
              "Return 504 Gateway Timeout immediately and ask the user to pick a shorter date range instead|||Trả 504 Gateway Timeout ngay và bảo người dùng chọn khoảng ngày ngắn hơn",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: Lesson 10.1: the synchronous version got a 524 at 100 s while the server kept working (and a retry doubled the work); 202 + a job resource answered in 17 ms. Streaming (B) helps some proxies but keeps a long request open and loses everything on a disconnect.|||VI: Bài 10.1: bản đồng bộ nhận 524 ở giây 100 trong khi server vẫn làm tiếp (và bấm lại là nhân đôi công việc); 202 + tài nguyên công việc trả lời trong 17 ms. Truyền từng mẩu (B) giúp với vài proxy nhưng vẫn giữ một request dài và mất sạch khi rớt mạng.",
          },
          {
            question: "LabFlow saves a booking and then publishes its event to Redis. Redis is unreachable for 1.5 s. What did Chapter 10 measure, and what replaced it in Chapter 12?|||LabFlow lưu lượt đặt rồi mới phát sự kiện lên Redis. Redis không tới được trong 1,5 s. Chương 10 đo được gì, và Chương 12 thay bằng gì?",
            options: [
              "Nothing lost, because the Redis client queues commands while offline|||Không mất gì, vì client Redis xếp hàng lệnh khi mất kết nối",
              "342 of 1,000 events lost; the event is now an outbox row in the booking's transaction, relayed later|||Mất 342/1.000 sự kiện; giờ sự kiện là một dòng outbox trong transaction của lượt đặt, relay chuyển sau",
              "Bookings failed with 500; Chapter 12 retries the publish three times inside the request|||Lượt đặt hỏng với 500; Chương 12 thử phát lại ba lần trong request",
              "Duplicate events only; Chapter 12 deduplicates them in the API before publishing|||Chỉ có sự kiện trùng; Chương 12 khử trùng trong API trước khi phát",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: The dual write lost 342 events (10.3). In the pg store the event is inserted in the same transaction as the booking and a relay publishes it (12.5): Redis down meant events waited and were delivered when it returned. Retrying in the request (C) still loses events when the process dies between the two writes.|||VI: Ghi kép mất 342 sự kiện (10.3). Trong kho pg, sự kiện được chèn trong cùng transaction với lượt đặt và relay phát nó (12.5): Redis sập thì sự kiện chờ và được giao khi nó quay lại. Thử lại trong request (C) vẫn mất sự kiện khi tiến trình chết giữa hai lần ghi.",
          },
          {
            question: "A webhook receiver gets the same booking.cancelled event twice because LabFlow retried after a timeout. What should the receiver do?|||Bên nhận webhook nhận cùng sự kiện booking.cancelled hai lần vì LabFlow thử lại sau một lần quá giờ. Bên nhận nên làm gì?",
            options: [
              "Reject the second copy with 409 Conflict so that LabFlow stops retrying the delivery|||Từ chối bản thứ hai bằng 409 Conflict để LabFlow ngừng thử giao lại",
              "Verify the signature, then process both copies, since every delivery is a new event|||Kiểm chữ ký, rồi xử lý cả hai bản, vì mỗi lần giao là một sự kiện mới",
              "Return 410 Gone so that LabFlow disables the subscription because of the duplicates|||Trả 410 Gone để LabFlow tắt đăng ký vì các bản trùng lặp",
              "Verify the signature, record the message id with the effect in one transaction, answer 2xx to the duplicate|||Kiểm chữ ký, ghi id thông điệp cùng hiệu ứng trong một transaction, trả 2xx cho bản trùng",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: Webhooks are delivered at least once (10.5–10.6): the receiver deduplicates by message id, recorded together with the effect, and still answers 2xx so the sender stops. 409 (A) makes the sender retry more; 410 (C) means “stop sending forever”.|||VI: Webhook được giao ít nhất một lần (10.5–10.6): bên nhận khử trùng theo id thông điệp, ghi cùng hiệu ứng, và vẫn trả 2xx để bên gửi dừng. 409 (A) khiến bên gửi thử lại nhiều hơn; 410 (C) nghĩa là “ngừng gửi mãi mãi”.",
          },
          {
            question: "In an interview you are asked to design a URL shortener. Which first two minutes match the Chapter 11 framework?|||Khi phỏng vấn bạn được yêu cầu thiết kế dịch vụ rút gọn link. Hai phút đầu nào đúng khung của Chương 11?",
            options: [
              "Ask who calls it, the core use cases, out of scope, the peak rate and read:write — then size it in numbers|||Hỏi ai gọi, các use case chính, cái gì ngoài phạm vi, tốc độ đỉnh và tỉ lệ đọc:ghi — rồi ước lượng bằng con số",
              "Draw the load balancer, cache and database boxes first, then ask which features matter|||Vẽ hộp load balancer, cache và CSDL trước, rồi mới hỏi tính năng nào quan trọng",
              "Explain Base62 encoding in detail first, since generating the codes is the hard part|||Giải thích chi tiết Base62 trước, vì sinh mã mới là phần khó nhất",
              "Recite the CAP theorem and choose availability over consistency before anything else|||Đọc định lý CAP và chọn sẵn sàng hơn nhất quán trước mọi thứ khác",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: Step 1 of the 45-minute plan is clarify + size (11.1); every later choice points back to those answers. Drawing boxes first (B) is the most common failure the lesson names.|||VI: Bước 1 của khung 45 phút là làm rõ + ước lượng (11.1); mọi lựa chọn sau đều dẫn về các câu trả lời đó. Vẽ hộp trước (B) là lỗi phổ biến nhất mà bài nêu tên.",
          },
          {
            question: "Fifty students press “Book” for the same lab and slot at the same moment, spread across two API instances. In the Chapter 12 version, what decides that exactly one wins?|||Năm mươi sinh viên cùng bấm “Đặt” cho cùng phòng, cùng khung giờ, chia qua hai instance API. Trong bản Chương 12, cái gì quyết định đúng một người thắng?",
            options: [
              "A check for overlapping bookings in the route before the INSERT|||Một phép kiểm lượt chồng giờ trong route trước câu INSERT",
              "The EXCLUDE USING gist constraint on (lab_id, time range); the losers' 23P01 becomes 409|||Ràng buộc EXCLUDE USING gist trên (lab_id, khoảng giờ); lỗi 23P01 của người thua thành 409",
              "The Redis rate limit, which lets only one booking per second through|||Rate limit Redis, chỉ cho một lượt đặt mỗi giây đi qua",
              "The Idempotency-Key, because all fifty requests carry the same body|||Idempotency-Key, vì năm mươi request mang cùng body",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: Measured in 12.3: the RAM store accepted one booking per instance (two for one room); PostgreSQL's exclusion constraint let exactly one INSERT through and 49 got 409 with conflictWith. The route check (A) is a race across instances; idempotency keys (D) are per caller, and these are fifty different callers.|||VI: Đo ở 12.3: kho RAM nhận mỗi instance một lượt (hai lượt cho một phòng); ràng buộc loại trừ của PostgreSQL cho đúng một câu INSERT đi qua và 49 người nhận 409 kèm conflictWith. Kiểm ở route (A) là cuộc đua qua các instance; khoá idempotency (D) theo từng người gọi, mà đây là năm mươi người khác nhau.",
          },
          {
            question: "Cursor pages over a bulk-inserted table lost 900 of 1,000 rows. What was the cause?|||Trang con trỏ trên một bảng nhập lô làm mất 900/1.000 dòng. Nguyên nhân là gì?",
            options: [
              "The keyset query used OFFSET internally after the first page, and that skipped rows|||Câu keyset dùng OFFSET bên trong từ trang thứ hai, và chính nó bỏ qua dòng",
              "The index was missing, so PostgreSQL returned the rows of each page in a random order|||Thiếu index, nên PostgreSQL trả dòng của mỗi trang theo thứ tự ngẫu nhiên",
              "The rows had identical microsecond timestamps while the cursor kept only milliseconds; timestamptz(3) fixed it|||Các dòng có cùng thời điểm micro giây trong khi con trỏ chỉ giữ mili giây; timestamptz(3) sửa được",
              "The cursor's fingerprint stopped matching because the filter changed between two pages|||Dấu vân tay của con trỏ không còn khớp vì bộ lọc đổi giữa hai trang",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: A single INSERT gives every row the same now(); the cursor's ISO string dropped three digits, so the next page started “before” all of them (12.1). The query was a correct keyset (A, B wrong); a fingerprint mismatch (D) answers 400 CURSOR_MISMATCH instead of silently losing rows.|||VI: Một câu INSERT cho mọi dòng cùng một now(); chuỗi ISO trong con trỏ rơi mất ba chữ số, nên trang sau bắt đầu “trước” tất cả chúng (12.1). Câu truy vấn là keyset đúng (A, B sai); lệch dấu vân tay (D) trả 400 CURSOR_MISMATCH chứ không âm thầm mất dòng.",
          },
          {
            question: "The pool has max 10 connections and a 2-second wait timeout. Twenty slow queries arrive at once. What does LabFlow do with the ones that cannot get a connection in time?|||Pool có tối đa 10 kết nối và thời hạn chờ 2 giây. Hai mươi truy vấn chậm tới cùng lúc. LabFlow làm gì với những truy vấn không mượn kịp kết nối?",
            options: [
              "Answer 503 DEPENDENCY_DOWN with Retry-After, so clients retry instead of hanging|||Trả 503 DEPENDENCY_DOWN kèm Retry-After, để client thử lại thay vì treo",
              "Open extra connections above max until PostgreSQL refuses them|||Mở thêm kết nối vượt max tới khi PostgreSQL từ chối",
              "Wait as long as needed, because node-postgres never times out|||Chờ bao lâu cũng được, vì node-postgres không bao giờ hết thời hạn",
              "Answer 500 INTERNAL, because a pool timeout is a server bug|||Trả 500 INTERNAL, vì hết thời hạn mượn pool là lỗi của server",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: Measured in 12.3: with max 2 and a 500 ms wait, 10 of 20 queries failed fast with “timeout exceeded when trying to connect”; src/pg.js maps that to 503 + Retry-After. Without a timeout (C is pg's default, connectionTimeoutMillis 0) requests just hang. 500 (D) tells clients not to retry.|||VI: Đo ở 12.3: với max 2 và chờ 500 ms, 10/20 truy vấn hỏng nhanh với “timeout exceeded when trying to connect”; src/pg.js đổi nó thành 503 + Retry-After. Không có thời hạn (C là mặc định của pg, connectionTimeoutMillis 0) thì request chỉ treo. 500 (D) bảo client đừng thử lại.",
          },
          {
            question: "Redis is down for a minute. Which behaviour did LabFlow choose and test in Chapter 12?|||Redis sập một phút. LabFlow đã chọn và thử hành vi nào ở Chương 12?",
            options: [
              "Every request answers 503 with Retry-After, because rate limiting can no longer be enforced safely|||Mọi request trả 503 kèm Retry-After, vì không còn thi hành rate limit an toàn được nữa",
              "The instance exits with code 1 so that the orchestrator restarts it on a node where Redis is reachable|||Instance thoát với mã 1 để trình điều phối khởi động lại nó ở node tới được Redis",
              "Bookings are buffered in the instance's memory and written to PostgreSQL in a batch when Redis returns|||Lượt đặt được đệm trong bộ nhớ instance và ghi theo lô vào PostgreSQL khi Redis quay lại",
              "Rate limits fail open to local buckets, the cache is bypassed, tickets answer 503, /ready stays 200, events wait in the outbox|||Rate limit mở cửa về xô cục bộ, cache bị bỏ qua, vé trả 503, /ready vẫn 200, sự kiện chờ trong outbox",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: Redis holds no truth, so 12.4 decided per feature and measured it: 7 × 201 during the outage, cache BYPASS, ticket 503, and the 7 waiting outbox rows plus 7 emails delivered after Redis returned. Failing closed (A) would turn a cache outage into a full outage.|||VI: Redis không giữ sự thật, nên 12.4 quyết định theo từng tính năng và đo: 7 × 201 trong sự cố, cache BYPASS, vé 503, và 7 dòng outbox đang chờ cùng 7 email được giao sau khi Redis quay lại. Đóng cửa khi hỏng (A) sẽ biến sự cố cache thành sập toàn bộ.",
          },
          {
            question: "Sending the confirmation email inside POST /v2/bookings, with the provider down, produced what?|||Gửi email xác nhận ngay trong POST /v2/bookings, khi nhà cung cấp sập, dẫn tới gì?",
            options: [
              "201 for every booking, because email errors are ignored by Express|||201 cho mọi lượt đặt, vì Express bỏ qua lỗi email",
              "500 for the user although the booking was saved; a retry then got 409 against their own booking|||500 cho người dùng dù lượt đặt đã lưu; bấm lại thì nhận 409 với chính lượt của mình",
              "A rolled-back booking, because the email was in the same database transaction|||Lượt đặt bị rollback, vì email nằm trong cùng transaction CSDL",
              "A 503 with Retry-After, because the provider is a dependency|||503 kèm Retry-After, vì nhà cung cấp là một phụ thuộc",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: Measured in 12.5: 5 × 500 while the table grew from 20 to 25 rows, then 409 BOOKING_CONFLICT on the retry. An email is not a database operation, so nothing rolls it back (C). The queued design answered 201 in ~4–6 ms and delivered the emails after recovery.|||VI: Đo ở 12.5: 5 × 500 trong khi bảng tăng từ 20 lên 25 dòng, rồi 409 BOOKING_CONFLICT khi bấm lại. Email không phải thao tác CSDL nên không gì rollback được nó (C). Thiết kế qua hàng đợi trả 201 trong ~4–6 ms và giao email sau khi hồi.",
          },
          {
            question: "During a deploy, instance A receives SIGTERM while serving load. Which sequence gave zero errors in Chapter 12?|||Khi triển khai, instance A nhận SIGTERM giữa lúc đang có tải. Thứ tự nào cho không lỗi nào ở Chương 12?",
            options: [
              "Call process.exit(0) at once; the load balancer will notice the closed port and send the traffic elsewhere|||Gọi process.exit(0) ngay; load balancer sẽ thấy cổng đóng và gửi request đi chỗ khác",
              "Close the database pool first so no new queries start, then stop accepting new connections and exit|||Đóng pool CSDL trước để không truy vấn mới nào bắt đầu, rồi ngừng nhận kết nối mới và thoát",
              "/ready ⇒ 503, keep serving during a drain longer than the health-check interval, server.close for in-flight requests, close the pool, exit|||/ready ⇒ 503, vẫn phục vụ trong thời gian xả dài hơn chu kỳ kiểm sức khoẻ, server.close cho request dở, đóng pool, thoát",
              "Restart the process immediately with the new code, keeping the same port so clients reconnect in place|||Khởi động lại tiến trình ngay với mã mới, giữ nguyên cổng để client nối lại tại chỗ",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: Measured in 12.7: exiting at once gave 622 × 502 plus broken sockets; the drained shutdown gave none. Closing the pool first (B) fails every in-flight request that still needs the database.|||VI: Đo ở 12.7: thoát ngay cho 622 × 502 cùng socket gãy; tắt có xả không lỗi nào. Đóng pool trước (B) làm hỏng mọi request đang dở còn cần CSDL.",
          },
          {
            question: "Your CV says: “Built a booking API with Node.js and PostgreSQL.” Which rewrite follows Lesson 12.8?|||CV của bạn ghi: “Xây API đặt phòng bằng Node.js và PostgreSQL.” Cách viết lại nào theo đúng bài 12.8?",
            options: [
              "Built a scalable, high-performance, enterprise-grade booking API with modern cloud-native technologies|||Xây API đặt phòng có khả năng mở rộng, hiệu năng cao, chuẩn doanh nghiệp bằng công nghệ cloud-native hiện đại",
              "Built a booking API that handles 10,000 concurrent users with zero downtime and 99.99% uptime|||Xây API đặt phòng chịu 10.000 người dùng đồng thời, không gián đoạn, uptime 99,99%",
              "Learned Node.js, PostgreSQL, Redis, BullMQ, OpenAPI, Docker and Prometheus during the course|||Học Node.js, PostgreSQL, Redis, BullMQ, OpenAPI, Docker và Prometheus trong khoá học",
              "Built a booking REST API (Node 22, PostgreSQL, Redis) on two instances with zero double bookings under 50 concurrent requests, measured|||Xây REST API đặt phòng (Node 22, PostgreSQL, Redis) trên hai instance, không đặt trùng lần nào với 50 request đồng thời, có số đo",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: A strong line names the stack, the guarantee and a number you can reproduce (12.8). B has a number nobody measured — the first follow-up question breaks it; A is adjectives; C lists tools without what you achieved.|||VI: Dòng mạnh nêu công nghệ, điều được bảo đảm và một con số bạn tái tạo được (12.8). B có con số chưa ai đo — câu hỏi nối đầu tiên làm nó vỡ; A toàn tính từ; C liệt kê công cụ mà không nói làm được gì.",
          },
        ],
      },
    },
  ],
};
