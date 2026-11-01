/**
 * TypeScript · Chương 3 · Lab 3 — Bộ luật đặt phòng là một mảng hàm. BÀI MỚI 01/11/2026, slug typescript-3-6-lab-luat-dat-phong (đứng TRƯỚC quiz 3.5).
 * Máy chấm = scripts/cham-lab-3.mjs trong dự án LabFlow TS (tsc 7.0.2 + node 22.23.3 thật): A 2 · B 1 · C 1 · D 2 · E 8 × 0,5; đạt 7.
 * Số đo thật: khởi đầu 1/10 (tsc chỉ 2 lỗi vì Function tắt kiểm, E 2/8) · lần thử "(...args: any[]) => any" 6/10 (E 4/8) · lần thử "kiểu hàm thật,
 * toMinutes trả union, không this" 8/10 (E 6/8) · tham khảo 10/10. Mọi code/output lấy từ ./_ma-ts-lab-3.mjs (SINH TỰ ĐỘNG, đừng sửa tay).
 */
import G from '../giang/ts-lab-3.mjs';
import { ma, ra, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-lab-3.mjs';

const NPM_CI = OUT['l1-npm-ci'].split('\n').filter((l) => !/^npm notice/.test(l)).join('\n');
const GD = CODE.grader.split('\n');
const GRADER_GON = GD.slice(0, 7).concat(['// …'], GD.slice(53, 56)).join('\n');
const YEU = CODE.yeu.split('\n');
const YEU_DONG = [YEU[7], '…', YEU[30], '…', YEU[48], YEU[49], YEU[50]].join('\n');
const VUA = CODE.vua.split('\n');
const VUA_DONG = [VUA[8], VUA[9], '', VUA[11], VUA[12], '…', VUA[56]].join('\n');
const ST = CODE.starter.split('\n');
const ST_LOGIC = ST.slice(30, 46).join('\n');

const BANG_EN = `<table>
<thead><tr><th>#</th><th>Wrong use</th><th>tsc must say</th><th>The starter, run by Node</th><th>What it means</th></tr></thead>
<tbody>
<tr><td>S1</td><td>a rule written as <code>(seats: number) =&gt; …</code></td><td>TS2322</td><td><code>[]</code> — no problem found</td><td>45 seats pass a 40-seat limit: the rule compared an object with 40</td></tr>
<tr><td>S2</td><td>a rule returning <code>'TOO_LONG'</code></td><td>TS2322</td><td><code>["TOO_LONG"]</code></td><td>the UI expects <code>{ code, message }</code> and shows “undefined”</td></tr>
<tr><td>S3</td><td><code>toMinutes(['08:00'])</code> as a number</td><td>TS2322</td><td><code>+ 30</code> gives <code>"48030"</code></td><td>an array plus a number is string concatenation</td></tr>
<tr><td>S4</td><td><code>toMinutes(480)</code></td><td>TS2769</td><td>throws <code>value.map is not a function</code></td><td>crash, with a message about <code>map</code>, far from the cause</td></tr>
<tr><td>S5</td><td><code>maxSeats('30')</code></td><td>TS2345</td><td>works — by coercion</td><td>right today by luck; <code>'30' + 1</code> would be <code>'301'</code> tomorrow</td></tr>
<tr><td>S6</td><td><code>totalMinutes([480, 600], 720)</code></td><td>TS2345</td><td>throws <code>.for is not iterable</code></td><td>crash with one of V8’s least readable messages</td></tr>
<tr><td>S7</td><td><code>validate(input)</code></td><td>TS2554</td><td>throws <code>rules is not iterable</code></td><td>crash on the first request</td></tr>
<tr><td>S8</td><td><code>const run = v.run; run(input)</code></td><td>TS2684</td><td>throws <code>Cannot read properties of undefined (reading 'rules')</code></td><td>crash whenever <code>run</code> is passed as a callback</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>#</th><th>Cách dùng sai</th><th>tsc phải báo</th><th>Bản khởi đầu, Node chạy thật</th><th>Nghĩa là gì</th></tr></thead>
<tbody>
<tr><td>S1</td><td>luật viết thành <code>(seats: number) =&gt; …</code></td><td>TS2322</td><td><code>[]</code> — không thấy vấn đề</td><td>45 chỗ lọt qua giới hạn 40: luật đem cả object so với 40</td></tr>
<tr><td>S2</td><td>luật trả về <code>'TOO_LONG'</code></td><td>TS2322</td><td><code>["TOO_LONG"]</code></td><td>giao diện chờ <code>{ code, message }</code> và hiện “undefined”</td></tr>
<tr><td>S3</td><td><code>toMinutes(['08:00'])</code> dùng như số</td><td>TS2322</td><td><code>+ 30</code> ra <code>"48030"</code></td><td>mảng cộng số là nối chuỗi</td></tr>
<tr><td>S4</td><td><code>toMinutes(480)</code></td><td>TS2769</td><td>ném <code>value.map is not a function</code></td><td>sập, thông báo nói về <code>map</code>, xa nguyên nhân</td></tr>
<tr><td>S5</td><td><code>maxSeats('30')</code></td><td>TS2345</td><td>chạy — nhờ ép kiểu ngầm</td><td>hôm nay đúng nhờ may; mai <code>'30' + 1</code> thành <code>'301'</code></td></tr>
<tr><td>S6</td><td><code>totalMinutes([480, 600], 720)</code></td><td>TS2345</td><td>ném <code>.for is not iterable</code></td><td>sập với một trong những thông báo khó đọc nhất của V8</td></tr>
<tr><td>S7</td><td><code>validate(input)</code></td><td>TS2554</td><td>ném <code>rules is not iterable</code></td><td>sập ngay request đầu tiên</td></tr>
<tr><td>S8</td><td><code>const run = v.run; run(input)</code></td><td>TS2684</td><td>ném <code>Cannot read properties of undefined (reading 'rules')</code></td><td>sập mỗi khi <code>run</code> được truyền làm callback</td></tr>
</tbody>
</table>`;

const RUBRIC_EN = `<table>
<thead><tr><th>Part</th><th>Points</th><th>How the grader checks it</th><th>The habit it trains</th></tr></thead>
<tbody>
<tr><td>A — your file compiles</td><td>2</td><td><code>tsc -p</code>, course tsconfig (strict)</td><td>every parameter, including rest, has a type</td></tr>
<tr><td>B — correct uses compile</td><td>1</td><td>tsc on <code>kiem/phai-dung.ts</code>: <code>toMinutes</code> with a string and with a list, an untyped callback, a custom rule, <code>totalMinutes()</code></td><td>signatures callers can use without casts</td></tr>
<tr><td>C — honesty</td><td>1</td><td>no <code>any</code>, no <code>Function</code>, no <code>as</code> (except <code>as const</code>), no <code>!</code>, no <code>@ts-</code></td><td>a function type says what goes in and what comes out</td></tr>
<tr><td>D — behaviour</td><td>2</td><td><code>node --test</code>: 10 tests in <code>test/validate.test.ts</code></td><td>the two logic bugs no type can see</td></tr>
<tr><td>E — wrong uses refused</td><td>4 (8 × 0.5)</td><td>each marked line of <code>kiem/sai.ts</code> has the expected code</td><td>types that stop wrong callbacks, wrong arguments and a lost <code>this</code></td></tr>
</tbody>
</table>`;
const RUBRIC_VI = `<table>
<thead><tr><th>Phần</th><th>Điểm</th><th>Máy chấm kiểm thế nào</th><th>Thói quen nó rèn</th></tr></thead>
<tbody>
<tr><td>A — tệp của bạn biên dịch được</td><td>2</td><td><code>tsc -p</code>, tsconfig của khoá (strict)</td><td>mọi tham số, kể cả rest, đều có kiểu</td></tr>
<tr><td>B — cách dùng đúng biên dịch được</td><td>1</td><td>tsc trên <code>kiem/phai-dung.ts</code>: <code>toMinutes</code> với một chuỗi và với một danh sách, callback không chú thích kiểu, một luật tự viết, <code>totalMinutes()</code></td><td>chữ ký người gọi dùng được mà không cần ép kiểu</td></tr>
<tr><td>C — trung thực</td><td>1</td><td>không <code>any</code>, không <code>Function</code>, không <code>as</code> (trừ <code>as const</code>), không <code>!</code>, không <code>@ts-</code></td><td>kiểu hàm nói rõ cái gì vào, cái gì ra</td></tr>
<tr><td>D — hành vi</td><td>2</td><td><code>node --test</code>: 10 test trong <code>test/validate.test.ts</code></td><td>hai bug logic không kiểu nào thấy được</td></tr>
<tr><td>E — cách dùng sai bị từ chối</td><td>4 (8 × 0,5)</td><td>mỗi dòng đánh dấu trong <code>kiem/sai.ts</code> có lỗi đúng mã</td><td>kiểu chặn callback sai, đối số sai và <code>this</code> bị mất</td></tr>
</tbody>
</table>`;

export default {
  title: 'Lab 3 — Booking rules as an array of functions|||Lab 3 — Bộ luật đặt phòng là một mảng hàm',
  slug: 'typescript-3-6-lab-luat-dat-phong',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab Chương 3 có thang chấm 10 điểm và máy chấm chạy tsc + Node thật: module validate.ts của LabFlow kiểm một yêu cầu đặt phòng bằng một mảng luật (hàm). Bản khởi đầu dùng kiểu Function nên tsc chỉ báo 2 lỗi mà không bảo vệ gì; bạn gõ kiểu Rule = (input) => Problem | null, factory maxSeats, tham số rest, callback void, overload toMinutes và tham số this cho run — không any/Function/as/!, 10 test xanh (hai bug logic), 8 cách dùng sai bị từ chối đúng mã. Có output thật của bản khởi đầu (1/10), lần thử "any vào, any ra" (6/10), lần thử "kiểu hàm thật, không overload, không this" (8/10) và lời giải (10/10).',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lab 3</span>
<h2>Booking rules as an array of functions</h2>
<p class="lead">60–90 minutes. LabFlow checks a booking request with a list of rules — each rule is a small function that looks at the request and returns a problem or <code>null</code>. A teammate wrote the module with the type <code>Function</code> everywhere: it runs, tsc reports only two errors, and almost nothing is protected. You give every function a real type — parameters, rest parameters, a callback, overloads and <code>this</code> — until a script that runs tsc and Node gives you 10 out of 10. This is the shape of real code you will write: Express middleware, validators, event handlers and React callbacks are all “functions passed around”.</p>

<h3>What this lab trains</h3>
<ul>
<li><strong>Lesson 3.1</strong> — a required parameter, an optional callback <code>onProblem?</code>, a rest parameter <code>...ranges: TimeRange[]</code>.</li>
<li><strong>Lesson 3.2</strong> — a function type <code>type Rule = (input: BookingInput) =&gt; Problem | null</code>, an array of rules, and <code>maxSeats(limit)</code>, a function that returns a rule.</li>
<li><strong>Lesson 3.3</strong> — overloads for <code>toMinutes</code> (one string in, one number out; a list in, a list out) and a <code>void</code> callback whose result is ignored.</li>
<li><strong>Lesson 3.4</strong> — a <code>this</code> parameter so that <code>run</code> cannot be torn off its validator.</li>
</ul>

<h3>Setup</h3>
<ol>
<li>Use <code>labflow-ts</code> at the end of Chapter 3 and install the pinned versions:
${ra(NPM_CI)}</li>
<li>The reference solution is <code>src/rules/validate.ts</code> (with 10 tests). Don’t open it before you have tried; you work only in <code>lab3/src/validate.ts</code>. The reference is healthy:
${ra(OUT['l2-ref-check'])}</li>
<li>The lab’s tsconfig only extends the course one:
${ma('json', CODE.labTsconfig)}</li>
<li>Your starting point — the teammate’s file:
${ma('typescript', CODE.starter)}</li>
</ol>

<h3>Only two errors — and why that is bad news</h3>
${ra(OUT['l4-strict'])}
<p>Two implicit-any parameters (TS7006 for <code>limit</code>, TS7019 for the rest parameter <code>ranges</code>). Everything else compiles — not because it is correct, but because <code>type Rule = Function</code> switches checking off. Calling a value of type <code>Function</code> accepts any arguments and returns <code>any</code>; an array of <code>Function</code> accepts any function at all. The <code>onProblem?: Function</code> parameter does the same to every callback passed in. Lesson 3.2 measured this: <code>Function</code> is the function-shaped cousin of <code>any</code>.</p>

<h3>The grader</h3>
<p><code>npm run lab3</code> runs <code>scripts/cham-lab-3.mjs</code>. It copies your <code>validate.ts</code> plus the course’s <code>time.ts</code>, <code>booking.ts</code> and <code>schedule.ts</code> into a fresh folder beside its own tests. Part C now also refuses the word <code>Function</code> as a type:</p>
${ma('javascript', GRADER_GON)}
<p>Correct uses that must keep compiling (part B). Notice line 13: the callback <code>(p) =&gt; log.push(p)</code> has no annotation — it gets its type from <code>onProblem</code>’s declaration (contextual typing), and <code>push</code> returns a number that a <code>void</code> callback is allowed to ignore (lesson 3.3):</p>
${ma('typescript', CODE.dung)}
<p>Run the grader on the starter:</p>
${ra(OUT['l5-starter'])}
<p><strong>1 out of 10.</strong> Look at B: with <code>onProblem?: Function</code> there is no context, so <code>(p) =&gt; …</code> is an implicit <code>any</code> (TS7006) — a loose type upstream makes correct code downstream fail. D: three tests fail because of two logic bugs (below). E: only S3 and S7 are refused — and S3 only because the union return type <code>number | number[]</code> cannot go into a <code>number</code>.</p>
<p>The two logic bugs, both in plain sight:</p>
${ma('typescript', ST_LOGIC)}
<ul>
<li><code>seats &gt;= limit</code> — exactly 40 seats is a problem for a 40-seat limit. (Chapter 1’s <code>&gt;=</code> trap, again: tsc cannot know.)</li>
<li><code>return [problem]</code> inside the loop — <code>validate</code> stops at the first problem, so a request with three problems shows one, and <code>onProblem</code> hears only that one.</li>
</ul>

<h3>Your task</h3>
<p>Edit <strong>only</strong> <code>lab3/src/validate.ts</code> until <code>npm run lab3</code> prints <strong>Score: 10/10</strong>: compiles under strict; no <code>any</code>, <code>Function</code>, <code>as</code> (except <code>as const</code>), <code>!</code> or <code>@ts-</code>; the 10 tests pass; the 8 wrong uses below are refused with the expected codes. Start from the sentence each function says — “a rule takes the whole request and returns a problem or null”, “one time in, one number out; a list in, a list out”, “run must be called on its validator” — and turn each sentence into a type.</p>

<h3>The eight wrong uses</h3>
${ma('typescript', CODE.sai)}
<p>The same eight, run by Node against the starter:</p>
${ma('typescript', CODE.saiChay)}
${ra(OUT['l6-sai-chay'])}
${BANG_EN}
<p>Four crashes, four silent results. The most dangerous is S1: a rule written against the wrong parameter <em>quietly approves</em> 45 seats. A <code>Function</code>-typed array can never catch it, because <code>Function</code> does not know what a rule receives.</p>

<h3>What first attempts usually look like</h3>
<p><strong>Attempt A — “anything in, anything out”</strong> (<code>lab3/yeu/</code>). The two logic bugs are fixed; the types became <code>any</code>:</p>
${ma('typescript', YEU_DONG)}
${ra(OUT['l7-yeu'])}
<div class="pitfall co-tieu-de">
<p><strong>Trap — <code>(...args: any[]) =&gt; any</code> is <code>Function</code> with extra steps.</strong> 6/10 and not a pass: S1 and S2 still slip through because a rule may now take <em>anything</em> and return <em>anything</em>, and S8 slips because nothing says what <code>this</code> must be. And look at <code>[start = 0, end = 0]</code>: once a range is <code>number[]</code> instead of a <code>TimeRange</code>, the code invents defaults — the Lab 2 smell again.</p>
</div>
<p><strong>Attempt B — real function types, no overloads, no <code>this</code></strong> (<code>lab3/vua/</code>):</p>
${ma('typescript', VUA_DONG)}
${ra(OUT['l8-vua'])}
<p>8/10 — a pass. With <code>Rule</code> written out, S1, S2, S5, S6 and S7 are refused. Two things remain. <strong>S4</strong> is refused, but with TS2345 instead of TS2769: without overloads, <code>toMinutes(value: string | string[])</code> says “wrong argument”, and — worse — part B fails because every caller of <code>toMinutes('08:00')</code> receives <code>number | number[]</code> and has to narrow a value that can only ever be a number. <strong>S8</strong> compiles because nothing tells tsc that <code>run</code> needs its validator; it crashes at runtime exactly as the table shows.</p>

<h3>Rubric (10 points, pass mark 7)</h3>
${RUBRIC_EN}

<h3>Hints — open one at a time</h3>
<ol>
<li>Write the sentence as a type: <code>export type Rule = (input: BookingInput) =&gt; Problem | null;</code> then annotate each rule constant with <code>: Rule</code> — its parameter types come from the annotation (contextual typing).</li>
<li><code>maxSeats(limit: number): Rule</code> returns an arrow function; inside it <code>limit</code> is remembered by the closure.</li>
<li><code>rules: readonly Rule[]</code>, <code>onProblem?: (problem: Problem) =&gt; void</code>, call it with <code>onProblem?.(problem)</code>. Then fix the two logic bugs the tests show.</li>
<li><code>totalMinutes(...ranges: TimeRange[]): number</code> — a rest parameter is always an array type; each element is a <code>TimeRange</code> from Chapter 2.</li>
<li>Overloads: two signatures without bodies (<code>(text: string): number</code> and <code>(texts: readonly string[]): number[]</code>), then one implementation signature that covers both. Callers only see the first two.</li>
<li><code>type Validator = { rules: readonly Rule[]; run(this: Validator, input: BookingInput): Problem[] }</code> and give <code>createValidator</code> the return type <code>Validator</code>.</li>
</ol>

<h3>Reference solution (read after trying)</h3>
${ma('typescript', CODE.ref)}
${ra(OUT['l9-ref'])}
<p>Ten out of ten. Three things to notice:</p>
<ul>
<li><strong>One function type does most of the work.</strong> <code>Rule</code> appears in five places — the rule constants, <code>maxSeats</code>’s return, <code>RULES</code>, <code>validate</code>’s parameter, <code>Validator</code> — and refuses S1 and S2 everywhere at once.</li>
<li><strong>Overloads are a promise per input shape.</strong> The implementation still returns <code>number | number[]</code>; the overload list tells each caller the precise half. That is what makes part B and S3/S4 work.</li>
<li><strong><code>this: Validator</code> is erased.</strong> Node never sees it; it only makes tsc refuse <code>const run = v.run; run(input)</code> with TS2684 — the crash in row S8, moved to compile time.</li>
</ul>

<h3>Before you call it done</h3>
<ul>
<li><code>npm run lab3</code> prints <strong>Score: 10/10</strong>.</li>
<li><code>npx tsc -p lab3</code> is clean — tests and correct uses included.</li>
<li>No <code>any</code>, no <code>Function</code>; every rule constant is annotated <code>: Rule</code>.</li>
<li>You can say which line of your file refuses each of S1–S8.</li>
<li>Commit: <code>feat(validate): typed rule list, overloads and this (lab 3: 10/10)</code>.</li>
</ul>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">function type</span><span class="v"><code>(input: BookingInput) =&gt; Problem | null</code>: what goes in, what comes out.</span></div>
  <div class="kv"><span class="k">Function (the type)</span><span class="v">“Some function”: callable with anything, returns <code>any</code>. Avoid it.</span></div>
  <div class="kv"><span class="k">rule factory / closure</span><span class="v">A function that returns a function and remembers its arguments: <code>maxSeats(40)</code>.</span></div>
  <div class="kv"><span class="k">rest parameter</span><span class="v"><code>...ranges: TimeRange[]</code>: any number of arguments, received as an array.</span></div>
  <div class="kv"><span class="k">overload signatures</span><span class="v">Several call shapes for one function; callers see them, not the implementation signature.</span></div>
  <div class="kv"><span class="k">this parameter</span><span class="v">A fake first parameter that tells tsc what <code>this</code> must be; erased before running.</span></div>
</div>

<h3>🗺 How the grader scores you</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Copy</div><div class="lz-d">your validate.ts + the course time/booking/schedule</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Compile</div><div class="lz-d">strict tsc, then the correct uses (A, B)</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Scan</div><div class="lz-d">no any, Function, as, ! or @ts- (C)</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Run</div><div class="lz-d">node --test, 10 behaviour tests (D)</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Attack</div><div class="lz-d">8 wrong uses, each with its expected code (E)</div></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A module typed with <code>Function</code> compiled with 2 errors and refused 2 of 8 wrong uses: few errors can mean little checking.</li>
<li><code>(...args: any[]) =&gt; any</code> is the same hole with more characters (6/10).</li>
<li>One honest function type, <code>Rule</code>, refuses wrong rules everywhere it is used; overloads and a <code>this</code> parameter took the module from 8 to 10.</li>
<li>Logic bugs (<code>&gt;=</code>, an early <code>return</code>) are invisible to any type — the tests found them.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — More on Functions', 'Function type expressions, optional and rest parameters, overloads, declaring this, void. Read 1 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/functions.html')}
${nguon('⚙️', 'TSConfig reference — noImplicitThis', 'Why this inside a plain function is an error under strict. Read 1 Nov 2026.', 'https://www.typescriptlang.org/tsconfig/#noImplicitThis')}
${nguon('🟦', 'MDN — Rest parameters', 'How JavaScript collects extra arguments into an array. Read 1 Nov 2026.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Lab 3</span>
<h2>Bộ luật đặt phòng là một mảng hàm</h2>
<p class="lead">60–90 phút. LabFlow kiểm một yêu cầu đặt phòng bằng một danh sách luật — mỗi luật là một hàm nhỏ nhìn yêu cầu rồi trả về một vấn đề hoặc <code>null</code>. Bạn cùng nhóm viết module với kiểu <code>Function</code> ở khắp nơi: nó chạy, tsc chỉ báo hai lỗi, và gần như không có gì được bảo vệ. Bạn đặt cho từng hàm một kiểu thật — tham số, tham số rest, callback, overload và <code>this</code> — cho tới khi một script chạy tsc và Node cho bạn 10 trên 10. Đây là hình dạng code thật bạn sẽ viết: middleware Express, bộ kiểm dữ liệu, hàm xử lý sự kiện và callback React đều là “hàm được truyền đi truyền lại”.</p>

<h3>Lab này rèn gì</h3>
<ul>
<li><strong>Bài 3.1</strong> — tham số bắt buộc, callback tuỳ chọn <code>onProblem?</code>, tham số rest <code>...ranges: TimeRange[]</code>.</li>
<li><strong>Bài 3.2</strong> — kiểu hàm <code>type Rule = (input: BookingInput) =&gt; Problem | null</code>, mảng luật, và <code>maxSeats(limit)</code> — hàm trả về một luật.</li>
<li><strong>Bài 3.3</strong> — overload cho <code>toMinutes</code> (một chuỗi vào, một số ra; một danh sách vào, một danh sách ra) và callback <code>void</code> mà kết quả bị bỏ qua.</li>
<li><strong>Bài 3.4</strong> — tham số <code>this</code> để <code>run</code> không thể bị tách khỏi validator của nó.</li>
</ul>

<h3>Chuẩn bị</h3>
<ol>
<li>Dùng <code>labflow-ts</code> ở cuối Chương 3 và cài đúng các bản đã ghim:
${ra(NPM_CI)}</li>
<li>Lời giải tham khảo là <code>src/rules/validate.ts</code> (kèm 10 test). Đừng mở trước khi tự làm; bạn chỉ làm trong <code>lab3/src/validate.ts</code>. Bản tham khảo đang khoẻ:
${ra(OUT['l2-ref-check'])}</li>
<li>tsconfig của lab chỉ kế thừa tsconfig của khoá:
${ma('json', CODE.labTsconfig)}</li>
<li>Điểm xuất phát — tệp của bạn cùng nhóm:
${ma('typescript', CODE.starter)}</li>
</ol>

<h3>Chỉ hai lỗi — và vì sao đó là tin xấu</h3>
${ra(OUT['l4-strict'])}
<p>Hai tham số any ngầm (TS7006 cho <code>limit</code>, TS7019 cho tham số rest <code>ranges</code>). Mọi thứ khác đều biên dịch được — không phải vì đúng, mà vì <code>type Rule = Function</code> tắt việc kiểm. Gọi một giá trị kiểu <code>Function</code> thì nhận đối số gì cũng được và trả về <code>any</code>; mảng <code>Function</code> nhận bất kỳ hàm nào. Tham số <code>onProblem?: Function</code> làm y như vậy với mọi callback truyền vào. Bài 3.2 đã đo: <code>Function</code> là anh em hình-hàm của <code>any</code>.</p>

<h3>Máy chấm</h3>
<p><code>npm run lab3</code> chạy <code>scripts/cham-lab-3.mjs</code>. Nó chép <code>validate.ts</code> của bạn cùng <code>time.ts</code>, <code>booking.ts</code> và <code>schedule.ts</code> của khoá vào một thư mục mới cạnh bộ test của nó. Phần C giờ từ chối thêm chữ <code>Function</code> dùng làm kiểu:</p>
${ma('javascript', GRADER_GON)}
<p>Những cách dùng đúng phải tiếp tục biên dịch được (phần B). Để ý dòng 13: callback <code>(p) =&gt; log.push(p)</code> không có chú thích kiểu — nó lấy kiểu từ khai báo của <code>onProblem</code> (contextual typing — kiểu theo ngữ cảnh), và <code>push</code> trả về một số mà callback <code>void</code> được phép bỏ qua (bài 3.3):</p>
${ma('typescript', CODE.dung)}
<p>Chạy máy chấm trên bản khởi đầu:</p>
${ra(OUT['l5-starter'])}
<p><strong>1 trên 10.</strong> Nhìn phần B: với <code>onProblem?: Function</code> không có ngữ cảnh nào, nên <code>(p) =&gt; …</code> thành <code>any</code> ngầm (TS7006) — kiểu lỏng ở thượng nguồn làm code đúng ở hạ nguồn hỏng. D: ba test hỏng vì hai bug logic (bên dưới). E: chỉ S3 và S7 bị từ chối — và S3 chỉ vì kiểu trả về union <code>number | number[]</code> không gán được vào <code>number</code>.</p>
<p>Hai bug logic, nằm ngay trước mắt:</p>
${ma('typescript', ST_LOGIC)}
<ul>
<li><code>seats &gt;= limit</code> — đúng 40 chỗ lại thành vấn đề với giới hạn 40 chỗ. (Lại là bẫy <code>&gt;=</code> của Chương 1: tsc không thể biết.)</li>
<li><code>return [problem]</code> nằm trong vòng lặp — <code>validate</code> dừng ở vấn đề đầu tiên, nên một yêu cầu có ba vấn đề chỉ hiện một, và <code>onProblem</code> chỉ nghe được một.</li>
</ul>

<h3>Nhiệm vụ</h3>
<p>Chỉ sửa <code>lab3/src/validate.ts</code> cho tới khi <code>npm run lab3</code> in <strong>Score: 10/10</strong>: biên dịch được dưới strict; không <code>any</code>, <code>Function</code>, <code>as</code> (trừ <code>as const</code>), <code>!</code> hay <code>@ts-</code>; 10 test qua; 8 cách dùng sai dưới đây bị từ chối đúng mã. Bắt đầu từ câu mà mỗi hàm muốn nói — “một luật nhận cả yêu cầu và trả về một vấn đề hoặc null”, “một giờ vào, một số ra; một danh sách vào, một danh sách ra”, “run phải được gọi trên validator của nó” — rồi biến mỗi câu thành một kiểu.</p>

<h3>Tám cách dùng sai</h3>
${ma('typescript', CODE.sai)}
<p>Cũng tám cách đó, Node chạy thật trên bản khởi đầu:</p>
${ma('typescript', CODE.saiChay)}
${ra(OUT['l6-sai-chay'])}
${BANG_VI}
<p>Bốn lần sập, bốn kết quả im lặng. Nguy hiểm nhất là S1: một luật viết nhầm tham số <em>lặng lẽ duyệt</em> 45 chỗ. Mảng kiểu <code>Function</code> không bao giờ bắt được nó, vì <code>Function</code> không biết một luật nhận vào cái gì.</p>

<h3>Những lần thử đầu tiên thường trông thế nào</h3>
<p><strong>Lần thử A — “gì vào cũng được, gì ra cũng được”</strong> (<code>lab3/yeu/</code>). Hai bug logic đã sửa; kiểu thành <code>any</code>:</p>
${ma('typescript', YEU_DONG)}
${ra(OUT['l7-yeu'])}
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — <code>(...args: any[]) =&gt; any</code> chính là <code>Function</code> viết dài hơn.</strong> 6/10 và chưa đạt: S1 và S2 vẫn lọt vì giờ một luật được nhận <em>bất cứ gì</em> và trả về <em>bất cứ gì</em>, còn S8 lọt vì không gì nói <code>this</code> phải là gì. Và nhìn <code>[start = 0, end = 0]</code>: khi khoảng giờ là <code>number[]</code> thay vì <code>TimeRange</code>, code lại bịa giá trị mặc định — đúng mùi code của Lab 2.</p>
</div>
<p><strong>Lần thử B — kiểu hàm thật, không overload, không <code>this</code></strong> (<code>lab3/vua/</code>):</p>
${ma('typescript', VUA_DONG)}
${ra(OUT['l8-vua'])}
<p>8/10 — đạt. Khi <code>Rule</code> được viết ra, S1, S2, S5, S6 và S7 bị từ chối. Còn hai chỗ. <strong>S4</strong> bị từ chối, nhưng với TS2345 thay vì TS2769: không có overload, <code>toMinutes(value: string | string[])</code> chỉ nói “sai đối số”, và — tệ hơn — phần B hỏng vì mọi chỗ gọi <code>toMinutes('08:00')</code> nhận <code>number | number[]</code> và phải thu hẹp một giá trị vốn chỉ có thể là số. <strong>S8</strong> biên dịch được vì không gì nói cho tsc biết <code>run</code> cần validator của nó; nó sập lúc chạy đúng như bảng trên.</p>

<h3>Thang chấm (10 điểm, đạt 7)</h3>
${RUBRIC_VI}

<h3>Gợi ý — mở từng cái một</h3>
<ol>
<li>Viết câu thành kiểu: <code>export type Rule = (input: BookingInput) =&gt; Problem | null;</code> rồi chú thích từng hằng luật bằng <code>: Rule</code> — kiểu tham số của nó lấy từ chú thích đó (kiểu theo ngữ cảnh).</li>
<li><code>maxSeats(limit: number): Rule</code> trả về một arrow function; bên trong, <code>limit</code> được closure ghi nhớ.</li>
<li><code>rules: readonly Rule[]</code>, <code>onProblem?: (problem: Problem) =&gt; void</code>, gọi bằng <code>onProblem?.(problem)</code>. Rồi sửa hai bug logic mà test chỉ ra.</li>
<li><code>totalMinutes(...ranges: TimeRange[]): number</code> — tham số rest luôn có kiểu mảng; mỗi phần tử là một <code>TimeRange</code> của Chương 2.</li>
<li>Overload: hai chữ ký không thân (<code>(text: string): number</code> và <code>(texts: readonly string[]): number[]</code>), rồi một chữ ký cài đặt bao cả hai. Người gọi chỉ thấy hai chữ ký đầu.</li>
<li><code>type Validator = { rules: readonly Rule[]; run(this: Validator, input: BookingInput): Problem[] }</code> và cho <code>createValidator</code> kiểu trả về <code>Validator</code>.</li>
</ol>

<h3>Lời giải tham khảo (đọc sau khi đã thử)</h3>
${ma('typescript', CODE.ref)}
${ra(OUT['l9-ref'])}
<p>Mười trên mười. Ba điều đáng để ý:</p>
<ul>
<li><strong>Một kiểu hàm làm phần lớn công việc.</strong> <code>Rule</code> xuất hiện ở năm chỗ — các hằng luật, kiểu trả về của <code>maxSeats</code>, <code>RULES</code>, tham số của <code>validate</code>, <code>Validator</code> — và từ chối S1, S2 ở mọi chỗ cùng lúc.</li>
<li><strong>Overload là một lời hứa cho mỗi hình dạng đầu vào.</strong> Phần cài đặt vẫn trả <code>number | number[]</code>; danh sách overload cho mỗi người gọi biết chính xác nửa nào. Nhờ đó phần B và S3/S4 chạy đúng.</li>
<li><strong><code>this: Validator</code> bị xoá.</strong> Node không bao giờ thấy nó; nó chỉ khiến tsc từ chối <code>const run = v.run; run(input)</code> với TS2684 — lần sập ở dòng S8 được dời về lúc biên dịch.</li>
</ul>

<h3>Trước khi coi là xong</h3>
<ul>
<li><code>npm run lab3</code> in <strong>Score: 10/10</strong>.</li>
<li><code>npx tsc -p lab3</code> sạch — kể cả test và các cách dùng đúng.</li>
<li>Không <code>any</code>, không <code>Function</code>; mọi hằng luật đều chú thích <code>: Rule</code>.</li>
<li>Bạn chỉ ra được dòng nào trong tệp của mình từ chối từng S1–S8.</li>
<li>Commit: <code>feat(validate): typed rule list, overloads and this (lab 3: 10/10)</code>.</li>
</ul>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">function type (kiểu hàm)</span><span class="v"><code>(input: BookingInput) =&gt; Problem | null</code>: cái gì vào, cái gì ra.</span></div>
  <div class="kv"><span class="k">Function (kiểu)</span><span class="v">“Một hàm nào đó”: gọi với gì cũng được, trả về <code>any</code>. Tránh dùng.</span></div>
  <div class="kv"><span class="k">rule factory / closure (hàm tạo luật / bao đóng)</span><span class="v">Hàm trả về một hàm và nhớ đối số của nó: <code>maxSeats(40)</code>.</span></div>
  <div class="kv"><span class="k">rest parameter (tham số rest)</span><span class="v"><code>...ranges: TimeRange[]</code>: bao nhiêu đối số cũng được, nhận dưới dạng mảng.</span></div>
  <div class="kv"><span class="k">overload signatures (chữ ký overload)</span><span class="v">Nhiều hình dạng lời gọi cho một hàm; người gọi thấy chúng, không thấy chữ ký cài đặt.</span></div>
  <div class="kv"><span class="k">this parameter (tham số this)</span><span class="v">Một tham số đầu “giả” nói cho tsc biết <code>this</code> phải là gì; bị xoá trước khi chạy.</span></div>
</div>

<h3>🗺 Máy chấm cho điểm thế nào</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Chép</div><div class="lz-d">validate.ts của bạn + time/booking/schedule của khoá</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Biên dịch</div><div class="lz-d">tsc strict, rồi các cách dùng đúng (A, B)</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Quét</div><div class="lz-d">không any, Function, as, ! hay @ts- (C)</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Chạy</div><div class="lz-d">node --test, 10 test hành vi (D)</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Tấn công</div><div class="lz-d">8 cách dùng sai, mỗi cái đúng mã lỗi (E)</div></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Module gõ kiểu bằng <code>Function</code> biên dịch với 2 lỗi và chỉ từ chối 2 trên 8 cách dùng sai: ít lỗi có thể nghĩa là ít được kiểm.</li>
<li><code>(...args: any[]) =&gt; any</code> là cùng một lỗ hổng, chỉ nhiều ký tự hơn (6/10).</li>
<li>Một kiểu hàm trung thực, <code>Rule</code>, từ chối luật sai ở mọi nơi nó được dùng; overload và tham số <code>this</code> đưa module từ 8 lên 10.</li>
<li>Bug logic (<code>&gt;=</code>, một <code>return</code> sớm) vô hình với mọi kiểu — bộ test đã tìm ra chúng.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — More on Functions', 'Kiểu biểu thức hàm, tham số tuỳ chọn và rest, overload, khai báo this, void. Đọc ngày 01/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/functions.html')}
${nguon('⚙️', 'TSConfig reference — noImplicitThis', 'Vì sao this trong hàm thường là lỗi dưới strict. Đọc ngày 01/11/2026.', 'https://www.typescriptlang.org/tsconfig/#noImplicitThis')}
${nguon('🟦', 'MDN — Rest parameters', 'JavaScript gom các đối số thừa vào một mảng như thế nào. Đọc ngày 01/11/2026.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters')}
</div>
`,
};
