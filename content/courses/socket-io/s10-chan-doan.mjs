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
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>The decision tree</h2>
<p class="lead">Default reaction to a socket.io bug: sprinkle console.log everywhere. That&#39;s slow and unfocused. This chapter gives a four-question tree that isolates 90% of bugs in minutes.</p>

<h3>The tree</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">Q1</span><span class="lz-t">Client connected?</span><span class="lz-d">Check DevTools Network → WS tab. Có kết nối open không? Nếu không, bug ở connect/auth (Chương 1.4) — mọi thứ dưới không apply.</span></div>
<div class="lz-step"><span class="lz-k">Q2</span><span class="lz-t">Event on the wire?</span><span class="lz-d">DevTools WS Messages tab. Có frame <code>42[&quot;event-name&quot;,...]</code> không? Nếu không, bug ở emit side hoặc adapter (Chương 5). Nếu CÓ nhưng client không nhận, bug ở receive side.</span></div>
<div class="lz-step"><span class="lz-k">Q3</span><span class="lz-t">Handler running?</span><span class="lz-d">Set breakpoint or console.log in the handler. Fires? Nếu không, bug ở event name (typo) hoặc handler registration timing (Chương 1.1 race). Nếu CÓ, bug ở logic bên trong.</span></div>
<div class="lz-step"><span class="lz-k">Q4</span><span class="lz-t">Side effect happened?</span><span class="lz-d">Kiểm DB update, presence Set, room membership. Actual state change không? Nếu không, bug ở logic. Nếu CÓ nhưng UI không update, bug ở FE state management.</span></div>
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
<p><strong>Reflex &quot;thêm console.log&quot; kết thúc ở đâu.</strong> Bạn thêm log ở emit, ở receive, ở handler, ở effect — 40 dòng log. Deploy, chờ, đọc log — mất 15 phút. Bug vẫn còn ở tầng bạn không log. Fix: 4 câu trên bắt được 90% bug trong 5 phút.</p>
</div>

<h3>Năm bài sau đi qua từng nhánh</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">10.2 — Q1 walkthrough</span><span class="lz-lnote">DevTools Network WS, auth error, transport upgrade</span></div>
<div class="lz-layer"><span class="lz-lname">10.3 — Q2 walkthrough</span><span class="lz-lnote">Wire packet analysis, Chapter 0.3 tables applied</span></div>
<div class="lz-layer"><span class="lz-lname">10.4 — Q3 walkthrough</span><span class="lz-lnote">Event naming, race conditions, handler cleanup</span></div>
<div class="lz-layer"><span class="lz-lname">10.5 — cluster-specific bugs</span><span class="lz-lnote">Redis adapter, sticky sessions, cross-worker fanout</span></div>
<div class="lz-layer"><span class="lz-lname">10.6 — quiz</span><span class="lz-lnote">6 câu, 10 phút</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — dùng cây tuần tự (Q1 rồi Q2 rồi ...).</strong> Nếu bạn <em>đã thấy</em> event trên wire (Q2 pass), không cần Q1. Cây là để KHÔNG bỏ sót câu hỏi, không phải chạy đủ bốn câu mỗi lần.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Bốn câu (client connected → event on wire → handler running → side effect happened) — mỗi cái có công cụ riêng (DevTools WS tab, breakpoint, DB check) — bắt được 90% realtime bug trong 5 phút thay vì 15+ phút với reflex console.log.</p>
</div>

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
<p><strong>Reflex &quot;thêm console.log&quot; kết thúc ở đâu.</strong> Bạn thêm log ở emit, ở receive, ở handler, ở effect — 40 dòng log. Deploy, chờ, đọc log — mất 15 phút. Bug vẫn còn ở tầng bạn không log. Vá: 4 câu trên bắt 90% bug trong 5 phút.</p>
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
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>Q1: is the client connected?</h2>
<p class="lead">Before anything else, verify client can connect. This lesson runs the checks in order and names what each failure mode looks like.</p>

<h3>Check 1: DevTools Network → WS tab</h3>
<pre><code class="language-text">Mo Chrome DevTools -&gt; Network tab -&gt; loc "WS" -&gt; refresh page

Ket qua:
  Green 101 Switching Protocols -&gt; connect thanh cong (WebSocket upgrade)
  Red 400/403 -&gt; auth fail, xem response header (WWW-Authenticate hoac error body)
  Red 404 -&gt; nginx khong route /socket.io/
  Yellow 200 kèm long content-type text/plain -&gt; polling only (chua upgrade WebSocket)
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
// "polling" luon co (initial)
// "websocket" sau upgrade — neu KHONG CO, WebSocket upgrade fail (proxy)
</code></pre>

<h3>Check 3: connect_error handler</h3>
<pre><code class="language-ts">socket.on('connect_error', (err) =&gt; {
  console.log('connect_error:', err.message, err.type);
});

