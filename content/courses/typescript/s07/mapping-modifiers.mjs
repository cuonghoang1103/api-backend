/**
 * TypeScript · Chương 7 · 7.2 — Modifier ánh xạ: thêm & gỡ ? và readonly. Slug giữ: typescript-7-2-mapping-modifiers.
 * Soạn lại TRỌN 03/11/2026 theo ./_HOP-DONG.md. Code/output từ ./_ma-ts-07-2.mjs (demo7/ts-07-2, Node 22.23.3 + tsc 7.0.2).
 */
import G from '../giang/ts-07-2.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-07-2.mjs';

const BANG_EN = `<table>
<thead><tr><th>Modifier</th><th>Effect</th><th>Built-in</th></tr></thead>
<tbody>
<tr><td><code>[K in keyof T]?</code> (same as <code>+?</code>)</td><td>add optional to every field — a PATCH body</td><td><code>Partial&lt;T&gt;</code></td></tr>
<tr><td><code>[K in keyof T]-?</code></td><td>remove optional — every field required</td><td><code>Required&lt;T&gt;</code></td></tr>
<tr><td><code>readonly [K in keyof T]</code></td><td>add read-only</td><td><code>Readonly&lt;T&gt;</code></td></tr>
<tr><td><code>-readonly [K in keyof T]</code></td><td>remove read-only — make it writable</td><td>— (Mutable)</td></tr>
<tr><td><code>readonly [K in keyof T]?</code></td><td>both at once</td><td>—</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Modifier</th><th>Hiệu ứng</th><th>Dựng sẵn</th></tr></thead>
<tbody>
<tr><td><code>[K in keyof T]?</code> (như <code>+?</code>)</td><td>thêm optional cho mọi trường — một PATCH body</td><td><code>Partial&lt;T&gt;</code></td></tr>
<tr><td><code>[K in keyof T]-?</code></td><td>gỡ optional — mọi trường bắt buộc</td><td><code>Required&lt;T&gt;</code></td></tr>
<tr><td><code>readonly [K in keyof T]</code></td><td>thêm chỉ đọc</td><td><code>Readonly&lt;T&gt;</code></td></tr>
<tr><td><code>-readonly [K in keyof T]</code></td><td>gỡ chỉ đọc — cho ghi lại</td><td>— (Mutable)</td></tr>
<tr><td><code>readonly [K in keyof T]?</code></td><td>cả hai cùng lúc</td><td>—</td></tr>
</tbody>
</table>`;

