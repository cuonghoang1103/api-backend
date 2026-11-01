/**
 * TypeScript · Chương 4 · 4.4 — Index signature & Record. Slug giữ: typescript-4-4-index-record.
 * Soạn lại TRỌN 01/11/2026 theo ./_HOP-DONG.md. Mọi code/output lấy từ ./_ma-ts-04-4.mjs (labflow-ts chạy thật: Node 22.23.3, tsc 7.0.2 —
 * demo4/ts-04-4/). LAB_INFO: Record<LabCode, Lab> và seatsByLab là của src/rules/model.ts (lời giải Lab 4).
 */
import G from '../giang/ts-04-4.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-04-4.mjs';

const BANG_EN = `<table>
<thead><tr><th>You write</th><th>Keys</th><th>Reading <code>x[k]</code> (course tsconfig)</th><th>Use it when</th></tr></thead>
<tbody>
<tr><td><code>{ [code: string]: Lab }</code></td><td>any string — open</td><td><code>Lab | undefined</code> — check first (TS2532/TS18048)</td><td>keys really arrive at runtime: a cache, parsed headers</td></tr>
<tr><td><code>Record&lt;string, Lab&gt;</code></td><td>the same, shorter to write</td><td>the same</td><td>same as above (a type alias, composes better)</td></tr>
<tr><td><code>Record&lt;LabCode, Lab&gt;</code></td><td>exactly the union — closed</td><td><code>Lab</code> for a <code>LabCode</code> key; TS7053 for any other</td><td>one entry per known value: per lab, per status, per role</td></tr>
<tr><td><code>Map&lt;number, User&gt;</code></td><td>any value, kept as its own type</td><td><code>.get(k)</code> is <code>User | undefined</code></td><td>keys that are not strings, frequent add/delete, need <code>.size</code></td></tr>
<tr><td>a plain <code>interface</code></td><td>fixed names</td><td>each property has its own type</td><td>the keys are field names, not data</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Bạn viết</th><th>Khoá</th><th>Đọc <code>x[k]</code> (tsconfig của khoá)</th><th>Dùng khi</th></tr></thead>
<tbody>
<tr><td><code>{ [code: string]: Lab }</code></td><td>chuỗi bất kỳ — mở</td><td><code>Lab | undefined</code> — kiểm trước (TS2532/TS18048)</td><td>khoá thật sự tới lúc chạy: cache, header đã tách</td></tr>
<tr><td><code>Record&lt;string, Lab&gt;</code></td><td>như trên, viết ngắn hơn</td><td>như trên</td><td>như trên (là type alias, ghép tốt hơn)</td></tr>
<tr><td><code>Record&lt;LabCode, Lab&gt;</code></td><td>đúng union đó — đóng</td><td><code>Lab</code> với khoá <code>LabCode</code>; TS7053 với khoá khác</td><td>mỗi giá trị đã biết một mục: theo phòng, theo trạng thái, theo vai trò</td></tr>
<tr><td><code>Map&lt;number, User&gt;</code></td><td>giá trị bất kỳ, giữ đúng kiểu của nó</td><td><code>.get(k)</code> là <code>User | undefined</code></td><td>khoá không phải chuỗi, thêm/xoá thường xuyên, cần <code>.size</code></td></tr>
<tr><td>một <code>interface</code> thường</td><td>tên cố định</td><td>mỗi thuộc tính một kiểu riêng</td><td>khoá là tên trường, không phải dữ liệu</td></tr>
</tbody>
</table>`;

