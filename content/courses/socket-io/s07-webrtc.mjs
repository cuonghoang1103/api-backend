import G07_1 from './giang/sio-07-1.mjs';
import G07_2 from './giang/sio-07-2.mjs';
import G07_3 from './giang/sio-07-3.mjs';
const REF = '?ref=%2Fcourses%2Fsocket-io%2Flearn&reflabel=Socket.IO';
/**
 * Socket.IO — Chương 7: WebRTC signalling.
 * Đo: call.socket.ts của kho có 275 dòng, 5 event (offer/answer/ice/end/reject).
 * Media qua WebRTC peer-to-peer, socket.io chỉ signalling.
 */

export default {
  title: 'Chapter 7 — WebRTC signalling with socket.io|||Chương 7 — WebRTC signalling với socket.io',
  slug: 'io-ch7-webrtc',
  description: 'Sáu bài về signalling video call. Socket.io CHỈ dùng cho offer/answer/ICE exchange; media stream đi qua WebRTC peer-to-peer. Đo trên call.socket.ts của kho.',
  sortOrder: 8,
  lessons: [

    {
      title: '7.1 — Signalling: what socket.io does in a video call|||7.1 — Signalling: socket.io làm gì trong video call',
      slug: 'io-7-1-signalling',
      type: 'VIDEO',
      description: 'Media (video/audio) đi qua WebRTC RTP peer-to-peer. Socket.io CHỈ giúp hai peer khám phá network address (ICE) và thoả thuận codec (SDP). Đó là ~5-20 packet cho cả call.',
      content: `
${G07_1}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>Signalling: what socket.io does in a video call</h2>
<p class="lead">A common misconception: &quot;video call uses socket.io for media&quot;. It does not. WebRTC handles media peer-to-peer. Socket.io only handles signalling — a handful of packets to get the two peers talking directly.</p>

<h3>The two layers</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">signalling</span><span class="lz-t">socket.io</span><span class="lz-d">Peer A tells server &quot;I want to call peer B&quot;. Server relays. A sends offer (SDP), B sends answer, both exchange ICE candidates. ~5-20 packets total, ~2 KB. <strong>Measured (video + audio call, this repo&#39;s own code):</strong> 28 frames, ~30 KB on the wire — the SDP offer alone is 6.3 KB.</span></div>
<div class="lz-step"><span class="lz-k">media</span><span class="lz-t">WebRTC (RTP over UDP)</span><span class="lz-d">Once peers know each other&#39;s IP+port (via ICE), video/audio flows DIRECTLY between them. Server does not see the media at all. ~1-2 Mbps per stream.</span></div>
</div>

<div class="callout ok">
<p><strong>This is the single most important point for scale.</strong> If the media flows through the server, 1,000 concurrent calls means 1-2 Gbps through that server. Peer-to-peer, the server only carries the signalling — a few KB per call. The same box can then handle hundreds of thousands of calls.</p>
</div>

<h3>call.socket.ts — this repo's 5 events</h3>
<pre><code class="language-ts">// src/socket/call.socket.ts (281 dong — do 13/11/2026). Chi call:offer neu ten nguoi kia;
// server sinh callId (UUID) va moi event sau di theo callId.
socket.on('call:offer',  (p: { threadId, toUserId, sdp, coVideo }) =&gt; { ... });  // ⇒ call:ringing + call:incoming
socket.on('call:answer', (p: { callId, sdp }) =&gt; { ... });                       // ⇒ call:answered
socket.on('call:ice',    (p: { callId, candidate }) =&gt; { ... });                 // ⇒ call:ice (ben kia)
socket.on('call:reject', (p: { callId }) =&gt; { ... });                            // ⇒ call:end (ca hai)
socket.on('call:end',    (p: { callId }) =&gt; { ... });
socket.on('disconnect',  () =&gt; { ... });                                          // ⇒ call:end neu khong con tab nao
</code></pre>

<p>Naming: <code>call:*</code> prefix (lesson 3.5). Small payloads (~500 bytes). No media state is tracked — it only relays signalling messages.</p>

<h3>The call flow on a timeline</h3>
<pre><code class="language-text">t=0     User A press "call"
t=0.05  A -&gt; server: call:offer   {toUserId: B, sdp: "v=0\\r\\no=- ..."}
t=0.06  server -&gt; B: call:incoming {fromUserId: A, sdp: "..."}
        &lt;- B's UI shows incoming call
t=2.5   User B press "accept"
t=2.51  B -&gt; server: call:answer  {toUserId: A, sdp: "v=0\\r\\no=- ..."}
t=2.52  server -&gt; A: call:answered {sdp: "..."}
t=2.6   A -&gt; server: call:ice     {toUserId: B, candidate: "candidate:1 1 udp ..."}
t=2.6   server -&gt; B: call:ice     {fromUserId: A, candidate: "..."}
        (repeat: multiple ICE candidates, both directions)
t=3.0   ICE exchange done — peers ket noi truc tiep
t=3.0-∞ VIDEO / AUDIO qua WebRTC UDP truc tiep, server KHONG thay

t=125   User A press "end"
t=125.01 A -&gt; server: call:end
t=125.02 server -&gt; B: call:end
</code></pre>

<h3>Socket.io responsibilities</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Peer discovery</span><span class="lz-lnote">User A wants to call user B → the server uses the <code>user:B</code> room to find B online</span></div>
<div class="lz-layer"><span class="lz-lname">Relay SDP + ICE</span><span class="lz-lnote">Relays messages between A and B while they have not yet connected peer-to-peer</span></div>
<div class="lz-layer"><span class="lz-lname">Ring notification</span><span class="lz-lnote">Emit <code>call:incoming</code>, <code>call:ringing</code> cho UI</span></div>
<div class="lz-layer"><span class="lz-lname">Cleanup on drop</span><span class="lz-lnote">If A disconnects mid-call, the server emits <code>call:end</code> cho B</span></div>
</div>

<h3>What socket.io does NOT do</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">It does not carry media</span><span class="lz-lnote">No video or audio ever travels over socket.io. If you are thinking of emitting binary Buffers to &quot;stream video&quot;, that is an architectural error — Chapter 8 explains why</span></div>
<div class="lz-layer"><span class="lz-lname">It does not store media</span><span class="lz-lnote">Call recording, if you need it, has to happen at the peer (client-side MediaRecorder) or on an SFU/MCU server (an entirely different thing from socket.io)</span></div>
<div class="lz-layer"><span class="lz-lname">It is not TURN</span><span class="lz-lnote">When peers cannot reach each other directly (symmetric NAT), a TURN server has to relay the media. TURN is a SEPARATE service — coturn, Xirsys — not socket.io</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — attempting to &quot;stream video through a socket.io emit&quot;.</strong> You <code>MediaRecorder.ondataavailable</code> a 100 KB Buffer every 100ms over socket.io. The cost: 8 Mbps through the server, 100-500ms of latency, and no jitter buffer. The video breaks up and the server dies. This is an expensive lesson many teams have learned before rewriting on WebRTC. <strong>Measured with Chrome&#39;s fake camera</strong> (a test pattern that compresses far better than a real camera): ~0.5 Mbit/s per stream — but every byte crosses your server once per viewer (5 viewers: 49.5 Mbit sent in 20 s), and over TCP a 1.5 s network stall is held and replayed (worst chunk 1.4 s late) instead of being dropped.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> A video call is WebRTC for the media (RTP over UDP, peer-to-peer, ~1-2 Mbps per stream, invisible to the server) plus socket.io for the signalling (5-20 SDP/ICE relay packets, ~2 KB in total, using the <code>user:${'${uid}'}</code> room to find the peer) — confusing these two layers is a major architectural mistake.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Start a one-to-one WebRTC call and, in DevTools, confirm the media does NOT flow through your server — only a handful of signalling packets do.</li>
<li>Count the signalling packets socket.io relays (SDP offer/answer plus ICE) and note the tiny total (~2 KB).</li>
<li>Draw the two layers side by side: WebRTC for media (peer-to-peer), socket.io for signalling (via the <code>user:</code> room).</li>
</ol>
<p><strong>Done when:</strong> you can state what travels peer-to-peer versus through the server, and never confuse the two layers.</p></div>

<h3>🔬 Measured: one real call, this repo&#39;s own code on both ends</h3>
<p>socket.io 4.8.3 · Node 22.23.3 · Chromium with a fake camera and microphone. The server runs <code>src/socket/call.socket.ts</code> unchanged (only the logger and Prisma are stubs); each browser frame runs the <code>CuocGoi</code> class from <code>frontend/src/lib/webrtc/cuocGoi.ts</code>, bundled with esbuild. An calls Binh, Binh answers after 1.5 s, they talk for 30 s, An hangs up. Every <code>call:*</code> frame on the wire, then <code>getStats()</code>:</p>
<div class="out">$ node goi.mjs
KHUNG BÁO HIỆU trên dây (↑ trình duyệt gửi lên server · ↓ server gửi xuống) — mốc ms từ lúc mở trang:
   1473 ms  ↑ call:offer         1 khung    6325 B
   1475 ms  ↓ call:ringing       1 khung      81 B
   1475 ms  ↑ call:ice          10 khung    2712 B
   1475 ms  ↓ call:incoming      1 khung    6416 B
   3022 ms  ↑ call:answer        1 khung    6029 B
   3024 ms  ↓ call:answered      1 khung    6031 B
   3024 ms  ↓ call:ice          10 khung    2712 B
   3031 ms  ⇒ An: iceConnectionState = connected (đang nói)
  33202 ms  ↑ call:end           1 khung      64 B
  33203 ms  ↓ call:end           2 khung     252 B
  TỔNG báo hiệu: 28 khung, 30622 B trên dây · server nhận 15143 B, gửi 15969 B
  call:ice gửi lên: An 8 · Bình 2
MEDIA (getStats của trình duyệt, KHÔNG qua server):
  30 s: An gửi video 1.52 MB · audio 89 KB
  10 s cuối: video 628 kbps · audio 24 kbps · Bình nhận 1280×720 20 khung/giây
  cặp đường đi An:  host 192.168.1.100:51943/udp ⇄ host 192.168.1.100:57677/udp
  cặp đường đi Bình: host 192.168.1.100:57677/udp ⇄ host 192.168.1.100:51943/udp
  (server socket.io nghe :19810/tcp — media đi UDP thẳng giữa hai trình duyệt)
$ # log server (call.socket.ts của kho)
[may] nghe :19810 · call.socket.ts của kho · TRE_DB=5 ms
[may  4716 ms] INFO cuộc gọi bắt đầu {"callId":"ec3ba453-8bf6-4213-9b37-a1fcd515f148","tu":1,"den":2}
[may 36442 ms] INFO cuộc gọi kết thúc {"callId":"ec3ba453-8bf6-4213-9b37-a1fcd515f148","lyDo":"cup-may","giay":30,"daNhan":true}</div>
<p>Signalling: 28 frames, ~30 KB, then silence for the whole conversation. Media: ~100× more bytes in 30 s, browser to browser — the server process never sees it. (Both pages run on one machine, so Chromium was started with <code>--allow-loopback-in-peer-connection</code>.)</p>
<p><strong>This repo</strong> — the real handlers, their line numbers and the history of the file:</p>
<div class="out">$ cd ~/api-backend &amp;&amp; wc -l src/socket/call.socket.ts &amp;&amp; grep -nE "socket\\.on\\('(call:|disconnect)|emit\\('call:" src/socket/call.socket.ts
     281 src/socket/call.socket.ts
64:    io.to(phong(uid)).emit('call:end', {
135:  socket.on('call:offer', (p: { threadId: number; toUserId: number; sdp: unknown; coVi
142:      socket.emit('call:busy', { threadId: p.threadId, ai: 'toi' });
147:      socket.emit('call:busy', { threadId: p.threadId, ai: 'ho' });
163:      socket.emit('call:end', {
192:    socket.emit('call:ringing', { callId: c.id, threadId: c.threadId });
210:      io.to(phong(p.toUserId)).emit('call:incoming', {
230:  socket.on('call:answer', (p: { callId: string; sdp: unknown }) =&gt; {
239:    io.to(phong(c.nguoiGoi)).emit('call:answered', { callId: c.id, sdp: p.sdp });
243:  socket.on('call:ice', (p: { callId: string; candidate: unknown }) =&gt; {
246:    io.to(phong(benKia(c, user.id))).emit('call:ice', {
252:  socket.on('call:reject', (p: { callId: string }) =&gt; {
258:  socket.on('call:end', (p: { callId: string }) =&gt; {
265:  socket.on('disconnect', () =&gt; {
$ git log --format='%h %ad %s' --date=short -- src/socket/call.socket.ts
9df6349c7 2026-09-16 feat(Tin nhắn): app desktop dùng lại nguyên messenger của web · bật nút gọi · t
0852eb4ed 2026-08-21 fix(call): gọi người KHÔNG online thì im lặng đổ chuông vào hư không
680cd2323 2026-08-21 fix(call): gọi được nhưng KHÔNG NGHE THẤY GÌ — người gọi vứt sạch ứng viên ICE
35077cbaf 2026-08-21 feat(call): gọi thoại trên web + desktop — giao diện và nối dây
043c3df1b 2026-08-21 feat(call): hạ tầng gọi thoại 1-1 — TURN + báo hiệu (chưa có giao diện)</div>
<p><strong>The trap, measured</strong> — <code>MediaRecorder</code> chunks every 100 ms emitted over socket.io and re-emitted to viewers; then a viewer behind a 1.5 s network stall:</p>
<div class="out">$ node bay-do.mjs 1
1 người xem · 20 s · 157 mẩu · trễ mẩu p50 1 ms · p95 1 ms · tối đa 10 ms · 0 mẩu trễ &gt; 500 ms
[bay] server gánh: nhận 1.1 Mbit · gửi 1.1 Mbit
[bay] server gánh: nhận 4.3 Mbit · gửi 4.3 Mbit
[bay] server gánh: nhận 7.4 Mbit · gửi 7.4 Mbit
[bay] server gánh: nhận 10.3 Mbit · gửi 10.3 Mbit
$ node bay-do.mjs 5
5 người xem · 20 s · 157 mẩu · trễ mẩu p50 1 ms · p95 2 ms · tối đa 2 ms · 0 mẩu trễ &gt; 500 ms
[bay] server gánh: nhận 0.6 Mbit · gửi 3.0 Mbit
[bay] server gánh: nhận 3.9 Mbit · gửi 19.4 Mbit
[bay] server gánh: nhận 7.0 Mbit · gửi 34.9 Mbit
[bay] server gánh: nhận 9.9 Mbit · gửi 49.5 Mbit
$ node bay-do.mjs 1 khung
1 người xem (qua đoạn mạng khựng 1,5 s) · 20 s · 161 mẩu · trễ mẩu p50 1 ms · p95 607 ms · tối đa 1446 ms · 8 mẩu trễ &gt; 500 ms</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash"><span class="tok-comment"># 1. chép mã THẬT của kho vào lab (server + lớp gọi của frontend)</span>
cp ~/api-backend/src/socket/call.socket.ts            kho/src/socket/
cp ~/api-backend/frontend/src/lib/webrtc/cuocGoi.ts   kho/web/
<span class="tok-comment"># 2. gói lớp CuocGoi cho trình duyệt — '@/lib/socket' và '@/lib/api' trỏ sang hai tệp nhỏ (kho/web/tsconfig.json "paths")</span>
(cd kho/web &amp;&amp; npx esbuild cuocGoi.ts --bundle --format=iife --global-name=CuocGoiLib --outfile=../../pub/cuocGoi.js)
<span class="tok-comment"># 3. server (call.socket.ts của kho, logger/prisma giả) + một cuộc gọi trong Chromium có camera giả</span>
npx tsx may.ts &amp;
node goi.mjs      <span class="tok-comment">  # Chromium: --use-fake-device-for-media-stream --use-fake-ui-for-media-stream</span></code></pre>
<pre><code class="language-typescript"><span class="tok-comment">// may.ts — server lab Chương 7: socket.io 4.8.3 + src/socket/call.socket.ts THẬT của kho (chép nguyên; chỉ logger/prisma là bản giả).</span>
<span class="tok-comment">// Thứ tự giống messaging.socket.ts: join &#96;user:&lt;id&gt;&#96; ngay · join &#96;thread:&lt;id&gt;&#96; SAU một lượt hỏi DB (async) · registerCallSignaling ngay.</span>
import http from 'node:http';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { Server } from 'socket.io';
import { registerCallSignaling } from './kho/src/socket/call.socket.ts';
const CONG = Number(process.env.CONG ?? 19810), TRE_DB = Number(process.env.TRE_DB ?? 5);
const NGUOI: Record&lt;number, string&gt; = { 1: 'An', 2: 'Bình', 3: 'Chi' };
const suaSdp = process.env.MUNGE ? (await import('./munge.ts')).suaSdp : null; <span class="tok-comment">  // bài 7.2: giả "server sửa SDP" (cái bẫy) — mặc định TẮT</span>
const HOI_THOAI: Record&lt;number, number[]&gt; = { 1: [1, 2], 2: [1, 3] };        <span class="tok-comment">  // hội thoại 1: An–Bình · 2: An–Chi</span>
const dem = { vao: 0, ra: 0, goiVao: 0, goiRa: 0 };                           <span class="tok-comment">  // byte socket.io server THẤY (cả hai chiều)</span>
const server = http.createServer((req, res) =&gt; {
  const u = new URL(req.url!, 'http://x');
  if (u.pathname === '/dem') { res.writeHead(200, { 'content-type': 'application/json' }); return res.end(JSON.stringify(dem)); }
  if (u.pathname === '/ice-servers') {                                        <span class="tok-comment">  // y thuật toán messages.routes.ts:437 (TURN_SECRET có thì cấp TURN)</span>
    const iceServers: object[] = process.env.STUN ? [{ urls: process.env.STUN }] : [];
    const secret = process.env.TURN_SECRET;
    if (secret) { const username = &#96;\${Math.floor(Date.now() / 1000) + Number(process.env.TURN_TTL ?? 600)}:\${u.searchParams.get('u') ?? 0}&#96;;
      iceServers.push({ urls: process.env.TURN_URL, username, credential: crypto.createHmac('sha1', secret).update(username).digest('base64') }); }
    res.writeHead(200, { 'content-type': 'application/json' }); return res.end(JSON.stringify({ success: true, data: { iceServers, turn: !!secret } }));
  }
  const tep = u.pathname === '/' ? '/hai.html' : u.pathname;
  if (!u.pathname.startsWith('/socket.io') &amp;&amp; fs.existsSync(&#96;pub\${tep}&#96;)) {
    res.writeHead(200, { 'content-type': tep.endsWith('.js') ? 'text/javascript' : 'text/html; charset=utf-8' }); return res.end(fs.readFileSync(&#96;pub\${tep}&#96;));
  }
  if (!u.pathname.startsWith('/socket.io')) { res.writeHead(404); res.end(); }
});
const io = new Server(server, { maxHttpBufferSize: 1e8 });
io.engine.on('connection', (raw) =&gt; {
  raw.on('packet', (p: { data?: unknown }) =&gt; { if (typeof p.data === 'string') { dem.vao += p.data.length; if (p.data.includes('"call:')) dem.goiVao += p.data.length; } });
  raw.on('packetCreate', (p: { data?: unknown }) =&gt; { if (typeof p.data === 'string') { dem.ra += p.data.length; if (p.data.includes('"call:')) dem.goiRa += p.data.length; } });
});
io.use((s, next) =&gt; { const id = Number(s.handshake.auth.userId); if (!NGUOI[id]) return next(new Error('unauthorized')); s.data.user = { id }; next(); });
io.on('connection', (socket) =&gt; {
  const user = socket.data.user as { id: number };
  socket.join(&#96;user:\${user.id}&#96;);
  void (async () =&gt; {                                                         <span class="tok-comment">  // giả lượt hỏi DB rồi join mọi hội thoại (messaging.socket.ts:467)</span>
    await new Promise((r) =&gt; setTimeout(r, TRE_DB));
    for (const [t, ds] of Object.entries(HOI_THOAI)) if (ds.includes(user.id)) socket.join(&#96;thread:\${t}&#96;);
  })();
  if (suaSdp) socket.use(suaSdp);                                             <span class="tok-comment">  // chạy TRƯỚC handler của call.socket.ts</span>
  registerCallSignaling(io, socket, user);
});
server.listen(CONG, () =&gt; console.log(&#96;[may] nghe :\${CONG} · call.socket.ts của kho · TRE_DB=\${TRE_DB} ms&#96;));</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-5-1-udp" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking · 5.1 — UDP: fire and forget</span><span class="lc-sub">Why media rides UDP, not TCP</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-9-4-webrtc" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking · 9.4 — A quick look at WebRTC: crossing NAT with STUN and TURN</span><span class="lc-sub">The network side of this chapter</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">WebRTC</span><span class="v">The browser stack that carries the media peer-to-peer.</span></div>
  <div class="kv"><span class="k">Media</span><span class="v">RTP over UDP, ~1-2 Mbps per stream — invisible to the server.</span></div>
  <div class="kv"><span class="k">Signalling</span><span class="v">The small SDP/ICE relay that lets peers find each other.</span></div>
  <div class="kv"><span class="k">socket.io role</span><span class="v">Relay signalling only; it never touches the media.</span></div>
  <div class="kv"><span class="k"><code>user:</code> room</span><span class="v">Where signalling is routed so each peer reaches the other.</span></div>
  <div class="kv"><span class="k">Two-layer split</span><span class="v">Media on WebRTC, signalling on socket.io — never confuse them.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A video call is two layers: WebRTC for the media, socket.io for the signalling.</li><li>The media is RTP over UDP, peer-to-peer, ~1-2 Mbps per stream, invisible to the server.</li><li>The signalling is 5-20 SDP/ICE relay packets, ~2 KB total.</li><li>socket.io uses the <code>user:</code> room to let the peers find each other.</li><li>Confusing the two layers is a major architectural mistake.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — WebRTC signalling</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling — chuẩn Mozilla, có full example.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Lesson 7.2 — what SDP is</span><span class="lc-sub">/courses/socket-io/learn${REF} — nội dung của cái SDP mà socket.io relay.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Signalling: socket.io làm gì trong video call</h2>
<p class="lead">Một hiểu nhầm phổ biến: &quot;video call dùng socket.io cho media&quot;. Không. WebRTC xử lý media peer-to-peer. Socket.io chỉ xử lý signalling — vài chục packet để hai peer talking direct với nhau.</p>

<h3>Hai tầng</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">signalling</span><span class="lz-t">socket.io</span><span class="lz-d">Peer A báo server &quot;muốn call peer B&quot;. Server relay. A gửi offer (SDP), B gửi answer, cả hai trao đổi ICE candidates. ~5-20 packet, ~2 KB. <strong>Đo thật (gọi có hình + tiếng, chính mã của kho):</strong> 28 khung, ~30 KB trên dây — riêng SDP offer đã 6,3 KB.</span></div>
<div class="lz-step"><span class="lz-k">media</span><span class="lz-t">WebRTC (RTP over UDP)</span><span class="lz-d">Khi peers biết IP+port của nhau (qua ICE), video/audio đi TRỰC TIẾP giữa họ. Server không thấy media. ~1-2 Mbps per stream.</span></div>
</div>

<div class="callout ok">
<p><strong>Đây là điểm quan trọng nhất cho scale.</strong> Nếu media qua server, 1.000 concurrent call = 1-2 Gbps qua server. Nếu peer-to-peer, server chỉ signalling — vài KB per call. Cùng server handle được cả trăm nghìn call.</p>
</div>

<h3>call.socket.ts — 5 event của kho này</h3>
<pre><code class="language-ts">// src/socket/call.socket.ts (281 dong — do 13/11/2026). Chi call:offer neu ten nguoi kia;
// server sinh callId (UUID) va moi event sau di theo callId.
socket.on('call:offer',  (p: { threadId, toUserId, sdp, coVideo }) =&gt; { ... });  // ⇒ call:ringing + call:incoming
socket.on('call:answer', (p: { callId, sdp }) =&gt; { ... });                       // ⇒ call:answered
socket.on('call:ice',    (p: { callId, candidate }) =&gt; { ... });                 // ⇒ call:ice (ben kia)
socket.on('call:reject', (p: { callId }) =&gt; { ... });                            // ⇒ call:end (ca hai)
socket.on('call:end',    (p: { callId }) =&gt; { ... });
socket.on('disconnect',  () =&gt; { ... });                                          // ⇒ call:end neu khong con tab nao
</code></pre>

<p>Naming: <code>call:*</code> prefix (bài 3.5). Payload nhỏ (~500 byte). Không track state cho media — chỉ relay signalling messages.</p>

<h3>Trách nhiệm của socket.io</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Peer discovery</span><span class="lz-lnote">User A muốn call user B → server dùng room <code>user:B</code> để tìm B online</span></div>
<div class="lz-layer"><span class="lz-lname">Relay SDP + ICE</span><span class="lz-lnote">Chuyển tin giữa A và B khi họ chưa peer-to-peer connect được</span></div>
<div class="lz-layer"><span class="lz-lname">Ring notification</span><span class="lz-lnote">Emit <code>call:incoming</code>, <code>call:ringing</code> cho UI</span></div>
<div class="lz-layer"><span class="lz-lname">Cleanup khi drop</span><span class="lz-lnote">Nếu A disconnect trong lúc gọi, server emit <code>call:end</code> cho B</span></div>
</div>

<h3>Socket.io KHÔNG làm</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Không mang media</span><span class="lz-lnote">Không có video/audio qua socket.io ever. Nếu bạn nghĩ dùng socket emit binary Buffer để &quot;stream video&quot;, đó là sai kiến trúc</span></div>
<div class="lz-layer"><span class="lz-lname">Không lưu media</span><span class="lz-lnote">Recording call phải làm ở peer (client-side MediaRecorder) hoặc dùng SFU/MCU server (khác socket.io hoàn toàn)</span></div>
<div class="lz-layer"><span class="lz-lname">Không TURN</span><span class="lz-lnote">Khi peers không P2P được (NAT symmetric), cần TURN server relay media. TURN là dịch vụ RIÊNG — coturn, Xirsys</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — thử &quot;stream video qua socket.io emit&quot;.</strong> <code>MediaRecorder.ondataavailable</code> Buffer 100 KB mỗi 100ms, emit qua socket.io. Cost: 8 Mbps qua server + latency 100-500ms + không có jitter buffer. Video vỡ, server chết. Bài học đắt mà nhiều team đã học rồi rewrite bằng WebRTC. <strong>Đo với camera giả của Chrome</strong> (hình thử nén tốt hơn camera thật nhiều): ~0,5 Mbit/s mỗi luồng — nhưng mọi byte đi qua server một lần cho MỖI người xem (5 người xem: gửi 49,5 Mbit trong 20 s), và trên TCP, mạng khựng 1,5 s thì byte bị giữ rồi xả lại (mẩu chậm nhất trễ 1,4 s) chứ không bỏ.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Video call = WebRTC cho media (RTP over UDP peer-to-peer, ~1-2 Mbps per stream, server không thấy) + socket.io cho signalling (5-20 packet SDP/ICE relay, ~2 KB total) — nhầm hai tầng này là sai kiến trúc lớn.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Bắt đầu một cuộc gọi WebRTC một-một và, trong DevTools, xác nhận media KHÔNG đi qua server của bạn — chỉ vài packet signalling đi qua.</li>
<li>Đếm số packet signalling mà socket.io relay (SDP offer/answer cộng ICE) và để ý tổng rất nhỏ (~2 KB).</li>
<li>Vẽ hai tầng cạnh nhau: WebRTC cho media (peer-to-peer), socket.io cho signalling (qua room <code>user:</code>).</li>
</ol>
<p><strong>Đạt khi:</strong> bạn nêu được cái gì đi peer-to-peer so với qua server, và không bao giờ nhầm hai tầng.</p></div>

<h3>🔬 Đo thật: một cuộc gọi, chính mã của kho ở cả hai đầu</h3>
<p>socket.io 4.8.3 · Node 22.23.3 · Chromium có camera và micro giả. Server chạy nguyên <code>src/socket/call.socket.ts</code> (chỉ logger và Prisma là bản giả); mỗi khung trình duyệt chạy lớp <code>CuocGoi</code> trong <code>frontend/src/lib/webrtc/cuocGoi.ts</code>, gói bằng esbuild. An gọi Bình, Bình bắt máy sau 1,5 s, nói 30 s, An cúp máy. Mọi khung <code>call:*</code> trên dây, rồi <code>getStats()</code>:</p>
<div class="out">$ node goi.mjs
KHUNG BÁO HIỆU trên dây (↑ trình duyệt gửi lên server · ↓ server gửi xuống) — mốc ms từ lúc mở trang:
   1473 ms  ↑ call:offer         1 khung    6325 B
   1475 ms  ↓ call:ringing       1 khung      81 B
   1475 ms  ↑ call:ice          10 khung    2712 B
   1475 ms  ↓ call:incoming      1 khung    6416 B
   3022 ms  ↑ call:answer        1 khung    6029 B
   3024 ms  ↓ call:answered      1 khung    6031 B
   3024 ms  ↓ call:ice          10 khung    2712 B
   3031 ms  ⇒ An: iceConnectionState = connected (đang nói)
  33202 ms  ↑ call:end           1 khung      64 B
  33203 ms  ↓ call:end           2 khung     252 B
  TỔNG báo hiệu: 28 khung, 30622 B trên dây · server nhận 15143 B, gửi 15969 B
  call:ice gửi lên: An 8 · Bình 2
MEDIA (getStats của trình duyệt, KHÔNG qua server):
  30 s: An gửi video 1.52 MB · audio 89 KB
  10 s cuối: video 628 kbps · audio 24 kbps · Bình nhận 1280×720 20 khung/giây
  cặp đường đi An:  host 192.168.1.100:51943/udp ⇄ host 192.168.1.100:57677/udp
  cặp đường đi Bình: host 192.168.1.100:57677/udp ⇄ host 192.168.1.100:51943/udp
  (server socket.io nghe :19810/tcp — media đi UDP thẳng giữa hai trình duyệt)
$ # log server (call.socket.ts của kho)
[may] nghe :19810 · call.socket.ts của kho · TRE_DB=5 ms
[may  4716 ms] INFO cuộc gọi bắt đầu {"callId":"ec3ba453-8bf6-4213-9b37-a1fcd515f148","tu":1,"den":2}
[may 36442 ms] INFO cuộc gọi kết thúc {"callId":"ec3ba453-8bf6-4213-9b37-a1fcd515f148","lyDo":"cup-may","giay":30,"daNhan":true}</div>
<p>Báo hiệu: 28 khung, ~30 KB, rồi im lặng suốt cuộc nói chuyện. Media: gấp ~100 lần số byte trong 30 s, trình duyệt nối trình duyệt — tiến trình server không hề thấy. (Hai trang chạy cùng một máy nên Chromium bật cờ <code>--allow-loopback-in-peer-connection</code>.)</p>
<p><strong>Kho này</strong> — handler thật, số dòng và lịch sử của tệp:</p>
<div class="out">$ cd ~/api-backend &amp;&amp; wc -l src/socket/call.socket.ts &amp;&amp; grep -nE "socket\\.on\\('(call:|disconnect)|emit\\('call:" src/socket/call.socket.ts
     281 src/socket/call.socket.ts
64:    io.to(phong(uid)).emit('call:end', {
135:  socket.on('call:offer', (p: { threadId: number; toUserId: number; sdp: unknown; coVi
142:      socket.emit('call:busy', { threadId: p.threadId, ai: 'toi' });
147:      socket.emit('call:busy', { threadId: p.threadId, ai: 'ho' });
163:      socket.emit('call:end', {
192:    socket.emit('call:ringing', { callId: c.id, threadId: c.threadId });
210:      io.to(phong(p.toUserId)).emit('call:incoming', {
230:  socket.on('call:answer', (p: { callId: string; sdp: unknown }) =&gt; {
239:    io.to(phong(c.nguoiGoi)).emit('call:answered', { callId: c.id, sdp: p.sdp });
243:  socket.on('call:ice', (p: { callId: string; candidate: unknown }) =&gt; {
246:    io.to(phong(benKia(c, user.id))).emit('call:ice', {
252:  socket.on('call:reject', (p: { callId: string }) =&gt; {
258:  socket.on('call:end', (p: { callId: string }) =&gt; {
265:  socket.on('disconnect', () =&gt; {
$ git log --format='%h %ad %s' --date=short -- src/socket/call.socket.ts
9df6349c7 2026-09-16 feat(Tin nhắn): app desktop dùng lại nguyên messenger của web · bật nút gọi · t
0852eb4ed 2026-08-21 fix(call): gọi người KHÔNG online thì im lặng đổ chuông vào hư không
680cd2323 2026-08-21 fix(call): gọi được nhưng KHÔNG NGHE THẤY GÌ — người gọi vứt sạch ứng viên ICE
35077cbaf 2026-08-21 feat(call): gọi thoại trên web + desktop — giao diện và nối dây
043c3df1b 2026-08-21 feat(call): hạ tầng gọi thoại 1-1 — TURN + báo hiệu (chưa có giao diện)</div>
<p><strong>Cái bẫy, đo thật</strong> — <code>MediaRecorder</code> cắt mẩu 100 ms, emit qua socket.io rồi server phát lại cho người xem; lượt cuối người xem đi qua đoạn mạng khựng 1,5 s:</p>
<div class="out">$ node bay-do.mjs 1
1 người xem · 20 s · 157 mẩu · trễ mẩu p50 1 ms · p95 1 ms · tối đa 10 ms · 0 mẩu trễ &gt; 500 ms
[bay] server gánh: nhận 1.1 Mbit · gửi 1.1 Mbit
[bay] server gánh: nhận 4.3 Mbit · gửi 4.3 Mbit
[bay] server gánh: nhận 7.4 Mbit · gửi 7.4 Mbit
[bay] server gánh: nhận 10.3 Mbit · gửi 10.3 Mbit
$ node bay-do.mjs 5
5 người xem · 20 s · 157 mẩu · trễ mẩu p50 1 ms · p95 2 ms · tối đa 2 ms · 0 mẩu trễ &gt; 500 ms
[bay] server gánh: nhận 0.6 Mbit · gửi 3.0 Mbit
[bay] server gánh: nhận 3.9 Mbit · gửi 19.4 Mbit
[bay] server gánh: nhận 7.0 Mbit · gửi 34.9 Mbit
[bay] server gánh: nhận 9.9 Mbit · gửi 49.5 Mbit
$ node bay-do.mjs 1 khung
1 người xem (qua đoạn mạng khựng 1,5 s) · 20 s · 161 mẩu · trễ mẩu p50 1 ms · p95 607 ms · tối đa 1446 ms · 8 mẩu trễ &gt; 500 ms</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash"><span class="tok-comment"># 1. chép mã THẬT của kho vào lab (server + lớp gọi của frontend)</span>
cp ~/api-backend/src/socket/call.socket.ts            kho/src/socket/
cp ~/api-backend/frontend/src/lib/webrtc/cuocGoi.ts   kho/web/
<span class="tok-comment"># 2. gói lớp CuocGoi cho trình duyệt — '@/lib/socket' và '@/lib/api' trỏ sang hai tệp nhỏ (kho/web/tsconfig.json "paths")</span>
(cd kho/web &amp;&amp; npx esbuild cuocGoi.ts --bundle --format=iife --global-name=CuocGoiLib --outfile=../../pub/cuocGoi.js)
<span class="tok-comment"># 3. server (call.socket.ts của kho, logger/prisma giả) + một cuộc gọi trong Chromium có camera giả</span>
npx tsx may.ts &amp;
node goi.mjs      <span class="tok-comment">  # Chromium: --use-fake-device-for-media-stream --use-fake-ui-for-media-stream</span></code></pre>
<pre><code class="language-typescript"><span class="tok-comment">// may.ts — server lab Chương 7: socket.io 4.8.3 + src/socket/call.socket.ts THẬT của kho (chép nguyên; chỉ logger/prisma là bản giả).</span>
<span class="tok-comment">// Thứ tự giống messaging.socket.ts: join &#96;user:&lt;id&gt;&#96; ngay · join &#96;thread:&lt;id&gt;&#96; SAU một lượt hỏi DB (async) · registerCallSignaling ngay.</span>
import http from 'node:http';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { Server } from 'socket.io';
import { registerCallSignaling } from './kho/src/socket/call.socket.ts';
const CONG = Number(process.env.CONG ?? 19810), TRE_DB = Number(process.env.TRE_DB ?? 5);
const NGUOI: Record&lt;number, string&gt; = { 1: 'An', 2: 'Bình', 3: 'Chi' };
const suaSdp = process.env.MUNGE ? (await import('./munge.ts')).suaSdp : null; <span class="tok-comment">  // bài 7.2: giả "server sửa SDP" (cái bẫy) — mặc định TẮT</span>
const HOI_THOAI: Record&lt;number, number[]&gt; = { 1: [1, 2], 2: [1, 3] };        <span class="tok-comment">  // hội thoại 1: An–Bình · 2: An–Chi</span>
const dem = { vao: 0, ra: 0, goiVao: 0, goiRa: 0 };                           <span class="tok-comment">  // byte socket.io server THẤY (cả hai chiều)</span>
const server = http.createServer((req, res) =&gt; {
  const u = new URL(req.url!, 'http://x');
  if (u.pathname === '/dem') { res.writeHead(200, { 'content-type': 'application/json' }); return res.end(JSON.stringify(dem)); }
  if (u.pathname === '/ice-servers') {                                        <span class="tok-comment">  // y thuật toán messages.routes.ts:437 (TURN_SECRET có thì cấp TURN)</span>
    const iceServers: object[] = process.env.STUN ? [{ urls: process.env.STUN }] : [];
    const secret = process.env.TURN_SECRET;
    if (secret) { const username = &#96;\${Math.floor(Date.now() / 1000) + Number(process.env.TURN_TTL ?? 600)}:\${u.searchParams.get('u') ?? 0}&#96;;
      iceServers.push({ urls: process.env.TURN_URL, username, credential: crypto.createHmac('sha1', secret).update(username).digest('base64') }); }
    res.writeHead(200, { 'content-type': 'application/json' }); return res.end(JSON.stringify({ success: true, data: { iceServers, turn: !!secret } }));
  }
  const tep = u.pathname === '/' ? '/hai.html' : u.pathname;
  if (!u.pathname.startsWith('/socket.io') &amp;&amp; fs.existsSync(&#96;pub\${tep}&#96;)) {
    res.writeHead(200, { 'content-type': tep.endsWith('.js') ? 'text/javascript' : 'text/html; charset=utf-8' }); return res.end(fs.readFileSync(&#96;pub\${tep}&#96;));
  }
  if (!u.pathname.startsWith('/socket.io')) { res.writeHead(404); res.end(); }
});
const io = new Server(server, { maxHttpBufferSize: 1e8 });
io.engine.on('connection', (raw) =&gt; {
  raw.on('packet', (p: { data?: unknown }) =&gt; { if (typeof p.data === 'string') { dem.vao += p.data.length; if (p.data.includes('"call:')) dem.goiVao += p.data.length; } });
  raw.on('packetCreate', (p: { data?: unknown }) =&gt; { if (typeof p.data === 'string') { dem.ra += p.data.length; if (p.data.includes('"call:')) dem.goiRa += p.data.length; } });
});
io.use((s, next) =&gt; { const id = Number(s.handshake.auth.userId); if (!NGUOI[id]) return next(new Error('unauthorized')); s.data.user = { id }; next(); });
io.on('connection', (socket) =&gt; {
  const user = socket.data.user as { id: number };
  socket.join(&#96;user:\${user.id}&#96;);
  void (async () =&gt; {                                                         <span class="tok-comment">  // giả lượt hỏi DB rồi join mọi hội thoại (messaging.socket.ts:467)</span>
    await new Promise((r) =&gt; setTimeout(r, TRE_DB));
    for (const [t, ds] of Object.entries(HOI_THOAI)) if (ds.includes(user.id)) socket.join(&#96;thread:\${t}&#96;);
  })();
  if (suaSdp) socket.use(suaSdp);                                             <span class="tok-comment">  // chạy TRƯỚC handler của call.socket.ts</span>
  registerCallSignaling(io, socket, user);
});
server.listen(CONG, () =&gt; console.log(&#96;[may] nghe :\${CONG} · call.socket.ts của kho · TRE_DB=\${TRE_DB} ms&#96;));</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-5-1-udp" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking · 5.1 — UDP: gửi rồi quên</span><span class="lc-sub">Vì sao media đi UDP chứ không đi TCP</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-9-4-webrtc" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking · 9.4 — Lướt qua WebRTC: xuyên NAT bằng STUN và TURN</span><span class="lc-sub">Phần mạng của chương này</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">WebRTC</span><span class="v">Stack trình duyệt chở media peer-to-peer.</span></div>
  <div class="kv"><span class="k">Media</span><span class="v">RTP over UDP, ~1-2 Mbps mỗi stream — server không thấy.</span></div>
  <div class="kv"><span class="k">Signalling</span><span class="v">Phần relay SDP/ICE nhỏ để các peer tìm thấy nhau.</span></div>
  <div class="kv"><span class="k">Vai trò socket.io</span><span class="v">Chỉ relay signalling; không bao giờ chạm media.</span></div>
  <div class="kv"><span class="k">Room <code>user:</code></span><span class="v">Nơi signalling được định tuyến để mỗi peer tới được nhau.</span></div>
  <div class="kv"><span class="k">Tách hai tầng</span><span class="v">Media trên WebRTC, signalling trên socket.io — đừng nhầm.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Một cuộc gọi video là hai tầng: WebRTC cho media, socket.io cho signalling.</li><li>Media là RTP over UDP, peer-to-peer, ~1-2 Mbps mỗi stream, server không thấy.</li><li>Signalling là 5-20 packet relay SDP/ICE, ~2 KB tổng.</li><li>socket.io dùng room <code>user:</code> để các peer tìm thấy nhau.</li><li>Nhầm hai tầng là một sai lầm kiến trúc lớn.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — WebRTC signalling</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling — chuẩn Mozilla, có full example.</span></span></div>
</div>
`,
    },

    {
      title: '7.2 — SDP and ICE: what is in the packets you relay|||7.2 — SDP và ICE: cái trong packet bạn relay',
      slug: 'io-7-2-sdp-ice',
      type: 'VIDEO',
      description: 'SDP là text đề xuất codec + audio/video setup. ICE candidate là IP+port để peer thử kết nối. Bạn không phải parse — chỉ relay.',
      content: `
${G07_2}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>SDP and ICE: what is in the packets you relay</h2>
<p class="lead">Your server never modifies SDP or ICE — just relays. But you should read one at least once so &quot;why WebRTC needs signalling&quot; makes sense.</p>

<h3>SDP — Session Description Protocol</h3>
<pre><code class="language-text">v=0
o=- 4611751892845391000 2 IN IP4 127.0.0.1
s=-
t=0 0
a=group:BUNDLE 0 1
m=audio 9 UDP/TLS/RTP/SAVPF 111 103
a=rtpmap:111 opus/48000/2
a=rtcp-fb:111 transport-cc
m=video 9 UDP/TLS/RTP/SAVPF 96 97 98
a=rtpmap:96 VP8/90000
a=rtpmap:97 VP9/90000
a=rtcp-fb:96 ccm fir
a=setup:actpass
a=ice-ufrag:F7gI
a=ice-pwd:x9cml/YzichV2+XlhiMu8g
...
</code></pre>

<p>Plain text, 1-3 KB, about 50 lines of information: codecs (opus, VP8, VP9), bitrate, resolution, DTLS keys, ICE credentials. Peer A sends an &quot;offer&quot; SDP and peer B sends an &quot;answer&quot; SDP — agreeing on what both of them support. <strong>Measured:</strong> &quot;1-3 KB, ~50 lines&quot; holds for a <em>voice</em> call (1,290 B, 37 lines); add a video track and the offer is 5,880 B, 177 lines — every codec the browser can send is listed (35 <code>a=rtpmap</code> lines).</p>

<h3>ICE — Interactive Connectivity Establishment</h3>
<pre><code class="language-text">candidate:842163049 1 udp 1677729535 192.168.1.42 51234 typ srflx
candidate:1467250027 1 udp 2113937151 10.0.0.5 52111 typ host
candidate:1855263000 1 tcp 1518280447 66.11.12.13 9 typ relay
</code></pre>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">host</span><span class="lz-lnote">The peer's local IP (10.0.0.5:52111). The other peer tries to connect — which succeeds if they share a LAN</span></div>
<div class="lz-layer"><span class="lz-lname">srflx (server reflexive)</span><span class="lz-lnote">The peer's public IP as seen by a STUN server (192.168.1.42:51234). Needed behind NAT — the other peer tries to connect</span></div>
<div class="lz-layer"><span class="lz-lname">relay (TURN)</span><span class="lz-lnote">The TURN server's IP (66.11.12.13:9). If srflx does not work (symmetric NAT), it falls back to a TURN relay</span></div>
</div>

<h3>Server relay pattern</h3>
<pre><code class="language-ts">socket.on('call:offer', async ({ toUserId, sdp }) =&gt; {
  const target = &#96;user:\${toUserId}&#96;;
  const room = io.sockets.adapter.rooms.get(target);
  if (!room || room.size === 0) {
    return socket.emit('call:busy', { toUserId });   // recipient offline
  }
  io.to(target).emit('call:incoming', {
    fromUserId: socket.data.userId,
    sdp,
  });
});
</code></pre>

<div class="callout ok">
<p><strong>The server does not parse the SDP. It does not check codecs. It does not touch ICE.</strong> It only relays. That is the best thing about the WebRTC architecture — a dumb server and smart peers. <strong>Note on the code above:</strong> in this repo an offline callee gets <code>call:end</code> with <code>lyDo: &#39;khong-truc-tuyen&#39;</code>; <code>call:busy</code> means the callee is <em>already in another call</em> (lesson 7.3). <strong>Measured:</strong> the SHA-256 of the offer An sent equals the one Binh received.</p>
</div>

<h3>Trickle ICE — why ICE is many events</h3>
<pre><code class="language-text">Client-side WebRTC gathering ICE candidates asynchronously:
  t=0     onicecandidate: host      -&gt; emit call:ice
  t=100   onicecandidate: srflx     -&gt; emit call:ice
  t=500   onicecandidate: relay     -&gt; emit call:ice
  t=2000  onicecandidate: null      -&gt; done gathering

Peer khac nhan tung candidate và thu connect ngay khi co du.
Neu doi cho het candidate roi mới gui, se lag them 2s.
</code></pre>
<p><em>The timeline above is an illustration. Measured on one machine with a local STUN/TURN (coturn): first host +3 ms, first srflx +5 ms, first relay +400 ms (TURN allocation + auth challenge), last of 20 candidates +482 ms.</em></p>

<h3>Debug — inspect SDP</h3>
<pre><code class="language-tsx">// Client-side, sau khi tao offer
const offer = await pc.createOffer();
await pc.setLocalDescription(offer);
console.log(offer.sdp);
// Copy-paste vao webrtc-experiment.com/DetectRTC de parse
</code></pre>

<div class="pitfall">
<p><strong>Trap — modifying the SDP on the server to &quot;force H.264&quot;.</strong> SDP munging is common in older WebRTC documentation. With modern SDP and Unified Plan it usually breaks codec negotiation. If you MUST force a codec, use <code>RTCRtpTransceiver.setCodecPreferences()</code> on the client rather than parsing SDP text.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> SDP (1-3 KB of text) describes the codecs and audio/video setup a peer offers, ICE candidates (~50 bytes each) are the network routes a peer will try (host/srflx/relay) — the socket.io server only RELAYS them, never parsing or modifying, and trickle ICE lets candidates arrive one at a time instead of waiting for the whole list.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Log one SDP offer relayed through your server and read the codec and audio/video lines — confirm it is just text your server passes along unchanged.</li>
<li>Log the ICE candidates and classify them: host, srflx (reflexive), relay.</li>
<li>Enable trickle ICE and observe candidates arriving one at a time instead of after the full list is gathered.</li>
</ol>
<p><strong>Done when:</strong> you can read an SDP and ICE candidate off the wire and confirm your server only relays them.</p></div>

<h3>🔬 Measured: the SDP and ICE on the wire</h3>
<p>socket.io 4.8.3 · Chromium with a fake camera · this repo&#39;s <code>call.socket.ts</code> and <code>cuocGoi.ts</code> · a local STUN/TURN (coturn 4.6 in a container) with time-limited credentials signed the way <code>messages.routes.ts</code> signs them. The script reads the <code>call:offer</code> and every <code>call:ice</code> frame An sends (ICE password masked, fingerprint shortened):</p>
<div class="out">$ STUN=stun:127.0.0.1:19820 TURN_URL=turn:127.0.0.1:19820 TURN_SECRET=$TURN_SECRET npx tsx may.ts &amp;   node sdp.mjs
SDP offer (gọi VIDEO): 5880 B · 177 dòng · 35 dòng a=rtpmap
  v=0
  o=- &lt;số phiên&gt; 2 IN IP4 127.0.0.1
  a=group:BUNDLE 0 1
  m=audio 9 UDP/TLS/RTP/SAVPF 111 63 9 0 8 13 110 126
  a=ice-ufrag:6DpA
  a=ice-pwd:&lt;24 ký tự ngẫu nhiên&gt;
  a=fingerprint:sha-256 01:E7:C3:F1:A9:71…
  a=setup:actpass
  m=video 9 UDP/TLS/RTP/SAVPF 96 97 103 104 107 108 109 114 115 116 117 118 39 40 45 46 98 99 100 101 119 120 49 50 123 124 125
  a=ice-ufrag:6DpA
  a=ice-pwd:&lt;24 ký tự ngẫu nhiên&gt;
  a=fingerprint:sha-256 01:E7:C3:F1:A9:71…
  codec audio: opus red G722 PCMU PCMA CN telephone-event
  codec video: VP8 rtx H264 AV1 VP9 H265 red ulpfec
Bình nhận được (call:incoming) giống hệt offer của An? sha256 04fd8af0b0bd vs 04fd8af0b0bd ⇒ GIỐNG HỆT
ICE An gửi (trickle) — mốc ms sau khi gửi offer:
  +   3 ms  host   udp 127.0.0.1:58514  prio 2122260223  · khung 265 B, chuỗi candidate 115 ký tự
  +   4 ms  host   udp 192.168.1.100:55786  prio 2122194687  · khung 269 B, chuỗi candidate 119 ký tự
  +   4 ms  host   udp 127.0.0.1:63098  prio 2122260223  · khung 265 B, chuỗi candidate 115 ký tự
  +   4 ms  host   udp 192.168.1.100:53292  prio 2122194687  · khung 269 B, chuỗi candidate 119 ký tự
  +   5 ms  srflx  udp 172.17.0.1:56685  prio 1686052607  · khung 295 B, chuỗi candidate 145 ký tự
  +   5 ms  srflx  udp 172.17.0.1:55279  prio 1685987071  · khung 299 B, chuỗi candidate 149 ký tự
  +   5 ms  srflx  udp 172.17.0.1:57074  prio 1685987071  · khung 299 B, chuỗi candidate 149 ký tự
  +   5 ms  srflx  udp 172.17.0.1:60658  prio 1686052607  · khung 295 B, chuỗi candidate 145 ký tự
  + 400 ms  relay  udp 172.17.0.7:49167  prio 58597375  · khung 294 B, chuỗi candidate 144 ký tự
  + 400 ms  relay  udp 172.17.0.7:49160  prio 58597375  · khung 294 B, chuỗi candidate 144 ký tự
  + 401 ms  relay  udp 172.17.0.7:49169  prio 58662911  · khung 294 B, chuỗi candidate 144 ký tự
  + 401 ms  relay  udp 172.17.0.7:49168  prio 58662911  · khung 294 B, chuỗi candidate 144 ký tự
  + 401 ms  host   tcp 127.0.0.1:9  prio 1518280447  · khung 274 B, chuỗi candidate 124 ký tự
  + 401 ms  host   tcp 192.168.1.100:9  prio 1518214911  · khung 280 B, chuỗi candidate 130 ký tự
  + 401 ms  host   tcp 127.0.0.1:9  prio 1518280447  · khung 274 B, chuỗi candidate 124 ký tự
  + 401 ms  host   tcp 192.168.1.100:9  prio 1518214911  · khung 280 B, chuỗi candidate 130 ký tự
  + 474 ms  host   udp 127.0.0.1:61155  prio 2122260223  · khung 264 B, chuỗi candidate 114 ký tự
  + 474 ms  host   udp 192.168.1.100:55619  prio 2122194687  · khung 269 B, chuỗi candidate 119 ký tự
  + 481 ms  srflx  udp 172.17.0.1:63160  prio 1685987071  · khung 298 B, chuỗi candidate 148 ký tự
  + 482 ms  srflx  udp 172.17.0.1:60935  prio 1686052607  · khung 295 B, chuỗi candidate 145 ký tự
cặp ICE thắng: host 127.0.0.1:58514/udp ⇄ host 192.168.1.100:55619/udp
SDP offer (gọi THOẠI, như nút gọi mặc định của kho): 1290 B · 37 dòng
một khung call:ice nguyên văn:
  42["call:ice",{"callId":"&lt;uuid&gt;","candidate":{"candidate":"candidate:3898807740 1 udp 1686052607 172.17.0.1 56685 typ srflx raddr 127.0.0.1 rport 58514 generation 0 ufrag &lt;ufrag&gt; network-id 2 network-cost 50","sdpMid":"0","sdpMLineIndex":0,"usernameFragment":"&lt;ufrag&gt;"}}]</div>
<p>The srflx address is what coturn saw after Docker&#39;s NAT — the same thing a home router does. Both browsers sat on one machine, so a host pair won.</p>
<p><strong>The trap, through this repo&#39;s code</strong> — a middleware rewrites <code>m=video</code> to H264 only before <code>call.socket.ts</code> relays the offer; then the right way, <code>setCodecPreferences()</code>, in a clean page:</p>
<div class="out">$ MUNGE=1 npx tsx may.ts &amp;   node munge.mjs
nhật ký Bình:
  call:incoming from An
  state do-chuong
  error Failed to execute 'setRemoteDescription' on 'RTCPeerConnection': Failed to parse SessionDescription.  Failed to parse codecs correctly.
  state roi
  call:end tu-choi
nhật ký An:
  state dang-goi
  call:ringing
  call:end tu-choi
  state roi
$ # log server
[may] nghe :19810 · call.socket.ts của kho · TRE_DB=5 ms
[munge] đã sửa offer: m=video chỉ còn H264 (103 107 109 115 117 39 119)
[may  5180 ms] INFO cuộc gọi bắt đầu {"callId":"80029231-7016-43b8-a171-a4b19aacf52d","tu":1,"den":2}
[may  5220 ms] INFO cuộc gọi kết thúc {"callId":"80029231-7016-43b8-a171-a4b19aacf52d","lyDo":"tu-choi","giay":0,"daNhan":false}</div>
<div class="out">$ node codec.mjs
mặc định                                 OK · đang gửi video/VP8
sửa SDP: m=video chỉ còn H264            OperationError: Failed to parse SessionDescription.  Failed to parse codecs correctly.
sửa SDP: xoá dòng a=rtpmap của VP8       OperationError: Failed to parse SessionDescription.  Failed to parse codecs correctly.
setCodecPreferences(H264 trước)          OK · đang gửi video/H264
setCodecPreferences(VP9 trước)           OK · đang gửi video/VP9
setCodecPreferences(AV1 trước)           OK · đang gửi video/AV1
trình duyệt này gửi được: VP8 rtx H264 AV1 VP9 H265 red ulpfec</div>
<p>The user saw &quot;call rejected&quot;, not an error. Pick codecs in the browser; never edit SDP text on the server.</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash"><span class="tok-comment"># STUN + TURN cục bộ: coturn (cùng ảnh với docker-compose.yml của kho), mật khẩu ký HMAC như messages.routes.ts</span>
docker run -d --name sio-turn -p 127.0.0.1:19820:3478/udp -p 127.0.0.1:19820:3478/tcp \\
  -v ./turn/turnserver.conf:/etc/coturn/turnserver.conf:ro coturn/coturn:4.6-alpine \\
  -c /etc/coturn/turnserver.conf --static-auth-secret=$TURN_SECRET
<span class="tok-comment"># server (call.socket.ts của kho) cấp iceServers cho trình duyệt</span>
STUN=stun:127.0.0.1:19820 TURN_URL=turn:127.0.0.1:19820 TURN_SECRET=$TURN_SECRET npx tsx may.ts &amp;
node sdp.mjs               <span class="tok-comment">  # in SDP offer + từng call:ice trên dây</span>
MUNGE=1 npx tsx may.ts &amp;   <span class="tok-comment">  # cái bẫy: server sửa SDP trước khi relay</span>
node munge.mjs
node codec.mjs             <span class="tok-comment">  # cách đúng: setCodecPreferences()</span></code></pre>
<pre><code class="language-typescript"><span class="tok-comment">// munge.ts — CÁI BẪY "server sửa SDP để ép H.264": trước khi call.socket.ts relay call:offer, cắt dòng m=video chỉ còn payload H264.</span>
<span class="tok-comment">// Kiểu sửa chuỗi SDP mà nhiều bài cũ trên mạng chỉ — chạy với Plan B ngày xưa, gãy với SDP hiện đại.</span>
export const suaSdp = ([ev, p]: [string, { sdp?: { sdp: string } }], next: (e?: Error) =&gt; void) =&gt; {
  if (ev === 'call:offer' &amp;&amp; p?.sdp?.sdp) {
    const h264 = [...p.sdp.sdp.matchAll(/a=rtpmap:(\\d+) H264\\/90000/g)].map((m) =&gt; m[1]);
    p.sdp.sdp = p.sdp.sdp.replace(/(m=video \\d+ \\S+) [\\d ]+/, &#96;$1 \${h264.join(' ')}&#96;);
    console.log(&#96;[munge] đã sửa offer: m=video chỉ còn H264 (\${h264.join(' ')})&#96;);
  }
  next();
};</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-2-3-nat" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking · 2.3 — NAT, private IP ranges and Docker networking</span><span class="lc-sub">The NAT that turns a host candidate into srflx</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-9-4-webrtc" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking · 9.4 — A quick look at WebRTC: crossing NAT with STUN and TURN</span><span class="lc-sub">STUN and TURN from the network side</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">SDP</span><span class="v">1-3 KB of text describing the codecs and audio/video a peer offers.</span></div>
  <div class="kv"><span class="k">ICE candidate</span><span class="v">~50 bytes naming a network route a peer will try.</span></div>
  <div class="kv"><span class="k">host / srflx / relay</span><span class="v">Candidate types: local, NAT-reflexive, TURN-relayed.</span></div>
  <div class="kv"><span class="k">Relay-only server</span><span class="v">socket.io passes SDP/ICE through, never parsing or modifying.</span></div>
  <div class="kv"><span class="k">Trickle ICE</span><span class="v">Send candidates one at a time instead of waiting for the full list.</span></div>
  <div class="kv"><span class="k">Offer / answer</span><span class="v">The two SDP messages that negotiate the session.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>SDP is 1-3 KB of text describing the codecs and audio/video a peer offers.</li><li>ICE candidates (~50 bytes each) are the network routes a peer will try — host, srflx, relay.</li><li>The socket.io server only RELAYS them; it never parses or modifies.</li><li>Trickle ICE lets candidates arrive one at a time.</li><li>That beats waiting for the whole list before connecting.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — WebRTC connectivity</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Connectivity — cách ICE hoạt động, kèm sơ đồ.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 8829 — JSEP</span><span class="lc-sub">datatracker.ietf.org/doc/html/rfc8829 — chuẩn cho JavaScript Session Establishment.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>SDP và ICE: cái trong packet bạn relay</h2>
<p class="lead">Server bạn không bao giờ modify SDP hay ICE — chỉ relay. Nhưng bạn nên đọc một lần để &quot;vì sao WebRTC cần signalling&quot; có nghĩa.</p>

<h3>SDP — Session Description Protocol</h3>
<pre><code class="language-text">v=0
o=- 4611751892845391000 2 IN IP4 127.0.0.1
s=-
m=audio 9 UDP/TLS/RTP/SAVPF 111 103
a=rtpmap:111 opus/48000/2
m=video 9 UDP/TLS/RTP/SAVPF 96 97 98
a=rtpmap:96 VP8/90000
a=rtpmap:97 VP9/90000
a=ice-ufrag:F7gI
...
</code></pre>

<p>Text plain, 1-3 KB. ~50 dòng thông tin: codec (opus, VP8, VP9), bitrate, resolution, DTLS keys, ICE credentials. Peer A gửi &quot;offer&quot; SDP, peer B gửi &quot;answer&quot; SDP — thoả thuận cái gì cả hai support. <strong>Đo thật:</strong> &quot;1-3 KB, ~50 dòng&quot; đúng cho cuộc gọi <em>thoại</em> (1.290 B, 37 dòng); thêm một luồng hình thì offer là 5.880 B, 177 dòng — trình duyệt liệt kê mọi codec nó gửi được (35 dòng <code>a=rtpmap</code>).</p>

<h3>ICE — Interactive Connectivity Establishment</h3>
<pre><code class="language-text">candidate:842163049 1 udp 1677729535 192.168.1.42 51234 typ srflx
candidate:1467250027 1 udp 2113937151 10.0.0.5 52111 typ host
candidate:1855263000 1 tcp 1518280447 66.11.12.13 9 typ relay
</code></pre>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">host</span><span class="lz-lnote">IP local của peer. Peer khác thử connect — thành công nếu cùng LAN</span></div>
<div class="lz-layer"><span class="lz-lname">srflx (server reflexive)</span><span class="lz-lnote">IP public của peer nhìn từ STUN server. Cần khi NAT — peer khác thử connect</span></div>
<div class="lz-layer"><span class="lz-lname">relay (TURN)</span><span class="lz-lnote">IP của TURN server. Nếu srflx không work (NAT symmetric), fall back TURN relay</span></div>
</div>

<h3>Pattern relay ở server</h3>
<pre><code class="language-ts">socket.on('call:offer', async ({ toUserId, sdp }) =&gt; {
  const target = &#96;user:${'${toUserId}'}&#96;;
  const room = io.sockets.adapter.rooms.get(target);
  if (!room || room.size === 0) {
    return socket.emit('call:busy', { toUserId });
  }
  io.to(target).emit('call:incoming', {
    fromUserId: socket.data.userId,
    sdp,
  });
});
</code></pre>

<div class="callout ok">
<p><strong>Server không parse SDP. Không kiểm codec. Không đổi ICE.</strong> Chỉ relay. Đây là điểm hay nhất của architecture WebRTC — server dumb, peers smart. <strong>Ghi chú về khối mã trên:</strong> trong kho, người nhận không online thì người gọi nhận <code>call:end</code> với <code>lyDo: &#39;khong-truc-tuyen&#39;</code>; <code>call:busy</code> là khi người nhận <em>đang trong một cuộc gọi khác</em> (bài 7.3). <strong>Đo thật:</strong> mã băm SHA-256 của offer An gửi và offer Bình nhận giống hệt.</p>
</div>

<h3>Trickle ICE — vì sao ICE là nhiều event</h3>
<pre><code class="language-text">Client-side WebRTC gathering ICE candidates asynchronously:
  t=0     onicecandidate: host      -&gt; emit call:ice
  t=100   onicecandidate: srflx     -&gt; emit call:ice
  t=500   onicecandidate: relay     -&gt; emit call:ice
  t=2000  onicecandidate: null      -&gt; done gathering

Peer khac nhan tung candidate va thu connect ngay khi co du.
Neu doi cho het candidate roi moi gui, se lag them 2s.
</code></pre>
<p><em>Dòng thời gian trên là minh hoạ. Đo trên một máy với STUN/TURN cục bộ (coturn): host đầu tiên +3 ms, srflx +5 ms, relay +400 ms (cấp cổng TURN + một lượt thách mật khẩu), ứng viên cuối trong 20 cái +482 ms.</em></p>

<div class="pitfall">
<p><strong>Bẫy — modify SDP ở server để &quot;force H.264&quot;.</strong> SDP munging phổ biến trong WebRTC docs cũ. Ở modern SDP + Unified Plan, nó thường vỡ codec negotiation. Nếu bạn PHẢI force codec, dùng <code>RTCRtpTransceiver.setCodecPreferences()</code> phía client, không parse SDP text.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> SDP (1-3 KB text) mô tả codec + audio/video setup mà peer đưa ra, ICE candidates (~50 byte mỗi cái) là các cách kết nối network (host/srflx/relay) mà peer thử — server socket.io chỉ RELAY, không parse hay modify.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Log một SDP offer được relay qua server và đọc các dòng codec và audio/video — xác nhận nó chỉ là text server chuyển tiếp nguyên trạng.</li>
<li>Log các ICE candidate và phân loại: host, srflx (reflexive), relay.</li>
<li>Bật trickle ICE và quan sát candidate tới từng cái một thay vì sau khi gom đủ cả danh sách.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đọc được một SDP và một ICE candidate trên dây và xác nhận server chỉ relay chúng.</p></div>

<h3>🔬 Đo thật: SDP và ICE trên dây</h3>
<p>socket.io 4.8.3 · Chromium có camera giả · <code>call.socket.ts</code> và <code>cuocGoi.ts</code> của kho · STUN/TURN cục bộ (coturn 4.6 trong container) với mật khẩu ngắn hạn ký đúng cách <code>messages.routes.ts</code> ký. Script đọc khung <code>call:offer</code> và mọi khung <code>call:ice</code> An gửi (che mật khẩu ICE, rút gọn fingerprint):</p>
<div class="out">$ STUN=stun:127.0.0.1:19820 TURN_URL=turn:127.0.0.1:19820 TURN_SECRET=$TURN_SECRET npx tsx may.ts &amp;   node sdp.mjs
SDP offer (gọi VIDEO): 5880 B · 177 dòng · 35 dòng a=rtpmap
  v=0
  o=- &lt;số phiên&gt; 2 IN IP4 127.0.0.1
  a=group:BUNDLE 0 1
  m=audio 9 UDP/TLS/RTP/SAVPF 111 63 9 0 8 13 110 126
  a=ice-ufrag:6DpA
  a=ice-pwd:&lt;24 ký tự ngẫu nhiên&gt;
  a=fingerprint:sha-256 01:E7:C3:F1:A9:71…
  a=setup:actpass
  m=video 9 UDP/TLS/RTP/SAVPF 96 97 103 104 107 108 109 114 115 116 117 118 39 40 45 46 98 99 100 101 119 120 49 50 123 124 125
  a=ice-ufrag:6DpA
  a=ice-pwd:&lt;24 ký tự ngẫu nhiên&gt;
  a=fingerprint:sha-256 01:E7:C3:F1:A9:71…
  codec audio: opus red G722 PCMU PCMA CN telephone-event
  codec video: VP8 rtx H264 AV1 VP9 H265 red ulpfec
Bình nhận được (call:incoming) giống hệt offer của An? sha256 04fd8af0b0bd vs 04fd8af0b0bd ⇒ GIỐNG HỆT
ICE An gửi (trickle) — mốc ms sau khi gửi offer:
  +   3 ms  host   udp 127.0.0.1:58514  prio 2122260223  · khung 265 B, chuỗi candidate 115 ký tự
  +   4 ms  host   udp 192.168.1.100:55786  prio 2122194687  · khung 269 B, chuỗi candidate 119 ký tự
  +   4 ms  host   udp 127.0.0.1:63098  prio 2122260223  · khung 265 B, chuỗi candidate 115 ký tự
  +   4 ms  host   udp 192.168.1.100:53292  prio 2122194687  · khung 269 B, chuỗi candidate 119 ký tự
  +   5 ms  srflx  udp 172.17.0.1:56685  prio 1686052607  · khung 295 B, chuỗi candidate 145 ký tự
  +   5 ms  srflx  udp 172.17.0.1:55279  prio 1685987071  · khung 299 B, chuỗi candidate 149 ký tự
  +   5 ms  srflx  udp 172.17.0.1:57074  prio 1685987071  · khung 299 B, chuỗi candidate 149 ký tự
  +   5 ms  srflx  udp 172.17.0.1:60658  prio 1686052607  · khung 295 B, chuỗi candidate 145 ký tự
  + 400 ms  relay  udp 172.17.0.7:49167  prio 58597375  · khung 294 B, chuỗi candidate 144 ký tự
  + 400 ms  relay  udp 172.17.0.7:49160  prio 58597375  · khung 294 B, chuỗi candidate 144 ký tự
  + 401 ms  relay  udp 172.17.0.7:49169  prio 58662911  · khung 294 B, chuỗi candidate 144 ký tự
  + 401 ms  relay  udp 172.17.0.7:49168  prio 58662911  · khung 294 B, chuỗi candidate 144 ký tự
  + 401 ms  host   tcp 127.0.0.1:9  prio 1518280447  · khung 274 B, chuỗi candidate 124 ký tự
  + 401 ms  host   tcp 192.168.1.100:9  prio 1518214911  · khung 280 B, chuỗi candidate 130 ký tự
  + 401 ms  host   tcp 127.0.0.1:9  prio 1518280447  · khung 274 B, chuỗi candidate 124 ký tự
  + 401 ms  host   tcp 192.168.1.100:9  prio 1518214911  · khung 280 B, chuỗi candidate 130 ký tự
  + 474 ms  host   udp 127.0.0.1:61155  prio 2122260223  · khung 264 B, chuỗi candidate 114 ký tự
  + 474 ms  host   udp 192.168.1.100:55619  prio 2122194687  · khung 269 B, chuỗi candidate 119 ký tự
  + 481 ms  srflx  udp 172.17.0.1:63160  prio 1685987071  · khung 298 B, chuỗi candidate 148 ký tự
  + 482 ms  srflx  udp 172.17.0.1:60935  prio 1686052607  · khung 295 B, chuỗi candidate 145 ký tự
cặp ICE thắng: host 127.0.0.1:58514/udp ⇄ host 192.168.1.100:55619/udp
SDP offer (gọi THOẠI, như nút gọi mặc định của kho): 1290 B · 37 dòng
một khung call:ice nguyên văn:
  42["call:ice",{"callId":"&lt;uuid&gt;","candidate":{"candidate":"candidate:3898807740 1 udp 1686052607 172.17.0.1 56685 typ srflx raddr 127.0.0.1 rport 58514 generation 0 ufrag &lt;ufrag&gt; network-id 2 network-cost 50","sdpMid":"0","sdpMLineIndex":0,"usernameFragment":"&lt;ufrag&gt;"}}]</div>
<p>Địa chỉ srflx là cái coturn nhìn thấy sau NAT của Docker — y như router ở nhà làm với bạn. Hai trình duyệt cùng một máy nên cặp host thắng.</p>
<p><strong>Cái bẫy, chạy qua mã của kho</strong> — một middleware sửa <code>m=video</code> chỉ còn H264 trước khi <code>call.socket.ts</code> relay offer; rồi cách đúng, <code>setCodecPreferences()</code>, trong một trang sạch:</p>
<div class="out">$ MUNGE=1 npx tsx may.ts &amp;   node munge.mjs
nhật ký Bình:
  call:incoming from An
  state do-chuong
  error Failed to execute 'setRemoteDescription' on 'RTCPeerConnection': Failed to parse SessionDescription.  Failed to parse codecs correctly.
  state roi
  call:end tu-choi
nhật ký An:
  state dang-goi
  call:ringing
  call:end tu-choi
  state roi
$ # log server
[may] nghe :19810 · call.socket.ts của kho · TRE_DB=5 ms
[munge] đã sửa offer: m=video chỉ còn H264 (103 107 109 115 117 39 119)
[may  5180 ms] INFO cuộc gọi bắt đầu {"callId":"80029231-7016-43b8-a171-a4b19aacf52d","tu":1,"den":2}
[may  5220 ms] INFO cuộc gọi kết thúc {"callId":"80029231-7016-43b8-a171-a4b19aacf52d","lyDo":"tu-choi","giay":0,"daNhan":false}</div>
<div class="out">$ node codec.mjs
mặc định                                 OK · đang gửi video/VP8
sửa SDP: m=video chỉ còn H264            OperationError: Failed to parse SessionDescription.  Failed to parse codecs correctly.
sửa SDP: xoá dòng a=rtpmap của VP8       OperationError: Failed to parse SessionDescription.  Failed to parse codecs correctly.
setCodecPreferences(H264 trước)          OK · đang gửi video/H264
setCodecPreferences(VP9 trước)           OK · đang gửi video/VP9
setCodecPreferences(AV1 trước)           OK · đang gửi video/AV1
trình duyệt này gửi được: VP8 rtx H264 AV1 VP9 H265 red ulpfec</div>
<p>Người dùng thấy &quot;cuộc gọi bị từ chối&quot;, không thấy lỗi. Chọn codec ở trình duyệt; đừng bao giờ sửa chuỗi SDP ở server.</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash"><span class="tok-comment"># STUN + TURN cục bộ: coturn (cùng ảnh với docker-compose.yml của kho), mật khẩu ký HMAC như messages.routes.ts</span>
docker run -d --name sio-turn -p 127.0.0.1:19820:3478/udp -p 127.0.0.1:19820:3478/tcp \\
  -v ./turn/turnserver.conf:/etc/coturn/turnserver.conf:ro coturn/coturn:4.6-alpine \\
  -c /etc/coturn/turnserver.conf --static-auth-secret=$TURN_SECRET
<span class="tok-comment"># server (call.socket.ts của kho) cấp iceServers cho trình duyệt</span>
STUN=stun:127.0.0.1:19820 TURN_URL=turn:127.0.0.1:19820 TURN_SECRET=$TURN_SECRET npx tsx may.ts &amp;
node sdp.mjs               <span class="tok-comment">  # in SDP offer + từng call:ice trên dây</span>
MUNGE=1 npx tsx may.ts &amp;   <span class="tok-comment">  # cái bẫy: server sửa SDP trước khi relay</span>
node munge.mjs
node codec.mjs             <span class="tok-comment">  # cách đúng: setCodecPreferences()</span></code></pre>
<pre><code class="language-typescript"><span class="tok-comment">// munge.ts — CÁI BẪY "server sửa SDP để ép H.264": trước khi call.socket.ts relay call:offer, cắt dòng m=video chỉ còn payload H264.</span>
<span class="tok-comment">// Kiểu sửa chuỗi SDP mà nhiều bài cũ trên mạng chỉ — chạy với Plan B ngày xưa, gãy với SDP hiện đại.</span>
export const suaSdp = ([ev, p]: [string, { sdp?: { sdp: string } }], next: (e?: Error) =&gt; void) =&gt; {
  if (ev === 'call:offer' &amp;&amp; p?.sdp?.sdp) {
    const h264 = [...p.sdp.sdp.matchAll(/a=rtpmap:(\\d+) H264\\/90000/g)].map((m) =&gt; m[1]);
    p.sdp.sdp = p.sdp.sdp.replace(/(m=video \\d+ \\S+) [\\d ]+/, &#96;$1 \${h264.join(' ')}&#96;);
    console.log(&#96;[munge] đã sửa offer: m=video chỉ còn H264 (\${h264.join(' ')})&#96;);
  }
  next();
};</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-2-3-nat" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking · 2.3 — NAT, dải IP riêng và mạng Docker</span><span class="lc-sub">Cái NAT biến ứng viên host thành srflx</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-9-4-webrtc" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Networking · 9.4 — Lướt qua WebRTC: xuyên NAT bằng STUN và TURN</span><span class="lc-sub">STUN và TURN nhìn từ phía mạng</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">SDP</span><span class="v">1-3 KB text mô tả codec và audio/video mà một peer đưa ra.</span></div>
  <div class="kv"><span class="k">ICE candidate</span><span class="v">~50 byte nêu một cách kết nối network mà peer sẽ thử.</span></div>
  <div class="kv"><span class="k">host / srflx / relay</span><span class="v">Các loại candidate: local, NAT-reflexive, TURN-relay.</span></div>
  <div class="kv"><span class="k">Server chỉ relay</span><span class="v">socket.io chuyển SDP/ICE qua, không parse hay modify.</span></div>
  <div class="kv"><span class="k">Trickle ICE</span><span class="v">Gửi candidate từng cái một thay vì chờ đủ danh sách.</span></div>
  <div class="kv"><span class="k">Offer / answer</span><span class="v">Hai thông điệp SDP thương lượng phiên.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>SDP là 1-3 KB text mô tả codec và audio/video mà một peer đưa ra.</li><li>ICE candidate (~50 byte mỗi cái) là các cách kết nối network mà peer thử — host, srflx, relay.</li><li>Server socket.io chỉ RELAY; không bao giờ parse hay modify.</li><li>Trickle ICE cho candidate tới từng cái một.</li><li>Cách đó tốt hơn chờ cả danh sách rồi mới kết nối.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — WebRTC connectivity</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Connectivity — cách ICE hoạt động, kèm sơ đồ.</span></span></div>
</div>
`,
    },

    {
      title: '7.3 — Room semantics: incoming, ringing, busy|||7.3 — Room semantics: incoming, ringing, busy',
      slug: 'io-7-3-room-call',
      type: 'VIDEO',
      description: '`call:incoming` đến room `user:${toUserId}` để bắt mọi tab của recipient. Kho này còn kiểm `socket.rooms.has("thread:X")` để tránh spam.',
      content: `
${G07_3}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>Room semantics: incoming, ringing, busy</h2>
<p class="lead">A call event routes to a person, not a socket. This lesson traces how this repo uses rooms to find who to notify, and why the pattern is more nuanced than <code>io.to(user).emit</code>.</p>

<h3>The basic case</h3>
<pre><code class="language-ts">// Recipient online — deliver call:incoming
socket.on('call:offer', async ({ toUserId, sdp }) =&gt; {
  const target = &#96;user:\${toUserId}&#96;;
  const room = io.sockets.adapter.rooms.get(target);
  if (!room || room.size === 0) {
    return socket.emit('call:busy', { toUserId });   // offline
  }
  io.to(target).emit('call:incoming', { fromUserId: socket.data.userId, sdp });
});
</code></pre>

<p>Room <code>user:42</code> delivers <code>call:incoming</code> to EVERY tab user 42 has open. Each tab's UI shows an &quot;incoming call&quot; dialog.</p>

<h3>This repo adds a layer — thread-based filtering</h3>
<pre><code class="language-ts">// call.socket.ts:132
const inThread = socket.rooms.has(&#96;thread:\${threadId}&#96;);
// Chi ai dang MO thread do moi nhan call notification tren tab do
</code></pre>

<p>Why? If a user has 5 tabs open and only 1 has the caller's chat open, you do not want the call dialog popping up in EVERY tab. Only in that thread's tab. It removes a genuine UX annoyance.</p>
<p><strong>Correction (measured, 13/11/2026):</strong> that is not what the check does. <code>trongHoiThoai()</code> runs on the <em>caller&#39;s</em> socket — &quot;are you a member of this conversation?&quot;, a permission check — and <code>messaging.socket.ts</code> joins every socket to <em>all</em> of its thread rooms at connect. <code>call:incoming</code> goes to the <code>user:</code> room, so <strong>every tab rings</strong> (two tabs measured: both <code>do-chuong</code>).</p>

<h3>The three call states</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">busy</span><span class="lz-nsub">the recipient is fully offline</span></span>
<span class="lz-nbody">Room <code>user:B</code> size 0. Server emit <code>call:busy</code> to the caller. The caller's UI shows &quot;Not available&quot;. <strong>In this repo:</strong> offline ⇒ <code>call:end</code> with <code>lyDo: &#39;khong-truc-tuyen&#39;</code> (commit 0852eb4ed); <code>call:busy</code> only when someone is already in a call.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">ringing</span><span class="lz-nsub">the recipient is online and the call is waiting to be answered</span></span>
<span class="lz-nbody">Server emit <code>call:incoming</code> to B, and emits <code>call:ringing</code> to A so A knows B received the notification. A's UI shows &quot;Ringing...&quot;.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">answered / rejected</span><span class="lz-nsub">B has responded</span></span>
<span class="lz-nbody">B emit <code>call:answer</code> (accept) or <code>call:reject</code>. The server relays it to A. The ringing UI becomes connected or dismissed.</span>
</div>
</div>

<h3>Timeout ringing</h3>
<pre><code class="language-ts">// Client-side: neu ringing > 30s, tu cancel
useEffect(() =&gt; {
  if (callState === 'ringing') {
    const timer = setTimeout(() =&gt; {
      socket.emit('call:end', { toUserId });
      setCallState('missed');
    }, 30000);
    return () =&gt; clearTimeout(timer);
  }
}, [callState]);
</code></pre>
<p><em>Illustration. In this repo the ring timeout lives on the server: <code>HAN_DO_CHUONG_MS = 45_000</code> — measured: 45.1 s, then <code>call:end</code> &quot;khong-tra-loi&quot; to both sides.</em></p>

<h3>Cleanup khi caller disconnect</h3>
<pre><code class="language-ts">socket.on('disconnect', () =&gt; {
  // Neu socket nay dang trong call, notify peer
  const activeCalls = getActiveCallsForSocket(socket.id);
  for (const call of activeCalls) {
    io.to(&#96;user:\${call.peerUserId}&#96;).emit('call:end', {
      reason: 'peer-disconnected',
    });
  }
});
</code></pre>

<div class="callout warn">
<p><strong>Without this handler, calls turn into ghosts.</strong> The caller's browser crashes mid-call. The recipient still sees &quot;connecting&quot; and is never told otherwise. The UI is stuck forever. The fix: track the active call per socket and clean it up on disconnect.</p>
</div>

<div class="pitfall">
<p><strong>Trap — tracking a call by socket ID rather than by userId.</strong> A reconnect means a new sid, which means the call is lost. Track by <code>callId</code> (a UUID) plus userId — lesson 1.5's pattern applied again.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Room <code>user:${'${uid}'}</code> routes call notifications to every tab the recipient has open; this repo filters further with <code>socket.rooms.has(&quot;thread:X&quot;)</code> so it does not spam all of them; three states (busy / ringing / answered-rejected) map onto 3-4 events; and cleanup on disconnect matters so calls do not turn into ghosts.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Route a call notification to the <code>user:</code> room and confirm every open tab of the recipient rings.</li>
<li>Filter with <code>socket.rooms.has(&quot;thread:X&quot;)</code> so you do not spam every tab, and compare the behaviour.</li>
<li>Model the three states (busy, ringing, answered/rejected) as events, then disconnect mid-call and confirm your cleanup prevents a ghost call.</li>
</ol>
<p><strong>Done when:</strong> the recipient's tabs ring correctly, the states transition cleanly, and a disconnect leaves no ghost call.</p></div>

<h3>🔬 Measured: who rings, every way a call ends</h3>
<p>socket.io 4.8.3 · this repo&#39;s <code>call.socket.ts</code> (server) and <code>cuocGoi.ts</code> (client, wired like <code>CuocGoiOverlay.tsx</code>, including its <code>beforeunload</code>) · real Chromium tabs, one socket each. Where the repo joins rooms and routes the call:</p>
<div class="out">$ cd ~/api-backend &amp;&amp; grep -n "socket.join(\\&#96;user:\\|socket.join(\\&#96;thread:\\\${t.id}\\|registerCallSignaling(io" src/socket/messaging.socket.ts
411:    socket.join(&#96;user:\${user.id}&#96;);
467:          socket.join(&#96;thread:\${t.id}&#96;);
585:    registerCallSignaling(io!, socket, user);
$ grep -n "socket.rooms.has\\|io.to(phong(p.toUserId)).emit('call:incoming'\\|HAN_DO_CHUONG_MS =\\|const conSocket\\|if (conSocket) return" src/socket/call.socket.ts
34:const HAN_DO_CHUONG_MS = 45_000;
132:    &amp;&amp; socket.rooms.has(&#96;thread:\${threadId}&#96;);
210:      io.to(phong(p.toUserId)).emit('call:incoming', {
270:    const conSocket = Array.from(io.sockets.sockets.values())
273:    if (conSocket) return;
$ grep -n "beforeunload\\|truocKhiDong = " frontend/src/components/messaging/CuocGoiOverlay.tsx
172:    const truocKhiDong = () =&gt; { if (trangThai !== 'roi') goi.cupMay(); };
173:    window.addEventListener('beforeunload', truocKhiDong);
174:    return () =&gt; window.removeEventListener('beforeunload', truocKhiDong);</div>
<p><strong>Two tabs.</strong> Binh answers in tab 1. Tab 2 is never told and keeps ringing; closing it runs <code>beforeunload</code> ⇒ <code>cupMay()</code> ⇒ <code>call:end</code> with the same callId — and the server hangs up the call Binh is talking in:</p>
<div class="out">$ node haitab.mjs
  1.4 s  An bấm gọi video (hội thoại 1)
  3.8 s  An: dang-goi · Bình tab 1: do-chuong · Bình tab 2: do-chuong
  3.8 s  Bình bắt máy ở TAB 1
  8.9 s  An: dang-noi · Bình tab 1: dang-noi · Bình tab 2: do-chuong   (5 s sau khi bắt máy)
  9.2 s  Bình đóng TAB 2 (tab vẫn đang reo) — beforeunload của CuocGoiOverlay chạy
 10.4 s  An: roi · Bình tab 1: roi · Bình tab 2: (đã đóng)
 10.4 s  nhật ký An: state dang-goi → call:ringing → call:answered → ontrack: peer media arrived → ontrack: peer media arrived → state dang-noi → call:end cup-may → state roi
$ # log server
[may] nghe :19810 · call.socket.ts của kho · TRE_DB=5 ms
[may  5588 ms] INFO cuộc gọi bắt đầu {"callId":"b575d693-c253-40c9-9d95-5abde04f2d8f","tu":1,"den":2}
[may 11734 ms] INFO cuộc gọi kết thúc {"callId":"b575d693-c253-40c9-9d95-5abde04f2d8f","lyDo":"cup-may","giay":5,"daNhan":true}</div>
<p><strong>Busy, offline, no answer</strong> — the offline case also on the server code from <em>before</em> commit 0852eb4ed, side by side:</p>
<div class="out">$ node ban.mjs
  2.1 s  An đang nói với Bình. Chi gọi An (hội thoại 2):
  2.8 s    Chi nhận: call:busy ho → state roi
  2.8 s  An mở tab thứ hai, bấm gọi Chi (hội thoại 2):
  3.5 s    tab 2 của An nhận: call:busy toi → state roi</div>
<div class="out">$ npx tsx may.ts &amp;   (cd cu &amp;&amp; CONG=19812 npx tsx may.ts &amp;)   node vang.mjs
  0.8 s  gọi Chi (offline) · server mới
  1.5 s  gọi Chi (offline) · server TRƯỚC bản vá 0852eb4ed
  1.8 s  gọi Bình (online, không bắt máy) · server mới
  1.9 s  An → Chi, server mới: state dang-goi → call:end khong-truc-tuyen → state roi
 46.6 s  An → Chi, server cũ: state dang-goi → call:ringing → call:end khong-tra-loi → state roi
 46.9 s  An → Bình không bắt máy: state dang-goi → call:ringing → call:end khong-tra-loi → state roi
 46.9 s     phía Bình: call:incoming from An → state do-chuong → call:end khong-tra-loi → state roi
$ # log server mới
[may] nghe :19810 · call.socket.ts của kho · TRE_DB=5 ms
[may  4059 ms] INFO gọi hụt — người nhận không online {"tu":1,"den":3}
[may  4422 ms] INFO cuộc gọi bắt đầu {"callId":"7d062b7e-7610-4909-b370-de2ebb998a31","tu":1,"den":2}
[may 49424 ms] INFO cuộc gọi kết thúc {"callId":"7d062b7e-7610-4909-b370-de2ebb998a31","lyDo":"khong-tra-loi","giay":0,"daNhan":false}
$ # log server cũ (trước 0852eb4ed)
[may] nghe :19812 · call.socket.ts của kho · TRE_DB=5 ms
[may  4043 ms] INFO cuộc gọi bắt đầu {"callId":"236ba99f-c9c9-409d-95e7-60bd0cd48084","tu":1,"den":3}
[may 49046 ms] INFO cuộc gọi kết thúc {"callId":"236ba99f-c9c9-409d-95e7-60bd0cd48084","lyDo":"khong-tra-loi","giay":0,"daNhan":false}</div>
<p><strong>The ghost call.</strong> Binh&#39;s talking tab crashes while tab 2 is open: the disconnect handler sees another socket and does nothing; the caller&#39;s ICE goes <code>disconnected</code> but never <code>failed</code>, and <code>cuocGoi.ts</code> only reacts to <code>failed</code>:</p>
<div class="out">$ node sap.mjs
  3.6 s  Bình tab 1 SẬP (Page.crash)
  3.6 s  An: dang-noi · Bình tab 2: do-chuong · ICE của An: connected
 10.2 s  An: dang-noi · Bình tab 2: do-chuong · ICE của An: disconnected
 64.1 s  sau 60 s — dừng đo
$ # log server
[may] nghe :19810 · call.socket.ts của kho · TRE_DB=5 ms
[may  4115 ms] INFO cuộc gọi bắt đầu {"callId":"90e944f6-24d8-47ce-b790-e1b41bdc3c06","tu":1,"den":2}
[may 66618 ms] INFO cuộc gọi kết thúc {"callId":"90e944f6-24d8-47ce-b790-e1b41bdc3c06","lyDo":"mat-ket-noi","giay":62,"daNhan":true}</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash"><span class="tok-comment"># server (call.socket.ts của kho) + nhiều TAB thật — mỗi tab một socket</span>
npx tsx may.ts &amp;
node haitab.mjs    <span class="tok-comment">  # Bình hai tab: ai reo · bắt máy tab 1 · đóng tab 2</span>
node ban.mjs       <span class="tok-comment">  # call:busy "ho" / "toi"</span>
<span class="tok-comment"># bản TRƯỚC bản vá 0852eb4ed, chạy song song ở cổng khác</span>
git -C ~/api-backend show 0852eb4ed^:src/socket/call.socket.ts &gt; cu/kho/src/socket/call.socket.ts
(cd cu &amp;&amp; CONG=19812 npx tsx may.ts &amp;)
node vang.mjs      <span class="tok-comment">  # gọi người offline: mới vs cũ · không ai nghe 45 s</span>
node sap.mjs       <span class="tok-comment">  # tab đang nói sập khi còn tab khác</span></code></pre>
<pre><code class="language-javascript"><span class="tok-comment">// haitab.mjs — Bình mở HAI tab. An gọi video. Ai đổ chuông? Bình bắt máy ở tab 1 — tab 2 thấy gì? Rồi Bình đóng tab 2.</span>
import { moTrinh, tab, ghi, trangThaiTat, nk, cho, ghepAnh } from './nhieu.mjs';
const { trinh, ctx } = await moTrinh();
const an = await tab(ctx, 1), b1 = await tab(ctx, 2), b2 = await tab(ctx, 2);
const ds = [['An', an], ['Bình tab 1', b1], ['Bình tab 2', b2]];
ghi('An bấm gọi video (hội thoại 1)'); await an.evaluate(() =&gt; window.goi.goi(1, 2, true)); await cho(800);
ghi(await trangThaiTat(ds));
ghi('Bình bắt máy ở TAB 1'); await b1.evaluate(() =&gt; window.goi.nhan());
await an.waitForFunction(() =&gt; window.trangThai === 'dang-noi'); await cho(5000);
ghi(await trangThaiTat(ds) + '   (5 s sau khi bắt máy)');
await ghepAnh([an, b1, b2], 'sio-7-3', 'sio-07-3', 'haitab');
ghi('Bình đóng TAB 2 (tab vẫn đang reo) — beforeunload của CuocGoiOverlay chạy'); await b2.close({ runBeforeUnload: true }); await cho(1200);
ghi(await trangThaiTat(ds));
ghi('nhật ký An: ' + (await nk(an)).join(' → '));
await trinh.close(); process.exit(0);</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-4-1-use-effect" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 4.1 — useEffect, dependencies and cleanup</span><span class="lc-sub">Where CuocGoiOverlay adds and removes beforeunload</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/socket-io/learn?lessonSlug=io-4-3-multi-tab" target="_blank" rel="noopener"><span class="lc-ico">⚡</span><span class="lc-body"><span class="lc-title">Socket.IO · 4.3 — Many tabs: one user, many sockets</span><span class="lc-sub">The same problem, met again in calls</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>user:</code> room</span><span class="v">Routes a call notification to every tab the recipient has open.</span></div>
  <div class="kv"><span class="k">Tab filtering</span><span class="v"><code>socket.rooms.has(&quot;thread:X&quot;)</code> narrows which tabs ring.</span></div>
  <div class="kv"><span class="k">ringing</span><span class="v">The call is being offered and not yet answered.</span></div>
  <div class="kv"><span class="k">busy</span><span class="v">The recipient is already in a call.</span></div>
  <div class="kv"><span class="k">answered / rejected</span><span class="v">The terminal states a ringing call resolves to.</span></div>
  <div class="kv"><span class="k">Ghost call</span><span class="v">A call left hanging because disconnect cleanup was missed.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Room <code>user:</code> routes call notifications to every tab the recipient has open.</li><li>This repo narrows with <code>socket.rooms.has(&quot;thread:X&quot;)</code> so it does not spam them all.</li><li>Three states — busy, ringing, answered/rejected — map onto 3-4 events.</li><li>Cleanup on disconnect matters, or calls turn into ghosts.</li><li>Signalling reuses the room model from Chapter 3.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Lesson 3.1 — Rooms</span><span class="lc-sub">/courses/socket-io/learn${REF} — pattern user:${'${uid}'} là căn bản.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>Room semantics: incoming, ringing, busy</h2>
<p class="lead">Một call event route đến MỘT NGƯỜI, không phải một socket. Bài này trace cách kho này dùng room để tìm ai notify, và tại sao pattern tinh tế hơn <code>io.to(user).emit</code>.</p>

<h3>Trường hợp cơ bản</h3>
<pre><code class="language-ts">socket.on('call:offer', async ({ toUserId, sdp }) =&gt; {
  const target = &#96;user:${'${toUserId}'}&#96;;
  const room = io.sockets.adapter.rooms.get(target);
  if (!room || room.size === 0) {
    return socket.emit('call:busy', { toUserId });
  }
  io.to(target).emit('call:incoming', { fromUserId: socket.data.userId, sdp });
});
</code></pre>

<p>Room <code>user:42</code> đưa <code>call:incoming</code> đến MỌI tab của user 42.</p>

<h3>Kho này thêm layer — thread-based filtering</h3>
<pre><code class="language-ts">// call.socket.ts:132
const inThread = socket.rooms.has(&#96;thread:${'${threadId}'}&#96;);
// Chi ai dang MO thread do moi nhan call notification tren tab do
</code></pre>

<p>Vì sao? Nếu user có 5 tab và chỉ 1 tab đang mở chat với người gọi, bạn không muốn call dialog pop trên MỌI tab. Chỉ tab của thread. Xoá &quot;phiền&quot; UX.</p>
<p><strong>Sửa theo đo thật (13/11/2026):</strong> phép kiểm đó không làm vậy. <code>trongHoiThoai()</code> chạy trên socket của <em>người gọi</em> — &quot;bạn có thuộc hội thoại này không?&quot;, tức kiểm quyền — và <code>messaging.socket.ts</code> cho mỗi socket vào <em>mọi</em> room thread lúc nối. <code>call:incoming</code> đi vào room <code>user:</code>, nên <strong>mọi tab đều reo</strong> (đo hai tab: cả hai <code>do-chuong</code>).</p>

<h3>Ba trạng thái call</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">busy</span><span class="lz-nsub">recipient offline hoàn toàn — <strong>kho này:</strong> offline ⇒ <code>call:end</code> &#39;khong-truc-tuyen&#39;; <code>call:busy</code> chỉ khi đang trong cuộc gọi khác</span></span>
<span class="lz-nbody">Room <code>user:B</code> size 0. Server emit <code>call:busy</code> cho caller. UI caller &quot;Not available&quot;.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">ringing</span><span class="lz-nsub">recipient online, đang chờ answer</span></span>
<span class="lz-nbody">Server emit <code>call:incoming</code> cho B, emit <code>call:ringing</code> cho A. UI A &quot;Ringing...&quot;.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">answered / rejected</span><span class="lz-nsub">B đã tương tác</span></span>
<span class="lz-nbody">B emit <code>call:answer</code> hoặc <code>call:reject</code>. Server relay cho A.</span>
</div>
</div>

<h3>Timeout ringing</h3>
<pre><code class="language-ts">// Client-side: neu ringing > 30s, tu cancel
useEffect(() =&gt; {
  if (callState === 'ringing') {
    const timer = setTimeout(() =&gt; {
      socket.emit('call:end', { toUserId });
      setCallState('missed');
    }, 30000);
    return () =&gt; clearTimeout(timer);
  }
}, [callState]);
</code></pre>
<p><em>Minh hoạ. Trong kho hẹn giờ đổ chuông nằm ở server: <code>HAN_DO_CHUONG_MS = 45_000</code> — đo 45,1 s, rồi cả hai phía nhận <code>call:end</code> &quot;khong-tra-loi&quot;.</em></p>

<h3>Cleanup khi caller disconnect</h3>
<pre><code class="language-ts">socket.on('disconnect', () =&gt; {
  const activeCalls = getActiveCallsForSocket(socket.id);
  for (const call of activeCalls) {
    io.to(&#96;user:${'${call.peerUserId}'}&#96;).emit('call:end', {
      reason: 'peer-disconnected',
    });
  }
});
</code></pre>

<div class="callout warn">
<p><strong>Không có handler này, call ghosts.</strong> Caller crash trình duyệt trong lúc gọi. Recipient vẫn thấy &quot;connecting&quot;. Không bao giờ được notify. UI stuck vô hạn.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — dùng socket ID để track call thay vì userId.</strong> Reconnect = sid mới = call bị mất. Track theo <code>callId</code> (UUID) + userId.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Room <code>user:${'${uid}'}</code> route call notifications đến mọi tab; kho này lọc thêm bằng <code>socket.rooms.has(&quot;thread:X&quot;)</code>; ba trạng thái (busy/ringing/answered-rejected) map thành 3-4 events; cleanup on disconnect quan trọng để call không ghost.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Route một call notification tới room <code>user:</code> và xác nhận mọi tab đang mở của người nhận đổ chuông.</li>
<li>Lọc bằng <code>socket.rooms.has(&quot;thread:X&quot;)</code> để không spam mọi tab, và so hành vi.</li>
<li>Mô hình hoá ba trạng thái (busy, ringing, answered/rejected) thành event, rồi disconnect giữa cuộc gọi và xác nhận cleanup ngăn một ghost call.</li>
</ol>
<p><strong>Đạt khi:</strong> các tab của người nhận đổ chuông đúng, trạng thái chuyển mượt, và một disconnect không để lại ghost call.</p></div>

<h3>🔬 Đo thật: ai reo, và mọi cách một cuộc gọi kết thúc</h3>
<p>socket.io 4.8.3 · <code>call.socket.ts</code> của kho (server) và <code>cuocGoi.ts</code> (client, nối dây như <code>CuocGoiOverlay.tsx</code>, kể cả <code>beforeunload</code>) · tab Chromium thật, mỗi tab một socket. Chỗ kho cho socket vào room và đưa cuộc gọi đi:</p>
<div class="out">$ cd ~/api-backend &amp;&amp; grep -n "socket.join(\\&#96;user:\\|socket.join(\\&#96;thread:\\\${t.id}\\|registerCallSignaling(io" src/socket/messaging.socket.ts
411:    socket.join(&#96;user:\${user.id}&#96;);
467:          socket.join(&#96;thread:\${t.id}&#96;);
585:    registerCallSignaling(io!, socket, user);
$ grep -n "socket.rooms.has\\|io.to(phong(p.toUserId)).emit('call:incoming'\\|HAN_DO_CHUONG_MS =\\|const conSocket\\|if (conSocket) return" src/socket/call.socket.ts
34:const HAN_DO_CHUONG_MS = 45_000;
132:    &amp;&amp; socket.rooms.has(&#96;thread:\${threadId}&#96;);
210:      io.to(phong(p.toUserId)).emit('call:incoming', {
270:    const conSocket = Array.from(io.sockets.sockets.values())
273:    if (conSocket) return;
$ grep -n "beforeunload\\|truocKhiDong = " frontend/src/components/messaging/CuocGoiOverlay.tsx
172:    const truocKhiDong = () =&gt; { if (trangThai !== 'roi') goi.cupMay(); };
173:    window.addEventListener('beforeunload', truocKhiDong);
174:    return () =&gt; window.removeEventListener('beforeunload', truocKhiDong);</div>
<p><strong>Hai tab.</strong> Bình bắt máy ở tab 1. Tab 2 không được báo nên cứ reo; đóng nó thì <code>beforeunload</code> ⇒ <code>cupMay()</code> ⇒ <code>call:end</code> cùng callId — và server cúp đúng cuộc Bình đang nói:</p>
<div class="out">$ node haitab.mjs
  1.4 s  An bấm gọi video (hội thoại 1)
  3.8 s  An: dang-goi · Bình tab 1: do-chuong · Bình tab 2: do-chuong
  3.8 s  Bình bắt máy ở TAB 1
  8.9 s  An: dang-noi · Bình tab 1: dang-noi · Bình tab 2: do-chuong   (5 s sau khi bắt máy)
  9.2 s  Bình đóng TAB 2 (tab vẫn đang reo) — beforeunload của CuocGoiOverlay chạy
 10.4 s  An: roi · Bình tab 1: roi · Bình tab 2: (đã đóng)
 10.4 s  nhật ký An: state dang-goi → call:ringing → call:answered → ontrack: peer media arrived → ontrack: peer media arrived → state dang-noi → call:end cup-may → state roi
$ # log server
[may] nghe :19810 · call.socket.ts của kho · TRE_DB=5 ms
[may  5588 ms] INFO cuộc gọi bắt đầu {"callId":"b575d693-c253-40c9-9d95-5abde04f2d8f","tu":1,"den":2}
[may 11734 ms] INFO cuộc gọi kết thúc {"callId":"b575d693-c253-40c9-9d95-5abde04f2d8f","lyDo":"cup-may","giay":5,"daNhan":true}</div>
<p><strong>Bận, không online, không ai nghe</strong> — ca không online chạy song song với server dựng từ mã <em>trước</em> bản vá 0852eb4ed:</p>
<div class="out">$ node ban.mjs
  2.1 s  An đang nói với Bình. Chi gọi An (hội thoại 2):
  2.8 s    Chi nhận: call:busy ho → state roi
  2.8 s  An mở tab thứ hai, bấm gọi Chi (hội thoại 2):
  3.5 s    tab 2 của An nhận: call:busy toi → state roi</div>
<div class="out">$ npx tsx may.ts &amp;   (cd cu &amp;&amp; CONG=19812 npx tsx may.ts &amp;)   node vang.mjs
  0.8 s  gọi Chi (offline) · server mới
  1.5 s  gọi Chi (offline) · server TRƯỚC bản vá 0852eb4ed
  1.8 s  gọi Bình (online, không bắt máy) · server mới
  1.9 s  An → Chi, server mới: state dang-goi → call:end khong-truc-tuyen → state roi
 46.6 s  An → Chi, server cũ: state dang-goi → call:ringing → call:end khong-tra-loi → state roi
 46.9 s  An → Bình không bắt máy: state dang-goi → call:ringing → call:end khong-tra-loi → state roi
 46.9 s     phía Bình: call:incoming from An → state do-chuong → call:end khong-tra-loi → state roi
$ # log server mới
[may] nghe :19810 · call.socket.ts của kho · TRE_DB=5 ms
[may  4059 ms] INFO gọi hụt — người nhận không online {"tu":1,"den":3}
[may  4422 ms] INFO cuộc gọi bắt đầu {"callId":"7d062b7e-7610-4909-b370-de2ebb998a31","tu":1,"den":2}
[may 49424 ms] INFO cuộc gọi kết thúc {"callId":"7d062b7e-7610-4909-b370-de2ebb998a31","lyDo":"khong-tra-loi","giay":0,"daNhan":false}
$ # log server cũ (trước 0852eb4ed)
[may] nghe :19812 · call.socket.ts của kho · TRE_DB=5 ms
[may  4043 ms] INFO cuộc gọi bắt đầu {"callId":"236ba99f-c9c9-409d-95e7-60bd0cd48084","tu":1,"den":3}
[may 49046 ms] INFO cuộc gọi kết thúc {"callId":"236ba99f-c9c9-409d-95e7-60bd0cd48084","lyDo":"khong-tra-loi","giay":0,"daNhan":false}</div>
<p><strong>Cuộc gọi ma.</strong> Tab đang nói của Bình sập khi còn tab 2: handler disconnect thấy còn socket nên không làm gì; ICE của người gọi về <code>disconnected</code> nhưng không bao giờ <code>failed</code>, mà <code>cuocGoi.ts</code> chỉ xử lý <code>failed</code>:</p>
<div class="out">$ node sap.mjs
  3.6 s  Bình tab 1 SẬP (Page.crash)
  3.6 s  An: dang-noi · Bình tab 2: do-chuong · ICE của An: connected
 10.2 s  An: dang-noi · Bình tab 2: do-chuong · ICE của An: disconnected
 64.1 s  sau 60 s — dừng đo
$ # log server
[may] nghe :19810 · call.socket.ts của kho · TRE_DB=5 ms
[may  4115 ms] INFO cuộc gọi bắt đầu {"callId":"90e944f6-24d8-47ce-b790-e1b41bdc3c06","tu":1,"den":2}
[may 66618 ms] INFO cuộc gọi kết thúc {"callId":"90e944f6-24d8-47ce-b790-e1b41bdc3c06","lyDo":"mat-ket-noi","giay":62,"daNhan":true}</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash"><span class="tok-comment"># server (call.socket.ts của kho) + nhiều TAB thật — mỗi tab một socket</span>
npx tsx may.ts &amp;
node haitab.mjs    <span class="tok-comment">  # Bình hai tab: ai reo · bắt máy tab 1 · đóng tab 2</span>
node ban.mjs       <span class="tok-comment">  # call:busy "ho" / "toi"</span>
<span class="tok-comment"># bản TRƯỚC bản vá 0852eb4ed, chạy song song ở cổng khác</span>
git -C ~/api-backend show 0852eb4ed^:src/socket/call.socket.ts &gt; cu/kho/src/socket/call.socket.ts
(cd cu &amp;&amp; CONG=19812 npx tsx may.ts &amp;)
node vang.mjs      <span class="tok-comment">  # gọi người offline: mới vs cũ · không ai nghe 45 s</span>
node sap.mjs       <span class="tok-comment">  # tab đang nói sập khi còn tab khác</span></code></pre>
<pre><code class="language-javascript"><span class="tok-comment">// haitab.mjs — Bình mở HAI tab. An gọi video. Ai đổ chuông? Bình bắt máy ở tab 1 — tab 2 thấy gì? Rồi Bình đóng tab 2.</span>
import { moTrinh, tab, ghi, trangThaiTat, nk, cho, ghepAnh } from './nhieu.mjs';
const { trinh, ctx } = await moTrinh();
const an = await tab(ctx, 1), b1 = await tab(ctx, 2), b2 = await tab(ctx, 2);
const ds = [['An', an], ['Bình tab 1', b1], ['Bình tab 2', b2]];
ghi('An bấm gọi video (hội thoại 1)'); await an.evaluate(() =&gt; window.goi.goi(1, 2, true)); await cho(800);
ghi(await trangThaiTat(ds));
ghi('Bình bắt máy ở TAB 1'); await b1.evaluate(() =&gt; window.goi.nhan());
await an.waitForFunction(() =&gt; window.trangThai === 'dang-noi'); await cho(5000);
ghi(await trangThaiTat(ds) + '   (5 s sau khi bắt máy)');
await ghepAnh([an, b1, b2], 'sio-7-3', 'sio-07-3', 'haitab');
ghi('Bình đóng TAB 2 (tab vẫn đang reo) — beforeunload của CuocGoiOverlay chạy'); await b2.close({ runBeforeUnload: true }); await cho(1200);
ghi(await trangThaiTat(ds));
ghi('nhật ký An: ' + (await nk(an)).join(' → '));
await trinh.close(); process.exit(0);</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-4-1-use-effect" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 4.1 — useEffect, dependency và cleanup</span><span class="lc-sub">Chỗ CuocGoiOverlay gắn và gỡ beforeunload</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/socket-io/learn?lessonSlug=io-4-3-multi-tab" target="_blank" rel="noopener"><span class="lc-ico">⚡</span><span class="lc-body"><span class="lc-title">Socket.IO · 4.3 — Nhiều tab: một user, nhiều socket</span><span class="lc-sub">Cùng bài toán, gặp lại ở cuộc gọi</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Room <code>user:</code></span><span class="v">Route một call notification tới mọi tab người nhận đang mở.</span></div>
  <div class="kv"><span class="k">Lọc tab</span><span class="v"><code>socket.rooms.has(&quot;thread:X&quot;)</code> thu hẹp tab nào đổ chuông.</span></div>
  <div class="kv"><span class="k">ringing</span><span class="v">Cuộc gọi đang được mời và chưa trả lời.</span></div>
  <div class="kv"><span class="k">busy</span><span class="v">Người nhận đang ở trong một cuộc gọi.</span></div>
  <div class="kv"><span class="k">answered / rejected</span><span class="v">Các trạng thái cuối mà một cuộc gọi ringing chuyển về.</span></div>
  <div class="kv"><span class="k">Ghost call</span><span class="v">Một cuộc gọi treo vì lỡ cleanup lúc disconnect.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Room <code>user:</code> route call notification tới mọi tab người nhận đang mở.</li><li>Kho này thu hẹp bằng <code>socket.rooms.has(&quot;thread:X&quot;)</code> để không spam tất cả.</li><li>Ba trạng thái — busy, ringing, answered/rejected — map thành 3-4 event.</li><li>Cleanup lúc disconnect quan trọng, kẻo call thành ghost.</li><li>Signalling dùng lại mô hình room của Chương 3.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Bài 3.1 — Rooms</span><span class="lc-sub">/courses/socket-io/learn — pattern user:${'${uid}'} là căn bản.</span></span></div>
</div>
`,
    },

    {
      title: '7.4 — TURN and NAT: when peer-to-peer fails|||7.4 — TURN và NAT: khi peer-to-peer thất bại',
      slug: 'io-7-4-turn',
      type: 'VIDEO',
      description: 'Symmetric NAT (một số corp/mobile network) chặn P2P. Cần TURN server relay media — đó là service riêng, không phải socket.io. Cost đáng kể vì server phải handle media bytes.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.4</span>
<h2>TURN and NAT: when peer-to-peer fails</h2>
<p class="lead">7.1 said &quot;media goes P2P&quot;. That&#39;s the 85% case. 15% of the time NAT prevents it, and you need a TURN server to relay. This lesson explains when and what it costs.</p>

<h3>NAT — four types</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Full-cone NAT</span><span class="lz-d">Public IP:port maps consistently. STUN discovery works. P2P easy. Home routers typical.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Restricted NAT</span><span class="lz-d">Public port maps for known destinations. P2P works if both peers punch through simultaneously. Most consumer routers.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Port-restricted NAT</span><span class="lz-d">Stricter — checks source port too. P2P works with more retries.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Symmetric NAT</span><span class="lz-d">Public IP:port DIFFERENT for each destination. STUN can&#39;t predict — P2P impossible. Common in corporate + some mobile carriers.</span></div>
</div>

<div class="out">Uoc luong global:
  Full-cone + Restricted: 70-80% users
  Port-restricted:        10-15% users
  Symmetric:              5-15% users (cao hon o corporate + mobile)
</div>

<h3>TURN — Traversal Using Relays around NAT</h3>
<pre><code class="language-text">Khi P2P fail, TURN relay:

Peer A -&gt; TURN server -&gt; Peer B
                        &lt;-
                       (media qua server)

Cost: TURN server nhan + resend TOAN BO media bytes.
1 call = ~2 Mbps qua TURN server.
1.000 calls = 2 Gbps.
</code></pre>

<h3>The real cost of a TURN service</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">self-hosted (coturn)</span><span class="lz-nsub">a few hours of setup</span></span>
<span class="lz-nbody">Configure coturn on a VPS and open port 3478 UDP plus 5349 TLS. The cost is server bandwidth. On a Vietnamese VPS: ~$5/Mbps/month. 1 Gbps is $5,000/month for TURN alone.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">managed TURN (Xirsys, Twilio)</span><span class="lz-nsub">$0.4-1.5/GB traffic</span></span>
<span class="lz-nbody">No setup, billed by the GB. 10,000 call-minutes a month × 30 MB/min = 300 GB = $120-450/month. Cheap at small scale, expensive at large.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">no TURN at all</span><span class="lz-nsub">accepting that 15% of calls fail</span></span>
<span class="lz-nbody">For a personal or experimental app you may not need it. 15% of calls between symmetric-NAT peers will simply fail to connect, and users will report it as a bug.</span>
</div>
</div>

<h3>WebRTC config with TURN</h3>
<pre><code class="language-tsx">const pc = new RTCPeerConnection({
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },       // STUN free
    {
      urls: 'turn:turn.example.com:3478',
      username: 'call-42',                            // credential 1-time
      credential: 'xyz...',
    },
  ],
  iceTransportPolicy: 'all',   // hoac 'relay' de FORCE TURN (test)
});
</code></pre>

<h3>Credential rotation cho TURN</h3>
<pre><code class="language-ts">// Server: sinh credential ngan han truoc moi call
socket.on('call:request-ice-servers', async (ack) =&gt; {
  const username = &#96;\${socket.data.userId}-\${Date.now()}&#96;;
  const credential = hmac(TURN_SECRET, username);   // TIME-limited
  ack({ iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'turn:turn.example.com:3478', username, credential },
  ]});
});
</code></pre>

