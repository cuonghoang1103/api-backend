/**
 * TypeScript · Chương 10 · 10.2 — Declaration files (.d.ts). Slug giữ: typescript-10-2-declaration-files.
 * Code/output từ ./_ma-ts-10-2.mjs (demo10/ts-10-2, Node 22.23.3 + tsc 7.0.2). Soạn lại TRỌN 04/11/2026.
 */
import G from '../giang/ts-10-2.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-10-2.mjs';

const KV_EN = `<div class="kv-grid">
  <div class="kv"><span class="k">.d.ts</span><span class="v">Pure type: no bodies, no runtime code — just the shape of some JavaScript.</span></div>
  <div class="kv"><span class="k">untyped import</span><span class="v">TS7016 under strict — the value would otherwise be any.</span></div>
  <div class="kv"><span class="k">sidecar</span><span class="v">A <code>slug.d.ts</code> next to <code>slug.js</code> — tsc reads it, Node runs the .js.</span></div>
  <div class="kv"><span class="k"><code>declare module</code></span><span class="v">Type a package by its bare import name.</span></div>
  <div class="kv"><span class="k">three ways</span><span class="v">Bundled · from <code>@types</code> · written by you.</span></div>
</div>`;
const KV_VI = `<div class="kv-grid">
  <div class="kv"><span class="k">.d.ts</span><span class="v">Thuần kiểu: không thân hàm, không code lúc chạy — chỉ dáng của một ít JavaScript.</span></div>
  <div class="kv"><span class="k">import không kiểu</span><span class="v">TS7016 dưới strict — giá trị lẽ ra là any.</span></div>
  <div class="kv"><span class="k">sidecar</span><span class="v">Một <code>slug.d.ts</code> cạnh <code>slug.js</code> — tsc đọc nó, Node chạy .js.</span></div>
  <div class="kv"><span class="k"><code>declare module</code></span><span class="v">Gõ kiểu một package theo tên import trần.</span></div>
  <div class="kv"><span class="k">ba đường</span><span class="v">Đóng gói sẵn · từ <code>@types</code> · bạn tự viết.</span></div>
</div>`;

export default {
  title: '10.2 — Declaration files (.d.ts)|||10.2 — File khai báo (.d.ts)',
  slug: 'typescript-10-2-declaration-files',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Một .d.ts cho kiểu một JavaScript không kiểu mà không chạm vào code: kiểu một bên, code chạy một bên. Import một .js không khai báo dưới strict là TS7016 (giá trị lẽ ra any). Một sidecar slug.d.ts cạnh slug.js ⇒ tsc đọc kiểu, Node chạy .js. declare module "tên" gõ kiểu một package theo tên trần (không có ⇒ TS2307). Ba đường một package có kiểu: đóng gói sẵn · @types · tự viết. Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>Declaration files (.d.ts)</h2>
<p class="lead">A lot of JavaScript in the world has no types — an old package, a vendored script, a file your team never migrated. A declaration file, <code>.d.ts</code>, is how you give it types without touching the JavaScript: types on one side, the running code on the other. It is the same split you saw with <code>import type</code>, now across a whole module.</p>

<h3>The problem: an untyped import is unknown</h3>
<p>Import a <code>.js</code> file with no declaration and tsc has nothing to go on:</p>
${ma('ts', CODE.nodtsApp)}
${ra(OUT['12-nodts'])}
<p><strong>TS7016</strong>, “could not find a declaration file” — the value would otherwise be <code>any</code>, and a single untyped import turns off every check downstream of it.</p>

<h3>Sidecar .d.ts for a relative file</h3>
<p>Here is the JavaScript (it runs unchanged) and the declaration beside it:</p>
${ma('js', CODE.sidecarJs)}
${ma('ts', CODE.sidecarDts)}
<p>Now the import is fully typed — tsc reads the <code>.d.ts</code>, Node runs the <code>.js</code>:</p>
${ma('ts', CODE.sidecarApp)}
${ra(OUT['11-sidecar'])}
<p>The declaration describes the shape; the <code>.js</code> provides the behaviour.</p>

<h3>declare module: type a package by name</h3>
<p>For a package you import by a bare name, <code>declare module</code> gives it types by its import name:</p>
${ma('ts', CODE.declaremoduleTypes)}
${ma('ts', CODE.declaremoduleApp)}
${ra(OUT['13-declaremodule'])}
<p>Without it, the bare import is TS2307, “cannot find module”. The ambient declaration lives in a <code>.d.ts</code> anywhere in the project and the compiler finds it — one block, and an untyped dependency is usable.</p>

<h3>Three ways a package gets types</h3>
${KV_EN}

<h3>🧪 Practice</h3>
<p>A <code>legacy.js</code> helper imported with no declaration is TS7016:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['14-pr-start'])}
<p>Add a <code>legacy.d.ts</code> beside it and the import is typed and runs:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['15-pr-sol'])}