export default {
  title: '7.2 — Mapping modifiers: add & remove ? and readonly|||7.2 — Modifier ánh xạ: thêm & gỡ ? và readonly',
  slug: 'typescript-7-2-mapping-modifiers',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Một mapped type còn THÊM hoặc GỠ hai modifier: ? (optional) và readonly. { [K in keyof T]?: T[K] } là Partial<T> — một PATCH body nhận bất kỳ tập con nào; { [K in keyof T]-?: T[K] } là Required<T> gỡ optional (thiếu trường ⇒ TS2739); { -readonly [K in keyof T]: T[K] } là Mutable<T> gỡ readonly (gán lại được); readonly … ? làm cả hai. Prefix + là mặc định (thêm). Rèn qua CreateBooking/PATCH của LabFlow. Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>Mapping modifiers: add &amp; remove <code>?</code> and <code>readonly</code></h2>
<p class="lead">A mapped type does more than copy a field’s type — it can <em>change the two modifiers</em> every property carries: <code>?</code> (optional) and <code>readonly</code>. Add <code>?</code> to every field and you have a PATCH body; remove it and every field becomes required; remove <code>readonly</code> and a frozen type becomes a draft. These four moves are exactly how <code>Partial</code>, <code>Required</code>, <code>Readonly</code> and a hand-written <code>Mutable</code> are built — and the shapes a real API needs for create, update and read.</p>

<h3>Add <code>?</code>: <code>Partial&lt;T&gt;</code> — a PATCH body</h3>
${ma('typescript', CODE.partialPatch)}
${ra(OUT['11-partial'])}
<p><code>{ [K in keyof T]?: T[K] }</code> adds the optional modifier to every field, so a <code>Patch&lt;Booking&gt;</code> may carry any subset — exactly what an HTTP PATCH needs (API Design 4). This is the built-in <code>Partial&lt;T&gt;</code>. The call <code>applyPatch(b, { seats: 30 })</code> compiles because every other field may be omitted.</p>

<h3>Remove <code>?</code>: <code>Required&lt;T&gt;</code></h3>
${ma('typescript', CODE.requiredComplete)}
${ra(OUT['12-required'])}
<p><code>-?</code> <em>removes</em> the optional modifier: <code>Complete&lt;Draft&gt;</code> makes <code>body</code> and <code>tags</code> required, so a value with only <code>title</code> is <strong>TS2739</strong>. The plain <code>Draft</code> accepted it; the mapped version does not. This is <code>Required&lt;T&gt;</code> — useful when a “fully filled” version of a draft must have everything.</p>

<h3>Remove <code>readonly</code>: a mutable copy</h3>
${ma('typescript', CODE.mutableThaw)}
${ra(OUT['13-mutable'])}
<p><code>-readonly</code> strips the read-only modifier: a <code>Mutable&lt;Lab&gt;</code> can be reassigned where the original <code>Lab</code> could not. There is no built-in <code>Mutable</code>, but it is one line — handy for a builder that assembles an object before freezing it. The output shows the frozen value unchanged and the draft updated.</p>

<h3>Both at once</h3>
${ma('typescript', CODE.bothSnap)}
${ra(OUT['14-both'])}
<p>Modifiers combine: <code>{ readonly [K in keyof T]?: T[K] }</code> makes every field both read-only and optional — a read-only patch of a snapshot. (For symmetry, <code>+?</code> and <code>+readonly</code> mean “add”, the default; you only write the <code>+</code> to be explicit.)</p>

<h3>Which modifier, when</h3>
${BANG_EN}
<p><strong>In LabFlow:</strong> <code>Patch&lt;BookingRecord&gt;</code> is the body of an update; <code>Readonly&lt;BookingRecord&gt;</code> is a stored snapshot (5.3); <code>Required</code> turns a half-filled draft into a complete one. Chapter 8 names these as the utility types <code>Partial</code>, <code>Required</code>, <code>Readonly</code> and builds <code>CreateBooking</code> from <code>Omit</code>.</p>

<h3>💼 Interview corner</h3>
<p><strong>“How does <code>Partial&lt;T&gt;</code> work?”</strong> A mapped type that adds <code>?</code> to every key: <code>{ [K in keyof T]?: T[K] }</code>. <strong>“How do you make all fields required?”</strong> The <code>-?</code> modifier (<code>Required&lt;T&gt;</code>). <strong>“Can you remove <code>readonly</code>?”</strong> Yes — <code>-readonly</code>; there is no built-in, but it is one line.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p><code>demo7/ts-07-2/practice/start/patch.ts</code> — <code>updateUser</code> should accept any subset of a <code>User</code>, but its type demands all three fields:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['15-pr-start'])}
<ol>
<li>The call with only <code>name</code> is TS2739. Change the <code>changes</code> parameter to a mapped <code>Patch&lt;User&gt;</code> (add <code>?</code> to every field).</li>
<li>Then any subset is accepted, and the merge still produces a full <code>User</code>.</li>
</ol>
<p><strong>Solution</strong>:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['16-pr-sol'])}
<p><strong>Done when:</strong> <code>updateUser(an, { name: 'An 2' })</code> compiles and Node prints the full user. Code Lab adds: <code>Required</code> with <code>-?</code>, a <code>Mutable</code> with <code>-readonly</code>, and both modifiers together.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>?</code> modifier</span><span class="v">Optional; <code>+?</code> adds (default), <code>-?</code> removes.</span></div>
  <div class="kv"><span class="k"><code>readonly</code> modifier</span><span class="v">Read-only; <code>-readonly</code> removes it.</span></div>
  <div class="kv"><span class="k"><code>Partial&lt;T&gt;</code></span><span class="v">Every field optional — a PATCH body.</span></div>
  <div class="kv"><span class="k"><code>Required&lt;T&gt;</code></span><span class="v">Every field required — removes <code>?</code>.</span></div>
  <div class="kv"><span class="k">Mutable&lt;T&gt;</span><span class="v">Every field writable — removes <code>readonly</code> (no built-in).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>[K in keyof T]?</code> adds optional — <code>Partial&lt;T&gt;</code>, a PATCH body.</li>
