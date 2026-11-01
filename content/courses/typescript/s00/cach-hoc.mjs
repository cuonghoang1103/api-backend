/**
 * TypeScript · Mục 0 · 0.2 — Cách học: để trình biên dịch dạy bạn. Slug GIỮ từ bản cũ: typescript-0-2-cach-hoc (01/11/2026, đợt mẫu).
 * Mọi code/output lấy từ ./_ma-ts-00-2.mjs (sinh tự động từ labflow-ts/demo0/ts-00-2, Node 22.23.3 + tsc 7.0.2).
 * Giữ từ bản cũ: vòng học 5 bước, hover, cố ý làm đỏ, không dùng any. Bỏ lời hứa "track Code Lab 160 bài" (chưa kiểm được).
 */
import G from '../giang/ts-00-2.mjs';
import { ma, ra, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-00-2.mjs';

const CHAIN_OUT = OUT['05-chain'].split('\n').filter((l, i) => i === 0 || i >= 2).join('\n');
const CHAIN_NESTED = OUT['05-chain'].split('\n').slice(0, 2).join('\n');
const PRETTY_B1 = OUT['07-cascade-pretty'].split('\n').slice(0, 18).join('\n');
const PRETTY_B1_TAIL = OUT['07-cascade-pretty'].split('\n').slice(-1).join('\n');

const BANG_EN = `<table>
<thead><tr><th>Code</th><th>What it means</th><th>Usual fix</th></tr></thead>
<tbody>
<tr><td>TS2322</td><td>a value does not fit the type it is assigned to</td><td>fix the value — or the declaration, if the declaration was wrong</td></tr>
<tr><td>TS2345</td><td>an argument does not fit the parameter</td><td>pass what the function asks for</td></tr>
<tr><td>TS2339</td><td>the property does not exist on that type</td><td>check which type you really have (hover)</td></tr>
<tr><td>TS2551</td><td>same, but a similar name exists</td><td>a typo — take the suggestion</td></tr>
<tr><td>TS2554</td><td>wrong number of arguments</td><td>add or remove the argument</td></tr>
<tr><td>TS2561 / TS2353</td><td>an object literal has a key the type does not know (2561 adds “Did you mean”)</td><td>rename or remove the key</td></tr>
<tr><td>TS2820</td><td>a string is not one of the allowed values, with a suggestion</td><td>use the exact value</td></tr>
<tr><td>TS7006</td><td>a parameter has no type and TypeScript will not guess</td><td>annotate the parameter</td></tr>
<tr><td>TS18048</td><td>the value might be <code>undefined</code></td><td>check it first (<code>if (first)</code>)</td></tr>
<tr><td>TS2307</td><td>the import path leads nowhere</td><td>fix the path, or install the package</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Mã</th><th>Nghĩa là</th><th>Cách sửa thường gặp</th></tr></thead>
<tbody>
<tr><td>TS2322</td><td>một giá trị không khớp kiểu của nơi nhận nó</td><td>sửa giá trị — hoặc sửa khai báo, nếu khai báo sai</td></tr>
<tr><td>TS2345</td><td>đối số không khớp tham số</td><td>truyền đúng thứ hàm cần</td></tr>
<tr><td>TS2339</td><td>kiểu đó không có thuộc tính này</td><td>xem lại mình đang cầm kiểu gì (rê chuột)</td></tr>
<tr><td>TS2551</td><td>như trên, nhưng có một tên gần giống</td><td>gõ nhầm — làm theo gợi ý</td></tr>
<tr><td>TS2554</td><td>sai số lượng đối số</td><td>thêm hoặc bớt đối số</td></tr>
<tr><td>TS2561 / TS2353</td><td>object viết trực tiếp có một khoá mà kiểu không biết (2561 kèm "Did you mean")</td><td>đổi tên hoặc bỏ khoá đó</td></tr>
<tr><td>TS2820</td><td>chuỗi không nằm trong tập giá trị cho phép, kèm gợi ý</td><td>dùng đúng giá trị</td></tr>
<tr><td>TS7006</td><td>tham số chưa có kiểu và TypeScript không chịu đoán</td><td>chú thích kiểu cho tham số</td></tr>
<tr><td>TS18048</td><td>giá trị có thể là <code>undefined</code></td><td>kiểm trước khi dùng (<code>if (first)</code>)</td></tr>
<tr><td>TS2307</td><td>đường dẫn import không dẫn tới đâu</td><td>sửa đường dẫn, hoặc cài gói</td></tr>
</tbody>
</table>`;

const CASCADE_EN = `<table>
<thead><tr><th>Round</th><th>What you change</th><th>tsc reports</th></tr></thead>
<tbody>
<tr><td>1</td><td>nothing yet</td><td>4 errors: TS2724 (import name) + 3 × TS2322 (role)</td></tr>
<tr><td>2</td><td><code>const role: string = 'STUDENT'</code> → <code>const role = 'STUDENT'</code></td><td>1 error: TS2724</td></tr>
<tr><td>3</td><td><code>checkSlots</code> → <code>checkSlot</code> (twice)</td><td>1 <strong>new</strong> error: TS2339 on <code>morning.minutes</code></td></tr>
<tr><td>4</td><td><code>if (morning.ok) console.log(morning.minutes);</code></td><td>0 errors, exit 0</td></tr>
</tbody>
</table>`;
const CASCADE_VI = `<table>
<thead><tr><th>Lượt</th><th>Bạn đổi gì</th><th>tsc báo</th></tr></thead>
<tbody>
<tr><td>1</td><td>chưa đổi gì</td><td>4 lỗi: TS2724 (tên import) + 3 × TS2322 (role)</td></tr>
<tr><td>2</td><td><code>const role: string = 'STUDENT'</code> → <code>const role = 'STUDENT'</code></td><td>1 lỗi: TS2724</td></tr>
<tr><td>3</td><td><code>checkSlots</code> → <code>checkSlot</code> (hai chỗ)</td><td>1 lỗi <strong>mới</strong>: TS2339 ở <code>morning.minutes</code></td></tr>
<tr><td>4</td><td><code>if (morning.ok) console.log(morning.minutes);</code></td><td>0 lỗi, exit 0</td></tr>
</tbody>
</table>`;

export default {
  title: '0.2 — How to study: let the compiler teach you|||0.2 — Cách học: để trình biên dịch dạy bạn',
  slug: 'typescript-0-2-cach-hoc',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Vòng học 5 bước (đọc, gõ lại, rê chuột, cố ý làm đỏ, luyện); đọc một thông báo tsc như đọc địa chỉ (tệp, dòng, cột, mã, câu, exit code, --pretty); đọc chuỗi giải thích từ dòng cuối; sửa lỗi đầu tiên trước (4 → 1 → 1 → 0); 10 mã lỗi hay gặp nhất; editor (TS 6.0.3) khác cổng npx tsc (7.0.2), TS5112; @ts-expect-error và TS2578 — ý tưởng của máy chấm trong khoá.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>How to study: let the compiler teach you</h2>
<p class="lead">After this lesson you can look at any red TypeScript message and know, within seconds, <em>where</em> the problem is, <em>what kind</em> of problem it is, and <em>which</em> error to fix first. That is the skill you will use every single day at work — and the one that turns this course from “reading about types” into “learning from a tireless second teacher”.</p>

<h3>What you get from this lesson, and why it matters</h3>
<ul>
<li>A five-step loop for every lesson of the course, so practice actually sticks.</li>
<li>The anatomy of a <code>tsc</code> diagnostic (diagnostic = one error report): file, line, column, code, sentence, exit code.</li>
<li>How to read long, multi-line messages without panic.</li>
<li>Why you always fix the <strong>first</strong> error first — measured: 4 → 1 → 1 → 0.</li>
<li>The ten error codes you will meet most, each with a real line of output.</li>
<li><code>// @ts-expect-error</code>: a way to write down the error you expect — the same idea the Code Lab and lab graders of this course use.</li>
</ul>
<p>Why it matters: on a real team, people judge how fast you get from a red build to a green one — calmly, without hiding the bug behind <code>any</code>.</p>

<h3>The loop: five steps per lesson</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Read once</div><div class="lz-d">the whole lesson, no typing — build the map</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Retype</div><div class="lz-d">every example in VS Code; copy-paste teaches nothing</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Hover</div><div class="lz-d">rest the mouse on each variable and read its type</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Break it</div><div class="lz-d">make it red on purpose, read the message</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Practise</div><div class="lz-d">the lesson task, then the Code Lab exercises</div></div>
</div>
<p><strong>Hover</strong> shows the type TypeScript worked out: write <code>const list = [1, 2, 3]</code>, rest the mouse on <code>list</code>, read <code>number[]</code>. <strong>Break it</strong> is the step people skip and the one that teaches most: pass a string where a number belongs, misspell a property, drop an argument — then read the message, as the rest of this lesson shows.</p>

<h3>One error, read like an address</h3>
<p>This small file uses LabFlow’s <code>createBooking</code> (you will meet it properly in Chapter 1). The third line asks for <code>booking.seats</code> — but a <code>Booking</code> has no <code>seats</code> field; the seat count is only part of the <em>input</em>.</p>
${ma('typescript', CODE.anatomy)}
${ra(OUT['01-anatomy'])}
<p>Read it left to right, like an address on an envelope: the <strong>file</strong> (relative to where you ran the command) · <strong>(4,40)</strong> line 4, column 40, the first character of <code>seats</code> · <strong>TS2339</strong> the error code, a stable number you can search for · the <strong>sentence</strong>: Booking has no property seats.</p>
<p>Now the important part. TypeScript only checks; it does not stop Node from running the file:</p>
${ra(OUT['03-anatomy-node'])}
<p><strong>NaN</strong> — “not a number”, silently printed, no crash. In a real app that NaN would flow into a page or a database. tsc found it before anything ran; Node never would.</p>

<h3>Exit code and the --pretty view</h3>
${ra(OUT['02-anatomy-exit'])}
<p><code>tsc</code> exits with <strong>1</strong> when it finds an error and <strong>0</strong> when the project is clean. That number is what CI (continuous integration — the server that checks every push) uses to mark a build red or green. Add <code>--pretty</code> and the same error shows the source line with tildes under the exact characters, plus a count at the end:</p>
${ra(OUT['04-anatomy-pretty'])}

<h3>Long messages: read the last line first</h3>
<p>Some errors are several lines long. The indented lines underneath are an <strong>elaboration chain</strong> (chuỗi giải thích): each one zooms further into why the outer types do not fit.</p>
${ma('typescript', CODE.chain)}
${ra(OUT['05-chain'])}
<p>The first error is short: the nested field <code>email</code> is a number but the type says string — TypeScript points straight at the inner value (line 6, column 59). The second one is the interesting one:</p>
<ol>
<li><strong>Top line — WHAT:</strong> this whole object is not assignable to <code>Booking</code>.</li>
<li><strong>Next line:</strong> the problem is property <code>minutes</code>.</li>
<li><strong>Next:</strong> <code>number | undefined</code> is not assignable to <code>number</code>.</li>
<li><strong>Last line — WHY:</strong> <code>undefined</code> is not a number.</li>
</ol>
<p>So read the bottom line first to learn the cause, then climb up to see where it surfaced. The fix is in <code>fromForm</code>: its <code>minutes</code> parameter allows <code>undefined</code>, but a saved booking must always have minutes. You will see this exact message again in Lab 1 — it is how a “string/number only” attempt loses a point.</p>

<h3>First error first — measured</h3>
<p>One mistake often produces several messages, and fixing one can reveal another. Here is a file with two root mistakes: a wrongly typed <code>role</code> and a misspelled import.</p>
${ma('typescript', CODE.b1)}
${ra(OUT['06-cascade-b1'])}
<p>Four errors. Three of them point at three different calls — but they share one cause on line 3. Watch the counts as we fix from the top:</p>
${CASCADE_EN}
${ra(OUT['06-cascade-b2'])}
${ra(OUT['06-cascade-b3'])}
${ra(OUT['06-cascade-b4'])}
<div class="pitfall co-tieu-de">
<p><strong>Trap — “I fixed it and now there are MORE errors”.</strong> In round 3 the count did not drop to zero; a brand-new TS2339 appeared. Nothing broke. While the import name was wrong, <code>checkSlots</code> did not exist, so TypeScript could not know what it returned — and it simply did not check <code>morning.minutes</code> at all. A broken import hides errors behind it. That is why you fix from the top, recompile, and only then look further down. (Round 4’s <code>if (morning.ok)</code> is called narrowing — Chapter 5 explains it.)</p>
</div>
<p>Pretty mode helps find the shared cause. For each TS2322 it adds a note saying where the expected type was declared:</p>
${ra(PRETTY_B1)}
${ra(PRETTY_B1_TAIL)}
<p>“The expected type comes from property 'role' which is declared here” — in <code>needsApproval</code>. So the rule you broke is “role must be a <code>Role</code>”, and the one line to change is the declaration of <code>role</code>, not the three calls.</p>

<h3>The ten codes you will meet most</h3>
<p>One demo file, one mistake per line — every line below is real output:</p>
${ma('typescript', CODE.codes)}
${ra(OUT['08-codes'])}
${BANG_EN}
<p>Do not memorise numbers; memorise families. <strong>23xx</strong> is mostly “types do not fit”, <strong>2339/2551</strong> “no such property”, <strong>7006</strong> “you did not say the type”, <strong>18048</strong> “might be missing”. When you see a new code, search for it together with a few words of the message.</p>

<h3>The editor and the gate are two different programs</h3>
<p>Your editor draws red squiggles while you type. On the machine used for this course, VS Code 1.124.2 does that with its <strong>own bundled TypeScript 6.0.3</strong>, while the project pins <strong>tsc 7.0.2</strong> (the new Go-native compiler; its announcement says a dedicated VS Code extension exists and built-in support is coming). The two implement the same language and nearly always agree. When they do not, the terminal wins: <code>npx tsc</code> is what CI runs, so it is the <em>gate</em> (cổng chặn) your code must pass.</p>
<p>One more message you will hit on day one. Inside a project that has a <code>tsconfig.json</code>, passing a file name directly is refused:</p>
${ra(OUT['09-ts5112'])}
<p>TypeScript will not silently ignore your project settings. Check a folder with <code>npx tsc -p &lt;folder&gt;</code> (every demo in this course does), or the whole project with <code>npx tsc</code>.</p>

<h3>@ts-expect-error: write down the error you expect</h3>
<p>Put <code>// @ts-expect-error</code> on the line above code you <em>expect</em> to fail. If it fails, tsc stays quiet. If it does not fail, tsc complains about the comment itself:</p>
${ma('typescript', CODE.expect)}
${ra(OUT['10-expect'])}
<p>The call on line 5 fails as expected (a number is not a time string), so its directive is satisfied and silent. The call on line 9 is correct, so the directive on line 8 has nothing to excuse: <strong>TS2578 Unused '@ts-expect-error' directive</strong>. It is a tiny test for the type checker: “tsc must refuse this”.</p>
<p>That is exactly how this course grades type work. A Lab grader or a Code Lab exercise keeps a file of <em>wrong</em> calls; each line ends with a marker such as <code>// expect TS2345</code>. The grader compiles that file against your code and checks that each marked line produces exactly that code. If your types are too loose — <code>any</code> everywhere, <code>string</code> instead of the exact allowed values — some wrong calls slip through and you lose points even though your program runs. You will meet the first one in Lab 1.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — <code>@ts-expect-error</code> as an eraser.</strong> Used to <em>silence</em> errors in real code, it is as bad as <code>@ts-ignore</code>: the bug stays, the red disappears. Use it only to state an expectation (in tests, in exercises). The graders in this course forbid <code>any</code>, <code>@ts-ignore</code>, <code>@ts-nocheck</code> and <code>@ts-expect-error</code> in your solution files.</p>
</div>

<h3>When you are stuck</h3>
<p>Read the <strong>first</strong> error only · hover the variable it names · shrink the failing lines into a new file in a demo folder · search “TS2345” plus a few words · ask with the <strong>full</strong> message, the file and <code>npx tsc -v</code>. Never paste <code>any</code> to make an example compile: that deletes the check and keeps the bug (Lesson 1.4 measures the cost).</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p>The file below has <strong>five</strong> mistakes. Before running anything, write down for each line the code you predict. Then run <code>npx tsc -p demo0/ts-00-2/practice</code> and compare.</p>
${ma('typescript', CODE.practice)}
<p><strong>Real output:</strong></p>
${ra(OUT['11-practice'])}
<p>Line 4: <code>formatTime</code> takes minutes, not a time string (TS2345). Line 5: roles are upper-case, and the suggestion says so (TS2820). Line 6: a typo, with the fix suggested (TS2551). Line 7: <code>usageRate</code> returns a number, the variable claims string (TS2322). Line 8: <code>x</code> has no type (TS7006).</p>
<p><strong>Solution and real output:</strong></p>
${ma('typescript', CODE.practiceFixed)}
${ra(OUT['12-practice-fixed'])}
<p><strong>Done when:</strong> you predicted at least four of the five codes before running; <code>npx tsc -p</code> on your fixed copy prints nothing and exits 0; and the program prints <code>CONFIRMED</code> then <code>07:30 0.14285714285714285 25%</code>.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">diagnostic</span><span class="v">One error report from tsc: file, position, code, message.</span></div>
  <div class="kv"><span class="k">error code (TSxxxx)</span><span class="v">The stable number of an error kind — search with it.</span></div>
  <div class="kv"><span class="k">exit code</span><span class="v">The number a program returns: tsc gives 0 when clean, non-zero on errors; CI reads it.</span></div>
  <div class="kv"><span class="k">--pretty</span><span class="v">Output with the source line, ~~~ underline, related notes and a final count.</span></div>
  <div class="kv"><span class="k">elaboration chain</span><span class="v">Indented lines under an error, each narrowing down why types do not fit; the last is usually the cause.</span></div>
  <div class="kv"><span class="k">cascade</span><span class="v">Several errors caused by one mistake — or hidden behind it.</span></div>
  <div class="kv"><span class="k">gate</span><span class="v">The check code must pass before merging: here, <code>npx tsc</code> exiting 0.</span></div>
  <div class="kv"><span class="k">@ts-expect-error</span><span class="v">A comment stating “the next line must fail”; if it does not, TS2578.</span></div>
</div>


<h3>📌 Summary</h3>
<ul>
<li>Loop for every lesson: read, retype, hover, break it on purpose, practise.</li>
<li>A diagnostic reads like an address: file, (line,col), TS code, sentence. tsc exits 1 on errors — Node still runs the file (NaN, no warning).</li>
<li>Multi-line messages: the top says what does not fit, the last indented line says why.</li>
<li>Fix the first error first and recompile: 4 → 1 → 1 → 0, because a broken import hides checks behind it.</li>
<li>Ten codes cover most of this course; learn them by family.</li>
<li>VS Code (TS 6.0.3) helps you write; <code>npx tsc</code> (7.0.2) is the gate. Inside a project use <code>-p</code>, or meet TS5112.</li>
<li><code>@ts-expect-error</code> states an expected error (TS2578 if wrong) — the same idea as the course graders’ <code>// expect TSxxxx</code> markers.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📄', 'TypeScript 3.9 release notes — // @ts-expect-error comments', 'Where the directive was introduced and how it differs from @ts-ignore. Read 1 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html')}
${nguon('⚙️', 'TypeScript Handbook — tsc CLI options', 'Every command-line flag, including --pretty, -p and --noEmit. Read 1 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/compiler-options.html')}
${nguon('🚀', 'Announcing TypeScript 7.0 (Microsoft, 8 Jul 2026)', 'The Go-native compiler used in this course, and its editor support. Read 1 Nov 2026.', 'https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/')}
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Cách học: để trình biên dịch dạy bạn</h2>
<p class="lead">Học xong bài này, nhìn vào bất kỳ thông báo đỏ nào của TypeScript bạn cũng biết trong vài giây: lỗi <em>ở đâu</em>, thuộc <em>loại gì</em>, và nên sửa lỗi <em>nào</em> trước. Đó là kỹ năng dùng hằng ngày khi đi làm — và là thứ biến khoá này từ "đọc về kiểu" thành "học cùng một người thầy thứ hai không bao giờ mệt".</p>

<h3>Bài này cho bạn gì, và vì sao quan trọng</h3>
<ul>
<li>Một vòng học năm bước dùng cho mọi bài trong khoá, để luyện tập thật sự thấm.</li>
<li>Giải phẫu một diagnostic (thông báo chẩn đoán — một báo lỗi) của <code>tsc</code>: tệp, dòng, cột, mã, câu giải thích, exit code.</li>
<li>Cách đọc thông báo dài nhiều dòng mà không hoảng.</li>
<li>Vì sao luôn sửa lỗi <strong>đầu tiên</strong> trước — đo thật: 4 → 1 → 1 → 0.</li>
<li>Mười mã lỗi gặp nhiều nhất, mỗi mã kèm một dòng output thật.</li>
<li><code>// @ts-expect-error</code>: cách ghi ra lỗi mình đoán sẽ có — chính ý tưởng mà máy chấm Code Lab và máy chấm lab của khoá này dùng.</li>
</ul>
<p>Vì sao quan trọng: trong nhóm thật, người ta đánh giá bạn đi từ bản build đỏ tới xanh nhanh tới đâu — bình tĩnh, không giấu bug sau <code>any</code>.</p>

<h3>Vòng học: năm bước mỗi bài</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Đọc một lượt</div><div class="lz-d">cả bài, chưa gõ — dựng bản đồ</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Gõ lại</div><div class="lz-d">mọi ví dụ trong VS Code; chép-dán không dạy gì</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Rê chuột</div><div class="lz-d">lên từng biến và đọc kiểu của nó</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Làm hỏng</div><div class="lz-d">cố ý làm đỏ, đọc thông báo</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Luyện tập</div><div class="lz-d">bài thực hành, rồi đề Code Lab</div></div>
</div>
<p><strong>Rê chuột (hover)</strong> hiện kiểu TypeScript đã suy ra: viết <code>const list = [1, 2, 3]</code>, để chuột lên <code>list</code>, đọc <code>number[]</code>. <strong>Cố ý làm hỏng</strong> là bước hay bị bỏ mà dạy nhiều nhất: truyền chuỗi vào chỗ cần số, gõ sai tên thuộc tính, bỏ một đối số — rồi đọc thông báo, như phần còn lại của bài chỉ cách.</p>

<h3>Một lỗi, đọc như đọc địa chỉ</h3>
<p>Tệp nhỏ này dùng <code>createBooking</code> của LabFlow (Chương 1 sẽ giới thiệu kỹ). Dòng thứ ba đòi <code>booking.seats</code> — nhưng một <code>Booking</code> không có trường <code>seats</code>; số chỗ chỉ nằm trong dữ liệu <em>đầu vào</em>.</p>
${ma('typescript', CODE.anatomy)}
${ra(OUT['01-anatomy'])}
<p>Đọc từ trái sang phải, như đọc địa chỉ trên phong bì: <strong>tệp</strong> (tính từ chỗ bạn chạy lệnh) · <strong>(4,40)</strong> dòng 4, cột 40, ký tự đầu của <code>seats</code> · <strong>TS2339</strong> mã lỗi, một con số cố định tra cứu được · <strong>câu giải thích</strong>: kiểu Booking không có thuộc tính seats.</p>
<p>Giờ tới phần quan trọng. TypeScript chỉ kiểm; nó không cản Node chạy tệp:</p>
${ra(OUT['03-anatomy-node'])}
<p><strong>NaN</strong> — "không phải số", in ra lặng lẽ, không sập. Trong ứng dụng thật, NaN đó sẽ chảy lên trang web hay vào cơ sở dữ liệu. tsc thấy nó trước khi có gì chạy; Node thì không bao giờ.</p>

<h3>Exit code và dạng --pretty</h3>
${ra(OUT['02-anatomy-exit'])}
<p><code>tsc</code> thoát với mã <strong>1</strong> khi có lỗi và <strong>0</strong> khi dự án sạch. Con số đó là thứ CI (continuous integration — máy chủ kiểm mỗi lần push) dùng để đánh dấu bản build đỏ hay xanh. Thêm <code>--pretty</code>, cùng lỗi đó hiện kèm dòng mã nguồn, dấu ngã dưới đúng các ký tự bị chê, và dòng đếm ở cuối:</p>
${ra(OUT['04-anatomy-pretty'])}

<h3>Thông báo dài: đọc dòng cuối trước</h3>
<p>Có lỗi dài nhiều dòng. Các dòng thụt vào bên dưới là <strong>elaboration chain</strong> (chuỗi giải thích): mỗi dòng soi sâu thêm vì sao hai kiểu bên ngoài không khớp.</p>
${ma('typescript', CODE.chain)}
${ra(OUT['05-chain'])}
<p>Lỗi thứ nhất ngắn: trường lồng bên trong <code>email</code> là số trong khi kiểu nói là chuỗi — TypeScript chỉ thẳng vào giá trị bên trong (dòng 6, cột 59). Lỗi thứ hai mới đáng học:</p>
<ol>
<li><strong>Dòng trên cùng — CÁI GÌ:</strong> cả object này không gán được cho <code>Booking</code>.</li>
<li><strong>Dòng kế:</strong> vấn đề nằm ở thuộc tính <code>minutes</code>.</li>
<li><strong>Kế nữa:</strong> <code>number | undefined</code> không gán được cho <code>number</code>.</li>
<li><strong>Dòng cuối — VÌ SAO:</strong> <code>undefined</code> không phải số.</li>
</ol>
<p>Vậy hãy đọc dòng cuối trước để biết nguyên nhân, rồi lần ngược lên để thấy nó lộ ra ở đâu. Chỗ sửa nằm ở <code>fromForm</code>: tham số <code>minutes</code> cho phép <code>undefined</code>, nhưng một lượt đặt đã lưu thì luôn phải có số phút. Bạn sẽ gặp lại đúng thông báo này ở Lab 1 — đó là lý do lần thử "chỉ dùng string/number" bị trừ một điểm.</p>

<h3>Sửa lỗi đầu tiên trước — đo thật</h3>
<p>Một chỗ sai thường sinh nhiều thông báo, và sửa một lỗi có thể làm lộ lỗi khác. Đây là tệp có hai chỗ sai gốc: <code>role</code> khai báo sai kiểu và một import gõ nhầm tên.</p>
${ma('typescript', CODE.b1)}
${ra(OUT['06-cascade-b1'])}
<p>Bốn lỗi. Ba lỗi chỉ vào ba lời gọi khác nhau — nhưng chung một nguyên nhân ở dòng 3. Theo dõi số lỗi khi sửa từ trên xuống:</p>
${CASCADE_VI}
${ra(OUT['06-cascade-b2'])}
${ra(OUT['06-cascade-b3'])}
${ra(OUT['06-cascade-b4'])}
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "sửa xong lại ra NHIỀU lỗi hơn".</strong> Ở lượt 3 số lỗi không về 0; một lỗi TS2339 hoàn toàn mới xuất hiện. Không có gì hỏng thêm. Khi tên import còn sai, <code>checkSlots</code> không tồn tại, TypeScript không biết nó trả về gì — và đơn giản là không kiểm <code>morning.minutes</code>. Một import hỏng che các lỗi phía sau nó. Vì vậy hãy sửa từ trên xuống, biên dịch lại, rồi mới nhìn tiếp. (Câu <code>if (morning.ok)</code> ở lượt 4 gọi là thu hẹp kiểu — Chương 5 giải thích.)</p>
</div>
<p>Chế độ pretty giúp tìm nguyên nhân chung. Với mỗi lỗi TS2322 nó thêm một ghi chú cho biết kiểu mong đợi được khai báo ở đâu:</p>
${ra(PRETTY_B1)}
${ra(PRETTY_B1_TAIL)}
<p>"The expected type comes from property 'role' which is declared here" — kiểu mong đợi đến từ thuộc tính role, khai báo trong <code>needsApproval</code>. Vậy luật bạn phạm là "role phải là một <code>Role</code>", và dòng cần đổi là khai báo của <code>role</code>, không phải ba lời gọi.</p>

<h3>Mười mã lỗi gặp nhiều nhất</h3>
<p>Một tệp demo, mỗi dòng một lỗi — mọi dòng dưới đây là output thật:</p>
${ma('typescript', CODE.codes)}
${ra(OUT['08-codes'])}
${BANG_VI}
<p>Đừng học thuộc số; hãy học theo họ. <strong>23xx</strong> phần lớn là "kiểu không khớp", <strong>2339/2551</strong> là "không có thuộc tính đó", <strong>7006</strong> là "bạn chưa nói kiểu", <strong>18048</strong> là "có thể đang thiếu". Gặp mã mới thì tra mã kèm vài chữ của thông báo.</p>

<h3>Editor và cổng chặn là hai chương trình khác nhau</h3>
<p>Editor tô đỏ ngay khi bạn gõ. Trên máy soạn khoá này, VS Code 1.124.2 làm việc đó bằng <strong>bản TypeScript 6.0.3 đóng gói sẵn của nó</strong>, trong khi dự án ghim <strong>tsc 7.0.2</strong> (trình biên dịch mới viết bằng Go; bài công bố của nó nói đã có extension VS Code riêng và hỗ trợ sẵn trong VS Code sắp tới). Hai bản cùng một ngôn ngữ và gần như luôn khớp nhau. Khi chúng lệch, terminal thắng: <code>npx tsc</code> là thứ CI chạy, nên nó là <em>cổng chặn</em> (gate) mà code của bạn phải qua.</p>
<p>Thêm một thông báo bạn sẽ gặp ngay ngày đầu. Trong dự án có <code>tsconfig.json</code>, truyền thẳng tên tệp sẽ bị từ chối:</p>
${ra(OUT['09-ts5112'])}
<p>TypeScript không lặng lẽ bỏ qua cấu hình dự án của bạn. Hãy kiểm một thư mục bằng <code>npx tsc -p &lt;thư mục&gt;</code> (mọi demo của khoá đều làm vậy), hoặc cả dự án bằng <code>npx tsc</code>.</p>

<h3>@ts-expect-error: ghi ra lỗi bạn đoán sẽ có</h3>
<p>Đặt <code>// @ts-expect-error</code> ngay trên dòng code bạn <em>đoán</em> sẽ lỗi. Nếu nó lỗi thật, tsc im lặng. Nếu không lỗi, tsc phàn nàn về chính dòng chú thích:</p>
${ma('typescript', CODE.expect)}
${ra(OUT['10-expect'])}
<p>Lời gọi ở dòng 5 lỗi đúng như đoán (số không phải chuỗi giờ), nên chỉ thị của nó được thoả và im lặng. Lời gọi ở dòng 9 đúng, nên chỉ thị ở dòng 8 không có gì để "miễn": <strong>TS2578 Unused '@ts-expect-error' directive</strong> — chỉ thị thừa. Đây là một bài test tí hon cho trình kiểm kiểu: "tsc phải từ chối dòng này".</p>
<p>Khoá này chấm phần kiểu đúng theo cách đó. Máy chấm Lab hay đề Code Lab giữ một tệp gồm các lời gọi <em>sai</em>; cuối mỗi dòng có dấu kiểu <code>// expect TS2345</code>. Máy chấm biên dịch tệp đó với code của bạn và kiểm mỗi dòng đánh dấu có ra đúng mã đó không. Nếu kiểu của bạn quá lỏng — <code>any</code> khắp nơi, <code>string</code> thay vì đúng tập giá trị cho phép — vài lời gọi sai sẽ lọt và bạn mất điểm, dù chương trình vẫn chạy. Bạn sẽ gặp máy chấm đầu tiên ở Lab 1.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — dùng <code>@ts-expect-error</code> làm cục tẩy.</strong> Dùng để <em>bịt</em> lỗi trong code thật thì nó tệ y như <code>@ts-ignore</code>: con bug ở lại, chữ đỏ biến mất. Chỉ dùng nó để nói ra một kỳ vọng (trong test, trong bài tập). Máy chấm của khoá cấm <code>any</code>, <code>@ts-ignore</code>, <code>@ts-nocheck</code> và <code>@ts-expect-error</code> trong tệp lời giải của bạn.</p>
</div>

<h3>Khi bí</h3>
<p>Chỉ đọc lỗi <strong>đầu tiên</strong> · rê chuột lên biến nó nhắc tới · chép các dòng lỗi sang một tệp mới trong thư mục demo cho tới khi chỉ còn lỗi đó · tra "TS2345" kèm vài chữ · khi hỏi thì dán <strong>nguyên</strong> thông báo, tệp và <code>npx tsc -v</code>. Đừng bao giờ dán <code>any</code> để ví dụ biên dịch được: làm vậy là xoá phép kiểm mà giữ con bug (bài 1.4 đo cái giá đó).</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<p>Tệp dưới đây có <strong>năm</strong> chỗ sai. Trước khi chạy gì, hãy ghi ra cho mỗi dòng mã lỗi bạn đoán. Rồi chạy <code>npx tsc -p demo0/ts-00-2/practice</code> và so.</p>
${ma('typescript', CODE.practice)}
<p><strong>Output thật:</strong></p>
${ra(OUT['11-practice'])}
<p>Dòng 4: <code>formatTime</code> nhận số phút, không nhận chuỗi giờ (TS2345). Dòng 5: vai trò viết hoa, và gợi ý nói đúng như vậy (TS2820). Dòng 6: gõ nhầm, có gợi ý sửa (TS2551). Dòng 7: <code>usageRate</code> trả về số, biến lại khai là chuỗi (TS2322). Dòng 8: <code>x</code> chưa có kiểu (TS7006).</p>
<p><strong>Lời giải và output thật:</strong></p>
${ma('typescript', CODE.practiceFixed)}
${ra(OUT['12-practice-fixed'])}
<p><strong>Đạt khi:</strong> bạn đoán đúng ít nhất bốn trên năm mã trước khi chạy; <code>npx tsc -p</code> trên bản đã sửa không in gì và thoát 0; chương trình in <code>CONFIRMED</code> rồi <code>07:30 0.14285714285714285 25%</code>.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">diagnostic (thông báo chẩn đoán)</span><span class="v">Một báo lỗi của tsc: tệp, vị trí, mã, thông điệp.</span></div>
  <div class="kv"><span class="k">error code — TSxxxx (mã lỗi)</span><span class="v">Con số cố định của một loại lỗi — dùng để tra cứu.</span></div>
  <div class="kv"><span class="k">exit code (mã thoát)</span><span class="v">Số chương trình trả về: tsc trả 0 khi sạch, khác 0 khi có lỗi; CI đọc nó.</span></div>
  <div class="kv"><span class="k">--pretty</span><span class="v">Dạng output có dòng mã nguồn, gạch ~~~, ghi chú liên quan và dòng đếm cuối.</span></div>
  <div class="kv"><span class="k">elaboration chain (chuỗi giải thích)</span><span class="v">Các dòng thụt vào dưới một lỗi, mỗi dòng nói rõ hơn vì sao kiểu không khớp; dòng cuối thường là nguyên nhân.</span></div>
  <div class="kv"><span class="k">cascade (lỗi dây chuyền)</span><span class="v">Nhiều lỗi do một chỗ sai gây ra — hoặc bị nó che đi.</span></div>
  <div class="kv"><span class="k">gate (cổng chặn)</span><span class="v">Phép kiểm code phải qua trước khi gộp: ở đây là <code>npx tsc</code> thoát 0.</span></div>
  <div class="kv"><span class="k">@ts-expect-error</span><span class="v">Chú thích nói "dòng sau phải lỗi"; nếu không lỗi thì TS2578.</span></div>
</div>


<h3>📌 Tóm tắt</h3>
<ul>
<li>Vòng học cho mọi bài: đọc, gõ lại, rê chuột, cố ý làm hỏng, luyện tập.</li>
<li>Một diagnostic đọc như địa chỉ: tệp, (dòng,cột), mã TS, câu. tsc thoát 1 khi có lỗi — Node vẫn chạy tệp (NaN, không cảnh báo).</li>
<li>Thông báo nhiều dòng: dòng trên nói cái gì không khớp, dòng thụt cuối nói vì sao.</li>
<li>Sửa lỗi đầu tiên trước rồi biên dịch lại: 4 → 1 → 1 → 0, vì import hỏng che các phép kiểm phía sau.</li>
<li>Mười mã lỗi phủ gần hết khoá; học theo họ.</li>
<li>VS Code (TS 6.0.3) giúp bạn viết; <code>npx tsc</code> (7.0.2) là cổng chặn. Trong dự án hãy dùng <code>-p</code>, không thì gặp TS5112.</li>
<li><code>@ts-expect-error</code> nói ra một lỗi mong đợi (sai thì TS2578) — cùng ý tưởng với dấu <code>// expect TSxxxx</code> của máy chấm trong khoá.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📄', 'Ghi chú phát hành TypeScript 3.9 — chú thích // @ts-expect-error', 'Nơi chỉ thị này ra đời và khác @ts-ignore ở đâu. Đọc ngày 01/11/2026.', 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html')}
${nguon('⚙️', 'TypeScript Handbook — các tuỳ chọn dòng lệnh của tsc', 'Mọi cờ dòng lệnh, gồm --pretty, -p và --noEmit. Đọc ngày 01/11/2026.', 'https://www.typescriptlang.org/docs/handbook/compiler-options.html')}
${nguon('🚀', 'Announcing TypeScript 7.0 (Microsoft, 08/07/2026)', 'Trình biên dịch viết bằng Go mà khoá này dùng, và hỗ trợ editor của nó. Đọc ngày 01/11/2026.', 'https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/')}
</div>
`,
};
