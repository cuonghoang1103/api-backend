/**
 * TypeScript · Chương 5 · 5.4 — Kiểm tra đầy đủ với never (assertNever, assertion function, bẫy default bắt-hết). Slug giữ: typescript-5-4-exhaustiveness.
 * Soạn lại TRỌN 03/11/2026 theo ./_HOP-DONG.md. Code/output từ ./_ma-ts-05-4.mjs (demo5/ts-05-4, Node 22.23.3 + tsc 7.0.2).
 */
import G from '../giang/ts-05-4.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-05-4.mjs';

const BANG_EN = `<table>
<thead><tr><th>You write…</th><th>Add a case to the union</th><th>Verdict</th></tr></thead>
<tbody>
<tr><td><code>default: return assertNever(x)</code></td><td>TS2345 at the <code>assertNever</code> call</td><td>✅ compile error — you must handle it</td></tr>
<tr><td>no <code>default</code>, every case returns</td><td>return-type error (the function can now fall through)</td><td>✅ compile error, when the return type forbids <code>undefined</code></td></tr>
<tr><td><code>default: return 'something'</code></td><td>nothing — the new case hits the default</td><td>❌ silent wrong value at runtime</td></tr>
<tr><td><code>Record&lt;Union, V&gt;</code> table</td><td>TS2741 — a missing key</td><td>✅ compile error — add the entry</td></tr>
<tr><td><code>{ [k: string]: V }</code> table</td><td>nothing — any key is allowed</td><td>❌ a new case ships unlabelled</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Bạn viết…</th><th>Thêm một case vào union</th><th>Kết cục</th></tr></thead>
<tbody>
<tr><td><code>default: return assertNever(x)</code></td><td>TS2345 ở lời gọi <code>assertNever</code></td><td>✅ lỗi biên dịch — phải xử lý</td></tr>
<tr><td>không <code>default</code>, mọi case return</td><td>lỗi kiểu trả về (hàm giờ có thể rơi khỏi đáy)</td><td>✅ lỗi biên dịch, khi kiểu trả về cấm <code>undefined</code></td></tr>
<tr><td><code>default: return 'gì đó'</code></td><td>không gì — case mới rơi vào default</td><td>❌ giá trị sai âm thầm lúc chạy</td></tr>
<tr><td>bảng <code>Record&lt;Union, V&gt;</code></td><td>TS2741 — thiếu một khoá</td><td>✅ lỗi biên dịch — thêm mục</td></tr>
<tr><td>bảng <code>{ [k: string]: V }</code></td><td>không gì — khoá nào cũng được</td><td>❌ case mới lên sản phẩm mà thiếu nhãn</td></tr>
</tbody>
</table>`;

