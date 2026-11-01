/**
 * TypeScript · Chương 3 · 3.4 — this: tham số bạn không biết mình có. Slug giữ: typescript-3-4-this.
 * Soạn lại 01/11/2026 (sau Ch2 d475d192d). Mọi code/output lấy từ ./_ma-ts-03-4.mjs (sinh từ labflow-ts chạy thật: Node 22.23.3, tsc 7.0.2).
 * Số đo chính: tách method khỏi object ⇒ tsc 0 lỗi, Node TypeError (ESM là strict mode, this = undefined); TS2683 (noImplicitThis) vs 0 lỗi khi tắt;
 * tham số this ⇒ TS2684 cho lời gọi trần, NHƯNG [x].map(v.run) và setTimeout(v.run) vẫn 0 lỗi rồi sập (timer: this là đối tượng Timeout,
 * "this.rules is not iterable"); kiểu callback khai this: void ⇒ TS2345; arrow trong object literal ⇒ TS2532 + sập; run.length = 1 (this bị xoá).
 * Bản cũ dùng class Counter + "website này dùng arrow property" (không kiểm được) ⇒ thay bằng validator LabFlow; class để Ch14.
 */
import G from '../giang/ts-03-4.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-03-4.mjs';

// Bỏ các dòng ngăn xếp nội bộ của Node (ModuleJob, timers…) và dòng "Node.js v22…" — không sửa chữ nào khác.
const bo = (s) => s.split('\n').filter((l) => !/^\s+at (ModuleJob|async |listOnTimeout|process\.)|^Node\.js v/.test(l)).join('\n').replace(/\n+$/, '');
const L = (s) => s.split('\n');
const LOST_OBJ = L(CODE.lostValidator).slice(13, 25).join('\n');
const LOST_RUN = bo(OUT['12-lost-run']);
const PARAM_TYPE = L(CODE.paramValidator).slice(5, 10).join('\n');
const PARAM_TSC = L(OUT['15-param-tsc']);
const TSC_2684 = [PARAM_TSC[0], PARAM_TSC[4]].join('\n');
const TSC_2345 = PARAM_TSC.slice(0, 4).join('\n');
const PARAM_RUN = OUT['16-param-run'];
const TIMER = bo(OUT['17-timer']);
const ARROW_OBJ = L(CODE.arrow).slice(6, 17).join('\n');
const ARROW_RUN = bo(OUT['19-arrow-run']);
const FIX_FN = L(CODE.fixValidator).slice(5, 20).join('\n');
const FORM = L(CODE.form).slice(5, 15).join('\n');
const PR_START = bo(OUT['22-pr-start']);
const PR_STEP1 = bo(OUT['23-pr-step1']);
const PR_STEP1_TYPE = L(CODE.prStep1).slice(3, 4).join('\n');
const PR_SOL_LINE = L(CODE.prSol).slice(21, 22).join('\n');

const BANG_AI_EN = `<table>
<thead><tr><th>How the function is called</th><th>What <code>this</code> is (measured, Node 22, ES module)</th></tr></thead>
<tbody>
<tr><td><code>validator.run(bad)</code> — a method call</td><td>the object before the dot: <code>validator</code></td></tr>
<tr><td><code>run(bad)</code> — a plain call</td><td><code>undefined</code> (modules run in strict mode) ⇒ TypeError</td></tr>
<tr><td><code>validator.run.call(validator, bad)</code></td><td>the first argument of <code>call</code></td></tr>
<tr><td><code>validator.run.bind(validator)</code></td><td>fixed to <code>validator</code> forever</td></tr>
<tr><td><code>[bad].map(validator.run)</code></td><td><code>undefined</code>, unless you pass map’s second argument</td></tr>
<tr><td><code>setTimeout(validator.run, 0, bad)</code></td><td>Node’s own <code>Timeout</code> object (stack: <code>Timeout.run</code>)</td></tr>
<tr><td>an arrow function</td><td>whatever <code>this</code> was <em>where the arrow was written</em></td></tr>
</tbody>
</table>`;
const BANG_AI_VI = `<table>
<thead><tr><th>Hàm được gọi thế nào</th><th><code>this</code> là gì (đo thật, Node 22, ES module)</th></tr></thead>
<tbody>
<tr><td><code>validator.run(bad)</code> — gọi kiểu method</td><td>object đứng trước dấu chấm: <code>validator</code></td></tr>
<tr><td><code>run(bad)</code> — gọi trần</td><td><code>undefined</code> (module chạy ở strict mode) ⇒ TypeError</td></tr>
<tr><td><code>validator.run.call(validator, bad)</code></td><td>đối số đầu tiên của <code>call</code></td></tr>
<tr><td><code>validator.run.bind(validator)</code></td><td>bị gắn cứng vào <code>validator</code></td></tr>
<tr><td><code>[bad].map(validator.run)</code></td><td><code>undefined</code>, trừ khi bạn truyền đối số thứ hai của map</td></tr>
<tr><td><code>setTimeout(validator.run, 0, bad)</code></td><td>đối tượng <code>Timeout</code> của chính Node (ngăn xếp: <code>Timeout.run</code>)</td></tr>
<tr><td>một arrow function</td><td><code>this</code> của <em>nơi arrow được viết ra</em></td></tr>
</tbody>
</table>`;

