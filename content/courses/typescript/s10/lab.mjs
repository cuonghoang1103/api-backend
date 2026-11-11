/**
 * TypeScript · Chương 10 · Lab 10 — Viết một .d.ts cho một package JS. BÀI MỚI 04/11/2026, slug typescript-10-6-lab-viet-dts (TRƯỚC quiz 10.5).
 * Máy chấm = scripts/cham-lab-10.mjs trong LabFlow TS: A2·B1·C1·D2·E 8×0,5; đạt 7. Số đo: stub any 6 · any+optional 8 · optional max 9.5 · tham khảo 10.
 * Code/output từ ./_ma-ts-lab-10.mjs (SINH TỰ ĐỘNG). Lời giải = ./_labflow-ts/lab10/giai/labflow-slug.d.ts.
 */
import G from '../giang/ts-lab-10.mjs';
import { ma, ra, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-lab-10.mjs';

const noc = (s) => s.split('\n').map((l) => l.replace(/\s+\/\/ S\d.*$/, '')).join('\n');

const BANG_EN = `<table>
<thead><tr><th>#</th><th>Wrong call</th><th>tsc must say</th><th>What the type enforces</th></tr></thead>
<tbody>
<tr><td>S1</td><td><code>slugify(42)</code></td><td>TS2345</td><td><code>slugify</code> takes a <code>string</code></td></tr>
<tr><td>S2</td><td><code>truncate('x')</code></td><td>TS2554</td><td><code>truncate</code> needs its <code>max</code></td></tr>
<tr><td>S3</td><td><code>const n: number = slugify('x')</code></td><td>TS2322</td><td><code>slugify</code> returns a <code>string</code></td></tr>
<tr><td>S4</td><td><code>isSlug('x').length</code></td><td>TS2339</td><td><code>isSlug</code> returns a <code>boolean</code></td></tr>
<tr><td>S5</td><td><code>SLUG_MAX.toUpperCase()</code></td><td>TS2339</td><td><code>SLUG_MAX</code> is a <code>number</code></td></tr>
<tr><td>S6</td><td><code>truncate('x', '5')</code></td><td>TS2345</td><td><code>max</code> is a <code>number</code></td></tr>
<tr><td>S7</td><td><code>import { nope }</code></td><td>TS2305</td><td>the module has no such export</td></tr>
<tr><td>S8</td><td><code>const b: boolean = truncate('x', 5)</code></td><td>TS2322</td><td><code>truncate</code> returns a <code>string</code></td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>#</th><th>Lời gọi sai</th><th>tsc phải báo</th><th>Kiểu ép gì</th></tr></thead>
<tbody>
<tr><td>S1</td><td><code>slugify(42)</code></td><td>TS2345</td><td><code>slugify</code> nhận một <code>string</code></td></tr>
<tr><td>S2</td><td><code>truncate('x')</code></td><td>TS2554</td><td><code>truncate</code> cần <code>max</code></td></tr>
<tr><td>S3</td><td><code>const n: number = slugify('x')</code></td><td>TS2322</td><td><code>slugify</code> trả một <code>string</code></td></tr>
<tr><td>S4</td><td><code>isSlug('x').length</code></td><td>TS2339</td><td><code>isSlug</code> trả một <code>boolean</code></td></tr>
<tr><td>S5</td><td><code>SLUG_MAX.toUpperCase()</code></td><td>TS2339</td><td><code>SLUG_MAX</code> là một <code>number</code></td></tr>
<tr><td>S6</td><td><code>truncate('x', '5')</code></td><td>TS2345</td><td><code>max</code> là một <code>number</code></td></tr>
<tr><td>S7</td><td><code>import { nope }</code></td><td>TS2305</td><td>module không có export đó</td></tr>
<tr><td>S8</td><td><code>const b: boolean = truncate('x', 5)</code></td><td>TS2322</td><td><code>truncate</code> trả một <code>string</code></td></tr>
</tbody>
</table>`;
const RUBRIC_EN = `<table>
<thead><tr><th>Part</th><th>Points</th><th>How the grader checks it</th></tr></thead>
<tbody>
<tr><td>A — well-formed</td><td>2</td><td><code>tsc -p</code> on your <code>.d.ts</code> alone compiles</td></tr>
<tr><td>B — correct uses</td><td>1</td><td><code>kiem/phai-dung.ts</code> type-checks against your types</td></tr>
<tr><td>C — honesty</td><td>1</td><td>no <code>any</code>, no <code>@ts-</code> in the declaration</td></tr>
<tr><td>D — behaviour</td><td>2</td><td><code>node --test</code>: the real <code>.js</code> matches the tests</td></tr>
<tr><td>E — wrong calls refused</td><td>4 (8 × 0.5)</td><td>each marked line of <code>kiem/sai.ts</code> has the expected code</td></tr>
</tbody>
</table>`;
const RUBRIC_VI = `<table>
<thead><tr><th>Phần</th><th>Điểm</th><th>Máy chấm kiểm thế nào</th></tr></thead>
<tbody>
<tr><td>A — đúng dạng</td><td>2</td><td><code>tsc -p</code> trên <code>.d.ts</code> của bạn biên dịch được</td></tr>
<tr><td>B — cách dùng đúng</td><td>1</td><td><code>kiem/phai-dung.ts</code> kiểu-kiểm với kiểu của bạn</td></tr>
<tr><td>C — trung thực</td><td>1</td><td>không <code>any</code>, không <code>@ts-</code> trong khai báo</td></tr>
<tr><td>D — hành vi</td><td>2</td><td><code>node --test</code>: <code>.js</code> thật khớp test</td></tr>
<tr><td>E — lời gọi sai bị từ chối</td><td>4 (8 × 0,5)</td><td>mỗi dòng đánh dấu trong <code>kiem/sai.ts</code> có đúng mã</td></tr>
</tbody>
</table>`;

export default {
  title: 'Lab 10 — Write a .d.ts for a JS package|||Lab 10 — Viết một .d.ts cho một package JS',
  slug: 'typescript-10-6-lab-viet-dts',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab Chương 10 — viết một tệp khai báo cho một module JavaScript không kiểu thật (labflow-slug.js, 4 export). Máy chấm chạy tsc + Node: A đúng dạng · B cách dùng đúng · C không any/@ts- · D .js thật qua test · E 8 lời gọi sai bị từ chối. Bản stub any được 6; khai báo đúng (SLUG_MAX number, slugify/truncate/isSlug đúng kiểu) được 10, và .js thật không đổi. Có output thật của "any+optional" 8/10 và "optional max" 9.5/10.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lab 10</span>
<h2>Write a .d.ts for a JS package</h2>
<p class="lead">60–90 minutes. A real untyped JavaScript module, <code>labflow-slug.js</code>, ships with four exports and no types. Your job is to write <code>labflow-slug.d.ts</code> — the declaration file that gives it types — until every wrong call against it is refused. The <code>any</code> stub a teammate left scores <strong>6</strong>; a correct declaration scores 10, and the real <code>.js</code> never changes.</p>

<h3>The module you are typing</h3>
<p>Here is the JavaScript. You do not edit it — you describe it:</p>
${ma('js', CODE.js)}

<h3>An untyped import is unknown</h3>
<p>Before you write anything, importing <code>labflow-slug.js</code> has no types — under strict that is TS7016, and without the declaration every call into it would be <code>any</code>. A single untyped dependency turns off checking for everything that uses it.</p>

<h3>The any stub scores 6</h3>
<p>The teammate’s stub declares every export as <code>any</code>:</p>
${ma('ts', CODE.starterDts)}
${ra(OUT['l3-starter'])}
<p><strong>6/10.</strong> It is well-formed (A) and the tests pass (D), but it checks nothing — <code>slugify(42)</code>, a number read as a string all slip through, and the <code>any</code> costs the honesty point (C). A declaration that exists but does not do its job.</p>

<h3>Your task</h3>
<p>Write <code>labflow-slug.d.ts</code> so <code>npm run lab10</code> prints <strong>Score: 10/10</strong>: declare <code>SLUG_MAX: number</code>, <code>slugify(text: string): string</code>, <code>truncate(text: string, max: number): string</code>, and <code>isSlug(value: string): boolean</code>. No <code>any</code>, no <code>@ts-</code>.</p>

<h3>The eight wrong calls</h3>
${ma('typescript', noc(CODE.sai))}
${BANG_EN}
<p>Every one compiles against the <code>any</code> stub; a correct declaration must refuse each with the code shown.</p>

<h3>What first attempts usually look like</h3>
<p><strong>Attempt A — <code>any</code> on a parameter and an optional max</strong> (<code>lab10/yeu/</code>):</p>
${ra(OUT['l4-yeu'])}
<div class="pitfall co-tieu-de">
<p><strong>Trap — a declaration is only as strict as its loosest signature.</strong> 8/10. You typed most exports but left <code>slugify</code>’s parameter <code>any</code> and made <code>truncate</code>’s <code>max</code> optional. The <code>any</code> costs the honesty point, and the two loosened signatures let <code>slugify(42)</code> (S1) and <code>truncate</code> with no max (S2) slip through.</p>
</div>
<p><strong>Attempt B — an optional parameter</strong> (<code>lab10/vua/</code>):</p>
${ra(OUT['l5-vua'])}
<p>9.5/10 — everything is typed honestly, but <code>truncate</code>’s <code>max</code> is declared optional, so calling it with one argument is accepted (S2 slips). The declaration must match the JavaScript: the real <code>truncate</code> needs its <code>max</code>, so the type must require it too.</p>

<h3>Rubric (10 points, pass mark 7)</h3>
${RUBRIC_EN}

<h3>The reference: 10/10</h3>
${ma('ts', CODE.refDts)}
${ra(OUT['l6-ref'])}
<p>Four lines — one per export, each with the exact types the JavaScript actually has. The declaration is pure type: no bodies, no <code>any</code>, nothing that runs. It describes <code>labflow-slug.js</code> precisely enough that every wrong call is a compile error and every right one compiles, while Node runs the original <code>.js</code> unchanged.</p>

<h3>Before you call it done</h3>
<ul>
<li><code>npm run lab10</code> prints <strong>Score: 10/10</strong>.</li>
<li>No <code>any</code> or <code>@ts-</code> in the declaration; every export has its exact type.</li>
<li>You can say which type refuses each of S1–S8.</li>
<li>Commit: <code>feat(types): declaration file for labflow-slug (lab 10: 10/10)</code>.</li>
</ul>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">declaration file</span><span class="v">A <code>.d.ts</code> — pure type describing some JavaScript.</span></div>
  <div class="kv"><span class="k">sidecar</span><span class="v">A <code>.d.ts</code> next to the <code>.js</code> it types.</span></div>
  <div class="kv"><span class="k">loosest signature</span><span class="v">A declaration is only as strict as its weakest line.</span></div>
  <div class="kv"><span class="k">match the JavaScript</span><span class="v">The type must require exactly what the real code requires.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>An <code>any</code> stub declaration is well-formed and passes the tests but checks nothing — it scores 6.</li>
<li>An <code>any</code> parameter and an optional argument loosen two signatures — 8, letting two wrong calls through.</li>
<li>An optional parameter where the JS requires it scores 9.5 — the type must match the code.</li>
<li>The reference: four exact declarations, no bodies, no <code>any</code> — types for a package that had none.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Declaration Files by Example', 'Declaring functions, values and modules in a .d.ts. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html')}
${nguon('📘', 'TypeScript Handbook — Modules .d.ts', 'The shape of a module declaration file. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Lab 10</span>
<h2>Viết một .d.ts cho một package JS</h2>
<p class="lead">60–90 phút. Một module JavaScript không kiểu thật, <code>labflow-slug.js</code>, giao bốn export và không có kiểu. Việc của bạn là viết <code>labflow-slug.d.ts</code> — tệp khai báo cho nó kiểu — tới khi mọi lời gọi sai với nó bị từ chối. Bản stub <code>any</code> đồng đội để lại được <strong>6</strong>; một khai báo đúng được 10, và <code>.js</code> thật không bao giờ đổi.</p>

<h3>Module bạn đang gõ kiểu</h3>
<p>Đây là JavaScript. Bạn không sửa nó — bạn tả nó:</p>
${ma('js', CODE.js)}

<h3>Một import không kiểu là unknown</h3>
<p>Trước khi bạn viết gì, import <code>labflow-slug.js</code> không có kiểu — dưới strict đó là TS7016, và không có khai báo mọi lời gọi vào nó là <code>any</code>. Một dependency không kiểu tắt phép kiểm cho mọi thứ dùng nó.</p>

<h3>Bản stub any được 6</h3>
<p>Bản stub của đồng đội khai mọi export là <code>any</code>:</p>
${ma('ts', CODE.starterDts)}
${ra(OUT['l3-starter'])}
<p><strong>6/10.</strong> Nó đúng dạng (A) và test qua (D), nhưng nó không kiểm gì — <code>slugify(42)</code>, một number đọc như string đều lọt, và <code>any</code> tốn điểm trung thực (C). Một khai báo tồn tại nhưng không làm việc của nó.</p>

<h3>Việc của bạn</h3>
<p>Viết <code>labflow-slug.d.ts</code> để <code>npm run lab10</code> in <strong>Score: 10/10</strong>: khai <code>SLUG_MAX: number</code>, <code>slugify(text: string): string</code>, <code>truncate(text: string, max: number): string</code>, và <code>isSlug(value: string): boolean</code>. Không <code>any</code>, không <code>@ts-</code>.</p>

<h3>Tám lời gọi sai</h3>
${ma('typescript', noc(CODE.sai))}
${BANG_VI}
<p>Mỗi cái biên dịch được với bản stub <code>any</code>; một khai báo đúng phải từ chối từng cái với mã đã ghi.</p>

<h3>Những lần thử đầu thường trông thế nào</h3>
<p><strong>Thử A — <code>any</code> trên một tham số và một max optional</strong> (<code>lab10/yeu/</code>):</p>
${ra(OUT['l4-yeu'])}
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — một khai báo chỉ chặt bằng chữ ký lỏng nhất của nó.</strong> 8/10. Bạn gõ hầu hết export nhưng để tham số của <code>slugify</code> là <code>any</code> và làm <code>max</code> của <code>truncate</code> optional. <code>any</code> tốn điểm trung thực, và hai chữ ký bị nới cho <code>slugify(42)</code> (S1) và <code>truncate</code> không max (S2) lọt.</p>
</div>
<p><strong>Thử B — một tham số optional</strong> (<code>lab10/vua/</code>):</p>
${ra(OUT['l5-vua'])}
<p>9.5/10 — mọi thứ gõ trung thực, nhưng <code>max</code> của <code>truncate</code> khai optional, nên gọi nó với một đối số được nhận (S2 lọt). Khai báo phải khớp JavaScript: <code>truncate</code> thật cần <code>max</code>, nên kiểu cũng phải đòi nó.</p>

<h3>Thang điểm (10 điểm, đạt 7)</h3>
${RUBRIC_VI}

<h3>Lời giải tham khảo: 10/10</h3>
${ma('ts', CODE.refDts)}
${ra(OUT['l6-ref'])}
<p>Bốn dòng — mỗi export một dòng, mỗi dòng đúng kiểu mà JavaScript thật sự có. Khai báo thuần kiểu: không thân hàm, không <code>any</code>, không gì chạy. Nó tả <code>labflow-slug.js</code> đủ chính xác để mọi lời gọi sai là một lỗi biên dịch và mọi lời gọi đúng biên dịch, còn Node chạy <code>.js</code> gốc nguyên.</p>

<h3>Trước khi coi là xong</h3>
<ul>
<li><code>npm run lab10</code> in <strong>Score: 10/10</strong>.</li>
<li>Không <code>any</code> hay <code>@ts-</code> trong khai báo; mỗi export đúng kiểu của nó.</li>
<li>Bạn nói được kiểu nào từ chối từng S1–S8.</li>
<li>Commit: <code>feat(types): declaration file for labflow-slug (lab 10: 10/10)</code>.</li>
</ul>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">tệp khai báo</span><span class="v">Một <code>.d.ts</code> — thuần kiểu tả một ít JavaScript.</span></div>
  <div class="kv"><span class="k">sidecar</span><span class="v">Một <code>.d.ts</code> cạnh <code>.js</code> nó gõ kiểu.</span></div>
  <div class="kv"><span class="k">chữ ký lỏng nhất</span><span class="v">Một khai báo chỉ chặt bằng dòng yếu nhất của nó.</span></div>
  <div class="kv"><span class="k">khớp JavaScript</span><span class="v">Kiểu phải đòi đúng thứ code thật đòi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một khai báo stub <code>any</code> đúng dạng và qua test nhưng không kiểm gì — nó được 6.</li>
<li>Một tham số <code>any</code> và một đối số optional nới hai chữ ký — 8, cho hai lời gọi sai lọt.</li>
<li>Một tham số optional ở chỗ JS đòi nó được 9.5 — kiểu phải khớp code.</li>
<li>Lời giải: bốn khai báo chính xác, không thân hàm, không <code>any</code> — kiểu cho một package vốn không có.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Declaration Files by Example', 'Khai hàm, giá trị và module trong một .d.ts. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html')}
${nguon('📘', 'TypeScript Handbook — Modules .d.ts', 'Dáng của một tệp khai báo module. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html')}
</div>
`,
};
