/**
 * 4.6 — Tìm truy vấn chậm: profiler, log truy vấn chậm, currentOp (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s04-6-cham'] (MongoDB 8.0.38 trong mgo-lab, ch4.don có _id + khach_1; container phụ mgo-maxt --network none
 * --auth, xoá cuối kịch bản).
 * Số đối chiếu: profiler slowms 50 ghi 3 thao tác COLLSCAN (getmore 865.725 tài liệu / 753 trả về; countDocuments 1.000.000; updateMany
 * 1.000.000 sửa 1684); log "Slow query" có planSummary/docsExamined/filter; $where sleep bị killOp ⇒ "operation was interrupted";
 * maxTimeMS 50 ⇒ MaxTimeMSExpired (50); defaultMaxTimeMS bị BỎ QUA trên lab không xác thực, có hiệu lực với người dùng readWrite trên mgo-maxt
 * (--auth) còn root (quyền bypassDefaultMaxTimeMS) chạy xong; notablescan ⇒ NoQueryExecutionPlans; regex ^KH0123 198 khoá, /0123/ và /^kh0123/i
 * 1.000.000 khoá; đoạn lõi regex Cloudflare 2019 trên PCRE2: vài ms. ms đổi theo lần chạy.
 */
import { lenh, nguon, kv, lienKet } from '../_chung.mjs';

