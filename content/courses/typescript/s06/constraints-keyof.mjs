/**
 * TypeScript · Chương 6 · 6.2 — Ràng buộc, keyof & truy cập theo chỉ mục. Slug giữ: typescript-6-2-constraints-keyof.
 * Soạn lại TRỌN 03/11/2026 theo ./_HOP-DONG.md. Code/output từ ./_ma-ts-06-2.mjs (demo6/ts-06-2, Node 22.23.3 + tsc 7.0.2).
 */
import G from '../giang/ts-06-2.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-06-2.mjs';

const BANG_EN = `<table>
<thead><tr><th>Tool</th><th>Means</th><th>Example</th></tr></thead>
<tbody>
<tr><td><code>&lt;T&gt;</code> (unconstrained)</td><td>any type at all — you may not touch any property</td><td><code>identity&lt;T&gt;(x: T): T</code></td></tr>
<tr><td><code>&lt;T extends { id: number }&gt;</code></td><td>any type that has these members — now <code>item.id</code> is allowed</td><td><code>byId</code>, <code>Repo</code> (Lab 6)</td></tr>
<tr><td><code>keyof T</code></td><td>the union of T’s property names</td><td><code>keyof User</code> = <code>'id' | 'name' | …</code></td></tr>
<tr><td><code>K extends keyof T</code></td><td>K is one of T’s keys — a typo is refused</td><td><code>getProp(obj, key)</code></td></tr>
<tr><td><code>T[K]</code> (indexed access)</td><td>the type of that property</td><td><code>User['role']</code> = <code>Role</code></td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Công cụ</th><th>Nghĩa</th><th>Ví dụ</th></tr></thead>
<tbody>
<tr><td><code>&lt;T&gt;</code> (không ràng buộc)</td><td>kiểu gì cũng được — không được chạm thuộc tính nào</td><td><code>identity&lt;T&gt;(x: T): T</code></td></tr>
<tr><td><code>&lt;T extends { id: number }&gt;</code></td><td>kiểu nào có các thành viên này — giờ <code>item.id</code> được phép</td><td><code>byId</code>, <code>Repo</code> (Lab 6)</td></tr>
<tr><td><code>keyof T</code></td><td>union tên các thuộc tính của T</td><td><code>keyof User</code> = <code>'id' | 'name' | …</code></td></tr>
<tr><td><code>K extends keyof T</code></td><td>K là một khoá của T — lỗi gõ bị từ chối</td><td><code>getProp(obj, key)</code></td></tr>
<tr><td><code>T[K]</code> (truy cập theo chỉ mục)</td><td>kiểu của thuộc tính đó</td><td><code>User['role']</code> = <code>Role</code></td></tr>
</tbody>
</table>`;

