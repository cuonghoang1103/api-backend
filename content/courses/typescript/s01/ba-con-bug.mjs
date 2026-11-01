/**
 * TypeScript · Chương 1 · 1.1 — Ba con bug JavaScript đẩy thẳng lên production. Slug giữ: typescript-1-1-ba-con-bug.
 * BÀI MỞ CHƯƠNG (01/11/2026, đợt mẫu). Mọi code/output lấy từ ./_ma-ts-01-1.mjs (sinh từ labflow-ts chạy thật: Node 22.23.3, tsc 7.0.2).
 */
import G from '../giang/ts-01-1.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-01-1.mjs';

const BOOKING = CODE.bookingJs.split('\n');
const APPROVAL_JS = BOOKING.slice(23, 30).join('\n');
const USAGE_JS = BOOKING.slice(43, 49).join('\n');
const BOOKING_TS = CODE.bookingTs.split('\n');
const ROLE_TS = BOOKING_TS.slice(9, 10).join('\n');
const APPROVAL_TS = BOOKING_TS.slice(36, 43).join('\n');
const TSC_LINES = OUT['15-tsc'].split('\n');
const TSC_CALLS = TSC_LINES.slice(0, 5).join('\n');
const TSC_TYPO = [TSC_LINES[0], TSC_LINES[5]].join('\n');
const TSC_ROLE = [TSC_LINES[0], TSC_LINES[4]].join('\n');
const GE_TEST = OUT['17-ge-test'].split('\n').filter((l) => /^\$|^✔|^✖ exactly|^ℹ (pass|fail)|AssertionError|!==/.test(l)).filter((l, i, a) => a.indexOf(l) === i).join('\n');
const TIME_A = OUT['21-time-a'].split('\n').filter((l) => /^\$|^real/.test(l)).join('\n');
const TIME_B = OUT['21-time-b'].split('\n').filter((l) => /^real/.test(l)).join('\n');

const BANG_EN = `<table>
<thead><tr><th>Bug</th><th>What Node does</th><th>What tsc says (before running)</th><th>Who finds it, and when</th></tr></thead>
<tbody>
<tr><td>typo <code>b.minute</code> in <code>usageRate</code></td><td>prints <code>NaN</code>, exit code 0</td><td>TS2551, line 7, “Did you mean 'minutes'?”</td><td>a user staring at “NaN%” ⇒ you, in the editor</td></tr>
<tr><td><code>needsApproval({ seat: 31, … })</code></td><td>RangeError — only when that line runs</td><td>TS2561, line 4, “Did you mean to write 'seats'?”</td><td>whoever first opens that screen ⇒ you</td></tr>
<tr><td><code>checkSlot(480, 600)</code></td><td>TypeError “Invalid time "480"” — when it runs</td><td>TS2345, line 5</td><td>a user ⇒ you</td></tr>
<tr><td><code>checkSlot('08:00')</code></td><td>TypeError “Invalid time "undefined"” — when it runs</td><td>TS2554, line 6</td><td>a user ⇒ you</td></tr>
<tr><td>role <code>'lecturer'</code></td><td>returns <code>true</code>, <strong>no error at all</strong></td><td>TS2820, line 7, “Did you mean '"LECTURER"'?”</td><td>maybe nobody, for weeks ⇒ you</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Bug</th><th>Node làm gì</th><th>tsc nói gì (trước khi chạy)</th><th>Ai phát hiện, khi nào</th></tr></thead>
<tbody>
<tr><td>gõ nhầm <code>b.minute</code> trong <code>usageRate</code></td><td>in <code>NaN</code>, exit code 0</td><td>TS2551, dòng 7, “Did you mean 'minutes'?”</td><td>người dùng nhìn thấy “NaN%” ⇒ bạn, ngay trong editor</td></tr>
<tr><td><code>needsApproval({ seat: 31, … })</code></td><td>RangeError — chỉ khi dòng đó chạy</td><td>TS2561, dòng 4, “Did you mean to write 'seats'?”</td><td>người đầu tiên mở màn hình đó ⇒ bạn</td></tr>
<tr><td><code>checkSlot(480, 600)</code></td><td>TypeError “Invalid time "480"” — khi chạy</td><td>TS2345, dòng 5</td><td>người dùng ⇒ bạn</td></tr>
<tr><td><code>checkSlot('08:00')</code></td><td>TypeError “Invalid time "undefined"” — khi chạy</td><td>TS2554, dòng 6</td><td>người dùng ⇒ bạn</td></tr>
<tr><td>vai trò <code>'lecturer'</code></td><td>trả về <code>true</code>, <strong>không lỗi gì cả</strong></td><td>TS2820, dòng 7, “Did you mean '"LECTURER"'?”</td><td>có khi không ai, trong nhiều tuần ⇒ bạn</td></tr>
</tbody>
</table>`;