export default {
  title: '4.6 — Finding slow queries: profiler, slow query log, currentOp|||4.6 — Tìm truy vấn chậm: profiler, log truy vấn chậm, currentOp',
  slug: 'mgo-4-6-truy-van-cham',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Quy trình điều tra "hệ thống chậm" trên MongoDB thật: profiler ghi thao tác chậm vào system.profile và gom theo hình dạng; log "Slow query" của mongod (có cả khi không bật profiler); currentOp tìm truy vấn $where đang treo máy và killOp; maxTimeMS cho từng truy vấn và defaultMaxTimeMS của MongoDB 8.0 (bị bỏ qua khi không bật xác thực — đo thật); notablescan cho môi trường dev; regex từ ô tìm kiếm quét cả 1.000.000 khoá; góc sự cố: Cloudflare 02/07/2019 sập 27 phút vì một regex.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.6</span>
<h2>Finding slow queries: profiler, slow query log, currentOp</h2>
<p class="lead">Lessons 4.1–4.5 started from a query you already suspected. In production nobody hands you the query — you get "the system is slow since this morning". This lesson is the investigation toolkit: how MongoDB records slow operations, how to see what is running right now and stop it, and how to set limits so one bad query cannot take the server down. It ends with a real outage caused by a single regular expression.</p>

<h3>An everyday picture: the dashcam, the traffic camera and the traffic police</h3>
<p>The <em>slow query log</em> is a dashcam that is always on and keeps only the bad moments. The <em>profiler</em> is a traffic camera you install on one road for a while to record every slow car in detail. <code>currentOp</code> is looking out of the window right now to see which truck is blocking the street — and <code>killOp</code> is the police officer who tows it.</p>

<h3>The profiler: slow operations into system.profile</h3>
${lenh('s04-6-cham', 0)}
<p>Level 1 records every operation slower than <code>slowms</code> (here 50 ms) into the capped collection <code>system.profile</code> of that database. Level 2 records everything — useful for a few minutes on a test server, never on a busy production server, because writing a profile document for every operation is itself load. Now run the application's usual traffic (here four statements) and read what was caught:</p>
${lenh('s04-6-cham', 1)}
<p>Three operations crossed 50 ms; the indexed customer query did not. Each entry carries the filter, the plan summary and the counters you learned in Lesson 4.2. Two details: the <code>find</code> appears as a <code>getmore</code> — the first batch of 101 documents came back fast, and the slow part was fetching the rest, so look at <code>originatingCommand</code> for the filter; and <code>countDocuments</code> appears as a <code>command</code> (it runs as an aggregation with <code>$match</code>). The <code>updateMany</code> is there too: a write without a usable index scans the whole collection while holding write intent — often the worst entry on the list.</p>
${lenh('s04-6-cham', 2)}
<p>In real life the profile collection holds thousands of entries. Group them by shape and sort by total time: the query that runs 10,000 times at 80 ms costs more than the one that runs once at 3 seconds. That ranking is your work list.</p>
${nguon('📘', 'Database Profiler — MongoDB Docs', 'Levels 0/1/2, slowms, sampleRate, system.profile', 'https://www.mongodb.com/docs/manual/tutorial/manage-the-database-profiler/')}

<h3>The slow query log: always on</h3>
${lenh('s04-6-cham', 3)}
<p>Even with the profiler off (level 0), <code>mongod</code> writes a structured JSON log line <code>"msg":"Slow query"</code> for every operation slower than <code>slowms</code> (default 100 ms) — the same fields: namespace, plan summary, keys and documents examined, duration, filter. Because the log is JSON, <code>jq</code> (or your log platform: Loki, ELK, CloudWatch) can filter it by <code>planSummary: COLLSCAN</code> and count by namespace. On managed services (MongoDB Atlas) the same information appears in the Query Profiler and Performance Advisor screens; the fields are those you already read.</p>

<h3>currentOp and killOp: what is running right now</h3>
<p>A query using <code>$where</code> runs JavaScript on the server for every document — here with a <code>sleep(2)</code> to imitate an expensive expression. Started from another client, it would run for over half an hour. Find it and stop it:</p>
${lenh('s04-6-cham', 4)}
${lenh('s04-6-cham', 5)}
${lenh('s04-6-cham', 6)}
<p><code>currentOp</code> filtered on namespace and running time found the operation: its <code>opid</code>, how long it has been running, its plan (COLLSCAN), the filter and the client address — which tells you which application server sent it. <code>killOp</code> asks the server to stop it at the next interruption point; the client received "operation was interrupted". In an incident, this is how you stop the bleeding while you look for the real fix. Be careful what you kill: an index build or a replication operation is not the same as a stray report query.</p>
${nguon('📘', 'db.currentOp() — MongoDB Docs', 'Filter running operations; opid, secs_running, client, killOp', 'https://www.mongodb.com/docs/manual/reference/method/db.currentOp/')}

<h3>Limits: maxTimeMS and defaultMaxTimeMS</h3>
${lenh('s04-6-cham', 7)}
<p><code>maxTimeMS(50)</code> gives one query a time budget; after 50 ms the server stops it with <code>MaxTimeMSExpired</code> (code 50) and frees its resources. Set it in the driver for every query that serves an HTTP request: if the API times out after 2 seconds, there is no point letting the database keep working for 30. MongoDB 8.0 added a cluster-wide default, <code>defaultMaxTimeMS</code>. Watch what happened on the lab server:</p>
${lenh('s04-6-cham', 8)}
${lenh('s04-6-cham', 9)}
${lenh('s04-6-cham', 10)}
<p>The 100 ms default was <strong>ignored</strong>: the query ran for several hundred milliseconds and finished. The documentation lists a privilege action <code>bypassDefaultMaxTimeMS</code> — "all queries run by the user ignore the value of the defaultMaxTimeMS parameter". The lab runs without access control, where every connection can do everything, so every query bypasses it. To see the real behaviour, start a throw-away server with <code>--auth</code>, an administrator (<code>root</code>) and an application user that only has <code>readWrite</code>:</p>
${lenh('s04-6-cham', 11)}
${lenh('s04-6-cham', 12)}
${lenh('s04-6-cham', 13)}
<p>Same query, same 20 ms default: the application user is stopped with <code>MaxTimeMSExpired</code>; <code>root</code> — whose role includes the bypass — runs to completion. Two lessons in one: the default protects you only if your application connects with a least-privilege user (Chapter 9), and a lab without authentication does not behave like production.</p>
${nguon('📘', 'Privilege Actions: bypassDefaultMaxTimeMS — MongoDB Docs', 'New in 8.0: users with this action ignore defaultMaxTimeMS', 'https://www.mongodb.com/docs/manual/reference/privilege-actions/')}

<h3>notablescan: catch missing indexes in development</h3>
${lenh('s04-6-cham', 14)}
<p>With the server parameter <code>notablescan</code>, any query that would need a collection scan fails with <code>NoQueryExecutionPlans</code>. Turn it on in the development or CI database and your integration tests fail the day someone writes a query without an index — months before production data makes it slow. (Do not turn it on in production: admin and maintenance queries legitimately scan.)</p>

<h3>Regex from a search box</h3>
${lenh('s04-6-cham', 15)}
<p>A search box that sends the user's text as a regex: an anchored, case-sensitive prefix (<code>/^KH0123/</code>) becomes a range on the index — 198 keys. An unanchored pattern (<code>/0123/</code>) or a case-insensitive one (<code>/^kh0123/i</code>) cannot use a range: MongoDB still walks the index, but all 1,000,000 keys, testing each — hundreds of milliseconds for every keystroke of every user. Ten users typing in parallel and the server's CPU is gone. Rules: escape user input so it is matched literally, allow only prefix search on indexed fields, require a minimum length, put <code>maxTimeMS</code> on it, and move real search to a search engine (Lesson 4.4).</p>
${nguon('📘', '$regex — MongoDB Docs', 'PCRE2 since 6.1; prefix expressions use index ranges; case-insensitive cannot', 'https://www.mongodb.com/docs/manual/reference/operator/query/regex/')}

<h3>🔥 Real incident: Cloudflare, 2 July 2019</h3>
<p>At 13:42 UTC an engineer deployed a minor change to Cloudflare's web application firewall rules for XSS detection. One rule contained a regular expression with the fragment <code>.*(?:.*=.*)</code>. Cloudflare's post-mortem explains that the WAF used PCRE, which "uses backtracking for matching and has no mechanism to protect against a runaway expression": on certain inputs the regex backtracked enormously, CPUs serving HTTP and HTTPS traffic on every machine worldwide went to nearly 100%, and Cloudflare's core proxy, CDN and WAF were down for <strong>27 minutes</strong>. The rule was deployed globally in seconds, as designed for urgent security fixes — so the bad rule reached every server at once.</p>
${lenh('s04-6-cham', 16)}
<p>We ran the core fragment against an 8,000-character string with no "=" on MongoDB 8.0: a few milliseconds — the PCRE2 version MongoDB embeds did not blow up on this input. That is not a reason to relax. What took Cloudflare down was the combination: an expensive expression evaluated on <em>every request</em>, with no time limit, deployed everywhere at once. In a MongoDB application the equivalents are user-controlled <code>$regex</code> or <code>$where</code> without <code>maxTimeMS</code>, unindexed queries in a hot path, and an index change deployed to production without a canary. The defences are the ones of this lesson: limits per query, least-privilege users so that the default limit applies, slow-query monitoring that alerts within minutes, and the ability to find and kill the culprit.</p>
${nguon('🔥', 'Details of the Cloudflare outage on July 2, 2019 — Cloudflare blog', 'WAF regex backtracking, CPU exhausted worldwide, 27 minutes', 'https://blog.cloudflare.com/details-of-the-cloudflare-outage-on-july-2-2019/')}

<h3>The investigation procedure</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · now</span><span class="lz-t">currentOp: long-running ops, which client?</span><span class="lz-d">killOp if it is clearly a runaway</span></div>
  <div class="lz-step"><span class="lz-k">2 · history</span><span class="lz-t">slow query log / profiler, grouped by shape</span><span class="lz-d">rank by total time, not by worst single run</span></div>
  <div class="lz-step"><span class="lz-k">3 · explain</span><span class="lz-t">the top shapes on a copy of production data</span><span class="lz-d">keys : docs : nReturned, SORT, FETCH filters</span></div>
  <div class="lz-step"><span class="lz-k">4 · fix</span><span class="lz-t">index (ESR), query rewrite, or schema change</span><span class="lz-d">build index off-peak; measure before/after</span></div>
  <div class="lz-step"><span class="lz-k">5 · prevent</span><span class="lz-t">maxTimeMS, notablescan in CI, alert on COLLSCAN</span><span class="lz-d">explain in pull requests</span></div>
</div>
<p>The PostgreSQL course has the same workflow with <code>pg_stat_statements</code> and <code>EXPLAIN (ANALYZE, BUFFERS)</code>:</p>
${lienKet({ cta: 'Open lesson', khoa: 'postgresql', bai: 'postgresql-10-4-buffers-tinh-chinh', title: 'PostgreSQL 10.4 — BUFFERS and a tuning workflow', sub: 'The same investigation, in PostgreSQL' })}

<div class="pitfall co-tieu-de">
<p><strong>Trap — leaving the profiler at level 2, or slowms at 0, "to be safe".</strong> Every operation then writes a profile document or a log line: the investigation tool becomes the load. Use level 1 with a sensible <code>slowms</code> (and <code>sampleRate</code> below 1 on very busy servers), for a limited period, and switch it back to 0 when you are done. The slow query log at the default 100 ms is usually enough for day-to-day monitoring.</p>
</div>

<h3>💼 At work: the incident channel</h3>
<p>When the alert "p95 latency of /orders > 2 s" fires, the incident channel wants three things from the person on database duty within minutes: what is running now (<code>currentOp</code> output, which client), what changed (a deploy? a new report? a data import?), and the top shapes from the slow log in the last hour. Killing a runaway query is often the first action; the index or query fix is the second, and the post-mortem adds the guard that would have prevented it — usually <code>maxTimeMS</code> or a CI check. As a junior, having this procedure written down and practised on the lab is what makes you useful at 3 a.m.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"How do you find slow queries in MongoDB?"</strong> — Slow query log (always on, slowms 100), profiler level 1 into system.profile, Atlas Query Profiler; group by shape and rank by total time.</li>
<li><strong>"A query is hanging the server right now. What do you do?"</strong> — <code>db.currentOp()</code> filtered by running time and namespace, identify the client, <code>killOp(opid)</code>, then explain and fix.</li>
<li><strong>"How do you stop one bad query from consuming the server?"</strong> — <code>maxTimeMS</code> per query, <code>defaultMaxTimeMS</code> (8.0) with least-privilege users, avoid <code>$where</code> and user-controlled regex.</li>
<li><strong>"When is a regex query fast?"</strong> — When it is an anchored, case-sensitive prefix on an indexed field: it becomes an index range.</li>
</ul>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
<li>Set the profiler to level 1 with <code>slowms: 20</code>, run ten different queries on <code>ch4.don</code> (some indexed, some not), then write one aggregation over <code>system.profile</code> that lists the shapes ordered by total milliseconds, with the ratio <code>docsExamined / nreturned</code>.</li>
<li>Start a long <code>$where</code> query in a second terminal. In the first terminal, find it with <code>currentOp</code> using only <code>secs_running</code> and the <code>$where</code> in its filter, and kill it. What does the second terminal print?</li>
<li>Write a Node.js (or Spring) search endpoint that takes <code>q</code> from the user and searches customer codes by prefix safely: escape regex metacharacters, refuse fewer than 3 characters, use <code>maxTimeMS(200)</code>.</li>
</ol>
<details><summary>Suggested answers</summary>
<p>1. <code>db.system.profile.aggregate([{ $group: { _id: { op: '$op', ns: '$ns', plan: '$planSummary' }, n: { $sum: 1 }, ms: { $sum: '$millis' }, docs: { $sum: '$docsExamined' }, tra: { $sum: { $ifNull: ['$nreturned', 0] } } } }, { $set: { tiLe: { $cond: [{ $gt: ['$tra', 0] }, { $round: [{ $divide: ['$docs', '$tra'] }, 1] }, null] } } }, { $sort: { ms: -1 } }])</code>. COLLSCAN shapes come first with ratios in the hundreds or thousands. Set the level back to 0 afterwards.</p>
<p>2. <code>db.currentOp({ secs_running: { $gte: 3 }, 'command.filter.$where': { $exists: true } })</code>, then <code>db.killOp(opid)</code>. The second terminal prints <code>MongoServerError: … operation was interrupted</code>.</p>
<p>3. Node: <code>const s = String(q ?? ''); if (s.length &lt; 3) return res.status(400)…; const safe = s.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&amp;'); col.find({ khach: { $regex: '^' + safe } }).limit(20).maxTimeMS(200)</code>. Anchored + escaped ⇒ an index range; the limit and time budget bound the cost. Chapter 9 adds the other half: making sure <code>q</code> is a string and not an object like <code>{ "$ne": null }</code>.</p>
</details>
<p><strong>Done when:</strong> you can go from "it is slow" to the guilty query shape in minutes, stop a runaway query, and name the guard that prevents it next time.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['slowms', 'Threshold in ms above which an operation is logged (default 100) and, at profiler level 1, profiled.'],
  ['Profiler', 'Records operations into system.profile: level 0 off, 1 slow only, 2 all.'],
  ['Slow query log', 'JSON log lines "Slow query" written by mongod for operations slower than slowms.'],
  ['currentOp / killOp', 'List running operations / ask the server to stop one by opid.'],
  ['maxTimeMS', 'Time budget for one operation; exceeding it ends the operation with MaxTimeMSExpired.'],
  ['defaultMaxTimeMS', 'MongoDB 8.0 cluster parameter: default time limit for reads; bypassed by users with bypassDefaultMaxTimeMS.'],
  ['notablescan', 'Server parameter that makes queries needing a collection scan fail.'],
  ['Prefix expression', 'An anchored, case-sensitive regex like /^abc/ that MongoDB turns into an index range.'],
  ['Backtracking', 'A regex engine trying alternative paths; some patterns explode on some inputs.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>Profiler level 1 + slowms catches slow operations into system.profile; group by shape, rank by total time.</li>
<li>The "Slow query" log line exists even with the profiler off.</li>
<li><code>currentOp</code> finds the runaway operation and its client; <code>killOp</code> stops it.</li>
<li><code>maxTimeMS</code> per query; <code>defaultMaxTimeMS</code> works only for users without the bypass privilege — not on an unauthenticated lab.</li>
<li><code>notablescan</code> in dev/CI catches missing indexes early.</li>
<li>Only anchored, case-sensitive regex uses an index range; Cloudflare 2019 shows what one expensive expression on every request can do.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.6</span>
<h2>Tìm truy vấn chậm: profiler, log truy vấn chậm, currentOp</h2>
<p class="lead">Các Bài 4.1–4.5 bắt đầu từ một truy vấn bạn đã nghi ngờ sẵn. Ở production chẳng ai đưa sẵn truy vấn cho bạn — bạn chỉ nhận được "hệ thống chậm từ sáng nay". Bài này là bộ đồ nghề điều tra: MongoDB ghi lại thao tác chậm thế nào, xem thứ đang chạy ngay lúc này và dừng nó ra sao, và đặt giới hạn thế nào để một truy vấn tồi không làm sập máy chủ. Bài kết thúc bằng một vụ sập thật do đúng một biểu thức chính quy gây ra.</p>

<h3>Hình ảnh đời thường: camera hành trình, camera giao thông và cảnh sát giao thông</h3>
<p><em>Log truy vấn chậm</em> là camera hành trình lúc nào cũng bật và chỉ giữ lại những khoảnh khắc tệ. <em>Profiler</em> là camera giao thông bạn lắp trên một con đường trong một thời gian để ghi chi tiết mọi chiếc xe chạy chậm. <code>currentOp</code> là nhìn ra cửa sổ ngay lúc này xem chiếc xe tải nào đang chắn đường — còn <code>killOp</code> là anh cảnh sát cho xe cẩu kéo nó đi.</p>

<h3>Profiler: thao tác chậm vào system.profile</h3>
${lenh('s04-6-cham', 0)}
<p>Mức 1 ghi mọi thao tác chậm hơn <code>slowms</code> (ở đây 50 ms) vào collection có giới hạn cỡ <code>system.profile</code> của database đó. Mức 2 ghi tất cả — có ích trong vài phút trên máy chủ thử, không bao giờ dùng trên máy chủ production đang bận, vì việc ghi một tài liệu profile cho mỗi thao tác tự nó đã là tải. Giờ chạy lưu lượng thường ngày của ứng dụng (ở đây bốn câu lệnh) rồi đọc xem bắt được gì:</p>
${lenh('s04-6-cham', 1)}
<p>Ba thao tác vượt 50 ms; truy vấn theo khách có index thì không. Mỗi mục mang theo bộ lọc, tóm tắt kế hoạch và các bộ đếm bạn đã học ở Bài 4.2. Hai chi tiết: lệnh <code>find</code> hiện ra dưới dạng <code>getmore</code> — lô đầu 101 tài liệu trả về nhanh, phần chậm là lấy phần còn lại, nên hãy xem <code>originatingCommand</code> để thấy bộ lọc; còn <code>countDocuments</code> hiện ra là <code>command</code> (nó chạy như một aggregation có <code>$match</code>). Lệnh <code>updateMany</code> cũng có mặt: một lệnh ghi không có index dùng được sẽ quét cả collection trong khi giữ ý định ghi — thường là mục tệ nhất trong danh sách.</p>
${lenh('s04-6-cham', 2)}
<p>Ngoài đời, collection profile chứa hàng nghìn mục. Hãy gom chúng theo hình dạng và xếp theo tổng thời gian: truy vấn chạy 10.000 lần mỗi lần 80 ms tốn hơn truy vấn chạy một lần 3 giây. Bảng xếp hạng đó là danh sách việc của bạn.</p>
${nguon('📘', 'Database Profiler — MongoDB Docs', 'Mức 0/1/2, slowms, sampleRate, system.profile', 'https://www.mongodb.com/docs/manual/tutorial/manage-the-database-profiler/')}

<h3>Log truy vấn chậm: luôn bật</h3>
${lenh('s04-6-cham', 3)}
<p>Kể cả khi tắt profiler (mức 0), <code>mongod</code> vẫn ghi một dòng log JSON có cấu trúc <code>"msg":"Slow query"</code> cho mọi thao tác chậm hơn <code>slowms</code> (mặc định 100 ms) — cùng các trường: namespace, tóm tắt kế hoạch, số khoá và tài liệu đã xét, thời gian, bộ lọc. Vì log là JSON, <code>jq</code> (hoặc nền tảng log của bạn: Loki, ELK, CloudWatch) lọc được theo <code>planSummary: COLLSCAN</code> và đếm theo namespace. Trên dịch vụ được quản lý (MongoDB Atlas), cùng thông tin đó hiện ở màn hình Query Profiler và Performance Advisor; các trường chính là những thứ bạn đã đọc.</p>

<h3>currentOp và killOp: thứ gì đang chạy ngay lúc này</h3>
<p>Một truy vấn dùng <code>$where</code> chạy JavaScript trên máy chủ cho từng tài liệu — ở đây có <code>sleep(2)</code> để giả lập một biểu thức đắt. Khởi chạy từ một client khác, nó sẽ chạy hơn nửa tiếng. Tìm nó và dừng nó:</p>
${lenh('s04-6-cham', 4)}
${lenh('s04-6-cham', 5)}
${lenh('s04-6-cham', 6)}
<p><code>currentOp</code> lọc theo namespace và thời gian chạy đã tìm ra thao tác: <code>opid</code>, chạy được bao lâu, kế hoạch (COLLSCAN), bộ lọc và địa chỉ client — cho bạn biết máy chủ ứng dụng nào đã gửi nó. <code>killOp</code> yêu cầu máy chủ dừng nó ở điểm ngắt kế tiếp; client nhận "operation was interrupted". Trong một sự cố, đây là cách cầm máu trong lúc bạn tìm cách sửa thật. Cẩn thận với thứ bạn giết: một lần dựng index hay một thao tác nhân bản khác hẳn một truy vấn báo cáo đi lạc.</p>
${nguon('📘', 'db.currentOp() — MongoDB Docs', 'Lọc thao tác đang chạy; opid, secs_running, client, killOp', 'https://www.mongodb.com/docs/manual/reference/method/db.currentOp/')}

<h3>Giới hạn: maxTimeMS và defaultMaxTimeMS</h3>
${lenh('s04-6-cham', 7)}
<p><code>maxTimeMS(50)</code> cho một truy vấn một ngân sách thời gian; quá 50 ms, máy chủ dừng nó với <code>MaxTimeMSExpired</code> (mã 50) và giải phóng tài nguyên. Hãy đặt nó trong driver cho mọi truy vấn phục vụ một lượt gọi HTTP: nếu API hết giờ sau 2 giây, chẳng có lý gì để cơ sở dữ liệu làm tiếp thêm 30 giây. MongoDB 8.0 thêm giá trị mặc định cho cả cụm, <code>defaultMaxTimeMS</code>. Xem chuyện gì xảy ra trên máy chủ lab:</p>
${lenh('s04-6-cham', 8)}
${lenh('s04-6-cham', 9)}
${lenh('s04-6-cham', 10)}
<p>Mặc định 100 ms bị <strong>bỏ qua</strong>: truy vấn chạy mấy trăm mili giây và vẫn xong. Tài liệu liệt kê một quyền <code>bypassDefaultMaxTimeMS</code> — "mọi truy vấn của người dùng này bỏ qua giá trị defaultMaxTimeMS". Lab chạy không bật kiểm soát truy cập, nơi mọi kết nối làm được mọi thứ, nên truy vấn nào cũng vượt qua nó. Để thấy hành vi thật, dựng một máy chủ dùng xong bỏ có <code>--auth</code>, một quản trị viên (<code>root</code>) và một người dùng ứng dụng chỉ có <code>readWrite</code>:</p>
${lenh('s04-6-cham', 11)}
${lenh('s04-6-cham', 12)}
${lenh('s04-6-cham', 13)}
<p>Cùng truy vấn, cùng mặc định 20 ms: người dùng ứng dụng bị dừng với <code>MaxTimeMSExpired</code>; <code>root</code> — có vai trò bao gồm quyền vượt — chạy tới cùng. Hai bài học trong một: giá trị mặc định chỉ bảo vệ bạn nếu ứng dụng kết nối bằng người dùng có quyền tối thiểu (Chương 9), và một lab không xác thực không cư xử giống production.</p>
${nguon('📘', 'Privilege Actions: bypassDefaultMaxTimeMS — MongoDB Docs', 'Mới ở 8.0: người dùng có quyền này bỏ qua defaultMaxTimeMS', 'https://www.mongodb.com/docs/manual/reference/privilege-actions/')}

<h3>notablescan: bắt index thiếu ngay khi phát triển</h3>
${lenh('s04-6-cham', 14)}
<p>Với tham số máy chủ <code>notablescan</code>, truy vấn nào cần quét cả collection đều lỗi <code>NoQueryExecutionPlans</code>. Bật nó ở database phát triển hay CI là test tích hợp của bạn hỏng ngay hôm có người viết truy vấn không có index — vài tháng trước khi dữ liệu production làm nó chậm. (Đừng bật ở production: các truy vấn quản trị và bảo trì quét là chuyện bình thường.)</p>

<h3>Regex từ ô tìm kiếm</h3>
${lenh('s04-6-cham', 15)}
<p>Một ô tìm kiếm gửi chữ người dùng gõ dưới dạng regex: tiền tố có neo đầu chuỗi và phân biệt hoa thường (<code>/^KH0123/</code>) biến thành một khoảng trên index — 198 khoá. Mẫu không neo (<code>/0123/</code>) hay mẫu không phân biệt hoa thường (<code>/^kh0123/i</code>) không dùng được khoảng: MongoDB vẫn đi trên index, nhưng qua cả 1.000.000 khoá, thử từng khoá — hàng trăm mili giây cho mỗi lần gõ phím của mỗi người dùng. Mười người gõ cùng lúc là CPU máy chủ cạn. Luật: thoát ký tự đặc biệt trong chữ người dùng để so khớp nguyên văn, chỉ cho tìm theo tiền tố trên trường có index, đòi độ dài tối thiểu, gắn <code>maxTimeMS</code>, và chuyển tìm kiếm thật sang công cụ tìm kiếm (Bài 4.4).</p>
${nguon('📘', '$regex — MongoDB Docs', 'PCRE2 từ 6.1; biểu thức tiền tố dùng khoảng index; không phân biệt hoa thường thì không', 'https://www.mongodb.com/docs/manual/reference/operator/query/regex/')}

<h3>🔥 Sự cố thật: Cloudflare, ngày 02/07/2019</h3>
<p>Lúc 13:42 giờ UTC, một kỹ sư triển khai một thay đổi nhỏ cho bộ luật tường lửa ứng dụng web (WAF) của Cloudflare để phát hiện XSS. Một luật chứa biểu thức chính quy có đoạn <code>.*(?:.*=.*)</code>. Bản phân tích sau sự cố của Cloudflare giải thích rằng WAF dùng PCRE, thứ "dùng quay lui khi so khớp và không có cơ chế nào chống lại một biểu thức chạy mất kiểm soát": với một số đầu vào, regex quay lui khủng khiếp, CPU phục vụ lưu lượng HTTP và HTTPS trên mọi máy khắp thế giới lên gần 100%, và lõi proxy, CDN cùng WAF của Cloudflare ngừng hoạt động <strong>27 phút</strong>. Luật được triển khai toàn cầu trong vài giây, đúng như thiết kế dành cho các bản vá bảo mật khẩn — nên luật hỏng tới mọi máy chủ cùng một lúc.</p>
${lenh('s04-6-cham', 16)}
<p>Chúng tôi chạy đoạn lõi đó trên một chuỗi 8.000 ký tự không có dấu "=" trong MongoDB 8.0: vài mili giây — bản PCRE2 mà MongoDB nhúng không bùng nổ với đầu vào này. Đó không phải lý do để lơi lỏng. Thứ đánh sập Cloudflare là sự kết hợp: một biểu thức đắt được tính ở <em>mọi lượt gọi</em>, không giới hạn thời gian, triển khai khắp nơi cùng lúc. Trong một ứng dụng MongoDB, bản tương đương là <code>$regex</code> hay <code>$where</code> do người dùng điều khiển mà không có <code>maxTimeMS</code>, truy vấn không index trên đường nóng, và thay đổi index đưa thẳng lên production không qua thử nghiệm từng phần. Cách phòng là những thứ của bài này: giới hạn cho từng truy vấn, người dùng quyền tối thiểu để giới hạn mặc định có hiệu lực, theo dõi truy vấn chậm có cảnh báo trong vài phút, và khả năng tìm ra rồi giết thủ phạm.</p>
${nguon('🔥', 'Details of the Cloudflare outage on July 2, 2019 — Cloudflare blog', 'Regex của WAF quay lui, CPU cạn khắp thế giới, 27 phút', 'https://blog.cloudflare.com/details-of-the-cloudflare-outage-on-july-2-2019/')}

<h3>Quy trình điều tra</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · bây giờ</span><span class="lz-t">currentOp: thao tác chạy lâu, client nào?</span><span class="lz-d">killOp nếu rõ ràng là chạy mất kiểm soát</span></div>
  <div class="lz-step"><span class="lz-k">2 · lịch sử</span><span class="lz-t">log truy vấn chậm / profiler, gom theo hình dạng</span><span class="lz-d">xếp theo tổng thời gian, không theo lần tệ nhất</span></div>
  <div class="lz-step"><span class="lz-k">3 · explain</span><span class="lz-t">các hình dạng đứng đầu, trên bản sao dữ liệu production</span><span class="lz-d">khoá : tài liệu : nReturned, SORT, filter trên FETCH</span></div>
  <div class="lz-step"><span class="lz-k">4 · sửa</span><span class="lz-t">index (ESR), viết lại truy vấn, hoặc đổi schema</span><span class="lz-d">dựng index ngoài giờ cao điểm; đo trước/sau</span></div>
  <div class="lz-step"><span class="lz-k">5 · phòng</span><span class="lz-t">maxTimeMS, notablescan trong CI, cảnh báo khi có COLLSCAN</span><span class="lz-d">explain trong pull request</span></div>
</div>
<p>Khoá PostgreSQL có cùng quy trình với <code>pg_stat_statements</code> và <code>EXPLAIN (ANALYZE, BUFFERS)</code>:</p>
${lienKet({ khoa: 'postgresql', bai: 'postgresql-10-4-buffers-tinh-chinh', title: 'PostgreSQL 10.4 — BUFFERS và quy trình tinh chỉnh', sub: 'Cùng cuộc điều tra, trên PostgreSQL' })}

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — để profiler ở mức 2, hoặc slowms bằng 0, "cho chắc".</strong> Khi đó thao tác nào cũng ghi một tài liệu profile hoặc một dòng log: công cụ điều tra thành ra là tải. Hãy dùng mức 1 với <code>slowms</code> hợp lý (và <code>sampleRate</code> dưới 1 trên máy chủ rất bận), trong một khoảng thời gian có hạn, rồi đưa về 0 khi xong. Log truy vấn chậm ở mức mặc định 100 ms thường đủ cho việc theo dõi hằng ngày.</p>
</div>

<h3>💼 Đi làm: kênh xử lý sự cố</h3>
<p>Khi cảnh báo "độ trễ p95 của /orders > 2 giây" nổ, kênh xử lý sự cố cần người trực cơ sở dữ liệu đưa ra ba thứ trong vài phút: thứ đang chạy lúc này (output <code>currentOp</code>, client nào), thứ đã thay đổi (vừa triển khai? báo cáo mới? nhập dữ liệu?), và các hình dạng đứng đầu trong log chậm của giờ vừa qua. Giết một truy vấn chạy mất kiểm soát thường là hành động đầu tiên; sửa index hay truy vấn là thứ hai, và bản phân tích sau sự cố thêm cái chốt chặn lẽ ra đã ngăn được nó — thường là <code>maxTimeMS</code> hoặc một bước kiểm trong CI. Là junior, có sẵn quy trình này trên giấy và đã tập trên lab chính là thứ làm bạn hữu ích lúc 3 giờ sáng.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><strong>"Bạn tìm truy vấn chậm trong MongoDB thế nào?"</strong> — Log truy vấn chậm (luôn bật, slowms 100), profiler mức 1 vào system.profile, Query Profiler của Atlas; gom theo hình dạng và xếp theo tổng thời gian.</li>
<li><strong>"Một truy vấn đang làm treo máy chủ ngay lúc này. Bạn làm gì?"</strong> — <code>db.currentOp()</code> lọc theo thời gian chạy và namespace, xác định client, <code>killOp(opid)</code>, rồi explain và sửa.</li>
<li><strong>"Làm sao ngăn một truy vấn tồi ngốn hết máy chủ?"</strong> — <code>maxTimeMS</code> cho từng truy vấn, <code>defaultMaxTimeMS</code> (8.0) kèm người dùng quyền tối thiểu, tránh <code>$where</code> và regex do người dùng điều khiển.</li>
<li><strong>"Khi nào truy vấn regex nhanh?"</strong> — Khi nó là tiền tố có neo, phân biệt hoa thường, trên trường có index: nó trở thành một khoảng index.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Đặt profiler mức 1 với <code>slowms: 20</code>, chạy mười truy vấn khác nhau trên <code>ch4.don</code> (vài cái có index, vài cái không), rồi viết một aggregation trên <code>system.profile</code> liệt kê các hình dạng xếp theo tổng mili giây, kèm tỉ lệ <code>docsExamined / nreturned</code>.</li>
<li>Chạy một truy vấn <code>$where</code> dài ở terminal thứ hai. Ở terminal thứ nhất, tìm nó bằng <code>currentOp</code> chỉ dựa vào <code>secs_running</code> và <code>$where</code> trong bộ lọc, rồi giết nó. Terminal thứ hai in ra gì?</li>
<li>Viết một endpoint tìm kiếm bằng Node.js (hoặc Spring) nhận <code>q</code> từ người dùng và tìm mã khách theo tiền tố một cách an toàn: thoát ký tự đặc biệt của regex, từ chối dưới 3 ký tự, dùng <code>maxTimeMS(200)</code>.</li>
</ol>
<details><summary>Gợi ý đáp án</summary>
<p>1. <code>db.system.profile.aggregate([{ $group: { _id: { op: '$op', ns: '$ns', plan: '$planSummary' }, n: { $sum: 1 }, ms: { $sum: '$millis' }, docs: { $sum: '$docsExamined' }, tra: { $sum: { $ifNull: ['$nreturned', 0] } } } }, { $set: { tiLe: { $cond: [{ $gt: ['$tra', 0] }, { $round: [{ $divide: ['$docs', '$tra'] }, 1] }, null] } } }, { $sort: { ms: -1 } }])</code>. Các hình dạng COLLSCAN đứng đầu với tỉ lệ hàng trăm, hàng nghìn. Xong thì đặt mức về 0.</p>
<p>2. <code>db.currentOp({ secs_running: { $gte: 3 }, 'command.filter.$where': { $exists: true } })</code>, rồi <code>db.killOp(opid)</code>. Terminal thứ hai in <code>MongoServerError: … operation was interrupted</code>.</p>
<p>3. Node: <code>const s = String(q ?? ''); if (s.length &lt; 3) return res.status(400)…; const safe = s.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&amp;'); col.find({ khach: { $regex: '^' + safe } }).limit(20).maxTimeMS(200)</code>. Có neo + đã thoát ⇒ một khoảng index; giới hạn số dòng và ngân sách thời gian chặn cái giá. Chương 9 thêm nửa còn lại: bảo đảm <code>q</code> là chuỗi chứ không phải một object kiểu <code>{ "$ne": null }</code>.</p>
</details>
<p><strong>Xong khi:</strong> bạn đi được từ "nó chậm" tới hình dạng truy vấn có tội trong vài phút, dừng được một truy vấn chạy mất kiểm soát, và gọi tên được cái chốt chặn ngăn nó lần sau.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['slowms', 'Ngưỡng mili giây mà thao tác chậm hơn sẽ được ghi log (mặc định 100) và, ở profiler mức 1, được ghi profile.'],
  ['Profiler', 'Ghi thao tác vào system.profile: mức 0 tắt, 1 chỉ thao tác chậm, 2 tất cả.'],
  ['Log truy vấn chậm', 'Dòng log JSON "Slow query" mongod ghi cho thao tác chậm hơn slowms.'],
  ['currentOp / killOp', 'Liệt kê thao tác đang chạy / yêu cầu máy chủ dừng một thao tác theo opid.'],
  ['maxTimeMS', 'Ngân sách thời gian cho một thao tác; vượt thì thao tác kết thúc với MaxTimeMSExpired.'],
  ['defaultMaxTimeMS', 'Tham số cụm của MongoDB 8.0: giới hạn thời gian mặc định cho lệnh đọc; người dùng có bypassDefaultMaxTimeMS được bỏ qua.'],
  ['notablescan', 'Tham số máy chủ khiến truy vấn cần quét cả collection bị lỗi.'],
  ['Biểu thức tiền tố', 'Regex có neo, phân biệt hoa thường như /^abc/ mà MongoDB biến thành một khoảng index.'],
  ['Quay lui (backtracking)', 'Bộ máy regex thử các đường khác nhau; vài mẫu bùng nổ với vài đầu vào.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Profiler mức 1 + slowms bắt thao tác chậm vào system.profile; gom theo hình dạng, xếp theo tổng thời gian.</li>
<li>Dòng log "Slow query" có cả khi tắt profiler.</li>
<li><code>currentOp</code> tìm ra thao tác chạy mất kiểm soát và client của nó; <code>killOp</code> dừng nó.</li>
<li><code>maxTimeMS</code> cho từng truy vấn; <code>defaultMaxTimeMS</code> chỉ có hiệu lực với người dùng không có quyền vượt — không có hiệu lực trên lab không xác thực.</li>
<li><code>notablescan</code> ở dev/CI bắt index thiếu từ sớm.</li>
<li>Chỉ regex có neo, phân biệt hoa thường mới dùng khoảng index; Cloudflare 2019 cho thấy một biểu thức đắt ở mọi lượt gọi làm được gì.</li>
</ul>
</div>
`,
};
