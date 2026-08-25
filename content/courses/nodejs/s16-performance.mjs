/**
 * Node.js — Chương 16: Hiệu năng.
 * Mọi output là đo thật: Node v22.21.0 (máy 10 nhân, 32GB), express 5.2.1,
 * compression 1.9.1, pg 8.16.3, fast-json-stringify 6.0.1, autocannon 8.0.0,
 * PostgreSQL 16 (local :5433, bảng notes 50.000 dòng).
 * Phần production lấy từ chính repo và VPS của cuongthai.com.
 */
const REF = '?ref=%2Fcourses%2Fnodejs%2Flearn&reflabel=Node.js';

export default {
  title: 'Chapter 16 — Performance|||Chương 16 — Hiệu năng',
  description: 'Đi từ 285 lên 3.550 request mỗi giây trên cùng một route mà không đổi thư viện nào, phát hiện 97,8% thời gian nằm ở chỗ không ai ngờ, và tại sao mức nén cao nhất của brotli vừa chậm hơn 490 lần vừa cho ra file TO HƠN.',
  lessons: [
    /* ─────────────────────────── 16.1 ─────────────────────────── */
    {
      title: '16.1 — Profile first: 285 to 3.550 req/s on one route|||16.1 — Đo trước đã: từ 285 lên 3.550 req/giây trên một route',
      slug: 'nodejs-16-1-do-truoc-khi-doan',
      type: 'VIDEO',
      description: 'Bật --cpu-prof trên một route chậm thật, đọc bảng hàm tốn CPU, rồi sửa bốn bước — mỗi bước đo lại — để thấy tăng gấp 11,6 lần mà không thay một thư viện nào.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.1</span>
<h2>Profile first: 285 to 3.550 req/s on one route</h2>
<p class="lead">Every developer has an instinct about what is slow in their code. That instinct is wrong often enough that acting on it is a bad habit — you spend a day rewriting the part you suspected, ship it, and the graph does not move. This chapter is built on the opposite discipline: measure, find the actual hot path, fix that, measure again. This lesson does one full lap of that loop on a route that starts at 285 requests per second.</p>

<h3>The patient</h3>
<p>A perfectly ordinary listing endpoint. Nothing in it looks alarming:</p>

<pre><code>function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function renderNote(n) {
  return {
    ...n,
    slug: slugify(n.title),
    excerpt: n.body.slice(0, 100),
    etag: crypto.createHash('sha256').update(JSON.stringify(n)).digest('hex'),
  };
}

app.get('/notes', (req, res) =&gt; {
  res.json({ items: NOTES.map(renderNote) });        // 500 ghi chú
});</code></pre>

<div class="out">TRƯỚC khi tối ưu: 285 req/giây  p50 65ms  p97.5 130ms  99,3MB/giây</div>

<p>Sixty-five milliseconds to return a list. Now, before guessing: what would you have rewritten? The regex? The spread? Most people say the regex. The profile says otherwise.</p>

<h3>Taking a CPU profile without installing anything</h3>
<p>Node has a built-in profiler. One flag, and on clean exit it writes a <code>.cpuprofile</code> file you can open in Chrome DevTools — or parse yourself, which is what the table below does:</p>

<pre><code>node --cpu-prof --cpu-prof-dir=./prof server.mjs
# drive load through it, then let the process exit NORMALLY (SIGKILL leaves no file)</code></pre>

<div class="out">tổng thời gian lấy mẫu: 6636ms, 4257 mẫu, 862 node

  %CPU   thời gian  hàm                              file:dòng
   22.4%     1489ms  (idle)                           :0
   16.9%     1119ms  stringify                        response.js:1029
   15.9%     1058ms  renderNote                       e1-profile.mjs:17
    7.4%      494ms  update                           node:internal/crypto/hash:132
    5.0%      332ms  utf8Write                        node:internal/buffer:1054
    3.7%      246ms  (garbage collector)              :0
    3.7%      244ms  update                           node:internal/crypto/hash:132
    3.3%      216ms  slugify                          e1-profile.mjs:13
    2.8%      189ms  Hash                             node:internal/crypto/hash:88
    2.8%      188ms  digest                           node:internal/crypto/hash:150
    1.5%       97ms  writev                           :0
    0.5%       31ms  RegExp: [^a-z0-9]+               :0</div>

<p>Read the bottom line first: <strong>the regex everyone suspects is 0,5% of the CPU.</strong> Rewriting it perfectly would have bought half a percent. The real costs are elsewhere:</p>

<div class="kv-grid">
  <div class="kv"><span>stringify — 16,9%</span><b>Express serialising a 365KB response. This cost scales DIRECTLY with payload size</b></div>
  <div class="kv"><span>renderNote — 15,9%</span><b>Building 500 fresh objects on EVERY request for data that never changes</b></div>
  <div class="kv"><span>crypto hash — 14,5%</span><b>Four lines summed: update 7.4 + 3.7, Hash 2.8, digest 2.8. One line of code written "to defeat caching"</b></div>
  <div class="kv"><span>garbage collector — 3,7%</span><b>A consequence, not a cause: 500 objects of garbage per request means somebody has to collect them</b></div>
</div>

<div class="callout">
<p><strong>What "(idle)" at 22,4% means.</strong> It is the profiler recording that the CPU had nothing to do — waiting on the network, on the client, on I/O. A healthy I/O-bound service shows a <em>lot</em> of idle. Idle at 22% under full load means this route is CPU-bound: the machine is genuinely busy computing, which is exactly the condition where optimising code (rather than adding machines) pays off.</p>
</div>

<h3>Four fixes, measured one at a time</h3>
<p>The profile points at a single theme: <strong>work being redone on every request for data that never changes.</strong> Fix it in four steps, benchmarking after each:</p>

<div class="out">bước tối ưu                                req/giây   p50    p97.5   cỡ phản hồi
1. nguyên bản                                  305   60ms   120ms   365.593 B
2. tính SẴN renderNote một lần                 662   28ms    56ms   365.593 B
3. tuần tự hoá SẴN for chuỗi                1.270   14ms    29ms   365.593 B
4. chỉ trả các trường client thật sự cần      3.550    5ms    10ms    86.683 B</div>

<p><strong>11,6× faster. Zero libraries changed, zero infrastructure added.</strong> Each step is worth understanding separately, because each represents a different general principle.</p>

<p><strong>Step 2 — precompute (2,2×).</strong> <code>NOTES</code> is static, so <code>renderNote</code> produces the identical result forever. Running it once at startup and reusing the array removes <code>renderNote</code> and <code>crypto</code> — about 30% of the profile — outright:</p>
<pre><code>const PRECOMPUTED = NOTES.map(renderNote);           // một lần, lúc khởi động
app.get('/notes', (req, res) =&gt; res.json({ items: PRECOMPUTED }));</code></pre>

<p><strong>Step 3 — pre-serialise (1,9× more).</strong> If the object never changes, neither does its JSON. <code>res.json()</code> calls <code>JSON.stringify</code> on every request; do it once instead:</p>
<pre><code>const BODY = JSON.stringify({ items: PRECOMPUTED });
app.get('/notes', (req, res) =&gt; { res.type('json'); res.send(BODY); });</code></pre>
<p>That removed the 16,9% <code>stringify</code> line and nearly doubled throughput — a bigger win than the first fix, from a change that touches two lines.</p>

<p><strong>Step 4 — send less (2,8× more).</strong> The response was 365KB, most of it a <code>body</code> field and a <code>etag</code> hash that the list view never displays. Sending only what the client renders drops it to 86KB:</p>

<div class="out">365.593 B → 86.683 B   (nhỏ hơn 4,2 lần)
1.270 req/giây → 3.550 req/giây</div>

<p>This is the single most reliable optimisation in web development and it is almost never listed as one: <strong>the cheapest byte is the one you do not send.</strong> It helps the server (less serialisation, less writev), the network (less bandwidth), and the client (less parsing) at the same time.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">Đo mốc</span><span class="lz-d">autocannon, recording req/s and p97.5. Without a baseline you can prove nothing</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">Take a profile</span><span class="lz-d"><code>--cpu-prof</code> UNDER LOAD, not at rest. An idle profile is nothing but (idle)</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">Fix EXACTLY ONE thing</span><span class="lz-d">whatever sits at the top of the table. Fix two at once and you cannot tell which one worked</span></div>
  <div class="lz-step"><span class="lz-n">4</span><span class="lz-t">Đo lại</span><span class="lz-d">if nothing moves, REVERT. More complex code that is no faster is a net loss</span></div>
  <div class="lz-step"><span class="lz-n">5</span><span class="lz-t">Repeat</span><span class="lz-d">profile again — the bottleneck has MOVED. The old table no longer holds</span></div>
</div>

<h3>Benchmarking without fooling yourself</h3>
<p>The numbers above are only worth anything if the measurement is honest. Four rules that produce comparable results:</p>

<div class="kv-grid">
  <div class="kv"><span>Warm it up first</span><b>V8 interprets before it JIT-compiles. The first few hundred requests are 5-10× slower — discard them</b></div>
  <div class="kv"><span>Đo p97.5, đừng đo trung bình</span><b>An average is skewed by one 8-second request without anyone noticing; a percentile is not</b></div>
  <div class="kv"><span>Client and server on DIFFERENT machines</span><b>autocannon consumes real CPU. On the same box the two fight over cores and every number comes out low</b></div>
  <div class="kv"><span>Change EXACTLY ONE variable</span><b>Same data, same connection count, same duration. Change two and the result means nothing</b></div>
</div>

<div class="pitfall">
<p><strong>A real trap:</strong> <code>--cpu-prof</code> writes the file when the process exits <em>normally</em>. Kill it with <code>SIGKILL</code> (or <code>pkill -9</code>) and the profile directory is empty — which looks exactly like "profiling did not work". Send <code>SIGTERM</code> and handle it, or call <code>process.exit(0)</code>. This cost twenty minutes while writing this lesson.</p>
</div>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> The pattern in step 2 is already in production here, under a different name: chapter 12's Redis cache is precomputation with a TTL instead of a startup constant. The measured 120× gap between a <code>GROUP BY</code> over 500.000 rows (48,04ms) and a Redis <code>GET</code> (0,40ms) is the same trade this lesson makes — do the work once, serve the result many times. Step 4 is the one this codebase has <em>not</em> systematically applied: several list endpoints still return full row objects where the front end renders four fields, which is where an easy 3× is sitting unclaimed.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-324"><span class="lc-t">Code Lab · Performance, Caching, and Scaling</span><span class="lc-d">Profiling and optimising a Node backend</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/observability-monitoring${REF}#module-988"><span class="lc-t">Code Lab · Performance Monitoring &amp; Tracing</span><span class="lc-d">Finding the hot path with real data</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.1</span>
<h2>Đo trước đã: từ 285 lên 3.550 request/giây trên một route</h2>
<p class="lead">Lập trình viên nào cũng có trực giác về chỗ nào trong code mình là chậm. Trực giác ấy sai đủ thường xuyên để việc làm theo nó trở thành một thói quen xấu — bạn bỏ ra một ngày viết lại đúng cái phần mình nghi ngờ, đưa lên, và biểu đồ không nhúc nhích. Chương này dựng trên kỷ luật ngược lại: <em>đo, tìm đường nóng thật, sửa đúng chỗ đó, rồi đo lại</em>. Bài này chạy trọn một vòng như vậy trên một route bắt đầu ở 285 request mỗi giây.</p>

<h3>Bệnh nhân</h3>
<p>Một endpoint danh sách hoàn toàn bình thường. Không có gì trong đó trông đáng báo động cả:</p>

<pre><code>function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function renderNote(n) {
  return {
    ...n,
    slug: slugify(n.title),
    excerpt: n.body.slice(0, 100),
    etag: crypto.createHash('sha256').update(JSON.stringify(n)).digest('hex'),
  };
}

app.get('/notes', (req, res) =&gt; {
  res.json({ items: NOTES.map(renderNote) });        // 500 ghi chú
});</code></pre>

<div class="out">TRƯỚC khi tối ưu: 285 req/giây  p50 65ms  p97.5 130ms  99,3MB/giây</div>

<p>Sáu mươi lăm mili-giây để trả về một cái danh sách. Bây giờ, trước khi đoán: <em>bạn sẽ viết lại phần nào?</em> Cái regex? Phép spread? Phần lớn mọi người nói regex. Profile nói khác.</p>

<h3>Lấy CPU profile mà không cần cài gì</h3>
<p>Node có sẵn bộ đo hiệu năng. Một cờ, và khi tiến trình thoát bình thường nó ghi ra một file <code>.cpuprofile</code> mở được bằng Chrome DevTools — hoặc tự phân tích, đó là cách bảng dưới đây được lập:</p>

<pre><code>node --cpu-prof --cpu-prof-dir=./prof server.mjs
# chạy tải vào nó, rồi cho tiến trình thoát BÌNH THƯỜNG (SIGKILL thì không có file)</code></pre>

<div class="out">tổng thời gian lấy mẫu: 6636ms, 4257 mẫu, 862 node

  %CPU   thời gian  hàm                              file:dòng
   22.4%     1489ms  (idle)                           :0
   16.9%     1119ms  stringify                        response.js:1029
   15.9%     1058ms  renderNote                       e1-profile.mjs:17
    7.4%      494ms  update                           node:internal/crypto/hash:132
    5.0%      332ms  utf8Write                        node:internal/buffer:1054
    3.7%      246ms  (garbage collector)              :0
    3.7%      244ms  update                           node:internal/crypto/hash:132
    3.3%      216ms  slugify                          e1-profile.mjs:13
    2.8%      189ms  Hash                             node:internal/crypto/hash:88
    2.8%      188ms  digest                           node:internal/crypto/hash:150
    1.5%       97ms  writev                           :0
    0.5%       31ms  RegExp: [^a-z0-9]+               :0</div>

<p>Đọc dòng cuối trước: <strong>cái regex mà ai cũng nghi ngờ chiếm 0,5% CPU.</strong> Viết lại nó hoàn hảo thì mua được nửa phần trăm. Chi phí thật nằm chỗ khác:</p>

<div class="kv-grid">
  <div class="kv"><span>stringify — 16,9%</span><b>Express tuần tự hoá phản hồi 365KB. Chi phí này tỉ lệ THẲNG với cỡ payload</b></div>
  <div class="kv"><span>renderNote — 15,9%</span><b>Dựng 500 object mới ở MỖI request cho dữ liệu không hề đổi</b></div>
  <div class="kv"><span>băm crypto — 14,5%</span><b>Cộng 4 dòng: update 7,4 + 3,7, Hash 2,8, digest 2,8. Một dòng code "để chống cache"</b></div>
  <div class="kv"><span>garbage collector — 3,7%</span><b>Hệ quả chứ không phải nguyên nhân: đẻ 500 object rác mỗi request thì phải có ai đó dọn</b></div>
</div>

<div class="callout">
<p><strong>"(idle)" 22,4% nghĩa là gì.</strong> Đó là lúc bộ đo ghi nhận CPU không có việc gì làm — đang chờ mạng, chờ client, chờ I/O. Một dịch vụ khoẻ mạnh nghẽn ở I/O sẽ có <em>rất nhiều</em> idle. Idle chỉ 22% khi đang chịu tải đầy nghĩa là route này nghẽn ở CPU: cái máy thật sự đang bận tính toán, đúng cái điều kiện mà tối ưu code (thay vì mua thêm máy) có lời.</p>
</div>

<h3>Bốn phép sửa, đo từng cái một</h3>
<p>Profile chỉ vào đúng một chủ đề: <strong>công việc bị làm lại ở mọi request cho một dữ liệu không bao giờ đổi.</strong> Sửa nó theo bốn bước, đo lại sau mỗi bước:</p>

<div class="out">bước tối ưu                                req/giây   p50    p97.5   cỡ phản hồi
1. nguyên bản                                  305   60ms   120ms   365.593 B
2. tính SẴN renderNote một lần                 662   28ms    56ms   365.593 B
3. tuần tự hoá SẴN thành chuỗi                1.270   14ms    29ms   365.593 B
4. chỉ trả các trường client thật sự cần      3.550    5ms    10ms    86.683 B</div>

<p><strong>Nhanh gấp 11,6 lần. Không đổi thư viện nào, không thêm hạ tầng nào.</strong> Mỗi bước đáng hiểu riêng, vì mỗi bước đại diện cho một nguyên tắc tổng quát khác nhau.</p>

<p><strong>Bước 2 — tính sẵn (2,2×).</strong> <code>NOTES</code> là dữ liệu tĩnh, nên <code>renderNote</code> cho ra kết quả y hệt nhau mãi mãi. Chạy nó một lần lúc khởi động rồi dùng lại mảng ấy xoá thẳng <code>renderNote</code> và <code>crypto</code> — khoảng 30% của profile:</p>
<pre><code>const PRECOMPUTED = NOTES.map(renderNote);           // một lần, lúc khởi động
app.get('/notes', (req, res) =&gt; res.json({ items: PRECOMPUTED }));</code></pre>

<p><strong>Bước 3 — tuần tự hoá sẵn (thêm 1,9×).</strong> Nếu object không bao giờ đổi thì JSON của nó cũng vậy. <code>res.json()</code> gọi <code>JSON.stringify</code> ở mọi request; hãy làm việc đó đúng một lần:</p>
<pre><code>const BODY = JSON.stringify({ items: PRECOMPUTED });
app.get('/notes', (req, res) =&gt; { res.type('json'); res.send(BODY); });</code></pre>
<p>Bước này xoá dòng <code>stringify</code> 16,9% và làm throughput tăng gần gấp đôi — thắng lớn hơn cả phép sửa đầu tiên, từ một thay đổi chạm vào hai dòng code.</p>

<p><strong>Bước 4 — gửi ít đi (thêm 2,8×).</strong> Phản hồi nặng 365KB, phần lớn là trường <code>body</code> và cái băm <code>etag</code> mà màn hình danh sách không bao giờ hiển thị. Chỉ gửi thứ client thật sự vẽ ra thì còn 86KB:</p>

<div class="out">365.593 B → 86.683 B   (nhỏ hơn 4,2 lần)
1.270 req/giây → 3.550 req/giây</div>

<p>Đây là phép tối ưu đáng tin cậy nhất trong lập trình web và gần như không bao giờ được liệt kê ra: <strong>byte rẻ nhất là byte bạn không gửi.</strong> Nó giúp máy chủ (ít tuần tự hoá, ít writev), giúp đường truyền (ít băng thông), và giúp client (ít phải phân tích) cùng một lúc.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">Đo mốc</span><span class="lz-d">autocannon, ghi lại req/giây và p97.5. Không có mốc thì không chứng minh được gì</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">Lấy profile</span><span class="lz-d"><code>--cpu-prof</code> DƯỚI TẢI, không phải lúc rảnh. Profile lúc rảnh chỉ toàn (idle)</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">Sửa ĐÚNG MỘT thứ</span><span class="lz-d">thứ đứng đầu bảng. Sửa hai thứ cùng lúc thì không biết cái nào ăn</span></div>
  <div class="lz-step"><span class="lz-n">4</span><span class="lz-t">Đo lại</span><span class="lz-d">nếu không nhúc nhích thì HOÀN TÁC. Code phức tạp hơn mà không nhanh hơn là lỗ ròng</span></div>
  <div class="lz-step"><span class="lz-n">5</span><span class="lz-t">Lặp lại</span><span class="lz-d">profile lại — nút thắt đã DI CHUYỂN. Bảng cũ không còn đúng nữa</span></div>
</div>

<h3>Đo tải mà không tự lừa mình</h3>
<p>Những con số ở trên chỉ có giá trị nếu phép đo trung thực. Bốn quy tắc cho ra kết quả so sánh được với nhau:</p>

<div class="kv-grid">
  <div class="kv"><span>Làm nóng trước</span><b>V8 thông dịch trước rồi mới biên dịch JIT. Vài trăm request đầu chậm hơn 5-10 lần — bỏ chúng đi</b></div>
  <div class="kv"><span>Đo p97.5, đừng đo trung bình</span><b>Trung bình bị một request 8 giây kéo lệch mà không ai thấy; phân vị thì không</b></div>
  <div class="kv"><span>Client và server KHÁC máy</span><b>autocannon ăn CPU thật. Chạy chung máy = hai bên tranh nhau nhân CPU, số nào cũng thấp</b></div>
  <div class="kv"><span>Đổi ĐÚNG MỘT biến</span><b>Cùng dữ liệu, cùng số kết nối, cùng thời lượng. Đổi hai thứ thì kết quả vô nghĩa</b></div>
</div>

<div class="pitfall">
<p><strong>Bẫy thật:</strong> <code>--cpu-prof</code> chỉ ghi file khi tiến trình thoát <em>bình thường</em>. Giết nó bằng <code>SIGKILL</code> (hay <code>pkill -9</code>) thì thư mục profile rỗng trơn — trông y hệt như "bộ đo không chạy". Hãy gửi <code>SIGTERM</code> và bắt tín hiệu đó, hoặc gọi <code>process.exit(0)</code>. Cái này ngốn hai mươi phút lúc soạn bài.</p>
</div>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Khuôn mẫu ở bước 2 đã có sẵn trong production tại đây dưới một cái tên khác: cache Redis của chương 12 chính là tính-sẵn kèm TTL thay vì một hằng số lúc khởi động. Khoảng cách 120 lần đã đo được giữa một câu <code>GROUP BY</code> trên 500.000 dòng (48,04ms) và một lệnh <code>GET</code> của Redis (0,40ms) là cùng một phép đánh đổi mà bài này thực hiện — làm một lần, phục vụ nhiều lần. Bước 4 mới là thứ codebase này <em>chưa</em> áp dụng có hệ thống: nhiều endpoint danh sách vẫn trả về nguyên object của dòng dữ liệu trong khi front-end chỉ vẽ bốn trường, và đó là chỗ có sẵn 3 lần tốc độ chưa ai nhặt.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-324"><span class="lc-t">Code Lab · Performance, Caching, and Scaling</span><span class="lc-d">Đo và tối ưu một backend Node</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/observability-monitoring${REF}#module-988"><span class="lc-t">Code Lab · Performance Monitoring &amp; Tracing</span><span class="lc-d">Tìm đường nóng bằng dữ liệu thật</span></a>
</div>
</div>
`,
    },
    /* ─────────────────────────── 16.2 ─────────────────────────── */
    {
      title: '16.2 — Where the time really goes: 97,8% in one line|||16.2 — Thời gian thật sự nằm ở đâu: 97,8% trong một dòng',
      slug: 'nodejs-16-2-nut-that-that-su',
      type: 'VIDEO',
      description: 'Bấm giờ từng đoạn của một route thật rồi phát hiện 97,8% nằm ở truy vấn DB — trong khi chính PostgreSQL chỉ mất 0,03ms. Phần còn lại là hàng đợi, và đó là một luật chứ không phải một lỗi.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.2</span>
<h2>Where the time really goes: 97,8% in one line</h2>
<p class="lead">The previous lesson optimised a route with no database. Real routes have one, and that changes the arithmetic completely — so completely that most JavaScript-level optimisation becomes irrelevant. This lesson measures the breakdown of a realistic endpoint, and then measures <em>inside</em> the piece that turns out to matter, where the answer is genuinely surprising.</p>

<h3>Timing the parts</h3>
<p>An ordinary route: query 100 notes, map them into a response shape, serialise. Three <code>process.hrtime.bigint()</code> readings, accumulated across 11.743 requests under load:</p>

<div class="out">TẢI: 1.954 req/giây, p50 9ms, p97.5 16ms

PHÂN RÃ trung bình mỗi request (11.743 request):
  truy vấn DB        5,174ms   97,8%
  biến đổi trong JS  0,071ms    1,3%
  JSON.stringify     0,043ms    0,8%
  TỔNG đo được       5,288ms</div>

<div class="danger">
<p><strong>97,8% against 2,1%.</strong> Every JavaScript optimisation available — a faster serialiser, a leaner map, avoiding a spread — is competing for a share of 0,114ms out of 5,288ms. Make the JavaScript <em>infinitely</em> fast, meaning zero, and this route goes from 1.954 to about 1.996 requests per second. That is the entire ceiling of code-level tuning here: <strong>2%</strong>. Anyone optimising this route by rewriting the mapping function is working on the wrong 2%.</p>
</div>

<h3>The obvious fix, and its measured result</h3>
<p>So attack the database. The query selects a <code>body</code> column of 400 bytes per row that gets truncated to 100 characters anyway. Push the truncation into SQL so 30KB less crosses the wire:</p>

<pre><code>-- trước
SELECT id, author_id, title, body, created_at FROM notes ORDER BY id DESC LIMIT 100
-- sau
SELECT id, author_id, title, left(body,100) AS body, created_at FROM notes ORDER BY id DESC LIMIT 100</code></pre>

<div class="out">TRƯỚC: 1.954 req/giây   DB 5,174ms
SAU:   1.980 req/giây   DB 5,107ms</div>

<p>A 1,3% improvement. The obvious fix did essentially nothing, which means the model of the problem was wrong. Time to look inside that 5,1ms.</p>

<h3>What PostgreSQL says it costs</h3>
<pre><code>EXPLAIN (ANALYZE, BUFFERS)
SELECT id, author_id, title, body, created_at FROM notes ORDER BY id DESC LIMIT 100;</code></pre>

<div class="out">Limit  (cost=0.29..6.24 rows=100 width=234) (actual time=0.012..0.030 rows=100 loops=1)
  Buffers: shared hit=6
  -&gt;  Index Scan Backward using notes_pkey on notes
        (actual time=0.011..0.021 rows=100 loops=1)
        Buffers: shared hit=6</div>

<div class="danger">
<p><strong>0,030 milliseconds.</strong> The database engine does the work in thirty microseconds, reading six pages, all of them already in memory. The application measured 5.107 microseconds for the same query — <strong>170× more</strong>. So 99,4% of what the application calls "database time" is <em>not the database</em>. Where is it?</p>
</div>

<h3>Splitting the wait from the work</h3>
<p>The answer is in a line most code never times. <code>pool.query()</code> does two things: it waits for a free connection, then it runs the query. Time them separately, at five different pool sizes, always with 20 concurrent requests:</p>

<div class="out">pool max  đồng thời  req/giây   p50    p97.5   CHỜ pool    TRUY VẤN thật
   1         20        1.154   16ms    27ms   16,125ms      0,741ms
   5         20        2.865    6ms    12ms    3,701ms      1,652ms
  10         20        2.935    6ms    12ms    0,516ms      2,995ms
  25         20        2.808    6ms    12ms    0,092ms      3,539ms
  50         20        2.747    6ms    13ms    0,071ms      3,655ms</div>

<p>Three things fall out of that table, and together they are one of the most useful models in backend engineering.</p>

<p><strong>One: with a pool of 1, 96% of "database time" is queueing.</strong> 16,125ms waiting for a connection, 0,741ms actually querying. The database was never busy. Twenty requests were standing in line for one door.</p>

<p><strong>Two: the queue does not disappear, it moves.</strong> As the pool grows, the wait collapses (16,1 → 0,07ms) but the query time <em>rises</em> (0,74 → 3,66ms). The total barely changes. You did not remove the contention; you relocated it from your process into PostgreSQL, which now has fifty sessions competing for the same CPUs and buffers.</p>

<p><strong>Three: more connections eventually makes things worse.</strong> Throughput peaks at 2.935 with ten and falls to 2.747 with fifty. Past the point where the database saturates, each extra connection adds scheduling overhead and takes away from every other connection.</p>

<div class="callout">
<p><strong>The law behind the table.</strong> Little's Law: <em>concurrency = throughput × latency</em>. With a fixed service capacity, adding parallel requests cannot increase throughput — it only increases how many are waiting, and therefore latency. This is why "just raise <code>max</code>" is not a fix, and why the right pool size is roughly the number of queries your database can genuinely run at once — usually a small multiple of its CPU count, not a number picked to look generous.</p>
</div>

<h3>The corrected mental model</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-t">Your queue (the pool)</span><span class="lz-d">requests waiting their turn for a connection. Measured by <code>pool.waitingCount</code>. This is where the time sits when the pool is too SMALL</span></div>
  <div class="lz-layer"><span class="lz-t">Network round trip plus protocol</span><span class="lz-d">serialising the query, sending, receiving, parsing the result. This is the part <code>pg</code> does and that <code>EXPLAIN</code> does NOT see</span></div>
  <div class="lz-layer"><span class="lz-t">PostgreSQL's queue</span><span class="lz-d">sessions fighting over CPU, buffers and locks. This is where the time moves to when the pool is too LARGE</span></div>
  <div class="lz-layer"><span class="lz-t">The actual work</span><span class="lz-d">0.030ms. The only thing <code>EXPLAIN ANALYZE</code> measures, and the smallest part of all</span></div>
</div>

<p>The practical consequence: <strong><code>EXPLAIN ANALYZE</code> being fast does not mean your query is fast.</strong> It means the plan is good. A perfectly planned query can still cost 5ms in production because of everything wrapped around it, and no amount of index tuning will touch that.</p>

<h3>What to do about it, in order</h3>
<div class="kv-grid">
  <div class="kv"><span>Reduce the number of queries</span><b>N+1 (chapter 7): 51 queries → 2 is 5.6×. No amount of pool tuning makes that up</b></div>
  <div class="kv"><span>Size the pool CORRECTLY</span><b>Too small means queueing at your end, too large means queueing at the DB. Measure both sides before choosing</b></div>
  <div class="kv"><span>Stop querying altogether</span><b>Cache (chapter 12). The fastest query is the one that never happens</b></div>
  <div class="kv"><span>Push work out of the request</span><b>Queues (chapter 13). The user does not need to wait for the email to be sent</b></div>
  <div class="kv"><span>Only then optimise the JavaScript</span><b>2% in this example. Useful, but do it LAST</b></div>
</div>

<div class="pitfall">
<p><strong>A real trap:</strong> instrumenting only <code>pool.query()</code> hides the entire story — it reports one number that silently mixes queueing with querying, and the two respond to opposite fixes. Time <code>pool.connect()</code> separately, or export <code>pool.waitingCount</code> as a gauge (chapter 15). A rising <code>waitingCount</code> means "raise the pool"; a flat <code>waitingCount</code> with rising query time means "the database is the limit, stop raising the pool".</p>
</div>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> The production numbers from chapter 7 are the same shape: a fresh connection per query cost 8,03ms against 0,38ms for a reused one — <strong>21×</strong> — and twenty queries of 100ms each took 2160ms with a pool of 1 versus 132ms with a pool of 20. That project also hit the other end of the curve: twelve Prisma clients × pool 10 = 120 connections against a <code>max_connections</code> of 100, producing <code>53300 sorry, too many clients already</code>. Both failure modes, on the same system, six months apart. The lesson from this chapter is that they are the <em>same</em> failure — a queue in the wrong place — and only measuring both halves tells you which one you have.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-322"><span class="lc-t">Code Lab · Database Integration and Data Modeling</span><span class="lc-d">Pools, queries and where latency hides</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-324"><span class="lc-t">Code Lab · Performance, Caching, and Scaling</span><span class="lc-d">Removing queries instead of speeding them up</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.2</span>
<h2>Thời gian thật sự nằm ở đâu: 97,8% trong một dòng</h2>
<p class="lead">Bài trước tối ưu một route không có cơ sở dữ liệu. Route thật thì có, và điều đó thay đổi hoàn toàn phép tính — thay đổi tới mức phần lớn việc tối ưu ở tầng JavaScript trở nên không liên quan. Bài này đo phân rã của một endpoint sát thực tế, rồi đo <em>bên trong</em> cái mảnh hoá ra mới quan trọng, nơi câu trả lời thật sự gây bất ngờ.</p>

<h3>Bấm giờ từng phần</h3>
<p>Một route bình thường: truy vấn 100 ghi chú, biến đổi thành hình dạng phản hồi, tuần tự hoá. Ba mốc <code>process.hrtime.bigint()</code>, cộng dồn qua 11.743 request dưới tải:</p>

<div class="out">TẢI: 1.954 req/giây, p50 9ms, p97.5 16ms

PHÂN RÃ trung bình mỗi request (11.743 request):
  truy vấn DB        5,174ms   97,8%
  biến đổi trong JS  0,071ms    1,3%
  JSON.stringify     0,043ms    0,8%
  TỔNG đo được       5,288ms</div>

<div class="danger">
<p><strong>97,8% chọi 2,1%.</strong> Mọi phép tối ưu JavaScript có thể nghĩ ra — một bộ tuần tự hoá nhanh hơn, một phép map gọn hơn, tránh dùng spread — đều đang tranh nhau một phần của 0,114ms trên tổng 5,288ms. Giả sử làm cho JavaScript nhanh <em>vô hạn</em>, tức bằng 0, thì route này đi từ 1.954 lên khoảng 1.996 request mỗi giây. Đó là toàn bộ trần của việc tinh chỉnh ở tầng code tại đây: <strong>2%</strong>. Ai tối ưu route này bằng cách viết lại hàm biến đổi thì đang làm việc trên nhầm 2%.</p>
</div>

<h3>Phép sửa hiển nhiên, và kết quả đo được của nó</h3>
<p>Vậy thì tấn công vào cơ sở dữ liệu. Câu truy vấn lấy cột <code>body</code> 400 byte mỗi dòng rồi dù sao cũng cắt còn 100 ký tự. Đẩy phép cắt xuống SQL để bớt 30KB đi qua dây:</p>

<pre><code>-- trước
SELECT id, author_id, title, body, created_at FROM notes ORDER BY id DESC LIMIT 100
-- sau
SELECT id, author_id, title, left(body,100) AS body, created_at FROM notes ORDER BY id DESC LIMIT 100</code></pre>

<div class="out">TRƯỚC: 1.954 req/giây   DB 5,174ms
SAU:   1.980 req/giây   DB 5,107ms</div>

<p>Cải thiện 1,3%. Phép sửa hiển nhiên gần như không làm gì cả, nghĩa là mô hình về vấn đề đã sai. Đến lúc nhìn vào bên trong 5,1ms ấy.</p>

<h3>PostgreSQL nói nó tốn bao nhiêu</h3>
<pre><code>EXPLAIN (ANALYZE, BUFFERS)
SELECT id, author_id, title, body, created_at FROM notes ORDER BY id DESC LIMIT 100;</code></pre>

<div class="out">Limit  (cost=0.29..6.24 rows=100 width=234) (actual time=0.012..0.030 rows=100 loops=1)
  Buffers: shared hit=6
  -&gt;  Index Scan Backward using notes_pkey on notes
        (actual time=0.011..0.021 rows=100 loops=1)
        Buffers: shared hit=6</div>

<div class="danger">
<p><strong>0,030 mili-giây.</strong> Máy cơ sở dữ liệu làm xong việc trong ba mươi micro-giây, đọc sáu trang, tất cả đều đã nằm sẵn trong bộ nhớ. Ứng dụng thì đo được 5.107 micro-giây cho cùng câu truy vấn đó — <strong>gấp 170 lần</strong>. Vậy 99,4% cái mà ứng dụng gọi là "thời gian database" <em>không phải là database</em>. Nó ở đâu?</p>
</div>

<h3>Tách phần CHỜ ra khỏi phần LÀM</h3>
<p>Câu trả lời nằm ở một dòng mà hầu như không code nào bấm giờ. <code>pool.query()</code> làm hai việc: chờ một kết nối rảnh, rồi mới chạy truy vấn. Bấm giờ riêng từng phần, ở năm cỡ pool khác nhau, luôn với 20 request đồng thời:</p>

<div class="out">pool max  đồng thời  req/giây   p50    p97.5   CHỜ pool    TRUY VẤN thật
   1         20        1.154   16ms    27ms   16,125ms      0,741ms
   5         20        2.865    6ms    12ms    3,701ms      1,652ms
  10         20        2.935    6ms    12ms    0,516ms      2,995ms
  25         20        2.808    6ms    12ms    0,092ms      3,539ms
  50         20        2.747    6ms    13ms    0,071ms      3,655ms</div>

<p>Ba điều rút ra từ bảng đó, và gộp lại chúng là một trong những mô hình hữu dụng nhất của nghề backend.</p>

<p><strong>Một: với pool bằng 1, 96% "thời gian database" là XẾP HÀNG.</strong> 16,125ms chờ một kết nối, 0,741ms thật sự truy vấn. Cơ sở dữ liệu chưa bao giờ bận. Hai mươi request đang xếp hàng trước một cái cửa.</p>

<p><strong>Hai: hàng đợi không biến mất, nó DI CHUYỂN.</strong> Khi pool to ra, phần chờ sụp xuống (16,1 → 0,07ms) nhưng thời gian truy vấn <em>tăng lên</em> (0,74 → 3,66ms). Tổng gần như không đổi. Bạn không xoá được sự tranh chấp; bạn dời nó từ tiến trình của mình sang PostgreSQL, nơi giờ có năm mươi phiên tranh nhau cùng bấy nhiêu CPU và bộ đệm.</p>

<p><strong>Ba: thêm kết nối tới một lúc nào đó làm mọi thứ TỆ ĐI.</strong> Throughput đạt đỉnh 2.935 ở mức mười và tụt còn 2.747 ở mức năm mươi. Vượt qua điểm cơ sở dữ liệu bão hoà, mỗi kết nối thêm vào chỉ cộng thêm chi phí điều phối và lấy bớt phần của mọi kết nối khác.</p>

<div class="callout">
<p><strong>Cái luật đứng sau bảng đó.</strong> Định luật Little: <em>độ đồng thời = throughput × độ trễ</em>. Với một năng lực phục vụ cố định, thêm request song song <em>không thể</em> làm tăng throughput — nó chỉ làm tăng số lượng đang chờ, và do đó tăng độ trễ. Đó là lý do "cứ nâng <code>max</code> lên" không phải một phép sửa, và lý do cỡ pool đúng xấp xỉ bằng số truy vấn mà cơ sở dữ liệu của bạn thật sự chạy nổi cùng lúc — thường là một bội số nhỏ của số nhân CPU của nó, chứ không phải một con số chọn cho hào phóng.</p>
</div>

<h3>Mô hình tư duy đã được sửa lại</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-t">Hàng đợi của bạn (pool)</span><span class="lz-d">request chờ tới lượt có kết nối. Đo bằng <code>pool.waitingCount</code>. Đây là nơi thời gian nằm khi pool quá NHỎ</span></div>
  <div class="lz-layer"><span class="lz-t">Vòng đi-về mạng + giao thức</span><span class="lz-d">tuần tự hoá truy vấn, gửi, nhận, phân tích kết quả. Đây là phần <code>pg</code> làm và <code>EXPLAIN</code> KHÔNG thấy</span></div>
  <div class="lz-layer"><span class="lz-t">Hàng đợi của PostgreSQL</span><span class="lz-d">các phiên tranh nhau CPU, bộ đệm, khoá. Đây là nơi thời gian chuyển tới khi pool quá TO</span></div>
  <div class="lz-layer"><span class="lz-t">Công việc thật</span><span class="lz-d">0,030ms. Cái duy nhất <code>EXPLAIN ANALYZE</code> đo được, và là phần nhỏ nhất</span></div>
</div>

<p>Hệ quả thực dụng: <strong><code>EXPLAIN ANALYZE</code> nhanh KHÔNG có nghĩa là truy vấn của bạn nhanh.</strong> Nó chỉ có nghĩa là kế hoạch thực thi tốt. Một câu truy vấn có kế hoạch hoàn hảo vẫn tốn 5ms ở production vì mọi thứ bọc quanh nó, và không lượng chỉnh chỉ mục nào chạm tới phần đó được.</p>

<h3>Làm gì với chuyện này, theo thứ tự</h3>
<div class="kv-grid">
  <div class="kv"><span>Bớt SỐ truy vấn</span><b>N+1 (chương 7): 51 truy vấn → 2 là 5,6×. Không phép chỉnh pool nào bù nổi</b></div>
  <div class="kv"><span>Chỉnh pool cho ĐÚNG</span><b>Quá nhỏ = xếp hàng ở bạn, quá to = xếp hàng ở DB. Đo cả hai vế rồi mới chọn</b></div>
  <div class="kv"><span>Đừng truy vấn nữa</span><b>Cache (chương 12). Truy vấn nhanh nhất là truy vấn không xảy ra</b></div>
  <div class="kv"><span>Đẩy việc ra khỏi request</span><b>Hàng đợi (chương 13). Người dùng không cần chờ email được gửi xong</b></div>
  <div class="kv"><span>Rồi mới tối ưu JavaScript</span><b>2% ở ví dụ này. Có ích, nhưng LÀM SAU CÙNG</b></div>
</div>

<div class="pitfall">
<p><strong>Bẫy thật:</strong> chỉ bấm giờ <code>pool.query()</code> là giấu đi toàn bộ câu chuyện — nó báo về một con số duy nhất trộn lẫn phần xếp hàng với phần truy vấn, mà hai thứ đó phản ứng với hai phép sửa ngược nhau. Hãy bấm giờ <code>pool.connect()</code> riêng, hoặc xuất <code>pool.waitingCount</code> ra làm một gauge (chương 15). <code>waitingCount</code> tăng nghĩa là "nâng pool lên"; <code>waitingCount</code> phẳng mà thời gian truy vấn tăng nghĩa là "cơ sở dữ liệu là trần rồi, thôi đừng nâng pool nữa".</p>
</div>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Các con số production ở chương 7 có cùng hình dạng: mở kết nối mới cho mỗi truy vấn tốn 8,03ms so với 0,38ms khi dùng lại — <strong>21 lần</strong> — và hai mươi truy vấn mỗi cái 100ms mất 2160ms với pool bằng 1 so với 132ms với pool bằng 20. Dự án đó cũng đã chạm luôn đầu kia của đường cong: mười hai Prisma client × pool 10 = 120 kết nối chọi với <code>max_connections</code> bằng 100, cho ra <code>53300 sorry, too many clients already</code>. Hai kiểu hỏng, trên cùng một hệ thống, cách nhau sáu tháng. Bài học của chương này là chúng là <em>cùng một</em> kiểu hỏng — một hàng đợi đặt sai chỗ — và chỉ có đo cả hai nửa mới cho biết bạn đang mắc cái nào.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-322"><span class="lc-t">Code Lab · Database Integration and Data Modeling</span><span class="lc-d">Pool, truy vấn và chỗ độ trễ ẩn nấp</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-324"><span class="lc-t">Code Lab · Performance, Caching, and Scaling</span><span class="lc-d">Bỏ bớt truy vấn thay vì làm truy vấn nhanh hơn</span></a>
</div>
</div>
`,
    },
    /* ─────────────────────────── 16.3 ─────────────────────────── */
    {
      title: '16.3 — Compression: the setting that is 490× slower for a bigger file|||16.3 — Nén: mức cài đặt chậm hơn 490 lần mà lại cho file TO HƠN',
      slug: 'nodejs-16-3-nen-va-duong-truyen',
      type: 'VIDEO',
      description: 'Đo gzip và brotli ở mọi mức: tỉ lệ nén, giá CPU, throughput — rồi tìm ra brotli mức 11 vừa chậm hơn 490 lần vừa cho ra file to hơn mức 4.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.3</span>
<h2>Compression: the setting that is 490× slower for a bigger file</h2>
<p class="lead">Compression is the rare optimisation that trades one resource for another out in the open: you spend CPU to save bandwidth. That makes it a decision rather than a free win — and like most decisions, it has a default that is fine and an "obviously better" setting that is a disaster. This lesson measures both.</p>

<h3>The raw trade</h3>
<p>An 87KB JSON response, compressed by every level of both algorithms, on the same machine:</p>

<div class="out">gốc: 87.683 byte

gzip level 1        4.298 B   tỉ lệ 20,4×    0,14ms/lần    7.174 lần/giây
gzip level 4        3.859 B   tỉ lệ 22,7×    0,31ms/lần    3.245 lần/giây
gzip level 6        4.303 B   tỉ lệ 20,4×    0,31ms/lần    3.207 lần/giây
gzip level 9        4.310 B   tỉ lệ 20,3×    0,45ms/lần    2.214 lần/giây
brotli quality 4    1.691 B   tỉ lệ 51,9×    0,31ms/lần    3.238 lần/giây
brotli quality 6    1.661 B   tỉ lệ 52,8×    0,60ms/lần    1.665 lần/giây
brotli quality 9    1.663 B   tỉ lệ 52,7×    2,84ms/lần      353 lần/giây
brotli quality 11   1.918 B   tỉ lệ 45,7×  151,99ms/lần        7 lần/giây

GIẢI NÉN gzip      87.683 B                  0,08ms/lần   12.739 lần/giây
GIẢI NÉN brotli    87.683 B                  0,08ms/lần   13.052 lần/giây</div>

<div class="danger">
<p><strong>Look at the last compression row.</strong> Brotli at maximum quality took <strong>151,99ms</strong> — 490× longer than quality 4 — and produced a file that is <strong>13% larger</strong> (1.918 against 1.691 bytes). Not a smaller improvement: an actual regression, at 490× the cost. At quality 11 brotli switches to a much larger window and a far more aggressive search, and on small repetitive data that search settles on a worse partition than the cheap heuristic finds. "Higher is better" is not a property of compression settings; it is an assumption, and here it is false in both dimensions at once.</p>
</div>

<p>Two more things in that table deserve attention. <strong>gzip level 9 is both slower and slightly larger than level 1</strong> for this data — 0,45ms against 0,14ms, 4.310 bytes against 4.298. And <strong>decompression is free and identical for both algorithms</strong>: 0,08ms either way. That asymmetry is why the client side of this decision does not matter and the server side does.</p>

<h3>What it does to a live server</h3>
<p>Raw benchmarks understate the cost, because a server compresses while doing everything else. Same route, same 87KB body, <code>autocannon -c 20 -d 5</code>:</p>

<div class="out">chế độ        Accept-Encoding   req/giây   p50    p97.5   byte trên dây   encoding thật
none            gzip, br          3.270    5ms    12ms      87.683 B     KHÔNG NÉN
gzip level 1    gzip              2.673    7ms    12ms       4.298 B     gzip
gzip mặc định   gzip              2.603    7ms    13ms       4.303 B     gzip
brotli q4       br                1.776   10ms    17ms       1.691 B     br
brotli q11      br                   22  873ms   943ms       1.918 B     br</div>

<p><strong>gzip costs 18% of throughput and removes 95% of the bytes.</strong> That is an excellent trade on any real network — 87KB at a typical Vietnamese mobile connection is several hundred milliseconds of transfer, and 4KB is one packet round-trip.</p>
<p><strong>Brotli costs 46% and removes 98%.</strong> Whether the extra 2,6KB saved is worth 894 requests per second depends entirely on who your users are. For a mobile-heavy audience on slow connections, yes. For an internal API on a gigabit LAN, no.</p>
<p><strong>Brotli at maximum destroys the server: 22 requests per second, p50 of 873ms.</strong> The compression is now the entire application. This is not a hypothetical mistake; <code>BROTLI_PARAM_QUALITY: 11</code> is what you get by copying a static-asset build config into a dynamic API.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">Responses under 1KB</span><span class="lz-d">Do NOT compress. The gzip header alone is ~20 bytes, and the compressed result can end up larger</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">Dynamic JSON/HTML/CSS/JS</span><span class="lz-d">gzip level 1 or brotli quality 4. Settle here and do not turn the dial higher</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">Static files (bundles, SVG images)</span><span class="lz-d">PRE-compress at build time at the highest setting and serve the ready-made .br/.gz files. You pay ONCE</span></div>
  <div class="lz-step"><span class="lz-n">4</span><span class="lz-t">Already compressed (jpg, png, mp4, zip)</span><span class="lz-d">Do NOT recompress. It burns CPU, gains ~0%, and sometimes grows the file</span></div>
  <div class="lz-step"><span class="lz-n">5</span><span class="lz-t">Is nginx or Cloudflare in front?</span><span class="lz-d">Let them compress. Node is freed up, and they do it in C with a cache</span></div>
</div>

<h3>Where compression should actually happen</h3>
<p>The measured 18–46% is a cost your Node process pays with the same CPU it uses to serve requests. A reverse proxy pays it with different CPU, in optimised C, and can cache the compressed result so identical responses are compressed once rather than once per request. <strong>If you have nginx or a CDN in front, compressing in Node is paying twice for one thing.</strong></p>

<pre><code># nginx — nén ở đây thay vì trong Node
gzip on;
gzip_types application/json text/css application/javascript;
gzip_min_length 1024;
gzip_comp_level 4;         # KHÔNG phải 9
</code></pre>

<div class="pitfall">
<p><strong>A real trap:</strong> compression and streaming interact badly. A compression middleware buffers to decide whether the response is worth compressing, which breaks Server-Sent Events and any progressive response — the client receives nothing until the stream ends. Either exclude those routes (<code>filter</code> in the <code>compression</code> options) or call <code>res.flush()</code> after each chunk. Symptom: SSE works locally, silently stops working behind the proxy.</p>
</div>

<h3>The other bandwidth lever: keep-alive</h3>
<p>Compression shrinks each response. Keep-alive removes the cost of setting up the conversation at all. Five hundred sequential HTTP calls to the same host:</p>

<div class="out">500 lời gọi HTTP tuần tự tới cùng một máy chủ:

agent: false (mỗi lần 1 kết nối MỚI)      646ms   1,29ms/lần      774/giây
http.globalAgent (mặc định Node 22)        81ms   0,16ms/lần    6.142/giây
Agent keepAlive:true                       69ms   0,14ms/lần    7.252/giây

globalAgent.keepAlive mặc định = true</div>

<p><strong>9,4× from reusing the connection.</strong> Every new connection costs a TCP handshake — and over TLS, a certificate exchange on top, which on a real network is 100–300ms rather than the 1,29ms measured here on loopback. For a backend that calls a payment gateway or an AI API on every request, this is usually the single largest available win and it is one line of configuration.</p>

<p>The good news is that <strong>Node 22 already does the right thing</strong>: <code>globalAgent.keepAlive</code> is <code>true</code> by default, and <code>fetch()</code> pools connections. The mistake is now the opposite of what it used to be — it is code that explicitly sets <code>agent: false</code>, or an old HTTP library carrying a pre-Node-19 default, quietly paying the 9× penalty on every outbound call.</p>

<div class="out">500 lời gọi, 20 luồng song song:

agent: false                              471ms    1.062/giây
keepAlive maxSockets:20                    55ms    9.047/giây
keepAlive maxSockets:2 (quá chật)          46ms   10.814/giây</div>

<div class="callout">
<p><strong>The third row is a lesson in humility.</strong> A pool of 2 sockets beat a pool of 20 — because on loopback the upstream answers instantly, so twenty concurrent sockets only add scheduling overhead. Over a real network with 50ms of latency the ranking reverses completely. <strong>Benchmarks on <code>127.0.0.1</code> answer a different question than production does</strong>, and connection concurrency is the setting where that difference bites hardest.</p>
</div>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> Compression happens at nginx, not in Node — the right layer, as argued above. The media subdomain adds the other half of this lesson: R2 objects are served with <code>cache-control: public, max-age=31536000, immutable</code> behind a Cloudflare cache rule, verified by GET as <code>cf-cache-status: HIT</code> with an <code>age</code> of several hours. A cached response is compression taken to its limit — zero bytes from origin, zero CPU, zero database. The general rule this chapter keeps arriving at from different directions: <strong>the fastest work is the work that does not happen.</strong></p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/nginx${REF}#module-915"><span class="lc-t">Code Lab · nginx hardening &amp; tuning</span><span class="lc-d">Compression, caching and proxy settings</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-324"><span class="lc-t">Code Lab · Performance, Caching, and Scaling</span><span class="lc-d">Response size, keep-alive and connection reuse</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.3</span>
<h2>Nén: mức cài đặt chậm hơn 490 lần mà lại cho file TO HƠN</h2>
<p class="lead">Nén là phép tối ưu hiếm hoi đánh đổi tài nguyên này lấy tài nguyên kia một cách công khai: bạn tiêu CPU để tiết kiệm băng thông. Điều đó biến nó thành một <em>quyết định</em> chứ không phải một món hời miễn phí — và như phần lớn quyết định, nó có một giá trị mặc định ổn và một cài đặt "hiển nhiên tốt hơn" hoá ra là thảm hoạ. Bài này đo cả hai.</p>

<h3>Phép đánh đổi ở dạng thô</h3>
<p>Một phản hồi JSON 87KB, nén qua mọi mức của cả hai thuật toán, trên cùng một máy:</p>

<div class="out">gốc: 87.683 byte

gzip level 1        4.298 B   tỉ lệ 20,4×    0,14ms/lần    7.174 lần/giây
gzip level 4        3.859 B   tỉ lệ 22,7×    0,31ms/lần    3.245 lần/giây
gzip level 6        4.303 B   tỉ lệ 20,4×    0,31ms/lần    3.207 lần/giây
gzip level 9        4.310 B   tỉ lệ 20,3×    0,45ms/lần    2.214 lần/giây
brotli quality 4    1.691 B   tỉ lệ 51,9×    0,31ms/lần    3.238 lần/giây
brotli quality 6    1.661 B   tỉ lệ 52,8×    0,60ms/lần    1.665 lần/giây
brotli quality 9    1.663 B   tỉ lệ 52,7×    2,84ms/lần      353 lần/giây
brotli quality 11   1.918 B   tỉ lệ 45,7×  151,99ms/lần        7 lần/giây

GIẢI NÉN gzip      87.683 B                  0,08ms/lần   12.739 lần/giây
GIẢI NÉN brotli    87.683 B                  0,08ms/lần   13.052 lần/giây</div>

<div class="danger">
<p><strong>Nhìn dòng nén cuối cùng.</strong> Brotli ở mức chất lượng cao nhất mất <strong>151,99ms</strong> — lâu gấp 490 lần mức 4 — và cho ra một file <strong>to hơn 13%</strong> (1.918 so với 1.691 byte). Không phải cải thiện ít đi: đó là một bước <em>lùi</em> thật sự, với cái giá gấp 490 lần. Ở mức 11 brotli chuyển sang một cửa sổ lớn hơn nhiều và một phép tìm kiếm hung hãn hơn hẳn, và trên dữ liệu ngắn lặp lại nhiều thì phép tìm kiếm ấy dừng ở một cách phân mảnh tệ hơn cả cái mà heuristic rẻ tiền tìm ra. "Cao hơn thì tốt hơn" không phải một tính chất của các mức nén; nó là một giả định, và ở đây nó sai ở cả hai chiều cùng lúc.</p>
</div>

<p>Còn hai điều nữa trong bảng đó đáng chú ý. <strong>gzip level 9 vừa chậm hơn vừa to hơn một chút so với level 1</strong> với dữ liệu này — 0,45ms so với 0,14ms, 4.310 byte so với 4.298. Và <strong>giải nén thì miễn phí và giống hệt nhau ở cả hai thuật toán</strong>: 0,08ms cả đôi. Sự bất đối xứng ấy là lý do phía client của quyết định này không quan trọng còn phía máy chủ thì có.</p>

<h3>Nó làm gì với một máy chủ đang sống</h3>
<p>Benchmark thô đánh giá thấp cái giá, vì máy chủ nén <em>trong lúc</em> còn làm mọi việc khác. Cùng route, cùng thân 87KB, <code>autocannon -c 20 -d 5</code>:</p>

<div class="out">chế độ        Accept-Encoding   req/giây   p50    p97.5   byte trên dây   encoding thật
none            gzip, br          3.270    5ms    12ms      87.683 B     KHÔNG NÉN
gzip level 1    gzip              2.673    7ms    12ms       4.298 B     gzip
gzip mặc định   gzip              2.603    7ms    13ms       4.303 B     gzip
brotli q4       br                1.776   10ms    17ms       1.691 B     br
brotli q11      br                   22  873ms   943ms       1.918 B     br</div>

<p><strong>gzip tốn 18% throughput và bỏ đi 95% số byte.</strong> Đó là một phép đánh đổi tuyệt vời trên bất kỳ mạng thật nào — 87KB trên một kết nối di động điển hình ở Việt Nam là vài trăm mili-giây truyền, còn 4KB là một vòng đi-về của một gói tin.</p>
<p><strong>Brotli tốn 46% và bỏ đi 98%.</strong> Việc 2,6KB tiết kiệm thêm ấy có đáng 894 request mỗi giây hay không phụ thuộc hoàn toàn vào người dùng của bạn là ai. Với lượng người dùng di động lớn trên kết nối chậm thì đáng. Với một API nội bộ trên mạng LAN gigabit thì không.</p>
<p><strong>Brotli mức cao nhất huỷ diệt máy chủ: 22 request mỗi giây, p50 873ms.</strong> Việc nén giờ chính là toàn bộ ứng dụng. Đây không phải sai lầm giả tưởng; <code>BROTLI_PARAM_QUALITY: 11</code> là thứ bạn nhận được khi chép một cấu hình build tệp tĩnh sang một API động.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">Phản hồi &lt; 1KB</span><span class="lz-d">ĐỪNG nén. Riêng phần đầu gzip đã ~20 byte, và nén xong có khi còn to hơn</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">JSON/HTML/CSS/JS động</span><span class="lz-d">gzip level 1 hoặc brotli quality 4. Chốt lại ở đây, đừng vặn cao hơn</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">Tệp tĩnh (bundle, SVG)</span><span class="lz-d">nén SẴN lúc build ở mức cao nhất, phục vụ file .br/.gz có sẵn. Trả giá MỘT lần</span></div>
  <div class="lz-step"><span class="lz-n">4</span><span class="lz-t">Đã nén rồi (jpg, png, mp4, zip)</span><span class="lz-d">ĐỪNG nén lại. Tốn CPU, được ~0%, đôi khi còn to ra</span></div>
  <div class="lz-step"><span class="lz-n">5</span><span class="lz-t">Có nginx/Cloudflare ở trước?</span><span class="lz-d">Để chúng nén. Node được giải phóng, chúng làm bằng C và có cache</span></div>
</div>

<h3>Việc nén nên xảy ra ở đâu</h3>
<p>Con số 18–46% đo được là cái giá mà tiến trình Node của bạn trả bằng chính cái CPU nó dùng để phục vụ request. Một reverse proxy trả cái giá đó bằng CPU khác, bằng C đã tối ưu, và còn cache được kết quả nén để những phản hồi giống nhau chỉ bị nén một lần chứ không phải mỗi request một lần. <strong>Nếu bạn đã có nginx hoặc CDN đứng trước thì nén trong Node là trả tiền hai lần cho một việc.</strong></p>

<pre><code># nginx — nén ở đây thay vì trong Node
gzip on;
gzip_types application/json text/css application/javascript;
gzip_min_length 1024;
gzip_comp_level 4;         # KHÔNG phải 9
</code></pre>

<div class="pitfall">
<p><strong>Bẫy thật:</strong> nén và truyền dòng (streaming) tương tác rất tệ với nhau. Middleware nén phải gom đệm để quyết định phản hồi có đáng nén không, mà việc đó phá vỡ Server-Sent Events và mọi phản hồi trả dần — client không nhận được gì cho tới khi luồng kết thúc. Hoặc loại các route đó ra (dùng <code>filter</code> trong tuỳ chọn của <code>compression</code>), hoặc gọi <code>res.flush()</code> sau mỗi khối. Triệu chứng: SSE chạy ngon ở máy local rồi im lặng ngừng hoạt động khi ra sau proxy.</p>
</div>

<h3>Cần gạt băng thông còn lại: keep-alive</h3>
<p>Nén làm mỗi phản hồi nhỏ đi. Keep-alive thì xoá luôn cái giá của việc thiết lập cuộc hội thoại. Năm trăm lời gọi HTTP tuần tự tới cùng một máy chủ:</p>

<div class="out">500 lời gọi HTTP tuần tự tới cùng một máy chủ:

agent: false (mỗi lần 1 kết nối MỚI)      646ms   1,29ms/lần      774/giây
http.globalAgent (mặc định Node 22)        81ms   0,16ms/lần    6.142/giây
Agent keepAlive:true                       69ms   0,14ms/lần    7.252/giây

globalAgent.keepAlive mặc định = true</div>

<p><strong>Nhanh gấp 9,4 lần chỉ nhờ dùng lại kết nối.</strong> Mỗi kết nối mới tốn một lần bắt tay TCP — và trên TLS thì cộng thêm một lần trao đổi chứng chỉ, mà trên mạng thật là 100–300ms chứ không phải 1,29ms đo được ở đây trên loopback. Với một backend gọi cổng thanh toán hoặc API AI ở mỗi request, đây thường là món lợi lớn nhất đang có sẵn và nó chỉ là một dòng cấu hình.</p>

<p>Tin tốt là <strong>Node 22 đã làm đúng sẵn rồi</strong>: <code>globalAgent.keepAlive</code> mặc định là <code>true</code>, và <code>fetch()</code> có gom kết nối. Sai lầm bây giờ ngược lại với ngày xưa — nó là đoạn code cố ý đặt <code>agent: false</code>, hoặc một thư viện HTTP cũ còn mang mặc định thời trước Node 19, âm thầm trả cái giá gấp 9 lần ở mọi lời gọi đi ra.</p>

<div class="out">500 lời gọi, 20 luồng song song:

agent: false                              471ms    1.062/giây
keepAlive maxSockets:20                    55ms    9.047/giây
keepAlive maxSockets:2 (quá chật)          46ms   10.814/giây</div>

<div class="callout">
<p><strong>Dòng thứ ba là một bài học về sự khiêm tốn.</strong> Một pool 2 socket thắng một pool 20 socket — vì trên loopback máy chủ phía trên trả lời tức thì, nên hai mươi socket đồng thời chỉ cộng thêm chi phí điều phối. Trên mạng thật có độ trễ 50ms thì thứ hạng đảo ngược hoàn toàn. <strong>Benchmark trên <code>127.0.0.1</code> trả lời một câu hỏi khác với câu hỏi mà production đặt ra</strong>, và độ đồng thời của kết nối là chỗ mà khác biệt ấy cắn đau nhất.</p>
</div>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Việc nén diễn ra ở nginx chứ không ở Node — đúng tầng, như đã lập luận ở trên. Tên miền phụ chứa media bổ sung nốt nửa còn lại của bài học này: các object trên R2 được phục vụ kèm <code>cache-control: public, max-age=31536000, immutable</code> sau một cache rule của Cloudflare, đã verify bằng GET ra <code>cf-cache-status: HIT</code> với <code>age</code> vài tiếng. Một phản hồi đã nằm trong cache chính là phép nén đẩy tới giới hạn — không byte nào từ máy gốc, không CPU, không cơ sở dữ liệu. Quy tắc chung mà chương này cứ đi tới từ nhiều hướng khác nhau: <strong>công việc nhanh nhất là công việc không xảy ra.</strong></p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/nginx${REF}#module-915"><span class="lc-t">Code Lab · nginx hardening &amp; tuning</span><span class="lc-d">Nén, cache và cấu hình proxy</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-324"><span class="lc-t">Code Lab · Performance, Caching, and Scaling</span><span class="lc-d">Cỡ phản hồi, keep-alive và dùng lại kết nối</span></a>
</div>
</div>
`,
    },
    /* ─────────────────────────── 16.4 ─────────────────────────── */
    {
      title: '16.4 — Scaling out: 3,4× for CPU work, 1,06× for I/O|||16.4 — Mở rộng theo chiều ngang: 3,4× với việc CPU, 1,06× với việc I/O',
      slug: 'nodejs-16-4-cluster-mo-rong',
      simulation: {
        url: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-16-4-cluster-mo-rong.mp4',
        poster: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-16-4-cluster-mo-rong.jpg',
        scenario: 'nodejs-cluster',
        durationSeconds: 16,
        caption: { en: "Cluster: 3.4× or 1.06×", vi: "Cluster: 3,4× hay 1,06×" },
      },
      type: 'VIDEO',
      description: 'Chạy cùng một app với 1 tới 10 worker trên hai loại route khác nhau, và phát hiện cluster nhân ba thông lượng ở route nặng CPU nhưng không làm gì ở route nặng I/O — rồi tệ đi khi thêm worker.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.4</span>
<h2>Scaling out: 3,4× for CPU work, 1,06× for I/O</h2>
<p class="lead">Node runs your JavaScript on one thread. On a ten-core machine that sounds like using 10% of what you paid for, and the standard fix is <code>cluster</code>: fork one process per core, let them share a port. Whether that helps turns out to depend entirely on what your route does — by a factor that this lesson measures at 3,4× in one case and 1,06× in the other.</p>

<h3>Two routes, five configurations</h3>
<p>The same application, forked into 1, 2, 4, 8 and 10 workers, serving two endpoints. <code>/cpu</code> hashes a string twenty times — real computation, like password verification or image processing. <code>/io</code> awaits 30ms — like a database query. Both hit with 50 concurrent connections:</p>

<div class="out">route  worker   req/giây   p50    p97.5   different pid numbers
/cpu     1        8.708    5ms    10ms        1
/cpu     2       18.303    2ms     5ms        2
/cpu     4       29.542    1ms     5ms        4
/cpu     8       27.189    1ms     6ms        8
/cpu    10       25.112    1ms     8ms       10

/io      1        1.253   38ms    57ms        1
/io      2        1.289   35ms    55ms        2
/io      4        1.326   34ms    54ms        4
/io      8        1.303   35ms    52ms        8
/io     10        1.325   35ms    56ms       10</div>

<div class="danger">
<p><strong>Two completely different stories from the same change.</strong> The CPU route goes 8.708 → 29.542, a <strong>3,4× gain</strong>. The I/O route goes 1.253 → 1.325, a <strong>5,7% gain</strong> — indistinguishable from noise. Forking ten processes did nothing at all for the route that spends its time waiting, because <em>waiting was never the thing competing for a core.</em> One event loop can hold thousands of pending awaits; it does not need help doing nothing.</p>
</div>

<p>The <code>different pid numbers</code> column is there to prove the workers really are being used — 40 sample requests hit 10 distinct processes. The load was distributed correctly. It just did not matter.</p>

<h3>The second surprise: more workers made it worse</h3>
<p>On a ten-core machine, CPU throughput peaks at <strong>four</strong> workers and then declines: 29.542 → 27.189 → 25.112. Three reasons, all of which apply to your production machine too:</p>

<div class="kv-grid">
  <div class="kv"><span>The client burns CPU too</span><b>autocannon runs on the SAME box and needs several cores. In production that role is played by nginx, the log collector, the monitoring agent</b></div>
  <div class="kv"><span>Context switching</span><b>More processes than cores means the OS has to rotate between them, and every switch costs</b></div>
  <div class="kv"><span>Each worker is its own V8</span><b>Its own heap, its own JIT, its own GC. 10 workers means 10× the baseline memory</b></div>
</div>

<p>The practical rule: <strong>start at <code>cores - 1</code>, then measure down as well as up.</strong> The optimum is usually lower than the core count, and the only way to find it is to try. Copying <code>os.cpus().length</code> from a tutorial is how you end up on the falling side of that curve.</p>

<h3>Deciding whether cluster is your answer</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">Take a CPU profile under load (lesson 16.1)</span><span class="lz-d">What percentage is (idle)?</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">idle CAO (&gt;60%)</span><span class="lz-d">You are I/O-bound. Clustering does NOTHING. Go fix the database or the external API</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">LOW idle (&lt;30%)</span><span class="lz-d">You are CPU-bound. Clustering helps almost linearly up to roughly the core count</span></div>
  <div class="lz-step"><span class="lz-n">4</span><span class="lz-t">A single function eating all the CPU</span><span class="lz-d">Use a <code>worker_threads</code> for just that (chapter 2) — cheaper than multiplying the whole process</span></div>
  <div class="lz-step"><span class="lz-n">5</span><span class="lz-t">Đo lại ở 2, 4, 6, 8 worker</span><span class="lz-d">Pick the REAL peak, not the core count</span></div>
</div>

<h3>What breaks when you fork</h3>
<p>Every worker is a separate process with separate memory. Anything your single-process code kept in a variable now exists N times, independently, and the copies do not agree:</p>

<div class="kv-grid">
  <div class="kv"><span>In-memory caches</span><b>N different copies. Users see stale data depending on which worker they land on</b></div>
  <div class="kv"><span>Rate limits counted in RAM</span><b>A 100-per-minute limit becomes 100×N. It has to be counted in Redis (chapter 12)</b></div>
  <div class="kv"><span>Socket.IO</span><b>An emit on worker 1 never reaches a client attached to worker 2 — you need the Redis adapter (chapter 11, measured)</b></div>
  <div class="kv"><span>Cron and periodic jobs</span><b>They run N times instead of once. Lock with Redis, or split them into their own process entirely</b></div>
  <div class="kv"><span>Counters and global variables</span><b>One value per worker. Chapter 15's metrics too — one /metrics per process</b></div>
</div>

<div class="pitfall">
<p><strong>A real trap:</strong> the cron problem is the one that actually causes incidents, because it is silent. A nightly billing job written when the app ran one process starts sending four invoices per customer the day someone sets <code>WORKERS=4</code> for performance. Nothing errors. The guard used in this project is <code>let _started = false</code> — which correctly prevents double-scheduling <em>within one process</em> and does absolutely nothing across four.</p>
</div>

<h3>cluster, PM2, or containers?</h3>
<p>All three do the same thing — run N processes behind one port — and differ in who supervises them:</p>

<div class="lz-map">
  <div class="lz-node"><span class="lz-t">cluster (trong code)</span><span class="lz-d">Nothing to install, but the parent process is a SINGLE POINT OF FAILURE and you have to write the worker-restart logic yourself</span></div>
  <div class="lz-node"><span class="lz-t">PM2</span><span class="lz-d">Automatic restarts, zero-downtime reloads, logging. One more thing to operate, and it duplicates what Docker does</span></div>
  <div class="lz-node"><span class="lz-t">N container</span><span class="lz-d">1 process per container, replicated with Docker/Kubernetes. The healthiest option — the orchestrator handles restarts, health checks and rolling deploys</span></div>
</div>

<p>For a containerised deployment the third option is almost always right: <strong>one process per container, scale by running more containers.</strong> It keeps the container as the unit of everything — restart, health check, rollout, resource limit — instead of hiding a process manager inside one.</p>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> Production runs a <strong>single</strong> backend process in a single container. Given the measurements above that is the correct choice, and the reason is visible in this course's own numbers: this is an I/O-bound application. Chapter 16.2 measured 97,8% of request time inside a database call, and the <code>/io</code> row above says forking gains 5,7% on exactly that shape of work. What forking <em>would</em> break is already documented here — <code>cron.service.ts</code> holds eleven <code>cron.schedule()</code> calls guarded only by an in-process flag, and <code>embedQueue.service.ts</code> is an in-memory array queue with a <code>_processing</code> flag. Both are correct today and both break the day a second process appears. That is the real cost of clustering this app, and it is why the honest scaling path here is chapter 12's cache and chapter 13's queue, not more workers.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-324"><span class="lc-t">Code Lab · Performance, Caching, and Scaling</span><span class="lc-d">cluster, worker_threads and horizontal scaling</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/socket-io${REF}#module-942"><span class="lc-t">Code Lab · Redis adapter for Socket.IO</span><span class="lc-d">Making realtime survive multiple processes</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.4</span>
<h2>Mở rộng theo chiều ngang: 3,4× với việc CPU, 1,06× với việc I/O</h2>
<p class="lead">Node chạy JavaScript của bạn trên một luồng. Trên một cái máy mười nhân thì nghe như đang dùng 10% số tiền đã bỏ ra, và phép sửa tiêu chuẩn là <code>cluster</code>: rẽ nhánh một tiến trình cho mỗi nhân, cho chúng dùng chung một cổng. Việc đó có ích hay không hoá ra phụ thuộc hoàn toàn vào route của bạn làm gì — với một tỉ lệ mà bài này đo được là 3,4 lần ở trường hợp này và 1,06 lần ở trường hợp kia.</p>

<h3>Hai route, năm cấu hình</h3>
<p>Vẫn ứng dụng ấy, rẽ thành 1, 2, 4, 8 và 10 worker, phục vụ hai endpoint. <code>/cpu</code> băm một chuỗi hai mươi lần — tính toán thật, giống việc kiểm mật khẩu hay xử lý ảnh. <code>/io</code> chờ 30ms — giống một truy vấn cơ sở dữ liệu. Cả hai đều bị nện với 50 kết nối đồng thời:</p>

<div class="out">route  worker   req/giây   p50    p97.5   số pid khác nhau
/cpu     1        8.708    5ms    10ms        1
/cpu     2       18.303    2ms     5ms        2
/cpu     4       29.542    1ms     5ms        4
/cpu     8       27.189    1ms     6ms        8
/cpu    10       25.112    1ms     8ms       10

/io      1        1.253   38ms    57ms        1
/io      2        1.289   35ms    55ms        2
/io      4        1.326   34ms    54ms        4
/io      8        1.303   35ms    52ms        8
/io     10        1.325   35ms    56ms       10</div>

<div class="danger">
<p><strong>Hai câu chuyện hoàn toàn khác nhau từ cùng một thay đổi.</strong> Route CPU đi từ 8.708 lên 29.542, <strong>tăng 3,4 lần</strong>. Route I/O đi từ 1.253 lên 1.325, <strong>tăng 5,7%</strong> — không phân biệt được với nhiễu. Rẽ ra mười tiến trình chẳng làm được gì cho cái route dành thời gian để <em>chờ</em>, bởi vì <em>việc chờ chưa bao giờ là thứ tranh giành một nhân CPU</em>. Một event loop giữ được hàng nghìn phép await đang treo; nó không cần ai giúp để không làm gì cả.</p>
</div>

<p>Cột <code>số pid khác nhau</code> có mặt để chứng minh các worker thật sự được dùng — 40 request mẫu chạm vào 10 tiến trình khác nhau. Tải đã được chia đúng. Chỉ là nó không có tác dụng.</p>

<h3>Bất ngờ thứ hai: thêm worker làm mọi thứ TỆ ĐI</h3>
<p>Trên một máy mười nhân, throughput CPU đạt đỉnh ở <strong>bốn</strong> worker rồi tụt: 29.542 → 27.189 → 25.112. Ba lý do, và cả ba đều đúng với máy production của bạn:</p>

<div class="kv-grid">
  <div class="kv"><span>Client cũng ăn CPU</span><b>autocannon chạy CÙNG máy và cần vài nhân. Ở production đó là nginx, hệ gom log, agent giám sát</b></div>
  <div class="kv"><span>Chuyển ngữ cảnh</span><b>Nhiều tiến trình hơn số nhân = hệ điều hành phải luân phiên chúng, và mỗi lần đổi đều tốn</b></div>
  <div class="kv"><span>Mỗi worker là một V8 riêng</span><b>Heap riêng, JIT riêng, GC riêng. 10 worker = 10 lần bộ nhớ nền</b></div>
</div>

<p>Quy tắc thực dụng: <strong>bắt đầu ở <code>số nhân - 1</code>, rồi đo cả xuống lẫn lên.</strong> Điểm tối ưu thường thấp hơn số nhân, và cách duy nhất tìm ra nó là thử. Chép <code>os.cpus().length</code> từ một bài hướng dẫn là cách bạn kết thúc ở sườn đi xuống của đường cong đó.</p>

<h3>Quyết định xem cluster có phải câu trả lời của bạn không</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">Lấy CPU profile dưới tải (bài 16.1)</span><span class="lz-d">Bao nhiêu phần trăm là (idle)?</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">idle CAO (&gt;60%)</span><span class="lz-d">Bạn nghẽn ở I/O. Cluster KHÔNG giúp gì. Hãy đi sửa cơ sở dữ liệu hoặc API bên ngoài</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">idle THẤP (&lt;30%)</span><span class="lz-d">Bạn nghẽn ở CPU. Cluster giúp gần như tuyến tính tới khoảng số nhân</span></div>
  <div class="lz-step"><span class="lz-n">4</span><span class="lz-t">Một hàm duy nhất chiếm hết CPU</span><span class="lz-d">Dùng <code>worker_threads</code> cho riêng nó (chương 2) — rẻ hơn nhân cả tiến trình lên</span></div>
  <div class="lz-step"><span class="lz-n">5</span><span class="lz-t">Đo lại ở 2, 4, 6, 8 worker</span><span class="lz-d">Chọn đỉnh THẬT, không chọn số nhân</span></div>
</div>

<h3>Cái gì vỡ khi bạn rẽ nhánh</h3>
<p>Mỗi worker là một tiến trình riêng với bộ nhớ riêng. Mọi thứ mà code một-tiến-trình của bạn giữ trong một biến giờ tồn tại N bản, độc lập, và các bản sao ấy không đồng ý với nhau:</p>

<div class="kv-grid">
  <div class="kv"><span>Cache trong bộ nhớ</span><b>N bản sao khác nhau. Người dùng thấy dữ liệu cũ tuỳ vào việc trúng worker nào</b></div>
  <div class="kv"><span>Rate limit đếm trong RAM</span><b>Giới hạn 100/phút thành 100×N. Phải đếm trong Redis (chương 12)</b></div>
  <div class="kv"><span>Socket.IO</span><b>Emit ở worker 1 không tới được client nối vào worker 2 — phải có Redis adapter (chương 11, đã đo)</b></div>
  <div class="kv"><span>Cron / job định kỳ</span><b>Chạy N lần thay vì 1. Phải khoá bằng Redis hoặc tách hẳn ra tiến trình riêng</b></div>
  <div class="kv"><span>Bộ đếm, biến toàn cục</span><b>Mỗi worker một giá trị. Metric của chương 15 cũng vậy — mỗi tiến trình một /metrics</b></div>
</div>

<div class="pitfall">
<p><strong>Bẫy thật:</strong> vấn đề cron mới là thứ thật sự gây ra sự cố, vì nó im lặng. Một job tính tiền chạy hằng đêm, viết hồi ứng dụng còn một tiến trình, bắt đầu gửi bốn hoá đơn cho mỗi khách hàng đúng cái ngày có người đặt <code>WORKERS=4</code> cho nhanh. Không có lỗi nào cả. Chốt chặn mà dự án này dùng là <code>let _started = false</code> — thứ ngăn được việc lên lịch hai lần <em>trong một tiến trình</em> và hoàn toàn vô dụng khi có bốn.</p>
</div>

<h3>cluster, PM2, hay nhiều container?</h3>
<p>Cả ba đều làm một việc — chạy N tiến trình sau một cổng — và khác nhau ở chỗ ai giám sát chúng:</p>

<div class="lz-map">
  <div class="lz-node"><span class="lz-t">cluster (trong code)</span><span class="lz-d">Không cần cài gì, nhưng tiến trình cha là ĐIỂM CHẾT DUY NHẤT và bạn phải tự viết phần khởi động lại worker</span></div>
  <div class="lz-node"><span class="lz-t">PM2</span><span class="lz-d">Tự khởi động lại, reload không gián đoạn, có log. Thêm một thứ phải vận hành, và trùng việc với Docker</span></div>
  <div class="lz-node"><span class="lz-t">N container</span><span class="lz-d">1 tiến trình mỗi container, nhân bản bằng Docker/Kubernetes. Cách lành mạnh nhất — bộ điều phối lo việc khởi động lại, health check, triển khai dần</span></div>
</div>

<p>Với một triển khai dùng container thì lựa chọn thứ ba gần như luôn đúng: <strong>một tiến trình mỗi container, mở rộng bằng cách chạy thêm container.</strong> Nó giữ container làm đơn vị của mọi thứ — khởi động lại, health check, triển khai dần, giới hạn tài nguyên — thay vì giấu một trình quản lý tiến trình bên trong một cái.</p>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Production chạy <strong>một</strong> tiến trình backend duy nhất trong một container duy nhất. Với những phép đo ở trên thì đó là lựa chọn đúng, và lý do nhìn thấy được ngay trong số liệu của chính khoá học này: đây là một ứng dụng nghẽn ở I/O. Bài 16.2 đo được 97,8% thời gian request nằm trong một lời gọi cơ sở dữ liệu, còn dòng <code>/io</code> ở trên nói rằng rẽ nhánh được thêm 5,7% với đúng dạng công việc ấy. Còn cái mà việc rẽ nhánh <em>sẽ</em> phá vỡ thì đã được ghi lại sẵn ở đây — <code>cron.service.ts</code> giữ mười một lời gọi <code>cron.schedule()</code> chỉ được canh bằng một cờ trong tiến trình, và <code>embedQueue.service.ts</code> là một hàng đợi bằng mảng trong bộ nhớ với cờ <code>_processing</code>. Cả hai đều đúng ở hiện tại và cả hai đều vỡ vào ngày có tiến trình thứ hai. Đó là cái giá thật của việc cluster ứng dụng này, và là lý do con đường mở rộng trung thực ở đây là cache của chương 12 và hàng đợi của chương 13, chứ không phải thêm worker.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-324"><span class="lc-t">Code Lab · Performance, Caching, and Scaling</span><span class="lc-d">cluster, worker_threads và mở rộng theo chiều ngang</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/socket-io${REF}#module-942"><span class="lc-t">Code Lab · Redis adapter cho Socket.IO</span><span class="lc-d">Giúp realtime sống sót qua nhiều tiến trình</span></a>
</div>
</div>
`,
    },
    /* ─────────────────────────── 16.5 ─────────────────────────── */
    {
      title: '16.5 — Memory: the cache that never forgets|||16.5 — Bộ nhớ: cái cache không bao giờ quên',
      slug: 'nodejs-16-5-ro-ri-bo-nho',
      simulation: {
        url: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-16-5-ro-ri-bo-nho.mp4',
        poster: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-16-5-ro-ri-bo-nho.jpg',
        scenario: 'nodejs-memory-leak',
        durationSeconds: 20,
        caption: { en: "Memory: the cache that never forgets", vi: "Bộ nhớ: cái cache không bao giờ quên" },
      },
      type: 'VIDEO',
      description: 'Ba kiểu rò rỉ bộ nhớ tái hiện thật với số đo RSS qua 170.000 request, cách phân biệt rò rỉ với việc heap chỉ đang lớn lên bình thường, và cái cảnh báo Node đã hét vào mặt bạn từ lâu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.5</span>
<h2>Memory: the cache that never forgets</h2>
<p class="lead">A memory leak in Node does not announce itself. The service runs fine for a day, gets slower on the second as garbage collection works harder, and dies on the third with an out-of-memory kill — at which point it restarts, looks healthy, and starts the same countdown again. This lesson reproduces three real leaks with measurements, and shows the difference between "leaking" and "the heap is simply large", which is where most false diagnoses come from.</p>

<h3>Three leaks and a control</h3>
<p>The same Express app in four modes, each hammered with 20.000 then 50.000 then 100.000 requests, RSS sampled after each round:</p>

<div class="out">chế độ      RSS đầu   sau 20k   sau 50k   sau 100k   phần tử    heap limit
none        56,6MB    122,5MB   123,3MB    123,4MB        0       4.144MB
leak        57,0MB    162,2MB   232,4MB    351,5MB  100.000       4.144MB
lru         56,6MB    124,9MB   126,0MB    125,7MB    1.000       4.144MB
listener    56,8MB    130,2MB   142,6MB    173,1MB  170.000       4.144MB</div>

<p>Read the control row first, because it teaches the most common misdiagnosis. The healthy app went from 56,6MB to <strong>122,5MB and then stopped</strong> — 123,3, then 123,4. That first doubling is not a leak. It is V8 growing its heap to a comfortable working size, allocating JIT code, filling internal caches. <strong>Memory that rises and then plateaus is normal; memory that rises linearly with traffic is a leak.</strong> One data point cannot tell them apart, which is why "RSS is 120MB, is that bad?" is an unanswerable question and "RSS rose 90MB over 100.000 requests and has not stopped" is a diagnosis.</p>

<h3>Leak 1: the cache with no ceiling</h3>
<pre><code>const cache = new Map();

app.get('/notes/:id', (req, res) =&gt; {
  const key = req.params.id;
  if (!cache.has(key)) cache.set(key, { id: key, body: 'x'.repeat(2000) });
  res.json({ n: cache.size });
});</code></pre>

<p>Six lines, obviously beneficial, and completely unbounded. The key comes from the URL, so the number of entries is the number of distinct ids anyone ever requests — which for a public API is unlimited. RSS climbed 57 → 162 → 232 → <strong>351,5MB</strong> and was still climbing at a steady 2,4KB per new id. Given the heap limit of 4.144MB, this process dies after roughly 1,7 million distinct ids. On a low-traffic site that is months away, which is exactly why it reaches production.</p>

<p>The fix is one condition — and it is genuinely free:</p>

<pre><code>if (cache.size &gt;= 1000) cache.delete(cache.keys().next().value);  // bỏ cái vào sớm nhất
cache.set(key, value);</code></pre>

<div class="out">leak: 351,5MB, 100.000 phần tử, vẫn đang tăng
lru:  125,7MB,   1.000 phần tử, PHẲNG — không phân biệt được với app không cache</div>

<p><code>Map</code> in JavaScript preserves insertion order, so <code>keys().next().value</code> is the oldest entry and this is a five-word LRU. It kept the entire benefit of caching at 2,3MB of memory instead of 295MB and unbounded.</p>

<div class="callout">
<p><strong>The bounded-cache rule.</strong> Every in-memory cache needs a limit on entries, a TTL, or both — decided when you write it, not when it breaks. If a natural limit is hard to name, that is a signal the data belongs in Redis (chapter 12), where eviction is somebody else's job and <code>allkeys-lru</code> already handles it.</p>
</div>

<h3>Leak 2: the listener nobody removed</h3>
<pre><code>app.get('/notes/:id', (req, res) =&gt; {
  process.on('customEvent', () =&gt; {});      // đăng ký, KHÔNG BAO GIỜ gỡ
  res.json({ ok: true });
});</code></pre>

<p>170.000 requests, 170.000 listeners, RSS at 173,1MB and rising. This shape is rarer as literal code and extremely common in disguise: a subscription to a Redis client, an <code>AbortSignal</code> listener, a socket handler registered per request on a long-lived emitter. The object holding the listener never dies, so every closure it holds stays reachable forever — including everything that closure captured, which is often the entire request.</p>

<p><strong>Node warned about this, loudly, on the eleventh request:</strong></p>

<div class="out">(node:36968) MaxListenersExceededWarning: Possible EventEmitter memory leak detected.
11 customEvent listeners added to [process]. MaxListeners is 10.
Use emitter.setMaxListeners() to increase limit</div>

<div class="danger">
<p><strong>Note what the warning suggests, and do not do it.</strong> "Use <code>emitter.setMaxListeners()</code> to increase limit" silences the alarm and keeps the leak. This warning has a very high hit rate — it fires on a genuine bug far more often than not — and the correct response is to find who is registering and never removing. Raising the limit is how a five-minute fix becomes a three-day production investigation.</p>
</div>

<h3>Finding a leak you cannot see</h3>
<p>When the culprit is not obvious, take two heap snapshots and compare:</p>

<pre><code>import v8 from 'node:v8';
app.get('/__heap', (req, res) =&gt; {
  const f = v8.writeHeapSnapshot();             // ⚠ CHẶN, và file to bằng cả heap
  res.json({ file: f });
});
// or from outside, with no code change:
//   kill -USR2 &lt;pid&gt;    (enables the debugger)  → Chrome DevTools → Memory → Take snapshot</code></pre>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">Take a heap snapshot right after startup</span><span class="lz-d">this is your baseline</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">Drive a few tens of thousands of requests</span><span class="lz-d">down exactly the path you suspect</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">Take a second snapshot and compare with "Comparison"</span><span class="lz-d">DevTools shows you which object types GREW and by how much</span></div>
  <div class="lz-step"><span class="lz-n">4</span><span class="lz-t">Read the Retainers column</span><span class="lz-d">"what is holding this object" — that is the culprit, not the object itself</span></div>
  <div class="lz-step"><span class="lz-n">5</span><span class="lz-t">Fix it, then repeat steps 1-3</span><span class="lz-d">the RSS line has to go flat before you call it done</span></div>
</div>

<p>Two warnings about snapshots in production. They <strong>block the event loop</strong> for as long as it takes to walk the heap — seconds on a large one — and the file is roughly the size of the heap, so a 2GB process writes a 2GB file onto a disk that may not have room (chapter 15's disk-full incident). Take them on a canary instance or during a maintenance window, never casually on a live node.</p>

<h3>Heap limits and the OOM kill</h3>
<div class="kv-grid">
  <div class="kv"><span>The default heap ceiling</span><b>4,144MB on this machine; Node picks it from total RAM. Inside a container you must declare it BY HAND</b></div>
  <div class="kv"><span>--max-old-space-size=512</span><b>Hitting the ceiling → Node throws and prints a stack trace. YOU KNOW why</b></div>
  <div class="kv"><span>Unset, with a 512MB container limit</span><b>Node believes it has more RAM than it does → the kernel kills it with SIGKILL, exit 137, and NO log at all</b></div>
  <div class="kv"><span>The rule</span><b>Set the heap to ≈75% of the container limit. Leave room for Buffers, sockets and stacks — they live OUTSIDE the heap</b></div>
</div>

<div class="pitfall">
<p><strong>A real trap:</strong> <code>Buffer</code> lives outside the V8 heap. A process that uploads files can sit at 200MB of heap and 1,5GB of RSS, and <code>--max-old-space-size</code> will never trigger — the container limit will, with exit 137 and no stack trace. This project has met exit 137 twice: once from parallel Docker builds and once from a runaway process. When RSS is high but heap is not, stop looking at JavaScript objects and start looking at buffers, streams and native modules.</p>
</div>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> Chapter 10 measured the buffer version of this exact problem on this codebase: four concurrent 120MB uploads took RSS from 56,7MB to <strong>786,1MB</strong>, and a 758KB PNG containing a 16000×16000 image cost 99MB of RSS to decode — eight of them, 445MB, from 5,9MB of network traffic. Neither would have shown up in a heap snapshot. Both were fixed the way this lesson prescribes: a bound (<code>MAX_INPUT_PIXELS</code>, a queue of at most four concurrent decodes) decided in advance rather than discovered during an outage. The unbounded-cache pattern is the same failure with a friendlier face.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-324"><span class="lc-t">Code Lab · Performance, Caching, and Scaling</span><span class="lc-d">Memory profiling and bounded caches</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/observability-monitoring${REF}#module-992"><span class="lc-t">Code Lab · Debugging Production Incidents</span><span class="lc-d">Reading a heap snapshot under pressure</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.5</span>
<h2>Bộ nhớ: cái cache không bao giờ quên</h2>
<p class="lead">Một chỗ rò rỉ bộ nhớ trong Node không tự thông báo. Dịch vụ chạy tốt suốt một ngày, chậm dần vào ngày thứ hai khi bộ dọn rác phải làm việc nặng hơn, rồi chết vào ngày thứ ba vì bị giết do hết bộ nhớ — lúc đó nó khởi động lại, trông khoẻ mạnh, và bắt đầu lại đúng cái đồng hồ đếm ngược ấy. Bài này tái hiện ba kiểu rò rỉ thật kèm số đo, và chỉ ra khác biệt giữa "đang rò rỉ" với "heap chỉ đơn giản là lớn", vốn là nơi sinh ra phần lớn các chẩn đoán sai.</p>

<h3>Ba kiểu rò rỉ và một mẫu đối chứng</h3>
<p>Vẫn app Express ấy ở bốn chế độ, mỗi cái bị nện 20.000 rồi 50.000 rồi 100.000 request, RSS được lấy mẫu sau mỗi vòng:</p>

<div class="out">chế độ      RSS đầu   sau 20k   sau 50k   sau 100k   phần tử    heap limit
none        56,6MB    122,5MB   123,3MB    123,4MB        0       4.144MB
leak        57,0MB    162,2MB   232,4MB    351,5MB  100.000       4.144MB
lru         56,6MB    124,9MB   126,0MB    125,7MB    1.000       4.144MB
listener    56,8MB    130,2MB   142,6MB    173,1MB  170.000       4.144MB</div>

<p>Đọc dòng đối chứng trước, vì nó dạy cái chẩn đoán sai phổ biến nhất. Ứng dụng khoẻ mạnh đi từ 56,6MB lên <strong>122,5MB rồi DỪNG</strong> — 123,3, rồi 123,4. Lần tăng gấp đôi đầu tiên ấy <em>không</em> phải rò rỉ. Đó là V8 nới heap ra tới một cỡ làm việc thoải mái, cấp phát mã JIT, làm đầy các bộ đệm nội bộ. <strong>Bộ nhớ tăng rồi đi ngang là bình thường; bộ nhớ tăng tuyến tính theo lưu lượng là rò rỉ.</strong> Một điểm dữ liệu không phân biệt được hai thứ đó, và đó là lý do câu "RSS 120MB, có sao không?" là một câu hỏi không trả lời được, còn câu "RSS tăng 90MB qua 100.000 request và chưa dừng" là một chẩn đoán.</p>

<h3>Rò rỉ 1: cái cache không có trần</h3>
<pre><code>const cache = new Map();

app.get('/notes/:id', (req, res) =&gt; {
  const key = req.params.id;
  if (!cache.has(key)) cache.set(key, { id: key, body: 'x'.repeat(2000) });
  res.json({ n: cache.size });
});</code></pre>

<p>Sáu dòng, hiển nhiên là có lợi, và hoàn toàn không có trần. Khoá lấy từ URL, nên số phần tử bằng số id khác nhau mà bất kỳ ai từng yêu cầu — với một API công khai thì con số đó là vô hạn. RSS leo 57 → 162 → 232 → <strong>351,5MB</strong> và vẫn đang leo đều đặn 2,4KB cho mỗi id mới. Với trần heap 4.144MB, tiến trình này chết sau khoảng 1,7 triệu id khác nhau. Ở một site ít lưu lượng thì đó là chuyện của vài tháng nữa, và đó chính xác là lý do nó lọt được lên production.</p>

<p>Phép sửa là một câu điều kiện — và nó thật sự miễn phí:</p>

<pre><code>if (cache.size &gt;= 1000) cache.delete(cache.keys().next().value);  // bỏ cái vào sớm nhất
cache.set(key, value);</code></pre>

<div class="out">leak: 351,5MB, 100.000 phần tử, vẫn đang tăng
lru:  125,7MB,   1.000 phần tử, PHẲNG — không phân biệt được với app không cache</div>

<p><code>Map</code> trong JavaScript giữ nguyên thứ tự chèn, nên <code>keys().next().value</code> chính là phần tử cũ nhất và đây là một cái LRU dài năm từ. Nó giữ nguyên toàn bộ lợi ích của việc cache với 2,3MB bộ nhớ thay vì 295MB và không có trần.</p>

<div class="callout">
<p><strong>Quy tắc cache có trần.</strong> Mọi cache trong bộ nhớ đều cần một giới hạn số phần tử, một TTL, hoặc cả hai — quyết định lúc bạn viết nó, chứ không phải lúc nó hỏng. Nếu khó nói ra một giới hạn tự nhiên thì đó là tín hiệu dữ liệu ấy thuộc về Redis (chương 12), nơi việc thu hồi là việc của người khác và <code>allkeys-lru</code> đã lo sẵn.</p>
</div>

<h3>Rò rỉ 2: cái listener không ai gỡ</h3>
<pre><code>app.get('/notes/:id', (req, res) =&gt; {
  process.on('customEvent', () =&gt; {});      // đăng ký, KHÔNG BAO GIỜ gỡ
  res.json({ ok: true });
});</code></pre>

<p>170.000 request, 170.000 listener, RSS ở 173,1MB và đang tăng. Hình dạng này hiếm khi xuất hiện nguyên văn như vậy và cực kỳ phổ biến khi đội lốt: một phép đăng ký lên client Redis, một listener của <code>AbortSignal</code>, một handler socket đăng ký theo từng request lên một emitter sống lâu. Object giữ listener không bao giờ chết, nên mọi closure nó nắm đều còn với tới được mãi mãi — bao gồm cả mọi thứ closure ấy bắt giữ, mà thường là nguyên cả cái request.</p>

<p><strong>Node đã cảnh báo chuyện này, rất to, ngay ở request thứ mười một:</strong></p>

<div class="out">(node:36968) MaxListenersExceededWarning: Possible EventEmitter memory leak detected.
11 customEvent listeners added to [process]. MaxListeners is 10.
Use emitter.setMaxListeners() to increase limit</div>

<div class="danger">
<p><strong>Để ý cảnh báo ấy GỢI Ý làm gì, và đừng làm theo.</strong> "Use <code>emitter.setMaxListeners()</code> to increase limit" tắt được cái chuông báo và giữ nguyên chỗ rò rỉ. Cảnh báo này có tỉ lệ trúng rất cao — nó nổ vì một lỗi thật nhiều hơn hẳn số lần nổ oan — và phản ứng đúng là đi tìm xem ai đang đăng ký mà không bao giờ gỡ. Nâng giới hạn lên là cách biến một phép sửa năm phút thành một cuộc điều tra production ba ngày.</p>
</div>

<h3>Tìm chỗ rò rỉ mà bạn không nhìn thấy</h3>
<p>Khi thủ phạm không rõ ràng, hãy chụp hai ảnh heap rồi so sánh:</p>

<pre><code>import v8 from 'node:v8';
app.get('/__heap', (req, res) =&gt; {
  const f = v8.writeHeapSnapshot();             // ⚠ CHẶN, và file to bằng cả heap
  res.json({ file: f });
});
// hoặc từ bên ngoài, không cần sửa code:
//   kill -USR2 &lt;pid&gt;    (bật debugger)  → Chrome DevTools → Memory → Take snapshot</code></pre>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">Chụp ảnh heap khi vừa khởi động xong</span><span class="lz-d">đây là mốc so sánh</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">Chạy tải vài chục nghìn request</span><span class="lz-d">đúng cái đường mà bạn nghi ngờ</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">Chụp ảnh thứ hai, so bằng "Comparison"</span><span class="lz-d">DevTools chỉ ra loại object nào TĂNG THÊM và tăng bao nhiêu</span></div>
  <div class="lz-step"><span class="lz-n">4</span><span class="lz-t">Đọc cột Retainers</span><span class="lz-d">"cái gì đang giữ object này lại" — đó mới là thủ phạm, không phải bản thân object</span></div>
  <div class="lz-step"><span class="lz-n">5</span><span class="lz-t">Sửa, rồi lặp lại bước 1-3</span><span class="lz-d">đường RSS phải đi ngang mới coi là xong</span></div>
</div>

<p>Hai cảnh báo về việc chụp ảnh heap ở production. Nó <strong>chặn event loop</strong> trong suốt thời gian duyệt hết heap — vài giây với một heap lớn — và file có kích thước xấp xỉ cả cái heap, nên một tiến trình 2GB ghi ra một file 2GB lên một ổ đĩa có thể không còn chỗ (sự cố đầy đĩa ở chương 15). Hãy chụp trên một máy thử nghiệm hoặc trong cửa sổ bảo trì, đừng bao giờ chụp tuỳ hứng trên một node đang sống.</p>

<h3>Trần heap và cú giết vì hết bộ nhớ</h3>
<div class="kv-grid">
  <div class="kv"><span>Trần heap mặc định</span><b>4.144MB trên máy này; Node tự chọn theo RAM tổng. Trong container phải khai TAY</b></div>
  <div class="kv"><span>--max-old-space-size=512</span><b>Chạm trần → Node ném lỗi và in stack trace. BẠN BIẾT vì sao</b></div>
  <div class="kv"><span>Không đặt, container limit 512MB</span><b>Node tưởng mình có nhiều RAM hơn thực tế → kernel giết bằng SIGKILL, exit 137, KHÔNG có log gì</b></div>
  <div class="kv"><span>Quy tắc</span><b>Đặt heap ≈ 75% giới hạn container. Chừa chỗ cho Buffer, socket, stack — chúng nằm NGOÀI heap</b></div>
</div>

<div class="pitfall">
<p><strong>Bẫy thật:</strong> <code>Buffer</code> nằm ngoài heap của V8. Một tiến trình xử lý upload có thể ở mức 200MB heap mà 1,5GB RSS, và <code>--max-old-space-size</code> sẽ không bao giờ nổ — cái nổ là giới hạn của container, với exit 137 và không có stack trace nào. Dự án này đã gặp exit 137 hai lần: một lần do build Docker song song và một lần do một tiến trình chạy loạn. Khi RSS cao mà heap thì không, hãy thôi nhìn vào object JavaScript và bắt đầu nhìn vào buffer, stream và các module native.</p>
</div>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Chương 10 đã đo phiên bản buffer của đúng vấn đề này trên chính codebase ấy: bốn lượt upload 120MB đồng thời đưa RSS từ 56,7MB lên <strong>786,1MB</strong>, và một file PNG 758KB chứa ảnh 16000×16000 tốn 99MB RSS để giải mã — tám cái là 445MB, sinh ra từ 5,9MB lưu lượng mạng. Không cái nào trong hai thứ đó hiện ra trong ảnh chụp heap. Cả hai đều được sửa theo đúng cách bài này kê đơn: một cái trần (<code>MAX_INPUT_PIXELS</code>, một hàng đợi tối đa bốn lượt giải mã đồng thời) được quyết định trước chứ không phải phát hiện ra giữa lúc sự cố. Khuôn mẫu cache không trần chính là cùng kiểu hỏng đó với một bộ mặt thân thiện hơn.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-324"><span class="lc-t">Code Lab · Performance, Caching, and Scaling</span><span class="lc-d">Đo bộ nhớ và cache có trần</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/observability-monitoring${REF}#module-992"><span class="lc-t">Code Lab · Debugging Production Incidents</span><span class="lc-d">Đọc ảnh chụp heap trong lúc căng thẳng</span></a>
</div>
</div>
`,
    },
    /* ─────────────────────────── 16.6 ─────────────────────────── */
    {
      title: '16.6 — Optimisations that are not: the 1,39× that bought 0,3%|||16.6 — Những phép tối ưu không phải là tối ưu: 1,39 lần mua được 0,3%',
      slug: 'nodejs-16-6-toi-uu-vo-ich',
      type: 'VIDEO',
      description: 'Đo một thư viện nổi tiếng nhanh gấp 1,39 lần rồi tính ra nó đóng góp 0,3% cho ứng dụng thật — kèm danh sách những phép tối ưu quen thuộc mà số đo trong chương này đã bác bỏ, và thứ tự đúng để tối ưu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.6</span>
<h2>Optimisations that are not: the 1,39× that bought 0,3%</h2>
<p class="lead">Five lessons of measurement produce a useful by-product: a list of things that sound like optimisations and are not. Every item below is something a competent developer might spend a day on, and every one is refuted by a number already in this chapter. The point is not that these techniques are worthless — it is that a speed-up in isolation means nothing until you know what fraction of the total it touches.</p>

<h3>Exhibit A: the faster serialiser</h3>
<p><code>fast-json-stringify</code> compiles a serialiser from a JSON Schema and is genuinely, measurably faster than <code>JSON.stringify</code>:</p>

<div class="out">tuần tự hoá 500 ghi chú (~112KB):

JSON.stringify                    0,258ms/lần    3.877/giây   112.593 B
fast-json-stringify (có schema)   0,186ms/lần    5.384/giây   112.593 B
chuỗi tính SẴN (không làm gì)     0,000ms/lần   85.080.750/giây

JSON.stringify 1 object nhỏ       2.862.251/giây   218 B
fast-json-stringify 1 object nhỏ  2.968.513/giây   218 B</div>

<p><strong>1,39× on a large payload, and nothing at all on a small one</strong> (2,86M against 2,97M per second is noise). Now put that against lesson 16.2's breakdown, where <code>JSON.stringify</code> was 0,8% of request time:</p>

<div class="out">JSON.stringify hiện tại:  0,043ms  = 0,8% thời gian mỗi request
nhanh hơn 1,39 lần:       0,031ms  → tiết kiệm 0,012ms
tổng mỗi request:         5,288ms  → cải thiện 0,23%</div>

<div class="danger">
<p><strong>A day of work, a schema to maintain forever, a new dependency, for 0,23%.</strong> And row three of that table shows what was available instead: pre-serialising made the same work <strong>22.000× faster</strong> by not doing it. The library optimises the step; the architecture removes it. When those two options are both on the table, the second one wins by a margin that makes the first irrelevant.</p>
</div>

<h3>The rest of the list, each with its number</h3>

<div class="kv-grid">
  <div class="kv"><span>Rewriting the regex</span><b>0.5% of CPU in lesson 16.1's profile. A perfect fix wins you half a percent</b></div>
  <div class="kv"><span>Raising gzip to level 9</span><b>3.2× slower, with a file LARGER than level 1 (4,310 vs 4,298 B)</b></div>
  <div class="kv"><span>Turning brotli up to 11</span><b>490× slower, a file 13% larger, and the server drops to 22 req/s</b></div>
  <div class="kv"><span>clustering an I/O-bound app</span><b>+5.7% for 10× the processes — and it breaks cron, caches and rate limits</b></div>
  <div class="kv"><span>Raising the DB pool to 50</span><b>Throughput FELL from 2,935 to 2,747. The queue only moved; it did not disappear</b></div>
  <div class="kv"><span>Swapping <code>let</code> for <code>const</code>, avoiding <code>forEach</code></span><b>Appears in no profile anywhere in this chapter. V8 already handles that</b></div>
</div>

<p>Two of those deserve a second look because they are worse than neutral. Raising gzip and brotli quality <em>costs</em> throughput and <em>produces larger files</em> — a change that is negative in both dimensions while feeling like tuning. And clustering an I/O-bound app buys 5,7% while introducing four separate classes of correctness bug. <strong>An optimisation that adds a bug is not a slow win; it is a loss.</strong></p>

<h3>Where the wins actually came from</h3>
<p>Set the failures against the successes measured in this same chapter, ordered by size:</p>

<div class="out">phép sửa                                       hệ số   thuộc loại
gửi ít trường hơn (365KB → 86KB)                2,8×   BỎ BỚT VIỆC
tuần tự hoá sẵn thay vì mỗi request              1,9×   LÀM MỘT LẦN
tính sẵn thay vì tính lại                        2,2×   LÀM MỘT LẦN
dùng lại kết nối (keep-alive)                    9,4×   BỎ BỚT VIỆC
cache Redis thay cho GROUP BY (chương 12)      120,0×   BỎ BỚT VIỆC
gộp N+1 for 1 truy vấn (chương 7)              5,6×   BỎ BỚT VIỆC
thêm chỉ mục cho cột đang lọc (chương 7)       222,0×   BỎ BỚT VIỆC
cluster cho việc NẶNG CPU                        3,4×   THÊM PHẦN CỨNG
fast-json-stringify                              1,39×  LÀM NHANH HƠN
viết lại regex                                   1,005× LÀM NHANH HƠN</div>

<p>The pattern is not subtle. <strong>Every large win removes work or does it once. Every small win makes the same work faster.</strong> "Make it faster" is the category people reach for first because it is the one that feels like engineering, and it is the category with the worst returns.</p>

<div class="lz-map">
  <div class="lz-node"><span class="lz-t">1. DO LESS WORK</span><span class="lz-d">Caching, indexes, fewer fields, fewer queries, reused connections. A factor of 5× to 200×. ALWAYS try this first</span></div>
  <div class="lz-node"><span class="lz-t">2. DO IT ONCE</span><span class="lz-d">Precompute, pre-serialise, batch, buffer writes. A factor of 2× to 20×</span></div>
  <div class="lz-node"><span class="lz-t">3. DO IT SOMEWHERE ELSE</span><span class="lz-d">Background queues, a CDN, nginx compressing instead of Node. Not faster, but off the user's critical path</span></div>
  <div class="lz-node"><span class="lz-t">4. ADD HARDWARE</span><span class="lz-d">clustering, more containers. Linear, costs real money, and only works when you are CPU-bound</span></div>
  <div class="lz-node"><span class="lz-t">5. MAKE IT FASTER</span><span class="lz-d">A faster library, a cleverer algorithm, micro-optimisation. A factor of 1.0× to 1.4×. DO THIS LAST</span></div>
</div>

<h3>The three questions before any optimisation</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">What percentage of the TOTAL is it?</span><span class="lz-d">If you do not know, go and measure (16.1, 16.2). If it is under 5%, stop right here</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">Can it be REMOVED ENTIRELY rather than made faster?</span><span class="lz-d">Cache it, precompute it, send less. Almost always the bigger win</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">How much harder does it make the code to understand?</span><span class="lz-d">5% faster with twice the bugs is a bad trade. Write the REASON next to every optimisation</span></div>
</div>

<div class="callout">
<p><strong>When micro-optimisation <em>is</em> right.</strong> Three cases. Inside a loop that runs millions of times — chapter 12 measured a pipeline beating sequential Redis commands by 63× for exactly this reason. In a hot path the profile actually named, like the 16,9% <code>stringify</code> line in lesson 16.1. And in a library other people's hot paths run through, where your 1,39× is multiplied by every caller. Outside those three, it is a hobby.</p>
</div>

<h3>Knowing when to stop</h3>
<p>Optimisation has no natural end, so it needs an artificial one. Define it before starting: a target p95 for the routes users actually wait on, tied to a real requirement. "p95 under 300ms for the feed" is a goal you can finish. "Make it faster" is one you cannot.</p>
<p>The other stopping rule is economic. A day of engineering time costs more than a month of the extra VPS that would have absorbed the same load — unless the optimisation removes a scaling <em>limit</em> rather than a scaling cost. Chapter 12's 120× cache and chapter 7's 222× index changed what the system is capable of. A 1,39× serialiser changes an invoice.</p>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> Every performance change in this project's history falls in the top two categories, and none in the last. Redis caching (120×), indexes on filtered columns (222×), cursor pagination instead of <code>OFFSET</code> (181×), collapsing N+1 into <code>include</code> (5,6×), streaming uploads instead of buffering (6× less RAM), Cloudflare caching the media domain (origin bytes → zero). Not one of them was a faster library or a cleverer loop. The site is written in ordinary, readable JavaScript and is fast because of what it <em>does not do</em> — which is the conclusion this whole chapter has been walking toward from six different directions.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-324"><span class="lc-t">Code Lab · Performance, Caching, and Scaling</span><span class="lc-d">Choosing what to optimise, in order</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-621"><span class="lc-t">Code Lab · Advanced Patterns and Architectural Decisions</span><span class="lc-d">Trade-offs that survive contact with production</span></a>
</div>
<div class="pitfall">
<p><strong>Trap — optimising the part of the request you can see, not the part that takes the time.</strong> The serialiser is in your code, so it is where attention goes; the 40 ms database round trip is behind a library call and reads as one line. That is how a 1.39× faster JSON encoder buys 0.3% of a request — the thing you improved was 2% of the total. Amdahl&#39;s law is the whole lesson, and it is measurable before you start: profile, find what fraction the candidate actually occupies, and compute the ceiling. If the ceiling is under a few percent, the honest answer is to not do the work — and to write down the number, so the next person does not re-propose it.</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.6</span>
<h2>Những phép tối ưu không phải là tối ưu: 1,39 lần mua được 0,3%</h2>
<p class="lead">Năm bài đo đạc vừa rồi sinh ra một sản phẩm phụ rất hữu dụng: một danh sách những thứ nghe như tối ưu mà không phải. Mỗi mục dưới đây đều là thứ mà một lập trình viên có nghề có thể bỏ ra một ngày để làm, và mỗi mục đều bị bác bỏ bởi một con số đã có sẵn trong chương này. Ý ở đây không phải các kỹ thuật ấy vô giá trị — mà là <em>một phép tăng tốc đứng một mình chẳng nói lên điều gì cho tới khi bạn biết nó chạm vào bao nhiêu phần trăm của tổng thể.</em></p>

<h3>Vật chứng A: bộ tuần tự hoá nhanh hơn</h3>
<p><code>fast-json-stringify</code> biên dịch một bộ tuần tự hoá từ JSON Schema và thật sự nhanh hơn <code>JSON.stringify</code>, đo được hẳn hoi:</p>

<div class="out">tuần tự hoá 500 ghi chú (~112KB):

JSON.stringify                    0,258ms/lần    3.877/giây   112.593 B
fast-json-stringify (có schema)   0,186ms/lần    5.384/giây   112.593 B
chuỗi tính SẴN (không làm gì)     0,000ms/lần   85.080.750/giây

JSON.stringify 1 object nhỏ       2.862.251/giây   218 B
fast-json-stringify 1 object nhỏ  2.968.513/giây   218 B</div>

<p><strong>Nhanh gấp 1,39 lần với payload lớn, và không hơn gì với object nhỏ</strong> (2,86 triệu so với 2,97 triệu mỗi giây là nhiễu). Giờ đặt con số đó cạnh bảng phân rã của bài 16.2, nơi <code>JSON.stringify</code> chiếm 0,8% thời gian request:</p>

<div class="out">JSON.stringify hiện tại:  0,043ms  = 0,8% thời gian mỗi request
nhanh hơn 1,39 lần:       0,031ms  → tiết kiệm 0,012ms
tổng mỗi request:         5,288ms  → cải thiện 0,23%</div>

<div class="danger">
<p><strong>Một ngày công, một cái schema phải nuôi mãi mãi, một phụ thuộc mới, đổi lấy 0,23%.</strong> Và dòng thứ ba của bảng đó cho thấy thứ đang có sẵn để thay thế: tuần tự hoá sẵn làm cùng công việc ấy <strong>nhanh gấp 22.000 lần</strong> bằng cách không làm nó. Thư viện tối ưu <em>cái bước</em>; kiến trúc thì <em>xoá bỏ</em> nó. Khi cả hai lựa chọn cùng nằm trên bàn, cái thứ hai thắng với khoảng cách khiến cái thứ nhất trở nên không đáng nhắc.</p>
</div>

<h3>Phần còn lại của danh sách, mỗi mục kèm con số</h3>

<div class="kv-grid">
  <div class="kv"><span>Viết lại regex</span><b>0,5% CPU trong profile ở bài 16.1. Sửa hoàn hảo cũng chỉ được nửa phần trăm</b></div>
  <div class="kv"><span>Nâng gzip lên level 9</span><b>Chậm hơn 3,2 lần, file TO HƠN level 1 (4.310 so với 4.298 B)</b></div>
  <div class="kv"><span>Bật brotli mức 11</span><b>Chậm hơn 490 lần, file to hơn 13%, máy chủ tụt còn 22 req/giây</b></div>
  <div class="kv"><span>cluster cho app nghẽn I/O</span><b>+5,7% với 10 lần số tiến trình — và phá vỡ cron, cache, rate limit</b></div>
  <div class="kv"><span>Nâng pool DB lên 50</span><b>Throughput GIẢM 2.935 → 2.747. Hàng đợi chỉ dời chỗ chứ không biến mất</b></div>
  <div class="kv"><span>Đổi <code>let</code> thành <code>const</code>, tránh <code>forEach</code></span><b>Không xuất hiện trong bất kỳ profile nào ở chương này. V8 đã lo phần đó</b></div>
</div>

<p>Hai mục trong đó đáng nhìn lại lần nữa vì chúng còn tệ hơn cả trung tính. Nâng mức nén của gzip và brotli vừa <em>làm giảm</em> throughput vừa <em>cho ra file to hơn</em> — một thay đổi âm ở cả hai chiều trong khi mang lại cảm giác đang tinh chỉnh. Còn cluster hoá một app nghẽn I/O mua được 5,7% trong khi đưa vào bốn lớp lỗi tính đúng đắn khác nhau. <strong>Một phép tối ưu kèm theo một con bug không phải một chiến thắng nhỏ; đó là một khoản lỗ.</strong></p>

<h3>Những chiến thắng thật ra đến từ đâu</h3>
<p>Đặt các thất bại cạnh những thành công đã đo trong cùng chương này, xếp theo độ lớn:</p>

<div class="out">phép sửa                                       hệ số   thuộc loại
gửi ít trường hơn (365KB → 86KB)                2,8×   BỎ BỚT VIỆC
tuần tự hoá sẵn thay vì mỗi request              1,9×   LÀM MỘT LẦN
tính sẵn thay vì tính lại                        2,2×   LÀM MỘT LẦN
dùng lại kết nối (keep-alive)                    9,4×   BỎ BỚT VIỆC
cache Redis thay cho GROUP BY (chương 12)      120,0×   BỎ BỚT VIỆC
gộp N+1 thành 1 truy vấn (chương 7)              5,6×   BỎ BỚT VIỆC
thêm chỉ mục cho cột đang lọc (chương 7)       222,0×   BỎ BỚT VIỆC
cluster cho việc NẶNG CPU                        3,4×   THÊM PHẦN CỨNG
fast-json-stringify                              1,39×  LÀM NHANH HƠN
viết lại regex                                   1,005× LÀM NHANH HƠN</div>

<p>Khuôn mẫu ở đây không hề tinh vi. <strong>Mọi chiến thắng lớn đều BỎ BỚT việc hoặc làm nó MỘT LẦN. Mọi chiến thắng nhỏ đều làm cùng công việc ấy nhanh hơn.</strong> "Làm cho nó nhanh hơn" là hạng mục người ta với tới đầu tiên vì đó là hạng mục cho cảm giác đang làm kỹ thuật, và nó là hạng mục có lợi suất tệ nhất.</p>

<div class="lz-map">
  <div class="lz-node"><span class="lz-t">1. BỎ BỚT VIỆC</span><span class="lz-d">Cache, chỉ mục, bớt trường, bớt truy vấn, dùng lại kết nối. Hệ số 5× tới 200×. LUÔN thử trước</span></div>
  <div class="lz-node"><span class="lz-t">2. LÀM MỘT LẦN</span><span class="lz-d">Tính sẵn, tuần tự hoá sẵn, gom lô, ghi có đệm. Hệ số 2× tới 20×</span></div>
  <div class="lz-node"><span class="lz-t">3. LÀM CHỖ KHÁC</span><span class="lz-d">Hàng đợi nền, CDN, để nginx nén thay Node. Không nhanh hơn, nhưng dời khỏi đường găng của người dùng</span></div>
  <div class="lz-node"><span class="lz-t">4. THÊM PHẦN CỨNG</span><span class="lz-d">cluster, thêm container. Tuyến tính, tốn tiền thật, chỉ ăn khi nghẽn CPU</span></div>
  <div class="lz-node"><span class="lz-t">5. LÀM NHANH HƠN</span><span class="lz-d">Thư viện nhanh hơn, thuật toán khéo hơn, vi tối ưu. Hệ số 1,0× tới 1,4×. LÀM SAU CÙNG</span></div>
</div>

<h3>Ba câu hỏi trước mọi phép tối ưu</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-n">1</span><span class="lz-t">Nó chiếm bao nhiêu phần trăm TỔNG?</span><span class="lz-d">Không biết thì đi đo (16.1, 16.2). Nếu dưới 5% thì dừng lại ngay tại đây</span></div>
  <div class="lz-step"><span class="lz-n">2</span><span class="lz-t">Có thể BỎ HẲN thay vì làm nhanh hơn không?</span><span class="lz-d">Cache, tính sẵn, gửi ít đi. Gần như luôn thắng đậm hơn</span></div>
  <div class="lz-step"><span class="lz-n">3</span><span class="lz-t">Nó làm code khó hiểu thêm bao nhiêu?</span><span class="lz-d">Nhanh 5% mà bug nhiều gấp đôi là một phép đánh đổi tồi. Ghi lại LÝ DO cạnh mọi chỗ tối ưu</span></div>
</div>

<div class="callout">
<p><strong>Khi nào thì vi tối ưu <em>đúng</em>.</strong> Ba trường hợp. Bên trong một vòng lặp chạy hàng triệu lần — chương 12 đo được pipeline thắng lệnh Redis tuần tự 63 lần đúng vì lý do này. Trong một đường nóng mà profile đã gọi đích danh, như dòng <code>stringify</code> 16,9% ở bài 16.1. Và trong một thư viện mà đường nóng của người khác chạy xuyên qua, nơi 1,39 lần của bạn được nhân với mọi người gọi tới. Ngoài ba trường hợp đó, nó là một thú vui.</p>
</div>

<h3>Biết lúc nào thì dừng</h3>
<p>Việc tối ưu không có điểm kết thúc tự nhiên, nên nó cần một điểm kết thúc nhân tạo. Hãy định nghĩa nó trước khi bắt đầu: một mục tiêu p95 cho những route mà người dùng thật sự phải chờ, gắn với một yêu cầu có thật. "p95 dưới 300ms cho trang feed" là một mục tiêu bạn hoàn thành được. "Làm cho nó nhanh hơn" thì không.</p>
<p>Quy tắc dừng còn lại mang tính kinh tế. Một ngày công kỹ sư đắt hơn một tháng tiền VPS phụ trội vốn đã hấp thụ được đúng lượng tải ấy — trừ khi phép tối ưu gỡ bỏ một <em>giới hạn</em> mở rộng chứ không phải một <em>chi phí</em> mở rộng. Cache 120 lần của chương 12 và chỉ mục 222 lần của chương 7 đã thay đổi <em>khả năng</em> của hệ thống. Một bộ tuần tự hoá nhanh 1,39 lần thì chỉ thay đổi một tờ hoá đơn.</p>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Mọi thay đổi về hiệu năng trong lịch sử dự án này đều rơi vào hai hạng mục đầu, và không cái nào rơi vào hạng mục cuối. Cache Redis (120×), chỉ mục cho cột đang lọc (222×), phân trang bằng con trỏ thay cho <code>OFFSET</code> (181×), gộp N+1 thành <code>include</code> (5,6×), upload theo dòng thay vì gom đệm (ít RAM hơn 6 lần), Cloudflare cache tên miền media (byte từ máy gốc về 0). Không một cái nào là "thư viện nhanh hơn" hay "vòng lặp khéo hơn". Site này được viết bằng JavaScript bình thường, dễ đọc, và nó nhanh nhờ vào những thứ nó <em>không làm</em> — chính là kết luận mà cả chương này đã đi tới từ sáu hướng khác nhau.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-324"><span class="lc-t">Code Lab · Performance, Caching, and Scaling</span><span class="lc-d">Chọn tối ưu cái gì, theo thứ tự nào</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-621"><span class="lc-t">Code Lab · Advanced Patterns and Architectural Decisions</span><span class="lc-d">Những đánh đổi sống sót được khi va vào production</span></a>
</div>
<div class="pitfall">
<p><strong>Bẫy — tối ưu cái phần của request mà bạn NHÌN THẤY, chứ không phải cái phần tốn thời gian.</strong> Bộ tuần tự hoá nằm trong mã của bạn, nên sự chú ý dồn vào đó; còn 40 ms đi về cơ sở dữ liệu thì nằm sau một lời gọi thư viện và đọc lên chỉ là một dòng. Đó là cách một bộ mã hoá JSON nhanh hơn 1,39 lần mua được 0,3% của một request — thứ bạn cải thiện chiếm có 2% tổng số. Định luật Amdahl chính là toàn bộ bài học, và nó đo được TRƯỚC khi bắt đầu: hãy chạy profiler, tìm xem ứng viên đó thật sự chiếm bao nhiêu phần, rồi tính ra cái trần. Nếu cái trần dưới vài phần trăm thì câu trả lời thành thật là ĐỪNG làm — và hãy ghi con số đó lại, để người sau không đề xuất lại nó.</p>
</div>
</div>
`,
    },
    /* ─────────────────────────── 16.7 ─────────────────────────── */
    {
      title: '16.7 — Chapter 16 quiz|||16.7 — Kiểm tra chương 16',
      slug: 'nodejs-16-7-quiz',
      type: 'QUIZ',
      description: 'Mười câu về profiling, nút thắt thật, nén, cluster, rò rỉ bộ nhớ và thứ tự tối ưu — mỗi câu đều được phân định bởi một phép đo trong bài 16.1 tới 16.6.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every question below is settled by a measurement in lessons 16.1 to 16.6 — the regex everyone suspected that turned out to be 0,5% of the CPU, the database query that took 0,030ms inside PostgreSQL and 5,107ms inside the application, the compression setting that was 490× slower for a larger file, the ten worker processes that bought 5,7%, and the famous fast library that improved a real endpoint by 0,23%. Performance is the topic where confident intuition is most reliably expensive, so read the numbers before answering.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mọi câu dưới đây đều được phân định bởi một phép đo trong bài 16.1 tới 16.6 — cái regex ai cũng nghi ngờ mà hoá ra chiếm 0,5% CPU, câu truy vấn mất 0,030ms bên trong PostgreSQL và 5,107ms bên trong ứng dụng, mức nén chậm hơn 490 lần mà cho ra file to hơn, mười tiến trình worker mua được 5,7%, và cái thư viện nhanh nổi tiếng cải thiện một endpoint thật được 0,23%. Hiệu năng là chủ đề mà trực giác tự tin thường xuyên tốn tiền nhất, nên hãy đọc số trước khi trả lời.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 800,
        questions: [
          {
            question: 'A CPU profile of a slow route showed: stringify 16,9%, renderNote 15,9%, crypto hash 14,5% across four lines, slugify 3,3%, and the regex itself 0,5%. Before profiling, the team had planned to rewrite the regex. What is the correct lesson?|||Một CPU profile của route chậm cho thấy: stringify 16,9%, renderNote 15,9%, băm crypto 14,5% chia trên bốn dòng, slugify 3,3%, và bản thân cái regex 0,5%. Trước khi đo, cả đội đã định viết lại cái regex. Bài học đúng ở đây là gì?',
            options: [
              'The profile was taken incorrectly, since regexes are known to be slow in V8|||Profile bị lấy sai, vì regex vốn nổi tiếng là chậm trong V8',
              'Intuition about hot paths is unreliable — a perfect regex rewrite caps out at 0,5%, while the profile points at repeated per-request work that is worth an order of magnitude more|||Trực giác về đường nóng là không đáng tin — viết lại regex hoàn hảo cũng chỉ trần 0,5%, trong khi profile chỉ vào công việc bị làm lại ở mỗi request, thứ đáng giá gấp hàng chục lần',
              'The regex should still be rewritten first because it is the easiest change|||Vẫn nên viết lại regex trước vì đó là thay đổi dễ nhất',
              'Profiles measure sampled time, so percentages under 5% should be ignored entirely|||Profile đo thời gian lấy mẫu, nên mọi tỉ lệ dưới 5% đều nên bỏ qua hoàn toàn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Four optimisations were applied to the same route in order: precompute (305 → 662 req/s), pre-serialise (→ 1.270), send fewer fields (→ 3.550, payload 365KB → 86KB). No library was changed. What do all three fixes have in common?|||Bốn phép tối ưu được áp lần lượt lên cùng một route: tính sẵn (305 → 662 req/giây), tuần tự hoá sẵn (→ 1.270), gửi ít trường hơn (→ 3.550, payload 365KB → 86KB). Không thư viện nào bị đổi. Cả ba phép sửa có điểm gì chung?',
            options: [
              'They all replaced a slow function with a faster implementation of the same function|||Cả ba đều thay một hàm chậm bằng một cài đặt nhanh hơn của cùng hàm đó',
              'They all reduced memory allocation, which reduced garbage collection pressure|||Cả ba đều giảm cấp phát bộ nhớ, nhờ đó giảm áp lực lên bộ dọn rác',
              'They all removed work rather than speeding it up — the same result is computed once instead of per request, or not sent at all|||Cả ba đều BỎ BỚT việc chứ không làm việc đó nhanh hơn — cùng một kết quả được tính một lần thay vì mỗi request, hoặc không gửi đi nữa',
              'They all moved work off the main thread onto worker threads|||Cả ba đều chuyển việc ra khỏi luồng chính sang worker thread',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'A route measured 5,174ms in the database call (97,8% of request time), 0,071ms in JavaScript mapping and 0,043ms in JSON.stringify. If you made all the JavaScript infinitely fast — literally zero — what happens to throughput?|||Một route đo được 5,174ms ở lời gọi cơ sở dữ liệu (97,8% thời gian request), 0,071ms ở phép biến đổi JavaScript và 0,043ms ở JSON.stringify. Nếu bạn làm toàn bộ JavaScript nhanh vô hạn — tức bằng 0 — thì throughput ra sao?',
            options: [
              'It roughly doubles, because JavaScript execution and I/O overlap|||Nó tăng khoảng gấp đôi, vì việc chạy JavaScript và I/O chồng lên nhau',
              'It rises about 2%, from 1.954 to roughly 1.996 req/s — that 2% is the entire ceiling of code-level tuning on this route|||Nó tăng khoảng 2%, từ 1.954 lên chừng 1.996 req/giây — 2% đó là toàn bộ trần của việc tinh chỉnh ở tầng code trên route này',
              'It is unchanged, because the database call is asynchronous and does not block|||Nó không đổi, vì lời gọi cơ sở dữ liệu là bất đồng bộ và không chặn',
              'It cannot be predicted from a breakdown; only a new benchmark can answer it|||Không thể dự đoán từ bảng phân rã; chỉ một lần đo mới mới trả lời được',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'EXPLAIN ANALYZE reported the query took 0,030ms with 6 buffer hits, while the application measured 5,107ms for the same query — 170× more. Timing pool.connect() separately at pool sizes 1, 10 and 50 gave waits of 16,125ms, 0,516ms and 0,071ms with query times of 0,741ms, 2,995ms and 3,655ms. What is going on?|||EXPLAIN ANALYZE báo câu truy vấn mất 0,030ms với 6 lần trúng buffer, trong khi ứng dụng đo được 5,107ms cho cùng câu đó — gấp 170 lần. Bấm giờ pool.connect() riêng ở các cỡ pool 1, 10 và 50 cho ra thời gian chờ 16,125ms, 0,516ms và 0,071ms với thời gian truy vấn 0,741ms, 2,995ms và 3,655ms. Chuyện gì đang xảy ra?',
            options: [
              'EXPLAIN ANALYZE is unreliable and should not be used to reason about query cost|||EXPLAIN ANALYZE không đáng tin và không nên dùng để suy luận về giá của truy vấn',
              'The pg driver has a serialisation bug that adds 5ms of overhead per query|||Driver pg có lỗi tuần tự hoá làm cộng thêm 5ms phụ trội cho mỗi truy vấn',
              'Most of what the app calls "database time" is queueing, and enlarging the pool does not remove the queue — it moves it from your process into PostgreSQL, which is why query time rises as wait time falls|||Phần lớn cái mà ứng dụng gọi là "thời gian database" là XẾP HÀNG, và nới pool không xoá được hàng đợi — nó dời hàng đợi từ tiến trình của bạn vào PostgreSQL, đó là lý do thời gian truy vấn tăng khi thời gian chờ giảm',
              'The 5,107ms is network latency and can only be fixed by moving the database onto the same host|||5,107ms là độ trễ mạng và chỉ sửa được bằng cách dời cơ sở dữ liệu về cùng máy',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Throughput at pool sizes 1 / 5 / 10 / 25 / 50 was 1.154 / 2.865 / 2.935 / 2.808 / 2.747 req/s. What does the shape of that curve say about the advice "if the database is slow, raise the pool size"?|||Throughput ở các cỡ pool 1 / 5 / 10 / 25 / 50 là 1.154 / 2.865 / 2.935 / 2.808 / 2.747 req/giây. Hình dạng đường cong đó nói gì về lời khuyên "nếu cơ sở dữ liệu chậm thì nâng cỡ pool lên"?',
            options: [
              'It is correct up to a point and then actively harmful — past the concurrency the database can genuinely serve, extra connections only add scheduling overhead and throughput falls|||Nó đúng tới một điểm rồi trở thành có hại — vượt qua mức đồng thời mà cơ sở dữ liệu thật sự phục vụ nổi, kết nối thêm chỉ cộng chi phí điều phối và throughput tụt xuống',
              'It is always correct; the decline after 10 is measurement noise|||Nó luôn đúng; phần tụt sau mốc 10 là nhiễu đo đạc',
              'It is always wrong; the pool should always be exactly 1 to avoid contention|||Nó luôn sai; pool nên luôn bằng đúng 1 để tránh tranh chấp',
              'The curve proves the database was the bottleneck at every pool size|||Đường cong chứng minh cơ sở dữ liệu là nút thắt ở mọi cỡ pool',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Brotli compressed an 87KB response to 1.691 bytes in 0,31ms at quality 4, and to 1.918 bytes in 151,99ms at quality 11. Under load the quality-11 server served 22 req/s with a p50 of 873ms. What is the general principle?|||Brotli nén một phản hồi 87KB xuống 1.691 byte trong 0,31ms ở mức 4, và xuống 1.918 byte trong 151,99ms ở mức 11. Dưới tải, máy chủ ở mức 11 phục vụ được 22 req/giây với p50 873ms. Nguyên tắc tổng quát ở đây là gì?',
            options: [
              'Brotli should never be used for dynamic responses; gzip is always the correct choice|||Không bao giờ nên dùng brotli cho phản hồi động; gzip luôn là lựa chọn đúng',
              '"Higher quality is better" is an assumption, not a property — at quality 11 brotli was both 490× slower AND produced a 13% larger file, so maximum settings must be measured rather than assumed|||"Mức cao hơn thì tốt hơn" là một giả định chứ không phải một tính chất — ở mức 11 brotli vừa chậm hơn 490 lần VỪA cho ra file to hơn 13%, nên các mức tối đa phải được ĐO chứ không phải mặc định là tốt',
              'The measurement is wrong; a higher compression level cannot produce a larger file|||Phép đo sai; mức nén cao hơn không thể cho ra file to hơn được',
              'Quality 11 is fine as long as responses are cached after the first compression|||Mức 11 vẫn ổn miễn là phản hồi được cache lại sau lần nén đầu tiên',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Forking the same app into 1 → 10 workers took a CPU-heavy route from 8.708 to 29.542 req/s but an I/O-heavy route from only 1.253 to 1.325 req/s, with 40 sample requests confirming all 10 processes were being used. Why the difference?|||Rẽ cùng một app thành 1 → 10 worker đưa một route nặng CPU từ 8.708 lên 29.542 req/giây nhưng route nặng I/O chỉ từ 1.253 lên 1.325 req/giây, với 40 request mẫu xác nhận cả 10 tiến trình đều được dùng. Vì sao khác nhau?',
            options: [
              'The I/O route was rate-limited by the load generator rather than by the server|||Route I/O bị chính bộ sinh tải giới hạn tốc độ chứ không phải bị máy chủ giới hạn',
              'Waiting was never competing for a CPU core — one event loop holds thousands of pending awaits, so extra processes have nothing to contribute to work that is idle|||Việc CHỜ chưa bao giờ tranh giành một nhân CPU — một event loop giữ được hàng nghìn phép await đang treo, nên tiến trình thêm vào không đóng góp được gì cho công việc vốn đang rảnh',
              'Cluster does not distribute I/O requests correctly; that requires sticky sessions|||Cluster không chia request I/O đúng cách; việc đó cần sticky session',
              'The 30ms await should have been replaced with a worker_threads call|||Phép await 30ms lẽ ra phải được thay bằng một lời gọi worker_threads',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A healthy Express app went from 56,6MB RSS to 122,5MB after 20.000 requests, then 123,3MB and 123,4MB after 50.000 and 100.000. A leaking version went 57 → 162 → 232 → 351,5MB. How do you tell a leak from normal heap growth?|||Một app Express khoẻ mạnh đi từ 56,6MB RSS lên 122,5MB sau 20.000 request, rồi 123,3MB và 123,4MB sau 50.000 và 100.000. Bản bị rò rỉ thì đi 57 → 162 → 232 → 351,5MB. Làm sao phân biệt rò rỉ với việc heap lớn lên bình thường?',
            options: [
              'Any RSS above 100MB for a simple Express app indicates a leak|||Bất kỳ mức RSS nào trên 100MB với một app Express đơn giản đều là dấu hiệu rò rỉ',
              'Memory that rises and then plateaus is V8 sizing its heap; memory that keeps rising linearly with traffic is a leak — which means one data point can never answer the question, only a trend can|||Bộ nhớ tăng rồi đi ngang là V8 nới heap tới cỡ làm việc; bộ nhớ cứ tăng tuyến tính theo lưu lượng là rò rỉ — nghĩa là một điểm dữ liệu không bao giờ trả lời được câu hỏi này, chỉ có xu hướng mới trả lời được',
              'Only a heap snapshot can distinguish them; RSS is not a usable signal|||Chỉ ảnh chụp heap mới phân biệt được; RSS không phải một tín hiệu dùng được',
              'A leak is confirmed when RSS exceeds the --max-old-space-size limit|||Rò rỉ được xác nhận khi RSS vượt quá giới hạn --max-old-space-size',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Node printed: "MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 customEvent listeners added to [process]. MaxListeners is 10. Use emitter.setMaxListeners() to increase limit". What is the correct response?|||Node in ra: "MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 customEvent listeners added to [process]. MaxListeners is 10. Use emitter.setMaxListeners() to increase limit". Phản ứng đúng là gì?',
            options: [
              'Call setMaxListeners(1000) as the message suggests, since 11 listeners is not a lot|||Gọi setMaxListeners(1000) như thông điệp gợi ý, vì 11 listener thì có nhiều nhặn gì',
              'Suppress the warning with NODE_NO_WARNINGS since it is noisy in production logs|||Tắt cảnh báo bằng NODE_NO_WARNINGS vì nó gây ồn trong log production',
              'Find who registers without removing — the warning has a very high true-positive rate, and raising the limit silences the alarm while keeping the leak|||Đi tìm xem ai đăng ký mà không gỡ — cảnh báo này có tỉ lệ báo đúng rất cao, và nâng giới hạn chỉ tắt chuông báo trong khi giữ nguyên chỗ rò rỉ',
              'Switch from process events to a custom EventEmitter, which does not have this limit|||Chuyển từ sự kiện của process sang một EventEmitter riêng, vốn không có giới hạn này',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'fast-json-stringify was measured at 1,39× faster than JSON.stringify on a large payload. In the real endpoint from lesson 16.2, JSON.stringify was 0,043ms of a 5,288ms request. Meanwhile pre-serialising the same payload was measured at 85 million operations per second versus 3.877. What should you do?|||fast-json-stringify được đo là nhanh gấp 1,39 lần JSON.stringify với payload lớn. Trong endpoint thật ở bài 16.2, JSON.stringify chiếm 0,043ms của một request 5,288ms. Trong khi đó, tuần tự hoá sẵn cùng payload ấy đo được 85 triệu thao tác mỗi giây so với 3.877. Bạn nên làm gì?',
            options: [
              'Adopt fast-json-stringify — 1,39× is a real, measured improvement and every bit helps|||Dùng fast-json-stringify — 1,39 lần là cải thiện thật, đo được, và góp gió thành bão',
              'Adopt both: fast-json-stringify for dynamic payloads and pre-serialisation for static ones|||Dùng cả hai: fast-json-stringify cho payload động và tuần tự hoá sẵn cho payload tĩnh',
              'Neither — 0,8% of request time is below the threshold worth touching at all|||Không dùng cái nào — 0,8% thời gian request là dưới ngưỡng đáng động vào',
              'Prefer pre-serialisation where the payload allows it: the library speeds the step up by 1,39× for 0,23% of total, while removing the step entirely is 22.000× — optimisations that eliminate work beat optimisations that accelerate it|||Ưu tiên tuần tự hoá sẵn ở nơi payload cho phép: thư viện làm bước đó nhanh gấp 1,39 lần đổi lấy 0,23% tổng thể, trong khi xoá hẳn bước đó là gấp 22.000 lần — phép tối ưu LOẠI BỎ việc thắng phép tối ưu TĂNG TỐC việc',
            ],
            correctIndex: 3,
            points: 1,
          },
        ],
      },
    },
    /* END-LESSONS */
  ],
};
