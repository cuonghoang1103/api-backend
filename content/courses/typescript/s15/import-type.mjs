/**
 * TypeScript · Chương 15 · 15.4 — Trimming the module graph. Slug giữ: typescript-15-4-import-type.
 * Code/output từ ./_ma-ts-15-4.mjs (demo15/ts-15-4, Node 22.23.3 + tsc 7.0.2). Soạn lại TRỌN 04/11/2026.
 */
import G from '../giang/ts-15-4.mjs';
import { ma, ra, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-15-4.mjs';

const KV_EN = `<div class="kv-grid">
  <div class="kv"><span class="k">an import is an edge</span><span class="v">A file the build must load and follow.</span></div>
  <div class="kv"><span class="k">a type has none</span><span class="v">It exists only at compile time.</span></div>
  <div class="kv"><span class="k">value import of a type</span><span class="v">TS1484 — write <code>import type</code>.</span></div>
  <div class="kv"><span class="k"><code>import type</code> is erased</span><span class="v">No edge, no module loaded at run time.</span></div>
  <div class="kv"><span class="k">smaller graph</span><span class="v">Faster bundling, smaller output, no circular runtime edge.</span></div>
</div>`;
const KV_VI = `<div class="kv-grid">
  <div class="kv"><span class="k">một import là một cạnh</span><span class="v">Một tệp build phải nạp và đi theo.</span></div>
  <div class="kv"><span class="k">một kiểu không là cạnh</span><span class="v">Nó chỉ tồn tại lúc biên dịch.</span></div>
  <div class="kv"><span class="k">value-import một kiểu</span><span class="v">TS1484 — viết <code>import type</code>.</span></div>
  <div class="kv"><span class="k"><code>import type</code> bị xoá</span><span class="v">Không cạnh, không module nạp lúc chạy.</span></div>
  <div class="kv"><span class="k">đồ thị nhỏ hơn</span><span class="v">Bundle nhanh hơn, output nhỏ hơn, không cạnh vòng lúc chạy.</span></div>
</div>`;

export default {
  title: '15.4 — Trimming the module graph|||15.4 — Cắt gọn đồ thị module',
  slug: 'typescript-15-4-import-type',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Mỗi import là một cạnh trong đồ thị module của build — một tệp bundler phải nạp, parse và đi theo. Nhưng một type chỉ tồn tại lúc biên dịch; nó không nên để lại cạnh nào. import type nói đúng vậy, nên kiểu bị xoá và không kéo module của nó vào đồ thị lúc chạy. verbatimModuleSyntax làm một value-import của một kiểu thành TS1484 — viết import type. Trộn: import type cho dáng, import thường cho giá trị. Đồ thị nhỏ hơn, bundle nhỏ hơn, không cạnh vòng lúc chạy. Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.4</span>
<h2>Trimming the module graph</h2>
<p class="lead">Every <code>import</code> is an edge in your build’s module graph — a file the bundler must load, parse and follow. But a <code>type</code> you import exists only at compile time; it should leave no edge at all. <code>import type</code> says exactly that, so the type is erased and never pulls its module into the runtime graph.</p>

<h3>A value import of a type is refused</h3>
<p>Import a type with a plain <code>import { Booking }</code>:</p>
${ma('ts', CODE.use)}
${ra(OUT['11-valimport'])}
<p><strong>TS1484</strong> — under <code>verbatimModuleSyntax</code>, a type must be imported with <code>import type</code>. The plain import would survive to run time as an edge to a module that, after types are erased, might have nothing to export.</p>

<h3>import type is erased</h3>
<p>Split it: <code>import type</code> for the shape, plain <code>import</code> for the value:</p>
${ma('ts', CODE.okUse)}
${ra(OUT['12-ok'])}
<p>The <code>import type</code> disappears from the emitted JavaScript — no edge, no module loaded for a type that does not exist at run time. The runtime pulls in only the value you actually run.</p>

<h3>Smaller graph, faster everything</h3>
<p>A trimmed graph is faster at every stage: the bundler follows fewer edges, the output is smaller, and circular type dependencies (which would deadlock a runtime import) become harmless because the type edges are gone. It is also what makes the per-file transpile of 15.3 correct — a type import has nothing to emit.</p>

<h3>At a glance</h3>
${KV_EN}

<h3>🧪 Practice</h3>
<p>An app does <code>import { Lab, MAX }</code> where <code>Lab</code> is a type:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['13-pr-start'])}
<p>Split it into <code>import type { Lab }</code> and <code>import { MAX }</code> and it runs:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['14-pr-sol'])}

