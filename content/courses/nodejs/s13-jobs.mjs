/**
 * Node.js — Chương 13: Tác vụ nền và hàng đợi (BullMQ).
 * Mọi output là đo thật: Node v22.21.0, bullmq 5.81.2, ioredis 5.11.1,
 * Redis 7.4.9 trong Docker, express 5.2.1.
 * Cấu hình production lấy từ src/services/cron.service.ts và
 * src/services/embedQueue.service.ts của chính cuongthai.com.
 */
const REF = '?ref=%2Fcourses%2Fnodejs%2Flearn&reflabel=Node.js';

export default {
  title: 'Chapter 13 — Background jobs and queues|||Chương 13 — Tác vụ nền và hàng đợi',
  description: 'Vì sao 95 trong 100 email biến mất khi bạn gửi thẳng trong request, một job trông thế nào bên trong Redis, thử lại chỉ an toàn khi việc idempotent, lịch chạy phải nằm ngoài tiến trình, và điều gì xảy ra với job đang chạy dở mỗi lần bạn deploy.',
  lessons: [
    /* ─────────────────────────── 13.1 ─────────────────────────── */
    {
      title: '13.1 — A request is not a place to do work|||13.1 — Request không phải chỗ để làm việc nặng',
      slug: 'nodejs-13-1-vi-sao-hang-doi',
      simulation: {
        url: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-13-1-vi-sao-hang-doi.mp4',
        poster: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-13-1-vi-sao-hang-doi.jpg',
        scenario: 'webhook',
        durationSeconds: 11,
        caption: { en: "Answer 200 first, do the work after", vi: "Trả 200 trước, làm việc sau" },
      },
      type: 'VIDEO',
      description: 'Cùng một tính năng gửi email, cùng 100 request: làm ngay trong request gửi được 5 email và mất hẳn 95; đẩy vào hàng đợi gửi đủ 100. Có bằng chứng chạy thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.1</span>
<h2>A request is not a place to do work</h2>
<p class="lead">Twelve chapters have treated an HTTP request as the unit of everything: validate, query, respond. That model has one hard boundary, and you cross it the first time a route needs to do something that is <em>not</em> about producing this response — send a welcome email, generate a thumbnail, rebuild a search index, call a payment provider. This lesson measures what happens when you do that work inline, and it is worse than "the user waits longer".</p>

<h3>What actually goes wrong</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-t">The user has to wait</span><span class="lz-d">your latency is now the latency of the slowest party in the chain. You do not control it</span></div>
  <div class="lz-step"><span class="lz-t">A failure loses it outright</span><span class="lz-d">the other side errors → the request 500s → the work vanishes, with no trace left to retry from</span></div>
  <div class="lz-step"><span class="lz-t">No brakes</span><span class="lz-d">1,000 simultaneous sign-ups = 1,000 concurrent SMTP connections, against a server that can take 5</span></div>
  <div class="lz-step"><span class="lz-t">A deploy cuts straight through</span><span class="lz-d">SIGTERM in the middle of an outbound call — lesson 13.5 measures exactly this</span></div>
</div>

<h3>Measurement 1 — the user's latency</h3>
<p>A route that sends an email inline (300ms) versus one that enqueues the job and returns <code>202 Accepted</code>:</p>
<div class="out">=== 50 request đồng thời ===
/sync  (làm ngay)   : trung vị 368,8ms · p95 370,7ms · tổng 387,2ms
/async (vào hàng đợi): trung vị  20,1ms · p95  21,3ms · tổng  23,7ms
   → người dùng thấy nhanh hơn 17× ở p95
   worker xử lý xong 50 email trong 930,4ms sau khi request đã trả lời xong

=== 200 request đồng thời ===
/sync  (làm ngay)   : trung vị 379,1ms · p95 385,7ms
/async (vào hàng đợi): trung vị  51,0ms · p95  54,9ms
   → người dùng thấy nhanh hơn 7× ở p95</div>
<p>17× at p95, and — note the honest detail — the gap <em>narrows</em> to 7× at 200 concurrent, because enqueuing is not free either: it is a Redis round trip, and lesson 12.1 taught you what those cost. This is the boring half of the argument. The interesting half is next.</p>

<h3>Measurement 2 — the one that changes your mind</h3>
<p>Now make the external service realistic. A real SMTP server, a real payment API, a real third-party anything accepts a <strong>limited number of concurrent connections</strong> and rejects the rest. Here it accepts 5, takes 200ms per message, and answers <code>421 Too many concurrent connections</code> beyond that. One hundred users sign up at the same moment:</p>
<div class="out">--- 100 request đồng thời, SMTP chỉ chịu 5 kết nối, mỗi email 200ms ---

A) LÀM NGAY trong request:
   HTTP 200: 5 | HTTP 500: 95
   email gửi được: 5 / 100  ·  bị SMTP từ chối: 95
   đỉnh kết nối đồng thời tới SMTP: 5
   độ trễ p95 272,1ms
   ⇒ 95 email MẤT HẲN. Người dùng nhận 500 và không có cách nào lấy lại.

B) ĐẨY VÀO HÀNG ĐỢI, worker concurrency=5:
   HTTP 202: 100 | lỗi: 0
   độ trễ p95 người dùng thấy: 48,2ms
   email gửi được: 100 / 100  ·  bị SMTP từ chối (rồi thử lại): 0
   đỉnh kết nối đồng thời tới SMTP: 5
   worker rút cạn hàng đợi trong 4126,0ms
   hoàn tất: 100 · thất bại hẳn: 0</div>
<p><strong>5 emails out of 100 versus 100 out of 100.</strong> That is not a performance difference, it is a correctness difference. The synchronous version did not send slowly — it <em>did not send at all</em>, for 95 people, permanently, and reported HTTP 500 to each of them.</p>
<p>And look at the third line of each block: peak concurrent connections to SMTP was <strong>5 in both cases</strong>. The queue did not make the downstream faster. It made your system stop asking for more than the downstream can give, and it remembered the rest instead of dropping it. A queue is, first and foremost, a place to <em>put things down</em>.</p>

<h3>The shape of the change</h3>
<pre><code class="language-javascript">// TRƯỚC — route tự làm hết
app.post('/register', async (req, res) =&gt; {
  const user = await createUser(req.body);
  await sendWelcomeEmail(user.email);      // 300ms, có thể hỏng, hỏng là mất
  res.status(201).json(user);
});

// SAU — route chỉ ghi nhận việc cần làm
app.post('/register', async (req, res) =&gt; {
  const user = await createUser(req.body);
  await emailQueue.add('welcome', { userId: user.id }, {
    attempts: 5,
    backoff: { type: 'exponential', delay: 1000 },
  });
  res.status(201).json(user);              // trả lời NGAY
});</code></pre>
<p>Three details in that diff are load-bearing. The job carries <strong><code>userId</code>, not the whole user object</strong> — the worker re-reads from the database, so it never acts on a stale snapshot from ten minutes ago. The <code>attempts</code>/<code>backoff</code> pair is what turns "the email failed" into "the email was late" (lesson 13.3). And the response is still <code>201</code> here because the <em>user</em> really was created; use <code>202 Accepted</code> when the resource itself is not ready yet.</p>

<h3>What belongs in a queue, and what does not</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Belongs on a queue</span><span class="v">sending email/SMS/push · calling third-party APIs · generating thumbnails, transcoding video · rebuilding search indexes · exporting reports · outbound webhooks · periodic cleanup</span></div>
  <div class="kv"><span class="k">Does NOT belong</span><span class="v">anything whose answer is needed IMMEDIATELY (password checks, data reads) · work that must run in the SAME transaction as the write · work cheaper than the cost of enqueueing it</span></div>
</div>
<p>That last exclusion matters more than it sounds. Enqueuing costs a Redis round trip plus a worker wake-up. If the work itself takes 2ms, you have made it slower and added a moving part.</p>

<h3>The UX bill you just signed</h3>
<p>Moving work out of the request does not make it free — it moves the problem to the interface. The user got <code>202</code> and now has a question you must answer: <em>did it work?</em> Three honest answers, in increasing order of effort: say nothing and let the result appear (fine for a welcome email); expose a status endpoint the client polls (<code>GET /jobs/:id</code>, returning <code>pending | done | failed</code>); or push the result over the socket from chapter 11. Pick one deliberately. The failure mode of asynchronous work is not an error message, it is a user who never finds out.</p>

<div class="pitfall">
<p><strong>Do not enqueue inside a database transaction.</strong> If you <code>queue.add()</code> before <code>COMMIT</code>, the worker can pick the job up, read the database and find nothing there — the row does not exist yet. Worse, if the transaction then rolls back, you have a job for a user who was never created. Enqueue <em>after</em> the commit succeeds; and if losing the job between commit and enqueue is unacceptable, write the job into the same transaction as a row in your own table and let a sweeper move it into the queue (the transactional outbox pattern).</p>
</div>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> Document uploads for the AI knowledge base do exactly this split, and <code>src/services/embedQueue.service.ts</code> opens with a comment explaining the decision: the upload endpoint returns immediately while chunking and embedding happen in the background. The honest part is what it chose <em>instead</em> of BullMQ — an in-process array queue — with the trade-off written down in the file: "if the process crashes mid-job, in-flight jobs are lost", mitigated by making jobs idempotent and marking documents <code>pending | processing | ready | failed</code> so a recovery scan can find stuck ones. That is a defensible choice for one process. Lesson 13.5 measures precisely what it costs.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-617"><span class="lc-t">Code Lab · Message Queues and Event-Driven Architecture</span><span class="lc-d">Queues, events and asynchronous architecture in Node.js</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.1</span>
<h2>Request không phải chỗ để làm việc nặng</h2>
<p class="lead">Mười hai chương vừa rồi đều coi một request HTTP là đơn vị của mọi thứ: kiểm dữ liệu, truy vấn, trả lời. Mô hình đó có đúng một ranh giới cứng, và bạn bước qua nó ngay lần đầu tiên một route phải làm việc gì đó <em>không</em> nhằm dựng nên chính phản hồi này — gửi email chào mừng, tạo ảnh thu nhỏ, dựng lại chỉ mục tìm kiếm, gọi cổng thanh toán. Bài này đo xem chuyện gì xảy ra khi bạn làm việc đó ngay trong request, và nó tệ hơn nhiều so với "người dùng phải chờ lâu hơn".</p>

<h3>Cái gì thật sự hỏng</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-t">Người dùng phải chờ</span><span class="lz-d">độ trễ của bạn giờ bằng độ trễ của bên chậm nhất trong chuỗi. Bạn không kiểm soát nó</span></div>
  <div class="lz-step"><span class="lz-t">Hỏng là mất hẳn</span><span class="lz-d">bên kia trả lỗi → request 500 → công việc biến mất, không còn dấu vết để thử lại</span></div>
  <div class="lz-step"><span class="lz-t">Không có phanh</span><span class="lz-d">1.000 người đăng ký cùng lúc = 1.000 kết nối đồng thời tới SMTP, dù nó chỉ chịu được 5</span></div>
  <div class="lz-step"><span class="lz-t">Deploy là cắt ngang</span><span class="lz-d">SIGTERM giữa lúc đang gọi ra ngoài — bài 13.5 đo đúng chuyện này</span></div>
</div>

<h3>Phép đo 1 — độ trễ người dùng thấy</h3>
<p>Một route gửi email ngay tại chỗ (300ms) so với một route đẩy job vào hàng đợi rồi trả <code>202 Accepted</code>:</p>
<div class="out">=== 50 request đồng thời ===
/sync  (làm ngay)   : trung vị 368,8ms · p95 370,7ms · tổng 387,2ms
/async (vào hàng đợi): trung vị  20,1ms · p95  21,3ms · tổng  23,7ms
   → người dùng thấy nhanh hơn 17× ở p95
   worker xử lý xong 50 email trong 930,4ms sau khi request đã trả lời xong

=== 200 request đồng thời ===
/sync  (làm ngay)   : trung vị 379,1ms · p95 385,7ms
/async (vào hàng đợi): trung vị  51,0ms · p95  54,9ms
   → người dùng thấy nhanh hơn 7× ở p95</div>
<p>Nhanh hơn 17 lần ở p95, và — hãy để ý chi tiết trung thực này — khoảng cách <em>thu hẹp lại</em> còn 7 lần ở mức 200 request đồng thời, bởi vì việc đưa vào hàng đợi cũng không miễn phí: nó là một vòng đi-về tới Redis, và bài 12.1 đã dạy bạn cái đó tốn bao nhiêu. Đây mới là nửa nhàm chán của lập luận. Nửa thú vị nằm ngay dưới.</p>

<h3>Phép đo 2 — phép đo làm bạn đổi ý</h3>
<p>Bây giờ hãy làm cho dịch vụ bên ngoài giống thật. Một máy chủ SMTP thật, một API thanh toán thật, một bên thứ ba bất kỳ đều chỉ nhận <strong>một số kết nối đồng thời có hạn</strong> và từ chối phần còn lại. Ở đây nó nhận 5, mỗi email 200ms, và trả <code>421 Too many concurrent connections</code> cho phần vượt. Một trăm người đăng ký cùng một khoảnh khắc:</p>
<div class="out">--- 100 request đồng thời, SMTP chỉ chịu 5 kết nối, mỗi email 200ms ---

A) LÀM NGAY trong request:
   HTTP 200: 5 | HTTP 500: 95
   email gửi được: 5 / 100  ·  bị SMTP từ chối: 95
   đỉnh kết nối đồng thời tới SMTP: 5
   độ trễ p95 272,1ms
   ⇒ 95 email MẤT HẲN. Người dùng nhận 500 và không có cách nào lấy lại.

B) ĐẨY VÀO HÀNG ĐỢI, worker concurrency=5:
   HTTP 202: 100 | lỗi: 0
   độ trễ p95 người dùng thấy: 48,2ms
   email gửi được: 100 / 100  ·  bị SMTP từ chối (rồi thử lại): 0
   đỉnh kết nối đồng thời tới SMTP: 5
   worker rút cạn hàng đợi trong 4126,0ms
   hoàn tất: 100 · thất bại hẳn: 0</div>
<p><strong>5 trên 100 email so với 100 trên 100.</strong> Đó không phải khác biệt về hiệu năng, đó là khác biệt về tính ĐÚNG ĐẮN. Bản đồng bộ không hề gửi chậm — nó <em>không gửi gì cả</em>, cho 95 người, vĩnh viễn, và báo HTTP 500 cho từng người trong số đó.</p>
<p>Và hãy nhìn dòng thứ ba của mỗi khối: đỉnh kết nối đồng thời tới SMTP là <strong>5 ở CẢ HAI trường hợp</strong>. Hàng đợi không làm cho bên dưới nhanh hơn. Nó làm hệ thống của bạn thôi đòi hỏi nhiều hơn cái mà bên dưới có thể cho, và nó GHI NHỚ phần còn lại thay vì vứt đi. Hàng đợi, trước hết, là một nơi để <em>đặt việc xuống</em>.</p>

<h3>Hình hài của sự thay đổi</h3>
<pre><code class="language-javascript">// TRƯỚC — route tự làm hết
app.post('/register', async (req, res) =&gt; {
  const user = await createUser(req.body);
  await sendWelcomeEmail(user.email);      // 300ms, có thể hỏng, hỏng là mất
  res.status(201).json(user);
});

// SAU — route chỉ ghi nhận việc cần làm
app.post('/register', async (req, res) =&gt; {
  const user = await createUser(req.body);
  await emailQueue.add('welcome', { userId: user.id }, {
    attempts: 5,
    backoff: { type: 'exponential', delay: 1000 },
  });
  res.status(201).json(user);              // trả lời NGAY
});</code></pre>
<p>Ba chi tiết trong bản khác biệt đó đều gánh trọng lượng. Job mang theo <strong><code>userId</code>, chứ không mang cả đối tượng user</strong> — worker đọc lại từ cơ sở dữ liệu, nhờ vậy nó không bao giờ hành động dựa trên một tấm ảnh chụp từ mười phút trước. Cặp <code>attempts</code>/<code>backoff</code> là thứ biến "email hỏng" thành "email tới muộn" (bài 13.3). Và phản hồi ở đây vẫn là <code>201</code> vì người dùng <em>thật sự</em> đã được tạo; hãy dùng <code>202 Accepted</code> khi chính tài nguyên đó còn chưa sẵn sàng.</p>

