/**
 * TypeScript · Chương 3 · 3.2 — Hàm như một giá trị: kiểu hàm & callback. Slug giữ: typescript-3-2-callback.
 * Soạn lại 01/11/2026 (sau Ch2 d475d192d). Mọi code/output lấy từ ./_ma-ts-03-2.mjs (sinh từ labflow-ts chạy thật: Node 22.23.3, tsc 7.0.2).
 * Bản cũ ghi ['1','2','3'].map(parseInt) = [1, NaN, NaN] (đúng) — bản mới đo trên giờ LabFlow "07,08,09,10" ⇒ [7, NaN, 0, 3].
 */
import G from '../giang/ts-03-2.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-03-2.mjs';

const R = CODE.rules.split('\n');
const RULE_TYPE = R.slice(4, 9).join('\n');
const RULE_VALUES = R.slice(10, 19).join('\n');
const FACTORY = R.slice(20, 25).join('\n');
const VALIDATE = R.slice(26, 34).join('\n');
const CTX = CODE.context.split('\n').slice(4, 12).join('\n');
const DTS = OUT['07-context-dts'].split('\n').slice(1).join('\n');

const BANG_EN = `<table>
<thead><tr><th>The function you put in a <code>Rule</code> slot</th><th>tsc</th><th>Why</th></tr></thead>
<tbody>
<tr><td><code>() =&gt; null</code> — ignores the input</td><td>✅</td><td>a callback may take <strong>fewer</strong> parameters: ignoring an argument cannot break anything</td></tr>
<tr><td><code>(seats: number) =&gt; …</code></td><td>❌ TS2322</td><td>the caller passes a <code>BookingInput</code>, not a number — “Types of parameters … are incompatible”</td></tr>
<tr><td><code>(input, day: string) =&gt; null</code></td><td>❌ TS2322</td><td>it <strong>needs</strong> a second argument the caller never sends — “Target signature provides too few arguments”</td></tr>
<tr><td><code>(input) =&gt; 'TOO_LONG'</code></td><td>❌ TS2322</td><td>the return must fit <code>Problem | null</code></td></tr>
<tr><td><code>(input) =&gt; ({ code: 'TOO_LATE', … })</code></td><td>❌ TS2322</td><td>the return must fit, down to the literal union <code>ProblemCode</code></td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Hàm bạn đặt vào chỗ <code>Rule</code></th><th>tsc</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td><code>() =&gt; null</code> — bỏ qua input</td><td>✅</td><td>callback được nhận <strong>ít</strong> tham số hơn: bỏ qua một đối số không làm hỏng gì</td></tr>
<tr><td><code>(seats: number) =&gt; …</code></td><td>❌ TS2322</td><td>người gọi truyền một <code>BookingInput</code>, không phải số — “Types of parameters … are incompatible”</td></tr>
<tr><td><code>(input, day: string) =&gt; null</code></td><td>❌ TS2322</td><td>nó <strong>cần</strong> đối số thứ hai mà người gọi không bao giờ gửi — “Target signature provides too few arguments”</td></tr>
<tr><td><code>(input) =&gt; 'TOO_LONG'</code></td><td>❌ TS2322</td><td>giá trị trả về phải khớp <code>Problem | null</code></td></tr>
<tr><td><code>(input) =&gt; ({ code: 'TOO_LATE', … })</code></td><td>❌ TS2322</td><td>giá trị trả về phải khớp, tới tận union literal <code>ProblemCode</code></td></tr>
</tbody>
</table>`;

