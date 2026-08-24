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
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>Two WebSocket servers in one repo: why</h2>
<p class="lead">This repo actually runs THREE WebSocket servers on one HTTP server: socket.io (messaging), Hocuspocus for Yjs (notes), and a raw WebSocket gateway (Maker Lab). Each is a deliberate choice for what socket.io does or does not do well.</p>

<h3>The three</h3>
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
<span class="lz-node"><span class="lz-ntitle">device gateway (raw ws)</span><span class="lz-nsub">path: /devices</span></span>
<span class="lz-nbody">Maker Lab devices (ESP32). Không dùng socket.io vì device firmware không có socket.io-client. Raw WebSocket + JSON.</span>
</div>
</div>

<h3>Cùng một HTTP server, khác path</h3>
<pre><code class="language-ts">// src/index.ts
const server = http.createServer(app);

initSocketServer(server);              // /socket.io/  — socket.io
initNotesCollaborationGateway(server); // /notes-collaboration — Hocuspocus
initDeviceGateway(server);             // /devices — raw ws
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
  if (!req.url?.startsWith(WS_PATH)) return;
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
<p><strong>One sentence.</strong> Kho này chạy ba WebSocket server song song trên một HTTP server (paths: <code>/socket.io/</code>, <code>/notes-collaboration</code>, <code>/devices</code>) vì socket.io tốt cho events + rooms nhưng KHÔNG phù hợp cho CRDT binary sync (Yjs/Hocuspocus) hay device firmware (raw WS + JSON) — mỗi tool cho đúng use case.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Yjs — CRDT framework</span><span class="lc-sub">yjs.dev — docs + examples. Đọc &quot;What are CRDTs?&quot; trước.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Hocuspocus — production Yjs server</span><span class="lc-sub">hocuspocus.dev — server phù hợp với Yjs, có auth + persistence + Redis.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Hai WebSocket server trong một kho: vì sao</h2>
<p class="lead">Kho này thật ra chạy BA WebSocket server trên một HTTP server: socket.io (messaging), Hocuspocus cho Yjs (notes), và raw WebSocket gateway (Maker Lab). Mỗi cái là chọn có chủ đích cho việc socket.io làm hay không làm được.</p>

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
<span class="lz-node"><span class="lz-ntitle">device gateway (raw ws)</span><span class="lz-nsub">path: /devices</span></span>
<span class="lz-nbody">Maker Lab devices (ESP32). Không dùng socket.io vì device firmware không có socket.io-client. Raw WebSocket + JSON.</span>
</div>
</div>

<h3>Cùng một HTTP server, khác path</h3>
<pre><code class="language-ts">// src/index.ts
const server = http.createServer(app);

initSocketServer(server);              // /socket.io/  — socket.io
initNotesCollaborationGateway(server); // /notes-collaboration — Hocuspocus
initDeviceGateway(server);             // /devices — raw ws
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
  if (!req.url?.startsWith(WS_PATH)) return;
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
<p><strong>Một câu.</strong> Kho này chạy ba WebSocket server song song trên một HTTP server (paths: <code>/socket.io/</code>, <code>/notes-collaboration</code>, <code>/devices</code>) vì socket.io tốt cho events + rooms nhưng KHÔNG phù hợp cho CRDT binary sync (Yjs/Hocuspocus) hay device firmware (raw WS + JSON) — mỗi tool cho đúng use case.</p>
</div>

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
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>CRDT vs event: why merges just work</h2>
<p class="lead">The magic of Yjs is that two users can edit the same document at the same position, and there is no conflict. This lesson shows why — CRDTs have a mathematical property that makes merges automatic.</p>

<h3>Event-based (naive) — vỡ ở concurrent edit</h3>
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
</code></pre>

<div class="callout ok">
<p><strong>Đây là tính chất mathematical.</strong> Update <code>u</code> và <code>v</code> commute: <code>apply(apply(D, u), v) === apply(apply(D, v), u)</code>. Vì vậy client và server luôn hội tụ về CÙNG state, dù network delay bao nhiêu.</p>
</div>

