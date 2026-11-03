/**
 * TypeScript · Chương 9 · 9.4 — target, lib, module & noEmit. Slug giữ: typescript-9-4-target-lib-module.
 * Code/output từ ./_ma-ts-09-4.mjs (demo9/ts-09-4, Node 22.23.3 + tsc 7.0.2). Soạn lại TRỌN 04/11/2026.
 */
import G from '../giang/ts-09-4.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-09-4.mjs';

const KV_EN = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>target</code></span><span class="v">Which JavaScript syntax — "can I write this?".</span></div>
  <div class="kv"><span class="k"><code>lib</code></span><span class="v">Which built-in APIs exist — "does this method exist?" (too old ⇒ TS2550).</span></div>
  <div class="kv"><span class="k"><code>module</code> / <code>moduleResolution</code></span><span class="v">How an import becomes a file (nodenext needs the extension ⇒ TS2835).</span></div>
  <div class="kv"><span class="k"><code>noEmit</code></span><span class="v">Check only, produce nothing — a pure CI gate.</span></div>
  <div class="kv"><span class="k">the environment half</span><span class="v"><code>strict</code> = how carefully; these = what you check against.</span></div>
</div>`;
const KV_VI = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>target</code></span><span class="v">Cú pháp JavaScript nào — "tôi viết được cái này không?".</span></div>
  <div class="kv"><span class="k"><code>lib</code></span><span class="v">API dựng sẵn nào tồn tại — "method này có không?" (quá cũ ⇒ TS2550).</span></div>
  <div class="kv"><span class="k"><code>module</code> / <code>moduleResolution</code></span><span class="v">Một import thành một tệp ra sao (nodenext cần phần mở rộng ⇒ TS2835).</span></div>
  <div class="kv"><span class="k"><code>noEmit</code></span><span class="v">Chỉ kiểm, không sinh gì — một cổng CI thuần.</span></div>
  <div class="kv"><span class="k">nửa môi trường</span><span class="v"><code>strict</code> = kiểm cẩn thận đến đâu; những cái này = kiểm dựa trên cái gì.</span></div>
</div>`;

export default {
  title: '9.4 — target, lib, module & noEmit|||9.4 — target, lib, module & noEmit',
  slug: 'typescript-9-4-target-lib-module',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Nhóm cờ tả thế giới code bạn chạy trong đó. lib là tập API dựng sẵn trình biên dịch tin là tồn tại — findLast cần lib es2023, với es2022 là TS2550 (kèm gợi ý đổi lib); lib của khoá es2024 biết nó. target là cú pháp (ít quan trọng vì Node 22 chạy .ts thẳng). module nodenext: một import tương đối phải mang phần mở rộng (TS2835). noEmit: kiểm mà không sinh .js — một cổng CI thuần. Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.4</span>
<h2>target, lib, module &amp; noEmit</h2>
<p class="lead">The last group of flags describes the world your code runs in. <code>target</code> and <code>lib</code> say which JavaScript you are writing for; <code>module</code> says how imports resolve; and <code>noEmit</code> says <code>tsc</code> should check without producing a single file. Together they are why the same code is fine in one project and an error in another.</p>

<h3>lib: which APIs exist</h3>
<p><code>findLast</code> is a real array method, but it was added in ES2023. With <code>lib</code> set to <code>es2022</code>, the compiler does not know it:</p>
${ma('ts', CODE.liboldFind)}
${ma('json', CODE.liboldTsconfig)}
${ra(OUT['11-libold'])}
<p><strong>TS2550</strong>, with a hint to change <code>lib</code> to <code>es2023</code> or later. The course <code>lib</code> (es2024) knows it, so the same call runs and prints:</p>
${ma('ts', CODE.libnewFind)}
${ra(OUT['12-libnew'])}
<p><code>lib</code> is the list of built-in APIs the compiler believes exist — too old a <code>lib</code> and a real method looks like a typo. <code>target</code> is its sibling: it is the JavaScript <em>syntax</em> tsc assumes (“can I write this?”), while <code>lib</code> is the APIs (“does this method exist?”). In this course Node 22 runs the <code>.ts</code> directly, so <code>target</code> matters less — but <code>lib</code> still decides which methods you may call.</p>

<h3>module: how imports resolve</h3>
<p>Under <code>nodenext</code>, a relative import must carry its file extension:</p>
${ma('ts', CODE.moduleApp)}
${ra(OUT['13-module'])}
<p><strong>TS2835</strong>, with a hint to write <code>'./helper.js'</code>. The course adds <code>allowImportingTsExtensions</code> so you write <code>'./helper.ts'</code> instead. <code>module</code> and <code>moduleResolution</code> decide how an import string becomes a file — get them wrong and every import breaks at once.</p>

<h3>noEmit: check without producing files</h3>
<p><code>noEmit</code> tells <code>tsc</code> to type-check and stop — produce no <code>.js</code>:</p>
${ma('ts', CODE.noemitCheck)}
${ra(OUT['14-noemit'])}
<p>It runs clean and writes nothing, which is exactly what you want in CI: a pure gate that says yes or no without cluttering the tree. In this course Node runs the <code>.ts</code>, so <code>tsc</code> never needs to emit; <code>noEmit</code> makes that explicit and makes <code>tsc</code> a checker, not a build step. This is the command behind Lab 9’s CI gate: <code>tsc --noEmit</code>.</p>

<h3>The four, and the questions they answer</h3>
${KV_EN}

<h3>🧪 Practice</h3>
<p>A call to <code>findLast</code> under an old <code>lib</code> (es2020) is refused:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['15-pr-start'])}
<p>Move to the course <code>lib</code> and it runs:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['16-pr-sol'])}