<div class="callout ok">
<p><strong>Never share a static TURN credential.</strong> Generate short-lived ones (10 minutes) per user. If one leaks, it is useless soon after. coturn supports HMAC-based auth.</p>
</div>

<div class="pitfall">
<p><strong>Trap — using a free public TURN server in production.</strong> There are plenty of &quot;free TURN&quot; servers online, but they are slow, unreliable, and can steal your media. Use them only in dev. Production needs its own TURN.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> 15% of users behind symmetric NAT cannot connect peer-to-peer and need a TURN server to relay their media — TURN costs real money (bandwidth × 2 Mbps per call), a managed service (Xirsys/Twilio) is cheap at small scale and expensive at large, self-hosted coturn is cheap but needs setup and monitoring; rotating TURN credentials matters so the service is not abused.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Force a connection through a symmetric NAT (or simulate one) and watch the peer-to-peer attempt fail, then succeed once a TURN relay is configured.</li>
<li>Estimate the TURN bandwidth cost for one call (~2 Mbps × 2 directions × duration) and compare a managed service versus self-hosted coturn.</li>
<li>Issue short-lived, rotating TURN credentials and reason about the abuse that static credentials invite.</li>
</ol>
<p><strong>Done when:</strong> you can explain why ~15% of users need TURN and name the cost and credential-rotation trade-offs.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">NAT</span><span class="v">Network address translation between a device and the public internet.</span></div>
  <div class="kv"><span class="k">Symmetric NAT</span><span class="v">The hard case (~15% of users) where peer-to-peer cannot connect.</span></div>
  <div class="kv"><span class="k">TURN</span><span class="v">A relay server that carries the media when peer-to-peer fails.</span></div>
  <div class="kv"><span class="k">coturn</span><span class="v">The common self-hosted TURN server — cheap but needs ops.</span></div>
  <div class="kv"><span class="k">Managed TURN</span><span class="v">Xirsys/Twilio — cheap at small scale, expensive at large.</span></div>
  <div class="kv"><span class="k">Credential rotation</span><span class="v">Short-lived TURN credentials so the relay is not abused.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>About 15% of users sit behind symmetric NAT and cannot connect peer-to-peer.</li><li>They need a TURN server to relay their media.</li><li>TURN costs real money — roughly 2 Mbps of bandwidth per call.</li><li>Managed TURN is cheap small, expensive large; self-hosted coturn is cheap but needs setup and monitoring.</li><li>Rotate TURN credentials so the service is not abused.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">coturn — self-hosted TURN</span><span class="lc-sub">github.com/coturn/coturn — open source, cấu hình phổ biến.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 5766 — TURN</span><span class="lc-sub">datatracker.ietf.org/doc/html/rfc5766 — spec chính thức.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.4</span>
