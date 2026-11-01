/**
 * TypeScript · Mục 0 · 0.4 — Mô hình tư duy cốt lõi: lúc biên dịch vs lúc chạy. Slug giữ nguyên: typescript-0-4-mo-hinh.
 * Soạn lại 01/11/2026 (đợt mẫu). Code/output: ./_ma-ts-00-4.mjs (labflow-ts/demo0/ts-00-4, Node 22.23.3, tsc 7.0.2).
 */
import G from '../giang/ts-00-4.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-00-4.mjs';

// Chỉ BỎ dòng (khung stack nội bộ của Node, dòng gợi ý --trace-warnings), không sửa chữ.
const bot = (t) => t.split('\n').filter((l) => !/node:internal|^\s+at async|^\s+at ModuleJob|^\(Use |triggerUncaughtException|^\s+\^$|^\s+at (parseTypeScript|processTypeScriptCode|stripTypeScriptModuleTypes|ModuleLoader|#|afterLoad)/.test(l)).join('\n');
const THROW = bot(OUT['03-throw']);
const STRIP = bot(OUT['04-strip']);
const INST = bot(OUT['08-typeval-node']);
const LIE = bot(OUT['11-json-lie']);
const ENUM = bot(OUT['14-enum-node']);
const PRED = bot(OUT['17-practice-node']);

const BANG_EN = `<table>
<thead><tr><th>Tool</th><th>Checks types?</th><th>Runs your code?</th><th>What it really does</th></tr></thead>
<tbody>
<tr><td><code>tsc</code> 7.0.2</td><td>✅ yes</td><td>❌ no</td><td>Reads every file, reports TSxxxx errors; may also write <code>.js</code> files (we use <code>noEmit</code>). The only gate you can put in CI.</td></tr>
<tr><td><code>node</code> 22.23.3</td><td>❌ no</td><td>✅ yes</td><td>Replaces types with spaces, then runs. A file full of type errors runs happily.</td></tr>
<tr><td>VS Code 1.124.2</td><td>✅ as you type</td><td>❌ no</td><td>Red squiggles from its own bundled TypeScript 6.0.3 — not necessarily the project's 7.0.2.</td></tr>
<tr><td>Vitest · tsx · esbuild</td><td>❌ no</td><td>✅ yes / builds</td><td>Strip types for speed. A green test run says nothing about types.</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Công cụ</th><th>Kiểm kiểu?</th><th>Chạy code?</th><th>Thật ra nó làm gì</th></tr></thead>
<tbody>
<tr><td><code>tsc</code> 7.0.2</td><td>✅ có</td><td>❌ không</td><td>Đọc mọi tệp, báo lỗi TSxxxx; có thể ghi thêm tệp <code>.js</code> (khoá này dùng <code>noEmit</code>). Là cổng duy nhất đặt được vào CI.</td></tr>
<tr><td><code>node</code> 22.23.3</td><td>❌ không</td><td>✅ có</td><td>Thay kiểu bằng khoảng trắng rồi chạy. Tệp đầy lỗi kiểu vẫn chạy vô tư.</td></tr>
<tr><td>VS Code 1.124.2</td><td>✅ ngay khi gõ</td><td>❌ không</td><td>Gạch đỏ do bản TypeScript 6.0.3 đi kèm editor — chưa chắc trùng bản 7.0.2 của dự án.</td></tr>
<tr><td>Vitest · tsx · esbuild</td><td>❌ không</td><td>✅ có / build</td><td>Bỏ kiểu cho nhanh. Test xanh không nói gì về kiểu.</td></tr>
</tbody>
</table>`;

const PRED_EN = `<table>
<thead><tr><th>Line</th><th>tsc</th><th>node</th><th>Why</th></tr></thead>
<tbody>
<tr><td>3 <code>role: Role = 'student'</code></td><td>❌ TS2820</td><td>✅ prints <code>student</code></td><td>A wrong <em>value</em> for the type; at runtime it is just a string.</td></tr>
<tr><td>4 <code>Number('31')</code></td><td>✅</td><td>✅</td><td><code>Number(…)</code> returns a number in both worlds.</td></tr>
<tr><td>5 <code>JSON.parse(…).m</code></td><td>✅</td><td>✅ but wrong</td><td><code>JSON.parse</code> returns <code>any</code>; <code>minutes</code> is really the string <code>"90"</code>. <code>"90" / 2</code> happens to be 45 — luck, not safety.</td></tr>
<tr><td>8 <code>lab.name.toUpperCase()</code></td><td>✅</td><td>❌ TypeError</td><td><code>as unknown as …</code> forced the type; the object has no <code>name</code>.</td></tr>
</tbody>
</table>`;
const PRED_VI = `<table>
<thead><tr><th>Dòng</th><th>tsc</th><th>node</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>3 <code>role: Role = 'student'</code></td><td>❌ TS2820</td><td>✅ in ra <code>student</code></td><td><em>Giá trị</em> sai so với kiểu; lúc chạy nó chỉ là một chuỗi.</td></tr>
<tr><td>4 <code>Number('31')</code></td><td>✅</td><td>✅</td><td><code>Number(…)</code> trả về số ở cả hai thế giới.</td></tr>
<tr><td>5 <code>JSON.parse(…).m</code></td><td>✅</td><td>✅ nhưng sai</td><td><code>JSON.parse</code> trả về <code>any</code>; <code>minutes</code> thật ra là chuỗi <code>"90"</code>. <code>"90" / 2</code> tình cờ ra 45 — may mắn, không phải an toàn.</td></tr>
<tr><td>8 <code>lab.name.toUpperCase()</code></td><td>✅</td><td>❌ TypeError</td><td><code>as unknown as …</code> ép kiểu; object không hề có <code>name</code>.</td></tr>
</tbody>
</table>`;

export default {
  title: '0.4 — The one mental model: compile time vs runtime|||0.4 — Mô hình tư duy cốt lõi: lúc biên dịch vs lúc chạy',
  slug: 'typescript-0-4-mo-hinh',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Hai thế giới không bao giờ gặp nhau: tsc kiểm lúc biên dịch, Node chạy lúc runtime. Xem tận mắt type erasure (JS do tsc xuất, phần Node 22 bỏ kiểu thành khoảng trắng), bốn hệ quả chạy thật (lỗi kiểu vẫn chạy, kiểu không phải giá trị, JSON.parse + as nói dối, enum không xoá được — erasableSyntaxOnly), công cụ nào kiểm/công cụ nào chạy và cổng tsc --noEmit trong CI.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>The one mental model: compile time vs runtime</h2>
<p class="lead">After this lesson you can look at any TypeScript surprise — “tsc is green but it crashed”, “it runs, so it must be fine”, “why can’t I check the type with an <code>if</code>?” — and say in one sentence which world it belongs to and what to do. Every claim below is shown with real output from tsc 7.0.2 and Node 22.23.3 on LabFlow TS.</p>

<h3>Why this one idea matters</h3>
<p>TypeScript lives at <strong>compile time</strong> (lúc biên dịch — when a tool reads your code). Your data lives at <strong>runtime</strong> (lúc chạy — when Node executes it). The two never meet: by the time a request body arrives, every type has already been deleted. Once that picture is solid, most of TypeScript stops being mysterious. It is also a favourite interview question — “Does TypeScript check types at runtime?” — and the honest answer is the whole of this lesson.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Compile time</span><span class="v">tsc (or your editor) reads the files. Types exist. Errors are found here. Nothing runs, so no real data exists yet.</span></div>
  <div class="kv"><span class="k">Runtime</span><span class="v">Node runs JavaScript. Types are already gone. Real data — HTTP bodies, JSON files, user input — exists only here.</span></div>
</div>
<p>An everyday picture: a building inspector checks the <em>drawings</em> before construction and signs them. Once people live in the house, the inspector is gone. Checking the drawings and living in the house are two different moments.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">You write .ts</div><div class="lz-d">code + types (<code>: string</code>, <code>interface</code>)</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">tsc checks</div><div class="lz-d">compile time: types exist, errors reported, nothing runs</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Types erased</div><div class="lz-d">plain JavaScript is what remains</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">node runs</div><div class="lz-d">runtime: real data, no types, no checking</div></div>
</div>

<h3>Erasure, for real: what tsc emits</h3>
<p>LabFlow TS normally uses <code>noEmit</code> — tsc only checks, Node runs the <code>.ts</code> files (lesson 0.3). To <em>see</em> erasure, this demo folder lets tsc write JavaScript. The config overrides two options from the course tsconfig: <code>noEmit: false</code>, and <code>allowImportingTsExtensions: false</code> (that option is only allowed when tsc writes no JavaScript).</p>
${ma('jsonc', CODE.eraseConfig)}
${ma('typescript', CODE.label)}
${ra(OUT['01-emit'])}
<p>Compare the two files line by line. <code>type Role</code> is gone. <code>interface Booking</code> is gone. <code>(b: Booking): string</code> became <code>(b)</code>. <code>const who: string</code> became <code>const who</code>. Nothing was turned into a check — there is no <code>if (typeof b.seats !== 'number')</code> hidden anywhere. The JavaScript that ships has never heard of a Booking. Running the original <code>.ts</code> directly gives the same behaviour:</p>
${ra(OUT['02-run-ts'])}

<h3>What Node 22 actually runs: types become spaces</h3>
<p>Node 22.18 and later run <code>.ts</code> files with <strong>type stripping</strong> (bỏ kiểu): it does not compile, it blanks out the type syntax and runs the rest. Node exposes the same function as <code>stripTypeScriptTypes</code> in <code>node:module</code>, so we can print exactly what it executes for a small file:</p>
${ma('typescript', CODE.throwTs)}
${ma('javascript', CODE.show)}
${ra(STRIP)}
<p>Lines 2–8 (the type and the interface) are now empty or full of spaces, and <code>(b: Booking): number</code> on line 10 became <code>(b</code>, nine spaces, <code>)</code>, nine more spaces — same width, types replaced by whitespace. Nothing moved. That is a deliberate design: because every character keeps its position, error messages point at the file you wrote, without a source map. Run the file and look at the stack trace:</p>
${ra(THROW)}
<p><code>throw.ts:11:26</code> is line 11, column 26 of the <em>source</em> — exactly where <code>new RangeError</code> starts. (The ExperimentalWarning above comes from calling <code>stripTypeScriptTypes</code> by hand; plain <code>node file.ts</code> prints no warning on 22.23.3.)</p>

<h3>Consequence 1 — a type error does not stop Node</h3>
${ma('typescript', CODE.wrong)}
${ra(OUT['05-runs-tsc'])}
${ra(OUT['06-runs-node'])}
<div class="pitfall co-tieu-de">
<p><strong>Trap — “it ran, so the types are fine”.</strong> tsc rejects line 2 with TS2322 and exits 1. Node never asks tsc anything: it strips <code>: number</code>, stores the string <code>'31'</code>, and <code>'31' + 1</code> becomes the string <code>'311'</code> — exit 0, no warning. In a booking system that is a lab with 311 seats. Checking and running are two separate steps; if nobody runs the checking step, the type error ships. That is why LabFlow TS always runs <code>npm run typecheck</code> next to <code>npm test</code>.</p>
</div>

<h3>Consequence 2 — a type is not a value</h3>
<p>A beginner who learns that TypeScript “knows” the Booking type naturally tries to ask it at runtime:</p>
${ma('typescript', CODE.inst)}
${ra(OUT['07-typeval-tsc'])}
${ra(INST)}
<p>Two worlds, two refusals. tsc says <strong>TS2693</strong> — <em>“'Booking' only refers to a type, but is being used as a value here”</em> — and, because the check could not narrow anything, <strong>TS18046</strong> on <code>x.lab</code> (<code>x</code> is still <code>unknown</code>). Node, which never saw a type, says <code>ReferenceError: Booking is not defined</code>: after stripping, the name simply does not exist. <code>instanceof</code> works with <em>classes</em>, because a class is real JavaScript that survives erasure; a <code>type</code> or <code>interface</code> is not.</p>
<p>The fix is to check <strong>values</strong> — things that exist at runtime — and tell the compiler what a <code>true</code> result means with a type predicate (<code>x is Booking</code>, full lesson in Chapter 5):</p>
${ma('typescript', CODE.fixed)}
${ra(OUT['09-typeval-fixed'])}

<h3>Consequence 3 — <code>JSON.parse</code> and <code>as</code> can lie</h3>
<p>Data from outside (an HTTP body, a file, <code>process.env</code>) is born at runtime, so the compiler never sees it. <code>JSON.parse</code> is typed to return <code>any</code>, and <code>as BookingInput</code> means “trust me”:</p>
${ma('typescript', CODE.lie)}
${ra(OUT['10-json-tsc'])}
${ra(LIE)}
<p>tsc prints nothing and exits 0 — it believed you. At runtime <code>seats</code> is the <em>string</em> <code>"31"</code> and <code>role</code> is <code>"student"</code>, and the crash happens inside <code>needsApproval</code> in <code>src/rules/booking.ts</code>, two files away from the line that lied. Without <code>as</code> it is no better, because <code>any</code> switches checking off completely:</p>
${ma('typescript', CODE.anyTs)}
${ra(OUT['12-json-any'])}
<p>A typo (<code>seatz</code>), a <code>number</code> annotation, and the result is <code>NaN</code> with exit 0. Rule of the course: <strong>types check your code; runtime checks check your data.</strong> Every boundary needs a real check — a hand-written guard like <code>isBooking</code> today, a Zod schema in Chapter 13.</p>

<h3>Consequence 4 — syntax that cannot be erased</h3>
<p>Almost all TypeScript is pure type information. A few older features <em>generate code</em>: <code>enum</code> becomes an object, and a constructor parameter property (<code>constructor(private rows: string[])</code>) becomes an assignment <code>this.rows = rows</code>. Stripping them would change the program, so Node refuses:</p>
${ma('typescript', CODE.status)}
${ra(ENUM)}
<p>The course tsconfig turns on <code>erasableSyntaxOnly</code>, so tsc warns you before Node does — <strong>TS1294</strong> on both the enum and the parameter property:</p>
${ra(OUT['13-enum-tsc'])}
<p>The erasable way says the same thing with types only, and runs:</p>
${ma('typescript', CODE.union)}
${ra(OUT['15-union-node'])}
<p>That is why LabFlow TS writes <code>type Role = 'STUDENT' | 'LECTURER' | 'ADMIN'</code> instead of an enum (Chapter 5 shows unions do everything enums did).</p>

<h3>Which tool checks, which tool runs</h3>
${BANG_EN}
<p>Only two rows check types — tsc and the editor — and the editor may be a different TypeScript version. Everything that <em>runs</em> code strips types and keeps going. So the gate is explicit: <code>npx tsc --noEmit</code> (LabFlow TS: <code>npm run typecheck</code>) as a separate step before tests and before deploy. This website learned it the hard way on 08/08/2026 (lesson 0.9 tells the story).</p>

<h3>When surprised, ask one question</h3>
<p>“Is this a compile-time thing or a runtime thing?” Three classic complaints:</p>
<ul>
<li><strong>“tsc is green but it crashed.”</strong> Runtime. The data did not match a promise you made (<code>as</code>, <code>JSON.parse</code>, a request body). Add a runtime check at that boundary.</li>
<li><strong>“Node ran it, so it is fine.”</strong> Compile time was skipped. Node never checks types. Run <code>npx tsc</code>.</li>
<li><strong>“I want to check the type with an if.”</strong> Types do not exist at runtime. Check values (<code>typeof</code>, <code>Array.isArray</code>, a property), or use a schema (Chapter 13).</li>
</ul>

<h3>Interview corner</h3>
<p><strong>Q: Does TypeScript check types at runtime?</strong> Weak answer: “Yes, that is what types are for.” Strong answer: “No. Types are erased before the code runs — tsc checks the code, Node runs plain JavaScript. So I treat every boundary (request bodies, JSON, env vars) as <code>unknown</code> and validate it at runtime, for example with Zod, and I run <code>tsc --noEmit</code> in CI because the runtime will not.”</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p>Create <code>demo0/ts-00-4/practice/predict.ts</code> with a <code>tsconfig.json</code> next to it (<code>{ "extends": "../../../tsconfig.json", "include": ["."] }</code>):</p>
${ma('typescript', CODE.predict)}
<ol>
<li>Before running anything, write down for lines 3, 4, 5 and 8: tsc error, Node error, both, or neither.</li>
<li>Run <code>npx tsc -p demo0/ts-00-4/practice</code>, then <code>node demo0/ts-00-4/practice/predict.ts</code>.</li>
<li>Compare with your guesses, and for each miss say which world you forgot.</li>
</ol>
<p><strong>Solution and real output:</strong></p>
${ra(OUT['16-practice-tsc'])}
${ra(PRED)}
${PRED_EN}
<p><strong>Done when:</strong> you predicted at least 3 of the 4 lines right, and you can explain line 5 (both tools are happy, yet <code>minutes</code> holds a string) in one sentence.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">compile time</span><span class="v">When a tool reads your code without running it; types exist only here.</span></div>
  <div class="kv"><span class="k">runtime</span><span class="v">When the JavaScript executes with real data; types are gone.</span></div>
  <div class="kv"><span class="k">type erasure</span><span class="v">Removing every type before running; nothing is turned into a check.</span></div>
  <div class="kv"><span class="k">type stripping</span><span class="v">Node 22’s way of erasing: types replaced with whitespace, positions kept.</span></div>
  <div class="kv"><span class="k">erasableSyntaxOnly</span><span class="v">tsconfig option: report syntax that generates code (enum, parameter properties) with TS1294.</span></div>
  <div class="kv"><span class="k">type assertion (<code>as</code>)</span><span class="v">Telling tsc to trust you about a value’s type — a promise, not a check.</span></div>
  <div class="kv"><span class="k">type predicate (<code>x is T</code>)</span><span class="v">Return type of a runtime check function that also narrows the type for tsc.</span></div>
  <div class="kv"><span class="k">boundary</span><span class="v">Where data enters your program (HTTP, JSON, env, database) — needs a runtime check.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Types live at compile time, data lives at runtime; the two never meet.</li>
<li>tsc output and Node’s type stripping both prove it: every type is removed, nothing becomes a check. Node keeps line and column numbers by turning types into spaces.</li>
<li>A file with a type error still runs under Node (exit 0) — <code>tsc --noEmit</code> must be its own step.</li>
<li>You cannot test a type at runtime (TS2693 / ReferenceError); test values, with a type predicate.</li>
<li><code>JSON.parse</code> returns <code>any</code> and <code>as</code> is a promise: outside data needs a runtime check.</li>
<li><code>enum</code> and parameter properties cannot be erased; with <code>erasableSyntaxOnly</code> tsc reports TS1294, so the course uses unions.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('🟩', 'Node.js docs — Modules: TypeScript', 'Type stripping, what is replaced by whitespace, and which syntax is unsupported (enum, parameter properties). Read 1 Nov 2026.', 'https://nodejs.org/api/typescript.html')}
${nguon('🔷', 'TypeScript Handbook — The Basics: Erased Types', 'The official explanation that type annotations are removed and never change runtime behaviour. Read 1 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/basic-types.html')}
${nguon('⚙️', 'TSConfig reference — erasableSyntaxOnly', 'The option this course turns on so tsc warns about syntax Node cannot strip. Read 1 Nov 2026.', 'https://www.typescriptlang.org/tsconfig/#erasableSyntaxOnly')}
${lienKet({ khoa: 'testing', bai: 'tst-0-3-cai-dat', title: 'Also in Testing — 0.3: install Vitest and run your first test', sub: 'Same: Vitest runs .ts files by stripping types, exactly like Node here. Different: the Testing course only notes that a green run says nothing about types; this lesson shows why (erasure) and adds the separate tsc --noEmit gate.', cta: 'OPEN TESTING LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Mô hình tư duy cốt lõi: lúc biên dịch vs lúc chạy</h2>
<p class="lead">Học xong bài này, gặp bất kỳ bất ngờ nào với TypeScript — “tsc xanh mà vẫn sập”, “chạy được rồi chắc là đúng”, “sao không kiểm được kiểu bằng <code>if</code>?” — bạn nói được trong một câu nó thuộc thế giới nào và phải làm gì. Mọi khẳng định bên dưới đều kèm output thật của tsc 7.0.2 và Node 22.23.3 trên LabFlow TS.</p>

<h3>Vì sao một ý này quan trọng</h3>
<p>TypeScript sống ở <strong>compile time</strong> (lúc biên dịch — khi một công cụ đọc code của bạn). Dữ liệu của bạn sống ở <strong>runtime</strong> (lúc chạy — khi Node thực thi code). Hai thế giới không bao giờ gặp nhau: khi một request body tới nơi thì mọi kiểu đã bị xoá từ lâu. Nắm chắc bức tranh này thì phần lớn TypeScript hết bí ẩn. Đây cũng là câu phỏng vấn quen thuộc — “TypeScript có kiểm kiểu lúc chạy không?” — và câu trả lời trung thực chính là toàn bộ bài này.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Compile time (lúc biên dịch)</span><span class="v">tsc (hoặc editor) đọc các tệp. Kiểu tồn tại. Lỗi được tìm ra ở đây. Không có gì chạy, nên chưa có dữ liệu thật.</span></div>
  <div class="kv"><span class="k">Runtime (lúc chạy)</span><span class="v">Node chạy JavaScript. Kiểu đã biến mất. Dữ liệu thật — body HTTP, tệp JSON, dữ liệu người dùng nhập — chỉ có ở đây.</span></div>
</div>
<p>Hình ảnh đời thường: người thanh tra xây dựng kiểm <em>bản vẽ</em> trước khi xây và ký duyệt. Khi người ta dọn vào ở, thanh tra đã về. Kiểm bản vẽ và ở trong nhà là hai thời điểm khác nhau.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Bạn viết .ts</div><div class="lz-d">code + kiểu (<code>: string</code>, <code>interface</code>)</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">tsc kiểm</div><div class="lz-d">lúc biên dịch: kiểu tồn tại, báo lỗi, không gì chạy</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Kiểu bị xoá</div><div class="lz-d">còn lại JavaScript thuần</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">node chạy</div><div class="lz-d">lúc chạy: dữ liệu thật, không kiểu, không kiểm</div></div>
</div>

<h3>Type erasure (xoá kiểu), nhìn tận mắt: tsc xuất ra gì</h3>
<p>Bình thường LabFlow TS dùng <code>noEmit</code> — tsc chỉ kiểm, còn Node chạy thẳng tệp <code>.ts</code> (bài 0.3). Để <em>nhìn thấy</em> việc xoá kiểu, thư mục demo này cho tsc ghi JavaScript. Cấu hình ghi đè hai tuỳ chọn của tsconfig chuẩn: <code>noEmit: false</code>, và <code>allowImportingTsExtensions: false</code> (tuỳ chọn này chỉ được phép khi tsc không ghi JavaScript).</p>
${ma('jsonc', CODE.eraseConfig)}
${ma('typescript', CODE.label)}
${ra(OUT['01-emit'])}
<p>So từng dòng hai tệp. <code>type Role</code> mất. <code>interface Booking</code> mất. <code>(b: Booking): string</code> thành <code>(b)</code>. <code>const who: string</code> thành <code>const who</code>. Không có gì được đổi thành phép kiểm — không hề có <code>if (typeof b.seats !== 'number')</code> nào giấu ở đâu cả. JavaScript đem đi chạy chưa từng nghe tới Booking. Chạy thẳng tệp <code>.ts</code> gốc cho cùng hành vi:</p>
${ra(OUT['02-run-ts'])}

<h3>Node 22 thật ra chạy gì: kiểu biến thành khoảng trắng</h3>
<p>Node từ 22.18 trở đi chạy tệp <code>.ts</code> bằng <strong>type stripping</strong> (bỏ kiểu): nó không biên dịch, nó xoá trắng phần cú pháp kiểu rồi chạy phần còn lại. Node mở chính hàm đó ra ngoài với tên <code>stripTypeScriptTypes</code> trong <code>node:module</code>, nên ta in được đúng thứ nó thực thi cho một tệp nhỏ:</p>
${ma('typescript', CODE.throwTs)}
${ma('javascript', CODE.show)}
${ra(STRIP)}
<p>Dòng 2–8 (type và interface) giờ trống hoặc toàn khoảng trắng, còn <code>(b: Booking): number</code> ở dòng 10 thành <code>(b</code>, chín khoảng trắng, <code>)</code>, thêm chín khoảng trắng — cùng độ rộng, kiểu bị thay bằng khoảng trắng. Không gì xê dịch. Đây là thiết kế có chủ đích: vì mọi ký tự giữ nguyên vị trí, thông báo lỗi chỉ đúng vào tệp bạn viết mà không cần source map. Chạy tệp và nhìn stack trace:</p>
${ra(THROW)}
<p><code>throw.ts:11:26</code> là dòng 11, cột 26 của tệp <em>nguồn</em> — đúng chỗ <code>new RangeError</code> bắt đầu. (Dòng ExperimentalWarning phía trên là do gọi tay <code>stripTypeScriptTypes</code>; chạy <code>node file.ts</code> bình thường trên 22.23.3 không in cảnh báo nào.)</p>

<h3>Hệ quả 1 — lỗi kiểu không chặn được Node</h3>
${ma('typescript', CODE.wrong)}
${ra(OUT['05-runs-tsc'])}
${ra(OUT['06-runs-node'])}
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — “chạy được rồi, vậy kiểu ổn”.</strong> tsc từ chối dòng 2 với TS2322 và thoát mã 1. Node không hỏi tsc điều gì: nó bỏ <code>: number</code>, cất chuỗi <code>'31'</code>, và <code>'31' + 1</code> thành chuỗi <code>'311'</code> — thoát mã 0, không một lời cảnh báo. Trong hệ thống đặt phòng, đó là một phòng lab 311 chỗ. Kiểm và chạy là hai bước tách rời; nếu không ai chạy bước kiểm thì lỗi kiểu lên production. Vì vậy LabFlow TS luôn chạy <code>npm run typecheck</code> cạnh <code>npm test</code>.</p>
</div>

<h3>Hệ quả 2 — kiểu không phải là giá trị</h3>
<p>Người mới học thấy TypeScript “biết” kiểu Booking thì rất tự nhiên muốn hỏi nó lúc chạy:</p>
${ma('typescript', CODE.inst)}
${ra(OUT['07-typeval-tsc'])}
${ra(INST)}
<p>Hai thế giới, hai lời từ chối. tsc báo <strong>TS2693</strong> — <em>“'Booking' chỉ là một kiểu, nhưng đang bị dùng như một giá trị”</em> — và vì phép kiểm không thu hẹp được gì nên báo thêm <strong>TS18046</strong> ở <code>x.lab</code> (<code>x</code> vẫn là <code>unknown</code>). Node, vốn chưa từng thấy kiểu, báo <code>ReferenceError: Booking is not defined</code>: sau khi bỏ kiểu, cái tên đó không tồn tại. <code>instanceof</code> làm việc với <em>class</em>, vì class là JavaScript thật, sống sót qua bước xoá kiểu; còn <code>type</code> hay <code>interface</code> thì không.</p>
<p>Cách sửa là kiểm <strong>giá trị</strong> — thứ tồn tại lúc chạy — rồi nói cho trình biên dịch biết kết quả <code>true</code> nghĩa là gì bằng type predicate (vị từ kiểu, <code>x is Booking</code>, học kỹ ở Chương 5):</p>
${ma('typescript', CODE.fixed)}
${ra(OUT['09-typeval-fixed'])}

<h3>Hệ quả 3 — <code>JSON.parse</code> và <code>as</code> có thể nói dối</h3>
<p>Dữ liệu từ bên ngoài (body HTTP, tệp, <code>process.env</code>) sinh ra lúc chạy, nên trình biên dịch không bao giờ thấy nó. <code>JSON.parse</code> được khai báo trả về <code>any</code>, còn <code>as BookingInput</code> nghĩa là “tin tôi đi”:</p>
${ma('typescript', CODE.lie)}
${ra(OUT['10-json-tsc'])}
${ra(LIE)}
<p>tsc không in gì và thoát mã 0 — nó đã tin bạn. Lúc chạy <code>seats</code> là <em>chuỗi</em> <code>"31"</code> và <code>role</code> là <code>"student"</code>, và cú sập xảy ra bên trong <code>needsApproval</code> ở <code>src/rules/booking.ts</code>, cách dòng nói dối hai tệp. Bỏ <code>as</code> cũng chẳng khá hơn, vì <code>any</code> tắt hẳn việc kiểm:</p>
${ma('typescript', CODE.anyTs)}
${ra(OUT['12-json-any'])}
<p>Một lỗi gõ (<code>seatz</code>), một chú thích <code>number</code>, và kết quả là <code>NaN</code> với mã thoát 0. Luật của khoá: <strong>kiểu kiểm code của bạn; phép kiểm lúc chạy kiểm dữ liệu của bạn.</strong> Mọi điểm biên đều cần một phép kiểm thật — hôm nay là hàm canh viết tay như <code>isBooking</code>, Chương 13 là schema Zod.</p>

<h3>Hệ quả 4 — cú pháp không xoá được</h3>
<p>Gần như toàn bộ TypeScript là thông tin kiểu thuần tuý. Vài tính năng cũ lại <em>sinh ra code</em>: <code>enum</code> biến thành một object, còn parameter property trong constructor (<code>constructor(private rows: string[])</code>) biến thành phép gán <code>this.rows = rows</code>. Bỏ chúng đi là đổi chương trình, nên Node từ chối:</p>
${ma('typescript', CODE.status)}
${ra(ENUM)}
<p>tsconfig của khoá bật <code>erasableSyntaxOnly</code>, nên tsc cảnh báo trước cả Node — <strong>TS1294</strong> ở cả enum lẫn parameter property:</p>
${ra(OUT['13-enum-tsc'])}
<p>Cách viết xoá được nói cùng một ý chỉ bằng kiểu, và chạy được:</p>
${ma('typescript', CODE.union)}
${ra(OUT['15-union-node'])}
<p>Vì vậy LabFlow TS viết <code>type Role = 'STUDENT' | 'LECTURER' | 'ADMIN'</code> thay cho enum (Chương 5 cho thấy union làm được mọi việc enum từng làm).</p>

<h3>Công cụ nào kiểm, công cụ nào chạy</h3>
${BANG_VI}
<p>Chỉ hai dòng kiểm kiểu — tsc và editor — và editor có thể là một bản TypeScript khác. Mọi thứ <em>chạy</em> code đều bỏ kiểu rồi chạy tiếp. Nên cổng phải được đặt rõ ràng: <code>npx tsc --noEmit</code> (LabFlow TS: <code>npm run typecheck</code>) thành một bước riêng trước test và trước deploy. Chính website này đã học điều đó bằng giá đắt ngày 08/08/2026 (bài 0.9 kể đầy đủ).</p>

<h3>Khi bất ngờ, hỏi một câu</h3>
<p>“Đây là chuyện lúc biên dịch hay chuyện lúc chạy?” Ba câu than kinh điển:</p>
<ul>
<li><strong>“tsc xanh mà vẫn sập.”</strong> Lúc chạy. Dữ liệu không khớp lời hứa bạn đã đưa (<code>as</code>, <code>JSON.parse</code>, body request). Thêm phép kiểm lúc chạy ở điểm biên đó.</li>
<li><strong>“Node chạy được nên chắc ổn.”</strong> Đã bỏ qua bước biên dịch. Node không bao giờ kiểm kiểu. Chạy <code>npx tsc</code>.</li>
<li><strong>“Tôi muốn kiểm kiểu bằng if.”</strong> Kiểu không tồn tại lúc chạy. Kiểm giá trị (<code>typeof</code>, <code>Array.isArray</code>, một thuộc tính), hoặc dùng schema (Chương 13).</li>
</ul>

<h3>Góc phỏng vấn</h3>
<p><strong>Hỏi: TypeScript có kiểm kiểu lúc chạy không?</strong> Trả lời yếu: “Có, kiểu sinh ra để làm vậy.” Trả lời mạnh: “Không. Kiểu bị xoá trước khi code chạy — tsc kiểm code, Node chạy JavaScript thuần. Nên em coi mọi điểm biên (body request, JSON, biến môi trường) là <code>unknown</code> và validate lúc chạy, ví dụ bằng Zod, và em chạy <code>tsc --noEmit</code> trong CI vì runtime sẽ không làm việc đó.”</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<p>Tạo <code>demo0/ts-00-4/practice/predict.ts</code> kèm một <code>tsconfig.json</code> cạnh nó (<code>{ "extends": "../../../tsconfig.json", "include": ["."] }</code>):</p>
${ma('typescript', CODE.predict)}
<ol>
<li>Trước khi chạy bất cứ gì, ghi ra giấy cho các dòng 3, 4, 5 và 8: tsc lỗi, Node lỗi, cả hai, hay không cái nào.</li>
<li>Chạy <code>npx tsc -p demo0/ts-00-4/practice</code>, rồi <code>node demo0/ts-00-4/practice/predict.ts</code>.</li>
<li>So với dự đoán, và với mỗi chỗ đoán sai hãy nói bạn đã quên thế giới nào.</li>
</ol>
<p><strong>Lời giải và output thật:</strong></p>
${ra(OUT['16-practice-tsc'])}
${ra(PRED)}
${PRED_VI}
<p><strong>Đạt khi:</strong> bạn đoán đúng ít nhất 3/4 dòng, và giải thích được dòng 5 (cả hai công cụ đều vui, nhưng <code>minutes</code> lại chứa một chuỗi) trong một câu.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">compile time (lúc biên dịch)</span><span class="v">Khi một công cụ đọc code mà không chạy; kiểu chỉ tồn tại ở đây.</span></div>
  <div class="kv"><span class="k">runtime (lúc chạy)</span><span class="v">Khi JavaScript thực thi với dữ liệu thật; kiểu đã mất.</span></div>
  <div class="kv"><span class="k">type erasure (xoá kiểu)</span><span class="v">Bỏ mọi kiểu trước khi chạy; không gì được đổi thành phép kiểm.</span></div>
  <div class="kv"><span class="k">type stripping (bỏ kiểu)</span><span class="v">Cách Node 22 xoá kiểu: thay kiểu bằng khoảng trắng, giữ nguyên vị trí.</span></div>
  <div class="kv"><span class="k">erasableSyntaxOnly</span><span class="v">Tuỳ chọn tsconfig: báo TS1294 cho cú pháp sinh code (enum, parameter property).</span></div>
  <div class="kv"><span class="k">type assertion — <code>as</code> (ép kiểu)</span><span class="v">Bảo tsc tin bạn về kiểu của một giá trị — một lời hứa, không phải phép kiểm.</span></div>
  <div class="kv"><span class="k">type predicate — <code>x is T</code> (vị từ kiểu)</span><span class="v">Kiểu trả về của một hàm kiểm lúc chạy, đồng thời thu hẹp kiểu cho tsc.</span></div>
  <div class="kv"><span class="k">boundary (điểm biên)</span><span class="v">Nơi dữ liệu đi vào chương trình (HTTP, JSON, env, CSDL) — cần phép kiểm lúc chạy.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Kiểu sống lúc biên dịch, dữ liệu sống lúc chạy; hai bên không bao giờ gặp nhau.</li>
<li>Output của tsc và việc Node 22 bỏ kiểu đều chứng minh: mọi kiểu bị xoá, không gì thành phép kiểm. Node giữ nguyên số dòng/cột bằng cách biến kiểu thành khoảng trắng.</li>
<li>Tệp có lỗi kiểu vẫn chạy dưới Node (mã thoát 0) — <code>tsc --noEmit</code> phải là một bước riêng.</li>
<li>Không kiểm được kiểu lúc chạy (TS2693 / ReferenceError); hãy kiểm giá trị, kèm type predicate.</li>
<li><code>JSON.parse</code> trả về <code>any</code> và <code>as</code> là lời hứa: dữ liệu bên ngoài cần phép kiểm lúc chạy.</li>
<li><code>enum</code> và parameter property không xoá được; bật <code>erasableSyntaxOnly</code> thì tsc báo TS1294, nên khoá dùng union.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('🟩', 'Tài liệu Node.js — Modules: TypeScript', 'Type stripping, phần nào được thay bằng khoảng trắng, cú pháp nào không hỗ trợ (enum, parameter property). Đọc ngày 1/11/2026.', 'https://nodejs.org/api/typescript.html')}
${nguon('🔷', 'TypeScript Handbook — The Basics: Erased Types', 'Giải thích chính thức: chú thích kiểu bị xoá và không bao giờ đổi hành vi lúc chạy. Đọc ngày 1/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/basic-types.html')}
${nguon('⚙️', 'TSConfig reference — erasableSyntaxOnly', 'Tuỳ chọn khoá này bật để tsc cảnh báo cú pháp mà Node không bỏ được. Đọc ngày 1/11/2026.', 'https://www.typescriptlang.org/tsconfig/#erasableSyntaxOnly')}
${lienKet({ khoa: 'testing', bai: 'tst-0-3-cai-dat', title: 'Đã gặp ở khoá Testing — 0.3: cài Vitest và chạy test đầu tiên', sub: 'Giống: Vitest chạy tệp .ts bằng cách bỏ kiểu, y như Node ở đây. Khác: khoá Testing chỉ ghi chú rằng chạy xanh không nói gì về kiểu; bài này cho thấy vì sao (xoá kiểu) và thêm cổng tsc --noEmit tách riêng.', cta: 'MỞ BÀI TESTING →' })}
</div>
`,
};
