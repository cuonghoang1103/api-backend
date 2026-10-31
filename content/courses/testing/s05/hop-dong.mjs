/**
 * Testing · Chương 5 · 5.4 — Contract test và OpenAPI. Slug giữ từ khung: tst-5-4-hop-dong.
 * Chạy thật: openapi.json (3.1) + Ajv 8.20 (2020-12) + ajv-formats; lộ userId/role khi trả nguyên dòng; đổi tên start ⇒ hợp đồng đỏ.
 */
import G from '../giang/tst-05-4.mjs';
import { ma, ra, lienKet } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const gon = (t) => t.split('\n').filter((l) => /^\$ |^planted|✓|×|Tests |^\+ +"/.test(l)).join('\n');

const PACT_EN = `<table>
<thead><tr><th></th><th>Provider-side contract (this lesson)</th><th>Consumer-driven contract (Pact)</th></tr></thead>
<tbody>
<tr><td>Who writes it</td><td>the API team: <code>openapi.json</code></td><td>each client, generated from its own tests</td></tr>
<tr><td>What is checked</td><td>every real response against the spec</td><td>the provider replays every client’s recorded expectations</td></tr>
<tr><td>Extra catch</td><td>leaks, renames, undocumented statuses</td><td>a field a client relies on that the spec never promised</td></tr>
<tr><td>Cost</td><td>one file and Ajv</td><td>a broker service and a workflow between teams</td></tr>
</tbody></table>`;
const PACT_VI = `<table>
<thead><tr><th></th><th>Hợp đồng phía cung cấp (bài này)</th><th>Hợp đồng do client dẫn dắt (Pact)</th></tr></thead>
<tbody>
<tr><td>Ai viết</td><td>nhóm API: <code>openapi.json</code></td><td>từng client, sinh ra từ chính test của nó</td></tr>
<tr><td>Kiểm cái gì</td><td>mọi phản hồi thật theo bản mô tả</td><td>phía cung cấp chạy lại mọi mong đợi client đã ghi</td></tr>
<tr><td>Bắt thêm</td><td>lộ dữ liệu, đổi tên, mã trạng thái chưa ghi</td><td>một trường client đang dựa vào mà bản mô tả chưa từng hứa</td></tr>
<tr><td>Giá</td><td>một file và Ajv</td><td>một dịch vụ broker và quy trình giữa các nhóm</td></tr>
</tbody></table>`;

export default {
  title: '5.4 — Contract testing and OpenAPI: when frontend and backend disagree|||5.4 — Contract test và OpenAPI: khi frontend và backend lệch nhau',
  slug: 'tst-5-4-hop-dong',
  type: 'LESSON',
  isFreePreview: true,
  description: 'openapi.json (OpenAPI 3.1) cho API LabFlow Lite; hàm contractErrors kiểm mỗi phản hồi thật: mã trạng thái phải được ghi, body phải khớp schema (Ajv 2020-12, additionalProperties false); đo thật hai bug: trả nguyên dòng làm lộ userId/role, đổi tên start → startTime làm test chỉ-status vẫn xanh còn hợp đồng đỏ; Pact so với cách làm phía cung cấp.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4</span>
<h2>Contract testing and OpenAPI</h2>
<p class="lead">Chapter 6 will build a React screen on top of this API, and that screen reads <code>booking.start</code>. If the backend renames the field, every backend test can stay green while the screen goes blank. A <strong>contract test</strong> checks that what the API sends matches what it promised.</p>

<h3>The contract as a file</h3>
${ma('json', CODE.openapi)}
<p>OpenAPI describes, for each route, the statuses a client may receive and the schema of each body. <code>additionalProperties: false</code> on <code>Booking</code> means nothing beyond the listed fields may leave the server. OpenAPI 3.1 uses JSON Schema 2020-12, so a standard validator can check real responses.</p>

<h3>Checking real responses</h3>
<p><code>npm install --save-dev --save-exact ajv@8.20.0 ajv-formats@3.0.1</code>, then a small helper:</p>
${ma('javascript', CODE.contractSupport)}
${ma('javascript', CODE.hopDong)}
${ra(gon(OUT['54-hop-dong']))}
<p>Two tests, nine checked responses, eight different statuses — each response must have a documented status and a body that matches its schema. Note the template path <code>/api/bookings/{id}</code>: the contract describes routes, not concrete URLs.</p>

<h3>Bug 1: the whole row leaks</h3>
<p>A tired developer writes <code>res.json(booking)</code> instead of <code>res.json(toPublic(booking))</code>:</p>
${ra(gon(OUT['54-lo']))}
<p>The stored row carries <code>userId</code> and <code>role</code> — internal data, and in a real system it could be an e-mail, a phone number or a password hash. A test using <code>toMatchObject</code> would stay green, because it ignores extra fields. The contract names both leaked fields.</p>

<h3>Bug 2: a rename that looks harmless</h3>
${ra(gon(OUT['54-doi-ten']))}
<p>The status-only test of lesson 5.1 is still green; the contract says exactly what changed for clients — <code>start</code> is missing and <code>startTime</code> is unexpected. Renaming a public field is a breaking change: version the API or keep both fields for a while, and let the contract test force that conversation.</p>

<h3>Consumer-driven contracts: Pact</h3>
${PACT_EN}
<p>We check the provider against its own description. <a href="https://docs.pact.io" target="_blank" rel="noopener">Pact</a> turns it around: each client records the requests it makes and the fields it reads, and the API’s pipeline replays those recordings. It catches more, at the cost of a broker and coordination between teams — worth it when many teams depend on one API. A checked OpenAPI file is the cheap first step.</p>

${lienKet({ khoa: 'nodejs', bai: 'nodejs-6-5-hop-dong-api', title: 'Also in the Node.js course — 6.5: the API contract', sub: 'How the response shape is agreed and documented; this lesson turns that agreement into a test that fails when the code drifts.', cta: 'OPEN LESSON →' })}

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Check a <code>BAD_JSON</code> response and a missing-token response against the contract.</li>
<li>Run the rename yourself with <code>node scripts/thu-loi.mjs src/api/server.js "start: b.start," "startTime: b.start," demo5/chi-status.test.js demo5/hop-dong.test.js</code> and read the two messages.</li>
</ol>
<p><strong>Solution and real output:</strong></p>
${ma('javascript', CODE.th54)}
${ra(gon(OUT['54-th']))}
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">API contract</span><span class="v">The promise an API makes: routes, statuses, body shapes.</span></div>
  <div class="kv"><span class="k">OpenAPI</span><span class="v">A standard file format for describing HTTP APIs (formerly Swagger).</span></div>
  <div class="kv"><span class="k">Ajv</span><span class="v">A fast JSON Schema validator for JavaScript.</span></div>
  <div class="kv"><span class="k">breaking change</span><span class="v">A change that makes existing clients fail, e.g. renaming or removing a field.</span></div>
</div>

<!-- SODO-TST -->
<h3>🗺 A contract check on every response</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Real request</div><div class="lz-d">through Supertest</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Find the route</div><div class="lz-d">method + path template in openapi.json</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Status documented?</div><div class="lz-d">otherwise an error</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Body matches schema?</div><div class="lz-d">Ajv, additionalProperties false</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Errors listed</div><div class="lz-d">missing fields, extra fields, wrong types</div></div>
</div>
<div class="pitfall"><strong>toMatchObject hides leaks.</strong> It ignores extra fields by design, so a response that suddenly includes <code>userId</code> and <code>role</code> still passes. Use <code>toEqual</code> on the whole body or a schema with <code>additionalProperties: false</code>.</div>
<h3>📌 Summary</h3>
<ul>
<li>The API description is a contract other teams build on.</li>
<li>Check every real response: documented status, matching schema.</li>
<li><code>additionalProperties: false</code> turns a data leak into a red test.</li>
<li>Renames pass backend tests and break clients — the contract test catches them.</li>
<li>Pact adds client-recorded expectations when many teams depend on one API.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>Contract test và OpenAPI</h2>
<p class="lead">Chương 6 sẽ dựng một màn hình React trên API này, và màn hình đó đọc <code>booking.start</code>. Nếu backend đổi tên trường, mọi test backend vẫn có thể xanh trong khi màn hình trắng trơn. <strong>Contract test</strong> (test hợp đồng) kiểm thứ API gửi đi có khớp với thứ nó đã hứa không.</p>

<h3>Hợp đồng dưới dạng một file</h3>
${ma('json', CODE.openapi)}
<p>OpenAPI mô tả, cho mỗi route, các mã trạng thái client có thể nhận và schema của từng body. <code>additionalProperties: false</code> trên <code>Booking</code> nghĩa là không gì ngoài các trường được liệt kê được rời khỏi máy chủ. OpenAPI 3.1 dùng JSON Schema 2020-12, nên một bộ kiểm chuẩn kiểm được phản hồi thật.</p>

<h3>Kiểm phản hồi thật</h3>
<p><code>npm install --save-dev --save-exact ajv@8.20.0 ajv-formats@3.0.1</code>, rồi một hàm hỗ trợ nhỏ:</p>
${ma('javascript', CODE.contractSupport)}
${ma('javascript', CODE.hopDong)}
${ra(gon(OUT['54-hop-dong']))}
<p>Hai test, chín phản hồi được kiểm, tám mã trạng thái khác nhau — mỗi phản hồi phải có mã trạng thái đã được ghi và body khớp schema. Để ý đường dẫn mẫu <code>/api/bookings/{id}</code>: hợp đồng mô tả route, không mô tả URL cụ thể.</p>

<h3>Bug 1: lộ cả dòng dữ liệu</h3>
<p>Một lập trình viên đang mệt viết <code>res.json(booking)</code> thay vì <code>res.json(toPublic(booking))</code>:</p>
${ra(gon(OUT['54-lo']))}
<p>Dòng đã lưu mang <code>userId</code> và <code>role</code> — dữ liệu nội bộ, mà trong hệ thống thật có thể là email, số điện thoại hay mã băm mật khẩu. Một test dùng <code>toMatchObject</code> sẽ vẫn xanh, vì nó bỏ qua trường thừa. Hợp đồng gọi tên cả hai trường bị lộ.</p>

<h3>Bug 2: một lần đổi tên trông vô hại</h3>
${ra(gon(OUT['54-doi-ten']))}
<p>Test chỉ-kiểm-mã-trạng-thái của bài 5.1 vẫn xanh; hợp đồng nói chính xác điều gì đã đổi với client — thiếu <code>start</code>, thừa <code>startTime</code>. Đổi tên một trường công khai là thay đổi phá vỡ (breaking change): hãy đánh phiên bản API hoặc giữ cả hai trường một thời gian, và để contract test buộc cuộc trao đổi đó phải xảy ra.</p>

<h3>Hợp đồng do client dẫn dắt: Pact</h3>
${PACT_VI}
<p>Ta kiểm phía cung cấp theo bản mô tả của chính nó. <a href="https://docs.pact.io" target="_blank" rel="noopener">Pact</a> đảo ngược: mỗi client ghi lại các request nó gửi và các trường nó đọc, và pipeline của API chạy lại các bản ghi đó. Cách này bắt được nhiều hơn, đổi lại cần một broker và sự phối hợp giữa các nhóm — đáng giá khi nhiều nhóm cùng phụ thuộc một API. Một file OpenAPI được kiểm là bước đầu rẻ.</p>

${lienKet({ khoa: 'nodejs', bai: 'nodejs-6-5-hop-dong-api', title: 'Gặp lại ở khoá Node.js — 6.5: hợp đồng API', sub: 'Hình dạng phản hồi được thống nhất và ghi lại thế nào; bài này biến thoả thuận đó thành một test đỏ khi code lệch đi.', cta: 'MỞ BÀI →' })}

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Kiểm một phản hồi <code>BAD_JSON</code> và một phản hồi thiếu token theo hợp đồng.</li>
<li>Tự chạy phép đổi tên bằng <code>node scripts/thu-loi.mjs src/api/server.js "start: b.start," "startTime: b.start," demo5/chi-status.test.js demo5/hop-dong.test.js</code> và đọc hai thông báo.</li>
</ol>
<p><strong>Lời giải và output thật:</strong></p>
${ma('javascript', CODE.th54)}
${ra(gon(OUT['54-th']))}
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">API contract (hợp đồng API)</span><span class="v">Lời hứa của một API: route, mã trạng thái, hình dạng body.</span></div>
  <div class="kv"><span class="k">OpenAPI</span><span class="v">Định dạng file chuẩn để mô tả API HTTP (trước đây gọi là Swagger).</span></div>
  <div class="kv"><span class="k">Ajv</span><span class="v">Bộ kiểm JSON Schema nhanh cho JavaScript.</span></div>
  <div class="kv"><span class="k">breaking change (thay đổi phá vỡ)</span><span class="v">Thay đổi làm client hiện có hỏng, vd đổi tên hay bỏ một trường.</span></div>
</div>

<h3>🗺 Kiểm hợp đồng trên mọi phản hồi</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Request thật</div><div class="lz-d">qua Supertest</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Tìm route</div><div class="lz-d">method + đường dẫn mẫu trong openapi.json</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Mã trạng thái đã ghi?</div><div class="lz-d">không thì báo lỗi</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Body khớp schema?</div><div class="lz-d">Ajv, additionalProperties false</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Liệt kê lỗi</div><div class="lz-d">thiếu trường, thừa trường, sai kiểu</div></div>
</div>
<div class="pitfall"><strong>toMatchObject che giấu rò rỉ.</strong> Nó bỏ qua trường thừa theo thiết kế, nên một phản hồi bỗng có thêm <code>userId</code> và <code>role</code> vẫn qua. Dùng <code>toEqual</code> trên cả body hoặc schema có <code>additionalProperties: false</code>.</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Bản mô tả API là hợp đồng mà các nhóm khác dựa vào để xây.</li>
<li>Kiểm mọi phản hồi thật: mã trạng thái đã ghi, schema khớp.</li>
<li><code>additionalProperties: false</code> biến một vụ lộ dữ liệu thành test đỏ.</li>
<li>Đổi tên qua được test backend nhưng làm hỏng client — contract test bắt được.</li>
<li>Pact thêm các mong đợi do client ghi lại khi nhiều nhóm cùng phụ thuộc một API.</li>
</ul>
</div>
`,
};
