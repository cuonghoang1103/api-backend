/**
 * Testing · Chương 5 · 5.3 — Kiểm dữ liệu vào và phản hồi lỗi. Slug giữ từ khung: tst-5-3-validation.
 * Chạy thật: Zod 4.6.7 strictObject; 400 VALIDATION theo path; BAD_JSON; 422 theo luật; một định dạng lỗi.
 */
import G from '../giang/tst-05-3.mjs';
import { ma, ra, lienKet } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const gon = (t) => t.split('\n').filter((l) => /^\$ |✓|×|Tests /.test(l)).join('\n');
const DONG = CODE.server.split('\n');
const ERRMW = [DONG.find((l) => l.startsWith('const RULE_CODES')), '// …', ...DONG.slice(DONG.findIndex((x) => x.includes('app.use((err, req, res, next)')), -2)].join('\n');

const MA_EN = `<table>
<thead><tr><th>Status</th><th>Meaning</th><th>Caught by</th><th>LabFlow codes</th></tr></thead>
<tbody>
<tr><td><strong>400</strong></td><td>the request itself is malformed</td><td>JSON parser, Zod schema</td><td><code>BAD_JSON</code>, <code>VALIDATION</code> (+ details)</td></tr>
<tr><td><strong>422</strong></td><td>well-formed, but against a business rule</td><td><code>bookLab</code> → <code>checkSlot</code></td><td><code>OFF_GRID</code>, <code>END_BEFORE_START</code>, <code>OUTSIDE_HOURS</code>, <code>TOO_LONG</code></td></tr>
<tr><td><strong>409</strong></td><td>conflicts with the current state</td><td>repository, database constraint</td><td><code>OVERLAP</code></td></tr>
<tr><td><strong>503</strong></td><td>a dependency is down</td><td>catch around the repository</td><td><code>STORAGE_DOWN</code></td></tr>
<tr><td><strong>500</strong></td><td>our own bug</td><td>error middleware</td><td><code>INTERNAL</code> — never the stack trace</td></tr>
</tbody></table>`;
const MA_VI = `<table>
<thead><tr><th>Mã</th><th>Nghĩa</th><th>Ai bắt</th><th>Mã lỗi LabFlow</th></tr></thead>
<tbody>
<tr><td><strong>400</strong></td><td>chính request sai định dạng</td><td>bộ phân tích JSON, schema Zod</td><td><code>BAD_JSON</code>, <code>VALIDATION</code> (+ details)</td></tr>
<tr><td><strong>422</strong></td><td>đúng định dạng, nhưng trái luật nghiệp vụ</td><td><code>bookLab</code> → <code>checkSlot</code></td><td><code>OFF_GRID</code>, <code>END_BEFORE_START</code>, <code>OUTSIDE_HOURS</code>, <code>TOO_LONG</code></td></tr>
<tr><td><strong>409</strong></td><td>xung đột với trạng thái hiện tại</td><td>repository, ràng buộc CSDL</td><td><code>OVERLAP</code></td></tr>
<tr><td><strong>503</strong></td><td>một phụ thuộc đang chết</td><td>khối catch quanh repository</td><td><code>STORAGE_DOWN</code></td></tr>
<tr><td><strong>500</strong></td><td>bug của chính ta</td><td>middleware lỗi</td><td><code>INTERNAL</code> — không bao giờ kèm stack trace</td></tr>
</tbody></table>`;