const KHI_EN = `<table>
<thead><tr><th>You need…</th><th>Write</th><th>Avoid</th></tr></thead>
<tbody>
<tr><td>the same callback shape in several places (rules, handlers)</td><td>a named alias: <code>type Rule = (input: BookingInput) =&gt; Problem | null</code></td><td>copying the inline type five times</td></tr>
<tr><td>a one-off callback parameter</td><td>inline: <code>onProblem: (p: Problem) =&gt; void</code></td><td>—</td></tr>
<tr><td>a function that builds configured callbacks</td><td>a factory with an explicit return type: <code>maxSeats(limit: number): Rule</code></td><td>leaving the factory’s return to inference when it is exported</td></tr>
<tr><td>“anything callable”</td><td>almost never what you mean — write the real signature</td><td><code>Function</code> (calls return <code>any</code>)</td></tr>
<tr><td>a library function as a callback</td><td>a wrapper that passes exactly what you mean: <code>(h) =&gt; Number.parseInt(h, 10)</code></td><td><code>.map(parseInt)</code></td></tr>
</tbody>
</table>`;
const KHI_VI = `<table>
<thead><tr><th>Bạn cần…</th><th>Viết</th><th>Tránh</th></tr></thead>
<tbody>
<tr><td>cùng một hình dạng callback ở nhiều chỗ (luật, handler)</td><td>bí danh có tên: <code>type Rule = (input: BookingInput) =&gt; Problem | null</code></td><td>chép kiểu inline năm lần</td></tr>
<tr><td>một tham số callback dùng một lần</td><td>viết inline: <code>onProblem: (p: Problem) =&gt; void</code></td><td>—</td></tr>
<tr><td>một hàm tạo ra các callback đã cấu hình</td><td>factory có kiểu trả về tường minh: <code>maxSeats(limit: number): Rule</code></td><td>để suy luận lo kiểu trả về của factory được export</td></tr>
<tr><td>“cái gì gọi được cũng được”</td><td>gần như không bao giờ là ý bạn — viết chữ ký thật</td><td><code>Function</code> (gọi ra <code>any</code>)</td></tr>
<tr><td>dùng hàm thư viện làm callback</td><td>một hàm bọc truyền đúng thứ bạn muốn: <code>(h) =&gt; Number.parseInt(h, 10)</code></td><td><code>.map(parseInt)</code></td></tr>
</tbody>
</table>`;

