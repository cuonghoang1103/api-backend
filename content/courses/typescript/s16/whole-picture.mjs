/**
 * TypeScript · Chương 16 · 16.4 — The whole picture & where to go next. Slug giữ: typescript-16-4-whole-picture.
 * Code/output từ ./_ma-ts-16-4.mjs (demo16/ts-16-4, Node 22.23.3 + tsc 7.0.2). Soạn lại TRỌN 04/11/2026.
 */
import G from '../giang/ts-16-4.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-16-4.mjs';

const KV_EN = `<div class="kv-grid">
  <div class="kv"><span class="k">one idea</span><span class="v">Let the compiler hold the invariants.</span></div>
  <div class="kv"><span class="k">they compose</span><span class="v">Branded + readonly + discriminated union, in one function.</span></div>
  <div class="kv"><span class="k">the discriminant</span><span class="v">Reading <code>data</code> without narrowing on <code>ok</code> is TS2339.</span></div>
  <div class="kv"><span class="k">a trusted core</span><span class="v">Validate at every boundary; trust the types inside.</span></div>
  <div class="kv"><span class="k">where next</span><span class="v">Zod in depth, a typed API end to end, <code>satisfies</code>, const type params.</span></div>
</div>`;
const KV_VI = `<div class="kv-grid">
  <div class="kv"><span class="k">một ý tưởng</span><span class="v">Để trình biên dịch giữ các bất biến.</span></div>
  <div class="kv"><span class="k">chúng ghép được</span><span class="v">Branded + readonly + discriminated union, trong một hàm.</span></div>
  <div class="kv"><span class="k">cái nhãn</span><span class="v">Đọc <code>data</code> không thu hẹp theo <code>ok</code> là TS2339.</span></div>
  <div class="kv"><span class="k">một lõi đáng tin</span><span class="v">Validate ở mọi biên; tin kiểu bên trong.</span></div>
  <div class="kv"><span class="k">đi đâu tiếp</span><span class="v">Zod chuyên sâu, một API có kiểu từ đầu đến cuối, <code>satisfies</code>, const type param.</span></div>
</div>`;

export default {
  title: '16.4 — The whole picture & where to go next|||16.4 — Bức tranh toàn cảnh & đi tiếp',
  slug: 'typescript-16-4-whole-picture',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Mười sáu chương, một ý tưởng: để trình biên dịch giữ các bất biến để bạn không phải giữ. Mọi thói quen là một cách chuyển một lớp bug từ lúc chạy sang lúc biên dịch — và chúng ghép được. Một lát LabFlow dùng branded LabCode (16.1) + readonly Booking (8) + Result<T> discriminated (5,6): đọc r.data không thu hẹp theo ok ⇒ TS2339. Kiến trúc: một lõi đáng tin sau các rìa đã validate (Zod/Prisma ở biên). Đi tiếp: Zod chuyên sâu, API có kiểu end-to-end, satisfies, const type param. Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.4</span>
<h2>The whole picture &amp; where to go next</h2>
<p class="lead">Sixteen chapters, one idea: let the compiler hold the invariants so you do not have to. Every habit you learned is a way of moving a class of bugs from run time to compile time — and they compose. One small slice of LabFlow shows them all working together.</p>

<h3>Every habit, in one slice</h3>
<p>A branded <code>LabCode</code>, a <code>readonly Booking</code>, and a <code>Result&lt;T&gt;</code> discriminated union, in one function:</p>
${ma('ts', CODE.together)}
${ra(OUT['11-together'])}
<p><code>create</code> returns the <code>Result</code>, the caller narrows on <code>ok</code>, and nothing reaches <code>data</code> without first handling <code>error</code> — the whole course in one function.</p>

<h3>The discriminant still does the work</h3>
<p>Read <code>r.data</code> on a <code>Result</code> without narrowing on <code>ok</code>:</p>
${ma('ts', CODE.wrongtogether)}
${ra(OUT['12-wrongtogether'])}
<p><strong>TS2339</strong> — the error branch has no <code>data</code>. This is the same pattern from Chapter 5, Chapter 11’s API envelope, and Chapter 13’s <code>safeParse</code>: one tag, narrowed, that makes “this might have failed” part of the type.</p>

<h3>Where the boundaries are</h3>
<p>Types are erased at run time, so the invariants only hold if every boundary validates: Zod at the request (13), Prisma at the database (13), branded constructors at the edges (16.1). Inside those boundaries you can trust the types completely; across them you validate. That is the architecture — a trusted core behind validated edges.</p>

<h3>At a glance</h3>
${KV_EN}

<h3>🧪 Practice</h3>
<p>A generic <code>dataOr</code> reads <code>r.data</code> without narrowing:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['13-pr-start'])}
<p>Return <code>r.ok ? r.data : fallback</code> and it runs:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['14-pr-sol'])}