<h3>Cái gì nên vào hàng đợi, cái gì không</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Nên đưa vào hàng đợi</span><span class="v">gửi email/SMS/push · gọi API bên thứ ba · tạo ảnh thu nhỏ, nén video · dựng lại chỉ mục tìm kiếm · xuất báo cáo · webhook gửi đi · dọn dẹp định kỳ</span></div>
  <div class="kv"><span class="k">KHÔNG nên</span><span class="v">bất cứ thứ gì mà phản hồi cần tới NGAY (kiểm mật khẩu, đọc dữ liệu) · việc buộc phải chạy trong CÙNG transaction với lệnh ghi · việc rẻ hơn cả chi phí đưa nó vào hàng đợi</span></div>
</div>
<p>Cái gạch đầu dòng cuối cùng đó quan trọng hơn vẻ ngoài của nó. Đưa vào hàng đợi tốn một vòng đi-về tới Redis cộng với một lần đánh thức worker. Nếu bản thân công việc chỉ mất 2ms thì bạn vừa làm nó chậm đi và thêm vào một bộ phận chuyển động.</p>

<h3>Hoá đơn về trải nghiệm mà bạn vừa ký</h3>
<p>Đưa việc ra khỏi request không làm nó miễn phí — nó chuyển vấn đề sang giao diện. Người dùng đã nhận <code>202</code> và bây giờ có một câu hỏi mà bạn buộc phải trả lời: <em>nó có chạy không?</em> Ba câu trả lời trung thực, xếp theo công sức tăng dần: không nói gì và để kết quả tự xuất hiện (ổn với email chào mừng); mở một endpoint trạng thái cho client hỏi (<code>GET /jobs/:id</code>, trả về <code>pending | done | failed</code>); hoặc đẩy kết quả qua socket của chương 11. Hãy chọn một cách có chủ ý. Kiểu hỏng của công việc bất đồng bộ không phải là một thông báo lỗi, mà là một người dùng không bao giờ biết được kết quả.</p>