export default {
  title: '5.4 — Exhaustiveness checking with never|||5.4 — Kiểm tra đầy đủ với never',
  slug: 'typescript-5-4-exhaustiveness',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Biến "thêm một trạng thái" thành lỗi biên dịch, không phải bug âm thầm. never là kiểu rỗng: mọi thứ gán được VÀO kiểu khác, nhưng chỉ never gán được vào never — nên default: return assertNever(x) hợp lệ khi x đã là never, và thêm một case làm x không còn never ⇒ TS2345. Bẫy: một default bắt-hết (return "gì đó") biên dịch sạch và ship trạng thái mới dưới nhãn sai (đo: EXPIRED hiện thành grey). Record<Union, V> là chốt thứ hai (thiếu khoá ⇒ TS2741). Assertion function (asserts cond / asserts x is T) thu hẹp sau khi gọi. Sự cố thật cuongthai.com: enum ContentType CODE→CODE_REVIEW qua hết checklist mà vỡ seed production. Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4</span>
<h2>Exhaustiveness checking with <code>never</code></h2>
<p class="lead">A union grows. Someone adds <code>EXPIRED</code> to a booking status, a new <code>Plan</code> tier, a fifth <code>SlotCode</code>. The question is what happens to the ten <code>switch</code> statements that handled the old set. With <code>never</code> and a one-line helper called <code>assertNever</code>, the answer is “they stop compiling, and point at every place to fix”. Without it, the answer is “they keep running and quietly do the wrong thing”. This lesson is the safety net under every discriminated union — and the subject of Lab 5’s hardest check.</p>

<h3>The exhaustive switch</h3>
${ma('typescript', CODE.v1Status)}
${ra(OUT['11-v1'])}
<p>Every case returns, and the <code>default</code> hands the leftover value to <code>assertNever</code>. The trick is in <code>s</code>’s type on that line: after the three cases, control-flow analysis (5.1) has removed every member of <code>Status</code>, so <code>s</code> is <code>never</code>. <code>assertNever(x: never)</code> accepts it, so today this compiles (0 errors). The point is what happens tomorrow.</p>

<h3>Add a case: the compiler finds every switch</h3>
${ma('typescript', CODE.v2Status)}
${ra(OUT['12-v2'])}
<p>A product manager added <code>EXPIRED</code> to <code>Status</code>. Now, at the <code>default</code>, <code>s</code> is <code>'EXPIRED'</code> — not <code>never</code> — and <code>assertNever('EXPIRED')</code> is <strong>TS2345: Argument of type '"EXPIRED"' is not assignable to parameter of type 'never'</strong>. One edit to the union turned every exhaustive switch red, each pointing exactly at the case it forgot. This is the whole reason <code>never</code> is worth learning.</p>

<h3>Why it works: <code>never</code> is the empty type</h3>
${ma('typescript', CODE.neverBasics)}
${ra(OUT['14-never'])}
<p><code>never</code> has no values, so two things are true: <code>never</code> is assignable <em>to</em> every type (a function returning <code>never</code> can stand in anywhere — it never actually returns), but <em>only</em> <code>never</code> is assignable <em>to</em> <code>never</code>. The second rule is the guard: hand a real leftover value (<code>'PENDING'</code>) to a <code>never</code> slot and it is <strong>TS2322</strong>. <code>assertNever</code> is just a <code>never</code> slot with a helpful runtime throw.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — a catch-all <code>default</code> turns the safety net off.</strong> Replace <code>assertNever</code> with a friendly fallback and the new case compiles — and ships the wrong value in silence:</p>
${ma('typescript', CODE.catchallStatus)}
${ra(OUT['13-catchall'])}
<p>tsc reports 0 errors, and <code>colour('EXPIRED')</code> returns <code>'grey'</code>: an expired booking looks cancelled on every screen, and nothing warned anyone. <code>default: return 'grey'</code> and <code>default: throw new Error('…')</code> are both runtime-only — they do nothing at compile time. Use <code>assertNever</code> in the default (or no default at all) so adding a case is a compile error, not a support ticket.</p>
</div>

<h3>A real incident on this site</h3>
<p>This is not hypothetical. On <strong>2026-08-08</strong>, cuongthai.com renamed the enum value <code>ContentType.CODE</code> to <code>CODE_REVIEW</code>. It passed the whole pre-push checklist and still broke the <strong>seed on production</strong> — because <code>seed.ts</code> carried its own hand-written copy of the union and type-checked against itself, so nothing connected the rename to the place that used the old name. A value was added/renamed in one place and a consumer elsewhere was never told. Exhaustiveness checking is exactly the defence: when the union is the single source of truth and every consumer is exhaustive, a change to the union turns every stale consumer red before it ships. (The seed-specific fix, <code>npm run typecheck:seed</code>, is Chapter 9.)</p>

<h3>A second guard: a closed <code>Record</code></h3>
${ma('typescript', CODE.recordLabel)}
${ra(OUT['16-record'])}
<p>A lookup table typed <code>Record&lt;Status, string&gt;</code> must have one entry per member of <code>Status</code>. Add <code>EXPIRED</code> and the object is missing a key: <strong>TS2741: Property 'EXPIRED' is missing</strong>. This is the 4.4 closed table doing exhaustiveness work — often cleaner than a <code>switch</code> for a pure value-to-value mapping. An open <code>{ [k: string]: string }</code> table has no such check: a new case ships unlabelled. Lab 5 scores both guards.</p>

<h3>Assertion functions: narrow, or throw</h3>
<p>A type predicate (5.3) returns a boolean. An <strong>assertion function</strong> instead narrows by <em>not throwing</em>: if it returns at all, the condition held, and tsc narrows from that line on.</p>
${ma('typescript', CODE.assertFn)}
${ra(OUT['15-assert'])}
<p><code>assert(cond, msg): asserts cond</code> narrows whatever <code>cond</code> tested — after <code>assert(note !== null, …)</code>, <code>note</code> is <code>string</code>. <code>assertActive(s): asserts s is ActiveState</code> narrows <code>s</code> to <code>ActiveState</code> with no block around it. Like a type predicate, an assertion function is a promise tsc trusts — if the body does not actually throw on a bad value, the narrowing is a lie. Use them at boundaries where “this must be true by now” is a real invariant.</p>

<h3>Add a case: the five outcomes</h3>
${BANG_EN}

<h3>💼 Interview corner</h3>
<p><strong>“How do you make a <code>switch</code> exhaustive?”</strong> No catch-all; in the <code>default</code>, <code>return assertNever(x)</code> where <code>assertNever(x: never): never</code> — so a new union member makes the leftover non-<code>never</code> and tsc errors. <strong>“Why not just <code>default: throw</code>?”</strong> A throw is runtime only; it does not stop the build, so a forgotten case ships. <strong>“Type predicate vs assertion function?”</strong> A predicate returns <code>x is T</code> and you branch on it; an assertion function returns <code>void</code> with <code>asserts …</code> and narrows by not throwing — good for invariants.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p><code>demo5/ts-05-4/practice/start/plan.ts</code> — a pricing switch with a catch-all <code>default</code>. It compiles even when it should not:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['17-pr-start'])}
<ol>
<li>Add an <code>ENTERPRISE</code> tier to <code>Plan</code>. The catch-all hides it — replace the default with <code>assertNever</code> so tsc points at the switch.</li>
<li>Real output after step 1 (a new tier, assertNever in the default):</li>
</ol>
${ra(OUT['18-pr-step1'])}
<p><strong>Solution</strong> — handle the new case, keep the guard:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['19-pr-sol'])}
<p><strong>Done when:</strong> with <code>assertNever</code> and no <code>ENTERPRISE</code> case, tsc is TS2345; after you add the case, tsc is clean and Node prints <code>99</code>. Code Lab adds: the exhaustive <code>describe</code>, the closed <code>Record</code> guard, and an assertion function.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">exhaustiveness check</span><span class="v">Proving a switch handles every union member — a new one is a compile error.</span></div>
  <div class="kv"><span class="k"><code>never</code></span><span class="v">The empty type; only <code>never</code> is assignable to <code>never</code> — the basis of the check.</span></div>
  <div class="kv"><span class="k"><code>assertNever</code></span><span class="v"><code>(x: never): never</code> — put it in the default; a leftover value is TS2345.</span></div>
  <div class="kv"><span class="k">catch-all default</span><span class="v"><code>default: return …</code> — runtime only; it hides a new case.</span></div>
  <div class="kv"><span class="k">assertion function</span><span class="v"><code>asserts cond</code> / <code>asserts x is T</code> — narrows by not throwing.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>After every case returns, the <code>default</code> sees <code>never</code>; <code>assertNever(x: never)</code> accepts it — until a case is added, then TS2345.</li>
