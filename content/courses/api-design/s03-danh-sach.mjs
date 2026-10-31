/**
 * API Design — Chương 3: Danh sách — phân trang, lọc, sắp xếp (soạn chi tiết 01/11/2026).
 * Output CHẠY THẬT: Node v22.23.3, Express 5.3.0, Zod 4.6.7, curl 8.7.1, jq 1.7.1; số đo phân trang/index trên PostgreSQL 18.4 (1 triệu dòng, máy local).
 * Mã cuối chương = lời giải Lab 3 (bài 3.5). Slide: api-03-1 … api-03-4 + api-lab-3; giảng EN/VI ở ./giang/.
 * Tệp được sinh một lần bằng script ngoài repo — từ nay SỬA THẲNG tệp này, giữ luật thoát ký tự (_HOP-DONG.md mục 3).
 * GIỮ slug cũ api-3-1-offset, api-3-2-cursor, api-3-3-loc, api-3-4-sap-xep và title chương.
 */

import G031 from './giang/api-03-1.mjs';
import G032 from './giang/api-03-2.mjs';
import G033 from './giang/api-03-3.mjs';
import G034 from './giang/api-03-4.mjs';
import GL3 from './giang/api-lab-3.mjs';

export default {
  title: 'Chapter 3 — Collections: pagination, filtering, sorting|||Chương 3 — Danh sách: phân trang, lọc, sắp xếp',
  description: 'Phân trang offset và vấn đề đo được (trùng dòng, trang sâu 78 ms, đếm tổng), con trỏ keyset (0,064 ms ở độ sâu 900 000), bộ lọc có kiểu gắn với con trỏ và index, sort/fields/include dạng danh sách cho phép, N+1 — trên LabFlow và PostgreSQL một triệu dòng; lab có rubric và quiz 10 câu.',
  lessons: [
    /* ─────────────────────────── 3.1 ─────────────────────────── */
    {
      title: '3.1 — Offset pagination and its problems: limit, stable order, duplicates, deep pages|||3.1 — Phân trang offset và vấn đề của nó: limit, thứ tự ổn định, trùng dòng, trang sâu',
      slug: 'api-3-1-offset',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Dựng limit/offset có mặc định, tối đa, khoá phụ và header Link trên LabFlow; đo dòng trùng khi dữ liệu đổi và chi phí OFFSET sâu, count(*) trên PostgreSQL một triệu dòng.',
      content: `${G031}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Offset pagination and its problems</h2>
<p class="lead">Until now <code>GET /bookings</code> returned everything. With 200 bookings that is 31 KB in one answer; with a year of data it would be megabytes, and every app screen would wait for all of it. Pagination — returning a list one <strong>page</strong> at a time — is the first thing a real list endpoint needs. This lesson builds the classic version, <code>limit</code> + <code>offset</code>, on LabFlow, then measures its three problems: duplicates while data changes, slow deep pages, and the cost of the total count.</p>

<div class="callout ok">
<p><strong>After Chapter 3 you can:</strong></p>
<ul>
  <li>explain, with measurements, why offset paging breaks on big and changing lists;</li>
  <li>build cursor (keyset) pagination that stays fast at any depth;</li>
  <li>design filters and sorting that are safe to promise forever;</li>
  <li>return related data without the N+1 problem.</li>
</ul>
<p><strong>Why it matters:</strong> Every real list grows: what is instant with 50 rows times out with a million — this chapter measures it on PostgreSQL.</p>
</div>

<h3>Data to page through</h3>
<p>Paging three bookings is not convincing. <code>src/seed.js</code> generates a fixed set of bookings — same ids, times and order every run, so your output will match the lesson:</p>
<pre><code class="language-javascript">// seed.js — dữ liệu mẫu CỐ ĐỊNH để học phân trang: SEED_BOOKINGS=200 npm run dev
// Cùng một số n ⇒ cùng id, cùng giờ, cùng thứ tự ⇒ output trong bài tái lập được.
const PURPOSES = ['SWT301 Lab 3', 'PRJ301 Assignment', 'NWC204 Lab 2', 'SDN302 Project', 'CLB IoT'];

export function seedBookings(n) {
  const out = [];
  for (let i = 1; i &lt;= n; i++) {
    const slotIndex = Math.floor((i - 1) / 3);              // 3 phòng chạy song song
    const day = Math.floor(slotIndex / 5), slot = slotIndex % 5;   // 5 ca 2 giờ mỗi ngày (07:00–17:00 giờ VN)
    const start = Date.UTC(2026, 10, 2) + day * 86400000 + slot * 7200000;
    const created = Date.UTC(2026, 9, 1) + i * 60000;        // mỗi lượt tạo cách nhau 1 phút
    const cancelled = i % 7 === 0;
    out.push({
      id: &#96;bk_\${i}&#96;, labId: &#96;lab_\${((i - 1) % 3) + 1}&#96;, userId: i % 2 ? 'usr_1' : 'usr_2',
      startAt: new Date(start).toISOString(), endAt: new Date(start + 7200000).toISOString(),
      purpose: PURPOSES[i % PURPOSES.length], status: cancelled ? 'CANCELLED' : 'PENDING',
      createdAt: new Date(created).toISOString(),
      ...(cancelled &amp;&amp; { cancelledAt: new Date(created + 3600000).toISOString() }),
    });
  }
  return out;
}</code></pre>
<p>In <code>src/db.js</code> the array starts with the seed, and the id counter continues after it:</p>
<pre><code class="language-javascript">import { seedBookings } from './seed.js';

// SEED_BOOKINGS=n ⇒ nạp sẵn n lượt đặt cố định (Chương 3: phân trang)
export const bookings = seedBookings(Number(process.env.SEED_BOOKINGS ?? 0));
// …
const counters = { bk: bookings.length, dev: devices.length, iss: 0 };</code></pre>
<pre><code class="language-bash">SEED_BOOKINGS=200 npm run dev</code></pre>

<h3>The contract: limit, offset, a stable order</h3>
<p><code>limit</code> is the page size; <code>offset</code> is how many items to skip. Page 3 of 20 is <code>limit=20&amp;offset=40</code>. Four decisions make this a contract rather than a guess:</p>
<ol>
  <li><strong>A default and a maximum.</strong> 20 if absent, at most 100. A client asking for 500 gets a <code>400</code> — not a silent cut to 100, which would make it believe it has everything.</li>
  <li><strong>A stable order.</strong> “Page 2” means nothing unless the order is fixed. LabFlow sorts newest first by <code>createdAt</code>, and when two bookings share a <code>createdAt</code>, by id — a <strong>tie-breaker</strong> so that no two rows are ever “equal”.</li>
  <li><strong>Where the next page is.</strong> The <code>Link</code> header (RFC 8288) with <code>rel="next"</code> carries the URL; a generic client can follow it without knowing our parameters.</li>
  <li><strong>Metadata next to the data</strong> — <code>page</code>, the member lesson 2.3 left room for.</li>
</ol>
<pre><code class="language-javascript">// schemas.js — Chương 3: phân trang offset
export const BookingsQuery = z.strictObject({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

// paging.js — thứ tự ỔN ĐỊNH: mới tạo trước; trùng createdAt thì id lớn trước
export const idNum = (id) =&gt; Number(id.slice(id.indexOf('_') + 1));
export const newestFirst = (a, b) =&gt; b.createdAt.localeCompare(a.createdAt) || idNum(b.id) - idNum(a.id);

// routes/bookings.js
  .get(validate('query', BookingsQuery), (req, res) =&gt; {
    const { limit, offset } = req.valid.query;
    const mine = req.user.role === 'LAB_MANAGER' ? bookings : bookings.filter((b) =&gt; b.userId === req.user.id);
    const all = [...mine].sort(newestFirst);                 // thứ tự cố định: không có thì "trang 2" vô nghĩa
    const data = all.slice(offset, offset + limit);
    if (offset + limit &lt; all.length) res.links({ next: &#96;/bookings?limit=\${limit}&amp;offset=\${offset + limit}&#96; });
    res.json({ data: data.map(toBooking), page: { limit, offset, total: all.length } });
  })</code></pre>
<p>Why <code>idNum</code> and not comparing ids as text? Because as strings <code>"bk_10" &lt; "bk_9"</code>. Ids are compared by their number.</p>

<h3>Try it</h3>
<pre><code class="language-bash">curl -i 'http://localhost:4000/bookings?limit=3' -H 'Authorization: Bearer tok_lan'</code></pre>
<div class="out">HTTP/1.1 200 OK
Link: &lt;/bookings?limit=3&amp;offset=3&gt;; rel="next"
Content-Type: application/json; charset=utf-8
Content-Length: 997
ETag: W/"3e5-fBZS2FJ3mOqSfczM4nZ3O9Ty7RQ"
Date: Sat, 31 Oct 2026 19:19:31 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "data": [
    {
      "id": "bk_200",
      "labId": "lab_2",
      "userId": "usr_2",
      "startAt": "2026-11-15T02:00:00.000Z",
      "endAt": "2026-11-15T04:00:00.000Z",
      "purpose": "SWT301 Lab 3",
      "status": "PENDING",
      "createdAt": "2026-10-01T03:20:00.000Z",
      "cancelledAt": null
    },
    {
      "id": "bk_199",
      "labId": "lab_1",
      "userId": "usr_1",
      "startAt": "2026-11-15T02:00:00.000Z",
      "endAt": "2026-11-15T04:00:00.000Z",
      "purpose": "CLB IoT",
      "status": "PENDING",
      "createdAt": "2026-10-01T03:19:00.000Z",
      "cancelledAt": null
    },
    {
      "id": "bk_198",
      "labId": "lab_3",
      "userId": "usr_2",
      "startAt": "2026-11-15T00:00:00.000Z",
      "endAt": "2026-11-15T02:00:00.000Z",
      "purpose": "SDN302 Project",
      "status": "PENDING",
      "createdAt": "2026-10-01T03:18:00.000Z",
      "cancelledAt": null
    }
  ],
  "page": {
    "limit": 3,
    "offset": 0,
    "total": 200
  }
}</div>
<p>The <code>Link</code> header points to the next page, and <code>page.total</code> says there are 200. To read just the ids we pipe to <strong>jq</strong>, a command-line JSON tool (preinstalled on macOS; <code>sudo apt install jq</code> on Ubuntu, or <code>winget install jqlang.jq</code> on Windows):</p>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?limit=3&amp;offset=3' \\
  -H 'Authorization: Bearer tok_lan' | jq -c '.data[] | [.id, .createdAt]'</code></pre>
<div class="out">["bk_197","2026-10-01T03:17:00.000Z"]
["bk_196","2026-10-01T03:16:00.000Z"]
["bk_195","2026-10-01T03:15:00.000Z"]</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?limit=500' -H 'Authorization: Bearer tok_lan'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/invalid-query",
  "title": "Tham số truy vấn không hợp lệ",
  "status": 400,
  "detail": "1 lỗi trong tham số truy vấn",
  "instance": "/bookings?limit=500",
  "code": "INVALID_QUERY",
  "errors": [
    {
      "parameter": "limit",
      "detail": "Quá lớn: mong đợi number &lt;=100"
    }
  ]
}</div>
<p>A student sees only her own bookings — the filter runs <em>before</em> paging, so <code>total</code> is hers, 100:</p>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?limit=2' \\
  -H 'Authorization: Bearer tok_bin' | jq -c '{ids: [.data[].id], page}'</code></pre>
<div class="out">{"ids":["bk_200","bk_198"],"page":{"limit":2,"offset":0,"total":100}}</div>

<h3>Problem 1 — the list moves under your feet</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">page 1</span><span class="lz-t">offset 0, limit 20</span><span class="lz-d">rows 1–20 of “newest first”</span></div>
  <div class="lz-step"><span class="lz-k">meanwhile</span><span class="lz-t">a new booking arrives</span><span class="lz-d">every row moves down by one</span></div>
  <div class="lz-step"><span class="lz-k">page 2</span><span class="lz-t">offset 20</span><span class="lz-d">old row 20 is now row 21 — shown again</span></div>
  <div class="lz-step"><span class="lz-k">result</span><span class="lz-t">duplicate or gap</span><span class="lz-d">offset counts rows, not positions in time</span></div>
</div>
<p>An offset is a position, and positions shift when the data changes. Lan opens page 1; meanwhile An makes a booking; Lan opens page 2:</p>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?limit=5' \\
  -H 'Authorization: Bearer tok_lan' | jq -c '[.data[].id]'</code></pre>
<div class="out">["bk_200","bk_199","bk_198","bk_197","bk_196"]</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_1","startAt":"2027-01-04T08:00:00+07:00","endAt":"2027-01-04T10:00:00+07:00"}' | jq -c '{id, createdAt}'</code></pre>
<div class="out">{"id":"bk_201","createdAt":"2026-10-31T19:19:31.992Z"}</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?limit=5&amp;offset=5' \\
  -H 'Authorization: Bearer tok_lan' | jq -c '[.data[].id]'</code></pre>
<div class="out">["bk_196","bk_195","bk_194","bk_193","bk_192"]</div>
<p><code>bk_196</code> appears on both pages. The new booking took position 1, every older one moved down by one, and “skip 5” now skips one fewer old booking. The mirror image happens when a row disappears — cancelled bookings hidden by a filter, a deleted device: everything moves up and one row is <strong>never shown</strong>. A feed with infinite scroll shows duplicates; an export that walks every page silently misses rows.</p>

<h3>Problem 2 — deep pages get slower</h3>
<p>Our array lives in memory, so it cannot show this. A database can. On a local PostgreSQL 18 with one million bookings and an index on <code>(created_at DESC, id DESC)</code> (Chapter 12 teaches the details; here we only measure), the same 20 rows from three depths:</p>
<pre><code class="language-sql">EXPLAIN (ANALYZE, COSTS OFF) SELECT id, created_at FROM bookings ORDER BY created_at DESC, id DESC LIMIT 20 OFFSET 0;
EXPLAIN (ANALYZE, COSTS OFF) SELECT id, created_at FROM bookings ORDER BY created_at DESC, id DESC LIMIT 20 OFFSET 100000;
EXPLAIN (ANALYZE, COSTS OFF) SELECT id, created_at FROM bookings ORDER BY created_at DESC, id DESC LIMIT 20 OFFSET 900000;</code></pre>
<div class="out"> Limit (actual time=0.037..0.039 rows=20.00 loops=1)
   -&gt;  Index Only Scan using bookings_newest on bookings (actual time=0.037..0.038 rows=20.00 loops=1)
 Execution Time: 0.053 ms

 Limit (actual time=9.026..9.028 rows=20.00 loops=1)
   -&gt;  Index Only Scan using bookings_newest on bookings (actual time=0.004..6.917 rows=100020.00 loops=1)
 Execution Time: 9.037 ms

 Limit (actual time=78.305..78.307 rows=20.00 loops=1)
   -&gt;  Index Only Scan using bookings_newest on bookings (actual time=0.006..59.285 rows=900020.00 loops=1)
 Execution Time: 78.316 ms</div>
<p>Read the <code>rows=</code> of the inner scan: to return 20 rows at offset 900 000 the database walks <strong>900 020</strong> index entries and throws away all but 20. The index helps find the <em>start</em> of the order, not the 900 000th position. Cost grows with depth: 0.05 ms, 9 ms, 78 ms — for the same page size. A crawler or a bored user clicking “last page” pays the most.</p>

<h3>Problem 3 — the total is not free</h3>
<div class="out">EXPLAIN (ANALYZE, COSTS OFF) SELECT count(*) FROM bookings;
 Finalize Aggregate (actual time=23.741..25.152 rows=1.00 loops=1)
   -&gt;  Parallel Seq Scan on bookings (actual time=0.136..13.437 rows=333333.33 loops=3)
 Execution Time: 25.178 ms</div>
<p>An exact <code>total</code> means counting every matching row on every request — here 25 ms, 500 times more than fetching the first page. Options: send the total only on the first page, send an estimate, or send just “is there a next page?” (which LabFlow’s next lesson does).</p>
<div class="callout ok"><p><strong>When offset is fine.</strong> Small lists that rarely change (the 4 labs, a lecturer’s 30 classes), and admin tables where users really want “page 7 of 12”. For feeds, exports, sync and anything large or busy, use the cursor of lesson 3.2.</p></div>

<div class="pitfall"><p><strong>Trap — paging without an ORDER.</strong> Without a defined order, a database may return rows in any order, and it may differ between two calls; pages then overlap at random. Always sort, always with a unique tie-breaker.</p></div>
<div class="pitfall"><p><strong>Trap — trusting <code>limit</code>.</strong> <code>?limit=1000000</code> on an endpoint without a maximum is a free denial-of-service: one request makes the server build a huge response. OWASP lists it as <em>API4:2023 Unrestricted Resource Consumption</em>.</p></div>

<h3>In interviews and at work</h3>
<p><strong>“How do you paginate?”</strong> Mention both: offset/limit (simple, page numbers, but duplicates/skips while data changes and slow deep pages because the database walks the skipped rows) and cursor/keyset (stable and fast at any depth, but no jumping to page N). Choose by use case; always a stable order with a tie-breaker and a maximum page size.</p>
<p><strong>“Why not return the total?”</strong> It costs a full count on every call. Return it only where the UI really needs it.</p>

<a class="link-card" href="https://www.postgresql.org/docs/current/queries-limit.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: PostgreSQL 18 docs — LIMIT and OFFSET — read 1 Nov 2026</span><span class="lc-sub">“The rows skipped by an OFFSET clause still have to be computed inside the server” — and LIMIT needs an ORDER BY with a unique order.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
  <li>Add the seed and the offset version; reproduce the outputs above with <code>SEED_BOOKINGS=200</code>.</li>
  <li>Reproduce the duplicate, then reproduce the opposite: change a booking so it no longer matches (cancel it while listing with a status filter you add yourself) and find the row that is never shown.</li>
  <li>Remove the <code>idNum</code> tie-breaker and sort with <code>b.id.localeCompare(a.id)</code>. Which ids come first? Explain with <code>"bk_10" &lt; "bk_9"</code>.</li>
  <li>Write a 10-line Node script that follows the <code>Link</code> header until it disappears and counts the bookings it saw.</li>
</ol>
<p><strong>Done when:</strong> pages of 20 come back newest first with a <code>Link</code> to the next page, <code>limit=101</code> gives 400, and you can show one duplicate and one missing row caused by changing data.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Pagination</span><span class="v">Returning a long list one page at a time.</span></div>
  <div class="kv"><span class="k">limit / offset</span><span class="v">Page size / how many items to skip.</span></div>
  <div class="kv"><span class="k">Stable order</span><span class="v">A sort with a unique tie-breaker, so every call orders the same rows the same way.</span></div>
  <div class="kv"><span class="k">Link header (RFC 8288)</span><span class="v">Response header carrying related URLs, e.g. <code>rel="next"</code>.</span></div>
  <div class="kv"><span class="k">Deep page</span><span class="v">A page far into the list; with OFFSET the database walks every skipped row.</span></div>
  <div class="kv"><span class="k">EXPLAIN ANALYZE</span><span class="v">PostgreSQL command that runs a query and shows the plan and real timings.</span></div>
  <div class="kv"><span class="k">Unrestricted resource consumption</span><span class="v">OWASP API4:2023 — requests that make the server do unbounded work.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Never return an unbounded list: a default page size and a maximum, refused with 400 above it.</li>
  <li>Paging needs a stable order with a unique tie-breaker (ids compared as numbers).</li>
  <li>Send the next page as a <code>Link</code> header and in <code>page</code>.</li>
  <li>Offset breaks while data changes: measured duplicate <code>bk_196</code>; deletions hide rows.</li>
  <li>Deep offsets cost more: 0.05 → 9 → 78 ms for the same 20 rows on a million; an exact total costs a full count.</li>
  <li>Offset is fine for small, stable lists and page-number UIs; large or busy lists need cursors (3.2).</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/java-web-application-development/learn?lessonSlug=prj301-pagination" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">You met this in PRJ301 — lesson 6.3: search, sorting and paging</span><span class="lc-sub">If you took PRJ301 on Academy, OFFSET/FETCH and the page formula are the same mechanism. Same: offset = (page − 1) × pageSize, an ORDER BY is required, a whitelist for the sort column. Different: PRJ301 renders pages in JSP; here the API returns pages to any client. This lesson adds: a maximum page size, a tie-breaker, the Link header, and measured problems — duplicates while data changes and 78 ms deep pages on a million rows. Not taken PRJ301? This lesson stands on its own.</span></span>
  <span class="lc-cta">OPEN PRJ301 LESSON →</span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Phân trang offset và những vấn đề của nó</h2>
<p class="lead">Tới giờ <code>GET /bookings</code> trả về tất cả. Với 200 lượt đặt, đó là 31 KB trong một câu trả lời; với dữ liệu cả năm sẽ là hàng megabyte, và màn hình nào của app cũng phải chờ trọn đống đó. Pagination (phân trang) — trả danh sách theo từng <strong>trang</strong> — là thứ đầu tiên một endpoint danh sách thật sự cần. Bài này dựng phiên bản kinh điển, <code>limit</code> + <code>offset</code>, trên LabFlow, rồi đo ba vấn đề của nó: trùng lặp khi dữ liệu thay đổi, trang sâu chậm dần, và cái giá của tổng số dòng.</p>

<div class="callout ok">
<p><strong>Học xong Chương 3 bạn làm được:</strong></p>
<ul>
  <li>giải thích bằng số đo vì sao phân trang offset hỏng với danh sách lớn và hay thay đổi;</li>
  <li>dựng phân trang con trỏ (keyset) nhanh ở mọi độ sâu;</li>
  <li>thiết kế bộ lọc và sắp xếp an toàn để hứa mãi mãi;</li>
  <li>trả dữ liệu liên quan mà không dính N+1.</li>
</ul>
<p><strong>Vì sao đáng học:</strong> Danh sách thật nào cũng lớn dần: thứ tức thì với 50 dòng sẽ quá giờ với một triệu dòng — chương này đo điều đó trên PostgreSQL.</p>
</div>

<h3>Dữ liệu để phân trang</h3>
<p>Phân trang ba lượt đặt thì chẳng thuyết phục ai. <code>src/seed.js</code> sinh ra một bộ lượt đặt cố định — cùng id, cùng giờ, cùng thứ tự ở mọi lần chạy, nên output của bạn sẽ khớp với bài:</p>
<pre><code class="language-javascript">// seed.js — dữ liệu mẫu CỐ ĐỊNH để học phân trang: SEED_BOOKINGS=200 npm run dev
// Cùng một số n ⇒ cùng id, cùng giờ, cùng thứ tự ⇒ output trong bài tái lập được.
const PURPOSES = ['SWT301 Lab 3', 'PRJ301 Assignment', 'NWC204 Lab 2', 'SDN302 Project', 'CLB IoT'];

export function seedBookings(n) {
  const out = [];
  for (let i = 1; i &lt;= n; i++) {
    const slotIndex = Math.floor((i - 1) / 3);              // 3 phòng chạy song song
    const day = Math.floor(slotIndex / 5), slot = slotIndex % 5;   // 5 ca 2 giờ mỗi ngày (07:00–17:00 giờ VN)
    const start = Date.UTC(2026, 10, 2) + day * 86400000 + slot * 7200000;
    const created = Date.UTC(2026, 9, 1) + i * 60000;        // mỗi lượt tạo cách nhau 1 phút
    const cancelled = i % 7 === 0;
    out.push({
      id: &#96;bk_\${i}&#96;, labId: &#96;lab_\${((i - 1) % 3) + 1}&#96;, userId: i % 2 ? 'usr_1' : 'usr_2',
      startAt: new Date(start).toISOString(), endAt: new Date(start + 7200000).toISOString(),
      purpose: PURPOSES[i % PURPOSES.length], status: cancelled ? 'CANCELLED' : 'PENDING',
      createdAt: new Date(created).toISOString(),
      ...(cancelled &amp;&amp; { cancelledAt: new Date(created + 3600000).toISOString() }),
    });
  }
  return out;
}</code></pre>
<p>Trong <code>src/db.js</code>, mảng bắt đầu bằng dữ liệu mẫu, và bộ đếm id chạy tiếp sau đó:</p>
<pre><code class="language-javascript">import { seedBookings } from './seed.js';

// SEED_BOOKINGS=n ⇒ nạp sẵn n lượt đặt cố định (Chương 3: phân trang)
export const bookings = seedBookings(Number(process.env.SEED_BOOKINGS ?? 0));
// …
const counters = { bk: bookings.length, dev: devices.length, iss: 0 };</code></pre>
<pre><code class="language-bash">SEED_BOOKINGS=200 npm run dev</code></pre>

<h3>Hợp đồng: limit, offset, một thứ tự ổn định</h3>
<p><code>limit</code> là kích thước trang; <code>offset</code> là số phần tử bỏ qua. Trang 3, mỗi trang 20 là <code>limit=20&amp;offset=40</code>. Bốn quyết định biến điều này thành hợp đồng chứ không phải phỏng đoán:</p>
<ol>
  <li><strong>Một giá trị mặc định và một mức tối đa.</strong> Không gửi thì 20, nhiều nhất 100. Client xin 500 nhận <code>400</code> — không lặng lẽ cắt còn 100, vì như vậy client sẽ tưởng mình đã có đủ.</li>
  <li><strong>Một thứ tự ổn định.</strong> "Trang 2" vô nghĩa nếu thứ tự không cố định. LabFlow sắp mới nhất trước theo <code>createdAt</code>, và khi hai lượt đặt trùng <code>createdAt</code> thì theo id — một <strong>khoá phụ phân xử</strong> (tie-breaker) để không bao giờ có hai dòng "bằng nhau".</li>
  <li><strong>Trang tiếp theo nằm ở đâu.</strong> Header <code>Link</code> (RFC 8288) với <code>rel="next"</code> mang URL; một client chung chung đi theo được mà không cần biết tham số của ta.</li>
  <li><strong>Siêu dữ liệu đặt cạnh dữ liệu</strong> — trường <code>page</code>, đúng chỗ bài 2.3 đã chừa sẵn.</li>
</ol>
<pre><code class="language-javascript">// schemas.js — Chương 3: phân trang offset
export const BookingsQuery = z.strictObject({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

// paging.js — thứ tự ỔN ĐỊNH: mới tạo trước; trùng createdAt thì id lớn trước
export const idNum = (id) =&gt; Number(id.slice(id.indexOf('_') + 1));
export const newestFirst = (a, b) =&gt; b.createdAt.localeCompare(a.createdAt) || idNum(b.id) - idNum(a.id);

// routes/bookings.js
  .get(validate('query', BookingsQuery), (req, res) =&gt; {
    const { limit, offset } = req.valid.query;
    const mine = req.user.role === 'LAB_MANAGER' ? bookings : bookings.filter((b) =&gt; b.userId === req.user.id);
    const all = [...mine].sort(newestFirst);                 // thứ tự cố định: không có thì "trang 2" vô nghĩa
    const data = all.slice(offset, offset + limit);
    if (offset + limit &lt; all.length) res.links({ next: &#96;/bookings?limit=\${limit}&amp;offset=\${offset + limit}&#96; });
    res.json({ data: data.map(toBooking), page: { limit, offset, total: all.length } });
  })</code></pre>
<p>Vì sao dùng <code>idNum</code> chứ không so id như chuỗi? Vì so chuỗi thì <code>"bk_10" &lt; "bk_9"</code>. Id được so theo con số của nó.</p>

<h3>Chạy thử</h3>
<pre><code class="language-bash">curl -i 'http://localhost:4000/bookings?limit=3' -H 'Authorization: Bearer tok_lan'</code></pre>
<div class="out">HTTP/1.1 200 OK
Link: &lt;/bookings?limit=3&amp;offset=3&gt;; rel="next"
Content-Type: application/json; charset=utf-8
Content-Length: 997
ETag: W/"3e5-fBZS2FJ3mOqSfczM4nZ3O9Ty7RQ"
Date: Sat, 31 Oct 2026 19:19:31 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "data": [
    {
      "id": "bk_200",
      "labId": "lab_2",
      "userId": "usr_2",
      "startAt": "2026-11-15T02:00:00.000Z",
      "endAt": "2026-11-15T04:00:00.000Z",
      "purpose": "SWT301 Lab 3",
      "status": "PENDING",
      "createdAt": "2026-10-01T03:20:00.000Z",
      "cancelledAt": null
    },
    {
      "id": "bk_199",
      "labId": "lab_1",
      "userId": "usr_1",
      "startAt": "2026-11-15T02:00:00.000Z",
      "endAt": "2026-11-15T04:00:00.000Z",
      "purpose": "CLB IoT",
      "status": "PENDING",
      "createdAt": "2026-10-01T03:19:00.000Z",
      "cancelledAt": null
    },
    {
      "id": "bk_198",
      "labId": "lab_3",
      "userId": "usr_2",
      "startAt": "2026-11-15T00:00:00.000Z",
      "endAt": "2026-11-15T02:00:00.000Z",
      "purpose": "SDN302 Project",
      "status": "PENDING",
      "createdAt": "2026-10-01T03:18:00.000Z",
      "cancelledAt": null
    }
  ],
  "page": {
    "limit": 3,
    "offset": 0,
    "total": 200
  }
}</div>
<p>Header <code>Link</code> trỏ tới trang tiếp theo, và <code>page.total</code> cho biết có 200 lượt. Để chỉ đọc id, ta chuyển output sang <strong>jq</strong>, công cụ xử lý JSON trên dòng lệnh (có sẵn trên macOS; Ubuntu cài bằng <code>sudo apt install jq</code>, Windows dùng <code>winget install jqlang.jq</code>):</p>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?limit=3&amp;offset=3' \\
  -H 'Authorization: Bearer tok_lan' | jq -c '.data[] | [.id, .createdAt]'</code></pre>
<div class="out">["bk_197","2026-10-01T03:17:00.000Z"]
["bk_196","2026-10-01T03:16:00.000Z"]
["bk_195","2026-10-01T03:15:00.000Z"]</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?limit=500' -H 'Authorization: Bearer tok_lan'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/invalid-query",
  "title": "Tham số truy vấn không hợp lệ",
  "status": 400,
  "detail": "1 lỗi trong tham số truy vấn",
  "instance": "/bookings?limit=500",
  "code": "INVALID_QUERY",
  "errors": [
    {
      "parameter": "limit",
      "detail": "Quá lớn: mong đợi number &lt;=100"
    }
  ]
}</div>
<p>Sinh viên chỉ thấy lượt đặt của chính mình — bộ lọc chạy <em>trước</em> khi phân trang, nên <code>total</code> là của cô ấy, 100:</p>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?limit=2' \\
  -H 'Authorization: Bearer tok_bin' | jq -c '{ids: [.data[].id], page}'</code></pre>
<div class="out">{"ids":["bk_200","bk_198"],"page":{"limit":2,"offset":0,"total":100}}</div>

<h3>Vấn đề 1 — danh sách xê dịch dưới chân bạn</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">trang 1</span><span class="lz-t">offset 0, limit 20</span><span class="lz-d">dòng 1–20 theo “mới nhất trước”</span></div>
  <div class="lz-step"><span class="lz-k">trong lúc đó</span><span class="lz-t">có lượt đặt mới</span><span class="lz-d">mọi dòng tụt xuống một bậc</span></div>
  <div class="lz-step"><span class="lz-k">trang 2</span><span class="lz-t">offset 20</span><span class="lz-d">dòng 20 cũ giờ là dòng 21 — hiện lại</span></div>
  <div class="lz-step"><span class="lz-k">kết quả</span><span class="lz-t">trùng hoặc sót</span><span class="lz-d">offset đếm dòng, không đếm vị trí theo thời gian</span></div>
</div>
<p>Offset là một vị trí, mà vị trí thì xê dịch khi dữ liệu thay đổi. Cô Lan mở trang 1; trong lúc đó An đặt thêm một lượt; cô Lan mở trang 2:</p>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?limit=5' \\
  -H 'Authorization: Bearer tok_lan' | jq -c '[.data[].id]'</code></pre>
<div class="out">["bk_200","bk_199","bk_198","bk_197","bk_196"]</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_1","startAt":"2027-01-04T08:00:00+07:00","endAt":"2027-01-04T10:00:00+07:00"}' | jq -c '{id, createdAt}'</code></pre>
<div class="out">{"id":"bk_201","createdAt":"2026-10-31T19:19:31.992Z"}</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?limit=5&amp;offset=5' \\
  -H 'Authorization: Bearer tok_lan' | jq -c '[.data[].id]'</code></pre>
<div class="out">["bk_196","bk_195","bk_194","bk_193","bk_192"]</div>
<p><code>bk_196</code> xuất hiện ở cả hai trang. Lượt đặt mới chiếm vị trí số 1, mọi lượt cũ tụt xuống một bậc, và "bỏ qua 5" giờ bỏ qua ít hơn một lượt cũ. Chiều ngược lại xảy ra khi một dòng biến mất — lượt đã huỷ bị bộ lọc giấu đi, một thiết bị bị xoá: mọi thứ dồn lên và một dòng <strong>không bao giờ được hiện</strong>. Một bảng tin cuộn vô tận sẽ hiện trùng; một bản xuất dữ liệu đi qua mọi trang sẽ lặng lẽ bỏ sót dòng.</p>

<h3>Vấn đề 2 — trang càng sâu càng chậm</h3>
<p>Mảng của ta nằm trong RAM nên không cho thấy được điều này. Cơ sở dữ liệu thì có. Trên một PostgreSQL 18 chạy ở máy với một triệu lượt đặt và index trên <code>(created_at DESC, id DESC)</code> (Chương 12 dạy chi tiết; ở đây ta chỉ đo), lấy cùng 20 dòng ở ba độ sâu:</p>
<pre><code class="language-sql">EXPLAIN (ANALYZE, COSTS OFF) SELECT id, created_at FROM bookings ORDER BY created_at DESC, id DESC LIMIT 20 OFFSET 0;
EXPLAIN (ANALYZE, COSTS OFF) SELECT id, created_at FROM bookings ORDER BY created_at DESC, id DESC LIMIT 20 OFFSET 100000;
EXPLAIN (ANALYZE, COSTS OFF) SELECT id, created_at FROM bookings ORDER BY created_at DESC, id DESC LIMIT 20 OFFSET 900000;</code></pre>
<div class="out"> Limit (actual time=0.037..0.039 rows=20.00 loops=1)
   -&gt;  Index Only Scan using bookings_newest on bookings (actual time=0.037..0.038 rows=20.00 loops=1)
 Execution Time: 0.053 ms

 Limit (actual time=9.026..9.028 rows=20.00 loops=1)
   -&gt;  Index Only Scan using bookings_newest on bookings (actual time=0.004..6.917 rows=100020.00 loops=1)
 Execution Time: 9.037 ms

 Limit (actual time=78.305..78.307 rows=20.00 loops=1)
   -&gt;  Index Only Scan using bookings_newest on bookings (actual time=0.006..59.285 rows=900020.00 loops=1)
 Execution Time: 78.316 ms</div>
<p>Đọc <code>rows=</code> của bước quét bên trong: để trả 20 dòng ở offset 900 000, cơ sở dữ liệu đi qua <strong>900 020</strong> mục index rồi vứt hết, chỉ giữ 20. Index giúp tìm <em>điểm đầu</em> của thứ tự, chứ không nhảy thẳng tới vị trí thứ 900 000. Chi phí tăng theo độ sâu: 0,05 ms, 9 ms, 78 ms — cho cùng một kích thước trang. Một con bot thu thập dữ liệu, hay một người dùng tò mò bấm "trang cuối", là người trả giá đắt nhất.</p>

<h3>Vấn đề 3 — tổng số không miễn phí</h3>
<div class="out">EXPLAIN (ANALYZE, COSTS OFF) SELECT count(*) FROM bookings;
 Finalize Aggregate (actual time=23.741..25.152 rows=1.00 loops=1)
   -&gt;  Parallel Seq Scan on bookings (actual time=0.136..13.437 rows=333333.33 loops=3)
 Execution Time: 25.178 ms</div>
<p>Một <code>total</code> chính xác nghĩa là đếm mọi dòng khớp ở mọi request — ở đây mất 25 ms, gấp khoảng 500 lần lấy trang đầu. Các lựa chọn: chỉ gửi tổng ở trang đầu, gửi con số ước lượng, hoặc chỉ gửi "còn trang sau không?" (đúng cách bài sau của LabFlow làm).</p>
<div class="callout ok"><p><strong>Khi nào offset vẫn ổn.</strong> Danh sách nhỏ, ít thay đổi (4 phòng lab, 30 lớp của một giảng viên), và bảng quản trị mà người dùng thật sự cần "trang 7 trên 12". Với bảng tin, xuất dữ liệu, đồng bộ và mọi thứ lớn hay thay đổi liên tục, hãy dùng con trỏ ở bài 3.2.</p></div>

<div class="pitfall"><p><strong>Bẫy — phân trang mà không có ORDER.</strong> Không có thứ tự xác định, cơ sở dữ liệu có thể trả dòng theo thứ tự bất kỳ, và hai lần gọi có thể khác nhau; các trang khi đó chồng lên nhau một cách ngẫu nhiên. Luôn sắp xếp, luôn kèm một khoá phụ duy nhất.</p></div>
<div class="pitfall"><p><strong>Bẫy — tin vào <code>limit</code> của client.</strong> <code>?limit=1000000</code> trên một endpoint không có mức tối đa là một đòn từ chối dịch vụ miễn phí: một request bắt server dựng một response khổng lồ. OWASP xếp nó vào <em>API4:2023 Unrestricted Resource Consumption</em> (tiêu thụ tài nguyên không giới hạn).</p></div>

<h3>Phỏng vấn và đi làm</h3>
<p><strong>"Em phân trang thế nào?"</strong> Nói cả hai: offset/limit (đơn giản, có số trang, nhưng trùng/sót khi dữ liệu đổi và trang sâu chậm vì cơ sở dữ liệu phải đi qua các dòng bị bỏ qua) và cursor/keyset (ổn định và nhanh ở mọi độ sâu, nhưng không nhảy thẳng tới trang N). Chọn theo trường hợp dùng; luôn có thứ tự ổn định kèm khoá phụ và kích thước trang tối đa.</p>
<p><strong>"Sao không trả tổng số?"</strong> Nó tốn một lần đếm toàn bộ ở mọi lời gọi. Chỉ trả khi giao diện thật sự cần.</p>

<a class="link-card" href="https://www.postgresql.org/docs/current/queries-limit.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: Tài liệu PostgreSQL 18 — LIMIT và OFFSET — đọc ngày 1/11/2026</span><span class="lc-sub">“Các dòng bị OFFSET bỏ qua vẫn phải được tính bên trong server” — và LIMIT cần ORDER BY có thứ tự duy nhất.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
  <li>Thêm dữ liệu mẫu và phiên bản offset; tái hiện các output ở trên với <code>SEED_BOOKINGS=200</code>.</li>
  <li>Tái hiện chuyện trùng, rồi tái hiện chiều ngược lại: làm một lượt đặt không còn khớp (huỷ nó trong lúc liệt kê với một bộ lọc status do bạn tự thêm) và tìm ra dòng không bao giờ được hiện.</li>
  <li>Bỏ khoá phụ <code>idNum</code> và sắp bằng <code>b.id.localeCompare(a.id)</code>. Id nào lên đầu? Giải thích bằng <code>"bk_10" &lt; "bk_9"</code>.</li>
  <li>Viết một script Node 10 dòng đi theo header <code>Link</code> tới khi nó biến mất và đếm số lượt đặt đã thấy.</li>
</ol>
<p><strong>Đạt khi:</strong> các trang 20 dòng trả về mới nhất trước kèm <code>Link</code> tới trang sau, <code>limit=101</code> ra 400, và bạn chỉ ra được một dòng trùng và một dòng bị sót do dữ liệu thay đổi.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Pagination (phân trang)</span><span class="v">Trả một danh sách dài theo từng trang.</span></div>
  <div class="kv"><span class="k">limit / offset</span><span class="v">Kích thước trang / số phần tử bỏ qua.</span></div>
  <div class="kv"><span class="k">Stable order (thứ tự ổn định)</span><span class="v">Cách sắp có khoá phụ duy nhất, để mọi lần gọi đều xếp cùng các dòng theo cùng một kiểu.</span></div>
  <div class="kv"><span class="k">Link header (RFC 8288)</span><span class="v">Header của response mang các URL liên quan, ví dụ <code>rel="next"</code>.</span></div>
  <div class="kv"><span class="k">Deep page (trang sâu)</span><span class="v">Trang nằm xa trong danh sách; với OFFSET cơ sở dữ liệu phải đi qua mọi dòng bị bỏ qua.</span></div>
  <div class="kv"><span class="k">EXPLAIN ANALYZE</span><span class="v">Lệnh PostgreSQL chạy câu truy vấn và cho xem kế hoạch cùng thời gian thật.</span></div>
  <div class="kv"><span class="k">Unrestricted resource consumption (tiêu thụ tài nguyên không giới hạn)</span><span class="v">OWASP API4:2023 — request khiến server làm khối lượng việc không có trần.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Không bao giờ trả danh sách không giới hạn: có kích thước trang mặc định và mức tối đa, vượt thì 400.</li>
  <li>Phân trang cần thứ tự ổn định với khoá phụ duy nhất (id so theo số).</li>
  <li>Báo trang tiếp theo bằng header <code>Link</code> và trong <code>page</code>.</li>
  <li>Offset vỡ khi dữ liệu đổi: đo được dòng trùng <code>bk_196</code>; dòng bị xoá làm sót dòng khác.</li>
  <li>Offset càng sâu càng tốn: 0,05 → 9 → 78 ms cho cùng 20 dòng trên một triệu; tổng chính xác tốn một lần đếm toàn bộ.</li>
  <li>Offset hợp với danh sách nhỏ, ổn định và giao diện có số trang; danh sách lớn hay bận cần con trỏ (3.2).</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/java-web-application-development/learn?lessonSlug=prj301-pagination" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Bạn đã gặp phần này ở PRJ301 — bài 6.3: tìm kiếm, sắp xếp và phân trang</span><span class="lc-sub">Nếu đã học PRJ301 trên Academy, OFFSET/FETCH và công thức tính trang là cùng một cơ chế. Giống: offset = (page − 1) × pageSize, bắt buộc có ORDER BY, danh sách cho phép cho cột sắp xếp. Khác: PRJ301 vẽ trang bằng JSP; ở đây API trả trang cho mọi loại client. Bài này thêm: kích thước trang tối đa, khoá phụ phân xử, header Link, và các vấn đề đo được — trùng dòng khi dữ liệu đổi, trang sâu 78 ms trên một triệu dòng. Chưa học PRJ301? Bài này vẫn tự đứng được.</span></span>
  <span class="lc-cta">MỞ BÀI PRJ301 →</span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 3.2 ─────────────────────────── */
    {
      title: '3.2 — Cursor pagination done right: opaque cursors, keyset, constant-time deep pages|||3.2 — Phân trang con trỏ làm cho đúng: con trỏ mờ, keyset, trang sâu tốn như trang đầu',
      slug: 'api-3-2-cursor',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Con trỏ base64url chứa vị trí phần tử cuối kèm khoá phụ; không còn trùng khi chèn; keyset trên PostgreSQL 78 ms → 0,064 ms; so sánh offset và con trỏ.',
      content: `${G032}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Cursor pagination done right</h2>
<p class="lead">Offset says “skip 40 rows”. A cursor says “continue after <em>this</em> row”. That one change removes both problems we measured in lesson 3.1: rows no longer repeat or vanish when data changes, and a deep page costs the same as the first. In this lesson LabFlow’s bookings switch to an opaque cursor, and PostgreSQL shows the same 20 rows at depth 900 000 in 0.064 ms instead of 78 ms.</p>

<h3>The idea: a bookmark, not a page number</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">page 1</span><span class="lz-t">ORDER BY created_at DESC, id DESC</span><span class="lz-d">LIMIT 20</span></div>
  <div class="lz-step"><span class="lz-k">cursor</span><span class="lz-t">last row’s (sort value, id) + query fingerprint</span><span class="lz-d">base64url — opaque to the client</span></div>
  <div class="lz-step"><span class="lz-k">page 2</span><span class="lz-t">WHERE (created_at, id) < cursor</span><span class="lz-d">an index seek, any depth</span></div>
  <div class="lz-step"><span class="lz-k">end</span><span class="lz-t">next = null</span><span class="lz-d">the only end-of-list signal</span></div>
</div>
<p>When you close a book you keep a bookmark at the last page you read — not “page 212”, because a new edition with an extra chapter would move page 212. A cursor is that bookmark: the <strong>position of the last item</strong> you received, in the sort order. The next request asks for “items that come after this position”. Items added before the bookmark do not push anything; items removed do not pull anything.</p>
<p>The position must identify exactly one place in the order, so it contains every sort key including the tie-breaker: for “newest first” that is <code>(createdAt, id)</code> of the last item.</p>

<h3>Build it</h3>
<p><code>src/paging.js</code> gains two functions. The cursor is JSON, encoded as <strong>base64url</strong> (base64 with URL-safe characters, no padding) so it travels in a query string without escaping. Clients must treat it as an <strong>opaque</strong> string — copy it back, never build or edit it:</p>
<pre><code class="language-javascript">// paging.js — thứ tự ỔN ĐỊNH + con trỏ (cursor) cho danh sách
import { HttpError } from './http.js';

export const idNum = (id) =&gt; Number(id.slice(id.indexOf('_') + 1));
// mới tạo trước; trùng createdAt thì id lớn trước ⇒ không bao giờ có hai bản ghi "ngang hàng"
export const newestFirst = (a, b) =&gt; b.createdAt.localeCompare(a.createdAt) || idNum(b.id) - idNum(a.id);

// Con trỏ = vị trí của phần tử CUỐI trang trước, gói thành chuỗi mờ (base64url của JSON)
export const encodeCursor = (b) =&gt; Buffer.from(JSON.stringify({ createdAt: b.createdAt, id: b.id })).toString('base64url');

export function decodeCursor(s) {
  let c;
  try { c = JSON.parse(Buffer.from(s, 'base64url').toString('utf8')); } catch { c = null; }
  if (!c || typeof c.createdAt !== 'string' || !/^[a-z]+_\\d+$/.test(c.id ?? ''))
    throw new HttpError(400, 'INVALID_CURSOR');        // client không được tự chế hay sửa con trỏ
  return c;
}</code></pre>
<p>The query loses <code>offset</code> and gains <code>cursor</code>:</p>
<pre><code class="language-javascript">export const BookingsQuery = z.strictObject({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().min(1).max(200).optional(),   // chuỗi mờ do server phát; offset đã bỏ (bài 3.2)
});</code></pre>
<p>The handler sorts, keeps only the rows <em>after</em> the cursor, and takes <code>limit</code>. It knows there is a next page when more rows remain — no total count needed:</p>
<pre><code class="language-javascript">  .get(validate('query', BookingsQuery), (req, res) =&gt; {
    const { limit, cursor } = req.valid.query;
    const mine = req.user.role === 'LAB_MANAGER' ? bookings : bookings.filter((b) =&gt; b.userId === req.user.id);
    let rows = [...mine].sort(newestFirst);
    if (cursor) {
      const after = decodeCursor(cursor);
      rows = rows.filter((b) =&gt; newestFirst(after, b) &lt; 0);   // chỉ lấy những gì đứng SAU vị trí con trỏ
    }
    const data = rows.slice(0, limit);
    const next = rows.length &gt; limit ? encodeCursor(data[data.length - 1]) : null;
    if (next) res.links({ next: &#96;/bookings?limit=\${limit}&amp;cursor=\${next}&#96; });
    res.json({ data: data.map(toBooking), page: { limit, next } });
  })</code></pre>
<p><code>newestFirst(after, b) &lt; 0</code> reads “the cursor comes before <code>b</code> in the order” — the same comparator that sorts the list decides what “after” means, so the two can never disagree.</p>

<h3>Try it</h3>
<pre><code class="language-bash">curl -i 'http://localhost:4000/bookings?limit=2' -H 'Authorization: Bearer tok_lan'</code></pre>
<div class="out">HTTP/1.1 200 OK
Link: &lt;/bookings?limit=2&amp;cursor=eyJjcmVhdGVkQXQiOiIyMDI2LTEwLTAxVDAzOjE5OjAwLjAwMFoiLCJpZCI6ImJrXzE5OSJ9&gt;; rel="next"
Content-Type: application/json; charset=utf-8
Content-Length: 743
ETag: W/"2e7-dc8znBMWKNvFXeoDxtLY5/VlNC8"
Date: Sat, 31 Oct 2026 19:20:34 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "data": [
    {
      "id": "bk_200",
      "labId": "lab_2",
      "userId": "usr_2",
      "startAt": "2026-11-15T02:00:00.000Z",
      "endAt": "2026-11-15T04:00:00.000Z",
      "purpose": "SWT301 Lab 3",
      "status": "PENDING",
      "createdAt": "2026-10-01T03:20:00.000Z",
      "cancelledAt": null
    },
    {
      "id": "bk_199",
      "labId": "lab_1",
      "userId": "usr_1",
      "startAt": "2026-11-15T02:00:00.000Z",
      "endAt": "2026-11-15T04:00:00.000Z",
      "purpose": "CLB IoT",
      "status": "PENDING",
      "createdAt": "2026-10-01T03:19:00.000Z",
      "cancelledAt": null
    }
  ],
  "page": {
    "limit": 2,
    "next": "eyJjcmVhdGVkQXQiOiIyMDI2LTEwLTAxVDAzOjE5OjAwLjAwMFoiLCJpZCI6ImJrXzE5OSJ9"
  }
}</div>
<p>There is nothing secret inside — decoding shows the position:</p>
<pre><code class="language-bash">echo 'eyJjcmVhdGVkQXQiOiIyMDI2LTEwLTAxVDAzOjE5OjAwLjAwMFoiLCJpZCI6ImJrXzE5OSJ9' | base64 -d</code></pre>
<div class="out">{"createdAt":"2026-10-01T03:19:00.000Z","id":"bk_199"}</div>
<p>Now the experiment that broke offset: page 1, An books a lab, page 2 with the cursor:</p>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?limit=5' \\
  -H 'Authorization: Bearer tok_lan' | jq -c '{ids: [.data[].id], next: .page.next}'</code></pre>
<div class="out">{"ids":["bk_200","bk_199","bk_198","bk_197","bk_196"],"next":"eyJjcmVhdGVkQXQiOiIyMDI2LTEwLTAxVDAzOjE2OjAwLjAwMFoiLCJpZCI6ImJrXzE5NiJ9"}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_1","startAt":"2027-01-04T08:00:00+07:00","endAt":"2027-01-04T10:00:00+07:00"}' | jq -c '{id, createdAt}'</code></pre>
<div class="out">{"id":"bk_201","createdAt":"2026-10-31T19:20:34.129Z"}</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?limit=5&amp;cursor=eyJjcmVhdGVkQXQiOiIyMDI2LTEwLTAxVDAzOjE2OjAwLjAwMFoiLCJpZCI6ImJrXzE5NiJ9' \\
  -H 'Authorization: Bearer tok_lan' | jq -c '{ids: [.data[].id], next: .page.next}'</code></pre>
<div class="out">{"ids":["bk_195","bk_194","bk_193","bk_192","bk_191"],"next":"eyJjcmVhdGVkQXQiOiIyMDI2LTEwLTAxVDAzOjExOjAwLjAwMFoiLCJpZCI6ImJrXzE5MSJ9"}</div>
<p>Page 2 starts at <code>bk_195</code>, right after <code>bk_196</code>: no duplicate, although <code>bk_201</code> was inserted at the top in between. Lan sees <code>bk_201</code> the next time she loads page 1 — exactly what a feed should do.</p>
<p>A cursor that is not ours is refused, with the problem format of Chapter 2:</p>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?limit=5&amp;cursor=hello' \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'Accept-Language: en'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/invalid-cursor",
  "title": "Invalid page cursor",
  "status": 400,
  "detail": "Send page.next exactly as the server returned it; do not build or edit it",
  "instance": "/bookings?limit=5&amp;cursor=hello",
  "code": "INVALID_CURSOR"
}</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?limit=5&amp;offset=5' \\
  -H 'Authorization: Bearer tok_lan' | jq -c '.errors'</code></pre>
<div class="out">[{"parameter":"offset","detail":"trường không được hỗ trợ"}]</div>
<p>That last answer is a <strong>breaking change</strong> — a client that used <code>offset</code> in lesson 3.1 now gets 400. LabFlow can do it because no real client exists yet; after release you would keep <code>offset</code> working for a while (Chapter 4). At the end of a list <code>next</code> is <code>null</code>:</p>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?limit=100' \\
  -H 'Authorization: Bearer tok_bin' | jq -c '{n: (.data | length), next: .page.next}'</code></pre>
<div class="out">{"n":100,"next":null}</div>

<h3>Measured: the deep page that cost 78 ms</h3>
<p>Same PostgreSQL table, same index, the same 20 rows that sat at offset 900 000 — asked for as “after <code>(2025-02-04 17:20:30Z, 100001)</code>”, the position of row 900 000:</p>
<pre><code class="language-sql">EXPLAIN (ANALYZE, COSTS OFF)
SELECT id, created_at FROM bookings
WHERE (created_at, id) &lt; ('2025-02-04 17:20:30+00', 100001)
ORDER BY created_at DESC, id DESC
LIMIT 20;</code></pre>
<div class="out"> Limit (actual time=0.043..0.046 rows=20.00 loops=1)
   -&gt;  Index Only Scan using bookings_newest on bookings (actual time=0.043..0.044 rows=20.00 loops=1)
         Index Cond: (ROW(created_at, id) &lt; ROW('2025-02-05 00:20:30+07'::timestamp with time zone, 100001))
 Execution Time: 0.064 ms</div>
<p><code>rows=20</code>, not 900 020: the row comparison <code>(created_at, id) &lt; (…)</code> lets the index <strong>jump</strong> straight to the bookmark. 78.3 ms became 0.064 ms — about 1 200 times faster, and the same at any depth. This technique is also called <strong>keyset pagination</strong> or the “seek method”. It needs an index whose columns match the sort order, tie-breaker included.</p>

<h3>Offset or cursor?</h3>
<table>
  <thead><tr><th></th><th>Offset (3.1)</th><th>Cursor (3.2)</th></tr></thead>
  <tbody>
    <tr><td>Data changes while paging</td><td>duplicates and missing rows</td><td>stable</td></tr>
    <tr><td>Deep page cost</td><td>grows with depth (78 ms at 900 000)</td><td>constant (0.064 ms)</td></tr>
    <tr><td>Jump to page 7</td><td>yes</td><td>no — only next (and previous, if you add it)</td></tr>
    <tr><td>Total count</td><td>usually sent, costs a full count</td><td>not needed (<code>next</code> = null at the end)</td></tr>
    <tr><td>Good for</td><td>small admin tables with page numbers</td><td>feeds, infinite scroll, exports, sync, big lists</td></tr>
  </tbody>
</table>
<p>Public APIs that page by cursor include Stripe (<code>starting_after</code>), Slack (<code>cursor</code>) and GitHub’s GraphQL API (<code>after</code>) — check their documentation pages for the details.</p>

<div class="pitfall"><p><strong>Trap — a cursor without a tie-breaker.</strong> If the cursor holds only <code>createdAt</code> and two bookings share it, “after this time” skips the twin that was not yet shown. The seed creates bookings one minute apart, so you would not notice in tests — real traffic creates many per second. Always encode every sort key plus the unique id.</p></div>
<div class="pitfall"><p><strong>Trap — clients that parse the cursor.</strong> Once a client reads <code>createdAt</code> out of your cursor, you can never change its format. That is why it is documented as opaque. Some teams sign it with an HMAC so a modified cursor is rejected outright; LabFlow only validates it, because a crafted cursor cannot reach data the user is not allowed to see anyway — the user filter runs first.</p></div>

<h3>In interviews and at work</h3>
<p><strong>“Why are cursors faster?”</strong> The database seeks directly to the position through an index matching the sort order instead of walking and discarding every skipped row.</p>
<p><strong>“What goes into a cursor?”</strong> The values of every sort key of the last item, including a unique tie-breaker, encoded as an opaque string — plus anything needed to reject it when used with a different query (lesson 3.3).</p>

<a class="link-card" href="https://google.aip.dev/158" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: Google AIP-158 — Pagination — read 1 Nov 2026</span><span class="lc-sub">Page tokens must be opaque and URL-safe, never user-parseable; an empty next_page_token is the only end-of-collection signal; too large a page size is capped, not rejected.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
  <li>Switch your bookings to cursors and reproduce the outputs; confirm that inserting a booking between pages causes no duplicate.</li>
  <li>Write a client that walks all 200 seeded bookings for Lan with <code>limit=30</code> and checks the ids are unique and the count is 200.</li>
  <li>Change the seed so 10 bookings share the same <code>createdAt</code>, remove the id from the cursor, and find the booking that is skipped. Put the id back.</li>
  <li>Design (on paper) a <code>prev</code> cursor: what would the comparison and the sort be?</li>
</ol>
<p><strong>Done when:</strong> every item appears exactly once when you follow <code>page.next</code> to <code>null</code>, even with inserts in between, and a modified cursor gives 400 <code>INVALID_CURSOR</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cursor</span><span class="v">The position of the last item received, sent back to get the items after it.</span></div>
  <div class="kv"><span class="k">Keyset / seek pagination</span><span class="v">Fetching “rows after these key values” with a WHERE on the sort keys instead of OFFSET.</span></div>
  <div class="kv"><span class="k">Opaque</span><span class="v">A value the client must pass back unchanged and never interpret.</span></div>
  <div class="kv"><span class="k">base64url</span><span class="v">Base64 with <code>-</code> and <code>_</code> instead of <code>+</code> and <code>/</code>, safe in URLs.</span></div>
  <div class="kv"><span class="k">Row comparison</span><span class="v"><code>(a, b) &lt; (x, y)</code> in SQL: compares a with x, then b with y on ties.</span></div>
  <div class="kv"><span class="k">Tie-breaker</span><span class="v">A unique key (id) added to the sort so no two rows have the same position.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>A cursor is a bookmark: the sort-key values of the last item, including a unique id.</li>
  <li>“After this position” is immune to inserts and deletes; offset is not.</li>
  <li>With an index matching the order, any depth costs the same: 78 ms → 0.064 ms on a million rows.</li>
  <li>Encode the cursor opaquely (base64url), validate it, answer 400 for a bad one.</li>
  <li><code>next: null</code> marks the end — no total count needed.</li>
  <li>Cursors cannot jump to page N; keep offset for small tables that need page numbers.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Phân trang bằng con trỏ, làm cho đúng</h2>
<p class="lead">Offset nói "bỏ qua 40 dòng". Con trỏ (cursor) nói "tiếp tục sau <em>dòng này</em>". Chỉ một thay đổi đó xoá được cả hai vấn đề ta đã đo ở bài 3.1: dòng không còn lặp lại hay biến mất khi dữ liệu thay đổi, và một trang sâu tốn y như trang đầu. Trong bài này, danh sách lượt đặt của LabFlow chuyển sang con trỏ mờ, và PostgreSQL trả cùng 20 dòng ở độ sâu 900 000 trong 0,064 ms thay vì 78 ms.</p>

<h3>Ý tưởng: một cái bookmark, không phải số trang</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">trang 1</span><span class="lz-t">ORDER BY created_at DESC, id DESC</span><span class="lz-d">LIMIT 20</span></div>
  <div class="lz-step"><span class="lz-k">con trỏ</span><span class="lz-t">(giá trị sắp xếp, id) của dòng cuối + dấu vân tay truy vấn</span><span class="lz-d">base64url — client không đọc được</span></div>
  <div class="lz-step"><span class="lz-k">trang 2</span><span class="lz-t">WHERE (created_at, id) < con trỏ</span><span class="lz-d">tìm theo index, sâu bao nhiêu cũng vậy</span></div>
  <div class="lz-step"><span class="lz-k">hết</span><span class="lz-t">next = null</span><span class="lz-d">tín hiệu hết danh sách duy nhất</span></div>
</div>
<p>Khi gấp sách lại, bạn kẹp bookmark ở trang cuối đã đọc — chứ không ghi "trang 212", vì bản in mới thêm một chương sẽ đẩy trang 212 đi chỗ khác. Con trỏ chính là cái bookmark đó: <strong>vị trí của phần tử cuối cùng</strong> bạn đã nhận, tính theo thứ tự sắp xếp. Request tiếp theo xin "những phần tử đứng sau vị trí này". Phần tử thêm vào trước bookmark không đẩy gì; phần tử bị xoá không kéo gì.</p>
<p>Vị trí phải chỉ đúng một chỗ trong thứ tự, nên nó chứa mọi khoá sắp xếp, kể cả khoá phụ: với "mới nhất trước" đó là <code>(createdAt, id)</code> của phần tử cuối.</p>

<h3>Dựng</h3>
<p><code>src/paging.js</code> có thêm hai hàm. Con trỏ là JSON, mã hoá bằng <strong>base64url</strong> (base64 dùng ký tự an toàn cho URL, không có dấu đệm) để đi trong query string mà không phải thoát ký tự. Client phải coi nó là chuỗi <strong>mờ</strong> (opaque) — gửi lại nguyên văn, không bao giờ tự dựng hay sửa:</p>
<pre><code class="language-javascript">// paging.js — thứ tự ỔN ĐỊNH + con trỏ (cursor) cho danh sách
import { HttpError } from './http.js';

export const idNum = (id) =&gt; Number(id.slice(id.indexOf('_') + 1));
// mới tạo trước; trùng createdAt thì id lớn trước ⇒ không bao giờ có hai bản ghi "ngang hàng"
export const newestFirst = (a, b) =&gt; b.createdAt.localeCompare(a.createdAt) || idNum(b.id) - idNum(a.id);

// Con trỏ = vị trí của phần tử CUỐI trang trước, gói thành chuỗi mờ (base64url của JSON)
export const encodeCursor = (b) =&gt; Buffer.from(JSON.stringify({ createdAt: b.createdAt, id: b.id })).toString('base64url');

export function decodeCursor(s) {
  let c;
  try { c = JSON.parse(Buffer.from(s, 'base64url').toString('utf8')); } catch { c = null; }
  if (!c || typeof c.createdAt !== 'string' || !/^[a-z]+_\\d+$/.test(c.id ?? ''))
    throw new HttpError(400, 'INVALID_CURSOR');        // client không được tự chế hay sửa con trỏ
  return c;
}</code></pre>
<p>Query bỏ <code>offset</code> và có thêm <code>cursor</code>:</p>
<pre><code class="language-javascript">export const BookingsQuery = z.strictObject({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().min(1).max(200).optional(),   // chuỗi mờ do server phát; offset đã bỏ (bài 3.2)
});</code></pre>
<p>Handler sắp xếp, chỉ giữ các dòng đứng <em>sau</em> con trỏ, rồi lấy <code>limit</code> dòng. Nó biết còn trang sau khi vẫn còn dòng thừa — không cần đếm tổng:</p>
<pre><code class="language-javascript">  .get(validate('query', BookingsQuery), (req, res) =&gt; {
    const { limit, cursor } = req.valid.query;
    const mine = req.user.role === 'LAB_MANAGER' ? bookings : bookings.filter((b) =&gt; b.userId === req.user.id);
    let rows = [...mine].sort(newestFirst);
    if (cursor) {
      const after = decodeCursor(cursor);
      rows = rows.filter((b) =&gt; newestFirst(after, b) &lt; 0);   // chỉ lấy những gì đứng SAU vị trí con trỏ
    }
    const data = rows.slice(0, limit);
    const next = rows.length &gt; limit ? encodeCursor(data[data.length - 1]) : null;
    if (next) res.links({ next: &#96;/bookings?limit=\${limit}&amp;cursor=\${next}&#96; });
    res.json({ data: data.map(toBooking), page: { limit, next } });
  })</code></pre>
<p><code>newestFirst(after, b) &lt; 0</code> đọc là "con trỏ đứng trước <code>b</code> trong thứ tự" — chính hàm so sánh dùng để sắp danh sách quyết định "sau" nghĩa là gì, nên hai thứ không bao giờ lệch nhau.</p>

<h3>Chạy thử</h3>
<pre><code class="language-bash">curl -i 'http://localhost:4000/bookings?limit=2' -H 'Authorization: Bearer tok_lan'</code></pre>
<div class="out">HTTP/1.1 200 OK
Link: &lt;/bookings?limit=2&amp;cursor=eyJjcmVhdGVkQXQiOiIyMDI2LTEwLTAxVDAzOjE5OjAwLjAwMFoiLCJpZCI6ImJrXzE5OSJ9&gt;; rel="next"
Content-Type: application/json; charset=utf-8
Content-Length: 743
ETag: W/"2e7-dc8znBMWKNvFXeoDxtLY5/VlNC8"
Date: Sat, 31 Oct 2026 19:20:34 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "data": [
    {
      "id": "bk_200",
      "labId": "lab_2",
      "userId": "usr_2",
      "startAt": "2026-11-15T02:00:00.000Z",
      "endAt": "2026-11-15T04:00:00.000Z",
      "purpose": "SWT301 Lab 3",
      "status": "PENDING",
      "createdAt": "2026-10-01T03:20:00.000Z",
      "cancelledAt": null
    },
    {
      "id": "bk_199",
      "labId": "lab_1",
      "userId": "usr_1",
      "startAt": "2026-11-15T02:00:00.000Z",
      "endAt": "2026-11-15T04:00:00.000Z",
      "purpose": "CLB IoT",
      "status": "PENDING",
      "createdAt": "2026-10-01T03:19:00.000Z",
      "cancelledAt": null
    }
  ],
  "page": {
    "limit": 2,
    "next": "eyJjcmVhdGVkQXQiOiIyMDI2LTEwLTAxVDAzOjE5OjAwLjAwMFoiLCJpZCI6ImJrXzE5OSJ9"
  }
}</div>
<p>Bên trong chẳng có gì bí mật — giải mã ra là thấy vị trí:</p>
<pre><code class="language-bash">echo 'eyJjcmVhdGVkQXQiOiIyMDI2LTEwLTAxVDAzOjE5OjAwLjAwMFoiLCJpZCI6ImJrXzE5OSJ9' | base64 -d</code></pre>
<div class="out">{"createdAt":"2026-10-01T03:19:00.000Z","id":"bk_199"}</div>
<p>Giờ là thí nghiệm từng làm offset gãy: trang 1, An đặt phòng, trang 2 theo con trỏ:</p>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?limit=5' \\
  -H 'Authorization: Bearer tok_lan' | jq -c '{ids: [.data[].id], next: .page.next}'</code></pre>
<div class="out">{"ids":["bk_200","bk_199","bk_198","bk_197","bk_196"],"next":"eyJjcmVhdGVkQXQiOiIyMDI2LTEwLTAxVDAzOjE2OjAwLjAwMFoiLCJpZCI6ImJrXzE5NiJ9"}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_1","startAt":"2027-01-04T08:00:00+07:00","endAt":"2027-01-04T10:00:00+07:00"}' | jq -c '{id, createdAt}'</code></pre>
<div class="out">{"id":"bk_201","createdAt":"2026-10-31T19:20:34.129Z"}</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?limit=5&amp;cursor=eyJjcmVhdGVkQXQiOiIyMDI2LTEwLTAxVDAzOjE2OjAwLjAwMFoiLCJpZCI6ImJrXzE5NiJ9' \\
  -H 'Authorization: Bearer tok_lan' | jq -c '{ids: [.data[].id], next: .page.next}'</code></pre>
<div class="out">{"ids":["bk_195","bk_194","bk_193","bk_192","bk_191"],"next":"eyJjcmVhdGVkQXQiOiIyMDI2LTEwLTAxVDAzOjExOjAwLjAwMFoiLCJpZCI6ImJrXzE5MSJ9"}</div>
<p>Trang 2 bắt đầu từ <code>bk_195</code>, ngay sau <code>bk_196</code>: không trùng, dù <code>bk_201</code> được chèn lên đầu ở giữa hai lần gọi. Cô Lan sẽ thấy <code>bk_201</code> ở lần tải lại trang 1 — đúng điều một bảng tin nên làm.</p>
<p>Một con trỏ không do ta phát bị từ chối, theo định dạng problem của Chương 2:</p>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?limit=5&amp;cursor=hello' \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'Accept-Language: en'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/invalid-cursor",
  "title": "Invalid page cursor",
  "status": 400,
  "detail": "Send page.next exactly as the server returned it; do not build or edit it",
  "instance": "/bookings?limit=5&amp;cursor=hello",
  "code": "INVALID_CURSOR"
}</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?limit=5&amp;offset=5' \\
  -H 'Authorization: Bearer tok_lan' | jq -c '.errors'</code></pre>
<div class="out">[{"parameter":"offset","detail":"trường không được hỗ trợ"}]</div>
<p>Câu trả lời cuối là một <strong>thay đổi phá vỡ</strong> (breaking change) — client nào dùng <code>offset</code> ở bài 3.1 giờ nhận 400. LabFlow làm được vì chưa có client thật nào; sau khi phát hành, bạn sẽ giữ <code>offset</code> chạy thêm một thời gian (Chương 4). Hết danh sách thì <code>next</code> là <code>null</code>:</p>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?limit=100' \\
  -H 'Authorization: Bearer tok_bin' | jq -c '{n: (.data | length), next: .page.next}'</code></pre>
<div class="out">{"n":100,"next":null}</div>

<h3>Đo lại trang sâu từng tốn 78 ms</h3>
<p>Cùng bảng PostgreSQL, cùng index, cùng 20 dòng từng nằm ở offset 900 000 — giờ hỏi theo kiểu "sau <code>(2025-02-04 17:20:30Z, 100001)</code>", tức vị trí của dòng thứ 900 000:</p>
<pre><code class="language-sql">EXPLAIN (ANALYZE, COSTS OFF)
SELECT id, created_at FROM bookings
WHERE (created_at, id) &lt; ('2025-02-04 17:20:30+00', 100001)
ORDER BY created_at DESC, id DESC
LIMIT 20;</code></pre>
<div class="out"> Limit (actual time=0.043..0.046 rows=20.00 loops=1)
   -&gt;  Index Only Scan using bookings_newest on bookings (actual time=0.043..0.044 rows=20.00 loops=1)
         Index Cond: (ROW(created_at, id) &lt; ROW('2025-02-05 00:20:30+07'::timestamp with time zone, 100001))
 Execution Time: 0.064 ms</div>
<p><code>rows=20</code>, không phải 900 020: phép so sánh cả hàng <code>(created_at, id) &lt; (…)</code> cho phép index <strong>nhảy</strong> thẳng tới bookmark. 78,3 ms thành 0,064 ms — nhanh hơn khoảng 1 200 lần, và như nhau ở mọi độ sâu. Kỹ thuật này còn được gọi là <strong>keyset pagination</strong> hay "seek method". Nó cần một index có các cột khớp đúng thứ tự sắp xếp, tính cả khoá phụ.</p>

<h3>Offset hay con trỏ?</h3>
<table>
  <thead><tr><th></th><th>Offset (3.1)</th><th>Con trỏ (3.2)</th></tr></thead>
  <tbody>
    <tr><td>Dữ liệu đổi trong lúc lật trang</td><td>trùng và sót dòng</td><td>ổn định</td></tr>
    <tr><td>Chi phí trang sâu</td><td>tăng theo độ sâu (78 ms ở 900 000)</td><td>không đổi (0,064 ms)</td></tr>
    <tr><td>Nhảy tới trang 7</td><td>được</td><td>không — chỉ trang sau (và trang trước, nếu bạn thêm)</td></tr>
    <tr><td>Tổng số</td><td>thường gửi kèm, tốn một lần đếm</td><td>không cần (hết thì <code>next</code> = null)</td></tr>
    <tr><td>Hợp với</td><td>bảng quản trị nhỏ có số trang</td><td>bảng tin, cuộn vô tận, xuất dữ liệu, đồng bộ, danh sách lớn</td></tr>
  </tbody>
</table>
<p>Những API công khai phân trang bằng con trỏ có Stripe (<code>starting_after</code>), Slack (<code>cursor</code>) và GraphQL API của GitHub (<code>after</code>) — xem trang tài liệu của họ để biết chi tiết.</p>

<div class="pitfall"><p><strong>Bẫy — con trỏ không có khoá phụ.</strong> Nếu con trỏ chỉ chứa <code>createdAt</code> và hai lượt đặt trùng giá trị đó, "sau thời điểm này" sẽ bỏ qua đứa sinh đôi chưa được hiện. Dữ liệu mẫu tạo lượt đặt cách nhau một phút nên test không lộ ra — lưu lượng thật tạo nhiều lượt trong một giây. Luôn mã hoá mọi khoá sắp xếp cộng id duy nhất.</p></div>
<div class="pitfall"><p><strong>Bẫy — client tự đọc con trỏ.</strong> Một khi client móc <code>createdAt</code> ra khỏi con trỏ của bạn, bạn không bao giờ đổi được định dạng của nó nữa. Vì thế tài liệu ghi rõ nó là chuỗi mờ. Có nhóm còn ký con trỏ bằng HMAC để con trỏ bị sửa bị từ chối ngay; LabFlow chỉ kiểm định dạng, vì một con trỏ tự chế cũng không với tới được dữ liệu người dùng không được xem — bộ lọc theo người dùng chạy trước.</p></div>

<h3>Phỏng vấn và đi làm</h3>
<p><strong>"Vì sao con trỏ nhanh hơn?"</strong> Cơ sở dữ liệu nhảy thẳng tới vị trí nhờ một index khớp thứ tự sắp xếp, thay vì đi qua rồi vứt đi mọi dòng bị bỏ qua.</p>
<p><strong>"Trong con trỏ có gì?"</strong> Giá trị của mọi khoá sắp xếp của phần tử cuối, kể cả khoá phụ duy nhất, mã hoá thành chuỗi mờ — cộng thứ cần để từ chối nó khi bị dùng với một truy vấn khác (bài 3.3).</p>

<a class="link-card" href="https://google.aip.dev/158" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: Google AIP-158 — Pagination — đọc ngày 1/11/2026</span><span class="lc-sub">Token trang phải mờ và an toàn cho URL, người dùng không đọc được; next_page_token rỗng là tín hiệu hết duy nhất; page size quá lớn bị hạ xuống, không bị từ chối.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
  <li>Chuyển danh sách lượt đặt sang con trỏ và tái hiện các output; xác nhận chèn một lượt đặt giữa hai trang không gây trùng.</li>
  <li>Viết một client đi hết 200 lượt đặt mẫu của cô Lan với <code>limit=30</code>, kiểm id không trùng và tổng đúng 200.</li>
  <li>Sửa dữ liệu mẫu để 10 lượt đặt trùng <code>createdAt</code>, bỏ id khỏi con trỏ, và tìm ra lượt bị bỏ qua. Rồi đưa id trở lại.</li>
  <li>Thiết kế (trên giấy) con trỏ <code>prev</code>: phép so sánh và cách sắp sẽ thế nào?</li>
</ol>
<p><strong>Đạt khi:</strong> đi theo <code>page.next</code> tới <code>null</code> thì phần tử nào cũng xuất hiện đúng một lần, kể cả khi có chèn ở giữa, và một con trỏ bị sửa ra 400 <code>INVALID_CURSOR</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cursor (con trỏ)</span><span class="v">Vị trí của phần tử cuối đã nhận, gửi lại để lấy các phần tử sau nó.</span></div>
  <div class="kv"><span class="k">Keyset / seek pagination</span><span class="v">Lấy "các dòng sau những giá trị khoá này" bằng WHERE trên khoá sắp xếp thay vì OFFSET.</span></div>
  <div class="kv"><span class="k">Opaque (mờ)</span><span class="v">Giá trị client phải gửi lại nguyên vẹn và không bao giờ diễn giải.</span></div>
  <div class="kv"><span class="k">base64url</span><span class="v">Base64 dùng <code>-</code> và <code>_</code> thay cho <code>+</code> và <code>/</code>, an toàn trong URL.</span></div>
  <div class="kv"><span class="k">Row comparison (so sánh cả hàng)</span><span class="v"><code>(a, b) &lt; (x, y)</code> trong SQL: so a với x, bằng nhau thì so b với y.</span></div>
  <div class="kv"><span class="k">Tie-breaker (khoá phụ phân xử)</span><span class="v">Một khoá duy nhất (id) thêm vào cách sắp để không có hai dòng chung vị trí.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Con trỏ là bookmark: giá trị khoá sắp xếp của phần tử cuối, kể cả id duy nhất.</li>
  <li>"Sau vị trí này" miễn nhiễm với chèn và xoá; offset thì không.</li>
  <li>Có index khớp thứ tự thì độ sâu nào cũng tốn như nhau: 78 ms → 0,064 ms trên một triệu dòng.</li>
  <li>Mã hoá con trỏ thành chuỗi mờ (base64url), kiểm nó, trả 400 khi sai.</li>
  <li><code>next: null</code> đánh dấu hết danh sách — không cần đếm tổng.</li>
  <li>Con trỏ không nhảy tới trang N được; giữ offset cho bảng nhỏ cần số trang.</li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── 3.3 ─────────────────────────── */
    {
      title: '3.3 — Filtering and search parameters: typed filters, overlap ranges, cursors bound to queries|||3.3 — Tham số lọc và tìm kiếm: bộ lọc có kiểu, khoảng chồng lấn, con trỏ gắn với truy vấn',
      slug: 'api-3-3-loc',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bộ lọc labId, status (danh sách), from/to (chồng lấn), q (không dấu) kiểm bằng Zod; dấu vân tay truy vấn trong con trỏ; index biến bộ lọc 36 ms thành 0,24 ms.',
      content: `${G033}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>Filtering and search parameters</h2>
<p class="lead">Lan does not want all 200 bookings; she wants “lab 2, cancelled ones” or “who is in the labs on Tuesday morning”. Filters are the most-used part of any list endpoint and the easiest place to create slow queries and silent bugs. This lesson adds four filters to <code>GET /bookings</code>, validates them like any input, ties cursors to the filters they were made for, and measures how one index turns a 36 ms filter into 0.24 ms.</p>

<h3>Design rules for filters</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">One named parameter per question</span><span class="lz-lnote">labId, status — several combine with AND</span></div>
  <div class="lz-layer"><span class="lz-lname">One type per parameter</span><span class="lz-lnote">validated like a body; lists are comma-separated</span></div>
  <div class="lz-layer"><span class="lz-lname">Ranges say what they mean</span><span class="lz-lnote">from/to = bookings that overlap [from, to)</span></div>
  <div class="lz-layer"><span class="lz-lname">Search is its own parameter</span><span class="lz-lnote">q, minimum length, accent-insensitive</span></div>
  <div class="lz-layer"><span class="lz-lname">Only what you can serve fast</span><span class="lz-lnote">every filter is a promise — and a cursor belongs to its query</span></div>
</div>
<ol>
  <li><strong>One named parameter per question</strong>, named after the field it filters: <code>labId</code>, <code>status</code>. Several parameters combine with <strong>AND</strong>.</li>
  <li><strong>One type per parameter</strong>, validated like a body (Chapter 2). A list of values is comma-separated: <code>status=PENDING,CANCELLED</code> means “either”.</li>
  <li><strong>Ranges say what they mean.</strong> <code>from</code>/<code>to</code> on bookings return every booking that <em>overlaps</em> <code>[from, to)</code> — the question Lan really asks (“who is in the lab between 7 and 11?”), not “bookings that start in that window”.</li>
  <li><strong>Search is its own parameter</strong> (<code>q</code>), with a minimum length, using the folded comparison of lesson 2.4.</li>
  <li><strong>Only what you can serve fast.</strong> Every filter you publish is a promise to answer it quickly forever — so no free-form “any field, any operator” filters on a public API.</li>
</ol>

<h3>The schema</h3>
<pre><code class="language-javascript">export const BOOKING_STATUSES = ['PENDING', 'CANCELLED'];
export const BookingsQuery = z.strictObject({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().min(1).max(200).optional(),   // chuỗi mờ do server phát; offset đã bỏ (bài 3.2)
  // Bài 3.3 — bộ lọc: tên rõ nghĩa, mỗi tham số một kiểu, kết hợp bằng AND
  labId: id('lab').optional(),
  status: z.string()                                // "PENDING,CANCELLED" ⇒ ['PENDING', 'CANCELLED']
    .transform((s) =&gt; s.split(','))
    .pipe(z.array(z.enum(BOOKING_STATUSES)).min(1))
    .optional(),
  from: instant.optional(),                         // lượt đặt CHỒNG LÊN khoảng [from, to)
  to: instant.optional(),
  q: text(2, 50).optional(),                        // tìm trong purpose, không phân biệt dấu
}).refine((x) =&gt; {
  // luật nhiều trường: chỉ phán khi CẢ HAI đã đúng định dạng (Zod có thể chạy refine trên giá trị còn sai)
  const a = Date.parse(x.from ?? ''), b = Date.parse(x.to ?? '');
  return Number.isNaN(a) || Number.isNaN(b) || a &lt; b;
}, { path: ['to'], message: 'TO_AFTER_FROM' });   // mã luật — câu chữ dịch ở i18n.js</code></pre>
<p>Two details. <code>transform</code> + <code>pipe</code> split the comma list and then validate each value against the enum. And the rule “<code>to</code> after <code>from</code>” involves two fields, so it is a <code>refine</code> on the whole object; its message is a <strong>code</strong>, translated in <code>i18n.js</code> like every other error (lesson 2.4):</p>
<pre><code class="language-javascript">// i18n.js
export const RULE_TEXT = {
  vi: { TO_AFTER_FROM: 'to phải sau from' },
  en: { TO_AFTER_FROM: 'to must be after from' },
};
// validate.js — trong toErrors
const detail = i.code === 'unrecognized_keys' ? UNKNOWN_FIELD[lang]
  : i.code === 'custom' ? (RULE_TEXT[lang][i.message] ?? i.message) : i.message;</code></pre>

<h3>The handler</h3>
<pre><code class="language-javascript">    const { limit, cursor, ...filters } = req.valid.query;
    const { labId, status, from, to, q } = filters;
    const mine = req.user.role === 'LAB_MANAGER' ? bookings : bookings.filter((b) =&gt; b.userId === req.user.id);
    let rows = mine.filter((b) =&gt;
      (!labId || b.labId === labId)
      &amp;&amp; (!status || status.includes(b.status))
      &amp;&amp; (!from || Date.parse(b.endAt) &gt; Date.parse(from))      // chồng lên [from, to): kết thúc sau from…
      &amp;&amp; (!to || Date.parse(b.startAt) &lt; Date.parse(to))        // …và bắt đầu trước to
      &amp;&amp; (!q || fold(b.purpose ?? '').includes(fold(q))));</code></pre>
<p>The overlap test is the same one that decides booking conflicts (Code Lab 1.3): two intervals overlap when each starts before the other ends.</p>

<h3>Try it</h3>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?labId=lab_2&amp;status=CANCELLED&amp;limit=3' \\
  -H 'Authorization: Bearer tok_lan' | jq -c '.data[] | [.id, .labId, .status]'</code></pre>
<div class="out">["bk_182","lab_2","CANCELLED"]
["bk_161","lab_2","CANCELLED"]
["bk_140","lab_2","CANCELLED"]</div>
<p>Tuesday 3 November, 07:00–11:00 Hanoi time, sent with an offset (<code>%2B</code> is <code>+</code>, which must be percent-encoded in a URL — a raw <code>+</code> means a space):</p>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?from=2026-11-03T07:00:00%2B07:00&amp;to=2026-11-03T11:00:00%2B07:00&amp;limit=20' \\
  -H 'Authorization: Bearer tok_lan' | jq -c '.data[] | [.id, .labId, .startAt, .endAt]'</code></pre>
<div class="out">["bk_21","lab_3","2026-11-03T02:00:00.000Z","2026-11-03T04:00:00.000Z"]
["bk_20","lab_2","2026-11-03T02:00:00.000Z","2026-11-03T04:00:00.000Z"]
["bk_19","lab_1","2026-11-03T02:00:00.000Z","2026-11-03T04:00:00.000Z"]
["bk_18","lab_3","2026-11-03T00:00:00.000Z","2026-11-03T02:00:00.000Z"]
["bk_17","lab_2","2026-11-03T00:00:00.000Z","2026-11-03T02:00:00.000Z"]
["bk_16","lab_1","2026-11-03T00:00:00.000Z","2026-11-03T02:00:00.000Z"]</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?q=clb%20iot&amp;limit=3' \\
  -H 'Authorization: Bearer tok_lan' | jq -c '{ids: [.data[] | [.id, .purpose]], next: .page.next}'</code></pre>
<div class="out">{"ids":[["bk_199","CLB IoT"],["bk_194","CLB IoT"],["bk_189","CLB IoT"]],"next":"eyJjcmVhdGVkQXQiOiIyMDI2LTEwLTAxVDAzOjA5OjAwLjAwMFoiLCJpZCI6ImJrXzE4OSIsImYiOiJjYzI5OTUyMCJ9"}</div>
<p>Invalid filters are refused with every problem listed. Notice the second request:</p>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?status=PENDING,DONE&amp;from=2026-11-04T00:00:00Z&amp;to=2026-11-03T00:00:00Z&amp;q=x' \\
  -H 'Authorization: Bearer tok_lan' | jq -c '.errors'</code></pre>
<div class="out">[{"parameter":"status","detail":"Tùy chọn không hợp lệ: mong đợi một trong các giá trị \\"PENDING\\"|\\"CANCELLED\\""},{"parameter":"q","detail":"Quá nhỏ: mong đợi string có &gt;=2 ký tự"}]</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?from=2026-11-04T00:00:00Z&amp;to=2026-11-03T00:00:00Z' \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'Accept-Language: en' | jq -c '.errors'</code></pre>
<div class="out">[{"parameter":"to","detail":"to must be after from"}]</div>
<p>In the first request <code>from</code> is after <code>to</code> as well, yet no <code>to</code> error appears: after the failed <code>status</code> pipe, Zod skipped the object-level <code>refine</code>. The second request, with valid fields, shows the rule. Clients may therefore get errors in two rounds; that is acceptable, but know it. The opposite also happens — after a plain format error Zod <em>does</em> run the refine, on the raw, invalid value. That is why the refine above returns “fine” when either date does not parse: otherwise the client would get a second, misleading error next to the real one.</p>
<p>The classic way to produce that format error: an unencoded <code>+</code>.</p>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?from=2026-11-03T07:00:00+07:00&amp;to=2026-11-03T11:00:00%2B07:00' \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'Accept-Language: en' | jq -c '.errors'</code></pre>
<div class="out">[{"parameter":"from","detail":"Invalid ISO datetime"}]</div>

<h3>A cursor belongs to its query</h3>
<p>A cursor marks a position in <em>one</em> list. Used with different filters it points into a different list — the client would get a page that starts at a random place, without any error. LabFlow puts a short <strong>fingerprint</strong> of the filters into the cursor and refuses a mismatch:</p>
<pre><code class="language-javascript">// paging.js
export const fingerprint = (filters) =&gt;
  createHash('sha256').update(JSON.stringify(Object.entries(filters).filter(([, v]) =&gt; v !== undefined).sort())).digest('hex').slice(0, 8);
// encodeCursor(b, f) ⇒ { createdAt, id, f } ; decodeCursor(s, f) ⇒ 400 CURSOR_MISMATCH nếu c.f !== f</code></pre>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?labId=lab_1&amp;limit=2' \\
  -H 'Authorization: Bearer tok_lan' | jq -c '{ids: [.data[].id], next: .page.next}'</code></pre>
<div class="out">{"ids":["bk_199","bk_196"],"next":"eyJjcmVhdGVkQXQiOiIyMDI2LTEwLTAxVDAzOjE2OjAwLjAwMFoiLCJpZCI6ImJrXzE5NiIsImYiOiI1NDlmNzU0NCJ9"}</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?labId=lab_1&amp;limit=2&amp;cursor=eyJjcmVhdGVkQXQiOiIyMDI2LTEwLTAxVDAzOjE2OjAwLjAwMFoiLCJpZCI6ImJrXzE5NiIsImYiOiI1NDlmNzU0NCJ9' \\
  -H 'Authorization: Bearer tok_lan' | jq -c '[.data[].id]'</code></pre>
<div class="out">["bk_193","bk_190"]</div>
<pre><code class="language-bash">curl -i 'http://localhost:4000/bookings?labId=lab_2&amp;limit=2&amp;cursor=eyJjcmVhdGVkQXQiOiIyMDI2LTEwLTAxVDAzOjE2OjAwLjAwMFoiLCJpZCI6ImJrXzE5NiIsImYiOiI1NDlmNzU0NCJ9' \\
  -H 'Authorization: Bearer tok_lan'</code></pre>
<div class="out">HTTP/1.1 400 Bad Request
Content-Language: vi
Vary: Accept-Language
Content-Type: application/problem+json; charset=utf-8
Content-Length: 410
ETag: W/"19a-eRO9g8HUNxkAoUJuONygvYKFU4g"
Date: Sat, 31 Oct 2026 19:39:53 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "type": "https://labflow.example/problems/cursor-mismatch",
  "title": "Con trỏ không khớp bộ lọc",
  "status": 400,
  "detail": "Bộ lọc đã đổi so với lúc lấy con trỏ; hãy tải lại từ trang đầu",
  "instance": "/bookings?labId=lab_2&amp;limit=2&amp;cursor=eyJjcmVhdGVkQXQiOiIyMDI2LTEwLTAxVDAzOjE2OjAwLjAwMFoiLCJpZCI6ImJrXzE5NiIsImYiOiI1NDlmNzU0NCJ9",
  "code": "CURSOR_MISMATCH"
}</div>
<p>The same cursor works with the <code>labId=lab_1</code> it was made for, and is refused for <code>lab_2</code>. Changing <code>limit</code> between pages is still allowed — it is not part of the fingerprint.</p>

<h3>Measured: a filter needs an index</h3>
<p>Same million-row PostgreSQL table. “Lab 7, overlapping 10 November”, newest first — first with only the <code>(created_at, id)</code> index of 3.1, then after adding <code>(lab_id, start_at)</code>:</p>
<pre><code class="language-sql">SELECT id, created_at FROM bookings
WHERE lab_id = 'lab_7' AND start_at &lt; '2026-11-11 00:00+00' AND start_at + interval '2 hours' &gt; '2026-11-10 00:00+00'
ORDER BY created_at DESC, id DESC LIMIT 20;</code></pre>
<div class="out">-- without a matching index
 Limit (actual time=34.143..36.160 rows=20.00 loops=1)
   -&gt;  Gather Merge (actual time=34.142..36.158 rows=20.00 loops=1)
         -&gt;  Parallel Index Scan using bookings_newest on bookings (actual time=31.726..32.303 rows=12.00 loops=3)
               Rows Removed by Filter: 333321
 Execution Time: 36.183 ms

-- CREATE INDEX bookings_lab_start ON bookings (lab_id, start_at);
 Limit (actual time=0.225..0.226 rows=20.00 loops=1)
   -&gt;  Sort (actual time=0.224..0.224 rows=20.00 loops=1)
         -&gt;  Bitmap Heap Scan on bookings (actual time=0.198..0.218 rows=36.00 loops=1)
               -&gt;  Bitmap Index Scan on bookings_lab_start (actual time=0.041..0.042 rows=324.00 loops=1)
 Execution Time: 0.242 ms</div>
<p>Without the index the database walks the newest-first index and throws away a million rows (“Rows Removed by Filter: 333321” in each of three workers). With it, it reads 324 candidates and sorts 36. Every filter you publish needs a plan like this — that is the real cost of rule 5.</p>

<div class="pitfall"><p><strong>Trap — “filter by anything”.</strong> <code>?where=purpose LIKE '%a%'</code> or <code>?field=x&amp;op=y&amp;value=z</code> look flexible. They invite injection if built into SQL, cannot all be indexed, and freeze your storage forever (every column becomes contract). Publish the filters users need; add more when asked.</p></div>
<div class="pitfall"><p><strong>Trap — a filter the user may not use.</strong> <code>?userId=usr_2</code> for a student would be a data leak (Chapter 6, BOLA). LabFlow applies “only my bookings” <em>before</em> any user filter, so a student can never widen the list.</p></div>

<h3>In interviews and at work</h3>
<p><strong>“How do you design filters?”</strong> Named, typed, validated parameters combined with AND; lists comma-separated; explicit range semantics; search separate with a minimum length; an index for every published filter; no free-form query language on a public API.</p>
<p><strong>“What happens if the client changes filters while paging?”</strong> The cursor no longer describes a position in that list; bind cursors to the query (a fingerprint) and answer 400 so the client restarts from page 1.</p>

<a class="link-card" href="https://google.aip.dev/158" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: Google AIP-158 — Pagination — read 1 Nov 2026</span><span class="lc-sub">Between pages the other request arguments should stay the same, or the API returns INVALID_ARGUMENT — the rule behind “a cursor belongs to its query”.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
  <li>Add the four filters and the fingerprint; reproduce the outputs.</li>
  <li>Add <code>userId</code> as a filter for managers only. A student who sends it must get 403 or 400 — decide which, write one sentence why.</li>
  <li>Prove the overlap semantics: find a booking that starts at 06:00 and ends at 08:00 Hanoi time (or create one) and show that <code>from=07:00</code> includes it.</li>
  <li>Run the two SQL statements of this lesson on your own PostgreSQL (any version ≥ 13) with 100 000 rows; compare the plans.</li>
</ol>
<p><strong>Done when:</strong> every filter is validated with clear errors, results combine with AND, a cursor from one filter set gives 400 with another, and you can explain the plan difference.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Filter parameter</span><span class="v">A query parameter that narrows a list; several combine with AND.</span></div>
  <div class="kv"><span class="k">Overlap</span><span class="v">Two intervals overlap when each starts before the other ends.</span></div>
  <div class="kv"><span class="k">Percent-encoding</span><span class="v"><code>+</code> in a query must be sent as <code>%2B</code>; a raw <code>+</code> means a space.</span></div>
  <div class="kv"><span class="k">refine</span><span class="v">A Zod rule over several fields; may be skipped after some field errors, or run on invalid values — write it defensively.</span></div>
  <div class="kv"><span class="k">Query fingerprint</span><span class="v">A short hash of the filters stored in the cursor so it cannot be reused with another query.</span></div>
  <div class="kv"><span class="k">Composite index</span><span class="v">An index over several columns, e.g. <code>(lab_id, start_at)</code>, matching a filter.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Filters are named, typed and validated parameters combined with AND; lists are comma-separated.</li>
  <li>Say what ranges mean — LabFlow’s <code>from</code>/<code>to</code> mean “overlaps”.</li>
  <li>Cross-field rules use <code>refine</code> with a translatable code, written to tolerate invalid fields.</li>
  <li>Bind cursors to their filters; a mismatch is a 400, not a silently wrong page.</li>
  <li>Each published filter needs an index: 36 ms → 0.24 ms measured on a million rows.</li>
  <li>No free-form filtering on a public API; apply access rules before user filters.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Tham số lọc và tìm kiếm</h2>
<p class="lead">Cô Lan không cần cả 200 lượt đặt; cô cần "phòng lab 2, những lượt đã huỷ" hay "ai đang ở phòng lab sáng thứ Ba". Bộ lọc (filter) là phần được dùng nhiều nhất của mọi endpoint danh sách, và cũng là chỗ dễ đẻ ra truy vấn chậm và bug lặng lẽ nhất. Bài này thêm bốn bộ lọc cho <code>GET /bookings</code>, kiểm chúng như mọi dữ liệu vào, gắn con trỏ với đúng bộ lọc đã sinh ra nó, và đo xem một index biến bộ lọc 36 ms thành 0,24 ms thế nào.</p>

<h3>Luật thiết kế bộ lọc</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Mỗi câu hỏi một tham số có tên</span><span class="lz-lnote">labId, status — nhiều tham số ghép bằng AND</span></div>
  <div class="lz-layer"><span class="lz-lname">Mỗi tham số một kiểu</span><span class="lz-lnote">kiểm như body; danh sách cách nhau dấu phẩy</span></div>
  <div class="lz-layer"><span class="lz-lname">Khoảng nói đúng nghĩa</span><span class="lz-lnote">from/to = lượt đặt chồng lên [from, to)</span></div>
  <div class="lz-layer"><span class="lz-lname">Tìm kiếm là tham số riêng</span><span class="lz-lnote">q, có độ dài tối thiểu, không phân biệt dấu</span></div>
  <div class="lz-layer"><span class="lz-lname">Chỉ thứ phục vụ nhanh được</span><span class="lz-lnote">mỗi bộ lọc là một lời hứa — và con trỏ gắn với truy vấn của nó</span></div>
</div>
<ol>
  <li><strong>Mỗi câu hỏi một tham số có tên</strong>, đặt theo trường nó lọc: <code>labId</code>, <code>status</code>. Nhiều tham số kết hợp bằng <strong>AND</strong>.</li>
  <li><strong>Mỗi tham số một kiểu</strong>, kiểm như body (Chương 2). Danh sách giá trị cách nhau bằng dấu phẩy: <code>status=PENDING,CANCELLED</code> nghĩa là "một trong hai".</li>
  <li><strong>Khoảng thời gian nói rõ nghĩa.</strong> <code>from</code>/<code>to</code> của lượt đặt trả mọi lượt <em>chồng lên</em> <code>[from, to)</code> — đúng câu cô Lan thật sự hỏi ("ai ở phòng lab từ 7 tới 11 giờ?"), chứ không phải "lượt đặt bắt đầu trong khoảng đó".</li>
  <li><strong>Tìm kiếm là một tham số riêng</strong> (<code>q</code>), có độ dài tối thiểu, dùng phép so sánh đã gấp của bài 2.4.</li>
  <li><strong>Chỉ những gì phục vụ nhanh được.</strong> Mỗi bộ lọc bạn công bố là một lời hứa trả lời nhanh mãi mãi — nên không có kiểu lọc "trường bất kỳ, toán tử bất kỳ" trên API công khai.</li>
</ol>

<h3>Schema</h3>
<pre><code class="language-javascript">export const BOOKING_STATUSES = ['PENDING', 'CANCELLED'];
export const BookingsQuery = z.strictObject({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().min(1).max(200).optional(),   // chuỗi mờ do server phát; offset đã bỏ (bài 3.2)
  // Bài 3.3 — bộ lọc: tên rõ nghĩa, mỗi tham số một kiểu, kết hợp bằng AND
  labId: id('lab').optional(),
  status: z.string()                                // "PENDING,CANCELLED" ⇒ ['PENDING', 'CANCELLED']
    .transform((s) =&gt; s.split(','))
    .pipe(z.array(z.enum(BOOKING_STATUSES)).min(1))
    .optional(),
  from: instant.optional(),                         // lượt đặt CHỒNG LÊN khoảng [from, to)
  to: instant.optional(),
  q: text(2, 50).optional(),                        // tìm trong purpose, không phân biệt dấu
}).refine((x) =&gt; {
  // luật nhiều trường: chỉ phán khi CẢ HAI đã đúng định dạng (Zod có thể chạy refine trên giá trị còn sai)
  const a = Date.parse(x.from ?? ''), b = Date.parse(x.to ?? '');
  return Number.isNaN(a) || Number.isNaN(b) || a &lt; b;
}, { path: ['to'], message: 'TO_AFTER_FROM' });   // mã luật — câu chữ dịch ở i18n.js</code></pre>
<p>Hai chi tiết. <code>transform</code> + <code>pipe</code> tách danh sách theo dấu phẩy rồi kiểm từng giá trị với enum. Còn luật "<code>to</code> phải sau <code>from</code>" dính tới hai trường, nên là một <code>refine</code> trên cả object; câu báo lỗi của nó là một <strong>mã</strong>, được dịch trong <code>i18n.js</code> như mọi lỗi khác (bài 2.4):</p>
<pre><code class="language-javascript">// i18n.js
export const RULE_TEXT = {
  vi: { TO_AFTER_FROM: 'to phải sau from' },
  en: { TO_AFTER_FROM: 'to must be after from' },
};
// validate.js — trong toErrors
const detail = i.code === 'unrecognized_keys' ? UNKNOWN_FIELD[lang]
  : i.code === 'custom' ? (RULE_TEXT[lang][i.message] ?? i.message) : i.message;</code></pre>

<h3>Handler</h3>
<pre><code class="language-javascript">    const { limit, cursor, ...filters } = req.valid.query;
    const { labId, status, from, to, q } = filters;
    const mine = req.user.role === 'LAB_MANAGER' ? bookings : bookings.filter((b) =&gt; b.userId === req.user.id);
    let rows = mine.filter((b) =&gt;
      (!labId || b.labId === labId)
      &amp;&amp; (!status || status.includes(b.status))
      &amp;&amp; (!from || Date.parse(b.endAt) &gt; Date.parse(from))      // chồng lên [from, to): kết thúc sau from…
      &amp;&amp; (!to || Date.parse(b.startAt) &lt; Date.parse(to))        // …và bắt đầu trước to
      &amp;&amp; (!q || fold(b.purpose ?? '').includes(fold(q))));</code></pre>
<p>Phép kiểm chồng lấn chính là phép quyết định trùng lịch (Code Lab 1.3): hai khoảng chồng nhau khi mỗi khoảng bắt đầu trước khi khoảng kia kết thúc.</p>

<h3>Chạy thử</h3>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?labId=lab_2&amp;status=CANCELLED&amp;limit=3' \\
  -H 'Authorization: Bearer tok_lan' | jq -c '.data[] | [.id, .labId, .status]'</code></pre>
<div class="out">["bk_182","lab_2","CANCELLED"]
["bk_161","lab_2","CANCELLED"]
["bk_140","lab_2","CANCELLED"]</div>
<p>Thứ Ba 3/11, 07:00–11:00 giờ Hà Nội, gửi kèm độ lệch múi giờ (<code>%2B</code> là dấu <code>+</code>, phải mã hoá phần trăm trong URL — dấu <code>+</code> trần nghĩa là dấu cách):</p>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?from=2026-11-03T07:00:00%2B07:00&amp;to=2026-11-03T11:00:00%2B07:00&amp;limit=20' \\
  -H 'Authorization: Bearer tok_lan' | jq -c '.data[] | [.id, .labId, .startAt, .endAt]'</code></pre>
<div class="out">["bk_21","lab_3","2026-11-03T02:00:00.000Z","2026-11-03T04:00:00.000Z"]
["bk_20","lab_2","2026-11-03T02:00:00.000Z","2026-11-03T04:00:00.000Z"]
["bk_19","lab_1","2026-11-03T02:00:00.000Z","2026-11-03T04:00:00.000Z"]
["bk_18","lab_3","2026-11-03T00:00:00.000Z","2026-11-03T02:00:00.000Z"]
["bk_17","lab_2","2026-11-03T00:00:00.000Z","2026-11-03T02:00:00.000Z"]
["bk_16","lab_1","2026-11-03T00:00:00.000Z","2026-11-03T02:00:00.000Z"]</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?q=clb%20iot&amp;limit=3' \\
  -H 'Authorization: Bearer tok_lan' | jq -c '{ids: [.data[] | [.id, .purpose]], next: .page.next}'</code></pre>
<div class="out">{"ids":[["bk_199","CLB IoT"],["bk_194","CLB IoT"],["bk_189","CLB IoT"]],"next":"eyJjcmVhdGVkQXQiOiIyMDI2LTEwLTAxVDAzOjA5OjAwLjAwMFoiLCJpZCI6ImJrXzE4OSIsImYiOiJjYzI5OTUyMCJ9"}</div>
<p>Bộ lọc sai bị từ chối kèm danh sách mọi lỗi. Để ý request thứ hai:</p>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?status=PENDING,DONE&amp;from=2026-11-04T00:00:00Z&amp;to=2026-11-03T00:00:00Z&amp;q=x' \\
  -H 'Authorization: Bearer tok_lan' | jq -c '.errors'</code></pre>
<div class="out">[{"parameter":"status","detail":"Tùy chọn không hợp lệ: mong đợi một trong các giá trị \\"PENDING\\"|\\"CANCELLED\\""},{"parameter":"q","detail":"Quá nhỏ: mong đợi string có &gt;=2 ký tự"}]</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?from=2026-11-04T00:00:00Z&amp;to=2026-11-03T00:00:00Z' \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'Accept-Language: en' | jq -c '.errors'</code></pre>
<div class="out">[{"parameter":"to","detail":"to must be after from"}]</div>
<p>Ở request đầu, <code>from</code> cũng nằm sau <code>to</code>, vậy mà không có lỗi nào cho <code>to</code>: sau khi bước pipe của <code>status</code> thất bại, Zod bỏ qua <code>refine</code> cấp object. Request thứ hai, các trường đều hợp lệ, mới lộ ra luật đó. Vì vậy client có thể nhận lỗi qua hai lượt; chấp nhận được, nhưng cần biết. Chiều ngược lại cũng xảy ra — sau một lỗi định dạng thông thường, Zod <em>vẫn</em> chạy refine, trên giá trị thô còn sai. Vì thế refine ở trên trả "ổn" khi một trong hai ngày không phân tích được: nếu không, client sẽ nhận thêm một lỗi thứ hai gây hiểu nhầm bên cạnh lỗi thật.</p>
<p>Cách kinh điển để gây ra lỗi định dạng đó: một dấu <code>+</code> không mã hoá.</p>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?from=2026-11-03T07:00:00+07:00&amp;to=2026-11-03T11:00:00%2B07:00' \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'Accept-Language: en' | jq -c '.errors'</code></pre>
<div class="out">[{"parameter":"from","detail":"Invalid ISO datetime"}]</div>

<h3>Con trỏ thuộc về truy vấn của nó</h3>
<p>Con trỏ đánh dấu một vị trí trong <em>một</em> danh sách. Đem dùng với bộ lọc khác, nó trỏ vào một danh sách khác — client nhận được một trang bắt đầu ở chỗ ngẫu nhiên, mà không có lỗi gì. LabFlow nhét một <strong>dấu vân tay</strong> (fingerprint) ngắn của bộ lọc vào con trỏ và từ chối khi không khớp:</p>
<pre><code class="language-javascript">// paging.js
export const fingerprint = (filters) =&gt;
  createHash('sha256').update(JSON.stringify(Object.entries(filters).filter(([, v]) =&gt; v !== undefined).sort())).digest('hex').slice(0, 8);
// encodeCursor(b, f) ⇒ { createdAt, id, f } ; decodeCursor(s, f) ⇒ 400 CURSOR_MISMATCH nếu c.f !== f</code></pre>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?labId=lab_1&amp;limit=2' \\
  -H 'Authorization: Bearer tok_lan' | jq -c '{ids: [.data[].id], next: .page.next}'</code></pre>
<div class="out">{"ids":["bk_199","bk_196"],"next":"eyJjcmVhdGVkQXQiOiIyMDI2LTEwLTAxVDAzOjE2OjAwLjAwMFoiLCJpZCI6ImJrXzE5NiIsImYiOiI1NDlmNzU0NCJ9"}</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?labId=lab_1&amp;limit=2&amp;cursor=eyJjcmVhdGVkQXQiOiIyMDI2LTEwLTAxVDAzOjE2OjAwLjAwMFoiLCJpZCI6ImJrXzE5NiIsImYiOiI1NDlmNzU0NCJ9' \\
  -H 'Authorization: Bearer tok_lan' | jq -c '[.data[].id]'</code></pre>
<div class="out">["bk_193","bk_190"]</div>
<pre><code class="language-bash">curl -i 'http://localhost:4000/bookings?labId=lab_2&amp;limit=2&amp;cursor=eyJjcmVhdGVkQXQiOiIyMDI2LTEwLTAxVDAzOjE2OjAwLjAwMFoiLCJpZCI6ImJrXzE5NiIsImYiOiI1NDlmNzU0NCJ9' \\
  -H 'Authorization: Bearer tok_lan'</code></pre>
<div class="out">HTTP/1.1 400 Bad Request
Content-Language: vi
Vary: Accept-Language
Content-Type: application/problem+json; charset=utf-8
Content-Length: 410
ETag: W/"19a-eRO9g8HUNxkAoUJuONygvYKFU4g"
Date: Sat, 31 Oct 2026 19:39:53 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "type": "https://labflow.example/problems/cursor-mismatch",
  "title": "Con trỏ không khớp bộ lọc",
  "status": 400,
  "detail": "Bộ lọc đã đổi so với lúc lấy con trỏ; hãy tải lại từ trang đầu",
  "instance": "/bookings?labId=lab_2&amp;limit=2&amp;cursor=eyJjcmVhdGVkQXQiOiIyMDI2LTEwLTAxVDAzOjE2OjAwLjAwMFoiLCJpZCI6ImJrXzE5NiIsImYiOiI1NDlmNzU0NCJ9",
  "code": "CURSOR_MISMATCH"
}</div>
<p>Cùng một con trỏ chạy được với <code>labId=lab_1</code> đã sinh ra nó, và bị từ chối với <code>lab_2</code>. Đổi <code>limit</code> giữa các trang thì vẫn được — nó không nằm trong dấu vân tay.</p>

<h3>Đo: bộ lọc cần index</h3>
<p>Vẫn bảng PostgreSQL một triệu dòng. "Phòng lab 7, chồng lên ngày 10/11", mới nhất trước — lần đầu chỉ có index <code>(created_at, id)</code> của bài 3.1, lần sau thêm <code>(lab_id, start_at)</code>:</p>
<pre><code class="language-sql">SELECT id, created_at FROM bookings
WHERE lab_id = 'lab_7' AND start_at &lt; '2026-11-11 00:00+00' AND start_at + interval '2 hours' &gt; '2026-11-10 00:00+00'
ORDER BY created_at DESC, id DESC LIMIT 20;</code></pre>
<div class="out">-- without a matching index
 Limit (actual time=34.143..36.160 rows=20.00 loops=1)
   -&gt;  Gather Merge (actual time=34.142..36.158 rows=20.00 loops=1)
         -&gt;  Parallel Index Scan using bookings_newest on bookings (actual time=31.726..32.303 rows=12.00 loops=3)
               Rows Removed by Filter: 333321
 Execution Time: 36.183 ms

-- CREATE INDEX bookings_lab_start ON bookings (lab_id, start_at);
 Limit (actual time=0.225..0.226 rows=20.00 loops=1)
   -&gt;  Sort (actual time=0.224..0.224 rows=20.00 loops=1)
         -&gt;  Bitmap Heap Scan on bookings (actual time=0.198..0.218 rows=36.00 loops=1)
               -&gt;  Bitmap Index Scan on bookings_lab_start (actual time=0.041..0.042 rows=324.00 loops=1)
 Execution Time: 0.242 ms</div>
<p>Không có index, cơ sở dữ liệu đi qua index mới-nhất-trước và vứt đi một triệu dòng ("Rows Removed by Filter: 333321" ở mỗi worker trong ba worker). Có index, nó đọc 324 ứng viên và sắp 36 dòng. Mỗi bộ lọc bạn công bố đều cần một kế hoạch như thế — đó là cái giá thật của luật số 5.</p>

<div class="pitfall"><p><strong>Bẫy — "lọc theo bất cứ thứ gì".</strong> <code>?where=purpose LIKE '%a%'</code> hay <code>?field=x&amp;op=y&amp;value=z</code> trông linh hoạt. Chúng mời gọi tấn công chèn mã nếu được ghép vào SQL, không thể đánh index hết, và đóng băng cách lưu trữ của bạn mãi mãi (cột nào cũng thành hợp đồng). Hãy công bố các bộ lọc người dùng cần; ai xin thêm thì thêm.</p></div>
<div class="pitfall"><p><strong>Bẫy — bộ lọc người dùng không được phép dùng.</strong> <code>?userId=usr_2</code> với một sinh viên sẽ là rò rỉ dữ liệu (Chương 6, BOLA). LabFlow áp "chỉ lượt đặt của tôi" <em>trước</em> mọi bộ lọc của người dùng, nên sinh viên không bao giờ nới rộng được danh sách.</p></div>

<h3>Phỏng vấn và đi làm</h3>
<p><strong>"Em thiết kế bộ lọc thế nào?"</strong> Tham số có tên, có kiểu, được kiểm, kết hợp bằng AND; danh sách cách nhau bằng dấu phẩy; nghĩa của khoảng thời gian rõ ràng; tìm kiếm tách riêng và có độ dài tối thiểu; mỗi bộ lọc công bố có một index; không có ngôn ngữ truy vấn tự do trên API công khai.</p>
<p><strong>"Client đổi bộ lọc giữa lúc lật trang thì sao?"</strong> Con trỏ không còn mô tả một vị trí trong danh sách đó; gắn con trỏ với truy vấn (dấu vân tay) và trả 400 để client bắt đầu lại từ trang 1.</p>

<a class="link-card" href="https://google.aip.dev/158" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: Google AIP-158 — Pagination — đọc ngày 1/11/2026</span><span class="lc-sub">Giữa các trang, các tham số khác nên giữ nguyên, nếu không API trả INVALID_ARGUMENT — chính là luật “con trỏ gắn với truy vấn của nó”.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
  <li>Thêm bốn bộ lọc và dấu vân tay; tái hiện các output.</li>
  <li>Thêm bộ lọc <code>userId</code> chỉ cho quản lý. Sinh viên gửi nó phải nhận 403 hoặc 400 — chọn một, viết một câu giải thích.</li>
  <li>Chứng minh nghĩa "chồng lên": tìm (hoặc tạo) một lượt đặt từ 06:00 tới 08:00 giờ Hà Nội và chỉ ra rằng <code>from=07:00</code> có trả nó.</li>
  <li>Chạy hai câu SQL của bài trên PostgreSQL của bạn (bản 13 trở lên) với 100 000 dòng; so sánh kế hoạch.</li>
</ol>
<p><strong>Đạt khi:</strong> bộ lọc nào cũng được kiểm với lỗi rõ ràng, kết quả kết hợp bằng AND, con trỏ của bộ lọc này dùng cho bộ lọc khác ra 400, và bạn giải thích được khác biệt giữa hai kế hoạch.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Filter parameter (tham số lọc)</span><span class="v">Tham số query thu hẹp danh sách; nhiều tham số kết hợp bằng AND.</span></div>
  <div class="kv"><span class="k">Overlap (chồng lấn)</span><span class="v">Hai khoảng chồng nhau khi mỗi khoảng bắt đầu trước khi khoảng kia kết thúc.</span></div>
  <div class="kv"><span class="k">Percent-encoding (mã hoá phần trăm)</span><span class="v">Dấu <code>+</code> trong query phải gửi thành <code>%2B</code>; <code>+</code> trần nghĩa là dấu cách.</span></div>
  <div class="kv"><span class="k">refine</span><span class="v">Luật Zod trên nhiều trường; có thể bị bỏ qua sau vài lỗi của trường, hoặc chạy trên giá trị còn sai — hãy viết phòng thủ.</span></div>
  <div class="kv"><span class="k">Query fingerprint (dấu vân tay truy vấn)</span><span class="v">Mã băm ngắn của bộ lọc cất trong con trỏ để không dùng lại được với truy vấn khác.</span></div>
  <div class="kv"><span class="k">Composite index (index nhiều cột)</span><span class="v">Index trên nhiều cột, ví dụ <code>(lab_id, start_at)</code>, khớp với một bộ lọc.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Bộ lọc là tham số có tên, có kiểu, được kiểm, kết hợp bằng AND; danh sách cách nhau bằng dấu phẩy.</li>
  <li>Nói rõ nghĩa của khoảng — <code>from</code>/<code>to</code> của LabFlow nghĩa là "chồng lên".</li>
  <li>Luật nhiều trường dùng <code>refine</code> với mã dịch được, viết sao cho chịu được trường còn sai.</li>
  <li>Gắn con trỏ với bộ lọc của nó; không khớp là 400, không phải một trang sai lặng lẽ.</li>
  <li>Mỗi bộ lọc công bố cần một index: 36 ms → 0,24 ms đo trên một triệu dòng.</li>
  <li>Không lọc tự do trên API công khai; áp luật quyền truy cập trước bộ lọc của người dùng.</li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── 3.4 ─────────────────────────── */
    {
      title: '3.4 — Sorting, sparse fields and includes: allow-lists, cursors per sort, the N+1 problem|||3.4 — Sắp xếp, chọn trường và nhúng quan hệ: danh sách cho phép, con trỏ theo cách sắp, vấn đề N+1',
      slug: 'api-3-4-sap-xep',
      type: 'LESSON',
      isFreePreview: true,
      description: 'sort=-field có khoá phụ và con trỏ theo khoá sắp, fields= chỉ bớt trường của view (31 KB → 10,8 KB), include=lab bằng một Map, đo N+1 trên PostgreSQL.',
      content: `${G034}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>Sorting, sparse fields and includes</h2>
<p class="lead">Three more questions every list screen asks. “Sort by start time, please.” “I only need the time and the status — the phone is on 3G.” “Show me the lab name next to each booking, without one extra request per row.” This lesson answers them with <code>sort</code>, <code>fields</code> and <code>include</code> on <code>GET /bookings</code> — each one an allow-list, each one compatible with the cursor of 3.2 — and measures why the third one is where the famous <strong>N+1</strong> problem lives.</p>

<h3>sort: an allow-list, a direction, a tie-breaker</h3>
<p>The common convention, used by JSON:API and many public APIs: <code>sort=startAt</code> ascending, <code>sort=-startAt</code> descending. LabFlow accepts exactly four values and defaults to newest first:</p>
<pre><code class="language-javascript">  sort: z.enum(['-createdAt', 'createdAt', 'startAt', '-startAt']).default('-createdAt'),</code></pre>
<p>Why not “any field”? Each sort order needs its own index to be fast (lesson 3.3), and the cursor must know the key. <code>paging.js</code> now builds the comparator from the sort value — the key, a direction, and always the id as tie-breaker in the same direction:</p>
<pre><code class="language-javascript">// paging.js — thứ tự ỔN ĐỊNH + con trỏ (cursor) cho danh sách
import { createHash } from 'node:crypto';
import { HttpError } from './http.js';

export const idNum = (id) =&gt; Number(id.slice(id.indexOf('_') + 1));

// sort = 'createdAt' | '-createdAt' | 'startAt' | '-startAt'  ('-' = giảm dần).
// Luôn thêm id làm khoá phụ cùng chiều ⇒ không bao giờ có hai bản ghi "ngang hàng" ⇒ trang không trùng, không sót.
export function orderBy(sort) {
  const desc = sort.startsWith('-'), key = sort.replace('-', '');
  const dir = desc ? -1 : 1;
  const cmp = (a, b) =&gt; dir * (a[key].localeCompare(b[key]) || idNum(a.id) - idNum(b.id));
  return { key, cmp };
}
export const newestFirst = orderBy('-createdAt').cmp;

// Dấu vân tay của bộ lọc + thứ tự: con trỏ chỉ dùng được với ĐÚNG truy vấn đã sinh ra nó
export const fingerprint = (params) =&gt;
  createHash('sha256').update(JSON.stringify(Object.entries(params).filter(([, v]) =&gt; v !== undefined).sort())).digest('hex').slice(0, 8);

// Con trỏ = giá trị khoá sắp xếp + id của phần tử CUỐI trang trước + vân tay, gói thành chuỗi mờ (base64url của JSON)
export const encodeCursor = (b, key, f) =&gt; Buffer.from(JSON.stringify({ v: b[key], id: b.id, f })).toString('base64url');

export function decodeCursor(s, key, f) {
  let c;
  try { c = JSON.parse(Buffer.from(s, 'base64url').toString('utf8')); } catch { c = null; }
  if (!c || typeof c.v !== 'string' || !/^[a-z]+_\\d+$/.test(c.id ?? ''))
    throw new HttpError(400, 'INVALID_CURSOR');        // client không được tự chế hay sửa con trỏ
  if (c.f !== f) throw new HttpError(400, 'CURSOR_MISMATCH');   // đổi bộ lọc/thứ tự giữa chừng ⇒ bắt đầu lại
  return { [key]: c.v, id: c.id };                     // một "bản ghi giả" đứng đúng vị trí con trỏ
}</code></pre>
<p>The cursor now stores the value of <em>whatever key</em> the list is sorted by (<code>v</code>), plus the id, plus a fingerprint that includes <code>sort</code> — a cursor from a <code>startAt</code> list cannot be used on a <code>createdAt</code> list.</p>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?sort=startAt&amp;limit=4' \\
  -H 'Authorization: Bearer tok_lan' | jq -c '.data[] | [.id, .startAt]'</code></pre>
<div class="out">["bk_1","2026-11-02T00:00:00.000Z"]
["bk_2","2026-11-02T00:00:00.000Z"]
["bk_3","2026-11-02T00:00:00.000Z"]
["bk_4","2026-11-02T02:00:00.000Z"]</div>
<p><code>bk_1</code>, <code>bk_2</code>, <code>bk_3</code> start at the same moment (three labs in parallel); the tie-breaker orders them by id, the same way on every call.</p>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?sort=-startAt&amp;limit=4' \\
  -H 'Authorization: Bearer tok_lan' | jq -c '.data[] | [.id, .startAt]'</code></pre>
<div class="out">["bk_200","2026-11-15T02:00:00.000Z"]
["bk_199","2026-11-15T02:00:00.000Z"]
["bk_198","2026-11-15T00:00:00.000Z"]
["bk_197","2026-11-15T00:00:00.000Z"]</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?sort=purpose' \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'Accept-Language: en' | jq -c '.errors'</code></pre>
<div class="out">[{"parameter":"sort","detail":"Invalid option: expected one of \\"-createdAt\\"|\\"createdAt\\"|\\"startAt\\"|\\"-startAt\\""}]</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?sort=startAt&amp;limit=3' \\
  -H 'Authorization: Bearer tok_lan' | jq -r '.page.next' | node -e "process.stdin.on('data', (d) =&gt; console.log(Buffer.from(String(d).trim(), 'base64url').toString()))"</code></pre>
<div class="out">{"v":"2026-11-02T00:00:00.000Z","id":"bk_3","f":"6fe383fc"}</div>

<h3>fields: send less over the wire</h3>
<p><code>fields</code> is a comma list of members to keep — a <strong>sparse fieldset</strong>. It is validated against the members of the view, never against the database record, so it can only <em>remove</em> from the allow-list of lesson 2.3, never add:</p>
<pre><code class="language-javascript">export const BOOKING_FIELDS = ['id', 'labId', 'userId', 'startAt', 'endAt', 'purpose', 'status', 'createdAt', 'cancelledAt'];
// …
  fields: z.string()
    .transform((s) =&gt; s.split(','))
    .pipe(z.array(z.enum(BOOKING_FIELDS)).min(1))
    .optional(),</code></pre>
<pre><code class="language-bash">curl -i 'http://localhost:4000/bookings?fields=startAt,status&amp;limit=3' \\
  -H 'Authorization: Bearer tok_lan'</code></pre>
<div class="out">HTTP/1.1 200 OK
Link: &lt;/bookings?fields=startAt%2Cstatus&amp;limit=3&amp;cursor=eyJ2IjoiMjAyNi0xMC0wMVQwMzoxODowMC4wMDBaIiwiaWQiOiJia18xOTgiLCJmIjoiYTdjMGE4NmUifQ&gt;; rel="next"
Content-Type: application/json; charset=utf-8
Content-Length: 466
ETag: W/"1d2-rkn4B1monYYzDGuKlKW7zKTlQrk"
Date: Sat, 31 Oct 2026 19:23:14 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "data": [
    {
      "id": "bk_200",
      "startAt": "2026-11-15T02:00:00.000Z",
      "status": "PENDING"
    },
    {
      "id": "bk_199",
      "startAt": "2026-11-15T02:00:00.000Z",
      "status": "PENDING"
    },
    {
      "id": "bk_198",
      "startAt": "2026-11-15T00:00:00.000Z",
      "status": "PENDING"
    }
  ],
  "page": {
    "limit": 3,
    "next": "eyJ2IjoiMjAyNi0xMC0wMVQwMzoxODowMC4wMDBaIiwiaWQiOiJia18xOTgiLCJmIjoiYTdjMGE4NmUifQ"
  }
}</div>
<p><code>id</code> is always kept — a client cannot do anything with an item it cannot identify. Asking for something outside the view is a 400, not a leak:</p>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?fields=startAt,passwordHash' \\
  -H 'Authorization: Bearer tok_lan' | jq -c '.errors'</code></pre>
<div class="out">[{"parameter":"fields","detail":"Tùy chọn không hợp lệ: mong đợi một trong các giá trị \\"id\\"|\\"labId\\"|\\"userId\\"|\\"startAt\\"|\\"endAt\\"|\\"purpose\\"|\\"status\\"|\\"createdAt\\"|\\"cancelledAt\\""}]</div>
<p>What it buys, measured on 100 bookings:</p>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{size_download} bytes\\n' 'http://localhost:4000/bookings?limit=100' \\
  -H 'Authorization: Bearer tok_lan'</code></pre>
<div class="out">31026 bytes</div>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{size_download} bytes\\n' 'http://localhost:4000/bookings?limit=100&amp;fields=startAt,status' \\
  -H 'Authorization: Bearer tok_lan'</code></pre>
<div class="out">10778 bytes</div>
<p>31 026 → 10 778 bytes, about two thirds less, for a list screen that shows only time and status. On a slow mobile network that is the difference you feel.</p>

<h3>include: related data without N+1</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">naive</span><span class="lz-t">1 query for 20 bookings</span><span class="lz-d">+ 20 queries, one lab each = 21</span></div>
  <div class="lz-step"><span class="lz-k">include=lab</span><span class="lz-t">1 query for bookings</span><span class="lz-d">collect the 3 distinct labIds</span></div>
  <div class="lz-step"><span class="lz-k">batch</span><span class="lz-t">1 query labs WHERE id IN (…)</span><span class="lz-d">2 queries in total</span></div>
  <div class="lz-step"><span class="lz-k">join in memory</span><span class="lz-t">attach lab to each booking</span><span class="lz-d">same response, any page size</span></div>
</div>
<p>A booking has a <code>labId</code>. To show the lab name, a client could call <code>GET /labs/{id}</code> for every booking — 20 bookings, 20 extra requests. With <code>include=lab</code> the API embeds the lab’s view:</p>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?include=lab&amp;fields=startAt&amp;limit=2' \\
  -H 'Authorization: Bearer tok_lan'</code></pre>
<div class="out">{
  "data": [
    {
      "id": "bk_200",
      "startAt": "2026-11-15T02:00:00.000Z",
      "lab": {
        "id": "lab_2",
        "code": "AL-305",
        "name": "Phòng Lab IoT",
        "building": "Alpha",
        "capacity": 24
      }
    },
    {
      "id": "bk_199",
      "startAt": "2026-11-15T02:00:00.000Z",
      "lab": {
        "id": "lab_1",
        "code": "AL-201",
        "name": "Phòng Lab Mạng máy tính",
        "building": "Alpha",
        "capacity": 30
      }
    }
  ],
  "page": {
    "limit": 2,
    "next": "eyJ2IjoiMjAyNi0xMC0wMVQwMzoxOTowMC4wMDBaIiwiaWQiOiJia18xOTkiLCJmIjoiYTdjMGE4NmUifQ"
  }
}</div>
<p>The handler, with the part that matters for performance:</p>
<pre><code class="language-javascript">    // include=lab: tra phòng bằng MỘT Map dựng sẵn — không tìm lại trong mảng cho từng dòng (N+1)
    const labById = include === 'lab' ? new Map(labs.map((l) =&gt; [l.id, l])) : null;
    const data = page.map((b) =&gt; {
      let v = toBooking(b);
      if (fields) v = Object.fromEntries(['id', ...fields.filter((x) =&gt; x !== 'id')].map((k) =&gt; [k, v[k]]));
      if (labById) v.lab = toLab(labById.get(b.labId));
      return v;
    });</code></pre>
<p>The <strong>N+1 problem</strong>: one query for the page, then one more query per row (N rows ⇒ N+1 queries). In memory it hardly shows; against a database every query is a round trip. Measured on the PostgreSQL table, 20 rows:</p>
<div class="out">--- N+1: 1 query for the page + 20 queries, one per row
Time: 0.397 ms
Time: 0.241 ms
Time: 0.124 ms
Time: 0.085 ms
…  (16 more lines between 0.073 and 0.096 ms)
Time: 0.074 ms
--- 1 query with a JOIN
Time: 0.250 ms</div>
<p>21 queries took 2.16 ms in total; one JOIN took 0.25 ms — about 9 times less, on <em>localhost</em>. Across a real network every one of those 21 queries also pays the network round trip, and an ORM can produce N+1 without you writing a loop at all (lazy loading of a relation). Load related data in one query (JOIN or <code>WHERE id = ANY(…)</code>) or, in memory, one Map.</p>

<div class="pitfall"><p><strong>Trap — includes all the way down.</strong> <code>include=lab.devices.issues.reporter</code> turns one request into a tree the server must assemble and a response nobody can predict. LabFlow allows one level of includes from an allow-list. When clients really need arbitrary graphs, that is the job of GraphQL (Chapter 7).</p></div>
<div class="pitfall"><p><strong>Trap — sorting by a field you cannot index.</strong> <code>sort=purpose</code> on a million rows sorts a million rows. Publish only the sort orders you have indexes for.</p></div>

<h3>In interviews and at work</h3>
<p><strong>“What is the N+1 problem?”</strong> Fetching a list with one query and then each related item with its own query: N+1 round trips. Fix with a JOIN or a batched <code>IN</code> / <code>ANY</code> query, eager loading in the ORM, or a DataLoader in GraphQL.</p>
<p><strong>“How do sort and cursors work together?”</strong> The cursor stores the values of the current sort keys plus the tie-breaker, and the query fingerprint includes the sort, so a cursor cannot be replayed under another order.</p>

<a class="link-card" href="https://www.postgresql.org/docs/current/queries-limit.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: PostgreSQL 18 docs — LIMIT and OFFSET — read 1 Nov 2026</span><span class="lc-sub">The same page of the PostgreSQL docs: without an ORDER BY that gives a unique order you get “an unpredictable subset” — why every sort ends with the id tie-breaker.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
  <li>Add <code>sort</code>, <code>fields</code>, <code>include</code>; reproduce the outputs, then walk all bookings with <code>sort=startAt&amp;limit=30</code> and check for duplicates.</li>
  <li>Measure <code>?fields=id</code> with <code>-w '%{size_download}'</code> on 100 bookings.</li>
  <li>Write the naive include (<code>labs.find</code> inside <code>map</code>) and count how many array lookups it makes for 100 bookings; then count for the Map version.</li>
  <li>Add <code>include=user</code> that embeds <code>toMe</code>-like data. Which fields are safe to embed for a lab manager? Write the allow-list.</li>
</ol>
<p><strong>Done when:</strong> every sort order pages without duplicates through its cursor, <code>fields</code> can only remove members of the view, and <code>include=lab</code> uses one lookup structure for the whole page.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">sort parameter</span><span class="v"><code>field</code> ascending, <code>-field</code> descending, from an allow-list.</span></div>
  <div class="kv"><span class="k">Sparse fieldset</span><span class="v">Asking for only some members of a resource (<code>fields=</code>).</span></div>
  <div class="kv"><span class="k">include / embedding</span><span class="v">Putting a related resource inside the response (<code>include=lab</code>).</span></div>
  <div class="kv"><span class="k">N+1 problem</span><span class="v">One query for a list plus one per item; fixed with a join or a batched query.</span></div>
  <div class="kv"><span class="k">Eager loading</span><span class="v">Loading related data together with the main query instead of on first access.</span></div>
  <div class="kv"><span class="k">Round trip</span><span class="v">One request and its response over the network; every query pays one.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li><code>sort</code> takes values from an allow-list; each order keeps the id as tie-breaker.</li>
  <li>The cursor stores the current sort key; the fingerprint includes the sort.</li>
  <li><code>fields</code> only removes members of the view: 31 KB → 10.8 KB for 100 bookings.</li>
  <li><code>include</code> embeds one level of related views from an allow-list.</li>
  <li>Avoid N+1: one query or one lookup map per page — 2.16 ms vs 0.25 ms measured on localhost.</li>
  <li>Publish only sort orders and includes you can serve fast.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>Sắp xếp, chọn trường và nhúng quan hệ</h2>
<p class="lead">Thêm ba câu hỏi màn hình danh sách nào cũng hỏi. "Sắp theo giờ bắt đầu giúp tôi." "Tôi chỉ cần giờ và trạng thái — điện thoại đang 3G." "Hiện tên phòng cạnh từng lượt đặt, đừng mỗi dòng gọi thêm một request." Bài này trả lời bằng <code>sort</code>, <code>fields</code> và <code>include</code> trên <code>GET /bookings</code> — cái nào cũng là danh sách cho phép, cái nào cũng tương thích với con trỏ của bài 3.2 — và đo xem vì sao cái thứ ba là nơi trú ngụ của vấn đề <strong>N+1</strong> nổi tiếng.</p>

<h3>sort: danh sách cho phép, chiều sắp, khoá phụ</h3>
<p>Quy ước phổ biến, được JSON:API và nhiều API công khai dùng: <code>sort=startAt</code> là tăng dần, <code>sort=-startAt</code> là giảm dần. LabFlow nhận đúng bốn giá trị, mặc định mới nhất trước:</p>
<pre><code class="language-javascript">  sort: z.enum(['-createdAt', 'createdAt', 'startAt', '-startAt']).default('-createdAt'),</code></pre>
<p>Sao không cho "trường bất kỳ"? Mỗi cách sắp cần index riêng mới nhanh được (bài 3.3), và con trỏ phải biết khoá sắp. <code>paging.js</code> giờ dựng hàm so sánh từ giá trị sort — khoá, chiều sắp, và luôn kèm id làm khoá phụ cùng chiều:</p>
<pre><code class="language-javascript">// paging.js — thứ tự ỔN ĐỊNH + con trỏ (cursor) cho danh sách
import { createHash } from 'node:crypto';
import { HttpError } from './http.js';

export const idNum = (id) =&gt; Number(id.slice(id.indexOf('_') + 1));

// sort = 'createdAt' | '-createdAt' | 'startAt' | '-startAt'  ('-' = giảm dần).
// Luôn thêm id làm khoá phụ cùng chiều ⇒ không bao giờ có hai bản ghi "ngang hàng" ⇒ trang không trùng, không sót.
export function orderBy(sort) {
  const desc = sort.startsWith('-'), key = sort.replace('-', '');
  const dir = desc ? -1 : 1;
  const cmp = (a, b) =&gt; dir * (a[key].localeCompare(b[key]) || idNum(a.id) - idNum(b.id));
  return { key, cmp };
}
export const newestFirst = orderBy('-createdAt').cmp;

// Dấu vân tay của bộ lọc + thứ tự: con trỏ chỉ dùng được với ĐÚNG truy vấn đã sinh ra nó
export const fingerprint = (params) =&gt;
  createHash('sha256').update(JSON.stringify(Object.entries(params).filter(([, v]) =&gt; v !== undefined).sort())).digest('hex').slice(0, 8);

// Con trỏ = giá trị khoá sắp xếp + id của phần tử CUỐI trang trước + vân tay, gói thành chuỗi mờ (base64url của JSON)
export const encodeCursor = (b, key, f) =&gt; Buffer.from(JSON.stringify({ v: b[key], id: b.id, f })).toString('base64url');

export function decodeCursor(s, key, f) {
  let c;
  try { c = JSON.parse(Buffer.from(s, 'base64url').toString('utf8')); } catch { c = null; }
  if (!c || typeof c.v !== 'string' || !/^[a-z]+_\\d+$/.test(c.id ?? ''))
    throw new HttpError(400, 'INVALID_CURSOR');        // client không được tự chế hay sửa con trỏ
  if (c.f !== f) throw new HttpError(400, 'CURSOR_MISMATCH');   // đổi bộ lọc/thứ tự giữa chừng ⇒ bắt đầu lại
  return { [key]: c.v, id: c.id };                     // một "bản ghi giả" đứng đúng vị trí con trỏ
}</code></pre>
<p>Con trỏ giờ lưu giá trị của <em>khoá đang dùng để sắp</em> (<code>v</code>), cộng id, cộng một dấu vân tay có tính cả <code>sort</code> — con trỏ của danh sách sắp theo <code>startAt</code> không dùng được cho danh sách sắp theo <code>createdAt</code>.</p>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?sort=startAt&amp;limit=4' \\
  -H 'Authorization: Bearer tok_lan' | jq -c '.data[] | [.id, .startAt]'</code></pre>
<div class="out">["bk_1","2026-11-02T00:00:00.000Z"]
["bk_2","2026-11-02T00:00:00.000Z"]
["bk_3","2026-11-02T00:00:00.000Z"]
["bk_4","2026-11-02T02:00:00.000Z"]</div>
<p><code>bk_1</code>, <code>bk_2</code>, <code>bk_3</code> bắt đầu cùng lúc (ba phòng chạy song song); khoá phụ xếp chúng theo id, lần gọi nào cũng như nhau.</p>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?sort=-startAt&amp;limit=4' \\
  -H 'Authorization: Bearer tok_lan' | jq -c '.data[] | [.id, .startAt]'</code></pre>
<div class="out">["bk_200","2026-11-15T02:00:00.000Z"]
["bk_199","2026-11-15T02:00:00.000Z"]
["bk_198","2026-11-15T00:00:00.000Z"]
["bk_197","2026-11-15T00:00:00.000Z"]</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?sort=purpose' \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'Accept-Language: en' | jq -c '.errors'</code></pre>
<div class="out">[{"parameter":"sort","detail":"Invalid option: expected one of \\"-createdAt\\"|\\"createdAt\\"|\\"startAt\\"|\\"-startAt\\""}]</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?sort=startAt&amp;limit=3' \\
  -H 'Authorization: Bearer tok_lan' | jq -r '.page.next' | node -e "process.stdin.on('data', (d) =&gt; console.log(Buffer.from(String(d).trim(), 'base64url').toString()))"</code></pre>
<div class="out">{"v":"2026-11-02T00:00:00.000Z","id":"bk_3","f":"6fe383fc"}</div>

<h3>fields: gửi ít hơn qua đường truyền</h3>
<p><code>fields</code> là danh sách các trường cần giữ, cách nhau bằng dấu phẩy — một <strong>sparse fieldset</strong> (bộ trường rút gọn). Nó được kiểm với các trường của view, không bao giờ với bản ghi trong cơ sở dữ liệu, nên chỉ có thể <em>bớt</em> khỏi danh sách cho phép của bài 2.3, không bao giờ thêm:</p>
<pre><code class="language-javascript">export const BOOKING_FIELDS = ['id', 'labId', 'userId', 'startAt', 'endAt', 'purpose', 'status', 'createdAt', 'cancelledAt'];
// …
  fields: z.string()
    .transform((s) =&gt; s.split(','))
    .pipe(z.array(z.enum(BOOKING_FIELDS)).min(1))
    .optional(),</code></pre>
<pre><code class="language-bash">curl -i 'http://localhost:4000/bookings?fields=startAt,status&amp;limit=3' \\
  -H 'Authorization: Bearer tok_lan'</code></pre>
<div class="out">HTTP/1.1 200 OK
Link: &lt;/bookings?fields=startAt%2Cstatus&amp;limit=3&amp;cursor=eyJ2IjoiMjAyNi0xMC0wMVQwMzoxODowMC4wMDBaIiwiaWQiOiJia18xOTgiLCJmIjoiYTdjMGE4NmUifQ&gt;; rel="next"
Content-Type: application/json; charset=utf-8
Content-Length: 466
ETag: W/"1d2-rkn4B1monYYzDGuKlKW7zKTlQrk"
Date: Sat, 31 Oct 2026 19:23:14 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "data": [
    {
      "id": "bk_200",
      "startAt": "2026-11-15T02:00:00.000Z",
      "status": "PENDING"
    },
    {
      "id": "bk_199",
      "startAt": "2026-11-15T02:00:00.000Z",
      "status": "PENDING"
    },
    {
      "id": "bk_198",
      "startAt": "2026-11-15T00:00:00.000Z",
      "status": "PENDING"
    }
  ],
  "page": {
    "limit": 3,
    "next": "eyJ2IjoiMjAyNi0xMC0wMVQwMzoxODowMC4wMDBaIiwiaWQiOiJia18xOTgiLCJmIjoiYTdjMGE4NmUifQ"
  }
}</div>
<p><code>id</code> luôn được giữ — client chẳng làm gì được với một phần tử mà nó không định danh được. Xin thứ nằm ngoài view là 400, không phải rò rỉ:</p>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?fields=startAt,passwordHash' \\
  -H 'Authorization: Bearer tok_lan' | jq -c '.errors'</code></pre>
<div class="out">[{"parameter":"fields","detail":"Tùy chọn không hợp lệ: mong đợi một trong các giá trị \\"id\\"|\\"labId\\"|\\"userId\\"|\\"startAt\\"|\\"endAt\\"|\\"purpose\\"|\\"status\\"|\\"createdAt\\"|\\"cancelledAt\\""}]</div>
<p>Lợi ích đo được trên 100 lượt đặt:</p>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{size_download} bytes\\n' 'http://localhost:4000/bookings?limit=100' \\
  -H 'Authorization: Bearer tok_lan'</code></pre>
<div class="out">31026 bytes</div>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{size_download} bytes\\n' 'http://localhost:4000/bookings?limit=100&amp;fields=startAt,status' \\
  -H 'Authorization: Bearer tok_lan'</code></pre>
<div class="out">10778 bytes</div>
<p>31 026 → 10 778 byte, ít hơn khoảng hai phần ba, cho một màn hình danh sách chỉ hiện giờ và trạng thái. Trên mạng di động chậm, đó là khác biệt bạn cảm nhận được.</p>

<h3>include: dữ liệu liên quan mà không N+1</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">ngây thơ</span><span class="lz-t">1 truy vấn cho 20 lượt đặt</span><span class="lz-d">+ 20 truy vấn, mỗi phòng một = 21</span></div>
  <div class="lz-step"><span class="lz-k">include=lab</span><span class="lz-t">1 truy vấn lượt đặt</span><span class="lz-d">gom 3 labId khác nhau</span></div>
  <div class="lz-step"><span class="lz-k">theo lô</span><span class="lz-t">1 truy vấn labs WHERE id IN (…)</span><span class="lz-d">tổng cộng 2 truy vấn</span></div>
  <div class="lz-step"><span class="lz-k">ghép trong bộ nhớ</span><span class="lz-t">gắn phòng vào từng lượt đặt</span><span class="lz-d">cùng câu trả lời, trang lớn mấy cũng vậy</span></div>
</div>
<p>Một lượt đặt có <code>labId</code>. Để hiện tên phòng, client có thể gọi <code>GET /labs/{id}</code> cho từng lượt đặt — 20 lượt, 20 request thêm. Với <code>include=lab</code>, API nhúng sẵn view của phòng:</p>
<pre><code class="language-bash">curl -s 'http://localhost:4000/bookings?include=lab&amp;fields=startAt&amp;limit=2' \\
  -H 'Authorization: Bearer tok_lan'</code></pre>
<div class="out">{
  "data": [
    {
      "id": "bk_200",
      "startAt": "2026-11-15T02:00:00.000Z",
      "lab": {
        "id": "lab_2",
        "code": "AL-305",
        "name": "Phòng Lab IoT",
        "building": "Alpha",
        "capacity": 24
      }
    },
    {
      "id": "bk_199",
      "startAt": "2026-11-15T02:00:00.000Z",
      "lab": {
        "id": "lab_1",
        "code": "AL-201",
        "name": "Phòng Lab Mạng máy tính",
        "building": "Alpha",
        "capacity": 30
      }
    }
  ],
  "page": {
    "limit": 2,
    "next": "eyJ2IjoiMjAyNi0xMC0wMVQwMzoxOTowMC4wMDBaIiwiaWQiOiJia18xOTkiLCJmIjoiYTdjMGE4NmUifQ"
  }
}</div>
<p>Handler, với phần quan trọng cho hiệu năng:</p>
<pre><code class="language-javascript">    // include=lab: tra phòng bằng MỘT Map dựng sẵn — không tìm lại trong mảng cho từng dòng (N+1)
    const labById = include === 'lab' ? new Map(labs.map((l) =&gt; [l.id, l])) : null;
    const data = page.map((b) =&gt; {
      let v = toBooking(b);
      if (fields) v = Object.fromEntries(['id', ...fields.filter((x) =&gt; x !== 'id')].map((k) =&gt; [k, v[k]]));
      if (labById) v.lab = toLab(labById.get(b.labId));
      return v;
    });</code></pre>
<p><strong>Vấn đề N+1</strong>: một truy vấn lấy trang, rồi mỗi dòng thêm một truy vấn (N dòng ⇒ N+1 truy vấn). Trong RAM gần như không lộ; với cơ sở dữ liệu, truy vấn nào cũng là một lượt đi-về. Đo trên bảng PostgreSQL, 20 dòng:</p>
<div class="out">--- N+1: 1 query for the page + 20 queries, one per row
Time: 0.397 ms
Time: 0.241 ms
Time: 0.124 ms
Time: 0.085 ms
…  (16 more lines between 0.073 and 0.096 ms)
Time: 0.074 ms
--- 1 query with a JOIN
Time: 0.250 ms</div>
<p>21 truy vấn mất tổng cộng 2,16 ms; một JOIN mất 0,25 ms — ít hơn khoảng 9 lần, và đó là trên <em>localhost</em>. Qua mạng thật, mỗi truy vấn trong 21 cái còn phải trả thêm một lượt đi-về của mạng, và ORM có thể sinh ra N+1 mà bạn chẳng viết vòng lặp nào (nạp lười một quan hệ — lazy loading). Hãy nạp dữ liệu liên quan trong một truy vấn (JOIN hoặc <code>WHERE id = ANY(…)</code>) hoặc, trong RAM, bằng một Map.</p>

<div class="pitfall"><p><strong>Bẫy — include sâu không đáy.</strong> <code>include=lab.devices.issues.reporter</code> biến một request thành một cái cây server phải ráp và một response không ai đoán trước được. LabFlow chỉ cho một tầng include, từ danh sách cho phép. Khi client thật sự cần đồ thị tuỳ ý, đó là việc của GraphQL (Chương 7).</p></div>
<div class="pitfall"><p><strong>Bẫy — sắp theo trường không đánh index được.</strong> <code>sort=purpose</code> trên một triệu dòng là sắp một triệu dòng. Chỉ công bố những cách sắp bạn có index.</p></div>

<h3>Phỏng vấn và đi làm</h3>
<p><strong>"Vấn đề N+1 là gì?"</strong> Lấy danh sách bằng một truy vấn rồi lấy từng thứ liên quan bằng truy vấn riêng: N+1 lượt đi-về. Chữa bằng JOIN hoặc một truy vấn gộp <code>IN</code> / <code>ANY</code>, nạp sẵn (eager loading) trong ORM, hoặc DataLoader trong GraphQL.</p>
<p><strong>"sort và con trỏ phối hợp thế nào?"</strong> Con trỏ lưu giá trị các khoá sắp hiện tại cộng khoá phụ, và dấu vân tay truy vấn có tính cả sort, nên không đem con trỏ dùng lại với thứ tự khác được.</p>

<a class="link-card" href="https://www.postgresql.org/docs/current/queries-limit.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: Tài liệu PostgreSQL 18 — LIMIT và OFFSET — đọc ngày 1/11/2026</span><span class="lc-sub">Cùng trang tài liệu PostgreSQL: thiếu ORDER BY cho thứ tự duy nhất thì nhận “một tập con không đoán trước được” — lý do mọi phép sắp kết thúc bằng id phá thế hoà.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
  <li>Thêm <code>sort</code>, <code>fields</code>, <code>include</code>; tái hiện các output, rồi đi hết lượt đặt với <code>sort=startAt&amp;limit=30</code> và kiểm không trùng.</li>
  <li>Đo <code>?fields=id</code> bằng <code>-w '%{size_download}'</code> trên 100 lượt đặt.</li>
  <li>Viết bản include ngây thơ (<code>labs.find</code> trong <code>map</code>) và đếm số lần tra mảng cho 100 lượt đặt; rồi đếm cho bản dùng Map.</li>
  <li>Thêm <code>include=user</code> nhúng dữ liệu kiểu <code>toMe</code>. Trường nào an toàn để nhúng cho quản lý phòng lab? Viết danh sách cho phép.</li>
</ol>
<p><strong>Đạt khi:</strong> cách sắp nào cũng lật trang qua con trỏ của nó mà không trùng, <code>fields</code> chỉ bớt được trường của view, và <code>include=lab</code> dùng một cấu trúc tra cứu cho cả trang.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">sort parameter (tham số sắp xếp)</span><span class="v"><code>field</code> tăng dần, <code>-field</code> giảm dần, lấy từ danh sách cho phép.</span></div>
  <div class="kv"><span class="k">Sparse fieldset (bộ trường rút gọn)</span><span class="v">Chỉ xin một số trường của tài nguyên (<code>fields=</code>).</span></div>
  <div class="kv"><span class="k">include / embedding (nhúng)</span><span class="v">Đặt một tài nguyên liên quan vào trong response (<code>include=lab</code>).</span></div>
  <div class="kv"><span class="k">N+1 problem (vấn đề N+1)</span><span class="v">Một truy vấn cho danh sách cộng một truy vấn cho mỗi phần tử; chữa bằng JOIN hoặc truy vấn gộp.</span></div>
  <div class="kv"><span class="k">Eager loading (nạp sẵn)</span><span class="v">Nạp dữ liệu liên quan cùng truy vấn chính thay vì khi truy cập lần đầu.</span></div>
  <div class="kv"><span class="k">Round trip (lượt đi-về)</span><span class="v">Một request và response của nó qua mạng; truy vấn nào cũng trả một lượt.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li><code>sort</code> nhận giá trị từ danh sách cho phép; cách sắp nào cũng giữ id làm khoá phụ.</li>
  <li>Con trỏ lưu khoá sắp hiện tại; dấu vân tay có tính cả sort.</li>
  <li><code>fields</code> chỉ bớt trường của view: 31 KB → 10,8 KB cho 100 lượt đặt.</li>
  <li><code>include</code> nhúng một tầng view liên quan, từ danh sách cho phép.</li>
  <li>Tránh N+1: mỗi trang một truy vấn hoặc một bảng tra — 2,16 ms so với 0,25 ms đo trên localhost.</li>
  <li>Chỉ công bố những cách sắp và include bạn phục vụ nhanh được.</li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── 3.5 Lab (bài MỚI) ─────────────────────────── */
    {
      title: '3.5 — Lab 3: the maintenance list (cursor, filters, severity order, include — with rubric)|||3.5 — Lab 3: danh sách bảo trì (con trỏ, bộ lọc, sắp theo mức độ, nhúng thiết bị — có thang chấm)',
      slug: 'api-3-5-lab',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Lab chương: GET /issues phân trang con trỏ, lọc, sắp theo thứ hạng mức độ, include=device, client đi hết danh sách không trùng; thang chấm 10 điểm, lời giải và transcript thật.',
      content: `${GL3}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lab</span>
<h2>Lab 3 — The maintenance list</h2>
<p class="lead">Every Monday the lab managers meet to go through broken devices. Today they scroll a spreadsheet; they want <code>GET /issues</code> to give them the list instead — most severe first, filterable, a page at a time, and correct even while students keep reporting. You build it on your own with everything from Chapter 3; a rubric and a real transcript are at the end.</p>

<h3>The request</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">A</span><span class="lz-t">design</span><span class="lz-d">cursor, filters, sort, include for issues</span></div>
  <div class="lz-step"><span class="lz-k">B</span><span class="lz-t">build</span><span class="lz-d">one strict query schema, keyset paging</span></div>
  <div class="lz-step"><span class="lz-k">C</span><span class="lz-t">prove</span><span class="lz-d">transcript: pages, filters, wrong cursor</span></div>
  <div class="lz-step"><span class="lz-k">score</span><span class="lz-t">rubric</span><span class="lz-d">10 points, pass at 7</span></div>
</div>
<a class="link-card" href="https://google.aip.dev/158" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: Google AIP-158 — Pagination — read 1 Nov 2026</span><span class="lc-sub">The pagination contract this lab implements.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<ul>
  <li>“Show issues <strong>25 at a time</strong> (we never want more than 100 in one go).”</li>
  <li>“Filter by <strong>status</strong>, <strong>severity</strong> and <strong>device</strong>.”</li>
  <li>“Sort newest first by default, oldest first on request, and — for the meeting — <strong>most severe first</strong>: HIGH, then MEDIUM, then LOW.”</li>
  <li>“Put the device’s name next to each issue so we do not have to look it up.”</li>
  <li>“A script must be able to walk the whole list without missing or repeating an issue, even if someone reports while it runs.”</li>
</ul>
<p>Budget: design 15 min · build 60–90 min · prove 20 min. Start from your code at the end of lesson 3.4. For data, add <code>seedIssues(n)</code> next to <code>seedBookings</code> and start with <code>SEED_BOOKINGS=200 SEED_ISSUES=60</code>.</p>

<h3>Part A — design before you code (add to <code>DESIGN.md</code>)</h3>
<ol>
  <li>The full query contract: every parameter, its type, default and maximum.</li>
  <li>The order for each <code>sort</code> value, <strong>including the tie-breaker</strong>. Why does <code>-severity</code> need something other than comparing strings?</li>
  <li>What the cursor contains for <code>sort=-severity</code>, and what makes a cursor from <code>status=OPEN</code> unusable with <code>status=RESOLVED</code>.</li>
  <li>The status and <code>code</code> for: <code>limit=0</code>, <code>sort=title</code>, an edited cursor, a cursor reused with another <code>deviceId</code>.</li>
</ol>

<h3>Part B — build it: rules</h3>
<ol>
  <li>Strict Zod schema; <code>limit</code> 1–100, default 20 (the meeting uses 25); <code>sort</code> ∈ <code>-createdAt</code>, <code>createdAt</code>, <code>-severity</code>; <code>include</code> ∈ <code>device</code>.</li>
  <li>Severity is sorted by <strong>business rank</strong> (LOW 1 · MEDIUM 2 · HIGH 3), never alphabetically, with the id as tie-breaker.</li>
  <li>Cursor pagination with the helpers of 3.2–3.4 (extend <code>orderBy</code> rather than writing a second comparator); fingerprint over filters and sort; <code>Link: rel="next"</code>; <code>page.next = null</code> at the end.</li>
  <li><code>include=device</code> embeds <code>toDevice</code> with one Map per page — no lookup per row.</li>
  <li>Every error is a problem document of Chapter 2, in both languages.</li>
  <li>A <code>walk.mjs</code> client follows <code>page.next</code> to the end and reports duplicates.</li>
</ol>

<h3>Part C — prove it (<code>TRANSCRIPT.md</code>)</h3>
<p>Restart with <code>SEED_BOOKINGS=200 SEED_ISSUES=60</code> and paste every full output:</p>
<ol>
  <li><code>GET /issues?limit=3</code> with <code>-i</code> → 3 issues, <code>Link</code> header, <code>page.next</code>.</li>
  <li>Follow <code>next</code> → the next 3 issues, no overlap.</li>
  <li><code>sort=-severity&amp;status=OPEN&amp;limit=5</code> → five HIGH issues, newest first among equals.</li>
  <li><code>deviceId=dev_3&amp;severity=HIGH&amp;include=device&amp;limit=1</code> → the issue with its device.</li>
  <li><code>limit=0&amp;sort=title</code> in English → 400 with two parameters; the cursor of step 1 with <code>deviceId=dev_2</code> → 400 <code>CURSOR_MISMATCH</code>.</li>
  <li><code>node walk.mjs</code> → every OPEN issue exactly once.</li>
</ol>

<h3>Rubric — 10 points</h3>
<table>
  <thead><tr><th>Points</th><th>Criterion</th><th>Checked by</th></tr></thead>
  <tbody>
    <tr><td>2</td><td>Query contract: strict, typed, defaults and maximum, clear 400s</td><td>step 5 · <code>DESIGN.md</code></td></tr>
    <tr><td>2</td><td>Stable orders with a tie-breaker; severity by business rank</td><td>step 3</td></tr>
    <tr><td>2</td><td>Cursor: opaque, bound to filters and sort, <code>Link</code>, <code>null</code> at the end</td><td>steps 1, 2, 5</td></tr>
    <tr><td>1</td><td><code>include=device</code> without per-row lookups</td><td>step 4 · code</td></tr>
    <tr><td>2</td><td><code>walk.mjs</code> sees every OPEN issue once, also when an issue is reported mid-walk</td><td>step 6 + your own insert test</td></tr>
    <tr><td>1</td><td>Transcript complete and unedited</td><td>the file</td></tr>
  </tbody>
</table>
<p><strong>Pass: 7/10.</strong> Hand in <code>DESIGN.md</code>, the changed <code>src/</code> files, <code>walk.mjs</code> and <code>TRANSCRIPT.md</code> in one commit.</p>

<h3>Stretch goals</h3>
<ul>
  <li>A <code>prev</code> cursor, so the meeting can scroll back.</li>
  <li>Sign the cursor with an HMAC (<code>node:crypto</code> <code>createHmac</code>) and reject modified ones with <code>INVALID_CURSOR</code>.</li>
  <li><code>fields=</code> for issues, validated against the members of <code>toIssue</code>.</li>
</ul>

<h3>Reference solution — read after you have tried</h3>
<p><strong>Design.</strong> <code>-severity</code>: rank desc, then id desc; the cursor holds <code>{ v: 'HIGH', id: 'iss_58', f }</code> and the fingerprint covers <code>status, severity, deviceId, sort</code>. Errors: 400 <code>INVALID_QUERY</code> (limit, sort), 400 <code>INVALID_CURSOR</code>, 400 <code>CURSOR_MISMATCH</code>.</p>
<p><code>src/seed.js</code> — issues for the lab (severity is spread so every device has all three levels):</p>
<pre><code class="language-javascript">// Lab 3 — báo hỏng mẫu: SEED_ISSUES=60
const TITLES = ['Cổng console không lên đèn', 'Quạt kêu to', 'Mất nguồn ngẫu nhiên', 'Cổng 24 chập chờn', 'Thiếu thẻ nhớ'];
const SEV = ['LOW', 'MEDIUM', 'HIGH'];
export function seedIssues(n) {
  const out = [];
  for (let i = 1; i &lt;= n; i++) {
    const created = Date.UTC(2026, 9, 5) + i * 3600000;           // mỗi báo hỏng cách nhau 1 giờ
    const resolved = i % 4 === 0;
    out.push({
      id: &#96;iss_\${i}&#96;, deviceId: &#96;dev_\${((i - 1) % 3) + 1}&#96;, reportedBy: i % 2 ? 'usr_1' : 'usr_2',
      title: &#96;\${TITLES[i % TITLES.length]} #\${i}&#96;, severity: SEV[(i + Math.floor(i / 3)) % 3],
      status: resolved ? 'RESOLVED' : 'OPEN', createdAt: new Date(created).toISOString(),
      ...(resolved &amp;&amp; { resolvedAt: new Date(created + 1800000).toISOString(), resolution: 'Đã xử lý' }),
    });
  }
  return out;
}</code></pre>
<p><code>src/paging.js</code> — <code>orderBy</code> learns business ranks:</p>
<pre><code class="language-javascript">// Luôn thêm id làm khoá phụ cùng chiều ⇒ không bao giờ có hai bản ghi "ngang hàng" ⇒ trang không trùng, không sót.
// ranks: thứ tự NGHIỆP VỤ cho trường enum, ví dụ { severity: { LOW: 1, MEDIUM: 2, HIGH: 3 } } (Lab 3) —
// so chữ cái sẽ cho HIGH &lt; LOW &lt; MEDIUM, sai nghĩa.
export function orderBy(sort, ranks = {}) {
  const desc = sort.startsWith('-'), key = sort.replace('-', '');
  const dir = desc ? -1 : 1;
  const val = (r) =&gt; (ranks[key] ? ranks[key][r[key]] : r[key]);
  const cmp = (a, b) =&gt; {
    const x = val(a), y = val(b);
    return dir * ((typeof x === 'number' ? x - y : x.localeCompare(y)) || idNum(a.id) - idNum(b.id));
  };
  return { key, cmp };
}</code></pre>
<p><code>src/schemas.js</code>:</p>
<pre><code class="language-javascript">export const IssuesQuery = z.strictObject({
  status: z.enum(['OPEN', 'RESOLVED']).optional(),
  severity: z.enum(SEVERITIES).optional(),
  // Lab 3 — danh sách lớn: con trỏ, lọc thêm theo thiết bị, sắp theo mức độ, nhúng thiết bị
  deviceId: id('dev').optional(),
  sort: z.enum(['-createdAt', 'createdAt', '-severity']).default('-createdAt'),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().min(1).max(200).optional(),
  include: z.enum(['device']).optional(),
});</code></pre>
<p><code>src/routes/issues.js</code> — the list route:</p>
<pre><code class="language-javascript">issuesRouter.route('/')
  .get(validate('query', IssuesQuery), (req, res) =&gt; {
    const { limit, cursor, include, ...query } = req.valid.query;
    const { status, severity, deviceId, sort } = query;
    let rows = issues.filter((i) =&gt; (!status || i.status === status)
      &amp;&amp; (!severity || i.severity === severity) &amp;&amp; (!deviceId || i.deviceId === deviceId));
    const { key, cmp } = orderBy(sort, { severity: { LOW: 1, MEDIUM: 2, HIGH: 3 } });
    rows.sort(cmp);
    const f = fingerprint(query);
    if (cursor) {
      const after = decodeCursor(cursor, key, f);
      rows = rows.filter((i) =&gt; cmp(after, i) &lt; 0);
    }
    const page = rows.slice(0, limit);
    const next = rows.length &gt; limit ? encodeCursor(page[page.length - 1], key, f) : null;
    if (next) {
      const qs = new URLSearchParams(req.query);
      qs.set('cursor', next);
      res.links({ next: &#96;/issues?\${qs}&#96; });
    }
    const deviceById = include === 'device' ? new Map(devices.map((d) =&gt; [d.id, d])) : null;
    const data = page.map((i) =&gt; (deviceById ? { ...toIssue(i), device: toDevice(deviceById.get(i.deviceId)) } : toIssue(i)));
    res.json({ data, page: { limit, next } });
  })
  .all(onlyAllow('GET', 'HEAD'));</code></pre>
<p><code>walk.mjs</code>:</p>
<pre><code class="language-javascript">// walk.mjs — một client đi hết danh sách bằng page.next, đếm và kiểm trùng
const seen = new Set();
let url = 'http://localhost:4000/issues?limit=25&amp;status=OPEN';
let pages = 0;
while (url) {
  const res = await fetch(url);
  const body = await res.json();
  pages++;
  for (const i of body.data) {
    if (seen.has(i.id)) console.log('TRÙNG', i.id);
    seen.add(i.id);
  }
  url = body.page.next ? &#96;http://localhost:4000/issues?limit=25&amp;status=OPEN&amp;cursor=\${body.page.next}&#96; : null;
}
console.log(&#96;\${pages} trang, \${seen.size} báo hỏng OPEN, không trùng&#96;);</code></pre>

<h3>Reference transcript (real run)</h3>
<pre><code class="language-bash">curl -i 'http://localhost:4000/issues?limit=3'</code></pre>
<div class="out">HTTP/1.1 200 OK
Link: &lt;/issues?limit=3&amp;cursor=eyJ2IjoiMjAyNi0xMC0wN1QxMDowMDowMC4wMDBaIiwiaWQiOiJpc3NfNTgiLCJmIjoiYTdjMGE4NmUifQ&gt;; rel="next"
Content-Type: application/json; charset=utf-8
Content-Length: 1125
ETag: W/"465-7VZ0oQUffqhigiOwrZR7RmU/xMs"
Date: Sat, 31 Oct 2026 19:24:34 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "data": [
    {
      "id": "iss_60",
      "deviceId": "dev_3",
      "reportedBy": "usr_2",
      "title": "Cổng console không lên đèn #60",
      "severity": "HIGH",
      "description": null,
      "status": "RESOLVED",
      "createdAt": "2026-10-07T12:00:00.000Z",
      "resolvedAt": "2026-10-07T12:30:00.000Z",
      "resolution": "Đã xử lý"
    },
    {
      "id": "iss_59",
      "deviceId": "dev_2",
      "reportedBy": "usr_1",
      "title": "Thiếu thẻ nhớ #59",
      "severity": "LOW",
      "description": null,
      "status": "OPEN",
      "createdAt": "2026-10-07T11:00:00.000Z",
      "resolvedAt": null,
      "resolution": null
    },
    {
      "id": "iss_58",
      "deviceId": "dev_1",
      "reportedBy": "usr_2",
      "title": "Cổng 24 chập chờn #58",
      "severity": "HIGH",
      "description": null,
      "status": "OPEN",
      "createdAt": "2026-10-07T10:00:00.000Z",
      "resolvedAt": null,
      "resolution": null
    }
  ],
  "page": {
    "limit": 3,
    "next": "eyJ2IjoiMjAyNi0xMC0wN1QxMDowMDowMC4wMDBaIiwiaWQiOiJpc3NfNTgiLCJmIjoiYTdjMGE4NmUifQ"
  }
}</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/issues?limit=3&amp;cursor=eyJ2IjoiMjAyNi0xMC0wN1QxMDowMDowMC4wMDBaIiwiaWQiOiJpc3NfNTgiLCJmIjoiYTdjMGE4NmUifQ' | jq -c '{ids: [.data[].id], next: .page.next}'</code></pre>
<div class="out">{"ids":["iss_57","iss_56","iss_55"],"next":"eyJ2IjoiMjAyNi0xMC0wN1QwNzowMDowMC4wMDBaIiwiaWQiOiJpc3NfNTUiLCJmIjoiYTdjMGE4NmUifQ"}</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/issues?sort=-severity&amp;status=OPEN&amp;limit=5' | jq -c '.data[] | [.id, .severity, .createdAt]'</code></pre>
<div class="out">["iss_58","HIGH","2026-10-07T10:00:00.000Z"]
["iss_51","HIGH","2026-10-07T03:00:00.000Z"]
["iss_49","HIGH","2026-10-07T01:00:00.000Z"]
["iss_47","HIGH","2026-10-06T23:00:00.000Z"]
["iss_42","HIGH","2026-10-06T18:00:00.000Z"]</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/issues?deviceId=dev_3&amp;severity=HIGH&amp;include=device&amp;limit=1'</code></pre>
<div class="out">{
  "data": [
    {
      "id": "iss_60",
      "deviceId": "dev_3",
      "reportedBy": "usr_2",
      "title": "Cổng console không lên đèn #60",
      "severity": "HIGH",
      "description": null,
      "status": "RESOLVED",
      "createdAt": "2026-10-07T12:00:00.000Z",
      "resolvedAt": "2026-10-07T12:30:00.000Z",
      "resolution": "Đã xử lý",
      "device": {
        "id": "dev_3",
        "labId": "lab_2",
        "name": "Raspberry Pi 5",
        "type": "BOARD",
        "serialNo": "RPI5-00421",
        "status": "AVAILABLE",
        "note": "Thiếu thẻ nhớ"
      }
    }
  ],
  "page": {
    "limit": 1,
    "next": "eyJ2IjoiMjAyNi0xMC0wN1QxMjowMDowMC4wMDBaIiwiaWQiOiJpc3NfNjAiLCJmIjoiOGE2NzI5MWUifQ"
  }
}</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/issues?limit=0&amp;sort=title' \\
  -H 'Accept-Language: en' | jq -c '.errors'</code></pre>
<div class="out">[{"parameter":"sort","detail":"Invalid option: expected one of \\"-createdAt\\"|\\"createdAt\\"|\\"-severity\\""},{"parameter":"limit","detail":"Too small: expected number to be &gt;=1"}]</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/issues?deviceId=dev_2&amp;cursor=eyJ2IjoiMjAyNi0xMC0wN1QxMDowMDowMC4wMDBaIiwiaWQiOiJpc3NfNTgiLCJmIjoiYTdjMGE4NmUifQ' | jq -c '{status, code}'</code></pre>
<div class="out">{"status":400,"code":"CURSOR_MISMATCH"}</div>
<pre><code class="language-bash">node walk.mjs</code></pre>
<div class="out">2 trang, 45 báo hỏng OPEN, không trùng</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Lab</span>
<h2>Lab 3 — Danh sách bảo trì</h2>
<p class="lead">Thứ Hai nào các quản lý phòng lab cũng họp để rà thiết bị hỏng. Hiện họ cuộn một bảng tính; họ muốn <code>GET /issues</code> làm thay — nặng nhất lên trước, lọc được, từng trang một, và vẫn đúng trong lúc sinh viên tiếp tục báo hỏng. Bạn tự dựng nó bằng mọi thứ của Chương 3; thang chấm và transcript chạy thật ở cuối bài.</p>

<h3>Yêu cầu</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">A</span><span class="lz-t">thiết kế</span><span class="lz-d">con trỏ, bộ lọc, sắp xếp, include cho báo hỏng</span></div>
  <div class="lz-step"><span class="lz-k">B</span><span class="lz-t">xây</span><span class="lz-d">một schema query chặt, phân trang keyset</span></div>
  <div class="lz-step"><span class="lz-k">C</span><span class="lz-t">chứng minh</span><span class="lz-d">transcript: các trang, bộ lọc, con trỏ sai</span></div>
  <div class="lz-step"><span class="lz-k">chấm</span><span class="lz-t">thang điểm</span><span class="lz-d">10 điểm, đạt từ 7</span></div>
</div>
<a class="link-card" href="https://google.aip.dev/158" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: Google AIP-158 — Pagination — đọc ngày 1/11/2026</span><span class="lc-sub">Hợp đồng phân trang mà lab này cài đặt.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<ul>
  <li>"Hiện báo hỏng <strong>mỗi lần 25 cái</strong> (một lượt không bao giờ quá 100)."</li>
  <li>"Lọc theo <strong>trạng thái</strong>, <strong>mức độ</strong> và <strong>thiết bị</strong>."</li>
  <li>"Mặc định mới nhất trước, cũ nhất trước khi được yêu cầu, và — cho buổi họp — <strong>nặng nhất trước</strong>: HIGH, rồi MEDIUM, rồi LOW."</li>
  <li>"Đặt tên thiết bị cạnh mỗi báo hỏng để khỏi phải tra."</li>
  <li>"Một script phải đi hết danh sách mà không sót, không lặp báo hỏng nào, kể cả khi có người báo hỏng trong lúc nó chạy."</li>
</ul>
<p>Thời gian: thiết kế 15 phút · dựng 60–90 phút · chứng minh 20 phút. Bắt đầu từ code cuối bài 3.4. Về dữ liệu, thêm <code>seedIssues(n)</code> cạnh <code>seedBookings</code> và chạy với <code>SEED_BOOKINGS=200 SEED_ISSUES=60</code>.</p>

<h3>Phần A — thiết kế trước khi code (bổ sung vào <code>DESIGN.md</code>)</h3>
<ol>
  <li>Hợp đồng query đầy đủ: mọi tham số, kiểu, giá trị mặc định và mức tối đa.</li>
  <li>Thứ tự cho từng giá trị <code>sort</code>, <strong>kể cả khoá phụ</strong>. Vì sao <code>-severity</code> cần thứ khác ngoài so chuỗi?</li>
  <li>Con trỏ chứa gì khi <code>sort=-severity</code>, và điều gì khiến con trỏ của <code>status=OPEN</code> không dùng được cho <code>status=RESOLVED</code>.</li>
  <li>Mã trạng thái và <code>code</code> cho: <code>limit=0</code>, <code>sort=title</code>, con trỏ bị sửa, con trỏ dùng lại với <code>deviceId</code> khác.</li>
</ol>

<h3>Phần B — dựng: các luật</h3>
<ol>
  <li>Schema Zod strict; <code>limit</code> 1–100, mặc định 20 (buổi họp dùng 25); <code>sort</code> ∈ <code>-createdAt</code>, <code>createdAt</code>, <code>-severity</code>; <code>include</code> ∈ <code>device</code>.</li>
  <li>Mức độ sắp theo <strong>thứ hạng nghiệp vụ</strong> (LOW 1 · MEDIUM 2 · HIGH 3), không bao giờ theo bảng chữ cái, với id làm khoá phụ.</li>
  <li>Phân trang con trỏ bằng các hàm của bài 3.2–3.4 (mở rộng <code>orderBy</code> thay vì viết hàm so sánh thứ hai); dấu vân tay trên bộ lọc và sort; <code>Link: rel="next"</code>; hết danh sách thì <code>page.next = null</code>.</li>
  <li><code>include=device</code> nhúng <code>toDevice</code> với một Map mỗi trang — không tra từng dòng.</li>
  <li>Lỗi nào cũng là tài liệu problem của Chương 2, ở cả hai ngôn ngữ.</li>
  <li>Một client <code>walk.mjs</code> đi theo <code>page.next</code> tới cuối và báo dòng trùng.</li>
</ol>

<h3>Phần C — chứng minh (<code>TRANSCRIPT.md</code>)</h3>
<p>Khởi động lại với <code>SEED_BOOKINGS=200 SEED_ISSUES=60</code> và dán nguyên văn mọi output:</p>
<ol>
  <li><code>GET /issues?limit=3</code> kèm <code>-i</code> → 3 báo hỏng, header <code>Link</code>, <code>page.next</code>.</li>
  <li>Đi theo <code>next</code> → 3 báo hỏng tiếp theo, không trùng.</li>
  <li><code>sort=-severity&amp;status=OPEN&amp;limit=5</code> → năm báo hỏng HIGH, mới nhất trước khi cùng mức.</li>
  <li><code>deviceId=dev_3&amp;severity=HIGH&amp;include=device&amp;limit=1</code> → báo hỏng kèm thiết bị.</li>
  <li><code>limit=0&amp;sort=title</code> bằng tiếng Anh → 400 kèm hai tham số; con trỏ của bước 1 với <code>deviceId=dev_2</code> → 400 <code>CURSOR_MISMATCH</code>.</li>
  <li><code>node walk.mjs</code> → mỗi báo hỏng OPEN đúng một lần.</li>
</ol>

<h3>Thang chấm — 10 điểm</h3>
<table>
  <thead><tr><th>Điểm</th><th>Tiêu chí</th><th>Kiểm bằng</th></tr></thead>
  <tbody>
    <tr><td>2</td><td>Hợp đồng query: strict, có kiểu, mặc định và mức tối đa, lỗi 400 rõ ràng</td><td>bước 5 · <code>DESIGN.md</code></td></tr>
    <tr><td>2</td><td>Thứ tự ổn định có khoá phụ; mức độ theo thứ hạng nghiệp vụ</td><td>bước 3</td></tr>
    <tr><td>2</td><td>Con trỏ: mờ, gắn với bộ lọc và sort, có <code>Link</code>, hết thì <code>null</code></td><td>bước 1, 2, 5</td></tr>
    <tr><td>1</td><td><code>include=device</code> không tra từng dòng</td><td>bước 4 · đọc code</td></tr>
    <tr><td>2</td><td><code>walk.mjs</code> thấy mỗi báo hỏng OPEN một lần, kể cả khi có báo hỏng mới giữa chừng</td><td>bước 6 + phép thử chèn của riêng bạn</td></tr>
    <tr><td>1</td><td>Transcript đầy đủ, không sửa</td><td>tệp nộp</td></tr>
  </tbody>
</table>
<p><strong>Đạt: 7/10.</strong> Nộp <code>DESIGN.md</code>, các tệp <code>src/</code> đã sửa, <code>walk.mjs</code> và <code>TRANSCRIPT.md</code> trong một commit.</p>

<h3>Thử thách thêm</h3>
<ul>
  <li>Một con trỏ <code>prev</code>, để buổi họp cuộn ngược lại được.</li>
  <li>Ký con trỏ bằng HMAC (<code>createHmac</code> của <code>node:crypto</code>) và từ chối con trỏ bị sửa bằng <code>INVALID_CURSOR</code>.</li>
  <li><code>fields=</code> cho báo hỏng, kiểm theo các trường của <code>toIssue</code>.</li>
</ul>

<h3>Lời giải mẫu — đọc sau khi đã tự làm</h3>
<p><strong>Thiết kế.</strong> <code>-severity</code>: thứ hạng giảm dần, rồi id giảm dần; con trỏ chứa <code>{ v: 'HIGH', id: 'iss_58', f }</code> và dấu vân tay phủ <code>status, severity, deviceId, sort</code>. Lỗi: 400 <code>INVALID_QUERY</code> (limit, sort), 400 <code>INVALID_CURSOR</code>, 400 <code>CURSOR_MISMATCH</code>.</p>
<p><code>src/seed.js</code> — báo hỏng cho lab (mức độ được rải để thiết bị nào cũng có đủ ba mức):</p>
<pre><code class="language-javascript">// Lab 3 — báo hỏng mẫu: SEED_ISSUES=60
const TITLES = ['Cổng console không lên đèn', 'Quạt kêu to', 'Mất nguồn ngẫu nhiên', 'Cổng 24 chập chờn', 'Thiếu thẻ nhớ'];
const SEV = ['LOW', 'MEDIUM', 'HIGH'];
export function seedIssues(n) {
  const out = [];
  for (let i = 1; i &lt;= n; i++) {
    const created = Date.UTC(2026, 9, 5) + i * 3600000;           // mỗi báo hỏng cách nhau 1 giờ
    const resolved = i % 4 === 0;
    out.push({
      id: &#96;iss_\${i}&#96;, deviceId: &#96;dev_\${((i - 1) % 3) + 1}&#96;, reportedBy: i % 2 ? 'usr_1' : 'usr_2',
      title: &#96;\${TITLES[i % TITLES.length]} #\${i}&#96;, severity: SEV[(i + Math.floor(i / 3)) % 3],
      status: resolved ? 'RESOLVED' : 'OPEN', createdAt: new Date(created).toISOString(),
      ...(resolved &amp;&amp; { resolvedAt: new Date(created + 1800000).toISOString(), resolution: 'Đã xử lý' }),
    });
  }
  return out;
}</code></pre>
<p><code>src/paging.js</code> — <code>orderBy</code> biết thêm thứ hạng nghiệp vụ:</p>
<pre><code class="language-javascript">// Luôn thêm id làm khoá phụ cùng chiều ⇒ không bao giờ có hai bản ghi "ngang hàng" ⇒ trang không trùng, không sót.
// ranks: thứ tự NGHIỆP VỤ cho trường enum, ví dụ { severity: { LOW: 1, MEDIUM: 2, HIGH: 3 } } (Lab 3) —
// so chữ cái sẽ cho HIGH &lt; LOW &lt; MEDIUM, sai nghĩa.
export function orderBy(sort, ranks = {}) {
  const desc = sort.startsWith('-'), key = sort.replace('-', '');
  const dir = desc ? -1 : 1;
  const val = (r) =&gt; (ranks[key] ? ranks[key][r[key]] : r[key]);
  const cmp = (a, b) =&gt; {
    const x = val(a), y = val(b);
    return dir * ((typeof x === 'number' ? x - y : x.localeCompare(y)) || idNum(a.id) - idNum(b.id));
  };
  return { key, cmp };
}</code></pre>
<p><code>src/schemas.js</code>:</p>
<pre><code class="language-javascript">export const IssuesQuery = z.strictObject({
  status: z.enum(['OPEN', 'RESOLVED']).optional(),
  severity: z.enum(SEVERITIES).optional(),
  // Lab 3 — danh sách lớn: con trỏ, lọc thêm theo thiết bị, sắp theo mức độ, nhúng thiết bị
  deviceId: id('dev').optional(),
  sort: z.enum(['-createdAt', 'createdAt', '-severity']).default('-createdAt'),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().min(1).max(200).optional(),
  include: z.enum(['device']).optional(),
});</code></pre>
<p><code>src/routes/issues.js</code> — route danh sách:</p>
<pre><code class="language-javascript">issuesRouter.route('/')
  .get(validate('query', IssuesQuery), (req, res) =&gt; {
    const { limit, cursor, include, ...query } = req.valid.query;
    const { status, severity, deviceId, sort } = query;
    let rows = issues.filter((i) =&gt; (!status || i.status === status)
      &amp;&amp; (!severity || i.severity === severity) &amp;&amp; (!deviceId || i.deviceId === deviceId));
    const { key, cmp } = orderBy(sort, { severity: { LOW: 1, MEDIUM: 2, HIGH: 3 } });
    rows.sort(cmp);
    const f = fingerprint(query);
    if (cursor) {
      const after = decodeCursor(cursor, key, f);
      rows = rows.filter((i) =&gt; cmp(after, i) &lt; 0);
    }
    const page = rows.slice(0, limit);
    const next = rows.length &gt; limit ? encodeCursor(page[page.length - 1], key, f) : null;
    if (next) {
      const qs = new URLSearchParams(req.query);
      qs.set('cursor', next);
      res.links({ next: &#96;/issues?\${qs}&#96; });
    }
    const deviceById = include === 'device' ? new Map(devices.map((d) =&gt; [d.id, d])) : null;
    const data = page.map((i) =&gt; (deviceById ? { ...toIssue(i), device: toDevice(deviceById.get(i.deviceId)) } : toIssue(i)));
    res.json({ data, page: { limit, next } });
  })
  .all(onlyAllow('GET', 'HEAD'));</code></pre>
<p><code>walk.mjs</code>:</p>
<pre><code class="language-javascript">// walk.mjs — một client đi hết danh sách bằng page.next, đếm và kiểm trùng
const seen = new Set();
let url = 'http://localhost:4000/issues?limit=25&amp;status=OPEN';
let pages = 0;
while (url) {
  const res = await fetch(url);
  const body = await res.json();
  pages++;
  for (const i of body.data) {
    if (seen.has(i.id)) console.log('TRÙNG', i.id);
    seen.add(i.id);
  }
  url = body.page.next ? &#96;http://localhost:4000/issues?limit=25&amp;status=OPEN&amp;cursor=\${body.page.next}&#96; : null;
}
console.log(&#96;\${pages} trang, \${seen.size} báo hỏng OPEN, không trùng&#96;);</code></pre>

<h3>Transcript mẫu (chạy thật)</h3>
<pre><code class="language-bash">curl -i 'http://localhost:4000/issues?limit=3'</code></pre>
<div class="out">HTTP/1.1 200 OK
Link: &lt;/issues?limit=3&amp;cursor=eyJ2IjoiMjAyNi0xMC0wN1QxMDowMDowMC4wMDBaIiwiaWQiOiJpc3NfNTgiLCJmIjoiYTdjMGE4NmUifQ&gt;; rel="next"
Content-Type: application/json; charset=utf-8
Content-Length: 1125
ETag: W/"465-7VZ0oQUffqhigiOwrZR7RmU/xMs"
Date: Sat, 31 Oct 2026 19:24:34 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "data": [
    {
      "id": "iss_60",
      "deviceId": "dev_3",
      "reportedBy": "usr_2",
      "title": "Cổng console không lên đèn #60",
      "severity": "HIGH",
      "description": null,
      "status": "RESOLVED",
      "createdAt": "2026-10-07T12:00:00.000Z",
      "resolvedAt": "2026-10-07T12:30:00.000Z",
      "resolution": "Đã xử lý"
    },
    {
      "id": "iss_59",
      "deviceId": "dev_2",
      "reportedBy": "usr_1",
      "title": "Thiếu thẻ nhớ #59",
      "severity": "LOW",
      "description": null,
      "status": "OPEN",
      "createdAt": "2026-10-07T11:00:00.000Z",
      "resolvedAt": null,
      "resolution": null
    },
    {
      "id": "iss_58",
      "deviceId": "dev_1",
      "reportedBy": "usr_2",
      "title": "Cổng 24 chập chờn #58",
      "severity": "HIGH",
      "description": null,
      "status": "OPEN",
      "createdAt": "2026-10-07T10:00:00.000Z",
      "resolvedAt": null,
      "resolution": null
    }
  ],
  "page": {
    "limit": 3,
    "next": "eyJ2IjoiMjAyNi0xMC0wN1QxMDowMDowMC4wMDBaIiwiaWQiOiJpc3NfNTgiLCJmIjoiYTdjMGE4NmUifQ"
  }
}</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/issues?limit=3&amp;cursor=eyJ2IjoiMjAyNi0xMC0wN1QxMDowMDowMC4wMDBaIiwiaWQiOiJpc3NfNTgiLCJmIjoiYTdjMGE4NmUifQ' | jq -c '{ids: [.data[].id], next: .page.next}'</code></pre>
<div class="out">{"ids":["iss_57","iss_56","iss_55"],"next":"eyJ2IjoiMjAyNi0xMC0wN1QwNzowMDowMC4wMDBaIiwiaWQiOiJpc3NfNTUiLCJmIjoiYTdjMGE4NmUifQ"}</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/issues?sort=-severity&amp;status=OPEN&amp;limit=5' | jq -c '.data[] | [.id, .severity, .createdAt]'</code></pre>
<div class="out">["iss_58","HIGH","2026-10-07T10:00:00.000Z"]
["iss_51","HIGH","2026-10-07T03:00:00.000Z"]
["iss_49","HIGH","2026-10-07T01:00:00.000Z"]
["iss_47","HIGH","2026-10-06T23:00:00.000Z"]
["iss_42","HIGH","2026-10-06T18:00:00.000Z"]</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/issues?deviceId=dev_3&amp;severity=HIGH&amp;include=device&amp;limit=1'</code></pre>
<div class="out">{
  "data": [
    {
      "id": "iss_60",
      "deviceId": "dev_3",
      "reportedBy": "usr_2",
      "title": "Cổng console không lên đèn #60",
      "severity": "HIGH",
      "description": null,
      "status": "RESOLVED",
      "createdAt": "2026-10-07T12:00:00.000Z",
      "resolvedAt": "2026-10-07T12:30:00.000Z",
      "resolution": "Đã xử lý",
      "device": {
        "id": "dev_3",
        "labId": "lab_2",
        "name": "Raspberry Pi 5",
        "type": "BOARD",
        "serialNo": "RPI5-00421",
        "status": "AVAILABLE",
        "note": "Thiếu thẻ nhớ"
      }
    }
  ],
  "page": {
    "limit": 1,
    "next": "eyJ2IjoiMjAyNi0xMC0wN1QxMjowMDowMC4wMDBaIiwiaWQiOiJpc3NfNjAiLCJmIjoiOGE2NzI5MWUifQ"
  }
}</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/issues?limit=0&amp;sort=title' \\
  -H 'Accept-Language: en' | jq -c '.errors'</code></pre>
<div class="out">[{"parameter":"sort","detail":"Invalid option: expected one of \\"-createdAt\\"|\\"createdAt\\"|\\"-severity\\""},{"parameter":"limit","detail":"Too small: expected number to be &gt;=1"}]</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/issues?deviceId=dev_2&amp;cursor=eyJ2IjoiMjAyNi0xMC0wN1QxMDowMDowMC4wMDBaIiwiaWQiOiJpc3NfNTgiLCJmIjoiYTdjMGE4NmUifQ' | jq -c '{status, code}'</code></pre>
<div class="out">{"status":400,"code":"CURSOR_MISMATCH"}</div>
<pre><code class="language-bash">node walk.mjs</code></pre>
<div class="out">2 trang, 45 báo hỏng OPEN, không trùng</div>
</div>
`,
    },
    /* ─────────────────────────── 3.6 Quiz (bài MỚI) ─────────────────────────── */
    {
      title: '3.6 — Chapter 3 check: pagination, filtering, sorting|||3.6 — Kiểm tra Chương 3: phân trang, lọc, sắp xếp',
      slug: 'api-3-6-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống về offset, con trỏ, keyset, thứ tự ổn định, bộ lọc, dấu vân tay, fields, N+1 và sắp theo thứ hạng; mỗi câu có giải thích.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Check</span>
<h2>Chapter 3 check: pagination, filtering, sorting</h2>
<p class="lead">Ten situations from LabFlow and the million-row PostgreSQL measurements of this chapter. Each explanation says why the right answer is right and why the most tempting wrong answer is wrong. Aim for 7/10.</p>
<h3>Self-check before you start</h3>
<ul>
  <li>I can explain why offset pages repeat or skip rows when data changes, and why deep offsets are slow.</li>
  <li>I can build a stable order with a tie-breaker and a cursor that encodes it.</li>
  <li>I can read <code>rows=</code> and <code>Execution Time</code> in an <code>EXPLAIN ANALYZE</code> plan.</li>
  <li>I can design filters, bind cursors to them, and say which index each one needs.</li>
  <li>I can add <code>sort</code>, <code>fields</code> and <code>include</code> as allow-lists and avoid N+1.</li>
  <li>My Lab 3 walks every issue exactly once.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Kiểm tra</span>
<h2>Kiểm tra Chương 3: phân trang, lọc, sắp xếp</h2>
<p class="lead">Mười tình huống từ LabFlow và các phép đo trên PostgreSQL một triệu dòng của chương này. Mỗi phần giải thích nói vì sao đáp án đúng là đúng và vì sao phương án hấp dẫn nhất lại sai. Nhắm 7/10.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
  <li>Tôi giải thích được vì sao trang offset bị lặp hoặc sót dòng khi dữ liệu đổi, và vì sao offset sâu thì chậm.</li>
  <li>Tôi dựng được thứ tự ổn định có khoá phụ và một con trỏ mã hoá nó.</li>
  <li>Tôi đọc được <code>rows=</code> và <code>Execution Time</code> trong kế hoạch <code>EXPLAIN ANALYZE</code>.</li>
  <li>Tôi thiết kế được bộ lọc, gắn con trỏ với chúng, và nói được mỗi bộ lọc cần index nào.</li>
  <li>Tôi thêm được <code>sort</code>, <code>fields</code>, <code>include</code> dạng danh sách cho phép và tránh được N+1.</li>
  <li>Lab 3 của tôi đi qua mọi báo hỏng đúng một lần.</li>
</ul>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: "Lan reads page 1 (limit=5, offset=0) of bookings, An creates a new booking, Lan reads page 2 (offset=5). What did LabFlow’s offset version show?|||Cô Lan đọc trang 1 (limit=5, offset=0), An tạo một lượt đặt mới, cô Lan đọc trang 2 (offset=5). Phiên bản offset của LabFlow đã cho thấy gì?",
            options: [
              "Page 2 started with bk_195, exactly after page 1|||Trang 2 bắt đầu bằng bk_195, ngay sau trang 1",
              "Page 2 was empty because the total changed|||Trang 2 rỗng vì tổng số đã đổi",
              "bk_196 appeared on both pages|||bk_196 xuất hiện ở cả hai trang",
              "A 409 because the list changed during paging|||Lỗi 409 vì danh sách đổi trong lúc lật trang",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: The new booking took position 1, everything moved down by one, and “skip 5” skipped one old booking fewer — bk_196 repeated (lesson 3.1). Option A is what the cursor version showed in lesson 3.2.|||VI: Lượt đặt mới chiếm vị trí 1, mọi thứ tụt xuống một bậc, và \"bỏ qua 5\" bỏ qua ít hơn một lượt cũ — bk_196 bị lặp (bài 3.1). Phương án A là kết quả của phiên bản con trỏ ở bài 3.2.",
          },
          {
            question: "On a million rows, OFFSET 900000 LIMIT 20 took 78 ms but OFFSET 0 took 0.05 ms. Why?|||Trên một triệu dòng, OFFSET 900000 LIMIT 20 mất 78 ms còn OFFSET 0 chỉ 0,05 ms. Vì sao?",
            options: [
              "The database walks every skipped row (rows=900020 in the plan) before returning 20|||Cơ sở dữ liệu đi qua mọi dòng bị bỏ qua (rows=900020 trong kế hoạch) rồi mới trả 20 dòng",
              "The index is only built for the first 100 000 rows|||Index chỉ được dựng cho 100 000 dòng đầu",
              "Deep pages are cached less by PostgreSQL|||PostgreSQL ít cache các trang sâu hơn",
              "OFFSET disables the use of indexes|||OFFSET tắt việc dùng index",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: The plan still used the index, but an index finds the start of an order, not the 900 000th position; it read 900 020 entries and discarded all but 20 (lesson 3.1).|||VI: Kế hoạch vẫn dùng index, nhưng index tìm được điểm đầu của thứ tự chứ không phải vị trí thứ 900 000; nó đọc 900 020 mục rồi vứt đi, chỉ giữ 20 (bài 3.1).",
          },
          {
            question: "Which sort order makes LabFlow’s pages stable?|||Cách sắp nào làm các trang của LabFlow ổn định?",
            options: [
              "createdAt descending only — it is precise to the millisecond|||Chỉ createdAt giảm dần — nó chính xác tới mili giây",
              "id as a string, because ids are unique|||id dạng chuỗi, vì id là duy nhất",
              "No ORDER BY — the database returns insertion order|||Không cần ORDER BY — cơ sở dữ liệu trả theo thứ tự chèn",
              "createdAt descending, then the id’s number as tie-breaker|||createdAt giảm dần, rồi con số của id làm khoá phụ",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: Two rows can share createdAt; the unique id breaks the tie so no two rows share a position. Compared as strings, \"bk_10\" < \"bk_9\", hence idNum. Without ORDER BY the order is undefined (lessons 3.1, 3.2).|||VI: Hai dòng có thể trùng createdAt; id duy nhất phân xử để không có hai dòng chung vị trí. So như chuỗi thì \"bk_10\" < \"bk_9\", nên mới có idNum. Không có ORDER BY thì thứ tự không xác định (bài 3.1, 3.2).",
          },
          {
            question: "What does LabFlow’s booking cursor contain after lesson 3.4?|||Sau bài 3.4, con trỏ lượt đặt của LabFlow chứa gì?",
            options: [
              "The page number and the limit|||Số trang và limit",
              "The value of the current sort key, the id of the last item, and a fingerprint of filters and sort|||Giá trị khoá sắp hiện tại, id của phần tử cuối, và dấu vân tay của bộ lọc và sort",
              "The offset of the next page, encrypted|||Offset của trang sau, đã mã hoá",
              "The ids of every item already returned|||Id của mọi phần tử đã trả về",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: {v, id, f} in base64url: the position in the current order (with tie-breaker) plus a fingerprint so it cannot be reused with another query (lessons 3.2–3.4).|||VI: {v, id, f} dạng base64url: vị trí trong thứ tự hiện tại (kèm khoá phụ) cộng dấu vân tay để không dùng lại được với truy vấn khác (bài 3.2–3.4).",
          },
          {
            question: "The same 20 rows at depth 900 000 took 0.064 ms with WHERE (created_at, id) < (…). What made the difference?|||Cùng 20 dòng ở độ sâu 900 000 chỉ mất 0,064 ms với WHERE (created_at, id) < (…). Điều gì tạo ra khác biệt?",
            options: [
              "The row comparison lets the index jump to the bookmark; only 20 rows are read|||Phép so sánh cả hàng cho index nhảy tới bookmark; chỉ 20 dòng được đọc",
              "The query result was cached from the OFFSET run|||Kết quả được cache từ lần chạy OFFSET",
              "WHERE clauses always run in parallel|||Mệnh đề WHERE luôn chạy song song",
              "The cursor skipped the sort|||Con trỏ bỏ qua bước sắp xếp",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: The plan shows Index Cond on the row value and rows=20 instead of 900 020 — keyset/seek pagination. It needs an index matching the sort order (lesson 3.2).|||VI: Kế hoạch có Index Cond trên giá trị cả hàng và rows=20 thay vì 900 020 — phân trang keyset/seek. Nó cần một index khớp thứ tự sắp (bài 3.2).",
          },
          {
            question: "A client pages with labId=lab_1, then sends the same cursor with labId=lab_2. LabFlow answers …|||Một client lật trang với labId=lab_1, rồi gửi cùng con trỏ đó với labId=lab_2. LabFlow trả lời …",
            options: [
              "200 with page 2 of lab_2|||200 với trang 2 của lab_2",
              "200 with page 1 of lab_2, ignoring the cursor|||200 với trang 1 của lab_2, bỏ qua con trỏ",
              "400 CURSOR_MISMATCH — start again from the first page|||400 CURSOR_MISMATCH — bắt đầu lại từ trang đầu",
              "410 Gone, because the cursor expired|||410 Gone, vì con trỏ đã hết hạn",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: The cursor carries a fingerprint of the filters; a mismatch would otherwise return a page starting at a meaningless position, silently (lesson 3.3).|||VI: Con trỏ mang dấu vân tay của bộ lọc; không có nó, một con trỏ lệch sẽ lặng lẽ trả một trang bắt đầu ở vị trí vô nghĩa (bài 3.3).",
          },
          {
            question: "GET /bookings?from=2026-11-03T07:00:00+07:00&… returned 400 for from, although the time is valid. The most likely cause?|||GET /bookings?from=2026-11-03T07:00:00+07:00&… trả 400 cho from, dù thời điểm hợp lệ. Nguyên nhân khả dĩ nhất?",
            options: [
              "LabFlow does not accept offsets in query strings|||LabFlow không nhận độ lệch múi giờ trong query string",
              "from must be in UTC with Z|||from phải ở UTC với Z",
              "Query parameters cannot contain colons|||Tham số query không được chứa dấu hai chấm",
              "The raw + was decoded as a space; send it as %2B|||Dấu + trần bị giải mã thành dấu cách; phải gửi thành %2B",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: In a query string + means a space, so the server sees \"07:00:00 07:00\". The lesson’s request uses %2B (lesson 3.3).|||VI: Trong query string, + nghĩa là dấu cách, nên server thấy \"07:00:00 07:00\". Request trong bài dùng %2B (bài 3.3).",
          },
          {
            question: "Why is fields=startAt,passwordHash refused with 400 instead of returning the hash?|||Vì sao fields=startAt,passwordHash bị từ chối bằng 400 thay vì trả mã băm?",
            options: [
              "Because passwordHash is too long for a query string|||Vì passwordHash quá dài cho query string",
              "fields is validated against the members of the view, so it can only remove members, never add|||fields được kiểm theo các trường của view, nên chỉ bớt được trường, không bao giờ thêm",
              "Because fields only accepts one value|||Vì fields chỉ nhận một giá trị",
              "Because bookings never have a passwordHash, so it is a typo|||Vì lượt đặt không có passwordHash, nên đó là lỗi gõ",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: Sparse fieldsets sit on top of the allow-list view of lesson 2.3; anything outside it is invalid input, never a way into the record (lesson 3.4).|||VI: Bộ trường rút gọn nằm trên view danh sách cho phép của bài 2.3; thứ gì ngoài nó là dữ liệu vào không hợp lệ, không bao giờ là cửa vào bản ghi (bài 3.4).",
          },
          {
            question: "include=lab for 20 bookings: what is the N+1 problem and how does LabFlow avoid it?|||include=lab cho 20 lượt đặt: vấn đề N+1 là gì và LabFlow tránh nó thế nào?",
            options: [
              "One lookup per booking (N) plus the page query; LabFlow builds one Map of labs per page|||Mỗi lượt đặt một lần tra (N) cộng truy vấn trang; LabFlow dựng một Map phòng cho mỗi trang",
              "N+1 bookings are returned instead of N; LabFlow trims the last one|||Trả N+1 lượt đặt thay vì N; LabFlow cắt bớt cái cuối",
              "The cursor needs N+1 values; LabFlow stores only one|||Con trỏ cần N+1 giá trị; LabFlow chỉ lưu một",
              "Each lab is sent N+1 times; LabFlow deduplicates the JSON|||Mỗi phòng bị gửi N+1 lần; LabFlow gộp trùng JSON",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: Against PostgreSQL the N+1 pattern took 2.16 ms in 21 queries vs 0.25 ms for one JOIN, on localhost; over a network each query adds a round trip (lesson 3.4).|||VI: Trên PostgreSQL, kiểu N+1 mất 2,16 ms cho 21 truy vấn so với 0,25 ms cho một JOIN, ngay trên localhost; qua mạng mỗi truy vấn còn thêm một lượt đi-về (bài 3.4).",
          },
          {
            question: "Lab 3: sort=-severity must give HIGH, MEDIUM, LOW. What breaks if you compare the strings?|||Lab 3: sort=-severity phải ra HIGH, MEDIUM, LOW. So chuỗi thì hỏng gì?",
            options: [
              "Nothing — alphabetical order happens to match|||Không gì — thứ tự bảng chữ cái tình cờ khớp",
              "The cursor becomes longer than 200 characters|||Con trỏ dài quá 200 ký tự",
              "Descending alphabetical is MEDIUM, LOW, HIGH — sort by a business rank instead|||Bảng chữ cái giảm dần là MEDIUM, LOW, HIGH — phải sắp theo thứ hạng nghiệp vụ",
              "Zod refuses enum values in sort|||Zod từ chối giá trị enum trong sort",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: HIGH < LOW < MEDIUM alphabetically, so descending gives MEDIUM first. orderBy takes ranks { LOW: 1, MEDIUM: 2, HIGH: 3 } and still uses the id as tie-breaker (Lab 3).|||VI: Theo bảng chữ cái HIGH < LOW < MEDIUM, nên giảm dần sẽ ra MEDIUM trước. orderBy nhận thứ hạng { LOW: 1, MEDIUM: 2, HIGH: 3 } và vẫn dùng id làm khoá phụ (Lab 3).",
          },
        ],
      },
    },
  ],
};
