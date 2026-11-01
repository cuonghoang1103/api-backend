/**
 * TypeScript · Chương 1 · 1.4 — any, unknown & dùng TypeScript dần dần. Slug giữ từ khung: typescript-1-4-any-unknown.
 * Mọi code/output lấy từ ./_ma-ts-01-4.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2, demo1/ts-01-4/).
 * Giữ từ bản cũ: any = tắt kiểm, unknown = cửa an toàn, JS là TS hợp lệ, thứ tự chuyển đổi, bài học enum của website.
 * Sửa/thêm: số đo thật (máy chấm Lab 1: 3/8 → 1/8; checkJs 14 lỗi; strict 14 vs không strict 1), JSDoc + checkJs, ép kiểu kép, rò Array.isArray.
 */
import G from '../giang/ts-01-4.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-01-4.mjs';

// Output dài ⇒ LỌC dòng (chỉ bỏ dòng, không sửa chữ): giữ dòng lệnh, dòng lỗi chính, dòng kết quả.
const loc = (k, re) => OUT[k].split('\n').filter((l, i) => i === 0 || re.test(l)).join('\n');
const ANY_NODE = loc('41-any-node', /^TypeError/);
const LAN_NODE = loc('42-lan-node', /^PENDING|^TypeError/);
const CHECKJS = OUT['46-checkjs-tsc'].split('\n').filter((l, i) => i <= 2 || /use\.js/.test(l)).join('\n');
const DONG = CODE.jsdocBooking.split('\n');
const JSDOC = [0, 1, 2, -1, 11, 12, -1, 27, 28, -1].map((i) => (i < 0 ? '// …' : DONG[i])).join('\n');

// Bảng S1–S8 dựng từ HAI lần chạy thật của máy chấm Lab 1 (không gõ tay).
const dong = (k) => OUT[k].split('\n').map((l) => /^\s+(✓|✗) (S\d) (.*) — expected (TS\d+), got (.*)$/.exec(l)).filter(Boolean);
const A = dong('43-cham-khoi-dau');
const B = dong('43-cham-yeu');
const o = (m) => (m[1] === '✓' ? '✓ ' + m[5] : '✗ no error');
const ov = (m) => (m[1] === '✓' ? '✓ ' + m[5] : '✗ không lỗi');
const nA = A.filter((m) => m[1] === '✓').length;
const nB = B.filter((m) => m[1] === '✓').length;
const BANG_E_EN = '<table><thead><tr><th></th><th>Wrong call (lab1/kiem/sai.ts)</th><th>Want</th><th>Untouched starter</th><th>Every parameter <code>: any</code></th></tr></thead><tbody>' +
  A.map((m, i) => '<tr><td>' + m[2] + '</td><td>' + m[3] + '</td><td><code>' + m[4] + '</code></td><td>' + o(m) + '</td><td>' + o(B[i]) + '</td></tr>').join('') +
  '<tr><td></td><td><strong>refused</strong></td><td></td><td><strong>' + nA + '/8</strong></td><td><strong>' + nB + '/8</strong></td></tr></tbody></table>';
const BANG_E_VI = '<table><thead><tr><th></th><th>Lời gọi sai (lab1/kiem/sai.ts)</th><th>Cần</th><th>Mã khởi đầu, chưa sửa</th><th>Mọi tham số <code>: any</code></th></tr></thead><tbody>' +
  A.map((m, i) => '<tr><td>' + m[2] + '</td><td>' + m[3] + '</td><td><code>' + m[4] + '</code></td><td>' + ov(m) + '</td><td>' + ov(B[i]) + '</td></tr>').join('') +
  '<tr><td></td><td><strong>bị từ chối</strong></td><td></td><td><strong>' + nA + '/8</strong></td><td><strong>' + nB + '/8</strong></td></tr></tbody></table>';

