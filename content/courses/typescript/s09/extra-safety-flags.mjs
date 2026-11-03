/**
 * TypeScript · Chương 9 · 9.3 — Beyond strict: extra safety flags. Slug giữ: typescript-9-3-extra-safety-flags.
 * Code/output từ ./_ma-ts-09-3.mjs (demo9/ts-09-3, Node 22.23.3 + tsc 7.0.2). Soạn lại TRỌN 04/11/2026.
 */
import G from '../giang/ts-09-3.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-09-3.mjs';

const KV_EN = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>noUncheckedIndexedAccess</code></span><span class="v">Index/key access is <code>T | undefined</code> — a read past the end is TS18048. (On in this course.)</span></div>
  <div class="kv"><span class="k"><code>noImplicitReturns</code></span><span class="v">A branch that falls off the end is TS7030 — the forgotten case.</span></div>
  <div class="kv"><span class="k"><code>noUnusedLocals</code></span><span class="v">A declared-but-unused local is TS6133 — a half-finished edit.</span></div>
  <div class="kv"><span class="k">not in <code>strict</code></span><span class="v">Each adds friction most code skips; a long-lived codebase wants them.</span></div>
  <div class="kv"><span class="k">how</span><span class="v">Turn on in tsconfig, fix what appears — exactly Lab 9.</span></div>
</div>`;
const KV_VI = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>noUncheckedIndexedAccess</code></span><span class="v">Truy cập chỉ mục/khoá là <code>T | undefined</code> — đọc quá cuối là TS18048. (Bật ở khoá này.)</span></div>
  <div class="kv"><span class="k"><code>noImplicitReturns</code></span><span class="v">Một nhánh rơi khỏi cuối là TS7030 — trường hợp bị quên.</span></div>
  <div class="kv"><span class="k"><code>noUnusedLocals</code></span><span class="v">Một local khai-mà-không-dùng là TS6133 — một lần sửa làm dở.</span></div>
  <div class="kv"><span class="k">không trong <code>strict</code></span><span class="v">Mỗi cái thêm ma sát mà phần lớn code bỏ qua; mã sống lâu thì cần.</span></div>
  <div class="kv"><span class="k">cách</span><span class="v">Bật trong tsconfig, sửa những gì hiện ra — đúng Lab 9.</span></div>
</div>`;

export default {
  title: '9.3 — Beyond strict: extra safety flags|||9.3 — Vượt strict: các cờ an toàn thêm',
  slug: 'typescript-9-3-extra-safety-flags',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Vài cờ an toàn nằm NGOÀI chiếc ô strict vì chặt hơn mức mặc định hầu hết dự án muốn — nhưng trên mã nguồn bạn trân trọng, chúng bắt bug thật. noUncheckedIndexedAccess (labs[0] là Lab|undefined ⇒ TS18048; khoá bật sẵn), noImplicitReturns (một nhánh rơi khỏi cuối ⇒ TS7030), noUnusedLocals (local chết ⇒ TS6133). Bật trong tsconfig rồi sửa những gì hiện ra — đúng việc Lab 9. Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>Beyond strict: extra safety flags</h2>
<p class="lead"><code>strict</code> is not the end. A handful of flags live outside the umbrella because they are stricter than most projects want by default — but on a codebase you care about, they catch real bugs. Three worth the noise: <code>noUncheckedIndexedAccess</code>, <code>noImplicitReturns</code> and <code>noUnusedLocals</code>. The course config already runs the first.</p>

<h3>noUncheckedIndexedAccess: an access might miss</h3>
<p><code>labs[0]</code> looks safe, but the array could be empty:</p>
${ma('ts', CODE.indexedFirst)}
${ra(OUT['11-indexed'])}
<p><strong>TS18048</strong>: with the flag on, <code>labs[0]</code> is <code>Lab | undefined</code>. It adds <code>undefined</code> to every index and every string-keyed lookup — a little friction for a guarantee that you never read past the end of an array. The course leaves it on for exactly that reason (you have met it since 4.4).</p>

<h3>noImplicitReturns: every path must return</h3>
<p><code>grade</code> returns on two branches and falls off the end on a third:</p>
${ma('ts', CODE.returnsGrade)}
${ra(OUT['12-returns'])}
<p><strong>TS7030</strong>: not all code paths return a value. It is the flag that catches the forgotten <code>else</code> — the case you thought was impossible but the compiler can reach. Add a return, or make the missing case explicit.</p>

<h3>noUnusedLocals: dead code is an error</h3>
<p><code>count</code> is declared and never read:</p>
${ma('ts', CODE.unusedCalc)}
${ra(OUT['13-unused'])}
<p><strong>TS6133</strong>: a dead local is usually a sign of a half-finished edit — a value you meant to use, a line you forgot to delete. Turning the warning into an error keeps the signal from piling up until nobody reads it. Its sibling <code>noUnusedParameters</code> does the same for arguments.</p>

<h3>Beyond strict — three flags worth the noise</h3>
${KV_EN}

<h3>🧪 Practice</h3>
<p>A function that reads <code>names[0]</code> without a guard fails under <code>noUncheckedIndexedAccess</code>:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['14-pr-start'])}
<p>Guard it with <code>??</code> and it runs:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['15-pr-sol'])}

