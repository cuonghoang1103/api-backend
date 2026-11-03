/**
 * TypeScript · Chương 5 · 5.2 — Union literal & thu hẹp theo giá trị. Slug giữ: typescript-5-2-literal-union.
 * Soạn lại TRỌN 03/11/2026 theo ./_HOP-DONG.md. Code/output từ ./_ma-ts-05-2.mjs (demo5/ts-05-2, Node 22.23.3 + tsc 7.0.2).
 */
import G from '../giang/ts-05-2.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-05-2.mjs';

const BANG_EN = `<table>
<thead><tr><th>Shape of the union</th><th>Narrow by</th><th>Example</th></tr></thead>
<tbody>
<tr><td>literal union (<code>'A' | 'B'</code>)</td><td><code>===</code> / <code>switch</code> on the value</td><td><code>role === 'ADMIN'</code>, <code>switch (code)</code></td></tr>
<tr><td>objects with a shared tag</td><td><code>===</code> on the tag field</td><td><code>if (r.ok)</code> — a discriminated union (5.3)</td></tr>
<tr><td>objects with different keys</td><td><code>'key' in obj</code></td><td><code>if ('email' in contact)</code></td></tr>
<tr><td>class instances / errors</td><td><code>instanceof</code></td><td><code>if (e instanceof RangeError)</code></td></tr>
<tr><td>two variables of related types</td><td><code>===</code> between them</td><td><code>if (a === b)</code> narrows both</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Dáng của union</th><th>Thu hẹp bằng</th><th>Ví dụ</th></tr></thead>
<tbody>
<tr><td>union literal (<code>'A' | 'B'</code>)</td><td><code>===</code> / <code>switch</code> theo giá trị</td><td><code>role === 'ADMIN'</code>, <code>switch (code)</code></td></tr>
<tr><td>object có một nhãn chung</td><td><code>===</code> trên trường nhãn</td><td><code>if (r.ok)</code> — discriminated union (5.3)</td></tr>
<tr><td>object có khoá khác nhau</td><td><code>'key' in obj</code></td><td><code>if ('email' in contact)</code></td></tr>
<tr><td>thực thể lớp / lỗi</td><td><code>instanceof</code></td><td><code>if (e instanceof RangeError)</code></td></tr>
<tr><td>hai biến kiểu liên quan</td><td><code>===</code> giữa chúng</td><td><code>if (a === b)</code> thu hẹp cả hai</td></tr>
</tbody>
</table>`;