const DUONG_EN = `<table>
<thead><tr><th>Path</th><th>What you change</th><th>Measured on LabFlow (2 JS files + 3 wrong calls)</th></tr></thead>
<tbody>
<tr><td><strong>A · checkJs</strong></td><td><code>allowJs</code> + <code>checkJs</code> in tsconfig; files stay <code>.js</code></td><td>14 errors: 13 implicit <code>any</code> + 1 real bug (<code>seat</code>)</td></tr>
<tr><td><strong>A+ · JSDoc</strong></td><td>add <code>/** @param {string} start */</code> comments</td><td>3 errors = all 3 wrong calls; Node still runs the <code>.js</code> as is</td></tr>
<tr><td><strong>B · rename, strict</strong></td><td><code>.js</code> → <code>.ts</code>, strict on (TypeScript 7 default)</td><td>14 errors: 6 × TS7006, 7 × TS7031, 1 × TS2561</td></tr>
<tr><td><strong>B′ · rename, not strict</strong></td><td>same, with <code>"strict": false</code></td><td><strong>1 error</strong> — the other 13 became silent <code>any</code></td></tr>
<tr><td><strong>C · strict from day one</strong></td><td>new files start as <code>.ts</code></td><td>no holes to find later</td></tr>
</tbody>
</table>`;
const DUONG_VI = `<table>
<thead><tr><th>Đường</th><th>Bạn đổi gì</th><th>Đo trên LabFlow (2 tệp JS + 3 lời gọi sai)</th></tr></thead>
<tbody>
<tr><td><strong>A · checkJs</strong></td><td><code>allowJs</code> + <code>checkJs</code> trong tsconfig; tệp vẫn là <code>.js</code></td><td>14 lỗi: 13 <code>any</code> ngầm + 1 bug thật (<code>seat</code>)</td></tr>
<tr><td><strong>A+ · JSDoc</strong></td><td>thêm chú thích <code>/** @param {string} start */</code></td><td>3 lỗi = đủ 3 lời gọi sai; Node vẫn chạy nguyên tệp <code>.js</code></td></tr>
<tr><td><strong>B · đổi tên, strict</strong></td><td><code>.js</code> → <code>.ts</code>, bật strict (mặc định của TypeScript 7)</td><td>14 lỗi: 6 × TS7006, 7 × TS7031, 1 × TS2561</td></tr>
<tr><td><strong>B′ · đổi tên, không strict</strong></td><td>như trên, với <code>"strict": false</code></td><td><strong>1 lỗi</strong> — 13 chỗ kia thành <code>any</code> im lặng</td></tr>
<tr><td><strong>C · strict ngay từ đầu</strong></td><td>tệp mới bắt đầu bằng <code>.ts</code></td><td>không có lỗ để tìm sau</td></tr>
</tbody>
</table>`;


