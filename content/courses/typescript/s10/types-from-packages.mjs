/**
 * TypeScript · Chương 10 · 10.4 — Getting types from packages. Slug giữ: typescript-10-4-types-from-packages.
 * Code/output từ ./_ma-ts-10-4.mjs (demo10/ts-10-4, Node 22.23.3 + tsc 7.0.2). Soạn lại TRỌN 04/11/2026.
 */
import G from '../giang/ts-10-4.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-10-4.mjs';

const KV_EN = `<div class="kv-grid">
  <div class="kv"><span class="k">bundled types</span><span class="v">The package ships its own <code>.d.ts</code> (a <code>types</code> field in package.json).</span></div>
  <div class="kv"><span class="k">@types</span><span class="v">DefinitelyTyped — <code>npm i -D @types/the-package</code>.</span></div>
  <div class="kv"><span class="k">write your own</span><span class="v">A <code>declare module</code> or sidecar <code>.d.ts</code> (10.2, Lab 10).</span></div>
  <div class="kv"><span class="k">how TS finds them</span><span class="v">The <code>types</code> field → an <code>@types</code> package → nothing (TS7016).</span></div>
  <div class="kv"><span class="k">real, not decoration</span><span class="v">A wrong call into a typed package is TS2345.</span></div>
</div>`;
const KV_VI = `<div class="kv-grid">
  <div class="kv"><span class="k">kiểu đóng gói sẵn</span><span class="v">Package giao <code>.d.ts</code> của chính nó (một trường <code>types</code> trong package.json).</span></div>
  <div class="kv"><span class="k">@types</span><span class="v">DefinitelyTyped — <code>npm i -D @types/the-package</code>.</span></div>
  <div class="kv"><span class="k">tự viết</span><span class="v">Một <code>declare module</code> hay sidecar <code>.d.ts</code> (10.2, Lab 10).</span></div>
  <div class="kv"><span class="k">TS tìm chúng ra sao</span><span class="v">Trường <code>types</code> → một package <code>@types</code> → không có (TS7016).</span></div>
  <div class="kv"><span class="k">thật, không trang trí</span><span class="v">Một lời gọi sai vào một package có kiểu là TS2345.</span></div>
</div>`;

export default {
  title: '10.4 — Getting types from packages|||10.4 — Lấy kiểu từ package',
  slug: 'typescript-10-4-types-from-packages',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Phần lớn kiểu bạn dùng đi cùng các package bạn cài. node:path giao kiểu qua @types/node (join có kiểu, gọi sai ⇒ TS2345). TypeScript tìm kiểu của một package qua trường "types" trong package.json (trỏ vào một .d.ts); không có thì tìm một package @types. Ba kết cục: đóng gói sẵn · @types · tự viết declare module. Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.4</span>
<h2>Getting types from packages</h2>
<p class="lead">Most of the types you use you did not write — they come with the packages you install. This lesson is how that works: how a package carries types, how TypeScript finds them, and what to do when a package has none. It is the consumer side of everything 10.2 and 10.3 taught you to produce.</p>

<h3>Bundled types: node:path</h3>
<p><code>node:path</code> ships its types through <code>@types/node</code>, so <code>join</code> is fully typed with no setup:</p>
${ma('ts', CODE.bundledApp)}
${ra(OUT['11-bundled'])}
<p>This is the common case — you import, and the types are already there. You only notice the machinery when it is missing.</p>

<h3>The types are real — a wrong call is caught</h3>
<p>Because <code>join</code> is typed, passing a number where it wants a string is refused:</p>
${ma('ts', CODE.bundledbadApp)}
${ra(OUT['12-bundled-bad'])}
<p><strong>TS2345</strong>. The types that came with the package are not decoration; they are the same checks you would get from code you wrote yourself. A typed dependency protects your call sites exactly like a typed function in your own module.</p>

<h3>How TypeScript finds a package’s types</h3>
<p>When you import a package, TypeScript looks for a <code>types</code> field in its <code>package.json</code> and reads the <code>.d.ts</code> it points at:</p>
${ma('json', CODE.localpkgPkg)}
${ma('ts', CODE.localpkgDts)}
${ma('ts', CODE.localpkgApp)}
${ra(OUT['13-localpkg'])}
<p>A local <code>labflow-ids</code> package with a <code>types</code> field pointing at <code>index.d.ts</code> is fully typed from the import. If there is no <code>types</code> field, TypeScript looks for an <code>@types</code> package next; if that is missing too, it is TS7016 and you write the declaration yourself.</p>

<h3>Bundled, @types, or your own</h3>
${KV_EN}

<h3>🧪 Practice</h3>
<p>A call to <code>path.join</code> with a number is TS2345:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['14-pr-start'])}
<p>Pass a string and it runs:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['15-pr-sol'])}