export default {
  title: '3.2 — Functions as values: function types & callbacks|||3.2 — Hàm như một giá trị: kiểu hàm & callback',
  slug: 'typescript-3-2-callback',
  type: 'LESSON',
  isFreePreview: true,
  description: 'LabFlow kiểm một yêu cầu đặt phòng bằng MỘT MẢNG HÀM: kiểu hàm type Rule = (input: BookingInput) => Problem | null, validate chạy từng luật, factory maxSeats(limit) trả về luật (closure). Đo thật: trong JavaScript một luật sai hình dạng chạy im lặng (45 chỗ lọt qua, mã lỗi undefined); tsc từ chối bằng TS2322 với từng lý do (sai kiểu tham số, thừa tham số bắt buộc, sai kiểu trả về); ít tham số hơn thì được; suy luận theo ngữ cảnh trong map/filter (filter tự thu hẹp thành Problem[]); kiểu Function cho any lọt lỗi gõ; bẫy "07,08,09,10".map(parseInt) = [7, NaN, 0, 3] mà tsc im lặng; method và property dưới strictFunctionTypes.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Functions as values: function types &amp; callbacks</h2>
<p class="lead">In JavaScript a function is a value: you store it in a variable, put it in an array, pass it to another function, return it from one. This lesson gives such values a type. LabFlow will check a booking request with a <strong>list of rule functions</strong>, and you will see what happens when a teammate adds a rule with the wrong shape — first in JavaScript (it runs, silently wrong), then in TypeScript (refused, with the reason).</p>

<h3>What you will be able to do, and why it matters</h3>
<ul>
<li>Write a <strong>function type</strong> — <code>(input: BookingInput) =&gt; Problem | null</code> — and give it a name.</li>
<li>Read the three ways a callback can fail to fit: wrong parameter, an extra required parameter, wrong return.</li>
<li>Write a function that <strong>returns</strong> a configured function (a factory with a closure) and type it.</li>
<li>Let contextual typing fill in callback parameters in <code>map</code> / <code>filter</code>, and know where it lets a real bug through (<code>map(parseInt)</code>).</li>
</ul>
<p>Why it matters: callbacks are everywhere you will work. Every Express middleware and route handler is a callback, every <code>onClick</code> in React is one, every <code>.map</code> takes one. In Lab 3 you turn LabFlow’s booking rules into exactly the <code>Rule</code> list of this lesson. And “type this callback parameter” is a standard live-coding question in Node.js interviews.</p>

<h3>JavaScript first: a list of rules, and two wrong shapes</h3>
<p>The idea is simple: every rule is a function that looks at one booking request and returns a problem, or <code>null</code> when it is fine. <code>validate</code> runs them all. Two teammates each add a rule — one expects only the number of seats, the other returns a plain string:</p>
${ma('javascript', CODE.js)}
${ra(OUT['02-js'])}
<p>No error, exit code 0 — and two wrong results. <code>seatsOnly</code> receives the whole request object; <code>{…} &gt; 40</code> is <code>false</code>, so 45 seats pass the 40-seat limit. <code>tooLong</code> returns <code>'TOO_LONG'</code>; a string has no <code>code</code>, so the screen shows <code>undefined</code>. Nothing in the code says what a rule must accept or return.</p>

<h3>A function type: say what a rule is</h3>
<p>A function type looks like an arrow function with types instead of a body: <code>(parameters) =&gt; ReturnType</code>. Give it a name with <code>type</code>, like any other type:</p>
${ma('typescript', RULE_TYPE)}
<p>Read it as a sentence: “a <code>Rule</code> takes one <code>BookingInput</code> and returns a <code>Problem</code> or <code>null</code>”. The parameter name <code>input</code> is only documentation — a function whose parameter is called <code>b</code> still fits. Now every rule is a value of that type, and its parameter needs no annotation — the <code>: Rule</code> on the left says what it is (contextual typing, lesson 1.3):</p>
${ma('typescript', RULE_VALUES)}
${ma('typescript', VALIDATE)}
<p><code>validate</code> takes the request and a <code>readonly Rule[]</code> — a read-only array of functions (lesson 2.2). Run it:</p>
${ma('typescript', CODE.run)}
${ra(OUT['01-rules-run'])}

<h3>Which functions fit the slot?</h3>
<p>Now the two JavaScript mistakes, and two more, against the <code>Rule</code> type:</p>
${ma('typescript', CODE.wrong)}
${ra(OUT['03-wrong'])}
<p>Four refusals, all TS2322, each with a different reason on the indented lines. Read nested errors from the <strong>last</strong> line up: “Type 'BookingInput' is not assignable to type 'number'” is the root cause of the first one. Lines 5–6 compile: a rule that ignores its input is fine.</p>
${BANG_EN}
<p>The asymmetry is worth remembering. <strong>Fewer</strong> parameters is safe, because JavaScript simply drops extra arguments — that is why <code>[1, 2].map((x) =&gt; x * 2)</code> compiles although <code>map</code> passes three. <strong>More required</strong> parameters is unsafe, because they would be <code>undefined</code>.</p>

<h3>A function that returns a rule</h3>
<p>“At most 40 seats” in a normal lab, “at most 60” in the lecture hall. Instead of two copies, write a function that <em>builds</em> the rule:</p>
${ma('typescript', FACTORY)}
<p>The arrow returned by <code>maxSeats</code> is created inside the call, so it still sees <code>limit</code> after <code>maxSeats</code> has returned — a <strong>closure</strong>. <code>maxSeats(40)</code> and <code>maxSeats(60)</code> are two independent rules; the run above showed 45 seats refused by the first and accepted by the second (“0 problems”). The return type <code>: Rule</code> does two jobs: callers know what they get, and the inner arrow’s <code>input</code> is typed from it. Express middleware factories have exactly this shape: <code>requireRole(role)</code> returns <code>(req, res, next) =&gt; …</code>.</p>

<h3>Contextual typing in map and filter</h3>
<p>Not one annotation inside the callbacks below; the element type of <code>RULES</code> flows into them:</p>
${ma('typescript', CTX)}
${ra(OUT['06-context'])}
<p>What did tsc infer? The declaration file it wrote:</p>
${ra(DTS)}
<p>Note <code>problems: Problem[]</code>, not <code>(Problem | null)[]</code>: since TypeScript 5.5, tsc infers that <code>(p) =&gt; p !== null</code> is a check and narrows the result of <code>filter</code> (“inferred type predicates”). On TypeScript 5.4 or older you would have to write that yourself.</p>

<h3>Function is not a function type</h3>
<p>There is a built-in type called <code>Function</code>. It means “something callable” and nothing else:</p>
${ma('typescript', CODE.fnLoose)}
${ra(OUT['04-fn-loose'])}
<p>tsc is silent: it accepts a rule that takes a number, and calling a <code>Function</code> returns <code>any</code>, so the typo <code>problem?.cod</code> is not even noticed. The same list typed as <code>Rule[]</code>:</p>
${ra(OUT['05-fn-typed'])}
<p>Both bugs, with the “Did you mean 'code'?” hint. Treat <code>Function</code> like <code>any</code> (lesson 1.4): Lab 3’s grader refuses it.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — <code>.map(parseInt)</code> type-checks and gives garbage.</strong> A lecturer types the hours to block as text, “07,08,09,10”:</p>
${ma('typescript', CODE.hours)}
${ra(OUT['08-parseint'])}
<p>tsc: no error. Node: <code>[7, NaN, 0, 3]</code>. <code>map</code> calls its callback with <code>(value, index, array)</code>, and <code>parseInt</code> has a second, optional parameter <code>radix</code> (the number base). So index 1 becomes base 1 (no such base: NaN), index 2 becomes base 2 (reads “0”, stops at “9”), index 3 becomes base 3 (“10” in base 3 is 3). Why does tsc accept it? Write both types down:</p>
${ma('typescript', CODE.why)}
${ra(OUT['09-why'])}
<p>A function with an <em>optional</em> second parameter fits a slot that passes a second argument. The types are honestly compatible — the meaning is not. The rule: when you pass a library function directly as a callback, check whether it has optional parameters; if so, wrap it and pass exactly what you mean, as <code>fixed</code> does.</p>
</div>

<h3>Advanced: method syntax vs property syntax</h3>
<p>An object type can declare a function as a property, <code>check: (input: BookingInput) =&gt; number</code>, or as a method, <code>check(input: BookingInput): number</code>. They look the same, but under <code>strictFunctionTypes</code> (part of <code>strict</code>) tsc checks them differently:</p>
${ma('typescript', CODE.method)}
${ra(OUT['10-method'])}
<p>Only line 10 is refused. A function that handles only admins must not sit where any request may arrive; the property form catches that, the method form lets it through (methods are compared “bivariantly” for historical reasons — the DOM and many libraries rely on it). If a callback field must be safe, declare it with property syntax.</p>

<h3>When to use which</h3>
${KHI_EN}
<p><strong>Coming from Java (PRO192, Spring)?</strong> Java needs a named functional interface — <code>Function&lt;BookingInput, Problem&gt;</code>, <code>Predicate&lt;T&gt;</code> — and a lambda fits it. TypeScript compares <em>shapes</em>: any function with a compatible parameter list and return type fits <code>Rule</code>, whatever its name. No interface to implement, no annotation on the lambda.</p>

<!-- SODO-TS -->
<h3>🗺 How validate uses the list</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Request</div><div class="lz-d">one BookingInput from the form</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Each Rule</div><div class="lz-d">endAfterStart, notTooLong, maxSeats(40) — same type</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Problem or null</div><div class="lz-d">tsc checked every rule’s shape</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Problem[]</div><div class="lz-d">an empty list means: book it</div></div>
</div>

<h3>💼 Interview corner</h3>
<p><em>“Why does <code>['1','2','3'].map(parseInt)</code> not give [1, 2, 3], and why doesn’t TypeScript catch it?”</em> — <code>map</code> passes the index as a second argument and <code>parseInt</code> reads it as the radix; a callback with an optional second parameter is type-compatible with <code>map</code>’s callback, so the checker has nothing to report. Fix: <code>.map((s) =&gt; Number.parseInt(s, 10))</code>. Bonus point: say that a callback may take fewer parameters, never more required ones.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p>A lecturer wants exams to start no earlier than a given time. In <code>demo3/ts-03-2/practice/start/early.ts</code> the factory is written but untyped:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['11-pr-start'])}
<ol>
<li>Type <code>time</code>.</li>
<li>Give <code>notBefore</code> a return type so that the inner <code>input</code> is typed without writing it.</li>
<li>Use it in a list with <code>maxSeats(40)</code>, and check that <code>notBefore(540)</code> is refused.</li>
</ol>
<p><strong>Solution and real output.</strong> One annotation on the parameter, one on the result — the inner arrow is typed by <code>Rule</code>:</p>
${ma('typescript', CODE.prSol)}
${ma('typescript', CODE.prUse)}
${ra(OUT['12-pr-sol'])}
${ma('typescript', CODE.prWrong)}
${ra(OUT['13-pr-wrong'])}
<p><strong>Done when:</strong> tsc is clean, the 08:00 exam gets one <code>OUTSIDE_HOURS</code> problem with <code>notBefore('09:00')</code> and none with <code>notBefore('07:30')</code>, and minutes are refused with TS2345. Code Lab has four more exercises (type the rule list, a factory, the <code>parseInt</code> trap, replace <code>Function</code>).</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">function type</span><span class="v"><code>(input: BookingInput) =&gt; Problem | null</code>: the type of a function value.</span></div>
  <div class="kv"><span class="k">callback</span><span class="v">A function you hand to another function, which calls it later.</span></div>
  <div class="kv"><span class="k">higher-order function</span><span class="v">A function that takes or returns functions — <code>validate</code>, <code>maxSeats</code>, <code>map</code>.</span></div>
  <div class="kv"><span class="k">closure</span><span class="v">A function that keeps using variables from where it was created (<code>limit</code> in <code>maxSeats</code>).</span></div>
  <div class="kv"><span class="k">contextual typing</span><span class="v">tsc types a callback’s parameters from the slot it is passed into.</span></div>
  <div class="kv"><span class="k">strictFunctionTypes</span><span class="v">Part of <code>strict</code>: function parameters are checked strictly — except in method syntax.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A function type <code>(params) =&gt; Return</code> names the shape of a callback; <code>type Rule = …</code> lets a whole list of rules share it.</li>
