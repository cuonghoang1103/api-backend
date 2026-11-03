/**
 * TypeScript · Chương 9 · 9.1 — What tsc does & tsconfig basics. Slug giữ: typescript-9-1-tsc-and-tsconfig.
 * BÀI MỞ CHƯƠNG 9 (soạn lại TRỌN 04/11/2026). Code/output từ ./_ma-ts-09-1.mjs (demo9/ts-09-1, Node 22.23.3 + tsc 7.0.2).
 */
import G from '../giang/ts-09-1.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-09-1.mjs';

const KV_EN = `<div class="kv-grid">
  <div class="kv"><span class="k">tsc</span><span class="v">Reads your files, checks the types, reports errors; with <code>noEmit</code> it produces nothing.</span></div>
  <div class="kv"><span class="k">tsconfig.json</span><span class="v">The control panel: target, lib, module, strict, noEmit, include.</span></div>
  <div class="kv"><span class="k"><code>include</code></span><span class="v">Which files are the project — tsc checks only these.</span></div>
  <div class="kv"><span class="k">the gap</span><span class="v">A file outside <code>include</code> is invisible — a clean build only proves the files you pointed at.</span></div>
  <div class="kv"><span class="k">close it</span><span class="v">A second typecheck config (for the seed) run in CI.</span></div>
</div>`;
const KV_VI = `<div class="kv-grid">
  <div class="kv"><span class="k">tsc</span><span class="v">Đọc tệp của bạn, kiểm kiểu, báo lỗi; với <code>noEmit</code> không sinh gì.</span></div>
  <div class="kv"><span class="k">tsconfig.json</span><span class="v">Bảng điều khiển: target, lib, module, strict, noEmit, include.</span></div>
  <div class="kv"><span class="k"><code>include</code></span><span class="v">Những tệp nào là dự án — tsc chỉ kiểm chúng.</span></div>
  <div class="kv"><span class="k">lỗ hổng</span><span class="v">Một tệp ngoài <code>include</code> là vô hình — một build sạch chỉ chứng minh các tệp bạn trỏ tới.</span></div>
  <div class="kv"><span class="k">đóng nó</span><span class="v">Một config typecheck thứ hai (cho seed) chạy trong CI.</span></div>
</div>`;

