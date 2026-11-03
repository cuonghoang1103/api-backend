/**
 * TypeScript · Chương 10 · 10.1 — ES modules & the type boundary. Slug giữ: typescript-10-1-es-modules.
 * BÀI MỞ CHƯƠNG 10 (soạn lại TRỌN 04/11/2026). Code/output từ ./_ma-ts-10-1.mjs (demo10/ts-10-1, Node 22.23.3 + tsc 7.0.2).
 */
import G from '../giang/ts-10-1.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-10-1.mjs';

const KV_EN = `<div class="kv-grid">
  <div class="kv"><span class="k">named export</span><span class="v"><code>export function add</code> — imported by its name.</span></div>
  <div class="kv"><span class="k">default export</span><span class="v"><code>export default</code> — imported under any name.</span></div>
  <div class="kv"><span class="k">type export</span><span class="v"><code>export type</code> — crosses the boundary for the compiler only.</span></div>
  <div class="kv"><span class="k"><code>import type</code></span><span class="v">The whole import is erased — required for a type under verbatimModuleSyntax.</span></div>
  <div class="kv"><span class="k">the boundary</span><span class="v">Values exist at run time; types only at compile time.</span></div>
</div>`;
const KV_VI = `<div class="kv-grid">
  <div class="kv"><span class="k">named export</span><span class="v"><code>export function add</code> — import theo tên.</span></div>
  <div class="kv"><span class="k">default export</span><span class="v"><code>export default</code> — import dưới tên bất kỳ.</span></div>
  <div class="kv"><span class="k">type export</span><span class="v"><code>export type</code> — qua biên giới chỉ cho trình biên dịch.</span></div>
  <div class="kv"><span class="k"><code>import type</code></span><span class="v">Cả import bị xoá — bắt buộc cho một kiểu dưới verbatimModuleSyntax.</span></div>
  <div class="kv"><span class="k">biên giới</span><span class="v">Giá trị tồn tại lúc chạy; kiểu chỉ lúc biên dịch.</span></div>
</div>`;

export default {
  title: '10.1 — ES modules & the type boundary|||10.1 — ES module & biên giới kiểu',
  slug: 'typescript-10-1-es-modules',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mở Chương 10: kiểu đi qua các biên giới (tệp, package, môi trường chạy). Một module export named + default + type; bên dùng import giá trị và kiểu. Kiểu và giá trị đi cùng cú pháp import nhưng chỉ giá trị tồn tại lúc chạy — kiểu bị xoá. Dưới verbatimModuleSyntax (config khoá), import một kiểu như một giá trị là TS1484; import type nói "xoá cả import". Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>ES modules &amp; the type boundary</h2>
<p class="lead">The last chapters typed code inside one project; the next few move types across boundaries — between files, packages and runtimes. It starts with the module system: how a value and a type leave one file and enter another. The key idea is that types and values travel the same import, but only values exist at run time.</p>

<h3>After Chapter 10 you can…</h3>
<ul>
<li>Bring types across a module boundary with <code>import type</code> (this lesson).</li>
<li>Write a <code>.d.ts</code> for an untyped JavaScript package (10.2).</li>
<li>Augment a global or a library type like <code>Request.user</code> (10.3).</li>
<li>Know how a package ships its types (10.4), and write a declaration for a real JS module (Lab 10).</li>
</ul>

<h3>Exporting: named, default, and types</h3>
<p>One module exports a named function, a default function, and a type:</p>
${ma('ts', CODE.exportsMoney)}
<p>The consumer imports the default and the named value together, and the type separately:</p>
${ma('ts', CODE.exportsApp)}
${ra(OUT['11-exports'])}
<p>The <code>Money</code> type is for the compiler only — it is erased before the code runs, which is why it crosses the boundary differently from a value.</p>

<h3>Importing — and import type</h3>
<p>Under <code>verbatimModuleSyntax</code> (the course config), importing a type as if it were a value is refused:</p>
${ma('ts', CODE.importtypeBad)}
${ra(OUT['12-importtype-bad'])}
<p><strong>TS1484</strong>: <code>import type</code> says “this is a type, erase the whole import” — so the compiler never emits an import that does not exist at run time. It is the explicit boundary between what the type-checker sees and what Node runs.</p>

<h3>The module boundary, at a glance</h3>
${KV_EN}

<h3>🧪 Practice</h3>
<p>A <code>Role</code> type imported as a value is TS1484:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['13-pr-start'])}
<p>Change it to <code>import type</code> and it compiles and runs:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['14-pr-sol'])}