<li>In JavaScript a wrong-shaped rule runs silently (45 seats accepted, code <code>undefined</code>); tsc refuses it with TS2322 and says which part does not fit.</li>
<li>Fewer parameters fit; an extra required parameter, a wrong parameter type or a wrong return do not.</li>
<li>A factory such as <code>maxSeats(limit): Rule</code> returns a configured callback; the closure keeps <code>limit</code>.</li>
<li><code>Function</code> is as loose as <code>any</code>; <code>.map(parseInt)</code> type-checks and returns <code>[7, NaN, 0, 3]</code> — wrap library functions.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — More on Functions', 'Function type expressions, call signatures, optional parameters in callbacks. Read 1 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/functions.html')}
${nguon('⚙️', 'TSConfig reference — strictFunctionTypes', 'Why parameters are checked strictly, and why method syntax is excluded. Read 1 Nov 2026.', 'https://www.typescriptlang.org/tsconfig/#strictFunctionTypes')}
${nguon('📗', 'TypeScript 5.5 release notes — Inferred Type Predicates', 'Why filter((p) =&gt; p !== null) now returns Problem[]. Read 1 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-5.html')}
${nguon('🟦', 'MDN — parseInt()', 'The radix parameter, and why base 1 gives NaN. Read 1 Nov 2026.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-1-2-ham-closure-this', title: 'Closures in the Node.js course — 1.2: Functions, closures and this', sub: 'Same: a factory returns a function that remembers its configuration (createCounter there, maxSeats here) — the shape of every Express middleware factory. Different: here the factory and its result have a type (Rule), so a rule with the wrong shape is refused before anything runs.', cta: 'OPEN NODE.JS LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Hàm như một giá trị: kiểu hàm &amp; callback</h2>
<p class="lead">Trong JavaScript hàm là một giá trị: bạn cất nó vào biến, bỏ vào mảng, truyền cho hàm khác, trả nó về từ một hàm. Bài này gán kiểu cho những giá trị như thế. LabFlow sẽ kiểm một yêu cầu đặt phòng bằng một <strong>danh sách các hàm luật</strong>, và bạn sẽ thấy chuyện gì xảy ra khi bạn cùng nhóm thêm một luật sai hình dạng — trước trong JavaScript (chạy được, sai im lặng), rồi trong TypeScript (bị từ chối, kèm lý do).</p>

<h3>Học xong bạn làm được gì, và vì sao có ích</h3>
<ul>
<li>Viết một <strong>kiểu hàm (function type)</strong> — <code>(input: BookingInput) =&gt; Problem | null</code> — và đặt tên cho nó.</li>
<li>Đọc được ba cách một callback không khớp: sai tham số, thừa tham số bắt buộc, sai giá trị trả về.</li>
<li>Viết một hàm <strong>trả về</strong> một hàm đã cấu hình (factory có closure) và gõ kiểu cho nó.</li>
<li>Để suy luận theo ngữ cảnh điền kiểu tham số callback trong <code>map</code> / <code>filter</code>, và biết chỗ nó để lọt một bug thật (<code>map(parseInt)</code>).</li>
</ul>
<p>Vì sao có ích: callback có ở khắp nơi bạn sẽ làm. Mọi middleware và route handler của Express là callback, mọi <code>onClick</code> trong React là callback, mọi <code>.map</code> nhận một callback. Ở Lab 3 bạn biến các luật đặt phòng của LabFlow thành đúng danh sách <code>Rule</code> của bài này. Và “gõ kiểu cho tham số callback này” là câu live-coding quen thuộc khi phỏng vấn Node.js.</p>

<h3>JavaScript trước: một danh sách luật, và hai hình dạng sai</h3>
<p>Ý tưởng đơn giản: mỗi luật là một hàm nhìn vào một yêu cầu đặt phòng và trả về một vấn đề, hoặc <code>null</code> khi ổn. <code>validate</code> chạy hết các luật. Hai bạn cùng nhóm mỗi người thêm một luật — một người tưởng luật chỉ nhận số chỗ, người kia trả về một chuỗi:</p>
${ma('javascript', CODE.js)}
${ra(OUT['02-js'])}
<p>Không lỗi, exit code 0 — và hai kết quả sai. <code>seatsOnly</code> nhận cả object yêu cầu; <code>{…} &gt; 40</code> là <code>false</code>, nên 45 chỗ lọt qua giới hạn 40. <code>tooLong</code> trả về <code>'TOO_LONG'</code>; chuỗi không có <code>code</code>, nên màn hình hiện <code>undefined</code>. Không chỗ nào trong code nói một luật phải nhận gì và trả gì.</p>

<h3>Kiểu hàm: nói rõ một luật là gì</h3>
<p>Kiểu hàm trông như một arrow function có kiểu thay cho thân hàm: <code>(tham số) =&gt; KiểuTrảVề</code>. Đặt tên cho nó bằng <code>type</code>, như mọi kiểu khác:</p>
${ma('typescript', RULE_TYPE)}
<p>Đọc như một câu: “một <code>Rule</code> nhận một <code>BookingInput</code> và trả về một <code>Problem</code> hoặc <code>null</code>”. Tên tham số <code>input</code> chỉ để đọc cho dễ — một hàm có tham số tên <code>b</code> vẫn khớp. Giờ luật nào cũng là một giá trị của kiểu đó, và tham số của nó không cần chú thích — chữ <code>: Rule</code> bên trái đã nói nó là gì (suy luận theo ngữ cảnh, bài 1.3):</p>
${ma('typescript', RULE_VALUES)}
${ma('typescript', VALIDATE)}
<p><code>validate</code> nhận yêu cầu và một <code>readonly Rule[]</code> — một mảng hàm chỉ đọc (bài 2.2). Chạy thử:</p>
${ma('typescript', CODE.run)}
${ra(OUT['01-rules-run'])}

<h3>Hàm nào khớp vào chỗ đó?</h3>
<p>Giờ đem hai lỗi JavaScript ở trên, thêm hai lỗi nữa, đặt vào kiểu <code>Rule</code>:</p>
${ma('typescript', CODE.wrong)}
${ra(OUT['03-wrong'])}
<p>Bốn lần từ chối, đều TS2322, mỗi lần một lý do khác nhau ở các dòng thụt vào. Đọc lỗi lồng nhau từ dòng <strong>cuối</strong> lên: “Type 'BookingInput' is not assignable to type 'number'” là gốc của lỗi đầu tiên. Dòng 5–6 biên dịch được: một luật bỏ qua input là hợp lệ.</p>
${BANG_VI}
<p>Sự bất đối xứng này đáng nhớ. <strong>Ít</strong> tham số hơn thì an toàn, vì JavaScript cứ thế bỏ đối số thừa — đó là lý do <code>[1, 2].map((x) =&gt; x * 2)</code> biên dịch được dù <code>map</code> truyền ba đối số. <strong>Thừa</strong> tham số bắt buộc thì không an toàn, vì chúng sẽ là <code>undefined</code>.</p>

<h3>Một hàm trả về một luật</h3>
<p>“Tối đa 40 chỗ” ở phòng lab thường, “tối đa 60” ở giảng đường. Thay vì chép hai bản, hãy viết một hàm <em>dựng</em> ra luật:</p>
${ma('typescript', FACTORY)}
<p>Arrow mà <code>maxSeats</code> trả về được tạo ra bên trong lời gọi, nên nó vẫn thấy <code>limit</code> sau khi <code>maxSeats</code> đã trả về — đó là <strong>closure</strong>. <code>maxSeats(40)</code> và <code>maxSeats(60)</code> là hai luật độc lập; lần chạy ở trên cho thấy 45 chỗ bị luật đầu từ chối và được luật sau chấp nhận (“0 problems”). Kiểu trả về <code>: Rule</code> làm hai việc: người gọi biết mình nhận được gì, và <code>input</code> của arrow bên trong được gõ kiểu theo nó. Factory middleware của Express có đúng hình dạng này: <code>requireRole(role)</code> trả về <code>(req, res, next) =&gt; …</code>.</p>

<h3>Suy luận theo ngữ cảnh trong map và filter</h3>
<p>Không một chú thích kiểu nào bên trong các callback dưới đây; kiểu phần tử của <code>RULES</code> tự chảy vào chúng:</p>
${ma('typescript', CTX)}
${ra(OUT['06-context'])}
<p>tsc đã suy luận ra gì? Tệp khai báo nó viết ra:</p>
${ra(DTS)}
<p>Để ý <code>problems: Problem[]</code>, không phải <code>(Problem | null)[]</code>: từ TypeScript 5.5, tsc tự hiểu <code>(p) =&gt; p !== null</code> là một phép kiểm và thu hẹp kết quả của <code>filter</code> (“inferred type predicates”). Với TypeScript 5.4 trở về trước bạn phải tự viết điều đó.</p>

<h3>Function không phải là kiểu hàm</h3>
<p>Có một kiểu dựng sẵn tên <code>Function</code>. Nó nghĩa là “thứ gì đó gọi được”, ngoài ra không gì cả:</p>
${ma('typescript', CODE.fnLoose)}
${ra(OUT['04-fn-loose'])}
<p>tsc im lặng: nó nhận một luật nhận số, và gọi một <code>Function</code> thì ra <code>any</code>, nên lỗi gõ <code>problem?.cod</code> không ai để ý. Cũng danh sách đó với kiểu <code>Rule[]</code>:</p>
${ra(OUT['05-fn-typed'])}
<p>Cả hai bug, kèm gợi ý “Did you mean 'code'?”. Hãy coi <code>Function</code> như <code>any</code> (bài 1.4): máy chấm Lab 3 từ chối nó.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — <code>.map(parseInt)</code> qua tsc mà ra rác.</strong> Một giảng viên gõ các giờ cần khoá dưới dạng chữ, “07,08,09,10”:</p>
${ma('typescript', CODE.hours)}
${ra(OUT['08-parseint'])}
<p>tsc: không lỗi. Node: <code>[7, NaN, 0, 3]</code>. <code>map</code> gọi callback với <code>(value, index, array)</code>, còn <code>parseInt</code> có tham số thứ hai, tuỳ chọn, là <code>radix</code> (cơ số). Thế là chỉ số 1 thành cơ số 1 (không có cơ số đó: NaN), chỉ số 2 thành cơ số 2 (đọc “0”, dừng ở “9”), chỉ số 3 thành cơ số 3 (“10” cơ số 3 là 3). Vì sao tsc chấp nhận? Viết hai kiểu ra:</p>
${ma('typescript', CODE.why)}
${ra(OUT['09-why'])}
<p>Một hàm có tham số thứ hai <em>tuỳ chọn</em> thì khớp với chỗ truyền vào đối số thứ hai. Về kiểu chúng tương thích thật — về nghĩa thì không. Quy tắc: khi truyền thẳng một hàm thư viện làm callback, hãy xem nó có tham số tuỳ chọn không; nếu có thì bọc lại và truyền đúng thứ bạn muốn, như <code>fixed</code>.</p>
</div>

<h3>Nâng cao: cú pháp method và cú pháp thuộc tính</h3>
<p>Một kiểu object có thể khai báo hàm dạng thuộc tính, <code>check: (input: BookingInput) =&gt; number</code>, hoặc dạng method, <code>check(input: BookingInput): number</code>. Trông như nhau, nhưng dưới <code>strictFunctionTypes</code> (một phần của <code>strict</code>) tsc kiểm chúng khác nhau:</p>
${ma('typescript', CODE.method)}
${ra(OUT['10-method'])}
<p>Chỉ dòng 10 bị từ chối. Một hàm chỉ xử lý admin không được đặt vào chỗ mà yêu cầu nào cũng có thể tới; dạng thuộc tính bắt được điều đó, dạng method thì để lọt (method được so “hai chiều” — bivariant — vì lý do lịch sử, DOM và nhiều thư viện dựa vào nó). Trường callback nào cần an toàn thì khai báo bằng cú pháp thuộc tính.</p>

<h3>Khi nào dùng gì</h3>
${KHI_VI}
<p><strong>Từ Java sang (PRO192, Spring)?</strong> Java cần một functional interface có tên — <code>Function&lt;BookingInput, Problem&gt;</code>, <code>Predicate&lt;T&gt;</code> — và lambda khớp vào nó. TypeScript so <em>hình dạng</em>: hàm nào có danh sách tham số và kiểu trả về tương thích đều khớp <code>Rule</code>, bất kể tên gì. Không interface phải implement, không chú thích trên lambda.</p>

<h3>🗺 validate dùng danh sách luật thế nào</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Yêu cầu</div><div class="lz-d">một BookingInput từ form</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Từng Rule</div><div class="lz-d">endAfterStart, notTooLong, maxSeats(40) — cùng một kiểu</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Problem hoặc null</div><div class="lz-d">tsc đã kiểm hình dạng từng luật</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Problem[]</div><div class="lz-d">danh sách rỗng nghĩa là: cho đặt</div></div>
</div>

<h3>💼 Góc phỏng vấn</h3>
<p><em>“Vì sao <code>['1','2','3'].map(parseInt)</code> không ra [1, 2, 3], và vì sao TypeScript không bắt?”</em> — <code>map</code> truyền chỉ số làm đối số thứ hai và <code>parseInt</code> đọc nó là cơ số; một callback có tham số thứ hai tuỳ chọn thì tương thích kiểu với callback của <code>map</code>, nên trình kiểm tra không có gì để báo. Sửa: <code>.map((s) =&gt; Number.parseInt(s, 10))</code>. Điểm cộng: nói thêm rằng callback được nhận ít tham số hơn, không bao giờ được cần thêm tham số bắt buộc.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<p>Một giảng viên muốn giờ thi không bắt đầu sớm hơn một mốc cho trước. Trong <code>demo3/ts-03-2/practice/start/early.ts</code> factory đã viết nhưng chưa có kiểu:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['11-pr-start'])}
<ol>
<li>Gõ kiểu cho <code>time</code>.</li>
<li>Cho <code>notBefore</code> một kiểu trả về để <code>input</code> bên trong có kiểu mà không phải viết.</li>
<li>Dùng nó trong một danh sách cùng <code>maxSeats(40)</code>, và kiểm rằng <code>notBefore(540)</code> bị từ chối.</li>
</ol>
<p><strong>Lời giải và output thật.</strong> Một chú thích cho tham số, một cho kết quả — arrow bên trong được <code>Rule</code> gõ kiểu hộ:</p>
${ma('typescript', CODE.prSol)}
${ma('typescript', CODE.prUse)}
${ra(OUT['12-pr-sol'])}
${ma('typescript', CODE.prWrong)}
${ra(OUT['13-pr-wrong'])}
<p><strong>Đạt khi:</strong> tsc sạch, buổi thi 08:00 nhận một vấn đề <code>OUTSIDE_HOURS</code> với <code>notBefore('09:00')</code> và không vấn đề nào với <code>notBefore('07:30')</code>, và số phút bị từ chối với TS2345. Code Lab có thêm bốn bài (gõ kiểu danh sách luật, một factory, bẫy <code>parseInt</code>, thay <code>Function</code>).</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">function type (kiểu hàm)</span><span class="v"><code>(input: BookingInput) =&gt; Problem | null</code>: kiểu của một giá trị hàm.</span></div>
  <div class="kv"><span class="k">callback (hàm gọi lại)</span><span class="v">Hàm bạn đưa cho một hàm khác để nó gọi sau.</span></div>
  <div class="kv"><span class="k">higher-order function (hàm bậc cao)</span><span class="v">Hàm nhận hoặc trả về hàm — <code>validate</code>, <code>maxSeats</code>, <code>map</code>.</span></div>
  <div class="kv"><span class="k">closure (bao đóng)</span><span class="v">Hàm vẫn dùng các biến ở nơi nó được tạo ra (<code>limit</code> trong <code>maxSeats</code>).</span></div>
  <div class="kv"><span class="k">contextual typing (suy luận theo ngữ cảnh)</span><span class="v">tsc gõ kiểu tham số callback theo chỗ nó được truyền vào.</span></div>
  <div class="kv"><span class="k">strictFunctionTypes</span><span class="v">Một phần của <code>strict</code>: tham số hàm được kiểm chặt — trừ cú pháp method.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Kiểu hàm <code>(tham số) =&gt; KiểuTrảVề</code> đặt tên cho hình dạng một callback; <code>type Rule = …</code> cho cả danh sách luật dùng chung.</li>