const BANG_FIX_EN = `<table>
<thead><tr><th>Situation</th><th>Fix</th><th>Cost</th></tr></thead>
<tbody>
<tr><td>You write the object yourself</td><td><strong>No <code>this</code> at all</strong>: a factory that keeps the data in a closure</td><td>none — works with any call style</td></tr>
<tr><td>You must keep a method (library, existing code)</td><td>Declare <code>this: Validator</code> so direct calls are checked</td><td>callbacks (<code>map</code>, timers) still slip through</td></tr>
<tr><td>You pass a method as a callback</td><td>Wrap it: <code>(b) =&gt; validator.run(b)</code></td><td>one tiny arrow</td></tr>
<tr><td>You cannot wrap (API wants the function itself)</td><td><code>validator.run.bind(validator)</code> or map’s <code>thisArg</code></td><td>a new function per <code>bind</code></td></tr>
<tr><td>You write the API that receives callbacks</td><td>Type the callback <code>(this: void, …) =&gt; …</code></td><td>none — methods needing an object are refused (TS2345)</td></tr>
</tbody>
</table>`;
const BANG_FIX_VI = `<table>
<thead><tr><th>Tình huống</th><th>Cách sửa</th><th>Cái giá</th></tr></thead>
<tbody>
<tr><td>Bạn tự viết object</td><td><strong>Không dùng <code>this</code></strong>: hàm tạo giữ dữ liệu trong closure</td><td>không có — gọi kiểu nào cũng đúng</td></tr>
<tr><td>Buộc phải giữ method (thư viện, code có sẵn)</td><td>Khai <code>this: Validator</code> để lời gọi trực tiếp được kiểm</td><td>callback (<code>map</code>, timer) vẫn lọt</td></tr>
<tr><td>Bạn truyền method làm callback</td><td>Bọc lại: <code>(b) =&gt; validator.run(b)</code></td><td>một arrow nhỏ</td></tr>
<tr><td>Không bọc được (API cần đúng hàm đó)</td><td><code>validator.run.bind(validator)</code> hoặc <code>thisArg</code> của map</td><td>mỗi lần <code>bind</code> là một hàm mới</td></tr>
<tr><td>Bạn viết API nhận callback</td><td>Gõ kiểu callback <code>(this: void, …) =&gt; …</code></td><td>không có — method cần object bị từ chối (TS2345)</td></tr>
</tbody>
</table>`;

