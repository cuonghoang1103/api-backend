/**
 * TypeScript · Chương 4 · 4.3 — Ghép kiểu: extends & intersection (&). Slug giữ: typescript-4-3-extends-intersection.
 * Soạn lại TRỌN 01/11/2026 theo ./_HOP-DONG.md. Mọi code/output lấy từ ./_ma-ts-04-3.mjs (labflow-ts chạy thật: Node 22.23.3, tsc 7.0.2 —
 * demo4/ts-04-3/). Entity / User / BookingRecord ở đây là bản rút gọn của src/rules/model.ts (lời giải Lab 4).
 */
import G from '../giang/ts-04-3.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-04-3.mjs';

const BANG_EN = `<table>
<thead><tr><th></th><th><code>interface B extends A</code></th><th><code>type B = A &amp; { … }</code></th></tr></thead>
<tbody>
<tr><td>Combines</td><td>object shapes with known members</td><td>anything — a union, a computed type (4.2)</td></tr>
<tr><td>Narrowing an inherited property (<code>role: 'STUDENT'</code>)</td><td>✓</td><td>✓</td></tr>
<tr><td>Changing its type (<code>id: string</code>)</td><td><strong>TS2430 at the declaration</strong>, names the property</td><td>compiles; the property becomes <code>never</code>; TS2322 “not assignable to type 'never'” at every object you build</td></tr>
<tr><td>Missing property message</td><td>TS2739/TS2741 “required in type 'User'”</td><td>TS2322, then “required in type '{ labName: string; userName: string; }'”</td></tr>
<tr><td>Use it for</td><td>entities that share a base (<code>Entity</code>)</td><td>views: an existing type plus a few fields (<code>BookingView</code>)</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th></th><th><code>interface B extends A</code></th><th><code>type B = A &amp; { … }</code></th></tr></thead>
<tbody>
<tr><td>Ghép được</td><td>dáng object biết rõ thành viên</td><td>mọi thứ — union, kiểu tính toán (4.2)</td></tr>
<tr><td>Thu hẹp thuộc tính kế thừa (<code>role: 'STUDENT'</code>)</td><td>✓</td><td>✓</td></tr>
<tr><td>Đổi kiểu của nó (<code>id: string</code>)</td><td><strong>TS2430 ngay ở khai báo</strong>, gọi tên thuộc tính</td><td>biên dịch được; thuộc tính thành <code>never</code>; TS2322 “not assignable to type 'never'” ở mọi object bạn dựng</td></tr>
<tr><td>Thông báo khi thiếu thuộc tính</td><td>TS2739/TS2741 “required in type 'User'”</td><td>TS2322, rồi “required in type '{ labName: string; userName: string; }'”</td></tr>
<tr><td>Dùng cho</td><td>các thực thể chung một nền (<code>Entity</code>)</td><td>góc nhìn: một kiểu có sẵn cộng vài trường (<code>BookingView</code>)</td></tr>
</tbody>
</table>`;

const STACK_EN = `<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">BookingView</span><span class="lz-lnote"><code>BookingRecord &amp; { labName; userName }</code> — what the admin list shows</span></div>
  <div class="lz-layer"><span class="lz-lname">BookingRecord · User</span><span class="lz-lnote"><code>interface … extends Entity</code> — lab, userId, range, seats · email, name, role</span></div>
  <div class="lz-layer"><span class="lz-lname">Entity</span><span class="lz-lnote"><code>readonly id</code>, <code>readonly createdAt</code> — written once, set by the database</span></div>
</div>`;
const STACK_VI = `<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">BookingView</span><span class="lz-lnote"><code>BookingRecord &amp; { labName; userName }</code> — thứ danh sách quản trị hiển thị</span></div>
  <div class="lz-layer"><span class="lz-lname">BookingRecord · User</span><span class="lz-lnote"><code>interface … extends Entity</code> — lab, userId, range, seats · email, name, role</span></div>
  <div class="lz-layer"><span class="lz-lname">Entity</span><span class="lz-lnote"><code>readonly id</code>, <code>readonly createdAt</code> — viết một lần, CSDL gán</span></div>
</div>`;