<li><code>[K in keyof T]-?</code> removes optional — <code>Required&lt;T&gt;</code>; a missing field is TS2739.</li>
<li><code>-readonly [K in keyof T]</code> removes read-only — a mutable copy; <code>readonly</code> adds it.</li>
<li>Modifiers combine, and <code>+</code> (add) is the default you rarely write.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Mapping Modifiers', 'Adding and removing readonly and ? with + and -. Read 3 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#mapping-modifiers')}
${nguon('📘', 'TypeScript Handbook — Utility Types: Partial, Required, Readonly', 'The built-in mapped types this lesson writes by hand. Read 3 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype')}
${lienKet({ khoa: 'api-design', bai: 'api-1-2-phuong-thuc', title: 'What a PATCH body is, in types — API Design 1.2: HTTP methods', sub: 'Same: a PATCH sends only the fields that change, so its body is the resource with every field made optional — exactly <code>Partial&lt;T&gt;</code>. Different: there PATCH is an HTTP method with its own status codes and idempotency rules over the network; here <code>{ [K in keyof T]?: T[K] }</code> is the compile-time type of that body, and <code>-?</code> / <code>-readonly</code> build the full (Required) and editable (Mutable) forms.', cta: 'OPEN API DESIGN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Modifier ánh xạ: thêm &amp; gỡ <code>?</code> và <code>readonly</code></h2>
<p class="lead">Một mapped type làm hơn việc chép kiểu của một trường — nó <em>đổi được hai modifier</em> mà mọi thuộc tính mang: <code>?</code> (optional) và <code>readonly</code>. Thêm <code>?</code> cho mọi trường là có một PATCH body; gỡ nó thì mọi trường bắt buộc; gỡ <code>readonly</code> thì một kiểu đóng băng thành một bản nháp. Bốn nước đi này chính là cách <code>Partial</code>, <code>Required</code>, <code>Readonly</code> và một <code>Mutable</code> viết tay được dựng — và là các dáng một API thật cần cho tạo, cập nhật và đọc.</p>

<h3>Thêm <code>?</code>: <code>Partial&lt;T&gt;</code> — một PATCH body</h3>
${ma('typescript', CODE.partialPatch)}
${ra(OUT['11-partial'])}
<p><code>{ [K in keyof T]?: T[K] }</code> thêm modifier optional cho mọi trường, nên một <code>Patch&lt;Booking&gt;</code> mang bất kỳ tập con nào — đúng thứ một HTTP PATCH cần (API Design 4). Đây là <code>Partial&lt;T&gt;</code> dựng sẵn. Lời gọi <code>applyPatch(b, { seats: 30 })</code> biên dịch vì mọi trường khác được phép bỏ.</p>

<h3>Gỡ <code>?</code>: <code>Required&lt;T&gt;</code></h3>
${ma('typescript', CODE.requiredComplete)}
${ra(OUT['12-required'])}
<p><code>-?</code> <em>gỡ</em> modifier optional: <code>Complete&lt;Draft&gt;</code> làm <code>body</code> và <code>tags</code> bắt buộc, nên một giá trị chỉ có <code>title</code> là <strong>TS2739</strong>. <code>Draft</code> trơn nhận nó; bản ánh xạ thì không. Đây là <code>Required&lt;T&gt;</code> — có ích khi một bản “đã điền đủ” của một draft phải có mọi thứ.</p>

<h3>Gỡ <code>readonly</code>: một bản sao sửa được</h3>
${ma('typescript', CODE.mutableThaw)}
${ra(OUT['13-mutable'])}
<p><code>-readonly</code> bóc modifier chỉ đọc: một <code>Mutable&lt;Lab&gt;</code> gán lại được ở chỗ <code>Lab</code> gốc không thể. Không có <code>Mutable</code> dựng sẵn, nhưng nó chỉ một dòng — tiện cho một builder lắp một object trước khi đóng băng. Output cho thấy giá trị đóng băng không đổi và bản nháp đã cập nhật.</p>

<h3>Cả hai cùng lúc</h3>
${ma('typescript', CODE.bothSnap)}
${ra(OUT['14-both'])}
<p>Modifier ghép được: <code>{ readonly [K in keyof T]?: T[K] }</code> làm mọi trường vừa chỉ đọc vừa optional — một patch chỉ-đọc của một ảnh chụp. (Để đối xứng, <code>+?</code> và <code>+readonly</code> nghĩa là “thêm”, mặc định; bạn chỉ viết <code>+</code> để cho rõ.)</p>

<h3>Modifier nào, khi nào</h3>
${BANG_VI}
<p><strong>Trong LabFlow:</strong> <code>Patch&lt;BookingRecord&gt;</code> là body của một cập nhật; <code>Readonly&lt;BookingRecord&gt;</code> là một ảnh chụp đã lưu (5.3); <code>Required</code> biến một draft điền dở thành một bản đầy đủ. Chương 8 đặt tên chúng là utility type <code>Partial</code>, <code>Required</code>, <code>Readonly</code> và dựng <code>CreateBooking</code> từ <code>Omit</code>.</p>

<h3>💼 Góc phỏng vấn</h3>
<p><strong>“<code>Partial&lt;T&gt;</code> hoạt động thế nào?”</strong> Một mapped type thêm <code>?</code> cho mọi khoá: <code>{ [K in keyof T]?: T[K] }</code>. <strong>“Làm sao để mọi trường bắt buộc?”</strong> Modifier <code>-?</code> (<code>Required&lt;T&gt;</code>). <strong>“Gỡ được <code>readonly</code> không?”</strong> Được — <code>-readonly</code>; không có dựng sẵn, nhưng chỉ một dòng.</p>

<h3>🧪 Luyện tập (15 phút)</h3>
<div class="callout ok">
<p><code>demo7/ts-07-2/practice/start/patch.ts</code> — <code>updateUser</code> nên nhận bất kỳ tập con nào của một <code>User</code>, nhưng kiểu của nó đòi cả ba trường:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['15-pr-start'])}
<ol>
<li>Lời gọi chỉ có <code>name</code> là TS2739. Đổi tham số <code>changes</code> thành một mapped <code>Patch&lt;User&gt;</code> (thêm <code>?</code> cho mọi trường).</li>
<li>Rồi bất kỳ tập con nào được nhận, và phép merge vẫn cho ra một <code>User</code> đầy đủ.</li>
</ol>
<p><strong>Lời giải</strong>:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['16-pr-sol'])}
<p><strong>Đạt khi:</strong> <code>updateUser(an, { name: 'An 2' })</code> biên dịch và Node in user đầy đủ. Code Lab thêm: <code>Required</code> với <code>-?</code>, một <code>Mutable</code> với <code>-readonly</code>, và cả hai modifier cùng nhau.</p>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">modifier <code>?</code></span><span class="v">Optional; <code>+?</code> thêm (mặc định), <code>-?</code> gỡ.</span></div>
  <div class="kv"><span class="k">modifier <code>readonly</code></span><span class="v">Chỉ đọc; <code>-readonly</code> gỡ nó.</span></div>
  <div class="kv"><span class="k"><code>Partial&lt;T&gt;</code></span><span class="v">Mọi trường optional — một PATCH body.</span></div>
  <div class="kv"><span class="k"><code>Required&lt;T&gt;</code></span><span class="v">Mọi trường bắt buộc — gỡ <code>?</code>.</span></div>
  <div class="kv"><span class="k">Mutable&lt;T&gt;</span><span class="v">Mọi trường ghi được — gỡ <code>readonly</code> (không dựng sẵn).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>[K in keyof T]?</code> thêm optional — <code>Partial&lt;T&gt;</code>, một PATCH body.</li>
