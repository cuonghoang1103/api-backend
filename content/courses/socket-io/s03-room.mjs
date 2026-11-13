import G03_1 from './giang/sio-03-1.mjs';
import G03_2 from './giang/sio-03-2.mjs';
import G03_3 from './giang/sio-03-3.mjs';
import G03_4 from './giang/sio-03-4.mjs';
import G03_5 from './giang/sio-03-5.mjs';
const REF = '?ref=%2Fcourses%2Fsocket-io%2Flearn&reflabel=Socket.IO';
/**
 * Socket.IO — Chương 3: Room và namespace.
 * Đo: Room là abstraction routing per-event; namespace là namespace tách biệt
 * (khác connection). Kho này dùng 4 pattern room, KHÔNG dùng namespace.
 */

export default {
  title: 'Chapter 3 — Rooms and namespaces: routing at layer 3|||Chương 3 — Room và namespace: routing ở tầng 3',
  slug: 'io-ch3-room',
  description: 'Sáu bài về room (đúng abstraction) và namespace (thứ bạn hầu như không cần). Kho này có 4 pattern room, 0 namespace.',
  sortOrder: 4,
  lessons: [
    /* ─────────────────────────── 3.1 ─────────────────────────── */
    {
      title: '3.1 — Rooms: the abstraction you actually want|||3.1 — Room: abstraction bạn THẬT SỰ cần',
      slug: 'io-3-1-room',
      type: 'VIDEO',
      description: 'Room là tag string bạn gán vào socket để routing per-event. Không phải &quot;chat room&quot; theo nghĩa UI — mà là bộ chọn ai nhận emit này. Kho này có 4 pattern.',
      content: `
${G03_1}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Rooms: the abstraction you actually want</h2>
<p class="lead">Rooms are the single most useful concept in socket.io. They&#39;re also the most misnamed — a &quot;room&quot; is not a chat room in the UI sense, it&#39;s a string tag on a socket that <code>emit</code> can target. This lesson catalogs the four patterns used in this repo.</p>

<h3>What a room actually is</h3>
<pre><code class="language-ts">// join = them mot tag string
socket.join('thread:42');
socket.join('user:7');
socket.join('anything-you-want');

// emit den moi socket co tag do
io.to('thread:42').emit('new-message', msg);

// emit den MOI socket co it nhat MOT trong hai tag (UNION — moi socket nhan dung 1 lan)
io.to('thread:42').to('user:7').emit('personal', data);
</code></pre>

<div class="callout warn">
<p><strong><code>io.to(A).to(B)</code> is a UNION, not an intersection.</strong> Every socket in A OR B receives the event — exactly once, even if it is in both. <code>io.to([A, B])</code> is the same union written as an array. Measured (socket.io 4.8.4): a socket only in A got it 1 time, only in B 1 time, in both 1 time, in neither 0. Socket.IO has no intersection operator: to reach "in A AND in B", emit to a room that already means both, or filter <code>await io.in(A).fetchSockets()</code> by <code>s.rooms.has(B)</code>. Assuming an intersection is how a "personal" message ends up in front of the whole thread.</p>
</div>

<h3>The four room patterns in this repo</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">1 · per-user</span><span class="lz-nsub"><code>user:${'${userId}'}</code></span></span>
<span class="lz-nbody">Socket join <code>user:42</code> on connect. The server calls <code>io.to(&#39;user:42&#39;).emit(...)</code> to reach user 42 even with 3 tabs open. This is the foundational room, used by every realtime feature.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">2 · per-resource</span><span class="lz-nsub"><code>thread:${'${threadId}'}</code>, <code>post:${'${postId}'}</code></span></span>
<span class="lz-nbody">The socket joins when the user OPENS the thread/post tab, and leaves when they close it. <code>io.to(&#39;thread:42&#39;)</code> delivers new messages to whoever is looking at the thread, and to nobody else.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">3 · per-feature-instance</span><span class="lz-nsub"><code>listen:${'${roomId}'}</code></span></span>
<span class="lz-nbody">Listen Together — an ephemeral room created by the host, alive only while the host is. Unlike thread:XX it has no DB record — it is a VIRTUAL ROOM existing only in socket.io's memory.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">4 · per-device</span><span class="lz-nsub"><code>device:${'${deviceId}'}</code></span></span>
<span class="lz-nbody">Device gateway — every ESP32/Arduino gets its own room for dashboards to subscribe to. One device event fans out to the N dashboards watching. Chapter 9 (raw WebSocket, the device gateway) measures this.</span>
</div>
</div>

<h3>Checking who is in a room</h3>
<pre><code class="language-ts">// server-side, BAT dong bo (Promise) — di qua adapter, nen hoi duoc ca cum (Chuong 5)
const socketIds = await io.in('thread:42').fetchSockets();
console.log('So socket trong thread:42:', socketIds.length);

// hoac lay Set truc tiep (dong bo) — CHI socket cua worker nay
const room = io.sockets.adapter.rooms.get('thread:42');
console.log('So socket:', room?.size ?? 0);
</code></pre>

<h3>Leaving a room</h3>
<pre><code class="language-ts">socket.leave('thread:42');           // roi mot room
socket.leave(&#96;user:\${userId}&#96;);      // roi room user cua chinh minh — rare

// disconnect roi TAT CA room tu dong
// KHONG can goi leave() truoc disconnect
</code></pre>

<div class="pitfall">
<p><strong>Trap — <code>socket.rooms</code> includes the room NAMED AFTER THE SID.</strong> Every socket automatically joins the room named after its own sid (the thing that makes <code>io.to(sid).emit(...)</code> work). So <code>socket.rooms.size</code> is always 1 + however many rooms you joined by hand. Do not test for <code>if (socket.rooms.size === 0)</code>.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> A room is a string tag for per-event routing, <code>io.to(A).to(B)</code> is a union, the same as <code>[A, B]</code> (there is no intersection operator), this repo uses 4 patterns (user, resource, feature-instance, device) — and every socket sits automatically in the room named after its sid (so <code>socket.rooms.size ≥ 1</code>).</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Join a socket to a few rooms and print <code>socket.rooms</code> — note it always contains the socket's own sid, so the size is at least 1.</li>
<li>Broadcast with <code>io.to(A).to(B).emit(...)</code> and confirm a socket in EITHER room receives it — a union, not an intersection.</li>
<li>Write one example key for each of this repo's four room patterns: <code>user:</code>, <code>resource:</code>, <code>feature-instance:</code>, <code>device:</code>.</li>
</ol>
<p><strong>Done when:</strong> you can show <code>socket.rooms.size ≥ 1</code> and prove <code>io.to(A).to(B)</code> is a union.</p></div>

<h3>🔬 Measured: four sockets, two rooms</h3>
<p>socket.io 4.8.3, Node 22: c1 in A · c2 in B · c3 in A and B · c4 in no room. Every socket is already in the room named after its own sid (size ≥ 1); chaining <code>to()</code> is a deduplicated union; there is no intersection — you filter it:</p>
<div class="out">$ node rooms.mjs
— socket.rooms của từng socket (phía server) —
c2  size=2  &lt;sid 2-5T9q…&gt;, B
c1  size=2  &lt;sid gub87y…&gt;, A
c3  size=3  &lt;sid 3nrKki…&gt;, A, B
c4  size=1  &lt;sid JCwvnb…&gt;
— ai nhận, mấy lần —
io.to('A')                   {"c1":1,"c2":0,"c3":1,"c4":0}
io.to('A').to('B')           {"c1":1,"c2":1,"c3":1,"c4":0}
io.to(['A', 'B'])            {"c1":1,"c2":1,"c3":1,"c4":0}
io.to(&lt;sid của c1&gt;)          {"c1":1,"c2":0,"c3":0,"c4":0}
— hỏi ai đang ở room —
adapter.rooms.get('A').size = 2 (Set, đồng bộ, CHỈ worker này)
await io.in('A').fetchSockets() → c1, c3 (Promise, đi qua adapter)
giao A ∩ B (tự lọc)        → c3
adapter.rooms có 6 mục: &lt;sid&gt; B &lt;sid&gt; A &lt;sid&gt; &lt;sid&gt;</div>
<p><strong>In a real Chromium</strong> (the server joins the socket to <code>thread:42</code> and <code>user:7</code>, then emits to <code>thread:42</code>, to the union, and to <code>thread:99</code>) — the WebSocket frames it received:</p>
<div class="out">↓ 0{"sid":"gihI13xpqgN3KimgAAAA","upgrades":[],"pingInterval":25000,"pingTimeout":20000,"maxPayload":1000000}   (34 ms)
↑ 40   (34 ms)
↓ 40{"sid":"I94HJ7zygOfmyVnFAAAA"}   (36 ms)
↓ 42["thread:new-message",{"id":1,"text":"chào cả thread"}]   (639 ms)
↓ 42["personal",{"text":"union: tới đúng MỘT lần"}]   (639 ms)</div>
<p>No frame for <code>join</code>, no room name in any event, nothing for <code>thread:99</code>: rooms live only on the server.</p>
<p><strong>This repo</strong> — every <code>socket.join</code> in <code>src/socket</code>:</p>
<div class="out"># Kho cuongthai.com: socket vào room nào? (8 tệp gateway, 3.935 dòng không tính test)
$ grep -n "socket.join(" src/socket/*.ts
doiKhang.socket.ts:343: void socket.join(khoa(p.ma));
doiKhang.socket.ts:526: p.nghe.set(socket.id, user.id); void socket.join(khoa(p.ma));
listen-together.ts:153: socket.join(roomKey(room.id));
messaging.socket.ts:353: socket.join(&#96;user:\${user.id}&#96;);
messaging.socket.ts:355: socket.join(&#96;admin:\${user.id}&#96;);
messaging.socket.ts:360: socket.join('admin');
messaging.socket.ts:409: socket.join(&#96;thread:\${t.id}&#96;);
messaging.socket.ts:468: socket.join(&#96;thread:\${threadId}&#96;);
messaging.socket.ts:496: socket.join(&#96;maker:device:\${deviceId}&#96;);
messaging.socket.ts:609: socket.join(room);
work.socket.ts:54: await socket.join(isClientScoped(access) ? clientRoom(pid) : projectRoom(pid));
work.socket.ts:111: await socket.join(room);
work.socket.ts:159: if (rooms.length) await socket.join(rooms);
$ grep -n "=&gt; \\&#96;listen:\\|return \\&#96;maker:device\\|=&gt; \\&#96;dk:" src/socket/*.ts
device.gateway.ts:127: return &#96;maker:device:\${deviceId}&#96;;
doiKhang.socket.ts:107:const khoa = (ma: string) =&gt; &#96;dk:\${ma}&#96;;
listen-together.ts:97:const roomKey = (id: string) =&gt; &#96;listen:\${id}&#96;;</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-javascript"><span class="tok-comment">// Bốn client: c1 chỉ ở A · c2 chỉ ở B · c3 ở cả A và B · c4 không room nào</span>
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const io = new Server(19600);
const tenCua = (s) =&gt; s.handshake.auth.ten;
io.on('connection', (s) =&gt; { s.join(s.handshake.auth.rooms); s.emit('san-sang'); }); <span class="tok-comment">  // join nhận chuỗi HOẶC mảng</span>

const DS = { c1: ['A'], c2: ['B'], c3: ['A', 'B'], c4: [] };
const dem = {};
await Promise.all(Object.entries(DS).map(([ten, rooms]) =&gt; new Promise((r) =&gt; {
  const c = ketNoi('http://localhost:19600', { auth: { ten, rooms } });
  dem[ten] = 0; c.on('tin', () =&gt; dem[ten]++); c.on('san-sang', r);
})));
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
const thu = async (nhan, phat) =&gt; { for (const k in dem) dem[k] = 0; phat(); await cho(300); console.log(nhan.padEnd(28), JSON.stringify(dem)); };

console.log('— socket.rooms của từng socket (phía server) —');
for (const s of io.sockets.sockets.values()) console.log(&#96;\${tenCua(s)}  size=\${s.rooms.size}  \${[...s.rooms].map((r) =&gt; (r === s.id ? &#96;&lt;sid \${r.slice(0, 6)}…&gt;&#96; : r)).join(', ')}&#96;);

console.log('— ai nhận, mấy lần —');
await thu("io.to('A')", () =&gt; io.to('A').emit('tin'));
await thu("io.to('A').to('B')", () =&gt; io.to('A').to('B').emit('tin'));
await thu("io.to(['A', 'B'])", () =&gt; io.to(['A', 'B']).emit('tin'));
const c1 = [...io.sockets.sockets.values()].find((s) =&gt; tenCua(s) === 'c1');
await thu('io.to(&lt;sid của c1&gt;)', () =&gt; io.to(c1.id).emit('tin'));

console.log('— hỏi ai đang ở room —');
console.log("adapter.rooms.get('A').size =", io.sockets.adapter.rooms.get('A')?.size ?? 0, '(Set, đồng bộ, CHỈ worker này)');
const oA = await io.in('A').fetchSockets();
console.log("await io.in('A').fetchSockets() →", oA.map(tenCua).join(', '), '(Promise, đi qua adapter)');
console.log("giao A ∩ B (tự lọc)        →", oA.filter((s) =&gt; s.rooms.has('B')).map(tenCua).join(', '));
console.log('adapter.rooms có', io.sockets.adapter.rooms.size, 'mục:', [...io.sockets.adapter.rooms.keys()].map((k) =&gt; (io.sockets.sockets.has(k) ? '&lt;sid&gt;' : k)).join(' '));
process.exit(0);</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-2-ws-vs-socketio-rooms" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 11.2 — ws or Socket.IO: the price of convenience</span><span class="lc-sub">Rooms measured with real clients, and a "max 500 rooms" cap that counted calls, not sockets</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-8-1-pubsub" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 8.1 — Pub/Sub: fire and forget, and its cost</span><span class="lc-sub">What the Redis adapter uses to share rooms across workers (Chapter 5)</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Room</span><span class="v">A string tag used to route an event to a subset of sockets.</span></div>
  <div class="kv"><span class="k"><code>io.to(room)</code></span><span class="v">Target a room for a broadcast.</span></div>
  <div class="kv"><span class="k">Union of rooms</span><span class="v"><code>io.to(A).to(B)</code> equals <code>[A, B]</code> — anyone in either; no intersection operator.</span></div>
  <div class="kv"><span class="k">Auto sid room</span><span class="v">Every socket joins a room named after its own sid.</span></div>
  <div class="kv"><span class="k">Room key pattern</span><span class="v">This repo's <code>user:</code> / <code>resource:</code> / <code>feature-instance:</code> / <code>device:</code> naming.</span></div>
  <div class="kv"><span class="k"><code>socket.rooms</code></span><span class="v">The set of rooms a socket belongs to (size ≥ 1).</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A room is just a string tag used to route events to a subset of sockets.</li><li><code>io.to(A).to(B)</code> is a union — the same as passing <code>[A, B]</code>; there is no intersection operator.</li><li>Every socket is automatically in a room named after its own sid, so <code>socket.rooms.size ≥ 1</code>.</li><li>This repo uses four key patterns: user, resource, feature-instance, device.</li><li>Choose keys so you can target exactly the sockets you mean without listing them.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Rooms</span><span class="lc-sub">socket.io/docs/v4/rooms — API chuẩn; chuỗi to() nhiều room là phép hợp (union).</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 5 — the Redis adapter and clustering</span><span class="lc-sub">/courses/socket-io/learn${REF} — room state chia sẻ qua workers ra sao.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Room: abstraction bạn THẬT SỰ cần</h2>
<p class="lead">Room là khái niệm hữu ích nhất trong socket.io. Cũng là cái đặt tên sai nhất — &quot;room&quot; KHÔNG phải chat room theo nghĩa UI, mà là một tag chuỗi trên socket để <code>emit</code> có thể targeting. Bài này liệt kê bốn pattern kho này dùng.</p>

<h3>Room thật sự là gì</h3>
<pre><code class="language-ts">// join = them mot tag string
socket.join('thread:42');
socket.join('user:7');
socket.join('anything-you-want');

// emit den moi socket co tag do
io.to('thread:42').emit('new-message', msg);

// emit den MOI socket co it nhat MOT trong hai tag (UNION — moi socket nhan dung 1 lan)
io.to('thread:42').to('user:7').emit('personal', data);
</code></pre>

<div class="callout warn">
<p><strong><code>io.to(A).to(B)</code> là UNION, không phải intersection.</strong> Mọi socket ở A HOẶC B đều nhận — đúng một lần, kể cả socket ở cả hai. <code>io.to([A, B])</code> là cùng phép hợp đó viết dạng mảng. Đo thật (socket.io 4.8.4): socket chỉ ở A nhận 1 lần, chỉ ở B 1 lần, ở cả hai 1 lần, không ở đâu 0. Socket.IO không có toán tử giao: muốn "ở A VÀ ở B" thì phát vào một room vốn đã mang nghĩa cả hai, hoặc lọc <code>await io.in(A).fetchSockets()</code> theo <code>s.rooms.has(B)</code>. Tưởng là phép giao chính là cách một tin "riêng" hiện ra trước cả thread.</p>
</div>

<h3>Bốn pattern room ở kho này</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">1 · per-user</span><span class="lz-nsub"><code>user:${'${userId}'}</code></span></span>
<span class="lz-nbody">Socket join <code>user:42</code> khi kết nối. Server <code>io.to(&#39;user:42&#39;).emit(...)</code> để reach user 42 dù họ mở 3 tab. Đây là room căn bản, dùng ở mọi feature realtime.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">2 · per-resource</span><span class="lz-nsub"><code>thread:${'${threadId}'}</code>, <code>post:${'${postId}'}</code></span></span>
<span class="lz-nbody">Socket join khi user MỞ tab của thread/post. Rời khi user đóng. <code>io.to(&#39;thread:42&#39;)</code> đưa tin nhắn mới đến ai đang xem thread. Không đưa cho ai không xem.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">3 · per-feature-instance</span><span class="lz-nsub"><code>listen:${'${roomId}'}</code></span></span>
<span class="lz-nbody">Listen Together — room ephemeral tạo bởi host, sống khi host còn. Khác thread:XX vì không có DB record — nó là VIRTUAL ROOM chỉ tồn tại trong RAM socket.io.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">4 · per-device</span><span class="lz-nsub"><code>device:${'${deviceId}'}</code></span></span>
<span class="lz-nbody">Device gateway — mỗi ESP32/Arduino có room riêng để dashboard subscribe. Fan-out một event từ device tới N dashboard đang xem. Chương 9 (raw WebSocket, device gateway) đo cái này.</span>
</div>
</div>

<h3>Kiểm ai đang trong room</h3>
<pre><code class="language-ts">// server-side, BAT dong bo (Promise) — di qua adapter, nen hoi duoc ca cum (Chuong 5)
const socketIds = await io.in('thread:42').fetchSockets();
console.log('So socket trong thread:42:', socketIds.length);

// hoac lay Set truc tiep (dong bo) — CHI socket cua worker nay
const room = io.sockets.adapter.rooms.get('thread:42');
console.log('So socket:', room?.size ?? 0);
</code></pre>

<h3>Rời khỏi room</h3>
<pre><code class="language-ts">socket.leave('thread:42');           // roi mot room
socket.leave(&#96;user:\${userId}&#96;);      // roi room user cua chinh minh — rare

// disconnect roi TAT CA room tu dong
// KHONG can goi leave() truoc disconnect
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — <code>socket.rooms</code> chứa cả room MANG SID.</strong> Mỗi socket tự động join room mang sid của nó (thứ giúp <code>io.to(sid).emit(...)</code> hoạt động). Nên <code>socket.rooms.size</code> luôn là 1 + số room bạn join manual. Đừng test <code>if (socket.rooms.size === 0)</code>.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Room là tag chuỗi routing per-event, <code>io.to(A).to(B)</code> là union, giống <code>[A, B]</code> (không có toán tử giao), kho này có 4 pattern (user, resource, feature-instance, device) — và mọi socket tự động ở room mang sid của nó (nên <code>socket.rooms.size ≥ 1</code>).</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Join một socket vào vài room và in <code>socket.rooms</code> — để ý nó luôn chứa sid của chính socket, nên size ít nhất là 1.</li>
<li>Broadcast bằng <code>io.to(A).to(B).emit(...)</code> và xác nhận một socket ở MỘT TRONG hai room đều nhận — một union, không phải giao.</li>
<li>Viết một key ví dụ cho mỗi pattern room của kho này: <code>user:</code>, <code>resource:</code>, <code>feature-instance:</code>, <code>device:</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chỉ ra được <code>socket.rooms.size ≥ 1</code> và chứng minh <code>io.to(A).to(B)</code> là một union.</p></div>

<h3>🔬 Đo thật: bốn socket, hai room</h3>
<p>socket.io 4.8.3, Node 22: c1 ở A · c2 ở B · c3 ở cả A và B · c4 không room nào. Mọi socket đã sẵn ở room mang sid của chính nó (size ≥ 1); nối <code>to()</code> là phép hợp có khử trùng; không có phép giao — tự lọc:</p>
<div class="out">$ node rooms.mjs
— socket.rooms của từng socket (phía server) —
c2  size=2  &lt;sid 2-5T9q…&gt;, B
c1  size=2  &lt;sid gub87y…&gt;, A
c3  size=3  &lt;sid 3nrKki…&gt;, A, B
c4  size=1  &lt;sid JCwvnb…&gt;
— ai nhận, mấy lần —
io.to('A')                   {"c1":1,"c2":0,"c3":1,"c4":0}
io.to('A').to('B')           {"c1":1,"c2":1,"c3":1,"c4":0}
io.to(['A', 'B'])            {"c1":1,"c2":1,"c3":1,"c4":0}
io.to(&lt;sid của c1&gt;)          {"c1":1,"c2":0,"c3":0,"c4":0}
— hỏi ai đang ở room —
adapter.rooms.get('A').size = 2 (Set, đồng bộ, CHỈ worker này)
await io.in('A').fetchSockets() → c1, c3 (Promise, đi qua adapter)
giao A ∩ B (tự lọc)        → c3
adapter.rooms có 6 mục: &lt;sid&gt; B &lt;sid&gt; A &lt;sid&gt; &lt;sid&gt;</div>
<p><strong>Trong Chromium thật</strong> (server cho socket join <code>thread:42</code> và <code>user:7</code>, rồi phát tới <code>thread:42</code>, tới phép hợp, và tới <code>thread:99</code>) — các khung WebSocket trình duyệt nhận:</p>
<div class="out">↓ 0{"sid":"gihI13xpqgN3KimgAAAA","upgrades":[],"pingInterval":25000,"pingTimeout":20000,"maxPayload":1000000}   (34 ms)
↑ 40   (34 ms)
↓ 40{"sid":"I94HJ7zygOfmyVnFAAAA"}   (36 ms)
↓ 42["thread:new-message",{"id":1,"text":"chào cả thread"}]   (639 ms)
↓ 42["personal",{"text":"union: tới đúng MỘT lần"}]   (639 ms)</div>
<p>Không khung nào cho <code>join</code>, không event nào mang tên room, <code>thread:99</code> không gửi gì: room chỉ sống ở server.</p>
<p><strong>Kho này</strong> — mọi <code>socket.join</code> trong <code>src/socket</code>:</p>
<div class="out"># Kho cuongthai.com: socket vào room nào? (8 tệp gateway, 3.935 dòng không tính test)
$ grep -n "socket.join(" src/socket/*.ts
doiKhang.socket.ts:343: void socket.join(khoa(p.ma));
doiKhang.socket.ts:526: p.nghe.set(socket.id, user.id); void socket.join(khoa(p.ma));
listen-together.ts:153: socket.join(roomKey(room.id));
messaging.socket.ts:353: socket.join(&#96;user:\${user.id}&#96;);
messaging.socket.ts:355: socket.join(&#96;admin:\${user.id}&#96;);
messaging.socket.ts:360: socket.join('admin');
messaging.socket.ts:409: socket.join(&#96;thread:\${t.id}&#96;);
messaging.socket.ts:468: socket.join(&#96;thread:\${threadId}&#96;);
messaging.socket.ts:496: socket.join(&#96;maker:device:\${deviceId}&#96;);
messaging.socket.ts:609: socket.join(room);
work.socket.ts:54: await socket.join(isClientScoped(access) ? clientRoom(pid) : projectRoom(pid));
work.socket.ts:111: await socket.join(room);
work.socket.ts:159: if (rooms.length) await socket.join(rooms);
$ grep -n "=&gt; \\&#96;listen:\\|return \\&#96;maker:device\\|=&gt; \\&#96;dk:" src/socket/*.ts
device.gateway.ts:127: return &#96;maker:device:\${deviceId}&#96;;
doiKhang.socket.ts:107:const khoa = (ma: string) =&gt; &#96;dk:\${ma}&#96;;
listen-together.ts:97:const roomKey = (id: string) =&gt; &#96;listen:\${id}&#96;;</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-javascript"><span class="tok-comment">// Bốn client: c1 chỉ ở A · c2 chỉ ở B · c3 ở cả A và B · c4 không room nào</span>
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const io = new Server(19600);
const tenCua = (s) =&gt; s.handshake.auth.ten;
io.on('connection', (s) =&gt; { s.join(s.handshake.auth.rooms); s.emit('san-sang'); }); <span class="tok-comment">  // join nhận chuỗi HOẶC mảng</span>

const DS = { c1: ['A'], c2: ['B'], c3: ['A', 'B'], c4: [] };
const dem = {};
await Promise.all(Object.entries(DS).map(([ten, rooms]) =&gt; new Promise((r) =&gt; {
  const c = ketNoi('http://localhost:19600', { auth: { ten, rooms } });
  dem[ten] = 0; c.on('tin', () =&gt; dem[ten]++); c.on('san-sang', r);
})));
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
const thu = async (nhan, phat) =&gt; { for (const k in dem) dem[k] = 0; phat(); await cho(300); console.log(nhan.padEnd(28), JSON.stringify(dem)); };

console.log('— socket.rooms của từng socket (phía server) —');
for (const s of io.sockets.sockets.values()) console.log(&#96;\${tenCua(s)}  size=\${s.rooms.size}  \${[...s.rooms].map((r) =&gt; (r === s.id ? &#96;&lt;sid \${r.slice(0, 6)}…&gt;&#96; : r)).join(', ')}&#96;);

console.log('— ai nhận, mấy lần —');
await thu("io.to('A')", () =&gt; io.to('A').emit('tin'));
await thu("io.to('A').to('B')", () =&gt; io.to('A').to('B').emit('tin'));
await thu("io.to(['A', 'B'])", () =&gt; io.to(['A', 'B']).emit('tin'));
const c1 = [...io.sockets.sockets.values()].find((s) =&gt; tenCua(s) === 'c1');
await thu('io.to(&lt;sid của c1&gt;)', () =&gt; io.to(c1.id).emit('tin'));

console.log('— hỏi ai đang ở room —');
console.log("adapter.rooms.get('A').size =", io.sockets.adapter.rooms.get('A')?.size ?? 0, '(Set, đồng bộ, CHỈ worker này)');
const oA = await io.in('A').fetchSockets();
console.log("await io.in('A').fetchSockets() →", oA.map(tenCua).join(', '), '(Promise, đi qua adapter)');
console.log("giao A ∩ B (tự lọc)        →", oA.filter((s) =&gt; s.rooms.has('B')).map(tenCua).join(', '));
console.log('adapter.rooms có', io.sockets.adapter.rooms.size, 'mục:', [...io.sockets.adapter.rooms.keys()].map((k) =&gt; (io.sockets.sockets.has(k) ? '&lt;sid&gt;' : k)).join(' '));
process.exit(0);</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-2-ws-vs-socketio-rooms" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 11.2 — ws hay Socket.IO: cái giá của sự tiện nghi</span><span class="lc-sub">Đo room với client thật, và giới hạn "tối đa 500 room" đếm theo lần gọi chứ không theo socket</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-8-1-pubsub" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 8.1 — Pub/Sub: bắn rồi quên, và cái giá của nó</span><span class="lc-sub">Thứ Redis adapter dùng để chia room qua nhiều worker (Chương 5)</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Room</span><span class="v">Một tag chuỗi dùng để định tuyến một event tới một tập con socket.</span></div>
  <div class="kv"><span class="k"><code>io.to(room)</code></span><span class="v">Nhắm một room cho một broadcast.</span></div>
  <div class="kv"><span class="k">Union của room</span><span class="v"><code>io.to(A).to(B)</code> bằng <code>[A, B]</code> — ai ở một trong hai; không có toán tử giao.</span></div>
  <div class="kv"><span class="k">Room sid tự động</span><span class="v">Mọi socket join một room mang sid của chính nó.</span></div>
  <div class="kv"><span class="k">Pattern key room</span><span class="v">Cách đặt <code>user:</code> / <code>resource:</code> / <code>feature-instance:</code> / <code>device:</code> của kho này.</span></div>
  <div class="kv"><span class="k"><code>socket.rooms</code></span><span class="v">Tập room một socket thuộc về (size ≥ 1).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Một room chỉ là một tag chuỗi dùng để định tuyến event tới một tập con socket.</li><li><code>io.to(A).to(B)</code> là một union — giống truyền <code>[A, B]</code>; không có toán tử giao.</li><li>Mọi socket tự động ở một room mang sid của chính nó, nên <code>socket.rooms.size ≥ 1</code>.</li><li>Kho này dùng bốn pattern key: user, resource, feature-instance, device.</li><li>Chọn key sao cho bạn nhắm đúng các socket mình muốn mà không phải liệt kê.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Rooms</span><span class="lc-sub">socket.io/docs/v4/rooms — API chuẩn; chuỗi to() nhiều room là phép hợp (union).</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 5 — Redis adapter và cluster</span><span class="lc-sub">/courses/socket-io/learn${REF} — room state chia sẻ qua workers ra sao.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 3.2 ─────────────────────────── */
    {
      title: '3.2 — Namespaces: the tool you probably do not need|||3.2 — Namespace: công cụ bạn có lẽ KHÔNG cần',
      slug: 'io-3-2-namespace',
      type: 'VIDEO',
      description: 'Namespace là routing tách biệt cấp connection — mỗi cái có middleware, sid, listener khác. Kho này KHÔNG dùng cái nào. Bài này chỉ khi nào bạn thật sự cần.',
      content: `
${G03_2}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Namespaces: the tool you probably do not need</h2>
<p class="lead">Every socket.io tutorial mentions namespaces. Most apps do not need them. This repo — with 3,935 lines of gateway code in 8 files (measured 13/11/2026, tests excluded) — uses ZERO namespaces. Understanding when you need one saves the wrong architecture.</p>

<h3>What a namespace is</h3>
<pre><code class="language-ts">// mac dinh la '/' — bat ky io.on, io.emit khong prefix ket noi day
io.on('connection', ...);                    // namespace '/'

// tao namespace rieng
const chatNs = io.of('/chat');
chatNs.on('connection', s =&gt; s.on('msg', ...));
chatNs.emit('all-chat', data);              // KHONG toi cac socket o '/'

// client join namespace
const c = io('http://example.com/chat');    // path la path, "/chat" la namespace
</code></pre>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">COMPLETELY separated</span><span class="lz-d">A socket in <code>/chat</code> does NOT receive emits in <code>/</code>. Middleware runs separately. The rooms are separate too (thread:42 in /chat is not thread:42 in /admin).</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">CHUNG engine.io connection</span><span class="lz-d">A client opening <code>io(url)</code> và <code>io(url + &#39;/admin&#39;)</code> shares ONE WebSocket. A namespace is layer-3 routing, not a new connection.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">EACH namespace has its own sid</span><span class="lz-d">The engine.io sid is shared, but the socket.io sid in <code>/chat</code> differs from the one in <code>/admin</code>. This is the two-sid story lesson 0.3 measured.</span></div>
</div>

<h3>When you DO need a namespace</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">an admin panel with different auth</span><span class="lz-nsub">/admin namespace</span></span>
<span class="lz-nbody">Ordinary users authenticate with a JWT. Admins authenticate with a different session cookie. Different middleware for each <code>/</code> vs <code>/admin</code> — separate namespaces so the right middleware runs.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">multi-tenant SaaS</span><span class="lz-nsub">/tenant/:id namespace</span></span>
<span class="lz-nbody">Each tenant's data is fully isolated. An emit in tenant A must NOT reach tenant B even if the code has a bug. A namespace is a hard wall.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">splitting code along team lines</span><span class="lz-nsub">/notifications, /messaging</span></span>
<span class="lz-nbody">The notifications team does not need to know about messaging's events. A namespace makes it impossible for them to call into each other by accident.</span>
</div>
</div>

<h3>This repo does NOT use them — why</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">there is only one auth scheme</span><span class="lz-lnote">Admins and users both use a JWT. Same middleware, same logic. A namespace would only add complexity for nothing</span></div>
<div class="lz-layer"><span class="lz-lname">rooms already partition enough</span><span class="lz-lnote">Different features (chat, calls, listen, devices) use different room prefixes — they never interact because they share no rooms. Cheaper than a namespace</span></div>
<div class="lz-layer"><span class="lz-lname">testing stays simpler</span><span class="lz-lnote">Testing one namespace means testing the whole socket.io setup. Several namespaces means setting each one up with its own client. With this repo's 5 gateways, that is 5× the test infrastructure</span></div>
</div>

<div class="callout warn">
<p><strong>Do not create a namespace &quot;to separate features&quot;.</strong> That is the job of rooms plus an event-name prefix. <code>chat:message</code> vs <code>call:offer</code> is enough. A namespace is a major architectural decision, not organisational sugar.</p>
</div>

<h3>Dynamic namespace — bug tinh vi</h3>
<pre><code class="language-ts">// tao dong theo pattern
const nsp = io.of(/^\\/tenant-\\d+$/);
nsp.on('connection', s =&gt; console.log('tenant socket:', s.nsp.name));

// client
const c = io('http://example.com/tenant-42');
</code></pre>

<p>You can — but once <code>/tenant-42</code> has created it, by DEFAULT the namespace is not removed when every socket has left — it stays in memory. With 10,000 tenants that is 10,000 lingering namespaces: the leak dynamic namespaces make easy to create. <strong>Measured correction:</strong> since socket.io 4.6.0 the server option <code>cleanupEmptyChildNamespaces: true</code> removes a child namespace when its last socket leaves (2,000 tenants that all left: 2,001 namespaces by default, 1 with the option — see below).</p>

<div class="pitfall">
<p><strong>Trap — using a namespace as though it were a collection name.</strong> Someone reads <code>io.of(&#39;/thread-42&#39;)</code> and it sounds reasonable. NO. That is what a ROOM is for (<code>io.to(&#39;thread:42&#39;)</code>). Namespaces are for architectural isolation; rooms are for per-event routing. Confusing the two chokes the code that comes after.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Namespaces isolate at the connection level (each gets its own middleware, sid and rooms) and this repo does NOT use them, because every feature shares JWT auth and room prefixes already separate the features — create a namespace only when you genuinely need a hard wall (different auth, multi-tenancy, or a team split), and avoid dynamic namespaces unless you turn on <code>cleanupEmptyChildNamespaces</code> — by default they are never cleaned up.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Create a second namespace with <code>io.of('/admin')</code> and give it its own middleware; confirm its sid and rooms are separate from the default namespace.</li>
<li>Achieve the same separation on the default namespace with a room prefix (<code>admin:</code>) — the approach this repo actually relies on.</li>
<li>Create a dynamic namespace (a regex/function name) and show that by default it is never cleaned up — then turn on <code>cleanupEmptyChildNamespaces</code> and count again.</li>
</ol>
<p><strong>Done when:</strong> you can state one genuine reason to add a namespace and why this repo avoids them.</p></div>

<h3>🔬 Measured: what is separate, what is shared</h3>
<p>socket.io 4.8.3, Node 22, one server with <code>'/'</code> and <code>'/admin'</code>, each with its own middleware; one client per namespace, both join <code>thread:42</code>:</p>
<div class="out">$ node ns.mjs
  middleware '/'      chạy cho /
  [/] connection · socket.id=PmTj3P… · engine sid=_9-64N…
  middleware '/admin' chạy cho /admin
  [/admin] connection · socket.id=7XkdbU… · engine sid=_9-64N…
— hai socket, mấy đường ống? —
goc.io === ad.io (cùng Manager)      → true
engine.id của hai socket            → _9-64N… · _9-64N…
socket.id của hai socket            → PmTj3P… · 7XkdbU…
— emit có vượt namespace không? —
io.emit (namespace '/')             → goc 1 · admin 0
io.to('thread:42') ở '/'            → goc 2 · admin 0
admin.to('thread:42')               → goc 2 · admin 1
thread:42 ở '/' có 1 socket · ở '/admin' có 1 socket — hai Map khác nhau
— namespace không ai khai báo —
io(url + "/khong-co")               → connect_error "Invalid namespace"</div>
<p><strong>In a real Chromium</strong> — one page opens <code>io()</code> and <code>io('/admin')</code>. DevTools shows ONE WebSocket; the namespace is a prefix inside the packets:</p>
<div class="out">↓ 0{"sid":"ibMhTXtR3ldVvYl_AAAA","upgrades":[],"pingInterval":25000,"pingTimeout":20000,"maxPayload":1000000}   (53 ms)
↑ 40   (53 ms)
↑ 40/admin,   (53 ms)
↓ 40{"sid":"RgCTHU4LlURIlj1xAAAA"}   (54 ms)
↓ 40/admin,{"sid":"cnxShtO9ytUOnvgKAAAB"}   (54 ms)
↓ 42["chao","từ /"]   (456 ms)
↓ 42/admin,["chao","từ /admin"]   (657 ms)</div>
<p><strong>Dynamic namespace</strong> — 2,000 tenants connect and all leave, default vs <code>cleanupEmptyChildNamespaces: true</code>:</p>
<div class="out">$ node --expose-gc dong.mjs
mặc định · lúc đầu: 1 namespace · heap 8.7 MB
  sau 500 tenant (đã rời hết): 501 namespace · heap 14.1 MB
  sau 1000 tenant (đã rời hết): 1001 namespace · heap 15.0 MB
  sau 1500 tenant (đã rời hết): 1501 namespace · heap 15.9 MB
  sau 2000 tenant (đã rời hết): 2001 namespace · heap 15.7 MB
$ node --expose-gc dong.mjs don
cleanupEmptyChildNamespaces: true · lúc đầu: 1 namespace · heap 8.7 MB
  sau 500 tenant (đã rời hết): 1 namespace · heap 13.4 MB
  sau 1000 tenant (đã rời hết): 1 namespace · heap 13.7 MB
  sau 1500 tenant (đã rời hết): 1 namespace · heap 13.8 MB
  sau 2000 tenant (đã rời hết): 1 namespace · heap 12.9 MB</div>
<p><strong>This repo</strong> — namespaces and gateway size:</p>
<div class="out"># Kho này: có namespace nào không? Và gateway dài bao nhiêu?
$ grep -rn "io.of(\\|\\.of('/" src --include='*.ts' | wc -l
       0
$ wc -l src/socket/*.ts | grep -v test
     281 src/socket/call.socket.ts
    1113 src/socket/device.gateway.ts
     680 src/socket/doiKhang.socket.ts
     362 src/socket/listen-together.ts
     614 src/socket/messaging.socket.ts
     300 src/socket/notes-collaboration.gateway.ts
     410 src/socket/work-docs-collaboration.gateway.ts
     175 src/socket/work.socket.ts
    3935 total</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-javascript"><span class="tok-comment">// Hai namespace trên MỘT server: '/' và '/admin' — middleware, sid, room có tách nhau không? Có chung đường ống không?</span>
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const io = new Server(19610);
const admin = io.of('/admin');
io.use((s, next) =&gt; { console.log(&#96;  middleware '/'      chạy cho \${s.nsp.name}&#96;); next(); });
admin.use((s, next) =&gt; { console.log(&#96;  middleware '/admin' chạy cho \${s.nsp.name}&#96;); next(); });
const log = (ten) =&gt; (s) =&gt; { s.join('thread:42'); s.on('ping-thu', () =&gt; {}); console.log(&#96;  [\${ten}] connection · socket.id=\${s.id.slice(0, 6)}… · engine sid=\${s.conn.id.slice(0, 6)}…&#96;); };
io.on('connection', log('/'));
admin.on('connection', log('/admin'));

const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
const goc = ketNoi('http://localhost:19610');
const ad = ketNoi('http://localhost:19610/admin');
await cho(500);
console.log('— hai socket, mấy đường ống? —');
console.log(&#96;goc.io === ad.io (cùng Manager)      → \${goc.io === ad.io}&#96;);
console.log(&#96;engine.id của hai socket            → \${goc.io.engine.id.slice(0, 6)}… · \${ad.io.engine.id.slice(0, 6)}…&#96;);
console.log(&#96;socket.id của hai socket            → \${goc.id.slice(0, 6)}… · \${ad.id.slice(0, 6)}…&#96;);
console.log('— emit có vượt namespace không? —');
let nGoc = 0, nAd = 0; goc.on('tin', () =&gt; nGoc++); ad.on('tin', () =&gt; nAd++);
io.emit('tin'); await cho(200);                       console.log(&#96;io.emit (namespace '/')             → goc \${nGoc} · admin \${nAd}&#96;);
io.to('thread:42').emit('tin'); await cho(200);       console.log(&#96;io.to('thread:42') ở '/'            → goc \${nGoc} · admin \${nAd}&#96;);
admin.to('thread:42').emit('tin'); await cho(200);    console.log(&#96;admin.to('thread:42')               → goc \${nGoc} · admin \${nAd}&#96;);
console.log(&#96;thread:42 ở '/' có \${io.sockets.adapter.rooms.get('thread:42').size} socket · ở '/admin' có \${admin.adapter.rooms.get('thread:42').size} socket — hai Map khác nhau&#96;);
console.log('— namespace không ai khai báo —');
const la = ketNoi('http://localhost:19610/khong-co', { reconnection: false });
console.log('io(url + "/khong-co")               →', await new Promise((r) =&gt; { la.on('connect', () =&gt; r('connect')); la.on('connect_error', (e) =&gt; r(&#96;connect_error "\${e.message}"&#96;)); }));
process.exit(0);</code></pre>
<pre><code class="language-javascript"><span class="tok-comment">// Dynamic namespace: 2.000 tenant kết nối rồi rời hết — namespace có được dọn không? Mặc định vs cleanupEmptyChildNamespaces: true</span>
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const don = process.argv[2] === 'don';
const io = new Server(19612, don ? { cleanupEmptyChildNamespaces: true } : {});
io.of(/^\\/tenant-\\d+$/).on('connection', () =&gt; {});
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
const mb = () =&gt; (process.memoryUsage().heapUsed / 1048576).toFixed(1);
global.gc?.(); console.log(&#96;\${don ? 'cleanupEmptyChildNamespaces: true' : 'mặc định'} · lúc đầu: \${io._nsps.size} namespace · heap \${mb()} MB&#96;);
for (let lo = 0; lo &lt; 4; lo++) {
  const cs = [];
  for (let i = 0; i &lt; 500; i++) cs.push(ketNoi(&#96;http://localhost:19612/tenant-\${lo * 500 + i}&#96;, { transports: ['websocket'], forceNew: true }));
  await Promise.all(cs.map((c) =&gt; new Promise((r) =&gt; c.on('connect', r))));
  cs.forEach((c) =&gt; c.close()); await cho(400);
  global.gc?.(); console.log(&#96;  sau \${(lo + 1) * 500} tenant (đã rời hết): \${io._nsps.size} namespace · heap \${mb()} MB&#96;);
}
process.exit(0);</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-9-4-nhieu-tenant" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Authentication · 9.4 — Many tenants: the boundary that must NEVER leak</span><span class="lc-sub">The hard wall a per-tenant namespace is meant to be</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/observability-monitoring/learn?lessonSlug=obs-5-2-bo-nho" target="_blank" rel="noopener"><span class="lc-ico">📈</span><span class="lc-body"><span class="lc-title">Observability · 5.2 — RSS, heap, external: which number is the leak</span><span class="lc-sub">How to tell whether lingering namespaces really leak</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Namespace</span><span class="v">Connection-level isolation: its own middleware, sid and rooms.</span></div>
  <div class="kv"><span class="k"><code>io.of('/name')</code></span><span class="v">Create or access a namespace.</span></div>
  <div class="kv"><span class="k">Default namespace (<code>/</code>)</span><span class="v">Where all of this repo's features live.</span></div>
  <div class="kv"><span class="k">Room prefix vs namespace</span><span class="v">A prefix separates features without a hard wall.</span></div>
  <div class="kv"><span class="k">Hard wall</span><span class="v">Different auth, multi-tenancy or a team split — the cases that justify a namespace.</span></div>
  <div class="kv"><span class="k">Dynamic namespace</span><span class="v">Created on demand; not cleaned up by default — use cleanupEmptyChildNamespaces.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Namespaces isolate at the connection level — each has its own middleware, sid and rooms.</li><li>This repo does not use them: every feature shares JWT auth and room prefixes already separate features.</li><li>Create a namespace only for a genuine hard wall: different auth, multi-tenancy, or a team split.</li><li>Dynamic namespaces are not cleaned up by default and leak — turn on cleanupEmptyChildNamespaces (4.6+).</li><li>A room prefix is the lighter tool for feature separation.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Namespaces</span><span class="lc-sub">socket.io/docs/v4/namespaces — API chuẩn, đặc biệt phần &quot;dynamic namespaces&quot; nói rõ hạn chế.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Lesson 3.1 — Rooms</span><span class="lc-sub">/courses/socket-io/learn${REF} — cái mà 90% người dùng namespace thật ra CẦN.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Namespace: công cụ bạn có lẽ KHÔNG cần</h2>
<p class="lead">Mọi tutorial socket.io nhắc namespace. Đa số app KHÔNG cần. Kho này — với 3.935 dòng gateway trong 8 tệp (đo 13/11/2026, không tính test) — dùng KHÔNG namespace nào. Hiểu khi nào bạn cần một cái tránh được kiến trúc sai.</p>

<h3>Namespace là gì</h3>
<pre><code class="language-ts">// mac dinh la '/' — bat ky io.on, io.emit khong prefix ket noi day
io.on('connection', ...);                    // namespace '/'

// tao namespace rieng
const chatNs = io.of('/chat');
chatNs.on('connection', s =&gt; s.on('msg', ...));
chatNs.emit('all-chat', data);              // KHONG toi cac socket o '/'

// client join namespace
const c = io('http://example.com/chat');    // path la path, "/chat" la namespace
</code></pre>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">TÁCH BIỆT hoàn toàn</span><span class="lz-d">Socket ở <code>/chat</code> KHÔNG nhận emit ở <code>/</code>. Middleware chạy riêng. Rooms tách biệt (thread:42 ở /chat khác thread:42 ở /admin).</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">CHUNG engine.io connection</span><span class="lz-d">Client mở <code>io(url)</code> và <code>io(url + &#39;/admin&#39;)</code> chia sẻ MỘT WebSocket. Namespace là routing ở tầng 3, không phải kết nối mới.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">MỖI namespace có sid riêng</span><span class="lz-d">Trong khi engine.io sid chung, socket.io sid ở <code>/chat</code> khác ở <code>/admin</code>. Đây là chuyện hai sid mà bài 0.3 đã đo.</span></div>
</div>

<h3>Khi nào bạn CẦN namespace</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">admin panel với auth khác</span><span class="lz-nsub">/admin namespace</span></span>
<span class="lz-nbody">User thường auth JWT. Admin auth session cookie khác. Middleware khác nhau ở <code>/</code> vs <code>/admin</code> — tách namespace cho middleware chạy đúng.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">multi-tenant SaaS</span><span class="lz-nsub">/tenant/:id namespace</span></span>
<span class="lz-nbody">Data mỗi tenant tách biệt hoàn toàn. Emit ở tenant A KHÔNG được đến tenant B ngay cả khi bug code. Namespace là bức tường cứng.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">chia mã theo team</span><span class="lz-nsub">/notifications, /messaging</span></span>
<span class="lz-nbody">Đội notifications không cần biết event của messaging. Namespace ép chúng KHÔNG lỗi vô ý gọi lẫn nhau.</span>
</div>
</div>

<h3>Kho này KHÔNG dùng — vì sao</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">chỉ có một auth</span><span class="lz-lnote">Cả admin và user đều dùng JWT. Cùng middleware, cùng logic. Namespace chỉ thêm complexity không giá trị</span></div>
<div class="lz-layer"><span class="lz-lname">room đã đủ để phân chia</span><span class="lz-lnote">Feature khác nhau (chat, calls, listen, devices) dùng room prefix khác nhau — không thấy tương tác vì họ không share room. Rẻ hơn namespace</span></div>
<div class="lz-layer"><span class="lz-lname">testing đơn giản hơn</span><span class="lz-lnote">Test một namespace = test cả socket.io setup. Nhiều namespace = phải setup mỗi cái với client riêng. Với 5 gateway của kho này, đó là 5× thêm test infrastructure</span></div>
</div>

<div class="callout warn">
<p><strong>Đừng tạo namespace &quot;để tách feature&quot;.</strong> Đó là công việc của room + prefix event name. <code>chat:message</code> vs <code>call:offer</code> là đủ. Namespace là quyết định kiến trúc lớn, không phải organizational sugar.</p>
</div>

<h3>Dynamic namespace — bug tinh vi</h3>
<pre><code class="language-ts">// tao dong theo pattern
const nsp = io.of(/^\\/tenant-\\d+$/);
nsp.on('connection', s =&gt; console.log('tenant socket:', s.nsp.name));

// client
const c = io('http://example.com/tenant-42');
</code></pre>

<p>Có thể — nhưng khi <code>/tenant-42</code> tạo, MẶC ĐỊNH namespace không bị xoá khi tất cả socket rời — nó nằm lại trong memory. Với 10.000 tenant, đó là 10.000 namespace tồn đọng: memory leak dễ tạo bằng dynamic namespace. <strong>Đính chính theo đo thật:</strong> từ socket.io 4.6.0, tuỳ chọn server <code>cleanupEmptyChildNamespaces: true</code> xoá namespace con khi socket cuối rời (2.000 tenant rời hết: mặc định còn 2.001 namespace, bật tuỳ chọn còn 1 — xem bên dưới).</p>

<div class="pitfall">
<p><strong>Bẫy — dùng namespace như collection name.</strong> Ai đó thấy <code>io.of(&#39;/thread-42&#39;)</code> nghe hợp lý. KHÔNG. Đó là chỗ dùng ROOM (<code>io.to(&#39;thread:42&#39;)</code>). Namespace là cho tách biệt kiến trúc; room là cho routing per-event. Nhầm hai cái = mã sau nghẽn.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Namespace tách biệt cấp connection (mỗi cái có middleware + sid + rooms tách biệt) và kho này KHÔNG dùng vì tất cả features share JWT auth + room prefix đã đủ tách feature — chỉ tạo namespace khi bạn thật sự cần bức tường cứng (auth khác, multi-tenant, hay chia theo team), và tránh dynamic namespace trừ khi bật <code>cleanupEmptyChildNamespaces</code> — mặc định chúng không được cleanup.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Tạo một namespace thứ hai bằng <code>io.of('/admin')</code> và cho nó middleware riêng; xác nhận sid và room của nó tách khỏi namespace mặc định.</li>
<li>Đạt cùng sự tách đó trên namespace mặc định bằng một room prefix (<code>admin:</code>) — đúng cách kho này dựa vào.</li>
<li>Tạo một dynamic namespace (tên dạng regex/hàm) và cho thấy mặc định nó không được cleanup — rồi bật <code>cleanupEmptyChildNamespaces</code> và đếm lại.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn nêu được một lý do thật để thêm một namespace và vì sao kho này tránh chúng.</p></div>

<h3>🔬 Đo thật: cái gì tách, cái gì chung</h3>
<p>socket.io 4.8.3, Node 22, một server có <code>'/'</code> và <code>'/admin'</code>, mỗi bên một middleware; mỗi namespace một client, cả hai join <code>thread:42</code>:</p>
<div class="out">$ node ns.mjs
  middleware '/'      chạy cho /
  [/] connection · socket.id=PmTj3P… · engine sid=_9-64N…
  middleware '/admin' chạy cho /admin
  [/admin] connection · socket.id=7XkdbU… · engine sid=_9-64N…
— hai socket, mấy đường ống? —
goc.io === ad.io (cùng Manager)      → true
engine.id của hai socket            → _9-64N… · _9-64N…
socket.id của hai socket            → PmTj3P… · 7XkdbU…
— emit có vượt namespace không? —
io.emit (namespace '/')             → goc 1 · admin 0
io.to('thread:42') ở '/'            → goc 2 · admin 0
admin.to('thread:42')               → goc 2 · admin 1
thread:42 ở '/' có 1 socket · ở '/admin' có 1 socket — hai Map khác nhau
— namespace không ai khai báo —
io(url + "/khong-co")               → connect_error "Invalid namespace"</div>
<p><strong>Trong Chromium thật</strong> — một trang mở <code>io()</code> và <code>io('/admin')</code>. DevTools chỉ có MỘT WebSocket; namespace là tiền tố trong gói:</p>
<div class="out">↓ 0{"sid":"ibMhTXtR3ldVvYl_AAAA","upgrades":[],"pingInterval":25000,"pingTimeout":20000,"maxPayload":1000000}   (53 ms)
↑ 40   (53 ms)
↑ 40/admin,   (53 ms)
↓ 40{"sid":"RgCTHU4LlURIlj1xAAAA"}   (54 ms)
↓ 40/admin,{"sid":"cnxShtO9ytUOnvgKAAAB"}   (54 ms)
↓ 42["chao","từ /"]   (456 ms)
↓ 42/admin,["chao","từ /admin"]   (657 ms)</div>
<p><strong>Namespace động</strong> — 2.000 tenant nối vào rồi rời hết, mặc định vs <code>cleanupEmptyChildNamespaces: true</code>:</p>
<div class="out">$ node --expose-gc dong.mjs
mặc định · lúc đầu: 1 namespace · heap 8.7 MB
  sau 500 tenant (đã rời hết): 501 namespace · heap 14.1 MB
  sau 1000 tenant (đã rời hết): 1001 namespace · heap 15.0 MB
  sau 1500 tenant (đã rời hết): 1501 namespace · heap 15.9 MB
  sau 2000 tenant (đã rời hết): 2001 namespace · heap 15.7 MB
$ node --expose-gc dong.mjs don
cleanupEmptyChildNamespaces: true · lúc đầu: 1 namespace · heap 8.7 MB
  sau 500 tenant (đã rời hết): 1 namespace · heap 13.4 MB
  sau 1000 tenant (đã rời hết): 1 namespace · heap 13.7 MB
  sau 1500 tenant (đã rời hết): 1 namespace · heap 13.8 MB
  sau 2000 tenant (đã rời hết): 1 namespace · heap 12.9 MB</div>
<p><strong>Kho này</strong> — namespace và kích thước gateway:</p>
<div class="out"># Kho này: có namespace nào không? Và gateway dài bao nhiêu?
$ grep -rn "io.of(\\|\\.of('/" src --include='*.ts' | wc -l
       0
$ wc -l src/socket/*.ts | grep -v test
     281 src/socket/call.socket.ts
    1113 src/socket/device.gateway.ts
     680 src/socket/doiKhang.socket.ts
     362 src/socket/listen-together.ts
     614 src/socket/messaging.socket.ts
     300 src/socket/notes-collaboration.gateway.ts
     410 src/socket/work-docs-collaboration.gateway.ts
     175 src/socket/work.socket.ts
    3935 total</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-javascript"><span class="tok-comment">// Hai namespace trên MỘT server: '/' và '/admin' — middleware, sid, room có tách nhau không? Có chung đường ống không?</span>
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const io = new Server(19610);
const admin = io.of('/admin');
io.use((s, next) =&gt; { console.log(&#96;  middleware '/'      chạy cho \${s.nsp.name}&#96;); next(); });
admin.use((s, next) =&gt; { console.log(&#96;  middleware '/admin' chạy cho \${s.nsp.name}&#96;); next(); });
const log = (ten) =&gt; (s) =&gt; { s.join('thread:42'); s.on('ping-thu', () =&gt; {}); console.log(&#96;  [\${ten}] connection · socket.id=\${s.id.slice(0, 6)}… · engine sid=\${s.conn.id.slice(0, 6)}…&#96;); };
io.on('connection', log('/'));
admin.on('connection', log('/admin'));

const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
const goc = ketNoi('http://localhost:19610');
const ad = ketNoi('http://localhost:19610/admin');
await cho(500);
console.log('— hai socket, mấy đường ống? —');
console.log(&#96;goc.io === ad.io (cùng Manager)      → \${goc.io === ad.io}&#96;);
console.log(&#96;engine.id của hai socket            → \${goc.io.engine.id.slice(0, 6)}… · \${ad.io.engine.id.slice(0, 6)}…&#96;);
console.log(&#96;socket.id của hai socket            → \${goc.id.slice(0, 6)}… · \${ad.id.slice(0, 6)}…&#96;);
console.log('— emit có vượt namespace không? —');
let nGoc = 0, nAd = 0; goc.on('tin', () =&gt; nGoc++); ad.on('tin', () =&gt; nAd++);
io.emit('tin'); await cho(200);                       console.log(&#96;io.emit (namespace '/')             → goc \${nGoc} · admin \${nAd}&#96;);
io.to('thread:42').emit('tin'); await cho(200);       console.log(&#96;io.to('thread:42') ở '/'            → goc \${nGoc} · admin \${nAd}&#96;);
admin.to('thread:42').emit('tin'); await cho(200);    console.log(&#96;admin.to('thread:42')               → goc \${nGoc} · admin \${nAd}&#96;);
console.log(&#96;thread:42 ở '/' có \${io.sockets.adapter.rooms.get('thread:42').size} socket · ở '/admin' có \${admin.adapter.rooms.get('thread:42').size} socket — hai Map khác nhau&#96;);
console.log('— namespace không ai khai báo —');
const la = ketNoi('http://localhost:19610/khong-co', { reconnection: false });
console.log('io(url + "/khong-co")               →', await new Promise((r) =&gt; { la.on('connect', () =&gt; r('connect')); la.on('connect_error', (e) =&gt; r(&#96;connect_error "\${e.message}"&#96;)); }));
process.exit(0);</code></pre>
<pre><code class="language-javascript"><span class="tok-comment">// Dynamic namespace: 2.000 tenant kết nối rồi rời hết — namespace có được dọn không? Mặc định vs cleanupEmptyChildNamespaces: true</span>
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const don = process.argv[2] === 'don';
const io = new Server(19612, don ? { cleanupEmptyChildNamespaces: true } : {});
io.of(/^\\/tenant-\\d+$/).on('connection', () =&gt; {});
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
const mb = () =&gt; (process.memoryUsage().heapUsed / 1048576).toFixed(1);
global.gc?.(); console.log(&#96;\${don ? 'cleanupEmptyChildNamespaces: true' : 'mặc định'} · lúc đầu: \${io._nsps.size} namespace · heap \${mb()} MB&#96;);
for (let lo = 0; lo &lt; 4; lo++) {
  const cs = [];
  for (let i = 0; i &lt; 500; i++) cs.push(ketNoi(&#96;http://localhost:19612/tenant-\${lo * 500 + i}&#96;, { transports: ['websocket'], forceNew: true }));
  await Promise.all(cs.map((c) =&gt; new Promise((r) =&gt; c.on('connect', r))));
  cs.forEach((c) =&gt; c.close()); await cho(400);
  global.gc?.(); console.log(&#96;  sau \${(lo + 1) * 500} tenant (đã rời hết): \${io._nsps.size} namespace · heap \${mb()} MB&#96;);
}
process.exit(0);</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-9-4-nhieu-tenant" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Authentication · 9.4 — Nhiều tenant: cái ranh giới KHÔNG BAO GIỜ được rò</span><span class="lc-sub">Bức tường cứng mà namespace theo tenant nhắm tới</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/observability-monitoring/learn?lessonSlug=obs-5-2-bo-nho" target="_blank" rel="noopener"><span class="lc-ico">📈</span><span class="lc-body"><span class="lc-title">Observability · 5.2 — RSS, heap, external: con số nào mới là chỗ rò rỉ</span><span class="lc-sub">Đọc số nào để biết namespace tồn đọng có rò thật</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Namespace</span><span class="v">Tách biệt cấp connection: middleware, sid và room riêng.</span></div>
  <div class="kv"><span class="k"><code>io.of('/name')</code></span><span class="v">Tạo hoặc truy cập một namespace.</span></div>
  <div class="kv"><span class="k">Namespace mặc định (<code>/</code>)</span><span class="v">Nơi mọi tính năng của kho này sống.</span></div>
  <div class="kv"><span class="k">Room prefix vs namespace</span><span class="v">Một prefix tách feature mà không cần bức tường cứng.</span></div>
  <div class="kv"><span class="k">Bức tường cứng</span><span class="v">Auth khác, multi-tenant hay chia team — các ca biện minh cho một namespace.</span></div>
  <div class="kv"><span class="k">Dynamic namespace</span><span class="v">Tạo theo nhu cầu; mặc định không cleanup — bật cleanupEmptyChildNamespaces.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Namespace tách biệt ở cấp connection — mỗi cái có middleware, sid và room riêng.</li><li>Kho này không dùng chúng: mọi feature share JWT auth và room prefix đã tách feature.</li><li>Chỉ tạo namespace cho một bức tường cứng thật sự: auth khác, multi-tenant, hoặc chia team.</li><li>Dynamic namespace mặc định không được cleanup và leak — bật cleanupEmptyChildNamespaces (4.6+).</li><li>Room prefix là công cụ nhẹ hơn để tách feature.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Namespaces</span><span class="lc-sub">socket.io/docs/v4/namespaces — API chuẩn, đặc biệt phần &quot;dynamic namespaces&quot; nói rõ hạn chế.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Bài 3.1 — Rooms</span><span class="lc-sub">/courses/socket-io/learn${REF} — cái mà 90% người dùng namespace thật ra CẦN.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 3.3 ─────────────────────────── */
    {
      title: '3.3 — Room lifecycle: create, join, leave, cleanup|||3.3 — Vòng đời room: tạo, join, leave, cleanup',
      slug: 'io-3-3-room-lifecycle',
      type: 'VIDEO',
      description: 'Room tự tạo khi socket đầu tiên join, tự huỷ khi socket cuối rời — không cần khai. Với ephemeral room (listen-together), điều đó là bug: room mất khi host disconnect.',
      content: `
${G03_3}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>Room lifecycle: create, join, leave, cleanup</h2>
<p class="lead">You never write &quot;<code>io.createRoom(name)</code>&quot;. The room comes into being the moment a socket joins it, and vanishes when the last socket leaves. That&#39;s elegant for chat threads (data lives in DB) but surprising for ephemeral rooms (listen-together) where the room IS the data.</p>

<h3>Lifecycle diagram</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">socket.join(&#39;X&#39;)</span><span class="lz-d">Room &#39;X&#39; appears in <code>io.sockets.adapter.rooms</code>. No prior declaration is needed; the adapter creates a Set to hold this sid on its own.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">several sockets join &#39;X&#39;</span><span class="lz-d">Set trong adapter grow. <code>io.to(&#39;X&#39;).emit(...)</code> reaches all of them. Emit order is FIFO — but NOT strictly guaranteed across sockets (the adapter picks sockets by Set iteration order).</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">socket.leave(&#39;X&#39;) or a disconnect</span><span class="lz-d">The sid is removed from the Set. If the Set becomes empty, the adapter drops the room from the Map. <em>Measured on 4.8.3: the adapter DOES announce it</em> — <code>io.of(&#39;/&#39;).adapter.on(&#39;delete-room&#39;, room =&gt; …)</code> fires right after the last leave (also <code>create-room</code>, <code>join-room</code>, <code>leave-room</code>). The web text used to say no event fires — that was wrong.</span></div>
</div>

<h3>Ephemeral rooms: the listen-together bug pattern</h3>
<pre><code class="language-ts">// illustration (simplified) — the real src/socket/listen-together.ts keeps a Map &#96;rooms&#96;
// and cleans it in its own disconnect handler (line 338) + finalizeLeave (rooms.delete, lines 175/182)
socket.on('listen:create', async ({ track }, ack) =&gt; {
  const roomId = generateId();
  socket.join(&#96;listen:\${roomId}&#96;);
  hostBySid.set(&#96;listen:\${roomId}&#96;, socket.id);
  hostState.set(roomId, { track, isPlaying: true, positionSec: 0 });
  ack({ roomId, hostId: socket.data.userId });
});

// KHI host disconnect:
socket.on('disconnect', () =&gt; {
  // socket tu dong leave TAT CA room
  // nhung STATE trong hostState, hostBySid van con → leak
});
</code></pre>

<div class="callout warn">
<p><strong>The room cleans itself up; YOUR STATE does not.</strong> The adapter removes <code>listen:xyz</code> from the rooms Map. But <code>hostState.get(xyz)</code> still holds its entry. After 1,000 host disconnects you have 1,000 pieces of garbage. The fix: hook disconnect and clean up by hand.</p>
</div>

<h3>The correct cleanup pattern</h3>
<pre><code class="language-ts">socket.on('disconnect', async () =&gt; {
  // find rooms this socket owned (host)
  const hostedRooms = [...hostBySid.entries()]
    .filter(([room, sid]) =&gt; sid === socket.id)
    .map(([room]) =&gt; room);
  
  for (const room of hostedRooms) {
    // bao members roi truoc khi xoa
    io.to(room).emit('listen:closed', { reason: 'host-left' });
    
    // force everyone to leave (adapter tu xoa room)
    const sockets = await io.in(room).fetchSockets();
    for (const s of sockets) s.leave(room);
    
    // cleanup state
    hostBySid.delete(room);
    hostState.delete(room.replace('listen:', ''));
  }
});
</code></pre>

<h3>Who has joined — the visible map is</h3>
<pre><code class="language-ts">// TAT CA rooms cua adapter (bao gom cac room mang sid)
const allRooms = io.sockets.adapter.rooms;
// Map&lt;roomName, Set&lt;socketId&gt;&gt;

// LOC ra chi rooms tuy bien (khac sid)
const customRooms = [...allRooms.entries()]
  .filter(([name]) =&gt; !io.sockets.sockets.has(name));   // room ma name khong phai la sid
</code></pre>

<div class="pitfall">
<p><strong>Trap — calling leave() and expecting an earlier emit not to arrive.</strong> <code>leave()</code> synchronous, but packets <code>emit</code> already queued in the I/O buffer are still sent. If you <code>emit('X', data); socket.leave('Y')</code> on a socket that is also in Y, the packet still reaches that socket. Not a bug — a race between the I/O flush and your synchronous code.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> A room is created on the first join and destroyed on the last leave — the adapter announces it with <code>delete-room</code>, but it does NOT clean your own state (<code>hostBySid</code>, <code>hostState</code>) must be cleaned up manually in the <code>disconnect</code>/<code>leave</code> handler or on <code>delete-room</code>, otherwise it leaks a little more with every abandoned ephemeral room.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Join a room and inspect <code>io.sockets.adapter.rooms</code> to watch it appear; leave, and watch it vanish on the LAST leave.</li>
<li>Listen to the adapter&#39;s <code>create-room</code> / <code>delete-room</code> events and watch them fire at the first join and the last leave.</li>
<li>Add manual cleanup of your own side state (<code>hostBySid</code>, <code>hostState</code>) in the <code>disconnect</code> or <code>leave</code> handler and verify it no longer leaks.</li>
</ol>
<p><strong>Done when:</strong> you have seen a room auto-create and auto-destroy and have cleaned up your own side state by hand.</p></div>

<h3>🔬 Measured: the lifecycle, and the adapter's events</h3>
<p>socket.io 4.8.3, Node 22 — two sockets join and leave room <code>X</code>, with listeners on all four adapter events:</p>
<div class="out">$ node vong.mjs
    adapter: create-room &lt;sid CmO9…&gt;
    adapter: join-room   &lt;sid CmO9…&gt;
    adapter: create-room &lt;sid Ekrk…&gt;
    adapter: join-room   &lt;sid Ekrk…&gt;
— s1.join(X) —
    adapter: create-room 'X'
    adapter: join-room   'X' · CmO9…
  rooms có 'X'? CÓ (1 socket)
— s2.join(X) —
    adapter: join-room   'X' · Ekrk…
  rooms có 'X'? CÓ (2 socket)
  adapter.rooms (mọi khoá): &lt;sid CmO9…&gt; &lt;sid Ekrk…&gt; 'X'
  chỉ room tự đặt (lọc bỏ sid): 'X'
— s1.leave(X) —
    adapter: leave-room  'X' · CmO9…
  rooms có 'X'? CÓ (1 socket)
— s2.leave(X) — người cuối —
    adapter: leave-room  'X' · Ekrk…
    adapter: delete-room 'X'
  rooms có 'X'? KHÔNG
— s1 disconnect (rời MỌI room, kể cả room mang sid) —
    adapter: leave-room  &lt;sid CmO9…&gt;
    adapter: delete-room &lt;sid CmO9…&gt;</div>
<p><strong>1,000 temporary rooms</strong> — each host creates a <code>listen:&lt;id&gt;</code> room and an entry in a side Map, then leaves. Forgot cleanup vs cleanup on <code>disconnect</code> vs cleanup on <code>delete-room</code>:</p>
<div class="out">$ node ro.mjs quen
quen        sau 500 host rời: room listen: còn 0 · hostState còn 500
quen        sau 1000 host rời: room listen: còn 0 · hostState còn 1000
$ node ro.mjs disconnect
disconnect  sau 500 host rời: room listen: còn 0 · hostState còn 0
disconnect  sau 1000 host rời: room listen: còn 0 · hostState còn 0
$ node ro.mjs delete-room
delete-room sau 500 host rời: room listen: còn 0 · hostState còn 0
delete-room sau 1000 host rời: room listen: còn 0 · hostState còn 0</div>
<p><strong>leave() after an emit</strong> (A: emit then leave · B: leave then emit):</p>
<div class="out">$ node leave.mjs
client nhận: ["A: emit rồi leave"]</div>
<p><strong>No cap</strong> — one socket, 100,000 rooms; and this repo's incident:</p>
<div class="out">$ node --expose-gc nhieu.mjs
1 socket · socket.rooms.size = 100001 · adapter.rooms.size = 100001 · heap +23.6 MB
sau disconnect: adapter.rooms.size = 0 · heap còn +0.1 MB</div>
<div class="out"># Kho này: sự cố e9ed78dc6 (01/11/2026) — trần "500 room post:" đếm theo LƯỢT gọi chứ không theo socket
$ git show -s --format='%h %ad %s' --date=short e9ed78dc6
e9ed78dc6 2026-11-01 fix(socket): trần 500 phòng post:&lt;id&gt; tính theo MỖI SOCKET thay vì mỗi lượt post:subscribe — gọi lặp từng cho một socket vào 100.
$ grep -n "for (const r of socket.rooms) if (r.startsWith('post:'))" src/socket/messaging.socket.ts
603: for (const r of socket.rooms) if (r.startsWith('post:')) joined += 1;
# listen-together.ts THẬT: state riêng (Map rooms) được dọn ở handler disconnect của chính nó + finalizeLeave
$ grep -nE "socket.on\\('disconnect'|rooms.delete\\(" src/socket/listen-together.ts
175: rooms.delete(room.id);
182: if (room.members.size === 0) rooms.delete(room.id);
338: socket.on('disconnect', () =&gt; {</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-javascript"><span class="tok-comment">// Vòng đời room 'X': tạo lúc join ĐẦU, xoá lúc leave CUỐI — và adapter CÓ phát event cho từng bước</span>
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const io = new Server(19620);
const ad = io.of('/').adapter;
const ten = (r) =&gt; (io.sockets.sockets.has(r) ? &#96;&lt;sid \${r.slice(0, 4)}…&gt;&#96; : &#96;'\${r}'&#96;);
for (const ev of ['create-room', 'delete-room', 'join-room', 'leave-room'])
  ad.on(ev, (room, id) =&gt; console.log(&#96;    adapter: \${ev.padEnd(11)} \${ten(room)}\${id &amp;&amp; id !== room ? &#96; · \${id.slice(0, 4)}…&#96; : ''}&#96;));
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
const vao = () =&gt; new Promise((r) =&gt; { const c = ketNoi('http://localhost:19620', { transports: ['websocket'] }); c.on('connect', () =&gt; r(c)); });
const co = () =&gt; &#96;rooms có 'X'? \${ad.rooms.has('X') ? &#96;CÓ (\${ad.rooms.get('X').size} socket)&#96; : 'KHÔNG'}&#96;;
const c1 = await vao(); const c2 = await vao(); await cho(100);
const [s1, s2] = [...io.sockets.sockets.values()];
console.log('— s1.join(X) —');  s1.join('X'); console.log('  ' + co());
console.log('— s2.join(X) —');  s2.join('X'); console.log('  ' + co());
console.log('  adapter.rooms (mọi khoá):', [...ad.rooms.keys()].map(ten).join(' '));
console.log('  chỉ room tự đặt (lọc bỏ sid):', [...ad.rooms.keys()].filter((r) =&gt; !io.sockets.sockets.has(r)).map(ten).join(' '));
console.log('— s1.leave(X) —'); s1.leave('X'); console.log('  ' + co());
console.log('— s2.leave(X) — người cuối —'); s2.leave('X'); console.log('  ' + co());
console.log('— s1 disconnect (rời MỌI room, kể cả room mang sid) —'); c1.close(); await cho(200);
process.exit(0);</code></pre>
<pre><code class="language-javascript"><span class="tok-comment">// Phòng nghe chung tạm (kiểu listen:&lt;id&gt;): room TỰ dọn, Map state của BẠN thì không — 1.000 host vào rồi rời</span>
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const cach = process.argv[2] ?? 'quen';         <span class="tok-comment">  // quen | disconnect | delete-room</span>
const io = new Server(19621);
const hostState = new Map();                   <span class="tok-comment">  // roomId → { track, host, ... } — "side state" của bạn</span>
io.on('connection', (s) =&gt; {
  s.on('listen:create', (ack) =&gt; {
    const id = Math.random().toString(36).slice(2, 8);
    s.join(&#96;listen:\${id}&#96;);
    hostState.set(id, { host: s.id, track: 'x'.repeat(2000), members: [s.id] });
    ack(id);
  });
  if (cach === 'disconnect') s.on('disconnect', () =&gt; { for (const [id, st] of hostState) if (st.host === s.id) hostState.delete(id); });
});
if (cach === 'delete-room') io.of('/').adapter.on('delete-room', (room) =&gt; { if (room.startsWith('listen:')) hostState.delete(room.slice(7)); });
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
for (let lo = 0; lo &lt; 2; lo++) {
  const cs = await Promise.all(Array.from({ length: 500 }, () =&gt; new Promise((r) =&gt; { const c = ketNoi('http://localhost:19621', { transports: ['websocket'], forceNew: true }); c.on('connect', () =&gt; c.emit('listen:create', () =&gt; r(c))); })));
  cs.forEach((c) =&gt; c.close()); await cho(500);
  const phong = [...io.of('/').adapter.rooms.keys()].filter((r) =&gt; r.startsWith('listen:')).length;
  console.log(&#96;\${cach.padEnd(11)} sau \${(lo + 1) * 500} host rời: room listen: còn \${phong} · hostState còn \${hostState.size}&#96;);
}
process.exit(0);</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-2-ws-vs-socketio-rooms" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 11.2 — ws or Socket.IO: the price of convenience</span><span class="lc-sub">Where the 100,000-room bug of this repo was found</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-4-1-use-effect" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 4.1 — useEffect, dependencies and cleanup</span><span class="lc-sub">Leave the room when the screen closes: the client side of cleanup</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Room create</span><span class="v">Happens implicitly on the first join.</span></div>
  <div class="kv"><span class="k">Room destroy</span><span class="v">Happens implicitly on the last leave.</span></div>
  <div class="kv"><span class="k">delete-room event</span><span class="v">The adapter announces a room&#39;s deletion (and create/join/leave) — per worker.</span></div>
  <div class="kv"><span class="k">Side state</span><span class="v">Your own maps (<code>hostBySid</code>, <code>hostState</code>) keyed on room or sid.</span></div>
  <div class="kv"><span class="k">Manual cleanup</span><span class="v">Remove side state in <code>disconnect</code>/<code>leave</code> or it leaks.</span></div>
  <div class="kv"><span class="k">Ephemeral room</span><span class="v">A short-lived room abandoned when everyone leaves.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A room is created on the first join and destroyed on the last leave.</li><li>The adapter announces it (<code>delete-room</code>) — but it never cleans YOUR state.</li><li>Any side state you keep per room must be cleaned up by hand.</li><li>Do it in the <code>disconnect</code>/<code>leave</code> handler, or on <code>delete-room</code>.</li><li>Skip it and each abandoned ephemeral room leaks a little more memory.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Adapter</span><span class="lc-sub">socket.io/docs/v4/adapter — cách rooms Map được quản lý.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 4 — presence and O(N²)</span><span class="lc-sub">/courses/socket-io/learn${REF} — cleanup room + presence tương tự nhưng ở quy mô lớn.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Vòng đời room: tạo, join, leave, cleanup</h2>
<p class="lead">Bạn không bao giờ viết &quot;<code>io.createRoom(name)</code>&quot;. Room hình thành ngay khoảnh khắc socket đầu tiên join, và biến mất khi socket cuối rời. Điều này thanh nhã cho chat thread (data ở DB) nhưng bất ngờ cho ephemeral room (listen-together) nơi room CHÍNH LÀ data.</p>

<h3>Sơ đồ vòng đời</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">socket.join(&#39;X&#39;)</span><span class="lz-d">Room &#39;X&#39; xuất hiện trong <code>io.sockets.adapter.rooms</code>. Không cần khai báo trước; adapter tự tạo Set để chứa sid này.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">nhiều socket cùng join &#39;X&#39;</span><span class="lz-d">Set trong adapter grow. <code>io.to(&#39;X&#39;).emit(...)</code> đến tất. Order emit trong FIFO — nhưng KHÔNG đảm bảo strict cross-socket (adapter chọn socket theo Set iteration).</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">socket.leave(&#39;X&#39;) hoặc disconnect</span><span class="lz-d">Sid xoá khỏi Set. Nếu Set rỗng, adapter xoá room khỏi Map. <em>Đo trên 4.8.3: adapter CÓ báo</em> — <code>io.of(&#39;/&#39;).adapter.on(&#39;delete-room&#39;, room =&gt; …)</code> phát ngay sau lần leave cuối (cùng <code>create-room</code>, <code>join-room</code>, <code>leave-room</code>). Bản cũ của bài ghi “không có event nào” — sai.</span></div>
</div>

<h3>Ephemeral room: kiểu bug của listen-together</h3>
<pre><code class="language-ts">// minh hoa (don gian hoa) — tep that src/socket/listen-together.ts giu Map &#96;rooms&#96;
// va don no o handler disconnect rieng (dong 338) + finalizeLeave (rooms.delete, dong 175/182)
socket.on('listen:create', async ({ track }, ack) =&gt; {
  const roomId = generateId();
  socket.join(&#96;listen:\${roomId}&#96;);
  hostBySid.set(&#96;listen:\${roomId}&#96;, socket.id);
  hostState.set(roomId, { track, isPlaying: true, positionSec: 0 });
  ack({ roomId, hostId: socket.data.userId });
});

// KHI host disconnect:
socket.on('disconnect', () =&gt; {
  // socket tu dong leave TAT CA room
  // nhung STATE trong hostState, hostBySid van con → leak
});
</code></pre>

<div class="callout warn">
<p><strong>Room tự cleanup, STATE của bạn thì KHÔNG.</strong> Adapter xoá <code>listen:xyz</code> khỏi rooms Map. Nhưng <code>hostState.get(xyz)</code> vẫn có entry. Sau 1.000 host disconnect, bạn có 1.000 entry rác. Fix: hook disconnect và cleanup manual.</p>
</div>

<h3>Pattern cleanup đúng</h3>
<pre><code class="language-ts">socket.on('disconnect', async () =&gt; {
  // find rooms this socket owned (host)
  const hostedRooms = [...hostBySid.entries()]
    .filter(([room, sid]) =&gt; sid === socket.id)
    .map(([room]) =&gt; room);
  
  for (const room of hostedRooms) {
    // bao members roi truoc khi xoa
    io.to(room).emit('listen:closed', { reason: 'host-left' });
    
    // force everyone to leave (adapter tu xoa room)
    const sockets = await io.in(room).fetchSockets();
    for (const s of sockets) s.leave(room);
    
    // cleanup state
    hostBySid.delete(room);
    hostState.delete(room.replace('listen:', ''));
  }
});
</code></pre>

<h3>Ai đã join — bảng nhìn</h3>
<pre><code class="language-ts">// TAT CA rooms cua adapter (bao gom cac room mang sid)
const allRooms = io.sockets.adapter.rooms;
// Map&lt;roomName, Set&lt;socketId&gt;&gt;

// LOC ra chi rooms tuy bien (khac sid)
const customRooms = [...allRooms.entries()]
  .filter(([name]) =&gt; !io.sockets.sockets.has(name));   // room ma name khong phai la sid
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — leave() rồi expect emit trước đó không đến.</strong> <code>leave()</code> đồng bộ nhưng packet <code>emit</code> đã enqueue trong I/O buffer trước đó vẫn được gửi. Nếu bạn <code>emit(&#39;X&#39;, data); socket.leave(&#39;Y&#39;)</code> trên socket cũng ở Y, packet vẫn tới socket đó. Không phải bug — là race giữa I/O flush và code sync.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Room tự tạo lúc join đầu và tự xoá lúc leave cuối — adapter có báo bằng <code>delete-room</code>, nhưng KHÔNG dọn state của bạn, nên state tuỳ biến (<code>hostBySid</code>, <code>hostState</code>) phải được cleanup thủ công ở handler <code>disconnect</code>/<code>leave</code> hoặc ở <code>delete-room</code>, không thì leak dần theo mỗi ephemeral room bị bỏ.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Join một room và soi <code>io.sockets.adapter.rooms</code> để xem nó xuất hiện; leave, và xem nó biến mất ở lần leave CUỐI.</li>
<li>Nghe event <code>create-room</code> / <code>delete-room</code> của adapter và xem chúng phát ở lần join đầu và lần leave cuối.</li>
<li>Thêm cleanup thủ công cho side state của bạn (<code>hostBySid</code>, <code>hostState</code>) trong handler <code>disconnect</code> hoặc <code>leave</code> và xác nhận nó không còn leak.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đã thấy một room tự tạo và tự xoá và đã dọn side state của chính mình bằng tay.</p></div>

<h3>🔬 Đo thật: vòng đời, và các event của adapter</h3>
<p>socket.io 4.8.3, Node 22 — hai socket join rồi leave room <code>X</code>, có nghe cả bốn event của adapter:</p>
<div class="out">$ node vong.mjs
    adapter: create-room &lt;sid CmO9…&gt;
    adapter: join-room   &lt;sid CmO9…&gt;
    adapter: create-room &lt;sid Ekrk…&gt;
    adapter: join-room   &lt;sid Ekrk…&gt;
— s1.join(X) —
    adapter: create-room 'X'
    adapter: join-room   'X' · CmO9…
  rooms có 'X'? CÓ (1 socket)
— s2.join(X) —
    adapter: join-room   'X' · Ekrk…
  rooms có 'X'? CÓ (2 socket)
  adapter.rooms (mọi khoá): &lt;sid CmO9…&gt; &lt;sid Ekrk…&gt; 'X'
  chỉ room tự đặt (lọc bỏ sid): 'X'
— s1.leave(X) —
    adapter: leave-room  'X' · CmO9…
  rooms có 'X'? CÓ (1 socket)
— s2.leave(X) — người cuối —
    adapter: leave-room  'X' · Ekrk…
    adapter: delete-room 'X'
  rooms có 'X'? KHÔNG
— s1 disconnect (rời MỌI room, kể cả room mang sid) —
    adapter: leave-room  &lt;sid CmO9…&gt;
    adapter: delete-room &lt;sid CmO9…&gt;</div>
<p><strong>1.000 phòng tạm</strong> — mỗi host tạo room <code>listen:&lt;id&gt;</code> và một mục trong Map riêng, rồi rời. Quên dọn vs dọn ở <code>disconnect</code> vs dọn ở <code>delete-room</code>:</p>
<div class="out">$ node ro.mjs quen
quen        sau 500 host rời: room listen: còn 0 · hostState còn 500
quen        sau 1000 host rời: room listen: còn 0 · hostState còn 1000
$ node ro.mjs disconnect
disconnect  sau 500 host rời: room listen: còn 0 · hostState còn 0
disconnect  sau 1000 host rời: room listen: còn 0 · hostState còn 0
$ node ro.mjs delete-room
delete-room sau 500 host rời: room listen: còn 0 · hostState còn 0
delete-room sau 1000 host rời: room listen: còn 0 · hostState còn 0</div>
<p><strong>leave() sau khi emit</strong> (A: emit rồi leave · B: leave rồi emit):</p>
<div class="out">$ node leave.mjs
client nhận: ["A: emit rồi leave"]</div>
<p><strong>Không có trần</strong> — một socket, 100.000 room; và sự cố của kho này:</p>
<div class="out">$ node --expose-gc nhieu.mjs
1 socket · socket.rooms.size = 100001 · adapter.rooms.size = 100001 · heap +23.6 MB
sau disconnect: adapter.rooms.size = 0 · heap còn +0.1 MB</div>
<div class="out"># Kho này: sự cố e9ed78dc6 (01/11/2026) — trần "500 room post:" đếm theo LƯỢT gọi chứ không theo socket
$ git show -s --format='%h %ad %s' --date=short e9ed78dc6
e9ed78dc6 2026-11-01 fix(socket): trần 500 phòng post:&lt;id&gt; tính theo MỖI SOCKET thay vì mỗi lượt post:subscribe — gọi lặp từng cho một socket vào 100.
$ grep -n "for (const r of socket.rooms) if (r.startsWith('post:'))" src/socket/messaging.socket.ts
603: for (const r of socket.rooms) if (r.startsWith('post:')) joined += 1;
# listen-together.ts THẬT: state riêng (Map rooms) được dọn ở handler disconnect của chính nó + finalizeLeave
$ grep -nE "socket.on\\('disconnect'|rooms.delete\\(" src/socket/listen-together.ts
175: rooms.delete(room.id);
182: if (room.members.size === 0) rooms.delete(room.id);
338: socket.on('disconnect', () =&gt; {</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-javascript"><span class="tok-comment">// Vòng đời room 'X': tạo lúc join ĐẦU, xoá lúc leave CUỐI — và adapter CÓ phát event cho từng bước</span>
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const io = new Server(19620);
const ad = io.of('/').adapter;
const ten = (r) =&gt; (io.sockets.sockets.has(r) ? &#96;&lt;sid \${r.slice(0, 4)}…&gt;&#96; : &#96;'\${r}'&#96;);
for (const ev of ['create-room', 'delete-room', 'join-room', 'leave-room'])
  ad.on(ev, (room, id) =&gt; console.log(&#96;    adapter: \${ev.padEnd(11)} \${ten(room)}\${id &amp;&amp; id !== room ? &#96; · \${id.slice(0, 4)}…&#96; : ''}&#96;));
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
const vao = () =&gt; new Promise((r) =&gt; { const c = ketNoi('http://localhost:19620', { transports: ['websocket'] }); c.on('connect', () =&gt; r(c)); });
const co = () =&gt; &#96;rooms có 'X'? \${ad.rooms.has('X') ? &#96;CÓ (\${ad.rooms.get('X').size} socket)&#96; : 'KHÔNG'}&#96;;
const c1 = await vao(); const c2 = await vao(); await cho(100);
const [s1, s2] = [...io.sockets.sockets.values()];
console.log('— s1.join(X) —');  s1.join('X'); console.log('  ' + co());
console.log('— s2.join(X) —');  s2.join('X'); console.log('  ' + co());
console.log('  adapter.rooms (mọi khoá):', [...ad.rooms.keys()].map(ten).join(' '));
console.log('  chỉ room tự đặt (lọc bỏ sid):', [...ad.rooms.keys()].filter((r) =&gt; !io.sockets.sockets.has(r)).map(ten).join(' '));
console.log('— s1.leave(X) —'); s1.leave('X'); console.log('  ' + co());
console.log('— s2.leave(X) — người cuối —'); s2.leave('X'); console.log('  ' + co());
console.log('— s1 disconnect (rời MỌI room, kể cả room mang sid) —'); c1.close(); await cho(200);
process.exit(0);</code></pre>
<pre><code class="language-javascript"><span class="tok-comment">// Phòng nghe chung tạm (kiểu listen:&lt;id&gt;): room TỰ dọn, Map state của BẠN thì không — 1.000 host vào rồi rời</span>
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const cach = process.argv[2] ?? 'quen';         <span class="tok-comment">  // quen | disconnect | delete-room</span>
const io = new Server(19621);
const hostState = new Map();                   <span class="tok-comment">  // roomId → { track, host, ... } — "side state" của bạn</span>
io.on('connection', (s) =&gt; {
  s.on('listen:create', (ack) =&gt; {
    const id = Math.random().toString(36).slice(2, 8);
    s.join(&#96;listen:\${id}&#96;);
    hostState.set(id, { host: s.id, track: 'x'.repeat(2000), members: [s.id] });
    ack(id);
  });
  if (cach === 'disconnect') s.on('disconnect', () =&gt; { for (const [id, st] of hostState) if (st.host === s.id) hostState.delete(id); });
});
if (cach === 'delete-room') io.of('/').adapter.on('delete-room', (room) =&gt; { if (room.startsWith('listen:')) hostState.delete(room.slice(7)); });
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
for (let lo = 0; lo &lt; 2; lo++) {
  const cs = await Promise.all(Array.from({ length: 500 }, () =&gt; new Promise((r) =&gt; { const c = ketNoi('http://localhost:19621', { transports: ['websocket'], forceNew: true }); c.on('connect', () =&gt; c.emit('listen:create', () =&gt; r(c))); })));
  cs.forEach((c) =&gt; c.close()); await cho(500);
  const phong = [...io.of('/').adapter.rooms.keys()].filter((r) =&gt; r.startsWith('listen:')).length;
  console.log(&#96;\${cach.padEnd(11)} sau \${(lo + 1) * 500} host rời: room listen: còn \${phong} · hostState còn \${hostState.size}&#96;);
}
process.exit(0);</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-2-ws-vs-socketio-rooms" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 11.2 — ws hay Socket.IO: cái giá của sự tiện nghi</span><span class="lc-sub">Nơi tìm ra lỗi 100.000 room của kho này</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-4-1-use-effect" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 4.1 — useEffect, dependency và cleanup</span><span class="lc-sub">Rời room khi đóng màn hình: phía client của việc dọn dẹp</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Tạo room</span><span class="v">Xảy ra ngầm ở lần join đầu tiên.</span></div>
  <div class="kv"><span class="k">Xoá room</span><span class="v">Xảy ra ngầm ở lần leave cuối cùng.</span></div>
  <div class="kv"><span class="k">Event delete-room</span><span class="v">Adapter báo khi một room bị xoá (và create/join/leave) — trong từng worker.</span></div>
  <div class="kv"><span class="k">Side state</span><span class="v">Các map của bạn (<code>hostBySid</code>, <code>hostState</code>) khoá theo room hoặc sid.</span></div>
  <div class="kv"><span class="k">Cleanup thủ công</span><span class="v">Gỡ side state trong <code>disconnect</code>/<code>leave</code> kẻo leak.</span></div>
  <div class="kv"><span class="k">Ephemeral room</span><span class="v">Một room ngắn hạn bị bỏ khi mọi người rời đi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Một room được tạo ở lần join đầu và xoá ở lần leave cuối.</li><li>Adapter có báo (<code>delete-room</code>) — nhưng không bao giờ dọn state CỦA BẠN.</li><li>Mọi side state bạn giữ theo room phải được dọn bằng tay.</li><li>Làm trong handler <code>disconnect</code>/<code>leave</code>, hoặc ở <code>delete-room</code>.</li><li>Bỏ qua thì mỗi ephemeral room bị bỏ leak thêm một chút bộ nhớ.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Adapter</span><span class="lc-sub">socket.io/docs/v4/adapter — cách rooms Map được quản lý.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 4 — presence O(N²)</span><span class="lc-sub">/courses/socket-io/learn${REF} — cleanup room + presence tương tự nhưng ở quy mô lớn.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 3.4 ─────────────────────────── */
    {
      title: '3.4 — Broadcast semantics: to, in, except, volatile|||3.4 — Ngữ nghĩa broadcast: to, in, except, volatile',
      slug: 'io-3-4-broadcast',
      type: 'VIDEO',
      description: '`io.to()` chọn thêm; `io.in()` là alias; `.except()` loại trừ; `.volatile` bỏ nếu chậm. Chọn đúng cho từng tình huống.',
      content: `
${G03_4}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>Broadcast semantics: to, in, except, volatile</h2>
<p class="lead">Four modifiers on <code>io</code> and <code>socket</code> change what &quot;emit&quot; means. Using the wrong one is the source of most &quot;users see stuff they shouldn&#39;t&quot; bugs.</p>

<h3>Six variants side-by-side</h3>
<pre><code class="language-ts">// 1. io.emit — ai cung nhan
io.emit('global', data);                               // MOI socket, moi noi
// dung khi: broadcast toan he thong (maintenance ann.)

// 2. io.to(room).emit — chi trong room
io.to('thread:42').emit('msg', data);                  // moi socket trong thread:42
io.to(['A', 'B']).emit('x', ...);                      // UNION: A OR B

// 3. io.to(A).to(B).emit — UNION (giong to([A, B]))
io.to('thread:42').to('user:7').emit('personal', d);   // o A HOAC B, moi socket 1 lan

// 4. socket.emit — chi client dang giu socket nay
socket.emit('reply', data);                            // dua nay, con moi tab khac cua cung user KHONG

// 5. socket.to(room).emit — the room except this socket
socket.to('thread:42').emit('typing', ...);            // MOI TRONG thread:42 TRU chinh socket

// 6. socket.broadcast.emit — every OTHER socket (equivalent to socket.to(chatnamespace))
socket.broadcast.emit('user-joined', ...);             // moi ai khac ngoai chinh minh
</code></pre>

<div class="callout warn">
<p><strong>What separates <code>io.to</code> and <code>socket.to</code>: <code>socket.to</code> EXCLUDES this socket.</strong> The classic case: a typing indicator. The server receives <code>thread:typing</code> from user A and re-emits to the room — with <code>io.to(room).emit</code>, A receives it too and sees their own indicator. Use <code>socket.to(room).emit</code> to leave A out. <strong>Measured:</strong> it leaves out the sending <em>socket</em>, not the user — A&#39;s second tab still receives it; to exclude every tab of a user use <code>.except(&#39;user:&lt;id&gt;&#39;)</code>.</p>
</div>

<h3>except() — selective exclusion</h3>
<pre><code class="language-ts">// Broadcast tin nhan cho moi socket TRU cac client dang mute thread nay
const mutedSids = await getMutedSocketIds(threadId);
io.to(&#96;thread:\${threadId}&#96;).except(mutedSids).emit('msg', data);
</code></pre>

<h3>volatile — drop it if they are slow</h3>
<pre><code class="language-ts">// Cursor position update — neu client dang cham, bo qua goi nay
socket.volatile.emit('cursor', { x, y });

// KHONG dung volatile cho tin nhan quan trong — no de mat co dinh
socket.emit('chat:message', ...);
</code></pre>

<p><code>volatile</code> means: if the buffer is full (a slow client), the packet is DROPPED instead of queued. Use it only for high-frequency, low-value data (cursors, live scroll position, dashboard ticks). For a chat message or a notification, NEVER.</p>

<h3>timeout() and ack() — waiting for the client to answer</h3>
<pre><code class="language-ts">// Emit voi ack va timeout 3s
try {
  const response = await io.to('user:42').timeout(3000).emitWithAck('important', data);
  // response la mang tra ve tu MOI socket trong user:42
} catch (err) {
  // TIMEOUT — mot hoac nhieu socket khong tra loi
}
</code></pre>

<div class="callout">
<p><strong>Chapter 6 goes deep on acks.</strong> The point here is only that broadcast plus ack is not natural — with 100 clients in the room, you MUST handle an array of 100 responses.</p>
</div>

<h3>Six classic bugs from picking the wrong variant</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">tab loop</span><span class="lz-nsub">io.to thay socket.to</span></span>
<span class="lz-nbody">A user sends a message and sees it appear TWICE in their own tab — once from the optimistic UI, once echoed back by the server. Fix: <code>socket.to(room).emit</code>.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">stale event</span><span class="lz-nsub">an emit outlives the ack timeout</span></span>
<span class="lz-nbody">The user left the room before the emit arrived. The adapter did not fail — it simply did not reach them. The client sees &quot;the thread isn't updating&quot;. The only fix is a client-side re-fetch.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">cross-tenant leak</span><span class="lz-nsub">io.emit thay io.to</span></span>
<span class="lz-nbody">Using <code>io.emit</code> instead of <code>io.to(tenant)</code>. A serious bug — tenant A's data leaks into tenant B. In a multi-tenant app, NEVER <code>io.emit</code>.</span>
</div>
</div>

<div class="pitfall">
<p><strong>Trap — using <code>volatile.emit</code> for chat.</strong> Chat messages are rarely busy enough to fill the buffer — so the bug never shows up in dev. But when a user goes briefly offline (transport close), the server-side buffer fills and the next message is DROPPED. The chat loses it. <strong>Measured on 4.8.3 it is worse:</strong> volatile drops packets whenever the transport is busy writing, even on a healthy connection — 1,000 emits in one burst delivered 1 (websocket and polling).</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> <code>io.emit</code> reaches everyone, <code>io.to(room)</code> reaches a room, <code>io.to(A).to(B)</code> and <code>[A, B]</code> are both a union (no intersection operator), <code>socket.to</code> excludes the socket itself, <code>except(ids)</code> excludes a chosen set, <code>volatile</code> drops on slowness — and picking the wrong one always produces a bug that is very hard to spot in dev and blows up in production.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Compare three emits: <code>io.emit</code> (everyone), <code>io.to(room)</code> (the room), and <code>socket.to(room)</code> (the room EXCEPT the sender).</li>
<li>Use <code>except(ids)</code> to exclude a chosen set, and <code>io.to(A).to(B)</code> to confirm the union behaviour once more.</li>
<li>Send a <code>volatile</code> emit to a deliberately slow client and watch it be DROPPED rather than buffered.</li>
</ol>
<p><strong>Done when:</strong> you can predict exactly who receives each of emit / to / socket.to / except / volatile.</p></div>

<h3>🔬 Measured: who receives each emit</h3>
<p>socket.io 4.8.3, Node 22 — A1 and A2 are two tabs of user 7, B is user 9 (all three in <code>thread:42</code>), C is user 11 outside it. A1 sends:</p>
<div class="out">$ node ai.mjs
1 io.emit                                A1:1  A2:1  B:1  C:1
2 io.to('thread:42')                     A1:1  A2:1  B:1  C:0
3 io.to('thread:42').to('user:7')        A1:1  A2:1  B:1  C:0
4 socket.emit            (A1 gửi)        A1:1  A2:0  B:0  C:0
5 socket.to('thread:42') (A1 gửi)        A1:0  A2:1  B:1  C:0
6 socket.broadcast.emit  (A1 gửi)        A1:0  A2:1  B:1  C:1
7 io.to('thread:42').except('user:7')    A1:0  A2:0  B:1  C:0
8 io.to('thread:42').except(&lt;sid A2&gt;)    A1:1  A2:0  B:1  C:0</div>
<p><strong>The tab loop in a real Chromium</strong> — the tab sends <code>thread:typing</code>; the server re-emits with <code>io.to(room)</code>, then with <code>socket.to(room)</code>:</p>
<div class="out">↓ 0{"sid":"iCueu-yipGwQ-qUxAAAA","upgrades":[],"pingInterval":25000,"pingTimeout":20000,"maxPayload":1000000}   (30 ms)
↑ 40   (30 ms)
↓ 40{"sid":"OE1SWu_KNg9z02-ZAAAA"}   (31 ms)
↑ 42["thread:typing",{"kieu":"io"}]   (31 ms)
↓ 42["thread:typing",{"threadId":42,"user":"binh"}]   (32 ms)</div>
<div class="out">↓ 0{"sid":"PatVm1QMyiENrBbEAAAB","upgrades":[],"pingInterval":25000,"pingTimeout":20000,"maxPayload":1000000}   (24 ms)
↑ 40   (24 ms)
↓ 40{"sid":"FkufCPg-fLmneYNkAAAB"}   (24 ms)
↑ 42["thread:typing",{"kieu":"socket"}]   (24 ms)</div>
<p><strong>This repo, 14/10/2026 (8a87e3298)</strong> — two emits to overlapping rooms vs one emit with an array:</p>
<div class="out">$ node doi.mjs
— TRƯỚC (hai lượt emit) —
client nhận 2 lần tin id=1 · cách nhau 0.00 ms
— SAU (một lượt, mảng room: io.to(['thread:42', 'user:7'])) —
client nhận 1 lần tin id=2
$ grep -n "io?.to(rooms).emit" src/socket/messaging.socket.ts
159: // ⚠️ PHẢI là MỘT lượt &#96;emit&#96; với MẢNG phòng. Trước 14/10/2026 đây
170: io?.to(rooms).emit(event, payload);</div>
<p><strong>volatile</strong> — 1,000 emits in one burst:</p>
<div class="out">$ node vol.mjs
websocket · thường   · gửi 1000 ⇒ client nhận 1000
websocket · volatile · gửi 1000 ⇒ client nhận 1
polling   · thường   · gửi 1000 ⇒ client nhận 1000
polling   · volatile · gửi 1000 ⇒ client nhận 1</div>
<p><strong>Broadcast + ack</strong> — three tabs, one silent:</p>
<div class="out">$ node ack.mjs
callback sau 3.0 s · err = "operation has timed out" · responses = ["tab1 đã nhận","tab2 đã nhận"]
emitWithAck NÉM sau 3.0 s · "operation has timed out" — mất luôn 2 câu trả lời đã có</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-javascript"><span class="tok-comment">// Bốn socket: A1 + A2 = HAI TAB của user 7 · B = user 9 · ba socket đó ở thread:42 · C = user 11, KHÔNG ở thread:42.</span>
<span class="tok-comment">// A1 là người gửi. Mỗi biến thể emit ⇒ ai nhận (đếm thật ở client)?</span>
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const io = new Server(19630);
io.on('connection', (s) =&gt; { const { ten, user, thread } = s.handshake.auth; s.data.ten = ten; s.join(&#96;user:\${user}&#96;); if (thread) s.join('thread:42'); s.emit('san-sang'); });
const DS = [['A1', 7, true], ['A2', 7, true], ['B', 9, true], ['C', 11, false]];
const nhan = {};
await Promise.all(DS.map(([ten, user, thread]) =&gt; new Promise((r) =&gt; {
  const c = ketNoi('http://localhost:19630', { auth: { ten, user, thread }, transports: ['websocket'] });
  c.on('tin', () =&gt; nhan[ten].push('✓')); c.on('san-sang', r); nhan[ten] = [];
})));
const theo = (t) =&gt; [...io.sockets.sockets.values()].find((s) =&gt; s.data.ten === t);
const A1 = theo('A1');
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
const thu = async (nhanDe, phat) =&gt; { for (const k in nhan) nhan[k] = []; phat(); await cho(250);
  console.log(nhanDe.padEnd(40), DS.map(([t]) =&gt; &#96;\${t}:\${nhan[t].length}&#96;).join('  ')); };
await thu('1 io.emit', () =&gt; io.emit('tin'));
await thu("2 io.to('thread:42')", () =&gt; io.to('thread:42').emit('tin'));
await thu("3 io.to('thread:42').to('user:7')", () =&gt; io.to('thread:42').to('user:7').emit('tin'));
await thu('4 socket.emit            (A1 gửi)', () =&gt; A1.emit('tin'));
await thu("5 socket.to('thread:42') (A1 gửi)", () =&gt; A1.to('thread:42').emit('tin'));
await thu('6 socket.broadcast.emit  (A1 gửi)', () =&gt; A1.broadcast.emit('tin'));
await thu("7 io.to('thread:42').except('user:7')", () =&gt; io.to('thread:42').except('user:7').emit('tin'));
await thu("8 io.to('thread:42').except(&lt;sid A2&gt;)", () =&gt; io.to('thread:42').except(theo('A2').id).emit('tin'));
process.exit(0);</code></pre>
<pre><code class="language-javascript"><span class="tok-comment">// volatile: gói bị BỎ nếu transport chưa sẵn sàng ghi. Server bắn 1.000 emit liền một mạch, thường vs volatile, qua websocket rồi qua polling.</span>
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const io = new Server(19632);
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
for (const transport of ['websocket', 'polling']) {
  const c = ketNoi('http://localhost:19632', { transports: [transport], forceNew: true });
  let n = 0; c.on('cursor', () =&gt; n++);
  await new Promise((r) =&gt; c.on('connect', r)); await cho(300);
  const s = [...io.sockets.sockets.values()].at(-1);
  for (const kieu of ['thường', 'volatile']) {
    n = 0;
    for (let i = 0; i &lt; 1000; i++) (kieu === 'volatile' ? s.volatile : s).emit('cursor', { x: i, y: i });
    await cho(1500);
    console.log(&#96;\${transport.padEnd(9)} · \${kieu.padEnd(8)} · gửi 1000 ⇒ client nhận \${n}&#96;);
  }
  c.close(); await cho(200);
}
process.exit(0);</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-2-ws-vs-socketio-rooms" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 11.2 — ws or Socket.IO: the price of convenience</span><span class="lc-sub">io.emit wakes 2,000 sockets; io.to(room) wakes the room</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-4-scale-adapter-backpressure" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 11.4 — More than one process: adapter, sticky session, backpressure</span><span class="lc-sub">Backpressure: what volatile chooses to throw away</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>io.emit</code></span><span class="v">Broadcast to every connected socket.</span></div>
  <div class="kv"><span class="k"><code>io.to(room)</code></span><span class="v">Broadcast to a room.</span></div>
  <div class="kv"><span class="k"><code>socket.to(room)</code></span><span class="v">The room EXCEPT the sending socket.</span></div>
  <div class="kv"><span class="k"><code>except(ids)</code></span><span class="v">Exclude a chosen set of sockets or rooms.</span></div>
  <div class="kv"><span class="k">union, not intersection</span><span class="v"><code>io.to(A).to(B)</code> reaches anyone in A OR B.</span></div>
  <div class="kv"><span class="k"><code>volatile</code></span><span class="v">Drop the message if the client is not ready; never buffer it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li><code>io.emit</code> reaches everyone; <code>io.to(room)</code> reaches a room.</li><li><code>io.to(A).to(B)</code> and <code>[A, B]</code> are a union — there is no intersection operator.</li><li><code>socket.to</code> excludes the sender; <code>except(ids)</code> excludes a chosen set.</li><li><code>volatile</code> drops the message on slowness instead of buffering it.</li><li>The wrong choice is a bug that hides in dev and surfaces in production.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Emit cheatsheet</span><span class="lc-sub">socket.io/docs/v4/emit-cheatsheet — bảng đầy đủ mọi variant với ví dụ.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 6 — acks and delivery</span><span class="lc-sub">/courses/socket-io/learn${REF} — timeout() + emitWithAck() cho tin nhắn quan trọng.</span></span></div>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-2-ws-vs-socketio-rooms" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Applied in Node.js — lesson 11.2: rooms, measured</span><span class="lc-sub">The Node.js course measures the same semantics with real clients: io.to('thread:42') reached binh's own screen, socket.to did not; one "like" sent with io.emit woke 2,000 sockets and held the loop 12.40 ms, while io.to('post:7') woke 12 in 0.26 ms. It also found that a "max 500 rooms" cap counted per call, not per socket: one socket reached 100,000 rooms (+58.6 MB).</span></span>
  <span class="lc-cta">OPEN NODE.JS LESSON →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>Ngữ nghĩa broadcast: to, in, except, volatile</h2>
<p class="lead">Bốn modifier trên <code>io</code> và <code>socket</code> đổi ý nghĩa của &quot;emit&quot;. Chọn sai một cái là nguồn của hầu hết bug &quot;user thấy stuff họ không nên thấy&quot;.</p>

<h3>Sáu variant song song</h3>
<pre><code class="language-ts">// 1. io.emit — ai cung nhan
io.emit('global', data);                               // MOI socket, moi noi
// dung khi: broadcast toan he thong (maintenance ann.)

// 2. io.to(room).emit — chi trong room
io.to('thread:42').emit('msg', data);                  // moi socket trong thread:42
io.to(['A', 'B']).emit('x', ...);                      // UNION: A OR B

// 3. io.to(A).to(B).emit — UNION (giong to([A, B]))
io.to('thread:42').to('user:7').emit('personal', d);   // o A HOAC B, moi socket 1 lan

// 4. socket.emit — chi client dang giu socket nay
socket.emit('reply', data);                            // dua nay, con moi tab khac cua cung user KHONG

// 5. socket.to(room).emit — room trừ chính socket này
socket.to('thread:42').emit('typing', ...);            // MOI TRONG thread:42 TRU chinh socket

// 6. socket.broadcast.emit — mọi socket KHÁC (equivalent to socket.to(chatnamespace))
socket.broadcast.emit('user-joined', ...);             // moi ai khac ngoai chinh minh
</code></pre>

<div class="callout warn">
<p><strong>Cái phân biệt <code>io.to</code> và <code>socket.to</code>: <code>socket.to</code> LOẠI TRỪ chính mình.</strong> Điển hình: typing indicator. Server nhận <code>thread:typing</code> từ user A, emit lại cho room — nếu dùng <code>io.to(room).emit</code>, chính A cũng nhận và thấy indicator của mình. Dùng <code>socket.to(room).emit</code> để loại A. <strong>Đo thật:</strong> nó loại <em>socket</em> đang gửi, không loại user — tab thứ hai của A vẫn nhận; muốn loại mọi tab của một user thì <code>.except(&#39;user:&lt;id&gt;&#39;)</code>.</p>
</div>

<h3>except() — loại trừ có chọn lọc</h3>
<pre><code class="language-ts">// Broadcast tin nhan cho moi socket TRU cac client dang mute thread nay
const mutedSids = await getMutedSocketIds(threadId);
io.to(&#96;thread:\${threadId}&#96;).except(mutedSids).emit('msg', data);
</code></pre>

<h3>volatile — nếu chậm thì bỏ</h3>
<pre><code class="language-ts">// Cursor position update — neu client dang cham, bo qua goi nay
socket.volatile.emit('cursor', { x, y });

// KHONG dung volatile cho tin nhan quan trong — no de mat co dinh
socket.emit('chat:message', ...);
</code></pre>

<p><code>volatile</code> nghĩa là: nếu buffer đầy (client chậm), packet DROP thay vì xếp hàng. Chỉ dùng cho high-frequency low-value data (cursor, live scroll position, dashboard tick). Với chat message hoặc notification, KHÔNG bao giờ.</p>

<h3>timeout() và ack() — chờ client trả lời</h3>
<pre><code class="language-ts">// Emit voi ack va timeout 3s
try {
  const response = await io.to('user:42').timeout(3000).emitWithAck('important', data);
  // response la mang tra ve tu MOI socket trong user:42
} catch (err) {
  // TIMEOUT — mot hoac nhieu socket khong tra loi
}
</code></pre>

<div class="callout">
<p><strong>Chương 6 đi sâu vào ack.</strong> Ở đây chỉ nhắc rằng broadcast + ack không tự nhiên — với 100 client trong room, bạn PHẢI xử lý 100 response array.</p>
</div>

<h3>Sáu bug điển hình khi chọn nhầm variant</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">tab loop</span><span class="lz-nsub">io.to thay socket.to</span></span>
<span class="lz-nbody">User gửi tin nhắn, thấy nó XUẤT HIỆN HAI LẦN ở tab của mình — một từ optimistic UI, một từ echo server. Fix: <code>socket.to(room).emit</code>.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">stale event</span><span class="lz-nsub">emit vượt qua ack timeout</span></span>
<span class="lz-nbody">User đã rời room trước khi emit đến. Adapter không lỗi — chỉ không đến. Client thấy &quot;thread không update&quot;. Chỉ fix bằng client-side re-fetch.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">cross-tenant leak</span><span class="lz-nsub">io.emit thay io.to</span></span>
<span class="lz-nbody">Dùng <code>io.emit</code> thay vì <code>io.to(tenant)</code>. Bug lớn — data tenant A rò ra tenant B. Nếu app multi-tenant, ĐỪNG bao giờ <code>io.emit</code>.</span>
</div>
</div>

<div class="pitfall">
<p><strong>Bẫy — dùng <code>volatile.emit</code> cho chat.</strong> Chat message rất hiếm khi busy đến mức buffer đầy — nên bug không lộ ở dev. Nhưng khi user offline một chút (transport close), buffer server-side đầy, và tin nhắn tiếp theo bị DROP. Chat mất tin. <strong>Đo trên 4.8.3 còn tệ hơn:</strong> volatile vứt gói mỗi khi transport đang bận ghi, kể cả lúc mạng khoẻ — bắn dồn 1.000 emit chỉ tới 1 (cả websocket lẫn polling).</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> <code>io.emit</code> đến tất, <code>io.to(room)</code> đến room, <code>io.to(A).to(B)</code> và <code>[A, B]</code> đều là union (không có toán tử giao), <code>socket.to</code> loại trừ chính socket, <code>except(ids)</code> loại có chọn, <code>volatile</code> drop nếu chậm — chọn nhầm cái nào cũng là bug rất khó phát hiện ở dev nhưng bung ở production.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>So ba emit: <code>io.emit</code> (tất cả), <code>io.to(room)</code> (room đó), và <code>socket.to(room)</code> (room đó TRỪ người gửi).</li>
<li>Dùng <code>except(ids)</code> để loại một tập đã chọn, và <code>io.to(A).to(B)</code> để xác nhận lại hành vi union.</li>
<li>Gửi một <code>volatile</code> emit tới một client cố tình chậm và xem nó bị BỎ thay vì đệm lại.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đoán được chính xác ai nhận mỗi cái emit / to / socket.to / except / volatile.</p></div>

<h3>🔬 Đo thật: ai nhận mỗi kiểu emit</h3>
<p>socket.io 4.8.3, Node 22 — A1 và A2 là hai tab của user 7, B là user 9 (cả ba ở <code>thread:42</code>), C là user 11 ở ngoài. A1 là người gửi:</p>
<div class="out">$ node ai.mjs
1 io.emit                                A1:1  A2:1  B:1  C:1
2 io.to('thread:42')                     A1:1  A2:1  B:1  C:0
3 io.to('thread:42').to('user:7')        A1:1  A2:1  B:1  C:0
4 socket.emit            (A1 gửi)        A1:1  A2:0  B:0  C:0
5 socket.to('thread:42') (A1 gửi)        A1:0  A2:1  B:1  C:0
6 socket.broadcast.emit  (A1 gửi)        A1:0  A2:1  B:1  C:1
7 io.to('thread:42').except('user:7')    A1:0  A2:0  B:1  C:0
8 io.to('thread:42').except(&lt;sid A2&gt;)    A1:1  A2:0  B:1  C:0</div>
<p><strong>Vòng lặp tab trong Chromium thật</strong> — tab gửi <code>thread:typing</code>; server phát lại bằng <code>io.to(room)</code>, rồi bằng <code>socket.to(room)</code>:</p>
<div class="out">↓ 0{"sid":"iCueu-yipGwQ-qUxAAAA","upgrades":[],"pingInterval":25000,"pingTimeout":20000,"maxPayload":1000000}   (30 ms)
↑ 40   (30 ms)
↓ 40{"sid":"OE1SWu_KNg9z02-ZAAAA"}   (31 ms)
↑ 42["thread:typing",{"kieu":"io"}]   (31 ms)
↓ 42["thread:typing",{"threadId":42,"user":"binh"}]   (32 ms)</div>
<div class="out">↓ 0{"sid":"PatVm1QMyiENrBbEAAAB","upgrades":[],"pingInterval":25000,"pingTimeout":20000,"maxPayload":1000000}   (24 ms)
↑ 40   (24 ms)
↓ 40{"sid":"FkufCPg-fLmneYNkAAAB"}   (24 ms)
↑ 42["thread:typing",{"kieu":"socket"}]   (24 ms)</div>
<p><strong>Kho này, 14/10/2026 (8a87e3298)</strong> — hai lượt emit vào các room chồng nhau vs một lượt với mảng room:</p>
<div class="out">$ node doi.mjs
— TRƯỚC (hai lượt emit) —
client nhận 2 lần tin id=1 · cách nhau 0.00 ms
— SAU (một lượt, mảng room: io.to(['thread:42', 'user:7'])) —
client nhận 1 lần tin id=2
$ grep -n "io?.to(rooms).emit" src/socket/messaging.socket.ts
159: // ⚠️ PHẢI là MỘT lượt &#96;emit&#96; với MẢNG phòng. Trước 14/10/2026 đây
170: io?.to(rooms).emit(event, payload);</div>
<p><strong>volatile</strong> — bắn dồn 1.000 emit:</p>
<div class="out">$ node vol.mjs
websocket · thường   · gửi 1000 ⇒ client nhận 1000
websocket · volatile · gửi 1000 ⇒ client nhận 1
polling   · thường   · gửi 1000 ⇒ client nhận 1000
polling   · volatile · gửi 1000 ⇒ client nhận 1</div>
<p><strong>Broadcast + ack</strong> — ba tab, một tab im:</p>
<div class="out">$ node ack.mjs
callback sau 3.0 s · err = "operation has timed out" · responses = ["tab1 đã nhận","tab2 đã nhận"]
emitWithAck NÉM sau 3.0 s · "operation has timed out" — mất luôn 2 câu trả lời đã có</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-javascript"><span class="tok-comment">// Bốn socket: A1 + A2 = HAI TAB của user 7 · B = user 9 · ba socket đó ở thread:42 · C = user 11, KHÔNG ở thread:42.</span>
<span class="tok-comment">// A1 là người gửi. Mỗi biến thể emit ⇒ ai nhận (đếm thật ở client)?</span>
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const io = new Server(19630);
io.on('connection', (s) =&gt; { const { ten, user, thread } = s.handshake.auth; s.data.ten = ten; s.join(&#96;user:\${user}&#96;); if (thread) s.join('thread:42'); s.emit('san-sang'); });
const DS = [['A1', 7, true], ['A2', 7, true], ['B', 9, true], ['C', 11, false]];
const nhan = {};
await Promise.all(DS.map(([ten, user, thread]) =&gt; new Promise((r) =&gt; {
  const c = ketNoi('http://localhost:19630', { auth: { ten, user, thread }, transports: ['websocket'] });
  c.on('tin', () =&gt; nhan[ten].push('✓')); c.on('san-sang', r); nhan[ten] = [];
})));
const theo = (t) =&gt; [...io.sockets.sockets.values()].find((s) =&gt; s.data.ten === t);
const A1 = theo('A1');
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
const thu = async (nhanDe, phat) =&gt; { for (const k in nhan) nhan[k] = []; phat(); await cho(250);
  console.log(nhanDe.padEnd(40), DS.map(([t]) =&gt; &#96;\${t}:\${nhan[t].length}&#96;).join('  ')); };
await thu('1 io.emit', () =&gt; io.emit('tin'));
await thu("2 io.to('thread:42')", () =&gt; io.to('thread:42').emit('tin'));
await thu("3 io.to('thread:42').to('user:7')", () =&gt; io.to('thread:42').to('user:7').emit('tin'));
await thu('4 socket.emit            (A1 gửi)', () =&gt; A1.emit('tin'));
await thu("5 socket.to('thread:42') (A1 gửi)", () =&gt; A1.to('thread:42').emit('tin'));
await thu('6 socket.broadcast.emit  (A1 gửi)', () =&gt; A1.broadcast.emit('tin'));
await thu("7 io.to('thread:42').except('user:7')", () =&gt; io.to('thread:42').except('user:7').emit('tin'));
await thu("8 io.to('thread:42').except(&lt;sid A2&gt;)", () =&gt; io.to('thread:42').except(theo('A2').id).emit('tin'));
process.exit(0);</code></pre>
<pre><code class="language-javascript"><span class="tok-comment">// volatile: gói bị BỎ nếu transport chưa sẵn sàng ghi. Server bắn 1.000 emit liền một mạch, thường vs volatile, qua websocket rồi qua polling.</span>
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
const io = new Server(19632);
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
for (const transport of ['websocket', 'polling']) {
  const c = ketNoi('http://localhost:19632', { transports: [transport], forceNew: true });
  let n = 0; c.on('cursor', () =&gt; n++);
  await new Promise((r) =&gt; c.on('connect', r)); await cho(300);
  const s = [...io.sockets.sockets.values()].at(-1);
  for (const kieu of ['thường', 'volatile']) {
    n = 0;
    for (let i = 0; i &lt; 1000; i++) (kieu === 'volatile' ? s.volatile : s).emit('cursor', { x: i, y: i });
    await cho(1500);
    console.log(&#96;\${transport.padEnd(9)} · \${kieu.padEnd(8)} · gửi 1000 ⇒ client nhận \${n}&#96;);
  }
  c.close(); await cho(200);
}
process.exit(0);</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-2-ws-vs-socketio-rooms" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 11.2 — ws hay Socket.IO: cái giá của sự tiện nghi</span><span class="lc-sub">io.emit đánh thức 2.000 socket; io.to(room) chỉ đánh thức room</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-4-scale-adapter-backpressure" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 11.4 — Nhiều hơn một tiến trình: adapter, sticky session, và áp lực ngược</span><span class="lc-sub">Áp lực ngược: thứ volatile chọn cách vứt đi</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>io.emit</code></span><span class="v">Broadcast tới mọi socket đang kết nối.</span></div>
  <div class="kv"><span class="k"><code>io.to(room)</code></span><span class="v">Broadcast tới một room.</span></div>
  <div class="kv"><span class="k"><code>socket.to(room)</code></span><span class="v">Room đó TRỪ socket đang gửi.</span></div>
  <div class="kv"><span class="k"><code>except(ids)</code></span><span class="v">Loại một tập socket hoặc room đã chọn.</span></div>
  <div class="kv"><span class="k">union, không phải giao</span><span class="v"><code>io.to(A).to(B)</code> tới ai ở A HOẶC B.</span></div>
  <div class="kv"><span class="k"><code>volatile</code></span><span class="v">Bỏ tin nếu client chưa sẵn sàng; không bao giờ đệm.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li><code>io.emit</code> tới tất cả; <code>io.to(room)</code> tới một room.</li><li><code>io.to(A).to(B)</code> và <code>[A, B]</code> là một union — không có toán tử giao.</li><li><code>socket.to</code> loại người gửi; <code>except(ids)</code> loại một tập đã chọn.</li><li><code>volatile</code> bỏ tin khi chậm thay vì đệm lại.</li><li>Chọn nhầm là một bug ẩn ở dev và bung ở production.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Emit cheatsheet</span><span class="lc-sub">socket.io/docs/v4/emit-cheatsheet — bảng đầy đủ mọi variant với ví dụ.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 6 — acks và delivery</span><span class="lc-sub">/courses/socket-io/learn${REF} — timeout() + emitWithAck() cho tin nhắn quan trọng.</span></span></div>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-11-2-ws-vs-socketio-rooms" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Áp vào Node.js — bài 11.2: room, đo thật</span><span class="lc-sub">Khoá Node.js đo cùng ngữ nghĩa với client thật: io.to('thread:42') hiện cả trên màn hình của chính binh, socket.to thì không; một lượt thích phát bằng io.emit đánh thức 2.000 socket và giữ event loop 12,40 ms, còn io.to('post:7') đánh thức 12 socket trong 0,26 ms. Bài đó còn tìm ra một giới hạn "tối đa 500 room" đếm theo lần gọi chứ không theo socket: một socket vào tới 100.000 room (+58,6 MB).</span></span>
  <span class="lc-cta">MỞ BÀI NODE.JS →</span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 3.5 ─────────────────────────── */
    {
      title: '3.5 — Event names: convention that scales|||3.5 — Tên event: convention scale được',
      slug: 'io-3-5-event-name',
      type: 'VIDEO',
      description: 'Kho này dùng `<feature>:<verb>` — `thread:join`, `call:offer`, `listen:control`. Prefix theo feature giúp routing rõ ràng và tránh xung đột giữa 8 tệp gateway.',
      content: `
${G03_5}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.5</span>
<h2>Event names: convention that scales</h2>
<p class="lead">There is no runtime check on event names. Two developers on different features could both call an event <code>update</code> and clash silently. Counted on 13/11/2026: this repo has 29 distinct emit names and 57 listen names across 8 gateway files — every socket.io name carries a feature prefix, so none clash.</p>

<h3>The convention</h3>
<pre><code class="language-text">&lt;feature&gt;:&lt;verb&gt;   (feature prefix, kebab or colon separator)

Chat:      thread:join, thread:leave, thread:typing, thread:new-message
Calls:     call:offer, call:answer, call:ice, call:end, call:reject
Listen:    listen:create, listen:join, listen:control, listen:sync-request
Presence:  presence:update
Posts:     post:subscribe, post:reacted, post:unsubscribe
Devices:   maker:device:join, maker:device:leave
</code></pre>

<div class="callout ok">
<p><strong>Three measurable benefits.</strong> (1) Grep &quot;call:&quot; across the codebase → find everything call-related. (2) Client-side, it is easy to block a whole feature out of the handler map. (3) Log messages partition themselves by prefix — cheap analytics dashboards.</p>
</div>

<h3>Anti-pattern — names that are too generic</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">&quot;update&quot;</span><span class="lz-nsub">a bug waiting to happen</span></span>
<span class="lz-nbody">The client receives <code>update</code> — of what? It could be a thread, a post, presence, or a call. If the client handler registers &quot;update&quot; with an assumption about the payload, the day somebody adds another kind of &quot;update&quot; everything breaks.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">&quot;message&quot;</span><span class="lz-nsub">far too generic</span></span>
<span class="lz-nbody">Is this a chat message? A system message? A push notification? You cannot tell without reading the payload — and reading the payload to do routing is a backwards design.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">verb-only</span><span class="lz-nsub">&quot;join&quot;, &quot;leave&quot;</span></span>
<span class="lz-nbody">Join what? You have to read the data to find out. A prefix plus a verb states the intent plainly.</span>
</div>
</div>

<h3>How event names and function names interact</h3>
<pre><code class="language-ts">// mapping 1:1 giua ten event va ten hang so
const EVT = {
  THREAD_JOIN:        'thread:join',
  THREAD_LEAVE:       'thread:leave',
  THREAD_NEW_MSG:     'thread:new-message',
  ...
} as const;

socket.on(EVT.THREAD_JOIN, handleThreadJoin);
// TypeScript auto-complete + rename refactor tot han string literal
</code></pre>

<h3>Reserved event names — do not shadow them</h3>
<pre><code class="language-text">'connect'         'connect_error'      'disconnect'
'disconnecting'   'newListener'        'removeListener'
// (do tren 4.8.3: CHI 6 ten nay nem &quot;is a reserved event name&quot; khi emit;
//  error, ping, pong, reconnect, reconnect_attempt la ten event THUONG — xem Do that)
</code></pre>

<p><strong>Measured on 4.8.3:</strong> emitting one of these six names <em>throws immediately</em> (&quot;is a reserved event name&quot;) — nothing gets overridden silently. Names such as <code>ping</code>, <code>error</code> or <code>reconnect</code> are ordinary events: they do not touch the heartbeat (engine.io packets 2/3, a layer below). The real trap is the other way round: <code>socket.on(&#39;reconnect&#39;)</code> never fires for a real reconnect — since v3 that event lives on the Manager, <code>socket.io.on(&#39;reconnect&#39;)</code>. A feature prefix (<code>chat:connect</code>) is always safe.</p>

<div class="pitfall">
<p><strong>Trap — using camelCase.</strong> <code>threadJoin</code> works, but breaks the convention. This repo uses kebab with a colon (<code>thread:new-message</code>). If you mix them, grepping &quot;thread:&quot; misses threadJoin. Pick one convention and hold to it.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Convention <code>&lt;feature&gt;:&lt;verb&gt;</code> avoids event-name collisions across this repo's 8 gateway files (29 emitted + 57 listened names, 0 socket.io clashes), makes it easy to grep everything belonging to a feature, and steers clear of the six reserved names (<code>connect</code>, <code>connect_error</code>, <code>disconnect</code>, <code>disconnecting</code>, <code>newListener</code>, <code>removeListener</code>), which throw when emitted.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Grep this repo's gateways for emit and listener names and confirm the <code>&lt;feature&gt;:&lt;verb&gt;</code> convention (e.g. <code>chat:message</code>).</li>
<li>Add one new event following the convention and show it collides with none of the existing names (count them first: 29 emitted / 57 listened today).</li>
<li>Emit each of <code>connect</code>, <code>disconnect</code>, <code>error</code>, <code>ping</code> from the server: which throw, which go through? Then check <code>socket.on(&#39;reconnect&#39;)</code> vs <code>socket.io.on(&#39;reconnect&#39;)</code> across a server restart.</li>
</ol>
<p><strong>Done when:</strong> you can state the convention and list the reserved names you cannot override.</p></div>

<h3>🔬 Measured: the event names of this repo</h3>
<p>Every fixed <code>emit('…')</code> / <code>on('…')</code> in <code>src/socket</code> (8 files, tests excluded). The four unprefixed names are raw ws / HTTP events of the WebSocket gateways (Chapters 8–9), not socket.io events:</p>
<div class="out">$ node dem-ten.mjs
emit: 29 tên · on: 57 tên (không tính connect/disconnect/error…)
tiền tố emit: dk:9 · call:6 · listen:6 · thread:3 · work:2 · nowplaying:1 · post:1 · presence:1
tiền tố on  : dk:20 · listen:11 · work:8 · call:5 · (không tiền tố)4 · thread:3 · nowplaying:2 · maker:2 · post:2
tên dùng ở &gt;1 tệp gateway: upgrade [device.gateway, notes-collaboration.gateway, work-docs-collaboration.gateway]
tên không có tiền tố: upgrade, message, pong, close</div>
<p><strong>Two features, one name</strong> — both listen to <code>update</code>, each assuming its own payload:</p>
<div class="out">$ node dung.mjs
— server phát 'update' cho posts —
  [posts]    bài 7 có 12 lượt thích
  [presence] TypeError: Cannot read properties of undefined (reading 'id')
— server phát 'update' cho presence —
  [posts]    TypeError: Cannot read properties of undefined (reading 'id')
  [presence] user 9 online
— cùng việc đó với tên &lt;feature&gt;:&lt;verb&gt; —
  [posts]    bài 7 có 12 lượt thích
  [presence] user 9 online</div>
<p><strong>Reserved names</strong> — what really throws, and where <code>reconnect</code> really fires (socket.io 4.8.3):</p>
<div class="out">$ node rieng.mjs
server emit('connect')             ⇒ NÉM: "connect" is a reserved event name
server emit('connect_error')       ⇒ NÉM: "connect_error" is a reserved event name
server emit('disconnect')          ⇒ NÉM: "disconnect" is a reserved event name
server emit('disconnecting')       ⇒ NÉM: "disconnecting" is a reserved event name
server emit('newListener')         ⇒ NÉM: "newListener" is a reserved event name
server emit('removeListener')      ⇒ NÉM: "removeListener" is a reserved event name
server emit('error')               ⇒ gửi được
server emit('ping')                ⇒ gửi được
server emit('pong')                ⇒ gửi được
server emit('reconnect')           ⇒ gửi được
server emit('chat:connect')        ⇒ gửi được
  client socket.on('ping') nhận được event tên 'ping' của BẠN (khác gói ping 2 của engine.io)
  client socket.on('reconnect') chạy — vì server emit một event TỰ ĐẶT tên 'reconnect'
— tắt server rồi bật lại cùng cổng —
  client socket.io.on('reconnect') CHẠY (lần thử 1)
sau lần nối lại THẬT: socket.on('reconnect') chạy thêm 0 lần (từ v3 sự kiện nối lại ở socket.io, tức Manager)</div>
<p><strong>Typed events</strong> — <code>Server&lt;ClientToServer, ServerToClient&gt;</code> turns a typo into a compile error:</p>
<div class="out">$ npx tsc --noEmit --strict --module nodenext --moduleResolution nodenext kieu.ts
kieu.ts(7,13): error TS2345: Argument of type '"thread:jion"' is not assignable to parameter of type 'ReservedOrUserEventNames&lt;SocketReservedEventsMap, ClientToServer&gt;'.
kieu.ts(7,29): error TS7006: Parameter 'id' implicitly has an 'any' type.
kieu.ts(8,46): error TS2561: Object literal may only specify known properties, but 'txt' does not exist in type '{ id: number; text: string; }'. Did you mean to write 'text'?</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-typescript"><span class="tok-comment">// Tên event có kiểu: gõ sai một chữ thì tsc báo NGAY, không phải đợi người dùng thấy "không có gì xảy ra"</span>
import { Server } from 'socket.io';
interface ClientToServer { 'thread:join': (threadId: number) =&gt; void; 'thread:typing': (p: { threadId: number }) =&gt; void }
interface ServerToClient { 'thread:new-message': (m: { id: number; text: string }) =&gt; void }
const io = new Server&lt;ClientToServer, ServerToClient&gt;(19642);
io.on('connection', (socket) =&gt; {
  socket.on('thread:jion', (id) =&gt; socket.join(&#96;thread:\${id}&#96;));        <span class="tok-comment">  // gõ sai: jion</span>
  socket.emit('thread:new-message', { id: 1, txt: 'chào' });            <span class="tok-comment">  // sai trường: txt</span>
});</code></pre>
<pre><code class="language-javascript"><span class="tok-comment">// Tên dành riêng: cái nào THẬT SỰ bị cấm? emit thử từng tên ở server; và socket.on('reconnect') phía client có bao giờ chạy?</span>
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
let io = new Server(19641);
const c = ketNoi('http://localhost:19641', { transports: ['websocket'], reconnectionDelay: 300 });
c.on('ping', () =&gt; console.log("  client socket.on('ping') nhận được event tên 'ping' của BẠN (khác gói ping 2 của engine.io)"));
let nSock = 0; c.on('reconnect', () =&gt; { nSock++; console.log("  client socket.on('reconnect') chạy — vì server emit một event TỰ ĐẶT tên 'reconnect'"); });
c.io.on('reconnect', (n) =&gt; console.log(&#96;  client socket.io.on('reconnect') CHẠY (lần thử \${n})&#96;));
await new Promise((r) =&gt; c.on('connect', r));
const s = [...io.sockets.sockets.values()][0];
for (const ten of ['connect', 'connect_error', 'disconnect', 'disconnecting', 'newListener', 'removeListener', 'error', 'ping', 'pong', 'reconnect', 'chat:connect']) {
  try { s.emit(ten, 1); console.log(&#96;server emit('\${ten}')&#96;.padEnd(34), '⇒ gửi được'); } catch (e) { console.log(&#96;server emit('\${ten}')&#96;.padEnd(34), &#96;⇒ NÉM: \${e.message}&#96;); }
}
await new Promise((r) =&gt; setTimeout(r, 300));
console.log('— tắt server rồi bật lại cùng cổng —');
io.close(); await new Promise((r) =&gt; setTimeout(r, 300)); io = new Server(19641);
await new Promise((r) =&gt; setTimeout(r, 2500));
console.log(&#96;sau lần nối lại THẬT: socket.on('reconnect') chạy thêm \${nSock - 1} lần (từ v3 sự kiện nối lại ở socket.io, tức Manager)&#96;);
process.exit(0);</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/typescript/learn?lessonSlug=typescript-2-4-literal-as-const" target="_blank" rel="noopener"><span class="lc-ico">🔷</span><span class="lc-body"><span class="lc-title">TypeScript · 2.4 — Literal types & as const</span><span class="lc-sub">Event names as literal types: the EVT map and typed events</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/observability-monitoring/learn?lessonSlug=obs-1-1-tu-console-toi-json" target="_blank" rel="noopener"><span class="lc-ico">📈</span><span class="lc-body"><span class="lc-title">Observability · 1.1 — From console.log to a machine-readable line</span><span class="lc-sub">Logs grouped by the event prefix</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Name convention</span><span class="v"><code>&lt;feature&gt;:&lt;verb&gt;</code>, e.g. <code>chat:message</code>.</span></div>
  <div class="kv"><span class="k">Collision</span><span class="v">Two features reusing one event name; the convention prevents it.</span></div>
  <div class="kv"><span class="k">Greppability</span><span class="v">A shared prefix lets you find every event of a feature at once.</span></div>
  <div class="kv"><span class="k">Reserved names</span><span class="v">connect, connect_error, disconnect, disconnecting, newListener, removeListener — emitting them throws.</span></div>
  <div class="kv"><span class="k">Emit vs listener</span><span class="v">The sending and receiving ends of one named event.</span></div>
  <div class="kv"><span class="k">Flat name space</span><span class="v">All event names share one flat string space — hence the prefix.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>The <code>&lt;feature&gt;:&lt;verb&gt;</code> convention avoids name collisions across the repo's 8 gateway files.</li><li>Measured: 29 emitted + 57 listened names, 0 socket.io clashes.</li><li>A consistent prefix makes every event for a feature greppable.</li><li>Six reserved names throw when emitted; <code>ping</code>/<code>error</code>/<code>reconnect</code> do not.</li><li>Reconnect events live on the Manager: <code>socket.io.on(&#39;reconnect&#39;)</code>.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Reserved events</span><span class="lc-sub">socket.io/docs/v4/emitting-events/#reserved-events — danh sách đầy đủ tên bị cấm.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 6 — acks</span><span class="lc-sub">/courses/socket-io/learn${REF} — tên event thường thêm <code>:done</code> or <code>:error</code> cho response.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.5</span>
<h2>Tên event: convention scale được</h2>
<p class="lead">Không có runtime check nào cho tên event. Hai dev ở feature khác nhau có thể cùng gọi event <code>update</code> và đụng nhau âm thầm. Đếm ngày 13/11/2026: kho này có 29 emit name và 57 listen name trong 8 tệp gateway — mọi tên socket.io đều có tiền tố feature, nên không cái nào đụng.</p>

<h3>Convention</h3>
<pre><code class="language-text">&lt;feature&gt;:&lt;verb&gt;   (feature prefix, kebab hay colon separator)

Chat:      thread:join, thread:leave, thread:typing, thread:new-message
Calls:     call:offer, call:answer, call:ice, call:end, call:reject
Listen:    listen:create, listen:join, listen:control, listen:sync-request
Presence:  presence:update
Posts:     post:subscribe, post:reacted, post:unsubscribe
Devices:   maker:device:join, maker:device:leave
</code></pre>

<div class="callout ok">
<p><strong>Ba lợi ích đo được.</strong> (1) Grep &quot;call:&quot; trong codebase → tìm mọi thứ liên quan call. (2) Client-side dễ block feature khỏi handler map. (3) Log messages tự phân theo prefix — dashboard analytics rẻ.</p>
</div>

<h3>Anti-pattern — chọn tên chung quá</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">&quot;update&quot;</span><span class="lz-nsub">bug đợi xảy ra</span></span>
<span class="lz-nbody">Client nhận <code>update</code> — của cái gì? Có thể của thread, của post, của presence, hay của call. Nếu client handler đăng ký &quot;update&quot; kèm giả định về payload, ngày ai đó thêm loại &quot;update&quot; khác, mọi thứ vỡ.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">&quot;message&quot;</span><span class="lz-nsub">quá chung</span></span>
<span class="lz-nbody">Đây là chat message? System message? Push notification? Không biết mà không đọc payload — mà đọc payload trong handler routing là design ngược.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">verb-only</span><span class="lz-nsub">&quot;join&quot;, &quot;leave&quot;</span></span>
<span class="lz-nbody">Join cái gì? Bạn phải đọc data để biết. Prefix + verb tách rõ intent.</span>
</div>
</div>

<h3>Tương tác giữa event name và tên hàm</h3>
<pre><code class="language-ts">// mapping 1:1 giua ten event va ten hang so
const EVT = {
  THREAD_JOIN:        'thread:join',
  THREAD_LEAVE:       'thread:leave',
  THREAD_NEW_MSG:     'thread:new-message',
  ...
} as const;

socket.on(EVT.THREAD_JOIN, handleThreadJoin);
// TypeScript auto-complete + rename refactor tot han string literal
</code></pre>

<h3>Reserved event names — đừng đè</h3>
<pre><code class="language-text">'connect'         'connect_error'      'disconnect'
'disconnecting'   'newListener'        'removeListener'
// (do tren 4.8.3: CHI 6 ten nay nem &quot;is a reserved event name&quot; khi emit;
//  error, ping, pong, reconnect, reconnect_attempt la ten event THUONG — xem Do that)
</code></pre>

<p><strong>Đo trên 4.8.3:</strong> emit một trong sáu tên này bị <em>ném lỗi ngay</em> (&quot;is a reserved event name&quot;) — không có chuyện âm thầm đè handler. Các tên như <code>ping</code>, <code>error</code>, <code>reconnect</code> là event thường: không đụng tới heartbeat (gói 2/3 của engine.io, tầng dưới). Bẫy thật nằm ở chiều ngược lại: <code>socket.on(&#39;reconnect&#39;)</code> không bao giờ chạy khi nối lại thật — từ v3 event đó nằm ở Manager, <code>socket.io.on(&#39;reconnect&#39;)</code>. Prefix feature (<code>chat:connect</code>) luôn an toàn.</p>

<div class="pitfall">
<p><strong>Bẫy — dùng camelCase.</strong> <code>threadJoin</code> hoạt động, nhưng vỡ convention. Kho này dùng kebab với colon (<code>thread:new-message</code>). Nếu bạn mix, grep &quot;thread:&quot; sẽ bỏ lỡ threadJoin. Chọn một convention và giữ chặt.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Convention <code>&lt;feature&gt;:&lt;verb&gt;</code> tránh xung đột tên event giữa 8 tệp gateway của kho này (29 tên emit + 57 tên listen, 0 clash socket.io), cho grep dễ tìm mọi thứ liên quan feature, và tránh sáu reserved name (<code>connect</code>, <code>connect_error</code>, <code>disconnect</code>, <code>disconnecting</code>, <code>newListener</code>, <code>removeListener</code>) — emit chúng là bị ném lỗi.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Grep các gateway của kho này tìm tên emit và listener và xác nhận convention <code>&lt;feature&gt;:&lt;verb&gt;</code> (ví dụ <code>chat:message</code>).</li>
<li>Thêm một event mới theo convention và cho thấy nó không clash với các tên sẵn có (đếm trước: hôm nay 29 tên emit / 57 tên listen).</li>
<li>Từ server emit lần lượt <code>connect</code>, <code>disconnect</code>, <code>error</code>, <code>ping</code>: tên nào ném lỗi, tên nào đi qua? Rồi so <code>socket.on(&#39;reconnect&#39;)</code> với <code>socket.io.on(&#39;reconnect&#39;)</code> khi khởi động lại server.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn nêu được convention và liệt kê các reserved name không được override.</p></div>

<h3>🔬 Đo thật: tên event của kho này</h3>
<p>Mọi <code>emit('…')</code> / <code>on('…')</code> có tên cố định trong <code>src/socket</code> (8 tệp, không tính test). Bốn tên không tiền tố là event ws / HTTP của các gateway WebSocket thô (Chương 8–9), không phải event socket.io:</p>
<div class="out">$ node dem-ten.mjs
emit: 29 tên · on: 57 tên (không tính connect/disconnect/error…)
tiền tố emit: dk:9 · call:6 · listen:6 · thread:3 · work:2 · nowplaying:1 · post:1 · presence:1
tiền tố on  : dk:20 · listen:11 · work:8 · call:5 · (không tiền tố)4 · thread:3 · nowplaying:2 · maker:2 · post:2
tên dùng ở &gt;1 tệp gateway: upgrade [device.gateway, notes-collaboration.gateway, work-docs-collaboration.gateway]
tên không có tiền tố: upgrade, message, pong, close</div>
<p><strong>Hai tính năng, một cái tên</strong> — cả hai nghe <code>update</code>, mỗi bên tự giả định payload:</p>
<div class="out">$ node dung.mjs
— server phát 'update' cho posts —
  [posts]    bài 7 có 12 lượt thích
  [presence] TypeError: Cannot read properties of undefined (reading 'id')
— server phát 'update' cho presence —
  [posts]    TypeError: Cannot read properties of undefined (reading 'id')
  [presence] user 9 online
— cùng việc đó với tên &lt;feature&gt;:&lt;verb&gt; —
  [posts]    bài 7 có 12 lượt thích
  [presence] user 9 online</div>
<p><strong>Tên dành riêng</strong> — cái gì thật sự ném lỗi, và <code>reconnect</code> thật sự chạy ở đâu (socket.io 4.8.3):</p>
<div class="out">$ node rieng.mjs
server emit('connect')             ⇒ NÉM: "connect" is a reserved event name
server emit('connect_error')       ⇒ NÉM: "connect_error" is a reserved event name
server emit('disconnect')          ⇒ NÉM: "disconnect" is a reserved event name
server emit('disconnecting')       ⇒ NÉM: "disconnecting" is a reserved event name
server emit('newListener')         ⇒ NÉM: "newListener" is a reserved event name
server emit('removeListener')      ⇒ NÉM: "removeListener" is a reserved event name
server emit('error')               ⇒ gửi được
server emit('ping')                ⇒ gửi được
server emit('pong')                ⇒ gửi được
server emit('reconnect')           ⇒ gửi được
server emit('chat:connect')        ⇒ gửi được
  client socket.on('ping') nhận được event tên 'ping' của BẠN (khác gói ping 2 của engine.io)
  client socket.on('reconnect') chạy — vì server emit một event TỰ ĐẶT tên 'reconnect'
— tắt server rồi bật lại cùng cổng —
  client socket.io.on('reconnect') CHẠY (lần thử 1)
sau lần nối lại THẬT: socket.on('reconnect') chạy thêm 0 lần (từ v3 sự kiện nối lại ở socket.io, tức Manager)</div>
<p><strong>Event có kiểu</strong> — <code>Server&lt;ClientToServer, ServerToClient&gt;</code> biến lỗi gõ thành lỗi biên dịch:</p>
<div class="out">$ npx tsc --noEmit --strict --module nodenext --moduleResolution nodenext kieu.ts
kieu.ts(7,13): error TS2345: Argument of type '"thread:jion"' is not assignable to parameter of type 'ReservedOrUserEventNames&lt;SocketReservedEventsMap, ClientToServer&gt;'.
kieu.ts(7,29): error TS7006: Parameter 'id' implicitly has an 'any' type.
kieu.ts(8,46): error TS2561: Object literal may only specify known properties, but 'txt' does not exist in type '{ id: number; text: string; }'. Did you mean to write 'text'?</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-typescript"><span class="tok-comment">// Tên event có kiểu: gõ sai một chữ thì tsc báo NGAY, không phải đợi người dùng thấy "không có gì xảy ra"</span>
import { Server } from 'socket.io';
interface ClientToServer { 'thread:join': (threadId: number) =&gt; void; 'thread:typing': (p: { threadId: number }) =&gt; void }
interface ServerToClient { 'thread:new-message': (m: { id: number; text: string }) =&gt; void }
const io = new Server&lt;ClientToServer, ServerToClient&gt;(19642);
io.on('connection', (socket) =&gt; {
  socket.on('thread:jion', (id) =&gt; socket.join(&#96;thread:\${id}&#96;));        <span class="tok-comment">  // gõ sai: jion</span>
  socket.emit('thread:new-message', { id: 1, txt: 'chào' });            <span class="tok-comment">  // sai trường: txt</span>
});</code></pre>
<pre><code class="language-javascript"><span class="tok-comment">// Tên dành riêng: cái nào THẬT SỰ bị cấm? emit thử từng tên ở server; và socket.on('reconnect') phía client có bao giờ chạy?</span>
import { Server } from 'socket.io';
import { io as ketNoi } from 'socket.io-client';
let io = new Server(19641);
const c = ketNoi('http://localhost:19641', { transports: ['websocket'], reconnectionDelay: 300 });
c.on('ping', () =&gt; console.log("  client socket.on('ping') nhận được event tên 'ping' của BẠN (khác gói ping 2 của engine.io)"));
let nSock = 0; c.on('reconnect', () =&gt; { nSock++; console.log("  client socket.on('reconnect') chạy — vì server emit một event TỰ ĐẶT tên 'reconnect'"); });
c.io.on('reconnect', (n) =&gt; console.log(&#96;  client socket.io.on('reconnect') CHẠY (lần thử \${n})&#96;));
await new Promise((r) =&gt; c.on('connect', r));
const s = [...io.sockets.sockets.values()][0];
for (const ten of ['connect', 'connect_error', 'disconnect', 'disconnecting', 'newListener', 'removeListener', 'error', 'ping', 'pong', 'reconnect', 'chat:connect']) {
  try { s.emit(ten, 1); console.log(&#96;server emit('\${ten}')&#96;.padEnd(34), '⇒ gửi được'); } catch (e) { console.log(&#96;server emit('\${ten}')&#96;.padEnd(34), &#96;⇒ NÉM: \${e.message}&#96;); }
}
await new Promise((r) =&gt; setTimeout(r, 300));
console.log('— tắt server rồi bật lại cùng cổng —');
io.close(); await new Promise((r) =&gt; setTimeout(r, 300)); io = new Server(19641);
await new Promise((r) =&gt; setTimeout(r, 2500));
console.log(&#96;sau lần nối lại THẬT: socket.on('reconnect') chạy thêm \${nSock - 1} lần (từ v3 sự kiện nối lại ở socket.io, tức Manager)&#96;);
process.exit(0);</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/typescript/learn?lessonSlug=typescript-2-4-literal-as-const" target="_blank" rel="noopener"><span class="lc-ico">🔷</span><span class="lc-body"><span class="lc-title">TypeScript · 2.4 — Kiểu literal & as const</span><span class="lc-sub">Tên event là kiểu literal: bảng EVT và event có kiểu</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/observability-monitoring/learn?lessonSlug=obs-1-1-tu-console-toi-json" target="_blank" rel="noopener"><span class="lc-ico">📈</span><span class="lc-body"><span class="lc-title">Observability · 1.1 — Từ console.log tới một dòng máy đọc được</span><span class="lc-sub">Log nhóm theo tiền tố event</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Convention tên</span><span class="v"><code>&lt;feature&gt;:&lt;verb&gt;</code>, ví dụ <code>chat:message</code>.</span></div>
  <div class="kv"><span class="k">Collision</span><span class="v">Hai feature dùng lại một tên event; convention ngăn điều đó.</span></div>
  <div class="kv"><span class="k">Dễ grep</span><span class="v">Một prefix chung cho bạn tìm mọi event của một feature cùng lúc.</span></div>
  <div class="kv"><span class="k">Reserved names</span><span class="v">connect, connect_error, disconnect, disconnecting, newListener, removeListener — emit là bị ném lỗi.</span></div>
  <div class="kv"><span class="k">Emit vs listener</span><span class="v">Đầu gửi và đầu nhận của một event có tên.</span></div>
  <div class="kv"><span class="k">Không gian tên phẳng</span><span class="v">Mọi tên event share một không gian chuỗi phẳng — nên cần prefix.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Convention <code>&lt;feature&gt;:&lt;verb&gt;</code> tránh xung đột tên giữa 8 tệp gateway của kho này.</li><li>Đo được: 29 tên emit + 57 tên listen, 0 clash socket.io.</li><li>Một prefix nhất quán làm mọi event của một feature dễ grep.</li><li>Sáu reserved name bị ném lỗi khi emit; <code>ping</code>/<code>error</code>/<code>reconnect</code> thì không.</li><li>Event nối lại nằm ở Manager: <code>socket.io.on(&#39;reconnect&#39;)</code>.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Reserved events</span><span class="lc-sub">socket.io/docs/v4/emitting-events/#reserved-events — danh sách đầy đủ tên bị cấm.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 6 — acks</span><span class="lc-sub">/courses/socket-io/learn${REF} — tên event thường thêm <code>:done</code> hoặc <code>:error</code> cho response.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 3.6 ─────────────────────────── */
    {
      title: '3.6 — Chapter 3 quiz|||3.6 — Kiểm tra Chương 3',
      slug: 'io-3-6-quiz',
      type: 'QUIZ',
      description: 'Sáu câu, mười phút. Về room (4 pattern), namespace (khi nào cần), lifecycle, broadcast variants, và naming convention.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Quiz</span>
<h2>What Chapter 3 established</h2>
<p class="lead">Six questions on routing at layer 3 — rooms are the abstraction you want, namespaces are the one you probably do not.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">A room is just a string in a Set</span><span class="lz-d">There is no room object to create or destroy. Joining adds a string; leaving removes it; a room with no members simply stops existing. That is why room "cleanup" is usually a non-problem.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Namespaces are a separate connection, rooms are not</span><span class="lz-d">A namespace multiplexes a distinct Socket.IO connection with its own middleware and handlers. Most designs that reach for namespaces actually want rooms plus an event-name prefix, at a fraction of the complexity.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Broadcast selectors compose</span><span class="lz-d">to, in, except and volatile chain together, and the same chaining works for the adapter methods in Chapter 5. Knowing the selector grammar once pays off everywhere.</span></div>
</div>
<p>6 questions, 10 minutes. Answer from the mechanism, not from memory — every option is plausible if you are guessing.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Kiểm tra</span>
<h2>Chương 3 đã dựng được gì</h2>
<p class="lead">Sáu câu về định tuyến ở tầng 3 — room là abstraction bạn cần, namespace là cái bạn hầu như không cần.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Một room chỉ là một chuỗi trong một Set</span><span class="lz-d">Không có object room nào để tạo hay huỷ. Join là thêm một chuỗi; leave là bỏ nó đi; một room không còn thành viên thì đơn giản là thôi tồn tại. Đó là lý do việc "dọn dẹp" room thường không phải vấn đề.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Namespace là một kết nối riêng, room thì không</span><span class="lz-d">Một namespace ghép kênh thành một kết nối Socket.IO riêng biệt với middleware và handler của riêng nó. Hầu hết thiết kế với tới namespace thực ra chỉ cần room cộng một tiền tố tên sự kiện, với một phần nhỏ độ phức tạp.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Các selector broadcast ghép được với nhau</span><span class="lz-d">to, in, except và volatile nối chuỗi được, và cùng cách nối đó dùng được cho các method adapter ở Chương 5. Học ngữ pháp selector một lần là có lợi ở mọi nơi.</span></div>
</div>
<p>6 câu, 10 phút. Hãy trả lời từ cơ chế, đừng trả lời từ trí nhớ — mọi phương án đều hợp lý nếu bạn đang đoán.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 600,
        questions: [
          {
            question: 'What does <code>io.to(&quot;A&quot;).to(&quot;B&quot;).emit(&quot;x&quot;)</code> do?|||<code>io.to(&quot;A&quot;).to(&quot;B&quot;).emit(&quot;x&quot;)</code> làm gì?',
            options: [
              'UNION — every socket in A OR B receives it once, the same as <code>io.to([&quot;A&quot;, &quot;B&quot;])</code>|||UNION — mọi socket ở A HOẶC B nhận đúng một lần, giống <code>io.to([&quot;A&quot;, &quot;B&quot;])</code>',
              'INTERSECTION — only sockets in BOTH A AND B|||INTERSECTION — chỉ socket ở CẢ A VÀ B',
              'Only to A — B is ignored|||Chỉ đến A — B bị bỏ qua',
              'Only to B — chained call overrides|||Chỉ đến B — chain call ghi đè',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'This repo (3,935 lines of gateway in 8 files) uses how many namespaces?|||Kho này (3.935 dòng gateway trong 8 tệp) dùng bao nhiêu namespace?',
            options: [
              'Zero — feature separation via room prefixes and event name conventions is enough; namespaces only pay off for hard walls (different auth, multi-tenant, or team boundaries)|||Không — tách feature bằng room prefix và event name convention là đủ; namespace chỉ có lãi cho bức tường cứng (auth khác, multi-tenant, hay biên giới team)',
              'Five, one per feature|||Năm, một per feature',
              'One (the default \'/\')|||Một (default \'/\')',
              'Two (users and admins)|||Hai (user và admin)',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A host disconnects from a listen-together room. What happens to <code>hostState.get(roomId)</code>?|||Host disconnect khỏi listen-together room. Chuyện gì với <code>hostState.get(roomId)</code>?',
            options: [
              'It leaks unless you cleanup manually — the socket.io adapter deletes the room from its own rooms Map, but does NOT touch your app state; you must hook <code>disconnect</code> and delete state yourself|||Nó leak nếu không cleanup thủ công — adapter socket.io xoá room khỏi rooms Map của mình, nhưng KHÔNG đụng app state của bạn; bạn phải hook <code>disconnect</code> và xoá state',
              'Automatically deleted with the room|||Tự động xoá cùng room',
              'Marked as stale but kept for reconnect|||Đánh dấu stale nhưng giữ cho reconnect',
              'Moved to Redis|||Chuyển sang Redis',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A typing indicator uses <code>io.to(room).emit(&quot;typing&quot;)</code>. What&#39;s the bug and fix?|||Typing indicator dùng <code>io.to(room).emit(&quot;typing&quot;)</code>. Bug và fix?',
            options: [
              'The typer sees their OWN typing indicator (io.to includes the sender). Fix: <code>socket.to(room).emit(&quot;typing&quot;)</code> which excludes the sender|||Người gõ tự thấy typing indicator của MÌNH (io.to bao gồm sender). Fix: <code>socket.to(room).emit(&quot;typing&quot;)</code> loại trừ sender',
              'Bug: message doesn\'t reach anyone; fix: use io.emit|||Bug: message không đến ai; fix: dùng io.emit',
              'Bug: infinite loop; fix: use volatile|||Bug: vòng lặp vô hạn; fix: dùng volatile',
              'No bug — this is correct usage|||Không bug — đây là cách dùng đúng',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Using <code>volatile.emit</code> for chat messages. What&#39;s the outcome?|||Dùng <code>volatile.emit</code> cho chat messages. Kết quả gì?',
            options: [
              'Messages get DROPPED when client is briefly slow (e.g., transport close during Wi-Fi hop). Chat loses messages unpredictably. volatile is only for high-frequency low-value data like cursor position|||Tin nhắn bị DROP khi client chậm thoáng qua (ví dụ transport close khi chuyển Wi-Fi). Chat mất tin không đoán được. volatile chỉ cho data tần số cao giá trị thấp như con trỏ',
              'Messages arrive faster|||Tin nhắn đến nhanh hơn',
              'Same as regular emit|||Giống emit thường',
              'Messages queue up for weeks|||Tin nhắn xếp hàng nhiều tuần',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You want to name a new event. Which is best?|||Bạn muốn đặt tên event mới. Cái nào tốt nhất?',
            options: [
              '<code>notes:updated</code> — feature prefix + verb, follows this repo\'s convention across 36 event names with 0 clashes. Grep-friendly and never overlaps reserved names|||<code>notes:updated</code> — prefix feature + verb, theo convention của kho qua 36 event name với 0 clash. Grep dễ và không bao giờ đụng reserved',
              '<code>update</code> — short and clean|||<code>update</code> — ngắn gọn',
              '<code>message</code> — familiar|||<code>message</code> — quen',
              '<code>connect</code> — reused from socket.io|||<code>connect</code> — dùng lại từ socket.io',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },

  ],
};