export default {
  title: '4.3 — Composing types: extends & intersection|||4.3 — Ghép kiểu: extends & intersection (giao)',
  slug: 'typescript-4-3-extends-intersection',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Dựng mô hình LabFlow từ mảnh nhỏ: Entity (readonly id, createdAt) viết một lần, User và BookingRecord extends Entity (thiếu trường kế thừa ⇒ TS2739, gán lại id ⇒ TS2540); thu hẹp thuộc tính kế thừa được (role: STUDENT), đổi kiểu thì TS2430 ngay ở khai báo; BookingView = BookingRecord & { labName, userName } (thiếu ⇒ TS2322 + "required in type ‘{ labName… }’"), toView bằng spread (output thật). Bẫy: cùng lỗi đổi kiểu id viết bằng & thì 0 lỗi ở khai báo, id thành never, lỗi TS2322 "not assignable to type never" rơi vào dòng dữ liệu đúng; & là "VÀ" (nhiều thuộc tính hơn, ít giá trị hơn) — ngược trực giác với |.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>Composing types: <code>extends</code> &amp; intersection</h2>
<p class="lead">Every stored record in LabFlow has an <code>id</code> and a <code>createdAt</code>. Copying those two lines into <code>User</code>, <code>BookingRecord</code>, <code>Lab</code>… works until someone makes one of them <code>string</code>. This lesson writes the shared part once and builds the model from it — with <code>interface … extends</code> and with the intersection operator <code>&amp;</code> — and measures the one place where the two tools behave very differently.</p>

<h3>What you will be able to do, and why it matters</h3>
<ul>
<li>Factor a base type (<code>Entity</code>) out of several entities with <code>extends</code>, including several bases at once.</li>
<li>Narrow an inherited property safely, and read TS2430 when a change is not allowed.</li>
<li>Build a “view” type — a record plus a few fields — with <code>&amp;</code> and spread.</li>
<li>Recognise the intersection that silently became <code>never</code>, and read <code>&amp;</code> as “and”, not “or”.</li>
</ul>
<p>Real models are composed: Prisma rows with relations, API responses with metadata, React props that extend a base. Knowing which tool reports a conflict where saves you from errors that point at innocent lines. You will use both in Lab 4 (<code>User extends Entity</code>, <code>BookingView = BookingRecord &amp; { … }</code>).</p>

<h3>Write the shared part once: <code>extends</code></h3>
${ma('typescript', CODE.base)}
<p><code>User extends Entity</code> means “everything <code>Entity</code> has, plus these”. Both <code>readonly</code> modifiers come along:</p>
${ma('typescript', CODE.extendsUse)}
${ra(OUT['11-extends'])}
<p>The form data has no <code>id</code> or <code>createdAt</code> — the database sets them — so a <code>User</code> cannot be built from it (TS2739 lists both inherited properties). And <code>an.id = 2</code> is TS2540 although <code>User</code> never wrote <code>readonly</code>: it was inherited. (In Lab 4 this is wrong use S8.) For the form, you need a different type without those two fields — Chapter 8 derives it with <code>Omit&lt;User, 'id' | 'createdAt'&gt;</code>. An interface can also extend several bases: <code>interface BookingRecord extends Entity, Timestamps { … }</code>.</p>

<h3>Narrowing is allowed; changing the type is not</h3>
${ma('typescript', CODE.override)}
${ra(OUT['12-override'])}
<p><code>Student</code> redeclares <code>role</code> as <code>'STUDENT'</code> — narrower than <code>Role</code>, so every <code>Student</code> is still a valid <code>User</code>: no error. <code>ImportedUser</code> changes <code>id</code> to <code>string</code>, which would break every function that takes a <code>User</code> and does arithmetic on its id. tsc refuses <strong>at the declaration</strong>, with TS2430 and the exact property: “Types of property 'id' are incompatible”.</p>

<h3>The intersection: <code>A &amp; B</code></h3>
<p><code>&amp;</code> builds a type that has everything from both sides. It works on type aliases, interfaces, even unions (4.2) — perfect for a view: a record plus two looked-up names.</p>
${ma('typescript', CODE.inter)}
${ra(OUT['13-inter'])}
<p>Line 7 builds the view with spread (<code>...rec</code> copies every field of the record) and adds both names. Line 8 forgets <code>userName</code>: TS2322, then the reason, “required in type '{ labName: string; userName: string; }'” — the anonymous right-hand part of the intersection. Running a spread like this for real:</p>
${ma('typescript', CODE.view)}
${ra(OUT['16-view'])}
<p>Every field of the record plus the two names — the object the admin list will render. Because <code>BookingView</code> is <em>derived</em> from <code>BookingRecord</code>, adding a field to the record adds it to the view automatically; a hand-written <code>interface BookingView { … }</code> would drift.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — an intersection that quietly became <code>never</code>.</strong> Write the <code>ImportedUser</code> mistake with <code>&amp;</code> instead of <code>extends</code>:</p>
${ma('typescript', CODE.conflict)}
${ra(OUT['14-conflict'])}
<p>Line 4 compiles. The property <code>id</code> is now <code>number &amp; string</code> — a value that is a number and a string at the same time does not exist, so the type is <code>never</code> (2.3). Nothing complains until someone builds an object, and then the error is on line 7, <code>id: 'U-0007'</code>, “Type 'string' is not assignable to type 'never'” — a correct-looking line, possibly in another file, with no mention of where <code>never</code> came from. That is what the TypeScript wiki means by intersections that “in some cases produce never” (4.2). When you compose object shapes and want conflicts reported at the cause, use <code>interface … extends</code>.</p>
</div>

<h3><code>&amp;</code> means “and”, <code>|</code> means “or”</h3>
${ma('typescript', CODE.andor)}
${ra(OUT['15-andor'])}
<p>The names trip everyone once. <code>HasLab &amp; HasSeats</code> requires <em>both</em> properties — the object type has more properties, so fewer values fit. <code>HasLab | HasSeats</code> (a union, Chapter 5) accepts a value with <em>either</em> — more values fit, and you may use only what all members share until you check which one you have. Think of the values, not the properties: <code>&amp;</code> is the overlap of two sets of values, <code>|</code> their union.</p>

<h3>How LabFlow’s model is layered</h3>
${STACK_EN}

<h3><code>extends</code> or <code>&amp;</code>?</h3>
${BANG_EN}

<h3>💼 Interview corner</h3>
<p><strong>“Difference between <code>extends</code> and <code>&amp;</code>?”</strong> Both combine shapes. <code>extends</code> works on object types with known members and checks compatibility at the declaration (TS2430); <code>&amp;</code> works with any type and merges member types, so a conflict turns the property into <code>never</code> and surfaces later as “not assignable to type 'never'”. Use <code>extends</code> for entity hierarchies, <code>&amp;</code> for views and for combining with unions. <strong>“Why is <code>{ a } &amp; { b }</code> bigger but <code>A | B</code> wider?”</strong> Count values, not properties.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p><code>demo4/ts-04-3/practice/start/model.ts</code>: a model composed with <code>&amp;</code>. The seed fails on a line that looks right:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['17-pr-start'])}
<ol>
<li>Why is a string <code>id</code> “not assignable to type 'never'”?</li>
<li>Rewrite the three types as interfaces with <code>extends</code>. Where does the error move?</li>
<li>Fix the model. The supplier’s code (<code>"EQ-0042"</code>) still needs to be stored.</li>
</ol>
<p><strong>Step 2 — real output with interfaces:</strong></p>
${ra(OUT['18-pr-step1'])}
<p>The error moved to the cause, line 4, and names the property. <strong>Solution:</strong> the supplier’s code is a different fact, so it gets its own name; the equipment keeps a numeric <code>id</code> like every entity:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['19-pr-sol'])}
<p><strong>Done when:</strong> tsc prints nothing and Node prints <code>AL-301 EQ-0042 42</code>. Code Lab has three more: an <code>Entity</code> base for two models, a <code>BookingView</code> built with <code>&amp;</code> and spread, and the hidden <code>never</code> to find.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">extends (interface)</span><span class="v">Inherit every member of one or more object types and add more. Checked at the declaration.</span></div>
  <div class="kv"><span class="k">intersection (<code>&amp;</code>)</span><span class="v">A type with everything from both sides. Works with any type; conflicts become <code>never</code>.</span></div>
  <div class="kv"><span class="k">base type</span><span class="v">A small shared shape such as <code>Entity { id; createdAt }</code>.</span></div>
  <div class="kv"><span class="k">TS2430</span><span class="v">“Interface X incorrectly extends interface Y” — an inherited property was changed incompatibly.</span></div>
  <div class="kv"><span class="k">never (here)</span><span class="v">The type of a property whose two definitions cannot both be true (<code>number &amp; string</code>).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>Entity</code> written once; <code>User extends Entity</code> inherits <code>id</code>, <code>createdAt</code> and their <code>readonly</code> (TS2739 when missing, TS2540 when reassigned).</li>
