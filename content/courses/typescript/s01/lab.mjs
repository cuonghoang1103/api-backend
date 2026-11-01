/**
 * TypeScript · Chương 1 · Lab 1 — Đổi luật LabFlow sang TypeScript. BÀI MỚI 01/11/2026, slug typescript-1-6-lab-chuyen-doi (đứng TRƯỚC quiz 1.5).
 * Máy chấm = scripts/cham-lab-1.mjs trong dự án LabFlow TS (tsc 7.0.2 + node 22.23.3 thật): A 2 · B 1 · C 1 · D 2 · E 8 × 0,5; đạt 7.
 * Số đo thật: khởi đầu 2.5/10 (3/8) · lần thử "any" 5.5/10 (1/8) · lần thử string/number 8/10 (6/8) · tham khảo 10/10 (8/8).
 * Mọi code/output lấy từ ./_ma-ts-lab-1.mjs (SINH TỰ ĐỘNG, đừng sửa tay).
 */
import G from '../giang/ts-lab-1.mjs';
import { ma, ra, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-lab-1.mjs';

// Output dài: chỉ BỎ 3 dòng đầu (vị trí ném lỗi trong mã nội bộ của Node), không sửa chữ.
const CHAY_KHOI_DAU = OUT['l5-starter-run'].split('\n').filter((l) => !/^\s+throw |^\s+\^|^node:internal/.test(l)).join('\n');
// Trích kiểu suy luận của lần thử B: đoạn checkSlot + createBooking trong .d.ts (dòng 7–33 của output, bỏ phần giữa).
const DTS_B = OUT['l10-vua-dts'].split('\n').slice(0, 1).concat(OUT['l10-vua-dts'].split('\n').slice(7, 16), ['…'], OUT['l10-vua-dts'].split('\n').slice(21, 34)).join('\n');
// Lần thử A: chỉ phần đầu tệp booking.ts (khai báo hàm).
const YEU_DAU = CODE.yeuBooking.split('\n').slice(0, 2).concat(['…'], CODE.yeuBooking.split('\n').filter((l) => /^export function/.test(l))).join('\n');
// Máy chấm: phần đầu (5 phần điểm) + khối chấm phần E — bỏ phần giữa (chép tệp, A–D).
const GD = CODE.grader.split('\n');
const GRADER_GON = GD.slice(0, 7).concat(['// …'], GD.slice(GD.findIndex((l) => l.includes("const e = tsc('e.json')")), GD.findIndex((l) => l.includes('E  wrong calls refused')) + 1)).join('\n');
const VUA_DAU = CODE.vuaBooking.split('\n').slice(0, 2).concat(['…'], CODE.vuaBooking.split('\n').filter((l) => /^export function/.test(l))).join('\n');

const BANG_EN = `<table>
<thead><tr><th>#</th><th>Wrong call</th><th>tsc must say</th><th>The original JavaScript, run for real</th><th>What it means for a user</th></tr></thead>
<tbody>
<tr><td>S1</td><td><code>parseTime(420)</code></td><td>TS2345</td><td>throws <code>TypeError: Invalid time "420"</code></td><td>the booking page crashes</td></tr>
<tr><td>S2</td><td><code>formatTime('07:30')</code></td><td>TS2345</td><td>returns <code>"NaN:NaN"</code></td><td>the schedule shows NaN:NaN</td></tr>
<tr><td>S3</td><td><code>checkSlot('08:00')</code></td><td>TS2554</td><td>throws <code>TypeError: Invalid time "undefined"</code></td><td>crash, and the message blames the user</td></tr>
<tr><td>S4</td><td><code>needsApproval({ seat: 31, … })</code></td><td>TS2561</td><td>throws <code>RangeError: … got undefined</code></td><td>“seats must be a positive integer” although 31 was typed</td></tr>
<tr><td>S5</td><td><code>role: 'lecturer'</code></td><td>TS2820</td><td>returns <code>true</code>, no error</td><td>a lecturer silently waits for an admin</td></tr>
<tr><td>S6</td><td><code>createBooking(input).minute</code></td><td>TS2551</td><td>returns <code>undefined</code>, no error</td><td>“undefined minutes” on the receipt</td></tr>
<tr><td>S7</td><td><code>status === 'APPROVED'</code></td><td>TS2367</td><td>branch skipped, no error</td><td>the “approved” e-mail is never sent</td></tr>
<tr><td>S8</td><td><code>usageRate([{ minute: 60 }])</code></td><td>TS2561</td><td>returns <code>NaN</code>, no error</td><td>the usage dashboard shows NaN</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>#</th><th>Lời gọi sai</th><th>tsc phải báo</th><th>Bản JavaScript gốc, chạy thật</th><th>Với người dùng nghĩa là gì</th></tr></thead>
<tbody>
<tr><td>S1</td><td><code>parseTime(420)</code></td><td>TS2345</td><td>ném <code>TypeError: Invalid time "420"</code></td><td>trang đặt phòng sập</td></tr>
<tr><td>S2</td><td><code>formatTime('07:30')</code></td><td>TS2345</td><td>trả <code>"NaN:NaN"</code></td><td>lịch hiện NaN:NaN</td></tr>
<tr><td>S3</td><td><code>checkSlot('08:00')</code></td><td>TS2554</td><td>ném <code>TypeError: Invalid time "undefined"</code></td><td>sập, và thông báo lại đổ lỗi cho người dùng</td></tr>
<tr><td>S4</td><td><code>needsApproval({ seat: 31, … })</code></td><td>TS2561</td><td>ném <code>RangeError: … got undefined</code></td><td>"số chỗ phải là số nguyên dương" dù đã nhập 31</td></tr>
<tr><td>S5</td><td><code>role: 'lecturer'</code></td><td>TS2820</td><td>trả <code>true</code>, không lỗi</td><td>giảng viên âm thầm phải chờ admin duyệt</td></tr>
<tr><td>S6</td><td><code>createBooking(input).minute</code></td><td>TS2551</td><td>trả <code>undefined</code>, không lỗi</td><td>phiếu đặt ghi "undefined phút"</td></tr>
<tr><td>S7</td><td><code>status === 'APPROVED'</code></td><td>TS2367</td><td>nhánh bị bỏ qua, không lỗi</td><td>thư "đã duyệt" không bao giờ được gửi</td></tr>
<tr><td>S8</td><td><code>usageRate([{ minute: 60 }])</code></td><td>TS2561</td><td>trả <code>NaN</code>, không lỗi</td><td>bảng thống kê hiện NaN</td></tr>
</tbody>
</table>`;

const RUBRIC_EN = `<table>
<thead><tr><th>Part</th><th>Points</th><th>How the grader checks it</th><th>The habit it trains</th></tr></thead>
<tbody>
<tr><td>A — your <code>src/</code> compiles</td><td>2</td><td><code>tsc -p</code> with the course tsconfig (strict) on your two files</td><td>every value that comes in has a type</td></tr>
<tr><td>B — correct calls still compile</td><td>1</td><td>tsc on <code>kiem/phai-dung.ts</code></td><td>types that are precise, not just strict</td></tr>
<tr><td>C — honesty</td><td>1</td><td>no <code>any</code>, <code>@ts-ignore</code>, <code>@ts-nocheck</code>, <code>@ts-expect-error</code> in your files</td><td>fix the cause, don’t mute the alarm</td></tr>
<tr><td>D — behaviour unchanged</td><td>2</td><td><code>node --test</code> runs the 15 tests in <code>test/rules.test.ts</code></td><td>types change nothing at runtime</td></tr>
<tr><td>E — wrong calls refused</td><td>4 (8 × 0.5)</td><td>each marked line of <code>kiem/sai.ts</code> has an error with the expected code</td><td>types that catch the bugs people really write</td></tr>
</tbody>
</table>`;
const RUBRIC_VI = `<table>
<thead><tr><th>Phần</th><th>Điểm</th><th>Máy chấm kiểm thế nào</th><th>Thói quen nó rèn</th></tr></thead>
<tbody>
<tr><td>A — <code>src/</code> của bạn biên dịch được</td><td>2</td><td><code>tsc -p</code> với tsconfig của khoá (strict) trên hai tệp của bạn</td><td>mọi giá trị đi vào đều có kiểu</td></tr>
<tr><td>B — lời gọi đúng vẫn biên dịch được</td><td>1</td><td>tsc trên <code>kiem/phai-dung.ts</code></td><td>kiểu phải chính xác, không chỉ chặt</td></tr>
<tr><td>C — trung thực</td><td>1</td><td>không <code>any</code>, <code>@ts-ignore</code>, <code>@ts-nocheck</code>, <code>@ts-expect-error</code> trong tệp của bạn</td><td>sửa nguyên nhân, đừng tắt chuông báo</td></tr>
<tr><td>D — hành vi không đổi</td><td>2</td><td><code>node --test</code> chạy 15 test trong <code>test/rules.test.ts</code></td><td>kiểu không thay đổi gì lúc chạy</td></tr>
<tr><td>E — lời gọi sai bị từ chối</td><td>4 (8 × 0,5)</td><td>mỗi dòng đánh dấu trong <code>kiem/sai.ts</code> có lỗi đúng mã mong đợi</td><td>kiểu bắt được những bug người ta viết thật</td></tr>
</tbody>
</table>`;

export default {
  title: 'Lab 1 — Convert LabFlow\'s rules to TypeScript|||Lab 1 — Đổi luật LabFlow sang TypeScript',
  slug: 'typescript-1-6-lab-chuyen-doi',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab Chương 1 có thang chấm 10 điểm và máy chấm chạy tsc + Node thật: đổi time.ts/booking.ts của LabFlow từ JavaScript sang TypeScript strict, không any, 15 test vẫn xanh, và 8 lời gọi sai phải bị tsc từ chối đúng mã lỗi. Có output thật của mã khởi đầu (2.5/10), lần thử "any" (5.5/10 — tệ hơn không làm gì), lần thử string/number (8/10) và lời giải tham khảo (10/10).',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lab 1</span>
<h2>Convert LabFlow’s rules to TypeScript</h2>
<p class="lead">60–90 minutes. You take the real JavaScript rules of LabFlow — <code>time.js</code> and <code>booking.js</code>, the same files the Testing course tests — and turn them into strict TypeScript. When you finish you can convert any small JavaScript module to TypeScript the way teams do it at work: without <code>any</code>, without changing behaviour, and with types that provably reject the mistakes a teammate will make next week. A script grades you out of 10 by running the compiler and Node, exactly like a CI server.</p>


<h3>Setup</h3>
<ol>
<li>Copy the course project <code>labflow-ts</code> (lessons 0.3–1.4) and install exactly the pinned versions — <code>npm ci</code> uses the lock file:
${ra(OUT['l1-npm-ci'])}</li>
<li>The project already contains the <strong>reference solution</strong> in <code>src/rules/</code> (lesson 1.4 ended with it). Do not open it before you have tried — you work only in <code>lab1/src/</code>. You can check that the reference is healthy:
${ra(OUT['l2-ref-check'])}</li>
<li>The lab folder has its own tsconfig that extends the course one, so the rules are the same strict rules you met in lesson 0.3 (<code>tsconfig.json</code> of the project):
${ma('json', CODE.labTsconfig)}</li>
<li>Your starting point: the two JavaScript files, <strong>only renamed</strong> to <code>.ts</code>. Not one character changed:
${ma('typescript', CODE.starterTime)}
${ma('typescript', CODE.starterBooking)}</li>
</ol>

<h3>The grader</h3>
<p><code>npm run lab1</code> runs <code>scripts/cham-lab-1.mjs</code> (“chấm” = grade). It copies your two files into a fresh folder next to its own test files — so editing the tests cannot raise your score — and scores five parts. Its header and the part-E loop:</p>
${ma('javascript', GRADER_GON)}
<p>Two details are worth reading in the code. Part E does not use <code>@ts-expect-error</code>; it compiles <code>kiem/sai.ts</code> once and checks, line by line, that the error on that line has the <em>expected code</em> — an error for the wrong reason does not count. And part B exists so that you cannot win by making types absurdly strict — these correct calls must keep compiling:</p>
${ma('typescript', CODE.dung)}
<p>Run it on the untouched starter:</p>
${ra(OUT['l3-starter'])}
<p>2.5 out of 10. Read it part by part:</p>
<ul>
<li><strong>A</strong> — the grader shows the first four errors; <code>tsc -p lab1</code> shows all of them. Thirteen in <code>src/</code> are TS7006/TS7031: “this parameter (or destructured property) implicitly has an <code>any</code> type”. Strict mode refuses to guess what comes in. The two in <code>kiem/phai-dung.ts</code> are part B.
${ra(OUT['l4-starter-tsc'])}</li>
<li><strong>D</strong> — zero of 15 tests ran. Node cannot even load the file:
${ra(CHAY_KHOI_DAU)}
<code>booking.ts</code> still says <code>import … from './time.js'</code>. tsc accepts that (with <code>module: nodenext</code> it maps <code>.js</code> to the <code>.ts</code> file), but Node 22 runs <code>.ts</code> files directly and there is no <code>time.js</code> on disk.</li>
<li><strong>E</strong> — already <strong>3 of 8</strong> wrong calls refused, for free. Even untyped, tsc knows how many parameters <code>checkSlot</code> declares (S3), which property names <code>needsApproval</code> destructures (S4) and what object <code>createBooking</code> returns (S6). Keep this number in mind.</li>
</ul>

<h3>Your task</h3>
<p>Edit <strong>only</strong> <code>lab1/src/time.ts</code> and <code>lab1/src/booking.ts</code> until <code>npm run lab1</code> prints <strong>Score: 10/10</strong>:</p>
<ol>
<li>both files compile under the course’s strict tsconfig;</li>
<li>no <code>any</code> and no <code>@ts-</code> directive anywhere in them;</li>
<li>the 15 behaviour tests still pass — you add types, you do not change logic;</li>
<li>every one of the 8 wrong calls below is refused with the right error code.</li>
</ol>
<p>Work <strong>rule-first</strong>: write down what each function accepts and returns in words (“a role is one of STUDENT, LECTURER, ADMIN”; “checkSlot says either ok with a number of minutes, or not ok with one of four codes”), then turn the sentences into types. Writing one type per line of <code>sai.ts</code> is teaching to the test: you get 8/8 and miss the ninth bug.</p>

<h3>The eight wrong calls</h3>
<p>The grader owns this file. Each line ends with the error code tsc must produce on it:</p>
${ma('typescript', CODE.sai)}
<p>What would happen without types? The same eight calls, run against the original JavaScript in <code>js/</code>:</p>
${ma('javascript', CODE.saiJs)}
${ra(OUT['l9-sai-js'])}
${BANG_EN}
<p>Two calls crash. <strong>Six give a wrong answer with no error at all.</strong> A crash at least appears in a log; NaN on a dashboard and a lecturer quietly waiting for approval can live in production for weeks. The silent ones are exactly what a type checker is for.</p>

<h3>What first attempts usually look like</h3>
<p><strong>Attempt A — silence every error with <code>any</code></strong> (the project keeps it in <code>lab1/yeu/</code>, “yếu” = weak):</p>
${ma('typescript', YEU_DAU)}
${ra(OUT['l6-yeu'])}
<div class="pitfall co-tieu-de">
<p><strong>Trap — <code>any</code> scored worse than doing nothing.</strong> It compiles, the tests pass, and only <strong>1 of 8</strong> wrong calls is refused — the untouched starter refused 3. Writing <code>({ seats, role }: any)</code> did not just skip a check; it <em>removed</em> the destructuring check that renaming had given for free (S4), and <code>: any</code> as a return type removed the check on the returned object (S6, S7). Only S3 survives, because the number of parameters is still visible. <code>any</code> does not mean “type unknown”; it means “stop checking this, and everything that touches it”.</p>
</div>
<p><strong>Attempt B — type everything with <code>string</code> and <code>number</code></strong>, return types left to inference (<code>lab1/vua/</code>, “vừa” = so-so):</p>
${ma('typescript', VUA_DAU)}
${ra(OUT['l7-vua'])}
<p>8/10 — a pass, and a real improvement: S1, S2, S4 and S8 are now refused. Two wrong calls still slip through, and correct code breaks. Ask tsc what it inferred: emit only the declaration files (<code>.d.ts</code>) of attempt B and read them.</p>
${ma('json', CODE.demoTsconfig)}
${ra(DTS_B)}
<ul>
<li><strong>S5 slips</strong> because <code>role: string</code> accepts every string, <code>'lecturer'</code> included. The rule says <em>three</em> values; the type says <em>infinitely many</em>.</li>
<li><strong>S7 slips</strong> because the inferred <code>status: string</code> can be compared with <code>'APPROVED'</code> — two strings may well be equal.</li>
<li><strong>B fails</strong> because tsc inferred <code>ok: boolean</code> (not <code>true</code> / <code>false</code>) for both shapes of the result. After <code>if (!slot.ok) throw …</code> it still cannot tell which shape it has, so <code>slot.minutes</code> is <code>number | undefined</code> — and a correct caller that stores it in a <code>number</code> is rejected. Lesson 1.3 explains why inference widens <code>true</code> to <code>boolean</code> here; Chapter 5 calls the fix a <em>discriminated union</em>.</li>
</ul>

<h3>Rubric (10 points, pass mark 7)</h3>
${RUBRIC_EN}

<h3>Hints — open one at a time</h3>
<ol>
<li>Fix the import first: <code>import { parseTime } from './time.ts';</code>. The course tsconfig allows <code>.ts</code> extensions (<code>allowImportingTsExtensions</code>) precisely because Node runs these files directly.</li>
<li>Annotate every parameter. For a destructured parameter, the type goes after the whole pattern: <code>({ seats, role }: { seats: number; role: Role })</code>.</li>
<li>Which values form a <strong>closed list</strong>? Roles, the four slot codes, the two statuses. A literal union lists them: <code>type Role = 'STUDENT' | 'LECTURER' | 'ADMIN';</code> (you saw this in lesson 1.1).</li>
<li>Write the result of <code>checkSlot</code> as a sentence — “either <code>ok: true</code> with minutes, or <code>ok: false</code> with a code” — then as a type, and put it as the return type. Do the same for <code>createBooking</code>.</li>
<li><code>usageRate</code> only reads <code>minutes</code> and never changes the list: <code>bookings: readonly { minutes: number }[]</code> accepts full bookings and plain <code>{ minutes }</code> objects alike.</li>
</ol>

<h3>Reference solution (read after trying)</h3>
${ma('typescript', CODE.refTime)}
${ma('typescript', CODE.refBooking)}
${ra(OUT['l8-ref'])}
<p>Ten out of ten. Compare with attempt B: the function bodies are <strong>byte-for-byte the same</strong>, apart from the import. Everything that changed is in the types — three ideas:</p>
<ul>
<li><strong>Literal unions for closed sets</strong> — <code>Role</code>, <code>SlotCode</code> and the status <code>'PENDING' | 'CONFIRMED'</code> catch S5 and S7.</li>
<li><strong>Explicit return types</strong> — <code>SlotResult</code> says <code>ok: true</code> goes with <code>minutes</code> and <code>ok: false</code> with <code>code</code>, so after <code>if (!slot.ok) throw</code> tsc knows <code>slot.minutes</code> is a <code>number</code>. Part B passes.</li>
<li><strong>The smallest honest parameter type</strong> — <code>readonly { minutes: number }[]</code> for <code>usageRate</code>.</li>
</ul>
<p>Node never sees any of this: it strips the types and runs the same JavaScript as before, which is why part D stayed at 15/15 in every attempt that loaded.</p>

<h3>Before you call it done</h3>
<ul>
<li><code>npm run lab1</code> prints <strong>Score: 10/10</strong> (7 passes; 10 is the goal).</li>
<li><code>grep -n any lab1/src/*.ts</code> prints nothing.</li>
<li>You edited only <code>lab1/src/</code> — <code>lab1/test</code>, <code>lab1/kiem</code> and the grader are unchanged.</li>
<li>For each of S1–S8 you can name the type that refuses it.</li>
<li>Commit: <code>feat(rules): LabFlow rules in strict TypeScript (lab 1: 10/10)</code>.</li>
</ul>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">implicit any (TS7006 / TS7031)</span><span class="v">A parameter or destructured property with no type; strict mode refuses to guess.</span></div>
  <div class="kv"><span class="k">literal union</span><span class="v">A type listing the exact allowed values: <code>'STUDENT' | 'LECTURER' | 'ADMIN'</code>.</span></div>
  <div class="kv"><span class="k">return type annotation</span><span class="v">Writing what a function returns, instead of letting tsc infer (and widen) it.</span></div>
  <div class="kv"><span class="k">declaration file (.d.ts)</span><span class="v">Types only, no code — emitted to see what tsc inferred.</span></div>
  <div class="kv"><span class="k">type-level mutant</span><span class="v">A wrong call that a good type must reject; the lab’s eight S-lines.</span></div>
  <div class="kv"><span class="k">rubric</span><span class="v">A scoring table that says exactly what earns each point.</span></div>
</div>

<h3>🗺 How the grader scores you</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Copy</div><div class="lz-d">your two files into a fresh folder beside the grader’s tests</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Compile</div><div class="lz-d">tsc on your files, then on the correct calls (A, B)</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Scan</div><div class="lz-d">no any, no @ts- directives (C)</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Run</div><div class="lz-d">node --test, 15 behaviour tests (D)</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Attack</div><div class="lz-d">8 wrong calls, each must get the expected code (E)</div></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Renaming <code>.js</code> to <code>.ts</code> already refused 3 of 8 wrong calls; silencing everything with <code>any</code> dropped that to 1.</li>
<li>Primitive types (<code>string</code>, <code>number</code>) refused 6 of 8 but let “lecturer” and “APPROVED” through, and inference widened <code>ok</code> to <code>boolean</code>.</li>
<li>Literal unions for closed sets plus explicit return types reached 10/10 without changing a single line of logic.</li>
<li>Six of the eight wrong calls are <em>silent</em> in JavaScript — wrong results, no error. That is what types are for.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Everyday Types', 'Literal types and union types, the two tools that took the reference from 8 to 10. Read 1 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html')}
${nguon('⚙️', 'TSConfig reference — noImplicitAny', 'Why strict mode reports TS7006 for every untyped parameter. Read 1 Nov 2026.', 'https://www.typescriptlang.org/tsconfig/#noImplicitAny')}
${nguon('🟩', 'Node.js 22 docs — Modules: TypeScript', 'Type stripping: why Node needs the .ts extension in imports. Read 1 Nov 2026.', 'https://nodejs.org/api/typescript.html')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Lab 1</span>
<h2>Đổi luật LabFlow sang TypeScript</h2>
<p class="lead">60–90 phút. Bạn lấy đúng các luật JavaScript thật của LabFlow — <code>time.js</code> và <code>booking.js</code>, chính hai tệp khoá Testing đem ra test — và biến chúng thành TypeScript strict. Làm xong, bạn đổi được bất kỳ module JavaScript nhỏ nào sang TypeScript theo cách các nhóm làm khi đi làm: không <code>any</code>, không đổi hành vi, và có kiểu chứng minh được là từ chối những lỗi mà bạn cùng nhóm sẽ viết tuần sau. Một script chấm bạn trên thang 10 bằng cách chạy trình biên dịch và Node, đúng như một máy CI.</p>


<h3>Chuẩn bị</h3>
<ol>
<li>Chép dự án của khoá <code>labflow-ts</code> (bài 0.3–1.4) và cài đúng các bản đã ghim — <code>npm ci</code> dùng tệp lock:
${ra(OUT['l1-npm-ci'])}</li>
<li>Dự án đã có sẵn <strong>lời giải tham khảo</strong> trong <code>src/rules/</code> (bài 1.4 kết thúc ở đó). Đừng mở nó trước khi tự làm — bạn chỉ làm trong <code>lab1/src/</code>. Có thể kiểm bản tham khảo đang khoẻ:
${ra(OUT['l2-ref-check'])}</li>
<li>Thư mục lab có tsconfig riêng kế thừa tsconfig của khoá, nên luật vẫn là luật strict bạn gặp ở bài 0.3 (<code>tsconfig.json</code> của dự án):
${ma('json', CODE.labTsconfig)}</li>
<li>Điểm xuất phát: hai tệp JavaScript, <strong>chỉ đổi đuôi</strong> sang <code>.ts</code>. Không một ký tự nào thay đổi:
${ma('typescript', CODE.starterTime)}
${ma('typescript', CODE.starterBooking)}</li>
</ol>

<h3>Máy chấm</h3>
<p><code>npm run lab1</code> chạy <code>scripts/cham-lab-1.mjs</code>. Nó chép hai tệp của bạn vào một thư mục mới cạnh các tệp test của chính nó — nên sửa test không nâng được điểm — rồi chấm năm phần. Phần đầu tệp và vòng chấm phần E:</p>
${ma('javascript', GRADER_GON)}
<p>Có hai chi tiết đáng đọc trong code. Phần E không dùng <code>@ts-expect-error</code>; nó biên dịch <code>kiem/sai.ts</code> một lần rồi kiểm từng dòng xem lỗi trên dòng đó có đúng <em>mã mong đợi</em> không — lỗi vì lý do khác không được tính. Còn phần B tồn tại để bạn không thắng được bằng cách siết kiểu vô lý — các lời gọi đúng này phải vẫn biên dịch được:</p>
${ma('typescript', CODE.dung)}
<p>Chạy trên mã khởi đầu chưa sửa gì:</p>
${ra(OUT['l3-starter'])}
<p>2,5 trên 10. Đọc từng phần:</p>
<ul>
<li><strong>A</strong> — máy chấm chỉ in bốn lỗi đầu; <code>tsc -p lab1</code> in đủ. Mười ba lỗi trong <code>src/</code> đều là TS7006/TS7031: "tham số (hoặc thuộc tính được tách ra) này ngầm có kiểu <code>any</code>". Chế độ strict không chịu đoán thứ gì đi vào. Hai lỗi trong <code>kiem/phai-dung.ts</code> thuộc phần B.
${ra(OUT['l4-starter-tsc'])}</li>
<li><strong>D</strong> — không test nào trong 15 test chạy được. Node còn không nạp nổi tệp:
${ra(CHAY_KHOI_DAU)}
<code>booking.ts</code> vẫn ghi <code>import … from './time.js'</code>. tsc chấp nhận (với <code>module: nodenext</code> nó ánh xạ <code>.js</code> sang tệp <code>.ts</code>), nhưng Node 22 chạy thẳng tệp <code>.ts</code> và trên đĩa không có <code>time.js</code> nào.</li>
<li><strong>E</strong> — đã có <strong>3 trên 8</strong> lời gọi sai bị từ chối, miễn phí. Dù chưa có kiểu, tsc vẫn biết <code>checkSlot</code> khai mấy tham số (S3), <code>needsApproval</code> tách những tên thuộc tính nào (S4) và <code>createBooking</code> trả về object gì (S6). Nhớ con số này.</li>
</ul>

<h3>Nhiệm vụ</h3>
<p><strong>Chỉ</strong> sửa <code>lab1/src/time.ts</code> và <code>lab1/src/booking.ts</code> cho tới khi <code>npm run lab1</code> in <strong>Score: 10/10</strong>:</p>
<ol>
<li>cả hai tệp biên dịch được với tsconfig strict của khoá;</li>
<li>không <code>any</code> và không chỉ thị <code>@ts-</code> nào trong chúng;</li>
<li>15 test hành vi vẫn qua — bạn thêm kiểu, không đổi logic;</li>
<li>cả 8 lời gọi sai bên dưới đều bị từ chối đúng mã lỗi.</li>
</ol>
<p>Làm theo <strong>luật trước</strong>: viết ra bằng lời mỗi hàm nhận gì, trả gì ("vai trò là một trong STUDENT, LECTURER, ADMIN"; "checkSlot trả về hoặc là được kèm số phút, hoặc là không được kèm một trong bốn mã"), rồi biến các câu đó thành kiểu. Viết mỗi dòng của <code>sai.ts</code> một kiểu là "học để thi": bạn được 8/8 rồi lọt con bug thứ chín.</p>

<h3>Tám lời gọi sai</h3>
<p>Tệp này thuộc về máy chấm. Mỗi dòng kết thúc bằng mã lỗi mà tsc phải báo trên dòng đó:</p>
${ma('typescript', CODE.sai)}
<p>Không có kiểu thì chuyện gì xảy ra? Đúng tám lời gọi đó, chạy trên bản JavaScript gốc trong <code>js/</code>:</p>
${ma('javascript', CODE.saiJs)}
${ra(OUT['l9-sai-js'])}
${BANG_VI}
<p>Hai lời gọi làm sập. <strong>Sáu lời gọi trả kết quả sai mà không báo lỗi gì.</strong> Sập thì ít ra còn hiện trong log; còn NaN trên bảng thống kê hay một giảng viên âm thầm chờ duyệt thì có thể sống trên production hàng tuần. Những lỗi im lặng chính là thứ trình kiểm tra kiểu sinh ra để bắt.</p>

<h3>Lần thử đầu thường trông thế nào</h3>
<p><strong>Lần thử A — tắt mọi lỗi bằng <code>any</code></strong> (dự án giữ ở <code>lab1/yeu/</code>):</p>
${ma('typescript', YEU_DAU)}
${ra(OUT['l6-yeu'])}
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — <code>any</code> được điểm tệ hơn không làm gì.</strong> Biên dịch được, test qua, và chỉ <strong>1 trên 8</strong> lời gọi sai bị từ chối — mã khởi đầu chưa sửa còn từ chối được 3. Viết <code>({ seats, role }: any)</code> không chỉ bỏ qua một phép kiểm; nó <em>gỡ luôn</em> phép kiểm tên thuộc tính mà việc đổi đuôi đã cho không (S4), và <code>: any</code> ở kiểu trả về gỡ luôn phép kiểm object trả về (S6, S7). Chỉ S3 còn sống, vì số tham số vẫn nhìn thấy được. <code>any</code> không có nghĩa là "chưa biết kiểu"; nó có nghĩa là "thôi đừng kiểm thứ này, và mọi thứ chạm vào nó".</p>
</div>
<p><strong>Lần thử B — gõ mọi thứ bằng <code>string</code> và <code>number</code></strong>, kiểu trả về để suy luận (<code>lab1/vua/</code>):</p>
${ma('typescript', VUA_DAU)}
${ra(OUT['l7-vua'])}
<p>8/10 — đạt, và tiến bộ thật: S1, S2, S4 và S8 giờ đã bị từ chối. Vẫn còn hai lời gọi sai lọt qua, và code đúng lại bị hỏng. Hỏi tsc xem nó đã suy luận ra gì: chỉ xuất tệp khai báo (<code>.d.ts</code>) của lần thử B rồi đọc.</p>
${ma('json', CODE.demoTsconfig)}
${ra(DTS_B)}
<ul>
<li><strong>S5 lọt</strong> vì <code>role: string</code> nhận mọi chuỗi, kể cả <code>'lecturer'</code>. Luật nói <em>ba</em> giá trị; kiểu nói <em>vô số</em>.</li>
<li><strong>S7 lọt</strong> vì <code>status: string</code> do suy luận so được với <code>'APPROVED'</code> — hai chuỗi hoàn toàn có thể bằng nhau.</li>
<li><strong>B trượt</strong> vì tsc suy ra <code>ok: boolean</code> (không phải <code>true</code> / <code>false</code>) cho cả hai dáng kết quả. Sau <code>if (!slot.ok) throw …</code> nó vẫn không biết đang cầm dáng nào, nên <code>slot.minutes</code> là <code>number | undefined</code> — và một lời gọi đúng cất nó vào biến <code>number</code> bị từ chối. Bài 1.3 giải thích vì sao suy luận nới <code>true</code> thành <code>boolean</code> ở đây; Chương 5 gọi cách sửa là <em>discriminated union (union có nhãn)</em>.</li>
</ul>

<h3>Thang chấm (10 điểm, đạt từ 7)</h3>
${RUBRIC_VI}

<h3>Gợi ý — mở từng cái một</h3>
<ol>
<li>Sửa import trước: <code>import { parseTime } from './time.ts';</code>. tsconfig của khoá cho phép đuôi <code>.ts</code> (<code>allowImportingTsExtensions</code>) chính vì Node chạy thẳng các tệp này.</li>
<li>Gõ kiểu cho mọi tham số. Với tham số tách thuộc tính, kiểu đứng sau cả mẫu: <code>({ seats, role }: { seats: number; role: Role })</code>.</li>
<li>Giá trị nào là một <strong>danh sách đóng</strong>? Vai trò, bốn mã khung giờ, hai trạng thái. Union literal liệt kê chúng: <code>type Role = 'STUDENT' | 'LECTURER' | 'ADMIN';</code> (bạn đã thấy ở bài 1.1).</li>
<li>Viết kết quả của <code>checkSlot</code> thành một câu — "hoặc <code>ok: true</code> kèm số phút, hoặc <code>ok: false</code> kèm mã" — rồi thành kiểu, và đặt làm kiểu trả về. Làm tương tự cho <code>createBooking</code>.</li>
<li><code>usageRate</code> chỉ đọc <code>minutes</code> và không bao giờ sửa danh sách: <code>bookings: readonly { minutes: number }[]</code> nhận cả lượt đặt đầy đủ lẫn object <code>{ minutes }</code> trơn.</li>
</ol>

<h3>Lời giải tham khảo (đọc sau khi đã thử)</h3>
${ma('typescript', CODE.refTime)}
${ma('typescript', CODE.refBooking)}
${ra(OUT['l8-ref'])}
<p>Mười trên mười. So với lần thử B: thân các hàm <strong>giống hệt từng byte</strong>, trừ dòng import. Mọi thay đổi nằm ở kiểu — ba ý:</p>
<ul>
<li><strong>Union literal cho tập đóng</strong> — <code>Role</code>, <code>SlotCode</code> và trạng thái <code>'PENDING' | 'CONFIRMED'</code> bắt S5 và S7.</li>
<li><strong>Kiểu trả về viết rõ</strong> — <code>SlotResult</code> nói <code>ok: true</code> đi với <code>minutes</code>, <code>ok: false</code> đi với <code>code</code>, nên sau <code>if (!slot.ok) throw</code> tsc biết <code>slot.minutes</code> là <code>number</code>. Phần B qua.</li>
<li><strong>Kiểu tham số nhỏ nhất mà trung thực</strong> — <code>readonly { minutes: number }[]</code> cho <code>usageRate</code>.</li>
</ul>
<p>Node không hề thấy những thứ này: nó bóc kiểu ra rồi chạy đúng đoạn JavaScript như trước, vì thế phần D luôn giữ 15/15 ở mọi lần thử nạp được tệp.</p>

<h3>Trước khi coi là xong</h3>
<ul>
<li><code>npm run lab1</code> in <strong>Score: 10/10</strong> (7 là đạt; 10 là đích).</li>
<li><code>grep -n any lab1/src/*.ts</code> không in gì.</li>
<li>Bạn chỉ sửa <code>lab1/src/</code> — <code>lab1/test</code>, <code>lab1/kiem</code> và máy chấm không đổi.</li>
<li>Với mỗi lời gọi S1–S8, bạn gọi được tên kiểu đã từ chối nó.</li>
<li>Commit: <code>feat(rules): LabFlow rules in strict TypeScript (lab 1: 10/10)</code>.</li>
</ul>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">implicit any — any ngầm (TS7006 / TS7031)</span><span class="v">Tham số hoặc thuộc tính tách ra không có kiểu; chế độ strict không chịu đoán.</span></div>
  <div class="kv"><span class="k">literal union (union literal)</span><span class="v">Kiểu liệt kê đúng các giá trị được phép: <code>'STUDENT' | 'LECTURER' | 'ADMIN'</code>.</span></div>
  <div class="kv"><span class="k">return type annotation (chú thích kiểu trả về)</span><span class="v">Tự viết hàm trả về gì, thay vì để tsc suy luận (và nới rộng) nó.</span></div>
  <div class="kv"><span class="k">declaration file — .d.ts (tệp khai báo)</span><span class="v">Chỉ có kiểu, không có code — xuất ra để xem tsc đã suy luận gì.</span></div>
  <div class="kv"><span class="k">type-level mutant (đột biến tầng kiểu)</span><span class="v">Một lời gọi sai mà kiểu tốt phải từ chối; tám dòng S của lab.</span></div>
  <div class="kv"><span class="k">rubric (thang chấm)</span><span class="v">Bảng điểm nói chính xác làm gì thì được điểm nào.</span></div>
</div>

<h3>🗺 Máy chấm cho điểm bạn thế nào</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Chép</div><div class="lz-d">hai tệp của bạn vào thư mục mới cạnh test của máy chấm</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Biên dịch</div><div class="lz-d">tsc trên tệp của bạn, rồi trên các lời gọi đúng (A, B)</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Quét</div><div class="lz-d">không any, không chỉ thị @ts- (C)</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Chạy</div><div class="lz-d">node --test, 15 test hành vi (D)</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Tấn công</div><div class="lz-d">8 lời gọi sai, mỗi cái phải nhận đúng mã lỗi (E)</div></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đổi đuôi <code>.js</code> sang <code>.ts</code> đã từ chối được 3 trên 8 lời gọi sai; tắt hết bằng <code>any</code> kéo con số đó xuống 1.</li>
<li>Kiểu nguyên thuỷ (<code>string</code>, <code>number</code>) từ chối 6 trên 8 nhưng để lọt "lecturer" và "APPROVED", còn suy luận nới <code>ok</code> thành <code>boolean</code>.</li>
<li>Union literal cho tập đóng cộng kiểu trả về viết rõ đạt 10/10 mà không đổi một dòng logic nào.</li>
<li>Sáu trong tám lời gọi sai là lỗi <em>im lặng</em> trong JavaScript — kết quả sai, không báo lỗi. Kiểu sinh ra để bắt chúng.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Everyday Types', 'Literal type và union type, hai công cụ đưa bản tham khảo từ 8 lên 10. Đọc ngày 01/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html')}
${nguon('⚙️', 'TSConfig reference — noImplicitAny', 'Vì sao chế độ strict báo TS7006 cho mọi tham số không có kiểu. Đọc ngày 01/11/2026.', 'https://www.typescriptlang.org/tsconfig/#noImplicitAny')}
${nguon('🟩', 'Tài liệu Node.js 22 — Modules: TypeScript', 'Type stripping: vì sao Node cần đuôi .ts trong import. Đọc ngày 01/11/2026.', 'https://nodejs.org/api/typescript.html')}
</div>
`,
};
