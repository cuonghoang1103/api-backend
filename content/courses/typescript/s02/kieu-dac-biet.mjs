/**
 * TypeScript · Chương 2 · 2.3 — Các kiểu đặc biệt: any, unknown, never, void. Slug giữ: typescript-2-3-kieu-dac-biet.
 * Soạn lại 01/11/2026 (sau đợt mẫu e335e39fd). Mọi code/output lấy từ ./_ma-ts-02-3.mjs (sinh từ labflow-ts chạy thật: Node 22.23.3, tsc 7.0.2).
 * any/unknown đã dạy kỹ ở 1.4 ⇒ ở đây chỉ đặt chúng vào bảng thứ bậc; trọng tâm: void, never (fail, kiểm vét cạn, bẫy never[]), object/{}.
 * Ghi chú "website này": bản cũ nói backend dùng never trên union content-type — grep 01/11 KHÔNG thấy; thật ra là app desktop
 * (desktop/src/main/nhac/maHoa.ts:293, desktop/src/renderer/components/UpdatePanel.tsx:238) ⇒ đã sửa.
 */
import G from '../giang/ts-02-3.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-02-3.mjs';

const DAY_TOP = CODE.day.split('\n').slice(0, 8).join('\n');
const PR_STEP1_RUN = OUT['25-pr-step1'];
const PR_STEP1_SHORT = CODE.prStep1.split('\n').slice(0, 13).join('\n');
const PR_SOL_SHORT = CODE.prSol.split('\n').slice(4, 9).concat(['    // … the never check, unchanged …']).join('\n');
// Hai biến thể chỉ khác phần cuối switch ⇒ chỉ trích dòng khác (bỏ 4 case giống hệt v1).
const DEF_L = CODE.def.split('\n');
const DEF_SHORT = [DEF_L[0], DEF_L[3], DEF_L[4], '    // … the same four cases …', DEF_L[9], DEF_L[10], DEF_L[11]].join('\n');
const NORET_L = CODE.noret.split('\n');
const NORET_SHORT = [NORET_L[0], NORET_L[3], NORET_L[4], '    // … the same four cases, then nothing …', NORET_L[9], NORET_L[10]].join('\n');

// Hai chỗ thật trong mã nguồn app desktop của website (chép đúng dòng, không chạy lại ở đây).
const SITE_NEVER = [
  '// desktop/src/main/nhac/maHoa.ts (line 293) — export formats of the music app',
  '    default: {',
  '      const x: never = cai.dinhDang;',
  '      throw new Error(...);',
  '    }',
  '',
  '// desktop/src/renderer/components/UpdatePanel.tsx (line 238) — app update states',
  'function assertNever(value: never): never {',
  '  throw new Error(...);',
  '}',
].join('\n');

const BANG_HE_EN = `<table>
<thead><tr><th>Assignment</th><th>Allowed?</th><th>Why</th></tr></thead>
<tbody>
<tr><td>anything → <code>unknown</code></td><td>✅</td><td><code>unknown</code> is the <strong>top</strong>: every value fits in it (31, 'BE-201', null…)</td></tr>
<tr><td><code>unknown</code> → <code>string</code></td><td>❌ TS2322</td><td>you must check what it is first (lesson 1.4)</td></tr>
<tr><td><code>never</code> → <code>string</code>, <code>number</code>, anything</td><td>✅</td><td><code>never</code> is the <strong>bottom</strong>: it fits in every type</td></tr>
<tr><td><code>31</code> → <code>never</code></td><td>❌ TS2322</td><td>no value at all has type <code>never</code></td></tr>
<tr><td><code>any</code> → <code>string</code>, <code>number</code></td><td>✅ (no check)</td><td><code>any</code> switches the table off…</td></tr>
<tr><td><code>any</code> → <code>never</code></td><td>❌ TS2322</td><td>…except here: not even <code>any</code> fits into <code>never</code></td></tr>
</tbody>
</table>`;
const BANG_HE_VI = `<table>
<thead><tr><th>Phép gán</th><th>Được không?</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>mọi thứ → <code>unknown</code></td><td>✅</td><td><code>unknown</code> là <strong>đỉnh</strong>: giá trị nào cũng vừa (31, 'BE-201', null…)</td></tr>
<tr><td><code>unknown</code> → <code>string</code></td><td>❌ TS2322</td><td>phải kiểm nó là gì trước (bài 1.4)</td></tr>
<tr><td><code>never</code> → <code>string</code>, <code>number</code>, mọi kiểu</td><td>✅</td><td><code>never</code> là <strong>đáy</strong>: nó vừa với mọi kiểu</td></tr>
<tr><td><code>31</code> → <code>never</code></td><td>❌ TS2322</td><td>không có giá trị nào mang kiểu <code>never</code></td></tr>
<tr><td><code>any</code> → <code>string</code>, <code>number</code></td><td>✅ (không kiểm)</td><td><code>any</code> tắt cả bảng này…</td></tr>
<tr><td><code>any</code> → <code>never</code></td><td>❌ TS2322</td><td>…trừ chỗ này: kể cả <code>any</code> cũng không vừa <code>never</code></td></tr>
</tbody>
</table>`;

