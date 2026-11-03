/**
 * TypeScript · Chương 7 · 7.1 — Mapped types (kiểu ánh xạ). Slug giữ: typescript-7-1-mapped-types.
 * BÀI MỞ CHƯƠNG 7 (soạn lại TRỌN 03/11/2026 theo ./_HOP-DONG.md). Code/output từ ./_ma-ts-07-1.mjs (demo7/ts-07-1, Node 22.23.3 + tsc 7.0.2).
 */
import G from '../giang/ts-07-1.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-07-1.mjs';

const BANG_EN = `<table>
<thead><tr><th>Mapped type</th><th>What it does</th><th>Built-in name</th></tr></thead>
<tbody>
<tr><td><code>{ [K in keyof T]: T[K] }</code></td><td>copies T unchanged — the template to edit</td><td>— (identity)</td></tr>
<tr><td><code>{ [K in keyof T]: string }</code></td><td>every field becomes a <code>string</code> (a form)</td><td>—</td></tr>
<tr><td><code>{ readonly [K in keyof T]: T[K] }</code></td><td>every field read-only</td><td><code>Readonly&lt;T&gt;</code></td></tr>
<tr><td><code>{ [K in Union]: V }</code></td><td>one entry per key in a union</td><td><code>Record&lt;Union, V&gt;</code></td></tr>
<tr><td><code>{ [K in keyof T]: () =&gt; T[K] }</code></td><td>transforms the value type too</td><td>—</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Mapped type</th><th>Làm gì</th><th>Tên dựng sẵn</th></tr></thead>
<tbody>
<tr><td><code>{ [K in keyof T]: T[K] }</code></td><td>chép T nguyên — khuôn để sửa</td><td>— (đồng nhất)</td></tr>
<tr><td><code>{ [K in keyof T]: string }</code></td><td>mọi trường thành <code>string</code> (một form)</td><td>—</td></tr>
<tr><td><code>{ readonly [K in keyof T]: T[K] }</code></td><td>mọi trường chỉ đọc</td><td><code>Readonly&lt;T&gt;</code></td></tr>
<tr><td><code>{ [K in Union]: V }</code></td><td>một mục mỗi khoá trong union</td><td><code>Record&lt;Union, V&gt;</code></td></tr>
<tr><td><code>{ [K in keyof T]: () =&gt; T[K] }</code></td><td>biến đổi cả kiểu giá trị</td><td>—</td></tr>
</tbody>
</table>`;