<h2>TURN và NAT: khi peer-to-peer thất bại</h2>
<p class="lead">7.1 nói &quot;media qua P2P&quot;. Đó là trường hợp 85%. 15% thời gian NAT chặn nó, và bạn cần TURN server relay. Bài này giải thích khi nào và cost bao nhiêu.</p>

<h3>NAT — bốn loại</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Full-cone NAT</span><span class="lz-d">Public IP:port maps consistent. STUN discovery works. P2P dễ. Home router phổ biến.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Restricted NAT</span><span class="lz-d">Public port maps cho destination biết. P2P works nếu cả hai peer đục xuyên đồng thời.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Port-restricted NAT</span><span class="lz-d">Chặt hơn — kiểm source port. P2P works với nhiều retry.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Symmetric NAT</span><span class="lz-d">Public IP:port KHÁC cho mỗi destination. STUN không predict — P2P impossible. Phổ biến ở corporate + một số mobile carrier.</span></div>
</div>

<div class="out">Uoc luong global:
  Full-cone + Restricted: 70-80% users
  Port-restricted:        10-15% users
  Symmetric:              5-15% users (cao hon o corporate + mobile)
</div>

<h3>TURN — Traversal Using Relays around NAT</h3>
<pre><code class="language-text">Khi P2P fail, TURN relay:

Peer A -&gt; TURN server -&gt; Peer B
                        &lt;-
                       (media qua server)

Cost: TURN server nhan + resend TOAN BO media bytes.
1 call = ~2 Mbps qua TURN server.
1.000 calls = 2 Gbps.
</code></pre>

<h3>Cost thật của TURN service</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">tự host (coturn)</span><span class="lz-nsub">setup vài giờ</span></span>
<span class="lz-nbody">Cấu hình coturn trên VPS, mở port 3478 UDP + 5349 TLS. Cost: bandwidth. VN VPS: ~$5/Mbps/tháng. 1 Gbps = $5.000/tháng chỉ cho TURN.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">managed TURN (Xirsys, Twilio)</span><span class="lz-nsub">$0.4-1.5/GB traffic</span></span>
<span class="lz-nbody">Không setup, tính theo GB. 10.000 phút call/tháng × 30 MB/min = 300 GB = $120-450/tháng.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">không có TURN</span><span class="lz-nsub">chấp nhận 15% call fail</span></span>
<span class="lz-nbody">Cho app cá nhân / thử nghiệm, có thể không cần. 15% call giữa symmetric NAT peers sẽ không kết nối được.</span>
</div>
</div>

<h3>WebRTC config với TURN</h3>
<pre><code class="language-tsx">const pc = new RTCPeerConnection({
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    {
      urls: 'turn:turn.example.com:3478',
      username: 'call-42',
      credential: 'xyz...',
    },
  ],
  iceTransportPolicy: 'all',
});
</code></pre>