const BANG_SWITCH_EN = `<table>
<thead><tr><th>How the switch ends</th><th>tsc after LAB_CLOSED is added</th><th>What the user sees</th></tr></thead>
<tbody>
<tr><td>plain JavaScript, no default</td><td>— (no compiler)</td><td>“Booking refused: undefined”</td></tr>
<tr><td><code>default: return 'Something is wrong…'</code></td><td><strong>exit 0, silent</strong></td><td>a vague message, forever</td></tr>
<tr><td>no default, return type <code>: string</code></td><td>TS2366 “Function lacks ending return statement…”</td><td>nothing — caught, but the message does not say which case</td></tr>
<tr><td><code>const unreachable: never = code</code></td><td>TS2322 <strong>Type '"LAB_CLOSED"' is not assignable to type 'never'</strong></td><td>nothing — caught, and the missing value is named</td></tr>
</tbody>
</table>`;
const BANG_SWITCH_VI = `<table>
<thead><tr><th>Switch kết thúc thế nào</th><th>tsc sau khi thêm LAB_CLOSED</th><th>Người dùng thấy gì</th></tr></thead>
<tbody>
<tr><td>JavaScript thuần, không default</td><td>— (không có trình biên dịch)</td><td>“Booking refused: undefined”</td></tr>
<tr><td><code>default: return 'Something is wrong…'</code></td><td><strong>exit 0, im lặng</strong></td><td>một câu mơ hồ, mãi mãi</td></tr>
<tr><td>không default, kiểu trả về <code>: string</code></td><td>TS2366 “Function lacks ending return statement…”</td><td>không gì — đã bắt, nhưng lỗi không nói thiếu nhánh nào</td></tr>
<tr><td><code>const unreachable: never = code</code></td><td>TS2322 <strong>Type '"LAB_CLOSED"' is not assignable to type 'never'</strong></td><td>không gì — đã bắt, và gọi đúng tên giá trị bị thiếu</td></tr>
</tbody>
</table>`;

const BANG_KHI_EN = `<table>
<thead><tr><th>You want to say…</th><th>Write</th><th>Example in LabFlow</th></tr></thead>
<tbody>
<tr><td>“this value comes from outside, check it before use”</td><td><code>unknown</code></td><td>the result of <code>JSON.parse</code> on a request body (1.2, 1.4)</td></tr>
<tr><td>“this function only does something; there is nothing to use”</td><td><code>: void</code></td><td><code>logBooking</code>, an audit log, a callback for <code>forEach</code></td></tr>
<tr><td>“this function never comes back”</td><td><code>: never</code></td><td><code>fail(message)</code>, which always throws</td></tr>
<tr><td>“every case must be handled”</td><td><code>const unreachable: never = x</code> in <code>default</code></td><td><code>slotMessage(code)</code>, a status label</td></tr>
</tbody>
</table>`;
const BANG_KHI_VI = `<table>
<thead><tr><th>Bạn muốn nói…</th><th>Viết</th><th>Ví dụ trong LabFlow</th></tr></thead>
<tbody>
<tr><td>“giá trị này đến từ bên ngoài, kiểm rồi mới dùng”</td><td><code>unknown</code></td><td>kết quả <code>JSON.parse</code> của body request (1.2, 1.4)</td></tr>
<tr><td>“hàm này chỉ làm một việc; không có gì để dùng”</td><td><code>: void</code></td><td><code>logBooking</code>, ghi nhật ký, callback của <code>forEach</code></td></tr>
<tr><td>“hàm này không bao giờ quay lại”</td><td><code>: never</code></td><td><code>fail(message)</code>, luôn ném lỗi</td></tr>
<tr><td>“mọi trường hợp phải được xử lý”</td><td><code>const unreachable: never = x</code> trong <code>default</code></td><td><code>slotMessage(code)</code>, nhãn trạng thái</td></tr>
</tbody>
</table>`;

