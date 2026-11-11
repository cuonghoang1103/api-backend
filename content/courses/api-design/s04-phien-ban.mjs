/**
 * API Design — Chương 4: Phiên bản và tiến hoá API (soạn chi tiết 01/11/2026).
 * Output CHẠY THẬT: Node v22.23.3, Express 5.3.0, Zod 4.6.7, curl 8.7.1, jq 1.7.1 — client cũ không sửa chạy trên server đổi 5 kiểu, /v1 + /v2, Deprecation (RFC 9745) / Sunset (RFC 8594), app di động giả lập, test hợp đồng node:test.
 * Mã cuối chương = lời giải Lab 4 (bài 4.5). Slide: api-04-1 … api-04-4 + api-lab-4; giảng EN/VI ở ./giang/.
 * Tệp được sinh một lần bằng script ngoài repo — từ nay SỬA THẲNG tệp này, giữ luật thoát ký tự (_HOP-DONG.md mục 3).
 * GIỮ slug cũ api-4-1-thay-doi, api-4-2-chien-luoc, api-4-3-deprecation, api-4-4-app-di-dong và title chương.
 */

import G041 from './giang/api-04-1.mjs';
import G042 from './giang/api-04-2.mjs';
import G043 from './giang/api-04-3.mjs';
import G044 from './giang/api-04-4.mjs';
import GL4 from './giang/api-lab-4.mjs';

