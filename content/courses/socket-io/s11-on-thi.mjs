const REF = '?ref=%2Fcourses%2Fsocket-io%2Flearn&reflabel=Socket.IO';

export default {
  title: 'Chapter 11 — What survived measurement, and a final exam|||Chương 11 — Cái sống qua đo lường, và đề thi cuối',
  slug: 'io-ch11-on-thi',
  description: 'Hai bài. Bài 11.1 sắp mọi phát hiện thành ba cột (luôn đúng, chỉ đúng khi đo, luôn sai). Bài 11.2 là đề thi cuối 12 câu / 1080s.',
  sortOrder: 12,
  lessons: [

    {
      title: '11.1 — What survived measurement|||11.1 — Cái SỐNG QUA đo lường',
      slug: 'io-11-1-song-qua',
      type: 'VIDEO',
      description: 'Ba cột. Cột A: luôn đúng, không cần đo lại. Cột B: chỉ đúng khi bạn đo — con số của kho khác sẽ khác. Cột C: trực giác nói, nhưng đo cho ra sai.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.1</span>
<h2>What survived measurement</h2>
<p class="lead">Ten chapters generated numbers, patterns, and claims. Some hold in any socket.io project. Some are properties of THIS codebase. Some were things I believed at the start that measurement proved wrong. This lesson sorts everything into those three columns.</p>

<h3>Cột A — LUÔN ĐÚNG</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Socket.IO là 4 tầng</span><span class="lz-lnote">Wire → engine.io → socket.io → your code. Mọi bug diagnose theo tầng. Bài 0.1</span></div>
<div class="lz-layer"><span class="lz-lname">Client luôn bắt đầu bằng polling</span><span class="lz-lnote">Sau đó upgrade WebSocket nếu proxy cho phép. Thứ tự <code>transports: [...]</code> là permission, không thứ tự. Bài 0.2</span></div>
<div class="lz-layer"><span class="lz-lname">Two sids: engine.io ≠ socket.io</span><span class="lz-lnote">socket.id vs socket.conn.id. Một engine.io connection nuôi nhiều namespace. Bài 0.3</span></div>
<div class="lz-layer"><span class="lz-lname">Default là at-most-once</span><span class="lz-lnote">Emit fire-and-forget. Không exception khi packet mất. Bài 6.1</span></div>
<div class="lz-layer"><span class="lz-lname">io.to(A).to(B) là intersection</span><span class="lz-lnote">Cần cả A VÀ B. Dùng <code>[A, B]</code> cho union. Bài 3.1</span></div>
<div class="lz-layer"><span class="lz-lname">Sid đổi ở reconnect</span><span class="lz-lnote">Track state theo userId, không socket.id. Bài 1.3 + 1.5</span></div>
<div class="lz-layer"><span class="lz-lname">Redis adapter ≠ sticky sessions</span><span class="lz-lnote">Cluster cần CẢ HAI. Adapter broadcast cross-worker, sticky routes polling to same worker. Bài 2.3 + 5.1</span></div>
<div class="lz-layer"><span class="lz-lname">WebRTC media KHÔNG qua socket.io</span><span class="lz-lnote">Socket.io chỉ signalling (2 KB, 5-20 packets). Media qua RTP/UDP P2P. Bài 7.1</span></div>
</div>

<h3>Cột B — CHỈ ĐÚNG KHI ĐO</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Kho này: pingInterval 25s, pingTimeout 60s</span><span class="lz-lnote">Kho khác đặt khác. Đo lại; nguyên tắc &quot;pingInterval &lt; proxy_read_timeout&quot; luôn đúng. Bài 2.2</span></div>
<div class="lz-layer"><span class="lz-lname">Audience trung bình 30 (friends + thread peers)</span><span class="lz-lnote">Kho khác sẽ khác — có thể 5 (tight-knit app) hoặc 300 (open social). Nhưng nguyên tắc emitPresenceTo(audience) thay io.emit luôn đúng. Bài 4.1</span></div>
<div class="lz-layer"><span class="lz-lname">76% dynamic className bypass twMerge (Tailwind)</span><span class="lz-lnote">Không, wait, đó là kho Tailwind course. Ở đây: kho có 3 WS servers (socket.io, Hocuspocus, raw ws). Đo trên kho bạn</span></div>
<div class="lz-layer"><span class="lz-lname">device.gateway.ts 1.035 dòng</span><span class="lz-lnote">Kho không có device sẽ khác. Nếu có, cost ~1000 dòng để bridge raw ws + socket.io là hợp lý. Bài 9.1</span></div>
<div class="lz-layer"><span class="lz-lname">Handshake 26ms + 9ms cho connect</span><span class="lz-lnote">Latency phụ thuộc network. VN → SG data center thường 30-100ms. Local sandbox nhanh hơn</span></div>
</div>

<h3>Cột C — LUÔN SAI (trực giác vs đo lường)</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">TRỰC GIÁC: &quot;transport array quyết thứ tự thử&quot;</span><span class="lz-lnote">SAI. Client luôn bắt đầu polling bất kể thứ tự array. Array chỉ khai báo cái được PHÉP. Bài 0.2</span></div>
<div class="lz-layer"><span class="lz-lname">TRỰC GIÁC: &quot;polling nặng hơn WebSocket 133×&quot;</span><span class="lz-lnote">SAI OVER-SIMPLIFICATION. Ở TẦNG socket.io, giống nhau. Overhead thật ở HTTP header per poll cycle, 2.7-133× tuỳ burstiness. Bài 2.1 sửa lại 0.2</span></div>
<div class="lz-layer"><span class="lz-lname">TRỰC GIÁC: &quot;socket.io reliable delivery vì WebSocket TCP bảo đảm&quot;</span><span class="lz-lnote">SAI. TCP bảo đảm TRONG connection. Nếu connection break, packet trong-flight MẤT. Reconnect KHÔNG replay. Bài 6.1</span></div>
<div class="lz-layer"><span class="lz-lname">TRỰC GIÁC: &quot;disconnect nghĩa là user offline&quot;</span><span class="lz-lnote">SAI. User có thể mở 3 tab — đóng 1 tab không offline. Cần reference counting (Set&lt;socketId&gt; per userId). Bài 4.3</span></div>
<div class="lz-layer"><span class="lz-lname">TRỰC GIÁC: &quot;Redis adapter thay sticky sessions&quot;</span><span class="lz-lnote">SAI. Adapter broadcast cross-worker. Sticky routes polling. Hai vấn đề khác nhau. Bài 2.3</span></div>
<div class="lz-layer"><span class="lz-lname">TRỰC GIÁC: &quot;stream video qua socket.io emit binary&quot;</span><span class="lz-lnote">SAI, và đắt. Cost 8 Mbps qua server + latency 100-500ms + không có jitter buffer. WebRTC là answer. Bài 7.1</span></div>
</div>

<h3>Một phép đo tôi ĐÃ LÀM SAI</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Bài 0.2 &quot;133×&quot;</span><span class="lz-nsub">ước lượng too simple</span></span>
<span class="lz-nbody">Tôi tính bằng phép nhân đơn giản (800 byte header / 6 byte WS frame = 133) mà không đo. Bài 2.1 chạy probe thật: ở TẦNG socket.io giống nhau, overhead ở HTTP header. Con số &quot;133×&quot; ĐÚNG chiều nhưng SAI cơ chế. Giữ lại trong khoá học vì bài học &quot;số phải có phép đo đi kèm&quot; đáng ghi.</span>
</div>
</div>

<div class="callout ok">
<p><strong>Giữ lỗi của tôi trong khoá là cố ý.</strong> Mọi engineer đo lường sai lúc nào đó. Học cách vấp là học cách không vấp nữa. Bài 2.1 tài liệu chính xác lỗi tôi làm và cách sửa.</p>
</div>

<h3>Cách dùng bảng ba cột ở kho CỦA BẠN</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Cột A áp thẳng</span><span class="lz-d">Không cần đo. Nếu socket.io 4.x vẫn là công cụ, mọi câu trong cột A đúng.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Cột B đo lại</span><span class="lz-d">Chạy probe của Chương 0-9 trên kho bạn. Số bạn khác, nhưng nguyên tắc thường giống.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Cột C là danh sách kiểm khi hoài nghi</span><span class="lz-d">Trước khi viết PR dựa trên trực giác về socket.io, đối chiếu cột C. Nếu match, đo lại.</span></div>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Tám điều trong cột A là quy luật socket.io áp cho mọi kho; năm điều trong cột B là phép đo của kho này bạn phải chạy lại; sáu điều trong cột C là trực giác thua đo lường — bao gồm một lỗi ước lượng của tôi ở bài 0.2 mà bài 2.1 sửa và giữ lại làm bài học.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO documentation</span><span class="lc-sub">socket.io/docs/v4 — nguồn chính cho cột A.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1</span>
<h2>Cái SỐNG QUA đo lường</h2>
<p class="lead">Mười chương tạo ra con số, pattern, và claim. Một số đúng ở mọi socket.io project. Một số là property của KHO NÀY. Một số là thứ tôi tin từ đầu mà đo lường chứng minh sai. Bài này sắp mọi thứ vào ba cột đó.</p>

<h3>Cột A — LUÔN ĐÚNG</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Socket.IO là 4 tầng</span><span class="lz-lnote">Wire → engine.io → socket.io → your code. Mọi bug diagnose theo tầng. Bài 0.1</span></div>
<div class="lz-layer"><span class="lz-lname">Client luôn bắt đầu bằng polling</span><span class="lz-lnote">Sau đó upgrade WebSocket nếu proxy cho phép. Thứ tự <code>transports: [...]</code> là permission, không thứ tự. Bài 0.2</span></div>
<div class="lz-layer"><span class="lz-lname">Two sids: engine.io ≠ socket.io</span><span class="lz-lnote">socket.id vs socket.conn.id. Một engine.io connection nuôi nhiều namespace. Bài 0.3</span></div>
<div class="lz-layer"><span class="lz-lname">Default là at-most-once</span><span class="lz-lnote">Emit fire-and-forget. Không exception khi packet mất. Bài 6.1</span></div>
<div class="lz-layer"><span class="lz-lname">io.to(A).to(B) là intersection</span><span class="lz-lnote">Cần cả A VÀ B. Dùng <code>[A, B]</code> cho union. Bài 3.1</span></div>
<div class="lz-layer"><span class="lz-lname">Sid đổi ở reconnect</span><span class="lz-lnote">Track state theo userId, không socket.id. Bài 1.3 + 1.5</span></div>
<div class="lz-layer"><span class="lz-lname">Redis adapter ≠ sticky sessions</span><span class="lz-lnote">Cluster cần CẢ HAI. Adapter broadcast cross-worker, sticky routes polling to same worker. Bài 2.3 + 5.1</span></div>
<div class="lz-layer"><span class="lz-lname">WebRTC media KHÔNG qua socket.io</span><span class="lz-lnote">Socket.io chỉ signalling (2 KB, 5-20 packets). Media qua RTP/UDP P2P. Bài 7.1</span></div>
</div>

<h3>Cột B — CHỈ ĐÚNG KHI ĐO</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Kho này: pingInterval 25s, pingTimeout 60s</span><span class="lz-lnote">Kho khác đặt khác. Đo lại; nguyên tắc &quot;pingInterval &lt; proxy_read_timeout&quot; luôn đúng. Bài 2.2</span></div>
<div class="lz-layer"><span class="lz-lname">Audience trung bình 30 (friends + thread peers)</span><span class="lz-lnote">Kho khác sẽ khác — có thể 5 (tight-knit app) hoặc 300 (open social). Nhưng nguyên tắc emitPresenceTo(audience) thay io.emit luôn đúng. Bài 4.1</span></div>
<div class="lz-layer"><span class="lz-lname">Kho có 3 WS servers</span><span class="lz-lnote">socket.io + Hocuspocus + raw ws. Đo trên kho bạn — có thể chỉ 1 (đủ) hoặc 5 (thừa)</span></div>
<div class="lz-layer"><span class="lz-lname">device.gateway.ts 1.035 dòng</span><span class="lz-lnote">Kho không có device sẽ khác. Nếu có, cost ~1000 dòng để bridge raw ws + socket.io là hợp lý. Bài 9.1</span></div>
<div class="lz-layer"><span class="lz-lname">Handshake 26ms + 9ms cho connect</span><span class="lz-lnote">Latency phụ thuộc network. VN → SG data center thường 30-100ms. Local sandbox nhanh hơn</span></div>
</div>

<h3>Cột C — LUÔN SAI (trực giác vs đo lường)</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">TRỰC GIÁC: &quot;transport array quyết thứ tự thử&quot;</span><span class="lz-lnote">SAI. Client luôn bắt đầu polling bất kể thứ tự array. Array chỉ khai báo cái được PHÉP. Bài 0.2</span></div>
<div class="lz-layer"><span class="lz-lname">TRỰC GIÁC: &quot;polling nặng hơn WebSocket 133×&quot;</span><span class="lz-lnote">SAI OVER-SIMPLIFICATION. Ở TẦNG socket.io, giống nhau. Overhead thật ở HTTP header per poll cycle, 2.7-133× tuỳ burstiness. Bài 2.1 sửa lại 0.2</span></div>
<div class="lz-layer"><span class="lz-lname">TRỰC GIÁC: &quot;socket.io reliable delivery vì WebSocket TCP bảo đảm&quot;</span><span class="lz-lnote">SAI. TCP bảo đảm TRONG connection. Nếu connection break, packet trong-flight MẤT. Reconnect KHÔNG replay. Bài 6.1</span></div>
<div class="lz-layer"><span class="lz-lname">TRỰC GIÁC: &quot;disconnect nghĩa là user offline&quot;</span><span class="lz-lnote">SAI. User có thể mở 3 tab — đóng 1 tab không offline. Cần reference counting (Set&lt;socketId&gt; per userId). Bài 4.3</span></div>
<div class="lz-layer"><span class="lz-lname">TRỰC GIÁC: &quot;Redis adapter thay sticky sessions&quot;</span><span class="lz-lnote">SAI. Adapter broadcast cross-worker. Sticky routes polling. Hai vấn đề khác nhau. Bài 2.3</span></div>
<div class="lz-layer"><span class="lz-lname">TRỰC GIÁC: &quot;stream video qua socket.io emit binary&quot;</span><span class="lz-lnote">SAI, và đắt. Cost 8 Mbps qua server + latency 100-500ms + không có jitter buffer. WebRTC là answer. Bài 7.1</span></div>
</div>

<h3>Một phép đo tôi ĐÃ LÀM SAI</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Bài 0.2 &quot;133×&quot;</span><span class="lz-nsub">ước lượng quá đơn giản</span></span>
<span class="lz-nbody">Tôi tính bằng phép nhân đơn giản (800 byte header / 6 byte WS frame = 133) mà không đo. Bài 2.1 chạy probe thật: ở TẦNG socket.io giống nhau, overhead ở HTTP header. Con số &quot;133×&quot; ĐÚNG chiều nhưng SAI cơ chế. Giữ lại trong khoá học vì bài học &quot;số phải có phép đo đi kèm&quot; đáng ghi.</span>
</div>
</div>

<div class="callout ok">
<p><strong>Giữ lỗi của tôi trong khoá là cố ý.</strong> Mọi engineer đo lường sai lúc nào đó. Học cách vấp là học cách không vấp nữa. Bài 2.1 tài liệu chính xác lỗi tôi làm và cách sửa.</p>
</div>

<h3>Cách dùng bảng ba cột ở kho CỦA BẠN</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Cột A áp thẳng</span><span class="lz-d">Không cần đo. Nếu socket.io 4.x vẫn là công cụ, mọi câu trong cột A đúng.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Cột B đo lại</span><span class="lz-d">Chạy probe của Chương 0-9 trên kho bạn. Số bạn khác, nhưng nguyên tắc thường giống.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Cột C là danh sách kiểm khi hoài nghi</span><span class="lz-d">Trước khi viết PR dựa trên trực giác về socket.io, đối chiếu cột C. Nếu match, đo lại.</span></div>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Tám điều trong cột A là quy luật socket.io áp cho mọi kho; năm điều trong cột B là phép đo của kho này bạn phải chạy lại; sáu điều trong cột C là trực giác thua đo lường — bao gồm một lỗi ước lượng của tôi ở bài 0.2 mà bài 2.1 sửa và giữ lại làm bài học.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Socket.IO documentation</span><span class="lc-sub">socket.io/docs/v4 — nguồn chính cho cột A.</span></span></div>
</div>
`,
    },

    {
      title: '11.2 — Final exam|||11.2 — Đề thi cuối',
      slug: 'io-11-2-de-thi',
      type: 'QUIZ',
      description: 'Mười hai câu, mười tám phút. Rút từ mười chương đầu — sáu câu cơ chế (cột A), bốn câu đo lường (cột B), hai câu trực giác thua đo (cột C).',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Final exam</span>
<h2>Mười hai câu, mười tám phút</h2>
<p class="lead">Đề thi cuối rút từ mười chương đầu theo tỉ lệ cột A / B / C. Không câu nào lặp; mọi câu đều xoay quanh một quyết định thật.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Đề thi cuối</span>
<h2>Mười hai câu, mười tám phút</h2>
<p class="lead">Đề thi cuối rút từ mười chương đầu theo tỉ lệ cột A / B / C. Không câu nào lặp; mọi câu đều xoay quanh một quyết định thật.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 1080,
        questions: [
          {
            question: 'You see raw wire frame <code>42[&quot;chat:msg&quot;,{}]</code>. Which layer emits each digit?|||Bạn thấy raw wire frame <code>42[&quot;chat:msg&quot;,{}]</code>. Tầng nào phát mỗi chữ số?',
            options: [
              'The first &quot;4&quot; is engine.io MESSAGE (layer 2), second &quot;2&quot; is socket.io EVENT (layer 3), JSON is layer-4 event name + args|||Số &quot;4&quot; đầu là engine.io MESSAGE (tầng 2), &quot;2&quot; sau là socket.io EVENT (tầng 3), JSON là tên event + args ở tầng 4',
              '&quot;42&quot; là engine.io type &quot;event&quot;|||&quot;42&quot; là engine.io type &quot;event&quot;',
              '&quot;4&quot; là HTTP status|||&quot;4&quot; là HTTP status',
              '&quot;42&quot; là message ID counter|||&quot;42&quot; là message ID counter',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Config: <code>transports: [&quot;websocket&quot;, &quot;polling&quot;]</code>. Which transport does client try first?|||Config: <code>transports: [&quot;websocket&quot;, &quot;polling&quot;]</code>. Client thử transport nào trước?',
            options: [
              'Polling always — client starts polling, upgrades to WebSocket if allowed. Array declares what\'s PERMITTED, not order|||Polling luôn — client bắt đầu polling, upgrade WebSocket nếu cho phép. Array khai báo cái ĐƯỢC PHÉP, không thứ tự',
              'WebSocket, listed first|||WebSocket, listed đầu',
              'Both concurrently|||Cả hai đồng thời',
              'Depends on network|||Phụ thuộc network',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: '<code>socket.id</code> and <code>socket.conn.id</code> differ. Why?|||<code>socket.id</code> và <code>socket.conn.id</code> khác. Vì sao?',
            options: [
              '<code>socket.id</code> is the socket.io namespace sid (layer 3); <code>socket.conn.id</code> is the engine.io connection sid (layer 2). One connection can host multiple namespaces|||<code>socket.id</code> là sid namespace socket.io (tầng 3); <code>socket.conn.id</code> là sid connection engine.io (tầng 2). Một connection nuôi nhiều namespace',
              'Bug — should be equal|||Bug — phải bằng',
              'Both engine.io sids at different times|||Cả hai engine.io sid thời điểm khác',
              'Random UUIDs|||UUID ngẫu nhiên',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Server <code>emit</code> to client. Client disconnects 100ms later. What happens?|||Server <code>emit</code> tới client. Client disconnect 100ms sau. Chuyện gì?',
            options: [
              'Message is LOST silently. Socket.io is at-most-once by default. No exception, no reconnect replay|||Message MẤT âm thầm. Socket.io mặc định at-most-once. Không exception, reconnect không replay',
              'Message queues and delivers on reconnect|||Message xếp hàng và deliver khi reconnect',
              'Server throws exception|||Server throw exception',
              'Message stored in Redis|||Message lưu Redis',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: '<code>io.to(&quot;A&quot;).to(&quot;B&quot;).emit(&quot;x&quot;)</code> semantics?|||<code>io.to(&quot;A&quot;).to(&quot;B&quot;).emit(&quot;x&quot;)</code> semantics?',
            options: [
              'INTERSECTION — sockets in BOTH A AND B receive. For UNION (A OR B), use <code>io.to([A, B])</code>|||INTERSECTION — socket trong CẢ A VÀ B nhận. Cho UNION (A HOẶC B), dùng <code>io.to([A, B])</code>',
              'UNION|||UNION',
              'Only A|||Chỉ A',
              'Only B|||Chỉ B',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'After reconnect, <code>socket.id</code> changes. Where should you track state?|||Sau reconnect, <code>socket.id</code> đổi. State track ở đâu?',
            options: [
              'Track state by <code>userId</code>, not <code>socket.id</code> — sid changes at every reconnect; userId survives|||Track state theo <code>userId</code>, không <code>socket.id</code> — sid đổi mỗi reconnect; userId sống sót',
              'By socket.id|||Theo socket.id',
              'Not needed|||Không cần',
              'Automatically|||Tự động',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: '4-worker cluster, no sticky sessions. What happens to polling clients?|||Cluster 4 worker, không sticky. Polling client bị gì?',
            options: [
              '75% of follow-up requests hit workers that don\'t know the sid → HTTP 400 &quot;Session ID unknown&quot;. Fix: <code>hash $cookie_io</code> in nginx|||75% request tiếp theo hit worker không biết sid → HTTP 400 &quot;Session ID unknown&quot;. Fix: <code>hash $cookie_io</code> ở nginx',
              'Nothing — Redis adapter handles it|||Không gì — Redis adapter xử lý',
              'Nginx retries|||Nginx retry',
              'Clients auto-pick correct worker|||Client tự chọn đúng worker',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Naive <code>io.emit(&quot;presence:update&quot;)</code> during deploy reconnect storm at N=10.000. Cost?|||<code>io.emit(&quot;presence:update&quot;)</code> ngây thơ khi deploy reconnect storm ở N=10.000. Cost?',
            options: [
              'O(N²) = 100M packets in seconds — server dead. Fix: <code>emitPresenceTo(audience)</code> to friends+peers only, ~333× reduction (audience ~30)|||O(N²) = 100M packets trong vài giây — server dead. Fix: <code>emitPresenceTo(audience)</code> chỉ đến friends+peers, giảm ~333× (audience ~30)',
              'O(N) = 10K packets — fine|||O(N) = 10K packets — OK',
              'O(1) — socket.io batches|||O(1) — socket.io batch',
              'Depends on Redis|||Phụ thuộc Redis',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Payment via socket.io emit. What&#39;s the risk?|||Payment qua socket.io emit. Nguy cơ?',
            options: [
              'Emit fail or ack timeout → retry may double-charge. Payments should use HTTP POST with Idempotency-Key — mature tooling, retry-safe|||Emit fail hoặc ack timeout → retry có thể charge hai lần. Payment nên dùng HTTP POST với Idempotency-Key — tooling chín, retry-safe',
              'No risk — socket.io more reliable|||Không nguy cơ — socket.io tin cậy hơn',
              'Payment requires WebSocket|||Payment cần WebSocket',
              'Socket.io encrypts payment|||Socket.io encrypt payment',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Video call — how does media travel?|||Video call — media đi thế nào?',
            options: [
              'Peer-to-peer via WebRTC (RTP/UDP direct); socket.io only relays SDP+ICE signalling (5-20 packets, ~2 KB total)|||Peer-to-peer qua WebRTC (RTP/UDP direct); socket.io chỉ relay SDP+ICE signalling (5-20 packets, ~2 KB total)',
              'Through socket.io as binary emit|||Qua socket.io dạng binary emit',
              'Through Kafka|||Qua Kafka',
              'Via HTTP long-polling|||Qua HTTP long-polling',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Group video call 4 peers via P2P mesh. What breaks?|||Group video call 4 peer qua P2P mesh. Cái gì vỡ?',
            options: [
              'Each peer uploads to 3 others = ~3 Mbps + 12 connections. Consumer internet can\'t. Fix: SFU (mediasoup, LiveKit, Janus)|||Mỗi peer upload 3 stream = ~3 Mbps + 12 connection. Consumer internet không chịu. Fix: SFU (mediasoup, LiveKit, Janus)',
              'Nothing — mesh scales infinite|||Không gì — mesh scale vô hạn',
              'Socket.io has peer limit|||Socket.io có peer limit',
              'WebRTC only supports 1-on-1|||WebRTC chỉ 1-on-1',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: '&quot;Client not receiving events&quot;. First diagnostic step?|||&quot;Client không nhận events&quot;. Bước diagnostic đầu?',
            options: [
              'Q1: Is client connected? DevTools Network → WS tab for 101 status. If Q1 fails, Q2-Q4 don\'t apply|||Q1: Client có connected? DevTools Network → WS tab status 101. Nếu Q1 fail, Q2-Q4 không apply',
              'console.log everywhere|||console.log khắp nơi',
              'Rewrite the feature|||Viết lại feature',
              'Ask user to reinstall|||Bảo user cài lại',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },

  ],
};