<li>Narrowing an inherited property is fine; changing its type is TS2430 at the declaration.</li>
<li><code>BookingView = BookingRecord &amp; { labName; userName }</code> + spread derives a view that cannot drift.</li>
<li>The same conflict with <code>&amp;</code> compiles, makes the property <code>never</code>, and the error appears on a correct data line.</li>
<li><code>&amp;</code> = both (more properties, fewer values); <code>|</code> = either (Chapter 5).</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Object Types: Extending Types, Intersection Types', 'extends with several bases, & and the difference between the two. Read 1 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/objects.html')}
${nguon('📗', 'TypeScript wiki — Performance: Preferring Interfaces Over Intersections', '“Intersections … in some cases produce never.” Read 1 Nov 2026.', 'https://github.com/microsoft/TypeScript/wiki/Performance')}
${lienKet({ khoa: 'prisma-orm', bai: 'pr-8-2-getpayload', title: 'A record plus its relations — Prisma 8.2: Naming the shape a query returns', sub: 'Same: a query with include/select returns “the model plus something”, and a hand-written interface for it drifts — derive the type instead. Different: Prisma derives it from the query with GetPayload; here you compose it yourself with BookingRecord &amp; { labName; userName } and see why extends reports conflicts earlier than &amp;.', cta: 'OPEN PRISMA LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>Ghép kiểu: <code>extends</code> &amp; intersection (giao)</h2>
<p class="lead">Bản ghi nào lưu trong LabFlow cũng có <code>id</code> và <code>createdAt</code>. Chép hai dòng đó vào <code>User</code>, <code>BookingRecord</code>, <code>Lab</code>… vẫn chạy được cho tới khi ai đó đổi một cái thành <code>string</code>. Bài này viết phần chung đúng một lần và dựng mô hình từ nó — bằng <code>interface … extends</code> và bằng toán tử giao <code>&amp;</code> — và đo đúng chỗ hai công cụ hành xử rất khác nhau.</p>

<h3>Bạn sẽ làm được gì, và vì sao quan trọng</h3>
<ul>
<li>Tách một kiểu nền (<code>Entity</code>) ra khỏi nhiều thực thể bằng <code>extends</code>, kể cả nhiều nền cùng lúc.</li>
<li>Thu hẹp thuộc tính kế thừa một cách an toàn, và đọc được TS2430 khi thay đổi không được phép.</li>
<li>Dựng một kiểu “góc nhìn” — một bản ghi cộng vài trường — bằng <code>&amp;</code> và spread.</li>
<li>Nhận ra intersection đã âm thầm thành <code>never</code>, và đọc <code>&amp;</code> là “và”, không phải “hoặc”.</li>
</ul>
<p>Mô hình thật đều là ghép: hàng Prisma kèm quan hệ, response API kèm metadata, props React mở rộng một nền. Biết công cụ nào báo xung đột ở đâu giúp bạn tránh những lỗi chỉ vào dòng vô tội. Bạn sẽ dùng cả hai ở Lab 4 (<code>User extends Entity</code>, <code>BookingView = BookingRecord &amp; { … }</code>).</p>

<h3>Viết phần chung một lần: <code>extends</code></h3>
${ma('typescript', CODE.base)}
<p><code>User extends Entity</code> nghĩa là “mọi thứ <code>Entity</code> có, cộng thêm những cái này”. Cả hai <code>readonly</code> cũng đi theo:</p>
${ma('typescript', CODE.extendsUse)}
${ra(OUT['11-extends'])}
<p>Dữ liệu form không có <code>id</code> hay <code>createdAt</code> — CSDL gán chúng — nên không dựng được <code>User</code> từ nó (TS2739 liệt kê cả hai thuộc tính kế thừa). Và <code>an.id = 2</code> là TS2540 dù <code>User</code> chưa từng viết <code>readonly</code>: nó được kế thừa. (Ở Lab 4 đây là cách dùng sai S8.) Cho form, bạn cần một kiểu khác không có hai trường đó — Chương 8 suy ra nó bằng <code>Omit&lt;User, 'id' | 'createdAt'&gt;</code>. Một interface còn extends được nhiều nền: <code>interface BookingRecord extends Entity, Timestamps { … }</code>.</p>

<h3>Thu hẹp thì được; đổi kiểu thì không</h3>
${ma('typescript', CODE.override)}
${ra(OUT['12-override'])}
<p><code>Student</code> khai lại <code>role</code> là <code>'STUDENT'</code> — hẹp hơn <code>Role</code>, nên mọi <code>Student</code> vẫn là một <code>User</code> hợp lệ: không lỗi. <code>ImportedUser</code> đổi <code>id</code> thành <code>string</code>, điều sẽ phá mọi hàm nhận <code>User</code> và làm phép tính trên id. tsc từ chối <strong>ngay ở khai báo</strong>, với TS2430 và đúng thuộc tính: “Types of property 'id' are incompatible”.</p>

<h3>Intersection: <code>A &amp; B</code></h3>
<p><code>&amp;</code> dựng một kiểu có mọi thứ của cả hai vế. Nó dùng được với type alias, interface, kể cả union (4.2) — hợp với một góc nhìn: một bản ghi cộng hai cái tên tra ở chỗ khác.</p>
${ma('typescript', CODE.inter)}
${ra(OUT['13-inter'])}
<p>Dòng 7 dựng góc nhìn bằng spread (<code>...rec</code> chép mọi trường của bản ghi) rồi thêm hai cái tên. Dòng 8 quên <code>userName</code>: TS2322, rồi lý do, “required in type '{ labName: string; userName: string; }'” — vế phải vô danh của intersection. Chạy thật một phép spread như vậy:</p>
${ma('typescript', CODE.view)}
${ra(OUT['16-view'])}
<p>Mọi trường của bản ghi cộng hai cái tên — object mà danh sách quản trị sẽ hiển thị. Vì <code>BookingView</code> được <em>suy ra</em> từ <code>BookingRecord</code>, thêm trường vào bản ghi là góc nhìn tự có; một <code>interface BookingView { … }</code> viết tay thì sẽ lệch dần.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — một intersection âm thầm thành <code>never</code>.</strong> Viết lỗi <code>ImportedUser</code> bằng <code>&amp;</code> thay vì <code>extends</code>:</p>
${ma('typescript', CODE.conflict)}
${ra(OUT['14-conflict'])}
<p>Dòng 4 biên dịch được. Thuộc tính <code>id</code> giờ là <code>number &amp; string</code> — không có giá trị nào vừa là số vừa là chuỗi, nên kiểu là <code>never</code> (2.3). Không ai phàn nàn cho tới khi có người dựng object, và lúc đó lỗi nằm ở dòng 7, <code>id: 'U-0007'</code>, “Type 'string' is not assignable to type 'never'” — một dòng trông hoàn toàn đúng, có khi ở tệp khác, không nhắc gì tới việc <code>never</code> từ đâu ra. Đó là điều wiki TypeScript gọi là intersection “có lúc ra never” (4.2). Khi ghép dáng object và muốn xung đột được báo đúng chỗ gây ra, hãy dùng <code>interface … extends</code>.</p>
</div>

<h3><code>&amp;</code> nghĩa là “và”, <code>|</code> nghĩa là “hoặc”</h3>
${ma('typescript', CODE.andor)}
${ra(OUT['15-andor'])}
<p>Cái tên làm ai cũng vấp một lần. <code>HasLab &amp; HasSeats</code> đòi <em>cả hai</em> thuộc tính — kiểu object có nhiều thuộc tính hơn, nên ít giá trị khớp hơn. <code>HasLab | HasSeats</code> (union, Chương 5) nhận giá trị có <em>một trong hai</em> — nhiều giá trị khớp hơn, và bạn chỉ dùng được phần mọi thành viên chung có cho tới khi kiểm xem đang cầm cái nào. Hãy nghĩ theo giá trị, đừng theo thuộc tính: <code>&amp;</code> là phần giao của hai tập giá trị, <code>|</code> là phần hợp.</p>

<h3>Mô hình LabFlow xếp tầng thế nào</h3>
${STACK_VI}

<h3><code>extends</code> hay <code>&amp;</code>?</h3>
${BANG_VI}

<h3>💼 Góc phỏng vấn</h3>
<p><strong>“<code>extends</code> khác <code>&amp;</code> thế nào?”</strong> Cả hai ghép dáng. <code>extends</code> dùng cho kiểu object biết rõ thành viên và kiểm tương thích ngay ở khai báo (TS2430); <code>&amp;</code> dùng với mọi kiểu và gộp kiểu của từng thành viên, nên xung đột biến thuộc tính thành <code>never</code> và lộ ra muộn thành “not assignable to type 'never'”. Dùng <code>extends</code> cho cây thực thể, <code>&amp;</code> cho góc nhìn và khi ghép với union. <strong>“Vì sao <code>{ a } &amp; { b }</code> lớn hơn mà <code>A | B</code> lại rộng hơn?”</strong> Đếm giá trị, đừng đếm thuộc tính.</p>

<h3>🧪 Luyện tập (15 phút)</h3>
<div class="callout ok">
<p><code>demo4/ts-04-3/practice/start/model.ts</code>: mô hình ghép bằng <code>&amp;</code>. Seed hỏng ở một dòng trông đúng:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['17-pr-start'])}
<ol>
<li>Vì sao một <code>id</code> kiểu chuỗi lại “not assignable to type 'never'”?</li>
<li>Viết lại ba kiểu thành interface với <code>extends</code>. Lỗi dời đi đâu?</li>
<li>Sửa mô hình. Mã của nhà cung cấp (<code>"EQ-0042"</code>) vẫn cần được lưu.</li>
</ol>
<p><strong>Bước 2 — output thật khi dùng interface:</strong></p>
${ra(OUT['18-pr-step1'])}
<p>Lỗi đã dời về đúng nguyên nhân, dòng 4, và gọi tên thuộc tính. <strong>Lời giải:</strong> mã nhà cung cấp là một sự thật khác, nên nó có tên riêng; thiết bị giữ <code>id</code> kiểu số như mọi thực thể:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['19-pr-sol'])}
<p><strong>Đạt khi:</strong> tsc không in gì và Node in <code>AL-301 EQ-0042 42</code>. Code Lab có thêm ba bài: một nền <code>Entity</code> cho hai mô hình, một <code>BookingView</code> dựng bằng <code>&amp;</code> và spread, và cái <code>never</code> ẩn cần tìm.</p>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">extends (interface)</span><span class="v">Kế thừa mọi thành viên của một hay nhiều kiểu object rồi thêm. Kiểm ngay ở khai báo.</span></div>
  <div class="kv"><span class="k">intersection (<code>&amp;</code>, giao)</span><span class="v">Kiểu có mọi thứ của cả hai vế. Dùng với mọi kiểu; xung đột thành <code>never</code>.</span></div>
  <div class="kv"><span class="k">base type (kiểu nền)</span><span class="v">Một dáng nhỏ dùng chung như <code>Entity { id; createdAt }</code>.</span></div>
  <div class="kv"><span class="k">TS2430</span><span class="v">“Interface X incorrectly extends interface Y” — một thuộc tính kế thừa bị đổi không tương thích.</span></div>
  <div class="kv"><span class="k">never (ở đây)</span><span class="v">Kiểu của thuộc tính có hai định nghĩa không thể cùng đúng (<code>number &amp; string</code>).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>Entity</code> viết một lần; <code>User extends Entity</code> kế thừa <code>id</code>, <code>createdAt</code> cùng <code>readonly</code> của chúng (thiếu ⇒ TS2739, gán lại ⇒ TS2540).</li>
