/**
 * TypeScript · Chương 15 · 15.3 — Separate checking from transpiling. Slug giữ: typescript-15-3-isolated-modules.
 * Code/output từ ./_ma-ts-15-3.mjs (demo15/ts-15-3, Node 22.23.3 + tsc 7.0.2). Soạn lại TRỌN 04/11/2026.
 */
import G from '../giang/ts-15-3.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-15-3.mjs';

const KV_EN = `<div class="kv-grid">
  <div class="kv"><span class="k">two jobs</span><span class="v">Checking (slow, whole-program) vs transpiling (fast, per-file).</span></div>
  <div class="kv"><span class="k">the split</span><span class="v"><code>tsc --noEmit</code> checks; esbuild/swc/Node emits.</span></div>
  <div class="kv"><span class="k">per-file blind spot</span><span class="v">A transpiler cannot tell a type from a value across files.</span></div>
  <div class="kv"><span class="k"><code>export type</code></span><span class="v">A plain re-export of a type is TS1205 — mark it.</span></div>
  <div class="kv"><span class="k">transpile-ready</span><span class="v">Fix the errors once; any fast tool can emit the code.</span></div>
</div>`;
const KV_VI = `<div class="kv-grid">
  <div class="kv"><span class="k">hai việc</span><span class="v">Check (chậm, toàn chương trình) vs transpile (nhanh, từng tệp).</span></div>
  <div class="kv"><span class="k">phép tách</span><span class="v"><code>tsc --noEmit</code> kiểm; esbuild/swc/Node phát.</span></div>
  <div class="kv"><span class="k">điểm mù từng-tệp</span><span class="v">Một transpiler không phân biệt kiểu với giá trị qua các tệp.</span></div>
  <div class="kv"><span class="k"><code>export type</code></span><span class="v">Một re-export thường của một kiểu là TS1205 — đánh dấu nó.</span></div>
  <div class="kv"><span class="k">sẵn-sàng-transpile</span><span class="v">Sửa lỗi một lần; bất kỳ công cụ nhanh nào cũng phát được code.</span></div>
</div>`;

export default {
  title: '15.3 — Separate checking from transpiling|||15.3 — Tách kiểm kiểu khỏi transpile',
  slug: 'typescript-15-3-isolated-modules',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Hai việc ẩn trong "compile": kiểm kiểu (chậm, cần cả chương trình) và transpile sang JavaScript (nhanh, từng tệp). Build hiện đại tách chúng — một transpiler nhanh (esbuild/swc/Node type-stripping) phát code, còn tsc --noEmit kiểm kiểu song song. Một transpiler từng-tệp không biết Booking là kiểu hay giá trị, nên verbatimModuleSyntax làm một re-export thường của một kiểu thành TS1205 — viết export type. Sửa chúng và bất kỳ transpiler nào cũng phát code an toàn. Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.3</span>
<h2>Separate checking from transpiling</h2>
<p class="lead">Two different jobs hide inside “compile”: <em>checking</em> the types (slow, needs the whole program) and <em>transpiling</em> to JavaScript (fast, one file at a time). Modern builds split them — a fast per-file transpiler (esbuild, swc, Node’s type-stripping) emits the code, while <code>tsc --noEmit</code> checks the types in parallel. For that to be safe, each file must be transpilable on its own.</p>

<h3>A per-file transpiler cannot read types across files</h3>
<p>A transpiler sees one file at a time; it cannot look into <code>./model.ts</code> to learn that <code>Booking</code> is a type and <code>VERSION</code> is a value. So a plain re-export is ambiguous:</p>
${ma('ts', CODE.reexport)}
${ra(OUT['11-reexport'])}
<p><strong>TS1205</strong> — under <code>verbatimModuleSyntax</code>, tsc refuses a plain <code>export { Booking }</code> of a type. It cannot be transpiled per-file, so it is an error here.</p>

<h3>export type makes the intent explicit</h3>
<p>Write <code>export type { Booking }</code> and keep the value re-export plain:</p>
${ma('ts', CODE.okReexport)}
${ra(OUT['12-ok'])}
<p>Now the intent is on the line itself: a transpiler can erase a <code>type</code> re-export and keep a value one, with no cross-file analysis. The error was the compiler enforcing transpile-readiness — <code>verbatimModuleSyntax</code> (and the older <code>isolatedModules</code>) check that every file could be transpiled alone.</p>

<h3>At a glance</h3>
${KV_EN}

<h3>🧪 Practice</h3>
<p>A module does <code>export { Lab }</code> where <code>Lab</code> is a type:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['13-pr-start'])}
<p>Write <code>export type { Lab }</code> and it compiles (exit 0):</p>
${ma('ts', CODE.prSol)}
${ra(OUT['14-pr-sol'])}