export default {
  title: '6.2 — Constraints, keyof & indexed access|||6.2 — Ràng buộc, keyof & truy cập theo chỉ mục',
  slug: 'typescript-6-2-constraints-keyof',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Một T không ràng buộc không biết gì về dáng nên item.id là TS2339. Ràng buộc <T extends { id: number }> cho T là "kiểu nào có id number" — byId/Repo dùng được item.id mà vẫn giữ kiểu. keyof T là union tên thuộc tính; K extends keyof T bắt khoá phải có thật (getProp(obj, "ghost") ⇒ TS2345); T[K] (indexed access) là kiểu của thuộc tính đó (User["role"] = Role, pluck("id") ra number[]). Gọi với kiểu không thoả ràng buộc ⇒ TS2345/TS2741. Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>Constraints, <code>keyof</code> &amp; indexed access</h2>
<p class="lead">A plain type parameter <code>&lt;T&gt;</code> is powerful because it knows nothing — but that is also its limit: inside the function you may not read any property of <code>T</code>, because not every type has one. A <strong>constraint</strong> (<code>T extends { id: number }</code>) says “any type that has at least this”, and now you can use it. Add <code>keyof</code> and <strong>indexed access</strong> (<code>T[K]</code>) and you can write helpers that take a key and return exactly that property’s type — the tools behind LabFlow’s <code>Repo</code> and <code>pluck</code>.</p>

<h3>An unconstrained T cannot read a property</h3>
${ma('typescript', CODE.whyByid)}
${ra(OUT['11-why'])}
<p><strong>TS2339: Property 'id' does not exist on type 'T'</strong>. <code>T</code> could be <code>number</code>, <code>string</code>, anything — most types have no <code>id</code>, so tsc refuses the read. This is the price of “any type”: without a constraint, you can only pass the value around, not look inside it.</p>

<h3>A constraint: “any type that has an id”</h3>
${ma('typescript', CODE.fixedByid)}
${ra(OUT['12-fixed'])}
<p><code>&lt;T extends { id: number }&gt;</code> is a <strong>constraint</strong> (ràng buộc): <code>T</code> may be any type, as long as it has a numeric <code>id</code>. Inside the function, <code>item.id</code> is now allowed; at the call, the type is still kept — <code>byId(users, 2)</code> returns <code>User | undefined</code>, not <code>{ id: number } | undefined</code>. <code>extends</code> here means “is assignable to”, the same relation as 2.3 — not class inheritance.</p>

<h3><code>keyof</code> and a key parameter</h3>
<p><code>keyof T</code> is the union of <code>T</code>’s property names. Constrain a second parameter <code>K extends keyof T</code> and a caller must pass a real key:</p>
${ma('typescript', CODE.getProp)}
${ra(OUT['13-getprop'])}
<p><code>getProp(an, 'role')</code> returns a <code>Role</code>, <code>getProp(an, 'id')</code> returns a <code>number</code> — the return type is <code>T[K]</code>, the type of that exact property (<strong>indexed access</strong>). Pass a key that does not exist and tsc refuses it:</p>
${ma('typescript', CODE.getPropBad)}
${ra(OUT['13b-getprop-bad'])}
<p><strong>TS2345: Argument of type '"ghost"' is not assignable to parameter of type 'keyof User'.</strong> A mistyped property name is a compile error — the same safety as a literal union (5.2), computed from the shape instead of written by hand.</p>

<h3>Indexed access as a type</h3>
${ma('typescript', CODE.indexedTypes)}
${ra(OUT['14-indexed'])}
<p><code>User['role']</code> <em>is</em> <code>Role</code> — pull a property’s type out of a shape instead of repeating the union, and it stays in sync when the model changes. <code>keyof User</code> is the union of its keys. These are type-level expressions (they vanish at runtime, 0.4); the program prints <code>ADMIN ADMIN email</code> because the values are ordinary strings.</p>

<div class="pitfall co-tieu-de">
<p><strong>The constraint is checked at the call, not just inside.</strong> Pass a type that does not satisfy <code>T extends { id: number }</code> and tsc stops you at the call site:</p>
${ma('typescript', CODE.rejectCall)}
${ra(OUT['15-reject'])}
<p><strong>TS2345 … Property 'id' is missing in type '{ code: string; name: string; }'</strong> — a lab has a <code>code</code>, not an <code>id</code>, so it is not assignable to <code>{ id: number }</code>. The constraint is a promise both sides keep: inside, you may use <code>id</code>; outside, you may only pass something that has it. This is Lab 6’s <code>Repo&lt;T extends { id: number }&gt;</code>: a repository for anything with an id, and nothing else.</p>
</div>

<h3>Which tool, when</h3>
${BANG_EN}

<h3>💼 Interview corner</h3>
<p><strong>“What does <code>T extends U</code> mean on a type parameter?”</strong> A constraint: <code>T</code> may be any type assignable to <code>U</code>, so inside you can use <code>U</code>’s members; it is not class inheritance. <strong>“What is <code>keyof</code>?”</strong> An operator that gives the union of a type’s property names; with <code>K extends keyof T</code> a key argument is checked. <strong>“What is indexed access?”</strong> <code>T[K]</code> — the type of a property; <code>User['role']</code> is <code>Role</code>, and it tracks the model.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p><code>demo6/ts-06-2/practice/start/pick.ts</code> — <code>pick</code> should return the exact type of the chosen property, but it is typed <code>any</code> and casts, so a typo slips:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['16-pr-start'])}
<ol>
<li>tsc is clean — the bug is hidden. Make <code>pick</code> generic with <code>&lt;T, K extends keyof T&gt;</code> returning <code>T[K]</code>.</li>
<li>The typo <code>'eemail'</code> then fails:</li>
</ol>
${ra(OUT['17-pr-step1'])}
<p><strong>Solution</strong> — fix the key:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['18-pr-sol'])}
<p><strong>Done when:</strong> <code>'eemail'</code> is TS2345, and Node prints the email after the fix. Code Lab adds: a constrained <code>byId</code>, a <code>getProp</code> with <code>keyof</code>, and the constraint rejecting a type without an id.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">constraint</span><span class="v"><code>T extends U</code> — T may be any type assignable to U; you can use U’s members.</span></div>
  <div class="kv"><span class="k"><code>keyof T</code></span><span class="v">The union of T’s property names.</span></div>
  <div class="kv"><span class="k">indexed access</span><span class="v"><code>T[K]</code> — the type of the property named K.</span></div>
  <div class="kv"><span class="k"><code>K extends keyof T</code></span><span class="v">A key parameter checked against the shape — a typo is refused.</span></div>
  <div class="kv"><span class="k">extends (on a parameter)</span><span class="v">“is assignable to”, not class inheritance.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>An unconstrained <code>T</code> cannot read a property (TS2339); a constraint <code>T extends { id: number }</code> lets you use <code>id</code> while keeping the type.</li>