<li>Thu hẹp thuộc tính kế thừa thì được; đổi kiểu của nó là TS2430 ngay ở khai báo.</li>
<li><code>BookingView = BookingRecord &amp; { labName; userName }</code> + spread suy ra một góc nhìn không thể lệch.</li>
<li>Cùng xung đột đó viết bằng <code>&amp;</code> thì biên dịch được, thuộc tính thành <code>never</code>, và lỗi hiện ở một dòng dữ liệu đúng.</li>
<li><code>&amp;</code> = cả hai (nhiều thuộc tính hơn, ít giá trị hơn); <code>|</code> = một trong hai (Chương 5).</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Object Types: Extending Types, Intersection Types', 'extends nhiều nền, & và khác biệt giữa hai cách. Đọc ngày 1/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/objects.html')}
${nguon('📗', 'TypeScript wiki — Performance: Preferring Interfaces Over Intersections', '“Intersection … có lúc ra never.” Đọc ngày 1/11/2026.', 'https://github.com/microsoft/TypeScript/wiki/Performance')}
${lienKet({ khoa: 'prisma-orm', bai: 'pr-8-2-getpayload', title: 'Một bản ghi cộng quan hệ của nó — Prisma 8.2: Đặt tên cho hình dạng một truy vấn trả về', sub: 'Giống: truy vấn có include/select trả về “model cộng thêm gì đó”, và một interface viết tay cho nó sẽ lệch dần — hãy suy ra kiểu. Khác: Prisma suy ra từ truy vấn bằng GetPayload; ở đây bạn tự ghép bằng BookingRecord &amp; { labName; userName } và thấy vì sao extends báo xung đột sớm hơn &amp;.', cta: 'MỞ BÀI PRISMA →' })}
</div>
`,
};
