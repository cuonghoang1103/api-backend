/**
 * API Design — Chương 5: Tin cậy — idempotency, thử lại, giới hạn tần suất, đồng thời (soạn chi tiết 01/11/2026).
 * Output CHẠY THẬT: Node v22.23.3, Express 5.3.0, Zod 4.6.7, curl 8.7.1, jq 1.7.1 — mất response giả lập (chaos.js), 50 client sau sự cố, proxy kiểu nginx,
 * ETag/If-Match. Nguồn chuẩn đối chiếu 01/11/2026: draft-ietf-httpapi-idempotency-key-header-08, draft-ietf-httpapi-ratelimit-headers-11, RFC 9110, RFC 6585.
 * Mã cuối chương = lời giải Lab 5 (bài 5.5). Slide: api-05-1 … api-05-4 + api-lab-5; giảng EN/VI ở ./giang/.
 * Tệp được sinh một lần bằng script ngoài repo — từ nay SỬA THẲNG tệp này, giữ luật thoát ký tự (_HOP-DONG.md mục 3).
 * GIỮ slug cũ api-5-1-idempotency, api-5-2-retry, api-5-3-rate-limit, api-5-4-dong-thoi và title chương.
 */

import G051 from './giang/api-05-1.mjs';
import G052 from './giang/api-05-2.mjs';
import G053 from './giang/api-05-3.mjs';
import G054 from './giang/api-05-4.mjs';
import GL5 from './giang/api-lab-5.mjs';

