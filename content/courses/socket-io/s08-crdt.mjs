import G08_1 from './giang/sio-08-1.mjs';
import G08_2 from './giang/sio-08-2.mjs';
import G08_3 from './giang/sio-08-3.mjs';
import G08_4 from './giang/sio-08-4.mjs';
import G08_5 from './giang/sio-08-5.mjs';
const REF = '?ref=%2Fcourses%2Fsocket-io%2Flearn&reflabel=Socket.IO';
/**
 * Socket.IO — Chương 8: CRDT collaboration với Yjs.
 * Đo: notes-collaboration.gateway.ts của kho DÙNG Hocuspocus + Yjs — CHÍNH XÁC
 * ví dụ khi socket.io KHÔNG phải công cụ đúng và bạn dùng WebSocket riêng.
 */

export default {
  title: 'Chapter 8 — Collaborative editing: when NOT to use socket.io|||Chương 8 — Soạn thảo cộng tác: khi KHÔNG dùng socket.io',
  slug: 'io-ch8-crdt',
  description: 'Sáu bài về Yjs + Hocuspocus (WebSocket riêng, không qua socket.io). CRDT khác event; document sync khác message pass. Kho này có cả hai đường và bài này giải thích vì sao.',
  sortOrder: 9,
  lessons: [

    {
      title: '8.1 — Two WebSocket servers in one repo: why|||8.1 — Hai WebSocket server trong một kho: vì sao',
      slug: 'io-8-1-hai-ws',
      type: 'VIDEO',
      description: 'Kho này chạy socket.io (messaging) + Hocuspocus (notes) VÀ device gateway (Maker Lab) — ba WebSocket server trên cùng HTTP server. Không xung đột vì path khác nhau.',
      content: `
${G08_1}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>Two WebSocket servers in one repo: why</h2>
<p class="lead">This repo actually runs THREE WebSocket servers on one HTTP server <em>(measured 14/11/2026: <strong>four</strong> endpoints — CT Work docs added a second Hocuspocus on <code>/notes-collaboration/work-docs</code>)</em>: socket.io (messaging), Hocuspocus for Yjs (notes), and a raw WebSocket gateway (Maker Lab). Each is a deliberate choice for what socket.io does or does not do well.</p>

<h3>The three</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">socket.io</span><span class="lz-nsub">path: /socket.io/</span></span>
<span class="lz-nbody">Messaging, calls, listen-together, presence. Event-based, rooms, polling fallback. Lessons 0-7.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Hocuspocus (Yjs)</span><span class="lz-nsub">path: /notes-collaboration</span></span>
<span class="lz-nbody">Notes CRDT sync. Y.Doc updates streamed in both directions. Not events — binary Yjs updates. This lesson.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">device gateway (raw ws)</span><span class="lz-nsub">path: /device-ws</span></span>
<span class="lz-nbody">Maker Lab devices (ESP32). Not socket.io, because device firmware has no socket.io-client. Raw WebSocket plus JSON.</span>
</div>
</div>

<h3>One HTTP server, different paths</h3>
<pre><code class="language-ts">// src/index.ts
const server = http.createServer(app);

initSocketServer(server);              // /socket.io/  — socket.io
initNotesCollaborationGateway(server); // /notes-collaboration — Hocuspocus
await initWorkDocsCollaborationGateway(server); // /notes-collaboration/work-docs — Hocuspocus #2
initDeviceGateway(server);             // /device-ws — raw ws   (src/index.ts:751-764)
</code></pre>

<p>HTTP server emit event <code>upgrade</code> when a client requests a WebSocket upgrade. Each handler checks the URL path and only takes the connection if it matches — no conflict. The comment in <code>src/socket/device.gateway.ts</code> records this design.</p>

<h3>Why notes do NOT use socket.io</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Yjs is a binary CRDT protocol</span><span class="lz-d">An update is a binary Uint8Array (~10-100 bytes typically). It is not event-shaped. Socket.io's event framing adds overhead you do not need.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Yjs sync is already ordered internally</span><span class="lz-d">CRDTs are commutative — applying update A before or after B yields the same result. Socket.io's acks and ordering are unnecessary. Pure overhead.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Hocuspocus already exists</span><span class="lz-d">Hocuspocus is a production-ready, Yjs-compatible WebSocket server. It handles auth, awareness, persistence and Redis pub/sub. There is nothing to build on top of socket.io.</span></div>
</div>

<h3>How this repo calls Hocuspocus</h3>
<pre><code class="language-ts">// src/socket/notes-collaboration.gateway.ts
const collaborationServer = new Hocuspocus({
  extensions: [
    new Redis({ host: config.redis.host }),        // sync cross-worker
    ...noteRealtimeExtensions,                     // custom auth
  ],
  async onAuthenticate({ token }) {
    return await authenticateNoteRealtimeToken(token);
  },
  async onChange({ documentName, document }) {
    scheduleDbPersist(documentName, document);
  },
});

const wsServer = new WebSocketServer({ noServer: true });
server.on('upgrade', (req, socket, head) =&gt; {
  if (!req.url?.startsWith(WS_PATH)) return;   // repo: new URL(...).pathname !== WS_PATH — EXACT match; startsWith would also grab /notes-collaboration/work-docs
  wsServer.handleUpgrade(req, socket, head, (ws) =&gt; {
    collaborationServer.handleConnection(ws, req);
  });
});
</code></pre>

<div class="callout ok">
<p><strong>Three WebSocket servers sharing one HTTP server and port.</strong> Only ONE port, 3000, is open. Nginx proxies to three different paths. Each WS server handles its own path. Simple and clean.</p>
</div>

<h3>When to choose Yjs/CRDT over socket.io</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">rich-text editing by several people at once</span><span class="lz-lnote">Google Docs style. Concurrent edits with no conflicts and no locks. Yjs plus Tiptap is the standard combination</span></div>
<div class="lz-layer"><span class="lz-lname">Figma-style canvas</span><span class="lz-lnote">Shapes, positions and styles that every user edits at once. The CRDT merges them for you</span></div>
<div class="lz-layer"><span class="lz-lname">offline-first apps</span><span class="lz-lnote">A local Y.Doc that syncs when online. Each client is the source of truth for its own part</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — building collaborative editing out of socket.io events.</strong> You emit &quot;user typed X at position Y&quot;. Concurrent edits produce a merge conflict, and the document falls apart. Yjs solves this with a CRDT — every update commutes, so there are no conflicts. Do not reinvent CRDTs on top of socket.io.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> This repo runs three WebSocket servers side by side on one HTTP server (paths: <code>/socket.io/</code>, <code>/notes-collaboration</code>, <code>/device-ws</code>) because socket.io is good at events and rooms but NOT suited to binary CRDT sync (Yjs/Hocuspocus) or device firmware (raw WS plus JSON) — each tool for its proper use case.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Find the three WebSocket servers mounted on the one HTTP server and note their paths: <code>/socket.io/</code>, <code>/notes-collaboration</code>, <code>/device-ws</code>.</li>
<li>For each, state the job it does and why socket.io is or is not the right tool (events/rooms vs binary CRDT vs device firmware).</li>
<li>Confirm they share one HTTP server and port but do not share a protocol.</li>
</ol>
<p><strong>Done when:</strong> you can name all three servers, their paths, and why each uses the tool it does.</p></div>

<h3>🔬 Measured: four endpoints, one &#39;upgrade&#39; event</h3>
<p>Counted in the repo (14/11/2026): <code>src/index.ts</code> mounts four things on the one HTTP server, three gateways add their own <code>&#39;upgrade&#39;</code> listener (engine.io adds the fourth), nginx has one <code>location</code> per path:</p>
<div class="out">$ cd ~/api-backend &amp;&amp; grep -n "initSocketServer(server)\\|initNotesCollaborationGateway(server)\\|initWorkDocsCollaborationGateway(server)\\|initDeviceGateway(server)" src/index.ts
751:const sio = initSocketServer(server);
756:initNotesCollaborationGateway(server);
758:await initWorkDocsCollaborationGateway(server);
764:initDeviceGateway(server);
$ grep -rn "on('upgrade'" src/socket/ | grep -v test     # + 1 listener engine.io tự gắn cho /socket.io/
src/socket/device.gateway.ts:955:  httpServer.on('upgrade', (req: IncomingMessage, socket: Duplex, head: Buffer) =&gt; {
src/socket/notes-collaboration.gateway.ts:283:  httpServer.on('upgrade', (request, socket, head) =&gt; {
src/socket/work-docs-collaboration.gateway.ts:379:  httpServer.on('upgrade', (request, socket, head) =&gt; {
$ grep -n "const WS_PATH =\\|WORK_COLLAB_PATH =" src/socket/*.ts
src/socket/device.gateway.ts:70:const WS_PATH = '/device-ws';
src/socket/notes-collaboration.gateway.ts:22:const WS_PATH = '/notes-collaboration';
src/socket/work-docs-collaboration.gateway.ts:36:export const WORK_COLLAB_PATH = '/notes-collaboration/work-docs';
$ grep -n "location /socket.io/\\|location /notes-collaboration\\|location /device-ws" nginx/nginx.conf
815:        location /socket.io/ {
838:        location /notes-collaboration {
866:        location /device-ws {
$ wc -l src/socket/messaging.socket.ts src/socket/notes-collaboration.gateway.ts src/socket/work-docs-collaboration.gateway.ts src/socket/device.gateway.ts
     668 src/socket/messaging.socket.ts
     300 src/socket/notes-collaboration.gateway.ts
     410 src/socket/work-docs-collaboration.gateway.ts
    1113 src/socket/device.gateway.ts
    2491 total</div>
<p>A lab server built on the same pattern (socket.io 4.8.3, @hocuspocus/server 2.15.3, ws 8.21.2) — each path reaches exactly its server; a path nobody owns is ended by engine.io (<code>destroyUpgrade</code>, default 1000 ms):</p>
<div class="out">$ node ba.mjs &amp;   node do81.mjs 19900 io notes device la
/socket.io/              60 ms · nối bằng websocket → sau 1,5 s: websocket · hỏi → "socket.io tra loi"
/notes-collaboration     21 ms · Hocuspocus: synced
/device-ws               5 ms · 101 mở · trả: {"t":"echo","nhan":{"t":"hello","may":"esp32"}}
/khong-ai-nhan        1018 ms · lỗi: socket hang up
$ # log server
[ba] :19900 · KIEU=dung · socket.io có · xác thực device 0 ms · listener 'upgrade' = 3</div>
<p>The classic mistake — the device gateway written as <code>new WebSocketServer({ server, path: &#39;/device-ws&#39; })</code>. ws then answers every other upgrade with 400:</p>
<div class="out">$ KIEU=bay node ba.mjs &amp;   node do81.mjs 19900 io notes device la     # device: new WebSocketServer({ server, path: '/device-ws' })
/socket.io/              29 ms · nối bằng polling → sau 1,5 s: polling · hỏi → "socket.io tra loi"
/notes-collaboration   5008 ms · Hocuspocus: CHƯA synced sau 5 s (status connecting)
/device-ws               4 ms · 101 mở · trả: {"t":"echo","nhan":{"t":"hello","may":"esp32"}}
/khong-ai-nhan           1 ms · HTTP 400 (không nâng cấp)
$ # log server
[ba] :19900 · KIEU=bay · socket.io có · xác thực device 0 ms · listener 'upgrade' = 3</div>
<div class="callout warn"><p><strong>Read it:</strong> socket.io never upgrades (stays on polling), Hocuspocus never syncs, an unknown path gets HTTP 400 — and the device path still works, so it looks like “other features are slow”. This is exactly what the comment at <code>device.gateway.ts:938</code> warns about.</p></div>
<p>A hidden one-second deadline: the device gateway authenticates (a DB query) <em>before</em> <code>handleUpgrade</code>. Auth delayed in the lab:</p>
<div class="out">$ TRE_AUTH=900 node ba.mjs &amp;    node do81.mjs 19900 device       # xác thực thiết bị mất 0,9 s
/device-ws             918 ms · 101 mở · trả: {"t":"echo","nhan":{"t":"hello","may":"esp32"}}
$ TRE_AUTH=1500 node ba.mjs &amp;   node do81.mjs 19900 device la    # 1,5 s — như Prisma cạn pool
/device-ws            1005 ms · lỗi: socket hang up
/khong-ai-nhan        1004 ms · lỗi: socket hang up
$ IO=0 TRE_AUTH=1500 node ba.mjs &amp;   node do81.mjs 19900 device la   # bỏ socket.io đi
/device-ws            1510 ms · 101 mở · trả: {"t":"echo","nhan":{"t":"hello","may":"esp32"}}
/khong-ai-nhan        5003 ms · lỗi: Opening handshake has timed out
$ grep -n "destroyUpgrade" node_modules/engine.io/build/server.js
668:        const destroyUpgradeTimeout = options.destroyUpgradeTimeout || 1000;
697:                else if (false !== options.destroyUpgrade) {
710:                    }, destroyUpgradeTimeout);
$ grep -n "auth timeout 8s\\|destroyUpgrade" ~/api-backend/src/socket/device.gateway.ts ~/api-backend/src/socket/messaging.socket.ts
src/socket/device.gateway.ts:972:            setTimeout(() =&gt; rej(new Error('auth timeout 8s')), 8_000).unref?.(),</div>
<div class="callout bad"><p><strong>Latent bug in this repo:</strong> <code>device.gateway.ts:972</code> gives authentication 8 s and answers a timeout with an <code>auth-timeout</code> status line, but engine.io (attached by <code>messaging.socket.ts:344</code> without <code>destroyUpgrade: false</code>) ends any upgrade socket that nothing has written to after <strong>1 s</strong>. Measured: 0.9 s ⇒ opens (918 ms); 1.5 s ⇒ <em>socket hang up</em> at 1005 ms; same 1.5 s without socket.io ⇒ opens at 1510 ms. When Prisma&#39;s pool is busy a board gets a bare hang-up, never the status line. Fix: <code>destroyUpgrade: false</code> plus your own catch-all listener for unknown paths, or answer within 1 s.</p></div>
<div class="callout info"><p><strong>The Hocuspocus snippet above is illustrative.</strong> The real <code>notes-collaboration.gateway.ts</code>: document names are <code>note:42</code>; storage runs in <code>onStoreDocument</code> with <code>debounce: 1500</code> / <code>maxDebounce: 10000</code> (not in <code>onChange</code>); <code>onAuthenticate</code> sets <code>connection.readOnly</code>; the path check is an exact pathname match. Lessons 8.3–8.5 measure each of these.</p></div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash"><span class="tok-comment"># lab c8: MỘT http server, BA WebSocket server — chép khuôn src/index.ts + các gateway của kho</span>
npm i socket.io@4.8.3 socket.io-client@4.8.3 ws@8 @hocuspocus/server@2.15.3 @hocuspocus/provider@2.15.3 yjs@13.6.32
node ba.mjs &amp;                         <span class="tok-comment">  # :19900 · socket.io + Hocuspocus /notes-collaboration + ws thô /device-ws (noServer + lọc pathname)</span>
node do81.mjs 19900 io notes device la<span class="tok-comment">  # gõ cửa từng đường + một đường không ai nhận</span>
KIEU=bay node ba.mjs &amp;                <span class="tok-comment">  # device = new WebSocketServer({ server, path }) — xem socket.io kẹt polling</span>
TRE_AUTH=1500 node ba.mjs &amp;           <span class="tok-comment">  # xác thực thiết bị 1,5 s TRƯỚC handleUpgrade — engine.io cắt ở 1 s</span>
IO=0 TRE_AUTH=1500 node ba.mjs &amp;      <span class="tok-comment">  # bỏ socket.io: nối được ở 1,5 s, nhưng đường lạ treo mãi</span></code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-9-2-websocket" target="_blank" rel="noopener"><span class="lc-ico">📡</span><span class="lc-body"><span class="lc-title">Networking · 9.2 — WebSocket: upgrade, frames and heartbeat</span><span class="lc-sub">The HTTP Upgrade handshake every gateway here shares</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nginx/learn?lessonSlug=nginx-3-5-websocket" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Nginx · 3.5 — WebSocket: the upgrade Nginx strips ON PURPOSE</span><span class="lc-sub">One location per path, one port</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-3-4-eventemitter" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 3.4 — EventEmitter</span><span class="lc-sub">&#39;upgrade&#39; is just an event: every listener is called</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Three WS servers</span><span class="v">socket.io, notes-collaboration (Yjs), devices (raw WS) on one HTTP server.</span></div>
  <div class="kv"><span class="k">Path routing</span><span class="v">Each server is mounted on a distinct path to share the port.</span></div>
  <div class="kv"><span class="k">socket.io fit</span><span class="v">Great for events and rooms; not for binary CRDT or firmware.</span></div>
  <div class="kv"><span class="k">CRDT sync</span><span class="v">Yjs/Hocuspocus — binary, needs its own protocol.</span></div>
  <div class="kv"><span class="k">Device firmware</span><span class="v">Raw WS plus JSON — minimal footprint for microcontrollers.</span></div>
  <div class="kv"><span class="k">Right tool per job</span><span class="v">Pick the protocol by the workload, not one size for all.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>This repo runs three WebSocket servers side by side on one HTTP server.</li><li>Their paths are <code>/socket.io/</code>, <code>/notes-collaboration</code>, <code>/device-ws</code>.</li><li>socket.io is good at events and rooms but not binary CRDT sync.</li><li>Nor is it suited to device firmware (raw WS plus JSON).</li><li>Each tool is used for its proper use case.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Yjs — CRDT framework</span><span class="lc-sub">yjs.dev — docs + examples. Đọc &quot;What are CRDTs?&quot; trước.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Hocuspocus — production Yjs server</span><span class="lc-sub">hocuspocus.dev — server phù hợp với Yjs, có auth + persistence + Redis.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Hai WebSocket server trong một kho: vì sao</h2>
<p class="lead">Kho này thật ra chạy BA WebSocket server trên một HTTP server <em>(đo 14/11/2026: <strong>bốn</strong> điểm cuối — tài liệu CT Work thêm một Hocuspocus thứ hai ở <code>/notes-collaboration/work-docs</code>)</em>: socket.io (messaging), Hocuspocus cho Yjs (notes), và raw WebSocket gateway (Maker Lab). Mỗi cái là chọn có chủ đích cho việc socket.io làm hay không làm được.</p>

<h3>Ba cái</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">socket.io</span><span class="lz-nsub">path: /socket.io/</span></span>
<span class="lz-nbody">Messaging, calls, listen-together, presence. Event-based, rooms, fallback polling. Bài 0-7.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Hocuspocus (Yjs)</span><span class="lz-nsub">path: /notes-collaboration</span></span>
<span class="lz-nbody">Notes CRDT sync. Y.Doc updates streamed đôi chiều. Không phải events — là binary Yjs updates. Bài này.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">device gateway (raw ws)</span><span class="lz-nsub">path: /device-ws</span></span>
<span class="lz-nbody">Maker Lab devices (ESP32). Không dùng socket.io vì device firmware không có socket.io-client. Raw WebSocket + JSON.</span>
</div>
</div>

<h3>Cùng một HTTP server, khác path</h3>
<pre><code class="language-ts">// src/index.ts
const server = http.createServer(app);

initSocketServer(server);              // /socket.io/  — socket.io
initNotesCollaborationGateway(server); // /notes-collaboration — Hocuspocus
await initWorkDocsCollaborationGateway(server); // /notes-collaboration/work-docs — Hocuspocus #2
initDeviceGateway(server);             // /device-ws — raw ws   (src/index.ts:751-764)
</code></pre>

<p>HTTP server emit event <code>upgrade</code> khi client request WebSocket upgrade. Mỗi handler kiểm URL path và chỉ xử lý nếu match — không xung đột. Comment trong <code>src/socket/device.gateway.ts</code> ghi lại design này.</p>

<h3>Vì sao KHÔNG dùng socket.io cho notes</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Yjs là CRDT binary protocol</span><span class="lz-d">Update là binary Uint8Array (~10-100 byte typical). Không phải event-based. Socket.io event framing thêm overhead không cần.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Yjs sync bên trong đã ordered</span><span class="lz-d">CRDT commutative — update A áp trước hay sau B đều ra cùng result. Không cần socket.io ack/ordering. Overhead thừa.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Hocuspocus có sẵn</span><span class="lz-d">Hocuspocus là Yjs-compatible WebSocket server production-ready. Xử lý auth, awareness, persistence, redis pub/sub. Không cần build từ socket.io.</span></div>
</div>

<h3>Kho này gọi Hocuspocus</h3>
<pre><code class="language-ts">// src/socket/notes-collaboration.gateway.ts
const collaborationServer = new Hocuspocus({
  extensions: [
    new Redis({ host: config.redis.host }),        // sync cross-worker
    ...noteRealtimeExtensions,                     // custom auth
  ],
  async onAuthenticate({ token }) {
    return await authenticateNoteRealtimeToken(token);
  },
  async onChange({ documentName, document }) {
    scheduleDbPersist(documentName, document);
  },
});

const wsServer = new WebSocketServer({ noServer: true });
server.on('upgrade', (req, socket, head) =&gt; {
  if (!req.url?.startsWith(WS_PATH)) return;   // repo: new URL(...).pathname !== WS_PATH — EXACT match; startsWith would also grab /notes-collaboration/work-docs
  wsServer.handleUpgrade(req, socket, head, (ws) =&gt; {
    collaborationServer.handleConnection(ws, req);
  });
});
</code></pre>

<div class="callout ok">
<p><strong>Ba WebSocket server cùng share HTTP server + port.</strong> Chỉ có MỘT port 3000 mở. Nginx proxy vào ba path khác nhau. Mỗi WS server xử lý path của mình. Simple và clean.</p>
</div>

<h3>Khi nào chọn Yjs/CRDT thay socket.io</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">rich text editing đa người cùng lúc</span><span class="lz-lnote">Google Docs style. Concurrent edits mà không conflict, no lock. Yjs + Tiptap là combo chuẩn</span></div>
<div class="lz-layer"><span class="lz-lname">Figma-style canvas</span><span class="lz-lnote">Shapes, positions, styles mọi user chỉnh cùng. CRDT tự merge</span></div>
<div class="lz-layer"><span class="lz-lname">offline-first apps</span><span class="lz-lnote">Y.Doc local, sync khi online. Mỗi client là source of truth cho phần của mình</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — build collaborative editing bằng socket.io events.</strong> Bạn emit &quot;user typed X at position Y&quot;. Concurrent edits = merge conflict = document vỡ. Yjs giải quyết bằng CRDT — mọi update commute, không conflict. Đừng reinvent CRDT trên socket.io.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Kho này chạy ba WebSocket server song song trên một HTTP server (paths: <code>/socket.io/</code>, <code>/notes-collaboration</code>, <code>/device-ws</code>) vì socket.io tốt cho events + rooms nhưng KHÔNG phù hợp cho CRDT binary sync (Yjs/Hocuspocus) hay device firmware (raw WS + JSON) — mỗi tool cho đúng use case.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Tìm ba WebSocket server gắn trên một HTTP server và để ý path của chúng: <code>/socket.io/</code>, <code>/notes-collaboration</code>, <code>/device-ws</code>.</li>
<li>Với mỗi cái, nêu việc nó làm và vì sao socket.io là (hoặc không là) tool đúng (events/rooms vs binary CRDT vs device firmware).</li>
<li>Xác nhận chúng share một HTTP server và port nhưng không share một protocol.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn gọi tên được cả ba server, path của chúng, và vì sao mỗi cái dùng tool nó dùng.</p></div>

<h3>🔬 Đo thật: bốn điểm cuối, một sự kiện &#39;upgrade&#39;</h3>
<p>Đếm trong kho (14/11/2026): <code>src/index.ts</code> gắn bốn thứ lên một HTTP server, ba gateway tự thêm listener <code>&#39;upgrade&#39;</code> (engine.io thêm cái thứ tư), nginx có một <code>location</code> cho mỗi đường:</p>
<div class="out">$ cd ~/api-backend &amp;&amp; grep -n "initSocketServer(server)\\|initNotesCollaborationGateway(server)\\|initWorkDocsCollaborationGateway(server)\\|initDeviceGateway(server)" src/index.ts
751:const sio = initSocketServer(server);
756:initNotesCollaborationGateway(server);
758:await initWorkDocsCollaborationGateway(server);
764:initDeviceGateway(server);
$ grep -rn "on('upgrade'" src/socket/ | grep -v test     # + 1 listener engine.io tự gắn cho /socket.io/
src/socket/device.gateway.ts:955:  httpServer.on('upgrade', (req: IncomingMessage, socket: Duplex, head: Buffer) =&gt; {
src/socket/notes-collaboration.gateway.ts:283:  httpServer.on('upgrade', (request, socket, head) =&gt; {
src/socket/work-docs-collaboration.gateway.ts:379:  httpServer.on('upgrade', (request, socket, head) =&gt; {
$ grep -n "const WS_PATH =\\|WORK_COLLAB_PATH =" src/socket/*.ts
src/socket/device.gateway.ts:70:const WS_PATH = '/device-ws';
src/socket/notes-collaboration.gateway.ts:22:const WS_PATH = '/notes-collaboration';
src/socket/work-docs-collaboration.gateway.ts:36:export const WORK_COLLAB_PATH = '/notes-collaboration/work-docs';
$ grep -n "location /socket.io/\\|location /notes-collaboration\\|location /device-ws" nginx/nginx.conf
815:        location /socket.io/ {
838:        location /notes-collaboration {
866:        location /device-ws {
$ wc -l src/socket/messaging.socket.ts src/socket/notes-collaboration.gateway.ts src/socket/work-docs-collaboration.gateway.ts src/socket/device.gateway.ts
     668 src/socket/messaging.socket.ts
     300 src/socket/notes-collaboration.gateway.ts
     410 src/socket/work-docs-collaboration.gateway.ts
    1113 src/socket/device.gateway.ts
    2491 total</div>
<p>Một server lab dựng đúng khuôn đó (socket.io 4.8.3, @hocuspocus/server 2.15.3, ws 8.21.2) — mỗi đường tới đúng server của nó; đường không ai nhận bị engine.io cắt (<code>destroyUpgrade</code>, mặc định 1000 ms):</p>
<div class="out">$ node ba.mjs &amp;   node do81.mjs 19900 io notes device la
/socket.io/              60 ms · nối bằng websocket → sau 1,5 s: websocket · hỏi → "socket.io tra loi"
/notes-collaboration     21 ms · Hocuspocus: synced
/device-ws               5 ms · 101 mở · trả: {"t":"echo","nhan":{"t":"hello","may":"esp32"}}
/khong-ai-nhan        1018 ms · lỗi: socket hang up
$ # log server
[ba] :19900 · KIEU=dung · socket.io có · xác thực device 0 ms · listener 'upgrade' = 3</div>
<p>Lỗi kinh điển — viết gateway thiết bị thành <code>new WebSocketServer({ server, path: &#39;/device-ws&#39; })</code>. ws khi đó trả 400 cho mọi upgrade khác:</p>
<div class="out">$ KIEU=bay node ba.mjs &amp;   node do81.mjs 19900 io notes device la     # device: new WebSocketServer({ server, path: '/device-ws' })
/socket.io/              29 ms · nối bằng polling → sau 1,5 s: polling · hỏi → "socket.io tra loi"
/notes-collaboration   5008 ms · Hocuspocus: CHƯA synced sau 5 s (status connecting)
/device-ws               4 ms · 101 mở · trả: {"t":"echo","nhan":{"t":"hello","may":"esp32"}}
/khong-ai-nhan           1 ms · HTTP 400 (không nâng cấp)
$ # log server
[ba] :19900 · KIEU=bay · socket.io có · xác thực device 0 ms · listener 'upgrade' = 3</div>
<div class="callout warn"><p><strong>Đọc:</strong> socket.io không bao giờ nâng cấp (kẹt polling), Hocuspocus không bao giờ đồng bộ, đường lạ nhận HTTP 400 — còn đường thiết bị vẫn chạy, nên lỗi trông như “các tính năng khác hơi chậm”. Đúng điều chú thích ở <code>device.gateway.ts:938</code> cảnh báo.</p></div>
<p>Hạn chót một giây giấu kín: gateway thiết bị xác thực (truy vấn DB) <em>trước</em> <code>handleUpgrade</code>. Làm chậm xác thực trong lab:</p>
<div class="out">$ TRE_AUTH=900 node ba.mjs &amp;    node do81.mjs 19900 device       # xác thực thiết bị mất 0,9 s
/device-ws             918 ms · 101 mở · trả: {"t":"echo","nhan":{"t":"hello","may":"esp32"}}
$ TRE_AUTH=1500 node ba.mjs &amp;   node do81.mjs 19900 device la    # 1,5 s — như Prisma cạn pool
/device-ws            1005 ms · lỗi: socket hang up
/khong-ai-nhan        1004 ms · lỗi: socket hang up
$ IO=0 TRE_AUTH=1500 node ba.mjs &amp;   node do81.mjs 19900 device la   # bỏ socket.io đi
/device-ws            1510 ms · 101 mở · trả: {"t":"echo","nhan":{"t":"hello","may":"esp32"}}
/khong-ai-nhan        5003 ms · lỗi: Opening handshake has timed out
$ grep -n "destroyUpgrade" node_modules/engine.io/build/server.js
668:        const destroyUpgradeTimeout = options.destroyUpgradeTimeout || 1000;
697:                else if (false !== options.destroyUpgrade) {
710:                    }, destroyUpgradeTimeout);
$ grep -n "auth timeout 8s\\|destroyUpgrade" ~/api-backend/src/socket/device.gateway.ts ~/api-backend/src/socket/messaging.socket.ts
src/socket/device.gateway.ts:972:            setTimeout(() =&gt; rej(new Error('auth timeout 8s')), 8_000).unref?.(),</div>
<div class="callout bad"><p><strong>Lỗi tiềm ẩn của kho:</strong> <code>device.gateway.ts:972</code> cho xác thực 8 s và trả dòng trạng thái <code>auth-timeout</code> khi quá hạn, nhưng engine.io (gắn ở <code>messaging.socket.ts:344</code>, không đặt <code>destroyUpgrade: false</code>) đóng mọi socket upgrade chưa được ghi gì sau <strong>1 s</strong>. Đo: 0,9 s ⇒ mở (918 ms); 1,5 s ⇒ <em>socket hang up</em> ở 1005 ms; cùng 1,5 s nhưng bỏ socket.io ⇒ mở ở 1510 ms. Lúc pool Prisma bận, bo mạch chỉ nhận một cú cúp máy trống, không bao giờ thấy dòng trạng thái. Sửa: <code>destroyUpgrade: false</code> + tự thêm listener dọn đường lạ, hoặc trả lời trong 1 s.</p></div>
<div class="callout info"><p><strong>Đoạn mã Hocuspocus ở trên là minh hoạ.</strong> <code>notes-collaboration.gateway.ts</code> thật: tên tài liệu là <code>note:42</code>; lưu chạy trong <code>onStoreDocument</code> với <code>debounce: 1500</code> / <code>maxDebounce: 10000</code> (không phải trong <code>onChange</code>); <code>onAuthenticate</code> đặt <code>connection.readOnly</code>; kiểm đường là so khớp đúng pathname. Bài 8.3–8.5 đo từng thứ.</p></div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash"><span class="tok-comment"># lab c8: MỘT http server, BA WebSocket server — chép khuôn src/index.ts + các gateway của kho</span>
npm i socket.io@4.8.3 socket.io-client@4.8.3 ws@8 @hocuspocus/server@2.15.3 @hocuspocus/provider@2.15.3 yjs@13.6.32
node ba.mjs &amp;                         <span class="tok-comment">  # :19900 · socket.io + Hocuspocus /notes-collaboration + ws thô /device-ws (noServer + lọc pathname)</span>
node do81.mjs 19900 io notes device la<span class="tok-comment">  # gõ cửa từng đường + một đường không ai nhận</span>
KIEU=bay node ba.mjs &amp;                <span class="tok-comment">  # device = new WebSocketServer({ server, path }) — xem socket.io kẹt polling</span>
TRE_AUTH=1500 node ba.mjs &amp;           <span class="tok-comment">  # xác thực thiết bị 1,5 s TRƯỚC handleUpgrade — engine.io cắt ở 1 s</span>
IO=0 TRE_AUTH=1500 node ba.mjs &amp;      <span class="tok-comment">  # bỏ socket.io: nối được ở 1,5 s, nhưng đường lạ treo mãi</span></code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-9-2-websocket" target="_blank" rel="noopener"><span class="lc-ico">📡</span><span class="lc-body"><span class="lc-title">Networking · 9.2 — WebSocket: nâng cấp, frame và nhịp tim</span><span class="lc-sub">Cú bắt tay HTTP Upgrade mà mọi gateway ở đây dùng chung</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nginx/learn?lessonSlug=nginx-3-5-websocket" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Nginx · 3.5 — WebSocket: cú nâng cấp mà Nginx CỐ Ý gỡ đi</span><span class="lc-sub">Mỗi đường một location, vẫn một cổng</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-3-4-eventemitter" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 3.4 — EventEmitter</span><span class="lc-sub">&#39;upgrade&#39; chỉ là một sự kiện: mọi listener đều được gọi</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Ba WS server</span><span class="v">socket.io, notes-collaboration (Yjs), devices (raw WS) trên một HTTP server.</span></div>
  <div class="kv"><span class="k">Định tuyến theo path</span><span class="v">Mỗi server gắn trên một path riêng để share port.</span></div>
  <div class="kv"><span class="k">socket.io hợp</span><span class="v">Tuyệt cho events và rooms; không cho binary CRDT hay firmware.</span></div>
  <div class="kv"><span class="k">CRDT sync</span><span class="v">Yjs/Hocuspocus — binary, cần protocol riêng.</span></div>
  <div class="kv"><span class="k">Device firmware</span><span class="v">Raw WS cộng JSON — dấu chân nhỏ cho vi điều khiển.</span></div>
  <div class="kv"><span class="k">Đúng tool cho việc</span><span class="v">Chọn protocol theo workload, không một cỡ cho tất cả.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Kho này chạy ba WebSocket server song song trên một HTTP server.</li><li>Path của chúng là <code>/socket.io/</code>, <code>/notes-collaboration</code>, <code>/device-ws</code>.</li><li>socket.io tốt cho events và rooms nhưng không cho CRDT binary sync.</li><li>Nó cũng không hợp cho device firmware (raw WS cộng JSON).</li><li>Mỗi tool dùng cho đúng use case của nó.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Yjs — CRDT framework</span><span class="lc-sub">yjs.dev — docs + examples. Đọc &quot;What are CRDTs?&quot; trước.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Hocuspocus — production Yjs server</span><span class="lc-sub">hocuspocus.dev — server phù hợp với Yjs, có auth + persistence + Redis.</span></span></div>
</div>
`,
    },

    {
      title: '8.2 — CRDT vs event: why merges just work|||8.2 — CRDT vs event: vì sao merge tự động',
      slug: 'io-8-2-crdt',
      type: 'VIDEO',
      description: 'CRDT (Conflict-free Replicated Data Type) — mọi update commute. Two users insert at position 5 simultaneously? CRDT resolves without lock, without conflict, without operator.',
      content: `
${G08_2}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>CRDT vs event: why merges just work</h2>
<p class="lead">The magic of Yjs is that two users can edit the same document at the same position, and there is no conflict. This lesson shows why — CRDTs have a mathematical property that makes merges automatic.</p>

<h3>Event-based (the naive way) — breaks on concurrent edits</h3>
<pre><code class="language-text">Document state: "Hello world"

User A inserts "!" at position 11         Event: insert(11, "!")
User B inserts "?" at position 11         Event: insert(11, "?")

Server nhan hai event, apply theo thu tu:
  Apply A: "Hello world!"
  Apply B: "Hello world?!"     <- A's "!" van con, nhung o vi tri sai

HOAC ngc lai:
  Apply B: "Hello world?"
  Apply A: "Hello world!?"     <- ket qua KHAC

Ket qua PHU THUOC thu tu -&gt; ORDER-DEPENDENT. Client va server co the co document
KHAC nhau. Locking + retry cost cao va complex.
</code></pre>

<h3>CRDT — commute</h3>
<pre><code class="language-text">Yjs data structure gan mot ID GLOBAL LEXICOGRAPHICALLY-ORDERED cho moi character:

Position 11 truoc insert:
  ..."world" [id:99]
Position 11 sau A insert "!":
  ..."world" [id:99] "!" [id:100.A]     <- id includes client-id
Position 11 sau B insert "?":
  ..."world" [id:99] "?" [id:100.B]

Ap CA HAI:
  ..."world" [id:99] [id:100.A: "!"] [id:100.B: "?"]      hoac
  ..."world" [id:99] [id:100.B: "?"] [id:100.A: "!"]

Sort by id -&gt; deterministic! Ket qua giong nhau bat ke thu tu apply.

(measured, yjs 13.6.32: the real ID is (clientID, clock) plus the ID on the LEFT when inserted;
 two items with the same left origin =&gt; lower clientID goes first, whatever arrives first)
</code></pre>

<div class="callout ok">
<p><strong>This is a mathematical property.</strong> Update <code>u</code> và <code>v</code> commute: <code>apply(apply(D, u), v) === apply(apply(D, v), u)</code>. That is why client and server always converge on the SAME state, no matter how large the network delay.</p>
</div>

<h3>The trade — CRDTs are not free</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">a</span><span class="lz-t">memory overhead</span><span class="lz-d">Every character carries a unique ID (~16 bytes). A 10 KB text document can become a 160 KB CRDT structure. Yjs optimises this (delta-encoding the IDs) — usually 2-3× the raw text <em>(measured, 10 KB: typed in order ≈ 1.00 B/char; typed at random spots 16.86 B/char on disk and ≈ 213× the text in RAM)</em></span></div>
<div class="lz-step"><span class="lz-k">b</span><span class="lz-t">tombstones</span><span class="lz-d">A delete does not really delete — it marks a tombstone. That is what makes merges commute. After many edits a document grows even though the text is NO longer <em>(measured: with the default gc the deleted CONTENT is dropped but the IDs stay — 1 KB of text left still weighs 162.2 KB)</em></span></div>
<div class="lz-step"><span class="lz-k">c</span><span class="lz-t">history compaction</span><span class="lz-d">Yjs has <code>snapshot</code> to compact history and remove old tombstones. It needs to run periodically <em>(<strong>correction:</strong> <code>Y.snapshot</code> is for version history and needs <code>gc: false</code>; it removes nothing. Real compaction = merging the update log into one <code>encodeStateAsUpdate</code> — what the repo stores. Rebuilding a fresh doc shrinks it further but anyone still holding the old doc can no longer merge — measured below)</em></span></div>
</div>

<h3>Awareness — not a CRDT, but it comes along</h3>
<pre><code class="language-ts">// Awareness = ephemeral state cua user (cursor position, name, color)
// KHONG persist, KHONG merge — chi broadcast
awareness.setLocalStateField('cursor', { pos: 42 });
awareness.on('change', () =&gt; {
  const states = awareness.getStates();
  // Ve mo user cursor tren UI
});
</code></pre>

<div class="callout">
<p><strong>Awareness is exactly what socket.io is good at.</strong> Presence, cursors, live typing. In the Yjs stack, awareness is a separate feature of y-websocket/Hocuspocus. Functionally it behaves just like lesson 4.1's presence — an ephemeral broadcast.</p>
</div>

<div class="pitfall">
<p><strong>Trap — persisting a Yjs document into a SQL column as JSON.</strong> A Yjs document is binary. If you <code>JSON.stringify</code> it and then store the result, you corrupt the structure. Store it as <code>Y.encodeStateAsUpdate(doc)</code> → binary Uint8Array → column BYTEA/BLOB.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> CRDTs have the mathematical property that updates commute — every apply order gives the same result, so concurrent edits need neither locks nor conflict resolution; the trade is 2-3× the memory plus tombstones (a delete never truly deletes) plus the need for snapshot compaction; awareness (cursors, presence) is a separate ephemeral feature following the same pattern as lesson 4.1.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Make two concurrent edits to a Y.Doc in different orders and confirm the merged result is identical — updates commute.</li>
<li>Delete some text and inspect the document size; note the tombstone that keeps the doc from shrinking.</li>
<li>Run snapshot compaction and compare the size before and after, then reason about the 2-3× memory trade.</li>
</ol>
<p><strong>Done when:</strong> you can show order-independent merges and explain the tombstone plus compaction cost.</p></div>

<h3>🔬 Measured: events drift, a Y.Doc converges</h3>
<p>Events that carry a position, relayed by a real socket.io server with 40 ms of network delay — each side applies its own keystroke at once:</p>
<div class="out">$ node crdt82.mjs sukien     # socket.io chuyển event "chèn ch ở pos" · mỗi bên áp tay mình ngay · trễ mạng 40 ms
1 lần gõ mỗi bên:  An "Hello world?!"   Bình "Hello world!?"   giống nhau? false
200 lần gõ xen kẽ (5 ms/lần, trễ 40 ms): dài 211/211 · khác nhau 186 vị trí · giống nhau? false</div>
<p>The same scene with two Y.Docs (yjs 13.6.32): four runs, swapping the order of applying and the client IDs; then the whole state applied twice more:</p>
<div class="out">$ node crdt82.mjs yjs        # cùng cảnh đó bằng Y.Doc: hai người chèn ở vị trí 11 cùng lúc, đổi thứ tự áp, đổi clientID
clientID An=7 Bình=9 · áp An trước: An "Hello world!?"  Bình "Hello world!?"  giống? true · update của An 10 B
clientID An=7 Bình=9 · áp Bình trước: An "Hello world!?"  Bình "Hello world!?"  giống? true · update của An 10 B
clientID An=9 Bình=7 · áp An trước: An "Hello world?!"  Bình "Hello world?!"  giống? true · update của An 10 B
clientID An=9 Bình=7 · áp Bình trước: An "Hello world?!"  Bình "Hello world?!"  giống? true · update của An 10 B
áp lại toàn bộ trạng thái 2 lần nữa (trùng lặp): "Hello world!?" — không đổi</div>
<div class="out">$ node crdt82.mjs id         # bên trong Y.Text: mỗi mẩu có ID (client, clock) + mẩu bên trái lúc chèn
ID (client 1, clock 0…10)  bên trái gốc —        nội dung "Hello world"
ID (client 7, clock 0)  bên trái gốc (1,10)   nội dung "!"
ID (client 9, clock 0)  bên trái gốc (1,10)   nội dung "?"
thứ tự đọc: Hello world!?</div>
<div class="callout ok"><p><strong>Read it:</strong> with positions, one keystroke each is enough to disagree, and 200 keystrokes left 186 of 211 positions different. With Yjs every run reads the same; the tie between “!” and “?” (same left origin (1,10)) is broken by the lower client ID, not by arrival order.</p></div>
<p>Commute on 900 random edits: 3 people, 300 inserts/deletes each, then every update delivered shuffled plus 50 duplicates:</p>
<div class="out">$ node crdt82.mjs ngaunhien  # 3 người × 300 thao tác chèn/xoá đồng thời · nhận update xáo trộn + bản trùng
trước khi gặp nhau: người 1 dài 119 · người 2 dài 133 · người 3 dài 129
người 1: nhận 650 update (xáo trộn, 50 bản trùng) ⇒ dài 378
người 2: nhận 650 update (xáo trộn, 50 bản trùng) ⇒ dài 378
người 3: nhận 650 update (xáo trộn, 50 bản trùng) ⇒ dài 378
3 bản giống hệt từng ký tự? true · đầu chuỗi: "hjfskuvccnlzbuezcyziasrdspozksovjoupoesh…"</div>
<p>The bill for 10 KB of text — the merged state is what the repo stores (<code>Y.encodeStateAsUpdate</code>):</p>
<div class="out">$ node --expose-gc crdt82.mjs kichthuoc   # 10 KB chữ: byte trên đĩa (encodeStateAsUpdate) và RAM
dán 10 KB một lần                            chữ  10240 ·      1 update, tổng   10.0 KB · trạng thái gộp  10.0 KB (1.00 B/ký tự)
gõ 10 KB từng ký tự, cuối dòng               chữ  10240 ·  10240 update, tổng  199.7 KB · trạng thái gộp  10.0 KB (1.00 B/ký tự)
gõ 10 KB từng ký tự, chỗ ngẫu nhiên          chữ  10240 ·  10240 update, tổng  268.5 KB · trạng thái gộp 168.6 KB (16.86 B/ký tự)
gõ ngẫu nhiên rồi xoá 9 KB (gc: true, mặc định) chữ   1024 ·  19456 update, tổng  367.2 KB · trạng thái gộp 162.2 KB (162.19 B/ký tự)
gõ ngẫu nhiên rồi xoá 9 KB (gc: false)       chữ   1024 ·  19456 update, tổng  367.2 KB · trạng thái gộp 171.2 KB (171.17 B/ký tự)
"nén" bằng cách dựng tài liệu MỚI từ chữ hiện tại: 1.0 KB
người còn giữ bản cũ gõ 1 ký tự ⇒ áp vào tài liệu mới: chữ KHÔNG có 'X' · update treo chờ: có
RAM: 20 Y.Doc, mỗi cái 10 KB gõ chỗ ngẫu nhiên ⇒ heap +2134 KB mỗi tài liệu (≈ 213× chữ)
RAM: 20 Y.Doc, mỗi cái 10 KB gõ cuối dòng ⇒ heap +109 KB mỗi tài liệu (≈ 10.9× chữ)</div>
<p>Awareness (cursor, name) rides next to the doc, and the JSON trap — plus how the repo stores the bytes:</p>
<div class="out">$ node crdt82.mjs awareness  # y-protocols/awareness: con trỏ + tên, KHÔNG nằm trong Y.Doc
awareness An (tên + màu): 51 B · Bình giữ 2 trạng thái (An + chính mình)
di con trỏ 3 lần: mỗi lần gửi LẠI cả trạng thái 84 B (clock 4) — không ghép, không lưu lịch sử
An rời trang (setLocalState null): 8 B ⇒ Bình còn thấy An? không · hết hạn tự động khi im: 30 s · doc vẫn y nguyên: Y.Doc không chứa con trỏ</div>
<div class="out">$ node crdt82.mjs json       # bẫy: lưu update Yjs bằng JSON.stringify
Uint8Array: 56 B · JSON.stringify(Uint8Array): 464 B, bắt đầu {"0":1,"1":1,"2":169,"3":245,"…
JSON.stringify(Buffer): 219 B, bắt đầu {"type":"Buffer","data":[1,1,169…
đọc lại từ JSON: Error: Unexpected end of array
đọc lại từ bytes (BYTEA/Buffer): "Xin chào, đây là ghi chú cộng tác."</div>
<div class="out">$ cd ~/api-backend &amp;&amp; grep -n "encodeStateAsUpdate\\|MAX_DOCUMENT_BYTES =\\|state: Buffer.from" src/socket/notes-collaboration.gateway.ts
23:const MAX_DOCUMENT_BYTES = 4 * 1024 * 1024;
86:  const state = Y.encodeStateAsUpdate(document);
110:        state: Buffer.from(state),
116:        state: Buffer.from(state),
$ grep -n "  state  *Bytes\\|stateVector Bytes" prisma/schema.prisma
5087:  state       Bytes
5088:  stateVector Bytes    @map("state_vector")
15279:  state          Bytes?
$ grep -n "setAwarenessField\\|onAwarenessChange" frontend/src/components/notes/NoteRealtimeEditor.tsx
163:          onAwarenessChange: ({ states }) =&gt; {
187:        provider.setAwarenessField('user', localUser);</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash"><span class="tok-comment"># lab c8: npm i yjs@13.6.32 y-protocols@1.0.7 socket.io@4.8.3 socket.io-client@4.8.3</span>
node crdt82.mjs sukien               <span class="tok-comment">  # event "chèn ở vị trí" qua socket.io: hai bản lệch</span>
node crdt82.mjs yjs                  <span class="tok-comment">  # cùng cảnh bằng Y.Doc: 4 lượt đổi thứ tự / clientID</span>
node crdt82.mjs id                   <span class="tok-comment">  # bên trong Y.Text: (client, clock) + origin</span>
node crdt82.mjs ngaunhien            <span class="tok-comment">  # 3 người × 300 thao tác, update xáo trộn + trùng</span>
node --expose-gc crdt82.mjs kichthuoc<span class="tok-comment">  # byte trên đĩa + RAM cho 10 KB chữ</span>
node crdt82.mjs awareness            <span class="tok-comment">  # con trỏ/tên: ngoài Y.Doc</span>
node crdt82.mjs json                 <span class="tok-comment">  # bẫy JSON.stringify(Uint8Array)</span></code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-7-2-watch" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 7.2 — WATCH: optimistic concurrency without locks</span><span class="lc-sub">Detect the conflict and retry — the approach a CRDT does not need</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-6-3-mutation" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 6.3 — Mutations and optimistic updates</span><span class="lc-sub">Apply locally first, sync afterwards — what every Y.Doc does</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-3-2-buffer" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 3.2 — Buffer: binary data</span><span class="lc-sub">What you store in the BYTEA column</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">CRDT</span><span class="v">A data type whose updates commute — any apply order gives one result.</span></div>
  <div class="kv"><span class="k">Commute</span><span class="v">Order-independence: no locks and no conflict resolution needed.</span></div>
  <div class="kv"><span class="k">Tombstone</span><span class="v">A delete marker — a delete never truly removes the data.</span></div>
  <div class="kv"><span class="k">Snapshot compaction</span><span class="v">Rebuilding the doc to drop accumulated tombstones.</span></div>
  <div class="kv"><span class="k">Memory trade</span><span class="v">CRDTs cost 2-3× the plain memory for their guarantees.</span></div>
  <div class="kv"><span class="k">Awareness</span><span class="v">Cursors/presence — a separate ephemeral feature (like 4.1).</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>CRDT updates commute — every apply order gives the same result.</li><li>So concurrent edits need neither locks nor conflict resolution.</li><li>The trade is 2-3× the memory plus tombstones (a delete never truly deletes).</li><li>That is why snapshot compaction is needed.</li><li>Awareness (cursors, presence) is a separate ephemeral feature, like lesson 4.1.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Yjs — introduction to CRDTs</span><span class="lc-sub">docs.yjs.dev/getting-started/a-collaborative-editor — bài dẫn nhập, kèm ví dụ collaborative editor.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CRDT — Wikipedia</span><span class="lc-sub">en.wikipedia.org/wiki/Conflict-free_replicated_data_type — nền tảng lý thuyết cho commutative merge.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>CRDT vs event: vì sao merge tự động</h2>
<p class="lead">Ma thuật của Yjs là hai user có thể edit cùng document ở cùng position, và không có conflict. Bài này chỉ ra vì sao — CRDT có tính chất mathematical làm merge tự động.</p>

<h3>Event-based (ngây thơ) — vỡ ở concurrent edit</h3>
<pre><code class="language-text">Document state: "Hello world"

User A inserts "!" at position 11         Event: insert(11, "!")
User B inserts "?" at position 11         Event: insert(11, "?")

Server nhan hai event, apply theo thu tu:
  Apply A: "Hello world!"
  Apply B: "Hello world?!"     &lt;- A's "!" van con, nhung o vi tri sai

HOAC nguoc lai:
  Apply B: "Hello world?"
  Apply A: "Hello world!?"     &lt;- ket qua KHAC

Ket qua PHU THUOC thu tu -&gt; ORDER-DEPENDENT. Client va server co the co document
KHAC nhau. Locking + retry cost cao va complex.
</code></pre>

<h3>CRDT — commute</h3>
<pre><code class="language-text">Yjs data structure gan mot ID GLOBAL LEXICOGRAPHICALLY-ORDERED cho moi character:

Position 11 truoc insert:
  ..."world" [id:99]
Position 11 sau A insert "!":
  ..."world" [id:99] "!" [id:100.A]     &lt;- id includes client-id
Position 11 sau B insert "?":
  ..."world" [id:99] "?" [id:100.B]

Ap CA HAI:
  ..."world" [id:99] [id:100.A: "!"] [id:100.B: "?"]      hoac
  ..."world" [id:99] [id:100.B: "?"] [id:100.A: "!"]

Sort by id -&gt; deterministic! Ket qua giong nhau bat ke thu tu apply.

(measured, yjs 13.6.32: the real ID is (clientID, clock) plus the ID on the LEFT when inserted;
 two items with the same left origin =&gt; lower clientID goes first, whatever arrives first)
</code></pre>

<div class="callout ok">
<p><strong>Đây là tính chất mathematical.</strong> Update <code>u</code> và <code>v</code> commute: <code>apply(apply(D, u), v) === apply(apply(D, v), u)</code>. Vì vậy client và server luôn hội tụ về CÙNG state, dù network delay bao nhiêu.</p>
</div>

<h3>Trade off — CRDT không free</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">a</span><span class="lz-t">memory overhead</span><span class="lz-d">Mỗi character có unique ID (~16 byte). Document 10 KB text có thể là 160 KB CRDT structure. Yjs optimize (encode ID delta) — thường 2-3× raw text <em>(đo, 10 KB: gõ liền ≈ 1,00 B/ký tự; gõ rải rác 16,86 B/ký tự trên đĩa và ≈ 213× chữ trong RAM)</em></span></div>
<div class="lz-step"><span class="lz-k">b</span><span class="lz-t">tombstones</span><span class="lz-d">Delete không xoá thật — chỉ mark deleted (tombstone). Cần cho merge commute. Document sau nhiều edit tăng size dù text KHÔNG dài hơn <em>(đo: gc mặc định bỏ NỘI DUNG đã xoá nhưng giữ ID — còn 1 KB chữ vẫn nặng 162,2 KB)</em></span></div>
<div class="lz-step"><span class="lz-k">c</span><span class="lz-t">history compaction</span><span class="lz-d">Yjs có <code>snapshot</code> để compact history — remove old tombstones. Cần chạy định kỳ <em>(<strong>sửa:</strong> <code>Y.snapshot</code> dùng cho lịch sử phiên bản, cần <code>gc: false</code>, không xoá gì. Nén thật = gộp nhật ký update thành một <code>encodeStateAsUpdate</code> — thứ kho lưu. Dựng tài liệu mới thì nhỏ hơn nữa nhưng ai còn giữ bản cũ sẽ không ghép được — đo bên dưới)</em></span></div>
</div>

<h3>Awareness — không phải CRDT nhưng đi kèm</h3>
<pre><code class="language-ts">// Awareness = ephemeral state cua user (cursor position, name, color)
// KHONG persist, KHONG merge — chi broadcast
awareness.setLocalStateField('cursor', { pos: 42 });
awareness.on('change', () =&gt; {
  const states = awareness.getStates();
  // Ve mo user cursor tren UI
});
</code></pre>

<div class="callout">
<p><strong>Awareness là gì socket.io CHUẨN đưa.</strong> Presence, cursor, live typing. Trong Yjs stack, awareness là feature riêng của y-websocket/Hocuspocus. Về nghĩa hoạt động, tương tự bài 4.1 presence — broadcast ephemeral.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — persist Yjs document vào SQL column dạng JSON.</strong> Yjs document là binary. Nếu bạn <code>JSON.stringify</code> rồi lưu, hỏng cấu trúc. Lưu là <code>Y.encodeStateAsUpdate(doc)</code> → binary Uint8Array → column BYTEA/BLOB.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> CRDT có tính chất mathematical &quot;update commute&quot; — mọi apply order cho cùng result, nên concurrent edit không cần lock/conflict resolution; trade off là 2-3× memory + tombstones (delete không thật xoá) + cần snapshot compaction; awareness (cursor/presence) là ephemeral feature riêng, giống pattern bài 4.1.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Thực hiện hai edit đồng thời lên một Y.Doc theo thứ tự khác nhau và xác nhận kết quả merge giống hệt — update commute.</li>
<li>Xoá một ít chữ và soi kích thước document; để ý tombstone giữ cho doc không co lại.</li>
<li>Chạy snapshot compaction và so kích thước trước/sau, rồi lập luận về trade 2-3× memory.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chỉ ra merge không phụ thuộc thứ tự và giải thích chi phí tombstone cộng compaction.</p></div>

<h3>🔬 Đo thật: event trôi xa, Y.Doc hội tụ</h3>
<p>Event mang vị trí, chuyển qua một server socket.io thật, mạng trễ 40 ms — mỗi bên áp phím của mình ngay:</p>
<div class="out">$ node crdt82.mjs sukien     # socket.io chuyển event "chèn ch ở pos" · mỗi bên áp tay mình ngay · trễ mạng 40 ms
1 lần gõ mỗi bên:  An "Hello world?!"   Bình "Hello world!?"   giống nhau? false
200 lần gõ xen kẽ (5 ms/lần, trễ 40 ms): dài 211/211 · khác nhau 186 vị trí · giống nhau? false</div>
<p>Cùng cảnh đó với hai Y.Doc (yjs 13.6.32): bốn lượt, đổi thứ tự áp và đổi mã client; rồi áp lại toàn bộ trạng thái thêm hai lần:</p>
<div class="out">$ node crdt82.mjs yjs        # cùng cảnh đó bằng Y.Doc: hai người chèn ở vị trí 11 cùng lúc, đổi thứ tự áp, đổi clientID
clientID An=7 Bình=9 · áp An trước: An "Hello world!?"  Bình "Hello world!?"  giống? true · update của An 10 B
clientID An=7 Bình=9 · áp Bình trước: An "Hello world!?"  Bình "Hello world!?"  giống? true · update của An 10 B
clientID An=9 Bình=7 · áp An trước: An "Hello world?!"  Bình "Hello world?!"  giống? true · update của An 10 B
clientID An=9 Bình=7 · áp Bình trước: An "Hello world?!"  Bình "Hello world?!"  giống? true · update của An 10 B
áp lại toàn bộ trạng thái 2 lần nữa (trùng lặp): "Hello world!?" — không đổi</div>
<div class="out">$ node crdt82.mjs id         # bên trong Y.Text: mỗi mẩu có ID (client, clock) + mẩu bên trái lúc chèn
ID (client 1, clock 0…10)  bên trái gốc —        nội dung "Hello world"
ID (client 7, clock 0)  bên trái gốc (1,10)   nội dung "!"
ID (client 9, clock 0)  bên trái gốc (1,10)   nội dung "?"
thứ tự đọc: Hello world!?</div>
<div class="callout ok"><p><strong>Đọc:</strong> với vị trí, mỗi bên một phím đã đủ lệch, 200 phím để lại 186/211 vị trí khác nhau. Với Yjs lượt nào cũng đọc ra một câu; hoà giữa “!” và “?” (cùng gốc trái (1,10)) phân xử bằng mã client nhỏ hơn, không phải ai tới trước.</p></div>
<p>Giao hoán trên 900 thao tác ngẫu nhiên: 3 người, mỗi người 300 lần chèn/xoá, rồi mọi update được giao xáo trộn kèm 50 bản trùng:</p>
<div class="out">$ node crdt82.mjs ngaunhien  # 3 người × 300 thao tác chèn/xoá đồng thời · nhận update xáo trộn + bản trùng
trước khi gặp nhau: người 1 dài 119 · người 2 dài 133 · người 3 dài 129
người 1: nhận 650 update (xáo trộn, 50 bản trùng) ⇒ dài 378
người 2: nhận 650 update (xáo trộn, 50 bản trùng) ⇒ dài 378
người 3: nhận 650 update (xáo trộn, 50 bản trùng) ⇒ dài 378
3 bản giống hệt từng ký tự? true · đầu chuỗi: "hjfskuvccnlzbuezcyziasrdspozksovjoupoesh…"</div>
<p>Hoá đơn cho 10 KB chữ — trạng thái gộp là thứ kho lưu (<code>Y.encodeStateAsUpdate</code>):</p>
<div class="out">$ node --expose-gc crdt82.mjs kichthuoc   # 10 KB chữ: byte trên đĩa (encodeStateAsUpdate) và RAM
dán 10 KB một lần                            chữ  10240 ·      1 update, tổng   10.0 KB · trạng thái gộp  10.0 KB (1.00 B/ký tự)
gõ 10 KB từng ký tự, cuối dòng               chữ  10240 ·  10240 update, tổng  199.7 KB · trạng thái gộp  10.0 KB (1.00 B/ký tự)
gõ 10 KB từng ký tự, chỗ ngẫu nhiên          chữ  10240 ·  10240 update, tổng  268.5 KB · trạng thái gộp 168.6 KB (16.86 B/ký tự)
gõ ngẫu nhiên rồi xoá 9 KB (gc: true, mặc định) chữ   1024 ·  19456 update, tổng  367.2 KB · trạng thái gộp 162.2 KB (162.19 B/ký tự)
gõ ngẫu nhiên rồi xoá 9 KB (gc: false)       chữ   1024 ·  19456 update, tổng  367.2 KB · trạng thái gộp 171.2 KB (171.17 B/ký tự)
"nén" bằng cách dựng tài liệu MỚI từ chữ hiện tại: 1.0 KB
người còn giữ bản cũ gõ 1 ký tự ⇒ áp vào tài liệu mới: chữ KHÔNG có 'X' · update treo chờ: có
RAM: 20 Y.Doc, mỗi cái 10 KB gõ chỗ ngẫu nhiên ⇒ heap +2134 KB mỗi tài liệu (≈ 213× chữ)
RAM: 20 Y.Doc, mỗi cái 10 KB gõ cuối dòng ⇒ heap +109 KB mỗi tài liệu (≈ 10.9× chữ)</div>
<p>Awareness (con trỏ, tên) đi cạnh tài liệu, cái bẫy JSON — và cách kho lưu byte:</p>
<div class="out">$ node crdt82.mjs awareness  # y-protocols/awareness: con trỏ + tên, KHÔNG nằm trong Y.Doc
awareness An (tên + màu): 51 B · Bình giữ 2 trạng thái (An + chính mình)
di con trỏ 3 lần: mỗi lần gửi LẠI cả trạng thái 84 B (clock 4) — không ghép, không lưu lịch sử
An rời trang (setLocalState null): 8 B ⇒ Bình còn thấy An? không · hết hạn tự động khi im: 30 s · doc vẫn y nguyên: Y.Doc không chứa con trỏ</div>
<div class="out">$ node crdt82.mjs json       # bẫy: lưu update Yjs bằng JSON.stringify
Uint8Array: 56 B · JSON.stringify(Uint8Array): 464 B, bắt đầu {"0":1,"1":1,"2":169,"3":245,"…
JSON.stringify(Buffer): 219 B, bắt đầu {"type":"Buffer","data":[1,1,169…
đọc lại từ JSON: Error: Unexpected end of array
đọc lại từ bytes (BYTEA/Buffer): "Xin chào, đây là ghi chú cộng tác."</div>
<div class="out">$ cd ~/api-backend &amp;&amp; grep -n "encodeStateAsUpdate\\|MAX_DOCUMENT_BYTES =\\|state: Buffer.from" src/socket/notes-collaboration.gateway.ts
23:const MAX_DOCUMENT_BYTES = 4 * 1024 * 1024;
86:  const state = Y.encodeStateAsUpdate(document);
110:        state: Buffer.from(state),
116:        state: Buffer.from(state),
$ grep -n "  state  *Bytes\\|stateVector Bytes" prisma/schema.prisma
5087:  state       Bytes
5088:  stateVector Bytes    @map("state_vector")
15279:  state          Bytes?
$ grep -n "setAwarenessField\\|onAwarenessChange" frontend/src/components/notes/NoteRealtimeEditor.tsx
163:          onAwarenessChange: ({ states }) =&gt; {
187:        provider.setAwarenessField('user', localUser);</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash"><span class="tok-comment"># lab c8: npm i yjs@13.6.32 y-protocols@1.0.7 socket.io@4.8.3 socket.io-client@4.8.3</span>
node crdt82.mjs sukien               <span class="tok-comment">  # event "chèn ở vị trí" qua socket.io: hai bản lệch</span>
node crdt82.mjs yjs                  <span class="tok-comment">  # cùng cảnh bằng Y.Doc: 4 lượt đổi thứ tự / clientID</span>
node crdt82.mjs id                   <span class="tok-comment">  # bên trong Y.Text: (client, clock) + origin</span>
node crdt82.mjs ngaunhien            <span class="tok-comment">  # 3 người × 300 thao tác, update xáo trộn + trùng</span>
node --expose-gc crdt82.mjs kichthuoc<span class="tok-comment">  # byte trên đĩa + RAM cho 10 KB chữ</span>
node crdt82.mjs awareness            <span class="tok-comment">  # con trỏ/tên: ngoài Y.Doc</span>
node crdt82.mjs json                 <span class="tok-comment">  # bẫy JSON.stringify(Uint8Array)</span></code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-7-2-watch" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 7.2 — WATCH: kiểm soát đồng thời lạc quan mà không cần khoá</span><span class="lc-sub">Phát hiện xung đột rồi thử lại — cách mà CRDT không cần</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-6-3-mutation" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 6.3 — Mutation và cập nhật lạc quan</span><span class="lc-sub">Áp ngay ở máy mình rồi mới đồng bộ — điều mọi Y.Doc làm</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-3-2-buffer" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 3.2 — Buffer: dữ liệu nhị phân</span><span class="lc-sub">Thứ bạn lưu vào cột BYTEA</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">CRDT</span><span class="v">Một kiểu dữ liệu mà update commute — mọi thứ tự apply cho một kết quả.</span></div>
  <div class="kv"><span class="k">Commute</span><span class="v">Độc lập thứ tự: không cần lock và không cần conflict resolution.</span></div>
  <div class="kv"><span class="k">Tombstone</span><span class="v">Một dấu xoá — một delete không bao giờ thật sự gỡ dữ liệu.</span></div>
  <div class="kv"><span class="k">Snapshot compaction</span><span class="v">Dựng lại doc để bỏ các tombstone tích luỹ.</span></div>
  <div class="kv"><span class="k">Trade memory</span><span class="v">CRDT tốn 2-3× memory thường cho các bảo đảm của nó.</span></div>
  <div class="kv"><span class="k">Awareness</span><span class="v">Cursor/presence — một ephemeral feature riêng (giống 4.1).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Update CRDT commute — mọi thứ tự apply cho cùng kết quả.</li><li>Nên edit đồng thời không cần lock lẫn conflict resolution.</li><li>Trade là 2-3× memory cộng tombstone (một delete không bao giờ thật xoá).</li><li>Đó là lý do cần snapshot compaction.</li><li>Awareness (cursor, presence) là một ephemeral feature riêng, giống bài 4.1.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Yjs — introduction to CRDTs</span><span class="lc-sub">docs.yjs.dev/getting-started/a-collaborative-editor — bài dẫn nhập, kèm ví dụ collaborative editor.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CRDT — Wikipedia</span><span class="lc-sub">en.wikipedia.org/wiki/Conflict-free_replicated_data_type — nền tảng lý thuyết cho commutative merge.</span></span></div>
</div>
`,
    },

    {
      title: '8.3 — Yjs binary sync protocol|||8.3 — Yjs binary sync protocol',
      slug: 'io-8-3-protocol',
      type: 'VIDEO',
      description: 'Yjs sync protocol có 4 message types (SyncStep1, SyncStep2, Update, Awareness). Binary, không JSON. Trade off latency vs bandwidth.',
      content: `
${G08_3}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>Yjs binary sync protocol</h2>
<p class="lead">Yjs syncs via a binary message protocol over WebSocket. Four message types cover everything from initial handshake to real-time updates to cursor awareness <em>(on the wire Hocuspocus 2.15.3 has eight: Sync with three sub-types, Awareness, Auth, QueryAwareness, SyncReply, Stateless, CLOSE, SyncStatus — measured below)</em>.</p>

<h3>The four message types</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">SyncStep1</span><span class="lz-nsub">state vector</span></span>
<span class="lz-nbody">The client sends a &quot;state vector&quot; — I have everything up to clock X for each client. The server uses it to work out what to send. ~50 bytes <em>(measured: 1 B for a new client, 8 B for a one-author doc — one (client, clock) pair per author)</em>.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">SyncStep2</span><span class="lz-nsub">missing updates</span></span>
<span class="lz-nbody">The server sends the updates the client is missing. For a fresh document, ~10 KB - 1 MB. For a handful of edits, a few KB.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Update</span><span class="lz-nsub">delta stream</span></span>
<span class="lz-nbody">Once synced, every local edit produces a ~10-100 byte update, sent in both directions. This is the realtime stream.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">AwarenessUpdate</span><span class="lz-nsub">cursor + presence</span></span>
<span class="lz-nbody">Ephemeral state — cursor position, user name, colour. ~100-500 bytes per user. Broadcast continuously.</span>
</div>
</div>

<h3>Flow initial sync</h3>
<pre><code class="language-text">Client mo document lan dau:
  1. WS handshake + auth
  2. Client -&gt; SyncStep1 (state vector, ~50 byte)
  3. Server -&gt; SyncStep2 (mọi update trong doc, ~10 KB - 1 MB tuy size doc)
  4. Client apply -&gt; UI show
  5. Client -&gt; SyncStep1 lai (opt) — trong truong hop server dang co update moi

Sau initial sync, client va server o "sync state":
  6. Client edit -&gt; local Y.Doc.update() -&gt; emit Update (~10-100 byte)
  7. Server apply + broadcast Update den peers khac
  8. Peer apply -&gt; Y.Doc.on('update') fire
</code></pre>

<h3>Bandwidth in practice</h3>
<div class="out">Document editing scenarios:
  Initial load 10 KB doc:     ~15 KB SyncStep2 (2-3x with CRDT metadata)
  Type 1 character:           ~20 byte Update (client -&gt; server)
                              20 byte * (N-1) peer broadcast (server -&gt; each)   [do: 34 B len; server gui N ban (CA nguoi go) + SyncStatus 9 B]
  Cursor move:                ~150 byte AwarenessUpdate (throttled ~100ms)
  Idle:                       0 traffic (khac socket.io ping 25s)   [SAI — do 65 s: awareness 19 B moi 15 s + WS ping moi 30 s]
</div>

<h3>Common Hocuspocus extensions</h3>
<pre><code class="language-ts">const server = new Hocuspocus({
  extensions: [
    new Redis({ host: 'redis-host' }),           // multi-worker sync
    new Database({ fetch, store }),               // persist to Postgres
    new Logger(),                                 // logging
    new Throttle({ throttle: 15 }),               // rate limit per user
    ...customExtensions,
  ],
});
</code></pre>

<h3>This repo's custom extensions</h3>
<pre><code class="language-ts">// noteRealtimeExtensions
// - Kiem permission thoi gian thuc (owner + shared users)
// - Debounce persist DB (mac dinh Hocuspocus save moi 2s, kho nay 5s)   [kho THAT: debounce 1500 / maxDebounce 10000; mac dinh 2000 / 10000]
// - Sanitize HTML output khi save (Tiptap render)   [grep kho: 0 cho — khong co buoc sanitize]
</code></pre>

<div class="pitfall">
<p><strong>Trap — running Hocuspocus without an auth extension.</strong> Someone calls <code>new HocuspocusProvider({ url, name: 'doc-123' })</code> from an arbitrary browser and edits document 123. You need <code>onAuthenticate</code> to reject anyone without a token, and to resolve permissions per document.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> The Yjs sync protocol uses 4 binary message types (SyncStep1, a ~50-byte state vector; SyncStep2, ~10 KB-1 MB of missing updates; Update, a ~10-100 byte stream per edit; AwarenessUpdate, ~150 bytes per cursor move) — total bandwidth is lower than a socket.io chat-style protocol because it is binary-optimised and carries no ping keepalive.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Open a Yjs document and capture the four message types: SyncStep1 (the ~50-byte state vector), SyncStep2 (the missing updates), Update (per edit), AwarenessUpdate (per cursor move).</li>
<li>Measure the bytes for a short editing session and compare against a chat-style socket.io protocol.</li>
<li>Note there is no ping keepalive and reason about why the binary encoding is smaller.</li>
</ol>
<p><strong>Done when:</strong> you can name the four Yjs message types and explain why total bandwidth is lower.</p></div>

<h3>🔬 Measured: every frame of a real Hocuspocus session</h3>
<p>@hocuspocus/server + provider 2.15.3, yjs 13.6.32; every frame captured and decoded with <code>lib0/decoding</code> (document name, type, sub-type, payload size). Open, type one character, move the cursor, N people, and the same update over socket.io:</p>
<div class="out">$ node hp83.mjs &amp;   node do83.mjs mo-dau     # An mở note:1 — server đã có 10 KB chữ; giải mã từng khung
── An mở note:1 (server đã có 10 KB chữ) ⇒ synced · An có 10240 ký tự
  An    ↑       16 B  note:1 · Auth token
  An    ↑       11 B  note:1 · Sync step1 · state vector 1 B
  An    ↑       19 B  note:1 · Awareness · 10 B trạng thái
  An    ↓       20 B  note:1 · Auth authenticated "read-write"
  An    ↓       18 B  note:1 · Sync step1 · state vector 8 B
  An    ↑       12 B  note:1 · Sync step2 · update 2 B
  An    ↓    10266 B  note:1 · Sync step2 · update 10255 B
  tổng: An ↑58 B ↓10304 B
$ node do83.mjs go                         # Bình cùng mở; An gõ MỘT ký tự rồi di con trỏ một lần
── An gõ MỘT ký tự (Bình cùng mở)
  An    ↑       34 B  note:1 · Sync update · update 24 B
  An    ↓       34 B  note:1 · Sync update · update 24 B
  An    ↓        9 B  note:1 · SyncStatus đã nhận ✓
  Bình  ↓       34 B  note:1 · Sync update · update 24 B
  tổng: An ↑34 B ↓43 B · Bình ↑0 B ↓34 B
── An di con trỏ một lần
  An    ↑       49 B  note:1 · Awareness · 40 B trạng thái
  An    ↓       49 B  note:1 · Awareness · 40 B trạng thái
  Bình  ↓       49 B  note:1 · Awareness · 40 B trạng thái
  Bình  ↑       49 B  note:1 · Awareness · 40 B trạng thái
  tổng: An ↑49 B ↓49 B · Bình ↑49 B ↓49 B
$ node do83.mjs nhom                       # N = 2, 3, 5 người cùng mở — đếm mọi khung qua server
N=2: gõ 1 ký tự ⇒ ↑1 khung 34 B · ↓3 khung 77 B (An tự nhận lại 1) │ di con trỏ 1 lần ⇒ ↑2 khung 98 B (người nhận gửi lại: 1) · ↓2 khung 98 B
N=3: gõ 1 ký tự ⇒ ↑1 khung 33 B · ↓4 khung 108 B (An tự nhận lại 1) │ di con trỏ 1 lần ⇒ ↑3 khung 144 B (người nhận gửi lại: 2) · ↓3 khung 144 B
N=5: gõ 1 ký tự ⇒ ↑1 khung 34 B · ↓6 khung 179 B (An tự nhận lại 1) │ di con trỏ 1 lần ⇒ ↑5 khung 245 B (người nhận gửi lại: 4) · ↓5 khung 245 B
$ node do83.mjs io                         # cùng update Yjs gửi bằng socket.emit
cùng update Yjs 15 B gửi bằng socket.emit('update', u): xem log server ↑ (hai khung)
$ # log server
[hp] :19905 · Hocuspocus /notes-collaboration (có token) + /mo (không) · socket.io
[hp] onAuthenticate note:1 · An
[hp] onAuthenticate note:1 · An
[hp] onAuthenticate note:1 · Bình
[hp] onAuthenticate note:1 · An
[hp] onAuthenticate note:1 · Bình
[hp] onAuthenticate note:1 · An
[hp] onAuthenticate note:1 · Bình
[hp] onAuthenticate note:1 · An
[hp] onAuthenticate note:1 · An
[hp] onAuthenticate note:1 · Bình
[hp] onAuthenticate note:1 · An
[hp] onAuthenticate note:1 · Bình
[hp] onAuthenticate note:1 · An
[io] nhận khung 2 B: 40
[io] nhận khung 44 B: 451-["update",{"_placeholder":true,"num":0}]
[io] nhận khung 15 B: &lt;nhị phân&gt;</div>
<div class="callout warn"><p><strong>Read it:</strong> SyncStep2 carried the whole 10 KB document because a new client&#39;s state vector is empty. One keystroke goes to <strong>every</strong> connection — the typist included — plus a 9 B SyncStatus to the typist. On a cursor move, every receiver&#39;s provider sends the awareness <strong>back up</strong> (its handler forwards remote changes too); the server ignores the echo, the upload is still spent.</p></div>
<p>Sitting idle for 65 s (nobody typing), versus socket.io with the repo&#39;s 25 s ping:</p>
<div class="out">$ node do83.mjs nghi     # ngồi im 65 s: Hocuspocus vs socket.io (pingInterval 25 s như kho)
  -0.004 s  ↓      9 B  note:1 · SyncStatus đã nhận ✓
  14.99 s  ↑     19 B  note:1 · Awareness · 10 B trạng thái
  14.995 s  ↓     19 B  note:1 · Awareness · 10 B trạng thái
  29.993 s  ping   0 B  khung ping điều khiển WebSocket (Hocuspocus, timeout 30 s)
  29.996 s  ↑     19 B  note:1 · Awareness · 10 B trạng thái
  29.997 s  ↓     19 B  note:1 · Awareness · 10 B trạng thái
  45.007 s  ↑     19 B  note:1 · Awareness · 10 B trạng thái
  45.008 s  ↓     19 B  note:1 · Awareness · 10 B trạng thái
  59.995 s  ping   0 B  khung ping điều khiển WebSocket (Hocuspocus, timeout 30 s)
  60.015 s  ↑     19 B  note:1 · Awareness · 10 B trạng thái
  60.015 s  ↓     19 B  note:1 · Awareness · 10 B trạng thái
ngồi im 65 s · Hocuspocus: 9 khung dữ liệu, 2 khung ping điều khiển (WebSocket, 2 B + pong tự động) · socket.io (pingInterval 25 s như kho): 4 gói engine.io, 4 B (ping "2" / pong "3")</div>
<p>The trap: a Hocuspocus server without <code>onAuthenticate</code>, and a fake token against one with it:</p>
<div class="out">$ node do83.mjs khoa     # /mo không có onAuthenticate · /notes-collaboration với token giả
/mo (không onAuthenticate), không token, mở note:123 ⇒ synced, sửa được
── /notes-collaboration, token giả ⇒ authenticationFailed: permission-denied
  Lạ    ↑       17 B  note:1 · Auth token
  Lạ    ↑       11 B  note:1 · Sync step1 · state vector 1 B
  Lạ    ↑       19 B  note:1 · Awareness · 10 B trạng thái
  Lạ    ↓       27 B  note:1 · Auth permission-denied "permission-denied"
  Lạ    ↑       21 B  note:1 · Awareness · 12 B trạng thái
  tổng: Lạ ↑68 B ↓27 B
$ # log server
[hp] :19905 · Hocuspocus /notes-collaboration (có token) + /mo (không) · socket.io
[hp /mo] note:123 bị sửa: "ai đó không đăng nhập"
[onAuthenticate] token không hợp lệ</div>
<p>What the repo configures:</p>
<div class="out">$ cd ~/api-backend &amp;&amp; grep -n "debounce:\\|maxDebounce:\\|extensions:\\|connection.readOnly =" src/socket/notes-collaboration.gateway.ts
197:    debounce: 1500,
198:    maxDebounce: 10000,
199:    extensions: [redisExtension],
204:      connection.readOnly = !canEditSharedNote(context.permission);
224:      connection.readOnly = !canEditSharedNote(access.permission);
$ grep -n "timeout: 30000\\|debounce: 2000\\|maxDebounce: 10000" node_modules/@hocuspocus/server/dist/hocuspocus-server.cjs   # mặc định 2.15.3
2420:    timeout: 30000,
2421:    debounce: 2000,
2422:    maxDebounce: 10000,
$ grep -rn "sanitize\\|Throttle\\|extension-database\\|extension-logger" src/socket/notes-collaboration.gateway.ts src/services/notesRealtime*.ts | wc -l
       0
$ grep -n "broadcast: true\\|token: refreshToken" frontend/src/components/notes/NoteRealtimeEditor.tsx
146:          token: refreshToken,
148:          broadcast: true,</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash"><span class="tok-comment"># lab c8: npm i @hocuspocus/server@2.15.3 @hocuspocus/provider@2.15.3 yjs@13.6.32 lib0 socket.io@4.8.3 socket.io-client@4.8.3</span>
node hp83.mjs &amp;          <span class="tok-comment">  # :19905 · /notes-collaboration (onAuthenticate kiểm token, note:1 có 10 KB) · /mo (KHÔNG xác thực) · socket.io</span>
node do83.mjs mo-dau     <span class="tok-comment">  # mở tài liệu: từng khung giải mã (lib0 decoding)</span>
node do83.mjs go         <span class="tok-comment">  # An + Bình: 1 phím, 1 lần di con trỏ</span>
node do83.mjs nhom       <span class="tok-comment">  # N = 2, 3, 5 người</span>
node do83.mjs nghi       <span class="tok-comment">  # ngồi im 65 s</span>
node do83.mjs io         <span class="tok-comment">  # cùng update qua socket.emit</span>
node do83.mjs khoa       <span class="tok-comment">  # server không onAuthenticate / token giả</span></code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-3-2-buffer" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 3.2 — Buffer: binary data</span><span class="lc-sub">The basis for reading a frame byte by byte</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-9-2-websocket" target="_blank" rel="noopener"><span class="lc-ico">📡</span><span class="lc-body"><span class="lc-title">Networking · 9.2 — WebSocket: upgrade, frames and heartbeat</span><span class="lc-sub">Includes the ping control frames Hocuspocus sends</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">SyncStep1</span><span class="v">A ~50-byte state vector — what this peer already has.</span></div>
  <div class="kv"><span class="k">SyncStep2</span><span class="v">~10 KB-1 MB of the updates the other peer is missing.</span></div>
  <div class="kv"><span class="k">Update</span><span class="v">A ~10-100 byte stream message per edit.</span></div>
  <div class="kv"><span class="k">AwarenessUpdate</span><span class="v">~150 bytes per cursor move.</span></div>
  <div class="kv"><span class="k">State vector</span><span class="v">A compact summary of which updates a peer holds.</span></div>
  <div class="kv"><span class="k">Binary-optimised</span><span class="v">No JSON framing and no ping keepalive — lower total bandwidth.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>The Yjs sync protocol uses four binary message types.</li><li>SyncStep1 is a ~50-byte state vector; SyncStep2 is the missing updates (~10 KB-1 MB).</li><li>Update is ~10-100 bytes per edit; AwarenessUpdate is ~150 bytes per cursor move.</li><li>Total bandwidth is lower than a socket.io chat-style protocol.</li><li>It is binary-optimised and carries no ping keepalive.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">y-protocols/sync</span><span class="lc-sub">github.com/yjs/y-protocols/blob/master/sync.md — spec chính thức.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Hocuspocus extensions</span><span class="lc-sub">hocuspocus.dev/docs/extensions/introduction — Redis, Database, Auth, và các built-in extensions.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>Yjs binary sync protocol</h2>
<p class="lead">Yjs sync qua binary message protocol trên WebSocket. Bốn message type cover từ initial handshake, real-time updates, đến cursor awareness.</p>

<h3>Bốn message types</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">SyncStep1</span><span class="lz-nsub">state vector</span></span>
<span class="lz-nbody">Client gửi &quot;state vector&quot; — tôi đã có tới clock X của mỗi client. Server dùng để biết cần gửi gì. ~50 byte <em>(đo: 1 B với người mới, 8 B với tài liệu một tác giả — mỗi tác giả một cặp (client, clock))</em>.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">SyncStep2</span><span class="lz-nsub">missing updates</span></span>
<span class="lz-nbody">Server gửi các update client thiếu. Nếu document mới, ~10 KB - 1 MB. Nếu chỉ vài edit, vài KB.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Update</span><span class="lz-nsub">delta stream</span></span>
<span class="lz-nbody">Sau khi sync, mỗi edit local sinh update ~10-100 byte, gửi cả hai chiều. Đây là stream real-time.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">AwarenessUpdate</span><span class="lz-nsub">cursor + presence</span></span>
<span class="lz-nbody">Ephemeral state — cursor position, user name, color. ~100-500 byte per user. Broadcast liên tục.</span>
</div>
</div>

<h3>Flow initial sync</h3>
<pre><code class="language-text">Client mo document lan dau:
  1. WS handshake + auth
  2. Client -&gt; SyncStep1 (state vector, ~50 byte)
  3. Server -&gt; SyncStep2 (moi update trong doc, ~10 KB - 1 MB tuy size doc)
  4. Client apply -&gt; UI show
  5. Client -&gt; SyncStep1 lai (opt) — trong truong hop server dang co update moi

Sau initial sync, client va server o "sync state":
  6. Client edit -&gt; local Y.Doc.update() -&gt; emit Update (~10-100 byte)
  7. Server apply + broadcast Update den peers khac
  8. Peer apply -&gt; Y.Doc.on('update') fire
</code></pre>

<h3>Bandwidth thực tế</h3>
<div class="out">Document editing scenarios:
  Initial load 10 KB doc:     ~15 KB SyncStep2 (2-3x with CRDT metadata)
  Type 1 character:           ~20 byte Update (client -&gt; server)
                              20 byte * (N-1) peer broadcast (server -&gt; each)   [do: 34 B len; server gui N ban (CA nguoi go) + SyncStatus 9 B]
  Cursor move:                ~150 byte AwarenessUpdate (throttled ~100ms)
  Idle:                       0 traffic (khac socket.io ping 25s)   [SAI — do 65 s: awareness 19 B moi 15 s + WS ping moi 30 s]
</div>

<h3>Hocuspocus extensions phổ biến</h3>
<pre><code class="language-ts">const server = new Hocuspocus({
  extensions: [
    new Redis({ host: 'redis-host' }),           // multi-worker sync
    new Database({ fetch, store }),               // persist to Postgres
    new Logger(),                                 // logging
    new Throttle({ throttle: 15 }),               // rate limit per user
    ...customExtensions,
  ],
});
</code></pre>

<h3>Kho này custom extensions</h3>
<pre><code class="language-ts">// noteRealtimeExtensions
// - Kiem permission thoi gian thuc (owner + shared users)
// - Debounce persist DB (mac dinh Hocuspocus save moi 2s, kho nay 5s)   [kho THAT: debounce 1500 / maxDebounce 10000; mac dinh 2000 / 10000]
// - Sanitize HTML output khi save (Tiptap render)   [grep kho: 0 cho — khong co buoc sanitize]
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — dùng Hocuspocus không có auth extension.</strong> Ai đó gọi <code>new HocuspocusProvider({ url, name: 'doc-123' })</code> từ browser random và edit document 123. Cần <code>onAuthenticate</code> reject nếu không có token, kèm resolve permission per document.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Yjs sync protocol dùng 4 binary message type (SyncStep1 state vector ~50 byte, SyncStep2 missing updates ~10 KB-1 MB, Update stream ~10-100 byte per edit, AwarenessUpdate ~150 byte per cursor move) — tổng bandwidth thấp hơn socket.io chat-like protocol vì binary optimized và không có ping keepalive.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Mở một document Yjs và bắt bốn message type: SyncStep1 (state vector ~50 byte), SyncStep2 (các update còn thiếu), Update (mỗi edit), AwarenessUpdate (mỗi lần di cursor).</li>
<li>Đo byte cho một phiên sửa ngắn và so với một chat-style socket.io protocol.</li>
<li>Để ý không có ping keepalive và lập luận vì sao mã hoá binary nhỏ hơn.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn gọi tên được bốn message type Yjs và giải thích vì sao tổng bandwidth thấp hơn.</p></div>

<h3>🔬 Đo thật: mọi khung của một phiên Hocuspocus</h3>
<p>@hocuspocus/server + provider 2.15.3, yjs 13.6.32; mọi khung được bắt và giải mã bằng <code>lib0/decoding</code> (tên tài liệu, loại, kiểu con, kích thước). Mở, gõ một ký tự, di con trỏ, N người, và cùng update qua socket.io:</p>
<div class="out">$ node hp83.mjs &amp;   node do83.mjs mo-dau     # An mở note:1 — server đã có 10 KB chữ; giải mã từng khung
── An mở note:1 (server đã có 10 KB chữ) ⇒ synced · An có 10240 ký tự
  An    ↑       16 B  note:1 · Auth token
  An    ↑       11 B  note:1 · Sync step1 · state vector 1 B
  An    ↑       19 B  note:1 · Awareness · 10 B trạng thái
  An    ↓       20 B  note:1 · Auth authenticated "read-write"
  An    ↓       18 B  note:1 · Sync step1 · state vector 8 B
  An    ↑       12 B  note:1 · Sync step2 · update 2 B
  An    ↓    10266 B  note:1 · Sync step2 · update 10255 B
  tổng: An ↑58 B ↓10304 B
$ node do83.mjs go                         # Bình cùng mở; An gõ MỘT ký tự rồi di con trỏ một lần
── An gõ MỘT ký tự (Bình cùng mở)
  An    ↑       34 B  note:1 · Sync update · update 24 B
  An    ↓       34 B  note:1 · Sync update · update 24 B
  An    ↓        9 B  note:1 · SyncStatus đã nhận ✓
  Bình  ↓       34 B  note:1 · Sync update · update 24 B
  tổng: An ↑34 B ↓43 B · Bình ↑0 B ↓34 B
── An di con trỏ một lần
  An    ↑       49 B  note:1 · Awareness · 40 B trạng thái
  An    ↓       49 B  note:1 · Awareness · 40 B trạng thái
  Bình  ↓       49 B  note:1 · Awareness · 40 B trạng thái
  Bình  ↑       49 B  note:1 · Awareness · 40 B trạng thái
  tổng: An ↑49 B ↓49 B · Bình ↑49 B ↓49 B
$ node do83.mjs nhom                       # N = 2, 3, 5 người cùng mở — đếm mọi khung qua server
N=2: gõ 1 ký tự ⇒ ↑1 khung 34 B · ↓3 khung 77 B (An tự nhận lại 1) │ di con trỏ 1 lần ⇒ ↑2 khung 98 B (người nhận gửi lại: 1) · ↓2 khung 98 B
N=3: gõ 1 ký tự ⇒ ↑1 khung 33 B · ↓4 khung 108 B (An tự nhận lại 1) │ di con trỏ 1 lần ⇒ ↑3 khung 144 B (người nhận gửi lại: 2) · ↓3 khung 144 B
N=5: gõ 1 ký tự ⇒ ↑1 khung 34 B · ↓6 khung 179 B (An tự nhận lại 1) │ di con trỏ 1 lần ⇒ ↑5 khung 245 B (người nhận gửi lại: 4) · ↓5 khung 245 B
$ node do83.mjs io                         # cùng update Yjs gửi bằng socket.emit
cùng update Yjs 15 B gửi bằng socket.emit('update', u): xem log server ↑ (hai khung)
$ # log server
[hp] :19905 · Hocuspocus /notes-collaboration (có token) + /mo (không) · socket.io
[hp] onAuthenticate note:1 · An
[hp] onAuthenticate note:1 · An
[hp] onAuthenticate note:1 · Bình
[hp] onAuthenticate note:1 · An
[hp] onAuthenticate note:1 · Bình
[hp] onAuthenticate note:1 · An
[hp] onAuthenticate note:1 · Bình
[hp] onAuthenticate note:1 · An
[hp] onAuthenticate note:1 · An
[hp] onAuthenticate note:1 · Bình
[hp] onAuthenticate note:1 · An
[hp] onAuthenticate note:1 · Bình
[hp] onAuthenticate note:1 · An
[io] nhận khung 2 B: 40
[io] nhận khung 44 B: 451-["update",{"_placeholder":true,"num":0}]
[io] nhận khung 15 B: &lt;nhị phân&gt;</div>
<div class="callout warn"><p><strong>Đọc:</strong> SyncStep2 mang cả tài liệu 10 KB vì state vector của người mới rỗng. Một phím gõ được gửi tới <strong>mọi</strong> kết nối — kể cả người gõ — cộng 9 B SyncStatus cho người gõ. Khi di con trỏ, provider của mỗi người nhận <strong>gửi ngược</strong> awareness lên (handler chuyển tiếp cả thay đổi của người khác); server bỏ qua bản lặp, nhưng băng thông lên đã tốn.</p></div>
<p>Ngồi im 65 s (không ai gõ), so với socket.io ping 25 s như kho:</p>
<div class="out">$ node do83.mjs nghi     # ngồi im 65 s: Hocuspocus vs socket.io (pingInterval 25 s như kho)
  -0.004 s  ↓      9 B  note:1 · SyncStatus đã nhận ✓
  14.99 s  ↑     19 B  note:1 · Awareness · 10 B trạng thái
  14.995 s  ↓     19 B  note:1 · Awareness · 10 B trạng thái
  29.993 s  ping   0 B  khung ping điều khiển WebSocket (Hocuspocus, timeout 30 s)
  29.996 s  ↑     19 B  note:1 · Awareness · 10 B trạng thái
  29.997 s  ↓     19 B  note:1 · Awareness · 10 B trạng thái
  45.007 s  ↑     19 B  note:1 · Awareness · 10 B trạng thái
  45.008 s  ↓     19 B  note:1 · Awareness · 10 B trạng thái
  59.995 s  ping   0 B  khung ping điều khiển WebSocket (Hocuspocus, timeout 30 s)
  60.015 s  ↑     19 B  note:1 · Awareness · 10 B trạng thái
  60.015 s  ↓     19 B  note:1 · Awareness · 10 B trạng thái
ngồi im 65 s · Hocuspocus: 9 khung dữ liệu, 2 khung ping điều khiển (WebSocket, 2 B + pong tự động) · socket.io (pingInterval 25 s như kho): 4 gói engine.io, 4 B (ping "2" / pong "3")</div>
<p>Cái bẫy: server Hocuspocus không có <code>onAuthenticate</code>, và token giả với server có:</p>
<div class="out">$ node do83.mjs khoa     # /mo không có onAuthenticate · /notes-collaboration với token giả
/mo (không onAuthenticate), không token, mở note:123 ⇒ synced, sửa được
── /notes-collaboration, token giả ⇒ authenticationFailed: permission-denied
  Lạ    ↑       17 B  note:1 · Auth token
  Lạ    ↑       11 B  note:1 · Sync step1 · state vector 1 B
  Lạ    ↑       19 B  note:1 · Awareness · 10 B trạng thái
  Lạ    ↓       27 B  note:1 · Auth permission-denied "permission-denied"
  Lạ    ↑       21 B  note:1 · Awareness · 12 B trạng thái
  tổng: Lạ ↑68 B ↓27 B
$ # log server
[hp] :19905 · Hocuspocus /notes-collaboration (có token) + /mo (không) · socket.io
[hp /mo] note:123 bị sửa: "ai đó không đăng nhập"
[onAuthenticate] token không hợp lệ</div>
<p>Kho cấu hình gì:</p>
<div class="out">$ cd ~/api-backend &amp;&amp; grep -n "debounce:\\|maxDebounce:\\|extensions:\\|connection.readOnly =" src/socket/notes-collaboration.gateway.ts
197:    debounce: 1500,
198:    maxDebounce: 10000,
199:    extensions: [redisExtension],
204:      connection.readOnly = !canEditSharedNote(context.permission);
224:      connection.readOnly = !canEditSharedNote(access.permission);
$ grep -n "timeout: 30000\\|debounce: 2000\\|maxDebounce: 10000" node_modules/@hocuspocus/server/dist/hocuspocus-server.cjs   # mặc định 2.15.3
2420:    timeout: 30000,
2421:    debounce: 2000,
2422:    maxDebounce: 10000,
$ grep -rn "sanitize\\|Throttle\\|extension-database\\|extension-logger" src/socket/notes-collaboration.gateway.ts src/services/notesRealtime*.ts | wc -l
       0
$ grep -n "broadcast: true\\|token: refreshToken" frontend/src/components/notes/NoteRealtimeEditor.tsx
146:          token: refreshToken,
148:          broadcast: true,</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash"><span class="tok-comment"># lab c8: npm i @hocuspocus/server@2.15.3 @hocuspocus/provider@2.15.3 yjs@13.6.32 lib0 socket.io@4.8.3 socket.io-client@4.8.3</span>
node hp83.mjs &amp;          <span class="tok-comment">  # :19905 · /notes-collaboration (onAuthenticate kiểm token, note:1 có 10 KB) · /mo (KHÔNG xác thực) · socket.io</span>
node do83.mjs mo-dau     <span class="tok-comment">  # mở tài liệu: từng khung giải mã (lib0 decoding)</span>
node do83.mjs go         <span class="tok-comment">  # An + Bình: 1 phím, 1 lần di con trỏ</span>
node do83.mjs nhom       <span class="tok-comment">  # N = 2, 3, 5 người</span>
node do83.mjs nghi       <span class="tok-comment">  # ngồi im 65 s</span>
node do83.mjs io         <span class="tok-comment">  # cùng update qua socket.emit</span>
node do83.mjs khoa       <span class="tok-comment">  # server không onAuthenticate / token giả</span></code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-3-2-buffer" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 3.2 — Buffer: dữ liệu nhị phân</span><span class="lc-sub">Nền để tự đọc từng byte của một khung</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/networking-for-developers/learn?lessonSlug=netdev-9-2-websocket" target="_blank" rel="noopener"><span class="lc-ico">📡</span><span class="lc-body"><span class="lc-title">Networking · 9.2 — WebSocket: nâng cấp, frame và nhịp tim</span><span class="lc-sub">Có cả khung ping điều khiển mà Hocuspocus gửi</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">SyncStep1</span><span class="v">Một state vector ~50 byte — peer này đã có gì.</span></div>
  <div class="kv"><span class="k">SyncStep2</span><span class="v">~10 KB-1 MB các update mà peer kia còn thiếu.</span></div>
  <div class="kv"><span class="k">Update</span><span class="v">Một message stream ~10-100 byte mỗi edit.</span></div>
  <div class="kv"><span class="k">AwarenessUpdate</span><span class="v">~150 byte mỗi lần di cursor.</span></div>
  <div class="kv"><span class="k">State vector</span><span class="v">Một tóm tắt gọn về các update một peer đang giữ.</span></div>
  <div class="kv"><span class="k">Binary optimized</span><span class="v">Không khung JSON và không ping keepalive — tổng bandwidth thấp hơn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Yjs sync protocol dùng bốn binary message type.</li><li>SyncStep1 là một state vector ~50 byte; SyncStep2 là các update còn thiếu (~10 KB-1 MB).</li><li>Update là ~10-100 byte mỗi edit; AwarenessUpdate là ~150 byte mỗi lần di cursor.</li><li>Tổng bandwidth thấp hơn một chat-style socket.io protocol.</li><li>Nó binary optimized và không mang ping keepalive.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">y-protocols/sync</span><span class="lc-sub">github.com/yjs/y-protocols/blob/master/sync.md — spec chính thức.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Hocuspocus extensions</span><span class="lc-sub">hocuspocus.dev/docs/extensions/introduction — Redis, Database, Auth, và các built-in extensions.</span></span></div>
</div>
`,
    },

    {
      title: '8.4 — Persistence: when to save the Y.Doc|||8.4 — Persistence: khi nào save Y.Doc',
      slug: 'io-8-4-persist',
      type: 'VIDEO',
      description: 'Debounce persist (5s idle) + garbage collect old snapshots + Redis pub/sub cho multi-worker + fallback save on disconnect. Kho này có cả bốn.',
      content: `
${G08_4}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.4</span>
<h2>Persistence: when to save the Y.Doc</h2>
<p class="lead">Y.Doc lives in RAM. To survive server restart, you must persist it to storage. But every keystroke = new update = potential save = database hammered. This lesson tunes when to save.</p>

<h3>Four persistence strategies</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Debounced save (the standard)</span><span class="lz-d">Save 5 seconds after the last update. If editing continues, the timer resets. Low cost, ≤5s of staleness. This repo uses it. <em>(measured: the repo uses <code>debounce: 1500</code> with <code>maxDebounce: 10000</code> — typing non-stop for 25 s gave 3 saves)</em></span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Save every N updates</span><span class="lz-d">Save once 100 updates have accumulated. Poor for slow editing (a user types 30 characters then goes to bed → the save is late).</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Interval save</span><span class="lz-d">Save every 30s regardless of whether anything was edited. Simple, but wasteful when nothing changed.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Save on disconnect</span><span class="lz-d">Save when the last user leaves the document. Guarantees the final state is safe.</span></div>
</div>

<div class="callout ok">
<p><strong>This repo uses 1 and 4.</strong> A 5s debounce <em>(really 1.5 s, at most 10 s)</em> for routine saves plus a save on disconnect for the final state. Good enough for the edit frequency notes see.</p>
</div>

<h3>How to store the binary format</h3>
<pre><code class="language-ts">// Encode Y.Doc -&gt; binary Uint8Array
const state = Y.encodeStateAsUpdate(doc);

// Luu vao Postgres BYTEA column
await prisma.note.update({
  where: { id: noteId },
  data: { yjsState: Buffer.from(state) },
});

// Doc lai
const note = await prisma.note.findUnique({ where: { id: noteId } });
const doc = new Y.Doc();
Y.applyUpdate(doc, note.yjsState);
</code></pre>

<h3>HTML snapshot cho search</h3>
<pre><code class="language-ts">// Yjs state la binary, khong searchable trong SQL.
// Luu them HTML snapshot khi persist:
const html = generateHTML(TiptapTransformer.fromYdoc(doc, 'default'), extensions);
await prisma.note.update({
  where: { id: noteId },
  data: { yjsState: Buffer.from(state), htmlSnapshot: html, contentText: stripHTML(html) },
});

// Search dung contentText column (indexed full-text search)
</code></pre>

<div class="callout warn">
<p><strong>Snapshot lag sau Y.Doc live.</strong> The user edits until t=10s and the snapshot saves at t=15s. The search index holds the t=15s state. A user searching for something they typed at t=12s finds nothing for 3 seconds <em>(measured with the repo&#39;s settings: findable after 1508 / 1538 ms; worst case 10 s while typing non-stop)</em>. Acceptable for notes; not for realtime code search.</p>
</div>

<h3>Garbage-collecting old updates</h3>
<pre><code class="language-ts">// Sau nhieu edit, Y.Doc chua nhieu update lich su
// Encode state -&gt; nen (thuong ~2-3x tot hon raw)
const compactState = Y.encodeStateAsUpdate(doc);
// Snapshot cu:  120 KB
// Compact:      45 KB (khi khong co dieu gi de compact them)

// Chay dinh ky (dem, khi user khong online)
</code></pre>

<h3>Redis pub/sub cho multi-worker sync</h3>
<pre><code class="language-ts">// Hocuspocus Redis extension tu dong xu ly
new Redis({ host: config.redis.host, port: 6379, prefix: 'notes:' });   // repo: prefix 'cuongthai:notes-collaboration'

// Worker A nhan update -&gt; publish qua Redis
// Worker B, C, D subscribe -&gt; apply update vao Y.Doc trong memory
// Tuong tu socket.io Redis adapter (bai 5.1)
</code></pre>

<div class="pitfall">
<p><strong>Trap — saving synchronously inside the <code>onChange</code> handler.</strong> The handler runs synchronously on the hot path. A 20ms Postgres write stalls sync for 20ms and users feel the lag. <em>(Measured on Hocuspocus 2.15.3: an <code>onChange</code> that awaits 500 ms did NOT delay peers — p50 0.8 ms vs 0.8 ms — because the update is broadcast first; a <code>beforeHandleMessage</code> that awaits 200 ms delayed every message to 203.1 ms. Watch that hook.)</em> The fix: <code>scheduleDbPersist</code> onto a background queue and return immediately.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Y.Doc persistence is a 5s idle debounced save plus a save on disconnect plus a separate HTML snapshot for search plus Redis pub/sub for multiple workers plus an async queue so the sync hot path never blocks — this repo applies all five patterns in notes-collaboration.gateway.ts.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Implement a 5s idle-debounced save of the Y.Doc plus a save on disconnect, and confirm rapid edits do not trigger a save on every keystroke.</li>
<li>Add a separate HTML snapshot for search and an async queue so the persistence write never blocks the sync hot path.</li>
<li>Add Redis pub/sub so multiple workers stay in sync, then list all five patterns you now have.</li>
</ol>
<p><strong>Done when:</strong> edits persist without blocking sync, and you can name all five persistence patterns.</p></div>

<h3>🔬 Measured: when does the Y.Doc reach Postgres?</h3>
<p>Hocuspocus 2.15.3 configured like the repo (<code>debounce: 1500</code>, <code>maxDebounce: 10000</code>), storing the merged state into a real Postgres BYTEA table. Three typing patterns:</p>
<div class="out">$ node hp84.mjs &amp;   node do84.mjs lien     # debounce 1500 / maxDebounce 10000 như kho · gõ đều 1 ký tự / 200 ms trong 25 s
[khách]   0.02 s bắt đầu gõ: 1 ký tự / 200 ms trong 25 s
[khách]  25.28 s ngừng gõ (125 ký tự)
$ node do84.mjs cum                        # gõ nhanh 30 ký tự rồi ngừng
[khách]   0.01 s gõ nhanh 30 ký tự rồi ngừng
[khách]   0.68 s ngừng
$ node do84.mjs roi                        # gõ 10 ký tự rồi đóng tab ngay
[khách]   0.01 s gõ 10 ký tự rồi ĐÓNG tab ngay
$ # log server
[w1]   0.00 s nghe :19906 · debounce 1500 / maxDebounce 10000
[w1]   1.94 s nạp note:42 từ DB: chưa có
[w1]  12.06 s LƯU note:42: 51 update gộp thành 65 B · 51 ký tự · ghi DB 8 ms
[w1]  22.37 s LƯU note:42: 51 update gộp thành 116 B · 102 ký tự · ghi DB 15 ms
[w1]  28.51 s LƯU note:42: 23 update gộp thành 139 B · 125 ký tự · ghi DB 4 ms
[w1]  30.21 s gỡ note:42 khỏi RAM (không còn ai mở)
[w1]  30.30 s nạp note:42 từ DB: 139 B
[w1]  32.45 s LƯU note:42: 30 update gộp thành 184 B · 155 ký tự · ghi DB 3 ms
[w1]  33.97 s gỡ note:42 khỏi RAM (không còn ai mở)
[w1]  34.05 s nạp note:42 từ DB: 184 B
[w1]  34.06 s gỡ note:42 khỏi RAM (không còn ai mở)
[w1]  34.06 s LƯU note:42: 10 update gộp thành 209 B · 165 ký tự · ghi DB 3 ms</div>
<p>How stale the search column is, and which hook sits on the sync hot path:</p>
<div class="out">$ node do84.mjs tim     # gõ một từ lạ ⇒ bao lâu thì cột content_text (để tìm kiếm) có nó
[khách] gõ "tuyetmat117" ⇒ DB tìm thấy sau 1508 ms (cột content_text, cập nhật lúc LƯU)
$ node do84.mjs tim
[khách] gõ "tuyetmat721" ⇒ DB tìm thấy sau 1538 ms (cột content_text, cập nhật lúc LƯU)</div>
<div class="out">$ node do84.mjs tre                          # bình thường
[khách] An gõ ⇒ Bình thấy (cùng server): p50 0.8 ms · max 1.7 ms · 20 lần
$ CHAM_CHANGE=500 node hp84.mjs &amp;   node do84.mjs tre    # onChange await 500 ms (ghi DB ngay trong onChange)
[khách] An gõ ⇒ Bình thấy (cùng server): p50 0.8 ms · max 1.8 ms · 20 lần
$ CHAM_BEFORE=200 node hp84.mjs &amp;   node do84.mjs tre    # beforeHandleMessage await 200 ms (truy vấn quyền)
[khách] An gõ ⇒ Bình thấy (cùng server): p50 203.1 ms · max 204.1 ms · 20 lần</div>
<p>A crash before the debounce fires — with a tab still open:</p>
<div class="out">$ kill -9 &lt;pid server&gt;      # 0,8 s sau khi gõ — trước hạn debounce 1,5 s
$ psql -tAc "SELECT content_text FROM note_collab84 WHERE note_id = 42"
(DB chưa có gì)
$ node hp84.mjs &amp;      # khởi động lại — tab của khách VẪN MỞ, provider tự nối lại
$ psql -tAc "SELECT content_text FROM note_collab84 WHERE note_id = 42"
KKKKK
$ # log server mới
[w1]   0.00 s nghe :19906 · debounce 1500 / maxDebounce 10000
[w1]   0.31 s nạp note:42 từ DB: chưa có
[w1]   1.81 s LƯU note:42: 1 update gộp thành 19 B · 5 ký tự · ghi DB 3 ms
$ # log khách
[khách]   0.02 s gõ 5 chữ K, tab VẪN MỞ (bản sao trong RAM của trình duyệt)</div>
<div class="callout ok"><p><strong>Read it:</strong> every open tab is a full replica. After <code>kill -9</code> the database had nothing; the restarted server got the five characters back from the tab&#39;s provider. Data is lost only if the server and every tab that had it die inside the same debounce window.</p></div>
<p>A deploy while someone edits — the repo&#39;s shutdown (closes socket.io&#39;s engine, not Hocuspocus) versus <code>closeConnections()</code> first:</p>
<div class="out">$ kill -TERM &lt;pid server&gt;    # deploy: SIGTERM · shutdown chép khuôn src/index.ts:816-858
$ # log server (TAT=kho)
[w1]   0.00 s nghe :19906 · debounce 1500 / maxDebounce 10000
[w1]   1.97 s nạp note:42 từ DB: chưa có
[w1]   2.69 s SIGTERM (TAT=kho)
[w1]   3.48 s LƯU note:42: 5 update gộp thành 18 B · 5 ký tự · ghi DB 4 ms
[w1]  10.69 s còn kết nối dài ⇒ ÉP thoát sau 8003 ms, mã 1
$ psql -tAc "SELECT content_text FROM note_collab84 WHERE note_id = 42"
KKKKK
$ kill -TERM &lt;pid server&gt;    # TAT=sua: hocuspocus.closeConnections() trước
$ # log server (TAT=sua)
[w1]   0.00 s nghe :19906 · debounce 1500 / maxDebounce 10000
[w1]   1.95 s nạp note:42 từ DB: chưa có
[w1]   2.66 s SIGTERM (TAT=sua)
[w1]   2.67 s HTTP server đóng xong sau 2 ms ⇒ thoát mã 0
[w1]   2.67 s LƯU note:42: 5 update gộp thành 19 B · 5 ký tự · ghi DB 3 ms
[w1]   2.67 s gỡ note:42 khỏi RAM (không còn ai mở)
$ psql -tAc "SELECT content_text FROM note_collab84 WHERE note_id = 42"
KKKKK</div>
<div class="out">$ cd ~/api-backend &amp;&amp; grep -n "await tx\\.\\|\\$transaction\\|void syncNoteReferences" src/socket/notes-collaboration.gateway.ts
99:  await prisma.$transaction(async (tx) =&gt; {
100:    const current = await tx.note.findFirst({
106:    await tx.noteCollaborationDocument.upsert({
123:    const updated = await tx.note.update({
127:    const latest = await tx.noteVersion.findFirst({
135:      await tx.noteVersion.update({
146:      const numbered = await tx.note.update({
150:      await tx.noteVersion.create({
171:  void syncNoteReferences(noteId);
$ grep -n "sio?.engine?.close\\|8_000\\|Hocuspocus\\|closeConnections" src/index.ts
169:// CTW K-3b: đồng soạn thảo Docs của CT Work (Hocuspocus/Yjs) trên /notes-collaboration/work-docs
754:// Dedicated Hocuspocus/Yjs protocol on /notes-collaboration. It shares the
852: try { sio?.engine?.close(); } catch { /* bỏ qua */ }
858: }, 8_000).unref();</div>
<div class="callout bad"><p><strong>Latent issue in this repo:</strong> <code>src/index.ts:816-858</code> never closes the Hocuspocus connections, so with any note open <code>server.close()</code> never finishes and every deploy ends with the forced exit after 8 s, exit code 1. The pending save only happens if the debounce fires inside those 8 s. Fix: call <code>closeConnections()</code> on both Hocuspocus instances before <code>server.close()</code>.</p></div>
<p>Two workers with the Redis extension:</p>
<div class="out">$ REDIS=1 node hp84.mjs (:19906 wA, :19907 wB) &amp;   node do84.mjs tre 19906 19907   # An ở worker A, Bình ở worker B
[khách] An gõ ⇒ Bình thấy (An :19906, Bình :19907): p50 6.5 ms · max 36.1 ms · 20 lần
$ node do84.mjs tre 19906 19906       # cùng worker, để so
[khách] An gõ ⇒ Bình thấy (An :19906, Bình :19906): p50 1.1 ms · max 3.0 ms · 20 lần
$ # log worker A
[wA]   0.00 s nghe :19906 · debounce 1500 / maxDebounce 10000 · Redis
[wA]   2.45 s nạp note:42 từ DB: chưa có
[wA]   4.72 s LƯU note:42: 20 update gộp thành 186 B · 20 ký tự · ghi DB 2 ms
[wA]   4.72 s gỡ note:42 khỏi RAM (không còn ai mở)
[wA]   4.81 s nạp note:42 từ DB: 186 B
[wA]   6.90 s LƯU note:42: 20 update gộp thành 373 B · 40 ký tự · ghi DB 7 ms
[wA]   6.90 s gỡ note:42 khỏi RAM (không còn ai mở)
$ # log worker B
[wB]   0.00 s nghe :19907 · debounce 1500 / maxDebounce 10000 · Redis
[wB]   2.47 s nạp note:42 từ DB: chưa có
[wB]   4.72 s gỡ note:42 khỏi RAM (không còn ai mở)</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash"><span class="tok-comment"># lab c8: Hocuspocus 2.15.3 (debounce 1500 / maxDebounce 10000 như kho) + Postgres (bảng BYTEA) + Redis</span>
node hp84.mjs &amp;                       <span class="tok-comment">  # :19906 · in mốc mỗi lần LƯU</span>
node do84.mjs lien | cum | roi        <span class="tok-comment">  # gõ đều 25 s · gõ nhanh 30 phím · gõ rồi đóng tab</span>
node do84.mjs tim                     <span class="tok-comment">  # bao lâu thì content_text có chữ mới</span>
CHAM_CHANGE=500 node hp84.mjs &amp;   node do84.mjs tre   <span class="tok-comment">  # làm chậm onChange</span>
CHAM_BEFORE=200 node hp84.mjs &amp;   node do84.mjs tre   <span class="tok-comment">  # làm chậm beforeHandleMessage</span>
node do84.mjs giu 19906 20000 &amp;   kill -9 &lt;server&gt;    <span class="tok-comment">  # sập trước hạn, tab còn mở ⇒ khởi động lại</span>
TAT=kho | TAT=sua node hp84.mjs &amp;   kill -TERM &lt;server&gt;<span class="tok-comment">  # tắt máy kiểu kho vs closeConnections() trước</span>
REDIS=1 TEN=wA CONG=19906 node hp84.mjs &amp; REDIS=1 TEN=wB CONG=19907 node hp84.mjs &amp;   node do84.mjs tre 19906 19907</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-7-3-crud-transaction" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 7.3 — CRUD, transactions, and moving the Notes API to PostgreSQL</span><span class="lc-sub">One save here is a transaction of 5–6 queries</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-4-4-custom-hook" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 4.4 — Custom hooks: useDebounce and friends</span><span class="lc-sub">The same “wait until they stop” idea, in the browser</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-8-1-pubsub" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 8.1 — Pub/Sub: fire and forget, and its price</span><span class="lc-sub">What the Hocuspocus Redis extension relays updates over</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Idle-debounced save</span><span class="v">Save 5s after the last edit, not on every keystroke.</span></div>
  <div class="kv"><span class="k">Save on disconnect</span><span class="v">Flush the Y.Doc when the last editor leaves.</span></div>
  <div class="kv"><span class="k">HTML snapshot</span><span class="v">A separate rendered copy kept for search.</span></div>
  <div class="kv"><span class="k">Redis pub/sub</span><span class="v">Keeps multiple workers' copies of the doc in sync.</span></div>
  <div class="kv"><span class="k">Async queue</span><span class="v">Persistence runs off the sync hot path so it never blocks.</span></div>
  <div class="kv"><span class="k">Hot path</span><span class="v">The latency-sensitive sync loop that must stay unblocked.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Y.Doc persistence is a 5s idle-debounced save plus a save on disconnect.</li><li>Plus a separate HTML snapshot for search.</li><li>Plus Redis pub/sub for multiple workers.</li><li>Plus an async queue so the sync hot path never blocks.</li><li>This repo applies all five patterns in <code>notes-collaboration.gateway.ts</code>.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Hocuspocus — Database extension</span><span class="lc-sub">hocuspocus.dev/docs/extensions/database — pattern chuẩn cho persistence.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.4</span>
<h2>Persistence: khi nào save Y.Doc</h2>
<p class="lead">Y.Doc sống trong RAM. Để sống sót server restart, bạn phải persist vào storage. Nhưng mỗi keystroke = update mới = có thể save = database bị đập. Bài này tune khi nào save.</p>

<h3>Bốn persistence strategy</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Debounce save (chuẩn)</span><span class="lz-d">Save 5 giây sau update cuối. Nếu edit tiếp tục, timer reset. Cost thấp, staleness ≤5s. Kho này dùng. <em>(đo: kho đặt <code>debounce: 1500</code>, trần <code>maxDebounce: 10000</code> — gõ liền 25 s ra 3 lần lưu)</em></span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Save mỗi N updates</span><span class="lz-d">Save khi tích luỹ 100 updates. Không tốt cho slow edits (một user gõ 30 char rồi đi ngủ → save chậm).</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Interval save</span><span class="lz-d">Save mỗi 30s bất kể có edit không. Đơn giản nhưng lãng phí nếu không edit.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Save on disconnect</span><span class="lz-d">Save khi last user rời document. Đảm bảo state cuối cùng an toàn.</span></div>
</div>

<div class="callout ok">
<p><strong>Kho này dùng 1 + 4.</strong> Debounce 5s <em>(thật ra 1,5 s, tối đa 10 s)</em> cho save thường xuyên + save on disconnect cho state cuối. Đủ tốt cho tần suất edit của notes.</p>
</div>

<h3>Cách lưu format binary</h3>
<pre><code class="language-ts">// Encode Y.Doc -&gt; binary Uint8Array
const state = Y.encodeStateAsUpdate(doc);

// Luu vao Postgres BYTEA column
await prisma.note.update({
  where: { id: noteId },
  data: { yjsState: Buffer.from(state) },
});

// Doc lai
const note = await prisma.note.findUnique({ where: { id: noteId } });
const doc = new Y.Doc();
Y.applyUpdate(doc, note.yjsState);
</code></pre>

<h3>HTML snapshot cho search</h3>
<pre><code class="language-ts">// Yjs state la binary, khong searchable trong SQL.
// Luu them HTML snapshot khi persist:
const html = generateHTML(TiptapTransformer.fromYdoc(doc, 'default'), extensions);
await prisma.note.update({
  where: { id: noteId },
  data: { yjsState: Buffer.from(state), htmlSnapshot: html, contentText: stripHTML(html) },
});

// Search dung contentText column (indexed full-text search)
</code></pre>

<div class="callout warn">
<p><strong>Snapshot lag sau Y.Doc live.</strong> User edit đến t=10s, snapshot save ở t=15s. Search index có state của t=15s. User search từ họ vừa gõ ở t=12s → không tìm ra 3s <em>(đo với cấu hình kho: tìm thấy sau 1508 / 1538 ms; xấu nhất 10 s khi gõ liên tục)</em>. Chấp nhận được với notes; không cho code search realtime.</p>
</div>

<h3>Garbage collect updates cũ</h3>
<pre><code class="language-ts">// Sau nhieu edit, Y.Doc chua nhieu update lich su
// Encode state -&gt; nen (thuong ~2-3x tot hon raw)
const compactState = Y.encodeStateAsUpdate(doc);
// Snapshot cu:  120 KB
// Compact:      45 KB (khi khong co dieu gi de compact them)

// Chay dinh ky (dem, khi user khong online)
</code></pre>

<h3>Redis pub/sub cho multi-worker sync</h3>
<pre><code class="language-ts">// Hocuspocus Redis extension tu dong xu ly
new Redis({ host: config.redis.host, port: 6379, prefix: 'notes:' });   // repo: prefix 'cuongthai:notes-collaboration'

// Worker A nhan update -&gt; publish qua Redis
// Worker B, C, D subscribe -&gt; apply update vao Y.Doc trong memory
// Tuong tu socket.io Redis adapter (bai 5.1)
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — save đồng bộ trong <code>onChange</code> handler.</strong> Handler chạy sync trên hot path. Postgres write 20ms → sync stalls 20ms → users thấy lag. <em>(Đo trên Hocuspocus 2.15.3: <code>onChange</code> chờ 500 ms KHÔNG làm người khác trễ — p50 0.8 ms so với 0.8 ms — vì update được phát trước; <code>beforeHandleMessage</code> chờ 200 ms làm mọi tin trễ 203.1 ms. Hook cần canh là hook đó.)</em> Fix: <code>scheduleDbPersist</code> vào queue background, trả về ngay.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Persistence Y.Doc = debounce save 5s idle + save on disconnect + snapshot HTML riêng cho search + Redis pub/sub multi-worker + async queue để không block sync hot path — kho này áp cả năm pattern trong notes-collaboration.gateway.ts.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Cài một save Y.Doc debounce 5s idle cộng một save on disconnect, và xác nhận edit nhanh không trigger save mỗi phím gõ.</li>
<li>Thêm một snapshot HTML riêng cho search và một async queue để write persistence không block sync hot path.</li>
<li>Thêm Redis pub/sub để nhiều worker đồng bộ, rồi liệt kê cả năm pattern bạn giờ có.</li>
</ol>
<p><strong>Đạt khi:</strong> edit được lưu mà không block sync, và bạn gọi tên được cả năm pattern persistence.</p></div>

<h3>🔬 Đo thật: lúc nào Y.Doc xuống Postgres?</h3>
<p>Hocuspocus 2.15.3 cấu hình như kho (<code>debounce: 1500</code>, <code>maxDebounce: 10000</code>), lưu trạng thái gộp vào bảng BYTEA của một Postgres thật. Ba kiểu gõ:</p>
<div class="out">$ node hp84.mjs &amp;   node do84.mjs lien     # debounce 1500 / maxDebounce 10000 như kho · gõ đều 1 ký tự / 200 ms trong 25 s
[khách]   0.02 s bắt đầu gõ: 1 ký tự / 200 ms trong 25 s
[khách]  25.28 s ngừng gõ (125 ký tự)
$ node do84.mjs cum                        # gõ nhanh 30 ký tự rồi ngừng
[khách]   0.01 s gõ nhanh 30 ký tự rồi ngừng
[khách]   0.68 s ngừng
$ node do84.mjs roi                        # gõ 10 ký tự rồi đóng tab ngay
[khách]   0.01 s gõ 10 ký tự rồi ĐÓNG tab ngay
$ # log server
[w1]   0.00 s nghe :19906 · debounce 1500 / maxDebounce 10000
[w1]   1.94 s nạp note:42 từ DB: chưa có
[w1]  12.06 s LƯU note:42: 51 update gộp thành 65 B · 51 ký tự · ghi DB 8 ms
[w1]  22.37 s LƯU note:42: 51 update gộp thành 116 B · 102 ký tự · ghi DB 15 ms
[w1]  28.51 s LƯU note:42: 23 update gộp thành 139 B · 125 ký tự · ghi DB 4 ms
[w1]  30.21 s gỡ note:42 khỏi RAM (không còn ai mở)
[w1]  30.30 s nạp note:42 từ DB: 139 B
[w1]  32.45 s LƯU note:42: 30 update gộp thành 184 B · 155 ký tự · ghi DB 3 ms
[w1]  33.97 s gỡ note:42 khỏi RAM (không còn ai mở)
[w1]  34.05 s nạp note:42 từ DB: 184 B
[w1]  34.06 s gỡ note:42 khỏi RAM (không còn ai mở)
[w1]  34.06 s LƯU note:42: 10 update gộp thành 209 B · 165 ký tự · ghi DB 3 ms</div>
<p>Cột tìm kiếm cũ tới đâu, và hook nào nằm trên đường nóng của đồng bộ:</p>
<div class="out">$ node do84.mjs tim     # gõ một từ lạ ⇒ bao lâu thì cột content_text (để tìm kiếm) có nó
[khách] gõ "tuyetmat117" ⇒ DB tìm thấy sau 1508 ms (cột content_text, cập nhật lúc LƯU)
$ node do84.mjs tim
[khách] gõ "tuyetmat721" ⇒ DB tìm thấy sau 1538 ms (cột content_text, cập nhật lúc LƯU)</div>
<div class="out">$ node do84.mjs tre                          # bình thường
[khách] An gõ ⇒ Bình thấy (cùng server): p50 0.8 ms · max 1.7 ms · 20 lần
$ CHAM_CHANGE=500 node hp84.mjs &amp;   node do84.mjs tre    # onChange await 500 ms (ghi DB ngay trong onChange)
[khách] An gõ ⇒ Bình thấy (cùng server): p50 0.8 ms · max 1.8 ms · 20 lần
$ CHAM_BEFORE=200 node hp84.mjs &amp;   node do84.mjs tre    # beforeHandleMessage await 200 ms (truy vấn quyền)
[khách] An gõ ⇒ Bình thấy (cùng server): p50 203.1 ms · max 204.1 ms · 20 lần</div>
<p>Sập trước khi debounce kịp chạy — tab vẫn mở:</p>
<div class="out">$ kill -9 &lt;pid server&gt;      # 0,8 s sau khi gõ — trước hạn debounce 1,5 s
$ psql -tAc "SELECT content_text FROM note_collab84 WHERE note_id = 42"
(DB chưa có gì)
$ node hp84.mjs &amp;      # khởi động lại — tab của khách VẪN MỞ, provider tự nối lại
$ psql -tAc "SELECT content_text FROM note_collab84 WHERE note_id = 42"
KKKKK
$ # log server mới
[w1]   0.00 s nghe :19906 · debounce 1500 / maxDebounce 10000
[w1]   0.31 s nạp note:42 từ DB: chưa có
[w1]   1.81 s LƯU note:42: 1 update gộp thành 19 B · 5 ký tự · ghi DB 3 ms
$ # log khách
[khách]   0.02 s gõ 5 chữ K, tab VẪN MỞ (bản sao trong RAM của trình duyệt)</div>
<div class="callout ok"><p><strong>Đọc:</strong> mỗi tab đang mở là một bản sao đầy đủ. Sau <code>kill -9</code> cơ sở dữ liệu trống; server khởi động lại nhận lại năm ký tự từ provider của tab. Chỉ mất khi server và mọi tab có dữ liệu cùng chết trong một khoảng debounce.</p></div>
<p>Deploy giữa lúc có người sửa — shutdown của kho (đóng engine socket.io, không đóng Hocuspocus) so với gọi <code>closeConnections()</code> trước:</p>
<div class="out">$ kill -TERM &lt;pid server&gt;    # deploy: SIGTERM · shutdown chép khuôn src/index.ts:816-858
$ # log server (TAT=kho)
[w1]   0.00 s nghe :19906 · debounce 1500 / maxDebounce 10000
[w1]   1.97 s nạp note:42 từ DB: chưa có
[w1]   2.69 s SIGTERM (TAT=kho)
[w1]   3.48 s LƯU note:42: 5 update gộp thành 18 B · 5 ký tự · ghi DB 4 ms
[w1]  10.69 s còn kết nối dài ⇒ ÉP thoát sau 8003 ms, mã 1
$ psql -tAc "SELECT content_text FROM note_collab84 WHERE note_id = 42"
KKKKK
$ kill -TERM &lt;pid server&gt;    # TAT=sua: hocuspocus.closeConnections() trước
$ # log server (TAT=sua)
[w1]   0.00 s nghe :19906 · debounce 1500 / maxDebounce 10000
[w1]   1.95 s nạp note:42 từ DB: chưa có
[w1]   2.66 s SIGTERM (TAT=sua)
[w1]   2.67 s HTTP server đóng xong sau 2 ms ⇒ thoát mã 0
[w1]   2.67 s LƯU note:42: 5 update gộp thành 19 B · 5 ký tự · ghi DB 3 ms
[w1]   2.67 s gỡ note:42 khỏi RAM (không còn ai mở)
$ psql -tAc "SELECT content_text FROM note_collab84 WHERE note_id = 42"
KKKKK</div>
<div class="out">$ cd ~/api-backend &amp;&amp; grep -n "await tx\\.\\|\\$transaction\\|void syncNoteReferences" src/socket/notes-collaboration.gateway.ts
99:  await prisma.$transaction(async (tx) =&gt; {
100:    const current = await tx.note.findFirst({
106:    await tx.noteCollaborationDocument.upsert({
123:    const updated = await tx.note.update({
127:    const latest = await tx.noteVersion.findFirst({
135:      await tx.noteVersion.update({
146:      const numbered = await tx.note.update({
150:      await tx.noteVersion.create({
171:  void syncNoteReferences(noteId);
$ grep -n "sio?.engine?.close\\|8_000\\|Hocuspocus\\|closeConnections" src/index.ts
169:// CTW K-3b: đồng soạn thảo Docs của CT Work (Hocuspocus/Yjs) trên /notes-collaboration/work-docs
754:// Dedicated Hocuspocus/Yjs protocol on /notes-collaboration. It shares the
852: try { sio?.engine?.close(); } catch { /* bỏ qua */ }
858: }, 8_000).unref();</div>
<div class="callout bad"><p><strong>Điểm yếu tiềm ẩn của kho:</strong> <code>src/index.ts:816-858</code> không đóng kết nối Hocuspocus, nên chỉ cần một ghi chú đang mở là <code>server.close()</code> không bao giờ xong và mỗi lần deploy kết thúc bằng ép thoát sau 8 s, mã 1. Lần lưu còn treo chỉ xảy ra nếu debounce kịp chạy trong 8 s đó. Sửa: gọi <code>closeConnections()</code> của cả hai Hocuspocus trước <code>server.close()</code>.</p></div>
<p>Hai worker với extension Redis:</p>
<div class="out">$ REDIS=1 node hp84.mjs (:19906 wA, :19907 wB) &amp;   node do84.mjs tre 19906 19907   # An ở worker A, Bình ở worker B
[khách] An gõ ⇒ Bình thấy (An :19906, Bình :19907): p50 6.5 ms · max 36.1 ms · 20 lần
$ node do84.mjs tre 19906 19906       # cùng worker, để so
[khách] An gõ ⇒ Bình thấy (An :19906, Bình :19906): p50 1.1 ms · max 3.0 ms · 20 lần
$ # log worker A
[wA]   0.00 s nghe :19906 · debounce 1500 / maxDebounce 10000 · Redis
[wA]   2.45 s nạp note:42 từ DB: chưa có
[wA]   4.72 s LƯU note:42: 20 update gộp thành 186 B · 20 ký tự · ghi DB 2 ms
[wA]   4.72 s gỡ note:42 khỏi RAM (không còn ai mở)
[wA]   4.81 s nạp note:42 từ DB: 186 B
[wA]   6.90 s LƯU note:42: 20 update gộp thành 373 B · 40 ký tự · ghi DB 7 ms
[wA]   6.90 s gỡ note:42 khỏi RAM (không còn ai mở)
$ # log worker B
[wB]   0.00 s nghe :19907 · debounce 1500 / maxDebounce 10000 · Redis
[wB]   2.47 s nạp note:42 từ DB: chưa có
[wB]   4.72 s gỡ note:42 khỏi RAM (không còn ai mở)</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash"><span class="tok-comment"># lab c8: Hocuspocus 2.15.3 (debounce 1500 / maxDebounce 10000 như kho) + Postgres (bảng BYTEA) + Redis</span>
node hp84.mjs &amp;                       <span class="tok-comment">  # :19906 · in mốc mỗi lần LƯU</span>
node do84.mjs lien | cum | roi        <span class="tok-comment">  # gõ đều 25 s · gõ nhanh 30 phím · gõ rồi đóng tab</span>
node do84.mjs tim                     <span class="tok-comment">  # bao lâu thì content_text có chữ mới</span>
CHAM_CHANGE=500 node hp84.mjs &amp;   node do84.mjs tre   <span class="tok-comment">  # làm chậm onChange</span>
CHAM_BEFORE=200 node hp84.mjs &amp;   node do84.mjs tre   <span class="tok-comment">  # làm chậm beforeHandleMessage</span>
node do84.mjs giu 19906 20000 &amp;   kill -9 &lt;server&gt;    <span class="tok-comment">  # sập trước hạn, tab còn mở ⇒ khởi động lại</span>
TAT=kho | TAT=sua node hp84.mjs &amp;   kill -TERM &lt;server&gt;<span class="tok-comment">  # tắt máy kiểu kho vs closeConnections() trước</span>
REDIS=1 TEN=wA CONG=19906 node hp84.mjs &amp; REDIS=1 TEN=wB CONG=19907 node hp84.mjs &amp;   node do84.mjs tre 19906 19907</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-7-3-crud-transaction" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 7.3 — CRUD, transaction, và đổi ruột Notes API sang PostgreSQL</span><span class="lc-sub">Mỗi lần lưu ở đây là một transaction 5–6 truy vấn</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-4-4-custom-hook" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 4.4 — Hook tự viết: useDebounce…</span><span class="lc-sub">Cùng ý “chờ ngừng rồi mới làm”, ở trình duyệt</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/redis/learn?lessonSlug=rd-8-1-pubsub" target="_blank" rel="noopener"><span class="lc-ico">🟥</span><span class="lc-body"><span class="lc-title">Redis · 8.1 — Pub/Sub: bắn rồi quên, và cái giá của nó</span><span class="lc-sub">Thứ extension Redis của Hocuspocus dùng để chuyển update</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Save debounce idle</span><span class="v">Lưu 5s sau edit cuối, không phải mỗi phím gõ.</span></div>
  <div class="kv"><span class="k">Save on disconnect</span><span class="v">Flush Y.Doc khi editor cuối rời đi.</span></div>
  <div class="kv"><span class="k">Snapshot HTML</span><span class="v">Một bản render riêng giữ cho search.</span></div>
  <div class="kv"><span class="k">Redis pub/sub</span><span class="v">Giữ các bản doc của nhiều worker đồng bộ.</span></div>
  <div class="kv"><span class="k">Async queue</span><span class="v">Persistence chạy ngoài sync hot path nên không block.</span></div>
  <div class="kv"><span class="k">Hot path</span><span class="v">Vòng sync nhạy latency phải giữ không bị block.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Persistence Y.Doc là một save debounce 5s idle cộng một save on disconnect.</li><li>Cộng một snapshot HTML riêng cho search.</li><li>Cộng Redis pub/sub cho nhiều worker.</li><li>Cộng một async queue để sync hot path không bao giờ block.</li><li>Kho này áp cả năm pattern trong <code>notes-collaboration.gateway.ts</code>.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Hocuspocus — Database extension</span><span class="lc-sub">hocuspocus.dev/docs/extensions/database — pattern chuẩn cho persistence.</span></span></div>
</div>
`,
    },

    {
      title: '8.5 — Auth and permissions per document|||8.5 — Auth và permission per document',
      slug: 'io-8-5-auth',
      type: 'VIDEO',
      description: 'Kho này có `authenticateNoteRealtimeToken` + `resolveNoteAccess` — check permission LIVE với 5s TTL cache. Owner + shared users, read vs write.',
      content: `
${G08_5}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.5</span>
<h2>Auth and permissions per document</h2>
<p class="lead">Socket.io auth (Chapter 1.4) is one JWT validated at connect. Hocuspocus needs per-document permission — user may edit note 1 but only read note 2. This lesson shows the pattern this repo uses.</p>

<h3>Two-stage auth</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Authenticate at connect</span><span class="lz-d">The client sends its token in <code>connectionParams</code>. Hocuspocus <code>onAuthenticate</code> verify + return context (userId).</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Authorize per document</span><span class="lz-d">A user can connect to many documents. On each open, check permissions: owner? shared? read-only? This repo resolves that in <em>(measured: not here — the repo checks in <code>onAuthenticate</code>, from a token bound to one note)</em> <code>onLoadDocument</code>.</span></div>
</div>

<h3>This repo's code</h3>
<pre><code class="language-ts">// notes-collaboration.gateway.ts
const collaborationServer = new Hocuspocus({
  async onAuthenticate({ token }) {
    return await authenticateNoteRealtimeToken(token);
    // return { userId } hoac throw
  },
  async onLoadDocument({ documentName, context }) {
    // documentName = "note-42"   (repo: "note:42", and the check lives in onAuthenticate — see below)
    const noteId = parseInt(documentName.replace('note-', ''), 10);
    const access = await resolveNoteAccess(noteId, context.userId);
    if (!access.canRead) throw new Error('forbidden');
    // Return existing Y.Doc or create new one
  },
  async beforeHandleMessage({ documentName, context }) {
    // Check permission LIVE truoc moi update (co cache 5s TTL)
    const canEdit = await canEditSharedNote(noteId, context.userId);
    if (!canEdit) throw new Error('read-only');
  },
});
</code></pre>

<h3>Cache permission — trade off staleness vs latency</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">no cache</span><span class="lz-lnote">A DB query per update. 100 edits/s means 100 queries/s. The Prisma pool drains fast</span></div>
<div class="lz-layer"><span class="lz-lname">a 5s TTL (this repo)</span><span class="lz-lnote">One DB query per 5s per user per document. If the owner revokes access at t=1s, the user can still edit until t=5s. Acceptable</span></div>
<div class="lz-layer"><span class="lz-lname">TTL 60s</span><span class="lz-lnote">The queries are very cheap. But a 60s revocation lag may be far too long for a sensitive document</span></div>
</div>

<h3>Read vs write permission</h3>
<pre><code class="language-ts">// Chi cho user co canRead join. Ho van thay update tu peers khac
// nhung KHONG the emit update. Hocuspocus tu drop update tu socket khong co canEdit.
// [do: connection.readOnly ⇒ server tra SyncStatus ✗, KHONG ap — nhung chu van nam tren man hinh nguoi xem]

async function resolveNoteAccess(noteId: number, userId: number) {
  const note = await prisma.note.findUnique({ where: { id: noteId } });
  if (note.ownerId === userId) return { canRead: true, canEdit: true };
  
  const share = await prisma.noteShare.findFirst({
    where: { noteId, sharedWithUserId: userId },
  });
  if (!share) return { canRead: false, canEdit: false };
  
  return {
    canRead: true,
    canEdit: share.permission === 'EDIT',
  };
}
</code></pre>

<h3>Revoke permission — kick client</h3>
<pre><code class="language-ts">// Khi owner revoke share, cleanup:
// 1. Xoa noteShare row (Prisma)
// 2. Invalidate cache permission cho user (Redis DEL)   [kho: KHONG co cache quyen trong Redis]
// 3. Kick client dang connect (best-effort)
await collaborationServer.closeConnections({ documentName: &#96;note-\${noteId}&#96; });
// [kho: closeConnections(&#96;note:\${noteId}&#96;) — dong MOI ket noi cua tai lieu tren process nay, ca chu]
// Client cua ex-shared user se thay 'disconnected', reconnect fail vi khong con permission
</code></pre>

<div class="pitfall">
<p><strong>Trap — caching permissions and forgetting to invalidate.</strong> The owner revokes at t=0. The cache TTL is 5s. The ex-user keeps editing from t=0 to t=5 (because of the cache). If invalidation is buggy, they keep editing forever. The fix: a revoke must explicitly <code>redis.del</code> + <code>closeConnections</code>.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Hocuspocus auth two-stage — <code>onAuthenticate</code> verifies the token on connect, <code>onLoadDocument</code> + <code>beforeHandleMessage</code> checks permissions per document with a 5s TTL cache — read and write are distinct (canRead to join, canEdit to filter updates), and revoking access means invalidating the cache plus actively calling closeConnections.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Implement <code>onAuthenticate</code> to verify the token on connect, and <code>onLoadDocument</code> + <code>beforeHandleMessage</code> to check per-document permissions with a 5s TTL cache.</li>
<li>Give a user canRead but not canEdit and confirm they can join but their updates are filtered out.</li>
<li>Revoke a user's access and confirm it takes effect by invalidating the cache AND calling <code>closeConnections</code> — not just one.</li>
</ol>
<p><strong>Done when:</strong> read and write are distinct, and a revoke actually drops the live connection.</p></div>

<h3>🔬 Measured: the repo&#39;s own gateway, revoked for real</h3>
<p>The lab runs <code>notes-collaboration.gateway.ts</code> and <code>notesRealtime.service.ts</code> copied unchanged from the repo (md5 equal), with Prisma, shares and the logger faked in memory, and real Hocuspocus 2.15.3 providers:</p>
<div class="out">$ cp ~/api-backend/src/socket/notes-collaboration.gateway.ts kho/socket/ &amp;&amp; cp ~/api-backend/src/services/notesRealtime*.ts kho/services/   # mã KHO, nguyên văn
kho vs lab: bd58ad25fe4881c53926150634b0a6ec	bd58ad25fe4881c53926150634b0a6ec
kho vs lab: 998c6a71752a38a8b1bbce73ea77cb6e	998c6a71752a38a8b1bbce73ea77cb6e
$ ls kho/config kho/services kho/middleware kho/utils    # GIẢ: Prisma trong RAM, quyền chia sẻ trong RAM, logger, AppError
kho/config:
database.ts
env.ts
kho/middleware:
errorHandler.ts
kho/services:
notesHierarchy.service.ts
notesRealtime.service.ts
notesRealtimeSchema.ts
notesShare.service.ts
kho/utils:
logger.ts</div>
<p>The token is bound to one note and lives 300 s:</p>
<div class="out">$ npx tsx may85.ts &amp;   node do85.mjs token     # token của kho: gắn với MỘT tài liệu, sống 5 phút
An xin token note 1: HTTP 200 · documentName note:1 · quyền owner · payload {"kind":"note-collaboration","userId":7,"noteId":1,"roleVersion":1} · sống 300 s
── An mở note:1 bằng token note 1
 0.03 s An ↓ Auth authenticated "read-write"
── An mở note:2 bằng CHÍNH token đó
 0.04 s An ↓ SyncStatus ✓ đã áp
 0.05 s An ↓ Auth permission-denied "permission-denied"
Bình (chưa được chia sẻ) xin token note 1: HTTP 403 · You do not have access to this note
$ # log server
[may] :19908 · gateway của kho trên /notes-collaboration
[onAuthenticate] Mã phiên không khớp tài liệu</div>
<p>A viewer types:</p>
<div class="out">$ node do85.mjs xem      # Bình được chia sẻ quyền viewer
 0.03 s An xin token mới: HTTP 200 · quyền owner
 0.03 s An ↓ Auth authenticated "read-write"
 0.04 s An ↓ SyncStatus ✓ đã áp
 0.05 s Bình xin token mới: HTTP 200 · quyền viewer
 0.05 s Bình ↓ Auth authenticated "readonly"
 0.05 s Bình ↓ SyncStatus ✓ đã áp
 0.35 s Bình ↓ SyncStatus ✗ TỪ CHỐI
 0.85 s Bình (viewer) gõ "B" ⇒ máy Bình: "B" · máy An: ""
 0.85 s An ↓ SyncStatus ✓ đã áp
 1.36 s An (owner) gõ "A" ⇒ máy Bình: "BA" · máy An: "A"</div>
<div class="callout warn"><p><strong>Read it:</strong> the server rejects the viewer&#39;s update (SyncStatus ✗) and nobody else sees it — but it stays on the viewer&#39;s own screen (“BA” vs “A”). The repo frontend therefore never opens the live editor without <code>canEdit</code> (<code>NoteRealtimeEditor.tsx:104</code>).</p></div>
<p>Downgrade an active editor <strong>without</strong> invalidating, then with the repo&#39;s invalidate path, then remove the share:</p>
<div class="out">$ node do85.mjs ha       # Bình (editor) gõ 4 lần/giây · hạ xuống viewer, KHÔNG invalidate
 0.04 s An xin token mới: HTTP 200 · quyền owner
 0.05 s An ↓ Auth authenticated "read-write"
 0.10 s Bình xin token mới: HTTP 200 · quyền editor
 0.10 s Bình ↓ Auth authenticated "read-write"
 1.40 s chủ ghi chú hạ Bình xuống viewer (KHÔNG invalidate)
 5.18 s Bình ✕ WebSocket đóng 4403 Forbidden
 5.19 s Bình xin token mới: HTTP 200 · quyền viewer
 5.19 s Bình ↓ Auth authenticated "readonly"
 5.19 s Bình ↓ SyncStatus ✗ TỪ CHỐI
 5.43 s Bình ↓ SyncStatus ✗ TỪ CHỐI
 5.68 s Bình ↓ SyncStatus ✗ TỪ CHỐI
 5.93 s Bình ↓ SyncStatus ✗ TỪ CHỐI
 9.40 s sau khi đổi quyền: Bình gõ thêm 32 lần; An vẫn NHẬN 15 ký tự, ký tự cuối tới lúc +3.53 s
$ # log server
[may] :19908 · gateway của kho trên /notes-collaboration
[may] 3.66 s quyền user 9 note 1 ⇒ editor (KHÔNG invalidate)
[may] 5.05 s quyền user 9 note 1 ⇒ viewer (KHÔNG invalidate)
[beforeHandleMessage] Quyền truy cập tài liệu vừa được thay đổi</div>
<div class="out">$ node do85.mjs thu      # hạ xuống viewer + invalidateNoteCollaborationDocument (đường kho gọi khi đổi share)
 0.03 s An xin token mới: HTTP 200 · quyền owner
 0.03 s An ↓ Auth authenticated "read-write"
 0.05 s Bình xin token mới: HTTP 200 · quyền editor
 0.05 s Bình ↓ Auth authenticated "read-write"
 1.35 s chủ ghi chú hạ Bình xuống viewer + invalidate (đường kho gọi khi đổi share)
 1.36 s An ✕ WebSocket đóng 4205 Reset Connection
 1.36 s Bình ✕ WebSocket đóng 4205 Reset Connection
 1.36 s An xin token mới: HTTP 200 · quyền owner
 1.36 s Bình xin token mới: HTTP 200 · quyền viewer
 1.36 s An ↓ Auth authenticated "read-write"
 1.36 s Bình ↓ Auth authenticated "readonly"
 1.37 s Bình ↓ SyncStatus ✗ TỪ CHỐI
 1.61 s Bình ↓ SyncStatus ✗ TỪ CHỐI
 1.86 s Bình ↓ SyncStatus ✗ TỪ CHỐI
 9.36 s sau khi đổi quyền: Bình gõ thêm 32 lần; An vẫn NHẬN 0 ký tự, ký tự cuối tới lúc +0.00 s
$ node do85.mjs xoa      # GỠ hẳn chia sẻ + invalidate
 0.03 s An xin token mới: HTTP 200 · quyền owner
 0.03 s An ↓ Auth authenticated "read-write"
 0.05 s Bình xin token mới: HTTP 200 · quyền editor
 0.05 s Bình ↓ Auth authenticated "read-write"
 1.35 s chủ ghi chú GỠ chia sẻ + invalidate (đường kho gọi khi đổi share)
 1.36 s An ✕ WebSocket đóng 4205 Reset Connection
 1.36 s Bình ✕ WebSocket đóng 4205 Reset Connection
 1.36 s An xin token mới: HTTP 200 · quyền owner
 1.36 s Bình xin token mới: HTTP 403 · You do not have access to this note
 1.36 s An ↓ Auth authenticated "read-write"
 1.36 s Bình ↓ Auth permission-denied "permission-denied"
 9.36 s sau khi đổi quyền: Bình gõ thêm 32 lần; An vẫn NHẬN 0 ký tự, ký tự cuối tới lúc +0.00 s</div>
<div class="callout ok"><p><strong>Read it:</strong> without invalidate the editor kept landing characters for 3.53 s, until the 5 s live re-check closed the socket (4403). With invalidate, <code>closeConnections(&#39;note:1&#39;)</code> closed the document for <strong>everyone</strong> — the owner too (4205) — and both reconnected with fresh tokens. There is no Redis permission cache; other processes rely on the 5 s re-check.</p></div>
<div class="out">$ cd ~/api-backend &amp;&amp; grep -n "TOKEN_TTL_SECONDS =\\|decoded.noteId !== noteId\\|resolveNoteAccess(user.id" src/services/notesRealtime.service.ts
13:const TOKEN_TTL_SECONDS = 5 * 60;
107:  if (!match || decoded.kind !== 'note-collaboration' || decoded.noteId !== noteId) {
136:  const access = await resolveNoteAccess(user.id, noteId);
$ grep -n "LIVE_PERMISSION_TTL_MS =\\|connection.readOnly =\\|vừa được thay đổi\\|closeConnections(" src/socket/notes-collaboration.gateway.ts
24:const LIVE_PERMISSION_TTL_MS = 5_000;
35:  collaborationServer?.closeConnections(&#96;note:\${noteId}&#96;);
49:  collaborationServer?.closeConnections(&#96;note:\${noteId}&#96;);
204:      connection.readOnly = !canEditSharedNote(context.permission);
221:        throw new Error('Quyền truy cập tài liệu vừa được thay đổi');
224:      connection.readOnly = !canEditSharedNote(access.permission);
$ grep -n "invalidateRealtimeSubject(" src/services/notesShare.service.ts
89:async function invalidateRealtimeSubject(subjectId: number) {
200:  await invalidateRealtimeSubject(share.subjectId);
362:  await invalidateRealtimeSubject(updated.subject.id);
$ grep -n "if (!session.canEdit)\\|if (!next.canEdit)" frontend/src/components/notes/NoteRealtimeEditor.tsx
104:        if (!session.canEdit) throw new Error('Bạn không còn quyền chỉnh sửa ghi chú này');
130:          if (!next.canEdit) {</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash"><span class="tok-comment"># lab c8: chạy notes-collaboration.gateway.ts + notesRealtime.service.ts CHÉP NGUYÊN TỪ KHO (kho/socket, kho/services), Prisma/quyền/logger GIẢ trong RAM</span>
npm i @hocuspocus/server@2.15.3 @hocuspocus/provider@2.15.3 @hocuspocus/extension-redis@2.15.3 @hocuspocus/transformer@2.15.3 yjs jsonwebtoken @tiptap/starter-kit@2.27.2 …
npx tsx may85.ts &amp;        <span class="tok-comment">  # :19908 · /token?user=&amp;note= · /quyen?user=&amp;note=&amp;vai=viewer|editor|xoa&amp;invalidate=0|1 · Redis :19661 (extension của kho)</span>
node do85.mjs token       <span class="tok-comment">  # token gắn một tài liệu; dùng cho tài liệu khác</span>
node do85.mjs xem         <span class="tok-comment">  # người chỉ-xem gõ chữ</span>
node do85.mjs ha          <span class="tok-comment">  # hạ quyền KHÔNG invalidate — đo cửa sổ</span>
node do85.mjs thu | xoa   <span class="tok-comment">  # hạ quyền / gỡ chia sẻ + invalidate</span></code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-4-7-lab-kiem-jwt" target="_blank" rel="noopener"><span class="lc-ico">🔑</span><span class="lc-body"><span class="lc-title">Authentication · Lab 4 — A JWT verifier</span><span class="lc-sub">Verify the token yourself, claim by claim</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-8-2-jwt-access-refresh" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 8.2 — JWT, refresh tokens and rotation</span><span class="lc-sub">Short-lived tokens, refreshed on reconnect</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/socket-io/learn?lessonSlug=io-1-4-auth" target="_blank" rel="noopener"><span class="lc-ico">⚡</span><span class="lc-body"><span class="lc-title">Socket.IO · 1.4 — Auth: middleware runs BEFORE connection</span><span class="lc-sub">Compare with Hocuspocus onAuthenticate</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>onAuthenticate</code></span><span class="v">Verifies the token once, on connect.</span></div>
  <div class="kv"><span class="k"><code>onLoadDocument</code></span><span class="v">Checks permission when a document is opened.</span></div>
  <div class="kv"><span class="k"><code>beforeHandleMessage</code></span><span class="v">Re-checks permission per update, backed by a 5s TTL cache.</span></div>
  <div class="kv"><span class="k">canRead vs canEdit</span><span class="v">Read lets you join; edit lets your updates through.</span></div>
  <div class="kv"><span class="k">TTL cache</span><span class="v">A 5s permission cache so every message is not a DB hit.</span></div>
  <div class="kv"><span class="k">closeConnections</span><span class="v">Actively drop a revoked user — invalidating the cache alone is not enough.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Hocuspocus auth is two-stage: <code>onAuthenticate</code> on connect, then per-document checks.</li><li><code>onLoadDocument</code> + <code>beforeHandleMessage</code> check permissions with a 5s TTL cache.</li><li>Read and write are distinct — canRead to join, canEdit to filter updates.</li><li>Revoking access means invalidating the cache AND actively calling <code>closeConnections</code>.</li><li>Invalidating the cache alone leaves a live connection with stale access.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Hocuspocus — Authentication hooks</span><span class="lc-sub">hocuspocus.dev/docs/hooks/on-authenticate — hooks cho auth + authorize.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.5</span>
<h2>Auth và permission per document</h2>
<p class="lead">Socket.io auth (Chương 1.4) là một JWT verify ở connect. Hocuspocus cần per-document permission — user có thể edit note 1 nhưng chỉ read note 2. Bài này chỉ pattern kho này dùng.</p>

<h3>Two-stage auth</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Authenticate ở connect</span><span class="lz-d">Client gửi token trong <code>connectionParams</code>. Hocuspocus <code>onAuthenticate</code> verify + return context (userId).</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Authorize per document</span><span class="lz-d">User có thể connect nhiều document. Mỗi lần open, check permission: owner? shared? read-only? Kho này resolve trong <em>(đo: không phải ở đây — kho kiểm trong <code>onAuthenticate</code>, bằng token gắn một ghi chú)</em> <code>onLoadDocument</code>.</span></div>
</div>

<h3>Kho này code</h3>
<pre><code class="language-ts">// notes-collaboration.gateway.ts
const collaborationServer = new Hocuspocus({
  async onAuthenticate({ token }) {
    return await authenticateNoteRealtimeToken(token);
    // return { userId } hoac throw
  },
  async onLoadDocument({ documentName, context }) {
    // documentName = "note-42"   (repo: "note:42", and the check lives in onAuthenticate — see below)
    const noteId = parseInt(documentName.replace('note-', ''), 10);
    const access = await resolveNoteAccess(noteId, context.userId);
    if (!access.canRead) throw new Error('forbidden');
    // Return existing Y.Doc or create new one
  },
  async beforeHandleMessage({ documentName, context }) {
    // Check permission LIVE truoc moi update (co cache 5s TTL)
    const canEdit = await canEditSharedNote(noteId, context.userId);
    if (!canEdit) throw new Error('read-only');
  },
});
</code></pre>

<h3>Cache permission — trade off staleness vs latency</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">no cache</span><span class="lz-lnote">DB query per update. 100 edit/s = 100 query/s. Prisma pool cạn nhanh</span></div>
<div class="lz-layer"><span class="lz-lname">TTL 5s (kho này)</span><span class="lz-lnote">DB query 1 lần/5s per user per doc. Nếu owner revoke access ở t=1s, user vẫn edit đến t=5s. Chấp nhận</span></div>
<div class="lz-layer"><span class="lz-lname">TTL 60s</span><span class="lz-lnote">Query rất rẻ. Nhưng revoke lag 60s có thể quá lâu cho sensitive doc</span></div>
</div>

<h3>Read vs write permission</h3>
<pre><code class="language-ts">// Chi cho user co canRead join. Ho van thay update tu peers khac
// nhung KHONG the emit update. Hocuspocus tu drop update tu socket khong co canEdit.
// [do: connection.readOnly ⇒ server tra SyncStatus ✗, KHONG ap — nhung chu van nam tren man hinh nguoi xem]

async function resolveNoteAccess(noteId: number, userId: number) {
  const note = await prisma.note.findUnique({ where: { id: noteId } });
  if (note.ownerId === userId) return { canRead: true, canEdit: true };
  
  const share = await prisma.noteShare.findFirst({
    where: { noteId, sharedWithUserId: userId },
  });
  if (!share) return { canRead: false, canEdit: false };
  
  return {
    canRead: true,
    canEdit: share.permission === 'EDIT',
  };
}
</code></pre>

<h3>Revoke permission — kick client</h3>
<pre><code class="language-ts">// Khi owner revoke share, cleanup:
// 1. Xoa noteShare row (Prisma)
// 2. Invalidate cache permission cho user (Redis DEL)   [kho: KHONG co cache quyen trong Redis]
// 3. Kick client dang connect (best-effort)
await collaborationServer.closeConnections({ documentName: &#96;note-\${noteId}&#96; });
// [kho: closeConnections(&#96;note:\${noteId}&#96;) — dong MOI ket noi cua tai lieu tren process nay, ca chu]
// Client cua ex-shared user se thay 'disconnected', reconnect fail vi khong con permission
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — cache permission mà quên invalidate.</strong> Owner revoke ở t=0. Cache TTL 5s. Ex-user edit từ t=0 đến t=5 (do cache). Nếu bug invalidate, edit đến vô hạn. Fix: revoke = explicit <code>redis.del</code> + <code>closeConnections</code>.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Hocuspocus auth two-stage — <code>onAuthenticate</code> verify token ở connect, <code>onLoadDocument</code> + <code>beforeHandleMessage</code> check permission per document với TTL cache 5s — read/write phân biệt (canRead cho join, canEdit filter update), revoke access = invalidate cache + closeConnections chủ động.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Cài <code>onAuthenticate</code> để verify token ở connect, và <code>onLoadDocument</code> + <code>beforeHandleMessage</code> để check permission per document với TTL cache 5s.</li>
<li>Cho một user canRead nhưng không canEdit và xác nhận họ join được nhưng update bị lọc ra.</li>
<li>Revoke access của một user và xác nhận nó có hiệu lực bằng invalidate cache VÀ gọi <code>closeConnections</code> — không chỉ một.</li>
</ol>
<p><strong>Đạt khi:</strong> read và write phân biệt, và một revoke thật sự rớt kết nối đang sống.</p></div>

<h3>🔬 Đo thật: chính gateway của kho, thu hồi thật</h3>
<p>Lab chạy <code>notes-collaboration.gateway.ts</code> và <code>notesRealtime.service.ts</code> chép nguyên từ kho (md5 trùng), Prisma, chia sẻ và logger giả trong RAM, provider Hocuspocus 2.15.3 thật:</p>
<div class="out">$ cp ~/api-backend/src/socket/notes-collaboration.gateway.ts kho/socket/ &amp;&amp; cp ~/api-backend/src/services/notesRealtime*.ts kho/services/   # mã KHO, nguyên văn
kho vs lab: bd58ad25fe4881c53926150634b0a6ec	bd58ad25fe4881c53926150634b0a6ec
kho vs lab: 998c6a71752a38a8b1bbce73ea77cb6e	998c6a71752a38a8b1bbce73ea77cb6e
$ ls kho/config kho/services kho/middleware kho/utils    # GIẢ: Prisma trong RAM, quyền chia sẻ trong RAM, logger, AppError
kho/config:
database.ts
env.ts
kho/middleware:
errorHandler.ts
kho/services:
notesHierarchy.service.ts
notesRealtime.service.ts
notesRealtimeSchema.ts
notesShare.service.ts
kho/utils:
logger.ts</div>
<p>Token gắn với một ghi chú và sống 300 s:</p>
<div class="out">$ npx tsx may85.ts &amp;   node do85.mjs token     # token của kho: gắn với MỘT tài liệu, sống 5 phút
An xin token note 1: HTTP 200 · documentName note:1 · quyền owner · payload {"kind":"note-collaboration","userId":7,"noteId":1,"roleVersion":1} · sống 300 s
── An mở note:1 bằng token note 1
 0.03 s An ↓ Auth authenticated "read-write"
── An mở note:2 bằng CHÍNH token đó
 0.04 s An ↓ SyncStatus ✓ đã áp
 0.05 s An ↓ Auth permission-denied "permission-denied"
Bình (chưa được chia sẻ) xin token note 1: HTTP 403 · You do not have access to this note
$ # log server
[may] :19908 · gateway của kho trên /notes-collaboration
[onAuthenticate] Mã phiên không khớp tài liệu</div>
<p>Người chỉ-xem gõ chữ:</p>
<div class="out">$ node do85.mjs xem      # Bình được chia sẻ quyền viewer
 0.03 s An xin token mới: HTTP 200 · quyền owner
 0.03 s An ↓ Auth authenticated "read-write"
 0.04 s An ↓ SyncStatus ✓ đã áp
 0.05 s Bình xin token mới: HTTP 200 · quyền viewer
 0.05 s Bình ↓ Auth authenticated "readonly"
 0.05 s Bình ↓ SyncStatus ✓ đã áp
 0.35 s Bình ↓ SyncStatus ✗ TỪ CHỐI
 0.85 s Bình (viewer) gõ "B" ⇒ máy Bình: "B" · máy An: ""
 0.85 s An ↓ SyncStatus ✓ đã áp
 1.36 s An (owner) gõ "A" ⇒ máy Bình: "BA" · máy An: "A"</div>
<div class="callout warn"><p><strong>Đọc:</strong> server từ chối update của người xem (SyncStatus ✗), không ai khác thấy — nhưng chữ vẫn nằm trên màn hình người xem (“BA” so với “A”). Vì vậy frontend của kho không bao giờ mở trình soạn cộng tác khi không có <code>canEdit</code> (<code>NoteRealtimeEditor.tsx:104</code>).</p></div>
<p>Hạ quyền một người đang sửa <strong>không</strong> invalidate, rồi theo đường invalidate của kho, rồi gỡ hẳn chia sẻ:</p>
<div class="out">$ node do85.mjs ha       # Bình (editor) gõ 4 lần/giây · hạ xuống viewer, KHÔNG invalidate
 0.04 s An xin token mới: HTTP 200 · quyền owner
 0.05 s An ↓ Auth authenticated "read-write"
 0.10 s Bình xin token mới: HTTP 200 · quyền editor
 0.10 s Bình ↓ Auth authenticated "read-write"
 1.40 s chủ ghi chú hạ Bình xuống viewer (KHÔNG invalidate)
 5.18 s Bình ✕ WebSocket đóng 4403 Forbidden
 5.19 s Bình xin token mới: HTTP 200 · quyền viewer
 5.19 s Bình ↓ Auth authenticated "readonly"
 5.19 s Bình ↓ SyncStatus ✗ TỪ CHỐI
 5.43 s Bình ↓ SyncStatus ✗ TỪ CHỐI
 5.68 s Bình ↓ SyncStatus ✗ TỪ CHỐI
 5.93 s Bình ↓ SyncStatus ✗ TỪ CHỐI
 9.40 s sau khi đổi quyền: Bình gõ thêm 32 lần; An vẫn NHẬN 15 ký tự, ký tự cuối tới lúc +3.53 s
$ # log server
[may] :19908 · gateway của kho trên /notes-collaboration
[may] 3.66 s quyền user 9 note 1 ⇒ editor (KHÔNG invalidate)
[may] 5.05 s quyền user 9 note 1 ⇒ viewer (KHÔNG invalidate)
[beforeHandleMessage] Quyền truy cập tài liệu vừa được thay đổi</div>
<div class="out">$ node do85.mjs thu      # hạ xuống viewer + invalidateNoteCollaborationDocument (đường kho gọi khi đổi share)
 0.03 s An xin token mới: HTTP 200 · quyền owner
 0.03 s An ↓ Auth authenticated "read-write"
 0.05 s Bình xin token mới: HTTP 200 · quyền editor
 0.05 s Bình ↓ Auth authenticated "read-write"
 1.35 s chủ ghi chú hạ Bình xuống viewer + invalidate (đường kho gọi khi đổi share)
 1.36 s An ✕ WebSocket đóng 4205 Reset Connection
 1.36 s Bình ✕ WebSocket đóng 4205 Reset Connection
 1.36 s An xin token mới: HTTP 200 · quyền owner
 1.36 s Bình xin token mới: HTTP 200 · quyền viewer
 1.36 s An ↓ Auth authenticated "read-write"
 1.36 s Bình ↓ Auth authenticated "readonly"
 1.37 s Bình ↓ SyncStatus ✗ TỪ CHỐI
 1.61 s Bình ↓ SyncStatus ✗ TỪ CHỐI
 1.86 s Bình ↓ SyncStatus ✗ TỪ CHỐI
 9.36 s sau khi đổi quyền: Bình gõ thêm 32 lần; An vẫn NHẬN 0 ký tự, ký tự cuối tới lúc +0.00 s
$ node do85.mjs xoa      # GỠ hẳn chia sẻ + invalidate
 0.03 s An xin token mới: HTTP 200 · quyền owner
 0.03 s An ↓ Auth authenticated "read-write"
 0.05 s Bình xin token mới: HTTP 200 · quyền editor
 0.05 s Bình ↓ Auth authenticated "read-write"
 1.35 s chủ ghi chú GỠ chia sẻ + invalidate (đường kho gọi khi đổi share)
 1.36 s An ✕ WebSocket đóng 4205 Reset Connection
 1.36 s Bình ✕ WebSocket đóng 4205 Reset Connection
 1.36 s An xin token mới: HTTP 200 · quyền owner
 1.36 s Bình xin token mới: HTTP 403 · You do not have access to this note
 1.36 s An ↓ Auth authenticated "read-write"
 1.36 s Bình ↓ Auth permission-denied "permission-denied"
 9.36 s sau khi đổi quyền: Bình gõ thêm 32 lần; An vẫn NHẬN 0 ký tự, ký tự cuối tới lúc +0.00 s</div>
<div class="callout ok"><p><strong>Đọc:</strong> không invalidate thì người kia vẫn gõ được 3.53 s, tới khi lần kiểm lại 5 s đóng socket (4403). Có invalidate, <code>closeConnections(&#39;note:1&#39;)</code> đóng tài liệu cho <strong>mọi người</strong> — cả chủ (4205) — và cả hai nối lại bằng token mới. Kho không có cache quyền trong Redis; process khác nhờ lần kiểm lại 5 s.</p></div>
<div class="out">$ cd ~/api-backend &amp;&amp; grep -n "TOKEN_TTL_SECONDS =\\|decoded.noteId !== noteId\\|resolveNoteAccess(user.id" src/services/notesRealtime.service.ts
13:const TOKEN_TTL_SECONDS = 5 * 60;
107:  if (!match || decoded.kind !== 'note-collaboration' || decoded.noteId !== noteId) {
136:  const access = await resolveNoteAccess(user.id, noteId);
$ grep -n "LIVE_PERMISSION_TTL_MS =\\|connection.readOnly =\\|vừa được thay đổi\\|closeConnections(" src/socket/notes-collaboration.gateway.ts
24:const LIVE_PERMISSION_TTL_MS = 5_000;
35:  collaborationServer?.closeConnections(&#96;note:\${noteId}&#96;);
49:  collaborationServer?.closeConnections(&#96;note:\${noteId}&#96;);
204:      connection.readOnly = !canEditSharedNote(context.permission);
221:        throw new Error('Quyền truy cập tài liệu vừa được thay đổi');
224:      connection.readOnly = !canEditSharedNote(access.permission);
$ grep -n "invalidateRealtimeSubject(" src/services/notesShare.service.ts
89:async function invalidateRealtimeSubject(subjectId: number) {
200:  await invalidateRealtimeSubject(share.subjectId);
362:  await invalidateRealtimeSubject(updated.subject.id);
$ grep -n "if (!session.canEdit)\\|if (!next.canEdit)" frontend/src/components/notes/NoteRealtimeEditor.tsx
104:        if (!session.canEdit) throw new Error('Bạn không còn quyền chỉnh sửa ghi chú này');
130:          if (!next.canEdit) {</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash"><span class="tok-comment"># lab c8: chạy notes-collaboration.gateway.ts + notesRealtime.service.ts CHÉP NGUYÊN TỪ KHO (kho/socket, kho/services), Prisma/quyền/logger GIẢ trong RAM</span>
npm i @hocuspocus/server@2.15.3 @hocuspocus/provider@2.15.3 @hocuspocus/extension-redis@2.15.3 @hocuspocus/transformer@2.15.3 yjs jsonwebtoken @tiptap/starter-kit@2.27.2 …
npx tsx may85.ts &amp;        <span class="tok-comment">  # :19908 · /token?user=&amp;note= · /quyen?user=&amp;note=&amp;vai=viewer|editor|xoa&amp;invalidate=0|1 · Redis :19661 (extension của kho)</span>
node do85.mjs token       <span class="tok-comment">  # token gắn một tài liệu; dùng cho tài liệu khác</span>
node do85.mjs xem         <span class="tok-comment">  # người chỉ-xem gõ chữ</span>
node do85.mjs ha          <span class="tok-comment">  # hạ quyền KHÔNG invalidate — đo cửa sổ</span>
node do85.mjs thu | xoa   <span class="tok-comment">  # hạ quyền / gỡ chia sẻ + invalidate</span></code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-4-7-lab-kiem-jwt" target="_blank" rel="noopener"><span class="lc-ico">🔑</span><span class="lc-body"><span class="lc-title">Authentication · Lab 4 — Bộ xác minh JWT</span><span class="lc-sub">Tự xác minh token, từng claim</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-8-2-jwt-access-refresh" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 8.2 — JWT, refresh token và xoay vòng</span><span class="lc-sub">Token ngắn hạn, xin lại khi nối lại</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/socket-io/learn?lessonSlug=io-1-4-auth" target="_blank" rel="noopener"><span class="lc-ico">⚡</span><span class="lc-body"><span class="lc-title">Socket.IO · 1.4 — Xác thực: middleware chạy TRƯỚC connection</span><span class="lc-sub">So với onAuthenticate của Hocuspocus</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>onAuthenticate</code></span><span class="v">Verify token một lần, lúc connect.</span></div>
  <div class="kv"><span class="k"><code>onLoadDocument</code></span><span class="v">Check permission khi một document được mở.</span></div>
  <div class="kv"><span class="k"><code>beforeHandleMessage</code></span><span class="v">Check lại permission mỗi update, có TTL cache 5s.</span></div>
  <div class="kv"><span class="k">canRead vs canEdit</span><span class="v">Read cho join; edit cho update đi qua.</span></div>
  <div class="kv"><span class="k">TTL cache</span><span class="v">Một cache permission 5s để mỗi message không phải một DB hit.</span></div>
  <div class="kv"><span class="k">closeConnections</span><span class="v">Chủ động rớt một user bị revoke — chỉ invalidate cache là chưa đủ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Auth Hocuspocus hai giai đoạn: <code>onAuthenticate</code> lúc connect, rồi check per document.</li><li><code>onLoadDocument</code> + <code>beforeHandleMessage</code> check permission với TTL cache 5s.</li><li>Read và write phân biệt — canRead cho join, canEdit để lọc update.</li><li>Revoke access nghĩa là invalidate cache VÀ chủ động gọi <code>closeConnections</code>.</li><li>Chỉ invalidate cache để lại một kết nối sống với quyền cũ.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Hocuspocus — Authentication hooks</span><span class="lc-sub">hocuspocus.dev/docs/hooks/on-authenticate — hooks cho auth + authorize.</span></span></div>
</div>
`,
    },

    {
      title: '8.6 — Chapter 8 quiz|||8.6 — Kiểm tra Chương 8',
      slug: 'io-8-6-quiz',
      type: 'QUIZ',
      description: 'Sáu câu, mười phút. Về CRDT vs event, Yjs binary protocol, persistence, auth per doc.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Quiz</span>
<h2>What Chapter 8 established</h2>
<p class="lead">Six questions on collaborative editing — and on recognising a problem Socket.IO is the wrong tool for.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Two WebSocket servers in one repo is correct</span><span class="lz-d">Socket.IO for chat and presence, Hocuspocus for documents. They solve different problems, and forcing document sync through an event bus means reimplementing conflict resolution badly.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">CRDTs merge without a server referee</span><span class="lz-d">Events need a total order, which needs a coordinator. A CRDT converges from any order of arrival, which is why offline edits merge cleanly instead of needing an operational-transform server.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Yjs speaks a binary sync protocol</span><span class="lz-d">It is not JSON events. Persistence is a separate decision — when to snapshot the Y.Doc — and per-document authorization has to happen at the connection, not per message.</span></div>
</div>
<p>6 questions, 10 minutes. Answer from the mechanism, not from memory — every option is plausible if you are guessing.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Kiểm tra</span>
<h2>Chương 8 đã dựng được gì</h2>
<p class="lead">Sáu câu về soạn thảo cộng tác — và về việc nhận ra một bài toán mà Socket.IO là công cụ sai.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Hai server WebSocket trong một kho là đúng</span><span class="lz-d">Socket.IO cho chat và presence, Hocuspocus cho tài liệu. Chúng giải quyết hai bài toán khác nhau, và ép việc đồng bộ tài liệu đi qua một event bus nghĩa là cài lại phần giải quyết xung đột một cách tệ hại.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">CRDT hợp nhất mà không cần trọng tài phía server</span><span class="lz-d">Sự kiện cần một thứ tự toàn phần, thứ đòi phải có một bộ điều phối. Một CRDT hội tụ từ bất kỳ thứ tự tới nào, đó là lý do các sửa đổi ngoại tuyến hợp nhất sạch sẽ thay vì cần một server operational-transform.</span></div>
<div class="lz-step"><span class="lz-k">•</span><span class="lz-t">Yjs nói một giao thức đồng bộ nhị phân</span><span class="lz-d">Nó không phải sự kiện JSON. Việc lưu trữ là một quyết định riêng — khi nào chụp ảnh Y.Doc — và việc phân quyền theo từng tài liệu phải xảy ra ở lúc kết nối, không phải theo từng thông điệp.</span></div>
</div>
<p>6 câu, 10 phút. Hãy trả lời từ cơ chế, đừng trả lời từ trí nhớ — mọi phương án đều hợp lý nếu bạn đang đoán.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 600,
        questions: [
          {
            question: 'Two users insert a character at the same position simultaneously via socket.io events. What happens?|||Hai user insert ký tự cùng position đồng thời qua socket.io events. Chuyện gì?',
            options: [
              'Order-dependent merge — server sees different order than clients. Documents diverge. Fixing this requires locks or CRDT. Yjs/Hocuspocus is the CRDT solution|||Merge phụ thuộc thứ tự — server thấy thứ tự khác client. Documents phân kỳ. Fix cần lock hoặc CRDT. Yjs/Hocuspocus là giải pháp CRDT',
              'Both characters merge automatically|||Cả hai ký tự tự merge',
              'Socket.io auto-detects and rejects the conflict|||Socket.io tự phát hiện và reject conflict',
              'The second user\'s edit is ignored|||Edit của user thứ hai bị bỏ qua',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'This repo runs several WebSocket servers (socket.io, two Hocuspocus, raw ws) on one HTTP server. Why?|||Kho này chạy nhiều WebSocket server (socket.io, hai Hocuspocus, ws thô) trên một HTTP server. Vì sao?',
            options: [
              'socket.io for messaging (events + rooms), Hocuspocus for notes (Yjs CRDT binary), raw WebSocket for Maker Lab devices (firmware limitation). Each tool for its right use case, all on ONE HTTP server on different URL paths|||socket.io cho messaging (events + rooms), Hocuspocus cho notes (Yjs CRDT binary), raw WebSocket cho Maker Lab devices (firmware limit). Mỗi tool cho use case đúng, cả ba trên MỘT HTTP server ở path khác nhau',
              'For redundancy|||Cho dự phòng',
              'To split load|||Để chia tải',
              'One is deprecated|||Một cái bị deprecated',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Yjs sync protocol has 4 binary message types. What&#39;s the initial one?|||Yjs sync protocol có 4 binary message type. Cái đầu tiên là gì?',
            options: [
              'SyncStep1 — client sends ~50 byte state vector (its clock per known client), server replies SyncStep2 with missing updates|||SyncStep1 — client gửi ~50 byte state vector (clock của nó per client biết), server reply SyncStep2 với missing updates',
              'FullDocument dump|||FullDocument dump',
              'HandshakeAck|||HandshakeAck',
              'DocumentRequest|||DocumentRequest',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'How often does this repo persist Y.Doc to Postgres?|||Kho này persist Y.Doc vào Postgres bao lâu một lần?',
            options: [
              'Debounce 5s after last update + save on last-user-disconnect. Async queue to avoid blocking sync hot path|||Debounce 5s sau update cuối + save khi last user disconnect. Async queue để không block sync hot path',
              'Every keystroke synchronously|||Mỗi phím gõ đồng bộ',
              'Once per hour|||Mỗi giờ một lần',
              'Only on client disconnect|||Chỉ khi client disconnect',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Y.Doc state = binary Uint8Array. How to save in SQL?|||Y.Doc state = binary Uint8Array. Save vào SQL sao?',
            options: [
              '<code>Buffer.from(Y.encodeStateAsUpdate(doc))</code> → BYTEA/BLOB column. NEVER JSON.stringify — it corrupts the binary structure. Save HTML snapshot separately for search|||<code>Buffer.from(Y.encodeStateAsUpdate(doc))</code> → column BYTEA/BLOB. KHÔNG JSON.stringify — nó hỏng cấu trúc binary. Save HTML snapshot riêng cho search',
              'JSON.stringify(doc) into TEXT column|||JSON.stringify(doc) vào column TEXT',
              'Store as HTML directly|||Store dạng HTML trực tiếp',
              'Use Redis instead of Postgres|||Dùng Redis thay Postgres',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Owner revokes share access. How to prevent ex-user from continuing to edit?|||Owner revoke share access. Ngăn ex-user tiếp tục edit sao?',
            options: [
              'Invalidate permission cache (Redis DEL) + explicit <code>closeConnections</code> for the document — otherwise TTL cache lets them edit up to 5s more|||Invalidate permission cache (Redis DEL) + explicit <code>closeConnections</code> cho document — không thì TTL cache cho họ edit thêm tới 5s',
              'Just delete the noteShare row|||Chỉ xoá noteShare row',
              'Restart the server|||Restart server',
              'Rely on JWT expiry|||Dựa vào JWT expiry',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },

  ],
};
