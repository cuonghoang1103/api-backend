/**
 * TypeScript · Chương 9 · Lab 9 — Siết một dự án lỏng lên strict + cổng CI. BÀI MỚI 04/11/2026, slug typescript-9-6-lab-siet-strict (TRƯỚC quiz 9.5).
 * Máy chấm = scripts/cham-lab-9.mjs trong LabFlow TS (tsc 7.0.2 + node 22.23.3 thật): A2·B1·C1·D2·E 8×0,5; đạt 7.
 * Số đo thật: khởi đầu (lỏng) 4.5/10 · "strict nhưng thiếu noUncheckedIndexedAccess" 8/10 · "tight nhưng seed chép tay" 9/10 · tham khảo 10/10.
 * Mọi code/output lấy từ ./_ma-ts-lab-9.mjs (SINH TỰ ĐỘNG). Lời giải = ./_labflow-ts/lab9/giai/.
 */
import G from '../giang/ts-lab-9.mjs';
import { ma, ra, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-lab-9.mjs';

const noc = (s) => s.split('\n').map((l) => l.replace(/\s+\/\/ S\d.*$/, '')).join('\n');

const BANG_EN = `<table>
<thead><tr><th>#</th><th>Loose use</th><th>tsc must say</th><th>Which flag catches it</th></tr></thead>
<tbody>
<tr><td>S1</td><td>a parameter with no type</td><td>TS7006</td><td><code>noImplicitAny</code></td></tr>
<tr><td>S2</td><td>an implicit-any arrow parameter</td><td>TS7006</td><td><code>noImplicitAny</code></td></tr>
<tr><td>S3</td><td>an unchecked array access</td><td>TS18048</td><td><code>noUncheckedIndexedAccess</code></td></tr>
<tr><td>S4</td><td>a possibly-undefined value</td><td>TS18048</td><td><code>strictNullChecks</code></td></tr>
<tr><td>S5</td><td>the drifted literal <code>'CODE'</code></td><td>TS2322</td><td>the imported <code>ContentType</code></td></tr>
<tr><td>S6</td><td>a value that is not a <code>ContentType</code></td><td>TS2345</td><td>a typed <code>label</code></td></tr>
<tr><td>S7</td><td>the old enum value</td><td>TS2345</td><td>a typed <code>label</code></td></tr>
<tr><td>S8</td><td>an unchecked record lookup</td><td>TS18048</td><td><code>noUncheckedIndexedAccess</code></td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>#</th><th>Cách dùng lỏng</th><th>tsc phải báo</th><th>Cờ nào bắt</th></tr></thead>
<tbody>
<tr><td>S1</td><td>một tham số không kiểu</td><td>TS7006</td><td><code>noImplicitAny</code></td></tr>
<tr><td>S2</td><td>một tham số arrow implicit-any</td><td>TS7006</td><td><code>noImplicitAny</code></td></tr>
<tr><td>S3</td><td>một truy cập mảng không kiểm</td><td>TS18048</td><td><code>noUncheckedIndexedAccess</code></td></tr>
<tr><td>S4</td><td>một giá trị có-thể-undefined</td><td>TS18048</td><td><code>strictNullChecks</code></td></tr>
<tr><td>S5</td><td>literal đã trôi <code>'CODE'</code></td><td>TS2322</td><td><code>ContentType</code> đã import</td></tr>
<tr><td>S6</td><td>một giá trị không phải <code>ContentType</code></td><td>TS2345</td><td><code>label</code> có kiểu</td></tr>
<tr><td>S7</td><td>giá trị enum cũ</td><td>TS2345</td><td><code>label</code> có kiểu</td></tr>
<tr><td>S8</td><td>một lần tra record không kiểm</td><td>TS18048</td><td><code>noUncheckedIndexedAccess</code></td></tr>
</tbody>
</table>`;
const RUBRIC_EN = `<table>
<thead><tr><th>Part</th><th>Points</th><th>How the grader checks it</th></tr></thead>
<tbody>
<tr><td>A — the CI gate passes</td><td>2</td><td><code>tsc --noEmit</code> under <em>your</em> tsconfig reports 0 errors</td></tr>
<tr><td>B — the config is tight</td><td>1</td><td><code>strict</code> AND <code>noUncheckedIndexedAccess</code> are both on</td></tr>
<tr><td>C — honesty</td><td>1</td><td>no <code>any</code>/<code>as</code>/<code>!</code>, and <code>seed.ts</code> imports <code>ContentType</code> (no hand-copied union)</td></tr>
<tr><td>D — behaviour</td><td>2</td><td><code>node --test</code>: <code>label</code> and <code>firstTag</code> still work</td></tr>
<tr><td>E — loose uses refused</td><td>4 (8 × 0.5)</td><td>each marked line of <code>kiem/sai.ts</code> is refused under your tsconfig</td></tr>
</tbody>
</table>`;
const RUBRIC_VI = `<table>
<thead><tr><th>Phần</th><th>Điểm</th><th>Máy chấm kiểm thế nào</th></tr></thead>
<tbody>
<tr><td>A — cổng CI qua</td><td>2</td><td><code>tsc --noEmit</code> dưới tsconfig <em>của bạn</em> báo 0 lỗi</td></tr>
<tr><td>B — config đủ chặt</td><td>1</td><td><code>strict</code> VÀ <code>noUncheckedIndexedAccess</code> đều bật</td></tr>
<tr><td>C — trung thực</td><td>1</td><td>không <code>any</code>/<code>as</code>/<code>!</code>, và <code>seed.ts</code> import <code>ContentType</code> (không union chép tay)</td></tr>
<tr><td>D — hành vi</td><td>2</td><td><code>node --test</code>: <code>label</code> và <code>firstTag</code> vẫn chạy</td></tr>
<tr><td>E — cách dùng lỏng bị từ chối</td><td>4 (8 × 0,5)</td><td>mỗi dòng đánh dấu trong <code>kiem/sai.ts</code> bị từ chối dưới tsconfig của bạn</td></tr>
</tbody>
</table>`;

export default {
  title: 'Lab 9 — Tighten a loose project to strict|||Lab 9 — Siết một dự án lỏng lên strict',
  slug: 'typescript-9-6-lab-siet-strict',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab Chương 9 — lần đầu bạn cấu hình trình biên dịch thay vì viết kiểu. Thừa hưởng một dự án lỏng (strict tắt, một hàm tham số không kiểu + truy cập mảng không chặn, một seed đã trôi) và siết nó: bật strict + noUncheckedIndexedAccess, sửa những gì hiện ra, đóng lỗ hổng seed (import ContentType thay union chép tay), và làm tsc --noEmit qua như một cổng CI. Máy chấm chạy dưới tsconfig CỦA BẠN. Số đo thật: lỏng 4.5/10 · strict thiếu noUncheckedIndexedAccess 8/10 · tight nhưng seed chép tay 9/10 · tham khảo 10/10.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lab 9</span>
<h2>Tighten a loose project to strict</h2>
<p class="lead">60–90 minutes. Every lab so far asked you to write types; this one asks you to configure the compiler. You inherit a loose project — <code>strict</code> off, a function with an untyped parameter and an unguarded array access, and a <code>seed.ts</code> that drifted — and you tighten it: turn on <code>strict</code> and <code>noUncheckedIndexedAccess</code>, fix what appears, close the seed gap, and make <code>tsc --noEmit</code> pass as a CI gate. The loose starter scores <strong>4.5</strong>; you take it to 10.</p>

<h3>What this lab trains</h3>
<ul>
<li><strong>9.1</strong> — the include gap: the seed file that drifted, and closing it with an import.</li>
<li><strong>9.2</strong> — <code>strict</code>: <code>noImplicitAny</code> and <code>strictNullChecks</code>.</li>
<li><strong>9.3</strong> — <code>noUncheckedIndexedAccess</code> on the array and record reads.</li>
<li><strong>9.4</strong> — <code>tsc --noEmit</code> as the CI gate the grader runs.</li>
</ul>

<h3>Setup</h3>
<ol>
<li>Use <code>labflow-ts</code> at the end of Chapter 9 and <code>npm ci</code>.</li>
<li>Your starting point — a <strong>loose</strong> tsconfig:
${ma('json', CODE.tsconfigLoose)}</li>
<li>The loose module and the drifted seed you inherit:
${ma('typescript', CODE.starterRules)}
${ma('typescript', CODE.starterSeed)}</li>
</ol>
<p>You edit <code>tsconfig.json</code>, <code>rules.ts</code> and <code>seed.ts</code>. The grader runs <code>tsc --noEmit</code> under <em>your</em> tsconfig.</p>

<h3>Loose compiles — and hides the bugs</h3>
<p>With <code>strict: false</code> the project compiles with 0 errors — the implicit-any parameter, the unguarded access, the drifted seed, all invisible. The grader gives it <strong>4.5/10</strong>: it passes the gate (A) and fails everything that matters.</p>
${ra(OUT['l3-starter'])}

<h3>Flip strict and the bugs appear</h3>
<p>Turn <code>strict</code> on and the same <code>rules.ts</code> reports three errors at once:</p>
${ra(OUT['l2-flip'])}
<p><strong>TS7006</strong> (the untyped parameter), <strong>TS7053</strong> (indexing a map with an <code>any</code> key), <strong>TS2532</strong> (the array access might be undefined). Tightening the config does not create bugs — it reveals the ones that were always there. Now you fix them.</p>

<h3>Your task</h3>
<p>Edit the three files until <code>npm run lab9</code> prints <strong>Score: 10/10</strong>: set <code>strict: true</code> and <code>noUncheckedIndexedAccess: true</code> in <code>tsconfig.json</code>; type the parameter and guard the lookups in <code>rules.ts</code>; and in <code>seed.ts</code>, import <code>ContentType</code> from <code>content.ts</code> instead of a hand-copied union, and fix the value. No <code>any</code>, <code>as</code> (except <code>as const</code>), <code>!</code> or <code>@ts-</code>.</p>

<h3>The eight loose uses</h3>
${ma('typescript', noc(CODE.sai))}
${BANG_EN}
<p>Every one compiles under a loose config; under <em>your</em> tightened config each must be refused with the code shown. If any slips, your config is not tight enough.</p>

<h3>What first attempts usually look like</h3>
<p><strong>Attempt A — strict on, but not <code>noUncheckedIndexedAccess</code></strong> (<code>lab9/yeu/</code>):</p>
${ra(OUT['l4-yeu'])}
<div class="pitfall co-tieu-de">
<p><strong>Trap — <code>strict</code> alone is not tight.</strong> 8/10. You turned on <code>strict</code> and fixed the implicit any, but left <code>noUncheckedIndexedAccess</code> off, so the config is not tight (B fails) and the two unchecked-access violations (S3, S8) slip through (E is 6/8). On a codebase that reads arrays and maps by key, the extra flag is what closes those holes.</p>
</div>
<p><strong>Attempt B — tight, but the seed is still hand-copied</strong> (<code>lab9/vua/</code>):</p>
${ra(OUT['l5-vua'])}
<p>9/10 — the config is tight and the code is fixed, so seven and a half points are there. But <code>seed.ts</code> still declares its own copy of <code>ContentType</code> instead of importing it — self-consistent, so <code>tsc</code> passes, but it will drift again the next time the enum changes. That is the 08/08 bug waiting to happen; honesty (C) costs the last point until the seed imports the real type.</p>

<h3>Rubric (10 points, pass mark 7)</h3>
${RUBRIC_EN}

<h3>Hints — open one at a time</h3>
<ol>
<li>In <code>tsconfig.json</code>, set <code>"strict": true</code> and add <code>"noUncheckedIndexedAccess": true</code>.</li>
<li>In <code>rules.ts</code>, type the parameter (<code>type: ContentType</code>) and make the map a <code>Record&lt;ContentType, string&gt;</code>.</li>
<li>Guard the array access: <code>const first = tags[0]; return (first ?? '').toUpperCase();</code>.</li>
<li>In <code>seed.ts</code>, delete the local <code>type ContentType</code> and <code>import type { ContentType } from './content.ts'</code>.</li>
<li>Fix the drifted value: <code>'CODE'</code> → <code>'CODE_REVIEW'</code>.</li>
</ol>

<h3>The reference: 10/10</h3>
<p>The tightened config:</p>
${ma('json', CODE.tsconfigTight)}
<p>The fixed module and the imported seed:</p>
${ma('typescript', CODE.refRules)}
${ma('typescript', CODE.refSeed)}
${ra(OUT['l6-ref'])}
<p>The CI gate (<code>tsc --noEmit</code>) passes, and it now checks the file the 08/08 incident left out. That is what tightening a project actually buys.</p>

<h3>Before you call it done</h3>
<ul>
<li><code>npm run lab9</code> prints <strong>Score: 10/10</strong>.</li>
<li><code>tsconfig.json</code> has <code>strict</code> and <code>noUncheckedIndexedAccess</code>; no <code>any</code>/<code>as</code>/<code>!</code>; <code>seed.ts</code> imports <code>ContentType</code>.</li>
<li>You can say which flag refuses each of S1–S8.</li>
<li>Commit: <code>chore(ts): tighten the project to strict (lab 9: 10/10)</code>.</li>
</ul>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">the CI gate</span><span class="v"><code>tsc --noEmit</code> — check only, 0 errors or fail.</span></div>
  <div class="kv"><span class="k">tight config</span><span class="v"><code>strict</code> + <code>noUncheckedIndexedAccess</code> both on.</span></div>
  <div class="kv"><span class="k">the seed gap</span><span class="v">a hand-copied union drifts; import the source of truth (9.1).</span></div>
  <div class="kv"><span class="k">reveal, not create</span><span class="v">tightening surfaces bugs that were always there.</span></div>
</div>

<h3>🗺 How the grader scores you</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Gate</div><div class="lz-d">tsc --noEmit under your config (A)</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Read config</div><div class="lz-d">strict + noUncheckedIndexedAccess (B)</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Scan + run</div><div class="lz-d">no cheats, seed imports; behaviour (C, D)</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Attack</div><div class="lz-d">8 loose uses, each refused (E)</div></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A loose project compiles with 0 errors and hides every bug — it scores 4.5.</li>
<li><code>strict</code> alone misses the unchecked-access violations — 8, until <code>noUncheckedIndexedAccess</code> is on.</li>
<li>Tight but a hand-copied seed scores 9 — the drift will come back until the seed imports the real type.</li>
<li>The reference: tight config, typed and guarded code, an imported seed, and a <code>tsc --noEmit</code> gate.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TSConfig Reference — strict & noUncheckedIndexedAccess', 'The flags this lab turns on. Read 4 Nov 2026.', 'https://www.typescriptlang.org/tsconfig/#strict')}
${nguon('📘', 'TypeScript Handbook — Configuring & tsc --noEmit', 'Running tsc as a type-check-only CI gate. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/compiler-options.html')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Lab 9</span>
<h2>Siết một dự án lỏng lên strict</h2>
<p class="lead">60–90 phút. Mọi lab tới giờ yêu cầu bạn viết kiểu; cái này yêu cầu bạn cấu hình trình biên dịch. Bạn thừa hưởng một dự án lỏng — <code>strict</code> tắt, một hàm có tham số không kiểu và một truy cập mảng không chặn, và một <code>seed.ts</code> đã trôi — và bạn siết nó: bật <code>strict</code> và <code>noUncheckedIndexedAccess</code>, sửa những gì hiện ra, đóng lỗ hổng seed, và làm <code>tsc --noEmit</code> qua như một cổng CI. Bản lỏng khởi đầu được <strong>4.5</strong>; bạn đưa nó lên 10.</p>

<h3>Lab này rèn gì</h3>
<ul>
<li><strong>9.1</strong> — lỗ hổng include: tệp seed đã trôi, và đóng nó bằng một import.</li>
<li><strong>9.2</strong> — <code>strict</code>: <code>noImplicitAny</code> và <code>strictNullChecks</code>.</li>
<li><strong>9.3</strong> — <code>noUncheckedIndexedAccess</code> trên các lần đọc mảng và record.</li>
<li><strong>9.4</strong> — <code>tsc --noEmit</code> như cổng CI máy chấm chạy.</li>
</ul>

<h3>Chuẩn bị</h3>
<ol>
<li>Dùng <code>labflow-ts</code> ở cuối Chương 9 và <code>npm ci</code>.</li>
<li>Điểm xuất phát — một tsconfig <strong>lỏng</strong>:
${ma('json', CODE.tsconfigLoose)}</li>
<li>Module lỏng và seed đã trôi bạn thừa hưởng:
${ma('typescript', CODE.starterRules)}
${ma('typescript', CODE.starterSeed)}</li>
</ol>
<p>Bạn sửa <code>tsconfig.json</code>, <code>rules.ts</code> và <code>seed.ts</code>. Máy chấm chạy <code>tsc --noEmit</code> dưới tsconfig <em>của bạn</em>.</p>

<h3>Lỏng biên dịch — và giấu các bug</h3>
<p>Với <code>strict: false</code> dự án biên dịch 0 lỗi — tham số implicit-any, truy cập không chặn, seed đã trôi, đều vô hình. Máy chấm cho nó <strong>4.5/10</strong>: nó qua cổng (A) và trượt mọi thứ quan trọng.</p>
${ra(OUT['l3-starter'])}

<h3>Bật strict và các bug hiện ra</h3>
<p>Bật <code>strict</code> và cùng <code>rules.ts</code> báo ba lỗi cùng lúc:</p>
${ra(OUT['l2-flip'])}
<p><strong>TS7006</strong> (tham số không kiểu), <strong>TS7053</strong> (tra một map bằng khoá <code>any</code>), <strong>TS2532</strong> (truy cập mảng có thể undefined). Siết config không tạo ra bug — nó lộ ra những cái vẫn luôn ở đó. Giờ bạn sửa chúng.</p>

<h3>Việc của bạn</h3>
<p>Sửa ba tệp tới khi <code>npm run lab9</code> in <strong>Score: 10/10</strong>: đặt <code>strict: true</code> và <code>noUncheckedIndexedAccess: true</code> trong <code>tsconfig.json</code>; gán kiểu cho tham số và chặn các lần tra trong <code>rules.ts</code>; và trong <code>seed.ts</code>, import <code>ContentType</code> từ <code>content.ts</code> thay cho một union chép tay, và sửa giá trị. Không <code>any</code>, <code>as</code> (trừ <code>as const</code>), <code>!</code> hay <code>@ts-</code>.</p>

<h3>Tám cách dùng lỏng</h3>
${ma('typescript', noc(CODE.sai))}
${BANG_VI}
<p>Mỗi cái biên dịch được dưới config lỏng; dưới config đã siết <em>của bạn</em> mỗi cái phải bị từ chối với mã đã ghi. Cái nào lọt là config của bạn chưa đủ chặt.</p>

<h3>Những lần thử đầu thường trông thế nào</h3>
<p><strong>Thử A — strict bật, nhưng không <code>noUncheckedIndexedAccess</code></strong> (<code>lab9/yeu/</code>):</p>
${ra(OUT['l4-yeu'])}
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — <code>strict</code> một mình chưa chặt.</strong> 8/10. Bạn bật <code>strict</code> và sửa implicit any, nhưng để <code>noUncheckedIndexedAccess</code> tắt, nên config chưa chặt (B trượt) và hai vi phạm truy-cập-không-kiểm (S3, S8) lọt (E là 6/8). Trên một mã nguồn đọc mảng và map theo khoá, cờ thêm là thứ bịt các lỗ đó.</p>
</div>
<p><strong>Thử B — tight, nhưng seed vẫn chép tay</strong> (<code>lab9/vua/</code>):</p>
${ra(OUT['l5-vua'])}
<p>9/10 — config chặt và code đã sửa, nên bảy phẩy điểm đã có. Nhưng <code>seed.ts</code> vẫn khai bản sao <code>ContentType</code> của riêng nó thay vì import — tự nhất quán, nên <code>tsc</code> qua, nhưng nó sẽ trôi lại lần sau enum đổi. Đó là bug 08/08 chờ xảy ra; tính trung thực (C) tốn điểm cuối tới khi seed import kiểu thật.</p>

<h3>Thang điểm (10 điểm, đạt 7)</h3>
${RUBRIC_VI}

<h3>Gợi ý — mở từng cái một</h3>
<ol>
<li>Trong <code>tsconfig.json</code>, đặt <code>"strict": true</code> và thêm <code>"noUncheckedIndexedAccess": true</code>.</li>
<li>Trong <code>rules.ts</code>, gán kiểu tham số (<code>type: ContentType</code>) và làm map thành <code>Record&lt;ContentType, string&gt;</code>.</li>
<li>Chặn truy cập mảng: <code>const first = tags[0]; return (first ?? '').toUpperCase();</code>.</li>
<li>Trong <code>seed.ts</code>, xoá <code>type ContentType</code> cục bộ và <code>import type { ContentType } from './content.ts'</code>.</li>
<li>Sửa giá trị đã trôi: <code>'CODE'</code> → <code>'CODE_REVIEW'</code>.</li>
</ol>

<h3>Lời giải tham khảo: 10/10</h3>
<p>Config đã siết:</p>
${ma('json', CODE.tsconfigTight)}
<p>Module đã sửa và seed đã import:</p>
${ma('typescript', CODE.refRules)}
${ma('typescript', CODE.refSeed)}
${ra(OUT['l6-ref'])}
<p>Cổng CI (<code>tsc --noEmit</code>) qua, và giờ nó kiểm cả tệp mà sự cố 08/08 bỏ sót. Đó là thứ siết một dự án thật sự mua.</p>

<h3>Trước khi coi là xong</h3>
<ul>
<li><code>npm run lab9</code> in <strong>Score: 10/10</strong>.</li>
<li><code>tsconfig.json</code> có <code>strict</code> và <code>noUncheckedIndexedAccess</code>; không <code>any</code>/<code>as</code>/<code>!</code>; <code>seed.ts</code> import <code>ContentType</code>.</li>
<li>Bạn nói được cờ nào từ chối từng S1–S8.</li>
<li>Commit: <code>chore(ts): tighten the project to strict (lab 9: 10/10)</code>.</li>
</ul>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">cổng CI</span><span class="v"><code>tsc --noEmit</code> — chỉ kiểm, 0 lỗi hoặc hỏng.</span></div>
  <div class="kv"><span class="k">config chặt</span><span class="v"><code>strict</code> + <code>noUncheckedIndexedAccess</code> đều bật.</span></div>
  <div class="kv"><span class="k">lỗ hổng seed</span><span class="v">một union chép tay sẽ trôi; import nguồn sự thật (9.1).</span></div>
  <div class="kv"><span class="k">lộ ra, không tạo ra</span><span class="v">siết làm hiện các bug vẫn luôn ở đó.</span></div>
</div>

<h3>🗺 Máy chấm cho điểm thế nào</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Cổng</div><div class="lz-d">tsc --noEmit dưới config của bạn (A)</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Đọc config</div><div class="lz-d">strict + noUncheckedIndexedAccess (B)</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Quét + chạy</div><div class="lz-d">không cheat, seed import; hành vi (C, D)</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Tấn công</div><div class="lz-d">8 cách dùng lỏng, mỗi cái bị từ chối (E)</div></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một dự án lỏng biên dịch 0 lỗi và giấu mọi bug — nó được 4.5.</li>
<li><code>strict</code> một mình bỏ sót các vi phạm truy-cập-không-kiểm — 8, tới khi <code>noUncheckedIndexedAccess</code> bật.</li>
<li>Tight nhưng seed chép tay được 9 — chỗ trôi sẽ trở lại tới khi seed import kiểu thật.</li>
<li>Lời giải: config chặt, code có kiểu và được chặn, một seed đã import, và một cổng <code>tsc --noEmit</code>.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TSConfig Reference — strict & noUncheckedIndexedAccess', 'Các cờ lab này bật. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/tsconfig/#strict')}
${nguon('📘', 'TypeScript Handbook — Configuring & tsc --noEmit', 'Chạy tsc như một cổng CI chỉ-kiểm-kiểu. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/compiler-options.html')}
</div>
`,
};
