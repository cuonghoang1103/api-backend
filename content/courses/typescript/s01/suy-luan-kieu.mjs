/**
 * TypeScript · Chương 1 · 1.3 — Suy luận kiểu: bạn viết ít hơn bạn tưởng. Slug giữ: typescript-1-3-suy-luan-kieu.
 * Soạn lại 01/11/2026 (đợt mẫu): giữ mẹo xuất .d.ts + bảng let/const của bản cũ, chạy lại thật trên LabFlow TS (Node 22.23.3, tsc 7.0.2).
 * Mọi mã/output lấy từ ./_ma-ts-01-3.mjs (SINH TỰ ĐỘNG từ demo1/ts-01-3 của dự án — đừng sửa tay).
 */
import G from '../giang/ts-01-3.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-01-3.mjs';

const L = (s) => s.split('\n');
const CHECKSLOT = L(CODE.infer).slice(12, 22).join('\n');
const VUA = L(OUT['13-vua']).slice(0, 5).join('\n');
const REF_TYPES = L(CODE.ref).slice(9, 12).join('\n') + '\n// …\n' + L(CODE.ref).slice(22, 23).join('\n');
const RET_B = L(CODE.returnType).slice(8, 12).join('\n');
const USE = L(CODE.use).slice(3).join('\n');
const INF = L(OUT['13-infer']);
const INFER_PART = [...INF.slice(0, 6), '…', ...INF.slice(14, 23), '…', ...INF.slice(27, 34), '…'].join('\n');

const BANG_EN = `<table>
<thead><tr><th>Annotate it</th><th>Let it infer</th></tr></thead>
<tbody>
<tr><td><strong>Function parameters</strong> — always. There is no value yet, so there is nothing to infer from (TS7006/TS7031 otherwise).</td><td><strong>Local variables</strong> — <code>const total = 0</code>. Writing <code>: number</code> only adds a second place to keep in sync.</td></tr>
<tr><td><strong>Return types of exported functions</strong> — they are the module’s contract; a mistake errors inside the function (TS2820 on <code>'OFF_GRIDD'</code>), not at twenty call sites.</td><td><strong>Callback parameters</strong> — <code>bookings.map((b) =&gt; b.minutes)</code>: the array gives <code>b</code> its type (contextual typing).</td></tr>
<tr><td><strong>Data built far from where it is used</strong> — <code>const day: BookingInput[] = [...]</code>, otherwise <code>role</code> widens to <code>string</code>.</td><td><strong>Return types of small private helpers</strong> — fine to infer; annotate when the inferred type surprises you (check it with a .d.ts).</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Ghi kiểu</th><th>Để nó tự suy</th></tr></thead>
<tbody>
<tr><td><strong>Tham số của hàm</strong> — luôn luôn. Chưa có giá trị nên không có gì để suy (nếu không sẽ là TS7006/TS7031).</td><td><strong>Biến cục bộ</strong> — <code>const total = 0</code>. Viết thêm <code>: number</code> chỉ tạo thêm một chỗ phải sửa cho khớp.</td></tr>
<tr><td><strong>Kiểu trả về của hàm export</strong> — đó là hợp đồng của module; sai thì lỗi nằm trong hàm (TS2820 ở <code>'OFF_GRIDD'</code>), không rải ra hai mươi chỗ gọi.</td><td><strong>Tham số của callback</strong> — <code>bookings.map((b) =&gt; b.minutes)</code>: mảng cho <code>b</code> kiểu của nó (kiểu theo ngữ cảnh).</td></tr>
<tr><td><strong>Dữ liệu dựng xa chỗ dùng</strong> — <code>const day: BookingInput[] = [...]</code>, không thì <code>role</code> bị nới thành <code>string</code>.</td><td><strong>Kiểu trả về của hàm phụ nội bộ nhỏ</strong> — để suy cũng được; thấy kiểu suy ra lạ thì ghi (kiểm bằng .d.ts).</td></tr>
</tbody>
</table>`;

