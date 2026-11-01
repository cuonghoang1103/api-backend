/**
 * TypeScript · Chương 3 · 3.3 — Overload & điều tinh tế của void. Slug giữ: typescript-3-3-overload-void.
 * Soạn lại 01/11/2026 (theo $S/ts/BRIEF-CH3.md). Mọi code/output lấy từ ./_ma-ts-03-3.mjs (sinh từ labflow-ts chạy thật: Node 22.23.3, tsc 7.0.2).
 * Giữ từ bản cũ: TS2769, chữ ký cài đặt không gọi được, "overload sau cùng", void = "bỏ qua kết quả", forEach(async) không chờ,
 * bẫy overload hứa nhiều hơn phần cài đặt — nay đều có output thật trên LabFlow (toMinutes, validate + onProblem).
 */
import G from '../giang/ts-03-3.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-03-3.mjs';

// Bỏ các dòng khung nội bộ của Node (ModuleJob, loader, run_main) — không sửa chữ nào khác.
const bo = (s) => s.split('\n').filter((l) => !/^\s+at (ModuleJob|async onImport|async asyncRunEntryPoint)/.test(l)).join('\n');
const LOOSE_RUN = bo(OUT['18-loose-run']);
const ASYNC_RUN = bo(OUT['22-async-run']);

const BANG_EN = `<table>
<thead><tr><th>The situation</th><th>Write</th><th>Example in LabFlow</th></tr></thead>
<tbody>
<tr><td>Return type is the same whatever you pass</td><td>a <strong>union parameter</strong>, no overloads</td><td><code>rangeLabel(r: TimeRange | string): string</code></td></tr>
<tr><td>Return type depends on <em>which kind</em> of argument (a few fixed cases)</td><td><strong>overloads</strong></td><td><code>toMinutes(text: string): number</code> / <code>toMinutes(texts: readonly string[]): number[]</code></td></tr>
<tr><td>Return type is computed from the argument type (“give back what you got”)</td><td>a <strong>generic</strong> (Chapter 6)</td><td><code>first&lt;T&gt;(list: readonly T[]): T | undefined</code></td></tr>
<tr><td>A union value must be accepted by an overloaded function</td><td>a third overload with the union, or narrow first</td><td><code>typeof x === 'string' ? toMinutes(x) : toMinutes(x)</code></td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Tình huống</th><th>Viết</th><th>Ví dụ trong LabFlow</th></tr></thead>
<tbody>
<tr><td>Kiểu trả về như nhau dù truyền gì</td><td><strong>tham số union</strong>, không overload</td><td><code>rangeLabel(r: TimeRange | string): string</code></td></tr>
<tr><td>Kiểu trả về phụ thuộc vào <em>loại</em> đối số (vài trường hợp cố định)</td><td><strong>overload</strong></td><td><code>toMinutes(text: string): number</code> / <code>toMinutes(texts: readonly string[]): number[]</code></td></tr>
<tr><td>Kiểu trả về tính ra từ kiểu đối số (“đưa gì trả nấy”)</td><td><strong>generic</strong> (Chương 6)</td><td><code>first&lt;T&gt;(list: readonly T[]): T | undefined</code></td></tr>
<tr><td>Một giá trị union phải đưa được vào hàm có overload</td><td>thêm overload thứ ba nhận union, hoặc thu hẹp trước</td><td><code>typeof x === 'string' ? toMinutes(x) : toMinutes(x)</code></td></tr>
</tbody>
</table>`;

const SLOT_EN = `<table>
<thead><tr><th>Callback slot you are typing</th><th>Type it as</th><th>Why</th></tr></thead>
<tbody>
<tr><td>“tell me, I don’t need an answer” (log, notify, event)</td><td><code>(p: Problem) =&gt; void</code></td><td>callers may pass <code>log.push</code>, <code>console.log</code>… anything</td></tr>
<tr><td>“I need the answer” (a rule, a mapper)</td><td>the real return type, e.g. <code>Problem | null</code></td><td>a wrong return is refused</td></tr>
<tr><td>“I will wait for you” (save, send)</td><td><code>(p: Problem) =&gt; Promise&lt;void&gt;</code> and <strong>await</strong> it</td><td>a failure reaches your <code>try/catch</code></td></tr>
<tr><td>a function you declare yourself</td><td><code>function f(): void</code> only if it returns nothing</td><td><code>return value</code> there is TS2322</td></tr>
</tbody>
</table>`;
const SLOT_VI = `<table>
<thead><tr><th>Chỗ callback bạn đang gõ kiểu</th><th>Gõ là</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>“báo cho tôi, tôi không cần trả lời” (log, thông báo, sự kiện)</td><td><code>(p: Problem) =&gt; void</code></td><td>người gọi đưa <code>log.push</code>, <code>console.log</code>… gì cũng được</td></tr>
<tr><td>“tôi cần câu trả lời” (một luật, một hàm biến đổi)</td><td>đúng kiểu trả về, vd <code>Problem | null</code></td><td>trả sai kiểu bị từ chối</td></tr>
<tr><td>“tôi sẽ chờ bạn” (lưu, gửi)</td><td><code>(p: Problem) =&gt; Promise&lt;void&gt;</code> và <strong>await</strong> nó</td><td>lỗi rơi vào <code>try/catch</code> của bạn</td></tr>
<tr><td>hàm bạn tự khai báo</td><td><code>function f(): void</code> chỉ khi nó không trả gì</td><td><code>return value</code> ở đó là TS2322</td></tr>
</tbody>
</table>`;