export default {
  title: '5.3 — Validation and error responses: 400, 422 and one error format|||5.3 — Kiểm dữ liệu vào và phản hồi lỗi: 400, 422 và một định dạng lỗi',
  slug: 'tst-5-3-validation',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Schema Zod nghiêm ngặt (strictObject) cho body đặt phòng; issue → 400 VALIDATION có path; bảng dữ liệu xấu theo lớp tương đương; JSON hỏng → 400 BAD_JSON; luật nghiệp vụ → 422; middleware lỗi đổi BookingError sang 409/422/503/500; một định dạng lỗi chung; biên số chỗ 200/201.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>Validation and error responses</h2>
<p class="lead">Unit tests in Chapter 1 called <code>checkSlot</code> with neat strings. An API receives whatever anyone sends: numbers as strings, missing fields, extra fields, broken JSON. This lesson stops all of it at the door and makes every failure look the same to clients.</p>

<h3>The schema at the door</h3>
${ma('javascript', CODE.schemas)}
<ul>
<li>Zod checks what JSON cannot express: an integer number of seats, a real calendar date (<code>z.iso.date()</code> refuses 2026-13-01), HH:MM inside the day, the lab code format.</li>
<li><code>z.strictObject</code> refuses unknown keys. That is what stopped <code>role: 'ADMIN'</code> in lesson 5.2, and what stops a client from choosing its own <code>status</code>.</li>
<li>The handler turns every Zod issue into <code>{ path, message }</code> and answers 400 with all of them at once (code in lesson 5.1).</li>
</ul>

<h3>A table of bad inputs</h3>
${ma('javascript', CODE.validation)}
${ra(gon(OUT['53-validation']))}
<p>Each row is an equivalence class for one field — missing, wrong type, wrong number kind, impossible date, wrong format, out of range — the technique of lesson 1.4 applied to an API. The test checks that the error <em>points at the field</em>, because that is what a form needs to highlight it.</p>

<h3>Where each error comes from</h3>
${ma('javascript', ERRMW)}
${MA_EN}
<p>08:15 passes the schema (it is a valid time) but breaks the 30-minute grid, so it is a 422 from the business rules, not a 400. Keeping the two apart tells the client whether to fix the form (400) or choose another slot (422). Every error has the same shape, <code>{ error: { code, details? } }</code> — clients switch on <code>code</code>, as in lesson 2.3, and a 500 never shows a stack trace.</p>

${lienKet({ khoa: 'api-design', bai: 'api-2-2-validation', title: 'Also in the API Design course — 2.2: validation at the door with Zod', sub: 'How to design the error body and the validation rules; this lesson is how to test them row by row.', cta: 'OPEN LESSON →' })}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-6-3-validate-schema', title: 'Also in the Node.js course — 6.3: validating with a schema', sub: 'The same idea from the Express side: one schema per request body.', cta: 'OPEN LESSON →' })}

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>The seat limit at its boundary: 201 seats → 400 on <code>seats</code>; exactly 200 → 201 Created.</li>
<li>An unknown key <code>status</code> → 400 “Unrecognized key”.</li>
</ol>
<p><strong>Solution and real output:</strong></p>
${ma('javascript', CODE.th53)}
${ra(gon(OUT['53-th']))}
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">validation</span><span class="v">Checking the shape and types of input before any business logic runs.</span></div>
  <div class="kv"><span class="k">400 vs 422</span><span class="v">Malformed request vs well-formed request that breaks a rule.</span></div>
  <div class="kv"><span class="k">error middleware</span><span class="v">The one Express handler (four arguments) that turns thrown errors into responses.</span></div>
</div>

<!-- SODO-TST -->
<h3>🗺 Where a bad request is stopped</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">JSON parser</div><div class="lz-d">broken JSON → 400 BAD_JSON</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Zod schema</div><div class="lz-d">wrong shape → 400 VALIDATION + field</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Business rules</div><div class="lz-d">off grid, too long → 422 + code</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Repository</div><div class="lz-d">slot taken → 409 OVERLAP</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Anything else</div><div class="lz-d">500 INTERNAL, no stack trace</div></div>
</div>
<div class="pitfall"><strong>Silently dropping unknown keys.</strong> <code>z.object</code> strips keys it does not know, so <code>role: "ADMIN"</code> in a body disappears without a trace — safe today, dangerous after the next refactor. <code>z.strictObject</code> refuses with 400, and a test can pin that down.</div>
<h3>📌 Summary</h3>
<ul>
<li>Validate at the door with a strict schema; refuse unknown keys.</li>
<li>400 malformed · 422 against a rule · 409 conflict · 503 dependency down · 500 our bug.</li>
<li>Test a table of bad inputs, each pointing at its field.</li>
<li>One error format everywhere; never leak a stack trace.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>Kiểm dữ liệu vào và phản hồi lỗi</h2>
<p class="lead">Unit test ở Chương 1 gọi <code>checkSlot</code> với những chuỗi gọn gàng. API thì nhận bất cứ thứ gì ai đó gửi: số viết thành chuỗi, thiếu trường, thừa trường, JSON hỏng. Bài này chặn tất cả ngay ở cửa và làm mọi lỗi trông giống nhau với client.</p>

<h3>Schema ở cửa</h3>
${ma('javascript', CODE.schemas)}
<ul>
<li>Zod kiểm thứ JSON không tự diễn đạt được: số chỗ là số nguyên, ngày có thật trên lịch (<code>z.iso.date()</code> từ chối 2026-13-01), HH:MM nằm trong ngày, định dạng mã phòng.</li>
<li><code>z.strictObject</code> từ chối khoá lạ. Chính nó đã chặn <code>role: 'ADMIN'</code> ở bài 5.2, và chặn client tự chọn <code>status</code>.</li>
<li>Handler biến mỗi issue của Zod thành <code>{ path, message }</code> và trả 400 kèm tất cả cùng lúc (code ở bài 5.1).</li>
</ul>

<h3>Một bảng dữ liệu xấu</h3>
${ma('javascript', CODE.validation)}
${ra(gon(OUT['53-validation']))}
<p>Mỗi dòng là một lớp tương đương cho một trường — thiếu, sai kiểu, sai loại số, ngày không tồn tại, sai định dạng, ngoài khoảng — kỹ thuật của bài 1.4 áp vào API. Test kiểm lỗi <em>trỏ đúng vào trường</em>, vì đó là thứ form cần để tô đỏ nó.</p>

<h3>Mỗi lỗi đến từ đâu</h3>
${ma('javascript', ERRMW)}
${MA_VI}
<p>08:15 qua được schema (nó là giờ hợp lệ) nhưng lệch lưới 30 phút, nên là 422 từ luật nghiệp vụ, không phải 400. Tách hai loại giúp client biết nên sửa form (400) hay chọn khung giờ khác (422). Lỗi nào cũng cùng hình dạng <code>{ error: { code, details? } }</code> — client rẽ nhánh theo <code>code</code>, như bài 2.3, và một lỗi 500 không bao giờ để lộ stack trace.</p>

${lienKet({ khoa: 'api-design', bai: 'api-2-2-validation', title: 'Gặp lại ở khoá API Design — 2.2: kiểm dữ liệu ở cửa bằng Zod', sub: 'Cách thiết kế body lỗi và luật kiểm dữ liệu; bài này là cách test chúng từng dòng một.', cta: 'MỞ BÀI →' })}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-6-3-validate-schema', title: 'Gặp lại ở khoá Node.js — 6.3: kiểm dữ liệu bằng schema', sub: 'Cùng ý tưởng nhìn từ phía Express: mỗi body request một schema.', cta: 'MỞ BÀI →' })}

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Giới hạn số chỗ ngay tại biên: 201 chỗ → 400 ở <code>seats</code>; đúng 200 → 201 Created.</li>
<li>Khoá lạ <code>status</code> → 400 “Unrecognized key”.</li>
</ol>
<p><strong>Lời giải và output thật:</strong></p>
${ma('javascript', CODE.th53)}
${ra(gon(OUT['53-th']))}
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">validation (kiểm dữ liệu vào)</span><span class="v">Kiểm hình dạng và kiểu của dữ liệu vào trước khi chạy logic nghiệp vụ.</span></div>
  <div class="kv"><span class="k">400 vs 422</span><span class="v">Request sai định dạng vs request đúng định dạng nhưng trái luật.</span></div>
  <div class="kv"><span class="k">error middleware (middleware lỗi)</span><span class="v">Handler Express duy nhất (bốn tham số) biến lỗi được ném thành phản hồi.</span></div>
</div>

<h3>🗺 Request xấu bị chặn ở đâu</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Bộ phân tích JSON</div><div class="lz-d">JSON hỏng → 400 BAD_JSON</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Schema Zod</div><div class="lz-d">sai hình dạng → 400 VALIDATION + trường</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Luật nghiệp vụ</div><div class="lz-d">lệch lưới, quá dài → 422 + mã</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Repository</div><div class="lz-d">khung đã có người đặt → 409 OVERLAP</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Mọi thứ khác</div><div class="lz-d">500 INTERNAL, không lộ stack trace</div></div>
</div>
<div class="pitfall"><strong>Lặng lẽ bỏ khoá lạ.</strong> <code>z.object</code> bỏ những khoá nó không biết, nên <code>role: "ADMIN"</code> trong body biến mất không dấu vết — hôm nay an toàn, nguy hiểm sau lần refactor tới. <code>z.strictObject</code> từ chối với 400, và một test ghim được điều đó.</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Kiểm ở cửa bằng schema nghiêm ngặt; từ chối khoá lạ.</li>
<li>400 sai định dạng · 422 trái luật · 409 xung đột · 503 phụ thuộc chết · 500 bug của ta.</li>
<li>Test một bảng dữ liệu xấu, mỗi dòng trỏ vào trường của nó.</li>
<li>Một định dạng lỗi ở mọi nơi; không bao giờ lộ stack trace.</li>
</ul>
</div>
`,
};
