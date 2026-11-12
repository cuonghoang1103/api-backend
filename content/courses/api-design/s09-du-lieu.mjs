/**
 * API Design — Chương 9: Dữ liệu khi lớn lên (soạn chi tiết 01/11/2026).
 * Output CHẠY THẬT: Node v22.23.3, Express 5.3.0, PostgreSQL 18.4 (primary :55432 + replica streaming :55433, recovery_min_apply_delay 2s),
 * Redis 8.2.2 (:6390) + node-redis 5.12.1, autocannon 8.0.0. Cache HTTP (ETag phiên bản, 304 sớm, lỗi public làm lộ dữ liệu qua cache dùng chung),
 * cache Redis + giẫm đạp (50 → 32 → 1 truy vấn), đọc-sau-ghi với replica thật + token LSN, UUID v4/v7 và phân trang qua hai mảnh, JSONB vs bảng.
 * Mã cuối chương = lời giải Lab 9 (bài 9.6, luồng ghi chú). Route dùng PostgreSQL/Redis chỉ bật khi LABFLOW_PG=1. Slide: api-09-1 … api-09-5 + api-lab-9.
 * Tệp được sinh một lần bằng script ngoài repo — từ nay SỬA THẲNG tệp này, giữ luật thoát ký tự (_HOP-DONG.md mục 3).
 * GIỮ slug cũ api-9-1-cache, api-9-2-db-doc, api-9-3-sharding, api-9-4-nosql (thứ tự hiển thị 9.1, 9.3, 9.4, 9.5) và title chương;
 * bài 9.2 (api-9-1-server-cache) là bài MỚI tách ra.
 */

import G091 from './giang/api-09-1.mjs';
import G092 from './giang/api-09-2.mjs';
import G093 from './giang/api-09-3.mjs';
import G094 from './giang/api-09-4.mjs';
import G095 from './giang/api-09-5.mjs';
import GL9 from './giang/api-lab-9.mjs';