export default {
  title: '7.1 — Mapped types|||7.1 — Mapped types (kiểu ánh xạ)',
  slug: 'typescript-7-1-mapped-types',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mở Chương 7: một mapped type { [K in keyof T]: … } đi qua MỖI khoá của một kiểu và dựng một kiểu mới từ nó — nên "bản form chữ của Lab", "bản readonly", "bản getter" KHÔNG còn chép tay (chép tay thì trôi: một kiểu LabForm thiếu floor mà tsc không bắt được vì nó là kiểu riêng). { [K in keyof T]: string } biến mọi trường thành string; { readonly [K in keyof T]: T[K] } là Readonly<T> viết tay (gán lại ⇒ TS2540); Record<Union, V> CHÍNH là một mapped type (một mục mỗi khoá); đổi cả kiểu giá trị ({ [K in keyof T]: () => T[K] }). Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>Mapped types</h2>
<p class="lead">Chapter 6 made types reusable across <em>types</em>; Chapter 7 makes types that are <em>computed from other types</em> — the machinery behind <code>Partial</code>, <code>Readonly</code>, <code>Record</code> and the typed event system you build in Lab 7. The first tool is the <strong>mapped type</strong> (kiểu ánh xạ): walk every key of a type and build a new one from it, so a “form version”, a “read-only version”, a “getters version” is one line that can never drift from the original.</p>

<h3>After Chapter 7 you can…</h3>
<ul>
<li><strong>Write a mapped type</strong> that transforms every field of a type (this lesson).</li>
<li><strong>Add and remove <code>?</code> and <code>readonly</code></strong> with mapping modifiers — <code>Partial</code>, <code>Required</code>, <code>Mutable</code> by hand (7.2).</li>
<li><strong>Choose a type with a condition</strong> (<code>T extends U ? X : Y</code>) and pull a type out of another with <code>infer</code> (7.3).</li>
<li><strong>Build string types</strong> with template literals — event names, route keys, getter names (7.4).</li>
<li><strong>Pass Lab 7</strong>: a typed event system where mapped, conditional and template literal types meet.</li>
</ul>
<p>Why it matters: these are the types your tools are made of. Zod infers a type from a schema, Prisma maps a model to a client, React types an event by its name — all with mapped, conditional and template literal types. Interviewers ask “what is a mapped type?”, “how does <code>Partial</code> work?”, “what does <code>infer</code> do?” — you will answer with output you ran.</p>

<h3>The problem: two types that must agree, by hand</h3>
<p>An admin form needs a “string version” of a <code>Lab</code> (every input is text). Written by hand, it drifts:</p>
${ma('typescript', CODE.driftForm)}
${ra(OUT['11-drift'])}
<p><strong>0 errors</strong> — and <code>LabForm</code> is already wrong: it has no <code>floor</code>, and tsc cannot tell, because it is a <em>separate</em> type with no link to <code>Lab</code>. Add a field to <code>Lab</code> and nothing reminds you to add it here. This is the same drift that broke the seed in 5.4 — a copy that fell out of sync.</p>

<h3>The fix: map every key</h3>
${ma('typescript', CODE.stringifyForm)}
${ra(OUT['12-stringify'])}
<p>A <strong>mapped type</strong> reads <code>[K in keyof T]</code> — “for every key K of T” — and gives each one a type. <code>Stringify&lt;Lab&gt;</code> is <code>{ code: string; capacity: string; floor: string }</code>, computed from <code>Lab</code>; add a field to <code>Lab</code> and the form gains it automatically. The syntax is <code>keyof</code> and indexed access from 6.2, now used to <em>build</em> a type instead of read one.</p>

<h3><code>Readonly&lt;T&gt;</code>, written out</h3>
${ma('typescript', CODE.frozen)}
${ra(OUT['13-frozen'])}
<p>Put <code>readonly</code> in front of the mapped key and every field becomes read-only (4.1) — reassigning <code>capacity</code> is <strong>TS2540</strong>. This <em>is</em> the built-in <code>Readonly&lt;T&gt;</code>; you rarely write it yourself, but seeing it as a mapped type is how you understand <code>Readonly</code>, <code>Partial</code> (7.2) and the rest of the utility types (Chapter 8).</p>

<h3><code>Record</code> is a mapped type too</h3>
${ma('typescript', CODE.recordSeats)}
${ra(OUT['14-record'])}
<p><code>{ [K in LabCode]: number }</code> maps over a <em>union of keys</em> rather than <code>keyof T</code> — one entry per lab, exactly <code>Record&lt;LabCode, number&gt;</code> from 4.4. Mapped types unify two things you have already met: deriving a shape from another shape, and a closed table over a union.</p>

<h3>Transforming the value, not just the key</h3>
${ma('typescript', CODE.valuemapGetters)}
${ra(OUT['15-valuemap'])}
<p>The right-hand side can be any type expression using <code>K</code> and <code>T[K]</code>: here every field becomes a function returning it. This is how a library turns a data shape into a shape of getters, validators or React props — and 7.4 adds renaming the <em>keys</em> as well (<code>getCode</code>, <code>getCapacity</code>).</p>

<h3>Which mapped type, when</h3>
${BANG_EN}

<h3>💼 Interview corner</h3>
<p><strong>“What is a mapped type?”</strong> A type that builds a new object type by iterating the keys of an existing one — <code>{ [K in keyof T]: … }</code> — so the result is computed from, and stays in sync with, the source. <strong>“How does <code>Readonly&lt;T&gt;</code> work?”</strong> A mapped type with the <code>readonly</code> modifier on each key. <strong>“Mapped type vs an interface?”</strong> An interface is written by hand and drifts; a mapped type is derived, so one source of truth updates everything that maps over it.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p><code>demo7/ts-07-1/practice/start/view.ts</code> — a hand-written “display” type for a <code>Booking</code> has already drifted (it is missing <code>seats</code>), and tsc says nothing:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['16-pr-start'])}
<ol>
<li>Replace the hand-written type with a mapped type <code>Stringify&lt;T&gt;</code> so the view is derived from <code>Booking</code> and can never drift.</li>
<li>Run it: the view now has <code>id</code>, <code>lab</code> and <code>seats</code>, all strings.</li>
</ol>
<p><strong>Solution</strong>:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['17-pr-sol'])}
<p><strong>Done when:</strong> <code>BookingView</code> is <code>Stringify&lt;Booking&gt;</code> and Node prints all three fields as strings. Code Lab adds: a mapped <code>Readonly</code>, a value-transforming map, and <code>Record</code> as a mapped type.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">mapped type</span><span class="v"><code>{ [K in keyof T]: … }</code> — build an object type by iterating keys.</span></div>
  <div class="kv"><span class="k"><code>keyof</code> in a map</span><span class="v">The keys to iterate; may also be a union of literal keys (<code>Record</code>).</span></div>
  <div class="kv"><span class="k">indexed access <code>T[K]</code></span><span class="v">The original field’s type, reused or transformed.</span></div>
  <div class="kv"><span class="k">derived type</span><span class="v">Computed from a source, so it never drifts (unlike a hand copy).</span></div>
  <div class="kv"><span class="k"><code>Readonly</code>/<code>Record</code></span><span class="v">Built-in mapped types — the same tool with a modifier or a union.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A hand-written “form” type drifts (missing <code>floor</code>) with 0 errors; tsc cannot link two separate types.</li>
