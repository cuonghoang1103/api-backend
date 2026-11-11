/**
 * TypeScript · Chương 16 · Dự án cuối khoá — LabFlow TS full-stack. BÀI MỚI 04/11/2026, slug typescript-16-6-du-an-cuoi-khoa (TRƯỚC quiz 16.5).
 * Máy chấm = scripts/cham-du-an.mjs (tsc + Node thật): A typecheck 20 · B 60 test 20 · C 6 lab tiêu biểu 60; đạt 70, giỏi 90. Bản tham khảo 100/100.
 * Code/output từ ./_ma-ts-du-an.mjs (SINH TỰ ĐỘNG). Giảng + deck: ../giang/ts-du-an.mjs.
 */
import G from '../giang/ts-du-an.mjs';
import { ma, ra, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-du-an.mjs';

const MAP_EN = `<table>
<thead><tr><th>Chapter</th><th>What it added to LabFlow TS</th></tr></thead>
<tbody>
<tr><td>1</td><td>The rules, converted from JavaScript to strict TypeScript (<code>src/rules</code>)</td></tr>
<tr><td>4</td><td>The domain model — Lab, User, Booking as typed shapes</td></tr>
<tr><td>5</td><td>The booking state machine — a discriminated union with <code>never</code> exhaustiveness</td></tr>
<tr><td>6</td><td>A generic <code>Repo&lt;T&gt;</code> and <code>Result&lt;T, E&gt;</code></td></tr>
<tr><td>8</td><td>The DTO layer — <code>CreateBooking = Omit&lt;…&gt;</code>, PATCH as <code>Partial</code></td></tr>
<tr><td>9</td><td>A strict tsconfig and a CI type-check gate</td></tr>
<tr><td>11</td><td>A typed Express API with an <code>ApiResult</code> error envelope</td></tr>
<tr><td>12</td><td>A typed React form and hook sharing the same types</td></tr>
<tr><td>13</td><td>A Zod schema at the request boundary as the single source of truth</td></tr>
<tr><td>14</td><td>A <code>BookingService</code> over an abstract repo, with <code>#private</code> state</td></tr>
<tr><td>15</td><td>A transpile-ready build (<code>import type</code> / <code>export type</code>)</td></tr>
<tr><td>16</td><td>Branded <code>LabCode</code>, illegal states unrepresentable</td></tr>
</tbody>
</table>`;
const MAP_VI = `<table>
<thead><tr><th>Chương</th><th>Đã thêm gì vào LabFlow TS</th></tr></thead>
<tbody>
<tr><td>1</td><td>Các luật, chuyển từ JavaScript sang TypeScript strict (<code>src/rules</code>)</td></tr>
<tr><td>4</td><td>Mô hình miền — Lab, User, Booking thành các dáng có kiểu</td></tr>
<tr><td>5</td><td>Máy trạng thái booking — một discriminated union với vét cạn <code>never</code></td></tr>
<tr><td>6</td><td>Một <code>Repo&lt;T&gt;</code> generic và <code>Result&lt;T, E&gt;</code></td></tr>
<tr><td>8</td><td>Tầng DTO — <code>CreateBooking = Omit&lt;…&gt;</code>, PATCH là <code>Partial</code></td></tr>
<tr><td>9</td><td>Một tsconfig strict và một cổng kiểm kiểu CI</td></tr>
<tr><td>11</td><td>Một API Express có kiểu với envelope lỗi <code>ApiResult</code></td></tr>
<tr><td>12</td><td>Một form và hook React có kiểu dùng chung cùng các kiểu</td></tr>
<tr><td>13</td><td>Schema Zod ở biên request làm nguồn sự thật duy nhất</td></tr>
<tr><td>14</td><td>Một <code>BookingService</code> trên một repo abstract, với trạng thái <code>#private</code></td></tr>
<tr><td>15</td><td>Một build sẵn-sàng-transpile (<code>import type</code> / <code>export type</code>)</td></tr>
<tr><td>16</td><td>Branded <code>LabCode</code>, trạng thái sai không biểu diễn được</td></tr>
</tbody>
</table>`;
const RUBRIC_EN = `<table>
<thead><tr><th>Part</th><th>Points</th><th>How the grader checks it</th></tr></thead>
<tbody>
<tr><td>A — type-check</td><td>20</td><td><code>tsc --noEmit</code> clean under the strict config</td></tr>
<tr><td>B — tests</td><td>20</td><td><code>node --test</code> — all 60 project tests pass</td></tr>
<tr><td>C — chapter labs</td><td>60</td><td>six representative labs (9, 11, 12, 13, 14, 15) each score 10/10</td></tr>
</tbody>
</table>`;
const RUBRIC_VI = `<table>
<thead><tr><th>Phần</th><th>Điểm</th><th>Máy chấm kiểm thế nào</th></tr></thead>
<tbody>
<tr><td>A — kiểm kiểu</td><td>20</td><td><code>tsc --noEmit</code> sạch dưới config strict</td></tr>
<tr><td>B — test</td><td>20</td><td><code>node --test</code> — cả 60 test của dự án qua</td></tr>
<tr><td>C — lab chương</td><td>60</td><td>sáu lab tiêu biểu (9, 11, 12, 13, 14, 15) mỗi cái 10/10</td></tr>
</tbody>
</table>`;
const STAR_EN = `<table>
<thead><tr><th>STAR</th><th>LabFlow TS</th></tr></thead>
<tbody>
<tr><td><b>Situation</b></td><td>A lab-booking system in loose JavaScript — invalid states reaching production (a booking with negative seats, an unvalidated lab code).</td></tr>
<tr><td><b>Task</b></td><td>Make invalid states impossible and catch errors before they ship, without rewriting from scratch.</td></tr>
<tr><td><b>Action</b></td><td>Converted the rules to strict TypeScript; added branded types, discriminated unions, Zod validation at the boundaries, a generic repository, a typed Express API and React form, and a CI type-check gate.</td></tr>
<tr><td><b>Result</b></td><td>A full-stack, type-driven system that scores 100/100 on an automated grader — illegal states unrepresentable, 60 tests green, every boundary validated.</td></tr>
</tbody>
</table>`;
const STAR_VI = `<table>
<thead><tr><th>STAR</th><th>LabFlow TS</th></tr></thead>
<tbody>
<tr><td><b>Situation</b></td><td>Một hệ đặt phòng lab bằng JavaScript lỏng — trạng thái sai tới production (một booking seats âm, một mã lab chưa validate).</td></tr>
<tr><td><b>Task</b></td><td>Làm trạng thái sai bất khả và bắt lỗi trước khi ship, không viết lại từ đầu.</td></tr>
<tr><td><b>Action</b></td><td>Chuyển luật sang TypeScript strict; thêm branded type, discriminated union, validate Zod ở các biên, một repository generic, một API Express và form React có kiểu, và một cổng kiểm kiểu CI.</td></tr>
<tr><td><b>Result</b></td><td>Một hệ full-stack type-driven chấm 100/100 trên một máy chấm tự động — trạng thái sai không biểu diễn được, 60 test xanh, mọi biên đã validate.</td></tr>
</tbody>
</table>`;

export default {
  title: 'Final Project — LabFlow TS full-stack|||Dự án cuối khoá — LabFlow TS full-stack',
  slug: 'typescript-16-6-du-an-cuoi-khoa',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Dự án cuối khoá: lắp tất cả thứ đã dựng qua 16 chương thành LabFlow TS full-stack (rules → model → state machine → generics → DTO → CI → API Express → form React → Zod/Prisma → service/abstract repo → build sẵn-sàng-transpile → branded/illegal states) và chấm trên thang 100 bằng một máy chấm (cham-du-an.mjs: A typecheck 20 · B 60 test 20 · C 6 lab tiêu biểu 60; đạt 70, giỏi 90). Bản tham khảo in 100/100 DISTINCTION. Kể dự án theo STAR cho CV/phỏng vấn. Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Final Project</span>
<h2>LabFlow TS full-stack</h2>
<p class="lead">The project is not new work — it is everything you have already built, assembled and graded as one portfolio piece. Across sixteen chapters LabFlow TS grew from a few rules into a typed full-stack system. Now you run one grader over the whole thing and score it out of 100.</p>

<h3>What each chapter contributed</h3>
${MAP_EN}

<h3>The 100-point grader</h3>
<p>One command — <code>npm run du-an</code> — scores the whole project. The early chapters (rules, model, unions, generics) are proven by the type-check and the tests; the later labs are run directly:</p>
${RUBRIC_EN}

<h3>A distinction run</h3>
<p>On the reference project it prints <strong>100/100 — DISTINCTION</strong>:</p>
${ra(OUT['du-an'])}
<p>This is your proof of work — a single, reproducible number that says the whole system holds, from the rules at the bottom to the build at the top.</p>

<h3>Tell it as a STAR story</h3>
<p>For your CV and interviews, write LabFlow TS as a STAR story:</p>
${STAR_EN}

<h3>Ship it</h3>
<ul>
<li>Push LabFlow TS to GitHub with <code>npm run du-an</code> in CI and the <code>100/100</code> result in the README.</li>
<li>Write the README as the STAR story above; link each claim to a file (branded types, Zod validation, the CI gate).</li>
<li>A reviewer reads for the habits: no <code>any</code> at the boundaries, validation where data enters, discriminated unions instead of flags, <code>readonly</code>, honest returns, derived types.</li>
<li>It is the one thing that shows you can do this — not just that you have read about it.</li>
</ul>

<h3>🎓 You finished the course</h3>
<p>Sixteen chapters, fifteen graded labs, one full-stack capstone. You moved a whole class of bugs from run time to compile time, and you have the portfolio piece to prove it. The compiler is now your pair — let it hold the invariants, and go build.</p>

<h3>📚 The grader</h3>
<p>The capstone grader (<code>scripts/cham-du-an.mjs</code>) runs the real checks — tsc, <code>node --test</code>, and the chapter labs — and tallies them to 100:</p>
${ma('javascript', CODE.grader)}

<h3>📚 Sources</h3>
${nguon('📘', 'STAR method', 'How to tell a project story in an interview. Read 4 Nov 2026.', 'https://en.wikipedia.org/wiki/Situation,_task,_action,_result')}
${nguon('📘', 'TypeScript Handbook', 'The reference for everything you built. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/intro.html')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 16 · Dự án cuối khoá</span>
<h2>LabFlow TS full-stack</h2>
<p class="lead">Dự án không phải việc mới — nó là tất cả thứ bạn đã dựng, lắp lại và chấm như một mảnh hồ sơ. Qua mười sáu chương LabFlow TS lớn từ vài luật thành một hệ full-stack có kiểu. Giờ bạn chạy một máy chấm trên cả nó và chấm trên thang 100.</p>

<h3>Mỗi chương đã góp gì</h3>
${MAP_VI}

<h3>Máy chấm 100 điểm</h3>
<p>Một lệnh — <code>npm run du-an</code> — chấm cả dự án. Các chương sớm (luật, model, union, generic) được chứng bởi type-check và test; các lab sau chạy trực tiếp:</p>
${RUBRIC_VI}

<h3>Một lượt giỏi</h3>
<p>Trên dự án tham khảo nó in <strong>100/100 — DISTINCTION</strong>:</p>
${ra(OUT['du-an'])}
<p>Đây là bằng chứng công việc của bạn — một con số duy nhất, tái lập được, nói cả hệ giữ vững, từ luật ở dưới cùng tới build ở trên cùng.</p>

<h3>Kể theo câu chuyện STAR</h3>
<p>Cho CV và phỏng vấn, viết LabFlow TS thành một câu chuyện STAR:</p>
${STAR_VI}

<h3>Ship nó</h3>
<ul>
<li>Đưa LabFlow TS lên GitHub với <code>npm run du-an</code> trong CI và kết quả <code>100/100</code> trong README.</li>
<li>Viết README theo câu chuyện STAR trên; nối mỗi khẳng định tới một tệp (branded type, validate Zod, cổng CI).</li>
<li>Một người soát đọc tìm các thói quen: không <code>any</code> ở các biên, validate nơi dữ liệu vào, discriminated union thay cờ, <code>readonly</code>, kiểu trả về trung thực, kiểu suy ra.</li>
<li>Nó là thứ duy nhất cho thấy bạn làm được — không chỉ đọc về nó.</li>
</ul>

<h3>🎓 Bạn đã hoàn thành khoá học</h3>
<p>Mười sáu chương, mười lăm lab có chấm, một capstone full-stack. Bạn đã chuyển cả một lớp bug từ lúc chạy sang lúc biên dịch, và bạn có mảnh hồ sơ để chứng minh. Trình biên dịch giờ là cặp đôi của bạn — để nó giữ các bất biến, và đi dựng.</p>

<h3>📚 Máy chấm</h3>
<p>Máy chấm cuối khoá (<code>scripts/cham-du-an.mjs</code>) chạy các phép kiểm thật — tsc, <code>node --test</code>, và các lab chương — và cộng về 100:</p>
${ma('javascript', CODE.grader)}

<h3>📚 Nguồn</h3>
${nguon('📘', 'Phương pháp STAR', 'Cách kể câu chuyện một dự án trong phỏng vấn. Đọc ngày 4/11/2026.', 'https://en.wikipedia.org/wiki/Situation,_task,_action,_result')}
${nguon('📘', 'TypeScript Handbook', 'Tài liệu tham khảo cho mọi thứ bạn đã dựng. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/intro.html')}
</div>
`,
};