<h3>📌 Summary</h3>
<ul>
<li>Most types come with packages; <code>node:path</code> is typed via <code>@types/node</code>, and a wrong call is TS2345.</li>
<li>TypeScript finds a package’s types via the <code>types</code> field in <code>package.json</code>.</li>
<li>No <code>types</code> field? It looks for an <code>@types</code> package; none? You write a declaration (10.2).</li>
<li>Three outcomes: bundled, from <code>@types</code>, or your own — know which to install, write, or just use.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Consuming & Publishing types', 'The types field and how a package ships declarations. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html')}
${nguon('📘', 'DefinitelyTyped — @types packages', 'Where community types for untyped packages live. Read 4 Nov 2026.', 'https://github.com/DefinitelyTyped/DefinitelyTyped')}
${lienKet({ khoa: 'prisma-orm', bai: 'pr-8-1-kieu-nen-import', title: 'Importing the types a tool generated — Prisma ORM 8.1: the types to import', sub: 'Same: a package or tool ships declarations and you import the types it produced. Different: there the types come from Prisma’s generated client (and you learn which to import and how they are named); here it is the general rule — the <code>types</code> field, an <code>@types</code> package, or a declaration you write — that every typed dependency follows.', cta: 'OPEN PRISMA ORM LESSON →' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.4</span>
<h2>Lấy kiểu từ package</h2>
<p class="lead">Phần lớn kiểu bạn dùng không do bạn viết — chúng đi cùng các package bạn cài. Bài này là cách đó chạy: một package mang kiểu thế nào, TypeScript tìm chúng ra sao, và làm gì khi một package không có. Đó là phía người dùng của mọi thứ 10.2 và 10.3 đã dạy bạn tạo ra.</p>

<h3>Kiểu đóng gói sẵn: node:path</h3>
<p><code>node:path</code> giao kiểu qua <code>@types/node</code>, nên <code>join</code> có kiểu đầy đủ mà không cần cài gì:</p>
${ma('ts', CODE.bundledApp)}
${ra(OUT['11-bundled'])}
<p>Đây là trường hợp thường — bạn import, và kiểu đã ở đó. Bạn chỉ để ý bộ máy khi nó thiếu.</p>

<h3>Kiểu là thật — một lời gọi sai bị bắt</h3>
<p>Vì <code>join</code> có kiểu, đưa một number vào chỗ nó muốn một string bị từ chối:</p>
${ma('ts', CODE.bundledbadApp)}
${ra(OUT['12-bundled-bad'])}
<p><strong>TS2345</strong>. Kiểu đi cùng package không phải trang trí; chúng là cùng phép kiểm bạn có từ code bạn tự viết. Một dependency có kiểu bảo vệ các chỗ gọi của bạn đúng như một hàm có kiểu trong module của chính bạn.</p>

<h3>TypeScript tìm kiểu của một package ra sao</h3>
<p>Khi bạn import một package, TypeScript tìm một trường <code>types</code> trong <code>package.json</code> của nó và đọc <code>.d.ts</code> nó trỏ tới:</p>
${ma('json', CODE.localpkgPkg)}
${ma('ts', CODE.localpkgDts)}
${ma('ts', CODE.localpkgApp)}
${ra(OUT['13-localpkg'])}
<p>Một package <code>labflow-ids</code> cục bộ với một trường <code>types</code> trỏ vào <code>index.d.ts</code> có kiểu đầy đủ từ import. Nếu không có trường <code>types</code>, TypeScript tìm một package <code>@types</code> tiếp theo; nếu cái đó cũng thiếu, đó là TS7016 và bạn tự viết khai báo.</p>

<h3>Đóng gói sẵn, @types, hay tự viết</h3>
${KV_VI}

<h3>🧪 Luyện tập</h3>
<p>Một lời gọi <code>path.join</code> với một number là TS2345:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['14-pr-start'])}
<p>Đưa một string và nó chạy:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['15-pr-sol'])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Phần lớn kiểu đi cùng package; <code>node:path</code> có kiểu qua <code>@types/node</code>, và một lời gọi sai là TS2345.</li>
<li>TypeScript tìm kiểu của một package qua trường <code>types</code> trong <code>package.json</code>.</li>
<li>Không có trường <code>types</code>? Nó tìm một package <code>@types</code>; không có? Bạn viết một khai báo (10.2).</li>
<li>Ba kết cục: đóng gói sẵn, từ <code>@types</code>, hay tự viết — biết cái nào cài, viết, hay cứ dùng.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Consuming & Publishing types', 'Trường types và một package giao khai báo ra sao. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html')}
${nguon('📘', 'DefinitelyTyped — @types packages', 'Nơi kiểu cộng đồng cho các package không kiểu sống. Đọc ngày 4/11/2026.', 'https://github.com/DefinitelyTyped/DefinitelyTyped')}
${lienKet({ khoa: 'prisma-orm', bai: 'pr-8-1-kieu-nen-import', title: 'Import kiểu một công cụ đã sinh — Prisma ORM 8.1: các kiểu nên import', sub: 'Giống: một package hay công cụ giao khai báo và bạn import kiểu nó tạo ra. Khác: ở đó kiểu đến từ client Prisma sinh (và bạn học nên import cái nào, đặt tên ra sao); ở đây là luật chung — trường <code>types</code>, một package <code>@types</code>, hay một khai báo bạn viết — mà mọi dependency có kiểu đi theo.', cta: 'MỞ BÀI PRISMA ORM →' })}
</div>
`,
};
