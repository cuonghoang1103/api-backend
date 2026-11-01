/**
 * TypeScript · Chương 3 · 3.1 — Gõ kiểu tham số: bắt buộc, optional, mặc định, rest. Slug giữ: typescript-3-1-tham-so.
 * BÀI MỞ CHƯƠNG 3 (soạn lại TRỌN 01/11/2026 theo ./_HOP-DONG.md). Mọi code/output lấy từ ./_ma-ts-03-1.mjs
 * (sinh từ labflow-ts chạy thật: Node 22.23.3, tsc 7.0.2 — demo3/ts-03-1/).
 */
import G from '../giang/ts-03-1.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-03-1.mjs';

const BANG_EN = `<table>
<thead><tr><th>You write</th><th>The caller may…</th><th>Inside the function the value is…</th><th>Use it when</th></tr></thead>
<tbody>
<tr><td><code>end: number</code></td><td>must pass it (TS2554 otherwise)</td><td><code>number</code></td><td>the function cannot work without it — the default choice</td></tr>
<tr><td><code>end?: number</code></td><td>leave it out</td><td><code>number | undefined</code> — check before use</td><td>“not known yet” is a real, separate case (an open booking)</td></tr>
<tr><td><code>separator = ':'</code></td><td>leave it out</td><td><code>string</code>, never undefined</td><td>there is one sensible value most callers want</td></tr>
<tr><td><code>end: number | undefined</code></td><td>must still write something, even <code>undefined</code></td><td><code>number | undefined</code></td><td>rarely — you want every caller to decide explicitly</td></tr>
<tr><td><code>...ranges: TimeRange[]</code></td><td>pass zero, one or many</td><td><code>TimeRange[]</code> (an ordinary array)</td><td>“any number of the same thing”</td></tr>
<tr><td><code>{ notifyLecturer = false }: BookOptions = {}</code></td><td>name only the options it needs</td><td>each option has its default</td><td>more than one flag, or more than three parameters</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Bạn viết</th><th>Người gọi được…</th><th>Bên trong hàm giá trị là…</th><th>Dùng khi</th></tr></thead>
<tbody>
<tr><td><code>end: number</code></td><td>bắt buộc truyền (không thì TS2554)</td><td><code>number</code></td><td>hàm không chạy được nếu thiếu nó — lựa chọn mặc định</td></tr>
<tr><td><code>end?: number</code></td><td>bỏ qua</td><td><code>number | undefined</code> — kiểm trước khi dùng</td><td>“chưa biết” là một trường hợp thật, riêng (lượt đặt còn để ngỏ)</td></tr>
<tr><td><code>separator = ':'</code></td><td>bỏ qua</td><td><code>string</code>, không bao giờ undefined</td><td>có một giá trị hợp lý mà đa số người gọi muốn</td></tr>
<tr><td><code>end: number | undefined</code></td><td>vẫn phải viết gì đó, kể cả <code>undefined</code></td><td><code>number | undefined</code></td><td>hiếm — khi muốn mọi người gọi phải tự quyết định rõ</td></tr>
<tr><td><code>...ranges: TimeRange[]</code></td><td>truyền 0, 1 hay nhiều</td><td><code>TimeRange[]</code> (mảng bình thường)</td><td>“bao nhiêu cái cùng loại cũng được”</td></tr>
<tr><td><code>{ notifyLecturer = false }: BookOptions = {}</code></td><td>chỉ nêu tên các tuỳ chọn cần</td><td>tuỳ chọn nào cũng có mặc định</td><td>hơn một cờ, hoặc hơn ba tham số</td></tr>
</tbody>
</table>`;