<h3>📌 Summary</h3>
<ul>
<li><code>lib</code> is the set of built-in APIs — too old and a real method (<code>findLast</code>) is TS2550.</li>
<li><code>target</code> is the syntax; <code>lib</code> is the APIs — they answer different questions.</li>
<li><code>module</code> (<code>nodenext</code>) decides import resolution — a missing extension is TS2835.</li>
<li><code>noEmit</code> makes <code>tsc</code> a pure checker — <code>tsc --noEmit</code> is the CI gate.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TSConfig Reference — target & lib', 'Which syntax and which APIs the compiler assumes. Read 4 Nov 2026.', 'https://www.typescriptlang.org/tsconfig/#target')}
${nguon('📘', 'TSConfig Reference — module & noEmit', 'Import resolution and check-only mode. Read 4 Nov 2026.', 'https://www.typescriptlang.org/tsconfig/#module')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-1-5-module', title: 'Where the import rules come from — Node.js 1.5: CommonJS vs ES Modules', sub: 'Same: how an import string becomes a file, and why a relative import needs its extension. Different: there you learn the two module systems Node runs (CommonJS vs ESM) and how it decides which; here <code>module: nodenext</code> is the tsconfig flag that makes tsc follow Node’s ESM rules — a bare import is TS2835, and <code>allowImportingTsExtensions</code> lets you write <code>.ts</code>.', cta: 'OPEN NODE.JS LESSON →' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.4</span>
<h2>target, lib, module &amp; noEmit</h2>
<p class="lead">Nhóm cờ cuối tả thế giới code bạn chạy trong đó. <code>target</code> và <code>lib</code> nói bạn viết cho JavaScript nào; <code>module</code> nói import phân giải ra sao; và <code>noEmit</code> nói <code>tsc</code> nên kiểm mà không sinh một tệp nào. Gộp lại, chúng là vì sao cùng một đoạn code ổn ở dự án này mà lỗi ở dự án khác.</p>

<h3>lib: API nào tồn tại</h3>
<p><code>findLast</code> là một method mảng thật, nhưng nó được thêm ở ES2023. Với <code>lib</code> đặt <code>es2022</code>, trình biên dịch không biết nó:</p>
${ma('ts', CODE.liboldFind)}
${ma('json', CODE.liboldTsconfig)}
${ra(OUT['11-libold'])}
<p><strong>TS2550</strong>, kèm gợi ý đổi <code>lib</code> sang <code>es2023</code> trở lên. <code>lib</code> của khoá (es2024) biết nó, nên cùng lời gọi chạy và in:</p>
${ma('ts', CODE.libnewFind)}
${ra(OUT['12-libnew'])}
<p><code>lib</code> là danh sách API dựng sẵn trình biên dịch tin là tồn tại — <code>lib</code> quá cũ thì một method thật trông như lỗi gõ. <code>target</code> là người anh em: nó là <em>cú pháp</em> JavaScript tsc giả định (“tôi viết được cú pháp này không?”), còn <code>lib</code> là các API (“method này có tồn tại không?”). Trong khoá này Node 22 chạy <code>.ts</code> thẳng, nên <code>target</code> ít quan trọng hơn — nhưng <code>lib</code> vẫn quyết định bạn gọi được method nào.</p>

<h3>module: import phân giải ra sao</h3>
<p>Dưới <code>nodenext</code>, một import tương đối phải mang phần mở rộng:</p>
${ma('ts', CODE.moduleApp)}
${ra(OUT['13-module'])}
<p><strong>TS2835</strong>, kèm gợi ý viết <code>'./helper.js'</code>. Khoá thêm <code>allowImportingTsExtensions</code> nên bạn viết <code>'./helper.ts'</code>. <code>module</code> và <code>moduleResolution</code> quyết định một chuỗi import thành một tệp ra sao — sai chúng thì mọi import gãy cùng lúc.</p>

<h3>noEmit: kiểm mà không sinh tệp</h3>
<p><code>noEmit</code> bảo <code>tsc</code> kiểu-kiểm rồi dừng — không sinh <code>.js</code>:</p>
${ma('ts', CODE.noemitCheck)}
${ra(OUT['14-noemit'])}
<p>Nó chạy sạch và không ghi gì, đúng thứ bạn muốn trong CI: một cổng thuần nói có hoặc không mà không làm bừa cây tệp. Trong khoá này Node chạy <code>.ts</code>, nên <code>tsc</code> không cần sinh; <code>noEmit</code> làm điều đó tường minh và biến <code>tsc</code> thành một bộ kiểm, không phải một bước build. Đây là lệnh đằng sau cổng CI của Lab 9: <code>tsc --noEmit</code>.</p>

<h3>Bốn cái, và câu hỏi chúng trả lời</h3>
${KV_VI}

<h3>🧪 Luyện tập</h3>
<p>Một lời gọi <code>findLast</code> dưới một <code>lib</code> cũ (es2020) bị từ chối:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['15-pr-start'])}
<p>Chuyển sang <code>lib</code> của khoá và nó chạy:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['16-pr-sol'])}

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>lib</code> là tập API dựng sẵn — quá cũ thì một method thật (<code>findLast</code>) là TS2550.</li>
<li><code>target</code> là cú pháp; <code>lib</code> là API — chúng trả lời câu hỏi khác nhau.</li>
<li><code>module</code> (<code>nodenext</code>) quyết định phân giải import — thiếu phần mở rộng là TS2835.</li>
<li><code>noEmit</code> làm <code>tsc</code> thành một bộ kiểm thuần — <code>tsc --noEmit</code> là cổng CI.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TSConfig Reference — target & lib', 'Cú pháp nào và API nào trình biên dịch giả định. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/tsconfig/#target')}
${nguon('📘', 'TSConfig Reference — module & noEmit', 'Phân giải import và chế độ chỉ-kiểm. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/tsconfig/#module')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-1-5-module', title: 'Luật import đến từ đâu — Node.js 1.5: CommonJS và ES Modules', sub: 'Giống: một chuỗi import thành một tệp ra sao, và vì sao một import tương đối cần phần mở rộng. Khác: ở đó bạn học hai hệ module Node chạy (CommonJS và ESM) và cách nó chọn; ở đây <code>module: nodenext</code> là cờ tsconfig làm tsc theo luật ESM của Node — một import trần là TS2835, và <code>allowImportingTsExtensions</code> cho bạn viết <code>.ts</code>.', cta: 'MỞ BÀI NODE.JS →' })}
</div>
`,
};