<h3>📌 Summary</h3>
<ul>
<li>One idea across sixteen chapters: let the compiler hold the invariants.</li>
<li>The habits compose — branded types, <code>readonly</code>, discriminated unions, honest returns — in one function.</li>
<li>The discriminant still does the work: reading <code>data</code> without narrowing on <code>ok</code> is TS2339.</li>
<li>The architecture is a trusted core behind validated edges — Zod and Prisma at the boundaries.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — The Basics', 'The one idea, from the top. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/basic-types.html')}
${nguon('📘', 'type-challenges', 'Where to sharpen the type system next. Read 4 Nov 2026.', 'https://github.com/type-challenges/type-challenges')}
${lienKet({ khoa: 'typescript', bai: 'typescript-16-6-du-an-cuoi-khoa', title: 'Assemble it — Final Project: LabFlow TS full-stack', sub: 'Same: every habit of the course, working together. Different: there it is one slice; the Final Project is the whole system — API, React, Zod, Prisma, CI — scored out of 100 by one grader, and written up as your portfolio piece.', cta: 'OPEN THE FINAL PROJECT →' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.4</span>
<h2>Bức tranh toàn cảnh &amp; đi tiếp</h2>
<p class="lead">Mười sáu chương, một ý tưởng: để trình biên dịch giữ các bất biến để bạn không phải giữ. Mọi thói quen bạn học là một cách chuyển một lớp bug từ lúc chạy sang lúc biên dịch — và chúng ghép được. Một lát nhỏ của LabFlow cho thấy tất cả làm việc cùng nhau.</p>

<h3>Mọi thói quen, trong một lát</h3>
<p>Một <code>LabCode</code> có nhãn, một <code>readonly Booking</code>, và một discriminated union <code>Result&lt;T&gt;</code>, trong một hàm:</p>
${ma('ts', CODE.together)}
${ra(OUT['11-together'])}
<p><code>create</code> trả <code>Result</code>, người gọi thu hẹp theo <code>ok</code>, và không gì với tới <code>data</code> mà chưa xử lý <code>error</code> — cả khoá trong một hàm.</p>

<h3>Cái nhãn vẫn làm việc</h3>
<p>Đọc <code>r.data</code> trên một <code>Result</code> mà không thu hẹp theo <code>ok</code>:</p>
${ma('ts', CODE.wrongtogether)}
${ra(OUT['12-wrongtogether'])}
<p><strong>TS2339</strong> — nhánh error không có <code>data</code>. Đây là cùng mẫu từ Chương 5, envelope API Chương 11, và <code>safeParse</code> Chương 13: một nhãn, được thu hẹp, làm “cái này có thể đã thất bại” thành một phần của kiểu.</p>

<h3>Các biên ở đâu</h3>
<p>Kiểu bị xoá lúc chạy, nên các bất biến chỉ giữ nếu mọi biên validate: Zod ở request (13), Prisma ở CSDL (13), constructor có nhãn ở rìa (16.1). Bên trong các biên đó bạn tin kiểu hoàn toàn; qua chúng bạn validate. Đó là kiến trúc — một lõi đáng tin sau các rìa đã validate.</p>

<h3>Nhìn nhanh</h3>
${KV_VI}

<h3>🧪 Luyện tập</h3>
<p>Một <code>dataOr</code> generic đọc <code>r.data</code> mà không thu hẹp:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['13-pr-start'])}
<p>Trả <code>r.ok ? r.data : fallback</code> và nó chạy:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['14-pr-sol'])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một ý tưởng qua mười sáu chương: để trình biên dịch giữ các bất biến.</li>
<li>Các thói quen ghép được — branded type, <code>readonly</code>, discriminated union, kiểu trả về trung thực — trong một hàm.</li>
<li>Cái nhãn vẫn làm việc: đọc <code>data</code> không thu hẹp theo <code>ok</code> là TS2339.</li>
<li>Kiến trúc là một lõi đáng tin sau các rìa đã validate — Zod và Prisma ở các biên.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — The Basics', 'Một ý tưởng, từ đầu. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/basic-types.html')}
${nguon('📘', 'type-challenges', 'Nơi mài hệ kiểu tiếp theo. Đọc ngày 4/11/2026.', 'https://github.com/type-challenges/type-challenges')}
${lienKet({ khoa: 'typescript', bai: 'typescript-16-6-du-an-cuoi-khoa', title: 'Lắp nó lại — Dự án cuối khoá: LabFlow TS full-stack', sub: 'Giống: mọi thói quen của khoá, làm việc cùng nhau. Khác: ở đó là một lát; Dự án cuối khoá là cả hệ — API, React, Zod, Prisma, CI — chấm trên thang 100 bởi một máy chấm, và viết thành mảnh hồ sơ của bạn.', cta: 'MỞ DỰ ÁN CUỐI KHOÁ →' })}
</div>
`,
};