<h3>📌 Summary</h3>
<ul>
<li>A <code>.d.ts</code> is pure type — it describes JavaScript without any runtime code.</li>
<li>An untyped import is TS7016 under strict; the value would otherwise be <code>any</code>.</li>
<li>A sidecar <code>.d.ts</code> types a relative <code>.js</code>; <code>declare module</code> types a bare-name package.</li>
<li>A package gets types three ways: bundled, from <code>@types</code>, or written by you (Lab 10).</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Declaration Files: Introduction', 'What a .d.ts is and when you write one. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html')}
${nguon('📘', 'TypeScript Handbook — Modules .d.ts (declare module)', 'Typing a package by its import name. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html')}
${lienKet({ khoa: 'prisma-orm', bai: 'pr-1-2-generate-viet-gi', title: 'A .d.ts generated for you — Prisma ORM 1.2: what prisma generate writes', sub: 'Same: a declaration file is how a library hands you types for code you did not write. Different: there Prisma writes the <code>.d.ts</code> for your database models, so your queries are typed from the schema; here you write the declaration by hand for a package that ships none — the producing side of the same mechanism.', cta: 'OPEN PRISMA ORM LESSON →' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>File khai báo (.d.ts)</h2>
<p class="lead">Rất nhiều JavaScript ngoài kia không có kiểu — một package cũ, một script vendor, một tệp nhóm bạn chưa chuyển. Một tệp khai báo, <code>.d.ts</code>, là cách bạn cho nó kiểu mà không chạm vào JavaScript: kiểu một bên, code chạy một bên. Đó là cùng phép tách bạn thấy với <code>import type</code>, giờ qua cả một module.</p>

<h3>Vấn đề: một import không kiểu là unknown</h3>
<p>Import một tệp <code>.js</code> không có khai báo và tsc không có gì để dựa:</p>
${ma('ts', CODE.nodtsApp)}
${ra(OUT['12-nodts'])}
<p><strong>TS7016</strong>, “không tìm thấy tệp khai báo” — giá trị lẽ ra là <code>any</code>, và một import không kiểu tắt mọi phép kiểm phía sau nó.</p>

<h3>Sidecar .d.ts cho một tệp tương đối</h3>
<p>Đây là JavaScript (chạy nguyên) và khai báo cạnh nó:</p>
${ma('js', CODE.sidecarJs)}
${ma('ts', CODE.sidecarDts)}
<p>Giờ import có kiểu đầy đủ — tsc đọc <code>.d.ts</code>, Node chạy <code>.js</code>:</p>
${ma('ts', CODE.sidecarApp)}
${ra(OUT['11-sidecar'])}
<p>Khai báo tả dáng; <code>.js</code> cung cấp hành vi.</p>

<h3>declare module: gõ kiểu một package theo tên</h3>
<p>Với một package bạn import bằng tên trần, <code>declare module</code> cho nó kiểu theo tên import:</p>
${ma('ts', CODE.declaremoduleTypes)}
${ma('ts', CODE.declaremoduleApp)}
${ra(OUT['13-declaremodule'])}
<p>Không có nó, import trần là TS2307, “không tìm thấy module”. Khai báo ambient nằm trong một <code>.d.ts</code> ở bất kỳ đâu trong dự án và trình biên dịch tìm ra — một khối, và một dependency không kiểu dùng được.</p>

<h3>Ba đường để một package có kiểu</h3>
${KV_VI}

<h3>🧪 Luyện tập</h3>
<p>Một helper <code>legacy.js</code> import mà không có khai báo là TS7016:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['14-pr-start'])}
<p>Thêm một <code>legacy.d.ts</code> cạnh nó và import có kiểu và chạy:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['15-pr-sol'])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một <code>.d.ts</code> thuần kiểu — nó tả JavaScript mà không có code lúc chạy.</li>
<li>Một import không kiểu là TS7016 dưới strict; giá trị lẽ ra là <code>any</code>.</li>
<li>Một sidecar <code>.d.ts</code> gõ kiểu một <code>.js</code> tương đối; <code>declare module</code> gõ kiểu một package tên trần.</li>
<li>Một package có kiểu ba đường: đóng gói sẵn, từ <code>@types</code>, hay bạn tự viết (Lab 10).</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Declaration Files: Introduction', 'Một .d.ts là gì và khi nào bạn viết. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html')}
${nguon('📘', 'TypeScript Handbook — Modules .d.ts (declare module)', 'Gõ kiểu một package theo tên import. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html')}
${lienKet({ khoa: 'prisma-orm', bai: 'pr-1-2-generate-viet-gi', title: 'Một .d.ts sinh sẵn cho bạn — Prisma ORM 1.2: prisma generate viết gì', sub: 'Giống: một tệp khai báo là cách một thư viện trao bạn kiểu cho code bạn không viết. Khác: ở đó Prisma viết <code>.d.ts</code> cho các model CSDL của bạn, nên truy vấn có kiểu từ schema; ở đây bạn tự viết khai báo cho một package không giao kiểu — phía tạo ra của cùng cơ chế.', cta: 'MỞ BÀI PRISMA ORM →' })}
</div>
`,
};
