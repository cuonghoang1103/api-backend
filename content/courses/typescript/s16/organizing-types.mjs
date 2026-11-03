/**
 * TypeScript · Chương 16 · 16.3 — Organizing types. Slug giữ: typescript-16-3-organizing-types.
 * Code/output từ ./_ma-ts-16-3.mjs (demo16/ts-16-3, Node 22.23.3 + tsc 7.0.2). Soạn lại TRỌN 04/11/2026.
 */
import G from '../giang/ts-16-3.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-16-3.mjs';

const KV_EN = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>type</code></span><span class="v">A single definition — redeclaring is TS2300.</span></div>
  <div class="kv"><span class="k">use <code>type</code> for</span><span class="v">Unions, tuples, mapped & conditional types.</span></div>
  <div class="kv"><span class="k"><code>interface</code></span><span class="v">Merges on redeclaration — the mechanism behind augmentation.</span></div>
  <div class="kv"><span class="k">use <code>interface</code> for</span><span class="v">Object shapes you may extend or augment.</span></div>
  <div class="kv"><span class="k">one source</span><span class="v">Keep a type next to what it describes; re-export via one barrel.</span></div>
</div>`;
const KV_VI = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>type</code></span><span class="v">Một định nghĩa duy nhất — khai lại là TS2300.</span></div>
  <div class="kv"><span class="k">dùng <code>type</code> cho</span><span class="v">Union, tuple, mapped & conditional type.</span></div>
  <div class="kv"><span class="k"><code>interface</code></span><span class="v">Gộp khi khai lại — cơ chế đằng sau augmentation.</span></div>
  <div class="kv"><span class="k">dùng <code>interface</code> cho</span><span class="v">Dáng object bạn có thể mở rộng hay augment.</span></div>
  <div class="kv"><span class="k">một nguồn</span><span class="v">Giữ một kiểu cạnh thứ nó mô tả; re-export qua một barrel.</span></div>
</div>`;

export default {
  title: '16.3 — Organizing types|||16.3 — Tổ chức kiểu',
  slug: 'typescript-16-3-organizing-types',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Khi codebase lớn dần, kiểu sống ở đâu quan trọng ngang với nó nói gì. type alias là một định nghĩa duy nhất (khai type User hai lần ⇒ TS2300) — dùng cho union/tuple/mapped/conditional. Hai interface cùng tên GỘP — cơ chế đằng sau augmentation (Request.user Chương 10); dùng cho dáng object bạn có thể mở rộng. Giữ một kiểu cạnh thứ nó mô tả, re-export các cái công khai qua một barrel (export type) để không hai tệp sở hữu cùng một dáng. Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.3</span>
<h2>Organizing types</h2>
<p class="lead">As a codebase grows, where types live matters as much as what they say. Two questions come up again and again: <code>type</code> or <code>interface</code>? And where should a shared type sit so everyone imports the same one? A few conventions keep a large project’s types tidy and its imports honest.</p>

<h3>type vs interface: redeclaration</h3>
<p>A <code>type</code> alias is a single definition — declare it twice and it is refused:</p>
${ma('ts', CODE.typeredecl)}
${ra(OUT['11-typeredecl'])}
<p><strong>TS2300</strong>, a duplicate identifier. That is usually what you want: one name, one shape. Use <code>type</code> for unions, tuples, mapped and conditional types — everything that is not just an object shape.</p>

<h3>interface: declaration merging</h3>
<p>Two interfaces of the same name <em>merge</em> into one:</p>
${ma('ts', CODE.interfacemerge)}
${ra(OUT['12-interfacemerge'])}
<p>It looks like a footgun, but it is the mechanism behind augmentation (Chapter 10’s <code>Request.user</code>): a library declares <code>interface Request</code>, and you add fields from your own file without touching its source. Use <code>interface</code> for object shapes you might extend or augment.</p>

<h3>Where types live</h3>
<p>A shared type belongs next to the thing it describes — the model’s type beside the model, a DTO beside its route. Re-export the public ones through a barrel (<code>export type</code> from 15.3) so every consumer imports the same name from one place. A type imported from two files is two types that will drift; one source, one import.</p>

<h3>At a glance</h3>
${KV_EN}

<h3>🧪 Practice</h3>
<p>A <code>type Lab</code> is declared twice:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['13-pr-start'])}
<p>Merge the two shapes into one definition and it runs:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['14-pr-sol'])}

