/**
 * TypeScript · Chương 7 · 7.3 — Conditional types & infer. Slug giữ: typescript-7-3-conditional-infer.
 * Soạn lại TRỌN 03/11/2026 theo ./_HOP-DONG.md. Code/output từ ./_ma-ts-07-3.mjs (demo7/ts-07-3, Node 22.23.3 + tsc 7.0.2).
 */
import G from '../giang/ts-07-3.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-07-3.mjs';

const BANG_EN = `<table>
<thead><tr><th>Pattern</th><th>Means</th><th>Built-in</th></tr></thead>
<tbody>
<tr><td><code>T extends U ? X : Y</code></td><td>choose a type based on T</td><td>—</td></tr>
<tr><td><code>T extends (infer E)[] ? E : T</code></td><td>capture the element type</td><td>—</td></tr>
<tr><td><code>F extends (…args) =&gt; infer R ? R : never</code></td><td>capture a function’s return type</td><td><code>ReturnType&lt;F&gt;</code></td></tr>
<tr><td><code>T extends null | undefined ? never : T</code></td><td>drop null/undefined (distributes over a union)</td><td><code>NonNullable&lt;T&gt;</code></td></tr>
<tr><td><code>Map extends Record&lt;E, infer P&gt; ? P : never</code></td><td>look a payload up by key</td><td>—</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Mẫu</th><th>Nghĩa</th><th>Dựng sẵn</th></tr></thead>
<tbody>
<tr><td><code>T extends U ? X : Y</code></td><td>chọn một kiểu dựa trên T</td><td>—</td></tr>
<tr><td><code>T extends (infer E)[] ? E : T</code></td><td>bắt kiểu phần tử</td><td>—</td></tr>
<tr><td><code>F extends (…args) =&gt; infer R ? R : never</code></td><td>bắt kiểu trả về của một hàm</td><td><code>ReturnType&lt;F&gt;</code></td></tr>
<tr><td><code>T extends null | undefined ? never : T</code></td><td>bỏ null/undefined (distribute qua union)</td><td><code>NonNullable&lt;T&gt;</code></td></tr>
<tr><td><code>Map extends Record&lt;E, infer P&gt; ? P : never</code></td><td>tra một payload theo khoá</td><td>—</td></tr>
</tbody>
</table>`;