// Common messages:
// "unauthorized" -&gt; auth middleware reject (Chuong 1.4)
// "timeout" -&gt; server slow hoac unreachable
// "xhr poll error" -&gt; CORS hoac network
// "websocket error" -&gt; upgrade fail
</code></pre>

<h3>Check 4: server log</h3>
<pre><code class="language-bash">$ docker logs cuonghoangdev_backend --tail 100 | grep socket
# Neu KHONG THAY dong "socket connected", client KHONG toi den server
# Neu THAY, kiem tra xem sid, transport, auth ok chua
</code></pre>

<h3>Bảng nguyên nhân</h3>
<div class="out">Failure mode        Common cause                   Fix
101 fail 400        Nginx thieu upgrade headers    proxy_set_header Upgrade $http_upgrade
101 fail 403        Auth middleware reject         Kiem JWT, cookie, extractToken
Timeout             Backend down / firewall        curl /health tu server
Stuck at polling    Proxy strip Upgrade            OK neu chap nhan polling, else fix proxy
Immediate close     Auth middleware throw          Log middleware error server-side
No connect event    Middleware forgot next()       Kiem middleware code
</div>

<div class="callout warn">
<p><strong>Nếu Q1 fail, đừng đi tiếp Q2/Q3/Q4.</strong> Chúng đều giả định connection tồn tại. Đầu tiên fix connect, sau đó mới debug event delivery.</p>
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
<p><strong>One sentence.</strong> Q1 (client connected?) trả lời bằng 4 check theo thứ tự — DevTools WS tab (status 101), transport upgrade log, connect_error handler, server log — và nếu Q1 fail, KHÔNG debug Q2-Q4 vì chúng giả định connection tồn tại.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Bài 1.4 — auth middleware</span><span class="lc-sub">/courses/socket-io/learn — connect_error patterns.</span></span></div>
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
  Red 404 -&gt; nginx khong route /socket.io/
  Yellow 200 kem long content-type text/plain -&gt; polling only (chua upgrade WebSocket)
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
// "polling" luon co (initial)
// "websocket" sau upgrade — neu KHONG CO, WebSocket upgrade fail (proxy)
</code></pre>

<h3>Check 3: connect_error handler</h3>
<pre><code class="language-ts">socket.on('connect_error', (err) =&gt; {
  console.log('connect_error:', err.message, err.type);
});

// Common messages:
// "unauthorized" -&gt; auth middleware reject (Chuong 1.4)
// "timeout" -&gt; server slow hoac unreachable
// "xhr poll error" -&gt; CORS hoac network
// "websocket error" -&gt; upgrade fail
</code></pre>

<h3>Check 4: server log</h3>
<pre><code class="language-bash">$ docker logs cuonghoangdev_backend --tail 100 | grep socket
# Neu KHONG THAY dong "socket connected", client KHONG toi den server
# Neu THAY, kiem tra xem sid, transport, auth ok chua
</code></pre>

<h3>Bảng nguyên nhân</h3>
<div class="out">Failure mode        Common cause                   Fix
101 fail 400        Nginx thieu upgrade headers    proxy_set_header Upgrade $http_upgrade
101 fail 403        Auth middleware reject         Kiem JWT, cookie, extractToken
Timeout             Backend down / firewall        curl /health tu server
Stuck at polling    Proxy strip Upgrade            OK neu chap nhan polling, else fix proxy
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
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.3</span>
<h2>Q2: is the event on the wire?</h2>
<p class="lead">DevTools WS tab has a Messages sub-tab showing every frame. Chapter 0.3 taught how to read packet format. This lesson uses it to answer Q2.</p>

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
<div class="lz-step"><span class="lz-k">c</span><span class="lz-t">Frame CÓ nhưng payload trống/sai</span><span class="lz-d">JSON serialize lost circular ref, hoặc data mutation between emit và fire. Kiểm payload chính xác trong DevTools.</span></div>
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
<p><strong>One sentence.</strong> Q2 (event on wire?) trả lời bằng DevTools Messages tab đọc frame — nếu frame CÓ mà handler không chạy = bug receive side (event name, namespace, socket khác), nếu KHÔNG frame = bug emit side (room rỗng, Redis blip, buffer full), nếu frame có nhưng payload sai = bug serialization.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Bài 0.3 — packet format</span><span class="lc-sub">/courses/socket-io/learn — bảng packet types cho đọc DevTools.</span></span></div>
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
<div class="lz-step"><span class="lz-k">c</span><span class="lz-t">Frame CÓ nhưng payload trống/sai</span><span class="lz-d">JSON serialize lost circular ref, hoặc data mutation between emit và fire. Kiểm payload chính xác trong DevTools.</span></div>
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
<span class="lz-nbody">Emit tới <code>user:${'${uid}'}</code> nhưng <code>uid</code> undefined → room name là <code>user:undefined</code>. Không client nào ở đó. Kiểm typescript type.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">FE state không update</span><span class="lz-nsub">reducer bug</span></span>
<span class="lz-nbody">Handler chạy, gọi <code>setMessages(...)</code>, state update. Nhưng UI không rerender vì reference equality (immutable update sai). React DevTools kiểm state.</span>
</div>
</div>