export default {
  title: '3.3 — Overloads & the void-return subtlety|||3.3 — Overload & điều tinh tế của void',
  slug: 'typescript-3-3-overload-void',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Một hàm LabFlow, hai dáng gọi (toMinutes nhận một giờ hoặc cả danh sách): union trả về bắt người gọi thu hẹp (TS2322), overload cho mỗi dáng một kiểu riêng, .d.ts chứng minh chữ ký cài đặt biến mất, đọc TS2769 (kể cả khi đối số là union), thứ tự overload, bẫy overload hứa nhiều hơn phần cài đặt (tsc 0 lỗi, Node TypeError); khi nào dùng union/overload/generic; void nghĩa là "bỏ qua kết quả" (log.push được nhận, hàm khai báo void mà return là TS2322) và bẫy thật: hàm async ở chỗ () => void — tsc im lặng, unhandled rejection làm Node 22 thoát mã 1, forEach(async) không chờ; cách sửa bằng for…of + await.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>Overloads &amp; the void-return subtlety</h2>
<p class="lead">Two features that look advanced but explain everyday behaviour. <strong>Overloads</strong> let one function have several typed shapes, so a caller who passes one time gets a <code>number</code> and a caller who passes a list gets a <code>number[]</code>. <strong><code>void</code> in a callback type</strong> means “I will ignore what you return” — which is why <code>forEach</code> accepts <code>log.push</code>, and also why it silently accepts an <code>async</code> function that then crashes Node. Everything below runs on LabFlow, and every output is real.</p>

<h3>What you will be able to do, and why it matters</h3>
<ul>
<li>Write a function with <strong>overload signatures</strong> and read <strong>TS2769</strong> “No overload matches this call” — including its confusing last line.</li>
<li>Choose between a <strong>union parameter, overloads and a generic</strong> with one rule: does the return type depend on the argument?</li>
<li>Spot an overload that <strong>promises more</strong> than its implementation does (tsc accepts it; Node crashes).</li>
<li>Explain why a <code>=&gt; void</code> callback accepts a function that returns something — and why an <strong>async</strong> callback in that slot is a production bug.</li>
</ul>
<p>Why it matters: library types are full of overloads — <code>document.querySelector</code>, <code>Array.prototype.reduce</code>, Express’s <code>app.get</code> — and TS2769 is the error you will meet when you call them “almost right”. The async-in-a-void-slot bug is a classic in Node backends (SDN302, your graduation project): a request answers “OK”, a save fails a moment later, and the whole server process exits. Lab 3 uses both ideas: <code>toMinutes</code> with overloads and a <code>validate</code> with a void callback.</p>

<h3>One helper, two call shapes</h3>
<p>LabFlow’s booking form sends one time (<code>"08:00"</code>); the CSV import for a whole semester sends a list. A first attempt accepts both with a union — and returns a union:</p>
${ma('typescript', CODE.unionMinutes)}
${ma('typescript', CODE.unionUse)}
${ra(OUT['11-union-tsc'])}
<p>The function is correct; its <em>type</em> is too vague. <code>number | number[]</code> tells every caller “it might be either”, even the one who just passed a single string and knows the answer is a number. Each caller would now need a <code>typeof</code> check or an <code>as</code> cast for something the function could have said once.</p>

<h3>Overloads: the signatures callers see, the implementation they don’t</h3>
<p>Write the call shapes as <strong>overload signatures</strong> — declarations without a body — and put one implementation after them:</p>
${ma('typescript', CODE.ovMinutes)}
${ma('typescript', CODE.ovUse)}
${ra(OUT['12-overload'])}
<p>Each call is matched against the overloads <strong>top to bottom</strong>; the first that fits decides the return type. The third line — the one with the body — is the <strong>implementation signature</strong>. It must be broad enough to cover every overload, and it is <strong>not visible</strong> to callers. You can prove that: ask tsc to write only the declaration file (<code>.d.ts</code>), which is exactly what another module sees:</p>
${ma('json', CODE.dtsJson)}
${ra(OUT['15-dts'])}
<p>Two lines. The implementation signature <code>(x: string | readonly string[])</code> is gone — so nobody can call <code>toMinutes</code> with a value that is <em>still</em> a union. That surprises everyone once; the next section shows it.</p>

<h3>Reading TS2769: “No overload matches this call”</h3>
${ma('typescript', CODE.ovWrong)}
${ra(OUT['14-wrong-tsc'])}
<ul>
<li><strong>Line 3</strong> is not TS2769 at all: <code>['08:00']</code> matched overload 2, which returns <code>number[]</code>, and a <code>number[]</code> does not fit in a <code>number</code> — TS2322, exactly what we wanted.</li>
<li><strong>Line 4</strong>: <code>480</code> fits no overload. tsc tried them all and reports only “<em>The last overload gave the following error</em>”. Read that line as “here is why the last candidate failed” — the real fix may concern any overload. Here it is simply: minutes are not <code>"HH:MM"</code>.</li>
<li><strong>Line 6</strong>: <code>fromCsv</code> is <code>string | string[]</code>. Overload 1 wants a <code>string</code>, overload 2 a list; a value that might be either fits <em>neither</em>, and the implementation signature that would accept it is invisible. Fix it by narrowing first (<code>typeof fromCsv === 'string' ? toMinutes(fromCsv) : toMinutes(fromCsv)</code>) or by adding a third overload that takes the union and returns the union.</li>
</ul>

<h3>Order matters: the first match wins</h3>
${ma('typescript', CODE.order)}
${ra(OUT['16-order-tsc'])}
<p>The broad signature sits first, so <code>'08:00'</code> matches it and gets <code>number | number[]</code>; the precise signatures below are never reached. Rule: <strong>most specific overload first, broadest last</strong>.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — an overload can promise more than the implementation keeps.</strong> tsc checks the implementation against the overloads only loosely: each overload must be <em>compatible</em> with the implementation signature, not proven by its body. Here overload 1 promises a <code>number</code>, while the body returns <code>undefined</code> for an empty form field:</p>
${ma('typescript', CODE.loose)}
${ra(OUT['17-loose-tsc'])}
${ra(LOOSE_RUN)}
<p>Zero errors, then a crash: the caller trusted the overload. When the body can return something extra, the overload must say so (<code>number | undefined</code>, or <code>null</code>) — Code Lab exercise <em>d</em> is exactly this fix. Overloads are a promise you write by hand; review them like code.</p>
</div>

<h3>Overload, union or generic?</h3>
<p>Ask one question: <strong>does the return type depend on the argument?</strong> If not, a union parameter is all you need — no overloads:</p>
${ma('typescript', CODE.alt)}
${ra(OUT['19-alt'])}
${BANG_EN}

<h3>void, revisited: “I will ignore what you return”</h3>
<p>Lesson 2.3 showed that <code>void</code> means “there is nothing here to use”. In a <strong>callback type</strong> that has a precise consequence. LabFlow’s <code>validate</code> takes an optional <code>onProblem</code> callback (you will write the full version in Lab 3):</p>
${ma('typescript', CODE.validate)}
${ma('typescript', CODE.voidUse)}
${ra(OUT['20-void-tsc'])}
<p>One error, and it is the only line that is really wrong. <code>(p) =&gt; log.push(p)</code> returns a number and is accepted; <code>report2</code>, whose type is a function type ending in <code>=&gt; void</code>, returns a string and is accepted. But <code>report</code> is a function <strong>declared</strong> with <code>: void</code>, and its own body returns a value: TS2322. The difference: a function <em>type</em> with <code>void</code> is a promise by the <strong>caller</strong> (“I won’t use your result”); a function <em>declaration</em> with <code>void</code> is a promise by the <strong>function</strong> (“I return nothing”). Without the first rule, <code>ids.forEach((id) =&gt; seen.push(id))</code> would not compile.</p>

<h3>🗺 Where a callback’s result goes</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">validate finds a problem</div><div class="lz-d">calls onProblem(p)</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">your callback runs</div><div class="lz-d">returns 1, undefined — or a Promise</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">validate drops the result</div><div class="lz-d">that is what “=&gt; void” promised</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">a dropped Promise</div><div class="lz-d">nobody awaits it: its error has nowhere to go</div></div>
</div>

<div class="pitfall co-tieu-de">
<p><strong>Trap — an async function in a <code>=&gt; void</code> slot.</strong> Saving each problem to the database is async. The slot says <code>(p: Problem) =&gt; void</code>; an async function returns a <code>Promise</code>; void accepts anything, so it compiles:</p>
${ma('typescript', CODE.asyncSave)}
${ra(OUT['21-async-tsc'])}
${ra(ASYNC_RUN)}
<p>The request already answered “validated — response sent”. 10 ms later the save fails, nobody awaits that promise, and since Node 15 the default for an <strong>unhandled rejection</strong> is to throw: the process exits with code 1 — in a server, every other user’s request dies with it. The same mechanism makes <code>forEach</code> useless for async work, because its callback slot is also <code>=&gt; void</code>:</p>
${ma('typescript', CODE.foreach)}
${ra(OUT['23-foreach-run'])}
<p>Right after <code>forEach</code> nothing is saved; 50 ms later everything is. Code that reads <code>saved</code> straight after the loop sees an empty list.</p>
</div>

<h3>The fix: await the work where someone can catch it</h3>
${ma('typescript', CODE.fixSave)}
${ma('typescript', CODE.fixForeach)}
${ra(OUT['24-fix'])}
<p>A <code>for…of</code> loop with <code>await</code> waits for each save, and a failure lands in <code>catch</code>: the API answers 503 and keeps running. When <em>you</em> design a callback slot, choose its type by what you will do with the result:</p>
${SLOT_EN}
<p>tsc alone cannot tell “a Promise I meant to ignore” from “a Promise I forgot”. The lint rule <code>@typescript-eslint/no-misused-promises</code> flags a promise-returning function passed where <code>void</code> is expected — worth turning on in any Node project.</p>

<h3>💼 Interview corner</h3>
<ul>
<li><em>“When would you use overloads instead of a union?”</em> — When the return type depends on which kind of argument comes in, and there are a few fixed cases. If the return is the same, a union parameter; if it is computed from the argument type, a generic.</li>
<li><em>“Why does <code>arr.forEach(x =&gt; out.push(x))</code> compile if forEach wants a void callback?”</em> — In a function type, <code>void</code> means the caller ignores the result, so any return value is allowed. The flip side: an async callback compiles too, and its rejected promise is never awaited.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p><code>durationOf</code> returns the length of one booking range in minutes, or one length per range for a whole day. It is typed with a union return, so both callers are refused:</p>
${ma('typescript', CODE.prStart)}
${ma('typescript', CODE.prUse)}
${ra(OUT['26-pr-start'])}
<ol>
<li>Add two overload signatures so <code>use.ts</code> compiles unchanged.</li>
<li>Remove both <code>as</code> casts from the body: tell the two shapes apart with a small function <code>isRange(x): x is TimeRange</code> (a type guard — Chapter 5 explains it fully).</li>
<li>Run tsc and Node.</li>
</ol>
<p><strong>Solution and real output:</strong></p>
${ma('typescript', CODE.prSol)}
${ra(OUT['27-pr-sol'])}
<p><strong>Done when:</strong> tsc prints no error for <code>use.ts</code>, the body has no <code>as</code>, and Node prints <code>120 [ 120, 90 ]</code>. Code Lab has four more exercises for this lesson: overloads for <code>toMinutes</code>, a <code>void</code> callback slot, fixing <code>forEach(async …)</code>, and an overload that must stop lying.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">overload signature</span><span class="v">A declaration without a body, one per call shape. Callers see only these.</span></div>
  <div class="kv"><span class="k">implementation signature</span><span class="v">The signature with the body. Must cover every overload; invisible to callers.</span></div>
  <div class="kv"><span class="k">TS2769</span><span class="v">“No overload matches this call” — the message shows why the <em>last</em> overload failed.</span></div>
  <div class="kv"><span class="k">void (in a function type)</span><span class="v">“The caller will ignore the result”, so a function returning a value still fits.</span></div>
  <div class="kv"><span class="k">unhandled rejection</span><span class="v">A rejected Promise nobody awaits or catches. Node ≥ 15 exits with code 1 by default.</span></div>
  <div class="kv"><span class="k">floating promise</span><span class="v">A Promise created and dropped — its result and its errors are lost.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A union return (<code>number | number[]</code>) forces every caller to narrow (TS2322). Overloads give each call shape its own return type.</li>
<li>Callers see only the overload signatures — the <code>.d.ts</code> shows the implementation signature disappears, so a union argument matches nothing (TS2769).</li>
<li>Overloads are tried top to bottom: put the specific ones first. And they are only loosely checked against the body: an overload can promise a <code>number</code> while the body returns <code>undefined</code>.</li>
<li>Same return type for every argument ⇒ union parameter; return computed from the argument ⇒ generic; a few fixed cases ⇒ overloads.</li>
<li><code>=&gt; void</code> in a callback type means “result ignored”: <code>log.push</code> fits, a declared <code>function f(): void</code> must not return. An async function also fits — and its rejection is unhandled: tsc 0 errors, Node exit code 1. Await async work in <code>for…of</code>.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — More on Functions', 'Function overloads, the implementation signature, “prefer unions when possible”, and “Return type void”. Read 1 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/functions.html')}
${nguon('🟩', 'Node.js docs — CLI: --unhandled-rejections', 'Default mode changed to throw in v15.0.0: an unhandled rejection ends the process. Read 1 Nov 2026.', 'https://nodejs.org/api/cli.html')}
${nguon('🟦', 'MDN — Array.prototype.forEach()', '“forEach() expects a synchronous function — it does not wait for promises.” Read 1 Nov 2026.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach')}
${nguon('🧹', 'typescript-eslint — no-misused-promises', 'The lint rule that flags a promise-returning function in a void slot. Read 1 Nov 2026.', 'https://typescript-eslint.io/rules/no-misused-promises/')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-1-4-bat-dong-bo', title: 'Same crash in the Node.js course — 1.4: Async (Mistake 4)', sub: 'Same: an unhandled rejected Promise ends the Node process, and arr.forEach(async …) waits for nothing. Different: here you see why TypeScript lets it through — a void callback slot accepts an async function — and how to type and await the slot so the failure reaches your try/catch.', cta: 'OPEN NODE.JS LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Overload &amp; điều tinh tế của void</h2>
<p class="lead">Hai tính năng trông nâng cao nhưng giải thích hành vi hằng ngày. <strong>Overload</strong> cho một hàm có nhiều dáng có kiểu, nên ai truyền một giờ thì nhận <code>number</code>, ai truyền danh sách thì nhận <code>number[]</code>. <strong><code>void</code> trong kiểu callback</strong> nghĩa là “tôi sẽ bỏ qua thứ bạn trả về” — vì thế <code>forEach</code> nhận <code>log.push</code>, và cũng vì thế nó lặng lẽ nhận một hàm <code>async</code> rồi làm sập Node. Mọi thứ dưới đây chạy trên LabFlow, mọi output đều thật.</p>

<h3>Học xong bạn làm được gì, và vì sao có ích</h3>
<ul>
<li>Viết hàm có <strong>chữ ký overload</strong> và đọc <strong>TS2769</strong> “No overload matches this call” — kể cả dòng cuối khó hiểu của nó.</li>
<li>Chọn giữa <strong>tham số union, overload và generic</strong> bằng một câu hỏi: kiểu trả về có phụ thuộc vào đối số không?</li>
<li>Nhận ra overload <strong>hứa nhiều hơn</strong> phần cài đặt làm được (tsc chấp nhận; Node sập).</li>
<li>Giải thích vì sao callback <code>=&gt; void</code> nhận một hàm có trả về — và vì sao callback <strong>async</strong> ở chỗ đó là bug production.</li>
</ul>
<p>Vì sao quan trọng: kiểu của thư viện đầy overload — <code>document.querySelector</code>, <code>Array.prototype.reduce</code>, <code>app.get</code> của Express — và TS2769 là lỗi bạn gặp khi gọi chúng “gần đúng”. Bug async ở chỗ void là kinh điển trong backend Node (SDN302, đồ án tốt nghiệp): request đã trả “OK”, một lúc sau việc lưu hỏng, và cả tiến trình server thoát. Lab 3 dùng cả hai ý: <code>toMinutes</code> có overload và <code>validate</code> có callback void.</p>

<h3>Một hàm, hai dáng gọi</h3>
<p>Form đặt phòng của LabFlow gửi một giờ (<code>"08:00"</code>); chức năng nhập CSV cho cả học kỳ gửi một danh sách. Lần thử đầu nhận cả hai bằng union — và trả về union:</p>
${ma('typescript', CODE.unionMinutes)}
${ma('typescript', CODE.unionUse)}
${ra(OUT['11-union-tsc'])}
<p>Hàm đúng; <em>kiểu</em> của nó quá mơ hồ. <code>number | number[]</code> nói với mọi người gọi “có thể là cái này hoặc cái kia”, kể cả người vừa truyền một chuỗi và biết chắc đáp án là số. Giờ người gọi nào cũng phải kiểm <code>typeof</code> hoặc ép <code>as</code> cho một điều mà hàm lẽ ra nói một lần là xong.</p>

<h3>Overload: chữ ký người gọi thấy, phần cài đặt họ không thấy</h3>
<p>Viết các dáng gọi thành <strong>chữ ký overload</strong> — khai báo không có thân — rồi đặt một phần cài đặt sau chúng:</p>
${ma('typescript', CODE.ovMinutes)}
${ma('typescript', CODE.ovUse)}
${ra(OUT['12-overload'])}
<p>Mỗi lời gọi được so với các overload <strong>từ trên xuống</strong>; cái đầu tiên khớp quyết định kiểu trả về. Dòng thứ ba — dòng có thân — là <strong>chữ ký cài đặt</strong> (implementation signature). Nó phải đủ rộng để bao mọi overload, và <strong>không hiện ra</strong> với người gọi. Chứng minh được: bảo tsc chỉ viết tệp khai báo (<code>.d.ts</code>), đúng thứ module khác nhìn thấy:</p>
${ma('json', CODE.dtsJson)}
${ra(OUT['15-dts'])}
<p>Hai dòng. Chữ ký cài đặt <code>(x: string | readonly string[])</code> đã biến mất — nên không ai gọi được <code>toMinutes</code> với một giá trị <em>vẫn còn</em> là union. Ai cũng bất ngờ một lần; phần sau cho thấy.</p>

<h3>Đọc TS2769: “No overload matches this call”</h3>
${ma('typescript', CODE.ovWrong)}
${ra(OUT['14-wrong-tsc'])}
<ul>
<li><strong>Dòng 3</strong> không phải TS2769: <code>['08:00']</code> khớp overload 2, trả <code>number[]</code>, mà <code>number[]</code> không vừa <code>number</code> — TS2322, đúng điều ta muốn.</li>
<li><strong>Dòng 4</strong>: <code>480</code> không khớp overload nào. tsc thử hết và chỉ báo “<em>The last overload gave the following error</em>”. Đọc dòng đó là “đây là lý do ứng viên cuối cùng trượt” — cách sửa thật có thể liên quan overload bất kỳ. Ở đây đơn giản: số phút không phải <code>"HH:MM"</code>.</li>
<li><strong>Dòng 6</strong>: <code>fromCsv</code> là <code>string | string[]</code>. Overload 1 cần <code>string</code>, overload 2 cần danh sách; một giá trị có thể là cả hai thì <em>không</em> khớp cái nào, còn chữ ký cài đặt nhận được nó thì vô hình. Sửa bằng cách thu hẹp trước (<code>typeof fromCsv === 'string' ? toMinutes(fromCsv) : toMinutes(fromCsv)</code>) hoặc thêm overload thứ ba nhận union và trả union.</li>
</ul>

<h3>Thứ tự quan trọng: khớp trước thắng</h3>
${ma('typescript', CODE.order)}
${ra(OUT['16-order-tsc'])}
<p>Chữ ký rộng đứng đầu, nên <code>'08:00'</code> khớp nó và nhận <code>number | number[]</code>; hai chữ ký chính xác bên dưới không bao giờ được tới. Quy tắc: <strong>overload cụ thể nhất đứng trước, rộng nhất đứng sau cùng</strong>.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — overload có thể hứa nhiều hơn phần cài đặt giữ được.</strong> tsc chỉ kiểm phần cài đặt với các overload một cách lỏng: mỗi overload phải <em>tương thích</em> với chữ ký cài đặt, chứ không được thân hàm chứng minh. Ở đây overload 1 hứa <code>number</code>, còn thân hàm trả <code>undefined</code> cho ô form trống:</p>
${ma('typescript', CODE.loose)}
${ra(OUT['17-loose-tsc'])}
${ra(LOOSE_RUN)}
<p>Không lỗi nào, rồi sập: người gọi tin overload. Khi thân hàm có thể trả thêm thứ gì, overload phải nói ra (<code>number | undefined</code>, hoặc <code>null</code>) — bài Code Lab <em>d</em> chính là cách sửa này. Overload là lời hứa bạn viết tay; hãy review nó như review code.</p>
</div>

<h3>Overload, union hay generic?</h3>
<p>Hỏi một câu: <strong>kiểu trả về có phụ thuộc vào đối số không?</strong> Nếu không, tham số union là đủ — không cần overload:</p>
${ma('typescript', CODE.alt)}
${ra(OUT['19-alt'])}
${BANG_VI}

<h3>void, nhìn lại: “tôi sẽ bỏ qua thứ bạn trả về”</h3>
<p>Bài 2.3 cho thấy <code>void</code> nghĩa là “ở đây không có gì để dùng”. Trong <strong>kiểu callback</strong> điều đó có hệ quả rất cụ thể. <code>validate</code> của LabFlow nhận một callback tuỳ chọn <code>onProblem</code> (bản đầy đủ bạn tự viết ở Lab 3):</p>
${ma('typescript', CODE.validate)}
${ma('typescript', CODE.voidUse)}
${ra(OUT['20-void-tsc'])}
<p>Một lỗi, và đó là dòng duy nhất sai thật. <code>(p) =&gt; log.push(p)</code> trả một số và được nhận; <code>report2</code>, có kiểu là một kiểu hàm kết thúc bằng <code>=&gt; void</code>, trả chuỗi và được nhận. Nhưng <code>report</code> là hàm <strong>khai báo</strong> với <code>: void</code>, và thân của chính nó trả giá trị: TS2322. Khác nhau ở chỗ: <em>kiểu</em> hàm có <code>void</code> là lời hứa của <strong>người gọi</strong> (“tôi không dùng kết quả của bạn”); <em>khai báo</em> hàm có <code>void</code> là lời hứa của <strong>chính hàm</strong> (“tôi không trả gì”). Không có luật thứ nhất, <code>ids.forEach((id) =&gt; seen.push(id))</code> sẽ không biên dịch được.</p>

<h3>🗺 Kết quả của callback đi đâu</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">validate tìm thấy lỗi</div><div class="lz-d">gọi onProblem(p)</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">callback của bạn chạy</div><div class="lz-d">trả 1, undefined — hoặc một Promise</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">validate bỏ kết quả</div><div class="lz-d">đúng như “=&gt; void” đã hứa</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">một Promise bị bỏ</div><div class="lz-d">không ai await: lỗi của nó không có chỗ đi</div></div>
</div>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — hàm async ở chỗ <code>=&gt; void</code>.</strong> Lưu từng lỗi vào CSDL là việc async. Chỗ callback ghi <code>(p: Problem) =&gt; void</code>; hàm async trả một <code>Promise</code>; void nhận mọi thứ, nên biên dịch được:</p>
${ma('typescript', CODE.asyncSave)}
${ra(OUT['21-async-tsc'])}
${ra(ASYNC_RUN)}
<p>Request đã trả lời “validated — response sent”. 10 ms sau việc lưu hỏng, không ai await promise đó, và từ Node 15 mặc định với <strong>unhandled rejection</strong> là ném lỗi: tiến trình thoát với mã 1 — trên server, request của mọi người dùng khác chết theo. Cùng cơ chế ấy khiến <code>forEach</code> vô dụng với việc async, vì chỗ callback của nó cũng là <code>=&gt; void</code>:</p>
${ma('typescript', CODE.foreach)}
${ra(OUT['23-foreach-run'])}
<p>Ngay sau <code>forEach</code> chưa lưu được gì; 50 ms sau mới đủ. Code đọc <code>saved</code> ngay sau vòng lặp thấy danh sách rỗng.</p>
</div>

<h3>Cách sửa: await việc đó ở chỗ có người bắt được lỗi</h3>
${ma('typescript', CODE.fixSave)}
${ma('typescript', CODE.fixForeach)}
${ra(OUT['24-fix'])}
<p>Vòng <code>for…of</code> với <code>await</code> chờ từng lần lưu, và lỗi rơi vào <code>catch</code>: API trả 503 và tiếp tục chạy. Khi <em>bạn</em> thiết kế một chỗ callback, chọn kiểu theo việc bạn sẽ làm với kết quả:</p>
${SLOT_VI}
<p>Một mình tsc không phân biệt được “Promise tôi cố ý bỏ qua” với “Promise tôi quên”. Luật lint <code>@typescript-eslint/no-misused-promises</code> báo khi một hàm trả Promise được đưa vào chỗ cần <code>void</code> — nên bật trong mọi dự án Node.</p>

<h3>💼 Góc phỏng vấn</h3>
<ul>
<li><em>“Khi nào bạn dùng overload thay cho union?”</em> — Khi kiểu trả về phụ thuộc vào loại đối số đưa vào, và chỉ có vài trường hợp cố định. Nếu trả về như nhau thì tham số union; nếu tính ra từ kiểu đối số thì generic.</li>
<li><em>“Vì sao <code>arr.forEach(x =&gt; out.push(x))</code> biên dịch được khi forEach cần callback void?”</em> — Trong kiểu hàm, <code>void</code> nghĩa là người gọi bỏ qua kết quả, nên trả gì cũng được. Mặt trái: callback async cũng biên dịch được, và promise bị reject của nó không bao giờ được await.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<p><code>durationOf</code> trả độ dài một khoảng giờ đặt phòng tính bằng phút, hoặc mỗi khoảng một độ dài cho cả ngày. Nó đang có kiểu trả về union, nên cả hai người gọi bị từ chối:</p>
${ma('typescript', CODE.prStart)}
${ma('typescript', CODE.prUse)}
${ra(OUT['26-pr-start'])}
<ol>
<li>Thêm hai chữ ký overload để <code>use.ts</code> biên dịch được mà không sửa.</li>
<li>Bỏ hai phép ép <code>as</code> trong thân hàm: phân biệt hai dáng bằng một hàm nhỏ <code>isRange(x): x is TimeRange</code> (type guard — Chương 5 giải thích kỹ).</li>
<li>Chạy tsc và Node.</li>
</ol>
<p><strong>Lời giải và output thật:</strong></p>
${ma('typescript', CODE.prSol)}
${ra(OUT['27-pr-sol'])}
<p><strong>Đạt khi:</strong> tsc không báo lỗi nào cho <code>use.ts</code>, thân hàm không còn <code>as</code>, và Node in <code>120 [ 120, 90 ]</code>. Code Lab có thêm bốn bài cho bài học này: overload cho <code>toMinutes</code>, chỗ callback <code>void</code>, sửa <code>forEach(async …)</code>, và một overload phải thôi nói dối.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">overload signature (chữ ký overload)</span><span class="v">Khai báo không có thân, mỗi dáng gọi một cái. Người gọi chỉ thấy những dòng này.</span></div>
  <div class="kv"><span class="k">implementation signature (chữ ký cài đặt)</span><span class="v">Chữ ký có thân. Phải bao mọi overload; người gọi không thấy.</span></div>
  <div class="kv"><span class="k">TS2769</span><span class="v">“No overload matches this call” — thông báo cho thấy vì sao overload <em>cuối cùng</em> trượt.</span></div>
  <div class="kv"><span class="k">void (trong kiểu hàm)</span><span class="v">“Người gọi sẽ bỏ qua kết quả”, nên hàm có trả giá trị vẫn vừa.</span></div>
  <div class="kv"><span class="k">unhandled rejection (promise bị từ chối không ai xử lý)</span><span class="v">Promise bị reject mà không ai await hay catch. Node ≥ 15 mặc định thoát với mã 1.</span></div>
  <div class="kv"><span class="k">floating promise (promise trôi nổi)</span><span class="v">Promise được tạo rồi bỏ đó — kết quả lẫn lỗi của nó đều mất.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Trả về union (<code>number | number[]</code>) bắt mọi người gọi phải thu hẹp (TS2322). Overload cho mỗi dáng gọi một kiểu trả về riêng.</li>
<li>Người gọi chỉ thấy chữ ký overload — <code>.d.ts</code> cho thấy chữ ký cài đặt biến mất, nên đối số union không khớp gì (TS2769).</li>
<li>Overload được thử từ trên xuống: đặt cái cụ thể trước. Và chúng chỉ được kiểm lỏng với thân hàm: overload có thể hứa <code>number</code> trong khi thân trả <code>undefined</code>.</li>
<li>Trả về như nhau với mọi đối số ⇒ tham số union; trả về tính từ đối số ⇒ generic; vài trường hợp cố định ⇒ overload.</li>
<li><code>=&gt; void</code> trong kiểu callback nghĩa là “bỏ qua kết quả”: <code>log.push</code> vừa, còn <code>function f(): void</code> khai báo thì không được return. Hàm async cũng vừa — và rejection của nó không ai xử lý: tsc 0 lỗi, Node thoát mã 1. Hãy await việc async trong <code>for…of</code>.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — More on Functions', 'Function overloads, chữ ký cài đặt, “ưu tiên union khi được”, và “Return type void”. Đọc ngày 1/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/functions.html')}
${nguon('🟩', 'Tài liệu Node.js — CLI: --unhandled-rejections', 'Chế độ mặc định đổi thành throw từ v15.0.0: một unhandled rejection kết thúc tiến trình. Đọc ngày 1/11/2026.', 'https://nodejs.org/api/cli.html')}
${nguon('🟦', 'MDN — Array.prototype.forEach()', '“forEach() expects a synchronous function — it does not wait for promises.” Đọc ngày 1/11/2026.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach')}
${nguon('🧹', 'typescript-eslint — no-misused-promises', 'Luật lint báo hàm trả Promise nằm ở chỗ cần void. Đọc ngày 1/11/2026.', 'https://typescript-eslint.io/rules/no-misused-promises/')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-1-4-bat-dong-bo', title: 'Cùng kiểu sập ở khoá Node.js — 1.4: Bất đồng bộ (Lỗi 4)', sub: 'Giống: một Promise bị reject không ai xử lý làm tiến trình Node kết thúc, và arr.forEach(async …) không chờ gì cả. Khác: ở đây bạn thấy vì sao TypeScript để lọt — chỗ callback void nhận cả hàm async — và cách gõ kiểu, await chỗ đó để lỗi rơi vào try/catch của bạn.', cta: 'MỞ BÀI NODE.JS →' })}
</div>
`,
};
