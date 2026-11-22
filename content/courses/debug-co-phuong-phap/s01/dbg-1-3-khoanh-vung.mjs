/**
 * 1.3 — Khoanh vùng (soạn 22/11/2026). Output chạy THẬT /tmp/dbg-lab/ch1/1-3 (Node v26.8.1, curl 8.7.1, cổng 127.0.0.1:18130).
 * Phát hiện lúc chạy: JSON.stringify in Date và chuỗi GIỐNG HỆT nhau — chỉ typeof lộ khác biệt ⇒ đưa vào bài làm bẫy.
 */
import { nguon, lienKet } from '../_chung.mjs';

const MA = `<pre><code class="language-js">// server.js — lab-room booking API: route → service → repo. A bug is planted somewhere.
const http = require('node:http');

// ---- repo layer (fake database) ----
const BANG_DAT_LICH = [
  { id: 1, phong: 'Lab 401', batDau: new Date('2026-11-23T01:00:00Z') },
  { id: 2, phong: 'Lab 402', batDau: new Date('2026-11-23T03:00:00Z') },
  { id: 3, phong: 'Lab 403', batDau: '2026-11-23T05:00:00Z' },          // row imported from an old file
  { id: 4, phong: 'Lab 404', batDau: new Date('2026-11-24T01:00:00Z') },
];
const repo = { timTheoId: (id) =&gt; BANG_DAT_LICH.find((b) =&gt; b.id === id) };

// ---- service layer ----
const service = {
  chiTiet(id) {
    const b = repo.timTheoId(id);
    if (!b) return null;
    return { id: b.id, phong: b.phong, ngay: b.batDau.toISOString().slice(0, 10) };
  },
};

// ---- route layer ----
http.createServer((req, res) =&gt; {
  const m = req.url.match(/^\\/api\\/dat-lich\\/(\\d+)$/);
  if (!m) { res.writeHead(404); return res.end(); }
  try {
    const kq = service.chiTiet(Number(m[1]));
    if (!kq) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(kq));
  } catch {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ loi: 'Internal Server Error' }));   // swallows the details
  }
}).listen(18130, '127.0.0.1', () =&gt; console.log('API chạy ở http://127.0.0.1:18130'));</code></pre>`;

const OUT_CURL = `<div class="out">$ curl -s -i http://127.0.0.1:18130/api/dat-lich/3
HTTP/1.1 500 Internal Server Error
Content-Type: application/json
Date: Sun, 22 Nov 2026 14:11:46 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Transfer-Encoding: chunked

{"loi":"Internal Server Error"}</div>`;

const OUT_ID = `<div class="out">$ for id in 1 2 3 4 5; do printf "id=%s -&gt; %s\\n" $id "&#36;(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:18130/api/dat-lich/$id)"; done
id=1 -&gt; 200
id=2 -&gt; 200
id=3 -&gt; 500
id=4 -&gt; 200
id=5 -&gt; 404
$ cat server.log
API chạy ở http://127.0.0.1:18130</div>`;

const MA_RAO = `<pre><code class="language-js">// server-rao.js — the same server with four fences (temporary lines, removed after)
    console.log('[rào 0] route nhận id =', m[1]);
    const kq = service.chiTiet(Number(m[1]));
    console.log('[rào 2] service → route:', JSON.stringify(kq));
…
    const b = repo.timTheoId(id);
    console.log('[rào 1] repo → service:', JSON.stringify(b), '| typeof batDau =', typeof b?.batDau);
…
  } catch (err) {
    console.error('[rào 3] lỗi bị bắt ở route:', err);</code></pre>`;

const OUT_RAO = `<div class="out">$ curl -s http://127.0.0.1:18130/api/dat-lich/2 &gt;/dev/null; curl -s http://127.0.0.1:18130/api/dat-lich/3 &gt;/dev/null
$ cat rao.log
API chạy ở http://127.0.0.1:18130
[rào 0] route nhận id = 2
[rào 1] repo → service: {"id":2,"phong":"Lab 402","batDau":"2026-11-23T03:00:00.000Z"} | typeof batDau = object
[rào 2] service → route: {"id":2,"phong":"Lab 402","ngay":"2026-11-23"}
[rào 0] route nhận id = 3
[rào 1] repo → service: {"id":3,"phong":"Lab 403","batDau":"2026-11-23T05:00:00Z"} | typeof batDau = string
[rào 3] lỗi bị bắt ở route: TypeError: b.batDau.toISOString is not a function
    at Object.chiTiet (/private/tmp/dbg-lab/ch1/1-3/server-rao.js:19:55)
    at Server.&lt;anonymous&gt; (/private/tmp/dbg-lab/ch1/1-3/server-rao.js:29:24)
    at Server.emit (node:events:514:20)
…</div>`;

