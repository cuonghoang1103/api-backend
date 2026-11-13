import G04_1 from './giang/sio-04-1.mjs';
import G04_2 from './giang/sio-04-2.mjs';
import G04_3 from './giang/sio-04-3.mjs';
import G04_4 from './giang/sio-04-4.mjs';
import G04_5 from './giang/sio-04-5.mjs';
const REF = '?ref=%2Fcourses%2Fsocket-io%2Flearn&reflabel=Socket.IO';
/**
 * Socket.IO — Chương 4: Presence và bẫy O(N²).
 * Đo: comment thật của kho này (messaging.socket.ts:188-206) nói về "O(N²)
 * storm during deploy reconnects". Bài này đo chính xác cost đó.
 */

export default {
  title: 'Chapter 4 — Presence and the O(N²) trap|||Chương 4 — Presence và bẫy O(N²)',
  slug: 'io-ch4-presence',
  description: 'Sáu bài về vì sao presence dễ làm sai, cost của cách sai đo được, và pattern kho này chọn — emitPresenceTo(audience) thay io.emit — với dữ liệu thật.',
  sortOrder: 5,
  lessons: [
    /* ─────────────────────────── 4.1 ─────────────────────────── */
    {
      title: '4.1 — Naive presence: io.emit and why it is O(N²)|||4.1 — Presence ngây thơ: io.emit và vì sao O(N²)',
      slug: 'io-4-1-presence-naive',
      type: 'VIDEO',
      description: 'Cách hiển nhiên — io.emit(`presence:update`, ...) — cho ra O(N²) cost khi N connect/disconnect. Comment thật của kho này (messaging.socket.ts:188-206) nói &quot;O(N²) storm during deploy reconnects&quot;.',
      content: `
${G04_1}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Naive presence: io.emit and why it is O(N²)</h2>
<p class="lead">Every chat app wants to show &quot;X is online&quot;. The naive implementation seems obvious and works fine at 10 users. It falls apart at 10.000, and this repo has the comment to prove it: &quot;an O(N²) storm during deploy reconnects&quot;.</p>

<h3>The naive version</h3>
<pre><code class="language-ts">io.on('connection', (socket) =&gt; {
  const userId = socket.data.userId;
  onlineUserIds.add(userId);

  // NAIVE: broadcast to EVERYONE
  io.emit('presence:update', { userId, online: true });

  socket.on('disconnect', () =&gt; {
    onlineUserIds.delete(userId);
    io.emit('presence:update', { userId, online: false });
  });
});
</code></pre>

<h3>Cost analysis</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1 user connect</span><span class="lz-t">1 event × N receivers</span><span class="lz-d">With N=10,000 sockets connected, each connect means 10,000 packets to send. Fine — 100 KB in total.</span></div>
<div class="lz-step"><span class="lz-k">N users connect</span><span class="lz-t">N × N = N² packets</span><span class="lz-d">With N=10,000 and all of them reconnecting at once (a deploy): 100,000,000 packets. At 60 bytes each that is 6 GB of traffic — in a handful of seconds. <strong>Measured:</strong> after a <code>kill -9</code> deploy no offline is ever sent and the k-th reconnect reaches the k sockets already back — exactly N(N+1)/2 (500,500 at N=1,000; 2,001,000 at N=2,000), so ~50 M at N=10,000; a frame is 73–75 B ⇒ ~3.8 GB.</span></div>
<div class="lz-step"><span class="lz-k">CPU cost</span><span class="lz-t">JSON.stringify × N²</span><span class="lz-d">Node serialises the payload N² times. At ~2μs per serialisation, 100M × 2μs = 200 seconds of CPU. Across 8 cores: 25 seconds of latency. <strong>Measured — wrong mechanism:</strong> one <code>io.emit</code> to 1,000 sockets called <code>JSON.stringify</code> ONCE; the cost is the write per socket — 10,859 ms of server CPU for 2,001,000 packets ≈ 5.4 µs/packet ⇒ ~270 s at N=10,000. And the JavaScript of one Node process runs on ONE core: 8 cores do not divide it.</span></div>
</div>

<div class="out">Deploy scenario:
  Truoc deploy: 10.000 socket online
  Deploy: server restart, 10.000 disconnect + 10.000 reconnect
  Presence update: 20.000 events, moi cai duoc emit den 10.000 client
  Tong: 200.000.000 packet trong ~10 giay
  = 20 trieu packets/second
  = server dead
</div>

<h3>The actual comment in this repo</h3>
<pre><code class="language-ts">// messaging.socket.ts:188-206
/**
 * Emit a presence update ONLY to the given audience (their per-user
 * rooms), instead of io.emit to every connected socket. The FE only
 * ever renders presence for friends (ActiveNowRow) and chat peers
 * (ThreadList / MiniChatDock / ChatInfoPanel / /messages), so a global
 * broadcast was O(all sockets) per connect/disconnect — an O(N²) storm
 * during deploy reconnects. audience = friends ∪ thread peers.
 */
function emitPresenceTo(
  audience: number[],
  payload: { userId: number; online: boolean; lastSeen: number },
): void {
  for (const uid of audience) {
    io?.to(&#96;user:\${uid}&#96;).emit('presence:update', payload);
  }
}
</code></pre>

<div class="callout ok">
<p><strong>Where this comment comes from (checked 13/11/2026):</strong> commit <code>331745e72</code> (10/07/2026, perf pass &quot;P2-1a&quot;) moved presence from <code>io.emit</code> / <code>socket.broadcast</code> to <code>emitPresenceTo(audience)</code>. The O(N²) line is that commit&#39;s <em>analysis</em> — the commit carries no measurement; the 🔬 section below measures it. On 22/10/2026 <code>39eb43755</code> removed the two fallbacks to a global broadcast it had kept. The cost drops from N² to N × |audience| — with an average audience of 30 people, that is a ~333× reduction at N=10,000 (measured ratio in a storm = N/30: 33× at 1,000, 67× at 2,000).</p>
</div>

<h3>The estimate for this repo</h3>
<div class="out">N = 10.000 online users (uoc luong tuong lai)
audience (friends + thread peers) trung binh: 30 nguoi

NAIVE:  10.000 connect * 10.000 receivers = 100.000.000 packets
FIX:    10.000 connect *     30 receivers =     300.000 packets

Tiet kiem: 333x tren luot event
Deploy storm giam tu ~5 phut server dead xuong ~1 giay lag nho
</div>

<h3>Why "just don't emit disconnect" is not enough</h3>
<pre><code class="language-ts">// Y tuong kem: chi emit connect, khong disconnect (presence tu decay)
io.on('connection', (socket) =&gt; {
  io.emit('presence:update', { userId, online: true });
  // KHONG emit disconnect
});

// Cost: 50% van la N x N = N^2. Van kem.
</code></pre>

<p>A 2× reduction does not solve a complexity problem — it is still O(N²). You have to change the ALGORITHM, not trim a constant. <strong>Measured:</strong> in a <code>kill -9</code> deploy the dead process emits no offline at all — the whole storm is the reconnect half, so skipping disconnect saves nothing there.</p>

<div class="pitfall">
<p><strong>Trap — dismissing 10,000 users as &quot;too far off&quot; to care about today.</strong> Say the repo has ~200 online users (an estimate, not a measurement). But a deploy storm scales as N² in <em>current N</em>, not in the target N. One storm at 200 is 200·201/2 = 20,100 packets. Still easy. At 2,000 it is 2,001,000 packets — measured: ~11 s of server CPU, 1,646 failed reconnects, a 10.8 s tail. The problem detonates when you are not watching, not when you are waiting for it.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Naive presence <code>io.emit</code> is O(N²) — at N=10,000 a deploy reconnect storm is 100 million packets in a few seconds (a dead server), and this repo's fix (<code>emitPresenceTo(audience)</code>, audience ≈ 30) cuts that 333× down to ~300k packets — the repo comment is the analysis, the 🔬 measurement below is the evidence.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Write naive presence that does <code>io.emit</code> on every connect/disconnect and compute the packet count for a reconnect storm at N=100, 1,000 and 10,000 — see the N² growth.</li>
<li>Replace it with <code>emitPresenceTo(audience)</code> where the audience is ~30 and recompute; note the ~333× drop.</li>
<li>Find the comment and its commit (<code>git log -S &quot;O(N²) storm&quot;</code>) and decide: analysis or measurement? Then measure it yourself (🔁 below).</li>
</ol>
<p><strong>Done when:</strong> you can show why <code>io.emit</code> presence is O(N²) and how targeting an audience makes it roughly linear.</p></div>

<h3>🔬 Measured: one deploy (kill -9) under 100 / 1,000 / 2,000 clients</h3>
<p>socket.io 4.8.3, Node 22, on the course machine — N clients online, the server process is killed with SIGKILL, a new one starts, all N reconnect by themselves. Counted at the clients:</p>
<div class="out">$ node bao.mjs
io.emit        N= 100 · nối lại 100 · gói nhận     5.050 · 0,4 MB · CPU server   135 ms · dải 0,9 s · lỗi nối 0
io.emit        N=1000 · nối lại 1000 · gói nhận   500.500 · 37,5 MB · CPU server 2.782 ms · dải 4,0 s · lỗi nối 198
io.emit        N=2000 · nối lại 2000 · gói nhận 2.001.000 · 151,0 MB · CPU server 10.859 ms · dải 10,8 s · lỗi nối 1646
emitPresenceTo N= 100 · nối lại 100 · gói nhận     1.500 · 0,1 MB · CPU server   112 ms · dải 0,9 s · lỗi nối 0
emitPresenceTo N=1000 · nối lại 1000 · gói nhận    15.000 · 1,2 MB · CPU server   521 ms · dải 1,0 s · lỗi nối 0
emitPresenceTo N=2000 · nối lại 2000 · gói nhận    30.000 · 2,3 MB · CPU server   946 ms · dải 1,0 s · lỗi nối 0</div>
<p><code>io.emit</code>: exactly N(N+1)/2 (the k-th reconnect reaches the k sockets already back). Audience of 30: exactly 15N (each pair of friends exchanges one packet). Server CPU ≈ 5.4 µs per packet written. While the server is busy writing, the listen queue (128) overflows: failed reconnect attempts and a long tail.</p>
<p><strong>How many times is the payload serialised?</strong></p>
<div class="out">$ node mahoa.mjs
io.emit tới 1000 socket      ⇒ JSON.stringify 1 lần · ghi 1000 gói
emitPresenceTo: 30 lượt io.to(user:x) ⇒ JSON.stringify 30 lần · ghi 30 gói
một lượt io.to([30 room])        ⇒ JSON.stringify 1 lần · ghi 30 gói
một khung trên dây: 42["presence:update",{"userId":7,"online":true,"lastSeen":1794556393811}] = 73 byte</div>
<p><strong>What one browser tab receives</strong> (Chromium: An&#39;s tab with 3 friends, while 60 strangers and the friends come and go): <code>io.emit</code> ⇒ 127 presence frames (121 about strangers, including An&#39;s own echo); <code>emitPresenceTo(audience)</code> ⇒ 6.</p>
<p><strong>This repo:</strong></p>
<div class="out">$ grep -n "O(N²)" -B5 -A1 src/socket/messaging.socket.ts
188-/**
189- * Emit a presence update ONLY to the given audience (their per-user
190- * rooms), instead of &#96;io.emit&#96; to every connected socket. The FE only
191- * ever renders presence for friends (ActiveNowRow) and chat peers
192- * (ThreadList / MiniChatDock / ChatInfoPanel / /messages), so a global
193: * broadcast was O(all sockets) per connect/disconnect — an O(N²) storm
194- * during deploy reconnects. &#96;audience&#96; = friends ∪ thread peers.
$ git log --format='%h %ad %s' --date=short -S "O(N²) storm" -- src/socket/messaging.socket.ts
331745e72 2026-07-10 perf(realtime): scope presence:update to friends + chat peers, not every socket (P2-1a)
$ git show 39eb43755 -- src/socket/messaging.socket.ts | grep "^-.*\\(broadcast.emit\\|io?.emit\\)"
-          socket.broadcast.emit('presence:update', {
-          io?.emit('presence:update', payload);
$ grep -n "chỉ phát lúc" -A3 frontend/src/lib/api.ts
3394:   * Vì sao cần, khi đã có socket &#96;presence:update&#96;: sự kiện đó chỉ phát lúc
3395-   * ai đó ĐỔI trạng thái. Vừa mở app thì chưa ai vừa đổi cả, nên nếu chỉ
3396-   * nghe socket thì mọi người đều hiện "Ngoại tuyến" cho tới khi có người
3397-   * tình cờ nối/ngắt. Trường này là ẢNH CHỤP lúc mở; socket lo phần sau đó.</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-javascript"><span class="tok-comment">// Server presence (tiến trình con, để đo CPU riêng). kieu = 'tho' (io.emit cho TẤT CẢ) | 'aud' (emitPresenceTo: 30 bạn).</span>
import { Server } from 'socket.io';
const [kieu, n] = process.argv.slice(2); const N = +n;
const io = new Server(19650);
<span class="tok-comment">// 30 bạn đối xứng: u±1 … u±15 (vòng tròn) — giả lập "bạn bè ∪ người cùng chat"</span>
const ban = (u) =&gt; { const r = []; for (let k = 1; k &lt;= 15; k++) r.push((u + k) % N, (u - k + N) % N); return r; };
const emitPresenceTo = (audience, p) =&gt; { for (const v of audience) io.to(&#96;user:\${v}&#96;).emit('presence:update', p); };
io.on('connection', (s) =&gt; {
  const u = s.handshake.auth.user; s.join(&#96;user:\${u}&#96;);
  const p = { userId: u, online: true, lastSeen: Date.now() };
  if (kieu === 'tho') io.emit('presence:update', p); else emitPresenceTo(ban(u), p);
});
let c0 = process.cpuUsage();
process.on('message', (m) =&gt; {
  if (m === 'bat-dau') { c0 = process.cpuUsage(); process.send('ok'); }
  if (m === 'do') { const c = process.cpuUsage(c0); process.send((c.user + c.system) / 1000); }
});
io.httpServer.once('listening', () =&gt; process.send('san-sang'));</code></pre>
<pre><code class="language-javascript"><span class="tok-comment">// Bão nối lại khi deploy: N client đang online → GIẾT server (kill -9) → server mới lên → N client tự nối lại cùng lúc.</span>
<span class="tok-comment">// Đếm THẬT ở client: bao nhiêu gói presence:update tới, bao nhiêu byte, CPU server mới tốn bao nhiêu.</span>
import { fork } from 'node:child_process';
import { io as ketNoi } from 'socket.io-client';
const so = (x) =&gt; x.toLocaleString('vi-VN');
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
const hoi = (m, lenh) =&gt; new Promise((r) =&gt; { m.once('message', r); m.send(lenh); });
const moi = (kieu, N) =&gt; new Promise((r) =&gt; { const m = fork('./may41.mjs', [kieu, String(N)]); m.once('message', () =&gt; r(m)); });
for (const [kieu, ten] of [['tho', 'io.emit       '], ['aud', 'emitPresenceTo']]) {
  for (const N of [100, 1000, 2000]) {
    let may = await moi(kieu, N);
    let nhan = 0, byte = 0, dau = 0, cuoi = 0, vao = 0, loi = 0, dangDo = false; const rot = {};
    const ds = [];
    for (let i = 0; i &lt; N; i++) {
      const c = ketNoi('http://localhost:19650', { auth: { user: i }, transports: ['websocket'], forceNew: true });
      c.on('presence:update', () =&gt; { nhan++; cuoi = performance.now(); dau ||= cuoi; });
      c.io.on('reconnect', () =&gt; vao++);
      c.io.on('reconnect_error', () =&gt; loi++);
      c.on('disconnect', (ly) =&gt; { if (dangDo) rot[ly] = (rot[ly] ?? 0) + 1; });
      c.io.on('open', () =&gt; c.io.engine.on('packet', (p) =&gt; { if (p.type === 'message') byte += Buffer.byteLength(p.data) + 1; }));
      ds.push(c);
    }
    await Promise.all(ds.map((c) =&gt; (c.connected ? 0 : new Promise((r) =&gt; c.once('connect', r)))));
    await cho(1500);
    may.kill('SIGKILL');                     <span class="tok-comment">  // deploy: tiến trình cũ chết, KHÔNG kịp phát offline</span>
    await cho(200);
    nhan = 0; byte = 0; dau = 0; cuoi = 0; vao = 0; loi = 0; dangDo = true;
    may = await moi(kieu, N); await hoi(may, 'bat-dau');
    while (vao &lt; N || performance.now() - cuoi &lt; 800) await cho(200);
    const cpu = await hoi(may, 'do');
    console.log(&#96;\${ten} N=\${String(N).padStart(4)} · nối lại \${vao} · gói nhận \${so(nhan).padStart(9)} · \${(byte / 1e6).toFixed(1).replace('.', ',')} MB · CPU server \${so(Math.round(cpu)).padStart(5)} ms · dải \${((cuoi - dau) / 1000).toFixed(1).replace('.', ',')} s · lỗi nối \${loi}\${Object.keys(rot).length ? ' · rớt ' + JSON.stringify(rot) : ''}&#96;);
    may.kill('SIGKILL'); ds.forEach((c) =&gt; c.close()); await cho(300);
  }
}
process.exit(0);</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-2-4-chan-event-loop" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 2.4 — Blocking the event loop, measured</span><span class="lc-sub">Why a busy server cannot even accept new connections</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-2-ws-vs-socketio-rooms" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 11.2 — ws or Socket.IO: the price of convenience</span><span class="lc-sub">io.emit wakes 2,000 sockets; io.to(room) wakes the room</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Presence</span><span class="v">The online/offline (and last-seen) state broadcast to interested users.</span></div>
  <div class="kv"><span class="k">O(N²)</span><span class="v">Every user telling every user — cost grows with the square of the user count.</span></div>
  <div class="kv"><span class="k">Reconnect storm</span><span class="v">A deploy drops every client at once; they all reconnect and re-announce.</span></div>
  <div class="kv"><span class="k"><code>io.emit</code> (naive)</span><span class="v">Broadcasting presence to everyone — the source of the N² blow-up.</span></div>
  <div class="kv"><span class="k"><code>emitPresenceTo(audience)</code></span><span class="v">Send presence only to the ~30 users who care.</span></div>
  <div class="kv"><span class="k">Audience</span><span class="v">The small set that actually needs a given user's presence.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Naive <code>io.emit</code> presence is O(N²): everyone announces to everyone.</li><li>At N=10,000 a deploy reconnect storm is ~100 million packets in seconds — a dead server.</li><li>Targeting an audience (~30) with <code>emitPresenceTo</code> cuts that ~333× to ~300k packets.</li><li>The win is from shrinking the audience, not the payload.</li><li>Measured: one io.emit is serialised once; the cost is the per-socket write (~5.4 µs), on one core.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Broadcasting messages</span><span class="lc-sub">socket.io/docs/v4/broadcasting-events — chi tiết cost của io.emit vs io.to.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Lesson 4.2 — the friends table</span><span class="lc-sub">/courses/socket-io/learn${REF} — cách lấy audience nhanh (query cache).</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Presence ngây thơ: io.emit và vì sao O(N²)</h2>
<p class="lead">Mọi chat app đều muốn hiện &quot;X đang online&quot;. Cách hiển nhiên có vẻ đúng và chạy tốt ở 10 user. Nó vỡ ở 10.000, và kho này có comment ghi lại: &quot;O(N²) storm during deploy reconnects&quot;.</p>

<h3>Phiên bản ngây thơ</h3>
<pre><code class="language-ts">io.on('connection', (socket) =&gt; {
  const userId = socket.data.userId;
  onlineUserIds.add(userId);

  // NGAY THO: broadcast den TAT CA
  io.emit('presence:update', { userId, online: true });

  socket.on('disconnect', () =&gt; {
    onlineUserIds.delete(userId);
    io.emit('presence:update', { userId, online: false });
  });
});
</code></pre>

<h3>Phân tích cost</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1 user connect</span><span class="lz-t">1 event × N người nhận</span><span class="lz-d">Với N=10.000 sockets kết nối, mỗi connect là 10.000 packet cần gửi. OK, tổng 100 KB.</span></div>
<div class="lz-step"><span class="lz-k">N user connect</span><span class="lz-t">N × N = N² packets</span><span class="lz-d">Với N=10.000 và tất cả reconnect cùng lúc (deploy): 100.000.000 packet. Ở 60 byte/packet là 6 GB traffic — trong vài giây. <strong>Đo thật:</strong> deploy bằng <code>kill -9</code> thì không gói offline nào được phát, và lượt nối lại thứ k chạm k socket đã về — đúng N(N+1)/2 (500.500 ở N=1.000; 2.001.000 ở N=2.000), tức ~50 triệu ở N=10.000; một khung 73–75 B ⇒ ~3,8 GB.</span></div>
<div class="lz-step"><span class="lz-k">CPU cost</span><span class="lz-t">JSON.stringify × N²</span><span class="lz-d">Node encode payload N² lần. Với ~2μs/serialize, 100M × 2μs = 200 giây CPU. Trên 8 core: 25 giây latency. <strong>Đo thật — sai cơ chế:</strong> một <code>io.emit</code> tới 1.000 socket gọi <code>JSON.stringify</code> MỘT lần; cái tốn là phần ghi cho từng socket — 10.859 ms CPU server cho 2.001.000 gói ≈ 5,4 µs/gói ⇒ ~270 s ở N=10.000. Và JavaScript của một tiến trình Node chạy trên MỘT lõi: 8 lõi không chia việc này.</span></div>
</div>

<div class="out">Deploy scenario:
  Truoc deploy: 10.000 socket online
  Deploy: server restart, 10.000 disconnect + 10.000 reconnect
  Presence update: 20.000 events, moi cai duoc emit den 10.000 client
  Tong: 200.000.000 packet trong ~10 giay
  = 20 trieu packets/second
  = server dead
</div>

<h3>Comment thật của kho này</h3>
<pre><code class="language-ts">// messaging.socket.ts:188-206
/**
 * Emit a presence update ONLY to the given audience (their per-user
 * rooms), instead of io.emit to every connected socket. The FE only
 * ever renders presence for friends (ActiveNowRow) and chat peers
 * (ThreadList / MiniChatDock / ChatInfoPanel / /messages), so a global
 * broadcast was O(all sockets) per connect/disconnect — an O(N²) storm
 * during deploy reconnects. audience = friends ∪ thread peers.
 */
function emitPresenceTo(
  audience: number[],
  payload: { userId: number; online: boolean; lastSeen: number },
): void {
  for (const uid of audience) {
    io?.to(&#96;user:\${uid}&#96;).emit('presence:update', payload);
  }
}
</code></pre>

<div class="callout ok">
<p><strong>Comment này từ đâu ra (kiểm 13/11/2026):</strong> commit <code>331745e72</code> (10/07/2026, đợt tối ưu &quot;P2-1a&quot;) chuyển presence từ <code>io.emit</code> / <code>socket.broadcast</code> sang <code>emitPresenceTo(audience)</code>. Dòng O(N²) là <em>phân tích</em> của commit đó — commit không kèm số đo nào; mục 🔬 bên dưới mới đo. Ngày 22/10/2026 <code>39eb43755</code> gỡ nốt hai đường lùi về phát toàn cục mà bản sửa còn giữ. Cost giảm từ N² xuống N × |audience| — với audience trung bình 30 người, thì factor giảm ~333× ở N=10.000 (đo trong bão: tỉ lệ = N/30 — 33× ở 1.000, 67× ở 2.000).</p>
</div>

<h3>Ước lượng ở kho này</h3>
<div class="out">N = 10.000 online users (uoc luong tuong lai)
audience (friends + thread peers) trung binh: 30 nguoi

NGAYTHO: 10.000 connect * 10.000 receivers = 100.000.000 packets
VA:      10.000 connect *     30 receivers =     300.000 packets

Tiet kiem: 333x tren luot event
Deploy storm giam tu ~5 phut server dead xuong ~1 giay lag nho
</div>

<h3>Vì sao &quot;chỉ không emit disconnect&quot; không đủ</h3>
<pre><code class="language-ts">// Y tuong kem: chi emit connect, khong disconnect (presence tu decay)
io.on('connection', (socket) =&gt; {
  io.emit('presence:update', { userId, online: true });
  // KHONG emit disconnect
});

// Cost: 50% van la N x N = N^2. Van kem.
</code></pre>

<p>Giảm 2× không giải quyết vấn đề O — vẫn O(N²). Cần thay THUẬT toán, không chỉ trim constant. <strong>Đo thật:</strong> deploy bằng <code>kill -9</code> thì tiến trình chết không phát offline nào — cả cơn bão là nửa reconnect, nên bỏ emit disconnect chẳng tiết kiệm gì ở đây.</p>

<div class="pitfall">
<p><strong>Bẫy — nghĩ 10.000 user là &quot;quá scale&quot; không quan tâm hôm nay.</strong> Giả sử kho có ~200 user online (ước lượng, không phải số đo). Nhưng deploy storm scale hàm N² của <em>current N</em>, không target N. Một cơn bão ở 200 là 200·201/2 = 20.100 packet. Vẫn dễ handle. Ở 2.000 là 2.001.000 packet — đo thật: ~11 s CPU server, 1.646 lần nối hỏng, đuôi bão 10,8 s. Vấn đề bung khi bạn ít khi để ý, không phải khi bạn đợi.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Presence ngây thơ <code>io.emit</code> là O(N²) — với N=10.000 và deploy reconnect storm là 100 triệu packet trong vài giây (server dead), và fix của kho này (<code>emitPresenceTo(audience)</code>, audience ≈ 30) giảm 333× xuống ~300k packet — comment kho là phân tích, phép đo 🔬 bên dưới mới là bằng chứng.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Viết presence ngây thơ dùng <code>io.emit</code> ở mỗi connect/disconnect và tính số packet cho một reconnect storm ở N=100, 1.000 và 10.000 — thấy tăng theo N².</li>
<li>Thay bằng <code>emitPresenceTo(audience)</code> với audience ~30 và tính lại; để ý mức giảm ~333×.</li>
<li>Tìm comment và commit của nó (<code>git log -S &quot;O(N²) storm&quot;</code>) rồi tự quyết: phân tích hay số đo? Sau đó tự đo (🔁 bên dưới).</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chỉ ra được vì sao presence <code>io.emit</code> là O(N²) và cách nhắm audience làm nó gần như tuyến tính.</p></div>

<h3>🔬 Đo thật: một lần deploy (kill -9) với 100 / 1.000 / 2.000 client</h3>
<p>socket.io 4.8.3, Node 22, trên máy của khoá — N client online, tiến trình server bị giết bằng SIGKILL, tiến trình mới lên, cả N client tự nối lại. Đếm ở client:</p>
<div class="out">$ node bao.mjs
io.emit        N= 100 · nối lại 100 · gói nhận     5.050 · 0,4 MB · CPU server   135 ms · dải 0,9 s · lỗi nối 0
io.emit        N=1000 · nối lại 1000 · gói nhận   500.500 · 37,5 MB · CPU server 2.782 ms · dải 4,0 s · lỗi nối 198
io.emit        N=2000 · nối lại 2000 · gói nhận 2.001.000 · 151,0 MB · CPU server 10.859 ms · dải 10,8 s · lỗi nối 1646
emitPresenceTo N= 100 · nối lại 100 · gói nhận     1.500 · 0,1 MB · CPU server   112 ms · dải 0,9 s · lỗi nối 0
emitPresenceTo N=1000 · nối lại 1000 · gói nhận    15.000 · 1,2 MB · CPU server   521 ms · dải 1,0 s · lỗi nối 0
emitPresenceTo N=2000 · nối lại 2000 · gói nhận    30.000 · 2,3 MB · CPU server   946 ms · dải 1,0 s · lỗi nối 0</div>
<p><code>io.emit</code>: đúng N(N+1)/2 (lượt nối lại thứ k chạm k socket đã về). Audience 30: đúng 15N (mỗi cặp bạn trao nhau một gói). CPU server ≈ 5,4 µs mỗi gói ghi ra. Lúc server bận ghi, hàng chờ listen (128) tràn: nối lại hỏng và đuôi bão dài.</p>
<p><strong>Payload được mã hoá mấy lần?</strong></p>
<div class="out">$ node mahoa.mjs
io.emit tới 1000 socket      ⇒ JSON.stringify 1 lần · ghi 1000 gói
emitPresenceTo: 30 lượt io.to(user:x) ⇒ JSON.stringify 30 lần · ghi 30 gói
một lượt io.to([30 room])        ⇒ JSON.stringify 1 lần · ghi 30 gói
một khung trên dây: 42["presence:update",{"userId":7,"online":true,"lastSeen":1794556393811}] = 73 byte</div>
<p><strong>Một tab trình duyệt nhận những gì</strong> (Chromium: tab của An có 3 bạn, 60 người lạ cùng 3 bạn vào rồi ra): <code>io.emit</code> ⇒ 127 khung presence (121 khung về người lạ, kể cả tiếng vọng của chính An); <code>emitPresenceTo(audience)</code> ⇒ 6.</p>
<p><strong>Kho này:</strong></p>
<div class="out">$ grep -n "O(N²)" -B5 -A1 src/socket/messaging.socket.ts
188-/**
189- * Emit a presence update ONLY to the given audience (their per-user
190- * rooms), instead of &#96;io.emit&#96; to every connected socket. The FE only
191- * ever renders presence for friends (ActiveNowRow) and chat peers
192- * (ThreadList / MiniChatDock / ChatInfoPanel / /messages), so a global
193: * broadcast was O(all sockets) per connect/disconnect — an O(N²) storm
194- * during deploy reconnects. &#96;audience&#96; = friends ∪ thread peers.
$ git log --format='%h %ad %s' --date=short -S "O(N²) storm" -- src/socket/messaging.socket.ts
331745e72 2026-07-10 perf(realtime): scope presence:update to friends + chat peers, not every socket (P2-1a)
$ git show 39eb43755 -- src/socket/messaging.socket.ts | grep "^-.*\\(broadcast.emit\\|io?.emit\\)"
-          socket.broadcast.emit('presence:update', {
-          io?.emit('presence:update', payload);
$ grep -n "chỉ phát lúc" -A3 frontend/src/lib/api.ts
3394:   * Vì sao cần, khi đã có socket &#96;presence:update&#96;: sự kiện đó chỉ phát lúc
3395-   * ai đó ĐỔI trạng thái. Vừa mở app thì chưa ai vừa đổi cả, nên nếu chỉ
3396-   * nghe socket thì mọi người đều hiện "Ngoại tuyến" cho tới khi có người
3397-   * tình cờ nối/ngắt. Trường này là ẢNH CHỤP lúc mở; socket lo phần sau đó.</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-javascript"><span class="tok-comment">// Server presence (tiến trình con, để đo CPU riêng). kieu = 'tho' (io.emit cho TẤT CẢ) | 'aud' (emitPresenceTo: 30 bạn).</span>
import { Server } from 'socket.io';
const [kieu, n] = process.argv.slice(2); const N = +n;
const io = new Server(19650);
<span class="tok-comment">// 30 bạn đối xứng: u±1 … u±15 (vòng tròn) — giả lập "bạn bè ∪ người cùng chat"</span>
const ban = (u) =&gt; { const r = []; for (let k = 1; k &lt;= 15; k++) r.push((u + k) % N, (u - k + N) % N); return r; };
const emitPresenceTo = (audience, p) =&gt; { for (const v of audience) io.to(&#96;user:\${v}&#96;).emit('presence:update', p); };
io.on('connection', (s) =&gt; {
  const u = s.handshake.auth.user; s.join(&#96;user:\${u}&#96;);
  const p = { userId: u, online: true, lastSeen: Date.now() };
  if (kieu === 'tho') io.emit('presence:update', p); else emitPresenceTo(ban(u), p);
});
let c0 = process.cpuUsage();
process.on('message', (m) =&gt; {
  if (m === 'bat-dau') { c0 = process.cpuUsage(); process.send('ok'); }
  if (m === 'do') { const c = process.cpuUsage(c0); process.send((c.user + c.system) / 1000); }
});
io.httpServer.once('listening', () =&gt; process.send('san-sang'));</code></pre>
<pre><code class="language-javascript"><span class="tok-comment">// Bão nối lại khi deploy: N client đang online → GIẾT server (kill -9) → server mới lên → N client tự nối lại cùng lúc.</span>
<span class="tok-comment">// Đếm THẬT ở client: bao nhiêu gói presence:update tới, bao nhiêu byte, CPU server mới tốn bao nhiêu.</span>
import { fork } from 'node:child_process';
import { io as ketNoi } from 'socket.io-client';
const so = (x) =&gt; x.toLocaleString('vi-VN');
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
const hoi = (m, lenh) =&gt; new Promise((r) =&gt; { m.once('message', r); m.send(lenh); });
const moi = (kieu, N) =&gt; new Promise((r) =&gt; { const m = fork('./may41.mjs', [kieu, String(N)]); m.once('message', () =&gt; r(m)); });
for (const [kieu, ten] of [['tho', 'io.emit       '], ['aud', 'emitPresenceTo']]) {
  for (const N of [100, 1000, 2000]) {
    let may = await moi(kieu, N);
    let nhan = 0, byte = 0, dau = 0, cuoi = 0, vao = 0, loi = 0, dangDo = false; const rot = {};
    const ds = [];
    for (let i = 0; i &lt; N; i++) {
      const c = ketNoi('http://localhost:19650', { auth: { user: i }, transports: ['websocket'], forceNew: true });
      c.on('presence:update', () =&gt; { nhan++; cuoi = performance.now(); dau ||= cuoi; });
      c.io.on('reconnect', () =&gt; vao++);
      c.io.on('reconnect_error', () =&gt; loi++);
      c.on('disconnect', (ly) =&gt; { if (dangDo) rot[ly] = (rot[ly] ?? 0) + 1; });
      c.io.on('open', () =&gt; c.io.engine.on('packet', (p) =&gt; { if (p.type === 'message') byte += Buffer.byteLength(p.data) + 1; }));
      ds.push(c);
    }
    await Promise.all(ds.map((c) =&gt; (c.connected ? 0 : new Promise((r) =&gt; c.once('connect', r)))));
    await cho(1500);
    may.kill('SIGKILL');                     <span class="tok-comment">  // deploy: tiến trình cũ chết, KHÔNG kịp phát offline</span>
    await cho(200);
    nhan = 0; byte = 0; dau = 0; cuoi = 0; vao = 0; loi = 0; dangDo = true;
    may = await moi(kieu, N); await hoi(may, 'bat-dau');
    while (vao &lt; N || performance.now() - cuoi &lt; 800) await cho(200);
    const cpu = await hoi(may, 'do');
    console.log(&#96;\${ten} N=\${String(N).padStart(4)} · nối lại \${vao} · gói nhận \${so(nhan).padStart(9)} · \${(byte / 1e6).toFixed(1).replace('.', ',')} MB · CPU server \${so(Math.round(cpu)).padStart(5)} ms · dải \${((cuoi - dau) / 1000).toFixed(1).replace('.', ',')} s · lỗi nối \${loi}\${Object.keys(rot).length ? ' · rớt ' + JSON.stringify(rot) : ''}&#96;);
    may.kill('SIGKILL'); ds.forEach((c) =&gt; c.close()); await cho(300);
  }
}
process.exit(0);</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-2-4-chan-event-loop" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 2.4 — Chặn event loop: đo bằng số thật</span><span class="lc-sub">Vì sao server bận không nhận nổi kết nối mới</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-2-ws-vs-socketio-rooms" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 11.2 — ws hay Socket.IO: cái giá của sự tiện nghi</span><span class="lc-sub">io.emit đánh thức 2.000 socket; io.to(room) chỉ đánh thức room</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Presence</span><span class="v">Trạng thái online/offline (và last-seen) phát cho những user quan tâm.</span></div>
  <div class="kv"><span class="k">O(N²)</span><span class="v">Mỗi user báo cho mọi user — cost tăng theo bình phương số user.</span></div>
  <div class="kv"><span class="k">Reconnect storm</span><span class="v">Một deploy rớt mọi client cùng lúc; tất cả reconnect và báo lại.</span></div>
  <div class="kv"><span class="k"><code>io.emit</code> (ngây thơ)</span><span class="v">Broadcast presence cho tất cả — nguồn của cú bung N².</span></div>
  <div class="kv"><span class="k"><code>emitPresenceTo(audience)</code></span><span class="v">Gửi presence chỉ cho ~30 user thật sự quan tâm.</span></div>
  <div class="kv"><span class="k">Audience</span><span class="v">Tập nhỏ thật sự cần presence của một user cho trước.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Presence <code>io.emit</code> ngây thơ là O(N²): tất cả báo cho tất cả.</li><li>Ở N=10.000 một reconnect storm là ~100 triệu packet trong vài giây — server chết.</li><li>Nhắm một audience (~30) bằng <code>emitPresenceTo</code> giảm ~333× xuống ~300k packet.</li><li>Cái lợi là từ thu nhỏ audience, không phải payload.</li><li>Đo thật: một io.emit mã hoá một lần; cái tốn là phần ghi cho từng socket (~5,4 µs), trên một lõi.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Broadcasting messages</span><span class="lc-sub">socket.io/docs/v4/broadcasting-events — chi tiết cost của io.emit vs io.to.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Bài 4.2 — bảng friends</span><span class="lc-sub">/courses/socket-io/learn${REF} — cách lấy audience nhanh (query cache).</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 4.2 ─────────────────────────── */
    {
      title: '4.2 — Audience: computing who cares|||4.2 — Audience: tính ai cần biết',
      slug: 'io-4-2-audience',
      type: 'VIDEO',
      description: 'Audience = friends ∪ thread peers. Cache trong Redis; invalidate khi friend add/remove hoặc thread join/leave. Không compute mỗi connect/disconnect.',
      content: `
${G04_2}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>Audience: computing who cares</h2>
<p class="lead">Lesson 4.1 pointed at <code>emitPresenceTo(audience)</code>. This lesson answers: what is that audience, how do you compute it fast, and where does it come from?</p>

<h3>Definition</h3>
<pre><code class="language-ts">// Ai can biet user X online/offline?
audience(X) = friends(X) &cup; threadPeers(X)

// friends(X) = ban be double-following
// threadPeers(X) = user chung mot cuoc chat DM
</code></pre>

<p>This repo's UI renders presence in only 4 places (the comment quoted in 4.1): <code>ActiveNowRow</code> (friends), <code>ThreadList</code>/<code>MiniChatDock</code>/<code>ChatInfoPanel</code>/<code>/messages</code> (chat peers). Nobody else needs to know. That is the audience. <strong>Since 22/10/2026 (39eb43755) the repo also filters it:</strong> minus people blocked in either direction, minus accounts with the active status switched off (both ways), minus disabled accounts — a presence event is private data.</p>

<h3>The naive computation — slow if it runs on every connect</h3>
<pre><code class="language-ts">async function getAudience(userId: number): Promise&lt;number[]&gt; {
  const friends = await prisma.friendship.findMany({
    where: { OR: [{ userAId: userId }, { userBId: userId }], status: 'ACCEPTED' },
  });
  const threads = await prisma.messageThread.findMany({
    where: { participants: { some: { userId } } },
    include: { participants: true },
  });
  const peers = new Set&lt;number&gt;();
  friends.forEach(f =&gt; peers.add(f.userAId === userId ? f.userBId : f.userAId));
  threads.forEach(t =&gt; t.participants.forEach(p =&gt; p.userId !== userId && peers.add(p.userId)));
  return [...peers];
}

// Cost: 2 query, ~10-20ms
// Chay moi connect/disconnect: 10.000 user * 20ms = 200 giay CPU tren deploy
// DO THAT 13/11: thoi gian DB khong phai CPU Node; pool 21 ket noi => bao 10.000 = 3,1 s (19.979 query xep hang)
</code></pre>

<div class="callout warn">
<p><strong>Computing the audience on every connect is an O(N) DB query.</strong> In a deploy storm that is 10,000 queries in a few seconds — the Prisma pool drains and DB CPU hits 100%. You need a CACHE. <strong>Measured (local Postgres, pool 21 = Prisma&#39;s default on 10 cores):</strong> 10,000 at once took 3.1 s with up to 19,979 queries queued; a warm Redis served all 10,000 in 83 ms.</p>
</div>

<h3>Cache trong Redis</h3>
<pre><code class="language-ts">const AUD_TTL = 300; // 5 phut

async function getAudienceCached(userId: number): Promise&lt;number[]&gt; {
  const key = &#96;presence:audience:\${userId}&#96;;
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const fresh = await getAudience(userId);
  await redis.setex(key, AUD_TTL, JSON.stringify(fresh));
  return fresh;
}

// Cost sau warm-up: ~1ms (redis GET)
// Deploy storm: 10.000 * 1ms = 10 giay chi phi audience compute
// DO THAT 13/11: 10.000 GET dong thoi tren 1 ket noi = 83 ms (khong cong don tuan tu)
</code></pre>

<h3>When to invalidate</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">friend added/removed</span><span class="lz-d">Invalidate both users: <code>redis.del(&#96;presence:audience:\${a}&#96;, &#96;presence:audience:\${b}&#96;)</code>.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">thread created / participant added</span><span class="lz-d">Invalidate every participant of that thread.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">a 5-minute TTL</span><span class="lz-d">A backstop for when invalidation is missed (a bug, a race). The trade: at most 5 minutes of staleness, which is acceptable for presence.</span></div>
</div>

<h3>Alternative: precomputed table</h3>
<pre><code class="language-sql">-- Materialized audience per user
CREATE TABLE presence_audience (
  user_id       INT NOT NULL,
  audience_user INT NOT NULL,
  PRIMARY KEY (user_id, audience_user)
);
-- Populated on friend/thread changes; queried at connect
</code></pre>

<p>That is a different trade: write-heavy (every friend/thread change is N writes), read-fast (one index-backed query). With a read/write ratio around 100:1 a cache is usually the healthier option. <strong>Checked 13/11/2026: this repo has NO audience cache</strong> (<code>grep -rn &quot;presence:audience&quot; src/</code> = 0) — it computes the audience on every connect (2 queries in messaging.socket.ts + 2 in presencePrivacy.ts) and pins it on <code>socket.data.presenceAudience</code>, reused at disconnect: staleness = the life of the socket.</p>

<div class="pitfall">
<p><strong>Trap — forgetting to invalidate the cache when one user blocks another.</strong> A block means removing the friend and leaving every shared thread. If invalidation is incomplete, the ex-friend keeps receiving presence updates for ~5 minutes. A very subtle bug, because users block rarely and tests usually miss it. <strong>Measured with the repo&#39;s pattern</strong> (audience pinned at connect): a block made mid-session is ignored — the blocked user still received <code>{ userId: 42, online: false }</code> when the other closed the tab; re-filtering at disconnect sent nothing.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> The audience is friends ∪ thread peers, cached for 5 minutes in Redis (1ms per read once warm), invalidated on friend/thread changes with a TTL backstop — cutting the audience-computation cost for a 10k-user deploy storm from 200s to 10s, at the acceptable price of ≤5 minutes of presence staleness. (Measured wall time: 3.1 s → 83 ms — the 200 s / 10 s figures add calls up serially.)</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Compute one user's audience as friends ∪ thread peers and confirm it is a small set, not the whole user base.</li>
<li>Cache that audience in Redis with a 5-minute TTL and measure the read cost once warm (~1ms).</li>
<li>Invalidate the cache on a friend/thread change and confirm the TTL still acts as a backstop if you miss an invalidation.</li>
</ol>
<p><strong>Done when:</strong> you can produce an audience set from a cache in ~1ms and explain the ≤5-minute staleness trade.</p></div>

<h3>🔬 Measured: Postgres + Redis, 10,000 users</h3>
<p>Postgres 16 and Redis 7 in containers on the course machine; 10,000 users, 20 friends + 10 chat peers each (audience 30); the same four queries in two rounds as the repo. One call, idle database:</p>
<div class="out">$ node mot.mjs
1.000 lượt tuần tự · audience TB 30 người · p50 1,16 ms · p99 2,00 ms · 4 truy vấn/lượt</div>
<p><strong>A deploy storm</strong> — everyone needs an audience at once, pool of 21:</p>
<div class="out">$ node bao42.mjs
DB, không cache   N= 2000 · xong sau   622 ms · p50   467 ms · chậm nhất   613 ms · truy vấn xếp hàng chờ pool ≤ 3.979
DB, không cache   N=10000 · xong sau 3.093 ms · p50 2.332 ms · chậm nhất 3.071 ms · truy vấn xếp hàng chờ pool ≤ 19.979
Redis ấm (GET)    N= 2000 · xong sau  18,8 ms · p50   9,4 ms · chậm nhất  15,6 ms · truy vấn xếp hàng chờ pool ≤ 0
Redis ấm (GET)    N=10000 · xong sau  83,4 ms · p50  39,8 ms · chậm nhất  67,3 ms · truy vấn xếp hàng chờ pool ≤ 0</div>
<p><strong>Cache-aside, and forgetting to invalidate:</strong></p>
<div class="out">$ node cache.mjs
lần 1 (miss → DB):  15,96 ms · 30 người
lần 2 (hit → Redis): 0,70 ms · TTL còn 300 s
— 42 kết bạn với 5000, QUÊN invalidate —
audience(42) có 5000? false  ← cũ, tới khi TTL hết
— invalidate CẢ HAI: DEL presence:audience:42 presence:audience:5000 —
audience(42) có 5000? true · audience(5000) có 42? true</div>
<p><strong>The block that does not stick</strong> — the repo&#39;s pattern (audience pinned at connect), then re-filtered at disconnect:</p>
<div class="out">$ node chan.mjs
Bình (43) chặn An (42) lúc 08:10:31 · dùng audience chốt lúc connect
Bình nhận sau khi chặn: [{"userId":42,"online":false}]
$ LOC_LAI=1 node chan.mjs
Bình (43) chặn An (42) lúc 08:10:32 · lọc LẠI lúc ngắt
Bình nhận sau khi chặn: không gì cả ✓</div>
<p><strong>This repo</strong> (no cache — computed per connect, pinned on the socket):</p>
<div class="out">$ grep -n "messageThread.findMany\\|friendship.findMany\\|presenceAudience = await\\|presenceAudience as" src/socket/messaging.socket.ts
393:          prisma.messageThread.findMany({
402:          prisma.friendship.findMany({
419:        socket.data.presenceAudience = await phatTrangThaiKhiNoi({
567:        const audience = socket.data.presenceAudience as number[] | undefined;
$ grep -n "export async function presenceAudience" -A9 src/services/presencePrivacy.ts
179:export async function presenceAudience(userId: number, candidateIds: number[]): Promise&lt;number[]&gt; {
180-  const ids = [...new Set(candidateIds.filter((id) =&gt; id !== userId))];
181-  if (!ids.length) return [];
182-  const [blocked, rows] = await Promise.all([
183-    blockedBetween(userId, ids),
184-    prisma.user.findMany({ where: { id: { in: ids }, enabled: true, showActiveStatus: true }, select: { id: true } }),
185-  ]);
186-  const ok = new Set(rows.map((r) =&gt; r.id));
187-  return ids.filter((id) =&gt; ok.has(id) &amp;&amp; !blocked.has(id));
188-}
$ grep -rn "presence:audience" src/ | wc -l
       0</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-javascript"><span class="tok-comment">// audience(X) = (bạn bè ∪ người cùng chat) − bị chặn − tắt trạng thái − tài khoản khoá. Bốn truy vấn, hai vòng song song — y như kho.</span>
import pg from 'pg';
export const pool = new pg.Pool({ connectionString: 'postgres://postgres:lab@127.0.0.1:19660/postgres', max: 21 }); // = mặc định Prisma trên máy 10 lõi: 10×2+1
export async function getAudience(u) {
  const [f, t] = await Promise.all([
    pool.query(&#96;SELECT requester_id a, addressee_id b FROM friendships WHERE status = 'ACCEPTED' AND (requester_id = $1 OR addressee_id = $1)&#96;, [u]),
    pool.query(&#96;SELECT user_a_id a, user_b_id b FROM message_threads WHERE user_a_id = $1 OR user_b_id = $1&#96;, [u]),
  ]);
  const ung = [...new Set([...f.rows, ...t.rows].map((r) =&gt; (r.a === u ? r.b : r.a)))];
  const [chan, ok] = await Promise.all([
    pool.query(&#96;SELECT blocker_id, blocked_id FROM user_blocks WHERE (blocker_id = $1 AND blocked_id = ANY($2)) OR (blocked_id = $1 AND blocker_id = ANY($2))&#96;, [u, ung]),
    pool.query(&#96;SELECT id FROM users WHERE id = ANY($1) AND enabled AND show_active_status&#96;, [ung]),
  ]);
  const bi = new Set(chan.rows.map((r) =&gt; (r.blocker_id === u ? r.blocked_id : r.blocker_id)));
  const sang = new Set(ok.rows.map((r) =&gt; r.id));
  return ung.filter((v) =&gt; sang.has(v) &amp;&amp; !bi.has(v));
}</code></pre>
<pre><code class="language-javascript"><span class="tok-comment">// Mẫu của kho: audience tính MỘT lần lúc connect, cất ở socket.data, dùng lại lúc disconnect.</span>
<span class="tok-comment">// Bình (43) đang online thì chặn An (42). An đóng tab ⇒ Bình có còn nhận presence của An?</span>
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
import { getAudience, pool } from './audience.mjs';
const io = new Server(19662);
io.on('connection', async (s) =&gt; {
  const u = s.handshake.auth.user; s.join(&#96;user:\${u}&#96;);
  s.data.aud = await getAudience(u);                     <span class="tok-comment">  // chốt lúc connect</span>
  s.on('disconnect', async () =&gt; {
    const aud = process.env.LOC_LAI ? await getAudience(u) : s.data.aud; <span class="tok-comment">  // LOC_LAI=1 ⇒ lọc lại lúc ngắt</span>
    for (const v of aud) io.to(&#96;user:\${v}&#96;).emit('presence:update', { userId: u, online: false });
  });
  s.emit('san-sang');
});
const binh = ketNoi('http://localhost:19662', { auth: { user: 43 }, transports: ['websocket'] });
const nhan = []; binh.on('presence:update', (p) =&gt; nhan.push(p));
await new Promise((r) =&gt; binh.on('san-sang', r));
const an = ketNoi('http://localhost:19662', { auth: { user: 42 }, transports: ['websocket'], forceNew: true });
await new Promise((r) =&gt; an.on('san-sang', r));
await pool.query('INSERT INTO user_blocks VALUES (43, 42)');
console.log(&#96;Bình (43) chặn An (42) lúc \${new Date().toISOString().slice(11, 19)} · \${process.env.LOC_LAI ? 'lọc LẠI lúc ngắt' : 'dùng audience chốt lúc connect'}&#96;);
an.disconnect(); await new Promise((r) =&gt; setTimeout(r, 400));
console.log(&#96;Bình nhận sau khi chặn: \${nhan.length ? JSON.stringify(nhan) : 'không gì cả ✓'}&#96;);
await pool.query('DELETE FROM user_blocks'); await pool.end(); process.exit(0);</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-6-1-bon-khuon" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 6.1 — Four caching patterns, and which one you are using</span><span class="lc-sub">Cache-aside is one of them</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-6-4-nhat-quan" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 6.4 — Consistency: when the cache and the database disagree</span><span class="lc-sub">Exactly the stale-audience problem</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-7-1-ket-noi-va-pool" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 7.1 — What one database connection really costs</span><span class="lc-sub">Why a pool exists, and why it queues</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Audience</span><span class="v">friends ∪ thread peers — the users who need a given user's presence.</span></div>
  <div class="kv"><span class="k">Cache (Redis)</span><span class="v">Store the computed audience for fast repeated reads (~1ms warm).</span></div>
  <div class="kv"><span class="k">TTL</span><span class="v">A time-to-live that expires the cache even if no invalidation fires.</span></div>
  <div class="kv"><span class="k">Invalidation</span><span class="v">Dropping the cache entry when friends or threads change.</span></div>
  <div class="kv"><span class="k">TTL backstop</span><span class="v">The TTL that bounds staleness if an invalidation is missed.</span></div>
  <div class="kv"><span class="k">Staleness</span><span class="v">How out-of-date the cached audience may be (≤5 min here).</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>The audience is friends ∪ thread peers, not the whole user base.</li><li>Cache it in Redis for 5 minutes — once warm, a read is ~1ms.</li><li>Invalidate on friend/thread changes, with the TTL as a backstop.</li><li>Measured: a 10k-user storm takes 3.1 s from the database (pool-bound) vs 83 ms from a warm Redis.</li><li>The price is ≤5 minutes of presence staleness, which is acceptable here.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Redis — Caching patterns</span><span class="lc-sub">redis.io/docs/manual/patterns/twemproxy — cache-aside, đủ cho use case này.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">CuongThai's Redis keys</span><span class="lc-sub">/courses/redis/learn${REF} — pattern cache-aside chi tiết, kèm invalidation strategies.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Audience: tính ai cần biết</h2>
<p class="lead">Bài 4.1 trỏ đến <code>emitPresenceTo(audience)</code>. Bài này trả lời: audience đó là gì, làm sao tính nhanh, và nó đến từ đâu?</p>

<h3>Định nghĩa</h3>
<pre><code class="language-ts">// Ai can biet user X online/offline?
audience(X) = friends(X) &cup; threadPeers(X)

// friends(X) = ban be double-following
// threadPeers(X) = user chung mot cuoc chat DM
</code></pre>

<p>UI của kho render presence chỉ ở 4 chỗ (comment nêu ở 4.1): <code>ActiveNowRow</code> (bạn), <code>ThreadList</code>/<code>MiniChatDock</code>/<code>ChatInfoPanel</code>/<code>/messages</code> (chat peers). Không ai khác cần biết. Đó là audience. <strong>Từ 22/10/2026 (39eb43755) kho còn lọc thêm:</strong> trừ người chặn hoặc bị chặn, trừ tài khoản tắt trạng thái hoạt động (đối ứng), trừ tài khoản bị khoá — presence là dữ liệu riêng tư.</p>

<h3>Ngây thơ compute — chậm nếu chạy mỗi connect</h3>
<pre><code class="language-ts">async function getAudience(userId: number): Promise&lt;number[]&gt; {
  const friends = await prisma.friendship.findMany({
    where: { OR: [{ userAId: userId }, { userBId: userId }], status: 'ACCEPTED' },
  });
  const threads = await prisma.messageThread.findMany({
    where: { participants: { some: { userId } } },
    include: { participants: true },
  });
  const peers = new Set&lt;number&gt;();
  friends.forEach(f =&gt; peers.add(f.userAId === userId ? f.userBId : f.userAId));
  threads.forEach(t =&gt; t.participants.forEach(p =&gt; p.userId !== userId && peers.add(p.userId)));
  return [...peers];
}

// Cost: 2 query, ~10-20ms
// Chay moi connect/disconnect: 10.000 user * 20ms = 200 giay CPU tren deploy
// DO THAT 13/11: thoi gian DB khong phai CPU Node; pool 21 ket noi => bao 10.000 = 3,1 s (19.979 query xep hang)
</code></pre>

<div class="callout warn">
<p><strong>Compute audience mỗi connect là O(N) query DB.</strong> Trong deploy storm, đó là 10.000 query trong vài giây — Prisma pool cạn, DB CPU 100%. Cần CACHE. <strong>Đo thật (Postgres cục bộ, pool 21 = mặc định Prisma trên máy 10 lõi):</strong> 10.000 cùng lúc mất 3,1 s, có lúc 19.979 truy vấn xếp hàng chờ pool; Redis ấm trả đủ 10.000 trong 83 ms.</p>
</div>

<h3>Cache trong Redis</h3>
<pre><code class="language-ts">const AUD_TTL = 300; // 5 phut

async function getAudienceCached(userId: number): Promise&lt;number[]&gt; {
  const key = &#96;presence:audience:\${userId}&#96;;
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const fresh = await getAudience(userId);
  await redis.setex(key, AUD_TTL, JSON.stringify(fresh));
  return fresh;
}

// Cost sau warm-up: ~1ms (redis GET)
// Deploy storm: 10.000 * 1ms = 10 giay chi phi audience compute
// DO THAT 13/11: 10.000 GET dong thoi tren 1 ket noi = 83 ms (khong cong don tuan tu)
</code></pre>

<h3>Invalidate khi nào</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">friend added/removed</span><span class="lz-d">Invalidate cả hai user: <code>redis.del(&#96;presence:audience:\${a}&#96;, &#96;presence:audience:\${b}&#96;)</code>.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">thread created / participant added</span><span class="lz-d">Invalidate tất cả participants của thread đó.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">TTL 5 phút</span><span class="lz-d">Backstop nếu invalidate miss (bug, race). Trade off: staleness tối đa 5 phút, chấp nhận được cho presence.</span></div>
</div>

<h3>Alternative: precomputed table</h3>
<pre><code class="language-sql">-- Materialized audience per user
CREATE TABLE presence_audience (
  user_id       INT NOT NULL,
  audience_user INT NOT NULL,
  PRIMARY KEY (user_id, audience_user)
);
-- Populated on friend/thread changes; queried at connect
</code></pre>

<p>Đây là tradeoff khác: write-heavy (mỗi friend/thread change là N write), read-fast (một query index-based). Với tỉ lệ đọc/ghi ~100:1 thì cache thường lành hơn. <strong>Kiểm 13/11/2026: kho này KHÔNG cache audience</strong> (<code>grep -rn &quot;presence:audience&quot; src/</code> = 0) — kho tính audience mỗi lần connect (2 truy vấn ở messaging.socket.ts + 2 ở presencePrivacy.ts) rồi chốt vào <code>socket.data.presenceAudience</code>, dùng lại lúc disconnect: độ cũ = suốt đời socket.</p>

<div class="pitfall">
<p><strong>Bẫy — quên invalidate cache khi user block user khác.</strong> Block = remove friend + rời tất thread chung. Nếu invalidate không đầy đủ, ex-friend vẫn nhận presence updates ~5 phút. Bug rất tinh vi vì hiếm khi user block; test thường không bắt. <strong>Đo với đúng mẫu của kho</strong> (audience chốt lúc connect): chặn giữa phiên bị bỏ qua — người đã chặn vẫn nhận <code>{ userId: 42, online: false }</code> khi người kia đóng tab; lọc lại lúc ngắt thì không nhận gì.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Audience = friends ∪ thread peers, cache 5 phút trong Redis (1ms per read sau warm-up), invalidate khi friend/thread change + TTL backstop — giảm cost compute audience từ 200s cho deploy storm 10k user xuống 10s, và trade off staleness ≤5 phút chấp nhận được cho presence. (Đo thời gian thật: 3,1 s → 83 ms — con số 200 s / 10 s là cộng dồn tuần tự.)</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Tính audience của một user là friends ∪ thread peers và xác nhận đó là một tập nhỏ, không phải toàn bộ người dùng.</li>
<li>Cache audience đó trong Redis với TTL 5 phút và đo cost đọc sau khi warm (~1ms).</li>
<li>Invalidate cache khi friend/thread đổi và xác nhận TTL vẫn làm backstop nếu bạn lỡ một lần invalidate.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn tạo được một tập audience từ cache trong ~1ms và giải thích cái trade staleness ≤5 phút.</p></div>

<h3>🔬 Đo thật: Postgres + Redis, 10.000 người dùng</h3>
<p>Postgres 16 và Redis 7 trong container trên máy của khoá; 10.000 user, mỗi người 20 bạn + 10 người cùng chat (audience 30); đúng bốn truy vấn hai vòng như kho. Một lượt, DB rảnh:</p>
<div class="out">$ node mot.mjs
1.000 lượt tuần tự · audience TB 30 người · p50 1,16 ms · p99 2,00 ms · 4 truy vấn/lượt</div>
<p><strong>Bão deploy</strong> — mọi người cần audience cùng lúc, pool 21:</p>
<div class="out">$ node bao42.mjs
DB, không cache   N= 2000 · xong sau   622 ms · p50   467 ms · chậm nhất   613 ms · truy vấn xếp hàng chờ pool ≤ 3.979
DB, không cache   N=10000 · xong sau 3.093 ms · p50 2.332 ms · chậm nhất 3.071 ms · truy vấn xếp hàng chờ pool ≤ 19.979
Redis ấm (GET)    N= 2000 · xong sau  18,8 ms · p50   9,4 ms · chậm nhất  15,6 ms · truy vấn xếp hàng chờ pool ≤ 0
Redis ấm (GET)    N=10000 · xong sau  83,4 ms · p50  39,8 ms · chậm nhất  67,3 ms · truy vấn xếp hàng chờ pool ≤ 0</div>
<p><strong>Cache-aside, và quên invalidate:</strong></p>
<div class="out">$ node cache.mjs
lần 1 (miss → DB):  15,96 ms · 30 người
lần 2 (hit → Redis): 0,70 ms · TTL còn 300 s
— 42 kết bạn với 5000, QUÊN invalidate —
audience(42) có 5000? false  ← cũ, tới khi TTL hết
— invalidate CẢ HAI: DEL presence:audience:42 presence:audience:5000 —
audience(42) có 5000? true · audience(5000) có 42? true</div>
<p><strong>Lần chặn không dính</strong> — mẫu của kho (audience chốt lúc connect), rồi lọc lại lúc ngắt:</p>
<div class="out">$ node chan.mjs
Bình (43) chặn An (42) lúc 08:10:31 · dùng audience chốt lúc connect
Bình nhận sau khi chặn: [{"userId":42,"online":false}]
$ LOC_LAI=1 node chan.mjs
Bình (43) chặn An (42) lúc 08:10:32 · lọc LẠI lúc ngắt
Bình nhận sau khi chặn: không gì cả ✓</div>
<p><strong>Kho này</strong> (không cache — tính mỗi connect, chốt trên socket):</p>
<div class="out">$ grep -n "messageThread.findMany\\|friendship.findMany\\|presenceAudience = await\\|presenceAudience as" src/socket/messaging.socket.ts
393:          prisma.messageThread.findMany({
402:          prisma.friendship.findMany({
419:        socket.data.presenceAudience = await phatTrangThaiKhiNoi({
567:        const audience = socket.data.presenceAudience as number[] | undefined;
$ grep -n "export async function presenceAudience" -A9 src/services/presencePrivacy.ts
179:export async function presenceAudience(userId: number, candidateIds: number[]): Promise&lt;number[]&gt; {
180-  const ids = [...new Set(candidateIds.filter((id) =&gt; id !== userId))];
181-  if (!ids.length) return [];
182-  const [blocked, rows] = await Promise.all([
183-    blockedBetween(userId, ids),
184-    prisma.user.findMany({ where: { id: { in: ids }, enabled: true, showActiveStatus: true }, select: { id: true } }),
185-  ]);
186-  const ok = new Set(rows.map((r) =&gt; r.id));
187-  return ids.filter((id) =&gt; ok.has(id) &amp;&amp; !blocked.has(id));
188-}
$ grep -rn "presence:audience" src/ | wc -l
       0</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-javascript"><span class="tok-comment">// audience(X) = (bạn bè ∪ người cùng chat) − bị chặn − tắt trạng thái − tài khoản khoá. Bốn truy vấn, hai vòng song song — y như kho.</span>
import pg from 'pg';
export const pool = new pg.Pool({ connectionString: 'postgres://postgres:lab@127.0.0.1:19660/postgres', max: 21 }); // = mặc định Prisma trên máy 10 lõi: 10×2+1
export async function getAudience(u) {
  const [f, t] = await Promise.all([
    pool.query(&#96;SELECT requester_id a, addressee_id b FROM friendships WHERE status = 'ACCEPTED' AND (requester_id = $1 OR addressee_id = $1)&#96;, [u]),
    pool.query(&#96;SELECT user_a_id a, user_b_id b FROM message_threads WHERE user_a_id = $1 OR user_b_id = $1&#96;, [u]),
  ]);
  const ung = [...new Set([...f.rows, ...t.rows].map((r) =&gt; (r.a === u ? r.b : r.a)))];
  const [chan, ok] = await Promise.all([
    pool.query(&#96;SELECT blocker_id, blocked_id FROM user_blocks WHERE (blocker_id = $1 AND blocked_id = ANY($2)) OR (blocked_id = $1 AND blocker_id = ANY($2))&#96;, [u, ung]),
    pool.query(&#96;SELECT id FROM users WHERE id = ANY($1) AND enabled AND show_active_status&#96;, [ung]),
  ]);
  const bi = new Set(chan.rows.map((r) =&gt; (r.blocker_id === u ? r.blocked_id : r.blocker_id)));
  const sang = new Set(ok.rows.map((r) =&gt; r.id));
  return ung.filter((v) =&gt; sang.has(v) &amp;&amp; !bi.has(v));
}</code></pre>
<pre><code class="language-javascript"><span class="tok-comment">// Mẫu của kho: audience tính MỘT lần lúc connect, cất ở socket.data, dùng lại lúc disconnect.</span>
<span class="tok-comment">// Bình (43) đang online thì chặn An (42). An đóng tab ⇒ Bình có còn nhận presence của An?</span>
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
import { getAudience, pool } from './audience.mjs';
const io = new Server(19662);
io.on('connection', async (s) =&gt; {
  const u = s.handshake.auth.user; s.join(&#96;user:\${u}&#96;);
  s.data.aud = await getAudience(u);                     <span class="tok-comment">  // chốt lúc connect</span>
  s.on('disconnect', async () =&gt; {
    const aud = process.env.LOC_LAI ? await getAudience(u) : s.data.aud; <span class="tok-comment">  // LOC_LAI=1 ⇒ lọc lại lúc ngắt</span>
    for (const v of aud) io.to(&#96;user:\${v}&#96;).emit('presence:update', { userId: u, online: false });
  });
  s.emit('san-sang');
});
const binh = ketNoi('http://localhost:19662', { auth: { user: 43 }, transports: ['websocket'] });
const nhan = []; binh.on('presence:update', (p) =&gt; nhan.push(p));
await new Promise((r) =&gt; binh.on('san-sang', r));
const an = ketNoi('http://localhost:19662', { auth: { user: 42 }, transports: ['websocket'], forceNew: true });
await new Promise((r) =&gt; an.on('san-sang', r));
await pool.query('INSERT INTO user_blocks VALUES (43, 42)');
console.log(&#96;Bình (43) chặn An (42) lúc \${new Date().toISOString().slice(11, 19)} · \${process.env.LOC_LAI ? 'lọc LẠI lúc ngắt' : 'dùng audience chốt lúc connect'}&#96;);
an.disconnect(); await new Promise((r) =&gt; setTimeout(r, 400));
console.log(&#96;Bình nhận sau khi chặn: \${nhan.length ? JSON.stringify(nhan) : 'không gì cả ✓'}&#96;);
await pool.query('DELETE FROM user_blocks'); await pool.end(); process.exit(0);</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-6-1-bon-khuon" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 6.1 — Bốn khuôn làm bộ đệm, và bạn đang dùng khuôn nào</span><span class="lc-sub">Cache-aside là một trong bốn</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-6-4-nhat-quan" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 6.4 — Nhất quán: khi bộ đệm và cơ sở dữ liệu nói khác nhau</span><span class="lc-sub">Đúng chuyện audience bị cũ</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-7-1-ket-noi-va-pool" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 7.1 — Vì sao cần cơ sở dữ liệu, và một kết nối thật sự tốn gì</span><span class="lc-sub">Vì sao có pool, và vì sao nó xếp hàng</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Audience</span><span class="v">friends ∪ thread peers — những user cần presence của một user cho trước.</span></div>
  <div class="kv"><span class="k">Cache (Redis)</span><span class="v">Lưu audience đã tính để đọc lặp nhanh (~1ms sau warm).</span></div>
  <div class="kv"><span class="k">TTL</span><span class="v">Thời gian sống làm cache hết hạn kể cả khi không có invalidate.</span></div>
  <div class="kv"><span class="k">Invalidation</span><span class="v">Bỏ mục cache khi friend hoặc thread đổi.</span></div>
  <div class="kv"><span class="k">TTL backstop</span><span class="v">TTL chặn độ cũ nếu một lần invalidate bị lỡ.</span></div>
  <div class="kv"><span class="k">Staleness</span><span class="v">Mức cũ của audience trong cache (≤5 phút ở đây).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Audience là friends ∪ thread peers, không phải toàn bộ người dùng.</li><li>Cache nó trong Redis 5 phút — sau khi warm, một lần đọc ~1ms.</li><li>Invalidate khi friend/thread đổi, với TTL làm backstop.</li><li>Đo thật: bão 10k user mất 3,1 s từ DB (nghẽn ở pool) so với 83 ms từ Redis đã ấm.</li><li>Cái giá là ≤5 phút staleness presence, chấp nhận được ở đây.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Redis — Caching patterns</span><span class="lc-sub">redis.io/docs/manual/patterns/twemproxy — cache-aside, đủ cho use case này.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Khoá Redis của CuongThai</span><span class="lc-sub">/courses/redis/learn${REF} — pattern cache-aside chi tiết, kèm invalidation strategies.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 4.3 ─────────────────────────── */
    {
      title: '4.3 — Multi-tab: one user, many sockets|||4.3 — Nhiều tab: một user, nhiều socket',
      slug: 'io-4-3-multi-tab',
      type: 'VIDEO',
      description: 'User mở 3 tab = 3 socket, 3 sid, cùng userId. Đóng 1 tab KHÔNG nghĩa là user offline. Track socket count per user.',
      content: `
${G04_3}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>Multi-tab: one user, many sockets</h2>
<p class="lead">A user opens the app in three tabs. That&#39;s three separate WebSocket connections, three sids, but ONE userId. When they close tab 2, they&#39;re not offline — tabs 1 and 3 still live. This lesson fixes the presence logic that gets this wrong.</p>

<h3>The buggy version</h3>
<pre><code class="language-ts">io.on('connection', (socket) =&gt; {
  const userId = socket.data.userId;
  onlineUserIds.add(userId);
  emitPresenceTo(audience, { userId, online: true });

  socket.on('disconnect', () =&gt; {
    onlineUserIds.delete(userId);          // BUG: xoa ngay du user con tab khac
    emitPresenceTo(audience, { userId, online: false });
  });
});
</code></pre>

<div class="callout warn">
<p><strong>The resulting bug:</strong> A user with 2 tabs closes one → presence ripples (online → offline → online 200ms later, once the other tab reports in). Their friends watch the avatar flicker because they merely closed their inbox. <strong>Measured — worse:</strong> nothing &quot;reports in&quot; again; the friend saw offline 1 ms after tab 2 closed and it STAYED offline for the 1.4 s tab 1 remained open (until a reconnect). And &quot;online&quot; arrived twice, once per tab.</p>
</div>

<h3>Fix: reference counting</h3>
<pre><code class="language-ts">const socketsByUser = new Map&lt;number, Set&lt;string&gt;&gt;();

io.on('connection', (socket) =&gt; {
  const userId = socket.data.userId;

  let sockets = socketsByUser.get(userId);
  if (!sockets) socketsByUser.set(userId, sockets = new Set());
  sockets.add(socket.id);

  const wasOffline = sockets.size === 1;
  if (wasOffline) {
    emitPresenceTo(audience, { userId, online: true, lastSeen: Date.now() });
  }

  socket.on('disconnect', () =&gt; {
    const sockets = socketsByUser.get(userId);
    if (!sockets) return;
    sockets.delete(socket.id);

    if (sockets.size === 0) {
      socketsByUser.delete(userId);
      emitPresenceTo(audience, { userId, online: false, lastSeen: Date.now() });
    }
    // co tab khac -> KHONG emit offline
  });
});
</code></pre>

<h3>Combined with the debounce from 1.2</h3>
<pre><code class="language-ts">socket.on('disconnect', (reason) =&gt; {
  const sockets = socketsByUser.get(userId);
  if (!sockets) return;
  sockets.delete(socket.id);
  if (sockets.size &gt; 0) return;              // co tab khac, thoat

  const willReconnect = reason === 'transport close' || reason === 'ping timeout';
  if (willReconnect) {
    // debounce 2s cho reconnect
    scheduleOfflineDebounce(userId, 2000);
  } else {
    socketsByUser.delete(userId);
    emitPresenceTo(audience, { userId, online: false, lastSeen: Date.now() });
  }
});

// scheduleOfflineDebounce cancel offline neu socket khac vao trong 2s
</code></pre>

<h3>&quot;lastSeen&quot; — more important than &quot;online&quot;</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">&quot;Active now&quot; strict</span><span class="lz-lnote">Shown only while a socket is connected. No &quot;online 2 minutes ago&quot;. Unambiguous, but the UI flickers easily</span></div>
<div class="lz-layer"><span class="lz-lname">&quot;Active recently&quot; broad</span><span class="lz-lnote">Shows &quot;Active&quot; for 5-10 minutes past lastSeen. A softer UI, but it can mislead — a user who has gone to bed still reads as online</span></div>
<div class="lz-layer"><span class="lz-lname">this repo</span><span class="lz-lnote">Emit both <code>online</code> (a boolean) and <code>lastSeen</code> (Date.now()). The client picks how to render it — <code>ActiveNowRow</code> uses the strict reading, <code>ThreadList</code> uses the broad one. <strong>Checked in the frontend (13/11/2026):</strong> ActiveNowRow and ThreadList both read only <code>online</code>; ChatInfoPanel shows &quot;active … ago&quot; from <code>lastSeen</code></span></div>
</div>

<h3>Redis-backed multi-instance</h3>
<pre><code class="language-ts">// Cluster: mot user co the co tab o worker 1 va tab o worker 2
// -&gt; socketsByUser trong-process KHONG du. Can Redis.

async function markOnline(userId: number, socketId: string) {
  const key = &#96;presence:sockets:\${userId}&#96;;
  await redis.sadd(key, socketId);
  await redis.expire(key, 3600);   // TTL backup

  const count = await redis.scard(key);
  if (count === 1) {
    emitPresenceTo(audience, { userId, online: true, ... });
  }
}
</code></pre>

<div class="pitfall">
<p><strong>Trap — forgetting to clean up <code>socketsByUser</code> when the cluster restarts.</strong> If a worker crashes, an in-process Set vanishes with it. Redis-backed, the entry survives — and a 1h backup TTL clears it eventually. WITHOUT that TTL it is orphaned forever. <strong>Measured:</strong> after <code>kill -9</code> of the worker holding the last tab, <code>SCARD</code> still said 1 (TTL 3,600 s left) — while <code>io.in(&#39;user:7&#39;).fetchSockets()</code> on a live worker returned 0 in 1.4 ms: the dead worker no longer answers, so the adapter heals itself.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Multi-tab presence needs reference counting (a Set&lt;socketId&gt; per userId), emitting offline only when the Set reaches 0 and no debounce has cancelled it — combined with a <code>lastSeen</code> timestamp so the frontend can choose a strict or broad display, and in a cluster it has to live in a Redis <code>SADD</code>/<code>SCARD</code> because an in-process Set is not shared across workers (or ask every worker with <code>fetchSockets()</code>). <strong>This repo (13/11/2026):</strong> counts by scanning <code>io.sockets.sockets</code> at each disconnect — correct in one process, O(N) per disconnect, no debounce.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Open two tabs as the same user and keep a <code>Set&lt;socketId&gt;</code> per <code>userId</code>; emit offline ONLY when the set reaches 0.</li>
<li>Close one tab and confirm the user stays online; close the last and confirm offline fires once (not twice).</li>
<li>Move the set into Redis with <code>SADD</code>/<code>SREM</code>/<code>SCARD</code> and reason about why an in-process Set fails across cluster workers.</li>
</ol>
<p><strong>Done when:</strong> a user with two tabs shows online until the last tab closes, and your count works across workers via Redis.</p></div>

<h3>🔬 Measured: two tabs, one user</h3>
<p>socket.io 4.8.3 — user 7 opens two tabs, closes tab 2 at 0.6 s and tab 1 at 2 s; user 9 watches. Naive (offline on any disconnect) vs reference counting:</p>
<div class="out">$ node haitab.mjs
— ngây thơ: offline khi MỘT tab đóng —
0,02 s  bạn thấy user 7 🟢 online
0,02 s  bạn thấy user 7 🟢 online
0,62 s  ✖ đóng tab 2 (tab 1 VẪN mở)
0,63 s  bạn thấy user 7 ⚪ offline
2,03 s  bạn thấy user 7 ⚪ offline
2,03 s  ✖ đóng tab 1 (tab cuối)
— đếm socket: offline khi tab CUỐI đóng —
0,01 s  bạn thấy user 7 🟢 online
0,60 s  ✖ đóng tab 2 (tab 1 VẪN mở)
2,01 s  bạn thấy user 7 ⚪ offline
2,01 s  ✖ đóng tab 1 (tab cuối)</div>
<p><strong>In Chromium</strong> — Ha&#39;s tab watching Nam, naive then counting (presence frames only):</p>
<div class="out">↓ 42["presence:update",{"userId":7,"online":true,"lastSeen":1794558328462}]   (1043 ms)
↓ 42["presence:update",{"userId":7,"online":true,"lastSeen":1794558328462}]   (1062 ms)
↓ 42["presence:update",{"userId":7,"online":false,"lastSeen":1794558329059}]   (1640 ms)
↓ 42["presence:update",{"userId":7,"online":false,"lastSeen":1794558331460}]   (4040 ms)</div>
<div class="out">↓ 42["presence:update",{"userId":7,"online":true,"lastSeen":1794558333949}]   (1023 ms)
↓ 42["presence:update",{"userId":7,"online":false,"lastSeen":1794558336944}]   (4019 ms)</div>
<p><strong>This repo&#39;s count — scan every socket at each disconnect</strong>, when N sockets drop at once, vs a Map:</p>
<div class="out">$ node quet.mjs
N=1000 socket (2 tab/user) · quét · bước lặp    499.500 · thời gian trong handler   14,4 ms
N=1000 socket (2 tab/user) · Map  · bước lặp      1.000 · thời gian trong handler    0,5 ms
N=5000 socket (2 tab/user) · quét · bước lặp 12.497.500 · thời gian trong handler  132,3 ms
N=5000 socket (2 tab/user) · Map  · bước lặp      5.000 · thời gian trong handler    2,4 ms</div>
<p><strong>Two workers</strong> (Redis adapter): tab A on worker 1, tab B on worker 2 — three ways to count:</p>
<div class="out">$ node cum.mjs
— đóng tab A (worker 1), tab B vẫn mở ở worker 2 —
worker 1 (thật: còn 1 tab) · quét worker này: 0 ⇒ offline ✗ · SCARD: 1 ⇒ online ✓ · fetchSockets: 1 ⇒ online ✓ (2,2 ms)
— đóng tab B (worker 2), tab cuối —
worker 2 (thật: còn 0 tab) · quét worker này: 0 ⇒ offline ✓ · SCARD: 0 ⇒ offline ✓ · fetchSockets: 0 ⇒ offline ✓ (2,1 ms)
Redis còn: SMEMBERS presence:sockets:7 = []</div>
<p><strong>A worker dies</strong> with the last tab on it:</p>
<div class="out">$ node mocoi.mjs
tab mở ở worker 2 · SCARD = 1 · worker 1 fetchSockets = 1
worker 2 bị kill -9 · tab đã rớt
  SCARD presence:sockets:7 = 1 ⇒ vẫn "online" (mồ côi) · TTL còn 3600 s
  worker 1 fetchSockets = 0 ⇒ offline ✓ (1,4 ms — worker chết không còn trong Redis để được hỏi)</div>
<p><strong>This repo:</strong></p>
<div class="out">$ grep -n "Only mark offline if this was the last" -A3 src/socket/messaging.socket.ts
553:      // Only mark offline if this was the last open socket for the
554-      // user (multi-tab case).
555-      const socketsForUser = Array.from(io?.sockets.sockets.values() ?? [])
556-        .filter((s) =&gt; (s.data.user as { id: number } | undefined)?.id === user.id);
$ grep -n "const wasOffline\\|server.adapter(createAdapter" src/socket/messaging.socket.ts
245:    server.adapter(createAdapter(pubClient, subClient));
382:    const wasOffline = !onlineUserIds.has(user.id);
$ grep -n "lastActiveAt: new Date()" src/socket/messaging.socket.ts ; grep -c "debounce" src/socket/messaging.socket.ts
562: void prisma.user.update({ where: { id: user.id }, data: { lastActiveAt: new Date() } }).catch(() =&gt; undefined);
0
$ grep -n "online={!!presence?.online}\\|presenceInfo?.lastSeen)" frontend/src/components/messaging/*.tsx
ThreadList.tsx:349: online={!!presence?.online}
ChatInfoPanel.tsx:93: } else if (presenceInfo?.lastSeen) {</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-javascript"><span class="tok-comment">// User 7 mở HAI tab. Bạn (user 9) xem chấm xanh. Đóng tab 2 lúc t≈0,6 s, tab 1 vẫn mở tới t≈2 s, rồi đóng nốt.</span>
<span class="tok-comment">// kieu 'tho': offline ngay khi MỘT socket ngắt · 'dem': đếm socket theo user (Map&lt;userId, Set&lt;sid&gt;&gt;), offline khi về 0.</span>
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
for (const [kieu, cong] of [['tho', 19670], ['dem', 19671]]) {
  const io = new Server(cong);
  const socketsByUser = new Map();
  const phat = (u, online) =&gt; io.to('user:9').emit('presence:update', { userId: u, online });
  io.on('connection', (s) =&gt; {
    const u = s.handshake.auth.user; s.join(&#96;user:\${u}&#96;);
    let set = socketsByUser.get(u); if (!set) socketsByUser.set(u, (set = new Set()));
    set.add(s.id);
    if (u === 7 &amp;&amp; (kieu === 'tho' || set.size === 1)) phat(7, true);
    s.on('disconnect', () =&gt; {
      set.delete(s.id);
      if (u !== 7) return;
      if (kieu === 'tho') phat(7, false);                     <span class="tok-comment">  // ngây thơ: một tab đóng = offline</span>
      else if (set.size === 0) { socketsByUser.delete(u); phat(7, false); }
    });
  });
  const t0 = performance.now(); const dong = [];
  const ban = ketNoi(&#96;http://localhost:\${cong}&#96;, { auth: { user: 9 }, transports: ['websocket'], forceNew: true });
  ban.on('presence:update', (p) =&gt; dong.push(&#96;\${((performance.now() - t0) / 1000).toFixed(2).replace('.', ',')} s  bạn thấy user 7 \${p.online ? '🟢 online' : '⚪ offline'}&#96;));
  await new Promise((r) =&gt; ban.on('connect', r));
  const tab1 = ketNoi(&#96;http://localhost:\${cong}&#96;, { auth: { user: 7 }, transports: ['websocket'], forceNew: true });
  const tab2 = ketNoi(&#96;http://localhost:\${cong}&#96;, { auth: { user: 7 }, transports: ['websocket'], forceNew: true });
  await cho(600); tab2.disconnect(); dong.push(&#96;\${((performance.now() - t0) / 1000).toFixed(2).replace('.', ',')} s  ✖ đóng tab 2 (tab 1 VẪN mở)&#96;);
  await cho(1400); tab1.disconnect(); dong.push(&#96;\${((performance.now() - t0) / 1000).toFixed(2).replace('.', ',')} s  ✖ đóng tab 1 (tab cuối)&#96;);
  await cho(300);
  console.log(&#96;— \${kieu === 'tho' ? 'ngây thơ: offline khi MỘT tab đóng' : 'đếm socket: offline khi tab CUỐI đóng'} —&#96;); dong.sort().forEach((l) =&gt; console.log(l));
  io.close(); ban.close();
}
process.exit(0);</code></pre>
<pre><code class="language-javascript"><span class="tok-comment">// HAI worker (hai Server, Redis adapter qua sio-redis). User 7: tab A ở worker 1, tab B ở worker 2. Đóng tab A.</span>
<span class="tok-comment">// Ba cách đếm: quét socket CỦA WORKER NÀY (như kho) · Redis SADD/SREM/SCARD · io.in('user:7').fetchSockets() (hỏi mọi worker).</span>
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
const r = createClient({ url: 'redis://127.0.0.1:19661' }); await r.connect(); await r.del('presence:sockets:7');
let conMo = 2; <span class="tok-comment">  // số tab THẬT còn mở — để chấm ✓/✗</span>
const worker = async (cong, ten) =&gt; {
  const pub = r.duplicate(), sub = r.duplicate(); await Promise.all([pub.connect(), sub.connect()]);
  const io = new Server(cong, { adapter: createAdapter(pub, sub) });
  io.on('connection', async (s) =&gt; {
    const u = s.handshake.auth.user; s.join(&#96;user:\${u}&#96;);
    if (u === 7) { await r.sAdd('presence:sockets:7', s.id); await r.expire('presence:sockets:7', 3600); }
    s.on('disconnect', async () =&gt; {
      if (u !== 7) return;
      const quet = [...io.sockets.sockets.values()].filter((x) =&gt; x.handshake.auth.user === 7).length;
      await r.sRem('presence:sockets:7', s.id); const scard = await r.sCard('presence:sockets:7');
      const a = performance.now(); const fs = (await io.in('user:7').fetchSockets()).length; const ms = (performance.now() - a).toFixed(1).replace('.', ',');
      const dg = (n) =&gt; &#96;\${n} ⇒ \${n ? 'online' : 'offline'} \${(n &gt; 0) === (conMo &gt; 0) ? '✓' : '✗'}&#96;;
      console.log(&#96;\${ten} (thật: còn \${conMo} tab) · quét worker này: \${dg(quet)} · SCARD: \${dg(scard)} · fetchSockets: \${dg(fs)} (\${ms} ms)&#96;);
    });
  });
  return io;
};
const w1 = await worker(19673, 'worker 1'), w2 = await worker(19674, 'worker 2');
const A = ketNoi('http://localhost:19673', { auth: { user: 7 }, transports: ['websocket'], forceNew: true });
const Bt = ketNoi('http://localhost:19674', { auth: { user: 7 }, transports: ['websocket'], forceNew: true });
await Promise.all([A, Bt].map((c) =&gt; new Promise((ok) =&gt; c.once('connect', ok)))); await cho(300);
console.log('— đóng tab A (worker 1), tab B vẫn mở ở worker 2 —');
conMo = 1; A.disconnect(); await cho(800);
console.log('— đóng tab B (worker 2), tab cuối —');
conMo = 0; Bt.disconnect(); await cho(800);
console.log(&#96;Redis còn: SMEMBERS presence:sockets:7 = \${JSON.stringify(await r.sMembers('presence:sockets:7'))}&#96;);
process.exit(0);</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-4-2-set" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 4.2 — Set: membership and set algebra</span><span class="lc-sub">SADD / SREM / SCARD in depth</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-2-2-het-han" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 2.2 — How expiry really works</span><span class="lc-sub">The TTL that cleans up orphans</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-4-scale-adapter-backpressure" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 11.4 — More than one process: adapter, sticky session, backpressure</span><span class="lc-sub">The two-worker setup of this lesson</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Multi-tab</span><span class="v">One user with several sockets open at once.</span></div>
  <div class="kv"><span class="k">Reference counting</span><span class="v">A <code>Set&lt;socketId&gt;</code> per <code>userId</code>; offline only when it hits 0.</span></div>
  <div class="kv"><span class="k"><code>lastSeen</code></span><span class="v">A timestamp letting the frontend choose a strict or broad display.</span></div>
  <div class="kv"><span class="k"><code>SADD</code>/<code>SCARD</code></span><span class="v">Redis set add and cardinality — the cluster-safe counter.</span></div>
  <div class="kv"><span class="k">In-process Set</span><span class="v">A per-worker Set — NOT shared, so it breaks in a cluster.</span></div>
  <div class="kv"><span class="k">Offline debounce</span><span class="v">A short delay so a quick tab swap does not flash offline.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Multi-tab presence needs reference counting: a <code>Set&lt;socketId&gt;</code> per <code>userId</code>.</li><li>Emit offline only when the set reaches 0 and no debounce has cancelled it.</li><li>Pair it with a <code>lastSeen</code> timestamp so the frontend can pick strict or broad display.</li><li>In a cluster the set must live in Redis (<code>SADD</code>/<code>SCARD</code>).</li><li>An in-process Set is per-worker and is not shared, so it fails at scale.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Redis — SADD, SCARD, SREM</span><span class="lc-sub">redis.io/commands/sadd — atomic set operations, đủ cho multi-instance socket counting.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Lesson 1.2 — disconnect reasons</span><span class="lc-sub">/courses/socket-io/learn${REF} — debounce cho &quot;transport close&quot; là chỗ multi-tab bug hay giấu.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>Nhiều tab: một user, nhiều socket</h2>
<p class="lead">User mở app trong 3 tab. Đó là 3 WebSocket riêng biệt, 3 sid, nhưng MỘT userId. Khi họ đóng tab 2, họ KHÔNG offline — tab 1 và 3 vẫn sống. Bài này vá presence logic dễ sai chỗ này.</p>

<h3>Phiên bản buggy</h3>
<pre><code class="language-ts">io.on('connection', (socket) =&gt; {
  const userId = socket.data.userId;
  onlineUserIds.add(userId);
  emitPresenceTo(audience, { userId, online: true });

  socket.on('disconnect', () =&gt; {
    onlineUserIds.delete(userId);          // BUG: xoa ngay du user con tab khac
    emitPresenceTo(audience, { userId, online: false });
  });
});
</code></pre>

<div class="callout warn">
<p><strong>Kết quả bug:</strong> User có 2 tab, đóng 1 → presence gợn (online → offline → online 200ms sau khi tab kia gửi tín hiệu). Bạn bè của họ thấy avatar nhấp nháy khi họ chỉ đóng inbox. <strong>Đo thật — còn tệ hơn:</strong> không có tín hiệu nào gửi lại; người bạn thấy offline 1 ms sau khi tab 2 đóng và GIỮ NGUYÊN offline suốt 1,4 s tab 1 còn mở (tới khi nối lại). Và &quot;online&quot; tới hai lần, mỗi tab một lần.</p>
</div>

<h3>Vá: reference counting</h3>
<pre><code class="language-ts">const socketsByUser = new Map&lt;number, Set&lt;string&gt;&gt;();

io.on('connection', (socket) =&gt; {
  const userId = socket.data.userId;

  let sockets = socketsByUser.get(userId);
  if (!sockets) socketsByUser.set(userId, sockets = new Set());
  sockets.add(socket.id);

  const wasOffline = sockets.size === 1;
  if (wasOffline) {
    emitPresenceTo(audience, { userId, online: true, lastSeen: Date.now() });
  }

  socket.on('disconnect', () =&gt; {
    const sockets = socketsByUser.get(userId);
    if (!sockets) return;
    sockets.delete(socket.id);

    if (sockets.size === 0) {
      socketsByUser.delete(userId);
      emitPresenceTo(audience, { userId, online: false, lastSeen: Date.now() });
    }
    // co tab khac -> KHONG emit offline
  });
});
</code></pre>

<h3>Kết hợp với debounce từ 1.2</h3>
<pre><code class="language-ts">socket.on('disconnect', (reason) =&gt; {
  const sockets = socketsByUser.get(userId);
  if (!sockets) return;
  sockets.delete(socket.id);
  if (sockets.size &gt; 0) return;              // co tab khac, thoat

  const willReconnect = reason === 'transport close' || reason === 'ping timeout';
  if (willReconnect) {
    // debounce 2s cho reconnect
    scheduleOfflineDebounce(userId, 2000);
  } else {
    socketsByUser.delete(userId);
    emitPresenceTo(audience, { userId, online: false, lastSeen: Date.now() });
  }
});

// scheduleOfflineDebounce cancel offline neu socket khac vao trong 2s
</code></pre>

<h3>&quot;lastSeen&quot; — quan trọng hơn &quot;online&quot;</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">&quot;Active now&quot; strict</span><span class="lz-lnote">Chỉ hiện khi có socket connected. Không giữ &quot;online 2 phút trước&quot;. Rõ ràng nhưng UI dễ nhấp nháy</span></div>
<div class="lz-layer"><span class="lz-lname">&quot;Active recently&quot; broad</span><span class="lz-lnote">Hiện &quot;Active&quot; cho tới 5-10 phút sau lastSeen. UI mềm hơn nhưng có thể mislead — user đã đi ngủ vẫn hiện online</span></div>
<div class="lz-layer"><span class="lz-lname">this repo</span><span class="lz-lnote">Emit cả <code>online</code> (boolean) và <code>lastSeen</code> (Date.now()). Client tự chọn render — <code>ActiveNowRow</code> dùng strict, <code>ThreadList</code> dùng broad. <strong>Kiểm frontend (13/11/2026):</strong> ActiveNowRow và ThreadList đều chỉ đọc <code>online</code>; ChatInfoPanel hiện &quot;Hoạt động … trước&quot; từ <code>lastSeen</code></span></div>
</div>

<h3>Redis-backed multi-instance</h3>
<pre><code class="language-ts">// Cluster: mot user co the co tab o worker 1 va tab o worker 2
// -&gt; socketsByUser trong-process KHONG du. Can Redis.

async function markOnline(userId: number, socketId: string) {
  const key = &#96;presence:sockets:\${userId}&#96;;
  await redis.sadd(key, socketId);
  await redis.expire(key, 3600);   // TTL backup

  const count = await redis.scard(key);
  if (count === 1) {
    emitPresenceTo(audience, { userId, online: true, ... });
  }
}
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — quên cleanup <code>socketsByUser</code> khi cluster restart.</strong> Nếu worker crash, Set trong-process biến mất. Redis-backed thì entry vẫn còn — với TTL 1h backup, tự dọn. Nếu KHÔNG có TTL, orphan mãi. <strong>Đo thật:</strong> <code>kill -9</code> worker đang giữ tab cuối ⇒ <code>SCARD</code> vẫn 1 (TTL còn 3.600 s) — trong khi <code>io.in(&#39;user:7&#39;).fetchSockets()</code> ở worker còn sống trả 0 sau 1,4 ms: worker chết không còn trả lời nên adapter tự lành.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Presence nhiều tab cần reference counting (Set&lt;socketId&gt; per userId), chỉ emit offline khi Set về 0 và không có debounce cancel — kết hợp với <code>lastSeen</code> timestamp cho FE chọn strict vs broad hiển thị, và trong cluster phải dùng Redis <code>SADD</code>/<code>SCARD</code> vì Set trong-process không share qua worker (hoặc hỏi mọi worker bằng <code>fetchSockets()</code>). <strong>Kho này (13/11/2026):</strong> đếm bằng cách quét <code>io.sockets.sockets</code> ở mỗi disconnect — đúng trong một tiến trình, O(N) mỗi lần ngắt, không debounce.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Mở hai tab cùng một user và giữ một <code>Set&lt;socketId&gt;</code> per <code>userId</code>; chỉ emit offline KHI set về 0.</li>
<li>Đóng một tab và xác nhận user vẫn online; đóng tab cuối và xác nhận offline fire đúng một lần (không phải hai).</li>
<li>Chuyển set vào Redis với <code>SADD</code>/<code>SREM</code>/<code>SCARD</code> và lập luận vì sao một Set trong-process hỏng qua các worker cụm.</li>
</ol>
<p><strong>Đạt khi:</strong> một user hai tab hiện online tới khi tab cuối đóng, và bộ đếm của bạn chạy qua các worker nhờ Redis.</p></div>

<h3>🔬 Đo thật: hai tab, một user</h3>
<p>socket.io 4.8.3 — user 7 mở hai tab, đóng tab 2 ở 0,6 s và tab 1 ở 2 s; user 9 theo dõi. Ngây thơ (offline ở mọi disconnect) vs đếm tham chiếu:</p>
<div class="out">$ node haitab.mjs
— ngây thơ: offline khi MỘT tab đóng —
0,02 s  bạn thấy user 7 🟢 online
0,02 s  bạn thấy user 7 🟢 online
0,62 s  ✖ đóng tab 2 (tab 1 VẪN mở)
0,63 s  bạn thấy user 7 ⚪ offline
2,03 s  bạn thấy user 7 ⚪ offline
2,03 s  ✖ đóng tab 1 (tab cuối)
— đếm socket: offline khi tab CUỐI đóng —
0,01 s  bạn thấy user 7 🟢 online
0,60 s  ✖ đóng tab 2 (tab 1 VẪN mở)
2,01 s  bạn thấy user 7 ⚪ offline
2,01 s  ✖ đóng tab 1 (tab cuối)</div>
<p><strong>Trong Chromium</strong> — tab của Hà theo dõi Nam, ngây thơ rồi biết đếm (chỉ khung presence):</p>
<div class="out">↓ 42["presence:update",{"userId":7,"online":true,"lastSeen":1794558328462}]   (1043 ms)
↓ 42["presence:update",{"userId":7,"online":true,"lastSeen":1794558328462}]   (1062 ms)
↓ 42["presence:update",{"userId":7,"online":false,"lastSeen":1794558329059}]   (1640 ms)
↓ 42["presence:update",{"userId":7,"online":false,"lastSeen":1794558331460}]   (4040 ms)</div>
<div class="out">↓ 42["presence:update",{"userId":7,"online":true,"lastSeen":1794558333949}]   (1023 ms)
↓ 42["presence:update",{"userId":7,"online":false,"lastSeen":1794558336944}]   (4019 ms)</div>
<p><strong>Cách đếm của kho — quét mọi socket ở mỗi disconnect</strong>, khi N socket cùng rớt, so với Map:</p>
<div class="out">$ node quet.mjs
N=1000 socket (2 tab/user) · quét · bước lặp    499.500 · thời gian trong handler   14,4 ms
N=1000 socket (2 tab/user) · Map  · bước lặp      1.000 · thời gian trong handler    0,5 ms
N=5000 socket (2 tab/user) · quét · bước lặp 12.497.500 · thời gian trong handler  132,3 ms
N=5000 socket (2 tab/user) · Map  · bước lặp      5.000 · thời gian trong handler    2,4 ms</div>
<p><strong>Hai worker</strong> (Redis adapter): tab A ở worker 1, tab B ở worker 2 — ba cách đếm:</p>
<div class="out">$ node cum.mjs
— đóng tab A (worker 1), tab B vẫn mở ở worker 2 —
worker 1 (thật: còn 1 tab) · quét worker này: 0 ⇒ offline ✗ · SCARD: 1 ⇒ online ✓ · fetchSockets: 1 ⇒ online ✓ (2,2 ms)
— đóng tab B (worker 2), tab cuối —
worker 2 (thật: còn 0 tab) · quét worker này: 0 ⇒ offline ✓ · SCARD: 0 ⇒ offline ✓ · fetchSockets: 0 ⇒ offline ✓ (2,1 ms)
Redis còn: SMEMBERS presence:sockets:7 = []</div>
<p><strong>Một worker chết</strong> khi tab cuối nằm ở đó:</p>
<div class="out">$ node mocoi.mjs
tab mở ở worker 2 · SCARD = 1 · worker 1 fetchSockets = 1
worker 2 bị kill -9 · tab đã rớt
  SCARD presence:sockets:7 = 1 ⇒ vẫn "online" (mồ côi) · TTL còn 3600 s
  worker 1 fetchSockets = 0 ⇒ offline ✓ (1,4 ms — worker chết không còn trong Redis để được hỏi)</div>
<p><strong>Kho này:</strong></p>
<div class="out">$ grep -n "Only mark offline if this was the last" -A3 src/socket/messaging.socket.ts
553:      // Only mark offline if this was the last open socket for the
554-      // user (multi-tab case).
555-      const socketsForUser = Array.from(io?.sockets.sockets.values() ?? [])
556-        .filter((s) =&gt; (s.data.user as { id: number } | undefined)?.id === user.id);
$ grep -n "const wasOffline\\|server.adapter(createAdapter" src/socket/messaging.socket.ts
245:    server.adapter(createAdapter(pubClient, subClient));
382:    const wasOffline = !onlineUserIds.has(user.id);
$ grep -n "lastActiveAt: new Date()" src/socket/messaging.socket.ts ; grep -c "debounce" src/socket/messaging.socket.ts
562: void prisma.user.update({ where: { id: user.id }, data: { lastActiveAt: new Date() } }).catch(() =&gt; undefined);
0
$ grep -n "online={!!presence?.online}\\|presenceInfo?.lastSeen)" frontend/src/components/messaging/*.tsx
ThreadList.tsx:349: online={!!presence?.online}
ChatInfoPanel.tsx:93: } else if (presenceInfo?.lastSeen) {</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-javascript"><span class="tok-comment">// User 7 mở HAI tab. Bạn (user 9) xem chấm xanh. Đóng tab 2 lúc t≈0,6 s, tab 1 vẫn mở tới t≈2 s, rồi đóng nốt.</span>
<span class="tok-comment">// kieu 'tho': offline ngay khi MỘT socket ngắt · 'dem': đếm socket theo user (Map&lt;userId, Set&lt;sid&gt;&gt;), offline khi về 0.</span>
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
for (const [kieu, cong] of [['tho', 19670], ['dem', 19671]]) {
  const io = new Server(cong);
  const socketsByUser = new Map();
  const phat = (u, online) =&gt; io.to('user:9').emit('presence:update', { userId: u, online });
  io.on('connection', (s) =&gt; {
    const u = s.handshake.auth.user; s.join(&#96;user:\${u}&#96;);
    let set = socketsByUser.get(u); if (!set) socketsByUser.set(u, (set = new Set()));
    set.add(s.id);
    if (u === 7 &amp;&amp; (kieu === 'tho' || set.size === 1)) phat(7, true);
    s.on('disconnect', () =&gt; {
      set.delete(s.id);
      if (u !== 7) return;
      if (kieu === 'tho') phat(7, false);                     <span class="tok-comment">  // ngây thơ: một tab đóng = offline</span>
      else if (set.size === 0) { socketsByUser.delete(u); phat(7, false); }
    });
  });
  const t0 = performance.now(); const dong = [];
  const ban = ketNoi(&#96;http://localhost:\${cong}&#96;, { auth: { user: 9 }, transports: ['websocket'], forceNew: true });
  ban.on('presence:update', (p) =&gt; dong.push(&#96;\${((performance.now() - t0) / 1000).toFixed(2).replace('.', ',')} s  bạn thấy user 7 \${p.online ? '🟢 online' : '⚪ offline'}&#96;));
  await new Promise((r) =&gt; ban.on('connect', r));
  const tab1 = ketNoi(&#96;http://localhost:\${cong}&#96;, { auth: { user: 7 }, transports: ['websocket'], forceNew: true });
  const tab2 = ketNoi(&#96;http://localhost:\${cong}&#96;, { auth: { user: 7 }, transports: ['websocket'], forceNew: true });
  await cho(600); tab2.disconnect(); dong.push(&#96;\${((performance.now() - t0) / 1000).toFixed(2).replace('.', ',')} s  ✖ đóng tab 2 (tab 1 VẪN mở)&#96;);
  await cho(1400); tab1.disconnect(); dong.push(&#96;\${((performance.now() - t0) / 1000).toFixed(2).replace('.', ',')} s  ✖ đóng tab 1 (tab cuối)&#96;);
  await cho(300);
  console.log(&#96;— \${kieu === 'tho' ? 'ngây thơ: offline khi MỘT tab đóng' : 'đếm socket: offline khi tab CUỐI đóng'} —&#96;); dong.sort().forEach((l) =&gt; console.log(l));
  io.close(); ban.close();
}
process.exit(0);</code></pre>
<pre><code class="language-javascript"><span class="tok-comment">// HAI worker (hai Server, Redis adapter qua sio-redis). User 7: tab A ở worker 1, tab B ở worker 2. Đóng tab A.</span>
<span class="tok-comment">// Ba cách đếm: quét socket CỦA WORKER NÀY (như kho) · Redis SADD/SREM/SCARD · io.in('user:7').fetchSockets() (hỏi mọi worker).</span>
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
const r = createClient({ url: 'redis://127.0.0.1:19661' }); await r.connect(); await r.del('presence:sockets:7');
let conMo = 2; <span class="tok-comment">  // số tab THẬT còn mở — để chấm ✓/✗</span>
const worker = async (cong, ten) =&gt; {
  const pub = r.duplicate(), sub = r.duplicate(); await Promise.all([pub.connect(), sub.connect()]);
  const io = new Server(cong, { adapter: createAdapter(pub, sub) });
  io.on('connection', async (s) =&gt; {
    const u = s.handshake.auth.user; s.join(&#96;user:\${u}&#96;);
    if (u === 7) { await r.sAdd('presence:sockets:7', s.id); await r.expire('presence:sockets:7', 3600); }
    s.on('disconnect', async () =&gt; {
      if (u !== 7) return;
      const quet = [...io.sockets.sockets.values()].filter((x) =&gt; x.handshake.auth.user === 7).length;
      await r.sRem('presence:sockets:7', s.id); const scard = await r.sCard('presence:sockets:7');
      const a = performance.now(); const fs = (await io.in('user:7').fetchSockets()).length; const ms = (performance.now() - a).toFixed(1).replace('.', ',');
      const dg = (n) =&gt; &#96;\${n} ⇒ \${n ? 'online' : 'offline'} \${(n &gt; 0) === (conMo &gt; 0) ? '✓' : '✗'}&#96;;
      console.log(&#96;\${ten} (thật: còn \${conMo} tab) · quét worker này: \${dg(quet)} · SCARD: \${dg(scard)} · fetchSockets: \${dg(fs)} (\${ms} ms)&#96;);
    });
  });
  return io;
};
const w1 = await worker(19673, 'worker 1'), w2 = await worker(19674, 'worker 2');
const A = ketNoi('http://localhost:19673', { auth: { user: 7 }, transports: ['websocket'], forceNew: true });
const Bt = ketNoi('http://localhost:19674', { auth: { user: 7 }, transports: ['websocket'], forceNew: true });
await Promise.all([A, Bt].map((c) =&gt; new Promise((ok) =&gt; c.once('connect', ok)))); await cho(300);
console.log('— đóng tab A (worker 1), tab B vẫn mở ở worker 2 —');
conMo = 1; A.disconnect(); await cho(800);
console.log('— đóng tab B (worker 2), tab cuối —');
conMo = 0; Bt.disconnect(); await cho(800);
console.log(&#96;Redis còn: SMEMBERS presence:sockets:7 = \${JSON.stringify(await r.sMembers('presence:sockets:7'))}&#96;);
process.exit(0);</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-4-2-set" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 4.2 — Set: kiểm tra thành viên và đại số tập hợp</span><span class="lc-sub">SADD / SREM / SCARD sâu hơn</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-2-2-het-han" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 2.2 — Hết hạn thật sự hoạt động ra sao</span><span class="lc-sub">TTL dọn mục mồ côi</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-4-scale-adapter-backpressure" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 11.4 — Nhiều hơn một tiến trình: adapter, sticky session, và áp lực ngược</span><span class="lc-sub">Đúng tình huống hai worker của bài</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Nhiều tab</span><span class="v">Một user với nhiều socket mở cùng lúc.</span></div>
  <div class="kv"><span class="k">Reference counting</span><span class="v">Một <code>Set&lt;socketId&gt;</code> per <code>userId</code>; offline chỉ khi về 0.</span></div>
  <div class="kv"><span class="k"><code>lastSeen</code></span><span class="v">Một timestamp cho FE chọn hiển thị strict hay broad.</span></div>
  <div class="kv"><span class="k"><code>SADD</code>/<code>SCARD</code></span><span class="v">Thêm vào set và đếm phần tử của Redis — bộ đếm an toàn cụm.</span></div>
  <div class="kv"><span class="k">Set trong-process</span><span class="v">Một Set theo từng worker — KHÔNG share, nên hỏng trong cụm.</span></div>
  <div class="kv"><span class="k">Debounce offline</span><span class="v">Một trễ ngắn để một lần đổi tab nhanh không nháy offline.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Presence nhiều tab cần reference counting: một <code>Set&lt;socketId&gt;</code> per <code>userId</code>.</li><li>Chỉ emit offline khi set về 0 và không có debounce nào đã huỷ nó.</li><li>Ghép với một timestamp <code>lastSeen</code> để FE chọn hiển thị strict hay broad.</li><li>Trong cụm, set phải sống trong Redis (<code>SADD</code>/<code>SCARD</code>).</li><li>Một Set trong-process là theo từng worker và không share, nên hỏng khi scale.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Redis — SADD, SCARD, SREM</span><span class="lc-sub">redis.io/commands/sadd — atomic set operations, đủ cho multi-instance socket counting.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Bài 1.2 — disconnect reasons</span><span class="lc-sub">/courses/socket-io/learn${REF} — debounce cho &quot;transport close&quot; là chỗ multi-tab bug hay giấu.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 4.4 ─────────────────────────── */
    {
      title: '4.4 — Typing indicators: cost per keystroke|||4.4 — Typing indicator: cost mỗi phím gõ',
      slug: 'io-4-4-typing',
      type: 'VIDEO',
      description: 'Emit typing mỗi keystroke = spam. Debounce phía client 500ms, timeout auto-clear phía client 3s, không cần server nhớ.',
      content: `
${G04_4}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.4</span>
<h2>Typing indicators: cost per keystroke</h2>
<p class="lead">Typing indicators are the second most common presence-adjacent feature. The naive version emits an event per keystroke — with a fast typer that&#39;s ~10 events/second. For a 10-user thread, that&#39;s 100 events/second BROADCAST just for typing.</p>

<h3>Naive typer</h3>
<pre><code class="language-tsx">// FE naive
&lt;input onKeyDown={() =&gt; socket.emit('thread:typing', { threadId, userId })} /&gt;

// BE
socket.on('thread:typing', ({ threadId, userId }) =&gt; {
  socket.to(&#96;thread:\${threadId}&#96;).emit('thread:typing', userId);
});
</code></pre>

<div class="callout warn">
<p><strong>The cost in a busy chat:</strong> 10 people in a thread, each averaging 5 keystrokes a second. The server receives 50 events/second and fans each out to 9 people = 450 packets/second. For ONE thread. 100 threads = 45,000 packets/second just for typing indicators.</p>
</div>

<h3>Fix 1: debounce on the client</h3>
<p><em>Note:</em> the code below is a <strong>throttle</strong> (at most one emit per 3 s, fired at the START of the window); a debounce waits for a pause and fires once at the end — the &quot;stop&quot; timer is the debounce. Typing needs both.</p>
<pre><code class="language-tsx">// FE — chi emit khi bat dau go, khong emit lai neu dang go
let lastEmit = 0;
&lt;input onKeyDown={() =&gt; {
  const now = Date.now();
  if (now - lastEmit &gt; 3000) {   // chi emit toi da moi 3s
    socket.emit('thread:typing', { threadId });
    lastEmit = now;
  }
}} /&gt;
</code></pre>

<h3>Fix 2: an auto-clear timeout on the RECEIVING client</h3>
<pre><code class="language-tsx">// FE nhan — clear tu dong sau 3s neu khong nhan typing them
const typingTimers = new Map&lt;number, NodeJS.Timeout&gt;();

socket.on('thread:typing', (userId) =&gt; {
  setTypingUsers(prev =&gt; new Set(prev).add(userId));

  const existing = typingTimers.get(userId);
  if (existing) clearTimeout(existing);
  typingTimers.set(userId, setTimeout(() =&gt; {
    setTypingUsers(prev =&gt; {
      const next = new Set(prev); next.delete(userId); return next;
    });
    typingTimers.delete(userId);
  }, 3000));
});
</code></pre>

<div class="callout ok">
<p><strong>The server does NOT need to store typing state.</strong> Entirely ephemeral — if the user disconnects, the client-side timeout clears it. No special <code>disconnect</code> handler required. This is the ephemeral pattern (lesson 1.5) applied correctly.</p>
</div>

<h3>The cost after the fix</h3>
<div class="out">Truoc: 10 user * 5 keystroke/s * 9 receiver = 450 packet/s (1 thread)
Sau debounce 3s: 10 user * 0.33 emit/s * 9 receiver = ~30 packet/s (1 thread)
Tiet kiem: 15x
</div>

<h3>An explicit &quot;stop typing&quot; event — do you need one?</h3>
<pre><code class="language-tsx">// TUY CHON — emit khi user xoa het chu hoac blur input
&lt;input onBlur={() =&gt; socket.emit('thread:typing:stop', { threadId })} /&gt;
</code></pre>

<p>You could. But the client-side timeout already handles it. An explicit &quot;stop&quot; clears the UI up to 3s sooner, at the cost of DOUBLING event traffic (every typing session needs 2 events). This repo does NOT use one — the timeout is smooth enough. <strong>Checked 13/11/2026 — it does:</strong> <code>MessageInput.tsx</code> sends <code>isTyping:false</code> 3 s after the last key (line 154), on an empty box (156) and on send (204); <code>MiniChatDock.tsx</code> after 2 s. And it does NOT throttle the start: <code>isTyping:true</code> goes out on <em>every</em> keystroke (152 / 368). Measured cost of the stop: +9 packets per message in a 10-person room (36 vs 27), not double.</p>

<h3>A rate limit against DDoS</h3>
<pre><code class="language-ts">// Neu client bug hoac malicious, gioi han 5 emit/s
const rateLimiters = new Map&lt;string, { count: number; reset: number }&gt;();

socket.on('thread:typing', (data) =&gt; {
  const key = &#96;\${socket.id}:typing&#96;;
  const now = Date.now();
  const bucket = rateLimiters.get(key) ?? { count: 0, reset: now + 1000 };
  if (now &gt; bucket.reset) { bucket.count = 0; bucket.reset = now + 1000; }
  bucket.count++;
  if (bucket.count &gt; 5) return;   // im lang bo qua
  rateLimiters.set(key, bucket);

  socket.to(&#96;thread:\${data.threadId}&#96;).emit('thread:typing', data.userId);
});
</code></pre>

<div class="pitfall">
<p><strong>Trap — debouncing on the server instead of on the client.</strong> If the server does the debouncing, every socket still spams the server with events. The server saves only on BROADCAST, not on RECEIVE. Debouncing on the CLIENT saves both. Doing both (client debounce + server rate limit) is the standard.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Typing indicators need a CLIENT-side debounce (at most one emit every 3s) plus an auto-clear on the RECEIVING client (a 3s timeout after the last event) plus a server rate limit as backstop — the server stores no state, this is the ephemeral pattern (1.5) in its proper use case, and it cuts the cost 15× against emit-per-keystroke.</p>
</div>

<h3>Why a typing indicator needs two independent fixes</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">The naive version emits per keystroke</span><span class="lz-d">Sixty characters is sixty broadcasts to every member of the room. The payload is tiny and the request count is not.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Debouncing on the sender fixes the volume</span><span class="lz-d">One <code>typing</code> at the start, one <code>stop</code> after a pause. Two events for a whole message instead of sixty.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">But the receiver still needs a timeout</span><span class="lz-d">Because the <code>stop</code> can be lost — a closed tab, a dropped connection, a crashed client — and then the indicator stays on forever.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">So each fix covers a different failure</span><span class="lz-d">Debounce is about cost; the auto-clear is about correctness. Doing only one leaves either the bill or the stuck indicator.</span></div>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Build the naive version that emits <code>typing</code> on every keystroke and count the broadcasts for a 60-character message.</li>
<li>Add a client-side debounce (one <code>typing</code> at the start, one <code>stop</code> after a pause) and a server rate limit as a backstop; recount and see the ~15× drop.</li>
<li>On the receiving client, add a 3s auto-clear timeout and then drop the <code>stop</code> event — confirm the indicator still clears instead of sticking forever.</li>
</ol>
<p><strong>Done when:</strong> typing costs two events per message, the server holds no state, and a lost <code>stop</code> no longer sticks the indicator on.</p></div>

<h3>🔬 Measured: one 60-character message, a 10-person thread</h3>
<p>socket.io 4.8.3 — 8 keys per second; &quot;moi phim&quot; = true on every key + false after 3 s (this repo&#39;s frontend), &quot;chan 3 s&quot; = throttled true + false, &quot;chi bat&quot; = throttled, no false:</p>
<div class="out">$ node go.mjs
moi phim · 60 phím · server nhận 61 · gói tới 9 người 549
chan 3 s · 60 phím · server nhận  4 · gói tới 9 người  36
chi bat  · 60 phím · server nhận  3 · gói tới 9 người  27</div>
<p><strong>A client gone rogue</strong> — typing fired continuously for 2 s, no limit vs 5 per second per socket:</p>
<div class="out">$ node han.mjs
không giới hạn · client bắn 1510 lần trong 2 s · server phát lại 1510 · gói tới 9 người 13590
giới hạn 5/s   · client bắn 1581 lần trong 2 s · server phát lại   10 · gói tới 9 người    90</div>
<p><strong>The lost stop</strong> — the typer&#39;s tab dies mid-message; receiver A waits for false, receiver B auto-clears after 3.5 s:</p>
<div class="out">$ node ket.mjs
0,3 s  Nam đang gõ · A: ✍️ đang gõ · B: ✍️ đang gõ
0,3 s  tab của Nam bị đóng đột ngột — không có isTyping:false
3,0 s  A: ✍️ Nam đang gõ… (kẹt) · B: ✍️ đang gõ
3,5 s  B tự tắt (hết 3,5 s không có tin mới)
6,0 s  A: ✍️ Nam đang gõ… (kẹt) · B: — đã tắt</div>
<p><strong>In Chromium</strong> (Ha&#39;s tab): every key ⇒ 61 frames; throttled ⇒ 4. First frames of each:</p>
<div class="out">↓ 42["thread:typing",{"threadId":42,"userId":7,"isTyping":true}]   (943 ms)
↓ 42["thread:typing",{"threadId":42,"userId":7,"isTyping":true}]   (1069 ms)
↓ 42["thread:typing",{"threadId":42,"userId":7,"isTyping":true}]   (1197 ms)
↓ 42["thread:typing",{"threadId":42,"userId":7,"isTyping":true}]   (1323 ms)</div>
<div class="out">↓ 42["thread:typing",{"threadId":42,"userId":7,"isTyping":true}]   (923 ms)
↓ 42["thread:typing",{"threadId":42,"userId":7,"isTyping":true}]   (3971 ms)
↓ 42["thread:typing",{"threadId":42,"userId":7,"isTyping":true}]   (7017 ms)
↓ 42["thread:typing",{"threadId":42,"userId":7,"isTyping":false}]   (11418 ms)</div>
<p><strong>This repo:</strong></p>
<div class="out">$ grep -n "store.setTyping" frontend/src/components/messaging/MessageInput.tsx
152: store.setTyping(threadId, true);
154: typingTimerRef.current = setTimeout(() =&gt; store.setTyping(threadId, false), 3000);
156: store.setTyping(threadId, false);
204: store.setTyping(threadId, false);
$ grep -n "emitTyping(threadId\\|TYPING_DEBOUNCE_MS =" frontend/src/components/social/MiniChatDock.tsx
112:const TYPING_DEBOUNCE_MS = 2000;
368: emitTyping(threadId, true);
372: emitTyping(threadId, false);
$ grep -n "TYPING_TIMEOUT_MS =" frontend/src/store/messagingStore.ts
214:const TYPING_TIMEOUT_MS = 3500;
$ sed -n 535,550p src/socket/messaging.socket.ts | grep -c "rate\\|limit"
0</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-javascript"><span class="tok-comment">// Một tin 60 ký tự, gõ 8 phím/giây, trong thread 10 người (người gõ + 9 người nhận). Ba cách phát typing:</span>
<span class="tok-comment">//  'moi phim'  — isTyping:true ở MỌI phím + false sau 3 s ngừng (đúng như frontend của kho: MessageInput.tsx)</span>
<span class="tok-comment">//  'chan 3 s'  — true tối đa mỗi 3 s + false khi ngừng 3 s</span>
<span class="tok-comment">//  'chi bat'   — true tối đa mỗi 3 s, KHÔNG gửi false (người nhận tự tắt sau 3,5 s)</span>
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
const io = new Server(19680);
let nhanServer = 0;
io.on('connection', (s) =&gt; {
  s.join('thread:42');
  s.on('thread:typing', (p) =&gt; { nhanServer++; s.to('thread:42').emit('thread:typing', { userId: s.handshake.auth.user, isTyping: p.isTyping }); });
});
const ds = await Promise.all(Array.from({ length: 10 }, (_, i) =&gt; new Promise((r) =&gt; { const c = ketNoi('http://localhost:19680', { auth: { user: i }, transports: ['websocket'], forceNew: true }); c.on('connect', () =&gt; r(c)); })));
let nhanMay = 0; ds.slice(1).forEach((c) =&gt; c.on('thread:typing', () =&gt; nhanMay++));
const go = ds[0];
const TIN = 'Mai 7h30 họp nhóm ở thư viện nhé, nhớ mang laptop và bản in!';
for (const kieu of ['moi phim', 'chan 3 s', 'chi bat']) {
  nhanServer = 0; nhanMay = 0; let lanCuoi = 0, hen;
  for (const _ of TIN) {
    const now = Date.now();
    if (kieu === 'moi phim' || now - lanCuoi &gt; 3000) { go.emit('thread:typing', { threadId: 42, isTyping: true }); lanCuoi = now; }
    if (kieu !== 'chi bat') { clearTimeout(hen); hen = setTimeout(() =&gt; go.emit('thread:typing', { threadId: 42, isTyping: false }), 3000); }
    await cho(125);
  }
  await cho(3500);
  console.log(&#96;\${kieu.padEnd(8)} · \${TIN.length} phím · server nhận \${String(nhanServer).padStart(2)} · gói tới 9 người \${String(nhanMay).padStart(3)}&#96;);
}
process.exit(0);</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-4-4-custom-hook" target="_blank" rel="noopener"><span class="lc-ico">🟦</span><span class="lc-body"><span class="lc-title">React · 4.4 — Custom hooks: useDebounce, useLocalStorage…</span><span class="lc-sub">Write the debounce/throttle hook for the input</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-3-5-gioi-han-tan-suat" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 3.5 — Rate limiting, four ways</span><span class="lc-sub">The server-side backstop, shared across workers</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-12-4-nguyen-tu-rate-limit-lock" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 12.4 — Atomicity: rate limits and distributed locks done right</span><span class="lc-sub">When the limit must hold across processes</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Typing indicator</span><span class="v">The ephemeral &quot;… is typing&quot; signal in a chat.</span></div>
  <div class="kv"><span class="k">Client debounce</span><span class="v">At most one <code>typing</code> emit every ~3s, from the sender.</span></div>
  <div class="kv"><span class="k">Auto-clear</span><span class="v">A 3s timeout on the receiver that clears the indicator if <code>stop</code> is lost.</span></div>
  <div class="kv"><span class="k">Server rate limit</span><span class="v">A backstop that caps typing emits regardless of the client.</span></div>
  <div class="kv"><span class="k">Ephemeral pattern</span><span class="v">No server state — the proper use case of pattern 1.5.</span></div>
  <div class="kv"><span class="k">Cost vs correctness</span><span class="v">Debounce fixes cost; auto-clear fixes the stuck indicator.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Typing indicators need a CLIENT-side debounce — at most one emit every 3s.</li><li>Plus an auto-clear on the RECEIVING client — a 3s timeout after the last event.</li><li>Plus a server rate limit as a backstop; the server stores no state.</li><li>This is the ephemeral pattern (1.5) in its proper use case, cutting cost ~15×.</li><li>Debounce is about cost and auto-clear about correctness — you need both.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">socket.io — Rate limiting</span><span class="lc-sub">socket.io/get-started/basic-crud-application/#rate-limiting — pattern chuẩn cho server-side.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Lesson 1.5 — state patterns</span><span class="lc-sub">/courses/socket-io/learn${REF} — typing là ví dụ tuyệt vời cho ephemeral pattern.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.4</span>
<h2>Typing indicator: cost mỗi phím gõ</h2>
<p class="lead">Typing indicator là feature presence-adjacent phổ biến thứ hai. Phiên bản ngây thơ emit một event mỗi keystroke — với người gõ nhanh đó là ~10 events/giây. Cho thread 10 người, đó là 100 events/giây BROADCAST chỉ cho typing.</p>

<h3>Typer ngây thơ</h3>
<pre><code class="language-tsx">// FE ngay tho
&lt;input onKeyDown={() =&gt; socket.emit('thread:typing', { threadId, userId })} /&gt;

// BE
socket.on('thread:typing', ({ threadId, userId }) =&gt; {
  socket.to(&#96;thread:\${threadId}&#96;).emit('thread:typing', userId);
});
</code></pre>

<div class="callout warn">
<p><strong>Cost với chat busy:</strong> 10 người trong thread, mỗi người gõ 5 phím/giây trung bình. Server nhận 50 events/giây, phát mỗi cái đến 9 người = 450 packets/giây. Cho MỘT thread. 100 thread = 45.000 packets/giây cho typing indicator.</p>
</div>

<h3>Vá 1: debounce phía client</h3>
<p><em>Lưu ý:</em> đoạn mã dưới đây là <strong>throttle</strong> (chặn nhịp: tối đa một emit mỗi 3 s, gửi ngay ở ĐẦU khung); debounce là chờ ngừng rồi gửi một lần ở cuối — hẹn giờ &quot;stop&quot; mới là debounce. Typing cần cả hai.</p>
<pre><code class="language-tsx">// FE — chi emit khi bat dau go, khong emit lai neu dang go
let lastEmit = 0;
&lt;input onKeyDown={() =&gt; {
  const now = Date.now();
  if (now - lastEmit &gt; 3000) {   // chi emit toi da moi 3s
    socket.emit('thread:typing', { threadId });
    lastEmit = now;
  }
}} /&gt;
</code></pre>

<h3>Vá 2: timeout auto-clear phía CLIENT nhận</h3>
<pre><code class="language-tsx">// FE nhan — clear tu dong sau 3s neu khong nhan typing them
const typingTimers = new Map&lt;number, NodeJS.Timeout&gt;();

socket.on('thread:typing', (userId) =&gt; {
  setTypingUsers(prev =&gt; new Set(prev).add(userId));

  const existing = typingTimers.get(userId);
  if (existing) clearTimeout(existing);
  typingTimers.set(userId, setTimeout(() =&gt; {
    setTypingUsers(prev =&gt; {
      const next = new Set(prev); next.delete(userId); return next;
    });
    typingTimers.delete(userId);
  }, 3000));
});
</code></pre>

<div class="callout ok">
<p><strong>Server KHÔNG cần lưu typing state.</strong> Ephemeral hoàn toàn — nếu user disconnect, client-side timeout tự dọn. Không cần <code>disconnect</code> handler đặc biệt. Đây là ephemeral pattern (bài 1.5) đúng ứng dụng.</p>
</div>

<h3>Cost sau khi vá</h3>
<div class="out">Truoc: 10 user * 5 keystroke/s * 9 receiver = 450 packet/s (1 thread)
Sau debounce 3s: 10 user * 0.33 emit/s * 9 receiver = ~30 packet/s (1 thread)
Tiet kiem: 15x
</div>

<h3>&quot;Stop typing&quot; explicit event — cần không?</h3>
<pre><code class="language-tsx">// TUY CHON — emit khi user xoa het chu hoac blur input
&lt;input onBlur={() =&gt; socket.emit('thread:typing:stop', { threadId })} /&gt;
</code></pre>

<p>Có thể. Nhưng client-side timeout đã lo. &quot;Stop&quot; explicit giúp UI clear sớm hơn 3s, nhưng cost là DOUBLE event traffic (mỗi typing session cần 2 event). Kho này KHÔNG dùng — timeout đã đủ mượt. <strong>Kiểm 13/11/2026 — kho CÓ dùng:</strong> <code>MessageInput.tsx</code> gửi <code>isTyping:false</code> sau 3 s ngừng (dòng 154), khi ô trống (156) và khi gửi tin (204); <code>MiniChatDock.tsx</code> sau 2 s. Và kho KHÔNG chặn nhịp lúc bắt đầu: <code>isTyping:true</code> đi ở <em>mọi</em> phím (152 / 368). Đo chi phí của stop: thêm 9 gói mỗi tin trong phòng 10 người (36 vs 27), không phải gấp đôi.</p>

<h3>Rate limit chống DDoS</h3>
<pre><code class="language-ts">// Neu client bug hoac malicious, gioi han 5 emit/s
const rateLimiters = new Map&lt;string, { count: number; reset: number }&gt;();

socket.on('thread:typing', (data) =&gt; {
  const key = &#96;\${socket.id}:typing&#96;;
  const now = Date.now();
  const bucket = rateLimiters.get(key) ?? { count: 0, reset: now + 1000 };
  if (now &gt; bucket.reset) { bucket.count = 0; bucket.reset = now + 1000; }
  bucket.count++;
  if (bucket.count &gt; 5) return;   // im lang bo qua
  rateLimiters.set(key, bucket);

  socket.to(&#96;thread:\${data.threadId}&#96;).emit('thread:typing', data.userId);
});
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — debounce phía server thay vì phía client.</strong> Nếu server debounce, mỗi socket vẫn spam server bằng events. Server chỉ tiết kiệm BROADCAST, không tiết kiệm RECEIVE. Debounce phía CLIENT giảm cả hai. Đặt cả hai (client debounce + server rate limit) là chuẩn.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Typing indicator cần debounce phía CLIENT (chỉ emit mỗi 3s tối đa) + auto-clear phía CLIENT nhận (timeout 3s sau event cuối) + server rate limit backstop — server không cần lưu state, đây là ephemeral pattern (1.5) đúng use case và giảm cost 15× so với emit-per-keystroke.</p>
</div>

<h3>Vì sao một chỉ báo đang-gõ cần hai cách chữa độc lập</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Bản ngây thơ phát sự kiện ở mỗi phím gõ</span><span class="lz-d">Sáu mươi ký tự là sáu mươi lần phát tới mọi thành viên trong phòng. Phần dữ liệu thì bé tí còn số lượng request thì không.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Debounce ở phía người gửi chữa được số lượng</span><span class="lz-d">Một sự kiện <code>typing</code> lúc bắt đầu, một <code>stop</code> sau một quãng ngừng. Hai sự kiện cho cả một tin nhắn thay vì sáu mươi.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Nhưng phía nhận vẫn cần một thời gian chờ</span><span class="lz-d">Vì cái <code>stop</code> có thể bị mất — một tab bị đóng, một kết nối bị rớt, một client bị sập — và rồi cái chỉ báo sáng mãi mãi.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Nên mỗi cách chữa phủ một kiểu hỏng khác nhau</span><span class="lz-d">Debounce là chuyện chi phí; tự-động-tắt là chuyện đúng đắn. Làm mỗi một cái thì hoặc còn cái hoá đơn hoặc còn cái chỉ báo kẹt.</span></div>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Dựng bản ngây thơ emit <code>typing</code> ở mỗi phím gõ và đếm số broadcast cho một tin 60 ký tự.</li>
<li>Thêm debounce phía client (một <code>typing</code> lúc bắt đầu, một <code>stop</code> sau một quãng ngừng) và một server rate limit làm backstop; đếm lại và thấy mức giảm ~15×.</li>
<li>Ở client nhận, thêm một timeout auto-clear 3s rồi bỏ event <code>stop</code> — xác nhận chỉ báo vẫn tắt thay vì kẹt mãi.</li>
</ol>
<p><strong>Đạt khi:</strong> typing tốn hai event mỗi tin, server không giữ state, và một <code>stop</code> bị mất không còn làm chỉ báo kẹt sáng.</p></div>

<h3>🔬 Đo thật: một tin 60 ký tự, thread 10 người</h3>
<p>socket.io 4.8.3 — 8 phím mỗi giây; &quot;moi phim&quot; = true ở mọi phím + false sau 3 s (đúng frontend của kho), &quot;chan 3 s&quot; = chặn nhịp true + false, &quot;chi bat&quot; = chặn nhịp, không false:</p>
<div class="out">$ node go.mjs
moi phim · 60 phím · server nhận 61 · gói tới 9 người 549
chan 3 s · 60 phím · server nhận  4 · gói tới 9 người  36
chi bat  · 60 phím · server nhận  3 · gói tới 9 người  27</div>
<p><strong>Một client lỗi</strong> — bắn typing liên tục 2 s, không giới hạn vs 5 lần mỗi giây mỗi socket:</p>
<div class="out">$ node han.mjs
không giới hạn · client bắn 1510 lần trong 2 s · server phát lại 1510 · gói tới 9 người 13590
giới hạn 5/s   · client bắn 1581 lần trong 2 s · server phát lại   10 · gói tới 9 người    90</div>
<p><strong>Gói stop bị mất</strong> — tab người gõ chết giữa chừng; người nhận A chờ false, người nhận B tự tắt sau 3,5 s:</p>
<div class="out">$ node ket.mjs
0,3 s  Nam đang gõ · A: ✍️ đang gõ · B: ✍️ đang gõ
0,3 s  tab của Nam bị đóng đột ngột — không có isTyping:false
3,0 s  A: ✍️ Nam đang gõ… (kẹt) · B: ✍️ đang gõ
3,5 s  B tự tắt (hết 3,5 s không có tin mới)
6,0 s  A: ✍️ Nam đang gõ… (kẹt) · B: — đã tắt</div>
<p><strong>Trong Chromium</strong> (tab của Hà): mọi phím ⇒ 61 khung; chặn nhịp ⇒ 4. Mấy khung đầu của mỗi lượt:</p>
<div class="out">↓ 42["thread:typing",{"threadId":42,"userId":7,"isTyping":true}]   (943 ms)
↓ 42["thread:typing",{"threadId":42,"userId":7,"isTyping":true}]   (1069 ms)
↓ 42["thread:typing",{"threadId":42,"userId":7,"isTyping":true}]   (1197 ms)
↓ 42["thread:typing",{"threadId":42,"userId":7,"isTyping":true}]   (1323 ms)</div>
<div class="out">↓ 42["thread:typing",{"threadId":42,"userId":7,"isTyping":true}]   (923 ms)
↓ 42["thread:typing",{"threadId":42,"userId":7,"isTyping":true}]   (3971 ms)
↓ 42["thread:typing",{"threadId":42,"userId":7,"isTyping":true}]   (7017 ms)
↓ 42["thread:typing",{"threadId":42,"userId":7,"isTyping":false}]   (11418 ms)</div>
<p><strong>Kho này:</strong></p>
<div class="out">$ grep -n "store.setTyping" frontend/src/components/messaging/MessageInput.tsx
152: store.setTyping(threadId, true);
154: typingTimerRef.current = setTimeout(() =&gt; store.setTyping(threadId, false), 3000);
156: store.setTyping(threadId, false);
204: store.setTyping(threadId, false);
$ grep -n "emitTyping(threadId\\|TYPING_DEBOUNCE_MS =" frontend/src/components/social/MiniChatDock.tsx
112:const TYPING_DEBOUNCE_MS = 2000;
368: emitTyping(threadId, true);
372: emitTyping(threadId, false);
$ grep -n "TYPING_TIMEOUT_MS =" frontend/src/store/messagingStore.ts
214:const TYPING_TIMEOUT_MS = 3500;
$ sed -n 535,550p src/socket/messaging.socket.ts | grep -c "rate\\|limit"
0</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-javascript"><span class="tok-comment">// Một tin 60 ký tự, gõ 8 phím/giây, trong thread 10 người (người gõ + 9 người nhận). Ba cách phát typing:</span>
<span class="tok-comment">//  'moi phim'  — isTyping:true ở MỌI phím + false sau 3 s ngừng (đúng như frontend của kho: MessageInput.tsx)</span>
<span class="tok-comment">//  'chan 3 s'  — true tối đa mỗi 3 s + false khi ngừng 3 s</span>
<span class="tok-comment">//  'chi bat'   — true tối đa mỗi 3 s, KHÔNG gửi false (người nhận tự tắt sau 3,5 s)</span>
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
const io = new Server(19680);
let nhanServer = 0;
io.on('connection', (s) =&gt; {
  s.join('thread:42');
  s.on('thread:typing', (p) =&gt; { nhanServer++; s.to('thread:42').emit('thread:typing', { userId: s.handshake.auth.user, isTyping: p.isTyping }); });
});
const ds = await Promise.all(Array.from({ length: 10 }, (_, i) =&gt; new Promise((r) =&gt; { const c = ketNoi('http://localhost:19680', { auth: { user: i }, transports: ['websocket'], forceNew: true }); c.on('connect', () =&gt; r(c)); })));
let nhanMay = 0; ds.slice(1).forEach((c) =&gt; c.on('thread:typing', () =&gt; nhanMay++));
const go = ds[0];
const TIN = 'Mai 7h30 họp nhóm ở thư viện nhé, nhớ mang laptop và bản in!';
for (const kieu of ['moi phim', 'chan 3 s', 'chi bat']) {
  nhanServer = 0; nhanMay = 0; let lanCuoi = 0, hen;
  for (const _ of TIN) {
    const now = Date.now();
    if (kieu === 'moi phim' || now - lanCuoi &gt; 3000) { go.emit('thread:typing', { threadId: 42, isTyping: true }); lanCuoi = now; }
    if (kieu !== 'chi bat') { clearTimeout(hen); hen = setTimeout(() =&gt; go.emit('thread:typing', { threadId: 42, isTyping: false }), 3000); }
    await cho(125);
  }
  await cho(3500);
  console.log(&#96;\${kieu.padEnd(8)} · \${TIN.length} phím · server nhận \${String(nhanServer).padStart(2)} · gói tới 9 người \${String(nhanMay).padStart(3)}&#96;);
}
process.exit(0);</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-4-4-custom-hook" target="_blank" rel="noopener"><span class="lc-ico">🟦</span><span class="lc-body"><span class="lc-title">React · 4.4 — Hook tự viết: useDebounce, useLocalStorage, useTieuDeTrang và quy tắc hook</span><span class="lc-sub">Viết hook chặn nhịp / chờ ngừng cho ô nhập</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-3-5-gioi-han-tan-suat" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 3.5 — Giới hạn tần suất, bốn cách</span><span class="lc-sub">Lưới đỡ phía server, chung cho mọi worker</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-12-4-nguyen-tu-rate-limit-lock" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 12.4 — Tính nguyên tử: giới hạn tần suất và khoá phân tán làm cho đúng</span><span class="lc-sub">Khi giới hạn phải đúng qua nhiều tiến trình</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Typing indicator</span><span class="v">Tín hiệu ephemeral &quot;… đang gõ&quot; trong một cuộc chat.</span></div>
  <div class="kv"><span class="k">Debounce phía client</span><span class="v">Tối đa một emit <code>typing</code> mỗi ~3s, từ người gửi.</span></div>
  <div class="kv"><span class="k">Auto-clear</span><span class="v">Một timeout 3s ở phía nhận, tắt chỉ báo nếu <code>stop</code> bị mất.</span></div>
  <div class="kv"><span class="k">Server rate limit</span><span class="v">Một backstop chặn số emit typing bất kể client.</span></div>
  <div class="kv"><span class="k">Ephemeral pattern</span><span class="v">Không state server — đúng use case của pattern 1.5.</span></div>
  <div class="kv"><span class="k">Chi phí vs đúng đắn</span><span class="v">Debounce chữa chi phí; auto-clear chữa chỉ báo kẹt.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Typing indicator cần một debounce phía CLIENT — tối đa một emit mỗi 3s.</li><li>Cộng một auto-clear ở client NHẬN — một timeout 3s sau event cuối.</li><li>Cộng một server rate limit làm backstop; server không giữ state.</li><li>Đây là ephemeral pattern (1.5) đúng use case, giảm cost ~15×.</li><li>Debounce lo chi phí, auto-clear lo đúng đắn — cần cả hai.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">socket.io — Rate limiting</span><span class="lc-sub">socket.io/get-started/basic-crud-application/#rate-limiting — pattern chuẩn cho server-side.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Bài 1.5 — state patterns</span><span class="lc-sub">/courses/socket-io/learn${REF} — typing là ví dụ tuyệt vời cho ephemeral pattern.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 4.5 ─────────────────────────── */
    {
      title: '4.5 — Read receipts: three visibility levels|||4.5 — Read receipt: ba mức hiển thị',
      slug: 'io-4-5-read-receipt',
      type: 'VIDEO',
      description: 'Đã gửi (server ack), đã đến (client ack), đã xem (user thao tác). Mỗi cái là quyết định UX + technical khác nhau.',
      content: `
${G04_5}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.5</span>
<h2>Read receipts: three visibility levels</h2>
<p class="lead">Messenger's &quot;Seen&quot; is a familiar feature. It hides three distinct levels — and all three differ in both technical implementation and UX signalling.</p>

<h3>The three levels</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">SENT — the server has stored it</span><span class="lz-d">Client emit <code>chat:send</code>, the server persists to the DB and the ack succeeds. The UI shows a &quot;sent&quot; icon (one tick). No realtime needed — an HTTP POST would do.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">DELIVERED — the client has received it</span><span class="lz-d">Server broadcast <code>chat:new-message</code> to the room, and each recipient socket acks back &quot;got it&quot;. The server updates <code>deliveredAt</code>. The UI shows a double tick. Requires sockets plus acks (lesson 6.x).</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">READ — the user actually looked at it</span><span class="lz-d">The user scrolls to the message OR opens the thread. The client emits <code>chat:mark-read</code>. Server update <code>readAt</code>, which is broadcast back to the sender. The UI turns the tick blue. Requires detecting that the user saw it.</span></div>
</div>

<h3>SENT — the easiest</h3>
<pre><code class="language-ts">socket.emit('chat:send', { threadId, text }, (ack) =&gt; {
  if (ack.ok) markSent(ack.messageId);
});

// Server
socket.on('chat:send', async ({ threadId, text }, ack) =&gt; {
  const msg = await prisma.message.create({ data: { threadId, text, userId } });
  ack({ ok: true, messageId: msg.id });
  io.to(&#96;thread:\${threadId}&#96;).emit('chat:new-message', msg);
});
</code></pre>

<h3>DELIVERED — needs an ack from the recipient</h3>
<pre><code class="language-ts">// Server: nhan chat:new-message
socket.on('chat:new-message-ack', async ({ messageId }) =&gt; {
  await prisma.messageDelivery.upsert({
    where: { messageId_userId: { messageId, userId: socket.data.userId } },
    create: { messageId, userId: socket.data.userId, deliveredAt: new Date() },
    update: {},
  });
  // Bao sender
  io.to(&#96;user:\${msg.senderId}&#96;).emit('chat:delivered', { messageId, userId });
});
</code></pre>

<div class="callout warn">
<p><strong>DELIVERED is not READ.</strong> Delivered means &quot;the client received the packet&quot;. The user may have closed the tab, never scrolled to it, never looked — but the packet arrived. Do not collapse these two concepts.</p>
</div>

<h3>READ — needs detection that the user genuinely saw it</h3>
<pre><code class="language-tsx">// FE — IntersectionObserver detect message vao view
const observer = new IntersectionObserver((entries) =&gt; {
  entries.forEach(entry =&gt; {
    if (entry.isIntersecting) {
      const messageId = entry.target.dataset.msgId;
      socket.emit('chat:mark-read', { messageId });
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

// Con phai check tab visible + focus + user thuc su xem, khong just scroll qua nhanh
</code></pre>

<h3>Optimization — batch mark-read</h3>
<pre><code class="language-tsx">// KHONG emit tung message
// Batch nhieu message cung luc va emit 1 event
const readBuffer = new Set&lt;number&gt;();
setInterval(() =&gt; {
  if (readBuffer.size === 0) return;
  socket.emit('chat:mark-read-batch', { messageIds: [...readBuffer] });
  readBuffer.clear();
}, 500);
</code></pre>

<h3>Cost — why read receipts so often come with an off switch</h3>
<div class="out">Chat 10 nguoi rat busy, moi nguoi doc 100 tin/gio
Read receipt: 10 * 100 = 1.000 mark-read events/gio/thread
Broadcast toi sender: 1.000 update UI events

Voi 1.000 thread dong thoi: 1.000.000 update/gio
</div>

<p>That cost is real. Many apps let users turn it off (Messenger has a &quot;turn off read receipts&quot; setting) not for privacy — but to cut server cost. <strong>Correction (13/11/2026):</strong> the reason apps such as WhatsApp state for the switch is <em>privacy</em>; the saved writes and pushes are a side effect. And measured: batching cuts events (100 ⇒ 10) but not writes (still 100) — a per-thread <strong>watermark</strong> (&quot;read up to t&quot;) is 1 event, 1 row.</p>

<div class="pitfall">
<p><strong>Trap — treating DELIVERED as READ.</strong> The double tick (delivered) and the blue tick (read) are two different levels. If you treat delivered as read, users see &quot;seen&quot; even when the recipient never opened the tab. A serious UX bug, because people believe what that tick says. <strong>This repo has a close cousin (checked 13/11/2026):</strong> <code>messagingStore.ts:1336</code> marks the open thread read when a message arrives <em>without</em> checking <code>document.visibilityState</code> (the check exists at line 1262 but only gates the sound). Measured in Chromium with the same logic: thread open in a hidden tab ⇒ the sender saw &quot;seen&quot; 3 ms later.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Read receipts have three distinct levels (SENT is a server ack, DELIVERED a client ack, READ a visibility signal) — each needs a different implementation (a DB ack, a socket ack plus a Prisma upsert, an IntersectionObserver plus batching) and a different UX signal (one tick, two ticks, a blue tick) — and the cost is high enough that many apps let users switch it off.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Implement SENT as a server ack on message receipt (a DB write) and render one tick.</li>
<li>Implement DELIVERED as a client ack plus a Prisma upsert and render two ticks.</li>
<li>Implement READ with an <code>IntersectionObserver</code> on the client plus batching, and render the blue tick — then estimate the per-message cost and note why apps let users turn it off.</li>
</ol>
<p><strong>Done when:</strong> you can name the different mechanism and UX signal for each of SENT, DELIVERED and READ.</p></div>

<h3>🔬 Measured: one message, three levels</h3>
<p>socket.io 4.8.3 + Postgres 16 — SENT = ack after INSERT, DELIVERED = per-device ack, READ = the recipient opens the thread (1.5 s later):</p>
<div class="out">$ node bang45.mjs
bảng: messages · message_deliveries (đã nhận, từng tin) · message_reads (đã đọc, MỐC mỗi thread) · message_seen (đã đọc, từng tin)
$ node ba.mjs
   16,2 ms  Nam thấy ✓ SENT (server đã lưu, id 1)
   16,6 ms  máy Hà nhận tin #1 — gửi ack "đã nhận"
   18,7 ms  Nam thấy ✓✓ DELIVERED (#1, máy của user 9)
 1519,0 ms  Hà mở thread, tin hiện trên màn hình — gửi chat:mark-read
 1522,1 ms  Nam thấy 🔵 READ (Hà đã xem)
Postgres: messages 1 · message_deliveries 1 · message_reads 1</div>
<p><strong>Ha scrolls through 100 messages</strong> — per message vs batched every 500 ms vs a per-thread watermark:</p>
<div class="out">$ node lo.mjs
mỗi tin    · 100 tin · event lên 100 · lượt ghi DB 100 · gói về Nam 100
gom 500 ms · 100 tin · event lên  10 · lượt ghi DB 100 · gói về Nam  10
mốc thread · 100 tin · event lên   1 · lượt ghi DB   1 · gói về Nam   1</div>
<p><strong>A hidden tab in Chromium</strong> — thread open, tab hidden, a new message arrives; page marking read like this repo vs waiting until visible:</p>
<div class="out">$ cat nam45-kho.txt nam45-sua.txt
[kho] Nam thấy: ✓✓ 🔵 Đã xem (sau 3 ms) — trong khi tab của Hà đang ẨN ✗
[sua] Nam thấy: ✓ Đã gửi — chưa xem ✓ (tab của Hà đang ẩn)</div>
<p><strong>This repo:</strong></p>
<div class="out">$ grep -n "model MessageRead" -A4 prisma/schema.prisma
3392:model MessageRead {
3393- id Int @id @default(autoincrement())
3394- threadId Int @map("thread_id")
3395- userId Int @map("user_id")
3396- lastReadAt DateTime @map("last_read_at")
$ grep -n "router.patch('/threads/:id/read'\\|router.get('/threads/:id/reads'" src/routes/messages.routes.ts
195:router.get('/threads/:id/reads', async (req: Request, res: Response, next: NextFunction) =&gt; {
207:router.patch('/threads/:id/read', async (req: Request, res: Response, next: NextFunction) =&gt; {
$ grep -n "If the message came in for the open thread" -A3 frontend/src/store/messagingStore.ts
1335: // If the message came in for the open thread, also mark read
1336- if (get().currentThreadId === threadId &amp;&amp; !isOwn) {
1337- get().markRead(threadId);
1338- }
$ grep -n "const dangXem" -A1 frontend/src/store/messagingStore.ts
1262: const dangXem = truoc.currentThreadId === threadId
1263- &amp;&amp; (typeof document === 'undefined' || document.visibilityState === 'visible');
$ grep -rln "delivered" src/ frontend/src/components/messaging | wc -l
       0</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-javascript"><span class="tok-comment">// Một tin Nam (7) → Hà (9), đo mốc ba mức: SENT (server lưu + ack) · DELIVERED (máy Hà ack) · READ (Hà thật sự nhìn thấy).</span>
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
import pg from 'pg';
const db = new pg.Pool({ connectionString: 'postgres://postgres:lab@127.0.0.1:19660/postgres' });
const io = new Server(19690);
io.on('connection', (s) =&gt; {
  const u = s.handshake.auth.user; s.join(&#96;user:\${u}&#96;); s.join('thread:42');
  s.on('chat:send', async ({ text }, ack) =&gt; {
    const { rows: [m] } = await db.query('INSERT INTO messages (thread_id, sender_id, text) VALUES (42, $1, $2) RETURNING id', [u, text]);
    ack({ ok: true, id: m.id });                                                      <span class="tok-comment">  // ① SENT</span>
    s.to('thread:42').timeout(5000).emit('chat:new-message', { id: m.id, text, from: u }, async (err, tra) =&gt; {
      for (const r of tra ?? []) {
        await db.query('INSERT INTO message_deliveries VALUES ($1, $2, now()) ON CONFLICT DO NOTHING', [m.id, r.user]);
        io.to(&#96;user:\${u}&#96;).emit('chat:delivered', { id: m.id, user: r.user });        <span class="tok-comment">  // ② DELIVERED</span>
      }
    });
  });
  s.on('chat:mark-read', async ({ threadId }) =&gt; {
    await db.query(&#96;INSERT INTO message_reads VALUES ($1, $2, now()) ON CONFLICT (thread_id, user_id) DO UPDATE SET last_read_at = now()&#96;, [threadId, u]);
    s.to(&#96;thread:\${threadId}&#96;).emit('chat:read', { threadId, user: u });               <span class="tok-comment">  // ③ READ</span>
  });
});
const moi = (u) =&gt; new Promise((r) =&gt; { const c = ketNoi('http://localhost:19690', { auth: { user: u }, transports: ['websocket'], forceNew: true }); c.on('connect', () =&gt; r(c)); });
const [nam, ha] = await Promise.all([moi(7), moi(9)]);
let t0; const ms = () =&gt; &#96;\${(performance.now() - t0).toFixed(1).replace('.', ',').padStart(7)} ms&#96;;
ha.on('chat:new-message', (m, ack) =&gt; { console.log(&#96;\${ms()}  máy Hà nhận tin #\${m.id} — gửi ack "đã nhận"&#96;); ack({ user: 9 });
  setTimeout(() =&gt; { console.log(&#96;\${ms()}  Hà mở thread, tin hiện trên màn hình — gửi chat:mark-read&#96;); ha.emit('chat:mark-read', { threadId: 42 }); }, 1500); });
const xong = new Promise((r) =&gt; nam.on('chat:read', r));
nam.on('chat:delivered', (d) =&gt; console.log(&#96;\${ms()}  Nam thấy ✓✓ DELIVERED (#\${d.id}, máy của user \${d.user})&#96;));
t0 = performance.now();
nam.emit('chat:send', { text: 'Mai họp lúc 7h30 nhé' }, (a) =&gt; console.log(&#96;\${ms()}  Nam thấy ✓ SENT (server đã lưu, id \${a.id})&#96;));
await xong; console.log(&#96;\${ms()}  Nam thấy 🔵 READ (Hà đã xem)&#96;);
const { rows } = await db.query(&#96;SELECT (SELECT count(*) FROM messages) m, (SELECT count(*) FROM message_deliveries) d, (SELECT count(*) FROM message_reads) r&#96;);
console.log(&#96;Postgres: messages \${rows[0].m} · message_deliveries \${rows[0].d} · message_reads \${rows[0].r}&#96;);
process.exit(0);</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-4-2-tin-cay" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking · 4.2 — Reliability: sequence numbers, ACK and retransmission</span><span class="lc-sub">A TCP ACK means the bytes arrived — like DELIVERED, not READ</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/postgresql/learn?lessonSlug=postgresql-4-1-insert" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL · 4.1 — INSERT: many rows, RETURNING & UPSERT</span><span class="lc-sub">The two statements behind the three levels</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">SENT</span><span class="v">A server ack that the message was received by the server (one tick).</span></div>
  <div class="kv"><span class="k">DELIVERED</span><span class="v">A client ack plus a Prisma upsert that it reached the device (two ticks).</span></div>
  <div class="kv"><span class="k">READ</span><span class="v">A visibility signal that the user actually saw it (blue tick).</span></div>
  <div class="kv"><span class="k"><code>IntersectionObserver</code></span><span class="v">The browser API that detects a message entering the viewport.</span></div>
  <div class="kv"><span class="k">Batching</span><span class="v">Grouping READ signals so you do not emit one per message.</span></div>
  <div class="kv"><span class="k">Opt-out</span><span class="v">Many apps let users disable receipts because the cost is high.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Read receipts have three distinct levels: SENT, DELIVERED, READ.</li><li>SENT is a server ack, DELIVERED a client ack plus a DB upsert, READ a visibility signal.</li><li>Each needs a different mechanism and a different UX signal (one, two, blue tick).</li><li>READ uses an <code>IntersectionObserver</code> plus batching to keep cost down.</li><li>The cost is high enough that many apps let users switch receipts off.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — IntersectionObserver</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API — API chuẩn để detect element vào viewport.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 6 — acks</span><span class="lc-sub">/courses/socket-io/learn${REF} — DELIVERED cần ack đúng cách để không mất khi client offline lúc receive.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.5</span>
<h2>Read receipt: ba mức hiển thị</h2>
<p class="lead">&quot;Đã xem&quot; ở Messenger là feature quen thuộc. Nó ẩn chứa ba mức tách biệt — và cả ba đều cần khác nhau về technical implementation và UX signalling.</p>

<h3>Ba mức</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">SENT — server đã lưu</span><span class="lz-d">Client emit <code>chat:send</code>, server persist DB, ack thành công. UI hiện icon &quot;đã gửi&quot; (một dấu tick). Không cần realtime — HTTP POST cũng làm được.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">DELIVERED — client đã nhận</span><span class="lz-d">Server broadcast <code>chat:new-message</code> đến room, mỗi socket recipient ack lại &quot;got it&quot;. Server cập nhật <code>deliveredAt</code>. UI hiện tick đôi. Cần socket + ack (bài 6.x).</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">READ — user thao tác thấy</span><span class="lz-d">User scroll đến message HOẶC mở thread. Client emit <code>chat:mark-read</code>. Server update <code>readAt</code>, broadcast lại cho sender. UI tick xanh. Cần detection user thấy.</span></div>
</div>

<h3>SENT — dễ nhất</h3>
<pre><code class="language-ts">socket.emit('chat:send', { threadId, text }, (ack) =&gt; {
  if (ack.ok) markSent(ack.messageId);
});

// Server
socket.on('chat:send', async ({ threadId, text }, ack) =&gt; {
  const msg = await prisma.message.create({ data: { threadId, text, userId } });
  ack({ ok: true, messageId: msg.id });
  io.to(&#96;thread:\${threadId}&#96;).emit('chat:new-message', msg);
});
</code></pre>

<h3>DELIVERED — cần ack từ recipient</h3>
<pre><code class="language-ts">// Server: nhan chat:new-message
socket.on('chat:new-message-ack', async ({ messageId }) =&gt; {
  await prisma.messageDelivery.upsert({
    where: { messageId_userId: { messageId, userId: socket.data.userId } },
    create: { messageId, userId: socket.data.userId, deliveredAt: new Date() },
    update: {},
  });
  // Bao sender
  io.to(&#96;user:\${msg.senderId}&#96;).emit('chat:delivered', { messageId, userId });
});
</code></pre>

<div class="callout warn">
<p><strong>DELIVERED khác READ.</strong> Delivered = &quot;client đã nhận packet&quot;. User có thể đóng tab, chưa scroll đến, chưa nhìn — nhưng packet đã đến. Đừng gộp hai concept này.</p>
</div>

<h3>READ — cần detection user actual xem</h3>
<pre><code class="language-tsx">// FE — IntersectionObserver detect message vao view
const observer = new IntersectionObserver((entries) =&gt; {
  entries.forEach(entry =&gt; {
    if (entry.isIntersecting) {
      const messageId = entry.target.dataset.msgId;
      socket.emit('chat:mark-read', { messageId });
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

// Con phai check tab visible + focus + user thuc su xem, khong just scroll qua nhanh
</code></pre>

<h3>Tối ưu — batch mark-read</h3>
<pre><code class="language-tsx">// KHONG emit tung message
// Batch nhieu message cung luc va emit 1 event
const readBuffer = new Set&lt;number&gt;();
setInterval(() =&gt; {
  if (readBuffer.size === 0) return;
  socket.emit('chat:mark-read-batch', { messageIds: [...readBuffer] });
  readBuffer.clear();
}, 500);
</code></pre>

<h3>Cost — vì sao read receipts hay tắt được</h3>
<div class="out">Chat 10 nguoi rat busy, moi nguoi doc 100 tin/gio
Read receipt: 10 * 100 = 1.000 mark-read events/gio/thread
Broadcast toi sender: 1.000 update UI events

Voi 1.000 thread dong thoi: 1.000.000 update/gio
</div>

<p>Đó là cost thật. Nhiều app cho user tắt (Messenger có setting &quot;turn off read receipts&quot;) không phải cho privacy — mà để giảm cost server. <strong>Đính chính (13/11/2026):</strong> lý do các app như WhatsApp công bố cho công tắc này là <em>quyền riêng tư</em>; bớt ghi và bớt đẩy là phần phụ. Và đo thật: gom batch giảm số event (100 ⇒ 10) nhưng không giảm lượt ghi (vẫn 100) — một <strong>mốc</strong> theo thread (&quot;đã đọc tới t&quot;) là 1 event, 1 hàng.</p>

<div class="pitfall">
<p><strong>Bẫy — dùng DELIVERED làm READ.</strong> Tick đôi (delivered) và tick xanh (read) là hai mức khác nhau. Nếu bạn dùng delivered = read, user thấy &quot;đã xem&quot; ngay cả khi họ chưa mở tab. Bug UX nghiêm trọng vì user tin điều đó. <strong>Kho này có một biến thể gần (kiểm 13/11/2026):</strong> <code>messagingStore.ts:1336</code> đánh dấu đọc thread đang mở khi tin tới mà <em>không</em> kiểm <code>document.visibilityState</code> (kiểm tra ấy có ở dòng 1262 nhưng chỉ dùng cho tiếng). Đo trong Chromium với đúng logic đó: thread mở trong tab ẩn ⇒ người gửi thấy &quot;đã xem&quot; sau 3 ms.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Read receipts có ba mức tách biệt (SENT server-ack, DELIVERED client-ack, READ user-visibility) — mỗi cái cần technical implementation khác (DB ack, socket ack + prisma upsert, IntersectionObserver + batch) và UX signal khác (một tick, hai tick, tick xanh) — cost cao khiến nhiều app cho user tắt được.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Cài SENT là một server ack khi nhận tin (một DB write) và vẽ một tick.</li>
<li>Cài DELIVERED là một client ack cộng một Prisma upsert và vẽ hai tick.</li>
<li>Cài READ với một <code>IntersectionObserver</code> phía client cộng batching, và vẽ tick xanh — rồi ước lượng cost mỗi tin và nêu vì sao app cho user tắt.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn gọi tên được cơ chế và tín hiệu UX khác nhau cho mỗi SENT, DELIVERED và READ.</p></div>

<h3>🔬 Đo thật: một tin, ba mức</h3>
<p>socket.io 4.8.3 + Postgres 16 — ĐÃ GỬI = ack sau INSERT, ĐÃ NHẬN = ack từng thiết bị, ĐÃ XEM = người nhận mở thread (1,5 s sau):</p>
<div class="out">$ node bang45.mjs
bảng: messages · message_deliveries (đã nhận, từng tin) · message_reads (đã đọc, MỐC mỗi thread) · message_seen (đã đọc, từng tin)
$ node ba.mjs
   16,2 ms  Nam thấy ✓ SENT (server đã lưu, id 1)
   16,6 ms  máy Hà nhận tin #1 — gửi ack "đã nhận"
   18,7 ms  Nam thấy ✓✓ DELIVERED (#1, máy của user 9)
 1519,0 ms  Hà mở thread, tin hiện trên màn hình — gửi chat:mark-read
 1522,1 ms  Nam thấy 🔵 READ (Hà đã xem)
Postgres: messages 1 · message_deliveries 1 · message_reads 1</div>
<p><strong>Hà cuộn qua 100 tin</strong> — từng tin vs gom mỗi 500 ms vs một mốc cho thread:</p>
<div class="out">$ node lo.mjs
mỗi tin    · 100 tin · event lên 100 · lượt ghi DB 100 · gói về Nam 100
gom 500 ms · 100 tin · event lên  10 · lượt ghi DB 100 · gói về Nam  10
mốc thread · 100 tin · event lên   1 · lượt ghi DB   1 · gói về Nam   1</div>
<p><strong>Tab ẩn trong Chromium</strong> — thread đang mở, tab bị ẩn, tin mới tới; trang đánh dấu đọc như kho vs chờ tới khi tab hiện:</p>
<div class="out">$ cat nam45-kho.txt nam45-sua.txt
[kho] Nam thấy: ✓✓ 🔵 Đã xem (sau 3 ms) — trong khi tab của Hà đang ẨN ✗
[sua] Nam thấy: ✓ Đã gửi — chưa xem ✓ (tab của Hà đang ẩn)</div>
<p><strong>Kho này:</strong></p>
<div class="out">$ grep -n "model MessageRead" -A4 prisma/schema.prisma
3392:model MessageRead {
3393- id Int @id @default(autoincrement())
3394- threadId Int @map("thread_id")
3395- userId Int @map("user_id")
3396- lastReadAt DateTime @map("last_read_at")
$ grep -n "router.patch('/threads/:id/read'\\|router.get('/threads/:id/reads'" src/routes/messages.routes.ts
195:router.get('/threads/:id/reads', async (req: Request, res: Response, next: NextFunction) =&gt; {
207:router.patch('/threads/:id/read', async (req: Request, res: Response, next: NextFunction) =&gt; {
$ grep -n "If the message came in for the open thread" -A3 frontend/src/store/messagingStore.ts
1335: // If the message came in for the open thread, also mark read
1336- if (get().currentThreadId === threadId &amp;&amp; !isOwn) {
1337- get().markRead(threadId);
1338- }
$ grep -n "const dangXem" -A1 frontend/src/store/messagingStore.ts
1262: const dangXem = truoc.currentThreadId === threadId
1263- &amp;&amp; (typeof document === 'undefined' || document.visibilityState === 'visible');
$ grep -rln "delivered" src/ frontend/src/components/messaging | wc -l
       0</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-javascript"><span class="tok-comment">// Một tin Nam (7) → Hà (9), đo mốc ba mức: SENT (server lưu + ack) · DELIVERED (máy Hà ack) · READ (Hà thật sự nhìn thấy).</span>
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
import pg from 'pg';
const db = new pg.Pool({ connectionString: 'postgres://postgres:lab@127.0.0.1:19660/postgres' });
const io = new Server(19690);
io.on('connection', (s) =&gt; {
  const u = s.handshake.auth.user; s.join(&#96;user:\${u}&#96;); s.join('thread:42');
  s.on('chat:send', async ({ text }, ack) =&gt; {
    const { rows: [m] } = await db.query('INSERT INTO messages (thread_id, sender_id, text) VALUES (42, $1, $2) RETURNING id', [u, text]);
    ack({ ok: true, id: m.id });                                                      <span class="tok-comment">  // ① SENT</span>
    s.to('thread:42').timeout(5000).emit('chat:new-message', { id: m.id, text, from: u }, async (err, tra) =&gt; {
      for (const r of tra ?? []) {
        await db.query('INSERT INTO message_deliveries VALUES ($1, $2, now()) ON CONFLICT DO NOTHING', [m.id, r.user]);
        io.to(&#96;user:\${u}&#96;).emit('chat:delivered', { id: m.id, user: r.user });        <span class="tok-comment">  // ② DELIVERED</span>
      }
    });
  });
  s.on('chat:mark-read', async ({ threadId }) =&gt; {
    await db.query(&#96;INSERT INTO message_reads VALUES ($1, $2, now()) ON CONFLICT (thread_id, user_id) DO UPDATE SET last_read_at = now()&#96;, [threadId, u]);
    s.to(&#96;thread:\${threadId}&#96;).emit('chat:read', { threadId, user: u });               <span class="tok-comment">  // ③ READ</span>
  });
});
const moi = (u) =&gt; new Promise((r) =&gt; { const c = ketNoi('http://localhost:19690', { auth: { user: u }, transports: ['websocket'], forceNew: true }); c.on('connect', () =&gt; r(c)); });
const [nam, ha] = await Promise.all([moi(7), moi(9)]);
let t0; const ms = () =&gt; &#96;\${(performance.now() - t0).toFixed(1).replace('.', ',').padStart(7)} ms&#96;;
ha.on('chat:new-message', (m, ack) =&gt; { console.log(&#96;\${ms()}  máy Hà nhận tin #\${m.id} — gửi ack "đã nhận"&#96;); ack({ user: 9 });
  setTimeout(() =&gt; { console.log(&#96;\${ms()}  Hà mở thread, tin hiện trên màn hình — gửi chat:mark-read&#96;); ha.emit('chat:mark-read', { threadId: 42 }); }, 1500); });
const xong = new Promise((r) =&gt; nam.on('chat:read', r));
nam.on('chat:delivered', (d) =&gt; console.log(&#96;\${ms()}  Nam thấy ✓✓ DELIVERED (#\${d.id}, máy của user \${d.user})&#96;));
t0 = performance.now();
nam.emit('chat:send', { text: 'Mai họp lúc 7h30 nhé' }, (a) =&gt; console.log(&#96;\${ms()}  Nam thấy ✓ SENT (server đã lưu, id \${a.id})&#96;));
await xong; console.log(&#96;\${ms()}  Nam thấy 🔵 READ (Hà đã xem)&#96;);
const { rows } = await db.query(&#96;SELECT (SELECT count(*) FROM messages) m, (SELECT count(*) FROM message_deliveries) d, (SELECT count(*) FROM message_reads) r&#96;);
console.log(&#96;Postgres: messages \${rows[0].m} · message_deliveries \${rows[0].d} · message_reads \${rows[0].r}&#96;);
process.exit(0);</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-4-2-tin-cay" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking · 4.2 — Độ tin cậy: số thứ tự, ACK và truyền lại</span><span class="lc-sub">ACK của TCP nghĩa là byte đã tới — như ĐÃ NHẬN, không phải ĐÃ XEM</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/postgresql/learn?lessonSlug=postgresql-4-1-insert" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL · 4.1 — INSERT: nhiều dòng, RETURNING & UPSERT</span><span class="lc-sub">Hai câu lệnh đứng sau ba mức</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">SENT</span><span class="v">Một server ack rằng tin đã tới server (một tick).</span></div>
  <div class="kv"><span class="k">DELIVERED</span><span class="v">Một client ack cộng một Prisma upsert rằng nó đã tới thiết bị (hai tick).</span></div>
  <div class="kv"><span class="k">READ</span><span class="v">Một tín hiệu visibility rằng user thật sự thấy nó (tick xanh).</span></div>
  <div class="kv"><span class="k"><code>IntersectionObserver</code></span><span class="v">API trình duyệt phát hiện một tin vào vùng nhìn.</span></div>
  <div class="kv"><span class="k">Batching</span><span class="v">Gom các tín hiệu READ để không emit một cái mỗi tin.</span></div>
  <div class="kv"><span class="k">Cho tắt</span><span class="v">Nhiều app cho user tắt receipt vì cost cao.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Read receipt có ba mức tách biệt: SENT, DELIVERED, READ.</li><li>SENT là server ack, DELIVERED là client ack cộng DB upsert, READ là tín hiệu visibility.</li><li>Mỗi cái cần một cơ chế khác và một tín hiệu UX khác (một, hai, tick xanh).</li><li>READ dùng một <code>IntersectionObserver</code> cộng batching để giữ cost thấp.</li><li>Cost cao đủ để nhiều app cho user tắt receipt.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — IntersectionObserver</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API — API chuẩn để detect element vào viewport.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 6 — acks</span><span class="lc-sub">/courses/socket-io/learn${REF} — DELIVERED cần ack đúng cách để không mất khi client offline lúc receive.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 4.6 ─────────────────────────── */
    {
      title: '4.6 — Chapter 4 quiz|||4.6 — Kiểm tra Chương 4',
      slug: 'io-4-6-quiz',
      type: 'QUIZ',
      description: 'Sáu câu, mười phút. Về presence (O(N²) trap), audience compute, multi-tab, typing, read receipts.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Quiz</span>
<h2>What Chapter 4 established</h2>
<p class="lead">Six questions on presence — the feature that looks trivial and is the most common way a Socket.IO app falls over.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">io.emit for presence is O(N²)</span><span class="lz-d">Every user's status change sent to every user means N status changes each fanned out to N recipients. At 1,000 users a single reconnect storm is a million messages. The fix is computing an audience, not broadcasting to everyone.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">One user is many sockets</span><span class="lz-d">Multiple tabs, phone and laptop, a reconnect in flight. Presence must be reference-counted per user, or closing one tab marks a user offline while they are still connected elsewhere.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Typing indicators cost per keystroke</span><span class="lz-d">Naively they are one message per character per recipient. Throttle at the client, and send "started"/"stopped" rather than a stream, or a single conversation can outweigh all your other traffic.</span></div>
</div>
<p>6 questions, 10 minutes. Answer from the mechanism, not from memory — every option is plausible if you are guessing.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Kiểm tra</span>
<h2>Chương 4 đã dựng được gì</h2>
<p class="lead">Sáu câu về presence — tính năng trông có vẻ tầm thường và là cách phổ biến nhất khiến một app Socket.IO sụp.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">io.emit cho presence là O(N²)</span><span class="lz-d">Mỗi lần đổi trạng thái của một user gửi tới mọi user nghĩa là N lần đổi trạng thái, mỗi lần toả ra N người nhận. Ở 1.000 user, một cơn bão kết nối lại là một triệu thông điệp. Cách vá là tính ra tập khán giả, không phải broadcast cho tất cả.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Một user là nhiều socket</span><span class="lz-d">Nhiều tab, điện thoại và laptop, một lần kết nối lại đang bay. Presence phải đếm tham chiếu theo từng user, nếu không đóng một tab sẽ đánh dấu user offline trong khi họ vẫn còn kết nối ở nơi khác.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Chỉ báo đang gõ tốn tiền theo từng phím</span><span class="lz-d">Làm ngây thơ thì đó là một thông điệp cho mỗi ký tự cho mỗi người nhận. Hãy tiết chế ở phía client, và gửi "bắt đầu"/"dừng" thay vì một dòng liên tục, nếu không một cuộc hội thoại có thể nặng hơn toàn bộ traffic còn lại.</span></div>
</div>
<p>6 câu, 10 phút. Hãy trả lời từ cơ chế, đừng trả lời từ trí nhớ — mọi phương án đều hợp lý nếu bạn đang đoán.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 600,
        questions: [
          {
            question: 'Why does naive <code>io.emit(&quot;presence:update&quot;)</code> lead to O(N²) cost during deploy?|||Vì sao <code>io.emit(&quot;presence:update&quot;)</code> ngây thơ dẫn đến cost O(N²) khi deploy?',
            options: [
              'Because during deploy, all N users disconnect + reconnect roughly simultaneously — each of the 2N events is broadcast to N sockets = 2N² packets in a few seconds, at N=10.000 that\'s 200M packets|||Vì khi deploy, cả N user disconnect + reconnect gần như đồng thời — mỗi trong 2N events broadcast đến N sockets = 2N² packets trong vài giây, ở N=10.000 là 200M packets',
              'Because JSON.stringify is O(N)|||Vì JSON.stringify là O(N)',
              'Because socket.io uses recursion|||Vì socket.io dùng recursion',
              'Because Node.js is single-threaded|||Vì Node.js là single-threaded',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is <code>audience</code> in this repo\'s <code>emitPresenceTo(audience)</code>?|||<code>audience</code> trong <code>emitPresenceTo(audience)</code> của kho này là gì?',
            options: [
              'The union of user\'s friends and thread peers — the only users whose UI actually renders this user\'s presence. Cached in Redis 5min, invalidated on friend/thread changes|||Hợp của friends của user và thread peers — chỉ user nào UI thật sự render presence của user này. Cache Redis 5 phút, invalidate khi friend/thread đổi',
              'All online users|||Mọi user online',
              'The user\'s subscribers|||Subscriber của user',
              'A random sample of 100 users|||Mẫu ngẫu nhiên 100 user',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'User has 3 tabs open, closes 1. What should happen to their presence?|||User có 3 tab mở, đóng 1. Presence của họ thế nào?',
            options: [
              'Nothing — still online. This requires reference counting: <code>Map&lt;userId, Set&lt;socketId&gt;&gt;</code>, emit offline only when the Set becomes empty|||Không gì — vẫn online. Cái này cần reference counting: <code>Map&lt;userId, Set&lt;socketId&gt;&gt;</code>, emit offline chỉ khi Set về rỗng',
              'Immediately offline — reset UI|||Ngay lập tức offline — reset UI',
              'Flicker between online and offline|||Nhấp nháy giữa online và offline',
              'Depends on which tab was primary|||Phụ thuộc tab nào là primary',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Naive typing indicator emits per keystroke, 10 users × 5 keys/sec × 9 receivers = 450 packets/sec/thread. Best mitigation?|||Typing indicator ngây thơ emit per phím, 10 user × 5 phím/s × 9 nhận = 450 packet/s/thread. Cách giảm tốt nhất?',
            options: [
              'Client-side debounce (emit at most every 3s) + client-side auto-clear timeout (3s after last event) — server needs no state; ephemeral pattern from 1.5|||Client debounce (emit tối đa mỗi 3s) + client auto-clear timeout (3s sau event cuối) — server không cần state; ephemeral pattern từ 1.5',
              'Server-side debounce only|||Chỉ server debounce',
              'Use volatile.emit|||Dùng volatile.emit',
              'Increase pingInterval to 60s|||Tăng pingInterval lên 60s',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is the difference between DELIVERED and READ in read receipts?|||Khác biệt giữa DELIVERED và READ trong read receipts?',
            options: [
              'DELIVERED = client received the packet (double tick). READ = user actually viewed it (blue tick, needs IntersectionObserver + tab visible). Merging them shows &quot;seen&quot; even when user hasn\'t opened the tab|||DELIVERED = client nhận packet (tick đôi). READ = user thật sự xem (tick xanh, cần IntersectionObserver + tab visible). Gộp lại hiện &quot;đã xem&quot; ngay cả khi user chưa mở tab',
              'They are the same thing|||Chúng là cùng một thứ',
              'DELIVERED is optional, READ is required|||DELIVERED optional, READ bắt buộc',
              'DELIVERED is client-side, READ is server-side|||DELIVERED phía client, READ phía server',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why do apps let users disable read receipts?|||Vì sao app cho user tắt read receipts?',
            options: [
              'Not just privacy — mark-read events at scale (busy chat with 10 users × 100 msg/hour = 1000 events/hour/thread) create huge server cost. Disabling drops that traffic entirely for that user|||Không chỉ privacy — mark-read events ở scale (chat busy 10 user × 100 msg/gio = 1000 events/gio/thread) tạo cost server rất lớn. Tắt là drop hết traffic đó cho user',
              'Only for privacy|||Chỉ vì privacy',
              'To help network operators|||Giúp nhà mạng',
              'To reduce battery drain|||Giảm hao pin',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },

  ],
};