<h3>📌 Summary</h3>
<ul>
<li>A module exports named values, a default, and types; the consumer imports each in kind.</li>
<li>Values and types share the import syntax but live in different worlds — values at run time, types at compile time.</li>
<li>Under <code>verbatimModuleSyntax</code>, a type imported as a value is TS1484; <code>import type</code> fixes it.</li>
<li>Getting this boundary right is what lets types travel into declaration files, augmentations and packages.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Modules', 'export, import, and the module boundary. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/modules.html')}
${nguon('📘', 'TypeScript — verbatimModuleSyntax', 'Why a type must be imported with import type. Read 4 Nov 2026.', 'https://www.typescriptlang.org/tsconfig/#verbatimModuleSyntax')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>ES module &amp; biên giới kiểu</h2>
<p class="lead">Các chương trước gõ kiểu bên trong một dự án; vài chương tới đưa kiểu qua các biên giới — giữa tệp, package và môi trường chạy. Bắt đầu từ hệ module: một giá trị và một kiểu rời một tệp và vào một tệp khác ra sao. Ý chính: kiểu và giá trị đi cùng một import, nhưng chỉ giá trị tồn tại lúc chạy.</p>

<h3>Sau Chương 10 bạn có thể…</h3>
<ul>
<li>Đưa kiểu qua một biên giới module bằng <code>import type</code> (bài này).</li>
<li>Viết một <code>.d.ts</code> cho một package JavaScript không kiểu (10.2).</li>
<li>Bổ sung một kiểu toàn cục hay kiểu thư viện như <code>Request.user</code> (10.3).</li>
<li>Biết một package giao kiểu ra sao (10.4), và viết một khai báo cho một module JS thật (Lab 10).</li>
</ul>

<h3>Export: named, default, và kiểu</h3>
<p>Một module export một hàm named, một hàm default, và một kiểu:</p>
${ma('ts', CODE.exportsMoney)}
<p>Bên dùng import default và giá trị named cùng nhau, và kiểu riêng:</p>
${ma('ts', CODE.exportsApp)}
${ra(OUT['11-exports'])}
<p>Kiểu <code>Money</code> chỉ cho trình biên dịch — nó bị xoá trước khi code chạy, vì thế nó qua biên giới khác với một giá trị.</p>

<h3>Import — và import type</h3>
<p>Dưới <code>verbatimModuleSyntax</code> (config của khoá), import một kiểu như thể nó là một giá trị bị từ chối:</p>
${ma('ts', CODE.importtypeBad)}
${ra(OUT['12-importtype-bad'])}
<p><strong>TS1484</strong>: <code>import type</code> nói “đây là một kiểu, xoá cả import” — nên trình biên dịch không bao giờ sinh một import không tồn tại lúc chạy. Đó là biên giới tường minh giữa thứ bộ kiểm thấy và thứ Node chạy.</p>

<h3>Biên giới module, nhìn nhanh</h3>
${KV_VI}

<h3>🧪 Luyện tập</h3>
<p>Một kiểu <code>Role</code> import như một giá trị là TS1484:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['13-pr-start'])}
<p>Đổi thành <code>import type</code> và nó biên dịch và chạy:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['14-pr-sol'])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một module export giá trị named, một default, và kiểu; bên dùng import mỗi cái đúng loại.</li>
<li>Giá trị và kiểu dùng chung cú pháp import nhưng sống ở hai thế giới — giá trị lúc chạy, kiểu lúc biên dịch.</li>
<li>Dưới <code>verbatimModuleSyntax</code>, một kiểu import như một giá trị là TS1484; <code>import type</code> sửa nó.</li>
<li>Làm đúng biên giới này là thứ cho kiểu đi vào tệp khai báo, bổ sung và package.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Modules', 'export, import, và biên giới module. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/modules.html')}
${nguon('📘', 'TypeScript — verbatimModuleSyntax', 'Vì sao một kiểu phải import bằng import type. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/tsconfig/#verbatimModuleSyntax')}
</div>
`,
};
