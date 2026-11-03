/**
 * TypeScript · Chương 15 · 15.1 — Where the time goes & skipLibCheck. Slug giữ: typescript-15-1-where-time-goes.
 * BÀI MỞ CHƯƠNG 15 (soạn lại TRỌN 04/11/2026). Code/output từ ./_ma-ts-15-1.mjs (demo15/ts-15-1, Node 22.23.3 + tsc 7.0.2). Đo thật, tái lập được.
 */
import G from '../giang/ts-15-1.mjs';
import { ma, ra, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-15-1.mjs';

const KV_EN = `<div class="kv-grid">
  <div class="kv"><span class="k">parse · bind · check</span><span class="v">Checking dominates a large build.</span></div>
  <div class="kv"><span class="k">.d.ts cost</span><span class="v">Much of checking is your dependencies’ declaration files.</span></div>
  <div class="kv"><span class="k"><code>skipLibCheck: true</code></span><span class="v">Skips the <code>.d.ts</code> — the biggest easy win.</span></div>
  <div class="kv"><span class="k">off</span><span class="v">A broken dependency <code>.d.ts</code> is TS2304 — your build fails.</span></div>
  <div class="kv"><span class="k">on (course config)</span><span class="v">tsc trusts the declarations and checks only your code.</span></div>
</div>`;
const KV_VI = `<div class="kv-grid">
  <div class="kv"><span class="k">parse · bind · check</span><span class="v">Check chiếm đa số một build lớn.</span></div>
  <div class="kv"><span class="k">chi phí .d.ts</span><span class="v">Phần nhiều của check là tệp khai báo của dependency.</span></div>
  <div class="kv"><span class="k"><code>skipLibCheck: true</code></span><span class="v">Bỏ các <code>.d.ts</code> — cú thắng dễ lớn nhất.</span></div>
  <div class="kv"><span class="k">tắt</span><span class="v">Một <code>.d.ts</code> dependency hỏng là TS2304 — build của bạn hỏng.</span></div>
  <div class="kv"><span class="k">bật (config khoá)</span><span class="v">tsc tin các khai báo và chỉ kiểm code của bạn.</span></div>
</div>`;

export default {
  title: '15.1 — Where the time goes & skipLibCheck|||15.1 — Thời gian đi đâu & skipLibCheck',
  slug: 'typescript-15-1-where-time-goes',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mở Chương 15: hiệu năng build. Một lượt kiểm kiểu parse · bind · check; trên dự án lớn check chiếm đa số, và một phần lớn là kiểm các tệp .d.ts của dependency (bạn không viết, không sửa). skipLibCheck bỏ chúng — cú thắng dễ lớn nhất. Tắt skipLibCheck: một .d.ts hỏng trong dependency ⇒ TS2304 làm hỏng build; bật (config khoá bật): tsc tin các khai báo, chỉ kiểm code của bạn. Đo thật tsc 7.0.2 (tái lập được).',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.1</span>
<h2>Where the time goes &amp; skipLibCheck</h2>
<p class="lead">A type-check does three things: parse the files, bind the names, and check the types. On a large project most of the time is in checking — and a surprising share of that is checking the <code>.d.ts</code> declaration files of your dependencies, which you did not write and cannot fix. <code>skipLibCheck</code> skips them, and it is the single biggest easy win for build time.</p>

<h3>After Chapter 15 you can…</h3>
<ul>
<li>Cut checking time with <code>skipLibCheck</code> (this lesson).</li>
<li>Build only what changed with incremental builds and project references (15.2).</li>
<li>Separate type-checking from transpiling so a fast tool emits your code (15.3).</li>
<li>Trim the module graph with <code>import type</code> (15.4), then make a module transpile-ready (Lab 15).</li>
</ul>

<h3>skipLibCheck off: a dependency’s .d.ts surfaces</h3>
<p>A vendor declaration references a type that does not exist:</p>
${ma('ts', CODE.brokenDts)}
<p>With <code>skipLibCheck: false</code>, tsc checks it:</p>
${ma('json', CODE.nolibCfg)}
${ra(OUT['11-nolib'])}
<p><strong>TS2304</strong> — an error in code you cannot change. Without <code>skipLibCheck</code>, a bad <code>.d.ts</code> anywhere in <code>node_modules</code> can fail your build.</p>

<h3>skipLibCheck on: the .d.ts is skipped</h3>
<p>Turn it on (the course config does) and the same project is clean:</p>
${ma('json', CODE.libCfg)}
${ra(OUT['12-lib'])}
<p>tsc trusts the declaration files and checks only your code. You lose the ability to catch a type error <em>inside</em> a dependency’s types — which you almost never want — and gain back all the time spent checking them.</p>

<h3>At a glance</h3>
${KV_EN}

<h3>🧪 Practice</h3>
<p>A vendor <code>.d.ts</code> references a missing <code>Shape</code>; with <code>skipLibCheck: false</code>:</p>
${ra(OUT['13-pr-start'])}
<p>Turn <code>skipLibCheck</code> on and the build is clean (exit 0):</p>
${ra(OUT['14-pr-sol'])}

<h3>📌 Summary</h3>
<ul>
<li>A build parses, binds and checks; checking dominates, and checking <code>.d.ts</code> files is a big part of it.</li>
<li><code>skipLibCheck: true</code> skips the declaration files — your build trusts them and checks only your code.</li>
<li>It is on in the course config; without it, a broken dependency <code>.d.ts</code> (TS2304) can fail your build.</li>
<li>The rest of the chapter does less work: build only what changed, skip type-checking where a transpiler suffices, trim the graph.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TSConfig — skipLibCheck', 'What it skips and why. Read 4 Nov 2026.', 'https://www.typescriptlang.org/tsconfig/#skipLibCheck')}
${nguon('📘', 'TypeScript Wiki — Performance', 'Where compile time goes and how to measure it. Read 4 Nov 2026.', 'https://github.com/microsoft/TypeScript/wiki/Performance')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.1</span>
<h2>Thời gian đi đâu &amp; skipLibCheck</h2>
<p class="lead">Một lượt kiểm kiểu làm ba việc: phân tích (parse) các tệp, nối (bind) các tên, và kiểm (check) các kiểu. Trên một dự án lớn phần lớn thời gian ở bước check — và một phần đáng ngạc nhiên của nó là kiểm các tệp khai báo <code>.d.ts</code> của dependency, thứ bạn không viết và không sửa được. <code>skipLibCheck</code> bỏ qua chúng, và nó là cú thắng dễ lớn nhất cho thời gian build.</p>

<h3>Sau Chương 15 bạn có thể…</h3>
<ul>
<li>Cắt thời gian check với <code>skipLibCheck</code> (bài này).</li>
<li>Chỉ build thứ đã đổi với incremental build và project references (15.2).</li>
<li>Tách kiểm kiểu khỏi transpile để một công cụ nhanh phát code của bạn (15.3).</li>
<li>Cắt gọn đồ thị module với <code>import type</code> (15.4), rồi làm một module sẵn-sàng-transpile (Lab 15).</li>
</ul>

<h3>skipLibCheck tắt: một .d.ts của dependency hiện ra</h3>
<p>Một khai báo của vendor tham chiếu một kiểu không tồn tại:</p>
${ma('ts', CODE.brokenDts)}
<p>Với <code>skipLibCheck: false</code>, tsc kiểm nó:</p>
${ma('json', CODE.nolibCfg)}
${ra(OUT['11-nolib'])}
<p><strong>TS2304</strong> — một lỗi trong code bạn không đổi được. Không có <code>skipLibCheck</code>, một <code>.d.ts</code> xấu bất kỳ trong <code>node_modules</code> có thể làm hỏng build của bạn.</p>

<h3>skipLibCheck bật: tệp .d.ts được bỏ qua</h3>
<p>Bật nó (config của khoá bật) và cùng dự án đó sạch:</p>
${ma('json', CODE.libCfg)}
${ra(OUT['12-lib'])}
<p>tsc tin các tệp khai báo và chỉ kiểm code của bạn. Bạn mất khả năng bắt một lỗi kiểu <em>bên trong</em> kiểu của một dependency — thứ gần như không bao giờ muốn — và lấy lại toàn bộ thời gian bỏ ra kiểm chúng.</p>

<h3>Nhìn nhanh</h3>
${KV_VI}

<h3>🧪 Luyện tập</h3>
<p>Một <code>.d.ts</code> của vendor tham chiếu một <code>Shape</code> thiếu; với <code>skipLibCheck: false</code>:</p>
${ra(OUT['13-pr-start'])}
<p>Bật <code>skipLibCheck</code> và build sạch (exit 0):</p>
${ra(OUT['14-pr-sol'])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một build parse, bind và check; check chiếm đa số, và check các tệp <code>.d.ts</code> là một phần lớn.</li>
<li><code>skipLibCheck: true</code> bỏ các tệp khai báo — build của bạn tin chúng và chỉ kiểm code của bạn.</li>
<li>Nó bật trong config của khoá; không có nó, một <code>.d.ts</code> dependency hỏng (TS2304) có thể làm hỏng build.</li>
<li>Phần còn lại của chương làm ít việc đi: chỉ build thứ đã đổi, bỏ kiểm kiểu ở chỗ transpiler đủ, cắt gọn đồ thị.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TSConfig — skipLibCheck', 'Nó bỏ gì và vì sao. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/tsconfig/#skipLibCheck')}
${nguon('📘', 'TypeScript Wiki — Performance', 'Thời gian biên dịch đi đâu và đo thế nào. Đọc ngày 4/11/2026.', 'https://github.com/microsoft/TypeScript/wiki/Performance')}
</div>
`,
};
