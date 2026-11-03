/**
 * TypeScript · Chương 8 · Lab 8 — Utility types & tầng DTO của API. BÀI MỚI 04/11/2026, slug typescript-8-6-lab-utility-dto (đứng TRƯỚC quiz 8.5).
 * Máy chấm = scripts/cham-lab-8.mjs trong LabFlow TS (tsc 7.0.2 + node 22.23.3 thật): A2·B1·C1·D2·E 8×0,5; đạt 7.
 * Số đo thật: khởi đầu (any khắp nơi) 5/10 · "DTO quá lỏng + MyPick không ràng buộc" 8/10 · "MyPick không ràng buộc keyof" 9.5/10 · tham khảo 10/10.
 * Mọi code/output lấy từ ./_ma-ts-lab-8.mjs (SINH TỰ ĐỘNG). Lời giải = ./_labflow-ts/src/rules/dto.ts.
 */
import G from '../giang/ts-lab-8.mjs';
import { ma, ra, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-lab-8.mjs';

const noc = (s) => s.split('\n').map((l) => l.replace(/\s+\/\/ S\d.*$/, '')).join('\n');
const STARTER_TOP = CODE.starter.split('\n').slice(2, 11).join('\n');

const BANG_EN = `<table>
<thead><tr><th>#</th><th>Wrong use</th><th>tsc must say</th><th>Which utility catches it</th></tr></thead>
<tbody>
<tr><td>S1</td><td><code>CreateBooking</code> carrying <code>id</code></td><td>TS2353</td><td><code>Omit</code> removed the server fields (8.2)</td></tr>
<tr><td>S2</td><td>read <code>.passwordHash</code> on a <code>PublicUser</code></td><td>TS2339</td><td><code>Omit&lt;User, 'passwordHash'&gt;</code> (8.2)</td></tr>
<tr><td>S3</td><td><code>CreateBooking</code> missing <code>seats</code></td><td>TS2741</td><td>the create DTO keeps the required fields (8.2)</td></tr>
<tr><td>S4</td><td><code>MyPick&lt;User, 'emial'&gt;</code></td><td>TS2344</td><td><code>K extends keyof T</code> (8.2)</td></tr>
<tr><td>S5</td><td><code>UpdateBooking</code> setting <code>createdAt</code></td><td>TS2353</td><td><code>MyPartial&lt;MyOmit&lt;…&gt;&gt;</code> (8.1, 8.2)</td></tr>
<tr><td>S6</td><td>a patch with a typo'd field</td><td>TS2561</td><td><code>MyPartial</code> keeps real keys only (8.1)</td></tr>
<tr><td>S7</td><td>a <code>PublicUser</code> used as a full <code>User</code></td><td>TS2741</td><td><code>Omit</code> dropped <code>passwordHash</code> (8.2)</td></tr>
<tr><td>S8</td><td><code>MyOmit&lt;Booking, 'xyz'&gt;</code></td><td>TS2344</td><td><code>K extends keyof T</code> (8.2)</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>#</th><th>Cách dùng sai</th><th>tsc phải báo</th><th>Utility nào bắt</th></tr></thead>
<tbody>
<tr><td>S1</td><td><code>CreateBooking</code> mang <code>id</code></td><td>TS2353</td><td><code>Omit</code> đã bỏ trường server (8.2)</td></tr>
<tr><td>S2</td><td>đọc <code>.passwordHash</code> trên một <code>PublicUser</code></td><td>TS2339</td><td><code>Omit&lt;User, 'passwordHash'&gt;</code> (8.2)</td></tr>
<tr><td>S3</td><td><code>CreateBooking</code> thiếu <code>seats</code></td><td>TS2741</td><td>DTO tạo giữ các trường bắt buộc (8.2)</td></tr>
<tr><td>S4</td><td><code>MyPick&lt;User, 'emial'&gt;</code></td><td>TS2344</td><td><code>K extends keyof T</code> (8.2)</td></tr>
<tr><td>S5</td><td><code>UpdateBooking</code> đặt <code>createdAt</code></td><td>TS2353</td><td><code>MyPartial&lt;MyOmit&lt;…&gt;&gt;</code> (8.1, 8.2)</td></tr>
<tr><td>S6</td><td>một patch có trường gõ sai</td><td>TS2561</td><td><code>MyPartial</code> chỉ giữ khoá thật (8.1)</td></tr>
<tr><td>S7</td><td>một <code>PublicUser</code> dùng như một <code>User</code> đầy đủ</td><td>TS2741</td><td><code>Omit</code> đã bỏ <code>passwordHash</code> (8.2)</td></tr>
<tr><td>S8</td><td><code>MyOmit&lt;Booking, 'xyz'&gt;</code></td><td>TS2344</td><td><code>K extends keyof T</code> (8.2)</td></tr>
</tbody>
</table>`;
const RUBRIC_EN = `<table>
<thead><tr><th>Part</th><th>Points</th><th>How the grader checks it</th></tr></thead>
<tbody>
<tr><td>A — your file compiles</td><td>2</td><td><code>tsc -p</code>, course tsconfig (strict, nodenext)</td></tr>
<tr><td>B — correct uses compile</td><td>1</td><td><code>kiem/phai-dung.ts</code>: a <code>CreateBooking</code>, an <code>UpdateBooking</code>, a <code>PublicUser</code></td></tr>
<tr><td>C — honesty</td><td>1</td><td>no <code>any</code>, <code>as</code> (except <code>as const</code>), <code>!</code> or <code>@ts-</code></td></tr>
<tr><td>D — behaviour</td><td>2</td><td><code>node --test</code>: <code>createBooking</code> fills server fields, <code>toPublic</code> drops the hash</td></tr>
<tr><td>E — wrong uses refused</td><td>4 (8 × 0.5)</td><td>each marked line of <code>kiem/sai.ts</code> has the expected code</td></tr>
</tbody>
</table>`;
const RUBRIC_VI = `<table>
<thead><tr><th>Phần</th><th>Điểm</th><th>Máy chấm kiểm thế nào</th></tr></thead>
<tbody>
<tr><td>A — tệp của bạn biên dịch được</td><td>2</td><td><code>tsc -p</code>, tsconfig của khoá (strict, nodenext)</td></tr>
<tr><td>B — cách dùng đúng biên dịch được</td><td>1</td><td><code>kiem/phai-dung.ts</code>: một <code>CreateBooking</code>, một <code>UpdateBooking</code>, một <code>PublicUser</code></td></tr>
<tr><td>C — trung thực</td><td>1</td><td>không <code>any</code>, <code>as</code> (trừ <code>as const</code>), <code>!</code> hay <code>@ts-</code></td></tr>
<tr><td>D — hành vi</td><td>2</td><td><code>node --test</code>: <code>createBooking</code> điền trường server, <code>toPublic</code> bỏ hash</td></tr>
<tr><td>E — cách dùng sai bị từ chối</td><td>4 (8 × 0,5)</td><td>mỗi dòng đánh dấu trong <code>kiem/sai.ts</code> có đúng mã</td></tr>
</tbody>
</table>`;

export default {
  title: 'Lab 8 — Utility types & the API DTO layer|||Lab 8 — Utility types & tầng DTO của API',
  slug: 'typescript-8-6-lab-utility-dto',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab Chương 8 có thang 10 điểm và máy chấm chạy tsc + Node thật: dto.ts của LabFlow. Bạn tự dựng lại MyPartial/MyPick/MyOmit từ số 0, rồi dùng chúng dựng tầng DTO của API — CreateBooking = MyOmit (bỏ id/status/createdAt), UpdateBooking = MyPartial của đó, PublicUser = MyOmit<User,"passwordHash">. Bản khởi đầu dùng any: biên dịch 0 lỗi mà chỉ 5/10 — body tạo có id lọt, đọc passwordHash lọt. Có output thật của "DTO quá lỏng + MyPick không ràng buộc" (8/10), "MyPick không ràng buộc keyof" (9.5/10) và lời giải 10/10.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lab 8</span>
<h2>Utility types &amp; the API DTO layer</h2>
<p class="lead">60–90 minutes. You have used <code>Partial</code>, <code>Pick</code> and <code>Omit</code>; now you build them. Lab 8 asks you to rebuild the three everyday utility types from scratch — <code>MyPartial</code>, <code>MyPick</code>, <code>MyOmit</code> — and then use them to build the API DTO layer: a create body, an update body and a public view. A teammate wrote it with <code>any</code>; it compiles with <strong>zero errors</strong> and the grader gives it <strong>5 out of 10</strong>. You rebuild it until the grader says 10/10.</p>

<h3>What this lab trains</h3>
<ul>
<li><strong>8.1</strong> — <code>MyPartial</code> (the optional mapped type) and composing it with <code>MyOmit</code>.</li>
<li><strong>8.2</strong> — <code>MyPick</code> and <code>MyOmit</code>, and the <code>K extends keyof T</code> constraint.</li>
<li><strong>8.4</strong> — <code>Exclude</code>, used inside <code>MyOmit = MyPick&lt;T, Exclude&lt;keyof T, K&gt;&gt;</code>.</li>
<li>Deriving a whole DTO layer so it tracks the models and cannot drift.</li>
</ul>

<h3>Setup</h3>
<ol>
<li>Use <code>labflow-ts</code> at the end of Chapter 8 and <code>npm ci</code> (same pinned <code>typescript</code> 7.0.2 + <code>@types/node</code> as before).</li>
<li>The lab's tsconfig only extends the course one:
${ma('json', CODE.labTsconfig)}</li>
<li>Your starting point — the teammate's <code>any</code> version:
${ma('typescript', STARTER_TOP)}</li>
</ol>
<p>You edit only <code>lab8/src/dto.ts</code>.</p>

<h3>Zero errors — and why that proves nothing</h3>
${ra(OUT['l2-starter-tsc'])}
<p>Strict mode, no errors — because the three utilities and all three DTOs are <code>any</code>, and <code>any</code> refuses nothing. A create body with an <code>id</code>, a leaked password, a typo'd patch all slip through. A DTO layer built on <code>any</code> is a boundary that checks nothing.</p>

<h3>The grader — the starter scores 5</h3>
${ra(OUT['l3-starter'])}
<p><strong>5 out of 10.</strong> A, B and D pass (<code>any</code> compiles, and the runtime happens to work), but C fails (<code>any</code>) and E is 0/8 — every wrong use slips through. The point of the lab is E.</p>

<h3>Your task</h3>
<p>Edit <strong>only</strong> <code>lab8/src/dto.ts</code> until <code>npm run lab8</code> prints <strong>Score: 10/10</strong>: write <code>MyPartial&lt;T&gt;</code>, <code>MyPick&lt;T, K extends keyof T&gt;</code> and <code>MyOmit&lt;T, K extends keyof T&gt; = MyPick&lt;T, Exclude&lt;keyof T, K&gt;&gt;</code>; then derive <code>CreateBooking = MyOmit&lt;Booking, 'id' | 'status' | 'createdAt'&gt;</code>, <code>UpdateBooking = MyPartial&lt;MyOmit&lt;Booking, 'id' | 'createdAt'&gt;&gt;</code>, and <code>PublicUser = MyOmit&lt;User, 'passwordHash'&gt;</code>. No <code>any</code>, <code>as</code> (except <code>as const</code>), <code>!</code> or <code>@ts-</code>.</p>

<h3>The eight wrong uses</h3>
${ma('typescript', noc(CODE.sai))}
${BANG_EN}
<p>Every one compiles against the <code>any</code> starter; your utility types and DTOs must refuse each with the code shown.</p>

<h3>What first attempts usually look like</h3>
<p><strong>Attempt A — the three utilities right, but the DTOs too loose</strong> (<code>lab8/yeu/</code>):</p>
${ra(OUT['l4-yeu'])}
<div class="pitfall co-tieu-de">
<p><strong>Trap — do not loosen the DTOs to make them compile.</strong> 8/10. Both booking DTOs were made “a <code>MyPartial</code> of the whole <code>Booking</code>”, and <code>MyPick</code>'s key is left unconstrained. So a create may omit <code>seats</code> or carry <code>id</code> (S1, S3 slip), a patch may set <code>createdAt</code> (S5 slips), and <code>MyPick</code> accepts a misspelt key (S4 slips). The DTOs must be <em>derived precisely</em> with <code>MyOmit</code>, not loosened.</p>
</div>
<p><strong>Attempt B — everything derived, but <code>MyPick</code>'s key is unconstrained</strong> (<code>lab8/vua/</code>):</p>
${ra(OUT['l5-vua'])}
<p>9.5/10 — the DTOs are right and seven of the eight wrong uses are refused. But <code>MyPick&lt;T, K extends PropertyKey&gt;</code> accepts a key that does not exist, so <code>MyPick&lt;User, 'emial'&gt;</code> (S4) slips. Constrain <code>K</code> to <code>keyof T</code> and the last half-point comes back — the constraint is what makes <code>Pick</code> and <code>Omit</code> refuse a key that is not there.</p>

<h3>Rubric (10 points, pass mark 7)</h3>
${RUBRIC_EN}

<h3>Hints — open one at a time</h3>
<ol>
<li><code>type MyPartial&lt;T&gt; = { [K in keyof T]?: T[K] }</code>.</li>
<li><code>type MyPick&lt;T, K extends keyof T&gt; = { [P in K]: T[P] }</code> — the constraint is what refuses a bad key.</li>
<li><code>type MyOmit&lt;T, K extends keyof T&gt; = MyPick&lt;T, Exclude&lt;keyof T, K&gt;&gt;</code> — three utilities in one line.</li>
<li><code>CreateBooking = MyOmit&lt;Booking, 'id' | 'status' | 'createdAt'&gt;</code>; <code>UpdateBooking = MyPartial&lt;MyOmit&lt;Booking, 'id' | 'createdAt'&gt;&gt;</code>.</li>
<li><code>toPublic</code> returns only <code>id</code>, <code>name</code>, <code>email</code> — the compiler refuses the hash because <code>PublicUser</code> does not have it.</li>
</ol>

<h3>Reference solution (read after trying)</h3>
${ma('typescript', CODE.ref)}
${ra(OUT['l6-ref'])}
<p>Ten out of ten. Three things to notice:</p>
<ul>
<li><strong>Three small type definitions.</strong> <code>MyOmit</code> is <code>MyPick</code> over <code>Exclude</code> of the keys — three utilities of the chapter in one line.</li>
<li><strong>The DTOs derive from the models.</strong> Add a field to <code>Booking</code> and <code>CreateBooking</code> and <code>UpdateBooking</code> gain it at once; they cannot drift.</li>
<li><strong>The leak is a compile error, not a review note.</strong> <code>PublicUser</code> omits <code>passwordHash</code>, so <code>toPublic</code> cannot return it and no caller can read it.</li>
</ul>

<h3>Before you call it done</h3>
<ul>
<li><code>npm run lab8</code> prints <strong>Score: 10/10</strong>.</li>
<li>No <code>any</code>, no <code>as</code>, no <code>!</code>; the DTOs are derived with your <code>MyPartial</code>/<code>MyPick</code>/<code>MyOmit</code>, not hand-written.</li>
<li>You can say which utility refuses each of S1–S8.</li>
<li>Commit: <code>feat(dto): utility-type DTO layer (lab 8: 10/10)</code>.</li>
</ul>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">DTO</span><span class="v">A data-transfer shape — a create body, a public view — derived from a model.</span></div>
  <div class="kv"><span class="k"><code>MyPartial</code></span><span class="v">The optional mapped type (8.1).</span></div>
  <div class="kv"><span class="k"><code>MyPick</code> / <code>MyOmit</code></span><span class="v">Keep / drop keys; <code>MyOmit</code> = <code>MyPick</code> over <code>Exclude</code> (8.2, 8.4).</span></div>
  <div class="kv"><span class="k"><code>K extends keyof T</code></span><span class="v">The constraint that refuses a key that does not exist.</span></div>
</div>

<h3>🗺 How the grader scores you</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Compile</div><div class="lz-d">strict tsc, then the correct uses (A, B)</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Scan</div><div class="lz-d">no any, as, ! or @ts- (C)</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Run</div><div class="lz-d">node --test: createBooking, toPublic (D)</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Attack</div><div class="lz-d">8 wrong uses, each with its code (E)</div></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A DTO layer built on <code>any</code> compiles with zero errors and refuses nothing (5/10).</li>
<li>The utilities right but the DTOs loosened scores 8 — a create may carry <code>id</code> and a patch may set <code>createdAt</code>.</li>
<li>Everything derived but <code>MyPick</code> unconstrained scores 9.5 — a misspelt key still slips.</li>
<li>The reference: <code>MyPartial</code>/<code>MyPick</code>/<code>MyOmit</code> in three lines, then three DTOs derived from the models — no casts.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Utility Types', 'Partial, Pick, Omit, Exclude — the utilities this lab rebuilds. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/utility-types.html')}
${nguon('📘', 'TypeScript Handbook — Mapped Types', 'The mapped and key-remapping syntax behind MyPick and MyOmit. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/mapped-types.html')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Lab 8</span>
<h2>Utility types &amp; tầng DTO của API</h2>
<p class="lead">60–90 phút. Bạn đã dùng <code>Partial</code>, <code>Pick</code>, <code>Omit</code>; giờ bạn dựng chúng. Lab 8 yêu cầu dựng lại ba utility type hằng ngày từ số 0 — <code>MyPartial</code>, <code>MyPick</code>, <code>MyOmit</code> — rồi dùng chúng dựng tầng DTO của API: một body tạo, một body cập nhật và một bản công khai. Một đồng đội viết bằng <code>any</code>; nó biên dịch <strong>0 lỗi</strong> và máy chấm cho <strong>5 trên 10</strong>. Bạn dựng lại tới khi máy chấm báo 10/10.</p>

<h3>Lab này rèn gì</h3>
<ul>
<li><strong>8.1</strong> — <code>MyPartial</code> (mapped type optional) và ghép nó với <code>MyOmit</code>.</li>
<li><strong>8.2</strong> — <code>MyPick</code> và <code>MyOmit</code>, và ràng buộc <code>K extends keyof T</code>.</li>
<li><strong>8.4</strong> — <code>Exclude</code>, dùng bên trong <code>MyOmit = MyPick&lt;T, Exclude&lt;keyof T, K&gt;&gt;</code>.</li>
<li>Suy ra cả một tầng DTO để nó bám theo model và không trôi.</li>
</ul>

<h3>Chuẩn bị</h3>
<ol>
<li>Dùng <code>labflow-ts</code> ở cuối Chương 8 và <code>npm ci</code> (cùng bản ghim <code>typescript</code> 7.0.2 + <code>@types/node</code> như trước).</li>
<li>tsconfig của lab chỉ extends của khoá:
${ma('json', CODE.labTsconfig)}</li>
<li>Điểm xuất phát — bản <code>any</code> của đồng đội:
${ma('typescript', STARTER_TOP)}</li>
</ol>
<p>Bạn chỉ sửa <code>lab8/src/dto.ts</code>.</p>

<h3>Không lỗi — và vì sao điều đó không chứng minh gì</h3>
${ra(OUT['l2-starter-tsc'])}
<p>Strict, không lỗi — vì ba utility và cả ba DTO là <code>any</code>, và <code>any</code> chẳng từ chối gì. Một body tạo có <code>id</code>, một mật khẩu bị lộ, một patch gõ sai đều lọt. Một tầng DTO dựng trên <code>any</code> là một ranh giới không kiểm gì.</p>

<h3>Máy chấm — bản khởi đầu được 5</h3>
${ra(OUT['l3-starter'])}
<p><strong>5 trên 10.</strong> A, B và D qua (<code>any</code> biên dịch, và lúc chạy tình cờ đúng), nhưng C trượt (<code>any</code>) và E là 0/8 — mọi cách dùng sai lọt. Mấu chốt của lab là E.</p>

<h3>Việc của bạn</h3>
<p>Chỉ sửa <code>lab8/src/dto.ts</code> tới khi <code>npm run lab8</code> in <strong>Score: 10/10</strong>: viết <code>MyPartial&lt;T&gt;</code>, <code>MyPick&lt;T, K extends keyof T&gt;</code> và <code>MyOmit&lt;T, K extends keyof T&gt; = MyPick&lt;T, Exclude&lt;keyof T, K&gt;&gt;</code>; rồi suy <code>CreateBooking = MyOmit&lt;Booking, 'id' | 'status' | 'createdAt'&gt;</code>, <code>UpdateBooking = MyPartial&lt;MyOmit&lt;Booking, 'id' | 'createdAt'&gt;&gt;</code>, và <code>PublicUser = MyOmit&lt;User, 'passwordHash'&gt;</code>. Không <code>any</code>, <code>as</code> (trừ <code>as const</code>), <code>!</code> hay <code>@ts-</code>.</p>

<h3>Tám cách dùng sai</h3>
${ma('typescript', noc(CODE.sai))}
${BANG_VI}
<p>Mỗi cái biên dịch được với bản <code>any</code>; các utility type và DTO của bạn phải từ chối từng cái với mã đã ghi.</p>

<h3>Những lần thử đầu thường trông thế nào</h3>
<p><strong>Thử A — ba utility đúng, nhưng DTO quá lỏng</strong> (<code>lab8/yeu/</code>):</p>
${ra(OUT['l4-yeu'])}
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — đừng nới lỏng DTO để nó biên dịch.</strong> 8/10. Cả hai DTO của booking bị làm “một <code>MyPartial</code> của cả <code>Booking</code>”, và khoá của <code>MyPick</code> bị để không ràng buộc. Nên một create có thể bỏ <code>seats</code> hoặc mang <code>id</code> (S1, S3 lọt), một patch có thể đặt <code>createdAt</code> (S5 lọt), và <code>MyPick</code> nhận một khoá gõ sai (S4 lọt). DTO phải được <em>suy ra chính xác</em> bằng <code>MyOmit</code>, không nới lỏng.</p>
</div>
<p><strong>Thử B — mọi thứ suy ra, nhưng khoá của <code>MyPick</code> không ràng buộc</strong> (<code>lab8/vua/</code>):</p>
${ra(OUT['l5-vua'])}
<p>9.5/10 — các DTO đúng và bảy trong tám cách dùng sai bị từ chối. Nhưng <code>MyPick&lt;T, K extends PropertyKey&gt;</code> nhận một khoá không tồn tại, nên <code>MyPick&lt;User, 'emial'&gt;</code> (S4) lọt. Ràng buộc <code>K</code> vào <code>keyof T</code> và nửa điểm cuối trở lại — ràng buộc là thứ làm <code>Pick</code> và <code>Omit</code> từ chối một khoá không có.</p>

<h3>Thang điểm (10 điểm, đạt 7)</h3>
${RUBRIC_VI}

<h3>Gợi ý — mở từng cái một</h3>
<ol>
<li><code>type MyPartial&lt;T&gt; = { [K in keyof T]?: T[K] }</code>.</li>
<li><code>type MyPick&lt;T, K extends keyof T&gt; = { [P in K]: T[P] }</code> — ràng buộc là thứ từ chối một khoá sai.</li>
<li><code>type MyOmit&lt;T, K extends keyof T&gt; = MyPick&lt;T, Exclude&lt;keyof T, K&gt;&gt;</code> — ba utility trong một dòng.</li>
<li><code>CreateBooking = MyOmit&lt;Booking, 'id' | 'status' | 'createdAt'&gt;</code>; <code>UpdateBooking = MyPartial&lt;MyOmit&lt;Booking, 'id' | 'createdAt'&gt;&gt;</code>.</li>
<li><code>toPublic</code> chỉ trả <code>id</code>, <code>name</code>, <code>email</code> — trình biên dịch từ chối hash vì <code>PublicUser</code> không có nó.</li>
</ol>

<h3>Lời giải tham khảo (đọc sau khi đã thử)</h3>
${ma('typescript', CODE.ref)}
${ra(OUT['l6-ref'])}
<p>Mười trên mười. Ba điều đáng chú ý:</p>
<ul>
<li><strong>Ba định nghĩa kiểu nhỏ.</strong> <code>MyOmit</code> là <code>MyPick</code> trên <code>Exclude</code> của các khoá — ba utility của chương trong một dòng.</li>
<li><strong>Các DTO suy từ model.</strong> Thêm một trường vào <code>Booking</code> thì <code>CreateBooking</code> và <code>UpdateBooking</code> có ngay; chúng không trôi được.</li>
<li><strong>Lộ bí mật là một lỗi biên dịch, không phải một ghi chú soát code.</strong> <code>PublicUser</code> bỏ <code>passwordHash</code>, nên <code>toPublic</code> không trả được nó và không người gọi nào đọc được.</li>
</ul>

<h3>Trước khi coi là xong</h3>
<ul>
<li><code>npm run lab8</code> in <strong>Score: 10/10</strong>.</li>
<li>Không <code>any</code>, không <code>as</code>, không <code>!</code>; các DTO suy bằng <code>MyPartial</code>/<code>MyPick</code>/<code>MyOmit</code> của bạn, không viết tay.</li>
<li>Bạn nói được utility nào từ chối từng S1–S8.</li>
<li>Commit: <code>feat(dto): utility-type DTO layer (lab 8: 10/10)</code>.</li>
</ul>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">DTO</span><span class="v">Một dáng truyền dữ liệu — một body tạo, một bản công khai — suy từ một model.</span></div>
  <div class="kv"><span class="k"><code>MyPartial</code></span><span class="v">Mapped type optional (8.1).</span></div>
  <div class="kv"><span class="k"><code>MyPick</code> / <code>MyOmit</code></span><span class="v">Giữ / bỏ khoá; <code>MyOmit</code> = <code>MyPick</code> trên <code>Exclude</code> (8.2, 8.4).</span></div>
  <div class="kv"><span class="k"><code>K extends keyof T</code></span><span class="v">Ràng buộc từ chối một khoá không tồn tại.</span></div>
</div>

<h3>🗺 Máy chấm cho điểm thế nào</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Biên dịch</div><div class="lz-d">tsc strict, rồi các cách dùng đúng (A, B)</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Quét</div><div class="lz-d">không any, as, ! hay @ts- (C)</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Chạy</div><div class="lz-d">node --test: createBooking, toPublic (D)</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Tấn công</div><div class="lz-d">8 cách dùng sai, mỗi cái đúng mã (E)</div></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một tầng DTO dựng trên <code>any</code> biên dịch 0 lỗi và chẳng từ chối gì (5/10).</li>
<li>Các utility đúng nhưng DTO nới lỏng được 8 — một create có thể mang <code>id</code> và một patch có thể đặt <code>createdAt</code>.</li>
<li>Mọi thứ suy ra nhưng <code>MyPick</code> không ràng buộc được 9.5 — một khoá gõ sai vẫn lọt.</li>
<li>Lời giải: <code>MyPartial</code>/<code>MyPick</code>/<code>MyOmit</code> trong ba dòng, rồi ba DTO suy từ model — không ép kiểu.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Utility Types', 'Partial, Pick, Omit, Exclude — các utility lab này dựng lại. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/utility-types.html')}
${nguon('📘', 'TypeScript Handbook — Mapped Types', 'Cú pháp mapped và đổi tên khoá đằng sau MyPick và MyOmit. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/mapped-types.html')}
</div>
`,
};