<div class="pitfall">
<p><strong>Đừng đưa job vào hàng đợi bên trong một transaction.</strong> Nếu bạn gọi <code>queue.add()</code> trước <code>COMMIT</code> thì worker có thể nhặt job lên, đọc cơ sở dữ liệu và chẳng thấy gì cả — cái dòng đó còn chưa tồn tại. Tệ hơn, nếu transaction sau đó cuộn ngược thì bạn đang có một job dành cho một người dùng chưa từng được tạo ra. Hãy đưa vào hàng đợi <em>sau</em> khi commit thành công; còn nếu việc mất job ở khoảng giữa commit và enqueue là không chấp nhận được thì hãy ghi job thành một dòng trong bảng của chính bạn trong cùng transaction đó, rồi để một tiến trình quét chuyển nó sang hàng đợi (khuôn mẫu transactional outbox).</p>
</div>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Việc tải tài liệu lên cho cơ sở tri thức AI làm đúng phép tách này, và <code>src/services/embedQueue.service.ts</code> mở đầu bằng một khối chú thích giải thích quyết định: endpoint upload trả lời ngay lập tức trong khi việc chẻ nhỏ và tính embedding diễn ra ở nền. Phần trung thực nằm ở chỗ nó chọn cái gì <em>thay cho</em> BullMQ — một hàng đợi bằng mảng ngay trong tiến trình — với sự đánh đổi được ghi thẳng vào file: "nếu tiến trình sập giữa chừng thì các job đang bay bị mất", và được giảm nhẹ bằng cách làm cho job idempotent cùng với việc đánh dấu tài liệu là <code>pending | processing | ready | failed</code> để một lượt quét phục hồi có thể tìm ra những cái bị kẹt. Đó là một lựa chọn bảo vệ được khi chỉ có một tiến trình. Bài 13.5 đo chính xác cái giá của nó.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-617"><span class="lc-t">Code Lab · Message Queues and Event-Driven Architecture</span><span class="lc-d">Hàng đợi, sự kiện và kiến trúc bất đồng bộ trong Node.js</span></a>
</div>
</div>
`,
    },

    /* ─────────────────────────── 13.2 ─────────────────────────── */
    {
      title: '13.2 — BullMQ: Queue, Worker, and what a job is in Redis|||13.2 — BullMQ: Queue, Worker, và một job thực chất là gì trong Redis',
      slug: 'nodejs-13-2-bullmq-co-ban',
      type: 'VIDEO',
      description: 'Một job là một Redis hash 6 trường và một id trong danh sách chờ — mở ra xem tận nơi. addBulk nhanh hơn 11 lần. Và concurrency giúp gấp 81 lần với việc chờ I/O nhưng ĐÚNG BẰNG KHÔNG với việc tốn CPU.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.2</span>
<h2>BullMQ: Queue, Worker, and what a job is in Redis</h2>
<p class="lead">Chapter 12.5 built a job queue by hand out of Redis streams, consumer groups and <code>XAUTOCLAIM</code>, and ended by saying most teams should not do that. BullMQ is what you use instead. It is worth exactly one paragraph of trust and then a look inside, because everything it does is made of the primitives you already measured.</p>

<h3>Three objects, and that is the whole API</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-t">Queue</span><span class="lz-d">the SENDING side. <code>queue.add(name, data, opts)</code>. Lives inside your web process</span></div>
  <div class="lz-layer"><span class="lz-t">Worker</span><span class="lz-d">the WORKING side. <code>new Worker(name, handler, opts)</code>. Should live in a SEPARATE process</span></div>
  <div class="lz-layer"><span class="lz-t">Job</span><span class="lz-d">a record in Redis: the data, the options, the attempt count, the return value, the failure reason</span></div>
</div>
<pre><code class="language-javascript">// producer.js — trong tiến trình web
import { Queue } from 'bullmq';
const emailQueue = new Queue('email', { connection: { host: '127.0.0.1', port: 6379 } });
await emailQueue.add('welcome', { userId: 42 });

// worker.js — TIẾN TRÌNH RIÊNG, chạy bằng &#96;node worker.js&#96;
import { Worker } from 'bullmq';
new Worker('email', async (job) =&gt; {
  const user = await db.user.findUnique({ where: { id: job.data.userId } });
  await sendWelcomeEmail(user.email);
  return { sentAt: new Date().toISOString() };   // lưu vào job.returnvalue
}, { connection: { host: '127.0.0.1', port: 6379 }, concurrency: 10 });</code></pre>
<p>Running the worker in its own process is not a style preference. A worker that shares the web process shares its event loop, so a heavy job adds latency to every HTTP request — chapter 2.4 measured a 2871ms block delaying the heartbeat by 2873ms. Separate processes also let you scale them independently: two web containers and six workers, or the reverse during a backlog.</p>

<h3>Open the box: what a job actually is</h3>
<div class="out">   thêm 1 job → DBSIZE 5363 → 5369 (+6 storeá)
   các storeá: wait, 1, events, meta, id, marker
   HGETALL bull:t2:1:
      name         = email
      data         = {"to":"an@x.vn","subject":"Chào bạn"}
      opts         = {"attempts":0}
      timestamp    = 1785183968960
      delay        = 0
      priority     = 0
   kiểu của bull:t2:wait = list (danh sách chờ), id trong đó: ["1"]</div>
<p>That is the entire magic trick. A job is a <strong>Redis hash</strong> holding your data plus bookkeeping, and its id sits in a <strong>list</strong> called <code>wait</code>. The worker does a blocking pop from that list, moves the id to <code>active</code>, takes a lock, runs your function, and moves it to <code>completed</code> or <code>failed</code>. Every step is one of the operations from chapter 12. There is no daemon, no broker process — <em>BullMQ is a library, not a server</em>, and the queue lives entirely in Redis.</p>
<p>Which means the entire chapter-12 rulebook applies. In particular: <strong>never point BullMQ at a Redis configured with <code>allkeys-lru</code></strong>. Lesson 12.6 measured 162.616 keys evicted under memory pressure; if some of those are your jobs, the jobs are simply gone, and nothing will tell you. BullMQ needs a Redis with <code>maxmemory-policy noeviction</code> — the one setting that lesson called dangerous for a cache is the required setting for a queue.</p>

<h3>Cost per job</h3>
<div class="out">   add() từng cái  : 1000 job trong 286,6ms → 3.489 job/giây
   addBulk()       : 5000 job trong 134,2ms → 37.249 job/giây (nhanh hơn 11×)
   10.000 job đang chờ = 2,39MB → ~250 byte/job</div>
<p>3.489 jobs/second from a single <code>add()</code> loop is the round-trip cost of lesson 12.1 showing up again, and <code>addBulk()</code> is the pipeline fix — <strong>11× faster</strong>. Any time you fan out ("email all 50.000 subscribers"), use <code>addBulk</code> in chunks.</p>
<p>250 bytes per waiting job is the number to size with. A million-job backlog is 250 MB of Redis, which is more than the 256 MB ceiling on this site's production instance. Backlogs are not free storage.</p>

<h3>Concurrency, and the measurement that decides your architecture</h3>
<p>200 jobs, each waiting 200ms on I/O:</p>
<div class="out">--- concurrency với job CHỜ I/O (200ms mỗi job, 200 job) ---
   concurrency   1: 41021,4ms →   5 job/giây
   concurrency   5:  8224,5ms →  24 job/giây
   concurrency  20:  2096,3ms →  95 job/giây
   concurrency  50:   858,1ms → 233 job/giây
   concurrency 100:   493,9ms → 405 job/giây</div>
<p>Nearly linear — <strong>81× from concurrency 1 to 100</strong>. Now 100 jobs that each burn 60ms of CPU instead:</p>
<div class="out">--- concurrency với job TỐN CPU (băm 60ms, 100 job) ---
   concurrency  1: 6214,1ms → 16 job/giây
   concurrency 10: 6010,9ms → 17 job/giây
   concurrency 50: 6044,3ms → 17 job/giây</div>
<p><strong>Zero improvement.</strong> Not "less improvement" — none. <code>concurrency</code> in BullMQ means "how many jobs this worker will have <em>in flight</em>", and in-flight is not parallel: it is still one event loop. This is chapter 2 arriving with the bill. For CPU-bound jobs the only real answers are more worker <em>processes</em>, or a BullMQ sandboxed processor (point the worker at a file path instead of a function and it forks a child process per job), or <code>worker_threads</code>.</p>
<p>So the first question about any job is not "how fast is it" but <strong>"does it wait, or does it compute?"</strong> — the two get opposite treatment.</p>

<h3>Two workers, one queue: does a job run twice?</h3>
<div class="out">   worker-A làm 50 job · worker-B làm 50 job · tổng 100 · TRÙNG: 0</div>
<p>Zero duplicates. Each job goes to exactly one worker, which is what the blocking pop plus per-job lock buys you. This is the property that lets you scale horizontally by simply starting more worker processes — no coordination, no configuration, no leader election. It is also the property Pub/Sub does <em>not</em> have (lesson 12.5), which is why a job queue is not a broadcast.</p>

<h3>Naming and payloads</h3>
<pre><code class="language-javascript">// một hàng đợi cho mỗi LOẠI công việc, không phải một hàng đợi cho tất cả
new Queue('email');       // gửi thư
new Queue('media');       // tạo ảnh thu nhỏ, nén video
new Queue('search');      // dựng lại chỉ mục

// TRONG một hàng đợi, dùng job name để phân nhánh
await emailQueue.add('welcome', { userId: 42 });
await emailQueue.add('password-reset', { userId: 42, token });</code></pre>
<p>Separate queues so a 30-second video job cannot starve a password-reset email — they have different concurrency, different limiters and different urgency. Within a queue, the job <em>name</em> is the discriminator your handler switches on.</p>

<div class="pitfall">
<p><strong>Never put big or secret data in <code>job.data</code>.</strong> It is a JSON string in Redis: it counts against <code>maxmemory</code>, it is readable by anyone with <code>redis-cli</code>, and it will still be there next week if you did not set <code>removeOnComplete</code>. Put an id in the job and let the worker fetch the rest. That also fixes the staleness problem — a job created ten minutes ago that carries a full user object will happily email an address the user has since changed.</p>
</div>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> The site does <em>not</em> run BullMQ, and the reason is written in <code>src/services/embedQueue.service.ts</code>: one Node process, no horizontal scaling yet, and BullMQ brings a real dependency weight — measured here at <strong>22 packages and 13 MB</strong>, of which <code>luxon</code> alone is 4,5 MB (it is there for cron parsing). Instead there is a plain in-memory array with a <code>_processing</code> flag: effectively <code>concurrency: 1</code>. Reading this lesson against that file is the exercise: the in-process queue gets the latency win from 13.1 for free, and gives up every single thing measured above — no second worker, no restart survival, no <code>addBulk</code>, no priority.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-617"><span class="lc-t">Code Lab · Message Queues and Event-Driven Architecture</span><span class="lc-d">BullMQ, producer/consumer and the event model</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/redis${REF}#module-735"><span class="lc-t">Code Lab · Redis Streams and Event-Driven Architecture</span><span class="lc-d">What underlies every Redis-based queue</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.2</span>
<h2>BullMQ: Queue, Worker, và một job thực chất là gì trong Redis</h2>
<p class="lead">Bài 12.5 đã dựng một hàng đợi công việc bằng tay từ stream, consumer group và <code>XAUTOCLAIM</code> của Redis, rồi kết luận rằng phần lớn các đội không nên tự làm thế. BullMQ là thứ bạn dùng thay vào đó. Nó đáng được tin đúng một đoạn văn, rồi sau đó phải mở ra xem bên trong, bởi vì mọi thứ nó làm đều được ghép từ những viên gạch bạn vừa đo ở chương trước.</p>

<h3>Ba đối tượng, và đó là toàn bộ API</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-t">Queue</span><span class="lz-d">phía NGƯỜI GỬI. <code>queue.add(tên, dữ_liệu, tuỳ_chọn)</code>. Sống trong tiến trình web của bạn</span></div>
  <div class="lz-layer"><span class="lz-t">Worker</span><span class="lz-d">phía NGƯỜI LÀM. <code>new Worker(tên, hàm_xử_lý, tuỳ_chọn)</code>. Nên sống trong một tiến trình RIÊNG</span></div>
  <div class="lz-layer"><span class="lz-t">Job</span><span class="lz-d">một bản ghi trong Redis: dữ liệu, tuỳ chọn, số lần đã thử, giá trị trả về, lý do thất bại</span></div>
</div>
<pre><code class="language-javascript">// producer.js — trong tiến trình web
import { Queue } from 'bullmq';
const emailQueue = new Queue('email', { connection: { host: '127.0.0.1', port: 6379 } });
await emailQueue.add('welcome', { userId: 42 });

// worker.js — TIẾN TRÌNH RIÊNG, chạy bằng &#96;node worker.js&#96;
import { Worker } from 'bullmq';
new Worker('email', async (job) =&gt; {
  const user = await db.user.findUnique({ where: { id: job.data.userId } });
  await sendWelcomeEmail(user.email);
  return { sentAt: new Date().toISOString() };   // lưu vào job.returnvalue
}, { connection: { host: '127.0.0.1', port: 6379 }, concurrency: 10 });</code></pre>
<p>Chạy worker trong tiến trình riêng của nó không phải một sở thích về phong cách. Một worker dùng chung tiến trình web thì dùng chung luôn event loop, nên một job nặng sẽ cộng thêm độ trễ vào MỌI request HTTP — bài 2.4 đã đo được một khối chặn 2871ms làm nhịp tim trễ đúng 2873ms. Tiến trình tách rời còn cho bạn co giãn hai bên độc lập: hai container web và sáu worker, hoặc ngược lại khi hàng đợi đang ùn.</p>

<h3>Mở hộp ra: một job thật sự là cái gì</h3>
<div class="out">   thêm 1 job → DBSIZE 5363 → 5369 (+6 storeá)
   các storeá: wait, 1, events, meta, id, marker
   HGETALL bull:t2:1:
      name         = email
      data         = {"to":"an@x.vn","subject":"Chào bạn"}
      opts         = {"attempts":0}
      timestamp    = 1785183968960
      delay        = 0
      priority     = 0
   kiểu của bull:t2:wait = list (danh sách chờ), id trong đó: ["1"]</div>
<p>Đó là toàn bộ trò ảo thuật. Một job là một <strong>hash của Redis</strong> chứa dữ liệu của bạn cộng phần sổ sách, và id của nó nằm trong một <strong>list</strong> tên là <code>wait</code>. Worker thực hiện một lệnh pop có chờ trên list đó, chuyển id sang <code>active</code>, giành một khoá, chạy hàm của bạn, rồi chuyển nó sang <code>completed</code> hoặc <code>failed</code>. Mỗi bước đều là một trong các thao tác của chương 12. Không có tiến trình nền nào, không có máy chủ môi giới nào — <em>BullMQ là một thư viện, không phải một máy chủ</em>, và hàng đợi nằm trọn vẹn trong Redis.</p>
<p>Điều đó nghĩa là toàn bộ luật lệ của chương 12 đều áp dụng. Đặc biệt: <strong>đừng bao giờ trỏ BullMQ vào một Redis cấu hình <code>allkeys-lru</code></strong>. Bài 12.6 đã đo được 162.616 khoá bị trục xuất khi bộ nhớ căng; nếu trong số đó có job của bạn thì job đơn giản là biến mất, và không có gì báo cho bạn biết. BullMQ cần một Redis đặt <code>maxmemory-policy noeviction</code> — chính cái thiết lập mà bài đó gọi là nguy hiểm cho một cache lại là thiết lập BẮT BUỘC cho một hàng đợi.</p>

<h3>Giá của mỗi job</h3>
<div class="out">   add() từng cái  : 1000 job trong 286,6ms → 3.489 job/giây
   addBulk()       : 5000 job trong 134,2ms → 37.249 job/giây (nhanh hơn 11×)
   10.000 job đang chờ = 2,39MB → ~250 byte/job</div>
<p>Con số 3.489 job/giây từ một vòng lặp <code>add()</code> chính là chi phí vòng đi-về của bài 12.1 lại lộ diện, và <code>addBulk()</code> là cách sửa bằng pipeline — <strong>nhanh hơn 11 lần</strong>. Bất cứ khi nào bạn rải việc hàng loạt ("gửi email cho cả 50.000 người đăng ký"), hãy dùng <code>addBulk</code> chia theo lô.</p>
<p>250 byte cho mỗi job đang chờ là con số để ước lượng dung lượng. Một hàng đợi ùn một triệu job là 250 MB của Redis, nhiều hơn cả cái trần 256 MB trên máy production của trang này. Hàng đợi ùn không phải kho chứa miễn phí.</p>

<h3>Concurrency, và phép đo quyết định kiến trúc của bạn</h3>
<p>200 job, mỗi job chờ I/O 200ms:</p>
<div class="out">--- concurrency với job CHỜ I/O (200ms mỗi job, 200 job) ---
   concurrency   1: 41021,4ms →   5 job/giây
   concurrency   5:  8224,5ms →  24 job/giây
   concurrency  20:  2096,3ms →  95 job/giây
   concurrency  50:   858,1ms → 233 job/giây
   concurrency 100:   493,9ms → 405 job/giây</div>
<p>Gần như tuyến tính — <strong>gấp 81 lần khi đi từ concurrency 1 lên 100</strong>. Bây giờ đổi thành 100 job, mỗi job đốt 60ms CPU:</p>
<div class="out">--- concurrency với job TỐN CPU (băm 60ms, 100 job) ---
   concurrency  1: 6214,1ms → 16 job/giây
   concurrency 10: 6010,9ms → 17 job/giây
   concurrency 50: 6044,3ms → 17 job/giây</div>
<p><strong>Không cải thiện chút nào.</strong> Không phải "cải thiện ít hơn" — mà là bằng không. <code>concurrency</code> trong BullMQ nghĩa là "worker này chịu ôm bao nhiêu job cùng lúc", và ôm cùng lúc không phải là chạy song song: vẫn chỉ một event loop. Đây là chương 2 quay lại đòi nợ. Với job tốn CPU, các câu trả lời thật sự chỉ có: thêm <em>tiến trình</em> worker, hoặc dùng sandboxed processor của BullMQ (trỏ worker vào một đường dẫn file thay vì một hàm, nó sẽ fork một tiến trình con cho mỗi job), hoặc <code>worker_threads</code>.</p>
<p>Cho nên câu hỏi đầu tiên về bất kỳ job nào không phải "nó nhanh cỡ nào" mà là <strong>"nó CHỜ hay nó TÍNH?"</strong> — hai loại được đối xử ngược nhau hoàn toàn.</p>

<h3>Hai worker, một hàng đợi: job có chạy hai lần không?</h3>
<div class="out">   worker-A làm 50 job · worker-B làm 50 job · tổng 100 · TRÙNG: 0</div>
<p>Không có cái nào trùng. Mỗi job đi tới đúng một worker, và đó là thứ mà lệnh pop có chờ cộng với khoá riêng cho từng job mua được cho bạn. Đây chính là tính chất cho phép bạn co giãn theo chiều ngang chỉ bằng cách khởi động thêm tiến trình worker — không cần phối hợp, không cần cấu hình, không cần bầu bán ai làm chủ. Và đây cũng là tính chất mà Pub/Sub <em>không</em> có (bài 12.5), lý do vì sao một hàng đợi công việc không phải một buổi phát thanh.</p>

<h3>Đặt tên và đóng gói dữ liệu</h3>
<pre><code class="language-javascript">// mỗi LOẠI công việc một hàng đợi, đừng gom tất cả vào một
new Queue('email');       // gửi thư
new Queue('media');       // tạo ảnh thu nhỏ, nén video
new Queue('search');      // dựng lại chỉ mục

// TRONG một hàng đợi, dùng tên job để phân nhánh
await emailQueue.add('welcome', { userId: 42 });
await emailQueue.add('password-reset', { userId: 42, token });</code></pre>
<p>Tách hàng đợi để một job nén video 30 giây không bỏ đói một email đặt lại mật khẩu — chúng có concurrency khác nhau, bộ bóp tốc độ khác nhau và mức khẩn cấp khác nhau. Còn bên trong một hàng đợi, <em>tên</em> của job là thứ để hàm xử lý của bạn rẽ nhánh.</p>

<div class="pitfall">
<p><strong>Đừng bao giờ nhét dữ liệu lớn hoặc bí mật vào <code>job.data</code>.</strong> Nó là một chuỗi JSON nằm trong Redis: nó tính vào <code>maxmemory</code>, ai có <code>redis-cli</code> cũng đọc được, và tuần sau nó vẫn còn nằm đó nếu bạn không đặt <code>removeOnComplete</code>. Hãy bỏ một cái id vào job và để worker tự đi lấy phần còn lại. Cách đó cũng sửa luôn vấn đề dữ liệu cũ — một job tạo ra mười phút trước mà mang theo cả đối tượng user sẽ vui vẻ gửi thư tới một địa chỉ mà người dùng đã đổi từ lâu.</p>
</div>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Trang này <em>không</em> chạy BullMQ, và lý do được ghi thẳng trong <code>src/services/embedQueue.service.ts</code>: chỉ một tiến trình Node, chưa co giãn ngang, và BullMQ mang theo trọng lượng phụ thuộc thật sự — đo ở đây là <strong>22 gói và 13 MB</strong>, trong đó riêng <code>luxon</code> đã 4,5 MB (nó ở đó để phân tích biểu thức cron). Thay vào đó là một mảng trong bộ nhớ với một cờ <code>_processing</code>: thực chất là <code>concurrency: 1</code>. Bài tập ở đây là đọc bài học này song song với file đó: hàng đợi trong tiến trình lấy được cái lợi về độ trễ ở bài 13.1 miễn phí, và từ bỏ TOÀN BỘ những gì vừa đo ở trên — không có worker thứ hai, không sống sót qua lần khởi động lại, không có <code>addBulk</code>, không có mức ưu tiên.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-617"><span class="lc-t">Code Lab · Message Queues and Event-Driven Architecture</span><span class="lc-d">BullMQ, producer/consumer và mô hình sự kiện</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/redis${REF}#module-735"><span class="lc-t">Code Lab · Redis Streams and Event-Driven Architecture</span><span class="lc-d">Thứ nằm dưới mọi hàng đợi chạy trên Redis</span></a>
</div>
</div>
`,
    },
    /* ─────────────────────────── 13.3 ─────────────────────────── */
    {
      title: '13.3 — Failure: retries, backoff, and the charge that ran three times|||13.3 — Thất bại: thử lại, backoff, và cú trừ tiền chạy ba lần',
      slug: 'nodejs-13-3-thu-lai-va-idempotent',
      simulation: {
        url: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-13-3-thu-lai-va-idempotent.mp4',
        poster: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-13-3-thu-lai-va-idempotent.jpg',
        scenario: 'nodejs-retry-idempotent',
        durationSeconds: 16,
        caption: { en: "Retries, backoff and idempotency", vi: "Thử lại, backoff và idempotent" },
      },
      type: 'VIDEO',
      description: 'Mặc định BullMQ KHÔNG thử lại. Bật thử lại lên thì backoff luỹ thừa giãn ra 288 → 417 → 826 → 1674ms. Và một job trừ tiền không idempotent đã trừ của khách 300.000đ thay vì 100.000đ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.3</span>
<h2>Failure: retries, backoff, and the charge that ran three times</h2>
<p class="lead">The whole promise of lesson 13.1 was that a queue turns "the email failed" into "the email was late". That promise is not delivered by default — it is a configuration you have to write, and writing it carelessly creates a worse bug than the one you were fixing.</p>

<h3>What happens with no configuration at all</h3>
<div class="out">--- 1. Mặc định: attempts không đặt ---
   hàm xử lý chạy 1 lần · failed=1 · waiting=0
   job.failedReason = "SMTP 421" · attemptsMade = 1
   ⇒ KHÔNG thử lại. Job nằm im trong tập "failed" cho tới khi có người nhìn tới nó.</div>
<p><strong>One attempt. No retry.</strong> The job moves to the <code>failed</code> set and stays there, forever, silently. That is better than the synchronous version from 13.1 — the work is not <em>lost</em>, it is recorded with its error message and can be replayed — but nobody is coming to look at it unless you build something that does.</p>

<h3>Turning on retries</h3>
<div class="out">--- 2. attempts: 4, backoff cố định 300ms ---
   chạy 4 lần, mốc thời gian: 9ms → 377ms → 689ms → 1000ms
   khoảng cách: 368ms, 312ms, 311ms</div>
<p>Fixed backoff waits the same amount every time. It is the wrong default, and the reason is in the next measurement.</p>
<div class="out">--- 3. attempts: 5, backoff exponential delay 200ms ---
   chạy 5 lần, mốc: 10ms → 298ms → 715ms → 1541ms → 3215ms
   khoảng cách: 288ms, 417ms, 826ms, 1674ms ← gấp đôi mỗi lần
   sau cùng: failed=1, attemptsMade=5</div>
<p>Exponential backoff doubles the gap each round: 288 → 417 → 826 → 1674ms. Why that matters: the usual reason a job fails is that something downstream is <em>overloaded</em>. Retrying at a fixed fast interval adds load to a service that is already drowning — your retries become the outage. Exponential backoff gives the other side room to recover, and with <code>attempts: 5, delay: 1000</code> in production the last retry lands around 16 seconds later, which covers most transient failures.</p>
<p>Add jitter for the same reason lesson 12.2 added it to TTLs: a thousand jobs that failed at the same instant will otherwise all retry at the same instant.</p>

<h3>When it works, it is invisible</h3>
<div class="out">--- 4. Bên kia hồi phục ở lần thử thứ 3 ---
   chạy 3 lần · completed=1 · failed=0
   returnvalue = {"sent":true} · attemptsMade = 3
   ⇒ Lỗi tạm thời tự lành mà không ai phải thức dậy lúc 3 giờ sáng.</div>
<p>Two failures, one success, final state <code>completed</code>, nobody paged. This is the entire point of the chapter in four lines of output.</p>

<h3>The bug retries create</h3>
<p>Now the same mechanism applied to a job that charges a customer. The handler debits the card and <em>then</em> the network drops:</p>
<div class="out">--- 5. Thử lại mà việc KHÔNG idempotent ---
   đã trừ 300.000đ của khách — đáng lẽ chỉ 100.000đ</div>
<p><strong>Three charges for one order.</strong> The retry logic did exactly what you asked. The job was not idempotent, and "retry until it succeeds" is only a safe instruction for work that can be repeated without consequence.</p>
<p>This is the most important idea in the chapter, so state it plainly: <strong>a queue guarantees at-least-once delivery, not exactly-once.</strong> Any of these will run your handler twice — a retry, a stalled job reclaimed after a crash (lesson 13.5), a duplicate enqueue from a user double-clicking. Exactly-once does not exist in distributed systems; what exists is <em>idempotent handlers</em>, which make at-least-once indistinguishable from exactly-once.</p>

<h3>Three ways to make a handler idempotent</h3>
<pre><code class="language-javascript">// 1) Khoá duy nhất trong cơ sở dữ liệu — cách chắc chắn nhất
async function handleCharge(job) {
  const { orderId, amount } = job.data;
  try {
    await db.payment.create({ data: { orderId, amount, status: 'PENDING' } });
  } catch (err) {
    if (err.code === 'P2002') return { skipped: 'đã trừ tiền rồi' };   // chương 7.3
    throw err;
  }
  const result = await psp.charge({ orderId, amount });               // gọi bên ngoài
  await db.payment.update({ where: { orderId }, data: { status: 'DONE', ref: result.id } });
}

// 2) Kiểm trạng thái trước khi làm — rẻ, nhưng vẫn có khe hở đua
async function handleThumbnail(job) {
  const doc = await db.doc.findUnique({ where: { id: job.data.id } });
  if (doc.thumbnailKey) return { skipped: true };
  // …
}

// 3) Khoá idempotency đưa cho bên thứ ba — cách tốt nhất khi họ hỗ trợ
await psp.charge({ orderId, amount }, { idempotencyKey: &#96;charge-\${orderId}&#96; });</code></pre>
<p>Option 2 looks fine and has a real race: two workers can both read "no thumbnail yet" before either writes. It is acceptable when running twice is merely wasteful, never when it costs money. Option 1 is the one to reach for when correctness matters, and it reuses exactly the <code>P2002</code> unique-constraint behaviour chapter 7.3 measured.</p>

<h3>Stopping duplicates at the door: <code>jobId</code></h3>
<div class="out">--- 6. jobId: khử trùng lặp khi cùng một việc bị gửi nhiều lần ---
   gọi add() 5 lần với cùng jobId → id trả về: ["invoice-ORD-2026-777", …×5]
   số job thật sự đang chờ: 1
   worker chạy 1 lần ⇒ 5 lần bấm nút "Thanh toán" chỉ tạo 1 hoá đơn</div>
<p>Give a job a deterministic <code>jobId</code> derived from the thing it acts on and BullMQ refuses to create a second one. Five clicks, one invoice. But read the limit carefully:</p>
<div class="out">   thêm lại cùng jobId khi job CŨ vẫn còn trong completed → id = invoice-ORD-2026-777, waiting = 0
   ⚠️ jobId chỉ chặn trùng CHỪNG NÀO job cũ còn nằm trong Redis — removeOnComplete xoá nó là hết chặn</div>
<p><code>jobId</code> deduplicates against jobs that <em>still exist</em>. Once the completed job is cleaned up — and you must clean up, see 13.5 — the same id can be added again. So <code>jobId</code> is a cheap guard against double-submit within a short window, <strong>not</strong> a substitute for an idempotent handler. Use both.</p>
<p>One sharp edge found the hard way: a <code>jobId</code> <strong>cannot contain a colon</strong>. BullMQ throws <code>Error: Custom Id cannot contain :</code>, which is easy to hit because <code>:</code> is the natural separator everywhere else in Redis. Use <code>invoice-ORD-777</code>, not <code>invoice:ORD-777</code>.</p>

<h3>The dead-letter pile, and how to work it</h3>
<div class="out">--- 7. Xử lý đống job chết (dead letter) ---
   failed = 5
   lý do: "lỗi cấu hình: thiếu API key"
   → sửa cấu hình xong, chạy lại toàn bộ:
   completed = 5 · failed = 0</div>
<p>Failed jobs keep their data and their <code>failedReason</code>, so once the real cause is fixed a single loop replays them all:</p>
<pre><code class="language-javascript">const failed = await queue.getFailed(0, 1000);
for (const job of failed) await job.retry();</code></pre>
<p>Which is why the <code>failed</code> set deserves a dashboard and an alert. A queue that quietly accumulates failures is a queue that has stopped doing its job while every graph still looks green — the only signal is a number nobody is watching.</p>

<h3>Failing on purpose</h3>
<p>Not every error deserves a retry. A malformed payload or a deleted user will fail identically five times and waste four attempts. BullMQ has an escape hatch:</p>
<pre><code class="language-javascript">import { UnrecoverableError } from 'bullmq';

new Worker('email', async (job) =&gt; {
  const user = await db.user.findUnique({ where: { id: job.data.userId } });
  if (!user) throw new UnrecoverableError('người dùng không còn tồn tại');  // hỏng NGAY, không thử lại
  if (!user.email) throw new UnrecoverableError('không có địa chỉ email');
  await sendWelcomeEmail(user.email);        // lỗi ở đây thì ĐÁNG thử lại
});</code></pre>
<p>The rule of thumb: retry <em>infrastructure</em> failures (timeout, 5xx, connection reset), never retry <em>logic</em> failures (4xx, validation, missing record). Getting this wrong is how a queue ends up spending its entire capacity retrying jobs that can never succeed.</p>

<div class="pitfall">
<p><strong>Retrying is not free, and the meter is running on someone else.</strong> A job that calls a paid API with <code>attempts: 10</code> can bill you ten times for one piece of work. A job that sends email with aggressive retries can get your domain marked as a spam source. And a retry storm across ten thousand failed jobs will hit the downstream service harder than the original traffic did. Pick <code>attempts</code> deliberately per queue — 3 to 5 is usually right — and put a limiter on the worker (lesson 13.4) so the retries cannot become the second outage.</p>
</div>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> <code>embedQueue.service.ts</code> tracks <code>attempts</code> on its own job objects and marks documents <code>pending | processing | ready | failed</code>, which is a hand-rolled version of everything above — and the file says outright that its safety net is that "jobs are idempotent (re-running is safe)". That is the correct instinct: the in-process queue gives up durability, so idempotency is what makes a recovery scan safe to run. It is the same conclusion this lesson reaches from the opposite direction — whatever queue you use, the handler has to survive running twice.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-617"><span class="lc-t">Code Lab · Message Queues and Event-Driven Architecture</span><span class="lc-d">Retries, dead letters and error handling in a queue</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/payment-integration${REF}"><span class="lc-t">Code Lab · Payment Integration</span><span class="lc-d">Idempotency keys and webhooks — where "running twice" costs real money</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.3</span>
<h2>Thất bại: thử lại, backoff, và cú trừ tiền chạy ba lần</h2>
<p class="lead">Toàn bộ lời hứa của bài 13.1 là hàng đợi biến "email hỏng" thành "email tới muộn". Lời hứa đó KHÔNG được thực hiện mặc định — nó là một phần cấu hình bạn phải tự viết, và viết cẩu thả thì tạo ra một con bug tệ hơn cả con bug bạn đang định sửa.</p>

<h3>Chuyện gì xảy ra khi không cấu hình gì cả</h3>
<div class="out">--- 1. Mặc định: attempts không đặt ---
   hàm xử lý chạy 1 lần · failed=1 · waiting=0
   job.failedReason = "SMTP 421" · attemptsMade = 1
   ⇒ KHÔNG thử lại. Job nằm im trong tập "failed" cho tới khi có người nhìn tới nó.</div>
<p><strong>Một lần thử. Không thử lại.</strong> Job chuyển vào tập <code>failed</code> và nằm đó, mãi mãi, lặng lẽ. Như thế vẫn tốt hơn bản đồng bộ ở bài 13.1 — công việc không <em>mất</em>, nó được ghi lại kèm thông báo lỗi và chạy lại được — nhưng sẽ chẳng ai tới nhìn nó cả trừ khi bạn dựng ra một thứ làm việc đó.</p>

<h3>Bật thử lại lên</h3>
<div class="out">--- 2. attempts: 4, backoff cố định 300ms ---
   chạy 4 lần, mốc thời gian: 9ms → 377ms → 689ms → 1000ms
   khoảng cách: 368ms, 312ms, 311ms</div>
<p>Backoff cố định thì lần nào cũng chờ đúng bấy nhiêu. Đó là lựa chọn mặc định sai, và lý do nằm ở phép đo kế tiếp.</p>
<div class="out">--- 3. attempts: 5, backoff exponential delay 200ms ---
   chạy 5 lần, mốc: 10ms → 298ms → 715ms → 1541ms → 3215ms
   khoảng cách: 288ms, 417ms, 826ms, 1674ms ← gấp đôi mỗi lần
   sau cùng: failed=1, attemptsMade=5</div>
<p>Backoff luỹ thừa nhân đôi khoảng cách sau mỗi vòng: 288 → 417 → 826 → 1674ms. Vì sao điều đó quan trọng: lý do thường gặp nhất khiến một job hỏng là có thứ gì đó ở phía dưới đang <em>quá tải</em>. Thử lại theo nhịp cố định và nhanh là cộng thêm tải cho một dịch vụ vốn đã sắp chết đuối — chính các lần thử lại của bạn trở thành sự cố. Backoff luỹ thừa cho bên kia khoảng thở để hồi phục, và với <code>attempts: 5, delay: 1000</code> trong production thì lần thử cuối rơi vào khoảng 16 giây sau, đủ phủ phần lớn các lỗi tạm thời.</p>
<p>Hãy thêm jitter, cùng lý do mà bài 12.2 thêm nó vào TTL: một nghìn job cùng hỏng vào một khoảnh khắc thì nếu không có jitter chúng sẽ cùng thử lại vào một khoảnh khắc.</p>

<h3>Khi nó chạy được, nó vô hình</h3>
<div class="out">--- 4. Bên kia hồi phục ở lần thử thứ 3 ---
   chạy 3 lần · completed=1 · failed=0
   returnvalue = {"sent":true} · attemptsMade = 3
   ⇒ Lỗi tạm thời tự lành mà không ai phải thức dậy lúc 3 giờ sáng.</div>
<p>Hai lần hỏng, một lần thành công, trạng thái cuối là <code>completed</code>, không ai bị gọi dậy. Đây là toàn bộ ý nghĩa của chương này gói trong bốn dòng kết quả.</p>

<h3>Con bug mà chính việc thử lại tạo ra</h3>
<p>Bây giờ áp đúng cơ chế đó lên một job trừ tiền khách hàng. Hàm xử lý trừ tiền thẻ rồi <em>sau đó</em> mạng rớt:</p>
<div class="out">--- 5. Thử lại mà việc KHÔNG idempotent ---
   đã trừ 300.000đ của khách — đáng lẽ chỉ 100.000đ</div>
<p><strong>Ba lần trừ tiền cho một đơn hàng.</strong> Logic thử lại đã làm đúng y như bạn yêu cầu. Job không idempotent, và "cứ thử lại tới khi thành công" chỉ là một mệnh lệnh an toàn với những công việc lặp lại được mà không để lại hậu quả.</p>
<p>Đây là ý quan trọng nhất của cả chương, nên hãy nói thẳng: <strong>hàng đợi bảo đảm giao ÍT NHẤT MỘT LẦN, chứ không phải ĐÚNG MỘT LẦN.</strong> Bất kỳ điều nào sau đây cũng làm hàm xử lý của bạn chạy hai lần — một lần thử lại, một job treo được đòi lại sau khi worker sập (bài 13.5), một lần thêm trùng vì người dùng bấm hai lần. "Đúng một lần" không tồn tại trong hệ phân tán; cái tồn tại là <em>hàm xử lý idempotent</em>, thứ khiến "ít nhất một lần" không phân biệt được với "đúng một lần".</p>

<h3>Ba cách làm cho hàm xử lý trở nên idempotent</h3>
<pre><code class="language-javascript">// 1) Khoá duy nhất trong cơ sở dữ liệu — cách chắc chắn nhất
async function handleCharge(job) {
  const { orderId, amount } = job.data;
  try {
    await db.payment.create({ data: { orderId, amount, status: 'PENDING' } });
  } catch (err) {
    if (err.code === 'P2002') return { skipped: 'đã trừ tiền rồi' };   // chương 7.3
    throw err;
  }
  const result = await psp.charge({ orderId, amount });               // gọi bên ngoài
  await db.payment.update({ where: { orderId }, data: { status: 'DONE', ref: result.id } });
}

// 2) Kiểm trạng thái trước khi làm — rẻ, nhưng vẫn có khe hở đua
async function handleThumbnail(job) {
  const doc = await db.doc.findUnique({ where: { id: job.data.id } });
  if (doc.thumbnailKey) return { skipped: true };
  // …
}

// 3) Khoá idempotency đưa cho bên thứ ba — cách tốt nhất khi họ có hỗ trợ
await psp.charge({ orderId, amount }, { idempotencyKey: &#96;charge-\${orderId}&#96; });</code></pre>
<p>Cách 2 trông thì ổn nhưng có một cuộc đua thật sự: hai worker đều có thể cùng đọc thấy "chưa có ảnh thu nhỏ" trước khi bất kỳ ai kịp ghi. Nó chấp nhận được khi chạy hai lần chỉ tổ phí công, và không bao giờ chấp nhận được khi nó tốn tiền. Cách 1 là thứ để với tới khi tính đúng đắn quan trọng, và nó tái sử dụng đúng hành vi ràng buộc duy nhất <code>P2002</code> mà bài 7.3 đã đo.</p>

<h3>Chặn trùng ngay ở cửa: <code>jobId</code></h3>
<div class="out">--- 6. jobId: khử trùng lặp khi cùng một việc bị gửi nhiều lần ---
   gọi add() 5 lần với cùng jobId → id trả về: ["invoice-ORD-2026-777", …×5]
   số job thật sự đang chờ: 1
   worker chạy 1 lần ⇒ 5 lần bấm nút "Thanh toán" chỉ tạo 1 hoá đơn</div>
<p>Hãy cho job một <code>jobId</code> tất định suy ra từ chính thứ mà nó tác động, BullMQ sẽ từ chối tạo cái thứ hai. Năm cú bấm, một hoá đơn. Nhưng hãy đọc kỹ giới hạn:</p>
<div class="out">   thêm lại cùng jobId khi job CŨ vẫn còn trong completed → id = invoice-ORD-2026-777, waiting = 0
   ⚠️ jobId chỉ chặn trùng CHỪNG NÀO job cũ còn nằm trong Redis — removeOnComplete xoá nó là hết chặn</div>
<p><code>jobId</code> chỉ khử trùng lặp so với những job <em>còn tồn tại</em>. Một khi job đã hoàn tất bị dọn đi — mà bạn buộc phải dọn, xem bài 13.5 — thì cùng cái id đó lại thêm được. Cho nên <code>jobId</code> là một lá chắn rẻ tiền chống bấm hai lần trong một khoảng ngắn, <strong>không phải</strong> thứ thay thế cho một hàm xử lý idempotent. Hãy dùng cả hai.</p>
<p>Một cạnh sắc mà tôi vấp phải khi soạn bài: <code>jobId</code> <strong>không được chứa dấu hai chấm</strong>. BullMQ ném ra <code>Error: Custom Id cannot contain :</code>, rất dễ dính vì <code>:</code> lại là dấu phân cách tự nhiên ở mọi chỗ khác trong Redis. Hãy viết <code>invoice-ORD-777</code>, đừng viết <code>invoice:ORD-777</code>.</p>

<h3>Đống job chết, và cách xử lý nó</h3>
<div class="out">--- 7. Xử lý đống job chết (dead letter) ---
   failed = 5
   lý do: "lỗi cấu hình: thiếu API key"
   → sửa cấu hình xong, chạy lại toàn bộ:
   completed = 5 · failed = 0</div>
<p>Job thất bại vẫn giữ nguyên dữ liệu và <code>failedReason</code> của nó, nên một khi nguyên nhân thật đã được sửa thì chỉ cần một vòng lặp là chạy lại được tất:</p>
<pre><code class="language-javascript">const failed = await queue.getFailed(0, 1000);
for (const job of failed) await job.retry();</code></pre>
<p>Và đó là lý do tập <code>failed</code> xứng đáng có một bảng theo dõi cùng một cảnh báo. Một hàng đợi âm thầm tích lũy job hỏng là một hàng đợi đã ngừng làm việc trong khi mọi biểu đồ vẫn xanh — tín hiệu duy nhất là một con số không ai nhìn.</p>

<h3>Cố tình hỏng luôn</h3>
<p>Không phải lỗi nào cũng đáng thử lại. Một payload sai định dạng hoặc một người dùng đã bị xoá sẽ hỏng y hệt nhau năm lần và phí bốn lượt thử. BullMQ có một lối thoát:</p>
<pre><code class="language-javascript">import { UnrecoverableError } from 'bullmq';

new Worker('email', async (job) =&gt; {
  const user = await db.user.findUnique({ where: { id: job.data.userId } });
  if (!user) throw new UnrecoverableError('người dùng không còn tồn tại');  // hỏng NGAY, không thử lại
  if (!user.email) throw new UnrecoverableError('không có địa chỉ email');
  await sendWelcomeEmail(user.email);        // lỗi ở đây thì ĐÁNG thử lại
});</code></pre>
<p>Quy tắc ngón tay cái: hãy thử lại các lỗi <em>hạ tầng</em> (hết giờ, 5xx, đứt kết nối), đừng bao giờ thử lại các lỗi <em>logic</em> (4xx, sai dữ liệu, không tìm thấy bản ghi). Làm sai chỗ này chính là cách một hàng đợi tiêu sạch năng lực của nó vào việc thử lại những job không bao giờ thành công được.</p>

<div class="pitfall">
<p><strong>Thử lại không miễn phí, và công-tơ đang chạy ở phía người khác.</strong> Một job gọi API tính tiền với <code>attempts: 10</code> có thể tính tiền bạn mười lần cho một việc. Một job gửi email với chế độ thử lại hung hăng có thể khiến tên miền của bạn bị đánh dấu là nguồn phát tán thư rác. Và một cơn bão thử lại trên mười nghìn job hỏng sẽ đập vào dịch vụ phía dưới mạnh hơn cả lưu lượng ban đầu. Hãy chọn <code>attempts</code> có chủ ý cho từng hàng đợi — 3 tới 5 thường là đúng — và đặt một bộ bóp tốc độ lên worker (bài 13.4) để các lần thử lại không trở thành sự cố thứ hai.</p>
</div>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> <code>embedQueue.service.ts</code> tự theo dõi <code>attempts</code> trên các đối tượng job của riêng nó và đánh dấu tài liệu là <code>pending | processing | ready | failed</code>, tức là một phiên bản làm tay của mọi thứ ở trên — và file nói thẳng rằng lưới an toàn của nó là "job idempotent (chạy lại vẫn an toàn)". Đó là bản năng đúng: hàng đợi trong tiến trình từ bỏ tính bền vững, nên chính tính idempotent mới là thứ khiến một lượt quét phục hồi có thể chạy mà không gây hại. Cũng chính là kết luận mà bài này đi tới từ hướng ngược lại — dùng hàng đợi nào đi nữa, hàm xử lý vẫn phải sống sót khi bị chạy hai lần.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-617"><span class="lc-t">Code Lab · Message Queues and Event-Driven Architecture</span><span class="lc-d">Thử lại, dead letter và xử lý lỗi trong hàng đợi</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/payment-integration${REF}"><span class="lc-t">Code Lab · Payment Integration</span><span class="lc-d">Idempotency key và webhook — nơi "chạy hai lần" tốn tiền thật</span></a>
</div>
</div>
`,
    },

    /* ─────────────────────────── 13.4 ─────────────────────────── */
    {
      title: '13.4 — Scheduling: delays, priority, throttling and cron|||13.4 — Lịch trình: hẹn giờ, ưu tiên, bóp tốc độ và job định kỳ',
      slug: 'nodejs-13-4-lich-trinh',
      type: 'VIDEO',
      description: 'Hẹn giờ là "không sớm hơn" chứ không phải "đúng lúc" — sai số đo được 4–113ms. Và ba tiến trình cùng đăng ký một job định kỳ vẫn chỉ chạy MỘT lịch: đó là lý do đừng bao giờ dùng setInterval.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.4</span>
<h2>Scheduling: delays, priority, throttling and cron</h2>
<p class="lead">Once work lives in a queue instead of a request, four questions become answerable that were not before: <em>when</em> should it run, in <em>what order</em>, <em>how fast</em>, and <em>how often</em>. Each is one option, and each has an edge that surprises people.</p>

<h3>Delay — "not before", not "at"</h3>
<pre><code class="language-javascript">await queue.add('remind', { userId }, { delay: 24 * 60 * 60 * 1000 });   // nhắc sau 24 giờ</code></pre>
<div class="out">   vừa thêm: delayed=1 · waiting=0
   khoá: 1, meta, id, marker, delayed, events
   kiểu bull:dz:delayed = zset
   nội dung: ["1","7312115256188928"] → score = thời điểm chạy</div>
<p>A delayed job goes into a <strong>sorted set</strong> scored by its run time — the same structure lesson 12.3 used for leaderboards. Nothing polls it in a loop; the worker asks Redis for whatever is due and sleeps until the next score. That is why a delay of 24 hours costs the same as a delay of 1 second.</p>
<p>How accurate is it?</p>
<div class="out">--- Độ chính xác: 20 job hẹn rải từ 100ms tới 2000ms ---
   chạy đủ 20/20 job
   sai số: nhỏ nhất 4ms · lớn nhất 113ms · trung bình 52ms
   ⇒ hẹn giờ là "không sớm hơn", KHÔNG phải "đúng vào lúc"</div>
<p>Average 52ms late, worst 113ms. For a reminder email that is irrelevant; for anything where you were planning to build a countdown UI from the delay value, it is not. <code>delay</code> guarantees a job will not run <em>early</em>. It says nothing about how busy the workers will be when the moment arrives — if all of them are occupied, a due job simply waits its turn.</p>

<h3>Priority — the OTP that must not queue behind a report</h3>
<div class="out">--- priority — số NHỎ chạy trước ---
   thứ tự chạy: 1.OTP đăng nhập · 2.báo cáo hàng loạt · 3.báo cáo hàng loạt …
   OTP (priority 1) chạy thứ 1 / 11, dù được thêm SAU 10 job kia</div>
<p>Lower number wins. The login OTP added <em>after</em> ten bulk-report jobs still ran first — which is precisely the scenario priority exists for.</p>
<p>Two limits worth stating. Priority decides the <strong>order jobs are taken out</strong>; a job already running is never interrupted, so a high-priority job can still wait behind a 30-second video encode that started a moment earlier. And priority is not a substitute for separate queues: if urgent and bulk work have genuinely different concurrency or rate limits, split the queue (lesson 13.2) rather than sorting one.</p>

<h3>Throttling — matching someone else's rate limit</h3>
<pre><code class="language-javascript">new Worker('sms', handler, {
  connection,
  concurrency: 10,
  limiter: { max: 10, duration: 1000 },     // tối đa 10 job mỗi giây
});</code></pre>
<div class="out">--- limiter — bên thứ ba chỉ cho 10 lần gọi mỗi giây ---
   30 job, limiter 10/giây → số job chạy trong từng giây: 10 · 10 · 10 · 0
   tổng 30 job trong 2017ms
   ⇒ limiter áp cho TOÀN hàng đợi (dùng chung qua Redis), không phải cho từng worker</div>
<p>Exactly 10, 10, 10. And the important word is the last line: the limiter counter lives in Redis, so it is shared across every worker process on that queue. Six worker containers with <code>max: 10</code> still produce ten calls per second in total, not sixty. This is the same distinction lesson 12.4 drew between an in-memory counter and a Redis one — and here you get it for free.</p>
<p>This is the honest answer to "how do I respect a third-party API that allows 100 requests per minute". Not sleeps scattered through your code; one <code>limiter</code> on the queue that owns those calls.</p>

<h3>Recurring work — and why <code>setInterval</code> is the wrong tool</h3>
<pre><code class="language-javascript">// chạy lúc 3 giờ sáng mỗi ngày, giờ Việt Nam
await queue.upsertJobScheduler(
  'don-dep-hang-dem',                                   // KHOÁ ổn định — đây là điểm mấu chốt
  { pattern: '0 3 * * *', tz: 'Asia/Ho_Chi_Minh' },
  { name: 'cleanup', data: {} },
);</code></pre>
<div class="out">--- Job định kỳ: chạy mỗi 400ms ---
   chạy 6 lần, các mốc: 21ms → 500ms → 908ms → 1216ms → 1628ms → 2048ms
   getJobSchedulers(): key="don-dep" every=400ms next=đã đặt
   gọi upsertJobScheduler lần nữa với cùng key → tổng số scheduler = 1 (không nhân đôi)</div>
<p>Calling it again with the same key updates the schedule instead of adding a second one — which matters because this call lives in your startup code and runs on <em>every</em> boot.</p>
<p>Now the measurement that settles the architecture question:</p>
<div class="out">--- Ba tiến trình cùng đăng ký một job định kỳ ---
   3 tiến trình cùng đăng ký, sau 1,3 giây job chạy 5 lần (KHÔNG phải 15)
   ⇒ Lịch nằm trong Redis, không nằm trong tiến trình → deploy 3 pod vẫn chỉ 1 lịch.</div>
<p>Three processes registered the same scheduler and the job fired <strong>5 times, not 15</strong>. The schedule is state in Redis, not a timer in a process. Compare that with <code>setInterval</code> or in-process <code>node-cron</code>: those are timers <em>inside</em> a process, so three replicas means three independent timers means the nightly cleanup runs three times, the report email is sent three times, and the only thing standing between you and that bug is the fact that you currently run one container.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">setInterval</span><span class="v">Drifts over time, dies with the process, multiplies with the replica count, and forgets missed runs. Only for harmless in-memory work</span></div>
  <div class="kv"><span class="k">node-cron inside the process</span><span class="v">Proper cron syntax and timezone awareness, BUT still inside the process → 3 replicas = 3 runs. It needs a distributed lock (lesson 12.4) if you run more than one</span></div>
  <div class="kv"><span class="k">the operating system's crontab</span><span class="v">Survives every application restart, but lives outside your code, your logs and your repo. Easy to forget when you change servers</span></div>
  <div class="kv"><span class="k">BullMQ's job scheduler</span><span class="v">The schedule lives in Redis, runs exactly ONCE no matter how many processes there are, and shares its retry and observability machinery with every other job</span></div>
</div>

<h3>What a scheduled job should actually do</h3>
<pre><code class="language-javascript">// SAI: job định kỳ tự làm hết việc
new Worker('cron', async () =&gt; {
  const users = await db.user.findMany({ where: { needsDigest: true } });   // 50.000 người
  for (const u of users) await sendDigest(u);        // một job khổng lồ, hỏng giữa chừng là mất sạch
});

// ĐÚNG: job định kỳ chỉ RẢI việc ra
new Worker('cron', async () =&gt; {
  const users = await db.user.findMany({ where: { needsDigest: true }, select: { id: true } });
  await digestQueue.addBulk(users.map((u) =&gt; ({
    name: 'digest',
    data: { userId: u.id },
    opts: { jobId: &#96;digest-\${u.id}-\${today}&#96;, attempts: 3 },
  })));
});</code></pre>
<p>The fan-out version gets everything from this chapter for free: each user's digest retries independently, a failure affects one person instead of fifty thousand, progress is visible as a shrinking queue, and <code>addBulk</code> makes the enqueue itself 11× cheaper (lesson 13.2). The monolithic version has none of that and fails 40.000 users deep with no record of where it stopped.</p>

<div class="pitfall">
<p><strong>Cron patterns run in a timezone, and servers run in UTC.</strong> <code>'0 3 * * *'</code> without a <code>tz</code> fires at 3am UTC, which is 10am in Vietnam — a "nightly cleanup" running in the middle of the working day. Always pass <code>tz</code> explicitly, and remember that a job scheduled for 2:30am will fire twice or zero times in countries with daylight saving. Also: if your process is down when a scheduled time passes, that occurrence is simply skipped. A scheduler is not a guarantee that something ran, only that something was <em>asked</em> to run.</p>
</div>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> <code>src/services/cron.service.ts</code> registers <strong>eleven</strong> <code>cron.schedule()</code> calls with node-cron — nightly cleanup at 20:00 UTC (03:00 Vietnam), a weekly re-embed check, an hourly health check that pings Redis and Postgres, a 15-minute sweep, a 5-minute scheduled-publish sweep, and more. The comments even document the UTC/Vietnam conversion for each one, which is the pitfall above taken seriously. What it does <em>not</em> have is any distributed guard: the only protection is a module-level <code>let _started = false</code>, which is per-process. That is correct today because production runs exactly one backend container — and it is precisely the thing that breaks the day a second one starts, silently, by doing everything twice.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-617"><span class="lc-t">Code Lab · Message Queues and Event-Driven Architecture</span><span class="lc-d">Delayed, repeating and prioritised jobs</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/redis${REF}#module-737"><span class="lc-t">Code Lab · Lua Scripting Mastery for Atomic Operations</span><span class="lc-d">The atomic machinery beneath the limiter and the scheduler</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.4</span>
<h2>Lịch trình: hẹn giờ, ưu tiên, bóp tốc độ và job định kỳ</h2>
<p class="lead">Một khi công việc sống trong hàng đợi thay vì trong request, có bốn câu hỏi trở nên trả lời được mà trước đó thì không: nó nên chạy <em>khi nào</em>, theo <em>thứ tự nào</em>, <em>nhanh cỡ nào</em>, và <em>bao lâu một lần</em>. Mỗi câu là một tuỳ chọn, và câu nào cũng có một cạnh sắc làm người ta bất ngờ.</p>

<h3>Hẹn giờ — "không sớm hơn", chứ không phải "đúng vào lúc"</h3>
<pre><code class="language-javascript">await queue.add('remind', { userId }, { delay: 24 * 60 * 60 * 1000 });   // nhắc sau 24 giờ</code></pre>
<div class="out">   vừa thêm: delayed=1 · waiting=0
   khoá: 1, meta, id, marker, delayed, events
   kiểu bull:dz:delayed = zset
   nội dung: ["1","7312115256188928"] → score = thời điểm chạy</div>
<p>Một job hẹn giờ đi vào một <strong>sorted set</strong> được chấm điểm bằng chính thời điểm chạy của nó — đúng cấu trúc mà bài 12.3 dùng cho bảng xếp hạng. Không có gì phải hỏi vòng vòng cả; worker hỏi Redis xem có gì tới hạn chưa rồi ngủ tới điểm số kế tiếp. Đó là lý do hẹn 24 giờ tốn đúng bằng hẹn 1 giây.</p>
<p>Nó chính xác tới đâu?</p>
<div class="out">--- Độ chính xác: 20 job hẹn rải từ 100ms tới 2000ms ---
   chạy đủ 20/20 job
   sai số: nhỏ nhất 4ms · lớn nhất 113ms · trung bình 52ms
   ⇒ hẹn giờ là "không sớm hơn", KHÔNG phải "đúng vào lúc"</div>
<p>Trung bình muộn 52ms, tệ nhất 113ms. Với một email nhắc nhở thì chuyện đó chẳng liên quan; nhưng với bất cứ thứ gì mà bạn định dựng một đồng hồ đếm ngược trên giao diện từ giá trị delay thì lại rất liên quan. <code>delay</code> bảo đảm job sẽ không chạy <em>sớm</em>. Nó không nói gì về việc worker sẽ bận cỡ nào khi khoảnh khắc đó tới — nếu tất cả đang bận thì một job tới hạn chỉ đơn giản là xếp hàng chờ tới lượt.</p>

<h3>Ưu tiên — cái OTP không được xếp sau một bản báo cáo</h3>
<div class="out">--- priority — số NHỎ chạy trước ---
   thứ tự chạy: 1.OTP đăng nhập · 2.báo cáo hàng loạt · 3.báo cáo hàng loạt …
   OTP (priority 1) chạy thứ 1 / 11, dù được thêm SAU 10 job kia</div>
<p>Số nhỏ hơn thì thắng. Cái OTP đăng nhập được thêm vào <em>sau</em> mười job báo cáo hàng loạt vẫn chạy trước tiên — đúng là kịch bản mà mức ưu tiên sinh ra để phục vụ.</p>
<p>Có hai giới hạn đáng nói. Ưu tiên quyết định <strong>thứ tự job được LẤY RA</strong>; một job đang chạy thì không bao giờ bị ngắt, nên một job ưu tiên cao vẫn có thể phải chờ sau một lượt nén video 30 giây vừa bắt đầu trước đó một khoảnh khắc. Và ưu tiên không thay thế được việc tách hàng đợi: nếu việc khẩn và việc hàng loạt thật sự cần concurrency hay giới hạn tốc độ khác nhau thì hãy tách hàng đợi ra (bài 13.2) chứ đừng sắp xếp bên trong một cái.</p>

<h3>Bóp tốc độ — khớp với giới hạn của người khác</h3>
<pre><code class="language-javascript">new Worker('sms', handler, {
  connection,
  concurrency: 10,
  limiter: { max: 10, duration: 1000 },     // tối đa 10 job mỗi giây
});</code></pre>
<div class="out">--- limiter — bên thứ ba chỉ cho 10 lần gọi mỗi giây ---
   30 job, limiter 10/giây → số job chạy trong từng giây: 10 · 10 · 10 · 0
   tổng 30 job trong 2017ms
   ⇒ limiter áp cho TOÀN hàng đợi (dùng chung qua Redis), không phải cho từng worker</div>
<p>Đúng 10, 10, 10. Và từ quan trọng nằm ở dòng cuối: bộ đếm của limiter sống trong Redis, nên nó được dùng chung giữa mọi tiến trình worker của hàng đợi đó. Sáu container worker cùng đặt <code>max: 10</code> vẫn cho ra tổng cộng mười lệnh gọi mỗi giây, chứ không phải sáu mươi. Đây chính là sự phân biệt mà bài 12.4 đã vạch ra giữa một bộ đếm trong bộ nhớ và một bộ đếm trong Redis — và ở đây bạn được nhận nó miễn phí.</p>
<p>Đây là câu trả lời trung thực cho "làm sao tôn trọng một API bên thứ ba cho phép 100 request mỗi phút". Không phải rắc mấy lệnh ngủ khắp nơi trong code; mà là MỘT <code>limiter</code> đặt trên hàng đợi sở hữu những lệnh gọi đó.</p>

<h3>Việc lặp lại định kỳ — và vì sao <code>setInterval</code> là công cụ sai</h3>
<pre><code class="language-javascript">// chạy lúc 3 giờ sáng mỗi ngày, giờ Việt Nam
await queue.upsertJobScheduler(
  'don-dep-hang-dem',                                   // KHOÁ ổn định — đây là điểm mấu chốt
  { pattern: '0 3 * * *', tz: 'Asia/Ho_Chi_Minh' },
  { name: 'cleanup', data: {} },
);</code></pre>
<div class="out">--- Job định kỳ: chạy mỗi 400ms ---
   chạy 6 lần, các mốc: 21ms → 500ms → 908ms → 1216ms → 1628ms → 2048ms
   getJobSchedulers(): key="don-dep" every=400ms next=đã đặt
   gọi upsertJobScheduler lần nữa với cùng key → tổng số scheduler = 1 (không nhân đôi)</div>
<p>Gọi lại với cùng một khoá thì nó CẬP NHẬT lịch chứ không thêm cái thứ hai — điều này quan trọng vì lệnh gọi ấy nằm trong code khởi động và chạy ở <em>mỗi</em> lần bật máy.</p>
<p>Bây giờ tới phép đo phân định câu hỏi về kiến trúc:</p>
<div class="out">--- Ba tiến trình cùng đăng ký một job định kỳ ---
   3 tiến trình cùng đăng ký, sau 1,3 giây job chạy 5 lần (KHÔNG phải 15)
   ⇒ Lịch nằm trong Redis, không nằm trong tiến trình → deploy 3 pod vẫn chỉ 1 lịch.</div>
<p>Ba tiến trình cùng đăng ký một scheduler và job chạy <strong>5 lần, không phải 15</strong>. Lịch là TRẠNG THÁI nằm trong Redis, chứ không phải một cái hẹn giờ nằm trong tiến trình. Hãy so với <code>setInterval</code> hay <code>node-cron</code> chạy trong tiến trình: đó là những cái hẹn giờ nằm <em>bên trong</em> một tiến trình, nên ba bản sao nghĩa là ba cái hẹn giờ độc lập, nghĩa là lượt dọn dẹp ban đêm chạy ba lần, email báo cáo gửi ba lần, và thứ duy nhất đứng giữa bạn với con bug đó là việc hiện giờ bạn mới chạy một container.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">setInterval</span><span class="v">Trôi dạt dần, chết khi tiến trình chết, nhân lên theo số bản sao, không nhớ lần chạy bị hụt. Chỉ dùng cho việc trong bộ nhớ, vô hại</span></div>
  <div class="kv"><span class="k">node-cron trong tiến trình</span><span class="v">Cú pháp cron đúng chuẩn, hiểu múi giờ, NHƯNG vẫn nằm trong tiến trình → 3 bản sao = 3 lần chạy. Cần một khoá phân tán (bài 12.4) nếu chạy nhiều bản</span></div>
  <div class="kv"><span class="k">crontab của hệ điều hành</span><span class="v">Sống sót qua mọi lần khởi động lại ứng dụng, nhưng nằm ngoài code, ngoài log, ngoài repo. Rất dễ quên khi đổi máy chủ</span></div>
  <div class="kv"><span class="k">Job scheduler của BullMQ</span><span class="v">Lịch nằm trong Redis, chạy đúng MỘT lần dù có bao nhiêu tiến trình, dùng chung cơ chế thử lại và quan sát với mọi job khác</span></div>
</div>

<h3>Một job định kỳ nên làm gì</h3>
<pre><code class="language-javascript">// SAI: job định kỳ tự làm hết việc
new Worker('cron', async () =&gt; {
  const users = await db.user.findMany({ where: { needsDigest: true } });   // 50.000 người
  for (const u of users) await sendDigest(u);        // một job khổng lồ, hỏng giữa chừng là mất sạch
});

// ĐÚNG: job định kỳ chỉ RẢI việc ra
new Worker('cron', async () =&gt; {
  const users = await db.user.findMany({ where: { needsDigest: true }, select: { id: true } });
  await digestQueue.addBulk(users.map((u) =&gt; ({
    name: 'digest',
    data: { userId: u.id },
    opts: { jobId: &#96;digest-\${u.id}-\${today}&#96;, attempts: 3 },
  })));
});</code></pre>
<p>Bản rải việc được nhận miễn phí mọi thứ của chương này: bản tin của từng người thử lại độc lập, một lần hỏng chỉ ảnh hưởng một người thay vì năm mươi nghìn, tiến độ nhìn thấy được qua độ dài hàng đợi đang co lại, và <code>addBulk</code> làm cho chính việc đưa vào hàng đợi rẻ hơn 11 lần (bài 13.2). Bản làm-hết-một-cục thì chẳng có gì trong số đó và hỏng ở người thứ 40.000 mà không để lại dấu vết nào về chỗ nó dừng.</p>

<div class="pitfall">
<p><strong>Biểu thức cron chạy theo múi giờ, còn máy chủ chạy theo UTC.</strong> <code>'0 3 * * *'</code> mà không có <code>tz</code> sẽ nổ lúc 3 giờ sáng UTC, tức 10 giờ sáng ở Việt Nam — một lượt "dọn dẹp ban đêm" chạy giữa giờ làm việc. Hãy luôn truyền <code>tz</code> tường minh, và nhớ rằng một job hẹn 2 giờ 30 sáng sẽ nổ hai lần hoặc không nổ lần nào ở các nước có giờ mùa hè. Ngoài ra: nếu tiến trình của bạn đang chết vào lúc mốc giờ đó trôi qua thì lần chạy ấy đơn giản là bị bỏ. Một bộ lập lịch không phải lời bảo đảm rằng một việc ĐÃ chạy, nó chỉ bảo đảm rằng một việc đã ĐƯỢC YÊU CẦU chạy.</p>
</div>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> <code>src/services/cron.service.ts</code> đăng ký <strong>mười một</strong> lệnh <code>cron.schedule()</code> bằng node-cron — dọn dẹp ban đêm lúc 20:00 UTC (03:00 giờ Việt Nam), một lượt kiểm tra embedding hằng tuần, một lượt kiểm tra sức khoẻ mỗi giờ có ping cả Redis lẫn Postgres, một lượt quét 15 phút, một lượt quét bài hẹn đăng mỗi 5 phút, và nhiều nữa. Phần chú thích còn ghi rõ phép quy đổi UTC/Việt Nam cho từng cái, tức là đã coi trọng đúng cái bẫy ở trên. Thứ nó <em>không</em> có là bất kỳ chốt chặn phân tán nào: bảo vệ duy nhất là một biến cấp module <code>let _started = false</code>, mà biến đó chỉ tính trong PHẠM VI một tiến trình. Hôm nay điều đó đúng vì production chạy đúng một container backend — và nó cũng chính là thứ sẽ vỡ vào cái ngày container thứ hai được bật lên, một cách âm thầm, bằng việc làm mọi thứ hai lần.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-617"><span class="lc-t">Code Lab · Message Queues and Event-Driven Architecture</span><span class="lc-d">Job hẹn giờ, định kỳ và ưu tiên</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/redis${REF}#module-737"><span class="lc-t">Code Lab · Lua Scripting Mastery for Atomic Operations</span><span class="lc-d">Cơ chế nguyên tử nằm dưới limiter và scheduler</span></a>
</div>
</div>
`,
    },
    /* ─────────────────────────── 13.5 ─────────────────────────── */
    {
      title: '13.5 — When the worker dies: stalled jobs, deploys and cleanup|||13.5 — Khi worker chết: job treo, deploy và dọn dẹp',
      slug: 'nodejs-13-5-worker-chet-va-van-hanh',
      type: 'VIDEO',
      description: 'SIGKILL worker giữa lúc chạy job: job KHÔNG mất, một worker khác nhặt lại sau 2036ms. Nhưng một job chặn event loop thì bị coi là treo và chạy lại. Và tắt êm khác tắt thô: 1296ms xong việc, hay 5ms cắt ngang.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.5</span>
<h2>When the worker dies: stalled jobs, deploys and cleanup</h2>
<p class="lead">Everything so far assumed the worker keeps running. It does not. It gets deployed over, OOM-killed, rescheduled by the orchestrator, or crashes on a bug in job 4.000 of 10.000. This lesson kills a worker on purpose, mid-job, and measures what survives.</p>

<h3>Measurement 1 — SIGKILL in the middle of a job</h3>
<div class="out">--- SIGKILL worker giữa lúc job đang chạy ---
   worker con đã nhận job · active=1
   đã SIGKILL worker (không kịp dọn dẹp gì)
   ngay sau khi giết: active=1 waiting=0 ⇒ job "mắc kẹt" ở trạng thái active
   worker MỚI nhặt lại job sau 2036ms · sự kiện "stalled": 1
   ⇒ Job KHÔNG mất. BullMQ phát hiện khoá hết hạn rồi trả job về hàng chờ.
   completed=1 failed=0</div>
<p>The job survived a <code>SIGKILL</code> — the signal a process cannot catch, handle or delay. Note the middle line though: for those 2036ms the job sat in <code>active</code> with nobody working on it. Nothing about the queue's own state said "this is broken"; it looked exactly like a job that was simply taking a while.</p>
<p>The recovery mechanism is the distributed lock from lesson 12.4, applied per job. A worker holds a lock with a TTL (<code>lockDuration</code>, default 30 seconds) and renews it while it works. When the process dies, nothing renews it, the lock expires, and another worker's periodic check (<code>stalledInterval</code>) notices an <code>active</code> job with no live lock and moves it back to <code>wait</code>. It fires a <code>stalled</code> event when it does — <strong>that event is worth logging and alerting on</strong>, because a queue with a steady trickle of stalls is telling you workers are dying or jobs are blocking.</p>
<p>And this is the mechanism that makes <strong>at-least-once</strong> concrete: a crash after the work finished but before the acknowledgement means the job runs again. Lesson 13.3's idempotency requirement is not theoretical, it is this measurement.</p>

<h3>Measurement 2 — a long job is fine, a blocking job is not</h3>
<p>With <code>lockDuration: 1000</code>, a job that awaits for 3 seconds:</p>
<div class="out">--- Job chạy lâu hơn lockDuration (worker vẫn sống) ---
   hàm xử lý chạy 1 lần (job chỉ có 1) · completed=1 failed=0
   ⇒ Worker tự GIA HẠN khoá trong lúc chạy, nên job dài không bị coi là treo.</div>
<p>Correct — the renewal timer runs on the event loop while the handler awaits. Now the same 3 seconds spent in a <code>while</code> loop instead:</p>
<div class="out">--- Job CHẶN event loop 3 giây (lockDuration 1s) ---
Error: Missing lock for job 1. moveToFinished
  … code: -2
   hàm xử lý chạy 2 lần · stalled events: 2
   completed=0 failed=1
   ⇒ Chặn event loop = timer gia hạn khoá KHÔNG chạy được ⇒ job bị coi là TREO và chạy LẠI.</div>
<p><code>Missing lock for job 1. moveToFinished</code> is a real production error message, and now you know exactly what it means: <strong>your handler blocked the event loop past <code>lockDuration</code></strong>, so the renewal never fired, so the job was declared stalled and re-run — and when the original finally finished it no longer owned the lock and could not record its own completion. The job ran twice and still ended as <code>failed</code>.</p>
<p>This is chapter 2.4 with a new consequence. There it cost latency; here it costs correctness. A CPU-heavy handler needs a sandboxed processor, a worker thread, or a separate process — never a tighter <code>lockDuration</code>, which only changes how fast you get the bug.</p>

<h3>Measurement 3 — the deploy</h3>
<p>Every deploy sends <code>SIGTERM</code>. With a handler for it:</p>
<div class="out">--- Tắt êm (graceful shutdown) ---
   nhật ký worker: SAN-SANG | BATDAU 1 | NHAN-SIGTERM | XONG 1 | DA-DONG
   thoát sau 1296ms — kịp làm nốt job đang chạy
   completed=1 · còn chờ=2 (worker khác sẽ làm nốt)</div>
<p>Without one:</p>
<div class="out">--- Không xử lý SIGTERM ---
   nhật ký worker: SAN-SANG | BATDAU 1
   thoát sau 5ms — CẮT NGANG job đang chạy
   completed=0 · active=1 (job kẹt, phải chờ cơ chế stalled cứu)</div>
<p><strong>1296ms finishing the job, versus 5ms abandoning it.</strong> The job is not lost either way — the stalled mechanism eventually rescues it — but "eventually" is up to <code>lockDuration</code> away (30 seconds by default), during which the work has silently not happened, and then it runs a second time. Multiply by every deploy.</p>
<pre><code class="language-javascript">const worker = new Worker('email', handler, { connection, concurrency: 10 });

const shutdown = async (signal) =&gt; {
  logger.info('đang tắt worker', { signal });
  await worker.close();          // ngừng nhận job MỚI, chờ job đang chạy xong
  await queue.close();
  await redis.quit();
  process.exit(0);
};
process.on('SIGTERM', shutdown);   // docker stop, deploy, orchestrator
process.on('SIGINT', shutdown);    // Ctrl+C khi chạy máy cục bộ</code></pre>
<p>Two operational details make this actually work. Give the platform enough time — Docker's default <code>SIGTERM</code> grace period is 10 seconds and then it sends <code>SIGKILL</code>, so a queue whose jobs take 60 seconds needs <code>stop_grace_period</code> raised or it gets killed mid-shutdown anyway. And keep individual jobs short: a job you can finish in a few seconds makes graceful shutdown trivial, while a 20-minute job makes every deploy a decision.</p>

<h3>Cleanup, or Redis fills up with your history</h3>
<div class="out">   3000 job xong, KHÔNG dọn: giữ lại 3000 bản ghi, RAM +3,94MB
   3000 job xong, removeOnComplete:100: giữ lại 100 bản ghi, RAM +0,49MB</div>
<p>Completed jobs are kept by default, forever. Three thousand trivial jobs cost 3,94 MB; at production volume that is how a queue quietly consumes the 256 MB from lesson 12.6 and starts refusing writes with <code>OOM command not allowed</code>. Set retention on every queue:</p>
<pre><code class="language-javascript">const emailQueue = new Queue('email', {
  connection,
  defaultJobOptions: {
    attempts: 5,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: { age: 3600, count: 1000 },   // giữ 1 giờ HOẶC 1000 bản gần nhất
    removeOnFail: { age: 7 * 24 * 3600 },           // giữ job HỎNG lâu hơn — còn để điều tra
  },
});</code></pre>
<p>Keep failures far longer than successes. A completed job is a receipt nobody reads; a failed job is evidence, and lesson 13.3 showed you replay it straight from the <code>failed</code> set.</p>

<h3>What to watch</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">waiting is climbing</span><span class="v">The MOST IMPORTANT signal. Work arriving faster than it leaves → add workers, raise concurrency, or fix the slow job. Alert on the TREND, not on an absolute number</span></div>
  <div class="kv"><span class="k">failed is climbing</span><span class="v">Something is systematically broken. One failed job is routine; a steady rise in failures is an incident</span></div>
  <div class="kv"><span class="k">stalled events</span><span class="v">Workers are dying, or a job is blocking the event loop. This should be zero</span></div>
  <div class="kv"><span class="k">the age of the oldest job</span><span class="v">A queue can be short and still stuck. "The oldest job has waited 40 minutes" says far more than "12 jobs are waiting"</span></div>
  <div class="kv"><span class="k">processing time</span><span class="v">Gradually slowing = a third party is degrading, or your data has grown</span></div>
</div>
<pre><code class="language-javascript">// một endpoint sức khoẻ đủ dùng, không cần thư viện nào
app.get('/health/queues', async (req, res) =&gt; {
  const counts = await emailQueue.getJobCounts('waiting', 'active', 'failed', 'delayed');
  const [oldest] = await emailQueue.getWaiting(0, 0);
  res.json({
    ...counts,
    oldestWaitingAgeMs: oldest ? Date.now() - oldest.timestamp : 0,
  });
});</code></pre>
<p>For a UI, <code>@bull-board/express</code> mounts a dashboard showing every queue, every failed job with its stack trace, and a retry button — and it must sit behind the admin check from chapter 8.3, because it exposes <code>job.data</code> and can re-run work.</p>

<h3>The checklist for putting a queue in production</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-t">A dedicated Redis, noeviction</span><span class="lz-d">Do not share the cache Redis set to allkeys-lru — it will evict your jobs (lesson 12.6)</span></div>
  <div class="lz-step"><span class="lz-t">Workers in a separate process</span><span class="lz-d">No shared event loop with the web tier, and independent scaling</span></div>
  <div class="lz-step"><span class="lz-t">attempts + backoff + idempotent</span><span class="lz-d">All three, not one of three (lesson 13.3)</span></div>
  <div class="lz-step"><span class="lz-t">SIGTERM closes the worker</span><span class="lz-d">Every single deploy depends on it</span></div>
  <div class="lz-step"><span class="lz-t">removeOnComplete / removeOnFail</span><span class="lz-d">Leave it unset and Redis grows until it refuses writes</span></div>
  <div class="lz-step"><span class="lz-t">Alerts on waiting and failed</span><span class="lz-d">Queues fail silently — that is their characteristic failure mode</span></div>
</div>

<div class="pitfall">
<p><strong>The queue is a second system, and it fails on its own schedule.</strong> When Redis is down, <code>queue.add()</code> throws — inside your HTTP route. Decide now what that means: for a welcome email, catch it and let the request succeed (the user cares about the account, not the email); for a payment job, fail the request loudly. This is the same fail-open versus fail-closed decision the rate limiter made in lesson 12.4, and the answer differs per queue. What you must not do is let an unhandled Redis error turn a working signup into a 500.</p>
</div>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> This is where the in-process queue's bill comes due, and the file admits it: "if the process crashes mid-job, in-flight jobs are lost". There is no lock, no stalled detection, no second worker to reclaim anything — a deploy mid-embedding loses that document's job outright. The mitigation is real but manual: documents carry <code>embeddingStatus</code>, and <code>cron.service.ts</code> calls <code>recoverPendingJobs()</code> on startup to re-queue anything stuck in <code>processing</code>. That is a hand-built version of the stalled mechanism measured above, running once per boot instead of every <code>stalledInterval</code>. It works, and the honest way to describe it is: the site rebuilt the cheapest 20% of BullMQ and skipped the rest, deliberately, because one process does not need the rest — yet.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-617"><span class="lc-t">Code Lab · Message Queues and Event-Driven Architecture</span><span class="lc-d">Operating a queue: stuck jobs, graceful shutdown, cleanup</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/observability-monitoring${REF}#module-990"><span class="lc-t">Code Lab · Metrics &amp; Dashboards</span><span class="lc-d">Đo và cảnh báo cho hàng đợi — nối tiếp chương 15</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.5</span>
<h2>Khi worker chết: job treo, deploy và dọn dẹp</h2>
<p class="lead">Mọi thứ từ đầu chương tới giờ đều giả định worker cứ chạy mãi. Nó không chạy mãi đâu. Nó bị deploy đè lên, bị OOM giết, bị bộ điều phối xếp lại chỗ, hoặc sập vì một con bug ở job thứ 4.000 trong số 10.000. Bài này giết worker một cách có chủ ý, ngay giữa lúc nó đang làm việc, và đo xem cái gì sống sót.</p>

<h3>Phép đo 1 — SIGKILL giữa lúc đang chạy job</h3>
<div class="out">--- SIGKILL worker giữa lúc job đang chạy ---
   worker con đã nhận job · active=1
   đã SIGKILL worker (không kịp dọn dẹp gì)
   ngay sau khi giết: active=1 waiting=0 ⇒ job "mắc kẹt" ở trạng thái active
   worker MỚI nhặt lại job sau 2036ms · sự kiện "stalled": 1
   ⇒ Job KHÔNG mất. BullMQ phát hiện khoá hết hạn rồi trả job về hàng chờ.
   completed=1 failed=0</div>
<p>Job sống sót qua một cú <code>SIGKILL</code> — tín hiệu mà tiến trình không bắt được, không xử lý được, không trì hoãn được. Nhưng hãy để ý dòng ở giữa: trong suốt 2036ms đó job nằm ở trạng thái <code>active</code> mà chẳng có ai làm nó cả. Không có gì trong trạng thái của hàng đợi nói rằng "cái này đang hỏng"; nó trông y hệt một job chỉ đơn giản là hơi lâu.</p>
<p>Cơ chế phục hồi chính là khoá phân tán của bài 12.4, áp cho từng job. Một worker giữ khoá kèm hạn (<code>lockDuration</code>, mặc định 30 giây) và gia hạn nó trong lúc làm việc. Khi tiến trình chết, không còn ai gia hạn, khoá hết hạn, và lượt kiểm tra định kỳ của một worker khác (<code>stalledInterval</code>) phát hiện một job <code>active</code> mà không có khoá còn sống, rồi chuyển nó về <code>wait</code>. Lúc làm việc đó nó phát ra sự kiện <code>stalled</code> — <strong>sự kiện đó đáng được ghi log và đặt cảnh báo</strong>, vì một hàng đợi rỉ rả sinh ra job treo đang nói cho bạn biết rằng worker đang chết hoặc job đang chặn event loop.</p>
<p>Và đây chính là cơ chế làm cho <strong>"ít nhất một lần"</strong> trở nên cụ thể: một cú sập xảy ra sau khi công việc đã xong nhưng trước khi kịp báo nhận nghĩa là job sẽ chạy lại. Yêu cầu idempotent của bài 13.3 không phải lý thuyết, nó chính là phép đo này.</p>

<h3>Phép đo 2 — job DÀI thì không sao, job CHẶN mới chết</h3>
<p>Với <code>lockDuration: 1000</code>, một job await 3 giây:</p>
<div class="out">--- Job chạy lâu hơn lockDuration (worker vẫn sống) ---
   hàm xử lý chạy 1 lần (job chỉ có 1) · completed=1 failed=0
   ⇒ Worker tự GIA HẠN khoá trong lúc chạy, nên job dài không bị coi là treo.</div>
<p>Đúng như mong đợi — cái timer gia hạn chạy trên event loop trong lúc hàm xử lý đang await. Bây giờ vẫn 3 giây đó nhưng tiêu trong một vòng lặp <code>while</code>:</p>
<div class="out">--- Job CHẶN event loop 3 giây (lockDuration 1s) ---
Error: Missing lock for job 1. moveToFinished
  … code: -2
   hàm xử lý chạy 2 lần · sự kiện stalled: 2
   completed=0 failed=1
   ⇒ Chặn event loop = timer gia hạn khoá KHÔNG chạy được ⇒ job bị coi là TREO và chạy LẠI.</div>
<p><code>Missing lock for job 1. moveToFinished</code> là một thông báo lỗi production có thật, và bây giờ bạn biết chính xác nó nghĩa là gì: <strong>hàm xử lý của bạn đã chặn event loop quá <code>lockDuration</code></strong>, nên lệnh gia hạn không bao giờ nổ, nên job bị tuyên là treo và bị chạy lại — rồi khi bản gốc cuối cùng cũng xong thì nó không còn sở hữu khoá nữa và không ghi nổi kết quả của chính mình. Job chạy hai lần mà vẫn kết thúc ở trạng thái <code>failed</code>.</p>
<p>Đây là bài 2.4 với một hậu quả mới. Ở đó nó tốn độ trễ; ở đây nó tốn tính đúng đắn. Một hàm xử lý nặng CPU cần một sandboxed processor, một worker thread, hoặc một tiến trình riêng — tuyệt đối không phải một <code>lockDuration</code> chặt hơn, thứ chỉ thay đổi tốc độ bạn gặp con bug.</p>

<h3>Phép đo 3 — cú deploy</h3>
<p>Mỗi lần deploy đều gửi <code>SIGTERM</code>. Khi có xử lý tín hiệu đó:</p>
<div class="out">--- Tắt êm (graceful shutdown) ---
   nhật ký worker: SAN-SANG | BATDAU 1 | NHAN-SIGTERM | XONG 1 | DA-DONG
   thoát sau 1296ms — kịp làm nốt job đang chạy
   completed=1 · còn chờ=2 (worker khác sẽ làm nốt)</div>
<p>Khi không có:</p>
<div class="out">--- Không xử lý SIGTERM ---
   nhật ký worker: SAN-SANG | BATDAU 1
   thoát sau 5ms — CẮT NGANG job đang chạy
   completed=0 · active=1 (job kẹt, phải chờ cơ chế stalled cứu)</div>
<p><strong>1296ms để làm xong việc, so với 5ms để bỏ của chạy lấy người.</strong> Job không mất trong cả hai trường hợp — cơ chế job treo rồi sẽ cứu nó — nhưng "rồi sẽ" có thể là tận <code>lockDuration</code> sau đó (mặc định 30 giây), trong suốt quãng ấy công việc đã âm thầm KHÔNG diễn ra, và rồi nó chạy thêm một lần nữa. Hãy nhân con số đó với số lần bạn deploy.</p>
<pre><code class="language-javascript">const worker = new Worker('email', handler, { connection, concurrency: 10 });

const shutdown = async (signal) =&gt; {
  logger.info('đang tắt worker', { signal });
  await worker.close();          // ngừng nhận job MỚI, chờ job đang chạy xong
  await queue.close();
  await redis.quit();
  process.exit(0);
};
process.on('SIGTERM', shutdown);   // docker stop, deploy, bộ điều phối
process.on('SIGINT', shutdown);    // Ctrl+C khi chạy máy cục bộ</code></pre>
<p>Hai chi tiết vận hành khiến đoạn này thật sự có tác dụng. Hãy cho nền tảng đủ thời gian — thời gian ân hạn mặc định của Docker sau <code>SIGTERM</code> là 10 giây rồi nó gửi <code>SIGKILL</code>, nên một hàng đợi có job chạy 60 giây thì phải nâng <code>stop_grace_period</code> lên, không thì đằng nào cũng bị giết giữa lúc đang tắt. Và hãy giữ cho từng job ngắn: một job bạn làm xong trong vài giây khiến việc tắt êm trở nên hiển nhiên, còn một job 20 phút biến mỗi lần deploy thành một quyết định khó.</p>

<h3>Dọn dẹp, nếu không Redis sẽ đầy ứ lịch sử của bạn</h3>
<div class="out">   3000 job xong, KHÔNG dọn: giữ lại 3000 bản ghi, RAM +3,94MB
   3000 job xong, removeOnComplete:100: giữ lại 100 bản ghi, RAM +0,49MB</div>
<p>Job hoàn tất được giữ lại theo mặc định, mãi mãi. Ba nghìn job tầm thường tốn 3,94 MB; ở khối lượng production thì đó chính là cách một hàng đợi lặng lẽ ngốn hết 256 MB của bài 12.6 rồi bắt đầu từ chối ghi bằng <code>OOM command not allowed</code>. Hãy đặt thời hạn lưu trữ cho MỌI hàng đợi:</p>
<pre><code class="language-javascript">const emailQueue = new Queue('email', {
  connection,
  defaultJobOptions: {
    attempts: 5,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: { age: 3600, count: 1000 },   // giữ 1 giờ HOẶC 1000 bản gần nhất
    removeOnFail: { age: 7 * 24 * 3600 },           // giữ job HỎNG lâu hơn — còn để điều tra
  },
});</code></pre>
<p>Hãy giữ job hỏng lâu hơn hẳn job thành công. Một job đã xong là một tờ biên lai không ai đọc; một job hỏng là bằng chứng, và bài 13.3 đã chỉ cho bạn cách chạy lại nó thẳng từ tập <code>failed</code>.</p>

<h3>Những gì cần theo dõi</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">waiting đang tăng</span><span class="v">Tín hiệu QUAN TRỌNG NHẤT. Việc vào nhanh hơn việc ra → thêm worker, tăng concurrency, hoặc sửa job chậm. Hãy cảnh báo theo XU HƯỚNG chứ đừng theo con số tuyệt đối</span></div>
  <div class="kv"><span class="k">failed đang tăng</span><span class="v">Có thứ đang hỏng một cách có hệ thống. Một job hỏng là chuyện thường; failed tăng đều là sự cố</span></div>
  <div class="kv"><span class="k">sự kiện stalled</span><span class="v">Worker đang chết hoặc job đang chặn event loop. Đáng lẽ nó phải bằng 0</span></div>
  <div class="kv"><span class="k">tuổi của job cũ nhất</span><span class="v">Hàng đợi có thể ngắn mà vẫn kẹt. "Job cũ nhất đã chờ 40 phút" nói lên nhiều điều hơn "đang có 12 job chờ"</span></div>
  <div class="kv"><span class="k">thời gian xử lý</span><span class="v">Chậm dần đi = bên thứ ba đang xuống sức, hoặc dữ liệu đã phình to</span></div>
</div>
<pre><code class="language-javascript">// một endpoint sức khoẻ đủ dùng, không cần thư viện nào
app.get('/health/queues', async (req, res) =&gt; {
  const counts = await emailQueue.getJobCounts('waiting', 'active', 'failed', 'delayed');
  const [oldest] = await emailQueue.getWaiting(0, 0);
  res.json({
    ...counts,
    oldestWaitingAgeMs: oldest ? Date.now() - oldest.timestamp : 0,
  });
});</code></pre>
<p>Nếu muốn có giao diện, <code>@bull-board/express</code> gắn vào một bảng điều khiển hiển thị mọi hàng đợi, mọi job hỏng kèm vết ngăn xếp, và một nút chạy lại — và nó BẮT BUỘC phải nằm sau lớp kiểm quyền admin của bài 8.3, vì nó phơi ra <code>job.data</code> và cho phép chạy lại công việc.</p>

<h3>Danh sách kiểm trước khi đưa hàng đợi lên production</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-t">Redis riêng, noeviction</span><span class="lz-d">Đừng dùng chung Redis cache đặt allkeys-lru — nó sẽ trục xuất job của bạn (bài 12.6)</span></div>
  <div class="lz-step"><span class="lz-t">Worker ở tiến trình riêng</span><span class="lz-d">Không dùng chung event loop với web, và co giãn độc lập được</span></div>
  <div class="lz-step"><span class="lz-t">attempts + backoff + idempotent</span><span class="lz-d">Cả ba, chứ không phải chọn một (bài 13.3)</span></div>
  <div class="lz-step"><span class="lz-t">SIGTERM đóng worker</span><span class="lz-d">Mỗi lần deploy đều dùng tới nó</span></div>
  <div class="lz-step"><span class="lz-t">removeOnComplete / removeOnFail</span><span class="lz-d">Không đặt thì Redis phình tới lúc từ chối ghi</span></div>
  <div class="lz-step"><span class="lz-t">Cảnh báo waiting và failed</span><span class="lz-d">Hàng đợi hỏng trong im lặng — đó là kiểu hỏng đặc trưng của nó</span></div>
</div>

<div class="pitfall">
<p><strong>Hàng đợi là một hệ thống thứ hai, và nó hỏng theo lịch riêng của nó.</strong> Khi Redis chết, <code>queue.add()</code> ném lỗi — ngay bên trong route HTTP của bạn. Hãy quyết định ngay bây giờ điều đó nghĩa là gì: với một email chào mừng thì hãy bắt lỗi và để request thành công (người dùng quan tâm tới cái tài khoản, không phải cái email); với một job thanh toán thì hãy cho request hỏng thật ồn ào. Đây đúng là quyết định fail-open hay fail-closed mà bộ giới hạn tần suất đã phải đưa ra ở bài 12.4, và câu trả lời khác nhau tuỳ từng hàng đợi. Thứ bạn tuyệt đối không được làm là để một lỗi Redis không ai bắt biến một lượt đăng ký đang chạy tốt thành mã 500.</p>
</div>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Đây chính là chỗ hàng đợi trong tiến trình phải trả hoá đơn, và file cũng thừa nhận: "nếu tiến trình sập giữa chừng thì các job đang bay bị mất". Không có khoá nào, không có cơ chế phát hiện job treo, không có worker thứ hai để đòi lại bất cứ thứ gì — một lần deploy giữa lúc đang tính embedding là mất trắng job của tài liệu đó. Biện pháp giảm nhẹ thì có thật nhưng thủ công: tài liệu mang theo <code>embeddingStatus</code>, và <code>cron.service.ts</code> gọi <code>recoverPendingJobs()</code> lúc khởi động để đưa lại vào hàng đợi mọi thứ đang kẹt ở <code>processing</code>. Đó là một phiên bản làm tay của cơ chế job treo vừa đo ở trên, chạy một lần mỗi lần bật máy thay vì chạy mỗi <code>stalledInterval</code>. Nó hoạt động được, và cách mô tả trung thực nhất là: trang này đã dựng lại 20% rẻ nhất của BullMQ rồi bỏ qua phần còn lại, một cách có chủ ý, bởi vì một tiến trình thì chưa cần tới phần còn lại — chưa.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-617"><span class="lc-t">Code Lab · Message Queues and Event-Driven Architecture</span><span class="lc-d">Vận hành hàng đợi: job treo, tắt êm, dọn dẹp</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/observability-monitoring${REF}#module-990"><span class="lc-t">Code Lab · Metrics &amp; Dashboards</span><span class="lc-d">Đo và cảnh báo cho hàng đợi — nối tiếp chương 15</span></a>
</div>
</div>
`,
    },

    /* ─────────────────────────── 13.6 ─────────────────────────── */
    {
      title: '13.6 — Quiz: background jobs|||13.6 — Kiểm tra: tác vụ nền',
      slug: 'nodejs-13-6-quiz',
      type: 'QUIZ',
      description: 'Chín câu về lý do dùng hàng đợi, concurrency, thử lại, idempotent, lịch trình, job treo và tắt êm.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every question below is settled by a measurement in lessons 13.1 to 13.5 — the 5 emails out of 100 that survived doing the work inline, the concurrency that bought 81× for I/O and exactly nothing for CPU, the payment charged three times, the three processes that produced one schedule. Queues fail quietly, so prefer the output block over your intuition.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mọi câu dưới đây đều được phân định bởi một phép đo trong bài 13.1 tới 13.5 — 5 email sống sót trên 100 khi làm việc ngay trong request, cái concurrency mua được 81 lần cho I/O và đúng bằng không cho CPU, cú thanh toán bị trừ ba lần, ba tiến trình chỉ sinh ra một lịch chạy. Hàng đợi hỏng trong im lặng, nên hãy tin khối kết quả đo hơn là tin trực giác.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'With an SMTP server accepting only 5 concurrent connections, 100 simultaneous signups sending mail inline delivered 5 emails and returned HTTP 500 to 95 users; the queued version delivered 100 with peak SMTP concurrency also 5. What did the queue actually provide?|||Với một máy chủ SMTP chỉ nhận 5 kết nối đồng thời, 100 lượt đăng ký cùng lúc gửi thư ngay trong request giao được 5 email và trả HTTP 500 cho 95 người; bản dùng hàng đợi giao được 100 với đỉnh kết nối SMTP cũng là 5. Hàng đợi thật sự đã mang lại điều gì?',
            options: [
              'It made SMTP faster by batching the messages together|||Nó làm SMTP nhanh hơn nhờ gộp các tin nhắn lại',
              'It stopped the system asking for more than the downstream could give, and REMEMBERED the rest instead of dropping it — a correctness difference, not a performance one|||Nó khiến hệ thống thôi đòi hỏi nhiều hơn cái bên dưới có thể cho, và GHI NHỚ phần còn lại thay vì vứt đi — khác biệt về tính đúng đắn, không phải về hiệu năng',
              'It moved the work to a different server with a higher connection limit|||Nó chuyển công việc sang một máy chủ khác có giới hạn kết nối cao hơn',
              'It reduced user-visible latency, which is the only real benefit|||Nó giảm độ trễ người dùng thấy, và đó là lợi ích thật sự duy nhất',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Raising worker concurrency from 1 to 100 took I/O-bound jobs from 5 to 405 jobs/second, but CPU-bound jobs stayed at 16, 17 and 17 jobs/second for concurrency 1, 10 and 50. Why?|||Nâng concurrency của worker từ 1 lên 100 đưa job chờ I/O từ 5 lên 405 job/giây, nhưng job tốn CPU vẫn đứng ở 16, 17 và 17 job/giây với concurrency 1, 10 và 50. Vì sao?',
            options: [
              'BullMQ caps CPU-bound jobs to protect the machine|||BullMQ giới hạn job tốn CPU để bảo vệ máy',
              'concurrency means "how many jobs are IN FLIGHT", and in-flight is not parallel — it is still one event loop. CPU work needs separate processes, a sandboxed processor, or worker_threads|||concurrency nghĩa là "ôm bao nhiêu job CÙNG LÚC", mà ôm cùng lúc không phải chạy song song — vẫn chỉ một event loop. Việc tốn CPU cần tiến trình riêng, sandboxed processor, hoặc worker_threads',
              'The Redis round trip becomes the bottleneck for CPU-bound jobs|||Vòng đi-về tới Redis trở thành nút thắt cổ chai với job tốn CPU',
              'The jobs were too short for concurrency to have any measurable effect|||Các job quá ngắn nên concurrency không tạo ra khác biệt đo được',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A job with attempts: 5 and exponential backoff retried at intervals of 288ms, 417ms, 826ms and 1674ms. Why is exponential preferred over a fixed interval?|||Một job đặt attempts: 5 với backoff luỹ thừa đã thử lại theo các khoảng 288ms, 417ms, 826ms và 1674ms. Vì sao backoff luỹ thừa được ưa dùng hơn khoảng cách cố định?',
            options: [
              'Because it finishes all attempts sooner overall|||Vì nó hoàn tất toàn bộ các lần thử sớm hơn về tổng thể',
              'Because the usual reason a job fails is that something downstream is OVERLOADED — fast fixed retries add load to a service that is already drowning, so the retries become the outage|||Vì lý do thường gặp nhất khiến job hỏng là có thứ ở phía dưới đang QUÁ TẢI — thử lại nhanh và đều đặn là cộng thêm tải cho một dịch vụ sắp chết đuối, khiến chính các lần thử lại trở thành sự cố',
              'Because BullMQ cannot schedule fixed retries reliably|||Vì BullMQ không lập lịch thử lại theo khoảng cố định một cách đáng tin được',
              'Because exponential backoff makes the handler idempotent automatically|||Vì backoff luỹ thừa tự động làm cho hàm xử lý trở nên idempotent',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A payment job that debited the card and then hit a network error was retried with attempts: 3, and the customer was charged 300.000đ instead of 100.000đ. What is the correct conclusion?|||Một job thanh toán trừ tiền thẻ rồi gặp lỗi mạng đã được thử lại với attempts: 3, và khách hàng bị trừ 300.000đ thay vì 100.000đ. Kết luận đúng là gì?',
            options: [
              'Set attempts: 1 for anything involving money|||Hãy đặt attempts: 1 cho mọi thứ dính tới tiền',
              'A queue guarantees AT-LEAST-ONCE delivery, never exactly-once. Exactly-once does not exist; what exists is idempotent handlers — for example a unique constraint on orderId that returns early on P2002|||Hàng đợi bảo đảm giao ÍT NHẤT MỘT LẦN, không bao giờ là đúng một lần. "Đúng một lần" không tồn tại; cái tồn tại là hàm xử lý idempotent — ví dụ một ràng buộc duy nhất trên orderId rồi thoát sớm khi gặp P2002',
              'Wrap the handler in a database transaction so retries roll back|||Bọc hàm xử lý trong một transaction để các lần thử lại được cuộn ngược',
              'Use a distributed lock so only one attempt can run at a time|||Dùng khoá phân tán để mỗi lúc chỉ một lần thử được chạy',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Calling queue.add() five times with the same jobId created only one waiting job, but adding it again later — after the first job had completed and been cleaned up — created a new one. What does this tell you about jobId?|||Gọi queue.add() năm lần với cùng một jobId chỉ tạo ra một job đang chờ, nhưng thêm lại lần nữa sau đó — khi job đầu đã hoàn tất và bị dọn đi — lại tạo ra một job mới. Điều đó nói lên gì về jobId?',
            options: [
              'jobId is broken and should not be relied on at all|||jobId bị lỗi và không nên tin dùng chút nào',
              'jobId deduplicates only against jobs that STILL EXIST in Redis — it is a cheap guard against double-submit in a short window, not a substitute for an idempotent handler. Use both|||jobId chỉ khử trùng lặp so với những job CÒN TỒN TẠI trong Redis — nó là lá chắn rẻ tiền chống bấm hai lần trong khoảng ngắn, không thay thế được hàm xử lý idempotent. Hãy dùng cả hai',
              'jobId only works when removeOnComplete is disabled entirely|||jobId chỉ hoạt động khi tắt hẳn removeOnComplete',
              'The second add succeeded because the jobId contained a hyphen instead of a colon|||Lần thêm thứ hai thành công vì jobId dùng dấu gạch ngang thay vì dấu hai chấm',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Three separate processes each registered the same BullMQ job scheduler, and the job fired 5 times in 1,3 seconds — not 15. Why does this argue against in-process setInterval or node-cron?|||Ba tiến trình riêng biệt cùng đăng ký một job scheduler của BullMQ, và job nổ 5 lần trong 1,3 giây — không phải 15. Vì sao điều đó là lý lẽ chống lại setInterval hay node-cron chạy trong tiến trình?',
            options: [
              'Because BullMQ elects a leader process to own the schedule|||Vì BullMQ bầu ra một tiến trình chủ để sở hữu lịch chạy',
              'Because the schedule is STATE in Redis, not a timer inside a process — whereas setInterval and in-process node-cron are timers per process, so three replicas means the nightly cleanup runs three times|||Vì lịch là TRẠNG THÁI nằm trong Redis, không phải một cái hẹn giờ trong tiến trình — trong khi setInterval và node-cron trong tiến trình là hẹn giờ của TỪNG tiến trình, nên ba bản sao nghĩa là lượt dọn dẹp ban đêm chạy ba lần',
              'Because node-cron does not support timezones, unlike BullMQ|||Vì node-cron không hỗ trợ múi giờ, khác với BullMQ',
              'Because Redis deduplicates identical jobs automatically regardless of scheduler|||Vì Redis tự khử trùng lặp các job giống nhau bất kể bộ lập lịch nào',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A worker was SIGKILLed mid-job. The job sat in "active" with nobody working on it, then a new worker picked it up 2036ms later and completed it. What mechanism did that, and what does it imply?|||Một worker bị SIGKILL giữa lúc đang chạy job. Job nằm ở trạng thái "active" mà không ai làm, rồi một worker mới nhặt lại sau 2036ms và hoàn tất nó. Cơ chế nào làm việc đó, và nó hàm ý điều gì?',
            options: [
              'BullMQ keeps a backup copy of every job and restores it on crash|||BullMQ giữ một bản sao lưu của mọi job và khôi phục khi có sự cố',
              'A per-job distributed lock with a TTL that the worker renews while it runs — when nothing renews it, another worker reclaims the job. This is exactly why handlers must survive running twice|||Một khoá phân tán riêng cho từng job kèm TTL mà worker gia hạn trong lúc chạy — khi không còn ai gia hạn, một worker khác đòi lại job. Đây chính xác là lý do hàm xử lý phải sống sót khi bị chạy hai lần',
              'Redis persistence replayed the job from the AOF log after the crash|||Cơ chế persistence của Redis phát lại job từ nhật ký AOF sau sự cố',
              'The job was never actually started, so it simply stayed in the wait list|||Job thật ra chưa từng bắt đầu nên nó chỉ đơn giản nằm lại trong danh sách chờ',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'With lockDuration 1s, a handler that awaited for 3 seconds completed normally, but a handler that burned 3 seconds in a while loop ran TWICE, emitted 2 stalled events and ended failed with "Missing lock for job 1. moveToFinished". What is the fix?|||Với lockDuration 1 giây, một hàm xử lý await 3 giây hoàn tất bình thường, nhưng một hàm xử lý đốt 3 giây trong vòng lặp while lại chạy HAI lần, phát ra 2 sự kiện stalled và kết thúc ở trạng thái failed kèm lỗi "Missing lock for job 1. moveToFinished". Cách sửa là gì?',
            options: [
              'Increase lockDuration until it exceeds the longest job|||Tăng lockDuration lên cho tới khi nó vượt job dài nhất',
              'Get the CPU work off the event loop — a sandboxed processor, worker_threads, or a separate process. Blocking prevents the lock-renewal timer from running, so the job is declared stalled and re-run|||Đưa việc tốn CPU ra khỏi event loop — sandboxed processor, worker_threads, hoặc một tiến trình riêng. Chặn event loop khiến timer gia hạn khoá không chạy được, nên job bị tuyên là treo và chạy lại',
              'Set attempts: 1 so the job cannot be retried after stalling|||Đặt attempts: 1 để job không thể bị thử lại sau khi treo',
              'Disable the stalled check by setting stalledInterval to 0|||Tắt cơ chế kiểm tra job treo bằng cách đặt stalledInterval bằng 0',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'On SIGTERM, a worker with a shutdown handler exited after 1296ms having finished its job; one without exited after 5ms leaving the job in "active". Since the stalled mechanism eventually rescues it anyway, why does the handler matter?|||Khi nhận SIGTERM, worker có xử lý tắt êm thoát sau 1296ms và đã làm xong job; worker không có thì thoát sau 5ms, để lại job ở trạng thái "active". Vì cơ chế job treo đằng nào cũng cứu nó, vậy việc xử lý tín hiệu quan trọng ở chỗ nào?',
            options: [
              'It does not matter much; the stalled mechanism makes it equivalent|||Không quan trọng lắm; cơ chế job treo khiến hai cách tương đương nhau',
              '"Eventually" is up to lockDuration away (30s by default), during which the work has silently not happened — and then it runs a SECOND time, on every single deploy|||"Rồi sẽ" có thể là tận lockDuration sau đó (mặc định 30 giây), trong suốt quãng ấy công việc đã âm thầm KHÔNG diễn ra — rồi nó chạy thêm LẦN THỨ HAI, và điều đó lặp lại ở mỗi lần deploy',
              'Without a handler the job data is deleted from Redis immediately|||Nếu không xử lý thì dữ liệu job bị xoá khỏi Redis ngay lập tức',
              'The handler is needed only when running more than one worker process|||Việc xử lý tín hiệu chỉ cần khi chạy nhiều hơn một tiến trình worker',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: '3000 completed jobs with no retention setting kept 3000 records and 3,94MB of Redis; with removeOnComplete: 100 they kept 100 records and 0,49MB. Combined with lesson 12.6, what configuration must a queue Redis have?|||3000 job hoàn tất mà không đặt thời hạn lưu giữ lại 3000 bản ghi và 3,94MB Redis; với removeOnComplete: 100 thì chỉ giữ 100 bản ghi và 0,49MB. Kết hợp với bài 12.6, một Redis dùng cho hàng đợi bắt buộc phải cấu hình thế nào?',
            options: [
              'allkeys-lru, so Redis can free space automatically when the queue grows|||allkeys-lru, để Redis tự giải phóng chỗ khi hàng đợi phình ra',
              'noeviction plus explicit removeOnComplete/removeOnFail — eviction would silently delete jobs, and no retention setting fills memory until writes are rejected with OOM|||noeviction cộng với removeOnComplete/removeOnFail đặt tường minh — trục xuất sẽ âm thầm xoá mất job, còn không đặt thời hạn lưu thì bộ nhớ đầy tới lúc mọi lệnh ghi bị từ chối bằng lỗi OOM',
              'volatile-lru, since every job already carries a TTL|||volatile-lru, vì mọi job vốn đã mang sẵn một TTL',
              'Any policy works as long as maxmemory is set high enough|||Chính sách nào cũng được miễn là maxmemory đặt đủ cao',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
    /* END-LESSONS */
  ],
};
