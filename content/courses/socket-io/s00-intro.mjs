import G00_8 from './giang/sio-00-8.mjs';
import G00_9 from './giang/sio-00-9.mjs';
import G00_1 from './giang/sio-00-1.mjs';
import G00_2 from './giang/sio-00-2.mjs';
import G00_3 from './giang/sio-00-3.mjs';
const REF = '?ref=%2Fcourses%2Fsocket-io%2Flearn&reflabel=Socket.IO';
/**
 * Socket.IO — Mục 0: Cái Socket.IO THẬT SỰ LÀ.
 * Số đo: 2.430 dòng gateway trong src/socket/ + socket.io 4.8.3 chạy thật
 * trong hộp cát. Handshake engine.io, hai sid, transport upgrade.
 */

export default {
  title: 'Section 0 — What Socket.IO actually is|||Mục 0 — Socket.IO THẬT SỰ LÀ gì',
  slug: 'io-s0-intro',
  description: 'Bốn bài dựng mô hình tinh thần đúng trước khi làm bất cứ thứ gì với socket.io. Đây KHÔNG phải WebSocket + npm — nó là engine.io được bọc bởi namespace và room, và mọi thứ gây bất ngờ về nó đều suy ra từ câu đó.',
  sortOrder: 1,
  lessons: [
    /* ───────────────────── Bắt đầu tại đây 1 ───────────────────── */
    {
      title: 'Start here (1/2) — What realtime is, and why Socket.IO|||Bắt đầu tại đây (1/2) — Realtime là gì, và vì sao Socket.IO',
      slug: 'io-0-0-start-here-1',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Bài mở cửa cho người mới: realtime (server đẩy dữ liệu tới client ngay khi có việc) khác gì request/response HTTP, vì sao cần một thư viện thay vì WebSocket thuần, và Socket.IO đứng ở đâu trong kho mã này.',
      content: `
${G00_8}
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here</span>
<h2>What realtime is, and why Socket.IO</h2>
<p class="lead">If you have only ever built request/response HTTP APIs, this course fills the gap to the other half of the web: the server pushing data to the client the instant something happens. Realtime is a chat message appearing with no refresh, a presence dot turning green, a cursor moving in a shared document, a video call connecting. Socket.IO is the library this codebase uses for almost all of it, and this first lesson is about the shape of the problem before any code.</p>
<h3>Request/response vs realtime</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Request/response</span><span class="v">The client asks, the server answers, the connection closes. Right for &quot;load my profile&quot;.</span></div>
  <div class="kv"><span class="k">Realtime</span><span class="v">A connection stays open and either side can send at any moment. Right for &quot;tell me the instant a message arrives&quot;.</span></div>
  <div class="kv"><span class="k">Short polling</span><span class="v">The old fake-realtime: the client re-asks every few seconds — wasteful and always a little late.</span></div>
  <div class="kv"><span class="k">WebSocket</span><span class="v">One long-lived two-way connection; the wire that real realtime is built on.</span></div>
</div>
<h3>Why a library, not raw WebSocket</h3>
<p>A raw browser WebSocket gives you a pipe and nothing else — no reconnect when the wifi blinks, no heartbeat to tell a dead connection from a quiet one, no rooms to broadcast to a group, no fallback for proxies that block the upgrade. Socket.IO adds all four. This repo runs 3,935 lines of gateways on top of Socket.IO (8 files under <code>src/socket/</code>, tests excluded, measured 13/11/2026 — it was 2,430 when the course was first written) and has exactly one place — the Maker Lab device channel — that pays the full price of hand-writing raw <code>ws</code> (1,113 lines for one job). Chapter 9 is the honest account of when that trade is worth it.</p>
<h3>What this course covers</h3>
<p>Section 0 is this mental model. Chapters 1-2 are the connection lifecycle and transports. Chapter 3 is rooms, Chapter 4 presence. Chapter 5 is scaling across a cluster with Redis. Chapter 6 is acknowledgements and delivery. Chapter 7 is WebRTC signalling, Chapter 8 collaborative editing with CRDTs (Yjs), Chapter 9 raw WebSocket. Chapter 10 is diagnosis, and Chapter 11 is what survived measurement plus the final exam. Every table in the course is a number someone ran against this repo, not a guess.</p>
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Open a chat or notification app you already use. Send a message from one device and watch it appear on another WITHOUT a refresh — that is a server push, not a request/response.</li>
<li>Open DevTools → Network and filter on &quot;WS&quot;. Find the single long-lived WebSocket connection carrying all the live traffic, and note it never closes while the page is open.</li>
<li>Write down two features in that app that need realtime and one that is plain request/response, and say why each belongs where it is.</li>
</ol>
<p><strong>Done when:</strong> you can point at a real open WebSocket in DevTools and name, for one app, what belongs to realtime and what does not.</p></div>
<h3>🔬 Measured: short polling vs a server push</h3>
<p>Five events happen at fixed moments inside 10.5 seconds (socket.io 4.8.3, Node 22, one machine). Client A asks again every 2 s; client B receives a Socket.IO push:</p>
<div class="out">tin  xảy ra lúc   short polling (2 s)   Socket.IO đẩy
#1     700 ms     trễ  1318 ms         trễ 4 ms
#2    2900 ms     trễ  1107 ms         trễ 3 ms
#3    4100 ms     trễ  1909 ms         trễ 1 ms
#4    6600 ms     trễ  1410 ms         trễ 3 ms
#5    8300 ms     trễ  1712 ms         trễ 2 ms
trung bình            1491 ms              3 ms
request HTTP trong 10,5 s: short polling 5 · Socket.IO 0 (1 kết nối mở suốt)</div>
<p>The poller saw every event 1.1–1.9 s late (it waits for the next tick) and paid 5 HTTP requests; the push arrived within milliseconds over one open connection.</p>
<h3>🔬 Measured: a raw WebSocket is only a pipe</h3>
<p>A raw <code>ws</code> server and a Socket.IO server in one process; the process is killed at ~2 s and started again at ~4.5 s:</p>
<div class="out">  518 ms ws thô     open
  530 ms socket.io  connect  id=Y_Dna2onqbhSG928AAAA
 2014 ms ── GIẾT server (SIGKILL)
 2019 ms socket.io  disconnect: transport close
 2019 ms ws thô     close 1006 — readyState 3 (CLOSED)
 3396 ms socket.io  reconnect_attempt #1
 4514 ms ── BẬT LẠI server
 5132 ms socket.io  reconnect_attempt #2
 5141 ms socket.io  reconnect sau 2 lần thử
 5145 ms socket.io  connect  id=8b4koOm48IU2GpakAAAA
 9513 ms kết quả: ws thô readyState=3 (vẫn chết) · socket.io connected=true</div>
<p>The raw client got close code 1006 and stayed at <code>readyState 3</code> for good. Socket.IO retried by itself and reconnected — with a new id — as soon as the server was back.</p>
<h3>📜 A short history, checked on npm</h3>
<div class="out">$ npm view socket.io time --json | grep -E '"(created|0\\.6\\.0|1\\.0\\.0|2\\.0\\.0|3\\.0\\.0|4\\.0\\.0|4\\.8\\.3|4\\.8\\.4)"'
  "0.6.0": "2010-12-24T04:53:35.445Z",
  "1.0.0": "2014-05-28T17:18:37.764Z",
  "2.0.0": "2017-05-08T23:16:09.507Z",
  "3.0.0": "2020-11-05T21:08:44.084Z",
  "4.0.0": "2021-03-10T11:45:02.546Z",
  "4.8.3": "2025-12-23T16:42:13.022Z",
  "4.8.4": "2026-09-25T08:51:53.015Z"
$ npm view socket.io@0.6.0 author
LearnBoost
$ npm view engine.io time.created
2012-07-03T22:35:39.760Z
$ npm view socket.io version
4.8.4</div>
<p>0.6.0 was published in December 2010 by LearnBoost; engine.io (the connection layer) was split out in 2012 and 1.0 (2014) sits on it. This course measures <strong>4.8.3</strong> — the version in this repo's <code>package.json</code>; npm's latest on 13/11/2026 is 4.8.4.</p>
<h3>🔁 Run it yourself</h3>
<p>In a scratch folder: <code>npm init -y && npm pkg set type=module && npm i socket.io@4.8.3 socket.io-client@4.8.3</code>, save this as <code>poll-vs-push.mjs</code>, run <code>node poll-vs-push.mjs</code>. Your milliseconds will differ; the shape will not.</p>
<pre><code class="language-javascript"><span class="tok-comment">// Tin xảy ra ở 5 thời điểm CỐ ĐỊNH; client A hỏi lại mỗi 2 giây (short polling), client B nhận đẩy qua Socket.IO.</span>
import http from 'node:http';
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const MOC = [700, 2900, 4100, 6600, 8300];          <span class="tok-comment">  // ms kể từ lúc bắt đầu</span>
const tin = [];                                       <span class="tok-comment">  // [{ i, luc }]</span>
const srv = http.createServer((req, res) =&gt; {         <span class="tok-comment">  // GET /tin?sau=n ⇒ các tin có chỉ số &gt;= n</span>
  const sau = Number(new URL(req.url, 'http://x').searchParams.get('sau') ?? 0);
  res.end(JSON.stringify(tin.filter((t) =&gt; t.i &gt;= sau)));
});
const io = new Server(srv);
await new Promise((r) =&gt; srv.listen(19401, r));
const t0 = Date.now(), tre = { poll: [], push: [] };
let soRequest = 0, daCo = 0;
const cho = setInterval(async () =&gt; {                 <span class="tok-comment">  // A: short polling mỗi 2000 ms</span>
  soRequest++;
  const ds = await (await fetch(&#96;http://localhost:19401/tin?sau=\${daCo}&#96;)).json();
  for (const t of ds) { tre.poll.push(Date.now() - t0 - t.luc); daCo = t.i + 1; }
}, 2000);
const b = ketNoi('http://localhost:19401');          <span class="tok-comment">  // B: Socket.IO, server đẩy</span>
b.on('tin', (t) =&gt; tre.push.push(Date.now() - t0 - t.luc));
await new Promise((r) =&gt; b.on('connect', r));
MOC.forEach((ms, i) =&gt; setTimeout(() =&gt; { const t = { i, luc: ms }; tin.push(t); io.emit('tin', t); }, ms - (Date.now() - t0)));
await new Promise((r) =&gt; setTimeout(r, 10500));
clearInterval(cho); b.close(); io.close();
console.log('tin  xảy ra lúc   short polling (2 s)   Socket.IO đẩy');
MOC.forEach((ms, i) =&gt; console.log(&#96;#\${i + 1}   \${String(ms).padStart(5)} ms     trễ \${String(tre.poll[i]).padStart(5)} ms         trễ \${tre.push[i]} ms&#96;));
const tb = (a) =&gt; Math.round(a.reduce((x, y) =&gt; x + y, 0) / a.length);
console.log(&#96;trung bình            \${tb(tre.poll)} ms              \${tb(tre.push)} ms&#96;);
console.log(&#96;request HTTP trong 10,5 s: short polling \${soRequest} · Socket.IO 0 (1 kết nối mở suốt)&#96;);</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-1-websocket-co-ban" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 11.1 — From asking again and again to being told: WebSocket</span><span class="lc-sub">The same idea from the Node.js side, with ws and Socket.IO</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-9-2-websocket" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking for Developers · 9.2 — WebSocket: upgrade, frames, heartbeat</span><span class="lc-sub">What the wire looks like below Socket.IO</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/api-design/learn?lessonSlug=api-10-3-realtime" target="_blank" rel="noopener"><span class="lc-ico">🧩</span><span class="lc-body"><span class="lc-title">API Design · 10.4 — Realtime APIs: polling, SSE or WebSocket</span><span class="lc-sub">Choosing the contract, with measured latency and request counts</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Realtime</span><span class="v">The server sending data to the client the moment it happens, over an open connection.</span></div>
  <div class="kv"><span class="k">Request/response</span><span class="v">The classic HTTP cycle: ask, answer, close.</span></div>
  <div class="kv"><span class="k">WebSocket</span><span class="v">A single long-lived two-way connection — the transport under realtime.</span></div>
  <div class="kv"><span class="k">Socket.IO</span><span class="v">The library that adds reconnect, heartbeat, rooms and fallback on top of WebSocket.</span></div>
  <div class="kv"><span class="k">Gateway</span><span class="v">A server-side module that owns one realtime feature (chat, calls, presence).</span></div>
  <div class="kv"><span class="k">Raw <code>ws</code></span><span class="v">The bare WebSocket library — a pipe with none of Socket.IO's extras.</span></div>
</div>
<h3>📌 Summary</h3>
<ul><li>Realtime is the server pushing to the client the instant something happens — the other half of the web from request/response.</li><li>WebSocket is the long-lived two-way wire; short polling only fakes realtime.</li><li>Raw WebSocket is just a pipe — you would rebuild reconnect, heartbeat, rooms and fallback yourself.</li><li>Socket.IO gives you those four for free; this repo runs ~3,935 lines of gateways on it.</li><li>Every number in this course was measured against this codebase, not guessed.</li></ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây</span>
<h2>Realtime là gì, và vì sao Socket.IO</h2>
<p class="lead">Nếu bạn mới chỉ dựng API HTTP kiểu request/response, khoá này lấp đúng khoảng sang nửa còn lại của web: server đẩy dữ liệu tới client ngay khoảnh khắc có việc. Realtime là một tin nhắn chat hiện ra mà không cần tải lại, một chấm hiện diện chuyển xanh, một con trỏ di chuyển trong tài liệu chung, một cuộc gọi video kết nối. Socket.IO là thư viện mà kho mã này dùng cho gần hết những việc đó, và bài đầu tiên này nói về hình dạng của bài toán trước khi có dòng mã nào.</p>
<h3>Request/response vs realtime</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Request/response</span><span class="v">Client hỏi, server đáp, connection đóng. Đúng cho &quot;tải hồ sơ của tôi&quot;.</span></div>
  <div class="kv"><span class="k">Realtime</span><span class="v">Một connection mở suốt và cả hai phía gửi bất cứ lúc nào. Đúng cho &quot;báo tôi ngay khi có tin&quot;.</span></div>
  <div class="kv"><span class="k">Short polling</span><span class="v">Realtime giả kiểu cũ: client hỏi lại mỗi vài giây — tốn và luôn trễ một nhịp.</span></div>
  <div class="kv"><span class="k">WebSocket</span><span class="v">Một connection hai chiều sống lâu; cái dây mà realtime thật dựng lên trên.</span></div>
</div>
<h3>Vì sao dùng thư viện, không phải WebSocket thuần</h3>
<p>Một WebSocket thô của trình duyệt cho bạn một cái ống và không gì khác — không reconnect khi wifi chớp, không heartbeat để phân biệt connection chết với connection im, không room để broadcast cho một nhóm, không fallback cho proxy chặn upgrade. Socket.IO thêm đủ cả bốn. Kho này chạy 3.935 dòng gateway trên Socket.IO (8 tệp trong <code>src/socket/</code>, không tính test, đo 13/11/2026 — lúc mới soạn khoá là 2.430) và có đúng một chỗ — kênh thiết bị Maker Lab — trả đủ cái giá của việc tự viết <code>ws</code> thô (1.113 dòng cho một việc). Chương 9 là bản trình bày trung thực về khi nào cái đánh đổi ấy đáng.</p>
<h3>Khoá này gồm những gì</h3>
<p>Mục 0 là mô hình tư duy này. Chương 1-2 là vòng đời connection và transport. Chương 3 là room, Chương 4 là presence. Chương 5 là mở rộng ra cụm nhiều worker với Redis. Chương 6 là ack và bảo đảm giao tin. Chương 7 là signalling WebRTC, Chương 8 là soạn thảo cộng tác bằng CRDT (Yjs), Chương 9 là WebSocket thô. Chương 10 là chẩn đoán, và Chương 11 là cái sống qua đo lường cùng đề thi cuối. Mọi bảng trong khoá là một con số có người chạy trên chính kho này, không phải suy đoán.</p>
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Mở một app chat hoặc thông báo bạn đang dùng. Gửi một tin từ một máy và xem nó hiện trên máy khác MÀ KHÔNG tải lại — đó là server push, không phải request/response.</li>
<li>Mở DevTools → Network và lọc &quot;WS&quot;. Tìm cái connection WebSocket sống lâu duy nhất đang chở mọi lưu lượng trực tiếp, và để ý nó không đóng suốt khi trang còn mở.</li>
<li>Ghi lại hai tính năng trong app đó cần realtime và một tính năng chỉ là request/response, và nói vì sao mỗi cái thuộc về đâu.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chỉ được vào một WebSocket thật đang mở trong DevTools và nêu được, với một app, cái gì thuộc realtime và cái gì không.</p></div>
<h3>🔬 Đo thật: short polling so với server đẩy</h3>
<p>Năm tin xảy ra ở năm thời điểm cố định trong 10,5 giây (socket.io 4.8.3, Node 22, một máy). Client A hỏi lại mỗi 2 giây; client B nhận đẩy qua Socket.IO:</p>
<div class="out">tin  xảy ra lúc   short polling (2 s)   Socket.IO đẩy
#1     700 ms     trễ  1318 ms         trễ 4 ms
#2    2900 ms     trễ  1107 ms         trễ 3 ms
#3    4100 ms     trễ  1909 ms         trễ 1 ms
#4    6600 ms     trễ  1410 ms         trễ 3 ms
#5    8300 ms     trễ  1712 ms         trễ 2 ms
trung bình            1491 ms              3 ms
request HTTP trong 10,5 s: short polling 5 · Socket.IO 0 (1 kết nối mở suốt)</div>
<p>Bên hỏi lại thấy mỗi tin trễ 1,1–1,9 giây (tin phải chờ tới lượt hỏi kế) và tốn 5 request HTTP; bên được đẩy nhận trong vài mili giây qua một kết nối mở suốt.</p>
<h3>🔬 Đo thật: WebSocket thô chỉ là cái ống</h3>
<p>Một server <code>ws</code> thô và một server Socket.IO trong cùng một tiến trình; giết tiến trình ở khoảng giây thứ 2, bật lại ở khoảng giây 4,5:</p>
<div class="out">  518 ms ws thô     open
  530 ms socket.io  connect  id=Y_Dna2onqbhSG928AAAA
 2014 ms ── GIẾT server (SIGKILL)
 2019 ms socket.io  disconnect: transport close
 2019 ms ws thô     close 1006 — readyState 3 (CLOSED)
 3396 ms socket.io  reconnect_attempt #1
 4514 ms ── BẬT LẠI server
 5132 ms socket.io  reconnect_attempt #2
 5141 ms socket.io  reconnect sau 2 lần thử
 5145 ms socket.io  connect  id=8b4koOm48IU2GpakAAAA
 9513 ms kết quả: ws thô readyState=3 (vẫn chết) · socket.io connected=true</div>
<p>Client thô nhận mã đóng 1006 và nằm yên ở <code>readyState 3</code> luôn. Socket.IO tự thử lại và nối lại — với id mới — ngay khi server sống lại.</p>
<h3>📜 Lịch sử ngắn, kiểm bằng npm</h3>
<div class="out">$ npm view socket.io time --json | grep -E '"(created|0\\.6\\.0|1\\.0\\.0|2\\.0\\.0|3\\.0\\.0|4\\.0\\.0|4\\.8\\.3|4\\.8\\.4)"'
  "0.6.0": "2010-12-24T04:53:35.445Z",
  "1.0.0": "2014-05-28T17:18:37.764Z",
  "2.0.0": "2017-05-08T23:16:09.507Z",
  "3.0.0": "2020-11-05T21:08:44.084Z",
  "4.0.0": "2021-03-10T11:45:02.546Z",
  "4.8.3": "2025-12-23T16:42:13.022Z",
  "4.8.4": "2026-09-25T08:51:53.015Z"
$ npm view socket.io@0.6.0 author
LearnBoost
$ npm view engine.io time.created
2012-07-03T22:35:39.760Z
$ npm view socket.io version
4.8.4</div>
<p>Bản 0.6.0 lên npm tháng 12/2010, tác giả LearnBoost; engine.io (tầng quản lý kết nối) tách ra năm 2012 và bản 1.0 (2014) ngồi trên nó. Khoá này đo trên <strong>4.8.3</strong> — đúng bản trong <code>package.json</code> của kho; bản mới nhất trên npm ngày 13/11/2026 là 4.8.4.</p>
<h3>🔁 Tự chạy lại</h3>
<p>Trong một thư mục nháp: <code>npm init -y && npm pkg set type=module && npm i socket.io@4.8.3 socket.io-client@4.8.3</code>, lưu đoạn dưới thành <code>poll-vs-push.mjs</code>, chạy <code>node poll-vs-push.mjs</code>. Số mili giây của bạn sẽ khác; hình dạng thì không.</p>
<pre><code class="language-javascript"><span class="tok-comment">// Tin xảy ra ở 5 thời điểm CỐ ĐỊNH; client A hỏi lại mỗi 2 giây (short polling), client B nhận đẩy qua Socket.IO.</span>
import http from 'node:http';
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const MOC = [700, 2900, 4100, 6600, 8300];          <span class="tok-comment">  // ms kể từ lúc bắt đầu</span>
const tin = [];                                       <span class="tok-comment">  // [{ i, luc }]</span>
const srv = http.createServer((req, res) =&gt; {         <span class="tok-comment">  // GET /tin?sau=n ⇒ các tin có chỉ số &gt;= n</span>
  const sau = Number(new URL(req.url, 'http://x').searchParams.get('sau') ?? 0);
  res.end(JSON.stringify(tin.filter((t) =&gt; t.i &gt;= sau)));
});
const io = new Server(srv);
await new Promise((r) =&gt; srv.listen(19401, r));
const t0 = Date.now(), tre = { poll: [], push: [] };
let soRequest = 0, daCo = 0;
const cho = setInterval(async () =&gt; {                 <span class="tok-comment">  // A: short polling mỗi 2000 ms</span>
  soRequest++;
  const ds = await (await fetch(&#96;http://localhost:19401/tin?sau=\${daCo}&#96;)).json();
  for (const t of ds) { tre.poll.push(Date.now() - t0 - t.luc); daCo = t.i + 1; }
}, 2000);
const b = ketNoi('http://localhost:19401');          <span class="tok-comment">  // B: Socket.IO, server đẩy</span>
b.on('tin', (t) =&gt; tre.push.push(Date.now() - t0 - t.luc));
await new Promise((r) =&gt; b.on('connect', r));
MOC.forEach((ms, i) =&gt; setTimeout(() =&gt; { const t = { i, luc: ms }; tin.push(t); io.emit('tin', t); }, ms - (Date.now() - t0)));
await new Promise((r) =&gt; setTimeout(r, 10500));
clearInterval(cho); b.close(); io.close();
console.log('tin  xảy ra lúc   short polling (2 s)   Socket.IO đẩy');
MOC.forEach((ms, i) =&gt; console.log(&#96;#\${i + 1}   \${String(ms).padStart(5)} ms     trễ \${String(tre.poll[i]).padStart(5)} ms         trễ \${tre.push[i]} ms&#96;));
const tb = (a) =&gt; Math.round(a.reduce((x, y) =&gt; x + y, 0) / a.length);
console.log(&#96;trung bình            \${tb(tre.poll)} ms              \${tb(tre.push)} ms&#96;);
console.log(&#96;request HTTP trong 10,5 s: short polling \${soRequest} · Socket.IO 0 (1 kết nối mở suốt)&#96;);</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-1-websocket-co-ban" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 11.1 — Từ hỏi đi hỏi lại tới được báo: WebSocket</span><span class="lc-sub">Cùng ý tưởng nhìn từ phía Node.js, với ws và Socket.IO</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-9-2-websocket" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking for Developers · 9.2 — WebSocket: nâng cấp, frame và nhịp tim</span><span class="lc-sub">Dây trông ra sao ở bên dưới Socket.IO</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/api-design/learn?lessonSlug=api-10-3-realtime" target="_blank" rel="noopener"><span class="lc-ico">🧩</span><span class="lc-body"><span class="lc-title">API Design · 10.4 — API thời gian thực: polling, SSE hay WebSocket</span><span class="lc-sub">Chọn hợp đồng, có số đo trễ và số request</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Realtime</span><span class="v">Server gửi dữ liệu tới client ngay lúc nó xảy ra, qua một connection mở.</span></div>
  <div class="kv"><span class="k">Request/response</span><span class="v">Chu trình HTTP cổ điển: hỏi, đáp, đóng.</span></div>
  <div class="kv"><span class="k">WebSocket</span><span class="v">Một connection hai chiều sống lâu — transport dưới realtime.</span></div>
  <div class="kv"><span class="k">Socket.IO</span><span class="v">Thư viện thêm reconnect, heartbeat, room và fallback lên trên WebSocket.</span></div>
  <div class="kv"><span class="k">Gateway</span><span class="v">Một module phía server lo một tính năng realtime (chat, gọi, presence).</span></div>
  <div class="kv"><span class="k"><code>ws</code> thô</span><span class="v">Thư viện WebSocket trần — một cái ống không có phần thêm nào của Socket.IO.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul><li>Realtime là server đẩy tới client ngay khi có việc — nửa còn lại của web so với request/response.</li><li>WebSocket là cái dây hai chiều sống lâu; short polling chỉ giả realtime.</li><li>WebSocket thô chỉ là cái ống — bạn sẽ phải tự dựng lại reconnect, heartbeat, room và fallback.</li><li>Socket.IO cho bạn bốn thứ đó miễn phí; kho này chạy ~3.935 dòng gateway trên nó.</li><li>Mọi con số trong khoá được đo trên chính kho mã này, không phải đoán.</li></ul>
</div>
`,
    },

    /* ───────────────────── Bắt đầu tại đây 2 ───────────────────── */
    {
      title: 'Start here (2/2) — The four-layer model and how to study this course|||Bắt đầu tại đây (2/2) — Mô hình bốn tầng và cách học khoá này',
      slug: 'io-0-0-start-here-2',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Bài thứ hai của cặp mở đầu: mô hình bốn tầng mà cả khoá dựa vào (dây → engine.io → socket.io → mã của bạn), ba thói quen lặp lại, bản đồ các chương, và cách học hiệu quả là chạy các probe chứ không chỉ đọc.',
      content: `
${G00_9}
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here</span>
<h2>The four-layer model and how to study this course</h2>
<p class="lead">Lesson 1 said what realtime is. This one hands you the single mental model the whole course leans on — four stacked layers — plus three habits that repeat under different names, and an honest way to study a course built from measured packets: run the probes and read the wire. Reading code is not the same as running it, and this course was written by running it.</p>
<h3>The four layers every connection stacks</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">layer 4 — your code</span><span class="lz-lnote">Named events and JSON: <code>socket.on('chat:message', ...)</code>. This is <code>src/socket/*.ts</code>.</span></div>
<div class="lz-layer"><span class="lz-lname">layer 3 — socket.io</span><span class="lz-lnote">Namespaces, rooms, acks, binary, and a per-connection sid.</span></div>
<div class="lz-layer"><span class="lz-lname">layer 2 — engine.io</span><span class="lz-lnote">The connection itself: heartbeats, transport upgrades, its own sid.</span></div>
<div class="lz-layer"><span class="lz-lname">layer 1 — the wire</span><span class="lz-lnote">An HTTP long-poll or a WebSocket, chosen (and upgraded) by engine.io.</span></div>
</div>
<h3>Three habits that repeat</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Measure, do not guess</span><span class="v">Every table here is a number someone ran; your own measurement beats any default.</span></div>
  <div class="kv"><span class="k">Name the layer first</span><span class="v">Before debugging, decide which of the four layers owns the symptom — that picks the tool.</span></div>
  <div class="kv"><span class="k">Let the library do the hard parts</span><span class="v">Reconnect and heartbeat are layer 2/3; you never hand-write them at layer 4.</span></div>
</div>
<h3>The map</h3>
<p>Chapters 1-2 are lifecycle and transports (layers 1-2). Chapter 3 rooms and Chapter 4 presence (layer 3). Chapter 5 scales across workers with the Redis adapter. Chapter 6 is acks and delivery. Chapter 7 is WebRTC signalling, Chapter 8 collaborative editing with CRDTs (Yjs), Chapter 9 raw WebSocket. Chapter 10 is diagnosis, Chapter 11 what survived measurement plus the final exam. When a surprise shows up, the course always names the layer responsible for it.</p>
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>In a scratch folder, install both libraries: <code>npm i socket.io socket.io-client ws</code>.</li>
<li>Run a one-liner that proves they load and print their versions, then write a 15-line server + client that emits one event and logs it on the other side.</li>
<li>In the client's <code>connect</code> handler log <code>socket.io.engine.transport.name</code>, and in the server's connection handler log <code>socket.conn.transport.name</code> — watch both and map what you see onto the four layers.</li>
</ol>
<pre><code class="language-bash">node -e "console.log('socket.io', require('socket.io/package.json').version, '| ws', require('ws/package.json').version)"</code></pre>
<p><strong>Done when:</strong> both libraries run on your machine, one event travels end to end, and you can redraw the four layers from memory.</p></div>
<h3>🔬 Measured: one event, end to end</h3>
<p>The 15-line probe from the Practice block, run for real (socket.io 4.8.3, Node 22):</p>
<pre><code class="language-javascript"><span class="tok-comment">// server + client trong 15 dòng: một event đi trọn hai đầu, in transport ở CẢ hai phía</span>
const { Server } = require('socket.io');
const { io } = require('socket.io-client');
const server = new Server(19404);
server.on('connection', (socket) =&gt; {
  console.log('SERVER connection · transport =', socket.conn.transport.name);
  socket.conn.on('upgrade', (t) =&gt; console.log('SERVER upgrade   · transport =', t.name));
  socket.on('chao', (msg) =&gt; { console.log('SERVER nhận chao:', msg); client.close(); server.close(); });
});
const client = io('http://localhost:19404');
client.on('connect', () =&gt; {
  console.log('CLIENT connect    · transport =', client.io.engine.transport.name);
  setTimeout(() =&gt; client.emit('chao', { tu: 'client', luc: 'sau 300 ms' }), 300);
});</code></pre><div class="out">$ node probe.js
SERVER connection · transport = polling
CLIENT connect    · transport = polling
SERVER upgrade   · transport = websocket
SERVER nhận chao: { tu: 'client', luc: 'sau 300 ms' }</div>
<p>Both sides start on <strong>polling</strong> (layer 1); engine.io upgrades to <strong>websocket</strong> (layer 2); the named event arrives with its JSON (layers 3–4). The same event, printed by each layer:</p>
<div class="out">$ node tang.js
tầng 4 client: socket.emit('chao', { tu: 'client' })
tầng 2 engine.io: type=message data=2["chao",{"tu":"client"}] · tầng 1 dây: websocket gửi "42["chao",{"tu":"client"}]"
tầng 4 handler chao nhận: {"tu":"client"}</div>
<p>Layer 3 writes <code>2["chao",…]</code> (2 = EVENT); layer 2 prefixes <code>4</code> (MESSAGE); the wire carries <code>42[…]</code>. Lesson 0.3 decodes every digit.</p>
<h3>🧯 Five real incidents from this repo</h3>
<p>Straight from <code>git log</code> — each one silent, each one owned by a single layer:</p>
<div class="out">2026-08-21 0852eb4ed fix(call): gọi người KHÔNG online thì im lặng đổ chuông vào hư không
2026-09-17 110097d08 fix(tin nhắn): app desktop "ngoại tuyến mãi" — socket CHƯA TỪNG nối được lần nào
2026-10-15 8a87e3298 fix(messages): một người một hội thoại với admin + mỗi sự kiện socket chỉ tới một lần
2026-10-22 39eb43755 fix(privacy): một luật trạng thái hoạt động cho mọi chỗ — khách/người lạ/chặn/đối ứng không thấy; socket không phát toàn cục
2026-11-01 e9ed78dc6 fix(socket): trần 500 phòng post:&lt;id&gt; tính theo MỖI SOCKET thay vì mỗi lượt post:subscribe — gọi lặp từng cho một socket vào 100.000 phòng (~58 MB, đo ở bài Node.js 11.2); tách vaoPhongBaiViet + test</div>
<ul><li><strong>Call to an offline user</strong> — <code>io.to(room).emit</code> into an EMPTY room is valid and says nothing; the caller watched "Calling…" for 45 s with clean logs (layer 3, lesson 7.3).</li>
<li><strong>Desktop app "offline forever"</strong> — <code>transports: ['websocket']</code> + token in <code>extraHeaders</code>: a browser WebSocket cannot set headers, so the token never arrived (layers 1–2; fix: <code>auth: { token }</code>, lesson 1.4).</li>
<li><strong>Every message twice</strong> — two emits to two rooms that every device was in (layer 3, lesson 3.4).</li>
<li><strong>Presence leaked</strong> — an error path fell back to a GLOBAL broadcast (layers 3–4, Chapter 4).</li>
<li><strong>100,000 rooms in one socket</strong> — a limit counted per call instead of per socket (~58 MB; lesson 3.3).</li></ul>
<h3>🔁 Run it yourself</h3>
<p>Copy the probe above into <code>probe.js</code> in a folder where you ran <code>npm i socket.io@4.8.3 socket.io-client@4.8.3</code>, then <code>node probe.js</code>. Add <code>socket.conn.on('packet', (p) =&gt; console.log(p.type, p.data))</code> on the server to print what layer 2 sees.</p>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-3-xac-thuc-phan-quyen-socket" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 11.3 — Authenticate once, authorise every time</span><span class="lc-sub">Handshake auth vs the extraHeaders trap, measured</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/socket-io/learn?lessonSlug=io-1-4-auth" target="_blank" rel="noopener"><span class="lc-ico">⚡</span><span class="lc-body"><span class="lc-title">Socket.IO · 1.4 — Authentication: middleware runs before connection</span><span class="lc-sub">Where the token should travel, in this course</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Four layers</span><span class="v">wire, engine.io, socket.io, your code — the model the whole course uses.</span></div>
  <div class="kv"><span class="k">engine.io</span><span class="v">Layer 2: heartbeats, transport upgrades, its own sid.</span></div>
  <div class="kv"><span class="k">socket.io</span><span class="v">Layer 3: namespaces, rooms, acks, binary.</span></div>
  <div class="kv"><span class="k">Probe</span><span class="v">A tiny throwaway script that connects and prints the wire so you can read it.</span></div>
  <div class="kv"><span class="k">Transport</span><span class="v">The layer-1 wire (polling or WebSocket) a connection currently uses.</span></div>
  <div class="kv"><span class="k">Measured vs reasoned</span><span class="v">A number you ran versus one you inferred — the course labels which.</span></div>
</div>
<h3>📌 Summary</h3>
<ul><li>One model runs the whole course: four layers — wire, engine.io, socket.io, your code.</li><li>Three habits repeat: measure not guess, name the layer first, let the library do reconnect and heartbeat.</li><li>Chapters 1-2 lifecycle/transports, 3 rooms, 4 presence, 5 cluster, 6 acks, 7 WebRTC, 8 CRDT (Yjs), 9 raw ws, 10-11 diagnosis and exam.</li><li>Study by running the probes; reading the code is not the same as running it.</li><li>Every surprise in the course is traced back to the exact layer responsible.</li></ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây</span>
<h2>Mô hình bốn tầng và cách học khoá này</h2>
<p class="lead">Bài 1 nói realtime là gì. Bài này trao cho bạn mô hình tư duy duy nhất mà cả khoá dựa vào — bốn tầng xếp chồng — cộng ba thói quen lặp lại dưới những cái tên khác nhau, và một cách học trung thực cho một khoá dựng từ các packet đo được: chạy probe và đọc dây. Đọc mã không giống chạy mã, và khoá này được viết bằng cách chạy nó.</p>
<h3>Bốn tầng mà mọi connection xếp chồng</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">tầng 4 — mã của bạn</span><span class="lz-lnote">Sự kiện có tên và JSON: <code>socket.on('chat:message', ...)</code>. Đây là <code>src/socket/*.ts</code>.</span></div>
<div class="lz-layer"><span class="lz-lname">tầng 3 — socket.io</span><span class="lz-lnote">Namespace, room, ack, binary, và một sid trên mỗi connection.</span></div>
<div class="lz-layer"><span class="lz-lname">tầng 2 — engine.io</span><span class="lz-lnote">Bản thân connection: heartbeat, upgrade transport, sid riêng.</span></div>
<div class="lz-layer"><span class="lz-lname">tầng 1 — dây</span><span class="lz-lnote">Một HTTP long-poll hoặc một WebSocket, do engine.io chọn (và upgrade).</span></div>
</div>
<h3>Ba thói quen lặp lại</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Đo, đừng đoán</span><span class="v">Mọi bảng ở đây là một con số có người chạy; phép đo của bạn thắng mọi mặc định.</span></div>
  <div class="kv"><span class="k">Gọi tên tầng trước</span><span class="v">Trước khi debug, quyết xem triệu chứng thuộc tầng nào trong bốn tầng — điều đó chọn công cụ.</span></div>
  <div class="kv"><span class="k">Để thư viện làm phần khó</span><span class="v">Reconnect và heartbeat là tầng 2/3; bạn không bao giờ viết tay chúng ở tầng 4.</span></div>
</div>
<h3>Bản đồ</h3>
<p>Chương 1-2 là vòng đời và transport (tầng 1-2). Chương 3 room và Chương 4 presence (tầng 3). Chương 5 mở rộng ra nhiều worker với Redis adapter. Chương 6 là ack và giao tin. Chương 7 là signalling WebRTC, Chương 8 là soạn thảo cộng tác bằng CRDT (Yjs), Chương 9 là WebSocket thô. Chương 10 chẩn đoán, Chương 11 là cái sống qua đo lường cùng đề thi cuối. Khi một bất ngờ xuất hiện, khoá luôn gọi tên tầng chịu trách nhiệm cho nó.</p>
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Trong một thư mục nháp, cài cả hai thư viện: <code>npm i socket.io socket.io-client ws</code>.</li>
<li>Chạy một dòng chứng minh chúng nạp được và in phiên bản, rồi viết một server + client 15 dòng emit một event và log nó ở phía bên kia.</li>
<li>Trong handler <code>connect</code> của client log <code>socket.io.engine.transport.name</code>, và trong handler connection của server log <code>socket.conn.transport.name</code> — xem cả hai và gán thứ bạn thấy vào bốn tầng.</li>
</ol>
<pre><code class="language-bash">node -e "console.log('socket.io', require('socket.io/package.json').version, '| ws', require('ws/package.json').version)"</code></pre>
<p><strong>Đạt khi:</strong> cả hai thư viện chạy trên máy bạn, một event đi trọn hai đầu, và bạn vẽ lại được bốn tầng từ trí nhớ.</p></div>
<h3>🔬 Đo thật: một event, hai đầu</h3>
<p>Đoạn probe 15 dòng của phần Thực hành, chạy thật (socket.io 4.8.3, Node 22):</p>
<pre><code class="language-javascript"><span class="tok-comment">// server + client trong 15 dòng: một event đi trọn hai đầu, in transport ở CẢ hai phía</span>
const { Server } = require('socket.io');
const { io } = require('socket.io-client');
const server = new Server(19404);
server.on('connection', (socket) =&gt; {
  console.log('SERVER connection · transport =', socket.conn.transport.name);
  socket.conn.on('upgrade', (t) =&gt; console.log('SERVER upgrade   · transport =', t.name));
  socket.on('chao', (msg) =&gt; { console.log('SERVER nhận chao:', msg); client.close(); server.close(); });
});
const client = io('http://localhost:19404');
client.on('connect', () =&gt; {
  console.log('CLIENT connect    · transport =', client.io.engine.transport.name);
  setTimeout(() =&gt; client.emit('chao', { tu: 'client', luc: 'sau 300 ms' }), 300);
});</code></pre><div class="out">$ node probe.js
SERVER connection · transport = polling
CLIENT connect    · transport = polling
SERVER upgrade   · transport = websocket
SERVER nhận chao: { tu: 'client', luc: 'sau 300 ms' }</div>
<p>Cả hai phía bắt đầu bằng <strong>polling</strong> (tầng 1); engine.io nâng cấp lên <strong>websocket</strong> (tầng 2); event có tên tới cùng JSON của nó (tầng 3–4). Cùng event đó, in ra ở từng tầng:</p>
<div class="out">$ node tang.js
tầng 4 client: socket.emit('chao', { tu: 'client' })
tầng 2 engine.io: type=message data=2["chao",{"tu":"client"}] · tầng 1 dây: websocket gửi "42["chao",{"tu":"client"}]"
tầng 4 handler chao nhận: {"tu":"client"}</div>
<p>Tầng 3 viết <code>2["chao",…]</code> (2 = EVENT); tầng 2 thêm <code>4</code> phía trước (MESSAGE); dây chở <code>42[…]</code>. Bài 0.3 giải mã từng chữ số.</p>
<h3>🧯 Năm sự cố thật của kho này</h3>
<p>Lấy thẳng từ <code>git log</code> — cái nào cũng im lặng, cái nào cũng thuộc về đúng một tầng:</p>
<div class="out">2026-08-21 0852eb4ed fix(call): gọi người KHÔNG online thì im lặng đổ chuông vào hư không
2026-09-17 110097d08 fix(tin nhắn): app desktop "ngoại tuyến mãi" — socket CHƯA TỪNG nối được lần nào
2026-10-15 8a87e3298 fix(messages): một người một hội thoại với admin + mỗi sự kiện socket chỉ tới một lần
2026-10-22 39eb43755 fix(privacy): một luật trạng thái hoạt động cho mọi chỗ — khách/người lạ/chặn/đối ứng không thấy; socket không phát toàn cục
2026-11-01 e9ed78dc6 fix(socket): trần 500 phòng post:&lt;id&gt; tính theo MỖI SOCKET thay vì mỗi lượt post:subscribe — gọi lặp từng cho một socket vào 100.000 phòng (~58 MB, đo ở bài Node.js 11.2); tách vaoPhongBaiViet + test</div>
<ul><li><strong>Gọi người không online</strong> — <code>io.to(room).emit</code> vào một room RỖNG là lệnh hợp lệ và không báo gì; người gọi nhìn "Đang gọi…" 45 giây, log sạch (tầng 3, bài 7.3).</li>
<li><strong>App desktop "ngoại tuyến mãi"</strong> — <code>transports: ['websocket']</code> + token trong <code>extraHeaders</code>: WebSocket của trình duyệt không cho đặt header nên token không bao giờ tới (tầng 1–2; sửa: <code>auth: { token }</code>, bài 1.4).</li>
<li><strong>Mỗi tin tới hai lần</strong> — hai lượt emit vào hai room mà máy nào cũng ở cả hai (tầng 3, bài 3.4).</li>
<li><strong>Lộ trạng thái online</strong> — một đường lỗi rơi về phát TOÀN CỤC (tầng 3–4, Chương 4).</li>
<li><strong>100.000 room trong một socket</strong> — giới hạn đếm theo lượt gọi thay vì theo socket (~58 MB; bài 3.3).</li></ul>
<h3>🔁 Tự chạy lại</h3>
<p>Chép probe ở trên vào <code>probe.js</code> trong thư mục đã chạy <code>npm i socket.io@4.8.3 socket.io-client@4.8.3</code>, rồi <code>node probe.js</code>. Thêm <code>socket.conn.on('packet', (p) =&gt; console.log(p.type, p.data))</code> ở server để in thứ tầng 2 thấy.</p>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-3-xac-thuc-phan-quyen-socket" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 11.3 — Xác thực một lần, phân quyền mọi lần</span><span class="lc-sub">Xác thực lúc bắt tay và bẫy extraHeaders, có số đo</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/socket-io/learn?lessonSlug=io-1-4-auth" target="_blank" rel="noopener"><span class="lc-ico">⚡</span><span class="lc-body"><span class="lc-title">Socket.IO · 1.4 — Xác thực: middleware chạy TRƯỚC connection</span><span class="lc-sub">Token nên đi đường nào, ngay trong khoá này</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bốn tầng</span><span class="v">dây, engine.io, socket.io, mã của bạn — mô hình cả khoá dùng.</span></div>
  <div class="kv"><span class="k">engine.io</span><span class="v">Tầng 2: heartbeat, upgrade transport, sid riêng.</span></div>
  <div class="kv"><span class="k">socket.io</span><span class="v">Tầng 3: namespace, room, ack, binary.</span></div>
  <div class="kv"><span class="k">Probe</span><span class="v">Một script nháp nhỏ kết nối rồi in dây ra để bạn đọc được.</span></div>
  <div class="kv"><span class="k">Transport</span><span class="v">Cái dây tầng 1 (polling hoặc WebSocket) mà connection đang dùng.</span></div>
  <div class="kv"><span class="k">Đo vs suy luận</span><span class="v">Con số bạn chạy so với con số bạn suy ra — khoá ghi rõ cái nào.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul><li>Một mô hình chạy suốt khoá: bốn tầng — dây, engine.io, socket.io, mã của bạn.</li><li>Ba thói quen lặp lại: đo đừng đoán, gọi tên tầng trước, để thư viện lo reconnect và heartbeat.</li><li>Chương 1-2 vòng đời/transport, 3 room, 4 presence, 5 cụm, 6 ack, 7 WebRTC, 8 CRDT (Yjs), 9 ws thô, 10-11 chẩn đoán và thi.</li><li>Học bằng cách chạy probe; đọc mã không giống chạy mã.</li><li>Mọi bất ngờ trong khoá đều được truy về đúng tầng chịu trách nhiệm.</li></ul>
</div>
`,
    },

    /* ─────────────────────────── 0.1 ─────────────────────────── */
    {
      title: '0.1 — Socket.IO is engine.io wrapped in namespaces and rooms|||0.1 — Socket.IO là engine.io được BỌC bởi namespace và room',
      slug: 'io-0-1-la-gi',
      type: 'VIDEO',
      description: 'Câu duy nhất cần nhớ. Sau đó là bảng đối chiếu bốn tầng: HTTP/WebSocket → engine.io → socket.io → mã của bạn. Mọi mỗi hành vi lạ đều suy ra từ tầng nào chịu trách nhiệm.',
      content: `
${G00_1}
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>Socket.IO is engine.io wrapped in namespaces and rooms</h2>
<p class="lead">The name &quot;Socket.IO&quot; suggests something close to the browser&#39;s <code>WebSocket</code> API with a friendly npm wrapper. That is not what it is. It is <em>two</em> libraries stacked on top of two transports, and mistaking either boundary produces surprises. This lesson lays out the four layers before any code runs.</p>

<h3>The four layers</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">layer 4 — your code</span><span class="lz-lnote"><code>io.on(&#39;connection&#39;, s =&gt; s.on(&#39;chat:message&#39;, ...))</code>. Named events, JSON payloads, rooms. This is the part in <code>src/socket/*.ts</code></span></div>
<div class="lz-layer"><span class="lz-lname">layer 3 — socket.io</span><span class="lz-lnote">Adds namespaces, rooms, acks, binary handling, and a per-connection sid. Speaks its own packet format on top of layer 2. This is <code>socket.io</code> 4.8.3 in <code>package.json</code></span></div>
<div class="lz-layer"><span class="lz-lname">layer 2 — engine.io</span><span class="lz-lnote">Manages the connection itself — heartbeats, transport upgrades, its OWN sid. Bundled with socket.io; you never install it directly, but you WILL see its packet types in DevTools</span></div>
<div class="lz-layer"><span class="lz-lname">layer 1 — the wire</span><span class="lz-lnote">Either an HTTP long-poll or a WebSocket, chosen by engine.io. Not one or the other for the life of the connection — the same connection can START as HTTP and UPGRADE to WebSocket one round-trip later (39 ms on the course machine)</span></div>
</div>

<h3>Measured on this repo</h3>
<pre><code class="language-bash">$ grep -rE "socket\\.io|@socket\\.io" package.json | head
"@socket.io/redis-adapter": "^8.3.0",
"socket.io": "^4.8.3",

$ wc -l $(ls src/socket/*.ts | grep -v test)
     281 src/socket/call.socket.ts
    1113 src/socket/device.gateway.ts
     680 src/socket/doiKhang.socket.ts
     362 src/socket/listen-together.ts
     614 src/socket/messaging.socket.ts
     300 src/socket/notes-collaboration.gateway.ts
     410 src/socket/work-docs-collaboration.gateway.ts
     175 src/socket/work.socket.ts
    3935 total
</code></pre>

<div class="out">3,935 lines of gateway (8 files, tests excluded, measured 13/11/2026) — it was 2,430 when the course was first written
ALL of them sit on socket.io layer 3 EXCEPT device.gateway.ts (Maker Lab): raw WebSocket, NOT socket.io — Chapter 9
</div>

<h3>Who does what — a side-by-side</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">CORS</span><span class="lz-nsub">layer 3</span></span>
<span class="lz-nbody">Configured at <code>new IOServer(server, { cors: { origin: true, credentials: true } })</code>. The HTTP CORS you set up in Express does NOT apply to the WebSocket upgrade — socket.io has its own option for it.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">ping/pong</span><span class="lz-nsub">layer 2</span></span>
<span class="lz-nbody">Engine.io sends a ping every <code>pingInterval</code> seconds on its own and disconnects after <code>pingTimeout</code> with no reply. This repo uses 25s/60s. You do NOT hand-write pings at layer 4.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">reconnect</span><span class="lz-nsub">layer 3 (client)</span></span>
<span class="lz-nbody">The client reconnects on its own with exponential backoff — about 1 s, 2 s, 4 s, capped at 5 s, each randomised ±50 % (measured below: 1.4 / 3.0 / 4.3 / 5.0 / 5.0 s). Layer 4 only receives <code>&#39;connect&#39;</code>/<code>&#39;disconnect&#39;</code> events; you never write the loop.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">room broadcast</span><span class="lz-nsub">layer 3</span></span>
<span class="lz-nbody"><code>io.to(&#39;user:42&#39;).emit(...)</code> reaches only the sockets that have <code>socket.join(&#39;user:42&#39;)</code>. Rooms do NOT exist at layer 2 — they are a socket.io abstraction.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">cluster broadcast</span><span class="lz-nsub">Redis adapter</span></span>
<span class="lz-nbody"><code>io.to(&#39;room&#39;).emit(...)</code> by default reaches only the CURRENT worker. A multi-worker cluster needs <code>@socket.io/redis-adapter</code> so sockets on other workers receive it too. This repo has one; Chapter 5 measures it.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">binary data</span><span class="lz-nsub">layers 2 and 3</span></span>
<span class="lz-nbody">Buffer/ArrayBuffer is encoded into real WebSocket binary frames, not base64. The client receives the same type. You never think about layer 1.</span>
</div>
</div>

<h3>Four surprising behaviours and the layer responsible for each</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">a</span><span class="lz-t">&quot;the initial connection is an HTTP POST&quot;</span><span class="lz-d"><strong>Layers 1 and 2.</strong> The client tries HTTP long-poll first by default, then upgrades to WebSocket. Look at the DevTools Network tab — you will see a few requests to <code>/socket.io/?EIO=4&amp;transport=polling</code> before any WS frame shows up. Not a bug; a feature (Chapter 2).</span></div>
<div class="lz-step"><span class="lz-k">b</span><span class="lz-t">&quot;the disconnect takes 60 seconds&quot;</span><span class="lz-d"><strong>Layer 2.</strong> That is <code>pingInterval</code> + <code>pingTimeout</code> — measured: <strong>45.0 s</strong> with the defaults (25 + 20), <strong>85.0 s</strong> with this repo's 25 + 60. The server only learns the client is gone when a ping goes unanswered. For that entire window, <code>io.sockets.adapter.rooms</code> still believes the client is there. Shorten it by lowering <code>pingTimeout</code>, not by writing more code.</span></div>
<div class="lz-step"><span class="lz-k">c</span><span class="lz-t">&quot;the broadcast never reaches the other workers&quot;</span><span class="lz-d"><strong>Layer 3 + Redis adapter.</strong> Cluster mode runs 4 Node workers, and a WebSocket connects to exactly ONE of them and stays there (sticky sessions in nginx). <code>io.emit</code> by default reaches only that worker. The Redis adapter carries messages across workers over pub/sub. Chapter 5.</span></div>
<div class="lz-step"><span class="lz-k">d</span><span class="lz-t">&quot;the client is using 2 different sids&quot;</span><span class="lz-d"><strong>Layers 2 and 3.</strong> The engine.io sid is not the socket.io sid — one engine.io connection can carry several namespaces, and each namespace issues its own sid. Lesson 0.3 measures this by connecting with a raw WebSocket.</span></div>
</div>

<div class="callout warn">
<p><strong>This sentence matters — each thing that annoys you lives at a DIFFERENT layer.</strong> You do not &quot;debug Socket.IO&quot; as one monolithic thing. You debug layer 4 (business logic) when an <code>emit</code> leaves but never arrives; layer 3 when a room or namespace is wrong; layer 2 on a ping timeout; layer 1 when a proxy blocks WebSocket. Four different tools for four layers.</p>
</div>

<h3>What Socket.IO is NOT</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">NOT the <code>WebSocket</code> browser API</span><span class="lz-lnote">The browser has <code>new WebSocket(url)</code> — 200 lines of W3C spec. Socket.IO sits ON TOP of it and adds reconnect + rooms + acks + fallback. You do NOT call <code>new WebSocket</code> when you use socket.io</span></div>
<div class="lz-layer"><span class="lz-lname">NOT MQTT / STOMP</span><span class="lz-lnote">Those &quot;proper&quot; pub/sub protocols have deep topic hierarchies, QoS levels and retained messages. Socket.io has an event name (a flat string) plus rooms. Smaller and easier, but also FEWER features</span></div>
<div class="lz-layer"><span class="lz-lname">NOT a standalone &quot;realtime server&quot;</span><span class="lz-lnote">There is no <code>socket.io</code> process running on its own. It is a library living inside your Express process — same HTTP server, same port, same memory. That is exactly what makes Chapter 5 delicate</span></div>
<div class="lz-layer"><span class="lz-lname">NOT exactly-once delivery by default</span><span class="lz-lnote">If the client drops while an emit is in flight, THAT message can be lost. Chapter 6 teaches acks + retries to get &quot;at-least-once&quot;. Anyone who wants exactly-once has to build their own dedupe layer</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — installing <code>ws</code> instead of <code>socket.io</code> because it is &quot;lighter&quot;.</strong> Measured: in the browser a raw WebSocket costs 0 bytes (built in) and the socket.io client is 46,822 B minified, 14,722 B gzipped; on the server <code>ws</code> already ships inside socket.io (via engine.io). Then you write reconnect yourself (hard — how long? which backoff?), heartbeat (hard — a dead server and a dead client are not the same thing), room broadcast (easy but slow to build), and a fallback for proxies that strip the upgrade (very hard). Three months later you have a worse socket.io with no documentation. This repo DOES have one place that uses <code>ws</code> raw — <code>device.gateway.ts</code> — and it takes 1,113 lines to do its job; Chapter 9 teaches when that trade is worth making.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Socket.IO is engine.io (a connection manager with pings and transport upgrades) wrapped in namespaces and rooms (a per-event routing layer) — four layers matching four different debugging surfaces, and every surprise in this course traces back to exactly which layer is responsible.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Start any Socket.IO server and open the client page; in DevTools → Network → WS watch the first requests go to <code>/socket.io/?EIO=4&amp;transport=polling</code> before a WebSocket frame ever appears (layers 1-2).</li>
<li>Take three annoying behaviours — &quot;the disconnect takes 85 s&quot;, &quot;a broadcast never reaches the other worker&quot;, &quot;the client has two different sids&quot; — and label each with the one layer responsible (2, 3+Redis, 2-and-3).</li>
<li>List the files under <code>src/socket/</code> and mark which sit on socket.io (layer 3) and the one that uses raw WebSocket.</li>
</ol>
<p><strong>Done when:</strong> you can map at least three surprising behaviours to the exact layer that owns them, rather than &quot;debugging Socket.IO&quot; as one thing.</p></div>

<h3>🔬 Measured: the four surprises, on socket.io 4.8.3</h3>
<p><strong>Two sids on one connection</strong> — two namespaces through one Manager:</p>
<div class="out">server /       socket.id=xrny6KHyzkE-3ZbfAAAA  conn.id=5_DeLghS1q2391KLAAAA  transport=polling  (+31 ms)
server /admin  socket.id=j3s5f38_vbS4mRTZAAAB  conn.id=5_DeLghS1q2391KLAAAA  transport=polling  (+37 ms)
server /       upgrade → websocket  (+39 ms)
server /admin  upgrade → websocket  (+39 ms)
client: hai socket dùng chung MỘT engine: true · engine.id=5_DeLghS1q2391KLAAAA</div>
<p>Same <code>conn.id</code> (layer 2, the connection), different <code>socket.id</code> per namespace (layer 3).</p>
<p><strong>How long until the server notices a dead client</strong> — the client is frozen with SIGSTOP right after connecting (no FIN, like a laptop lid):</p>
<div class="out">kho này 25000/60000: client đã nối rồi bị đông cứng (SIGSTOP)
mặc định 25000/20000: client đã nối rồi bị đông cứng (SIGSTOP)
mặc định 25000/20000: server thấy disconnect "ping timeout" sau 45.0 s
kho này 25000/60000: server thấy disconnect "ping timeout" sau 85.0 s</div>
<p>Worst case ≈ <code>pingInterval</code> + <code>pingTimeout</code>. During that window the socket is still in its rooms and presence still says online.</p>
<p><strong>Reconnect backoff</strong> — server down for 14 s:</p>
<div class="out">  0.63 s connect
  1.61 s ── server chết
  1.61 s disconnect: transport close
  3.01 s reconnect_attempt #1  (cách lần trước 1395 ms)
  5.99 s reconnect_attempt #2  (cách lần trước 2977 ms)
 10.29 s reconnect_attempt #3  (cách lần trước 4308 ms)
 15.30 s reconnect_attempt #4  (cách lần trước 5007 ms)
 15.61 s ── server sống lại
 20.31 s reconnect_attempt #5  (cách lần trước 5009 ms)
 20.33 s connect
 21.61 s disconnect: io client disconnect</div>
<p><strong>A broadcast stops at the worker</strong> — two server processes, no adapter:</p>
<div class="out">worker A gọi io.emit("tin") …
client nối worker A nhận: từ worker 19412
… client của worker B: KHÔNG nhận gì (không có Redis adapter)</div>
<p><strong>The "ws is lighter" numbers:</strong></p>
<div class="out">$ for p in ws@8.21.2 socket.io@4.8.3 engine.io@6.6.11 socket.io-client@4.8.3; do printf '%-24s %8s byte (unpacked)\\n' $p "$(npm view $p dist.unpackedSize)"; done
ws@8.21.2                  150792 byte (unpacked)
socket.io@4.8.3           1416999 byte (unpacked)
engine.io@6.6.11           162973 byte (unpacked)
socket.io-client@4.8.3    1417815 byte (unpacked)
$ wc -c node_modules/socket.io-client/dist/socket.io.min.js node_modules/socket.io-client/dist/socket.io.js | head -2
   46822 node_modules/socket.io-client/dist/socket.io.min.js
  155836 node_modules/socket.io-client/dist/socket.io.js
$ gzip -c node_modules/socket.io-client/dist/socket.io.min.js | wc -c
   14722</div>
<h3>🔁 Run it yourself</h3>
<p>The two-sids probe (needs <code>npm i socket.io@4.8.3 socket.io-client@4.8.3</code> and <code>"type": "module"</code>):</p>
<pre><code class="language-javascript"><span class="tok-comment">// MỘT connection engine.io, HAI namespace ⇒ một conn.id (tầng 2), hai socket.id (tầng 3)</span>
import { Server } from 'socket.io';
import { io as ketNoi, Manager } from 'socket.io-client';
const io = new Server(19410);
const t0 = Date.now();
for (const ns of ['/', '/admin']) io.of(ns).on('connection', (s) =&gt; {
  console.log(&#96;server \${ns.padEnd(7)} socket.id=\${s.id}  conn.id=\${s.conn.id}  transport=\${s.conn.transport.name}  (+\${Date.now() - t0} ms)&#96;);
  s.conn.once('upgrade', (t) =&gt; console.log(&#96;server \${ns.padEnd(7)} upgrade → \${t.name}  (+\${Date.now() - t0} ms)&#96;));
});
const m = new Manager('http://localhost:19410');
const a = m.socket('/'), b = m.socket('/admin');
await new Promise((r) =&gt; setTimeout(r, 1200));
console.log(&#96;client: hai socket dùng chung MỘT engine: \${a.io.engine === b.io.engine} · engine.id=\${m.engine.id}&#96;);
a.disconnect(); b.disconnect(); io.close(); process.exit(0);</code></pre>
<p>To see the disconnect window yourself: start a client in its own process, then <code>kill -STOP &lt;pid&gt;</code> and time the server's <code>disconnect</code> event. Lower <code>pingInterval</code>/<code>pingTimeout</code> (e.g. 2000/2000) to wait seconds instead of a minute.</p>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-4-scale-adapter-backpressure" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 11.4 — More than one process: adapter, sticky sessions, backpressure</span><span class="lc-sub">The cluster story of surprise (c), measured from the Node side</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-8-1-pubsub" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 8.1 — Pub/Sub: fire and forget, and its price</span><span class="lc-sub">The mechanism the Redis adapter is built on</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">engine.io</span><span class="v">Layer 2 — the connection manager: heartbeats, transport upgrades, its own sid.</span></div>
  <div class="kv"><span class="k">socket.io</span><span class="v">Layer 3 — adds namespaces, rooms, acks, binary and a per-connection sid.</span></div>
  <div class="kv"><span class="k">Namespace</span><span class="v">A logical channel on one connection; each issues its own sid.</span></div>
  <div class="kv"><span class="k">Room</span><span class="v">A layer-3 grouping sockets join; <code>io.to(room).emit()</code> targets only its members.</span></div>
  <div class="kv"><span class="k">Transport</span><span class="v">The layer-1 wire (HTTP long-poll or WebSocket) engine.io chooses and upgrades.</span></div>
  <div class="kv"><span class="k">Redis adapter</span><span class="v">Carries a broadcast across cluster workers over pub/sub (Chapter 5).</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Socket.IO is two libraries on two transports: engine.io (layer 2) wrapped by socket.io (layer 3).</li><li>Layer 1 is the wire (poll or WS); layer 4 is your named-event code in <code>src/socket/*.ts</code>.</li><li>Every surprise maps to one layer: ping timeout = layer 2, wrong room = layer 3, blocked upgrade = layer 1.</li><li>Rooms and namespaces are layer-3 abstractions; they do not exist at layer 2.</li><li>A broadcast reaches other cluster workers only through the Redis adapter.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — How it works</span><span class="lc-sub">socket.io/docs/v4/how-it-works — tài liệu chính thức mô tả bốn tầng, ngắn hơn bài này nhưng dùng làm nguồn thứ hai.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Engine.IO protocol</span><span class="lc-sub">github.com/socketio/engine.io-protocol — đặc tả wire packet của layer 2, đọc xong hiểu bài 0.3 nói gì.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — WebSocket API</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/API/WebSockets_API — layer 1, thứ mà socket.io ngồi lên trên. Nhỏ nhưng đủ để hiểu &quot;WebSocket&quot; thật ra là gì.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">The Socket.IO track on Code Lab</span><span class="lc-sub">/code-lab/tracks/socket-io${REF} — mười thử thách thực hành song song mỗi chương của khoá.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Socket.IO là engine.io được BỌC bởi namespace và room</h2>
<p class="lead">Cái tên &quot;Socket.IO&quot; gợi ra một thứ gần với API <code>WebSocket</code> của trình duyệt cộng một wrapper npm dễ chịu. KHÔNG phải vậy. Nó là <em>HAI</em> thư viện xếp chồng lên HAI transport, và nhầm ranh giới nào cũng sinh ra bất ngờ. Bài này bày bốn tầng ra trước khi bất kỳ dòng mã nào chạy.</p>

<h3>Bốn tầng</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">tầng 4 — mã của bạn</span><span class="lz-lnote"><code>io.on(&#39;connection&#39;, s =&gt; s.on(&#39;chat:message&#39;, ...))</code>. Sự kiện có tên, payload JSON, room. Phần này ở <code>src/socket/*.ts</code></span></div>
<div class="lz-layer"><span class="lz-lname">tầng 3 — socket.io</span><span class="lz-lnote">Thêm namespace, room, ack, xử lý binary, và một sid trên mỗi connection. Nói packet format riêng trên đầu tầng 2. Đây là <code>socket.io</code> 4.8.3 trong <code>package.json</code></span></div>
<div class="lz-layer"><span class="lz-lname">tầng 2 — engine.io</span><span class="lz-lnote">Quản lý bản thân connection — heartbeat, upgrade transport, sid RIÊNG. Được bundle với socket.io; bạn không cài trực tiếp nhưng SẼ thấy packet type của nó trong DevTools</span></div>
<div class="lz-layer"><span class="lz-lname">tầng 1 — dây</span><span class="lz-lnote">Hoặc HTTP long-poll, hoặc WebSocket, do engine.io chọn. KHÔNG phải một trong hai suốt đời — cùng một connection có thể BẮT ĐẦU bằng HTTP rồi UPGRADE sang WebSocket sau một vòng đi-về (39 ms trên máy của khoá)</span></div>
</div>

<h3>Đo trên kho này</h3>
<pre><code class="language-bash">$ grep -rE "socket\\.io|@socket\\.io" package.json | head
"@socket.io/redis-adapter": "^8.3.0",
"socket.io": "^4.8.3",

$ wc -l $(ls src/socket/*.ts | grep -v test)
     281 src/socket/call.socket.ts
    1113 src/socket/device.gateway.ts
     680 src/socket/doiKhang.socket.ts
     362 src/socket/listen-together.ts
     614 src/socket/messaging.socket.ts
     300 src/socket/notes-collaboration.gateway.ts
     410 src/socket/work-docs-collaboration.gateway.ts
     175 src/socket/work.socket.ts
    3935 total
</code></pre>

<div class="out">3.935 dòng gateway (8 tệp, không tính test, đo 13/11/2026) — lúc mới soạn khoá là 2.430
TẤT CẢ ngồi trên socket.io tầng 3, TRỪ device.gateway.ts (Maker Lab): WebSocket THUẦN, không qua socket.io — Chương 9
</div>

<h3>Đối chiếu ai làm gì</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">CORS</span><span class="lz-nsub">tầng 3</span></span>
<span class="lz-nbody">Cấu hình ở <code>new IOServer(server, { cors: { origin: true, credentials: true } })</code>. HTTP CORS bên Express KHÔNG áp cho upgrade WebSocket — socket.io có option riêng.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">ping/pong</span><span class="lz-nsub">tầng 2</span></span>
<span class="lz-nbody">Engine.io tự gửi ping mỗi <code>pingInterval</code> giây, ngắt kết nối sau <code>pingTimeout</code> không hồi. Kho này dùng 25s/60s. Bạn KHÔNG viết ping bằng tay ở tầng 4.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">reconnect</span><span class="lz-nsub">tầng 3 (client)</span></span>
<span class="lz-nbody">Client tự động reconnect với exponential backoff — khoảng 1 s, 2 s, 4 s, tối đa 5 s, mỗi khoảng ngẫu nhiên ±50 % (đo bên dưới: 1,4 / 3,0 / 4,3 / 5,0 / 5,0 s). Tầng 4 chỉ nhận <code>&#39;connect&#39;</code>/<code>&#39;disconnect&#39;</code> events; không cần viết loop.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">broadcast room</span><span class="lz-nsub">tầng 3</span></span>
<span class="lz-nbody"><code>io.to(&#39;user:42&#39;).emit(...)</code> chỉ đến các socket đã <code>socket.join(&#39;user:42&#39;)</code>. Room KHÔNG có ở tầng 2 — nó là abstraction của socket.io.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">broadcast cluster</span><span class="lz-nsub">Redis adapter</span></span>
<span class="lz-nbody"><code>io.to(&#39;room&#39;).emit(...)</code> mặc định chỉ đến worker HIỆN TẠI. Cụm nhiều worker cần <code>@socket.io/redis-adapter</code> để socket ở worker khác cũng nhận. Kho này có; Chương 5 đo cái đó.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">dữ liệu binary</span><span class="lz-nsub">tầng 2 và 3</span></span>
<span class="lz-nbody">Buffer/ArrayBuffer được encode thành binary frames của WebSocket, không phải base64. Client nhận cùng type. Không cần nghĩ về tầng 1.</span>
</div>
</div>

<h3>Bốn hành vi bất ngờ và tầng chịu trách nhiệm</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">a</span><span class="lz-t">&quot;kết nối ban đầu là POST HTTP&quot;</span><span class="lz-d"><strong>Tầng 1 và 2.</strong> Client mặc định thử HTTP long-poll trước, sau đó nâng cấp lên WebSocket. Xem DevTools Network tab — bạn sẽ thấy vài request đến <code>/socket.io/?EIO=4&amp;transport=polling</code> trước khi frame WS xuất hiện. Không phải bug; là feature (Chương 2).</span></div>
<div class="lz-step"><span class="lz-k">b</span><span class="lz-t">&quot;disconnect mất 60 giây&quot;</span><span class="lz-d"><strong>Tầng 2.</strong> Đó là <code>pingInterval</code> + <code>pingTimeout</code> — đo thật: <strong>45,0 s</strong> với mặc định (25 + 20), <strong>85,0 s</strong> với 25 + 60 của kho. Server chỉ biết client mất khi ping không trả lời. Suốt khoảng ấy, <code>io.sockets.adapter.rooms</code> vẫn tin client còn ở đó. Cắt ngắn bằng cách hạ <code>pingTimeout</code>, không phải bằng cách viết code thêm.</span></div>
<div class="lz-step"><span class="lz-k">c</span><span class="lz-t">&quot;broadcast không tới worker khác&quot;</span><span class="lz-d"><strong>Tầng 3 + Redis adapter.</strong> Cluster mode chạy 4 worker Node, và WebSocket connect vào MỘT worker cố định (sticky session ở nginx). <code>io.emit</code> mặc định chỉ đến worker đó. Redis adapter phát tin cross-worker qua pub/sub. Chương 5.</span></div>
<div class="lz-step"><span class="lz-k">d</span><span class="lz-t">&quot;client dùng 2 sid khác nhau&quot;</span><span class="lz-d"><strong>Tầng 2 và 3.</strong> Engine.io sid ≠ socket.io sid — engine.io connection có thể nuôi nhiều namespace, mỗi namespace phát sid riêng. Bài 0.3 đo chuyện này bằng cách kết nối WebSocket thô.</span></div>
</div>

<div class="callout warn">
<p><strong>Câu này quan trọng — mỗi thứ gây khó chịu là ở TẦNG khác.</strong> Bạn không &quot;debug Socket.IO&quot; như một khối duy nhất. Bạn debug tầng 4 (business logic) khi <code>emit</code> đi mà không đến; tầng 3 khi room/namespace sai; tầng 2 khi ping timeout; tầng 1 khi proxy chặn WebSocket. Bốn công cụ khác nhau cho bốn tầng.</p>
</div>

<h3>Cái Socket.IO KHÔNG phải</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">KHÔNG phải <code>WebSocket</code> API của trình duyệt</span><span class="lz-lnote">Trình duyệt có <code>new WebSocket(url)</code> — 200 dòng W3C spec. Socket.IO ngồi TRÊN nó, thêm reconnect + room + ack + fallback. Bạn KHÔNG gọi <code>new WebSocket</code> khi dùng socket.io</span></div>
<div class="lz-layer"><span class="lz-lname">KHÔNG phải MQTT / STOMP</span><span class="lz-lnote">Các protocol pub/sub &quot;chuẩn&quot; đó có topic hierarchy phức tạp, mức QoS, retained message. Socket.io có event name (chuỗi phẳng) + room. Nhỏ hơn và dễ hơn, nhưng cũng ÍT tính năng hơn</span></div>
<div class="lz-layer"><span class="lz-lname">KHÔNG phải một &quot;server realtime&quot; đứng riêng</span><span class="lz-lnote">Không có process <code>socket.io</code> chạy riêng. Nó là library ngồi trong tiến trình Express của bạn — chia sẻ cùng HTTP server, cùng port, cùng memory. Đó là chỗ Chương 5 phải cẩn thận</span></div>
<div class="lz-layer"><span class="lz-lname">KHÔNG bảo đảm exactly-once delivery mặc định</span><span class="lz-lnote">Nếu client mất kết nối trong lúc emit đang bay, tin nhắn ĐÓ có thể mất. Chương 6 dạy cách dùng ack + retry để có &quot;at-least-once&quot;. Ai muốn exactly-once phải tự dựng dedupe layer</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — cài <code>ws</code> thay vì <code>socket.io</code> vì &quot;nhẹ hơn&quot;.</strong> Đo thật: ở trình duyệt WebSocket thô tốn 0 byte (có sẵn), client socket.io bản min là 46.822 B, gzip còn 14.722 B; ở server <code>ws</code> vốn đã nằm trong socket.io (qua engine.io). Rồi bạn tự viết reconnect (khó — bao lâu? backoff nào?), heartbeat (khó — server chết vs client chết khác nhau), room broadcast (dễ nhưng tốn thời gian), fallback cho proxy strip upgrade (rất khó). Sau ba tháng bạn có một socket.io tệ hơn và không có tài liệu. Kho này CÓ một chỗ dùng <code>ws</code> thuần — <code>device.gateway.ts</code> — và nó cần 1.113 dòng để làm việc; Chương 9 dạy khi nào cái đánh đổi ấy đáng.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Socket.IO là engine.io (một trình quản lý connection có ping và upgrade transport) được bọc bởi namespace và room (một layer routing per-event) — bốn tầng ứng với bốn lớp gỡ lỗi khác nhau, và mọi thứ gây bất ngờ trong khoá này đều truy được về đúng tầng nào chịu trách nhiệm.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Khởi động một server Socket.IO bất kỳ và mở trang client; trong DevTools → Network → WS xem các request đầu đi tới <code>/socket.io/?EIO=4&amp;transport=polling</code> trước khi có bất kỳ frame WebSocket nào (tầng 1-2).</li>
<li>Lấy ba hành vi gây khó chịu — &quot;disconnect mất 85 s&quot;, &quot;broadcast không tới worker khác&quot;, &quot;client có hai sid khác nhau&quot; — và gán mỗi cái với đúng một tầng chịu trách nhiệm (2, 3+Redis, 2-và-3).</li>
<li>Liệt kê các file dưới <code>src/socket/</code> và đánh dấu cái nào ngồi trên socket.io (tầng 3) và cái nào dùng WebSocket thô.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn gán được ít nhất ba hành vi bất ngờ vào đúng tầng sở hữu chúng, thay vì &quot;debug Socket.IO&quot; như một khối.</p></div>

<h3>🔬 Đo thật: bốn bất ngờ, trên socket.io 4.8.3</h3>
<p><strong>Hai sid trên một kết nối</strong> — hai namespace qua cùng một Manager:</p>
<div class="out">server /       socket.id=xrny6KHyzkE-3ZbfAAAA  conn.id=5_DeLghS1q2391KLAAAA  transport=polling  (+31 ms)
server /admin  socket.id=j3s5f38_vbS4mRTZAAAB  conn.id=5_DeLghS1q2391KLAAAA  transport=polling  (+37 ms)
server /       upgrade → websocket  (+39 ms)
server /admin  upgrade → websocket  (+39 ms)
client: hai socket dùng chung MỘT engine: true · engine.id=5_DeLghS1q2391KLAAAA</div>
<p>Cùng <code>conn.id</code> (tầng 2, cái kết nối), khác <code>socket.id</code> theo namespace (tầng 3).</p>
<p><strong>Server mất bao lâu mới biết client đã chết</strong> — client bị đông cứng bằng SIGSTOP ngay sau khi nối (không gửi FIN, như gập nắp laptop):</p>
<div class="out">kho này 25000/60000: client đã nối rồi bị đông cứng (SIGSTOP)
mặc định 25000/20000: client đã nối rồi bị đông cứng (SIGSTOP)
mặc định 25000/20000: server thấy disconnect "ping timeout" sau 45.0 s
kho này 25000/60000: server thấy disconnect "ping timeout" sau 85.0 s</div>
<p>Trường hợp tệ nhất ≈ <code>pingInterval</code> + <code>pingTimeout</code>. Suốt khoảng đó socket vẫn nằm trong các room và presence vẫn báo online.</p>
<p><strong>Reconnect giãn cách</strong> — server chết 14 giây:</p>
<div class="out">  0.63 s connect
  1.61 s ── server chết
  1.61 s disconnect: transport close
  3.01 s reconnect_attempt #1  (cách lần trước 1395 ms)
  5.99 s reconnect_attempt #2  (cách lần trước 2977 ms)
 10.29 s reconnect_attempt #3  (cách lần trước 4308 ms)
 15.30 s reconnect_attempt #4  (cách lần trước 5007 ms)
 15.61 s ── server sống lại
 20.31 s reconnect_attempt #5  (cách lần trước 5009 ms)
 20.33 s connect
 21.61 s disconnect: io client disconnect</div>
<p><strong>Broadcast dừng ở worker</strong> — hai tiến trình server, không có adapter:</p>
<div class="out">worker A gọi io.emit("tin") …
client nối worker A nhận: từ worker 19412
… client của worker B: KHÔNG nhận gì (không có Redis adapter)</div>
<p><strong>Số đo cho câu "ws nhẹ hơn":</strong></p>
<div class="out">$ for p in ws@8.21.2 socket.io@4.8.3 engine.io@6.6.11 socket.io-client@4.8.3; do printf '%-24s %8s byte (unpacked)\\n' $p "$(npm view $p dist.unpackedSize)"; done
ws@8.21.2                  150792 byte (unpacked)
socket.io@4.8.3           1416999 byte (unpacked)
engine.io@6.6.11           162973 byte (unpacked)
socket.io-client@4.8.3    1417815 byte (unpacked)
$ wc -c node_modules/socket.io-client/dist/socket.io.min.js node_modules/socket.io-client/dist/socket.io.js | head -2
   46822 node_modules/socket.io-client/dist/socket.io.min.js
  155836 node_modules/socket.io-client/dist/socket.io.js
$ gzip -c node_modules/socket.io-client/dist/socket.io.min.js | wc -c
   14722</div>
<h3>🔁 Tự chạy lại</h3>
<p>Probe hai sid (cần <code>npm i socket.io@4.8.3 socket.io-client@4.8.3</code> và <code>"type": "module"</code>):</p>
<pre><code class="language-javascript"><span class="tok-comment">// MỘT connection engine.io, HAI namespace ⇒ một conn.id (tầng 2), hai socket.id (tầng 3)</span>
import { Server } from 'socket.io';
import { io as ketNoi, Manager } from 'socket.io-client';
const io = new Server(19410);
const t0 = Date.now();
for (const ns of ['/', '/admin']) io.of(ns).on('connection', (s) =&gt; {
  console.log(&#96;server \${ns.padEnd(7)} socket.id=\${s.id}  conn.id=\${s.conn.id}  transport=\${s.conn.transport.name}  (+\${Date.now() - t0} ms)&#96;);
  s.conn.once('upgrade', (t) =&gt; console.log(&#96;server \${ns.padEnd(7)} upgrade → \${t.name}  (+\${Date.now() - t0} ms)&#96;));
});
const m = new Manager('http://localhost:19410');
const a = m.socket('/'), b = m.socket('/admin');
await new Promise((r) =&gt; setTimeout(r, 1200));
console.log(&#96;client: hai socket dùng chung MỘT engine: \${a.io.engine === b.io.engine} · engine.id=\${m.engine.id}&#96;);
a.disconnect(); b.disconnect(); io.close(); process.exit(0);</code></pre>
<p>Muốn tự thấy khoảng chờ ngắt kết nối: chạy client trong một tiến trình riêng, rồi <code>kill -STOP &lt;pid&gt;</code> và bấm giờ sự kiện <code>disconnect</code> ở server. Hạ <code>pingInterval</code>/<code>pingTimeout</code> (vd 2000/2000) để chờ vài giây thay vì cả phút.</p>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-4-scale-adapter-backpressure" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 11.4 — Nhiều hơn một tiến trình: adapter, sticky session, áp lực ngược</span><span class="lc-sub">Câu chuyện cụm của bất ngờ (c), đo từ phía Node</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-8-1-pubsub" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 8.1 — Pub/Sub: bắn rồi quên, và cái giá của nó</span><span class="lc-sub">Cơ chế mà Redis adapter dựng lên trên</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">engine.io</span><span class="v">Tầng 2 — trình quản lý connection: heartbeat, upgrade transport, sid riêng.</span></div>
  <div class="kv"><span class="k">socket.io</span><span class="v">Tầng 3 — thêm namespace, room, ack, binary và một sid trên mỗi connection.</span></div>
  <div class="kv"><span class="k">Namespace</span><span class="v">Một kênh logic trên một connection; mỗi cái phát sid riêng.</span></div>
  <div class="kv"><span class="k">Room</span><span class="v">Một nhóm ở tầng 3 mà socket join vào; <code>io.to(room).emit()</code> chỉ tới thành viên của nó.</span></div>
  <div class="kv"><span class="k">Transport</span><span class="v">Cái dây tầng 1 (HTTP long-poll hoặc WebSocket) mà engine.io chọn và upgrade.</span></div>
  <div class="kv"><span class="k">Redis adapter</span><span class="v">Chở một broadcast qua các worker trong cụm bằng pub/sub (Chương 5).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Socket.IO là hai thư viện trên hai transport: engine.io (tầng 2) được bọc bởi socket.io (tầng 3).</li><li>Tầng 1 là dây (poll hoặc WS); tầng 4 là mã sự kiện có tên của bạn trong <code>src/socket/*.ts</code>.</li><li>Mọi bất ngờ ứng với một tầng: ping timeout = tầng 2, sai room = tầng 3, upgrade bị chặn = tầng 1.</li><li>Room và namespace là abstraction tầng 3; chúng không tồn tại ở tầng 2.</li><li>Một broadcast tới worker khác trong cụm chỉ qua Redis adapter.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — How it works</span><span class="lc-sub">socket.io/docs/v4/how-it-works — tài liệu chính thức mô tả bốn tầng, ngắn hơn bài này nhưng dùng làm nguồn thứ hai.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Engine.IO protocol</span><span class="lc-sub">github.com/socketio/engine.io-protocol — đặc tả wire packet của tầng 2, đọc xong hiểu bài 0.3 nói gì.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — WebSocket API</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/API/WebSockets_API — tầng 1, thứ mà socket.io ngồi lên trên. Nhỏ nhưng đủ để hiểu &quot;WebSocket&quot; thật ra là gì.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Track Socket.IO trên Code Lab</span><span class="lc-sub">/code-lab/tracks/socket-io${REF} — mười thử thách thực hành song song mỗi chương của khoá.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 0.2 ─────────────────────────── */
    {
      title: '0.2 — Why long-polling is still not dead in 2026|||0.2 — Vì sao long-polling KHÔNG chết trong năm 2026',
      slug: 'io-0-2-long-poll',
      type: 'VIDEO',
      description: 'Kho này cấu hình `transports: [&quot;websocket&quot;, &quot;polling&quot;]` cố ý. Bài này chỉ ra ai vẫn đang lọt qua long-polling và tại sao tắt polling là một dòng cấu hình có thể chặn 3-5% users.',
      content: `
${G00_2}
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Why long-polling is still not dead in 2026</h2>
<p class="lead">Every modern browser supports WebSocket. Every modern OS supports WebSocket. So why does <code>src/socket/messaging.socket.ts</code> keep <code>transports: [&#39;websocket&#39;, &#39;polling&#39;]</code> in 2026? The comment right above it says &quot;WebSocket-only would break users behind corporate proxies that strip the upgrade header&quot;. This lesson measures who those users are and what &quot;break&quot; means.</p>

<h3>The real config in this repo</h3>
<pre><code class="language-ts">// src/socket/messaging.socket.ts:286-299 (đo 13/11/2026)
io = new IOServer(httpServer, {
  cors: { origin: true, credentials: true },
  // Long-poll fallback is enabled by default; WebSocket-only would
  // break users behind corporate proxies that strip the upgrade header.
  transports: ['websocket', 'polling'],
  pingInterval: 25000,
  pingTimeout: 60000,
});
</code></pre>

<div class="callout warn">
<p><strong>The order in <code>transports: [...]</code> is NOT the order things are tried.</strong> Newcomers read <code>[&#39;websocket&#39;, &#39;polling&#39;]</code> and think &quot;try WebSocket first, fall back to polling&quot;. Wrong. By default the client <em>always</em> starts with polling (safe through every proxy) and then upgrades to WebSocket. That list only declares which transports are ALLOWED, not their order.</p>
</div>

<h3>Who still needs polling — four groups</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">office staff behind a proxy</span><span class="lz-nsub">2-4% audience</span></span>
<span class="lz-nbody">Corporations deploy filtering HTTP proxies (Zscaler, Palo Alto, Symantec) whose default configuration STRIPS the <code>Upgrade: websocket</code> header. The client attempts the upgrade → the server never sees the header → it stays on polling. Without polling the socket is simply dead.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">mobile 3G/4G in weak-coverage areas</span><span class="lz-nsub">1-2% audience</span></span>
<span class="lz-nbody">Some carrier-grade NATs (especially on &quot;budget&quot; plans) do not carry WebSocket reliably. The connection flickers, pings time out, reconnects loop. Polling over plain HTTP always gets through.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">a misconfigured nginx</span><span class="lz-nsub">100% of yours if you forget</span></span>
<span class="lz-nbody">Nginx does NOT proxy the upgrade header by default. It needs <code>proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection &quot;upgrade&quot;;</code>. Forget it and WebSocket returns 400. With polling on, the client falls back AUTOMATICALLY — your users never learn you broke it.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">bots / scrapers</span><span class="lz-nsub">depends on the product</span></span>
<span class="lz-nbody">Many bots speak only HTTP. With polling on they can still connect if you want them to (analytics, monitoring). With polling off they die — which may be good or bad depending on the situation.</span>
</div>
</div>

<h3>Đo cost — long-polling nặng hơn WebSocket bao nhiêu?</h3>
<pre><code class="language-python"># mo phong: 100 tin nhan nho, mot huong, 5 phut
# polling  : moi tin phai keo mot HTTP request + response header (~800 byte overhead)
# websocket: moi tin la 2-14 byte frame overhead

polling_overhead   = 800 * 100         # 80.000 byte cho overhead
websocket_overhead =   6 * 100         # 600 byte cho overhead

ratio = 80_000 / 600                    # 133x
</code></pre>

<div class="out">100 tin, mot huong, 5 phut:
  polling   overhead: 80.000 byte
  websocket overhead: 600 byte
  polling nang gap: 133 lan

Do la MOT huong. Voi chat song phuong thi tang gap doi cho client.
</div>

<div class="callout warn">
<p><strong>But whoever is on polling has NO choice about it.</strong> 133× overhead is an alarming number for a backend taking millions of messages an hour, but the users stuck on polling are ~5% of the audience and they will send VERY FEW messages per hour (their network is slow). In practice, 5% × few-messages = &lt; 1% of total bytes. Measure it yourself before switching it off.</p>
</div>

<h3>When you can turn polling off</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">your internal app</span><span class="lz-d">If every user sits inside the company and you CONTROL the proxy, you can turn it off. It saves 5% of egress bandwidth and removes a whole class of bug.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">native mobile app</span><span class="lz-d">iOS/Android apps use WebSocket through the native stack (which usually does not traverse an office proxy). You can turn polling off on a mobile-only endpoint.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">you have ALREADY measured and know 0% of traffic is on polling</span><span class="lz-d">Log <code>socket.conn.transport.name</code> after the upgrade completes. If after 30 days no total exceeds 0.1%, you can switch it off.</span></div>
</div>

<div class="callout ok">
<p><strong>This repo keeps polling ON — the right call for a public web app in Vietnam.</strong> Users are on company laptops, coffee-shop wifi, mobile 3G — all of it. The CuongThai logs will show 3-5% of traffic on polling; turning polling off means 3-5% of users reporting &quot;chat doesn't work&quot;.</p>
</div>

<h3>Watching the transport upgrade with your own eyes</h3>
<pre><code class="language-bash">$ node probe.js          # probe 15 dòng của bài Bắt đầu tại đây (2/2), chạy thật
SERVER connection · transport = polling
CLIENT connect    · transport = polling
SERVER upgrade   · transport = websocket
SERVER nhận chao: { tu: 'client', luc: 'sau 300 ms' }
$ node thu-tu.mjs
client mặc định: server thấy transport ĐẦU TIÊN = polling
client mặc định: upgrade → websocket sau 6 ms
client transports:['websocket','polling']: server thấy transport ĐẦU TIÊN = websocket
</code></pre>

<p>One &quot;connection&quot; as far as the client is concerned, two different layer-1 transports. The server reads <code>socket.conn.transport.name</code> to know who is where.</p>

<h3>Signs a client is stuck on polling</h3>
<pre><code class="language-ts">// server code
io.on('connection', socket => {
  logger.info('client connected', {
    transport: socket.conn.transport.name,   // "polling" hoac "websocket"
    ip: socket.handshake.address,
  });
  socket.conn.on('upgrade', t => {
    logger.info('upgraded transport', { transport: t.name });
  });
});
</code></pre>

<div class="out">Sau 24h thu thap tren production (mo phong):
  99.2% cac connection upgrade len websocket trong 500ms
   0.6% ngoi polling suot doi (proxy strip)
   0.2% khong bao gio ket noi duoc (upgrade timeout)
</div>

<div class="pitfall">
<p><strong>Trap — setting <code>transports: [&#39;websocket&#39;]</code> because a StackOverflow answer said it was &quot;faster&quot;.</strong> You cut polling → 3-5% of users report &quot;I'm not getting new messages&quot;. You cannot see why, because on your dev machine (good corporate network, no proxy) it works perfectly. This is the class of bug that does NOT reproduce in dev, and the log line &quot;client disconnect after ping timeout&quot; reads like a backend bug. The only way back is a rollback.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> <code>transports: [&#39;websocket&#39;, &#39;polling&#39;]</code> is the right default for a public web app — the client always starts on polling and upgrades to WebSocket one round-trip later if it gets through the proxy (6 ms on the course machine), while the 3-5% of the audience sitting behind an upgrade-stripping proxy stay on polling (133× the overhead, but still working) — and turning polling off is a decision you measure, not one you take on StackOverflow's advice.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Start a server with <code>transports: ['websocket', 'polling']</code> and, in the connection handler, log <code>socket.conn.transport.name</code> plus a <code>socket.conn.on('upgrade', ...)</code> listener.</li>
<li>Connect a client and watch the connection begin on <code>polling</code> and switch to <code>websocket</code> one round-trip later (6 ms on one machine) — the upgrade you just logged.</li>
<li>Now set <code>transports: ['websocket']</code> and connect through something that blocks the upgrade (or simply block it). See the socket fail where polling would have carried it.</li>
</ol>
<p><strong>Done when:</strong> you have logged one real transport upgrade and can name who the 3-5% stuck on polling are.</p></div>

<h3>🔬 Measured: order, cost, and a proxy that strips Upgrade</h3>
<p><strong>What the client starts on</strong> (server with the repo's <code>['websocket', 'polling']</code>):</p>
<div class="out">$ node thu-tu.mjs
client mặc định: server thấy transport ĐẦU TIÊN = polling
client mặc định: upgrade → websocket sau 6 ms
client transports:['websocket','polling']: server thấy transport ĐẦU TIÊN = websocket</div>
<p>A default client starts on polling no matter what the server lists; only a client that sets <code>transports</code> itself starts on websocket.</p>
<p><strong>Bytes per message</strong> — a TCP proxy counting every byte, 100 small messages server → client, one transport at a time:</p>
<div class="out">$ node dem-byte.mjs
polling  : 100 tin ⇒ client→server  17600 B · server→client  19592 B · tổng  37192 B · 371.9 B/tin
websocket: 100 tin ⇒ client→server      0 B · server→client   3692 B · tổng   3692 B · 36.9 B/tin
phần CHỮ của 100 tin (42["tin",{"i":N,"chu":"xin chao"}]): 3492 B ⇒ phần còn lại là overhead</div>
<p>So polling spends ~337 B of overhead around a 35 B message, websocket 2 B — about 10× the total bytes. The hand estimate above (800 vs 6 B, "133×") has the right shape; this is the measured version, with a Node client (a browser adds cookies and a User-Agent, so real polling is heavier).</p>
<p><strong>A proxy that removes <code>Upgrade</code> and <code>Connection</code></strong>, then two clients:</p>
<div class="out">$ node proxy-chan.mjs
  proxy: chặn upgrade ⇒ server trả 400 {"code":3,"message":"Bad request"}
mac-dinh: NHẬN "chào mac-dinh" qua transport polling
mac-dinh: sau 4 s — connected=true · transport=polling · connect_error 0 lần
  proxy: chặn upgrade ⇒ server trả 400 {"code":3,"message":"Bad request"}
  proxy: chặn upgrade ⇒ server trả 400 {"code":3,"message":"Bad request"}
  proxy: chặn upgrade ⇒ server trả 400 {"code":3,"message":"Bad request"}
chi-websocket: sau 4 s — connected=false · transport=websocket · connect_error 3 lần</div>
<p>The default client stays on polling and still gets its message; the websocket-only client never connects. That is what "WebSocket-only would break users behind corporate proxies" means.</p>
<p><em>Note:</em> the audience percentages earlier in this lesson are illustrative estimates, not measurements — there is no trustworthy public number. Measure your own with <code>socket.conn.transport.name</code>.</p>
<h3>🔁 Run it yourself</h3>
<p>The header-stripping proxy (save as <code>proxy-chan.mjs</code> next to <code>npm i socket.io@4.8.3 socket.io-client@4.8.3</code>, <code>"type": "module"</code>):</p>
<pre><code class="language-javascript"><span class="tok-comment">// Proxy "văn phòng" XOÁ header Upgrade (chuyển tiếp như GET thường). Hai client: mặc định vs transports:['websocket'].</span>
import http from 'node:http';
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const io = new Server(19423);
io.on('connection', (s) =&gt; setTimeout(() =&gt; s.emit('tin', 'chào ' + s.handshake.query.ten), 1500));
const proxy = http.createServer((req, res) =&gt; {
  const u = http.request({ port: 19423, path: req.url, method: req.method, headers: req.headers }, (r) =&gt; { res.writeHead(r.statusCode, r.headers); r.pipe(res); });
  req.pipe(u);
});
proxy.on('upgrade', (req, sock) =&gt; {                     <span class="tok-comment">  // xoá Upgrade + Connection, gửi như GET thường</span>
  const { upgrade, connection, ...h } = req.headers;
  http.get({ port: 19423, path: req.url, headers: h }, (r) =&gt; {
    let b = ''; r.on('data', (d) =&gt; (b += d)); r.on('end', () =&gt; { sock.end(&#96;HTTP/1.1 \${r.statusCode} \${r.statusMessage}\\r\\nContent-Length: \${Buffer.byteLength(b)}\\r\\n\\r\\n\${b}&#96;); console.log(&#96;  proxy: chặn upgrade ⇒ server trả \${r.statusCode} \${b}&#96;); });
  });
});
proxy.listen(19424);
for (const [ten, opt] of [['mac-dinh', {}], ['chi-websocket', { transports: ['websocket'] }]]) {
  const c = ketNoi('http://localhost:19424', { query: { ten }, ...opt });
  let loi = 0;
  c.on('connect_error', () =&gt; loi++);
  c.on('tin', (x) =&gt; console.log(&#96;\${ten}: NHẬN "\${x}" qua transport \${c.io.engine.transport.name}&#96;));
  await new Promise((r) =&gt; setTimeout(r, 4000));
  console.log(&#96;\${ten}: sau 4 s — connected=\${c.connected} · transport=\${c.io.engine?.transport?.name ?? '—'} · connect_error \${loi} lần&#96;);
  c.close();
}
process.exit(0);</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nginx/learn?lessonSlug=nginx-3-5-websocket" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Nginx · 3.5 — WebSocket: the upgrade Nginx deliberately strips</span><span class="lc-sub">The two Upgrade lines, measured with and without</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/api-design/learn?lessonSlug=api-10-3-realtime" target="_blank" rel="noopener"><span class="lc-ico">🧩</span><span class="lc-body"><span class="lc-title">API Design · 10.4 — Realtime APIs: polling, SSE or WebSocket</span><span class="lc-sub">Latency and request counts for each contract</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Long-polling</span><span class="v">The HTTP fallback transport — repeated request/response that passes through any proxy.</span></div>
  <div class="kv"><span class="k">Transport upgrade</span><span class="v">Switching an already-open connection from polling to WebSocket.</span></div>
  <div class="kv"><span class="k"><code>transports</code> array</span><span class="v">Which transports are PERMITTED — not the order they are tried.</span></div>
  <div class="kv"><span class="k"><code>Upgrade: websocket</code></span><span class="v">The handshake header a corporate proxy may strip.</span></div>
  <div class="kv"><span class="k">Overhead</span><span class="v">Per-message bytes: ~800 (polling) vs ~6 (WebSocket) — about 133×.</span></div>
  <div class="kv"><span class="k"><code>conn.transport.name</code></span><span class="v">Server-side read of the transport a given socket is on right now.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>The client ALWAYS starts on polling and upgrades to WebSocket; the array only lists allowed transports, not an order.</li><li>About 3-5% of real users stay on polling — proxies that strip the upgrade, or weak mobile NAT.</li><li>Polling costs ~133× the per-message overhead but keeps those users connected at all.</li><li>A misconfigured nginx silently keeps everyone on polling — the two <code>proxy_set_header</code> upgrade lines are mandatory.</li><li>Turn polling off only after measuring <code>transport.name</code> over time, never on advice alone.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Transports</span><span class="lc-sub">socket.io/docs/v4/how-it-works/#transports — hai transport được hỗ trợ, các chỉnh option client-side.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — WebSocket handshake</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/HTTP/Protocol_upgrade_mechanism — chi tiết cái <code>Upgrade: websocket</code> header mà proxy có thể strip.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Nginx WebSocket proxying</span><span class="lc-sub">nginx.org/en/docs/http/websocket.html — hai dòng <code>proxy_set_header Upgrade</code> bắt buộc, kèm ví dụ và giải thích.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 3 — nginx as the proxy</span><span class="lc-sub">/courses/nginx/learn${REF} — nếu bạn quên hai dòng ở link trên, mọi upgrade sẽ 400 và bài này là bằng chứng vì sao có polling thì bạn không thấy hỏng.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Vì sao long-polling KHÔNG chết trong năm 2026</h2>
<p class="lead">Mọi trình duyệt hiện đại hỗ trợ WebSocket. Mọi OS hiện đại hỗ trợ WebSocket. Vậy tại sao <code>src/socket/messaging.socket.ts</code> vẫn giữ <code>transports: [&#39;websocket&#39;, &#39;polling&#39;]</code> trong năm 2026? Comment ngay trên nó nói &quot;WebSocket-only would break users behind corporate proxies that strip the upgrade header&quot;. Bài này đo xem những người đó là ai và &quot;break&quot; nghĩa là gì.</p>

<h3>Config thật trong kho này</h3>
<pre><code class="language-ts">// src/socket/messaging.socket.ts:286-299 (đo 13/11/2026)
io = new IOServer(httpServer, {
  cors: { origin: true, credentials: true },
  // Long-poll fallback is enabled by default; WebSocket-only would
  // break users behind corporate proxies that strip the upgrade header.
  transports: ['websocket', 'polling'],
  pingInterval: 25000,
  pingTimeout: 60000,
});
</code></pre>

<div class="callout warn">
<p><strong>Thứ tự trong <code>transports: [...]</code> KHÔNG phải thứ tự thử.</strong> Người mới đọc đọc <code>[&#39;websocket&#39;, &#39;polling&#39;]</code> nghĩ &quot;thử WebSocket trước, polling nếu thất bại&quot;. Sai. Client mặc định <em>luôn</em> bắt đầu bằng polling (an toàn qua mọi proxy) rồi upgrade lên WebSocket. Cái list ấy chỉ khai báo transport nào được PHÉP dùng, không thứ tự.</p>
</div>

<h3>Ai vẫn cần polling — bốn nhóm</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">nhân viên VP có proxy</span><span class="lz-nsub">2-4% audience</span></span>
<span class="lz-nbody">Các tập đoàn triển khai proxy HTTP filter (Zscaler, Palo Alto, Symantec) mà cấu hình mặc định STRIP <code>Upgrade: websocket</code> header. Client thử upgrade → server không nhận header → giữ nguyên polling. Không có polling thì socket dead.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">di động 3G/4G ở khu vực yếu</span><span class="lz-nsub">1-2% audience</span></span>
<span class="lz-nbody">Một số carrier NAT của viễn thông (đặc biệt các gói &quot;giá rẻ&quot;) không hỗ trợ WebSocket ổn định. Kết nối chập chờn, ping timeout, reconnect vòng. Polling qua HTTP thì luôn qua được.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">nginx cấu hình sai</span><span class="lz-nsub">100% của bạn nếu quên</span></span>
<span class="lz-nbody">Nginx mặc định KHÔNG proxy upgrade header. Cần <code>proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection &quot;upgrade&quot;;</code>. Quên = WebSocket 400. Có polling thì client TỰ ĐỘNG rơi về polling — người dùng không biết bạn đã hỏng.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">bot / cào trang</span><span class="lz-nsub">tuỳ product</span></span>
<span class="lz-nbody">Nhiều bot chỉ nói HTTP. Có polling thì bot vẫn kết nối được nếu bạn muốn (analytics, monitoring). Tắt polling thì bot chết — có thể tốt hoặc xấu tuỳ tình huống.</span>
</div>
</div>

<h3>Đo cost — long-polling nặng hơn WebSocket bao nhiêu?</h3>
<pre><code class="language-python"># mo phong: 100 tin nhan nho, mot huong, 5 phut
# polling  : moi tin phai keo mot HTTP request + response header (~800 byte overhead)
# websocket: moi tin la 2-14 byte frame overhead

polling_overhead   = 800 * 100         # 80.000 byte cho overhead
websocket_overhead =   6 * 100         # 600 byte cho overhead

ratio = 80_000 / 600                    # 133x
</code></pre>

<div class="out">100 tin, mot huong, 5 phut:
  polling   overhead: 80.000 byte
  websocket overhead: 600 byte
  polling nang gap: 133 lan

Do la MOT huong. Voi chat song phuong thi tang gap doi cho client.
</div>

<div class="callout warn">
<p><strong>Nhưng ai đang trên polling KHÔNG có lựa chọn.</strong> 133× overhead là con số đáng lo cho một backend nhận triệu tin nhắn/giờ, nhưng người dùng ngồi trên polling là ~5% audience và họ sẽ dùng RẤT ÍT tin nhắn/giờ (vì mạng chậm). Trong thực tế, 5% × ít-tin-nhắn = &lt; 1% tổng bytes. Tự đo trước khi tắt.</p>
</div>

<h3>Khi nào bạn có thể tắt polling</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">app internal của bạn</span><span class="lz-d">Nếu người dùng đều ngồi trong công ty và bạn KIỂM SOÁT proxy, có thể tắt. Tiết kiệm 5% băng thông đầu ra và loại một class bug.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">native mobile app</span><span class="lz-d">Ứng dụng iOS/Android tự dùng WebSocket qua stack native (thường không đi qua proxy văn phòng). Có thể tắt polling ở endpoint dành riêng cho mobile.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">bạn ĐÃ đo và biết 0% traffic đang là polling</span><span class="lz-d">Log <code>socket.conn.transport.name</code> sau khi upgrade xong. Nếu sau 30 ngày không có tổng nào &gt; 0.1%, tắt được.</span></div>
</div>

<div class="callout ok">
<p><strong>Kho này giữ polling ON — quyết định đúng cho public web app tại Việt Nam.</strong> Người dùng có laptop công ty, wifi cafe, 3G di động, có tất cả. Log CuongThai sẽ có 3-5% traffic là polling; tắt polling = 3-5% users báo &quot;chat không chạy&quot;.</p>
</div>

<h3>Nhìn transport upgrade bằng mắt</h3>
<pre><code class="language-bash">$ node probe.js          # probe 15 dòng của bài Bắt đầu tại đây (2/2), chạy thật
SERVER connection · transport = polling
CLIENT connect    · transport = polling
SERVER upgrade   · transport = websocket
SERVER nhận chao: { tu: 'client', luc: 'sau 300 ms' }
$ node thu-tu.mjs
client mặc định: server thấy transport ĐẦU TIÊN = polling
client mặc định: upgrade → websocket sau 6 ms
client transports:['websocket','polling']: server thấy transport ĐẦU TIÊN = websocket
</code></pre>

<p>Cùng một &quot;connection&quot; theo góc nhìn client, hai transport khác nhau ở tầng 1. Server nhìn <code>socket.conn.transport.name</code> để biết ai đang ở đâu.</p>

<h3>Dấu hiệu client kẹt ở polling</h3>
<pre><code class="language-ts">// server code
io.on('connection', socket => {
  logger.info('client connected', {
    transport: socket.conn.transport.name,   // "polling" hoac "websocket"
    ip: socket.handshake.address,
  });
  socket.conn.on('upgrade', t => {
    logger.info('upgraded transport', { transport: t.name });
  });
});
</code></pre>

<div class="out">Sau 24h thu thap tren production (mo phong):
  99.2% cac connection upgrade len websocket trong 500ms
   0.6% ngoi polling suot doi (proxy strip)
   0.2% khong bao gio ket noi duoc (upgrade timeout)
</div>

<div class="pitfall">
<p><strong>Bẫy — bật <code>transports: [&#39;websocket&#39;]</code> vì đọc trên StackOverflow bảo &quot;faster&quot;.</strong> Bạn cắt polling → 3-5% users báo &quot;không nhận được tin nhắn mới&quot;. Bạn không hiểu vì sao vì trên máy dev bạn (mạng công ty tốt, không proxy) chạy hoàn hảo. Đây là kiểu bug KHÔNG tái hiện được ở dev, và log nói &quot;client disconnect after ping timeout&quot; nghe như bug backend. Đường về phải qua rollback.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> <code>transports: [&#39;websocket&#39;, &#39;polling&#39;]</code> là mặc định đúng cho public web app — client luôn bắt đầu bằng polling và upgrade lên WebSocket sau một vòng đi-về nếu qua được proxy (6 ms trên máy của khoá), còn 3-5% audience ngồi sau proxy strip upgrade thì tiếp tục polling (đắt 133× overhead nhưng vẫn chạy) — và tắt polling là quyết định phải đo, không phải quyết định theo hướng dẫn của StackOverflow.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Khởi động một server với <code>transports: ['websocket', 'polling']</code> và, trong handler connection, log <code>socket.conn.transport.name</code> cùng một listener <code>socket.conn.on('upgrade', ...)</code>.</li>
<li>Kết nối một client và xem connection bắt đầu bằng <code>polling</code> rồi chuyển sang <code>websocket</code> sau một vòng đi-về (6 ms trên một máy) — đúng cái upgrade bạn vừa log.</li>
<li>Giờ đặt <code>transports: ['websocket']</code> và kết nối qua một thứ chặn upgrade (hoặc tự chặn). Thấy socket hỏng ở chỗ mà polling lẽ ra đã chở qua.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đã log được một transport upgrade thật và gọi tên được ai là 3-5% kẹt lại trên polling.</p></div>

<h3>🔬 Đo thật: thứ tự, chi phí, và proxy xoá Upgrade</h3>
<p><strong>Client bắt đầu bằng gì</strong> (server khai <code>['websocket', 'polling']</code> như kho):</p>
<div class="out">$ node thu-tu.mjs
client mặc định: server thấy transport ĐẦU TIÊN = polling
client mặc định: upgrade → websocket sau 6 ms
client transports:['websocket','polling']: server thấy transport ĐẦU TIÊN = websocket</div>
<p>Client mặc định bắt đầu bằng polling bất kể server khai gì; chỉ client tự đặt <code>transports</code> mới bắt đầu bằng websocket.</p>
<p><strong>Byte mỗi tin</strong> — proxy TCP đếm từng byte, 100 tin nhỏ server → client, mỗi lần một transport:</p>
<div class="out">$ node dem-byte.mjs
polling  : 100 tin ⇒ client→server  17600 B · server→client  19592 B · tổng  37192 B · 371.9 B/tin
websocket: 100 tin ⇒ client→server      0 B · server→client   3692 B · tổng   3692 B · 36.9 B/tin
phần CHỮ của 100 tin (42["tin",{"i":N,"chu":"xin chao"}]): 3492 B ⇒ phần còn lại là overhead</div>
<p>Vậy polling tốn ~337 B vỏ bọc quanh một tin 35 B, websocket 2 B — tổng byte gấp khoảng 10 lần. Ước tính tay ở trên (800 vs 6 B, "133×") đúng hình dạng; đây là bản đo thật, với client Node (trình duyệt còn gửi cookie và User-Agent, nên polling thật nặng hơn).</p>
<p><strong>Một proxy xoá <code>Upgrade</code> và <code>Connection</code></strong>, rồi hai client:</p>
<div class="out">$ node proxy-chan.mjs
  proxy: chặn upgrade ⇒ server trả 400 {"code":3,"message":"Bad request"}
mac-dinh: NHẬN "chào mac-dinh" qua transport polling
mac-dinh: sau 4 s — connected=true · transport=polling · connect_error 0 lần
  proxy: chặn upgrade ⇒ server trả 400 {"code":3,"message":"Bad request"}
  proxy: chặn upgrade ⇒ server trả 400 {"code":3,"message":"Bad request"}
  proxy: chặn upgrade ⇒ server trả 400 {"code":3,"message":"Bad request"}
chi-websocket: sau 4 s — connected=false · transport=websocket · connect_error 3 lần</div>
<p>Client mặc định ở lại polling và vẫn nhận tin; client chỉ-websocket không bao giờ nối được. Đó chính là nghĩa của câu "WebSocket-only would break users behind corporate proxies".</p>
<p><em>Lưu ý:</em> các tỉ lệ % nhóm người dùng ở trên là ước lượng minh hoạ, không phải số đo — không có con số công khai đáng tin. Tự đo bằng <code>socket.conn.transport.name</code>.</p>
<h3>🔁 Tự chạy lại</h3>
<p>Proxy xoá header (lưu thành <code>proxy-chan.mjs</code> cạnh <code>npm i socket.io@4.8.3 socket.io-client@4.8.3</code>, <code>"type": "module"</code>):</p>
<pre><code class="language-javascript"><span class="tok-comment">// Proxy "văn phòng" XOÁ header Upgrade (chuyển tiếp như GET thường). Hai client: mặc định vs transports:['websocket'].</span>
import http from 'node:http';
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const io = new Server(19423);
io.on('connection', (s) =&gt; setTimeout(() =&gt; s.emit('tin', 'chào ' + s.handshake.query.ten), 1500));
const proxy = http.createServer((req, res) =&gt; {
  const u = http.request({ port: 19423, path: req.url, method: req.method, headers: req.headers }, (r) =&gt; { res.writeHead(r.statusCode, r.headers); r.pipe(res); });
  req.pipe(u);
});
proxy.on('upgrade', (req, sock) =&gt; {                     <span class="tok-comment">  // xoá Upgrade + Connection, gửi như GET thường</span>
  const { upgrade, connection, ...h } = req.headers;
  http.get({ port: 19423, path: req.url, headers: h }, (r) =&gt; {
    let b = ''; r.on('data', (d) =&gt; (b += d)); r.on('end', () =&gt; { sock.end(&#96;HTTP/1.1 \${r.statusCode} \${r.statusMessage}\\r\\nContent-Length: \${Buffer.byteLength(b)}\\r\\n\\r\\n\${b}&#96;); console.log(&#96;  proxy: chặn upgrade ⇒ server trả \${r.statusCode} \${b}&#96;); });
  });
});
proxy.listen(19424);
for (const [ten, opt] of [['mac-dinh', {}], ['chi-websocket', { transports: ['websocket'] }]]) {
  const c = ketNoi('http://localhost:19424', { query: { ten }, ...opt });
  let loi = 0;
  c.on('connect_error', () =&gt; loi++);
  c.on('tin', (x) =&gt; console.log(&#96;\${ten}: NHẬN "\${x}" qua transport \${c.io.engine.transport.name}&#96;));
  await new Promise((r) =&gt; setTimeout(r, 4000));
  console.log(&#96;\${ten}: sau 4 s — connected=\${c.connected} · transport=\${c.io.engine?.transport?.name ?? '—'} · connect_error \${loi} lần&#96;);
  c.close();
}
process.exit(0);</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nginx/learn?lessonSlug=nginx-3-5-websocket" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Nginx · 3.5 — WebSocket: cú nâng cấp mà Nginx CỐ Ý gỡ đi</span><span class="lc-sub">Hai dòng Upgrade, đo khi có và khi thiếu</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/api-design/learn?lessonSlug=api-10-3-realtime" target="_blank" rel="noopener"><span class="lc-ico">🧩</span><span class="lc-body"><span class="lc-title">API Design · 10.4 — API thời gian thực: polling, SSE hay WebSocket</span><span class="lc-sub">Độ trễ và số request của từng hợp đồng</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Long-polling</span><span class="v">Transport fallback bằng HTTP — request/response lặp lại, qua được mọi proxy.</span></div>
  <div class="kv"><span class="k">Transport upgrade</span><span class="v">Chuyển một connection đang mở từ polling sang WebSocket.</span></div>
  <div class="kv"><span class="k">Mảng <code>transports</code></span><span class="v">Transport nào ĐƯỢC PHÉP — không phải thứ tự thử.</span></div>
  <div class="kv"><span class="k"><code>Upgrade: websocket</code></span><span class="v">Header bắt tay mà proxy văn phòng có thể strip.</span></div>
  <div class="kv"><span class="k">Overhead</span><span class="v">Byte mỗi tin: ~800 (polling) vs ~6 (WebSocket) — khoảng 133×.</span></div>
  <div class="kv"><span class="k"><code>conn.transport.name</code></span><span class="v">Đọc phía server xem một socket đang ở transport nào ngay lúc này.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Client LUÔN bắt đầu bằng polling rồi upgrade lên WebSocket; mảng chỉ liệt kê transport được phép, không phải thứ tự.</li><li>Khoảng 3-5% người dùng thật ở lại polling — proxy strip upgrade, hoặc NAT di động yếu.</li><li>Polling đắt ~133× overhead mỗi tin nhưng giữ cho những người đó còn kết nối được.</li><li>Nginx cấu hình sai âm thầm giữ mọi người trên polling — hai dòng <code>proxy_set_header</code> upgrade là bắt buộc.</li><li>Chỉ tắt polling sau khi đo <code>transport.name</code> theo thời gian, không bao giờ chỉ theo lời khuyên.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Transports</span><span class="lc-sub">socket.io/docs/v4/how-it-works/#transports — hai transport được hỗ trợ, các chỉnh option client-side.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — WebSocket handshake</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/HTTP/Protocol_upgrade_mechanism — chi tiết cái <code>Upgrade: websocket</code> header mà proxy có thể strip.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Nginx WebSocket proxying</span><span class="lc-sub">nginx.org/en/docs/http/websocket.html — hai dòng <code>proxy_set_header Upgrade</code> bắt buộc, kèm ví dụ và giải thích.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 3 — nginx làm proxy</span><span class="lc-sub">/courses/nginx/learn${REF} — nếu bạn quên hai dòng ở link trên, mọi upgrade sẽ 400 và bài này là bằng chứng vì sao có polling thì bạn không thấy hỏng.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 0.3 ─────────────────────────── */
    {
      title: '0.3 — What is on the wire: three real packets|||0.3 — Thứ trên dây: ba packet thật',
      slug: 'io-0-3-tren-day',
      type: 'VIDEO',
      description: 'Kết nối WebSocket thô bằng thư viện `ws`, không qua socket.io-client. Đọc ba frame đầu và biết mỗi ký tự nghĩa gì — từ đó DevTools tab WS đọc được như tiếng mẹ đẻ.',
      content: `
${G00_3}
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>What is on the wire: three real packets</h2>
<p class="lead">Every previous lesson used the socket.io client library. This one bypasses it and connects with raw <code>ws</code>, so we can read the actual bytes and match them against the engine.io protocol spec. After this lesson, DevTools&#39; Network → WS tab is not magic — it is a list of packets you can decode.</p>

<h3>The measurement</h3>
<pre><code class="language-js">import { Server } from 'socket.io';
import { WebSocket } from 'ws';
import http from 'http';

const srv = http.createServer();
const io = new Server(srv);
io.on('connection', s => s.emit('hello', { world: 42 }));
await new Promise(r => srv.listen(0, r));

const ws = new WebSocket(&#96;ws://localhost:\${srv.address().port}/socket.io/?EIO=4&transport=websocket&#96;);
ws.on('message', d =&gt; console.log('WIRE:', JSON.stringify(d.toString())));
await new Promise(r =&gt; ws.on('open', r));
ws.send('40');   // Manually send engine.io message + socket.io CONNECT
</code></pre>

<div class="out">$ node probe3.mjs
WIRE: "0{\\"sid\\":\\"sF7e3x9ZpVJa0IwhAAAA\\",\\"upgrades\\":[],\\"pingInterval\\":25000,\\"pingTimeout\\":20000,\\"maxPayload\\":1000000}"
WIRE: "40{\\"sid\\":\\"2f1OJR736nRPGKluAAAB\\"}"
WIRE: "42[\\"hello\\",{\\"world\\":42}]"
</div>

<p>Three frames. Each one starts with one or two digits — that is the engine.io/socket.io packet type. Let&#39;s decode them.</p>

<h3>Frame 1 — engine.io OPEN packet</h3>
<pre><code class="language-text">0{"sid":"sF7e3x9ZpVJa0IwhAAAA","upgrades":[],"pingInterval":25000,"pingTimeout":20000,"maxPayload":1000000}
│
└── engine.io packet type 0 = OPEN
</code></pre>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>sid</code></span><span class="lz-lnote">The engine.io session id. This is the LAYER 2 sid — it identifies the connection, not the socket. Polling needs it so two separate HTTP requests know they belong to the same session</span></div>
<div class="lz-layer"><span class="lz-lname"><code>upgrades: []</code></span><span class="lz-lnote">Empty because this client connected over WebSocket from the start. Had it connected by polling, this list would read <code>[&quot;websocket&quot;]</code> to say &quot;you may upgrade to WebSocket whenever you like&quot;</span></div>
<div class="lz-layer"><span class="lz-lname"><code>pingInterval: 25000</code></span><span class="lz-lnote">The server will send a ping every 25 seconds. This is the default; this repo sets the same 25000</span></div>
<div class="lz-layer"><span class="lz-lname"><code>pingTimeout: 20000</code></span><span class="lz-lnote">If the server gets no pong within 20 seconds, the client is considered gone. Default is 20s; this repo sets 60000 (60s, higher to absorb mobile-network jitter)</span></div>
<div class="lz-layer"><span class="lz-lname"><code>maxPayload: 1000000</code></span><span class="lz-lnote">Maximum size of a single message: 1 MB. Anything larger closes the WHOLE connection at layer 2 (measured below: server "transport error", client "transport close")</span></div>
</div>

<h3>Frame 2 — socket.io CONNECT packet</h3>
<pre><code class="language-text">40{"sid":"2f1OJR736nRPGKluAAAB"}
│└─ socket.io packet type 0 = CONNECT
└── engine.io packet type 4 = MESSAGE
</code></pre>

<div class="callout warn">
<p><strong>This is where there are TWO sids.</strong> The engine.io sid in frame 1 (<code>sF7e3x9ZpVJa0IwhAAAA</code>) is different from the socket.io sid in frame 2 (<code>2f1OJR736nRPGKluAAAB</code>). One engine.io connection can carry several namespaces, and each namespace issues its OWN sid. In the debugger you will see <code>socket.id</code> và <code>socket.conn.id</code> — the first is the layer-3 sid, the second the layer-2 one. It is baffling the first time you meet it.</p>
</div>

<h3>Frame 3 — socket.io EVENT packet</h3>
<pre><code class="language-text">42["hello",{"world":42}]
│└─ socket.io packet type 2 = EVENT
└── engine.io packet type 4 = MESSAGE
</code></pre>

<p>The payload is a JSON array: the first element is the event NAME, the rest are its arguments. This is where your layer-4 code lines up:</p>

<pre><code class="language-ts">socket.emit('hello', { world: 42 })
//     ↑         ↑          ↑
//   type=2    name       args[0]
</code></pre>

<h3>The packet-type table — for the whole course</h3>
<pre><code class="language-text">engine.io packet types (chu so DAU tien)
0 = OPEN         (server gui khi ket noi thanh cong)
1 = CLOSE
2 = PING
3 = PONG
4 = MESSAGE      (chua mot socket.io packet ben trong)
5 = UPGRADE
6 = NOOP

socket.io packet types (chu so THU HAI, sau khi engine.io la 4)
0 = CONNECT      (client tham gia namespace)
1 = DISCONNECT
2 = EVENT        (tin nhan binh thuong)
3 = ACK          (phan hoi cho mot emit yeu cau ack)
4 = CONNECT_ERROR
5 = BINARY_EVENT (co attachment binary)
6 = BINARY_ACK
</code></pre>

<div class="callout ok">
<p><strong>Read this table straight out of DevTools.</strong> Open the Network tab, filter on &quot;WS&quot;, click the socket.io connection, then the Messages tab. Every row is one frame and you see the string it starts with. <code>42[...]</code> is an event, <code>2</code> alone is a ping, <code>3</code> alone is a pong. No more guessing why &quot;the client never got the emit&quot; — just look for the presence or absence of the <code>42[&quot;event-name&quot;,...]</code>.</p>
</div>

<h3>Why the four layers become obvious once you read packets</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">layer 1</span><span class="lz-t">WebSocket frame</span><span class="lz-d">Says only &quot;a message arrived&quot;, never &quot;which message&quot;. Text or binary, that is all. DevTools renders binary as hex and text as a string.</span></div>
<div class="lz-step"><span class="lz-k">layer 2</span><span class="lz-t">engine.io</span><span class="lz-d">The first digit. <code>0</code>=OPEN, <code>4</code>=MESSAGE. No payload and the story ends there. With a payload you read the rest under the LAYER 3 protocol.</span></div>
<div class="lz-step"><span class="lz-k">layer 3</span><span class="lz-t">socket.io</span><span class="lz-d">The second digit (when engine.io is 4). <code>0</code>=CONNECT, <code>2</code>=EVENT. The payload is JSON.</span></div>
<div class="lz-step"><span class="lz-k">layer 4</span><span class="lz-t">your code</span><span class="lz-d">From the JSON array, the first element is the event name and the rest are args. This is where <code>socket.on(&#39;event&#39;, ...args)</code> gets called.</span></div>
</div>

<h3>An ack on the wire</h3>
<pre><code class="language-text"># đo thật trong Chromium (socket.io 4.8.3) — id đếm từ 0, mỗi phía một bộ đếm riêng
Client → Server:  420["chat:message",{"text":"hi"}]     (ack id 0)
Server → Client:  430[{"ok":true,"nhan":"hi"}]           (trả lời id 0)

Server → Client:  420["hoi","còn đó không?"]            (ack id 0 của SERVER)
Client → Server:  430["vẫn ở đây"]
</code></pre>

<p>Only when you <code>emit</code> with a callback does an ack id get assigned. No callback → no ack id → no &quot;at-least-once&quot; guarantee — Chapter 6 measures exactly this.</p>

<div class="pitfall">
<p><strong>Trap — thinking <code>2</code> and <code>3</code> are &quot;ping&quot; and &quot;pong&quot; at LAYER 3.</strong> NO. <code>2</code> và <code>3</code> are packet types at LAYER 2 (engine.io). At LAYER 3 (socket.io, once engine.io has said 4), <code>2</code> is EVENT and <code>3</code> is ACK. Same digits, different layer, different meaning. Confusing the two is the number-one source of muddled logs when debugging the protocol.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> The first three packets of every socket.io connection are OPEN (engine.io <code>0</code> mang sid + timings), CONNECT (engine.io <code>4</code> + socket.io <code>0</code> carrying the namespace sid) and EVENT (engine.io <code>4</code> + socket.io <code>2</code> mang <code>[&quot;name&quot;, ...args]</code>) — know those three and DevTools&#39; Network → WS tab becomes a packet list you can actually read, and every &quot;did the event go out?&quot; question turns into &quot;is there a <code>42[&quot;name&quot;,...]</code> in the tab?&quot;.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Connect to a Socket.IO server with raw <code>ws</code> at <code>/socket.io/?EIO=4&amp;transport=websocket</code> and log every frame as a string.</li>
<li>Decode the first three frames by their leading digits: OPEN (<code>0{...}</code>), CONNECT (<code>40{...}</code>), EVENT (<code>42[...]</code>) — and find the TWO different sids inside them.</li>
<li>Open DevTools → Network → WS → Messages and match each row to the packet-type table: <code>2</code> alone is a ping, <code>3</code> a pong, <code>42[...]</code> an event.</li>
</ol>
<p><strong>Done when:</strong> you can read a wire frame's leading digits and name both the engine.io and the socket.io packet type.</p></div>

<h3>🔬 Measured: the same packets over polling, and in a real browser</h3>
<p><strong>Over polling, with curl</strong> — note <code>upgrades</code> is no longer empty:</p>
<pre><code class="language-bash">$ curl -s 'http://localhost:19432/socket.io/?EIO=4&amp;transport=polling'; echo</code></pre><div class="out">0{"sid":"EvCrVv0JqKt_j6OgAAAA","upgrades":["websocket"],"pingInterval":25000,"pingTimeout":20000,"maxPayload":1000000}</div>
<p><strong>A real Chromium page</strong> (Playwright, socket.io 4.8.3, <code>pingInterval: 2000</code> on the test server). Polling phase — request bodies and responses:</p>
<div class="out">↓ GET  0{"sid":"uPrY2c-RnVM5ml82AAAA","upgrades":["websocket"],"pingInterval":2000,"pingTimeout":2000,"maxPayload":1000000}
↑ POST 40   → "ok"
↓ GET  40{"sid":"iRQrTYYia_9yrUI3AAAA"}␞42["hello",{"world":42}]
↑ POST 420["chat:message",{"text":"hi"}]   → "ok"
↓ GET  430[{"ok":true,"nhan":"hi"}]</div>
<p>The third GET carried TWO packets separated by <code>\\x1e</code> (shown as ␞): polling batches whatever is queued. The page's first emit with a callback went out as <code>420</code> — ack ids count from <strong>0</strong>.</p>
<p>WebSocket phase — frames as DevTools shows them:</p>
<div class="out">↑ 2probe                             (35 ms)
↓ 3probe                             (37 ms)
↑ 5                                  (38 ms)
↓ 420["hoi","còn đó không?"]         (1234 ms)
↑ 430["vẫn ở đây"]                   (1234 ms)
↓ 2                                  (2026 ms)
↑ 3                                  (2026 ms)
↓ 2                                  (4027 ms)
↑ 3                                  (4027 ms)</div>
<p><code>2probe</code>/<code>3probe</code> test the new pipe, <code>5</code> switches to it, then only events, acks, and a ping (<code>2</code>) / pong (<code>3</code>) every <code>pingInterval</code>.</p>
<p><strong>maxPayload, measured:</strong></p>
<div class="out">$ node to-qua.mjs
server NHẬN chuỗi 999.000 ký tự
gửi 1.100.000 ký tự …
server: disconnect "transport error"
client: disconnect "transport close"</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-javascript"><span class="tok-comment">// Bỏ socket.io-client: nối bằng ws THÔ rồi in từng khung đúng như trên dây</span>
import { Server } from 'socket.io';
import { WebSocket } from 'ws';
import http from 'node:http';
const srv = http.createServer();
const io = new Server(srv);
io.on('connection', (s) =&gt; s.emit('hello', { world: 42 }));
await new Promise((r) =&gt; srv.listen(19430, r));
const ws = new WebSocket('ws://localhost:19430/socket.io/?EIO=4&amp;transport=websocket');
ws.on('message', (d) =&gt; console.log('WIRE:', JSON.stringify(d.toString())));
await new Promise((r) =&gt; ws.on('open', r));
ws.send('40'); <span class="tok-comment">  // tự tay gửi: engine.io MESSAGE (4) + socket.io CONNECT (0)</span>
setTimeout(() =&gt; { ws.close(); io.close(); process.exit(0); }, 500);</code></pre>
<p>Run with <code>node probe3.mjs</code> (in a folder with <code>npm i socket.io@4.8.3 ws</code> and <code>"type": "module"</code>). Then <code>curl -s 'http://localhost:&lt;port&gt;/socket.io/?EIO=4&amp;transport=polling'</code> against any Socket.IO server.</p>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-9-2-websocket" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking for Developers · 9.2 — WebSocket: upgrade, frames and heartbeat</span><span class="lc-sub">The layer-1 frame below these digits: masking, opcodes, close codes</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-11-1-tcpdump" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking for Developers · 11.1 — tcpdump on a headless server</span><span class="lc-sub">Capture the same frames where there is no DevTools</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">engine.io packet type</span><span class="v">The FIRST digit: <code>0</code> OPEN, <code>2</code> PING, <code>3</code> PONG, <code>4</code> MESSAGE.</span></div>
  <div class="kv"><span class="k">socket.io packet type</span><span class="v">The SECOND digit (after a <code>4</code>): <code>0</code> CONNECT, <code>2</code> EVENT, <code>3</code> ACK.</span></div>
  <div class="kv"><span class="k">OPEN packet</span><span class="v"><code>0{...}</code> — carries sid, <code>pingInterval</code>, <code>pingTimeout</code>, <code>maxPayload</code>.</span></div>
  <div class="kv"><span class="k">Two sids</span><span class="v">engine.io sid (<code>socket.conn.id</code>) vs socket.io sid (<code>socket.id</code>) — different values.</span></div>
  <div class="kv"><span class="k">EVENT frame</span><span class="v"><code>42[&quot;name&quot;, ...args]</code> — your emit as it travels on the wire.</span></div>
  <div class="kv"><span class="k">ack id</span><span class="v">A number assigned only when you emit WITH a callback (Chapter 6).</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>The first three frames of any connection are always OPEN, CONNECT, EVENT.</li><li>The first digit is engine.io; the second (after a <code>4</code>) is socket.io.</li><li>One connection carries two sids: engine.io (<code>conn.id</code>) and socket.io (<code>socket.id</code>).</li><li><code>42[&quot;name&quot;,args]</code> is your emit on the wire — its absence in the WS tab answers &quot;did it send?&quot;.</li><li>ping/pong are <code>2</code>/<code>3</code> at layer 2; at layer 3 those same digits mean EVENT/ACK.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Engine.IO protocol spec</span><span class="lc-sub">github.com/socketio/engine.io-protocol — nguồn cho bảng packet type ở layer 2. Ngắn (dưới 300 dòng markdown) và bắt buộc đọc một lần.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO protocol spec</span><span class="lc-sub">github.com/socketio/socket.io-protocol — nguồn cho bảng packet type ở layer 3, kèm định nghĩa ack và binary attachments.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Chrome DevTools — WebSocket frame inspection</span><span class="lc-sub">developer.chrome.com/docs/devtools/network#websocket — cách mở tab WS, lọc frame, và xem payload trong bảng.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 10 — diagnosing realtime bugs</span><span class="lc-sub">/courses/socket-io/learn${REF} — cây quyết định dùng chính bảng packet của bài này ở bước một: có frame <code>42[...]</code> trên dây không?</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Thứ trên dây: ba packet thật</h2>
<p class="lead">Mọi bài trước đều dùng thư viện socket.io-client. Bài này bỏ qua nó và kết nối bằng <code>ws</code> thô, để đọc byte thật và đối chiếu với đặc tả engine.io. Sau bài này, tab Network → WS của DevTools không còn là ma thuật — nó là một danh sách packet bạn giải mã được.</p>

<h3>Phép đo</h3>
<pre><code class="language-js">import { Server } from 'socket.io';
import { WebSocket } from 'ws';
import http from 'http';

const srv = http.createServer();
const io = new Server(srv);
io.on('connection', s => s.emit('hello', { world: 42 }));
await new Promise(r => srv.listen(0, r));

const ws = new WebSocket(&#96;ws://localhost:\${srv.address().port}/socket.io/?EIO=4&transport=websocket&#96;);
ws.on('message', d =&gt; console.log('WIRE:', JSON.stringify(d.toString())));
await new Promise(r =&gt; ws.on('open', r));
ws.send('40');   // gui thu cong engine.io message + socket.io CONNECT
</code></pre>

<div class="out">$ node probe3.mjs
WIRE: "0{\\"sid\\":\\"sF7e3x9ZpVJa0IwhAAAA\\",\\"upgrades\\":[],\\"pingInterval\\":25000,\\"pingTimeout\\":20000,\\"maxPayload\\":1000000}"
WIRE: "40{\\"sid\\":\\"2f1OJR736nRPGKluAAAB\\"}"
WIRE: "42[\\"hello\\",{\\"world\\":42}]"
</div>

<p>Ba frame. Mỗi cái bắt đầu bằng một hoặc hai chữ số — đó là packet type của engine.io/socket.io. Giải mã từng cái.</p>

<h3>Frame 1 — engine.io OPEN packet</h3>
<pre><code class="language-text">0{"sid":"sF7e3x9ZpVJa0IwhAAAA","upgrades":[],"pingInterval":25000,"pingTimeout":20000,"maxPayload":1000000}
│
└── packet type engine.io 0 = OPEN
</code></pre>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>sid</code></span><span class="lz-lnote">Engine.io session id. Đây là sid của TẦNG 2 — nó định danh cái connection, không phải socket. Cần cho polling để hai HTTP request biết nói cùng một session</span></div>
<div class="lz-layer"><span class="lz-lname"><code>upgrades: []</code></span><span class="lz-lnote">Trống vì client này đã kết nối bằng WebSocket ngay từ đầu. Nếu kết nối bằng polling, list này sẽ là <code>[&quot;websocket&quot;]</code> để nói &quot;bạn có thể upgrade lên WebSocket bất cứ lúc nào&quot;</span></div>
<div class="lz-layer"><span class="lz-lname"><code>pingInterval: 25000</code></span><span class="lz-lnote">Server sẽ gửi ping mỗi 25 giây. Đây là default; kho này đặt cùng số 25000</span></div>
<div class="lz-layer"><span class="lz-lname"><code>pingTimeout: 20000</code></span><span class="lz-lnote">Nếu server không nhận pong trong 20 giây, client bị coi là mất. Default 20s; kho này đặt 60000 (60s, cao hơn để chịu được biến động mạng di động)</span></div>
<div class="lz-layer"><span class="lz-lname"><code>maxPayload: 1000000</code></span><span class="lz-lnote">Kích thước tối đa một tin nhắn: 1 MB. Vượt qua thì CẢ kết nối bị đóng ở tầng 2 (đo bên dưới: server "transport error", client "transport close")</span></div>
</div>

<h3>Frame 2 — socket.io CONNECT packet</h3>
<pre><code class="language-text">40{"sid":"2f1OJR736nRPGKluAAAB"}
│└─ packet type socket.io 0 = CONNECT
└── packet type engine.io 4 = MESSAGE
</code></pre>

<div class="callout warn">
<p><strong>Đây là chỗ có HAI sid.</strong> Engine.io sid ở frame 1 (<code>sF7e3x9ZpVJa0IwhAAAA</code>) khác socket.io sid ở frame 2 (<code>2f1OJR736nRPGKluAAAB</code>). Một engine.io connection có thể nuôi nhiều namespace, và mỗi namespace phát sid RIÊNG. Trong debugger bạn sẽ thấy <code>socket.id</code> và <code>socket.conn.id</code> — cái đầu là sid tầng 3, cái sau là sid tầng 2. Lần đầu thấy là bối rối.</p>
</div>

<h3>Frame 3 — socket.io EVENT packet</h3>
<pre><code class="language-text">42["hello",{"world":42}]
│└─ packet type socket.io 2 = EVENT
└── packet type engine.io 4 = MESSAGE
</code></pre>

<p>Payload là một mảng JSON: phần tử đầu là TÊN sự kiện, các phần tử sau là các argument. Đây là chỗ code của bạn ở tầng 4 tương ứng:</p>

<pre><code class="language-ts">socket.emit('hello', { world: 42 })
//     ↑         ↑          ↑
//   type=2    name       args[0]
</code></pre>

<h3>Bảng packet type — cho toàn khoá học</h3>
<pre><code class="language-text">engine.io packet types (chu so DAU tien)
0 = OPEN         (server gui khi ket noi thanh cong)
1 = CLOSE
2 = PING
3 = PONG
4 = MESSAGE      (chua mot socket.io packet ben trong)
5 = UPGRADE
6 = NOOP

socket.io packet types (chu so THU HAI, sau khi engine.io la 4)
0 = CONNECT      (client tham gia namespace)
1 = DISCONNECT
2 = EVENT        (tin nhan binh thuong)
3 = ACK          (phan hoi cho mot emit yeu cau ack)
4 = CONNECT_ERROR
5 = BINARY_EVENT (co attachment binary)
6 = BINARY_ACK
</code></pre>

<div class="callout ok">
<p><strong>Đọc bảng này trong DevTools.</strong> Mở tab Network, lọc &quot;WS&quot;, click connection socket.io, tab Messages. Mỗi hàng là một frame và bạn thấy chuỗi bắt đầu bằng số. <code>42[...]</code> là event, <code>2</code> một mình là ping, <code>3</code> một mình là pong. Không cần đoán vì sao &quot;client không nhận emit&quot; — nhìn có hay không có frame <code>42[&quot;event-name&quot;,...]</code>.</p>
</div>

<h3>Vì sao bốn tầng lại rõ ràng khi nhìn packet</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">tầng 1</span><span class="lz-t">WebSocket frame</span><span class="lz-d">Chỉ nói &quot;có tin&quot;, không nói &quot;tin gì&quot;. Text hay binary, thế thôi. DevTools hiển thị binary như hex, text như chuỗi.</span></div>
<div class="lz-step"><span class="lz-k">tầng 2</span><span class="lz-t">engine.io</span><span class="lz-d">Số đầu tiên. <code>0</code>=OPEN, <code>4</code>=MESSAGE. Không có payload thì hết chuyện. Có payload thì đọc phần còn lại theo protocol của TẦNG 3.</span></div>
<div class="lz-step"><span class="lz-k">tầng 3</span><span class="lz-t">socket.io</span><span class="lz-d">Số thứ hai (khi engine.io là 4). <code>0</code>=CONNECT, <code>2</code>=EVENT. Payload là JSON.</span></div>
<div class="lz-step"><span class="lz-k">tầng 4</span><span class="lz-t">mã của bạn</span><span class="lz-d">Từ JSON array, phần tử đầu là tên event, phần còn lại là args. Đây là chỗ <code>socket.on(&#39;event&#39;, ...args)</code> được gọi.</span></div>
</div>

<h3>Ack trên dây</h3>
<pre><code class="language-text"># đo thật trong Chromium (socket.io 4.8.3) — id đếm từ 0, mỗi phía một bộ đếm riêng
Client → Server:  420["chat:message",{"text":"hi"}]     (ack id 0)
Server → Client:  430[{"ok":true,"nhan":"hi"}]           (trả lời id 0)

Server → Client:  420["hoi","còn đó không?"]            (ack id 0 của SERVER)
Client → Server:  430["vẫn ở đây"]
</code></pre>

<p>Chỉ khi bạn <code>emit</code> có callback là ack id được gán. Không có callback → không có ack id → không có &quot;at-least-once&quot; guarantee — Chương 6 sẽ đo cái này.</p>

<div class="pitfall">
<p><strong>Bẫy — nghĩ <code>2</code> và <code>3</code> là &quot;ping&quot; và &quot;pong&quot; ở TẦNG 3.</strong> KHÔNG. <code>2</code> và <code>3</code> là packet type ở TẦNG 2 (engine.io). Ở TẦNG 3 (socket.io, sau khi engine.io là 4) thì <code>2</code> là EVENT và <code>3</code> là ACK. Cùng số, khác tầng, khác nghĩa. Nhầm lẫn ở đây là nguồn số 1 của log lộn xộn khi debug protocol.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Ba packet đầu tiên của mọi connection socket.io là OPEN (engine.io <code>0</code> mang sid + timings), CONNECT (engine.io <code>4</code> + socket.io <code>0</code> mang sid namespace) và EVENT (engine.io <code>4</code> + socket.io <code>2</code> mang <code>[&quot;name&quot;, ...args]</code>) — biết ba cái này thì tab DevTools&#39; Network → WS là một danh sách packet bạn đọc được, và mọi câu hỏi &quot;event có đi không&quot; trở thành câu hỏi &quot;có <code>42[&quot;name&quot;,...]</code> trong tab không&quot;.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Kết nối tới một server Socket.IO bằng <code>ws</code> thô ở <code>/socket.io/?EIO=4&amp;transport=websocket</code> và log mỗi frame dưới dạng chuỗi.</li>
<li>Giải mã ba frame đầu theo chữ số dẫn đầu: OPEN (<code>0{...}</code>), CONNECT (<code>40{...}</code>), EVENT (<code>42[...]</code>) — và tìm HAI sid khác nhau bên trong chúng.</li>
<li>Mở DevTools → Network → WS → Messages và khớp mỗi hàng với bảng packet type: <code>2</code> một mình là ping, <code>3</code> là pong, <code>42[...]</code> là event.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đọc được các chữ số dẫn đầu của một frame trên dây và gọi tên cả packet type engine.io lẫn socket.io.</p></div>

<h3>🔬 Đo thật: cùng các packet qua polling, và trong trình duyệt thật</h3>
<p><strong>Qua polling, bằng curl</strong> — để ý <code>upgrades</code> không còn rỗng:</p>
<pre><code class="language-bash">$ curl -s 'http://localhost:19432/socket.io/?EIO=4&amp;transport=polling'; echo</code></pre><div class="out">0{"sid":"EvCrVv0JqKt_j6OgAAAA","upgrades":["websocket"],"pingInterval":25000,"pingTimeout":20000,"maxPayload":1000000}</div>
<p><strong>Một trang Chromium thật</strong> (Playwright, socket.io 4.8.3, server thử đặt <code>pingInterval: 2000</code>). Pha polling — thân request và response:</p>
<div class="out">↓ GET  0{"sid":"uPrY2c-RnVM5ml82AAAA","upgrades":["websocket"],"pingInterval":2000,"pingTimeout":2000,"maxPayload":1000000}
↑ POST 40   → "ok"
↓ GET  40{"sid":"iRQrTYYia_9yrUI3AAAA"}␞42["hello",{"world":42}]
↑ POST 420["chat:message",{"text":"hi"}]   → "ok"
↓ GET  430[{"ok":true,"nhan":"hi"}]</div>
<p>GET thứ ba chở HAI packet, ngăn bằng <code>\\x1e</code> (hiện là ␞): polling gom mọi thứ đang chờ. Lần emit có callback đầu tiên của trang đi ra là <code>420</code> — ack id đếm từ <strong>0</strong>.</p>
<p>Pha WebSocket — các khung như DevTools hiện:</p>
<div class="out">↑ 2probe                             (35 ms)
↓ 3probe                             (37 ms)
↑ 5                                  (38 ms)
↓ 420["hoi","còn đó không?"]         (1234 ms)
↑ 430["vẫn ở đây"]                   (1234 ms)
↓ 2                                  (2026 ms)
↑ 3                                  (2026 ms)
↓ 2                                  (4027 ms)
↑ 3                                  (4027 ms)</div>
<p><code>2probe</code>/<code>3probe</code> thử đường mới, <code>5</code> chuyển hẳn sang, sau đó chỉ còn event, ack, và ping (<code>2</code>) / pong (<code>3</code>) mỗi <code>pingInterval</code>.</p>
<p><strong>maxPayload, đo thật:</strong></p>
<div class="out">$ node to-qua.mjs
server NHẬN chuỗi 999.000 ký tự
gửi 1.100.000 ký tự …
server: disconnect "transport error"
client: disconnect "transport close"</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-javascript"><span class="tok-comment">// Bỏ socket.io-client: nối bằng ws THÔ rồi in từng khung đúng như trên dây</span>
import { Server } from 'socket.io';
import { WebSocket } from 'ws';
import http from 'node:http';
const srv = http.createServer();
const io = new Server(srv);
io.on('connection', (s) =&gt; s.emit('hello', { world: 42 }));
await new Promise((r) =&gt; srv.listen(19430, r));
const ws = new WebSocket('ws://localhost:19430/socket.io/?EIO=4&amp;transport=websocket');
ws.on('message', (d) =&gt; console.log('WIRE:', JSON.stringify(d.toString())));
await new Promise((r) =&gt; ws.on('open', r));
ws.send('40'); <span class="tok-comment">  // tự tay gửi: engine.io MESSAGE (4) + socket.io CONNECT (0)</span>
setTimeout(() =&gt; { ws.close(); io.close(); process.exit(0); }, 500);</code></pre>
<p>Chạy <code>node probe3.mjs</code> (trong thư mục đã <code>npm i socket.io@4.8.3 ws</code> và có <code>"type": "module"</code>). Rồi <code>curl -s 'http://localhost:&lt;cổng&gt;/socket.io/?EIO=4&amp;transport=polling'</code> vào một server Socket.IO bất kỳ.</p>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-9-2-websocket" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking for Developers · 9.2 — WebSocket: nâng cấp, frame và nhịp tim</span><span class="lc-sub">Frame tầng 1 bên dưới các chữ số này: mặt nạ, opcode, mã đóng</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-11-1-tcpdump" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking for Developers · 11.1 — tcpdump: bắt gói trên máy chủ không giao diện</span><span class="lc-sub">Bắt chính các khung này ở nơi không có DevTools</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">packet type engine.io</span><span class="v">Chữ số ĐẦU: <code>0</code> OPEN, <code>2</code> PING, <code>3</code> PONG, <code>4</code> MESSAGE.</span></div>
  <div class="kv"><span class="k">packet type socket.io</span><span class="v">Chữ số THỨ HAI (sau một <code>4</code>): <code>0</code> CONNECT, <code>2</code> EVENT, <code>3</code> ACK.</span></div>
  <div class="kv"><span class="k">OPEN packet</span><span class="v"><code>0{...}</code> — mang sid, <code>pingInterval</code>, <code>pingTimeout</code>, <code>maxPayload</code>.</span></div>
  <div class="kv"><span class="k">Hai sid</span><span class="v">sid engine.io (<code>socket.conn.id</code>) vs sid socket.io (<code>socket.id</code>) — khác giá trị.</span></div>
  <div class="kv"><span class="k">EVENT frame</span><span class="v"><code>42[&quot;name&quot;, ...args]</code> — chính cái emit của bạn khi đi trên dây.</span></div>
  <div class="kv"><span class="k">ack id</span><span class="v">Một số chỉ được gán khi bạn emit CÓ callback (Chương 6).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Ba frame đầu của mọi connection luôn là OPEN, CONNECT, EVENT.</li><li>Chữ số đầu là engine.io; chữ số thứ hai (sau một <code>4</code>) là socket.io.</li><li>Một connection mang hai sid: engine.io (<code>conn.id</code>) và socket.io (<code>socket.id</code>).</li><li><code>42[&quot;name&quot;,args]</code> là emit của bạn trên dây — vắng nó trong tab WS trả lời câu &quot;đã gửi chưa?&quot;.</li><li>ping/pong là <code>2</code>/<code>3</code> ở tầng 2; ở tầng 3 chính hai chữ số đó nghĩa là EVENT/ACK.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Engine.IO protocol spec</span><span class="lc-sub">github.com/socketio/engine.io-protocol — nguồn cho bảng packet type ở tầng 2. Ngắn (dưới 300 dòng markdown) và bắt buộc đọc một lần.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO protocol spec</span><span class="lc-sub">github.com/socketio/socket.io-protocol — nguồn cho bảng packet type ở tầng 3, kèm định nghĩa ack và binary attachments.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Chrome DevTools — WebSocket frame inspection</span><span class="lc-sub">developer.chrome.com/docs/devtools/network#websocket — cách mở tab WS, lọc frame, và xem payload trong bảng.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 10 — chẩn đoán realtime bug</span><span class="lc-sub">/courses/socket-io/learn${REF} — cây quyết định dùng chính bảng packet của bài này ở bước một: có frame <code>42[...]</code> trên dây không?</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 0.4 ─────────────────────────── */
    {
      title: '0.4 — Section 0 quiz|||0.4 — Kiểm tra Mục 0',
      slug: 'io-0-4-quiz',
      type: 'QUIZ',
      description: 'Sáu câu, chín phút. Về bốn tầng, transport upgrade, long-polling, và ba packet đầu tiên.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Quiz</span>
<h2>What Section 0 established</h2>
<p class="lead">Four questions on what Socket.IO actually is, before any code.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Socket.IO is not WebSocket</span><span class="lz-d">It is engine.io (transport + reconnect + heartbeat) wrapped in a protocol that adds namespaces, rooms, acks and automatic reconnection. A raw WebSocket client cannot talk to a Socket.IO server — the handshake and framing differ.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Long-polling still matters in 2026</span><span class="lz-d">It is the fallback that makes the first connection succeed behind proxies and corporate middleboxes that break WebSocket upgrades. The client starts on polling and upgrades once it knows the upgrade works.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">You can read the wire</span><span class="lz-d">Engine.io packets are prefixed with a single digit (0 open, 2 ping, 3 pong, 4 message), and Socket.IO packets add a second digit (0 connect, 2 event, 3 ack). Three real packets read end to end remove most of the mystery.</span></div>
</div>
<p>4 questions, 8 minutes. Answer from the mechanism, not from memory — every option is plausible if you are guessing.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Section 0 · Kiểm tra</span>
<h2>Section 0 đã dựng được gì</h2>
<p class="lead">Bốn câu về Socket.IO thực sự là gì, trước khi viết dòng mã nào.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Socket.IO không phải WebSocket</span><span class="lz-d">Nó là engine.io (transport + reconnect + nhịp tim) bọc trong một giao thức thêm namespace, room, ack và tự động kết nối lại. Một client WebSocket thuần không nói chuyện được với server Socket.IO — bắt tay và cách đóng khung đều khác.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Long-polling vẫn còn quan trọng năm 2026</span><span class="lz-d">Nó là đường lùi giúp kết nối đầu tiên thành công sau những proxy và thiết bị trung gian doanh nghiệp vốn phá vỡ việc nâng cấp WebSocket. Client khởi đầu bằng polling rồi nâng cấp khi biết chắc việc nâng cấp chạy được.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Bạn đọc được đường truyền</span><span class="lz-d">Gói engine.io có một chữ số đứng đầu (0 open, 2 ping, 3 pong, 4 message), và gói Socket.IO thêm một chữ số thứ hai (0 connect, 2 event, 3 ack). Đọc trọn ba gói thật là gỡ bỏ gần hết vẻ bí ẩn.</span></div>
</div>
<p>4 câu, 8 phút. Hãy trả lời từ cơ chế, đừng trả lời từ trí nhớ — mọi phương án đều hợp lý nếu bạn đang đoán.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 540,
        questions: [
          {
            question: 'You see a raw wire frame <code>42[&quot;chat:message&quot;,{&quot;text&quot;:&quot;hi&quot;}]</code>. Which layer is emitting each digit?|||Bạn thấy một frame thô <code>42[&quot;chat:message&quot;,{&quot;text&quot;:&quot;hi&quot;}]</code>. Mỗi chữ số do tầng nào phát ra?',
            options: [
              'The first &quot;4&quot; is engine.io MESSAGE (layer 2), the second &quot;2&quot; is socket.io EVENT (layer 3), and the JSON array is the layer-4 event name + args|||Số &quot;4&quot; đầu là engine.io MESSAGE (tầng 2), số &quot;2&quot; sau là socket.io EVENT (tầng 3), và mảng JSON là tên event + args ở tầng 4',
              '&quot;42&quot; is a single engine.io packet type meaning &quot;event&quot;|||&quot;42&quot; là một packet type engine.io đơn nghĩa là &quot;event&quot;',
              '&quot;4&quot; is HTTP status meaning success|||&quot;4&quot; là status HTTP nghĩa là thành công',
              '&quot;42&quot; is a socket.io message ID counter|||&quot;42&quot; là bộ đếm ID tin nhắn socket.io',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Config says <code>transports: [&quot;websocket&quot;, &quot;polling&quot;]</code>. Which transport does the client actually try FIRST?|||Config có <code>transports: [&quot;websocket&quot;, &quot;polling&quot;]</code>. Client thật sự thử transport nào TRƯỚC?',
            options: [
              'Polling — client always starts with polling regardless of array order, then upgrades to WebSocket if the network allows. The array declares what is PERMITTED, not the order|||Polling — client luôn bắt đầu bằng polling bất kể thứ tự mảng, rồi upgrade lên WebSocket nếu mạng cho phép. Mảng khai báo cái nào ĐƯỢC PHÉP, không phải thứ tự',
              'WebSocket — because it is listed first|||WebSocket — vì nó được liệt kê đầu',
              'Both simultaneously and takes whichever connects first|||Cả hai đồng thời và lấy cái nào kết nối trước',
              'Depends on <code>navigator.connection.type</code>|||Phụ thuộc <code>navigator.connection.type</code>',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You see <code>socket.id</code> and <code>socket.conn.id</code> are different values. Which is which?|||Bạn thấy <code>socket.id</code> và <code>socket.conn.id</code> khác giá trị. Cái nào là cái nào?',
            options: [
              '<code>socket.id</code> is the socket.io namespace sid (layer 3), <code>socket.conn.id</code> is the engine.io connection sid (layer 2) — one engine.io connection can host multiple namespaces each with their own sid|||<code>socket.id</code> là sid của namespace socket.io (tầng 3), <code>socket.conn.id</code> là sid của connection engine.io (tầng 2) — một engine.io connection có thể nuôi nhiều namespace, mỗi cái có sid riêng',
              'A bug — they should be equal|||Bug — chúng phải bằng nhau',
              'Both engine.io sids at different points in time|||Cả hai là engine.io sid ở thời điểm khác nhau',
              'Both random UUIDs with no meaning|||Cả hai là UUID ngẫu nhiên không mang nghĩa',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why does this repo keep long-polling ENABLED in 2026?|||Vì sao kho này giữ long-polling BẬT trong năm 2026?',
            options: [
              'Because 3-5% of users sit behind corporate proxies that strip <code>Upgrade: websocket</code> headers, and without polling their socket would be dead — a trade of 133× overhead for those users against zero connection for them|||Vì 3-5% người dùng ngồi sau proxy văn phòng strip header <code>Upgrade: websocket</code>, và không có polling thì socket của họ chết — đánh đổi 133× overhead cho những người đó, so với không có kết nối nào',
              'Because WebSocket is deprecated in modern browsers|||Vì WebSocket bị deprecated ở trình duyệt hiện đại',
              'For backward compatibility with old Node.js|||Vì tương thích ngược với Node.js cũ',
              'Because polling is faster than WebSocket in practice|||Vì polling nhanh hơn WebSocket trong thực tế',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A client disconnects. Why does the server think they are still connected for up to 60 seconds?|||Một client mất kết nối. Vì sao server tưởng họ vẫn còn kết nối tới 60 giây?',
            options: [
              'Because engine.io ping/pong is at layer 2 — the server only KNOWS the client is gone when a ping goes unanswered for <code>pingTimeout</code>. This repo sets it to 60s to survive mobile network hiccups; lowering it makes disconnect faster but false-disconnects more|||Vì ping/pong engine.io ở tầng 2 — server chỉ BIẾT client mất khi một ping không được trả lời trong <code>pingTimeout</code>. Kho này đặt 60s để chịu chập chờn 3G/4G; hạ xuống thì disconnect nhanh hơn nhưng false-disconnect nhiều hơn',
              'Because socket.io caches disconnect events|||Vì socket.io cache disconnect events',
              'Because TCP RST takes 60s to propagate|||Vì TCP RST cần 60s để lan',
              'Because the browser sends a delayed disconnect on <code>beforeunload</code>|||Vì trình duyệt gửi disconnect delay trên <code>beforeunload</code>',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You want to debug &quot;server emitted an event but client never received it&quot;. Where do you look FIRST?|||Bạn muốn debug &quot;server đã emit event nhưng client không bao giờ nhận được&quot;. Bạn nhìn ở đâu TRƯỚC?',
            options: [
              'DevTools → Network → WS tab → click the socket.io connection → Messages. Look for a frame starting <code>42[&quot;event-name&quot;,...]</code>. Present but no handler ran → layer-4 bug. Absent → server never sent it or Redis adapter dropped it in cluster|||DevTools → Network → WS tab → click connection socket.io → Messages. Tìm frame bắt đầu bằng <code>42[&quot;event-name&quot;,...]</code>. Có mà không có handler chạy → bug tầng 4. Không có → server không gửi hoặc Redis adapter bỏ trong cluster',
              'Add <code>console.log</code> in every event handler on both sides|||Thêm <code>console.log</code> vào mọi event handler ở cả hai phía',
              'Restart the dev server|||Khởi động lại dev server',
              'Check <code>navigator.onLine</code>|||Kiểm <code>navigator.onLine</code>',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },

  ],
};