<li><code>keyof T</code> is the union of property names; <code>K extends keyof T</code> makes a key argument checked — <code>'ghost'</code> is TS2345.</li>
<li><code>T[K]</code> (indexed access) is the type of that property; <code>User['role']</code> is <code>Role</code>.</li>
<li>The constraint is enforced at the call: a lab (no <code>id</code>) passed to a <code>{ id: number }</code> generic is TS2345.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Generic Constraints', 'extends on a type parameter, and using the constrained members. Read 3 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints')}
${nguon('📘', 'TypeScript Handbook — keyof & Indexed Access Types', 'keyof and T[K]. Read 3 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/keyof-types.html')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Ràng buộc, <code>keyof</code> &amp; truy cập theo chỉ mục</h2>
<p class="lead">Một tham số kiểu trơn <code>&lt;T&gt;</code> mạnh vì nó không biết gì — nhưng đó cũng là giới hạn: trong hàm bạn không được đọc thuộc tính nào của <code>T</code>, vì không phải kiểu nào cũng có. Một <strong>ràng buộc</strong> (<code>T extends { id: number }</code>) nói “kiểu nào có ít nhất thế này”, và giờ bạn dùng được. Thêm <code>keyof</code> và <strong>truy cập theo chỉ mục</strong> (<code>T[K]</code>) là bạn viết được hàm nhận một khoá và trả về đúng kiểu của thuộc tính đó — công cụ đằng sau <code>Repo</code> và <code>pluck</code> của LabFlow.</p>

<h3>Một T không ràng buộc không đọc được thuộc tính</h3>
${ma('typescript', CODE.whyByid)}
${ra(OUT['11-why'])}
<p><strong>TS2339: Property 'id' does not exist on type 'T'</strong>. <code>T</code> có thể là <code>number</code>, <code>string</code>, gì cũng được — phần lớn kiểu không có <code>id</code>, nên tsc từ chối phép đọc. Đó là cái giá của “kiểu bất kỳ”: không có ràng buộc, bạn chỉ chuyền giá trị đi được, không nhìn vào bên trong.</p>

<h3>Một ràng buộc: “kiểu nào có id”</h3>
${ma('typescript', CODE.fixedByid)}
${ra(OUT['12-fixed'])}
<p><code>&lt;T extends { id: number }&gt;</code> là một <strong>ràng buộc</strong> (constraint): <code>T</code> có thể là kiểu bất kỳ, miễn có một <code>id</code> kiểu số. Trong hàm, <code>item.id</code> giờ được phép; ở lời gọi, kiểu vẫn được giữ — <code>byId(users, 2)</code> trả <code>User | undefined</code>, không phải <code>{ id: number } | undefined</code>. <code>extends</code> ở đây nghĩa là “gán được vào”, cùng quan hệ với 2.3 — không phải kế thừa lớp.</p>

<h3><code>keyof</code> và một tham số khoá</h3>
<p><code>keyof T</code> là union tên các thuộc tính của <code>T</code>. Ràng buộc tham số thứ hai <code>K extends keyof T</code> thì người gọi phải truyền một khoá có thật:</p>
${ma('typescript', CODE.getProp)}
${ra(OUT['13-getprop'])}
<p><code>getProp(an, 'role')</code> trả một <code>Role</code>, <code>getProp(an, 'id')</code> trả một <code>number</code> — kiểu trả về là <code>T[K]</code>, kiểu của đúng thuộc tính đó (<strong>truy cập theo chỉ mục</strong>). Truyền một khoá không tồn tại thì tsc từ chối:</p>
${ma('typescript', CODE.getPropBad)}
${ra(OUT['13b-getprop-bad'])}
<p><strong>TS2345: Argument of type '"ghost"' is not assignable to parameter of type 'keyof User'.</strong> Một tên thuộc tính gõ sai là lỗi biên dịch — cùng sự an toàn như union literal (5.2), nhưng tính ra từ dáng thay vì viết tay.</p>

<h3>Truy cập theo chỉ mục như một kiểu</h3>
${ma('typescript', CODE.indexedTypes)}
${ra(OUT['14-indexed'])}
<p><code>User['role']</code> <em>chính là</em> <code>Role</code> — rút kiểu của một thuộc tính ra khỏi dáng thay vì chép lại union, và nó tự đồng bộ khi model đổi. <code>keyof User</code> là union các khoá của nó. Đây là biểu thức ở tầng kiểu (biến mất lúc chạy, 0.4); chương trình in <code>ADMIN ADMIN email</code> vì các giá trị là chuỗi thường.</p>

<div class="pitfall co-tieu-de">
<p><strong>Ràng buộc được kiểm ở lời gọi, không chỉ bên trong.</strong> Truyền một kiểu không thoả <code>T extends { id: number }</code> thì tsc chặn bạn ngay tại chỗ gọi:</p>
${ma('typescript', CODE.rejectCall)}
${ra(OUT['15-reject'])}
<p><strong>TS2345 … Property 'id' is missing in type '{ code: string; name: string; }'</strong> — một lab có <code>code</code>, không có <code>id</code>, nên không gán được vào <code>{ id: number }</code>. Ràng buộc là một lời hứa cả hai phía giữ: bên trong, bạn dùng được <code>id</code>; bên ngoài, bạn chỉ truyền được thứ có nó. Đây là <code>Repo&lt;T extends { id: number }&gt;</code> của Lab 6: một repository cho bất cứ thứ gì có id, và chỉ thế.</p>
</div>

<h3>Công cụ nào, khi nào</h3>
${BANG_VI}

<h3>💼 Góc phỏng vấn</h3>
<p><strong>“<code>T extends U</code> trên một tham số kiểu nghĩa là gì?”</strong> Một ràng buộc: <code>T</code> có thể là kiểu bất kỳ gán được vào <code>U</code>, nên bên trong bạn dùng được thành viên của <code>U</code>; không phải kế thừa lớp. <strong>“<code>keyof</code> là gì?”</strong> Một toán tử cho union tên thuộc tính của một kiểu; với <code>K extends keyof T</code> thì một đối số khoá được kiểm. <strong>“Truy cập theo chỉ mục là gì?”</strong> <code>T[K]</code> — kiểu của một thuộc tính; <code>User['role']</code> là <code>Role</code>, và nó bám theo model.</p>

<h3>🧪 Luyện tập (15 phút)</h3>
<div class="callout ok">
<p><code>demo6/ts-06-2/practice/start/pick.ts</code> — <code>pick</code> nên trả đúng kiểu của thuộc tính được chọn, nhưng nó có kiểu <code>any</code> và ép kiểu, nên một lỗi gõ lọt:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['16-pr-start'])}
<ol>
<li>tsc sạch — bug bị giấu. Làm <code>pick</code> generic với <code>&lt;T, K extends keyof T&gt;</code> trả về <code>T[K]</code>.</li>
<li>Lỗi gõ <code>'eemail'</code> khi đó trượt:</li>
</ol>
${ra(OUT['17-pr-step1'])}
<p><strong>Lời giải</strong> — sửa khoá:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['18-pr-sol'])}
<p><strong>Đạt khi:</strong> <code>'eemail'</code> là TS2345, và Node in email sau khi sửa. Code Lab thêm: một <code>byId</code> có ràng buộc, một <code>getProp</code> với <code>keyof</code>, và ràng buộc từ chối một kiểu không có id.</p>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">constraint (ràng buộc)</span><span class="v"><code>T extends U</code> — T là kiểu bất kỳ gán được vào U; dùng được thành viên của U.</span></div>
  <div class="kv"><span class="k"><code>keyof T</code></span><span class="v">Union tên các thuộc tính của T.</span></div>
  <div class="kv"><span class="k">indexed access (truy cập theo chỉ mục)</span><span class="v"><code>T[K]</code> — kiểu của thuộc tính tên K.</span></div>
  <div class="kv"><span class="k"><code>K extends keyof T</code></span><span class="v">Tham số khoá được kiểm với dáng — lỗi gõ bị từ chối.</span></div>
  <div class="kv"><span class="k">extends (trên tham số)</span><span class="v">“gán được vào”, không phải kế thừa lớp.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một <code>T</code> không ràng buộc không đọc được thuộc tính (TS2339); ràng buộc <code>T extends { id: number }</code> cho dùng <code>id</code> mà vẫn giữ kiểu.</li>
<li><code>keyof T</code> là union tên thuộc tính; <code>K extends keyof T</code> làm tham số khoá được kiểm — <code>'ghost'</code> là TS2345.</li>
<li><code>T[K]</code> (truy cập theo chỉ mục) là kiểu của thuộc tính đó; <code>User['role']</code> là <code>Role</code>.</li>
<li>Ràng buộc được ép ở lời gọi: một lab (không <code>id</code>) truyền vào generic <code>{ id: number }</code> là TS2345.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Generic Constraints', 'extends trên tham số kiểu, và dùng thành viên bị ràng buộc. Đọc ngày 3/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints')}
${nguon('📘', 'TypeScript Handbook — keyof & Indexed Access Types', 'keyof và T[K]. Đọc ngày 3/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/keyof-types.html')}
</div>
`,
};
