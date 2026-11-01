/**
 * TypeScript · Mục 0 · 0.1 — Về khoá học, dự án LabFlow TS & lộ trình. Slug giữ nguyên: typescript-0-1-gioi-thieu (soạn lại 01/11/2026, đợt mẫu).
 * Mọi code/output lấy từ ./_ma-ts-00-1.mjs — sinh từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2, demo0/ts-00-1).
 */
import G from '../giang/ts-00-1.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-00-1.mjs';

// Chỉ BỎ DÒNG (không sửa chữ): stack trace "at …", dòng "npm notice", dòng trống thừa.
const boStack = (s) => s.split('\n').filter((l) => !/^\s+at /.test(l)).join('\n');
const boNotice = (s) => s.split('\n').filter((l) => !/^npm notice/.test(l)).join('\n');
const D = CODE.doiTen.split('\n');
const DOI_TEN = [D[13], '', D[36]].join('\n');
const TEST_TAIL = OUT['13-test'].split('\n').filter((l) => /^\$|^ℹ (tests|pass|fail)/.test(l)).join('\n');

const ROAD_EN = `<table>
<thead><tr><th>Stage</th><th>Chapter</th><th>What LabFlow TS gains</th></tr></thead>
<tbody>
<tr><td rowspan="4">1 · Foundations</td><td>1 — Why TypeScript exists</td><td><code>js/</code> → <code>src/rules/*.ts</code></td></tr>
<tr><td>2 — The basic type system</td><td>constants, <code>null</code> in schedule data</td></tr>
<tr><td>3 — Functions</td><td>a chain of validators</td></tr>
<tr><td>4 — Objects, interfaces &amp; type aliases</td><td>domain model Lab / User / Booking</td></tr>
<tr><td rowspan="4">2 · The real type system</td><td>5 — Unions, literals &amp; narrowing</td><td><code>SlotResult</code>, booking states</td></tr>
<tr><td>6 — Generics</td><td><code>Result&lt;T, E&gt;</code>, repository</td></tr>
<tr><td>7 — Advanced types</td><td>typed event names, mapped DTOs</td></tr>
<tr><td>8 — Utility types</td><td>create/patch DTOs with Omit/Partial</td></tr>
<tr><td rowspan="4">3 · In practice</td><td>9 — tsconfig &amp; the compiler</td><td>CI gate <code>tsc --noEmit</code></td></tr>
<tr><td>10 — Modules &amp; declarations</td><td><code>.d.ts</code> for an old JS package</td></tr>
<tr><td>11 — Typing a Node/Express backend</td><td>the LabFlow API, typed</td></tr>
<tr><td>12 — Typing React</td><td>booking form sharing the API types</td></tr>
<tr><td rowspan="4">4 · Mastery</td><td>13 — Runtime validation: Zod &amp; Prisma</td><td>Zod at the boundary, Prisma rows</td></tr>
<tr><td>14 — Classes &amp; decorators</td><td><code>BookingService</code>, <code>#private</code></td></tr>
<tr><td>15 — Build performance</td><td>measure tsc 6 vs 7, incremental builds</td></tr>
<tr><td>16 — Architecture &amp; type-driven design</td><td>branded <code>Minutes</code>, illegal states — then the <strong>final project</strong>: LabFlow TS full-stack, 100-point grader</td></tr>
</tbody>
</table>`;
const ROAD_VI = `<table>
<thead><tr><th>Chặng</th><th>Chương</th><th>LabFlow TS có thêm gì</th></tr></thead>
<tbody>
<tr><td rowspan="4">1 · Nền tảng</td><td>1 — Vì sao TypeScript tồn tại</td><td><code>js/</code> → <code>src/rules/*.ts</code></td></tr>
<tr><td>2 — Hệ thống kiểu cơ bản</td><td>hằng số, <code>null</code> trong dữ liệu lịch</td></tr>
<tr><td>3 — Hàm</td><td>chuỗi hàm kiểm tra (validator)</td></tr>
<tr><td>4 — Object, interface &amp; type alias</td><td>mô hình miền Lab / User / Booking</td></tr>
<tr><td rowspan="4">2 · Hệ thống kiểu thật sự</td><td>5 — Union, literal &amp; thu hẹp kiểu</td><td><code>SlotResult</code>, trạng thái lượt đặt</td></tr>
<tr><td>6 — Generics (kiểu tổng quát)</td><td><code>Result&lt;T, E&gt;</code>, repository</td></tr>
<tr><td>7 — Kiểu nâng cao</td><td>tên sự kiện có kiểu, DTO ánh xạ</td></tr>
<tr><td>8 — Utility types (kiểu tiện ích)</td><td>DTO tạo/sửa bằng Omit/Partial</td></tr>
<tr><td rowspan="4">3 · Khi làm thật</td><td>9 — tsconfig &amp; trình biên dịch</td><td>cổng CI <code>tsc --noEmit</code></td></tr>
<tr><td>10 — Module &amp; khai báo kiểu (.d.ts)</td><td><code>.d.ts</code> cho một gói JS cũ</td></tr>
<tr><td>11 — Gõ kiểu backend Node/Express</td><td>API LabFlow có kiểu</td></tr>
<tr><td>12 — Gõ kiểu React</td><td>form đặt phòng dùng chung kiểu với API</td></tr>
<tr><td rowspan="4">4 · Làm chủ</td><td>13 — Validate runtime: Zod &amp; Prisma</td><td>Zod ở biên, dòng dữ liệu Prisma</td></tr>
<tr><td>14 — Class &amp; decorator</td><td><code>BookingService</code>, <code>#private</code></td></tr>
<tr><td>15 — Hiệu năng build</td><td>đo tsc 6 vs 7, build tăng dần</td></tr>
<tr><td>16 — Kiến trúc &amp; tư duy type-driven</td><td>kiểu "đóng dấu" <code>Minutes</code> — rồi <strong>dự án cuối khoá</strong>: LabFlow TS full-stack, máy chấm 100 điểm</td></tr>
</tbody>
</table>`;