<li>A mapped type <code>{ [K in keyof T]: … }</code> is derived from the source and stays in sync.</li>
<li><code>{ readonly [K in keyof T]: T[K] }</code> is <code>Readonly&lt;T&gt;</code>; reassigning is TS2540.</li>
<li><code>Record&lt;Union, V&gt;</code> is a mapped type over a union of keys.</li>
<li>The value side can transform the type (<code>() =&gt; T[K]</code>), not just copy it.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Mapped Types', 'Iterating keys, value transforms, key remapping. Read 3 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/mapped-types.html')}
${nguon('📘', 'TypeScript Handbook — Utility Types', 'Readonly, Record and the rest, built from mapped types. Read 3 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/utility-types.html')}
${lienKet({ khoa: 'api-design', bai: 'api-7-2-sinh-code', title: 'Derive a type, never hand-write it — API Design 7.2: Generating code from the spec', sub: 'Same: a type computed from one source of truth cannot drift, so you never maintain a copy that falls out of date (the same drift that broke the seed in 5.4). Different: there the source is an OpenAPI document and a generator emits client types from it as a build step; here the source is another TypeScript type and a mapped type <code>{ [K in keyof T]: … }</code> derives the form, <code>Readonly</code> or <code>Record</code> from it at compile time, with no generator.', cta: 'OPEN API DESIGN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Mapped types (kiểu ánh xạ)</h2>
<p class="lead">Chương 6 làm kiểu dùng lại được qua nhiều <em>kiểu</em>; Chương 7 làm những kiểu <em>tính ra từ kiểu khác</em> — bộ máy đằng sau <code>Partial</code>, <code>Readonly</code>, <code>Record</code> và hệ sự kiện có kiểu bạn dựng ở Lab 7. Công cụ đầu tiên là <strong>mapped type</strong> (kiểu ánh xạ): đi qua mỗi khoá của một kiểu và dựng một kiểu mới từ nó, nên “bản form”, “bản chỉ đọc”, “bản getter” chỉ là một dòng không bao giờ trôi lệch khỏi bản gốc.</p>

<h3>Học xong Chương 7 bạn làm được…</h3>
<ul>
<li><strong>Viết một mapped type</strong> biến đổi mọi trường của một kiểu (bài này).</li>
<li><strong>Thêm và gỡ <code>?</code> và <code>readonly</code></strong> bằng modifier ánh xạ — <code>Partial</code>, <code>Required</code>, <code>Mutable</code> viết tay (7.2).</li>
<li><strong>Chọn một kiểu bằng điều kiện</strong> (<code>T extends U ? X : Y</code>) và rút một kiểu ra khỏi kiểu khác bằng <code>infer</code> (7.3).</li>
<li><strong>Dựng kiểu chuỗi</strong> bằng template literal — tên sự kiện, khoá route, tên getter (7.4).</li>
<li><strong>Qua Lab 7</strong>: một hệ sự kiện có kiểu nơi mapped, conditional và template literal types gặp nhau.</li>
</ul>
<p>Vì sao quan trọng: đây là những kiểu mà công cụ của bạn được làm ra từ. Zod suy một kiểu từ schema, Prisma ánh xạ một model sang client, React gõ kiểu một sự kiện theo tên — đều bằng mapped, conditional và template literal types. Nhà tuyển dụng hay hỏi “mapped type là gì?”, “<code>Partial</code> hoạt động thế nào?”, “<code>infer</code> làm gì?” — bạn sẽ trả lời bằng output tự chạy.</p>

<h3>Vấn đề: hai kiểu phải khớp nhau, bằng tay</h3>
<p>Một form quản trị cần một “bản chuỗi” của <code>Lab</code> (mọi ô là chữ). Viết tay thì nó trôi:</p>
${ma('typescript', CODE.driftForm)}
${ra(OUT['11-drift'])}
<p><strong>0 lỗi</strong> — và <code>LabForm</code> đã sai: nó không có <code>floor</code>, và tsc không bắt được, vì nó là một kiểu <em>riêng</em> không liên kết với <code>Lab</code>. Thêm một trường vào <code>Lab</code> thì không gì nhắc bạn thêm vào đây. Đây cùng kiểu trôi dạt làm vỡ seed ở 5.4 — một bản sao lệch nhịp.</p>

<h3>Cách sửa: ánh xạ mỗi khoá</h3>
${ma('typescript', CODE.stringifyForm)}
${ra(OUT['12-stringify'])}
<p>Một <strong>mapped type</strong> đọc <code>[K in keyof T]</code> — “với mỗi khoá K của T” — và cho mỗi cái một kiểu. <code>Stringify&lt;Lab&gt;</code> là <code>{ code: string; capacity: string; floor: string }</code>, tính ra từ <code>Lab</code>; thêm một trường vào <code>Lab</code> thì form tự có nó. Cú pháp là <code>keyof</code> và truy cập theo chỉ mục của 6.2, giờ dùng để <em>dựng</em> một kiểu thay vì đọc một kiểu.</p>

<h3><code>Readonly&lt;T&gt;</code>, viết ra</h3>
${ma('typescript', CODE.frozen)}
${ra(OUT['13-frozen'])}
<p>Đặt <code>readonly</code> trước khoá ánh xạ và mọi trường thành chỉ đọc (4.1) — gán lại <code>capacity</code> là <strong>TS2540</strong>. Đây <em>chính là</em> <code>Readonly&lt;T&gt;</code> dựng sẵn; bạn hiếm khi tự viết, nhưng thấy nó là một mapped type là cách hiểu <code>Readonly</code>, <code>Partial</code> (7.2) và phần còn lại của utility types (Chương 8).</p>

<h3><code>Record</code> cũng là một mapped type</h3>
${ma('typescript', CODE.recordSeats)}
${ra(OUT['14-record'])}
<p><code>{ [K in LabCode]: number }</code> ánh xạ qua một <em>union khoá</em> thay vì <code>keyof T</code> — một mục mỗi lab, đúng <code>Record&lt;LabCode, number&gt;</code> của 4.4. Mapped type gộp hai thứ bạn đã gặp: suy một dáng từ dáng khác, và một bảng đóng trên một union.</p>

<h3>Biến đổi giá trị, không chỉ khoá</h3>
${ma('typescript', CODE.valuemapGetters)}
${ra(OUT['15-valuemap'])}
<p>Vế phải có thể là biểu thức kiểu bất kỳ dùng <code>K</code> và <code>T[K]</code>: ở đây mọi trường thành một hàm trả về nó. Đây là cách một thư viện biến một dáng dữ liệu thành một dáng getter, validator hay props React — và 7.4 thêm việc đổi tên cả <em>khoá</em> (<code>getCode</code>, <code>getCapacity</code>).</p>

<h3>Mapped type nào, khi nào</h3>
${BANG_VI}

<h3>💼 Góc phỏng vấn</h3>
<p><strong>“Mapped type là gì?”</strong> Một kiểu dựng một object type mới bằng cách lặp qua các khoá của một kiểu sẵn có — <code>{ [K in keyof T]: … }</code> — nên kết quả tính ra từ, và đồng bộ với, nguồn. <strong>“<code>Readonly&lt;T&gt;</code> hoạt động thế nào?”</strong> Một mapped type với modifier <code>readonly</code> trên mỗi khoá. <strong>“Mapped type so với interface?”</strong> Interface viết tay và trôi; mapped type được suy ra, nên một nguồn sự thật cập nhật mọi thứ ánh xạ qua nó.</p>

<h3>🧪 Luyện tập (15 phút)</h3>
<div class="callout ok">
<p><code>demo7/ts-07-1/practice/start/view.ts</code> — một kiểu “hiển thị” viết tay cho <code>Booking</code> đã trôi (thiếu <code>seats</code>), mà tsc không nói gì:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['16-pr-start'])}
<ol>
<li>Thay kiểu viết tay bằng một mapped type <code>Stringify&lt;T&gt;</code> để view được suy từ <code>Booking</code> và không bao giờ trôi.</li>
<li>Chạy thử: view giờ có <code>id</code>, <code>lab</code> và <code>seats</code>, đều là chuỗi.</li>
</ol>
<p><strong>Lời giải</strong>:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['17-pr-sol'])}
<p><strong>Đạt khi:</strong> <code>BookingView</code> là <code>Stringify&lt;Booking&gt;</code> và Node in cả ba trường dạng chuỗi. Code Lab thêm: một <code>Readonly</code> ánh xạ, một map biến đổi giá trị, và <code>Record</code> như một mapped type.</p>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">mapped type (kiểu ánh xạ)</span><span class="v"><code>{ [K in keyof T]: … }</code> — dựng object type bằng cách lặp khoá.</span></div>
  <div class="kv"><span class="k"><code>keyof</code> trong map</span><span class="v">Các khoá để lặp; cũng có thể là union khoá literal (<code>Record</code>).</span></div>
  <div class="kv"><span class="k">truy cập theo chỉ mục <code>T[K]</code></span><span class="v">Kiểu của trường gốc, dùng lại hoặc biến đổi.</span></div>
  <div class="kv"><span class="k">derived type (kiểu suy ra)</span><span class="v">Tính từ một nguồn, nên không bao giờ trôi (khác bản sao tay).</span></div>
  <div class="kv"><span class="k"><code>Readonly</code>/<code>Record</code></span><span class="v">Mapped type dựng sẵn — cùng công cụ với một modifier hay một union.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một kiểu “form” viết tay trôi (thiếu <code>floor</code>) với 0 lỗi; tsc không nối được hai kiểu riêng.</li>
