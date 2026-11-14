import G10_1 from './giang/sio-10-1.mjs';
import G10_2 from './giang/sio-10-2.mjs';
import G10_3 from './giang/sio-10-3.mjs';
import G10_4 from './giang/sio-10-4.mjs';
import G10_5 from './giang/sio-10-5.mjs';
const REF = '?ref=%2Fcourses%2Fsocket-io%2Flearn&reflabel=Socket.IO';

export default {
  title: 'Chapter 10 — Diagnosis cookbook|||Chương 10 — Sách công thức chẩn đoán',
  slug: 'io-ch10-chan-doan',
  description: 'Sáu bài đi qua &quot;realtime bug&quot; theo cây quyết định thay vì reflex thêm log. Mỗi bài áp cây vào một defect thật.',
  sortOrder: 11,
  lessons: [

    {
      title: '10.1 — The decision tree|||10.1 — Cây quyết định',
      slug: 'io-10-1-cay',
      type: 'VIDEO',
      description: 'Bốn câu: (1) client connected? (2) event on the wire? (3) handler running? (4) side effect happened? Không câu nào là &quot;thêm console.log&quot;.',
      content: `
${G10_1}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>The decision tree</h2>
<p class="lead">Default reaction to a socket.io bug: sprinkle console.log everywhere. That&#39;s slow and unfocused. This chapter gives a four-question tree that isolates 90% of bugs in minutes.</p>

<h3>The tree</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">Q1</span><span class="lz-t">Client connected?</span><span class="lz-d">Check DevTools Network → WS tab. Is a connection open? If not, the bug is in connect/auth (Chapter 1.4) — nothing below applies.</span></div>
<div class="lz-step"><span class="lz-k">Q2</span><span class="lz-t">Event on the wire?</span><span class="lz-d">DevTools WS Messages tab. Is there a <code>42[&quot;event-name&quot;,...]</code> frame? If not, the bug is on the emit side or in the adapter (Chapter 5). If there IS one but the client does not act on it, the bug is on the receive side.</span></div>
<div class="lz-step"><span class="lz-k">Q3</span><span class="lz-t">Handler running?</span><span class="lz-d">Set a breakpoint or a console.log in the handler. Does it fire? If not, the bug is the event name (a typo) or handler-registration timing (the Chapter 1.1 race). If it DOES, the bug is in the logic inside.</span></div>
<div class="lz-step"><span class="lz-k">Q4</span><span class="lz-t">Side effect happened?</span><span class="lz-d">Check the DB update, the presence Set, room membership. Did state actually change? If not, the bug is in the logic. If it DID and the UI still does not update, the bug is in frontend state management.</span></div>
</div>

<h3>Symptom → where to look</h3>
<div class="out">Symptom                              Start at   Common cause
"client not receiving events"        Q1         auth fail; connect_error
"some events reach, some don't"      Q2         volatile emit; buffer full
"handler doesn't fire"               Q3         event name typo; late registration
"handler runs, no effect"            Q4         DB error; wrong room; state bug
"presence flickers"                  Q3-Q4      no debounce (1.2); ref counting bug (4.3)
"chat message duplicated"            Q3         no dedup (6.3)
"chat message lost"                  Q2         at-most-once (6.1); Redis blip (5.3)
"cluster: some users don't get msg"  Q2         Redis adapter not attached (5.1)
</div>

<div class="callout warn">
<p><strong>Where the &quot;add another console.log&quot; reflex ends up.</strong> You add logs at the emit, at the receive, in the handler, in the effect — 40 lines of logging. Deploy, wait, read the logs — 15 minutes gone. The bug is still in the layer you did not log. The fix: the four questions above catch 90% of bugs in 5 minutes. <em>(The 90% / 5 minutes is an estimate, not a measurement — measured below: a script places each planted bug in about one second.)</em></p>
</div>

<h3>The five lessons that follow walk each branch</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">10.2 — Q1 walkthrough</span><span class="lz-lnote">DevTools Network WS, auth error, transport upgrade</span></div>
<div class="lz-layer"><span class="lz-lname">10.3 — Q2 walkthrough</span><span class="lz-lnote">Wire packet analysis, Chapter 0.3 tables applied</span></div>
<div class="lz-layer"><span class="lz-lname">10.4 — Q3 walkthrough</span><span class="lz-lnote">Event naming, race conditions, handler cleanup</span></div>
<div class="lz-layer"><span class="lz-lname">10.5 — cluster-specific bugs</span><span class="lz-lnote">Redis adapter, sticky sessions, cross-worker fanout</span></div>
<div class="lz-layer"><span class="lz-lname">10.6 — quiz</span><span class="lz-lnote">6 questions, 10 minutes</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — walking the tree strictly in sequence (Q1, then Q2, then …).</strong> If you <em>have already seen the</em> event on the wire (Q2 passes), you do not need Q1. The tree exists so you never SKIP a question, not so you run all four every time.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Four questions (client connected → event on wire → handler running → side effect happened) — each with its own tool (the DevTools WS tab, a breakpoint, a DB check) — catch 90% of realtime bugs in 5 minutes instead of the 15+ the console.log reflex costs.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Write the four questions in order: is the client connected, is the event on the wire, is the handler running, did the side effect happen.</li>
<li>Pair each with its tool: the DevTools WS tab, a breakpoint or log, a DB/state check.</li>
<li>Take one realtime bug you have hit and walk it through the tree, stopping at the first question that fails.</li>
</ol>
<p><strong>Done when:</strong> you can run a bug through the four questions and reach the fault without a console.log scatter.</p></div>

<h3>🔬 Measured: the tree walked by a script</h3>
<p>A small chat (socket.io 4.8.3 + Postgres) with four planted bugs — Nam forgets his token (q1), the server emits to a room built from a misspelled field (q2), Nam listens for <code>chat:new_message</code> (q3), the INSERT is not awaited and the ack goes out first (q4). A script asks Q1–Q4 in order and stops at the first red:</p>
<div class="out">$ node cay.mjs all      # 5 lượt: không lỗi + 4 lỗi gài sẵn · Hà gửi một tin vào thread:42, Nam phải thấy
── lỗi gài: (không) · cây dừng ở đâu cả — mọi câu xanh · 1123 ms
  Q1 ✓ Nam connected, sid Rw3GuP…
  Q2 ✓ khung tới Nam: 2["chat:new-message",{"threadId":42,"text":"xi…
  Q3 ✓ handler 'chat:new-message' chạy 1 lần
  Q4 ✓ SELECT count(*) … = 1
── lỗi gài: q1 · cây dừng ở Q1 · 220 ms
  Q1 ✗ connect_error: "No authentication token provided"
── lỗi gài: q2 · cây dừng ở Q2 · 1024 ms
  Q1 ✓ Nam connected, sid bhg6u2…
  Q2 ✗ 0 khung sự kiện tới Nam (ack của Hà: {"ok":true,"id":6})
── lỗi gài: q3 · cây dừng ở Q3 · 1031 ms
  Q1 ✓ Nam connected, sid 2T4n5m…
  Q2 ✓ khung tới Nam: 2["chat:new-message",{"threadId":42,"text":"xi…
  Q3 ✗ khung 'chat:new-message' tới nhưng handler 'chat:new_message' chạy 0 lần
── lỗi gài: q4 · cây dừng ở Q4 · 1054 ms
  Q1 ✓ Nam connected, sid 6vckPx…
  Q2 ✓ khung tới Nam: 2["chat:new-message",{"threadId":42,"text":"xi…
  Q3 ✓ handler 'chat:new-message' chạy 1 lần
  Q4 ✗ SELECT count(*) … = 0 (ack của Hà vẫn {"ok":true})</div>
<p>Each bug stops at a <strong>different</strong> question, and the evidence printed is the fix. Bug q4 is the dangerous one: the ack says <code>ok</code>, Nam sees the message — and the database has 0 rows (the server only logs <code>UNHANDLED REJECTION</code>, like <code>src/index.ts:882</code> in this repo).</p>
<p>The &quot;turn on every log&quot; reflex for bug q3:</p>
<div class="out">$ DEBUG='socket.io*,engine*' node cay.mjs q3 2&gt; debug.txt      # phản xạ "bật hết log" cho đúng lỗi q3
(xong)
$ wc -l &lt; debug.txt                       # bao nhiêu dòng cho MỘT tin nhắn, hai client
     150
$ grep -c 'chat:new-message' debug.txt    # tên server phát
10
$ grep -c 'chat:new_message' debug.txt    # tên client nghe (gõ sai) — chính là con lỗi
0</div>
<p>DEBUG logs what is sent and received — never the name a client <em>listens for</em>. The typo appears 0 times in ~150 lines.</p>
<p>Five realtime bugs from this repo&#39;s history, each red at one question — 110097d08 at Q1, 0852eb4ed and 82084b1e2 at Q2 (emit into a room nobody is in), 8a87e3298 at Q3 (handler ran twice), 3981e9a00 at Q4 (right event, wrong effect):</p>
<div class="out">$ git show -s --format='%h %ad %s' --date=short 110097d08 0852eb4ed 8a87e3298 82084b1e2 3981e9a00 | cut -c1-118
110097d08 2026-09-17 fix(tin nhắn): app desktop "ngoại tuyến mãi" — socket CHƯA TỪNG nối được lần nào
0852eb4ed 2026-08-21 fix(call): gọi người KHÔNG online thì im lặng đổ chuông vào hư không
8a87e3298 2026-10-15 fix(messages): một người một hội thoại với admin + mỗi sự kiện socket chỉ tới một lần
82084b1e2 2026-11-13 fix(realtime): không bao giờ gắn Redis adapter MUỘN (Redis tắt lúc khởi động ⇒ getRedis thử mãi, 
3981e9a00 2026-11-13 fix(messenger): người bị chặn giữa phiên không còn nhận "đã offline" (lọc lại audience lúc ngắt —</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash"><span class="tok-comment"># lab c10: may10.mjs = chat nhỏ (socket.io 4.8.3 + Postgres), mọi socket vào user:&lt;id&gt; + thread:42; BUG=q1|q2|q3|q4 gài đúng một lỗi</span>
node cay.mjs all                                        <span class="tok-comment">  # đi cây tự động: Hà gửi một tin, Nam phải thấy — dừng ở câu đỏ đầu tiên</span>
DEBUG='socket.io*,engine*' node cay.mjs q3 2&gt; debug.txt <span class="tok-comment">  # phản xạ "bật hết log" cho lỗi q3</span>
wc -l &lt; debug.txt ; grep -c 'chat:new_message' debug.txt<span class="tok-comment">  # bao nhiêu dòng, tên gõ sai xuất hiện mấy lần</span></code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-11-4-phuong-phap" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking for Developers · 11.4 — A layer-by-layer diagnosis checklist</span><span class="lc-sub">The same idea for the network: stop at the first failing layer</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/observability-monitoring/learn?lessonSlug=obs-1-1-tu-console-toi-json" target="_blank" rel="noopener"><span class="lc-ico">🔭</span><span class="lc-body"><span class="lc-title">Observability · 1.1 — From console.log to a line a machine can read</span><span class="lc-sub">So Q3 and Q4 already have their evidence in the log</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Decision tree</span><span class="v">Four ordered questions that localize a realtime bug.</span></div>
  <div class="kv"><span class="k">Q1 connected</span><span class="v">Is the client actually connected?</span></div>
  <div class="kv"><span class="k">Q2 on the wire</span><span class="v">Is the event present as a frame?</span></div>
  <div class="kv"><span class="k">Q3 handler</span><span class="v">Is the handler running?</span></div>
  <div class="kv"><span class="k">Q4 side effect</span><span class="v">Did the intended effect (DB write, emit) happen?</span></div>
  <div class="kv"><span class="k">console.log reflex</span><span class="v">The scattershot habit this tree replaces.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Four ordered questions localize most realtime bugs.</li><li>Client connected → event on wire → handler running → side effect happened.</li><li>Each question has its own tool: the DevTools WS tab, a breakpoint, a DB check.</li><li>This catches ~90% of realtime bugs in about 5 minutes.</li><li>That beats the 15+ minutes the console.log reflex costs.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Chrome DevTools — WebSocket</span><span class="lc-sub">developer.chrome.com/docs/devtools/network#websocket — tab WS + Messages.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>Cây quyết định</h2>
<p class="lead">Phản ứng mặc định với bug socket.io: rắc console.log khắp nơi. Chậm và không focus. Chương này đưa cây 4 câu tách 90% bug trong vài phút.</p>

<h3>Cây</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">Q1</span><span class="lz-t">Client connected?</span><span class="lz-d">Check DevTools Network → WS tab. Có kết nối open không? Nếu không, bug ở connect/auth (Chương 1.4).</span></div>
<div class="lz-step"><span class="lz-k">Q2</span><span class="lz-t">Event on wire?</span><span class="lz-d">DevTools WS Messages tab. Có frame <code>42[&quot;event-name&quot;,...]</code> không? Nếu không, bug ở emit hoặc adapter. Nếu CÓ nhưng client không nhận, bug ở receive.</span></div>
<div class="lz-step"><span class="lz-k">Q3</span><span class="lz-t">Handler running?</span><span class="lz-d">Set breakpoint hoặc console.log trong handler. Fires? Nếu không, bug ở event name (typo) hoặc handler registration timing.</span></div>
<div class="lz-step"><span class="lz-k">Q4</span><span class="lz-t">Side effect happened?</span><span class="lz-d">Kiểm DB update, presence Set, room membership. Actual state change không? Nếu CÓ nhưng UI không update, bug ở FE state management.</span></div>
</div>

<h3>Bảng triệu chứng → bước tìm</h3>
<div class="out">Symptom                              Start at   Common cause
"client not receiving events"        Q1         auth fail; connect_error
"some events reach, some don't"      Q2         volatile emit; buffer full
"handler doesn't fire"               Q3         event name typo; late registration
"handler runs, no effect"            Q4         DB error; wrong room; state bug
"presence flickers"                  Q3-Q4      no debounce (1.2); ref counting bug (4.3)
"chat message duplicated"            Q3         no dedup (6.3)
"chat message lost"                  Q2         at-most-once (6.1); Redis blip (5.3)
"cluster: some users don't get msg"  Q2         Redis adapter not attached (5.1)
</div>

<div class="callout warn">
<p><strong>Reflex &quot;thêm console.log&quot; kết thúc ở đâu.</strong> Bạn thêm log ở emit, ở receive, ở handler, ở effect — 40 dòng log. Deploy, chờ, đọc log — mất 15 phút. Bug vẫn còn ở tầng bạn không log. Vá: 4 câu trên bắt 90% bug trong 5 phút. <em>(90% / 5 phút là ước lượng, không phải số đo — phần Đo thật bên dưới: một script khoanh mỗi lỗi gài trong khoảng một giây.)</em></p>
</div>

<h3>Năm bài sau đi qua từng nhánh</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">10.2 — Q1 walkthrough</span><span class="lz-lnote">DevTools Network WS, auth error, transport upgrade</span></div>
<div class="lz-layer"><span class="lz-lname">10.3 — Q2 walkthrough</span><span class="lz-lnote">Wire packet analysis, Chương 0.3 tables áp dụng</span></div>
<div class="lz-layer"><span class="lz-lname">10.4 — Q3 walkthrough</span><span class="lz-lnote">Event naming, race conditions, handler cleanup</span></div>
<div class="lz-layer"><span class="lz-lname">10.5 — cluster-specific bugs</span><span class="lz-lnote">Redis adapter, sticky sessions, cross-worker fanout</span></div>
<div class="lz-layer"><span class="lz-lname">10.6 — quiz</span><span class="lz-lnote">6 câu, 10 phút</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — dùng cây tuần tự (Q1 rồi Q2 rồi ...).</strong> Nếu bạn <em>đã thấy</em> event trên wire (Q2 pass), không cần Q1. Cây là để KHÔNG bỏ sót câu hỏi, không phải chạy đủ bốn câu mỗi lần.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Bốn câu (client connected → event on wire → handler running → side effect happened) — mỗi cái có công cụ riêng (DevTools WS tab, breakpoint, DB check) — bắt 90% realtime bug trong 5 phút thay vì 15+ phút với reflex console.log.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Viết bốn câu hỏi theo thứ tự: client có connected, event có trên dây, handler có chạy, side effect có xảy ra.</li>
<li>Ghép mỗi cái với công cụ của nó: DevTools WS tab, một breakpoint hoặc log, một DB/state check.</li>
<li>Lấy một realtime bug bạn từng gặp và đưa nó qua cây, dừng ở câu hỏi đầu tiên fail.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chạy được một bug qua bốn câu hỏi và tới chỗ lỗi mà không rải console.log.</p></div>

<h3>🔬 Đo thật: cây được một script đi qua</h3>
<p>Một ứng dụng chat nhỏ (socket.io 4.8.3 + Postgres) có bốn lỗi gài — Nam quên token (q1), server phát vào room dựng từ một trường gõ sai (q2), Nam nghe <code>chat:new_message</code> (q3), INSERT không await và ack đi trước (q4). Một script hỏi Q1–Q4 theo thứ tự, dừng ở câu đỏ đầu tiên:</p>
<div class="out">$ node cay.mjs all      # 5 lượt: không lỗi + 4 lỗi gài sẵn · Hà gửi một tin vào thread:42, Nam phải thấy
── lỗi gài: (không) · cây dừng ở đâu cả — mọi câu xanh · 1123 ms
  Q1 ✓ Nam connected, sid Rw3GuP…
  Q2 ✓ khung tới Nam: 2["chat:new-message",{"threadId":42,"text":"xi…
  Q3 ✓ handler 'chat:new-message' chạy 1 lần
  Q4 ✓ SELECT count(*) … = 1
── lỗi gài: q1 · cây dừng ở Q1 · 220 ms
  Q1 ✗ connect_error: "No authentication token provided"
── lỗi gài: q2 · cây dừng ở Q2 · 1024 ms
  Q1 ✓ Nam connected, sid bhg6u2…
  Q2 ✗ 0 khung sự kiện tới Nam (ack của Hà: {"ok":true,"id":6})
── lỗi gài: q3 · cây dừng ở Q3 · 1031 ms
  Q1 ✓ Nam connected, sid 2T4n5m…
  Q2 ✓ khung tới Nam: 2["chat:new-message",{"threadId":42,"text":"xi…
  Q3 ✗ khung 'chat:new-message' tới nhưng handler 'chat:new_message' chạy 0 lần
── lỗi gài: q4 · cây dừng ở Q4 · 1054 ms
  Q1 ✓ Nam connected, sid 6vckPx…
  Q2 ✓ khung tới Nam: 2["chat:new-message",{"threadId":42,"text":"xi…
  Q3 ✓ handler 'chat:new-message' chạy 1 lần
  Q4 ✗ SELECT count(*) … = 0 (ack của Hà vẫn {"ok":true})</div>
<p>Mỗi lỗi dừng ở một câu <strong>khác nhau</strong>, và bằng chứng in ra chính là chỗ sửa. Lỗi q4 hiểm nhất: ack báo <code>ok</code>, Nam thấy tin — mà cơ sở dữ liệu 0 dòng (server chỉ log <code>UNHANDLED REJECTION</code>, như <code>src/index.ts:882</code> của kho).</p>
<p>Phản xạ &quot;bật hết log&quot; cho lỗi q3:</p>
<div class="out">$ DEBUG='socket.io*,engine*' node cay.mjs q3 2&gt; debug.txt      # phản xạ "bật hết log" cho đúng lỗi q3
(xong)
$ wc -l &lt; debug.txt                       # bao nhiêu dòng cho MỘT tin nhắn, hai client
     150
$ grep -c 'chat:new-message' debug.txt    # tên server phát
10
$ grep -c 'chat:new_message' debug.txt    # tên client nghe (gõ sai) — chính là con lỗi
0</div>
<p>DEBUG ghi cái được gửi và nhận — không bao giờ ghi tên client <em>đăng ký nghe</em>. Tên gõ sai xuất hiện 0 lần trong ~150 dòng.</p>
<p>Năm lỗi realtime trong lịch sử kho, mỗi cái đỏ ở một câu — 110097d08 ở Q1, 0852eb4ed và 82084b1e2 ở Q2 (phát vào room không có ai), 8a87e3298 ở Q3 (handler chạy hai lần), 3981e9a00 ở Q4 (sự kiện đúng, tác dụng sai):</p>
<div class="out">$ git show -s --format='%h %ad %s' --date=short 110097d08 0852eb4ed 8a87e3298 82084b1e2 3981e9a00 | cut -c1-118
110097d08 2026-09-17 fix(tin nhắn): app desktop "ngoại tuyến mãi" — socket CHƯA TỪNG nối được lần nào
0852eb4ed 2026-08-21 fix(call): gọi người KHÔNG online thì im lặng đổ chuông vào hư không
8a87e3298 2026-10-15 fix(messages): một người một hội thoại với admin + mỗi sự kiện socket chỉ tới một lần
82084b1e2 2026-11-13 fix(realtime): không bao giờ gắn Redis adapter MUỘN (Redis tắt lúc khởi động ⇒ getRedis thử mãi, 
3981e9a00 2026-11-13 fix(messenger): người bị chặn giữa phiên không còn nhận "đã offline" (lọc lại audience lúc ngắt —</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash"><span class="tok-comment"># lab c10: may10.mjs = chat nhỏ (socket.io 4.8.3 + Postgres), mọi socket vào user:&lt;id&gt; + thread:42; BUG=q1|q2|q3|q4 gài đúng một lỗi</span>
node cay.mjs all                                        <span class="tok-comment">  # đi cây tự động: Hà gửi một tin, Nam phải thấy — dừng ở câu đỏ đầu tiên</span>
DEBUG='socket.io*,engine*' node cay.mjs q3 2&gt; debug.txt <span class="tok-comment">  # phản xạ "bật hết log" cho lỗi q3</span>
wc -l &lt; debug.txt ; grep -c 'chat:new_message' debug.txt<span class="tok-comment">  # bao nhiêu dòng, tên gõ sai xuất hiện mấy lần</span></code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-11-4-phuong-phap" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking for Developers · 11.4 — Bảng kiểm chẩn đoán theo tầng</span><span class="lc-sub">Cùng tư duy cho mạng: dừng ở tầng hỏng đầu tiên</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/observability-monitoring/learn?lessonSlug=obs-1-1-tu-console-toi-json" target="_blank" rel="noopener"><span class="lc-ico">🔭</span><span class="lc-body"><span class="lc-title">Observability · 1.1 — Từ console.log tới một dòng máy đọc được</span><span class="lc-sub">Để câu ba, câu bốn có sẵn bằng chứng trong log</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cây quyết định</span><span class="v">Bốn câu hỏi có thứ tự khoanh vùng một realtime bug.</span></div>
  <div class="kv"><span class="k">Q1 connected</span><span class="v">Client có thật sự connected không?</span></div>
  <div class="kv"><span class="k">Q2 trên dây</span><span class="v">Event có hiện ra dưới dạng một frame không?</span></div>
  <div class="kv"><span class="k">Q3 handler</span><span class="v">Handler có chạy không?</span></div>
  <div class="kv"><span class="k">Q4 side effect</span><span class="v">Hiệu ứng dự định (DB write, emit) có xảy ra không?</span></div>
  <div class="kv"><span class="k">Reflex console.log</span><span class="v">Thói quen rải rác mà cây này thay thế.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Bốn câu hỏi có thứ tự khoanh vùng hầu hết realtime bug.</li><li>Client connected → event trên dây → handler chạy → side effect xảy ra.</li><li>Mỗi câu có công cụ riêng: DevTools WS tab, một breakpoint, một DB check.</li><li>Việc này bắt ~90% realtime bug trong khoảng 5 phút.</li><li>Nó tốt hơn 15+ phút mà reflex console.log tốn.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Chrome DevTools — WebSocket</span><span class="lc-sub">developer.chrome.com/docs/devtools/network#websocket — tab WS + Messages.</span></span></div>
</div>
`,
    },

    {
      title: '10.2 — Q1: is the client connected?|||10.2 — Q1: client có connected không?',
      slug: 'io-10-2-q1',
      type: 'VIDEO',
      description: 'DevTools Network WS, kiểm status 101 Switching Protocols, transport upgrade, và các nguyên nhân connect fail.',
      content: `
${G10_2}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>Q1: is the client connected?</h2>
<p class="lead">Before anything else, verify client can connect. This lesson runs the checks in order and names what each failure mode looks like.</p>

<h3>Check 1: DevTools Network → WS tab</h3>
<pre><code class="language-text">Mo Chrome DevTools -&gt; Network tab -&gt; loc "WS" -&gt; refresh page

Ket qua:
  Green 101 Switching Protocols -&gt; connect thanh cong (WebSocket upgrade)
  Red 400/403 -&gt; auth fail, xem response header (WWW-Authenticate hoac error body)
    (DO 14/11/2026: socket.io middleware tu choi KHONG ra 400/403 — WS van 101 xanh, ly do nam trong frame 44{&quot;message&quot;:...})
  Red 404 -&gt; nginx khong route /socket.io/
  Yellow 200 kèm long content-type text/plain -&gt; polling only (chua upgrade WebSocket)
    (client cua kho xin websocket TRUOC: sau proxy bo Upgrade no KHONG lui ve polling — xem Do that)
  Timeout (pending mai) -&gt; server khong reachable
</code></pre>

<h3>Check 2: transport type</h3>
<pre><code class="language-ts">// FE side
socket.on('connect', () =&gt; {
  console.log('transport:', socket.io.engine.transport.name);
});
socket.io.engine.on('upgrade', (t) =&gt; {
  console.log('upgraded to:', t.name);
});

// Ket qua:
// "polling" luon co (initial)   (chi dung voi client MAC DINH; kho dat transports [&#39;websocket&#39;,&#39;polling&#39;] =&gt; mo thang websocket)
// "websocket" sau upgrade — neu KHONG CO, WebSocket upgrade fail (proxy)
</code></pre>

<h3>Check 3: connect_error handler</h3>
<pre><code class="language-ts">socket.on('connect_error', (err) =&gt; {
  console.log('connect_error:', err.message, err.type);
});

// Common messages:
// "unauthorized" -&gt; auth middleware reject (Chuong 1.4)   (kho: dung chu cua middleware — "No authentication token provided", "jwt expired", "Invalid session"...)
// "timeout" -&gt; server slow hoac unreachable
// "xhr poll error" -&gt; CORS hoac network
// "websocket error" -&gt; upgrade fail   (do that: server tat, 404, proxy bo Upgrade — CA BA deu "websocket error"; xem ma trang thai o tab Network)
</code></pre>

<h3>Check 4: server log</h3>
<pre><code class="language-bash">$ docker logs cuonghoangdev_backend --tail 100 | grep socket
# Neu KHONG THAY dong "socket connected", client KHONG toi den server
# (kho nay KHONG log gi khi noi hay khi tu choi: grep "socket connected" src =&gt; 0 — phai tu them log)
# Neu THAY, kiem tra xem sid, transport, auth ok chua
</code></pre>

<h3>The cause table</h3>
<div class="out">Failure mode        Common cause                   Fix
101 fail 400        Nginx thieu upgrade headers    proxy_set_header Upgrade $http_upgrade
101 fail 403        Auth middleware reject         Kiem JWT, cookie, extractToken
Timeout             Backend down / firewall        curl /health tu server
Stuck at polling    Proxy strip Upgrade            OK neu chap nhan polling, else fix proxy
                    (client websocket-truoc nhu kho: KHONG ket o polling ma KHONG BAO GIO noi =&gt; tryAllTransports: true)
Immediate close     Auth middleware throw          Log middleware error server-side
No connect event    Middleware forgot next()       Kiem middleware code
</div>

<div class="callout warn">
<p><strong>If Q1 fails, do not move on to Q2/Q3/Q4.</strong> They all assume a connection exists. Fix the connection first, then debug event delivery.</p>
</div>

<h3>Debugging from the terminal</h3>
<pre><code class="language-bash"># Test handshake endpoint
$ curl -si 'https://api.example.com/socket.io/?EIO=4&transport=polling'
HTTP/1.1 200 OK    &lt;- OK, endpoint mounted
0{"sid":"XYZ",...} &lt;- OK, socket.io responded

# Neu HTTP 404 -&gt; nginx sai
# Neu HTTP 000 (curl fail) -&gt; server down
</code></pre>

<div class="pitfall">
<p><strong>Trap — reading &quot;the client still sees data&quot; as &quot;the connection is fine&quot;.</strong> The client may be getting its data from an HTTP GET (a fetch) rather than the WebSocket. Check the socket.io connection SPECIFICALLY — do not confuse it with REST API responses.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Q1 (is the client connected?) is answered by 4 checks in order — the DevTools WS tab (status 101), the transport-upgrade log, the connect_error handler, and the server log — and if Q1 fails, do NOT debug Q2-Q4, because they all assume a connection exists.</p>
</div>

<h3>Answering "is the client connected?" without guessing</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Look at the WS frames, not the page</span><span class="lz-d">DevTools → Network → WS. A live connection shows ping/pong frames arriving on a timer. An empty frame list means it is not connected, whatever the UI says.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Check the transport that was chosen</span><span class="lz-d"><code>socket.io.engine.transport.name</code>. If it says <code>polling</code> after the handshake, the WebSocket upgrade failed and something between the two ends blocked it.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Attach connect_error</span><span class="lz-d">The most useful three lines in this lesson: the error names CORS, a 502, a namespace typo, or an auth rejection — each of which looks identical from the outside.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Then compare against the server log</span><span class="lz-d">A client that never appears there never reached the process, which moves the investigation to the proxy rather than the code.</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — reading <code>socket.connected</code> and believing it.</strong> The flag reflects the client&#39;s own view, and a client whose network vanished — a laptop lid closed, a train tunnel — still reports <code>true</code> until the heartbeat times out, which can be tens of seconds later. So a UI gated on that boolean shows &quot;online&quot; while nothing is being delivered, and messages queue silently. It is also why a presence list built from client reports disagrees with the server. Trust the server&#39;s view for presence, treat <code>connected</code> as a local hint, and let the ping timeout — not the flag — define what &quot;disconnected&quot; means.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Open the DevTools WS tab and confirm the connection reached status 101 (switching protocols).</li>
<li>Check the transport-upgrade log and the <code>connect_error</code> handler, then the server log — in that order.</li>
<li>Simulate a vanished network (lid closed) and confirm <code>socket.connected</code> still reports <code>true</code> until the ping times out, so you trust the server's view instead.</li>
</ol>
<p><strong>Done when:</strong> you can answer Q1 from the four checks and know not to debug Q2-Q4 while Q1 fails.</p></div>

<h3>🔬 Measured: Q1 against this repo&#39;s middleware and client settings</h3>
<p>What the repo sets (14/11/2026): the client asks for WebSocket <strong>first</strong> without <code>tryAllTransports</code>; the server comment trusts a polling fallback; and there is no log line on connect or refusal:</p>
<div class="out">$ sed -n '115,123p' frontend/src/lib/socket.ts            # client của kho đặt gì
    const s = io(url, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      withCredentials: true,
      auth: token ? { token } : undefined,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 8000,
      timeout: 10000,
$ sed -n '352,354p' src/socket/messaging.socket.ts         # server của kho tin điều gì
    // Long-poll fallback is enabled by default; WebSocket-only would
    // break users behind corporate proxies that strip the upgrade header.
    transports: ['websocket', 'polling'],
$ grep -rn "tryAllTransports" src frontend/src | wc -l
       0
$ sed -n '372,409p' src/socket/messaging.socket.ts | grep -c "logger"     # middleware + connection: dòng log nào?
0
$ grep -rn "socket connected" src | wc -l                # dòng bài web bảo grep
       0</div>
<p>Six refusals from a middleware with the repo&#39;s logic — each arrives once, with the middleware&#39;s exact text, and no retry (<code>socket.active</code> = false). In Chromium the WebSocket <strong>opens</strong> (101), then <code>↓44{"message":"No authentication token provided"}</code> — never a red 400/403:</p>
<div class="out">$ node q1.mjs auth
token đúng                   ✓ connect sau 18 ms · transport websocket · lúc 6 s: websocket
không token                  ✗ connect_error sau 5 ms: "No authentication token provided" · type - · 1 lần trong 6 s
token hết hạn                ✗ connect_error sau 3 ms: "jwt expired" · type - · 1 lần trong 6 s
token ký sai bí mật          ✗ connect_error sau 3 ms: "invalid signature" · type - · 1 lần trong 6 s
token rác                    ✗ connect_error sau 3 ms: "jwt malformed" · type - · 1 lần trong 6 s
tài khoản bị khoá            ✗ connect_error sau 2 ms: "Invalid session" · type - · 1 lần trong 6 s
đổi mật khẩu (roleVersion cũ) ✗ connect_error sau 2 ms: "Session has been invalidated" · type - · 1 lần trong 6 s
$ # log server (kho không log khi nối hay khi từ chối)
nghe :19960</div>
<p>Network faults, with the repo&#39;s client settings and then the library default:</p>
<div class="out">$ node q1.mjs mang
server tắt (cổng trống)      ✗ connect_error sau 10 ms: "websocket error" · type TransportError · 3 lần trong 6 s
                               description: 
proxy: /socket.io/ ⇒ 404     ✗ connect_error sau 4 ms: "websocket error" · type TransportError · 3 lần trong 6 s
                               description: Unexpected server response: 404
proxy: bỏ header Upgrade     ✗ connect_error sau 15 ms: "websocket error" · type TransportError · 4 lần trong 12 s
                               description: Unexpected server response: 400
tường lửa nuốt gói           ✗ connect_error sau 10002 ms: "timeout" · type - · 1 lần trong 12 s
proxy đúng                   ✓ connect sau 8 ms · transport websocket · lúc 6 s: websocket
$ node q1.mjs macdinh      # cùng hai proxy, client MẶC ĐỊNH của thư viện (polling trước)
mặc định · proxy bỏ Upgrade  ✓ connect sau 25 ms · transport polling · lúc 6 s: polling
mặc định · proxy đúng        ✓ connect sau 18 ms · transport websocket · lúc 6 s: websocket</div>
<div class="callout bad"><p><strong>Real bug in this repo:</strong> <code>frontend/src/lib/socket.ts:117</code> sets <code>transports: [&#39;websocket&#39;, &#39;polling&#39;]</code> and no <code>tryAllTransports</code>. With engine.io-client 6.6 (6.6.5 in <code>frontend/</code>) only the first transport is tried: behind a proxy that strips the Upgrade header the WebSocket gets 400 and the client retries WebSocket <strong>forever</strong> — it never falls back to polling, the opposite of what the comment at <code>src/socket/messaging.socket.ts:352</code> assumes. Measured with the repo&#39;s own client library: 3 attempts in 8 s, all &quot;websocket error&quot; / &quot;Unexpected server response: 400&quot;. Fix: <code>tryAllTransports: true</code> (one WebSocket failure, then polling connects) — or polling-first. Reproduce: lab c10 <code>node q1.mjs mang</code>.</p></div>
<p>A middleware that forgets <code>next()</code>: no connect, no connect_error — 45 s of silence, then &quot;transport close&quot;:</p>
<div class="out">$ node q1.mjs quen
middleware quên next()       ✗ chưa connect
                               disconnect "transport close" @45035 ms
                               (không connect, không connect_error trong 50 s)</div>
<p>The <code>socket.connected</code> trap, measured with the repo&#39;s ping settings (25 s + 60 s): the flag stayed <code>true</code> for ~82 s after the network died and 8 emits went out without an error — the server received none:</p>
<div class="out">$ node q1den.mjs      # mạng chết kiểu đóng nắp laptop: không byte nào qua, không ai đóng kết nối
  0.0 s  [client] connect · transport websocket
  3.0 s  ── mạng chết (hố đen): không byte nào qua, không ai đóng kết nối ──
 10.0 s  [client] socket.connected = true · emit "tin" #1 không lỗi · server đã nhận 0
 20.0 s  [client] socket.connected = true · emit "tin" #2 không lỗi · server đã nhận 0
 30.0 s  [client] socket.connected = true · emit "tin" #3 không lỗi · server đã nhận 0
 40.0 s  [client] socket.connected = true · emit "tin" #4 không lỗi · server đã nhận 0
 50.0 s  [client] socket.connected = true · emit "tin" #5 không lỗi · server đã nhận 0
 60.0 s  [client] socket.connected = true · emit "tin" #6 không lỗi · server đã nhận 0
 70.1 s  [client] socket.connected = true · emit "tin" #7 không lỗi · server đã nhận 0
 80.1 s  [client] socket.connected = true · emit "tin" #8 không lỗi · server đã nhận 0
 85.0 s  [client] disconnect: ping timeout · connected = false
 85.0 s  [server] disconnect: ping timeout
tổng: client emit 8 tin trong lúc connected = true · server nhận 0</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash"><span class="tok-comment"># lab c10: may102.mjs = middleware chép logic messaging.socket.ts:372-406; q1.mjs = client đặt như frontend/src/lib/socket.ts:115</span>
node may102.mjs &amp;
node q1.mjs auth                                 <span class="tok-comment">  # sáu kiểu từ chối: connect_error mang đúng chữ của middleware</span>
node proxy102.mjs 19961 19960 404 &amp;  node proxy102.mjs 19962 19960 catup &amp;  node proxy102.mjs 19963 19960 thong &amp;  node proxy102.mjs 19964 19960 den &amp;
node q1.mjs mang ; node q1.mjs macdinh           <span class="tok-comment">  # lỗi mạng với client kiểu kho, rồi client mặc định</span>
node q1den.mjs                                   <span class="tok-comment">  # mạng chết kiểu hố đen: socket.connected còn true bao lâu</span></code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nginx/learn?lessonSlug=nginx-3-5-websocket" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Nginx · 3.5 — WebSocket: the upgrade Nginx deliberately strips</span><span class="lc-sub">The proxy that turns WebSocket into a 400</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-5-5-cuoc-dua-refresh" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Authentication · 5.5 — The refresh race</span><span class="lc-sub">A token expiring exactly when the socket reconnects</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Status 101</span><span class="v">The WebSocket upgrade handshake succeeded.</span></div>
  <div class="kv"><span class="k">Transport-upgrade log</span><span class="v">Confirms the switch from polling to WebSocket.</span></div>
  <div class="kv"><span class="k"><code>connect_error</code></span><span class="v">Surfaces an auth or handshake failure on the client.</span></div>
  <div class="kv"><span class="k">Server log</span><span class="v">The server's own record that the connection fired.</span></div>
  <div class="kv"><span class="k"><code>socket.connected</code></span><span class="v">A local hint only — stays <code>true</code> until the heartbeat times out.</span></div>
  <div class="kv"><span class="k">Gate on Q1</span><span class="v">If Q1 fails, Q2-Q4 all assume a connection that is not there.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Q1 (is the client connected?) is answered by four checks in order.</li><li>The DevTools WS tab (status 101), the transport-upgrade log, the <code>connect_error</code> handler, the server log.</li><li>If Q1 fails, do NOT debug Q2-Q4 — they all assume a connection exists.</li><li><code>socket.connected</code> is a local hint and lags a vanished network.</li><li>Let the ping timeout, not the flag, define &quot;disconnected&quot;.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Lesson 1.4 — auth middleware</span><span class="lc-sub">/courses/socket-io/learn — connect_error patterns.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>Q1: client có connected không?</h2>
<p class="lead">Trước bất cứ gì, verify client connect được. Bài này chạy các check theo thứ tự và đặt tên cho mỗi failure mode.</p>

<h3>Check 1: DevTools Network → WS tab</h3>
<pre><code class="language-text">Mo Chrome DevTools -&gt; Network tab -&gt; loc "WS" -&gt; refresh page

Ket qua:
  Green 101 Switching Protocols -&gt; connect thanh cong (WebSocket upgrade)
  Red 400/403 -&gt; auth fail, xem response header (WWW-Authenticate hoac error body)
    (DO 14/11/2026: socket.io middleware tu choi KHONG ra 400/403 — WS van 101 xanh, ly do nam trong frame 44{&quot;message&quot;:...})
  Red 404 -&gt; nginx khong route /socket.io/
  Yellow 200 kem long content-type text/plain -&gt; polling only (chua upgrade WebSocket)
    (client cua kho xin websocket TRUOC: sau proxy bo Upgrade no KHONG lui ve polling — xem Do that)
  Timeout (pending mai) -&gt; server khong reachable
</code></pre>

<h3>Check 2: loại transport</h3>
<pre><code class="language-ts">// FE side
socket.on('connect', () =&gt; {
  console.log('transport:', socket.io.engine.transport.name);
});
socket.io.engine.on('upgrade', (t) =&gt; {
  console.log('upgraded to:', t.name);
});

// Ket qua:
// "polling" luon co (initial)   (chi dung voi client MAC DINH; kho dat transports [&#39;websocket&#39;,&#39;polling&#39;] =&gt; mo thang websocket)
// "websocket" sau upgrade — neu KHONG CO, WebSocket upgrade fail (proxy)
</code></pre>

<h3>Check 3: connect_error handler</h3>
<pre><code class="language-ts">socket.on('connect_error', (err) =&gt; {
  console.log('connect_error:', err.message, err.type);
});

// Common messages:
// "unauthorized" -&gt; auth middleware reject (Chuong 1.4)   (kho: dung chu cua middleware — "No authentication token provided", "jwt expired", "Invalid session"...)
// "timeout" -&gt; server slow hoac unreachable
// "xhr poll error" -&gt; CORS hoac network
// "websocket error" -&gt; upgrade fail   (do that: server tat, 404, proxy bo Upgrade — CA BA deu "websocket error"; xem ma trang thai o tab Network)
</code></pre>

<h3>Check 4: server log</h3>
<pre><code class="language-bash">$ docker logs cuonghoangdev_backend --tail 100 | grep socket
# Neu KHONG THAY dong "socket connected", client KHONG toi den server
# (kho nay KHONG log gi khi noi hay khi tu choi: grep "socket connected" src =&gt; 0 — phai tu them log)
# Neu THAY, kiem tra xem sid, transport, auth ok chua
</code></pre>

<h3>Bảng nguyên nhân</h3>
<div class="out">Failure mode        Common cause                   Fix
101 fail 400        Nginx thieu upgrade headers    proxy_set_header Upgrade $http_upgrade
101 fail 403        Auth middleware reject         Kiem JWT, cookie, extractToken
Timeout             Backend down / firewall        curl /health tu server
Stuck at polling    Proxy strip Upgrade            OK neu chap nhan polling, else fix proxy
                    (client websocket-truoc nhu kho: KHONG ket o polling ma KHONG BAO GIO noi =&gt; tryAllTransports: true)
Immediate close     Auth middleware throw          Log middleware error server-side
No connect event    Middleware forgot next()       Kiem middleware code
</div>

<div class="callout warn">
<p><strong>Nếu Q1 fail, đừng đi tiếp Q2/Q3/Q4.</strong> Chúng đều giả định connection tồn tại. Đầu tiên vá connect, sau đó mới debug event delivery.</p>
</div>

<h3>Debug từ terminal</h3>
<pre><code class="language-bash"># Test handshake endpoint
$ curl -si 'https://api.example.com/socket.io/?EIO=4&transport=polling'
HTTP/1.1 200 OK    &lt;- OK, endpoint mounted
0{"sid":"XYZ",...} &lt;- OK, socket.io responded

# Neu HTTP 404 -&gt; nginx sai
# Neu HTTP 000 (curl fail) -&gt; server down
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — nghĩ &quot;client vẫn thấy dữ liệu&quot; = &quot;connect OK&quot;.</strong> Có thể client nhận dữ liệu từ HTTP GET (fetch) chứ không phải WebSocket. Kiểm tra CHÍNH XÁC socket.io connection — không nhầm với REST API responses.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Q1 (client connected?) trả lời bằng 4 check theo thứ tự — DevTools WS tab (status 101), transport upgrade log, connect_error handler, server log — và nếu Q1 fail, KHÔNG debug Q2-Q4 vì chúng giả định connection tồn tại.</p>
</div>

<h3>Trả lời &quot;client có kết nối không?&quot; mà không phải đoán</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Hãy nhìn các frame WS, đừng nhìn cái trang</span><span class="lz-d">DevTools → Network → WS. Một kết nối sống sẽ hiện ra các frame ping/pong tới theo nhịp. Danh sách frame rỗng nghĩa là nó KHÔNG kết nối, bất kể giao diện nói gì.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Kiểm transport đã được chọn</span><span class="lz-d"><code>socket.io.engine.transport.name</code>. Nếu nó ghi <code>polling</code> sau khi bắt tay xong thì phép nâng cấp lên WebSocket đã hỏng và có thứ gì đó nằm giữa hai đầu đã chặn nó.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Hãy gắn connect_error</span><span class="lz-d">Ba dòng hữu ích nhất trong bài này: cái lỗi gọi tên CORS, một cú 502, một lỗi gõ nhầm namespace, hay một lần từ chối xác thực — mà nhìn từ bên ngoài thì cái nào cũng giống hệt nhau.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Rồi đối chiếu với log máy chủ</span><span class="lz-d">Một client chẳng bao giờ xuất hiện ở đó là một client chưa từng tới được tiến trình, và điều đó chuyển cuộc điều tra sang phía proxy chứ không phải phía mã.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — đọc <code>socket.connected</code> rồi tin nó.</strong> Cái cờ đó phản ánh cách nhìn của chính client, và một client vừa mất mạng — đóng nắp laptop, tàu chui vào hầm — vẫn báo <code>true</code> cho tới khi nhịp tim hết giờ, việc có thể xảy ra hàng chục giây sau đó. Nên một giao diện dựa vào cái boolean ấy sẽ hiện &quot;đang online&quot; trong khi chẳng có gì được giao đi, và tin nhắn lặng lẽ xếp hàng. Đó cũng là lý do một danh sách hiện diện dựng từ báo cáo của client lại bất đồng với máy chủ. Hãy tin cách nhìn của máy chủ cho phần hiện diện, coi <code>connected</code> là một gợi ý cục bộ, và để thời gian chờ ping — chứ không phải cái cờ — định nghĩa thế nào là &quot;mất kết nối&quot;.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Mở DevTools WS tab và xác nhận connection đã tới status 101 (switching protocols).</li>
<li>Kiểm transport-upgrade log và handler <code>connect_error</code>, rồi server log — theo thứ tự đó.</li>
<li>Mô phỏng mất mạng (đóng nắp) và xác nhận <code>socket.connected</code> vẫn báo <code>true</code> cho tới khi ping hết giờ, nên bạn tin cách nhìn của server thay vì nó.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn trả lời được Q1 từ bốn check và biết không debug Q2-Q4 khi Q1 còn fail.</p></div>

<h3>🔬 Đo thật: Q1 với middleware và cấu hình client của kho</h3>
<p>Kho đặt gì (14/11/2026): client xin WebSocket <strong>trước</strong>, không <code>tryAllTransports</code>; chú thích server tin có đường lùi về polling; và không có dòng log nào khi nối hay khi từ chối:</p>
<div class="out">$ sed -n '115,123p' frontend/src/lib/socket.ts            # client của kho đặt gì
    const s = io(url, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      withCredentials: true,
      auth: token ? { token } : undefined,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 8000,
      timeout: 10000,
$ sed -n '352,354p' src/socket/messaging.socket.ts         # server của kho tin điều gì
    // Long-poll fallback is enabled by default; WebSocket-only would
    // break users behind corporate proxies that strip the upgrade header.
    transports: ['websocket', 'polling'],
$ grep -rn "tryAllTransports" src frontend/src | wc -l
       0
$ sed -n '372,409p' src/socket/messaging.socket.ts | grep -c "logger"     # middleware + connection: dòng log nào?
0
$ grep -rn "socket connected" src | wc -l                # dòng bài web bảo grep
       0</div>
<p>Sáu kiểu từ chối từ middleware có logic của kho — mỗi cái tới một lần, đúng chữ của middleware, không thử lại (<code>socket.active</code> = false). Trong Chromium, WebSocket <strong>mở</strong> (101) rồi mới <code>↓44{"message":"No authentication token provided"}</code> — không bao giờ là 400/403 đỏ:</p>
<div class="out">$ node q1.mjs auth
token đúng                   ✓ connect sau 18 ms · transport websocket · lúc 6 s: websocket
không token                  ✗ connect_error sau 5 ms: "No authentication token provided" · type - · 1 lần trong 6 s
token hết hạn                ✗ connect_error sau 3 ms: "jwt expired" · type - · 1 lần trong 6 s
token ký sai bí mật          ✗ connect_error sau 3 ms: "invalid signature" · type - · 1 lần trong 6 s
token rác                    ✗ connect_error sau 3 ms: "jwt malformed" · type - · 1 lần trong 6 s
tài khoản bị khoá            ✗ connect_error sau 2 ms: "Invalid session" · type - · 1 lần trong 6 s
đổi mật khẩu (roleVersion cũ) ✗ connect_error sau 2 ms: "Session has been invalidated" · type - · 1 lần trong 6 s
$ # log server (kho không log khi nối hay khi từ chối)
nghe :19960</div>
<p>Lỗi mạng, với cấu hình client của kho rồi với mặc định của thư viện:</p>
<div class="out">$ node q1.mjs mang
server tắt (cổng trống)      ✗ connect_error sau 10 ms: "websocket error" · type TransportError · 3 lần trong 6 s
                               description: 
proxy: /socket.io/ ⇒ 404     ✗ connect_error sau 4 ms: "websocket error" · type TransportError · 3 lần trong 6 s
                               description: Unexpected server response: 404
proxy: bỏ header Upgrade     ✗ connect_error sau 15 ms: "websocket error" · type TransportError · 4 lần trong 12 s
                               description: Unexpected server response: 400
tường lửa nuốt gói           ✗ connect_error sau 10002 ms: "timeout" · type - · 1 lần trong 12 s
proxy đúng                   ✓ connect sau 8 ms · transport websocket · lúc 6 s: websocket
$ node q1.mjs macdinh      # cùng hai proxy, client MẶC ĐỊNH của thư viện (polling trước)
mặc định · proxy bỏ Upgrade  ✓ connect sau 25 ms · transport polling · lúc 6 s: polling
mặc định · proxy đúng        ✓ connect sau 18 ms · transport websocket · lúc 6 s: websocket</div>
<div class="callout bad"><p><strong>Lỗi thật của kho:</strong> <code>frontend/src/lib/socket.ts:117</code> đặt <code>transports: [&#39;websocket&#39;, &#39;polling&#39;]</code> và không có <code>tryAllTransports</code>. Với engine.io-client 6.6 (6.6.5 trong <code>frontend/</code>) chỉ transport đầu được thử: sau proxy bỏ header Upgrade, WebSocket nhận 400 và client thử lại WebSocket <strong>mãi mãi</strong> — không bao giờ lùi về polling, ngược với điều chú thích ở <code>src/socket/messaging.socket.ts:352</code> tin. Đo bằng chính thư viện client của kho: 3 lần trong 8 s, đều &quot;websocket error&quot; / &quot;Unexpected server response: 400&quot;. Sửa: <code>tryAllTransports: true</code> (WebSocket hỏng một lần rồi polling nối) — hoặc polling trước. Tái hiện: lab c10 <code>node q1.mjs mang</code>.</p></div>
<p>Middleware quên <code>next()</code>: không connect, không connect_error — 45 giây im lặng rồi &quot;transport close&quot;:</p>
<div class="out">$ node q1.mjs quen
middleware quên next()       ✗ chưa connect
                               disconnect "transport close" @45035 ms
                               (không connect, không connect_error trong 50 s)</div>
<p>Bẫy <code>socket.connected</code>, đo với ping của kho (25 s + 60 s): cờ vẫn <code>true</code> thêm ~82 s sau khi mạng chết, 8 emit đi không lỗi — server không nhận tin nào:</p>
<div class="out">$ node q1den.mjs      # mạng chết kiểu đóng nắp laptop: không byte nào qua, không ai đóng kết nối
  0.0 s  [client] connect · transport websocket
  3.0 s  ── mạng chết (hố đen): không byte nào qua, không ai đóng kết nối ──
 10.0 s  [client] socket.connected = true · emit "tin" #1 không lỗi · server đã nhận 0
 20.0 s  [client] socket.connected = true · emit "tin" #2 không lỗi · server đã nhận 0
 30.0 s  [client] socket.connected = true · emit "tin" #3 không lỗi · server đã nhận 0
 40.0 s  [client] socket.connected = true · emit "tin" #4 không lỗi · server đã nhận 0
 50.0 s  [client] socket.connected = true · emit "tin" #5 không lỗi · server đã nhận 0
 60.0 s  [client] socket.connected = true · emit "tin" #6 không lỗi · server đã nhận 0
 70.1 s  [client] socket.connected = true · emit "tin" #7 không lỗi · server đã nhận 0
 80.1 s  [client] socket.connected = true · emit "tin" #8 không lỗi · server đã nhận 0
 85.0 s  [client] disconnect: ping timeout · connected = false
 85.0 s  [server] disconnect: ping timeout
tổng: client emit 8 tin trong lúc connected = true · server nhận 0</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash"><span class="tok-comment"># lab c10: may102.mjs = middleware chép logic messaging.socket.ts:372-406; q1.mjs = client đặt như frontend/src/lib/socket.ts:115</span>
node may102.mjs &amp;
node q1.mjs auth                                 <span class="tok-comment">  # sáu kiểu từ chối: connect_error mang đúng chữ của middleware</span>
node proxy102.mjs 19961 19960 404 &amp;  node proxy102.mjs 19962 19960 catup &amp;  node proxy102.mjs 19963 19960 thong &amp;  node proxy102.mjs 19964 19960 den &amp;
node q1.mjs mang ; node q1.mjs macdinh           <span class="tok-comment">  # lỗi mạng với client kiểu kho, rồi client mặc định</span>
node q1den.mjs                                   <span class="tok-comment">  # mạng chết kiểu hố đen: socket.connected còn true bao lâu</span></code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nginx/learn?lessonSlug=nginx-3-5-websocket" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Nginx · 3.5 — WebSocket: cú nâng cấp mà Nginx CỐ Ý gỡ đi</span><span class="lc-sub">Cái proxy biến WebSocket thành 400</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-5-5-cuoc-dua-refresh" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Authentication · 5.5 — Cuộc đua refresh</span><span class="lc-sub">Token hết hạn đúng lúc socket nối lại</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Status 101</span><span class="v">Bắt tay upgrade WebSocket thành công.</span></div>
  <div class="kv"><span class="k">Log transport-upgrade</span><span class="v">Xác nhận chuyển từ polling sang WebSocket.</span></div>
  <div class="kv"><span class="k"><code>connect_error</code></span><span class="v">Hiện một lỗi auth hoặc handshake ở client.</span></div>
  <div class="kv"><span class="k">Server log</span><span class="v">Ghi chép của chính server rằng connection đã fire.</span></div>
  <div class="kv"><span class="k"><code>socket.connected</code></span><span class="v">Chỉ là một gợi ý cục bộ — còn <code>true</code> tới khi heartbeat hết giờ.</span></div>
  <div class="kv"><span class="k">Chốt ở Q1</span><span class="v">Nếu Q1 fail, Q2-Q4 đều giả định một connection không có.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Q1 (client có connected?) trả lời bằng bốn check theo thứ tự.</li><li>DevTools WS tab (status 101), log transport-upgrade, handler <code>connect_error</code>, server log.</li><li>Nếu Q1 fail, KHÔNG debug Q2-Q4 — chúng đều giả định một connection tồn tại.</li><li><code>socket.connected</code> là một gợi ý cục bộ và trễ so với mất mạng.</li><li>Để ping timeout, không phải cái cờ, định nghĩa &quot;mất kết nối&quot;.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Bài 1.4 — auth middleware</span><span class="lc-sub">/courses/socket-io/learn — connect_error patterns.</span></span></div>
</div>
`,
    },

    {
      title: '10.3 — Q2: is the event on the wire?|||10.3 — Q2: event có trên dây không?',
      slug: 'io-10-3-q2',
      type: 'VIDEO',
      description: 'DevTools Messages tab đọc frame. Có <code>42[&quot;event-name&quot;,...]</code>? Nếu không, bug ở emit side. Nếu có nhưng client không handle, bug ở receive.',
      content: `
${G10_3}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.3</span>
<h2>Q2: is the event on the wire?</h2>
<p class="lead">DevTools WS tab has a Messages sub-tab showing every frame. Chapter 0.3 taught how to read packet format. This lesson uses it to answer Q2.</p>

<h3>How to read the frames</h3>
<pre><code class="language-text">Mo DevTools -&gt; Network -&gt; WS -&gt; click connection socket.io -&gt; Messages tab

Cot "Data" chua binary/text frame:
  42["chat:new-message",{"id":1,"text":"hi"}]
  ↑└─ socket.io type 2 (EVENT)
  └── engine.io type 4 (MESSAGE)

Cac frame thuong thay:
  0{...}                              engine.io OPEN (initial)
  40{...}                             socket.io CONNECT
  42[...]                             EVENT
  2                                   engine.io PING (server -&gt; client)
  3                                   engine.io PONG (client -&gt; server)
</code></pre>

<h3>Ba scenario cho Q2</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">a</span><span class="lz-t">The frame IS there, the handler does NOT run</span><span class="lz-d">The emit reached the client and the client did not handle it. The bug is on the receive side: a mismatched event name, an unregistered handler, or a handler registered on the wrong socket.</span></div>
<div class="lz-step"><span class="lz-k">b</span><span class="lz-t">There is NO frame on the client side</span><span class="lz-d">The server believes it emitted, but the packet never arrived. Causes: the wrong room name, the client not being in the room, a Redis adapter blip (in a cluster), or a full transport buffer.</span></div>
<div class="lz-step"><span class="lz-k">c</span><span class="lz-t">The frame is there but the payload is empty or wrong</span><span class="lz-d">JSON serialisation dropped a circular reference, or the data mutated between the emit and the send. <em>(Measured: a circular object or a BigInt does not get dropped — <code>emit()</code> throws on the server, before any frame. What silently changes is Date ⇒ string, Map/Set ⇒ <code>{}</code>, undefined fields, NaN ⇒ null.)</em> Inspect the exact payload in DevTools.</span></div>
</div>

<h3>Debug scenario A — the frame is there, the handler does not run</h3>
<pre><code class="language-ts">// Kiem event name exact — case-sensitive
socket.on('Chat:new-message', ...);    // SAI — server emit 'chat:new-message'

// Kiem chinh xac socket
const socketA = io('/');
const socketB = io('/chat');           // namespace khac
socketA.on('X', ...);                  // dang ky tren socketA
// server emit 'X' tren namespace /chat -&gt; socketA khong nhan

// Kiem handler cleanup
socket.on('X', handleX);
// ...roi khong bao gio off:
socket.off('X', handleX);             // neu register + unregister sai, handler cu ap dung
</code></pre>

<h3>Debug scenario B — the server emits but the client sees nothing</h3>
<pre><code class="language-ts">// Server log truoc va sau emit
logger.info('emitting', { room: &#96;user:\${uid}&#96;, event: 'X', payload });
io.to(&#96;user:\${uid}&#96;).emit('X', payload);

// Kiem room co ai khong
const room = io.sockets.adapter.rooms.get(&#96;user:\${uid}&#96;);
logger.info('room size', { room: &#96;user:\${uid}&#96;, size: room?.size });
// Neu size 0, KHONG AI o room -&gt; emit di vao khoang khong
</code></pre>

<h3>Cluster case</h3>
<pre><code class="language-ts">// Neu cluster + Redis adapter, tin nhan qua Redis pub/sub
// Debug bang cach subscribe Redis channel truc tiep:
$ redis-cli PSUBSCRIBE 'socket.io#*'
# Neu KHONG THAY message tuong ung, adapter khong PUBLISH -&gt; bug adapter attach
# Neu CO message nhung client van khong nhan -&gt; worker cua client khong SUBSCRIBE
</code></pre>

<div class="pitfall">
<p><strong>Trap — dismissing the ping/pong frames in DevTools as noise.</strong> Every 25s there is a PING (frame <code>2</code>) and a PONG (<code>3</code>). Filter them out with right-click → Hide frames matching pattern. Focus on the EVENT frames (<code>42[...]</code>).</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Q2 (is the event on the wire?) is answered by reading frames in the DevTools Messages tab — a frame present but no handler running means a receive-side bug (event name, namespace, a different socket); no frame at all means an emit-side bug (an empty room, a Redis blip, a full buffer); a frame with the wrong payload means a serialisation bug.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Open DevTools → Network → WS → Messages and look for the <code>42[&quot;event-name&quot;,...]</code> frame for your event.</li>
<li>If the frame is present but no handler ran, hunt the receive side: wrong event name, wrong namespace, a different socket.</li>
<li>If there is no frame at all, hunt the emit side (empty room, Redis blip, full buffer); if the frame is present with the wrong payload, it is a serialisation bug.</li>
</ol>
<p><strong>Done when:</strong> you can tell receive-side, emit-side and serialisation bugs apart from the Messages tab alone.</p></div>

<h3>🔬 Measured: the three Q2 outcomes in a real browser</h3>
<p>Chromium, frames captured from the page (14/11/2026). Scenario A — the handler listens for <code>'Chat:new-message'</code>; the frame is on the wire anyway:</p>
<div class="out">↓ 0{"sid":"Hce0FG-PAuw-_gocAAAB","upgrades":[],"pingInterval":25000,"pingTimeout":60000,"maxPayload":1000000}
↑ 40
↓ 40{"sid":"l0na7WibaMuXYwlrAAAB"}
↓ 42["chat:new-message",{"threadId":42,"text":"hi Nam","from":1}]</div>
<p>Scenario A by namespace — one WebSocket, two namespaces; the server emitted on <code>/chat</code>, the handler is on the <code>/</code> socket:</p>
<div class="out">↓ 0{"sid":"rCzVlzWaD4xV-t2_AAAC","upgrades":[],"pingInterval":25000,"pingTimeout":60000,"maxPayload":1000000}
↑ 40
↑ 40/chat,
↓ 40{"sid":"uqvN1wFiplQ1plEhAAAC"}
↓ 40/chat,{"sid":"GqkQeWLzVXFzKs8iAAAD"}
↓ 42/chat,["chat:new-message",{"threadId":42,"text":"hi Nam","from":1}]</div>
<p>Scenario B — a room built from a misspelled field: no <code>42</code> frame at all. The log line before the emit is the diagnosis:</p>
<div class="out">↓ 0{"sid":"CmGU2iCcxP-6SlCSAAAD","upgrades":[],"pingInterval":25000,"pingTimeout":60000,"maxPayload":1000000}
↑ 40
↓ 40{"sid":"6ByZ1DxgSc3dZGeCAAAE"}</div>
<div class="out">$ curl -s 'localhost:19971/phat?kieu=ok' ; curl -s 'localhost:19971/phat?kieu=room'      # room đúng · room dựng từ trường gõ sai
(đã phát hai lần)
$ # log server
nghe :19971
emitting chat:new-message → thread:42 · room size 1
emitting chat:new-message → thread:undefined · room size 0
$ # Nam nhận gì
[Nam] connected · trong thread:42
[Nam] 0.72 s ← chat:new-message {"threadId":42,"text":"hi Nam","from":1}</div>
<p>Scenario C — nine payloads, what arrives (Node client, same parser as the browser):</p>
<div class="out">$ node q2tai.mjs      # server emit chín kiểu giá trị — client nhận được gì, trên dây là gì
Date               ⇒ client nhận string "2026-11-14T08:00:00.000Z"
                     dây: 2["x","2026-11-14T08:00:00.000Z"]
Map                ⇒ client nhận object {} · Object thường
                     dây: 2["x",{}]
Set                ⇒ client nhận object {} · Object thường
                     dây: 2["x",{}]
{ x: undefined }   ⇒ client nhận object {"id":7} · Object thường
                     dây: 2["x",{"id":7}]
NaN, Infinity      ⇒ client nhận array [null,null]
                     dây: 2["x",[null,null]]
class TinNhan      ⇒ client nhận object {"text":"hi"} · Object thường
                     dây: 2["x",{"text":"hi"}]
Buffer 4 B         ⇒ client nhận object "&lt;Buffer&gt;" · Buffer
                     dây: 51-["x",{"_placeholder":true,"num":0}]  +  &lt;nhị phân 4 B&gt;
BigInt 10n         ⇒ emit NÉM TypeError: Do not know how to serialize a BigInt
vòng tham chiếu    ⇒ emit NÉM RangeError: Maximum call stack size exceeded</div>
<p>Cluster — watching the adapter&#39;s Redis channel while worker 0 emits to <code>thread:42</code> (the channel ends with <code>#</code>; the payload is msgpack):</p>
<div class="out">$ node cum.mjs khong 2 ; node cum.mjs redis 2                       # cụm 2 worker: không adapter · có Redis adapter
adapter KHÔNG gắn (RAM) · 2 worker · worker 0 phát vào thread:42 ⇒ nhận: Nam-0 1 · Nam-1 0 ⇒ 1/2 người
PSUBSCRIBE thấy 0 pmessage
adapter Redis · 2 worker · worker 0 phát vào thread:42 ⇒ nhận: Nam-0 1 · Nam-1 1 ⇒ 2/2 người
PSUBSCRIBE thấy 1 pmessage
$ LC_ALL=C cat -v ps2.txt | cut -c1-60        # nguyên văn kênh lúc có adapter
psubscribe
socket.io#*
1
pmessage
socket.io#*
socket.io#/#thread:42#
M-^SM-&amp;2HsnkfM-^CM-$type^BM-$dataM-^RM-0chat:new-messageM-^B</div>
<p>Where scenario B can hide in this repo: 21 emits build the room name from a variable (one undefined ⇒ a room nobody is in); 0 places log the room size; 0 volatile emits:</p>
<div class="out">$ grep -rnE '\\.to\\(&#96;[a-zA-Z:_-]+:\\$\\{' src | grep -v test | wc -l      # room dựng từ biến (chỗ có thể thành :undefined)
      21
$ grep -rn "volatile" src/socket | wc -l ; grep -rnE "rooms\\.get\\(.*\\)\\?\\.size" src/socket | wc -l
       0
       0</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash"><span class="tok-comment"># lab c10: may103.mjs — mọi socket vào thread:42; GET /phat?kieu=ok|ten|nsp|room phát một tin theo kiểu lỗi, log room + size TRƯỚC emit</span>
node may103.mjs &amp;   node nam103.mjs &amp;
curl -s 'localhost:19971/phat?kieu=ok' ; curl -s 'localhost:19971/phat?kieu=room'  <span class="tok-comment">  # room đúng · room dựng từ trường gõ sai</span>
open http://localhost:19971/q2.html?kieu=ten    <span class="tok-comment">  # Chromium: DevTools → Network → WS → Messages (ten | nsp | room)</span>
node q2tai.mjs                                  <span class="tok-comment">  # 9 kiểu payload: client nhận gì</span>
docker exec sio-redis redis-cli PSUBSCRIBE 'socket.io#*' &amp;   node cum.mjs khong 2 ; node cum.mjs redis 2</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-9-2-websocket" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking for Developers · 9.2 — WebSocket: upgrade, frames and heartbeat</span><span class="lc-sub">The layer under the Messages tab</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-8-1-pubsub" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 8.1 — Pub/Sub: fire and forget, and what it costs</span><span class="lc-sub">What PSUBSCRIBE is listening to</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Messages tab</span><span class="v">The DevTools WS view listing each frame on the connection.</span></div>
  <div class="kv"><span class="k">Frame present, no handler</span><span class="v">A receive-side bug: event name, namespace, or wrong socket.</span></div>
  <div class="kv"><span class="k">No frame at all</span><span class="v">An emit-side bug: empty room, Redis blip, full buffer.</span></div>
  <div class="kv"><span class="k">Wrong payload</span><span class="v">A serialisation bug — the event fired but the data is off.</span></div>
  <div class="kv"><span class="k">Empty room</span><span class="v">An emit to a room nobody joined reaches no one.</span></div>
  <div class="kv"><span class="k">Full buffer</span><span class="v">A backed-up send buffer dropping or delaying frames.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Q2 (is the event on the wire?) is answered by reading frames in the Messages tab.</li><li>A frame present but no handler running means a receive-side bug.</li><li>No frame at all means an emit-side bug (empty room, Redis blip, full buffer).</li><li>A frame with the wrong payload means a serialisation bug.</li><li>The tab tells you which side to debug before you touch any code.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Lesson 0.3 — packet format</span><span class="lc-sub">/courses/socket-io/learn — bảng packet types cho đọc DevTools.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.3</span>
<h2>Q2: event có trên dây không?</h2>
<p class="lead">DevTools WS tab có Messages sub-tab hiện mọi frame. Chương 0.3 dạy cách đọc packet format. Bài này dùng nó trả lời Q2.</p>

<h3>Cách đọc frame</h3>
<pre><code class="language-text">Mo DevTools -&gt; Network -&gt; WS -&gt; click connection socket.io -&gt; Messages tab

Cot "Data" chua binary/text frame:
  42["chat:new-message",{"id":1,"text":"hi"}]
  ↑└─ socket.io type 2 (EVENT)
  └── engine.io type 4 (MESSAGE)

Cac frame thuong thay:
  0{...}                              engine.io OPEN (initial)
  40{...}                             socket.io CONNECT
  42[...]                             EVENT
  2                                   engine.io PING (server -&gt; client)
  3                                   engine.io PONG (client -&gt; server)
</code></pre>

<h3>Ba scenario cho Q2</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">a</span><span class="lz-t">Frame CÓ, handler KHÔNG chạy</span><span class="lz-d">Emit reach client, client không handle. Bug ở receive side: event name mismatch, handler chưa đăng ký, handler đăng ký sai socket.</span></div>
<div class="lz-step"><span class="lz-k">b</span><span class="lz-t">Frame KHÔNG có phía client</span><span class="lz-d">Server nghĩ đã emit nhưng packet không đến. Nguyên nhân: sai room name, client không trong room, Redis adapter blip (cluster), transport buffer full.</span></div>
<div class="lz-step"><span class="lz-k">c</span><span class="lz-t">Frame CÓ nhưng payload trống/sai</span><span class="lz-d">JSON serialize lost circular ref, hoặc data mutation between emit và fire. <em>(Đo thật: object vòng tham chiếu hay BigInt không bị bỏ — <code>emit()</code> NÉM lỗi ở server, trước khi có khung nào. Cái đổi im lặng là Date ⇒ chuỗi, Map/Set ⇒ <code>{}</code>, trường undefined, NaN ⇒ null.)</em> Kiểm payload chính xác trong DevTools.</span></div>
</div>

<h3>Debug scenario A — frame có, handler không chạy</h3>
<pre><code class="language-ts">// Kiem event name exact — case-sensitive
socket.on('Chat:new-message', ...);    // SAI — server emit 'chat:new-message'

// Kiem chinh xac socket
const socketA = io('/');
const socketB = io('/chat');           // namespace khac
socketA.on('X', ...);                  // dang ky tren socketA
// server emit 'X' tren namespace /chat -&gt; socketA khong nhan

// Kiem handler cleanup
socket.on('X', handleX);
// ...roi khong bao gio off:
socket.off('X', handleX);             // neu register + unregister sai, handler cu ap dung
</code></pre>

<h3>Debug scenario B — server emit nhưng client không thấy</h3>
<pre><code class="language-ts">// Server log truoc va sau emit
logger.info('emitting', { room: &#96;user:\${uid}&#96;, event: 'X', payload });
io.to(&#96;user:\${uid}&#96;).emit('X', payload);

// Kiem room co ai khong
const room = io.sockets.adapter.rooms.get(&#96;user:\${uid}&#96;);
logger.info('room size', { room: &#96;user:\${uid}&#96;, size: room?.size });
// Neu size 0, KHONG AI o room -&gt; emit di vao khoang khong
</code></pre>

<h3>Cluster case</h3>
<pre><code class="language-ts">// Neu cluster + Redis adapter, tin nhan qua Redis pub/sub
// Debug bang cach subscribe Redis channel truc tiep:
$ redis-cli PSUBSCRIBE 'socket.io#*'
# Neu KHONG THAY message tuong ung, adapter khong PUBLISH -&gt; bug adapter attach
# Neu CO message nhung client van khong nhan -&gt; worker cua client khong SUBSCRIBE
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — bỏ ping/pong ở DevTools làm noise.</strong> Cứ 25s một PING (frame <code>2</code>) và PONG (<code>3</code>). Filter chúng bằng right-click → Hide frames matching pattern. Focus vào EVENT frames (<code>42[...]</code>).</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Q2 (event on wire?) trả lời bằng DevTools Messages tab đọc frame — nếu frame CÓ mà handler không chạy = bug receive side (event name, namespace, socket khác), nếu KHÔNG frame = bug emit side (room rỗng, Redis blip, buffer full), nếu frame có nhưng payload sai = bug serialization.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Mở DevTools → Network → WS → Messages và tìm frame <code>42[&quot;event-name&quot;,...]</code> cho event của bạn.</li>
<li>Nếu frame CÓ mà không handler nào chạy, săn phía nhận: sai event name, sai namespace, một socket khác.</li>
<li>Nếu KHÔNG có frame nào, săn phía emit (room rỗng, Redis blip, buffer full); nếu frame có nhưng payload sai, đó là bug serialization.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn phân biệt được bug phía nhận, phía emit và serialization chỉ từ tab Messages.</p></div>

<h3>🔬 Đo thật: ba kết quả của Q2 trong trình duyệt thật</h3>
<p>Chromium, khung bắt từ trang (14/11/2026). Kịch bản A — handler nghe <code>'Chat:new-message'</code>; khung vẫn nằm trên dây:</p>
<div class="out">↓ 0{"sid":"Hce0FG-PAuw-_gocAAAB","upgrades":[],"pingInterval":25000,"pingTimeout":60000,"maxPayload":1000000}
↑ 40
↓ 40{"sid":"l0na7WibaMuXYwlrAAAB"}
↓ 42["chat:new-message",{"threadId":42,"text":"hi Nam","from":1}]</div>
<p>Kịch bản A do namespace — một WebSocket, hai namespace; server phát trên <code>/chat</code>, handler nằm trên socket <code>/</code>:</p>
<div class="out">↓ 0{"sid":"rCzVlzWaD4xV-t2_AAAC","upgrades":[],"pingInterval":25000,"pingTimeout":60000,"maxPayload":1000000}
↑ 40
↑ 40/chat,
↓ 40{"sid":"uqvN1wFiplQ1plEhAAAC"}
↓ 40/chat,{"sid":"GqkQeWLzVXFzKs8iAAAD"}
↓ 42/chat,["chat:new-message",{"threadId":42,"text":"hi Nam","from":1}]</div>
<p>Kịch bản B — room dựng từ một trường gõ sai: không có khung <code>42</code> nào. Dòng log trước emit chính là lời chẩn đoán:</p>
<div class="out">↓ 0{"sid":"CmGU2iCcxP-6SlCSAAAD","upgrades":[],"pingInterval":25000,"pingTimeout":60000,"maxPayload":1000000}
↑ 40
↓ 40{"sid":"6ByZ1DxgSc3dZGeCAAAE"}</div>
<div class="out">$ curl -s 'localhost:19971/phat?kieu=ok' ; curl -s 'localhost:19971/phat?kieu=room'      # room đúng · room dựng từ trường gõ sai
(đã phát hai lần)
$ # log server
nghe :19971
emitting chat:new-message → thread:42 · room size 1
emitting chat:new-message → thread:undefined · room size 0
$ # Nam nhận gì
[Nam] connected · trong thread:42
[Nam] 0.72 s ← chat:new-message {"threadId":42,"text":"hi Nam","from":1}</div>
<p>Kịch bản C — chín kiểu payload, cái gì tới nơi (client Node, cùng parser với trình duyệt):</p>
<div class="out">$ node q2tai.mjs      # server emit chín kiểu giá trị — client nhận được gì, trên dây là gì
Date               ⇒ client nhận string "2026-11-14T08:00:00.000Z"
                     dây: 2["x","2026-11-14T08:00:00.000Z"]
Map                ⇒ client nhận object {} · Object thường
                     dây: 2["x",{}]
Set                ⇒ client nhận object {} · Object thường
                     dây: 2["x",{}]
{ x: undefined }   ⇒ client nhận object {"id":7} · Object thường
                     dây: 2["x",{"id":7}]
NaN, Infinity      ⇒ client nhận array [null,null]
                     dây: 2["x",[null,null]]
class TinNhan      ⇒ client nhận object {"text":"hi"} · Object thường
                     dây: 2["x",{"text":"hi"}]
Buffer 4 B         ⇒ client nhận object "&lt;Buffer&gt;" · Buffer
                     dây: 51-["x",{"_placeholder":true,"num":0}]  +  &lt;nhị phân 4 B&gt;
BigInt 10n         ⇒ emit NÉM TypeError: Do not know how to serialize a BigInt
vòng tham chiếu    ⇒ emit NÉM RangeError: Maximum call stack size exceeded</div>
<p>Cụm — nghe kênh Redis của adapter trong lúc worker 0 phát vào <code>thread:42</code> (tên kênh kết thúc bằng <code>#</code>; dữ liệu là msgpack):</p>
<div class="out">$ node cum.mjs khong 2 ; node cum.mjs redis 2                       # cụm 2 worker: không adapter · có Redis adapter
adapter KHÔNG gắn (RAM) · 2 worker · worker 0 phát vào thread:42 ⇒ nhận: Nam-0 1 · Nam-1 0 ⇒ 1/2 người
PSUBSCRIBE thấy 0 pmessage
adapter Redis · 2 worker · worker 0 phát vào thread:42 ⇒ nhận: Nam-0 1 · Nam-1 1 ⇒ 2/2 người
PSUBSCRIBE thấy 1 pmessage
$ LC_ALL=C cat -v ps2.txt | cut -c1-60        # nguyên văn kênh lúc có adapter
psubscribe
socket.io#*
1
pmessage
socket.io#*
socket.io#/#thread:42#
M-^SM-&amp;2HsnkfM-^CM-$type^BM-$dataM-^RM-0chat:new-messageM-^B</div>
<p>Kịch bản B nấp ở đâu trong kho: 21 emit dựng tên room từ một biến (một giá trị undefined ⇒ room không có ai); 0 chỗ log số socket trong room; 0 emit volatile:</p>
<div class="out">$ grep -rnE '\\.to\\(&#96;[a-zA-Z:_-]+:\\$\\{' src | grep -v test | wc -l      # room dựng từ biến (chỗ có thể thành :undefined)
      21
$ grep -rn "volatile" src/socket | wc -l ; grep -rnE "rooms\\.get\\(.*\\)\\?\\.size" src/socket | wc -l
       0
       0</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash"><span class="tok-comment"># lab c10: may103.mjs — mọi socket vào thread:42; GET /phat?kieu=ok|ten|nsp|room phát một tin theo kiểu lỗi, log room + size TRƯỚC emit</span>
node may103.mjs &amp;   node nam103.mjs &amp;
curl -s 'localhost:19971/phat?kieu=ok' ; curl -s 'localhost:19971/phat?kieu=room'  <span class="tok-comment">  # room đúng · room dựng từ trường gõ sai</span>
open http://localhost:19971/q2.html?kieu=ten    <span class="tok-comment">  # Chromium: DevTools → Network → WS → Messages (ten | nsp | room)</span>
node q2tai.mjs                                  <span class="tok-comment">  # 9 kiểu payload: client nhận gì</span>
docker exec sio-redis redis-cli PSUBSCRIBE 'socket.io#*' &amp;   node cum.mjs khong 2 ; node cum.mjs redis 2</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-9-2-websocket" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking for Developers · 9.2 — WebSocket: nâng cấp, frame và nhịp tim</span><span class="lc-sub">Tầng bên dưới tab Messages</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-8-1-pubsub" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 8.1 — Pub/Sub: bắn rồi quên, và cái giá của nó</span><span class="lc-sub">Thứ PSUBSCRIBE đang nghe</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Tab Messages</span><span class="v">View WS của DevTools liệt kê từng frame trên connection.</span></div>
  <div class="kv"><span class="k">Frame có, không handler</span><span class="v">Bug phía nhận: event name, namespace, hoặc sai socket.</span></div>
  <div class="kv"><span class="k">Không frame nào</span><span class="v">Bug phía emit: room rỗng, Redis blip, buffer full.</span></div>
  <div class="kv"><span class="k">Payload sai</span><span class="v">Bug serialization — event fire nhưng dữ liệu lệch.</span></div>
  <div class="kv"><span class="k">Room rỗng</span><span class="v">Một emit tới room không ai join thì không tới ai.</span></div>
  <div class="kv"><span class="k">Buffer full</span><span class="v">Một send buffer dồn ứ làm rớt hoặc trễ frame.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Q2 (event có trên dây?) trả lời bằng đọc frame trong tab Messages.</li><li>Frame CÓ mà handler không chạy = bug phía nhận.</li><li>Không frame nào = bug phía emit (room rỗng, Redis blip, buffer full).</li><li>Frame có nhưng payload sai = bug serialization.</li><li>Tab cho bạn biết phía nào cần debug trước khi đụng mã.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Bài 0.3 — packet format</span><span class="lc-sub">/courses/socket-io/learn — bảng packet types cho đọc DevTools.</span></span></div>
</div>
`,
    },

    {
      title: '10.4 — Q3 and Q4: handler and side effect|||10.4 — Q3 và Q4: handler và side effect',
      slug: 'io-10-4-q34',
      type: 'VIDEO',
      description: 'Handler fire nhưng logic không chạy hết. Side effect (DB write, room join) không happen. Trace bằng breakpoint + DB query.',
      content: `
${G10_4}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.4</span>
<h2>Q3 and Q4: handler and side effect</h2>
<p class="lead">Q1 said client connected. Q2 said event on wire. Handler should run. If it&#39;s not, or if it runs but nothing changes, Q3 and Q4 isolate the last layer.</p>

<h3>Q3: handler running?</h3>
<pre><code class="language-ts">// Set breakpoint hoac console.log
socket.on('chat:send', async (data, ack) =&gt; {
  console.log('handler chat:send fired', data);
  try {
    const msg = await prisma.message.create(...);
    console.log('created message', msg.id);
    ack({ ok: true, id: msg.id });
  } catch (err) {
    console.error('handler error', err);
    ack({ ok: false, error: err.message });
  }
});

// Ket qua console:
// KHONG "handler ... fired" -&gt; event name / socket / namespace sai (Q2)
// CO "fired" nhung KHONG "created" -&gt; error trong prisma (dropped silently)
// CO ca hai -&gt; success — Q4 diagnose UI state
</code></pre>

<h3>Why Q3 fails (the handler never fires)</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">a</span><span class="lz-t">Event name typo</span><span class="lz-d">The server emits &#39;chat:new-message&#39; and the client listens for &#39;chat:new_message&#39;. It is case- and character-sensitive.</span></div>
<div class="lz-step"><span class="lz-k">b</span><span class="lz-t">The handler is registered too late</span><span class="lz-d">The client emits on connect and the handler registers 200ms later. The lesson 1.1 race — the event is lost.</span></div>
<div class="lz-step"><span class="lz-k">c</span><span class="lz-t">Sai socket instance</span><span class="lz-d">There are several <code>io(url)</code> calls in the React tree — each creating a different instance. The handler is registered on instance A and the event arrives at instance B.</span></div>
</div>

<h3>Q4: side effect happened?</h3>
<pre><code class="language-ts">// Handler chay, ack ok, nhung UI KHONG update
// -&gt; Q4: check side effect thuc su happen

// 1. Kiem DB
$ npx prisma studio                     # xem row moi tao chua
$ psql -c "SELECT * FROM message ORDER BY id DESC LIMIT 5"

// 2. Kiem room membership
const room = io.sockets.adapter.rooms.get(&#96;thread:\${id}&#96;);
console.log('room sizes', { threadId: id, size: room?.size });

// 3. Kiem cache
$ redis-cli GET presence:audience:42    # cache invalidate chua?

// 4. Kiem broadcast
io.to(&#96;thread:\${id}&#96;).emit('X', ...);
// -&gt; back to Q2: DevTools Messages tab, co frame khong?
</code></pre>

<h3>Three reasons Q4 fails</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">DB write silent fail</span><span class="lz-nsub">an uncaught await</span></span>
<span class="lz-nbody">An async function that is not awaited swallows its error. Check for <code>await</code> on every Prisma call. Wrap the handler body in try/catch.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">The room is not the room you meant</span><span class="lz-nsub">a typo or a wrong userId</span></span>
<span class="lz-nbody">Emitting to <code>user:${'${uid}'}</code> but <code>uid</code> is undefined → the room name becomes <code>user:undefined</code>. Nobody is in it. Check the TypeScript types. <em>(Measured: <code>tsc --strict</code> reports 0 errors for an optional id inside a template string — build room names in one helper that rejects a bad id.)</em></span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Frontend state does not update</span><span class="lz-nsub">reducer bug</span></span>
<span class="lz-nbody">The handler runs, calls <code>setMessages(...)</code>, and state updates. But the UI does not re-render because of reference equality (a botched immutable update). Inspect state with React DevTools.</span>
</div>
</div>

<div class="callout warn">
<p><strong>A silent Promise rejection is the number-one Q4 bug.</strong> <code>socket.on('X', async ...)</code>. Somewhere in the handler a Promise rejects. Nothing catches it → Node emits <code>unhandledRejection</code> (logged if you have a handler) or crashes in strict mode. The fix: catch it and ack the error. <em>(Measured on Node 22: with no handler the process <strong>exits with code 1</strong> by default and every client sees &quot;transport close&quot;; with a handler like this repo&#39;s <code>src/index.ts:882</code> it stays alive, but the ack never comes.)</em></p>
</div>

<h3>Common bugs at Q4 by feature</h3>
<pre><code class="language-text">Chat message not appearing:
  - DB write OK? (Prisma studio)
  - Broadcast to right room? (log room name + audience)
  - FE state append immutable? (React DevTools)

Presence not updating:
  - onlineUserIds actually add/delete? (log Set)
  - emitPresenceTo called with right audience? (log audience array)
  - Client renderer subscribed to presence updates? (FE useEffect)

Room member list stale:
  - fetchSockets() run? (need adapter)
  - Cache invalidated on join/leave? (Redis DEL)
</code></pre>

<div class="pitfall">
<p><strong>Trap — adding logs in the handler but none around the effect.</strong> The handler fires, the log says &quot;done&quot; — so you consider it done. But the emit that followed failed (Q2), or state never updated (frontend). Log EVERY LAYER of the effect: the DB write, the emit, the frontend state change. Not just handler entry and exit.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Q3 (is the handler running?) is answered by a console.log at the top of the handler — no fire means a wrong event name, socket or timing (Q2 or lesson 1.1); firing but not finishing means a silent Promise rejection. Q4 (did the side effect happen?) checks the DB write, room membership, the follow-on emit and frontend state — and the bug is usually an uncaught async call or a room name containing <code>undefined</code>.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Put a <code>console.log</code> at the top of the handler: no fire means a wrong event name, socket or timing (Q2 or lesson 1.1).</li>
<li>Fires but does not finish? Look for a silent Promise rejection — an unawaited async call swallowing the error.</li>
<li>For Q4, check the DB write, room membership, the follow-on emit and the frontend state — and look hard for a room name that interpolated <code>undefined</code>.</li>
</ol>
<p><strong>Done when:</strong> you can separate &quot;handler never ran&quot; from &quot;handler ran but the side effect failed&quot;.</p></div>

<h3>🔬 Measured: Q3 and Q4 on a real server, a real React page and this repo&#39;s handlers</h3>
<p>A handler attached after an <code>await</code> (the server emits inside <code>io.on(&#39;connection&#39;)</code>) — socket.io does not buffer events for listeners that do not exist yet:</p>
<div class="out">$ node q34.mjs muon      # server phát 'chao' ngay lúc connection · client gắn handler ngay vs sau 200 ms
gắn handler NGAY khi tạo socket      ⇒ 'chao' chạy 1 lần
gắn handler SAU 200 ms (await trước) ⇒ 'chao' chạy 0 lần (khung đã tới lúc chưa ai nghe)</div>
<p>React StrictMode in development mounts an effect, cleans it up and mounts it again — three cleanups, counted:</p>
<div class="out">$ node q34.mjs strict    # giả React StrictMode (mount → cleanup → mount), ba kiểu cleanup
cleanup: off(arrow MỚI), không disconnect    ⇒ server thấy 2 socket · một sự kiện ⇒ handler chạy 2 lần
cleanup: off(cùng hàm), không disconnect     ⇒ server thấy 2 socket · một sự kiện ⇒ handler chạy 1 lần
cleanup: off(cùng hàm) + disconnect()        ⇒ server thấy 1 socket · một sự kiện ⇒ handler chạy 1 lần</div>
<p>An async handler that throws before the ack — socket.io does not catch it:</p>
<div class="out">$ node q34.mjs nem       # handler async ném lỗi DB TRƯỚC khi ack · có / không có process.on('unhandledRejection')
— server CÓ process.on("unhandledRejection") như src/index.ts:882
  [server] handler chat:send fired
  [server] UNHANDLED REJECTION (kept process alive) PrismaClientKnownRequestError: Foreign key constraint failed on the field: &#96;thread_id&#96;
  [client] emitWithAck.timeout(3000) ⇒ operation has timed out @3020 ms
  [client] disconnect: io client disconnect @3322 ms
  [server] tiến trình THOÁT, mã null
— server KHÔNG có handler đó
  [server] handler chat:send fired

Error: PrismaClientKnownRequestError: Foreign key constraint failed on the field: &#96;thread_id&#96;

  [client] disconnect: transport close @35 ms
  [client] emitWithAck.timeout(3000) ⇒ socket has been disconnected @35 ms
  [server] tiến trình THOÁT, mã 1</div>
<p>TypeScript does not catch <code>user:undefined</code>; the repo&#39;s ESLint is <code>eslint:recommended</code> only:</p>
<div class="out">$ cat phong.ts
// phong.ts — TypeScript có bắt room &#96;user:undefined&#96; không? (tsc --strict, như tsconfig của kho)
type Server = { to(room: string): { emit(ev: string, data: unknown): boolean } };
declare const io: Server;
type Order = { id: number; userId?: number };                // select thiếu userId ⇒ kiểu cho phép undefined
declare function layDon(id: number): Order;
const order = layDon(7);
io.to(&#96;user:\${order.userId}&#96;).emit('shop:don-doi-trang-thai', { id: order.id });   // ⇒ "user:undefined" khi thiếu
$ npx tsc -p .           # strict: có bắt room &#96;user:undefined&#96; không?
tsc mã thoát 0 — 0 lỗi
$ grep -n "extends" -A3 .eslintrc.json      # eslint của kho có luật restrict-template-expressions không?
6:  "extends": [
7-    "eslint:recommended"
8-  ],
9-  "parser": "@typescript-eslint/parser",
.eslintrc.json:0
frontend/.eslintrc.json:0</div>
<p>In Chromium with React 18.3.1 (the repo&#39;s version): <code>setTin(cu =&gt; { cu.push(m); return cu })</code> showed <strong>0</strong> of 3 messages, <code>[...cu, m]</code> showed 3 — and when the parent re-rendered on every event too, the in-place version showed 3 as well: the bug hides until the parent stops re-rendering.</p>
<p>This repo&#39;s async socket handlers — one <code>await</code> outside a <code>try</code> with no <code>.catch</code>:</p>
<div class="out">$ node kho104.mjs        # mọi handler async trong src/socket: await nào nằm ngoài try mà không .catch
messaging.socket.ts:546    maker:device:join    try có    · await ngoài try 0 · trong đó không .catch 0
doiKhang.socket.ts:369     dk:tao               try có    · await ngoài try 0 · trong đó không .catch 0
doiKhang.socket.ts:382     dk:vao               try có    · await ngoài try 0 · trong đó không .catch 0
doiKhang.socket.ts:422     dk:moi               try có    · await ngoài try 0 · trong đó không .catch 0
doiKhang.socket.ts:475     dk:tra-loi-moi       try KHÔNG · await ngoài try 1 · trong đó không .catch 0
doiKhang.socket.ts:509     dk:ghep              try KHÔNG · await ngoài try 1 · trong đó không .catch 1  ⚠
doiKhang.socket.ts:646     dk:ban-online        try có    · await ngoài try 0 · trong đó không .catch 0
work.socket.ts:41          work:join            try có    · await ngoài try 0 · trong đó không .catch 0
work.socket.ts:78          work:presence        try KHÔNG · await ngoài try 1 · trong đó không .catch 0
work.socket.ts:100         work:chat:join       try có    · await ngoài try 0 · trong đó không .catch 0
work.socket.ts:125         work:chat:typing     try KHÔNG · await ngoài try 1 · trong đó không .catch 0
work.socket.ts:149         work:feed:subscribe  try có    · await ngoài try 0 · trong đó không .catch 0
$ sed -n '512,516p;524,530p' src/socket/doiKhang.socket.ts
    const hang = (hangGhep.get(tro) ?? []).filter((h) =&gt; h.userId !== user.id &amp;&amp; io.sockets.sockets.has(h.socketId));
    const doiThu = hang.shift();
    if (!doiThu) {
      hang.push({ userId: user.id, socketId: socket.id });
      hangGhep.set(tro, hang);
    await Promise.all([ngoiVao(p, 0, a), ngoiVao(p, 1, b)]);
    p.ghe.forEach((g) =&gt; { g.sanSang = true; });
    p.nghe.set(socket.id, user.id); void socket.join(khoa(p.ma));
    const s2 = io.sockets.sockets.get(doiThu.socketId);
    if (s2) { p.nghe.set(s2.id, doiThu.userId); void s2.join(khoa(p.ma)); }
    io.to(doiThu.socketId).emit('dk:ghep-xong', { maPhong: p.ma });
    traLoi(cb, { ok: true, maPhong: p.ma });</div>
<div class="callout bad"><p><strong>Latent bug in this repo:</strong> <code>src/socket/doiKhang.socket.ts:524</code> (<code>dk:ghep</code>) awaits <code>ngoiVao()</code> (two DB reads) with no try/catch, <em>after</em> the waiting opponent was taken off the queue (<code>hang.shift()</code>, :513). If the DB read rejects, the handler stops: the opponent never receives <code>dk:ghep-xong</code> and is no longer queued, the caller never gets its ack (the client gives up after 6 s), and the server logs one <code>UNHANDLED REJECTION</code>. Fix: try/catch, put the opponent back, ack <code>{ ok: false }</code>. (Found by reading + the generic reproduction above; the DB failure itself was not injected into the repo&#39;s code.)</p></div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash"><span class="tok-comment"># lab c10: q34.mjs tự fork một server socket.io 4.8.3 ở cổng 19973</span>
node q34.mjs muon    <span class="tok-comment">  # server phát ngay lúc connection: gắn handler ngay vs sau 200 ms</span>
node q34.mjs strict  <span class="tok-comment">  # giả React StrictMode: mount → cleanup → mount, ba kiểu cleanup</span>
node q34.mjs nem     <span class="tok-comment">  # handler async ném trước ack: có / không có process.on('unhandledRejection')</span>
(cd tsphong &amp;&amp; npx tsc -p .)                 <span class="tok-comment">  # strict có bắt room user:undefined không</span>
node may104.mjs &amp; open http://localhost:19972/q4.html    <span class="tok-comment">  # React: push tại chỗ vs mảng mới (?cha=1: cha render lại)</span>
node kho104.mjs      <span class="tok-comment">  # mọi handler async trong src/socket của kho</span></code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-2-3-object-array" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 2.3 — Updating objects and arrays immutably</span><span class="lc-sub">Why push + return the same array renders nothing</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-4-1-use-effect" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 4.1 — useEffect, dependencies and cleanup</span><span class="lc-sub">Why StrictMode runs your effect twice</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Q3 handler running</span><span class="v">A log at the top of the handler proves it fired.</span></div>
  <div class="kv"><span class="k">No fire</span><span class="v">Wrong event name, socket or timing (back to Q2 or 1.1).</span></div>
  <div class="kv"><span class="k">Silent Promise rejection</span><span class="v">An unawaited async call that fails without surfacing.</span></div>
  <div class="kv"><span class="k">Q4 side effect</span><span class="v">The DB write, room membership, follow-on emit, frontend state.</span></div>
  <div class="kv"><span class="k">Uncaught async</span><span class="v">The usual Q4 culprit — an error lost in a floating Promise.</span></div>
  <div class="kv"><span class="k">Room name with <code>undefined</code></span><span class="v">An interpolated id that was undefined, so the emit targets nothing.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Q3 (is the handler running?) is answered by a <code>console.log</code> at the top of the handler.</li><li>No fire means a wrong event name, socket or timing (Q2 or lesson 1.1).</li><li>Firing but not finishing means a silent Promise rejection.</li><li>Q4 checks the DB write, room membership, the follow-on emit and frontend state.</li><li>The bug is usually an uncaught async call or a room name containing <code>undefined</code>.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Node.js — unhandledRejection</span><span class="lc-sub">nodejs.org/api/process.html#event-unhandledrejection — catch handler globally.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.4</span>
<h2>Q3 và Q4: handler và side effect</h2>
<p class="lead">Q1 nói client connected. Q2 nói event on wire. Handler nên chạy. Nếu không, hoặc nếu chạy nhưng không đổi gì, Q3 và Q4 tách tầng cuối.</p>

<h3>Q3: handler running?</h3>
<pre><code class="language-ts">// Set breakpoint hoac console.log
socket.on('chat:send', async (data, ack) =&gt; {
  console.log('handler chat:send fired', data);
  try {
    const msg = await prisma.message.create(...);
    console.log('created message', msg.id);
    ack({ ok: true, id: msg.id });
  } catch (err) {
    console.error('handler error', err);
    ack({ ok: false, error: err.message });
  }
});

// Ket qua console:
// KHONG "handler ... fired" -&gt; event name / socket / namespace sai (Q2)
// CO "fired" nhung KHONG "created" -&gt; error trong prisma (dropped silently)
// CO ca hai -&gt; success — Q4 diagnose UI state
</code></pre>

<h3>Nguyên nhân Q3 fail (handler không fire)</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">a</span><span class="lz-t">Event name typo</span><span class="lz-d">Server emit &#39;chat:new-message&#39;, client on &#39;chat:new_message&#39;. Case- và char-sensitive.</span></div>
<div class="lz-step"><span class="lz-k">b</span><span class="lz-t">Handler đăng ký muộn</span><span class="lz-d">Client emit event ngay khi connect, handler đăng ký sau 200ms. Bài 1.1 race — event mất.</span></div>
<div class="lz-step"><span class="lz-k">c</span><span class="lz-t">Sai socket instance</span><span class="lz-d">Có nhiều <code>io(url)</code> call trong React — mỗi cái tạo instance khác. Handler đăng ký trên instance A, event đến instance B.</span></div>
</div>

<h3>Q4: side effect happened?</h3>
<pre><code class="language-ts">// Handler chay, ack ok, nhung UI KHONG update
// -&gt; Q4: check side effect thuc su happen

// 1. Kiem DB
$ npx prisma studio                     # xem row moi tao chua
$ psql -c "SELECT * FROM message ORDER BY id DESC LIMIT 5"

// 2. Kiem room membership
const room = io.sockets.adapter.rooms.get(&#96;thread:\${id}&#96;);
console.log('room sizes', { threadId: id, size: room?.size });

// 3. Kiem cache
$ redis-cli GET presence:audience:42    # cache invalidate chua?

// 4. Kiem broadcast
io.to(&#96;thread:\${id}&#96;).emit('X', ...);
// -&gt; back to Q2: DevTools Messages tab, co frame khong?
</code></pre>

<h3>Ba nguyên nhân Q4 fail</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">DB write silent fail</span><span class="lz-nsub">await không catch</span></span>
<span class="lz-nbody">Async function không await → error swallow. Kiểm <code>await</code> mọi Prisma call. Try/catch quanh handler body.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Room khác room mong</span><span class="lz-nsub">typo hoặc userId sai</span></span>
<span class="lz-nbody">Emit tới <code>user:${'${uid}'}</code> nhưng <code>uid</code> undefined → room name là <code>user:undefined</code>. Không client nào ở đó. Kiểm typescript type. <em>(Đo: <code>tsc --strict</code> báo 0 lỗi cho id tuỳ chọn nằm trong template string — dựng tên room bằng một hàm duy nhất từ chối id sai.)</em></span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">FE state không update</span><span class="lz-nsub">reducer bug</span></span>
<span class="lz-nbody">Handler chạy, gọi <code>setMessages(...)</code>, state update. Nhưng UI không rerender vì reference equality (immutable update sai). React DevTools kiểm state.</span>
</div>
</div>

<div class="callout warn">
<p><strong>Silent Promise rejection là bug số 1 ở Q4.</strong> <code>socket.on('X', async ...)</code>. Trong handler, một Promise rejects. Không catch → Node emit <code>unhandledRejection</code> (log nếu có handler) hoặc crash trong strict mode. Vá: catch + ack error. <em>(Đo trên Node 22: không có handler thì tiến trình <strong>thoát mã 1</strong> ngay theo mặc định, mọi client thấy &quot;transport close&quot;; có handler như <code>src/index.ts:882</code> của kho thì sống, nhưng ack không bao giờ tới.)</em></p>
</div>

<h3>Common bug tại Q4 by feature</h3>
<pre><code class="language-text">Chat message not appearing:
  - DB write OK? (Prisma studio)
  - Broadcast to right room? (log room name + audience)
  - FE state append immutable? (React DevTools)

Presence not updating:
  - onlineUserIds actually add/delete? (log Set)
  - emitPresenceTo called with right audience? (log audience array)
  - Client renderer subscribed to presence updates? (FE useEffect)

Room member list stale:
  - fetchSockets() run? (need adapter)
  - Cache invalidated on join/leave? (Redis DEL)
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — thêm log ở handler, không log ở effect.</strong> Handler fire, log say &quot;done&quot; — bạn cho là done. Nhưng emit sau đó fail (Q2), state không update (FE). Log MỌI TẦNG effect: DB write, emit, FE state change. Không chỉ handler entry/exit.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Q3 (handler running?) trả lời bằng console.log đầu handler — không fire = event name/socket/timing sai (Q2 hoặc bài 1.1), fire nhưng không hoàn tất = silent Promise rejection; Q4 (side effect?) kiểm DB write + room membership + emit fire lại + FE state — thường bug là async không catch hoặc room name có <code>undefined</code>.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Đặt một <code>console.log</code> ở đầu handler: không fire nghĩa là sai event name, socket hoặc timing (Q2 hoặc bài 1.1).</li>
<li>Fire nhưng không hoàn tất? Tìm một silent Promise rejection — một async không await nuốt mất lỗi.</li>
<li>Với Q4, kiểm DB write, room membership, emit tiếp theo và state frontend — và soi kỹ một room name đã nội suy <code>undefined</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn tách được &quot;handler không chạy&quot; với &quot;handler chạy nhưng side effect hỏng&quot;.</p></div>

<h3>🔬 Đo thật: Q3 và Q4 trên server thật, trang React thật và các handler của kho</h3>
<p>Handler gắn sau một <code>await</code> (server phát ngay trong <code>io.on(&#39;connection&#39;)</code>) — socket.io không giữ sự kiện cho listener chưa tồn tại:</p>
<div class="out">$ node q34.mjs muon      # server phát 'chao' ngay lúc connection · client gắn handler ngay vs sau 200 ms
gắn handler NGAY khi tạo socket      ⇒ 'chao' chạy 1 lần
gắn handler SAU 200 ms (await trước) ⇒ 'chao' chạy 0 lần (khung đã tới lúc chưa ai nghe)</div>
<p>React StrictMode ở chế độ dev gắn effect, dọn, rồi gắn lại — ba kiểu cleanup, đếm thật:</p>
<div class="out">$ node q34.mjs strict    # giả React StrictMode (mount → cleanup → mount), ba kiểu cleanup
cleanup: off(arrow MỚI), không disconnect    ⇒ server thấy 2 socket · một sự kiện ⇒ handler chạy 2 lần
cleanup: off(cùng hàm), không disconnect     ⇒ server thấy 2 socket · một sự kiện ⇒ handler chạy 1 lần
cleanup: off(cùng hàm) + disconnect()        ⇒ server thấy 1 socket · một sự kiện ⇒ handler chạy 1 lần</div>
<p>Handler async ném lỗi trước ack — socket.io không bắt:</p>
<div class="out">$ node q34.mjs nem       # handler async ném lỗi DB TRƯỚC khi ack · có / không có process.on('unhandledRejection')
— server CÓ process.on("unhandledRejection") như src/index.ts:882
  [server] handler chat:send fired
  [server] UNHANDLED REJECTION (kept process alive) PrismaClientKnownRequestError: Foreign key constraint failed on the field: &#96;thread_id&#96;
  [client] emitWithAck.timeout(3000) ⇒ operation has timed out @3020 ms
  [client] disconnect: io client disconnect @3322 ms
  [server] tiến trình THOÁT, mã null
— server KHÔNG có handler đó
  [server] handler chat:send fired

Error: PrismaClientKnownRequestError: Foreign key constraint failed on the field: &#96;thread_id&#96;

  [client] disconnect: transport close @35 ms
  [client] emitWithAck.timeout(3000) ⇒ socket has been disconnected @35 ms
  [server] tiến trình THOÁT, mã 1</div>
<p>TypeScript không bắt <code>user:undefined</code>; ESLint của kho chỉ có <code>eslint:recommended</code>:</p>
<div class="out">$ cat phong.ts
// phong.ts — TypeScript có bắt room &#96;user:undefined&#96; không? (tsc --strict, như tsconfig của kho)
type Server = { to(room: string): { emit(ev: string, data: unknown): boolean } };
declare const io: Server;
type Order = { id: number; userId?: number };                // select thiếu userId ⇒ kiểu cho phép undefined
declare function layDon(id: number): Order;
const order = layDon(7);
io.to(&#96;user:\${order.userId}&#96;).emit('shop:don-doi-trang-thai', { id: order.id });   // ⇒ "user:undefined" khi thiếu
$ npx tsc -p .           # strict: có bắt room &#96;user:undefined&#96; không?
tsc mã thoát 0 — 0 lỗi
$ grep -n "extends" -A3 .eslintrc.json      # eslint của kho có luật restrict-template-expressions không?
6:  "extends": [
7-    "eslint:recommended"
8-  ],
9-  "parser": "@typescript-eslint/parser",
.eslintrc.json:0
frontend/.eslintrc.json:0</div>
<p>Trong Chromium với React 18.3.1 (bản của kho): <code>setTin(cu =&gt; { cu.push(m); return cu })</code> hiện <strong>0</strong>/3 tin, <code>[...cu, m]</code> hiện 3 — và khi component cha cũng render lại mỗi sự kiện, bản sửa tại chỗ cũng hiện 3: lỗi bị che cho tới khi cha thôi render.</p>
<p>Các handler socket async của kho — một <code>await</code> nằm ngoài <code>try</code> mà không có <code>.catch</code>:</p>
<div class="out">$ node kho104.mjs        # mọi handler async trong src/socket: await nào nằm ngoài try mà không .catch
messaging.socket.ts:546    maker:device:join    try có    · await ngoài try 0 · trong đó không .catch 0
doiKhang.socket.ts:369     dk:tao               try có    · await ngoài try 0 · trong đó không .catch 0
doiKhang.socket.ts:382     dk:vao               try có    · await ngoài try 0 · trong đó không .catch 0
doiKhang.socket.ts:422     dk:moi               try có    · await ngoài try 0 · trong đó không .catch 0
doiKhang.socket.ts:475     dk:tra-loi-moi       try KHÔNG · await ngoài try 1 · trong đó không .catch 0
doiKhang.socket.ts:509     dk:ghep              try KHÔNG · await ngoài try 1 · trong đó không .catch 1  ⚠
doiKhang.socket.ts:646     dk:ban-online        try có    · await ngoài try 0 · trong đó không .catch 0
work.socket.ts:41          work:join            try có    · await ngoài try 0 · trong đó không .catch 0
work.socket.ts:78          work:presence        try KHÔNG · await ngoài try 1 · trong đó không .catch 0
work.socket.ts:100         work:chat:join       try có    · await ngoài try 0 · trong đó không .catch 0
work.socket.ts:125         work:chat:typing     try KHÔNG · await ngoài try 1 · trong đó không .catch 0
work.socket.ts:149         work:feed:subscribe  try có    · await ngoài try 0 · trong đó không .catch 0
$ sed -n '512,516p;524,530p' src/socket/doiKhang.socket.ts
    const hang = (hangGhep.get(tro) ?? []).filter((h) =&gt; h.userId !== user.id &amp;&amp; io.sockets.sockets.has(h.socketId));
    const doiThu = hang.shift();
    if (!doiThu) {
      hang.push({ userId: user.id, socketId: socket.id });
      hangGhep.set(tro, hang);
    await Promise.all([ngoiVao(p, 0, a), ngoiVao(p, 1, b)]);
    p.ghe.forEach((g) =&gt; { g.sanSang = true; });
    p.nghe.set(socket.id, user.id); void socket.join(khoa(p.ma));
    const s2 = io.sockets.sockets.get(doiThu.socketId);
    if (s2) { p.nghe.set(s2.id, doiThu.userId); void s2.join(khoa(p.ma)); }
    io.to(doiThu.socketId).emit('dk:ghep-xong', { maPhong: p.ma });
    traLoi(cb, { ok: true, maPhong: p.ma });</div>
<div class="callout bad"><p><strong>Lỗi tiềm ẩn của kho:</strong> <code>src/socket/doiKhang.socket.ts:524</code> (<code>dk:ghep</code>) await <code>ngoiVao()</code> (hai lượt đọc DB) không có try/catch, <em>sau khi</em> đối thủ đang chờ đã bị lấy khỏi hàng (<code>hang.shift()</code>, :513). Nếu lượt đọc DB lỗi, handler dừng: đối thủ không bao giờ nhận <code>dk:ghep-xong</code> mà cũng không còn trong hàng chờ, người gọi không có ack (client bỏ cuộc sau 6 s), server chỉ log một dòng <code>UNHANDLED REJECTION</code>. Sửa: try/catch, trả đối thủ về hàng, ack <code>{ ok: false }</code>. (Tìm bằng đọc mã + tái hiện dạng chung ở trên; chưa tiêm lỗi DB vào chính mã kho.)</p></div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash"><span class="tok-comment"># lab c10: q34.mjs tự fork một server socket.io 4.8.3 ở cổng 19973</span>
node q34.mjs muon    <span class="tok-comment">  # server phát ngay lúc connection: gắn handler ngay vs sau 200 ms</span>
node q34.mjs strict  <span class="tok-comment">  # giả React StrictMode: mount → cleanup → mount, ba kiểu cleanup</span>
node q34.mjs nem     <span class="tok-comment">  # handler async ném trước ack: có / không có process.on('unhandledRejection')</span>
(cd tsphong &amp;&amp; npx tsc -p .)                 <span class="tok-comment">  # strict có bắt room user:undefined không</span>
node may104.mjs &amp; open http://localhost:19972/q4.html    <span class="tok-comment">  # React: push tại chỗ vs mảng mới (?cha=1: cha render lại)</span>
node kho104.mjs      <span class="tok-comment">  # mọi handler async trong src/socket của kho</span></code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-2-3-object-array" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 2.3 — Cập nhật object và mảng bất biến</span><span class="lc-sub">Vì sao push rồi trả lại mảng cũ không render gì</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-4-1-use-effect" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 4.1 — useEffect, dependency và cleanup</span><span class="lc-sub">Vì sao Strict Mode chạy effect hai lần</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Q3 handler chạy</span><span class="v">Một log ở đầu handler chứng minh nó đã fire.</span></div>
  <div class="kv"><span class="k">Không fire</span><span class="v">Sai event name, socket hoặc timing (về Q2 hoặc 1.1).</span></div>
  <div class="kv"><span class="k">Silent Promise rejection</span><span class="v">Một async không await fail mà không hiện ra.</span></div>
  <div class="kv"><span class="k">Q4 side effect</span><span class="v">DB write, room membership, emit tiếp theo, state frontend.</span></div>
  <div class="kv"><span class="k">Async không catch</span><span class="v">Thủ phạm Q4 thường gặp — một lỗi mất trong một Promise trôi nổi.</span></div>
  <div class="kv"><span class="k">Room name có <code>undefined</code></span><span class="v">Một id nội suy bị undefined, nên emit không nhắm vào gì.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Q3 (handler có chạy?) trả lời bằng một <code>console.log</code> ở đầu handler.</li><li>Không fire nghĩa là sai event name, socket hoặc timing (Q2 hoặc bài 1.1).</li><li>Fire nhưng không hoàn tất nghĩa là một silent Promise rejection.</li><li>Q4 kiểm DB write, room membership, emit tiếp theo và state frontend.</li><li>Bug thường là một async không catch hoặc một room name chứa <code>undefined</code>.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Node.js — unhandledRejection</span><span class="lc-sub">nodejs.org/api/process.html#event-unhandledrejection — catch handler globally.</span></span></div>
</div>
`,
    },

    {
      title: '10.5 — Cluster-specific bugs|||10.5 — Bug đặc thù cluster',
      slug: 'io-10-5-cluster-bugs',
      type: 'VIDEO',
      description: 'Random 1/N users không nhận = Redis adapter chưa attach. Poll 400 = sticky sessions thiếu. Presence flap = state không share qua worker.',
      content: `
${G10_5}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.5</span>
<h2>Cluster-specific bugs</h2>
<p class="lead">Single-instance socket.io: 90% of bugs are in your code. Cluster: half your bugs are in the cluster setup. This lesson catalogs the three most common cluster bugs.</p>

<h3>Bug 1: a random 1/N of users receive no events</h3>
<pre><code class="language-text">Symptom: 
  - Chat message send OK
  - Chi ~25% users trong thread nhan (voi 4 worker)
  - Random which users — reload page co the fix (rerouted worker)

Root cause: Redis adapter khong attached
  Kiem log:
    "Socket.IO Redis adapter attached (cross-worker broadcasts enabled)"  -&gt; OK
    "Socket.IO Redis adapter NOT attached — in-memory only"                -&gt; BUG

Fix: 
  - Kiem REDIS_URL env available
  - Kiem redis process alive: docker ps | grep redis
  - Kiem network tu backend to redis: docker exec backend nc -zv redis 6379
</code></pre>

<h3>Bug 2: polling HTTP 400 &quot;Session ID unknown&quot;</h3>
<pre><code class="language-text">Symptom:
  - Client connect OK ban dau
  - Sau vai giay, thay HTTP 400 trong Network tab
  - Chat lag, event khong on den
  - Reload page, hoat dong lai vai giay

Root cause: khong co sticky sessions
  Client's POST init to worker A -&gt; sid X
  Client's follow-up GET routed by nginx to worker B -&gt; sid X unknown -&gt; 400

Fix: nginx sticky
  upstream backend {
    hash $cookie_io;                      # sticky theo cookie io
    # DO 14/11/2026: KHONG sticky — luot bat tay chua co cookie, khoa rong bi chia luan phien (7/20 client polling noi duoc).
    # Dung: ip_hash;  (20/20) — hoac sticky theo sid, hoac chi WebSocket
    server backend-1:3000;
    server backend-2:3000;
  }
</code></pre>

<h3>Bug 3: presence flickers in a cluster</h3>
<pre><code class="language-text">Symptom:
  - User online 3 tab (worker A, B, C)
  - Dong 1 tab -&gt; presence flap offline/online cho ban be
  - Repeat cua bai 4.3 bug nhung o cluster

Root cause: socketsByUser Map trong-process
  Worker A biet: user 42 co 1 socket (tab 1)
  Worker B biet: user 42 co 1 socket (tab 2)
  Worker C biet: user 42 co 1 socket (tab 3)
  Tab 1 close (worker A): worker A set size 0 -&gt; emit offline
  200ms sau tab 2 event: worker B thay khong cham -&gt; ignore
  UI ban be: flap

Fix: Redis SADD/SCARD
  Ma 4.3 pattern nhung state trong Redis, khong Map
</code></pre>

<h3>Debug — subscribe Redis PSUBSCRIBE</h3>
<pre><code class="language-bash"># Terminal 1: subscribe moi socket.io pub/sub
$ redis-cli PSUBSCRIBE 'socket.io#*'
1) "psubscribe"
2) "socket.io#*"
3) (integer) 1

# Terminal 2: trigger mot emit tu server
# Thay:
4) "pmessage"
5) "socket.io#*"
6) "socket.io#/#thread:42"
7) &lt;binary msgpack payload&gt;

# Neu KHONG THAY: adapter NOT publishing -&gt; adapter khong attach
# Neu THAY: publish OK, but check worker subscribers
</code></pre>

<h3>Health check per worker</h3>
<pre><code class="language-ts">// Expose endpoint tra ve adapter status
app.get('/health/socket', async (req, res) =&gt; {
  const io = getIO();
  res.json({
    workerId: process.pid,
    adapter: io.of('/').adapter.constructor.name,     // "RedisAdapter" hoac "Adapter"
    connected: io.sockets.sockets.size,
    rooms: io.sockets.adapter.rooms.size,
  });
});

// Curl each worker via load balancer:
$ for i in 1 2 3 4; do curl -s http://backend-$i/health/socket; done
# (curl QUA bo can bang tai khong chon duoc worker — goi thang tung worker, hoac in dong nay luc khoi dong)
# adapter phai la "RedisAdapter" cho MOI worker
</code></pre>

<div class="pitfall">
<p><strong>Trap — deploying a cluster without ever testing one in dev.</strong> Dev is single-instance, so cluster bugs are invisible there. A local Docker Compose can run 2 backend services behind an nginx load balancer to reproduce cluster bugs in dev.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Three cluster-specific bugs: (1) a random 1/N of users receiving nothing means the Redis adapter never attached, (2) HTTP 400 &quot;sid unknown&quot; on polls means sticky sessions are missing, (3) presence flapping means in-process state is not shared across workers (fix: Redis SADD/SCARD) — a per-worker health endpoint, Redis PSUBSCRIBE, and local cluster testing are the three tools for debugging a cluster.</p>
</div>

<h3>Telling the three cluster bugs apart</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">A fraction of users miss every event</span><span class="lz-d">Exactly 1/N of them, where N is the worker count. That ratio is the signature: the adapter is not wired, so each worker only reaches its own sockets.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Polling returns HTTP 400, session unknown</span><span class="lz-d">The handshake landed on one worker and the next poll on another. Sticky sessions are missing, or the balancer is not honouring them.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Presence flickers</span><span class="lz-d">The count is read from the local socket map, so it changes depending on which worker answered. Nothing is actually connecting and disconnecting.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Confirm with PSUBSCRIBE</span><span class="lz-d">Watching the Redis channel shows whether events are crossing workers at all — which separates &quot;adapter not working&quot; from &quot;event never emitted&quot;.</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — a cluster bug that is invisible in development because there is one worker.</strong> Every failure in this lesson requires N greater than one, and <code>npm run dev</code> runs a single process — so the adapter can be missing entirely, sticky sessions unconfigured, and presence read from the local map, and everything works perfectly on your machine. The first symptom is a production report that a fraction of users see nothing, and the fraction is the clue nobody recognises. Run two workers locally when you touch anything real-time: <code>PORT=3000 node server.js</code> twice behind a small proxy is enough to make all three bugs reproducible before they ship.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Reproduce bug 1: a random 1/N of users receive nothing — confirm it is the Redis adapter never attaching.</li>
<li>Reproduce bug 2 (HTTP 400 &quot;sid unknown&quot; on polls = missing stickiness) and bug 3 (presence flapping = in-process state not shared; fix with Redis <code>SADD</code>/<code>SCARD</code>).</li>
<li>Run two workers locally behind a small proxy so all three become reproducible before they ship, and add a per-worker health endpoint plus Redis <code>PSUBSCRIBE</code>.</li>
</ol>
<p><strong>Done when:</strong> you can map each of the three symptoms to its cause and reproduce them with two local workers.</p></div>

<h3>🔬 Measured: the three cluster bugs, reproduced on one laptop</h3>
<p>Bug 1 — four real worker processes, one user each in <code>thread:42</code>, worker 0 emits; then this repo&#39;s own <code>attachRedisAdapter</code>, run by its test, printing the two log lines the page quotes:</p>
<div class="out">$ node cum.mjs khong 4      # cụm 4 worker, adapter KHÔNG gắn · mỗi worker một người trong thread:42
/health/socket worker 0: {"workerId":14171,"adapter":"Adapter","connected":1}
/health/socket worker 1: {"workerId":14172,"adapter":"Adapter","connected":1}
/health/socket worker 2: {"workerId":14173,"adapter":"Adapter","connected":1}
/health/socket worker 3: {"workerId":14174,"adapter":"Adapter","connected":1}
adapter KHÔNG gắn (RAM) · 4 worker · worker 0 phát vào thread:42 ⇒ nhận: Nam-0 1 · Nam-1 0 · Nam-2 0 · Nam-3 0 ⇒ 1/4 người
$ node cum.mjs redis 4      # cùng cụm, Redis adapter (sio-redis)
/health/socket worker 0: {"workerId":14188,"adapter":"RedisAdapter","connected":1}
/health/socket worker 1: {"workerId":14217,"adapter":"RedisAdapter","connected":1}
/health/socket worker 2: {"workerId":14218,"adapter":"RedisAdapter","connected":1}
/health/socket worker 3: {"workerId":14220,"adapter":"RedisAdapter","connected":1}
adapter Redis · 4 worker · worker 0 phát vào thread:42 ⇒ nhận: Nam-0 1 · Nam-1 1 · Nam-2 1 · Nam-3 1 ⇒ 4/4 người
$ npx tsx --test src/socket/redisAdapterGan.test.ts      # hàm attachRedisAdapter THẬT của kho: dòng log nó in ra
# [2026-11-14T01:17:34.864Z] WARN  Socket.IO Redis adapter NOT attached — in-memory only (single instance) {"error":"Redis chưa sẵn sàng sau 20 ms"}
# [2026-11-14T01:17:35.021Z] INFO  Socket.IO Redis adapter attached (cross-worker broadcasts enabled)
# [2026-11-14T01:17:35.022Z] WARN  Socket.IO Redis adapter NOT attached — in-memory only (single instance) {"error":"down"}</div>
<div class="callout info"><p><strong>Since 13/11/2026 (82084b1e2):</strong> if Redis is not ready within 5 s at boot, a worker stays on the in-memory adapter for its whole life (no late attach, which used to drop every room). Correct for one instance — in a cluster that worker is an island: exactly bug 1, until it restarts. Alert on the WARN line.</p></div>
<p>Bug 2 — a real nginx in front of two workers, 20 polling-only clients through each strategy, then one sid POSTed four times through round-robin:</p>
<div class="out">$ cat nginx/nginx.conf | grep upstream       # ba cách chia request cho 2 worker
  upstream rr     { server host.docker.internal:19985; server host.docker.internal:19986; }
  upstream cookie { hash $cookie_io; server host.docker.internal:19985; server host.docker.internal:19986; }
  upstream iphash { ip_hash; server host.docker.internal:19985; server host.docker.internal:19986; }
$ node stk.mjs        # 20 client chỉ polling (như sau proxy chặn WebSocket) qua từng cách chia
round-robin      ⇒ 20 client polling: 4 connect · 34 lỗi (connect_error / disconnect) trong 4 s
hash $cookie_io  ⇒ 20 client polling: 7 connect · 28 lỗi (connect_error / disconnect) trong 4 s
ip_hash          ⇒ 20 client polling: 20 connect · 0 lỗi (connect_error / disconnect) trong 4 s
$ SID=…; for i in 1 2 3 4; do curl -s -X POST -d 6 "localhost:19987/socket.io/?EIO=4&amp;transport=polling&amp;sid=$SID"; done     # round-robin, một sid
{"code":1,"message":"Session ID unknown"} HTTP 400
ok HTTP 200
{"code":1,"message":"Session ID unknown"} HTTP 400
ok HTTP 200</div>
<div class="callout bad"><p><strong>The fix above does not work:</strong> <code>hash $cookie_io</code> connected 7/20 (also with <code>cookie: true</code> on the server: 2/20). The handshake request carries no <code>io</code> cookie yet, and nginx spreads an empty hash key round-robin. Use <code>ip_hash</code> (20/20), sticky-by-sid, or WebSocket-only (lesson 2.3).</p></div>
<p>Bug 3 — user 7 with one tab per worker (lab of lesson 4.3), tab A closed:</p>
<div class="out">$ node cum.mjs      # (lab 4.3) user 7: tab A ở worker 1, tab B ở worker 2, Redis adapter · ba cách đếm khi đóng tab A
— đóng tab A (worker 1), tab B vẫn mở ở worker 2 —
worker 1 (thật: còn 1 tab) · quét worker này: 0 ⇒ offline ✗ · SCARD: 1 ⇒ online ✓ · fetchSockets: 1 ⇒ online ✓ (3,0 ms)
— đóng tab B (worker 2), tab cuối —
worker 2 (thật: còn 0 tab) · quét worker này: 0 ⇒ offline ✓ · SCARD: 0 ⇒ offline ✓ · fetchSockets: 0 ⇒ offline ✓ (2,1 ms)
Redis còn: SMEMBERS presence:sockets:7 = []</div>
<p>Where this repo would break first — the offline decision scans <code>io.sockets.sockets</code> (this process only) and <code>onlineUserIds</code> is a local <code>Set</code>; no per-worker health line exists:</p>
<div class="out">$ sed -n '610,616p' src/socket/messaging.socket.ts      # kho quyết định "offline" bằng gì
    socket.on('disconnect', () =&gt; {
      // Only mark offline if this was the last open socket for the
      // user (multi-tab case).
      const socketsForUser = Array.from(io?.sockets.sockets.values() ?? [])
        .filter((s) =&gt; (s.data.user as { id: number } | undefined)?.id === user.id);
      if (socketsForUser.length === 0) {
        onlineUserIds.delete(user.id);
$ grep -n "const onlineUserIds" src/socket/messaging.socket.ts ; grep -rn "health/socket\\|adapter.constructor" src | grep -v test | wc -l
182:const onlineUserIds = new Set&lt;number&gt;();
       0</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash"><span class="tok-comment"># lab c10 — cụm thật trên một máy</span>
node cum.mjs khong 4 ; node cum.mjs redis 4      <span class="tok-comment">  # 4 worker (fork), không / có Redis adapter: ai nhận, dòng /health/socket</span>
npx tsx --test src/socket/redisAdapterGan.test.ts<span class="tok-comment">  # (trong api-backend) log thật của attachRedisAdapter</span>
docker run -d --name sio-nginx-105 -p 127.0.0.1:19987:8001 -p 127.0.0.1:19988:8002 -p 127.0.0.1:19989:8003 \\
  -v $PWD/nginx/nginx.conf:/etc/nginx/nginx.conf:ro nginx:1.27-alpine
node w105.mjs 19985 A &amp;  node w105.mjs 19986 B &amp;
node stk.mjs                                     <span class="tok-comment">  # 20 client polling qua round-robin · hash $cookie_io · ip_hash</span>
(cd ../c4 &amp;&amp; node cum.mjs)                       <span class="tok-comment">  # presence 2 worker: quét cục bộ vs SCARD vs fetchSockets</span></code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nginx/learn?lessonSlug=nginx-9-1-khoi-upstream" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Nginx · 9.1 — The upstream block and four ways to pick a server</span><span class="lc-sub">ip_hash, hash, and why an empty key goes round-robin</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/deploy-vps/learn?lessonSlug=deploy-14-2-hai-may-can-bang-tai" target="_blank" rel="noopener"><span class="lc-ico">🚀</span><span class="lc-body"><span class="lc-title">Deploy to a VPS · 14.2 — Two machines behind a load balancer</span><span class="lc-sub">Health checks, state and rolling deploys</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Random 1/N receive nothing</span><span class="v">The Redis adapter was never attached.</span></div>
  <div class="kv"><span class="k">HTTP 400 &quot;sid unknown&quot;</span><span class="v">Polls hitting different workers — sticky sessions missing.</span></div>
  <div class="kv"><span class="k">Presence flapping</span><span class="v">In-process state not shared across workers (fix: Redis <code>SADD</code>/<code>SCARD</code>).</span></div>
  <div class="kv"><span class="k">Per-worker health endpoint</span><span class="v">Shows which worker is misbehaving.</span></div>
  <div class="kv"><span class="k">Redis <code>PSUBSCRIBE</code></span><span class="v">Watch adapter pub/sub traffic across workers.</span></div>
  <div class="kv"><span class="k">Local cluster testing</span><span class="v">Two workers behind a small proxy to reproduce before shipping.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Three cluster-specific bugs recur.</li><li>A random 1/N of users receiving nothing means the Redis adapter never attached.</li><li>HTTP 400 &quot;sid unknown&quot; on polls means sticky sessions are missing.</li><li>Presence flapping means in-process state is not shared (fix: Redis <code>SADD</code>/<code>SCARD</code>).</li><li>The three tools are a per-worker health endpoint, Redis <code>PSUBSCRIBE</code>, and local cluster testing.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Lesson 5.1 — the Redis adapter</span><span class="lc-sub">/courses/socket-io/learn — cách attach adapter đúng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Lesson 2.3 — sticky sessions</span><span class="lc-sub">/courses/socket-io/learn — cấu hình nginx cho polling.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.5</span>
<h2>Bug đặc thù cluster</h2>
<p class="lead">Single-instance socket.io: 90% bug trong code bạn. Cluster: một nửa bug trong setup cluster. Bài này liệt kê ba bug cluster phổ biến nhất.</p>

<h3>Bug 1: random 1/N users không nhận events</h3>
<pre><code class="language-text">Symptom: 
  - Chat message send OK
  - Chi ~25% users trong thread nhan (voi 4 worker)
  - Random which users — reload page co the fix (rerouted worker)

Root cause: Redis adapter khong attached
  Kiem log:
    "Socket.IO Redis adapter attached (cross-worker broadcasts enabled)"  -&gt; OK
    "Socket.IO Redis adapter NOT attached — in-memory only"                -&gt; BUG

Fix: 
  - Kiem REDIS_URL env available
  - Kiem redis process alive: docker ps | grep redis
  - Kiem network tu backend to redis: docker exec backend nc -zv redis 6379
</code></pre>

<h3>Bug 2: polling HTTP 400 &quot;Session ID unknown&quot;</h3>
<pre><code class="language-text">Symptom:
  - Client connect OK ban dau
  - Sau vai giay, thay HTTP 400 trong Network tab
  - Chat lag, event khong on den
  - Reload page, hoat dong lai vai giay

Root cause: khong co sticky sessions
  Client's POST init to worker A -&gt; sid X
  Client's follow-up GET routed by nginx to worker B -&gt; sid X unknown -&gt; 400

Fix: nginx sticky
  upstream backend {
    hash $cookie_io;                      # sticky theo cookie io
    # DO 14/11/2026: KHONG sticky — luot bat tay chua co cookie, khoa rong bi chia luan phien (7/20 client polling noi duoc).
    # Dung: ip_hash;  (20/20) — hoac sticky theo sid, hoac chi WebSocket
    server backend-1:3000;
    server backend-2:3000;
  }
</code></pre>

<h3>Bug 3: presence flickers ở cluster</h3>
<pre><code class="language-text">Symptom:
  - User online 3 tab (worker A, B, C)
  - Dong 1 tab -&gt; presence flap offline/online cho ban be
  - Repeat cua bai 4.3 bug nhung o cluster

Root cause: socketsByUser Map trong-process
  Worker A biet: user 42 co 1 socket (tab 1)
  Worker B biet: user 42 co 1 socket (tab 2)
  Worker C biet: user 42 co 1 socket (tab 3)
  Tab 1 close (worker A): worker A set size 0 -&gt; emit offline
  200ms sau tab 2 event: worker B thay khong cham -&gt; ignore
  UI ban be: flap

Fix: Redis SADD/SCARD
  Ma 4.3 pattern nhung state trong Redis, khong Map
</code></pre>

<h3>Debug — subscribe Redis PSUBSCRIBE</h3>
<pre><code class="language-bash"># Terminal 1: subscribe moi socket.io pub/sub
$ redis-cli PSUBSCRIBE 'socket.io#*'
1) "psubscribe"
2) "socket.io#*"
3) (integer) 1

# Terminal 2: trigger mot emit tu server
# Thay:
4) "pmessage"
5) "socket.io#*"
6) "socket.io#/#thread:42"
7) &lt;binary msgpack payload&gt;

# Neu KHONG THAY: adapter NOT publishing -&gt; adapter khong attach
# Neu THAY: publish OK, but check worker subscribers
</code></pre>

<h3>Health check per worker</h3>
<pre><code class="language-ts">// Expose endpoint tra ve adapter status
app.get('/health/socket', async (req, res) =&gt; {
  const io = getIO();
  res.json({
    workerId: process.pid,
    adapter: io.of('/').adapter.constructor.name,     // "RedisAdapter" hoac "Adapter"
    connected: io.sockets.sockets.size,
    rooms: io.sockets.adapter.rooms.size,
  });
});

// Curl each worker via load balancer:
$ for i in 1 2 3 4; do curl -s http://backend-$i/health/socket; done
# (curl QUA bo can bang tai khong chon duoc worker — goi thang tung worker, hoac in dong nay luc khoi dong)
# adapter phai la "RedisAdapter" cho MOI worker
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — deploy cluster mà chưa test cluster ở dev.</strong> Dev là single-instance, cluster bugs không visible. Local Docker Compose có thể chạy 2 backend service với nginx load balance để reproduce cluster bugs ở dev.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Ba bug đặc thù cluster: (1) random 1/N users không nhận = Redis adapter chưa attach, (2) poll HTTP 400 &quot;sid unknown&quot; = thiếu sticky sessions, (3) presence flap = state trong-process không share qua worker (vá: Redis SADD/SCARD) — health endpoint per worker + Redis PSUBSCRIBE + local cluster testing là ba tool debug cluster.</p>
</div>

<h3>Phân biệt ba lỗi đặc thù của cụm</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Một phần người dùng không nhận được sự kiện nào</span><span class="lz-d">Đúng 1/N trong số họ, với N là số worker. Chính cái tỷ lệ đó là dấu vân tay: adapter chưa được đấu vào, nên mỗi worker chỉ với tới được socket của chính nó.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Polling trả về HTTP 400, session unknown</span><span class="lz-d">Lần bắt tay rơi vào một worker còn lần hỏi tiếp theo rơi vào worker khác. Thiếu sticky session, hoặc bộ cân bằng tải không tôn trọng nó.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Hiện diện nhấp nháy</span><span class="lz-d">Con số đọc từ bản đồ socket cục bộ, nên nó đổi tuỳ theo worker nào trả lời. Thật ra chẳng có ai đang kết nối rồi ngắt kết nối cả.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Xác nhận bằng PSUBSCRIBE</span><span class="lz-d">Ngồi xem kênh Redis sẽ cho thấy các sự kiện có đi xuyên qua các worker hay không — và điều đó tách bạch &quot;adapter không chạy&quot; với &quot;sự kiện chưa từng được phát&quot;.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — một lỗi của cụm vô hình ở môi trường phát triển vì chỉ có một worker.</strong> Mọi cú hỏng trong bài này đều đòi N lớn hơn một, mà <code>npm run dev</code> thì chạy đúng một tiến trình — nên adapter có thể thiếu hoàn toàn, sticky session chưa cấu hình, và hiện diện đọc từ bản đồ cục bộ, mà mọi thứ vẫn chạy hoàn hảo trên máy bạn. Triệu chứng đầu tiên là một báo cáo từ production rằng một phần người dùng chẳng thấy gì, và chính cái tỷ lệ đó là manh mối mà chẳng ai nhận ra. Hãy chạy hai worker ở máy khi bạn động vào bất cứ thứ gì thời gian thực: <code>PORT=3000 node server.js</code> hai lần sau một cái proxy nhỏ là đủ để cả ba lỗi đều tái hiện được trước khi chúng lên production.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Tái hiện bug 1: random 1/N user không nhận gì — xác nhận đó là Redis adapter chưa attach.</li>
<li>Tái hiện bug 2 (HTTP 400 &quot;sid unknown&quot; ở poll = thiếu sticky) và bug 3 (presence flap = state trong-process không share; vá bằng Redis <code>SADD</code>/<code>SCARD</code>).</li>
<li>Chạy hai worker ở máy sau một proxy nhỏ để cả ba tái hiện được trước khi lên, và thêm một health endpoint per worker cộng Redis <code>PSUBSCRIBE</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn gán mỗi trong ba triệu chứng với nguyên nhân của nó và tái hiện chúng bằng hai worker cục bộ.</p></div>

<h3>🔬 Đo thật: ba lỗi cụm, tái hiện trên một máy</h3>
<p>Lỗi 1 — bốn tiến trình worker thật, mỗi worker một người trong <code>thread:42</code>, worker 0 phát; rồi chính hàm <code>attachRedisAdapter</code> của kho, chạy qua test của nó, in đúng hai dòng log bài nhắc:</p>
<div class="out">$ node cum.mjs khong 4      # cụm 4 worker, adapter KHÔNG gắn · mỗi worker một người trong thread:42
/health/socket worker 0: {"workerId":14171,"adapter":"Adapter","connected":1}
/health/socket worker 1: {"workerId":14172,"adapter":"Adapter","connected":1}
/health/socket worker 2: {"workerId":14173,"adapter":"Adapter","connected":1}
/health/socket worker 3: {"workerId":14174,"adapter":"Adapter","connected":1}
adapter KHÔNG gắn (RAM) · 4 worker · worker 0 phát vào thread:42 ⇒ nhận: Nam-0 1 · Nam-1 0 · Nam-2 0 · Nam-3 0 ⇒ 1/4 người
$ node cum.mjs redis 4      # cùng cụm, Redis adapter (sio-redis)
/health/socket worker 0: {"workerId":14188,"adapter":"RedisAdapter","connected":1}
/health/socket worker 1: {"workerId":14217,"adapter":"RedisAdapter","connected":1}
/health/socket worker 2: {"workerId":14218,"adapter":"RedisAdapter","connected":1}
/health/socket worker 3: {"workerId":14220,"adapter":"RedisAdapter","connected":1}
adapter Redis · 4 worker · worker 0 phát vào thread:42 ⇒ nhận: Nam-0 1 · Nam-1 1 · Nam-2 1 · Nam-3 1 ⇒ 4/4 người
$ npx tsx --test src/socket/redisAdapterGan.test.ts      # hàm attachRedisAdapter THẬT của kho: dòng log nó in ra
# [2026-11-14T01:17:34.864Z] WARN  Socket.IO Redis adapter NOT attached — in-memory only (single instance) {"error":"Redis chưa sẵn sàng sau 20 ms"}
# [2026-11-14T01:17:35.021Z] INFO  Socket.IO Redis adapter attached (cross-worker broadcasts enabled)
# [2026-11-14T01:17:35.022Z] WARN  Socket.IO Redis adapter NOT attached — in-memory only (single instance) {"error":"down"}</div>
<div class="callout info"><p><strong>Từ 13/11/2026 (82084b1e2):</strong> Redis chưa sẵn sàng trong 5 s lúc khởi động thì worker ở lại adapter trong RAM cả đời (không gắn muộn — kiểu cũ làm mất sạch room). Đúng cho một instance — trong cụm, worker đó thành hòn đảo: đúng lỗi 1, tới khi khởi động lại. Hãy cảnh báo theo dòng WARN.</p></div>
<p>Lỗi 2 — nginx thật trước hai worker, 20 client chỉ polling qua từng cách chia, rồi một sid được POST bốn lần qua luân phiên:</p>
<div class="out">$ cat nginx/nginx.conf | grep upstream       # ba cách chia request cho 2 worker
  upstream rr     { server host.docker.internal:19985; server host.docker.internal:19986; }
  upstream cookie { hash $cookie_io; server host.docker.internal:19985; server host.docker.internal:19986; }
  upstream iphash { ip_hash; server host.docker.internal:19985; server host.docker.internal:19986; }
$ node stk.mjs        # 20 client chỉ polling (như sau proxy chặn WebSocket) qua từng cách chia
round-robin      ⇒ 20 client polling: 4 connect · 34 lỗi (connect_error / disconnect) trong 4 s
hash $cookie_io  ⇒ 20 client polling: 7 connect · 28 lỗi (connect_error / disconnect) trong 4 s
ip_hash          ⇒ 20 client polling: 20 connect · 0 lỗi (connect_error / disconnect) trong 4 s
$ SID=…; for i in 1 2 3 4; do curl -s -X POST -d 6 "localhost:19987/socket.io/?EIO=4&amp;transport=polling&amp;sid=$SID"; done     # round-robin, một sid
{"code":1,"message":"Session ID unknown"} HTTP 400
ok HTTP 200
{"code":1,"message":"Session ID unknown"} HTTP 400
ok HTTP 200</div>
<div class="callout bad"><p><strong>Cách sửa ở trên không chạy:</strong> <code>hash $cookie_io</code> chỉ 7/20 nối được (server bật <code>cookie: true</code> cũng chỉ 2/20). Request bắt tay chưa có cookie <code>io</code>, nginx chia khoá rỗng theo luân phiên. Dùng <code>ip_hash</code> (20/20), sticky theo sid, hoặc chỉ WebSocket (bài 2.3).</p></div>
<p>Lỗi 3 — user 7 mỗi worker một tab (lab bài 4.3), đóng tab A:</p>
<div class="out">$ node cum.mjs      # (lab 4.3) user 7: tab A ở worker 1, tab B ở worker 2, Redis adapter · ba cách đếm khi đóng tab A
— đóng tab A (worker 1), tab B vẫn mở ở worker 2 —
worker 1 (thật: còn 1 tab) · quét worker này: 0 ⇒ offline ✗ · SCARD: 1 ⇒ online ✓ · fetchSockets: 1 ⇒ online ✓ (3,0 ms)
— đóng tab B (worker 2), tab cuối —
worker 2 (thật: còn 0 tab) · quét worker này: 0 ⇒ offline ✓ · SCARD: 0 ⇒ offline ✓ · fetchSockets: 0 ⇒ offline ✓ (2,1 ms)
Redis còn: SMEMBERS presence:sockets:7 = []</div>
<p>Kho sẽ vỡ ở đâu đầu tiên — quyết định offline quét <code>io.sockets.sockets</code> (chỉ tiến trình này) và <code>onlineUserIds</code> là <code>Set</code> cục bộ; chưa có dòng health cho từng worker:</p>
<div class="out">$ sed -n '610,616p' src/socket/messaging.socket.ts      # kho quyết định "offline" bằng gì
    socket.on('disconnect', () =&gt; {
      // Only mark offline if this was the last open socket for the
      // user (multi-tab case).
      const socketsForUser = Array.from(io?.sockets.sockets.values() ?? [])
        .filter((s) =&gt; (s.data.user as { id: number } | undefined)?.id === user.id);
      if (socketsForUser.length === 0) {
        onlineUserIds.delete(user.id);
$ grep -n "const onlineUserIds" src/socket/messaging.socket.ts ; grep -rn "health/socket\\|adapter.constructor" src | grep -v test | wc -l
182:const onlineUserIds = new Set&lt;number&gt;();
       0</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash"><span class="tok-comment"># lab c10 — cụm thật trên một máy</span>
node cum.mjs khong 4 ; node cum.mjs redis 4      <span class="tok-comment">  # 4 worker (fork), không / có Redis adapter: ai nhận, dòng /health/socket</span>
npx tsx --test src/socket/redisAdapterGan.test.ts<span class="tok-comment">  # (trong api-backend) log thật của attachRedisAdapter</span>
docker run -d --name sio-nginx-105 -p 127.0.0.1:19987:8001 -p 127.0.0.1:19988:8002 -p 127.0.0.1:19989:8003 \\
  -v $PWD/nginx/nginx.conf:/etc/nginx/nginx.conf:ro nginx:1.27-alpine
node w105.mjs 19985 A &amp;  node w105.mjs 19986 B &amp;
node stk.mjs                                     <span class="tok-comment">  # 20 client polling qua round-robin · hash $cookie_io · ip_hash</span>
(cd ../c4 &amp;&amp; node cum.mjs)                       <span class="tok-comment">  # presence 2 worker: quét cục bộ vs SCARD vs fetchSockets</span></code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nginx/learn?lessonSlug=nginx-9-1-khoi-upstream" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Nginx · 9.1 — Khối upstream và bốn cách chọn máy</span><span class="lc-sub">ip_hash, hash, và vì sao khoá rỗng thành luân phiên</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/deploy-vps/learn?lessonSlug=deploy-14-2-hai-may-can-bang-tai" target="_blank" rel="noopener"><span class="lc-ico">🚀</span><span class="lc-body"><span class="lc-title">Deploy lên VPS · 14.2 — Hai máy sau bộ cân bằng tải</span><span class="lc-sub">Kiểm sức khoẻ, trạng thái, deploy lần lượt</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Random 1/N không nhận</span><span class="v">Redis adapter chưa bao giờ được attach.</span></div>
  <div class="kv"><span class="k">HTTP 400 &quot;sid unknown&quot;</span><span class="v">Poll trúng worker khác nhau — thiếu sticky sessions.</span></div>
  <div class="kv"><span class="k">Presence flap</span><span class="v">State trong-process không share qua worker (vá: Redis <code>SADD</code>/<code>SCARD</code>).</span></div>
  <div class="kv"><span class="k">Health endpoint per worker</span><span class="v">Cho thấy worker nào đang trục trặc.</span></div>
  <div class="kv"><span class="k">Redis <code>PSUBSCRIBE</code></span><span class="v">Xem lưu lượng pub/sub của adapter qua các worker.</span></div>
  <div class="kv"><span class="k">Local cluster testing</span><span class="v">Hai worker sau một proxy nhỏ để tái hiện trước khi lên.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Ba bug đặc thù cluster hay tái diễn.</li><li>Random 1/N user không nhận gì nghĩa là Redis adapter chưa attach.</li><li>HTTP 400 &quot;sid unknown&quot; ở poll nghĩa là thiếu sticky sessions.</li><li>Presence flap nghĩa là state trong-process không share (vá: Redis <code>SADD</code>/<code>SCARD</code>).</li><li>Ba tool là một health endpoint per worker, Redis <code>PSUBSCRIBE</code>, và local cluster testing.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Bài 5.1 — Redis adapter</span><span class="lc-sub">/courses/socket-io/learn — cách attach adapter đúng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Bài 2.3 — sticky sessions</span><span class="lc-sub">/courses/socket-io/learn — cấu hình nginx cho polling.</span></span></div>
</div>
`,
    },

    {
      title: '10.6 — Chapter 10 quiz|||10.6 — Kiểm tra Chương 10',
      slug: 'io-10-6-quiz',
      type: 'QUIZ',
      description: 'Sáu câu, mười phút. Về decision tree, Q1-Q4, cluster bugs.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Quiz</span>
<h2>What Chapter 10 established</h2>
<p class="lead">Six questions on diagnosis — the decision tree that turns "realtime is broken" into a specific failing step.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Four questions, in order</span><span class="lz-d">Is the client connected? Is the event on the wire? Did the handler run? Did the side effect happen? Each one is answerable with a single check, and answering them in order eliminates most of the search space immediately.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">The wire is readable</span><span class="lz-d">DevTools shows engine.io frames directly. "The event never arrived" and "the event arrived and the handler threw" look identical from the UI and completely different on the wire.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Cluster bugs have their own signature</span><span class="lz-d">Works for some users and not others, works on refresh, or the count is roughly 1/N of expected — those all point at a missing or misconfigured adapter rather than at your event code.</span></div>
</div>
<p>6 questions, 10 minutes. Answer from the mechanism, not from memory — every option is plausible if you are guessing.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Kiểm tra</span>
<h2>Chương 10 đã dựng được gì</h2>
<p class="lead">Sáu câu về chẩn đoán — cây quyết định biến "realtime hỏng" thành một bước hỏng cụ thể.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Bốn câu hỏi, theo thứ tự</span><span class="lz-d">Client có kết nối không? Sự kiện có trên đường truyền không? Handler có chạy không? Tác dụng phụ có xảy ra không? Mỗi câu trả lời được bằng một phép kiểm duy nhất, và trả lời theo thứ tự sẽ loại bỏ ngay phần lớn không gian tìm kiếm.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Đường truyền đọc được</span><span class="lz-d">DevTools hiện thẳng các khung engine.io. "Sự kiện không bao giờ tới" và "sự kiện đã tới và handler ném lỗi" trông giống hệt nhau từ giao diện và khác hoàn toàn trên đường truyền.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Bug cluster có chữ ký riêng</span><span class="lz-d">Chạy được với một số user và không với số khác, chạy được khi tải lại trang, hoặc con số xấp xỉ 1/N so với kỳ vọng — tất cả đều chỉ vào một adapter thiếu hoặc sai cấu hình chứ không phải vào mã sự kiện của bạn.</span></div>
</div>
<p>6 câu, 10 phút. Hãy trả lời từ cơ chế, đừng trả lời từ trí nhớ — mọi phương án đều hợp lý nếu bạn đang đoán.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 600,
        questions: [
          {
            question: 'A client complains &quot;chat not receiving new messages&quot;. Where do you start?|||Client than phiền &quot;chat không nhận tin mới&quot;. Bạn bắt đầu ở đâu?',
            options: [
              'Q1: Is the client connected? Check DevTools Network → WS tab for 101 status. Without confirming connect, Q2-Q4 don\'t apply|||Q1: Client có connected không? Kiểm DevTools Network → WS tab status 101. Không confirm connect, Q2-Q4 không apply',
              'Add console.log everywhere and deploy|||Thêm console.log khắp nơi và deploy',
              'Rewrite the chat feature|||Viết lại chat feature',
              'Ask user to reinstall browser|||Bảo user cài lại browser',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You see event <code>42[&quot;msg&quot;,...]</code> in DevTools Messages tab but no handler fires. Which Q are we at?|||Bạn thấy event <code>42[&quot;msg&quot;,...]</code> trong DevTools Messages tab nhưng handler không fire. Q nào?',
            options: [
              'Q3: handler running? Q2 passed (event on wire). Common causes: event name typo, wrong socket instance, wrong namespace, handler registered too late|||Q3: handler running? Q2 pass (event trên wire). Common causes: event name typo, sai socket instance, sai namespace, handler đăng ký muộn',
              'Q1: connection|||Q1: connection',
              'Q2: event on wire|||Q2: event trên wire',
              'Q4: side effect|||Q4: side effect',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Cluster with 4 workers. Users report ~25% of chat messages arrive. What&#39;s the bug?|||Cluster 4 worker. User báo ~25% chat message đến. Bug là gì?',
            options: [
              'Redis adapter not attached — emit only reaches sockets on the emitting worker, others miss. Fix: verify REDIS_URL and check log for &quot;adapter attached&quot;|||Redis adapter chưa attach — emit chỉ đến socket trên emitting worker, others miss. Fix: verify REDIS_URL và check log &quot;adapter attached&quot;',
              'Nginx cache is stale|||Nginx cache stale',
              'Prisma connection pool exhausted|||Prisma connection pool cạn',
              'JWT expired|||JWT expired',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Polling requests return HTTP 400 &quot;Session ID unknown&quot; intermittently. Cause?|||Polling request trả HTTP 400 &quot;Session ID unknown&quot; ngắt quãng. Nguyên nhân?',
            options: [
              'No sticky sessions — client\'s first POST hits worker A (gets sid), follow-up GET hits worker B (doesn\'t know sid). Fix: nginx <code>ip_hash</code> (or sticky by sid, or WebSocket-only) — <code>hash $cookie_io</code> does not work: the handshake has no cookie yet (measured 7/20)|||Không có sticky sessions — POST đầu client hit worker A (nhận sid), GET tiếp theo hit worker B (không biết sid). Fix: nginx <code>ip_hash</code> (hoặc sticky theo sid, hoặc chỉ WebSocket) — <code>hash $cookie_io</code> KHÔNG chạy: lúc bắt tay chưa có cookie (đo 7/20)',
              'Client is missing cookies|||Client thiếu cookies',
              'CORS misconfigured|||CORS sai',
              'JWT expiration too short|||JWT expiration quá ngắn',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Handler runs and logs &quot;done&quot; but UI doesn\'t update. Where to look?|||Handler chạy và log &quot;done&quot; nhưng UI không update. Nhìn ở đâu?',
            options: [
              'Q4: check the actual side effect — DB row created? Room membership correct? emit fired to right room? FE state actually changed (React DevTools)?|||Q4: check side effect thực — DB row tạo chưa? Room membership đúng? emit fire đúng room? FE state đổi thực (React DevTools)?',
              'Increase log verbosity|||Tăng log verbosity',
              'Restart the server|||Restart server',
              'Clear browser cache|||Xoá cache browser',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Best way to debug cluster pub/sub without deploying?|||Cách tốt nhất debug cluster pub/sub không cần deploy?',
            options: [
              '<code>redis-cli PSUBSCRIBE &#39;socket.io#*&#39;</code> in one terminal, trigger emits in another. Frames appear on Redis = adapter publishing. Missing = adapter not attached|||<code>redis-cli PSUBSCRIBE &#39;socket.io#*&#39;</code> ở terminal, trigger emit ở terminal khác. Frame xuất hiện = adapter publishing. Missing = adapter chưa attach',
              'Grep server logs|||Grep server log',
              'Rely on error reports from users|||Dựa vào báo cáo lỗi từ user',
              'Restart Redis|||Restart Redis',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },

  ],
};
