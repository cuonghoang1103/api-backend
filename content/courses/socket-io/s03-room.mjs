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

// emit den giao cua nhieu tag (INTERSECTION, khong PHU HOP)
io.to('thread:42').to('user:7').emit('personal', data);
</code></pre>

<div class="callout warn">
<p><strong><code>io.to(A).to(B)</code> is an INTERSECTION, not a UNION.</strong> The client MUST be in BOTH A AND B. If you want a union, use <code>io.to([A, B])</code>. This is the number-one bug people hit when learning rooms.</p>
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
<span class="lz-nbody">Device gateway — every ESP32/Arduino gets its own room for dashboards to subscribe to. One device event fans out to the N dashboards watching. Lesson 8.x measures this.</span>
</div>
</div>

<h3>Checking who is in a room</h3>
<pre><code class="language-ts">// server-side, dong bo (adapter default)
const socketIds = await io.in('thread:42').fetchSockets();
console.log('So socket trong thread:42:', socketIds.length);

// hoac lay Set truc tiep (khong async)
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
<p><strong>Bẫy — <code>socket.rooms</code> includes the room NAMED AFTER THE SID.</strong> Every socket automatically joins the room named after its own sid (the thing that makes <code>io.to(sid).emit(...)</code> work). So <code>socket.rooms.size</code> is always 1 + however many rooms you joined by hand. Do not test for <code>if (socket.rooms.size === 0)</code>.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> A room is a string tag for per-event routing, <code>io.to(A).to(B)</code> is an intersection (use <code>[A, B]</code> for a union), this repo uses 4 patterns (user, resource, feature-instance, device) — and every socket sits automatically in the room named after its sid (so <code>socket.rooms.size ≥ 1</code>).</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Rooms</span><span class="lc-sub">socket.io/docs/v4/rooms — API chuẩn, kèm ví dụ intersection vs union.</span></span></div>
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

// emit den giao cua nhieu tag (INTERSECTION, khong PHU HOP)
io.to('thread:42').to('user:7').emit('personal', data);
</code></pre>

<div class="callout warn">
<p><strong><code>io.to(A).to(B)</code> là INTERSECTION, không UNION.</strong> Client PHẢI trong CẢ A VÀ B. Nếu bạn muốn union, dùng <code>io.to([A, B])</code>. Đây là bug số 1 khi mới học room.</p>
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
<span class="lz-nbody">Device gateway — mỗi ESP32/Arduino có room riêng để dashboard subscribe. Fan-out một event từ device tới N dashboard đang xem. Bài 8.x đo cái này.</span>
</div>
</div>

<h3>Kiểm ai đang trong room</h3>
<pre><code class="language-ts">// server-side, dong bo (adapter default)
const socketIds = await io.in('thread:42').fetchSockets();
console.log('So socket trong thread:42:', socketIds.length);

// hoac lay Set truc tiep (khong async)
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
<p><strong>Một câu.</strong> Room là tag chuỗi routing per-event, <code>io.to(A).to(B)</code> là intersection (dùng <code>[A, B]</code> cho union), kho này có 4 pattern (user, resource, feature-instance, device) — và mọi socket tự động ở room mang sid của nó (nên <code>socket.rooms.size ≥ 1</code>).</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Rooms</span><span class="lc-sub">socket.io/docs/v4/rooms — API chuẩn, kèm ví dụ intersection vs union.</span></span></div>
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
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Namespaces: the tool you probably do not need</h2>
<p class="lead">Every socket.io tutorial mentions namespaces. Most apps do not need them. This repo — with 2.430 lines of gateway code across five real features — uses ZERO namespaces. Understanding when you need one saves the wrong architecture.</p>

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

<p>You can — but once <code>/tenant-42</code> has created it, there is NO way to clean the namespace up once every socket has left. It lives in memory forever. With 10,000 tenants that is 10,000 undeletable namespaces. This is the memory leak dynamic namespaces make easy to create.</p>