export default {
  title: 'Chapter 4 — Versioning and evolution|||Chương 4 — Versioning và tiến hoá API',
  description: 'Thí nghiệm một client cũ trên năm thay đổi (vỡ lặng lẽ, sập, 400), phân loại thay đổi phá vỡ, /v1 và /v2 dùng chung một router, header Deprecation/Sunset + 410 + báo cáo ai còn dùng, app di động không cập nhật (cấu hình từ xa, chốt phiên bản, giấu giá trị enum mới); lab có test hợp đồng và rubric, quiz 10 câu.',
  lessons: [
    /* ─────────────────────────── 4.1 ─────────────────────────── */
    {
      title: '4.1 — Breaking vs non-breaking changes: one old client, five changes, measured|||4.1 — Thay đổi phá vỡ và không phá vỡ: một client cũ, năm thay đổi, đo thật',
      slug: 'api-4-1-thay-doi',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Chạy một client không bao giờ cập nhật trên năm thay đổi ở server: thêm trường, đổi tên, thêm giá trị enum, đổi kiểu, thêm trường bắt buộc; luật tolerant reader và định luật Hyrum.',
      content: `${G041}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Breaking vs non-breaking changes</h2>
<p class="lead">LabFlow now has clients you do not control: a mobile app on hundreds of phones, a script a lab manager wrote last year, a student’s project. From the day the first one ships, every change to the API is a question: <em>will something that works today stop working tomorrow?</em> This lesson answers it with an experiment, not a rule list: one old client, five changes to the server, and what really happened.</p>

<div class="callout ok">
<p><strong>After Chapter 4 you can:</strong></p>
<ul>
  <li>tell breaking from non-breaking changes, measured on a client that never updates;</li>
  <li>version an API with one set of routes and several representations;</li>
  <li>retire an old version with Deprecation, Sunset and 410;</li>
  <li>keep mobile apps that cannot update working.</li>
</ul>
<p><strong>Why it matters:</strong> APIs live longer than the code behind them; changing one without breaking its clients is what separates a hobby project from a product.</p>
</div>

<h3>Everyday example: the timetable on the wall</h3>
<p>The faculty prints the room timetable and sticks it on every door. Adding a new column “projector: yes/no” does not hurt anyone who reads the old columns. Renaming “Room” to “Venue”, writing times as “2 pm” instead of “14:00”, or adding a new kind of slot nobody has a colour for — every reader who learnt the old format now misreads it, and nobody tells you. An API is that printed timetable: <strong>a contract that other people’s code reads without asking you</strong>.</p>

<h3>The experiment: one client that never updates</h3>
<p><code>client-v1.mjs</code> was written against LabFlow at the end of Chapter 3 and is never changed again — exactly like an app version that some users never update. It lists three bookings with their lab, prints the times in Hanoi time, labels the status, adds up the seats and creates one booking:</p>
<pre><code class="language-javascript">// client-v1.mjs — một "app" viết theo hợp đồng cuối Chương 3 rồi KHÔNG BAO GIỜ được cập nhật nữa
const BASE = process.env.BASE ?? 'http://localhost:4000';
const H = { Authorization: 'Bearer tok_lan' };
const LABEL = { PENDING: 'Chờ duyệt', CANCELLED: 'Đã huỷ' };
const label = (s) =&gt; { if (!(s in LABEL)) throw new Error(&#96;trạng thái lạ: \${s}&#96;); return LABEL[s]; };
const hhmm = (iso) =&gt; new Date(iso).toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit' });

const res = await fetch(&#96;\${BASE}/bookings?limit=3&amp;include=lab&#96;, { headers: H });
const page = await res.json();
for (const b of page.data) console.log(&#96;\${b.id}  \${b.lab.code}  \${hhmm(b.startAt)}–\${hhmm(b.endAt)}  \${label(b.status)}&#96;);
console.log(&#96;tổng số chỗ của 3 phòng: \${page.data.reduce((sum, b) =&gt; sum + b.lab.capacity, 0)}&#96;);

const r = await fetch(&#96;\${BASE}/bookings&#96;, {
  method: 'POST', headers: { ...H, 'Content-Type': 'application/json' },
  body: JSON.stringify({ labId: 'lab_3', startAt: '2027-01-04T08:00:00+07:00', endAt: '2027-01-04T10:00:00+07:00' }),
});
const created = await r.json();
console.log(r.ok ? &#96;đặt được \${created.id}&#96; : &#96;KHÔNG đặt được: \${r.status} \${created.code}&#96;);</code></pre>
<p>The server gets an environment switch <code>CHANGE=…</code> that simulates five changes a developer might make in one afternoon, each “harmless” from the server’s point of view:</p>
<pre><code class="language-javascript">// views.js (thí nghiệm bài 4.1 — KHÔNG phải mã thật của LabFlow)
const CHANGE = process.env.CHANGE ?? '';
export const toLab = (l) =&gt; ({
  id: l.id, code: l.code, name: l.name, building: l.building,
  capacity: CHANGE === 'type' ? String(l.capacity) : l.capacity,           // type: số ⇒ chuỗi
  ...(CHANGE === 'add' &amp;&amp; { floor: Number(l.code.split('-')[1][0]) }),      // add: thêm trường mới
});
export const toBooking = (b) =&gt; ({
  id: b.id, labId: b.labId, userId: b.userId,
  ...(CHANGE === 'rename' ? { start: b.startAt, end: b.endAt } : { startAt: b.startAt, endAt: b.endAt }),
  purpose: b.purpose ?? null,
  status: CHANGE === 'enum' &amp;&amp; b.id === 'bk_8' ? 'CHECKED_IN' : b.status,   // enum: thêm một trạng thái
  createdAt: b.createdAt, cancelledAt: b.cancelledAt ?? null,
  ...(CHANGE === 'add' &amp;&amp; { checkedInAt: null }),
});
// schemas.js — required: BookingCreate thêm attendees: z.number().int().min(1).max(60) BẮT BUỘC</code></pre>
<p>Each run restarts the server with <code>SEED_BOOKINGS=8 CHANGE=…</code> and then runs the same unchanged client.</p>

<h3>The results</h3>
<p><strong>No change</strong> — the baseline:</p>
<pre><code class="language-bash">node client-v1.mjs</code></pre>
<div class="out">bk_8  AL-305  11:00–13:00  Chờ duyệt
bk_7  AL-201  11:00–13:00  Đã huỷ
bk_6  BE-102  09:00–11:00  Chờ duyệt
tổng số chỗ của 3 phòng: 94
đặt được bk_9</div>
<p><strong>add</strong> — a new member <code>floor</code> on labs and <code>checkedInAt</code> on bookings. The client never reads them; output identical:</p>
<pre><code class="language-bash">node client-v1.mjs</code></pre>
<div class="out">bk_8  AL-305  11:00–13:00  Chờ duyệt
bk_7  AL-201  11:00–13:00  Đã huỷ
bk_6  BE-102  09:00–11:00  Chờ duyệt
tổng số chỗ của 3 phòng: 94
đặt được bk_9</div>
<p><strong>rename</strong> — <code>startAt</code>/<code>endAt</code> became <code>start</code>/<code>end</code>. No error, no crash: the app now shows <em>Invalid Date</em> to every user, and its error tracking stays silent because nothing threw:</p>
<pre><code class="language-bash">node client-v1.mjs</code></pre>
<div class="out">bk_8  AL-305  Invalid Date–Invalid Date  Chờ duyệt
bk_7  AL-201  Invalid Date–Invalid Date  Đã huỷ
bk_6  BE-102  Invalid Date–Invalid Date  Chờ duyệt
tổng số chỗ của 3 phòng: 94
đặt được bk_9</div>
<p><strong>enum</strong> — one booking gets a new status <code>CHECKED_IN</code>. The client’s label function was written “correctly” (refuse unknown values) and the whole screen crashes:</p>
<pre><code class="language-bash">node client-v1.mjs</code></pre>
<div class="out">file:///…/client-v1.mjs:5
const label = (s) =&gt; { if (!(s in LABEL)) throw new Error(&#96;trạng thái lạ: \${s}&#96;); return LABEL[s]; };
                                                ^

Error: trạng thái lạ: CHECKED_IN
    at label (file:///…/client-v1.mjs:5:49)
    at file:///…/client-v1.mjs:10:104

Node.js v22.23.3</div>
<p><strong>type</strong> — <code>capacity</code> went from the number <code>30</code> to the string <code>"30"</code>. JavaScript happily adds strings: 94 seats became <code>0243040</code> (“0” + “24” + “30” + “40”). Silent again:</p>
<pre><code class="language-bash">node client-v1.mjs</code></pre>
<div class="out">bk_8  AL-305  11:00–13:00  Chờ duyệt
bk_7  AL-201  11:00–13:00  Đã huỷ
bk_6  BE-102  09:00–11:00  Chờ duyệt
tổng số chỗ của 3 phòng: 0243040
đặt được bk_9</div>
<p><strong>required</strong> — <code>POST /bookings</code> now requires <code>attendees</code>. Reading still works; every booking attempt from the old app fails:</p>
<pre><code class="language-bash">node client-v1.mjs</code></pre>
<div class="out">bk_8  AL-305  11:00–13:00  Chờ duyệt
bk_7  AL-201  11:00–13:00  Đã huỷ
bk_6  BE-102  09:00–11:00  Chờ duyệt
tổng số chỗ của 3 phòng: 94
KHÔNG đặt được: 400 VALIDATION_FAILED</div>

<h3>“Adding a member is safe” — for whom?</h3>
<p>Adding <code>floor</code> did not hurt <code>client-v1.mjs</code> because it ignores members it does not know. A client that validates responses strictly reacts differently:</p>
<pre><code class="language-javascript">// client-strict.mjs — app kiểm response bằng strictObject: "server gửi thừa một trường cũng là lỗi"
import { z } from 'zod';
const Lab = z.strictObject({ id: z.string(), code: z.string(), name: z.string(), building: z.string(), capacity: z.number() });
const res = await fetch('http://localhost:4000/labs/lab_1');
const r = Lab.safeParse(await res.json());
console.log(r.success ? 'lab_1 hợp lệ' : &#96;app báo lỗi: \${r.error.issues.map((i) =&gt; &#96;\${i.code} \${i.keys ?? i.path}&#96;).join(', ')}&#96;);</code></pre>
<pre><code class="language-bash">node client-strict.mjs</code></pre>
<div class="out">lab_1 hợp lệ</div>
<pre><code class="language-bash">node client-strict.mjs</code></pre>
<div class="out">app báo lỗi: unrecognized_keys floor</div>
<p>So “adding is non-breaking” is only true if your contract <strong>says so</strong>. LabFlow’s documentation now states it explicitly: <em>clients must ignore members they do not know; new members may appear at any time</em> — the <strong>tolerant reader</strong> rule. Strict validation belongs on the server’s <em>input</em> (Chapter 2), not on a client’s view of the server’s <em>output</em>.</p>

<h3>The classification</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Safe</span><span class="lz-lnote">new optional request field · new response field · new endpoint</span></div>
  <div class="lz-layer"><span class="lz-lname">Careful</span><span class="lz-lnote">new enum value in a response — breaks clients that crash on unknown values</span></div>
  <div class="lz-layer"><span class="lz-lname">Breaking</span><span class="lz-lnote">remove or rename a field · change a type or format · new required field · change a status code</span></div>
</div>
<table>
  <thead><tr><th>Change</th><th>Usually</th><th>Why</th></tr></thead>
  <tbody>
    <tr><td>Add an optional response member, a new endpoint, a new optional request field</td><td>non-breaking</td><td>old clients do not send or read it (needs the tolerant-reader rule)</td></tr>
    <tr><td>Remove or rename a member, a parameter, an endpoint</td><td><strong>breaking</strong></td><td>old code reads <code>undefined</code> — often silently</td></tr>
    <tr><td>Change a type or format (number → string, ISO → epoch, money as float)</td><td><strong>breaking</strong></td><td>old code computes wrong results</td></tr>
    <tr><td>Add an enum value in a <em>response</em></td><td><strong>breaking</strong> for strict clients</td><td>exhaustive switches crash; see 4.4 for the way out</td></tr>
    <tr><td>Make an optional request field required, tighten validation</td><td><strong>breaking</strong></td><td>yesterday’s valid requests are refused</td></tr>
    <tr><td>Loosen validation (accept more)</td><td>non-breaking</td><td>everything valid before is still valid</td></tr>
    <tr><td>Change a status code, an error <code>code</code>, a default (<code>limit</code> 20 → 10), the order of a list</td><td><strong>breaking</strong></td><td>clients branch on them — they are contract too (Chapter 2, 3)</td></tr>
  </tbody>
</table>
<p>The last row surprises people. <strong>Hyrum’s law</strong>: with enough users, every observable behaviour of your API will be depended on by somebody — including the ones you never documented. That is why LabFlow fixed its orders, defaults and error codes in Chapters 2–3: they are part of what you promise.</p>

<a class="link-card lien-ket-cheo" href="/courses/software-requirements/learn?lessonSlug=swr302-7-1-change-control" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">You met this in SWR302 — lesson 7.1: baseline, versioning and change control</span><span class="lc-sub">If you took SWR302 on Academy, the idea is the same at another level. Same: once a version is agreed (a baseline), changes go through a controlled process with an impact analysis. Different: SWR302 changes requirements documents; here the “baseline” is a running API and the people affected are other programs. This lesson adds: a real old client, five changes measured, and the rule that every observable behaviour is contract. Not taken SWR302? This lesson stands on its own.</span></span>
  <span class="lc-cta">OPEN SWR302 LESSON →</span>
</a>

<div class="pitfall"><p><strong>Trap — “nobody uses that field”.</strong> You cannot know who reads your API by reading your own code. Measure (lesson 4.3) before you remove anything.</p></div>
<div class="pitfall"><p><strong>Trap — trusting the error tracker.</strong> Three of the five breaks above threw nothing. Silent breaks are found by contract tests (Lab 4) and by reading your own outputs with an old client, not by waiting for crash reports.</p></div>

<h3>In interviews and at work</h3>
<p><strong>“Is adding a field a breaking change?”</strong> Not if the contract requires tolerant readers — say so in the docs. Adding a value to a response enum, or a required request field, is breaking.</p>
<p><strong>“How do you change an API safely?”</strong> Prefer additive changes; when something must break, publish a new version (4.2), keep the old one running, announce the end with headers and dates (4.3), and test the old contract automatically (Lab 4).</p>

<a class="link-card" href="https://google.aip.dev/180" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: Google AIP-180 — Backwards compatibility — read 1 Nov 2026</span><span class="lc-sub">Google’s rules within one major version: additions are allowed, removing or renaming (“remove and add”) and changing types are not, new required request fields are not; new enum values in responses need caution.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>
<a class="link-card" href="https://www.hyrumslaw.com/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: Hyrum’s Law — read 1 Nov 2026</span><span class="lc-sub">“With a sufficient number of users of an API, it does not matter what you promise in the contract: all observable behaviors of your system will be depended on by somebody.”</span></span>
  <span class="lc-cta">OPEN →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/typescript/learn?lessonSlug=typescript-2-3-kieu-dac-biet" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Make the compiler find every switch — TypeScript 2.3: never and exhaustive checks</span><span class="lc-sub">Same: a new status value breaks code that handles “every” case. Different: when the value comes from your own code, a never check makes tsc list each switch to update before anything runs (TS2322 names LAB_CLOSED); values from the network still need this lesson’s tolerant runtime default.</span></span>
  <span class="lc-cta">OPEN TYPESCRIPT LESSON →</span>
</a>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
  <li>Reproduce the six runs. Add a seventh change yourself: <code>limit</code> default 20 → 5. Write a client that breaks silently because of it.</li>
  <li>Change <code>client-v1.mjs</code> into a tolerant reader: unknown status ⇒ “Trạng thái khác”, missing time ⇒ “—”. Rerun <code>enum</code> and <code>rename</code>.</li>
  <li>Classify these LabFlow changes: add <code>GET /labs/{id}/schedule</code>; return 422 instead of 400 for a bad time range; accept <code>purpose</code> up to 500 characters instead of 200; rename the error code <code>BOOKING_CONFLICT</code>.</li>
</ol>
<p><strong>Done when:</strong> you can say for each change whether it breaks, which kind of client it breaks, and whether the break is loud or silent.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Breaking change</span><span class="v">A change after which a correct existing client stops working correctly.</span></div>
  <div class="kv"><span class="k">Additive change</span><span class="v">Only adds (members, endpoints, optional fields); the safest kind.</span></div>
  <div class="kv"><span class="k">Tolerant reader</span><span class="v">A client that ignores unknown members and handles unknown values without crashing.</span></div>
  <div class="kv"><span class="k">Silent break</span><span class="v">A break that throws no error but produces wrong output (Invalid Date, 0243040).</span></div>
  <div class="kv"><span class="k">Hyrum’s law</span><span class="v">With enough users, every observable behaviour is depended on by someone.</span></div>
  <div class="kv"><span class="k">Contract</span><span class="v">Everything clients can observe: members, types, codes, defaults, order.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Measured on one unchanged client: add — fine; rename — Invalid Date; new enum value — crash; type change — 0243040; new required field — 400.</li>
  <li>Half of the breaks were silent: no exception, wrong screen.</li>
  <li>“Adding is safe” only with a documented tolerant-reader rule.</li>
  <li>Status codes, error codes, defaults and order are contract too (Hyrum’s law).</li>
  <li>Prefer additive changes; for the rest you need versions (4.2) and a retirement plan (4.3).</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Thay đổi phá vỡ và không phá vỡ</h2>
<p class="lead">LabFlow giờ đã có những client bạn không kiểm soát: một app di động trên hàng trăm điện thoại, một script cô quản lý lab viết năm ngoái, đồ án của một bạn sinh viên. Từ ngày client đầu tiên phát hành, mỗi thay đổi của API là một câu hỏi: <em>thứ đang chạy hôm nay có ngừng chạy vào ngày mai không?</em> Bài này trả lời bằng một thí nghiệm chứ không bằng danh sách luật: một client cũ, năm thay đổi ở server, và chuyện gì đã thật sự xảy ra.</p>

<div class="callout ok">
<p><strong>Học xong Chương 4 bạn làm được:</strong></p>
<ul>
  <li>phân biệt thay đổi phá vỡ và không phá vỡ, đo trên một client không bao giờ cập nhật;</li>
  <li>đánh phiên bản API với một bộ route và nhiều cách biểu diễn;</li>
  <li>khai tử phiên bản cũ bằng Deprecation, Sunset và 410;</li>
  <li>giữ cho app di động không cập nhật được vẫn chạy.</li>
</ul>
<p><strong>Vì sao đáng học:</strong> API sống lâu hơn code đằng sau nó; đổi nó mà không làm gãy client là thứ phân biệt đồ án cá nhân với một sản phẩm.</p>
</div>

<h3>Ví dụ đời thường: thời khoá biểu dán trên cửa</h3>
<p>Khoa in thời khoá biểu phòng học và dán lên mọi cửa. Thêm cột mới “máy chiếu: có/không” không làm ai đọc cột cũ bị ảnh hưởng. Còn đổi “Phòng” thành “Địa điểm”, viết giờ “2 pm” thay vì “14:00”, hay thêm một loại ca chưa ai có màu để tô — mọi người đã quen định dạng cũ giờ đọc sai, và không ai báo cho bạn. API chính là tờ thời khoá biểu đó: <strong>một hợp đồng mà code của người khác đọc mà không hỏi bạn</strong>.</p>

<h3>Thí nghiệm: một client không bao giờ cập nhật</h3>
<p><code>client-v1.mjs</code> (client = chương trình gọi API) được viết theo LabFlow cuối Chương 3 rồi không bao giờ sửa nữa — đúng như một bản app mà vài người dùng không bao giờ cập nhật. Nó liệt kê ba lượt đặt kèm phòng, in giờ theo giờ Hà Nội, ghi nhãn trạng thái, cộng số chỗ và tạo một lượt đặt:</p>
<pre><code class="language-javascript">// client-v1.mjs — một "app" viết theo hợp đồng cuối Chương 3 rồi KHÔNG BAO GIỜ được cập nhật nữa
const BASE = process.env.BASE ?? 'http://localhost:4000';
const H = { Authorization: 'Bearer tok_lan' };
const LABEL = { PENDING: 'Chờ duyệt', CANCELLED: 'Đã huỷ' };
const label = (s) =&gt; { if (!(s in LABEL)) throw new Error(&#96;trạng thái lạ: \${s}&#96;); return LABEL[s]; };
const hhmm = (iso) =&gt; new Date(iso).toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit' });

const res = await fetch(&#96;\${BASE}/bookings?limit=3&amp;include=lab&#96;, { headers: H });
const page = await res.json();
for (const b of page.data) console.log(&#96;\${b.id}  \${b.lab.code}  \${hhmm(b.startAt)}–\${hhmm(b.endAt)}  \${label(b.status)}&#96;);
console.log(&#96;tổng số chỗ của 3 phòng: \${page.data.reduce((sum, b) =&gt; sum + b.lab.capacity, 0)}&#96;);

const r = await fetch(&#96;\${BASE}/bookings&#96;, {
  method: 'POST', headers: { ...H, 'Content-Type': 'application/json' },
  body: JSON.stringify({ labId: 'lab_3', startAt: '2027-01-04T08:00:00+07:00', endAt: '2027-01-04T10:00:00+07:00' }),
});
const created = await r.json();
console.log(r.ok ? &#96;đặt được \${created.id}&#96; : &#96;KHÔNG đặt được: \${r.status} \${created.code}&#96;);</code></pre>
<p>Server có thêm công tắc môi trường <code>CHANGE=…</code> giả lập năm thay đổi mà một lập trình viên có thể làm trong một buổi chiều, cái nào nhìn từ phía server cũng “vô hại”:</p>
<pre><code class="language-javascript">// views.js (thí nghiệm bài 4.1 — KHÔNG phải mã thật của LabFlow)
const CHANGE = process.env.CHANGE ?? '';
export const toLab = (l) =&gt; ({
  id: l.id, code: l.code, name: l.name, building: l.building,
  capacity: CHANGE === 'type' ? String(l.capacity) : l.capacity,           // type: số ⇒ chuỗi
  ...(CHANGE === 'add' &amp;&amp; { floor: Number(l.code.split('-')[1][0]) }),      // add: thêm trường mới
});
export const toBooking = (b) =&gt; ({
  id: b.id, labId: b.labId, userId: b.userId,
  ...(CHANGE === 'rename' ? { start: b.startAt, end: b.endAt } : { startAt: b.startAt, endAt: b.endAt }),
  purpose: b.purpose ?? null,
  status: CHANGE === 'enum' &amp;&amp; b.id === 'bk_8' ? 'CHECKED_IN' : b.status,   // enum: thêm một trạng thái
  createdAt: b.createdAt, cancelledAt: b.cancelledAt ?? null,
  ...(CHANGE === 'add' &amp;&amp; { checkedInAt: null }),
});
// schemas.js — required: BookingCreate thêm attendees: z.number().int().min(1).max(60) BẮT BUỘC</code></pre>
<p>Mỗi lần chạy khởi động lại server với <code>SEED_BOOKINGS=8 CHANGE=…</code> rồi chạy đúng client cũ, không sửa gì.</p>

<h3>Kết quả</h3>
<p><strong>Không đổi gì</strong> — mốc so sánh:</p>
<pre><code class="language-bash">node client-v1.mjs</code></pre>
<div class="out">bk_8  AL-305  11:00–13:00  Chờ duyệt
bk_7  AL-201  11:00–13:00  Đã huỷ
bk_6  BE-102  09:00–11:00  Chờ duyệt
tổng số chỗ của 3 phòng: 94
đặt được bk_9</div>
<p><strong>add</strong> — thêm trường <code>floor</code> cho phòng và <code>checkedInAt</code> cho lượt đặt. Client không bao giờ đọc chúng; output y hệt:</p>
<pre><code class="language-bash">node client-v1.mjs</code></pre>
<div class="out">bk_8  AL-305  11:00–13:00  Chờ duyệt
bk_7  AL-201  11:00–13:00  Đã huỷ
bk_6  BE-102  09:00–11:00  Chờ duyệt
tổng số chỗ của 3 phòng: 94
đặt được bk_9</div>
<p><strong>rename</strong> — <code>startAt</code>/<code>endAt</code> đổi thành <code>start</code>/<code>end</code>. Không lỗi, không sập: app giờ hiện <em>Invalid Date</em> cho mọi người dùng, còn hệ thống theo dõi lỗi im lặng vì chẳng có gì ném ra:</p>
<pre><code class="language-bash">node client-v1.mjs</code></pre>
<div class="out">bk_8  AL-305  Invalid Date–Invalid Date  Chờ duyệt
bk_7  AL-201  Invalid Date–Invalid Date  Đã huỷ
bk_6  BE-102  Invalid Date–Invalid Date  Chờ duyệt
tổng số chỗ của 3 phòng: 94
đặt được bk_9</div>
<p><strong>enum</strong> — một lượt đặt có trạng thái mới <code>CHECKED_IN</code>. Hàm gắn nhãn của client được viết “đúng sách” (từ chối giá trị lạ) và cả màn hình sập:</p>
<pre><code class="language-bash">node client-v1.mjs</code></pre>
<div class="out">file:///…/client-v1.mjs:5
const label = (s) =&gt; { if (!(s in LABEL)) throw new Error(&#96;trạng thái lạ: \${s}&#96;); return LABEL[s]; };
                                                ^

Error: trạng thái lạ: CHECKED_IN
    at label (file:///…/client-v1.mjs:5:49)
    at file:///…/client-v1.mjs:10:104

Node.js v22.23.3</div>
<p><strong>type</strong> — <code>capacity</code> đổi từ số <code>30</code> sang chuỗi <code>"30"</code>. JavaScript vui vẻ cộng chuỗi: 94 chỗ thành <code>0243040</code> (“0” + “24” + “30” + “40”). Lại im lặng:</p>
<pre><code class="language-bash">node client-v1.mjs</code></pre>
<div class="out">bk_8  AL-305  11:00–13:00  Chờ duyệt
bk_7  AL-201  11:00–13:00  Đã huỷ
bk_6  BE-102  09:00–11:00  Chờ duyệt
tổng số chỗ của 3 phòng: 0243040
đặt được bk_9</div>
<p><strong>required</strong> — <code>POST /bookings</code> giờ bắt buộc <code>attendees</code>. Đọc vẫn chạy; mọi lần đặt phòng từ app cũ đều hỏng:</p>
<pre><code class="language-bash">node client-v1.mjs</code></pre>
<div class="out">bk_8  AL-305  11:00–13:00  Chờ duyệt
bk_7  AL-201  11:00–13:00  Đã huỷ
bk_6  BE-102  09:00–11:00  Chờ duyệt
tổng số chỗ của 3 phòng: 94
KHÔNG đặt được: 400 VALIDATION_FAILED</div>

<h3>“Thêm trường là an toàn” — an toàn với ai?</h3>
<p>Thêm <code>floor</code> không làm hại <code>client-v1.mjs</code> vì nó bỏ qua trường lạ. Một client kiểm response thật chặt thì phản ứng khác:</p>
<pre><code class="language-javascript">// client-strict.mjs — app kiểm response bằng strictObject: "server gửi thừa một trường cũng là lỗi"
import { z } from 'zod';
const Lab = z.strictObject({ id: z.string(), code: z.string(), name: z.string(), building: z.string(), capacity: z.number() });
const res = await fetch('http://localhost:4000/labs/lab_1');
const r = Lab.safeParse(await res.json());
console.log(r.success ? 'lab_1 hợp lệ' : &#96;app báo lỗi: \${r.error.issues.map((i) =&gt; &#96;\${i.code} \${i.keys ?? i.path}&#96;).join(', ')}&#96;);</code></pre>
<pre><code class="language-bash">node client-strict.mjs</code></pre>
<div class="out">lab_1 hợp lệ</div>
<pre><code class="language-bash">node client-strict.mjs</code></pre>
<div class="out">app báo lỗi: unrecognized_keys floor</div>
<p>Vậy “thêm thì không phá” chỉ đúng khi hợp đồng của bạn <strong>nói rõ như thế</strong>. Tài liệu LabFlow từ nay ghi thẳng: <em>client phải bỏ qua trường mình không biết; trường mới có thể xuất hiện bất cứ lúc nào</em> — luật <strong>tolerant reader</strong> (người đọc khoan dung). Kiểm chặt là việc của server với dữ liệu <em>vào</em> (Chương 2), không phải việc client làm với dữ liệu <em>ra</em> của server.</p>

<h3>Bảng phân loại</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">An toàn</span><span class="lz-lnote">trường request tuỳ chọn mới · trường response mới · endpoint mới</span></div>
  <div class="lz-layer"><span class="lz-lname">Cẩn thận</span><span class="lz-lnote">giá trị enum mới trong response — làm gãy client sập khi gặp giá trị lạ</span></div>
  <div class="lz-layer"><span class="lz-lname">Phá vỡ</span><span class="lz-lnote">bỏ hoặc đổi tên trường · đổi kiểu hay định dạng · trường bắt buộc mới · đổi mã trạng thái</span></div>
</div>
<table>
  <thead><tr><th>Thay đổi</th><th>Thường là</th><th>Vì sao</th></tr></thead>
  <tbody>
    <tr><td>Thêm trường tuỳ chọn ở response, endpoint mới, trường tuỳ chọn mới ở request</td><td>không phá</td><td>client cũ không gửi, không đọc nó (cần luật tolerant reader)</td></tr>
    <tr><td>Xoá hoặc đổi tên trường, tham số, endpoint</td><td><strong>phá</strong></td><td>code cũ đọc ra <code>undefined</code> — thường lặng lẽ</td></tr>
    <tr><td>Đổi kiểu hay định dạng (số → chuỗi, ISO → epoch, tiền dạng float)</td><td><strong>phá</strong></td><td>code cũ tính ra kết quả sai</td></tr>
    <tr><td>Thêm giá trị enum ở <em>response</em></td><td><strong>phá</strong> với client chặt</td><td>switch vét cạn sập; cách thoát ở bài 4.4</td></tr>
    <tr><td>Biến trường tuỳ chọn ở request thành bắt buộc, siết kiểm dữ liệu</td><td><strong>phá</strong></td><td>request hợp lệ hôm qua bị từ chối</td></tr>
    <tr><td>Nới kiểm dữ liệu (nhận nhiều hơn)</td><td>không phá</td><td>mọi thứ hợp lệ trước đây vẫn hợp lệ</td></tr>
    <tr><td>Đổi mã trạng thái, <code>code</code> của lỗi, giá trị mặc định (<code>limit</code> 20 → 10), thứ tự danh sách</td><td><strong>phá</strong></td><td>client rẽ nhánh theo chúng — chúng cũng là hợp đồng (Chương 2, 3)</td></tr>
  </tbody>
</table>
<p>Dòng cuối làm nhiều người bất ngờ. <strong>Định luật Hyrum</strong>: khi đủ nhiều người dùng, mọi hành vi quan sát được của API đều có người dựa vào — kể cả những thứ bạn chưa bao giờ ghi trong tài liệu. Vì thế LabFlow đã cố định thứ tự, mặc định và mã lỗi ở Chương 2–3: chúng là một phần lời hứa của bạn.</p>

<a class="link-card lien-ket-cheo" href="/courses/software-requirements/learn?lessonSlug=swr302-7-1-change-control" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Bạn đã gặp ở SWR302 — bài 7.1: baseline, đánh phiên bản và kiểm soát thay đổi</span><span class="lc-sub">Nếu bạn đã học SWR302 ở Academy, ý tưởng là một, chỉ khác tầng. Giống: một khi phiên bản đã được thống nhất (baseline), mọi thay đổi đi qua quy trình có kiểm soát kèm phân tích tác động. Khác: SWR302 thay đổi tài liệu yêu cầu; ở đây “baseline” là một API đang chạy và người bị ảnh hưởng là chương trình của người khác. Bài này thêm: một client cũ thật, năm thay đổi được đo, và luật mọi hành vi quan sát được đều là hợp đồng. Chưa học SWR302? Bài này vẫn tự đứng được.</span></span>
  <span class="lc-cta">MỞ BÀI SWR302 →</span>
</a>

<div class="pitfall"><p><strong>Bẫy — “chẳng ai dùng trường đó đâu”.</strong> Đọc code của chính mình thì không biết được ai đang đọc API của mình. Hãy đo (bài 4.3) trước khi xoá bất cứ thứ gì.</p></div>
<div class="pitfall"><p><strong>Bẫy — tin vào hệ thống báo lỗi.</strong> Ba trong năm lần vỡ ở trên không ném lỗi nào. Vỡ lặng lẽ được tìm ra bằng test hợp đồng (Lab 4) và bằng cách chạy client cũ đọc output của chính mình, không phải bằng cách chờ báo cáo sập.</p></div>

<h3>Khi phỏng vấn và khi đi làm</h3>
<p><strong>“Thêm một trường có phải thay đổi phá vỡ không?”</strong> Không, nếu hợp đồng yêu cầu client đọc khoan dung — và tài liệu phải nói rõ điều đó. Thêm giá trị vào enum của response, hay thêm trường bắt buộc ở request, là phá vỡ.</p>
<p><strong>“Đổi API thế nào cho an toàn?”</strong> Ưu tiên thay đổi chỉ-thêm; khi buộc phải phá thì ra phiên bản mới (4.2), giữ bản cũ chạy, báo ngày kết thúc bằng header và mốc thời gian (4.3), và kiểm hợp đồng cũ tự động (Lab 4).</p>

<a class="link-card" href="https://google.aip.dev/180" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: Google AIP-180 — Backwards compatibility — đọc ngày 1/11/2026</span><span class="lc-sub">Luật của Google trong một phiên bản lớn: được thêm; không được xoá, đổi tên (“xoá rồi thêm”), đổi kiểu, hay thêm trường request bắt buộc; giá trị enum mới trong response cần thận trọng.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<a class="link-card" href="https://www.hyrumslaw.com/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: Định luật Hyrum — đọc ngày 1/11/2026</span><span class="lc-sub">“Đủ nhiều người dùng một API thì bạn hứa gì trong hợp đồng cũng không quan trọng: mọi hành vi quan sát được của hệ thống đều sẽ có người dựa vào.”</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/typescript/learn?lessonSlug=typescript-2-3-kieu-dac-biet" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Bắt trình biên dịch tìm mọi switch — TypeScript 2.3: never và kiểm vét cạn</span><span class="lc-sub">Giống: một giá trị trạng thái mới làm gãy code xử lý “mọi” trường hợp. Khác: khi giá trị đến từ chính code của bạn, phép kiểm never bắt tsc liệt kê từng switch phải sửa trước khi chạy (TS2322 gọi tên LAB_CLOSED); giá trị từ mạng vẫn cần nhánh default khoan dung lúc chạy như bài này.</span></span>
  <span class="lc-cta">MỞ BÀI TYPESCRIPT →</span>
</a>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
  <li>Chạy lại sáu lần thử. Tự thêm thay đổi thứ bảy: mặc định <code>limit</code> 20 → 5. Viết một client vỡ lặng lẽ vì nó.</li>
  <li>Sửa <code>client-v1.mjs</code> thành người đọc khoan dung: trạng thái lạ ⇒ “Trạng thái khác”, thiếu giờ ⇒ “—”. Chạy lại <code>enum</code> và <code>rename</code>.</li>
  <li>Phân loại các thay đổi LabFlow sau: thêm <code>GET /labs/{id}/schedule</code>; trả 422 thay vì 400 khi khoảng giờ sai; cho <code>purpose</code> dài tới 500 ký tự thay vì 200; đổi tên mã lỗi <code>BOOKING_CONFLICT</code>.</li>
</ol>
<p><strong>Xong khi:</strong> với mỗi thay đổi bạn nói được nó có phá không, phá loại client nào, và vỡ ồn ào hay lặng lẽ.</p></div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Breaking change (thay đổi phá vỡ)</span><span class="v">Thay đổi khiến một client đang đúng ngừng chạy đúng.</span></div>
  <div class="kv"><span class="k">Additive change (thay đổi chỉ-thêm)</span><span class="v">Chỉ thêm (trường, endpoint, trường tuỳ chọn); loại an toàn nhất.</span></div>
  <div class="kv"><span class="k">Tolerant reader (người đọc khoan dung)</span><span class="v">Client bỏ qua trường lạ và xử lý giá trị lạ mà không sập.</span></div>
  <div class="kv"><span class="k">Silent break (vỡ lặng lẽ)</span><span class="v">Vỡ mà không ném lỗi, chỉ ra kết quả sai (Invalid Date, 0243040).</span></div>
  <div class="kv"><span class="k">Hyrum’s law (định luật Hyrum)</span><span class="v">Đủ nhiều người dùng thì mọi hành vi quan sát được đều có người dựa vào.</span></div>
  <div class="kv"><span class="k">Contract (hợp đồng)</span><span class="v">Mọi thứ client quan sát được: trường, kiểu, mã, mặc định, thứ tự.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Đo trên một client không đổi: add — ổn; rename — Invalid Date; giá trị enum mới — sập; đổi kiểu — 0243040; trường bắt buộc mới — 400.</li>
  <li>Một nửa số lần vỡ là lặng lẽ: không ngoại lệ, màn hình sai.</li>
  <li>“Thêm là an toàn” chỉ đúng khi có luật tolerant reader được ghi rõ.</li>
  <li>Mã trạng thái, mã lỗi, mặc định và thứ tự cũng là hợp đồng (định luật Hyrum).</li>
  <li>Ưu tiên thay đổi chỉ-thêm; phần còn lại cần phiên bản (4.2) và kế hoạch khai tử (4.3).</li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── 4.2 ─────────────────────────── */
    {
      title: '4.2 — Versioning strategies: URL, header, media type, dates — and one router for two versions|||4.2 — Chiến lược đánh phiên bản: URL, header, media type, theo ngày — và một router cho hai phiên bản',
      slug: 'api-4-2-chien-luoc',
      type: 'LESSON',
      isFreePreview: true,
      description: 'So bốn chỗ đặt phiên bản và cách của Stripe; LabFlow dựng /v1 và /v2 bằng một router, lược đồ và view theo phiên bản, period { start, end } ở v2, đường cũ vẫn là v1.',
      content: `${G042}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>Versioning strategies</h2>
<p class="lead">Lesson 4.1 showed that some changes cannot be made in place. The team wants bookings to carry their time as one object <code>period: { start, end }</code> — cleaner for the calendar screen, and a rename that would break every old client. The answer is a <strong>new version</strong> next to the old one. This lesson compares the ways to say “which version”, picks one for LabFlow, and builds it so that two versions share one set of routes, one database and one set of rules.</p>

<h3>Four places to put the version</h3>
<table>
  <thead><tr><th>Where</th><th>Example</th><th>For</th><th>Against</th></tr></thead>
  <tbody>
    <tr><td>URL path</td><td><code>/v2/bookings</code></td><td>visible in logs, links, browser, curl; easy to route, cache and document</td><td>a “version” of a URL is not a new resource in REST purism; whole API moves at once</td></tr>
    <tr><td>Custom header</td><td><code>LabFlow-Version: 2</code>, GitHub’s <code>X-GitHub-Api-Version: 2022-11-28</code></td><td>URLs stay stable</td><td>invisible in a pasted link; caches need <code>Vary</code>; easy to forget</td></tr>
    <tr><td>Media type</td><td><code>Accept: application/vnd.labflow.v2+json</code></td><td>“the representation changed” is exactly what content negotiation means</td><td>hard to test by hand, many tools and gateways handle it poorly</td></tr>
    <tr><td>Query parameter</td><td><code>/bookings?version=2</code></td><td>trivial to try</td><td>mixes with filters and cache keys; easy to drop when building links</td></tr>
  </tbody>
</table>
<p><strong>Date-based versions (Stripe)</strong> — checked against Stripe’s own documentation on 1 November 2026. Stripe names versions by a release date plus a release name: the current one is <code>2026-10-28.endive</code>. Since <code>2024-09-30.acacia</code> it ships a new version every month with <strong>no breaking changes</strong>, and twice a year a <strong>major release</strong> (for example Basil) whose first version may contain breaking changes. Each account has a <strong>default API version</strong> set in the dashboard (Workbench); a request can override it with the header <code>Stripe-Version: 2026-10-28.endive</code>, and the official SDKs send the version that was current when that SDK release came out. In a 2017 engineering article Stripe described the mechanism behind this: on an account’s first request it is pinned to the newest version, the code knows only the newest shape, and each backwards-incompatible change lives in a small <em>version change module</em>; for an older version the response “walks back through time” through those modules. It is powerful and costly: every change needs its own backwards transform, for as long as anyone uses the old version. Code Lab 4.2 lets you build such a chain.</p>
<a class="link-card" href="https://docs.stripe.com/api/versioning" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: Stripe API reference — Versioning (read 1 Nov 2026)</span><span class="lc-sub">Version names like 2026-10-28.endive, monthly releases without breaking changes since 2024-09-30.acacia, two major releases a year, the account default version and the Stripe-Version header. See also docs.stripe.com/upgrades.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>
<a class="link-card" href="https://stripe.com/blog/api-versioning" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: “APIs as infrastructure: future-proofing Stripe with versioning” (Stripe blog, 5 Aug 2017)</span><span class="lc-sub">Pinning on the first request and version change modules that transform responses back to older versions. Written in 2017: the release process has changed since (see the reference above), the idea has not.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>
<p><strong>LabFlow’s choice:</strong> a <strong>major version in the URL</strong> (<code>/v1</code>, <code>/v2</code>), changed rarely, only for breaking changes; everything additive goes into the current version without a new number. The reasons are practical for this team: students and mobile developers read curl lines and logs, and a version they can see is a version they will not forget.</p>

<h3>One set of routes, two representations</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">request</span><span class="lz-t">/v2/bookings</span><span class="lz-d">or LabFlow-Version: 2 on old paths</span></div>
  <div class="lz-step"><span class="lz-k">inVersion</span><span class="lz-t">req.apiVersion = 2</span><span class="lz-d">one middleware per prefix</span></div>
  <div class="lz-step"><span class="lz-k">shared handler</span><span class="lz-t">one set of routes</span><span class="lz-d">the same business rules for every version</span></div>
  <div class="lz-step"><span class="lz-k">view + schema</span><span class="lz-t">VIEWS[2], BookingCreateV2</span><span class="lz-d">only the representation differs</span></div>
</div>
<p>The tempting way is to copy <code>routes/</code> to <code>routes/v2/</code>. Two months later a bug fix lands in one copy only. LabFlow keeps <strong>one</strong> router and decides only two things by version: which <strong>view</strong> leaves the server and which <strong>schema</strong> checks the input. The records in the database never change shape.</p>
<pre><code class="language-javascript">// versioning.js — Chương 4: MỘT bộ route, nhiều phiên bản biểu diễn
import { HttpError } from './http.js';

export const VERSIONS = [1, 2];

// Phiên bản nằm trong URL: /v1/…, /v2/… (LabFlow chọn cách này cho API công khai)
export const inVersion = (v) =&gt; (req, res, next) =&gt; {
  req.apiVersion = v;
  res.set('LabFlow-Version', String(v));
  next();
};

// Đường KHÔNG có số phiên bản (client cũ từ Chương 1–3): đọc header LabFlow-Version, vắng ⇒ 1
export function fromHeader(req, res, next) {
  const h = req.get('LabFlow-Version') ?? '1';
  if (!VERSIONS.map(String).includes(h))
    throw new HttpError(400, 'UNKNOWN_VERSION', { got: h, known: VERSIONS.join(', ') });
  req.apiVersion = Number(h);
  res.set('LabFlow-Version', h).vary('LabFlow-Version');   // cùng URL, khác header ⇒ khác body: báo cho cache
  next();
}</code></pre>
<pre><code class="language-javascript">// app.js — MỘT bộ route; /v1 và /v2 chỉ đặt req.apiVersion
const api = Router();
api.use('/labs', labsRouter);
api.use('/devices/:id/issues', deviceIssuesRouter);
api.use('/devices', devicesRouter);
api.use('/issues', issuesRouter);
api.use('/bookings', bookingsRouter);
api.use('/me', meRouter);

app.use('/v1', inVersion(1), api);
app.use('/v2', inVersion(2), api);
// Đường cũ không số phiên bản (client Chương 1–3 vẫn đang gọi): giữ nguyên = v1, hoặc theo header LabFlow-Version
const LEGACY = ['/labs', '/devices', '/issues', '/bookings', '/me'];
app.use(LEGACY, fromHeader);
app.use(api);</code></pre>
<p>The views and schemas:</p>
<pre><code class="language-javascript">// views.js
export const toBookingV2 = (b) =&gt; ({
  id: b.id, labId: b.labId, userId: b.userId, period: { start: b.startAt, end: b.endAt },
  purpose: b.purpose ?? null, status: b.status, createdAt: b.createdAt, cancelledAt: b.cancelledAt ?? null,
});
export const VIEWS = {
  1: { lab: toLab, device: toDevice, booking: toBooking, issue: toIssue },
  2: { lab: toLab, device: toDevice, booking: toBookingV2, issue: toIssue },
};
export const viewsOf = (req) =&gt; VIEWS[req.apiVersion ?? 1];

// validate.js — một lược đồ, HOẶC { 1: …, 2: … } chọn theo phiên bản
const schema = schemas.safeParse ? schemas : schemas[req.apiVersion ?? 1];

// schemas.js — v2 nhận period; sort công khai "start" ánh xạ về khoá nội bộ startAt
export const BookingCreateV2 = z.strictObject({
  labId: id('lab'),
  period: z.strictObject({ start: instant, end: instant }),
  purpose: text(1, 200).optional(),
});
export const BookingsQueryV2 = bookingsQuery(BOOKING_FIELDS_V2,
  { '-createdAt': '-createdAt', createdAt: 'createdAt', start: 'startAt', '-start': '-startAt' });</code></pre>
<p>The <code>bookingsQuery</code> helper those two lines call — the query schema of lessons 3.2–3.4 turned into a function, so each version only names its own fields and its public sort names (the <code>transform</code> maps <code>start</code> back to the internal key <code>startAt</code>, so the handler, the cursor and the fingerprint never change):</p>
<pre><code class="language-javascript">// schemas.js — MỘT hàm dựng lược đồ query cho mọi phiên bản: chỉ khác danh sách trường (fields) và tên sắp xếp công khai (sort)
const bookingsQuery = (fieldNames, sorts) =&gt; z.strictObject({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().min(1).max(200).optional(),   // chuỗi mờ do server phát; offset đã bỏ (bài 3.2)
  // Bài 3.3 — bộ lọc: tên rõ nghĩa, mỗi tham số một kiểu, kết hợp bằng AND
  labId: id('lab').optional(),
  status: z.string()                                // "PENDING,CANCELLED" ⇒ ['PENDING', 'CANCELLED']
    .transform((s) =&gt; s.split(','))
    .pipe(z.array(z.enum(BOOKING_STATUSES)).min(1))
    .optional(),
  from: instant.optional(),                         // lượt đặt CHỒNG LÊN khoảng [from, to)
  to: instant.optional(),
  q: text(2, 50).optional(),                        // tìm trong purpose, không phân biệt dấu
  // Bài 3.4 — sắp xếp, chọn trường, nhúng quan hệ: chỉ những giá trị có trong danh sách cho phép
  sort: z.enum(Object.keys(sorts)).default('-createdAt').transform((s) =&gt; sorts[s]),   // tên công khai ⇒ khoá nội bộ
  fields: z.string()
    .transform((s) =&gt; s.split(','))
    .pipe(z.array(z.enum(fieldNames)).min(1))
    .optional(),
  include: z.enum(['lab']).optional(),
}).refine((x) =&gt; {
  // luật nhiều trường: chỉ phán khi CẢ HAI đã đúng định dạng (Zod có thể chạy refine trên giá trị còn sai)
  const a = Date.parse(x.from ?? ''), b = Date.parse(x.to ?? '');
  return Number.isNaN(a) || Number.isNaN(b) || a &lt; b;
}, { path: ['to'], message: 'TO_AFTER_FROM' });   // mã luật — câu chữ dịch ở i18n.js
export const BookingsQuery = bookingsQuery(BOOKING_FIELDS,
  { '-createdAt': '-createdAt', createdAt: 'createdAt', startAt: 'startAt', '-startAt': '-startAt' });
export const BOOKING_FIELDS_V2 = ['id', 'labId', 'userId', 'period', 'purpose', 'status', 'createdAt', 'cancelledAt'];</code></pre>
<p>Every route now asks for the view of the request’s version instead of calling <code>toBooking</code>/<code>toLab</code>/<code>toDevice</code> directly — this is what makes <code>VIEWS[2]</code> take effect, and <code>req.baseUrl</code> keeps <code>Location</code> and <code>Link</code> inside the version the client used:</p>
<pre><code class="language-javascript">// routes/*.js — mọi chỗ trả dữ liệu gọi view THEO PHIÊN BẢN, không gọi toX trực tiếp; Location/Link dựng từ req.baseUrl
// routes/labs.js
import { viewsOf, list } from '../views.js';
    res.json(list(data, viewsOf(req).lab));                                              // GET /labs
  .get((req, res) =&gt; res.json(viewsOf(req).lab(findLab(req.params.labId))))             // GET /labs/:labId
  res.json(list(devices.filter((d) =&gt; d.labId === lab.id), viewsOf(req).device));       // GET /labs/:labId/devices
// routes/devices.js
    res.json(list(labId ? devices.filter((d) =&gt; d.labId === labId) : devices, viewsOf(req).device));
    res.status(201).location(&#96;\${req.baseUrl}/\${device.id}&#96;).json(viewsOf(req).device(device));   // POST
  .get((req, res) =&gt; res.json(viewsOf(req).device(findDevice(req.params.id))))
    res.json(viewsOf(req).device(d));                                                    // PUT và PATCH
// routes/bookings.js — GET danh sách
  .get(validate('query', { 1: BookingsQuery, 2: BookingsQueryV2 }), (req, res) =&gt; {
      res.links({ next: &#96;\${req.baseUrl}?\${qs}&#96; });   // /bookings, /v1/bookings hay /v2/bookings
    const view = viewsOf(req);
    const data = page.map((b) =&gt; {
      let v = view.booking(b);
      if (fields) v = Object.fromEntries(['id', ...fields.filter((x) =&gt; x !== 'id')].map((k) =&gt; [k, v[k]]));
      if (labById) v.lab = view.lab(labById.get(b.labId));
      return v;
    });
  .get((req, res) =&gt; res.json(viewsOf(req).booking(findOwnBooking(req))))               // GET /:id — /:id/cancel cũng trả viewsOf(req).booking(b)
// routes/issues.js: toIssue ⇒ viewsOf(req).issue ở mọi chỗ, như trên</code></pre>
<p>One new error code for the header of the next section, in both languages of the catalogue (lesson 2.4):</p>
<pre><code class="language-javascript">// messages.js — thêm vào MESSAGES.vi (ngay trước INTERNAL)
    UNKNOWN_VERSION: ['Phiên bản API không tồn tại', (p) =&gt; &#96;Không có phiên bản \${p.got}; các phiên bản: \${p.known}&#96;],
// … và vào MESSAGES.en (ngay trước INTERNAL)
    UNKNOWN_VERSION: ['Unknown API version', (p) =&gt; &#96;There is no version \${p.got}; versions: \${p.known}&#96;],</code></pre>
<p>And the only place in the handler that knows v2 exists — the edge where input becomes the internal form:</p>
<pre><code class="language-javascript">  .post(validate('body', { 1: BookingCreate, 2: BookingCreateV2 }), (req, res) =&gt; {
    const body = req.valid.body;
    const { labId, purpose } = body;
    const startAt = body.period?.start ?? body.startAt;           // v2 ⇒ dạng nội bộ (một chỗ duy nhất)
    const endAt = body.period?.end ?? body.endAt;
    // … mọi luật 422/409 phía dưới dùng chung cho cả hai phiên bản
    res.status(201).location(&#96;\${req.baseUrl}/\${booking.id}&#96;).json(viewsOf(req).booking(booking));</code></pre>
<p><code>req.baseUrl</code> makes <code>Location</code> and <code>Link</code> point into the version the client used (<code>/v2/bookings/bk_9</code>) — a v2 client never gets a v1 link.</p>

<h3>Try it</h3>
<pre><code class="language-bash">curl -s http://localhost:4000/v1/bookings/bk_8 \\
  -H 'Authorization: Bearer tok_lan' | jq -c '{id, startAt, endAt}'</code></pre>
<div class="out">{"id":"bk_8","startAt":"2026-11-02T04:00:00.000Z","endAt":"2026-11-02T06:00:00.000Z"}</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v2/bookings/bk_8 \\
  -H 'Authorization: Bearer tok_lan' | jq -c '{id, period}'</code></pre>
<div class="out">{"id":"bk_8","period":{"start":"2026-11-02T04:00:00.000Z","end":"2026-11-02T06:00:00.000Z"}}</div>
<p>The same booking, two representations. Create through v2, read through v1 — one database:</p>
<pre><code class="language-bash">curl -si -X POST http://localhost:4000/v2/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_3","period":{"start":"2027-01-04T08:00:00+07:00","end":"2027-01-04T10:00:00+07:00"}}' | grep -E '^(HTTP|Location|LabFlow-Version)'</code></pre>
<div class="out">HTTP/1.1 201 Created
LabFlow-Version: 2
Location: /v2/bookings/bk_9</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  -H 'Accept-Language: en' \\
  --json '{"labId":"lab_3","startAt":"2027-01-05T08:00:00+07:00","endAt":"2027-01-05T10:00:00+07:00"}' | jq -c '.errors'</code></pre>
<div class="out">[{"pointer":"#/period","detail":"Invalid input: expected object, received undefined"},{"pointer":"#/startAt","detail":"unknown field"},{"pointer":"#/endAt","detail":"unknown field"}]</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v1/bookings/bk_9 \\
  -H 'Authorization: Bearer tok_an' | jq -c '{id, startAt, endAt}'</code></pre>
<div class="out">{"id":"bk_9","startAt":"2027-01-04T01:00:00.000Z","endAt":"2027-01-04T03:00:00.000Z"}</div>
<p>Sending the v1 body to v2 is refused, member by member — v2 has its own contract. Sort names follow the representation too:</p>
<pre><code class="language-bash">curl -s 'http://localhost:4000/v2/bookings?sort=-start&amp;limit=2' \\
  -H 'Authorization: Bearer tok_lan' | jq -c '[.data[] | {id, start: .period.start}]'</code></pre>
<div class="out">[{"id":"bk_9","start":"2027-01-04T01:00:00.000Z"},{"id":"bk_8","start":"2026-11-02T04:00:00.000Z"}]</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/v2/bookings?sort=startAt' \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'Accept-Language: en' | jq -c '.errors'</code></pre>
<div class="out">[{"parameter":"sort","detail":"Invalid option: expected one of \\"-createdAt\\"|\\"createdAt\\"|\\"start\\"|\\"-start\\""}]</div>
<p>The unversioned paths keep answering exactly as before (version 1), and also show the header strategy for comparison:</p>
<pre><code class="language-bash">curl -si http://localhost:4000/bookings/bk_8 \\
  -H 'Authorization: Bearer tok_lan' | grep -E '^(HTTP|LabFlow-Version|Vary)'</code></pre>
<div class="out">HTTP/1.1 200 OK
LabFlow-Version: 1
Vary: LabFlow-Version</div>
<pre><code class="language-bash">curl -s http://localhost:4000/bookings/bk_8 \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'LabFlow-Version: 2' | jq -c '{id, period}'</code></pre>
<div class="out">{"id":"bk_8","period":{"start":"2026-11-02T04:00:00.000Z","end":"2026-11-02T06:00:00.000Z"}}</div>
<pre><code class="language-bash">curl -s http://localhost:4000/bookings/bk_8 \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'LabFlow-Version: 3' \\
  -H 'Accept-Language: en' | jq -c '{status, code, detail}'</code></pre>
<div class="out">{"status":400,"code":"UNKNOWN_VERSION","detail":"There is no version 3; versions: 1, 2"}</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v3/bookings \\
  -H 'Authorization: Bearer tok_lan' | jq -c '{status, code}'</code></pre>
<div class="out">{"status":404,"code":"ROUTE_NOT_FOUND"}</div>
<p>And the old client of 4.1, untouched, works on both the old paths and <code>/v1</code>. Its booking fails with 409 only because the v2 request above already took that slot — proof that both versions share the same rules:</p>
<pre><code class="language-bash">node client-v1.mjs</code></pre>
<div class="out">bk_9  BE-102  08:00–10:00  Chờ duyệt
bk_8  AL-305  11:00–13:00  Chờ duyệt
bk_7  AL-201  11:00–13:00  Đã huỷ
tổng số chỗ của 3 phòng: 94
KHÔNG đặt được: 409 BOOKING_CONFLICT</div>
<pre><code class="language-bash">BASE=http://localhost:4000/v1 node client-v1.mjs</code></pre>
<div class="out">bk_9  BE-102  08:00–10:00  Chờ duyệt
bk_8  AL-305  11:00–13:00  Chờ duyệt
bk_7  AL-201  11:00–13:00  Đã huỷ
tổng số chỗ của 3 phòng: 94
KHÔNG đặt được: 409 BOOKING_CONFLICT</div>

<div class="pitfall"><p><strong>Trap — a new version for every change.</strong> <code>/v7</code> after a year means seven contracts to keep alive. Additive changes stay in the current version; a new major version is for breaking changes you could not avoid, batched together.</p></div>
<div class="pitfall"><p><strong>Trap — versioning the database.</strong> <code>bookings_v2</code> tables or a forked codebase double every fix. Version the <em>representation</em> at the edge; keep one model inside.</p></div>
<div class="pitfall"><p><strong>Trap — header versioning without <code>Vary</code>.</strong> A cache that stores the v1 body of <code>/bookings/bk_8</code> will serve it to a client that asked for v2. Every header that changes the body must be listed in <code>Vary</code>.</p></div>

<h3>In interviews and at work</h3>
<p><strong>“URL or header versioning?”</strong> Both work. URL: visible, simple to route and cache, common in public APIs. Header/media type: stable URLs, purer HTTP, harder to see and test. Choose one per API and apply it everywhere; what matters more is how rarely you need it.</p>
<p><strong>“How do you keep two versions without two codebases?”</strong> One domain model and one set of rules; versioned schemas at the input edge and versioned views at the output edge, chosen by a version set once per request.</p>

<h3>🧪 Practice (20–25 min)</h3>
<div class="callout ok"><ol>
  <li>Build <code>/v1</code> and <code>/v2</code> as above; reproduce the outputs.</li>
  <li>Add <code>Accept: application/vnd.labflow.v2+json</code> as a third way to ask for v2 on the unversioned paths. What must go into <code>Vary</code> now?</li>
  <li>Make <code>GET /v2/bookings?fields=period,status</code> work and <code>fields=startAt</code> fail in v2 only. Which file decides that?</li>
  <li>Write down, for <code>period</code>, the exact transform from v2 back to v1. That is one Stripe-style “version change”.</li>
</ol>
<p><strong>Done when:</strong> one change to the conflict rule fixes it in both versions, and every Link/Location stays in the version the client used.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Major version</span><span class="v">A number that changes only for breaking changes (<code>/v1</code> → <code>/v2</code>).</span></div>
  <div class="kv"><span class="k">Representation</span><span class="v">The shape a resource takes on the wire; versions change this, not the record.</span></div>
  <div class="kv"><span class="k">Content negotiation</span><span class="v">Choosing the representation from request headers such as <code>Accept</code>.</span></div>
  <div class="kv"><span class="k">Vary</span><span class="v">Response header listing request headers that change the body; caches key on them.</span></div>
  <div class="kv"><span class="k">Version pinning</span><span class="v">A client (or account) stays on a version until it chooses to upgrade.</span></div>
  <div class="kv"><span class="k">Version change transform</span><span class="v">A function that turns the newest shape into an older one (Stripe’s approach).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Version in the URL, a header, the media type or a query parameter — LabFlow uses major versions in the URL.</li>
  <li>New version only for breaking changes; additive ones stay in the current version.</li>
  <li>One router, one model, one set of rules; versioned schemas in, versioned views out.</li>
  <li>Measured: v1 and v2 show the same booking differently and share the same conflicts.</li>
  <li>Old paths keep answering as v1; header versioning needs <code>Vary</code>.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Chiến lược đánh phiên bản</h2>
<p class="lead">Bài 4.1 cho thấy có những thay đổi không thể làm tại chỗ. Nhóm muốn lượt đặt mang thời gian thành một object <code>period: { start, end }</code> — gọn hơn cho màn hình lịch, và là một lần đổi tên làm vỡ mọi client cũ. Câu trả lời là một <strong>phiên bản mới</strong> đứng cạnh bản cũ. Bài này so các cách nói “phiên bản nào”, chọn một cách cho LabFlow, và dựng nó sao cho hai phiên bản dùng chung một bộ route, một cơ sở dữ liệu và một bộ luật.</p>

<h3>Bốn chỗ để đặt số phiên bản</h3>
<table>
  <thead><tr><th>Ở đâu</th><th>Ví dụ</th><th>Ưu</th><th>Nhược</th></tr></thead>
  <tbody>
    <tr><td>Đường dẫn URL</td><td><code>/v2/bookings</code></td><td>thấy được trong log, link, trình duyệt, curl; dễ định tuyến, cache, viết tài liệu</td><td>theo REST thuần thì “phiên bản” của URL không phải tài nguyên mới; cả API chuyển cùng lúc</td></tr>
    <tr><td>Header riêng</td><td><code>LabFlow-Version: 2</code>, của GitHub là <code>X-GitHub-Api-Version: 2022-11-28</code></td><td>URL giữ nguyên</td><td>không thấy trong link dán cho nhau; cache cần <code>Vary</code>; dễ quên gửi</td></tr>
    <tr><td>Media type</td><td><code>Accept: application/vnd.labflow.v2+json</code></td><td>“biểu diễn đã đổi” đúng là ý nghĩa của thương lượng nội dung</td><td>khó thử bằng tay, nhiều công cụ và gateway xử lý kém</td></tr>
    <tr><td>Tham số query</td><td><code>/bookings?version=2</code></td><td>thử cực dễ</td><td>lẫn với bộ lọc và khoá cache; dễ rơi mất khi dựng link</td></tr>
  </tbody>
</table>
<p><strong>Phiên bản theo ngày (Stripe)</strong> — đã đối chiếu với tài liệu chính thức của Stripe ngày 1/11/2026. Stripe đặt tên phiên bản bằng ngày phát hành cộng tên đợt phát hành: bản hiện hành là <code>2026-10-28.endive</code>. Từ <code>2024-09-30.acacia</code>, mỗi tháng Stripe ra một phiên bản <strong>không có thay đổi phá vỡ</strong>, và mỗi năm hai lần ra một <strong>bản phát hành lớn</strong> (ví dụ Basil) mà phiên bản đầu tiên có thể chứa thay đổi phá vỡ. Mỗi tài khoản có một <strong>phiên bản API mặc định</strong> đặt trong dashboard (Workbench); từng request có thể ghi đè bằng header <code>Stripe-Version: 2026-10-28.endive</code>, còn SDK chính thức gửi phiên bản hiện hành vào lúc bản SDK đó ra đời. Trong một bài kỹ thuật năm 2017, Stripe mô tả cơ chế phía sau: ở lần gọi đầu tiên, tài khoản được ghim vào phiên bản mới nhất; code chỉ biết hình dạng mới nhất, và mỗi thay đổi không tương thích nằm trong một <em>version change module</em> nhỏ; với phiên bản cũ hơn, response “đi ngược thời gian” qua các module đó. Cách này mạnh và tốn: mỗi thay đổi cần một phép biến đổi ngược riêng, chừng nào còn người dùng phiên bản cũ. Code Lab 4.2 cho bạn tự dựng một chuỗi như vậy.</p>
<a class="link-card" href="https://docs.stripe.com/api/versioning" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: Stripe API reference — Versioning (đọc ngày 1/11/2026)</span><span class="lc-sub">Tên phiên bản kiểu 2026-10-28.endive, phát hành hằng tháng không phá vỡ từ 2024-09-30.acacia, hai bản lớn mỗi năm, phiên bản mặc định của tài khoản và header Stripe-Version. Xem thêm docs.stripe.com/upgrades.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<a class="link-card" href="https://stripe.com/blog/api-versioning" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: “APIs as infrastructure: future-proofing Stripe with versioning” (blog Stripe, 5/8/2017)</span><span class="lc-sub">Ghim phiên bản ở lần gọi đầu và các version change module biến response về phiên bản cũ. Viết năm 2017: quy trình phát hành đã đổi từ đó (xem tài liệu ở trên), ý tưởng thì không.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<p><strong>LabFlow chọn:</strong> <strong>số phiên bản lớn trong URL</strong> (<code>/v1</code>, <code>/v2</code>), đổi hiếm, chỉ cho thay đổi phá vỡ; mọi thay đổi chỉ-thêm vào phiên bản hiện tại mà không tăng số. Lý do thực tế với nhóm này: sinh viên và lập trình viên di động đọc dòng curl và log, và một phiên bản nhìn thấy được là phiên bản họ không quên.</p>

<h3>Một bộ route, hai cách biểu diễn</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">request</span><span class="lz-t">/v2/bookings</span><span class="lz-d">hoặc LabFlow-Version: 2 ở đường cũ</span></div>
  <div class="lz-step"><span class="lz-k">inVersion</span><span class="lz-t">req.apiVersion = 2</span><span class="lz-d">mỗi tiền tố một middleware</span></div>
  <div class="lz-step"><span class="lz-k">handler dùng chung</span><span class="lz-t">một bộ route</span><span class="lz-d">cùng luật nghiệp vụ cho mọi phiên bản</span></div>
  <div class="lz-step"><span class="lz-k">view + schema</span><span class="lz-t">VIEWS[2], BookingCreateV2</span><span class="lz-d">chỉ cách biểu diễn khác nhau</span></div>
</div>
<p>Cách hấp dẫn là chép <code>routes/</code> sang <code>routes/v2/</code>. Hai tháng sau, một bản sửa lỗi chỉ vào một bản sao. LabFlow giữ <strong>một</strong> router và chỉ để phiên bản quyết định hai việc: <strong>view</strong> nào rời khỏi server và <strong>lược đồ</strong> nào kiểm dữ liệu vào. Bản ghi trong cơ sở dữ liệu không bao giờ đổi hình dạng.</p>
<pre><code class="language-javascript">// versioning.js — Chương 4: MỘT bộ route, nhiều phiên bản biểu diễn
import { HttpError } from './http.js';

export const VERSIONS = [1, 2];

// Phiên bản nằm trong URL: /v1/…, /v2/… (LabFlow chọn cách này cho API công khai)
export const inVersion = (v) =&gt; (req, res, next) =&gt; {
  req.apiVersion = v;
  res.set('LabFlow-Version', String(v));
  next();
};

// Đường KHÔNG có số phiên bản (client cũ từ Chương 1–3): đọc header LabFlow-Version, vắng ⇒ 1
export function fromHeader(req, res, next) {
  const h = req.get('LabFlow-Version') ?? '1';
  if (!VERSIONS.map(String).includes(h))
    throw new HttpError(400, 'UNKNOWN_VERSION', { got: h, known: VERSIONS.join(', ') });
  req.apiVersion = Number(h);
  res.set('LabFlow-Version', h).vary('LabFlow-Version');   // cùng URL, khác header ⇒ khác body: báo cho cache
  next();
}</code></pre>
<pre><code class="language-javascript">// app.js — MỘT bộ route; /v1 và /v2 chỉ đặt req.apiVersion
const api = Router();
api.use('/labs', labsRouter);
api.use('/devices/:id/issues', deviceIssuesRouter);
api.use('/devices', devicesRouter);
api.use('/issues', issuesRouter);
api.use('/bookings', bookingsRouter);
api.use('/me', meRouter);

app.use('/v1', inVersion(1), api);
app.use('/v2', inVersion(2), api);
// Đường cũ không số phiên bản (client Chương 1–3 vẫn đang gọi): giữ nguyên = v1, hoặc theo header LabFlow-Version
const LEGACY = ['/labs', '/devices', '/issues', '/bookings', '/me'];
app.use(LEGACY, fromHeader);
app.use(api);</code></pre>
<p>View và lược đồ:</p>
<pre><code class="language-javascript">// views.js
export const toBookingV2 = (b) =&gt; ({
  id: b.id, labId: b.labId, userId: b.userId, period: { start: b.startAt, end: b.endAt },
  purpose: b.purpose ?? null, status: b.status, createdAt: b.createdAt, cancelledAt: b.cancelledAt ?? null,
});
export const VIEWS = {
  1: { lab: toLab, device: toDevice, booking: toBooking, issue: toIssue },
  2: { lab: toLab, device: toDevice, booking: toBookingV2, issue: toIssue },
};
export const viewsOf = (req) =&gt; VIEWS[req.apiVersion ?? 1];

// validate.js — một lược đồ, HOẶC { 1: …, 2: … } chọn theo phiên bản
const schema = schemas.safeParse ? schemas : schemas[req.apiVersion ?? 1];

// schemas.js — v2 nhận period; sort công khai "start" ánh xạ về khoá nội bộ startAt
export const BookingCreateV2 = z.strictObject({
  labId: id('lab'),
  period: z.strictObject({ start: instant, end: instant }),
  purpose: text(1, 200).optional(),
});
export const BookingsQueryV2 = bookingsQuery(BOOKING_FIELDS_V2,
  { '-createdAt': '-createdAt', createdAt: 'createdAt', start: 'startAt', '-start': '-startAt' });</code></pre>
<p>Hàm <code>bookingsQuery</code> mà hai dòng trên gọi — lược đồ query của bài 3.2–3.4 biến thành một hàm, để mỗi phiên bản chỉ khai danh sách trường và tên sắp xếp công khai của riêng nó (<code>transform</code> đổi <code>start</code> về khoá nội bộ <code>startAt</code>, nên handler, con trỏ và dấu vân tay không đổi gì):</p>
<pre><code class="language-javascript">// schemas.js — MỘT hàm dựng lược đồ query cho mọi phiên bản: chỉ khác danh sách trường (fields) và tên sắp xếp công khai (sort)
const bookingsQuery = (fieldNames, sorts) =&gt; z.strictObject({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().min(1).max(200).optional(),   // chuỗi mờ do server phát; offset đã bỏ (bài 3.2)
  // Bài 3.3 — bộ lọc: tên rõ nghĩa, mỗi tham số một kiểu, kết hợp bằng AND
  labId: id('lab').optional(),
  status: z.string()                                // "PENDING,CANCELLED" ⇒ ['PENDING', 'CANCELLED']
    .transform((s) =&gt; s.split(','))
    .pipe(z.array(z.enum(BOOKING_STATUSES)).min(1))
    .optional(),
  from: instant.optional(),                         // lượt đặt CHỒNG LÊN khoảng [from, to)
  to: instant.optional(),
  q: text(2, 50).optional(),                        // tìm trong purpose, không phân biệt dấu
  // Bài 3.4 — sắp xếp, chọn trường, nhúng quan hệ: chỉ những giá trị có trong danh sách cho phép
  sort: z.enum(Object.keys(sorts)).default('-createdAt').transform((s) =&gt; sorts[s]),   // tên công khai ⇒ khoá nội bộ
  fields: z.string()
    .transform((s) =&gt; s.split(','))
    .pipe(z.array(z.enum(fieldNames)).min(1))
    .optional(),
  include: z.enum(['lab']).optional(),
}).refine((x) =&gt; {
  // luật nhiều trường: chỉ phán khi CẢ HAI đã đúng định dạng (Zod có thể chạy refine trên giá trị còn sai)
  const a = Date.parse(x.from ?? ''), b = Date.parse(x.to ?? '');
  return Number.isNaN(a) || Number.isNaN(b) || a &lt; b;
}, { path: ['to'], message: 'TO_AFTER_FROM' });   // mã luật — câu chữ dịch ở i18n.js
export const BookingsQuery = bookingsQuery(BOOKING_FIELDS,
  { '-createdAt': '-createdAt', createdAt: 'createdAt', startAt: 'startAt', '-startAt': '-startAt' });
export const BOOKING_FIELDS_V2 = ['id', 'labId', 'userId', 'period', 'purpose', 'status', 'createdAt', 'cancelledAt'];</code></pre>
<p>Mọi route giờ xin view theo phiên bản của request thay vì gọi thẳng <code>toBooking</code>/<code>toLab</code>/<code>toDevice</code> — đây là chỗ làm <code>VIEWS[2]</code> có hiệu lực, còn <code>req.baseUrl</code> giữ <code>Location</code> và <code>Link</code> ở đúng phiên bản client đã dùng:</p>
<pre><code class="language-javascript">// routes/*.js — mọi chỗ trả dữ liệu gọi view THEO PHIÊN BẢN, không gọi toX trực tiếp; Location/Link dựng từ req.baseUrl
// routes/labs.js
import { viewsOf, list } from '../views.js';
    res.json(list(data, viewsOf(req).lab));                                              // GET /labs
  .get((req, res) =&gt; res.json(viewsOf(req).lab(findLab(req.params.labId))))             // GET /labs/:labId
  res.json(list(devices.filter((d) =&gt; d.labId === lab.id), viewsOf(req).device));       // GET /labs/:labId/devices
// routes/devices.js
    res.json(list(labId ? devices.filter((d) =&gt; d.labId === labId) : devices, viewsOf(req).device));
    res.status(201).location(&#96;\${req.baseUrl}/\${device.id}&#96;).json(viewsOf(req).device(device));   // POST
  .get((req, res) =&gt; res.json(viewsOf(req).device(findDevice(req.params.id))))
    res.json(viewsOf(req).device(d));                                                    // PUT và PATCH
// routes/bookings.js — GET danh sách
  .get(validate('query', { 1: BookingsQuery, 2: BookingsQueryV2 }), (req, res) =&gt; {
      res.links({ next: &#96;\${req.baseUrl}?\${qs}&#96; });   // /bookings, /v1/bookings hay /v2/bookings
    const view = viewsOf(req);
    const data = page.map((b) =&gt; {
      let v = view.booking(b);
      if (fields) v = Object.fromEntries(['id', ...fields.filter((x) =&gt; x !== 'id')].map((k) =&gt; [k, v[k]]));
      if (labById) v.lab = view.lab(labById.get(b.labId));
      return v;
    });
  .get((req, res) =&gt; res.json(viewsOf(req).booking(findOwnBooking(req))))               // GET /:id — /:id/cancel cũng trả viewsOf(req).booking(b)
// routes/issues.js: toIssue ⇒ viewsOf(req).issue ở mọi chỗ, như trên</code></pre>
<p>Một mã lỗi mới cho header ở phần sau, thêm vào cả hai ngôn ngữ của cuốn danh mục (bài 2.4):</p>
<pre><code class="language-javascript">// messages.js — thêm vào MESSAGES.vi (ngay trước INTERNAL)
    UNKNOWN_VERSION: ['Phiên bản API không tồn tại', (p) =&gt; &#96;Không có phiên bản \${p.got}; các phiên bản: \${p.known}&#96;],
// … và vào MESSAGES.en (ngay trước INTERNAL)
    UNKNOWN_VERSION: ['Unknown API version', (p) =&gt; &#96;There is no version \${p.got}; versions: \${p.known}&#96;],</code></pre>
<p>Và chỗ duy nhất trong handler biết v2 tồn tại — mép nơi dữ liệu vào biến thành dạng nội bộ:</p>
<pre><code class="language-javascript">  .post(validate('body', { 1: BookingCreate, 2: BookingCreateV2 }), (req, res) =&gt; {
    const body = req.valid.body;
    const { labId, purpose } = body;
    const startAt = body.period?.start ?? body.startAt;           // v2 ⇒ dạng nội bộ (một chỗ duy nhất)
    const endAt = body.period?.end ?? body.endAt;
    // … mọi luật 422/409 phía dưới dùng chung cho cả hai phiên bản
    res.status(201).location(&#96;\${req.baseUrl}/\${booking.id}&#96;).json(viewsOf(req).booking(booking));</code></pre>
<p><code>req.baseUrl</code> làm <code>Location</code> và <code>Link</code> trỏ vào đúng phiên bản client đã dùng (<code>/v2/bookings/bk_9</code>) — client v2 không bao giờ nhận link v1.</p>

<h3>Chạy thử</h3>
<pre><code class="language-bash">curl -s http://localhost:4000/v1/bookings/bk_8 \\
  -H 'Authorization: Bearer tok_lan' | jq -c '{id, startAt, endAt}'</code></pre>
<div class="out">{"id":"bk_8","startAt":"2026-11-02T04:00:00.000Z","endAt":"2026-11-02T06:00:00.000Z"}</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v2/bookings/bk_8 \\
  -H 'Authorization: Bearer tok_lan' | jq -c '{id, period}'</code></pre>
<div class="out">{"id":"bk_8","period":{"start":"2026-11-02T04:00:00.000Z","end":"2026-11-02T06:00:00.000Z"}}</div>
<p>Cùng một lượt đặt, hai cách biểu diễn. Tạo qua v2, đọc qua v1 — một cơ sở dữ liệu:</p>
<pre><code class="language-bash">curl -si -X POST http://localhost:4000/v2/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_3","period":{"start":"2027-01-04T08:00:00+07:00","end":"2027-01-04T10:00:00+07:00"}}' | grep -E '^(HTTP|Location|LabFlow-Version)'</code></pre>
<div class="out">HTTP/1.1 201 Created
LabFlow-Version: 2
Location: /v2/bookings/bk_9</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  -H 'Accept-Language: en' \\
  --json '{"labId":"lab_3","startAt":"2027-01-05T08:00:00+07:00","endAt":"2027-01-05T10:00:00+07:00"}' | jq -c '.errors'</code></pre>
<div class="out">[{"pointer":"#/period","detail":"Invalid input: expected object, received undefined"},{"pointer":"#/startAt","detail":"unknown field"},{"pointer":"#/endAt","detail":"unknown field"}]</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v1/bookings/bk_9 \\
  -H 'Authorization: Bearer tok_an' | jq -c '{id, startAt, endAt}'</code></pre>
<div class="out">{"id":"bk_9","startAt":"2027-01-04T01:00:00.000Z","endAt":"2027-01-04T03:00:00.000Z"}</div>
<p>Gửi body kiểu v1 vào v2 bị từ chối từng trường — v2 có hợp đồng riêng. Tên sắp xếp cũng theo cách biểu diễn:</p>
<pre><code class="language-bash">curl -s 'http://localhost:4000/v2/bookings?sort=-start&amp;limit=2' \\
  -H 'Authorization: Bearer tok_lan' | jq -c '[.data[] | {id, start: .period.start}]'</code></pre>
<div class="out">[{"id":"bk_9","start":"2027-01-04T01:00:00.000Z"},{"id":"bk_8","start":"2026-11-02T04:00:00.000Z"}]</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/v2/bookings?sort=startAt' \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'Accept-Language: en' | jq -c '.errors'</code></pre>
<div class="out">[{"parameter":"sort","detail":"Invalid option: expected one of \\"-createdAt\\"|\\"createdAt\\"|\\"start\\"|\\"-start\\""}]</div>
<p>Đường không số phiên bản vẫn trả lời y như trước (phiên bản 1), và cho thấy thêm cách dùng header để so sánh:</p>
<pre><code class="language-bash">curl -si http://localhost:4000/bookings/bk_8 \\
  -H 'Authorization: Bearer tok_lan' | grep -E '^(HTTP|LabFlow-Version|Vary)'</code></pre>
<div class="out">HTTP/1.1 200 OK
LabFlow-Version: 1
Vary: LabFlow-Version</div>
<pre><code class="language-bash">curl -s http://localhost:4000/bookings/bk_8 \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'LabFlow-Version: 2' | jq -c '{id, period}'</code></pre>
<div class="out">{"id":"bk_8","period":{"start":"2026-11-02T04:00:00.000Z","end":"2026-11-02T06:00:00.000Z"}}</div>
<pre><code class="language-bash">curl -s http://localhost:4000/bookings/bk_8 \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'LabFlow-Version: 3' \\
  -H 'Accept-Language: en' | jq -c '{status, code, detail}'</code></pre>
<div class="out">{"status":400,"code":"UNKNOWN_VERSION","detail":"There is no version 3; versions: 1, 2"}</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v3/bookings \\
  -H 'Authorization: Bearer tok_lan' | jq -c '{status, code}'</code></pre>
<div class="out">{"status":404,"code":"ROUTE_NOT_FOUND"}</div>
<p>Còn client cũ của bài 4.1, không sửa gì, chạy được cả trên đường cũ lẫn <code>/v1</code>. Lần đặt phòng của nó bị 409 chỉ vì request v2 ở trên đã chiếm ca đó — bằng chứng hai phiên bản dùng chung một bộ luật:</p>
<pre><code class="language-bash">node client-v1.mjs</code></pre>
<div class="out">bk_9  BE-102  08:00–10:00  Chờ duyệt
bk_8  AL-305  11:00–13:00  Chờ duyệt
bk_7  AL-201  11:00–13:00  Đã huỷ
tổng số chỗ của 3 phòng: 94
KHÔNG đặt được: 409 BOOKING_CONFLICT</div>
<pre><code class="language-bash">BASE=http://localhost:4000/v1 node client-v1.mjs</code></pre>
<div class="out">bk_9  BE-102  08:00–10:00  Chờ duyệt
bk_8  AL-305  11:00–13:00  Chờ duyệt
bk_7  AL-201  11:00–13:00  Đã huỷ
tổng số chỗ của 3 phòng: 94
KHÔNG đặt được: 409 BOOKING_CONFLICT</div>

<div class="pitfall"><p><strong>Bẫy — mỗi thay đổi một phiên bản.</strong> Sau một năm có <code>/v7</code> nghĩa là bảy hợp đồng phải nuôi. Thay đổi chỉ-thêm ở lại phiên bản hiện tại; phiên bản lớn mới dành cho những thay đổi phá vỡ không tránh được, gom lại một lần.</p></div>
<div class="pitfall"><p><strong>Bẫy — đánh phiên bản cả cơ sở dữ liệu.</strong> Bảng <code>bookings_v2</code> hay tách đôi codebase làm mọi bản sửa nhân đôi. Hãy đánh phiên bản <em>cách biểu diễn</em> ở mép; bên trong giữ một mô hình.</p></div>
<div class="pitfall"><p><strong>Bẫy — phiên bản bằng header mà quên <code>Vary</code>.</strong> Cache lưu body v1 của <code>/bookings/bk_8</code> sẽ trả nó cho client xin v2. Mọi header làm đổi body phải có trong <code>Vary</code>.</p></div>

<h3>Khi phỏng vấn và khi đi làm</h3>
<p><strong>“Đánh phiên bản bằng URL hay header?”</strong> Cả hai đều dùng được. URL: thấy được, dễ định tuyến và cache, phổ biến ở API công khai. Header/media type: URL ổn định, đúng tinh thần HTTP hơn, khó thấy và khó thử. Chọn một cách cho mỗi API và dùng nhất quán; quan trọng hơn là bạn hiếm khi phải dùng nó.</p>
<p><strong>“Giữ hai phiên bản mà không có hai codebase thế nào?”</strong> Một mô hình nghiệp vụ, một bộ luật; lược đồ theo phiên bản ở mép vào và view theo phiên bản ở mép ra, chọn theo một số phiên bản đặt một lần cho mỗi request.</p>

<h3>🧪 Thực hành (20–25 phút)</h3>
<div class="callout ok"><ol>
  <li>Dựng <code>/v1</code> và <code>/v2</code> như trên; chạy lại các output.</li>
  <li>Thêm <code>Accept: application/vnd.labflow.v2+json</code> làm cách thứ ba để xin v2 trên đường không số. Giờ <code>Vary</code> phải chứa gì?</li>
  <li>Cho <code>GET /v2/bookings?fields=period,status</code> chạy được và <code>fields=startAt</code> chỉ hỏng ở v2. Tệp nào quyết định điều đó?</li>
  <li>Viết ra phép biến đổi chính xác từ v2 về v1 cho <code>period</code>. Đó là một “version change” kiểu Stripe.</li>
</ol>
<p><strong>Xong khi:</strong> sửa luật trùng lịch một lần là cả hai phiên bản cùng được sửa, và mọi Link/Location ở lại đúng phiên bản client đã dùng.</p></div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Major version (phiên bản lớn)</span><span class="v">Con số chỉ đổi khi có thay đổi phá vỡ (<code>/v1</code> → <code>/v2</code>).</span></div>
  <div class="kv"><span class="k">Representation (cách biểu diễn)</span><span class="v">Hình dạng tài nguyên khi đi trên dây; phiên bản đổi cái này, không đổi bản ghi.</span></div>
  <div class="kv"><span class="k">Content negotiation (thương lượng nội dung)</span><span class="v">Chọn cách biểu diễn theo header của request như <code>Accept</code>.</span></div>
  <div class="kv"><span class="k">Vary</span><span class="v">Header response liệt kê các header request làm đổi body; cache dùng chúng làm khoá.</span></div>
  <div class="kv"><span class="k">Version pinning (ghim phiên bản)</span><span class="v">Client (hay tài khoản) ở yên một phiên bản cho tới khi tự chọn nâng cấp.</span></div>
  <div class="kv"><span class="k">Version change transform</span><span class="v">Hàm biến hình dạng mới nhất về một hình dạng cũ hơn (cách của Stripe).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Phiên bản đặt ở URL, header, media type hay tham số query — LabFlow dùng phiên bản lớn trong URL.</li>
  <li>Chỉ ra phiên bản mới cho thay đổi phá vỡ; thay đổi chỉ-thêm ở lại phiên bản hiện tại.</li>
  <li>Một router, một mô hình, một bộ luật; lược đồ theo phiên bản ở mép vào, view theo phiên bản ở mép ra.</li>
  <li>Đo được: v1 và v2 hiện cùng lượt đặt theo hai cách và dùng chung xung đột lịch.</li>
  <li>Đường cũ vẫn trả lời như v1; phiên bản bằng header cần <code>Vary</code>.</li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── 4.3 ─────────────────────────── */
    {
      title: '4.3 — Deprecation and sunset: standard headers, who still calls, 410 after the date|||4.3 — Khai tử có báo trước: header chuẩn, ai còn gọi, 410 sau ngày hẹn',
      slug: 'api-4-3-deprecation',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Middleware gắn Deprecation (RFC 9745), Sunset (RFC 8594) và Link successor-version, đếm lượt gọi theo client, trả 410 kèm đường thay thế sau ngày sunset; kế hoạch khai tử và brownout.',
      content: `${G043}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>Deprecation and sunset</h2>
<p class="lead">LabFlow now serves <code>/v1</code>, <code>/v2</code> and the old unversioned paths from Chapters 1–3. Keeping every version alive forever is how APIs rot: each one needs tests, docs and care. But switching one off on a Monday morning is how you break a mobile app in a lab full of students. Between the two is a process with three standard tools: the <code>Deprecation</code> header, the <code>Sunset</code> header, and <code>410 Gone</code> — plus one thing no standard gives you: knowing <em>who</em> still calls.</p>

<h3>Everyday example: the old canteen card</h3>
<p>The university replaces the old canteen card with a new app. A good plan: announce it on the notice board with a date (“old cards stop working on 1 May”), print a reminder on every receipt paid with an old card, count who still uses one and message those people directly, and on 1 May the reader shows “card retired — use the app” instead of a generic error. LabFlow does exactly that, in HTTP.</p>

<h3>The two headers</h3>
<ul>
  <li><strong><code>Deprecation</code></strong> (RFC 9745, March 2025): “this resource is (or will be) deprecated”. Its value is a structured-field date: <code>@</code> followed by Unix seconds, e.g. <code>Deprecation: @1793491200</code>. It may lie in the future (“will be deprecated from…”). It registers the link relation <code>deprecation</code>, pointing to human-readable documentation.</li>
  <li><strong><code>Sunset</code></strong> (RFC 8594): “expect this resource to stop responding at this time”, written as an HTTP-date, e.g. <code>Sunset: Sat, 01 May 2027 00:00:00 GMT</code>. RFC 9745 adds the rule: the Sunset time <strong>must not be earlier</strong> than the Deprecation time.</li>
  <li>And a <code>Link</code> with <code>rel="successor-version"</code> (RFC 5829) tells programs where to go instead.</li>
</ul>
<p>Deprecated is not broken: the endpoint still works exactly as before. The headers are a message for developers and tools — a client library can log a warning the first time it sees one; a gateway can count them.</p>

<h3>Build it: one middleware</h3>
<pre><code class="language-javascript">// deprecation.js — bài 4.3: báo trước bằng header chuẩn, đo xem AI còn dùng, đến hạn thì 410
import { Router } from 'express';
import { HttpError } from './http.js';
import { requireAuth, requireRole } from './auth.js';

// Đồng hồ giả lập để học (LABFLOW_NOW=2027-05-02T00:00:00Z) — production không đặt biến này
export const now = () =&gt; (process.env.LABFLOW_NOW ? Date.parse(process.env.LABFLOW_NOW) : Date.now());

// "GET /bookings · android/1.2.0" ⇒ { count, lastSeen } — ai còn gọi đường cũ, gọi bao nhiêu
export const usage = new Map();

export function deprecate({ since, sunset, docs, successor }) {
  return (req, res, next) =&gt; {
    const client = req.get('LabFlow-Client') ?? req.get('User-Agent') ?? 'unknown';
    const route = (req.baseUrl + req.path).replace(/\\/[a-z]+_\\d+(\\/.*)?$/, '');   // /bookings/bk_8/cancel ⇒ /bookings
    const key = &#96;\${req.method} \${route} · \${client}&#96;;
    const u = usage.get(key) ?? { count: 0 };
    usage.set(key, { count: u.count + 1, lastSeen: new Date(now()).toISOString() });
    const next_ = successor(req);
    if (now() &gt;= Date.parse(sunset))                                  // quá hạn: không phục vụ nữa, nói rõ đi đâu
      throw new HttpError(410, 'API_SUNSET', { sunset, successor: next_ }, { successor: next_ });
    res.set('Deprecation', &#96;@\${Math.floor(Date.parse(since) / 1000)}&#96;);   // RFC 9745: ngày dạng @giây-unix
    res.set('Sunset', new Date(sunset).toUTCString());                    // RFC 8594: HTTP-date, không sớm hơn Deprecation
    res.links({ deprecation: docs, 'successor-version': next_ });        // tài liệu + địa chỉ thay thế
    next();
  };
}

// GET /v1/admin/deprecations — cho người quản lý xem trước khi tắt: còn ai, còn bao nhiêu
export const adminRouter = Router();
adminRouter.get('/deprecations', requireAuth, requireRole('LAB_MANAGER'), (req, res) =&gt; {
  const data = [...usage].map(([key, v]) =&gt; {
    const [route, client] = key.split(' · ');
    return { route, client, ...v };
  }).sort((a, b) =&gt; b.count - a.count);
  res.json({ data });
});</code></pre>
<p>The report router hangs off the shared <code>api</code> router of lesson 4.2, and the 410 needs its words in the catalogue:</p>
<pre><code class="language-javascript">// app.js — gắn adminRouter vào router api dùng chung của bài 4.2 ⇒ GET /v1/admin/deprecations (và /v2/admin/deprecations)
api.use('/me', meRouter);
api.use('/admin', adminRouter);

// messages.js — thêm vào MESSAGES.vi (ngay trước INTERNAL)
    API_SUNSET: ['Phiên bản API đã ngừng phục vụ', (p) =&gt; &#96;Đường này ngừng từ \${p.sunset}; hãy dùng \${p.successor}&#96;],
// … và vào MESSAGES.en (ngay trước INTERNAL)
    API_SUNSET: ['API version retired', (p) =&gt; &#96;This endpoint was retired on \${p.sunset}; use \${p.successor}&#96;],</code></pre>
<pre><code class="language-javascript">// app.js — đường cũ không số phiên bản: vẫn là v1, nhưng đã KHAI TỬ
const LEGACY = ['/labs', '/devices', '/issues', '/bookings', '/me'];
const legacy = Router();
legacy.use(deprecate({
  since: '2026-11-01T00:00:00Z',
  sunset: '2027-05-01T00:00:00Z',                          // hết học kỳ sau: đủ một vòng phát hành app
  docs: 'https://labflow.example/docs/migrate-to-v1',
  successor: (req) =&gt; &#96;/v1\${req.originalUrl}&#96;,
}), fromHeader, api);
const isLegacy = (req) =&gt; LEGACY.some((p) =&gt; req.path === p || req.path.startsWith(&#96;\${p}/&#96;));
app.use((req, res, next) =&gt; (isLegacy(req) ? legacy(req, res, next) : next()));</code></pre>
<p>Three design points. The usage count runs <strong>before</strong> anything can fail, so even calls that end in 401 are counted. The 410 comes before authentication: a retired endpoint is retired for everybody, with or without a token. And the clock is a function (<code>now()</code>) so the lesson can travel to May 2027 with <code>LABFLOW_NOW</code>; production never sets it.</p>

<h3>Try it</h3>
<pre><code class="language-bash">curl -si 'http://localhost:4000/bookings?limit=2' \\
  -H 'Authorization: Bearer tok_lan' | grep -E '^(HTTP|Deprecation|Sunset|Link)'</code></pre>
<div class="out">HTTP/1.1 200 OK
Deprecation: @1793491200
Sunset: Sat, 01 May 2027 00:00:00 GMT
Link: &lt;https://labflow.example/docs/migrate-to-v1&gt;; rel="deprecation", &lt;/v1/bookings?limit=2&gt;; rel="successor-version", &lt;/bookings?limit=2&amp;cursor=eyJ2IjoiMjAyNi0xMC0wMVQwMDowNzowMC4wMDBaIiwiaWQiOiJia183IiwiZiI6ImE3YzBhODZlIn0&gt;; rel="next"</div>
<pre><code class="language-bash">node -e "console.log(new Date(1793491200 * 1000).toISOString())"</code></pre>
<div class="out">2026-11-01T00:00:00.000Z</div>
<pre><code class="language-bash">curl -si 'http://localhost:4000/v1/bookings?limit=2' \\
  -H 'Authorization: Bearer tok_lan' | grep -E '^(HTTP|Deprecation|Sunset|Link)'</code></pre>
<div class="out">HTTP/1.1 200 OK
Link: &lt;/v1/bookings?limit=2&amp;cursor=eyJ2IjoiMjAyNi0xMC0wMVQwMDowNzowMC4wMDBaIiwiaWQiOiJia183IiwiZiI6ImE3YzBhODZlIn0&gt;; rel="next"</div>
<p>The old path carries all three signals; <code>/v1</code> carries none. Notice that <code>res.links</code> merged the deprecation links with the paging link of Chapter 3 into one <code>Link</code> header.</p>

<h3>Who still calls? Measure before you switch off</h3>
<p>Clients identify themselves with <code>LabFlow-Client: android/1.2.0</code> (lesson 4.4); others fall back to <code>User-Agent</code>. A few calls, then the report:</p>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' http://localhost:4000/labs \\
  -H 'LabFlow-Client: android/1.2.0'</code></pre>
<div class="out">200</div>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  -H 'LabFlow-Client: android/1.2.0'</code></pre>
<div class="out">200</div>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  -H 'LabFlow-Client: android/1.2.0'</code></pre>
<div class="out">200</div>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' http://localhost:4000/v1/bookings \\
  -H 'Authorization: Bearer tok_bin' \\
  -H 'LabFlow-Client: ios/1.4.0'</code></pre>
<div class="out">200</div>
<pre><code class="language-bash">node client-v1.mjs &gt; /dev/null &amp;&amp; echo 'client-v1 xong'</code></pre>
<div class="out">client-v1 xong</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v1/admin/deprecations \\
  -H 'Authorization: Bearer tok_lan' | jq -c '.data[]'</code></pre>
<div class="out">{"route":"GET /bookings","client":"android/1.2.0","count":2,"lastSeen":"2026-10-31T20:03:18.512Z"}
{"route":"GET /bookings","client":"curl/8.7.1","count":1,"lastSeen":"2026-10-31T20:03:18.408Z"}
{"route":"GET /labs","client":"android/1.2.0","count":1,"lastSeen":"2026-10-31T20:03:18.484Z"}
{"route":"GET /bookings","client":"node","count":1,"lastSeen":"2026-10-31T20:03:18.582Z"}
{"route":"POST /bookings","client":"node","count":1,"lastSeen":"2026-10-31T20:03:18.604Z"}</div>
<p>Now the decision has names: Android 1.2.0 still lists bookings on the old paths, <code>node</code> (the 4.1 script) also creates bookings there, and a curl user tried once. Those are the people to email, with the date and the migration page — long before the date. A real system stores this in logs or metrics instead of memory, but the question is the same: <em>who, which route, how often, last seen when</em>.</p>

<h3>The day after the sunset</h3>
<p>Restart with <code>LABFLOW_NOW=2027-05-02T00:00:00Z</code>:</p>
<pre><code class="language-bash">curl -si 'http://localhost:4000/bookings?limit=2' -H 'Authorization: Bearer tok_lan'</code></pre>
<div class="out">HTTP/1.1 410 Gone
Content-Language: vi
Vary: Accept-Language
Content-Type: application/problem+json; charset=utf-8
Content-Length: 327
ETag: W/"147-ha+aj3ZarDPXx1yVH3Il4pv/F6o"
Date: Sat, 31 Oct 2026 20:03:19 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "type": "https://labflow.example/problems/api-sunset",
  "title": "Phiên bản API đã ngừng phục vụ",
  "status": 410,
  "detail": "Đường này ngừng từ 2027-05-01T00:00:00Z; hãy dùng /v1/bookings?limit=2",
  "instance": "/bookings?limit=2",
  "code": "API_SUNSET",
  "successor": "/v1/bookings?limit=2"
}</div>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' 'http://localhost:4000/v1/bookings?limit=2' \\
  -H 'Authorization: Bearer tok_lan'</code></pre>
<div class="out">200</div>
<pre><code class="language-bash">node client-v1.mjs</code></pre>
<div class="out">file:///…/client-v1.mjs:10
for (const b of page.data) console.log(&#96;\${b.id}  \${b.lab.code}  \${hhmm(b.startAt)}–\${hhmm(b.endAt)}  \${label(b.status)}&#96;);
                     ^

TypeError: page.data is not iterable
    at file:///…/client-v1.mjs:10:22

Node.js v22.23.3</div>
<p><code>410 Gone</code> — “this existed and is gone on purpose” — with a problem document that names the successor. <code>/v1</code> still answers 200. The unchanged old client now crashes, because it never checked <code>res.ok</code>: no header can save a client that does not read responses. That is why the six months before the date, and the usage report, matter more than the 410.</p>

<h3>A retirement plan that works</h3>
<div class="lz-map">
  <div class="lz-stage">retiring an old path</div>
  <div class="lz-node"><span class="lz-badge">1</span><div class="lz-nbody"><div class="lz-ntitle">Ship the successor and the migration guide</div><div class="lz-nsub">/v1 exists before anything is announced</div></div></div>
  <div class="lz-node"><span class="lz-badge">2</span><div class="lz-nbody"><div class="lz-ntitle">Deprecation + Link now, Sunset one release cycle away</div><div class="lz-nsub">LabFlow: one semester</div></div></div>
  <div class="lz-node"><span class="lz-badge">3</span><div class="lz-nbody"><div class="lz-ntitle">Announce, then watch the usage report shrink</div><div class="lz-nsub">optional short brownouts wake forgotten clients</div></div></div>
  <div class="lz-node"><span class="lz-badge">4</span><div class="lz-nbody"><div class="lz-ntitle">On the date: 410 with the successor</div><div class="lz-nsub">keep the 410 for a while before removing the route</div></div></div>
</div>
<ol>
  <li>Ship the successor (<code>/v1</code>) and the migration guide first.</li>
  <li>Send <code>Deprecation</code> + <code>Link</code> immediately; set a <code>Sunset</code> at least one full client release cycle away (LabFlow: one semester).</li>
  <li>Announce in the changelog and directly to every client found in the usage report.</li>
  <li>Watch the report shrink; optionally run short <strong>brownouts</strong> (planned outages of the old path for an hour) to wake up forgotten clients.</li>
  <li>On the date: 410 with the successor; keep the 410 answering for a while before removing the route entirely, so late clients get a clear message instead of a 404.</li>
</ol>

<div class="pitfall"><p><strong>Trap — a Sunset earlier than Deprecation, or a date in the past on day one.</strong> RFC 9745 forbids the first; the second gives nobody time. Check both dates in a test (Lab 4 does).</p></div>
<div class="pitfall"><p><strong>Trap — 404 after removal.</strong> “Not found” looks like a typo in the client’s URL. 410 with a successor says what happened and what to do.</p></div>
<div class="pitfall"><p><strong>Trap — switching off without data.</strong> If you cannot answer “who still calls this?”, you are not ready to set a sunset date.</p></div>

<h3>In interviews and at work</h3>
<p><strong>“How do you retire an API version?”</strong> Ship the replacement, mark the old one with Deprecation/Sunset headers and a successor link, communicate, measure usage per client, brown out, then answer 410 with guidance — on a date announced months ahead.</p>
<p><strong>“What is the difference between deprecated and sunset?”</strong> Deprecated: still works, please stop using it. Sunset: the moment it stops working.</p>

<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc9745.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: RFC 9745 — The Deprecation HTTP Response Header Field (Mar 2025) — read 1 Nov 2026</span><span class="lc-sub">Deprecation is a structured date (@ + Unix time, e.g. @1688169599); §4 pairs it with Sunset (RFC 8594), which must not be earlier than Deprecation.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
  <li>Add <code>deprecate()</code> to the old paths; reproduce the three outputs.</li>
  <li>Add a brownout: if <code>LABFLOW_BROWNOUT=1</code>, answer the old paths with 503 + <code>Retry-After: 3600</code> and a problem code <code>API_BROWNOUT</code>. Why 503 and not 410?</li>
  <li>Make the usage report group by platform and version (<code>android/1.2.0</code> → <code>android</code>, <code>1.2.0</code>) and show the oldest version still seen.</li>
</ol>
<p><strong>Done when:</strong> the old paths announce their end, you can list who still calls them, and after the date they answer 410 with a successor.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Deprecation (RFC 9745)</span><span class="v">Header saying a resource is or will be deprecated: <code>@unix-seconds</code>.</span></div>
  <div class="kv"><span class="k">Sunset (RFC 8594)</span><span class="v">Header with the HTTP-date when the resource is expected to stop responding.</span></div>
  <div class="kv"><span class="k">successor-version</span><span class="v">Link relation pointing to the replacement (RFC 5829).</span></div>
  <div class="kv"><span class="k">410 Gone</span><span class="v">The resource existed and was removed on purpose.</span></div>
  <div class="kv"><span class="k">Brownout</span><span class="v">A planned short outage of an old endpoint to make remaining clients notice.</span></div>
  <div class="kv"><span class="k">Usage report</span><span class="v">Who calls which deprecated route, how often, last seen when.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Deprecated still works; sunset is when it stops. Headers: <code>Deprecation: @…</code>, <code>Sunset: &lt;HTTP-date&gt;</code>, <code>Link rel="successor-version"</code>.</li>
  <li>Sunset must not be earlier than Deprecation; give at least one client release cycle.</li>
  <li>Count calls per client before deciding — LabFlow’s report named Android 1.2.0 and a node script.</li>
  <li>After the date: 410 with the successor, not 404.</li>
  <li>A client that never checks <code>res.ok</code> still crashes — communication matters more than the status code.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>Khai tử có báo trước: Deprecation và Sunset</h2>
<p class="lead">LabFlow giờ phục vụ <code>/v1</code>, <code>/v2</code> và các đường cũ không số phiên bản của Chương 1–3. Nuôi mọi phiên bản mãi mãi là cách API mục nát: phiên bản nào cũng cần test, tài liệu và công chăm sóc. Nhưng tắt một phiên bản vào sáng thứ Hai là cách làm vỡ app di động giữa một phòng lab đầy sinh viên. Ở giữa là một quy trình với ba công cụ chuẩn: header <code>Deprecation</code>, header <code>Sunset</code>, và <code>410 Gone</code> — cộng một thứ không chuẩn nào cho bạn: biết <em>ai</em> còn đang gọi.</p>

<h3>Ví dụ đời thường: thẻ căng-tin cũ</h3>
<p>Trường thay thẻ căng-tin cũ bằng app mới. Một kế hoạch tốt: thông báo trên bảng tin kèm ngày (“thẻ cũ ngừng dùng từ 1/5”), in lời nhắc trên mỗi hoá đơn trả bằng thẻ cũ, đếm ai còn dùng và nhắn riêng cho từng người, và đến 1/5 máy đọc hiện “thẻ đã ngừng — hãy dùng app” thay vì một lỗi chung chung. LabFlow làm đúng như vậy, bằng HTTP.</p>

<h3>Hai header</h3>
<ul>
  <li><strong><code>Deprecation</code></strong> (RFC 9745, tháng 3/2025): “tài nguyên này đã (hoặc sẽ) bị khai tử”. Giá trị là kiểu ngày của structured field: <code>@</code> rồi số giây Unix, ví dụ <code>Deprecation: @1793491200</code>. Nó có thể nằm ở tương lai (“sẽ khai tử từ…”). RFC này đăng ký quan hệ liên kết <code>deprecation</code>, trỏ tới tài liệu cho người đọc.</li>
  <li><strong><code>Sunset</code></strong> (RFC 8594): “dự kiến tài nguyên ngừng trả lời vào lúc này”, viết dạng HTTP-date, ví dụ <code>Sunset: Sat, 01 May 2027 00:00:00 GMT</code>. RFC 9745 thêm luật: thời điểm Sunset <strong>không được sớm hơn</strong> thời điểm Deprecation.</li>
  <li>Thêm một <code>Link</code> có <code>rel="successor-version"</code> (RFC 5829) để chương trình biết thay bằng đường nào.</li>
</ul>
<p>Khai tử không có nghĩa là hỏng: endpoint vẫn chạy y như trước. Header là lời nhắn cho lập trình viên và công cụ — thư viện client có thể ghi cảnh báo lần đầu thấy nó; gateway có thể đếm nó.</p>

<h3>Dựng: một middleware</h3>
<pre><code class="language-javascript">// deprecation.js — bài 4.3: báo trước bằng header chuẩn, đo xem AI còn dùng, đến hạn thì 410
import { Router } from 'express';
import { HttpError } from './http.js';
import { requireAuth, requireRole } from './auth.js';

// Đồng hồ giả lập để học (LABFLOW_NOW=2027-05-02T00:00:00Z) — production không đặt biến này
export const now = () =&gt; (process.env.LABFLOW_NOW ? Date.parse(process.env.LABFLOW_NOW) : Date.now());

// "GET /bookings · android/1.2.0" ⇒ { count, lastSeen } — ai còn gọi đường cũ, gọi bao nhiêu
export const usage = new Map();

export function deprecate({ since, sunset, docs, successor }) {
  return (req, res, next) =&gt; {
    const client = req.get('LabFlow-Client') ?? req.get('User-Agent') ?? 'unknown';
    const route = (req.baseUrl + req.path).replace(/\\/[a-z]+_\\d+(\\/.*)?$/, '');   // /bookings/bk_8/cancel ⇒ /bookings
    const key = &#96;\${req.method} \${route} · \${client}&#96;;
    const u = usage.get(key) ?? { count: 0 };
    usage.set(key, { count: u.count + 1, lastSeen: new Date(now()).toISOString() });
    const next_ = successor(req);
    if (now() &gt;= Date.parse(sunset))                                  // quá hạn: không phục vụ nữa, nói rõ đi đâu
      throw new HttpError(410, 'API_SUNSET', { sunset, successor: next_ }, { successor: next_ });
    res.set('Deprecation', &#96;@\${Math.floor(Date.parse(since) / 1000)}&#96;);   // RFC 9745: ngày dạng @giây-unix
    res.set('Sunset', new Date(sunset).toUTCString());                    // RFC 8594: HTTP-date, không sớm hơn Deprecation
    res.links({ deprecation: docs, 'successor-version': next_ });        // tài liệu + địa chỉ thay thế
    next();
  };
}

// GET /v1/admin/deprecations — cho người quản lý xem trước khi tắt: còn ai, còn bao nhiêu
export const adminRouter = Router();
adminRouter.get('/deprecations', requireAuth, requireRole('LAB_MANAGER'), (req, res) =&gt; {
  const data = [...usage].map(([key, v]) =&gt; {
    const [route, client] = key.split(' · ');
    return { route, client, ...v };
  }).sort((a, b) =&gt; b.count - a.count);
  res.json({ data });
});</code></pre>
<p>Router báo cáo gắn vào router <code>api</code> dùng chung của bài 4.2, và mã 410 cần câu chữ trong cuốn danh mục:</p>
<pre><code class="language-javascript">// app.js — gắn adminRouter vào router api dùng chung của bài 4.2 ⇒ GET /v1/admin/deprecations (và /v2/admin/deprecations)
api.use('/me', meRouter);
api.use('/admin', adminRouter);

// messages.js — thêm vào MESSAGES.vi (ngay trước INTERNAL)
    API_SUNSET: ['Phiên bản API đã ngừng phục vụ', (p) =&gt; &#96;Đường này ngừng từ \${p.sunset}; hãy dùng \${p.successor}&#96;],
// … và vào MESSAGES.en (ngay trước INTERNAL)
    API_SUNSET: ['API version retired', (p) =&gt; &#96;This endpoint was retired on \${p.sunset}; use \${p.successor}&#96;],</code></pre>
<pre><code class="language-javascript">// app.js — đường cũ không số phiên bản: vẫn là v1, nhưng đã KHAI TỬ
const LEGACY = ['/labs', '/devices', '/issues', '/bookings', '/me'];
const legacy = Router();
legacy.use(deprecate({
  since: '2026-11-01T00:00:00Z',
  sunset: '2027-05-01T00:00:00Z',                          // hết học kỳ sau: đủ một vòng phát hành app
  docs: 'https://labflow.example/docs/migrate-to-v1',
  successor: (req) =&gt; &#96;/v1\${req.originalUrl}&#96;,
}), fromHeader, api);
const isLegacy = (req) =&gt; LEGACY.some((p) =&gt; req.path === p || req.path.startsWith(&#96;\${p}/&#96;));
app.use((req, res, next) =&gt; (isLegacy(req) ? legacy(req, res, next) : next()));</code></pre>
<p>Ba điểm thiết kế. Bộ đếm chạy <strong>trước</strong> mọi thứ có thể hỏng, nên cả lần gọi kết thúc bằng 401 cũng được đếm. 410 đứng trước xác thực: endpoint đã khai tử thì khai tử với mọi người, có token hay không. Và đồng hồ là một hàm (<code>now()</code>) để bài học “du hành” tới tháng 5/2027 bằng <code>LABFLOW_NOW</code>; production không bao giờ đặt biến này.</p>

<h3>Chạy thử</h3>
<pre><code class="language-bash">curl -si 'http://localhost:4000/bookings?limit=2' \\
  -H 'Authorization: Bearer tok_lan' | grep -E '^(HTTP|Deprecation|Sunset|Link)'</code></pre>
<div class="out">HTTP/1.1 200 OK
Deprecation: @1793491200
Sunset: Sat, 01 May 2027 00:00:00 GMT
Link: &lt;https://labflow.example/docs/migrate-to-v1&gt;; rel="deprecation", &lt;/v1/bookings?limit=2&gt;; rel="successor-version", &lt;/bookings?limit=2&amp;cursor=eyJ2IjoiMjAyNi0xMC0wMVQwMDowNzowMC4wMDBaIiwiaWQiOiJia183IiwiZiI6ImE3YzBhODZlIn0&gt;; rel="next"</div>
<pre><code class="language-bash">node -e "console.log(new Date(1793491200 * 1000).toISOString())"</code></pre>
<div class="out">2026-11-01T00:00:00.000Z</div>
<pre><code class="language-bash">curl -si 'http://localhost:4000/v1/bookings?limit=2' \\
  -H 'Authorization: Bearer tok_lan' | grep -E '^(HTTP|Deprecation|Sunset|Link)'</code></pre>
<div class="out">HTTP/1.1 200 OK
Link: &lt;/v1/bookings?limit=2&amp;cursor=eyJ2IjoiMjAyNi0xMC0wMVQwMDowNzowMC4wMDBaIiwiaWQiOiJia183IiwiZiI6ImE3YzBhODZlIn0&gt;; rel="next"</div>
<p>Đường cũ mang đủ ba tín hiệu; <code>/v1</code> không có cái nào. Để ý <code>res.links</code> đã gộp link khai tử với link phân trang của Chương 3 vào một header <code>Link</code>.</p>

<h3>Ai còn gọi? Đo trước khi tắt</h3>
<p>Client tự xưng bằng <code>LabFlow-Client: android/1.2.0</code> (bài 4.4); còn lại thì dùng <code>User-Agent</code>. Gọi vài lần rồi xem báo cáo:</p>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' http://localhost:4000/labs \\
  -H 'LabFlow-Client: android/1.2.0'</code></pre>
<div class="out">200</div>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  -H 'LabFlow-Client: android/1.2.0'</code></pre>
<div class="out">200</div>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  -H 'LabFlow-Client: android/1.2.0'</code></pre>
<div class="out">200</div>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' http://localhost:4000/v1/bookings \\
  -H 'Authorization: Bearer tok_bin' \\
  -H 'LabFlow-Client: ios/1.4.0'</code></pre>
<div class="out">200</div>
<pre><code class="language-bash">node client-v1.mjs &gt; /dev/null &amp;&amp; echo 'client-v1 xong'</code></pre>
<div class="out">client-v1 xong</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v1/admin/deprecations \\
  -H 'Authorization: Bearer tok_lan' | jq -c '.data[]'</code></pre>
<div class="out">{"route":"GET /bookings","client":"android/1.2.0","count":2,"lastSeen":"2026-10-31T20:03:18.512Z"}
{"route":"GET /bookings","client":"curl/8.7.1","count":1,"lastSeen":"2026-10-31T20:03:18.408Z"}
{"route":"GET /labs","client":"android/1.2.0","count":1,"lastSeen":"2026-10-31T20:03:18.484Z"}
{"route":"GET /bookings","client":"node","count":1,"lastSeen":"2026-10-31T20:03:18.582Z"}
{"route":"POST /bookings","client":"node","count":1,"lastSeen":"2026-10-31T20:03:18.604Z"}</div>
<p>Giờ quyết định đã có tên tuổi: Android 1.2.0 vẫn liệt kê lượt đặt qua đường cũ, <code>node</code> (script của bài 4.1) còn tạo lượt đặt ở đó, và một người dùng curl thử một lần. Đó là những người cần email, kèm ngày và trang hướng dẫn chuyển đổi — từ rất lâu trước ngày đó. Hệ thống thật lưu những số này trong log hay metrics chứ không trong RAM, nhưng câu hỏi vẫn vậy: <em>ai, đường nào, bao nhiêu lần, lần cuối khi nào</em>.</p>

<h3>Ngày sau Sunset</h3>
<p>Khởi động lại với <code>LABFLOW_NOW=2027-05-02T00:00:00Z</code>:</p>
<pre><code class="language-bash">curl -si 'http://localhost:4000/bookings?limit=2' -H 'Authorization: Bearer tok_lan'</code></pre>
<div class="out">HTTP/1.1 410 Gone
Content-Language: vi
Vary: Accept-Language
Content-Type: application/problem+json; charset=utf-8
Content-Length: 327
ETag: W/"147-ha+aj3ZarDPXx1yVH3Il4pv/F6o"
Date: Sat, 31 Oct 2026 20:03:19 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "type": "https://labflow.example/problems/api-sunset",
  "title": "Phiên bản API đã ngừng phục vụ",
  "status": 410,
  "detail": "Đường này ngừng từ 2027-05-01T00:00:00Z; hãy dùng /v1/bookings?limit=2",
  "instance": "/bookings?limit=2",
  "code": "API_SUNSET",
  "successor": "/v1/bookings?limit=2"
}</div>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' 'http://localhost:4000/v1/bookings?limit=2' \\
  -H 'Authorization: Bearer tok_lan'</code></pre>
<div class="out">200</div>
<pre><code class="language-bash">node client-v1.mjs</code></pre>
<div class="out">file:///…/client-v1.mjs:10
for (const b of page.data) console.log(&#96;\${b.id}  \${b.lab.code}  \${hhmm(b.startAt)}–\${hhmm(b.endAt)}  \${label(b.status)}&#96;);
                     ^

TypeError: page.data is not iterable
    at file:///…/client-v1.mjs:10:22

Node.js v22.23.3</div>
<p><code>410 Gone</code> — “từng có, và đã bị gỡ có chủ đích” — kèm problem document nêu tên đường thay thế. <code>/v1</code> vẫn trả 200. Client cũ không sửa gì giờ sập, vì nó chưa bao giờ kiểm <code>res.ok</code>: không header nào cứu được một client không đọc response. Vì vậy sáu tháng trước ngày đó, và báo cáo ai còn dùng, quan trọng hơn cái mã 410.</p>

<h3>Kế hoạch khai tử chạy được</h3>
<div class="lz-map">
  <div class="lz-stage">khai tử một đường cũ</div>
  <div class="lz-node"><span class="lz-badge">1</span><div class="lz-nbody"><div class="lz-ntitle">Có sẵn đường thay thế và hướng dẫn chuyển</div><div class="lz-nsub">/v1 có trước khi thông báo bất cứ gì</div></div></div>
  <div class="lz-node"><span class="lz-badge">2</span><div class="lz-nbody"><div class="lz-ntitle">Gửi Deprecation + Link ngay, Sunset cách một vòng phát hành</div><div class="lz-nsub">LabFlow: một học kỳ</div></div></div>
  <div class="lz-node"><span class="lz-badge">3</span><div class="lz-nbody"><div class="lz-ntitle">Thông báo, rồi nhìn báo cáo sử dụng giảm dần</div><div class="lz-nsub">tắt thử ngắn (brownout) đánh thức client bị quên</div></div></div>
  <div class="lz-node"><span class="lz-badge">4</span><div class="lz-nbody"><div class="lz-ntitle">Đến ngày: 410 kèm đường thay thế</div><div class="lz-nsub">giữ 410 một thời gian rồi mới gỡ route</div></div></div>
</div>
<ol>
  <li>Phát hành đường thay thế (<code>/v1</code>) và hướng dẫn chuyển đổi trước.</li>
  <li>Gửi <code>Deprecation</code> + <code>Link</code> ngay; đặt <code>Sunset</code> cách ít nhất một vòng phát hành của client (LabFlow: một học kỳ).</li>
  <li>Thông báo trong changelog và gửi thẳng tới mọi client có tên trong báo cáo.</li>
  <li>Theo dõi báo cáo nhỏ dần; có thể làm <strong>brownout</strong> (cố ý tắt đường cũ một giờ theo lịch) để đánh thức những client bị quên.</li>
  <li>Đến ngày: 410 kèm đường thay thế; giữ câu trả lời 410 thêm một thời gian rồi mới xoá hẳn route, để client đến muộn nhận được thông điệp rõ ràng thay vì 404.</li>
</ol>

<div class="pitfall"><p><strong>Bẫy — Sunset sớm hơn Deprecation, hoặc ngày đã qua ngay từ hôm đầu.</strong> RFC 9745 cấm cái thứ nhất; cái thứ hai không cho ai thời gian. Kiểm cả hai ngày bằng test (Lab 4 làm việc đó).</p></div>
<div class="pitfall"><p><strong>Bẫy — gỡ xong trả 404.</strong> “Không tìm thấy” trông như client gõ sai URL. 410 kèm đường thay thế nói rõ chuyện gì đã xảy ra và phải làm gì.</p></div>
<div class="pitfall"><p><strong>Bẫy — tắt mà không có số liệu.</strong> Nếu chưa trả lời được “ai còn gọi đường này?”, bạn chưa sẵn sàng đặt ngày Sunset.</p></div>

<h3>Khi phỏng vấn và khi đi làm</h3>
<p><strong>“Khai tử một phiên bản API thế nào?”</strong> Phát hành bản thay thế, gắn header Deprecation/Sunset và link thay thế cho bản cũ, thông báo, đo mức dùng theo từng client, brownout, rồi trả 410 kèm hướng dẫn — vào một ngày đã báo trước nhiều tháng.</p>
<p><strong>“Deprecated khác sunset thế nào?”</strong> Deprecated: vẫn chạy, xin đừng dùng nữa. Sunset: thời điểm nó ngừng chạy.</p>

<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc9745.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: RFC 9745 — The Deprecation HTTP Response Header Field (3/2025) — đọc ngày 1/11/2026</span><span class="lc-sub">Deprecation là một ngày dạng structured field (@ + giờ Unix, vd. @1688169599); §4 ghép nó với Sunset (RFC 8594), và Sunset không được sớm hơn Deprecation.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
  <li>Thêm <code>deprecate()</code> cho các đường cũ; chạy lại ba output.</li>
  <li>Thêm brownout: nếu <code>LABFLOW_BROWNOUT=1</code> thì đường cũ trả 503 + <code>Retry-After: 3600</code> kèm mã problem <code>API_BROWNOUT</code>. Vì sao 503 mà không phải 410?</li>
  <li>Cho báo cáo gom theo nền tảng và phiên bản (<code>android/1.2.0</code> → <code>android</code>, <code>1.2.0</code>) và hiện phiên bản cũ nhất còn thấy.</li>
</ol>
<p><strong>Xong khi:</strong> đường cũ báo trước ngày kết thúc, bạn liệt kê được ai còn gọi, và sau ngày đó chúng trả 410 kèm đường thay thế.</p></div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Deprecation (RFC 9745)</span><span class="v">Header báo tài nguyên đã/sẽ bị khai tử: <code>@giây-unix</code>.</span></div>
  <div class="kv"><span class="k">Sunset (RFC 8594)</span><span class="v">Header mang HTTP-date lúc tài nguyên dự kiến ngừng trả lời.</span></div>
  <div class="kv"><span class="k">successor-version</span><span class="v">Quan hệ liên kết trỏ tới bản thay thế (RFC 5829).</span></div>
  <div class="kv"><span class="k">410 Gone</span><span class="v">Tài nguyên từng tồn tại và đã bị gỡ có chủ đích.</span></div>
  <div class="kv"><span class="k">Brownout</span><span class="v">Cố ý tắt ngắn một endpoint cũ theo lịch để client còn lại nhận ra.</span></div>
  <div class="kv"><span class="k">Usage report (báo cáo mức dùng)</span><span class="v">Ai gọi đường khai tử nào, bao nhiêu lần, lần cuối khi nào.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Deprecated vẫn chạy; sunset là lúc nó ngừng. Header: <code>Deprecation: @…</code>, <code>Sunset: &lt;HTTP-date&gt;</code>, <code>Link rel="successor-version"</code>.</li>
  <li>Sunset không được sớm hơn Deprecation; cho ít nhất một vòng phát hành của client.</li>
  <li>Đếm lượt gọi theo client trước khi quyết — báo cáo của LabFlow chỉ ra Android 1.2.0 và một script node.</li>
  <li>Sau ngày đó: 410 kèm đường thay thế, không phải 404.</li>
  <li>Client không bao giờ kiểm <code>res.ok</code> vẫn sập — truyền đạt quan trọng hơn mã trạng thái.</li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── 4.4 ─────────────────────────── */
    {
      title: '4.4 — Mobile and desktop clients that never update: version header, remote config, hidden enum values|||4.4 — Client di động và desktop không chịu cập nhật: header phiên bản, cấu hình từ xa, giấu giá trị enum mới',
      slug: 'api-4-4-app-di-dong',
      type: 'LESSON',
      isFreePreview: true,
      description: 'LabFlow-Client, GET /app-config đặt trước chốt phiên bản, chặn bản app hỏng bằng 400 APP_VERSION_UNSUPPORTED, check-in chỉ ở v2 và CHECKED_IN không lộ ra v1; ba thế hệ app chạy thật.',
      content: `${G044}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.4</span>
<h2>Mobile and desktop clients that never update</h2>
<p class="lead">A web page updates when the user reloads it. A mobile app updates when the user taps “Update” — or never. Store reviews take days, many phones have auto-update off, and some students keep an old version because it “still works”. A desktop app (Electron, like most of the ones on your laptop) is better only if it ships its own auto-updater. So at any moment LabFlow serves several app versions at once, some of them a year old. This lesson gives the server the four tools for that world: know the version, read config at start-up, never show old clients new values, and block only what is truly broken.</p>

<h3>Tool 1 — every request says who it is</h3>
<p>LabFlow apps send <code>LabFlow-Client: android/1.4.0</code> (platform/semver) on every request. It costs one header and buys everything else in this lesson: the usage report of 4.3, the guard below, and the version distribution you need before any decision (“how many users are still below 1.3?”). <code>User-Agent</code> is not enough: libraries overwrite it, and it rarely carries your app’s own version cleanly.</p>

<h3>Tool 2 — a config endpoint read at start-up</h3>
<p>The app’s first call, before login, is <code>GET /app-config</code>: which version is the minimum, which is the latest, where to update, which features are on. Changing a value on the server takes effect on the next app start — no store release needed.</p>
<pre><code class="language-javascript">// appVersion.js — bài 4.4: app di động KHÔNG cập nhật ngay. Mỗi request khai "LabFlow-Client: android/1.4.0".
import { HttpError } from './http.js';

// Cấu hình đọc ở MỖI lần mở app — đổi ở server là có hiệu lực, không cần phát hành app mới
export const APP_CONFIG = {
  minVersion: { android: '1.3.0', ios: '1.3.0' },        // thấp hơn ⇒ buộc cập nhật
  latestVersion: { android: '1.5.0', ios: '1.5.0' },     // thấp hơn ⇒ chỉ gợi ý cập nhật
  updateUrl: {
    android: 'https://play.google.com/store/apps/details?id=example.labflow',
    ios: 'https://apps.apple.com/app/id6740000000',
  },
  features: { checkIn: true },                           // bật/tắt tính năng mà không cần bản app mới
};

// "android/1.4.0" ⇒ { platform: 'android', version: [1, 4, 0] }; sai dạng ⇒ null
export function parseClient(h) {
  const m = /^(android|ios|web)\\/(\\d+)\\.(\\d+)\\.(\\d+)$/.exec(h ?? '');
  return m ? { platform: m[1], version: [Number(m[2]), Number(m[3]), Number(m[4])] } : null;
}
export const compareVersions = (a, b) =&gt; a[0] - b[0] || a[1] - b[1] || a[2] - b[2];

// Chặn CHỈ những bản đã biết là hỏng (dưới minVersion). Không khai / web ⇒ cho qua.
export function appVersionGuard(req, res, next) {
  const c = parseClient(req.get('LabFlow-Client'));
  if (!c || c.platform === 'web') return next();
  const min = APP_CONFIG.minVersion[c.platform];
  if (compareVersions(c.version, min.split('.').map(Number)) &lt; 0) {
    throw new HttpError(400, 'APP_VERSION_UNSUPPORTED',
      { version: c.version.join('.'), min },
      { minVersion: min, updateUrl: APP_CONFIG.updateUrl[c.platform] });
  }
  next();
}</code></pre>
<pre><code class="language-javascript">// app.js — /app-config đứng TRƯỚC chốt phiên bản: app quá cũ vẫn phải đọc được nó để biết mình cần cập nhật
app.get('/app-config', (req, res) =&gt; res.set('Cache-Control', 'public, max-age=300').json(APP_CONFIG));
app.use(appVersionGuard);</code></pre>
<pre><code class="language-bash">curl -si http://localhost:4000/app-config | grep -E '^(HTTP|Cache-Control)'</code></pre>
<div class="out">HTTP/1.1 200 OK
Cache-Control: public, max-age=300</div>
<pre><code class="language-bash">curl -s http://localhost:4000/app-config | jq -c '{minVersion, latestVersion, features}'</code></pre>
<div class="out">{"minVersion":{"android":"1.3.0","ios":"1.3.0"},"latestVersion":{"android":"1.5.0","ios":"1.5.0"},"features":{"checkIn":true}}</div>
<p>Five minutes of caching: the config is read by every app on every start, and it changes rarely.</p>

<h3>Tool 3 — a guard for versions that are truly broken</h3>
<p>Sometimes an old version has a bug you cannot tolerate (it double-books, it leaks data). Then the server refuses it, with a problem document the app can turn into an “Update now” screen:</p>
<pre><code class="language-bash">curl -s 'http://localhost:4000/v2/bookings?limit=1' \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'LabFlow-Client: android/1.2.0'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/app-version-unsupported",
  "title": "Phiên bản app đã quá cũ",
  "status": 400,
  "detail": "App 1.2.0 không còn được hỗ trợ; hãy cập nhật lên 1.3.0 trở lên",
  "instance": "/v2/bookings?limit=1",
  "code": "APP_VERSION_UNSUPPORTED",
  "minVersion": "1.3.0",
  "updateUrl": "https://play.google.com/store/apps/details?id=example.labflow"
}</div>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' 'http://localhost:4000/v2/bookings?limit=1' \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'LabFlow-Client: android/1.3.0'</code></pre>
<div class="out">200</div>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' 'http://localhost:4000/v2/bookings?limit=1' \\
  -H 'Authorization: Bearer tok_lan'</code></pre>
<div class="out">200</div>
<p>1.2.0 is refused, 1.3.0 passes, and a request without the header (curl, a script, the web) is not blocked — the guard targets known-bad app builds, not everyone it cannot identify. Which status? LabFlow uses <strong>400</strong> with a specific <code>code</code>. <code>426 Upgrade Required</code> is tempting but means “switch to another <em>protocol</em>” and requires an <code>Upgrade</code> header; 403 means “you are not allowed”, which is about the user, not the build.</p>

<h3>Tool 4 — old clients never see new values</h3>
<p>The new feature: students check in when they arrive. That needs a new booking status <code>CHECKED_IN</code> — exactly the enum change that crashed the client in 4.1. LabFlow adds it so that <strong>no old client ever sees it</strong>:</p>
<pre><code class="language-javascript">// views.js — v1 ra đời trước khi có check-in: giá trị trạng thái MỚI không bao giờ lộ ra cho client v1
const V1_STATUS = { PENDING: 'PENDING', CANCELLED: 'CANCELLED', CHECKED_IN: 'PENDING' };
export const v1Status = (s) =&gt; V1_STATUS[s] ?? 'PENDING';
// toBooking (v1):   status: v1Status(b.status)
// toBookingV2:      status: b.status, checkedInAt: b.checkedInAt ?? null   ⇐ thêm vào v2 = thay đổi THÊM

// routes/bookings.js — check-in CHỈ có ở v2; ở v1 đường này không tồn tại ⇒ 404
const v2Only = (req, res, next) =&gt; (req.apiVersion === 2 ? next() : next('router'));
bookingsRouter.route('/:id/check-in')
  .post(v2Only, (req, res) =&gt; {
    const b = findOwnBooking(req);
    if (b.status !== 'PENDING') throw new HttpError(409, 'NOT_PENDING', { id: b.id, status: b.status });
    b.status = 'CHECKED_IN';
    b.checkedInAt = new Date().toISOString();
    res.json(viewsOf(req).booking(b));
  })
  .all(v2Only, onlyAllow('POST'));</code></pre>
<p>Three more edges keep the list consistent with the items in it: v2 accepts <code>CHECKED_IN</code> in <code>?status=</code> and offers <code>checkedInAt</code> in <code>?fields=</code>, v1 filters through the same mapping as its view, and the two new codes get their words:</p>
<pre><code class="language-javascript">// schemas.js — bộ lọc trạng thái theo phiên bản: v2 biết CHECKED_IN, v1 thì không (hàm bookingsQuery của 4.2 nhận thêm statuses)
export const BOOKING_STATUSES = ['PENDING', 'CANCELLED'];
export const BOOKING_STATUSES_V2 = ['PENDING', 'CHECKED_IN', 'CANCELLED'];
const bookingsQuery = (fieldNames, sorts, statuses) =&gt; z.strictObject({
  // …
  status: z.string()                                // "PENDING,CANCELLED" ⇒ ['PENDING', 'CANCELLED']
    .transform((s) =&gt; s.split(','))
    .pipe(z.array(z.enum(statuses)).min(1))
    .optional(),
  // …
});
export const BookingsQuery = bookingsQuery(BOOKING_FIELDS,
  { '-createdAt': '-createdAt', createdAt: 'createdAt', startAt: 'startAt', '-startAt': '-startAt' }, BOOKING_STATUSES);
export const BOOKING_FIELDS_V2 = ['id', 'labId', 'userId', 'period', 'purpose', 'status', 'createdAt', 'cancelledAt', 'checkedInAt'];
export const BookingsQueryV2 = bookingsQuery(BOOKING_FIELDS_V2,
  { '-createdAt': '-createdAt', createdAt: 'createdAt', start: 'startAt', '-start': '-startAt' }, BOOKING_STATUSES_V2);

// routes/bookings.js — GET danh sách: v1 lọc theo CÙNG phép ánh xạ với view của nó
import { viewsOf, v1Status } from '../views.js';
      &amp;&amp; (!status || status.includes(req.apiVersion === 2 ? b.status : v1Status(b.status)))

// messages.js — thêm vào MESSAGES.vi (ngay trước INTERNAL)
    APP_VERSION_UNSUPPORTED: ['Phiên bản app đã quá cũ', (p) =&gt; &#96;App \${p.version} không còn được hỗ trợ; hãy cập nhật lên \${p.min} trở lên&#96;],
    NOT_PENDING: ['Lượt đặt không ở trạng thái chờ', (p) =&gt; &#96;Lượt \${p.id} đang \${p.status}, không check-in được&#96;],
// … và vào MESSAGES.en (ngay trước INTERNAL)
    APP_VERSION_UNSUPPORTED: ['App version no longer supported', (p) =&gt; &#96;App \${p.version} is no longer supported; update to \${p.min} or later&#96;],
    NOT_PENDING: ['Booking is not pending', (p) =&gt; &#96;Booking \${p.id} is \${p.status}; it cannot be checked in&#96;],</code></pre>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/bookings/bk_8/check-in \\
  -H 'Authorization: Bearer tok_lan' | jq -c '{id, status, checkedInAt}'</code></pre>
<div class="out">{"id":"bk_8","status":"CHECKED_IN","checkedInAt":"2026-10-31T20:05:03.456Z"}</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v1/bookings/bk_8 \\
  -H 'Authorization: Bearer tok_lan' | jq -c '{id, status}'</code></pre>
<div class="out">{"id":"bk_8","status":"PENDING"}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v1/bookings/bk_8/check-in \\
  -H 'Authorization: Bearer tok_lan' | jq -c '{status, code}'</code></pre>
<div class="out">{"status":404,"code":"ROUTE_NOT_FOUND"}</div>
<p>For a v1 client the booking is still “pending” — the nearest meaning it knows — and check-in does not exist. The v1 status filter uses the same mapping, so <code>?status=PENDING</code> on v1 still finds bk_8: a client must never see a list that disagrees with the items in it.</p>

<h3>Three apps, one server</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · LabFlow-Client header</span><span class="lz-lnote">every request says app and version — the usage report counts them</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · GET /app-config</span><span class="lz-lnote">read at start-up: minimum version, flags, messages</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · version guard</span><span class="lz-lnote">400 APP_VERSION_UNSUPPORTED + updateUrl — only below minVersion</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · old clients never see new values</span><span class="lz-lnote">CHECKED_IN is shown to v1 as PENDING</span></div>
</div>
<p><code>app.mjs</code> simulates the Android app at any version. It reads the config first, then calls <code>/v2/bookings</code>. Version 1.4.0 was written <em>before</em> check-in existed, but as a <strong>tolerant reader</strong> (4.1): an unknown status gets a generic label instead of a crash.</p>
<pre><code class="language-javascript">// app.mjs — giả lập app Android của LabFlow: VERSION=1.2.0 node app.mjs
const BASE = 'http://localhost:4000';
const VERSION = process.env.VERSION ?? '1.4.0';
const H = { Authorization: 'Bearer tok_lan', 'LabFlow-Client': &#96;android/\${VERSION}&#96; };
const older = (a, b) =&gt; {
  const [x, y] = [a, b].map((v) =&gt; v.split('.').map(Number));
  return (x[0] - y[0] || x[1] - y[1] || x[2] - y[2]) &lt; 0;
};

// 1) Mở app: đọc cấu hình TRƯỚC mọi thứ
const cfg = await (await fetch(&#96;\${BASE}/app-config&#96;)).json();
if (older(VERSION, cfg.minVersion.android)) console.log(&#96;[màn hình chặn] Cần cập nhật lên \${cfg.minVersion.android}: \${cfg.updateUrl.android}&#96;);
else if (older(VERSION, cfg.latestVersion.android)) console.log(&#96;[gợi ý] Đã có bản \${cfg.latestVersion.android}&#96;);

// 2) Gọi API như bình thường
const res = await fetch(&#96;\${BASE}/v2/bookings?limit=3&#96;, { headers: H });
const body = await res.json();
if (!res.ok) { console.log(&#96;server từ chối: \${res.status} \${body.code} — \${body.detail}&#96;); process.exit(0); }
// App viết TRƯỚC khi có check-in ⇒ chỉ biết hai trạng thái. Đọc KHOAN DUNG: lạ thì hiện chung, không sập.
const LABEL = { PENDING: 'Chờ duyệt', CANCELLED: 'Đã huỷ' };
for (const b of body.data) console.log(&#96;\${b.id}  \${LABEL[b.status] ?? &#96;Trạng thái khác (\${b.status})&#96;}&#96;);</code></pre>
<pre><code class="language-bash">VERSION=1.2.0 node app.mjs</code></pre>
<div class="out">[màn hình chặn] Cần cập nhật lên 1.3.0: https://play.google.com/store/apps/details?id=example.labflow
server từ chối: 400 APP_VERSION_UNSUPPORTED — App 1.2.0 không còn được hỗ trợ; hãy cập nhật lên 1.3.0 trở lên</div>
<pre><code class="language-bash">VERSION=1.4.0 node app.mjs</code></pre>
<div class="out">[gợi ý] Đã có bản 1.5.0
bk_8  Trạng thái khác (CHECKED_IN)
bk_7  Đã huỷ
bk_6  Chờ duyệt</div>
<pre><code class="language-bash">node client-v1.mjs</code></pre>
<div class="out">bk_8  AL-305  11:00–13:00  Chờ duyệt
bk_7  AL-201  11:00–13:00  Đã huỷ
bk_6  BE-102  09:00–11:00  Chờ duyệt
tổng số chỗ của 3 phòng: 94
đặt được bk_9</div>
<p>1.2.0 shows the blocking screen from the config and is refused by the server as a second line of defence. 1.4.0 suggests an update and shows “Trạng thái khác (CHECKED_IN)” — less pretty than the 1.5 screen, but working. The 4.1 script on the old paths still sees bk_8 as pending. One server, three generations of clients, nobody broken.</p>

<h3>Rules for teams that ship apps</h3>
<ul>
  <li>Write apps as tolerant readers from day one: ignore unknown members, give unknown enum values a fallback.</li>
  <li>Make the server additive by default; when a new value would confuse old clients, map it in the old version’s view.</li>
  <li>Put a feature switch in the config (<code>features.checkIn</code>) so a new button can be turned off without a release.</li>
  <li>Raise <code>minVersion</code> rarely, only for real bugs, after checking the distribution — every raise forces users to the store.</li>
</ul>

<div class="pitfall"><p><strong>Trap — guarding the config endpoint.</strong> If <code>/app-config</code> is behind the version guard, an old app can never learn that it must update. It must be the one door that is always open.</p></div>
<div class="pitfall"><p><strong>Trap — blocking unknown clients.</strong> Requiring <code>LabFlow-Client</code> everywhere breaks curl, scripts and the web for no gain. Block only known-bad builds.</p></div>

<h3>In interviews and at work</h3>
<p><strong>“How do you evolve an API used by mobile apps?”</strong> Assume many versions live at once: identify the client version in a header, serve a remote config with minimum/latest versions and feature switches, keep changes additive, hide new enum values from old versions, and force upgrades only for broken builds.</p>
<p><strong>“Which status for a too-old app?”</strong> A specific problem code (LabFlow: 400 <code>APP_VERSION_UNSUPPORTED</code> with <code>minVersion</code> and <code>updateUrl</code>); explain why 426 does not fit.</p>

<a class="link-card" href="https://google.aip.dev/180" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: Google AIP-180 — Backwards compatibility — read 1 Nov 2026</span><span class="lc-sub">New enum values may be added to responses but “appropriate caution should be used” — user code may not handle them; LabFlow hides them from v1.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
  <li>Add <code>appVersionGuard</code>, <code>/app-config</code> and check-in; reproduce the outputs.</li>
  <li>Set <code>features.checkIn</code> to <code>false</code>. What should <code>POST /v2/bookings/:id/check-in</code> answer now? Implement it.</li>
  <li>Count requests per <code>LabFlow-Client</code> version for one hour and print the share below each version — the number you need before raising <code>minVersion</code>.</li>
</ol>
<p><strong>Done when:</strong> a too-old app gets a clear update path, a v1 client never sees <code>CHECKED_IN</code>, and a tolerant 1.4 app keeps working.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Client version header</span><span class="v"><code>LabFlow-Client: android/1.4.0</code> — who is calling, in which build.</span></div>
  <div class="kv"><span class="k">Remote config</span><span class="v">Settings the app reads at start-up; changing them needs no release.</span></div>
  <div class="kv"><span class="k">Minimum supported version</span><span class="v">Below it the app must update; raise rarely.</span></div>
  <div class="kv"><span class="k">Feature flag</span><span class="v">A switch that turns a feature on or off without deploying an app.</span></div>
  <div class="kv"><span class="k">Forced update</span><span class="v">Blocking an app build until the user updates it.</span></div>
  <div class="kv"><span class="k">Semantic version</span><span class="v">MAJOR.MINOR.PATCH, compared number by number (1.10.0 &gt; 1.9.0).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Apps update late or never: several versions are always live at once.</li>
  <li>Identify the build with a header; serve <code>/app-config</code> before any guard.</li>
  <li>Block only known-bad builds (400 <code>APP_VERSION_UNSUPPORTED</code> with an update URL).</li>
  <li>New enum values go to new versions only; old views map them to the nearest old meaning.</li>
  <li>Measured: 1.2.0 refused with a clear path, 1.4.0 working as a tolerant reader, the 4.1 script unaffected.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.4</span>
<h2>Client di động và desktop không chịu cập nhật</h2>
<p class="lead">Trang web cập nhật khi người dùng tải lại. App di động cập nhật khi người dùng bấm “Cập nhật” — hoặc không bao giờ. Duyệt trên kho ứng dụng mất vài ngày, nhiều điện thoại tắt tự cập nhật, và có bạn giữ bản cũ vì “vẫn chạy mà”. App desktop (Electron, như phần lớn app trên laptop của bạn) chỉ khá hơn nếu nó tự mang bộ tự-cập-nhật. Vậy lúc nào LabFlow cũng phục vụ nhiều bản app cùng lúc, có bản đã một năm tuổi. Bài này trao cho server bốn công cụ cho thế giới đó: biết phiên bản, đọc cấu hình lúc khởi động, không cho client cũ thấy giá trị mới, và chỉ chặn những gì thật sự hỏng.</p>

<h3>Công cụ 1 — request nào cũng nói mình là ai</h3>
<p>App LabFlow gửi <code>LabFlow-Client: android/1.4.0</code> (nền tảng/phiên bản semver) ở mọi request. Tốn một header mà mua được mọi thứ khác trong bài: báo cáo mức dùng của 4.3, chốt chặn bên dưới, và phân bố phiên bản bạn cần trước mọi quyết định (“bao nhiêu người còn dưới 1.3?”). <code>User-Agent</code> là chưa đủ: thư viện hay ghi đè nó, và nó hiếm khi mang phiên bản app của bạn một cách gọn gàng.</p>

<h3>Công cụ 2 — endpoint cấu hình đọc lúc khởi động</h3>
<p>Lời gọi đầu tiên của app, trước cả đăng nhập, là <code>GET /app-config</code>: phiên bản tối thiểu là bao nhiêu, mới nhất là bao nhiêu, cập nhật ở đâu, tính năng nào đang bật. Đổi một giá trị ở server là có hiệu lực ở lần mở app tiếp theo — không cần phát hành lên kho.</p>
<pre><code class="language-javascript">// appVersion.js — bài 4.4: app di động KHÔNG cập nhật ngay. Mỗi request khai "LabFlow-Client: android/1.4.0".
import { HttpError } from './http.js';

// Cấu hình đọc ở MỖI lần mở app — đổi ở server là có hiệu lực, không cần phát hành app mới
export const APP_CONFIG = {
  minVersion: { android: '1.3.0', ios: '1.3.0' },        // thấp hơn ⇒ buộc cập nhật
  latestVersion: { android: '1.5.0', ios: '1.5.0' },     // thấp hơn ⇒ chỉ gợi ý cập nhật
  updateUrl: {
    android: 'https://play.google.com/store/apps/details?id=example.labflow',
    ios: 'https://apps.apple.com/app/id6740000000',
  },
  features: { checkIn: true },                           // bật/tắt tính năng mà không cần bản app mới
};

// "android/1.4.0" ⇒ { platform: 'android', version: [1, 4, 0] }; sai dạng ⇒ null
export function parseClient(h) {
  const m = /^(android|ios|web)\\/(\\d+)\\.(\\d+)\\.(\\d+)$/.exec(h ?? '');
  return m ? { platform: m[1], version: [Number(m[2]), Number(m[3]), Number(m[4])] } : null;
}
export const compareVersions = (a, b) =&gt; a[0] - b[0] || a[1] - b[1] || a[2] - b[2];

// Chặn CHỈ những bản đã biết là hỏng (dưới minVersion). Không khai / web ⇒ cho qua.
export function appVersionGuard(req, res, next) {
  const c = parseClient(req.get('LabFlow-Client'));
  if (!c || c.platform === 'web') return next();
  const min = APP_CONFIG.minVersion[c.platform];
  if (compareVersions(c.version, min.split('.').map(Number)) &lt; 0) {
    throw new HttpError(400, 'APP_VERSION_UNSUPPORTED',
      { version: c.version.join('.'), min },
      { minVersion: min, updateUrl: APP_CONFIG.updateUrl[c.platform] });
  }
  next();
}</code></pre>
<pre><code class="language-javascript">// app.js — /app-config đứng TRƯỚC chốt phiên bản: app quá cũ vẫn phải đọc được nó để biết mình cần cập nhật
app.get('/app-config', (req, res) =&gt; res.set('Cache-Control', 'public, max-age=300').json(APP_CONFIG));
app.use(appVersionGuard);</code></pre>
<pre><code class="language-bash">curl -si http://localhost:4000/app-config | grep -E '^(HTTP|Cache-Control)'</code></pre>
<div class="out">HTTP/1.1 200 OK
Cache-Control: public, max-age=300</div>
<pre><code class="language-bash">curl -s http://localhost:4000/app-config | jq -c '{minVersion, latestVersion, features}'</code></pre>
<div class="out">{"minVersion":{"android":"1.3.0","ios":"1.3.0"},"latestVersion":{"android":"1.5.0","ios":"1.5.0"},"features":{"checkIn":true}}</div>
<p>Cache năm phút: cấu hình được mọi app đọc ở mỗi lần mở, mà nó lại hiếm khi đổi.</p>

<h3>Công cụ 3 — chốt chặn cho bản thật sự hỏng</h3>
<p>Có lúc một bản cũ mang lỗi không thể chấp nhận (đặt trùng phòng, lộ dữ liệu). Khi đó server từ chối nó, kèm problem document để app biến thành màn hình “Cập nhật ngay”:</p>
<pre><code class="language-bash">curl -s 'http://localhost:4000/v2/bookings?limit=1' \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'LabFlow-Client: android/1.2.0'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/app-version-unsupported",
  "title": "Phiên bản app đã quá cũ",
  "status": 400,
  "detail": "App 1.2.0 không còn được hỗ trợ; hãy cập nhật lên 1.3.0 trở lên",
  "instance": "/v2/bookings?limit=1",
  "code": "APP_VERSION_UNSUPPORTED",
  "minVersion": "1.3.0",
  "updateUrl": "https://play.google.com/store/apps/details?id=example.labflow"
}</div>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' 'http://localhost:4000/v2/bookings?limit=1' \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'LabFlow-Client: android/1.3.0'</code></pre>
<div class="out">200</div>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' 'http://localhost:4000/v2/bookings?limit=1' \\
  -H 'Authorization: Bearer tok_lan'</code></pre>
<div class="out">200</div>
<p>1.2.0 bị từ chối, 1.3.0 qua được, còn request không có header (curl, script, web) không bị chặn — chốt nhắm vào bản app đã biết là hỏng, không nhắm vào mọi thứ nó không nhận diện được. Mã nào? LabFlow dùng <strong>400</strong> với <code>code</code> riêng. <code>426 Upgrade Required</code> nghe hợp nhưng nghĩa là “chuyển sang <em>giao thức</em> khác” và bắt buộc có header <code>Upgrade</code>; 403 nghĩa là “bạn không được phép”, nói về người dùng chứ không về bản build.</p>

<h3>Công cụ 4 — client cũ không bao giờ thấy giá trị mới</h3>
<p>Tính năng mới: sinh viên check-in khi tới phòng. Nó cần trạng thái mới <code>CHECKED_IN</code> — đúng loại thay đổi enum đã làm client sập ở bài 4.1. LabFlow thêm nó sao cho <strong>không client cũ nào thấy</strong>:</p>
<pre><code class="language-javascript">// views.js — v1 ra đời trước khi có check-in: giá trị trạng thái MỚI không bao giờ lộ ra cho client v1
const V1_STATUS = { PENDING: 'PENDING', CANCELLED: 'CANCELLED', CHECKED_IN: 'PENDING' };
export const v1Status = (s) =&gt; V1_STATUS[s] ?? 'PENDING';
// toBooking (v1):   status: v1Status(b.status)
// toBookingV2:      status: b.status, checkedInAt: b.checkedInAt ?? null   ⇐ thêm vào v2 = thay đổi THÊM

// routes/bookings.js — check-in CHỈ có ở v2; ở v1 đường này không tồn tại ⇒ 404
const v2Only = (req, res, next) =&gt; (req.apiVersion === 2 ? next() : next('router'));
bookingsRouter.route('/:id/check-in')
  .post(v2Only, (req, res) =&gt; {
    const b = findOwnBooking(req);
    if (b.status !== 'PENDING') throw new HttpError(409, 'NOT_PENDING', { id: b.id, status: b.status });
    b.status = 'CHECKED_IN';
    b.checkedInAt = new Date().toISOString();
    res.json(viewsOf(req).booking(b));
  })
  .all(v2Only, onlyAllow('POST'));</code></pre>
<p>Ba mép nữa để danh sách nhất quán với chính các phần tử trong nó: v2 nhận <code>CHECKED_IN</code> trong <code>?status=</code> và cho <code>checkedInAt</code> trong <code>?fields=</code>, v1 lọc qua cùng phép ánh xạ với view của nó, và hai mã mới có câu chữ:</p>
<pre><code class="language-javascript">// schemas.js — bộ lọc trạng thái theo phiên bản: v2 biết CHECKED_IN, v1 thì không (hàm bookingsQuery của 4.2 nhận thêm statuses)
export const BOOKING_STATUSES = ['PENDING', 'CANCELLED'];
export const BOOKING_STATUSES_V2 = ['PENDING', 'CHECKED_IN', 'CANCELLED'];
const bookingsQuery = (fieldNames, sorts, statuses) =&gt; z.strictObject({
  // …
  status: z.string()                                // "PENDING,CANCELLED" ⇒ ['PENDING', 'CANCELLED']
    .transform((s) =&gt; s.split(','))
    .pipe(z.array(z.enum(statuses)).min(1))
    .optional(),
  // …
});
export const BookingsQuery = bookingsQuery(BOOKING_FIELDS,
  { '-createdAt': '-createdAt', createdAt: 'createdAt', startAt: 'startAt', '-startAt': '-startAt' }, BOOKING_STATUSES);
export const BOOKING_FIELDS_V2 = ['id', 'labId', 'userId', 'period', 'purpose', 'status', 'createdAt', 'cancelledAt', 'checkedInAt'];
export const BookingsQueryV2 = bookingsQuery(BOOKING_FIELDS_V2,
  { '-createdAt': '-createdAt', createdAt: 'createdAt', start: 'startAt', '-start': '-startAt' }, BOOKING_STATUSES_V2);

// routes/bookings.js — GET danh sách: v1 lọc theo CÙNG phép ánh xạ với view của nó
import { viewsOf, v1Status } from '../views.js';
      &amp;&amp; (!status || status.includes(req.apiVersion === 2 ? b.status : v1Status(b.status)))

// messages.js — thêm vào MESSAGES.vi (ngay trước INTERNAL)
    APP_VERSION_UNSUPPORTED: ['Phiên bản app đã quá cũ', (p) =&gt; &#96;App \${p.version} không còn được hỗ trợ; hãy cập nhật lên \${p.min} trở lên&#96;],
    NOT_PENDING: ['Lượt đặt không ở trạng thái chờ', (p) =&gt; &#96;Lượt \${p.id} đang \${p.status}, không check-in được&#96;],
// … và vào MESSAGES.en (ngay trước INTERNAL)
    APP_VERSION_UNSUPPORTED: ['App version no longer supported', (p) =&gt; &#96;App \${p.version} is no longer supported; update to \${p.min} or later&#96;],
    NOT_PENDING: ['Booking is not pending', (p) =&gt; &#96;Booking \${p.id} is \${p.status}; it cannot be checked in&#96;],</code></pre>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/bookings/bk_8/check-in \\
  -H 'Authorization: Bearer tok_lan' | jq -c '{id, status, checkedInAt}'</code></pre>
<div class="out">{"id":"bk_8","status":"CHECKED_IN","checkedInAt":"2026-10-31T20:05:03.456Z"}</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v1/bookings/bk_8 \\
  -H 'Authorization: Bearer tok_lan' | jq -c '{id, status}'</code></pre>
<div class="out">{"id":"bk_8","status":"PENDING"}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v1/bookings/bk_8/check-in \\
  -H 'Authorization: Bearer tok_lan' | jq -c '{status, code}'</code></pre>
<div class="out">{"status":404,"code":"ROUTE_NOT_FOUND"}</div>
<p>Với client v1, lượt đặt vẫn “đang chờ” — nghĩa gần nhất mà nó biết — và check-in không tồn tại. Bộ lọc trạng thái của v1 dùng cùng phép ánh xạ, nên <code>?status=PENDING</code> ở v1 vẫn tìm ra bk_8: client không bao giờ được thấy một danh sách mâu thuẫn với chính các phần tử trong nó.</p>

<h3>Ba app, một server</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · header LabFlow-Client</span><span class="lz-lnote">request nào cũng nói app và phiên bản — báo cáo sử dụng đếm chúng</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · GET /app-config</span><span class="lz-lnote">đọc lúc khởi động: phiên bản tối thiểu, cờ, thông báo</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · chốt phiên bản</span><span class="lz-lnote">400 APP_VERSION_UNSUPPORTED + updateUrl — chỉ dưới minVersion</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · client cũ không thấy giá trị mới</span><span class="lz-lnote">CHECKED_IN hiện với v1 thành PENDING</span></div>
</div>
<p><code>app.mjs</code> giả lập app Android ở phiên bản bất kỳ. Nó đọc cấu hình trước rồi gọi <code>/v2/bookings</code>. Bản 1.4.0 được viết <em>trước</em> khi có check-in, nhưng theo kiểu <strong>người đọc khoan dung</strong> (4.1): trạng thái lạ nhận nhãn chung thay vì làm sập.</p>
<pre><code class="language-javascript">// app.mjs — giả lập app Android của LabFlow: VERSION=1.2.0 node app.mjs
const BASE = 'http://localhost:4000';
const VERSION = process.env.VERSION ?? '1.4.0';
const H = { Authorization: 'Bearer tok_lan', 'LabFlow-Client': &#96;android/\${VERSION}&#96; };
const older = (a, b) =&gt; {
  const [x, y] = [a, b].map((v) =&gt; v.split('.').map(Number));
  return (x[0] - y[0] || x[1] - y[1] || x[2] - y[2]) &lt; 0;
};

// 1) Mở app: đọc cấu hình TRƯỚC mọi thứ
const cfg = await (await fetch(&#96;\${BASE}/app-config&#96;)).json();
if (older(VERSION, cfg.minVersion.android)) console.log(&#96;[màn hình chặn] Cần cập nhật lên \${cfg.minVersion.android}: \${cfg.updateUrl.android}&#96;);
else if (older(VERSION, cfg.latestVersion.android)) console.log(&#96;[gợi ý] Đã có bản \${cfg.latestVersion.android}&#96;);

// 2) Gọi API như bình thường
const res = await fetch(&#96;\${BASE}/v2/bookings?limit=3&#96;, { headers: H });
const body = await res.json();
if (!res.ok) { console.log(&#96;server từ chối: \${res.status} \${body.code} — \${body.detail}&#96;); process.exit(0); }
// App viết TRƯỚC khi có check-in ⇒ chỉ biết hai trạng thái. Đọc KHOAN DUNG: lạ thì hiện chung, không sập.
const LABEL = { PENDING: 'Chờ duyệt', CANCELLED: 'Đã huỷ' };
for (const b of body.data) console.log(&#96;\${b.id}  \${LABEL[b.status] ?? &#96;Trạng thái khác (\${b.status})&#96;}&#96;);</code></pre>
<pre><code class="language-bash">VERSION=1.2.0 node app.mjs</code></pre>
<div class="out">[màn hình chặn] Cần cập nhật lên 1.3.0: https://play.google.com/store/apps/details?id=example.labflow
server từ chối: 400 APP_VERSION_UNSUPPORTED — App 1.2.0 không còn được hỗ trợ; hãy cập nhật lên 1.3.0 trở lên</div>
<pre><code class="language-bash">VERSION=1.4.0 node app.mjs</code></pre>
<div class="out">[gợi ý] Đã có bản 1.5.0
bk_8  Trạng thái khác (CHECKED_IN)
bk_7  Đã huỷ
bk_6  Chờ duyệt</div>
<pre><code class="language-bash">node client-v1.mjs</code></pre>
<div class="out">bk_8  AL-305  11:00–13:00  Chờ duyệt
bk_7  AL-201  11:00–13:00  Đã huỷ
bk_6  BE-102  09:00–11:00  Chờ duyệt
tổng số chỗ của 3 phòng: 94
đặt được bk_9</div>
<p>1.2.0 hiện màn hình chặn từ cấu hình và còn bị server từ chối như tuyến phòng thủ thứ hai. 1.4.0 gợi ý cập nhật và hiện “Trạng thái khác (CHECKED_IN)” — kém đẹp hơn màn hình của 1.5, nhưng chạy. Script của 4.1 trên đường cũ vẫn thấy bk_8 đang chờ. Một server, ba thế hệ client, không ai vỡ.</p>

<h3>Luật cho nhóm có phát hành app</h3>
<ul>
  <li>Viết app theo kiểu người đọc khoan dung từ ngày đầu: bỏ qua trường lạ, giá trị enum lạ có phương án dự phòng.</li>
  <li>Server mặc định chỉ thêm; khi một giá trị mới sẽ làm client cũ bối rối, ánh xạ nó trong view của phiên bản cũ.</li>
  <li>Đặt công tắc tính năng trong cấu hình (<code>features.checkIn</code>) để tắt được nút mới mà không cần phát hành.</li>
  <li>Hiếm khi nâng <code>minVersion</code>, chỉ vì lỗi thật, sau khi xem phân bố — mỗi lần nâng là bắt người dùng ra kho ứng dụng.</li>
</ul>

<div class="pitfall"><p><strong>Bẫy — chặn cả endpoint cấu hình.</strong> Nếu <code>/app-config</code> nằm sau chốt phiên bản, app cũ không bao giờ biết được là mình phải cập nhật. Nó phải là cánh cửa luôn mở.</p></div>
<div class="pitfall"><p><strong>Bẫy — chặn client không khai.</strong> Bắt buộc <code>LabFlow-Client</code> ở mọi nơi làm hỏng curl, script và web mà chẳng được gì. Chỉ chặn bản build đã biết là hỏng.</p></div>

<h3>Khi phỏng vấn và khi đi làm</h3>
<p><strong>“Phát triển API mà app di động đang dùng thế nào?”</strong> Mặc định có nhiều phiên bản cùng sống: nhận diện phiên bản client bằng header, phục vụ cấu hình từ xa có phiên bản tối thiểu/mới nhất và công tắc tính năng, giữ thay đổi chỉ-thêm, giấu giá trị enum mới khỏi bản cũ, và chỉ ép cập nhật với bản hỏng.</p>
<p><strong>“App quá cũ thì trả mã gì?”</strong> Một mã problem riêng (LabFlow: 400 <code>APP_VERSION_UNSUPPORTED</code> kèm <code>minVersion</code> và <code>updateUrl</code>); giải thích vì sao 426 không hợp.</p>

<a class="link-card" href="https://google.aip.dev/180" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: Google AIP-180 — Backwards compatibility — đọc ngày 1/11/2026</span><span class="lc-sub">Được thêm giá trị enum vào response nhưng “cần thận trọng thích đáng” — code người dùng có thể không xử lý được; LabFlow giấu chúng khỏi v1.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
  <li>Thêm <code>appVersionGuard</code>, <code>/app-config</code> và check-in; chạy lại các output.</li>
  <li>Đặt <code>features.checkIn</code> thành <code>false</code>. Giờ <code>POST /v2/bookings/:id/check-in</code> nên trả gì? Hãy cài nó.</li>
  <li>Đếm request theo phiên bản <code>LabFlow-Client</code> trong một giờ và in tỉ lệ dưới mỗi phiên bản — con số bạn cần trước khi nâng <code>minVersion</code>.</li>
</ol>
<p><strong>Xong khi:</strong> app quá cũ có đường cập nhật rõ ràng, client v1 không bao giờ thấy <code>CHECKED_IN</code>, và app 1.4 khoan dung vẫn chạy.</p></div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Client version header</span><span class="v"><code>LabFlow-Client: android/1.4.0</code> — ai đang gọi, bản build nào.</span></div>
  <div class="kv"><span class="k">Remote config (cấu hình từ xa)</span><span class="v">Thiết lập app đọc lúc khởi động; đổi không cần phát hành.</span></div>
  <div class="kv"><span class="k">Minimum supported version</span><span class="v">Phiên bản tối thiểu; thấp hơn thì phải cập nhật; hiếm khi nâng.</span></div>
  <div class="kv"><span class="k">Feature flag (công tắc tính năng)</span><span class="v">Bật/tắt một tính năng mà không cần phát hành app.</span></div>
  <div class="kv"><span class="k">Forced update (ép cập nhật)</span><span class="v">Chặn một bản build cho tới khi người dùng cập nhật.</span></div>
  <div class="kv"><span class="k">Semantic version (semver)</span><span class="v">MAJOR.MINOR.PATCH, so từng con số (1.10.0 &gt; 1.9.0).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>App cập nhật muộn hoặc không bao giờ: luôn có nhiều phiên bản cùng sống.</li>
  <li>Nhận diện bản build bằng header; phục vụ <code>/app-config</code> trước mọi chốt chặn.</li>
  <li>Chỉ chặn bản build đã biết là hỏng (400 <code>APP_VERSION_UNSUPPORTED</code> kèm link cập nhật).</li>
  <li>Giá trị enum mới chỉ vào phiên bản mới; view cũ ánh xạ nó về nghĩa cũ gần nhất.</li>
  <li>Đo được: 1.2.0 bị từ chối kèm đường cập nhật, 1.4.0 vẫn chạy nhờ đọc khoan dung, script của 4.1 không bị ảnh hưởng.</li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── 4.5 Lab (bài MỚI) ─────────────────────────── */
    {
      title: '4.5 — Lab 4: devices, version 2 (rename without breaking, deprecation, contract test — with rubric)|||4.5 — Lab 4: thiết bị phiên bản 2 (đổi tên không làm vỡ, khai tử, test hợp đồng — có thang chấm)',
      slug: 'api-4-5-lab',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Lab chương: serialNo thành serialNumber ở v2, v1 giữ nguyên và khai tử đúng chuẩn, luật dùng chung, báo cáo ai còn dùng, test hợp đồng node:test xanh rồi đỏ khi cố ý làm vỡ; thang chấm 10 điểm, lời giải và transcript thật.',
      content: `${GL4}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lab</span>
<h2>Lab 4 — Devices, version 2</h2>
<p class="lead">The inventory team wants the field <code>serialNo</code> renamed to <code>serialNumber</code> — the name the new barcode scanner app and the school’s asset system use. Lesson 4.1 proved a rename breaks old clients silently. Your job: ship it in <code>/v2</code>, keep <code>/v1</code> working exactly as before, announce the end of <code>/v1/devices</code> properly, and write a test that turns red the day somebody breaks the v1 contract by accident.</p>

<h3>The request</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">A</span><span class="lz-t">design</span><span class="lz-d">what changes in v2, what v1 keeps</span></div>
  <div class="lz-step"><span class="lz-k">B</span><span class="lz-t">build</span><span class="lz-d">one router, two views, Deprecation + Sunset</span></div>
  <div class="lz-step"><span class="lz-k">C</span><span class="lz-t">prove</span><span class="lz-d">contract tests for v1 still green</span></div>
  <div class="lz-step"><span class="lz-k">score</span><span class="lz-t">rubric</span><span class="lz-d">10 points, pass at 7</span></div>
</div>
<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc9745.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: RFC 9745 — The Deprecation HTTP Response Header Field (Mar 2025) — read 1 Nov 2026</span><span class="lc-sub">The header this lab sends on /v1/devices, together with Sunset.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<ul>
  <li>“In v2, devices have <code>serialNumber</code>, in responses <strong>and</strong> in POST/PUT/PATCH bodies. <code>serialNo</code> in a v2 body is an error.”</li>
  <li>“v1 must not change at all — the lab managers’ script reads <code>serialNo</code>.”</li>
  <li>“The same rules in both versions: a duplicate serial is 409 whichever name you used.”</li>
  <li>“Tell v1 users that <code>/v1/devices</code> is deprecated from 15 November 2026 and goes away on 1 June 2027, and where to go.”</li>
  <li>“We want to see who still uses <code>/v1/devices</code>.”</li>
</ul>
<p>Budget: design 15 min · build 60–90 min · prove 20 min. Start from your code at the end of lesson 4.4.</p>

<h3>Part A — design before you code (<code>DESIGN.md</code>)</h3>
<ol>
  <li>Is the rename breaking? For which clients, loud or silent? (Use 4.1’s classification.)</li>
  <li>Where does the internal record keep the serial — <code>serialNo</code>, <code>serialNumber</code>, or both? Why only one?</li>
  <li>The exact headers for <code>GET /v1/devices/dev_1</code>: <code>Deprecation</code>, <code>Sunset</code>, <code>Link</code>. Check the rule between the two dates.</li>
  <li>What answers <code>GET /v1/devices/dev_1</code> on 2 June 2027?</li>
  <li>The v1 contract as data: every member of a v1 device and its type.</li>
</ol>

<h3>Part B — build it: rules</h3>
<ol>
  <li><code>toDeviceV2</code> in <code>views.js</code>; <code>VIEWS[2].device</code> uses it. <code>toDevice</code> (v1) is <strong>not edited</strong>.</li>
  <li>v2 schemas with <code>serialNumber</code>, built from the same field rules as v1 (no copy-pasted regex).</li>
  <li>One function turns a v2 body into the internal form; after it, POST/PUT/PATCH and <code>checkRules</code> are shared.</li>
  <li><code>deprecate()</code> from 4.3 on <code>/v1/devices</code> only, with successor <code>/v2/…</code>; the usage report shows it.</li>
  <li><code>test/contract-v1.test.mjs</code> with <code>node:test</code>: shape of single and listed v1 devices, POST v1 with <code>serialNo</code>, the deprecation headers, v1/v2 agreement. <code>npm test</code> runs it.</li>
  <li>Prove the test works: break v1 on purpose, watch it go red, revert.</li>
</ol>

<h3>Part C — prove it (<code>TRANSCRIPT.md</code>)</h3>
<ol>
  <li><code>curl -i /v1/devices/dev_1</code> → three deprecation signals, body with <code>serialNo</code>.</li>
  <li><code>/v2/devices/dev_1</code> → <code>serialNumber</code>, same value.</li>
  <li>Create through v2, read through v1.</li>
  <li><code>serialNo</code> in a v2 body → 400 naming both members.</li>
  <li>Duplicate serial through v2 and through v1 → the same 409.</li>
  <li>The usage report for <code>/v1/devices</code>.</li>
  <li><code>npm test</code> green; then the red run from rule 6.</li>
</ol>

<h3>Rubric — 10 points</h3>
<table>
  <thead><tr><th>Points</th><th>Criterion</th><th>Checked by</th></tr></thead>
  <tbody>
    <tr><td>2</td><td>v2 uses <code>serialNumber</code> everywhere, rejects <code>serialNo</code></td><td>steps 2, 3, 4</td></tr>
    <tr><td>2</td><td>v1 byte-for-byte unchanged in shape; one internal field; shared rules</td><td>steps 1, 3, 5 · code</td></tr>
    <tr><td>2</td><td>Correct Deprecation / Sunset / Link (dates in order, successor in v2)</td><td>step 1 · Part A</td></tr>
    <tr><td>2</td><td>Contract test: green now, red when v1 is broken on purpose</td><td>step 7</td></tr>
    <tr><td>1</td><td>Usage report shows who still calls <code>/v1/devices</code></td><td>step 6</td></tr>
    <tr><td>1</td><td>Transcript complete and unedited</td><td>the file</td></tr>
  </tbody>
</table>
<p><strong>Pass: 7/10.</strong> Hand in <code>DESIGN.md</code>, the changed files, the test and <code>TRANSCRIPT.md</code> in one commit.</p>

<h3>Stretch goals</h3>
<ul>
  <li>Run the contract test in CI on every push (the GitHub Actions course).</li>
  <li>Generate <code>v1-device.json</code> from a real response once, then freeze it; discuss why you must never regenerate it automatically.</li>
  <li>Add the v2 contract file and a second test, so v2 cannot drift either.</li>
</ul>

<h3>Reference solution — read after you have tried</h3>
<p><strong>Design.</strong> The rename is breaking and silent for readers (<code>undefined</code>), loud for writers (400 for an unknown field). The record keeps <code>serialNo</code>: one source of truth, two names only at the edge. Headers: <code>Deprecation: @1794700800</code> (2026-11-15), <code>Sunset: Tue, 01 Jun 2027 00:00:00 GMT</code> (later, as RFC 9745 requires), <code>Link: …; rel="deprecation", &lt;/v2/devices/dev_1&gt;; rel="successor-version"</code>. On 2 June 2027: 410 <code>API_SUNSET</code> with the successor.</p>
<pre><code class="language-javascript">// views.js
export const toDeviceV2 = (d) =&gt; ({
  id: d.id, labId: d.labId, name: d.name, type: d.type, serialNumber: d.serialNo, status: d.status,
  note: d.note ?? null,
});
//   2: { lab: toLab, device: toDeviceV2, booking: toBookingV2, issue: toIssue },

// schemas.js — cùng luật, chỉ khác TÊN trường
const { serialNo, ...rest } = deviceFields;
const deviceFieldsV2 = { ...rest, serialNumber: serialNo };
export const DeviceCreateV2 = z.strictObject(deviceFieldsV2);
export const DevicePatchV2 = z.strictObject(deviceFieldsV2).partial();

// routes/devices.js — body v2 ⇒ dạng NỘI BỘ ở MỘT chỗ
const CREATE = { 1: DeviceCreate, 2: DeviceCreateV2 };
const PATCH = { 1: DevicePatch, 2: DevicePatchV2 };
function internal(body) {
  if (!('serialNumber' in body)) return body;
  const { serialNumber, ...rest } = body;
  return { ...rest, serialNo: serialNumber };
}
//   .post(...manager, validate('body', CREATE), (req, res) =&gt; { const body = internal(req.valid.body); checkRules(body); …

// app.js — khai tử RIÊNG /v1/devices, đặt trước app.use('/v1', …)
app.use('/v1/devices', deprecate({
  since: '2026-11-15T00:00:00Z',
  sunset: '2027-06-01T00:00:00Z',
  docs: 'https://labflow.example/docs/devices-v2',
  successor: (req) =&gt; req.originalUrl.replace(/^\\/v1/, '/v2'),
}));</code></pre>
<p>The v1 contract as data, and the test:</p>
<pre><code class="language-json">{
  "id": "string",
  "labId": "string",
  "name": "string",
  "type": "string",
  "serialNo": "string",
  "status": "string",
  "note": "string|null"
}</code></pre>
<pre><code class="language-javascript">// test/contract-v1.test.mjs — hợp đồng v1 viết thành test: thay đổi nào làm client v1 vỡ thì test ĐỎ
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { app } from '../src/app.js';

const V1_DEVICE = JSON.parse(readFileSync(new URL('./contract/v1-device.json', import.meta.url)));
let server, base;
before(() =&gt; new Promise((ok) =&gt; {
  server = app.listen(0, () =&gt; { base = &#96;http://localhost:\${server.address().port}&#96;; ok(); });
}));
after(() =&gt; server.close());

const typeOf = (v) =&gt; (v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v);
// v1 ĐÃ ĐÓNG BĂNG: đúng tập trường, đúng kiểu — thiếu, thừa hay đổi kiểu đều đỏ
function assertShape(obj, contract) {
  assert.deepEqual(Object.keys(obj).sort(), Object.keys(contract).sort(), 'tập trường của v1 đã đổi');
  for (const [k, types] of Object.entries(contract))
    assert.ok(types.split('|').includes(typeOf(obj[k])), &#96;\${k}: \${typeOf(obj[k])} không thuộc \${types}&#96;);
}
const MANAGER = { Authorization: 'Bearer tok_lan', 'Content-Type': 'application/json' };

test('GET /v1/devices/:id giữ hình dạng v1', async () =&gt; {
  const res = await fetch(&#96;\${base}/v1/devices/dev_3&#96;);
  assert.equal(res.status, 200);
  assertShape(await res.json(), V1_DEVICE);
});

test('mọi phần tử của GET /v1/devices giữ hình dạng v1', async () =&gt; {
  const { data } = await (await fetch(&#96;\${base}/v1/devices&#96;)).json();
  assert.ok(data.length &gt;= 3);
  for (const d of data) assertShape(d, V1_DEVICE);
});

test('POST /v1/devices vẫn nhận serialNo', async () =&gt; {
  const res = await fetch(&#96;\${base}/v1/devices&#96;, { method: 'POST', headers: MANAGER,
    body: JSON.stringify({ labId: 'lab_1', name: 'Cisco Switch 2960 #2', type: 'SWITCH', serialNo: 'FOC1932X0K8', status: 'AVAILABLE' }) });
  assert.equal(res.status, 201);
  assert.match(res.headers.get('location'), /^\\/v1\\/devices\\/dev_\\d+$/);
  assertShape(await res.json(), V1_DEVICE);
});

test('v1 báo khai tử đúng chuẩn (RFC 9745 + RFC 8594)', async () =&gt; {
  const res = await fetch(&#96;\${base}/v1/devices/dev_1&#96;);
  const dep = res.headers.get('deprecation'), sunset = res.headers.get('sunset');
  assert.match(dep, /^@\\d+$/);
  assert.ok(Date.parse(sunset) &gt;= Number(dep.slice(1)) * 1000, 'Sunset không được sớm hơn Deprecation');
  assert.match(res.headers.get('link'), /&lt;\\/v2\\/devices\\/dev_1&gt;; rel="successor-version"/);
});

test('v2 dùng serialNumber và cùng dữ liệu với v1', async () =&gt; {
  const v1 = await (await fetch(&#96;\${base}/v1/devices/dev_1&#96;)).json();
  const v2 = await (await fetch(&#96;\${base}/v2/devices/dev_1&#96;)).json();
  assert.equal(v2.serialNumber, v1.serialNo);
  assert.equal('serialNo' in v2, false);
});</code></pre>
<p>The test is deliberately strict: v1 is frozen, so even an <em>added</em> member is a failure — new members belong in v2. <code>package.json</code> gets <code>"test": "node --test --test-reporter=spec"</code>.</p>

<h3>Reference transcript (real run)</h3>
<pre><code class="language-bash">curl -si http://localhost:4000/v1/devices/dev_1 -H 'LabFlow-Client: android/1.4.0'</code></pre>
<div class="out">HTTP/1.1 200 OK
Deprecation: @1794700800
Sunset: Tue, 01 Jun 2027 00:00:00 GMT
Link: &lt;https://labflow.example/docs/devices-v2&gt;; rel="deprecation", &lt;/v2/devices/dev_1&gt;; rel="successor-version"
LabFlow-Version: 1
Content-Type: application/json; charset=utf-8
Content-Length: 160
ETag: W/"a0-hvxu53tfg2OzkrS5j99jBiAsG/Q"
Date: Sat, 31 Oct 2026 20:06:50 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "id": "dev_1",
  "labId": "lab_1",
  "name": "Cisco Router 2901",
  "type": "ROUTER",
  "serialNo": "FTX1840ALBQ",
  "status": "AVAILABLE",
  "note": null
}</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v2/devices/dev_1 | jq -c .</code></pre>
<div class="out">{"id":"dev_1","labId":"lab_1","name":"Cisco Router 2901","type":"ROUTER","serialNumber":"FTX1840ALBQ","status":"AVAILABLE","note":null}</div>
<pre><code class="language-bash">curl -si -X POST http://localhost:4000/v2/devices \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"labId":"lab_2","name":"ESP32 DevKit","type":"BOARD","serialNumber":"ESP32-7781","status":"AVAILABLE"}' | grep -E '^(HTTP|Location)'</code></pre>
<div class="out">HTTP/1.1 201 Created
Location: /v2/devices/dev_4</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v1/devices/dev_4 | jq -c '{id, serialNo}'</code></pre>
<div class="out">{"id":"dev_4","serialNo":"ESP32-7781"}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/devices \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'Accept-Language: en' \\
  --json '{"labId":"lab_2","name":"ESP32 DevKit","type":"BOARD","serialNo":"ESP32-7782","status":"AVAILABLE"}' | jq -c '.errors'</code></pre>
<div class="out">[{"pointer":"#/serialNumber","detail":"Invalid input: expected string, received undefined"},{"pointer":"#/serialNo","detail":"unknown field"}]</div>
<pre><code class="language-bash">curl -s \\
  -X PATCH http://localhost:4000/v2/devices/dev_2 \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'Content-Type: application/merge-patch+json' \\
  -d '{"serialNumber":"FTX1840ALBQ"}' | jq -c '{status, code, detail}'</code></pre>
<div class="out">{"status":409,"code":"DUPLICATE_SERIAL","detail":"Đã có thiết bị mang số serial FTX1840ALBQ"}</div>
<pre><code class="language-bash">curl -s \\
  -X PATCH http://localhost:4000/v1/devices/dev_2 \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'Content-Type: application/merge-patch+json' \\
  -d '{"serialNo":"FTX1840ALBQ"}' | jq -c '{status, code, detail}'</code></pre>
<div class="out">{"status":409,"code":"DUPLICATE_SERIAL","detail":"Đã có thiết bị mang số serial FTX1840ALBQ"}</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v1/admin/deprecations \\
  -H 'Authorization: Bearer tok_lan' | jq -c '.data[]'</code></pre>
<div class="out">{"route":"GET /v1/devices","client":"android/1.4.0","count":1,"lastSeen":"2026-10-31T20:06:50.765Z"}
{"route":"GET /v1/devices","client":"curl/8.7.1","count":1,"lastSeen":"2026-10-31T20:06:50.811Z"}
{"route":"PATCH /v1/devices","client":"curl/8.7.1","count":1,"lastSeen":"2026-10-31T20:06:50.858Z"}</div>
<pre><code class="language-bash">npm test 2&gt;&amp;1 | grep -E '^(✔|✖|ℹ (tests|pass|fail))'</code></pre>
<div class="out">✔ GET /v1/devices/:id giữ hình dạng v1 (30.802916ms)
✔ mọi phần tử của GET /v1/devices giữ hình dạng v1 (3.73875ms)
✔ POST /v1/devices vẫn nhận serialNo (9.296958ms)
✔ v1 báo khai tử đúng chuẩn (RFC 9745 + RFC 8594) (1.360583ms)
✔ v2 dùng serialNumber và cùng dữ liệu với v1 (2.292417ms)
ℹ tests 5
ℹ pass 5
ℹ fail 0</div>
<p>Rule 6 — the “just rename it in <code>toDevice</code>” mistake, made on purpose in a copy of the project (<code>serialNo: d.serialNo</code> → <code>serialNumber: d.serialNo</code>), then <code>npm test</code>:</p>
<div class="out">✖ failing tests:

test at test/contract-v1.test.mjs:23:1
✖ GET /v1/devices/:id giữ hình dạng v1 (33.833625ms)
  AssertionError [ERR_ASSERTION]: tập trường của v1 đã đổi
  + actual - expected

    [
      'id',
      'labId',
      'name',
      'note',
  +   'serialNumber',
  -   'serialNo',
      'status',
      'type'
    ]
… (4 of 5 tests fail: single device, list, POST v1, v1/v2 agreement)</div>
<p>The same edit that produced <em>Invalid Date</em> silently in 4.1 is now a red test with the exact member named — before any user sees it.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Lab</span>
<h2>Lab 4 — Thiết bị, phiên bản 2</h2>
<p class="lead">Nhóm kiểm kê muốn đổi tên trường <code>serialNo</code> thành <code>serialNumber</code> — cái tên mà app quét mã vạch mới và hệ thống tài sản của trường đang dùng. Bài 4.1 đã chứng minh đổi tên làm client cũ vỡ lặng lẽ. Việc của bạn: phát hành nó ở <code>/v2</code>, giữ <code>/v1</code> chạy y hệt như trước, thông báo đúng chuẩn ngày kết thúc của <code>/v1/devices</code>, và viết một test chuyển đỏ vào đúng ngày ai đó vô tình làm vỡ hợp đồng v1.</p>

<h3>Yêu cầu</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">A</span><span class="lz-t">thiết kế</span><span class="lz-d">v2 đổi gì, v1 giữ gì</span></div>
  <div class="lz-step"><span class="lz-k">B</span><span class="lz-t">xây</span><span class="lz-d">một router, hai view, Deprecation + Sunset</span></div>
  <div class="lz-step"><span class="lz-k">C</span><span class="lz-t">chứng minh</span><span class="lz-d">test hợp đồng v1 vẫn xanh</span></div>
  <div class="lz-step"><span class="lz-k">chấm</span><span class="lz-t">thang điểm</span><span class="lz-d">10 điểm, đạt từ 7</span></div>
</div>
<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc9745.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: RFC 9745 — The Deprecation HTTP Response Header Field (3/2025) — đọc ngày 1/11/2026</span><span class="lc-sub">Header mà lab này gửi trên /v1/devices, cùng với Sunset.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<ul>
  <li>“Ở v2, thiết bị có <code>serialNumber</code>, trong response <strong>và</strong> trong body POST/PUT/PATCH. <code>serialNo</code> trong body v2 là lỗi.”</li>
  <li>“v1 không được đổi gì — script của các quản lý lab đọc <code>serialNo</code>.”</li>
  <li>“Cùng một bộ luật cho cả hai phiên bản: trùng số serial là 409 dù dùng tên nào.”</li>
  <li>“Báo cho người dùng v1 rằng <code>/v1/devices</code> bị khai tử từ 15/11/2026, ngừng hẳn ngày 1/6/2027, và chuyển sang đâu.”</li>
  <li>“Chúng tôi muốn biết ai còn dùng <code>/v1/devices</code>.”</li>
</ul>
<p>Thời gian: thiết kế 15 phút · xây 60–90 phút · chứng minh 20 phút. Bắt đầu từ code của bạn cuối bài 4.4.</p>

<h3>Phần A — thiết kế trước khi code (<code>DESIGN.md</code>)</h3>
<ol>
  <li>Đổi tên có phá vỡ không? Với client nào, ồn ào hay lặng lẽ? (Dùng bảng phân loại của 4.1.)</li>
  <li>Bản ghi nội bộ giữ số serial ở đâu — <code>serialNo</code>, <code>serialNumber</code>, hay cả hai? Vì sao chỉ một?</li>
  <li>Header chính xác của <code>GET /v1/devices/dev_1</code>: <code>Deprecation</code>, <code>Sunset</code>, <code>Link</code>. Kiểm luật giữa hai ngày.</li>
  <li>Ngày 2/6/2027 <code>GET /v1/devices/dev_1</code> trả gì?</li>
  <li>Hợp đồng v1 viết thành dữ liệu: mọi trường của một thiết bị v1 và kiểu của nó.</li>
</ol>

<h3>Phần B — xây: các luật</h3>
<ol>
  <li><code>toDeviceV2</code> trong <code>views.js</code>; <code>VIEWS[2].device</code> dùng nó. <code>toDevice</code> (v1) <strong>không được sửa</strong>.</li>
  <li>Lược đồ v2 có <code>serialNumber</code>, dựng từ chính các luật trường của v1 (không chép-dán regex).</li>
  <li>Một hàm biến body v2 thành dạng nội bộ; sau nó, POST/PUT/PATCH và <code>checkRules</code> dùng chung.</li>
  <li><code>deprecate()</code> của 4.3 chỉ gắn cho <code>/v1/devices</code>, đường thay thế là <code>/v2/…</code>; báo cáo mức dùng hiện nó.</li>
  <li><code>test/contract-v1.test.mjs</code> bằng <code>node:test</code>: hình dạng thiết bị v1 (một cái và trong danh sách), POST v1 với <code>serialNo</code>, header khai tử, v1/v2 khớp nhau. <code>npm test</code> chạy nó.</li>
  <li>Chứng minh test có tác dụng: cố ý làm vỡ v1, xem nó đỏ, rồi trả lại.</li>
</ol>

<h3>Phần C — chứng minh (<code>TRANSCRIPT.md</code>)</h3>
<ol>
  <li><code>curl -i /v1/devices/dev_1</code> → ba tín hiệu khai tử, body có <code>serialNo</code>.</li>
  <li><code>/v2/devices/dev_1</code> → <code>serialNumber</code>, cùng giá trị.</li>
  <li>Tạo qua v2, đọc qua v1.</li>
  <li><code>serialNo</code> trong body v2 → 400 nêu tên cả hai trường.</li>
  <li>Trùng số serial qua v2 và qua v1 → cùng một lỗi 409.</li>
  <li>Báo cáo mức dùng của <code>/v1/devices</code>.</li>
  <li><code>npm test</code> xanh; rồi lần chạy đỏ của luật 6.</li>
</ol>

<h3>Thang chấm — 10 điểm</h3>
<table>
  <thead><tr><th>Điểm</th><th>Tiêu chí</th><th>Kiểm bằng</th></tr></thead>
  <tbody>
    <tr><td>2</td><td>v2 dùng <code>serialNumber</code> ở mọi nơi, từ chối <code>serialNo</code></td><td>bước 2, 3, 4</td></tr>
    <tr><td>2</td><td>Hình dạng v1 giữ nguyên từng trường; một trường nội bộ; luật dùng chung</td><td>bước 1, 3, 5 · code</td></tr>
    <tr><td>2</td><td>Deprecation / Sunset / Link đúng (ngày đúng thứ tự, đường thay thế ở v2)</td><td>bước 1 · Phần A</td></tr>
    <tr><td>2</td><td>Test hợp đồng: xanh lúc này, đỏ khi cố ý làm vỡ v1</td><td>bước 7</td></tr>
    <tr><td>1</td><td>Báo cáo mức dùng cho thấy ai còn gọi <code>/v1/devices</code></td><td>bước 6</td></tr>
    <tr><td>1</td><td>Transcript đầy đủ, không chỉnh sửa</td><td>tệp nộp</td></tr>
  </tbody>
</table>
<p><strong>Đạt: 7/10.</strong> Nộp <code>DESIGN.md</code>, các tệp đã sửa, test và <code>TRANSCRIPT.md</code> trong một commit.</p>

<h3>Mục tiêu nâng cao</h3>
<ul>
  <li>Chạy test hợp đồng trong CI mỗi lần push (khoá GitHub Actions).</li>
  <li>Sinh <code>v1-device.json</code> từ một response thật một lần, rồi đóng băng nó; bàn vì sao không bao giờ được tự động sinh lại.</li>
  <li>Thêm tệp hợp đồng v2 và test thứ hai, để v2 cũng không trôi dạt.</li>
</ul>

<h3>Lời giải tham khảo — đọc sau khi đã tự làm</h3>
<p><strong>Thiết kế.</strong> Đổi tên là phá vỡ, lặng lẽ với bên đọc (<code>undefined</code>), ồn ào với bên ghi (400 vì trường lạ). Bản ghi giữ <code>serialNo</code>: một nguồn sự thật, hai cái tên chỉ ở mép. Header: <code>Deprecation: @1794700800</code> (15/11/2026), <code>Sunset: Tue, 01 Jun 2027 00:00:00 GMT</code> (muộn hơn, đúng như RFC 9745 đòi), <code>Link: …; rel="deprecation", &lt;/v2/devices/dev_1&gt;; rel="successor-version"</code>. Ngày 2/6/2027: 410 <code>API_SUNSET</code> kèm đường thay thế.</p>
<pre><code class="language-javascript">// views.js
export const toDeviceV2 = (d) =&gt; ({
  id: d.id, labId: d.labId, name: d.name, type: d.type, serialNumber: d.serialNo, status: d.status,
  note: d.note ?? null,
});
//   2: { lab: toLab, device: toDeviceV2, booking: toBookingV2, issue: toIssue },

// schemas.js — cùng luật, chỉ khác TÊN trường
const { serialNo, ...rest } = deviceFields;
const deviceFieldsV2 = { ...rest, serialNumber: serialNo };
export const DeviceCreateV2 = z.strictObject(deviceFieldsV2);
export const DevicePatchV2 = z.strictObject(deviceFieldsV2).partial();

// routes/devices.js — body v2 ⇒ dạng NỘI BỘ ở MỘT chỗ
const CREATE = { 1: DeviceCreate, 2: DeviceCreateV2 };
const PATCH = { 1: DevicePatch, 2: DevicePatchV2 };
function internal(body) {
  if (!('serialNumber' in body)) return body;
  const { serialNumber, ...rest } = body;
  return { ...rest, serialNo: serialNumber };
}
//   .post(...manager, validate('body', CREATE), (req, res) =&gt; { const body = internal(req.valid.body); checkRules(body); …

// app.js — khai tử RIÊNG /v1/devices, đặt trước app.use('/v1', …)
app.use('/v1/devices', deprecate({
  since: '2026-11-15T00:00:00Z',
  sunset: '2027-06-01T00:00:00Z',
  docs: 'https://labflow.example/docs/devices-v2',
  successor: (req) =&gt; req.originalUrl.replace(/^\\/v1/, '/v2'),
}));</code></pre>
<p>Hợp đồng v1 viết thành dữ liệu, và bài test:</p>
<pre><code class="language-json">{
  "id": "string",
  "labId": "string",
  "name": "string",
  "type": "string",
  "serialNo": "string",
  "status": "string",
  "note": "string|null"
}</code></pre>
<pre><code class="language-javascript">// test/contract-v1.test.mjs — hợp đồng v1 viết thành test: thay đổi nào làm client v1 vỡ thì test ĐỎ
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { app } from '../src/app.js';

const V1_DEVICE = JSON.parse(readFileSync(new URL('./contract/v1-device.json', import.meta.url)));
let server, base;
before(() =&gt; new Promise((ok) =&gt; {
  server = app.listen(0, () =&gt; { base = &#96;http://localhost:\${server.address().port}&#96;; ok(); });
}));
after(() =&gt; server.close());

const typeOf = (v) =&gt; (v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v);
// v1 ĐÃ ĐÓNG BĂNG: đúng tập trường, đúng kiểu — thiếu, thừa hay đổi kiểu đều đỏ
function assertShape(obj, contract) {
  assert.deepEqual(Object.keys(obj).sort(), Object.keys(contract).sort(), 'tập trường của v1 đã đổi');
  for (const [k, types] of Object.entries(contract))
    assert.ok(types.split('|').includes(typeOf(obj[k])), &#96;\${k}: \${typeOf(obj[k])} không thuộc \${types}&#96;);
}
const MANAGER = { Authorization: 'Bearer tok_lan', 'Content-Type': 'application/json' };

test('GET /v1/devices/:id giữ hình dạng v1', async () =&gt; {
  const res = await fetch(&#96;\${base}/v1/devices/dev_3&#96;);
  assert.equal(res.status, 200);
  assertShape(await res.json(), V1_DEVICE);
});

test('mọi phần tử của GET /v1/devices giữ hình dạng v1', async () =&gt; {
  const { data } = await (await fetch(&#96;\${base}/v1/devices&#96;)).json();
  assert.ok(data.length &gt;= 3);
  for (const d of data) assertShape(d, V1_DEVICE);
});

test('POST /v1/devices vẫn nhận serialNo', async () =&gt; {
  const res = await fetch(&#96;\${base}/v1/devices&#96;, { method: 'POST', headers: MANAGER,
    body: JSON.stringify({ labId: 'lab_1', name: 'Cisco Switch 2960 #2', type: 'SWITCH', serialNo: 'FOC1932X0K8', status: 'AVAILABLE' }) });
  assert.equal(res.status, 201);
  assert.match(res.headers.get('location'), /^\\/v1\\/devices\\/dev_\\d+$/);
  assertShape(await res.json(), V1_DEVICE);
});

test('v1 báo khai tử đúng chuẩn (RFC 9745 + RFC 8594)', async () =&gt; {
  const res = await fetch(&#96;\${base}/v1/devices/dev_1&#96;);
  const dep = res.headers.get('deprecation'), sunset = res.headers.get('sunset');
  assert.match(dep, /^@\\d+$/);
  assert.ok(Date.parse(sunset) &gt;= Number(dep.slice(1)) * 1000, 'Sunset không được sớm hơn Deprecation');
  assert.match(res.headers.get('link'), /&lt;\\/v2\\/devices\\/dev_1&gt;; rel="successor-version"/);
});

test('v2 dùng serialNumber và cùng dữ liệu với v1', async () =&gt; {
  const v1 = await (await fetch(&#96;\${base}/v1/devices/dev_1&#96;)).json();
  const v2 = await (await fetch(&#96;\${base}/v2/devices/dev_1&#96;)).json();
  assert.equal(v2.serialNumber, v1.serialNo);
  assert.equal('serialNo' in v2, false);
});</code></pre>
<p>Test cố ý khắt khe: v1 đã đóng băng, nên kể cả một trường <em>thêm</em> cũng là lỗi — trường mới thuộc về v2. <code>package.json</code> có thêm <code>"test": "node --test --test-reporter=spec"</code>.</p>

<h3>Transcript tham khảo (chạy thật)</h3>
<pre><code class="language-bash">curl -si http://localhost:4000/v1/devices/dev_1 -H 'LabFlow-Client: android/1.4.0'</code></pre>
<div class="out">HTTP/1.1 200 OK
Deprecation: @1794700800
Sunset: Tue, 01 Jun 2027 00:00:00 GMT
Link: &lt;https://labflow.example/docs/devices-v2&gt;; rel="deprecation", &lt;/v2/devices/dev_1&gt;; rel="successor-version"
LabFlow-Version: 1
Content-Type: application/json; charset=utf-8
Content-Length: 160
ETag: W/"a0-hvxu53tfg2OzkrS5j99jBiAsG/Q"
Date: Sat, 31 Oct 2026 20:06:50 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "id": "dev_1",
  "labId": "lab_1",
  "name": "Cisco Router 2901",
  "type": "ROUTER",
  "serialNo": "FTX1840ALBQ",
  "status": "AVAILABLE",
  "note": null
}</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v2/devices/dev_1 | jq -c .</code></pre>
<div class="out">{"id":"dev_1","labId":"lab_1","name":"Cisco Router 2901","type":"ROUTER","serialNumber":"FTX1840ALBQ","status":"AVAILABLE","note":null}</div>
<pre><code class="language-bash">curl -si -X POST http://localhost:4000/v2/devices \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"labId":"lab_2","name":"ESP32 DevKit","type":"BOARD","serialNumber":"ESP32-7781","status":"AVAILABLE"}' | grep -E '^(HTTP|Location)'</code></pre>
<div class="out">HTTP/1.1 201 Created
Location: /v2/devices/dev_4</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v1/devices/dev_4 | jq -c '{id, serialNo}'</code></pre>
<div class="out">{"id":"dev_4","serialNo":"ESP32-7781"}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/devices \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'Accept-Language: en' \\
  --json '{"labId":"lab_2","name":"ESP32 DevKit","type":"BOARD","serialNo":"ESP32-7782","status":"AVAILABLE"}' | jq -c '.errors'</code></pre>
<div class="out">[{"pointer":"#/serialNumber","detail":"Invalid input: expected string, received undefined"},{"pointer":"#/serialNo","detail":"unknown field"}]</div>
<pre><code class="language-bash">curl -s \\
  -X PATCH http://localhost:4000/v2/devices/dev_2 \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'Content-Type: application/merge-patch+json' \\
  -d '{"serialNumber":"FTX1840ALBQ"}' | jq -c '{status, code, detail}'</code></pre>
<div class="out">{"status":409,"code":"DUPLICATE_SERIAL","detail":"Đã có thiết bị mang số serial FTX1840ALBQ"}</div>
<pre><code class="language-bash">curl -s \\
  -X PATCH http://localhost:4000/v1/devices/dev_2 \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'Content-Type: application/merge-patch+json' \\
  -d '{"serialNo":"FTX1840ALBQ"}' | jq -c '{status, code, detail}'</code></pre>
<div class="out">{"status":409,"code":"DUPLICATE_SERIAL","detail":"Đã có thiết bị mang số serial FTX1840ALBQ"}</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v1/admin/deprecations \\
  -H 'Authorization: Bearer tok_lan' | jq -c '.data[]'</code></pre>
<div class="out">{"route":"GET /v1/devices","client":"android/1.4.0","count":1,"lastSeen":"2026-10-31T20:06:50.765Z"}
{"route":"GET /v1/devices","client":"curl/8.7.1","count":1,"lastSeen":"2026-10-31T20:06:50.811Z"}
{"route":"PATCH /v1/devices","client":"curl/8.7.1","count":1,"lastSeen":"2026-10-31T20:06:50.858Z"}</div>
<pre><code class="language-bash">npm test 2&gt;&amp;1 | grep -E '^(✔|✖|ℹ (tests|pass|fail))'</code></pre>
<div class="out">✔ GET /v1/devices/:id giữ hình dạng v1 (30.802916ms)
✔ mọi phần tử của GET /v1/devices giữ hình dạng v1 (3.73875ms)
✔ POST /v1/devices vẫn nhận serialNo (9.296958ms)
✔ v1 báo khai tử đúng chuẩn (RFC 9745 + RFC 8594) (1.360583ms)
✔ v2 dùng serialNumber và cùng dữ liệu với v1 (2.292417ms)
ℹ tests 5
ℹ pass 5
ℹ fail 0</div>
<p>Luật 6 — lỗi “đổi tên luôn trong <code>toDevice</code> cho nhanh”, cố ý làm trên một bản sao dự án (<code>serialNo: d.serialNo</code> → <code>serialNumber: d.serialNo</code>), rồi <code>npm test</code>:</p>
<div class="out">✖ failing tests:

test at test/contract-v1.test.mjs:23:1
✖ GET /v1/devices/:id giữ hình dạng v1 (33.833625ms)
  AssertionError [ERR_ASSERTION]: tập trường của v1 đã đổi
  + actual - expected

    [
      'id',
      'labId',
      'name',
      'note',
  +   'serialNumber',
  -   'serialNo',
      'status',
      'type'
    ]
… (4 trên 5 test đỏ: một thiết bị, danh sách, POST v1, v1/v2 khớp nhau)</div>
<p>Đúng cái sửa đã lặng lẽ sinh ra <em>Invalid Date</em> ở bài 4.1, giờ thành một test đỏ nêu chính xác tên trường — trước khi bất kỳ người dùng nào thấy.</p>
</div>
`,
    },
    /* ─────────────────────────── 4.6 Quiz (bài MỚI) ─────────────────────────── */
    {
      title: '4.6 — Chapter 4 check: versioning and evolution|||4.6 — Kiểm tra Chương 4: phiên bản và tiến hoá API',
      slug: 'api-4-6-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống về vỡ lặng lẽ, đổi kiểu, tolerant reader, thay đổi không phá vỡ, một router hai phiên bản, Vary, Deprecation/Sunset, 410, cấu hình app và giá trị enum mới; mỗi câu có giải thích.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Check</span>
<h2>Chapter 4 check: versioning and evolution</h2>
<p class="lead">Ten situations from LabFlow’s old client, its two versions, the deprecation of the old paths and the mobile apps. Each explanation says why the right answer is right and why the most tempting wrong answer is wrong. Aim for 7/10.</p>
<h3>Self-check before you start</h3>
<ul>
  <li>I can say whether a change is breaking, for which clients, and whether the break is loud or silent.</li>
  <li>I can explain URL, header, media-type and date-based versioning and why LabFlow uses major versions in the URL.</li>
  <li>I can serve two versions from one router with versioned schemas and views.</li>
  <li>I can write correct <code>Deprecation</code>, <code>Sunset</code> and <code>Link</code> headers and answer 410 after the date.</li>
  <li>I can design for mobile apps that never update: version header, remote config, tolerant readers.</li>
  <li>My Lab 4 contract test goes red when v1 is broken.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Kiểm tra</span>
<h2>Kiểm tra Chương 4: phiên bản và tiến hoá API</h2>
<p class="lead">Mười tình huống từ client cũ của LabFlow, hai phiên bản của nó, việc khai tử đường cũ và các app di động. Mỗi phần giải thích nói vì sao đáp án đúng là đúng và vì sao phương án hấp dẫn nhất lại sai. Nhắm 7/10.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
  <li>Tôi nói được một thay đổi có phá vỡ không, với client nào, và vỡ ồn ào hay lặng lẽ.</li>
  <li>Tôi giải thích được phiên bản bằng URL, header, media type, theo ngày và vì sao LabFlow dùng phiên bản lớn trong URL.</li>
  <li>Tôi phục vụ được hai phiên bản từ một router với lược đồ và view theo phiên bản.</li>
  <li>Tôi viết đúng header <code>Deprecation</code>, <code>Sunset</code>, <code>Link</code> và trả 410 sau ngày hẹn.</li>
  <li>Tôi thiết kế được cho app di động không bao giờ cập nhật: header phiên bản, cấu hình từ xa, đọc khoan dung.</li>
  <li>Test hợp đồng của Lab 4 chuyển đỏ khi v1 bị làm vỡ.</li>
</ul>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: "LabFlow renamed startAt/endAt to start/end. What did the unchanged client-v1.mjs do?|||LabFlow đổi tên startAt/endAt thành start/end. client-v1.mjs không sửa gì đã làm gì?",
            options: [
              "Crashed with TypeError on the first booking|||Sập với TypeError ở lượt đặt đầu tiên",
              "Printed “Invalid Date–Invalid Date” for every booking and threw nothing|||In “Invalid Date–Invalid Date” cho mọi lượt đặt và không ném lỗi nào",
              "Got 400 from the server|||Nhận 400 từ server",
              "Kept working because JSON ignores renamed members|||Vẫn chạy vì JSON bỏ qua trường bị đổi tên",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: new Date(undefined) is an Invalid Date, not an exception — a silent break that no error tracker reports (lesson 4.1). Option A is what the new enum value caused.|||VI: new Date(undefined) là Invalid Date chứ không phải ngoại lệ — vỡ lặng lẽ, không hệ thống báo lỗi nào bắt được (bài 4.1). Phương án A là chuyện do giá trị enum mới gây ra.",
          },
          {
            question: "capacity changed from the number 30 to the string \"30\". The client’s sum of three labs became …|||capacity đổi từ số 30 sang chuỗi \"30\". Tổng chỗ ba phòng của client thành …",
            options: [
              "94, because JavaScript converts strings to numbers when adding|||94, vì JavaScript đổi chuỗi sang số khi cộng",
              "NaN|||NaN",
              "0243040 — the strings were concatenated|||0243040 — các chuỗi bị nối vào nhau",
              "a TypeError|||một TypeError",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: 0 + \"24\" is \"024\"; + then concatenates every following value. A type change is breaking even when nothing is renamed (lesson 4.1).|||VI: 0 + \"24\" là \"024\"; dấu + sau đó nối mọi giá trị tiếp theo. Đổi kiểu là phá vỡ dù không đổi tên gì (bài 4.1).",
          },
          {
            question: "Adding the member floor to labs broke client-strict.mjs but not client-v1.mjs. What makes “adding is non-breaking” true?|||Thêm trường floor cho phòng làm hỏng client-strict.mjs nhưng không hỏng client-v1.mjs. Điều gì làm “thêm là không phá” trở thành đúng?",
            options: [
              "Documenting the tolerant-reader rule: clients must ignore unknown members|||Ghi rõ luật tolerant reader: client phải bỏ qua trường lạ",
              "Adding members only on Fridays, when traffic is low|||Chỉ thêm trường vào thứ Sáu, lúc ít người dùng",
              "Putting new members at the end of the object|||Đặt trường mới ở cuối object",
              "Using strictObject on the server’s responses|||Dùng strictObject cho response của server",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: The strict client rejected unrecognized_keys floor. Additive changes are safe only if the contract says clients ignore what they do not know; member order never matters in JSON objects.|||VI: Client chặt từ chối unrecognized_keys floor. Thay đổi chỉ-thêm chỉ an toàn khi hợp đồng nói client bỏ qua thứ mình không biết; thứ tự trường trong object JSON không bao giờ quan trọng.",
          },
          {
            question: "Which of these LabFlow changes is NOT breaking?|||Thay đổi nào sau đây của LabFlow KHÔNG phá vỡ?",
            options: [
              "Changing the default limit from 20 to 10|||Đổi limit mặc định từ 20 xuống 10",
              "Accepting purpose up to 500 characters instead of 200|||Nhận purpose dài tới 500 ký tự thay vì 200",
              "Renaming the error code BOOKING_CONFLICT|||Đổi tên mã lỗi BOOKING_CONFLICT",
              "Making purpose required in POST /bookings|||Bắt buộc purpose trong POST /bookings",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: Loosening validation keeps every old request valid. Defaults and error codes are observable behaviour (Hyrum’s law); a new required field rejects yesterday’s requests.|||VI: Nới kiểm dữ liệu giữ mọi request cũ còn hợp lệ. Mặc định và mã lỗi là hành vi quan sát được (định luật Hyrum); trường bắt buộc mới từ chối request của hôm qua.",
          },
          {
            question: "How does LabFlow serve /v1 and /v2 without two copies of the routes?|||LabFlow phục vụ /v1 và /v2 mà không có hai bản sao route bằng cách nào?",
            options: [
              "A bookings_v2 table and a second router|||Một bảng bookings_v2 và một router thứ hai",
              "Redirecting /v1 to /v2 with 301|||Chuyển hướng /v1 sang /v2 bằng 301",
              "One router; req.apiVersion picks the schema at the input and the view at the output|||Một router; req.apiVersion chọn lược đồ ở mép vào và view ở mép ra",
              "Running two servers on different ports|||Chạy hai server ở hai cổng khác nhau",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: The record and the rules stay single; only the edges are versioned. A bug fix in the conflict rule fixes both versions — the old client got the same 409 as v2 (lesson 4.2).|||VI: Bản ghi và luật chỉ có một; chỉ mép được đánh phiên bản. Sửa luật trùng lịch một lần là sửa cho cả hai — client cũ nhận đúng 409 như v2 (bài 4.2).",
          },
          {
            question: "GET /bookings/bk_8 with the header LabFlow-Version: 2 returns the v2 body. Which response header must accompany it?|||GET /bookings/bk_8 với header LabFlow-Version: 2 trả body v2. Header response nào bắt buộc phải đi kèm?",
            options: [
              "Cache-Control: no-store|||Cache-Control: no-store",
              "Content-Version: 2|||Content-Version: 2",
              "Location: /v2/bookings/bk_8|||Location: /v2/bookings/bk_8",
              "Vary: LabFlow-Version|||Vary: LabFlow-Version",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: Same URL, different body depending on a request header ⇒ caches must key on that header. Without Vary a cache can serve the v1 body to a v2 client (lesson 4.2). Content-Version is not a standard header.|||VI: Cùng URL, body khác tuỳ header của request ⇒ cache phải dùng header đó làm khoá. Thiếu Vary, cache có thể trả body v1 cho client v2 (bài 4.2). Content-Version không phải header chuẩn.",
          },
          {
            question: "Which pair of headers is correct for the old paths (deprecated 1 Nov 2026, retired 1 May 2027)?|||Cặp header nào đúng cho đường cũ (khai tử 1/11/2026, ngừng 1/5/2027)?",
            options: [
              "Deprecation: @1793491200 and Sunset: Sat, 01 May 2027 00:00:00 GMT|||Deprecation: @1793491200 và Sunset: Sat, 01 May 2027 00:00:00 GMT",
              "Deprecation: true and Sunset: 2027-05-01|||Deprecation: true và Sunset: 2027-05-01",
              "Deprecation: Sat, 01 May 2027 00:00:00 GMT and Sunset: @1793491200|||Deprecation: Sat, 01 May 2027 00:00:00 GMT và Sunset: @1793491200",
              "Warning: 299 deprecated and Expires: 2027-05-01|||Warning: 299 deprecated và Expires: 2027-05-01",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: RFC 9745: Deprecation is a structured-field date (@ + Unix seconds); RFC 8594: Sunset is an HTTP-date, and it must not be earlier than the Deprecation date (lesson 4.3).|||VI: RFC 9745: Deprecation là ngày dạng structured field (@ + giây Unix); RFC 8594: Sunset là HTTP-date, và không được sớm hơn ngày Deprecation (bài 4.3).",
          },
          {
            question: "After the sunset date, what should GET /bookings (the retired path) answer?|||Sau ngày sunset, GET /bookings (đường đã ngừng) nên trả gì?",
            options: [
              "404 Not Found — the route no longer exists|||404 Not Found — route không còn nữa",
              "410 Gone with a problem document naming the successor /v1/bookings|||410 Gone kèm problem document nêu đường thay thế /v1/bookings",
              "301 to /v1/bookings, silently|||301 sang /v1/bookings, lặng lẽ",
              "200 with a warning in the body|||200 kèm cảnh báo trong body",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: 410 says the resource was removed on purpose; the successor tells the developer what to do. 404 looks like a typo; a silent redirect hides that the client must change (lesson 4.3).|||VI: 410 nói tài nguyên bị gỡ có chủ đích; đường thay thế nói cho lập trình viên phải làm gì. 404 trông như gõ sai URL; chuyển hướng lặng lẽ che mất việc client phải sửa (bài 4.3).",
          },
          {
            question: "Why must GET /app-config be registered BEFORE appVersionGuard?|||Vì sao GET /app-config phải đăng ký TRƯỚC appVersionGuard?",
            options: [
              "Because Express matches routes alphabetically|||Vì Express khớp route theo bảng chữ cái",
              "So that the config can be cached longer|||Để cấu hình được cache lâu hơn",
              "Because the guard is slow|||Vì chốt chặn chạy chậm",
              "A too-old app must still be able to read it to learn that it must update|||App quá cũ vẫn phải đọc được nó để biết mình cần cập nhật",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: The config is the one door that is always open: version 1.2.0 read minVersion 1.3.0 and showed the update screen (lesson 4.4). Express matches in registration order, not alphabetically.|||VI: Cấu hình là cánh cửa luôn mở: bản 1.2.0 đọc được minVersion 1.3.0 và hiện màn hình cập nhật (bài 4.4). Express khớp theo thứ tự đăng ký, không theo bảng chữ cái.",
          },
          {
            question: "Check-in adds the status CHECKED_IN. How does LabFlow keep v1 clients from crashing like client-v1.mjs did in 4.1?|||Check-in thêm trạng thái CHECKED_IN. LabFlow giữ client v1 khỏi sập như client-v1.mjs ở bài 4.1 bằng cách nào?",
            options: [
              "It asks every v1 user to update first|||Yêu cầu mọi người dùng v1 cập nhật trước",
              "It sends CHECKED_IN to v1 with a Warning header|||Gửi CHECKED_IN cho v1 kèm header Warning",
              "The v1 view maps CHECKED_IN to PENDING and check-in exists only in v2|||View v1 ánh xạ CHECKED_IN về PENDING và check-in chỉ có ở v2",
              "It adds CHECKED_IN to v1 and raises minVersion|||Thêm CHECKED_IN vào v1 và nâng minVersion",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: New enum values go only to the version that knows them; old views show the nearest old meaning, and the v1 status filter uses the same mapping (lesson 4.4).|||VI: Giá trị enum mới chỉ vào phiên bản biết nó; view cũ hiện nghĩa cũ gần nhất, và bộ lọc trạng thái v1 dùng cùng phép ánh xạ (bài 4.4).",
          },
        ],
      },
    },
  ],
};