const FLOW_EN = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Text from outside</div><div class="lz-d"><code>?lab=BE-999</code> is a <code>string</code></div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Guard</div><div class="lz-d"><code>isLab(text)</code> (2.4) — no ⇒ 404, yes ⇒ it is a <code>LabCode</code></div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Closed lookup</div><div class="lz-d"><code>LAB_INFO[code]</code> is a <code>Lab</code> — nothing left to check</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Add a lab</div><div class="lz-d">to <code>LABS</code> ⇒ tsc points at every <code>Record&lt;LabCode, …&gt;</code> missing it</div></div>
</div>`;
const FLOW_VI = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Chữ từ bên ngoài</div><div class="lz-d"><code>?lab=BE-999</code> là một <code>string</code></div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Guard</div><div class="lz-d"><code>isLab(text)</code> (2.4) — không ⇒ 404, có ⇒ nó là <code>LabCode</code></div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Tra cứu đóng</div><div class="lz-d"><code>LAB_INFO[code]</code> là <code>Lab</code> — không còn gì phải kiểm</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Thêm một phòng</div><div class="lz-d">vào <code>LABS</code> ⇒ tsc chỉ ra mọi <code>Record&lt;LabCode, …&gt;</code> còn thiếu nó</div></div>
</div>`;

export default {
  title: '4.4 — Index signatures & Record|||4.4 — Index signature & Record',
  slug: 'typescript-4-4-index-record',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Object dùng làm từ điển: mã phòng từ URL tra bảng LAB_INFO. JavaScript sập với "Cannot read properties of undefined (reading \'capacity\')"; index signature { [code: string]: Lab } hứa mọi khoá đều có — tắt noUncheckedIndexedAccess thì tsc 0 lỗi, Node sập y hệt; bật (tsconfig của khoá) thì TS2532. Record<LabCode, Lab> đóng tập khoá: thiếu phòng TS2741, thừa TS2353, khoá lạ TS7053, đọc không cần kiểm. Bẫy Object.keys trả string[] (TS7053) ⇒ lặp LABS; đếm bằng Record<LabCode, number> (TS2739 với {}) ⇒ BE-202 có 0 thay vì biến mất (đo thật); Record<number, User> và Map (Object.keys ra [\'1\', \'2\'] — khoá số thành chuỗi); TS2411 khi trộn thuộc tính với index signature.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.4</span>
<h2>Index signatures &amp; <code>Record</code></h2>
<p class="lead">So far every object had fixed property names. LabFlow also needs objects used as <strong>dictionaries</strong> (từ điển): lab code → lab info, lab code → seats booked, user id → user. The key is data, often from a URL. This lesson types such objects two ways — an open <em>index signature</em> and a closed <code>Record&lt;LabCode, …&gt;</code> — measures what each one lets through, and finishes the <code>LAB_INFO</code> table of Lab 4.</p>

<h3>What you will be able to do, and why it matters</h3>
<ul>
<li>Write an index signature and know what it promises — and why <code>noUncheckedIndexedAccess</code> makes that promise honest.</li>
<li>Use <code>Record&lt;LabCode, Lab&gt;</code> so tsc proves every lab has an entry, no more, no less.</li>
<li>Avoid two daily traps: <code>Object.keys</code> returning <code>string[]</code>, and a count that silently forgets the labs with zero.</li>
<li>Choose between an object, <code>Record</code> and <code>Map</code>.</li>
</ul>
<p>Lookup tables are everywhere in real code: status → label, role → permissions, id → cached row. “Cannot read properties of undefined” on a lookup is one of the most common production errors in JavaScript; with the right type it becomes a compile error or disappears.</p>

<h3>JavaScript: a key that is not there</h3>
${ma('javascript', CODE.js)}
${ra(OUT['11-js'])}
<p>The URL said <code>BE-999</code>. <code>LAB_INFO['BE-999']</code> is <code>undefined</code> and reading <code>.capacity</code> on it crashes the request (exit code 1).</p>

<h3>An index signature: “any string key, each value a Lab”</h3>
${ma('typescript', CODE.open)}
${ra(OUT['12-open'])}
<p><code>{ [code: string]: Lab }</code> is an <strong>index signature</strong> (chữ ký chỉ mục): the keys are not listed, only their type and the type of the values. The name <code>code</code> is documentation; only <code>string</code> matters. Under the course tsconfig (0.3) tsc refuses line 11: with <code>noUncheckedIndexedAccess</code> a read through an index signature is <code>Lab | undefined</code>, so <code>.capacity</code> is TS2532 <em>Object is possibly 'undefined'</em> — the crash above, found before running.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — without <code>noUncheckedIndexedAccess</code>, an index signature promises every key exists.</strong> Many projects (and tsc’s own <code>strict</code>) do not turn that flag on. The same file with it off:</p>
${ma('json', CODE.looseCfg)}
${ra(OUT['13-loose'])}
<p>0 errors, and the same <code>TypeError</code> as plain JavaScript. With the flag off, <code>LAB_INFO['BE-999']</code> has type <code>Lab</code> — the type describes what a key <em>would</em> hold, not whether it is there. If your project cannot turn the flag on yet, never index an open dictionary without a check; better, close the key set (next section).</p>
</div>

<h3><code>Record&lt;K, V&gt;</code>: exactly these keys</h3>
<p><code>Record&lt;K, V&gt;</code> is a built-in type (your first <em>utility type</em> — Chapter 8 rebuilds it): an object whose keys are <code>K</code> and whose values are <code>V</code>. With <code>K = string</code> it is the index signature above, shorter. With <code>K = LabCode</code> — the union from Chapter 2 — the key set is <strong>closed</strong>:</p>
${ma('typescript', CODE.record)}
${ra(OUT['14-record'])}
<p>Four errors, four protections. A table missing <code>AL-301</code>: TS2741. A table with an extra <code>BE-999</code>: TS2353 (the excess check of 4.1). Reading <code>LAB_INFO['BE-999']</code>: TS7053 “Property 'BE-999' does not exist”. Indexing with a plain <code>string</code> (the URL text): TS7053 again — you must turn the text into a <code>LabCode</code> first, with the <code>isLab</code> guard from 2.4. And line 18, <code>LAB_INFO[code].capacity</code> with <code>code: LabCode</code>, has <strong>no error and no check</strong>: every <code>LabCode</code> is a key, so there is no <code>undefined</code> to handle. This is <code>LAB_INFO</code> in Lab 4’s <code>model.ts</code>.</p>

<h3>The <code>Object.keys</code> trap</h3>
${ma('typescript', CODE.keys)}
${ra(OUT['15-keys'])}
<p><code>Object.keys</code> returns <code>string[]</code>, not <code>LabCode[]</code>, so <code>CAPACITY[key]</code> is TS7053. It is not a bug in TypeScript: by structural typing (4.1) an object of type <code>Record&lt;LabCode, number&gt;</code> may carry <em>extra</em> keys at runtime, so tsc cannot promise that every key is a <code>LabCode</code>. Two honest fixes, both in the file: loop over <code>LABS</code>, the single list of labs (2.4), or use <code>Object.entries</code> when you only need the values. Do not reach for <code>as LabCode[]</code> — that is the lie from 1.2.</p>

<h3>Counting per lab: let the type remember the zeros</h3>
<p>A dashboard shows seats booked per lab. Start with an empty object — tsc refuses it if the type is closed:</p>
${ma('typescript', CODE.empty)}
${ra(OUT['16-empty'])}
<p>TS2739 lists the three labs. That error is a feature: compare the open version (starts at <code>{}</code>) with the <code>Record</code> version (starts at three zeros):</p>
${ma('typescript', CODE.count)}
${ra(OUT['17-count'])}
<p>The open dictionary simply has no <code>BE-202</code>: the dashboard prints <code>n/a</code> (or <code>NaN</code>, or skips the lab), while the right answer is 0. The closed one lists every lab. The three zeros are written by hand, which looks like the copy problem of 2.4 — but it is a <em>checked</em> copy: add a lab to <code>LABS</code> and tsc reports TS2741 on this line until you add its zero. That is <code>seatsByLab</code> in Lab 4, and fixing it is one of the starter’s two logic bugs.</p>

<h3>Keys that are numbers: <code>Record&lt;number, User&gt;</code> or <code>Map</code></h3>
${ma('typescript', CODE.byid)}
${ra(OUT['18-byid-tsc'])}
${ra(OUT['19-byid-run'])}
<p>User ids arrive at runtime, so the key set is open: a read may miss, and tsc makes you check (TS2532 on line 13). Two runtime facts from the output: a missing id gives <code>undefined</code> in both versions, and <code>Object.keys(byId)</code> prints <code>['1', '2']</code> — <strong>object keys are always strings</strong>, the number type is only on the TypeScript side. A <code>Map</code> keeps real number keys, has <code>.size</code>, and is the better choice when entries are added and removed often.</p>

<h3>Mixing named properties with an index signature</h3>
${ma('typescript', CODE.mixed)}
${ra(OUT['20-mixed'])}
<p>If any string key maps to a <code>number</code>, the key <code>'updatedAt'</code> must too: TS2411. Put the metadata next to the dictionary instead — <code>{ updatedAt: string; seats: Record&lt;LabCode, number&gt; }</code>.</p>

<h3>Which dictionary, when</h3>
${BANG_EN}

<h3>🗺 A key from the URL, safely</h3>
${FLOW_EN}

<h3>💼 Interview corner</h3>
<p><strong>“Index signature vs <code>Record</code>?”</strong> <code>Record&lt;string, V&gt;</code> is the same as <code>{ [k: string]: V }</code>; the difference appears with a union of keys — <code>Record&lt;LabCode, V&gt;</code> requires every key and refuses others. <strong>“Why does <code>Object.keys</code> return <code>string[]</code>?”</strong> Because of structural typing the object may have more keys at runtime than its type lists. <strong>“What does <code>noUncheckedIndexedAccess</code> do?”</strong> Adds <code>| undefined</code> to reads through index signatures and arrays — measured above: 0 errors and a crash without it, TS2532 with it.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p><code>demo4/ts-04-4/practice/start/usage.ts</code> — “how full is each lab today?”:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['21-pr-start'])}
${ra(OUT['22-pr-start-run'])}
<ol>
<li>Why does Node print <code>NaN%</code> for BE-202, and which tsc error predicted it?</li>
<li>Make both dictionaries closed over <code>LabCode</code>, loop over <code>LABS</code>, and pass BE-202’s 0 explicitly.</li>
</ol>
<p><strong>Solution and real output.</strong> <code>booked['BE-202']</code> is <code>undefined</code>, and <code>undefined / 40</code> is <code>NaN</code> — TS2532 on column 71 pointed at it:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['23-pr-sol'])}
<p><strong>Done when:</strong> tsc prints nothing and Node prints <code>BE-202 0%</code>. Code Lab has three more: close the <code>LAB_INFO</code> table, count per lab without losing zeros, and a user index that has to admit a miss.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">index signature</span><span class="v"><code>{ [code: string]: Lab }</code> — keys not listed, only their type and the value type.</span></div>
  <div class="kv"><span class="k"><code>Record&lt;K, V&gt;</code></span><span class="v">An object with keys <code>K</code>, values <code>V</code>. Closed when <code>K</code> is a union of literals.</span></div>
  <div class="kv"><span class="k">noUncheckedIndexedAccess</span><span class="v">tsconfig flag (on in this course): reads through an index give <code>V | undefined</code>.</span></div>
  <div class="kv"><span class="k">TS7053</span><span class="v">“Element implicitly has an 'any' type because expression … can't be used to index” — a key that is not in the type.</span></div>
  <div class="kv"><span class="k">TS2411</span><span class="v">A named property does not match the index signature’s value type.</span></div>
  <div class="kv"><span class="k">Map</span><span class="v">A real dictionary object: any key type, <code>.get</code> / <code>.set</code> / <code>.size</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A missing key crashed JavaScript; an index signature without <code>noUncheckedIndexedAccess</code> compiled with 0 errors and crashed the same way; with the flag, TS2532.</li>