<li><code>[K in keyof T]-?</code> gỡ optional — <code>Required&lt;T&gt;</code>; một trường thiếu là TS2739.</li>
<li><code>-readonly [K in keyof T]</code> gỡ chỉ đọc — một bản sao sửa được; <code>readonly</code> thêm nó.</li>
<li>Modifier ghép được, và <code>+</code> (thêm) là mặc định hiếm khi phải viết.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Mapping Modifiers', 'Thêm và gỡ readonly và ? bằng + và -. Đọc ngày 3/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#mapping-modifiers')}
${nguon('📘', 'TypeScript Handbook — Utility Types: Partial, Required, Readonly', 'Các mapped type dựng sẵn mà bài này viết tay. Đọc ngày 3/11/2026.', 'https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype')}
${lienKet({ khoa: 'api-design', bai: 'api-1-2-phuong-thuc', title: 'Một PATCH body là gì, theo kiểu — API Design 1.2: Các phương thức HTTP', sub: 'Giống: một PATCH chỉ gửi những trường thay đổi, nên body của nó là tài nguyên với mọi trường thành optional — đúng <code>Partial&lt;T&gt;</code>. Khác: ở đó PATCH là một phương thức HTTP với mã trạng thái và luật idempotency riêng qua mạng; ở đây <code>{ [K in keyof T]?: T[K] }</code> là kiểu lúc biên dịch của body đó, và <code>-?</code> / <code>-readonly</code> dựng bản đầy đủ (Required) và bản sửa được (Mutable).', cta: 'MỞ BÀI API DESIGN →' })}
</div>
`,
};
