/**
 * TypeScript · Chương 14 · 14.2 — Inheritance, abstract & implements. Slug giữ: typescript-14-2-abstract-implements.
 * Code/output từ ./_ma-ts-14-2.mjs (demo14/ts-14-2, Node 22.23.3 + tsc 7.0.2). Soạn lại TRỌN 04/11/2026. Class native.
 */
import G from '../giang/ts-14-2.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-14-2.mjs';

const KV_EN = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>abstract</code> class</span><span class="v">Written methods + abstract ones a subclass must supply.</span></div>
  <div class="kv"><span class="k">cannot instantiate</span><span class="v"><code>new BookingRepo()</code> is TS2511.</span></div>
  <div class="kv"><span class="k"><code>implements</code></span><span class="v">Checks a class against an interface structurally.</span></div>
  <div class="kv"><span class="k">missing method</span><span class="v">TS2420 (implements) / TS2654 (abstract member).</span></div>
  <div class="kv"><span class="k">a contract</span><span class="v">“Must be provided” becomes a compile error.</span></div>
</div>`;
const KV_VI = `<div class="kv-grid">
  <div class="kv"><span class="k">class <code>abstract</code></span><span class="v">Method đã viết + method abstract lớp con phải cung cấp.</span></div>
  <div class="kv"><span class="k">không dựng được</span><span class="v"><code>new BookingRepo()</code> là TS2511.</span></div>
  <div class="kv"><span class="k"><code>implements</code></span><span class="v">Kiểm một class với một interface về cấu trúc.</span></div>
  <div class="kv"><span class="k">thiếu method</span><span class="v">TS2420 (implements) / TS2654 (thành viên abstract).</span></div>
  <div class="kv"><span class="k">một hợp đồng</span><span class="v">“Phải được cung cấp” thành một lỗi biên dịch.</span></div>