<li><code>Record&lt;LabCode, Lab&gt;</code>: missing lab TS2741, extra TS2353, unknown key or plain <code>string</code> TS7053 — and no check needed for a real <code>LabCode</code>.</li>
<li><code>Object.keys</code> gives <code>string[]</code> (TS7053): loop over <code>LABS</code> or use <code>Object.entries</code>.</li>
<li>Counting into <code>Record&lt;LabCode, number&gt;</code> keeps BE-202 at 0 instead of losing it; <code>{}</code> is TS2739.</li>
<li>Numeric keys are strings at runtime (<code>['1', '2']</code>); use <code>Map</code> for real non-string keys.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Object Types: Index Signatures', 'Index signature syntax, allowed key types, and the rule that properties must match. Read 1 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/objects.html')}
${nguon('📘', 'TypeScript Handbook — Utility Types: Record&lt;Keys, Type&gt;', 'Constructs an object type whose keys are Keys and values are Type. Read 1 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/utility-types.html')}
${nguon('📘', 'TSConfig reference — noUncheckedIndexedAccess', 'Adds undefined to any un-declared field in the type. Read 1 Nov 2026.', 'https://www.typescriptlang.org/tsconfig/#noUncheckedIndexedAccess')}
${nguon('📗', 'MDN — Map', 'Keys of any type, insertion order, size. Read 1 Nov 2026.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map')}
${lienKet({ khoa: 'api-design', bai: 'api-3-4-sap-xep', title: 'A key from the URL must be on a list — API Design 3.4: sorting with an allow-list', sub: 'Same: a name that arrives in the query string (?sort=…) is checked against a closed list before it indexes anything, or it becomes an error or a hole. Different: there the allow-list is checked at runtime by the API; here the closed list is a type — Record&lt;LabCode, Lab&gt; — so tsc refuses an unknown key (TS7053) and forces the URL text through a guard first.', cta: 'OPEN API DESIGN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.4</span>
<h2>Index signature &amp; <code>Record</code></h2>
<p class="lead">Tới giờ object nào cũng có tên thuộc tính cố định. LabFlow còn cần object dùng làm <strong>từ điển</strong> (dictionary): mã phòng → thông tin phòng, mã phòng → số chỗ đã đặt, id người dùng → người dùng. Khoá là dữ liệu, thường đến từ URL. Bài này gõ kiểu cho những object như vậy theo hai cách — <em>index signature</em> mở và <code>Record&lt;LabCode, …&gt;</code> đóng — đo xem mỗi cách để lọt cái gì, và hoàn thiện bảng <code>LAB_INFO</code> của Lab 4.</p>

<h3>Bạn sẽ làm được gì, và vì sao quan trọng</h3>
<ul>
<li>Viết index signature và biết nó hứa gì — và vì sao <code>noUncheckedIndexedAccess</code> làm lời hứa đó trung thực.</li>
<li>Dùng <code>Record&lt;LabCode, Lab&gt;</code> để tsc chứng minh phòng nào cũng có mục, không thừa, không thiếu.</li>
<li>Tránh hai bẫy hằng ngày: <code>Object.keys</code> trả <code>string[]</code>, và phép đếm âm thầm quên các phòng bằng không.</li>
<li>Chọn giữa object, <code>Record</code> và <code>Map</code>.</li>
</ul>
<p>Bảng tra có ở khắp nơi trong code thật: trạng thái → nhãn, vai trò → quyền, id → hàng đã cache. “Cannot read properties of undefined” khi tra bảng là một trong những lỗi production phổ biến nhất của JavaScript; với kiểu đúng nó thành lỗi biên dịch hoặc biến mất.</p>

<h3>JavaScript: một khoá không tồn tại</h3>
${ma('javascript', CODE.js)}
${ra(OUT['11-js'])}
<p>URL ghi <code>BE-999</code>. <code>LAB_INFO['BE-999']</code> là <code>undefined</code> và đọc <code>.capacity</code> trên nó làm sập request (exit code 1).</p>

<h3>Index signature: “khoá chuỗi bất kỳ, mỗi giá trị là một Lab”</h3>
${ma('typescript', CODE.open)}
${ra(OUT['12-open'])}
<p><code>{ [code: string]: Lab }</code> là một <strong>index signature</strong> (chữ ký chỉ mục): không liệt kê khoá, chỉ nói kiểu của khoá và kiểu của giá trị. Tên <code>code</code> chỉ để đọc cho dễ; chỉ <code>string</code> là có nghĩa. Với tsconfig của khoá (0.3) tsc từ chối dòng 11: có <code>noUncheckedIndexedAccess</code> thì đọc qua index signature được <code>Lab | undefined</code>, nên <code>.capacity</code> là TS2532 <em>Object is possibly 'undefined'</em> — đúng cú sập ở trên, bị phát hiện trước khi chạy.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — thiếu <code>noUncheckedIndexedAccess</code>, index signature hứa khoá nào cũng có.</strong> Nhiều dự án (và cả <code>strict</code> của tsc) không bật cờ đó. Cùng tệp khi tắt nó:</p>
${ma('json', CODE.looseCfg)}
${ra(OUT['13-loose'])}
<p>0 lỗi, và cùng <code>TypeError</code> như JavaScript thuần. Tắt cờ thì <code>LAB_INFO['BE-999']</code> có kiểu <code>Lab</code> — kiểu mô tả một khoá <em>sẽ</em> chứa gì, không nói khoá có mặt hay không. Nếu dự án của bạn chưa bật được cờ, đừng bao giờ tra một từ điển mở mà không kiểm; tốt hơn nữa, đóng tập khoá lại (mục sau).</p>
</div>

<h3><code>Record&lt;K, V&gt;</code>: đúng những khoá này</h3>
<p><code>Record&lt;K, V&gt;</code> là kiểu có sẵn (<em>utility type</em> đầu tiên của bạn — Chương 8 tự dựng lại nó): object có khoá là <code>K</code> và giá trị là <code>V</code>. Với <code>K = string</code> nó chính là index signature ở trên, viết ngắn hơn. Với <code>K = LabCode</code> — union từ Chương 2 — tập khoá <strong>đóng</strong>:</p>
${ma('typescript', CODE.record)}
${ra(OUT['14-record'])}
<p>Bốn lỗi, bốn lớp bảo vệ. Bảng thiếu <code>AL-301</code>: TS2741. Bảng thừa <code>BE-999</code>: TS2353 (phép kiểm khoá thừa của 4.1). Đọc <code>LAB_INFO['BE-999']</code>: TS7053 “Property 'BE-999' does not exist”. Tra bằng một <code>string</code> thường (chữ từ URL): lại TS7053 — bạn phải biến chữ đó thành <code>LabCode</code> trước, bằng guard <code>isLab</code> của 2.4. Còn dòng 18, <code>LAB_INFO[code].capacity</code> với <code>code: LabCode</code>, <strong>không lỗi và không cần kiểm</strong>: <code>LabCode</code> nào cũng là khoá, nên không có <code>undefined</code> nào phải xử lý. Đây chính là <code>LAB_INFO</code> trong <code>model.ts</code> của Lab 4.</p>

<h3>Bẫy <code>Object.keys</code></h3>
${ma('typescript', CODE.keys)}
${ra(OUT['15-keys'])}
<p><code>Object.keys</code> trả <code>string[]</code>, không phải <code>LabCode[]</code>, nên <code>CAPACITY[key]</code> là TS7053. Đây không phải bug của TypeScript: theo structural typing (4.1), một object kiểu <code>Record&lt;LabCode, number&gt;</code> lúc chạy có thể mang <em>thêm</em> khoá, nên tsc không hứa được mọi khoá đều là <code>LabCode</code>. Hai cách sửa trung thực, đều có trong tệp: lặp qua <code>LABS</code>, danh sách phòng duy nhất (2.4), hoặc dùng <code>Object.entries</code> khi chỉ cần giá trị. Đừng với tay lấy <code>as LabCode[]</code> — đó là lời nói dối ở 1.2.</p>

<h3>Đếm theo phòng: để kiểu nhớ hộ các số không</h3>
<p>Một bảng điều khiển hiện số chỗ đã đặt theo phòng. Bắt đầu bằng object rỗng — tsc từ chối nếu kiểu là đóng:</p>
${ma('typescript', CODE.empty)}
${ra(OUT['16-empty'])}
<p>TS2739 liệt kê ba phòng. Lỗi đó là một tính năng: so bản mở (bắt đầu từ <code>{}</code>) với bản <code>Record</code> (bắt đầu từ ba số không):</p>
${ma('typescript', CODE.count)}
${ra(OUT['17-count'])}
<p>Từ điển mở đơn giản là không có <code>BE-202</code>: bảng điều khiển in <code>n/a</code> (hoặc <code>NaN</code>, hoặc bỏ qua phòng đó), trong khi câu trả lời đúng là 0. Bản đóng liệt kê đủ mọi phòng. Ba số không được viết tay, trông như vấn đề chép tay ở 2.4 — nhưng đây là bản chép <em>được kiểm</em>: thêm một phòng vào <code>LABS</code> là tsc báo TS2741 ở dòng này tới khi bạn thêm số không của nó. Đó là <code>seatsByLab</code> trong Lab 4, và sửa nó là một trong hai bug logic của bản khởi đầu.</p>

<h3>Khoá là số: <code>Record&lt;number, User&gt;</code> hay <code>Map</code></h3>
${ma('typescript', CODE.byid)}
${ra(OUT['18-byid-tsc'])}
${ra(OUT['19-byid-run'])}
<p>Id người dùng tới lúc chạy, nên tập khoá là mở: đọc có thể trượt, và tsc bắt bạn kiểm (TS2532 ở dòng 13). Hai sự thật lúc chạy từ output: id không có thì cả hai bản đều trả <code>undefined</code>, và <code>Object.keys(byId)</code> in <code>['1', '2']</code> — <strong>khoá của object luôn là chuỗi</strong>, kiểu number chỉ có ở phía TypeScript. <code>Map</code> giữ khoá số thật, có <code>.size</code>, và là lựa chọn tốt hơn khi mục được thêm và xoá thường xuyên.</p>

<h3>Trộn thuộc tính có tên với index signature</h3>
${ma('typescript', CODE.mixed)}
${ra(OUT['20-mixed'])}
<p>Nếu mọi khoá chuỗi ánh xạ tới <code>number</code> thì khoá <code>'updatedAt'</code> cũng phải thế: TS2411. Hãy đặt metadata cạnh từ điển — <code>{ updatedAt: string; seats: Record&lt;LabCode, number&gt; }</code>.</p>

<h3>Từ điển nào, khi nào</h3>
${BANG_VI}

<h3>🗺 Một khoá từ URL, an toàn</h3>
${FLOW_VI}

<h3>💼 Góc phỏng vấn</h3>
<p><strong>“Index signature khác <code>Record</code> thế nào?”</strong> <code>Record&lt;string, V&gt;</code> giống hệt <code>{ [k: string]: V }</code>; khác biệt hiện ra với union khoá — <code>Record&lt;LabCode, V&gt;</code> đòi đủ mọi khoá và từ chối khoá khác. <strong>“Vì sao <code>Object.keys</code> trả <code>string[]</code>?”</strong> Vì structural typing, lúc chạy object có thể có nhiều khoá hơn kiểu của nó liệt kê. <strong>“<code>noUncheckedIndexedAccess</code> làm gì?”</strong> Thêm <code>| undefined</code> cho phép đọc qua index signature và mảng — đã đo ở trên: không có nó thì 0 lỗi và sập, có nó thì TS2532.</p>

<h3>🧪 Luyện tập (15 phút)</h3>
<div class="callout ok">
<p><code>demo4/ts-04-4/practice/start/usage.ts</code> — “hôm nay mỗi phòng kín bao nhiêu?”:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['21-pr-start'])}
${ra(OUT['22-pr-start-run'])}
<ol>
<li>Vì sao Node in <code>NaN%</code> cho BE-202, và lỗi tsc nào đã báo trước điều đó?</li>
<li>Đóng cả hai từ điển theo <code>LabCode</code>, lặp qua <code>LABS</code>, và truyền tường minh số 0 của BE-202.</li>
</ol>
<p><strong>Lời giải và output thật.</strong> <code>booked['BE-202']</code> là <code>undefined</code>, và <code>undefined / 40</code> là <code>NaN</code> — TS2532 ở cột 71 đã chỉ đúng chỗ đó:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['23-pr-sol'])}
<p><strong>Đạt khi:</strong> tsc không in gì và Node in <code>BE-202 0%</code>. Code Lab có thêm ba bài: đóng bảng <code>LAB_INFO</code>, đếm theo phòng mà không mất số không, và một chỉ mục người dùng phải thừa nhận có lúc trượt.</p>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">index signature (chữ ký chỉ mục)</span><span class="v"><code>{ [code: string]: Lab }</code> — không liệt kê khoá, chỉ kiểu khoá và kiểu giá trị.</span></div>
  <div class="kv"><span class="k"><code>Record&lt;K, V&gt;</code></span><span class="v">Object có khoá <code>K</code>, giá trị <code>V</code>. Đóng khi <code>K</code> là union các literal.</span></div>
  <div class="kv"><span class="k">noUncheckedIndexedAccess</span><span class="v">Cờ tsconfig (khoá này bật): đọc qua chỉ mục ra <code>V | undefined</code>.</span></div>
  <div class="kv"><span class="k">TS7053</span><span class="v">“Element implicitly has an 'any' type because expression … can't be used to index” — một khoá không có trong kiểu.</span></div>
  <div class="kv"><span class="k">TS2411</span><span class="v">Thuộc tính có tên không khớp kiểu giá trị của index signature.</span></div>
  <div class="kv"><span class="k">Map</span><span class="v">Một object từ điển thật: khoá kiểu gì cũng được, <code>.get</code> / <code>.set</code> / <code>.size</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Khoá không tồn tại làm JavaScript sập; index signature thiếu <code>noUncheckedIndexedAccess</code> biên dịch 0 lỗi rồi sập y hệt; có cờ thì TS2532.</li>