const MA_EN = `<div class="kv-grid">
  <div class="kv"><span class="k">TS2551</span><span class="v">Property does not exist on the type — and tsc found a close name: “Did you mean…?”. Almost always a typo.</span></div>
  <div class="kv"><span class="k">TS2561</span><span class="v">An object literal has a key the target type does not have, with a suggestion. (TS2353 is the same without a suggestion.)</span></div>
  <div class="kv"><span class="k">TS2345</span><span class="v">An argument’s type does not fit the parameter’s type.</span></div>
  <div class="kv"><span class="k">TS2554</span><span class="v">Expected N arguments, but got M.</span></div>
  <div class="kv"><span class="k">TS2820</span><span class="v">A value is not one of the allowed literal values — with the closest allowed one.</span></div>
  <div class="kv"><span class="k">TS2322</span><span class="v">A value of one type assigned where another is required (you will meet it in 1.3).</span></div>
</div>`;
const MA_VI = `<div class="kv-grid">
  <div class="kv"><span class="k">TS2551</span><span class="v">Thuộc tính không có trên kiểu — và tsc tìm được tên gần giống: “Did you mean…?”. Gần như luôn là gõ nhầm.</span></div>
  <div class="kv"><span class="k">TS2561</span><span class="v">Object literal có khoá mà kiểu đích không có, kèm gợi ý. (TS2353 là bản không có gợi ý.)</span></div>
  <div class="kv"><span class="k">TS2345</span><span class="v">Kiểu của đối số không khớp kiểu của tham số.</span></div>
  <div class="kv"><span class="k">TS2554</span><span class="v">Cần N đối số, nhưng nhận M.</span></div>
  <div class="kv"><span class="k">TS2820</span><span class="v">Giá trị không thuộc các giá trị literal được phép — kèm giá trị được phép gần nhất.</span></div>
  <div class="kv"><span class="k">TS2322</span><span class="v">Gán giá trị kiểu này vào chỗ cần kiểu khác (gặp ở bài 1.3).</span></div>
</div>`;