export default {
  title: '3.1 — Typing parameters: required, optional, default, rest|||3.1 — Gõ kiểu tham số: bắt buộc, optional, mặc định, rest',
  slug: 'typescript-3-1-tham-so',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mở Chương 3: JavaScript không bao giờ đếm đối số (thiếu ⇒ "08:00–NaN:NaN", thừa ⇒ bị bỏ im lặng) còn TypeScript coi mọi tham số là bắt buộc (TS2554); tham số optional ? (TS18048, TS2345, "Expected 1-2 arguments"), TS1016, ?: khác | undefined; giá trị mặc định và chữ ký .d.ts tsc sinh ra; bẫy mặc định chỉ thay undefined chứ không thay null (JSON gửi seats: null ⇒ RangeError) và cách sửa bằng | null + ??; rest ...ranges: TimeRange[] (TS7019), spread tuple vào tham số (TS2556); bẫy hai cờ boolean bị đổi chỗ ⇒ object tuỳ chọn (TS2559, TS2561); kiểu trả về cho hàm export.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Typing parameters: required, optional, default, rest</h2>
<p class="lead">A function’s parameter list is a contract between the person who writes it and everyone who calls it. JavaScript never checks that contract: a forgotten argument becomes <code>undefined</code>, an extra one disappears. This lesson shows both on LabFlow’s time helpers, then the four ways TypeScript lets you write the contract — required, optional, default, rest — plus the options object that replaces <code>true, false</code> at the call site. Every error and output below is a real run.</p>

<h3>After Chapter 3 you can…</h3>
<ul>
<li><strong>Write any parameter list precisely</strong> — required, optional, default, rest, options object — and know which one a situation needs (this lesson).</li>
<li><strong>Treat functions as values</strong>: write a function type such as <code>type Rule = (input: BookingInput) =&gt; Problem | null</code>, keep rules in an array, build rules with a factory (3.2).</li>
<li><strong>Give one function several signatures</strong> with overloads, and avoid the <code>async</code>-callback-in-a-<code>void</code>-slot crash (3.3).</li>
<li><strong>Type <code>this</code></strong> so that calling a method without its object is a compile error, not a runtime <code>TypeError</code> (3.4).</li>
<li><strong>Pass Lab 3</strong>: LabFlow’s booking checks as an array of typed functions, where eight wrong uses must be refused.</li>
</ul>
<p>Why it matters: functions are where two people’s code meet — your service and your teammate’s controller, your helper and the React form. In a group project such as SWP391, a call with a missing, extra or swapped argument is one of the easiest bugs to ship — JavaScript runs it without a word. Interviewers like “optional vs default parameter?” and “why an options object?” — you will answer with output you ran.</p>

<h3>JavaScript never counts arguments</h3>
${ma('javascript', CODE.missingJs)}
${ra(OUT['11-js-missing'])}
<p>No error, exit code 0. The forgotten <code>end</code> is <code>undefined</code>, <code>Math.floor(undefined / 60)</code> is <code>NaN</code>, and the screen shows <code>08:00–NaN:NaN</code>. The extra <code>'BE-201'</code> — maybe the caller thought the function also prints the lab — is silently ignored. In JavaScript, <em>every</em> parameter is optional and extra arguments are always welcome.</p>

<h3>TypeScript counts: every parameter is required</h3>
<p>Annotate the two parameters and tsc checks every call against the list:</p>
${ma('typescript', CODE.count)}
${ra(OUT['12-count'])}
<p>TS2554 in both directions: too few and too many. This is the opposite default from JavaScript — <strong>a parameter is required unless you say otherwise</strong>. That is why, in Lab 1, renaming <code>.js</code> to <code>.ts</code> already refused <code>checkSlot('08:00')</code>.</p>

<h3>Optional parameters: <code>?</code></h3>
<p>Some bookings are still “open”: the start is known, the end is not decided yet. A <code>?</code> after the name says the caller may leave it out — and that inside the function its type is <code>number | undefined</code>:</p>
${ma('typescript', CODE.optional)}
${ra(OUT['13-optional'])}
<p>Three errors, three lessons. Line 5: <code>formatTime</code> wants a <code>number</code>, and <code>end</code> may be <code>undefined</code> (TS2345). Line 9: arithmetic on a maybe-missing value (TS18048 — the same code as a maybe-missing property in 2.1). Line 14: the message now says <strong>“Expected 1-2 arguments”</strong> — the range tsc derived from one required and one optional parameter. Handle the missing case once and the rest of the function sees a plain <code>number</code>:</p>
${ma('typescript', CODE.optionalFixed)}
${ra(OUT['14-optional-run'])}

<h3>Two rules about <code>?</code></h3>
<p><strong>Optional parameters come last.</strong> Positions are how JavaScript matches arguments, so a required parameter after an optional one could never be reached by position:</p>
${ma('typescript', CODE.order)}
${ra(OUT['15-order'])}
<p><strong><code>end?: number</code> is not <code>end: number | undefined</code>.</strong> Both give <code>number | undefined</code> inside, but only the first lets the caller leave the argument out:</p>
${ma('typescript', CODE.optUndef)}
${ra(OUT['16-opt-undef'])}
<p><code>b(480)</code> is refused; <code>b(480, undefined)</code> is accepted. Use the second form only when you want every caller to make the decision visible.</p>

<h3>Default values</h3>
<p>A default makes the parameter optional for the caller <em>and</em> never <code>undefined</code> inside — no check needed. Ask tsc what signature it inferred (the <code>.d.ts</code> trick from 1.3):</p>
${ma('typescript', CODE.defaultTime)}
${ra(OUT['17-default-dts'])}
<p><code>separator = ':'</code> became <code>separator?: string</code> in the signature: the type came from the default value, the <code>?</code> from the fact that callers may omit it. A default also works on a destructured property — <code>{ seats = 1 }</code> — the pattern every Express handler uses for a request body:</p>
${ma('typescript', CODE.defaultUse)}
${ra(OUT['18-default-run'])}
<p>Note the third call: passing <code>undefined</code> explicitly also triggers the default. Which leads to the trap.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — a default replaces <code>undefined</code>, not <code>null</code>.</strong> A booking form whose seats field was cleared sends <code>"seats": null</code>. The handler destructures with a default and passes the value to <code>needsApproval</code> (Lab 1):</p>
${ma('typescript', CODE.nullRequest)}
${ra(OUT['19-null-run'])}
<p>The first body has no <code>seats</code> key, so the default 1 is used. The second has <code>seats: null</code> — and JavaScript defaults only fire for <code>undefined</code>, so <code>null</code> goes straight through and BR-06’s guard throws. tsc saw nothing because <code>JSON.parse</code> returns <code>any</code> (lesson 1.4). With a typed body tsc does refuse it:</p>
${ma('typescript', CODE.nullTyped)}
${ra(OUT['20-null-tsc'])}
<p>So the honest fix is in two places: the <strong>type</strong> admits that <code>null</code> can arrive (<code>seats?: number | null</code>), and the <strong>code</strong> uses <code>??</code>, which replaces both <code>null</code> and <code>undefined</code> (lesson 2.1):</p>
${ma('typescript', CODE.nullFixed)}
${ra(OUT['21-null-fixed'])}
</div>

<h3>Rest parameters: any number of the same thing</h3>
<p>How many minutes did one student book today? Any number of ranges, zero included. A rest parameter collects all remaining arguments into one typed array:</p>
${ma('typescript', CODE.restTotal)}
${ma('typescript', CODE.restUse)}
${ra(OUT['23-rest-run'])}
<p>Each argument is checked against the element type <code>TimeRange</code> — and a rest parameter without a type is refused under strict:</p>
${ma('typescript', CODE.restWrong)}
${ra(OUT['22-rest-tsc'])}
<p>The other direction is <strong>spread</strong>: <code>...</code> at the call site unpacks an array into arguments. tsc allows it when it can count the elements — a tuple into fixed parameters, or any array into a rest parameter:</p>
${ma('typescript', CODE.spread)}
${ra(OUT['24-spread-tsc'])}
${ra(OUT['25-spread-run'])}
<p><code>loose</code> happens to hold two numbers at runtime, but its type is <code>number[]</code> — any length — so <code>rangeLabel(...loose)</code> is TS2556. Annotate it as <code>TimeRange</code> (2.2) and the same call compiles.</p>

<h3>Two booleans in a row: use an options object</h3>
${ma('typescript', CODE.flags)}
${ra(OUT['26-flags-run'])}
<p>The second call swapped the two flags. Both are <code>boolean</code>, so tsc cannot see it, and the lecturer is never e-mailed. When a function has more than one flag (or more than three parameters), take <strong>one object with named, optional keys</strong> and give the whole object a default <code>= {}</code>:</p>
${ma('typescript', CODE.options)}
${ra(OUT['27-flags-tsc'])}
${ra(OUT['28-options-run'])}
<p>Every call now says what it switches on, a bare <code>true</code> is refused (TS2559), and a misspelled option is caught with a suggestion (TS2561, the code you met in 1.1).</p>

<h3>Return types on exported functions</h3>
<p>Lesson 1.3’s rule — annotate the edges — applies to return types too. Without one, a teammate’s new <code>return 'invalid'</code> silently changes the function’s type and the error appears in <em>another file</em>:</p>
${ma('typescript', CODE.retInfer)}
${ra(OUT['29-return-infer'])}
<p>With <code>: number</code> written once, the same line is refused where it was written:</p>
${ra(OUT['30-return-annotated'])}

<h3>Which parameter, when</h3>
${BANG_EN}

<h3>🗺 How tsc checks one call</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Count</div><div class="lz-d">required ≤ arguments ≤ all (rest = no upper limit) — else TS2554</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Match by position</div><div class="lz-d">each argument against its parameter type — else TS2345</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Spread</div><div class="lz-d">only a tuple, or into a rest parameter — else TS2556</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Result</div><div class="lz-d">the declared (or inferred) return type flows to the caller</div></div>
</div>

<h3>💼 Interview corner</h3>
<p><strong>“Optional or default parameter?”</strong> Default when one value suits most callers — the body never sees <code>undefined</code>. Optional when “missing” is a real case you handle differently. Mention the trap: defaults do not replace <code>null</code>. <strong>“Why options objects?”</strong> Named arguments at the call site, swapped flags become impossible, adding an option later breaks nobody.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p><code>demo3/ts-03-1/practice/start/label.ts</code> was copied from JavaScript. Node runs it correctly; tsc does not accept it:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['31-pr-start'])}
${ra(OUT['32-pr-start-run'])}
<ol>
<li>Why is the call on line 10 an error in TypeScript when Node runs it fine?</li>
<li>Type the three parameters and the return value so the file compiles. Do not add a default for <code>end</code> — “no end yet” must stay a separate case.</li>
</ol>
<p><strong>Solution and real output.</strong> In TypeScript every parameter is required unless marked, so the two-argument call needs <code>end?</code>; the existing <code>=== undefined</code> check then narrows it:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['33-pr-sol'])}
<p><strong>Done when:</strong> tsc prints nothing and Node prints the two labels. Code Lab has four more: an optional end, defaults that survive <code>null</code>, a rest parameter of ranges, and flags turned into an options object.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">parameter / argument</span><span class="v">The name in the declaration / the value at the call.</span></div>
  <div class="kv"><span class="k">optional parameter (<code>?</code>)</span><span class="v">May be left out; its type inside includes <code>undefined</code>. Must come after required ones (TS1016).</span></div>
  <div class="kv"><span class="k">default parameter</span><span class="v">Used when the argument is <code>undefined</code> (left out or passed as undefined) — never for <code>null</code>.</span></div>
  <div class="kv"><span class="k">rest parameter (<code>...xs</code>)</span><span class="v">Collects the remaining arguments into one typed array; must be last.</span></div>
  <div class="kv"><span class="k">spread argument</span><span class="v"><code>f(...arr)</code> — unpacks an array into arguments; tsc needs a tuple or a rest parameter (TS2556).</span></div>
  <div class="kv"><span class="k">options object</span><span class="v">One parameter holding named, optional settings instead of positional flags.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>JavaScript never counts arguments (a missing one gave <code>08:00–NaN:NaN</code>); TypeScript treats every parameter as required (TS2554, “Expected 2 arguments, but got 1/3”).</li>