<h3>📌 Summary</h3>
<ul>
<li>Split a build into checking (<code>tsc --noEmit</code>, whole-program) and transpiling (fast, per-file).</li>
<li>A per-file transpiler cannot tell a type from a value across files.</li>
<li><code>verbatimModuleSyntax</code> makes a plain re-export of a type TS1205 — write <code>export type</code>.</li>
<li>Fix those and any fast transpiler can emit your code; the checker and the emitter never disagree.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TSConfig — verbatimModuleSyntax', 'Why a type re-export must say so. Read 4 Nov 2026.', 'https://www.typescriptlang.org/tsconfig/#verbatimModuleSyntax')}
${nguon('📘', 'TSConfig — isolatedModules', 'Checking that each file transpiles alone. Read 4 Nov 2026.', 'https://www.typescriptlang.org/tsconfig/#isolatedModules')}
${lienKet({ khoa: 'typescript', bai: 'typescript-10-1-es-modules', title: 'The module syntax underneath — TypeScript 10.1: ES modules', sub: 'Same: <code>import</code> / <code>export</code> move names between files. Different: there you learn the module system and <code>import type</code>; here that same <code>type</code> marker is what lets a per-file transpiler emit a file without reading the others — a plain type re-export is TS1205.', cta: 'OPEN TYPESCRIPT LESSON →' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.3</span>
<h2>Tách kiểm kiểu khỏi transpile</h2>
<p class="lead">Hai việc khác nhau ẩn trong “compile”: <em>kiểm</em> các kiểu (chậm, cần cả chương trình) và <em>transpile</em> sang JavaScript (nhanh, từng tệp một). Build hiện đại tách chúng — một transpiler nhanh từng-tệp (esbuild, swc, type-stripping của Node) phát ra code, còn <code>tsc --noEmit</code> kiểm kiểu song song. Để an toàn, mỗi tệp phải transpile được một mình.</p>

<h3>Một transpiler từng-tệp không đọc kiểu qua các tệp</h3>
<p>Một transpiler thấy một tệp mỗi lần; nó không nhìn vào <code>./model.ts</code> để biết <code>Booking</code> là một kiểu còn <code>VERSION</code> là một giá trị. Nên một re-export thường là mơ hồ:</p>
${ma('ts', CODE.reexport)}
${ra(OUT['11-reexport'])}
<p><strong>TS1205</strong> — dưới <code>verbatimModuleSyntax</code>, tsc từ chối một <code>export { Booking }</code> thường của một kiểu. Nó không transpile được từng-tệp, nên ở đây là một lỗi.</p>

<h3>export type làm ý định tường minh</h3>
<p>Viết <code>export type { Booking }</code> và giữ re-export giá trị thường:</p>
${ma('ts', CODE.okReexport)}
${ra(OUT['12-ok'])}
<p>Giờ ý định nằm trên chính dòng đó: một transpiler có thể xoá một re-export <code>type</code> và giữ một re-export giá trị, không cần phân tích chéo tệp. Lỗi là trình biên dịch ép sự-sẵn-sàng-transpile — <code>verbatimModuleSyntax</code> (và <code>isolatedModules</code> cũ hơn) kiểm rằng mỗi tệp có thể transpile một mình.</p>

<h3>Nhìn nhanh</h3>
${KV_VI}

<h3>🧪 Luyện tập</h3>
<p>Một module làm <code>export { Lab }</code> nơi <code>Lab</code> là một kiểu:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['13-pr-start'])}
<p>Viết <code>export type { Lab }</code> và nó biên dịch (exit 0):</p>
${ma('ts', CODE.prSol)}
${ra(OUT['14-pr-sol'])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Tách một build thành kiểm (<code>tsc --noEmit</code>, toàn chương trình) và transpile (nhanh, từng tệp).</li>
<li>Một transpiler từng-tệp không phân biệt được kiểu với giá trị qua các tệp.</li>
<li><code>verbatimModuleSyntax</code> làm một re-export thường của một kiểu thành TS1205 — viết <code>export type</code>.</li>
<li>Sửa chúng và bất kỳ transpiler nhanh nào cũng phát code của bạn; bộ kiểm và bộ phát không bất đồng.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TSConfig — verbatimModuleSyntax', 'Vì sao một re-export kiểu phải nói vậy. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/tsconfig/#verbatimModuleSyntax')}
${nguon('📘', 'TSConfig — isolatedModules', 'Kiểm rằng mỗi tệp transpile một mình. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/tsconfig/#isolatedModules')}
${lienKet({ khoa: 'typescript', bai: 'typescript-10-1-es-modules', title: 'Cú pháp module bên dưới — TypeScript 10.1: ES module', sub: 'Giống: <code>import</code> / <code>export</code> chuyển tên giữa các tệp. Khác: ở đó bạn học hệ module và <code>import type</code>; ở đây chính cái dấu <code>type</code> đó là thứ cho một transpiler từng-tệp phát một tệp mà không đọc các tệp khác — một re-export kiểu thường là TS1205.', cta: 'MỞ BÀI TYPESCRIPT →' })}
</div>
`,
};
