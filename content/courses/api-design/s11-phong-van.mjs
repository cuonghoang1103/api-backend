/**
 * API Design — Chương 11: Vòng phỏng vấn thiết kế API (soạn chi tiết 01/11/2026).
 * Output CHẠY THẬT: Node v22.23.3, Express 5.3.0, PostgreSQL 18.4 (:55432), Redis 8.2.2 (:6390), Chromium (Playwright 1.64.1), autocannon 8.0.0.
 * 11.1 khung 45 phút + thang chấm 6 tiêu chí + ước lượng đối chiếu số đo (GET /v2/labs ~8.000 req/s, bảng bookings 168 B/dòng);
 * 11.2 rút gọn link (1): hợp đồng chạy thật (409/422/410/429), trùng mã trên 1 triệu link (ngẫu nhiên 5/6/7 ký tự ~550/8–13/0–1, băm như ngẫu nhiên,
 * bộ đếm 0 nhưng đoán được); 11.3 rút gọn link (2): 301 bị Chromium cache ⇒ server đếm 2/10, 302 đếm 10/10; 10.900–15.100 chuyển hướng/s, UPDATE mỗi
 * lượt bấm −21–39%, XADD −0–12%; 11.4 feed: fan-out khi ghi 100.000 người theo dõi = 200.000 lệnh Redis ~0,5 s, khi đọc 1.000 nguồn 7,7–16,7 ms,
 * lai 0,16–0,68 ms, offset lặp 1 bài; 11.5 chat: không clientMessageId 66 tin trùng/200, có 0; giờ máy client 200/200 sai chỗ; 11.6 đặt lịch = LabFlow
 * (bảng bằng chứng Ch3–10; 50 người cùng bấm: kiểm-rồi-chèn 50 lượt đặt, FOR UPDATE / SERIALIZABLE (40001) / EXCLUDE USING gist đúng 1; giữ chỗ hết hạn
 * vẫn chặn). Lab 11 phỏng vấn thử API sự kiện CLB + lab/grade-lab11.mjs (khởi đầu 0/10, bẫy YAML 2/10, lời giải 10/10). Mã: interview/ trong LabFlow.
 * Slide: api-11-1 … api-11-6 + api-lab-11. Tệp sinh một lần bằng script ngoài repo — từ nay SỬA THẲNG tệp này (luật thoát ký tự _HOP-DONG.md mục 3).
 * GIỮ slug khung api-11-1-khung, api-11-2-rut-gon-link (11.2), api-11-3-feed-chat (11.4), api-11-4-dat-lich (11.6) và title chương;
 * bài MỚI: 11.3 api-11-2-chuyen-huong, 11.5 api-11-3-chat; lab api-11-7-lab, quiz api-11-8-quiz.
 */

import G111 from './giang/api-11-1.mjs';
import G112 from './giang/api-11-2.mjs';
import G113 from './giang/api-11-3.mjs';
import G114 from './giang/api-11-4.mjs';
import G115 from './giang/api-11-5.mjs';
import G116 from './giang/api-11-6.mjs';
import GL11 from './giang/api-lab-11.mjs';

export default {
  title: 'Chapter 11 — The system design interview|||Chương 11 — Vòng phỏng vấn system design',
  description: 'Vòng phỏng vấn thiết kế API, luyện bằng số đo thật: khung trả lời 45 phút (làm rõ → tài nguyên/endpoint → lỗi/phân trang → auth/rate limit/phiên bản → quy mô) với thang chấm 6 tiêu chí; bốn đề kinh điển có bản ghi phỏng vấn mẫu, câu yếu và câu mạnh: rút gọn link (trùng mã Base62/ngẫu nhiên/băm trên 1 triệu link, 301 bị trình duyệt cache, đường nóng), news feed (fan-out khi ghi/khi đọc trên Redis với 100.000 người theo dõi), chat (tin trùng khi mạng rớt, thứ tự theo seq), đặt lịch = LabFlow (bảng bằng chứng Ch3–10, 50 người cùng bấm, ràng buộc loại trừ trong PostgreSQL); lab phỏng vấn thử API sự kiện CLB có script chấm, quiz 10 câu.',
  lessons: [
    /* ─────────────────────────── 11.1 ─────────────────────────── */
    {
      title: '11.1 — A framework for API design interview questions (full system design → System Design)|||11.1 — Khung trả lời câu hỏi phỏng vấn thiết kế API (system design trọn vẹn → khoá System Design)',
      slug: 'api-11-1-khung',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Mở đầu chương: học xong làm được gì. Khung 45 phút năm bước, câu hỏi làm rõ, ước lượng theo đỉnh đối chiếu số đo thật (GET /v2/labs ~8.000 req/s, 168 byte/lượt đặt), bản ghi phỏng vấn mẫu, câu yếu và câu mạnh, thang chấm 6 tiêu chí.',
      content: `${G111}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.1</span>
<h2>A framework for API design interview questions</h2>
<p class="lead">“Design the API for a URL shortener.” There is no single right answer, and the interviewer knows it. They score how you reach <em>an</em> answer in 45 minutes. This lesson gives you a five-step plan you can run every time, a sample interview, the answers that sink candidates, and the rubric used in every mock interview of this chapter.</p>

<div class="callout ok">
<p><strong>After Chapter 11 you can:</strong></p>
<ul>
  <li>answer an open “design the API for X” question in 45 minutes with a fixed plan — clarify, resources and endpoints, errors and pagination, auth/limits/versioning, scale — out loud and on a whiteboard (11.1);</li>
  <li>design a URL shortener and defend every choice with numbers you measured yourself: code collisions, 301 against 302, redirects per second (11.2);</li>
  <li>design a news feed and a chat: fan-out on write or on read, pages that do not repeat, messages that are not duplicated on a flaky phone (11.3);</li>
  <li>design a booking system — LabFlow — using the measurements of Chapters 5–10 as evidence, including what happens when 50 people press “Book” at once (11.4); then sit a full mock interview and grade it with a script (Lab 11).</li>
</ul>
<p><strong>Why it is worth learning:</strong> backend interviews for juniors often contain a “design an API” or “small system design” round, and the same skill is what you use at work when you write a design document, and at school when you defend your capstone. Ten chapters gave you the parts; this chapter teaches you to assemble them under a clock — and to bring evidence instead of buzzwords.</p>
</div>

<h3>What the interviewer is really scoring</h3>
<p>Think of a driving test: nobody fails you for taking a different street, they fail you for not checking the mirror. The interviewer watches <em>habits</em>: do you clarify before you build, size the problem, think about what goes wrong (two clicks, a dropped connection, someone else's data), say your trade-offs, use their hints? The System Design Primer describes the same order: use cases and constraints, high-level design, core components, scale.</p>
<a class="link-card" href="https://github.com/donnemartin/system-design-primer#how-to-approach-a-system-design-interview-question" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: System Design Primer — How to approach a system design interview question (read 1 Nov 2026)</span><span class="lc-sub">“An open-ended conversation. You are expected to lead it.” Step 1 asks: who uses it, how many users, how much data, requests per second, read-to-write ratio. Then design, components, scaling — “everything is a trade-off”.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>The 45-minute plan</h3>
<p>An API design question is narrower than full system design: the centre of the board is the <strong>contract</strong> (resources, methods, status codes, errors), and the system behind it gets the last part of the time. Five steps, with a time box each — glance at the clock when you move on:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">0–8 min</span><span class="lz-t">1 · Clarify + size</span><span class="lz-d">users, use cases, out of scope, numbers: peak req/s, read:write, data</span></div>
  <div class="lz-step"><span class="lz-k">8–20</span><span class="lz-t">2 · Resources + endpoints</span><span class="lz-d">nouns, methods, success codes — a table on the board</span></div>
  <div class="lz-step"><span class="lz-k">20–28</span><span class="lz-t">3 · Errors + pagination</span><span class="lz-d">one error format, conflicts, cursor lists, idempotent POST</span></div>
  <div class="lz-step"><span class="lz-k">28–36</span><span class="lz-t">4 · Auth, limits, versions</span><span class="lz-d">who may do what, 429 policy, how v2 arrives without breaking v1</span></div>
  <div class="lz-step"><span class="lz-k">36–45</span><span class="lz-t">5 · Scale + wrap-up</span><span class="lz-d">the bottleneck from your numbers, one or two fixes, trade-offs, summary</span></div>
</div>

<h3>Step 1 — Clarify before you draw</h3>
<p>The most common failure is to hear “URL shortener” and start drawing boxes. Ask four or five questions and write the answers in a corner of the board — every later decision points back to them:</p>
<table>
<tr><th>Ask</th><th>Why the answer changes the design</th></tr>
<tr><td>Who calls it — a browser, our app, partners?</td><td>Browsers need CORS and tickets (6.4, 10.4); partners need API keys and versioning.</td></tr>
<tr><td>2–3 core use cases? Out of scope?</td><td>Scope is your time budget; “analytics is out of scope” is a decision, not a weakness.</td></tr>
<tr><td>How many users, and when is the peak?</td><td>An average hides the 07:00 spike — design for the peak (8.1).</td></tr>
<tr><td>Read-to-write ratio? How fresh must reads be?</td><td>100:1 reads invite caches (9.1); “must see my own write” rules out naive replicas (9.3).</td></tr>
<tr><td>What must never happen?</td><td>Double booking, a lost payment, someone reading another user's data — these become constraints, not features.</td></tr>
</table>
<p>Then <strong>size it</strong> in two minutes — to learn whether one machine is enough and where the pressure is. Here it is for LabFlow as a script, after a real capacity figure measured on one Node process:</p>
<p>Start LabFlow on port 4100 in a second terminal. Lesson 5.3 limits <code>GET /v2/labs</code> to 100 requests per minute per IP, so raise that limit for the measurement — otherwise almost every request is a 429:</p>
<pre><code class="language-bash">PORT=4100 LABFLOW_IP_LIMIT=1000000/60 npm start</code></pre>
<pre><code class="language-bash">npx autocannon -c 50 -d 10 -j http://localhost:4100/v2/labs &gt; perf/bench-labs.json</code></pre>
<pre><code class="language-bash">node interview/estimate.mjs</code></pre>
<div class="out">autocannon GET /v2/labs: 7963 req/s trung bình · p50 5 ms · p99 16 ms · non-2xx 0

DAU = 30,000 × 0.2 = 6,000 người/ngày
                 mỗi ngày     trung bình/s   đỉnh (phút 07:00)/s
reads              72,000           0.83            500
bookings            6,000           0.07             50
logins              6,000           0.07             50
⇒ trung bình nhỏ tới mức vô nghĩa; thiết kế theo ĐỈNH: ~500 đọc/s, ~50 đăng nhập/s, ~50 lượt đặt/s

bảng bookings đo thật: 1,000,000 dòng, 167.6 MB kể cả chỉ mục ⇒ 168 byte/lượt đặt
lưu trữ 3 năm: 6,570,000 lượt đặt × 168 B ≈ 1,101.2 MB

đối chiếu với số đã đo trên MỘT tiến trình Node:
  GET /v2/labs (bài 11.1, autocannon)          7,963/s
  đăng nhập scrypt bất đồng bộ (bài 8.2)         114/s
  báo cáo dùng phòng sau khi sửa (Lab 8)       4,532/s
  đọc: cần 500/s, một tiến trình làm được 7,963/s ⇒ dùng 6% công suất
  đăng nhập: cần 50/s, một tiến trình làm được 114/s ⇒ dùng 44% công suất</div>
<p>Say it in the room like this: “The daily average is under one request per second — useless. The 07:00 minute matters: ~500 reads and ~50 logins per second. One process served ~8,000 reads per second here (7,963–9,888 over four runs on a shared laptop), so reads use about 6%; logins use 44% of the 114/s measured in 8.2, because password hashing is slow on purpose. Three years of bookings is about a gigabyte. The risk is the login spike and fifty people wanting the same slot, not throughput.”</p>
<div class="pitfall"><p><strong>Trap — the number theatre.</strong> Minutes of “10 million DAU × 86,400 …” that change no decision. A number that does not lead to a choice (“one instance is fine”, “cache this”) can be skipped.</p></div>

<h3>Steps 2–4 — The contract on the board</h3>
<p>Draw the contract as a table, one line per endpoint — readable in five seconds. For LabFlow's “report a broken device”:</p>
<pre><code class="language-plaintext">POST   /v2/devices/{id}/issues   Idempotency-Key   201 + Location   409 duplicate · 422 · 429 · 401
GET    /v2/issues?status=OPEN&amp;limit=20              200 {data, page.next}   400 bad cursor
GET    /v2/issues/{id}                              200 + ETag       404
POST   /v2/issues/{id}/resolve   If-Match           200              403 · 409 already resolved · 412 stale</code></pre>
<p>Each column is a lesson you measured: nouns and methods (1.1–1.2), problem+json (2.1), cursor pages (3.2), <code>If-Match</code> (5.4), 404 for other people's records (6.2), 429 (5.3), <code>/v2</code> beside <code>/v1</code> (4.2). Step 3 walks the failures aloud — “the phone loses the response and retries: <code>Idempotency-Key</code> (5.1)”; step 4 says who may call each line.</p>

<h3>Step 5 — Scale with your own numbers</h3>
<p>Name the bottleneck your estimate found, pick at most two fixes and say what they cost — specifically: “give the lab list <code>max-age=60</code> and check a version ETag before the query — 1,033 → 9,112 req/s in 9.1”; “move the CSV export to a job with 202 — the synchronous version hit a 524 at 100 s (10.1)”. Then summarise in three sentences; ending on time is itself a signal.</p>

<h3>A sample interview (warm-up, 10 minutes)</h3>
<p>A small question, so the steps show. 🎤 interviewer, 🧑‍💻 candidate.</p>
<table>
<tr><td>🎤</td><td>Design an API that lets students report broken lab equipment.</td></tr>
<tr><td>🧑‍💻</td><td>Before I draw: who reports — any student or only those who booked the lab? Who fixes them? Do we need photos? And roughly how many reports a day?</td></tr>
<tr><td>🎤</td><td>Any logged-in student. Lab managers fix them. Photos later. Maybe a hundred a day.</td></tr>
<tr><td>🧑‍💻</td><td>So: create, list, view, change status. Photos and statistics out of scope. A hundred a day is nothing for throughput; my worries are spam, the same broken projector reported by ten students, and two managers resolving the same report. I'll write the endpoints as a table… [draws the four lines above]</td></tr>
<tr><td>🎤</td><td>Why a <code>/resolve</code> action and not just PATCH the status?</td></tr>
<tr><td>🧑‍💻</td><td>Resolving carries its own rules: only lab managers, never twice, a note about the fix. An explicit action gets its own permission, its own errors — 409 <code>ALREADY_RESOLVED</code>, 403 for students — and its own documentation; plain edits like the description stay PATCH. That is the rule LabFlow chose in 1.1 for cancel.</td></tr>
<tr><td>🎤</td><td>A student's phone sends the report twice.</td></tr>
<tr><td>🧑‍💻</td><td>The client sends an <code>Idempotency-Key</code>; same key, same 201 replayed. Without it, a retry after a lost response creates a second report — in 5.1 the same retry on a booking even came back as a misleading 409 against the student's own booking. A different student reporting the same open problem gets 409 <code>DUPLICATE_ISSUE</code> with the existing id, and 3 reports per minute per student answers spam with 429. Two managers resolving at once: If-Match, the second gets 412 (5.4).</td></tr>
</table>
<p>Strong because: questions before drawing, scope in words, each follow-up answered with a mechanism <em>and</em> a reason.</p>

<h3>Weak answers and strong answers</h3>
<table>
<tr><th>Moment</th><th>Weak</th><th>Strong</th></tr>
<tr><td>The first minute</td><td>Starts drawing microservices and Kafka.</td><td>Asks who, what, how many, what must never happen; writes the answers down.</td></tr>
<tr><td>Numbers</td><td>“It needs to scale to millions.”</td><td>“Peak ≈ 500 req/s; one process measured ~8,000; the risk is the login spike.”</td></tr>
<tr><td>Endpoints</td><td><code>/createIssue</code>, <code>/getIssues</code>, 200 for everything.</td><td>Nouns + methods, 201 + Location, a status code per failure.</td></tr>
<tr><td>Failure</td><td>Not mentioned until asked.</td><td>Retries, double clicks, stale copies — with the header that fixes each.</td></tr>
<tr><td>Trade-offs</td><td>“Use a cache because it's faster.”</td><td>“A 60 s cache means a new lab appears up to 60 s late; acceptable for a list, not for bookings.”</td></tr>
</table>

<h3>The rubric used in this chapter</h3>
<p>This is the course's own rubric (not any company's official sheet), built from the habits above. Score each row 1–3; 13 or more out of 18, with no 1 in rows 2–3, is a strong junior answer.</p>
<table>
<tr><th>Criterion</th><th>1 — weak</th><th>2 — acceptable</th><th>3 — strong</th></tr>
<tr><td>1 · Requirements and numbers</td><td>no questions, no numbers</td><td>use cases, a rough user count</td><td>scope + “must never happen” + peak req/s compared with a measured capacity</td></tr>
<tr><td>2 · API surface</td><td>verbs in URLs, 200 for errors</td><td>REST resources, mostly right codes</td><td>clean table: nouns, methods, 201/Location, a code per failure, consistent naming</td></tr>
<tr><td>3 · Correctness under failure</td><td>happy path only</td><td>errors and pagination mentioned</td><td>idempotency, concurrency (409/412), cursor pages, one error format — unprompted</td></tr>
<tr><td>4 · Security and operations</td><td>“add JWT”</td><td>auth + roles</td><td>object-level checks (404), rate-limit policy, versioning/deprecation plan</td></tr>
<tr><td>5 · Scale and trade-offs</td><td>buzzwords</td><td>cache/queue named with a reason</td><td>bottleneck from numbers, ≤ 2 fixes with their cost, what was not chosen</td></tr>
<tr><td>6 · Communication</td><td>silent drawing, runs out of time</td><td>structured but rigid</td><td>thinks aloud, uses hints, finishes with a summary on time</td></tr>
</table>

<h3>What goes on the whiteboard</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Top left · requirements</span><span class="lz-lnote">users, 3 use cases, out of scope, “must never happen”</span></div>
  <div class="lz-layer"><span class="lz-lname">Top right · numbers</span><span class="lz-lnote">peak req/s, read:write, storage — and the one measured capacity you compare with</span></div>
  <div class="lz-layer"><span class="lz-lname">Middle · the contract</span><span class="lz-lnote">endpoint table: method, path, success, failures</span></div>
  <div class="lz-layer"><span class="lz-lname">Bottom · the system</span><span class="lz-lnote">client → API → DB, plus only the cache/queue your numbers justify</span></div>
</div>

<h3>In interviews and at work</h3>
<ul>
  <li><strong>“Where do you start?”</strong> With questions: who, what, how many, what must never happen. Then a two-minute estimate that ends in a decision.</li>
</ul>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok"><ol>
  <li>Put your campus into the assumptions of <code>interview/estimate.mjs</code> and run it. Which endpoint is closest to its measured capacity?</li>
  <li>Answer “students borrow a projector from the lab office” out loud in 10 minutes; record yourself.</li>
  <li>Score the recording with the rubric. Write one sentence per row explaining the score.</li>
</ol>
<p><strong>Done when:</strong> your answer has an endpoint table, at least one number that led to a decision, and a rubric score with reasons.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Clarifying question</span><span class="v">A question that changes the design depending on the answer.</span></div>
  <div class="kv"><span class="k">Back-of-the-envelope</span><span class="v">A quick estimate of load and data that should end in a decision.</span></div>
  <div class="kv"><span class="k">Peak</span><span class="v">The busiest minute; the design target, not the daily average.</span></div>
  <div class="kv"><span class="k">Read-to-write ratio</span><span class="v">How many reads per write; decides caching and replicas.</span></div>
  <div class="kv"><span class="k">Bottleneck</span><span class="v">The part that saturates first under the expected load.</span></div>
  <div class="kv"><span class="k">Trade-off</span><span class="v">What a choice costs, said out loud.</span></div>
  <div class="kv"><span class="k">Rubric</span><span class="v">The criteria and levels an answer is scored against.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Five steps in 45 minutes: clarify + size, resources + endpoints, errors + pagination, auth/limits/versions, scale + summary.</li>
  <li>Before drawing, ask who, what, how many, and what must never happen.</li>
  <li>Estimate the peak, then compare with a measured capacity: LabFlow's 07:00 minute needs ~500 reads/s (one process measured ~8,000) and ~50 logins/s (44% of the 114/s of 8.2).</li>
  <li>Contract as a table; walk the failures with the header that fixes each; at most two scaling fixes with their cost.</li>
  <li>Rubric: six rows scored 1–3; 13/18 with no 1 in API surface or correctness is a strong junior answer.</li>
</ul>
<a class="link-card" href="/courses/interview-prep/learn?lessonSlug=pv-7-3-system-design" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Related: Interview Prep course — 7.3 System design for juniors</span><span class="lc-sub">CV, STAR stories, behavioural questions (being written); this chapter is the technical part.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/software-architecture-and-design/learn?lessonSlug=swd392-slide-cs5-2" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">You met this in SWD392 — ⭐ CS.5 part 2: design a system in 15 minutes</span><span class="lc-sub">Same: a time-boxed method (requirements, entities, architecture, trade-offs) worked on a booking problem. Different: SWD392 draws UML and runs Java; here the centre of the board is the HTTP contract and numbers you measured. Not taken SWD392? This lesson stands on its own.</span></span>
  <span class="lc-cta">OPEN LESSON →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/software-requirements/learn?lessonSlug=swr302-5-8-ch14-planguage" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">You met this in SWR302 — lesson 5.8: Planguage and quality trade-offs</span><span class="lc-sub">Same: a quality requirement must be measurable (scale, meter, goal). This lesson adds saying it in minute two of an interview — “p99 under 500 ms at 50 bookings/s” — and checking it against a measured capacity.</span></span>
  <span class="lc-cta">OPEN LESSON →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/testing/learn?lessonSlug=tst-10-4-phong-van" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Testing course — 10.4: testing interview questions</span><span class="lc-sub">The same interview, from the testing side: “how would you test this endpoint”, mock or real database, coverage or mutation, flaky tests — every strong answer backed by a number measured in the Testing course, plus a 20-minute live-coding round.</span></span>
  <span class="lc-cta">OPEN LESSON →</span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1</span>
<h2>Khung trả lời câu hỏi phỏng vấn thiết kế API</h2>
<p class="lead">“Hãy thiết kế API cho một dịch vụ rút gọn link.” Không có đáp án duy nhất, và người phỏng vấn biết thế. Họ chấm cách bạn đi tới <em>một</em> đáp án trong 45 phút. Bài này cho bạn kế hoạch năm bước dùng được cho mọi đề, một buổi phỏng vấn mẫu, những câu trả lời làm ứng viên trượt, và thang chấm (rubric) dùng cho mọi buổi phỏng vấn thử trong chương.</p>

<div class="callout ok">
<p><strong>Học xong Chương 11 bạn làm được:</strong></p>
<ul>
  <li>trả lời câu “thiết kế API cho X” trong 45 phút theo một kế hoạch cố định — làm rõ, tài nguyên và endpoint, lỗi và phân trang, xác thực/giới hạn/phiên bản, quy mô — nói thành lời và vẽ trên bảng (11.1);</li>
  <li>thiết kế dịch vụ rút gọn link và bảo vệ từng lựa chọn bằng số tự đo: mã bị trùng, 301 hay 302, số lượt chuyển hướng mỗi giây (11.2);</li>
  <li>thiết kế news feed và chat: fan-out (toả bài) khi ghi hay khi đọc, trang không lặp bài, tin nhắn không bị nhân đôi khi điện thoại chập mạng (11.3);</li>
  <li>thiết kế hệ thống đặt lịch — chính là LabFlow — dùng số đo Chương 5–10 làm bằng chứng, kể cả khi 50 người cùng bấm “Đặt” (11.4); rồi ngồi một buổi phỏng vấn thử trọn vẹn và chấm bằng script (Lab 11).</li>
</ul>
<p><strong>Vì sao đáng học:</strong> phỏng vấn backend cho junior hay có một vòng “thiết kế API” hoặc “system design nhỏ”; đi làm thì cũng kỹ năng đó khi bạn viết tài liệu thiết kế (design doc), và ở trường là khi bảo vệ đồ án. Mười chương trước cho bạn đủ linh kiện; chương này dạy lắp chúng dưới áp lực đồng hồ — và mang bằng chứng thay vì từ khoá kêu.</p>
</div>

<h3>Người phỏng vấn thật ra chấm gì</h3>
<p>Hãy nghĩ tới thi bằng lái: không ai đánh trượt vì bạn đi đường khác, người ta đánh trượt vì bạn không nhìn gương. Người phỏng vấn nhìn <em>thói quen</em>: bạn có làm rõ trước khi dựng không, có ước lượng độ lớn bài toán không, có nghĩ tới chỗ hỏng (bấm hai lần, rớt kết nối, dữ liệu của người khác) không, có nói ra cái giá của lựa chọn (trade-off — đánh đổi) không, có dùng gợi ý của họ không? System Design Primer mô tả đúng thứ tự đó: use case và ràng buộc, thiết kế tổng thể, thành phần cốt lõi, rồi mở rộng.</p>
<a class="link-card" href="https://github.com/donnemartin/system-design-primer#how-to-approach-a-system-design-interview-question" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: System Design Primer — How to approach a system design interview question (đọc ngày 1/11/2026)</span><span class="lc-sub">“Một cuộc trò chuyện mở. Bạn được kỳ vọng dẫn dắt nó.” Bước 1 hỏi: ai dùng, bao nhiêu người, bao nhiêu dữ liệu, bao nhiêu request mỗi giây, tỉ lệ đọc/ghi. Rồi thiết kế, thành phần, mở rộng — “mọi thứ đều là đánh đổi”.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Kế hoạch 45 phút</h3>
<p>Câu hỏi thiết kế API hẹp hơn system design trọn vẹn: giữa bảng là <strong>hợp đồng</strong> (tài nguyên, phương thức, status code, lỗi), còn hệ thống phía sau nhận phần thời gian cuối. Năm bước, mỗi bước một khung giờ — liếc đồng hồ khi chuyển bước:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">0–8 phút</span><span class="lz-t">1 · Làm rõ + ước lượng</span><span class="lz-d">người dùng, use case, ngoài phạm vi, con số: req/s lúc đỉnh, đọc:ghi, dữ liệu</span></div>
  <div class="lz-step"><span class="lz-k">8–20</span><span class="lz-t">2 · Tài nguyên + endpoint</span><span class="lz-d">danh từ, phương thức, mã thành công — một bảng trên bảng trắng</span></div>
  <div class="lz-step"><span class="lz-k">20–28</span><span class="lz-t">3 · Lỗi + phân trang</span><span class="lz-d">một định dạng lỗi, xung đột, danh sách cursor, POST idempotent</span></div>
  <div class="lz-step"><span class="lz-k">28–36</span><span class="lz-t">4 · Xác thực, giới hạn, phiên bản</span><span class="lz-d">ai được làm gì, chính sách 429, v2 ra đời mà v1 không vỡ</span></div>
  <div class="lz-step"><span class="lz-k">36–45</span><span class="lz-t">5 · Quy mô + chốt</span><span class="lz-d">nút thắt từ con số của bạn, một hai cách sửa, đánh đổi, tóm tắt</span></div>
</div>

<h3>Bước 1 — Làm rõ trước khi vẽ</h3>
<p>Lỗi hay gặp nhất: nghe “rút gọn link” là vẽ hộp ngay. Hãy hỏi bốn năm câu và ghi câu trả lời vào một góc bảng — mọi quyết định sau đều trỏ về đó:</p>
<table>
<tr><th>Hỏi</th><th>Vì sao câu trả lời đổi thiết kế</th></tr>
<tr><td>Ai gọi API — trình duyệt, app của mình, đối tác?</td><td>Trình duyệt cần CORS và vé (ticket) (6.4, 10.4); đối tác cần API key và phiên bản.</td></tr>
<tr><td>2–3 use case cốt lõi? Cái gì ngoài phạm vi?</td><td>Phạm vi là ngân sách thời gian; “thống kê để sau” là một quyết định, không phải điểm yếu.</td></tr>
<tr><td>Bao nhiêu người dùng, đỉnh lúc nào?</td><td>Trung bình che mất cú dồn lúc 07:00 — thiết kế theo đỉnh (peak) (8.1).</td></tr>
<tr><td>Tỉ lệ đọc/ghi? Đọc cần mới tới mức nào?</td><td>Đọc gấp 100 lần ghi thì nên có cache (9.1); “phải thấy ngay cái mình vừa ghi” loại bỏ replica ngây thơ (9.3).</td></tr>
<tr><td>Điều gì tuyệt đối không được xảy ra?</td><td>Đặt trùng, mất tiền, đọc được dữ liệu người khác — chúng thành ràng buộc, không phải tính năng.</td></tr>
</table>
<p>Rồi <strong>ước lượng</strong> trong hai phút (back-of-the-envelope — tính nhanh trên mặt sau phong bì) — để biết một máy có đủ không và áp lực nằm ở đâu. Đây là phép tính đó cho LabFlow, chạy bằng script, sau một con số công suất thật đo trên một tiến trình Node:</p>
<p>Bật LabFlow ở cổng 4100 trong terminal thứ hai. Bài 5.3 giới hạn <code>GET /v2/labs</code> 100 request mỗi phút mỗi IP, nên nới giới hạn đó cho phép đo — không thì gần như mọi request là 429:</p>
<pre><code class="language-bash">PORT=4100 LABFLOW_IP_LIMIT=1000000/60 npm start</code></pre>
<pre><code class="language-bash">npx autocannon -c 50 -d 10 -j http://localhost:4100/v2/labs &gt; perf/bench-labs.json</code></pre>
<pre><code class="language-bash">node interview/estimate.mjs</code></pre>
<div class="out">autocannon GET /v2/labs: 7963 req/s trung bình · p50 5 ms · p99 16 ms · non-2xx 0

DAU = 30,000 × 0.2 = 6,000 người/ngày
                 mỗi ngày     trung bình/s   đỉnh (phút 07:00)/s
reads              72,000           0.83            500
bookings            6,000           0.07             50
logins              6,000           0.07             50
⇒ trung bình nhỏ tới mức vô nghĩa; thiết kế theo ĐỈNH: ~500 đọc/s, ~50 đăng nhập/s, ~50 lượt đặt/s

bảng bookings đo thật: 1,000,000 dòng, 167.6 MB kể cả chỉ mục ⇒ 168 byte/lượt đặt
lưu trữ 3 năm: 6,570,000 lượt đặt × 168 B ≈ 1,101.2 MB

đối chiếu với số đã đo trên MỘT tiến trình Node:
  GET /v2/labs (bài 11.1, autocannon)          7,963/s
  đăng nhập scrypt bất đồng bộ (bài 8.2)         114/s
  báo cáo dùng phòng sau khi sửa (Lab 8)       4,532/s
  đọc: cần 500/s, một tiến trình làm được 7,963/s ⇒ dùng 6% công suất
  đăng nhập: cần 50/s, một tiến trình làm được 114/s ⇒ dùng 44% công suất</div>
<p>Nói trong phòng phỏng vấn thế này: “Trung bình cả ngày dưới một request mỗi giây — vô nghĩa. Phút 07:00 mới quan trọng: ~500 lượt đọc và ~50 lượt đăng nhập mỗi giây. Một tiến trình phục vụ ~8.000 lượt đọc/s ở đây (bốn lần đo trên laptop dùng chung: 7.963–9.888), nên đọc chỉ dùng khoảng 6%; đăng nhập dùng 44% của 114 lượt/s đo ở bài 8.2, vì băm mật khẩu cố ý chậm. Ba năm lượt đặt khoảng 1 GB. Rủi ro là cú dồn đăng nhập và năm mươi người cùng muốn một khung giờ, không phải thông lượng.”</p>
<div class="pitfall"><p><strong>Bẫy — diễn kịch con số.</strong> Vài phút “10 triệu người dùng mỗi ngày × 86.400 …” mà không đổi quyết định nào. Con số không dẫn tới lựa chọn (“một instance là đủ”, “cache cái này”) thì bỏ qua.</p></div>

<h3>Bước 2–4 — Hợp đồng trên bảng</h3>
<p>Vẽ hợp đồng thành bảng, mỗi endpoint một dòng — đọc trong năm giây. Với tính năng “báo hỏng thiết bị” của LabFlow:</p>
<pre><code class="language-plaintext">POST   /v2/devices/{id}/issues   Idempotency-Key   201 + Location   409 duplicate · 422 · 429 · 401
GET    /v2/issues?status=OPEN&amp;limit=20              200 {data, page.next}   400 bad cursor
GET    /v2/issues/{id}                              200 + ETag       404
POST   /v2/issues/{id}/resolve   If-Match           200              403 · 409 already resolved · 412 stale</code></pre>
<p>Mỗi cột là một bài bạn đã đo: danh từ và phương thức (1.1–1.2), problem+json (2.1), trang cursor (3.2), <code>If-Match</code> (5.4), 404 cho bản ghi của người khác (6.2), 429 (5.3), <code>/v2</code> cạnh <code>/v1</code> (4.2). Bước 3 đi qua các chỗ hỏng thành lời — “điện thoại mất phản hồi và gửi lại: <code>Idempotency-Key</code> (5.1)”; bước 4 nói ai được gọi từng dòng.</p>

<h3>Bước 5 — Mở rộng bằng chính con số của bạn</h3>
<p>Gọi tên nút thắt (bottleneck) mà phép ước lượng tìm ra, chọn tối đa hai cách sửa và nói cái giá — cụ thể: “cho danh sách phòng <code>max-age=60</code> và so ETag phiên bản trước khi truy vấn — 1.033 → 9.112 req/s ở bài 9.1”; “đưa việc xuất CSV thành job trả 202 — bản đồng bộ ăn 524 ở giây 100 (10.1)”. Rồi tóm tắt trong ba câu; kết thúc đúng giờ tự nó đã là một điểm cộng.</p>

<h3>Một buổi phỏng vấn mẫu (khởi động, 10 phút)</h3>
<p>Đề nhỏ để thấy rõ các bước. 🎤 người phỏng vấn, 🧑‍💻 ứng viên.</p>
<table>
<tr><td>🎤</td><td>Thiết kế API cho sinh viên báo thiết bị phòng lab bị hỏng.</td></tr>
<tr><td>🧑‍💻</td><td>Trước khi vẽ: ai được báo — mọi sinh viên hay chỉ người đã đặt phòng? Ai sửa? Có cần ảnh không? Và khoảng bao nhiêu báo cáo một ngày?</td></tr>
<tr><td>🎤</td><td>Sinh viên nào đã đăng nhập cũng được. Quản lý lab sửa. Ảnh để sau. Chắc trăm cái một ngày.</td></tr>
<tr><td>🧑‍💻</td><td>Vậy: tạo, xem danh sách, xem một cái, đổi trạng thái. Ảnh và thống kê ngoài phạm vi. Trăm cái một ngày thì thông lượng không đáng lo; em lo spam, cùng một máy chiếu hỏng bị mười sinh viên báo, và hai quản lý cùng xử lý một báo cáo. Em viết endpoint thành bảng… [vẽ bốn dòng ở trên]</td></tr>
<tr><td>🎤</td><td>Sao lại có hành động <code>/resolve</code> mà không PATCH trạng thái cho xong?</td></tr>
<tr><td>🧑‍💻</td><td>“Đã sửa” mang luật riêng: chỉ quản lý lab, không bao giờ hai lần, kèm ghi chú cách sửa. Một hành động riêng có quyền riêng, lỗi riêng — 409 <code>ALREADY_RESOLVED</code>, 403 cho sinh viên — và tài liệu riêng; sửa thông thường như mô tả thì vẫn PATCH. Đó là luật LabFlow đã chọn ở bài 1.1 cho việc huỷ.</td></tr>
<tr><td>🎤</td><td>Điện thoại của sinh viên gửi báo cáo hai lần.</td></tr>
<tr><td>🧑‍💻</td><td>Client gửi <code>Idempotency-Key</code>; cùng khoá thì phát lại đúng 201 cũ. Không có nó, gửi lại sau khi mất phản hồi sẽ tạo báo cáo thứ hai — ở bài 5.1 chính lần gửi lại đó trên lượt đặt còn trả về 409 gây hiểu nhầm, chống lại chính lượt đặt của sinh viên. Sinh viên khác báo đúng sự cố đang mở thì nhận 409 <code>DUPLICATE_ISSUE</code> kèm id báo cáo sẵn có, còn 3 báo cáo/phút/sinh viên chặn spam bằng 429. Hai quản lý cùng xử lý: If-Match, người sau nhận 412 (5.4).</td></tr>
</table>
<p>Mạnh vì: hỏi trước khi vẽ, nói phạm vi thành lời, mỗi câu hỏi thêm được trả lời bằng một cơ chế <em>kèm</em> lý do.</p>

<h3>Câu trả lời yếu và câu trả lời mạnh</h3>
<table>
<tr><th>Lúc</th><th>Yếu</th><th>Mạnh</th></tr>
<tr><td>Phút đầu tiên</td><td>Vẽ ngay microservice và Kafka.</td><td>Hỏi ai, cái gì, bao nhiêu, điều gì không được xảy ra; ghi lại.</td></tr>
<tr><td>Con số</td><td>“Phải scale lên hàng triệu.”</td><td>“Đỉnh ≈ 500 req/s; một tiến trình đo được ~8.000; rủi ro là cú dồn đăng nhập.”</td></tr>
<tr><td>Endpoint</td><td><code>/createIssue</code>, <code>/getIssues</code>, mọi thứ trả 200.</td><td>Danh từ + phương thức, 201 + Location, mỗi kiểu hỏng một status code.</td></tr>
<tr><td>Chỗ hỏng</td><td>Không nhắc tới tới khi bị hỏi.</td><td>Gửi lại, bấm hai lần, bản cũ — kèm header sửa từng cái.</td></tr>
<tr><td>Đánh đổi</td><td>“Dùng cache vì nhanh hơn.”</td><td>“Cache 60 s nghĩa là phòng mới hiện muộn tới 60 s; chấp nhận được cho danh sách, không cho lượt đặt.”</td></tr>
</table>

<h3>Thang chấm dùng trong chương này</h3>
<p>Đây là thang chấm của khoá (không phải phiếu chính thức của công ty nào), dựng từ các thói quen trên. Mỗi dòng 1–3 điểm; từ 13/18 trở lên và không có điểm 1 ở dòng 2–3 là câu trả lời junior mạnh.</p>
<table>
<tr><th>Tiêu chí</th><th>1 — yếu</th><th>2 — được</th><th>3 — mạnh</th></tr>
<tr><td>1 · Yêu cầu và con số</td><td>không hỏi, không số</td><td>use case, số người dùng ước chừng</td><td>phạm vi + “không được xảy ra” + req/s lúc đỉnh so với công suất đã đo</td></tr>
<tr><td>2 · Bề mặt API</td><td>động từ trong URL, lỗi trả 200</td><td>tài nguyên REST, mã gần đúng</td><td>bảng gọn: danh từ, phương thức, 201/Location, mỗi kiểu hỏng một mã, đặt tên nhất quán</td></tr>
<tr><td>3 · Đúng khi có sự cố</td><td>chỉ luồng đẹp</td><td>có nhắc lỗi và phân trang</td><td>idempotency, đồng thời (409/412), trang cursor, một định dạng lỗi — tự nói, không cần hỏi</td></tr>
<tr><td>4 · Bảo mật và vận hành</td><td>“thêm JWT”</td><td>xác thực + vai trò</td><td>kiểm quyền từng đối tượng (404), chính sách rate limit, kế hoạch phiên bản/khai tử</td></tr>
<tr><td>5 · Quy mô và đánh đổi</td><td>từ khoá kêu</td><td>nêu cache/hàng đợi kèm lý do</td><td>nút thắt từ con số, ≤ 2 cách sửa kèm cái giá, điều đã không chọn</td></tr>
<tr><td>6 · Giao tiếp</td><td>vẽ im lặng, hết giờ</td><td>có cấu trúc nhưng cứng</td><td>nghĩ thành lời, dùng gợi ý, tóm tắt đúng giờ</td></tr>
</table>

<h3>Bảng trắng nên có gì</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Góc trên trái · yêu cầu</span><span class="lz-lnote">người dùng, 3 use case, ngoài phạm vi, “không được xảy ra”</span></div>
  <div class="lz-layer"><span class="lz-lname">Góc trên phải · con số</span><span class="lz-lnote">req/s lúc đỉnh, đọc:ghi, dung lượng — và một con số công suất đã đo để so</span></div>
  <div class="lz-layer"><span class="lz-lname">Giữa · hợp đồng</span><span class="lz-lnote">bảng endpoint: phương thức, đường dẫn, thành công, các kiểu hỏng</span></div>
  <div class="lz-layer"><span class="lz-lname">Dưới · hệ thống</span><span class="lz-lnote">client → API → CSDL, và chỉ thêm cache/hàng đợi mà con số của bạn đòi</span></div>
</div>

<h3>Khi phỏng vấn và khi đi làm</h3>
<ul>
  <li><strong>“Em bắt đầu từ đâu?”</strong> Từ câu hỏi: ai, cái gì, bao nhiêu, điều gì không được xảy ra. Rồi hai phút ước lượng kết thúc bằng một quyết định.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
  <li>Đưa số liệu trường bạn vào phần giả định của <code>interview/estimate.mjs</code> rồi chạy. Endpoint nào gần công suất đã đo nhất?</li>
  <li>Trả lời thành lời đề “sinh viên mượn máy chiếu ở văn phòng lab” trong 10 phút; tự ghi âm.</li>
  <li>Chấm bản ghi âm bằng thang chấm. Mỗi dòng viết một câu giải thích điểm.</li>
</ol>
<p><strong>Đạt khi:</strong> câu trả lời có bảng endpoint, ít nhất một con số dẫn tới quyết định, và điểm theo thang chấm kèm lý do.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Clarifying question (câu hỏi làm rõ)</span><span class="v">Câu hỏi mà câu trả lời làm thiết kế thay đổi.</span></div>
  <div class="kv"><span class="k">Back-of-the-envelope (ước lượng nhanh)</span><span class="v">Tính nhanh tải và dữ liệu, phải kết thúc bằng một quyết định.</span></div>
  <div class="kv"><span class="k">Peak (đỉnh)</span><span class="v">Phút bận nhất; là mục tiêu thiết kế, không phải trung bình cả ngày.</span></div>
  <div class="kv"><span class="k">Read-to-write ratio (tỉ lệ đọc/ghi)</span><span class="v">Bao nhiêu lượt đọc cho mỗi lượt ghi; quyết định cache và replica.</span></div>
  <div class="kv"><span class="k">Bottleneck (nút thắt)</span><span class="v">Phần bão hoà đầu tiên dưới tải dự kiến.</span></div>
  <div class="kv"><span class="k">Trade-off (đánh đổi)</span><span class="v">Cái giá của một lựa chọn, nói thành lời.</span></div>
  <div class="kv"><span class="k">Rubric (thang chấm)</span><span class="v">Tiêu chí và mức điểm dùng để chấm một câu trả lời.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Năm bước trong 45 phút: làm rõ + ước lượng, tài nguyên + endpoint, lỗi + phân trang, xác thực/giới hạn/phiên bản, quy mô + tóm tắt.</li>
  <li>Trước khi vẽ, hỏi: ai, cái gì, bao nhiêu, điều gì không được xảy ra.</li>
  <li>Ước lượng theo đỉnh rồi so với công suất đã đo: phút 07:00 của LabFlow cần ~500 lượt đọc/s (một tiến trình đo ~8.000) và ~50 lượt đăng nhập/s (44% của 114/s ở 8.2).</li>
  <li>Hợp đồng là một bảng; đi qua các chỗ hỏng kèm header sửa từng cái; tối đa hai cách mở rộng kèm cái giá.</li>
  <li>Thang chấm: sáu dòng 1–3 điểm; 13/18 và không có điểm 1 ở bề mặt API hay độ đúng là câu trả lời junior mạnh.</li>
</ul>
<a class="link-card" href="/courses/interview-prep/learn?lessonSlug=pv-7-3-system-design" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Liên quan: khoá Luyện phỏng vấn — 7.3 System design cho junior</span><span class="lc-sub">CV, kể chuyện STAR, câu hỏi hành vi (đang soạn); chương này là phần kỹ thuật.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/software-architecture-and-design/learn?lessonSlug=swd392-slide-cs5-2" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Bạn đã gặp điều này ở SWD392 — ⭐ CS.5 phần 2: thiết kế một hệ thống trong 15 phút</span><span class="lc-sub">Giống: phương pháp có bấm giờ (yêu cầu, thực thể, kiến trúc, đánh đổi) làm trên đề đặt sân. Khác: SWD392 vẽ UML và chạy Java; ở đây giữa bảng là hợp đồng HTTP và con số bạn đã đo. Chưa học SWD392? Bài này vẫn tự đứng được.</span></span>
  <span class="lc-cta">MỞ BÀI →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/software-requirements/learn?lessonSlug=swr302-5-8-ch14-planguage" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Bạn đã gặp điều này ở SWR302 — bài 5.8: Planguage và đánh đổi chất lượng</span><span class="lc-sub">Giống: yêu cầu chất lượng phải đo được (thang đo, cách đo, mục tiêu). Bài này thêm: nói nó ra ở phút thứ hai của buổi phỏng vấn — “p99 dưới 500 ms ở 50 lượt đặt/s” — và so với công suất đã đo.</span></span>
  <span class="lc-cta">MỞ BÀI →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/testing/learn?lessonSlug=tst-10-4-phong-van" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Testing course — 10.4: câu hỏi phỏng vấn về testing</span><span class="lc-sub">Cùng vòng phỏng vấn, phía test: "bạn sẽ test endpoint này thế nào", mock hay CSDL thật, độ phủ hay đột biến, test chập chờn — mỗi câu trả lời mạnh dựa trên một số đo của khoá Testing, kèm bài code trực tiếp 20 phút.</span></span>
  <span class="lc-cta">MỞ BÀI →</span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 11.2 ─────────────────────────── */
    {
      title: '11.2 — Interview: a URL shortener (1) — requirements, the contract and short codes|||11.2 — Phỏng vấn: rút gọn link (1) — yêu cầu, hợp đồng và mã ngắn',
      slug: 'api-11-2-rut-gon-link',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bản ghi phỏng vấn đề rút gọn link và bản chạy được: làm rõ, ước lượng, hợp đồng (alias 409, URL lạ 422, hết hạn 410, rate limit 429); đo trùng mã trên 1 triệu link: ngẫu nhiên 5/6/7 ký tự ~550/8–13/0–1, băm cắt ngắn trùng như ngẫu nhiên, bộ đếm Base62 không trùng nhưng đoán được.',
      content: `${G112}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.2</span>
<h2>Interview: a URL shortener (1) — requirements, the contract and short codes</h2>
<p class="lead">The URL shortener is the most common warm-up question in design interviews because it looks trivial — a table of code → URL — and hides real decisions: what the codes look like, what happens when two links want the same code, what a stranger can learn from a code. This lesson runs the first half of that interview the 11.1 way, and backs every claim with something you run: a working shortener and a collision experiment on one million codes. Lesson 11.3 finishes the interview: redirects, load and abuse.</p>

<h3>The first five minutes</h3>
<table>
<tr><td>🎤</td><td>Design a link shortener for the university — like bit.ly, for clubs and lecturers.</td></tr>
<tr><td>🧑‍💻</td><td>Who creates links — any student, or only clubs and staff? Can people choose the code, like <code>/f-code-k20</code>? Do links expire? Do creators see click counts? And roughly how many links and clicks?</td></tr>
<tr><td>🎤</td><td>Any logged-in user. Custom codes yes. Optional expiry. Click counts yes, nothing fancier. Say a few thousand links a day; a popular event link can get a hundred thousand clicks in an hour.</td></tr>
<tr><td>🧑‍💻</td><td>So reads dominate — at least 100 clicks per created link, and bursty. A hundred thousand clicks in an hour is ~28 per second on average; a share in a big group chat can mean hundreds per second for a minute. Out of scope: QR codes, geography of clicks, link previews. Must never happen: a code pointing to someone else's URL, and the shortener becoming a tool for phishing.</td></tr>
<tr><td>🎤</td><td>Good. Show me the API.</td></tr>
</table>
<p>In five minutes the candidate has the read:write ratio (it decides caching), the peak (it decides capacity), the scope (it decides the time), and two “must never happen” (they decide constraints). Write those four lines in the corner of the board.</p>

<h3>The contract</h3>
<pre><code class="language-plaintext">POST   /v1/links            {url, alias?, ttlDays?}   201 + Location    401 · 409 alias · 422 url/alias/ttl · 429
GET    /v1/links?cursor=…   my links                  200 {data, page.next}
GET    /v1/links/{code}     one of my links + clicks  200               404 (also: not mine)
DELETE /v1/links/{code}                               204               404
GET    /{code}              the redirect              302 Location      404 unknown · 410 expired</code></pre>
<p>Two namespaces on purpose: the API lives under <code>/v1/…</code> (versioned, authenticated, JSON), the redirect lives at the root (short, public, no JSON). That is why <code>v1</code>, <code>api</code> and <code>admin</code> are reserved words for aliases — otherwise someone can create the alias <code>v1</code> and your next API version has a hole. The create request goes through a fixed order of checks:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">who?</span><span class="lz-d">Bearer token ⇒ else 401</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">how often?</span><span class="lz-d">5 per minute per user ⇒ else 429 + Retry-After</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">valid?</span><span class="lz-d">http(s) only, ≤ 2048 chars, not our own domain, alias rules ⇒ else 422</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">free?</span><span class="lz-d">alias taken ⇒ 409; random code taken ⇒ draw again</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">store</span><span class="lz-d">201 + Location: /v1/links/{code}</span></div>
</div>
<p>A runnable version of this answer is <code>interview/shortener/app.mjs</code> (Express 5, ≈120 lines, data in memory). Its behaviour, measured (the demo runs with <code>DAY_MS=2000</code>, so “one day” lasts 2 s and expiry can be seen):</p>
<p>Start it in its own terminal (<code>DAY_MS=2000</code> makes a “day” last 2 s so expiry is visible; tokens <code>tok_an</code> / <code>tok_bin</code> / <code>tok_lan</code> are built in):</p>
<pre><code class="language-bash">PORT=4120 DAY_MS=2000 node interview/shortener/app.mjs</code></pre>
<pre><code class="language-bash">curl -i localhost:4120/v1/links \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"url":"https://club.fpt.edu.vn/su-kien/hackathon-2026?utm_source=fb"}'</code></pre>
<div class="out">HTTP/1.1 201 Created
RateLimit-Policy: "create";q=5;w=60
Location: /v1/links/pnbwZf7
Content-Type: application/json; charset=utf-8
Content-Length: 197
ETag: W/"c5-fpKz7DdqQVbnq5WekuKaEex187s"
Date: Sun, 01 Nov 2026 02:17:56 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"code":"pnbwZf7","shortUrl":"http://localhost:4120/pnbwZf7","url":"https://club.fpt.edu.vn/su-kien/hackathon-2026?utm_source=fb","createdAt":"2026-11-01T02:17:56.137Z","expiresAt":null,"clicks":0}</div>
<p>An (a club member) has already taken the alias <code>f-code-k20</code>:</p>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' localhost:4120/v1/links -H 'Authorization: Bearer tok_an' --json '{"url":"https://club.fpt.edu.vn/f-code","alias":"f-code-k20"}'</code></pre>
<div class="out">201</div>
<pre><code class="language-bash">curl -s localhost:4120/v1/links \\
  -H 'Authorization: Bearer tok_bin' \\
  --json '{"url":"https://example.com/x","alias":"f-code-k20"}'</code></pre>
<div class="out">{"type":"https://short.example/problems/alias-taken","title":"ALIAS_TAKEN","status":409,"detail":"“f-code-k20” is already used","code":"ALIAS_TAKEN"}</div>
<pre><code class="language-bash">curl -s localhost:4120/v1/links \\
  -H 'Authorization: Bearer tok_bin' \\
  --json '{"url":"javascript:alert(1)"}'</code></pre>
<div class="out">{"type":"https://short.example/problems/invalid-url","title":"INVALID_URL","status":422,"detail":"url must be an absolute http(s) URL of at most 2048 characters","code":"INVALID_URL"}</div>
<pre><code class="language-bash">curl -s localhost:4120/v1/links \\
  -H 'Authorization: Bearer tok_bin' \\
  --json '{"url":"http://localhost:4120/f-code-k20"}'</code></pre>
<div class="out">{"type":"https://short.example/problems/invalid-url","title":"INVALID_URL","status":422,"detail":"A short link cannot point to another short link","code":"INVALID_URL"}</div>
<pre><code class="language-bash">curl -s localhost:4120/v1/links \\
  -H 'Authorization: Bearer tok_bin' \\
  --json '{"url":"https://example.com/y","alias":"admin"}'</code></pre>
<div class="out">{"type":"https://short.example/problems/invalid-alias","title":"INVALID_ALIAS","status":422,"detail":"alias: 4–30 characters A–Z a–z 0–9 _ -, not a reserved word","code":"INVALID_ALIAS"}</div>
<pre><code class="language-bash">curl -s localhost:4120/v1/links \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"url":"https://club.fpt.edu.vn/form-dang-ky","alias":"form-k20","ttlDays":1}' | grep -o '"expiresAt":"[^"]*"'</code></pre>
<div class="out">"expiresAt":"2026-11-01T02:17:58.268Z"</div>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' localhost:4120/form-k20</code></pre>
<div class="out">302</div>
<pre><code class="language-bash">sleep 2.2; curl -si localhost:4120/form-k20 | head -1</code></pre>
<div class="out">HTTP/1.1 410 Gone</div>
<pre><code class="language-bash">for i in 1 2 3 4 5 6; do curl -s -o /dev/null -w "%{http_code} " localhost:4120/v1/links -H 'Authorization: Bearer tok_lan' --json "{\\"url\\":\\"https://example.com/p/$i\\"}"; done; echo</code></pre>
<div class="out">201 201 201 201 201 429 </div>
<pre><code class="language-bash">curl -si localhost:4120/v1/links \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"url":"https://example.com/p/7"}' | grep -iE '^(HTTP|retry-after|ratelimit-policy)|"detail"'</code></pre>
<div class="out">HTTP/1.1 429 Too Many Requests
RateLimit-Policy: "create";q=5;w=60
Retry-After: 12
{"type":"https://short.example/problems/rate-limited","title":"RATE_LIMITED","status":429,"detail":"Too many links; retry in 12 s","code":"RATE_LIMITED"}</div>
<p>Each line is a decision you can say in one sentence. A taken alias is 409 — a conflict with existing state (1.3). <code>javascript:</code> is 422, because a shortener that redirects there is an attack tool. A link to another short link is 422, otherwise two links can point at each other forever. An expired link is 410 Gone, which tells crawlers to forget it. Lan's sixth link in a minute is 429 with <code>Retry-After</code> (5.3). The limiter runs <em>before</em> validation, so failed attempts also cost a token — deliberate, it slows down someone probing aliases.</p>