<li><code>end?: number</code>: may be omitted, is <code>number | undefined</code> inside (TS18048/TS2345 until checked), must be last (TS1016). <code>end: number | undefined</code> must still be passed.</li>
<li>A default makes the parameter optional and always defined — but only <code>undefined</code> triggers it; <code>seats: null</code> from JSON went through and threw. Use <code>| null</code> + <code>??</code> when null can arrive.</li>
<li>Rest <code>...ranges: TimeRange[]</code> takes any number of checked arguments; spread needs a tuple or a rest parameter (TS2556).</li>
<li>Two booleans in a row can be swapped silently; an options object makes every call self-explaining (TS2559, TS2561). Annotate return types of exported functions.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — More on Functions', 'Optional and default parameters, rest parameters and arguments, parameter destructuring. Read 1 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/functions.html')}
${nguon('📗', 'MDN — Default parameters', 'Defaults apply when the argument is undefined; null does not trigger them. Read 1 Nov 2026.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters')}
${nguon('📗', 'MDN — Rest parameters', 'Collecting the remaining arguments into a real array. Read 1 Nov 2026.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters')}
${lienKet({ khoa: 'api-design', bai: 'api-3-1-offset', title: 'The same idea at the HTTP edge — API Design 3.1: Offset pagination', sub: 'Same: a parameter the caller may leave out gets a default (limit = 20) and a hard limit, and “absent” must not be confused with “present but empty”. Different: there Zod applies the default to a query string at runtime; here tsc checks the default and the parameter list of a TypeScript function before anything runs.', cta: 'OPEN API DESIGN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Gõ kiểu tham số: bắt buộc, optional, mặc định, rest</h2>
<p class="lead">Danh sách tham số của một hàm là hợp đồng giữa người viết hàm và mọi người gọi nó. JavaScript không bao giờ kiểm hợp đồng đó: đối số bị quên thành <code>undefined</code>, đối số thừa biến mất. Bài này cho thấy cả hai trên các hàm giờ của LabFlow, rồi bốn cách TypeScript cho bạn viết hợp đồng — bắt buộc, optional, mặc định, rest — cộng với object tuỳ chọn thay cho <code>true, false</code> ở chỗ gọi. Mọi lỗi và output dưới đây đều chạy thật.</p>

<h3>Học xong Chương 3 bạn làm được…</h3>
<ul>
<li><strong>Viết chính xác mọi danh sách tham số</strong> — bắt buộc, optional, mặc định, rest, object tuỳ chọn — và biết tình huống nào cần cái nào (bài này).</li>
<li><strong>Coi hàm là một giá trị</strong>: viết kiểu hàm như <code>type Rule = (input: BookingInput) =&gt; Problem | null</code>, giữ các luật trong một mảng, tạo luật bằng hàm sinh (3.2).</li>
<li><strong>Cho một hàm nhiều chữ ký</strong> bằng overload, và tránh lỗi sập khi đưa callback <code>async</code> vào chỗ <code>void</code> (3.3).</li>
<li><strong>Gõ kiểu cho <code>this</code></strong> để gọi một phương thức tách khỏi object của nó là lỗi biên dịch, không phải <code>TypeError</code> lúc chạy (3.4).</li>
<li><strong>Qua Lab 3</strong>: các phép kiểm đặt phòng của LabFlow thành một mảng hàm có kiểu, trong đó tám cách dùng sai phải bị từ chối.</li>
</ul>
<p>Vì sao quan trọng: hàm là nơi code của hai người gặp nhau — service của bạn và controller của bạn cùng nhóm, hàm tiện ích của bạn và form React. Trong đồ án nhóm như SWP391, lời gọi thiếu, thừa hoặc đảo chỗ đối số là một trong những bug dễ lọt lên nhất — JavaScript chạy nó mà không nói một lời. Người phỏng vấn thích hỏi “tham số optional khác mặc định thế nào?” và “vì sao dùng object tuỳ chọn?” — bạn sẽ trả lời bằng output tự chạy.</p>

<h3>JavaScript không bao giờ đếm đối số</h3>
${ma('javascript', CODE.missingJs)}
${ra(OUT['11-js-missing'])}
<p>Không lỗi, exit code 0. <code>end</code> bị quên là <code>undefined</code>, <code>Math.floor(undefined / 60)</code> là <code>NaN</code>, và màn hình hiện <code>08:00–NaN:NaN</code>. Đối số thừa <code>'BE-201'</code> — có lẽ người gọi tưởng hàm in cả tên phòng — bị lặng lẽ bỏ qua. Trong JavaScript, tham số <em>nào</em> cũng là tuỳ chọn và đối số thừa luôn được chào đón.</p>

<h3>TypeScript đếm: mọi tham số đều bắt buộc</h3>
<p>Chú thích kiểu cho hai tham số là tsc kiểm từng lời gọi theo danh sách đó:</p>
${ma('typescript', CODE.count)}
${ra(OUT['12-count'])}
<p>TS2554 theo cả hai chiều: thiếu và thừa. Đây là mặc định ngược với JavaScript — <strong>tham số là bắt buộc trừ khi bạn nói khác</strong>. Vì thế ở Lab 1, chỉ đổi đuôi <code>.js</code> sang <code>.ts</code> đã từ chối được <code>checkSlot('08:00')</code>.</p>

<h3>Tham số optional: <code>?</code></h3>
<p>Có những lượt đặt còn “để ngỏ”: biết giờ bắt đầu, chưa chốt giờ kết thúc. Dấu <code>?</code> sau tên nói người gọi được bỏ qua tham số đó — và bên trong hàm nó có kiểu <code>number | undefined</code>:</p>
${ma('typescript', CODE.optional)}
${ra(OUT['13-optional'])}
<p>Ba lỗi, ba bài học. Dòng 5: <code>formatTime</code> cần <code>number</code>, mà <code>end</code> có thể là <code>undefined</code> (TS2345). Dòng 9: làm phép tính trên một giá trị có thể thiếu (TS18048 — cùng mã với thuộc tính có thể thiếu ở bài 2.1). Dòng 14: thông báo giờ ghi <strong>“Expected 1-2 arguments”</strong> — khoảng mà tsc suy ra từ một tham số bắt buộc và một tham số optional. Xử lý trường hợp thiếu một lần là phần còn lại của hàm thấy <code>number</code> thuần:</p>
${ma('typescript', CODE.optionalFixed)}
${ra(OUT['14-optional-run'])}

<h3>Hai luật về <code>?</code></h3>
<p><strong>Tham số optional đứng cuối.</strong> JavaScript khớp đối số theo vị trí, nên tham số bắt buộc đứng sau tham số optional sẽ không bao giờ tới được bằng vị trí:</p>
${ma('typescript', CODE.order)}
${ra(OUT['15-order'])}
<p><strong><code>end?: number</code> không phải <code>end: number | undefined</code>.</strong> Bên trong cả hai đều là <code>number | undefined</code>, nhưng chỉ cách đầu cho người gọi bỏ qua đối số:</p>
${ma('typescript', CODE.optUndef)}
${ra(OUT['16-opt-undef'])}
<p><code>b(480)</code> bị từ chối; <code>b(480, undefined)</code> được nhận. Chỉ dùng cách thứ hai khi muốn mọi người gọi phải quyết định một cách nhìn thấy được.</p>

<h3>Giá trị mặc định</h3>
<p>Giá trị mặc định làm tham số thành tuỳ chọn với người gọi <em>và</em> không bao giờ <code>undefined</code> bên trong — không cần kiểm. Hỏi tsc nó suy ra chữ ký gì (mẹo <code>.d.ts</code> ở bài 1.3):</p>
${ma('typescript', CODE.defaultTime)}
${ra(OUT['17-default-dts'])}
<p><code>separator = ':'</code> thành <code>separator?: string</code> trong chữ ký: kiểu lấy từ giá trị mặc định, dấu <code>?</code> từ việc người gọi được bỏ qua. Mặc định cũng dùng được cho thuộc tính khi destructuring — <code>{ seats = 1 }</code> — đúng mẫu mọi handler Express dùng cho body của request:</p>
${ma('typescript', CODE.defaultUse)}
${ra(OUT['18-default-run'])}
<p>Để ý lời gọi thứ ba: truyền <code>undefined</code> tường minh cũng kích hoạt giá trị mặc định. Điều đó dẫn tới cái bẫy.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — giá trị mặc định thay <code>undefined</code>, không thay <code>null</code>.</strong> Form đặt phòng mà ô số chỗ bị xoá trắng sẽ gửi <code>"seats": null</code>. Handler destructuring kèm mặc định rồi đưa giá trị cho <code>needsApproval</code> (Lab 1):</p>
${ma('typescript', CODE.nullRequest)}
${ra(OUT['19-null-run'])}
<p>Body đầu không có khoá <code>seats</code>, nên mặc định 1 được dùng. Body thứ hai có <code>seats: null</code> — mà giá trị mặc định của JavaScript chỉ kích hoạt với <code>undefined</code>, nên <code>null</code> đi thẳng qua và phép kiểm của BR-06 ném lỗi. tsc không thấy gì vì <code>JSON.parse</code> trả về <code>any</code> (bài 1.4). Với body có kiểu thì tsc từ chối:</p>
${ma('typescript', CODE.nullTyped)}
${ra(OUT['20-null-tsc'])}
<p>Vậy cách sửa trung thực nằm ở hai chỗ: <strong>kiểu</strong> thừa nhận <code>null</code> có thể tới (<code>seats?: number | null</code>), và <strong>code</strong> dùng <code>??</code>, thứ thay cả <code>null</code> lẫn <code>undefined</code> (bài 2.1):</p>
${ma('typescript', CODE.nullFixed)}
${ra(OUT['21-null-fixed'])}
</div>

<h3>Tham số rest: bao nhiêu cái cùng loại cũng được</h3>
<p>Hôm nay một sinh viên đã đặt bao nhiêu phút? Bao nhiêu khoảng giờ cũng được, kể cả không có cái nào. Tham số rest gom mọi đối số còn lại vào một mảng có kiểu:</p>
${ma('typescript', CODE.restTotal)}
${ma('typescript', CODE.restUse)}
${ra(OUT['23-rest-run'])}
<p>Mỗi đối số được kiểm theo kiểu phần tử <code>TimeRange</code> — và tham số rest không có kiểu bị từ chối dưới strict:</p>
${ma('typescript', CODE.restWrong)}
${ra(OUT['22-rest-tsc'])}
<p>Chiều ngược lại là <strong>spread</strong>: <code>...</code> ở chỗ gọi bung một mảng thành các đối số. tsc cho phép khi nó đếm được số phần tử — tuple vào tham số cố định, hoặc mảng bất kỳ vào tham số rest:</p>
${ma('typescript', CODE.spread)}
${ra(OUT['24-spread-tsc'])}
${ra(OUT['25-spread-run'])}
<p><code>loose</code> lúc chạy tình cờ chứa hai số, nhưng kiểu của nó là <code>number[]</code> — dài bao nhiêu cũng được — nên <code>rangeLabel(...loose)</code> là TS2556. Chú thích nó là <code>TimeRange</code> (bài 2.2) thì cùng lời gọi đó biên dịch được.</p>

<h3>Hai boolean liền nhau: dùng object tuỳ chọn</h3>
${ma('typescript', CODE.flags)}
${ra(OUT['26-flags-run'])}
<p>Lời gọi thứ hai đã đảo chỗ hai cờ. Cả hai đều là <code>boolean</code> nên tsc không thể thấy, và giảng viên không bao giờ nhận được email. Khi hàm có hơn một cờ (hoặc hơn ba tham số), hãy nhận <strong>một object có các khoá tuỳ chọn được đặt tên</strong> và cho cả object giá trị mặc định <code>= {}</code>:</p>
${ma('typescript', CODE.options)}
${ra(OUT['27-flags-tsc'])}
${ra(OUT['28-options-run'])}
<p>Giờ mỗi lời gọi tự nói nó bật gì, một <code>true</code> trơ trọi bị từ chối (TS2559), và tuỳ chọn gõ nhầm bị bắt kèm gợi ý (TS2561, mã bạn đã gặp ở bài 1.1).</p>

<h3>Kiểu trả về cho hàm export</h3>
<p>Luật của bài 1.3 — chú thích ở mép — áp dụng cả cho kiểu trả về. Không có nó, một dòng <code>return 'invalid'</code> mới của bạn cùng nhóm âm thầm đổi kiểu của hàm và lỗi hiện ra ở <em>một tệp khác</em>:</p>
${ma('typescript', CODE.retInfer)}
${ra(OUT['29-return-infer'])}
<p>Viết <code>: number</code> một lần là đúng dòng đó bị từ chối ngay tại chỗ nó được viết:</p>
${ra(OUT['30-return-annotated'])}

<h3>Tham số nào, khi nào</h3>
${BANG_VI}

<h3>🗺 tsc kiểm một lời gọi thế nào</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Đếm</div><div class="lz-d">số bắt buộc ≤ số đối số ≤ tổng số (rest = không giới hạn trên) — không thì TS2554</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Khớp theo vị trí</div><div class="lz-d">mỗi đối số với kiểu tham số của nó — không thì TS2345</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Spread</div><div class="lz-d">chỉ tuple, hoặc vào tham số rest — không thì TS2556</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Kết quả</div><div class="lz-d">kiểu trả về đã khai báo (hoặc suy luận) đi tới người gọi</div></div>
</div>

<h3>💼 Góc phỏng vấn</h3>
<p><strong>“Tham số optional hay mặc định?”</strong> Mặc định khi một giá trị hợp với đa số người gọi — thân hàm không bao giờ thấy <code>undefined</code>. Optional khi “thiếu” là một trường hợp thật mà bạn xử lý khác đi. Nhắc luôn cái bẫy: mặc định không thay <code>null</code>. <strong>“Vì sao dùng object tuỳ chọn?”</strong> Đối số có tên ngay ở chỗ gọi, không thể đảo chỗ cờ, thêm tuỳ chọn sau này không làm hỏng ai.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<p><code>demo3/ts-03-1/practice/start/label.ts</code> được chép từ JavaScript. Node chạy đúng; tsc không chấp nhận:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['31-pr-start'])}
${ra(OUT['32-pr-start-run'])}
<ol>
<li>Vì sao lời gọi ở dòng 10 là lỗi trong TypeScript trong khi Node chạy nó bình thường?</li>
<li>Gõ kiểu cho ba tham số và giá trị trả về để tệp biên dịch được. Đừng thêm mặc định cho <code>end</code> — “chưa có giờ kết thúc” phải là một trường hợp riêng.</li>
</ol>
<p><strong>Lời giải và output thật.</strong> Trong TypeScript mọi tham số đều bắt buộc trừ khi được đánh dấu, nên lời gọi hai đối số cần <code>end?</code>; phép kiểm <code>=== undefined</code> sẵn có sẽ thu hẹp nó:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['33-pr-sol'])}
<p><strong>Đạt khi:</strong> tsc không in gì và Node in hai nhãn. Code Lab có thêm bốn bài: giờ kết thúc optional, giá trị mặc định chịu được <code>null</code>, tham số rest các khoảng giờ, và cờ boolean đổi thành object tuỳ chọn.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">parameter / argument (tham số / đối số)</span><span class="v">Cái tên trong khai báo / giá trị ở chỗ gọi.</span></div>
  <div class="kv"><span class="k">optional parameter (tham số tuỳ chọn, <code>?</code>)</span><span class="v">Được bỏ qua; kiểu bên trong có thêm <code>undefined</code>. Phải đứng sau tham số bắt buộc (TS1016).</span></div>
  <div class="kv"><span class="k">default parameter (tham số mặc định)</span><span class="v">Được dùng khi đối số là <code>undefined</code> (bỏ qua hoặc truyền undefined) — không bao giờ với <code>null</code>.</span></div>
  <div class="kv"><span class="k">rest parameter (tham số rest, <code>...xs</code>)</span><span class="v">Gom các đối số còn lại vào một mảng có kiểu; phải đứng cuối.</span></div>
  <div class="kv"><span class="k">spread argument (đối số spread)</span><span class="v"><code>f(...arr)</code> — bung mảng thành các đối số; tsc cần tuple hoặc tham số rest (TS2556).</span></div>
  <div class="kv"><span class="k">options object (object tuỳ chọn)</span><span class="v">Một tham số chứa các thiết lập có tên, tuỳ chọn, thay cho các cờ theo vị trí.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>JavaScript không đếm đối số (thiếu một cái ra <code>08:00–NaN:NaN</code>); TypeScript coi mọi tham số là bắt buộc (TS2554, “Expected 2 arguments, but got 1/3”).</li>