<h3>Trade off — CRDT không free</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">a</span><span class="lz-t">memory overhead</span><span class="lz-d">Mỗi character có unique ID (~16 byte). Document 10 KB text có thể là 160 KB CRDT structure. Yjs optimize (encode ID delta) — thường 2-3× raw text</span></div>
<div class="lz-step"><span class="lz-k">b</span><span class="lz-t">tombstones</span><span class="lz-d">Delete không xoá thật — chỉ mark deleted (tombstone). Cần cho merge commute. Document sau nhiều edit tăng size dù text KHÔNG dài hơn</span></div>
<div class="lz-step"><span class="lz-k">c</span><span class="lz-t">history compaction</span><span class="lz-d">Yjs có <code>snapshot</code> để compact history — remove old tombstones. Cần chạy định kỳ</span></div>
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
<p><strong>One sentence.</strong> CRDT có tính chất mathematical &quot;update commute&quot; — mọi apply order cho cùng result, nên concurrent edit không cần lock/conflict resolution; trade off là 2-3× memory + tombstones (delete không thật xoá) + cần snapshot compaction; awareness (cursor/presence) là ephemeral feature riêng, giống pattern bài 4.1.</p>
</div>

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
</code></pre>

<div class="callout ok">
<p><strong>Đây là tính chất mathematical.</strong> Update <code>u</code> và <code>v</code> commute: <code>apply(apply(D, u), v) === apply(apply(D, v), u)</code>. Vì vậy client và server luôn hội tụ về CÙNG state, dù network delay bao nhiêu.</p>
</div>

<h3>Trade off — CRDT không free</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">a</span><span class="lz-t">memory overhead</span><span class="lz-d">Mỗi character có unique ID (~16 byte). Document 10 KB text có thể là 160 KB CRDT structure. Yjs optimize (encode ID delta) — thường 2-3× raw text</span></div>
<div class="lz-step"><span class="lz-k">b</span><span class="lz-t">tombstones</span><span class="lz-d">Delete không xoá thật — chỉ mark deleted (tombstone). Cần cho merge commute. Document sau nhiều edit tăng size dù text KHÔNG dài hơn</span></div>
<div class="lz-step"><span class="lz-k">c</span><span class="lz-t">history compaction</span><span class="lz-d">Yjs có <code>snapshot</code> để compact history — remove old tombstones. Cần chạy định kỳ</span></div>
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
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>Yjs binary sync protocol</h2>
<p class="lead">Yjs syncs via a binary message protocol over WebSocket. Four message types cover everything from initial handshake to real-time updates to cursor awareness.</p>

<h3>Bốn message types</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">SyncStep1</span><span class="lz-nsub">state vector</span></span>
<span class="lz-nbody">Client gửi &quot;state vector&quot; — tôi đã có tới clock X của mỗi client. Server dùng để biết cần gửi gì. ~50 byte.</span>
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
  3. Server -&gt; SyncStep2 (mọi update trong doc, ~10 KB - 1 MB tuy size doc)
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
                              20 byte * (N-1) peer broadcast (server -&gt; each)
  Cursor move:                ~150 byte AwarenessUpdate (throttled ~100ms)
  Idle:                       0 traffic (khac socket.io ping 25s)
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
// - Debounce persist DB (mac dinh Hocuspocus save moi 2s, kho nay 5s)
// - Sanitize HTML output khi save (Tiptap render)
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — dùng Hocuspocus không có auth extension.</strong> Ai đó gọi <code>new HocuspocusProvider({ url, name: 'doc-123' })</code> từ browser random và edit document 123. Cần <code>onAuthenticate</code> reject nếu không có token, kèm resolve permission per document.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Yjs sync protocol dùng 4 binary message types (SyncStep1 state vector ~50 byte, SyncStep2 missing updates ~10 KB-1 MB, Update stream ~10-100 byte per edit, AwarenessUpdate ~150 byte per cursor move) — tổng bandwidth thấp hơn socket.io chat-like protocol vì binary optimized và không có ping keepalive.</p>
</div>

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
<span class="lz-nbody">Client gửi &quot;state vector&quot; — tôi đã có tới clock X của mỗi client. Server dùng để biết cần gửi gì. ~50 byte.</span>
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
                              20 byte * (N-1) peer broadcast (server -&gt; each)
  Cursor move:                ~150 byte AwarenessUpdate (throttled ~100ms)
  Idle:                       0 traffic (khac socket.io ping 25s)
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
// - Debounce persist DB (mac dinh Hocuspocus save moi 2s, kho nay 5s)
// - Sanitize HTML output khi save (Tiptap render)
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — dùng Hocuspocus không có auth extension.</strong> Ai đó gọi <code>new HocuspocusProvider({ url, name: 'doc-123' })</code> từ browser random và edit document 123. Cần <code>onAuthenticate</code> reject nếu không có token, kèm resolve permission per document.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Yjs sync protocol dùng 4 binary message type (SyncStep1 state vector ~50 byte, SyncStep2 missing updates ~10 KB-1 MB, Update stream ~10-100 byte per edit, AwarenessUpdate ~150 byte per cursor move) — tổng bandwidth thấp hơn socket.io chat-like protocol vì binary optimized và không có ping keepalive.</p>
</div>

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
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.4</span>
<h2>Persistence: when to save the Y.Doc</h2>
<p class="lead">Y.Doc lives in RAM. To survive server restart, you must persist it to storage. But every keystroke = new update = potential save = database hammered. This lesson tunes when to save.</p>