<h3>Credential rotation cho TURN</h3>
<pre><code class="language-ts">// Server: sinh credential ngan han truoc moi call
socket.on('call:request-ice-servers', async (ack) =&gt; {
  const username = &#96;${'${socket.data.userId}'}-${'${Date.now()}'}&#96;;
  const credential = hmac(TURN_SECRET, username);
  ack({ iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'turn:turn.example.com:3478', username, credential },
  ]});
});
</code></pre>

<div class="callout ok">
<p><strong>Không share TURN credential static.</strong> Sinh short-lived (10 phút) per user. Nếu leak, không dùng được lâu. coturn hỗ trợ HMAC-based auth.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — dùng free public TURN cho production.</strong> Có nhiều &quot;free TURN&quot; online nhưng chúng slow, unreliable, có thể ăn cắp media. Chỉ dùng cho dev. Production phải có TURN riêng.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> 15% users sau symmetric NAT không kết nối P2P và cần TURN server relay media — cost đáng kể (bandwidth × 2 Mbps per call), managed rẻ ở small scale nhưng đắt ở large, self-host coturn rẻ nhưng phải setup + monitor; credential rotation TURN quan trọng.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Ép một kết nối qua symmetric NAT (hoặc mô phỏng một cái) và xem cú peer-to-peer hỏng, rồi thành công khi đã cấu hình một TURN relay.</li>
<li>Ước lượng chi phí bandwidth TURN cho một cuộc gọi (~2 Mbps × 2 chiều × thời lượng) và so một managed service với self-host coturn.</li>
<li>Cấp TURN credential ngắn hạn, xoay vòng và lập luận về việc lạm dụng mà credential tĩnh mời gọi.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn giải thích được vì sao ~15% user cần TURN và nêu các đánh đổi về chi phí và xoay credential.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">NAT</span><span class="v">Dịch địa chỉ mạng giữa một thiết bị và internet công cộng.</span></div>
  <div class="kv"><span class="k">Symmetric NAT</span><span class="v">Ca khó (~15% user) nơi peer-to-peer không kết nối được.</span></div>
  <div class="kv"><span class="k">TURN</span><span class="v">Một server relay chở media khi peer-to-peer hỏng.</span></div>
  <div class="kv"><span class="k">coturn</span><span class="v">TURN server self-host phổ biến — rẻ nhưng cần ops.</span></div>
  <div class="kv"><span class="k">Managed TURN</span><span class="v">Xirsys/Twilio — rẻ ở small scale, đắt ở large.</span></div>
  <div class="kv"><span class="k">Xoay credential</span><span class="v">TURN credential ngắn hạn để relay không bị lạm dụng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Khoảng 15% user ngồi sau symmetric NAT và không kết nối peer-to-peer được.</li><li>Họ cần một TURN server để relay media.</li><li>TURN tốn tiền thật — khoảng 2 Mbps bandwidth mỗi cuộc gọi.</li><li>Managed TURN rẻ ở small, đắt ở large; self-host coturn rẻ nhưng cần setup và monitor.</li><li>Xoay TURN credential để dịch vụ không bị lạm dụng.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">coturn — self-hosted TURN</span><span class="lc-sub">github.com/coturn/coturn — open source, cấu hình phổ biến.</span></span></div>