<div class="pitfall">
<p><strong>Bẫy — dùng namespace như collection name.</strong> Someone reads <code>io.of(&#39;/thread-42&#39;)</code> and it sounds reasonable. NO. That is what a ROOM is for (<code>io.to(&#39;thread:42&#39;)</code>). Namespaces are for architectural isolation; rooms are for per-event routing. Confusing the two chokes the code that comes after.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Namespaces isolate at the connection level (each gets its own middleware, sid and rooms) and this repo does NOT use them, because every feature shares JWT auth and room prefixes already separate the features — create a namespace only when you genuinely need a hard wall (different auth, multi-tenancy, or a team split), and avoid dynamic namespaces because they never get cleaned up.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Namespaces</span><span class="lc-sub">socket.io/docs/v4/namespaces — API chuẩn, đặc biệt phần &quot;dynamic namespaces&quot; nói rõ hạn chế.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Lesson 3.1 — Rooms</span><span class="lc-sub">/courses/socket-io/learn${REF} — cái mà 90% người dùng namespace thật ra CẦN.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Namespace: công cụ bạn có lẽ KHÔNG cần</h2>
<p class="lead">Mọi tutorial socket.io nhắc namespace. Đa số app KHÔNG cần. Kho này — với 2.430 dòng gateway trải 5 feature thật — dùng KHÔNG namespace nào. Hiểu khi nào bạn cần một cái tránh được kiến trúc sai.</p>

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

<p>Có thể — nhưng khi <code>/tenant-42</code> tạo, KHÔNG có cách nào cleanup namespace khi tất cả socket rời. Namespace tồn tại vĩnh viễn trong memory. Với 10.000 tenant, đó là 10.000 namespace không xoá được. Đây là memory leak dễ tạo bằng dynamic namespace.</p>

<div class="pitfall">
<p><strong>Bẫy — dùng namespace như collection name.</strong> Ai đó thấy <code>io.of(&#39;/thread-42&#39;)</code> nghe hợp lý. KHÔNG. Đó là chỗ dùng ROOM (<code>io.to(&#39;thread:42&#39;)</code>). Namespace là cho tách biệt kiến trúc; room là cho routing per-event. Nhầm hai cái = mã sau nghẽn.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Namespace tách biệt cấp connection (mỗi cái có middleware + sid + rooms tách biệt) và kho này KHÔNG dùng vì tất cả features share JWT auth + room prefix đã đủ tách feature — chỉ tạo namespace khi bạn thật sự cần bức tường cứng (auth khác, multi-tenant, hay chia theo team), và tránh dynamic namespace vì không có cleanup.</p>
</div>

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
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>Room lifecycle: create, join, leave, cleanup</h2>
<p class="lead">You never write &quot;<code>io.createRoom(name)</code>&quot;. The room comes into being the moment a socket joins it, and vanishes when the last socket leaves. That&#39;s elegant for chat threads (data lives in DB) but surprising for ephemeral rooms (listen-together) where the room IS the data.</p>

<h3>Lifecycle diagram</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">socket.join(&#39;X&#39;)</span><span class="lz-d">Room &#39;X&#39; appears in <code>io.sockets.adapter.rooms</code>. No prior declaration is needed; the adapter creates a Set to hold this sid on its own.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">several sockets join &#39;X&#39;</span><span class="lz-d">Set trong adapter grow. <code>io.to(&#39;X&#39;).emit(...)</code> reaches all of them. Emit order is FIFO — but NOT strictly guaranteed across sockets (the adapter picks sockets by Set iteration order).</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">socket.leave(&#39;X&#39;) or a disconnect</span><span class="lz-d">The sid is removed from the Set. If the Set becomes empty, the adapter drops the room from the Map. <em>No event fires for &quot;room deleted&quot;</em> — you have to hook <code>socket.on(&#39;disconnect&#39;)</code> and check the size yourself.</span></div>
</div>

<h3>Ephemeral rooms: a real listen-together bug</h3>
<pre><code class="language-ts">// listen-together.ts
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
<p><strong>Bẫy — leave() rồi expect emit trước đó không đến.</strong> <code>leave()</code> synchronous, but packets <code>emit</code> already queued in the I/O buffer are still sent. If you <code>emit('X', data); socket.leave('Y')</code> on a socket that is also in Y, the packet still reaches that socket. Not a bug — a race between the I/O flush and your synchronous code.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> A room is created on the first join and destroyed on the last leave — no &quot;room deleted&quot; event ever fires, so your own state (<code>hostBySid</code>, <code>hostState</code>) must be cleaned up manually in the <code>disconnect</code> or <code>leave</code>handler, otherwise it leaks a little more with every abandoned ephemeral room.</p>
</div>

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
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">socket.leave(&#39;X&#39;) hoặc disconnect</span><span class="lz-d">Sid xoá khỏi Set. Nếu Set rỗng, adapter xoá room khỏi Map. <em>Không có event nào fire cho &quot;room deleted&quot;</em> — bạn phải hook <code>socket.on(&#39;disconnect&#39;)</code> và check size.</span></div>
</div>

<h3>Ephemeral room: bug thật của listen-together</h3>
<pre><code class="language-ts">// listen-together.ts
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
<p><strong>Một câu.</strong> Room tự tạo lúc join đầu và tự xoá lúc leave cuối — không có event &quot;room deleted&quot; nào fire, nên state tuỳ biến (<code>hostBySid</code>, <code>hostState</code>) phải được cleanup thủ công ở handler <code>disconnect</code> hoặc <code>leave</code>, không thì leak dần theo mỗi ephemeral room bị bỏ.</p>
</div>

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

// 3. io.to(A).to(B).emit — intersection
io.to('thread:42').to('user:7').emit('personal', d);   // trong CA A VA B

// 4. socket.emit — chi client dang giu socket nay
socket.emit('reply', data);                            // dua nay, con moi tab khac cua cung user KHONG

// 5. socket.to(room).emit — room trừ chính socket này
socket.to('thread:42').emit('typing', ...);            // MOI TRONG thread:42 TRU chinh socket

// 6. socket.broadcast.emit — mọi socket KHÁC (equivalent to socket.to(chatnamespace))
socket.broadcast.emit('user-joined', ...);             // moi ai khac ngoai chinh minh
</code></pre>

<div class="callout warn">
<p><strong>What separates <code>io.to</code> và <code>socket.to</code>: <code>socket.to</code> EXCLUDES yourself.</strong> The classic case: a typing indicator. The server receives <code>thread:typing</code> from user A and re-emits to the room — with <code>io.to(room).emit</code>, A receives it too and sees their own indicator. Use <code>socket.to(room).emit</code> to leave A out.</p>
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
<p><strong>Bẫy — dùng <code>volatile.emit</code> cho chat.</strong> Chat messages are rarely busy enough to fill the buffer — so the bug never shows up in dev. But when a user goes briefly offline (transport close), the server-side buffer fills and the next message is DROPPED. The chat loses it.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> <code>io.emit</code> reaches everyone, <code>io.to(room)</code> reaches a room, <code>io.to(A).to(B)</code> is an intersection, <code>[A, B]</code> is a union, <code>socket.to</code> excludes the socket itself, <code>except(ids)</code> excludes a chosen set, <code>volatile</code> drops on slowness — and picking the wrong one always produces a bug that is very hard to spot in dev and blows up in production.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Emit cheatsheet</span><span class="lc-sub">socket.io/docs/v4/emit-cheatsheet — bảng đầy đủ mọi variant với ví dụ.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 6 — acks and delivery</span><span class="lc-sub">/courses/socket-io/learn${REF} — timeout() + emitWithAck() cho tin nhắn quan trọng.</span></span></div>
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

// 3. io.to(A).to(B).emit — intersection
io.to('thread:42').to('user:7').emit('personal', d);   // trong CA A VA B

// 4. socket.emit — chi client dang giu socket nay
socket.emit('reply', data);                            // dua nay, con moi tab khac cua cung user KHONG

// 5. socket.to(room).emit — room trừ chính socket này
socket.to('thread:42').emit('typing', ...);            // MOI TRONG thread:42 TRU chinh socket

// 6. socket.broadcast.emit — mọi socket KHÁC (equivalent to socket.to(chatnamespace))
socket.broadcast.emit('user-joined', ...);             // moi ai khac ngoai chinh minh
</code></pre>

<div class="callout warn">
<p><strong>Cái phân biệt <code>io.to</code> và <code>socket.to</code>: <code>socket.to</code> LOẠI TRỪ chính mình.</strong> Điển hình: typing indicator. Server nhận <code>thread:typing</code> từ user A, emit lại cho room — nếu dùng <code>io.to(room).emit</code>, chính A cũng nhận và thấy indicator của mình. Dùng <code>socket.to(room).emit</code> để loại A.</p>
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
<p><strong>Bẫy — dùng <code>volatile.emit</code> cho chat.</strong> Chat message rất hiếm khi busy đến mức buffer đầy — nên bug không lộ ở dev. Nhưng khi user offline một chút (transport close), buffer server-side đầy, và tin nhắn tiếp theo bị DROP. Chat mất tin.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> <code>io.emit</code> đến tất, <code>io.to(room)</code> đến room, <code>io.to(A).to(B)</code> là intersection, <code>[A, B]</code> là union, <code>socket.to</code> loại trừ chính socket, <code>except(ids)</code> loại có chọn, <code>volatile</code> drop nếu chậm — chọn nhầm cái nào cũng là bug rất khó phát hiện ở dev nhưng bung ở production.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Emit cheatsheet</span><span class="lc-sub">socket.io/docs/v4/emit-cheatsheet — bảng đầy đủ mọi variant với ví dụ.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 6 — acks và delivery</span><span class="lc-sub">/courses/socket-io/learn${REF} — timeout() + emitWithAck() cho tin nhắn quan trọng.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 3.5 ─────────────────────────── */
    {
      title: '3.5 — Event names: convention that scales|||3.5 — Tên event: convention scale được',
      slug: 'io-3-5-event-name',
      type: 'VIDEO',
      description: 'Kho này dùng `<feature>:<verb>` — `thread:join`, `call:offer`, `listen:control`. Prefix theo feature giúp routing rõ ràng và tránh xung đột giữa 5 gateway.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.5</span>
<h2>Event names: convention that scales</h2>
<p class="lead">There is no runtime check on event names. Two developers on different features could both call an event <code>update</code> and clash silently. This repo has 15 distinct emit names and 21 listen names across five gateways — none clash because of a naming convention.</p>

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
<pre><code class="language-text">'connect'         'disconnect'         'connect_error'    'error'
'ping'            'pong'               'reconnect'         'reconnect_attempt'
</code></pre>

<p>Naming your own event anything on this list means your handler overrides socket.io's and breaks reconnect and heartbeat. NEVER do it. A feature prefix (<code>chat:connect</code>) is safe — only bare &quot;connect&quot; is reserved.</p>

<div class="pitfall">
<p><strong>Bẫy — dùng camelCase.</strong> <code>threadJoin</code> works, but breaks the convention. This repo uses kebab with a colon (<code>thread:new-message</code>). If you mix them, grepping &quot;thread:&quot; misses threadJoin. Pick one convention and hold to it.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Convention <code>&lt;feature&gt;:&lt;verb&gt;</code> avoids event-name collisions across this repo's 5 gateways (15 emits + 21 listeners, 0 clashes), makes it easy to grep everything belonging to a feature, and steers clear of the reserved names (<code>connect</code>, <code>disconnect</code>, <code>error</code>, <code>ping</code>) whose override would break the machinery underneath.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO — Reserved events</span><span class="lc-sub">socket.io/docs/v4/emitting-events/#reserved-events — danh sách đầy đủ tên bị cấm.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 6 — acks</span><span class="lc-sub">/courses/socket-io/learn${REF} — tên event thường thêm <code>:done</code> or <code>:error</code> cho response.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.5</span>
<h2>Tên event: convention scale được</h2>
<p class="lead">Không có runtime check nào cho tên event. Hai dev ở feature khác nhau có thể cùng gọi event <code>update</code> và đụng nhau âm thầm. Kho này có 15 emit name và 21 listen name trải 5 gateway — không cái nào đụng vì convention đặt tên.</p>

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
<pre><code class="language-text">'connect'         'disconnect'         'connect_error'    'error'
'ping'            'pong'               'reconnect'         'reconnect_attempt'
</code></pre>

<p>Đặt event của bạn tên trong list này = handler của bạn override handler của socket.io = vỡ cơ chế reconnect + heartbeat. KHÔNG bao giờ. Prefix feature (<code>chat:connect</code>) là an toàn — chỉ &quot;connect&quot; plain là reserved.</p>

<div class="pitfall">
<p><strong>Bẫy — dùng camelCase.</strong> <code>threadJoin</code> hoạt động, nhưng vỡ convention. Kho này dùng kebab với colon (<code>thread:new-message</code>). Nếu bạn mix, grep &quot;thread:&quot; sẽ bỏ lỡ threadJoin. Chọn một convention và giữ chặt.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Convention <code>&lt;feature&gt;:&lt;verb&gt;</code> tránh xung đột tên event giữa 5 gateway của kho này (15 emit + 21 listen, 0 clash), cho grep dễ tìm mọi thứ liên quan feature, và tránh reserved names (<code>connect</code>, <code>disconnect</code>, <code>error</code>, <code>ping</code>) mà override sẽ vỡ cơ chế bên dưới.</p>
</div>

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
              'INTERSECTION — sends to sockets in BOTH A AND B. For UNION (A OR B), use <code>io.to([&quot;A&quot;, &quot;B&quot;])</code>|||INTERSECTION — gửi tới socket trong CẢ A VÀ B. Cho UNION (A HOẶC B), dùng <code>io.to([&quot;A&quot;, &quot;B&quot;])</code>',
              'UNION — sends to sockets in A or B|||UNION — gửi tới socket trong A hoặc B',
              'Only to A — B is ignored|||Chỉ đến A — B bị bỏ qua',
              'Only to B — chained call overrides|||Chỉ đến B — chain call ghi đè',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'This repo (2.430 lines of gateway, 5 features) uses how many namespaces?|||Kho này (2.430 dòng gateway, 5 feature) dùng bao nhiêu namespace?',
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