<h3>Bốn persistence strategy</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Debounce save (chuẩn)</span><span class="lz-d">Save 5 giây sau update cuối. Nếu edit tiếp tục, timer reset. Cost thấp, staleness ≤5s. Kho này dùng.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Save mỗi N updates</span><span class="lz-d">Save khi tích luỹ 100 updates. Không tốt cho slow edits (một user gõ 30 char rồi đi ngủ → save chậm).</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Interval save</span><span class="lz-d">Save mỗi 30s bất kể có edit không. Đơn giản nhưng lãng phí nếu không edit.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Save on disconnect</span><span class="lz-d">Save khi last user rời document. Đảm bảo state cuối cùng an toàn.</span></div>
</div>

<div class="callout ok">
<p><strong>Kho này dùng 1 + 4.</strong> Debounce 5s cho save thường xuyên + save on disconnect cho state cuối. Đủ tốt cho tần suất edit của notes.</p>
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
<p><strong>Snapshot lag sau Y.Doc live.</strong> User edit đến t=10s, snapshot save ở t=15s. Search index có state của t=15s. User search từ họ vừa gõ ở t=12s → không tìm ra 3s. Chấp nhận được với notes; không cho code search realtime.</p>
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
new Redis({ host: config.redis.host, port: 6379, prefix: 'notes:' });

// Worker A nhan update -&gt; publish qua Redis
// Worker B, C, D subscribe -&gt; apply update vao Y.Doc trong memory
// Tuong tu socket.io Redis adapter (bai 5.1)
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — save đồng bộ trong <code>onChange</code> handler.</strong> Handler chạy sync trên hot path. Postgres write 20ms → sync stalls 20ms → users thấy lag. Fix: <code>scheduleDbPersist</code> vào queue background, trả về ngay.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Persistence Y.Doc = debounce save 5s idle + save on disconnect + snapshot HTML riêng cho search + Redis pub/sub multi-worker + async queue để không block sync hot path — kho này áp cả năm pattern trong notes-collaboration.gateway.ts.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Hocuspocus — Database extension</span><span class="lc-sub">hocuspocus.dev/docs/extensions/database — pattern chuẩn cho persistence.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.4</span>
<h2>Persistence: khi nào save Y.Doc</h2>
<p class="lead">Y.Doc sống trong RAM. Để sống sót server restart, bạn phải persist vào storage. Nhưng mỗi keystroke = update mới = có thể save = database bị đập. Bài này tune khi nào save.</p>

<h3>Bốn persistence strategy</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Debounce save (chuẩn)</span><span class="lz-d">Save 5 giây sau update cuối. Nếu edit tiếp tục, timer reset. Cost thấp, staleness ≤5s. Kho này dùng.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Save mỗi N updates</span><span class="lz-d">Save khi tích luỹ 100 updates. Không tốt cho slow edits (một user gõ 30 char rồi đi ngủ → save chậm).</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Interval save</span><span class="lz-d">Save mỗi 30s bất kể có edit không. Đơn giản nhưng lãng phí nếu không edit.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Save on disconnect</span><span class="lz-d">Save khi last user rời document. Đảm bảo state cuối cùng an toàn.</span></div>
</div>

<div class="callout ok">
<p><strong>Kho này dùng 1 + 4.</strong> Debounce 5s cho save thường xuyên + save on disconnect cho state cuối. Đủ tốt cho tần suất edit của notes.</p>
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
<p><strong>Snapshot lag sau Y.Doc live.</strong> User edit đến t=10s, snapshot save ở t=15s. Search index có state của t=15s. User search từ họ vừa gõ ở t=12s → không tìm ra 3s. Chấp nhận được với notes; không cho code search realtime.</p>
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
new Redis({ host: config.redis.host, port: 6379, prefix: 'notes:' });