export default {
  title: '5.2 — Literal unions & narrowing by value|||5.2 — Union literal & thu hẹp theo giá trị',
  slug: 'typescript-5-2-literal-union',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Thu hẹp theo GIÁ TRỊ, không chỉ theo kiểu. SlotResult của LabFlow ({ok:true;minutes} | {ok:false;code}) — đọc r.minutes mà chưa kiểm r.ok là TS2339; test r.ok thì tsc thu hẹp cả object. switch trên union literal (SlotCode) đầy đủ mà không cần default. Toán tử in cho object khác khoá, instanceof cho lỗi trong catch (e là unknown ⇒ TS18046 trước khi narrow). So literal ngoài union ⇒ TS2367. Mọi output đo thật bằng tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Literal unions &amp; narrowing by value</h2>
<p class="lead">Lesson 5.1 narrowed by <em>type</em> (<code>typeof</code>, truthiness). Most LabFlow unions are narrowed by <em>value</em> instead: a <code>Role</code> is one of three exact strings, a <code>SlotResult</code> is tagged “ok” or not, an error in a <code>catch</code> is <code>unknown</code> until you ask what it is. This lesson covers the value guards — <code>===</code>, <code>switch</code>, <code>in</code>, <code>instanceof</code> — on real LabFlow results, and leads straight into the discriminated union of 5.3.</p>

<h3>LabFlow’s own union: <code>SlotResult</code></h3>
<p>From Chapter 1, <code>checkSlot</code> returns <code>{ ok: true; minutes: number } | { ok: false; code: SlotCode }</code>. The minutes live on only one member, so you cannot read them blind:</p>
${ma('typescript', CODE.slotBad)}
${ra(OUT['11-slot-bad'])}
<p><strong>TS2339</strong>, and the second line names the member without <code>minutes</code>: <code>{ ok: false; code: SlotCode }</code>. The fix is one test on the tag field <code>ok</code>; because every member has <code>ok</code> with a different literal (<code>true</code> / <code>false</code>), testing it narrows the whole object:</p>
${ma('typescript', CODE.slotUse)}
${ra(OUT['12-slot-use'])}
<p>Inside <code>if (r.ok)</code> the type is <code>{ ok: true; minutes: number }</code> — <code>r.minutes</code> is there; in the <code>else</code> it is <code>{ ok: false; code: SlotCode }</code> — <code>r.code</code> is there. This tagged shape is a <strong>discriminated union</strong>, the subject of 5.3; here it is simply the most common union you will narrow.</p>

<h3>Narrowing a literal union with <code>switch</code></h3>
<p><code>SlotCode</code> is a union of four exact strings. A <code>switch</code> on the value narrows to one literal per case:</p>
${ma('typescript', CODE.switchMsg)}
${ra(OUT['13-switch'])}
<p>Notice there is <strong>no <code>default</code></strong> and tsc is happy — it can see the four cases cover <code>SlotCode</code> exactly. If a fifth code were added to the union, this function would stop compiling (the declared return type <code>string</code> could no longer be guaranteed). That free check is the reason to narrow by value on a literal union rather than on <code>string</code>; 5.4 makes the check explicit with <code>never</code>.</p>

<h3>The <code>in</code> operator: objects with different keys</h3>
<p>When two shapes have no shared tag, test for a key that only one of them has:</p>
${ma('typescript', CODE.inContact)}
${ra(OUT['14-in'])}
<p><code>'email' in c</code> narrows <code>c</code> to the member that declares <code>email</code>; the <code>else</code> is the other. <code>in</code> is the tool for a quick object union, but a shared tag (5.3) is clearer and survives refactors — a key can be optional or shared, a tag cannot.</p>

<h3><code>instanceof</code>: the error in a <code>catch</code> is <code>unknown</code></h3>
<p><code>needsApproval</code> (Chapter 3) throws a <code>RangeError</code> for a bad seat count. In TypeScript, the variable in a <code>catch</code> is typed <code>unknown</code> — anything can be thrown, so you must narrow before you touch it:</p>
${ma('typescript', CODE.catchBad)}
${ra(OUT['15-catch-bad'])}
<p><strong>TS18046: 'e' is of type 'unknown'</strong> — the same wall as reading a value off <code>unknown</code> in 1.4. <code>instanceof</code> narrows it to a real error type:</p>
${ma('typescript', CODE.catchApprove)}
${ra(OUT['16-catch-run'])}
<p>Inside <code>if (e instanceof RangeError)</code>, <code>e</code> is a <code>RangeError</code>, so <code>e.message</code> is safe — the output shows the real message. <code>instanceof</code> works on anything with a constructor: <code>Error</code> and its subclasses, DOM nodes, your own classes (Chapter 14). It does <em>not</em> work on a type alias or interface — those do not exist at runtime (0.4), so there is nothing to be an instance of.</p>

<h3>Comparing with a literal outside the union</h3>
<p><code>Role</code> is <code>'STUDENT' | 'LECTURER' | 'ADMIN'</code>. A very common bug is testing for a value that is not in the union:</p>
${ma('typescript', CODE.typoRole)}
${ra(OUT['17-typo'])}
<p><strong>TS2367: This comparison appears to be unintentional because the types 'Role' and '"TEACHER"' have no overlap.</strong> In JavaScript <code>role === 'TEACHER'</code> is simply always <code>false</code>, and the <code>LECTURER</code> case is quietly never matched. Because <code>Role</code> is a literal union, tsc knows the comparison can never be true and refuses it. A string typed as <code>string</code> would not get this check — one more reason to use literal unions for a fixed set of values (2.4).</p>

<h3>Equality narrows both sides</h3>
${ma('typescript', CODE.equalitySame)}
${ra(OUT['18-equality'])}
<p><code>a</code> is <code>string | number</code> and <code>b</code> is <code>string</code>. Inside <code>if (a === b)</code>, tsc reasons that if they are equal, <code>a</code> must be the <code>string</code> branch, so <code>a.length</code> is allowed. Equality between two values narrows both to their common type — handy when one is a wide union and the other is already specific.</p>

<h3>Which value guard, when</h3>
${BANG_EN}

<h3>💼 Interview corner</h3>
<p><strong>“Why is the <code>catch</code> variable <code>unknown</code>?”</strong> Because JavaScript can <code>throw</code> anything, not just an <code>Error</code>; <code>unknown</code> forces you to narrow (usually <code>instanceof Error</code>) before reading <code>.message</code>. <strong>“<code>in</code> or a discriminated union?”</strong> <code>in</code> for a quick two-shape union; a shared literal tag (5.3) when the union grows or the shapes share keys. <strong>“What does TS2367 mean?”</strong> You compared a value with a literal it can never equal — usually a typo or a value missing from the union.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p><code>demo5/ts-05-2/practice/start/report.ts</code> — turn a <code>SlotResult</code> into a UI line. It does not compile:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['19-pr-start'])}
<ol>
<li>Which member lacks <code>minutes</code>? Narrow on <code>r.ok</code> so the ok branch shows the minutes and the other shows the code.</li>
<li>Run it on one good slot and one off-grid slot.</li>
</ol>
<p><strong>Solution</strong>:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['20-pr-sol'])}
<p><strong>Done when:</strong> tsc is clean and Node prints <code>OK, 120 minutes</code> then <code>REFUSED: OFF_GRID</code>. Code Lab adds: a <code>switch</code> over <code>SlotCode</code> that needs no default, an <code>in</code>-narrowed contact, and an <code>instanceof</code> guard in a <code>catch</code>.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">literal union</span><span class="v">A union of exact values: <code>'STUDENT' | 'LECTURER' | 'ADMIN'</code>.</span></div>
  <div class="kv"><span class="k">tag / discriminant</span><span class="v">A field every member has with a different literal (<code>ok</code>, <code>step</code>) — test it to narrow (5.3).</span></div>
  <div class="kv"><span class="k"><code>in</code> narrowing</span><span class="v"><code>'key' in obj</code> narrows to the members that declare that key.</span></div>
  <div class="kv"><span class="k"><code>instanceof</code> narrowing</span><span class="v">Narrows to a class — the only guard that works on <code>catch</code>’s <code>unknown</code> and DOM nodes.</span></div>
  <div class="kv"><span class="k">TS2367</span><span class="v">A comparison that can never be true — a literal outside the union.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>SlotResult</code> is narrowed by its tag: <code>r.minutes</code> blind is TS2339; <code>if (r.ok)</code> narrows the whole object.</li>