<li>Một mapped type <code>{ [K in keyof T]: … }</code> suy từ nguồn và giữ đồng bộ.</li>
<li><code>{ readonly [K in keyof T]: T[K] }</code> là <code>Readonly&lt;T&gt;</code>; gán lại là TS2540.</li>
<li><code>Record&lt;Union, V&gt;</code> là một mapped type qua một union khoá.</li>
<li>Vế giá trị có thể biến đổi kiểu (<code>() =&gt; T[K]</code>), không chỉ chép.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Mapped Types', 'Lặp khoá, biến đổi giá trị, đổi tên khoá. Đọc ngày 3/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/mapped-types.html')}
${nguon('📘', 'TypeScript Handbook — Utility Types', 'Readonly, Record và phần còn lại, dựng từ mapped types. Đọc ngày 3/11/2026.', 'https://www.typescriptlang.org/docs/handbook/utility-types.html')}
${lienKet({ khoa: 'api-design', bai: 'api-7-2-sinh-code', title: 'Suy ra một cái kiểu, đừng viết tay — API Design 7.2: Sinh code từ spec', sub: 'Giống: một kiểu tính từ một nguồn sự thật không thể trôi, nên bạn không bao giờ bảo trì một bản sao cũ dần (cùng kiểu trôi làm vỡ seed ở 5.4). Khác: ở đó nguồn là một tài liệu OpenAPI và một bộ sinh tạo ra type client từ nó như một bước build; ở đây nguồn là một kiểu TypeScript khác và một mapped type <code>{ [K in keyof T]: … }</code> suy ra form, <code>Readonly</code> hay <code>Record</code> ngay lúc biên dịch, không cần bộ sinh.', cta: 'MỞ BÀI API DESIGN →' })}
</div>
`,
};