export default {
  title: '1.1 — Three bugs JavaScript ships to production|||1.1 — Ba con bug JavaScript đẩy thẳng lên production',
  slug: 'typescript-1-1-ba-con-bug',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mở Chương 1: lấy đúng luật đặt phòng LabFlow viết bằng JavaScript, mắc ba loại lỗi hay gặp nhất (gõ nhầm, sai hình dạng lời gọi, sai giá trị) và đo thật Node làm gì (NaN, ném lỗi chỉ khi nhánh đó chạy, trả kết quả sai im lặng) so với tsc 7 (TS2551, TS2561, TS2345, TS2554, TS2820 trong 0,3 giây); kiểu literal Role; bẫy "biên dịch được chưa chắc đúng" bắt bằng node --test.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>Three bugs JavaScript ships to production</h2>
<p class="lead">You already write JavaScript. This lesson shows, with real output, what happens to three ordinary mistakes in a real module: Node either prints nonsense, crashes only when an unlucky user reaches that line, or quietly gives the wrong answer. Then the same mistakes go through the TypeScript compiler, which refuses all of them in a third of a second — before a single line runs.</p>

<h3>After Chapter 1 you can…</h3>
<ul>
<li><strong>Convert a JavaScript module to strict TypeScript</strong> — the LabFlow booking rules — and prove it with a grader (Lab 1).</li>
<li><strong>Read a compiler error</strong> at a glance: file, line, column, code, reason — and know the dozen codes you will see daily.</li>
<li><strong>Say precisely what tsc proves and what it cannot</strong> (lesson 1.2): your files agree with each other; data from outside is a different job.</li>
<li><strong>Let inference do most of the typing</strong> (1.3) and annotate only where a value enters.</li>
<li><strong>Use <code>unknown</code> instead of <code>any</code></strong> (1.4), and migrate a codebase step by step.</li>
</ul>
<p>Why it matters for you: in a group project (SWP391, your graduation project) the backend and the frontend are written by different people. When someone renames a field or changes a status, TypeScript turns “the demo broke in front of the lecturer” into “the build is red on my laptop”. In interviews for Node.js jobs, “what does TypeScript actually buy you?” is a standard question — after this lesson you can answer with numbers.</p>

<h3>The code under test: LabFlow’s rules, in plain JavaScript</h3>
<p>The whole course works on one project, <strong>LabFlow</strong> — a system for booking university computer labs. The two files below are copied unchanged from the Testing course (LabFlow Lite). Times are strings like <code>"08:00"</code>; <code>parseTime</code> turns them into minutes since midnight and throws on anything else:</p>
${ma('javascript', CODE.timeJs)}
<p>Two rules from <code>js/booking.js</code> are the stars of this lesson. <code>needsApproval</code> is business rule <strong>BR-06</strong> — a student booking more than 30 seats must wait for approval; lecturers and admins never wait. <code>usageRate</code> adds up how much of the opening day (07:00–21:00, that is 840 minutes) is booked:</p>
${ma('javascript', APPROVAL_JS)}
${ma('javascript', USAGE_JS)}
<p>Read the code and notice what is <em>missing</em>: nothing says that <code>seats</code> is a number, that <code>role</code> can only be three particular strings, or that a booking has a <code>minutes</code> field. That knowledge exists only in the author’s head. Every bug below lives in that gap.</p>

<h3>Bug 1 — the typo</h3>
<p>One letter missing: <code>b.minute</code> instead of <code>b.minutes</code>. In JavaScript, reading a property that does not exist is not an error — it simply gives <code>undefined</code>:</p>
${ma('javascript', CODE.typoJs)}
${ra(OUT['11-typo-js'])}
<p>Exit code 0. <code>undefined / 840</code> is <code>NaN</code>, and <code>NaN</code> plus anything is still <code>NaN</code>. On a real dashboard this shows up as “NaN%” — far from the line that caused it, and possibly days later.</p>
<p>Now the same function with one annotation on the parameter: “a read-only list of things that each have <code>minutes</code>, a number”. The body, typo included, is unchanged:</p>
${ma('typescript', CODE.typoTs)}
${ra(TSC_TYPO)}
<p>Read the error line left to right: <strong>file</strong> <code>usage-typo.ts</code>, <strong>line 7, column 39</strong> (exactly where <code>minute</code> starts), <strong>code</strong> TS2551, then the reason in plain English — with the fix. Nothing was executed; tsc only <em>read</em> the code.</p>

<h3>Bug 2 — the wrong shape of a call</h3>
<p>The function is right; the <em>call</em> is wrong. Three classic versions: a misspelled key (<code>seat</code>), numbers where the function expects <code>"HH:MM"</code> strings, and a forgotten argument. First, one of them on its own, so you see what a real crash looks like:</p>
${ma('javascript', CODE.seatJs)}
${ra(OUT['12-seat-js'])}
<p>The function received <code>seats: undefined</code>, its own guard threw a <code>RangeError</code>, and the process died with exit code 1. To see all three without dying at the first one, we wrap each call and print what happens:</p>
${ma('javascript', CODE.shapeJs)}
${ra(OUT['13-shape-js'])}
<p>Notice the third line: the forgotten argument becomes <code>undefined</code>, which <code>parseTime</code> turns into the text “undefined”. JavaScript never says “you forgot an argument”; you have to work it out backwards from a message about time formats. And the key point: <strong>each of these throws only when that exact line runs</strong>. If the call sits in a screen people rarely open — the admin page, the end-of-month report — the first person to run it is a user.</p>
<p>Now the same calls, but against the <em>typed</em> version of the rules in <code>src/rules/booking.ts</code> (you will write this file yourself in Lab 1):</p>
${ma('typescript', CODE.callsTs)}
${ra(TSC_CALLS)}
<p>Four lines in, four errors out, each pinned to the exact character: TS2561 for the unknown key (with “Did you mean to write 'seats'?”), TS2345 for the wrong argument type, TS2554 for the missing argument. The fourth one is Bug 3.</p>

<h3>Bug 3 — the wrong value: the most expensive kind</h3>
${ma('javascript', CODE.roleJs)}
${ra(OUT['14-role-js'])}
<p>No exception, no log line, exit code 0. <code>'lecturer' === 'LECTURER'</code> is <code>false</code>, so the code falls through to the student rule, and a lecturer booking 31 seats is told to wait for approval. Bugs that crash get fixed the same day because someone sees a stack trace. Bugs like this one produce a <em>wrong business decision</em> and can live for weeks.</p>
<p>The typed version says, in one line, which strings a role can be:</p>
${ma('typescript', ROLE_TS)}
${ma('typescript', APPROVAL_TS)}
<p>Read <code>type Role = 'STUDENT' | 'LECTURER' | 'ADMIN'</code> as a sentence: “a Role is the string STUDENT, or the string LECTURER, or the string ADMIN — nothing else”. The <code>|</code> means “or”. This is called a <strong>literal union</strong> (union of literal types); Chapter 5 is entirely about them. For now one line is enough:</p>
${ra(TSC_ROLE)}
<p>TS2820 — and tsc even proposes the upper-case spelling.</p>

<h3>Moving errors left</h3>
${BANG_EN}
<p>How long did the compiler take to find all five? Measured twice on the machine that wrote this course, including <code>npx</code> start-up:</p>
${ra(TIME_A + '\n…\n' + TIME_B)}
<p>About a third of a second, without running anything, without needing a test for each path, without a user. Engineers call this <strong>shifting left</strong>: on a timeline that goes “write → check → run → user”, the error is found further to the left, where it is cheapest. The old version of this lesson put it in one sentence that is still the best summary of TypeScript: it moves errors from runtime (late, in production, far from the cause) to compile time (early, in your editor, on the exact line).</p>

<!-- SODO-TS -->
<h3>🗺 Where each bug is found</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">You write</div><div class="lz-d">the typo, the wrong call, the wrong string</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">tsc reads</div><div class="lz-d">TypeScript: all 5 found here, 0.3 s</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Node runs</div><div class="lz-d">JavaScript: 3 crash, only if that line runs</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">A user sees</div><div class="lz-d">JavaScript: “NaN%”, a wrong approval</div></div>
</div>

<div class="pitfall co-tieu-de">
<p><strong>Trap — a program that compiles is not a correct program.</strong> Change one character in BR-06: <code>&gt;=</code> instead of <code>&gt;</code>.</p>
${ma('typescript', CODE.geTs)}
${ra(OUT['16-ge-tsc'])}
<p>Silence, exit 0: <code>&gt;=</code> and <code>&gt;</code> are both perfectly valid on numbers. TypeScript checks <em>shapes</em> — is it a number, does the key exist, is the string one of the allowed ones — not business rules. The rule says “<strong>more than</strong> 30”, so exactly 30 seats must not wait. Only a test at the boundary notices:</p>
${ma('typescript', CODE.geTest)}
${ra(GE_TEST)}
<p>Types replace the tests that say “this argument is a string”. They replace none of the tests that say “this function computes the right answer”. A team that deletes its tests after adopting TypeScript has swapped one safety net for a different one, not added one.</p>
</div>

<h3>Five codes you will read every day</h3>
${MA_EN}

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p>In the project, <code>demo1/ts-01-1/practice/start/usage.ts</code> has the typo <em>and</em> a parameter typed as <code>any</code>, which switches checking off for it:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['18-pr-start'])}
<ol>
<li>Run the command above: tsc is silent, Node prints <code>NaN</code>. Explain in one sentence why tsc did not help.</li>
<li>Replace <code>any</code> with a type that says what a booking has. Run tsc again and read the error (do not fix the typo yet).</li>
<li>Fix the typo, run tsc and Node again.</li>
</ol>
<p><strong>Solution and real output.</strong> Step 1: <code>any</code> means “do not check this value”, so <code>b.minute</code> is accepted. Step 2:</p>
${ma('typescript', CODE.prStep1)}
${ra(OUT['19-pr-step1'])}
<p>Step 3:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['20-pr-sol'])}
<p><strong>Done when:</strong> with the typo, tsc prints TS2551 at line 7; without it, tsc prints nothing and Node prints <code>0.5</code> (420 of 840 minutes). Code Lab has four more exercises for this lesson (type <code>usageRate</code>, <code>checkSlot</code>, the role, and the whole <code>createBooking</code>).</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">type annotation</span><span class="v">The <code>: string</code> or <code>: number</code> after a name: you tell tsc what a value is.</span></div>
  <div class="kv"><span class="k">compile time</span><span class="v">When tsc reads your code. Nothing runs; types exist.</span></div>
  <div class="kv"><span class="k">runtime</span><span class="v">When Node (or a browser) executes the JavaScript. Types are gone.</span></div>
  <div class="kv"><span class="k">diagnostic</span><span class="v">One error line from tsc: file(line,column): error TSxxxx: reason.</span></div>
  <div class="kv"><span class="k">literal union</span><span class="v">A type listing the exact allowed values, e.g. <code>'STUDENT' | 'LECTURER' | 'ADMIN'</code>.</span></div>
  <div class="kv"><span class="k">shift left</span><span class="v">Finding an error earlier on the write → check → run → user timeline, where it is cheaper.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>JavaScript accepts three kinds of mistake without a word: the typo (<code>NaN</code>), the wrong call shape (a crash only when that line runs), the wrong value (a silent wrong answer).</li>