// Worker A nhan update -&gt; publish qua Redis
// Worker B, C, D subscribe -&gt; apply update vao Y.Doc trong memory
// Tuong tu socket.io Redis adapter (bai 5.1)
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — save đồng bộ trong <code>onChange</code> handler.</strong> Handler chạy sync trên hot path. Postgres write 20ms → sync stalls 20ms → users thấy lag. Fix: <code>scheduleDbPersist</code> vào queue background, trả về ngay.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Persistence Y.Doc = debounce save 5s idle + save on disconnect + snapshot HTML riêng cho search + Redis pub/sub multi-worker + async queue để không block sync hot path — kho này áp cả năm pattern trong notes-collaboration.gateway.ts.</p>
</div>

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
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.5</span>
<h2>Auth and permissions per document</h2>
<p class="lead">Socket.io auth (Chapter 1.4) is one JWT validated at connect. Hocuspocus needs per-document permission — user may edit note 1 but only read note 2. This lesson shows the pattern this repo uses.</p>

<h3>Two-stage auth</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Authenticate at connect</span><span class="lz-d">Client gửi token trong <code>connectionParams</code>. Hocuspocus <code>onAuthenticate</code> verify + return context (userId).</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Authorize per document</span><span class="lz-d">User có thể connect nhiều document. Mỗi lần open, check permission: owner? shared? read-only? Kho này resolve trong <code>onLoadDocument</code>.</span></div>
</div>

<h3>Kho này code</h3>
<pre><code class="language-ts">// notes-collaboration.gateway.ts
const collaborationServer = new Hocuspocus({
  async onAuthenticate({ token }) {
    return await authenticateNoteRealtimeToken(token);
    // return { userId } hoac throw
  },
  async onLoadDocument({ documentName, context }) {
    // documentName = "note-42"
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
// 2. Invalidate cache permission cho user (Redis DEL)
// 3. Kick client dang connect (best-effort)
await collaborationServer.closeConnections({ documentName: &#96;note-\${noteId}&#96; });
// Client cua ex-shared user se thay 'disconnected', reconnect fail vi khong con permission
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — cache permission mà quên invalidate.</strong> Owner revoke ở t=0. Cache TTL 5s. Ex-user edit từ t=0 đến t=5 (do cache). Nếu bug invalidate, edit đến vô hạn. Fix: revoke = explicit <code>redis.del</code> + <code>closeConnections</code>.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Hocuspocus auth two-stage — <code>onAuthenticate</code> verify token ở connect, <code>onLoadDocument</code> + <code>beforeHandleMessage</code> check permission per document với TTL cache 5s — read/write phân biệt (canRead cho join, canEdit filter update), revoke access = invalidate cache + closeConnections chủ động.</p>
</div>

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
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Authorize per document</span><span class="lz-d">User có thể connect nhiều document. Mỗi lần open, check permission: owner? shared? read-only? Kho này resolve trong <code>onLoadDocument</code>.</span></div>
</div>

<h3>Kho này code</h3>
<pre><code class="language-ts">// notes-collaboration.gateway.ts
const collaborationServer = new Hocuspocus({
  async onAuthenticate({ token }) {
    return await authenticateNoteRealtimeToken(token);
    // return { userId } hoac throw
  },
  async onLoadDocument({ documentName, context }) {
    // documentName = "note-42"
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
// 2. Invalidate cache permission cho user (Redis DEL)
// 3. Kick client dang connect (best-effort)
await collaborationServer.closeConnections({ documentName: &#96;note-\${noteId}&#96; });
// Client cua ex-shared user se thay 'disconnected', reconnect fail vi khong con permission
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — cache permission mà quên invalidate.</strong> Owner revoke ở t=0. Cache TTL 5s. Ex-user edit từ t=0 đến t=5 (do cache). Nếu bug invalidate, edit đến vô hạn. Fix: revoke = explicit <code>redis.del</code> + <code>closeConnections</code>.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Hocuspocus auth two-stage — <code>onAuthenticate</code> verify token ở connect, <code>onLoadDocument</code> + <code>beforeHandleMessage</code> check permission per document với TTL cache 5s — read/write phân biệt (canRead cho join, canEdit filter update), revoke access = invalidate cache + closeConnections chủ động.</p>
</div>

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
<p class="lead">Sáu câu về collaborative editing — vì sao KHÔNG dùng socket.io, và cái gì thay thế cho use case này.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Kiểm tra</span>
<h2>Chương 8 đã dựng được gì</h2>
<p class="lead">Sáu câu về collaborative editing — vì sao KHÔNG dùng socket.io, và cái gì thay thế cho use case này.</p>
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
            question: 'This repo has THREE WebSocket servers. Why?|||Kho này có BA WebSocket server. Vì sao?',
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