<li><code>Record&lt;LabCode, Lab&gt;</code>: thiếu phòng TS2741, thừa TS2353, khoá lạ hay <code>string</code> thường TS7053 — và không cần kiểm với <code>LabCode</code> thật.</li>
<li><code>Object.keys</code> cho <code>string[]</code> (TS7053): lặp qua <code>LABS</code> hoặc dùng <code>Object.entries</code>.</li>
<li>Đếm vào <code>Record&lt;LabCode, number&gt;</code> giữ BE-202 ở 0 thay vì đánh mất nó; <code>{}</code> là TS2739.</li>
<li>Khoá số là chuỗi lúc chạy (<code>['1', '2']</code>); dùng <code>Map</code> cho khoá không phải chuỗi thật sự.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Object Types: Index Signatures', 'Cú pháp index signature, kiểu khoá được phép, và luật thuộc tính phải khớp. Đọc ngày 1/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/objects.html')}
${nguon('📘', 'TypeScript Handbook — Utility Types: Record&lt;Keys, Type&gt;', 'Dựng kiểu object có khoá Keys và giá trị Type. Đọc ngày 1/11/2026.', 'https://www.typescriptlang.org/docs/handbook/utility-types.html')}
${nguon('📘', 'TSConfig reference — noUncheckedIndexedAccess', 'Thêm undefined cho mọi trường không khai báo trong kiểu. Đọc ngày 1/11/2026.', 'https://www.typescriptlang.org/tsconfig/#noUncheckedIndexedAccess')}
${nguon('📗', 'MDN — Map', 'Khoá kiểu bất kỳ, giữ thứ tự chèn, có size. Đọc ngày 1/11/2026.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map')}
${lienKet({ khoa: 'api-design', bai: 'api-3-4-sap-xep', title: 'Khoá từ URL phải nằm trong danh sách — API Design 3.4: sắp xếp với danh sách cho phép', sub: 'Giống: một cái tên tới từ query string (?sort=…) phải được đối chiếu với một danh sách đóng trước khi dùng để tra bất cứ thứ gì, không thì thành lỗi hoặc lỗ hổng. Khác: ở đó API kiểm danh sách cho phép lúc chạy; ở đây danh sách đóng là một kiểu — Record&lt;LabCode, Lab&gt; — nên tsc từ chối khoá lạ (TS7053) và buộc chữ từ URL đi qua guard trước.', cta: 'MỞ BÀI API DESIGN →' })}
</div>
`,
};