<li>With a few annotations, tsc refuses all of them before running anything: TS2551, TS2561, TS2345, TS2554, TS2820 — five errors in about 0.3 s here.</li>
<li>Read every diagnostic as file, line, column, code, reason. The “Did you mean…?” part is usually the fix.</li>
<li>A literal union such as <code>type Role = 'STUDENT' | 'LECTURER' | 'ADMIN'</code> turns a silent business bug into a compile error.</li>
<li>Compiling is not correctness: <code>&gt;=</code> vs <code>&gt;</code> passes tsc; only a boundary test catches it. Keep your tests.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — The Basics', 'Static type-checking, non-exception failures (typos, uncalled functions) and what tsc reports. Read 1 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/basic-types.html')}
${nguon('📗', 'TypeScript Handbook — Everyday Types', 'Annotations on parameters and return values, object types, literal types and unions. Read 1 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html')}
${lienKet({ khoa: 'testing', bai: 'tst-1-1-cau-truc', title: 'Same rules in the Testing course — 1.1: Anatomy of a test', sub: 'Same: checkSlot, needsApproval and createBooking from LabFlow Lite, the same BR-04 and BR-06. Different: there you catch bugs with tests that run the code; here the compiler refuses a whole class of them before anything runs — and the >= trap shows why you still need those tests.', cta: 'OPEN TESTING LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Ba con bug JavaScript đẩy thẳng lên production</h2>
<p class="lead">Bạn đã biết viết JavaScript. Bài này cho bạn thấy, bằng output thật, ba lỗi rất bình thường trong một module thật sẽ đi đến đâu: Node hoặc in ra thứ vô nghĩa, hoặc chỉ sập khi một người dùng xui xẻo chạm tới đúng dòng đó, hoặc lặng lẽ trả về đáp án sai. Rồi cũng ba lỗi đó đi qua trình biên dịch TypeScript — và bị từ chối hết trong một phần ba giây, trước khi bất kỳ dòng nào được chạy.</p>

<h3>Học xong Chương 1 bạn làm được…</h3>
<ul>
<li><strong>Đổi một module JavaScript sang TypeScript strict</strong> — chính các luật đặt phòng LabFlow — và chứng minh bằng máy chấm (Lab 1).</li>
<li><strong>Đọc một lỗi của trình biên dịch</strong> trong nháy mắt: tệp, dòng, cột, mã, lý do — và thuộc chục mã lỗi gặp hằng ngày.</li>
<li><strong>Nói chính xác tsc chứng minh được gì và không được gì</strong> (bài 1.2): các tệp của bạn khớp nhau; dữ liệu từ bên ngoài là một việc khác.</li>
<li><strong>Để suy luận kiểu làm phần lớn việc</strong> (1.3), chỉ chú thích kiểu ở chỗ giá trị đi vào.</li>
<li><strong>Dùng <code>unknown</code> thay cho <code>any</code></strong> (1.4), và chuyển một codebase sang TypeScript từng bước.</li>
</ul>
<p>Vì sao điều này quan trọng với bạn: trong đồ án nhóm (SWP391, đồ án tốt nghiệp), backend và frontend do những người khác nhau viết. Khi ai đó đổi tên một trường hay thêm một trạng thái, TypeScript biến “demo sập trước mặt thầy” thành “build đỏ ngay trên laptop của tôi”. Phỏng vấn vị trí Node.js, câu “TypeScript thật sự mang lại gì?” gần như chắc chắn được hỏi — học xong bài này bạn trả lời được bằng số liệu.</p>

<h3>Code đem ra thử: luật của LabFlow, viết bằng JavaScript thuần</h3>
<p>Cả khoá làm trên một dự án, <strong>LabFlow</strong> — hệ thống đặt phòng máy tính của trường. Hai tệp dưới đây chép nguyên từ khoá Testing (LabFlow Lite). Giờ là chuỗi dạng <code>"08:00"</code>; <code>parseTime</code> đổi chúng ra số phút tính từ nửa đêm và ném lỗi với mọi thứ khác:</p>
${ma('javascript', CODE.timeJs)}
<p>Hai luật trong <code>js/booking.js</code> là nhân vật chính của bài. <code>needsApproval</code> là luật nghiệp vụ <strong>BR-06</strong> — sinh viên đặt trên 30 chỗ phải chờ duyệt; giảng viên và admin không bao giờ phải chờ. <code>usageRate</code> cộng xem ngày mở cửa (07:00–21:00, tức 840 phút) đã bị đặt bao nhiêu phần:</p>
${ma('javascript', APPROVAL_JS)}
${ma('javascript', USAGE_JS)}
<p>Đọc code và để ý thứ bị <em>thiếu</em>: không chỗ nào nói <code>seats</code> là số, <code>role</code> chỉ có thể là ba chuỗi nhất định, hay một lượt đặt có trường <code>minutes</code>. Hiểu biết đó chỉ nằm trong đầu người viết. Mọi con bug bên dưới đều sống trong khoảng trống ấy.</p>

<h3>Bug 1 — gõ nhầm</h3>
<p>Thiếu một chữ: <code>b.minute</code> thay cho <code>b.minutes</code>. Trong JavaScript, đọc thuộc tính không tồn tại không phải là lỗi — nó chỉ trả về <code>undefined</code>:</p>
${ma('javascript', CODE.typoJs)}
${ra(OUT['11-typo-js'])}
<p>Exit code 0. <code>undefined / 840</code> là <code>NaN</code>, và <code>NaN</code> cộng gì cũng vẫn là <code>NaN</code>. Trên bảng thống kê thật, nó hiện thành “NaN%” — ở rất xa dòng gây ra nó, có khi vài ngày sau.</p>
<p>Giờ vẫn hàm đó, chỉ thêm một chú thích kiểu cho tham số: “một danh sách chỉ đọc gồm những thứ mà thứ nào cũng có <code>minutes</code> là số”. Thân hàm giữ nguyên, kể cả lỗi gõ:</p>
${ma('typescript', CODE.typoTs)}
${ra(TSC_TYPO)}
<p>Đọc dòng lỗi từ trái sang phải: <strong>tệp</strong> <code>usage-typo.ts</code>, <strong>dòng 7, cột 39</strong> (đúng chỗ chữ <code>minute</code> bắt đầu), <strong>mã</strong> TS2551, rồi lý do bằng tiếng Anh dễ hiểu — kèm luôn cách sửa. Không có gì được chạy; tsc chỉ <em>đọc</em> code.</p>

<h3>Bug 2 — gọi sai hình dạng</h3>
<p>Hàm đúng; <em>lời gọi</em> sai. Ba phiên bản kinh điển: gõ nhầm khoá (<code>seat</code>), truyền số trong khi hàm cần chuỗi <code>"HH:MM"</code>, và quên một đối số. Trước hết, một lời gọi đứng riêng để bạn thấy một lần sập thật trông thế nào:</p>
${ma('javascript', CODE.seatJs)}
${ra(OUT['12-seat-js'])}
<p>Hàm nhận được <code>seats: undefined</code>, câu kiểm tra của chính nó ném <code>RangeError</code>, và tiến trình chết với exit code 1. Để thấy cả ba mà không chết ngay ở cái đầu tiên, ta bọc từng lời gọi và in ra chuyện gì xảy ra:</p>
${ma('javascript', CODE.shapeJs)}
${ra(OUT['13-shape-js'])}
<p>Để ý dòng thứ ba: đối số bị quên thành <code>undefined</code>, rồi <code>parseTime</code> biến nó thành chữ “undefined”. JavaScript không bao giờ nói “bạn quên một đối số”; bạn phải tự lần ngược từ một thông báo về định dạng giờ. Và điểm mấu chốt: <strong>mỗi lỗi chỉ được ném ra khi đúng dòng đó chạy</strong>. Nếu lời gọi nằm ở màn hình ít ai mở — trang admin, báo cáo cuối tháng — người chạy nó đầu tiên là người dùng.</p>
<p>Giờ cũng các lời gọi đó, nhưng gọi vào bản luật <em>đã có kiểu</em> trong <code>src/rules/booking.ts</code> (bạn sẽ tự viết tệp này ở Lab 1):</p>
${ma('typescript', CODE.callsTs)}
${ra(TSC_CALLS)}
<p>Bốn dòng vào, bốn lỗi ra, dòng nào cũng chỉ đúng ký tự: TS2561 cho khoá lạ (kèm “Did you mean to write 'seats'?”), TS2345 cho đối số sai kiểu, TS2554 cho đối số bị thiếu. Lỗi thứ tư là Bug 3.</p>

<h3>Bug 3 — sai giá trị: loại đắt nhất</h3>
${ma('javascript', CODE.roleJs)}
${ra(OUT['14-role-js'])}
<p>Không ngoại lệ, không dòng log, exit code 0. <code>'lecturer' === 'LECTURER'</code> là <code>false</code>, nên code rơi xuống luật của sinh viên, và giảng viên đặt 31 chỗ bị bắt chờ duyệt. Bug làm sập được sửa ngay trong ngày vì ai đó nhìn thấy stack trace. Bug như con này tạo ra một <em>quyết định nghiệp vụ sai</em> và có thể sống hàng tuần.</p>
<p>Bản có kiểu nói, trong một dòng, vai trò có thể là những chuỗi nào:</p>
${ma('typescript', ROLE_TS)}
${ma('typescript', APPROVAL_TS)}
<p>Đọc <code>type Role = 'STUDENT' | 'LECTURER' | 'ADMIN'</code> như một câu: “Role là chuỗi STUDENT, hoặc chuỗi LECTURER, hoặc chuỗi ADMIN — không gì khác”. Dấu <code>|</code> nghĩa là “hoặc”. Thứ này gọi là <strong>literal union (union các kiểu literal)</strong>; Chương 5 dành trọn cho chúng. Lúc này một dòng là đủ:</p>
${ra(TSC_ROLE)}
<p>TS2820 — và tsc còn đề xuất luôn cách viết hoa đúng.</p>

<h3>Dời lỗi sang trái</h3>
${BANG_VI}
<p>Trình biên dịch mất bao lâu để tìm cả năm lỗi? Đo hai lần trên máy soạn khoá, tính cả thời gian khởi động <code>npx</code>:</p>
${ra(TIME_A + '\n…\n' + TIME_B)}
<p>Chừng một phần ba giây, không chạy gì cả, không cần viết test cho từng nhánh, không cần người dùng. Dân trong nghề gọi việc này là <strong>shift left (dời sang trái)</strong>: trên trục thời gian “viết → kiểm → chạy → người dùng”, lỗi được tìm thấy ở phía trái hơn, nơi sửa rẻ nhất. Bản cũ của bài này tóm nó trong một câu mà đến giờ vẫn là câu tóm TypeScript hay nhất: nó dời lỗi từ lúc chạy (muộn, trên production, xa nguyên nhân) về lúc biên dịch (sớm, trong editor, đúng dòng).</p>

<h3>🗺 Mỗi con bug bị phát hiện ở đâu</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Bạn viết</div><div class="lz-d">lỗi gõ, lời gọi sai, chuỗi sai</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">tsc đọc</div><div class="lz-d">TypeScript: bắt cả 5 ở đây, 0,3 giây</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Node chạy</div><div class="lz-d">JavaScript: 3 lỗi sập, chỉ khi dòng đó chạy</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Người dùng thấy</div><div class="lz-d">JavaScript: “NaN%”, duyệt sai</div></div>
</div>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — chương trình biên dịch được chưa phải là chương trình đúng.</strong> Đổi một ký tự trong BR-06: <code>&gt;=</code> thay cho <code>&gt;</code>.</p>
${ma('typescript', CODE.geTs)}
${ra(OUT['16-ge-tsc'])}
<p>Im lặng, exit 0: <code>&gt;=</code> và <code>&gt;</code> đều hoàn toàn hợp lệ với số. TypeScript kiểm <em>hình dạng</em> — có phải số không, khoá có tồn tại không, chuỗi có thuộc danh sách cho phép không — chứ không kiểm luật nghiệp vụ. Luật nói “<strong>trên</strong> 30”, nên đúng 30 chỗ thì không phải chờ. Chỉ một test ở giá trị biên nhận ra:</p>
${ma('typescript', CODE.geTest)}
${ra(GE_TEST)}
<p>Kiểu thay được những test nói “đối số này là chuỗi”. Kiểu không thay được test nào nói “hàm này tính ra đúng kết quả”. Một nhóm xoá bộ test sau khi chuyển sang TypeScript là đã đổi tấm lưới này lấy tấm lưới khác, chứ không thêm được tấm nào.</p>
</div>

<h3>Năm mã lỗi bạn sẽ đọc mỗi ngày</h3>
${MA_VI}

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<p>Trong dự án, <code>demo1/ts-01-1/practice/start/usage.ts</code> có lỗi gõ <em>và</em> một tham số kiểu <code>any</code> — thứ tắt việc kiểm tra cho giá trị đó:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['18-pr-start'])}
<ol>
<li>Chạy lệnh trên: tsc im lặng, Node in <code>NaN</code>. Giải thích trong một câu vì sao tsc không giúp được.</li>
<li>Thay <code>any</code> bằng một kiểu nói rõ một lượt đặt có gì. Chạy lại tsc và đọc lỗi (chưa sửa lỗi gõ vội).</li>
<li>Sửa lỗi gõ, chạy lại tsc và Node.</li>
</ol>
<p><strong>Lời giải và output thật.</strong> Bước 1: <code>any</code> nghĩa là “đừng kiểm giá trị này”, nên <code>b.minute</code> được chấp nhận. Bước 2:</p>
${ma('typescript', CODE.prStep1)}
${ra(OUT['19-pr-step1'])}
<p>Bước 3:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['20-pr-sol'])}
<p><strong>Đạt khi:</strong> còn lỗi gõ thì tsc báo TS2551 ở dòng 7; hết lỗi gõ thì tsc không in gì và Node in <code>0.5</code> (420 trên 840 phút). Code Lab có thêm bốn bài cho bài học này (gõ kiểu <code>usageRate</code>, <code>checkSlot</code>, vai trò, và trọn <code>createBooking</code>).</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">type annotation (chú thích kiểu)</span><span class="v">Phần <code>: string</code> hay <code>: number</code> sau một cái tên: bạn nói cho tsc biết giá trị là gì.</span></div>
  <div class="kv"><span class="k">compile time (lúc biên dịch)</span><span class="v">Khi tsc đọc code. Không gì chạy; kiểu tồn tại.</span></div>
  <div class="kv"><span class="k">runtime (lúc chạy)</span><span class="v">Khi Node (hay trình duyệt) thực thi JavaScript. Kiểu đã biến mất.</span></div>
  <div class="kv"><span class="k">diagnostic (thông báo lỗi)</span><span class="v">Một dòng lỗi của tsc: tệp(dòng,cột): error TSxxxx: lý do.</span></div>
  <div class="kv"><span class="k">literal union (union literal)</span><span class="v">Kiểu liệt kê đúng các giá trị được phép, vd <code>'STUDENT' | 'LECTURER' | 'ADMIN'</code>.</span></div>
  <div class="kv"><span class="k">shift left (dời sang trái)</span><span class="v">Tìm ra lỗi sớm hơn trên trục viết → kiểm → chạy → người dùng, nơi sửa rẻ hơn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>JavaScript nhận ba loại lỗi mà không nói một lời: gõ nhầm (<code>NaN</code>), gọi sai hình dạng (chỉ sập khi dòng đó chạy), sai giá trị (đáp án sai im lặng).</li>
