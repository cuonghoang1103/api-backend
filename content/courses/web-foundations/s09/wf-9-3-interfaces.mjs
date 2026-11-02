/**
 * Bài 9.3 — interface và type (nâng cấp 02/11/2026). Output thật: _demo/_t9/chay.sh (tsc 5.9: readonly, thiếu trường, trường lạ, trường
 * tuỳ chọn, union trạng thái; kiểu cho API Chương 6 với Omit/Partial/Record; union phân biệt bằng kind + never bắt nhánh thiếu; chạy
 * bằng Node 22.23). Deck: scripts/slides-src/wf-9-3.mjs (9 slide, WF/v1/wf-9-3). Code Lab: wf-9-3-interfaces.
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-9-3', 'Interfaces and types', 'interface và type', [
  [1, 'Interfaces and types',
    '<p>Most data in a web app is objects: a product, a user, an API response. An interface gives a name to the shape of such an object, and TypeScript then checks every place that creates or reads one. This lesson describes the Chapter 6 API this way and shows the five mistakes shapes catch.</p>',
    '<p>Phần lớn dữ liệu trong web app là object: một sản phẩm, một người dùng, một response API. Interface đặt tên cho hình dạng của object đó, rồi TypeScript kiểm mọi chỗ tạo hay đọc nó. Bài này mô tả API của Chương 6 theo cách đó và cho thấy năm lỗi mà hình dạng bắt được.</p>'],
  [2, 'After this lesson you can…',
    '<p>You will be able to write an interface with required, optional and read-only fields, extend it, choose between interface and type, derive new types with Omit, Partial and Record, and model "one of several shapes" with a kind field that the compiler can check exhaustively.</p>',
    '<p>Bạn sẽ viết được interface có trường bắt buộc, tuỳ chọn và chỉ đọc, mở rộng nó, chọn giữa interface và type, suy ra kiểu mới bằng Omit, Partial và Record, và mô hình hoá "một trong nhiều hình dạng" bằng trường kind mà trình biên dịch kiểm được đủ mọi nhánh.</p>'],
  [3, 'Describing a shape',
    '<p>The Product interface lists each field and its type. A question mark makes a field optional; readonly means it is set once. Every object declared as a Product is checked against that list, in every file of the project.</p>',
    '<p>Interface Product liệt kê từng trường và kiểu của nó. Dấu hỏi làm trường thành tuỳ chọn; readonly nghĩa là chỉ gán một lần. Mọi object khai báo là Product đều được kiểm theo danh sách đó, ở mọi tệp của dự án.</p>'],
  [4, 'Five mistakes shapes catch',
    '<p>Changing a read-only id. Creating a product without a price. A misspelled extra field, colour, that would have been silently ignored. Calling a string method on an optional category that may be undefined. And a status value that is not in the allowed list.</p>',
    '<p>Đổi một id chỉ đọc. Tạo sản phẩm thiếu giá. Một trường thừa gõ sai, colour, mà lẽ ra sẽ bị bỏ qua lặng lẽ. Gọi hàm chuỗi trên category tuỳ chọn có thể là undefined. Và một giá trị trạng thái không có trong danh sách cho phép.</p>'],
  [5, 'extends and intersections',
    '<p>An interface can extend another: a digital product is a product plus a download link. With type you combine shapes using an ampersand. Both produce the same kind of object type; they differ mostly in style and a few edge cases.</p>',
    '<p>Một interface có thể mở rộng interface khác: sản phẩm số là sản phẩm cộng một đường tải về. Với type, bạn ghép các hình dạng bằng dấu và. Cả hai cho ra cùng một loại kiểu object; khác nhau chủ yếu ở phong cách và vài trường hợp góc.</p>'],
  [6, 'Typing the Chapter 6 API',
    '<p>The product list, the error bodies and the inputs of POST and PATCH are all derived from one Product type: Omit removes the id for creating, Partial makes every field optional for patching, and Record describes a dictionary of counts.</p>',
    '<p>Danh sách sản phẩm, các phần thân lỗi và dữ liệu vào của POST và PATCH đều suy ra từ một kiểu Product: Omit bỏ id khi tạo, Partial làm mọi trường thành tuỳ chọn khi patch, và Record mô tả một từ điển các số đếm.</p>'],
  [7, 'One of several shapes',
    '<p>A loading state is loading, error with a message, or done with items. A shared kind field tells them apart, so inside each case TypeScript knows exactly which fields exist. When a new state was added later, the never check pointed at the switch that forgot it.</p>',
    '<p>Một trạng thái tải là đang tải, lỗi kèm thông báo, hoặc xong kèm danh sách. Trường kind dùng chung phân biệt chúng, nên trong mỗi nhánh TypeScript biết chính xác những trường nào tồn tại. Khi thêm một trạng thái mới sau này, phép kiểm never chỉ đúng vào switch đã quên nó.</p>'],
  [8, 'interface or type?',
    '<p>Use interface for object shapes, especially ones others extend. Use type for unions, literal lists, function types and derived types. Teams pick one style and stick to it; the compiler treats both as shapes and checks them the same way.</p>',
    '<p>Dùng interface cho hình dạng object, nhất là những cái người khác sẽ mở rộng. Dùng type cho union, danh sách literal, kiểu hàm và kiểu suy ra. Các nhóm chọn một phong cách rồi giữ nó; trình biên dịch coi cả hai là hình dạng và kiểm như nhau.</p>'],
  [9, 'Summary & practice',
    '<p>The practice asks you to write the types of a small library API, derive its create and update inputs, and model a request state with a kind field. "Done when" checks a clean compile and an exhaustiveness error when you add a new state.</p>',
    '<p>Bài luyện yêu cầu bạn viết kiểu cho một API thư viện nhỏ, suy ra dữ liệu vào khi tạo và cập nhật, và mô hình hoá trạng thái request bằng trường kind. "Xong khi" kiểm một lần biên dịch sạch và một lỗi thiếu nhánh khi bạn thêm trạng thái mới.</p>'],
]);

export default {
  title: '9.3 — interface and type: describing the shape of data|||9.3 — interface và type: mô tả hình dạng dữ liệu',
  slug: 'wf-9-3-interfaces',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/BCg4U1FzODs', durationSeconds: 0 },
  description: 'interface với trường bắt buộc, tuỳ chọn (?), chỉ đọc (readonly); năm lỗi tsc 5.9 bắt (đổi id, thiếu price, trường lạ colour, category có thể undefined, trạng thái sai); extends và &; kiểu cho API Chương 6 (ProductList, lỗi, Omit/Partial/Record) và tsc --declaration; union phân biệt bằng kind với switch và kiểm never bắt nhánh bị quên; chọn interface hay type.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>interface and type: naming the shape of your data</h2>
<p class="lead">After this lesson you can describe an object with an interface — required, optional and read-only fields — extend it, decide between <code>interface</code> and <code>type</code>, derive the inputs of an API from one model with <code>Omit</code>, <code>Partial</code> and <code>Record</code>, and model "one of several shapes" so that the compiler tells you every place you forgot to handle a new case. React props, API responses and Prisma models (Lesson 8.5) are all described this way.</p>

<h3>Step 1 — describing a shape</h3>
${ma('typescript', CODE['_t9/9-3/shapes.ts'])}
<table>
<thead><tr><th>Syntax</th><th>Means</th></tr></thead>
<tbody>
<tr><td><code>name: string;</code></td><td>required — every Product must have it</td></tr>
<tr><td><code>category?: string;</code></td><td>optional — its type is <code>string | undefined</code></td></tr>
<tr><td><code>readonly id: number;</code></td><td>can be set when the object is created, never changed</td></tr>
<tr><td><code>interface B extends A { … }</code></td><td>B has everything in A plus more</td></tr>
<tr><td><code>type C = A &amp; { … }</code></td><td>intersection: a value must satisfy both</td></tr>
</tbody>
</table>

<h3>Step 2 — five mistakes shapes catch</h3>
${ra(OUT['_t9/out/shapes'])}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Line 11</span><span class="lz-t">readonly</span><span class="lz-d">Ids identify rows (Lesson 8.4); changing one in memory is almost always a bug.</span></div>
<div class="lz-layer"><span class="lz-k">Line 13</span><span class="lz-t">missing field</span><span class="lz-d">A product without a price would render "undefined VND".</span></div>
<div class="lz-layer"><span class="lz-k">Line 14</span><span class="lz-t">excess property</span><span class="lz-d"><code>colour</code> is not in Product. In plain JavaScript a misspelled field is silently ignored; here it is an error (only for object literals written directly — see the trap below).</span></div>
<div class="lz-layer"><span class="lz-k">Line 17</span><span class="lz-t">optional means maybe undefined</span><span class="lz-d">Use <code>p.category?.toUpperCase() ?? 'Uncategorised'</code>.</span></div>
<div class="lz-layer"><span class="lz-k">Line 27</span><span class="lz-t">literal union</span><span class="lz-d"><code>'sold'</code> is not a <code>Status</code> (Lesson 9.2).</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — TypeScript checks shapes, not names, and extra fields slip through variables.</strong> Any object with the right fields <em>is</em> a Product — TypeScript is "structurally typed". The excess-property error on line 14 only fires for an object literal written directly where a Product is expected; <code>const raw = { …, colour: 'blue' }; const mug: Product = raw;</code> compiles. That is fine for reading, but it means a type never removes fields: if <code>raw</code> held a <code>passwordHash</code>, sending <code>mug</code> as JSON still sends it. Pick the fields you send (Lesson 8.5's <code>select</code>).</p></div>

<h3>Step 3 — typing the Chapter 6 API</h3>
<p>The front-end of the product API needs types for what it receives and sends. One <code>Product</code> model, and everything else derived from it:</p>
${ma('typescript', CODE['_t9/9-3/api-types.ts'])}
${ra(OUT['_t9/out/api-types'])}
<table>
<thead><tr><th>Utility type</th><th>Result here</th><th>Used for</th></tr></thead>
<tbody>
<tr><td><code>Omit&lt;Product, 'id'&gt;</code></td><td><code>{ name; price; category }</code></td><td>POST body — the server assigns the id</td></tr>
<tr><td><code>Partial&lt;T&gt;</code></td><td>every field optional</td><td>PATCH body — send only what changes (Lesson 6.2)</td></tr>
<tr><td><code>Pick&lt;Product, 'id' | 'name'&gt;</code></td><td>only those fields</td><td>a small list item</td></tr>
<tr><td><code>Record&lt;string, number&gt;</code></td><td>an object used as a dictionary</td><td><code>{ office: 75000, home: 380000 }</code></td></tr>
<tr><td><code>Promise&lt;ProductList&gt;</code></td><td>the result of an async function</td><td><code>await getProducts()</code> is a <code>ProductList</code></td></tr>
</tbody>
</table>
<p>Change <code>price</code> to <code>priceVnd</code> in <code>Product</code> and the compiler lists every component, request and form that still says <code>price</code> — that is the payoff of deriving types instead of copying them. Remember Lesson 9.1, though: <code>res.json()</code> is not checked; these types describe what the server <em>promises</em>.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — <code>Record&lt;string, number&gt;</code> promises every key exists.</strong> With <code>const views: Record&lt;string, number&gt; = { office: 75000 }</code>, TypeScript types <code>views['offce']</code> (a typo) as <code>number</code>, yet at runtime it is <code>undefined</code> and <code>views['offce'] + 1</code> is <code>NaN</code>. Either use a literal key type (<code>Record&lt;'office' | 'home', number&gt;</code>), or turn on <code>noUncheckedIndexedAccess</code> in tsconfig (Lesson 9.5) so lookups become <code>number | undefined</code> and must be checked.</p></div>

<h3>Step 4 — one of several shapes: a <code>kind</code> field</h3>
<p>A screen that loads data is in one of three states. Optional fields (<code>message?</code>, <code>items?</code>) would allow nonsense like "loading with an error message". A union of exact shapes, told apart by one field, does not:</p>
${ma('typescript', CODE['_t9/9-3/kinds.ts'])}
${ra(OUT['_t9/out/kinds'])}
<p>Inside <code>case 'error'</code>, TypeScript has narrowed <code>state</code> to the error shape, so <code>state.message</code> is allowed; in <code>case 'done'</code>, only <code>items</code> is. The second function shows the safety net: someone added <code>{ kind: 'empty' }</code>, and the <code>never</code> assignment in <code>default</code> fails to compile (line 27) because one case is unhandled. In a big app, that error appears in every <code>switch</code> that needs updating.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Where you will meet it</span><span class="v">Redux actions (<code>type</code>), API results (<code>{ ok: true, data } | { ok: false, error }</code>), payment statuses, form steps.</span></div>
  <div class="kv"><span class="k">never</span><span class="v">The type with no values: if something can reach a <code>never</code> variable, a case was missed.</span></div>
</div>

<h3>Step 5 — interface or type?</h3>
<table>
<thead><tr><th></th><th>interface</th><th>type</th></tr></thead>
<tbody>
<tr><td>Object shapes</td><td>✅</td><td>✅</td></tr>
<tr><td>Unions, literal lists</td><td>❌</td><td>✅ <code>'a' | 'b'</code></td></tr>
<tr><td>Function types, tuples</td><td>awkward</td><td>✅ <code>(e: Event) =&gt; void</code></td></tr>
<tr><td>Derived types (Omit, Partial…)</td><td>can extend them</td><td>✅ directly</td></tr>
<tr><td>Extending</td><td><code>extends</code></td><td><code>&amp;</code></td></tr>
<tr><td>Declaration merging</td><td>✅ (used by libraries)</td><td>❌</td></tr>
</tbody>
</table>
<p>A simple rule many teams use: <code>interface</code> for object shapes, <code>type</code> for everything else. Consistency matters more than the choice.</p>

<div class="callout ok">
<p><strong>🧪 Practice (35 minutes) — type a small API</strong></p>
<ol>
<li>Write <code>interface Book { readonly id: number; title: string; author: string; year: number; isbn?: string }</code> and a <code>type Genre = 'novel' | 'science' | 'history'</code>; add <code>genre: Genre</code> to Book.</li>
<li>Derive <code>CreateBookInput</code> (no id) and <code>UpdateBookInput</code> (everything optional) with utility types, and <code>BooksByGenre = Record&lt;Genre, number&gt;</code>.</li>
<li>Write <code>type LoanResult = { kind: 'ok'; dueDate: string } | { kind: 'not-available'; nextFree: string } | { kind: 'banned'; reason: string }</code> and a <code>message(r: LoanResult): string</code> with a <code>switch</code> and a <code>never</code> default.</li>
<li>Add a fourth kind <code>'limit-reached'</code> and run <code>npx tsc --noEmit --strict</code>.</li>
<li>Copy <code>shapes.ts</code> and fix its five errors.</li>
</ol>
<p>Hint: <code>Record&lt;Genre, number&gt;</code> requires all three genres as keys — try leaving one out.</p>
<p><strong>Done when:</strong> your files compile cleanly; a <code>BooksByGenre</code> object missing <code>history</code> is an error; adding <code>'limit-reached'</code> produces a <code>not assignable to type 'never'</code> error until you add its case; and <code>shapes.ts</code> compiles with no <code>as</code> or <code>!</code>. Then Code Lab module 9.3.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">interface</span><span class="v">giao diện — tên cho hình dạng object.</span></div>
  <div class="kv"><span class="k">type alias</span><span class="v">bí danh kiểu — <code>type X = …</code>.</span></div>
  <div class="kv"><span class="k">optional property</span><span class="v">thuộc tính tuỳ chọn — <code>?</code>.</span></div>
  <div class="kv"><span class="k">readonly</span><span class="v">chỉ đọc — gán một lần.</span></div>
  <div class="kv"><span class="k">structural typing</span><span class="v">kiểu theo cấu trúc — đúng trường là đúng kiểu.</span></div>
  <div class="kv"><span class="k">excess property check</span><span class="v">kiểm thuộc tính thừa trong object literal.</span></div>
  <div class="kv"><span class="k">utility types</span><span class="v">Omit, Partial, Pick, Record…</span></div>
  <div class="kv"><span class="k">intersection</span><span class="v">giao — <code>A &amp; B</code>.</span></div>
  <div class="kv"><span class="k">discriminated union</span><span class="v">union phân biệt bằng một trường (kind).</span></div>
  <div class="kv"><span class="k">exhaustiveness check</span><span class="v">kiểm đủ nhánh — dùng never.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>An interface names an object's shape: required, optional (<code>?</code>) and <code>readonly</code> fields.</li>
  <li>Shapes catch missing fields, misspelled extra fields, read-only writes and possibly-undefined reads.</li>
  <li>TypeScript is structural: extra fields slip in through variables, and types never strip fields.</li>
  <li>Derive API types from one model: <code>Omit</code>, <code>Partial</code>, <code>Pick</code>, <code>Record</code>.</li>
  <li>Model alternatives as a union with a <code>kind</code> field; a <code>never</code> default catches forgotten cases.</li>
  <li><code>interface</code> for object shapes, <code>type</code> for unions and everything else.</li>
</ul>
${nguon('📗', 'TypeScript Handbook — Object Types', 'Optional, readonly, extends, intersections', 'https://www.typescriptlang.org/docs/handbook/2/objects.html')}
${nguon('📘', 'TypeScript Handbook — Utility Types', 'Partial, Pick, Omit, Record and the rest', 'https://www.typescriptlang.org/docs/handbook/utility-types.html')}
${lienKet({ khoa: 'typescript', bai: 'typescript-4-2-interface-vs-type', title: 'TypeScript 4.2 — interface vs type', sub: 'Object shapes in depth, with labs on real data models', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3</span>
<h2>interface và type: đặt tên cho hình dạng dữ liệu</h2>
<p class="lead">Học xong bài này bạn mô tả được một object bằng interface — trường bắt buộc, tuỳ chọn và chỉ đọc — mở rộng nó, chọn giữa <code>interface</code> và <code>type</code>, suy ra dữ liệu vào của một API từ một mô hình bằng <code>Omit</code>, <code>Partial</code> và <code>Record</code>, và mô hình hoá "một trong nhiều hình dạng" để trình biên dịch chỉ ra mọi chỗ bạn quên xử lý trường hợp mới. Props của React, response API và model Prisma (Bài 8.5) đều được mô tả theo cách này.</p>

<h3>Bước 1 — mô tả một hình dạng</h3>
${ma('typescript', CODE['_t9/9-3/shapes.ts'])}
<table>
<thead><tr><th>Cú pháp</th><th>Nghĩa là</th></tr></thead>
<tbody>
<tr><td><code>name: string;</code></td><td>bắt buộc — mọi Product phải có</td></tr>
<tr><td><code>category?: string;</code></td><td>tuỳ chọn — kiểu của nó là <code>string | undefined</code></td></tr>
<tr><td><code>readonly id: number;</code></td><td>gán được khi tạo object, không bao giờ đổi</td></tr>
<tr><td><code>interface B extends A { … }</code></td><td>B có mọi thứ của A cộng thêm</td></tr>
<tr><td><code>type C = A &amp; { … }</code></td><td>giao: giá trị phải thoả cả hai</td></tr>
</tbody>
</table>

<h3>Bước 2 — năm lỗi mà hình dạng bắt được</h3>
${ra(OUT['_t9/out/shapes'])}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Dòng 11</span><span class="lz-t">readonly</span><span class="lz-d">Id nhận diện dòng (Bài 8.4); đổi nó trong bộ nhớ gần như luôn là lỗi.</span></div>
<div class="lz-layer"><span class="lz-k">Dòng 13</span><span class="lz-t">thiếu trường</span><span class="lz-d">Sản phẩm thiếu giá sẽ hiện "undefined VND".</span></div>
<div class="lz-layer"><span class="lz-k">Dòng 14</span><span class="lz-t">thuộc tính thừa</span><span class="lz-d"><code>colour</code> không có trong Product. Trong JavaScript thuần trường gõ sai bị bỏ qua lặng lẽ; ở đây là lỗi (chỉ với object literal viết trực tiếp — xem bẫy bên dưới).</span></div>
<div class="lz-layer"><span class="lz-k">Dòng 17</span><span class="lz-t">tuỳ chọn nghĩa là có thể undefined</span><span class="lz-d">Dùng <code>p.category?.toUpperCase() ?? 'Uncategorised'</code>.</span></div>
<div class="lz-layer"><span class="lz-k">Dòng 27</span><span class="lz-t">union literal</span><span class="lz-d"><code>'sold'</code> không phải một <code>Status</code> (Bài 9.2).</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — TypeScript kiểm hình dạng, không kiểm tên, và trường thừa lọt qua biến.</strong> Object nào có đúng các trường thì <em>là</em> Product — TypeScript "định kiểu theo cấu trúc". Lỗi thuộc tính thừa ở dòng 14 chỉ bật với object literal viết trực tiếp ở chỗ cần Product; <code>const raw = { …, colour: 'blue' }; const mug: Product = raw;</code> vẫn biên dịch. Đọc thì không sao, nhưng nghĩa là kiểu không bao giờ gỡ bỏ trường: nếu <code>raw</code> có <code>passwordHash</code>, gửi <code>mug</code> thành JSON vẫn gửi nó đi. Hãy tự chọn trường cần gửi (<code>select</code> ở Bài 8.5).</p></div>

<h3>Bước 3 — gắn kiểu cho API của Chương 6</h3>
<p>Front-end của API sản phẩm cần kiểu cho thứ nó nhận và gửi. Một mô hình <code>Product</code>, mọi thứ khác suy ra từ đó:</p>
${ma('typescript', CODE['_t9/9-3/api-types.ts'])}
${ra(OUT['_t9/out/api-types'])}
<table>
<thead><tr><th>Utility type</th><th>Kết quả ở đây</th><th>Dùng cho</th></tr></thead>
<tbody>
<tr><td><code>Omit&lt;Product, 'id'&gt;</code></td><td><code>{ name; price; category }</code></td><td>phần thân POST — máy chủ cấp id</td></tr>
<tr><td><code>Partial&lt;T&gt;</code></td><td>mọi trường thành tuỳ chọn</td><td>phần thân PATCH — chỉ gửi thứ thay đổi (Bài 6.2)</td></tr>
<tr><td><code>Pick&lt;Product, 'id' | 'name'&gt;</code></td><td>chỉ các trường đó</td><td>một mục danh sách nhỏ</td></tr>
<tr><td><code>Record&lt;string, number&gt;</code></td><td>object dùng như từ điển</td><td><code>{ office: 75000, home: 380000 }</code></td></tr>
<tr><td><code>Promise&lt;ProductList&gt;</code></td><td>kết quả của một hàm async</td><td><code>await getProducts()</code> là một <code>ProductList</code></td></tr>
</tbody>
</table>
<p>Đổi <code>price</code> thành <code>priceVnd</code> trong <code>Product</code> là trình biên dịch liệt kê mọi component, request và form vẫn còn ghi <code>price</code> — đó là cái lợi của việc suy ra kiểu thay vì chép chúng. Nhưng nhớ Bài 9.1: <code>res.json()</code> không được kiểm; các kiểu này mô tả thứ máy chủ <em>hứa</em>.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>Record&lt;string, number&gt;</code> hứa rằng khoá nào cũng tồn tại.</strong> Với <code>const views: Record&lt;string, number&gt; = { office: 75000 }</code>, TypeScript coi <code>views['offce']</code> (gõ sai) là <code>number</code>, nhưng lúc chạy nó là <code>undefined</code> và <code>views['offce'] + 1</code> ra <code>NaN</code>. Hoặc dùng kiểu khoá literal (<code>Record&lt;'office' | 'home', number&gt;</code>), hoặc bật <code>noUncheckedIndexedAccess</code> trong tsconfig (Bài 9.5) để phép tra thành <code>number | undefined</code> và buộc phải kiểm.</p></div>

<h3>Bước 4 — một trong nhiều hình dạng: trường <code>kind</code></h3>
<p>Một màn hình tải dữ liệu luôn ở một trong ba trạng thái. Trường tuỳ chọn (<code>message?</code>, <code>items?</code>) sẽ cho phép những thứ vô lý như "đang tải mà có thông báo lỗi". Một union các hình dạng chính xác, phân biệt bằng một trường, thì không:</p>
${ma('typescript', CODE['_t9/9-3/kinds.ts'])}
${ra(OUT['_t9/out/kinds'])}
<p>Trong <code>case 'error'</code>, TypeScript đã thu hẹp <code>state</code> về hình dạng lỗi, nên được dùng <code>state.message</code>; trong <code>case 'done'</code>, chỉ có <code>items</code>. Hàm thứ hai cho thấy tấm lưới an toàn: ai đó thêm <code>{ kind: 'empty' }</code>, và phép gán <code>never</code> ở <code>default</code> không biên dịch được (dòng 27) vì còn một trường hợp chưa xử lý. Trong app lớn, lỗi đó hiện ở mọi <code>switch</code> cần cập nhật.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Bạn sẽ gặp ở đâu</span><span class="v">Action của Redux (<code>type</code>), kết quả API (<code>{ ok: true, data } | { ok: false, error }</code>), trạng thái thanh toán, các bước form.</span></div>
  <div class="kv"><span class="k">never</span><span class="v">Kiểu không có giá trị nào: nếu có gì lọt tới được biến <code>never</code>, nghĩa là sót một nhánh.</span></div>
</div>

<h3>Bước 5 — interface hay type?</h3>
<table>
<thead><tr><th></th><th>interface</th><th>type</th></tr></thead>
<tbody>
<tr><td>Hình dạng object</td><td>✅</td><td>✅</td></tr>
<tr><td>Union, danh sách literal</td><td>❌</td><td>✅ <code>'a' | 'b'</code></td></tr>
<tr><td>Kiểu hàm, tuple</td><td>vụng về</td><td>✅ <code>(e: Event) =&gt; void</code></td></tr>
<tr><td>Kiểu suy ra (Omit, Partial…)</td><td>mở rộng được</td><td>✅ trực tiếp</td></tr>
<tr><td>Mở rộng</td><td><code>extends</code></td><td><code>&amp;</code></td></tr>
<tr><td>Gộp khai báo</td><td>✅ (thư viện dùng)</td><td>❌</td></tr>
</tbody>
</table>
<p>Một quy tắc đơn giản nhiều nhóm dùng: <code>interface</code> cho hình dạng object, <code>type</code> cho mọi thứ còn lại. Nhất quán quan trọng hơn lựa chọn.</p>

<div class="callout ok">
<p><strong>🧪 Luyện tập (35 phút) — gắn kiểu cho một API nhỏ</strong></p>
<ol>
<li>Viết <code>interface Book { readonly id: number; title: string; author: string; year: number; isbn?: string }</code> và <code>type Genre = 'novel' | 'science' | 'history'</code>; thêm <code>genre: Genre</code> vào Book.</li>
<li>Suy ra <code>CreateBookInput</code> (không id) và <code>UpdateBookInput</code> (mọi trường tuỳ chọn) bằng utility type, và <code>BooksByGenre = Record&lt;Genre, number&gt;</code>.</li>
<li>Viết <code>type LoanResult = { kind: 'ok'; dueDate: string } | { kind: 'not-available'; nextFree: string } | { kind: 'banned'; reason: string }</code> và hàm <code>message(r: LoanResult): string</code> có <code>switch</code> và nhánh <code>default</code> dùng <code>never</code>.</li>
<li>Thêm kind thứ tư <code>'limit-reached'</code> rồi chạy <code>npx tsc --noEmit --strict</code>.</li>
<li>Chép <code>shapes.ts</code> và sửa năm lỗi của nó.</li>
</ol>
<p>Gợi ý: <code>Record&lt;Genre, number&gt;</code> đòi đủ cả ba thể loại làm khoá — thử bỏ một cái xem.</p>
<p><strong>Xong khi:</strong> các tệp của bạn biên dịch sạch; một object <code>BooksByGenre</code> thiếu <code>history</code> là lỗi; thêm <code>'limit-reached'</code> sinh lỗi <code>not assignable to type 'never'</code> cho tới khi bạn thêm nhánh của nó; và <code>shapes.ts</code> biên dịch được mà không dùng <code>as</code> hay <code>!</code>. Sau đó làm module Code Lab 9.3.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">interface</span><span class="v">giao diện — tên cho hình dạng object.</span></div>
  <div class="kv"><span class="k">type alias</span><span class="v">bí danh kiểu — <code>type X = …</code>.</span></div>
  <div class="kv"><span class="k">optional property</span><span class="v">thuộc tính tuỳ chọn — <code>?</code>.</span></div>
  <div class="kv"><span class="k">readonly</span><span class="v">chỉ đọc — gán một lần.</span></div>
  <div class="kv"><span class="k">structural typing</span><span class="v">kiểu theo cấu trúc — đúng trường là đúng kiểu.</span></div>
  <div class="kv"><span class="k">excess property check</span><span class="v">kiểm thuộc tính thừa trong object literal.</span></div>
  <div class="kv"><span class="k">utility types</span><span class="v">Omit, Partial, Pick, Record…</span></div>
  <div class="kv"><span class="k">intersection</span><span class="v">giao — <code>A &amp; B</code>.</span></div>
  <div class="kv"><span class="k">discriminated union</span><span class="v">union phân biệt bằng một trường (kind).</span></div>
  <div class="kv"><span class="k">exhaustiveness check</span><span class="v">kiểm đủ nhánh — dùng never.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Interface đặt tên cho hình dạng object: trường bắt buộc, tuỳ chọn (<code>?</code>) và <code>readonly</code>.</li>
  <li>Hình dạng bắt trường thiếu, trường thừa gõ sai, ghi vào trường chỉ đọc và đọc thứ có thể undefined.</li>
  <li>TypeScript định kiểu theo cấu trúc: trường thừa lọt qua biến, và kiểu không bao giờ gỡ trường.</li>
  <li>Suy ra kiểu API từ một mô hình: <code>Omit</code>, <code>Partial</code>, <code>Pick</code>, <code>Record</code>.</li>
  <li>Mô hình hoá các lựa chọn bằng union có trường <code>kind</code>; nhánh <code>default</code> dùng <code>never</code> bắt trường hợp bị quên.</li>
  <li><code>interface</code> cho hình dạng object, <code>type</code> cho union và mọi thứ khác.</li>
</ul>
${nguon('📗', 'TypeScript Handbook — Object Types', 'Tuỳ chọn, readonly, extends, giao', 'https://www.typescriptlang.org/docs/handbook/2/objects.html')}
${nguon('📘', 'TypeScript Handbook — Utility Types', 'Partial, Pick, Omit, Record và các kiểu khác', 'https://www.typescriptlang.org/docs/handbook/utility-types.html')}
${lienKet({ khoa: 'typescript', bai: 'typescript-4-2-interface-vs-type', title: 'TypeScript 4.2 — interface và type', sub: 'Hình dạng object chuyên sâu, kèm lab trên mô hình dữ liệu thật', cta: 'Mở bài' })}
</div>
`,
};