<div class="callout warn">
<p><strong>Silent Promise rejection là bug số 1 ở Q4.</strong> <code>socket.on('X', async ...)</code>. Trong handler, một Promise rejects. Không catch → Node emit <code>unhandledRejection</code> (log nếu có handler) hoặc crash trong strict mode. Fix: catch + ack error.</p>
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
<p><strong>Bẫy — thêm log ở handler, không log ở effect.</strong> Handler fire, log say &quot;done&quot; — bạn cho là done. Nhưng emit sau đó fail (Q2), state không update (FE). Log MỌI TẦNG effect: DB write, emit, FE state change. Không chỉ handler entry/exit.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Q3 (handler running?) trả lời bằng console.log đầu handler — không fire = event name/socket/timing sai (Q2 hoặc bài 1.1), fire nhưng không hoàn tất = silent Promise rejection; Q4 (side effect?) kiểm DB write + room membership + emit fire lại + FE state — thường bug là async không catch hoặc room name có <code>undefined</code>.</p>
</div>

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
<span class="lz-nbody">Emit tới <code>user:${'${uid}'}</code> nhưng <code>uid</code> undefined → room name là <code>user:undefined</code>. Không client nào ở đó. Kiểm typescript type.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">FE state không update</span><span class="lz-nsub">reducer bug</span></span>
<span class="lz-nbody">Handler chạy, gọi <code>setMessages(...)</code>, state update. Nhưng UI không rerender vì reference equality (immutable update sai). React DevTools kiểm state.</span>
</div>
</div>

<div class="callout warn">
<p><strong>Silent Promise rejection là bug số 1 ở Q4.</strong> <code>socket.on('X', async ...)</code>. Trong handler, một Promise rejects. Không catch → Node emit <code>unhandledRejection</code> (log nếu có handler) hoặc crash trong strict mode. Vá: catch + ack error.</p>
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
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.5</span>
<h2>Cluster-specific bugs</h2>
<p class="lead">Single-instance socket.io: 90% of bugs are in your code. Cluster: half your bugs are in the cluster setup. This lesson catalogs the three most common cluster bugs.</p>

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
# adapter phai la "RedisAdapter" cho MOI worker
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — deploy cluster mà chưa test cluster ở dev.</strong> Dev là single-instance, cluster bugs không visible. Local Docker Compose có thể chạy 2 backend service với nginx load balance để reproduce cluster bugs ở dev.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Ba bug đặc thù cluster: (1) random 1/N users không nhận = Redis adapter chưa attach, (2) poll HTTP 400 &quot;sid unknown&quot; = thiếu sticky sessions, (3) presence flap = state trong-process không share qua worker (fix: Redis SADD/SCARD) — health endpoint per worker + Redis PSUBSCRIBE + local cluster testing là ba tool debug cluster.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Bài 5.1 — Redis adapter</span><span class="lc-sub">/courses/socket-io/learn — cách attach adapter đúng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Bài 2.3 — sticky sessions</span><span class="lc-sub">/courses/socket-io/learn — cấu hình nginx cho polling.</span></span></div>
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
# adapter phai la "RedisAdapter" cho MOI worker
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — deploy cluster mà chưa test cluster ở dev.</strong> Dev là single-instance, cluster bugs không visible. Local Docker Compose có thể chạy 2 backend service với nginx load balance để reproduce cluster bugs ở dev.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Ba bug đặc thù cluster: (1) random 1/N users không nhận = Redis adapter chưa attach, (2) poll HTTP 400 &quot;sid unknown&quot; = thiếu sticky sessions, (3) presence flap = state trong-process không share qua worker (vá: Redis SADD/SCARD) — health endpoint per worker + Redis PSUBSCRIBE + local cluster testing là ba tool debug cluster.</p>
</div>

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
<p class="lead">Sáu câu về diagnosis — thay reflex console.log bằng decision tree.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Kiểm tra</span>
<h2>Chương 10 đã dựng được gì</h2>
<p class="lead">Sáu câu về diagnosis — thay reflex console.log bằng decision tree.</p>
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
              'No sticky sessions — client\'s first POST hits worker A (gets sid), follow-up GET hits worker B (doesn\'t know sid). Fix: nginx <code>hash $cookie_io</code>|||Không có sticky sessions — POST đầu client hit worker A (nhận sid), GET tiếp theo hit worker B (không biết sid). Fix: nginx <code>hash $cookie_io</code>',
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