const SCORE_EN = `<table>
<thead><tr><th>Mistake</th><th>node (JavaScript)</th><th>tsc 7.0.2 (nothing runs)</th></tr></thead>
<tbody>
<tr><td><code>b.minute</code> (typo)</td><td>no error — usage <code>NaN</code></td><td>TS2551 · Did you mean 'minutes'?</td></tr>
<tr><td><code>{ seat: r.seats }</code></td><td><code>RangeError</code>, only when a &gt; 30-seat student request arrives</td><td>TS2561 · Did you mean to write 'seats'?</td></tr>
<tr><td><code>role: 'lecturer'</code></td><td>no error — the lecturer "needs approval"</td><td>TS2820 · Did you mean '"LECTURER"'?</td></tr>
<tr><td><code>=== 'APPROVED'</code></td><td>no error — always 0</td><td>TS2367 · the types have no overlap</td></tr>
<tr><td>rename <code>seats</code> → <code>seatCount</code></td><td>loads (11 exports); crashes on the first booking</td><td>6 errors in 2 files, every location</td></tr>
</tbody>
</table>`;
const SCORE_VI = `<table>
<thead><tr><th>Lỗi</th><th>node (JavaScript)</th><th>tsc 7.0.2 (không chạy gì)</th></tr></thead>
<tbody>
<tr><td><code>b.minute</code> (gõ nhầm)</td><td>không lỗi — tỉ lệ <code>NaN</code></td><td>TS2551 · Did you mean 'minutes'?</td></tr>
<tr><td><code>{ seat: r.seats }</code></td><td><code>RangeError</code>, chỉ khi có yêu cầu &gt; 30 chỗ của sinh viên</td><td>TS2561 · Did you mean to write 'seats'?</td></tr>
<tr><td><code>role: 'lecturer'</code></td><td>không lỗi — giảng viên "cần duyệt"</td><td>TS2820 · Did you mean '"LECTURER"'?</td></tr>
<tr><td><code>=== 'APPROVED'</code></td><td>không lỗi — luôn bằng 0</td><td>TS2367 · hai kiểu không giao nhau</td></tr>
<tr><td>đổi tên <code>seats</code> → <code>seatCount</code></td><td>nạp được (11 export); sập ở lượt đặt đầu tiên</td><td>6 lỗi trong 2 tệp, đủ mọi chỗ</td></tr>
</tbody>
</table>`;