export default {
  title: '2.3 — The special types: any, unknown, never, void|||2.3 — Các kiểu đặc biệt: any, unknown, never, void',
  slug: 'typescript-2-3-kieu-dac-biet',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bốn kiểu không mô tả dữ liệu thường mà mô tả tình huống, đo thật trên LabFlow: thứ bậc kiểu (unknown đỉnh, never đáy, any phá bảng — trừ việc gán vào never), void khác undefined (TS2322, lúc chạy vẫn là undefined), hàm luôn ném lỗi: function declaration bị suy ra void còn arrow ra never, kiểm vét cạn bằng never khi đồng đội thêm mã LAB_CLOSED (JS in "undefined", default im lặng, TS2366, TS2322 gọi đúng tên), bẫy mảng rỗng never[] (TS2345), object vs {} vs Object.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>The special types: any, unknown, never, void</h2>
<p class="lead">Most types describe data: a number of seats, a lab code, a booking. Four types describe <em>situations</em> instead: “could be anything” (<code>unknown</code>), “stop checking” (<code>any</code>), “nothing to use here” (<code>void</code>) and “this cannot happen” (<code>never</code>). This lesson puts them on one map and, with real compiler output, turns <code>never</code> into the most practical tool of the chapter: when a teammate adds a new code to LabFlow, tsc lists every place you forgot to update.</p>

<h3>What you will be able to do, and why it matters</h3>
<ul>
<li><strong>Place every special type on the type hierarchy</strong> — top, bottom, and the one that breaks the rules — and predict which assignments tsc accepts.</li>
<li><strong>Use <code>void</code> correctly</strong> for functions that only do something, and know why it is not the same as <code>undefined</code>.</li>
<li><strong>Write a <code>fail()</code> helper typed <code>never</code></strong> — and avoid the surprise where tsc infers <code>void</code> for it.</li>
<li><strong>Make a forgotten case a compile error</strong> with an exhaustive <code>switch</code>. In a group project this is what saves you when someone adds a status (<code>CANCELLED</code>, <code>CHECKED_IN</code>…) the night before the demo.</li>
<li><strong>Fix the <code>never[]</code> trap</strong> that makes an empty list refuse every <code>push</code>.</li>
</ul>

<h3>Two you already know: any and unknown</h3>
<p>Lesson 1.4 measured both: <code>any</code> switches checking off for a value and everything it touches; <code>unknown</code> accepts any value but lets you use it only after a check — the type for <code>JSON.parse</code> and anything from outside. Here they only take their place on the map.</p>

<h3>The type hierarchy: a top and a bottom</h3>
<p>Think of a type as a <strong>set of values</strong>: <code>number</code> is every number, <code>'STUDENT' | 'LECTURER' | 'ADMIN'</code> is three strings. Assigning <code>a = b</code> is allowed when every value of <code>b</code>’s type is also in <code>a</code>’s. Two sets are special: the set of <em>everything</em> (<code>unknown</code>, the top) and the <em>empty</em> set (<code>never</code>, the bottom). The file below asks tsc about each direction:</p>
${ma('typescript', CODE.assign)}
${ra(OUT['11-hierarchy'])}
<p>Three errors, exactly on the lines that break the rule — and the lines without an error are just as informative:</p>
${BANG_HE_EN}
<p><code>never</code> fits into <code>string</code> and <code>number</code> at once because the empty set is a subset of every set — no value can ever arrive. And even <code>any</code> does <em>not</em> fit into <code>never</code>: the bottom stays empty.</p>

<!-- SODO-TS -->
<h3>🗺 The map, from top to bottom</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">unknown — top</span><span class="lz-lnote">Every value fits in. Nothing comes out until you check. For data from outside.</span></div>
  <div class="lz-layer"><span class="lz-lname">ordinary types</span><span class="lz-lnote"><code>string</code>, <code>number</code>, <code>Booking</code>, <code>readonly ScheduleEntry[]</code>, literal unions… The types you write every day.</span></div>
  <div class="lz-layer"><span class="lz-lname">literal types</span><span class="lz-lnote"><code>'BE-201'</code>, <code>30</code>, <code>true</code> — sets with exactly one value (lesson 2.4).</span></div>
  <div class="lz-layer"><span class="lz-lname">never — bottom</span><span class="lz-lnote">The empty set. Fits into everything, nothing fits into it. Means “this cannot happen”.</span></div>
  <div class="lz-layer"><span class="lz-lname">any — off the map</span><span class="lz-lnote">Fits everywhere and accepts everything (except into <code>never</code>). Not a place on the map — a hole in it.</span></div>
</div>

<h3>void — “there is nothing here to use”</h3>
<p>Some functions exist for what they <em>do</em>: print a line, save a row, send an e-mail. Their return type is <code>void</code>. LabFlow logs every saved booking:</p>
${ma('typescript', CODE.log)}
${ra(OUT['12-void-tsc'])}
<p>Three refusals: a <code>void</code> result cannot be used as a <code>number</code>, it is not even accepted as <code>undefined</code>, and a function that promises <code>void</code> may not return a value. Yet the last statement — <code>ids.forEach((id) =&gt; seen.push(id))</code> — passes, although <code>push</code> returns a number. When a <em>callback type</em> says <code>void</code>, it means “the caller will ignore what you return”, so returning something is harmless. Lesson 3.3 explains that rule in full; for now remember the difference between a function you <em>declare</em> as <code>void</code> (must not return a value) and a callback slot typed <code>void</code> (may return one, it is ignored).</p>
<p>What happens at runtime? Node strips the types and runs the file anyway:</p>
${ra(OUT['13-void-run'])}
<p>A JavaScript function without <code>return</code> gives <code>undefined</code>, so all three variables hold <code>undefined</code>. Then why does tsc refuse <code>const r3: undefined = logBooking(3)</code>? Because <code>void</code> is a promise about <em>intent</em>, not about the bytes: “do not rely on this result”.</p>

<h3>never, use 1 — a function that never comes back</h3>
<p>LabFlow often needs “stop here with an error” inside an expression, for example to turn a refused slot into an exception. A helper that always throws never <em>returns</em> a value — its return type is <code>never</code>. Watch what that buys, and what happens when you forget to write it. We ask tsc to emit only the declaration files (lesson 1.3’s trick) for three versions of the same helper:</p>
${ma('typescript', CODE.fail)}
${ma('json', CODE.dtsJson)}
${ra(OUT['14-never-dts'])}
<p>Read the four lines carefully, because one of them is a real surprise:</p>
<ul>
<li><code>fail(...): never</code> — written by hand. So <code>slot.ok ? slot.minutes : fail(slot.code)</code> is <code>number | never</code>, which is just <code>number</code>: the empty set adds nothing to a union.</li>
<li><code>failInferred(...): void</code> — the <strong>same body</strong>, no annotation, and tsc infers <code>void</code>, not <code>never</code>. This is the documented rule since TypeScript 2.0: <code>never</code> is inferred only for function <em>expressions</em> and arrow functions whose end cannot be reached; a function <em>declaration</em> gets <code>void</code>.</li>
<li><code>failArrow: (message: string) =&gt; never</code> — the arrow function with the same body is inferred <code>never</code>.</li>
<li>Result: <code>minutes2</code> becomes <code>void | number</code>, and correct code that stores it in a <code>number</code> breaks:</li>
</ul>
${ma('typescript', CODE.use)}
${ra(OUT['15-never-use'])}
<p>The rule: a helper that only throws gets an explicit <code>: never</code>. This website’s desktop app has such helpers too — Next.js-style <code>notFound(): never</code> and <code>redirect(href: string): never</code> in <code>desktop/src/renderer/shims/next-navigation.tsx</code>.</p>

<h3>never, use 2 — make tsc find the case you forgot</h3>
<p><code>checkSlot</code> refuses a slot with one of four codes (<code>SlotCode</code> from Lab 1). The booking screen turns each code into a sentence. The <code>default</code> branch below is the important part: if all four codes are handled, the only values left for <code>code</code> there are… none, so <code>code</code> has type <code>never</code> and the assignment compiles:</p>
${ma('typescript', CODE.v1)}
${ma('typescript', CODE.v1run)}
${ra(OUT['16-ex-v1'])}
<p>Now the realistic part. A teammate adds a fifth reason to the list of codes — the lab is closed for maintenance:</p>
${ma('typescript', CODE.codes)}
<p>First, the JavaScript world. The same function without types, and the new code arriving one day:</p>
${ma('javascript', CODE.js)}
${ra(OUT['20-ex-js'])}
<p>Exit 0. No exception, no log line: a student reads “Booking refused: undefined”. Now three TypeScript versions of the function, all compiled against the new five-code list:</p>
${ma('typescript', DEF_SHORT)}
${ra(OUT['18-ex-default'])}
${ma('typescript', NORET_SHORT)}
${ra(OUT['19-ex-noreturn'])}
<p>And the version with the <code>never</code> line, unchanged from above, against the new list:</p>
${ra(OUT['17-ex-v2'])}
${BANG_SWITCH_EN}
<p>The “safe-looking” default is the worst: it compiles today and after every future change. The <code>never</code> line is the only one that names the missing value and points at the function that must change. In a real codebase the same code is switched on in many places; tsc gives you <strong>one error per place</strong> — a free to-do list.</p>
<p>This website uses the pattern for real in its desktop app — the export formats of the music app and the states of the auto-updater:</p>
${ma('typescript', SITE_NEVER)}
<p>Both still <code>throw</code> at runtime: types protect values from <em>your</em> code; a value from the network can still be anything (lesson 1.2), so the runtime branch stays.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — the empty list that refuses everything.</strong> A day in a lab starts with no bookings. Nothing looks wrong here:</p>
${ma('typescript', DAY_TOP)}
${ra(OUT['21-empty'])}
<p>“…not assignable to parameter of type 'never'.” When an empty array <code>[]</code> is written as a <strong>property</strong> of an object, tsc has no element to infer from, and under strict mode it settles on <code>never[]</code> — a list that can only contain values that do not exist. (A <em>local</em> variable <code>const ids = []</code> is treated differently: its type “evolves” as you push, which is why the same file’s <code>ids.push(b.minutes)</code> has no error.) The fix is to say what the list will hold:</p>
${ma('typescript', CODE.dayFixed)}
${ra(OUT['22-empty-fixed'])}
</div>

<h3>object, {} and Object — three look-alikes</h3>
${ma('typescript', CODE.objects)}
${ra(OUT['23-objects'])}
<ul>
<li><code>object</code> (lower-case) means “not a primitive”: <code>{ lab: 'BE-201' }</code> is fine, the string <code>'BE-201'</code> is refused.</li>
<li><code>{}</code> does <strong>not</strong> mean “an empty object”. It means “any value except <code>null</code> and <code>undefined</code>” — strings and numbers included. It is one of the most misread types in TypeScript.</li>
<li><code>Object</code> (capital) is the wrapper type and is as loose as <code>{}</code>. Like <code>String</code> in lesson 2.1, you almost never want it.</li>
</ul>

<h3>Which special type, when</h3>
${BANG_KHI_EN}

<h3>💼 Interview corner</h3>
<p><strong>“unknown vs never?”</strong> — Top vs bottom: everything is assignable to <code>unknown</code> (narrow before use); <code>never</code> is assignable to everything and nothing to it (code that cannot run, functions that cannot return).</p>
<p><strong>“How do you make sure every case of a union is handled?”</strong> — A <code>switch</code> with <code>const unreachable: never = value</code> (or an <code>assertNever(value: never): never</code> helper) in the <code>default</code>. Adding a member to the union then produces a TS2322 at every switch that forgot it. Keep a runtime <code>throw</code> there for values from outside.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p><code>demo2/ts-02-3/practice/start/status.ts</code> labels booking statuses for the screen. The list of statuses already contains <code>CANCELLED</code>, but the <code>switch</code> was written before it existed:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['24-pr-start'])}
<ol>
<li>tsc is silent and a cancelled booking shows “?”. Explain in one sentence why tsc did not help.</li>
<li>Replace the <code>default</code> branch with an exhaustiveness check. Run tsc and read the error <em>before</em> fixing anything.</li>
<li>Handle the missing case (“Đã huỷ”), run tsc and Node again.</li>
</ol>
<p><strong>Solution and real output.</strong> Step 1: <code>default: return '?'</code> catches every remaining value, so tsc sees nothing wrong. Step 2:</p>
${ma('typescript', PR_STEP1_SHORT)}
${ra(PR_STEP1_RUN)}
<p>The error names the forgotten value. (If you run this step with Node anyway, it now throws <code>Error: Unknown status: CANCELLED</code> instead of showing “?” — a loud failure instead of a quiet one.) Step 3:</p>
${ma('typescript', PR_SOL_SHORT)}
${ra(OUT['26-pr-sol'])}
<p><strong>Done when:</strong> step 2 gives exactly one TS2322 naming <code>"CANCELLED"</code>; step 3 compiles with exit 0 and prints three labels. Code Lab has four more exercises for this lesson: a <code>fail()</code> that must be <code>never</code>, an <code>assertNever</code> helper for a new slot code, the empty-list trap, and an audit log that must be <code>void</code>.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">top type</span><span class="v"><code>unknown</code>: the set of every value. Everything is assignable to it.</span></div>
  <div class="kv"><span class="k">bottom type</span><span class="v"><code>never</code>: the empty set. Assignable to everything; nothing is assignable to it.</span></div>
  <div class="kv"><span class="k">void</span><span class="v">“No result to use.” Return type of functions that only do something.</span></div>
  <div class="kv"><span class="k">exhaustiveness check</span><span class="v">Proving at compile time that a <code>switch</code> handles every member of a union, via <code>never</code>.</span></div>
  <div class="kv"><span class="k">assertNever</span><span class="v">A helper <code>(value: never): never</code> called in a <code>default</code> branch; same idea as the <code>never</code> variable.</span></div>
  <div class="kv"><span class="k">never[]</span><span class="v">The type tsc gives an empty array it cannot infer from — a list that accepts nothing.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>unknown</code> is the top, <code>never</code> the bottom; <code>any</code> is a hole in the map — but even <code>any</code> is not assignable to <code>never</code> (TS2322, measured).</li>