const WIDEN_EN = `<table>
<thead><tr><th>You write</th><th>tsc infers (from widen.d.ts)</th><th>Why</th></tr></thead>
<tbody>
<tr><td><code>let a = 'CuongThai'</code></td><td><code>string</code></td><td><code>let</code> can be reassigned later, so the type is widened to the general one.</td></tr>
<tr><td><code>const b = 'CuongThai'</code></td><td><code>"CuongThai"</code></td><td>A <code>const</code> never changes: its type is the <strong>literal type</strong> — that one string.</td></tr>
<tr><td><code>const seats = 31</code></td><td><code>31</code></td><td>Same rule for numbers.</td></tr>
<tr><td><code>const opensAt = 7 * 60</code></td><td><code>number</code></td><td>A computed value is not a literal, even in a <code>const</code> (that is why <code>OPEN</code> above is <code>number</code> but <code>STEP</code> is <code>30</code>).</td></tr>
<tr><td><code>const mixed = [1, 'two', true]</code></td><td><code>(string | number | boolean)[]</code></td><td>The <strong>best common type</strong> of all elements.</td></tr>
<tr><td><code>const input = { role: 'STUDENT', … }</code></td><td><code>{ …; role: string; … }</code></td><td>A <code>const</code> object’s <strong>properties</strong> can still be reassigned, so each one is widened.</td></tr>
</tbody>
</table>`;
const WIDEN_VI = `<table>
<thead><tr><th>Bạn viết</th><th>tsc suy ra (theo widen.d.ts)</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td><code>let a = 'CuongThai'</code></td><td><code>string</code></td><td><code>let</code> gán lại được sau này, nên kiểu bị nới ra kiểu chung.</td></tr>
<tr><td><code>const b = 'CuongThai'</code></td><td><code>"CuongThai"</code></td><td><code>const</code> không bao giờ đổi: kiểu của nó là <strong>kiểu literal</strong> — đúng chuỗi đó.</td></tr>
<tr><td><code>const seats = 31</code></td><td><code>31</code></td><td>Số cũng theo luật ấy.</td></tr>
<tr><td><code>const opensAt = 7 * 60</code></td><td><code>number</code></td><td>Giá trị phải tính ra thì không phải literal, kể cả với <code>const</code> (vì thế <code>OPEN</code> ở trên là <code>number</code> còn <code>STEP</code> là <code>30</code>).</td></tr>
<tr><td><code>const mixed = [1, 'two', true]</code></td><td><code>(string | number | boolean)[]</code></td><td><strong>Kiểu chung tốt nhất</strong> của mọi phần tử.</td></tr>
<tr><td><code>const input = { role: 'STUDENT', … }</code></td><td><code>{ …; role: string; … }</code></td><td><strong>Thuộc tính</strong> của object const vẫn gán lại được, nên từng cái bị nới.</td></tr>
</tbody>
</table>`;