<li>Với vài chú thích kiểu, tsc từ chối hết trước khi chạy bất cứ thứ gì: TS2551, TS2561, TS2345, TS2554, TS2820 — năm lỗi trong khoảng 0,3 giây ở đây.</li>
<li>Đọc mỗi dòng lỗi theo thứ tự tệp, dòng, cột, mã, lý do. Phần “Did you mean…?” thường chính là cách sửa.</li>
<li>Một literal union như <code>type Role = 'STUDENT' | 'LECTURER' | 'ADMIN'</code> biến một bug nghiệp vụ im lặng thành lỗi biên dịch.</li>
<li>Biên dịch được không có nghĩa là đúng: <code>&gt;=</code> thay cho <code>&gt;</code> vẫn qua tsc; chỉ test ở giá trị biên bắt được. Hãy giữ bộ test.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — The Basics', 'Kiểm tra kiểu tĩnh, những lỗi không ném ngoại lệ (gõ nhầm, quên gọi hàm) và những gì tsc báo. Đọc ngày 1/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/basic-types.html')}
${nguon('📗', 'TypeScript Handbook — Everyday Types', 'Chú thích kiểu cho tham số và giá trị trả về, kiểu object, kiểu literal và union. Đọc ngày 1/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html')}
${lienKet({ khoa: 'testing', bai: 'tst-1-1-cau-truc', title: 'Cùng bộ luật ở khoá Testing — 1.1: Giải phẫu một test', sub: 'Giống: checkSlot, needsApproval và createBooking của LabFlow Lite, cùng luật BR-04 và BR-06. Khác: bên đó bạn bắt bug bằng test chạy code; ở đây trình biên dịch từ chối cả một lớp bug trước khi chạy — và bẫy >= cho thấy vì sao vẫn cần những test kia.', cta: 'MỞ BÀI TESTING →' })}
</div>
`,
};