export default {
  title: '3.4 — this: the parameter you did not know you had|||3.4 — this: tham số bạn không biết mình có',
  slug: 'typescript-3-4-this',
  type: 'LESSON',
  isFreePreview: true,
  description: 'this trên validator LabFlow, đo thật: tách method khỏi object thì tsc im lặng còn Node ném TypeError (module ES chạy strict mode, this là undefined); bảng "gọi thế nào thì this là gì" (map ⇒ undefined, setTimeout ⇒ đối tượng Timeout); noImplicitThis (TS2683); tham số this (TS2684, bị xoá lúc chạy: run.length = 1) và giới hạn của nó — map/setTimeout vẫn lọt; kiểu callback this: void (TS2345); bẫy arrow trong object literal (TS2532); bốn cách sửa, cách bền nhất là closure không dùng this.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>this: the parameter you did not know you had</h2>
<p class="lead">Every non-arrow function in JavaScript has a hidden input called <code>this</code>, and — unlike every other input — it is not decided where the function is written but <strong>how it is called</strong>. This lesson takes LabFlow’s validator, calls its <code>run</code> method five different ways, and shows with real output which ways crash, which ones tsc can catch, and which ones it cannot. You finish with a simple rule: give <code>this</code> a type when you must use it, and design it away when you can.</p>

<h3>What you will be able to do, and why it matters</h3>
<ul>
<li><strong>Predict what <code>this</code> is</strong> for a method call, a plain call, <code>call</code>/<code>bind</code>, a callback in <code>map</code>, a timer and an arrow function — from a table of measured results.</li>
<li><strong>Read TS2683 and TS2684</strong> and fix them for the right reason, not by sprinkling <code>any</code>.</li>
<li><strong>Declare a <code>this</code> parameter</strong> — Lab 3’s last wrong use (an extracted <code>run</code>) is refused exactly this way — and know the places it does not reach.</li>
<li><strong>Write callback-taking APIs that refuse unbound methods</strong> (<code>this: void</code>), the way a framework author would.</li>
<li><strong>Avoid <code>this</code> bugs entirely</strong> with a closure. In React class components (FER202) and Express controllers this is the classic “Cannot read properties of undefined” of the demo night.</li>
</ul>

<h3>The validator: a method that reads this</h3>
<p>Lab 3 turns LabFlow’s booking rules into a list of functions (lesson 3.2). Bundling the list with the code that runs it gives an object; its <code>run</code> method loops over <code>this.rules</code>:</p>
${ma('typescript', LOST_OBJ)}
<p>Inside a method written like this, <code>this</code> means “the object the method was called on”. tsc agrees: for a method in an object literal it types <code>this</code> as that object, so <code>this.rules</code> compiles. The catch is the word <em>called</em>.</p>

<h3>Take the method off its object</h3>
<p>Nothing could look more harmless than storing a function in a variable before calling it:</p>
${ma('typescript', CODE.lostRun)}
${ra(OUT['11-lost-tsc'])}
${ra(LOST_RUN)}
<p>tsc: zero errors. Node: the first call works, the second crashes. <code>const run = validator.run</code> copies the <em>function</em>, not the link to <code>validator</code>. Called as <code>run(bad)</code> there is no object before the dot, so <code>this</code> is <code>undefined</code> — ES modules (every <code>.ts</code> file in this course) always run in strict mode, where a plain call gets <code>undefined</code> instead of the global object. Here is the complete rule, measured for each case in this lesson:</p>
${BANG_AI_EN}

<h3>noImplicitThis: when tsc cannot know</h3>
<p>Write the same loop as a plain function and tsc has no object to infer <code>this</code> from:</p>
${ma('typescript', CODE.plain)}
${ra(OUT['13-implicit'])}
<p>TS2683 comes from <code>noImplicitThis</code>, one of the flags <code>strict</code> switches on. Turn only that flag off and the same file is “clean”:</p>
${ma('json', CODE.loose)}
${ra(OUT['14-implicit-loose'])}
<p>“Clean” here means <code>this</code> silently became <code>any</code> — the off switch from lesson 1.4 — so <code>this.rules</code>, <code>this.rulez</code> and <code>this.anything</code> all compile. Keep <code>strict</code> on and answer the question tsc asked.</p>

<h3>The this parameter: say what this must be</h3>
<p>TypeScript lets you declare <code>this</code> as a fake <strong>first parameter</strong>. It is not an argument — callers never pass it — it is a rule about how the function may be called:</p>
${ma('typescript', PARAM_TYPE)}
${ma('typescript', CODE.paramUse)}
${ra(TSC_2684)}
<p>Of the six calls, tsc refuses exactly one: the plain <code>run(bad)</code>. Read the message: the call supplies a <code>this</code> of type <code>void</code> (nothing in front of the dot), the method requires a <code>Validator</code>. Method call, <code>call</code> and <code>bind</code> all pass — <code>strict</code> also includes <code>strictBindCallApply</code>, so <code>call</code> checks its arguments too (a quick extra run: <code>validator.run.call({}, bad)</code> is TS2739, “Type '{}' is missing the following properties from type 'Validator'”). And the parameter is pure type information: Node strips it, so the function still has one real parameter.</p>
${ma('typescript', CODE.paramRun)}
${ra(PARAM_RUN)}

<div class="pitfall co-tieu-de">
<p><strong>Trap — the this parameter does not protect callbacks.</strong> Look again at the last two lines of <code>use.ts</code>: <code>[bad, bad].map(validator.run)</code> and <code>setTimeout(validator.run, 0, bad)</code>. tsc reported nothing for them. At runtime the <code>map</code> version throws (table above), and the timer version takes the whole process down:</p>
${ma('typescript', CODE.timer)}
${ra(TIMER)}
<p>Exit code 1, and a different message: Node calls timer callbacks with its own <code>Timeout</code> object as <code>this</code> (<code>at Timeout.run</code> in the stack), which has no <code>rules</code>, so <code>for…of</code> gets <code>undefined</code>. Why does tsc stay silent? The callback types of <code>map</code> and <code>setTimeout</code> do not declare any <code>this</code>, and a function type that says nothing about <code>this</code> does not check it. The <code>this</code> parameter only guards calls tsc can see — the plain call in your own code.</p>
</div>

<h3>The API side: promise this: void</h3>
<p>If <em>you</em> write the function that receives callbacks — a form library, an event bus, an Express-style <code>onSubmit</code> — you can close that hole. Declare in the callback type that you will call it with no object:</p>
${ma('typescript', FORM)}
${ra(TSC_2345)}
<p>Now a method that needs its object is refused where it is registered (TS2345, with the reason “The 'this' types of each signature are incompatible”), while the arrow wrapper on the last line passes. This is the type-level version of the lint rule <code>@typescript-eslint/unbound-method</code>, which flags passing a method without its object.</p>

<h3>“Just use an arrow function” — not in an object literal</h3>
<p>Arrow functions have no <code>this</code> of their own: they use the <code>this</code> of the place they are <em>written</em>. That is why they make good callbacks. It is also why this “fix” fails:</p>
${ma('typescript', ARROW_OBJ)}
${ra(OUT['18-arrow-tsc'])}
${ra(ARROW_RUN)}
<p>The arrow is written at the top level of a module, where <code>this</code> is <code>undefined</code> — tsc knows it (TS2532, “Object is possibly 'undefined'”) and Node confirms it. An object literal does not create a <code>this</code> for arrows inside it. (Arrows as class properties behave differently — Chapter 14.)</p>

<h3>The sturdiest fix: no this at all</h3>
<p>Ask why <code>run</code> needed <code>this</code>: only to reach the rules. A factory function can keep them in a <strong>closure</strong> (lesson 3.2) instead:</p>
${ma('typescript', FIX_FN)}
${ma('typescript', CODE.fixRun)}
${ra(OUT['20-fix-tsc'])}
${ra(OUT['21-fix-run'])}
<p>Extracted, inside <code>map</code>, inside a timer — every call style works, because <code>run</code> never asks who called it. Whenever the code is yours, prefer this design. Lab 3 keeps <code>run</code> as a method on purpose, so that you practise the <code>this</code> parameter; <code>this</code> comes back properly with classes in Chapter 14.</p>
${BANG_FIX_EN}

<h3>🗺 Who is this? Ask how the function is called</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Arrow?</div><div class="lz-d">this of the place it was written — never of the call</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">obj.f() / call / bind?</div><div class="lz-d">that object; tsc checks it if f declares this</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Plain f()?</div><div class="lz-d">undefined in a module: TypeError; tsc says TS2684 if f declares this</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Handed to someone else?</div><div class="lz-d">whatever they choose (undefined, a Timeout…) — tsc only helps if their type says this: void</div></div>
</div>

<h3>Coming from Java</h3>
<p>In Java (PRO192, Spring) <code>this</code> inside a method is always the object, and a method reference <code>validator::run</code> stays attached to <code>validator</code>. JavaScript has no such guarantee: <code>validator.run</code> without parentheses is a detached function. When a Java habit says “pass the method”, in TypeScript write the arrow <code>(b) =&gt; validator.run(b)</code>.</p>

<h3>💼 Interview corner</h3>
<p><strong>“Why does <code>setTimeout(obj.method, 100)</code> lose <code>this</code>, and how do you fix it?”</strong> — <code>this</code> is set by the call; the timer calls the function without <code>obj</code> in front (Node even passes its <code>Timeout</code> object). Fix: <code>setTimeout(() =&gt; obj.method(), 100)</code>, or <code>bind</code>, or design <code>method</code> without <code>this</code>.</p>
<p><strong>“What does a <code>this</code> parameter compile to?”</strong> — Nothing: it is erased (<code>run.length</code> is still 1). It only lets tsc check direct calls (TS2684) and assignments to function types that declare <code>this</code> (TS2345).</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p><code>demo3/ts-03-4/practice/start/report.ts</code> collects the problems of one booking into a small report object and prints it:</p>
${ma('typescript', CODE.prStart)}
${ra(PR_START)}
<ol>
<li>tsc is clean and Node crashes. Explain in one sentence which call lost <code>this</code>.</li>
<li>Add <code>this: Report</code> to <code>add</code> and <code>print</code> in the <code>Report</code> type. Run tsc again — predict first: will it now refuse the bug?</li>
<li>Fix the call so the report prints both problems.</li>
</ol>
<p><strong>Solution and real output.</strong> Step 1: <code>forEach(report.add)</code> hands <code>add</code> to <code>forEach</code>, which calls it as a plain function — <code>this</code> is <code>undefined</code>. Step 2 — the new type line:</p>
${ma('typescript', PR_STEP1_TYPE)}
${ra(PR_STEP1)}
<p>Still zero errors and still the crash: <code>forEach</code>’s callback type declares no <code>this</code>, exactly the trap above. Step 3 — call <code>add</code> on the report:</p>
${ma('typescript', PR_SOL_LINE)}
${ra(OUT['24-pr-sol'])}
<p><strong>Done when:</strong> you predicted step 2 correctly (tsc stays silent) and the solution prints the title and both lines. Code Lab has three more exercises: make tsc refuse an extracted method (TS2684), rewrite a validator with no <code>this</code> so it survives <code>map</code> and <code>setTimeout</code>, and type a handler API with <code>this: void</code> (TS2345).</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">this</span><span class="v">A hidden input of every non-arrow function, set by how it is called.</span></div>
  <div class="kv"><span class="k">method call</span><span class="v"><code>obj.f()</code>: <code>this</code> is <code>obj</code>. Without the dot and parentheses together, the link is gone.</span></div>
  <div class="kv"><span class="k">noImplicitThis (TS2683)</span><span class="v">Strict flag: refuses a <code>this</code> whose type tsc cannot know, instead of making it <code>any</code>.</span></div>
  <div class="kv"><span class="k">this parameter (TS2684)</span><span class="v"><code>f(this: T, …)</code>: a type-only first parameter; plain calls are refused. Erased at runtime.</span></div>
  <div class="kv"><span class="k">this: void</span><span class="v">In a callback type: “I will call you with no object” — methods needing one are refused (TS2345).</span></div>
  <div class="kv"><span class="k">bind / thisArg</span><span class="v">Ways to fix <code>this</code> from outside: <code>f.bind(obj)</code>, <code>arr.map(f, obj)</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>this</code> is decided by the call: method call ⇒ the object; plain call in a module ⇒ <code>undefined</code>; Node timer ⇒ a <code>Timeout</code> object; arrow ⇒ where it was written.</li>
<li><code>const run = validator.run; run(bad)</code> compiles with no errors and crashes; strict’s <code>noImplicitThis</code> only complains when <code>this</code> cannot be inferred (TS2683).</li>
<li>A <code>this</code> parameter makes plain calls a compile error (TS2684) and costs nothing at runtime (<code>run.length</code> = 1) — but <code>map(v.run)</code> and <code>setTimeout(v.run)</code> still pass tsc and crash.</li>
<li>API authors close that hole with <code>(this: void, …) =&gt; …</code> callback types (TS2345 on <code>onSubmit(validator.run)</code>).</li>
<li>An arrow inside an object literal does not see the object (TS2532). The sturdiest design keeps data in a closure and uses no <code>this</code>.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — More on Functions: Declaring this in a Function', 'The this parameter and why arrow functions cannot use it. Read 1 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/functions.html')}
${nguon('⚙️', 'TSConfig reference — noImplicitThis', 'The strict flag behind TS2683. Read 1 Nov 2026.', 'https://www.typescriptlang.org/tsconfig/#noImplicitThis')}
${nguon('🟦', 'MDN — this', 'How this is set for method calls, plain calls in strict mode, callbacks and arrow functions. Read 1 Nov 2026.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this')}
${nguon('🟦', 'MDN — Function.prototype.bind()', 'Creating a function whose this is fixed. Read 1 Nov 2026.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind')}
${nguon('🧹', 'typescript-eslint — unbound-method', '“Enforce unbound methods are called with their expected scope” — the lint rule for the callback hole. Read 1 Nov 2026.', 'https://typescript-eslint.io/rules/unbound-method/')}
${lienKet({ khoa: 'react', bai: 'rx-2-2-su-kien', title: 'The same lost this in React — React 2.2: Events', sub: 'Same: a method handed over as a callback (onClick={this.handleClick} in a FER202 class component) loses this and throws “Cannot read properties of undefined”, fixed with bind or an arrow. Different: here you see why — this is set by the call — measure it in Node, and let tsc refuse the plain call with a this parameter; React function components avoid this entirely, like the closure fix.', cta: 'OPEN REACT LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>this: tham số bạn không biết mình có</h2>
<p class="lead">Mọi hàm không phải arrow trong JavaScript đều có một đầu vào ẩn tên là <code>this</code>, và — khác mọi đầu vào khác — nó không được quyết định ở nơi hàm được viết mà ở <strong>cách hàm được gọi</strong>. Bài này lấy validator của LabFlow, gọi method <code>run</code> của nó theo năm cách, và cho bạn thấy bằng output thật cách nào sập, cách nào tsc bắt được, cách nào tsc chịu thua. Cuối bài bạn có một quy tắc đơn giản: phải dùng <code>this</code> thì cho nó một kiểu, tránh được thì thiết kế để khỏi cần nó.</p>

<h3>Học xong bạn làm được gì, và vì sao có ích</h3>
<ul>
<li><strong>Đoán đúng <code>this</code> là gì</strong> với lời gọi method, lời gọi trần, <code>call</code>/<code>bind</code>, callback trong <code>map</code>, timer và arrow function — từ một bảng kết quả đo thật.</li>
<li><strong>Đọc TS2683 và TS2684</strong> và sửa đúng nguyên nhân, không rắc <code>any</code>.</li>
<li><strong>Khai báo tham số <code>this</code></strong> — cách dùng sai cuối cùng của Lab 3 (một <code>run</code> bị tách ra) bị từ chối đúng bằng cách này — và biết những chỗ nó không với tới.</li>
<li><strong>Viết API nhận callback mà từ chối method bị tách</strong> (<code>this: void</code>), như người viết framework.</li>
<li><strong>Né hẳn bug <code>this</code></strong> bằng closure. Trong class component React (FER202) và controller Express, đây chính là lỗi “Cannot read properties of undefined” kinh điển của đêm trước buổi demo.</li>
</ul>

<h3>Validator: một method đọc this</h3>
<p>Lab 3 biến các luật đặt phòng của LabFlow thành một danh sách hàm (bài 3.2). Gói danh sách đó cùng đoạn code chạy nó thì được một object; method <code>run</code> của nó lặp qua <code>this.rules</code>:</p>
${ma('typescript', LOST_OBJ)}
<p>Trong một method viết như thế, <code>this</code> nghĩa là “object mà method được gọi trên đó”. tsc đồng ý: với method trong object literal, nó gán kiểu <code>this</code> là chính object đó, nên <code>this.rules</code> biên dịch được. Vấn đề nằm ở chữ <em>được gọi</em>.</p>

<h3>Tách method khỏi object</h3>
<p>Chẳng gì vô hại hơn việc cất một hàm vào biến trước khi gọi:</p>
${ma('typescript', CODE.lostRun)}
${ra(OUT['11-lost-tsc'])}
${ra(LOST_RUN)}
<p>tsc: không lỗi nào. Node: lời gọi đầu chạy, lời gọi thứ hai sập. <code>const run = validator.run</code> chép <em>hàm</em>, không chép mối liên kết với <code>validator</code>. Gọi <code>run(bad)</code> thì trước dấu chấm không có object nào, nên <code>this</code> là <code>undefined</code> — ES module (mọi tệp <code>.ts</code> trong khoá này) luôn chạy ở strict mode, nơi lời gọi trần nhận <code>undefined</code> thay vì đối tượng toàn cục. Đây là quy tắc đầy đủ, đo thật cho từng trường hợp trong bài:</p>
${BANG_AI_VI}

<h3>noImplicitThis: khi tsc không thể biết</h3>
<p>Viết cùng vòng lặp đó thành hàm thường thì tsc không có object nào để suy ra <code>this</code>:</p>
${ma('typescript', CODE.plain)}
${ra(OUT['13-implicit'])}
<p>TS2683 đến từ <code>noImplicitThis</code>, một trong các cờ mà <code>strict</code> bật lên. Chỉ tắt riêng cờ đó thì cùng tệp thành “sạch”:</p>
${ma('json', CODE.loose)}
${ra(OUT['14-implicit-loose'])}
<p>“Sạch” ở đây nghĩa là <code>this</code> lặng lẽ thành <code>any</code> — công tắc tắt kiểm ở bài 1.4 — nên <code>this.rules</code>, <code>this.rulez</code> hay <code>this.gìcũngđược</code> đều biên dịch. Hãy giữ <code>strict</code> và trả lời câu hỏi tsc đặt ra.</p>

<h3>Tham số this: nói rõ this phải là gì</h3>
<p>TypeScript cho bạn khai <code>this</code> như một <strong>tham số đầu tiên</strong> giả. Nó không phải đối số — người gọi không bao giờ truyền nó — mà là một luật về cách hàm được phép gọi:</p>
${ma('typescript', PARAM_TYPE)}
${ma('typescript', CODE.paramUse)}
${ra(TSC_2684)}
<p>Trong sáu lời gọi, tsc từ chối đúng một: lời gọi trần <code>run(bad)</code>. Đọc thông báo: lời gọi đưa vào <code>this</code> kiểu <code>void</code> (trước dấu chấm không có gì), còn method đòi một <code>Validator</code>. Gọi kiểu method, <code>call</code> và <code>bind</code> đều qua — <code>strict</code> còn gồm <code>strictBindCallApply</code>, nên <code>call</code> cũng kiểm các đối số của nó (chạy thêm một lần: <code>validator.run.call({}, bad)</code> ra TS2739, “Type '{}' is missing the following properties from type 'Validator'”). Và tham số này thuần là thông tin kiểu: Node bóc nó đi, hàm vẫn chỉ có một tham số thật.</p>
${ma('typescript', CODE.paramRun)}
${ra(PARAM_RUN)}

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — tham số this không bảo vệ callback.</strong> Nhìn lại hai dòng cuối của <code>use.ts</code>: <code>[bad, bad].map(validator.run)</code> và <code>setTimeout(validator.run, 0, bad)</code>. tsc không báo gì cho chúng. Lúc chạy, bản <code>map</code> ném lỗi (bảng ở trên), còn bản timer kéo sập cả tiến trình:</p>
${ma('typescript', CODE.timer)}
${ra(TIMER)}
<p>Exit code 1, và thông báo khác hẳn: Node gọi callback của timer với đối tượng <code>Timeout</code> của chính nó làm <code>this</code> (<code>at Timeout.run</code> trong ngăn xếp), đối tượng đó không có <code>rules</code>, nên <code>for…of</code> nhận <code>undefined</code>. Vì sao tsc im lặng? Kiểu callback của <code>map</code> và <code>setTimeout</code> không khai <code>this</code> nào, và một kiểu hàm không nói gì về <code>this</code> thì không kiểm nó. Tham số <code>this</code> chỉ canh những lời gọi tsc nhìn thấy — lời gọi trần trong code của chính bạn.</p>
</div>

<h3>Phía API: hứa this: void</h3>
<p>Nếu <em>bạn</em> viết hàm nhận callback — một thư viện form, một event bus, một <code>onSubmit</code> kiểu Express — bạn bịt được lỗ hổng đó. Khai trong kiểu callback rằng bạn sẽ gọi nó mà không có object:</p>
${ma('typescript', FORM)}
${ra(TSC_2345)}
<p>Giờ method cần object bị từ chối ngay chỗ đăng ký (TS2345, kèm lý do “The 'this' types of each signature are incompatible”), còn arrow bọc ở dòng cuối thì qua. Đây là phiên bản ở tầng kiểu của luật lint <code>@typescript-eslint/unbound-method</code>, luật đánh dấu việc truyền method mà thiếu object của nó.</p>

<h3>“Cứ dùng arrow function” — nhưng không phải trong object literal</h3>
<p>Arrow function không có <code>this</code> riêng: nó dùng <code>this</code> của nơi nó được <em>viết ra</em>. Vì thế arrow làm callback rất tốt. Cũng vì thế mà “cách sửa” này hỏng:</p>
${ma('typescript', ARROW_OBJ)}
${ra(OUT['18-arrow-tsc'])}
${ra(ARROW_RUN)}
<p>Arrow được viết ở tầng ngoài cùng của module, nơi <code>this</code> là <code>undefined</code> — tsc biết (TS2532, “Object is possibly 'undefined'”) và Node xác nhận. Object literal không tạo ra <code>this</code> cho các arrow bên trong nó. (Arrow làm thuộc tính của class thì khác — Chương 14.)</p>

<h3>Cách sửa bền nhất: không dùng this</h3>
<p>Hỏi xem vì sao <code>run</code> cần <code>this</code>: chỉ để với tới danh sách luật. Một hàm tạo có thể giữ chúng trong <strong>closure</strong> (bài 3.2):</p>
${ma('typescript', FIX_FN)}
${ma('typescript', CODE.fixRun)}
${ra(OUT['20-fix-tsc'])}
${ra(OUT['21-fix-run'])}
<p>Tách ra, trong <code>map</code>, trong timer — kiểu gọi nào cũng chạy, vì <code>run</code> không bao giờ hỏi ai gọi nó. Khi code là của bạn, hãy ưu tiên thiết kế này. Lab 3 cố ý giữ <code>run</code> là method để bạn luyện tham số <code>this</code>; <code>this</code> quay lại đàng hoàng cùng class ở Chương 14.</p>
${BANG_FIX_VI}

<h3>🗺 this là ai? Hỏi xem hàm được gọi thế nào</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Là arrow?</div><div class="lz-d">this của nơi nó được viết — không bao giờ của lời gọi</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">obj.f() / call / bind?</div><div class="lz-d">object đó; tsc kiểm nếu f khai this</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Gọi trần f()?</div><div class="lz-d">undefined trong module: TypeError; tsc báo TS2684 nếu f khai this</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Đưa cho người khác gọi?</div><div class="lz-d">họ chọn gì thì là nấy (undefined, một Timeout…) — tsc chỉ giúp nếu kiểu của họ ghi this: void</div></div>
</div>

<h3>Nếu bạn đến từ Java</h3>
<p>Trong Java (PRO192, Spring), <code>this</code> trong method luôn là object, và method reference <code>validator::run</code> vẫn gắn với <code>validator</code>. JavaScript không có bảo đảm đó: <code>validator.run</code> không kèm ngoặc là một hàm đã bị tách. Khi thói quen Java bảo “truyền method đi”, trong TypeScript hãy viết arrow <code>(b) =&gt; validator.run(b)</code>.</p>

<h3>💼 Góc phỏng vấn</h3>
<p><strong>“Vì sao <code>setTimeout(obj.method, 100)</code> mất <code>this</code>, sửa thế nào?”</strong> — <code>this</code> do lời gọi quyết định; timer gọi hàm mà không có <code>obj</code> phía trước (Node còn truyền đối tượng <code>Timeout</code> của nó). Sửa: <code>setTimeout(() =&gt; obj.method(), 100)</code>, hoặc <code>bind</code>, hoặc thiết kế <code>method</code> không dùng <code>this</code>.</p>
<p><strong>“Tham số <code>this</code> biên dịch ra gì?”</strong> — Không gì cả: nó bị xoá (<code>run.length</code> vẫn là 1). Nó chỉ cho tsc kiểm lời gọi trực tiếp (TS2684) và phép gán vào kiểu hàm có khai <code>this</code> (TS2345).</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<p><code>demo3/ts-03-4/practice/start/report.ts</code> gom các lỗi của một lượt đặt vào một object báo cáo nhỏ rồi in ra:</p>
${ma('typescript', CODE.prStart)}
${ra(PR_START)}
<ol>
<li>tsc sạch còn Node sập. Giải thích trong một câu lời gọi nào đã mất <code>this</code>.</li>
<li>Thêm <code>this: Report</code> cho <code>add</code> và <code>print</code> trong kiểu <code>Report</code>. Chạy lại tsc — đoán trước: giờ nó có từ chối con bug không?</li>
<li>Sửa lời gọi để báo cáo in ra cả hai lỗi.</li>
</ol>
<p><strong>Lời giải và output thật.</strong> Bước 1: <code>forEach(report.add)</code> đưa <code>add</code> cho <code>forEach</code>, và <code>forEach</code> gọi nó như hàm trần — <code>this</code> là <code>undefined</code>. Bước 2 — dòng kiểu mới:</p>
${ma('typescript', PR_STEP1_TYPE)}
${ra(PR_STEP1)}
<p>Vẫn không lỗi nào và vẫn sập: kiểu callback của <code>forEach</code> không khai <code>this</code>, đúng cái bẫy ở trên. Bước 3 — gọi <code>add</code> trên chính report:</p>
${ma('typescript', PR_SOL_LINE)}
${ra(OUT['24-pr-sol'])}
<p><strong>Đạt khi:</strong> bạn đoán đúng bước 2 (tsc vẫn im lặng) và lời giải in ra tiêu đề cùng hai dòng. Code Lab có thêm ba bài: bắt tsc từ chối method bị tách (TS2684), viết lại validator không dùng <code>this</code> để nó sống sót qua <code>map</code> và <code>setTimeout</code>, và gõ kiểu API handler với <code>this: void</code> (TS2345).</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">this</span><span class="v">Đầu vào ẩn của mọi hàm không phải arrow, do cách gọi quyết định.</span></div>
  <div class="kv"><span class="k">method call (gọi kiểu method)</span><span class="v"><code>obj.f()</code>: <code>this</code> là <code>obj</code>. Thiếu dấu chấm và ngoặc đi cùng nhau là mất liên kết.</span></div>
  <div class="kv"><span class="k">noImplicitThis (TS2683)</span><span class="v">Cờ của strict: từ chối <code>this</code> mà tsc không biết kiểu, thay vì cho nó thành <code>any</code>.</span></div>
  <div class="kv"><span class="k">this parameter (tham số this, TS2684)</span><span class="v"><code>f(this: T, …)</code>: tham số đầu chỉ có ở tầng kiểu; lời gọi trần bị từ chối. Bị xoá lúc chạy.</span></div>
  <div class="kv"><span class="k">this: void</span><span class="v">Trong kiểu callback: “tôi sẽ gọi bạn không kèm object” — method cần object bị từ chối (TS2345).</span></div>
  <div class="kv"><span class="k">bind / thisArg</span><span class="v">Cách gắn <code>this</code> từ bên ngoài: <code>f.bind(obj)</code>, <code>arr.map(f, obj)</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>this</code> do lời gọi quyết định: gọi kiểu method ⇒ object; gọi trần trong module ⇒ <code>undefined</code>; timer của Node ⇒ một đối tượng <code>Timeout</code>; arrow ⇒ nơi nó được viết.</li>
<li><code>const run = validator.run; run(bad)</code> biên dịch không lỗi và sập; <code>noImplicitThis</code> của strict chỉ kêu khi <code>this</code> không suy ra được (TS2683).</li>
<li>Tham số <code>this</code> biến lời gọi trần thành lỗi biên dịch (TS2684) và không tốn gì lúc chạy (<code>run.length</code> = 1) — nhưng <code>map(v.run)</code> và <code>setTimeout(v.run)</code> vẫn qua tsc rồi sập.</li>
<li>Người viết API bịt lỗ hổng đó bằng kiểu callback <code>(this: void, …) =&gt; …</code> (TS2345 cho <code>onSubmit(validator.run)</code>).</li>
<li>Arrow trong object literal không thấy object (TS2532). Thiết kế bền nhất giữ dữ liệu trong closure và không dùng <code>this</code>.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — More on Functions: Declaring this in a Function', 'Tham số this và vì sao arrow function không dùng được nó. Đọc ngày 01/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/functions.html')}
${nguon('⚙️', 'TSConfig reference — noImplicitThis', 'Cờ strict đứng sau TS2683. Đọc ngày 01/11/2026.', 'https://www.typescriptlang.org/tsconfig/#noImplicitThis')}
${nguon('🟦', 'MDN — this', 'this được gán thế nào cho lời gọi method, lời gọi trần ở strict mode, callback và arrow function. Đọc ngày 01/11/2026.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this')}
${nguon('🟦', 'MDN — Function.prototype.bind()', 'Tạo một hàm có this bị gắn cố định. Đọc ngày 01/11/2026.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind')}
${nguon('🧹', 'typescript-eslint — unbound-method', '“Enforce unbound methods are called with their expected scope” — luật lint cho lỗ hổng callback. Đọc ngày 01/11/2026.', 'https://typescript-eslint.io/rules/unbound-method/')}
${lienKet({ khoa: 'react', bai: 'rx-2-2-su-kien', title: 'Cùng chuyện mất this trong React — React 2.2: Sự kiện', sub: 'Giống: method bị đưa đi làm callback (onClick={this.handleClick} trong class component FER202) mất this và ném “Cannot read properties of undefined”, sửa bằng bind hoặc arrow. Khác: ở đây bạn thấy vì sao — this do lời gọi quyết định — đo nó trong Node, và để tsc từ chối lời gọi trần bằng tham số this; function component của React né hẳn this, giống cách sửa bằng closure.', cta: 'MỞ BÀI REACT →' })}
</div>
`,
};