export default {
  title: '1.3 — Type inference: you write less than you think|||1.3 — Suy luận kiểu: bạn viết ít hơn bạn tưởng',
  slug: 'typescript-1-3-suy-luan-kieu',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Xem tsc suy ra kiểu gì bằng file .d.ts; let/const và nới rộng (widening), kiểu literal; vì sao kiểu trả về suy ra của checkSlot làm slot.minutes thành number | undefined (đúng lỗi làm Lab 1 mất điểm); object bị nới thuộc tính và ba cách sửa (ghi kiểu, as const, satisfies); kiểu theo ngữ cảnh trong callback; suy luận dừng ở tham số (TS7006/TS7031) và luật "ghi kiểu ở mép, suy luận ở giữa".',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>Type inference: you write less than you think</h2>
<p class="lead">After this lesson you can tell, for any line of LabFlow, whether a type annotation adds information or only repeats what the compiler already knows — and you can prove it by asking tsc to print the types it inferred. That is the skill that keeps TypeScript code short, and it explains two of the errors you will meet in Lab 1.</p>

<h3>What you will be able to do, and why it matters</h3>
<p>Good TypeScript looks almost like JavaScript: <strong>type inference (suy luận kiểu)</strong> — the compiler working out a type from the value you wrote — fills in most types for free. The annotations you do write go to a few places where they carry real information. Reviewers check exactly this in pull requests, and it is an interview question (answer at the end).</p>

<h3>Ask the compiler what it inferred — no editor needed</h3>
<p>In VS Code you hover a variable to see its type. When there is no editor — a code review, a CI log, or this lesson — ask tsc to write a <strong>declaration file (.d.ts)</strong>: a file that contains only types, no code. It is an exact list of what the compiler concluded. Two options do it:</p>
${ma('json', CODE.dtsJson)}
<p><code>declaration</code> asks for .d.ts files, <code>emitDeclarationOnly</code> says “no JavaScript, only types”, and <code>noEmit: false</code> overrides the course tsconfig (which normally never writes files). <code>rootDir</code>/<code>outDir</code> say where the files go. The demo file <code>widen.ts</code> holds exactly the eight declarations in the table below, each with <code>export</code> so that it appears in the .d.ts:</p>
${ra(OUT['13-widen'])}

<h3>let vs const: widening and literal types</h3>
${WIDEN_EN}
<p>Two ideas hide in this table. <strong>Widening (nới rộng)</strong>: when a value could change later, TypeScript picks the general type (<code>string</code>, <code>number</code>) instead of the exact value. <strong>Literal type (kiểu literal)</strong>: when it cannot change, the type is the value itself — <code>"CuongThai"</code> is a type that only one string belongs to. LabFlow’s <code>Role</code> — <code>'STUDENT' | 'LECTURER' | 'ADMIN'</code> — is just three literal types joined.</p>
<p>The last row is the one that bites. <code>const</code> protects the <em>variable</em> (you cannot point <code>input</code> at another object), not the object: <code>input.role = 'anything'</code> is legal JavaScript. So TypeScript widens every property.</p>

<h3>An inferred return type, read in full: checkSlot</h3>
<p>Now the real code. In <code>demo1/ts-01-3/infer/booking.ts</code> the LabFlow rules have only their <strong>parameters</strong> typed; every return type is left to inference. Here is <code>checkSlot</code>:</p>
${ma('typescript', CHECKSLOT)}
<p>And here is what tsc concluded (the parts that matter; the types it was given, like <code>Role</code>, come out unchanged):</p>
${ra(INFER_PART)}
<p>Read <code>checkSlot</code>’s return type slowly. TypeScript merged the five returned objects into a <strong>union</strong> of two shapes, and it made three choices you probably did not intend:</p>
<ul>
<li><code>ok</code> is <code>boolean</code> in both shapes — not <code>false</code> in one and <code>true</code> in the other (object properties widen, as in the table).</li>
<li><code>code</code> is <code>string</code>, not one of the four codes.</li>
<li>To make both shapes have the same keys, it added <code>minutes?: undefined</code> to the first and <code>code?: undefined</code> to the second.</li>
</ul>
<p>And <code>createBooking</code> returns <code>minutes: number | undefined</code> and <code>status: string</code> — the looseness spreads to everything built on top.</p>

<h3>Why slot.minutes is still number | undefined</h3>
${ma('typescript', USE)}
${ra(OUT['13-use'])}
<p>After <code>if (!slot.ok) throw …</code> you <em>know</em> the slot is fine. TypeScript also understands that kind of check — it is called <strong>narrowing (thu hẹp kiểu)</strong>, and Chapter 5 is all about it — but only if the check can tell the two shapes apart. Here both shapes say <code>ok: boolean</code>, so after the check either shape is still possible, and <code>minutes</code> may be <code>undefined</code>. The second error is the widened <code>status: string</code>.</p>
<p>These are not invented errors: they are exactly what the Lab 1 attempt that typed every parameter with <code>string</code>/<code>number</code> but left return types to inference (<code>lab1/vua</code>) loses point B for:</p>
${ra(VUA)}

<h3>The fix: say what you return</h3>
<p>The reference rules in <code>src/rules/booking.ts</code> declare the result once and make <code>checkSlot</code> promise it:</p>
${ma('typescript', REF_TYPES)}
${ra(OUT['13-use-fixed'])}
<p>Same <code>use.ts</code> lines, now against <code>src/rules</code>: zero errors. <code>ok: true</code> and <code>ok: false</code> are different literal types, so the check on <code>ok</code> narrows; <code>Booking</code> says <code>status: 'PENDING' | 'CONFIRMED'</code>. A second benefit is where errors land. Both functions below contain the same typo; only the second says what it returns:</p>
${ma('typescript', CODE.returnType)}
${ra(OUT['13-return'])}
<p><code>checkA</code> compiles: <code>code: string</code> accepts any string, and the typo travels to every caller. <code>checkB</code> is refused on line 10, column 63 — the exact place — with a suggestion. That is why an <strong>exported</strong> function’s return type is worth writing: it is the contract other files rely on.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — an object built first and passed later.</strong> This shape is everywhere in real code: you build the input from a form or a test fixture, then call the function.</p>
${ma('typescript', CODE.widenCall)}
${ra(OUT['13-widen-call'])}
<p>Read the indented lines top to bottom: the argument as a whole is not a <code>BookingInput</code> <em>because</em> its <code>role</code> property is incompatible <em>because</em> <code>string</code> is not <code>Role</code>. Writing the same object literal directly inside the call would compile — then TypeScript checks it against <code>BookingInput</code> while it is still a literal. Moving it into a variable first lets it widen.</p>
</div>

<h3>Three fixes: annotation, as const, satisfies</h3>
${ma('typescript', CODE.fixes)}
${ra(OUT['13-fixes'])}
<p>All three compile and all three bookings come out <code>PENDING</code>. They differ in the type the variable ends up with — tsc’s .d.ts shows it:</p>
${ra(OUT['13-fixes-dts'])}
<ul>
<li><strong>Annotation</strong> <code>: BookingInput</code> — the variable <em>is</em> a <code>BookingInput</code>, nothing more. Simplest; use it by default.</li>
<li><strong><code>as const</code></strong> — every property becomes <code>readonly</code> and keeps its literal type (<code>seats: 31</code>). Right for a fixed constant you never change.</li>
<li><strong><code>satisfies BookingInput</code></strong> (TypeScript 4.9+) — tsc checks the object against <code>BookingInput</code> (misspell a key and it errors) but the variable keeps its own type: <code>role</code> stays <code>"STUDENT"</code>, the rest are widened as usual.</li>
</ul>

<h3>Contextual typing: callbacks need no annotations</h3>
${ma('typescript', CODE.context)}
${ra(OUT['13-context'])}
<p>The array is a <code>Booking[]</code>, so <code>b</code> is a <code>Booking</code> and <code>m</code> a <code>number</code>. This is <strong>contextual typing (kiểu theo ngữ cảnh)</strong>: the type flows from the place a function is used into its parameters. Take the same arrow function out on its own and the context is gone:</p>
${ma('typescript', CODE.noContext)}
${ra(OUT['13-no-context'])}

<h3>Where inference stops: parameters</h3>
<p>A parameter has no value where it is declared — the value arrives later, from whoever calls the function. There is nothing to infer from, and in strict mode (the default in TypeScript 7) tsc refuses to silently use <code>any</code>. The Lab 1 starter is the LabFlow JavaScript renamed to <code>.ts</code>:</p>
${ra(OUT['13-starter'])}
${ra(OUT['13-starter-count'])}
<p>Thirteen red lines: <strong>TS7006</strong> for a plain parameter (<code>start</code>), <strong>TS7031</strong> for a destructured one (<code>{ seats, role }</code>). Each is a decision only you can make — is <code>role</code> any string, or one of three? — and making those thirteen decisions well is most of Lab 1.</p>

<h3>When to annotate, when to let it infer</h3>
${BANG_EN}
<p><strong>In an interview — “Do you annotate everything?”</strong> A strong answer: “No. I annotate the edges of a module — parameters and exported return types — and any data built away from where it is used, because inference would widen it. Inside functions I let inference work, and when I am unsure I check the inferred type by hovering or with a .d.ts.”</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p><code>demo1/ts-01-3/practice/start.ts</code> compiles, but it is over-annotated:</p>
${ma('typescript', CODE.thStart)}
${ra(OUT['13-th-start'])}
<ol>
<li>Remove every annotation that only repeats what inference already knows.</li>
<li>Keep the ones that carry information. tsc must stay at 0 errors — and the <code>@ts-expect-error</code> line at the bottom must still be an error (if your edits make that call legal, tsc reports the directive as unused).</li>
<li>Run the file: the output must not change.</li>
</ol>
<p><strong>Solution and real output:</strong></p>
${ma('typescript', CODE.thSolution)}
${ra(OUT['13-th-solution'])}
<p>Three annotations stay. The parameter and return type of the exported <code>totalMinutes</code> are its contract. <code>day: BookingInput[]</code> looks removable — but it is data built away from where it is used. Remove it as well and:</p>
${ra(OUT['13-th-too-far'])}
<p><strong>Done when:</strong> tsc prints nothing with exit 0, the run still prints <code>Monday 270 [ 120, 150 ] 0.321 1</code>, and you can say for each of the three kept annotations why it stays.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">type inference</span><span class="v">The compiler works out a type from the value or the context, without an annotation.</span></div>
  <div class="kv"><span class="k">widening</span><span class="v">Inferring the general type (<code>string</code>) instead of the exact value, because the value could change.</span></div>
  <div class="kv"><span class="k">literal type</span><span class="v">A type with one value: <code>"CuongThai"</code>, <code>31</code>, <code>'STUDENT'</code>.</span></div>
  <div class="kv"><span class="k">contextual typing</span><span class="v">A callback parameter takes its type from where the callback is used.</span></div>
  <div class="kv"><span class="k">declaration file (.d.ts)</span><span class="v">A file with only types; <code>declaration</code> + <code>emitDeclarationOnly</code> make tsc write one.</span></div>
  <div class="kv"><span class="k">as const · satisfies</span><span class="v">Keep a value readonly and literal · check it against a type but keep its own type.</span></div>
</div>

<h3>🗺 Where types come from</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Edges: you decide</div><div class="lz-d">parameters, exported return types, data built far away</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Middle: tsc infers</div><div class="lz-d">locals, callbacks, computed values</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">You check</div><div class="lz-d">hover, or a .d.ts — is it as narrow as you meant?</div></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>TypeScript infers most types; <code>declaration</code> + <code>emitDeclarationOnly</code> print what it inferred, without an editor.</li>
<li><code>let</code> widens to the general type, <code>const</code> keeps the literal type — but a const object’s properties are widened.</li>
<li>An inferred return type can be much looser than you meant: <code>checkSlot</code> got <code>ok: boolean</code>, so <code>slot.minutes</code> stayed <code>number | undefined</code>.</li>
<li>Declaring the return type (<code>: SlotResult</code>) fixes the narrowing and catches typos where they are written.</li>
<li>Rule: annotate the edges, let inference fill the middle.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Type Inference', 'Best common type and contextual typing, from the official docs (read 1 Nov 2026).', 'https://www.typescriptlang.org/docs/handbook/type-inference.html')}
${nguon('📘', 'TypeScript Handbook — Everyday Types', 'Literal types, literal inference and as const (read 1 Nov 2026).', 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html')}
${nguon('🆕', 'TypeScript 4.9 release notes — the satisfies operator', 'Why satisfies exists and how it differs from an annotation (read 1 Nov 2026).', 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-1-1-bien-pham-vi', title: 'Also in the Node.js course — 1.1: Variables &amp; scope', sub: 'Same: let vs const, and “const does not mean immutable” — a const object’s properties can still change. Different: here that runtime fact decides a TYPE — const gives a literal type, and the changeable properties are exactly why TypeScript widens them.', cta: 'OPEN NODE.JS LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>Suy luận kiểu: bạn viết ít hơn bạn tưởng</h2>
<p class="lead">Học xong bài này, với bất kỳ dòng nào của LabFlow, bạn nói được một chú thích kiểu có thêm thông tin hay chỉ lặp lại điều trình biên dịch đã biết — và chứng minh được bằng cách bảo tsc in ra kiểu nó suy ra. Đó là kỹ năng giữ cho code TypeScript ngắn gọn, và nó giải thích hai lỗi bạn sẽ gặp ở Lab 1.</p>

<h3>Bạn sẽ làm được gì, và vì sao quan trọng</h3>
<p>TypeScript tốt trông gần như JavaScript: <strong>type inference (suy luận kiểu)</strong> — trình biên dịch tự tìm ra kiểu từ giá trị bạn viết — lo hầu hết kiểu miễn phí. Chú thích bạn thật sự viết chỉ nằm ở vài chỗ mang thông tin thật. Người review kiểm đúng điều này trong pull request, và nó là câu phỏng vấn có thật (câu trả lời ở cuối bài).</p>

<h3>Hỏi trình biên dịch nó suy ra gì — không cần editor</h3>
<p>Trong VS Code bạn rê chuột lên biến để xem kiểu. Khi không có editor — lúc review code, đọc log CI, hay học bài này — hãy bảo tsc ghi ra <strong>file khai báo (.d.ts)</strong>: file chỉ chứa kiểu, không có code. Nó là danh sách chính xác những gì trình biên dịch kết luận. Hai tuỳ chọn làm việc này:</p>
${ma('json', CODE.dtsJson)}
<p><code>declaration</code> xin file .d.ts, <code>emitDeclarationOnly</code> nói "không cần JavaScript, chỉ kiểu", và <code>noEmit: false</code> ghi đè tsconfig của khoá (bình thường không bao giờ ghi file). <code>rootDir</code>/<code>outDir</code> nói file ra nằm đâu. File demo <code>widen.ts</code> chứa đúng tám khai báo trong bảng dưới, cái nào cũng có <code>export</code> để hiện ra trong .d.ts:</p>
${ra(OUT['13-widen'])}

<h3>let và const: nới rộng và kiểu literal</h3>
${WIDEN_VI}
<p>Bảng này giấu hai ý. <strong>Widening (nới rộng)</strong>: khi giá trị có thể đổi về sau, TypeScript chọn kiểu chung (<code>string</code>, <code>number</code>) thay vì đúng giá trị đó. <strong>Literal type (kiểu literal)</strong>: khi không thể đổi, kiểu chính là giá trị — <code>"CuongThai"</code> là một kiểu chỉ có đúng một chuỗi thuộc về. <code>Role</code> của LabFlow — <code>'STUDENT' | 'LECTURER' | 'ADMIN'</code> — chẳng qua là ba kiểu literal ghép lại.</p>
<p>Dòng cuối là dòng hay cắn người. <code>const</code> bảo vệ <em>biến</em> (không trỏ <code>input</code> sang object khác được), không bảo vệ object: <code>input.role = 'anything'</code> vẫn là JavaScript hợp lệ. Nên TypeScript nới rộng mọi thuộc tính.</p>

<h3>Đọc trọn một kiểu trả về được suy ra: checkSlot</h3>
<p>Giờ tới code thật. Trong <code>demo1/ts-01-3/infer/booking.ts</code>, các luật LabFlow chỉ được ghi kiểu cho <strong>tham số</strong>; mọi kiểu trả về để tsc tự suy. Đây là <code>checkSlot</code>:</p>
${ma('typescript', CHECKSLOT)}
<p>Và đây là điều tsc kết luận (những phần đáng xem; các kiểu được cho sẵn như <code>Role</code> ra y nguyên):</p>
${ra(INFER_PART)}
<p>Đọc chậm kiểu trả về của <code>checkSlot</code>. TypeScript gộp năm object được trả về thành một <strong>union (hợp)</strong> của hai dáng, và chọn ba điều có lẽ bạn không định:</p>
<ul>
<li><code>ok</code> là <code>boolean</code> ở cả hai dáng — không phải <code>false</code> ở dáng này và <code>true</code> ở dáng kia (thuộc tính object bị nới, như trong bảng).</li>
<li><code>code</code> là <code>string</code>, không phải một trong bốn mã.</li>
<li>Để hai dáng có cùng khoá, nó thêm <code>minutes?: undefined</code> vào dáng đầu và <code>code?: undefined</code> vào dáng sau.</li>
</ul>
<p>Và <code>createBooking</code> trả về <code>minutes: number | undefined</code> với <code>status: string</code> — sự lỏng lẻo lan sang mọi thứ dựng phía trên.</p>

<h3>Vì sao slot.minutes vẫn là number | undefined</h3>
${ma('typescript', USE)}
${ra(OUT['13-use'])}
<p>Sau <code>if (!slot.ok) throw …</code> bạn <em>biết</em> khung giờ hợp lệ. TypeScript cũng hiểu kiểu kiểm tra đó — gọi là <strong>narrowing (thu hẹp kiểu)</strong>, cả Chương 5 nói về nó — nhưng chỉ khi phép kiểm phân biệt được hai dáng. Ở đây cả hai dáng đều nói <code>ok: boolean</code>, nên sau phép kiểm dáng nào cũng còn khả năng, và <code>minutes</code> có thể là <code>undefined</code>. Lỗi thứ hai là <code>status: string</code> bị nới.</p>
<p>Đây không phải lỗi bịa ra: đúng là lý do lần thử Lab 1 ghi kiểu mọi tham số bằng <code>string</code>/<code>number</code> nhưng để kiểu trả về tự suy (<code>lab1/vua</code>) bị mất điểm B:</p>
${ra(VUA)}

<h3>Cách sửa: nói rõ hàm trả về gì</h3>
<p>Bộ luật tham khảo trong <code>src/rules/booking.ts</code> khai báo kết quả một lần và bắt <code>checkSlot</code> hứa trả về đúng nó:</p>
${ma('typescript', REF_TYPES)}
${ra(OUT['13-use-fixed'])}
<p>Vẫn các dòng của <code>use.ts</code>, giờ dùng <code>src/rules</code>: không lỗi nào. <code>ok: true</code> và <code>ok: false</code> là hai kiểu literal khác nhau, nên kiểm <code>ok</code> thu hẹp được; <code>Booking</code> nói <code>status: 'PENDING' | 'CONFIRMED'</code>. Lợi ích thứ hai là lỗi rơi vào đâu. Hai hàm dưới có cùng một lỗi gõ nhầm; chỉ hàm thứ hai nói rõ nó trả về gì:</p>
${ma('typescript', CODE.returnType)}
${ra(OUT['13-return'])}
<p><code>checkA</code> biên dịch được: <code>code: string</code> nhận mọi chuỗi, và lỗi gõ nhầm đi theo tới mọi chỗ gọi. <code>checkB</code> bị từ chối ở dòng 10, cột 63 — đúng chỗ — kèm gợi ý. Vì thế kiểu trả về của hàm <strong>export</strong> đáng viết: đó là hợp đồng mà các file khác dựa vào.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — dựng object trước, truyền đi sau.</strong> Dáng code này có ở khắp nơi: bạn dựng dữ liệu vào từ form hay từ dữ liệu test, rồi mới gọi hàm.</p>
${ma('typescript', CODE.widenCall)}
${ra(OUT['13-widen-call'])}
<p>Đọc các dòng thụt lề từ trên xuống: cả đối số không phải <code>BookingInput</code> <em>vì</em> thuộc tính <code>role</code> không khớp <em>vì</em> <code>string</code> không phải <code>Role</code>. Viết đúng object literal đó thẳng bên trong lời gọi thì lại biên dịch được — lúc ấy TypeScript kiểm nó theo <code>BookingInput</code> khi nó vẫn còn là literal. Đưa nó vào một biến trước là cho nó cơ hội bị nới.</p>
</div>

<h3>Ba cách sửa: ghi kiểu, as const, satisfies</h3>
${ma('typescript', CODE.fixes)}
${ra(OUT['13-fixes'])}
<p>Cả ba đều biên dịch được và cả ba lượt đặt đều ra <code>PENDING</code>. Chúng khác nhau ở kiểu mà biến nhận được — file .d.ts của tsc cho thấy:</p>
${ra(OUT['13-fixes-dts'])}
<ul>
<li><strong>Ghi kiểu</strong> <code>: BookingInput</code> — biến <em>là</em> một <code>BookingInput</code>, không hơn. Đơn giản nhất; mặc định dùng cách này.</li>
<li><strong><code>as const</code></strong> — mọi thuộc tính thành <code>readonly</code> và giữ kiểu literal (<code>seats: 31</code>). Hợp với hằng cố định không bao giờ sửa.</li>
<li><strong><code>satisfies BookingInput</code></strong> (TypeScript 4.9+) — tsc kiểm object theo <code>BookingInput</code> (gõ sai tên khoá là báo lỗi) nhưng biến giữ kiểu riêng: <code>role</code> vẫn là <code>"STUDENT"</code>, phần còn lại bị nới như thường.</li>
</ul>

<h3>Kiểu theo ngữ cảnh: callback không cần ghi kiểu</h3>
${ma('typescript', CODE.context)}
${ra(OUT['13-context'])}
<p>Mảng là <code>Booking[]</code>, nên <code>b</code> là <code>Booking</code> và <code>m</code> là <code>number</code>. Đó là <strong>contextual typing (kiểu theo ngữ cảnh)</strong>: kiểu chảy từ chỗ hàm được dùng vào tham số của nó. Đưa đúng hàm mũi tên đó ra đứng riêng thì mất ngữ cảnh:</p>
${ma('typescript', CODE.noContext)}
${ra(OUT['13-no-context'])}

<h3>Suy luận dừng ở đâu: tham số</h3>
<p>Tham số chưa có giá trị ở chỗ khai báo — giá trị đến sau, từ người gọi hàm. Không có gì để suy, và ở chế độ strict (mặc định trong TypeScript 7) tsc từ chối lặng lẽ dùng <code>any</code>. Mã khởi đầu của Lab 1 là JavaScript của LabFlow đổi đuôi thành <code>.ts</code>:</p>
${ra(OUT['13-starter'])}
${ra(OUT['13-starter-count'])}
<p>Mười ba dòng đỏ: <strong>TS7006</strong> cho tham số thường (<code>start</code>), <strong>TS7031</strong> cho tham số phân rã (<code>{ seats, role }</code>). Mỗi dòng là một quyết định chỉ bạn đưa ra được — <code>role</code> là chuỗi bất kỳ, hay một trong ba giá trị? — và đưa ra mười ba quyết định đó cho đúng là phần lớn của Lab 1.</p>

<h3>Khi nào ghi kiểu, khi nào để nó tự suy</h3>
${BANG_VI}
<p><strong>Khi phỏng vấn — "Bạn có ghi kiểu cho mọi thứ không?"</strong> Câu trả lời tốt: "Không. Tôi ghi kiểu ở mép module — tham số và kiểu trả về của hàm export — và cho dữ liệu dựng xa chỗ dùng, vì suy luận sẽ nới rộng nó. Bên trong hàm tôi để suy luận làm việc, khi không chắc thì kiểm kiểu suy ra bằng hover hoặc file .d.ts."</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<p><code>demo1/ts-01-3/practice/start.ts</code> biên dịch được, nhưng ghi kiểu thừa:</p>
${ma('typescript', CODE.thStart)}
${ra(OUT['13-th-start'])}
<ol>
<li>Xoá mọi chú thích chỉ lặp lại điều suy luận đã biết.</li>
<li>Giữ những chú thích mang thông tin. tsc phải vẫn 0 lỗi — và dòng <code>@ts-expect-error</code> ở cuối phải vẫn là lỗi (nếu sửa xong mà lời gọi đó thành hợp lệ, tsc báo chỉ thị không được dùng).</li>
<li>Chạy file: output không được đổi.</li>
</ol>
<p><strong>Lời giải và output thật:</strong></p>
${ma('typescript', CODE.thSolution)}
${ra(OUT['13-th-solution'])}
<p>Giữ lại ba chú thích. Tham số và kiểu trả về của hàm export <code>totalMinutes</code> là hợp đồng của nó. <code>day: BookingInput[]</code> trông như xoá được — nhưng đó là dữ liệu dựng xa chỗ dùng. Xoá nốt nó thì:</p>
${ra(OUT['13-th-too-far'])}
<p><strong>Đạt khi:</strong> tsc không in gì với exit 0, chạy vẫn in <code>Monday 270 [ 120, 150 ] 0.321 1</code>, và với mỗi chú thích còn giữ bạn nói được vì sao nó ở lại.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">type inference (suy luận kiểu)</span><span class="v">Trình biên dịch tự tìm ra kiểu từ giá trị hoặc ngữ cảnh, không cần chú thích.</span></div>
  <div class="kv"><span class="k">widening (nới rộng)</span><span class="v">Suy ra kiểu chung (<code>string</code>) thay vì đúng giá trị, vì giá trị có thể đổi.</span></div>
  <div class="kv"><span class="k">literal type (kiểu literal)</span><span class="v">Kiểu chỉ có một giá trị: <code>"CuongThai"</code>, <code>31</code>, <code>'STUDENT'</code>.</span></div>
  <div class="kv"><span class="k">contextual typing (kiểu theo ngữ cảnh)</span><span class="v">Tham số của callback nhận kiểu từ chỗ callback được dùng.</span></div>
  <div class="kv"><span class="k">declaration file (file khai báo .d.ts)</span><span class="v">File chỉ chứa kiểu; <code>declaration</code> + <code>emitDeclarationOnly</code> bảo tsc ghi ra.</span></div>
  <div class="kv"><span class="k">as const · satisfies</span><span class="v">Giữ giá trị readonly và literal · kiểm theo một kiểu nhưng giữ kiểu riêng.</span></div>
</div>

<h3>🗺 Kiểu đến từ đâu</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Mép: bạn quyết</div><div class="lz-d">tham số, kiểu trả về của hàm export, dữ liệu dựng ở xa</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Giữa: tsc suy</div><div class="lz-d">biến cục bộ, callback, giá trị tính ra</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Bạn kiểm</div><div class="lz-d">hover, hoặc .d.ts — có hẹp như bạn định không?</div></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>TypeScript tự suy hầu hết kiểu; <code>declaration</code> + <code>emitDeclarationOnly</code> in ra những gì nó suy, không cần editor.</li>
<li><code>let</code> nới ra kiểu chung, <code>const</code> giữ kiểu literal — nhưng thuộc tính của object const vẫn bị nới.</li>
<li>Kiểu trả về tự suy có thể lỏng hơn bạn định nhiều: <code>checkSlot</code> nhận <code>ok: boolean</code>, nên <code>slot.minutes</code> vẫn là <code>number | undefined</code>.</li>
<li>Khai báo kiểu trả về (<code>: SlotResult</code>) sửa được chuyện thu hẹp và bắt lỗi gõ nhầm ngay chỗ viết.</li>
<li>Luật: ghi kiểu ở mép, để suy luận lấp phần giữa.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Type Inference', 'Kiểu chung tốt nhất và kiểu theo ngữ cảnh, tài liệu chính thức (đọc ngày 1/11/2026).', 'https://www.typescriptlang.org/docs/handbook/type-inference.html')}
${nguon('📘', 'TypeScript Handbook — Everyday Types', 'Kiểu literal, suy luận literal và as const (đọc ngày 1/11/2026).', 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html')}
${nguon('🆕', 'Ghi chú phát hành TypeScript 4.9 — toán tử satisfies', 'Vì sao có satisfies và nó khác chú thích kiểu thế nào (đọc ngày 1/11/2026).', 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-1-1-bien-pham-vi', title: 'Đã gặp ở khoá Node.js — 1.1: Biến &amp; phạm vi', sub: 'Giống: let với const, và "const KHÔNG có nghĩa là bất biến" — thuộc tính của object const vẫn đổi được. Khác: ở đây sự thật lúc chạy đó quyết định một KIỂU — const cho kiểu literal, và chính vì thuộc tính đổi được nên TypeScript nới rộng chúng.', cta: 'MỞ BÀI NODE.JS →' })}
</div>
`,
};