<h3>Short codes: three ways, measured</h3>
<p>Imagine a class of 40 students: the chance that two of them share a birthday is about 89%, although a year has 365 days. Short codes behave the same way — collisions arrive much earlier than “one in 56 billion” suggests. With <em>N</em> codes drawn at random from <em>S</em> possibilities, you expect about <em>N²/2S</em> collisions. Instead of trusting the formula, generate one million codes three ways (<code>interview/shortener/codes.mjs</code>):</p>
<pre><code class="language-javascript">export const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
export function toBase62(n) {                       // counter → code: never collides, guessable
  let s = '';
  do { s = ALPHABET[n % 62] + s; n = Math.floor(n / 62); } while (n &gt; 0);
  return s;
}
export function randomCode(len) {                   // crypto.randomInt: not guessable, may collide
  let s = '';
  for (let i = 0; i &lt; len; i++) s += ALPHABET[randomInt(62)];
  return s;
}
// hashCode(url, len): first 64 bits of sha256(url) written in base62, cut to len</code></pre>
<pre><code class="language-bash">node interview/shortener/collisions.mjs</code></pre>
<div class="out">N = 1,000,000 link
cách                     không gian        trùng (đo, 3 lần)   kỳ vọng ≈ N²/2S   ns/mã
ngẫu nhiên 5 ký tự            916,132,832   532 / 556 / 554              545.8   962
ngẫu nhiên 6 ký tự         56,800,235,584   9 / 8 / 8                      8.8   1054
ngẫu nhiên 7 ký tự       3,521,614,606,208   0 / 0 / 0                      0.1   1197
băm sha256 cắt 6 ký tự     56,800,235,584   8                              8.8   1988
băm sha256 cắt 7 ký tự   3,521,614,606,208   0                              0.1   2057
base62 của bộ đếm          (vô hạn)           0                                0   404

base62 của bộ đếm:
  id              1 → 1        (1 ký tự)
  id             61 → z        (1 ký tự)
  id             62 → 10       (2 ký tự)
  id          3,843 → zz       (2 ký tự)
  id          3,844 → 100      (3 ký tự)
  id      1,000,000 → 4C92     (4 ký tự)
  id 56,800,235,583 → zzzzzz   (6 ký tự)
  id 56,800,235,584 → 1000000  (7 ký tự)
  mã của tôi 4C92 ⇒ mã trước/sau: 4C91 4C93 (đoán được)
  cùng URL băm hai lần: 3Vmil2d = 3Vmil2d</div>
<ul>
  <li><strong>Random, 6 characters</strong> (56.8 billion codes): 8–13 collisions per million over six samples in two runs, right around the 8.8 predicted. A random generator <em>must</em> check and retry. With 7 characters (3.5 trillion) collisions are rare (0–1 per million) and each retry costs one lookup.</li>
  <li><strong>Hash of the URL, cut to 6 characters</strong>: exactly as many collisions as random — hashing does not make short codes unique. It adds a property you may not want: the same URL always gets the same code, so two clubs that shorten the same form share one link and one click counter.</li>
  <li><strong>Base62 of a counter</strong>: zero collisions and the fastest (321–404 ns over two runs); codes reach 7 characters only after 56.8 billion links. But <code>4C92</code> tells everyone that <code>4C91</code> and <code>4C93</code> exist — anyone can walk the table, including “private” links to forms with personal data. Sequential IDs leak counts, as in 9.4.</li>
</ul>
<div class="pitfall"><p><strong>Trap — “check, then insert”.</strong> <code>if (!links.has(code)) links.set(code, …)</code> is safe in one Node process because nothing runs between the two lines. With a database and several instances, two requests can pass the check together; only a <code>UNIQUE</code> constraint on <code>code</code> makes the second insert fail, and the handler then draws again. Lesson 11.6 measures exactly this race on bookings.</p></div>
<a class="link-card" href="https://github.com/donnemartin/system-design-primer/blob/master/solutions/system_design/pastebin/README.md" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: System Design Primer — Design Pastebin.com (or Bit.ly) (read 1 Nov 2026)</span><span class="lc-sub">Its shortlink: MD5 of the user’s IP address + timestamp, Base62-encoded, first 7 characters (“62^7 possible values”); the write path checks the database and “if the url is not unique, it generates another url”. Even a hash needs the duplicate check you measured here.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>Follow-up questions on codes</h3>
<table>
<tr><td>🎤</td><td>Why not MD5 the URL and take six characters? Then you don't need to store anything to dedupe.</td></tr>
<tr><td>🧑‍💻</td><td>Cutting a hash to six characters collides like random codes — I measured 8 per million — so I still need a uniqueness check. And dedupe is not what we want: two clubs shortening the same form would share statistics. I'd use 7 random characters and a unique constraint.</td></tr>
<tr><td>🎤</td><td>Someone asks for the alias <code>admin</code>, or for one that a random code already uses.</td></tr>
<tr><td>🧑‍💻</td><td>Reserved words are 422, an alias in use is 409 whether a person or the generator took it. Random codes are 7 characters and aliases at least 4, so they can collide; the same unique index protects both.</td></tr>
<tr><td>🎤</td><td>Ten servers create links at once.</td></tr>
<tr><td>🧑‍💻</td><td>Random codes need no coordination: each server draws, the unique index rejects the rare duplicate, the server draws again. If we wanted counters, each server would take a block of IDs and scramble them so they are not sequential — more moving parts for no gain at our scale.</td></tr>
</table>

<h3>Weak answers and strong answers</h3>
<table>
<tr><th>Topic</th><th>Weak</th><th>Strong</th></tr>
<tr><td>Scope</td><td>Starts with the database.</td><td>Who creates, custom codes, expiry, stats, read:write ≥ 100:1, two “must never happen”.</td></tr>
<tr><td>Endpoints</td><td><code>POST /shorten</code>, <code>GET /getStats?code=</code>.</td><td><code>/v1/links</code> resource + a root redirect, reserved aliases.</td></tr>
<tr><td>Codes</td><td>“MD5, take 6 characters, unique enough.”</td><td>“~9 collisions per million at 6; random 7 + unique constraint + retry; counters are guessable.”</td></tr>
<tr><td>Errors</td><td>400 for everything.</td><td>409 alias, 422 URL/alias/TTL, 410 expired, 429 + Retry-After.</td></tr>
</table>

<h3>In interviews and at work</h3>
<ul>
  <li><strong>“How many characters?”</strong> Work back from the collisions you tolerate: N²/2S. One million links at 6 characters ≈ 9 (measured 8–13); at 7, under one.</li>
  <li><strong>“Is a short code a secret?”</strong> No — 7 random characters are not a password. Links to private data still need a login on the destination.</li>
</ul>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok"><ol>
  <li>Predict with N²/2S, then run <code>collisions.mjs 10000000</code>: how many collisions for 7 random characters?</li>
  <li>Start the shortener with <code>CODE=counter</code>, create three links and write down the codes. Can you guess the next one?</li>
  <li>Add <code>v2</code> and <code>docs</code> to the reserved words and a test that shows 422.</li>
</ol>
<p><strong>Done when:</strong> your prediction is within the measured range, and you can explain why the counter is fast but unsafe for private links.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Base62</span><span class="v">Writing a number with 0–9, A–Z, a–z: short and safe in URLs.</span></div>
  <div class="kv"><span class="k">Collision</span><span class="v">Two different links getting the same code.</span></div>
  <div class="kv"><span class="k">Birthday paradox</span><span class="v">Collisions appear after about √S draws, not S.</span></div>
  <div class="kv"><span class="k">Enumeration</span><span class="v">Guessing valid codes by walking a sequence.</span></div>
  <div class="kv"><span class="k">Alias</span><span class="v">A code the user chooses, e.g. f-code-k20.</span></div>
  <div class="kv"><span class="k">Reserved word</span><span class="v">A code that can never be an alias because the system needs the path.</span></div>
  <div class="kv"><span class="k">Unique constraint</span><span class="v">The database rule that makes the second identical code fail.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Clarify: who creates, custom codes, expiry, statistics, read:write (≥ 100:1, bursty), what must never happen.</li>
  <li>Contract: <code>/v1/links</code> for the API, <code>/{code}</code> for the redirect; 409 alias, 422 bad URL or alias, 410 expired, 429 on create.</li>
  <li>One million codes: random 5/6/7 characters ≈ 550 / 8–13 / 0–1 collisions; hashing collides the same; a counter never collides but is guessable.</li>
  <li>Choose random 7 characters + a unique constraint + retry; say why.</li>
  <li>Check-then-insert is only safe inside one process; the database constraint is the real guard.</li>
</ul>
<a class="link-card" href="/courses/system-design/learn?lessonSlug=sysd-4-2-sinh-ma" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Go deeper: System Design in Practice — 4.2 Generating short codes without collisions across servers</span><span class="lc-sub">This lesson is the interview version on one machine. That course (being written) runs the shortener at scale: ID blocks per server, edge redirects, hot links, click analytics.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-1-2-ngau-nhien" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Go deeper in the Authentication course — lesson 1.2: randomness, and how many bits is enough</span><span class="lc-sub">Same: random codes collide far sooner than intuition says (the birthday bound). That lesson adds the same bound for session tokens (128 bits: 2.17e19 tokens for a 50% chance), Math.random predicted exactly from 4 outputs, the modulo bias of byte % 10, and why string length is not entropy.</span></span>
  <span class="lc-cta">OPEN AUTHENTICATION LESSON →</span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.2</span>
<h2>Phỏng vấn: rút gọn link (1) — yêu cầu, hợp đồng và mã ngắn</h2>
<p class="lead">Rút gọn link là đề khởi động hay gặp nhất vì trông quá dễ — một bảng mã → URL — mà giấu những quyết định thật: mã trông thế nào, hai link cùng muốn một mã thì sao, người lạ đoán được gì từ một mã. Bài này chạy nửa đầu buổi phỏng vấn đó theo cách của bài 11.1, và mọi khẳng định đều có thứ chạy được làm chứng: một dịch vụ rút gọn chạy thật và một thí nghiệm trùng mã trên một triệu mã. Bài 11.3 làm nốt buổi phỏng vấn: chuyển hướng, tải và chống lạm dụng.</p>

<h3>Năm phút đầu</h3>
<table>
<tr><td>🎤</td><td>Thiết kế dịch vụ rút gọn link cho trường — kiểu bit.ly, cho CLB và giảng viên.</td></tr>
<tr><td>🧑‍💻</td><td>Ai được tạo link — mọi sinh viên hay chỉ CLB và cán bộ? Có cho tự chọn mã, như <code>/f-code-k20</code>, không? Link có hết hạn không? Người tạo có xem số lượt bấm không? Và khoảng bao nhiêu link, bao nhiêu lượt bấm?</td></tr>
<tr><td>🎤</td><td>Ai đăng nhập cũng được. Có cho chọn mã. Hết hạn thì tuỳ chọn. Có đếm lượt bấm, không cần gì cầu kỳ hơn. Cỡ vài nghìn link một ngày; link sự kiện hot có thể trăm nghìn lượt bấm trong một giờ.</td></tr>
<tr><td>🧑‍💻</td><td>Vậy đọc áp đảo — ít nhất 100 lượt bấm cho mỗi link tạo ra, và dồn cục. Trăm nghìn lượt trong một giờ là trung bình ~28 lượt/giây; chia sẻ vào một nhóm chat lớn có thể thành vài trăm lượt/giây trong một phút. Ngoài phạm vi: mã QR, thống kê theo địa lý, xem trước link. Tuyệt đối không được: một mã trỏ sang URL của người khác, và dịch vụ thành công cụ lừa đảo (phishing).</td></tr>
<tr><td>🎤</td><td>Tốt. Cho anh xem API.</td></tr>
</table>
<p>Trong năm phút ứng viên đã có tỉ lệ đọc/ghi (quyết định cache), đỉnh (quyết định công suất), phạm vi (quyết định thời gian) và hai điều “không được xảy ra” (quyết định ràng buộc). Ghi bốn dòng đó vào góc bảng.</p>