export default {
  title: '7.3 — Conditional types & infer|||7.3 — Conditional types & infer',
  slug: 'typescript-7-3-conditional-infer',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Một conditional type T extends U ? X : Y chọn một kiểu dựa trên T — một if ở tầng kiểu. infer bắt một kiểu BÊN TRONG một mẫu: ElementType<T> = T extends (infer E)[] ? E : T lấy kiểu phần tử; ReturnType viết tay bằng infer R lấy kiểu trả về (Return<typeof checkSlot> = SlotResult). Conditional DISTRIBUTE qua union (áp cho từng thành viên): NonNullable<string | null> = string. PayloadOf<E> = EventPayloads extends Record<E, infer P> ? P : never tra payload theo tên sự kiện (dùng ở Lab 7). Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>Conditional types &amp; <code>infer</code></h2>
<p class="lead">Mapped types rebuild a shape; <strong>conditional types</strong> choose a type based on a condition — an <code>if</code> at the type level. Write <code>T extends U ? X : Y</code> and the result depends on <code>T</code>. Add <code>infer</code> and you can <em>pull a type out</em> of another: the element type of an array, the return type of a function, the payload for an event. This is how <code>ReturnType</code>, <code>NonNullable</code> and the typed event lookup in Lab 7 work.</p>

<h3>A condition at the type level</h3>
${ma('typescript', CODE.basicIs)}
${ra(OUT['11-basic'])}
<p><code>T extends U ? X : Y</code> reads “if <code>T</code> is assignable to <code>U</code>, the type is <code>X</code>, otherwise <code>Y</code>”. <code>IsArray&lt;string[]&gt;</code> resolves to <code>'array'</code>, <code>IsArray&lt;number&gt;</code> to <code>'single'</code> — so assigning <code>'array'</code> to <code>IsArray&lt;number&gt;</code> is <strong>TS2322</strong>. The same <code>extends</code> as a generic constraint (6.2), used here to branch instead of to restrict.</p>

<h3><code>infer</code>: capture a type inside a pattern</h3>
${ma('typescript', CODE.elementEl)}
${ra(OUT['12-element'])}
<p><code>infer E</code> introduces a type variable in the <code>extends</code> pattern: “if <code>T</code> is some array <code>E[]</code>, capture that <code>E</code>”. <code>ElementType&lt;string[]&gt;</code> is <code>string</code>, <code>ElementType&lt;number[]&gt;</code> is <code>number</code>, <code>ElementType&lt;boolean&gt;</code> is <code>boolean</code> (not an array, so the <code>: T</code> branch). Assigning a <code>string</code> to <code>ElementType&lt;number[]&gt;</code> (which is <code>number</code>) is TS2322.</p>

<h3>Capture a function’s return type</h3>
${ma('typescript', CODE.retRet)}
${ra(OUT['13-ret'])}
<p><code>F extends (…args: never[]) =&gt; infer R ? R : never</code> captures the type after the arrow. <code>Return&lt;typeof checkSlot&gt;</code> is <code>SlotResult</code> (Chapter 1) — the compiler reads the function’s own signature, so this stays correct even when <code>checkSlot</code> changes. This is the built-in <code>ReturnType&lt;F&gt;</code>; Chapter 8 names it.</p>

<h3>Conditionals distribute over a union</h3>
${ma('typescript', CODE.distribNonull)}
${ra(OUT['14-distrib'])}
<p>When <code>T</code> is a union, a conditional type is applied to <em>each member separately</em>, then joined: <code>NoNull&lt;string | null | undefined&gt;</code> becomes <code>never | never | string</code> = <code>string</code>. So assigning <code>null</code> to it is TS2322 — the <code>null</code> was removed. This is <code>NonNullable&lt;T&gt;</code>, and this distribution is why conditional types over unions are so useful.</p>

<h3>Looking up a payload by key (Lab 7)</h3>
${ma('typescript', CODE.payloadPayload)}
${ra(OUT['15-payload'])}
<p><code>EventPayloads extends Record&lt;E, infer P&gt; ? P : never</code> captures the payload type stored under event name <code>E</code>. <code>PayloadOf&lt;'booking:created'&gt;</code> is <code>{ id; lab }</code>, <code>PayloadOf&lt;'booking:cancelled'&gt;</code> is <code>{ id; reason }</code> — the exact data each event carries. This is the conditional type at the heart of Lab 7’s typed <code>emit</code>.</p>

<h3>Which pattern, when</h3>
${BANG_EN}

<h3>💼 Interview corner</h3>
<p><strong>“What is a conditional type?”</strong> <code>T extends U ? X : Y</code> — a type that picks <code>X</code> or <code>Y</code> depending on whether <code>T</code> is assignable to <code>U</code>. <strong>“What does <code>infer</code> do?”</strong> It declares a type variable inside the <code>extends</code> pattern to capture part of <code>T</code> — the element of an array, the return of a function. <strong>“What does ‘distributive’ mean?”</strong> A conditional over a union is applied to each member and the results are unioned, so it maps a union to a union.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p><code>demo7/ts-07-3/practice/start/unwrap.ts</code> — <code>UnwrapArray</code> should give the element type of an array, but it is typed <code>any</code>, so a wrong value slips:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['16-pr-start'])}
<ol>
<li>Write it with a conditional type and <code>infer</code>: <code>T extends (infer E)[] ? E : T</code>.</li>
<li>Then <code>UnwrapArray&lt;number[]&gt;</code> is <code>number</code>, so the string value fails:</li>
</ol>
${ra(OUT['17-pr-step1'])}
<p><strong>Solution</strong> — a correct value:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['18-pr-sol'])}
<p><strong>Done when:</strong> the wrong value is TS2322 and the right one runs. Code Lab adds: a <code>ReturnType</code> with <code>infer</code>, a distributive <code>NonNullable</code>, and the event <code>PayloadOf</code>.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">conditional type</span><span class="v"><code>T extends U ? X : Y</code> — an <code>if</code> at the type level.</span></div>
  <div class="kv"><span class="k"><code>infer</code></span><span class="v">A type variable in the <code>extends</code> pattern that captures part of T.</span></div>
  <div class="kv"><span class="k">distributive</span><span class="v">A conditional over a union applies to each member, then unions the results.</span></div>
  <div class="kv"><span class="k"><code>ReturnType&lt;F&gt;</code></span><span class="v">The type after a function’s arrow, via <code>infer R</code>.</span></div>
  <div class="kv"><span class="k"><code>NonNullable&lt;T&gt;</code></span><span class="v">T with <code>null</code> and <code>undefined</code> removed.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>T extends U ? X : Y</code> chooses a type; the wrong branch value is TS2322.</li>