<li><code>never</code> is the empty type: assignable to anything, but only <code>never</code> is assignable to it.</li>
<li>A catch-all <code>default</code> (or a <code>throw</code>) is runtime only — it compiled and shipped <code>EXPIRED</code> as <code>'grey'</code>.</li>
<li>A closed <code>Record&lt;Union, V&gt;</code> is a second exhaustiveness guard: a missing key is TS2741.</li>
<li>Assertion functions (<code>asserts …</code>) narrow by not throwing; the real 2026-08-08 seed break is what exhaustiveness prevents.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Exhaustiveness checking', 'never in the default case of a discriminated-union switch. Read 3 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking')}
${nguon('📘', 'TypeScript Handbook — Assertion functions', 'asserts cond and asserts x is T. Read 3 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>Kiểm tra đầy đủ với <code>never</code></h2>
<p class="lead">Một union lớn lên. Ai đó thêm <code>EXPIRED</code> vào trạng thái lượt đặt, một bậc <code>Plan</code> mới, một <code>SlotCode</code> thứ năm. Câu hỏi là điều gì xảy ra với mười câu <code>switch</code> từng xử lý tập cũ. Với <code>never</code> và một hàm một dòng tên <code>assertNever</code>, câu trả lời là “chúng ngừng biên dịch, và chỉ ra mọi chỗ cần sửa”. Không có nó, câu trả lời là “chúng vẫn chạy và âm thầm làm sai”. Bài này là lưới an toàn dưới mọi discriminated union — và là phép kiểm khó nhất của Lab 5.</p>

<h3>Câu switch đầy đủ</h3>
${ma('typescript', CODE.v1Status)}
${ra(OUT['11-v1'])}
<p>Mọi case return, và <code>default</code> đưa giá trị còn sót cho <code>assertNever</code>. Mẹo nằm ở kiểu của <code>s</code> trên dòng đó: sau ba case, phân tích luồng điều khiển (5.1) đã loại mọi thành viên của <code>Status</code>, nên <code>s</code> là <code>never</code>. <code>assertNever(x: never)</code> nhận nó, nên hôm nay nó biên dịch (0 lỗi). Mấu chốt là điều xảy ra ngày mai.</p>

<h3>Thêm một case: trình biên dịch tìm ra mọi switch</h3>
${ma('typescript', CODE.v2Status)}
${ra(OUT['12-v2'])}
<p>Một product manager thêm <code>EXPIRED</code> vào <code>Status</code>. Giờ, ở <code>default</code>, <code>s</code> là <code>'EXPIRED'</code> — không phải <code>never</code> — và <code>assertNever('EXPIRED')</code> là <strong>TS2345: Argument of type '"EXPIRED"' is not assignable to parameter of type 'never'</strong>. Một lần sửa union biến mọi switch đầy đủ thành đỏ, mỗi cái chỉ đúng case nó quên. Đây là toàn bộ lý do <code>never</code> đáng học.</p>

<h3>Vì sao nó hoạt động: <code>never</code> là kiểu rỗng</h3>
${ma('typescript', CODE.neverBasics)}
${ra(OUT['14-never'])}
<p><code>never</code> không có giá trị nào, nên hai điều đúng: <code>never</code> gán được <em>vào</em> mọi kiểu (một hàm trả <code>never</code> đứng được ở bất cứ đâu — nó không bao giờ thật sự trả về), nhưng <em>chỉ</em> <code>never</code> gán được <em>vào</em> <code>never</code>. Luật thứ hai là cái chốt: đưa một giá trị sót thật (<code>'PENDING'</code>) vào một ô <code>never</code> thì là <strong>TS2322</strong>. <code>assertNever</code> chỉ là một ô <code>never</code> kèm một cú throw hữu ích lúc chạy.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — một <code>default</code> bắt-hết tắt lưới an toàn đi.</strong> Thay <code>assertNever</code> bằng một giá trị dự phòng thân thiện thì case mới biên dịch — và ship giá trị sai trong im lặng:</p>
${ma('typescript', CODE.catchallStatus)}
${ra(OUT['13-catchall'])}
<p>tsc báo 0 lỗi, và <code>colour('EXPIRED')</code> trả <code>'grey'</code>: một lượt đặt hết hạn trông như đã huỷ trên mọi màn hình, và không gì cảnh báo ai. <code>default: return 'grey'</code> và <code>default: throw new Error('…')</code> đều chỉ-lúc-chạy — chúng chẳng làm gì lúc biên dịch. Dùng <code>assertNever</code> trong default (hoặc không default) để thêm một case là lỗi biên dịch, không phải một ticket hỗ trợ.</p>
</div>

<h3>Một sự cố thật trên chính website này</h3>
<p>Đây không phải giả định. Ngày <strong>08/08/2026</strong>, cuongthai.com đổi tên giá trị enum <code>ContentType.CODE</code> thành <code>CODE_REVIEW</code>. Nó qua hết checklist trước-khi-push mà vẫn vỡ <strong>seed trên production</strong> — vì <code>seed.ts</code> tự chép tay một bản union riêng và tự kiểm với chính nó, nên không gì nối phép đổi tên với chỗ dùng tên cũ. Một giá trị được thêm/đổi ở một chỗ, còn một nơi tiêu thụ khác không bao giờ được báo. Kiểm tra đầy đủ chính là phòng tuyến: khi union là nguồn sự thật duy nhất và mọi nơi tiêu thụ đều đầy đủ, một thay đổi của union làm mọi nơi tiêu thụ cũ hoá đỏ trước khi lên sản phẩm. (Cách sửa riêng cho seed, <code>npm run typecheck:seed</code>, là Chương 9.)</p>

<h3>Chốt thứ hai: một <code>Record</code> đóng</h3>
${ma('typescript', CODE.recordLabel)}
${ra(OUT['16-record'])}
<p>Một bảng tra kiểu <code>Record&lt;Status, string&gt;</code> phải có đúng một mục mỗi thành viên của <code>Status</code>. Thêm <code>EXPIRED</code> thì object thiếu một khoá: <strong>TS2741: Property 'EXPIRED' is missing</strong>. Đây là bảng đóng của 4.4 làm việc kiểm-tra-đầy-đủ — thường gọn hơn một <code>switch</code> cho một ánh xạ giá-trị-sang-giá-trị thuần. Một bảng mở <code>{ [k: string]: string }</code> không có phép kiểm này: một case mới lên sản phẩm mà thiếu nhãn. Lab 5 chấm cả hai chốt.</p>

<h3>Assertion function: thu hẹp, hoặc ném</h3>
<p>Một type predicate (5.3) trả về boolean. Một <strong>assertion function</strong> lại thu hẹp bằng cách <em>không ném</em>: nếu nó trả về được, điều kiện đã đúng, và tsc thu hẹp từ dòng đó trở đi.</p>
${ma('typescript', CODE.assertFn)}
${ra(OUT['15-assert'])}
<p><code>assert(cond, msg): asserts cond</code> thu hẹp bất cứ điều gì <code>cond</code> thử — sau <code>assert(note !== null, …)</code>, <code>note</code> là <code>string</code>. <code>assertActive(s): asserts s is ActiveState</code> thu hẹp <code>s</code> về <code>ActiveState</code> mà không cần khối bao quanh. Như type predicate, assertion function là một lời hứa tsc tin — nếu thân hàm không thật sự ném khi gặp giá trị xấu, phép thu hẹp là một lời nói dối. Dùng chúng ở biên, nơi “đến đây thì điều này phải đúng” là một bất biến thật.</p>

<h3>Thêm một case: năm kết cục</h3>
${BANG_VI}

<h3>💼 Góc phỏng vấn</h3>
<p><strong>“Làm sao để một <code>switch</code> đầy đủ?”</strong> Không bắt-hết; trong <code>default</code>, <code>return assertNever(x)</code> với <code>assertNever(x: never): never</code> — nên một thành viên union mới làm giá trị sót không còn <code>never</code> và tsc báo lỗi. <strong>“Sao không chỉ <code>default: throw</code>?”</strong> Throw chỉ lúc chạy; nó không chặn build, nên một case bị quên vẫn lên sản phẩm. <strong>“Type predicate so với assertion function?”</strong> Predicate trả <code>x is T</code> và bạn rẽ nhánh theo nó; assertion function trả <code>void</code> với <code>asserts …</code> và thu hẹp bằng cách không ném — hợp cho bất biến.</p>

<h3>🧪 Luyện tập (15 phút)</h3>
<div class="callout ok">
<p><code>demo5/ts-05-4/practice/start/plan.ts</code> — một switch tính giá với <code>default</code> bắt-hết. Nó biên dịch kể cả khi đáng lẽ không nên:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['17-pr-start'])}
<ol>
<li>Thêm một bậc <code>ENTERPRISE</code> vào <code>Plan</code>. Default bắt-hết giấu nó đi — thay default bằng <code>assertNever</code> để tsc chỉ vào switch.</li>
<li>Output thật sau bước 1 (một bậc mới, assertNever trong default):</li>
</ol>
${ra(OUT['18-pr-step1'])}
<p><strong>Lời giải</strong> — xử lý case mới, giữ cái chốt:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['19-pr-sol'])}
<p><strong>Đạt khi:</strong> với <code>assertNever</code> và chưa có case <code>ENTERPRISE</code>, tsc báo TS2345; sau khi thêm case, tsc sạch và Node in <code>99</code>. Code Lab thêm: <code>describe</code> đầy đủ, chốt <code>Record</code> đóng, và một assertion function.</p>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">exhaustiveness check (kiểm tra đầy đủ)</span><span class="v">Chứng minh một switch xử lý mọi thành viên union — một cái mới là lỗi biên dịch.</span></div>
  <div class="kv"><span class="k"><code>never</code></span><span class="v">Kiểu rỗng; chỉ <code>never</code> gán được vào <code>never</code> — nền của phép kiểm.</span></div>
  <div class="kv"><span class="k"><code>assertNever</code></span><span class="v"><code>(x: never): never</code> — đặt vào default; một giá trị sót là TS2345.</span></div>
  <div class="kv"><span class="k">default bắt-hết</span><span class="v"><code>default: return …</code> — chỉ lúc chạy; nó giấu một case mới.</span></div>
  <div class="kv"><span class="k">assertion function</span><span class="v"><code>asserts cond</code> / <code>asserts x is T</code> — thu hẹp bằng cách không ném.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Sau khi mọi case return, <code>default</code> thấy <code>never</code>; <code>assertNever(x: never)</code> nhận nó — cho tới khi thêm một case, rồi TS2345.</li>
<li><code>never</code> là kiểu rỗng: gán được vào bất cứ gì, nhưng chỉ <code>never</code> gán được vào nó.</li>
<li>Một <code>default</code> bắt-hết (hay một <code>throw</code>) chỉ lúc chạy — nó đã biên dịch và ship <code>EXPIRED</code> thành <code>'grey'</code>.</li>
<li>Một <code>Record&lt;Union, V&gt;</code> đóng là chốt thứ hai: thiếu một khoá là TS2741.</li>
<li>Assertion function (<code>asserts …</code>) thu hẹp bằng cách không ném; sự cố seed thật 08/08/2026 là thứ kiểm-tra-đầy-đủ ngăn chặn.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Exhaustiveness checking', 'never trong case default của một switch discriminated-union. Đọc ngày 3/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking')}
${nguon('📘', 'TypeScript Handbook — Assertion functions', 'asserts cond và asserts x is T. Đọc ngày 3/11/2026.', 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions')}
</div>
`,
};