<li>Trong JavaScript một luật sai hình dạng chạy im lặng (45 chỗ lọt qua, mã <code>undefined</code>); tsc từ chối bằng TS2322 và nói phần nào không khớp.</li>
<li>Ít tham số hơn thì khớp; thừa tham số bắt buộc, sai kiểu tham số hay sai kiểu trả về thì không.</li>
<li>Factory như <code>maxSeats(limit): Rule</code> trả về một callback đã cấu hình; closure giữ <code>limit</code>.</li>
<li><code>Function</code> lỏng như <code>any</code>; <code>.map(parseInt)</code> qua tsc và trả <code>[7, NaN, 0, 3]</code> — hãy bọc hàm thư viện lại.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — More on Functions', 'Kiểu biểu thức hàm, call signature, tham số tuỳ chọn trong callback. Đọc ngày 01/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/functions.html')}
${nguon('⚙️', 'TSConfig reference — strictFunctionTypes', 'Vì sao tham số được kiểm chặt, và vì sao cú pháp method bị loại trừ. Đọc ngày 01/11/2026.', 'https://www.typescriptlang.org/tsconfig/#strictFunctionTypes')}
${nguon('📗', 'Ghi chú phát hành TypeScript 5.5 — Inferred Type Predicates', 'Vì sao filter((p) =&gt; p !== null) giờ trả về Problem[]. Đọc ngày 01/11/2026.', 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-5.html')}
${nguon('🟦', 'MDN — parseInt()', 'Tham số radix, và vì sao cơ số 1 cho NaN. Đọc ngày 01/11/2026.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-1-2-ham-closure-this', title: 'Closure ở khoá Node.js — 1.2: Hàm, closure và this', sub: 'Giống: một factory trả về hàm nhớ cấu hình của nó (createCounter bên đó, maxSeats ở đây) — đúng hình dạng mọi factory middleware Express. Khác: ở đây factory và kết quả của nó có kiểu (Rule), nên một luật sai hình dạng bị từ chối trước khi chạy.', cta: 'MỞ BÀI NODE.JS →' })}
</div>
`,
};
