/**
 * TypeScript · Chương 15 · Lab 15 — Module biên sẵn-sàng-transpile. BÀI MỚI 04/11/2026, slug typescript-15-6-lab-bien-transpile (TRƯỚC quiz 15.5).
 * Máy chấm = scripts/cham-lab-15.mjs (tsc + Node thật): A2·B1·C1·D2·E 8×0,5; đạt 7. Số đo: stub 6 · import fixed re-export không 6 · as thừa 9 · tham khảo 10.
 * Code/output từ ./_ma-ts-lab-15.mjs (SINH TỰ ĐỘNG). Lời giải = ./_labflow-ts/lab15/giai/boundary.ts.
 */
import G from '../giang/ts-lab-15.mjs';
import { ma, ra, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-lab-15.mjs';

const noc = (s) => s.split('\n').map((l) => l.replace(/\s+\/\/ S\d.*$/, '')).join('\n');

const BANG_EN = `<table>
<thead><tr><th>#</th><th>Wrong use</th><th>tsc must say</th><th>Why it blocks a per-file transpile</th></tr></thead>
<tbody>
<tr><td>S1–S4</td><td><code>import { Type }</code> (a plain import of a type)</td><td>TS1484</td><td>a transpiler cannot tell it is a type to erase</td></tr>
<tr><td>S5–S8</td><td><code>export { Type } from …</code> (a plain re-export of a type)</td><td>TS1205</td><td>a transpiler cannot tell whether to emit or erase it</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>#</th><th>Cách dùng sai</th><th>tsc phải báo</th><th>Vì sao nó chặn transpile từng-tệp</th></tr></thead>
<tbody>
<tr><td>S1–S4</td><td><code>import { Type }</code> (import thường của một kiểu)</td><td>TS1484</td><td>transpiler không biết đó là kiểu để xoá</td></tr>
<tr><td>S5–S8</td><td><code>export { Type } from …</code> (re-export thường của một kiểu)</td><td>TS1205</td><td>transpiler không biết nên phát hay xoá</td></tr>
</tbody>
</table>`;
const RUBRIC_EN = `<table>
<thead><tr><th>Part</th><th>Points</th><th>How the grader checks it</th></tr></thead>
<tbody>
<tr><td>A — compiles</td><td>2</td><td><code>tsc -p</code>, course tsconfig (strict + verbatimModuleSyntax)</td></tr>
<tr><td>B — correct uses</td><td>1</td><td><code>kiem/phai-dung.ts</code>: the boundary’s exports used correctly</td></tr>
<tr><td>C — honesty</td><td>1</td><td>no <code>any</code>, <code>as</code> (except <code>as const</code>), <code>!</code> or <code>@ts-</code></td></tr>
<tr><td>D — behaviour</td><td>2</td><td><code>node --test</code>: the module runs after types are erased</td></tr>
<tr><td>E — wrong uses refused</td><td>4 (8 × 0.5)</td><td>each marked line of <code>kiem/sai.ts</code> has the expected code</td></tr>
</tbody>
</table>`;
const RUBRIC_VI = `<table>
<thead><tr><th>Phần</th><th>Điểm</th><th>Máy chấm kiểm thế nào</th></tr></thead>
<tbody>
<tr><td>A — biên dịch được</td><td>2</td><td><code>tsc -p</code>, tsconfig của khoá (strict + verbatimModuleSyntax)</td></tr>
<tr><td>B — cách dùng đúng</td><td>1</td><td><code>kiem/phai-dung.ts</code>: các export của boundary dùng đúng</td></tr>
<tr><td>C — trung thực</td><td>1</td><td>không <code>any</code>, <code>as</code> (trừ <code>as const</code>), <code>!</code> hay <code>@ts-</code></td></tr>
<tr><td>D — hành vi</td><td>2</td><td><code>node --test</code>: module chạy sau khi kiểu bị xoá</td></tr>
<tr><td>E — cách dùng sai bị từ chối</td><td>4 (8 × 0,5)</td><td>mỗi dòng đánh dấu trong <code>kiem/sai.ts</code> có đúng mã</td></tr>
</tbody>
</table>`;

export default {
  title: 'Lab 15 — A transpile-ready boundary module|||Lab 15 — Module biên sẵn-sàng-transpile',
  slug: 'typescript-15-6-lab-bien-transpile',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab Chương 15 — sửa boundary.ts re-export model của LabFlow để một transpiler nhanh từng-tệp phát được nó: mọi kiểu import bằng import type, mọi kiểu re-export bằng export type, các giá trị để thường. Máy chấm chạy tsc + Node thật (strict + verbatimModuleSyntax): A biên dịch · B cách dùng đúng · C no any/as/! · D module chạy sau khi kiểu bị xoá · E 8 dòng không-thân-thiện-transpile. Bản stub (value import + value re-export) được 6; import sửa re-export chưa 6; một as thừa 9; bản sẵn-sàng-transpile 10.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lab 15</span>
<h2>A transpile-ready boundary module</h2>
<p class="lead">45–75 minutes. The chapter meets in one module. You fix the <code>boundary.ts</code> that re-exports LabFlow’s model so a fast per-file transpiler can emit it: every type imported with <code>import type</code>, every type re-exported with <code>export type</code>, the values left plain. A teammate wrote it with value imports and value re-exports; under <code>verbatimModuleSyntax</code> it does not build. It scores <strong>6</strong>. You take it to 10.</p>

<h3>What this lab trains</h3>
<ul>
<li><strong>15.3</strong> — <code>export type</code> so a per-file transpiler can handle a re-export.</li>
<li><strong>15.4</strong> — <code>import type</code> so a type leaves no edge in the graph.</li>
<li>The discipline that lets the fast tools and the slow checker agree.</li>
</ul>

<h3>The model (given)</h3>
<p>A mix of types and values the boundary re-exports — you do not edit it:</p>
${ma('ts', CODE.model)}

<h3>The stub scores 6</h3>
<p>The teammate value-imported the type and value-re-exported it:</p>
${ma('ts', CODE.starter)}
${ra(OUT['l3-starter'])}
<p><strong>6/10.</strong> Under <code>verbatimModuleSyntax</code> the plain import (TS1484) and the plain re-export (TS1205) are both errors, so it fails to compile (A). It does not even run: once types are erased, Node still executes <code>import { Booking }</code>, finds no runtime export named <code>Booking</code> and stops at load — so the behaviour tests fail too (D). A module that neither builds nor runs is not transpile-ready.</p>

<h3>Your task</h3>
<p>Edit <code>lab15/src/boundary.ts</code> until <code>npm run lab15</code> prints <strong>Score: 10/10</strong>: import <code>Booking</code> with <code>import type</code>, import the values (<code>makeBooking</code>, <code>VERSION</code>) plainly, and re-export the type with <code>export type</code>. Keep <code>describe</code> and <code>demo</code>. No <code>any</code>, <code>as</code> or <code>!</code>.</p>

<h3>The eight wrong uses</h3>
${ma('typescript', noc(CODE.sai))}
${BANG_EN}
<p>Each is a place a per-file transpiler would guess wrong; <code>verbatimModuleSyntax</code> turns every guess into a compile error you resolve with <code>type</code>.</p>

<h3>What first attempts usually look like</h3>
<p><strong>Attempt A — import fixed, re-export not</strong> (<code>lab15/yeu/</code>):</p>
${ra(OUT['l4-yeu'])}
<div class="pitfall co-tieu-de">
<p><strong>Trap — both halves must be marked.</strong> 6/10. You changed the import to <code>import type { Booking }</code>, but still wrote <code>export { Booking }</code> — still TS1205, so the module still does not build (A). “Closer” does not transpile.</p>
</div>
<p><strong>Attempt B — one needless cast</strong> (<code>lab15/vua/</code>):</p>
${ra(OUT['l5-vua'])}
<p>9/10 — the imports and re-exports are correct and the module builds, but the <code>describe</code> body uses a needless <code>as string</code>, which trips the honesty check. The value was already a string; the <code>as</code> adds nothing but risk.</p>

<h3>Rubric (10 points, pass mark 7)</h3>
${RUBRIC_EN}

<h3>The reference: 10/10</h3>
${ma('ts', CODE.ref)}
${ra(OUT['l6-ref'])}
<p>The module builds under <code>verbatimModuleSyntax</code>, so any fast transpiler can emit it, and every type edge is gone from the graph.</p>

<h3>Before you call it done</h3>
<ul>
<li><code>npm run lab15</code> prints <strong>Score: 10/10</strong>.</li>
<li>No <code>any</code>, <code>as</code> or <code>!</code>; types use <code>import type</code> / <code>export type</code>, values stay plain.</li>
<li>You can say why each of S1–S8 blocks a per-file transpile.</li>
<li>Commit: <code>chore(build): make the boundary module transpile-ready (lab 15: 10/10)</code>.</li>
</ul>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>import type</code></span><span class="v">A type import, erased — no graph edge.</span></div>
  <div class="kv"><span class="k"><code>export type</code></span><span class="v">A type re-export a transpiler can erase per-file.</span></div>
  <div class="kv"><span class="k">verbatimModuleSyntax</span><span class="v">The flag that enforces both.</span></div>
  <div class="kv"><span class="k">transpile-ready</span><span class="v">Every file emits correctly on its own.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A value import (TS1484) and a value re-export (TS1205) of a type fail to build under <code>verbatimModuleSyntax</code> — the stub scores 6.</li>
<li>Fixing only the import leaves the re-export at TS1205 — still 6; both halves must be marked.</li>
<li>One needless <code>as</code> scores 9 — the honesty rule does not let it pass.</li>
<li>The reference: <code>import type</code> / <code>export type</code> for the shapes, plain import/export for the values.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TSConfig — verbatimModuleSyntax', 'The flag the lab compiles under. Read 4 Nov 2026.', 'https://www.typescriptlang.org/tsconfig/#verbatimModuleSyntax')}
${nguon('📘', 'TypeScript Handbook — Type-only imports and exports', 'import type / export type, erased in the output. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/modules/reference.html#type-only-imports-and-exports')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Lab 15</span>
<h2>Module biên sẵn-sàng-transpile</h2>
<p class="lead">45–75 phút. Chương gặp nhau ở một module. Bạn sửa <code>boundary.ts</code> re-export model của LabFlow để một transpiler nhanh từng-tệp phát được nó: mọi kiểu import bằng <code>import type</code>, mọi kiểu re-export bằng <code>export type</code>, các giá trị để thường. Một đồng đội viết nó bằng value import và value re-export; dưới <code>verbatimModuleSyntax</code> nó không build. Nó được <strong>6</strong>. Bạn đưa nó lên 10.</p>

<h3>Lab này rèn gì</h3>
<ul>
<li><strong>15.3</strong> — <code>export type</code> để một transpiler từng-tệp xử lý được một re-export.</li>
<li><strong>15.4</strong> — <code>import type</code> để một kiểu không để lại cạnh trong đồ thị.</li>
<li>Kỷ luật cho công cụ nhanh và bộ kiểm chậm nhất trí.</li>
</ul>

<h3>Model (cho sẵn)</h3>
<p>Một trộn kiểu và giá trị mà boundary re-export — bạn không sửa nó:</p>
${ma('ts', CODE.model)}

<h3>Bản stub được 6</h3>
<p>Đồng đội value-import kiểu và value-re-export nó:</p>
${ma('ts', CODE.starter)}
${ra(OUT['l3-starter'])}
<p><strong>6/10.</strong> Dưới <code>verbatimModuleSyntax</code> import thường (TS1484) và re-export thường (TS1205) đều là lỗi, nên nó không biên dịch (A). Và nó còn không chạy nổi: kiểu bị xoá rồi Node vẫn chạy <code>import { Booking }</code>, không thấy export nào tên <code>Booking</code> lúc chạy nên dừng ngay khi nạp — test hành vi cũng trượt (D). Một module không build được cũng không chạy được thì chưa sẵn-sàng-transpile.</p>

<h3>Việc của bạn</h3>
<p>Sửa <code>lab15/src/boundary.ts</code> tới khi <code>npm run lab15</code> in <strong>Score: 10/10</strong>: import <code>Booking</code> bằng <code>import type</code>, import các giá trị (<code>makeBooking</code>, <code>VERSION</code>) thường, và re-export kiểu bằng <code>export type</code>. Giữ <code>describe</code> và <code>demo</code>. Không <code>any</code>, <code>as</code> hay <code>!</code>.</p>

<h3>Tám cách dùng sai</h3>
${ma('typescript', noc(CODE.sai))}
${BANG_VI}
<p>Mỗi cái là một chỗ một transpiler từng-tệp sẽ đoán sai; <code>verbatimModuleSyntax</code> biến mỗi phỏng đoán thành một lỗi biên dịch bạn giải bằng <code>type</code>.</p>

<h3>Những lần thử đầu thường trông thế nào</h3>
<p><strong>Thử A — import sửa, re-export chưa</strong> (<code>lab15/yeu/</code>):</p>
${ra(OUT['l4-yeu'])}
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — cả hai nửa phải được đánh dấu.</strong> 6/10. Bạn đổi import thành <code>import type { Booking }</code>, nhưng vẫn viết <code>export { Booking }</code> — vẫn TS1205, nên module vẫn không build (A). “Gần hơn” không transpile.</p>
</div>
<p><strong>Thử B — một phép ép thừa</strong> (<code>lab15/vua/</code>):</p>
${ra(OUT['l5-vua'])}
<p>9/10 — import và re-export đúng và module build, nhưng thân <code>describe</code> dùng một <code>as string</code> thừa, làm vấp phép kiểm trung thực. Giá trị vốn đã là một string; <code>as</code> chẳng thêm gì ngoài rủi ro.</p>

<h3>Thang điểm (10 điểm, đạt 7)</h3>
${RUBRIC_VI}

<h3>Lời giải tham khảo: 10/10</h3>
${ma('ts', CODE.ref)}
${ra(OUT['l6-ref'])}
<p>Module build dưới <code>verbatimModuleSyntax</code>, nên bất kỳ transpiler nhanh nào cũng phát được nó, và mọi cạnh kiểu đã mất khỏi đồ thị.</p>

<h3>Trước khi coi là xong</h3>
<ul>
<li><code>npm run lab15</code> in <strong>Score: 10/10</strong>.</li>
<li>Không <code>any</code>, <code>as</code> hay <code>!</code>; kiểu dùng <code>import type</code> / <code>export type</code>, giá trị để thường.</li>
<li>Bạn nói được vì sao mỗi S1–S8 chặn một transpile từng-tệp.</li>
<li>Commit: <code>chore(build): make the boundary module transpile-ready (lab 15: 10/10)</code>.</li>
</ul>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>import type</code></span><span class="v">Một import kiểu, bị xoá — không cạnh đồ thị.</span></div>
  <div class="kv"><span class="k"><code>export type</code></span><span class="v">Một re-export kiểu một transpiler xoá được từng-tệp.</span></div>
  <div class="kv"><span class="k">verbatimModuleSyntax</span><span class="v">Cờ ép cả hai.</span></div>
  <div class="kv"><span class="k">sẵn-sàng-transpile</span><span class="v">Mỗi tệp phát đúng một mình.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một value-import (TS1484) và một value-re-export (TS1205) của một kiểu không build được dưới <code>verbatimModuleSyntax</code> — bản stub được 6.</li>
<li>Sửa chỉ import để re-export còn TS1205 — vẫn 6; cả hai nửa phải được đánh dấu.</li>
<li>Một <code>as</code> thừa được 9 — luật trung thực không cho nó lọt.</li>
<li>Lời giải: <code>import type</code> / <code>export type</code> cho dáng, import/export thường cho giá trị.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TSConfig — verbatimModuleSyntax', 'Cờ mà lab biên dịch dưới. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/tsconfig/#verbatimModuleSyntax')}
${nguon('📘', 'TypeScript Handbook — Type-only imports and exports', 'import type / export type, bị xoá ở output. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/modules/reference.html#type-only-imports-and-exports')}
</div>
`,
};