<h3>Hợp đồng</h3>
<pre><code class="language-plaintext">POST   /v1/links            {url, alias?, ttlDays?}   201 + Location    401 · 409 alias · 422 url/alias/ttl · 429
GET    /v1/links?cursor=…   my links                  200 {data, page.next}
GET    /v1/links/{code}     one of my links + clicks  200               404 (also: not mine)
DELETE /v1/links/{code}                               204               404
GET    /{code}              the redirect              302 Location      404 unknown · 410 expired</code></pre>
<p>Hai không gian tên có chủ đích: API nằm dưới <code>/v1/…</code> (có phiên bản, cần đăng nhập, JSON), còn chuyển hướng nằm ở gốc (ngắn, công khai, không JSON). Vì thế <code>v1</code>, <code>api</code>, <code>admin</code> là từ dành riêng (reserved word), không được làm alias (mã tự chọn) — nếu không, ai đó tạo alias <code>v1</code> là phiên bản API sau của bạn có lỗ thủng. Request tạo link đi qua một thứ tự kiểm cố định:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">ai?</span><span class="lz-d">token Bearer ⇒ không có thì 401</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">bao lâu một lần?</span><span class="lz-d">5 lần/phút/người ⇒ quá thì 429 + Retry-After</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">hợp lệ?</span><span class="lz-d">chỉ http(s), ≤ 2048 ký tự, không trỏ về chính mình, luật alias ⇒ sai thì 422</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">còn trống?</span><span class="lz-d">alias đã có ⇒ 409; mã ngẫu nhiên đã có ⇒ rút lại</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">lưu</span><span class="lz-d">201 + Location: /v1/links/{code}</span></div>
</div>
<p>Bản chạy được của câu trả lời này là <code>interview/shortener/app.mjs</code> (Express 5, ≈120 dòng, dữ liệu trong RAM). Hành vi của nó, đo thật (bản demo chạy với <code>DAY_MS=2000</code>, nên “một ngày” dài 2 s để thấy được hết hạn):</p>
<p>Bật nó trong một terminal riêng (<code>DAY_MS=2000</code> cho “một ngày” dài 2 s để thấy được hết hạn; token <code>tok_an</code> / <code>tok_bin</code> / <code>tok_lan</code> có sẵn):</p>
<pre><code class="language-bash">PORT=4120 DAY_MS=2000 node interview/shortener/app.mjs</code></pre>
<pre><code class="language-bash">curl -i localhost:4120/v1/links \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"url":"https://club.fpt.edu.vn/su-kien/hackathon-2026?utm_source=fb"}'</code></pre>
<div class="out">HTTP/1.1 201 Created
RateLimit-Policy: "create";q=5;w=60
Location: /v1/links/pnbwZf7
Content-Type: application/json; charset=utf-8
Content-Length: 197
ETag: W/"c5-fpKz7DdqQVbnq5WekuKaEex187s"
Date: Sun, 01 Nov 2026 02:17:56 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"code":"pnbwZf7","shortUrl":"http://localhost:4120/pnbwZf7","url":"https://club.fpt.edu.vn/su-kien/hackathon-2026?utm_source=fb","createdAt":"2026-11-01T02:17:56.137Z","expiresAt":null,"clicks":0}</div>
<p>An (thành viên CLB) đã giữ alias <code>f-code-k20</code> trước:</p>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' localhost:4120/v1/links -H 'Authorization: Bearer tok_an' --json '{"url":"https://club.fpt.edu.vn/f-code","alias":"f-code-k20"}'</code></pre>
<div class="out">201</div>
<pre><code class="language-bash">curl -s localhost:4120/v1/links \\
  -H 'Authorization: Bearer tok_bin' \\
  --json '{"url":"https://example.com/x","alias":"f-code-k20"}'</code></pre>
<div class="out">{"type":"https://short.example/problems/alias-taken","title":"ALIAS_TAKEN","status":409,"detail":"“f-code-k20” is already used","code":"ALIAS_TAKEN"}</div>
<pre><code class="language-bash">curl -s localhost:4120/v1/links \\
  -H 'Authorization: Bearer tok_bin' \\
  --json '{"url":"javascript:alert(1)"}'</code></pre>
<div class="out">{"type":"https://short.example/problems/invalid-url","title":"INVALID_URL","status":422,"detail":"url must be an absolute http(s) URL of at most 2048 characters","code":"INVALID_URL"}</div>
<pre><code class="language-bash">curl -s localhost:4120/v1/links \\
  -H 'Authorization: Bearer tok_bin' \\
  --json '{"url":"http://localhost:4120/f-code-k20"}'</code></pre>
<div class="out">{"type":"https://short.example/problems/invalid-url","title":"INVALID_URL","status":422,"detail":"A short link cannot point to another short link","code":"INVALID_URL"}</div>
<pre><code class="language-bash">curl -s localhost:4120/v1/links \\
  -H 'Authorization: Bearer tok_bin' \\
  --json '{"url":"https://example.com/y","alias":"admin"}'</code></pre>
<div class="out">{"type":"https://short.example/problems/invalid-alias","title":"INVALID_ALIAS","status":422,"detail":"alias: 4–30 characters A–Z a–z 0–9 _ -, not a reserved word","code":"INVALID_ALIAS"}</div>
<pre><code class="language-bash">curl -s localhost:4120/v1/links \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"url":"https://club.fpt.edu.vn/form-dang-ky","alias":"form-k20","ttlDays":1}' | grep -o '"expiresAt":"[^"]*"'</code></pre>
<div class="out">"expiresAt":"2026-11-01T02:17:58.268Z"</div>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' localhost:4120/form-k20</code></pre>
<div class="out">302</div>
<pre><code class="language-bash">sleep 2.2; curl -si localhost:4120/form-k20 | head -1</code></pre>
<div class="out">HTTP/1.1 410 Gone</div>
<pre><code class="language-bash">for i in 1 2 3 4 5 6; do curl -s -o /dev/null -w "%{http_code} " localhost:4120/v1/links -H 'Authorization: Bearer tok_lan' --json "{\\"url\\":\\"https://example.com/p/$i\\"}"; done; echo</code></pre>
<div class="out">201 201 201 201 201 429 </div>
<pre><code class="language-bash">curl -si localhost:4120/v1/links \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"url":"https://example.com/p/7"}' | grep -iE '^(HTTP|retry-after|ratelimit-policy)|"detail"'</code></pre>
<div class="out">HTTP/1.1 429 Too Many Requests
RateLimit-Policy: "create";q=5;w=60
Retry-After: 12
{"type":"https://short.example/problems/rate-limited","title":"RATE_LIMITED","status":429,"detail":"Too many links; retry in 12 s","code":"RATE_LIMITED"}</div>
<p>Mỗi dòng là một quyết định nói được trong một câu. Alias đã có là 409 — xung đột với trạng thái hiện có (1.3). <code>javascript:</code> là 422, vì dịch vụ chuyển hướng tới đó là công cụ tấn công. Link trỏ tới một link rút gọn khác là 422, không thì hai link có thể trỏ qua lại mãi. Link hết hạn là 410 Gone, báo cho bot tìm kiếm quên nó đi. Link thứ sáu trong một phút của cô Lan là 429 kèm <code>Retry-After</code> (5.3). Bộ giới hạn chạy <em>trước</em> bước kiểm dữ liệu, nên lần gọi hỏng cũng tốn một token — có chủ đích, để làm chậm kẻ dò alias.</p>

<h3>Mã ngắn: ba cách, đo thật</h3>
<p>Hãy nghĩ tới một lớp 40 sinh viên: xác suất có hai bạn trùng ngày sinh là khoảng 89%, dù một năm có 365 ngày (nghịch lý ngày sinh — birthday paradox). Mã ngắn cũng thế — trùng tới sớm hơn nhiều so với cảm giác “một phần 56 tỉ”. Rút ngẫu nhiên <em>N</em> mã từ <em>S</em> khả năng thì số lần trùng (collision) kỳ vọng khoảng <em>N²/2S</em>. Thay vì tin công thức, hãy sinh một triệu mã theo ba cách (<code>interview/shortener/codes.mjs</code>):</p>
<pre><code class="language-javascript">export const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
export function toBase62(n) {                       // counter → code: never collides, guessable
  let s = '';
  do { s = ALPHABET[n % 62] + s; n = Math.floor(n / 62); } while (n &gt; 0);
  return s;
}
export function randomCode(len) {                   // crypto.randomInt: not guessable, may collide
  let s = '';
  for (let i = 0; i &lt; len; i++) s += ALPHABET[randomInt(62)];
  return s;
}
// hashCode(url, len): first 64 bits of sha256(url) written in base62, cut to len</code></pre>
<pre><code class="language-bash">node interview/shortener/collisions.mjs</code></pre>
<div class="out">N = 1,000,000 link
cách                     không gian        trùng (đo, 3 lần)   kỳ vọng ≈ N²/2S   ns/mã
ngẫu nhiên 5 ký tự            916,132,832   532 / 556 / 554              545.8   962
ngẫu nhiên 6 ký tự         56,800,235,584   9 / 8 / 8                      8.8   1054
ngẫu nhiên 7 ký tự       3,521,614,606,208   0 / 0 / 0                      0.1   1197
băm sha256 cắt 6 ký tự     56,800,235,584   8                              8.8   1988
băm sha256 cắt 7 ký tự   3,521,614,606,208   0                              0.1   2057
base62 của bộ đếm          (vô hạn)           0                                0   404

base62 của bộ đếm:
  id              1 → 1        (1 ký tự)
  id             61 → z        (1 ký tự)
  id             62 → 10       (2 ký tự)
  id          3,843 → zz       (2 ký tự)
  id          3,844 → 100      (3 ký tự)
  id      1,000,000 → 4C92     (4 ký tự)
  id 56,800,235,583 → zzzzzz   (6 ký tự)
  id 56,800,235,584 → 1000000  (7 ký tự)
  mã của tôi 4C92 ⇒ mã trước/sau: 4C91 4C93 (đoán được)
  cùng URL băm hai lần: 3Vmil2d = 3Vmil2d</div>
<ul>
  <li><strong>Ngẫu nhiên, 6 ký tự</strong> (56,8 tỉ mã): 8–13 lần trùng mỗi triệu qua sáu mẫu của hai lần chạy, quanh mức 8,8 dự đoán. Bộ sinh ngẫu nhiên <em>bắt buộc</em> phải kiểm và rút lại. Với 7 ký tự (3,5 nghìn tỉ) trùng là hiếm (0–1 mỗi triệu), mỗi lần rút lại tốn một lần tra.</li>
  <li><strong>Băm URL rồi cắt 6 ký tự</strong>: trùng đúng bằng ngẫu nhiên — băm không làm mã ngắn thành duy nhất. Nó thêm một tính chất có thể bạn không muốn: cùng URL luôn ra cùng mã, nên hai CLB rút gọn cùng một form sẽ chung một link và một bộ đếm.</li>
  <li><strong>Base62 của bộ đếm</strong>: không bao giờ trùng và nhanh nhất (321–404 ns qua hai lần chạy); mã chỉ dài tới 7 ký tự sau 56,8 tỉ link. Nhưng <code>4C92</code> báo cho mọi người biết <code>4C91</code> và <code>4C93</code> tồn tại — ai cũng duyệt được cả bảng (enumeration — dò lần lượt), kể cả link “riêng tư” tới form chứa dữ liệu cá nhân. ID tuần tự làm lộ số lượng, như ở bài 9.4.</li>
</ul>
<div class="pitfall"><p><strong>Bẫy — “kiểm rồi mới chèn”.</strong> <code>if (!links.has(code)) links.set(code, …)</code> an toàn trong một tiến trình Node vì không gì chạy chen giữa hai dòng. Với CSDL và nhiều instance, hai request có thể cùng qua bước kiểm; chỉ ràng buộc <code>UNIQUE</code> trên <code>code</code> làm lần chèn thứ hai thất bại, rồi handler rút mã khác. Bài 11.6 đo đúng cuộc đua này trên lượt đặt phòng.</p></div>
<a class="link-card" href="https://github.com/donnemartin/system-design-primer/blob/master/solutions/system_design/pastebin/README.md" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: System Design Primer — Design Pastebin.com (or Bit.ly) (đọc ngày 1/11/2026)</span><span class="lc-sub">Mã ngắn của họ: MD5 của địa chỉ IP người dùng + thời điểm, mã hoá Base62, lấy 7 ký tự đầu (“62^7 khả năng”); đường ghi kiểm CSDL và “nếu url không duy nhất thì sinh url khác”. Dù băm vẫn cần bước kiểm trùng mà bạn vừa đo.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Câu hỏi thêm về mã</h3>
<table>
<tr><td>🎤</td><td>Sao không MD5 URL rồi lấy sáu ký tự? Khỏi phải lưu gì để gộp trùng.</td></tr>
<tr><td>🧑‍💻</td><td>Cắt băm còn sáu ký tự thì trùng như mã ngẫu nhiên — em đo được 8 mỗi triệu — nên vẫn phải kiểm duy nhất. Và gộp trùng không phải điều mình muốn: hai CLB rút gọn cùng một form sẽ chung số liệu. Em dùng 7 ký tự ngẫu nhiên và ràng buộc unique.</td></tr>
<tr><td>🎤</td><td>Có người xin alias <code>admin</code>, hoặc một alias mà mã ngẫu nhiên đã dùng.</td></tr>
<tr><td>🧑‍💻</td><td>Từ dành riêng là 422; alias đã có người dùng là 409, dù người hay bộ sinh lấy trước. Mã ngẫu nhiên 7 ký tự, alias tối thiểu 4, nên có thể đụng nhau; cùng một chỉ mục unique bảo vệ cả hai.</td></tr>
<tr><td>🎤</td><td>Mười server cùng tạo link một lúc.</td></tr>
<tr><td>🧑‍💻</td><td>Mã ngẫu nhiên không cần phối hợp: mỗi server tự rút, chỉ mục unique từ chối bản trùng hiếm hoi, server rút lại. Nếu dùng bộ đếm thì mỗi server nhận một khối ID và xáo cho khỏi tuần tự — thêm bộ phận mà ở quy mô của mình chẳng được gì.</td></tr>
</table>

<h3>Câu trả lời yếu và câu trả lời mạnh</h3>
<table>
<tr><th>Chủ đề</th><th>Yếu</th><th>Mạnh</th></tr>
<tr><td>Phạm vi</td><td>Bắt đầu bằng CSDL.</td><td>Ai tạo, mã tự chọn, hết hạn, thống kê, đọc:ghi ≥ 100:1, hai điều “không được xảy ra”.</td></tr>
<tr><td>Endpoint</td><td><code>POST /shorten</code>, <code>GET /getStats?code=</code>.</td><td>Tài nguyên <code>/v1/links</code> + chuyển hướng ở gốc, alias dành riêng.</td></tr>
<tr><td>Mã</td><td>“MD5, lấy 6 ký tự, đủ duy nhất.”</td><td>“~9 lần trùng mỗi triệu với 6 ký tự; ngẫu nhiên 7 + unique + rút lại; bộ đếm thì đoán được.”</td></tr>
<tr><td>Lỗi</td><td>Cái gì cũng 400.</td><td>409 alias, 422 URL/alias/hạn, 410 hết hạn, 429 + Retry-After.</td></tr>
</table>

<h3>Khi phỏng vấn và khi đi làm</h3>
<ul>
  <li><strong>“Bao nhiêu ký tự?”</strong> Tính ngược từ số lần trùng chấp nhận được: N²/2S. Một triệu link với 6 ký tự ≈ 9 (đo 8–13); với 7 thì dưới một.</li>
  <li><strong>“Mã ngắn có phải bí mật không?”</strong> Không — 7 ký tự ngẫu nhiên không phải mật khẩu. Link tới dữ liệu riêng tư vẫn cần đăng nhập ở trang đích.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
  <li>Dự đoán bằng N²/2S, rồi chạy <code>collisions.mjs 10000000</code>: 7 ký tự ngẫu nhiên trùng bao nhiêu lần?</li>
  <li>Chạy dịch vụ với <code>CODE=counter</code>, tạo ba link và ghi lại mã. Bạn đoán được mã tiếp theo không?</li>
  <li>Thêm <code>v2</code> và <code>docs</code> vào danh sách dành riêng, kèm một test cho thấy 422.</li>
</ol>
<p><strong>Đạt khi:</strong> dự đoán nằm trong khoảng đo được, và bạn giải thích được vì sao bộ đếm nhanh nhưng không an toàn cho link riêng tư.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Base62</span><span class="v">Viết số bằng 0–9, A–Z, a–z: ngắn và an toàn trong URL.</span></div>
  <div class="kv"><span class="k">Collision (trùng mã)</span><span class="v">Hai link khác nhau nhận cùng một mã.</span></div>
  <div class="kv"><span class="k">Birthday paradox (nghịch lý ngày sinh)</span><span class="v">Trùng xuất hiện sau khoảng √S lần rút, không phải S.</span></div>
  <div class="kv"><span class="k">Enumeration (dò lần lượt)</span><span class="v">Đoán mã hợp lệ bằng cách đi theo dãy số.</span></div>
  <div class="kv"><span class="k">Alias (mã tự chọn)</span><span class="v">Mã người dùng tự đặt, ví dụ f-code-k20.</span></div>
  <div class="kv"><span class="k">Reserved word (từ dành riêng)</span><span class="v">Mã không bao giờ được làm alias vì hệ thống cần đường đó.</span></div>
  <div class="kv"><span class="k">Unique constraint (ràng buộc duy nhất)</span><span class="v">Luật của CSDL làm mã trùng thứ hai bị từ chối.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Làm rõ: ai tạo, mã tự chọn, hết hạn, thống kê, đọc:ghi (≥ 100:1, dồn cục), điều gì không được xảy ra.</li>
  <li>Hợp đồng: <code>/v1/links</code> cho API, <code>/{code}</code> cho chuyển hướng; 409 alias, 422 URL hay alias sai, 410 hết hạn, 429 khi tạo.</li>
  <li>Một triệu mã: ngẫu nhiên 5/6/7 ký tự ≈ 550 / 8–13 / 0–1 lần trùng; băm trùng y như vậy; bộ đếm không trùng nhưng đoán được.</li>
  <li>Chọn ngẫu nhiên 7 ký tự + ràng buộc unique + rút lại; nói rõ vì sao.</li>
  <li>Kiểm-rồi-chèn chỉ an toàn trong một tiến trình; ràng buộc của CSDL mới là người gác thật.</li>