<li><code>end?: number</code>: được bỏ qua, bên trong là <code>number | undefined</code> (TS18048/TS2345 tới khi được kiểm), phải đứng cuối (TS1016). <code>end: number | undefined</code> vẫn phải được truyền.</li>
<li>Mặc định làm tham số thành tuỳ chọn và luôn có giá trị — nhưng chỉ <code>undefined</code> kích hoạt nó; <code>seats: null</code> từ JSON đi qua và ném lỗi. Dùng <code>| null</code> + <code>??</code> khi null có thể tới.</li>
<li>Rest <code>...ranges: TimeRange[]</code> nhận bao nhiêu đối số đã kiểm cũng được; spread cần tuple hoặc tham số rest (TS2556).</li>
<li>Hai boolean liền nhau có thể bị đảo chỗ im lặng; object tuỳ chọn làm mọi lời gọi tự giải thích (TS2559, TS2561). Chú thích kiểu trả về cho hàm export.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — More on Functions', 'Tham số optional và mặc định, tham số và đối số rest, destructuring tham số. Đọc ngày 1/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/functions.html')}
${nguon('📗', 'MDN — Default parameters', 'Mặc định áp dụng khi đối số là undefined; null không kích hoạt nó. Đọc ngày 1/11/2026.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters')}
${nguon('📗', 'MDN — Rest parameters', 'Gom các đối số còn lại vào một mảng thật. Đọc ngày 1/11/2026.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters')}
${lienKet({ khoa: 'api-design', bai: 'api-3-1-offset', title: 'Cùng ý tưởng ở mép HTTP — API Design 3.1: Phân trang offset', sub: 'Giống: tham số người gọi được bỏ qua thì có giá trị mặc định (limit = 20) và giới hạn cứng, và “vắng mặt” không được lẫn với “có mặt nhưng rỗng”. Khác: bên đó Zod áp mặc định cho query string lúc chạy; ở đây tsc kiểm giá trị mặc định và danh sách tham số của một hàm TypeScript trước khi chạy bất cứ thứ gì.', cta: 'MỞ BÀI API DESIGN →' })}
</div>
`,
};