<h3>📌 Summary</h3>
<ul>
<li><code>noUncheckedIndexedAccess</code>: an index/key access is <code>T | undefined</code> — an unchecked read is TS18048.</li>
<li><code>noImplicitReturns</code>: a branch that falls off the end is TS7030 — the forgotten case.</li>
<li><code>noUnusedLocals</code>: a declared-but-unused local is TS6133 — a half-finished edit.</li>
<li>None is in <code>strict</code>; each adds friction most code skips, and each pays for it on a long-lived codebase.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TSConfig Reference — noUncheckedIndexedAccess', 'Adding undefined to index and key access. Read 4 Nov 2026.', 'https://www.typescriptlang.org/tsconfig/#noUncheckedIndexedAccess')}
${nguon('📘', 'TSConfig Reference — noImplicitReturns & noUnusedLocals', 'Two more flags beyond the strict umbrella. Read 4 Nov 2026.', 'https://www.typescriptlang.org/tsconfig/#noImplicitReturns')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3</span>
<h2>Vượt strict: các cờ an toàn thêm</h2>
<p class="lead"><code>strict</code> không phải là hết. Một nhúm cờ nằm ngoài chiếc ô vì chúng chặt hơn mức hầu hết dự án muốn mặc định — nhưng trên một mã nguồn bạn trân trọng, chúng bắt bug thật. Ba cái đáng chịu ồn: <code>noUncheckedIndexedAccess</code>, <code>noImplicitReturns</code> và <code>noUnusedLocals</code>. Config của khoá đã bật cái đầu.</p>

<h3>noUncheckedIndexedAccess: một truy cập có thể hụt</h3>
<p><code>labs[0]</code> trông an toàn, nhưng mảng có thể rỗng:</p>
${ma('ts', CODE.indexedFirst)}
${ra(OUT['11-indexed'])}
<p><strong>TS18048</strong>: với cờ bật, <code>labs[0]</code> là <code>Lab | undefined</code>. Nó thêm <code>undefined</code> vào mọi truy cập theo chỉ mục và mọi lần tra khoá chuỗi — một chút ma sát đổi lấy bảo đảm bạn không bao giờ đọc quá cuối mảng. Khoá để nó bật đúng vì lý do đó (bạn đã gặp nó từ 4.4).</p>

<h3>noImplicitReturns: mọi nhánh phải trả về</h3>
<p><code>grade</code> trả về ở hai nhánh và rơi khỏi cuối ở nhánh thứ ba:</p>
${ma('ts', CODE.returnsGrade)}
${ra(OUT['12-returns'])}
<p><strong>TS7030</strong>: không phải mọi nhánh đều trả về. Đây là cờ bắt cái <code>else</code> bị quên — trường hợp bạn tưởng không thể xảy ra nhưng trình biên dịch tới được. Thêm một return, hoặc làm rõ trường hợp còn thiếu.</p>

<h3>noUnusedLocals: code chết là lỗi</h3>
<p><code>count</code> được khai và không bao giờ đọc:</p>
${ma('ts', CODE.unusedCalc)}
${ra(OUT['13-unused'])}
<p><strong>TS6133</strong>: một local chết thường là dấu một lần sửa làm dở — một giá trị bạn định dùng, một dòng bạn quên xoá. Biến cảnh báo thành lỗi giữ cho tín hiệu không chất đống tới khi không ai đọc. Người anh em <code>noUnusedParameters</code> làm điều tương tự cho đối số.</p>

<h3>Vượt strict — ba cờ đáng chịu ồn</h3>
${KV_VI}

<h3>🧪 Luyện tập</h3>
<p>Một hàm đọc <code>names[0]</code> không chặn trượt dưới <code>noUncheckedIndexedAccess</code>:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['14-pr-start'])}
<p>Chặn bằng <code>??</code> và nó chạy:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['15-pr-sol'])}

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>noUncheckedIndexedAccess</code>: một truy cập chỉ mục/khoá là <code>T | undefined</code> — một lần đọc chưa kiểm là TS18048.</li>
<li><code>noImplicitReturns</code>: một nhánh rơi khỏi cuối là TS7030 — trường hợp bị quên.</li>
<li><code>noUnusedLocals</code>: một local khai-mà-không-dùng là TS6133 — một lần sửa làm dở.</li>
<li>Không cái nào trong <code>strict</code>; mỗi cái thêm ma sát mà phần lớn code bỏ qua, và mỗi cái đáng giá trên mã sống lâu.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TSConfig Reference — noUncheckedIndexedAccess', 'Thêm undefined vào truy cập chỉ mục và khoá. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/tsconfig/#noUncheckedIndexedAccess')}
${nguon('📘', 'TSConfig Reference — noImplicitReturns & noUnusedLocals', 'Hai cờ nữa ngoài chiếc ô strict. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/tsconfig/#noImplicitReturns')}
</div>
`,
};