</div>`;

export default {
  title: '14.2 — Inheritance, abstract & implements|||14.2 — Kế thừa, abstract & implements',
  slug: 'typescript-14-2-abstract-implements',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Một abstract class đặt tên dáng mà lớp con phải điền — một số method viết sẵn, số khác để abstract. implements kiểm một class khớp một interface. Dựng một abstract class (new BookingRepo()) ⇒ TS2511; một class implements thiếu method ⇒ TS2420; một lớp con non-abstract thiếu method abstract kế thừa ⇒ TS2654/TS2515. Cả hai mã hoá "cái này phải được cung cấp" thành một lỗi biên dịch. Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.2</span>
<h2>Inheritance, abstract &amp; implements</h2>
<p class="lead">An abstract class names the shape a subclass must fill in — some methods are written, others are left as <code>abstract</code> for the subclass to provide. <code>implements</code> is the other half: it checks that a class matches an interface. Both turn “a subclass must have this method” into a compile error if it does not.</p>

<h3>An abstract class names the shape</h3>
<p><code>BookingRepo</code> writes <code>describe()</code> in terms of an abstract <code>find()</code>; a <code>MemoryRepo</code> fills it in:</p>
${ma('ts', CODE.concrete)}
${ra(OUT['11-concrete'])}
<p>The base defines the contract (and some shared behaviour), the subclass fills in the holes. You use it through the <code>BookingRepo</code> type.</p>

<h3>An abstract class cannot be instantiated</h3>
<p>Write <code>new BookingRepo()</code>:</p>
${ma('ts', CODE.instantiate)}
${ra(OUT['12-instantiate'])}
<p><strong>TS2511</strong> — an abstract class has holes (the abstract methods), so it cannot be built directly. You instantiate a concrete subclass; the type still works as a parameter or field type.</p>

<h3>implements checks a class against an interface</h3>
<p>A class that says <code>implements Repo</code> but is missing a method:</p>
${ma('ts', CODE.implements)}
${ra(OUT['13-implements'])}
<p><strong>TS2420</strong> — it claimed to satisfy the interface and does not. <code>implements</code> is a promise the compiler checks: add a method to the interface and every implementer that has not caught up lights up.</p>

<h3>At a glance</h3>
${KV_EN}

<h3>🧪 Practice</h3>
<p>A concrete <code>SeatStore extends Store</code> forgot the abstract <code>get</code>:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['14-pr-start'])}
<p>Implement it and it runs:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['15-pr-sol'])}

<h3>📌 Summary</h3>
<ul>
<li>An <code>abstract</code> class mixes written methods with abstract ones a subclass must supply.</li>
<li>Instantiating an abstract class is TS2511; you build a concrete subclass instead.</li>
<li><code>implements Interface</code> checks a class structurally — a missing method is TS2420.</li>
<li>A non-abstract subclass missing an inherited abstract member is TS2654/TS2515.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Abstract Classes', 'Abstract members and why they cannot be instantiated. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/classes.html#abstract-classes-and-members')}
${nguon('📘', 'TypeScript Handbook — implements Clauses', 'Checking a class against an interface. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/classes.html#implements-clauses')}
${lienKet({ khoa: 'typescript', bai: 'typescript-6-3-generic-types-classes', title: 'Make the repo generic — TypeScript 6.3: Generic types & classes', sub: 'Same: a class defines a reusable shape — here an abstract repo any backend fills in. Different: there you make the class generic (<code>Repo&lt;T&gt;</code>) so one repository serves every model; combine it with this lesson’s <code>abstract</code> for a typed base contract across every entity.', cta: 'OPEN TYPESCRIPT LESSON →' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.2</span>
<h2>Kế thừa, abstract &amp; implements</h2>
<p class="lead">Một abstract class đặt tên dáng mà lớp con phải điền — một số method được viết, số khác để <code>abstract</code> cho lớp con cung cấp. <code>implements</code> là nửa kia: nó kiểm một class khớp một interface. Cả hai biến “một lớp con phải có method này” thành một lỗi biên dịch nếu nó không có.</p>

<h3>Một abstract class đặt tên dáng</h3>
<p><code>BookingRepo</code> viết <code>describe()</code> dựa trên một <code>find()</code> abstract; một <code>MemoryRepo</code> điền nó:</p>
${ma('ts', CODE.concrete)}
${ra(OUT['11-concrete'])}
<p>Lớp nền định nghĩa hợp đồng (và một ít hành vi chung), lớp con điền các lỗ. Bạn dùng nó qua kiểu <code>BookingRepo</code>.</p>

<h3>Một abstract class không dựng được</h3>
<p>Viết <code>new BookingRepo()</code>:</p>
${ma('ts', CODE.instantiate)}
${ra(OUT['12-instantiate'])}
<p><strong>TS2511</strong> — một abstract class có lỗ (các method abstract), nên không dựng trực tiếp được. Bạn dựng một lớp con cụ thể; kiểu vẫn dùng được làm kiểu tham số hay field.</p>

<h3>implements kiểm một class với một interface</h3>
<p>Một class nói <code>implements Repo</code> nhưng thiếu một method:</p>
${ma('ts', CODE.implements)}
${ra(OUT['13-implements'])}
<p><strong>TS2420</strong> — nó tuyên bố thoả interface mà không. <code>implements</code> là một lời hứa trình biên dịch kiểm: thêm một method vào interface và mọi bên cài chưa theo kịp sáng lên.</p>

<h3>Nhìn nhanh</h3>
${KV_VI}

<h3>🧪 Luyện tập</h3>
<p>Một <code>SeatStore extends Store</code> cụ thể quên <code>get</code> abstract:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['14-pr-start'])}
<p>Cài nó và nó chạy:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['15-pr-sol'])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một <code>abstract</code> class trộn method đã viết với method abstract lớp con phải cung cấp.</li>
<li>Dựng một abstract class là TS2511; bạn dựng một lớp con cụ thể thay vào đó.</li>
<li><code>implements Interface</code> kiểm một class về cấu trúc — một method thiếu là TS2420.</li>
<li>Một lớp con non-abstract thiếu một thành viên abstract kế thừa là TS2654/TS2515.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Abstract Classes', 'Thành viên abstract và vì sao không dựng được. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/classes.html#abstract-classes-and-members')}
${nguon('📘', 'TypeScript Handbook — implements Clauses', 'Kiểm một class với một interface. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/classes.html#implements-clauses')}
${lienKet({ khoa: 'typescript', bai: 'typescript-6-3-generic-types-classes', title: 'Làm repo generic — TypeScript 6.3: Kiểu & class generic', sub: 'Giống: một class định nghĩa một dáng dùng lại — ở đây một repo abstract mà backend nào cũng điền. Khác: ở đó bạn làm class generic (<code>Repo&lt;T&gt;</code>) để một repository phục vụ mọi model; ghép nó với <code>abstract</code> của bài này cho một hợp đồng nền có kiểu qua mọi entity.', cta: 'MỞ BÀI TYPESCRIPT →' })}
</div>
`,
};
