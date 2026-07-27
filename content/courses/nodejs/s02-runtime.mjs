/**
 * Node.js — Chương 2: Bên trong runtime (V8, libuv, event loop).
 * MỌI con số trong bài đều đo THẬT trên Node v22.21.0 (máy 10 nhân).
 */
const REF = '?ref=%2Fcourses%2Fnodejs%2Flearn&reflabel=Node.js';

export default {
  title: 'Chapter 2 — Inside the Node.js runtime|||Chương 2 — Bên trong Node.js runtime',
  description: 'V8, libuv và event loop: vì sao Node nhanh, khi nào nó đứng hình, và cách đo bằng số thật.',
  lessons: [
    /* ─────────────────────────── 2.1 ─────────────────────────── */
    {
      title: '2.1 — What Node.js actually is|||2.1 — Node.js thật ra là cái gì',
      slug: 'nodejs-2-1-runtime-la-gi',
      type: 'VIDEO',
      description: 'V8 + libuv + lớp nối C++: bên trong Node có gì, và "đơn luồng" thật sự nghĩa là gì.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>What Node.js actually is</h2>
<p class="lead">Node.js is not a language and not a framework. It is a <strong>runtime</strong>: a program that can execute JavaScript outside a browser, plus a set of libraries for things browsers deliberately forbid — reading files, opening sockets, spawning processes.</p>

<h3>Three parts in one box</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Your JavaScript</span><span class="lz-lnote">your code + npm packages</span></div>
  <div class="lz-layer"><span class="lz-lname">Node standard library</span><span class="lz-lnote">fs, http, crypto… written in JS</span></div>
  <div class="lz-layer"><span class="lz-lname">C++ bindings</span><span class="lz-lnote">the bridge from JS down to the OS</span></div>
  <div class="lz-layer"><span class="lz-lname">V8</span><span class="lz-lnote">compiles &amp; runs JavaScript (same engine as Chrome)</span></div>
  <div class="lz-layer"><span class="lz-lname">libuv</span><span class="lz-lnote">event loop + thread pool + async I/O</span></div>
  <div class="lz-layer"><span class="lz-lname">Operating system</span><span class="lz-lnote">files, network, processes</span></div>
</div>
<p>You can see both engines from inside your own program:</p>
<pre><code>node -p <span class="tok-string">"process.versions.v8"</span>
node -p <span class="tok-string">"process.versions.uv"</span></code></pre>
<div class="out">12.4.254.21-node.33
1.51.0</div>
<div class="kv-grid">
  <div class="kv"><span class="k">V8</span><span class="v">Turns your JavaScript into machine code and runs it. Handles memory and garbage collection. Knows nothing about files or networks.</span></div>
  <div class="kv"><span class="k">libuv</span><span class="v">A C library that provides the event loop, asynchronous file/network I/O, and a small thread pool. This is what makes Node "non-blocking".</span></div>
  <div class="kv"><span class="k">Bindings</span><span class="v">Glue code so <code>fs.readFile</code> in JavaScript ends up calling the operating system, then hands the result back to V8.</span></div>
</div>

<h3>"Single-threaded" — precisely what that means</h3>
<p>The sentence "Node is single-threaded" is true and misleading at the same time. Precisely:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">True</span><span class="v">There is ONE thread running your JavaScript. Two lines of your code never execute simultaneously — so you never need locks or mutexes on your own variables.</span></div>
  <div class="kv"><span class="k">Also true</span><span class="v">Node itself uses SEVERAL threads underneath: libuv keeps a thread pool (4 by default) for file I/O, DNS and crypto. You will measure it in lesson 2.4.</span></div>
  <div class="kv"><span class="k">Consequence</span><span class="v">Waiting is free — the one thread starts thousands of I/O operations and gets on with other work. But computing is expensive — while your code calculates, nothing else in the process can run.</span></div>
</div>
<div class="callout ok">This is the whole trade-off of Node in one line: <strong>brilliant at waiting, terrible at thinking</strong>. An API that spends its time waiting on a database, another API or the disk is exactly the right job. Video encoding, image resizing or password hashing in a tight loop is exactly the wrong one — unless you move it off the main thread (lesson 2.5).</div>

<h3>Where the request actually goes</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Request arrives</div><div class="lz-d">libuv sees the socket become readable</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Your handler runs</div><div class="lz-d">on the single JS thread, in V8</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">You await the DB</div><div class="lz-d">handler pauses, thread is FREE for others</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Result comes back</div><div class="lz-d">libuv queues your continuation</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Response sent</div><div class="lz-d">handler resumes and finishes</div></div>
</div>
<p>Step 3 is the magic. In a thread-per-request server (classic PHP or Java), that waiting thread sits idle and consumes memory. In Node the same thread immediately picks up the next request. That is why a single Node process can hold tens of thousands of open connections.</p>
<div class="note-ct">This site runs a single Node process per container. It comfortably serves the API, WebSocket chat and file streaming from that one process — precisely because almost everything it does is <em>waiting</em>: for PostgreSQL, for Redis, for Cloudflare R2. The moments it does real computing (image processing) are the moments that need care.</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Node.js thật ra là cái gì</h2>
<p class="lead">Node.js không phải ngôn ngữ, cũng không phải framework. Nó là một <strong>runtime</strong>: một chương trình có khả năng chạy JavaScript bên ngoài trình duyệt, kèm theo bộ thư viện làm những việc mà trình duyệt cố tình cấm — đọc file, mở socket, sinh tiến trình.</p>

<h3>Ba phần trong một hộp</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">JavaScript của bạn</span><span class="lz-lnote">code của bạn + các gói npm</span></div>
  <div class="lz-layer"><span class="lz-lname">Thư viện chuẩn của Node</span><span class="lz-lnote">fs, http, crypto… viết bằng JS</span></div>
  <div class="lz-layer"><span class="lz-lname">Lớp nối C++</span><span class="lz-lnote">cây cầu từ JS xuống hệ điều hành</span></div>
  <div class="lz-layer"><span class="lz-lname">V8</span><span class="lz-lnote">biên dịch &amp; chạy JavaScript (đúng engine của Chrome)</span></div>
  <div class="lz-layer"><span class="lz-lname">libuv</span><span class="lz-lnote">event loop + thread pool + I/O bất đồng bộ</span></div>
  <div class="lz-layer"><span class="lz-lname">Hệ điều hành</span><span class="lz-lnote">file, mạng, tiến trình</span></div>
</div>
<p>Bạn nhìn thấy được cả hai động cơ này ngay từ trong chương trình của mình:</p>
<pre><code>node -p <span class="tok-string">"process.versions.v8"</span>
node -p <span class="tok-string">"process.versions.uv"</span></code></pre>
<div class="out">12.4.254.21-node.33
1.51.0</div>
<div class="kv-grid">
  <div class="kv"><span class="k">V8</span><span class="v">Biến JavaScript của bạn thành mã máy rồi chạy. Lo việc cấp phát bộ nhớ và thu gom rác. Hoàn toàn không biết gì về file hay mạng.</span></div>
  <div class="kv"><span class="k">libuv</span><span class="v">Thư viện C cung cấp event loop, I/O file/mạng bất đồng bộ và một thread pool nhỏ. Đây mới là thứ làm Node "không chặn".</span></div>
  <div class="kv"><span class="k">Lớp nối</span><span class="v">Đoạn code keo dán để <code>fs.readFile</code> trong JavaScript rốt cuộc gọi xuống hệ điều hành, rồi trả kết quả ngược lên cho V8.</span></div>
</div>

<h3>"Đơn luồng" — chính xác thì nghĩa là gì</h3>
<p>Câu "Node là đơn luồng" vừa đúng vừa dễ gây hiểu lầm. Nói cho chính xác:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Đúng</span><span class="v">Chỉ có MỘT luồng chạy JavaScript của bạn. Hai dòng code của bạn không bao giờ chạy đồng thời — nên bạn chẳng cần khoá hay mutex cho biến của mình.</span></div>
  <div class="kv"><span class="k">Cũng đúng</span><span class="v">Bản thân Node dùng NHIỀU luồng bên dưới: libuv giữ một thread pool (mặc định 4) cho I/O file, DNS và crypto. Bài 2.4 bạn sẽ tự đo được nó.</span></div>
  <div class="kv"><span class="k">Hệ quả</span><span class="v">Chờ đợi thì miễn phí — một luồng khởi động hàng nghìn thao tác I/O rồi đi làm việc khác. Nhưng tính toán thì đắt — trong lúc code bạn tính, không gì khác trong tiến trình chạy được.</span></div>
</div>
<div class="callout ok">Toàn bộ đánh đổi của Node gói trong một câu: <strong>xuất sắc khi chờ, thảm hoạ khi nghĩ</strong>. Một API dành phần lớn thời gian chờ database, chờ API khác hay chờ ổ đĩa chính là việc hợp với nó. Mã hoá video, resize ảnh hay băm mật khẩu trong vòng lặp dày đặc thì hoàn toàn ngược lại — trừ khi bạn đẩy nó ra khỏi luồng chính (bài 2.5).</div>

<h3>Một request thực sự đi đâu</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Request tới</div><div class="lz-d">libuv thấy socket có dữ liệu đọc được</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Handler của bạn chạy</div><div class="lz-d">trên luồng JS duy nhất, bên trong V8</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Bạn await database</div><div class="lz-d">handler tạm dừng, luồng RẢNH cho request khác</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Kết quả quay về</div><div class="lz-d">libuv xếp phần tiếp theo của bạn vào hàng đợi</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Trả phản hồi</div><div class="lz-d">handler chạy tiếp và kết thúc</div></div>
</div>
<p>Bước 3 mới là phép màu. Ở server kiểu một-luồng-một-request (PHP hay Java cổ điển), cái luồng đang chờ đó nằm không và vẫn ngốn bộ nhớ. Trong Node, đúng luồng ấy lập tức nhặt request kế tiếp. Đó là lý do một tiến trình Node duy nhất giữ được hàng chục nghìn kết nối mở.</p>
<div class="note-ct">Website này chạy một tiến trình Node duy nhất trong mỗi container. Nó phục vụ thoải mái cả API, chat WebSocket lẫn truyền file từ một tiến trình đó — chính vì gần như mọi việc nó làm đều là <em>chờ</em>: chờ PostgreSQL, chờ Redis, chờ Cloudflare R2. Những khoảnh khắc nó thực sự tính toán (xử lý ảnh) mới là lúc phải cẩn thận.</div>
</div>
`,
    },

    /* ─────────────────────────── 2.2 ─────────────────────────── */
    {
      title: '2.2 — The event loop, phase by phase|||2.2 — Event loop, đi qua từng pha',
      slug: 'nodejs-2-2-event-loop',
      type: 'VIDEO',
      description: 'Sáu pha của vòng lặp, thứ tự thực thi thật, và vì sao setTimeout(0) vs setImmediate không đoán được.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>The event loop, phase by phase</h2>
<p class="lead">The event loop is a <code>while</code> loop that never stops: "is there any finished work? run its callback; otherwise wait". It runs through six phases in a fixed order, over and over, until there is nothing left to wait for — at which point the process exits.</p>

<h3>The six phases</h3>
<div class="lz-map">
  <div class="lz-stage">One turn of the loop</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">timers</div><div class="lz-nsub">callbacks of setTimeout and setInterval whose time has come</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">pending callbacks</div><div class="lz-nsub">some system-level callbacks deferred from the previous turn</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">idle / prepare</div><div class="lz-nsub">internal to Node — you never see this</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">poll</div><div class="lz-nsub">the heart: collect new I/O events, run their callbacks, and WAIT here when idle</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">check</div><div class="lz-nsub">setImmediate callbacks run here</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">close</div><div class="lz-nsub">cleanup, e.g. socket.on('close')</div></div></div>
</div>
<p>Between <em>every</em> phase Node empties two extra queues first: <code>process.nextTick</code>, then the microtask queue (Promises). Those are not phases — they are jumped to at every opportunity, which is why they always feel "instant".</p>

<h3>Prove the order yourself</h3>
<pre><code><span class="tok-function">console.log</span>(<span class="tok-string">'[1] sync: first line'</span>);
<span class="tok-function">setTimeout</span>(()  =&gt; <span class="tok-function">console.log</span>(<span class="tok-string">'[5] setTimeout 0   — timers phase'</span>), <span class="tok-number">0</span>);
<span class="tok-function">setImmediate</span>(() =&gt; <span class="tok-function">console.log</span>(<span class="tok-string">'[6] setImmediate   — check phase'</span>));
Promise.<span class="tok-function">resolve</span>().<span class="tok-function">then</span>(() =&gt; <span class="tok-function">console.log</span>(<span class="tok-string">'[4] Promise.then   — microtask'</span>));
process.<span class="tok-function">nextTick</span>(() =&gt; <span class="tok-function">console.log</span>(<span class="tok-string">'[3] process.nextTick — its own queue, runs first'</span>));
<span class="tok-function">console.log</span>(<span class="tok-string">'[2] sync: last line'</span>);</code></pre>
<div class="out">[1] sync: first line
[2] sync: last line
[3] process.nextTick — its own queue, runs first
[4] Promise.then   — microtask
[6] setImmediate   — check phase
[5] setTimeout 0   — timers phase</div>
<p>Read it carefully. All synchronous code finishes <strong>first</strong> — always. Then nextTick. Then microtasks. Only then does the loop start turning. And notice the last two came out in the "wrong" order…</p>

<h3>setTimeout(0) vs setImmediate: genuinely unpredictable</h3>
<p>Running the same two lines five times in a row gives different answers:</p>
<pre><code><span class="tok-function">setTimeout</span>(() =&gt; process.stdout.<span class="tok-function">write</span>(<span class="tok-string">'timeout '</span>), <span class="tok-number">0</span>);
<span class="tok-function">setImmediate</span>(() =&gt; process.stdout.<span class="tok-function">write</span>(<span class="tok-string">'immediate '</span>));</code></pre>
<div class="out">immediate timeout timeout immediate immediate timeout immediate timeout timeout immediate</div>
<p>Why? <code>setTimeout(fn, 0)</code> really means "after <em>at least</em> 0 ms". Whether that deadline has already passed when the loop reaches the timers phase depends on how long the process took to start — microseconds of luck. So the order flips randomly.</p>
<p>But inside an I/O callback the answer is <strong>always the same</strong>, because there we are already past the poll phase, and <code>check</code> comes immediately after it:</p>
<pre><code>fs.<span class="tok-function">readFile</span>(__filename, () =&gt; {
  <span class="tok-function">setTimeout</span>(() =&gt; process.stdout.<span class="tok-function">write</span>(<span class="tok-string">'timeout '</span>), <span class="tok-number">0</span>);
  <span class="tok-function">setImmediate</span>(() =&gt; process.stdout.<span class="tok-function">write</span>(<span class="tok-string">'immediate '</span>));
});</code></pre>
<div class="out">immediate timeout immediate timeout immediate timeout immediate timeout immediate timeout</div>
<div class="pitfall">Never write code whose correctness depends on <code>setTimeout(…, 0)</code> beating <code>setImmediate</code>, or on any timer ordering. If two things must happen in order, express that with <code>await</code> — not by hoping the scheduler cooperates. Timing-dependent code passes on your laptop and fails on the server under load.</div>

<h3>Why timers are never exact</h3>
<p><code>setTimeout(fn, 100)</code> promises "not earlier than 100 ms", never "exactly at 100 ms". If the loop is busy when the deadline arrives, your callback waits its turn. In lesson 2.4 you will measure a timer that should have fired every 100 ms arriving <strong>2873 ms</strong> late.</p>
<div class="note-ct">This matters for scheduled jobs. A "run every minute" timer in a busy process drifts. That is why real scheduling on this site uses cron-style jobs that check the clock, rather than counting on <code>setInterval</code> to stay accurate over hours.</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Event loop, đi qua từng pha</h2>
<p class="lead">Event loop là một vòng <code>while</code> không bao giờ dừng: "có việc nào xong chưa? xong thì chạy callback của nó; chưa thì chờ". Nó chạy qua sáu pha theo thứ tự cố định, lặp đi lặp lại, cho tới khi không còn gì để chờ — lúc đó tiến trình thoát.</p>

<h3>Sáu pha</h3>
<div class="lz-map">
  <div class="lz-stage">Một vòng của loop</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">timers</div><div class="lz-nsub">callback của setTimeout và setInterval đã tới hạn</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">pending callbacks</div><div class="lz-nsub">vài callback mức hệ thống bị hoãn từ vòng trước</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">idle / prepare</div><div class="lz-nsub">nội bộ của Node — bạn không bao giờ thấy</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">poll</div><div class="lz-nsub">trái tim: gom sự kiện I/O mới, chạy callback của chúng, và NẰM CHỜ ở đây khi rảnh</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">check</div><div class="lz-nsub">callback của setImmediate chạy ở đây</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">close</div><div class="lz-nsub">dọn dẹp, ví dụ socket.on('close')</div></div></div>
</div>
<p>Giữa <em>mỗi</em> pha, Node xả cạn hai hàng đợi phụ trước: <code>process.nextTick</code>, rồi tới hàng đợi microtask (Promise). Chúng không phải là pha — chúng được nhảy vào ở mọi cơ hội, nên lúc nào cũng có cảm giác "tức thì".</p>

<h3>Tự chứng minh thứ tự</h3>
<pre><code><span class="tok-function">console.log</span>(<span class="tok-string">'[1] đồng bộ: dòng đầu'</span>);
<span class="tok-function">setTimeout</span>(()  =&gt; <span class="tok-function">console.log</span>(<span class="tok-string">'[5] setTimeout 0   — pha timers'</span>), <span class="tok-number">0</span>);
<span class="tok-function">setImmediate</span>(() =&gt; <span class="tok-function">console.log</span>(<span class="tok-string">'[6] setImmediate   — pha check'</span>));
Promise.<span class="tok-function">resolve</span>().<span class="tok-function">then</span>(() =&gt; <span class="tok-function">console.log</span>(<span class="tok-string">'[4] Promise.then   — microtask'</span>));
process.<span class="tok-function">nextTick</span>(() =&gt; <span class="tok-function">console.log</span>(<span class="tok-string">'[3] process.nextTick — hàng đợi riêng, chạy trước'</span>));
<span class="tok-function">console.log</span>(<span class="tok-string">'[2] đồng bộ: dòng cuối'</span>);</code></pre>
<div class="out">[1] đồng bộ: dòng đầu
[2] đồng bộ: dòng cuối
[3] process.nextTick — hàng đợi riêng, chạy trước
[4] Promise.then   — microtask
[6] setImmediate   — pha check
[5] setTimeout 0   — pha timers</div>
<p>Hãy đọc kỹ. Toàn bộ code đồng bộ chạy xong <strong>trước tiên</strong> — luôn luôn. Rồi tới nextTick. Rồi microtask. Chỉ sau đó vòng lặp mới bắt đầu quay. Và để ý hai dòng cuối ra "sai" thứ tự…</p>

<h3>setTimeout(0) vs setImmediate: thật sự không đoán được</h3>
<p>Chạy đúng hai dòng đó năm lần liên tiếp cho ra kết quả khác nhau:</p>
<pre><code><span class="tok-function">setTimeout</span>(() =&gt; process.stdout.<span class="tok-function">write</span>(<span class="tok-string">'timeout '</span>), <span class="tok-number">0</span>);
<span class="tok-function">setImmediate</span>(() =&gt; process.stdout.<span class="tok-function">write</span>(<span class="tok-string">'immediate '</span>));</code></pre>
<div class="out">immediate timeout timeout immediate immediate timeout immediate timeout timeout immediate</div>
<p>Vì sao? <code>setTimeout(fn, 0)</code> thật ra nghĩa là "sau <em>ít nhất</em> 0 mili giây". Việc cái hạn đó đã trôi qua hay chưa vào lúc vòng lặp chạm pha timers phụ thuộc vào tiến trình khởi động mất bao lâu — vài micro giây may rủi. Nên thứ tự đảo lung tung.</p>
<p>Nhưng bên trong một callback I/O thì câu trả lời <strong>luôn luôn như nhau</strong>, vì ở đó ta đã đi qua pha poll rồi, mà <code>check</code> nằm ngay sau nó:</p>
<pre><code>fs.<span class="tok-function">readFile</span>(__filename, () =&gt; {
  <span class="tok-function">setTimeout</span>(() =&gt; process.stdout.<span class="tok-function">write</span>(<span class="tok-string">'timeout '</span>), <span class="tok-number">0</span>);
  <span class="tok-function">setImmediate</span>(() =&gt; process.stdout.<span class="tok-function">write</span>(<span class="tok-string">'immediate '</span>));
});</code></pre>
<div class="out">immediate timeout immediate timeout immediate timeout immediate timeout immediate timeout</div>
<div class="pitfall">Đừng bao giờ viết code mà tính đúng đắn của nó phụ thuộc vào việc <code>setTimeout(…, 0)</code> có thắng <code>setImmediate</code> hay không, hay phụ thuộc vào thứ tự bất kỳ của timer. Nếu hai việc buộc phải xảy ra theo thứ tự, hãy diễn đạt bằng <code>await</code> — chứ đừng hy vọng bộ lập lịch chiều mình. Code phụ thuộc thời điểm sẽ chạy ngon trên laptop và gãy trên server lúc tải cao.</div>

<h3>Vì sao timer không bao giờ chính xác</h3>
<p><code>setTimeout(fn, 100)</code> hứa "không sớm hơn 100 ms", chứ không bao giờ hứa "đúng 100 ms". Nếu vòng lặp đang bận lúc tới hạn, callback của bạn phải xếp hàng chờ. Ở bài 2.4 bạn sẽ tự đo một timer lẽ ra chạy mỗi 100 ms nhưng tới trễ <strong>2873 ms</strong>.</p>
<div class="note-ct">Điều này quan trọng với các job chạy theo lịch. Một timer kiểu "chạy mỗi phút" trong tiến trình bận sẽ trôi dạt dần. Đó là lý do việc hẹn giờ thật trên website này dùng job kiểu cron có kiểm tra đồng hồ, thay vì trông cậy <code>setInterval</code> giữ được độ chính xác suốt nhiều giờ.</div>
</div>
`,
    },

    /* ─────────────────────────── 2.3 ─────────────────────────── */
    {
      title: '2.3 — nextTick, microtasks and starvation|||2.3 — nextTick, microtask và chuyện bỏ đói hàng đợi',
      slug: 'nodejs-2-3-microtask',
      type: 'VIDEO',
      description: 'Hai hàng đợi ưu tiên nằm ngoài sáu pha, thứ tự giữa chúng, và cách chúng làm treo cả tiến trình.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>nextTick, microtasks and starvation</h2>
<p class="lead">Two queues sit outside the six phases and jump the line at every opportunity: <code>process.nextTick</code> and the microtask queue (Promises, <code>queueMicrotask</code>). They are the reason <code>await</code> feels instant — and the reason a careless recursion can freeze a server solid.</p>

<h3>The priority order</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1st</div><div class="lz-t">Synchronous code</div><div class="lz-d">runs to completion, always</div></div>
  <div class="lz-step"><div class="lz-k">2nd</div><div class="lz-t">nextTick queue</div><div class="lz-d">drained COMPLETELY</div></div>
  <div class="lz-step"><div class="lz-k">3rd</div><div class="lz-t">Microtask queue</div><div class="lz-d">Promises — also drained completely</div></div>
  <div class="lz-step"><div class="lz-k">4th</div><div class="lz-t">Next loop phase</div><div class="lz-d">timers / poll / check…</div></div>
</div>
<p>The word that matters is <strong>completely</strong>. Node does not run "a few" nextTicks and move on — it empties the queue, including anything added while it was emptying. Same for microtasks.</p>

<h3>Both queues drain before any timer</h3>
<pre><code><span class="tok-keyword">let</span> n = <span class="tok-number">0</span>;
<span class="tok-function">setTimeout</span>(() =&gt; <span class="tok-function">console.log</span>(<span class="tok-string">'does setTimeout still get to run?'</span>), <span class="tok-number">0</span>);

<span class="tok-keyword">function</span> <span class="tok-function">recurse</span>() { <span class="tok-keyword">if</span> (++n &lt; <span class="tok-number">1e6</span>) process.<span class="tok-function">nextTick</span>(recurse); }
<span class="tok-function">recurse</span>();
<span class="tok-function">console.log</span>(<span class="tok-string">'queued a million nextTicks'</span>);</code></pre>
<div class="out">queued a million nextTicks
does setTimeout still get to run?
nextTick ran: 1000000 times</div>
<p>All one million nextTicks ran <strong>before</strong> the timer callback — the loop never reached the timers phase until the queue was empty. Here it finished in a few milliseconds so the timer still fired. Make the recursion unbounded, though, and the queue never empties: the timer never runs, no I/O is ever polled, and the process is frozen while using 100% CPU.</p>
<div class="pitfall">A <code>process.nextTick</code> that schedules itself with no exit condition is one of the few ways to hang Node completely — no error, no crash, just a dead process that answers nothing. Recursion inside microtasks (a <code>.then()</code> that re-queues itself forever) does the same.</div>

<h3>nextTick vs Promise: which to use</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">process.nextTick</span><span class="v">Node-specific, highest priority. Legitimate uses are rare: mostly library authors deferring a callback so it never fires synchronously.</span></div>
  <div class="kv"><span class="k">queueMicrotask</span><span class="v">The standard equivalent, same priority as Promise callbacks. Prefer this if you genuinely need to defer.</span></div>
  <div class="kv"><span class="k">Promise / await</span><span class="v">What you should use 99% of the time. Same queue as queueMicrotask.</span></div>
  <div class="kv"><span class="k">setImmediate</span><span class="v">Use when you want to yield to the loop — let pending I/O run before continuing. This is the tool for splitting heavy work (lesson 2.5).</span></div>
</div>
<div class="callout warn">If your instinct says "I'll use nextTick to make this run sooner" — stop. Running <em>sooner</em> than the event loop means running <em>before</em> pending I/O, which starves the very requests you are trying to serve. Reach for <code>setImmediate</code> instead: it politely waits its turn.</div>
<div class="note-ct">In practice you will write <code>await</code> thousands of times and <code>process.nextTick</code> approximately never. Knowing it exists matters mainly for reading library source and for understanding why a stack trace shows your callback running "later" than you expected.</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>nextTick, microtask và chuyện bỏ đói hàng đợi</h2>
<p class="lead">Có hai hàng đợi nằm ngoài sáu pha và chen ngang ở mọi cơ hội: <code>process.nextTick</code> và hàng đợi microtask (Promise, <code>queueMicrotask</code>). Chúng là lý do <code>await</code> cho cảm giác tức thì — và cũng là lý do một vòng đệ quy bất cẩn có thể đóng băng cả server.</p>

<h3>Thứ tự ưu tiên</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Code đồng bộ</div><div class="lz-d">chạy tới hết, luôn luôn</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Hàng đợi nextTick</div><div class="lz-d">xả CẠN HOÀN TOÀN</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Hàng đợi microtask</div><div class="lz-d">Promise — cũng xả cạn hoàn toàn</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Pha kế tiếp của loop</div><div class="lz-d">timers / poll / check…</div></div>
</div>
<p>Từ khoá quan trọng là <strong>cạn hoàn toàn</strong>. Node không chạy "vài cái" nextTick rồi đi tiếp — nó xả sạch hàng đợi, kể cả những cái được thêm vào trong lúc đang xả. Microtask cũng vậy.</p>

<h3>Cả hai hàng đợi đều xả xong trước mọi timer</h3>
<pre><code><span class="tok-keyword">let</span> n = <span class="tok-number">0</span>;
<span class="tok-function">setTimeout</span>(() =&gt; <span class="tok-function">console.log</span>(<span class="tok-string">'setTimeout còn chạy được không?'</span>), <span class="tok-number">0</span>);

<span class="tok-keyword">function</span> <span class="tok-function">deQuy</span>() { <span class="tok-keyword">if</span> (++n &lt; <span class="tok-number">1e6</span>) process.<span class="tok-function">nextTick</span>(deQuy); }
<span class="tok-function">deQuy</span>();
<span class="tok-function">console.log</span>(<span class="tok-string">'đã xếp 1 triệu nextTick vào hàng đợi'</span>);</code></pre>
<div class="out">đã xếp 1 triệu nextTick vào hàng đợi
setTimeout còn chạy được không?
nextTick đã chạy: 1000000 lần</div>
<p>Cả một triệu nextTick chạy <strong>trước</strong> callback của timer — vòng lặp không hề chạm tới pha timers cho tới khi hàng đợi rỗng. Ở đây nó xong trong vài mili giây nên timer vẫn kịp chạy. Nhưng cho vòng đệ quy chạy vô hạn thì hàng đợi không bao giờ rỗng: timer không bao giờ chạy, không I/O nào được thăm dò, và tiến trình đóng băng trong khi ngốn 100% CPU.</p>
<div class="pitfall">Một <code>process.nextTick</code> tự xếp lại chính nó mà không có điều kiện dừng là một trong số ít cách làm treo Node hoàn toàn — không lỗi, không sập, chỉ là một tiến trình chết lâm sàng không trả lời gì cả. Đệ quy trong microtask (một <code>.then()</code> tự xếp lại mình mãi mãi) cũng y hệt.</div>

<h3>nextTick hay Promise: dùng cái nào</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">process.nextTick</span><span class="v">Riêng của Node, ưu tiên cao nhất. Trường hợp dùng chính đáng rất hiếm: chủ yếu là tác giả thư viện muốn hoãn một callback để nó không bao giờ chạy đồng bộ.</span></div>
  <div class="kv"><span class="k">queueMicrotask</span><span class="v">Bản tương đương theo chuẩn, cùng mức ưu tiên với callback của Promise. Nếu thật sự cần hoãn thì ưu tiên cái này.</span></div>
  <div class="kv"><span class="k">Promise / await</span><span class="v">Thứ bạn nên dùng trong 99% trường hợp. Cùng hàng đợi với queueMicrotask.</span></div>
  <div class="kv"><span class="k">setImmediate</span><span class="v">Dùng khi bạn muốn nhường lượt cho vòng lặp — để I/O đang chờ được chạy trước khi mình đi tiếp. Đây là công cụ để chia nhỏ việc nặng (bài 2.5).</span></div>
</div>
<div class="callout warn">Nếu bản năng mách bảo "dùng nextTick cho nó chạy sớm hơn" — hãy dừng lại. Chạy <em>sớm hơn</em> vòng lặp nghĩa là chạy <em>trước</em> các I/O đang chờ, tức là bỏ đói chính những request bạn đang cố phục vụ. Hãy với tay lấy <code>setImmediate</code>: nó lịch sự xếp hàng chờ tới lượt.</div>
<div class="note-ct">Thực tế bạn sẽ viết <code>await</code> hàng nghìn lần và viết <code>process.nextTick</code> gần như không bao giờ. Biết nó tồn tại chủ yếu có ích khi đọc mã nguồn thư viện, và để hiểu vì sao một vết stack cho thấy callback của bạn chạy "muộn hơn" bạn tưởng.</div>
</div>
`,
    },

    /* ─────────────────────────── 2.4 ─────────────────────────── */
    {
      title: '2.4 — Blocking the loop: measured|||2.4 — Chặn event loop: đo bằng số thật',
      slug: 'nodejs-2-4-chan-event-loop',
      type: 'VIDEO',
      description: 'Đo chính xác điều gì xảy ra khi một phép tính nặng chạy trên luồng chính, và khám phá thread pool ẩn của libuv.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>Blocking the loop — measured</h2>
<p class="lead">Everything so far has been theory. Now we measure it. The technique: run a heartbeat timer every 100 ms and record how late it actually arrives. That number — <strong>event loop lag</strong> — is the single most important health metric a Node service has.</p>

<h3>The experiment</h3>
<pre><code><span class="tok-keyword">let</span> prev = Date.<span class="tok-function">now</span>(), max = <span class="tok-number">0</span>;
<span class="tok-keyword">const</span> beat = <span class="tok-function">setInterval</span>(() =&gt; {
  <span class="tok-keyword">const</span> late = Date.<span class="tok-function">now</span>() - prev - <span class="tok-number">100</span>;   <span class="tok-comment">// should be ~0</span>
  <span class="tok-keyword">if</span> (late &gt; max) max = late;
  prev = Date.<span class="tok-function">now</span>();
}, <span class="tok-number">100</span>);

<span class="tok-function">setTimeout</span>(() =&gt; {
  <span class="tok-keyword">let</span> s = <span class="tok-number">0</span>;
  <span class="tok-keyword">for</span> (<span class="tok-keyword">let</span> i = <span class="tok-number">0</span>; i &lt; <span class="tok-number">3e9</span>; i++) s += i;    <span class="tok-comment">// CPU-bound, synchronous</span>
}, <span class="tok-number">300</span>);</code></pre>
<div class="out">→ heavy computation started (synchronous)...
→ finished after 2871 ms
→ heartbeat was LATE by up to: 2873 ms</div>
<p>Read those two numbers together. The computation took 2871 ms, and the heartbeat was late by 2873 ms — <strong>the same number</strong>. During that entire time the process could not: accept a request, respond to one, read from the database, answer a health check, or close a socket. From outside, the server looked dead.</p>
<div class="callout danger">If 200 users hit that endpoint, they do not each wait 2.9 seconds — they queue. The 200th waits roughly <strong>ten minutes</strong>. This is how a single unoptimised endpoint takes down an entire API, and why "it's fast on my machine with one user" proves nothing.</div>

<h3>What counts as blocking</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Blocking (bad)</span><span class="v">Big loops, JSON.parse on a huge payload, synchronous crypto, regex backtracking, <code>fs.readFileSync</code>, image processing in-process.</span></div>
  <div class="kv"><span class="k">Not blocking (fine)</span><span class="v">Anything you <code>await</code>: database queries, HTTP calls, async file reads. Waiting is free.</span></div>
  <div class="kv"><span class="k">Sneaky</span><span class="v">A regex on user input can backtrack exponentially — a 30-character string can hang the loop for minutes. This is a real denial-of-service class (ReDoS).</span></div>
</div>

<h3>The hidden thread pool</h3>
<p>Earlier we said Node uses more threads underneath. Here is the proof. <code>crypto.pbkdf2</code> is asynchronous but genuinely CPU-heavy, so libuv runs it on its thread pool — 4 threads by default. Fire eight of them at once:</p>
<pre><code><span class="tok-keyword">const</span> t = Date.<span class="tok-function">now</span>();
<span class="tok-keyword">for</span> (<span class="tok-keyword">let</span> i = <span class="tok-number">1</span>; i &lt;= <span class="tok-number">8</span>; i++) {
  crypto.<span class="tok-function">pbkdf2</span>(<span class="tok-string">'pw'</span>, <span class="tok-string">'salt'</span>, <span class="tok-number">200000</span>, <span class="tok-number">64</span>, <span class="tok-string">'sha512'</span>, () =&gt;
    <span class="tok-function">console.log</span>(<span class="tok-string">'  task'</span>, i, <span class="tok-string">'done after'</span>, Date.<span class="tok-function">now</span>() - t, <span class="tok-string">'ms'</span>));
}</code></pre>
<div class="out">  task 1 done after 49 ms
  task 3 done after 54 ms
  task 4 done after 61 ms
  task 2 done after 63 ms
  task 5 done after 100 ms
  task 6 done after 113 ms
  task 7 done after 121 ms
  task 8 done after 131 ms</div>
<p>Look at the gap. Tasks 1–4 finish around 50–63 ms; tasks 5–8 only start once a thread frees up and land at 100–131 ms. Two clean waves — you are literally watching a pool of four workers. Raise the pool and the waves disappear:</p>
<pre><code>UV_THREADPOOL_SIZE=8 node pool.js</code></pre>
<div class="out">  task 1 done after 57 ms
  task 7 done after 58 ms
  task 3 done after 60 ms
  task 5 done after 64 ms
  task 2 done after 68 ms
  task 4 done after 69 ms
  task 8 done after 70 ms
  task 6 done after 77 ms</div>
<div class="pitfall">Do not raise <code>UV_THREADPOOL_SIZE</code> above your CPU core count and expect magic — the threads then just compete for the same cores. And note what the pool does <strong>not</strong> cover: your own JavaScript loops never go to the pool. Only file I/O, DNS lookups, zlib and crypto do.</div>

<h3>Measure it in your own service</h3>
<pre><code><span class="tok-keyword">import</span> { monitorEventLoopDelay } <span class="tok-keyword">from</span> <span class="tok-string">'node:perf_hooks'</span>;
<span class="tok-keyword">const</span> h = <span class="tok-function">monitorEventLoopDelay</span>({ resolution: <span class="tok-number">20</span> });
h.<span class="tok-function">enable</span>();

<span class="tok-function">setInterval</span>(() =&gt; {
  <span class="tok-function">console.log</span>(<span class="tok-string">'loop lag p99 (ms):'</span>, (h.<span class="tok-function">percentile</span>(<span class="tok-number">99</span>) / <span class="tok-number">1e6</span>).<span class="tok-function">toFixed</span>(<span class="tok-number">1</span>));
  h.<span class="tok-function">reset</span>();
}, <span class="tok-number">10000</span>);</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">under 10 ms</span><span class="v">Healthy. The loop is keeping up.</span></div>
  <div class="kv"><span class="k">50–100 ms</span><span class="v">Something is doing real work on the main thread. Investigate.</span></div>
  <div class="kv"><span class="k">over 500 ms</span><span class="v">Users are already feeling it. Requests are queueing behind computation.</span></div>
</div>
<div class="note-ct">This is why image resizing on this site is done by <em>sharp</em> — a native library that releases the JavaScript thread and works on libuv's pool — instead of a pure-JS image library. Same API shape from your side, completely different behaviour under load.</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>Chặn event loop — đo bằng số thật</h2>
<p class="lead">Từ đầu tới giờ toàn lý thuyết. Giờ ta đo. Kỹ thuật: cho một timer "nhịp tim" chạy mỗi 100 ms rồi ghi lại nó thực sự tới trễ bao nhiêu. Con số đó — <strong>độ trễ event loop</strong> — là chỉ số sức khoẻ quan trọng bậc nhất của một dịch vụ Node.</p>

<h3>Thí nghiệm</h3>
<pre><code><span class="tok-keyword">let</span> truoc = Date.<span class="tok-function">now</span>(), max = <span class="tok-number">0</span>;
<span class="tok-keyword">const</span> nhip = <span class="tok-function">setInterval</span>(() =&gt; {
  <span class="tok-keyword">const</span> tre = Date.<span class="tok-function">now</span>() - truoc - <span class="tok-number">100</span>;   <span class="tok-comment">// lẽ ra phải ~0</span>
  <span class="tok-keyword">if</span> (tre &gt; max) max = tre;
  truoc = Date.<span class="tok-function">now</span>();
}, <span class="tok-number">100</span>);

<span class="tok-function">setTimeout</span>(() =&gt; {
  <span class="tok-keyword">let</span> s = <span class="tok-number">0</span>;
  <span class="tok-keyword">for</span> (<span class="tok-keyword">let</span> i = <span class="tok-number">0</span>; i &lt; <span class="tok-number">3e9</span>; i++) s += i;    <span class="tok-comment">// nặng CPU, đồng bộ</span>
}, <span class="tok-number">300</span>);</code></pre>
<div class="out">→ bắt đầu tính toán nặng (đồng bộ)...
→ tính xong sau 2871 ms
→ nhịp tim bị trễ TỐI ĐA: 2873 ms</div>
<p>Hãy đọc hai con số đó cùng nhau. Phép tính mất 2871 ms, và nhịp tim trễ 2873 ms — <strong>cùng một con số</strong>. Suốt quãng thời gian đó tiến trình không thể: nhận request, trả lời request, đọc database, đáp health check, hay đóng một socket. Nhìn từ bên ngoài, server như đã chết.</p>
<div class="callout danger">Nếu 200 người cùng gọi endpoint đó, họ không phải mỗi người chờ 2,9 giây — họ xếp hàng. Người thứ 200 chờ khoảng <strong>mười phút</strong>. Đó là cách một endpoint chưa tối ưu duy nhất hạ gục cả API, và là lý do câu "máy tôi chạy nhanh mà" với một người dùng chẳng chứng minh được gì.</div>

<h3>Cái gì được tính là chặn</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Chặn (xấu)</span><span class="v">Vòng lặp lớn, JSON.parse một payload khổng lồ, crypto đồng bộ, regex quay lui, <code>fs.readFileSync</code>, xử lý ảnh ngay trong tiến trình.</span></div>
  <div class="kv"><span class="k">Không chặn (ổn)</span><span class="v">Mọi thứ bạn <code>await</code>: truy vấn database, gọi HTTP, đọc file bất đồng bộ. Chờ đợi là miễn phí.</span></div>
  <div class="kv"><span class="k">Ngấm ngầm</span><span class="v">Một regex chạy trên dữ liệu người dùng nhập có thể quay lui theo cấp số nhân — một chuỗi 30 ký tự đủ làm treo vòng lặp hàng phút. Đây là một loại tấn công từ chối dịch vụ có thật (ReDoS).</span></div>
</div>

<h3>Thread pool ẩn</h3>
<p>Ở trên ta có nói Node dùng nhiều luồng bên dưới. Đây là bằng chứng. <code>crypto.pbkdf2</code> là bất đồng bộ nhưng thực sự nặng CPU, nên libuv chạy nó trên thread pool — mặc định 4 luồng. Bắn tám cái cùng lúc:</p>
<pre><code><span class="tok-keyword">const</span> t = Date.<span class="tok-function">now</span>();
<span class="tok-keyword">for</span> (<span class="tok-keyword">let</span> i = <span class="tok-number">1</span>; i &lt;= <span class="tok-number">8</span>; i++) {
  crypto.<span class="tok-function">pbkdf2</span>(<span class="tok-string">'mk'</span>, <span class="tok-string">'muoi'</span>, <span class="tok-number">200000</span>, <span class="tok-number">64</span>, <span class="tok-string">'sha512'</span>, () =&gt;
    <span class="tok-function">console.log</span>(<span class="tok-string">'  tác vụ'</span>, i, <span class="tok-string">'xong sau'</span>, Date.<span class="tok-function">now</span>() - t, <span class="tok-string">'ms'</span>));
}</code></pre>
<div class="out">  tác vụ 1 xong sau 49 ms
  tác vụ 3 xong sau 54 ms
  tác vụ 4 xong sau 61 ms
  tác vụ 2 xong sau 63 ms
  tác vụ 5 xong sau 100 ms
  tác vụ 6 xong sau 113 ms
  tác vụ 7 xong sau 121 ms
  tác vụ 8 xong sau 131 ms</div>
<p>Hãy nhìn khoảng hụt ở giữa. Tác vụ 1–4 xong quanh 50–63 ms; tác vụ 5–8 chỉ bắt đầu khi có luồng rảnh ra và về đích ở 100–131 ms. Hai đợt sóng rõ rệt — bạn đang tận mắt nhìn một nhóm bốn thợ. Nâng số thợ lên thì sóng biến mất:</p>
<pre><code>UV_THREADPOOL_SIZE=8 node pool.js</code></pre>
<div class="out">  tác vụ 1 xong sau 57 ms
  tác vụ 7 xong sau 58 ms
  tác vụ 3 xong sau 60 ms
  tác vụ 5 xong sau 64 ms
  tác vụ 2 xong sau 68 ms
  tác vụ 4 xong sau 69 ms
  tác vụ 8 xong sau 70 ms
  tác vụ 6 xong sau 77 ms</div>
<div class="pitfall">Đừng nâng <code>UV_THREADPOOL_SIZE</code> vượt số nhân CPU rồi mong phép màu — lúc đó các luồng chỉ giành nhau đúng mấy cái nhân ấy. Và để ý cái mà pool <strong>không</strong> gánh: vòng lặp JavaScript của chính bạn không bao giờ được đưa vào pool. Chỉ I/O file, tra cứu DNS, zlib và crypto mới vào.</div>

<h3>Đo ngay trong dịch vụ của bạn</h3>
<pre><code><span class="tok-keyword">import</span> { monitorEventLoopDelay } <span class="tok-keyword">from</span> <span class="tok-string">'node:perf_hooks'</span>;
<span class="tok-keyword">const</span> h = <span class="tok-function">monitorEventLoopDelay</span>({ resolution: <span class="tok-number">20</span> });
h.<span class="tok-function">enable</span>();

<span class="tok-function">setInterval</span>(() =&gt; {
  <span class="tok-function">console.log</span>(<span class="tok-string">'độ trễ loop p99 (ms):'</span>, (h.<span class="tok-function">percentile</span>(<span class="tok-number">99</span>) / <span class="tok-number">1e6</span>).<span class="tok-function">toFixed</span>(<span class="tok-number">1</span>));
  h.<span class="tok-function">reset</span>();
}, <span class="tok-number">10000</span>);</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">dưới 10 ms</span><span class="v">Khoẻ. Vòng lặp đang theo kịp.</span></div>
  <div class="kv"><span class="k">50–100 ms</span><span class="v">Có thứ gì đó đang làm việc thật trên luồng chính. Cần điều tra.</span></div>
  <div class="kv"><span class="k">trên 500 ms</span><span class="v">Người dùng đã cảm nhận được rồi. Request đang xếp hàng sau các phép tính.</span></div>
</div>
<div class="note-ct">Đây chính là lý do việc resize ảnh trên website này giao cho <em>sharp</em> — một thư viện native nhả luồng JavaScript ra và làm việc trên pool của libuv — thay vì một thư viện ảnh viết thuần JS. Nhìn từ phía bạn thì API giống hệt nhau, nhưng hành vi khi tải cao thì khác một trời một vực.</div>
</div>
`,
    },

    /* ─────────────────────────── 2.5 ─────────────────────────── */
    {
      title: '2.5 — Getting heavy work off the loop|||2.5 — Đưa việc nặng ra khỏi event loop',
      slug: 'nodejs-2-5-worker-threads',
      type: 'VIDEO',
      description: 'Ba cách xử lý việc nặng CPU — worker threads, chia nhỏ, nhiều tiến trình — kèm số đo và cái giá của từng cách.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.5</span>
<h2>Getting heavy work off the loop</h2>
<p class="lead">We measured the disease in 2.4: 2871 ms of computation froze the whole process. Now the cures. There are three, they are not interchangeable, and each has a price.</p>

<h3>Cure 1 — worker threads (the real fix)</h3>
<p>A worker thread is a separate JavaScript thread with its own V8 instance and its own event loop. Same computation, moved off the main thread:</p>
<pre><code><span class="tok-comment">// worker.js</span>
<span class="tok-keyword">const</span> { parentPort } = <span class="tok-function">require</span>(<span class="tok-string">'node:worker_threads'</span>);
<span class="tok-keyword">let</span> s = <span class="tok-number">0</span>;
<span class="tok-keyword">for</span> (<span class="tok-keyword">let</span> i = <span class="tok-number">0</span>; i &lt; <span class="tok-number">3e9</span>; i++) s += i;
parentPort.<span class="tok-function">postMessage</span>(s);

<span class="tok-comment">// main.js — heartbeat still running, same as before</span>
<span class="tok-keyword">const</span> w = <span class="tok-keyword">new</span> <span class="tok-function">Worker</span>(<span class="tok-string">'./worker.js'</span>);
w.<span class="tok-function">on</span>(<span class="tok-string">'message'</span>, () =&gt; <span class="tok-function">console.log</span>(<span class="tok-string">'worker finished'</span>));</code></pre>
<div class="out">→ handing heavy work to a worker...
→ worker finished after 2883 ms
→ heartbeat was LATE by up to: 2 ms   (main thread stayed free!)</div>
<p>Compare with lesson 2.4: <strong>2873 ms of lag → 2 ms</strong>. The work still takes just as long (2883 ms — a hair slower, because starting a worker costs a few milliseconds), but the server keeps answering every other request throughout.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Cost</span><span class="v">A worker is not free: ~10–30 ms to start and its own memory (a fresh V8 heap). Don't spawn one per request — keep a small pool.</span></div>
  <div class="kv"><span class="k">No shared state</span><span class="v">Workers don't share variables. You pass messages (data is copied), or use SharedArrayBuffer for raw bytes.</span></div>
  <div class="kv"><span class="k">Use for</span><span class="v">Genuine CPU work: parsing huge files, compression, image/video processing, cryptography, heavy data transformation.</span></div>
</div>

<h3>Cure 2 — split the work into chunks</h3>
<p>If you cannot move the work, you can slice it and let the loop breathe between slices using <code>setImmediate</code>:</p>
<pre><code><span class="tok-keyword">const</span> TOTAL = <span class="tok-number">3e9</span>, CHUNK = <span class="tok-number">3e7</span>;
<span class="tok-keyword">let</span> i = <span class="tok-number">0</span>, s = <span class="tok-number">0</span>;
<span class="tok-keyword">function</span> <span class="tok-function">runChunk</span>() {
  <span class="tok-keyword">const</span> end = Math.<span class="tok-function">min</span>(i + CHUNK, TOTAL);
  <span class="tok-keyword">for</span> (; i &lt; end; i++) s += i;
  <span class="tok-keyword">if</span> (i &lt; TOTAL) <span class="tok-function">setImmediate</span>(runChunk);   <span class="tok-comment">// yield to the loop</span>
}
<span class="tok-function">runChunk</span>();</code></pre>
<div class="out">→ finished after 19580 ms · heartbeat late by up to: 194 ms</div>
<div class="callout warn">Look at the honest trade-off: lag dropped from 2873 ms to 194 ms, but the job went from 2871 ms to <strong>19580 ms — about 6.8× slower</strong>. Yielding constantly costs real throughput. Chunking keeps a server responsive, but it is a compromise, not a free win. Prefer a worker when the work is genuinely heavy.</div>

<h3>Cure 3 — more processes (cluster)</h3>
<p>One Node process uses one core. A machine with 4 cores can run 4 processes sharing the same port, each with its own event loop:</p>
<pre><code><span class="tok-keyword">import</span> cluster <span class="tok-keyword">from</span> <span class="tok-string">'node:cluster'</span>;
<span class="tok-keyword">import</span> os <span class="tok-keyword">from</span> <span class="tok-string">'node:os'</span>;

<span class="tok-keyword">if</span> (cluster.isPrimary) {
  <span class="tok-keyword">for</span> (<span class="tok-keyword">let</span> i = <span class="tok-number">0</span>; i &lt; os.<span class="tok-function">cpus</span>().length; i++) cluster.<span class="tok-function">fork</span>();
} <span class="tok-keyword">else</span> {
  <span class="tok-function">startServer</span>();   <span class="tok-comment">// each worker process listens on the same port</span>
}</code></pre>
<p>This multiplies capacity, but it does <strong>not</strong> save you from a blocking endpoint — it just means one frozen process out of four instead of one out of one. Cluster is for using all your cores, not for fixing bad code.</p>
<div class="pitfall">With multiple processes, in-memory state stops working. A rate-limit counter or cache in a plain JavaScript variable is now per-process — four processes, four different counters, four different answers. This is exactly why shared state moves to Redis (chapter 12).</div>

<h3>How to choose</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Work takes &gt; 50 ms of CPU</span><span class="v">Worker thread, or hand it to a background queue (chapter 13) if the user doesn't need the answer immediately.</span></div>
  <div class="kv"><span class="k">Work is a big loop you control</span><span class="v">Chunk it with setImmediate — accepting the throughput cost.</span></div>
  <div class="kv"><span class="k">You have spare cores</span><span class="v">Cluster (or several containers) to multiply capacity.</span></div>
  <div class="kv"><span class="k">Best of all</span><span class="v">Don't do the work during the request. Precompute it, cache it, or queue it.</span></div>
</div>
<div class="note-ct">On this site, video and image processing never happens inside a request. The upload endpoint stores the file and returns immediately; the heavy work runs elsewhere. That is the pattern to internalise: <strong>a request should decide and delegate, not compute.</strong></div>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-324" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 324 — Performance, Caching and Scaling</span><span class="lc-sub">10 exercises on workers, clustering and keeping the loop free.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.5</span>
<h2>Đưa việc nặng ra khỏi event loop</h2>
<p class="lead">Bài 2.4 ta đã đo được căn bệnh: 2871 ms tính toán làm đóng băng cả tiến trình. Giờ tới thuốc chữa. Có ba loại, không thay thế cho nhau được, và mỗi loại đều có giá của nó.</p>

<h3>Thuốc 1 — worker threads (cách chữa thật sự)</h3>
<p>Worker thread là một luồng JavaScript riêng biệt, có bản V8 riêng và event loop riêng. Vẫn phép tính đó, nhưng dời ra khỏi luồng chính:</p>
<pre><code><span class="tok-comment">// worker.js</span>
<span class="tok-keyword">const</span> { parentPort } = <span class="tok-function">require</span>(<span class="tok-string">'node:worker_threads'</span>);
<span class="tok-keyword">let</span> s = <span class="tok-number">0</span>;
<span class="tok-keyword">for</span> (<span class="tok-keyword">let</span> i = <span class="tok-number">0</span>; i &lt; <span class="tok-number">3e9</span>; i++) s += i;
parentPort.<span class="tok-function">postMessage</span>(s);

<span class="tok-comment">// main.js — nhịp tim vẫn chạy, y như thí nghiệm trước</span>
<span class="tok-keyword">const</span> w = <span class="tok-keyword">new</span> <span class="tok-function">Worker</span>(<span class="tok-string">'./worker.js'</span>);
w.<span class="tok-function">on</span>(<span class="tok-string">'message'</span>, () =&gt; <span class="tok-function">console.log</span>(<span class="tok-string">'worker xong'</span>));</code></pre>
<div class="out">→ giao việc nặng cho worker...
→ worker tính xong sau 2883 ms
→ nhịp tim bị trễ TỐI ĐA: 2 ms   (luồng chính vẫn rảnh!)</div>
<p>So với bài 2.4: <strong>từ 2873 ms độ trễ xuống còn 2 ms</strong>. Công việc vẫn tốn từng ấy thời gian (2883 ms — nhỉnh hơn chút vì khởi động worker mất vài mili giây), nhưng server vẫn trả lời mọi request khác suốt quãng đó.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Cái giá</span><span class="v">Worker không miễn phí: mất ~10–30 ms để khởi động và tốn bộ nhớ riêng (một vùng heap V8 mới). Đừng sinh một worker cho mỗi request — hãy giữ một nhóm nhỏ dùng lại.</span></div>
  <div class="kv"><span class="k">Không dùng chung biến</span><span class="v">Worker không chia sẻ biến. Bạn truyền thông điệp (dữ liệu được sao chép), hoặc dùng SharedArrayBuffer cho dữ liệu byte thô.</span></div>
  <div class="kv"><span class="k">Dùng cho</span><span class="v">Việc nặng CPU thật sự: phân tích file khổng lồ, nén, xử lý ảnh/video, mật mã, biến đổi dữ liệu lớn.</span></div>
</div>

<h3>Thuốc 2 — chia việc thành từng lô</h3>
<p>Nếu không dời việc đi được, bạn có thể xắt nhỏ nó ra và để vòng lặp thở giữa các lát bằng <code>setImmediate</code>:</p>
<pre><code><span class="tok-keyword">const</span> TONG = <span class="tok-number">3e9</span>, LO = <span class="tok-number">3e7</span>;
<span class="tok-keyword">let</span> i = <span class="tok-number">0</span>, s = <span class="tok-number">0</span>;
<span class="tok-keyword">function</span> <span class="tok-function">chayLo</span>() {
  <span class="tok-keyword">const</span> den = Math.<span class="tok-function">min</span>(i + LO, TONG);
  <span class="tok-keyword">for</span> (; i &lt; den; i++) s += i;
  <span class="tok-keyword">if</span> (i &lt; TONG) <span class="tok-function">setImmediate</span>(chayLo);   <span class="tok-comment">// nhường lượt cho vòng lặp</span>
}
<span class="tok-function">chayLo</span>();</code></pre>
<div class="out">→ xong sau 19580 ms · nhịp tim trễ tối đa: 194 ms</div>
<div class="callout warn">Hãy nhìn thẳng vào cái giá phải trả: độ trễ giảm từ 2873 ms xuống 194 ms, nhưng công việc kéo dài từ 2871 ms lên <strong>19580 ms — chậm khoảng 6,8 lần</strong>. Nhường lượt liên tục làm mất thông lượng thật. Chia lô giữ cho server còn phản hồi, nhưng đó là một sự thoả hiệp, không phải món hời miễn phí. Việc thật sự nặng thì nên ưu tiên worker.</div>

<h3>Thuốc 3 — nhiều tiến trình (cluster)</h3>
<p>Một tiến trình Node dùng một nhân CPU. Máy 4 nhân có thể chạy 4 tiến trình cùng chia nhau một cổng, mỗi tiến trình có event loop riêng:</p>
<pre><code><span class="tok-keyword">import</span> cluster <span class="tok-keyword">from</span> <span class="tok-string">'node:cluster'</span>;
<span class="tok-keyword">import</span> os <span class="tok-keyword">from</span> <span class="tok-string">'node:os'</span>;

<span class="tok-keyword">if</span> (cluster.isPrimary) {
  <span class="tok-keyword">for</span> (<span class="tok-keyword">let</span> i = <span class="tok-number">0</span>; i &lt; os.<span class="tok-function">cpus</span>().length; i++) cluster.<span class="tok-function">fork</span>();
} <span class="tok-keyword">else</span> {
  <span class="tok-function">khoiDongServer</span>();   <span class="tok-comment">// mỗi tiến trình con cùng lắng nghe một cổng</span>
}</code></pre>
<p>Cách này nhân năng lực lên, nhưng <strong>không</strong> cứu bạn khỏi một endpoint gây chặn — nó chỉ khiến bạn có một tiến trình đóng băng trên bốn, thay vì một trên một. Cluster là để dùng hết số nhân CPU, không phải để chữa code tồi.</p>
<div class="pitfall">Khi chạy nhiều tiến trình, trạng thái lưu trong bộ nhớ hết hiệu lực. Một bộ đếm rate-limit hay một cache nằm trong biến JavaScript thường giờ là của riêng từng tiến trình — bốn tiến trình, bốn bộ đếm khác nhau, bốn câu trả lời khác nhau. Đó chính xác là lý do trạng thái dùng chung phải dời sang Redis (chương 12).</div>

<h3>Chọn thế nào</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Việc tốn &gt; 50 ms CPU</span><span class="v">Worker thread, hoặc đẩy sang hàng đợi nền (chương 13) nếu người dùng không cần câu trả lời ngay.</span></div>
  <div class="kv"><span class="k">Việc là một vòng lặp lớn bạn kiểm soát được</span><span class="v">Chia lô bằng setImmediate — và chấp nhận cái giá về thông lượng.</span></div>
  <div class="kv"><span class="k">Bạn còn dư nhân CPU</span><span class="v">Cluster (hoặc nhiều container) để nhân năng lực phục vụ.</span></div>
  <div class="kv"><span class="k">Tốt nhất trong mọi cách</span><span class="v">Đừng làm việc đó ngay trong request. Hãy tính trước, cache lại, hoặc xếp vào hàng đợi.</span></div>
</div>
<div class="note-ct">Ở website này, xử lý video và ảnh không bao giờ diễn ra bên trong một request. Endpoint upload lưu file rồi trả về ngay lập tức; phần việc nặng chạy ở chỗ khác. Đó là mẫu hình cần thấm: <strong>một request nên quyết định và giao việc, chứ không nên ngồi tính.</strong></div>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-324" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 324 — Hiệu năng, Cache và Mở rộng</span><span class="lc-sub">10 bài tập về worker, cluster và giữ cho event loop luôn rảnh.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 2.6 QUIZ ─────────────────────────── */
    {
      title: '2.6 — Chapter 2 quiz|||2.6 — Kiểm tra chương 2',
      slug: 'nodejs-2-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về runtime, event loop, thứ tự thực thi và cách xử lý việc nặng CPU.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">This chapter is the one that separates people who "use Node" from people who <em>understand</em> it. If a question feels uncertain, go back and re-run that experiment — the numbers teach faster than the prose.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Đây là chương phân biệt người "dùng được Node" với người <em>hiểu</em> Node. Câu nào thấy chưa chắc, hãy quay lại chạy lại đúng thí nghiệm đó — những con số dạy nhanh hơn lời văn nhiều.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Which two components make up the core of the Node.js runtime?|||Hai thành phần nào tạo nên lõi của Node.js runtime?',
            options: [
              'V8 and libuv',
              'V8 and npm',
              'Chrome and Express|||Chrome và Express',
              'libuv and TypeScript|||libuv và TypeScript',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What runs FIRST after all synchronous code finishes?|||Cái gì chạy ĐẦU TIÊN sau khi toàn bộ code đồng bộ chạy xong?',
            options: [
              'setTimeout callbacks|||callback của setTimeout',
              'setImmediate callbacks|||callback của setImmediate',
              'The process.nextTick queue|||Hàng đợi process.nextTick',
              'I/O callbacks|||callback của I/O',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'At the top level of a script, does setTimeout(fn, 0) run before setImmediate(fn)?|||Ở cấp cao nhất của một script, setTimeout(fn, 0) có chạy trước setImmediate(fn) không?',
            options: [
              'Yes, always|||Có, luôn luôn',
              'No, never|||Không, không bao giờ',
              'It is unpredictable — the order varies between runs|||Không đoán được — thứ tự thay đổi giữa các lần chạy',
              'Only on Windows|||Chỉ trên Windows',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Inside an I/O callback (e.g. after fs.readFile), which runs first?|||Bên trong một callback I/O (ví dụ sau fs.readFile), cái nào chạy trước?',
            options: [
              'setImmediate — the check phase comes right after poll|||setImmediate — pha check nằm ngay sau poll',
              'setTimeout(…, 0) — timers always come first|||setTimeout(…, 0) — pha timers luôn đi trước',
              'Still unpredictable|||Vẫn không đoán được',
              'Neither will run|||Cả hai đều không chạy',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A synchronous loop takes 2871 ms. What happens to a setInterval(fn, 100) heartbeat?|||Một vòng lặp đồng bộ mất 2871 ms. Chuyện gì xảy ra với nhịp tim setInterval(fn, 100)?',
            options: [
              'It keeps firing every 100 ms on another thread|||Nó vẫn chạy đều mỗi 100 ms trên luồng khác',
              'It is delayed by roughly the same 2873 ms|||Nó bị trễ khoảng đúng chừng ấy — 2873 ms',
              'It is cancelled automatically|||Nó bị huỷ tự động',
              'It fires 28 times immediately after|||Nó chạy dồn 28 lần ngay sau đó',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is the DEFAULT size of the libuv thread pool?|||Kích thước MẶC ĐỊNH của thread pool libuv là bao nhiêu?',
            options: ['1', '4', '8', 'Bằng số nhân CPU|||Equal to the CPU core count'],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which work does the libuv thread pool NOT handle?|||Loại việc nào KHÔNG được thread pool của libuv gánh?',
            options: [
              'File I/O|||I/O file',
              'crypto.pbkdf2',
              'DNS lookups|||Tra cứu DNS',
              'Your own JavaScript for-loop|||Vòng lặp for JavaScript của chính bạn',
            ],
            correctIndex: 3,
            points: 1,
          },
          {
            question: 'Moving a 2871 ms computation to a worker thread changed loop lag from 2873 ms to what?|||Chuyển phép tính 2871 ms sang worker thread làm độ trễ vòng lặp đổi từ 2873 ms xuống còn bao nhiêu?',
            options: [
              'About 2 ms — the main thread stayed free|||Khoảng 2 ms — luồng chính vẫn rảnh',
              'About 1400 ms — half the time|||Khoảng 1400 ms — một nửa thời gian',
              'Still 2873 ms — workers do not help|||Vẫn 2873 ms — worker không giúp gì',
              '0 ms, and the computation also became instant|||0 ms, và phép tính cũng trở nên tức thì',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