<li>A <code>switch</code> over a literal union (<code>SlotCode</code>) needs no <code>default</code> — tsc sees the cases are complete.</li>
<li><code>'key' in obj</code> narrows object unions with different keys; <code>instanceof</code> narrows classes and the <code>unknown</code> of a <code>catch</code>.</li>
<li>Comparing a literal union with a value outside it is TS2367 — a typo caught at compile time.</li>
<li>Equality (<code>a === b</code>) narrows both operands to their common type.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Narrowing: in, instanceof, equality', 'The in operator, instanceof, and equality narrowing. Read 3 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-in-operator-narrowing')}
${nguon('📘', 'TypeScript 4.4 — Using unknown in catch variables', 'useUnknownInCatchVariables (on under strict): the catch binding is unknown. Read 3 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-4.html#defaulting-to-the-unknown-type-in-catch-variables---useunknownincatchvariables')}
${lienKet({ khoa: 'api-design', bai: 'api-2-1-problem-details', title: 'The same tagged result at the API edge — API Design 2.1: Problem Details for errors', sub: 'Same: a response is “success or failure”, and the client reads a tag to tell them apart — exactly SlotResult’s ok flag. Different: there the envelope is an HTTP status plus a Problem Details body over the wire; here the tag is a TypeScript discriminated union tsc narrows at compile time, and the catch variable is unknown until you narrow with instanceof.', cta: 'OPEN API DESIGN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Union literal &amp; thu hẹp theo giá trị</h2>
<p class="lead">Bài 5.1 thu hẹp theo <em>kiểu</em> (<code>typeof</code>, đúng/sai). Phần lớn union của LabFlow lại thu hẹp theo <em>giá trị</em>: một <code>Role</code> là một trong ba chuỗi chính xác, một <code>SlotResult</code> được gắn nhãn “ok” hay không, một lỗi trong <code>catch</code> là <code>unknown</code> cho tới khi bạn hỏi nó là gì. Bài này đi qua các guard theo giá trị — <code>===</code>, <code>switch</code>, <code>in</code>, <code>instanceof</code> — trên kết quả thật của LabFlow, và dẫn thẳng tới discriminated union của 5.3.</p>

<h3>Union của chính LabFlow: <code>SlotResult</code></h3>
<p>Từ Chương 1, <code>checkSlot</code> trả về <code>{ ok: true; minutes: number } | { ok: false; code: SlotCode }</code>. minutes chỉ nằm trên một thành viên, nên không đọc mù được:</p>
${ma('typescript', CODE.slotBad)}
${ra(OUT['11-slot-bad'])}
<p><strong>TS2339</strong>, và dòng thứ hai gọi tên thành viên không có <code>minutes</code>: <code>{ ok: false; code: SlotCode }</code>. Cách sửa là một phép thử trên trường nhãn <code>ok</code>; vì mọi thành viên có <code>ok</code> với literal khác nhau (<code>true</code> / <code>false</code>), thử nó thu hẹp cả object:</p>
${ma('typescript', CODE.slotUse)}
${ra(OUT['12-slot-use'])}
<p>Trong <code>if (r.ok)</code> kiểu là <code>{ ok: true; minutes: number }</code> — có <code>r.minutes</code>; trong <code>else</code> là <code>{ ok: false; code: SlotCode }</code> — có <code>r.code</code>. Dáng gắn nhãn này là một <strong>discriminated union</strong>, chủ đề của 5.3; ở đây nó đơn giản là union hay gặp nhất mà bạn sẽ thu hẹp.</p>

<h3>Thu hẹp union literal bằng <code>switch</code></h3>
<p><code>SlotCode</code> là union của bốn chuỗi chính xác. Một <code>switch</code> theo giá trị thu hẹp về một literal mỗi case:</p>
${ma('typescript', CODE.switchMsg)}
${ra(OUT['13-switch'])}
<p>Để ý <strong>không có <code>default</code></strong> mà tsc vẫn hài lòng — nó thấy bốn case phủ đúng <code>SlotCode</code>. Nếu thêm một mã thứ năm vào union, hàm này sẽ ngừng biên dịch (kiểu trả về khai báo là <code>string</code> không còn được bảo đảm). Phép kiểm miễn phí đó là lý do nên thu hẹp theo giá trị trên union literal thay vì trên <code>string</code>; bài 5.4 làm phép kiểm này tường minh bằng <code>never</code>.</p>

<h3>Toán tử <code>in</code>: object có khoá khác nhau</h3>
<p>Khi hai dáng không có nhãn chung, hãy thử một khoá chỉ một trong hai có:</p>
${ma('typescript', CODE.inContact)}
${ra(OUT['14-in'])}
<p><code>'email' in c</code> thu hẹp <code>c</code> về thành viên khai báo <code>email</code>; <code>else</code> là thành viên kia. <code>in</code> là công cụ cho một union object nhanh, nhưng một nhãn chung (5.3) rõ hơn và sống sót qua refactor — một khoá có thể optional hay dùng chung, một nhãn thì không.</p>

<h3><code>instanceof</code>: lỗi trong <code>catch</code> là <code>unknown</code></h3>
<p><code>needsApproval</code> (Chương 3) ném một <code>RangeError</code> khi số chỗ sai. Trong TypeScript, biến trong <code>catch</code> có kiểu <code>unknown</code> — mọi thứ đều có thể bị ném, nên bạn phải thu hẹp trước khi chạm vào:</p>
${ma('typescript', CODE.catchBad)}
${ra(OUT['15-catch-bad'])}
<p><strong>TS18046: 'e' is of type 'unknown'</strong> — cùng bức tường như đọc một giá trị khỏi <code>unknown</code> ở 1.4. <code>instanceof</code> thu hẹp nó về một kiểu lỗi thật:</p>
${ma('typescript', CODE.catchApprove)}
${ra(OUT['16-catch-run'])}
<p>Trong <code>if (e instanceof RangeError)</code>, <code>e</code> là một <code>RangeError</code>, nên <code>e.message</code> an toàn — output cho thấy thông báo thật. <code>instanceof</code> chạy với bất cứ thứ gì có constructor: <code>Error</code> và các lớp con, nút DOM, lớp của chính bạn (Chương 14). Nó <em>không</em> chạy với type alias hay interface — những thứ đó không tồn tại lúc chạy (0.4), nên chẳng có gì để là instance của.</p>

<h3>So sánh với một literal ngoài union</h3>
<p><code>Role</code> là <code>'STUDENT' | 'LECTURER' | 'ADMIN'</code>. Một bug rất hay gặp là thử một giá trị không có trong union:</p>
${ma('typescript', CODE.typoRole)}
${ra(OUT['17-typo'])}
<p><strong>TS2367: This comparison appears to be unintentional because the types 'Role' and '"TEACHER"' have no overlap.</strong> Trong JavaScript <code>role === 'TEACHER'</code> đơn giản luôn <code>false</code>, và case <code>LECTURER</code> âm thầm không bao giờ khớp. Vì <code>Role</code> là union literal, tsc biết phép so sánh không bao giờ đúng và từ chối nó. Một chuỗi kiểu <code>string</code> sẽ không có phép kiểm này — thêm một lý do dùng union literal cho một tập giá trị cố định (2.4).</p>

<h3>Phép bằng thu hẹp cả hai phía</h3>
${ma('typescript', CODE.equalitySame)}
${ra(OUT['18-equality'])}
<p><code>a</code> là <code>string | number</code> và <code>b</code> là <code>string</code>. Trong <code>if (a === b)</code>, tsc suy luận rằng nếu bằng nhau thì <code>a</code> phải là nhánh <code>string</code>, nên <code>a.length</code> được phép. Phép bằng giữa hai giá trị thu hẹp cả hai về kiểu chung — tiện khi một bên là union rộng và bên kia đã cụ thể.</p>

<h3>Guard theo giá trị nào, khi nào</h3>
${BANG_VI}

<h3>💼 Góc phỏng vấn</h3>
<p><strong>“Vì sao biến <code>catch</code> là <code>unknown</code>?”</strong> Vì JavaScript có thể <code>throw</code> bất cứ thứ gì, không chỉ <code>Error</code>; <code>unknown</code> bắt bạn thu hẹp (thường là <code>instanceof Error</code>) trước khi đọc <code>.message</code>. <strong>“<code>in</code> hay discriminated union?”</strong> <code>in</code> cho một union hai dáng nhanh; một nhãn literal chung (5.3) khi union lớn lên hoặc các dáng dùng chung khoá. <strong>“TS2367 nghĩa là gì?”</strong> Bạn so một giá trị với một literal nó không bao giờ bằng được — thường là lỗi gõ hoặc một giá trị thiếu khỏi union.</p>

<h3>🧪 Luyện tập (15 phút)</h3>
<div class="callout ok">
<p><code>demo5/ts-05-2/practice/start/report.ts</code> — biến một <code>SlotResult</code> thành một dòng UI. Nó không biên dịch:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['19-pr-start'])}
<ol>
<li>Thành viên nào thiếu <code>minutes</code>? Thu hẹp trên <code>r.ok</code> để nhánh ok hiện số phút còn nhánh kia hiện mã.</li>
<li>Chạy trên một slot tốt và một slot lệch lưới.</li>
</ol>
<p><strong>Lời giải</strong>:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['20-pr-sol'])}
<p><strong>Đạt khi:</strong> tsc sạch và Node in <code>OK, 120 minutes</code> rồi <code>REFUSED: OFF_GRID</code>. Code Lab thêm: một <code>switch</code> trên <code>SlotCode</code> không cần default, một contact thu hẹp bằng <code>in</code>, và một guard <code>instanceof</code> trong <code>catch</code>.</p>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">literal union</span><span class="v">Union của giá trị chính xác: <code>'STUDENT' | 'LECTURER' | 'ADMIN'</code>.</span></div>
  <div class="kv"><span class="k">tag / discriminant (nhãn)</span><span class="v">Trường mọi thành viên có với literal khác nhau (<code>ok</code>, <code>step</code>) — thử nó để thu hẹp (5.3).</span></div>
  <div class="kv"><span class="k">thu hẹp bằng <code>in</code></span><span class="v"><code>'key' in obj</code> thu hẹp về các thành viên khai báo khoá đó.</span></div>
  <div class="kv"><span class="k">thu hẹp bằng <code>instanceof</code></span><span class="v">Thu hẹp về một lớp — guard duy nhất chạy với <code>unknown</code> của <code>catch</code> và nút DOM.</span></div>
  <div class="kv"><span class="k">TS2367</span><span class="v">Một phép so sánh không bao giờ đúng — một literal ngoài union.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>SlotResult</code> thu hẹp theo nhãn: đọc <code>r.minutes</code> mù là TS2339; <code>if (r.ok)</code> thu hẹp cả object.</li>