export default {
  title: '9.1 — What tsc does & tsconfig basics|||9.1 — tsc làm gì & tsconfig căn bản',
  slug: 'typescript-9-1-tsc-and-tsconfig',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mở Chương 9: tsc kiểm kiểu rồi (ở khoá này) không sinh gì — kiểu bị xoá, Node tự chạy .ts. tsconfig.json là bảng điều khiển (target, lib, module, strict, noEmit, include). Lỗ hổng quan trọng nhất: tsc CHỈ kiểm các tệp trong include — một tệp đã trôi để ngoài là vô hình, nên build sạch (0 lỗi) không có nghĩa mã nguồn đúng. Tái hiện sự cố 08/08: một enum đổi tên qua mọi phép kiểm vì seed.ts bị loại; đóng bằng một config typecheck thứ hai (TS2322). Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>What tsc does &amp; tsconfig basics</h2>
<p class="lead">For eight chapters you have written types; this chapter is about the tool that checks them and the file that configures it. <code>tsc</code> reads your code, checks the types, and — in this course — emits nothing (Node runs the <code>.ts</code> files itself). What it checks, and what it quietly does not, is decided by <code>tsconfig.json</code>.</p>

<h3>After Chapter 9 you can…</h3>
<ul>
<li>Read a tsconfig and know what each flag buys (this lesson).</li>
<li>Reach for <code>strict</code> and its family (9.2) and the extra safety flags beyond it (9.3).</li>
<li>Set <code>target</code>, <code>lib</code>, <code>module</code> and <code>noEmit</code> on purpose (9.4).</li>
<li>Tighten a loose project to strict and add a CI gate (Lab 9).</li>
</ul>

<h3>Types are erased — see it</h3>
<p>Node runs a <code>.ts</code> file by stripping the types first, so they never protect you at run time — their entire job is the check <code>tsc</code> runs beforehand:</p>
${ma('ts', CODE.eraseArea)}
${ra(OUT['11-erase'])}
<p>The <code>Rect</code> type was gone before <code>area</code> ran. That is why the check, and its configuration, are the whole subject of this chapter.</p>

<h3>tsconfig.json: the control panel</h3>
<p>The course config is small and strict — every flag earns its place, and the rest of the chapter is each line of it:</p>
${ma('json', CODE.scopeTsconfig)}
<p><code>include</code> says which files <em>are</em> the project. That one line is the most important — and the most dangerous — setting in the file.</p>

<h3>The gap: tsc only checks the project</h3>
<p>Here is the source of truth — an enum value renamed from <code>CODE</code> to <code>CODE_REVIEW</code>:</p>
${ma('ts', CODE.scopeContent)}
<p>And a seed file, outside <code>include</code>, that still uses the old value:</p>
${ma('ts', CODE.scopeSeed)}
${ra(OUT['12-scope'])}
<p><strong>0 errors.</strong> The <code>seed/</code> folder is outside <code>include</code>, so the compiler never looked at it. A clean build does not mean a correct codebase — it means the files you pointed at are correct.</p>

<h3>Close the gap: a second config</h3>
<p>Point a config at the seed too and the drift surfaces:</p>
${ma('json', CODE.scopeTsconfigSeed)}
${ra(OUT['13-scope-seed'])}
<p><strong>TS2322</strong>: <code>'CODE'</code> is not assignable to <code>ContentType</code>. This is exactly the <strong>2026-08-08 incident</strong> — a renamed enum passed every check because <code>seed.ts</code> was excluded (and carried a hand-copied union, so even checking it would not have helped until it imported the real type). The fix is a second typecheck config that includes the seed, run in CI. <em>A gap you do not check for is a gap that ships.</em></p>

<h3>What tsc does — and does not</h3>
${KV_EN}

<h3>🧪 Practice</h3>
<p>A project with a <code>seed/</code> that holds a dead value (<code>'VIEWER'</code> is not a <code>Role</code>) compiles clean, because the seed is excluded:</p>
${ma('ts', CODE.prSeedStart)}
${ra(OUT['14-pr-start'])}
<p>Add a config that includes the seed and the drift becomes a compile error; fix the value and it passes:</p>
${ma('ts', CODE.prSeedSol)}
${ra(OUT['15-pr-sol'])}

<h3>📌 Summary</h3>
<ul>
<li><code>tsc</code> checks types and (here) emits nothing — types are erased, so the check is all there is.</li>
<li><code>tsconfig.json</code> is the control panel; <code>include</code> decides which files are the project.</li>
<li>A file outside <code>include</code> is invisible — a clean build only proves the files you pointed at.</li>
<li>The 08/08 seed break came from exactly this gap; a second typecheck config in CI closes it.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — What is a tsconfig.json', 'What the file does and how tsc uses it. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/tsconfig-json.html')}
${nguon('📘', 'TSConfig Reference — include & exclude', 'Which files make up a project. Read 4 Nov 2026.', 'https://www.typescriptlang.org/tsconfig/#include')}
${lienKet({ khoa: 'prisma-orm', bai: 'pr-8-3-su-co-enum', title: 'The enum incident, from the Prisma side — Prisma ORM 8.3: an enum gone wrong', sub: 'Same: a renamed enum value that a hand-copied list did not follow, so it broke at run time, not at compile time. Different: there Prisma generates the enum type, and the fix is importing it; here it is the <code>include</code> gap — <code>seed.ts</code> was outside the project, so tsc never checked it — closed with a second typecheck config in CI.', cta: 'OPEN PRISMA ORM LESSON →' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>tsc làm gì &amp; tsconfig căn bản</h2>
<p class="lead">Tám chương bạn đã viết kiểu; chương này nói về công cụ kiểm chúng và tệp cấu hình nó. <code>tsc</code> đọc code, kiểm kiểu, và — trong khoá này — không sinh ra gì (Node tự chạy tệp <code>.ts</code>). Nó kiểm gì, và âm thầm không kiểm gì, là do <code>tsconfig.json</code> quyết định.</p>

<h3>Sau Chương 9 bạn có thể…</h3>
<ul>
<li>Đọc một tsconfig và biết mỗi cờ mua gì (bài này).</li>
<li>Gọi <code>strict</code> và họ hàng của nó (9.2) và các cờ an toàn thêm ngoài nó (9.3).</li>
<li>Đặt <code>target</code>, <code>lib</code>, <code>module</code> và <code>noEmit</code> có chủ ý (9.4).</li>
<li>Siết một dự án lỏng lên strict và thêm một cổng CI (Lab 9).</li>
</ul>

<h3>Kiểu bị xoá — hãy nhìn tận mắt</h3>
<p>Node chạy một tệp <code>.ts</code> bằng cách bỏ kiểu trước, nên chúng không bao giờ bảo vệ bạn lúc chạy — toàn bộ việc của chúng là phép kiểm <code>tsc</code> chạy trước đó:</p>
${ma('ts', CODE.eraseArea)}
${ra(OUT['11-erase'])}
<p>Kiểu <code>Rect</code> đã biến mất trước khi <code>area</code> chạy. Vì thế phép kiểm, và cấu hình của nó, là cả chủ đề của chương này.</p>

<h3>tsconfig.json: bảng điều khiển</h3>
<p>Config của khoá nhỏ và strict — mỗi cờ xứng chỗ của nó, và phần còn lại của chương là từng dòng của nó:</p>
${ma('json', CODE.scopeTsconfig)}
<p><code>include</code> nói những tệp nào <em>là</em> dự án. Một dòng đó là cài đặt quan trọng nhất — và nguy hiểm nhất — trong tệp.</p>

<h3>Lỗ hổng: tsc chỉ kiểm dự án</h3>
<p>Đây là nguồn sự thật — một giá trị enum đổi tên từ <code>CODE</code> sang <code>CODE_REVIEW</code>:</p>
${ma('ts', CODE.scopeContent)}
<p>Và một tệp seed, ngoài <code>include</code>, còn dùng giá trị cũ:</p>
${ma('ts', CODE.scopeSeed)}
${ra(OUT['12-scope'])}
<p><strong>0 lỗi.</strong> Thư mục <code>seed/</code> nằm ngoài <code>include</code>, nên trình biên dịch không hề nhìn nó. Một build sạch không có nghĩa mã nguồn đúng — nó có nghĩa các tệp bạn trỏ tới đúng.</p>

<h3>Đóng lỗ hổng: một config thứ hai</h3>
<p>Trỏ một config vào cả seed và chỗ trôi lộ ra:</p>
${ma('json', CODE.scopeTsconfigSeed)}
${ra(OUT['13-scope-seed'])}
<p><strong>TS2322</strong>: <code>'CODE'</code> không gán được cho <code>ContentType</code>. Đây đúng <strong>sự cố 08/08/2026</strong> — một enum đổi tên qua mọi phép kiểm vì <code>seed.ts</code> bị loại (và mang một union chép tay, nên kể cả kiểm nó cũng không giúp được tới khi nó import kiểu thật). Cách sửa là một config typecheck thứ hai include seed, chạy trong CI. <em>Một lỗ hổng bạn không kiểm là một lỗ hổng lên sản phẩm.</em></p>

<h3>tsc làm gì — và không làm gì</h3>
${KV_VI}

<h3>🧪 Luyện tập</h3>
<p>Một dự án với một <code>seed/</code> giữ một giá trị chết (<code>'VIEWER'</code> không phải một <code>Role</code>) biên dịch sạch, vì seed bị loại:</p>
${ma('ts', CODE.prSeedStart)}
${ra(OUT['14-pr-start'])}
<p>Thêm một config include seed và chỗ trôi thành một lỗi biên dịch; sửa giá trị và nó qua:</p>
${ma('ts', CODE.prSeedSol)}
${ra(OUT['15-pr-sol'])}

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>tsc</code> kiểm kiểu và (ở đây) không sinh gì — kiểu bị xoá, nên phép kiểm là tất cả.</li>
<li><code>tsconfig.json</code> là bảng điều khiển; <code>include</code> quyết định những tệp nào là dự án.</li>
<li>Một tệp ngoài <code>include</code> là vô hình — một build sạch chỉ chứng minh các tệp bạn trỏ tới.</li>
<li>Cú vỡ seed 08/08 đến đúng từ lỗ hổng này; một config typecheck thứ hai trong CI đóng nó.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — What is a tsconfig.json', 'Tệp này làm gì và tsc dùng nó ra sao. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/tsconfig-json.html')}
${nguon('📘', 'TSConfig Reference — include & exclude', 'Những tệp nào tạo nên một dự án. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/tsconfig/#include')}
${lienKet({ khoa: 'prisma-orm', bai: 'pr-8-3-su-co-enum', title: 'Sự cố enum, từ phía Prisma — Prisma ORM 8.3: một enum hỏng', sub: 'Giống: một giá trị enum đổi tên mà một danh sách chép tay không theo kịp, nên nó vỡ lúc chạy, không phải lúc biên dịch. Khác: ở đó Prisma sinh kiểu enum, và cách sửa là import nó; ở đây là lỗ hổng <code>include</code> — <code>seed.ts</code> nằm ngoài dự án, nên tsc không hề kiểm — đóng bằng một config typecheck thứ hai trong CI.', cta: 'MỞ BÀI PRISMA ORM →' })}
</div>
`,
};