</ul>
<a class="link-card" href="/courses/system-design/learn?lessonSlug=sysd-4-2-sinh-ma" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Học sâu hơn: System Design in Practice — 4.2 Sinh mã ngắn không trùng trên nhiều máy chủ</span><span class="lc-sub">Bài này là bản phỏng vấn trên một máy. Khoá đó (đang soạn) chạy dịch vụ rút gọn ở quy mô lớn: khối ID cho từng máy, chuyển hướng ở biên, link nóng, thống kê lượt bấm.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-1-2-ngau-nhien" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Học sâu hơn ở khoá Authentication — bài 1.2: ngẫu nhiên, và bao nhiêu bit là đủ</span><span class="lc-sub">Giống: mã ngẫu nhiên trùng nhau sớm hơn trực giác nhiều (cận ngày sinh). Bài đó thêm cùng cận ấy cho token phiên (128 bit: 2,17e19 token mới có 50% trùng), Math.random bị đoán đúng từ 4 giá trị, sai lệch modulo của byte % 10, và vì sao độ dài chuỗi không phải entropy.</span></span>
  <span class="lc-cta">MỞ BÀI AUTHENTICATION →</span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 11.3 (bài MỚI) ─────────────────────────── */
    {
      title: '11.3 — Interview: a URL shortener (2) — 301 or 302, the hot path and abuse|||11.3 — Phỏng vấn: rút gọn link (2) — 301 hay 302, đường nóng và chống lạm dụng',
      slug: 'api-11-2-chuyen-huong',
      type: 'LESSON',
      isFreePreview: true,
      description: '301 bị Chromium cache nên server chỉ đếm 2/10 lượt bấm, 302 đếm đủ; một tiến trình 10.900–15.100 chuyển hướng/s, đếm lượt bấm bằng UPDATE một dòng PostgreSQL mất 21–39% còn XADD vào Redis Stream 0–12%; link lừa đảo, xoá link, thống kê; câu yếu, câu mạnh và chấm theo thang 6 tiêu chí.',
      content: `${G113}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.3</span>
<h2>Interview: a URL shortener (2) — 301 or 302, the hot path and abuse</h2>
<p class="lead">The second half of the shortener interview is about the one endpoint that does almost all the work: <code>GET /{code}</code>. Which redirect status it returns decides whether you can count clicks at all; how it counts them decides whether a viral link hurts; and what it is willing to redirect to decides whether your university's domain ends up in a phishing campaign. You will measure the first in a real Chromium browser and the second with a load test, then rehearse the follow-up questions and score the full answer with the rubric of 11.1.</p>

<h3>301 or 302? Measured in a real browser</h3>
<table>
<tr><td>🎤</td><td>Which status code does the redirect return?</td></tr>
<tr><td>🧑‍💻</td><td>The link is permanent, so 301 sounds right — but we promised click counts. Let me check what a browser does with each.</td></tr>
</table>
<p>Both mean “go over there”; the difference is what the browser may remember. <code>interview/shortener/browser-redirect.mjs</code> opens Chromium through Playwright, clicks the same short link five times as two different people (two separate browser profiles), and then asks the server how many clicks it counted:</p>
<p>This lesson uses four copies of the service, one per terminal, kept running to the end (stop the 11.2 one first — same port). <code>browser-redirect.mjs</code> needs Chromium once: <code>npx playwright install chromium</code>.</p>
<pre><code class="language-bash">PORT=4120 node interview/shortener/app.mjs                  # 302 (mặc định), đếm trong RAM
PORT=4122 REDIRECT=301 node interview/shortener/app.mjs
PORT=4125 CLICKS=pg node interview/shortener/app.mjs       # PostgreSQL ở PGURL (mặc định :55432)
PORT=4126 CLICKS=stream node interview/shortener/app.mjs   # Redis ở LABFLOW_REDIS (mặc định :6390)</code></pre>
<pre><code class="language-bash">node interview/shortener/browser-redirect.mjs http://localhost:4120</code></pre>
<div class="out">bạn A: bấm 5 lần · trình duyệt nhận 302 302 302 302 302 · server đếm 5 · tới trang đích 5
bạn B: bấm 5 lần · trình duyệt nhận 302 302 302 302 302 · server đếm 10 · tới trang đích 10</div>
<pre><code class="language-bash">node interview/shortener/browser-redirect.mjs http://localhost:4122</code></pre>
<div class="out">bạn A: bấm 5 lần · trình duyệt nhận 301 301 301 301 301 · server đếm 1 · tới trang đích 5
bạn B: bấm 5 lần · trình duyệt nhận 301 301 301 301 301 · server đếm 2 · tới trang đích 10</div>
<p>With 302 the server saw every click: 5, then 10. With 301 each browser came to the server <em>once</em>, then followed the redirect from its own cache. The users reached the page 10 times; the creator's statistics say 2. Nothing is wrong with Chromium — HTTP defines 301 as <em>heuristically cacheable</em> (a cache may keep it without being told), 302 not.</p>
<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc9110.html#section-15.4.2" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: RFC 9110 — 15.1, 15.4.2 301 Moved Permanently, 15.4.3 302 Found (read 1 Nov 2026)</span><span class="lc-sub">301: “any future references to this resource ought to use one of the enclosed URIs … A 301 response is heuristically cacheable”. 302: the target “resides temporarily under a different URI … the client ought to continue to use the target URI”. 15.1 lists 200, 301, 308, 404, 410 … as heuristically cacheable; 307/308 keep the method, 301/302 may turn POST into GET.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>
<table>
<tr><th>Code</th><th>Browser may cache?</th><th>Method kept?</th><th>For a shortener</th></tr>
<tr><td>301</td><td>yes, without headers</td><td>POST may become GET</td><td>only if clicks need not be counted and the target never changes</td></tr>
<tr><td>302</td><td>no, unless headers say so</td><td>POST may become GET</td><td>the usual choice: every click reaches you, the owner may change the target</td></tr>
<tr><td>307 / 308</td><td>308 yes, 307 no</td><td>yes</td><td>irrelevant for GET links; matter for API redirects</td></tr>
</table>

<h3>The hot path: how fast, and where the click goes</h3>
<p>The redirect is one lookup and one header. The interesting part is the click counter: the naive design runs <code>UPDATE links SET clicks = clicks + 1</code> on every request. The shortener has three modes — <code>CLICKS=memory</code> (a counter in RAM, only for the demo), <code>CLICKS=pg</code> (one UPDATE per click on one PostgreSQL row) and <code>CLICKS=stream</code> (append one entry to a Redis Stream that a worker aggregates later, as in 10.2–10.3) — each loaded with 50 connections for 10 seconds:</p>
<pre><code class="language-javascript">async function countClick(l) {
  if (db) return db.query('UPDATE ivs.link_clicks SET clicks = clicks + 1 WHERE code = $1', [l.code]);   // one hot row
  if (redis) return redis.xAdd('short:clicks', '*', { code: l.code, at: String(Date.now()) });           // a worker aggregates
  l.clicks++;
}</code></pre>
<p>The benchmark hits <code>/f-code-k20</code>, so create that link on the three counting servers first:</p>
<pre><code class="language-bash">for p in 4120 4125 4126; do curl -s -o /dev/null -w "$p %{http_code}\\n" localhost:$p/v1/links -H 'Authorization: Bearer tok_bin' --json '{"url":"https://example.com/x","alias":"f-code-k20"}'; done</code></pre>
<div class="out">4120 201
4125 201
4126 201</div>
<pre><code class="language-bash">bash interview/shortener/bench-short.sh 4120 "CLICKS=memory"</code></pre>
<div class="out">CLICKS=memory              15107 chuyển hướng/s · p50 3 ms · p99 6 ms · tổng 166175 · lỗi 0</div>
<pre><code class="language-bash">bash interview/shortener/bench-short.sh 4126 "CLICKS=stream (XADD)"</code></pre>
<div class="out">CLICKS=stream (XADD)       13253 chuyển hướng/s · p50 3 ms · p99 7 ms · tổng 145765 · lỗi 0</div>
<pre><code class="language-bash">bash interview/shortener/bench-short.sh 4125 "CLICKS=pg (UPDATE 1 dòng)"</code></pre>
<div class="out">CLICKS=pg (UPDATE 1 dòng)  9225 chuyển hướng/s · p50 4 ms · p99 14 ms · tổng 101484 · lỗi 0</div>
<pre><code class="language-bash">psql "postgres://labflow@localhost:55432/labflow" -Atc "SELECT code, clicks FROM ivs.link_clicks"</code></pre>
<div class="out">f-code-k20|101534</div>
<pre><code class="language-bash">redis-cli -p 6390 XLEN short:clicks</code></pre>
<div class="out">145815</div>
<p>On this laptop (shared with other jobs, load average up to 39 during the runs; four runs gave memory 10,900–15,100, stream 11,000–13,300, PostgreSQL 7,600–9,800 redirects/s), appending to a stream cost 0–12% of the throughput, while one UPDATE per click cost 21–39% — and the database sat on the same machine, with no network round trip. Every one of those 101,534 increments is a row lock, a WAL record and later a vacuum, all on a single row. The database counted 101,534 while autocannon reported 101,484 completed in its window: the difference is requests still in flight when the clock stopped plus the one test click — counting is exact, the load tool's window is not.</p>
<p>Now the honest part, which interviewers like: the interviewer's peak was ~28 clicks per second. Even the naive UPDATE handled at least 270 times that here. Say so: “at our scale a per-click UPDATE works; I would still count through a stream, because it keeps the hot path free of writes and gives per-minute statistics for free — and I would switch if click volume reached thousands per second”.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Edge / CDN</span><span class="lz-lnote">only with 301-style caching or edge counting — a viral link then never reaches you, and neither do its clicks</span></div>
  <div class="lz-layer"><span class="lz-lname">API · GET /{code}</span><span class="lz-lnote">lookup in memory/Redis (9.2), 302 in ~3 ms; unknown codes cached briefly (negative cache)</span></div>
  <div class="lz-layer"><span class="lz-lname">Click → stream</span><span class="lz-lnote">XADD, no row lock; a worker aggregates per minute (10.2) — counts are eventually consistent</span></div>
  <div class="lz-layer"><span class="lz-lname">Database</span><span class="lz-lnote">links (unique code) + per-minute click table; read on cache miss, written on create</span></div>
</div>

<h3>The follow-up questions</h3>
<table>
<tr><td>🎤</td><td>Someone shortens a phishing page and spreads it with our domain.</td></tr>
<tr><td>🧑‍💻</td><td>Creation needs a login and is rate-limited, so abuse is attributable and slow. Only http(s), a blocklist check on create, and a way to disable a code: <code>GET /{code}</code> then answers 410 with a warning page instead of redirecting. I would not fetch the destination from our server to inspect it without the SSRF guards of 6.3.</td></tr>
<tr><td>🎤</td><td>A creator deletes a link. What do old posters show?</td></tr>
<tr><td>🧑‍💻</td><td>Never-existing codes are 404; deleted or expired codes 410. I would not hand a deleted code to someone else for a long time — otherwise a printed poster silently sends people to a stranger's page.</td></tr>
<tr><td>🎤</td><td>The creator wants clicks per day.</td></tr>
<tr><td>🧑‍💻</td><td><code>GET /v1/links/{code}/stats?from=…&amp;to=…&amp;interval=day</code>, owner only (404 otherwise), from the per-minute table; the response carries <code>asOf</code> so the dashboard can say “updated 40 s ago”.</td></tr>
<tr><td>🎤</td><td>Can the owner change where a link points?</td></tr>
<tr><td>🧑‍💻</td><td><code>PATCH /v1/links/{code}</code> with If-Match (5.4). That only works because we answer 302 — with 301, browsers that cached the old target keep going there.</td></tr>
</table>

<h3>Weak answers and strong answers</h3>
<table>
<tr><th>Topic</th><th>Weak</th><th>Strong</th></tr>
<tr><td>Redirect</td><td>“301, it's permanent.”</td><td>“301 is cached by browsers — measured 2 counted of 10 clicks. We count and allow edits, so 302.”</td></tr>
<tr><td>Scale</td><td>“Shard the database across 10 nodes.”</td><td>“11,000–15,000 redirects/s on one process; peak is 28/s. Keep the hot path a lookup.”</td></tr>
<tr><td>Counting</td><td>“UPDATE the counter.”</td><td>“UPDATE cost 21–39% here and is one hot row; append to a stream, aggregate per minute, say counts lag.”</td></tr>
<tr><td>Abuse</td><td>Not mentioned.</td><td>Login + 429, http(s) only, blocklist, disable → 410, reserved aliases.</td></tr>
</table>

<h3>Scoring the whole shortener answer</h3>
<p>Put 11.2 and 11.3 together and score them with the rubric of 11.1:</p>
<table>
<tr><th>Criterion</th><th>Score</th><th>Why</th></tr>
<tr><td>1 · Requirements and numbers</td><td>3</td><td>scope, read:write ≥ 100:1, peak 28/s compared with 11,000–15,000/s measured</td></tr>
<tr><td>2 · API surface</td><td>3</td><td>resource + root redirect, 201/Location, reserved aliases</td></tr>
<tr><td>3 · Correctness under failure</td><td>3</td><td>unique constraint + retry, 409/410/422, check-then-insert race named</td></tr>
<tr><td>4 · Security and operations</td><td>2–3</td><td>3 only if phishing, enumeration and 429 come up before the interviewer asks</td></tr>
<tr><td>5 · Scale and trade-offs</td><td>3</td><td>301 vs 302 measured, counting via stream with its cost (lag)</td></tr>
<tr><td>6 · Communication</td><td>?</td><td>only a listener can score this — record yourself (Lab 11)</td></tr>
</table>

<h3>In interviews and at work</h3>
<ul>
  <li><strong>“Why not 301?”</strong> Browsers cache it; your counter and your ability to change the target disappear.</li>
  <li><strong>“What breaks first?”</strong> Not the redirect (thousands per second on one process) but synchronous writes on it — keep writes off the hot path.</li>
</ul>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok"><ol>
  <li>Add <code>Cache-Control: no-store</code> to the 301 and rerun <code>browser-redirect.mjs</code>. Does the server now count every click?</li>
  <li>Write the worker: read <code>short:clicks</code> with XREAD, add counts per code per minute into a PostgreSQL table, and serve <code>GET /v1/links/{code}/stats</code> from it.</li>
  <li>Run the hot-path benchmark again while your worker runs. Does the redirect rate change?</li>
</ol>
<p><strong>Done when:</strong> the stats endpoint returns the same total as the stream length, owner only, with an <code>asOf</code> field.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">301 Moved Permanently</span><span class="v">Permanent redirect; browsers may cache it without headers.</span></div>
  <div class="kv"><span class="k">302 Found</span><span class="v">Temporary redirect; every visit asks the server again.</span></div>
  <div class="kv"><span class="k">Heuristically cacheable</span><span class="v">A response a cache may keep without explicit freshness headers.</span></div>
  <div class="kv"><span class="k">Hot path</span><span class="v">The request served most often; keep it to a lookup.</span></div>
  <div class="kv"><span class="k">Hot row</span><span class="v">One database row that every request updates and locks.</span></div>
  <div class="kv"><span class="k">Negative cache</span><span class="v">Briefly remembering that a code does not exist.</span></div>
  <div class="kv"><span class="k">Eventually consistent</span><span class="v">Correct after a short delay, not immediately (click counts here).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Chromium cached the 301: the server counted 2 of 10 clicks; with 302 it counted all 10.</li>
  <li>Choose 302 when you count clicks or let owners change targets; 301 only for “moved forever”.</li>
  <li>One process: 10,900–15,100 redirects/s over four runs; the interviewer's peak was 28/s.</li>
  <li>One UPDATE per click cost 21–39% even locally and is one hot row; a Redis Stream append cost 0–12%.</li>
  <li>Abuse: login + 429, http(s) only, blocklist, disable with 410, never reuse deleted codes quickly.</li>
</ul>
<a class="link-card" href="/courses/redis/learn?lessonSlug=rd-8-2-stream" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Go deeper: Redis course — 8.2 Streams: a log that remembers</span><span class="lc-sub">The click counter here appends to a stream; that lesson covers XADD, consumer groups, acknowledgements and trimming — what a worker that folds clicks per minute needs.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.3</span>
<h2>Phỏng vấn: rút gọn link (2) — 301 hay 302, đường nóng và chống lạm dụng</h2>
<p class="lead">Nửa sau buổi phỏng vấn rút gọn link xoay quanh endpoint làm gần như mọi việc: <code>GET /{code}</code>. Status code chuyển hướng nó trả quyết định bạn có đếm được lượt bấm hay không; cách nó đếm quyết định một link lan truyền có làm hệ thống đau hay không; còn việc nó chịu chuyển hướng tới đâu quyết định tên miền trường bạn có lọt vào một chiến dịch lừa đảo hay không. Bạn sẽ đo điều thứ nhất trong trình duyệt Chromium thật, điều thứ hai bằng test tải, rồi tập các câu hỏi thêm và chấm cả câu trả lời bằng thang chấm của bài 11.1.</p>

<h3>301 hay 302? Đo trong trình duyệt thật</h3>
<table>
<tr><td>🎤</td><td>Chuyển hướng trả status code nào?</td></tr>
<tr><td>🧑‍💻</td><td>Link là vĩnh viễn nên nghe như 301 — nhưng mình đã hứa đếm lượt bấm. Để em xem trình duyệt làm gì với từng mã.</td></tr>
</table>
<p>Cả hai đều nghĩa là “sang chỗ kia”; khác nhau ở chỗ trình duyệt được phép nhớ gì. <code>interview/shortener/browser-redirect.mjs</code> mở Chromium qua Playwright, bấm cùng một link rút gọn năm lần dưới vai hai người khác nhau (hai hồ sơ trình duyệt riêng), rồi hỏi server đã đếm được bao nhiêu lượt:</p>
<p>Bài này dùng bốn bản của dịch vụ, mỗi bản một terminal, để chạy tới cuối bài (tắt bản của 11.2 trước — cùng cổng). <code>browser-redirect.mjs</code> cần Chromium một lần: <code>npx playwright install chromium</code>.</p>
<pre><code class="language-bash">PORT=4120 node interview/shortener/app.mjs                  # 302 (mặc định), đếm trong RAM
PORT=4122 REDIRECT=301 node interview/shortener/app.mjs
PORT=4125 CLICKS=pg node interview/shortener/app.mjs       # PostgreSQL ở PGURL (mặc định :55432)
PORT=4126 CLICKS=stream node interview/shortener/app.mjs   # Redis ở LABFLOW_REDIS (mặc định :6390)</code></pre>
<pre><code class="language-bash">node interview/shortener/browser-redirect.mjs http://localhost:4120</code></pre>
<div class="out">bạn A: bấm 5 lần · trình duyệt nhận 302 302 302 302 302 · server đếm 5 · tới trang đích 5
bạn B: bấm 5 lần · trình duyệt nhận 302 302 302 302 302 · server đếm 10 · tới trang đích 10</div>
<pre><code class="language-bash">node interview/shortener/browser-redirect.mjs http://localhost:4122</code></pre>
<div class="out">bạn A: bấm 5 lần · trình duyệt nhận 301 301 301 301 301 · server đếm 1 · tới trang đích 5
bạn B: bấm 5 lần · trình duyệt nhận 301 301 301 301 301 · server đếm 2 · tới trang đích 10</div>
<p>Với 302, server thấy mọi lượt bấm: 5, rồi 10. Với 301, mỗi trình duyệt chỉ tới server <em>một lần</em>, sau đó tự chuyển hướng từ bộ nhớ đệm của nó. Người dùng tới trang đích 10 lần; thống kê của người tạo link ghi 2. Chromium không sai — HTTP định nghĩa 301 là <em>heuristically cacheable</em> (bộ đệm được giữ lại dù không ai bảo), còn 302 thì không.</p>
<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc9110.html#section-15.4.2" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: RFC 9110 — 15.1, 15.4.2 301 Moved Permanently, 15.4.3 302 Found (đọc ngày 1/11/2026)</span><span class="lc-sub">301: “mọi tham chiếu sau này tới tài nguyên nên dùng một trong các URI kèm theo … response 301 là heuristically cacheable”. 302: đích “tạm thời nằm ở URI khác … client nên tiếp tục dùng URI gốc”. Mục 15.1 liệt kê 200, 301, 308, 404, 410 … là heuristically cacheable; 307/308 giữ phương thức, 301/302 có thể đổi POST thành GET.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<table>
<tr><th>Mã</th><th>Trình duyệt được cache?</th><th>Giữ phương thức?</th><th>Với dịch vụ rút gọn</th></tr>
<tr><td>301</td><td>có, không cần header</td><td>POST có thể thành GET</td><td>chỉ khi không cần đếm lượt bấm và đích không bao giờ đổi</td></tr>
<tr><td>302</td><td>không, trừ khi header cho phép</td><td>POST có thể thành GET</td><td>lựa chọn thường dùng: mọi lượt bấm tới server, chủ link đổi đích được</td></tr>
<tr><td>307 / 308</td><td>308 có, 307 không</td><td>có</td><td>không quan trọng với link GET; quan trọng khi API chuyển hướng</td></tr>
</table>

<h3>Đường nóng: nhanh tới đâu, và lượt bấm đi đâu</h3>
<p>Chuyển hướng là một lần tra và một header. Phần đáng bàn là bộ đếm: thiết kế ngây thơ chạy <code>UPDATE links SET clicks = clicks + 1</code> ở mỗi request. Dịch vụ có ba chế độ — <code>CLICKS=memory</code> (đếm trong RAM, chỉ để demo), <code>CLICKS=pg</code> (mỗi lượt bấm một câu UPDATE trên một dòng PostgreSQL) và <code>CLICKS=stream</code> (thêm một mục vào Redis Stream để worker gộp sau, như bài 10.2–10.3) — mỗi chế độ chịu 50 kết nối trong 10 giây:</p>
<pre><code class="language-javascript">async function countClick(l) {
  if (db) return db.query('UPDATE ivs.link_clicks SET clicks = clicks + 1 WHERE code = $1', [l.code]);   // one hot row
  if (redis) return redis.xAdd('short:clicks', '*', { code: l.code, at: String(Date.now()) });           // a worker aggregates
  l.clicks++;
}</code></pre>
<p>Bộ đo gọi <code>/f-code-k20</code>, nên tạo link đó trên ba server đếm trước:</p>
<pre><code class="language-bash">for p in 4120 4125 4126; do curl -s -o /dev/null -w "$p %{http_code}\\n" localhost:$p/v1/links -H 'Authorization: Bearer tok_bin' --json '{"url":"https://example.com/x","alias":"f-code-k20"}'; done</code></pre>
<div class="out">4120 201
4125 201
4126 201</div>
<pre><code class="language-bash">bash interview/shortener/bench-short.sh 4120 "CLICKS=memory"</code></pre>
<div class="out">CLICKS=memory              15107 chuyển hướng/s · p50 3 ms · p99 6 ms · tổng 166175 · lỗi 0</div>
<pre><code class="language-bash">bash interview/shortener/bench-short.sh 4126 "CLICKS=stream (XADD)"</code></pre>
<div class="out">CLICKS=stream (XADD)       13253 chuyển hướng/s · p50 3 ms · p99 7 ms · tổng 145765 · lỗi 0</div>
<pre><code class="language-bash">bash interview/shortener/bench-short.sh 4125 "CLICKS=pg (UPDATE 1 dòng)"</code></pre>
<div class="out">CLICKS=pg (UPDATE 1 dòng)  9225 chuyển hướng/s · p50 4 ms · p99 14 ms · tổng 101484 · lỗi 0</div>
<pre><code class="language-bash">psql "postgres://labflow@localhost:55432/labflow" -Atc "SELECT code, clicks FROM ivs.link_clicks"</code></pre>
<div class="out">f-code-k20|101534</div>
<pre><code class="language-bash">redis-cli -p 6390 XLEN short:clicks</code></pre>
<div class="out">145815</div>
<p>Trên laptop này (dùng chung với việc khác, load average lên tới 39 lúc đo; bốn lần đo cho: memory 10.900–15.100, stream 11.000–13.300, PostgreSQL 7.600–9.800 chuyển hướng/s), thêm vào stream tốn 0–12% thông lượng, còn mỗi lượt bấm một câu UPDATE làm mất 21–39% — dù CSDL nằm ngay trên máy, không có độ trễ mạng. Mỗi lần trong 101.534 lần cộng đó là một khoá dòng (row lock), một bản ghi WAL và về sau một lần dọn (vacuum), tất cả trên đúng một dòng (hot row — dòng nóng). CSDL đếm 101.534 trong khi autocannon báo 101.484 request hoàn tất trong cửa sổ đo: chênh lệch là các request còn đang bay lúc đồng hồ dừng cộng một lượt bấm thử — bộ đếm chính xác, cửa sổ của công cụ đo thì không.</p>
<p>Giờ tới phần trung thực mà người phỏng vấn thích: đỉnh của đề là ~28 lượt bấm/giây. Ngay cả UPDATE ngây thơ ở đây cũng chịu được ít nhất gấp 270 lần. Hãy nói thẳng: “ở quy mô này UPDATE mỗi lượt bấm vẫn chạy; em vẫn đếm qua stream vì nó giữ đường nóng sạch khỏi thao tác ghi và cho thống kê theo phút miễn phí — và em sẽ đổi hẳn khi lượt bấm lên tới hàng nghìn mỗi giây”.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Biên / CDN</span><span class="lz-lnote">chỉ khi chấp nhận cache kiểu 301 hoặc đếm ở biên — link lan truyền không tới bạn nữa, lượt bấm của nó cũng vậy</span></div>
  <div class="lz-layer"><span class="lz-lname">API · GET /{code}</span><span class="lz-lnote">tra trong RAM/Redis (9.2), trả 302 trong ~3 ms; mã không tồn tại cũng được nhớ ngắn hạn (negative cache)</span></div>
  <div class="lz-layer"><span class="lz-lname">Lượt bấm → stream</span><span class="lz-lnote">XADD, không khoá dòng; worker gộp theo phút (10.2) — số đếm nhất quán sau (eventually consistent)</span></div>
  <div class="lz-layer"><span class="lz-lname">CSDL</span><span class="lz-lnote">bảng links (mã unique) + bảng lượt bấm theo phút; đọc khi trượt cache, ghi khi tạo link</span></div>
</div>

<h3>Các câu hỏi thêm</h3>
<table>
<tr><td>🎤</td><td>Có người rút gọn một trang lừa đảo và phát tán bằng tên miền của mình.</td></tr>
<tr><td>🧑‍💻</td><td>Tạo link cần đăng nhập và bị giới hạn tần suất, nên lạm dụng truy được người và bị làm chậm. Chỉ nhận http(s), kiểm danh sách chặn (blocklist) khi tạo, và có cách vô hiệu một mã: lúc đó <code>GET /{code}</code> trả 410 kèm trang cảnh báo thay vì chuyển hướng. Em sẽ không để server tự tải trang đích về soi nếu chưa có các rào chống SSRF của bài 6.3.</td></tr>
<tr><td>🎤</td><td>Người tạo xoá link. Poster cũ hiện gì?</td></tr>
<tr><td>🧑‍💻</td><td>Mã chưa từng tồn tại là 404; mã đã xoá hoặc hết hạn là 410. Em sẽ không trao mã đã xoá cho người khác trong thời gian dài — không thì một poster in sẵn lặng lẽ dẫn người ta sang trang của người lạ.</td></tr>
<tr><td>🎤</td><td>Người tạo muốn xem lượt bấm theo ngày.</td></tr>
<tr><td>🧑‍💻</td><td><code>GET /v1/links/{code}/stats?from=…&amp;to=…&amp;interval=day</code>, chỉ chủ link (người khác 404), đọc từ bảng theo phút; response có <code>asOf</code> để dashboard ghi “cập nhật 40 giây trước”.</td></tr>
<tr><td>🎤</td><td>Chủ link có đổi được đích không?</td></tr>
<tr><td>🧑‍💻</td><td><code>PATCH /v1/links/{code}</code> kèm If-Match (5.4). Đổi được chỉ vì mình trả 302 — với 301, trình duyệt đã cache đích cũ cứ thế đi tới đó.</td></tr>
</table>

<h3>Câu trả lời yếu và câu trả lời mạnh</h3>
<table>
<tr><th>Chủ đề</th><th>Yếu</th><th>Mạnh</th></tr>
<tr><td>Chuyển hướng</td><td>“301, vì vĩnh viễn.”</td><td>“301 bị trình duyệt cache — đo được 2/10 lượt bấm. Mình đếm và cho sửa đích, nên 302.”</td></tr>
<tr><td>Quy mô</td><td>“Shard CSDL ra 10 node.”</td><td>“Một tiến trình 11.000–15.000 chuyển hướng/s; đỉnh là 28/s. Giữ đường nóng là một lần tra.”</td></tr>
<tr><td>Đếm lượt bấm</td><td>“UPDATE bộ đếm.”</td><td>“UPDATE tốn 21–39% ở đây và là một dòng nóng; thêm vào stream, gộp theo phút, nói rõ số đếm trễ.”</td></tr>
<tr><td>Lạm dụng</td><td>Không nhắc.</td><td>Đăng nhập + 429, chỉ http(s), blocklist, vô hiệu → 410, alias dành riêng.</td></tr>
</table>

<h3>Chấm cả câu trả lời rút gọn link</h3>
<p>Ghép bài 11.2 với 11.3 rồi chấm bằng thang của bài 11.1:</p>
<table>
<tr><th>Tiêu chí</th><th>Điểm</th><th>Vì sao</th></tr>
<tr><td>1 · Yêu cầu và con số</td><td>3</td><td>phạm vi, đọc:ghi ≥ 100:1, đỉnh 28/s so với 11.000–15.000/s đo được</td></tr>
<tr><td>2 · Bề mặt API</td><td>3</td><td>tài nguyên + chuyển hướng ở gốc, 201/Location, alias dành riêng</td></tr>
<tr><td>3 · Đúng khi có sự cố</td><td>3</td><td>ràng buộc unique + rút lại, 409/410/422, gọi tên cuộc đua kiểm-rồi-chèn</td></tr>
<tr><td>4 · Bảo mật và vận hành</td><td>2–3</td><td>3 chỉ khi lừa đảo, dò mã và 429 được nói ra trước khi bị hỏi</td></tr>
<tr><td>5 · Quy mô và đánh đổi</td><td>3</td><td>301 với 302 có số đo, đếm qua stream kèm cái giá (trễ)</td></tr>
<tr><td>6 · Giao tiếp</td><td>?</td><td>chỉ người nghe chấm được — hãy tự ghi âm (Lab 11)</td></tr>
</table>

<h3>Khi phỏng vấn và khi đi làm</h3>
<ul>
  <li><strong>“Sao không 301?”</strong> Trình duyệt cache nó; bộ đếm và khả năng đổi đích của bạn biến mất.</li>
  <li><strong>“Cái gì hỏng trước?”</strong> Không phải chuyển hướng (hàng nghìn lượt/s trên một tiến trình) mà là thao tác ghi đồng bộ gắn vào nó — đưa thao tác ghi ra khỏi đường nóng.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
  <li>Thêm <code>Cache-Control: no-store</code> vào 301 rồi chạy lại <code>browser-redirect.mjs</code>. Server có đếm đủ mọi lượt bấm không?</li>
  <li>Viết worker: đọc <code>short:clicks</code> bằng XREAD, cộng số lượt theo mã theo phút vào một bảng PostgreSQL, và phục vụ <code>GET /v1/links/{code}/stats</code> từ đó.</li>
  <li>Chạy lại benchmark đường nóng trong lúc worker chạy. Tốc độ chuyển hướng có đổi không?</li>
</ol>
<p><strong>Đạt khi:</strong> endpoint thống kê trả tổng bằng độ dài stream, chỉ chủ link xem được, có trường <code>asOf</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">301 Moved Permanently (chuyển hẳn)</span><span class="v">Chuyển hướng vĩnh viễn; trình duyệt được cache dù không có header.</span></div>
  <div class="kv"><span class="k">302 Found (chuyển tạm)</span><span class="v">Chuyển hướng tạm thời; mỗi lần truy cập lại hỏi server.</span></div>
  <div class="kv"><span class="k">Heuristically cacheable (được cache theo suy đoán)</span><span class="v">Response mà bộ đệm được giữ dù không có header thời hạn rõ ràng.</span></div>
  <div class="kv"><span class="k">Hot path (đường nóng)</span><span class="v">Request được gọi nhiều nhất; giữ nó chỉ là một lần tra.</span></div>
  <div class="kv"><span class="k">Hot row (dòng nóng)</span><span class="v">Một dòng CSDL mà mọi request đều cập nhật và khoá.</span></div>
  <div class="kv"><span class="k">Negative cache (nhớ “không có”)</span><span class="v">Nhớ ngắn hạn rằng một mã không tồn tại.</span></div>
  <div class="kv"><span class="k">Eventually consistent (nhất quán sau)</span><span class="v">Đúng sau một khoảng trễ ngắn, không phải ngay lập tức (số lượt bấm ở đây).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Chromium cache 301: server đếm được 2/10 lượt bấm; với 302 đếm đủ 10.</li>
  <li>Chọn 302 khi đếm lượt bấm hoặc cho chủ link đổi đích; 301 chỉ cho “chuyển hẳn mãi mãi”.</li>
  <li>Một tiến trình: 10.900–15.100 chuyển hướng/s qua bốn lần đo; đỉnh của đề là 28/s.</li>
  <li>Mỗi lượt bấm một UPDATE tốn 21–39% dù CSDL chạy cùng máy, và là một dòng nóng; thêm vào Redis Stream tốn 0–12%.</li>
  <li>Lạm dụng: đăng nhập + 429, chỉ http(s), blocklist, vô hiệu bằng 410, không trao lại mã đã xoá sớm.</li>
</ul>
<a class="link-card" href="/courses/redis/learn?lessonSlug=rd-8-2-stream" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Học sâu hơn: khoá Redis — 8.2 Stream: cuốn nhật ký biết nhớ</span><span class="lc-sub">Bộ đếm lượt bấm ở đây ghi vào stream; bài đó giảng XADD, consumer group, xác nhận và cắt bớt — đúng thứ một worker gộp lượt bấm theo phút cần.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 11.4 ─────────────────────────── */
    {
      title: '11.4 — Interview: design the API of a news feed|||11.4 — Phỏng vấn: thiết kế API cho news feed',
      slug: 'api-11-3-feed-chat',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Feed: fan-out khi ghi (100.000 người theo dõi: 200.000 lệnh Redis, ~0,5 s) hay khi đọc (theo dõi 1.000 nguồn: 7,7 ms mỗi lần đọc) và kiểu lai (0,16 ms), phân trang offset lặp bài còn cursor thì không; bản ghi phỏng vấn, câu yếu và câu mạnh.',
      content: `${G114}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.4</span>
<h2>Interview: design the API of a news feed</h2>
<p class="lead">“Design the feed of a social app” is the classic question where a decision about <em>when</em> to do work — at write time or at read time — changes everything else. The API is small; the trade-off behind it is not, and it is the part interviewers push on. In this lesson you answer it for a campus app with clubs and one very popular official page, measure both strategies on Redis 8.2 with 100,000 followers, see why the hybrid exists, and watch offset pagination repeat a post while cursor pagination does not.</p>

<h3>The first five minutes</h3>
<table>
<tr><td>🎤</td><td>Design the home feed of a campus app: students follow friends and club pages and see their posts.</td></tr>
<tr><td>🧑‍💻</td><td>Is following one-way, like Twitter, or friendship both ways? Newest first, or ranked? How many follows does a typical student have, and how big is the biggest page? Do we need “new posts” to appear live?</td></tr>
<tr><td>🎤</td><td>One-way follow. Newest first for now. A student follows maybe 150 accounts; the official university page has 100,000 followers. Live updates would be nice.</td></tr>
<tr><td>🧑‍💻</td><td>Then the feed is read far more than posts are written, and one account is about 670 times bigger than a normal one (100,000 ÷ 150) — that single fact decides the design. Out of scope: ranking, comments, media upload. Must never happen: a post from someone I blocked, or a deleted post still shown.</td></tr>
</table>

<h3>The contract</h3>
<pre><code class="language-plaintext">POST   /v1/posts                 Idempotency-Key   201 + Location      422 · 429
DELETE /v1/posts/{id}                              204                 404 (also: not mine)
GET    /v1/feed?limit=20&amp;cursor=…                  200 {data, page.next}   400 bad cursor
GET    /v1/users/{id}/posts?cursor=…               200 {data, page.next}
PUT    /v1/me/following/{userId}                   204 (idempotent)    404
DELETE /v1/me/following/{userId}                   204</code></pre>
<p>Two details are worth saying. Following is <code>PUT</code> on a sub-resource of <code>me</code>, so pressing “Follow” twice is harmless (1.2). And the feed's cursor is <strong>opaque</strong> (3.2): the client never learns whether it is a timestamp, a post id or a ranking score — which is what lets you add ranking next year without a <code>/v2</code>.</p>

<h3>Two strategies: push to mailboxes, or read the notice boards</h3>
<p>Picture a dormitory. <strong>Fan-out on write</strong> (push) is a postman who puts a copy of every letter into each subscriber's mailbox: reading is trivial — open your box — but a letter to 100,000 people means 100,000 deliveries. <strong>Fan-out on read</strong> (pull) means every author pins posts on their own board, and each reader walks past all the boards they follow: writing is one action, reading costs one stop per board. The code of both on Redis sorted sets (a set ordered by a score — here the increasing post id, so newest first):</p>
<pre><code class="language-javascript">// interview/feed/fanout.mjs (trích)
// GHI kiểu "đẩy" (push): một bài ⇒ chép id vào timeline của TỪNG người theo dõi
async function pushPost(followers) {
  const id = ++postId;
  await Promise.all(followers.flatMap((f) =&gt; [                     // node-redis tự gom các lệnh cùng nhịp thành pipeline
    redis.zAdd(&#96;tl:\${f}&#96;, { score: id, value: String(id) }),
    redis.zRemRangeByRank(&#96;tl:\${f}&#96;, 0, -KEEP - 1),
  ]));
  return { id, commands: followers.length * 2 };
}
// ĐỌC kiểu "kéo" (pull): đọc bài mới nhất của TỪNG người mình theo dõi rồi trộn
async function pullFeed(following, limit = 20) {
  const lists = await Promise.all(following.map((a) =&gt; redis.zRangeWithScores(&#96;posts:\${a}&#96;, '+inf', '-inf', { BY: 'SCORE', REV: true, LIMIT: { offset: 0, count: limit } })));
  return lists.flat().sort((x, y) =&gt; y.score - x.score).slice(0, limit);
}</code></pre>
<p>Measured on Redis 8.2 on the same laptop (<code>interview/feed/fanout.mjs</code>, database 3, flushed before and after):</p>
<pre><code class="language-bash">node interview/feed/fanout.mjs write</code></pre>
<div class="out">fan-out khi GHI: một bài đăng ⇒ ghi vào timeline của mọi người theo dõi
người đăng                 theo dõi   lệnh Redis   thời gian   bộ nhớ Redis
bạn sinh viên                  150          300      13.9 ms   +0 MB
CLB lớn                     10,000       20,000      64.8 ms   +0.8 MB
trang FPTU chính thức      100,000      200,000     542.8 ms   +7.1 MB
đọc feed (1 ZRANGE, 20 bài): 0.178 ms/lần (trung bình 1.000 lần)</div>
<pre><code class="language-bash">node interview/feed/fanout.mjs read</code></pre>
<div class="out">fan-out khi ĐỌC: bài chỉ ghi MỘT lần; người đọc trộn bài của những người mình theo dõi
ghi một bài: 1 lệnh ZADD, bất kể bao nhiêu người theo dõi
người đọc theo dõi   lệnh Redis/lần đọc   thời gian/lần đọc
                10                   10           0.37 ms
               150                  150           1.94 ms
             1,000                1,000          16.72 ms</div>
<p>Read the two tables against each other. With push, a normal student's post is 300 commands and 14 ms, and every feed read is a single <code>ZRANGE</code> under 0.2 ms. But the official page posting once is 200,000 commands, half a second of Redis work (465–543 ms over two runs) and 7.1 MB of new timeline entries — every time it posts. With pull, posting is always one command, but every read of the feed pays for every account followed: 150 follows cost ~2 ms, 1,000 follows 7.7–16.7 ms per read (two runs on a busy machine), and reads happen 100 times more often than posts.</p>
<div class="lz-map">
  <div class="lz-stage">
    <div class="lz-node"><span class="lz-badge">W</span><span class="lz-nbody"><span class="lz-ntitle">Push (fan-out on write)</span><span class="lz-nsub">read = 1 command; a post costs one write per follower — 200,000 commands for the big page</span></span></div>
    <div class="lz-node"><span class="lz-badge">R</span><span class="lz-nbody"><span class="lz-ntitle">Pull (fan-out on read)</span><span class="lz-nsub">post = 1 command; every read costs one command per followed account</span></span></div>
  </div>
  <div class="lz-stage">
    <div class="lz-node"><span class="lz-badge">H</span><span class="lz-nbody"><span class="lz-ntitle">Hybrid</span><span class="lz-nsub">push for normal accounts; accounts above a threshold (say 10,000 followers) are pulled and merged at read time</span></span></div>
  </div>
</div>
<pre><code class="language-bash">node interview/feed/fanout.mjs hybrid</code></pre>
<div class="out">lai: người thường ĐẨY lúc ghi; tài khoản &gt; 10.000 người theo dõi được KÉO lúc đọc
đọc feed = 1 timeline + 3 tài khoản lớn = 4 lệnh, 0.677 ms/lần; trang đầu có 20 bài
trang FPTU (100.000 người theo dõi) đăng bài: 1 lệnh, 1.33 ms</div>
<p>The hybrid takes the best of each: the reader's timeline already holds the friends' posts (pushed), and the three big accounts are read and merged — four commands, well under a millisecond (0.16–0.68 ms over two runs). The official page posts with one command. The cost is complexity: two code paths and a threshold someone has to choose. In an interview, name the threshold as a number and say how you would move it: “accounts above 10,000 followers are pulled; we measure read latency and lower it if reads slow down”.</p>
<a class="link-card" href="https://redis.io/docs/latest/commands/zrange/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: Redis docs — ZRANGE (read 1 Nov 2026)</span><span class="lc-sub">BYSCORE + REV + LIMIT read a page by score from high to low; “(” makes a bound exclusive — exactly the cursor used here. Complexity O(log(N)+M); a large LIMIT offset “can add up to O(N)”, one more reason not to page by offset.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>Pages that move while you read them</h3>
<p>A feed changes while the user scrolls. Load page 1, let one new post arrive, load page 2:</p>
<pre><code class="language-bash">node interview/feed/fanout.mjs page</code></pre>
<div class="out">phân trang feed khi có bài mới chen vào giữa hai lần tải
trang 1:            1000030 1000029 1000028 1000027 1000026 1000025 1000024 1000023 1000022 1000021
trang 2 theo offset: 1000021 1000020 1000019 1000018 1000017 1000016 1000015 1000014 1000013 1000012   ⇒ lặp lại 1 bài: 1000021
trang 2 theo cursor: 1000020 1000019 1000018 1000017 1000016 1000015 1000014 1000013 1000012 1000011   ⇒ lặp lại 0 bài (cursor = 1000021)</div>
<p>With <code>offset=10</code> everything shifted down by one and post 1000021 appeared twice — on a phone that is the “why do I see this again?” bug. The cursor says “strictly older than 1000021” (<code>(1000021</code> in Redis syntax) and is immune to new posts. It is the same lesson as Chapter 3, now on a sorted set. The score must be unique, or ties need the id as a tie-breaker (3.2); here the post id is the score.</p>

<h3>The follow-up questions</h3>
<table>
<tr><td>🎤</td><td>A student unfollows a club. Their timeline still has 300 of its posts.</td></tr>
<tr><td>🧑‍💻</td><td>Two options: remove them from the timeline in the background, or filter at read time against the follow list. I'd filter at read time first — it is correct immediately — and clean up lazily; the same filter handles blocking.</td></tr>
<tr><td>🎤</td><td>An author deletes a post that was pushed to 10,000 timelines.</td></tr>
<tr><td>🧑‍💻</td><td>The timelines hold only ids. Reading the page hydrates ids into posts; a deleted post is a missing or tombstoned row, so it is dropped, and the page may return 19 items instead of 20 — the contract says <code>limit</code> is a maximum. No need to touch 10,000 timelines synchronously.</td></tr>
<tr><td>🎤</td><td>We want “3 new posts” to appear live at the top.</td></tr>
<tr><td>🧑‍💻</td><td>Server-Sent Events: in 10.4 polling every 2 s was 1.1 s late on average and made 1,500 idle requests per 100 clients in 30 s; SSE delivered in ~1 ms with 100 connections. The event only says “new posts exist, newest id X”; the app then calls <code>GET /v1/feed</code> without a cursor.</td></tr>
</table>

<h3>Weak answers and strong answers</h3>
<table>
<tr><th>Topic</th><th>Weak</th><th>Strong</th></tr>
<tr><td>Strategy</td><td>“Use fan-out on write, it's what Twitter does.”</td><td>“Push is 1 command per read but 200,000 per post for the big page; pull is the reverse; hybrid with a 10,000-follower threshold.”</td></tr>
<tr><td>Pagination</td><td><code>?page=2</code></td><td>Opaque cursor “older than id X”; measured: offset repeated a post when one arrived.</td></tr>
<tr><td>Deletes, unfollows</td><td>“Delete from all timelines.”</td><td>Timelines hold ids; filter at read time, clean up in the background.</td></tr>
<tr><td>Live updates</td><td>“WebSocket.”</td><td>SSE for one-way “new posts” (10.4 numbers), then a normal GET.</td></tr>
</table>

<h3>In interviews and at work</h3>
<ul>
  <li><strong>“Push or pull?”</strong> Answer with the ratio of reads to posts and the size of the largest account, then the hybrid with a numeric threshold.</li>
  <li><strong>“Why is your cursor opaque?”</strong> So you can change what it encodes — time, id, score — without breaking clients (Chapter 4).</li>
</ul>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok"><ol>
  <li>Change <code>KEEP</code> from 500 to 100 and rerun <code>fanout.mjs write</code>. What happens to memory, and what does a user who scrolls past 100 posts see?</li>
  <li>In <code>hybrid</code>, raise the number of big accounts from 3 to 30. When does the read become slower than pure push?</li>
  <li>Write <code>GET /v1/feed</code> in Express over these functions, returning <code>{ data, page: { next } }</code> with an opaque base64url cursor.</li>
</ol>
<p><strong>Done when:</strong> your endpoint never repeats a post across pages while new posts arrive, and you can state the hybrid threshold with a measured reason.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Fan-out on write (push)</span><span class="v">Copy each new post into every follower's timeline when it is written.</span></div>
  <div class="kv"><span class="k">Fan-out on read (pull)</span><span class="v">Store each post once; build the feed by merging at read time.</span></div>
  <div class="kv"><span class="k">Hybrid fan-out</span><span class="v">Push for normal accounts, pull for very large ones.</span></div>
  <div class="kv"><span class="k">Timeline</span><span class="v">A per-user list of post ids, newest first (a Redis sorted set here).</span></div>
  <div class="kv"><span class="k">Sorted set</span><span class="v">A Redis set ordered by a numeric score.</span></div>
  <div class="kv"><span class="k">Hydration</span><span class="v">Turning a page of ids into full posts, dropping deleted ones.</span></div>
  <div class="kv"><span class="k">Opaque cursor</span><span class="v">A page token the client passes back without understanding it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Clarify follow model, ordering, typical and largest follower counts, live updates.</li>
  <li>Push: 1 command per read; 200,000 commands, ~0.5 s and 7.1 MB per post of a 100,000-follower page.</li>
  <li>Pull: 1 command per post; 1,000 follows cost 7.7–16.7 ms on every read.</li>
  <li>Hybrid: 4 commands per read (0.16–0.68 ms), the big page posts with 1 command; state the threshold as a number.</li>
  <li>Offset repeated a post when a new one arrived; a cursor “older than X” did not. Keep the cursor opaque.</li>
</ul>
<a class="link-card" href="/courses/redis/learn?lessonSlug=rd-4-4-zset-thuc-te" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Go deeper: Redis course — 4.4 Sorted sets in practice</span><span class="lc-sub">The data structure behind every timeline here: scores, ranges by score, trimming. This lesson decides the API and the fan-out; that one shows the commands in depth.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>
<a class="link-card" href="/courses/system-design/learn?lessonSlug=sysd-6-1-mo-hinh-feed" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Go deeper: System Design in Practice — 6.1 Data model and the fan-out decision</span><span class="lc-sub">The interview version ends here. That course (being written) adds ranking, inactive users, storage over years and notifications.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.4</span>
<h2>Phỏng vấn: thiết kế API cho news feed</h2>
<p class="lead">“Thiết kế bảng tin (news feed) của một mạng xã hội” là đề kinh điển mà một quyết định về <em>lúc nào</em> làm việc — lúc ghi hay lúc đọc — kéo theo mọi thứ khác. API thì nhỏ; đánh đổi phía sau thì không, và đó là chỗ người phỏng vấn ép bạn. Bài này trả lời đề đó cho một app trong trường có các CLB và một trang chính thức rất đông người theo dõi, đo cả hai chiến lược trên Redis 8.2 với 100.000 người theo dõi, thấy vì sao kiểu lai ra đời, và xem phân trang offset lặp bài còn cursor thì không.</p>

<h3>Năm phút đầu</h3>
<table>
<tr><td>🎤</td><td>Thiết kế bảng tin trang chủ của một app trong trường: sinh viên theo dõi bạn bè và trang CLB, thấy bài họ đăng.</td></tr>
<tr><td>🧑‍💻</td><td>Theo dõi một chiều như Twitter, hay kết bạn hai chiều? Mới nhất lên đầu hay có xếp hạng? Một sinh viên thường theo dõi bao nhiêu tài khoản, và trang lớn nhất bao nhiêu người theo dõi? Có cần “bài mới” hiện ngay không?</td></tr>
<tr><td>🎤</td><td>Theo dõi một chiều. Trước mắt mới nhất lên đầu. Một sinh viên theo dõi tầm 150 tài khoản; trang chính thức của trường có 100.000 người theo dõi. Hiện bài mới ngay thì tốt.</td></tr>
<tr><td>🧑‍💻</td><td>Vậy bảng tin được đọc nhiều hơn hẳn số bài được đăng, và một tài khoản lớn gấp khoảng 670 lần tài khoản thường (100.000 ÷ 150) — chính điều đó quyết định thiết kế. Ngoài phạm vi: xếp hạng, bình luận, tải ảnh. Tuyệt đối không được: hiện bài của người mình đã chặn, hay bài đã xoá vẫn còn hiện.</td></tr>
</table>

<h3>Hợp đồng</h3>
<pre><code class="language-plaintext">POST   /v1/posts                 Idempotency-Key   201 + Location      422 · 429
DELETE /v1/posts/{id}                              204                 404 (also: not mine)
GET    /v1/feed?limit=20&amp;cursor=…                  200 {data, page.next}   400 bad cursor
GET    /v1/users/{id}/posts?cursor=…               200 {data, page.next}
PUT    /v1/me/following/{userId}                   204 (idempotent)    404
DELETE /v1/me/following/{userId}                   204</code></pre>
<p>Hai chi tiết đáng nói ra. Theo dõi là <code>PUT</code> lên tài nguyên con của <code>me</code>, nên bấm “Theo dõi” hai lần cũng vô hại (1.2). Và cursor của feed là <strong>mờ</strong> (opaque) (3.2): client không bao giờ biết nó là thời điểm, id bài hay điểm xếp hạng — nhờ vậy năm sau thêm xếp hạng mà không cần <code>/v2</code>.</p>

<h3>Hai chiến lược: bỏ thư vào từng hộp, hay đi xem từng bảng tin</h3>
<p>Hãy hình dung một ký túc xá. <strong>Fan-out khi ghi</strong> (push — đẩy) là anh đưa thư bỏ một bản sao mỗi lá thư vào hộp thư của từng người đăng ký: đọc thì dễ — mở hộp của mình — nhưng một lá thư gửi 100.000 người là 100.000 lần bỏ thư. <strong>Fan-out khi đọc</strong> (pull — kéo) là mỗi tác giả ghim bài lên bảng của chính mình, còn người đọc đi qua mọi bảng mình theo dõi: đăng bài là một thao tác, đọc thì tốn một điểm dừng cho mỗi bảng. Mã của cả hai trên sorted set của Redis (tập hợp sắp theo điểm số — ở đây là id bài tăng dần, nên mới nhất lên đầu):</p>
<pre><code class="language-javascript">// interview/feed/fanout.mjs (trích)
// GHI kiểu "đẩy" (push): một bài ⇒ chép id vào timeline của TỪNG người theo dõi
async function pushPost(followers) {
  const id = ++postId;
  await Promise.all(followers.flatMap((f) =&gt; [                     // node-redis tự gom các lệnh cùng nhịp thành pipeline
    redis.zAdd(&#96;tl:\${f}&#96;, { score: id, value: String(id) }),
    redis.zRemRangeByRank(&#96;tl:\${f}&#96;, 0, -KEEP - 1),
  ]));
  return { id, commands: followers.length * 2 };
}
// ĐỌC kiểu "kéo" (pull): đọc bài mới nhất của TỪNG người mình theo dõi rồi trộn
async function pullFeed(following, limit = 20) {
  const lists = await Promise.all(following.map((a) =&gt; redis.zRangeWithScores(&#96;posts:\${a}&#96;, '+inf', '-inf', { BY: 'SCORE', REV: true, LIMIT: { offset: 0, count: limit } })));
  return lists.flat().sort((x, y) =&gt; y.score - x.score).slice(0, limit);
}</code></pre>
<p>Đo trên Redis 8.2 cùng laptop (<code>interview/feed/fanout.mjs</code>, database 3, xoá sạch trước và sau):</p>
<pre><code class="language-bash">node interview/feed/fanout.mjs write</code></pre>
<div class="out">fan-out khi GHI: một bài đăng ⇒ ghi vào timeline của mọi người theo dõi
người đăng                 theo dõi   lệnh Redis   thời gian   bộ nhớ Redis
bạn sinh viên                  150          300      13.9 ms   +0 MB
CLB lớn                     10,000       20,000      64.8 ms   +0.8 MB
trang FPTU chính thức      100,000      200,000     542.8 ms   +7.1 MB
đọc feed (1 ZRANGE, 20 bài): 0.178 ms/lần (trung bình 1.000 lần)</div>
<pre><code class="language-bash">node interview/feed/fanout.mjs read</code></pre>
<div class="out">fan-out khi ĐỌC: bài chỉ ghi MỘT lần; người đọc trộn bài của những người mình theo dõi
ghi một bài: 1 lệnh ZADD, bất kể bao nhiêu người theo dõi
người đọc theo dõi   lệnh Redis/lần đọc   thời gian/lần đọc
                10                   10           0.37 ms
               150                  150           1.94 ms
             1,000                1,000          16.72 ms</div>
<p>Đặt hai bảng cạnh nhau. Với push, bài của một sinh viên thường là 300 lệnh và 14 ms, còn mỗi lần đọc feed chỉ một lệnh <code>ZRANGE</code> dưới 0,2 ms. Nhưng trang chính thức đăng một bài là 200.000 lệnh, nửa giây việc của Redis (465–543 ms qua hai lần đo) và 7,1 MB mục timeline mới — mỗi lần đăng. Với pull, đăng bài luôn là một lệnh, nhưng mỗi lần đọc feed trả giá cho từng tài khoản đang theo dõi: 150 tài khoản tốn ~2 ms, 1.000 tài khoản tốn 7,7–16,7 ms mỗi lần đọc (hai lần đo trên máy đang bận), mà số lần đọc gấp trăm lần số bài đăng.</p>
<div class="lz-map">
  <div class="lz-stage">
    <div class="lz-node"><span class="lz-badge">W</span><span class="lz-nbody"><span class="lz-ntitle">Push (fan-out khi ghi)</span><span class="lz-nsub">đọc = 1 lệnh; mỗi bài tốn một lần ghi cho từng người theo dõi — 200.000 lệnh với trang lớn</span></span></div>
    <div class="lz-node"><span class="lz-badge">R</span><span class="lz-nbody"><span class="lz-ntitle">Pull (fan-out khi đọc)</span><span class="lz-nsub">đăng = 1 lệnh; mỗi lần đọc tốn một lệnh cho từng tài khoản đang theo dõi</span></span></div>
  </div>
  <div class="lz-stage">
    <div class="lz-node"><span class="lz-badge">H</span><span class="lz-nbody"><span class="lz-ntitle">Lai (hybrid)</span><span class="lz-nsub">push cho tài khoản thường; tài khoản vượt ngưỡng (vd 10.000 người theo dõi) được kéo và trộn lúc đọc</span></span></div>
  </div>
</div>
<pre><code class="language-bash">node interview/feed/fanout.mjs hybrid</code></pre>
<div class="out">lai: người thường ĐẨY lúc ghi; tài khoản &gt; 10.000 người theo dõi được KÉO lúc đọc
đọc feed = 1 timeline + 3 tài khoản lớn = 4 lệnh, 0.677 ms/lần; trang đầu có 20 bài
trang FPTU (100.000 người theo dõi) đăng bài: 1 lệnh, 1.33 ms</div>
<p>Kiểu lai lấy phần tốt của cả hai: timeline của người đọc đã có sẵn bài của bạn bè (được đẩy), còn ba tài khoản lớn được đọc rồi trộn — bốn lệnh, dưới một mili-giây (0,16–0,68 ms qua hai lần đo). Trang chính thức đăng bài bằng một lệnh. Cái giá là độ phức tạp: hai nhánh mã và một ngưỡng phải có người chọn. Khi phỏng vấn, hãy nói ngưỡng thành con số và cách dời nó: “tài khoản trên 10.000 người theo dõi được kéo; em đo độ trễ đọc và hạ ngưỡng nếu đọc chậm đi”.</p>
<a class="link-card" href="https://redis.io/docs/latest/commands/zrange/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: Redis docs — ZRANGE (đọc ngày 1/11/2026)</span><span class="lc-sub">BYSCORE + REV + LIMIT đọc một trang theo điểm từ cao xuống thấp; dấu “(” làm cận thành mở — đúng cái cursor dùng ở đây. Độ phức tạp O(log(N)+M); offset lớn trong LIMIT “có thể cộng thành O(N)”, thêm một lý do không phân trang bằng offset.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Trang dữ liệu trôi trong lúc bạn đọc</h3>
<p>Bảng tin thay đổi trong lúc người dùng cuộn. Tải trang 1, cho một bài mới tới, tải trang 2:</p>
<pre><code class="language-bash">node interview/feed/fanout.mjs page</code></pre>
<div class="out">phân trang feed khi có bài mới chen vào giữa hai lần tải
trang 1:            1000030 1000029 1000028 1000027 1000026 1000025 1000024 1000023 1000022 1000021
trang 2 theo offset: 1000021 1000020 1000019 1000018 1000017 1000016 1000015 1000014 1000013 1000012   ⇒ lặp lại 1 bài: 1000021
trang 2 theo cursor: 1000020 1000019 1000018 1000017 1000016 1000015 1000014 1000013 1000012 1000011   ⇒ lặp lại 0 bài (cursor = 1000021)</div>
<p>Với <code>offset=10</code> mọi thứ bị đẩy xuống một bậc và bài 1000021 xuất hiện hai lần — trên điện thoại đó là lỗi “sao lại thấy bài này nữa?”. Cursor nói “cũ hơn hẳn 1000021” (<code>(1000021</code> theo cú pháp Redis) và miễn nhiễm với bài mới. Đây là đúng bài học Chương 3, giờ trên sorted set. Điểm số phải duy nhất, hoặc khi bằng nhau thì cần id làm khoá phụ (3.2); ở đây id bài chính là điểm số.</p>

<h3>Các câu hỏi thêm</h3>
<table>
<tr><td>🎤</td><td>Một sinh viên bỏ theo dõi một CLB. Timeline của bạn ấy vẫn còn 300 bài của CLB đó.</td></tr>
<tr><td>🧑‍💻</td><td>Hai cách: xoá chúng khỏi timeline ở nền, hoặc lọc lúc đọc theo danh sách đang theo dõi. Em lọc lúc đọc trước — đúng ngay lập tức — rồi dọn dần; cùng bộ lọc đó xử lý luôn việc chặn.</td></tr>
<tr><td>🎤</td><td>Tác giả xoá một bài đã được đẩy vào 10.000 timeline.</td></tr>
<tr><td>🧑‍💻</td><td>Timeline chỉ giữ id. Lúc đọc trang, id được “bơm” thành bài đầy đủ (hydration); bài đã xoá là dòng không còn hoặc đã đánh dấu xoá (tombstone), nên bị bỏ, và trang có thể trả 19 mục thay vì 20 — hợp đồng nói <code>limit</code> là tối đa. Không cần đụng 10.000 timeline một cách đồng bộ.</td></tr>
<tr><td>🎤</td><td>Mình muốn dòng “3 bài mới” hiện ngay trên đầu.</td></tr>
<tr><td>🧑‍💻</td><td>Server-Sent Events: ở bài 10.4 polling mỗi 2 s trễ trung bình 1,1 s và tạo 1.500 request rỗng cho 100 client trong 30 s; SSE giao trong ~1 ms với 100 kết nối. Sự kiện chỉ báo “có bài mới, id mới nhất X”; app gọi lại <code>GET /v1/feed</code> không kèm cursor.</td></tr>
</table>

<h3>Câu trả lời yếu và câu trả lời mạnh</h3>
<table>
<tr><th>Chủ đề</th><th>Yếu</th><th>Mạnh</th></tr>
<tr><td>Chiến lược</td><td>“Fan-out khi ghi, Twitter làm thế.”</td><td>“Push: 1 lệnh mỗi lần đọc nhưng 200.000 lệnh mỗi bài của trang lớn; pull ngược lại; lai với ngưỡng 10.000 người theo dõi.”</td></tr>
<tr><td>Phân trang</td><td><code>?page=2</code></td><td>Cursor mờ “cũ hơn id X”; đo được: offset lặp một bài khi có bài mới.</td></tr>
<tr><td>Xoá, bỏ theo dõi</td><td>“Xoá khỏi mọi timeline.”</td><td>Timeline chỉ giữ id; lọc lúc đọc, dọn ở nền.</td></tr>
<tr><td>Bài mới tức thì</td><td>“WebSocket.”</td><td>SSE cho tin một chiều “có bài mới” (số đo 10.4), rồi một GET bình thường.</td></tr>
</table>

<h3>Khi phỏng vấn và khi đi làm</h3>
<ul>
  <li><strong>“Push hay pull?”</strong> Trả lời bằng tỉ lệ đọc/đăng và cỡ tài khoản lớn nhất, rồi đến kiểu lai với ngưỡng là một con số.</li>
  <li><strong>“Sao cursor lại mờ?”</strong> Để đổi được thứ nó mã hoá — thời gian, id, điểm — mà không làm vỡ client (Chương 4).</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
  <li>Đổi <code>KEEP</code> từ 500 xuống 100 rồi chạy lại <code>fanout.mjs write</code>. Bộ nhớ thay đổi thế nào, và người cuộn quá 100 bài thấy gì?</li>
  <li>Trong <code>hybrid</code>, tăng số tài khoản lớn từ 3 lên 30. Từ lúc nào đọc chậm hơn push thuần?</li>
  <li>Viết <code>GET /v1/feed</code> bằng Express trên các hàm này, trả <code>{ data, page: { next } }</code> với cursor base64url mờ.</li>
</ol>
<p><strong>Đạt khi:</strong> endpoint của bạn không bao giờ lặp bài giữa các trang khi có bài mới tới, và bạn nói được ngưỡng của kiểu lai kèm lý do có số đo.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Fan-out on write (đẩy khi ghi)</span><span class="v">Chép bài mới vào timeline của từng người theo dõi ngay lúc đăng.</span></div>
  <div class="kv"><span class="k">Fan-out on read (kéo khi đọc)</span><span class="v">Mỗi bài lưu một lần; feed được dựng bằng cách trộn lúc đọc.</span></div>
  <div class="kv"><span class="k">Hybrid fan-out (kiểu lai)</span><span class="v">Đẩy cho tài khoản thường, kéo cho tài khoản rất lớn.</span></div>
  <div class="kv"><span class="k">Timeline (dòng thời gian)</span><span class="v">Danh sách id bài của một người, mới nhất trước (ở đây là sorted set của Redis).</span></div>
  <div class="kv"><span class="k">Sorted set (tập có thứ tự)</span><span class="v">Tập hợp trong Redis sắp theo một điểm số.</span></div>
  <div class="kv"><span class="k">Hydration (bơm dữ liệu)</span><span class="v">Biến một trang id thành bài đầy đủ, bỏ bài đã xoá.</span></div>
  <div class="kv"><span class="k">Opaque cursor (cursor mờ)</span><span class="v">Mã trang mà client chỉ gửi lại chứ không hiểu nội dung.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Làm rõ kiểu theo dõi, thứ tự, số người theo dõi thường gặp và lớn nhất, nhu cầu cập nhật tức thì.</li>
  <li>Push: 1 lệnh mỗi lần đọc; 200.000 lệnh, ~0,5 s và 7,1 MB cho mỗi bài của trang 100.000 người theo dõi.</li>
  <li>Pull: 1 lệnh mỗi bài; theo dõi 1.000 tài khoản tốn 7,7–16,7 ms ở mỗi lần đọc.</li>
  <li>Lai: 4 lệnh mỗi lần đọc (0,16–0,68 ms), trang lớn đăng bằng 1 lệnh; nói ngưỡng thành con số.</li>
  <li>Offset lặp một bài khi có bài mới; cursor “cũ hơn X” thì không. Giữ cursor mờ.</li>
</ul>
<a class="link-card" href="/courses/redis/learn?lessonSlug=rd-4-4-zset-thuc-te" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Học sâu hơn: khoá Redis — 4.4 Sorted set trong thực tế</span><span class="lc-sub">Cấu trúc dữ liệu phía sau mọi timeline ở đây: điểm số, đọc theo khoảng điểm, cắt bớt. Bài này quyết định API và cách toả bài; bài kia đi sâu vào lệnh.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<a class="link-card" href="/courses/system-design/learn?lessonSlug=sysd-6-1-mo-hinh-feed" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Học sâu hơn: System Design in Practice — 6.1 Mô hình dữ liệu và quyết định fan-out</span><span class="lc-sub">Bản phỏng vấn dừng ở đây. Khoá đó (đang soạn) thêm xếp hạng, người dùng lâu không vào, lưu trữ nhiều năm và hệ thông báo.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 11.5 (bài MỚI) ─────────────────────────── */
    {
      title: '11.5 — Interview: design the API of a chat|||11.5 — Phỏng vấn: thiết kế API cho chat',
      slug: 'api-11-3-chat',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Gửi tin qua REST hay WebSocket; mạng di động rớt phản hồi: không clientMessageId ⇒ 66 tin trùng trên 200, có ⇒ 0; seq của server thay giờ máy client (200/200 tin sai chỗ khi đồng hồ điện thoại chậm 2 phút); đồng bộ nhiều thiết bị bằng con trỏ seq, đã đọc; dùng số đo SSE/WebSocket của 10.4.',
      content: `${G115}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.5</span>
<h2>Interview: design the API of a chat</h2>
<p class="lead">Chat looks like “POST a message, push it to the others”. The interview is about what that sentence hides: a phone on a bus that loses the response and sends again, two devices whose clocks disagree, a laptop that was closed for a week, and a group of 500 club members. In this lesson you answer the question with a contract that survives those cases, and you measure the two that cause the most bugs: duplicate messages on a flaky network, and ordering by the client's clock.</p>

<h3>The first five minutes</h3>
<table>
<tr><td>🎤</td><td>Design the chat for our campus app — one-to-one and club groups.</td></tr>
<tr><td>🧑‍💻</td><td>How big can a group be? Do we need history on a new device, “seen” status, typing indicators? Do users have several devices at once? Text only, or files too?</td></tr>
<tr><td>🎤</td><td>Groups up to 500. Full history, yes. “Seen” yes, typing is nice to have. Phone and laptop at the same time is normal. Text and images; images later.</td></tr>
<tr><td>🧑‍💻</td><td>Must never happen: a message appearing twice, messages in a different order on two devices, a message lost after it showed as sent. Out of scope: images, end-to-end encryption, search. Volume is modest for one campus; the hard part is correctness on bad networks, not throughput.</td></tr>
</table>

<h3>The contract: send over HTTP, receive over a socket</h3>
<pre><code class="language-plaintext">POST /v1/conversations/{cid}/messages   {clientMessageId, text}   201 {id, seq, …} · 200 replay · 403 · 422 · 429
GET  /v1/conversations/{cid}/messages?after={seq}&amp;limit=50         200 {data, page.next}   (sync, history)
GET  /v1/conversations?cursor=…          each with lastSeq, unread  200
PUT  /v1/conversations/{cid}/read-cursor {seq}                     204 (only moves forward)
GET  /v2/ws?ticket=…                     push: {type:"message", cid, seq} · {type:"read", …}</code></pre>
<p>Sending through a normal POST keeps everything Chapters 2–6 built: status codes, validation, rate limits, authorization per conversation, and a request the client can safely retry. Receiving needs a push channel; 10.4 measured it: WebSocket and SSE delivered in 0–1 ms where polling every 2 s was 1.1 s late, and browsers connect with a one-time 30 s ticket because they cannot send an <code>Authorization</code> header there. Sending over the socket is also fine — then each message carries the same <code>clientMessageId</code> and the server answers with an acknowledgement; what matters is the id, not the transport.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">phone</span><span class="lz-d">creates clientMessageId (UUID), shows the message as “sending”</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">POST</span><span class="lz-d">server: seen this id in this conversation? replay. Else seq = last + 1, store</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">event</span><span class="lz-d">stored in the same transaction as an outbox row (10.3), published to a stream</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">push</span><span class="lz-d">every connected device of every member gets {cid, seq}</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">devices</span><span class="lz-d">insert by seq, ignore a seq they already have, fetch gaps with ?after=</span></div>
</div>

<h3>Measured: the phone that sends twice</h3>
<p>A message is saved, the 201 is on its way, the bus enters a tunnel. The phone sees a timeout and does the only sensible thing: it sends again. <code>interview/chat/server.mjs</code> simulates that with <code>DROP_EVERY=4</code> (every fourth request is stored, then the connection is cut without an answer); <code>send.mjs</code> sends 200 messages from two devices, retrying up to five times with the same body:</p>
<pre><code class="language-javascript">// interview/chat/server.mjs (trích)
app.post('/v1/conversations/:cid/messages', (req, res) =&gt; {
  const c = conv(req.params.cid);
  const { clientMessageId, text, sentAt, device } = req.body ?? {};
  if (typeof text !== 'string' || !text.trim() || text.length &gt; 4000) return res.status(422).json({ code: 'INVALID_TEXT' });
  if (DEDUPE) {
    if (typeof clientMessageId !== 'string') return res.status(400).json({ code: 'CLIENT_MESSAGE_ID_REQUIRED' });
    const old = c.byClientId.get(clientMessageId);
    if (old) return res.status(200).set('Idempotent-Replayed', 'true').json(old);   // gửi lại ⇒ trả đúng tin cũ
  }
  const m = { id: &#96;msg_\${req.params.cid}_\${c.seq + 1}&#96;, seq: ++c.seq, clientMessageId, text, sentAt, device, receivedAt: new Date().toISOString() };
  c.messages.push(m);
  if (DEDUPE) c.byClientId.set(clientMessageId, m);
  if (DROP_EVERY &amp;&amp; ++n % DROP_EVERY === 0) return req.socket.destroy();   // đã LƯU, nhưng điện thoại không nhận được 201
  res.status(201).json(m);
});</code></pre>
<p>Two servers, each in its own terminal: the same flaky network (<code>DROP_EVERY=4</code>), without and with the dedupe:</p>
<pre><code class="language-bash">PORT=4123 DEDUPE=0 DROP_EVERY=4 node interview/chat/server.mjs
PORT=4124 DEDUPE=1 DROP_EVERY=4 node interview/chat/server.mjs</code></pre>
<pre><code class="language-bash">node interview/chat/send.mjs http://localhost:4123</code></pre>
<div class="out">gửi 200 tin, 266 lần gọi (66 lần không nhận được trả lời ⇒ gửi lại)
server lưu 266 tin, 200 nội dung khác nhau ⇒ 66 tin trùng</div>
<pre><code class="language-bash">node interview/chat/send.mjs http://localhost:4124</code></pre>
<div class="out">gửi 200 tin, 250 lần gọi (50 lần không nhận được trả lời ⇒ gửi lại)
server lưu 200 tin, 200 nội dung khác nhau ⇒ 0 tin trùng
sắp theo seq của server:        tin 1, 2, 3, 4, 5, 6, 7, 8, …  ⇒ 0/200 tin sai chỗ
sắp theo sentAt của máy client: tin 2, 4, 6, 8, 10, 12, 14, 16, …  ⇒ 200/200 tin sai chỗ</div>
<p>Without deduplication, 66 of 200 messages appeared twice in the conversation — a third of them, because a retried request can itself be the fourth one that gets cut. With the server remembering <code>(conversation, clientMessageId)</code> and replaying the stored message, the same network produced 200 messages and 0 duplicates; the retries came back as <code>200</code> with <code>Idempotent-Replayed: true</code>. This is the Idempotency-Key of 5.1 again, moved into the body so that the same rule works over a socket, where there are no headers.</p>
<a class="link-card" href="https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: IETF draft-ietf-httpapi-idempotency-key-header-08 (read 1 Nov 2026)</span><span class="lc-sub">The Idempotency-Key request header makes non-idempotent methods like POST fault-tolerant for retries — the rule behind clientMessageId. Still an Internet-Draft of the HTTPAPI working group (version 08).</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>Measured: whose clock decides the order?</h3>
<p>Each message also carried <code>sentAt</code> from the device's clock, and the phone's clock was set two minutes slow — which happens on any phone with automatic time turned off. The last two lines of the run above sort the same 200 messages two ways. By the server's <code>seq</code> every message sits where it was sent. By the client's <code>sentAt</code>, all of the phone's messages jump ahead of the laptop's: 200 of 200 in the wrong place — every reply now appears before the question it answers. The server assigns the order, per conversation, in the same write that stores the message; the client's time is shown as a hint (“sent 09:41”) and never sorts anything. A per-conversation <code>seq</code> also gives every device a simple sync question: “what is after 1,234?”.</p>
<div class="pitfall"><p><strong>Trap — <code>seq = count + 1</code> outside a transaction.</strong> Two messages arriving together can read the same count and get the same seq. In a database, take the next seq with <code>UPDATE conversations SET last_seq = last_seq + 1 … RETURNING last_seq</code> in the same transaction as the insert, and put <code>UNIQUE (conversation_id, seq)</code> and <code>UNIQUE (conversation_id, client_message_id)</code> on the messages table. The demo is safe only because one Node process does it synchronously.</p></div>

<h3>Many devices, “seen”, and the laptop closed for a week</h3>
<p>Each device remembers the last <code>seq</code> it has per conversation. On reconnect it asks <code>?after=&lt;seq&gt;</code> page by page — the cursor of Chapter 3 with a number everyone can read. A pushed message whose seq is not exactly last + 1 means something was missed: fetch the gap instead of trusting the socket. “Seen” is a per-user read cursor, <code>PUT …/read-cursor {seq}</code>, that only moves forward (a late request from the phone with a smaller seq is ignored), and the change is pushed to the user's other devices so the unread badge clears everywhere.</p>

<h3>The follow-up questions</h3>
<table>
<tr><td>🎤</td><td>A group has 500 members. One message means 500 pushes?</td></tr>
<tr><td>🧑‍💻</td><td>Pushes go only to connected devices, through the instance holding each socket — the Redis Stream fan-out of 10.4, which reached 10 of 10 across two instances. Storage is one row per message, not per member; unread counts come from read cursors, not from copies.</td></tr>
<tr><td>🎤</td><td>A user edits or deletes a message.</td></tr>
<tr><td>🧑‍💻</td><td>The message keeps its seq; the edit is a new event with a version number, and devices keep the higher version — the same version check that kept CANCELLED in 10.6. Delete becomes a tombstone, so history and seq stay contiguous.</td></tr>
<tr><td>🎤</td><td>Typing indicators?</td></tr>
<tr><td>🧑‍💻</td><td>Ephemeral: sent over the socket only, never stored, throttled to one every few seconds per user, and dropped if the user is not connected. Losing one costs nothing.</td></tr>
</table>

<h3>Weak answers and strong answers</h3>
<table>
<tr><th>Topic</th><th>Weak</th><th>Strong</th></tr>
<tr><td>Duplicates</td><td>“TCP is reliable.”</td><td>“The response can be lost after the write; clientMessageId + replay — measured 66 duplicates of 200 without it, 0 with it.”</td></tr>
<tr><td>Order</td><td>“Sort by timestamp.”</td><td>“Server seq per conversation in the insert transaction; a phone two minutes slow put 200/200 in the wrong place by client time.”</td></tr>
<tr><td>Transport</td><td>“Everything over WebSocket.”</td><td>Send over HTTP (codes, limits, retries) or with acks over the socket; receive by WebSocket/SSE with tickets; numbers from 10.4.</td></tr>
<tr><td>Sync</td><td>“Load the last 50 messages.”</td><td><code>?after=seq</code> pages, gap detection, read cursor that only moves forward.</td></tr>
</table>

<h3>In interviews and at work</h3>
<ul>
  <li><strong>“How do you guarantee exactly-once delivery?”</strong> You don't, over a network: at-least-once delivery plus an idempotent receiver (clientMessageId on the server, seq on the devices) gives exactly-once <em>effect</em>.</li>
  <li><strong>“What order do group members see?”</strong> The server's per-conversation seq — the same on every device.</li>
</ul>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok"><ol>
  <li>Run the experiment with <code>DROP_EVERY=2</code>. How many retries, how many duplicates without deduplication?</li>
  <li>Add <code>PUT /v1/conversations/{cid}/read-cursor</code> that ignores a smaller seq, with a test sending 120 then 100.</li>
  <li>Write the messages table in SQL with the two unique constraints and the <code>UPDATE … RETURNING last_seq</code> step.</li>
</ol>
<p><strong>Done when:</strong> duplicates are 0 with deduplication at any drop rate, and the read cursor never moves backwards.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">clientMessageId</span><span class="v">An id the client creates once per message and repeats on every retry.</span></div>
  <div class="kv"><span class="k">Replay</span><span class="v">Answering a retry with the stored result instead of acting again.</span></div>
  <div class="kv"><span class="k">seq</span><span class="v">The server's per-conversation sequence number: the order everyone sees.</span></div>
  <div class="kv"><span class="k">Clock skew</span><span class="v">Two devices disagreeing about the time.</span></div>
  <div class="kv"><span class="k">Read cursor</span><span class="v">The highest seq a user has seen; only moves forward.</span></div>
  <div class="kv"><span class="k">Gap detection</span><span class="v">Noticing a missing seq and fetching it instead of trusting the push.</span></div>
  <div class="kv"><span class="k">Ephemeral event</span><span class="v">A signal (typing) that is never stored and may be lost.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Must never happen: duplicates, different order on two devices, a message lost after “sent”.</li>
  <li>Send over HTTP (or with acks), receive over WebSocket/SSE with a ticket — 10.4: ~1 ms vs 1.1 s for polling.</li>
  <li>Lost responses + retries: 66 duplicates of 200 without clientMessageId, 0 with it.</li>
  <li>Order by the server's per-conversation seq: by client time a phone 2 minutes slow put 200/200 messages out of place.</li>
  <li>Devices sync with <code>?after=seq</code> and fill gaps; “seen” is a read cursor that only moves forward.</li>
</ul>
<a class="link-card" href="/courses/system-design/learn?lessonSlug=sysd-7-2-thu-tu" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Go deeper: System Design in Practice — 7.2 Message ordering, delivery receipts and sync across devices</span><span class="lc-sub">The interview version ends here. That course (being written) goes to WebSocket gateways at scale, storing billions of messages and presence.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>
<a class="link-card" href="/courses/redis/learn?lessonSlug=rd-8-5-chon-cong-cu" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Go deeper: Redis course — 8.5 Choosing: Pub/Sub, Streams, lists or a real broker</span><span class="lc-sub">Delivering a message to an online device is a fan-out problem; that lesson compares what each tool loses when a consumer is offline.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.5</span>
<h2>Phỏng vấn: thiết kế API cho chat</h2>
<p class="lead">Chat trông như “POST một tin, đẩy tới những người còn lại”. Buổi phỏng vấn xoay quanh những gì câu đó giấu đi: chiếc điện thoại trên xe buýt mất phản hồi rồi gửi lại, hai thiết bị có đồng hồ lệch nhau, chiếc laptop gập lại cả tuần, và một nhóm CLB 500 thành viên. Bài này trả lời đề bằng một hợp đồng sống được qua những tình huống đó, và đo hai thứ gây nhiều lỗi nhất: tin bị nhân đôi khi mạng chập chờn, và sắp thứ tự theo đồng hồ của client.</p>

<h3>Năm phút đầu</h3>
<table>
<tr><td>🎤</td><td>Thiết kế chat cho app của trường — nhắn riêng và nhóm CLB.</td></tr>
<tr><td>🧑‍💻</td><td>Nhóm lớn tối đa bao nhiêu người? Có cần lịch sử khi đăng nhập thiết bị mới, trạng thái “đã xem”, dấu “đang gõ” không? Một người có dùng nhiều thiết bị cùng lúc không? Chỉ chữ hay cả file?</td></tr>
<tr><td>🎤</td><td>Nhóm tới 500 người. Có lịch sử đầy đủ. Có “đã xem”, “đang gõ” thì càng tốt. Điện thoại và laptop cùng lúc là chuyện thường. Chữ và ảnh; ảnh để sau.</td></tr>
<tr><td>🧑‍💻</td><td>Tuyệt đối không được: một tin hiện hai lần, hai thiết bị thấy thứ tự khác nhau, tin đã báo “đã gửi” rồi lại mất. Ngoài phạm vi: ảnh, mã hoá đầu-cuối, tìm kiếm. Lưu lượng của một trường là vừa phải; cái khó là đúng trên mạng tệ, không phải thông lượng.</td></tr>
</table>

<h3>Hợp đồng: gửi qua HTTP, nhận qua socket</h3>
<pre><code class="language-plaintext">POST /v1/conversations/{cid}/messages   {clientMessageId, text}   201 {id, seq, …} · 200 replay · 403 · 422 · 429
GET  /v1/conversations/{cid}/messages?after={seq}&amp;limit=50         200 {data, page.next}   (sync, history)
GET  /v1/conversations?cursor=…          each with lastSeq, unread  200
PUT  /v1/conversations/{cid}/read-cursor {seq}                     204 (only moves forward)
GET  /v2/ws?ticket=…                     push: {type:"message", cid, seq} · {type:"read", …}</code></pre>
<p>Gửi qua một POST bình thường giữ lại mọi thứ Chương 2–6 đã dựng: status code, kiểm dữ liệu, giới hạn tần suất, phân quyền theo cuộc trò chuyện, và một request client gửi lại an toàn. Nhận cần kênh đẩy; bài 10.4 đã đo: WebSocket và SSE giao trong 0–1 ms trong khi polling mỗi 2 s trễ 1,1 s, và trình duyệt nối bằng vé (ticket) dùng một lần trong 30 s vì ở đó không gửi được header <code>Authorization</code>. Gửi qua socket cũng được — khi đó mỗi tin mang đúng <code>clientMessageId</code> ấy và server trả lời bằng một xác nhận (ack); cái quan trọng là id, không phải đường truyền.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">điện thoại</span><span class="lz-d">tạo clientMessageId (UUID), hiện tin ở trạng thái “đang gửi”</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">POST</span><span class="lz-d">server: id này đã gặp trong cuộc trò chuyện? phát lại. Chưa thì seq = cuối + 1, lưu</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">sự kiện</span><span class="lz-d">ghi cùng transaction vào outbox (10.3), phát lên stream</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">đẩy</span><span class="lz-d">mọi thiết bị đang nối của mọi thành viên nhận {cid, seq}</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">thiết bị</span><span class="lz-d">chèn theo seq, bỏ seq đã có, lấy phần hở bằng ?after=</span></div>
</div>

<h3>Đo thật: điện thoại gửi hai lần</h3>
<p>Tin đã lưu, 201 đang trên đường về, xe buýt chui vào hầm. Điện thoại thấy hết thời gian chờ và làm điều hợp lý duy nhất: gửi lại. <code>interview/chat/server.mjs</code> giả lập chuyện đó bằng <code>DROP_EVERY=4</code> (cứ request thứ tư thì lưu xong rồi cắt kết nối, không trả lời); <code>send.mjs</code> gửi 200 tin từ hai thiết bị, thử lại tối đa năm lần với cùng nội dung:</p>
<pre><code class="language-javascript">// interview/chat/server.mjs (trích)
app.post('/v1/conversations/:cid/messages', (req, res) =&gt; {
  const c = conv(req.params.cid);
  const { clientMessageId, text, sentAt, device } = req.body ?? {};
  if (typeof text !== 'string' || !text.trim() || text.length &gt; 4000) return res.status(422).json({ code: 'INVALID_TEXT' });
  if (DEDUPE) {
    if (typeof clientMessageId !== 'string') return res.status(400).json({ code: 'CLIENT_MESSAGE_ID_REQUIRED' });
    const old = c.byClientId.get(clientMessageId);
    if (old) return res.status(200).set('Idempotent-Replayed', 'true').json(old);   // gửi lại ⇒ trả đúng tin cũ
  }
  const m = { id: &#96;msg_\${req.params.cid}_\${c.seq + 1}&#96;, seq: ++c.seq, clientMessageId, text, sentAt, device, receivedAt: new Date().toISOString() };
  c.messages.push(m);
  if (DEDUPE) c.byClientId.set(clientMessageId, m);
  if (DROP_EVERY &amp;&amp; ++n % DROP_EVERY === 0) return req.socket.destroy();   // đã LƯU, nhưng điện thoại không nhận được 201
  res.status(201).json(m);
});</code></pre>
<p>Hai server, mỗi cái một terminal: cùng mạng chập chờn (<code>DROP_EVERY=4</code>), không và có chống trùng:</p>
<pre><code class="language-bash">PORT=4123 DEDUPE=0 DROP_EVERY=4 node interview/chat/server.mjs
PORT=4124 DEDUPE=1 DROP_EVERY=4 node interview/chat/server.mjs</code></pre>
<pre><code class="language-bash">node interview/chat/send.mjs http://localhost:4123</code></pre>
<div class="out">gửi 200 tin, 266 lần gọi (66 lần không nhận được trả lời ⇒ gửi lại)
server lưu 266 tin, 200 nội dung khác nhau ⇒ 66 tin trùng</div>
<pre><code class="language-bash">node interview/chat/send.mjs http://localhost:4124</code></pre>
<div class="out">gửi 200 tin, 250 lần gọi (50 lần không nhận được trả lời ⇒ gửi lại)
server lưu 200 tin, 200 nội dung khác nhau ⇒ 0 tin trùng
sắp theo seq của server:        tin 1, 2, 3, 4, 5, 6, 7, 8, …  ⇒ 0/200 tin sai chỗ
sắp theo sentAt của máy client: tin 2, 4, 6, 8, 10, 12, 14, 16, …  ⇒ 200/200 tin sai chỗ</div>
<p>Không chống trùng, 66 trên 200 tin xuất hiện hai lần trong cuộc trò chuyện — một phần ba, vì chính request gửi lại cũng có thể là request thứ tư bị cắt. Khi server nhớ cặp <code>(cuộc trò chuyện, clientMessageId)</code> và phát lại tin đã lưu, cùng mạng đó cho 200 tin và 0 bản trùng; các lần gửi lại nhận <code>200</code> kèm <code>Idempotent-Replayed: true</code>. Đây lại là Idempotency-Key của bài 5.1, chuyển vào body để cùng luật chạy được qua socket, nơi không có header.</p>
<a class="link-card" href="https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: IETF draft-ietf-httpapi-idempotency-key-header-08 (đọc ngày 1/11/2026)</span><span class="lc-sub">Header Idempotency-Key giúp các phương thức không idempotent như POST chịu được lỗi khi gửi lại — luật đứng sau clientMessageId. Vẫn là Internet-Draft của nhóm HTTPAPI (phiên bản 08).</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Đo thật: đồng hồ của ai quyết định thứ tự?</h3>
<p>Mỗi tin còn mang <code>sentAt</code> lấy từ đồng hồ thiết bị, và đồng hồ điện thoại bị chậm hai phút — chuyện xảy ra với bất kỳ điện thoại nào tắt chế độ giờ tự động. Hai dòng cuối của lần chạy trên sắp cùng 200 tin theo hai cách. Theo <code>seq</code> của server, mọi tin nằm đúng chỗ đã gửi. Theo <code>sentAt</code> của client, mọi tin của điện thoại nhảy lên trước tin của laptop: 200/200 tin sai chỗ — mọi câu trả lời giờ hiện trước câu hỏi của nó. Server quyết định thứ tự, theo từng cuộc trò chuyện, trong cùng lần ghi lưu tin; giờ của client chỉ hiện làm gợi ý (“gửi lúc 09:41”) và không bao giờ dùng để sắp. Một <code>seq</code> theo cuộc trò chuyện còn cho mọi thiết bị một câu hỏi đồng bộ đơn giản: “sau số 1.234 có gì?”.</p>
<div class="pitfall"><p><strong>Bẫy — <code>seq = count + 1</code> ngoài transaction.</strong> Hai tin tới cùng lúc có thể đọc cùng số đếm và nhận cùng seq. Trong CSDL, lấy seq kế tiếp bằng <code>UPDATE conversations SET last_seq = last_seq + 1 … RETURNING last_seq</code> trong cùng transaction với lệnh chèn, và đặt <code>UNIQUE (conversation_id, seq)</code> cùng <code>UNIQUE (conversation_id, client_message_id)</code> trên bảng tin nhắn. Bản demo an toàn chỉ vì một tiến trình Node làm việc đó đồng bộ.</p></div>

<h3>Nhiều thiết bị, “đã xem”, và chiếc laptop gập cả tuần</h3>
<p>Mỗi thiết bị nhớ <code>seq</code> cuối cùng nó có cho từng cuộc trò chuyện. Khi nối lại, nó hỏi <code>?after=&lt;seq&gt;</code> từng trang — cursor của Chương 3 nhưng là con số ai cũng đọc được. Tin được đẩy tới mà seq không đúng bằng cuối + 1 nghĩa là đã lỡ gì đó: hãy lấy phần hở (gap) thay vì tin socket. “Đã xem” là con trỏ đã đọc (read cursor) theo người dùng, <code>PUT …/read-cursor {seq}</code>, chỉ đi tới (request đến muộn từ điện thoại mang seq nhỏ hơn thì bỏ qua), và thay đổi được đẩy sang các thiết bị khác của người đó để huy hiệu “chưa đọc” tắt ở mọi nơi.</p>

<h3>Các câu hỏi thêm</h3>
<table>
<tr><td>🎤</td><td>Nhóm 500 người. Một tin là 500 lần đẩy?</td></tr>
<tr><td>🧑‍💻</td><td>Chỉ đẩy tới thiết bị đang nối, qua instance đang giữ từng socket — kiểu phát tán qua Redis Stream ở bài 10.4, đạt 10/10 trên hai instance. Lưu trữ là một dòng mỗi tin, không phải mỗi thành viên; số chưa đọc tính từ con trỏ đã đọc, không từ các bản sao.</td></tr>
<tr><td>🎤</td><td>Người dùng sửa hay xoá tin.</td></tr>
<tr><td>🧑‍💻</td><td>Tin giữ nguyên seq; lần sửa là một sự kiện mới có số phiên bản, thiết bị giữ phiên bản cao hơn — đúng phép so version đã giữ CANCELLED ở bài 10.6. Xoá thành bia mộ (tombstone), để lịch sử và seq vẫn liền mạch.</td></tr>
<tr><td>🎤</td><td>Dấu “đang gõ”?</td></tr>
<tr><td>🧑‍💻</td><td>Thoáng qua: chỉ gửi qua socket, không bao giờ lưu, giới hạn vài giây một lần mỗi người, người không nối thì bỏ. Mất một cái chẳng tốn gì.</td></tr>
</table>

<h3>Câu trả lời yếu và câu trả lời mạnh</h3>
<table>
<tr><th>Chủ đề</th><th>Yếu</th><th>Mạnh</th></tr>
<tr><td>Tin trùng</td><td>“TCP đáng tin mà.”</td><td>“Phản hồi có thể mất sau khi đã ghi; clientMessageId + phát lại — đo được 66 tin trùng/200 khi không có, 0 khi có.”</td></tr>
<tr><td>Thứ tự</td><td>“Sắp theo timestamp.”</td><td>“seq của server theo cuộc trò chuyện, trong transaction chèn; điện thoại chậm 2 phút làm 200/200 tin sai chỗ nếu sắp theo giờ client.”</td></tr>
<tr><td>Đường truyền</td><td>“Mọi thứ qua WebSocket.”</td><td>Gửi qua HTTP (mã, giới hạn, gửi lại) hoặc qua socket có ack; nhận bằng WebSocket/SSE có vé; số đo của 10.4.</td></tr>
<tr><td>Đồng bộ</td><td>“Tải 50 tin cuối.”</td><td>Trang <code>?after=seq</code>, phát hiện phần hở, con trỏ đã đọc chỉ đi tới.</td></tr>
</table>

<h3>Khi phỏng vấn và khi đi làm</h3>
<ul>
  <li><strong>“Làm sao đảm bảo giao đúng một lần?”</strong> Qua mạng thì không đảm bảo được: giao ít nhất một lần cộng bên nhận idempotent (clientMessageId ở server, seq ở thiết bị) cho <em>hiệu quả</em> đúng một lần.</li>
  <li><strong>“Thành viên nhóm thấy thứ tự nào?”</strong> seq theo cuộc trò chuyện của server — giống nhau trên mọi thiết bị.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
  <li>Chạy thí nghiệm với <code>DROP_EVERY=2</code>. Bao nhiêu lần gửi lại, bao nhiêu tin trùng khi không chống trùng?</li>
  <li>Thêm <code>PUT /v1/conversations/{cid}/read-cursor</code> bỏ qua seq nhỏ hơn, kèm test gửi 120 rồi 100.</li>
  <li>Viết bảng tin nhắn bằng SQL với hai ràng buộc unique và bước <code>UPDATE … RETURNING last_seq</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> chống trùng cho 0 tin trùng ở mọi tỉ lệ rớt, và con trỏ đã đọc không bao giờ lùi.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">clientMessageId (id tin do client tạo)</span><span class="v">Id client tạo một lần cho mỗi tin và lặp lại ở mọi lần gửi lại.</span></div>
  <div class="kv"><span class="k">Replay (phát lại)</span><span class="v">Trả lời lần gửi lại bằng kết quả đã lưu thay vì làm lại.</span></div>
  <div class="kv"><span class="k">seq (số thứ tự)</span><span class="v">Số thứ tự theo cuộc trò chuyện do server cấp: thứ tự mọi người cùng thấy.</span></div>
  <div class="kv"><span class="k">Clock skew (lệch đồng hồ)</span><span class="v">Hai thiết bị không thống nhất về giờ.</span></div>
  <div class="kv"><span class="k">Read cursor (con trỏ đã đọc)</span><span class="v">seq cao nhất người dùng đã xem; chỉ đi tới.</span></div>
  <div class="kv"><span class="k">Gap detection (phát hiện phần hở)</span><span class="v">Nhận ra seq bị thiếu và lấy nó về thay vì tin vào tin đẩy.</span></div>
  <div class="kv"><span class="k">Ephemeral event (sự kiện thoáng qua)</span><span class="v">Tín hiệu (đang gõ) không bao giờ lưu và được phép mất.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Không được xảy ra: tin trùng, hai thiết bị khác thứ tự, tin mất sau khi báo “đã gửi”.</li>
  <li>Gửi qua HTTP (hoặc có ack), nhận qua WebSocket/SSE có vé — 10.4: ~1 ms so với 1,1 s của polling.</li>
  <li>Mất phản hồi + gửi lại: 66 tin trùng/200 khi không có clientMessageId, 0 khi có.</li>
  <li>Sắp theo seq của server theo cuộc trò chuyện: sắp theo giờ client, điện thoại chậm 2 phút làm 200/200 tin sai chỗ.</li>
  <li>Thiết bị đồng bộ bằng <code>?after=seq</code> và lấp phần hở; “đã xem” là con trỏ chỉ đi tới.</li>
</ul>
<a class="link-card" href="/courses/system-design/learn?lessonSlug=sysd-7-2-thu-tu" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Học sâu hơn: System Design in Practice — 7.2 Thứ tự tin nhắn, xác nhận đã nhận và đồng bộ nhiều thiết bị</span><span class="lc-sub">Bản phỏng vấn dừng ở đây. Khoá đó (đang soạn) đi tới gateway WebSocket ở quy mô lớn, lưu hàng tỉ tin nhắn và trạng thái online.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<a class="link-card" href="/courses/redis/learn?lessonSlug=rd-8-5-chon-cong-cu" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Học sâu hơn: khoá Redis — 8.5 Chọn: Pub/Sub, Stream, list hay một broker thật</span><span class="lc-sub">Đẩy tin nhắn tới thiết bị đang mở là bài toán toả; bài đó so mỗi công cụ mất gì khi bên nhận đang offline.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 11.6 ─────────────────────────── */
    {
      title: '11.6 — Interview: design the API of a booking system|||11.6 — Phỏng vấn: thiết kế API cho hệ thống đặt lịch',
      slug: 'api-11-4-dat-lich',
      type: 'LESSON',
      isFreePreview: true,
      description: 'LabFlow chính là đề này: trả lời bằng bằng chứng đã đo ở Chương 5–10. 50 người cùng bấm một khung giờ: kiểm rồi ghi ⇒ 50 lượt đặt; FOR UPDATE, SERIALIZABLE (40001) và EXCLUDE USING gist ⇒ đúng 1; giữ chỗ có hạn và bẫy chỗ giữ hết hạn vẫn chặn.',
      content: `${G116}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.6</span>
<h2>Interview: design the API of a booking system</h2>
<p class="lead">“Design a system to book meeting rooms / doctors / lab slots” is the interview question you are best prepared for, because you have built the answer for ten chapters: LabFlow. The danger is the opposite of the other problems — not knowing too little, but reciting features without proof. This lesson turns LabFlow into an interview answer backed by numbers you measured, then runs the experiment every booking interview ends with: fifty people pressing “Book” for the same slot at the same moment.</p>

<h3>The first five minutes</h3>
<table>
<tr><td>🎤</td><td>Design the API for booking computer labs by the hour at a university.</td></tr>
<tr><td>🧑‍💻</td><td>Fixed slots or any time range? Does someone approve bookings? Is there payment or a deposit? A limit per student? When is the rush — when the week's slots open? And can a student check in, so no-shows free the room?</td></tr>
<tr><td>🎤</td><td>Any range in whole hours, no approval, free — but next semester rooms with equipment need a deposit. Max three active bookings per student. Slots open at 07:00 on Monday and it is chaos.</td></tr>
<tr><td>🧑‍💻</td><td>Must never happen: two bookings for the same lab and overlapping time; a student seeing another student's booking details. The 07:00 minute is the design point — in 11.1 I estimated ~50 bookings and ~500 reads per second. The deposit means a hold that expires; I'll design for it from the start.</td></tr>
</table>

<h3>The contract — and where each line was proven</h3>
<p>This is LabFlow's real v2 surface, not a sketch:</p>
<pre><code class="language-plaintext">GET    /v2/labs                          200 public, max-age=60 + ETag      (304 before the query)
POST   /v2/bookings      Idempotency-Key 201 + Location · 409 BOOKING_CONFLICT · 422 TOO_MANY_ACTIVE_BOOKINGS · 429 · 503
GET    /v2/bookings?labId=&amp;from=&amp;to=&amp;cursor=   200 private {data, page.next}
POST   /v2/bookings/{id}/cancel          200 · 409 ALREADY_CANCELLED · 404 (not yours)
POST   /v2/bookings/{id}/check-in        200 · 409 NOT_PENDING
POST   /v2/labs/{labId}/waitlist         201 · 409 SLOT_AVAILABLE / ALREADY_WAITING
POST   /v2/exports                       202 + Location: /v2/jobs/{id}
GET    /v2/events/stream                 text/event-stream (SSE)</code></pre>
<p>In the room, every design choice comes with its evidence. Say the number and the lesson — that is the difference between “I would use idempotency keys” and “I measured what happens without them”:</p>
<table>
<tr><th>Claim in the interview</th><th>Evidence you measured</th><th>Lesson</th></tr>
<tr><td>Cursor pages, not OFFSET</td><td>page at row 900,000: OFFSET 78 ms, keyset 0.064 ms</td><td>3.1–3.2</td></tr>
<tr><td>Idempotency-Key on POST /bookings</td><td>lost response + retry ⇒ misleading 409 against your own booking; with the key one booking, 201 replayed</td><td>5.1</td></tr>
<tr><td>Rate limit per user, trust proxy set right</td><td>5 bookings / 60 s; wrong <code>trust proxy</code> let 8 of 8 spoofed requests through</td><td>5.3</td></tr>
<tr><td>Object-level checks, 404 for others</td><td>authorization matrix: 8 wrong cells ⇒ 0</td><td>6.2</td></tr>
<tr><td>Password hashing off the event loop</td><td>logins 30 ⇒ 114/s; lab list p99 463 ⇒ 8 ms during logins</td><td>8.2</td></tr>
<tr><td>Shared state before a second instance</td><td>two instances: two bk_1, 8/8 past a limit of 5, same key ⇒ two 201s</td><td>8.4</td></tr>
<tr><td>Shed load at 07:00 instead of collapsing</td><td>goodput 136 ⇒ 12/s without shedding; 123/s with 503 + Retry-After</td><td>8.5</td></tr>
<tr><td>Exports as jobs</td><td>synchronous export cut at 100 s by the proxy; 202 + job in 17 ms</td><td>10.1</td></tr>
<tr><td>Events through an outbox</td><td>Redis down 1.5 s: dual write lost 342 events, outbox 0</td><td>10.3</td></tr>
<tr><td>SSE for the lab TV</td><td>SSE ~1 ms, polling every 2 s 1.1 s late and 1,500 idle requests</td><td>10.4</td></tr>
</table>
<p>Do not recite ten rows. Use the two or three the follow-ups lead to — “have you actually seen this happen?” is a common question, and “yes, here is the number” ends it.</p>

<h3>The question every booking interview reaches</h3>
<table>
<tr><td>🎤</td><td>Two students press “Book” for lab 1, 14:00–16:00, at the same millisecond. What happens?</td></tr>
<tr><td>🧑‍💻</td><td>In today's LabFlow, nothing bad: one Node process checks and inserts with no <code>await</code> in between. With PostgreSQL and several instances, “check for overlap, then insert” is a race. Let me show it with fifty students instead of two.</td></tr>
</table>
<p><code>interview/booking/race.mjs</code> opens 50 PostgreSQL connections first, then lets 50 “handlers” book the same lab and time at once. Each handler does what a real one does between the check and the insert (5 ms of other checks — permissions, the three-booking limit):</p>
<pre><code class="language-javascript">// interview/booking/race.mjs (trích): hai trong bốn handler
const overlap = &#96;SELECT 1 FROM iv.bookings WHERE lab_id = $1 AND slot &amp;&amp; $2::tstzrange AND status IN ('HELD', 'CONFIRMED')&#96;;
const insert = &#96;INSERT INTO iv.bookings (lab_id, slot, user_id, status) VALUES ($1, $2, $3, 'CONFIRMED') RETURNING id&#96;;
  async naive(c, user) {                                           // kiểm rồi mới ghi, hai câu lệnh riêng
    await c.query('BEGIN');
    const { rowCount } = await c.query(overlap, ['lab_1', SLOT]);
    if (rowCount) { await c.query('ROLLBACK'); return 409; }
    await pause(5);                                                 // 5 ms việc khác của handler (kiểm quyền, giới hạn 3 lượt…)
    await c.query(insert, ['lab_1', SLOT, user]);
    await c.query('COMMIT'); return 201;
  },
  async constraint(c, user) {                                      // chỉ một câu INSERT; luật nằm trong CSDL
    try { await pause(5); await c.query(insert, ['lab_1', SLOT, user]); return 201; }
    catch (e) { if (e.code === '23P01') return 409; throw e; }      // exclusion_violation ⇒ 409 SLOT_TAKEN
  },</code></pre>
<p>The table stores each booking's time as a <code>tstzrange</code> (a range of timestamps, half-open <code>[14:00, 16:00)</code>); <code>&amp;&amp;</code> means “overlaps”. The fourth handler relies on this constraint instead of a SELECT:</p>
<pre><code class="language-sql">CREATE TABLE iv.bookings (id serial PRIMARY KEY, lab_id text NOT NULL, slot tstzrange NOT NULL,
  user_id text NOT NULL, status text NOT NULL, hold_expires_at timestamptz,
  CONSTRAINT no_overlap EXCLUDE USING gist (lab_id WITH =, slot WITH &amp;amp;&amp;amp;)
    WHERE (status IN ('HELD', 'CONFIRMED')));     -- needs CREATE EXTENSION btree_gist</code></pre>
<pre><code class="language-bash">for m in naive naive naive lock serializable constraint constraint; do node interview/booking/race.mjs $m; done</code></pre>
<div class="out">naive        201: 50  409:  0  40001:  0  lượt đặt trong bảng: 50  p50 22.9 ms  chậm nhất 24.8 ms  tổng 25 ms
naive        201: 50  409:  0  40001:  0  lượt đặt trong bảng: 50  p50 20.7 ms  chậm nhất 21.5 ms  tổng 22 ms
naive        201: 50  409:  0  40001:  0  lượt đặt trong bảng: 50  p50 27.6 ms  chậm nhất 28.3 ms  tổng 29 ms
lock         201:  1  409: 49  40001:  0  lượt đặt trong bảng:  1  p50 65.5 ms  chậm nhất 104.2 ms  tổng 106 ms
serializable 201:  1  409: 12  40001: 37  lượt đặt trong bảng:  1  p50 22.7 ms  chậm nhất 38.1 ms  tổng 39 ms
constraint   201:  1  409: 49  40001:  0  lượt đặt trong bảng:  1  p50 27.8 ms  chậm nhất 44.7 ms  tổng 45 ms
constraint   201:  1  409: 49  40001:  0  lượt đặt trong bảng:  1  p50 31.0 ms  chậm nhất 34.2 ms  tổng 34 ms</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">t0</span><span class="lz-t">A: SELECT overlap</span><span class="lz-d">nothing yet ⇒ “free”</span></div>
  <div class="lz-step"><span class="lz-k">t0</span><span class="lz-t">B…Z: SELECT overlap</span><span class="lz-d">A has not inserted ⇒ “free” for all 50</span></div>
  <div class="lz-step"><span class="lz-k">t5</span><span class="lz-t">all INSERT + COMMIT</span><span class="lz-d">nothing in the table forbids it ⇒ 50 bookings</span></div>
</div>
<ul>
  <li><strong>Check, then insert</strong>: 50 of 50 got 201, three runs out of three. Under Read Committed each SELECT sees only rows committed before it began, and nobody had committed yet.</li>
  <li><strong>Lock the lab row</strong> (<code>SELECT … FOR UPDATE</code> on <code>labs</code>): 1 booking, 49 × 409 — correct, but everyone queues on one row, and the slowest waited 104 ms. Every booking of that lab, for any time, waits in the same line.</li>
  <li><strong>SERIALIZABLE</strong>: 1 booking; the losers got error 40001 (“could not serialize”) — 37 of them in this run, while 12 arrived late enough to see the winner and got a clean 409. The API must retry 40001 or turn it into 409; returning 500 is the classic bug.</li>
  <li><strong>Exclusion constraint</strong>: 1 booking, 49 × 409 from error 23P01, with a single INSERT. The rule “no two active bookings of one lab overlap” lives in the database, so it holds for every instance, every code path and every future script.</li>
</ul>
<a class="link-card" href="https://www.postgresql.org/docs/18/sql-createtable.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: PostgreSQL 18 — CREATE TABLE, EXCLUDE (read 1 Nov 2026)</span><span class="lc-sub">An exclusion constraint guarantees that for any two rows the operators are not all true — e.g. no overlapping values with &amp;&amp;; the WHERE predicate limits it to a subset (internally a partial index); in practice the index method is GiST. Transaction isolation docs: serialization failures “always return with an SQLSTATE value of '40001'” and must be retried.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>Holds that expire — and the trap inside them</h3>
<table>
<tr><td>🎤</td><td>Next semester some rooms need a deposit. The student needs a few minutes to pay.</td></tr>
<tr><td>🧑‍💻</td><td>Then <code>POST /v2/bookings</code> creates a <code>HELD</code> booking with <code>holdExpiresAt</code>, and <code>POST /v2/bookings/{id}/confirm</code> turns it into CONFIRMED only if the hold is still alive; otherwise 409 <code>HOLD_EXPIRED</code>. The same exclusion constraint covers HELD and CONFIRMED, so a hold really reserves the slot.</td></tr>
</table>
<p>The constraint cannot look at the clock — <code>now()</code> is not allowed in an index predicate — so an expired hold is still “active” to it:</p>
<pre><code class="language-bash">node interview/booking/race.mjs holds</code></pre>
<div class="out">An giữ chỗ #1 (HELD, hết hạn sau 2 s) rồi đi đóng tiền… và quên
Bình giữ chỗ sau 2,5 s: 23P01 conflicting key value violates exclusion constraint "no_overlap"
dọn 1 chỗ giữ hết hạn trong cùng transaction ⇒ Bình giữ chỗ #3: được
An quay lại xác nhận #1: 0 dòng đổi ⇒ 409 HOLD_EXPIRED
Bình xác nhận #3: 1 dòng đổi ⇒ 200 CONFIRMED</div>
<p>Bình was refused a slot that had been free for half a second. The fix is in the same transaction as the insert: mark expired holds of that lab and range as EXPIRED, then insert (a background sweeper can also clean up, but correctness must not depend on its timing). An's late confirm changed 0 rows and became 409 <code>HOLD_EXPIRED</code> — a conditional UPDATE is the whole state machine. Notice Bình's hold is #3: the failed insert consumed id 2, because sequences never go back — another reason ids are not counters of anything.</p>

<h3>More follow-up questions</h3>
<table>
<tr><td>🎤</td><td>Monday 07:00: 5,000 students in one minute.</td></tr>
<tr><td>🧑‍💻</td><td>About 80 bookings per second if everyone books once — the constraint answers conflicts in milliseconds, so correctness holds. Capacity: reads are cached with ETags; logins are the expensive part, so <code>limitInflight</code> + 503 + Retry-After (8.5), and the client retries with jitter (5.2). If it is still too much, a waiting room that admits students in batches — a product decision, not only a technical one.</td></tr>
<tr><td>🎤</td><td>A student wants to know when a booked slot frees up.</td></tr>
<tr><td>🧑‍💻</td><td>The waitlist resource from Lab 7: cancelling writes a <code>booking.cancelled</code> event through the outbox (10.3); a consumer offers the slot to the first in line by email or push. The waitlist position is computed when read, never stored.</td></tr>
</table>

<h3>Weak answers and strong answers</h3>
<table>
<tr><th>Topic</th><th>Weak</th><th>Strong</th></tr>
<tr><td>Double booking</td><td>“Check availability before inserting.”</td><td>“Measured: 50 of 50 succeed. An exclusion constraint makes it 1 and 49 × 409, in one INSERT.”</td></tr>
<tr><td>Locking</td><td>“Use a distributed lock in Redis.”</td><td>Let the database enforce the invariant; a lock is extra machinery that can expire mid-transaction.</td></tr>
<tr><td>Holds</td><td>“Delete expired holds with a cron job.”</td><td>Expire in the inserting transaction; confirm with a conditional UPDATE ⇒ 409 HOLD_EXPIRED.</td></tr>
<tr><td>Evidence</td><td>“It's fast and scalable.”</td><td>Two or three rows of the evidence table, each with its number and lesson.</td></tr>
</table>

<h3>In interviews and at work</h3>
<ul>
  <li><strong>“Where do you enforce no double booking?”</strong> In the database, as a constraint; the API turns the violation into 409 with the conflicting id.</li>
</ul>

<h3>🧪 Practice (40 min)</h3>
<div class="callout ok"><ol>
  <li>Run <code>race.mjs serializable</code> five times and record how 49 losers split between 409 and 40001. Then add a retry for 40001 and show that all 49 end as 409.</li>
  <li>Add <code>POST /bookings/{id}/confirm</code> to the race schema as a function and test the expired-hold path.</li>
</ol>
<p><strong>Done when:</strong> no run ever produces two bookings, no client ever sees 500, and you can defend the constraint in two sentences.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Race condition</span><span class="v">A result that depends on which concurrent request runs first.</span></div>
  <div class="kv"><span class="k">Check-then-act</span><span class="v">Reading a condition, then acting on it in a separate step — the race.</span></div>
  <div class="kv"><span class="k">Exclusion constraint</span><span class="v">A database rule that no two rows match an operator, e.g. overlapping ranges.</span></div>
  <div class="kv"><span class="k">Serialization failure (40001)</span><span class="v">SERIALIZABLE's way of rejecting a conflicting transaction; retry it.</span></div>
  <div class="kv"><span class="k">Hold</span><span class="v">A temporary reservation that expires unless confirmed.</span></div>
  <div class="kv"><span class="k">Conditional UPDATE</span><span class="v">An UPDATE whose WHERE encodes the allowed state change; 0 rows ⇒ 409.</span></div>
  <div class="kv"><span class="k">Evidence table</span><span class="v">Each design claim paired with a number you measured.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>LabFlow is the answer; bring evidence: a number and a lesson for each claim.</li>
  <li>50 simultaneous bookings: check-then-insert 50 of 50; FOR UPDATE, SERIALIZABLE and an exclusion constraint 1 each.</li>
  <li>SERIALIZABLE's losers get 40001 (37 of 49 here) — retry or map to 409, never 500.</li>
  <li>The exclusion constraint is one INSERT and holds for every instance and every code path.</li>
  <li>Expired holds still block the constraint: expire them in the inserting transaction; confirm with a conditional UPDATE.</li>
</ul>
<a class="link-card" href="/courses/postgresql/learn?lessonSlug=postgresql-9-4-loai-chi-muc" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Go deeper: PostgreSQL course — 9.4 Index types (GiST and exclusion constraints)</span><span class="lc-sub">How the GiST index behind EXCLUDE works, and btree_gist for the equality part. This lesson uses it to win the race; that one explains the index.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>
<a class="link-card" href="/courses/system-design/learn?lessonSlug=sysd-9-2-chong-trung" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Go deeper: System Design in Practice — 9.2 Preventing double-booking</span><span class="lc-sub">The interview version ends here. That course (being written) goes to ticket sales with hundreds of thousands of buyers: waiting rooms, SKIP LOCKED, payment and compensation.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-cs7-2" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">You met this in PRJ301 — ⭐ CS.7 part 2: double booking with two locks</span><span class="lc-sub">Same: two people pressing the same button at the same millisecond, stopped by a database constraint and measured with parallel threads (Java + partial unique index). This lesson adds overlapping time ranges (EXCLUDE), SERIALIZABLE vs FOR UPDATE, expiring holds and how to say it in an interview. Not taken PRJ301? This lesson stands on its own.</span></span>
  <span class="lc-cta">OPEN LESSON →</span>
</a>
<a class="link-card" href="/courses/postgresql/learn?lessonSlug=postgresql-11-4-khoa-deadlock" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Go deeper: PostgreSQL course — 11.4 Row locks, lost updates and deadlocks</span><span class="lc-sub">The “lock” answer measured here is SELECT … FOR UPDATE; that lesson shows lock order, lost updates and how deadlocks are detected.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.6</span>
<h2>Phỏng vấn: thiết kế API cho hệ thống đặt lịch</h2>
<p class="lead">“Thiết kế hệ thống đặt phòng họp / lịch khám / khung giờ phòng lab” là đề bạn chuẩn bị kỹ nhất, vì bạn đã dựng câu trả lời suốt mười chương: LabFlow. Nguy cơ ngược với các đề khác — không phải biết quá ít, mà là kể tính năng không kèm bằng chứng. Bài này biến LabFlow thành một câu trả lời phỏng vấn có số đo làm chứng, rồi chạy thí nghiệm mà buổi phỏng vấn đặt lịch nào cũng đi tới: năm mươi người cùng bấm “Đặt” một khung giờ trong cùng một khoảnh khắc.</p>

<h3>Năm phút đầu</h3>
<table>
<tr><td>🎤</td><td>Thiết kế API đặt phòng máy tính theo giờ cho một trường đại học.</td></tr>
<tr><td>🧑‍💻</td><td>Khung giờ cố định hay khoảng tuỳ ý? Có ai duyệt không? Có thanh toán hay đặt cọc không? Mỗi sinh viên giới hạn bao nhiêu? Lúc nào đông nhất — lúc mở lịch tuần? Và sinh viên có check-in để người không đến thì trả phòng không?</td></tr>
<tr><td>🎤</td><td>Khoảng tuỳ ý theo giờ chẵn, không duyệt, miễn phí — nhưng kỳ sau phòng có thiết bị thì cần đặt cọc. Tối đa ba lượt đặt còn hiệu lực mỗi sinh viên. Lịch mở lúc 07:00 thứ Hai và lúc đó loạn lắm.</td></tr>
<tr><td>🧑‍💻</td><td>Tuyệt đối không được: hai lượt đặt cùng phòng chồng thời gian; sinh viên xem được chi tiết lượt đặt của người khác. Phút 07:00 là điểm thiết kế — ở bài 11.1 em ước lượng ~50 lượt đặt và ~500 lượt đọc mỗi giây. Đặt cọc nghĩa là giữ chỗ có hạn (hold); em thiết kế cho nó ngay từ đầu.</td></tr>
</table>

<h3>Hợp đồng — và mỗi dòng đã được chứng minh ở đâu</h3>
<p>Đây là bề mặt v2 thật của LabFlow, không phải phác thảo:</p>
<pre><code class="language-plaintext">GET    /v2/labs                          200 public, max-age=60 + ETag      (304 before the query)
POST   /v2/bookings      Idempotency-Key 201 + Location · 409 BOOKING_CONFLICT · 422 TOO_MANY_ACTIVE_BOOKINGS · 429 · 503
GET    /v2/bookings?labId=&amp;from=&amp;to=&amp;cursor=   200 private {data, page.next}
POST   /v2/bookings/{id}/cancel          200 · 409 ALREADY_CANCELLED · 404 (not yours)
POST   /v2/bookings/{id}/check-in        200 · 409 NOT_PENDING
POST   /v2/labs/{labId}/waitlist         201 · 409 SLOT_AVAILABLE / ALREADY_WAITING
POST   /v2/exports                       202 + Location: /v2/jobs/{id}
GET    /v2/events/stream                 text/event-stream (SSE)</code></pre>
<p>Trong phòng phỏng vấn, mỗi lựa chọn thiết kế đi kèm bằng chứng của nó. Nói con số và tên bài — đó là khác biệt giữa “em sẽ dùng idempotency key” và “em đã đo chuyện gì xảy ra khi không có nó”:</p>
<table>
<tr><th>Khẳng định khi phỏng vấn</th><th>Bằng chứng bạn đã đo</th><th>Bài</th></tr>
<tr><td>Trang cursor, không OFFSET</td><td>trang ở dòng 900.000: OFFSET 78 ms, keyset 0,064 ms</td><td>3.1–3.2</td></tr>
<tr><td>Idempotency-Key trên POST /bookings</td><td>mất phản hồi + gửi lại ⇒ 409 gây hiểu nhầm chống lại chính lượt đặt của mình; có khoá thì một lượt đặt, 201 được phát lại</td><td>5.1</td></tr>
<tr><td>Giới hạn theo người, trust proxy đặt đúng</td><td>5 lượt đặt / 60 s; <code>trust proxy</code> sai cho 8/8 request giả IP lọt qua</td><td>5.3</td></tr>
<tr><td>Kiểm quyền từng đối tượng, 404 với người khác</td><td>ma trận phân quyền: 8 ô sai ⇒ 0</td><td>6.2</td></tr>
<tr><td>Băm mật khẩu ngoài event loop</td><td>đăng nhập 30 ⇒ 114/s; p99 danh sách phòng 463 ⇒ 8 ms trong lúc có đăng nhập</td><td>8.2</td></tr>
<tr><td>Trạng thái dùng chung trước khi có instance thứ hai</td><td>hai instance: hai bk_1, 8/8 vượt giới hạn 5, cùng khoá ⇒ hai 201</td><td>8.4</td></tr>
<tr><td>Bỏ bớt tải lúc 07:00 thay vì sụp</td><td>goodput 136 ⇒ 12/s khi không bỏ tải; 123/s với 503 + Retry-After</td><td>8.5</td></tr>
<tr><td>Xuất file thành job</td><td>xuất đồng bộ bị proxy cắt ở giây 100; 202 + job trong 17 ms</td><td>10.1</td></tr>
<tr><td>Sự kiện qua outbox</td><td>Redis sập 1,5 s: ghi kép mất 342 sự kiện, outbox 0</td><td>10.3</td></tr>
<tr><td>SSE cho TV phòng lab</td><td>SSE ~1 ms, polling mỗi 2 s trễ 1,1 s và 1.500 request rỗng</td><td>10.4</td></tr>
</table>
<p>Đừng đọc cả mười dòng. Dùng hai ba dòng mà câu hỏi thêm dẫn tới — “em đã thấy chuyện đó xảy ra thật chưa?” là câu hay gặp, và “rồi ạ, đây là con số” khép nó lại.</p>

<h3>Câu hỏi mà buổi phỏng vấn đặt lịch nào cũng tới</h3>
<table>
<tr><td>🎤</td><td>Hai sinh viên bấm “Đặt” phòng lab 1, 14:00–16:00, trong cùng một mili-giây. Chuyện gì xảy ra?</td></tr>
<tr><td>🧑‍💻</td><td>Với LabFlow hôm nay thì không sao: một tiến trình Node kiểm và chèn mà không có <code>await</code> nào ở giữa. Với PostgreSQL và nhiều instance, “kiểm chồng lịch rồi chèn” là một cuộc đua (race). Em xin minh hoạ với năm mươi sinh viên thay vì hai.</td></tr>
</table>
<p><code>interview/booking/race.mjs</code> mở sẵn 50 kết nối PostgreSQL, rồi cho 50 “handler” cùng đặt một phòng một khung giờ. Mỗi handler làm đúng việc một handler thật làm giữa bước kiểm và bước chèn (5 ms kiểm việc khác — quyền, giới hạn ba lượt đặt):</p>
<pre><code class="language-javascript">// interview/booking/race.mjs (trích): hai trong bốn handler
const overlap = &#96;SELECT 1 FROM iv.bookings WHERE lab_id = $1 AND slot &amp;&amp; $2::tstzrange AND status IN ('HELD', 'CONFIRMED')&#96;;
const insert = &#96;INSERT INTO iv.bookings (lab_id, slot, user_id, status) VALUES ($1, $2, $3, 'CONFIRMED') RETURNING id&#96;;
  async naive(c, user) {                                           // kiểm rồi mới ghi, hai câu lệnh riêng
    await c.query('BEGIN');
    const { rowCount } = await c.query(overlap, ['lab_1', SLOT]);
    if (rowCount) { await c.query('ROLLBACK'); return 409; }
    await pause(5);                                                 // 5 ms việc khác của handler (kiểm quyền, giới hạn 3 lượt…)
    await c.query(insert, ['lab_1', SLOT, user]);
    await c.query('COMMIT'); return 201;
  },
  async constraint(c, user) {                                      // chỉ một câu INSERT; luật nằm trong CSDL
    try { await pause(5); await c.query(insert, ['lab_1', SLOT, user]); return 201; }
    catch (e) { if (e.code === '23P01') return 409; throw e; }      // exclusion_violation ⇒ 409 SLOT_TAKEN
  },</code></pre>
<p>Bảng lưu thời gian của mỗi lượt đặt bằng <code>tstzrange</code> (một khoảng thời điểm, nửa mở <code>[14:00, 16:00)</code>); <code>&amp;&amp;</code> nghĩa là “chồng lên nhau”. Handler thứ tư dựa vào ràng buộc này thay vì một câu SELECT:</p>
<pre><code class="language-sql">CREATE TABLE iv.bookings (id serial PRIMARY KEY, lab_id text NOT NULL, slot tstzrange NOT NULL,
  user_id text NOT NULL, status text NOT NULL, hold_expires_at timestamptz,
  CONSTRAINT no_overlap EXCLUDE USING gist (lab_id WITH =, slot WITH &amp;amp;&amp;amp;)
    WHERE (status IN ('HELD', 'CONFIRMED')));     -- needs CREATE EXTENSION btree_gist</code></pre>
<pre><code class="language-bash">for m in naive naive naive lock serializable constraint constraint; do node interview/booking/race.mjs $m; done</code></pre>
<div class="out">naive        201: 50  409:  0  40001:  0  lượt đặt trong bảng: 50  p50 22.9 ms  chậm nhất 24.8 ms  tổng 25 ms
naive        201: 50  409:  0  40001:  0  lượt đặt trong bảng: 50  p50 20.7 ms  chậm nhất 21.5 ms  tổng 22 ms
naive        201: 50  409:  0  40001:  0  lượt đặt trong bảng: 50  p50 27.6 ms  chậm nhất 28.3 ms  tổng 29 ms
lock         201:  1  409: 49  40001:  0  lượt đặt trong bảng:  1  p50 65.5 ms  chậm nhất 104.2 ms  tổng 106 ms
serializable 201:  1  409: 12  40001: 37  lượt đặt trong bảng:  1  p50 22.7 ms  chậm nhất 38.1 ms  tổng 39 ms
constraint   201:  1  409: 49  40001:  0  lượt đặt trong bảng:  1  p50 27.8 ms  chậm nhất 44.7 ms  tổng 45 ms
constraint   201:  1  409: 49  40001:  0  lượt đặt trong bảng:  1  p50 31.0 ms  chậm nhất 34.2 ms  tổng 34 ms</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">t0</span><span class="lz-t">A: SELECT chồng lịch</span><span class="lz-d">chưa có gì ⇒ “trống”</span></div>
  <div class="lz-step"><span class="lz-k">t0</span><span class="lz-t">B…Z: SELECT chồng lịch</span><span class="lz-d">A chưa chèn ⇒ “trống” với cả 50</span></div>
  <div class="lz-step"><span class="lz-k">t5</span><span class="lz-t">tất cả INSERT + COMMIT</span><span class="lz-d">trong bảng không gì cấm ⇒ 50 lượt đặt</span></div>
</div>
<ul>
  <li><strong>Kiểm rồi chèn</strong>: 50/50 nhận 201, ba lần chạy cả ba. Ở mức Read Committed mỗi câu SELECT chỉ thấy dòng đã commit trước khi nó bắt đầu, mà chưa ai commit cả.</li>
  <li><strong>Khoá dòng của phòng</strong> (<code>SELECT … FOR UPDATE</code> trên <code>labs</code>): 1 lượt đặt, 49 × 409 — đúng, nhưng mọi người xếp hàng trên một dòng, người chậm nhất chờ 104 ms. Mọi lượt đặt của phòng đó, ở bất kỳ giờ nào, chờ chung một hàng.</li>
  <li><strong>SERIALIZABLE</strong>: 1 lượt đặt; người thua nhận lỗi 40001 (“could not serialize”) — 37 người ở lần chạy này, còn 12 người tới đủ muộn để thấy người thắng và nhận 409 gọn gàng. API phải thử lại 40001 hoặc đổi thành 409; trả 500 là lỗi kinh điển.</li>
  <li><strong>Ràng buộc loại trừ</strong> (exclusion constraint): 1 lượt đặt, 49 × 409 từ lỗi 23P01, chỉ với một câu INSERT. Luật “không có hai lượt đặt còn hiệu lực của một phòng chồng giờ” nằm trong CSDL, nên đúng với mọi instance, mọi nhánh mã và mọi script sau này.</li>
</ul>
<a class="link-card" href="https://www.postgresql.org/docs/18/sql-createtable.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: PostgreSQL 18 — CREATE TABLE, EXCLUDE (đọc ngày 1/11/2026)</span><span class="lc-sub">Ràng buộc loại trừ bảo đảm với hai dòng bất kỳ, các toán tử không cùng đúng — ví dụ không có giá trị chồng nhau với &amp;&amp;; vế WHERE giới hạn nó trên một phần bảng (bên trong là chỉ mục một phần); thực tế phương thức chỉ mục là GiST. Tài liệu mức cô lập giao dịch: lỗi tuần tự hoá “luôn trả SQLSTATE '40001'” và phải thử lại.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Giữ chỗ có hạn — và cái bẫy bên trong</h3>
<table>
<tr><td>🎤</td><td>Kỳ sau vài phòng cần đặt cọc. Sinh viên cần vài phút để thanh toán.</td></tr>
<tr><td>🧑‍💻</td><td>Vậy <code>POST /v2/bookings</code> tạo lượt đặt <code>HELD</code> kèm <code>holdExpiresAt</code>, và <code>POST /v2/bookings/{id}/confirm</code> chỉ chuyển nó thành CONFIRMED khi chỗ giữ còn hạn; hết hạn thì 409 <code>HOLD_EXPIRED</code>. Cùng ràng buộc loại trừ bao cả HELD lẫn CONFIRMED, nên giữ chỗ là giữ thật.</td></tr>
</table>
<p>Ràng buộc không nhìn được đồng hồ — <code>now()</code> không được dùng trong điều kiện của chỉ mục — nên một chỗ giữ đã hết hạn vẫn “còn hiệu lực” với nó:</p>
<pre><code class="language-bash">node interview/booking/race.mjs holds</code></pre>
<div class="out">An giữ chỗ #1 (HELD, hết hạn sau 2 s) rồi đi đóng tiền… và quên
Bình giữ chỗ sau 2,5 s: 23P01 conflicting key value violates exclusion constraint "no_overlap"
dọn 1 chỗ giữ hết hạn trong cùng transaction ⇒ Bình giữ chỗ #3: được
An quay lại xác nhận #1: 0 dòng đổi ⇒ 409 HOLD_EXPIRED
Bình xác nhận #3: 1 dòng đổi ⇒ 200 CONFIRMED</div>
<p>Bình bị từ chối một khung giờ đã trống được nửa giây. Cách sửa nằm trong chính transaction chèn: đánh dấu EXPIRED các chỗ giữ đã hết hạn của phòng và khoảng đó, rồi mới chèn (một tiến trình quét nền cũng dọn được, nhưng sự đúng đắn không được phụ thuộc vào giờ nó chạy). Lần xác nhận muộn của An đổi 0 dòng và thành 409 <code>HOLD_EXPIRED</code> — một câu UPDATE có điều kiện là cả máy trạng thái. Để ý chỗ giữ của Bình là #3: lần chèn hỏng đã tiêu id 2, vì sequence không bao giờ lùi lại — thêm một lý do id không đếm được gì cả.</p>

<h3>Thêm câu hỏi</h3>
<table>
<tr><td>🎤</td><td>07:00 thứ Hai: 5.000 sinh viên trong một phút.</td></tr>
<tr><td>🧑‍💻</td><td>Khoảng 80 lượt đặt mỗi giây nếu ai cũng đặt một lần — ràng buộc trả lời xung đột trong vài mili-giây, nên sự đúng đắn vẫn giữ. Về công suất: đọc được cache bằng ETag; đăng nhập là phần đắt, nên <code>limitInflight</code> + 503 + Retry-After (8.5), và client thử lại có jitter (5.2). Vẫn quá tải thì một phòng chờ (waiting room) cho sinh viên vào theo đợt — đó là quyết định sản phẩm, không chỉ kỹ thuật.</td></tr>
<tr><td>🎤</td><td>Sinh viên muốn biết khi nào khung giờ đã có người đặt được trả ra.</td></tr>
<tr><td>🧑‍💻</td><td>Tài nguyên hàng chờ từ Lab 7: huỷ lượt đặt ghi sự kiện <code>booking.cancelled</code> qua outbox (10.3); một consumer mời người đầu hàng bằng email hoặc thông báo đẩy. Vị trí trong hàng chờ được tính khi đọc, không bao giờ lưu.</td></tr>
</table>

<h3>Câu trả lời yếu và câu trả lời mạnh</h3>
<table>
<tr><th>Chủ đề</th><th>Yếu</th><th>Mạnh</th></tr>
<tr><td>Đặt trùng</td><td>“Kiểm phòng trống trước khi chèn.”</td><td>“Đo được: 50/50 thành công. Ràng buộc loại trừ làm thành 1 và 49 × 409, chỉ một INSERT.”</td></tr>
<tr><td>Khoá</td><td>“Dùng khoá phân tán trên Redis.”</td><td>Để CSDL giữ bất biến; khoá là thêm bộ máy, có thể hết hạn giữa transaction.</td></tr>
<tr><td>Giữ chỗ</td><td>“Cron xoá chỗ giữ hết hạn.”</td><td>Cho hết hạn ngay trong transaction chèn; xác nhận bằng UPDATE có điều kiện ⇒ 409 HOLD_EXPIRED.</td></tr>
<tr><td>Bằng chứng</td><td>“Nó nhanh và scale tốt.”</td><td>Hai ba dòng của bảng bằng chứng, mỗi dòng kèm con số và tên bài.</td></tr>
</table>

<h3>Khi phỏng vấn và khi đi làm</h3>
<ul>
  <li><strong>“Em chặn đặt trùng ở đâu?”</strong> Trong CSDL, bằng ràng buộc; API đổi lỗi vi phạm thành 409 kèm id lượt đặt bị chồng.</li>
</ul>

<h3>🧪 Thực hành (40 phút)</h3>
<div class="callout ok"><ol>
  <li>Chạy <code>race.mjs serializable</code> năm lần, ghi lại 49 người thua chia giữa 409 và 40001 thế nào. Rồi thêm thử lại cho 40001 và cho thấy cả 49 kết thúc bằng 409.</li>
  <li>Thêm <code>POST /bookings/{id}/confirm</code> vào lược đồ của race thành một hàm và test nhánh chỗ giữ hết hạn.</li>
</ol>
<p><strong>Đạt khi:</strong> không lần chạy nào ra hai lượt đặt, không client nào thấy 500, và bạn bảo vệ được ràng buộc trong hai câu.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Race condition (điều kiện đua)</span><span class="v">Kết quả phụ thuộc request đồng thời nào chạy trước.</span></div>
  <div class="kv"><span class="k">Check-then-act (kiểm rồi làm)</span><span class="v">Đọc một điều kiện rồi hành động ở một bước riêng — chính là cuộc đua.</span></div>
  <div class="kv"><span class="k">Exclusion constraint (ràng buộc loại trừ)</span><span class="v">Luật CSDL: không có hai dòng khớp một toán tử, ví dụ khoảng thời gian chồng nhau.</span></div>
  <div class="kv"><span class="k">Serialization failure (lỗi tuần tự hoá, 40001)</span><span class="v">Cách SERIALIZABLE từ chối transaction xung đột; phải thử lại.</span></div>
  <div class="kv"><span class="k">Hold (giữ chỗ)</span><span class="v">Đặt chỗ tạm, hết hạn nếu không được xác nhận.</span></div>
  <div class="kv"><span class="k">Conditional UPDATE (UPDATE có điều kiện)</span><span class="v">UPDATE mà WHERE mã hoá bước chuyển trạng thái hợp lệ; 0 dòng ⇒ 409.</span></div>
  <div class="kv"><span class="k">Evidence table (bảng bằng chứng)</span><span class="v">Mỗi khẳng định thiết kế đi cùng một con số bạn đã đo.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>LabFlow là câu trả lời; mang theo bằng chứng: một con số và một tên bài cho mỗi khẳng định.</li>
  <li>50 lượt đặt cùng lúc: kiểm-rồi-chèn 50/50; FOR UPDATE, SERIALIZABLE và ràng buộc loại trừ đều 1.</li>
  <li>Người thua của SERIALIZABLE nhận 40001 (37/49 ở đây) — thử lại hoặc đổi thành 409, không bao giờ 500.</li>
  <li>Ràng buộc loại trừ chỉ là một câu INSERT và đúng với mọi instance, mọi nhánh mã.</li>
  <li>Chỗ giữ hết hạn vẫn chặn ràng buộc: cho hết hạn trong transaction chèn; xác nhận bằng UPDATE có điều kiện.</li>
</ul>
<a class="link-card" href="/courses/postgresql/learn?lessonSlug=postgresql-9-4-loai-chi-muc" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Học sâu hơn: khoá PostgreSQL — 9.4 Các loại chỉ mục (GiST và ràng buộc loại trừ)</span><span class="lc-sub">Chỉ mục GiST phía sau EXCLUDE hoạt động ra sao, và btree_gist cho phần so bằng. Bài này dùng nó để thắng cuộc đua; bài kia giải thích chỉ mục.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<a class="link-card" href="/courses/system-design/learn?lessonSlug=sysd-9-2-chong-trung" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Học sâu hơn: System Design in Practice — 9.2 Chống bán trùng</span><span class="lc-sub">Bản phỏng vấn dừng ở đây. Khoá đó (đang soạn) đi tới bán vé với hàng trăm nghìn người mua: phòng chờ, SKIP LOCKED, thanh toán và bù trừ.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-cs7-2" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Bạn đã gặp điều này ở PRJ301 — ⭐ CS.7 phần 2: chống đặt trùng bằng hai ổ khoá</span><span class="lc-sub">Giống: hai người bấm cùng một nút trong cùng một mili-giây, bị chặn bằng ràng buộc CSDL và đo bằng nhiều luồng song song (Java + partial unique index). Bài này thêm khoảng thời gian chồng nhau (EXCLUDE), SERIALIZABLE so với FOR UPDATE, giữ chỗ có hạn và cách nói khi phỏng vấn. Chưa học PRJ301? Bài này vẫn tự đứng được.</span></span>
  <span class="lc-cta">MỞ BÀI →</span>
</a>
<a class="link-card" href="/courses/postgresql/learn?lessonSlug=postgresql-11-4-khoa-deadlock" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Học sâu hơn: khoá PostgreSQL — 11.4 Khoá dòng, lost update và deadlock</span><span class="lc-sub">Cách “khoá” đo ở đây là SELECT … FOR UPDATE; bài đó giảng thứ tự khoá, lost update và cách phát hiện deadlock.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
</div>
`,
    },
    /* ─────────────────────────── Lab 11 ─────────────────────────── */
    {
      title: 'Lab 11 — Mock interview: design the API of a club event sign-up and check-in system|||Lab 11 — Phỏng vấn thử: thiết kế API đăng ký và check-in sự kiện CLB',
      slug: 'api-11-7-lab',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Phỏng vấn thử 45 phút có kịch bản người hỏi: viết design doc 6 mục và OpenAPI 3.1 cho hệ thống sự kiện CLB (hàng chờ, check-in khi mất mạng), tự chấm bằng lab/grade-lab11.mjs (khởi đầu 0/10, lời giải 10/10) và thang 6 tiêu chí; gói labflow-api-ch11-b.zip.',
      content: `${GL11}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lab 11</span>
<h2>Lab 11: mock interview — the API of a club event sign-up and check-in system</h2>
<p class="lead">Time to sit the interview yourself, on a problem you have not seen solved: student clubs, events with limited seats, a waitlist, and check-in at the door on unreliable Wi-Fi. You get 45 minutes with a partner playing the interviewer, then you turn your board into two files — a six-section design document and an OpenAPI 3.1 contract — and grade them twice: with a script for what a machine can check, and with the rubric of 11.1 for what only a listener can judge.</p>

<h3>How to run the mock interview</h3>
<p>Find a classmate (or record yourself and play both roles). The interviewer reads only <code>lab/lab11/de-bai.md</code>; you do not read the follow-up questions in advance. Use a timer and a whiteboard or paper — no laptop until minute 45.</p>
<table>
<tr><th>Minute</th><th>The interviewer says</th><th>What they listen for</th></tr>
<tr><td>0</td><td>“About 60 clubs organise events, from 50 to 500 seats. Students register in the app; when it is full they join a waitlist. On the day, organisers scan a QR code at the door — the hall Wi-Fi is unreliable. Design the API.”</td><td>Questions before drawing</td></tr>
<tr><td>8</td><td>“A popular event opens at 12:00 and 3,000 students press at once.”</td><td>A number for the peak, and what it changes</td></tr>
<tr><td>15</td><td>“Two students press Register for the last seat at the same time.”</td><td>A constraint in the database, not a check in code (11.6)</td></tr>
<tr><td>22</td><td>“The organiser's phone loses the network while scanning. What happens when it comes back? Same ticket scanned twice?”</td><td>Offline queue, Idempotency-Key, “already checked in” is not an error</td></tr>
<tr><td>30</td><td>“Someone cancels. How does the first person on the waitlist find out?”</td><td>Promotion in the same transaction, event via outbox, push/SSE</td></tr>
<tr><td>36</td><td>“Who may see the attendee list? Who may check people in?”</td><td>Roles from the token, 403 vs 404</td></tr>
<tr><td>40</td><td>“Next year there are paid events. How do you change the API without breaking old apps?”</td><td>Optional fields, new enum values only for new clients (Chapter 4)</td></tr>
</table>

<h3>Deliverables</h3>
<ol>
  <li><code>design-doc.md</code> — six sections, in this order: 1 Requirements, 2 Estimates, 3 Resources and endpoints, 4 Errors and pagination, 5 Auth, rate limits, versioning, 6 Scale and trade-offs. Start from <code>lab/lab11/design-doc-starter.md</code>.</li>
  <li><code>openapi.yaml</code> — OpenAPI 3.1 for the endpoints of section 3, lint-clean with LabFlow's <code>redocly.yaml</code> (operationId, a 4xx on every operation, tag descriptions). Start from <code>lab/lab11/openapi-starter.yaml</code> — a realistic first draft, deliberately weak.</li>
</ol>
<p>The starter files, graded:</p>
<pre><code class="language-bash">node lab/grade-lab11.mjs lab/lab11/design-doc-starter.md lab/lab11/openapi-starter.yaml</code></pre>
<div class="out">✗  1. Design doc: đủ 6 mục, mỗi mục ≥ 150 ký tự nội dung thật — mục thiếu hoặc quá ngắn: 1, 2, 3, 4, 5, 6
✗  2. Ước lượng: ≥ 2 con số theo giây và nói rõ ĐỈNH — 0 con số/giây, KHÔNG nói đỉnh
✗  3. OpenAPI 3.1 đọc được và lint 0 lỗi (redocly) — 9 lỗi lint
✗  4. Tài nguyên: /v1/…, danh từ, có events, registrations, check-ins — đường có động từ/thiếu /v1: /getEvents, /registerEvent, /checkin
✗  5. Lỗi: mọi 4xx/5xx là application/problem+json; đăng ký có 409 và 422 — không có POST …/registrations
✗  6. Phân trang: mọi danh sách có limit + cursor và page.next, không trả mảng trần — /getEvents trả mảng trần
✗  7. Idempotency-Key trên POST đăng ký và POST check-in — thiếu ở: đăng ký, check-in
✗  8. Bảo mật: có securitySchemes + security; check-in khai 403 — schemes: — · security toàn cục: không · check-in 403: không
✗  9. Giới hạn tần suất: đăng ký khai 429 kèm header Retry-After — không có 429
✗ 10. Hàng chờ khi hết chỗ: trạng thái WAITLISTED (hoặc 202) trong hợp đồng + doc nói về hàng chờ — hợp đồng: không · doc: không
ĐIỂM: 0/10</div>

<h3>The rubric: 10 points the script checks</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">1 · Six sections</span><span class="v">each with at least 150 characters of real content (TODO lines do not count).</span></div>
  <div class="kv"><span class="k">2 · Estimates</span><span class="v">at least two rates per second, and the word peak.</span></div>
  <div class="kv"><span class="k">3 · Valid OpenAPI 3.1</span><span class="v">parses, and redocly lint reports 0 errors.</span></div>
  <div class="kv"><span class="k">4 · Resources</span><span class="v">every path under /v1/, no verbs, events + registrations + check-ins exist.</span></div>
  <div class="kv"><span class="k">5 · Errors</span><span class="v">every 4xx/5xx is application/problem+json; registration documents 409 and 422.</span></div>
  <div class="kv"><span class="k">6 · Pagination</span><span class="v">every list has limit + cursor and page.next; no bare arrays.</span></div>
  <div class="kv"><span class="k">7 · Idempotency</span><span class="v">Idempotency-Key on POST registration and POST check-in.</span></div>
  <div class="kv"><span class="k">8 · Security</span><span class="v">a security scheme applied everywhere; check-in documents 403.</span></div>
  <div class="kv"><span class="k">9 · Rate limit</span><span class="v">registration documents 429 with a Retry-After header.</span></div>
  <div class="kv"><span class="k">10 · Waitlist</span><span class="v">WAITLISTED (or 202) in the registration response, and the doc explains the waitlist.</span></div>
</div>
<p>The script cannot tell whether your answers are <em>good</em> — only whether they are there. That is the job of the second rubric: score your recording with the six rows of 11.1 (1–3 each). Use this self-check while listening:</p>
<ul>
  <li>Did I ask at least three questions before drawing, and write the answers down?</li>
  <li>Did one of my numbers change a decision (for example “50 registrations/s fits one database; no queue”)?</li>
  <li>When asked about the last seat, did I name a database rule and the status code the loser gets?</li>
  <li>Did I say what I chose <em>not</em> to build, and why?</li>
  <li>Did I finish with a three-sentence summary before minute 45?</li>
</ul>
<div class="pitfall"><p><strong>Trap — one unquoted brace breaks the whole contract.</strong> In YAML flow style, <code>{ description: /v1/events/{eventId} }</code> is read as a nested map, and the file stops parsing. Measured on the reference solution with that single line reintroduced:</p></div>
<pre><code class="language-bash">sed "s|description: 'Path of the new event' }|description: /v1/events/{eventId} }|" lab/lab11/solution/openapi.yaml &gt; ../lab11-trap.yaml &amp;&amp; node lab/grade-lab11.mjs lab/lab11/solution/design-doc.md ../lab11-trap.yaml | sed -n '3,4p;$p'</code></pre>
<div class="out">✗  3. OpenAPI 3.1 đọc được và lint 0 lỗi (redocly) — YAML hỏng: Unexpected flow-map-start at node end at line 62, column 75:
✗  4. Tài nguyên: /v1/…, danh từ, có events, registrations, check-ins — thiếu: /events, /registrations, /check-ins
ĐIỂM: 2/10</div>
<p>Eight points vanished for one line — the same family of YAML traps as in 7.1. Quote any string with <code>{</code>, <code>:</code> or a comma inside a flow map, and run the grader after every edit, not at the end.</p>
<div class="pitfall"><p><strong>Trap — “it's just a list”.</strong> <code>type: array</code> as the whole response looks harmless, but there is nowhere to put <code>next</code>, so adding pagination later is a breaking change. Wrap lists in <code>{ data, page }</code> from day one (3.1).</p></div>

<h3>Reference solution</h3>
<p>One good answer, not the only one (<code>lab/lab11/solution/</code>). The heart of it is section 6 of the design document:</p>
<pre><code class="language-markdown">Không vượt số chỗ: ràng buộc trong PostgreSQL, không phải kiểm trong code. Trong một transaction:
&#96;UPDATE events SET seats_left = seats_left - 1 WHERE id = $1 AND seats_left &gt; 0&#96; — 0 dòng ⇒ thêm vào hàng chờ;
&#96;UNIQUE (event_id, user_id)&#96; chặn đăng ký hai lần. Bài 11.6 đo kiểu "kiểm rồi ghi": 50 người bấm, 50 người "thành công";
ràng buộc trong CSDL: đúng 1.</code></pre>
<p>And the registration operation of the contract — one 201 with two possible statuses, every failure a problem+json, a key for retries and a documented limit:</p>
<pre><code class="language-yaml">  /v1/events/{eventId}/registrations:
    post:
      operationId: register
      summary: Register the current student — a seat if one is left, otherwise the waitlist
      parameters:
        - $ref: '#/components/parameters/IdempotencyKey'
      responses:
        '201':
          description: CONFIRMED (a seat, with a ticket) or WAITLISTED (with a position)
          content: { application/json: { schema: { $ref: '#/components/schemas/Registration' } } }
        '409': { description: ALREADY_REGISTERED, … application/problem+json }
        '422': { description: REGISTRATION_CLOSED or WAITLIST_FULL, … }
        '429': { $ref: '#/components/responses/TooManyRequests' }   # Retry-After + RateLimit</code></pre>
<pre><code class="language-bash">node lab/grade-lab11.mjs lab/lab11/solution/design-doc.md lab/lab11/solution/openapi.yaml</code></pre>
<div class="out">✓  1. Design doc: đủ 6 mục, mỗi mục ≥ 150 ký tự nội dung thật — đủ
✓  2. Ước lượng: ≥ 2 con số theo giây và nói rõ ĐỈNH — 3 con số/giây, có đỉnh
✓  3. OpenAPI 3.1 đọc được và lint 0 lỗi (redocly) — 0 lỗi
✓  4. Tài nguyên: /v1/…, danh từ, có events, registrations, check-ins — 6 đường đúng kiểu
✓  5. Lỗi: mọi 4xx/5xx là application/problem+json; đăng ký có 409 và 422 — 409 ✓ 422 ✓
✓  6. Phân trang: mọi danh sách có limit + cursor và page.next, không trả mảng trần — 4 danh sách
✓  7. Idempotency-Key trên POST đăng ký và POST check-in — có ở cả hai
✓  8. Bảo mật: có securitySchemes + security; check-in khai 403 — schemes: bearerAuth · security toàn cục: có · check-in 403: có
✓  9. Giới hạn tần suất: đăng ký khai 429 kèm header Retry-After — 429 + Retry-After
✓ 10. Hàng chờ khi hết chỗ: trạng thái WAITLISTED (hoặc 202) trong hợp đồng + doc nói về hàng chờ — hợp đồng: WAITLISTED · doc: có
ĐIỂM: 10/10</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Registration · conditional UPDATE + UNIQUE</span><span class="lz-lnote">seat or waitlist decided in one transaction; never over capacity, never twice</span></div>
  <div class="lz-layer"><span class="lz-lname">Check-in · offline queue + Idempotency-Key</span><span class="lz-lnote">first scan 201, any repeat 200 with the first check-in; scannedAt kept from the device</span></div>
  <div class="lz-layer"><span class="lz-lname">Waitlist promotion · outbox event</span><span class="lz-lnote">cancel promotes in the same transaction; notification sent from the outbox (10.3)</span></div>
  <div class="lz-layer"><span class="lz-lname">Door screen · SSE</span><span class="lz-lnote">“312 / 500 checked in” pushed in ~1 ms instead of polling (10.4)</span></div>
</div>
<p><strong>Discussion.</strong> Why 201 with <code>status: WAITLISTED</code> instead of 202? A waitlist place <em>is</em> created immediately — it has an id, a position and can be cancelled — so 201 is truthful; 202 means “I will decide later”, which you would use only if registrations went through a queue at a far bigger scale. And why does a repeated scan return 200, not 409? At the door, “already in” is the answer the organiser needs, not an error to dismiss — the same reasoning as a replayed Idempotency-Key.</p>

<a class="link-card" href="https://media.cuongthai.com/files/academy/API/v1/labflow-api-ch11-b.zip" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Download: LabFlow API at the end of Chapter 11 (labflow-api-ch11-b.zip)</span><span class="lc-sub">Everything of Chapter 10 plus interview/: estimate.mjs, shortener/ (app, codes, collisions, browser-redirect), feed/fanout.mjs, chat/ (server, send), booking/race.mjs; lab/lab11/ (problem, starters, reference solution) and lab/grade-lab11.mjs. npm install, npm test (13 tests).</span></span>
  <span class="lc-cta">DOWNLOAD →</span>
</a>

<h3>📌 What this lab shows</h3>
<ul>
  <li>A 45-minute answer becomes a design document and a contract that others can read, lint and check.</li>
  <li>The starter scored 0/10, one unquoted brace dropped the reference solution to 2/10, the solution scored 10/10.</li>
  <li>The machine checks presence; the six-row rubric, scored from a recording, checks judgement and communication.</li>
  <li>The hard parts of this problem are the same as LabFlow's: the last seat, a retried request, an offline device, a notification that must not get lost.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/software-requirements/learn?lessonSlug=swr302-4-1-use-case-user-story" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">You met this in SWR302 — lesson 4.1: use cases and user stories</span><span class="lc-sub">Same: a use case's alternative and exception flows force you to think about what goes wrong. Different: here each exception flow (full event, double click, offline scan) becomes a status code, a header or a database rule in the contract. Not taken SWR302? This lab stands on its own.</span></span>
  <span class="lc-cta">OPEN LESSON →</span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Lab 11</span>
<h2>Lab 11: phỏng vấn thử — API đăng ký và check-in sự kiện CLB</h2>
<p class="lead">Đến lượt bạn tự ngồi ghế ứng viên, với một đề chưa ai giải sẵn cho bạn xem: các câu lạc bộ, sự kiện có số chỗ giới hạn, hàng chờ (waitlist), và check-in ở cửa với Wi-Fi chập chờn. Bạn có 45 phút với một người bạn đóng vai người phỏng vấn, rồi biến những gì trên bảng thành hai tệp — design doc sáu mục và hợp đồng OpenAPI 3.1 — và chấm hai lần: bằng script cho phần máy kiểm được, và bằng thang chấm của bài 11.1 cho phần chỉ người nghe mới đánh giá được.</p>

<h3>Cách chạy buổi phỏng vấn thử</h3>
<p>Rủ một bạn cùng lớp (hoặc tự ghi âm và đóng cả hai vai). Người phỏng vấn chỉ đọc <code>lab/lab11/de-bai.md</code>; bạn không đọc trước các câu hỏi thêm. Bấm giờ, dùng bảng trắng hoặc giấy — không mở laptop trước phút 45.</p>
<table>
<tr><th>Phút</th><th>Người phỏng vấn nói</th><th>Họ lắng nghe điều gì</th></tr>
<tr><td>0</td><td>“Trường có khoảng 60 CLB tổ chức sự kiện, từ 50 tới 500 chỗ. Sinh viên đăng ký trên app; hết chỗ thì vào hàng chờ. Hôm diễn ra, ban tổ chức quét mã QR ở cửa — Wi-Fi hội trường hay chập chờn. Hãy thiết kế API.”</td><td>Câu hỏi trước khi vẽ</td></tr>
<tr><td>8</td><td>“Sự kiện hot mở đăng ký lúc 12:00, 3.000 sinh viên bấm cùng lúc.”</td><td>Một con số cho đỉnh, và nó đổi được gì</td></tr>
<tr><td>15</td><td>“Hai sinh viên cùng bấm Đăng ký cho chỗ cuối cùng.”</td><td>Ràng buộc trong CSDL, không phải kiểm trong code (11.6)</td></tr>
<tr><td>22</td><td>“Điện thoại ban tổ chức mất mạng giữa lúc quét. Có mạng lại thì sao? Quét một vé hai lần?”</td><td>Hàng đợi offline, Idempotency-Key, “đã vào rồi” không phải lỗi</td></tr>
<tr><td>30</td><td>“Có người huỷ. Người đầu hàng chờ biết bằng cách nào?”</td><td>Đôn lên trong cùng transaction, sự kiện qua outbox, đẩy/SSE</td></tr>
<tr><td>36</td><td>“Ai được xem danh sách người tham dự? Ai được check-in?”</td><td>Vai trò lấy từ token, 403 hay 404</td></tr>
<tr><td>40</td><td>“Sang năm có sự kiện thu phí. Đổi API thế nào để app cũ không vỡ?”</td><td>Trường tuỳ chọn, giá trị enum mới chỉ cho client mới (Chương 4)</td></tr>
</table>

<h3>Sản phẩm nộp</h3>
<ol>
  <li><code>design-doc.md</code> — sáu mục, đúng thứ tự: 1 Requirements (yêu cầu), 2 Estimates (ước lượng), 3 Resources and endpoints (tài nguyên và endpoint), 4 Errors and pagination (lỗi và phân trang), 5 Auth, rate limits, versioning (xác thực, giới hạn, phiên bản), 6 Scale and trade-offs (quy mô và đánh đổi). Bắt đầu từ <code>lab/lab11/design-doc-starter.md</code>.</li>
  <li><code>openapi.yaml</code> — OpenAPI 3.1 cho các endpoint ở mục 3, lint sạch với <code>redocly.yaml</code> của LabFlow (operationId, mọi thao tác có một 4xx, mô tả tag). Bắt đầu từ <code>lab/lab11/openapi-starter.yaml</code> — một bản nháp đầu tiên điển hình, cố ý yếu.</li>
</ol>
<p>Các tệp khởi đầu, chấm thử:</p>
<pre><code class="language-bash">node lab/grade-lab11.mjs lab/lab11/design-doc-starter.md lab/lab11/openapi-starter.yaml</code></pre>
<div class="out">✗  1. Design doc: đủ 6 mục, mỗi mục ≥ 150 ký tự nội dung thật — mục thiếu hoặc quá ngắn: 1, 2, 3, 4, 5, 6
✗  2. Ước lượng: ≥ 2 con số theo giây và nói rõ ĐỈNH — 0 con số/giây, KHÔNG nói đỉnh
✗  3. OpenAPI 3.1 đọc được và lint 0 lỗi (redocly) — 9 lỗi lint
✗  4. Tài nguyên: /v1/…, danh từ, có events, registrations, check-ins — đường có động từ/thiếu /v1: /getEvents, /registerEvent, /checkin
✗  5. Lỗi: mọi 4xx/5xx là application/problem+json; đăng ký có 409 và 422 — không có POST …/registrations
✗  6. Phân trang: mọi danh sách có limit + cursor và page.next, không trả mảng trần — /getEvents trả mảng trần
✗  7. Idempotency-Key trên POST đăng ký và POST check-in — thiếu ở: đăng ký, check-in
✗  8. Bảo mật: có securitySchemes + security; check-in khai 403 — schemes: — · security toàn cục: không · check-in 403: không
✗  9. Giới hạn tần suất: đăng ký khai 429 kèm header Retry-After — không có 429
✗ 10. Hàng chờ khi hết chỗ: trạng thái WAITLISTED (hoặc 202) trong hợp đồng + doc nói về hàng chờ — hợp đồng: không · doc: không
ĐIỂM: 0/10</div>

<h3>Thang chấm: 10 điểm script kiểm</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">1 · Sáu mục</span><span class="v">mỗi mục ít nhất 150 ký tự nội dung thật (dòng TODO không tính).</span></div>
  <div class="kv"><span class="k">2 · Ước lượng</span><span class="v">ít nhất hai con số theo giây, và có chữ đỉnh/peak.</span></div>
  <div class="kv"><span class="k">3 · OpenAPI 3.1 hợp lệ</span><span class="v">đọc được, và redocly lint báo 0 lỗi.</span></div>
  <div class="kv"><span class="k">4 · Tài nguyên</span><span class="v">mọi đường dưới /v1/, không động từ, có events + registrations + check-ins.</span></div>
  <div class="kv"><span class="k">5 · Lỗi</span><span class="v">mọi 4xx/5xx là application/problem+json; đăng ký có 409 và 422.</span></div>
  <div class="kv"><span class="k">6 · Phân trang</span><span class="v">mọi danh sách có limit + cursor và page.next; không trả mảng trần.</span></div>
  <div class="kv"><span class="k">7 · Idempotency</span><span class="v">Idempotency-Key trên POST đăng ký và POST check-in.</span></div>
  <div class="kv"><span class="k">8 · Bảo mật</span><span class="v">một security scheme áp cho mọi nơi; check-in khai 403.</span></div>
  <div class="kv"><span class="k">9 · Giới hạn tần suất</span><span class="v">đăng ký khai 429 kèm header Retry-After.</span></div>
  <div class="kv"><span class="k">10 · Hàng chờ</span><span class="v">WAITLISTED (hoặc 202) trong response đăng ký, và doc giải thích hàng chờ.</span></div>
</div>
<p>Script không biết câu trả lời của bạn có <em>hay</em> không — chỉ biết nó có mặt hay không. Đó là việc của thang chấm thứ hai: chấm bản ghi âm bằng sáu dòng của bài 11.1 (mỗi dòng 1–3). Dùng danh sách tự kiểm này khi nghe lại:</p>
<ul>
  <li>Mình đã hỏi ít nhất ba câu trước khi vẽ và ghi câu trả lời lại chưa?</li>
  <li>Có con số nào của mình làm đổi một quyết định không (ví dụ “50 lượt đăng ký/s vừa một CSDL; không cần hàng đợi”)?</li>
  <li>Khi bị hỏi về chỗ cuối cùng, mình có gọi tên một luật của CSDL và status code người thua nhận không?</li>
  <li>Mình có nói điều mình chọn <em>không</em> làm, và vì sao không?</li>
  <li>Mình có kết thúc bằng tóm tắt ba câu trước phút 45 không?</li>
</ul>
<div class="pitfall"><p><strong>Bẫy — một dấu ngoặc nhọn không có nháy làm vỡ cả hợp đồng.</strong> Trong YAML kiểu flow, <code>{ description: /v1/events/{eventId} }</code> bị đọc thành một map lồng nhau, và tệp hết đọc được. Đo trên lời giải tham khảo khi đưa đúng một dòng đó trở lại:</p></div>
<pre><code class="language-bash">sed "s|description: 'Path of the new event' }|description: /v1/events/{eventId} }|" lab/lab11/solution/openapi.yaml &gt; ../lab11-trap.yaml &amp;&amp; node lab/grade-lab11.mjs lab/lab11/solution/design-doc.md ../lab11-trap.yaml | sed -n '3,4p;$p'</code></pre>
<div class="out">✗  3. OpenAPI 3.1 đọc được và lint 0 lỗi (redocly) — YAML hỏng: Unexpected flow-map-start at node end at line 62, column 75:
✗  4. Tài nguyên: /v1/…, danh từ, có events, registrations, check-ins — thiếu: /events, /registrations, /check-ins
ĐIỂM: 2/10</div>
<p>Tám điểm biến mất vì một dòng — cùng họ bẫy YAML với bài 7.1. Hãy đặt trong nháy mọi chuỗi có <code>{</code>, <code>:</code> hay dấu phẩy nằm trong flow map, và chạy bộ chấm sau mỗi lần sửa, đừng đợi tới cuối.</p>
<div class="pitfall"><p><strong>Bẫy — “chỉ là một danh sách thôi”.</strong> <code>type: array</code> làm cả response trông vô hại, nhưng không còn chỗ đặt <code>next</code>, nên thêm phân trang về sau là thay đổi phá vỡ. Bọc danh sách trong <code>{ data, page }</code> từ ngày đầu (3.1).</p></div>

<h3>Lời giải tham khảo</h3>
<p>Một câu trả lời tốt, không phải câu duy nhất (<code>lab/lab11/solution/</code>). Trái tim của nó là mục 6 của design doc:</p>
<pre><code class="language-markdown">Không vượt số chỗ: ràng buộc trong PostgreSQL, không phải kiểm trong code. Trong một transaction:
&#96;UPDATE events SET seats_left = seats_left - 1 WHERE id = $1 AND seats_left &gt; 0&#96; — 0 dòng ⇒ thêm vào hàng chờ;
&#96;UNIQUE (event_id, user_id)&#96; chặn đăng ký hai lần. Bài 11.6 đo kiểu "kiểm rồi ghi": 50 người bấm, 50 người "thành công";
ràng buộc trong CSDL: đúng 1.</code></pre>
<p>Và thao tác đăng ký trong hợp đồng — một 201 với hai trạng thái có thể có, mọi lỗi là problem+json, một khoá cho lần gửi lại và một giới hạn được khai báo:</p>
<pre><code class="language-yaml">  /v1/events/{eventId}/registrations:
    post:
      operationId: register
      summary: Register the current student — a seat if one is left, otherwise the waitlist
      parameters:
        - $ref: '#/components/parameters/IdempotencyKey'
      responses:
        '201':
          description: CONFIRMED (a seat, with a ticket) or WAITLISTED (with a position)
          content: { application/json: { schema: { $ref: '#/components/schemas/Registration' } } }
        '409': { description: ALREADY_REGISTERED, … application/problem+json }
        '422': { description: REGISTRATION_CLOSED or WAITLIST_FULL, … }
        '429': { $ref: '#/components/responses/TooManyRequests' }   # Retry-After + RateLimit</code></pre>
<pre><code class="language-bash">node lab/grade-lab11.mjs lab/lab11/solution/design-doc.md lab/lab11/solution/openapi.yaml</code></pre>
<div class="out">✓  1. Design doc: đủ 6 mục, mỗi mục ≥ 150 ký tự nội dung thật — đủ
✓  2. Ước lượng: ≥ 2 con số theo giây và nói rõ ĐỈNH — 3 con số/giây, có đỉnh
✓  3. OpenAPI 3.1 đọc được và lint 0 lỗi (redocly) — 0 lỗi
✓  4. Tài nguyên: /v1/…, danh từ, có events, registrations, check-ins — 6 đường đúng kiểu
✓  5. Lỗi: mọi 4xx/5xx là application/problem+json; đăng ký có 409 và 422 — 409 ✓ 422 ✓
✓  6. Phân trang: mọi danh sách có limit + cursor và page.next, không trả mảng trần — 4 danh sách
✓  7. Idempotency-Key trên POST đăng ký và POST check-in — có ở cả hai
✓  8. Bảo mật: có securitySchemes + security; check-in khai 403 — schemes: bearerAuth · security toàn cục: có · check-in 403: có
✓  9. Giới hạn tần suất: đăng ký khai 429 kèm header Retry-After — 429 + Retry-After
✓ 10. Hàng chờ khi hết chỗ: trạng thái WAITLISTED (hoặc 202) trong hợp đồng + doc nói về hàng chờ — hợp đồng: WAITLISTED · doc: có
ĐIỂM: 10/10</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Đăng ký · UPDATE có điều kiện + UNIQUE</span><span class="lz-lnote">chỗ ngồi hay hàng chờ được quyết trong một transaction; không bao giờ vượt chỗ, không bao giờ hai lần</span></div>
  <div class="lz-layer"><span class="lz-lname">Check-in · hàng đợi offline + Idempotency-Key</span><span class="lz-lnote">lần quét đầu 201, mọi lần lặp 200 kèm lượt check-in đầu; giữ scannedAt từ thiết bị</span></div>
  <div class="lz-layer"><span class="lz-lname">Đôn hàng chờ · sự kiện qua outbox</span><span class="lz-lnote">huỷ thì đôn người kế trong cùng transaction; thông báo gửi từ outbox (10.3)</span></div>
  <div class="lz-layer"><span class="lz-lname">Màn hình ở cửa · SSE</span><span class="lz-lnote">“312 / 500 đã vào” được đẩy trong ~1 ms thay vì polling (10.4)</span></div>
</div>
<p><strong>Bàn luận.</strong> Vì sao 201 kèm <code>status: WAITLISTED</code> mà không 202? Một chỗ trong hàng chờ <em>được tạo</em> ngay — có id, có vị trí, huỷ được — nên 201 là nói thật; 202 nghĩa là “để tôi quyết sau”, chỉ dùng khi đăng ký phải đi qua hàng đợi ở quy mô lớn hơn nhiều. Và vì sao quét lặp trả 200 chứ không 409? Ở cửa, “đã vào rồi” là câu trả lời ban tổ chức cần, không phải một lỗi để bấm tắt — cùng lý lẽ với Idempotency-Key được phát lại.</p>

<a class="link-card" href="https://media.cuongthai.com/files/academy/API/v1/labflow-api-ch11-b.zip" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Tải về: LabFlow API cuối Chương 11 (labflow-api-ch11-b.zip)</span><span class="lc-sub">Mọi thứ của Chương 10 cộng thư mục interview/: estimate.mjs, shortener/ (app, codes, collisions, browser-redirect), feed/fanout.mjs, chat/ (server, send), booking/race.mjs; lab/lab11/ (đề, tệp khởi đầu, lời giải tham khảo) và lab/grade-lab11.mjs. npm install, npm test (13 test).</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>📌 Lab này cho thấy</h3>
<ul>
  <li>Một câu trả lời 45 phút trở thành design doc và hợp đồng mà người khác đọc, lint và kiểm được.</li>
  <li>Tệp khởi đầu được 0/10, một dấu ngoặc không có nháy kéo lời giải tham khảo xuống 2/10, lời giải được 10/10.</li>
  <li>Máy kiểm sự có mặt; thang sáu dòng, chấm từ bản ghi âm, mới kiểm được óc phán đoán và cách giao tiếp.</li>
  <li>Phần khó của đề này giống hệt LabFlow: chỗ cuối cùng, request bị gửi lại, thiết bị mất mạng, thông báo không được mất.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/software-requirements/learn?lessonSlug=swr302-4-1-use-case-user-story" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Bạn đã gặp điều này ở SWR302 — bài 4.1: use case và user story</span><span class="lc-sub">Giống: luồng thay thế và luồng ngoại lệ của use case buộc bạn nghĩ tới chỗ hỏng. Khác: ở đây mỗi luồng ngoại lệ (sự kiện hết chỗ, bấm hai lần, quét khi mất mạng) thành một status code, một header hay một luật CSDL trong hợp đồng. Chưa học SWR302? Lab này vẫn tự đứng được.</span></span>
  <span class="lc-cta">MỞ BÀI →</span>
</a>
</div>
`,
    },
    /* ─────────────────────────── Quiz ─────────────────────────── */
    {
      title: 'Chapter 11 quiz|||Kiểm tra Chương 11',
      slug: 'api-11-8-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống phỏng vấn từ số đo của chương: ước lượng theo đỉnh, trùng mã, 301 hay 302, fan-out, tin chat trùng, đặt trùng lịch, giữ chỗ hết hạn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Quiz</span>
<h2>Chapter 11 quiz: the API design interview</h2>
<p class="lead">Ten interview moments from the chapter's own measurements: an estimate that leads to a decision, short codes that collide, a redirect the browser remembers, a feed for a page with 100,000 followers, a chat on a flaky phone, fifty students and one lab slot, and a hold that expired. Each explanation says why the right answer is right and why the most tempting wrong one is wrong. Aim for 7/10.</p>
<h3>Self-check before you start</h3>
<ul>
  <li>I can run a 45-minute answer in five steps and score it with the six-row rubric.</li>
  <li>I can estimate the peak and compare it with a capacity I measured.</li>
  <li>I can choose a short-code scheme and a redirect status, and defend both with numbers.</li>
  <li>I can explain push, pull and hybrid fan-out and when each wins.</li>
  <li>I can make chat messages survive retries and clock skew.</li>
  <li>I can stop double booking in the database and explain expiring holds.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Kiểm tra</span>
<h2>Kiểm tra Chương 11: vòng phỏng vấn thiết kế API</h2>
<p class="lead">Mười khoảnh khắc phỏng vấn lấy từ chính số đo của chương: một phép ước lượng dẫn tới quyết định, mã ngắn bị trùng, chuyển hướng bị trình duyệt nhớ, feed của một trang 100.000 người theo dõi, chat trên điện thoại chập mạng, năm mươi sinh viên và một khung giờ phòng lab, và một chỗ giữ đã hết hạn. Mỗi lời giải thích nói vì sao đáp án đúng là đúng và vì sao phương án hấp dẫn nhất lại sai. Mục tiêu 7/10.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
  <li>Tôi chạy được câu trả lời 45 phút theo năm bước và chấm nó bằng thang sáu dòng.</li>
  <li>Tôi ước lượng được đỉnh và so với công suất mình đã đo.</li>
  <li>Tôi chọn được cách sinh mã ngắn và status chuyển hướng, bảo vệ cả hai bằng con số.</li>
  <li>Tôi giải thích được fan-out đẩy, kéo và lai, và khi nào mỗi kiểu thắng.</li>
  <li>Tôi làm được tin nhắn chat sống qua lần gửi lại và đồng hồ lệch.</li>
  <li>Tôi chặn được đặt trùng trong CSDL và giải thích được giữ chỗ có hạn.</li>
</ul>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: "The interviewer asks how much load LabFlow must handle. Which answer best follows the chapter's framework?|||Người phỏng vấn hỏi LabFlow phải chịu tải bao nhiêu. Câu trả lời nào theo đúng khung của chương nhất?",
            options: [
              "“Peak ≈ 500 reads/s and 50 logins/s at 07:00; one process measured ~8,000 reads/s, logins use 44% of 114/s — the risk is the login spike”|||“Đỉnh ≈ 500 lượt đọc/s và 50 lượt đăng nhập/s lúc 07:00; một tiến trình đo ~8.000 lượt đọc/s, đăng nhập dùng 44% của 114/s — rủi ro là cú dồn đăng nhập”",
              "“About 0.8 requests per second on average over a day, so one small server is clearly enough for everything”|||“Trung bình khoảng 0,8 request mỗi giây trong ngày, nên một server nhỏ rõ ràng đủ cho mọi thứ”",
              "“It must scale to millions of users, so we start with microservices, Kafka and a sharded database”|||“Phải scale tới hàng triệu người dùng, nên bắt đầu bằng microservice, Kafka và CSDL phân mảnh”",
              "“30,000 students × 86,400 seconds gives the total requests per day, which sizes the cluster”|||“30.000 sinh viên × 86.400 giây cho tổng request mỗi ngày, từ đó tính cụm máy”",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: Lesson 11.1. Design for the peak and compare with a measured capacity; the conclusion is a decision. The daily average (0.83 req/s) hides the 07:00 minute — that is the most tempting wrong answer.|||VI: Bài 11.1. Thiết kế theo đỉnh và so với công suất đã đo; kết luận phải là một quyết định. Trung bình cả ngày (0,83 req/s) che mất phút 07:00 — đó là phương án sai hấp dẫn nhất.",
          },
          {
            question: "A candidate proposes “MD5 the URL and keep 6 characters — then codes are unique”. What did the one-million-link experiment show?|||Ứng viên đề xuất “MD5 URL rồi giữ 6 ký tự — thế là mã duy nhất”. Thí nghiệm một triệu link cho thấy gì?",
            options: [
              "Hashing gave zero collisions because the same URL always produces the same code|||Băm cho 0 lần trùng vì cùng URL luôn ra cùng mã",
              "Hashing collided like random codes — 8 per million at 6 characters — so a uniqueness check is still needed|||Băm trùng y như mã ngẫu nhiên — 8 lần mỗi triệu với 6 ký tự — nên vẫn phải kiểm duy nhất",
              "Hashing collided far more than random codes because MD5 is a weak hash|||Băm trùng nhiều hơn hẳn mã ngẫu nhiên vì MD5 là hàm băm yếu",
              "Hashing only collides when two users shorten exactly the same URL at the same time|||Băm chỉ trùng khi hai người rút gọn đúng cùng URL vào cùng một lúc",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: Lesson 11.2. Truncated sha256 to 6 characters: 8 collisions, random 6 characters: 8–13, prediction N²/2S = 8.8. Identical URLs giving identical codes is a separate (often unwanted) property, not uniqueness.|||VI: Bài 11.2. sha256 cắt 6 ký tự: 8 lần trùng, ngẫu nhiên 6 ký tự: 8–13, dự đoán N²/2S = 8,8. Cùng URL ra cùng mã là một tính chất khác (thường không muốn), không phải tính duy nhất.",
          },
          {
            question: "Why is Base62 of an auto-increment counter a poor choice for a public shortener, despite zero collisions?|||Vì sao Base62 của bộ đếm tự tăng là lựa chọn kém cho dịch vụ rút gọn công khai, dù không bao giờ trùng?",
            options: [
              "Its codes grow to 12 characters after only a few million links|||Mã của nó dài tới 12 ký tự chỉ sau vài triệu link",
              "It is the slowest of the three methods measured in the lesson|||Nó chậm nhất trong ba cách đã đo ở bài",
              "Anyone who sees 4C92 can guess 4C91 and 4C93 and walk through other people's links|||Ai thấy 4C92 cũng đoán được 4C91, 4C93 và duyệt link của người khác",
              "Two servers using the same counter always produce the same code at the same time|||Hai server dùng chung bộ đếm luôn sinh cùng mã cùng lúc",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: Lessons 11.2 and 9.4. The counter was the fastest (321–404 ns) and reached 7 characters only after 56.8 billion links; its problem is enumeration — sequential ids leak counts and neighbours.|||VI: Bài 11.2 và 9.4. Bộ đếm nhanh nhất (321–404 ns) và chỉ tới 7 ký tự sau 56,8 tỉ link; vấn đề của nó là dò lần lượt — id tuần tự làm lộ số lượng và hàng xóm.",
          },
          {
            question: "The shortener promised click counts. In Chromium, five clicks by each of two users on a 301 link were counted as…|||Dịch vụ rút gọn hứa đếm lượt bấm. Trong Chromium, mỗi người bấm năm lần vào link trả 301, hai người, server đếm được…",
            options: [
              "10 of 10, because every navigation sends a new request|||10/10, vì mỗi lần điều hướng là một request mới",
              "0 of 10, because 301 responses are never sent to the browser twice|||0/10, vì response 301 không bao giờ được gửi cho trình duyệt lần thứ hai",
              "5 of 10, because the second browser profile shared the first one's cache|||5/10, vì hồ sơ trình duyệt thứ hai dùng chung cache với hồ sơ thứ nhất",
              "2 of 10 — one per browser, the rest followed from the browser's cache|||2/10 — mỗi trình duyệt một lần, còn lại đi từ cache của trình duyệt",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: Lesson 11.3. RFC 9110 makes 301 heuristically cacheable; 302 is not, and with 302 the server counted 10 of 10. Each browser profile has its own cache, which is why the count was 2, not 1.|||VI: Bài 11.3. RFC 9110 cho 301 là heuristically cacheable; 302 thì không, và với 302 server đếm đủ 10/10. Mỗi hồ sơ trình duyệt có cache riêng, nên đếm được 2 chứ không phải 1.",
          },
          {
            question: "Counting clicks with one UPDATE per redirect on a local PostgreSQL row versus appending to a Redis Stream. What did the load test show?|||Đếm lượt bấm bằng một câu UPDATE mỗi lần chuyển hướng trên một dòng PostgreSQL cục bộ so với thêm vào Redis Stream. Test tải cho thấy gì?",
            options: [
              "UPDATE cost 21–39% of throughput and is one hot row; the stream append cost much less (0–12%)|||UPDATE tốn 21–39% thông lượng và là một dòng nóng; thêm vào stream tốn ít hơn hẳn (0–12%)",
              "UPDATE was ten times slower and lost increments under 50 concurrent connections|||UPDATE chậm gấp mười lần và đánh mất lượt cộng dưới 50 kết nối đồng thời",
              "Both were equally fast because PostgreSQL ran on the same laptop as the API|||Cả hai nhanh như nhau vì PostgreSQL chạy cùng laptop với API",
              "The stream was slower, because every XADD waits for a worker to aggregate it|||Stream chậm hơn, vì mỗi lệnh XADD phải chờ worker gộp xong",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: Lesson 11.3. Four runs: memory 10,900–15,100, stream 11,000–13,300, PostgreSQL 7,600–9,800 redirects/s; the database counted every click exactly (101,534 in the last run). At 28 clicks/s even UPDATE works — say so, and keep writes off the hot path anyway.|||VI: Bài 11.3. Bốn lần đo: memory 10.900–15.100, stream 11.000–13.300, PostgreSQL 7.600–9.800 chuyển hướng/s; CSDL đếm chính xác mọi lượt (101.534 ở lần cuối). Ở 28 lượt/s thì UPDATE vẫn chạy — nói thẳng ra, nhưng vẫn giữ thao tác ghi khỏi đường nóng.",
          },
          {
            question: "The official page has 100,000 followers. With fan-out on write, one of its posts cost…|||Trang chính thức có 100.000 người theo dõi. Với fan-out khi ghi, một bài của nó tốn…",
            options: [
              "one ZADD, because Redis copies the post to every timeline internally|||một lệnh ZADD, vì Redis tự chép bài vào mọi timeline bên trong",
              "200,000 Redis commands, about half a second and 7.1 MB of new timeline entries|||200.000 lệnh Redis, khoảng nửa giây và 7,1 MB mục timeline mới",
              "100,000 commands and 16.7 ms, the same as one read of a 1,000-follow feed|||100.000 lệnh và 16,7 ms, bằng một lần đọc feed theo dõi 1.000 tài khoản",
              "nothing until each follower opens the app, because timelines are built lazily|||chưa tốn gì cho tới khi từng người theo dõi mở app, vì timeline được dựng lười",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: Lesson 11.4. Push = ZADD + trim per follower: 200,000 commands, 465–543 ms, +7.1 MB. That is why the hybrid pulls accounts above a threshold; lazy building at read time is fan-out on read, a different strategy.|||VI: Bài 11.4. Đẩy = ZADD + cắt bớt cho từng người theo dõi: 200.000 lệnh, 465–543 ms, +7,1 MB. Vì thế kiểu lai kéo các tài khoản vượt ngưỡng; dựng lười lúc đọc là fan-out khi đọc, một chiến lược khác.",
          },
          {
            question: "Page 1 of a feed is loaded, one new post arrives, page 2 is loaded with offset=10. What happened in the measurement?|||Tải trang 1 của feed, một bài mới tới, tải trang 2 với offset=10. Phép đo cho thấy gì?",
            options: [
              "Page 2 skipped one post, because the new post pushed it into page 1|||Trang 2 bỏ sót một bài, vì bài mới đẩy nó lên trang 1",
              "Nothing changed, because Redis sorted sets are ordered by score|||Không có gì thay đổi, vì sorted set của Redis sắp theo điểm",
              "Post 1000021 appeared on both pages; the cursor “older than 1000021” repeated nothing|||Bài 1000021 xuất hiện ở cả hai trang; cursor “cũ hơn 1000021” không lặp bài nào",
              "Page 2 returned an error, because the offset no longer matched the set size|||Trang 2 báo lỗi, vì offset không còn khớp kích thước tập",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: Lesson 11.4 (and 3.2). New items shift every offset by one, so the last item of page 1 comes back; a cursor anchored to an item is immune. Skipping happens when items are deleted, not added at the top.|||VI: Bài 11.4 (và 3.2). Mục mới đẩy mọi offset xuống một bậc, nên mục cuối trang 1 quay lại; cursor neo vào một mục thì miễn nhiễm. Bỏ sót xảy ra khi có mục bị xoá, không phải khi thêm ở đầu.",
          },
          {
            question: "200 chat messages, every fourth response lost after the message was stored, the client retries. What did deduplication by clientMessageId change?|||200 tin chat, cứ phản hồi thứ tư thì mất sau khi tin đã lưu, client gửi lại. Chống trùng bằng clientMessageId thay đổi điều gì?",
            options: [
              "Nothing — TCP already guarantees that each message is delivered once|||Không gì — TCP đã đảm bảo mỗi tin được giao một lần",
              "It reduced the retries from 66 to 0, because the server answered faster|||Nó giảm số lần gửi lại từ 66 xuống 0, vì server trả lời nhanh hơn",
              "It prevented duplicates only for the laptop, whose clock was correct|||Nó chỉ chặn trùng cho laptop, máy có đồng hồ đúng",
              "Duplicates went from 66 of 200 to 0; retries were answered 200 with Idempotent-Replayed|||Tin trùng từ 66/200 xuống 0; lần gửi lại nhận 200 kèm Idempotent-Replayed",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: Lesson 11.5. Retries still happened (50 lost responses) — the network did not change; the server's memory of (conversation, clientMessageId) turned them into replays. TCP cannot know whether a response reached the app.|||VI: Bài 11.5. Vẫn có gửi lại (50 phản hồi bị mất) — mạng không đổi; trí nhớ của server về (cuộc trò chuyện, clientMessageId) biến chúng thành lần phát lại. TCP không biết response có tới app hay không.",
          },
          {
            question: "Fifty handlers book lab 1, 14:00–16:00, at once with “SELECT overlap, then INSERT” in Read Committed. How many bookings were stored?|||Năm mươi handler cùng đặt phòng lab 1, 14:00–16:00 bằng “SELECT chồng lịch rồi INSERT” ở mức Read Committed. Bao nhiêu lượt đặt được lưu?",
            options: [
              "1 — the transaction makes the check and the insert atomic|||1 — transaction làm bước kiểm và bước chèn thành nguyên tử",
              "50 in each of three runs; a lab-row lock, SERIALIZABLE or an exclusion constraint gave 1|||50 ở cả ba lần chạy; khoá dòng phòng, SERIALIZABLE hay ràng buộc loại trừ đều cho 1",
              "about 25 — half of the handlers saw the other half's uncommitted rows|||khoảng 25 — một nửa handler thấy dòng chưa commit của nửa kia",
              "0 — PostgreSQL detects the conflict and rolls every transaction back|||0 — PostgreSQL phát hiện xung đột và huỷ mọi transaction",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: Lesson 11.6. A transaction alone does not make check-then-insert safe: each SELECT sees only rows committed before it began. The database must enforce the rule — EXCLUDE USING gist gave 1 booking and 49 × 23P01 ⇒ 409.|||VI: Bài 11.6. Transaction một mình không làm kiểm-rồi-chèn an toàn: mỗi SELECT chỉ thấy dòng đã commit trước khi nó bắt đầu. CSDL phải giữ luật — EXCLUDE USING gist cho 1 lượt đặt và 49 × 23P01 ⇒ 409.",
          },
          {
            question: "An's hold expired 0.5 s ago, but Bình's insert for the same slot fails with 23P01. What is the fix the lesson measured?|||Chỗ giữ của An đã hết hạn 0,5 s, nhưng lệnh chèn của Bình cho cùng khung giờ vẫn lỗi 23P01. Cách sửa bài học đã đo là gì?",
            options: [
              "Add now() to the constraint's WHERE so expired holds stop counting|||Thêm now() vào WHERE của ràng buộc để chỗ giữ hết hạn thôi được tính",
              "Run a cron job every minute that deletes expired holds|||Chạy cron mỗi phút để xoá chỗ giữ hết hạn",
              "In the inserting transaction, mark that lab's expired holds EXPIRED, then insert|||Trong transaction chèn, đánh dấu EXPIRED các chỗ giữ đã hết hạn của phòng đó, rồi chèn",
              "Retry Bình's insert with exponential backoff until the hold disappears|||Thử lại lệnh chèn của Bình với lùi dần cho tới khi chỗ giữ biến mất",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: Lesson 11.6. now() is not allowed in an index predicate, so the constraint cannot see time. A sweeper may help but correctness must not depend on its timing; retrying waits for nothing — the hold never disappears by itself.|||VI: Bài 11.6. now() không được dùng trong điều kiện của chỉ mục, nên ràng buộc không nhìn được thời gian. Tiến trình quét có thể giúp nhưng sự đúng đắn không được phụ thuộc vào giờ nó chạy; thử lại thì chờ vô ích — chỗ giữ không tự biến mất.",
          },
        ],
      },
    },
  ],
};