<li>Một <code>switch</code> trên union literal (<code>SlotCode</code>) không cần <code>default</code> — tsc thấy các case đã đầy đủ.</li>
<li><code>'key' in obj</code> thu hẹp union object khác khoá; <code>instanceof</code> thu hẹp lớp và <code>unknown</code> của <code>catch</code>.</li>
<li>So một union literal với giá trị ngoài nó là TS2367 — một lỗi gõ bị bắt lúc biên dịch.</li>
<li>Phép bằng (<code>a === b</code>) thu hẹp cả hai toán hạng về kiểu chung.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Narrowing: in, instanceof, equality', 'Toán tử in, instanceof, và thu hẹp bằng phép bằng. Đọc ngày 3/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-in-operator-narrowing')}
${nguon('📘', 'TypeScript 4.4 — unknown trong biến catch', 'useUnknownInCatchVariables (bật dưới strict): biến catch là unknown. Đọc ngày 3/11/2026.', 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-4.html#defaulting-to-the-unknown-type-in-catch-variables---useunknownincatchvariables')}
${lienKet({ khoa: 'api-design', bai: 'api-2-1-problem-details', title: 'Cùng một kết quả gắn nhãn ở biên API — API Design 2.1: Problem Details cho lỗi', sub: 'Giống: một phản hồi là “thành công hoặc thất bại”, và client đọc một nhãn để phân biệt — đúng cờ ok của SlotResult. Khác: ở đó cái vỏ là một HTTP status cộng một body Problem Details truyền qua mạng; ở đây nhãn là một discriminated union TypeScript mà tsc thu hẹp lúc biên dịch, và biến catch là unknown cho tới khi bạn thu hẹp bằng instanceof.', cta: 'MỞ BÀI API DESIGN →' })}
</div>
`,
};