<li><code>infer E</code> captures a type inside a pattern — an array’s element, a function’s return.</li>
<li>A conditional over a union distributes: <code>NonNullable&lt;string | null&gt;</code> is <code>string</code>.</li>
<li><code>PayloadOf&lt;E&gt;</code> looks a payload up by event name — the type behind Lab 7’s <code>emit</code>.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Conditional Types', 'T extends U ? X : Y, distributivity, and inferring with infer. Read 3 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/conditional-types.html')}
${nguon('📘', 'TypeScript Handbook — Utility Types: ReturnType, NonNullable', 'The built-in conditional types this lesson writes by hand. Read 3 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>Conditional types &amp; <code>infer</code></h2>
<p class="lead">Mapped type dựng lại một dáng; <strong>conditional type</strong> chọn một kiểu dựa trên một điều kiện — một <code>if</code> ở tầng kiểu. Viết <code>T extends U ? X : Y</code> và kết quả phụ thuộc <code>T</code>. Thêm <code>infer</code> là bạn <em>rút được một kiểu ra</em> khỏi kiểu khác: kiểu phần tử của một mảng, kiểu trả về của một hàm, payload của một sự kiện. Đây là cách <code>ReturnType</code>, <code>NonNullable</code> và phép tra sự kiện có kiểu ở Lab 7 hoạt động.</p>

<h3>Một điều kiện ở tầng kiểu</h3>
${ma('typescript', CODE.basicIs)}
${ra(OUT['11-basic'])}
<p><code>T extends U ? X : Y</code> đọc là “nếu <code>T</code> gán được vào <code>U</code> thì kiểu là <code>X</code>, không thì <code>Y</code>”. <code>IsArray&lt;string[]&gt;</code> ra <code>'array'</code>, <code>IsArray&lt;number&gt;</code> ra <code>'single'</code> — nên gán <code>'array'</code> cho <code>IsArray&lt;number&gt;</code> là <strong>TS2322</strong>. Cùng <code>extends</code> như một ràng buộc generic (6.2), ở đây dùng để rẽ nhánh thay vì giới hạn.</p>

<h3><code>infer</code>: bắt một kiểu bên trong một mẫu</h3>
${ma('typescript', CODE.elementEl)}
${ra(OUT['12-element'])}
<p><code>infer E</code> giới thiệu một biến kiểu trong mẫu <code>extends</code>: “nếu <code>T</code> là một mảng <code>E[]</code> nào đó, bắt <code>E</code> đó”. <code>ElementType&lt;string[]&gt;</code> là <code>string</code>, <code>ElementType&lt;number[]&gt;</code> là <code>number</code>, <code>ElementType&lt;boolean&gt;</code> là <code>boolean</code> (không phải mảng, nên nhánh <code>: T</code>). Gán một <code>string</code> cho <code>ElementType&lt;number[]&gt;</code> (là <code>number</code>) là TS2322.</p>

<h3>Bắt kiểu trả về của một hàm</h3>
${ma('typescript', CODE.retRet)}
${ra(OUT['13-ret'])}
<p><code>F extends (…args: never[]) =&gt; infer R ? R : never</code> bắt kiểu sau mũi tên. <code>Return&lt;typeof checkSlot&gt;</code> là <code>SlotResult</code> (Chương 1) — trình biên dịch đọc chính chữ ký của hàm, nên cái này vẫn đúng ngay cả khi <code>checkSlot</code> đổi. Đây là <code>ReturnType&lt;F&gt;</code> dựng sẵn; Chương 8 đặt tên nó.</p>

<h3>Conditional distribute qua một union</h3>
${ma('typescript', CODE.distribNonull)}
${ra(OUT['14-distrib'])}
<p>Khi <code>T</code> là một union, một conditional type được áp cho <em>từng thành viên riêng</em>, rồi nối lại: <code>NoNull&lt;string | null | undefined&gt;</code> thành <code>never | never | string</code> = <code>string</code>. Nên gán <code>null</code> cho nó là TS2322 — <code>null</code> đã bị bỏ. Đây là <code>NonNullable&lt;T&gt;</code>, và phép distribute này là vì sao conditional qua union hữu dụng đến vậy.</p>

<h3>Tra một payload theo khoá (Lab 7)</h3>
${ma('typescript', CODE.payloadPayload)}
${ra(OUT['15-payload'])}
<p><code>EventPayloads extends Record&lt;E, infer P&gt; ? P : never</code> bắt kiểu payload lưu dưới tên sự kiện <code>E</code>. <code>PayloadOf&lt;'booking:created'&gt;</code> là <code>{ id; lab }</code>, <code>PayloadOf&lt;'booking:cancelled'&gt;</code> là <code>{ id; reason }</code> — đúng dữ liệu mỗi sự kiện mang. Đây là conditional type ở trái tim của <code>emit</code> có kiểu ở Lab 7.</p>

<h3>Mẫu nào, khi nào</h3>
${BANG_VI}

<h3>💼 Góc phỏng vấn</h3>
<p><strong>“Conditional type là gì?”</strong> <code>T extends U ? X : Y</code> — một kiểu chọn <code>X</code> hay <code>Y</code> tuỳ <code>T</code> có gán được vào <code>U</code> không. <strong>“<code>infer</code> làm gì?”</strong> Khai một biến kiểu trong mẫu <code>extends</code> để bắt một phần của <code>T</code> — phần tử của mảng, kiểu trả về của hàm. <strong>“‘distributive’ nghĩa là gì?”</strong> Một conditional qua một union được áp cho từng thành viên và các kết quả được union lại, nên nó ánh xạ một union thành một union.</p>

<h3>🧪 Luyện tập (15 phút)</h3>
<div class="callout ok">
<p><code>demo7/ts-07-3/practice/start/unwrap.ts</code> — <code>UnwrapArray</code> nên cho kiểu phần tử của một mảng, nhưng nó có kiểu <code>any</code>, nên một giá trị sai lọt:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['16-pr-start'])}
<ol>
<li>Viết nó bằng một conditional type và <code>infer</code>: <code>T extends (infer E)[] ? E : T</code>.</li>
<li>Rồi <code>UnwrapArray&lt;number[]&gt;</code> là <code>number</code>, nên giá trị chuỗi trượt:</li>
</ol>
${ra(OUT['17-pr-step1'])}
<p><strong>Lời giải</strong> — một giá trị đúng:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['18-pr-sol'])}
<p><strong>Đạt khi:</strong> giá trị sai là TS2322 và giá trị đúng chạy. Code Lab thêm: một <code>ReturnType</code> với <code>infer</code>, một <code>NonNullable</code> distributive, và <code>PayloadOf</code> của sự kiện.</p>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">conditional type</span><span class="v"><code>T extends U ? X : Y</code> — một <code>if</code> ở tầng kiểu.</span></div>
  <div class="kv"><span class="k"><code>infer</code></span><span class="v">Một biến kiểu trong mẫu <code>extends</code> bắt một phần của T.</span></div>
  <div class="kv"><span class="k">distributive</span><span class="v">Một conditional qua union áp cho từng thành viên, rồi union kết quả.</span></div>
  <div class="kv"><span class="k"><code>ReturnType&lt;F&gt;</code></span><span class="v">Kiểu sau mũi tên của một hàm, bằng <code>infer R</code>.</span></div>
  <div class="kv"><span class="k"><code>NonNullable&lt;T&gt;</code></span><span class="v">T đã bỏ <code>null</code> và <code>undefined</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>T extends U ? X : Y</code> chọn một kiểu; giá trị nhánh sai là TS2322.</li>
<li><code>infer E</code> bắt một kiểu bên trong một mẫu — phần tử của mảng, kiểu trả về của hàm.</li>
<li>Một conditional qua union distribute: <code>NonNullable&lt;string | null&gt;</code> là <code>string</code>.</li>
<li><code>PayloadOf&lt;E&gt;</code> tra một payload theo tên sự kiện — kiểu đằng sau <code>emit</code> của Lab 7.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Conditional Types', 'T extends U ? X : Y, tính distributive, và suy bằng infer. Đọc ngày 3/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/conditional-types.html')}
${nguon('📘', 'TypeScript Handbook — Utility Types: ReturnType, NonNullable', 'Các conditional type dựng sẵn mà bài này viết tay. Đọc ngày 3/11/2026.', 'https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype')}
</div>
`,
};