<li><code>void</code> means “do not use the result”: using it as <code>number</code> or even as <code>undefined</code> is TS2322, although at runtime the value is <code>undefined</code>.</li>
<li>A throwing function <em>declaration</em> is inferred <code>void</code>, an arrow <code>never</code>: write <code>: never</code> on helpers like <code>fail()</code>.</li>
<li><code>const unreachable: never = code</code> in <code>default</code> turns “a teammate added LAB_CLOSED” into a TS2322 that names the value; a vague default branch stays silent forever.</li>
<li>An empty array as an object property becomes <code>never[]</code> (TS2345 on <code>push</code>): annotate what it will hold. <code>{}</code> means “not null/undefined”, not “empty object”.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — More on Functions', 'Sections void, object, unknown, never and Function: what each special type means and why a void callback may return a value. Read 1 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/functions.html')}
${nguon('📗', 'TypeScript Handbook — Narrowing', 'The never type and “Exhaustiveness checking” with a switch over a union. Read 1 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html')}
${nguon('📕', 'TypeScript 2.0 release notes — The never type', 'never is assignable to every type, no type is assignable to never, and never is inferred only for function expressions and arrow functions. Read 1 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html')}
${nguon('📙', 'TypeScript FAQ (GitHub wiki)', 'Why functions returning non-void are assignable to functions returning void. Read 1 Nov 2026.', 'https://github.com/microsoft/TypeScript/wiki/FAQ')}
${lienKet({ khoa: 'api-design', bai: 'api-4-1-thay-doi', title: 'The same new value, over the network — API Design 4.1: What breaks a client', sub: 'Same: a new status value (CHECKED_IN there, LAB_CLOSED here) breaks code that handles “every” case. Different: here the value comes from your own code, so a never check makes tsc list every switch to update before anything runs; there it arrives from someone else’s server at runtime, where no compiler can see it — so you also need a tolerant default branch at runtime.', cta: 'OPEN API DESIGN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>Các kiểu đặc biệt: any, unknown, never, void</h2>
<p class="lead">Phần lớn kiểu mô tả dữ liệu: số chỗ, mã phòng, một lượt đặt. Bốn kiểu thì mô tả <em>tình huống</em>: “có thể là bất cứ gì” (<code>unknown</code>), “đừng kiểm nữa” (<code>any</code>), “không có gì để dùng” (<code>void</code>) và “điều này không thể xảy ra” (<code>never</code>). Bài này đặt chúng lên cùng một tấm bản đồ và, bằng output thật của trình biên dịch, biến <code>never</code> thành công cụ thực dụng nhất của chương: khi một bạn trong nhóm thêm mã mới vào LabFlow, tsc liệt kê mọi chỗ bạn quên sửa.</p>

<h3>Học xong bạn làm được gì, và vì sao có ích</h3>
<ul>
<li><strong>Đặt từng kiểu đặc biệt lên thứ bậc kiểu (type hierarchy)</strong> — đỉnh, đáy, và kẻ phá luật — và đoán được tsc nhận phép gán nào.</li>
<li><strong>Dùng <code>void</code> đúng</strong> cho hàm chỉ làm một việc, và biết vì sao nó không giống <code>undefined</code>.</li>
<li><strong>Viết hàm <code>fail()</code> có kiểu <code>never</code></strong> — và tránh cú bất ngờ tsc suy ra <code>void</code> cho nó.</li>
<li><strong>Biến một trường hợp bị quên thành lỗi biên dịch</strong> bằng <code>switch</code> vét cạn. Trong đồ án nhóm, đây là thứ cứu bạn khi ai đó thêm một trạng thái (<code>CANCELLED</code>, <code>CHECKED_IN</code>…) vào đêm trước buổi demo.</li>
<li><strong>Sửa bẫy <code>never[]</code></strong> — mảng rỗng từ chối mọi lần <code>push</code>.</li>
</ul>

<h3>Hai kiểu bạn đã biết: any và unknown</h3>
<p>Bài 1.4 đã đo cả hai: <code>any</code> tắt việc kiểm cho một giá trị và mọi thứ nó chạm vào; <code>unknown</code> nhận mọi giá trị nhưng chỉ cho dùng sau khi kiểm — kiểu dành cho <code>JSON.parse</code> và mọi thứ từ bên ngoài. Ở đây chúng chỉ đứng vào chỗ của mình trên bản đồ.</p>

<h3>Thứ bậc kiểu: một đỉnh và một đáy</h3>
<p>Hãy nghĩ một kiểu là một <strong>tập hợp giá trị</strong>: <code>number</code> là mọi con số, <code>'STUDENT' | 'LECTURER' | 'ADMIN'</code> là ba chuỗi. Phép gán <code>a = b</code> được phép khi mọi giá trị của kiểu <code>b</code> cũng thuộc kiểu <code>a</code>. Hai tập đặc biệt: tập <em>mọi thứ</em> (<code>unknown</code>, đỉnh) và tập <em>rỗng</em> (<code>never</code>, đáy). Tệp dưới đây hỏi tsc từng chiều một:</p>
${ma('typescript', CODE.assign)}
${ra(OUT['11-hierarchy'])}
<p>Ba lỗi, nằm đúng những dòng phạm luật — và những dòng không có lỗi cũng nói nhiều không kém:</p>
${BANG_HE_VI}
<p><code>never</code> vừa <code>string</code> lẫn <code>number</code> cùng lúc vì tập rỗng là tập con của mọi tập — không giá trị nào có thể tới đó. Và kể cả <code>any</code> cũng <em>không</em> vừa <code>never</code>: đáy luôn rỗng.</p>

<h3>🗺 Bản đồ, từ đỉnh xuống đáy</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">unknown — đỉnh</span><span class="lz-lnote">Giá trị nào cũng vào được. Không lấy ra được gì cho tới khi kiểm. Dành cho dữ liệu từ ngoài.</span></div>
  <div class="lz-layer"><span class="lz-lname">kiểu thường</span><span class="lz-lnote"><code>string</code>, <code>number</code>, <code>Booking</code>, <code>readonly ScheduleEntry[]</code>, union literal… Những kiểu bạn viết hằng ngày.</span></div>
  <div class="lz-layer"><span class="lz-lname">kiểu literal</span><span class="lz-lnote"><code>'BE-201'</code>, <code>30</code>, <code>true</code> — tập có đúng một giá trị (bài 2.4).</span></div>
  <div class="lz-layer"><span class="lz-lname">never — đáy</span><span class="lz-lnote">Tập rỗng. Vừa với mọi kiểu, không gì vừa với nó. Nghĩa là “điều này không thể xảy ra”.</span></div>
  <div class="lz-layer"><span class="lz-lname">any — ngoài bản đồ</span><span class="lz-lnote">Vừa mọi chỗ và nhận mọi thứ (trừ việc gán vào <code>never</code>). Không phải một chỗ trên bản đồ — mà là một lỗ thủng.</span></div>
</div>

<h3>void — “ở đây không có gì để dùng”</h3>
<p>Có những hàm tồn tại vì việc chúng <em>làm</em>: in một dòng, lưu một bản ghi, gửi một email. Kiểu trả về của chúng là <code>void</code>. LabFlow ghi lại mỗi lượt đặt đã lưu:</p>
${ma('typescript', CODE.log)}
${ra(OUT['12-void-tsc'])}
<p>Ba lần từ chối: kết quả <code>void</code> không dùng được như <code>number</code>, thậm chí không được nhận là <code>undefined</code>, và hàm đã hứa <code>void</code> thì không được trả về giá trị. Thế nhưng câu lệnh cuối — <code>ids.forEach((id) =&gt; seen.push(id))</code> — lại qua, dù <code>push</code> trả về một số. Khi một <em>kiểu callback</em> ghi <code>void</code>, nó nghĩa là “bên gọi sẽ bỏ qua thứ bạn trả về”, nên trả về gì cũng vô hại. Bài 3.3 giải thích trọn quy tắc này; bây giờ chỉ cần nhớ khác biệt giữa một hàm bạn <em>khai báo</em> là <code>void</code> (không được trả giá trị) và một chỗ callback có kiểu <code>void</code> (được trả, và bị bỏ qua).</p>
<p>Lúc chạy thì sao? Node bóc kiểu và vẫn chạy tệp:</p>
${ra(OUT['13-void-run'])}
<p>Hàm JavaScript không có <code>return</code> thì trả <code>undefined</code>, nên cả ba biến đều giữ <code>undefined</code>. Vậy sao tsc từ chối <code>const r3: undefined = logBooking(3)</code>? Vì <code>void</code> là một lời hứa về <em>ý định</em>, không phải về giá trị thật: “đừng dựa vào kết quả này”.</p>

<h3>never, cách dùng 1 — hàm không bao giờ quay lại</h3>
<p>LabFlow hay cần “dừng ở đây kèm lỗi” ngay giữa một biểu thức, ví dụ biến một slot bị từ chối thành ngoại lệ. Một hàm luôn ném lỗi thì không bao giờ <em>trả về</em> giá trị — kiểu trả về của nó là <code>never</code>. Xem nó mang lại gì, và chuyện gì xảy ra khi bạn quên ghi. Ta bảo tsc chỉ sinh tệp khai báo (mẹo của bài 1.3) cho ba phiên bản của cùng một hàm:</p>
${ma('typescript', CODE.fail)}
${ma('json', CODE.dtsJson)}
${ra(OUT['14-never-dts'])}
<p>Đọc kỹ bốn dòng, vì có một dòng thật sự bất ngờ:</p>
<ul>
<li><code>fail(...): never</code> — tự ghi tay. Nên <code>slot.ok ? slot.minutes : fail(slot.code)</code> là <code>number | never</code>, tức là <code>number</code>: tập rỗng không thêm gì vào union.</li>
<li><code>failInferred(...): void</code> — <strong>cùng thân hàm</strong>, không chú thích, và tsc suy ra <code>void</code>, không phải <code>never</code>. Đây là quy tắc được ghi rõ từ TypeScript 2.0: <code>never</code> chỉ được suy ra cho function <em>expression</em> và arrow function không chạy tới được điểm cuối; còn <em>function declaration</em> (khai báo hàm bằng từ khoá function) nhận <code>void</code>.</li>
<li><code>failArrow: (message: string) =&gt; never</code> — arrow function cùng thân hàm thì được suy ra <code>never</code>.</li>
<li>Hệ quả: <code>minutes2</code> thành <code>void | number</code>, và code đúng cất nó vào một <code>number</code> bị gãy:</li>
</ul>
${ma('typescript', CODE.use)}
${ra(OUT['15-never-use'])}
<p>Quy tắc: hàm chỉ để ném lỗi thì ghi rõ <code>: never</code>. App desktop của chính website này cũng có những hàm như vậy — <code>notFound(): never</code> và <code>redirect(href: string): never</code> kiểu Next.js trong <code>desktop/src/renderer/shims/next-navigation.tsx</code>.</p>

<h3>never, cách dùng 2 — bắt tsc tìm trường hợp bạn quên</h3>
<p><code>checkSlot</code> từ chối một slot bằng một trong bốn mã (<code>SlotCode</code> của Lab 1). Màn hình đặt phòng đổi mỗi mã thành một câu. Nhánh <code>default</code> dưới đây là phần quan trọng: nếu đã xử lý đủ bốn mã, giá trị còn lại cho <code>code</code> ở đó là… không có, nên <code>code</code> mang kiểu <code>never</code> và phép gán biên dịch được:</p>
${ma('typescript', CODE.v1)}
${ma('typescript', CODE.v1run)}
${ra(OUT['16-ex-v1'])}
<p>Giờ tới phần thực tế. Một bạn trong nhóm thêm lý do thứ năm vào danh sách mã — phòng đóng cửa để bảo trì:</p>
${ma('typescript', CODE.codes)}
<p>Trước hết là thế giới JavaScript. Cùng hàm đó không có kiểu, và một ngày mã mới xuất hiện:</p>
${ma('javascript', CODE.js)}
${ra(OUT['20-ex-js'])}
<p>Exit 0. Không ngoại lệ, không dòng log: sinh viên đọc được “Booking refused: undefined”. Giờ là ba phiên bản TypeScript của hàm, cùng biên dịch với danh sách năm mã mới:</p>
${ma('typescript', DEF_SHORT)}
${ra(OUT['18-ex-default'])}
${ma('typescript', NORET_SHORT)}
${ra(OUT['19-ex-noreturn'])}
<p>Và phiên bản có dòng <code>never</code>, giữ nguyên như ở trên, với danh sách mới:</p>
${ra(OUT['17-ex-v2'])}
${BANG_SWITCH_VI}
<p>Nhánh default “trông an toàn” lại tệ nhất: nó biên dịch được hôm nay và sau mọi thay đổi về sau. Dòng <code>never</code> là cách duy nhất gọi tên giá trị bị thiếu và chỉ vào đúng hàm phải sửa. Trong codebase thật, cùng một mã được rẽ nhánh ở nhiều nơi; tsc cho bạn <strong>mỗi nơi một lỗi</strong> — danh sách việc cần làm miễn phí.</p>
<p>Website này dùng mẫu đó thật trong app desktop — các định dạng xuất của app nhạc và các trạng thái của bộ tự cập nhật:</p>
${ma('typescript', SITE_NEVER)}
<p>Cả hai vẫn <code>throw</code> lúc chạy: kiểu bảo vệ giá trị từ code <em>của bạn</em>; giá trị từ mạng vẫn có thể là bất cứ gì (bài 1.2), nên nhánh lúc chạy vẫn giữ.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — mảng rỗng từ chối mọi thứ.</strong> Một ngày của phòng lab bắt đầu chưa có lượt đặt nào. Nhìn không thấy gì sai:</p>
${ma('typescript', DAY_TOP)}
${ra(OUT['21-empty'])}
<p>“…not assignable to parameter of type 'never'.” Khi mảng rỗng <code>[]</code> được viết làm <strong>thuộc tính</strong> của một object, tsc không có phần tử nào để suy luận, và ở chế độ strict nó chốt <code>never[]</code> — một danh sách chỉ chứa được những giá trị không tồn tại. (Biến <em>cục bộ</em> <code>const ids = []</code> được đối xử khác: kiểu của nó “tiến hoá” theo những gì bạn push, nên <code>ids.push(b.minutes)</code> trong cùng tệp không lỗi.) Cách sửa là nói rõ danh sách sẽ chứa gì:</p>
${ma('typescript', CODE.dayFixed)}
${ra(OUT['22-empty-fixed'])}
</div>

<h3>object, {} và Object — ba kiểu trông na ná</h3>
${ma('typescript', CODE.objects)}
${ra(OUT['23-objects'])}
<ul>
<li><code>object</code> (chữ thường) nghĩa là “không phải primitive”: <code>{ lab: 'BE-201' }</code> được, chuỗi <code>'BE-201'</code> bị từ chối.</li>
<li><code>{}</code> <strong>không</strong> có nghĩa “object rỗng”. Nó nghĩa là “mọi giá trị trừ <code>null</code> và <code>undefined</code>” — kể cả chuỗi và số. Đây là một trong những kiểu bị đọc sai nhiều nhất của TypeScript.</li>
<li><code>Object</code> (viết hoa) là kiểu wrapper (lớp bọc) và lỏng y như <code>{}</code>. Giống <code>String</code> ở bài 2.1, gần như không bao giờ bạn cần nó.</li>
</ul>

<h3>Kiểu đặc biệt nào, khi nào</h3>
${BANG_KHI_VI}

<h3>💼 Góc phỏng vấn</h3>
<p><strong>“unknown khác never thế nào?”</strong> — Đỉnh và đáy: mọi thứ gán được vào <code>unknown</code> (thu hẹp rồi mới dùng); <code>never</code> gán được vào mọi kiểu và không gì gán vào nó được (code không thể chạy tới, hàm không thể trả về).</p>
<p><strong>“Làm sao chắc mọi trường hợp của một union đều được xử lý?”</strong> — Một <code>switch</code> có <code>const unreachable: never = value</code> (hoặc hàm <code>assertNever(value: never): never</code>) ở <code>default</code>. Thêm một thành viên vào union thì mọi switch quên nó đều ra TS2322. Giữ một <code>throw</code> lúc chạy ở đó cho giá trị từ bên ngoài.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<p><code>demo2/ts-02-3/practice/start/status.ts</code> gắn nhãn trạng thái lượt đặt cho màn hình. Danh sách trạng thái đã có <code>CANCELLED</code>, nhưng <code>switch</code> được viết từ trước khi có nó:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['24-pr-start'])}
<ol>
<li>tsc im lặng và lượt đặt đã huỷ hiện “?”. Giải thích trong một câu vì sao tsc không giúp được.</li>
<li>Thay nhánh <code>default</code> bằng phép kiểm vét cạn. Chạy tsc và đọc lỗi <em>trước khi</em> sửa gì.</li>
<li>Xử lý trường hợp còn thiếu (“Đã huỷ”), chạy lại tsc và Node.</li>
</ol>
<p><strong>Lời giải và output thật.</strong> Bước 1: <code>default: return '?'</code> hứng mọi giá trị còn lại, nên tsc không thấy gì sai. Bước 2:</p>
${ma('typescript', PR_STEP1_SHORT)}
${ra(PR_STEP1_RUN)}
<p>Lỗi gọi đúng tên giá trị bị quên. (Nếu vẫn chạy bước này bằng Node, nó ném <code>Error: Unknown status: CANCELLED</code> thay vì hiện “?” — hỏng ồn ào thay cho hỏng lặng lẽ.) Bước 3:</p>
${ma('typescript', PR_SOL_SHORT)}
${ra(OUT['26-pr-sol'])}
<p><strong>Đạt khi:</strong> bước 2 ra đúng một TS2322 gọi tên <code>"CANCELLED"</code>; bước 3 biên dịch với exit 0 và in ba nhãn. Code Lab có thêm bốn bài cho bài học này: <code>fail()</code> phải là <code>never</code>, hàm <code>assertNever</code> cho mã slot mới, bẫy mảng rỗng, và hàm ghi nhật ký phải là <code>void</code>.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">top type (kiểu đỉnh)</span><span class="v"><code>unknown</code>: tập mọi giá trị. Gì cũng gán vào được.</span></div>
  <div class="kv"><span class="k">bottom type (kiểu đáy)</span><span class="v"><code>never</code>: tập rỗng. Gán được vào mọi kiểu; không gì gán vào nó được.</span></div>
  <div class="kv"><span class="k">void (không có kết quả)</span><span class="v">“Không có kết quả để dùng.” Kiểu trả về của hàm chỉ làm một việc.</span></div>
  <div class="kv"><span class="k">exhaustiveness check (kiểm vét cạn)</span><span class="v">Chứng minh lúc biên dịch rằng một <code>switch</code> xử lý mọi thành viên của union, nhờ <code>never</code>.</span></div>
  <div class="kv"><span class="k">assertNever</span><span class="v">Hàm <code>(value: never): never</code> gọi trong nhánh <code>default</code>; cùng ý với biến <code>never</code>.</span></div>
  <div class="kv"><span class="k">never[]</span><span class="v">Kiểu tsc gán cho mảng rỗng mà nó không suy luận được — danh sách không nhận gì cả.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>unknown</code> là đỉnh, <code>never</code> là đáy; <code>any</code> là lỗ thủng trên bản đồ — nhưng kể cả <code>any</code> cũng không gán được vào <code>never</code> (TS2322, đã đo).</li>
<li><code>void</code> nghĩa là “đừng dùng kết quả”: dùng nó như <code>number</code> hay cả như <code>undefined</code> đều là TS2322, dù lúc chạy giá trị là <code>undefined</code>.</li>
<li><em>Function declaration</em> chỉ ném lỗi bị suy ra <code>void</code>, arrow thì <code>never</code>: hãy ghi <code>: never</code> cho các hàm như <code>fail()</code>.</li>
<li><code>const unreachable: never = code</code> trong <code>default</code> biến “bạn cùng nhóm thêm LAB_CLOSED” thành một TS2322 gọi đúng tên giá trị; nhánh default mơ hồ thì im lặng mãi mãi.</li>
<li>Mảng rỗng làm thuộc tính object thành <code>never[]</code> (TS2345 khi <code>push</code>): chú thích rõ nó sẽ chứa gì. <code>{}</code> nghĩa là “không null/undefined”, không phải “object rỗng”.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — More on Functions', 'Các mục void, object, unknown, never và Function: mỗi kiểu đặc biệt nghĩa là gì, và vì sao callback void vẫn được trả giá trị. Đọc ngày 1/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/functions.html')}
${nguon('📗', 'TypeScript Handbook — Narrowing', 'Kiểu never và mục “Exhaustiveness checking” với switch trên một union. Đọc ngày 1/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html')}
${nguon('📕', 'Ghi chú phát hành TypeScript 2.0 — The never type', 'never gán được vào mọi kiểu, không kiểu nào gán được vào never, và never chỉ được suy ra cho function expression và arrow function. Đọc ngày 1/11/2026.', 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html')}
${nguon('📙', 'TypeScript FAQ (wiki GitHub)', 'Vì sao hàm trả về giá trị khác void vẫn gán được cho kiểu hàm trả về void. Đọc ngày 1/11/2026.', 'https://github.com/microsoft/TypeScript/wiki/FAQ')}
${lienKet({ khoa: 'api-design', bai: 'api-4-1-thay-doi', title: 'Cùng một giá trị mới, nhưng qua mạng — API Design 4.1: Thay đổi nào làm gãy client', sub: 'Giống: một giá trị trạng thái mới (CHECKED_IN bên đó, LAB_CLOSED ở đây) làm gãy code xử lý “mọi” trường hợp. Khác: ở đây giá trị đến từ chính code của bạn, nên phép kiểm never bắt tsc liệt kê mọi switch phải sửa trước khi chạy; bên đó nó đến từ server của người khác lúc chạy, nơi không trình biên dịch nào nhìn thấy — nên bạn còn cần nhánh default khoan dung lúc chạy.', cta: 'MỞ BÀI API DESIGN →' })}
</div>
`,
};