<h3>📌 Summary</h3>
<ul>
<li><code>type</code> is a single definition — redeclaring is TS2300; use it for unions, tuples, mapped/conditional types.</li>
<li><code>interface</code> merges on redeclaration — use it for object shapes you may extend or augment.</li>
<li>Keep a type next to what it describes, and re-export public ones through one barrel.</li>
<li>No two files should own the same shape — one source, one import, no drift.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Interfaces vs Type Aliases', 'When to use each. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces')}
${nguon('📘', 'TypeScript Handbook — Declaration Merging', 'How interfaces of the same name merge. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/declaration-merging.html')}
${lienKet({ khoa: 'typescript', bai: 'typescript-10-3-augmentation', title: 'Where merging pays off — TypeScript 10.3: Augmentation', sub: 'Same: two interfaces of the same name merge into one. Different: there you use it to add <code>user</code> to Express’s <code>Request</code> from your own file; here it is the organizing rule — <code>interface</code> for shapes you augment, <code>type</code> (a single definition, TS2300 if redeclared) for everything else.', cta: 'OPEN TYPESCRIPT LESSON →' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.3</span>
<h2>Tổ chức kiểu</h2>
<p class="lead">Khi một codebase lớn dần, kiểu sống ở đâu quan trọng ngang với nó nói gì. Hai câu hỏi lặp lại mãi: <code>type</code> hay <code>interface</code>? Và một kiểu dùng chung nên nằm đâu để mọi người import cùng một cái? Vài quy ước giữ kiểu của một dự án lớn gọn gàng và import của nó trung thực.</p>

<h3>type so với interface: khai lại</h3>
<p>Một <code>type</code> alias là một định nghĩa duy nhất — khai nó hai lần và bị từ chối:</p>
${ma('ts', CODE.typeredecl)}
${ra(OUT['11-typeredecl'])}
<p><strong>TS2300</strong>, một định danh trùng. Đó thường là thứ bạn muốn: một tên, một dáng. Dùng <code>type</code> cho union, tuple, mapped và conditional type — mọi thứ không chỉ là một dáng object.</p>

<h3>interface: gộp khai báo</h3>
<p>Hai interface cùng tên <em>gộp</em> thành một:</p>
${ma('ts', CODE.interfacemerge)}
${ra(OUT['12-interfacemerge'])}
<p>Nó trông như một cái bẫy, nhưng là cơ chế đằng sau augmentation (<code>Request.user</code> của Chương 10): một thư viện khai <code>interface Request</code>, và bạn thêm trường từ tệp của mình mà không đụng source nó. Dùng <code>interface</code> cho dáng object bạn có thể mở rộng hay augment.</p>

<h3>Kiểu sống ở đâu</h3>
<p>Một kiểu dùng chung thuộc về cạnh thứ nó mô tả — kiểu của model cạnh model, một DTO cạnh route của nó. Re-export các cái công khai qua một barrel (<code>export type</code> của 15.3) để mọi bên tiêu thụ import cùng một tên từ một chỗ. Một kiểu import từ hai tệp là hai kiểu sẽ trôi; một nguồn, một import.</p>

<h3>Nhìn nhanh</h3>
${KV_VI}

<h3>🧪 Luyện tập</h3>
<p>Một <code>type Lab</code> được khai hai lần:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['13-pr-start'])}
<p>Gộp hai dáng thành một định nghĩa và nó chạy:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['14-pr-sol'])}

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>type</code> là một định nghĩa duy nhất — khai lại là TS2300; dùng cho union, tuple, mapped/conditional.</li>
<li><code>interface</code> gộp khi khai lại — dùng cho dáng object bạn có thể mở rộng hay augment.</li>
<li>Giữ một kiểu cạnh thứ nó mô tả, và re-export các cái công khai qua một barrel.</li>
<li>Không hai tệp nào nên sở hữu cùng một dáng — một nguồn, một import, không trôi.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Interfaces vs Type Aliases', 'Khi nào dùng mỗi cái. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces')}
${nguon('📘', 'TypeScript Handbook — Declaration Merging', 'Cách interface cùng tên gộp. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/declaration-merging.html')}
${lienKet({ khoa: 'typescript', bai: 'typescript-10-3-augmentation', title: 'Nơi gộp phát huy — TypeScript 10.3: Augmentation', sub: 'Giống: hai interface cùng tên gộp thành một. Khác: ở đó bạn dùng nó để thêm <code>user</code> vào <code>Request</code> của Express từ tệp của mình; ở đây nó là luật tổ chức — <code>interface</code> cho dáng bạn augment, <code>type</code> (một định nghĩa duy nhất, TS2300 nếu khai lại) cho phần còn lại.', cta: 'MỞ BÀI TYPESCRIPT →' })}
</div>
`,
};