export default {
  title: 'Chapter 5 — Reliability: idempotency, retries, rate limits|||Chương 5 — Tin cậy: idempotency, thử lại, giới hạn tần suất',
  description: 'Mất response và Idempotency-Key (draft-08), client có timeout + lùi dần + jitter đo trên 50 client sau sự cố, xô token với header RateLimit (draft-11) và bẫy trust proxy đo qua proxy thật, khoá lạc quan bằng ETag/If-Match/412; lab báo hỏng tin cậy có rubric, quiz 10 câu.',
  lessons: [
    /* ─────────────────────────── 5.1 ─────────────────────────── */
    {
      title: '5.1 — Idempotency keys for POST: a lost response, measured and fixed|||5.1 — Idempotency key cho POST: mất response, đo rồi sửa',
      slug: 'api-5-1-idempotency',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Giả lập mất response trên LabFlow: thử lại không khoá nhận 409 chống chính mình; Idempotency-Key theo draft-08 với dấu vân tay, phát lại, 422/409/400.',
      content: `${G051}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Idempotency keys for POST</h2>
<p class="lead">An taps “Book” in the lab basement where the Wi-Fi is weak. The spinner turns, the app says “network error”, An taps again. Did the first tap book the room? The app cannot know: the request may have died on the way <em>in</em> — or on the way <em>out</em>, after the server had already done the work. This lesson reproduces exactly that on LabFlow and fixes it with an <code>Idempotency-Key</code>.</p>

<h3>Why only POST needs this</h3>
<p>Lesson 1.2: GET, PUT and DELETE are <strong>idempotent</strong> — sending them twice leaves the server in the same state as sending them once, so a client may simply repeat them. POST creates something new each time; repeating it blindly can book twice, charge twice, report twice. An <strong>idempotency key</strong> makes a POST repeatable: the client invents a unique key for one intention (“book lab 3 on 4 January, 08:00”) and sends it with every attempt; the server does the work once and answers every retry with the same result.</p>
<p>The header is being standardised: <code>draft-ietf-httpapi-idempotency-key-header-08</code> (22 October 2026, an active Internet-Draft, not yet an RFC) defines <code>Idempotency-Key: "8e03978e-40d5-43e8-bc93-6894a57f9324"</code> — a quoted string — and recommends <strong>400</strong> when a required key is missing, <strong>422</strong> when a key is reused with a different payload, and <strong>409</strong> while the first request with that key is still running. Stripe has used the same header for years; its docs keep keys for at least 24 hours.</p>

<h3>The experiment: a lost response</h3>
<p>LabFlow gets a <code>chaos.js</code> for this chapter — switches that are never set in production. <code>LABFLOW_DROP_FIRST=1</code> lets the server finish the first POST and then cut the connection instead of answering: the classic lost response.</p>
<pre><code class="language-javascript">// chaos.js — CHỈ ĐỂ HỌC (Chương 5): giả lập mạng và server hỏng. Production không bao giờ đặt các biến này.
//   LABFLOW_DROP_FIRST=n   ⇒ n response POST đầu tiên bị "mất": server ĐÃ làm xong nhưng cắt kết nối trước khi gửi
//   LABFLOW_SLOW_MS=ms     ⇒ response POST tới muộn ms mili giây (việc đã làm xong); LABFLOW_SLOW_COUNT=n chỉ áp n lần đầu
export function chaos(req, res, next) {
  // … (LABFLOW_OUTAGE_MS: bài 5.2)
  if (req.method !== 'POST') return next();
  if (dropped &lt; Number(process.env.LABFLOW_DROP_FIRST ?? 0)) {
    dropped++;
    res.end = () =&gt; req.socket.destroy();                         // việc đã làm, nhưng client không bao giờ nhận được câu trả lời
  }
  // … (LABFLOW_SLOW_MS: trì hoãn res.json)
  next();
}
// app.js:  app.use(chaos);   ngay sau express.json()</code></pre>
<p>Without a key, An’s two taps:</p>
<pre><code class="language-bash">curl -sS -X POST http://localhost:4000/v2/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_3","period":{"start":"2027-01-04T08:00:00+07:00","end":"2027-01-04T10:00:00+07:00"}}'; echo "curl exit=$?"</code></pre>
<div class="out">curl: (52) Empty reply from server
curl exit=52</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  -H 'Accept-Language: en' \\
  --json '{"labId":"lab_3","period":{"start":"2027-01-04T08:00:00+07:00","end":"2027-01-04T10:00:00+07:00"}}' | jq -c '{status, code, detail, conflictWith}'</code></pre>
<div class="out">{"status":409,"code":"BOOKING_CONFLICT","detail":"The lab already has booking bk_9 in this time slot","conflictWith":"bk_9"}</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/v2/bookings?labId=lab_3' \\
  -H 'Authorization: Bearer tok_an' | jq -c '[.data[] | {id, start: .period.start}]'</code></pre>
<div class="out">[{"id":"bk_9","start":"2027-01-04T01:00:00.000Z"},{"id":"bk_3","start":"2026-11-02T00:00:00.000Z"}]</div>
<p>The first attempt ended in <code>curl: (52) Empty reply from server</code> — and yet <code>bk_9</code> exists. The retry got <strong>409 BOOKING_CONFLICT with bk_9</strong>: An is told the room is taken — by her own booking. Here a business rule happened to catch the duplicate with a misleading message; an endpoint without such a rule (a payment, a message, a report with a new title) would simply do the work twice.</p>

<h3>Build it: one middleware</h3>
<pre><code class="language-javascript">// idempotency.js — bài 5.1: POST lặp lại an toàn bằng header Idempotency-Key
// (draft-ietf-httpapi-idempotency-key-header-08, 22/10/2026: 400 thiếu khoá · 422 khoá dùng lại với body khác · 409 đang xử lý)
import { createHash } from 'node:crypto';
import { HttpError } from './http.js';
import { now } from './deprecation.js';

const TTL_MS = 24 * 3600 * 1000;                                   // giữ kết quả 24 giờ
const store = new Map();   // "usr_1:&lt;khoá&gt;" ⇒ { fp, state: 'running' | 'done', status, body, location, at }

// Khoá là chuỗi structured field ("…"); nhận cả dạng không ngoặc kép mà nhiều client vẫn gửi
const parseKey = (raw) =&gt; /^"?([\\x21\\x23-\\x7e]{1,255}?)"?$/.exec(raw)?.[1];

export const idempotent = ({ required = false } = {}) =&gt; (req, res, next) =&gt; {
  const raw = req.get('Idempotency-Key');
  if (raw === undefined) {
    if (required) throw new HttpError(400, 'IDEMPOTENCY_KEY_MISSING');
    return next();                                                 // không gửi khoá ⇒ hành xử như trước
  }
  const key = parseKey(raw);
  if (!key) throw new HttpError(400, 'IDEMPOTENCY_KEY_INVALID');
  const k = &#96;\${req.user?.id ?? req.ip}:\${key}&#96;;                    // khoá thuộc về MỘT người gọi
  const fp = createHash('sha256').update(&#96;\${req.method} \${req.originalUrl} \${JSON.stringify(req.body ?? null)}&#96;).digest('hex');
  let e = store.get(k);
  if (e &amp;&amp; now() - e.at &gt; TTL_MS) { store.delete(k); e = undefined; }
  if (e) {
    if (e.fp !== fp) throw new HttpError(422, 'IDEMPOTENCY_KEY_REUSED');       // cùng khoá, KHÁC yêu cầu
    if (e.state === 'running') {
      res.set('Retry-After', '1');                                  // "quay lại sau 1 giây" — client biết lúc nào thử tiếp
      throw new HttpError(409, 'IDEMPOTENCY_IN_PROGRESS');
    }
    res.set('Idempotent-Replayed', 'true');                         // lần này không làm gì mới
    if (e.location) res.location(e.location);
    return res.status(e.status).json(e.body);
  }
  store.set(k, { fp, state: 'running', at: now() });
  let result;
  const json = res.json.bind(res);
  res.json = (body) =&gt; { result = { status: res.statusCode, body, location: res.get('Location') }; return json(body); };
  // Chốt khi kết nối ĐÓNG — kể cả khi client đã bỏ đi giữa chừng: việc đã làm thì phải nhớ
  res.once('close', () =&gt; {
    if (result &amp;&amp; result.status &lt; 300) store.set(k, { fp, state: 'done', ...result, at: now() });
    else store.delete(k);                                           // lỗi ⇒ không lưu: lần thử sau được xét lại từ đầu
  });
  next();
};</code></pre>
<p>Four decisions. The key is scoped to the <strong>caller</strong> (<code>usr_1:&lt;key&gt;</code>) so two users can never collide or read each other’s results. The <strong>fingerprint</strong> (method, URL, body) detects a key reused for a different request. The result is recorded when the connection <strong>closes</strong> — also when the client has already gone, because that is exactly the case we must remember. Only successes are replayed; errors are evaluated again on the next attempt. In the route the middleware stands after authentication and before validation:</p>
<pre><code class="language-javascript">  .post(idempotent(), validate('body', { 1: BookingCreate, 2: BookingCreateV2 }), (req, res) =&gt; {   // bài 5.1</code></pre>

<h3>Try it again, with a key</h3>
<pre><code class="language-bash">curl -sS -X POST http://localhost:4000/v2/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  -H 'Idempotency-Key: "8e03978e-40d5-43e8-bc93-6894a57f9324"' \\
  --json '{"labId":"lab_3","period":{"start":"2027-01-04T08:00:00+07:00","end":"2027-01-04T10:00:00+07:00"}}'; echo "curl exit=$?"</code></pre>
<div class="out">curl: (52) Empty reply from server
curl exit=52</div>
<pre><code class="language-bash">curl -si -X POST http://localhost:4000/v2/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  -H 'Idempotency-Key: "8e03978e-40d5-43e8-bc93-6894a57f9324"' \\
  --json '{"labId":"lab_3","period":{"start":"2027-01-04T08:00:00+07:00","end":"2027-01-04T10:00:00+07:00"}}' | grep -E '^(HTTP|Location|Idempotent-Replayed)'</code></pre>
<div class="out">HTTP/1.1 201 Created
Idempotent-Replayed: true
Location: /v2/bookings/bk_9</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  -H 'Idempotency-Key: "8e03978e-40d5-43e8-bc93-6894a57f9324"' \\
  --json '{"labId":"lab_3","period":{"start":"2027-01-04T08:00:00+07:00","end":"2027-01-04T10:00:00+07:00"}}' | jq -c '{id, period}'</code></pre>
<div class="out">{"id":"bk_9","period":{"start":"2027-01-04T01:00:00.000Z","end":"2027-01-04T03:00:00.000Z"}}</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/v2/bookings?labId=lab_3' \\
  -H 'Authorization: Bearer tok_an' | jq -c '[.data[] | {id, start: .period.start}]'</code></pre>
<div class="out">[{"id":"bk_9","start":"2027-01-04T01:00:00.000Z"},{"id":"bk_3","start":"2026-11-02T00:00:00.000Z"}]</div>
<p>The first attempt is lost exactly as before. The retry gets <strong>201</strong> with the same <code>Location</code> and <code>Idempotent-Replayed: true</code> (LabFlow’s signal that nothing new happened); a third retry returns the same <code>bk_9</code>; the list shows one booking.</p>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  -H 'Idempotency-Key: "8e03978e-40d5-43e8-bc93-6894a57f9324"' \\
  -H 'Accept-Language: en' \\
  --json '{"labId":"lab_1","period":{"start":"2027-01-05T08:00:00+07:00","end":"2027-01-05T10:00:00+07:00"}}' | jq -c '{status, code, detail}'</code></pre>
<div class="out">{"status":422,"code":"IDEMPOTENCY_KEY_REUSED","detail":"This key belongs to a request with different content; use a new key"}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  -H 'Idempotency-Key: "xin chào"' \\
  -H 'Accept-Language: en' \\
  --json '{"labId":"lab_3","period":{"start":"2027-01-04T08:00:00+07:00","end":"2027-01-04T10:00:00+07:00"}}' | jq -c '{status, code}'</code></pre>
<div class="out">{"status":400,"code":"IDEMPOTENCY_KEY_INVALID"}</div>
<p>The same key with a different body is a client bug — 422, never a silent replay of the wrong result. A key with a space is refused. And while the first request is still running, a second one with the same key gets 409 plus <code>Retry-After: 1</code> instead of running twice in parallel (the server here delays its answers by 1.5 s):</p>
<pre><code class="language-bash">(curl -s -X POST http://localhost:4000/v2/bookings -H 'Authorization: Bearer tok_bin' -H 'Idempotency-Key: "c1"' --json '{"labId":"lab_2","period":{"start":"2027-01-06T08:00:00+07:00","end":"2027-01-06T10:00:00+07:00"}}' | jq -c '{first: .id}' &amp;); sleep 0.3; curl -s -D - -X POST http://localhost:4000/v2/bookings -H 'Authorization: Bearer tok_bin' -H 'Idempotency-Key: "c1"' -H 'Accept-Language: en' --json '{"labId":"lab_2","period":{"start":"2027-01-06T08:00:00+07:00","end":"2027-01-06T10:00:00+07:00"}}' | grep -E '^(HTTP|Retry-After)|"code"'; sleep 2</code></pre>
<div class="out">{"first":"bk_9"}
HTTP/1.1 409 Conflict
Retry-After: 1
  "code": "IDEMPOTENCY_IN_PROGRESS"</div>

<div class="pitfall"><p><strong>Trap — a new key on every retry.</strong> The key belongs to the <em>intention</em>, not to the HTTP attempt. Generate it when the user taps, keep it until you have an answer.</p></div>
<div class="pitfall"><p><strong>Trap — keys in memory on several servers.</strong> LabFlow’s <code>Map</code> works for one process. With two instances behind a load balancer the retry may hit the other one; real systems keep keys in the database or Redis, with the same 24-hour expiry.</p></div>

<h3>In interviews and at work</h3>
<p><strong>“How do you prevent double charges when clients retry?”</strong> Idempotency keys: client-generated per intention, stored per caller with a request fingerprint and the result, replayed on retry, 422 on mismatch, 409 while in progress, expired after a day.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
  <li>Add <code>chaos.js</code> and <code>idempotent()</code>; reproduce the four runs.</li>
  <li>Put <code>idempotent()</code> on <code>POST /bookings/:id/cancel</code>. Why does cancel need it less than create? Show the answer with two runs.</li>
  <li>Restart the server between the first and second attempt. What happens and why? Write two sentences on where keys must live in production.</li>
</ol>
<p><strong>Done when:</strong> a lost response followed by a retry with the same key creates exactly one booking, and every misuse gets its own clear error.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Idempotency key</span><span class="v">A unique client-chosen key for one intention, sent with every attempt.</span></div>
  <div class="kv"><span class="k">Lost response</span><span class="v">The server did the work but the answer never reached the client.</span></div>
  <div class="kv"><span class="k">Replay</span><span class="v">Answering a retry with the stored result instead of doing the work again.</span></div>
  <div class="kv"><span class="k">Request fingerprint</span><span class="v">A hash of method, URL and body to detect a key reused for another request.</span></div>
  <div class="kv"><span class="k">Internet-Draft</span><span class="v">A document on its way to becoming an RFC; it can still change.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Measured: a lost response plus a retry gave a misleading 409 against the user’s own booking.</li>
  <li>With <code>Idempotency-Key</code>: one booking, the retry replays 201 with <code>Idempotent-Replayed: true</code>.</li>
  <li>Scope keys per caller, fingerprint the request, record on connection close, replay only successes.</li>
  <li>Draft-08 codes: 400 missing, 422 reused with other content, 409 still running.</li>
  <li>One key per intention; store keys where every server instance can see them.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Idempotency key cho POST</h2>
<p class="lead">An bấm “Đặt phòng” dưới tầng hầm phòng lab, nơi Wi-Fi yếu. Vòng xoay quay, app báo “lỗi mạng”, An bấm lại. Lần bấm đầu đã đặt được chưa? App không thể biết: request có thể chết trên đường <em>đi</em> — hoặc trên đường <em>về</em>, sau khi server đã làm xong việc. Bài này tái hiện đúng tình huống đó trên LabFlow và sửa bằng <code>Idempotency-Key</code>.</p>

<h3>Vì sao chỉ POST cần thứ này</h3>
<p>Bài 1.2: GET, PUT và DELETE là <strong>idempotent</strong> (gửi hai lần thì server ở cùng trạng thái như gửi một lần), nên client cứ gửi lại. POST mỗi lần tạo ra cái mới; gửi lại mù quáng có thể đặt hai lần, trừ tiền hai lần, báo hỏng hai lần. <strong>Idempotency key</strong> (khoá lặp-an-toàn) làm POST gửi lại được: client tự tạo một khoá duy nhất cho một ý định (“đặt phòng 3 ngày 4/1, 08:00”) và gửi kèm mọi lần thử; server làm việc một lần và trả cùng một kết quả cho mọi lần thử lại.</p>
<p>Header này đang được chuẩn hoá: <code>draft-ietf-httpapi-idempotency-key-header-08</code> (22/10/2026, bản thảo Internet đang hoạt động, chưa phải RFC) định nghĩa <code>Idempotency-Key: "8e03978e-40d5-43e8-bc93-6894a57f9324"</code> — một chuỗi trong ngoặc kép — và khuyên trả <strong>400</strong> khi thiếu khoá bắt buộc, <strong>422</strong> khi khoá được dùng lại với nội dung khác, <strong>409</strong> khi request đầu với khoá đó còn đang chạy. Stripe dùng đúng header này nhiều năm nay; tài liệu của họ giữ khoá ít nhất 24 giờ.</p>

<h3>Thí nghiệm: response bị mất</h3>
<p>LabFlow có thêm <code>chaos.js</code> cho chương này — các công tắc không bao giờ bật ở production. <code>LABFLOW_DROP_FIRST=1</code> cho server làm xong POST đầu tiên rồi cắt kết nối thay vì trả lời: đúng kiểu mất response kinh điển.</p>
<pre><code class="language-javascript">// chaos.js — CHỈ ĐỂ HỌC (Chương 5): giả lập mạng và server hỏng. Production không bao giờ đặt các biến này.
//   LABFLOW_DROP_FIRST=n   ⇒ n response POST đầu tiên bị "mất": server ĐÃ làm xong nhưng cắt kết nối trước khi gửi
//   LABFLOW_SLOW_MS=ms     ⇒ response POST tới muộn ms mili giây (việc đã làm xong); LABFLOW_SLOW_COUNT=n chỉ áp n lần đầu
export function chaos(req, res, next) {
  // … (LABFLOW_OUTAGE_MS: bài 5.2)
  if (req.method !== 'POST') return next();
  if (dropped &lt; Number(process.env.LABFLOW_DROP_FIRST ?? 0)) {
    dropped++;
    res.end = () =&gt; req.socket.destroy();                         // việc đã làm, nhưng client không bao giờ nhận được câu trả lời
  }
  // … (LABFLOW_SLOW_MS: trì hoãn res.json)
  next();
}
// app.js:  app.use(chaos);   ngay sau express.json()</code></pre>
<p>Không có khoá, hai lần bấm của An:</p>
<pre><code class="language-bash">curl -sS -X POST http://localhost:4000/v2/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_3","period":{"start":"2027-01-04T08:00:00+07:00","end":"2027-01-04T10:00:00+07:00"}}'; echo "curl exit=$?"</code></pre>
<div class="out">curl: (52) Empty reply from server
curl exit=52</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  -H 'Accept-Language: en' \\
  --json '{"labId":"lab_3","period":{"start":"2027-01-04T08:00:00+07:00","end":"2027-01-04T10:00:00+07:00"}}' | jq -c '{status, code, detail, conflictWith}'</code></pre>
<div class="out">{"status":409,"code":"BOOKING_CONFLICT","detail":"The lab already has booking bk_9 in this time slot","conflictWith":"bk_9"}</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/v2/bookings?labId=lab_3' \\
  -H 'Authorization: Bearer tok_an' | jq -c '[.data[] | {id, start: .period.start}]'</code></pre>
<div class="out">[{"id":"bk_9","start":"2027-01-04T01:00:00.000Z"},{"id":"bk_3","start":"2026-11-02T00:00:00.000Z"}]</div>
<p>Lần đầu kết thúc bằng <code>curl: (52) Empty reply from server</code> — vậy mà <code>bk_9</code> đã tồn tại. Lần thử lại nhận <strong>409 BOOKING_CONFLICT với bk_9</strong>: An được báo phòng đã có người đặt — chính là lượt của cô. Ở đây một luật nghiệp vụ tình cờ bắt được bản trùng, với thông báo gây hiểu nhầm; endpoint không có luật như vậy (thanh toán, tin nhắn, báo hỏng với tiêu đề mới) sẽ đơn giản là làm hai lần.</p>

<h3>Dựng: một middleware</h3>
<pre><code class="language-javascript">// idempotency.js — bài 5.1: POST lặp lại an toàn bằng header Idempotency-Key
// (draft-ietf-httpapi-idempotency-key-header-08, 22/10/2026: 400 thiếu khoá · 422 khoá dùng lại với body khác · 409 đang xử lý)
import { createHash } from 'node:crypto';
import { HttpError } from './http.js';
import { now } from './deprecation.js';

const TTL_MS = 24 * 3600 * 1000;                                   // giữ kết quả 24 giờ
const store = new Map();   // "usr_1:&lt;khoá&gt;" ⇒ { fp, state: 'running' | 'done', status, body, location, at }

// Khoá là chuỗi structured field ("…"); nhận cả dạng không ngoặc kép mà nhiều client vẫn gửi
const parseKey = (raw) =&gt; /^"?([\\x21\\x23-\\x7e]{1,255}?)"?$/.exec(raw)?.[1];

export const idempotent = ({ required = false } = {}) =&gt; (req, res, next) =&gt; {
  const raw = req.get('Idempotency-Key');
  if (raw === undefined) {
    if (required) throw new HttpError(400, 'IDEMPOTENCY_KEY_MISSING');
    return next();                                                 // không gửi khoá ⇒ hành xử như trước
  }
  const key = parseKey(raw);
  if (!key) throw new HttpError(400, 'IDEMPOTENCY_KEY_INVALID');
  const k = &#96;\${req.user?.id ?? req.ip}:\${key}&#96;;                    // khoá thuộc về MỘT người gọi
  const fp = createHash('sha256').update(&#96;\${req.method} \${req.originalUrl} \${JSON.stringify(req.body ?? null)}&#96;).digest('hex');
  let e = store.get(k);
  if (e &amp;&amp; now() - e.at &gt; TTL_MS) { store.delete(k); e = undefined; }
  if (e) {
    if (e.fp !== fp) throw new HttpError(422, 'IDEMPOTENCY_KEY_REUSED');       // cùng khoá, KHÁC yêu cầu
    if (e.state === 'running') {
      res.set('Retry-After', '1');                                  // "quay lại sau 1 giây" — client biết lúc nào thử tiếp
      throw new HttpError(409, 'IDEMPOTENCY_IN_PROGRESS');
    }
    res.set('Idempotent-Replayed', 'true');                         // lần này không làm gì mới
    if (e.location) res.location(e.location);
    return res.status(e.status).json(e.body);
  }
  store.set(k, { fp, state: 'running', at: now() });
  let result;
  const json = res.json.bind(res);
  res.json = (body) =&gt; { result = { status: res.statusCode, body, location: res.get('Location') }; return json(body); };
  // Chốt khi kết nối ĐÓNG — kể cả khi client đã bỏ đi giữa chừng: việc đã làm thì phải nhớ
  res.once('close', () =&gt; {
    if (result &amp;&amp; result.status &lt; 300) store.set(k, { fp, state: 'done', ...result, at: now() });
    else store.delete(k);                                           // lỗi ⇒ không lưu: lần thử sau được xét lại từ đầu
  });
  next();
};</code></pre>
<p>Bốn quyết định. Khoá gắn với <strong>người gọi</strong> (<code>usr_1:&lt;khoá&gt;</code>) để hai người không bao giờ va nhau hay đọc được kết quả của nhau. <strong>Dấu vân tay</strong> (phương thức, URL, body) phát hiện khoá bị dùng cho request khác. Kết quả được ghi khi kết nối <strong>đóng</strong> — kể cả khi client đã bỏ đi, vì đó đúng là trường hợp phải nhớ. Chỉ phát lại thành công; lỗi thì lần sau được xét lại. Trong route, middleware đứng sau xác thực và trước kiểm dữ liệu:</p>
<pre><code class="language-javascript">  .post(idempotent(), validate('body', { 1: BookingCreate, 2: BookingCreateV2 }), (req, res) =&gt; {   // bài 5.1</code></pre>

<h3>Thử lại, có khoá</h3>
<pre><code class="language-bash">curl -sS -X POST http://localhost:4000/v2/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  -H 'Idempotency-Key: "8e03978e-40d5-43e8-bc93-6894a57f9324"' \\
  --json '{"labId":"lab_3","period":{"start":"2027-01-04T08:00:00+07:00","end":"2027-01-04T10:00:00+07:00"}}'; echo "curl exit=$?"</code></pre>
<div class="out">curl: (52) Empty reply from server
curl exit=52</div>
<pre><code class="language-bash">curl -si -X POST http://localhost:4000/v2/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  -H 'Idempotency-Key: "8e03978e-40d5-43e8-bc93-6894a57f9324"' \\
  --json '{"labId":"lab_3","period":{"start":"2027-01-04T08:00:00+07:00","end":"2027-01-04T10:00:00+07:00"}}' | grep -E '^(HTTP|Location|Idempotent-Replayed)'</code></pre>
<div class="out">HTTP/1.1 201 Created
Idempotent-Replayed: true
Location: /v2/bookings/bk_9</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  -H 'Idempotency-Key: "8e03978e-40d5-43e8-bc93-6894a57f9324"' \\
  --json '{"labId":"lab_3","period":{"start":"2027-01-04T08:00:00+07:00","end":"2027-01-04T10:00:00+07:00"}}' | jq -c '{id, period}'</code></pre>
<div class="out">{"id":"bk_9","period":{"start":"2027-01-04T01:00:00.000Z","end":"2027-01-04T03:00:00.000Z"}}</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/v2/bookings?labId=lab_3' \\
  -H 'Authorization: Bearer tok_an' | jq -c '[.data[] | {id, start: .period.start}]'</code></pre>
<div class="out">[{"id":"bk_9","start":"2027-01-04T01:00:00.000Z"},{"id":"bk_3","start":"2026-11-02T00:00:00.000Z"}]</div>
<p>Lần đầu mất y như trước. Lần thử lại nhận <strong>201</strong> với cùng <code>Location</code> và <code>Idempotent-Replayed: true</code> (tín hiệu riêng của LabFlow: không có gì mới xảy ra); lần thứ ba trả cùng <code>bk_9</code>; danh sách chỉ có một lượt đặt.</p>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  -H 'Idempotency-Key: "8e03978e-40d5-43e8-bc93-6894a57f9324"' \\
  -H 'Accept-Language: en' \\
  --json '{"labId":"lab_1","period":{"start":"2027-01-05T08:00:00+07:00","end":"2027-01-05T10:00:00+07:00"}}' | jq -c '{status, code, detail}'</code></pre>
<div class="out">{"status":422,"code":"IDEMPOTENCY_KEY_REUSED","detail":"This key belongs to a request with different content; use a new key"}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  -H 'Idempotency-Key: "xin chào"' \\
  -H 'Accept-Language: en' \\
  --json '{"labId":"lab_3","period":{"start":"2027-01-04T08:00:00+07:00","end":"2027-01-04T10:00:00+07:00"}}' | jq -c '{status, code}'</code></pre>
<div class="out">{"status":400,"code":"IDEMPOTENCY_KEY_INVALID"}</div>
<p>Cùng khoá mà khác body là lỗi của client — 422, không bao giờ lặng lẽ phát lại kết quả sai. Khoá có dấu cách bị từ chối. Và khi request đầu còn đang chạy, request thứ hai cùng khoá nhận 409 kèm <code>Retry-After: 1</code> thay vì chạy song song hai lần (server ở đây trả lời chậm 1,5 giây):</p>
<pre><code class="language-bash">(curl -s -X POST http://localhost:4000/v2/bookings -H 'Authorization: Bearer tok_bin' -H 'Idempotency-Key: "c1"' --json '{"labId":"lab_2","period":{"start":"2027-01-06T08:00:00+07:00","end":"2027-01-06T10:00:00+07:00"}}' | jq -c '{first: .id}' &amp;); sleep 0.3; curl -s -D - -X POST http://localhost:4000/v2/bookings -H 'Authorization: Bearer tok_bin' -H 'Idempotency-Key: "c1"' -H 'Accept-Language: en' --json '{"labId":"lab_2","period":{"start":"2027-01-06T08:00:00+07:00","end":"2027-01-06T10:00:00+07:00"}}' | grep -E '^(HTTP|Retry-After)|"code"'; sleep 2</code></pre>
<div class="out">{"first":"bk_9"}
HTTP/1.1 409 Conflict
Retry-After: 1
  "code": "IDEMPOTENCY_IN_PROGRESS"</div>

<div class="pitfall"><p><strong>Bẫy — mỗi lần thử một khoá mới.</strong> Khoá thuộc về <em>ý định</em>, không thuộc về lần gửi HTTP. Tạo nó lúc người dùng bấm, giữ tới khi có câu trả lời.</p></div>
<div class="pitfall"><p><strong>Bẫy — khoá nằm trong RAM của nhiều server.</strong> <code>Map</code> của LabFlow chạy được với một tiến trình. Có hai instance sau load balancer thì lần thử lại có thể rơi vào instance kia; hệ thống thật giữ khoá trong cơ sở dữ liệu hay Redis, cùng hạn 24 giờ.</p></div>

<h3>Khi phỏng vấn và khi đi làm</h3>
<p><strong>“Chống trừ tiền hai lần khi client thử lại thế nào?”</strong> Idempotency key: client tạo theo từng ý định, server lưu theo người gọi kèm dấu vân tay request và kết quả, phát lại khi thử lại, 422 khi lệch, 409 khi đang chạy, hết hạn sau một ngày.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
  <li>Thêm <code>chaos.js</code> và <code>idempotent()</code>; chạy lại bốn lần thử.</li>
  <li>Gắn <code>idempotent()</code> cho <code>POST /bookings/:id/cancel</code>. Vì sao huỷ ít cần nó hơn tạo? Chứng minh bằng hai lần chạy.</li>
  <li>Khởi động lại server giữa lần thử thứ nhất và thứ hai. Chuyện gì xảy ra, vì sao? Viết hai câu về chỗ khoá phải nằm ở production.</li>
</ol>
<p><strong>Xong khi:</strong> mất response rồi thử lại cùng khoá tạo đúng một lượt đặt, và mỗi kiểu dùng sai nhận một lỗi rõ ràng riêng.</p></div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Idempotency key</span><span class="v">Khoá duy nhất do client chọn cho một ý định, gửi kèm mọi lần thử.</span></div>
  <div class="kv"><span class="k">Lost response (mất response)</span><span class="v">Server đã làm xong nhưng câu trả lời không tới được client.</span></div>
  <div class="kv"><span class="k">Replay (phát lại)</span><span class="v">Trả lời lần thử lại bằng kết quả đã lưu thay vì làm lại việc.</span></div>
  <div class="kv"><span class="k">Request fingerprint (dấu vân tay)</span><span class="v">Băm phương thức, URL và body để phát hiện khoá bị dùng cho request khác.</span></div>
  <div class="kv"><span class="k">Internet-Draft</span><span class="v">Tài liệu đang trên đường thành RFC; vẫn có thể thay đổi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Đo được: mất response rồi thử lại cho một lỗi 409 gây hiểu nhầm, chống lại chính lượt đặt của người dùng.</li>
  <li>Có <code>Idempotency-Key</code>: một lượt đặt, lần thử lại phát lại 201 kèm <code>Idempotent-Replayed: true</code>.</li>
  <li>Khoá theo người gọi, băm dấu vân tay request, ghi khi kết nối đóng, chỉ phát lại thành công.</li>
  <li>Mã theo draft-08: 400 thiếu khoá, 422 dùng lại với nội dung khác, 409 còn đang chạy.</li>
  <li>Mỗi ý định một khoá; lưu khoá ở nơi mọi instance server đều thấy.</li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── 5.2 ─────────────────────────── */
    {
      title: '5.2 — Retries, backoff and timeouts: one client function, 50 clients measured|||5.2 — Thử lại, lùi dần và timeout: một hàm client, đo 50 client',
      slug: 'api-5-2-retry',
      type: 'LESSON',
      isFreePreview: true,
      description: 'fetchWithRetry có timeout, chỉ thử lại lỗi tạm thời, lùi dần + full jitter, tôn trọng Retry-After; đo cố định / lùi dần / jitter với 50 client sau sự cố.',
      content: `${G052}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Retries, backoff and timeouts</h2>
<p class="lead">5.1 made retrying a POST safe. This lesson decides <em>when</em> and <em>how often</em> to retry. Retrying badly is not harmless: fifty apps that all retry every half second after an outage can keep a recovering server down. We write one client function — timeout, exponential backoff, jitter, <code>Retry-After</code> — and measure three retry policies against a LabFlow that has just come back from an outage.</p>

<h3>Three rules before any code</h3>
<ol>
  <li><strong>Every call has a timeout.</strong> Without one, a hung connection hangs your app; <code>fetch</code> has no default timeout, so pass <code>AbortSignal.timeout(ms)</code>.</li>
  <li><strong>Retry only what can succeed later and is safe to repeat.</strong> Network errors, timeouts, 408, 429, 500, 502, 503, 504 — yes. 400, 401, 403, 404, 409, 422 — no: the same request will fail the same way. And a POST only with an <code>Idempotency-Key</code>.</li>
  <li><strong>Wait longer each time, and not in step with everybody else.</strong> Exponential backoff (200, 400, 800 ms…) with a cap, plus random <strong>jitter</strong>; and if the server sends <code>Retry-After</code>, wait at least that long.</li>
</ol>

<h3>The client function</h3>
<pre><code class="language-javascript">// retry.mjs — bài 5.2: fetch có timeout, thử lại lùi dần + jitter, tôn trọng Retry-After
const RETRYABLE = [408, 429, 500, 502, 503, 504];
const SAFE = ['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS'];          // idempotent theo định nghĩa (bài 1.2)

export async function fetchWithRetry(url, init = {}, opt = {}) {
  const { retries = 5, baseMs = 200, capMs = 5000, timeoutMs = 2000, jitter = true, log = () =&gt; {} } = opt;
  const method = (init.method ?? 'GET').toUpperCase();
  // POST chỉ được thử lại khi có Idempotency-Key (bài 5.1) — không thì có thể làm hai lần
  const mayRetry = SAFE.includes(method) || new Headers(init.headers).has('Idempotency-Key');
  for (let attempt = 1; ; attempt++) {
    const t0 = Date.now();
    let res, err;
    try { res = await fetch(url, { ...init, signal: AbortSignal.timeout(timeoutMs) }); } catch (e) { err = e; }
    const ra = res?.headers.get('retry-after');
    const again = err || RETRYABLE.includes(res.status) || (res.status === 409 &amp;&amp; ra);   // 409 + Retry-After: "đang làm, quay lại sau"
    log(&#96;#\${attempt} \${err ? err.name : res.status} sau \${Date.now() - t0} ms\${ra ? &#96; (Retry-After: \${ra})&#96; : ''}&#96;);
    if (!again || !mayRetry || attempt &gt; retries) { if (err) throw err; return res; }
    const exp = Math.min(capMs, baseMs * 2 ** (attempt - 1));    // 200, 400, 800, 1600 … tối đa capMs
    let wait = jitter ? Math.round(Math.random() * exp) : exp;    // "full jitter": ngẫu nhiên trong [0, exp]
    if (ra) wait = Math.max(wait, /^\\d+$/.test(ra) ? Number(ra) * 1000 : Date.parse(ra) - Date.now());
    log(&#96;   chờ \${wait} ms&#96;);
    await new Promise((r) =&gt; setTimeout(r, wait));
  }
}</code></pre>
<p>“Full jitter” — wait a random time between 0 and the exponential value — is the variant measured in Marc Brooker’s AWS Architecture Blog article <em>Exponential Backoff And Jitter</em> (4 March 2015). A 409 that carries <code>Retry-After</code> is also retried: that is exactly what LabFlow’s idempotency layer sends while the first request is still running (5.1).</p>

<h3>Timeout plus the same key</h3>
<p>The server answers the first POST 3 seconds late (<code>LABFLOW_SLOW_MS=3000 LABFLOW_SLOW_COUNT=1</code>); the client gives up after 2 seconds:</p>
<pre><code class="language-javascript">// book-retry.mjs — đặt phòng qua mạng chập chờn: timeout 2 s, thử lại cùng MỘT Idempotency-Key
import { randomUUID } from 'node:crypto';
import { fetchWithRetry } from './retry.mjs';

const key = randomUUID();                                          // sinh MỘT lần cho một ý định "đặt phòng"
const res = await fetchWithRetry('http://localhost:4000/v2/bookings', {
  method: 'POST',
  headers: { Authorization: 'Bearer tok_an', 'Content-Type': 'application/json', 'Idempotency-Key': &#96;"\${key}"&#96; },
  body: JSON.stringify({ labId: 'lab_3', period: { start: '2027-01-04T08:00:00+07:00', end: '2027-01-04T10:00:00+07:00' } }),
}, { timeoutMs: 2000, log: console.log });
const body = await res.json();
console.log(&#96;kết quả: \${res.status} \${body.id ?? body.code}\${res.headers.get('idempotent-replayed') ? ' (Idempotent-Replayed)' : ''}&#96;);</code></pre>
<pre><code class="language-bash">node book-retry.mjs</code></pre>
<div class="out">#1 TimeoutError sau 2009 ms
   chờ 55 ms
#2 201 sau 10 ms
kết quả: 201 bk_9 (Idempotent-Replayed)</div>
<p>The booking was made during the first attempt; the retry 55 ms later got it back as a replay. Now the same client <em>without</em> a key:</p>
<pre><code class="language-bash">node book-nokey.mjs</code></pre>
<div class="out">#1 TimeoutError sau 2004 ms
node:internal/deps/undici/undici:15270
      Error.captureStackTrace(err);
            ^

DOMException [TimeoutError]: The operation was aborted due to timeout

Node.js v22.23.3</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/v2/bookings?labId=lab_3' \\
  -H 'Authorization: Bearer tok_an' | jq -c '[.data[].id]'</code></pre>
<div class="out">["bk_9","bk_3"]</div>
<p><code>fetchWithRetry</code> refuses to repeat a POST without a key and throws the timeout — and the list shows that <code>bk_9</code> was created anyway. The app must now tell the user “we are not sure”; with a key it could simply have retried.</p>

<h3>Measured: fifty clients after an outage</h3>
<p><code>LABFLOW_OUTAGE_MS=1000</code>: for one second after the first request <code>GET /v2/labs</code> answers 503, and afterwards the server can serve only 10 requests per 100 ms (more ⇒ 503 “overloaded”). <code>herd.mjs</code> starts 50 clients at once, each retrying with one policy; <code>/chaos/arrivals</code> counts what the server saw per 100 ms:</p>
<pre><code class="language-javascript">// herd.mjs — 50 client cùng gặp sự cố một lúc; mỗi client thử lại theo một chính sách. POLICY=fixed|expo|jitter
import { fetchWithRetry } from './retry.mjs';

const POLICY = process.env.POLICY ?? 'jitter';
const opt = {
  fixed: { baseMs: 500, capMs: 500, jitter: false },              // cứ 500 ms thử lại một lần, ai cũng như ai
  expo: { baseMs: 200, capMs: 5000, jitter: false },              // 200, 400, 800 … nhưng mọi client vẫn đồng bộ
  jitter: { baseMs: 200, capMs: 5000, jitter: true },             // lùi dần + ngẫu nhiên: các client tản ra
}[POLICY];
const t0 = Date.now();
const results = await Promise.all(Array.from({ length: 50 }, () =&gt;
  fetchWithRetry('http://localhost:4000/v2/labs', {}, { ...opt, retries: 10 }).then((r) =&gt; r.status)));
console.log(&#96;\${POLICY}: \${results.filter((s) =&gt; s === 200).length}/50 thành công sau \${Date.now() - t0} ms&#96;);
const a = await (await fetch('http://localhost:4000/chaos/arrivals')).json();
console.log(&#96;server nhận \${a.total} request (\${a.failed} lần 503), đỉnh \${a.peakPer100ms} request/100 ms&#96;);
console.log(&#96;mỗi 100 ms: \${a.per100ms.join(' ')}&#96;);</code></pre>
<pre><code class="language-bash">POLICY=fixed node herd.mjs</code></pre>
<div class="out">fixed: 50/50 thành công sau 3075 ms
server nhận 250 request (200 lần 503), đỉnh 50 request/100 ms
mỗi 100 ms: 50 0 0 0 0 50 0 0 0 0 50 0 0 0 0 40 0 0 0 0 30 0 0 0 0 20 0 0 0 0 10</div>
<pre><code class="language-bash">POLICY=expo node herd.mjs</code></pre>
<div class="out">expo: 50/50 thành công sau 16284 ms
server nhận 300 request (250 lần 503), đỉnh 50 request/100 ms
mỗi 100 ms: 50 0 50 0 0 0 50 0 0 0 0 0 0 0 50 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 40 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 30 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 20 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 10</div>
<pre><code class="language-bash">POLICY=jitter node herd.mjs</code></pre>
<div class="out">jitter: 50/50 thành công sau 3959 ms
server nhận 247 request (197 lần 503), đỉnh 75 request/100 ms
mỗi 100 ms: 75 34 18 13 14 10 9 8 8 8 7 6 4 3 2 1 4 7 2 5 1 1 0 1 2 0 0 0 1 0 1 0 0 1 0 0 0 0 0 1</div>
<table>
  <thead><tr><th>Policy</th><th>Done after</th><th>Requests</th><th>Load shape</th></tr></thead>
  <tbody>
    <tr><td>fixed 500 ms</td><td>3 075 ms</td><td>250</td><td>bursts of 50 every 500 ms, never backs off</td></tr>
    <tr><td>exponential, no jitter</td><td><strong>16 284 ms</strong></td><td>300</td><td>bursts of 50 that stay together, gaps double</td></tr>
    <tr><td>exponential + full jitter</td><td>3 959 ms</td><td>247</td><td>after the first burst: 34, 18, 13 … spread out</td></tr>
  </tbody>
</table>
<p>Read it carefully. Backoff <em>without</em> jitter is the worst: the clients stay synchronised, so every wave still hits the capacity limit, only now with longer gaps — 16 seconds. Fixed retries finish quickly here but hammer the server in identical bursts and would keep doing so during a long outage. Jitter spreads the load (no burst above 34 after the first) and still finishes in about 4 seconds, with the fewest requests. The first burst of 75 is the 50 initial calls plus early retries — nothing can spread a crowd that arrives together.</p>

<div class="pitfall"><p><strong>Trap — retries in several layers.</strong> The app retries 3 times, its HTTP library 3 times, the gateway 3 times: one tap becomes 27 requests. Retry in one layer only.</p></div>
<div class="pitfall"><p><strong>Trap — a timeout longer than the user’s patience.</strong> Nobody waits 30 s for a booking screen. Set timeouts from what the user can bear and what the server normally needs (here 2 s).</p></div>

<h3>In interviews and at work</h3>
<p><strong>“How do you retry calls to another service?”</strong> Timeout on every call; retry only transient errors and only idempotent operations (or POST with an idempotency key); exponential backoff with a cap and jitter; honour Retry-After; limit the number of attempts; retry in one layer.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
  <li>Reproduce the three herd runs; add a fourth policy “equal jitter” (half fixed, half random) and compare.</li>
  <li>Make <code>LABFLOW_OUTAGE_MS</code> send <code>Retry-After: 1</code>. What happens to the jitter run when every client honours it exactly? Fix it.</li>
  <li>Give <code>fetchWithRetry</code> a total time budget (e.g. 10 s) across all attempts.</li>
</ol>
<p><strong>Done when:</strong> your client never retries a 4xx or a POST without a key, and your measurements show the effect of jitter.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Timeout</span><span class="v">The longest a client waits for one attempt before giving up.</span></div>
  <div class="kv"><span class="k">Exponential backoff</span><span class="v">Waiting base × 2<sup>n</sup> before attempt n+1, up to a cap.</span></div>
  <div class="kv"><span class="k">Jitter</span><span class="v">Randomness in the wait so that clients do not retry in step.</span></div>
  <div class="kv"><span class="k">Thundering herd</span><span class="v">Many clients hitting a server at the same moment, e.g. right after an outage.</span></div>
  <div class="kv"><span class="k">Transient error</span><span class="v">A failure likely to disappear on its own: network errors, 429, 503…</span></div>
  <div class="kv"><span class="k">Retry-After</span><span class="v">Response header: seconds (or a date) to wait before retrying.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Every call gets a timeout; retry only transient errors and safe operations (POST only with a key).</li>
  <li>Measured with 50 clients: fixed 3.1 s in bursts of 50, backoff without jitter 16.3 s, backoff with jitter 4.0 s and spread out.</li>
  <li>Jitter is what breaks the synchronisation; backoff alone is not enough.</li>
  <li>Honour Retry-After, cap the attempts, retry in one layer only.</li>
  <li>A POST that timed out without a key may already have happened — the server created bk_9.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Thử lại, lùi dần và timeout</h2>
<p class="lead">Bài 5.1 làm cho việc gửi lại POST trở nên an toàn. Bài này quyết định <em>khi nào</em> và <em>bao lâu một lần</em> thì thử lại. Thử lại tệ không vô hại: năm mươi app cùng thử lại mỗi nửa giây sau một sự cố có thể đè chết server vừa gượng dậy. Ta viết một hàm client — timeout, lùi dần theo cấp số nhân, jitter, <code>Retry-After</code> — và đo ba chính sách thử lại trên một LabFlow vừa qua sự cố.</p>

<h3>Ba luật trước khi viết code</h3>
<ol>
  <li><strong>Lời gọi nào cũng có timeout</strong> (thời gian chờ tối đa). Không có thì một kết nối treo làm treo cả app; <code>fetch</code> không có timeout mặc định, nên phải truyền <code>AbortSignal.timeout(ms)</code>.</li>
  <li><strong>Chỉ thử lại thứ có thể thành công về sau và an toàn khi lặp lại.</strong> Lỗi mạng, hết giờ, 408, 429, 500, 502, 503, 504 — có. 400, 401, 403, 404, 409, 422 — không: gửi lại y hệt thì hỏng y hệt. Còn POST thì chỉ khi có <code>Idempotency-Key</code>.</li>
  <li><strong>Mỗi lần chờ lâu hơn, và không cùng nhịp với người khác.</strong> Lùi dần theo cấp số nhân (200, 400, 800 ms…) có trần, cộng <strong>jitter</strong> ngẫu nhiên; nếu server gửi <code>Retry-After</code> thì chờ ít nhất chừng đó.</li>
</ol>

<h3>Hàm client</h3>
<pre><code class="language-javascript">// retry.mjs — bài 5.2: fetch có timeout, thử lại lùi dần + jitter, tôn trọng Retry-After
const RETRYABLE = [408, 429, 500, 502, 503, 504];
const SAFE = ['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS'];          // idempotent theo định nghĩa (bài 1.2)

export async function fetchWithRetry(url, init = {}, opt = {}) {
  const { retries = 5, baseMs = 200, capMs = 5000, timeoutMs = 2000, jitter = true, log = () =&gt; {} } = opt;
  const method = (init.method ?? 'GET').toUpperCase();
  // POST chỉ được thử lại khi có Idempotency-Key (bài 5.1) — không thì có thể làm hai lần
  const mayRetry = SAFE.includes(method) || new Headers(init.headers).has('Idempotency-Key');
  for (let attempt = 1; ; attempt++) {
    const t0 = Date.now();
    let res, err;
    try { res = await fetch(url, { ...init, signal: AbortSignal.timeout(timeoutMs) }); } catch (e) { err = e; }
    const ra = res?.headers.get('retry-after');
    const again = err || RETRYABLE.includes(res.status) || (res.status === 409 &amp;&amp; ra);   // 409 + Retry-After: "đang làm, quay lại sau"
    log(&#96;#\${attempt} \${err ? err.name : res.status} sau \${Date.now() - t0} ms\${ra ? &#96; (Retry-After: \${ra})&#96; : ''}&#96;);
    if (!again || !mayRetry || attempt &gt; retries) { if (err) throw err; return res; }
    const exp = Math.min(capMs, baseMs * 2 ** (attempt - 1));    // 200, 400, 800, 1600 … tối đa capMs
    let wait = jitter ? Math.round(Math.random() * exp) : exp;    // "full jitter": ngẫu nhiên trong [0, exp]
    if (ra) wait = Math.max(wait, /^\\d+$/.test(ra) ? Number(ra) * 1000 : Date.parse(ra) - Date.now());
    log(&#96;   chờ \${wait} ms&#96;);
    await new Promise((r) =&gt; setTimeout(r, wait));
  }
}</code></pre>
<p>“Full jitter” — chờ một khoảng ngẫu nhiên từ 0 tới giá trị cấp số nhân — là biến thể được đo trong bài <em>Exponential Backoff And Jitter</em> của Marc Brooker trên AWS Architecture Blog (4/3/2015). Lỗi 409 có kèm <code>Retry-After</code> cũng được thử lại: đó chính là thứ lớp idempotency của LabFlow gửi khi request đầu còn đang chạy (5.1).</p>

<h3>Timeout cộng cùng một khoá</h3>
<p>Server trả lời POST đầu chậm 3 giây (<code>LABFLOW_SLOW_MS=3000 LABFLOW_SLOW_COUNT=1</code>); client bỏ cuộc sau 2 giây:</p>
<pre><code class="language-javascript">// book-retry.mjs — đặt phòng qua mạng chập chờn: timeout 2 s, thử lại cùng MỘT Idempotency-Key
import { randomUUID } from 'node:crypto';
import { fetchWithRetry } from './retry.mjs';

const key = randomUUID();                                          // sinh MỘT lần cho một ý định "đặt phòng"
const res = await fetchWithRetry('http://localhost:4000/v2/bookings', {
  method: 'POST',
  headers: { Authorization: 'Bearer tok_an', 'Content-Type': 'application/json', 'Idempotency-Key': &#96;"\${key}"&#96; },
  body: JSON.stringify({ labId: 'lab_3', period: { start: '2027-01-04T08:00:00+07:00', end: '2027-01-04T10:00:00+07:00' } }),
}, { timeoutMs: 2000, log: console.log });
const body = await res.json();
console.log(&#96;kết quả: \${res.status} \${body.id ?? body.code}\${res.headers.get('idempotent-replayed') ? ' (Idempotent-Replayed)' : ''}&#96;);</code></pre>
<pre><code class="language-bash">node book-retry.mjs</code></pre>
<div class="out">#1 TimeoutError sau 2009 ms
   chờ 55 ms
#2 201 sau 10 ms
kết quả: 201 bk_9 (Idempotent-Replayed)</div>
<p>Lượt đặt đã được tạo trong lần thử đầu; lần thử lại 55 ms sau nhận lại nó dưới dạng phát lại. Giờ cũng client đó nhưng <em>không</em> có khoá:</p>
<pre><code class="language-bash">node book-nokey.mjs</code></pre>
<div class="out">#1 TimeoutError sau 2004 ms
node:internal/deps/undici/undici:15270
      Error.captureStackTrace(err);
            ^

DOMException [TimeoutError]: The operation was aborted due to timeout

Node.js v22.23.3</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/v2/bookings?labId=lab_3' \\
  -H 'Authorization: Bearer tok_an' | jq -c '[.data[].id]'</code></pre>
<div class="out">["bk_9","bk_3"]</div>
<p><code>fetchWithRetry</code> từ chối gửi lại POST không có khoá và ném lỗi hết giờ — còn danh sách cho thấy <code>bk_9</code> vẫn được tạo. App giờ phải nói với người dùng “chúng tôi không chắc”; có khoá thì nó cứ việc thử lại.</p>

<h3>Đo: năm mươi client sau một sự cố</h3>
<p><code>LABFLOW_OUTAGE_MS=1000</code>: trong một giây kể từ request đầu, <code>GET /v2/labs</code> trả 503, sau đó server chỉ phục vụ được 10 request mỗi 100 ms (nhiều hơn ⇒ 503 “quá tải”). <code>herd.mjs</code> khởi động 50 client cùng lúc, mỗi client thử lại theo một chính sách; <code>/chaos/arrivals</code> đếm server thấy bao nhiêu mỗi 100 ms:</p>
<pre><code class="language-javascript">// herd.mjs — 50 client cùng gặp sự cố một lúc; mỗi client thử lại theo một chính sách. POLICY=fixed|expo|jitter
import { fetchWithRetry } from './retry.mjs';

const POLICY = process.env.POLICY ?? 'jitter';
const opt = {
  fixed: { baseMs: 500, capMs: 500, jitter: false },              // cứ 500 ms thử lại một lần, ai cũng như ai
  expo: { baseMs: 200, capMs: 5000, jitter: false },              // 200, 400, 800 … nhưng mọi client vẫn đồng bộ
  jitter: { baseMs: 200, capMs: 5000, jitter: true },             // lùi dần + ngẫu nhiên: các client tản ra
}[POLICY];
const t0 = Date.now();
const results = await Promise.all(Array.from({ length: 50 }, () =&gt;
  fetchWithRetry('http://localhost:4000/v2/labs', {}, { ...opt, retries: 10 }).then((r) =&gt; r.status)));
console.log(&#96;\${POLICY}: \${results.filter((s) =&gt; s === 200).length}/50 thành công sau \${Date.now() - t0} ms&#96;);
const a = await (await fetch('http://localhost:4000/chaos/arrivals')).json();
console.log(&#96;server nhận \${a.total} request (\${a.failed} lần 503), đỉnh \${a.peakPer100ms} request/100 ms&#96;);
console.log(&#96;mỗi 100 ms: \${a.per100ms.join(' ')}&#96;);</code></pre>
<pre><code class="language-bash">POLICY=fixed node herd.mjs</code></pre>
<div class="out">fixed: 50/50 thành công sau 3075 ms
server nhận 250 request (200 lần 503), đỉnh 50 request/100 ms
mỗi 100 ms: 50 0 0 0 0 50 0 0 0 0 50 0 0 0 0 40 0 0 0 0 30 0 0 0 0 20 0 0 0 0 10</div>
<pre><code class="language-bash">POLICY=expo node herd.mjs</code></pre>
<div class="out">expo: 50/50 thành công sau 16284 ms
server nhận 300 request (250 lần 503), đỉnh 50 request/100 ms
mỗi 100 ms: 50 0 50 0 0 0 50 0 0 0 0 0 0 0 50 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 40 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 30 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 20 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 10</div>
<pre><code class="language-bash">POLICY=jitter node herd.mjs</code></pre>
<div class="out">jitter: 50/50 thành công sau 3959 ms
server nhận 247 request (197 lần 503), đỉnh 75 request/100 ms
mỗi 100 ms: 75 34 18 13 14 10 9 8 8 8 7 6 4 3 2 1 4 7 2 5 1 1 0 1 2 0 0 0 1 0 1 0 0 1 0 0 0 0 0 1</div>
<table>
  <thead><tr><th>Chính sách</th><th>Xong sau</th><th>Số request</th><th>Hình dạng tải</th></tr></thead>
  <tbody>
    <tr><td>cố định 500 ms</td><td>3 075 ms</td><td>250</td><td>từng đợt 50 mỗi 500 ms, không bao giờ lùi</td></tr>
    <tr><td>cấp số nhân, không jitter</td><td><strong>16 284 ms</strong></td><td>300</td><td>đợt 50 vẫn dính nhau, khoảng trống gấp đôi dần</td></tr>
    <tr><td>cấp số nhân + full jitter</td><td>3 959 ms</td><td>247</td><td>sau đợt đầu: 34, 18, 13 … tản ra</td></tr>
  </tbody>
</table>
<p>Đọc kỹ. Lùi dần mà <em>không</em> jitter là tệ nhất: các client vẫn đồng bộ, nên đợt nào cũng đụng trần năng lực, chỉ là cách nhau lâu hơn — 16 giây. Thử lại cố định xong nhanh ở đây nhưng nện server bằng những đợt giống hệt nhau, và sẽ nện mãi nếu sự cố kéo dài. Jitter rải tải ra (sau đợt đầu không đợt nào quá 34) mà vẫn xong khoảng 4 giây, với ít request nhất. Đợt đầu 75 là 50 lời gọi ban đầu cộng vài lần thử lại sớm — không gì rải được một đám đông tới cùng lúc.</p>

<div class="pitfall"><p><strong>Bẫy — thử lại ở nhiều tầng.</strong> App thử 3 lần, thư viện HTTP thử 3 lần, gateway thử 3 lần: một lần bấm thành 27 request. Chỉ thử lại ở một tầng.</p></div>
<div class="pitfall"><p><strong>Bẫy — timeout dài hơn sự kiên nhẫn của người dùng.</strong> Không ai chờ 30 giây cho màn hình đặt phòng. Đặt timeout theo mức người dùng chịu được và mức server thường cần (ở đây 2 giây).</p></div>

<h3>Khi phỏng vấn và khi đi làm</h3>
<p><strong>“Thử lại lời gọi sang dịch vụ khác thế nào?”</strong> Timeout cho mọi lời gọi; chỉ thử lại lỗi tạm thời và thao tác idempotent (hoặc POST có idempotency key); lùi dần theo cấp số nhân có trần và jitter; tôn trọng Retry-After; giới hạn số lần; chỉ thử lại ở một tầng.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
  <li>Chạy lại ba lần đo; thêm chính sách thứ tư “equal jitter” (nửa cố định, nửa ngẫu nhiên) rồi so sánh.</li>
  <li>Cho <code>LABFLOW_OUTAGE_MS</code> gửi <code>Retry-After: 1</code>. Lần chạy jitter ra sao khi mọi client tôn trọng nó y hệt? Sửa lại.</li>
  <li>Cho <code>fetchWithRetry</code> một ngân sách thời gian tổng (ví dụ 10 giây) cho mọi lần thử.</li>
</ol>
<p><strong>Xong khi:</strong> client của bạn không bao giờ thử lại lỗi 4xx hay POST không có khoá, và số đo của bạn cho thấy tác dụng của jitter.</p></div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Timeout</span><span class="v">Thời gian lâu nhất client chờ một lần thử rồi bỏ cuộc.</span></div>
  <div class="kv"><span class="k">Exponential backoff (lùi dần cấp số nhân)</span><span class="v">Chờ base × 2<sup>n</sup> trước lần thử n+1, tới một mức trần.</span></div>
  <div class="kv"><span class="k">Jitter</span><span class="v">Độ ngẫu nhiên trong thời gian chờ để các client không thử lại cùng nhịp.</span></div>
  <div class="kv"><span class="k">Thundering herd (bầy đàn)</span><span class="v">Rất nhiều client cùng dồn vào server một lúc, ví dụ ngay sau sự cố.</span></div>
  <div class="kv"><span class="k">Transient error (lỗi tạm thời)</span><span class="v">Lỗi có khả năng tự hết: lỗi mạng, 429, 503…</span></div>
  <div class="kv"><span class="k">Retry-After</span><span class="v">Header response: số giây (hoặc một mốc ngày) cần chờ trước khi thử lại.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Lời gọi nào cũng có timeout; chỉ thử lại lỗi tạm thời và thao tác an toàn (POST chỉ khi có khoá).</li>
  <li>Đo với 50 client: cố định 3,1 s theo từng đợt 50, lùi dần không jitter 16,3 s, lùi dần có jitter 4,0 s và tản đều.</li>
  <li>Jitter mới là thứ phá vỡ sự đồng bộ; chỉ lùi dần là chưa đủ.</li>
  <li>Tôn trọng Retry-After, giới hạn số lần thử, chỉ thử lại ở một tầng.</li>
  <li>POST hết giờ mà không có khoá có thể đã xảy ra rồi — server đã tạo bk_9.</li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── 5.3 ─────────────────────────── */
    {
      title: '5.3 — Rate limiting and quotas: token bucket, RateLimit headers, the proxy trap|||5.3 — Giới hạn tần suất và hạn mức: xô token, header RateLimit, bẫy proxy',
      slug: 'api-5-3-rate-limit',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Xô token theo người dùng và theo IP, RateLimit-Policy/RateLimit (draft-11), 429 + Retry-After; đo trust proxy false/true/1 qua một proxy kiểu nginx.',
      content: `${G053}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>Rate limiting and quotas</h2>
<p class="lead">5.2 taught clients to back off politely. Not every client is polite: a buggy script books in a loop, a scraper reads every lab every second, someone guesses passwords. A <strong>rate limit</strong> is the server deciding how much each caller may do per unit of time, and saying so in headers. This lesson builds a token bucket, adds the standard-track <code>RateLimit</code> headers and 429, and then finds the bug that breaks most rate limiters in production: running behind a reverse proxy.</p>

<h3>The token bucket</h3>
<p>Picture a bucket that holds <em>capacity</em> tokens and is refilled at a steady rate. Each request takes one token; an empty bucket means “wait”. LabFlow: 5 bookings per user per 60 seconds — a refill of one token every 12 seconds, with bursts of up to 5 allowed. Compared with a fixed window (“5 per calendar minute”), a bucket has no edge where 10 requests fit into two seconds across a minute boundary.</p>
<pre><code class="language-javascript">// rateLimit.js — bài 5.3: giới hạn tần suất bằng "xô token" (token bucket)
// Header theo draft-ietf-httpapi-ratelimit-headers-11 (23/05/2026): RateLimit-Policy (q, w) + RateLimit (r, t); hết lượt ⇒ 429 + Retry-After
import { HttpError } from './http.js';
import { now } from './deprecation.js';

export function rateLimit({ name, capacity, windowSec, key }) {
  const buckets = new Map();                                       // khoá ⇒ { tokens, at }
  const perSec = capacity / windowSec;                             // tốc độ rót lại token
  return (req, res, next) =&gt; {
    const k = key(req);
    const t = now() / 1000;
    const b = buckets.get(k) ?? { tokens: capacity, at: t };
    b.tokens = Math.min(capacity, b.tokens + (t - b.at) * perSec);   // rót thêm phần đã "chảy" từ lần trước
    b.at = t;
    buckets.set(k, b);
    res.set('RateLimit-Policy', &#96;"\${name}";q=\${capacity};w=\${windowSec}&#96;);
    if (b.tokens &lt; 1) {                                            // hết token ⇒ chờ tới khi có lại MỘT token
      const wait = Math.ceil((1 - b.tokens) / perSec);
      res.set('RateLimit', &#96;"\${name}";r=0;t=\${wait}&#96;).set('Retry-After', String(wait));
      throw new HttpError(429, 'RATE_LIMITED', { wait });
    }
    b.tokens -= 1;
    res.set('RateLimit', &#96;"\${name}";r=\${Math.floor(b.tokens)};t=\${Math.ceil((capacity - b.tokens) / perSec)}&#96;);
    next();
  };
}

// Hai giới hạn của LabFlow: đặt phòng theo NGƯỜI DÙNG, đọc công khai theo ĐỊA CHỈ IP
export const bookingLimit = rateLimit({ name: 'booking', capacity: 5, windowSec: 60, key: (req) =&gt; req.user.id });
const [q, w] = (process.env.LABFLOW_IP_LIMIT ?? '100/60').split('/').map(Number);
export const ipLimit = rateLimit({ name: 'ip', capacity: q, windowSec: w, key: (req) =&gt; req.ip });</code></pre>
<p>The headers follow <code>draft-ietf-httpapi-ratelimit-headers-11</code> (23 May 2026, an active Internet-Draft): <code>RateLimit-Policy: "booking";q=5;w=60</code> describes the quota (5 per 60 s), <code>RateLimit: "booking";r=4;t=12</code> the current state (4 left; the effective window — here, seconds until the bucket is full again). When the quota is used up the answer is <strong>429 Too Many Requests</strong> with <code>Retry-After</code>, which the draft says takes precedence. Because the drafts can still change, LabFlow keeps the header code in one file.</p>
<pre><code class="language-javascript">// routes/bookings.js — idempotency TRƯỚC giới hạn: lần phát lại không tốn lượt
  .post(idempotent(), bookingLimit, validate('body', { 1: BookingCreate, 2: BookingCreateV2 }), (req, res) =&gt; {
// routes/labs.js — đọc công khai: giới hạn theo IP
labsRouter.route('/')
  .get(ipLimit, validate('query', LabsQuery), (req, res) =&gt; {</code></pre>

<h3>Try it: per user</h3>
<p>Lan books six times in a row; then Bin books once:</p>
<pre><code class="language-bash">for i in 1 2 3 4 5 6; do curl -s -o /dev/null -D - -X POST http://localhost:4000/v2/bookings -H 'Authorization: Bearer tok_lan' --json "{\\"labId\\":\\"lab_1\\",\\"period\\":{\\"start\\":\\"2027-02-0\${i}T08:00:00+07:00\\",\\"end\\":\\"2027-02-0\${i}T10:00:00+07:00\\"}}" | grep -E '^(HTTP|RateLimit|Retry-After)' | tr -d '\\r' | paste -sd '|' -; done</code></pre>
<div class="out">HTTP/1.1 201 Created|RateLimit-Policy: "booking";q=5;w=60|RateLimit: "booking";r=4;t=12
HTTP/1.1 201 Created|RateLimit-Policy: "booking";q=5;w=60|RateLimit: "booking";r=3;t=24
HTTP/1.1 201 Created|RateLimit-Policy: "booking";q=5;w=60|RateLimit: "booking";r=2;t=36
HTTP/1.1 201 Created|RateLimit-Policy: "booking";q=5;w=60|RateLimit: "booking";r=1;t=48
HTTP/1.1 201 Created|RateLimit-Policy: "booking";q=5;w=60|RateLimit: "booking";r=0;t=60
HTTP/1.1 429 Too Many Requests|RateLimit-Policy: "booking";q=5;w=60|RateLimit: "booking";r=0;t=12|Retry-After: 12</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/bookings \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'Accept-Language: en' \\
  --json '{"labId":"lab_1","period":{"start":"2027-02-07T08:00:00+07:00","end":"2027-02-07T10:00:00+07:00"}}'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/rate-limited",
  "title": "Too many requests",
  "status": 429,
  "detail": "You have used up your quota; retry in 12 seconds",
  "instance": "/v2/bookings",
  "code": "RATE_LIMITED"
}</div>
<pre><code class="language-bash">curl -s -o /dev/null -D - -X POST http://localhost:4000/v2/bookings \\
  -H 'Authorization: Bearer tok_bin' \\
  --json '{"labId":"lab_2","period":{"start":"2027-02-01T08:00:00+07:00","end":"2027-02-01T10:00:00+07:00"}}' | grep -E '^(HTTP|RateLimit:)'</code></pre>
<div class="out">HTTP/1.1 201 Created
RateLimit: "booking";r=4;t=12</div>
<p>Five 201s with <code>r</code> counting down, the sixth is 429 with <code>Retry-After: 12</code> — one token every 12 seconds. Bin has his own bucket and is not affected. A client that reads <code>RateLimit</code> can slow down <em>before</em> it is refused.</p>

<h3>The proxy trap</h3>
<p>In production LabFlow runs behind nginx or a load balancer. The app then sees every connection coming from the proxy; the real client address arrives in <code>X-Forwarded-For</code>, which the proxy <em>appends</em> to (nginx: <code>$proxy_add_x_forwarded_for</code>). Express decides how far to trust that header with <code>app.set('trust proxy', …)</code>:</p>
<pre><code class="language-javascript">// app.js — chỉ tin X-Forwarded-For đúng số chặng proxy CỦA MÌNH (mặc định: không tin)
const TP = process.env.LABFLOW_TRUST_PROXY ?? 'false';
app.set('trust proxy', /^\\d+$/.test(TP) ? Number(TP) : TP === 'true');</code></pre>
<p>To test it on one machine, <code>proxy.mjs</code> behaves like nginx and pretends two users on two networks (port 8081 = client 203.0.113.10, port 8082 = 198.51.100.7, addresses reserved for documentation). The public lab list is limited to 5 requests per 10 s per IP for the demo.</p>
<pre><code class="language-javascript">// proxy.mjs — reverse proxy tối giản đứng trước LabFlow, làm đúng như nginx:
//   proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;  (NỐI địa chỉ người kết nối vào cuối)
// Mọi kết nối trên máy này đều từ 127.0.0.1, nên proxy GIẢ LẬP hai người dùng ở hai mạng khác nhau:
//   cổng 8081 ⇒ coi như client 203.0.113.10 · cổng 8082 ⇒ coi như client 198.51.100.7   (dải IP dành cho tài liệu)
import http from 'node:http';

for (const [port, clientIp] of [[8081, '203.0.113.10'], [8082, '198.51.100.7']]) {
  http.createServer((req, res) =&gt; {
    const xff = req.headers['x-forwarded-for'] ? &#96;\${req.headers['x-forwarded-for']}, \${clientIp}&#96; : clientIp;
    const up = http.request({ host: '127.0.0.1', port: 4000, path: req.url, method: req.method,
      headers: { ...req.headers, 'x-forwarded-for': xff } }, (r) =&gt; { res.writeHead(r.statusCode, r.headers); r.pipe(res); });
    req.pipe(up);
  }).listen(port, () =&gt; console.log(&#96;proxy :\${port} (client \${clientIp}) → :4000&#96;));
}</code></pre>
<p><strong>trust proxy off</strong> — the app sees only the proxy:</p>
<pre><code class="language-bash">curl -s http://localhost:8081/debug/ip</code></pre>
<div class="out">{
  "ip": "::ffff:127.0.0.1",
  "xff": "203.0.113.10"
}</div>
<pre><code class="language-bash">for i in 1 2 3 4 5 6; do curl -s -o /dev/null -w '%{http_code} ' http://localhost:8081/v2/labs; done; echo</code></pre>
<div class="out">200 200 200 200 200 429 </div>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' http://localhost:8082/v2/labs</code></pre>
<div class="out">429</div>
<p>Every user shares one bucket: user A uses it up and user B — who never sent anything — gets 429. <strong>trust proxy = true</strong> — trust the whole header:</p>
<pre><code class="language-bash">curl -s http://localhost:8081/debug/ip -H 'X-Forwarded-For: 6.6.6.6'</code></pre>
<div class="out">{
  "ip": "6.6.6.6",
  "xff": "6.6.6.6, 203.0.113.10"
}</div>
<pre><code class="language-bash">for i in 1 2 3 4 5 6 7 8; do curl -s -o /dev/null -w '%{http_code} ' http://localhost:8081/v2/labs -H "X-Forwarded-For: 10.0.0.$i"; done; echo</code></pre>
<div class="out">200 200 200 200 200 200 200 200 </div>
<p>The app believes the leftmost entry, which the <em>client</em> wrote. An attacker sends a different fake address every time and is never limited — eight 200s in a row. <strong>trust proxy = 1</strong> — trust exactly one hop, our own proxy:</p>
<pre><code class="language-bash">curl -s http://localhost:8081/debug/ip -H 'X-Forwarded-For: 6.6.6.6'</code></pre>
<div class="out">{
  "ip": "203.0.113.10",
  "xff": "6.6.6.6, 203.0.113.10"
}</div>
<pre><code class="language-bash">for i in 1 2 3 4 5 6 7 8; do curl -s -o /dev/null -w '%{http_code} ' http://localhost:8081/v2/labs -H "X-Forwarded-For: 10.0.0.$i"; done; echo</code></pre>
<div class="out">200 200 200 200 200 429 429 429 </div>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' http://localhost:8082/v2/labs</code></pre>
<div class="out">200</div>
<p>Express now takes the address that our proxy appended (203.0.113.10) and ignores what the client wrote. A is limited after five, B is not. The number must match your real infrastructure: one nginx = 1, a cloud load balancer in front of nginx = 2.</p>

<div class="pitfall"><p><strong>Trap — <code>trust proxy: true</code> copied from a tutorial.</strong> It makes every IP-based limit, log and ban spoofable. Count your hops.</p></div>
<div class="pitfall"><p><strong>Trap — limits in memory on several instances.</strong> Like idempotency keys (5.1), buckets must be shared (Redis) once there is more than one process, or each instance allows the full quota.</p></div>

<h3>In interviews and at work</h3>
<p><strong>“Design a rate limiter.”</strong> Key (user, API key or IP), algorithm (token bucket or sliding window), storage shared by all instances, headers telling clients their quota, 429 + Retry-After when exceeded, and correct client IPs behind proxies.</p>

<a class="link-card lien-ket-cheo" href="/courses/server-side-development-nodejs-express-mongodb/learn?lessonSlug=sdn302-8-2-production" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">You met this in SDN302 — lesson 8.2: hardening an API (rate limiting)</span><span class="lc-sub">If you took SDN302 on Academy, the rate-limiting habit is the same. Same: limit how many requests a client may send and answer 429. Different: SDN302 adds a ready-made middleware; here you build the token bucket yourself. This lesson adds: the RateLimit / RateLimit-Policy headers, per-user and per-IP keys, Retry-After, and the trust-proxy bug measured through a real proxy. Not taken SDN302? This lesson stands on its own.</span></span>
  <span class="lc-cta">OPEN SDN302 LESSON →</span>
</a>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
  <li>Add both limiters; reproduce the outputs, including the three proxy settings.</li>
  <li>Write a client that reads <code>RateLimit</code> and pauses when <code>r</code> reaches 0 instead of waiting for 429.</li>
  <li>Implement a fixed 60-second window instead of the bucket and show, with timestamps, the 10-requests-in-2-seconds edge.</li>
</ol>
<p><strong>Done when:</strong> each caller has its own limit, every refusal is a 429 with Retry-After, and spoofed X-Forwarded-For headers change nothing.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Rate limit</span><span class="v">How many requests a caller may make per unit of time.</span></div>
  <div class="kv"><span class="k">Token bucket</span><span class="v">Bucket of tokens refilled at a steady rate; each request takes one.</span></div>
  <div class="kv"><span class="k">429 Too Many Requests</span><span class="v">The status for “you are over your limit” (RFC 6585).</span></div>
  <div class="kv"><span class="k">Reverse proxy</span><span class="v">A server in front of the app (nginx, load balancer) that forwards requests.</span></div>
  <div class="kv"><span class="k">X-Forwarded-For</span><span class="v">Header listing client and proxy addresses; only the entries your own proxies add are trustworthy.</span></div>
  <div class="kv"><span class="k">trust proxy</span><span class="v">Express setting: how many proxy hops to trust when computing <code>req.ip</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Token bucket: 5 bookings/user/60 s, a token every 12 s, bursts allowed.</li>
  <li>Headers <code>RateLimit-Policy</code> and <code>RateLimit</code> (draft-11); over the limit ⇒ 429 + Retry-After.</li>
  <li>Measured behind a proxy: off ⇒ everyone shares one bucket; true ⇒ spoofable, 8/8 passed; 1 ⇒ correct.</li>
  <li>Replays of idempotent POSTs are answered before the limiter and cost nothing.</li>
  <li>Several instances need shared storage for buckets.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>Giới hạn tần suất và hạn mức</h2>
<p class="lead">Bài 5.2 dạy client lùi lại cho lịch sự. Không phải client nào cũng lịch sự: một script lỗi đặt phòng liên tục, một con bot đọc mọi phòng mỗi giây, ai đó dò mật khẩu. <strong>Rate limit</strong> (giới hạn tần suất) là server quyết định mỗi người gọi được làm bao nhiêu trong một khoảng thời gian, và nói rõ bằng header. Bài này dựng một xô token, thêm header <code>RateLimit</code> đang được chuẩn hoá và mã 429, rồi tìm ra lỗi làm hỏng phần lớn bộ giới hạn ở production: chạy sau reverse proxy.</p>

<h3>Xô token</h3>
<p>Hình dung một cái xô chứa tối đa <em>capacity</em> token và được rót lại đều đặn. Mỗi request lấy một token; xô rỗng nghĩa là “chờ”. LabFlow: mỗi người 5 lượt đặt trong 60 giây — cứ 12 giây rót lại một token, cho phép dồn tối đa 5 lần liền. So với cửa sổ cố định (“5 lần mỗi phút lịch”), xô không có cái mép nơi 10 request lọt qua trong hai giây quanh ranh giới phút.</p>
<pre><code class="language-javascript">// rateLimit.js — bài 5.3: giới hạn tần suất bằng "xô token" (token bucket)
// Header theo draft-ietf-httpapi-ratelimit-headers-11 (23/05/2026): RateLimit-Policy (q, w) + RateLimit (r, t); hết lượt ⇒ 429 + Retry-After
import { HttpError } from './http.js';
import { now } from './deprecation.js';

export function rateLimit({ name, capacity, windowSec, key }) {
  const buckets = new Map();                                       // khoá ⇒ { tokens, at }
  const perSec = capacity / windowSec;                             // tốc độ rót lại token
  return (req, res, next) =&gt; {
    const k = key(req);
    const t = now() / 1000;
    const b = buckets.get(k) ?? { tokens: capacity, at: t };
    b.tokens = Math.min(capacity, b.tokens + (t - b.at) * perSec);   // rót thêm phần đã "chảy" từ lần trước
    b.at = t;
    buckets.set(k, b);
    res.set('RateLimit-Policy', &#96;"\${name}";q=\${capacity};w=\${windowSec}&#96;);
    if (b.tokens &lt; 1) {                                            // hết token ⇒ chờ tới khi có lại MỘT token
      const wait = Math.ceil((1 - b.tokens) / perSec);
      res.set('RateLimit', &#96;"\${name}";r=0;t=\${wait}&#96;).set('Retry-After', String(wait));
      throw new HttpError(429, 'RATE_LIMITED', { wait });
    }
    b.tokens -= 1;
    res.set('RateLimit', &#96;"\${name}";r=\${Math.floor(b.tokens)};t=\${Math.ceil((capacity - b.tokens) / perSec)}&#96;);
    next();
  };
}

// Hai giới hạn của LabFlow: đặt phòng theo NGƯỜI DÙNG, đọc công khai theo ĐỊA CHỈ IP
export const bookingLimit = rateLimit({ name: 'booking', capacity: 5, windowSec: 60, key: (req) =&gt; req.user.id });
const [q, w] = (process.env.LABFLOW_IP_LIMIT ?? '100/60').split('/').map(Number);
export const ipLimit = rateLimit({ name: 'ip', capacity: q, windowSec: w, key: (req) =&gt; req.ip });</code></pre>
<p>Header theo <code>draft-ietf-httpapi-ratelimit-headers-11</code> (23/5/2026, bản thảo Internet đang hoạt động): <code>RateLimit-Policy: "booking";q=5;w=60</code> mô tả hạn mức (5 lần mỗi 60 giây), <code>RateLimit: "booking";r=4;t=12</code> mô tả hiện trạng (còn 4; cửa sổ hiệu lực — ở đây là số giây tới khi xô đầy lại). Khi hết lượt, câu trả lời là <strong>429 Too Many Requests</strong> kèm <code>Retry-After</code>, header mà bản thảo nói là được ưu tiên. Vì bản thảo còn có thể đổi, LabFlow để phần header trong đúng một tệp.</p>
<pre><code class="language-javascript">// routes/bookings.js — idempotency TRƯỚC giới hạn: lần phát lại không tốn lượt
  .post(idempotent(), bookingLimit, validate('body', { 1: BookingCreate, 2: BookingCreateV2 }), (req, res) =&gt; {
// routes/labs.js — đọc công khai: giới hạn theo IP
labsRouter.route('/')
  .get(ipLimit, validate('query', LabsQuery), (req, res) =&gt; {</code></pre>

<h3>Chạy thử: theo người dùng</h3>
<p>Cô Lan đặt sáu lần liền; rồi Bin đặt một lần:</p>
<pre><code class="language-bash">for i in 1 2 3 4 5 6; do curl -s -o /dev/null -D - -X POST http://localhost:4000/v2/bookings -H 'Authorization: Bearer tok_lan' --json "{\\"labId\\":\\"lab_1\\",\\"period\\":{\\"start\\":\\"2027-02-0\${i}T08:00:00+07:00\\",\\"end\\":\\"2027-02-0\${i}T10:00:00+07:00\\"}}" | grep -E '^(HTTP|RateLimit|Retry-After)' | tr -d '\\r' | paste -sd '|' -; done</code></pre>
<div class="out">HTTP/1.1 201 Created|RateLimit-Policy: "booking";q=5;w=60|RateLimit: "booking";r=4;t=12
HTTP/1.1 201 Created|RateLimit-Policy: "booking";q=5;w=60|RateLimit: "booking";r=3;t=24
HTTP/1.1 201 Created|RateLimit-Policy: "booking";q=5;w=60|RateLimit: "booking";r=2;t=36
HTTP/1.1 201 Created|RateLimit-Policy: "booking";q=5;w=60|RateLimit: "booking";r=1;t=48
HTTP/1.1 201 Created|RateLimit-Policy: "booking";q=5;w=60|RateLimit: "booking";r=0;t=60
HTTP/1.1 429 Too Many Requests|RateLimit-Policy: "booking";q=5;w=60|RateLimit: "booking";r=0;t=12|Retry-After: 12</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/bookings \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'Accept-Language: en' \\
  --json '{"labId":"lab_1","period":{"start":"2027-02-07T08:00:00+07:00","end":"2027-02-07T10:00:00+07:00"}}'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/rate-limited",
  "title": "Too many requests",
  "status": 429,
  "detail": "You have used up your quota; retry in 12 seconds",
  "instance": "/v2/bookings",
  "code": "RATE_LIMITED"
}</div>
<pre><code class="language-bash">curl -s -o /dev/null -D - -X POST http://localhost:4000/v2/bookings \\
  -H 'Authorization: Bearer tok_bin' \\
  --json '{"labId":"lab_2","period":{"start":"2027-02-01T08:00:00+07:00","end":"2027-02-01T10:00:00+07:00"}}' | grep -E '^(HTTP|RateLimit:)'</code></pre>
<div class="out">HTTP/1.1 201 Created
RateLimit: "booking";r=4;t=12</div>
<p>Năm lần 201 với <code>r</code> đếm ngược, lần thứ sáu là 429 kèm <code>Retry-After: 12</code> — cứ 12 giây một token. Bin có xô riêng nên không bị ảnh hưởng. Client đọc <code>RateLimit</code> có thể chậm lại <em>trước khi</em> bị từ chối.</p>

<h3>Cái bẫy proxy</h3>
<p>Ở production LabFlow chạy sau nginx hay load balancer. Khi đó app thấy mọi kết nối đến từ proxy; địa chỉ thật của client nằm trong <code>X-Forwarded-For</code>, header mà proxy <em>nối thêm</em> vào cuối (nginx: <code>$proxy_add_x_forwarded_for</code>). Express quyết định tin header đó tới đâu bằng <code>app.set('trust proxy', …)</code>:</p>
<pre><code class="language-javascript">// app.js — chỉ tin X-Forwarded-For đúng số chặng proxy CỦA MÌNH (mặc định: không tin)
const TP = process.env.LABFLOW_TRUST_PROXY ?? 'false';
app.set('trust proxy', /^\\d+$/.test(TP) ? Number(TP) : TP === 'true');</code></pre>
<p>Để thử trên một máy, <code>proxy.mjs</code> làm đúng như nginx và giả làm hai người dùng ở hai mạng (cổng 8081 = client 203.0.113.10, cổng 8082 = 198.51.100.7, dải địa chỉ dành cho tài liệu). Danh sách phòng công khai được giới hạn 5 request mỗi 10 giây mỗi IP cho phần demo.</p>
<pre><code class="language-javascript">// proxy.mjs — reverse proxy tối giản đứng trước LabFlow, làm đúng như nginx:
//   proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;  (NỐI địa chỉ người kết nối vào cuối)
// Mọi kết nối trên máy này đều từ 127.0.0.1, nên proxy GIẢ LẬP hai người dùng ở hai mạng khác nhau:
//   cổng 8081 ⇒ coi như client 203.0.113.10 · cổng 8082 ⇒ coi như client 198.51.100.7   (dải IP dành cho tài liệu)
import http from 'node:http';

for (const [port, clientIp] of [[8081, '203.0.113.10'], [8082, '198.51.100.7']]) {
  http.createServer((req, res) =&gt; {
    const xff = req.headers['x-forwarded-for'] ? &#96;\${req.headers['x-forwarded-for']}, \${clientIp}&#96; : clientIp;
    const up = http.request({ host: '127.0.0.1', port: 4000, path: req.url, method: req.method,
      headers: { ...req.headers, 'x-forwarded-for': xff } }, (r) =&gt; { res.writeHead(r.statusCode, r.headers); r.pipe(res); });
    req.pipe(up);
  }).listen(port, () =&gt; console.log(&#96;proxy :\${port} (client \${clientIp}) → :4000&#96;));
}</code></pre>
<p><strong>trust proxy tắt</strong> — app chỉ thấy proxy:</p>
<pre><code class="language-bash">curl -s http://localhost:8081/debug/ip</code></pre>
<div class="out">{
  "ip": "::ffff:127.0.0.1",
  "xff": "203.0.113.10"
}</div>
<pre><code class="language-bash">for i in 1 2 3 4 5 6; do curl -s -o /dev/null -w '%{http_code} ' http://localhost:8081/v2/labs; done; echo</code></pre>
<div class="out">200 200 200 200 200 429 </div>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' http://localhost:8082/v2/labs</code></pre>
<div class="out">429</div>
<p>Mọi người dùng chung một xô: người A dùng hết và người B — chưa gửi gì — nhận 429. <strong>trust proxy = true</strong> — tin cả header:</p>
<pre><code class="language-bash">curl -s http://localhost:8081/debug/ip -H 'X-Forwarded-For: 6.6.6.6'</code></pre>
<div class="out">{
  "ip": "6.6.6.6",
  "xff": "6.6.6.6, 203.0.113.10"
}</div>
<pre><code class="language-bash">for i in 1 2 3 4 5 6 7 8; do curl -s -o /dev/null -w '%{http_code} ' http://localhost:8081/v2/labs -H "X-Forwarded-For: 10.0.0.$i"; done; echo</code></pre>
<div class="out">200 200 200 200 200 200 200 200 </div>
<p>App tin mục ngoài cùng bên trái, do chính <em>client</em> viết. Kẻ tấn công gửi một địa chỉ giả khác nhau mỗi lần và không bao giờ bị giới hạn — tám lần 200 liền. <strong>trust proxy = 1</strong> — tin đúng một chặng, là proxy của mình:</p>
<pre><code class="language-bash">curl -s http://localhost:8081/debug/ip -H 'X-Forwarded-For: 6.6.6.6'</code></pre>
<div class="out">{
  "ip": "203.0.113.10",
  "xff": "6.6.6.6, 203.0.113.10"
}</div>
<pre><code class="language-bash">for i in 1 2 3 4 5 6 7 8; do curl -s -o /dev/null -w '%{http_code} ' http://localhost:8081/v2/labs -H "X-Forwarded-For: 10.0.0.$i"; done; echo</code></pre>
<div class="out">200 200 200 200 200 429 429 429 </div>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' http://localhost:8082/v2/labs</code></pre>
<div class="out">200</div>
<p>Giờ Express lấy địa chỉ mà proxy của ta nối thêm (203.0.113.10) và bỏ qua thứ client viết. A bị chặn sau năm lần, B thì không. Con số phải khớp hạ tầng thật: một nginx = 1, load balancer của cloud đứng trước nginx = 2.</p>

<div class="pitfall"><p><strong>Bẫy — chép <code>trust proxy: true</code> từ hướng dẫn trên mạng.</strong> Nó làm mọi giới hạn, log và lệnh cấm theo IP đều giả mạo được. Hãy đếm số chặng của mình.</p></div>
<div class="pitfall"><p><strong>Bẫy — giới hạn nằm trong RAM của nhiều instance.</strong> Như idempotency key (5.1), xô phải dùng chung (Redis) khi có nhiều hơn một tiến trình, không thì mỗi instance cho đủ cả hạn mức.</p></div>

<h3>Khi phỏng vấn và khi đi làm</h3>
<p><strong>“Thiết kế một bộ giới hạn tần suất.”</strong> Khoá (người dùng, API key hay IP), thuật toán (xô token hay cửa sổ trượt), nơi lưu dùng chung cho mọi instance, header báo hạn mức cho client, 429 + Retry-After khi vượt, và địa chỉ client đúng khi đứng sau proxy.</p>

<a class="link-card lien-ket-cheo" href="/courses/server-side-development-nodejs-express-mongodb/learn?lessonSlug=sdn302-8-2-production" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Bạn đã gặp ở SDN302 — bài 8.2: làm cứng API (giới hạn tần suất)</span><span class="lc-sub">Nếu bạn đã học SDN302 ở Academy, thói quen giới hạn tần suất là một. Giống: giới hạn số request một client được gửi và trả 429. Khác: SDN302 gắn một middleware có sẵn; ở đây bạn tự dựng xô token. Bài này thêm: header RateLimit / RateLimit-Policy, khoá theo người dùng và theo IP, Retry-After, và lỗi trust proxy đo qua một proxy thật. Chưa học SDN302? Bài này vẫn tự đứng được.</span></span>
  <span class="lc-cta">MỞ BÀI SDN302 →</span>
</a>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
  <li>Thêm cả hai bộ giới hạn; chạy lại các output, gồm cả ba thiết lập proxy.</li>
  <li>Viết client đọc <code>RateLimit</code> và tạm dừng khi <code>r</code> về 0 thay vì chờ bị 429.</li>
  <li>Cài cửa sổ cố định 60 giây thay cho xô và chỉ ra, kèm mốc giờ, cái mép 10 request trong 2 giây.</li>
</ol>
<p><strong>Xong khi:</strong> mỗi người gọi có giới hạn riêng, mọi lần từ chối là 429 kèm Retry-After, và header X-Forwarded-For giả không đổi được gì.</p></div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Rate limit (giới hạn tần suất)</span><span class="v">Số request một người gọi được gửi trong một khoảng thời gian.</span></div>
  <div class="kv"><span class="k">Token bucket (xô token)</span><span class="v">Xô token được rót lại đều; mỗi request lấy một token.</span></div>
  <div class="kv"><span class="k">429 Too Many Requests</span><span class="v">Mã cho “bạn đã vượt giới hạn” (RFC 6585).</span></div>
  <div class="kv"><span class="k">Reverse proxy</span><span class="v">Server đứng trước app (nginx, load balancer) để chuyển tiếp request.</span></div>
  <div class="kv"><span class="k">X-Forwarded-For</span><span class="v">Header liệt kê địa chỉ client và proxy; chỉ các mục do proxy của mình thêm mới đáng tin.</span></div>
  <div class="kv"><span class="k">trust proxy</span><span class="v">Thiết lập của Express: tin bao nhiêu chặng proxy khi tính <code>req.ip</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Xô token: 5 lượt đặt/người/60 giây, cứ 12 giây một token, cho phép dồn.</li>
  <li>Header <code>RateLimit-Policy</code> và <code>RateLimit</code> (draft-11); vượt giới hạn ⇒ 429 + Retry-After.</li>
  <li>Đo sau proxy: tắt ⇒ mọi người chung một xô; true ⇒ giả mạo được, 8/8 lọt; 1 ⇒ đúng.</li>
  <li>Lần phát lại của POST idempotent được trả trước bộ giới hạn nên không tốn lượt.</li>
  <li>Nhiều instance thì xô phải lưu ở chỗ dùng chung.</li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── 5.4 ─────────────────────────── */
    {
      title: '5.4 — Concurrency: optimistic locking with ETag, If-Match and 412|||5.4 — Đồng thời: khoá lạc quan bằng ETag, If-Match và 412',
      slug: 'api-5-4-dong-thoi',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Tái hiện mất cập nhật với hai cửa sổ, sửa bằng ETag mạnh theo version, If-Match ⇒ 412, If-None-Match ⇒ 304; vì sao chưa bắt buộc (428).',
      content: `${G054}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4</span>
<h2>Concurrency: optimistic locking and ETags</h2>
<p class="lead">Lan has the Raspberry Pi page open on her laptop and on her phone. On the laptop she writes “memory card replaced”; ten minutes later, on the phone that still shows the old page, she marks the device as in maintenance with the old note. The second save silently wipes the first. This is the <strong>lost update</strong>, and HTTP has had the tools against it for decades: <code>ETag</code>, <code>If-Match</code> and <code>412 Precondition Failed</code>.</p>

<h3>The experiment: two windows, no protection</h3>
<pre><code class="language-bash">curl -si http://localhost:4000/v2/devices/dev_3 | grep -E '^(HTTP|ETag)'</code></pre>
<div class="out">HTTP/1.1 200 OK
ETag: "dev_3-v1"</div>
<pre><code class="language-bash">curl -s \\
  -X PATCH http://localhost:4000/v2/devices/dev_3 \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'Content-Type: application/merge-patch+json' \\
  -d '{"note":"Đã thay thẻ nhớ 32 GB"}' | jq -c '{note, status}'</code></pre>
<div class="out">{"note":"Đã thay thẻ nhớ 32 GB","status":"AVAILABLE"}</div>
<pre><code class="language-bash">curl -s \\
  -X PATCH http://localhost:4000/v2/devices/dev_3 \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'Content-Type: application/merge-patch+json' \\
  -d '{"status":"MAINTENANCE","note":"Thiếu thẻ nhớ, chờ mua"}' | jq -c '{note, status}'</code></pre>
<div class="out">{"note":"Thiếu thẻ nhớ, chờ mua","status":"MAINTENANCE"}</div>
<p>Both PATCHes answered 200. The final record has the phone’s note; “memory card replaced” is gone, and nobody was told. Every API where two people can edit the same resource has this bug until it is designed away.</p>

<h3>Optimistic locking with ETags</h3>
<p>Instead of locking a record while someone edits it (pessimistic), we let everyone edit and check at save time that nobody changed it in between (<strong>optimistic</strong>). The tool is a version tag: each device record gets a <code>version</code>, and the server sends it as a <strong>strong ETag</strong> (RFC 9110 §8.8.3). A client that wants to save sends the tag it based its edit on in <code>If-Match</code>; if the record has moved on, the server answers <strong>412</strong> and changes nothing.</p>
<pre><code class="language-javascript">// concurrency.js — bài 5.4: khoá lạc quan bằng ETag + If-Match (RFC 9110 §8.8.3, §13.1.1)
import { HttpError } from './http.js';

// ETag MẠNH theo số phiên bản của bản ghi: đổi nội dung ⇒ tăng version ⇒ đổi ETag
export const etagOf = (r) =&gt; &#96;"\${r.id}-v\${r.version ?? 1}"&#96;;

// If-Match có mặt mà không khớp ⇒ 412: người gửi đang sửa trên một bản cũ
export function checkIfMatch(req, record) {
  const im = req.get('If-Match');
  if (im === undefined) return;                                    // không gửi ⇒ như trước (giữ tương thích v1/v2)
  const ok = im.trim() === '*' || im.split(',').map((s) =&gt; s.trim()).includes(etagOf(record));
  if (!ok) throw new HttpError(412, 'PRECONDITION_FAILED', { current: etagOf(record) }, { currentETag: etagOf(record) });
}

// Sau khi ghi: tăng version, trả ETag mới để client sửa tiếp không cần GET lại
export function bump(res, record) {
  record.version = (record.version ?? 1) + 1;
  res.set('ETag', etagOf(record));
}</code></pre>
<pre><code class="language-javascript">// routes/devices.js
  .get((req, res) =&gt; {
    const d = findDevice(req.params.id);
    res.set('ETag', etagOf(d)).json(viewsOf(req).device(d));      // If-None-Match khớp ⇒ Express tự trả 304
  })
  .patch(...manager, validate('body', PATCH), (req, res) =&gt; {
    const d = findDevice(req.params.id);
    checkIfMatch(req, d);                                          // bài 5.4: sửa trên bản cũ ⇒ 412
    // … áp merge patch như bài 1.2 …
    bump(res, d);                                                  // version + 1, ETag mới trong response
    res.json(viewsOf(req).device(d));
  })</code></pre>
<p>Why a version number and not a hash of the body? Both work; a counter is cheap, never collides, and is what a database column (<code>version</code>, or PostgreSQL’s <code>xmin</code>) gives you in Chapter 12. The ETag is opaque to clients — they copy it back, as with cursors in 3.2.</p>

<h3>Try it again, with If-Match</h3>
<pre><code class="language-bash">curl -si http://localhost:4000/v2/devices/dev_3 | grep -E '^(HTTP|ETag)'</code></pre>
<div class="out">HTTP/1.1 200 OK
ETag: "dev_3-v1"</div>
<pre><code class="language-bash">curl -si \\
  -X PATCH http://localhost:4000/v2/devices/dev_3 \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'If-Match: "dev_3-v1"' \\
  -H 'Content-Type: application/merge-patch+json' \\
  -d '{"note":"Đã thay thẻ nhớ 32 GB"}' | grep -E '^(HTTP|ETag)'</code></pre>
<div class="out">HTTP/1.1 200 OK
ETag: "dev_3-v2"</div>
<pre><code class="language-bash">curl -si \\
  -X PATCH http://localhost:4000/v2/devices/dev_3 \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'If-Match: "dev_3-v1"' \\
  -H 'Accept-Language: en' \\
  -H 'Content-Type: application/merge-patch+json' \\
  -d '{"status":"MAINTENANCE","note":"Thiếu thẻ nhớ, chờ mua"}' | sed -n '1p;/^{/,$p'</code></pre>
<div class="out">HTTP/1.1 412 Precondition Failed
{
  "type": "https://labflow.example/problems/precondition-failed",
  "title": "The record was changed by someone else",
  "status": 412,
  "detail": "You are editing an old copy; the current one is \\"dev_3-v2\\" — reload and try again",
  "instance": "/v2/devices/dev_3",
  "code": "PRECONDITION_FAILED",
  "currentETag": "\\"dev_3-v2\\""
}</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v2/devices/dev_3 | jq -c '{note, status}'</code></pre>
<div class="out">{"note":"Đã thay thẻ nhớ 32 GB","status":"AVAILABLE"}</div>
<pre><code class="language-bash">curl -si \\
  -X PATCH http://localhost:4000/v2/devices/dev_3 \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'If-Match: "dev_3-v2"' \\
  -H 'Content-Type: application/merge-patch+json' \\
  -d '{"status":"MAINTENANCE"}' | grep -E '^(HTTP|ETag)'</code></pre>
<div class="out">HTTP/1.1 200 OK
ETag: "dev_3-v3"</div>
<p>The laptop saves with <code>If-Match: "dev_3-v1"</code> and gets 200 with the new tag <code>"dev_3-v2"</code>. The phone, still holding v1, gets <strong>412</strong> with the current tag in <code>currentETag</code>, and the record keeps the laptop’s note. The phone reloads, merges, and saves with v2. Nothing is lost; the conflict is visible.</p>

<h3>A bonus from the same tag: 304</h3>
<pre><code class="language-bash">curl -si http://localhost:4000/v2/devices/dev_3 \\
  -H 'If-None-Match: "dev_3-v3"' | grep -E '^(HTTP|ETag|Content-Length)'</code></pre>
<div class="out">HTTP/1.1 304 Not Modified
ETag: "dev_3-v3"</div>
<pre><code class="language-bash">curl -si http://localhost:4000/v2/devices/dev_3 \\
  -H 'If-None-Match: "dev_3-v1"' | grep -E '^(HTTP|ETag)'</code></pre>
<div class="out">HTTP/1.1 200 OK
ETag: "dev_3-v3"</div>
<p>A client that already has v3 sends <code>If-None-Match</code> and gets <strong>304 Not Modified</strong> with no body — Express does that automatically once the ETag header is set. One tag gives you both safe writes and cheap re-reads.</p>

<h3>Should If-Match be required?</h3>
<p>RFC 6585 defines <strong>428 Precondition Required</strong> for servers that insist on conditional writes. LabFlow makes If-Match <em>optional</em> on existing endpoints: requiring it now would break every v1 and v2 client that never sent it — a breaking change (lesson 4.1). New endpoints, or a future v3, can require it from day one.</p>

<div class="pitfall"><p><strong>Trap — weak ETags for writes.</strong> Express’s automatic ETags are weak (<code>W/"…"</code>) and RFC 9110 says If-Match uses strong comparison. Set your own strong tag from the record’s version.</p></div>
<div class="pitfall"><p><strong>Trap — read-modify-write in two queries.</strong> With a real database the check and the update must be one statement: <code>UPDATE devices SET …, version = version + 1 WHERE id = $1 AND version = $2</code>; zero rows updated ⇒ 412.</p></div>

<h3>In interviews and at work</h3>
<p><strong>“Two users edit the same record. What happens?”</strong> Without protection the last write wins silently. Optimistic locking: a version per record, exposed as an ETag, sent back in If-Match, 412 on mismatch, update guarded by <code>WHERE version = …</code>.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
  <li>Add ETags to devices; reproduce both experiments.</li>
  <li>Add ETags and If-Match to <code>POST /bookings/:id/cancel</code>. Which race does it prevent?</li>
  <li>Write the one SQL statement for the PATCH and explain how you know it hit a conflict.</li>
</ol>
<p><strong>Done when:</strong> a save based on an old copy gets 412 and changes nothing, and an unchanged read gets 304.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Lost update</span><span class="v">A save overwrites someone else’s change without anyone noticing.</span></div>
  <div class="kv"><span class="k">Optimistic locking</span><span class="v">Let everyone edit; check at save time that nothing changed.</span></div>
  <div class="kv"><span class="k">ETag</span><span class="v">An opaque tag for one version of a representation.</span></div>
  <div class="kv"><span class="k">If-Match</span><span class="v">“Apply only if the current tag is this one”; otherwise 412.</span></div>
  <div class="kv"><span class="k">If-None-Match</span><span class="v">“Send the body only if it changed”; otherwise 304.</span></div>
  <div class="kv"><span class="k">428 Precondition Required</span><span class="v">The server requires a conditional request (RFC 6585).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Measured: two unprotected PATCHes both returned 200 and the first change vanished.</li>
  <li>Version per record ⇒ strong ETag; save with If-Match; old copy ⇒ 412, nothing changed.</li>
  <li>The same tag gives 304 Not Modified for cheap re-reads.</li>
  <li>If-Match stays optional on existing endpoints — requiring it (428) would be a breaking change.</li>
  <li>In SQL: check and update in one statement guarded by the version.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>Đồng thời: khoá lạc quan và ETag</h2>
<p class="lead">Cô Lan mở trang Raspberry Pi trên laptop và cả trên điện thoại. Trên laptop cô ghi “đã thay thẻ nhớ”; mười phút sau, trên điện thoại vẫn đang hiện trang cũ, cô chuyển thiết bị sang bảo trì kèm ghi chú cũ. Lần lưu thứ hai lặng lẽ xoá mất lần thứ nhất. Đó là <strong>lost update</strong> (mất cập nhật), và HTTP đã có công cụ chống nó từ hàng chục năm: <code>ETag</code>, <code>If-Match</code> và <code>412 Precondition Failed</code>.</p>

<h3>Thí nghiệm: hai cửa sổ, không bảo vệ</h3>
<pre><code class="language-bash">curl -si http://localhost:4000/v2/devices/dev_3 | grep -E '^(HTTP|ETag)'</code></pre>
<div class="out">HTTP/1.1 200 OK
ETag: "dev_3-v1"</div>
<pre><code class="language-bash">curl -s \\
  -X PATCH http://localhost:4000/v2/devices/dev_3 \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'Content-Type: application/merge-patch+json' \\
  -d '{"note":"Đã thay thẻ nhớ 32 GB"}' | jq -c '{note, status}'</code></pre>
<div class="out">{"note":"Đã thay thẻ nhớ 32 GB","status":"AVAILABLE"}</div>
<pre><code class="language-bash">curl -s \\
  -X PATCH http://localhost:4000/v2/devices/dev_3 \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'Content-Type: application/merge-patch+json' \\
  -d '{"status":"MAINTENANCE","note":"Thiếu thẻ nhớ, chờ mua"}' | jq -c '{note, status}'</code></pre>
<div class="out">{"note":"Thiếu thẻ nhớ, chờ mua","status":"MAINTENANCE"}</div>
<p>Cả hai PATCH đều trả 200. Bản ghi cuối mang ghi chú của điện thoại; “đã thay thẻ nhớ” biến mất, và không ai được báo. API nào cho hai người sửa cùng một tài nguyên cũng mang lỗi này cho tới khi được thiết kế để loại bỏ nó.</p>

<h3>Khoá lạc quan bằng ETag</h3>
<p>Thay vì khoá bản ghi trong lúc có người sửa (khoá bi quan), ta cho mọi người sửa và kiểm lúc lưu xem có ai đổi nó trong lúc đó không (khoá <strong>lạc quan</strong>). Công cụ là một nhãn phiên bản: mỗi bản ghi thiết bị có <code>version</code>, và server gửi nó dưới dạng <strong>ETag mạnh</strong> (RFC 9110 §8.8.3). Client muốn lưu thì gửi lại nhãn mà nó dựa vào trong <code>If-Match</code>; nếu bản ghi đã đổi, server trả <strong>412</strong> và không đổi gì.</p>
<pre><code class="language-javascript">// concurrency.js — bài 5.4: khoá lạc quan bằng ETag + If-Match (RFC 9110 §8.8.3, §13.1.1)
import { HttpError } from './http.js';

// ETag MẠNH theo số phiên bản của bản ghi: đổi nội dung ⇒ tăng version ⇒ đổi ETag
export const etagOf = (r) =&gt; &#96;"\${r.id}-v\${r.version ?? 1}"&#96;;

// If-Match có mặt mà không khớp ⇒ 412: người gửi đang sửa trên một bản cũ
export function checkIfMatch(req, record) {
  const im = req.get('If-Match');
  if (im === undefined) return;                                    // không gửi ⇒ như trước (giữ tương thích v1/v2)
  const ok = im.trim() === '*' || im.split(',').map((s) =&gt; s.trim()).includes(etagOf(record));
  if (!ok) throw new HttpError(412, 'PRECONDITION_FAILED', { current: etagOf(record) }, { currentETag: etagOf(record) });
}

// Sau khi ghi: tăng version, trả ETag mới để client sửa tiếp không cần GET lại
export function bump(res, record) {
  record.version = (record.version ?? 1) + 1;
  res.set('ETag', etagOf(record));
}</code></pre>
<pre><code class="language-javascript">// routes/devices.js
  .get((req, res) =&gt; {
    const d = findDevice(req.params.id);
    res.set('ETag', etagOf(d)).json(viewsOf(req).device(d));      // If-None-Match khớp ⇒ Express tự trả 304
  })
  .patch(...manager, validate('body', PATCH), (req, res) =&gt; {
    const d = findDevice(req.params.id);
    checkIfMatch(req, d);                                          // bài 5.4: sửa trên bản cũ ⇒ 412
    // … áp merge patch như bài 1.2 …
    bump(res, d);                                                  // version + 1, ETag mới trong response
    res.json(viewsOf(req).device(d));
  })</code></pre>
<p>Sao dùng số phiên bản mà không băm body? Cách nào cũng được; bộ đếm thì rẻ, không bao giờ trùng, và chính là thứ một cột cơ sở dữ liệu (<code>version</code>, hay <code>xmin</code> của PostgreSQL) cho bạn ở Chương 12. ETag là chuỗi mờ với client — chép gửi lại, như con trỏ ở bài 3.2.</p>

<h3>Thử lại, có If-Match</h3>
<pre><code class="language-bash">curl -si http://localhost:4000/v2/devices/dev_3 | grep -E '^(HTTP|ETag)'</code></pre>
<div class="out">HTTP/1.1 200 OK
ETag: "dev_3-v1"</div>
<pre><code class="language-bash">curl -si \\
  -X PATCH http://localhost:4000/v2/devices/dev_3 \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'If-Match: "dev_3-v1"' \\
  -H 'Content-Type: application/merge-patch+json' \\
  -d '{"note":"Đã thay thẻ nhớ 32 GB"}' | grep -E '^(HTTP|ETag)'</code></pre>
<div class="out">HTTP/1.1 200 OK
ETag: "dev_3-v2"</div>
<pre><code class="language-bash">curl -si \\
  -X PATCH http://localhost:4000/v2/devices/dev_3 \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'If-Match: "dev_3-v1"' \\
  -H 'Accept-Language: en' \\
  -H 'Content-Type: application/merge-patch+json' \\
  -d '{"status":"MAINTENANCE","note":"Thiếu thẻ nhớ, chờ mua"}' | sed -n '1p;/^{/,$p'</code></pre>
<div class="out">HTTP/1.1 412 Precondition Failed
{
  "type": "https://labflow.example/problems/precondition-failed",
  "title": "The record was changed by someone else",
  "status": 412,
  "detail": "You are editing an old copy; the current one is \\"dev_3-v2\\" — reload and try again",
  "instance": "/v2/devices/dev_3",
  "code": "PRECONDITION_FAILED",
  "currentETag": "\\"dev_3-v2\\""
}</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v2/devices/dev_3 | jq -c '{note, status}'</code></pre>
<div class="out">{"note":"Đã thay thẻ nhớ 32 GB","status":"AVAILABLE"}</div>
<pre><code class="language-bash">curl -si \\
  -X PATCH http://localhost:4000/v2/devices/dev_3 \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'If-Match: "dev_3-v2"' \\
  -H 'Content-Type: application/merge-patch+json' \\
  -d '{"status":"MAINTENANCE"}' | grep -E '^(HTTP|ETag)'</code></pre>
<div class="out">HTTP/1.1 200 OK
ETag: "dev_3-v3"</div>
<p>Laptop lưu với <code>If-Match: "dev_3-v1"</code> và nhận 200 kèm nhãn mới <code>"dev_3-v2"</code>. Điện thoại vẫn cầm v1 nên nhận <strong>412</strong> kèm nhãn hiện tại trong <code>currentETag</code>, và bản ghi giữ ghi chú của laptop. Điện thoại tải lại, gộp, rồi lưu với v2. Không mất gì; xung đột hiện ra rõ ràng.</p>

<h3>Phần thưởng từ cùng một nhãn: 304</h3>
<pre><code class="language-bash">curl -si http://localhost:4000/v2/devices/dev_3 \\
  -H 'If-None-Match: "dev_3-v3"' | grep -E '^(HTTP|ETag|Content-Length)'</code></pre>
<div class="out">HTTP/1.1 304 Not Modified
ETag: "dev_3-v3"</div>
<pre><code class="language-bash">curl -si http://localhost:4000/v2/devices/dev_3 \\
  -H 'If-None-Match: "dev_3-v1"' | grep -E '^(HTTP|ETag)'</code></pre>
<div class="out">HTTP/1.1 200 OK
ETag: "dev_3-v3"</div>
<p>Client đã có v3 gửi <code>If-None-Match</code> và nhận <strong>304 Not Modified</strong>, không body — Express tự làm việc đó khi header ETag đã được đặt. Một nhãn cho cả ghi an toàn lẫn đọc lại rẻ.</p>

<h3>Có nên bắt buộc If-Match?</h3>
<p>RFC 6585 định nghĩa <strong>428 Precondition Required</strong> cho server đòi ghi có điều kiện. LabFlow để If-Match là <em>tuỳ chọn</em> trên các endpoint đang có: bắt buộc bây giờ sẽ làm vỡ mọi client v1, v2 chưa từng gửi nó — một thay đổi phá vỡ (bài 4.1). Endpoint mới, hay một v3 sau này, có thể bắt buộc ngay từ ngày đầu.</p>

<div class="pitfall"><p><strong>Bẫy — dùng ETag yếu cho thao tác ghi.</strong> ETag tự động của Express là yếu (<code>W/"…"</code>), còn RFC 9110 nói If-Match so sánh mạnh. Hãy tự đặt nhãn mạnh từ version của bản ghi.</p></div>
<div class="pitfall"><p><strong>Bẫy — đọc-sửa-ghi bằng hai câu truy vấn.</strong> Với cơ sở dữ liệu thật, phép kiểm và phép cập nhật phải là một câu: <code>UPDATE devices SET …, version = version + 1 WHERE id = $1 AND version = $2</code>; không dòng nào bị cập nhật ⇒ 412.</p></div>

<h3>Khi phỏng vấn và khi đi làm</h3>
<p><strong>“Hai người cùng sửa một bản ghi thì sao?”</strong> Không bảo vệ thì người ghi sau thắng một cách lặng lẽ. Khoá lạc quan: mỗi bản ghi một version, lộ ra thành ETag, gửi lại qua If-Match, lệch thì 412, câu cập nhật có điều kiện <code>WHERE version = …</code>.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
  <li>Thêm ETag cho thiết bị; chạy lại cả hai thí nghiệm.</li>
  <li>Thêm ETag và If-Match cho <code>POST /bookings/:id/cancel</code>. Nó chặn được cuộc đua nào?</li>
  <li>Viết đúng một câu SQL cho PATCH và giải thích làm sao biết nó gặp xung đột.</li>
</ol>
<p><strong>Xong khi:</strong> lần lưu dựa trên bản cũ nhận 412 và không đổi gì, còn lần đọc khi không có gì đổi nhận 304.</p></div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Lost update (mất cập nhật)</span><span class="v">Một lần lưu ghi đè thay đổi của người khác mà không ai hay.</span></div>
  <div class="kv"><span class="k">Optimistic locking (khoá lạc quan)</span><span class="v">Cho mọi người sửa; kiểm lúc lưu xem có gì đã đổi không.</span></div>
  <div class="kv"><span class="k">ETag</span><span class="v">Nhãn mờ cho một phiên bản của cách biểu diễn.</span></div>
  <div class="kv"><span class="k">If-Match</span><span class="v">“Chỉ áp nếu nhãn hiện tại đúng là cái này”; ngược lại 412.</span></div>
  <div class="kv"><span class="k">If-None-Match</span><span class="v">“Chỉ gửi body nếu đã đổi”; ngược lại 304.</span></div>
  <div class="kv"><span class="k">428 Precondition Required</span><span class="v">Server đòi request có điều kiện (RFC 6585).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Đo được: hai PATCH không bảo vệ đều trả 200 và thay đổi đầu tiên biến mất.</li>
  <li>Mỗi bản ghi một version ⇒ ETag mạnh; lưu kèm If-Match; bản cũ ⇒ 412, không đổi gì.</li>
  <li>Cùng nhãn đó cho 304 Not Modified khi đọc lại.</li>
  <li>If-Match là tuỳ chọn trên endpoint đang có — bắt buộc (428) sẽ là thay đổi phá vỡ.</li>
  <li>Trong SQL: kiểm và cập nhật trong một câu có điều kiện theo version.</li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── 5.5 Lab (bài MỚI) ─────────────────────────── */
    {
      title: '5.5 — Lab 5: reporting that survives the basement (idempotency, limits, ETags — with rubric)|||5.5 — Lab 5: báo hỏng sống sót dưới tầng hầm (idempotency, giới hạn, ETag — có thang chấm)',
      slug: 'api-5-5-lab',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Lab chương: báo hỏng đúng một lần qua mất response, 3 báo hỏng/phút/người với header, xử lý đồng thời bằng If-Match/412, 304; thang chấm 10 điểm, lời giải và transcript thật.',
      content: `${GL5}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lab</span>
<h2>Lab 5 — Reporting that survives the basement</h2>
<p class="lead">The lab basement has the worst Wi-Fi in the building — and the most broken devices. Students report from there, managers resolve from two screens at once. Make issue reporting reliable with everything from Chapter 5, and prove it with a transcript.</p>

<h3>The request</h3>
<ul>
  <li>“A student who taps ‘Report’ on a bad connection must create <strong>exactly one</strong> issue, however often the app retries.”</li>
  <li>“A student may send at most <strong>3 reports per minute</strong>; tell the app how many are left.”</li>
  <li>“When two managers resolve the same issue at the same time, the second must <strong>see the conflict</strong>, not overwrite the first.”</li>
  <li>“Re-opening an unchanged issue should cost nothing.”</li>
</ul>
<p>Budget: design 15 min · build 60 min · prove 20 min. Start from your code at the end of lesson 5.4.</p>

<h3>Part A — design (<code>DESIGN.md</code>)</h3>
<ol>
  <li>Middleware order on <code>POST /v2/devices/:id/issues</code> — auth, idempotency, limit, device lookup, validation — and why a replay must not cost a token.</li>
  <li>The headers of the 3rd and 4th report in one minute.</li>
  <li>The ETag of a new issue, and after it is resolved; status and code for a resolve based on the old tag.</li>
  <li>Your client’s retry rules: which statuses, how long to wait, which timeout.</li>
</ol>

<h3>Part B — build it: rules</h3>
<ol>
  <li><code>idempotent()</code> on report creation; the client generates <strong>one</strong> key per tap.</li>
  <li><code>reportLimit</code>: 3 per 60 s per user, <code>RateLimit-Policy</code>/<code>RateLimit</code>, 429 + Retry-After.</li>
  <li><code>GET /v2/issues/:id</code> sends a strong ETag; <code>POST /v2/issues/:id/resolve</code> honours If-Match (412) and bumps the version.</li>
  <li><code>report.mjs</code> uses <code>fetchWithRetry</code> from 5.2 with a 2 s timeout.</li>
  <li>Reuse the 5.1–5.4 modules — no second copy of the logic.</li>
</ol>

<h3>Part C — prove it (<code>TRANSCRIPT.md</code>)</h3>
<ol>
  <li>With <code>LABFLOW_DROP_FIRST=1</code>: <code>node report.mjs</code> survives the lost response; the list shows one issue.</li>
  <li>Three more reports in a row: two 201s, then 429 with Retry-After.</li>
  <li>Resolve with the current tag (200), again with the old tag (412 with <code>currentETag</code>), then <code>If-None-Match</code> ⇒ 304.</li>
</ol>

<h3>Rubric — 10 points</h3>
<table>
  <thead><tr><th>Points</th><th>Criterion</th><th>Checked by</th></tr></thead>
  <tbody>
    <tr><td>3</td><td>Exactly one issue after a lost response; replay marked; one key per tap</td><td>step 1 · code</td></tr>
    <tr><td>2</td><td>Per-user limit with correct headers, 429 + Retry-After, replays free</td><td>step 2 · Part A</td></tr>
    <tr><td>2</td><td>Strong ETag, If-Match ⇒ 412 without changing the issue, version bumped</td><td>step 3</td></tr>
    <tr><td>1</td><td>304 for an unchanged issue</td><td>step 3</td></tr>
    <tr><td>1</td><td>Client: timeout, retry only transient errors, backoff with jitter</td><td>code</td></tr>
    <tr><td>1</td><td>Transcript complete and unedited</td><td>the file</td></tr>
  </tbody>
</table>
<p><strong>Pass: 7/10.</strong> Hand in <code>DESIGN.md</code>, the changed files, <code>report.mjs</code> and <code>TRANSCRIPT.md</code> in one commit.</p>

<h3>Stretch goals</h3>
<ul>
  <li>Move idempotency keys and buckets to PostgreSQL (or Redis) and prove that two server processes share them.</li>
  <li>Make the client read <code>RateLimit</code> and wait before it is refused.</li>
</ul>

<h3>Reference solution — read after you have tried</h3>
<p><strong>Design.</strong> Order: auth → idempotency → limit → device → validation (a replay is answered before the limiter, so it is free; the 404 → 400 order of Lab 1 is kept). Third report: <code>RateLimit: "report";r=0;…</code>; fourth: 429. A new issue is <code>"iss_1-v1"</code>, after resolving <code>"iss_1-v2"</code>; a resolve with v1 then gets 412 <code>PRECONDITION_FAILED</code>.</p>
<pre><code class="language-javascript">// rateLimit.js
export const reportLimit = rateLimit({ name: 'report', capacity: 3, windowSec: 60, key: (req) =&gt; req.user.id });

// routes/issues.js
  .post(requireAuth, idempotent(), reportLimit, loadDevice, validate('body', IssueCreate), (req, res) =&gt; { … })

issuesRouter.route('/:id')
  .get((req, res) =&gt; {
    const issue = findIssue(req.params.id);
    res.set('ETag', etagOf(issue)).json(viewsOf(req).issue(issue));
  })
issuesRouter.route('/:id/resolve')
  .post(requireAuth, requireRole('LAB_MANAGER'), validate('body', IssueResolve), (req, res) =&gt; {
    const issue = findIssue(req.params.id);
    checkIfMatch(req, issue);                                       // người sau với bản cũ ⇒ 412
    if (issue.status === 'RESOLVED') throw new HttpError(409, 'ALREADY_RESOLVED', { id: issue.id });
    issue.status = 'RESOLVED';
    issue.resolvedAt = new Date().toISOString();
    if (req.valid.body.resolution) issue.resolution = req.valid.body.resolution;
    bump(res, issue);
    res.json(viewsOf(req).issue(issue));
  })</code></pre>
<pre><code class="language-javascript">// report.mjs — app báo hỏng của sinh viên: một lần bấm = MỘT khoá, thử lại tới khi chắc chắn
import { randomUUID } from 'node:crypto';
import { fetchWithRetry } from './retry.mjs';

const [device = 'dev_1', title = 'Quạt kêu to'] = process.argv.slice(2);
const key = randomUUID();
const res = await fetchWithRetry(&#96;http://localhost:4000/v2/devices/\${device}/issues&#96;, {
  method: 'POST',
  headers: { Authorization: 'Bearer tok_an', 'Content-Type': 'application/json', 'Idempotency-Key': &#96;"\${key}"&#96; },
  body: JSON.stringify({ title, severity: 'LOW' }),
}, { timeoutMs: 2000, log: console.log });
const body = await res.json();
console.log(&#96;kết quả: \${res.status} \${body.id ?? body.code}\${res.headers.get('idempotent-replayed') ? ' (Idempotent-Replayed)' : ''}&#96;);</code></pre>

<h3>Reference transcript (real run)</h3>
<pre><code class="language-bash">node report.mjs dev_1 'Quạt kêu to'</code></pre>
<div class="out">#1 TypeError sau 26 ms
   chờ 154 ms
#2 201 sau 5 ms
kết quả: 201 iss_1 (Idempotent-Replayed)</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/v2/issues?deviceId=dev_1&amp;status=OPEN' | jq -c '[.data[] | {id, title}]'</code></pre>
<div class="out">[{"id":"iss_1","title":"Quạt kêu to"}]</div>
<p>The first attempt failed with a network error (the server cut the connection after creating the issue); the retry 154 ms later got iss_1 back as a replay. One issue.</p>
<pre><code class="language-bash">for t in 'Đèn nguồn nhấp nháy' 'Cổng 3 lỏng' 'Mất cấu hình'; do curl -s -o /dev/null -D - -X POST http://localhost:4000/v2/devices/dev_2/issues -H 'Authorization: Bearer tok_an' --json "{\\"title\\":\\"$t\\",\\"severity\\":\\"LOW\\"}" | grep -E '^(HTTP|RateLimit:|Retry-After)' | tr -d '\\r' | paste -sd '|' -; done</code></pre>
<div class="out">HTTP/1.1 201 Created|RateLimit: "report";r=1;t=40
HTTP/1.1 201 Created|RateLimit: "report";r=0;t=60
HTTP/1.1 429 Too Many Requests|RateLimit: "report";r=0;t=20|Retry-After: 20</div>
<p>Only two 201s before the 429: the report in step 1 already used one of the three tokens, while its replay was free.</p>
<pre><code class="language-bash">curl -si http://localhost:4000/v2/issues/iss_1 | grep -E '^(HTTP|ETag)'</code></pre>
<div class="out">HTTP/1.1 200 OK
ETag: "iss_1-v1"</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/issues/iss_1/resolve \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'If-Match: "iss_1-v1"' \\
  --json '{"resolution":"Đã vệ sinh quạt"}' | jq -c '{id, status, resolution}'</code></pre>
<div class="out">{"id":"iss_1","status":"RESOLVED","resolution":"Đã vệ sinh quạt"}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/issues/iss_1/resolve \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'If-Match: "iss_1-v1"' \\
  -H 'Accept-Language: en' \\
  --json '{"resolution":"Thay quạt mới"}' | jq -c '{status, code, currentETag}'</code></pre>
<div class="out">{"status":412,"code":"PRECONDITION_FAILED","currentETag":"\\"iss_1-v2\\""}</div>
<pre><code class="language-bash">curl -si http://localhost:4000/v2/issues/iss_1 \\
  -H 'If-None-Match: "iss_1-v2"' | grep -E '^(HTTP|ETag)'</code></pre>
<div class="out">HTTP/1.1 304 Not Modified
ETag: "iss_1-v2"</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Lab</span>
<h2>Lab 5 — Báo hỏng sống sót dưới tầng hầm</h2>
<p class="lead">Tầng hầm phòng lab có Wi-Fi tệ nhất toà nhà — và nhiều thiết bị hỏng nhất. Sinh viên báo hỏng từ đó, quản lý xử lý từ hai màn hình cùng lúc. Hãy làm việc báo hỏng trở nên tin cậy bằng mọi thứ của Chương 5, và chứng minh bằng transcript.</p>

<h3>Yêu cầu</h3>
<ul>
  <li>“Sinh viên bấm ‘Báo hỏng’ trên kết nối kém phải tạo <strong>đúng một</strong> báo hỏng, dù app thử lại bao nhiêu lần.”</li>
  <li>“Mỗi sinh viên gửi tối đa <strong>3 báo hỏng mỗi phút</strong>; cho app biết còn bao nhiêu lượt.”</li>
  <li>“Khi hai quản lý cùng xử lý một báo hỏng một lúc, người sau phải <strong>thấy xung đột</strong>, không ghi đè người trước.”</li>
  <li>“Mở lại một báo hỏng không đổi gì thì không tốn gì.”</li>
</ul>
<p>Thời gian: thiết kế 15 phút · xây 60 phút · chứng minh 20 phút. Bắt đầu từ code của bạn cuối bài 5.4.</p>

<h3>Phần A — thiết kế (<code>DESIGN.md</code>)</h3>
<ol>
  <li>Thứ tự middleware trên <code>POST /v2/devices/:id/issues</code> — xác thực, idempotency, giới hạn, tìm thiết bị, kiểm dữ liệu — và vì sao lần phát lại không được tốn token.</li>
  <li>Header của báo hỏng thứ 3 và thứ 4 trong một phút.</li>
  <li>ETag của báo hỏng mới, và sau khi xử lý; mã trạng thái và code khi xử lý dựa trên nhãn cũ.</li>
  <li>Luật thử lại của client: mã nào, chờ bao lâu, timeout bao nhiêu.</li>
</ol>

<h3>Phần B — xây: các luật</h3>
<ol>
  <li><code>idempotent()</code> cho việc tạo báo hỏng; client tạo <strong>một</strong> khoá cho mỗi lần bấm.</li>
  <li><code>reportLimit</code>: 3 lần mỗi 60 giây mỗi người, <code>RateLimit-Policy</code>/<code>RateLimit</code>, 429 + Retry-After.</li>
  <li><code>GET /v2/issues/:id</code> gửi ETag mạnh; <code>POST /v2/issues/:id/resolve</code> tôn trọng If-Match (412) và tăng version.</li>
  <li><code>report.mjs</code> dùng <code>fetchWithRetry</code> của bài 5.2 với timeout 2 giây.</li>
  <li>Dùng lại các module của 5.1–5.4 — không chép thêm một bản logic nào.</li>
</ol>

<h3>Phần C — chứng minh (<code>TRANSCRIPT.md</code>)</h3>
<ol>
  <li>Với <code>LABFLOW_DROP_FIRST=1</code>: <code>node report.mjs</code> sống sót qua lần mất response; danh sách có đúng một báo hỏng.</li>
  <li>Ba báo hỏng nữa liền nhau: hai lần 201, rồi 429 kèm Retry-After.</li>
  <li>Xử lý với nhãn hiện tại (200), lần nữa với nhãn cũ (412 kèm <code>currentETag</code>), rồi <code>If-None-Match</code> ⇒ 304.</li>
</ol>

<h3>Thang chấm — 10 điểm</h3>
<table>
  <thead><tr><th>Điểm</th><th>Tiêu chí</th><th>Kiểm bằng</th></tr></thead>
  <tbody>
    <tr><td>3</td><td>Đúng một báo hỏng sau khi mất response; có đánh dấu phát lại; mỗi lần bấm một khoá</td><td>bước 1 · code</td></tr>
    <tr><td>2</td><td>Giới hạn theo người với header đúng, 429 + Retry-After, phát lại không tốn lượt</td><td>bước 2 · Phần A</td></tr>
    <tr><td>2</td><td>ETag mạnh, If-Match ⇒ 412 mà không đổi báo hỏng, version tăng</td><td>bước 3</td></tr>
    <tr><td>1</td><td>304 cho báo hỏng không đổi</td><td>bước 3</td></tr>
    <tr><td>1</td><td>Client: timeout, chỉ thử lại lỗi tạm thời, lùi dần có jitter</td><td>code</td></tr>
    <tr><td>1</td><td>Transcript đầy đủ, không chỉnh sửa</td><td>tệp nộp</td></tr>
  </tbody>
</table>
<p><strong>Đạt: 7/10.</strong> Nộp <code>DESIGN.md</code>, các tệp đã sửa, <code>report.mjs</code> và <code>TRANSCRIPT.md</code> trong một commit.</p>

<h3>Mục tiêu nâng cao</h3>
<ul>
  <li>Chuyển idempotency key và xô token sang PostgreSQL (hoặc Redis) và chứng minh hai tiến trình server dùng chung chúng.</li>
  <li>Cho client đọc <code>RateLimit</code> và tự chờ trước khi bị từ chối.</li>
</ul>

<h3>Lời giải tham khảo — đọc sau khi đã tự làm</h3>
<p><strong>Thiết kế.</strong> Thứ tự: xác thực → idempotency → giới hạn → thiết bị → kiểm dữ liệu (lần phát lại được trả trước bộ giới hạn nên miễn phí; thứ tự 404 → 400 của Lab 1 được giữ). Báo hỏng thứ ba: <code>RateLimit: "report";r=0;…</code>; thứ tư: 429. Báo hỏng mới có <code>"iss_1-v1"</code>, sau khi xử lý là <code>"iss_1-v2"</code>; xử lý bằng v1 khi đó nhận 412 <code>PRECONDITION_FAILED</code>.</p>
<pre><code class="language-javascript">// rateLimit.js
export const reportLimit = rateLimit({ name: 'report', capacity: 3, windowSec: 60, key: (req) =&gt; req.user.id });

// routes/issues.js
  .post(requireAuth, idempotent(), reportLimit, loadDevice, validate('body', IssueCreate), (req, res) =&gt; { … })

issuesRouter.route('/:id')
  .get((req, res) =&gt; {
    const issue = findIssue(req.params.id);
    res.set('ETag', etagOf(issue)).json(viewsOf(req).issue(issue));
  })
issuesRouter.route('/:id/resolve')
  .post(requireAuth, requireRole('LAB_MANAGER'), validate('body', IssueResolve), (req, res) =&gt; {
    const issue = findIssue(req.params.id);
    checkIfMatch(req, issue);                                       // người sau với bản cũ ⇒ 412
    if (issue.status === 'RESOLVED') throw new HttpError(409, 'ALREADY_RESOLVED', { id: issue.id });
    issue.status = 'RESOLVED';
    issue.resolvedAt = new Date().toISOString();
    if (req.valid.body.resolution) issue.resolution = req.valid.body.resolution;
    bump(res, issue);
    res.json(viewsOf(req).issue(issue));
  })</code></pre>
<pre><code class="language-javascript">// report.mjs — app báo hỏng của sinh viên: một lần bấm = MỘT khoá, thử lại tới khi chắc chắn
import { randomUUID } from 'node:crypto';
import { fetchWithRetry } from './retry.mjs';

const [device = 'dev_1', title = 'Quạt kêu to'] = process.argv.slice(2);
const key = randomUUID();
const res = await fetchWithRetry(&#96;http://localhost:4000/v2/devices/\${device}/issues&#96;, {
  method: 'POST',
  headers: { Authorization: 'Bearer tok_an', 'Content-Type': 'application/json', 'Idempotency-Key': &#96;"\${key}"&#96; },
  body: JSON.stringify({ title, severity: 'LOW' }),
}, { timeoutMs: 2000, log: console.log });
const body = await res.json();
console.log(&#96;kết quả: \${res.status} \${body.id ?? body.code}\${res.headers.get('idempotent-replayed') ? ' (Idempotent-Replayed)' : ''}&#96;);</code></pre>

<h3>Transcript tham khảo (chạy thật)</h3>
<pre><code class="language-bash">node report.mjs dev_1 'Quạt kêu to'</code></pre>
<div class="out">#1 TypeError sau 26 ms
   chờ 154 ms
#2 201 sau 5 ms
kết quả: 201 iss_1 (Idempotent-Replayed)</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/v2/issues?deviceId=dev_1&amp;status=OPEN' | jq -c '[.data[] | {id, title}]'</code></pre>
<div class="out">[{"id":"iss_1","title":"Quạt kêu to"}]</div>
<p>Lần thử đầu hỏng vì lỗi mạng (server cắt kết nối sau khi đã tạo báo hỏng); lần thử lại 154 ms sau nhận lại iss_1 dưới dạng phát lại. Một báo hỏng.</p>
<pre><code class="language-bash">for t in 'Đèn nguồn nhấp nháy' 'Cổng 3 lỏng' 'Mất cấu hình'; do curl -s -o /dev/null -D - -X POST http://localhost:4000/v2/devices/dev_2/issues -H 'Authorization: Bearer tok_an' --json "{\\"title\\":\\"$t\\",\\"severity\\":\\"LOW\\"}" | grep -E '^(HTTP|RateLimit:|Retry-After)' | tr -d '\\r' | paste -sd '|' -; done</code></pre>
<div class="out">HTTP/1.1 201 Created|RateLimit: "report";r=1;t=40
HTTP/1.1 201 Created|RateLimit: "report";r=0;t=60
HTTP/1.1 429 Too Many Requests|RateLimit: "report";r=0;t=20|Retry-After: 20</div>
<p>Chỉ hai lần 201 trước khi 429: báo hỏng ở bước 1 đã dùng một trong ba token, còn lần phát lại của nó thì miễn phí.</p>
<pre><code class="language-bash">curl -si http://localhost:4000/v2/issues/iss_1 | grep -E '^(HTTP|ETag)'</code></pre>
<div class="out">HTTP/1.1 200 OK
ETag: "iss_1-v1"</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/issues/iss_1/resolve \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'If-Match: "iss_1-v1"' \\
  --json '{"resolution":"Đã vệ sinh quạt"}' | jq -c '{id, status, resolution}'</code></pre>
<div class="out">{"id":"iss_1","status":"RESOLVED","resolution":"Đã vệ sinh quạt"}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/issues/iss_1/resolve \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'If-Match: "iss_1-v1"' \\
  -H 'Accept-Language: en' \\
  --json '{"resolution":"Thay quạt mới"}' | jq -c '{status, code, currentETag}'</code></pre>
<div class="out">{"status":412,"code":"PRECONDITION_FAILED","currentETag":"\\"iss_1-v2\\""}</div>
<pre><code class="language-bash">curl -si http://localhost:4000/v2/issues/iss_1 \\
  -H 'If-None-Match: "iss_1-v2"' | grep -E '^(HTTP|ETag)'</code></pre>
<div class="out">HTTP/1.1 304 Not Modified
ETag: "iss_1-v2"</div>
</div>
`,
    },
    /* ─────────────────────────── 5.6 Quiz (bài MỚI) ─────────────────────────── */
    {
      title: '5.6 — Chapter 5 check: reliability|||5.6 — Kiểm tra Chương 5: độ tin cậy',
      slug: 'api-5-6-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống về mất response, idempotency key, thử lại, jitter, xô token, trust proxy, ETag và 412; mỗi câu có giải thích.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Check</span>
<h2>Chapter 5 check: reliability</h2>
<p class="lead">Ten situations from LabFlow’s lost responses, slow answers, outages, rate limits and concurrent edits. Each explanation says why the right answer is right and why the most tempting wrong answer is wrong. Aim for 7/10.</p>
<h3>Self-check before you start</h3>
<ul>
  <li>I can explain why a lost response makes a blind POST retry dangerous, and how an idempotency key fixes it.</li>
  <li>I can write a client with a timeout, backoff, jitter and Retry-After — and say what it must not retry.</li>
  <li>I can build a token bucket with RateLimit headers and set <code>trust proxy</code> correctly.</li>
  <li>I can prevent lost updates with ETag, If-Match and 412.</li>
  <li>My Lab 5 creates exactly one issue after a lost response.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Kiểm tra</span>
<h2>Kiểm tra Chương 5: độ tin cậy</h2>
<p class="lead">Mười tình huống từ các lần mất response, trả lời chậm, sự cố, giới hạn tần suất và sửa đồng thời của LabFlow. Mỗi phần giải thích nói vì sao đáp án đúng là đúng và vì sao phương án hấp dẫn nhất lại sai. Nhắm 7/10.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
  <li>Tôi giải thích được vì sao mất response làm việc gửi lại POST mù quáng trở nên nguy hiểm, và idempotency key sửa nó thế nào.</li>
  <li>Tôi viết được client có timeout, lùi dần, jitter và Retry-After — và nói được nó không được thử lại cái gì.</li>
  <li>Tôi dựng được xô token với header RateLimit và đặt đúng <code>trust proxy</code>.</li>
  <li>Tôi chống được mất cập nhật bằng ETag, If-Match và 412.</li>
  <li>Lab 5 của tôi tạo đúng một báo hỏng sau khi mất response.</li>
</ul>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: "The first POST /v2/bookings ended with “curl: (52) Empty reply from server”. What do you know about the booking?|||POST /v2/bookings đầu tiên kết thúc bằng “curl: (52) Empty reply from server”. Bạn biết gì về lượt đặt?",
            options: [
              "Nothing for sure — it may have been created before the connection was cut; in LabFlow it was (bk_9)|||Không chắc gì cả — nó có thể đã được tạo trước khi kết nối bị cắt; ở LabFlow nó đã được tạo (bk_9)",
              "It was not created, because the client got no 201|||Chưa được tạo, vì client không nhận được 201",
              "It was created twice|||Đã được tạo hai lần",
              "The server rolled it back automatically|||Server đã tự động huỷ nó",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: A missing response says nothing about whether the work happened. LabFlow’s chaos switch created bk_9 and then cut the connection (lesson 5.1).|||VI: Không có response thì chẳng nói được việc đã xảy ra hay chưa. Công tắc chaos của LabFlow tạo bk_9 rồi mới cắt kết nối (bài 5.1).",
          },
          {
            question: "The retry WITHOUT a key returned 409 BOOKING_CONFLICT with bk_9. Why is that misleading?|||Lần thử lại KHÔNG có khoá trả 409 BOOKING_CONFLICT với bk_9. Vì sao điều đó gây hiểu nhầm?",
            options: [
              "The slot is “taken” by the user’s own booking from the lost attempt|||Ca đó “đã có người đặt” chính là lượt đặt của người dùng từ lần bị mất",
              "409 is the wrong status for any conflict|||409 là mã sai cho mọi xung đột",
              "bk_9 belongs to another student|||bk_9 thuộc về một sinh viên khác",
              "The server should have answered 500|||Server lẽ ra phải trả 500",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: A business rule caught the duplicate, with a message that tells An her room is taken — by herself. Endpoints without such a rule simply do the work twice.|||VI: Một luật nghiệp vụ bắt được bản trùng, với thông báo nói phòng của An đã bị đặt — bởi chính cô. Endpoint không có luật như vậy thì đơn giản là làm hai lần.",
          },
          {
            question: "Same Idempotency-Key, different body. What does LabFlow (and draft-08) answer?|||Cùng Idempotency-Key, khác body. LabFlow (và draft-08) trả gì?",
            options: [
              "201 with the stored result of the first request|||201 với kết quả đã lưu của request đầu",
              "422 — the key belongs to another request|||422 — khoá thuộc về một request khác",
              "409 — a request is in progress|||409 — có request đang chạy",
              "400 — the key is missing|||400 — thiếu khoá",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: The fingerprint differs, so replaying would return the wrong result. 409 is for a request with the same key still running; 400 for a missing required key.|||VI: Dấu vân tay khác nhau, phát lại sẽ trả kết quả sai. 409 dành cho request cùng khoá còn đang chạy; 400 cho khoá bắt buộc bị thiếu.",
          },
          {
            question: "When should a client generate a new idempotency key?|||Khi nào client tạo idempotency key mới?",
            options: [
              "Before every HTTP attempt|||Trước mỗi lần gửi HTTP",
              "Once per app start|||Một lần mỗi khi mở app",
              "Once per user intention (one tap of “Book”), reused for all its retries|||Một lần cho mỗi ý định của người dùng (một lần bấm “Đặt”), dùng lại cho mọi lần thử lại",
              "Only after a 5xx response|||Chỉ sau một response 5xx",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: A new key per attempt turns every retry into a new request — exactly what keys exist to prevent (lesson 5.1).|||VI: Mỗi lần gửi một khoá mới biến mọi lần thử lại thành request mới — đúng thứ khoá sinh ra để ngăn (bài 5.1).",
          },
          {
            question: "Which response should fetchWithRetry NOT retry?|||fetchWithRetry KHÔNG được thử lại response nào?",
            options: [
              "503 Service Unavailable|||503 Service Unavailable",
              "A timeout on a GET|||Hết giờ với một GET",
              "429 with Retry-After: 12|||429 kèm Retry-After: 12",
              "422 Unprocessable Content|||422 Unprocessable Content",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: 422 means the request itself is wrong; sending it again fails the same way. Timeouts, 429 and 503 are transient (lesson 5.2).|||VI: 422 nghĩa là chính request sai; gửi lại thì hỏng y như cũ. Hết giờ, 429 và 503 là lỗi tạm thời (bài 5.2).",
          },
          {
            question: "50 clients after an outage: exponential backoff WITHOUT jitter took 16.3 s, with full jitter 4.0 s. Why?|||50 client sau sự cố: lùi dần KHÔNG jitter mất 16,3 s, có full jitter mất 4,0 s. Vì sao?",
            options: [
              "Without jitter the clients stay synchronised, every wave hits the capacity limit together|||Không jitter thì các client vẫn đồng bộ, đợt nào cũng cùng đụng trần năng lực",
              "Jitter makes each request faster on the server|||Jitter làm mỗi request chạy nhanh hơn trên server",
              "Backoff without jitter sends fewer requests, so it is slower|||Lùi dần không jitter gửi ít request hơn nên chậm hơn",
              "The server prefers random clients|||Server ưu tiên client ngẫu nhiên",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: The histogram showed bursts of 50 with doubling gaps; jitter spread the retries (34, 18, 13 … per 100 ms) under the 10-per-100 ms capacity (lesson 5.2).|||VI: Biểu đồ cho thấy từng đợt 50 với khoảng trống gấp đôi; jitter rải các lần thử lại (34, 18, 13 … mỗi 100 ms) dưới năng lực 10 request mỗi 100 ms (bài 5.2).",
          },
          {
            question: "Lan’s 6th booking within a minute returned 429 with Retry-After: 12. Where does 12 come from?|||Lượt đặt thứ 6 trong một phút của cô Lan trả 429 kèm Retry-After: 12. Số 12 từ đâu ra?",
            options: [
              "The bucket refills 5 tokens per 60 s — one token every 12 s|||Xô rót lại 5 token mỗi 60 giây — cứ 12 giây một token",
              "It is a fixed penalty for every 429|||Đó là án phạt cố định cho mọi 429",
              "The server is 12 seconds behind|||Server chậm 12 giây",
              "Express adds it by default|||Express tự thêm vào",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: Token bucket with capacity 5 and window 60 s: perSec = 5/60, waiting for one token takes 12 s (lesson 5.3).|||VI: Xô token sức chứa 5, cửa sổ 60 giây: tốc độ 5/60 mỗi giây, chờ một token mất 12 giây (bài 5.3).",
          },
          {
            question: "Behind one nginx, which trust proxy setting gives correct, non-spoofable client IPs?|||Sau một nginx, thiết lập trust proxy nào cho địa chỉ client đúng và không giả được?",
            options: [
              "true — trust the whole X-Forwarded-For|||true — tin cả X-Forwarded-For",
              "false — never trust the header|||false — không bao giờ tin header",
              "1 — trust exactly one hop, our own proxy|||1 — tin đúng một chặng, là proxy của mình",
              "'loopback' plus true|||'loopback' cộng true",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: Measured: false ⇒ everyone shares the proxy’s bucket; true ⇒ the client-written leftmost entry is believed (8/8 spoofed requests passed); 1 ⇒ the address nginx appended (lesson 5.3).|||VI: Đã đo: false ⇒ mọi người chung xô của proxy; true ⇒ tin mục ngoài cùng trái do client viết (8/8 request giả lọt); 1 ⇒ địa chỉ nginx nối thêm (bài 5.3).",
          },
          {
            question: "The phone saves dev_3 with If-Match: \"dev_3-v1\" after the laptop already saved v2. LabFlow answers …|||Điện thoại lưu dev_3 với If-Match: \"dev_3-v1\" sau khi laptop đã lưu v2. LabFlow trả …",
            options: [
              "200 and the phone’s changes win|||200 và thay đổi của điện thoại thắng",
              "409 Conflict with both versions merged|||409 Conflict với hai phiên bản đã gộp",
              "428 Precondition Required|||428 Precondition Required",
              "412 Precondition Failed, nothing changed, currentETag \"dev_3-v2\"|||412 Precondition Failed, không đổi gì, currentETag \"dev_3-v2\"",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: The precondition (current tag = v1) is false, so the write is refused and the record keeps the laptop’s note. 428 is for a missing If-Match where one is required (lesson 5.4).|||VI: Điều kiện (nhãn hiện tại = v1) sai, nên lần ghi bị từ chối và bản ghi giữ ghi chú của laptop. 428 dành cho trường hợp thiếu If-Match ở nơi bắt buộc (bài 5.4).",
          },
          {
            question: "Why does LabFlow keep If-Match OPTIONAL on PATCH /v2/devices/:id?|||Vì sao LabFlow để If-Match là TUỲ CHỌN trên PATCH /v2/devices/:id?",
            options: [
              "Optimistic locking is only a recommendation in HTTP|||Khoá lạc quan chỉ là khuyến nghị trong HTTP",
              "Requiring it would break existing v1/v2 clients that never sent it|||Bắt buộc nó sẽ làm vỡ các client v1/v2 đang có chưa từng gửi nó",
              "ETags only work for GET|||ETag chỉ dùng được cho GET",
              "Express cannot answer 428|||Express không trả được 428",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: A new required header is a breaking change (lesson 4.1); new endpoints or a future v3 can require it from the start.|||VI: Header bắt buộc mới là thay đổi phá vỡ (bài 4.1); endpoint mới hay một v3 sau này có thể bắt buộc ngay từ đầu.",
          },
        ],
      },
    },
  ],
};