export default {
  title: '0.1 — About this course, the LabFlow TS project & the roadmap|||0.1 — Về khoá học, dự án LabFlow TS & lộ trình',
  slug: 'typescript-0-1-gioi-thieu',
  type: 'VIDEO',
  isFreePreview: true,
  // Video lịch sử: "TypeScript Origins: The Documentary" (OfferZen) — kể lại
  // sự ra đời của TypeScript với chính Anders Hejlsberg, người sáng lập.
  video: { url: 'https://youtu.be/U6s2pdxebSo', durationSeconds: 0 },
  description: 'Học xong khoá làm được gì (API Express có kiểu, form React dùng chung kiểu, Zod, Prisma, CI typecheck); dự án xuyên khoá LabFlow TS lấy từ LabFlow Lite; đo thật bốn con bug trong một ngày LabFlow: Node im lặng hoặc sập muộn, tsc báo đủ cả bốn trong 0,08 giây; đổi tên trường ⇒ 6 chỗ; lộ trình 16 chương có lab từng chương và dự án cuối khoá; 15 phút đầu chạy dự án.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>About this course, the LabFlow TS project &amp; the roadmap</h2>
<p class="lead">After this lesson you know exactly what you will be able to build at the end of the course, which project you will build it on, and why TypeScript is worth your time — shown with numbers measured on that project: four everyday bugs that Node runs without a word, and that the TypeScript compiler reports in under a tenth of a second.</p>

<h3>What you walk away with</h3>
<p>Not "you know the syntax" — things you can show in a project review, a CV or an interview:</p>
<ul>
<li><strong>A typed Node/Express API</strong> for LabFlow — routes, handlers, errors (Ch11) — and <strong>a React form that imports the same types</strong>, so a renamed field breaks the build, not the demo (Ch12).</li>
<li><strong>Zod at the boundary</strong> (one schema = runtime check + type) and <strong>Prisma types</strong> from database to handler (Ch13).</li>
<li><strong>A strict <code>tsconfig.json</code> and a CI gate</strong> running <code>tsc --noEmit</code> (Ch9).</li>
<li><strong>Reading any TypeScript codebase</strong> — <code>Map&lt;string, Booking[]&gt;</code>, unions, <code>Partial&lt;T&gt;</code> (Ch2–8) — and <strong>interview answers backed by your own measurements</strong>.</li>
</ul>
<p>For a Node.js-track FPT student this is exactly what comes next: SWP391/SEP490 team projects, internships where the backend is TypeScript by default, and the Node.js → API Design → Testing courses, which share the LabFlow project.</p>

<h3>What TypeScript is, in one paragraph</h3>
<p>TypeScript is JavaScript plus a layer of <strong>types (kiểu)</strong> — labels such as <code>string</code>, <code>number</code> or <code>'STUDENT' | 'LECTURER'</code> that describe what a value may be. A program called the <strong>compiler (trình biên dịch)</strong>, <code>tsc</code>, reads your code <em>without running it</em> and reports every place where the labels do not fit. Then the types are <strong>erased (xoá đi)</strong>: what runs is ordinary JavaScript. Microsoft released it in October 2012; its designer is Anders Hejlsberg (Turbo Pascal, Delphi, C#) — the video above, <em>TypeScript Origins: The Documentary</em> by OfferZen, tells that story. History with checkable dates: lesson 0.8; the erasing step line by line: lesson 0.4.</p>

<h3>The project: LabFlow TS</h3>
<p>LabFlow is a lab-room booking system: students and lecturers book rooms such as <code>BE-201</code> by half-hour slots. It is the project of the <strong>Node.js</strong>, <strong>API Design</strong> and <strong>Testing</strong> courses; Testing uses a small version, <strong>LabFlow Lite</strong>. Chapter 1 takes LabFlow Lite's two rule files, <strong>in plain JavaScript</strong>, and turns them into TypeScript. Never took those courses? Nothing is missing — every rule is explained here.</p>
<p>The rules, as they appear at the top of <code>js/booking.js</code>:</p>
${ma('javascript', CODE.bookingJs.split('\n').slice(2, 8).join('\n'))}
<p>BR-04: a 30-minute grid inside 07:00–21:00 · Lite-1: at most 4 hours · BR-05: at most 14 days ahead · BR-06: a student booking above 30 seats needs approval (lecturers and admins never do).</p>
<p>Here is a fresh copy of the project at the end of Chapter 1 (real listing, <code>node_modules</code> excluded):</p>
${ra(OUT['15-cay'])}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">js/ · The original JavaScript</span><span class="lz-lnote">LabFlow Lite's <code>time.js</code> + <code>booking.js</code>, never edited — the "before" picture</span></div>
  <div class="lz-layer"><span class="lz-lname">src/ · The TypeScript version</span><span class="lz-lnote">the same rules with types, plus 10 runtime tests — always green, grows every chapter</span></div>
  <div class="lz-layer"><span class="lz-lname">labN/ · Your lab of chapter N</span><span class="lz-lnote">a starter, behaviour tests, and wrong calls that your types must refuse</span></div>
  <div class="lz-layer"><span class="lz-lname">scripts/ · The graders</span><span class="lz-lnote"><code>cham-lab-1.mjs</code> runs the real <code>tsc</code> and <code>node</code> and prints a score out of 10</span></div>
</div>
<p>Only two tools, pinned exactly in <code>package.json</code>: <code>typescript@7.0.2</code> to <em>check</em> and Node 22.23.3 to <em>run</em> (Node 22 runs <code>.ts</code> files directly). Lesson 0.3 builds this setup from an empty folder.</p>

<h3>Why it is worth it — measured on LabFlow</h3>
<p>Opinions about TypeScript are cheap. Here is an experiment you can repeat. A small script, <code>demo0/ts-00-1/app.js</code>, simulates one working day with the <strong>real</strong> LabFlow rules. Four everyday mistakes are planted in it — the kind every team makes in its first month:</p>
${ma('javascript', CODE.appJs)}
<p>Run it on a quiet day with two requests:</p>
${ra(OUT['01-js-small'])}
<p>Exit code 0. Nothing crashed — and three things are wrong. Usage is <code>NaN</code> because <code>b.minute</code> does not exist (reading a missing property gives <code>undefined</code>, and <code>undefined / 840</code> is <code>NaN</code>). The lecturer "needs approval" because <code>'lecturer'</code> is not <code>'LECTURER'</code>, so the rule treats her as a student. And "approved bookings: 0" because no booking ever has the status <code>APPROVED</code> — only <code>PENDING</code> or <code>CONFIRMED</code>. Now a busier day, with one 40-seat student class:</p>
${ra(boStack(OUT['02-js-big']))}
<p>The fourth bug was there all along, but it lives in a branch that only runs for a big student class. JavaScript reports a mistake <strong>only when the line runs</strong>, and the message ("seats must be a positive integer, got undefined") points into <code>booking.js</code>, not at the typo in <code>app.js</code> that caused it.</p>
<p>Now the same day in <code>app.ts</code> — same data, same four mistakes, but the rules come from the typed <code>src/rules/booking.ts</code>.</p>
${ra(OUT['03-tsc'])}
<p>All four, before anything runs, each with file, line, column and an <strong>error code (mã lỗi)</strong> — and three of them suggest the fix. Lesson 0.2 teaches you to read these codes.</p>
<p>How long did the check take? Measured twice on the course machine:</p>
${ra(OUT['09-time-bin'])}
<p>0.07–0.08 seconds (through <code>npx</code>, which first looks up the package: 0.31–0.33 s, also measured twice). TypeScript 7 is the compiler rewritten in Go, 8–12× faster than TypeScript 6 on large projects (lesson 0.8).</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — running the <code>.ts</code> file is not checking it.</strong> Node 22 runs TypeScript files directly. Watch what it does with <code>app.ts</code>, which has four type errors:</p>
${ra(OUT['04-ts-run'])}
<p>Exit code 0 and the same <code>NaN</code>. Node only <em>strips</em> the types and runs the JavaScript that remains; it never checks them. The safety comes from running <code>tsc</code> — in your editor, before you commit, and as a CI gate. Lesson 0.4 explains this split between compile time and run time; Chapter 9 turns <code>tsc --noEmit</code> into a gate that blocks a red build.</p>
</div>

<h3>A rename, measured</h3>
<p>Renaming things is daily work: a reviewer asks for <code>seatCount</code> instead of <code>seats</code>. In a copy of the typed rules (<code>demo0/ts-00-1/doi-ten/</code>) we changed <strong>only the two type declarations</strong>:</p>
${ma('typescript', DOI_TEN)}
${ra(OUT['05-doi-ten'])}
<p>Six errors in two files: the two places inside <code>booking.ts</code> that still read <code>seats</code>, the place that passes <code>{ seats, role }</code> on, and the three calls in the test file. That list <em>is</em> your to-do list for the refactor; when it is empty, you are done. The same rename in JavaScript (<code>demo0/ts-00-1/doi-ten-js/booking.js</code>, only <code>needsApproval</code> renamed):</p>
${ra(OUT['06-doi-ten-js-load'])}
${ra(boStack(OUT['07-doi-ten-js-call']))}
<p>The module loads happily; the mistake appears on the first booking — at run time, one path at a time, wherever that path happens to be.</p>

<h3>The scoreboard</h3>
${SCORE_EN}
<p>Outside the classroom: of 400 real bugs from public JavaScript projects, TypeScript would have caught 15% — bugs that had survived tests and review (Gao, Bird &amp; Barr, ICSE 2017). Types do not replace tests (lesson 1.2), but they remove a whole family of mistakes for a 0.08-second check.</p>

<h3>The roadmap — 16 chapters, 4 stages</h3>
<p>Each stage needs the one before it (generics need unions; conditional types need generics). Every chapter ends with a graded Lab.</p>
${ROAD_EN}

<h3>How every lesson is built</h3>
<p>📑 10–12 slides in English with short EN/VI narration → 📖 the written lesson, every command with its real output from <code>tsc</code> 7.0.2 and Node 22.23.3 → 🧪 a 10–20 minute practice with solution and "Done when" → 🏋️ Code Lab exercises (make a file compile without <code>any</code>, or make the compiler refuse a wrong call with the right error code) → 🔬 the chapter Lab with a grader (pass: 7/10) → ✅ a 10-question quiz with explanations.</p>

<h3>What you need before you start</h3>
<p>Basic JavaScript as used in FER202/SDN302: <code>let</code>/<code>const</code>, functions and arrows, objects and destructuring (<code>const { seats, role } = input</code>), <code>map</code>/<code>filter</code>/<code>for…of</code>, <code>import</code>/<code>export</code>, <code>throw</code>/<code>try</code>, and <code>async</code>/<code>await</code> from Chapter 11. Each is re-explained in a line where first used. Plus a terminal and Node 22 (lesson 0.3). No TypeScript needed. <strong>Time (estimate):</strong> 60–90 minutes per lesson, 3–5 hours per chapter with its lab, about 60–80 hours in total.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Copy the project folder <code>labflow-ts</code> (the course snapshot, without <code>node_modules</code>) somewhere on your machine and install exactly the pinned versions with <code>npm ci</code>.</li>
<li>Run the type check: <code>npm run typecheck</code>.</li>
<li>Run the tests: <code>npm test</code>.</li>
<li>Run the Lab 1 grader on the untouched starter: <code>npm run lab1</code>. Read which checks pass and which fail.</li>
</ol>
<p><strong>Real output on a fresh copy:</strong></p>
${ra(boNotice(OUT['11-npm-ci']))}
${ra(OUT['12-typecheck'])}
${ra(TEST_TAIL)}
${ra(OUT['14-lab1'])}
<p>For <code>tsc</code>, silence means 0 errors. The starter is JavaScript renamed to <code>.ts</code>: untyped parameters (TS7006, TS7031), tests that cannot load <code>./time.js</code> (lesson 0.3), only 3 of 8 wrong calls refused — so 2.5/10. Chapter 1 takes it to 10.</p>
<p><strong>Done when:</strong> <code>npm run typecheck</code> exits silently, <code>npm test</code> shows <code>pass 10</code>, and you can say in one sentence why the starter scores 2.5.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">type</span><span class="v">A label describing what a value may be: <code>string</code>, <code>number</code>, <code>'STUDENT' | 'LECTURER'</code>, an object shape.</span></div>
  <div class="kv"><span class="k">compiler · tsc</span><span class="v">The program that reads TypeScript without running it and reports where the types do not fit.</span></div>
  <div class="kv"><span class="k">error code (TSxxxx)</span><span class="v">The number of a compiler diagnostic, e.g. TS2551 — searchable, and the same in every language of the error message.</span></div>
  <div class="kv"><span class="k">type erasure</span><span class="v">Types are removed before the code runs; Node and browsers only ever see JavaScript.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>At the end you build a typed Express API, a React form sharing its types, Zod and Prisma at the boundaries, and a strict config with a CI gate.</li>
<li>Everything happens on one project, LabFlow TS — the same LabFlow as the Node.js, API Design and Testing courses.</li>
<li>Measured: four bugs that Node ran silently or crashed on late were all reported by <code>tsc</code> in 0.07–0.08 s, before running; a rename produced a complete list of 6 places.</li>
<li>Running a <code>.ts</code> file with Node does not check it — the check is <code>tsc</code>, a separate step.</li>
<li>16 chapters in 4 stages, a graded Lab in each chapter, a final full-stack project in Chapter 16.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('🚀', 'Announcing TypeScript 7.0 — TypeScript team blog, 8 Jul 2026', 'The Go-native compiler, 8–12× faster full builds, new defaults (strict on). Read 1 Nov 2026.', 'https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/')}
${nguon('🟩', 'Node.js — Modules: TypeScript', 'How Node 22 runs .ts files by stripping types, and what it does not support. Read 1 Nov 2026.', 'https://nodejs.org/api/typescript.html')}
${nguon('🎬', 'TypeScript Origins: The Documentary — OfferZen', 'Anders Hejlsberg and the team on why TypeScript was built. Checked 1 Nov 2026.', 'https://www.youtube.com/watch?v=U6s2pdxebSo')}
${lienKet({ khoa: 'testing', bai: 'tst-0-3-gioi-thieu-du-an', title: 'Also in the Testing course — 0.1: LabFlow Lite, the project you will test', sub: 'Same: the LabFlow booking rules BR-04 (30-minute grid, 07:00–21:00), BR-05 (≤ 14 days) and BR-06 (> 30 seats needs approval), in the same time.js and booking.js. Different: Testing catches mistakes with tests that RUN the code; here the same rules become TypeScript so the compiler catches a whole family of mistakes without running anything.', cta: 'OPEN TESTING LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Về khoá học, dự án LabFlow TS &amp; lộ trình</h2>
<p class="lead">Học xong bài này bạn biết chính xác cuối khoá mình làm ra được gì, làm trên dự án nào, và vì sao TypeScript đáng thời gian của bạn — bằng số đo thật trên chính dự án đó: bốn con bug rất đời thường mà Node chạy qua không một lời, còn trình biên dịch TypeScript báo đủ cả bốn trong chưa tới một phần mười giây.</p>

<h3>Học xong bạn mang về cái gì</h3>
<p>Không phải "bạn đã biết cú pháp" — mà là những thứ đem ra được khi bảo vệ đồ án, ghi vào CV hay nói trong buổi phỏng vấn:</p>
<ul>
<li><strong>Một API Node/Express có kiểu</strong> cho LabFlow — route, handler, lỗi (Ch11) — và <strong>một form React dùng chung kiểu đó</strong>, nên đổi tên một trường thì build đỏ chứ không phải buổi demo sập (Ch12).</li>
<li><strong>Zod ở biên</strong> (một schema = phép kiểm lúc chạy + kiểu) và <strong>kiểu Prisma</strong> từ cơ sở dữ liệu tới handler (Ch13).</li>
<li><strong>Một <code>tsconfig.json</code> strict và cổng CI</strong> chạy <code>tsc --noEmit</code> (Ch9).</li>
<li><strong>Đọc được mọi codebase TypeScript</strong> — <code>Map&lt;string, Booking[]&gt;</code>, union, <code>Partial&lt;T&gt;</code> (Ch2–8) — và <strong>trả lời phỏng vấn bằng số đo của chính bạn</strong>.</li>
</ul>
<p>Với sinh viên FPT chuyên ngành hẹp Node.js, đây đúng là chặng ngay phía trước: đồ án nhóm SWP391/SEP490, kỳ thực tập nơi backend mặc định là TypeScript, và các khoá Node.js → API Design → Testing dùng chung dự án LabFlow.</p>

<h3>TypeScript là gì, trong một đoạn</h3>
<p>TypeScript là JavaScript cộng thêm một lớp <strong>kiểu (type)</strong> — những nhãn như <code>string</code>, <code>number</code> hay <code>'STUDENT' | 'LECTURER'</code> mô tả một giá trị được phép là gì. Một chương trình gọi là <strong>trình biên dịch (compiler)</strong>, <code>tsc</code>, đọc code của bạn <em>mà không chạy nó</em> và báo mọi chỗ nhãn không khớp. Sau đó kiểu bị <strong>xoá đi (erased)</strong>: thứ thật sự chạy là JavaScript bình thường. Microsoft phát hành nó tháng 10/2012; người thiết kế là Anders Hejlsberg (Turbo Pascal, Delphi, C#) — video phía trên, <em>TypeScript Origins: The Documentary</em> của OfferZen, kể lại câu chuyện đó. Lịch sử với các mốc kiểm được: bài 0.8; bước xoá kiểu từng dòng: bài 0.4.</p>

<h3>Dự án: LabFlow TS</h3>
<p>LabFlow là hệ thống đặt phòng lab: sinh viên và giảng viên đặt phòng như <code>BE-201</code> theo từng khung nửa tiếng. Đây là dự án của các khoá <strong>Node.js</strong>, <strong>API Design</strong> và <strong>Testing</strong>; Testing dùng một bản thu nhỏ tên <strong>LabFlow Lite</strong>. Chương 1 lấy hai tệp luật của LabFlow Lite, <strong>viết bằng JavaScript thuần</strong>, và đổi sang TypeScript. Chưa học các khoá kia? Không thiếu gì — luật nào cũng được giải thích ngay tại đây.</p>
<p>Các luật, đúng như ở đầu tệp <code>js/booking.js</code>:</p>
${ma('javascript', CODE.bookingJs.split('\n').slice(2, 8).join('\n'))}
<p>BR-04: lưới 30 phút trong khung 07:00–21:00 · Lite-1: tối đa 4 giờ · BR-05: đặt trước tối đa 14 ngày · BR-06: sinh viên đặt trên 30 chỗ thì cần duyệt (giảng viên, admin thì không).</p>
<p>Đây là một bản sao mới của dự án ở cuối Chương 1 (danh sách thật, không tính <code>node_modules</code>):</p>
${ra(OUT['15-cay'])}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">js/ · JavaScript gốc</span><span class="lz-lnote"><code>time.js</code> + <code>booking.js</code> của LabFlow Lite, không bao giờ sửa — bức ảnh "trước khi"</span></div>
  <div class="lz-layer"><span class="lz-lname">src/ · Bản TypeScript</span><span class="lz-lnote">cùng bộ luật có kiểu, kèm 10 test chạy thật — luôn xanh, lớn dần mỗi chương</span></div>
  <div class="lz-layer"><span class="lz-lname">labN/ · Lab của chương N</span><span class="lz-lnote">mã khởi đầu, test hành vi, và các lời gọi sai mà kiểu của bạn phải từ chối</span></div>
  <div class="lz-layer"><span class="lz-lname">scripts/ · Máy chấm</span><span class="lz-lnote"><code>cham-lab-1.mjs</code> chạy <code>tsc</code> và <code>node</code> thật rồi in điểm trên thang 10</span></div>
</div>
<p>Chỉ hai công cụ, ghim đúng bản trong <code>package.json</code>: <code>typescript@7.0.2</code> để <em>kiểm</em> và Node 22.23.3 để <em>chạy</em> (Node 22 chạy thẳng tệp <code>.ts</code>). Bài 0.3 dựng môi trường này từ một thư mục trống.</p>

<h3>Vì sao đáng học — đo trên chính LabFlow</h3>
<p>Ý kiến về TypeScript thì rẻ. Đây là một thí nghiệm bạn lặp lại được. Một script nhỏ, <code>demo0/ts-00-1/app.js</code>, mô phỏng một ngày làm việc bằng bộ luật <strong>thật</strong> của LabFlow. Trong đó cài sẵn bốn lỗi rất đời thường — loại lỗi đội nào cũng mắc trong tháng đầu:</p>
${ma('javascript', CODE.appJs)}
<p>Chạy với một ngày vắng, hai yêu cầu:</p>
${ra(OUT['01-js-small'])}
<p>Mã thoát 0. Không gì sập — và ba thứ sai. Tỉ lệ sử dụng là <code>NaN</code> vì <code>b.minute</code> không tồn tại (đọc thuộc tính không có thì được <code>undefined</code>, mà <code>undefined / 840</code> là <code>NaN</code>). Cô giảng viên "cần duyệt" vì <code>'lecturer'</code> không phải <code>'LECTURER'</code>, nên luật coi cô là sinh viên. Còn "approved bookings: 0" vì không lượt đặt nào có trạng thái <code>APPROVED</code> — chỉ có <code>PENDING</code> hoặc <code>CONFIRMED</code>. Giờ một ngày bận hơn, có một lớp sinh viên 40 chỗ:</p>
${ra(boStack(OUT['02-js-big']))}
<p>Con bug thứ tư nằm đó từ đầu, nhưng ở một nhánh chỉ chạy khi có lớp sinh viên đông. JavaScript chỉ báo lỗi <strong>khi dòng đó chạy tới</strong>, và thông báo ("seats must be a positive integer, got undefined") chỉ vào <code>booking.js</code>, chứ không chỉ vào chỗ gõ nhầm trong <code>app.js</code> đã gây ra nó.</p>
<p>Bây giờ cùng ngày đó trong <code>app.ts</code> — cùng dữ liệu, cùng bốn lỗi, nhưng bộ luật lấy từ <code>src/rules/booking.ts</code> có kiểu.</p>
${ra(OUT['03-tsc'])}
<p>Đủ cả bốn, trước khi bất cứ thứ gì chạy, lỗi nào cũng có tệp, dòng, cột và một <strong>mã lỗi (error code)</strong> — ba lỗi còn gợi ý cách sửa. Bài 0.2 dạy bạn đọc các mã này.</p>
<p>Phép kiểm mất bao lâu? Đo hai lần trên máy soạn khoá:</p>
${ra(OUT['09-time-bin'])}
<p>0,07–0,08 giây (đi qua <code>npx</code>, bước tìm gói trước: 0,31–0,33 giây, cũng đo hai lần). TypeScript 7 là trình biên dịch viết lại bằng Go, nhanh hơn TypeScript 6 từ 8 tới 12 lần trên dự án lớn (bài 0.8).</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — chạy tệp <code>.ts</code> không phải là kiểm nó.</strong> Node 22 chạy thẳng tệp TypeScript. Xem nó làm gì với <code>app.ts</code>, tệp đang có bốn lỗi kiểu:</p>
${ra(OUT['04-ts-run'])}
<p>Mã thoát 0 và vẫn <code>NaN</code>. Node chỉ <em>bóc</em> kiểu đi rồi chạy phần JavaScript còn lại; nó không bao giờ kiểm kiểu. Sự an toàn đến từ việc chạy <code>tsc</code> — trong editor, trước khi commit, và ở cổng CI. Bài 0.4 giải thích sự tách bạch giữa lúc biên dịch và lúc chạy; Chương 9 biến <code>tsc --noEmit</code> thành cổng chặn build đỏ.</p>
</div>

<h3>Một lần đổi tên, đo thật</h3>
<p>Đổi tên là việc hằng ngày: người review muốn <code>seatCount</code> thay cho <code>seats</code>. Trong một bản sao của bộ luật có kiểu (<code>demo0/ts-00-1/doi-ten/</code>), ta chỉ đổi <strong>đúng hai khai báo kiểu</strong>:</p>
${ma('typescript', DOI_TEN)}
${ra(OUT['05-doi-ten'])}
<p>Sáu lỗi trong hai tệp: hai chỗ bên trong <code>booking.ts</code> vẫn đọc <code>seats</code>, chỗ truyền tiếp <code>{ seats, role }</code>, và ba lời gọi trong tệp test. Danh sách đó <em>chính là</em> danh sách việc của lần refactor; danh sách trống là xong. Cùng lần đổi tên đó trong JavaScript (<code>demo0/ts-00-1/doi-ten-js/booking.js</code>, chỉ đổi trong <code>needsApproval</code>):</p>
${ra(OUT['06-doi-ten-js-load'])}
${ra(boStack(OUT['07-doi-ten-js-call']))}
<p>Module nạp êm ru; lỗi xuất hiện ở lượt đặt đầu tiên — lúc chạy, từng nhánh một, ở bất cứ đâu nhánh đó tình cờ nằm.</p>

<h3>Bảng tổng kết</h3>
${SCORE_VI}
<p>Ra ngoài lớp học: trong 400 bug thật của các dự án JavaScript công khai, TypeScript đã có thể bắt 15% — những bug đã lọt qua test và review (Gao, Bird &amp; Barr, ICSE 2017). Kiểu không thay được test (bài 1.2), nhưng dọn sạch cả một họ lỗi với giá một phép kiểm 0,08 giây.</p>

<h3>Lộ trình — 16 chương, 4 chặng</h3>
<p>Chặng sau cần chặng trước (generics cần union; conditional type cần generics). Chương nào cũng kết thúc bằng một Lab có máy chấm.</p>
${ROAD_VI}

<h3>Một bài học được dựng thế nào</h3>
<p>📑 10–12 slide tiếng Anh kèm lời giảng ngắn EN/VI → 📖 bài đọc chi tiết, mọi lệnh kèm output thật của <code>tsc</code> 7.0.2 và Node 22.23.3 → 🧪 thực hành 10–20 phút có lời giải và "Đạt khi" → 🏋️ bài Code Lab (làm tệp biên dịch được mà không dùng <code>any</code>, hoặc làm trình biên dịch từ chối lời gọi sai với đúng mã lỗi) → 🔬 Lab của chương có máy chấm (đạt: 7/10) → ✅ quiz 10 câu có giải thích.</p>

<h3>Cần biết gì trước khi bắt đầu</h3>
<p>JavaScript cơ bản như FER202/SDN302 đã dùng: <code>let</code>/<code>const</code>, hàm và arrow function, object và destructuring (<code>const { seats, role } = input</code>), <code>map</code>/<code>filter</code>/<code>for…of</code>, <code>import</code>/<code>export</code>, <code>throw</code>/<code>try</code>, và <code>async</code>/<code>await</code> từ Chương 11. Thứ nào cũng được nhắc lại một dòng ở chỗ dùng đầu tiên. Cộng một terminal và Node 22 (bài 0.3). Không cần biết TypeScript. <strong>Thời gian (ước lượng):</strong> 60–90 phút mỗi bài, 3–5 giờ mỗi chương kể cả lab, cả khoá chừng 60–80 giờ.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Chép thư mục dự án <code>labflow-ts</code> (bản chụp của khoá, không có <code>node_modules</code>) vào máy và cài đúng các bản đã ghim bằng <code>npm ci</code>.</li>
<li>Chạy kiểm kiểu: <code>npm run typecheck</code>.</li>
<li>Chạy test: <code>npm test</code>.</li>
<li>Chạy máy chấm Lab 1 trên bản khởi đầu chưa sửa: <code>npm run lab1</code>. Đọc xem phép kiểm nào qua, phép nào trượt.</li>
</ol>
<p><strong>Output thật trên một bản sao mới:</strong></p>
${ra(boNotice(OUT['11-npm-ci']))}
${ra(OUT['12-typecheck'])}
${ra(TEST_TAIL)}
${ra(OUT['14-lab1'])}
<p>Với <code>tsc</code>, im lặng nghĩa là 0 lỗi. Bản khởi đầu là JavaScript đổi đuôi <code>.ts</code>: tham số chưa có kiểu (TS7006, TS7031), test không nạp được <code>./time.js</code> (bài 0.3), chỉ 3/8 lời gọi sai bị từ chối — nên 2,5/10. Chương 1 đưa nó lên 10.</p>
<p><strong>Đạt khi:</strong> <code>npm run typecheck</code> thoát trong im lặng, <code>npm test</code> hiện <code>pass 10</code>, và bạn nói được trong một câu vì sao bản khởi đầu chỉ được 2,5.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">type (kiểu)</span><span class="v">Nhãn mô tả một giá trị được phép là gì: <code>string</code>, <code>number</code>, <code>'STUDENT' | 'LECTURER'</code>, một dáng object.</span></div>
  <div class="kv"><span class="k">compiler · tsc (trình biên dịch)</span><span class="v">Chương trình đọc TypeScript mà không chạy nó và báo chỗ kiểu không khớp.</span></div>
  <div class="kv"><span class="k">error code — TSxxxx (mã lỗi)</span><span class="v">Số hiệu của một chẩn đoán, vd TS2551 — tra được, và giống nhau dù thông báo viết bằng ngôn ngữ nào.</span></div>
  <div class="kv"><span class="k">type erasure (xoá kiểu)</span><span class="v">Kiểu bị gỡ bỏ trước khi code chạy; Node và trình duyệt chỉ thấy JavaScript.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Cuối khoá bạn làm ra một API Express có kiểu, một form React dùng chung kiểu, Zod và Prisma ở biên, và một cấu hình strict có cổng CI.</li>
<li>Mọi thứ làm trên một dự án, LabFlow TS — cùng LabFlow của các khoá Node.js, API Design và Testing.</li>
<li>Đo thật: bốn con bug mà Node chạy qua im lặng hoặc sập muộn đều bị <code>tsc</code> báo trong 0,07–0,08 giây, trước khi chạy; một lần đổi tên cho ra danh sách đủ 6 chỗ.</li>
<li>Chạy tệp <code>.ts</code> bằng Node không phải là kiểm nó — kiểm là <code>tsc</code>, một bước riêng.</li>
<li>16 chương trong 4 chặng, mỗi chương một Lab có máy chấm, dự án full-stack cuối khoá ở Chương 16.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('🚀', 'Announcing TypeScript 7.0 — blog đội TypeScript, 8/7/2026', 'Trình biên dịch viết bằng Go, build đầy đủ nhanh hơn 8–12 lần, mặc định mới (strict bật sẵn). Đọc ngày 1/11/2026.', 'https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/')}
${nguon('🟩', 'Node.js — Modules: TypeScript', 'Node 22 chạy tệp .ts bằng cách bóc kiểu thế nào, và không hỗ trợ những gì. Đọc ngày 1/11/2026.', 'https://nodejs.org/api/typescript.html')}
${nguon('🎬', 'TypeScript Origins: The Documentary — OfferZen', 'Anders Hejlsberg và đội ngũ kể vì sao làm ra TypeScript. Kiểm ngày 1/11/2026.', 'https://www.youtube.com/watch?v=U6s2pdxebSo')}
${lienKet({ khoa: 'testing', bai: 'tst-0-3-gioi-thieu-du-an', title: 'Đã có ở khoá Testing — 0.1: LabFlow Lite, dự án bạn sẽ test', sub: 'Giống: cùng bộ luật đặt phòng LabFlow BR-04 (lưới 30 phút, 07:00–21:00), BR-05 (≤ 14 ngày), BR-06 (> 30 chỗ cần duyệt), trong cùng time.js và booking.js. Khác: Testing bắt lỗi bằng test CHẠY code; ở đây chính bộ luật đó thành TypeScript để trình biên dịch bắt cả một họ lỗi mà không cần chạy gì.', cta: 'MỞ BÀI TESTING →' })}
</div>
`,
};