export default {
  title: 'Chapter 9 — Data at scale|||Chương 9 — Dữ liệu khi lớn lên',
  description: 'Dữ liệu lớn lên nhìn từ hợp đồng API, đo thật: Cache-Control và ETag phiên bản (304 trước truy vấn: 1.033 → 9.112 req/s; một chữ public làm cache dùng chung đưa lượt đặt của An cho Bình); cache Redis và cú giẫm đạp (50 → 32 → 1 truy vấn nhờ single-flight); đọc-sau-ghi với replica PostgreSQL thật và token LSN; UUIDv4/v7 và phân trang qua hai mảnh (offset ngây thơ trả sai trang); JSONB so với bảng theo mẫu truy cập; lab luồng ghi chú có thang chấm, quiz 10 câu.',
  lessons: [
    /* ─────────────────────────── 9.1 ─────────────────────────── */
    {
      title: '9.1 — HTTP caching for APIs: Cache-Control, ETag and 304|||9.1 — Cache HTTP cho API: Cache-Control, ETag và 304',
      slug: 'api-9-1-cache',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Mở đầu chương: học xong làm được gì. public/private/no-store, ETag theo phiên bản bộ sưu tập, 304 của Express chỉ tiết kiệm byte (1.033 req/s) còn 304 trước truy vấn tiết kiệm cả công (9.112 req/s), cache dùng chung làm lộ dữ liệu khi ghi nhầm public.',
      content: `${G091}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>HTTP caching for APIs: Cache-Control, ETag and 304</h2>
<p class="lead">The fastest request is the one the server never has to answer in full. HTTP already has a complete caching system — browsers, apps and CDNs speak it — and an API only has to say, in headers, what may be kept, by whom and for how long. This lesson adds those headers to LabFlow, measures what a <code>304 Not Modified</code> really saves, and shows the one header mistake that leaks one student’s bookings to another.</p>

<div class="callout ok">
<p><strong>After Chapter 9 you can:</strong></p>
<ul>
  <li>write <code>Cache-Control</code> and <code>ETag</code> so clients and shared caches reuse answers safely, and answer <code>304</code> without doing the work (9.1);</li>
  <li>put a server-side cache (Redis) in front of a slow query and stop a cache stampede: 50 database queries → 1 (9.2);</li>
  <li>explain why a user “does not see what they just saved” on a read replica, and fix it in the contract with a consistency token (9.3);</li>
  <li>choose IDs and pagination that still work when data is split across shards — and see offset pagination return the wrong page (9.4);</li>
  <li>tell, from the API’s access patterns, when a document (JSONB/MongoDB) beats tables and when it hurts (9.5); then apply all of it to a notes feed in Lab 9.</li>
</ul>
<p><strong>Why it is worth it:</strong> Chapter 8 kept one server alive; this chapter is about data that grows. Caching, replicas and IDs are where real outages and data leaks come from — and every decision shows up in the API contract, not only in the infrastructure.</p>
</div>
<a class="link-card" href="https://media.cuongthai.com/files/academy/API/v1/labflow-api-ch9-dau.zip" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Download: LabFlow API at the start of Chapter 9 (zip, without node_modules)</span><span class="lc-sub">Before Lab 9. <code>npm ci</code>, <code>npm start</code> (no database needed); the Chapter 9 routes need <code>LABFLOW_PG=1</code> with PostgreSQL 18 (+ Redis for 9.2, a replica for 9.3). Scripts in <code>perf/</code>, SQL in <code>sql/</code>. Demo passwords: an-lab-2026, binh-lab-2026, lan-lab-2026 (learning only).</span></span>
  <span class="lc-cta">DOWNLOAD →</span>
</a>

<h3>Who may keep a response, and for how long</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">app / browser</span><span class="lz-t">private cache</span><span class="lz-d">only this user’s device</span></div>
  <div class="lz-step"><span class="lz-k">CDN / proxy</span><span class="lz-t">shared cache</span><span class="lz-d">one copy served to MANY users</span></div>
  <div class="lz-step"><span class="lz-k">LabFlow</span><span class="lz-t">origin</span><span class="lz-d">decides with Cache-Control + ETag</span></div>
</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">public, max-age=60</span><span class="lz-lnote">anyone (shared caches too) may reuse it for 60 s without asking — same answer for everyone</span></div>
  <div class="lz-layer"><span class="lz-lname">private, no-cache</span><span class="lz-lnote">only the user’s own client may store it, and must check with the server (ETag) before reusing</span></div>
  <div class="lz-layer"><span class="lz-lname">no-store</span><span class="lz-lnote">nobody stores it at all — tokens, payment pages (LabFlow’s login answer, 6.1)</span></div>
</div>
<p>LabFlow’s choices: the lab list is the same for everyone and changes rarely ⇒ <code>public, max-age=60</code>. A booking list belongs to one user ⇒ <code>private, no-cache</code>.</p>

<h3>ETag and 304: “has it changed since my copy?”</h3>
<p>An <strong>ETag</strong> is a version label for one response. The client keeps it and asks again with <code>If-None-Match</code>; if nothing changed, the server answers <code>304 Not Modified</code> with an empty body (lesson 5.4 used the same tag with <code>If-Match</code> to stop lost updates). LabFlow builds its ETags from a <strong>version number per collection</strong> that every write bumps, plus who asked and what they asked:</p>
<pre><code class="language-javascript">// httpCache.js — bài 9.1: ETag theo phiên bản bộ sưu tập; so If-None-Match TRƯỚC truy vấn (LABFLOW_HTTP_CACHE=express ⇒ để Express tự lo)
import { createHash } from 'node:crypto';

export const versions = { bookings: 0, labs: 0 };
export const bump = (name) =&gt; { versions[name]++; };

const short = (s) =&gt; createHash('sha256').update(s).digest('base64url').slice(0, 16);

// ETag mạnh: phiên bản bộ sưu tập + ai hỏi + hỏi gì (URL, phiên bản API, ngôn ngữ) — khác bất kỳ cái nào ⇒ ETag khác
export const listEtag = (name, req) =&gt;
  &#96;"\${name}-v\${versions[name]}-\${short(&#96;\${req.user?.id ?? '-'}|\${req.apiVersion}|\${req.get('Accept-Language') ?? ''}|\${req.originalUrl}&#96;)}"&#96;;

export function notModifiedEarly(name, cacheControl) {
  return (req, res, next) =&gt; {
    const tag = listEtag(name, req);
    res.set('Cache-Control', cacheControl()).set('ETag', tag);
    if (process.env.LABFLOW_HTTP_CACHE === 'express') { res.removeHeader('ETag'); return next(); }
    const inm = req.get('If-None-Match');
    if (inm &amp;&amp; inm.split(',').map((s) =&gt; s.trim().replace(/^W\\//, '')).includes(tag)) return res.status(304).end();
    next();
  };
}</code></pre>
<p>It is wired as one middleware per list, and <code>bump('bookings')</code> is called after create, cancel and check-in.</p>
<pre><code class="language-javascript">// routes/labs.js — danh sách phòng giống nhau cho mọi người, hiếm khi đổi ⇒ public, cache dùng chung giữ 60 s
import { notModifiedEarly } from '../httpCache.js';
  .get(ipLimit, validate('query', LabsQuery), notModifiedEarly('labs', () =&gt; 'public, max-age=60'), (req, res) =&gt; {

// routes/bookings.js — danh sách RIÊNG của từng người: private (cache dùng chung không được giữ), no-cache (dùng lại phải hỏi bằng ETag)
// LABFLOW_CACHE_BUG=1 ⇒ cố ý ghi public, max-age=60 để thấy cache dùng chung làm lộ dữ liệu (CHỈ để học)
import { notModifiedEarly, bump } from '../httpCache.js';
const bookingsCacheControl = () =&gt; (process.env.LABFLOW_CACHE_BUG ? 'public, max-age=60' : 'private, no-cache');
  .get(validate('query', { 1: BookingsQuery, 2: BookingsQueryV2 }), notModifiedEarly('bookings', bookingsCacheControl), (req, res) =&gt; {
// … và một dòng ngay sau mỗi lệnh ghi: bookings.push(booking) (tạo), b.status = 'CHECKED_IN', b.status = 'CANCELLED'
    bump('bookings');</code></pre>
<pre><code class="language-bash">curl -s -D - -o /dev/null http://localhost:4000/v2/labs | grep -iE '^(HTTP|cache-control|etag|content-length)'</code></pre>
<div class="out">HTTP/1.1 200 OK
Cache-Control: public, max-age=60
ETag: "labs-v0-s1g6flhZDIvF7fKK"
Content-Length: 454</div>
<pre><code class="language-bash">curl -s -D - -o /dev/null http://localhost:4000/v2/labs \\
  -H 'If-None-Match: "labs-v0-s1g6flhZDIvF7fKK"' | grep -iE '^(HTTP|etag|content-length)'</code></pre>
<div class="out">HTTP/1.1 304 Not Modified
ETag: "labs-v0-s1g6flhZDIvF7fKK"</div>

<h3>What a 304 really saves</h3>
<p>Express already sends a weak ETag (a hash of the body) and answers 304 by itself. Run LabFlow with <code>LABFLOW_HTTP_CACHE=express</code> to see it on 100 bookings:</p>
<pre><code class="language-bash">curl -s -D - -o /dev/null 'http://localhost:4000/v2/bookings?limit=100' \\
  -H "Authorization: Bearer $(cat lan.jwt)" | grep -iE '^(HTTP|cache-control|etag|server-timing)' | tee hdr.txt</code></pre>
<div class="out">HTTP/1.1 200 OK
Cache-Control: private, no-cache
ETag: W/"8e4c-LH6b72wodeTqaQUnExBSfrQqBrY"
Server-Timing: auth;dur=0.23, validate;dur=1.49, db;dur=0.33, sort;dur=7.96, total;dur=12.57</div>
<pre><code class="language-bash">curl -s -D - -o /dev/null 'http://localhost:4000/v2/bookings?limit=100' \\
  -H "Authorization: Bearer $(cat lan.jwt)" \\
  -H "If-None-Match: $(grep -i ^etag hdr.txt | cut -d' ' -f2 | tr \\
  -d '\\r')" -w 'body: %{size_download} byte\\n' | grep -iE '^(HTTP|server-timing)|body'</code></pre>
<div class="out">HTTP/1.1 304 Not Modified
Server-Timing: auth;dur=0.07, validate;dur=0.16, db;dur=0.29, sort;dur=0.86, total;dur=2.21
body: 0 byte</div>
<p>Zero bytes on the wire — but Server-Timing still shows <code>db</code> and <code>sort</code>: Express can only compare <em>after</em> it has built the body to hash it. The server did all the work. LabFlow’s own ETag can be checked <em>before</em> the query:</p>
<pre><code class="language-bash">curl -s -D - -o /dev/null 'http://localhost:4000/v2/bookings?limit=100' \\
  -H "Authorization: Bearer $(cat lan.jwt)" | grep -iE '^(HTTP|cache-control|etag|server-timing)' | tee hdr.txt</code></pre>
<div class="out">HTTP/1.1 200 OK
Cache-Control: private, no-cache
ETag: "bookings-v0-GIYXoq2-h6kTmHuH"
Server-Timing: auth;dur=0.22, validate;dur=1.64, db;dur=0.34, sort;dur=8.00, total;dur=12.83</div>
<pre><code class="language-bash">curl -s -D - -o /dev/null 'http://localhost:4000/v2/bookings?limit=100' \\
  -H "Authorization: Bearer $(cat lan.jwt)" \\
  -H "If-None-Match: $(grep -i ^etag hdr.txt | cut -d' ' -f2 | tr \\
  -d '\\r')" -w 'body: %{size_download} byte\\n' | grep -iE '^(HTTP|server-timing)|body'</code></pre>
<div class="out">HTTP/1.1 304 Not Modified
Server-Timing: auth;dur=0.07, validate;dur=0.14, total;dur=0.79
body: 0 byte</div>
<p>Now the 304 costs 0.65 ms with no <code>db</code> step. Under load (autocannon, 10 connections, every request sending <code>If-None-Match</code>):</p>
<pre><code class="language-bash">npx autocannon -c 10 -d 10 -H "Authorization=Bearer $(cat lan.jwt)" 'http://localhost:4000/v2/bookings?limit=100' 2&gt;&amp;1 | grep -E 'Req/Sec|requests in'</code></pre>
<div class="out">│ Req/Sec   │ 688     │ 688     │ 1,161   │ 1,276   │ 1,127   │ 154.6   │ 688     │
12k requests in 11.01s, 458 MB read</div>
<pre><code class="language-bash">npx autocannon -c 10 -d 10 -H "Authorization=Bearer $(cat lan.jwt)" -H "If-None-Match=$(grep -i ^etag hdr.txt | cut -d' ' -f2 | tr -d '\\r')" 'http://localhost:4000/v2/bookings?limit=100' 2&gt;&amp;1 | grep -E 'Req/Sec|2xx|requests in'</code></pre>
<div class="out">│ Req/Sec   │ 454    │ 454    │ 1,175  │ 1,270  │ 1,032.82 │ 263.46 │ 454    │
0 2xx responses, 11361 non 2xx responses
11k requests in 11.02s, 5.15 MB read</div>
<pre><code class="language-bash">npx autocannon -c 10 -d 10 -H "Authorization=Bearer $(cat lan.jwt)" 'http://localhost:4000/v2/bookings?limit=100' 2&gt;&amp;1 | grep -E 'Req/Sec|requests in'</code></pre>
<div class="out">│ Req/Sec   │ 1,036   │ 1,036   │ 1,221   │ 1,298 │ 1,197.37 │ 77.25   │ 1,036   │
13k requests in 11.01s, 487 MB read</div>
<pre><code class="language-bash">npx autocannon -c 10 -d 10 -H "Authorization=Bearer $(cat lan.jwt)" -H "If-None-Match=$(grep -i ^etag hdr.txt | cut -d' ' -f2 | tr -d '\\r')" 'http://localhost:4000/v2/bookings?limit=100' 2&gt;&amp;1 | grep -E 'Req/Sec|2xx|requests in'</code></pre>
<div class="out">│ Req/Sec   │ 8,655   │ 8,655   │ 9,103   │ 9,599   │ 9,111.64 │ 253.68  │ 8,652   │
0 2xx responses, 100230 non 2xx responses
100k requests in 11.01s, 28.5 MB read</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Full 200 answers · ~1,130–1,200 req/s</span><span class="lz-lnote">458–487 MB in 10 s</span></div>
  <div class="lz-layer"><span class="lz-lname">304 from Express · 1,033 req/s</span><span class="lz-lnote">5 MB — saves bandwidth, not server work</span></div>
  <div class="lz-layer"><span class="lz-lname">304 checked before the query · 9,112 req/s</span><span class="lz-lnote">8.8× more — saves both</span></div>
</div>
<p>(Here “non 2xx” is expected: every answer is a 304. Read the status codes — 8.2.) And a write must change the tag, or clients keep stale data forever:</p>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' http://localhost:4000/v2/bookings \\
  -H "Authorization: Bearer $(cat lan.jwt)" \\
  --json '{"labId":"lab_1","period":{"start":"2030-05-03T08:00:00+07:00","end":"2030-05-03T10:00:00+07:00"}}'</code></pre>
<div class="out">201</div>
<pre><code class="language-bash">curl -s -D - -o /dev/null 'http://localhost:4000/v2/bookings?limit=100' \\
  -H "Authorization: Bearer $(cat lan.jwt)" \\
  -H "If-None-Match: $(grep -i ^etag hdr.txt | cut -d' ' -f2 | tr \\
  -d '\\r')" | grep -iE '^(HTTP|etag)'</code></pre>
<div class="out">HTTP/1.1 200 OK
ETag: "bookings-v1-GIYXoq2-h6kTmHuH"</div>
<div class="pitfall"><p><strong>Trap — an ETag that ignores who is asking.</strong> If Lan’s and An’s lists had the same ETag, An’s client could be told “304, your copy is fine” about Lan’s data. LabFlow mixes the user id, API version and Accept-Language into the tag.</p></div>

<h3>The header that leaks data</h3>
<p>To see a shared cache from the inside, <code>perf/cache-proxy.mjs</code> is a 40-line cache in front of LabFlow that follows RFC 9111 just enough: it stores 200 answers that are fresh and not <code>private</code>/<code>no-store</code>, and when the request carried <code>Authorization</code> it stores only if the answer says <code>public</code>. Now break LabFlow on purpose with <code>LABFLOW_CACHE_BUG=1</code>, which marks the per-user booking list <code>public, max-age=60</code>. An asks first, then Bình asks the same URL:</p>
<pre><code class="language-bash">curl -s -D - 'http://localhost:8081/v2/bookings?limit=2&amp;fields=id,userId' \\
  -H "Authorization: Bearer $(cat an.jwt)" | grep -iE '^(cache-control|x-cache)|"userId"' | tr \\
  -d '\\r'</code></pre>
<div class="out">cache-control: public, max-age=60
x-cache: MISS
      "userId": "usr_1"
      "userId": "usr_1"</div>
<pre><code class="language-bash">curl -s -D - 'http://localhost:8081/v2/bookings?limit=2&amp;fields=id,userId' \\
  -H "Authorization: Bearer $(cat bin.jwt)" | grep -iE '^(cache-control|x-cache|age)|"userId"' | tr \\
  -d '\\r'</code></pre>
<div class="out">cache-control: public, max-age=60
age: 0
x-cache: HIT
      "userId": "usr_1"
      "userId": "usr_1"</div>
<p><strong>Bình received An’s bookings</strong> (<code>usr_1</code>), served by the cache — LabFlow never saw his request, so no authorization check ran (the BOLA of 6.2, caused by one header). With the correct <code>private, no-cache</code>:</p>
<pre><code class="language-bash">curl -s -D - 'http://localhost:8081/v2/bookings?limit=2&amp;fields=id,userId' \\
  -H "Authorization: Bearer $(cat an.jwt)" | grep -iE '^(cache-control|x-cache)|"userId"' | tr \\
  -d '\\r'</code></pre>
<div class="out">cache-control: private, no-cache
x-cache: MISS
      "userId": "usr_1"
      "userId": "usr_1"</div>
<pre><code class="language-bash">curl -s -D - 'http://localhost:8081/v2/bookings?limit=2&amp;fields=id,userId' \\
  -H "Authorization: Bearer $(cat bin.jwt)" | grep -iE '^(cache-control|x-cache|age)|"userId"' | tr \\
  -d '\\r'</code></pre>
<div class="out">cache-control: private, no-cache
x-cache: MISS
      "userId": "usr_2"
      "userId": "usr_2"</div>
<pre><code class="language-bash">for i in 1 2 3; do curl -s -D - -o /dev/null http://localhost:8081/v2/labs | grep -iE '^(x-cache|age)' | tr -d '\\r' | paste -sd' ' -; done</code></pre>
<div class="out">x-cache: MISS
age: 0 x-cache: HIT
age: 0 x-cache: HIT</div>
<p>The public lab list is shared exactly as intended: one MISS, then HITs for everyone.</p>
<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc9111.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: RFC 9111 HTTP Caching — §5.2 Cache-Control, §3.5 storing responses to authenticated requests, §5.1 Age (read 1 Nov 2026)</span><span class="lc-sub">A shared cache must not reuse a response to a request with Authorization unless the response allows it explicitly (public, s-maxage, must-revalidate); private forbids shared caches; no-cache allows storing but requires validation before every reuse.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>
<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc9110.html#name-conditional-requests" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: RFC 9110 §13 Conditional Requests and §8.8.3 ETag (read 1 Nov 2026)</span><span class="lc-sub">If-None-Match with a matching entity tag ⇒ 304 Not Modified for GET/HEAD; strong vs weak tags (W/); the server decides what a tag means — LabFlow’s means “collection version + who + what”.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>Rules LabFlow writes into its contract</h3>
<ul>
  <li>Every GET says <code>Cache-Control</code> explicitly; per-user data is never <code>public</code>.</li>
  <li><code>Vary</code> lists every request header that changes the body (<code>Accept-Encoding</code>, <code>Accept-Language</code>, and later <code>LabFlow-Consistency</code> in Lab 9).</li>
  <li>Writes return the new <code>ETag</code> (5.4) and bump the collection version, so lists revalidate.</li>
</ul>

<h3>In interviews and at work</h3>
<ul>
  <li><strong>“How would you cache this endpoint?”</strong> Start with HTTP: who may store it (public/private), how long (max-age), how to revalidate (ETag). Then check whether 304 skips the work or only the bytes.</li>
  <li><strong>“Can a CDN leak user data?”</strong> Yes — if a per-user answer is marked public. Measured here: Bình got An’s list from the cache.</li>
</ul>

<h3>🧪 Practice (25–35 min)</h3>
<div class="callout ok"><ol>
  <li>Add <code>notModifiedEarly('devices', …)</code> to <code>GET /v2/devices</code> and bump it in every device write. Prove a PATCH changes the ETag.</li>
  <li>Run the leak demo yourself, then fix it a second way: keep <code>public</code> but make the proxy refuse to store requests with <code>Authorization</code>. Which fix belongs in the API?</li>
</ol>
<p><strong>Done when:</strong> you can say for each LabFlow GET who may cache it and for how long.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cache-Control</span><span class="v">Who may store a response and how long it stays fresh.</span></div>
  <div class="kv"><span class="k">Shared cache</span><span class="v">A CDN or proxy that serves one stored copy to many users.</span></div>
  <div class="kv"><span class="k">ETag / If-None-Match</span><span class="v">A version label, sent back to ask “changed since?”.</span></div>
  <div class="kv"><span class="k">304 Not Modified</span><span class="v">“Your copy is still right” — no body.</span></div>
  <div class="kv"><span class="k">Revalidation</span><span class="v">Checking with the origin before reusing a stored copy.</span></div>
  <div class="kv"><span class="k">Vary</span><span class="v">Request headers that change the response; part of the cache key.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Lab list: <code>public, max-age=60</code>; per-user lists: <code>private, no-cache</code>; secrets: <code>no-store</code>.</li>
  <li>Express’s automatic 304 saved bytes but not work (1,033 req/s); checking a version ETag before the query gave 9,112 req/s.</li>
  <li>A write bumps the collection version ⇒ old ETags stop matching.</li>
  <li>One wrong <code>public</code> made a shared cache hand An’s bookings to Bình; <code>private</code> fixed it.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Cache HTTP cho API: Cache-Control, ETag và 304</h2>
<p class="lead">Request nhanh nhất là request mà server không phải trả lời đầy đủ. HTTP đã có sẵn cả một hệ thống cache — trình duyệt, app và CDN đều nói được — và API chỉ cần nói, bằng header, cái gì được giữ, ai được giữ và giữ bao lâu. Bài này thêm các header đó cho LabFlow, đo xem một <code>304 Not Modified</code> thật sự tiết kiệm được gì, và chỉ ra một lỗi header làm lộ lượt đặt của sinh viên này cho sinh viên khác.</p>

<div class="callout ok">
<p><strong>Học xong Chương 9 bạn làm được:</strong></p>
<ul>
  <li>viết <code>Cache-Control</code> và <code>ETag</code> để client và cache dùng chung tái sử dụng câu trả lời an toàn, và trả <code>304</code> mà không phải làm việc (9.1);</li>
  <li>đặt cache phía server (Redis) trước một truy vấn chậm và chặn “giẫm đạp” (stampede): 50 lần hỏi CSDL → 1 (9.2);</li>
  <li>giải thích vì sao người dùng “không thấy cái mình vừa lưu” khi đọc từ bản sao, và sửa trong hợp đồng bằng một token nhất quán (9.3);</li>
  <li>chọn định danh và cách phân trang vẫn đúng khi dữ liệu chia ra nhiều phân mảnh — và thấy phân trang offset trả sai trang (9.4);</li>
  <li>nhìn mẫu truy cập của API mà biết khi nào tài liệu (JSONB/MongoDB) hơn bảng và khi nào nó gây hại (9.5); rồi áp tất cả vào một luồng ghi chú ở Lab 9.</li>
</ul>
<p><strong>Vì sao đáng học:</strong> Chương 8 giữ một server sống; chương này nói về dữ liệu lớn lên. Cache, bản sao và định danh là nơi sinh ra sự cố và rò rỉ dữ liệu thật — và mọi quyết định đều hiện ra trong hợp đồng API, không chỉ ở hạ tầng.</p>
</div>
<a class="link-card" href="https://media.cuongthai.com/files/academy/API/v1/labflow-api-ch9-dau.zip" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Tải về: LabFlow API đầu Chương 9 (zip, không kèm node_modules)</span><span class="lc-sub">Trước Lab 9. <code>npm ci</code>, <code>npm start</code> (không cần CSDL); các route Chương 9 cần <code>LABFLOW_PG=1</code> với PostgreSQL 18 (+ Redis cho 9.2, một replica cho 9.3). Script ở <code>perf/</code>, SQL ở <code>sql/</code>. Mật khẩu demo: an-lab-2026, binh-lab-2026, lan-lab-2026 (chỉ để học).</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>Ai được giữ một response, và giữ bao lâu</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">app / trình duyệt</span><span class="lz-t">cache riêng</span><span class="lz-d">chỉ thiết bị của người dùng này</span></div>
  <div class="lz-step"><span class="lz-k">CDN / proxy</span><span class="lz-t">cache dùng chung</span><span class="lz-d">một bản phục vụ NHIỀU người</span></div>
  <div class="lz-step"><span class="lz-k">LabFlow</span><span class="lz-t">server gốc</span><span class="lz-d">quyết định bằng Cache-Control + ETag</span></div>
</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">public, max-age=60</span><span class="lz-lnote">ai cũng được (kể cả cache dùng chung) dùng lại trong 60 giây mà không hỏi — mọi người cùng một câu trả lời</span></div>
  <div class="lz-layer"><span class="lz-lname">private, no-cache</span><span class="lz-lnote">chỉ client của chính người dùng được lưu, và phải hỏi server (bằng ETag) trước khi dùng lại</span></div>
  <div class="lz-layer"><span class="lz-lname">no-store</span><span class="lz-lnote">không ai được lưu — token, trang thanh toán (câu trả lời đăng nhập của LabFlow, 6.1)</span></div>
</div>
<p>LabFlow chọn: danh sách phòng giống nhau cho mọi người và hiếm khi đổi ⇒ <code>public, max-age=60</code>. Danh sách lượt đặt thuộc về một người ⇒ <code>private, no-cache</code>.</p>

<h3>ETag và 304: “từ bản của tôi tới giờ có gì đổi không?”</h3>
<p><strong>ETag</strong> là nhãn phiên bản của một response. Client giữ nó và hỏi lại kèm <code>If-None-Match</code>; nếu không có gì đổi, server trả <code>304 Not Modified</code> với body rỗng (bài 5.4 đã dùng chính nhãn này với <code>If-Match</code> để chặn mất cập nhật). LabFlow dựng ETag từ <strong>số phiên bản của từng bộ sưu tập</strong> — lệnh ghi nào cũng tăng nó — cộng với ai hỏi và hỏi gì:</p>
<pre><code class="language-javascript">// httpCache.js — bài 9.1: ETag theo phiên bản bộ sưu tập; so If-None-Match TRƯỚC truy vấn (LABFLOW_HTTP_CACHE=express ⇒ để Express tự lo)
import { createHash } from 'node:crypto';

export const versions = { bookings: 0, labs: 0 };
export const bump = (name) =&gt; { versions[name]++; };

const short = (s) =&gt; createHash('sha256').update(s).digest('base64url').slice(0, 16);

// ETag mạnh: phiên bản bộ sưu tập + ai hỏi + hỏi gì (URL, phiên bản API, ngôn ngữ) — khác bất kỳ cái nào ⇒ ETag khác
export const listEtag = (name, req) =&gt;
  &#96;"\${name}-v\${versions[name]}-\${short(&#96;\${req.user?.id ?? '-'}|\${req.apiVersion}|\${req.get('Accept-Language') ?? ''}|\${req.originalUrl}&#96;)}"&#96;;

export function notModifiedEarly(name, cacheControl) {
  return (req, res, next) =&gt; {
    const tag = listEtag(name, req);
    res.set('Cache-Control', cacheControl()).set('ETag', tag);
    if (process.env.LABFLOW_HTTP_CACHE === 'express') { res.removeHeader('ETag'); return next(); }
    const inm = req.get('If-None-Match');
    if (inm &amp;&amp; inm.split(',').map((s) =&gt; s.trim().replace(/^W\\//, '')).includes(tag)) return res.status(304).end();
    next();
  };
}</code></pre>
<p>Mỗi danh sách gắn một middleware, và <code>bump('bookings')</code> được gọi sau khi tạo, huỷ và check-in.</p>
<pre><code class="language-javascript">// routes/labs.js — danh sách phòng giống nhau cho mọi người, hiếm khi đổi ⇒ public, cache dùng chung giữ 60 s
import { notModifiedEarly } from '../httpCache.js';
  .get(ipLimit, validate('query', LabsQuery), notModifiedEarly('labs', () =&gt; 'public, max-age=60'), (req, res) =&gt; {

// routes/bookings.js — danh sách RIÊNG của từng người: private (cache dùng chung không được giữ), no-cache (dùng lại phải hỏi bằng ETag)
// LABFLOW_CACHE_BUG=1 ⇒ cố ý ghi public, max-age=60 để thấy cache dùng chung làm lộ dữ liệu (CHỈ để học)
import { notModifiedEarly, bump } from '../httpCache.js';
const bookingsCacheControl = () =&gt; (process.env.LABFLOW_CACHE_BUG ? 'public, max-age=60' : 'private, no-cache');
  .get(validate('query', { 1: BookingsQuery, 2: BookingsQueryV2 }), notModifiedEarly('bookings', bookingsCacheControl), (req, res) =&gt; {
// … và một dòng ngay sau mỗi lệnh ghi: bookings.push(booking) (tạo), b.status = 'CHECKED_IN', b.status = 'CANCELLED'
    bump('bookings');</code></pre>
<pre><code class="language-bash">curl -s -D - -o /dev/null http://localhost:4000/v2/labs | grep -iE '^(HTTP|cache-control|etag|content-length)'</code></pre>
<div class="out">HTTP/1.1 200 OK
Cache-Control: public, max-age=60
ETag: "labs-v0-s1g6flhZDIvF7fKK"
Content-Length: 454</div>
<pre><code class="language-bash">curl -s -D - -o /dev/null http://localhost:4000/v2/labs \\
  -H 'If-None-Match: "labs-v0-s1g6flhZDIvF7fKK"' | grep -iE '^(HTTP|etag|content-length)'</code></pre>
<div class="out">HTTP/1.1 304 Not Modified
ETag: "labs-v0-s1g6flhZDIvF7fKK"</div>

<h3>Một 304 thật sự tiết kiệm được gì</h3>
<p>Express đã tự gửi ETag yếu (băm của body) và tự trả 304. Chạy LabFlow với <code>LABFLOW_HTTP_CACHE=express</code> để thấy trên 100 lượt đặt:</p>
<pre><code class="language-bash">curl -s -D - -o /dev/null 'http://localhost:4000/v2/bookings?limit=100' \\
  -H "Authorization: Bearer $(cat lan.jwt)" | grep -iE '^(HTTP|cache-control|etag|server-timing)' | tee hdr.txt</code></pre>
<div class="out">HTTP/1.1 200 OK
Cache-Control: private, no-cache
ETag: W/"8e4c-LH6b72wodeTqaQUnExBSfrQqBrY"
Server-Timing: auth;dur=0.23, validate;dur=1.49, db;dur=0.33, sort;dur=7.96, total;dur=12.57</div>
<pre><code class="language-bash">curl -s -D - -o /dev/null 'http://localhost:4000/v2/bookings?limit=100' \\
  -H "Authorization: Bearer $(cat lan.jwt)" \\
  -H "If-None-Match: $(grep -i ^etag hdr.txt | cut -d' ' -f2 | tr \\
  -d '\\r')" -w 'body: %{size_download} byte\\n' | grep -iE '^(HTTP|server-timing)|body'</code></pre>
<div class="out">HTTP/1.1 304 Not Modified
Server-Timing: auth;dur=0.07, validate;dur=0.16, db;dur=0.29, sort;dur=0.86, total;dur=2.21
body: 0 byte</div>
<p>Không byte nào trên đường truyền — nhưng Server-Timing vẫn có <code>db</code> và <code>sort</code>: Express chỉ so được <em>sau khi</em> đã dựng body để băm. Server đã làm đủ việc. ETag riêng của LabFlow thì so được <em>trước</em> truy vấn:</p>
<pre><code class="language-bash">curl -s -D - -o /dev/null 'http://localhost:4000/v2/bookings?limit=100' \\
  -H "Authorization: Bearer $(cat lan.jwt)" | grep -iE '^(HTTP|cache-control|etag|server-timing)' | tee hdr.txt</code></pre>
<div class="out">HTTP/1.1 200 OK
Cache-Control: private, no-cache
ETag: "bookings-v0-GIYXoq2-h6kTmHuH"
Server-Timing: auth;dur=0.22, validate;dur=1.64, db;dur=0.34, sort;dur=8.00, total;dur=12.83</div>
<pre><code class="language-bash">curl -s -D - -o /dev/null 'http://localhost:4000/v2/bookings?limit=100' \\
  -H "Authorization: Bearer $(cat lan.jwt)" \\
  -H "If-None-Match: $(grep -i ^etag hdr.txt | cut -d' ' -f2 | tr \\
  -d '\\r')" -w 'body: %{size_download} byte\\n' | grep -iE '^(HTTP|server-timing)|body'</code></pre>
<div class="out">HTTP/1.1 304 Not Modified
Server-Timing: auth;dur=0.07, validate;dur=0.14, total;dur=0.79
body: 0 byte</div>
<p>Giờ 304 chỉ tốn 0,65 ms và không có bước <code>db</code>. Khi có tải (autocannon, 10 kết nối, request nào cũng gửi <code>If-None-Match</code>):</p>
<pre><code class="language-bash">npx autocannon -c 10 -d 10 -H "Authorization=Bearer $(cat lan.jwt)" 'http://localhost:4000/v2/bookings?limit=100' 2&gt;&amp;1 | grep -E 'Req/Sec|requests in'</code></pre>
<div class="out">│ Req/Sec   │ 688     │ 688     │ 1,161   │ 1,276   │ 1,127   │ 154.6   │ 688     │
12k requests in 11.01s, 458 MB read</div>
<pre><code class="language-bash">npx autocannon -c 10 -d 10 -H "Authorization=Bearer $(cat lan.jwt)" -H "If-None-Match=$(grep -i ^etag hdr.txt | cut -d' ' -f2 | tr -d '\\r')" 'http://localhost:4000/v2/bookings?limit=100' 2&gt;&amp;1 | grep -E 'Req/Sec|2xx|requests in'</code></pre>
<div class="out">│ Req/Sec   │ 454    │ 454    │ 1,175  │ 1,270  │ 1,032.82 │ 263.46 │ 454    │
0 2xx responses, 11361 non 2xx responses
11k requests in 11.02s, 5.15 MB read</div>
<pre><code class="language-bash">npx autocannon -c 10 -d 10 -H "Authorization=Bearer $(cat lan.jwt)" 'http://localhost:4000/v2/bookings?limit=100' 2&gt;&amp;1 | grep -E 'Req/Sec|requests in'</code></pre>
<div class="out">│ Req/Sec   │ 1,036   │ 1,036   │ 1,221   │ 1,298 │ 1,197.37 │ 77.25   │ 1,036   │
13k requests in 11.01s, 487 MB read</div>
<pre><code class="language-bash">npx autocannon -c 10 -d 10 -H "Authorization=Bearer $(cat lan.jwt)" -H "If-None-Match=$(grep -i ^etag hdr.txt | cut -d' ' -f2 | tr -d '\\r')" 'http://localhost:4000/v2/bookings?limit=100' 2&gt;&amp;1 | grep -E 'Req/Sec|2xx|requests in'</code></pre>
<div class="out">│ Req/Sec   │ 8,655   │ 8,655   │ 9,103   │ 9,599   │ 9,111.64 │ 253.68  │ 8,652   │
0 2xx responses, 100230 non 2xx responses
100k requests in 11.01s, 28.5 MB read</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Trả đủ 200 · ~1.130–1.200 req/s</span><span class="lz-lnote">458–487 MB trong 10 giây</span></div>
  <div class="lz-layer"><span class="lz-lname">304 của Express · 1.033 req/s</span><span class="lz-lnote">5 MB — tiết kiệm băng thông, không tiết kiệm công server</span></div>
  <div class="lz-layer"><span class="lz-lname">304 so trước truy vấn · 9.112 req/s</span><span class="lz-lnote">gấp 8,8 lần — tiết kiệm cả hai</span></div>
</div>
<p>(Ở đây “non 2xx” là đúng: câu trả lời nào cũng là 304. Hãy đọc mã trạng thái — 8.2.) Và một lệnh ghi phải đổi nhãn, nếu không client giữ dữ liệu cũ mãi mãi:</p>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' http://localhost:4000/v2/bookings \\
  -H "Authorization: Bearer $(cat lan.jwt)" \\
  --json '{"labId":"lab_1","period":{"start":"2030-05-03T08:00:00+07:00","end":"2030-05-03T10:00:00+07:00"}}'</code></pre>
<div class="out">201</div>
<pre><code class="language-bash">curl -s -D - -o /dev/null 'http://localhost:4000/v2/bookings?limit=100' \\
  -H "Authorization: Bearer $(cat lan.jwt)" \\
  -H "If-None-Match: $(grep -i ^etag hdr.txt | cut -d' ' -f2 | tr \\
  -d '\\r')" | grep -iE '^(HTTP|etag)'</code></pre>
<div class="out">HTTP/1.1 200 OK
ETag: "bookings-v1-GIYXoq2-h6kTmHuH"</div>
<div class="pitfall"><p><strong>Bẫy — ETag không tính tới ai đang hỏi.</strong> Nếu danh sách của cô Lan và của An cùng ETag, client của An có thể được báo “304, bản của bạn vẫn đúng” về dữ liệu của cô Lan. LabFlow trộn id người dùng, phiên bản API và Accept-Language vào nhãn.</p></div>

<h3>Header làm lộ dữ liệu</h3>
<p>Để nhìn cache dùng chung từ bên trong, <code>perf/cache-proxy.mjs</code> là một cache 40 dòng đứng trước LabFlow, làm theo RFC 9111 vừa đủ: nó lưu câu trả lời 200 còn tươi và không phải <code>private</code>/<code>no-store</code>, và khi request có <code>Authorization</code> thì chỉ lưu nếu câu trả lời ghi <code>public</code>. Giờ cố ý làm hỏng LabFlow bằng <code>LABFLOW_CACHE_BUG=1</code>, ghi danh sách lượt đặt riêng của từng người là <code>public, max-age=60</code>. An hỏi trước, rồi Bình hỏi cùng URL:</p>
<pre><code class="language-bash">curl -s -D - 'http://localhost:8081/v2/bookings?limit=2&amp;fields=id,userId' \\
  -H "Authorization: Bearer $(cat an.jwt)" | grep -iE '^(cache-control|x-cache)|"userId"' | tr \\
  -d '\\r'</code></pre>
<div class="out">cache-control: public, max-age=60
x-cache: MISS
      "userId": "usr_1"
      "userId": "usr_1"</div>
<pre><code class="language-bash">curl -s -D - 'http://localhost:8081/v2/bookings?limit=2&amp;fields=id,userId' \\
  -H "Authorization: Bearer $(cat bin.jwt)" | grep -iE '^(cache-control|x-cache|age)|"userId"' | tr \\
  -d '\\r'</code></pre>
<div class="out">cache-control: public, max-age=60
age: 0
x-cache: HIT
      "userId": "usr_1"
      "userId": "usr_1"</div>
<p><strong>Bình nhận được lượt đặt của An</strong> (<code>usr_1</code>), do cache phục vụ — LabFlow không hề thấy request của Bình, nên không có phép kiểm quyền nào chạy (lỗi BOLA của bài 6.2, gây ra chỉ bởi một header). Với <code>private, no-cache</code> đúng:</p>
<pre><code class="language-bash">curl -s -D - 'http://localhost:8081/v2/bookings?limit=2&amp;fields=id,userId' \\
  -H "Authorization: Bearer $(cat an.jwt)" | grep -iE '^(cache-control|x-cache)|"userId"' | tr \\
  -d '\\r'</code></pre>
<div class="out">cache-control: private, no-cache
x-cache: MISS
      "userId": "usr_1"
      "userId": "usr_1"</div>
<pre><code class="language-bash">curl -s -D - 'http://localhost:8081/v2/bookings?limit=2&amp;fields=id,userId' \\
  -H "Authorization: Bearer $(cat bin.jwt)" | grep -iE '^(cache-control|x-cache|age)|"userId"' | tr \\
  -d '\\r'</code></pre>
<div class="out">cache-control: private, no-cache
x-cache: MISS
      "userId": "usr_2"
      "userId": "usr_2"</div>
<pre><code class="language-bash">for i in 1 2 3; do curl -s -D - -o /dev/null http://localhost:8081/v2/labs | grep -iE '^(x-cache|age)' | tr -d '\\r' | paste -sd' ' -; done</code></pre>
<div class="out">x-cache: MISS
age: 0 x-cache: HIT
age: 0 x-cache: HIT</div>
<p>Danh sách phòng công khai được dùng chung đúng ý: một MISS, rồi HIT cho mọi người.</p>
<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc9111.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: RFC 9111 HTTP Caching — §5.2 Cache-Control, §3.5 lưu response của request có xác thực, §5.1 Age (đọc ngày 1/11/2026)</span><span class="lc-sub">Cache dùng chung không được dùng lại response cho request có Authorization trừ khi response cho phép rõ (public, s-maxage, must-revalidate); private cấm cache dùng chung; no-cache cho lưu nhưng bắt kiểm lại trước mỗi lần dùng.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc9110.html#name-conditional-requests" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: RFC 9110 §13 Conditional Requests và §8.8.3 ETag (đọc ngày 1/11/2026)</span><span class="lc-sub">If-None-Match khớp nhãn ⇒ 304 Not Modified cho GET/HEAD; nhãn mạnh và yếu (W/); server tự quyết nhãn nghĩa là gì — của LabFlow nghĩa là “phiên bản bộ sưu tập + ai + hỏi gì”.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Luật LabFlow ghi vào hợp đồng</h3>
<ul>
  <li>Mọi GET đều ghi <code>Cache-Control</code> rõ ràng; dữ liệu riêng của người dùng không bao giờ là <code>public</code>.</li>
  <li><code>Vary</code> liệt kê mọi header của request làm đổi body (<code>Accept-Encoding</code>, <code>Accept-Language</code>, và <code>LabFlow-Consistency</code> ở Lab 9).</li>
  <li>Lệnh ghi trả <code>ETag</code> mới (5.4) và tăng phiên bản bộ sưu tập, để các danh sách được kiểm lại.</li>
</ul>

<h3>Khi phỏng vấn và khi đi làm</h3>
<ul>
  <li><strong>“Em cache endpoint này thế nào?”</strong> Bắt đầu bằng HTTP: ai được lưu (public/private), bao lâu (max-age), kiểm lại bằng gì (ETag). Rồi xem 304 bỏ qua được công việc hay chỉ bỏ qua byte.</li>
  <li><strong>“CDN có làm lộ dữ liệu người dùng không?”</strong> Có — nếu câu trả lời riêng bị ghi public. Đo ở đây: Bình nhận danh sách của An từ cache.</li>
</ul>

<h3>🧪 Thực hành (25–35 phút)</h3>
<div class="callout ok"><ol>
  <li>Thêm <code>notModifiedEarly('devices', …)</code> cho <code>GET /v2/devices</code> và tăng phiên bản ở mọi lệnh ghi thiết bị. Chứng minh một PATCH làm đổi ETag.</li>
  <li>Tự chạy bản demo rò rỉ, rồi sửa theo cách thứ hai: giữ <code>public</code> nhưng bắt proxy không lưu request có <code>Authorization</code>. Cách sửa nào thuộc về API?</li>
</ol>
<p><strong>Xong khi:</strong> với mỗi GET của LabFlow, bạn nói được ai được cache và cache bao lâu.</p></div>

<h3>🗂 Thuật ngữ chính</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cache-Control</span><span class="v">Ai được lưu response và nó tươi trong bao lâu.</span></div>
  <div class="kv"><span class="k">Cache dùng chung</span><span class="v">CDN hay proxy phục vụ một bản đã lưu cho nhiều người.</span></div>
  <div class="kv"><span class="k">ETag / If-None-Match</span><span class="v">Nhãn phiên bản, gửi lại để hỏi “có đổi không?”.</span></div>
  <div class="kv"><span class="k">304 Not Modified</span><span class="v">“Bản của bạn vẫn đúng” — không có body.</span></div>
  <div class="kv"><span class="k">Kiểm lại (revalidation)</span><span class="v">Hỏi server gốc trước khi dùng lại bản đã lưu.</span></div>
  <div class="kv"><span class="k">Vary</span><span class="v">Các header của request làm đổi response; là một phần khoá cache.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Danh sách phòng: <code>public, max-age=60</code>; danh sách riêng: <code>private, no-cache</code>; bí mật: <code>no-store</code>.</li>
  <li>304 tự động của Express tiết kiệm byte nhưng không tiết kiệm công (1.033 req/s); so ETag phiên bản trước truy vấn cho 9.112 req/s.</li>
  <li>Lệnh ghi tăng phiên bản bộ sưu tập ⇒ ETag cũ thôi khớp.</li>
  <li>Một chữ <code>public</code> sai làm cache dùng chung đưa lượt đặt của An cho Bình; <code>private</code> sửa được.</li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── 9.2 (bài MỚI) ─────────────────────────── */
    {
      title: '9.2 — Server-side caching with Redis — and the stampede when a key expires|||9.2 — Cache phía server bằng Redis — và cú giẫm đạp khi khoá hết hạn',
      slug: 'api-9-1-server-cache',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Cache-aside với Redis trước truy vấn gộp 1 triệu dòng (80–120 ms → 1,3 ms, 43 → 4.150 req/s), TTL có jitter, khoá cache đúng; cú giẫm đạp: 50 → 32 → 1 truy vấn nhờ single-flight; hợp đồng nói độ cũ.',
      content: `${G092}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>Server-side caching with Redis — and the stampede when a key expires</h2>
<p class="lead">HTTP caching (9.1) helps when the <em>same client</em> asks again. When <em>many different clients</em> ask for the same expensive answer, the server needs its own memory: compute once, keep the result in Redis for a few seconds, serve everyone from there. This lesson measures that on a real slow query — and the moment it goes wrong: a key expires while 50 requests are waiting.</p>

<h3>An expensive question</h3>
<p>Lab managers want bookings per lab over the Chapter 3 table in PostgreSQL (1,000,000 rows). <code>GET /v2/stats/labs</code> runs one aggregate query — a full scan, ~80–120 ms. It is mounted only when LabFlow starts with <code>LABFLOW_PG=1</code> (PostgreSQL on 55432, Redis on 6390), so the rest of LabFlow still runs without them:</p>
<pre><code class="language-javascript">// routes/stats.js — bài 9.2: số lượt đặt theo phòng trên bảng 1.000.000 dòng của PostgreSQL (Chương 3) — một truy vấn ĐẮT
import { Router } from 'express';
import pg from 'pg';
import { onlyAllow } from '../http.js';
import { cached } from '../serverCache.js';

const pool = new pg.Pool({ connectionString: process.env.PGURL ?? 'postgres://labflow@localhost:55432/labflow', max: 10 });
let queries = 0;                                                  // để HỌC: CSDL đã bị hỏi bao nhiêu lần
const SQL = &#96;SELECT lab_id AS "labId", count(*)::int AS bookings FROM bookings WHERE status &lt;&gt; 'CANCELLED' GROUP BY lab_id ORDER BY lab_id&#96;;

export const statsRouter = Router();
statsRouter.route('/labs')
  .get(async (req, res) =&gt; {
    const data = await cached(req, 'stats:labs:v1', 10, async () =&gt; { queries++; return (await pool.query(SQL)).rows; });
    res.set('LabFlow-DB-Queries', String(queries)).json({ data });
  })
  .all(onlyAllow('GET'));</code></pre>
<p>The header <code>LabFlow-DB-Queries</code> counts how many times the database was asked — only for learning.</p>
<pre><code class="language-javascript">// timing.js — thêm vào req.timing (bài 8.1) để đo một đoạn await
    async timeAsync(name, fn) {
      const a = performance.now();
      try { return await fn(); } finally { marks.push([name, performance.now() - a]); }
    },

// app.js — các route Chương 9 dùng PostgreSQL (+ replica, Redis) chỉ bật khi có LABFLOW_PG=1; thiếu thì LabFlow vẫn chạy như cũ
const pgRoutes = process.env.LABFLOW_PG ? { ...(await import('./routes/notes.js')), ...(await import('./routes/stats.js')) } : null;
if (pgRoutes) api.use('/labs/:labId/notes', pgRoutes.labNotesRouter);   // bài 9.3 — đặt TRƯỚC /labs
api.use('/labs', labsRouter);
// …
if (pgRoutes) api.use('/stats', pgRoutes.statsRouter);          // bài 9.2
if (pgRoutes) api.use('/notes', pgRoutes.notesRouter);          // bài 9.3</code></pre>

<h3>Cache-aside in five steps</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">GET key in Redis</span><span class="lz-d">~0.5 ms</span></div>
  <div class="lz-step"><span class="lz-k">2 · hit</span><span class="lz-t">return it</span><span class="lz-d">the database is not touched</span></div>
  <div class="lz-step"><span class="lz-k">3 · miss</span><span class="lz-t">run the query</span><span class="lz-d">80–120 ms</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">SET key EX ttl</span><span class="lz-d">10 s + up to 10% jitter</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">return it</span><span class="lz-d">the next 10 s are hits</span></div>
</div>
<pre><code class="language-javascript">// serverCache.js — bài 9.2: cache phía server (cache-aside) bằng Redis, và chống "giẫm đạp" (stampede) khi khoá hết hạn
//   LABFLOW_REDIS=redis://localhost:6390   LABFLOW_CACHE_MODE = none | redis | singleflight
import { createClient } from 'redis';

const MODE = process.env.LABFLOW_CACHE_MODE ?? 'none';
let client = null;
if (MODE !== 'none') {
  client = createClient({ url: process.env.LABFLOW_REDIS ?? 'redis://localhost:6390' });
  client.on('error', (e) =&gt; console.error('redis', e.message));
  await client.connect();
}
const inflight = new Map();                                       // khoá ⇒ Promise đang tính (chỉ trong MỘT instance)

// cached(key, ttlSec, load): đọc Redis; trượt ⇒ load() rồi SET … EX ttl (+ 0–10% jitter để các khoá không hết hạn cùng lúc)
export async function cached(req, key, ttlSec, load) {
  if (MODE === 'none') return req.timing.timeAsync('db', load);
  const hit = await req.timing.timeAsync('cache', () =&gt; client.get(key));
  if (hit !== null) { req.res.set('LabFlow-Cache', 'HIT'); return JSON.parse(hit); }
  req.res.set('LabFlow-Cache', 'MISS');
  const fill = async () =&gt; {
    const value = await req.timing.timeAsync('db', load);
    const ttl = Math.round(ttlSec * (1 + Math.random() * 0.1));
    await client.set(key, JSON.stringify(value), { expiration: { type: 'EX', value: ttl } });
    return value;
  };
  if (MODE !== 'singleflight') return fill();
  if (!inflight.has(key)) inflight.set(key, fill().finally(() =&gt; inflight.delete(key)));
  return inflight.get(key);                                       // 50 request cùng trượt ⇒ cùng chờ MỘT lần đọc CSDL
}
export const cacheClient = () =&gt; client;</code></pre>
<p>Started with <code>LABFLOW_CACHE_MODE=redis</code>:</p>
<pre><code class="language-bash">for i in 1 2; do curl -s -D - -o /dev/null http://localhost:4000/v2/stats/labs | grep -iE '^(labflow-cache|labflow-db-queries|server-timing)' | tr -d '\\r'; done</code></pre>
<div class="out">LabFlow-Cache: MISS
LabFlow-DB-Queries: 1
Server-Timing: cache;dur=3.12, db;dur=80.17, total;dur=87.34
LabFlow-Cache: HIT
LabFlow-DB-Queries: 1
Server-Timing: cache;dur=0.56, total;dur=1.34</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v2/stats/labs | jq -c '.data[0:3]'</code></pre>
<div class="out">[{"labId":"lab_1","bookings":17143},{"labId":"lab_10","bookings":17143},{"labId":"lab_11","bookings":17143}]</div>
<pre><code class="language-bash">redis-cli -p 6390 TTL stats:labs:v1</code></pre>
<div class="out">11</div>
<p>The first request paid 80 ms of <code>db</code>; the second was a hit in 1.3 ms total. The TTL is 11, not 10: the jitter, so keys written at the same moment do not all expire in the same second. Under steady load (autocannon, 10 connections, 10 s):</p>
<pre><code class="language-bash">npx autocannon -c 10 -d 10 http://localhost:4000/v2/stats/labs 2&gt;&amp;1 | grep -E 'Latency|Req/Sec|requests in'</code></pre>
<div class="out">│ Latency │ 76 ms │ 124 ms │ 669 ms │ 755 ms │ 228.73 ms │ 194.43 ms │ 841 ms │
│ Req/Sec   │ 33     │ 33     │ 43     │ 48     │ 42.7   │ 3.96    │ 33     │
437 requests in 10.03s, 1.47 MB read</div>
<pre><code class="language-bash">npx autocannon -c 10 -d 10 http://localhost:4000/v2/stats/labs 2&gt;&amp;1 | grep -E 'Latency|Req/Sec|requests in'</code></pre>
<div class="out">│ Latency │ 1 ms │ 1 ms │ 7 ms  │ 12 ms │ 1.99 ms │ 12.13 ms │ 957 ms │
│ Req/Sec   │ 516     │ 516     │ 3,859   │ 6,935 │ 4,150.3 │ 1,857.37 │ 516     │
42k requests in 10.02s, 144 MB read</div>
<p>From 43 to 4,150 requests per second — about 97×. The database now sees one query every ~10 s instead of 43 per second.</p>
<div class="pitfall"><p><strong>Trap — a cache key that forgets something.</strong> The key must contain everything that changes the answer: filters, user or tenant, API version, and a schema version (<code>stats:labs:v1</code> — change the shape, change <code>v1</code> → <code>v2</code>, or old clients receive new shapes and vice versa).</p></div>

<h3>The stampede</h3>
<p>Every 10 s the key expires. If 50 requests arrive in that gap, each one misses, and each one runs the 100 ms query. <code>perf/stampede.mjs</code> deletes the key and fires 50 requests at once, then reads <code>LabFlow-DB-Queries</code> to count database queries:</p>
<pre><code class="language-bash">node perf/stampede.mjs</code></pre>
<div class="out">50 request cùng lúc vào khoá vừa hết hạn ⇒ CSDL bị hỏi 50 lần · p50 994 ms · max 1661 ms</div>
<pre><code class="language-bash">node perf/stampede.mjs</code></pre>
<div class="out">50 request cùng lúc vào khoá vừa hết hạn ⇒ CSDL bị hỏi 32 lần · p50 346 ms · max 783 ms</div>
<p>Without a cache: 50 queries. With Redis: still <strong>32</strong> (16 on an earlier run — whoever arrives after the first query finished gets a hit; everyone before it misses). The cache did not protect the database at exactly the moment it was needed. The fix is <strong>single-flight</strong>: while one request is loading a key, the others wait for <em>its</em> promise instead of starting their own:</p>
<pre><code class="language-javascript">if (!inflight.has(key)) inflight.set(key, fill().finally(() =&gt; inflight.delete(key)));
return inflight.get(key);   // 50 request cùng trượt ⇒ cùng chờ MỘT lần đọc CSDL</code></pre>
<pre><code class="language-bash">node perf/stampede.mjs</code></pre>
<div class="out">50 request cùng lúc vào khoá vừa hết hạn ⇒ CSDL bị hỏi 1 lần · p50 92 ms · max 97 ms</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">No cache · 50 queries</span><span class="lz-lnote">p50 994 ms — the queries queue for the 10-connection pool</span></div>
  <div class="lz-layer"><span class="lz-lname">Redis cache-aside · 32 queries</span><span class="lz-lnote">p50 346 ms — the stampede</span></div>
  <div class="lz-layer"><span class="lz-lname">+ single-flight · 1 query</span><span class="lz-lnote">p50 92 ms — everyone waits for one load</span></div>
</div>
<p>Single-flight lives in one process: with 4 instances (8.4) a stampede can still cause 4 queries. To go further, take a short lock in Redis (<code>SET lock:key 1 NX PX 2000</code>) so only one instance loads, or refresh the key <em>before</em> it expires. Those patterns, measured, are lesson 6.3 of the Redis course.</p>
<a class="link-card" href="/courses/redis/learn?lessonSlug=rd-6-3-giam-dap" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Go deeper: Redis course, lesson 6.3 — cache stampedes</span><span class="lc-sub">Same problem from the Redis side: locks with SET NX, probabilistic early refresh, and what each costs when Redis restarts. This lesson stays at the API: what the client sees and what the contract promises.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/set/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: Redis docs — SET with EX / PX / NX (read 1 Nov 2026)</span><span class="lc-sub">SET key value EX seconds stores a value with an expiry in one atomic command; NX sets only if the key does not exist — the building block of a simple lock. LabFlow uses node-redis 5.12 against Redis 8.2.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>What the contract must say</h3>
<ul>
  <li><strong>Freshness:</strong> “statistics may be up to 10 seconds old”. If clients need to know, send <code>Age</code> (9.1, 8.6).</li>
  <li><strong>Invalidation:</strong> a cached answer is either refreshed by TTL (simple, bounded staleness) or deleted on write (fresher, but every write path must remember it). For aggregate statistics, TTL is the honest choice.</li>
  <li><strong>Failure:</strong> the cache is an optimisation. If Redis is down the endpoint should fall back to the database, not answer 500 — LabFlow’s 30-line version does not do that yet (practice 2).</li>
</ul>

<h3>In interviews and at work</h3>
<ul>
  <li><strong>“What is a cache stampede and how do you stop it?”</strong> Many requests miss the same key at once and all hit the database. Single-flight per instance (measured 32 → 1 queries), a lock or early refresh across instances, TTL jitter.</li>
  <li><strong>“Cache-aside or write-through?”</strong> Cache-aside for read-heavy data that may be slightly stale; say the staleness in the contract.</li>
</ul>

<h3>🧪 Practice (30–40 min)</h3>
<div class="callout ok"><ol>
  <li>Run <code>perf/stampede.mjs</code> with <code>N=200</code> in all three modes. How many queries does each mode cost?</li>
  <li>Stop Redis (<code>redis-cli -p 6390 shutdown nosave</code>) and call the endpoint. Then change <code>cached()</code> so a Redis error falls back to <code>load()</code>.</li>
  <li>Add <code>Age</code> to hits (store the time of the load next to the value).</li>
</ol>
<p><strong>Done when:</strong> the endpoint survives Redis being down and still answers in under 200 ms.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cache-aside</span><span class="v">Read cache; on a miss load from the database and store it.</span></div>
  <div class="kv"><span class="k">TTL</span><span class="v">How long a cached value lives before it expires.</span></div>
  <div class="kv"><span class="k">Jitter</span><span class="v">Randomness added to TTLs so keys do not expire together.</span></div>
  <div class="kv"><span class="k">Cache stampede</span><span class="v">Many requests miss the same key at once and all load it.</span></div>
  <div class="kv"><span class="k">Single-flight</span><span class="v">Concurrent misses share one load instead of starting their own.</span></div>
  <div class="kv"><span class="k">Bounded staleness</span><span class="v">“At most N seconds old” — a promise you can write down.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>A 1M-row aggregate cost 80–120 ms; a Redis hit 1.3 ms; steady load 43 → 4,150 req/s.</li>
  <li>When the key expired under 50 concurrent requests: 50 queries without cache, 16–32 with plain cache-aside, 1 with single-flight.</li>
  <li>Key = everything that changes the answer + a schema version; TTL with jitter.</li>
  <li>The contract says how stale the answer may be; the cache must fail open to the database.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-12-2-cache-aside" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Applied in Node.js — lesson 12.2: cache-aside and its four betrayals</span><span class="lc-sub">On 500,000 notes in PostgreSQL 17: a 58.34 ms leaderboard served in 0.41 ms (143.5×), a 1.6 MB list where the cache is 13% SLOWER than the database, 90% hits = 6.73 ms vs 99% = 0.93 ms, and 200 concurrent requests = 200 queries (4,178 ms) → 1 with single-flight (69.1 ms).</span></span>
  <span class="lc-cta">OPEN NODE.JS LESSON →</span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>Cache phía server bằng Redis — và cú “giẫm đạp” khi khoá hết hạn</h2>
<p class="lead">Cache HTTP (9.1) giúp khi <em>cùng một client</em> hỏi lại. Khi <em>nhiều client khác nhau</em> cùng hỏi một câu trả lời đắt, server cần bộ nhớ của riêng mình: tính một lần, giữ kết quả trong Redis vài giây, phục vụ mọi người từ đó. Bài này đo điều đó trên một truy vấn chậm thật — và khoảnh khắc nó hỏng: một khoá hết hạn đúng lúc 50 request đang chờ.</p>

<h3>Một câu hỏi đắt</h3>
<p>Quản lý phòng lab muốn số lượt đặt theo từng phòng trên bảng của Chương 3 trong PostgreSQL (1.000.000 dòng). <code>GET /v2/stats/labs</code> chạy một truy vấn gộp — quét toàn bảng, ~80–120 ms. Route này chỉ được gắn khi LabFlow khởi động với <code>LABFLOW_PG=1</code> (PostgreSQL ở 55432, Redis ở 6390), nên phần còn lại của LabFlow vẫn chạy khi không có chúng:</p>
<pre><code class="language-javascript">// routes/stats.js — bài 9.2: số lượt đặt theo phòng trên bảng 1.000.000 dòng của PostgreSQL (Chương 3) — một truy vấn ĐẮT
import { Router } from 'express';
import pg from 'pg';
import { onlyAllow } from '../http.js';
import { cached } from '../serverCache.js';

const pool = new pg.Pool({ connectionString: process.env.PGURL ?? 'postgres://labflow@localhost:55432/labflow', max: 10 });
let queries = 0;                                                  // để HỌC: CSDL đã bị hỏi bao nhiêu lần
const SQL = &#96;SELECT lab_id AS "labId", count(*)::int AS bookings FROM bookings WHERE status &lt;&gt; 'CANCELLED' GROUP BY lab_id ORDER BY lab_id&#96;;

export const statsRouter = Router();
statsRouter.route('/labs')
  .get(async (req, res) =&gt; {
    const data = await cached(req, 'stats:labs:v1', 10, async () =&gt; { queries++; return (await pool.query(SQL)).rows; });
    res.set('LabFlow-DB-Queries', String(queries)).json({ data });
  })
  .all(onlyAllow('GET'));</code></pre>
<p>Header <code>LabFlow-DB-Queries</code> đếm số lần CSDL bị hỏi — chỉ để học.</p>
<pre><code class="language-javascript">// timing.js — thêm vào req.timing (bài 8.1) để đo một đoạn await
    async timeAsync(name, fn) {
      const a = performance.now();
      try { return await fn(); } finally { marks.push([name, performance.now() - a]); }
    },

// app.js — các route Chương 9 dùng PostgreSQL (+ replica, Redis) chỉ bật khi có LABFLOW_PG=1; thiếu thì LabFlow vẫn chạy như cũ
const pgRoutes = process.env.LABFLOW_PG ? { ...(await import('./routes/notes.js')), ...(await import('./routes/stats.js')) } : null;
if (pgRoutes) api.use('/labs/:labId/notes', pgRoutes.labNotesRouter);   // bài 9.3 — đặt TRƯỚC /labs
api.use('/labs', labsRouter);
// …
if (pgRoutes) api.use('/stats', pgRoutes.statsRouter);          // bài 9.2
if (pgRoutes) api.use('/notes', pgRoutes.notesRouter);          // bài 9.3</code></pre>

<h3>Cache-aside trong năm bước</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">GET khoá trong Redis</span><span class="lz-d">~0,5 ms</span></div>
  <div class="lz-step"><span class="lz-k">2 · trúng</span><span class="lz-t">trả luôn</span><span class="lz-d">CSDL không bị đụng tới</span></div>
  <div class="lz-step"><span class="lz-k">3 · trượt</span><span class="lz-t">chạy truy vấn</span><span class="lz-d">80–120 ms</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">SET khoá EX ttl</span><span class="lz-d">10 giây + tới 10% jitter</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">trả về</span><span class="lz-d">10 giây sau đó đều trúng</span></div>
</div>
<pre><code class="language-javascript">// serverCache.js — bài 9.2: cache phía server (cache-aside) bằng Redis, và chống "giẫm đạp" (stampede) khi khoá hết hạn
//   LABFLOW_REDIS=redis://localhost:6390   LABFLOW_CACHE_MODE = none | redis | singleflight
import { createClient } from 'redis';

const MODE = process.env.LABFLOW_CACHE_MODE ?? 'none';
let client = null;
if (MODE !== 'none') {
  client = createClient({ url: process.env.LABFLOW_REDIS ?? 'redis://localhost:6390' });
  client.on('error', (e) =&gt; console.error('redis', e.message));
  await client.connect();
}
const inflight = new Map();                                       // khoá ⇒ Promise đang tính (chỉ trong MỘT instance)

// cached(key, ttlSec, load): đọc Redis; trượt ⇒ load() rồi SET … EX ttl (+ 0–10% jitter để các khoá không hết hạn cùng lúc)
export async function cached(req, key, ttlSec, load) {
  if (MODE === 'none') return req.timing.timeAsync('db', load);
  const hit = await req.timing.timeAsync('cache', () =&gt; client.get(key));
  if (hit !== null) { req.res.set('LabFlow-Cache', 'HIT'); return JSON.parse(hit); }
  req.res.set('LabFlow-Cache', 'MISS');
  const fill = async () =&gt; {
    const value = await req.timing.timeAsync('db', load);
    const ttl = Math.round(ttlSec * (1 + Math.random() * 0.1));
    await client.set(key, JSON.stringify(value), { expiration: { type: 'EX', value: ttl } });
    return value;
  };
  if (MODE !== 'singleflight') return fill();
  if (!inflight.has(key)) inflight.set(key, fill().finally(() =&gt; inflight.delete(key)));
  return inflight.get(key);                                       // 50 request cùng trượt ⇒ cùng chờ MỘT lần đọc CSDL
}
export const cacheClient = () =&gt; client;</code></pre>
<p>Chạy với <code>LABFLOW_CACHE_MODE=redis</code>:</p>
<pre><code class="language-bash">for i in 1 2; do curl -s -D - -o /dev/null http://localhost:4000/v2/stats/labs | grep -iE '^(labflow-cache|labflow-db-queries|server-timing)' | tr -d '\\r'; done</code></pre>
<div class="out">LabFlow-Cache: MISS
LabFlow-DB-Queries: 1
Server-Timing: cache;dur=3.12, db;dur=80.17, total;dur=87.34
LabFlow-Cache: HIT
LabFlow-DB-Queries: 1
Server-Timing: cache;dur=0.56, total;dur=1.34</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v2/stats/labs | jq -c '.data[0:3]'</code></pre>
<div class="out">[{"labId":"lab_1","bookings":17143},{"labId":"lab_10","bookings":17143},{"labId":"lab_11","bookings":17143}]</div>
<pre><code class="language-bash">redis-cli -p 6390 TTL stats:labs:v1</code></pre>
<div class="out">11</div>
<p>Request đầu trả 80 ms <code>db</code>; request thứ hai trúng cache, tổng 1,3 ms. TTL là 11 chứ không phải 10: đó là jitter, để các khoá ghi cùng lúc không hết hạn cùng một giây. Khi tải đều (autocannon, 10 kết nối, 10 giây):</p>
<pre><code class="language-bash">npx autocannon -c 10 -d 10 http://localhost:4000/v2/stats/labs 2&gt;&amp;1 | grep -E 'Latency|Req/Sec|requests in'</code></pre>
<div class="out">│ Latency │ 76 ms │ 124 ms │ 669 ms │ 755 ms │ 228.73 ms │ 194.43 ms │ 841 ms │
│ Req/Sec   │ 33     │ 33     │ 43     │ 48     │ 42.7   │ 3.96    │ 33     │
437 requests in 10.03s, 1.47 MB read</div>
<pre><code class="language-bash">npx autocannon -c 10 -d 10 http://localhost:4000/v2/stats/labs 2&gt;&amp;1 | grep -E 'Latency|Req/Sec|requests in'</code></pre>
<div class="out">│ Latency │ 1 ms │ 1 ms │ 7 ms  │ 12 ms │ 1.99 ms │ 12.13 ms │ 957 ms │
│ Req/Sec   │ 516     │ 516     │ 3,859   │ 6,935 │ 4,150.3 │ 1,857.37 │ 516     │
42k requests in 10.02s, 144 MB read</div>
<p>Từ 43 lên 4.150 request mỗi giây — khoảng 97 lần. CSDL giờ chỉ thấy một truy vấn mỗi ~10 giây thay vì 43 truy vấn mỗi giây.</p>
<div class="pitfall"><p><strong>Bẫy — khoá cache quên mất một thứ.</strong> Khoá phải chứa mọi thứ làm đổi câu trả lời: bộ lọc, người dùng hay tenant, phiên bản API, và một số phiên bản hình dạng (<code>stats:labs:v1</code> — đổi hình dạng thì đổi <code>v1</code> → <code>v2</code>, nếu không client cũ nhận hình dạng mới và ngược lại).</p></div>

<h3>Cú giẫm đạp (stampede)</h3>
<p>Cứ 10 giây khoá hết hạn một lần. Nếu 50 request tới đúng khe đó, request nào cũng trượt, và request nào cũng chạy truy vấn 100 ms. <code>perf/stampede.mjs</code> xoá khoá rồi bắn 50 request cùng lúc, sau đó đọc <code>LabFlow-DB-Queries</code> để đếm số truy vấn:</p>
<pre><code class="language-bash">node perf/stampede.mjs</code></pre>
<div class="out">50 request cùng lúc vào khoá vừa hết hạn ⇒ CSDL bị hỏi 50 lần · p50 994 ms · max 1661 ms</div>
<pre><code class="language-bash">node perf/stampede.mjs</code></pre>
<div class="out">50 request cùng lúc vào khoá vừa hết hạn ⇒ CSDL bị hỏi 32 lần · p50 346 ms · max 783 ms</div>
<p>Không cache: 50 truy vấn. Có Redis: vẫn <strong>32</strong> (một lần chạy trước là 16 — ai tới sau khi truy vấn đầu xong thì trúng; mọi người tới trước đều trượt). Cache không bảo vệ CSDL đúng vào lúc cần nhất. Cách sửa là <strong>single-flight</strong>: trong lúc một request đang nạp một khoá, các request khác chờ <em>chính promise đó</em> thay vì tự chạy:</p>
<pre><code class="language-javascript">if (!inflight.has(key)) inflight.set(key, fill().finally(() =&gt; inflight.delete(key)));
return inflight.get(key);   // 50 request cùng trượt ⇒ cùng chờ MỘT lần đọc CSDL</code></pre>
<pre><code class="language-bash">node perf/stampede.mjs</code></pre>
<div class="out">50 request cùng lúc vào khoá vừa hết hạn ⇒ CSDL bị hỏi 1 lần · p50 92 ms · max 97 ms</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Không cache · 50 truy vấn</span><span class="lz-lnote">p50 994 ms — các truy vấn xếp hàng chờ pool 10 kết nối</span></div>
  <div class="lz-layer"><span class="lz-lname">Redis cache-aside · 32 truy vấn</span><span class="lz-lnote">p50 346 ms — cú giẫm đạp</span></div>
  <div class="lz-layer"><span class="lz-lname">+ single-flight · 1 truy vấn</span><span class="lz-lnote">p50 92 ms — mọi người chờ chung một lần nạp</span></div>
</div>
<p>Single-flight chỉ sống trong một tiến trình: với 4 bản (8.4), một cú giẫm đạp vẫn có thể gây 4 truy vấn. Muốn hơn nữa thì giữ một khoá ngắn trong Redis (<code>SET lock:key 1 NX PX 2000</code>) để chỉ một bản nạp, hoặc làm mới khoá <em>trước</em> khi nó hết hạn. Các mẫu đó, có đo đạc, là bài 6.3 của khoá Redis.</p>
<a class="link-card" href="/courses/redis/learn?lessonSlug=rd-6-3-giam-dap" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Học sâu hơn: khoá Redis, bài 6.3 — giẫm đạp cache</span><span class="lc-sub">Cùng vấn đề nhìn từ phía Redis: khoá bằng SET NX, làm mới sớm theo xác suất, và mỗi cách tốn gì khi Redis khởi động lại. Bài này đứng ở API: client thấy gì và hợp đồng hứa gì.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/set/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: tài liệu Redis — SET với EX / PX / NX (đọc ngày 1/11/2026)</span><span class="lc-sub">SET key value EX giây lưu giá trị kèm hạn trong một lệnh nguyên tử; NX chỉ đặt khi khoá chưa tồn tại — viên gạch của một khoá đơn giản. LabFlow dùng node-redis 5.12 với Redis 8.2.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Hợp đồng phải nói gì</h3>
<ul>
  <li><strong>Độ tươi:</strong> “số liệu thống kê có thể cũ tới 10 giây”. Client cần biết thì gửi <code>Age</code> (9.1, 8.6).</li>
  <li><strong>Vô hiệu hoá:</strong> câu trả lời đã cache hoặc được làm mới theo TTL (đơn giản, độ cũ có giới hạn), hoặc bị xoá khi có lệnh ghi (tươi hơn, nhưng mọi đường ghi đều phải nhớ). Với số liệu gộp, TTL là lựa chọn trung thực.</li>
  <li><strong>Khi hỏng:</strong> cache là phần tối ưu. Redis sập thì endpoint phải lùi về CSDL, không trả 500 — bản 30 dòng của LabFlow chưa làm vậy (thực hành 2).</li>
</ul>

<h3>Khi phỏng vấn và khi đi làm</h3>
<ul>
  <li><strong>“Cache stampede là gì, chặn thế nào?”</strong> Nhiều request cùng trượt một khoá và cùng đổ vào CSDL. Single-flight trong mỗi bản (đo được 32 → 1 truy vấn), khoá hoặc làm mới sớm khi có nhiều bản, TTL có jitter.</li>
  <li><strong>“Cache-aside hay write-through?”</strong> Cache-aside cho dữ liệu đọc nhiều và chấp nhận cũ một chút; ghi độ cũ đó vào hợp đồng.</li>
</ul>

<h3>🧪 Thực hành (30–40 phút)</h3>
<div class="callout ok"><ol>
  <li>Chạy <code>perf/stampede.mjs</code> với <code>N=200</code> ở cả ba chế độ. Mỗi chế độ tốn bao nhiêu truy vấn?</li>
  <li>Tắt Redis (<code>redis-cli -p 6390 shutdown nosave</code>) rồi gọi endpoint. Sau đó sửa <code>cached()</code> để lỗi Redis thì lùi về <code>load()</code>.</li>
  <li>Thêm <code>Age</code> cho lần trúng (lưu thời điểm nạp cạnh giá trị).</li>
</ol>
<p><strong>Xong khi:</strong> endpoint sống sót khi Redis sập và vẫn trả lời dưới 200 ms.</p></div>

<h3>🗂 Thuật ngữ chính</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cache-aside</span><span class="v">Đọc cache; trượt thì nạp từ CSDL rồi lưu vào.</span></div>
  <div class="kv"><span class="k">TTL</span><span class="v">Giá trị cache sống bao lâu trước khi hết hạn.</span></div>
  <div class="kv"><span class="k">Jitter</span><span class="v">Phần ngẫu nhiên cộng vào TTL để các khoá không hết hạn cùng lúc.</span></div>
  <div class="kv"><span class="k">Cache stampede (giẫm đạp)</span><span class="v">Nhiều request cùng trượt một khoá và cùng nạp nó.</span></div>
  <div class="kv"><span class="k">Single-flight</span><span class="v">Các lần trượt đồng thời dùng chung một lần nạp.</span></div>
  <div class="kv"><span class="k">Độ cũ có giới hạn</span><span class="v">“Cũ tối đa N giây” — một lời hứa viết ra được.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Truy vấn gộp trên 1 triệu dòng tốn 80–120 ms; trúng Redis 1,3 ms; tải đều 43 → 4.150 req/s.</li>
  <li>Khoá hết hạn giữa 50 request đồng thời: 50 truy vấn khi không cache, 16–32 với cache-aside thường, 1 với single-flight.</li>
  <li>Khoá = mọi thứ làm đổi câu trả lời + số phiên bản hình dạng; TTL có jitter.</li>
  <li>Hợp đồng nói câu trả lời được cũ tới đâu; cache hỏng thì phải lùi về CSDL.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-12-2-cache-aside" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Áp vào Node.js — bài 12.2: cache-aside và bốn lần nó phản chủ</span><span class="lc-sub">Trên 500.000 ghi chú PostgreSQL 17: bảng xếp hạng 58,34 ms phục vụ trong 0,41 ms (143,5×), danh sách 1,6 MB nơi cache CHẬM hơn CSDL 13%, trúng 90% = 6,73 ms vs 99% = 0,93 ms, và 200 request cùng lúc = 200 truy vấn (4.178 ms) → 1 với single-flight (69,1 ms).</span></span>
  <span class="lc-cta">MỞ BÀI NODE.JS →</span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 9.3 ─────────────────────────── */
    {
      title: '9.3 — Read-after-write in the API contract: replicas and stale reads|||9.3 — Đọc-sau-ghi trong hợp đồng API: bản sao đọc và dữ liệu cũ',
      slug: 'api-9-2-db-doc',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Replica PostgreSQL streaming thật (trễ áp dụng 2 giây): ghi chú vừa ghi là 404 trên replica; migration cũng trễ; ba cách sửa; token LSN LabFlow-Consistency: đọc primary khi replica còn chậm, về replica khi đã kịp.',
      content: `${G093}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>Read-after-write in the API contract: replicas and stale reads</h2>
<p class="lead">When reads outgrow one database, the usual next step is a <strong>read replica</strong>: a copy that follows the primary and answers SELECTs. It works — until Ms Lan posts a note, the app reloads, and her note is not there. Nothing is broken; the copy is a moment behind. This lesson builds a real PostgreSQL replica, measures the gap, and fixes the user’s experience in the <em>contract</em>.</p>

<h3>A real primary and a real replica</h3>
<p>The private PostgreSQL 18 from Chapter 3 (port 55432) gets a streaming replica on port 55433, built with <code>pg_basebackup</code>. To make the lag visible on one laptop, the replica waits 2 seconds before applying each commit (<code>recovery_min_apply_delay</code>; in production lag is usually milliseconds, and seconds under load or during a long query):</p>
<pre><code class="language-bash">pg_basebackup -h localhost -p 55432 -U labflow -D pgreplica -R -X stream   # -R: tự ghi cấu hình để theo primary
echo "recovery_min_apply_delay = '2s'" &gt;&gt; pgreplica/postgresql.auto.conf    # CHỈ để học: trễ 2 giây cho thấy rõ
pg_ctl -D pgreplica -l pgreplica.log -o "-p 55433 -c unix_socket_directories=''" start</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">POST note</span><span class="lz-t">primary :55432</span><span class="lz-d">INSERT, commit, WAL position 0/12025328</span></div>
  <div class="lz-step"><span class="lz-k">WAL stream</span><span class="lz-t">to the replica</span><span class="lz-d">arrives at once, applied after the delay</span></div>
  <div class="lz-step"><span class="lz-k">GET note</span><span class="lz-t">replica :55433</span><span class="lz-d">not applied yet ⇒ “not found”</span></div>
</div>

<h3>Lab notes: write to the primary, read from the replica</h3>
<p>A new LabFlow feature (only with <code>LABFLOW_PG=1</code>): lab managers post notes for a lab (“the IoT lab is closed on Friday afternoon”), everyone reads them. Writes go to the primary, reads to the replica — the standard split:</p>
<pre><code class="language-javascript">// routes/notes.js — bài 9.3: ghi chú của phòng lab trong PostgreSQL có BẢN SAO ĐỌC (replica)
//   ghi ⇒ primary (PGURL)  ·  đọc ⇒ replica (PG_REPLICA_URL), trừ khi client cần "đọc thấy cái mình vừa ghi"
//   LABFLOW_READS = replica (đọc luôn ở replica) | token (tôn trọng header LabFlow-Consistency)
import { Router } from 'express';
import { z } from 'zod';
import pg from 'pg';
import { HttpError, onlyAllow } from '../http.js';
import { requireAuth, requireRole } from '../auth.js';
import { validate } from '../validate.js';
import { ddlOnce } from '../pg-ddl.js';                     // bài 8.4: tạo bảng dưới khoá advisory

const primary = new pg.Pool({ connectionString: process.env.PGURL ?? 'postgres://labflow@localhost:55432/labflow', max: 5 });
const replica = new pg.Pool({ connectionString: process.env.PG_REPLICA_URL ?? 'postgres://labflow@localhost:55433/labflow', max: 5 });
await ddlOnce(primary, &#96;CREATE TABLE IF NOT EXISTS lab_notes (id bigserial PRIMARY KEY, lab_id text NOT NULL,
  author text NOT NULL, body text NOT NULL, created_at timestamptz NOT NULL DEFAULT now())&#96;);
const MODE = process.env.LABFLOW_READS ?? 'replica';
const view = (r) =&gt; ({ id: &#96;note_\${r.id}&#96;, labId: r.lab_id, author: r.author, body: r.body, createdAt: r.created_at.toISOString() });

// Chọn nơi đọc: có token (vị trí WAL lúc ghi) ⇒ chờ replica đuổi kịp tối đa 300 ms, không kịp thì đọc primary
async function readPool(req, res) {
  const token = req.get('LabFlow-Consistency');
  if (MODE !== 'token' || !token) { res.set('LabFlow-Read-From', 'replica'); return replica; }
  if (!/^[0-9A-F]{1,8}\\/[0-9A-F]{1,8}$/i.test(token)) throw new HttpError(400, 'VALIDATION_FAILED', { header: 'LabFlow-Consistency' });
  const t0 = performance.now();
  while (performance.now() - t0 &lt; 300) {
    const { rows: [r] } = await replica.query('SELECT pg_last_wal_replay_lsn() &gt;= $1::pg_lsn AS ok', [token]);
    if (r.ok) { req.timing.add('wait', performance.now() - t0); res.set('LabFlow-Read-From', 'replica'); return replica; }
    await new Promise((ok) =&gt; setTimeout(ok, 20));
  }
  req.timing.add('wait', performance.now() - t0);
  res.set('LabFlow-Read-From', 'primary');                      // replica chậm quá ngân sách ⇒ đọc bản gốc
  return primary;
}

const NoteCreate = z.strictObject({ body: z.string().trim().min(1).max(500) });
export const labNotesRouter = Router({ mergeParams: true });
labNotesRouter.route('/')
  .get(async (req, res) =&gt; {
    const db = await readPool(req, res);
    const { rows } = await db.query('SELECT * FROM lab_notes WHERE lab_id = $1 ORDER BY id DESC LIMIT 20', [req.params.labId]);
    res.json({ data: rows.map(view) });
  })
  .post(requireAuth, requireRole('LAB_MANAGER'), validate('body', NoteCreate), async (req, res) =&gt; {
    const { rows: [r] } = await primary.query('INSERT INTO lab_notes (lab_id, author, body) VALUES ($1, $2, $3) RETURNING *',
      [req.params.labId, req.user.name, req.valid.body.body]);
    const { rows: [w] } = await primary.query('SELECT pg_current_wal_lsn()::text AS lsn');
    res.status(201).location(&#96;/v2/notes/note_\${r.id}&#96;)
      .set('LabFlow-Consistency', w.lsn)                         // "dữ liệu của bạn có ở vị trí WAL này" — gửi lại khi đọc
      .json(view(r));                                            // trả LUÔN bản ghi vừa tạo: client không cần đọc lại
  })
  .all(onlyAllow('GET', 'POST'));

export const notesRouter = Router();
notesRouter.route('/:id')
  .get(async (req, res) =&gt; {
    const id = /^note_(\\d+)$/.exec(req.params.id)?.[1];
    if (!id) throw new HttpError(404, 'NOTE_NOT_FOUND', { id: req.params.id });
    const db = await readPool(req, res);
    const { rows: [r] } = await db.query('SELECT * FROM lab_notes WHERE id = $1', [id]);
    if (!r) throw new HttpError(404, 'NOTE_NOT_FOUND', { id: req.params.id });
    res.json(view(r));
  })
  .all(onlyAllow('GET'));</code></pre>
<pre><code class="language-javascript">// messages.js — mã lỗi mới (vi rồi en)
    NOTE_NOT_FOUND: ['Không tìm thấy ghi chú', (p) =&gt; &#96;Không có ghi chú \${p.id}&#96;],
    NOTE_NOT_FOUND: ['Note not found', (p) =&gt; &#96;There is no note \${p.id}&#96;],</code></pre>
<pre><code class="language-bash">curl -s -D hdrn.txt http://localhost:4000/v2/labs/lab_2/notes \\
  -H "Authorization: Bearer $(cat lan.jwt)" \\
  --json '{"body":"Phòng IoT đóng cửa chiều thứ Sáu"}' | tee note.json | jq -c .</code></pre>
<div class="out">{"id":"note_2","labId":"lab_2","author":"Cô Lan","body":"Phòng IoT đóng cửa chiều thứ Sáu","createdAt":"2026-11-01T00:15:55.333Z"}</div>
<pre><code class="language-bash">grep -iE '^(HTTP|location|labflow-consistency)' hdrn.txt | tr -d '\\r'</code></pre>
<div class="out">HTTP/1.1 201 Created
Location: /v2/notes/note_2
LabFlow-Consistency: 0/12025328</div>
<pre><code class="language-bash">curl -s -i http://localhost:4000/v2/notes/$(jq -r .id note.json) | grep -iE '^(HTTP|labflow-read-from)|"code"' | tr \\
  -d '\\r'</code></pre>
<div class="out">HTTP/1.1 404 Not Found
LabFlow-Read-From: replica
  "code": "NOTE_NOT_FOUND"</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v2/labs/lab_2/notes | jq -c '[.data[].id]'</code></pre>
<div class="out">[]</div>
<pre><code class="language-bash">sleep 2.5; curl -s -o /dev/null -w '%{http_code}\\n' http://localhost:4000/v2/notes/$(jq -r .id note.json)</code></pre>
<div class="out">200</div>
<p>The POST succeeded and returned the note. Immediately afterwards, <code>GET /v2/notes/note_2</code> answered <strong>404</strong> and the lab’s list was <strong>empty</strong> — both served by the replica. 2.5 s later the same GET is 200. For Lan the app looks broken: “I saved it and it vanished.”</p>
<pre><code class="language-bash">psql -h localhost -p 55432 -U labflow -d labflow -Atc "SELECT 'primary', pg_current_wal_lsn()"; psql -h localhost -p 55433 -U labflow -d labflow -Atc "SELECT 'replica', pg_last_wal_replay_lsn(), round(extract(epoch FROM now() - pg_last_xact_replay_timestamp())::numeric, 1) || ' s since last replayed commit'"</code></pre>
<div class="out">primary|0/12025360
replica|0/12025360|2.6 s since last replayed commit</div>
<p>The two LSNs (positions in the write-ahead log) are equal now, and the replica says its last replayed commit was 2.6 s ago — the delay we set. In production you watch exactly these numbers.</p>
<div class="pitfall"><p><strong>Trap — migrations lag too.</strong> The first time LabFlow started, it created the <code>lab_notes</code> table on the primary, and a read 1 s later hit the replica before the table existed there: <code>500</code>, “relation does not exist”. Deploy schema changes, wait for replicas to catch up, <em>then</em> ship code that reads the new table from them.</p></div>

<h3>Three fixes, in order of cost</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · Return the result of the write</span><span class="lz-lnote">201 + the full note in the body (LabFlow already does this, 1.3): the app shows it without reading again</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · Read your own writes from the primary</span><span class="lz-lnote">for a few seconds after a write, send THIS user’s reads to the primary (session flag, cookie)</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · A consistency token in the contract</span><span class="lz-lnote">the write returns its WAL position; the client sends it back; the server reads a replica only once it has caught up</span></div>
</div>
<p>Fix 1 covers the screen that made the write. Fix 3 covers the next screens and other devices of the same user, without sending every read to the primary. LabFlow implements it with one header, <code>LabFlow-Consistency</code>: the POST answers <code>pg_current_wal_lsn()</code>; a GET that carries it waits up to 300 ms for <code>pg_last_wal_replay_lsn() &gt;= token</code> on the replica, and reads the primary if the replica is still behind (see <code>readPool()</code> above). With <code>LABFLOW_READS=token</code>:</p>
<pre><code class="language-bash">curl -s -D hdrn.txt http://localhost:4000/v2/labs/lab_2/notes \\
  -H "Authorization: Bearer $(cat lan.jwt)" \\
  --json '{"body":"Đã thay quạt máy 07"}' -o note.json; grep -i '^labflow-consistency' hdrn.txt | tr \\
  -d '\\r'</code></pre>
<div class="out">LabFlow-Consistency: 0/12025438</div>
<pre><code class="language-bash">curl -s -D - -o /dev/null http://localhost:4000/v2/notes/$(jq -r .id note.json) \\
  -H "LabFlow-Consistency: $(grep -i '^labflow-consistency' hdrn.txt | cut -d' ' -f2 | tr \\
  -d '\\r')" | grep -iE '^(HTTP|labflow-read-from|server-timing)' | tr \\
  -d '\\r'</code></pre>
<div class="out">HTTP/1.1 200 OK
LabFlow-Read-From: primary
Server-Timing: wait;dur=318.29, total;dur=320.23</div>
<pre><code class="language-bash">sleep 2.5; curl -s -D - -o /dev/null http://localhost:4000/v2/notes/$(jq -r .id note.json) -H "LabFlow-Consistency: $(grep -i '^labflow-consistency' hdrn.txt | cut -d' ' -f2 | tr -d '\\r')" | grep -iE '^(HTTP|labflow-read-from|server-timing)' | tr -d '\\r'</code></pre>
<div class="out">HTTP/1.1 200 OK
LabFlow-Read-From: replica
Server-Timing: wait;dur=0.43, total;dur=1.60</div>
<ul>
  <li>Right after the write: the replica was 2 s behind, so after the 300 ms budget the read went to the <strong>primary</strong> — 200, the note is there.</li>
  <li>2.5 s later, same token: the replica has caught up, the read stays on the <strong>replica</strong> after 0.4 ms of checking.</li>
  <li>Clients without the header (other students) read the replica as before — they may see the note a moment later, which is fine.</li>
</ul>
<a class="link-card" href="https://www.postgresql.org/docs/18/functions-admin.html#FUNCTIONS-RECOVERY-INFO-TABLE" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: PostgreSQL 18 docs — recovery information functions and recovery_min_apply_delay (read 1 Nov 2026)</span><span class="lc-sub">pg_current_wal_lsn() on the primary, pg_last_wal_replay_lsn() and pg_last_xact_replay_timestamp() on a standby; recovery_min_apply_delay delays applying commits on a standby — the setting used here to make lag visible.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>
<a class="link-card" href="/courses/postgresql/learn?lessonSlug=postgresql-15-3-nhan-ban" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Go deeper: PostgreSQL course, lesson 15.3 — replication</span><span class="lc-sub">How streaming replication works, synchronous vs asynchronous standbys, failover. This lesson only uses a replica; there you operate one.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>What the contract says</h3>
<ul>
  <li>Reads are <strong>eventually consistent</strong>: a new note may take a moment to appear for other users.</li>
  <li>After a write, a client that needs to see it sends <code>LabFlow-Consistency</code> from the write’s response; such a read may be slower (up to 300 ms) but never older than the write.</li>
  <li>Responses say where they came from only for learning (<code>LabFlow-Read-From</code>); production would keep that internal.</li>
</ul>

<h3>In interviews and at work</h3>
<ul>
  <li><strong>“A user saves something and does not see it.”</strong> First suspect a read replica (or a cache). Measure lag (LSNs, replay timestamp), then fix the contract: return the write’s result, read-your-writes, or a consistency token.</li>
  <li><strong>“Why not read everything from the primary?”</strong> Then the replica buys nothing; route only the reads that need freshness.</li>
</ul>

<h3>🧪 Practice (30–40 min)</h3>
<div class="callout ok"><ol>
  <li>Set <code>recovery_min_apply_delay</code> to 0, reload the replica, and repeat the write-then-read 20 times. How often is the read still 404?</li>
  <li>Implement fix 2: after a POST, set a short-lived signed cookie; reads with that cookie go to the primary for 5 s.</li>
  <li>Make the 300 ms budget configurable and measure what a 50 ms budget does right after a write.</li>
</ol>
<p><strong>Done when:</strong> you can show, with one request each, a stale read, a token read from the primary, and a token read from the replica.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Read replica</span><span class="v">A copy of the database that follows the primary and serves reads.</span></div>
  <div class="kv"><span class="k">Replication lag</span><span class="v">How far the replica is behind the primary.</span></div>
  <div class="kv"><span class="k">LSN</span><span class="v">A position in PostgreSQL’s write-ahead log, e.g. 0/12025328.</span></div>
  <div class="kv"><span class="k">Eventual consistency</span><span class="v">Every reader sees the write — eventually, not immediately.</span></div>
  <div class="kv"><span class="k">Read-your-writes</span><span class="v">A user always sees their own writes, even if others see them later.</span></div>
  <div class="kv"><span class="k">Consistency token</span><span class="v">A value from a write that a later read sends to demand at least that version.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>A real streaming replica with a 2 s apply delay: the note just written was 404 on the replica and appeared 2.5 s later.</li>
  <li>Schema changes lag too: reading a new table from a replica too early gave 500.</li>
  <li>Fixes: return the written resource; read-your-writes on the primary; or a consistency token (LSN) honoured by reads.</li>
  <li>Measured: with the token, the read went to the primary while the replica lagged and back to the replica (0.4 ms check) once it caught up.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3</span>
<h2>Đọc-sau-ghi trong hợp đồng API: bản sao đọc và dữ liệu cũ</h2>
<p class="lead">Khi lượng đọc vượt sức một CSDL, bước tiếp theo quen thuộc là một <strong>bản sao đọc</strong> (read replica): một bản chép bám theo primary và trả lời các câu SELECT. Nó chạy tốt — cho tới khi cô Lan đăng một ghi chú, app tải lại, và ghi chú không có ở đó. Không có gì hỏng; bản sao chỉ chậm một chút. Bài này dựng một replica PostgreSQL thật, đo khoảng chậm, và sửa trải nghiệm của người dùng ngay trong <em>hợp đồng</em>.</p>

<h3>Một primary thật và một replica thật</h3>
<p>PostgreSQL 18 riêng của Chương 3 (cổng 55432) có thêm một replica streaming ở cổng 55433, dựng bằng <code>pg_basebackup</code>. Để thấy rõ độ trễ trên một laptop, replica chờ 2 giây trước khi áp dụng mỗi commit (<code>recovery_min_apply_delay</code>; ở production độ trễ thường là mili giây, và lên tới vài giây khi tải nặng hay có truy vấn dài):</p>
<pre><code class="language-bash">pg_basebackup -h localhost -p 55432 -U labflow -D pgreplica -R -X stream   # -R: tự ghi cấu hình để theo primary
echo "recovery_min_apply_delay = '2s'" &gt;&gt; pgreplica/postgresql.auto.conf    # CHỈ để học: trễ 2 giây cho thấy rõ
pg_ctl -D pgreplica -l pgreplica.log -o "-p 55433 -c unix_socket_directories=''" start</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">POST ghi chú</span><span class="lz-t">primary :55432</span><span class="lz-d">INSERT, commit, vị trí WAL 0/12025328</span></div>
  <div class="lz-step"><span class="lz-k">luồng WAL</span><span class="lz-t">tới replica</span><span class="lz-d">tới ngay, áp dụng sau khoảng trễ</span></div>
  <div class="lz-step"><span class="lz-k">GET ghi chú</span><span class="lz-t">replica :55433</span><span class="lz-d">chưa áp dụng ⇒ “không tìm thấy”</span></div>
</div>

<h3>Ghi chú phòng lab: ghi vào primary, đọc từ replica</h3>
<p>Một tính năng mới của LabFlow (chỉ khi <code>LABFLOW_PG=1</code>): quản lý phòng đăng ghi chú cho một phòng (“phòng IoT đóng cửa chiều thứ Sáu”), mọi người đọc. Ghi đi vào primary, đọc đi vào replica — cách chia chuẩn:</p>
<pre><code class="language-javascript">// routes/notes.js — bài 9.3: ghi chú của phòng lab trong PostgreSQL có BẢN SAO ĐỌC (replica)
//   ghi ⇒ primary (PGURL)  ·  đọc ⇒ replica (PG_REPLICA_URL), trừ khi client cần "đọc thấy cái mình vừa ghi"
//   LABFLOW_READS = replica (đọc luôn ở replica) | token (tôn trọng header LabFlow-Consistency)
import { Router } from 'express';
import { z } from 'zod';
import pg from 'pg';
import { HttpError, onlyAllow } from '../http.js';
import { requireAuth, requireRole } from '../auth.js';
import { validate } from '../validate.js';
import { ddlOnce } from '../pg-ddl.js';                     // bài 8.4: tạo bảng dưới khoá advisory

const primary = new pg.Pool({ connectionString: process.env.PGURL ?? 'postgres://labflow@localhost:55432/labflow', max: 5 });
const replica = new pg.Pool({ connectionString: process.env.PG_REPLICA_URL ?? 'postgres://labflow@localhost:55433/labflow', max: 5 });
await ddlOnce(primary, &#96;CREATE TABLE IF NOT EXISTS lab_notes (id bigserial PRIMARY KEY, lab_id text NOT NULL,
  author text NOT NULL, body text NOT NULL, created_at timestamptz NOT NULL DEFAULT now())&#96;);
const MODE = process.env.LABFLOW_READS ?? 'replica';
const view = (r) =&gt; ({ id: &#96;note_\${r.id}&#96;, labId: r.lab_id, author: r.author, body: r.body, createdAt: r.created_at.toISOString() });

// Chọn nơi đọc: có token (vị trí WAL lúc ghi) ⇒ chờ replica đuổi kịp tối đa 300 ms, không kịp thì đọc primary
async function readPool(req, res) {
  const token = req.get('LabFlow-Consistency');
  if (MODE !== 'token' || !token) { res.set('LabFlow-Read-From', 'replica'); return replica; }
  if (!/^[0-9A-F]{1,8}\\/[0-9A-F]{1,8}$/i.test(token)) throw new HttpError(400, 'VALIDATION_FAILED', { header: 'LabFlow-Consistency' });
  const t0 = performance.now();
  while (performance.now() - t0 &lt; 300) {
    const { rows: [r] } = await replica.query('SELECT pg_last_wal_replay_lsn() &gt;= $1::pg_lsn AS ok', [token]);
    if (r.ok) { req.timing.add('wait', performance.now() - t0); res.set('LabFlow-Read-From', 'replica'); return replica; }
    await new Promise((ok) =&gt; setTimeout(ok, 20));
  }
  req.timing.add('wait', performance.now() - t0);
  res.set('LabFlow-Read-From', 'primary');                      // replica chậm quá ngân sách ⇒ đọc bản gốc
  return primary;
}

const NoteCreate = z.strictObject({ body: z.string().trim().min(1).max(500) });
export const labNotesRouter = Router({ mergeParams: true });
labNotesRouter.route('/')
  .get(async (req, res) =&gt; {
    const db = await readPool(req, res);
    const { rows } = await db.query('SELECT * FROM lab_notes WHERE lab_id = $1 ORDER BY id DESC LIMIT 20', [req.params.labId]);
    res.json({ data: rows.map(view) });
  })
  .post(requireAuth, requireRole('LAB_MANAGER'), validate('body', NoteCreate), async (req, res) =&gt; {
    const { rows: [r] } = await primary.query('INSERT INTO lab_notes (lab_id, author, body) VALUES ($1, $2, $3) RETURNING *',
      [req.params.labId, req.user.name, req.valid.body.body]);
    const { rows: [w] } = await primary.query('SELECT pg_current_wal_lsn()::text AS lsn');
    res.status(201).location(&#96;/v2/notes/note_\${r.id}&#96;)
      .set('LabFlow-Consistency', w.lsn)                         // "dữ liệu của bạn có ở vị trí WAL này" — gửi lại khi đọc
      .json(view(r));                                            // trả LUÔN bản ghi vừa tạo: client không cần đọc lại
  })
  .all(onlyAllow('GET', 'POST'));

export const notesRouter = Router();
notesRouter.route('/:id')
  .get(async (req, res) =&gt; {
    const id = /^note_(\\d+)$/.exec(req.params.id)?.[1];
    if (!id) throw new HttpError(404, 'NOTE_NOT_FOUND', { id: req.params.id });
    const db = await readPool(req, res);
    const { rows: [r] } = await db.query('SELECT * FROM lab_notes WHERE id = $1', [id]);
    if (!r) throw new HttpError(404, 'NOTE_NOT_FOUND', { id: req.params.id });
    res.json(view(r));
  })
  .all(onlyAllow('GET'));</code></pre>
<pre><code class="language-javascript">// messages.js — mã lỗi mới (vi rồi en)
    NOTE_NOT_FOUND: ['Không tìm thấy ghi chú', (p) =&gt; &#96;Không có ghi chú \${p.id}&#96;],
    NOTE_NOT_FOUND: ['Note not found', (p) =&gt; &#96;There is no note \${p.id}&#96;],</code></pre>
<pre><code class="language-bash">curl -s -D hdrn.txt http://localhost:4000/v2/labs/lab_2/notes \\
  -H "Authorization: Bearer $(cat lan.jwt)" \\
  --json '{"body":"Phòng IoT đóng cửa chiều thứ Sáu"}' | tee note.json | jq -c .</code></pre>
<div class="out">{"id":"note_2","labId":"lab_2","author":"Cô Lan","body":"Phòng IoT đóng cửa chiều thứ Sáu","createdAt":"2026-11-01T00:15:55.333Z"}</div>
<pre><code class="language-bash">grep -iE '^(HTTP|location|labflow-consistency)' hdrn.txt | tr -d '\\r'</code></pre>
<div class="out">HTTP/1.1 201 Created
Location: /v2/notes/note_2
LabFlow-Consistency: 0/12025328</div>
<pre><code class="language-bash">curl -s -i http://localhost:4000/v2/notes/$(jq -r .id note.json) | grep -iE '^(HTTP|labflow-read-from)|"code"' | tr \\
  -d '\\r'</code></pre>
<div class="out">HTTP/1.1 404 Not Found
LabFlow-Read-From: replica
  "code": "NOTE_NOT_FOUND"</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v2/labs/lab_2/notes | jq -c '[.data[].id]'</code></pre>
<div class="out">[]</div>
<pre><code class="language-bash">sleep 2.5; curl -s -o /dev/null -w '%{http_code}\\n' http://localhost:4000/v2/notes/$(jq -r .id note.json)</code></pre>
<div class="out">200</div>
<p>POST thành công và trả về ghi chú. Ngay sau đó, <code>GET /v2/notes/note_2</code> trả <strong>404</strong> và danh sách của phòng <strong>rỗng</strong> — cả hai do replica trả lời. 2,5 giây sau, cùng lệnh GET ra 200. Với cô Lan, app trông như hỏng: “tôi lưu rồi mà nó biến mất.”</p>
<pre><code class="language-bash">psql -h localhost -p 55432 -U labflow -d labflow -Atc "SELECT 'primary', pg_current_wal_lsn()"; psql -h localhost -p 55433 -U labflow -d labflow -Atc "SELECT 'replica', pg_last_wal_replay_lsn(), round(extract(epoch FROM now() - pg_last_xact_replay_timestamp())::numeric, 1) || ' s since last replayed commit'"</code></pre>
<div class="out">primary|0/12025360
replica|0/12025360|2.6 s since last replayed commit</div>
<p>Hai LSN (vị trí trong nhật ký ghi trước — write-ahead log) giờ đã bằng nhau, và replica cho biết commit cuối nó áp dụng là 2,6 giây trước — đúng khoảng trễ đã đặt. Ở production người ta theo dõi đúng những con số này.</p>
<div class="pitfall"><p><strong>Bẫy — migration cũng bị trễ.</strong> Lần đầu LabFlow khởi động, nó tạo bảng <code>lab_notes</code> trên primary, và một lần đọc 1 giây sau rơi vào replica trước khi bảng có ở đó: <code>500</code>, “relation does not exist”. Triển khai thay đổi lược đồ, chờ replica đuổi kịp, <em>rồi</em> mới đưa code đọc bảng mới từ chúng.</p></div>

<h3>Ba cách sửa, theo chi phí tăng dần</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · Trả kết quả của lệnh ghi</span><span class="lz-lnote">201 + toàn bộ ghi chú trong body (LabFlow đã làm vậy, 1.3): app hiện luôn, không cần đọc lại</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · Đọc cái mình vừa ghi từ primary</span><span class="lz-lnote">vài giây sau một lệnh ghi, gửi các lần đọc của CHÍNH người này về primary (cờ phiên, cookie)</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · Token nhất quán trong hợp đồng</span><span class="lz-lnote">lệnh ghi trả vị trí WAL; client gửi lại; server chỉ đọc replica khi nó đã đuổi kịp</span></div>
</div>
<p>Cách 1 lo được màn hình vừa ghi. Cách 3 lo cả các màn hình sau và thiết bị khác của cùng người dùng, mà không đẩy mọi lần đọc về primary. LabFlow làm nó bằng một header, <code>LabFlow-Consistency</code>: POST trả <code>pg_current_wal_lsn()</code>; GET có mang header đó thì chờ tối đa 300 ms cho tới khi <code>pg_last_wal_replay_lsn() &gt;= token</code> trên replica, và đọc primary nếu replica vẫn còn chậm (xem <code>readPool()</code> ở trên). Với <code>LABFLOW_READS=token</code>:</p>
<pre><code class="language-bash">curl -s -D hdrn.txt http://localhost:4000/v2/labs/lab_2/notes \\
  -H "Authorization: Bearer $(cat lan.jwt)" \\
  --json '{"body":"Đã thay quạt máy 07"}' -o note.json; grep -i '^labflow-consistency' hdrn.txt | tr \\
  -d '\\r'</code></pre>
<div class="out">LabFlow-Consistency: 0/12025438</div>
<pre><code class="language-bash">curl -s -D - -o /dev/null http://localhost:4000/v2/notes/$(jq -r .id note.json) \\
  -H "LabFlow-Consistency: $(grep -i '^labflow-consistency' hdrn.txt | cut -d' ' -f2 | tr \\
  -d '\\r')" | grep -iE '^(HTTP|labflow-read-from|server-timing)' | tr \\
  -d '\\r'</code></pre>
<div class="out">HTTP/1.1 200 OK
LabFlow-Read-From: primary
Server-Timing: wait;dur=318.29, total;dur=320.23</div>
<pre><code class="language-bash">sleep 2.5; curl -s -D - -o /dev/null http://localhost:4000/v2/notes/$(jq -r .id note.json) -H "LabFlow-Consistency: $(grep -i '^labflow-consistency' hdrn.txt | cut -d' ' -f2 | tr -d '\\r')" | grep -iE '^(HTTP|labflow-read-from|server-timing)' | tr -d '\\r'</code></pre>
<div class="out">HTTP/1.1 200 OK
LabFlow-Read-From: replica
Server-Timing: wait;dur=0.43, total;dur=1.60</div>
<ul>
  <li>Ngay sau lệnh ghi: replica chậm 2 giây, nên hết ngân sách 300 ms thì lần đọc đi về <strong>primary</strong> — 200, ghi chú có ở đó.</li>
  <li>2,5 giây sau, cùng token: replica đã đuổi kịp, lần đọc ở lại <strong>replica</strong> sau 0,4 ms kiểm tra.</li>
  <li>Client không gửi header (các sinh viên khác) vẫn đọc replica như cũ — họ có thể thấy ghi chú muộn một chút, điều đó ổn.</li>
</ul>
<a class="link-card" href="https://www.postgresql.org/docs/18/functions-admin.html#FUNCTIONS-RECOVERY-INFO-TABLE" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: tài liệu PostgreSQL 18 — các hàm thông tin phục hồi và recovery_min_apply_delay (đọc ngày 1/11/2026)</span><span class="lc-sub">pg_current_wal_lsn() trên primary, pg_last_wal_replay_lsn() và pg_last_xact_replay_timestamp() trên standby; recovery_min_apply_delay làm standby trễ việc áp dụng commit — chính thiết lập dùng ở đây để thấy rõ độ trễ.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<a class="link-card" href="/courses/postgresql/learn?lessonSlug=postgresql-15-3-nhan-ban" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Học sâu hơn: khoá PostgreSQL, bài 15.3 — nhân bản</span><span class="lc-sub">Streaming replication chạy thế nào, standby đồng bộ và bất đồng bộ, chuyển dự phòng. Bài này chỉ dùng một replica; ở đó bạn vận hành nó.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Hợp đồng nói gì</h3>
<ul>
  <li>Đọc là <strong>nhất quán cuối cùng</strong> (eventually consistent): ghi chú mới có thể cần một lúc mới hiện với người khác.</li>
  <li>Sau một lệnh ghi, client cần thấy nó thì gửi <code>LabFlow-Consistency</code> lấy từ response của lệnh ghi; lần đọc đó có thể chậm hơn (tới 300 ms) nhưng không bao giờ cũ hơn lệnh ghi.</li>
  <li>Response nói nó đến từ đâu (<code>LabFlow-Read-From</code>) chỉ để học; production giữ điều đó ở nội bộ.</li>
</ul>

<h3>Khi phỏng vấn và khi đi làm</h3>
<ul>
  <li><strong>“Người dùng lưu xong mà không thấy.”</strong> Nghi bản sao đọc (hoặc cache) trước. Đo độ trễ (LSN, thời điểm áp dụng), rồi sửa hợp đồng: trả kết quả lệnh ghi, đọc-cái-mình-ghi, hoặc token nhất quán.</li>
  <li><strong>“Sao không đọc hết từ primary?”</strong> Thì replica chẳng mua được gì; chỉ chuyển những lần đọc cần độ tươi.</li>
</ul>

<h3>🧪 Thực hành (30–40 phút)</h3>
<div class="callout ok"><ol>
  <li>Đặt <code>recovery_min_apply_delay</code> về 0, nạp lại replica, rồi lặp ghi-rồi-đọc 20 lần. Bao nhiêu lần vẫn 404?</li>
  <li>Làm cách 2: sau POST, đặt một cookie có ký, sống ngắn; lần đọc mang cookie đó đi về primary trong 5 giây.</li>
  <li>Cho ngân sách 300 ms cấu hình được và đo xem 50 ms làm gì ngay sau một lệnh ghi.</li>
</ol>
<p><strong>Xong khi:</strong> bạn cho thấy được, mỗi thứ bằng một request: một lần đọc cũ, một lần đọc có token từ primary, và một lần đọc có token từ replica.</p></div>

<h3>🗂 Thuật ngữ chính</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Read replica (bản sao đọc)</span><span class="v">Bản chép CSDL bám theo primary và phục vụ đọc.</span></div>
  <div class="kv"><span class="k">Độ trễ nhân bản</span><span class="v">Replica chậm hơn primary bao xa.</span></div>
  <div class="kv"><span class="k">LSN</span><span class="v">Một vị trí trong nhật ký WAL của PostgreSQL, vd 0/12025328.</span></div>
  <div class="kv"><span class="k">Nhất quán cuối cùng</span><span class="v">Ai rồi cũng thấy lệnh ghi — sau một lúc, không phải ngay.</span></div>
  <div class="kv"><span class="k">Read-your-writes</span><span class="v">Người dùng luôn thấy cái mình vừa ghi, dù người khác thấy muộn hơn.</span></div>
  <div class="kv"><span class="k">Token nhất quán</span><span class="v">Giá trị từ lệnh ghi mà lần đọc sau gửi lại để đòi ít nhất phiên bản đó.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Replica streaming thật với trễ áp dụng 2 giây: ghi chú vừa ghi là 404 trên replica và xuất hiện sau 2,5 giây.</li>
  <li>Thay đổi lược đồ cũng trễ: đọc bảng mới từ replica quá sớm ra 500.</li>
  <li>Cách sửa: trả tài nguyên vừa ghi; đọc-cái-mình-ghi ở primary; hoặc token nhất quán (LSN) được lần đọc tôn trọng.</li>
  <li>Đo được: có token, lần đọc đi về primary khi replica còn chậm, và quay lại replica (kiểm 0,4 ms) khi nó đã đuổi kịp.</li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── 9.4 ─────────────────────────── */
    {
      title: '9.4 — IDs, pagination and filters that survive sharding|||9.4 — Định danh, phân trang và bộ lọc sống sót qua sharding',
      slug: 'api-9-3-sharding',
      type: 'LESSON',
      isFreePreview: true,
      description: 'bigint/UUIDv4/UUIDv7 trên 1 triệu dòng (chỉ mục 21/37/30 MB), id lộ số lượng và thời điểm; hai mảnh theo lab: offset ngây thơ sai, offset đúng 40.000 dòng, cursor 40 dòng; khoá phân mảnh trong path.',
      content: `${G094}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.4</span>
<h2>IDs, pagination and filters that survive sharding</h2>
<p class="lead">When one database can no longer hold all the data, it is split into <strong>shards</strong>: each shard holds part of the rows, chosen by a <strong>shard key</strong>. Sharding is an infrastructure decision — but three API decisions made years earlier decide how painful it is: what an ID looks like, how lists are paginated, and which filters an endpoint accepts. This lesson measures all three on the 1,000,000 bookings from Chapter 3.</p>

<h3>IDs: bigint, UUIDv4 or UUIDv7?</h3>
<p>LabFlow’s <code>bk_1</code>, <code>bk_2</code> come from one counter (and in 8.4 two instances produced two different <code>bk_1</code>). Across shards a single counter is a bottleneck, so IDs must be generated anywhere without coordination — usually a UUID. PostgreSQL 18 has both kinds built in: <code>gen_random_uuid()</code> (version 4, fully random) and <code>uuidv7()</code> (version 7, starts with a millisecond timestamp, so new IDs sort roughly by time). One million inserts each:</p>
<pre><code class="language-sql">\\timing on
DROP TABLE IF EXISTS id_seq, id_v4, id_v7;
CREATE TABLE id_seq (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, n int);
CREATE TABLE id_v4 (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), n int);
CREATE TABLE id_v7 (id uuid PRIMARY KEY DEFAULT uuidv7(), n int);
INSERT INTO id_seq (n) SELECT g FROM generate_series(1, 1000000) g;
INSERT INTO id_v4 (n) SELECT g FROM generate_series(1, 1000000) g;
INSERT INTO id_v7 (n) SELECT g FROM generate_series(1, 1000000) g;
\\timing off
SELECT relname AS index, pg_size_pretty(pg_relation_size(oid)) AS size FROM pg_class WHERE relname IN ('id_seq_pkey', 'id_v4_pkey', 'id_v7_pkey') ORDER BY relname;
SELECT id, uuid_extract_timestamp(id) AS created FROM id_v7 ORDER BY id LIMIT 2;
SELECT id FROM id_v4 ORDER BY id LIMIT 2;</code></pre>
<pre><code class="language-bash">psql -h localhost -p 55432 -U labflow -d labflow -f sql/ids.sql 2&gt;&amp;1 | grep -vE "^$|NOTICE|^(DROP|CREATE) TABLE|Time: [0-9.]+ ms$|Timing is"</code></pre>
<div class="out">INSERT 0 1000000
Time: 2822.625 ms (00:02.823)
INSERT 0 1000000
Time: 3639.584 ms (00:03.640)
INSERT 0 1000000
Time: 3363.353 ms (00:03.363)
    index    | size  
-------------+-------
 id_seq_pkey | 21 MB
 id_v4_pkey  | 37 MB
 id_v7_pkey  | 30 MB
(3 rows)
                  id                  |          created           
--------------------------------------+----------------------------
 01a19477-6093-7923-b160-26b8db67326e | 2026-11-01 07:16:53.907+07
 01a19477-6093-7d75-8412-f3a1840cf898 | 2026-11-01 07:16:53.907+07
(2 rows)
                  id                  
--------------------------------------
 00000f84-f4b3-46fa-8af4-d333d95a39ea
 00002a1f-e0d0-40bf-85fd-b932bb00d816
(2 rows)</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">bigint identity · index 21 MB</span><span class="lz-lnote">smallest and fastest, but needs one counter and reveals counts</span></div>
  <div class="lz-layer"><span class="lz-lname">UUIDv7 · index 30 MB</span><span class="lz-lnote">new IDs land at the right end of the index, like a counter — no coordination</span></div>
  <div class="lz-layer"><span class="lz-lname">UUIDv4 · index 37 MB</span><span class="lz-lnote">random positions split index pages everywhere: 23% bigger than v7</span></div>
</div>
<p>Insert time on a warm laptop differs less than the textbooks suggest (v4 3.6 s vs v7 3.4 s here; 4.7 vs 3.3 s on an earlier run) — the data fits in memory. The index size difference is stable, and it grows into real I/O when the index no longer fits in RAM.</p>
<p>IDs are also part of the contract: <code>bk_10234</code> tells a competitor how many bookings exist and invites guessing the neighbours (BOLA, 6.2). UUIDs fix that — but a UUIDv7 still carries its creation time (<code>uuid_extract_timestamp</code> above). If “when was this created” is sensitive, v7 is not the right public ID.</p>
<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc9562.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: RFC 9562 — Universally Unique IDentifiers (2024; read 1 Nov 2026)</span><span class="lc-sub">Defines UUID version 7: a 48-bit Unix timestamp in milliseconds followed by random bits. It recommends v7 over v1/v6 where possible and points out its better index locality in databases compared with random v4.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>
<a class="link-card" href="https://www.postgresql.org/docs/18/functions-uuid.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: PostgreSQL 18 docs — UUID functions (read 1 Nov 2026)</span><span class="lc-sub">gen_random_uuid() / uuidv4(), uuidv7() with an optional time shift, uuid_extract_timestamp() and uuid_extract_version() — all built in since PostgreSQL 18.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>Two shards, split by lab</h3>
<p>To feel sharding without a cluster, the table is split by <code>hash(lab_id) % 2</code> into two schemas — each query goes to one “shard” at a time, exactly like separate servers, just without the network:</p>
<pre><code class="language-sql">DROP SCHEMA IF EXISTS shard0 CASCADE; DROP SCHEMA IF EXISTS shard1 CASCADE; CREATE SCHEMA shard0; CREATE SCHEMA shard1;
CREATE TABLE shard0.bookings AS SELECT * FROM bookings WHERE abs(hashtext(lab_id)) % 2 = 0;
CREATE TABLE shard1.bookings AS SELECT * FROM bookings WHERE abs(hashtext(lab_id)) % 2 = 1;
CREATE INDEX ON shard0.bookings (created_at DESC, id DESC); CREATE INDEX ON shard1.bookings (created_at DESC, id DESC);
CREATE INDEX ON shard0.bookings (lab_id, start_at); CREATE INDEX ON shard1.bookings (lab_id, start_at);
CREATE INDEX ON shard0.bookings (user_id, start_at); CREATE INDEX ON shard1.bookings (user_id, start_at);
ANALYZE shard0.bookings; ANALYZE shard1.bookings;
SELECT 'shard0' AS shard, count(*), count(DISTINCT lab_id) AS labs FROM shard0.bookings UNION ALL SELECT 'shard1', count(*), count(DISTINCT lab_id) FROM shard1.bookings;</code></pre>
<pre><code class="language-bash">psql -h localhost -p 55432 -U labflow -d labflow -f sql/shards.sql 2&gt;&amp;1 | grep -vE "^$|NOTICE|^(DROP|CREATE) (TABLE|SCHEMA|INDEX)|^SELECT [0-9]+$|^ANALYZE$"</code></pre>
<div class="out"> shard  | count  | labs
--------+--------+------
 shard1 | 460000 |   23
 shard0 | 540000 |   27
(2 rows)</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">request</span><span class="lz-t">GET /v2/bookings…</span><span class="lz-d">does it name the shard key (labId)?</span></div>
  <div class="lz-step"><span class="lz-k">yes</span><span class="lz-t">route to ONE shard</span><span class="lz-d">cheap, scales with more shards</span></div>
  <div class="lz-step"><span class="lz-k">no</span><span class="lz-t">ask EVERY shard, merge</span><span class="lz-d">scatter-gather: cost × number of shards</span></div>
</div>
<p><code>perf/shards.mjs</code> asks for page 1000 of the newest bookings (20 per page) three ways, and compares every answer with the unsplit table:</p>
<pre><code class="language-bash">node perf/shards.mjs</code></pre>
<div class="out">offset SAI: mỗi mảnh OFFSET 19980 LIMIT 20       40 dòng kéo về ·    6.2 ms
  ⇒ khớp bảng gốc? SAI
offset ĐÚNG: mỗi mảnh LIMIT 20000, gộp, cắt   40000 dòng kéo về ·   52.4 ms
  ⇒ khớp bảng gốc? ĐÚNG
cursor: mỗi mảnh WHERE (…) &lt; cursor LIMIT 20     40 dòng kéo về ·    1.9 ms
  ⇒ khớp bảng gốc? ĐÚNG
có khoá phân mảnh: lab lab_7 ⇒ chỉ shard1       403 dòng kéo về ·    1.4 ms
không có khoá: user usr_2, cùng tuần ⇒ hỏi MỌI mảnh  10080 dòng kéo về ·    6.1 ms</div>
<ul>
  <li><strong>Offset, done naively</strong> — each shard <code>OFFSET 19980 LIMIT 20</code>, merge: fast, and <strong>wrong</strong>. The 19,980 newest rows overall are not 19,980 from each shard.</li>
  <li><strong>Offset, done correctly</strong> — each shard must return its first 20,000 rows, the server merges 40,000 to keep 20: 52 ms, and it grows with every page and every shard.</li>
  <li><strong>Cursor</strong> (3.2) — each shard returns 20 rows after the cursor, merge 40, keep 20: 1.9 ms on any page, and correct. The cursor carries its own position (8.4), so it works on any shard.</li>
  <li><strong>With the shard key</strong> (<code>labId</code>) one shard answers; <strong>without</strong> it (bookings of one user) every shard is asked. With two shards that is cheap; with 50 it is 50 round trips, and the slowest shard decides the response time (the tail of 8.1).</li>
</ul>
<div class="pitfall"><p><strong>Trap — “we will shard later, the API does not matter”.</strong> Offset pagination, guessable counters and filters that ignore the shard key are API promises. Once clients depend on <code>?page=1000</code> you have to keep answering it — at 40,000 rows per request.</p></div>
<a class="link-card" href="/courses/postgresql/learn?lessonSlug=postgresql-15-4-phan-manh" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Go deeper: PostgreSQL course, lesson 15.4 — partitioning and sharding</span><span class="lc-sub">Declarative partitioning, Citus-style distribution and choosing a shard key from the database side; the System Design course covers resharding.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>API rules that keep sharding possible</h3>
<div class="lz-map">
  <div class="lz-stage">
    <div class="lz-node"><span class="lz-badge">1</span><span class="lz-nbody"><span class="lz-ntitle">IDs generated anywhere</span><span class="lz-nsub">UUIDv7 (or v4 if time is sensitive); never a global counter in the contract</span></span></div>
    <div class="lz-node"><span class="lz-badge">2</span><span class="lz-nbody"><span class="lz-ntitle">Cursor pagination only</span><span class="lz-nsub">opaque cursor with a stable order (time, id); no page numbers</span></span></div>
  </div>
  <div class="lz-stage">
    <div class="lz-node"><span class="lz-badge">3</span><span class="lz-nbody"><span class="lz-ntitle">Shard key in the path</span><span class="lz-nsub">/labs/{labId}/bookings is one shard; global searches are separate, slower endpoints</span></span></div>
    <div class="lz-node"><span class="lz-badge">4</span><span class="lz-nbody"><span class="lz-ntitle">No exact totals</span><span class="lz-nsub">“total: 1,000,000” means counting every shard on every page (3.1)</span></span></div>
  </div>
</div>

<h3>In interviews and at work</h3>
<ul>
  <li><strong>“Why UUIDv7 over auto-increment?”</strong> Generated without coordination, not guessable; v7 keeps index locality (30 vs 37 MB for v4 here). It does reveal creation time.</li>
  <li><strong>“Paginate across shards?”</strong> Cursor + merge: each shard returns <code>limit</code> rows. Offset needs <code>offset + limit</code> from every shard — or returns the wrong page.</li>
</ul>

<h3>🧪 Practice (30–40 min)</h3>
<div class="callout ok"><ol>
  <li>Change <code>shards.sql</code> to 4 shards and rerun <code>perf/shards.mjs</code>. How do “offset correct” and “cursor” change?</li>
  <li>Add <code>?userId=</code> to the shard test with a 50 ms <code>pg_sleep</code> on one shard only. What happens to the scatter-gather time?</li>
  <li>Backfill UUIDv7 for old rows with their real creation time: look up the time-shift argument of <code>uuidv7()</code> in the docs.</li>
</ol>
<p><strong>Done when:</strong> you can explain the wrong-page result to a teammate with one diagram.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Shard / shard key</span><span class="v">A part of the data / the field that decides which part a row lives in.</span></div>
  <div class="kv"><span class="k">Scatter-gather</span><span class="v">Ask every shard and merge the answers.</span></div>
  <div class="kv"><span class="k">UUIDv4 / UUIDv7</span><span class="v">Random / time-ordered 128-bit IDs.</span></div>
  <div class="kv"><span class="k">Index locality</span><span class="v">New keys landing near each other in the index, so fewer pages change.</span></div>
  <div class="kv"><span class="k">Enumeration</span><span class="v">Guessing other records from a sequential ID.</span></div>
  <div class="kv"><span class="k">Merge</span><span class="v">Combine sorted results from shards into one sorted page.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>1M rows: primary-key index 21 MB (bigint), 30 MB (UUIDv7), 37 MB (UUIDv4); insert times close on a warm laptop.</li>
  <li>Sequential IDs leak counts and invite guessing; UUIDv7 leaks creation time.</li>
  <li>Page 1000 across two shards: naive offset was wrong, correct offset pulled 40,000 rows (52 ms), cursor pulled 40 (1.9 ms) and was right.</li>
  <li>Put the shard key in the path; queries without it ask every shard.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.4</span>
<h2>Định danh, phân trang và bộ lọc sống sót qua sharding</h2>
<p class="lead">Khi một CSDL không còn chứa nổi toàn bộ dữ liệu, nó được chia thành các <strong>phân mảnh</strong> (shard): mỗi mảnh giữ một phần các dòng, chọn theo một <strong>khoá phân mảnh</strong> (shard key). Sharding là quyết định hạ tầng — nhưng ba quyết định API đưa ra từ nhiều năm trước quyết định nó đau tới đâu: định danh trông thế nào, danh sách phân trang ra sao, và endpoint nhận bộ lọc nào. Bài này đo cả ba trên 1.000.000 lượt đặt của Chương 3.</p>

<h3>Định danh: bigint, UUIDv4 hay UUIDv7?</h3>
<p><code>bk_1</code>, <code>bk_2</code> của LabFlow đến từ một bộ đếm (và ở bài 8.4 hai bản đã sinh ra hai <code>bk_1</code> khác nhau). Qua nhiều phân mảnh, một bộ đếm chung là nút thắt, nên định danh phải sinh ra ở bất cứ đâu mà không cần phối hợp — thường là UUID. PostgreSQL 18 có sẵn cả hai loại: <code>gen_random_uuid()</code> (phiên bản 4, ngẫu nhiên hoàn toàn) và <code>uuidv7()</code> (phiên bản 7, mở đầu bằng mốc thời gian mili giây, nên id mới xếp gần theo thời gian). Mỗi loại một triệu lần chèn:</p>
<pre><code class="language-sql">\\timing on
DROP TABLE IF EXISTS id_seq, id_v4, id_v7;
CREATE TABLE id_seq (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, n int);
CREATE TABLE id_v4 (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), n int);
CREATE TABLE id_v7 (id uuid PRIMARY KEY DEFAULT uuidv7(), n int);
INSERT INTO id_seq (n) SELECT g FROM generate_series(1, 1000000) g;
INSERT INTO id_v4 (n) SELECT g FROM generate_series(1, 1000000) g;
INSERT INTO id_v7 (n) SELECT g FROM generate_series(1, 1000000) g;
\\timing off
SELECT relname AS index, pg_size_pretty(pg_relation_size(oid)) AS size FROM pg_class WHERE relname IN ('id_seq_pkey', 'id_v4_pkey', 'id_v7_pkey') ORDER BY relname;
SELECT id, uuid_extract_timestamp(id) AS created FROM id_v7 ORDER BY id LIMIT 2;
SELECT id FROM id_v4 ORDER BY id LIMIT 2;</code></pre>
<pre><code class="language-bash">psql -h localhost -p 55432 -U labflow -d labflow -f sql/ids.sql 2&gt;&amp;1 | grep -vE "^$|NOTICE|^(DROP|CREATE) TABLE|Time: [0-9.]+ ms$|Timing is"</code></pre>
<div class="out">INSERT 0 1000000
Time: 2822.625 ms (00:02.823)
INSERT 0 1000000
Time: 3639.584 ms (00:03.640)
INSERT 0 1000000
Time: 3363.353 ms (00:03.363)
    index    | size  
-------------+-------
 id_seq_pkey | 21 MB
 id_v4_pkey  | 37 MB
 id_v7_pkey  | 30 MB
(3 rows)
                  id                  |          created           
--------------------------------------+----------------------------
 01a19477-6093-7923-b160-26b8db67326e | 2026-11-01 07:16:53.907+07
 01a19477-6093-7d75-8412-f3a1840cf898 | 2026-11-01 07:16:53.907+07
(2 rows)
                  id                  
--------------------------------------
 00000f84-f4b3-46fa-8af4-d333d95a39ea
 00002a1f-e0d0-40bf-85fd-b932bb00d816
(2 rows)</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">bigint identity · chỉ mục 21 MB</span><span class="lz-lnote">nhỏ và nhanh nhất, nhưng cần một bộ đếm và làm lộ số lượng</span></div>
  <div class="lz-layer"><span class="lz-lname">UUIDv7 · chỉ mục 30 MB</span><span class="lz-lnote">id mới rơi về đầu bên phải chỉ mục, như bộ đếm — mà không cần phối hợp</span></div>
  <div class="lz-layer"><span class="lz-lname">UUIDv4 · chỉ mục 37 MB</span><span class="lz-lnote">vị trí ngẫu nhiên làm tách trang chỉ mục khắp nơi: lớn hơn v7 23%</span></div>
</div>
<p>Thời gian chèn trên một laptop “nóng” chênh ít hơn sách vở nói (ở đây v4 3,6 giây, v7 3,4 giây; lần chạy trước 4,7 so với 3,3 giây) — dữ liệu nằm gọn trong bộ nhớ. Chênh lệch kích thước chỉ mục thì ổn định, và thành I/O thật khi chỉ mục không còn vừa RAM.</p>
<p>Định danh cũng là một phần hợp đồng: <code>bk_10234</code> cho đối thủ biết có bao nhiêu lượt đặt và mời gọi đoán các id kế bên (BOLA, 6.2). UUID sửa được điều đó — nhưng UUIDv7 vẫn mang theo thời điểm tạo (<code>uuid_extract_timestamp</code> ở trên). Nếu “tạo lúc nào” là thông tin nhạy cảm, v7 không phải định danh công khai phù hợp.</p>
<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc9562.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: RFC 9562 — Universally Unique IDentifiers (2024; đọc ngày 1/11/2026)</span><span class="lc-sub">Định nghĩa UUID phiên bản 7: 48 bit mốc thời gian Unix tính bằng mili giây rồi tới các bit ngẫu nhiên. Khuyên dùng v7 thay cho v1/v6 khi có thể và chỉ ra rằng nó giữ chỉ mục CSDL gọn hơn v4 ngẫu nhiên.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<a class="link-card" href="https://www.postgresql.org/docs/18/functions-uuid.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: tài liệu PostgreSQL 18 — các hàm UUID (đọc ngày 1/11/2026)</span><span class="lc-sub">gen_random_uuid() / uuidv4(), uuidv7() kèm tuỳ chọn dịch thời gian, uuid_extract_timestamp() và uuid_extract_version() — có sẵn từ PostgreSQL 18.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Hai phân mảnh, chia theo phòng lab</h3>
<p>Để cảm nhận sharding mà không cần một cụm máy, bảng được chia theo <code>hash(lab_id) % 2</code> vào hai schema — mỗi truy vấn đi tới một “mảnh” một lúc, y như các server riêng, chỉ là không có mạng ở giữa:</p>
<pre><code class="language-sql">DROP SCHEMA IF EXISTS shard0 CASCADE; DROP SCHEMA IF EXISTS shard1 CASCADE; CREATE SCHEMA shard0; CREATE SCHEMA shard1;
CREATE TABLE shard0.bookings AS SELECT * FROM bookings WHERE abs(hashtext(lab_id)) % 2 = 0;
CREATE TABLE shard1.bookings AS SELECT * FROM bookings WHERE abs(hashtext(lab_id)) % 2 = 1;
CREATE INDEX ON shard0.bookings (created_at DESC, id DESC); CREATE INDEX ON shard1.bookings (created_at DESC, id DESC);
CREATE INDEX ON shard0.bookings (lab_id, start_at); CREATE INDEX ON shard1.bookings (lab_id, start_at);
CREATE INDEX ON shard0.bookings (user_id, start_at); CREATE INDEX ON shard1.bookings (user_id, start_at);
ANALYZE shard0.bookings; ANALYZE shard1.bookings;
SELECT 'shard0' AS shard, count(*), count(DISTINCT lab_id) AS labs FROM shard0.bookings UNION ALL SELECT 'shard1', count(*), count(DISTINCT lab_id) FROM shard1.bookings;</code></pre>
<pre><code class="language-bash">psql -h localhost -p 55432 -U labflow -d labflow -f sql/shards.sql 2&gt;&amp;1 | grep -vE "^$|NOTICE|^(DROP|CREATE) (TABLE|SCHEMA|INDEX)|^SELECT [0-9]+$|^ANALYZE$"</code></pre>
<div class="out"> shard  | count  | labs
--------+--------+------
 shard1 | 460000 |   23
 shard0 | 540000 |   27
(2 rows)</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">request</span><span class="lz-t">GET /v2/bookings…</span><span class="lz-d">có nêu khoá phân mảnh (labId) không?</span></div>
  <div class="lz-step"><span class="lz-k">có</span><span class="lz-t">đi tới MỘT mảnh</span><span class="lz-d">rẻ, càng nhiều mảnh càng mở rộng được</span></div>
  <div class="lz-step"><span class="lz-k">không</span><span class="lz-t">hỏi MỌI mảnh, gộp lại</span><span class="lz-d">scatter-gather: chi phí × số mảnh</span></div>
</div>
<p><code>perf/shards.mjs</code> xin trang 1000 của các lượt đặt mới nhất (20 mỗi trang) theo ba cách, và so từng câu trả lời với bảng chưa chia:</p>
<pre><code class="language-bash">node perf/shards.mjs</code></pre>
<div class="out">offset SAI: mỗi mảnh OFFSET 19980 LIMIT 20       40 dòng kéo về ·    6.2 ms
  ⇒ khớp bảng gốc? SAI
offset ĐÚNG: mỗi mảnh LIMIT 20000, gộp, cắt   40000 dòng kéo về ·   52.4 ms
  ⇒ khớp bảng gốc? ĐÚNG
cursor: mỗi mảnh WHERE (…) &lt; cursor LIMIT 20     40 dòng kéo về ·    1.9 ms
  ⇒ khớp bảng gốc? ĐÚNG
có khoá phân mảnh: lab lab_7 ⇒ chỉ shard1       403 dòng kéo về ·    1.4 ms
không có khoá: user usr_2, cùng tuần ⇒ hỏi MỌI mảnh  10080 dòng kéo về ·    6.1 ms</div>
<ul>
  <li><strong>Offset làm ngây thơ</strong> — mỗi mảnh <code>OFFSET 19980 LIMIT 20</code>, rồi gộp: nhanh, và <strong>sai</strong>. 19.980 dòng mới nhất của cả bảng không phải là 19.980 dòng của mỗi mảnh.</li>
  <li><strong>Offset làm đúng</strong> — mỗi mảnh phải trả 20.000 dòng đầu, server gộp 40.000 dòng để giữ 20: 52 ms, và tăng theo mỗi trang, mỗi mảnh.</li>
  <li><strong>Cursor</strong> (3.2) — mỗi mảnh trả 20 dòng sau cursor, gộp 40, giữ 20: 1,9 ms ở trang nào cũng vậy, và đúng. Cursor tự mang vị trí của nó (8.4), nên mảnh nào cũng dùng được.</li>
  <li><strong>Có khoá phân mảnh</strong> (<code>labId</code>) thì một mảnh trả lời; <strong>không có</strong> (lượt đặt của một người dùng) thì hỏi mọi mảnh. Với hai mảnh thì rẻ; với 50 mảnh là 50 lượt đi-về, và mảnh chậm nhất quyết định thời gian trả lời (cái đuôi của bài 8.1).</li>
</ul>
<div class="pitfall"><p><strong>Bẫy — “sau này mới shard, API không quan trọng”.</strong> Phân trang offset, bộ đếm đoán được và bộ lọc bỏ qua khoá phân mảnh đều là lời hứa của API. Một khi client đã dựa vào <code>?page=1000</code> thì bạn phải trả lời tiếp — với 40.000 dòng mỗi request.</p></div>
<a class="link-card" href="/courses/postgresql/learn?lessonSlug=postgresql-15-4-phan-manh" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Học sâu hơn: khoá PostgreSQL, bài 15.4 — phân vùng và phân mảnh</span><span class="lc-sub">Phân vùng khai báo, phân tán kiểu Citus và chọn khoá phân mảnh nhìn từ phía CSDL; khoá System Design nói về chia lại mảnh.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Luật API giữ cho sharding còn làm được</h3>
<div class="lz-map">
  <div class="lz-stage">
    <div class="lz-node"><span class="lz-badge">1</span><span class="lz-nbody"><span class="lz-ntitle">Id sinh ở bất cứ đâu</span><span class="lz-nsub">UUIDv7 (hoặc v4 nếu thời gian là nhạy cảm); không bao giờ là bộ đếm chung trong hợp đồng</span></span></div>
    <div class="lz-node"><span class="lz-badge">2</span><span class="lz-nbody"><span class="lz-ntitle">Chỉ phân trang bằng cursor</span><span class="lz-nsub">cursor mờ với thứ tự ổn định (thời gian, id); không có số trang</span></span></div>
  </div>
  <div class="lz-stage">
    <div class="lz-node"><span class="lz-badge">3</span><span class="lz-nbody"><span class="lz-ntitle">Khoá phân mảnh nằm trong path</span><span class="lz-nsub">/labs/{labId}/bookings là một mảnh; tìm kiếm toàn cục là endpoint riêng, chậm hơn</span></span></div>
    <div class="lz-node"><span class="lz-badge">4</span><span class="lz-nbody"><span class="lz-ntitle">Không có tổng chính xác</span><span class="lz-nsub">“total: 1,000,000” nghĩa là đếm mọi mảnh ở mọi trang (3.1)</span></span></div>
  </div>
</div>

<h3>Khi phỏng vấn và khi đi làm</h3>
<ul>
  <li><strong>“Sao chọn UUIDv7 thay vì auto-increment?”</strong> Sinh ra không cần phối hợp, không đoán được; v7 giữ chỉ mục gọn (30 so với 37 MB của v4 ở đây). Nó có lộ thời điểm tạo.</li>
  <li><strong>“Phân trang qua nhiều mảnh?”</strong> Cursor + gộp: mỗi mảnh trả <code>limit</code> dòng. Offset cần <code>offset + limit</code> dòng từ mọi mảnh — hoặc trả sai trang.</li>
</ul>

<h3>🧪 Thực hành (30–40 phút)</h3>
<div class="callout ok"><ol>
  <li>Sửa <code>shards.sql</code> thành 4 mảnh rồi chạy lại <code>perf/shards.mjs</code>. “Offset đúng” và “cursor” đổi thế nào?</li>
  <li>Thêm <code>?userId=</code> vào bài đo với <code>pg_sleep</code> 50 ms ở riêng một mảnh. Thời gian scatter-gather ra sao?</li>
  <li>Điền UUIDv7 cho dòng cũ theo đúng thời điểm tạo thật: tra tham số dịch thời gian của <code>uuidv7()</code> trong tài liệu.</li>
</ol>
<p><strong>Xong khi:</strong> bạn giải thích được kết quả sai trang cho đồng đội bằng một sơ đồ.</p></div>

<h3>🗂 Thuật ngữ chính</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Shard / khoá phân mảnh</span><span class="v">Một phần dữ liệu / trường quyết định dòng nằm ở phần nào.</span></div>
  <div class="kv"><span class="k">Scatter-gather</span><span class="v">Hỏi mọi mảnh rồi gộp câu trả lời.</span></div>
  <div class="kv"><span class="k">UUIDv4 / UUIDv7</span><span class="v">Định danh 128 bit ngẫu nhiên / xếp theo thời gian.</span></div>
  <div class="kv"><span class="k">Tính cục bộ chỉ mục</span><span class="v">Khoá mới rơi gần nhau trong chỉ mục, ít trang bị đổi.</span></div>
  <div class="kv"><span class="k">Đoán liệt kê (enumeration)</span><span class="v">Đoán bản ghi khác từ một id tuần tự.</span></div>
  <div class="kv"><span class="k">Gộp (merge)</span><span class="v">Ghép các kết quả đã sắp của từng mảnh thành một trang đã sắp.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>1 triệu dòng: chỉ mục khoá chính 21 MB (bigint), 30 MB (UUIDv7), 37 MB (UUIDv4); thời gian chèn sát nhau trên laptop nóng.</li>
  <li>Id tuần tự lộ số lượng và mời đoán; UUIDv7 lộ thời điểm tạo.</li>
  <li>Trang 1000 qua hai mảnh: offset ngây thơ sai, offset đúng kéo 40.000 dòng (52 ms), cursor kéo 40 dòng (1,9 ms) và đúng.</li>
  <li>Đặt khoá phân mảnh vào path; truy vấn thiếu nó phải hỏi mọi mảnh.</li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── 9.5 ─────────────────────────── */
    {
      title: '9.5 — SQL vs NoSQL seen from the API: how the datastore shapes endpoints|||9.5 — SQL vs NoSQL nhìn từ API: kho dữ liệu định hình endpoint thế nào',
      slug: 'api-9-4-nosql',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Cùng dữ liệu dạng bảng và dạng tài liệu JSONB: đọc nguyên khối nhanh hơn, sửa một thiết bị và truy vấn xuyên phòng chậm hơn (8,3 so với 0,25 ms), mảng không giới hạn 1,2 MB; chọn theo mẫu truy cập.',
      content: `${G095}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.5</span>
<h2>SQL vs NoSQL seen from the API: how the datastore shapes endpoints</h2>
<p class="lead">“Should we use MongoDB or PostgreSQL?” is usually argued in slogans. From the API side there is a better question: <em>which requests will clients send, and how often?</em> A document database stores one resource with its children in one piece — perfect for some endpoints, painful for others. This lesson stores the same lab data both ways in PostgreSQL 18 (tables, and a JSONB document per lab — the document model MongoDB uses) and measures four real LabFlow requests.</p>

<h3>The same data, two shapes</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Relational: 3 tables</span><span class="lz-lnote">labs_r (1,000) · devices_r (30 per lab = 30,000) · issues_r (5 per device = 150,000), joined by keys</span></div>
  <div class="lz-layer"><span class="lz-lname">Document: 1 row per lab</span><span class="lz-lnote">labs_d.doc = { id, name, devices: [ { id, status, issues: [ … ] } ] } — 10,247 bytes of JSON, 1,685 stored after compression</span></div>
</div>
<pre><code class="language-sql">-- bài 9.5: CÙNG dữ liệu, hai cách lưu — quan hệ (3 bảng) và tài liệu (1 cột JSONB mỗi phòng lab)
DROP TABLE IF EXISTS issues_r, devices_r, labs_r, labs_d;
CREATE TABLE labs_r (id int PRIMARY KEY, name text NOT NULL);
CREATE TABLE devices_r (id int PRIMARY KEY, lab_id int NOT NULL REFERENCES labs_r, name text NOT NULL, status text NOT NULL);
CREATE TABLE issues_r (id int PRIMARY KEY, device_id int NOT NULL REFERENCES devices_r, title text NOT NULL, status text NOT NULL);
INSERT INTO labs_r SELECT g, 'Lab ' || g FROM generate_series(1, 1000) g;                                   -- 1.000 phòng
INSERT INTO devices_r SELECT g, (g - 1) / 30 + 1, 'Device ' || g, CASE WHEN g % 97 = 0 THEN 'MAINTENANCE' ELSE 'AVAILABLE' END
  FROM generate_series(1, 30000) g;                                                                         -- 30 thiết bị / phòng
INSERT INTO issues_r SELECT g, (g - 1) / 5 + 1, 'Issue ' || g, CASE WHEN g % 4 = 0 THEN 'OPEN' ELSE 'RESOLVED' END
  FROM generate_series(1, 150000) g;                                                                        -- 5 báo hỏng / thiết bị
CREATE INDEX ON devices_r (lab_id); CREATE INDEX ON issues_r (device_id); CREATE INDEX ON devices_r (status);
CREATE TABLE labs_d (id int PRIMARY KEY, doc jsonb NOT NULL);
INSERT INTO labs_d SELECT l.id, jsonb_build_object('id', l.id, 'name', l.name, 'devices', (
  SELECT jsonb_agg(jsonb_build_object('id', d.id, 'name', d.name, 'status', d.status, 'issues', (
    SELECT jsonb_agg(jsonb_build_object('id', i.id, 'title', i.title, 'status', i.status) ORDER BY i.id) FROM issues_r i WHERE i.device_id = d.id))
    ORDER BY d.id) FROM devices_r d WHERE d.lab_id = l.id)) FROM labs_r l;
CREATE INDEX labs_d_gin ON labs_d USING gin (doc jsonb_path_ops);
ANALYZE labs_r; ANALYZE devices_r; ANALYZE issues_r; ANALYZE labs_d;
SELECT pg_size_pretty(avg(pg_column_size(doc))::bigint) AS avg_doc, pg_size_pretty(pg_total_relation_size('labs_d')) AS doc_table,
  pg_size_pretty(pg_total_relation_size('labs_r') + pg_total_relation_size('devices_r') + pg_total_relation_size('issues_r')) AS relational FROM labs_d;</code></pre>
<p>The script is <code>sql/docs.sql</code> in the chapter download:</p>
<pre><code class="language-bash">psql -h localhost -p 55432 -U labflow -d labflow -f sql/docs.sql 2&gt;&amp;1 | grep -vE "^$|NOTICE|^(DROP|CREATE) (TABLE|INDEX)|^INSERT 0 [0-9]+$|^ANALYZE$"</code></pre>
<div class="out">  avg_doc   | doc_table | relational
------------+-----------+------------
 1512 bytes | 21 MB     | 17 MB
(1 row)</div>
<p>Then <code>perf/doc-vs-rel.mjs</code> sends the questions LabFlow’s endpoints would ask, hundreds of times each, and prints the median:</p>
<pre><code class="language-bash">node perf/doc-vs-rel.mjs</code></pre>
<div class="out">chi tiết 1 phòng · quan hệ: JOIN + json_agg                median   0.236 ms
chi tiết 1 phòng · tài liệu: một dòng theo khoá chính      median   0.171 ms
sửa 1 thiết bị · quan hệ: UPDATE một dòng                  median   0.102 ms
sửa 1 thiết bị · tài liệu: tìm vị trí trong mảng + jsonb_set median   0.452 ms
mọi thiết bị đang bảo trì · quan hệ: chỉ mục status        median   0.248 ms
mọi thiết bị đang bảo trì · tài liệu: GIN @&gt; rồi bóc mảng  median   8.290 ms
phòng có 20.000 báo hỏng · tài liệu: đọc cả tài liệu       median   8.904 ms
20 báo hỏng mới nhất · quan hệ: chỉ mục + LIMIT 20         median   0.109 ms
tài liệu phòng 9999: 1197841 byte JSON (133163 byte lưu) — mọi lần đọc/sửa đều kéo cả khối
một tài liệu phòng lab: 10247 byte JSON, lưu 1685 byte sau nén — sửa 1 thiết bị là ghi lại CẢ tài liệu</div>

<h3>Reading the results as an API designer</h3>
<div class="lz-map">
  <div class="lz-stage">
    <div class="lz-node"><span class="lz-badge">✓</span><span class="lz-nbody"><span class="lz-ntitle">GET /labs/{id} with everything inside</span><span class="lz-nsub">document 0.17 ms vs JOIN 0.24 ms — the document is already the response</span></span></div>
    <div class="lz-node"><span class="lz-badge">✗</span><span class="lz-nbody"><span class="lz-ntitle">PATCH /devices/{id}</span><span class="lz-nsub">table 0.10 ms vs document 0.45 ms — find the array position, rewrite the whole document</span></span></div>
  </div>
  <div class="lz-stage">
    <div class="lz-node"><span class="lz-badge">✗</span><span class="lz-nbody"><span class="lz-ntitle">GET /devices?status=MAINTENANCE (across labs)</span><span class="lz-nsub">index 0.25 ms vs GIN + unpacking arrays 8.3 ms — 33× slower</span></span></div>
    <div class="lz-node"><span class="lz-badge">✗</span><span class="lz-nbody"><span class="lz-ntitle">A lab with 20,000 embedded issues</span><span class="lz-nsub">reading it 8.9 ms (1.2 MB of JSON) vs “20 newest issues” from a table 0.11 ms</span></span></div>
  </div>
</div>
<p>The pattern: a document wins when the endpoint <strong>reads one aggregate whole</strong> — the shape of the API response matches the shape of the stored data. It loses when endpoints <strong>update small pieces</strong>, <strong>query across aggregates</strong>, or when a child list <strong>grows without limit</strong> (issues, comments, logs). MongoDB caps a document at 16 MB for the same reason: unbounded arrays belong in their own collection.</p>
<div class="pitfall"><p><strong>Trap — designing the API around the storage.</strong> If labs are documents, it is tempting to offer only <code>PUT /labs/{id}</code> with the whole document. Two lab managers editing different devices then overwrite each other (5.4), and every small change ships 10 KB. Design the resources clients need (<code>/devices/{id}</code>), and let the storage follow.</p></div>
<a class="link-card" href="https://www.postgresql.org/docs/18/datatype-json.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: PostgreSQL 18 docs — JSON types, jsonb indexing (read 1 Nov 2026)</span><span class="lc-sub">jsonb is stored decomposed and supports containment (@>) and jsonpath; a GIN index with jsonb_path_ops serves @> queries. Updating any part of a jsonb value writes a new version of the whole row.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>
<a class="link-card" href="https://www.mongodb.com/docs/manual/data-modeling/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: MongoDB manual — Data modeling: embedding vs references (read 1 Nov 2026)</span><span class="lc-sub">Embed data that is read together; reference data that grows without bound or is shared and queried on its own. The 16 MB BSON document limit is documented under MongoDB Limits and Thresholds.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<a class="link-card lien-ket-cheo" href="/courses/server-side-development-nodejs-express-mongodb/learn?lessonSlug=sdn302-3-1-mongodb-crud" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">You met this in SDN302 — 3.1 NoSQL &amp; the document model</span><span class="lc-sub">If you took SDN302 on Academy, you learnt collections and documents and the choice “embed sub-documents or reference + populate”. Same: that choice. Different: here you measure it from the API side — one read 0.17 vs 0.24 ms, but a cross-lab query 33× slower and a 1.2 MB document when a child list grows. Not taken SDN302? This lesson stands on its own.</span></span>
  <span class="lc-cta">OPEN SDN302 LESSON →</span>
</a>
<a class="link-card" href="/courses/postgresql/learn?lessonSlug=postgresql-17-3-mongodb-vs-jsonb" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Go deeper: PostgreSQL course, lesson 17.3 — MongoDB vs JSONB</span><span class="lc-sub">The same question from the database side: what each store is good at, and how to choose.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>A decision table from access patterns</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Mostly “read the whole thing by id”</span><span class="lz-lnote">document (or a JSONB column) — e.g. a lab’s settings, a user’s preferences</span></div>
  <div class="lz-layer"><span class="lz-lname">Small updates by many people</span><span class="lz-lnote">rows — each device, each booking its own record and ETag</span></div>
  <div class="lz-layer"><span class="lz-lname">Queries across many parents</span><span class="lz-lnote">rows + indexes — status, time ranges, reports (Lab 8)</span></div>
  <div class="lz-layer"><span class="lz-lname">Lists that keep growing</span><span class="lz-lnote">rows, paginated by cursor — never an array inside a parent</span></div>
</div>
<p>LabFlow keeps PostgreSQL tables (Chapter 12) and may use one JSONB column where a resource is read whole and has no growing lists. Many teams end the same way: relational by default, documents where the access pattern says so.</p>

<h3>In interviews and at work</h3>
<ul>
  <li><strong>“SQL or NoSQL for this system?”</strong> List the endpoints and their frequency first. One-aggregate reads favour documents; small updates, cross-entity queries and unbounded lists favour tables. Give a number if you have one: here 0.17 vs 0.24 ms for a read, 8.3 vs 0.25 ms for a cross-lab query.</li>
  <li><strong>“Embed or reference?”</strong> Embed what is read together and stays small; reference what grows or is shared.</li>
</ul>

<h3>🧪 Practice (25–35 min)</h3>
<div class="callout ok"><ol>
  <li>Add a fifth benchmark: “add one issue to a device” in both shapes. Which one grows with the number of existing issues?</li>
  <li>Make the cross-lab query fast in the document model with an expression index or a generated column. What did you have to duplicate?</li>
  <li>Write the OpenAPI paths for <code>GET /labs/{id}?include=devices</code> and <code>PATCH /devices/{id}</code>. Would they change if the storage changed?</li>
</ol>
<p><strong>Done when:</strong> you can defend one storage choice for LabFlow with three of your own numbers.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Document model</span><span class="v">A resource stored with its children in one piece (JSON/BSON).</span></div>
  <div class="kv"><span class="k">Aggregate</span><span class="v">A parent and the children always read and changed with it.</span></div>
  <div class="kv"><span class="k">Embed / reference</span><span class="v">Store children inside the parent / store them apart with an id.</span></div>
  <div class="kv"><span class="k">JSONB</span><span class="v">PostgreSQL’s binary JSON type, indexable with GIN.</span></div>
  <div class="kv"><span class="k">Access pattern</span><span class="v">Which queries run, how often, with which filters.</span></div>
  <div class="kv"><span class="k">Unbounded array</span><span class="v">A child list inside a document that grows forever.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>One-lab read: document 0.17 ms vs JOIN 0.24 ms. One-device update: table 0.10 vs document 0.45 ms.</li>
  <li>Cross-lab query: index 0.25 ms vs GIN + unpacking 8.3 ms. 20,000 embedded issues: an 8.9 ms, 1.2 MB read.</li>
  <li>Choose from the API’s access patterns; never shape the API around the storage.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.5</span>
<h2>SQL vs NoSQL nhìn từ API: kho dữ liệu định hình endpoint thế nào</h2>
<p class="lead">“Dùng MongoDB hay PostgreSQL?” thường được tranh luận bằng khẩu hiệu. Từ phía API có một câu hỏi tốt hơn: <em>client sẽ gửi những request nào, và thường xuyên tới đâu?</em> CSDL tài liệu lưu một tài nguyên cùng các con của nó thành một khối — tuyệt cho vài endpoint, khổ cho vài endpoint khác. Bài này lưu cùng dữ liệu phòng lab theo cả hai cách trong PostgreSQL 18 (bảng, và mỗi phòng một tài liệu JSONB — đúng mô hình tài liệu của MongoDB) và đo bốn request thật của LabFlow.</p>

<h3>Cùng dữ liệu, hai hình dạng</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Quan hệ: 3 bảng</span><span class="lz-lnote">labs_r (1.000) · devices_r (30 mỗi phòng = 30.000) · issues_r (5 mỗi thiết bị = 150.000), nối bằng khoá</span></div>
  <div class="lz-layer"><span class="lz-lname">Tài liệu: mỗi phòng một dòng</span><span class="lz-lnote">labs_d.doc = { id, name, devices: [ { id, status, issues: [ … ] } ] } — 10.247 byte JSON, lưu 1.685 byte sau nén</span></div>
</div>
<pre><code class="language-sql">-- bài 9.5: CÙNG dữ liệu, hai cách lưu — quan hệ (3 bảng) và tài liệu (1 cột JSONB mỗi phòng lab)
DROP TABLE IF EXISTS issues_r, devices_r, labs_r, labs_d;
CREATE TABLE labs_r (id int PRIMARY KEY, name text NOT NULL);
CREATE TABLE devices_r (id int PRIMARY KEY, lab_id int NOT NULL REFERENCES labs_r, name text NOT NULL, status text NOT NULL);
CREATE TABLE issues_r (id int PRIMARY KEY, device_id int NOT NULL REFERENCES devices_r, title text NOT NULL, status text NOT NULL);
INSERT INTO labs_r SELECT g, 'Lab ' || g FROM generate_series(1, 1000) g;                                   -- 1.000 phòng
INSERT INTO devices_r SELECT g, (g - 1) / 30 + 1, 'Device ' || g, CASE WHEN g % 97 = 0 THEN 'MAINTENANCE' ELSE 'AVAILABLE' END
  FROM generate_series(1, 30000) g;                                                                         -- 30 thiết bị / phòng
INSERT INTO issues_r SELECT g, (g - 1) / 5 + 1, 'Issue ' || g, CASE WHEN g % 4 = 0 THEN 'OPEN' ELSE 'RESOLVED' END
  FROM generate_series(1, 150000) g;                                                                        -- 5 báo hỏng / thiết bị
CREATE INDEX ON devices_r (lab_id); CREATE INDEX ON issues_r (device_id); CREATE INDEX ON devices_r (status);
CREATE TABLE labs_d (id int PRIMARY KEY, doc jsonb NOT NULL);
INSERT INTO labs_d SELECT l.id, jsonb_build_object('id', l.id, 'name', l.name, 'devices', (
  SELECT jsonb_agg(jsonb_build_object('id', d.id, 'name', d.name, 'status', d.status, 'issues', (
    SELECT jsonb_agg(jsonb_build_object('id', i.id, 'title', i.title, 'status', i.status) ORDER BY i.id) FROM issues_r i WHERE i.device_id = d.id))
    ORDER BY d.id) FROM devices_r d WHERE d.lab_id = l.id)) FROM labs_r l;
CREATE INDEX labs_d_gin ON labs_d USING gin (doc jsonb_path_ops);
ANALYZE labs_r; ANALYZE devices_r; ANALYZE issues_r; ANALYZE labs_d;
SELECT pg_size_pretty(avg(pg_column_size(doc))::bigint) AS avg_doc, pg_size_pretty(pg_total_relation_size('labs_d')) AS doc_table,
  pg_size_pretty(pg_total_relation_size('labs_r') + pg_total_relation_size('devices_r') + pg_total_relation_size('issues_r')) AS relational FROM labs_d;</code></pre>
<p>Tệp này là <code>sql/docs.sql</code> trong gói tải về của chương:</p>
<pre><code class="language-bash">psql -h localhost -p 55432 -U labflow -d labflow -f sql/docs.sql 2&gt;&amp;1 | grep -vE "^$|NOTICE|^(DROP|CREATE) (TABLE|INDEX)|^INSERT 0 [0-9]+$|^ANALYZE$"</code></pre>
<div class="out">  avg_doc   | doc_table | relational
------------+-----------+------------
 1512 bytes | 21 MB     | 17 MB
(1 row)</div>
<p>Rồi <code>perf/doc-vs-rel.mjs</code> gửi các câu hỏi mà endpoint của LabFlow sẽ hỏi, mỗi câu hàng trăm lần, và in trung vị:</p>
<pre><code class="language-bash">node perf/doc-vs-rel.mjs</code></pre>
<div class="out">chi tiết 1 phòng · quan hệ: JOIN + json_agg                median   0.236 ms
chi tiết 1 phòng · tài liệu: một dòng theo khoá chính      median   0.171 ms
sửa 1 thiết bị · quan hệ: UPDATE một dòng                  median   0.102 ms
sửa 1 thiết bị · tài liệu: tìm vị trí trong mảng + jsonb_set median   0.452 ms
mọi thiết bị đang bảo trì · quan hệ: chỉ mục status        median   0.248 ms
mọi thiết bị đang bảo trì · tài liệu: GIN @&gt; rồi bóc mảng  median   8.290 ms
phòng có 20.000 báo hỏng · tài liệu: đọc cả tài liệu       median   8.904 ms
20 báo hỏng mới nhất · quan hệ: chỉ mục + LIMIT 20         median   0.109 ms
tài liệu phòng 9999: 1197841 byte JSON (133163 byte lưu) — mọi lần đọc/sửa đều kéo cả khối
một tài liệu phòng lab: 10247 byte JSON, lưu 1685 byte sau nén — sửa 1 thiết bị là ghi lại CẢ tài liệu</div>

<h3>Đọc kết quả bằng mắt người thiết kế API</h3>
<div class="lz-map">
  <div class="lz-stage">
    <div class="lz-node"><span class="lz-badge">✓</span><span class="lz-nbody"><span class="lz-ntitle">GET /labs/{id} kèm mọi thứ bên trong</span><span class="lz-nsub">tài liệu 0,17 ms so với JOIN 0,24 ms — tài liệu đã chính là response</span></span></div>
    <div class="lz-node"><span class="lz-badge">✗</span><span class="lz-nbody"><span class="lz-ntitle">PATCH /devices/{id}</span><span class="lz-nsub">bảng 0,10 ms so với tài liệu 0,45 ms — tìm vị trí trong mảng, ghi lại cả tài liệu</span></span></div>
  </div>
  <div class="lz-stage">
    <div class="lz-node"><span class="lz-badge">✗</span><span class="lz-nbody"><span class="lz-ntitle">GET /devices?status=MAINTENANCE (xuyên các phòng)</span><span class="lz-nsub">chỉ mục 0,25 ms so với GIN + bóc mảng 8,3 ms — chậm 33 lần</span></span></div>
    <div class="lz-node"><span class="lz-badge">✗</span><span class="lz-nbody"><span class="lz-ntitle">Một phòng nhúng 20.000 báo hỏng</span><span class="lz-nsub">đọc 8,9 ms (1,2 MB JSON) so với “20 báo hỏng mới nhất” từ bảng 0,11 ms</span></span></div>
  </div>
</div>
<p>Khuôn chung: tài liệu thắng khi endpoint <strong>đọc nguyên một khối</strong> — hình dạng response của API khớp hình dạng dữ liệu lưu. Nó thua khi endpoint <strong>sửa từng mẩu nhỏ</strong>, <strong>truy vấn xuyên nhiều khối</strong>, hay khi một danh sách con <strong>lớn lên không giới hạn</strong> (báo hỏng, bình luận, nhật ký). MongoDB giới hạn mỗi tài liệu 16 MB cũng vì lẽ đó: mảng không giới hạn nên ở collection riêng.</p>
<div class="pitfall"><p><strong>Bẫy — thiết kế API theo cách lưu trữ.</strong> Nếu phòng là tài liệu, ta dễ chỉ mở <code>PUT /labs/{id}</code> với cả tài liệu. Hai quản lý sửa hai thiết bị khác nhau sẽ ghi đè lên nhau (5.4), và mỗi thay đổi nhỏ chở 10 KB. Hãy thiết kế tài nguyên mà client cần (<code>/devices/{id}</code>), và để cách lưu đi theo.</p></div>
<a class="link-card" href="https://www.postgresql.org/docs/18/datatype-json.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: tài liệu PostgreSQL 18 — kiểu JSON, chỉ mục jsonb (đọc ngày 1/11/2026)</span><span class="lc-sub">jsonb lưu dạng đã tách và hỗ trợ phép chứa (@>) cùng jsonpath; chỉ mục GIN với jsonb_path_ops phục vụ truy vấn @>. Sửa bất kỳ phần nào của giá trị jsonb là ghi một phiên bản mới của cả dòng.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<a class="link-card" href="https://www.mongodb.com/docs/manual/data-modeling/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: tài liệu MongoDB — Data modeling: nhúng hay tham chiếu (đọc ngày 1/11/2026)</span><span class="lc-sub">Nhúng dữ liệu được đọc cùng nhau; tham chiếu dữ liệu lớn lên không giới hạn hoặc được dùng chung và truy vấn riêng. Giới hạn 16 MB mỗi tài liệu BSON nằm ở mục Limits and Thresholds.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<a class="link-card lien-ket-cheo" href="/courses/server-side-development-nodejs-express-mongodb/learn?lessonSlug=sdn302-3-1-mongodb-crud" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Bạn đã gặp điều này ở SDN302 — 3.1 NoSQL &amp; mô hình tài liệu</span><span class="lc-sub">Nếu đã học SDN302 trên Academy, bạn đã biết collection, document và lựa chọn “nhúng sub-document hay tham chiếu + populate”. Giống: chính lựa chọn đó. Khác: ở đây bạn đo nó từ phía API — đọc một khối 0,17 so với 0,24 ms, nhưng truy vấn xuyên phòng chậm 33 lần và tài liệu thành 1,2 MB khi danh sách con lớn lên. Chưa học SDN302? Bài này vẫn tự đứng được.</span></span>
  <span class="lc-cta">MỞ BÀI SDN302 →</span>
</a>
<a class="link-card" href="/courses/postgresql/learn?lessonSlug=postgresql-17-3-mongodb-vs-jsonb" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Học sâu hơn: khoá PostgreSQL, bài 17.3 — MongoDB vs JSONB</span><span class="lc-sub">Cùng câu hỏi nhìn từ phía CSDL: mỗi loại kho giỏi gì, và chọn ra sao.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Bảng quyết định theo mẫu truy cập</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Chủ yếu “đọc nguyên khối theo id”</span><span class="lz-lnote">tài liệu (hoặc một cột JSONB) — vd cấu hình của phòng, tuỳ chọn của người dùng</span></div>
  <div class="lz-layer"><span class="lz-lname">Nhiều người sửa từng mẩu nhỏ</span><span class="lz-lnote">dòng — mỗi thiết bị, mỗi lượt đặt là một bản ghi có ETag riêng</span></div>
  <div class="lz-layer"><span class="lz-lname">Truy vấn xuyên nhiều cha</span><span class="lz-lnote">dòng + chỉ mục — trạng thái, khoảng thời gian, báo cáo (Lab 8)</span></div>
  <div class="lz-layer"><span class="lz-lname">Danh sách cứ lớn lên</span><span class="lz-lnote">dòng, phân trang bằng cursor — không bao giờ là mảng trong cha</span></div>
</div>
<p>LabFlow giữ bảng PostgreSQL (Chương 12) và có thể dùng một cột JSONB ở chỗ tài nguyên được đọc nguyên khối và không có danh sách lớn dần. Nhiều đội kết thúc y như vậy: quan hệ là mặc định, tài liệu ở chỗ mẫu truy cập đòi hỏi.</p>

<h3>Khi phỏng vấn và khi đi làm</h3>
<ul>
  <li><strong>“Hệ thống này dùng SQL hay NoSQL?”</strong> Liệt kê các endpoint và tần suất trước. Đọc nguyên khối nghiêng về tài liệu; sửa mẩu nhỏ, truy vấn xuyên thực thể và danh sách không giới hạn nghiêng về bảng. Có số thì đưa số: ở đây đọc 0,17 so với 0,24 ms, truy vấn xuyên phòng 8,3 so với 0,25 ms.</li>
  <li><strong>“Nhúng hay tham chiếu?”</strong> Nhúng thứ được đọc cùng nhau và luôn nhỏ; tham chiếu thứ lớn lên hoặc được dùng chung.</li>
</ul>

<h3>🧪 Thực hành (25–35 phút)</h3>
<div class="callout ok"><ol>
  <li>Thêm phép đo thứ năm: “thêm một báo hỏng cho một thiết bị” ở cả hai hình dạng. Cách nào chậm dần theo số báo hỏng đã có?</li>
  <li>Làm truy vấn xuyên phòng nhanh lên trong mô hình tài liệu bằng chỉ mục biểu thức hoặc cột sinh. Bạn đã phải nhân đôi thứ gì?</li>
  <li>Viết path OpenAPI cho <code>GET /labs/{id}?include=devices</code> và <code>PATCH /devices/{id}</code>. Đổi cách lưu thì chúng có phải đổi không?</li>
</ol>
<p><strong>Xong khi:</strong> bạn bảo vệ được một lựa chọn lưu trữ cho LabFlow bằng ba con số của chính mình.</p></div>

<h3>🗂 Thuật ngữ chính</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Mô hình tài liệu</span><span class="v">Tài nguyên lưu cùng các con của nó thành một khối (JSON/BSON).</span></div>
  <div class="kv"><span class="k">Aggregate (khối)</span><span class="v">Cha và các con luôn được đọc và sửa cùng nhau.</span></div>
  <div class="kv"><span class="k">Nhúng / tham chiếu</span><span class="v">Lưu con bên trong cha / lưu riêng kèm id.</span></div>
  <div class="kv"><span class="k">JSONB</span><span class="v">Kiểu JSON nhị phân của PostgreSQL, đánh chỉ mục được bằng GIN.</span></div>
  <div class="kv"><span class="k">Mẫu truy cập</span><span class="v">Truy vấn nào chạy, bao lâu một lần, với bộ lọc nào.</span></div>
  <div class="kv"><span class="k">Mảng không giới hạn</span><span class="v">Danh sách con trong tài liệu cứ lớn mãi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Đọc một phòng: tài liệu 0,17 ms so với JOIN 0,24 ms. Sửa một thiết bị: bảng 0,10 so với tài liệu 0,45 ms.</li>
  <li>Truy vấn xuyên phòng: chỉ mục 0,25 ms so với GIN + bóc mảng 8,3 ms. 20.000 báo hỏng nhúng: một lần đọc 8,9 ms, 1,2 MB.</li>
  <li>Chọn theo mẫu truy cập của API; đừng bao giờ nặn API theo cách lưu.</li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── 9.6 Lab (bài MỚI) ─────────────────────────── */
    {
      title: '9.6 — Lab 9: a notes feed that is cacheable, consistent and ready to shard (with rubric)|||9.6 — Lab 9: luồng ghi chú cache được, nhất quán và sẵn sàng phân mảnh (có thang chấm)',
      slug: 'api-9-6-lab',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Lab chương: id công khai UUIDv7, phân trang cursor, ETag rẻ cho 304 không chạm CSDL, Vary cho token nhất quán, hợp đồng OpenAPI + SLO; thang chấm 10 điểm, lời giải đo thật, gói dự án.',
      content: `${GL9}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lab 9</span>
<h2>Lab 9: a notes feed that is cacheable, consistent and ready to shard</h2>
<p class="lead">Lab notes (9.3) are popular: lab_1 now has 200,000 of them, the app polls the feed every few seconds, and the team plans to shard by lab next year. The feed works but uses page numbers, exposes counter IDs (<code>note_200003</code>), and makes the server rebuild every page for clients whose copy is still current. Your job: change the <em>contract</em> so the feed is cheap to revalidate, consistent after writes, and safe to shard — measuring each step.</p>

<h3>Starting point</h3>
<a class="link-card" href="https://media.cuongthai.com/files/academy/API/v1/labflow-api-ch9-dau.zip" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Starting point: LabFlow API at the start of Chapter 9 (zip)</span><span class="lc-sub"><code>src/routes/notes.js</code> is already the starter (same as <code>lab/notes-starter.js</code>: page numbers, <code>note_N</code> IDs); <code>openapi.yaml</code> has no notes paths yet — tasks 2–6 are yours. <code>npm ci</code>, <code>npm test</code> 10/10.</span></span>
  <span class="lc-cta">DOWNLOAD →</span>
</a>
<p>Chapter code (download below), the primary on 55432 with the replica on 55433 (9.3), and the starter list handler: <code>cp lab/notes-starter.js src/routes/notes.js</code>. Start with <code>LABFLOW_PG=1 LABFLOW_READS=token npm start</code>. Seed the notes once:</p>
<pre><code class="language-sql">INSERT INTO lab_notes (lab_id, author, body, created_at)
SELECT 'lab_1', 'Cô Lan', 'Ghi chú số ' || g, now() - (200000 - g) * interval '1 minute' FROM generate_series(1, 200000) g;
CREATE INDEX IF NOT EXISTS lab_notes_lab ON lab_notes (lab_id, id DESC);</code></pre>
<pre><code class="language-javascript">// routes/notes.js — Lab 9, bản khởi đầu (trích): GET danh sách
labNotesRouter.route('/')
  .get(async (req, res) =&gt; {
    const db = await readPool(req, res);
    // Lab 9 (bản khởi đầu): phân trang ?page=N bằng OFFSET, 20 ghi chú mỗi trang
    const page = Math.max(1, Number.parseInt(req.query.page ?? '1', 10) || 1);
    const { rows } = await req.timing.timeAsync('db', () =&gt;
      db.query('SELECT * FROM lab_notes WHERE lab_id = $1 ORDER BY id DESC LIMIT 20 OFFSET $2', [req.params.labId, (page - 1) * 20]));
    res.json({ data: rows.map(view), page });
  })</code></pre>

<h3>Tasks</h3>
<ol>
  <li><strong>Measure (1 pt).</strong> Server-Timing for <code>?page=1</code> and <code>?page=5000</code>; the first two IDs. What do the IDs tell an outsider?</li>
  <li><strong>Public IDs (2 pts).</strong> Add <code>public_id uuid DEFAULT uuidv7()</code> with a unique index; responses and <code>GET /v2/notes/{id}</code> use it; internal ids never leave the server.</li>
  <li><strong>Cursor pagination (2 pts).</strong> Replace <code>?page</code> with <code>?cursor=&lt;public id of the last note&gt;</code>, ordered by <code>public_id</code>, a <code>Link: rel="next"</code> header and <code>page.next</code>. Reject a malformed cursor with 400.</li>
  <li><strong>Cheap revalidation (2 pts).</strong> An ETag from the newest note of the lab (one index lookup) plus the cursor, checked <em>before</em> reading the page ⇒ 304 without the <code>db</code> step. <code>Cache-Control: public, max-age=5</code>.</li>
  <li><strong>Consistency (1 pt).</strong> Keep <code>LabFlow-Consistency</code> working and add <code>Vary: LabFlow-Consistency</code>. Explain why in one sentence.</li>
  <li><strong>Contract (2 pts).</strong> OpenAPI for the feed (cursor, Link, ETag, 304, Vary) and a note in <code>docs/slo.md</code>: “the feed may be 5 s old; send LabFlow-Consistency to see your own note”.</li>
</ol>

<h3>Rubric (10 points)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Measure — 1</span><span class="v">Both timings with the command; names the count leak.</span></div>
  <div class="kv"><span class="k">Public IDs — 2</span><span class="v">uuidv7 column + unique index; no note_N anywhere in responses; old ids → 404.</span></div>
  <div class="kv"><span class="k">Cursor — 2</span><span class="v">Correct order, Link + page.next, 400 on a bad cursor, deep page as fast as the first.</span></div>
  <div class="kv"><span class="k">Revalidation — 2</span><span class="v">304 without a db mark; a new note changes the ETag.</span></div>
  <div class="kv"><span class="k">Consistency — 1</span><span class="v">Token reads still work; Vary added and explained.</span></div>
  <div class="kv"><span class="k">Contract — 2</span><span class="v">OpenAPI lints; the SLO line matches the measured behaviour.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — <code>max(public_id)</code>.</strong> PostgreSQL has no <code>max()</code> for <code>uuid</code> (the reference solution’s first version failed with exactly that error). Use <code>ORDER BY public_id DESC LIMIT 1</code> — it is one index lookup anyway.</p></div>
<div class="pitfall"><p><strong>Trap — <code>res.set('Vary', …)</code>.</strong> It replaces the whole header, including the <code>Vary: Origin</code> that LabFlow’s CORS middleware set (6.4) — a cache could then reuse one origin’s answer for another. Use <code>res.vary('LabFlow-Consistency')</code>, which appends.</p></div>

<h3>Reference solution and measured results</h3>
<pre><code class="language-bash">for p in 1 5000; do curl -s -D - -o /dev/null "http://localhost:4000/v2/labs/lab_1/notes?page=$p" | grep -i '^server-timing' | tr -d '\\r'; done</code></pre>
<div class="out">Server-Timing: db;dur=7.10, total;dur=9.97
Server-Timing: db;dur=10.37, total;dur=11.16</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/v2/labs/lab_1/notes?page=1' | jq -c '[.data[0:2][].id]'</code></pre>
<div class="out">["note_200003","note_200002"]</div>
<p>Page 5000 costs 10 ms against 7 ms for page 1: the index on <code>(lab_id, id DESC)</code> keeps OFFSET tolerable at this size — Chapter 3 showed 35 ms at OFFSET 900,000 on the full table. The IDs announce “there are about 200,000 notes”.</p>
<pre><code class="language-javascript">// routes/notes.js — Lab 9, lời giải (trích): migration + GET danh sách
// Lab 9 — id công khai: uuidv7 (không lộ số lượng, không đoán được, vẫn xếp theo thời gian) + chỉ mục cho trang theo phòng
await ddlOnce(primary, &#96;ALTER TABLE lab_notes ADD COLUMN IF NOT EXISTS public_id uuid NOT NULL DEFAULT uuidv7()&#96;);
await ddlOnce(primary, &#96;CREATE UNIQUE INDEX IF NOT EXISTS lab_notes_public ON lab_notes (public_id)&#96;);
await ddlOnce(primary, &#96;CREATE INDEX IF NOT EXISTS lab_notes_lab_public ON lab_notes (lab_id, public_id DESC)&#96;);

labNotesRouter.route('/')
  .get(async (req, res) =&gt; {
    // Lab 9 (lời giải): cursor = id công khai của ghi chú cuối trang (uuidv7 xếp theo thời gian) — không còn OFFSET
    const { cursor } = req.query;
    if (cursor !== undefined &amp;&amp; !UUID.test(cursor)) throw new HttpError(400, 'VALIDATION_FAILED', { query: 'cursor' });
    const db = await readPool(req, res);
    const lab = req.params.labId;
    // ETag rẻ: ghi chú mới nhất của phòng (một lần dò chỉ mục) + trang nào ⇒ 304 TRƯỚC khi đọc 20 dòng
    const { rows: [top = {}] } = await req.timing.timeAsync('etag', () =&gt;
      db.query('SELECT public_id::text AS newest FROM lab_notes WHERE lab_id = $1 ORDER BY public_id DESC LIMIT 1', [lab]));
    const tag = &#96;"notes-\${lab}-\${top.newest ?? 'none'}-\${cursor ?? 'first'}"&#96;;
    res.set('ETag', tag).set('Cache-Control', 'public, max-age=5').vary('LabFlow-Consistency');   // client đòi đọc-sau-ghi ⇒ bản cache khác
    const inm = req.get('If-None-Match');
    if (inm &amp;&amp; inm.split(',').map((x) =&gt; x.trim()).includes(tag)) return res.status(304).end();
    const { rows } = await req.timing.timeAsync('db', () =&gt; (cursor
      ? db.query('SELECT * FROM lab_notes WHERE lab_id = $1 AND public_id &lt; $2 ORDER BY public_id DESC LIMIT 21', [lab, cursor])
      : db.query('SELECT * FROM lab_notes WHERE lab_id = $1 ORDER BY public_id DESC LIMIT 21', [lab])));
    const page = rows.slice(0, 20);
    const next = rows.length &gt; 20 ? page[page.length - 1].public_id : null;
    if (next) res.links({ next: &#96;\${req.baseUrl}?cursor=\${next}&#96; });
    res.json({ data: page.map(view), page: { limit: 20, next } });
  })</code></pre>
<pre><code class="language-bash">curl -s -D - -o first.json 'http://localhost:4000/v2/labs/lab_1/notes' | grep -iE '^(etag|cache-control|vary|link|server-timing)' | tr \\
  -d '\\r' | tee hdr9.txt</code></pre>
<div class="out">Vary: Origin, LabFlow-Consistency, Accept-Encoding
ETag: "notes-lab_1-01a19479-e24a-7763-9165-c70f699f9c9a-first"
Cache-Control: public, max-age=5
Link: &lt;/v2/labs/lab_1/notes?cursor=01a19479-e24a-7715-bd1a-e2ccf9d1a20f&gt;; rel="next"
Server-Timing: etag;dur=0.55, db;dur=0.72, total;dur=2.08</div>
<pre><code class="language-bash">curl -s -D - -o /dev/null 'http://localhost:4000/v2/labs/lab_1/notes?cursor=01a19479-e112-7df1-827e-2e802e632952' | grep -i '^server-timing' | tr \\
  -d '\\r'</code></pre>
<div class="out">Server-Timing: etag;dur=0.67, db;dur=0.62, total;dur=1.80</div>
<pre><code class="language-bash">curl -s -D - -o /dev/null 'http://localhost:4000/v2/labs/lab_1/notes' \\
  -H "If-None-Match: $(grep -i ^etag hdr9.txt | cut -d' ' -f2)" | grep -iE '^(HTTP|server-timing)' | tr \\
  -d '\\r'</code></pre>
<div class="out">HTTP/1.1 304 Not Modified
Server-Timing: etag;dur=0.52, total;dur=0.86</div>
<pre><code class="language-bash">jq -c '[.data[0:2][].id]' first.json</code></pre>
<div class="out">["01a19479-e24a-7763-9165-c70f699f9c9a","01a19479-e24a-775e-a2cc-caa73cbbb86b"]</div>
<pre><code class="language-bash">psql -h localhost -p 55432 -U labflow -d labflow -Atc "SELECT uuid_extract_timestamp('$(jq -r '.data[0].id' first.json)')"</code></pre>
<div class="out">2026-11-01 07:19:38.186+07</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">First page · 2.1 ms</span><span class="lz-lnote">etag 0.55 ms + db 0.72 ms; Link to the next page</span></div>
  <div class="lz-layer"><span class="lz-lname">Deep page (100,000 notes in) · 1.8 ms</span><span class="lz-lnote">as fast as the first: the cursor is an index position</span></div>
  <div class="lz-layer"><span class="lz-lname">Revalidation · 304 in 0.86 ms</span><span class="lz-lnote">no db step — a polling app costs one index lookup</span></div>
</div>
<p><strong>Why Vary: LabFlow-Consistency?</strong> A shared cache may serve the 5-second-old public feed to anyone — except to a client that just posted and sent a token; with Vary, that request is a different cache entry and reaches LabFlow.</p>
<p><strong>Discuss — a finding of the reference run.</strong> The first note’s UUIDv7 says it was created at 07:19:38 on 1 Nov — the moment of the <code>ALTER TABLE</code>, not when the note was written (its <code>created_at</code> is up to 200,000 minutes earlier). Backfilled UUIDv7 values carry the migration time. Does LabFlow care? If yes, backfill with <code>uuidv7(created_at - now())</code>.</p>

<a class="link-card" href="https://media.cuongthai.com/files/academy/API/v1/labflow-api-ch9-b.zip" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Download: LabFlow API at the end of Chapter 9 (labflow-api-ch9-b.zip)</span><span class="lc-sub">Chapter code = this lab’s solution: httpCache.js, serverCache.js (Redis), stats and notes routes (LABFLOW_PG=1), perf/ scripts (cache-proxy, stampede, shards, doc-vs-rel), SQL files (ids, shards, docs) and lab/notes-starter.js. npm install, npm test.</span></span>
  <span class="lc-cta">DOWNLOAD →</span>
</a>

<h3>📌 What this lab shows</h3>
<ul>
  <li>Contract changes, not hardware: public UUIDv7 ids, cursor pages, a cheap ETag, a consistency header with Vary.</li>
  <li>Deep pages as fast as the first (1.8 vs 2.1 ms); polling costs a 0.86 ms 304.</li>
  <li>Two traps: no <code>max()</code> for uuid; <code>res.set('Vary')</code> erases the other Vary values.</li>
  <li>Backfilled UUIDv7 ids carry the migration time, not the creation time.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Lab 9</span>
<h2>Lab 9: luồng ghi chú cache được, nhất quán và sẵn sàng phân mảnh</h2>
<p class="lead">Ghi chú phòng lab (9.3) được dùng nhiều: lab_1 giờ có 200.000 ghi chú, app hỏi lại luồng ghi chú vài giây một lần, và năm sau nhóm định chia mảnh theo phòng. Luồng ghi chú chạy được nhưng dùng số trang, lộ id bộ đếm (<code>note_200003</code>), và bắt server dựng lại mọi trang cho cả những client mà bản của họ vẫn còn đúng. Việc của bạn: đổi <em>hợp đồng</em> để luồng ghi chú kiểm lại được với giá rẻ, nhất quán sau khi ghi, và an toàn khi phân mảnh — đo từng bước.</p>

<h3>Điểm xuất phát</h3>
<a class="link-card" href="https://media.cuongthai.com/files/academy/API/v1/labflow-api-ch9-dau.zip" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Điểm xuất phát: LabFlow API đầu Chương 9 (zip)</span><span class="lc-sub"><code>src/routes/notes.js</code> đã là bản khởi đầu (giống <code>lab/notes-starter.js</code>: số trang, id <code>note_N</code>); <code>openapi.yaml</code> chưa có path ghi chú — nhiệm vụ 2–6 là của bạn. <code>npm ci</code>, <code>npm test</code> 10/10.</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>
<p>Code của chương (tải ở cuối bài), primary ở 55432 với replica ở 55433 (9.3), và handler danh sách khởi đầu: <code>cp lab/notes-starter.js src/routes/notes.js</code>. Khởi động bằng <code>LABFLOW_PG=1 LABFLOW_READS=token npm start</code>. Nạp ghi chú một lần:</p>
<pre><code class="language-sql">INSERT INTO lab_notes (lab_id, author, body, created_at)
SELECT 'lab_1', 'Cô Lan', 'Ghi chú số ' || g, now() - (200000 - g) * interval '1 minute' FROM generate_series(1, 200000) g;
CREATE INDEX IF NOT EXISTS lab_notes_lab ON lab_notes (lab_id, id DESC);</code></pre>
<pre><code class="language-javascript">// routes/notes.js — Lab 9, bản khởi đầu (trích): GET danh sách
labNotesRouter.route('/')
  .get(async (req, res) =&gt; {
    const db = await readPool(req, res);
    // Lab 9 (bản khởi đầu): phân trang ?page=N bằng OFFSET, 20 ghi chú mỗi trang
    const page = Math.max(1, Number.parseInt(req.query.page ?? '1', 10) || 1);
    const { rows } = await req.timing.timeAsync('db', () =&gt;
      db.query('SELECT * FROM lab_notes WHERE lab_id = $1 ORDER BY id DESC LIMIT 20 OFFSET $2', [req.params.labId, (page - 1) * 20]));
    res.json({ data: rows.map(view), page });
  })</code></pre>

<h3>Nhiệm vụ</h3>
<ol>
  <li><strong>Đo (1 điểm).</strong> Server-Timing của <code>?page=1</code> và <code>?page=5000</code>; hai id đầu tiên. Các id cho người ngoài biết điều gì?</li>
  <li><strong>Id công khai (2 điểm).</strong> Thêm <code>public_id uuid DEFAULT uuidv7()</code> kèm chỉ mục duy nhất; response và <code>GET /v2/notes/{id}</code> dùng nó; id nội bộ không bao giờ rời server.</li>
  <li><strong>Phân trang cursor (2 điểm).</strong> Thay <code>?page</code> bằng <code>?cursor=&lt;id công khai của ghi chú cuối trang&gt;</code>, sắp theo <code>public_id</code>, có header <code>Link: rel="next"</code> và <code>page.next</code>. Cursor sai dạng ⇒ 400.</li>
  <li><strong>Kiểm lại giá rẻ (2 điểm).</strong> ETag lấy từ ghi chú mới nhất của phòng (một lần dò chỉ mục) cộng cursor, so <em>trước</em> khi đọc trang ⇒ 304 không có bước <code>db</code>. <code>Cache-Control: public, max-age=5</code>.</li>
  <li><strong>Nhất quán (1 điểm).</strong> Giữ <code>LabFlow-Consistency</code> chạy được và thêm <code>Vary: LabFlow-Consistency</code>. Giải thích vì sao trong một câu.</li>
  <li><strong>Hợp đồng (2 điểm).</strong> OpenAPI cho luồng ghi chú (cursor, Link, ETag, 304, Vary) và một dòng trong <code>docs/slo.md</code>: “luồng ghi chú có thể cũ 5 giây; gửi LabFlow-Consistency để thấy ghi chú của chính mình”.</li>
</ol>

<h3>Thang chấm (10 điểm)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Đo — 1</span><span class="v">Cả hai số đo kèm lệnh; nói ra được chuyện lộ số lượng.</span></div>
  <div class="kv"><span class="k">Id công khai — 2</span><span class="v">Cột uuidv7 + chỉ mục duy nhất; không còn note_N trong response nào; id cũ ⇒ 404.</span></div>
  <div class="kv"><span class="k">Cursor — 2</span><span class="v">Đúng thứ tự, Link + page.next, 400 khi cursor hỏng, trang sâu nhanh như trang đầu.</span></div>
  <div class="kv"><span class="k">Kiểm lại — 2</span><span class="v">304 không có mốc db; ghi chú mới làm đổi ETag.</span></div>
  <div class="kv"><span class="k">Nhất quán — 1</span><span class="v">Đọc có token vẫn chạy; đã thêm Vary và giải thích.</span></div>
  <div class="kv"><span class="k">Hợp đồng — 2</span><span class="v">OpenAPI lint sạch; dòng SLO khớp hành vi đo được.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — <code>max(public_id)</code>.</strong> PostgreSQL không có <code>max()</code> cho <code>uuid</code> (bản đầu của lời giải tham khảo hỏng đúng lỗi đó). Dùng <code>ORDER BY public_id DESC LIMIT 1</code> — đằng nào cũng là một lần dò chỉ mục.</p></div>
<div class="pitfall"><p><strong>Bẫy — <code>res.set('Vary', …)</code>.</strong> Nó thay cả header, kể cả <code>Vary: Origin</code> mà middleware CORS của LabFlow đã đặt (6.4) — cache khi đó có thể dùng câu trả lời của origin này cho origin khác. Dùng <code>res.vary('LabFlow-Consistency')</code>, hàm này nối thêm.</p></div>

<h3>Lời giải tham khảo và kết quả đo</h3>
<pre><code class="language-bash">for p in 1 5000; do curl -s -D - -o /dev/null "http://localhost:4000/v2/labs/lab_1/notes?page=$p" | grep -i '^server-timing' | tr -d '\\r'; done</code></pre>
<div class="out">Server-Timing: db;dur=7.10, total;dur=9.97
Server-Timing: db;dur=10.37, total;dur=11.16</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/v2/labs/lab_1/notes?page=1' | jq -c '[.data[0:2][].id]'</code></pre>
<div class="out">["note_200003","note_200002"]</div>
<p>Trang 5000 tốn 10 ms so với 7 ms của trang 1: chỉ mục <code>(lab_id, id DESC)</code> giữ cho OFFSET còn chịu được ở cỡ này — Chương 3 đã thấy 35 ms ở OFFSET 900.000 trên cả bảng. Các id thông báo “có khoảng 200.000 ghi chú”.</p>
<pre><code class="language-javascript">// routes/notes.js — Lab 9, lời giải (trích): migration + GET danh sách
// Lab 9 — id công khai: uuidv7 (không lộ số lượng, không đoán được, vẫn xếp theo thời gian) + chỉ mục cho trang theo phòng
await ddlOnce(primary, &#96;ALTER TABLE lab_notes ADD COLUMN IF NOT EXISTS public_id uuid NOT NULL DEFAULT uuidv7()&#96;);
await ddlOnce(primary, &#96;CREATE UNIQUE INDEX IF NOT EXISTS lab_notes_public ON lab_notes (public_id)&#96;);
await ddlOnce(primary, &#96;CREATE INDEX IF NOT EXISTS lab_notes_lab_public ON lab_notes (lab_id, public_id DESC)&#96;);

labNotesRouter.route('/')
  .get(async (req, res) =&gt; {
    // Lab 9 (lời giải): cursor = id công khai của ghi chú cuối trang (uuidv7 xếp theo thời gian) — không còn OFFSET
    const { cursor } = req.query;
    if (cursor !== undefined &amp;&amp; !UUID.test(cursor)) throw new HttpError(400, 'VALIDATION_FAILED', { query: 'cursor' });
    const db = await readPool(req, res);
    const lab = req.params.labId;
    // ETag rẻ: ghi chú mới nhất của phòng (một lần dò chỉ mục) + trang nào ⇒ 304 TRƯỚC khi đọc 20 dòng
    const { rows: [top = {}] } = await req.timing.timeAsync('etag', () =&gt;
      db.query('SELECT public_id::text AS newest FROM lab_notes WHERE lab_id = $1 ORDER BY public_id DESC LIMIT 1', [lab]));
    const tag = &#96;"notes-\${lab}-\${top.newest ?? 'none'}-\${cursor ?? 'first'}"&#96;;
    res.set('ETag', tag).set('Cache-Control', 'public, max-age=5').vary('LabFlow-Consistency');   // client đòi đọc-sau-ghi ⇒ bản cache khác
    const inm = req.get('If-None-Match');
    if (inm &amp;&amp; inm.split(',').map((x) =&gt; x.trim()).includes(tag)) return res.status(304).end();
    const { rows } = await req.timing.timeAsync('db', () =&gt; (cursor
      ? db.query('SELECT * FROM lab_notes WHERE lab_id = $1 AND public_id &lt; $2 ORDER BY public_id DESC LIMIT 21', [lab, cursor])
      : db.query('SELECT * FROM lab_notes WHERE lab_id = $1 ORDER BY public_id DESC LIMIT 21', [lab])));
    const page = rows.slice(0, 20);
    const next = rows.length &gt; 20 ? page[page.length - 1].public_id : null;
    if (next) res.links({ next: &#96;\${req.baseUrl}?cursor=\${next}&#96; });
    res.json({ data: page.map(view), page: { limit: 20, next } });
  })</code></pre>
<pre><code class="language-bash">curl -s -D - -o first.json 'http://localhost:4000/v2/labs/lab_1/notes' | grep -iE '^(etag|cache-control|vary|link|server-timing)' | tr \\
  -d '\\r' | tee hdr9.txt</code></pre>
<div class="out">Vary: Origin, LabFlow-Consistency, Accept-Encoding
ETag: "notes-lab_1-01a19479-e24a-7763-9165-c70f699f9c9a-first"
Cache-Control: public, max-age=5
Link: &lt;/v2/labs/lab_1/notes?cursor=01a19479-e24a-7715-bd1a-e2ccf9d1a20f&gt;; rel="next"
Server-Timing: etag;dur=0.55, db;dur=0.72, total;dur=2.08</div>
<pre><code class="language-bash">curl -s -D - -o /dev/null 'http://localhost:4000/v2/labs/lab_1/notes?cursor=01a19479-e112-7df1-827e-2e802e632952' | grep -i '^server-timing' | tr \\
  -d '\\r'</code></pre>
<div class="out">Server-Timing: etag;dur=0.67, db;dur=0.62, total;dur=1.80</div>
<pre><code class="language-bash">curl -s -D - -o /dev/null 'http://localhost:4000/v2/labs/lab_1/notes' \\
  -H "If-None-Match: $(grep -i ^etag hdr9.txt | cut -d' ' -f2)" | grep -iE '^(HTTP|server-timing)' | tr \\
  -d '\\r'</code></pre>
<div class="out">HTTP/1.1 304 Not Modified
Server-Timing: etag;dur=0.52, total;dur=0.86</div>
<pre><code class="language-bash">jq -c '[.data[0:2][].id]' first.json</code></pre>
<div class="out">["01a19479-e24a-7763-9165-c70f699f9c9a","01a19479-e24a-775e-a2cc-caa73cbbb86b"]</div>
<pre><code class="language-bash">psql -h localhost -p 55432 -U labflow -d labflow -Atc "SELECT uuid_extract_timestamp('$(jq -r '.data[0].id' first.json)')"</code></pre>
<div class="out">2026-11-01 07:19:38.186+07</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Trang đầu · 2,1 ms</span><span class="lz-lnote">etag 0,55 ms + db 0,72 ms; Link tới trang sau</span></div>
  <div class="lz-layer"><span class="lz-lname">Trang sâu (sau 100.000 ghi chú) · 1,8 ms</span><span class="lz-lnote">nhanh như trang đầu: cursor là một vị trí trong chỉ mục</span></div>
  <div class="lz-layer"><span class="lz-lname">Kiểm lại · 304 trong 0,86 ms</span><span class="lz-lnote">không có bước db — một app hỏi lại liên tục chỉ tốn một lần dò chỉ mục</span></div>
</div>
<p><strong>Vì sao Vary: LabFlow-Consistency?</strong> Cache dùng chung được phép đưa luồng ghi chú công khai cũ 5 giây cho bất kỳ ai — trừ client vừa đăng bài và gửi token; có Vary, request đó là một mục cache khác và đi tới LabFlow.</p>
<p><strong>Thảo luận — một phát hiện của lần chạy tham khảo.</strong> UUIDv7 của ghi chú đầu tiên nói nó được tạo lúc 07:19:38 ngày 1/11 — đúng lúc chạy <code>ALTER TABLE</code>, không phải lúc ghi chú được viết (<code>created_at</code> của nó sớm hơn tới 200.000 phút). UUIDv7 điền bù mang thời điểm migration. LabFlow có quan tâm không? Nếu có, điền bằng <code>uuidv7(created_at - now())</code>.</p>

<a class="link-card" href="https://media.cuongthai.com/files/academy/API/v1/labflow-api-ch9-b.zip" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Tải về: LabFlow API cuối Chương 9 (labflow-api-ch9-b.zip)</span><span class="lc-sub">Code của chương = lời giải lab này: httpCache.js, serverCache.js (Redis), route stats và notes (LABFLOW_PG=1), các script perf/ (cache-proxy, stampede, shards, doc-vs-rel), tệp SQL (ids, shards, docs) và lab/notes-starter.js. npm install, npm test.</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>📌 Lab này cho thấy</h3>
<ul>
  <li>Đổi hợp đồng, không đổi phần cứng: id công khai UUIDv7, trang theo cursor, ETag giá rẻ, header nhất quán kèm Vary.</li>
  <li>Trang sâu nhanh như trang đầu (1,8 so với 2,1 ms); hỏi lại liên tục chỉ tốn một 304 trong 0,86 ms.</li>
  <li>Hai cái bẫy: không có <code>max()</code> cho uuid; <code>res.set('Vary')</code> xoá các giá trị Vary khác.</li>
  <li>UUIDv7 điền bù mang thời điểm migration, không phải thời điểm tạo.</li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── 9.7 Quiz (bài MỚI) ─────────────────────────── */
    {
      title: '9.7 — Chapter 9 check: data at scale|||9.7 — Kiểm tra Chương 9: dữ liệu khi lớn lên',
      slug: 'api-9-7-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống về 304 và ETag, cache dùng chung làm lộ dữ liệu, giẫm đạp cache, jitter, replica và token nhất quán, offset qua nhiều mảnh, UUIDv7, tài liệu và bảng, Vary; mỗi câu có giải thích.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Check</span>
<h2>Chapter 9 check: data at scale</h2>
<p class="lead">Ten situations from the chapter’s measurements: ETags and 304, a shared cache that leaked data, a cache stampede, a read replica, UUIDs, offset across shards and documents versus tables. Each explanation says why the right answer is right and why the most tempting wrong answer is wrong. Aim for 7/10.</p>
<h3>Self-check before you start</h3>
<ul>
  <li>I can choose Cache-Control for public and per-user endpoints and make 304 skip the work.</li>
  <li>I can explain a cache stampede and stop it with single-flight.</li>
  <li>I can explain a stale read after a write and fix it in the contract.</li>
  <li>I can pick IDs and pagination that survive sharding.</li>
  <li>I can argue SQL vs document storage from an API’s access patterns, with numbers.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Kiểm tra</span>
<h2>Kiểm tra Chương 9: dữ liệu khi lớn lên</h2>
<p class="lead">Mười tình huống từ chính các phép đo của chương: ETag và 304, một cache dùng chung làm lộ dữ liệu, cú giẫm đạp cache, bản sao đọc, UUID, offset qua nhiều mảnh và tài liệu so với bảng. Mỗi phần giải thích nói vì sao đáp án đúng là đúng và vì sao phương án hấp dẫn nhất lại sai. Nhắm 7/10.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
  <li>Tôi chọn được Cache-Control cho endpoint công khai và endpoint riêng, và làm 304 bỏ qua được công việc.</li>
  <li>Tôi giải thích được cú giẫm đạp cache và chặn nó bằng single-flight.</li>
  <li>Tôi giải thích được lần đọc cũ sau khi ghi và sửa nó trong hợp đồng.</li>
  <li>Tôi chọn được định danh và cách phân trang sống sót qua sharding.</li>
  <li>Tôi lập luận được SQL hay lưu tài liệu từ mẫu truy cập của API, có số liệu.</li>
</ul>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: "Express answered 304 to If-None-Match on 100 bookings, yet throughput stayed ~1,033 req/s. Why?|||Express trả 304 cho If-None-Match trên 100 lượt đặt, nhưng thông lượng vẫn ~1.033 req/s. Vì sao?",
            options: [
              "Its ETag is a hash of the body, so the query and JSON still run before comparing|||ETag của nó là băm của body, nên truy vấn và JSON vẫn chạy trước khi so",
              "304 responses are not supported by autocannon|||autocannon không hỗ trợ response 304",
              "Weak ETags are always ignored by clients|||Client luôn bỏ qua ETag yếu",
              "The rate limit slowed down the conditional requests|||Giới hạn tần suất làm chậm các request có điều kiện",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: Lesson 9.1. 304 saved bytes (5 MB vs 458 MB) but not work. A version ETag checked before the query gave 9,112 req/s.|||VI: Bài 9.1. 304 tiết kiệm byte (5 MB so với 458 MB) nhưng không tiết kiệm công. ETag phiên bản so trước truy vấn cho 9.112 req/s.",
          },
          {
            question: "Through a shared cache, Bình received An’s bookings. What caused it?|||Qua cache dùng chung, Bình nhận được lượt đặt của An. Nguyên nhân là gì?",
            options: [
              "The per-user list was marked Cache-Control: public, max-age=60|||Danh sách riêng bị ghi Cache-Control: public, max-age=60",
              "An’s JWT had expired|||JWT của An đã hết hạn",
              "The ETag did not include the user id|||ETag không chứa id người dùng",
              "The cache ignored the Vary header|||Cache bỏ qua header Vary",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: Lesson 9.1. With public a shared cache may store answers to requests with Authorization (RFC 9111 §3.5). private, no-cache fixed it. LabFlow never saw Bình’s request, so no permission check ran.|||VI: Bài 9.1. Có public, cache dùng chung được lưu câu trả lời của request có Authorization (RFC 9111 §3.5). private, no-cache sửa được. LabFlow không hề thấy request của Bình nên không phép kiểm quyền nào chạy.",
          },
          {
            question: "The stats key expired while 50 requests arrived. With plain Redis cache-aside the database was queried 32 times. What brings it to 1?|||Khoá stats hết hạn đúng lúc 50 request tới. Với cache-aside Redis thường, CSDL bị hỏi 32 lần. Cái gì đưa nó về 1?",
            options: [
              "A longer TTL|||TTL dài hơn",
              "A bigger connection pool|||Pool kết nối lớn hơn",
              "Single-flight: concurrent misses share one load|||Single-flight: các lần trượt đồng thời dùng chung một lần nạp",
              "Deleting the key on every write|||Xoá khoá ở mỗi lệnh ghi",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: Lesson 9.2. A longer TTL only makes stampedes rarer, not smaller. Single-flight works per instance; across instances use a lock (SET NX) or early refresh.|||VI: Bài 9.2. TTL dài hơn chỉ làm giẫm đạp hiếm hơn, không nhỏ hơn. Single-flight chạy trong từng bản; nhiều bản thì dùng khoá (SET NX) hoặc làm mới sớm.",
          },
          {
            question: "Why is the TTL of stats:labs:v1 11 seconds when the code asks for 10?|||Vì sao TTL của stats:labs:v1 là 11 giây khi code xin 10?",
            options: [
              "Redis rounds TTLs up|||Redis làm tròn TTL lên",
              "Up to 10% jitter so keys written together do not expire together|||Tới 10% jitter để các khoá ghi cùng lúc không hết hạn cùng lúc",
              "The first request took one second|||Request đầu tốn một giây",
              "node-redis adds one second by default|||node-redis mặc định cộng thêm một giây",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: Lesson 9.2. Jitter spreads expiries; it reduces synchronized misses but does not replace single-flight.|||VI: Bài 9.2. Jitter rải các lần hết hạn; nó giảm trượt đồng loạt nhưng không thay được single-flight.",
          },
          {
            question: "Lan posted a note; an immediate GET returned 404, and 2.5 s later 200. What is the cause?|||Cô Lan đăng một ghi chú; GET ngay sau đó trả 404, 2,5 giây sau ra 200. Nguyên nhân là gì?",
            options: [
              "The POST failed and was retried|||POST hỏng và được thử lại",
              "The HTTP cache stored the 404|||Cache HTTP đã lưu 404",
              "The note id was wrong|||Id ghi chú sai",
              "The read went to a replica that had not applied the commit yet|||Lần đọc đi tới replica chưa áp dụng commit",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: Lesson 9.3. Replication lag (2 s apply delay here). Fixes: return the written resource, read-your-writes, or a consistency token.|||VI: Bài 9.3. Độ trễ nhân bản (ở đây trễ áp dụng 2 giây). Sửa: trả tài nguyên vừa ghi, đọc-cái-mình-ghi, hoặc token nhất quán.",
          },
          {
            question: "A GET carries LabFlow-Consistency: 0/12025438 while the replica is 2 s behind. What does LabFlow do?|||Một GET mang LabFlow-Consistency: 0/12025438 trong khi replica chậm 2 giây. LabFlow làm gì?",
            options: [
              "Waits up to 300 ms for the replica, then reads the primary|||Chờ replica tối đa 300 ms, rồi đọc primary",
              "Answers 503 until the replica catches up|||Trả 503 cho tới khi replica đuổi kịp",
              "Reads the replica and returns 404|||Đọc replica và trả 404",
              "Ignores the header for GET requests|||Bỏ qua header với GET",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: Lesson 9.3. Measured: wait 318 ms, LabFlow-Read-From: primary, 200. 2.5 s later the same token stayed on the replica after a 0.4 ms check.|||VI: Bài 9.3. Đo được: chờ 318 ms, LabFlow-Read-From: primary, 200. 2,5 giây sau cùng token ở lại replica sau 0,4 ms kiểm tra.",
          },
          {
            question: "Each of two shards ran OFFSET 19980 LIMIT 20 and the results were merged. The page was…|||Mỗi mảnh trong hai mảnh chạy OFFSET 19980 LIMIT 20 rồi gộp kết quả. Trang nhận được…",
            options: [
              "correct but slow|||đúng nhưng chậm",
              "wrong — the newest 19,980 overall are not 19,980 from each shard|||sai — 19.980 dòng mới nhất của cả bảng không phải 19.980 dòng của mỗi mảnh",
              "correct and fast|||đúng và nhanh",
              "empty|||rỗng",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: Lesson 9.4. Correct offset needs offset+limit from every shard (40,000 rows, 52 ms); a cursor needs limit from each (40 rows, 1.9 ms) and is right.|||VI: Bài 9.4. Offset đúng cần offset+limit dòng từ mọi mảnh (40.000 dòng, 52 ms); cursor cần limit dòng mỗi mảnh (40 dòng, 1,9 ms) và đúng.",
          },
          {
            question: "Which statement about UUIDv7 public IDs is true?|||Câu nào về id công khai UUIDv7 là đúng?",
            options: [
              "They are random, so they reveal nothing|||Chúng ngẫu nhiên nên không lộ gì",
              "They make the primary-key index bigger than UUIDv4|||Chúng làm chỉ mục khoá chính lớn hơn UUIDv4",
              "They reveal the creation time (or the backfill time)|||Chúng lộ thời điểm tạo (hoặc thời điểm điền bù)",
              "PostgreSQL 18 needs an extension to generate them|||PostgreSQL 18 cần extension để sinh chúng",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: Lessons 9.4 and Lab 9. uuid_extract_timestamp() reads the time; index 30 MB vs 37 MB for v4; uuidv7() is built into PostgreSQL 18. Backfilled values carried the migration time.|||VI: Bài 9.4 và Lab 9. uuid_extract_timestamp() đọc được thời gian; chỉ mục 30 MB so với 37 MB của v4; uuidv7() có sẵn trong PostgreSQL 18. Giá trị điền bù mang thời điểm migration.",
          },
          {
            question: "Which LabFlow request did the JSONB document model serve FASTER than tables?|||Request nào của LabFlow được mô hình tài liệu JSONB phục vụ NHANH hơn bảng?",
            options: [
              "GET /devices?status=MAINTENANCE across labs|||GET /devices?status=MAINTENANCE xuyên các phòng",
              "PATCH one device|||PATCH một thiết bị",
              "The 20 newest issues of a device|||20 báo hỏng mới nhất của một thiết bị",
              "GET one lab with its devices inside|||GET một phòng kèm thiết bị bên trong",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: Lesson 9.5. 0.17 vs 0.24 ms — the stored shape is the response. Cross-lab query 8.3 vs 0.25 ms, device update 0.45 vs 0.10 ms, 20,000 embedded issues an 8.9 ms read.|||VI: Bài 9.5. 0,17 so với 0,24 ms — hình dạng lưu chính là response. Truy vấn xuyên phòng 8,3 so với 0,25 ms, sửa thiết bị 0,45 so với 0,10 ms, 20.000 báo hỏng nhúng là một lần đọc 8,9 ms.",
          },
          {
            question: "In Lab 9, why does the notes feed send Vary: LabFlow-Consistency?|||Ở Lab 9, vì sao luồng ghi chú gửi Vary: LabFlow-Consistency?",
            options: [
              "So a request carrying a consistency token is not served the shared 5-second-old copy|||Để request mang token nhất quán không bị phục vụ bằng bản dùng chung cũ 5 giây",
              "To compress responses differently per user|||Để nén response khác nhau cho từng người",
              "Because Express requires it for custom headers|||Vì Express bắt buộc với header tự đặt",
              "To make the ETag weak|||Để làm ETag thành ETag yếu",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: Lab 9. Vary makes the header part of the cache key. Use res.vary() — res.set('Vary') would erase Vary: Origin from CORS.|||VI: Lab 9. Vary đưa header vào khoá cache. Dùng res.vary() — res.set('Vary') sẽ xoá Vary: Origin của CORS.",
          },
        ],
      },
    },
  ],
};