export default {
  title: '1.4 — any, unknown & adopting TypeScript gradually|||1.4 — any, unknown & dùng TypeScript dần dần',
  slug: 'typescript-1-4-any-unknown',
  type: 'LESSON',
  isFreePreview: true,
  description: 'any là công tắc tắt kiểm và lây sang mọi thứ chạm vào nó (JSON.parse); số đo thật: máy chấm Lab 1 từ chối 3/8 lời gọi sai trên mã chưa sửa nhưng chỉ 1/8 khi mọi tham số là any; unknown + thu hẹp kiểu (TS18046), rò Array.isArray; any ngầm (TS7006) vs any viết tay; ép kiểu kép as any as X; ba đường chuyển JS sang TS đo trên LabFlow (checkJs 14 lỗi, JSDoc bắt đủ 3, strict 14 vs không strict 1) và thứ tự chuyển đổi của đội thật.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2>any, unknown &amp; adopting TypeScript gradually</h2>
<p class="lead">“any vs unknown?” is a classic junior interview question, and every TypeScript job starts in code full of one or the other. After this lesson you can look at any <code>any</code> in a pull request and say exactly what it switched off, replace it with <code>unknown</code> plus a check, and plan a JavaScript → TypeScript migration that makes a codebase safer instead of just quieter — with numbers measured on LabFlow to back you up.</p>


<h3>any — the off switch</h3>
<p><code>any</code> means “stop checking this value”: it is assignable to and from every type. Every line after the declaration below is a bug:</p>
${ma('typescript', CODE.anyOff)}
${ra(OUT['41-any-tsc'])}
<p>No output from tsc means no errors (exit 0). Now run it:</p>
${ra(ANY_NODE)}
<p>Node finds the first bug by crashing; the other two never run. One word brought back exactly the JavaScript experience TypeScript was built to end.</p>

<h3>any spreads — and JSON.parse returns any</h3>
<p>The dangerous <code>any</code> is usually one you did not type: <code>JSON.parse</code> returns <code>any</code>, and every request body, file and queue message passes through something like it. A LabFlow body with <code>"lecturer"</code> in lower case:</p>
${ma('typescript', CODE.contagion)}
${ra(OUT['42-lan-tsc'])}
${ra(LAN_NODE)}
<p><code>PENDING number</code> is the worst kind of bug — the program <em>running happily and being wrong</em>: <code>'lecturer' === 'LECTURER'</code> is false, so a lecturer waits for approval, and a <code>string</code> variable holds a number. Only then comes a crash, from an unrelated line. Typed input would have been refused on all three lines (lesson 1.1).</p>
<p>A helper that returns <code>JSON.parse(text)</code> is inferred to return <code>any</code>, so everything computed from it is unchecked (slide 5 shows the declarations tsc writes); annotating the return as <code>: unknown</code> stops the spread.</p>
<h3>Measured: adding any made the checker weaker than doing nothing</h3>
<p>Lab 1’s grader holds eight wrong calls to LabFlow’s rules (a number as a time, <code>seat</code>, a lower-case role, a non-existent <code>APPROVED</code>…). We ran it on the untouched starter (JavaScript renamed to <code>.ts</code>) and on a real first attempt that silenced every red line with <code>: any</code> (<code>node scripts/cham-lab-1.mjs</code>, then <code>--from lab1/yeu</code>); the table copies their S1–S8 lines:</p>
${BANG_E_EN}
<p>With no annotations, tsc still inferred enough to catch ${nA}: the two parameters of <code>checkSlot</code>, the destructured <code>seats</code>/<code>role</code>, the <code>minutes</code> field of the result. <code>: any</code> threw that knowledge away — ${nB} of 8. Silencing errors with <code>any</code> is a step backwards that <em>looks</em> like progress.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — <code>as any as X</code> switches the checker off for one value.</strong> A cast (<code>as</code>) tells tsc “treat this value as type X”; tsc still refuses casts between shapes that clearly do not match, so developers reach for the double cast:</p>
${ma('typescript', CODE.doubleCast)}
${ra(OUT['47-ep-kieu-tsc'])}
${ra(OUT['47-ep-kieu-node'])}
<p>The single cast is refused (TS2352 even lists the missing <code>start, end, minutes, status</code>); the double cast compiles and Node prints <code>NaN</code>. tsc’s hint, <code>as unknown as X</code>, is the same escape hatch with a more honest name — not a fix. In review, ask which check a double cast replaced.</p>
</div>

<h3>unknown — the safe door</h3>
<p><code>unknown</code> is the opposite contract: anything can go <em>in</em>, nothing comes <em>out</em> until you prove what it is.</p>
${ma('typescript', CODE.unknown1)}
${ra(OUT['44-unknown-tsc'])}
<p>TS18046 on the property access, TS2322 on the assignment (<code>unknown-2.ts</code> and <code>unknown-3.ts</code> in the same folder compile clean). You prove a value’s type with ordinary JavaScript checks, and after each one tsc <strong>narrows</strong> the type (makes it more precise) inside that branch:</p>
${ma('typescript', CODE.unknown2)}
${ra(OUT['44-unknown-node'])}
<p>The tools are plain JavaScript: <code>typeof x === 'object'</code> plus <code>x !== null</code> (<code>typeof null</code> is <code>'object'</code>), <code>in</code>, <code>typeof seats === 'number'</code>, <code>Array.isArray</code>. Chapter 5 goes deep; the habit now: <strong>outside data is <code>unknown</code> until checked</strong>.</p>
<p>One leak: <code>Array.isArray</code> narrows <code>unknown</code> to <code>any[]</code>, so in <code>unknown-3.ts</code> <code>const total: string = data[0].minutes</code> compiles and holds <code>undefined</code>. Annotate elements yourself: <code>data.map((row: unknown) =&gt; …)</code>.</p>

<h3>Implicit any vs explicit any</h3>
<p><strong>Implicit</strong> <code>any</code>: tsc cannot infer a parameter and would have to guess. <strong>Explicit</strong>: you wrote <code>any</code>.</p>
${ma('typescript', CODE.implicit)}
${ma('typescript', CODE.explicit)}
${ra(OUT['45-ngam-tsc'])}
<p>Strict (the TypeScript 7 default, also set in LabFlow’s tsconfig) includes <code>noImplicitAny</code>, so tsc refuses to guess: TS7006. <code>explicit.ts</code> passes an object where minutes belong and gets <strong>no error</strong> — you asked for no checking. The <code>any</code> to worry about is the one typed on purpose; only review and lint rules (typescript-eslint’s <code>no-explicit-any</code>) catch it. Acceptable uses are rare and commented: a throw-away prototype, a test passing garbage on purpose.</p>

<h3>Adopting TypeScript gradually — three paths, measured</h3>
<p>Every JavaScript program is already valid TypeScript, so adoption goes file by file. We compared the paths on LabFlow’s two original files plus a caller with three mistakes:</p>
${ma('javascript', CODE.use)}
<p>Node alone finds only the first, by crashing (<code>TypeError: Invalid time "480"</code>).</p>
<p><strong>A — keep <code>.js</code></strong> and add <code>"allowJs": true, "checkJs": true</code> to <code>compilerOptions</code>:</p>
${ra(CHECKJS)}
<p>14 errors without touching a line (two TS7006 shown, ten similar filtered out): 13 parameters tsc cannot infer plus the real bug <code>seat</code>. A <code>// @ts-check</code> comment on line 1 does the same for one file.</p>
<p><strong>A+ — JSDoc types</strong>, a comment format TypeScript understands:</p>
${ma('javascript', JSDOC)}
${ra(OUT['46-jsdoc-tsc'])}
<p>All three wrong calls caught (TS2345, TS2561 ×2), and Node runs these <code>.js</code> files unchanged — a legitimate end state for code that must stay JavaScript.</p>
<p><strong>B — rename to <code>.ts</code></strong> under strict:</p>
${ra(OUT['46-strict-loai'])}
<p>14 reds: 13 places to type, 1 real bug. The tempting shortcut — <code>"strict": false</code> in the folder’s tsconfig:</p>
${ra(OUT['46-long-tsc'])}
<p><strong>One</strong> error: the 13 parameters are now silent <code>any</code>, and every wrong call through them compiles. A non-strict migration reports less because it looks at less.</p>
<p><strong>C — strict from day one</strong> for new files; with TypeScript 7 it is the default.</p>
${DUONG_EN}

<h3>The order real teams migrate in — and why</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Type the edges</div><div class="lz-d">parameters and exported return types first</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">unknown at the boundary</div><div class="lz-d">JSON, request bodies, files, env — then narrow</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Strict on, never off</div><div class="lz-d">fix reds file by file; do not silence them</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Guard in review + CI</div><div class="lz-d">no unexplained any; tsc --noEmit must pass</div></div>
</div>

<p>Why “import types, never retype them”: on 8 August 2026 this website renamed an enum value (<code>CODE</code> → <code>CODE_REVIEW</code>); every check passed and production broke, because the seed script kept a hand-written copy outside the type check (lesson 0.9 replays it). A copied type and an <code>any</code> are the same hole. And when an interviewer asks “any vs unknown?”, the 3/8 vs 1/8 measurement is your answer.</p>


<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p>LabFlow loads a lab’s booking history from JSON text. This version uses <code>any</code> and one row has a typo (<code>minute</code>):</p>
${ma('typescript', CODE.thTruoc)}
${ra(OUT['48-th-truoc-node'])}
<ol>
<li>Copy it to <code>demo1/th14/history.ts</code> and run it: tsc is silent and the program prints <code>usage: NaN</code>.</li>
<li>Change <code>loadHistory</code> to return <code>{ minutes: number }[]</code> and type the parsed value as <code>unknown</code>.</li>
<li>Narrow step by step: not a list ⇒ throw <code>TypeError('history must be a list')</code>; a row without a numeric <code>minutes</code> ⇒ throw <code>TypeError('row ' + i + ': minutes must be a number')</code>. Do not use <code>any</code> or <code>as</code> anywhere — annotate the row as <code>unknown</code> to avoid the <code>Array.isArray</code> leak.</li>
<li>Try three inputs: a good history, the one with <code>minute</code>, and a single object instead of a list.</li>
</ol>
<p><strong>Solution and real output:</strong></p>
${ma('typescript', CODE.thSau)}
${ra(OUT['48-th-sau-tsc'])}
${ra(OUT['48-th-sau-node'])}
<p><strong>Done when:</strong> tsc reports nothing, the good history prints <code>usage: 0.75</code> (630 of 840 opening minutes), the typo row is <em>rejected</em> with a message naming row 1 instead of producing <code>NaN</code>, and your file contains neither <code>any</code> nor <code>as</code>.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">any</span><span class="v">The type that switches checking off; assignable to and from everything; spreads to whatever is computed from it.</span></div>
  <div class="kv"><span class="k">unknown</span><span class="v">The safe “I do not know yet” type: accepts any value, allows nothing until you narrow it.</span></div>
  <div class="kv"><span class="k">narrowing</span><span class="v">tsc making a type more precise inside a branch after a check (<code>typeof</code>, <code>in</code>, <code>Array.isArray</code>…).</span></div>
  <div class="kv"><span class="k">implicit any · noImplicitAny</span><span class="v">A type tsc would have to guess; under strict, <code>noImplicitAny</code> refuses (TS7006/TS7031).</span></div>
  <div class="kv"><span class="k">type assertion (as)</span><span class="v">Telling tsc to treat a value as a type; not a conversion and not a check. <code>as any as X</code> bypasses every check.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>any</code> turns checking off and spreads; <code>JSON.parse</code> returns it, so every request body starts as <code>any</code> unless you say otherwise.</li>
<li>Measured on Lab 1: the untouched starter refused ${nA}/8 wrong calls, the all-<code>any</code> attempt ${nB}/8 — <code>any</code> made things worse than doing nothing.</li>
<li><code>unknown</code> accepts everything and allows nothing until you narrow it; watch the <code>Array.isArray</code> → <code>any[]</code> leak.</li>
<li>Strict refuses implicit <code>any</code> (TS7006) but obeys explicit <code>any</code>; the double cast <code>as any as X</code> silences even TS2352.</li>
<li>Migration paths on LabFlow: checkJs 14 errors, JSDoc caught all 3 bugs, rename + strict 14, rename without strict only 1 (13 silent holes).</li>
<li>Order: edges first, <code>unknown</code> at boundaries, strict on and never off, guard with review and CI; import types, never copy them.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — More on Functions: unknown, any', 'Official explanation of unknown as the safe counterpart of any (read 1 Nov 2026).', 'https://www.typescriptlang.org/docs/handbook/2/functions.html')}
${nguon('🚚', 'TypeScript Handbook — Migrating from JavaScript', 'The official step-by-step migration guide: allowJs, checkJs, strictness (read 1 Nov 2026).', 'https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html')}
${lienKet({ khoa: 'front-end-web-development-with-react', bai: 'fer202-5-4-slot13-proptypes-slides', title: 'Also in FER202 — 5.4: validating props with PropTypes', sub: 'Same: describing what values a piece of code accepts, and catching a wrong one. Different: PropTypes checks at runtime, in development only, one component at a time; TypeScript checks every call site at compile time, before anything runs — and unknown + narrowing is how you keep a runtime check where you still need one.', cta: 'OPEN FER202 LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2>any, unknown &amp; dùng TypeScript dần dần</h2>
<p class="lead">“any khác unknown?” là câu phỏng vấn junior kinh điển, và việc TypeScript nào cũng bắt đầu trong code đầy một trong hai thứ đó. Học xong bài này, nhìn một chữ <code>any</code> trong pull request bạn nói được chính xác nó đã tắt cái gì, thay nó bằng <code>unknown</code> cộng một phép kiểm, và lên kế hoạch chuyển JavaScript → TypeScript làm codebase an toàn hơn chứ không chỉ im lặng hơn — có số đo trên LabFlow làm chỗ dựa.</p>


<h3>any — công tắc tắt kiểm</h3>
<p><code>any</code> nghĩa là “thôi đừng kiểm giá trị này”: nó gán được vào và gán được từ mọi kiểu. Mọi dòng sau khai báo dưới đây đều là bug:</p>
${ma('typescript', CODE.anyOff)}
${ra(OUT['41-any-tsc'])}
<p>tsc không in gì nghĩa là không lỗi (exit 0). Giờ chạy thử:</p>
${ra(ANY_NODE)}
<p>Node tìm ra bug đầu tiên bằng cách sập; hai dòng kia chưa kịp chạy. Một chữ đã kéo trở lại đúng trải nghiệm JavaScript mà TypeScript sinh ra để chấm dứt.</p>

<h3>any lây lan — và JSON.parse trả về any</h3>
<p><code>any</code> nguy hiểm thường là cái bạn không gõ: <code>JSON.parse</code> trả về <code>any</code>, và mọi request body, tệp, tin nhắn hàng đợi đều đi qua thứ tương tự. Một body của LabFlow có <code>"lecturer"</code> viết thường:</p>
${ma('typescript', CODE.contagion)}
${ra(OUT['42-lan-tsc'])}
${ra(LAN_NODE)}
<p><code>PENDING number</code> là loại bug tệ nhất — chương trình <em>chạy vui vẻ mà sai</em>: <code>'lecturer' === 'LECTURER'</code> là false nên giảng viên phải chờ duyệt, và một biến <code>string</code> giữ một số. Chỉ sau đó mới sập, ở một dòng chẳng liên quan. Đầu vào có kiểu thì cả ba dòng đã bị từ chối (bài 1.1).</p>
<p>Hàm tiện ích trả <code>JSON.parse(text)</code> được suy là trả về <code>any</code>, nên mọi thứ tính từ nó đều không được kiểm (slide 5 cho thấy khai báo tsc ghi ra); chú thích kiểu trả về <code>: unknown</code> chặn sự lây lan.</p>
<h3>Đo thật: thêm any làm trình kiểm yếu hơn cả không làm gì</h3>
<p>Máy chấm Lab 1 có tám lời gọi sai vào luật của LabFlow (số ở chỗ giờ, <code>seat</code>, vai trò viết thường, <code>APPROVED</code> không tồn tại…). Ta chạy nó trên mã khởi đầu chưa sửa (JavaScript đổi đuôi <code>.ts</code>) và trên một lần thử đầu thật dập mọi dòng đỏ bằng <code>: any</code> (<code>node scripts/cham-lab-1.mjs</code>, rồi <code>--from lab1/yeu</code>); bảng chép đúng các dòng S1–S8:</p>
${BANG_E_VI}
<p>Chưa có chú thích nào, tsc vẫn suy đủ để bắt ${nA}: hai tham số của <code>checkSlot</code>, phần bóc <code>seats</code>/<code>role</code>, trường <code>minutes</code> của kết quả. <code>: any</code> vứt bỏ hiểu biết đó — còn ${nB}/8. Dập lỗi bằng <code>any</code> là bước lùi <em>trông</em> như tiến bộ.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — <code>as any as X</code> tắt trình kiểm cho một giá trị.</strong> Ép kiểu (<code>as</code>, type assertion) bảo tsc “coi giá trị này là kiểu X”; tsc vẫn từ chối ép giữa hai dáng rõ ràng không khớp, nên người ta dùng ép kiểu kép:</p>
${ma('typescript', CODE.doubleCast)}
${ra(OUT['47-ep-kieu-tsc'])}
${ra(OUT['47-ep-kieu-node'])}
<p>Ép đơn bị từ chối (TS2352 còn liệt kê thứ thiếu <code>start, end, minutes, status</code>); ép kép biên dịch được và Node in <code>NaN</code>. Gợi ý của tsc, <code>as unknown as X</code>, là cùng lối thoát với cái tên thật thà hơn — không phải cách sửa. Khi review, hỏi ép kiểu kép đã thay cho phép kiểm nào.</p>
</div>

<h3>unknown — cánh cửa an toàn</h3>
<p><code>unknown</code> là hợp đồng ngược lại: gì cũng vào <em>được</em>, không gì ra <em>được</em> cho tới khi bạn chứng minh nó là gì.</p>
${ma('typescript', CODE.unknown1)}
${ra(OUT['44-unknown-tsc'])}
<p>TS18046 ở chỗ đọc thuộc tính, TS2322 ở phép gán (<code>unknown-2.ts</code> và <code>unknown-3.ts</code> cùng thư mục không lỗi). Bạn chứng minh kiểu bằng phép kiểm JavaScript bình thường, và sau mỗi phép tsc <strong>thu hẹp</strong> (narrowing — làm kiểu chính xác hơn) trong nhánh đó:</p>
${ma('typescript', CODE.unknown2)}
${ra(OUT['44-unknown-node'])}
<p>Công cụ là JavaScript thuần: <code>typeof x === 'object'</code> kèm <code>x !== null</code> (<code>typeof null</code> là <code>'object'</code>), <code>in</code>, <code>typeof seats === 'number'</code>, <code>Array.isArray</code>. Chương 5 đi sâu; thói quen lúc này: <strong>dữ liệu từ ngoài là <code>unknown</code> cho tới khi được kiểm</strong>.</p>
<p>Một chỗ rò: <code>Array.isArray</code> thu hẹp <code>unknown</code> thành <code>any[]</code>, nên trong <code>unknown-3.ts</code> <code>const total: string = data[0].minutes</code> biên dịch được và giữ <code>undefined</code>. Tự chú thích phần tử: <code>data.map((row: unknown) =&gt; …)</code>.</p>

<h3>any ngầm và any viết tay</h3>
<p><code>any</code> <strong>ngầm</strong> (implicit): tsc không suy được kiểu tham số và lẽ ra phải đoán. <strong>Viết tay</strong> (explicit): bạn gõ <code>any</code>.</p>
${ma('typescript', CODE.implicit)}
${ma('typescript', CODE.explicit)}
${ra(OUT['45-ngam-tsc'])}
<p>Strict (mặc định của TypeScript 7, tsconfig của LabFlow cũng ghi) gồm <code>noImplicitAny</code>, nên tsc từ chối đoán: TS7006. <code>explicit.ts</code> truyền object vào chỗ số phút mà <strong>không lỗi nào</strong> — bạn xin đừng kiểm. <code>any</code> đáng lo là cái được cố ý gõ; chỉ review và luật lint (<code>no-explicit-any</code> của typescript-eslint) bắt được. Trường hợp chấp nhận được rất hiếm và phải có chú thích: bản thử sẽ xoá, test cố ý truyền rác.</p>

<h3>Dùng TypeScript dần dần — ba con đường, có số đo</h3>
<p>Mọi chương trình JavaScript đã là TypeScript hợp lệ, nên chuyển đổi đi từng tệp. Ta so các đường trên hai tệp gốc của LabFlow cộng một tệp gọi có ba lỗi:</p>
${ma('javascript', CODE.use)}
<p>Node một mình chỉ tìm ra lỗi đầu, bằng cách sập (<code>TypeError: Invalid time "480"</code>).</p>
<p><strong>A — giữ <code>.js</code></strong> và thêm <code>"allowJs": true, "checkJs": true</code> vào <code>compilerOptions</code>:</p>
${ra(CHECKJS)}
<p>14 lỗi mà không sửa dòng nào (hiện hai dòng TS7006, mười dòng tương tự đã lọc): 13 tham số tsc không suy được cộng bug thật <code>seat</code>. Chú thích <code>// @ts-check</code> ở dòng 1 làm điều tương tự cho một tệp.</p>
<p><strong>A+ — kiểu bằng JSDoc</strong>, định dạng chú thích mà TypeScript hiểu:</p>
${ma('javascript', JSDOC)}
${ra(OUT['46-jsdoc-tsc'])}
<p>Bắt đủ ba lời gọi sai (TS2345, TS2561 ×2), và Node chạy nguyên các tệp <code>.js</code> này — điểm đến hợp lệ cho code buộc phải giữ là JavaScript.</p>
<p><strong>B — đổi tên thành <code>.ts</code></strong> dưới strict:</p>
${ra(OUT['46-strict-loai'])}
<p>14 dòng đỏ: 13 chỗ cần gõ kiểu, 1 bug thật. Lối tắt hấp dẫn — <code>"strict": false</code> trong tsconfig của thư mục:</p>
${ra(OUT['46-long-tsc'])}
<p><strong>Một</strong> lỗi: 13 tham số giờ là <code>any</code> im lặng, và mọi lời gọi sai qua chúng đều biên dịch được. Chuyển đổi không strict báo ít hơn vì nó nhìn ít hơn.</p>
<p><strong>C — strict ngay từ đầu</strong> cho tệp mới; với TypeScript 7 đây là mặc định.</p>
${DUONG_VI}

<h3>Thứ tự chuyển đổi của các đội thật — và vì sao</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Gõ kiểu ở mép</div><div class="lz-d">tham số và kiểu trả về được export trước</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">unknown ở biên</div><div class="lz-d">JSON, request body, tệp, env — rồi thu hẹp</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Bật strict, không tắt</div><div class="lz-d">sửa từng tệp; không dập lỗi</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Canh ở review + CI</div><div class="lz-d">không any thiếu giải thích; tsc --noEmit phải qua</div></div>
</div>

<p>Vì sao “import kiểu, đừng gõ lại”: ngày 8/8/2026 website này đổi tên một giá trị enum (<code>CODE</code> → <code>CODE_REVIEW</code>); mọi phép kiểm đều qua mà production vẫn vỡ, vì script seed giữ một bản chép tay nằm ngoài phạm vi kiểm kiểu (bài 0.9 tái hiện lại). Kiểu chép tay và <code>any</code> là cùng một loại lỗ. Và khi phỏng vấn hỏi “any khác unknown?”, phép đo 3/8 so với 1/8 chính là câu trả lời.</p>


<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<p>LabFlow nạp lịch sử đặt phòng của một lab từ chuỗi JSON. Bản này dùng <code>any</code> và một dòng có lỗi gõ (<code>minute</code>):</p>
${ma('typescript', CODE.thTruoc)}
${ra(OUT['48-th-truoc-node'])}
<ol>
<li>Chép vào <code>demo1/th14/history.ts</code> và chạy: tsc im lặng còn chương trình in <code>usage: NaN</code>.</li>
<li>Đổi <code>loadHistory</code> thành trả về <code>{ minutes: number }[]</code> và gõ kiểu giá trị vừa parse là <code>unknown</code>.</li>
<li>Thu hẹp từng bước: không phải danh sách ⇒ ném <code>TypeError('history must be a list')</code>; dòng không có <code>minutes</code> kiểu số ⇒ ném <code>TypeError('row ' + i + ': minutes must be a number')</code>. Không dùng <code>any</code> hay <code>as</code> ở đâu cả — gõ kiểu dòng là <code>unknown</code> để tránh chỗ rò <code>Array.isArray</code>.</li>
<li>Thử ba đầu vào: lịch sử đúng, cái có <code>minute</code>, và một object đơn thay vì danh sách.</li>
</ol>
<p><strong>Lời giải và output thật:</strong></p>
${ma('typescript', CODE.thSau)}
${ra(OUT['48-th-sau-tsc'])}
${ra(OUT['48-th-sau-node'])}
<p><strong>Đạt khi:</strong> tsc không báo gì, lịch sử đúng in <code>usage: 0.75</code> (630 trên 840 phút mở cửa), dòng lỗi gõ bị <em>từ chối</em> kèm thông báo chỉ đúng dòng 1 thay vì ra <code>NaN</code>, và tệp của bạn không có <code>any</code> lẫn <code>as</code>.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">any</span><span class="v">Kiểu tắt kiểm; gán vào và gán từ mọi thứ; lây sang mọi thứ tính từ nó.</span></div>
  <div class="kv"><span class="k">unknown</span><span class="v">Kiểu an toàn cho “chưa biết”: nhận mọi giá trị, không cho làm gì tới khi thu hẹp.</span></div>
  <div class="kv"><span class="k">narrowing (thu hẹp kiểu)</span><span class="v">tsc làm kiểu chính xác hơn trong một nhánh sau phép kiểm (<code>typeof</code>, <code>in</code>, <code>Array.isArray</code>…).</span></div>
  <div class="kv"><span class="k">implicit any · noImplicitAny (any ngầm)</span><span class="v">Kiểu mà tsc phải đoán; dưới strict, <code>noImplicitAny</code> từ chối (TS7006/TS7031).</span></div>
  <div class="kv"><span class="k">type assertion — as (ép kiểu)</span><span class="v">Bảo tsc coi một giá trị là một kiểu; không chuyển đổi, không kiểm. <code>as any as X</code> vượt qua mọi phép kiểm.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>any</code> tắt kiểm và lây; <code>JSON.parse</code> trả về nó, nên mọi request body khởi đầu là <code>any</code> nếu bạn không nói khác.</li>
<li>Đo trên Lab 1: mã khởi đầu chưa sửa từ chối ${nA}/8 lời gọi sai, lần thử toàn <code>any</code> chỉ ${nB}/8 — <code>any</code> làm tệ hơn cả không làm gì.</li>
<li><code>unknown</code> nhận mọi thứ và không cho gì tới khi bạn thu hẹp; coi chừng rò <code>Array.isArray</code> → <code>any[]</code>.</li>
<li>Strict từ chối <code>any</code> ngầm (TS7006) nhưng nghe theo <code>any</code> viết tay; ép kiểu kép <code>as any as X</code> dập cả TS2352.</li>
<li>Ba đường trên LabFlow: checkJs 14 lỗi, JSDoc bắt đủ 3 bug, đổi tên + strict 14, đổi tên không strict chỉ 1 (13 lỗ im lặng).</li>
<li>Thứ tự: mép trước, <code>unknown</code> ở biên, bật strict và không tắt, canh bằng review và CI; import kiểu, đừng chép.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — More on Functions: unknown, any', 'Giải thích chính thức: unknown là bản an toàn của any (đọc ngày 1/11/2026).', 'https://www.typescriptlang.org/docs/handbook/2/functions.html')}
${nguon('🚚', 'TypeScript Handbook — Migrating from JavaScript', 'Hướng dẫn chuyển đổi chính thức: allowJs, checkJs, mức strict (đọc ngày 1/11/2026).', 'https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html')}
${lienKet({ khoa: 'front-end-web-development-with-react', bai: 'fer202-5-4-slot13-proptypes-slides', title: 'Đã gặp ở FER202 — 5.4: kiểm props bằng PropTypes', sub: 'Giống: mô tả một đoạn code nhận giá trị nào, và bắt giá trị sai. Khác: PropTypes kiểm lúc chạy, chỉ ở development, từng component một; TypeScript kiểm mọi nơi gọi lúc biên dịch, trước khi chạy gì cả — còn unknown + thu hẹp kiểu là cách giữ phép kiểm lúc chạy ở chỗ bạn vẫn cần nó.', cta: 'MỞ BÀI FER202 →' })}
</div>
`,
};