<h3>📌 Summary</h3>
<ul>
<li>Each <code>import</code> is a graph edge; a <code>type</code> import should be none.</li>
<li><code>verbatimModuleSyntax</code> makes a value import of a type TS1484 — write <code>import type</code>.</li>
<li><code>import type</code> is erased from the output: no module loaded for a compile-time-only type.</li>
<li>A smaller graph means faster bundling, a smaller bundle, and no accidental runtime edge — the build-performance chapter in one habit.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript 5.0 — verbatimModuleSyntax', 'import type / export type and why. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#verbatimmodulesyntax')}
${nguon('📘', 'TypeScript Handbook — Type-only imports', 'How import type is erased. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/modules/reference.html#type-only-imports-and-exports')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.4</span>
<h2>Cắt gọn đồ thị module</h2>
<p class="lead">Mỗi <code>import</code> là một cạnh trong đồ thị module của build — một tệp bundler phải nạp, parse và đi theo. Nhưng một <code>type</code> bạn import chỉ tồn tại lúc biên dịch; nó không nên để lại cạnh nào cả. <code>import type</code> nói đúng điều đó, nên kiểu bị xoá và không bao giờ kéo module của nó vào đồ thị lúc chạy.</p>

<h3>Một value-import của một kiểu bị từ chối</h3>
<p>Import một kiểu bằng một <code>import { Booking }</code> thường:</p>
${ma('ts', CODE.use)}
${ra(OUT['11-valimport'])}
<p><strong>TS1484</strong> — dưới <code>verbatimModuleSyntax</code>, một kiểu phải được import bằng <code>import type</code>. Import thường sẽ sống tới lúc chạy như một cạnh tới một module mà, sau khi kiểu bị xoá, có thể không còn gì để export.</p>

<h3>import type bị xoá</h3>
<p>Tách nó: <code>import type</code> cho dáng, <code>import</code> thường cho giá trị:</p>
${ma('ts', CODE.okUse)}
${ra(OUT['12-ok'])}
<p><code>import type</code> biến mất khỏi JavaScript phát ra — không cạnh, không module nào được nạp cho một kiểu không tồn tại lúc chạy. Lúc chạy chỉ kéo vào giá trị bạn thật sự chạy.</p>

<h3>Đồ thị nhỏ hơn, mọi thứ nhanh hơn</h3>
<p>Một đồ thị được cắt gọn nhanh hơn ở mọi khâu: bundler đi theo ít cạnh hơn, output nhỏ hơn, và phụ thuộc kiểu vòng (vốn sẽ kẹt một import lúc chạy) thành vô hại vì các cạnh kiểu đã mất. Nó cũng là thứ làm transpile từng-tệp của 15.3 đúng — một import kiểu không có gì để phát.</p>

<h3>Nhìn nhanh</h3>
${KV_VI}

<h3>🧪 Luyện tập</h3>
<p>Một app làm <code>import { Lab, MAX }</code> nơi <code>Lab</code> là một kiểu:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['13-pr-start'])}
<p>Tách thành <code>import type { Lab }</code> và <code>import { MAX }</code> và nó chạy:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['14-pr-sol'])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mỗi <code>import</code> là một cạnh đồ thị; một import <code>type</code> nên không là cạnh nào.</li>
<li><code>verbatimModuleSyntax</code> làm một value-import của một kiểu thành TS1484 — viết <code>import type</code>.</li>
<li><code>import type</code> bị xoá khỏi output: không module nào nạp cho một kiểu chỉ-lúc-biên-dịch.</li>
<li>Một đồ thị nhỏ hơn nghĩa là bundle nhanh hơn, bundle nhỏ hơn, và không cạnh lúc chạy do nhầm — chương hiệu năng build trong một thói quen.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript 5.0 — verbatimModuleSyntax', 'import type / export type và vì sao. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#verbatimmodulesyntax')}
${nguon('📘', 'TypeScript Handbook — Type-only imports', 'Cách import type bị xoá. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/modules/reference.html#type-only-imports-and-exports')}
</div>
`,
};