const NGUON = [
  nguon('📘', 'Google SRE Book — Effective Troubleshooting: "Diagnose"', 'Chia đôi hệ thống (bisection) và hỏi "nó đang làm gì, ở đâu, vì sao".', 'https://sre.google/sre-book/effective-troubleshooting/'),
  lienKet({ khoa: 'observability-monitoring', bai: 'obs-3-1-id-di-den-hu-vo', title: 'Observability Ch3 — một id đi theo request qua mọi tầng', sub: 'Khi hệ thống có nhiều dịch vụ, "rào" ở mỗi ranh giới chính là log có correlation ID.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '1.3 — Isolating: binary search across layers, code and data|||1.3 — Khoanh vùng: chia đôi theo tầng, theo code, theo dữ liệu',
  slug: 'dbg-1-3-khoanh-vung',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Khoanh một lỗi 500 xuống đúng một hàm và một bản ghi: chia theo tầng (client → route → service → repo), dựng "rào" (wolf fence) ở mỗi ranh giới, chia đôi dữ liệu theo id; bẫy JSON.stringify che mất kiểu Date; comment-out và tắt bớt tính năng. Chạy thật bằng curl.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>Do not search the whole house — find the room, then the drawer</h2>
<p class="lead">Once a bug reproduces, the question is <em>where</em>. A request crosses a browser, a network, a route, a service and a database; the bug lives at exactly one place where a correct value turns into a wrong one. Isolating means cutting the path in half again and again until only that place is left. This lesson does it on a real HTTP 500 that hides its own error message.</p>

<h3>An everyday picture: no water from the tap</h3>
<p>The kitchen tap is dry. You do not dismantle the tap first. You check the bathroom tap (is it the whole house or just the kitchen?), then the water meter outside (is it the building or your flat?). Each check cuts the possible places in half. In software the "checks" are <strong>fences</strong> at layer boundaries: is the value still correct here?</p>

<h3>Three ways to halve</h3>
<table>
<thead><tr><th>Halve by…</th><th>How</th><th>Tool</th></tr></thead>
<tbody>
<tr><td>Layer</td><td>Browser → API → service → database: which layer first holds a wrong value?</td><td>curl (bypass the browser), logs at boundaries</td></tr>
<tr><td>Code</td><td>A fence in the middle of a long function; comment out half; switch a feature off</td><td>Temporary log lines, feature flags, debugger (Ch3–4)</td></tr>
<tr><td>Data</td><td>Which inputs fail? Halve the input set</td><td>Loops over ids, the shrinking script from 1.2</td></tr>
</tbody>
</table>
<p>The name "wolf fence" comes from a 1982 joke about catching a wolf in Alaska: build a fence across the middle, see which side the wolf howls from, build another fence on that side, and repeat. Each fence halves the area.</p>

<h3>The situation: a booking detail page returns 500</h3>
<p>A teammate says: "The booking detail page is broken." That is a symptom at the browser layer. Here is the API behind it — three layers in one file so you can see them (<code>~/dbg-lab/ch1/1-3/server.js</code>):</p>
${MA}

<h3>Step 1 — halve by layer: take the browser out</h3>
<p>Call the API directly with curl. If curl also fails, the browser, the front-end code and CORS are all ruled out in one command:</p>
${OUT_CURL}
<p>The server answered (so DNS, network and the process are fine) with 500 — the bug is <strong>inside</strong> the server. But the body says nothing useful: the <code>catch</code> block swallows the error. That is extremely common in real projects (and on purpose: Chapter 2.5 shows why details must not go to the client). So we need evidence from inside.</p>

<h3>Step 2 — halve by data: which ids fail?</h3>
${OUT_ID}
<p>Only id 3 fails; 5 is a normal 404 (does not exist). And the server log is empty — no error was ever logged. We have narrowed the input to one record, but not yet the code.</p>

<h3>Step 3 — halve by code: fences at the boundaries</h3>
<p>Put one temporary log line at each boundary: the route receives the id (fence 0), the repo hands a row to the service (fence 1), the service returns to the route (fence 2), and the catch finally <em>logs</em> what it catches (fence 3):</p>
${MA_RAO}
${OUT_RAO}
<p>Read it as a fence walk. For id 2 every fence passes. For id 3, fence 0 and fence 1 are passed, fence 2 never prints, and fence 3 shows the cause: <code>b.batDau.toISOString is not a function</code> at line 19 — inside <code>service.chiTiet</code>. And fence 1 already shows why: <code>typeof batDau = string</code>. The row from the old import stores the start time as text, not as a <code>Date</code>.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>JSON.stringify</code> hides the type.</strong> Look at fence 1 again: for id 2 (a real <code>Date</code>) and id 3 (a string), the JSON looks the same — both are quoted text, because <code>JSON.stringify</code> turns a <code>Date</code> into its ISO string. Only <code>typeof</code> told them apart. When a fence prints values, also print the <em>types</em>.</p></div>
<p>Now the location is one function and one record, and the hypothesis writes itself: "rows imported from the old file store <code>batDau</code> as a string; the service assumes a Date." The root-cause fix belongs in the repo layer (convert on the way in: <code>new Date(b.batDau)</code>, or repair the imported data), not a <code>try/catch</code> in the service. Afterwards, <strong>remove the fence lines</strong> — but keep fence 3's idea: a <code>catch</code> that logs the error on the server.</p>

<h3>Other ways to cut</h3>
<ul>
<li><strong>Comment out / short-circuit:</strong> return a hard-coded value from the service; if the 500 disappears, the bug is in the service or below.</li>
<li><strong>Switch features off:</strong> disable caching, a middleware, a new flag — one at a time.</li>
<li><strong>Swap a layer:</strong> point the API at a known-good copy of the data; if it works, the code is fine and the data is the suspect.</li>
</ul>

<h3>🧪 Practice (20 min) — fence your way to the line</h3>
<div class="callout ok">
<ol>
<li>Type <code>server.js</code>, start it with <code>node server.js</code> (port 18130, bound to 127.0.0.1 only), and reproduce the 500 with curl.</li>
<li>Without reading the code for the answer, add only fence 0 and fence 2. Which one prints for id 3, which does not? Write what that proves.</li>
<li>Add fence 1 printing <code>JSON.stringify(b)</code> only — then add <code>typeof b?.batDau</code>. Note what changed in what you could see.</li>
<li>Fix the cause in the repo layer, remove the fences, keep a catch that logs <code>err</code>. All four ids must return 200.</li>
</ol>
<p><strong>Done when:</strong> your log names the layer (service), the line (the <code>toISOString</code> call) and the data (id 3, string), and <code>curl</code> returns 200 for ids 1–4 and 404 for 5.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">isolate</span><span class="v">Narrow down where correct becomes wrong.</span></div>
  <div class="kv"><span class="k">layer</span><span class="v">One part of the path: browser, route, service, repository, database.</span></div>
  <div class="kv"><span class="k">wolf fence</span><span class="v">A check placed in the middle of the search area to halve it.</span></div>
  <div class="kv"><span class="k">swallowed error</span><span class="v">A catch that hides the error and logs nothing.</span></div>
  <div class="kv"><span class="k">HTTP 500</span><span class="v">The server got the request and failed internally.</span></div>
  <div class="kv"><span class="k">typeof</span><span class="v">JavaScript operator that returns the type name of a value.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Isolating is halving: by layer, by code, by data.</li>
<li>curl removes the browser from the question in one command.</li>
<li>Fences at layer boundaries show the first place a value goes wrong; print types, not only values.</li>
<li><code>JSON.stringify</code> prints a <code>Date</code> and a string the same way.</li>
<li>Fix where the wrong value enters (here: the repo/data), then remove the fences — but keep a catch that logs.</li>
</ul>
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>Đừng lục cả nhà — tìm đúng phòng, rồi đúng ngăn kéo</h2>
<p class="lead">Khi lỗi đã tái hiện được, câu hỏi là <em>ở đâu</em>. Một request đi qua trình duyệt, mạng, route, service và cơ sở dữ liệu; lỗi nằm đúng ở một chỗ nơi giá trị đúng biến thành sai. Khoanh vùng (isolate) là cắt đôi con đường đó hết lần này tới lần khác cho tới khi chỉ còn lại chỗ đó. Bài này làm điều đó trên một lỗi HTTP 500 thật, loại lỗi giấu luôn thông báo của chính nó.</p>

<h3>Liên tưởng đời thường: vòi nước không chảy</h3>
<p>Vòi bếp khô. Bạn không tháo vòi bếp trước. Bạn mở vòi nhà tắm (cả nhà mất nước hay chỉ bếp?), rồi nhìn đồng hồ nước ngoài cửa (cả toà nhà hay chỉ căn hộ mình?). Mỗi lần kiểm cắt đôi số chỗ có thể hỏng. Trong phần mềm, "lần kiểm" là những <strong>hàng rào</strong> đặt ở ranh giới các tầng: tới đây giá trị còn đúng không?</p>

<h3>Ba cách chia đôi</h3>
<table>
<thead><tr><th>Chia theo…</th><th>Cách làm</th><th>Công cụ</th></tr></thead>
<tbody>
<tr><td>Tầng</td><td>Trình duyệt → API → service → CSDL: tầng nào giữ giá trị sai đầu tiên?</td><td>curl (bỏ qua trình duyệt), log ở ranh giới</td></tr>
<tr><td>Code</td><td>Đặt rào giữa một hàm dài; comment bỏ một nửa; tắt một tính năng</td><td>Dòng log tạm, feature flag, debugger (Ch3–4)</td></tr>
<tr><td>Dữ liệu</td><td>Đầu vào nào hỏng? Chia đôi tập đầu vào</td><td>Vòng lặp qua các id, script thu nhỏ ở bài 1.2</td></tr>
</tbody>
</table>
<p>Tên "wolf fence" (rào bắt sói) đến từ một câu đùa năm 1982 về cách bắt sói ở Alaska: dựng một hàng rào ngang giữa vùng, nghe sói tru ở bên nào, dựng tiếp một rào ở bên đó, lặp lại. Mỗi hàng rào chia đôi diện tích.</p>

<h3>Tình huống: trang chi tiết đặt lịch trả 500</h3>
<p>Bạn cùng nhóm nói: "Trang chi tiết đặt lịch hỏng rồi." Đó là triệu chứng ở tầng trình duyệt. Đây là API phía sau — ba tầng gói trong một tệp cho dễ nhìn (<code>~/dbg-lab/ch1/1-3/server.js</code>):</p>
${MA}

<h3>Bước 1 — chia theo tầng: bỏ trình duyệt ra</h3>
<p>Gọi thẳng API bằng curl. Nếu curl cũng hỏng thì trình duyệt, code front-end và CORS đều bị loại chỉ trong một lệnh:</p>
${OUT_CURL}
<p>Server có trả lời (nên DNS, mạng và tiến trình đều ổn) bằng 500 — lỗi nằm <strong>bên trong</strong> server. Nhưng phần thân chẳng nói gì: khối <code>catch</code> nuốt mất lỗi. Chuyện này cực kỳ hay gặp ở dự án thật (và có chủ đích: bài 2.5 cho thấy vì sao không được gửi chi tiết lỗi về client). Vậy ta cần bằng chứng từ bên trong.</p>

<h3>Bước 2 — chia theo dữ liệu: id nào hỏng?</h3>
${OUT_ID}
<p>Chỉ id 3 hỏng; id 5 là 404 bình thường (không tồn tại). Và log server trống trơn — chưa từng có lỗi nào được ghi. Ta đã thu đầu vào về một bản ghi, nhưng chưa thu được code.</p>

<h3>Bước 3 — chia theo code: rào ở các ranh giới</h3>
<p>Đặt một dòng log tạm ở mỗi ranh giới: route nhận id (rào 0), repo trao bản ghi cho service (rào 1), service trả về cho route (rào 2), và catch cuối cùng cũng <em>ghi log</em> thứ nó bắt được (rào 3):</p>
${MA_RAO}
${OUT_RAO}
<p>Đọc nó như đi qua từng hàng rào. Với id 2, rào nào cũng qua. Với id 3, qua rào 0 và rào 1, rào 2 không bao giờ in, và rào 3 cho thấy nguyên nhân: <code>b.batDau.toISOString is not a function</code> ở dòng 19 — bên trong <code>service.chiTiet</code>. Và rào 1 đã cho thấy vì sao: <code>typeof batDau = string</code>. Bản ghi nhập từ tệp cũ lưu giờ bắt đầu dạng chữ, không phải <code>Date</code>.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>JSON.stringify</code> giấu mất kiểu.</strong> Nhìn lại rào 1: với id 2 (một <code>Date</code> thật) và id 3 (một chuỗi), JSON trông như nhau — đều là chữ trong nháy, vì <code>JSON.stringify</code> biến <code>Date</code> thành chuỗi ISO. Chỉ <code>typeof</code> phân biệt được. Khi rào in giá trị, in luôn cả <em>kiểu</em>.</p></div>
<p>Giờ vùng nghi chỉ còn một hàm và một bản ghi, và giả thuyết gần như tự viết ra: "bản ghi nhập từ tệp cũ lưu <code>batDau</code> dạng chuỗi; service lại giả định là Date." Bản sửa gốc thuộc tầng repo (chuyển kiểu ngay khi đọc vào: <code>new Date(b.batDau)</code>, hoặc sửa lại dữ liệu đã nhập), không phải một <code>try/catch</code> trong service. Xong việc thì <strong>xoá các dòng rào</strong> — nhưng giữ lại ý của rào 3: một <code>catch</code> có ghi lỗi ra log phía server.</p>

<h3>Những cách cắt khác</h3>
<ul>
<li><strong>Comment bỏ / chặn tắt:</strong> cho service trả về một giá trị viết cứng; nếu 500 biến mất thì lỗi nằm trong service hoặc tầng dưới.</li>
<li><strong>Tắt bớt tính năng:</strong> tắt cache, một middleware, một cờ mới — mỗi lần một cái.</li>
<li><strong>Thay một tầng:</strong> trỏ API vào một bản dữ liệu biết chắc là tốt; nếu chạy thì code ổn, dữ liệu là nghi phạm.</li>
</ul>

<h3>🧪 Thực hành (20 phút) — dựng rào để tới đúng dòng</h3>
<div class="callout ok">
<ol>
<li>Gõ <code>server.js</code>, chạy bằng <code>node server.js</code> (cổng 18130, chỉ mở trên 127.0.0.1), tái hiện lỗi 500 bằng curl.</li>
<li>Không đọc code để tìm đáp án, chỉ thêm rào 0 và rào 2. Với id 3, rào nào in, rào nào không? Ghi lại điều đó chứng minh gì.</li>
<li>Thêm rào 1 chỉ in <code>JSON.stringify(b)</code> — rồi thêm <code>typeof b?.batDau</code>. Ghi lại bạn thấy thêm được gì.</li>
<li>Sửa nguyên nhân ở tầng repo, xoá các rào, giữ một catch có ghi <code>err</code>. Cả bốn id phải trả 200.</li>
</ol>
<p><strong>Đạt khi:</strong> nhật ký gọi đúng tầng (service), dòng (lời gọi <code>toISOString</code>) và dữ liệu (id 3, chuỗi), và <code>curl</code> trả 200 cho id 1–4, 404 cho id 5.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">isolate (khoanh vùng)</span><span class="v">Thu hẹp chỗ đúng biến thành sai.</span></div>
  <div class="kv"><span class="k">layer (tầng)</span><span class="v">Một đoạn trên đường đi: trình duyệt, route, service, repository, CSDL.</span></div>
  <div class="kv"><span class="k">wolf fence (rào bắt sói)</span><span class="v">Một phép kiểm đặt giữa vùng tìm để chia đôi nó.</span></div>
  <div class="kv"><span class="k">swallowed error (lỗi bị nuốt)</span><span class="v">Catch giấu lỗi đi và không ghi gì.</span></div>
  <div class="kv"><span class="k">HTTP 500</span><span class="v">Server đã nhận request và hỏng ở bên trong.</span></div>
  <div class="kv"><span class="k">typeof</span><span class="v">Toán tử JavaScript trả về tên kiểu của một giá trị.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Khoanh vùng là chia đôi: theo tầng, theo code, theo dữ liệu.</li>
<li>curl loại trình duyệt khỏi câu hỏi chỉ với một lệnh.</li>
<li>Rào ở ranh giới tầng cho thấy chỗ đầu tiên giá trị bị sai; in cả kiểu, không chỉ giá trị.</li>
<li><code>JSON.stringify</code> in một <code>Date</code> và một chuỗi giống hệt nhau.</li>
<li>Sửa ở chỗ giá trị sai đi vào (ở đây: repo/dữ liệu), rồi xoá rào — nhưng giữ một catch có ghi log.</li>
</ul>
${NGUON}
</div>
`,
};