</div>
`,
    },

    {
      title: '7.5 — Group calls: SFU is a different beast|||7.5 — Group call: SFU là con thú khác',
      slug: 'io-7-5-sfu',
      type: 'VIDEO',
      description: 'P2P mesh với N=4 là 12 connection và 8 Mbps upload per peer. Group calls cần SFU (Selective Forwarding Unit) — server nhận N stream, forward N-1 lần. Không phải socket.io.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.5</span>
<h2>Group calls: SFU is a different beast</h2>
<p class="lead">1-on-1 calls are simple P2P. Group calls (3+ peers) explode in complexity. This lesson shows the math and names the three architectures.</p>

<h3>Three architectures</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Mesh (P2P full)</span><span class="lz-nsub">N=2 OK, N=4 lag</span></span>
<span class="lz-nbody">Every peer connects directly to every other peer. N peers means N*(N-1) connections. The upload cost is (N-1) × stream bitrate PER PEER. At N=4, each peer uploads 3 streams = ~6-9 Mbps. Consumer internet cannot take it.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">SFU (Selective Forwarding Unit)</span><span class="lz-nsub">the standard for small groups</span></span>
<span class="lz-nbody">Each peer uploads 1 stream to the SFU. The server FORWARDS that stream to the other N-1 peers. It never encodes or decodes — it only routes. Server cost: N × stream × 2 (in + out). 10 groups × 10 peers × 1 Mbps = 200 Mbps.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">MCU (Multipoint Conferencing Unit)</span><span class="lz-nsub">large groups, high server cost</span></span>
<span class="lz-nbody">The server decodes every stream, mixes them into ONE composite, re-encodes, and sends a single stream to each peer. High CPU cost, low client bandwidth. Uncommon, because an SFU plus client-side layout is good enough.</span>
</div>
</div>

<h3>The mesh arithmetic</h3>
<pre><code class="language-text">N peers, moi peer video 1 Mbps

Mesh:
  connections: N*(N-1) = O(N^2)
  upload/peer: (N-1) Mbps
  N=2: 2 connections, 1 Mbps upload
  N=4: 12 connections, 3 Mbps upload (LAG bat dau)
  N=8: 56 connections, 7 Mbps upload (KHONG chay noi tren consumer internet)

SFU:
  connections/peer: 1 (up) + 1 (down aggregated)
  upload/peer: 1 Mbps
  server bandwidth: N * (in) + N * (N-1) * (out) = O(N^2) at server
  N=8: server = 8 in + 56 out = 64 Mbps

SFU shifts N^2 cost TU peer sang server.
</code></pre>

<h3>Common SFU implementations</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">mediasoup (open source, Node.js)</span><span class="lz-lnote">Very capable, with a TypeScript API. Decent docs. This repo COULD use it for group calls — it does not yet. mediasoup.org</span></div>
<div class="lz-layer"><span class="lz-lname">Janus Gateway (open source, C)</span><span class="lz-lnote">Versatile and plugin-based. Stable for a decade. janus.conf.meetecho.com</span></div>
<div class="lz-layer"><span class="lz-lname">LiveKit (open source, Go, managed available)</span><span class="lz-lnote">Modern, cloud-native, with a complete SDK. Very popular today. livekit.io</span></div>
<div class="lz-layer"><span class="lz-lname">Managed (Daily.co, Twilio Video, Zoom SDK)</span><span class="lz-lnote">No infrastructure to run. $0.001-0.01 per minute per user. Fast to set up, expensive at scale</span></div>
</div>

<h3>Socket.io is still used for SIGNALLING</h3>
<pre><code class="language-ts">// Socket.io signalling giua peers va SFU vẫn giong 1-on-1
socket.on('room:join', async ({ roomId }) =&gt; {
  const publishTransport = await sfu.createWebRtcTransport();
  socket.emit('room:transport-params', publishTransport.params);
  // ... more setup: subscribe existing producers, notify others of new peer
});
</code></pre>

<p>Socket.io is the control plane (joining rooms, publish/subscribe transports). The SFU is the data plane (media). Two separate components.</p>

<div class="pitfall">
<p><strong>Trap — attempting to build an SFU from scratch.</strong> A WebRTC SFU requires understanding RTP, RTCP, DTLS-SRTP and codec-specific packet handling. Tens of thousands of lines of C++. Use mediasoup, Janus or LiveKit. Do not rewrite it.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> A peer-to-peer mesh only scales to N=2-3 (upload cost is O(N)); group calls need an SFU (the server routes media, server cost O(N²), peer cost O(1)) — this repo has no group calls yet, but adding them would mean choosing mediasoup, LiveKit or a managed service; socket.io remains the signalling channel between peer and SFU, unchanged.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Compute the upload cost of a peer-to-peer mesh as N grows (O(N) per peer) and see why it breaks past N=2-3.</li>
<li>Sketch an SFU topology where the server routes media: server cost O(N²), per-peer cost O(1).</li>
<li>Confirm that in either case socket.io stays the signalling channel — only the media path changes.</li>
</ol>
<p><strong>Done when:</strong> you can explain why group calls need an SFU and what role socket.io keeps.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Mesh</span><span class="v">Every peer sends to every other — upload cost O(N), scales only to 2-3.</span></div>
  <div class="kv"><span class="k">SFU</span><span class="v">Selective Forwarding Unit — the server routes media for group calls.</span></div>
  <div class="kv"><span class="k">Server cost O(N²)</span><span class="v">The SFU forwards every stream to every peer.</span></div>
  <div class="kv"><span class="k">Peer cost O(1)</span><span class="v">Each peer uploads once to the SFU, regardless of group size.</span></div>
  <div class="kv"><span class="k">mediasoup / LiveKit</span><span class="v">SFU options (self-hosted or managed) if group calls are added.</span></div>
  <div class="kv"><span class="k">Signalling unchanged</span><span class="v">socket.io stays the signalling channel between peer and SFU.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A peer-to-peer mesh only scales to N=2-3 because upload cost is O(N).</li><li>Group calls need an SFU: the server routes media, server cost O(N²), peer cost O(1).</li><li>This repo has no group calls yet.</li><li>Adding them means choosing mediasoup, LiveKit or a managed service.</li><li>socket.io remains the signalling channel between peer and SFU, unchanged.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">mediasoup — SFU</span><span class="lc-sub">mediasoup.org — Node.js SFU, best for building on top.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">LiveKit — modern OSS SFU</span><span class="lc-sub">livekit.io — deploy Go SFU + JavaScript/mobile SDK.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.5</span>
<h2>Group call: SFU là con thú khác</h2>
<p class="lead">1-on-1 call là P2P đơn giản. Group call (3+ peers) explode về complexity. Bài này chỉ ra math và đặt tên ba architecture.</p>

<h3>Ba architecture</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Mesh (P2P full)</span><span class="lz-nsub">N=2 OK, N=4 lag</span></span>
<span class="lz-nbody">Mỗi peer connect trực tiếp với mọi peer khác. N peers = N*(N-1) connections. Upload cost: (N-1) × stream bitrate PER peer. Với N=4, mỗi peer upload 3 stream = ~6-9 Mbps. Consumer internet không chịu nổi.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">SFU</span><span class="lz-nsub">chuẩn cho small groups</span></span>
<span class="lz-nbody">Mỗi peer upload 1 stream lên server SFU. Server FORWARD stream đó đến N-1 peers khác. Server không encode/decode — chỉ route. Cost server: N × stream × 2 (in + out).</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">MCU</span><span class="lz-nsub">large groups, high server cost</span></span>
<span class="lz-nbody">Server decode mọi stream, mix thành MỘT stream composite, encode lại, gửi 1 stream cho mỗi peer. Cost CPU cao — bandwidth thấp phía client. Không phổ biến vì SFU + client-side layout đủ.</span>
</div>
</div>

<h3>Math của mesh</h3>
<pre><code class="language-text">N peers, moi peer video 1 Mbps

Mesh:
  connections: N*(N-1) = O(N^2)
  upload/peer: (N-1) Mbps
  N=2: 2 connections, 1 Mbps upload
  N=4: 12 connections, 3 Mbps upload (LAG bat dau)
  N=8: 56 connections, 7 Mbps upload (KHONG chay noi)

SFU:
  connections/peer: 1 (up) + 1 (down aggregated)
  upload/peer: 1 Mbps
  server bandwidth: N * (in) + N * (N-1) * (out) = O(N^2) at server
  N=8: server = 8 in + 56 out = 64 Mbps

SFU shifts N^2 cost TU peer sang server.
</code></pre>

<h3>SFU implementations phổ biến</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">mediasoup (open source, Node.js)</span><span class="lz-lnote">Rất mạnh, TypeScript API. Docs OK. mediasoup.org</span></div>
<div class="lz-layer"><span class="lz-lname">Janus Gateway (open source, C)</span><span class="lz-lnote">Đa năng, plugin-based. Ổn định 10 năm. janus.conf.meetecho.com</span></div>
<div class="lz-layer"><span class="lz-lname">LiveKit (open source, Go, managed available)</span><span class="lz-lnote">Modern, cloud-native, SDK đầy đủ. Rất phổ biến hiện nay. livekit.io</span></div>
<div class="lz-layer"><span class="lz-lname">Managed (Daily.co, Twilio Video, Zoom SDK)</span><span class="lz-lnote">Không dựng infra. $0.001-0.01 per minute per user.</span></div>
</div>

<h3>Socket.io vẫn dùng cho SIGNALLING</h3>
<pre><code class="language-ts">// Socket.io signalling giua peers va SFU van giong 1-on-1
socket.on('room:join', async ({ roomId }) =&gt; {
  const publishTransport = await sfu.createWebRtcTransport();
  socket.emit('room:transport-params', publishTransport.params);
  // ... more setup: subscribe existing producers, notify others of new peer
});
</code></pre>

<p>Socket.io là control plane. SFU là data plane. Hai component riêng.</p>

<div class="pitfall">
<p><strong>Bẫy — thử build SFU từ đầu.</strong> WebRTC SFU cần hiểu RTP, RTCP, DTLS-SRTP, codec-specific packet handling. Vài chục nghìn dòng C++. Dùng mediasoup, Janus, LiveKit. Đừng viết lại.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Mesh N-peer P2P chỉ scale tới N=2-3; group calls cần SFU (server route media, cost server O(N²), peer O(1)) — kho này chưa có group call nhưng nếu thêm phải chọn mediasoup/LiveKit/managed service; socket.io vẫn dùng cho signalling giữa peer và SFU.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Tính chi phí upload của một mesh peer-to-peer khi N tăng (O(N) mỗi peer) và thấy vì sao nó vỡ sau N=2-3.</li>
<li>Phác một topology SFU nơi server route media: cost server O(N²), cost mỗi peer O(1).</li>
<li>Xác nhận rằng trong cả hai ca socket.io vẫn là kênh signalling — chỉ đường media đổi.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn giải thích được vì sao group call cần một SFU và socket.io giữ vai trò gì.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Mesh</span><span class="v">Mỗi peer gửi tới mọi peer khác — cost upload O(N), chỉ scale tới 2-3.</span></div>
  <div class="kv"><span class="k">SFU</span><span class="v">Selective Forwarding Unit — server route media cho group call.</span></div>
  <div class="kv"><span class="k">Cost server O(N²)</span><span class="v">SFU chuyển mỗi stream tới mọi peer.</span></div>
  <div class="kv"><span class="k">Cost peer O(1)</span><span class="v">Mỗi peer upload một lần tới SFU, bất kể nhóm lớn cỡ nào.</span></div>
  <div class="kv"><span class="k">mediasoup / LiveKit</span><span class="v">Lựa chọn SFU (self-host hoặc managed) nếu thêm group call.</span></div>
  <div class="kv"><span class="k">Signalling không đổi</span><span class="v">socket.io vẫn là kênh signalling giữa peer và SFU.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Một mesh peer-to-peer chỉ scale tới N=2-3 vì cost upload là O(N).</li><li>Group call cần một SFU: server route media, cost server O(N²), cost peer O(1).</li><li>Kho này chưa có group call.</li><li>Thêm chúng nghĩa là chọn mediasoup, LiveKit hoặc một managed service.</li><li>socket.io vẫn là kênh signalling giữa peer và SFU, không đổi.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">mediasoup — SFU</span><span class="lc-sub">mediasoup.org — Node.js SFU, best for building on top.</span></span></div>
</div>
`,
    },

    {
      title: '7.6 — Chapter 7 quiz|||7.6 — Kiểm tra Chương 7',
      slug: 'io-7-6-quiz',
      type: 'QUIZ',
      description: 'Sáu câu, mười phút. Về signalling vs media, SDP/ICE, room semantics, TURN, SFU.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Quiz</span>
<h2>What Chapter 7 established</h2>
<p class="lead">Six questions on WebRTC signalling — the part Socket.IO does, and the much larger part it does not.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Socket.IO relays, it does not carry media</span><span class="lz-d">Signalling exchanges SDP offers and ICE candidates so two peers can find each other. Once they connect, audio and video flow directly between them and never touch your server.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">SDP and ICE are just payloads to you</span><span class="lz-d">You forward opaque blobs. Understanding roughly what is inside them — codecs and network candidates — is what lets you debug "the call connects but there is no video".</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Peer-to-peer fails often enough to need TURN</span><span class="lz-d">Symmetric NAT and restrictive firewalls block direct connections for a meaningful share of users, and a TURN relay is the fallback you pay bandwidth for. Group calls are a different architecture again: an SFU, which is a real media server.</span></div>
</div>
<p>6 questions, 10 minutes. Answer from the mechanism, not from memory — every option is plausible if you are guessing.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Kiểm tra</span>
<h2>Chương 7 đã dựng được gì</h2>
<p class="lead">Sáu câu về signalling WebRTC — phần Socket.IO làm, và phần lớn hơn nhiều mà nó không làm.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Socket.IO chuyển tiếp, nó không mang media</span><span class="lz-d">Signalling trao đổi SDP offer và ICE candidate để hai peer tìm được nhau. Khi chúng đã kết nối, âm thanh và hình ảnh chảy thẳng giữa hai bên và không bao giờ chạm tới server của bạn.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">SDP và ICE với bạn chỉ là tải trọng</span><span class="lz-d">Bạn chuyển tiếp những khối dữ liệu mờ. Hiểu đại khái bên trong chúng có gì — codec và các ứng viên mạng — mới là thứ giúp bạn gỡ lỗi "cuộc gọi kết nối được nhưng không có hình".</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Ngang hàng thất bại đủ thường xuyên để cần TURN</span><span class="lz-d">NAT đối xứng và tường lửa ngặt chặn kết nối trực tiếp với một tỷ lệ người dùng đáng kể, và một TURN relay là đường lùi mà bạn trả tiền băng thông cho nó. Gọi nhóm lại là một kiến trúc khác nữa: một SFU, tức là một media server thật.</span></div>
</div>
<p>6 câu, 10 phút. Hãy trả lời từ cơ chế, đừng trả lời từ trí nhớ — mọi phương án đều hợp lý nếu bạn đang đoán.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 600,
        questions: [
          {
            question: 'In a 1-on-1 video call, how does the media (video/audio) travel?|||Trong call 1-on-1, media (video/audio) đi thế nào?',
            options: [
              'Peer-to-peer over WebRTC (RTP/UDP direct between browsers); socket.io only relays ~5-20 signalling packets (SDP + ICE) to help peers find each other|||Peer-to-peer qua WebRTC (RTP/UDP trực tiếp giữa browsers); socket.io chỉ relay ~5-20 signalling packet (SDP + ICE) để giúp peer tìm nhau',
              'Through the socket.io server as binary emit|||Qua server socket.io dạng binary emit',
              'Through a media broker like Kafka|||Qua media broker như Kafka',
              'Via HTTP long-polling|||Qua HTTP long-polling',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does the server do with the SDP packet received via <code>call:offer</code>?|||Server làm gì với packet SDP nhận qua <code>call:offer</code>?',
            options: [
              'Just relay it to the target user (io.to("user:B").emit("call:incoming", { sdp })). Do NOT parse, do NOT modify — SDP munging usually breaks modern WebRTC|||Chỉ relay đến user đích (io.to("user:B").emit("call:incoming", { sdp })). KHÔNG parse, KHÔNG modify — SDP munging thường vỡ WebRTC modern',
              'Parse and validate codecs before forwarding|||Parse và validate codec trước khi forward',
              'Store in Redis for later replay|||Lưu vào Redis để replay sau',
              'Encrypt with the recipient\'s public key|||Encrypt với public key của recipient',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Approximately 15% of users on symmetric NAT cannot connect P2P. What do they need?|||Khoảng 15% users trên symmetric NAT không kết nối P2P được. Họ cần gì?',
            options: [
              'A TURN server that relays media between them — separate infrastructure (coturn self-hosted or Xirsys/Twilio managed) with bandwidth costs, NOT socket.io|||TURN server relay media giữa họ — infra riêng (coturn self-host hoặc Xirsys/Twilio managed) với chi phí bandwidth, KHÔNG phải socket.io',
              'Faster internet|||Internet nhanh hơn',
              'A newer browser|||Browser mới hơn',
              'Socket.io v5|||Socket.io v5',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'This repo does <code>socket.rooms.has(&quot;thread:X&quot;)</code> before delivering <code>call:incoming</code>. Why?|||Kho này kiểm <code>socket.rooms.has(&quot;thread:X&quot;)</code> trước khi deliver <code>call:incoming</code>. Vì sao?',
            options: [
              'To only pop the call dialog on the tab currently viewing that chat thread, not on every tab the user has open — prevents UX noise|||Để chỉ pop call dialog trên tab đang xem thread chat đó, không phải mọi tab user mở — tránh UX noise',
              'To check permissions|||Kiểm quyền',
              'To rate limit calls|||Rate limit call',
              'To detect symmetric NAT|||Phát hiện symmetric NAT',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: '4-person group video call via P2P mesh. What breaks?|||Call video nhóm 4 người qua P2P mesh. Cái gì vỡ?',
            options: [
              'Each peer must upload video to 3 others = ~3 Mbps upload per peer, plus 12 total connections. Consumer internet cannot handle. Fix: use SFU (server routes streams) — mediasoup, LiveKit, Janus|||Mỗi peer phải upload video cho 3 người khác = ~3 Mbps upload per peer, plus 12 connection total. Internet consumer không chịu nổi. Fix: dùng SFU (server route stream) — mediasoup, LiveKit, Janus',
              'Nothing — mesh scales infinitely|||Không có — mesh scale vô hạn',
              'Socket.io has a 4-peer limit|||Socket.io có limit 4 peer',
              'WebRTC only supports 1-on-1|||WebRTC chỉ hỗ trợ 1-on-1',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Should you try to build your own SFU?|||Có nên build SFU riêng?',
            options: [
              'No — SFU requires deep understanding of RTP, RTCP, DTLS-SRTP, codec-specific packet handling; tens of thousands of lines of C++. Use mediasoup, Janus, or LiveKit — mature and battle-tested|||Không — SFU cần hiểu sâu RTP, RTCP, DTLS-SRTP, xử lý packet theo codec; hàng chục nghìn dòng C++. Dùng mediasoup, Janus, hoặc LiveKit — chín và battle-tested',
              'Yes, it\'s a good learning exercise|||Có, exercise học tập tốt',
              'Only if using TypeScript|||Chỉ nếu dùng TypeScript',
              'Only if you need &lt;100 users|||Chỉ nếu cần &lt;100 users',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },

  ],
};
