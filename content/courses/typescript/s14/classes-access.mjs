/**
 * TypeScript · Chương 14 · 14.1 — Classes & access modifiers. Slug giữ: typescript-14-1-classes-access.
 * BÀI MỞ CHƯƠNG 14 (soạn lại TRỌN 04/11/2026). Code/output từ ./_ma-ts-14-1.mjs (demo14/ts-14-1, Node 22.23.3 + tsc 7.0.2). Class native, không gói ngoài.
 */
import G from '../giang/ts-14-1.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-14-1.mjs';

const KV_EN = `<div class="kv-grid">
  <div class="kv"><span class="k">a class</span><span class="v">Groups data with the operations on it.</span></div>
  <div class="kv"><span class="k"><code>private</code></span><span class="v">Hides a field — reading it outside is TS2341.</span></div>
  <div class="kv"><span class="k"><code>readonly</code></span><span class="v">Fixed after construction — reassigning is TS2540.</span></div>
  <div class="kv"><span class="k"><code>protected</code></span><span class="v">Shared with subclasses only.</span></div>
  <div class="kv"><span class="k">compile-time</span><span class="v">These are erased at run time — for run-time hiding, 14.3’s <code>#private</code>.</span></div>
</div>`;
const KV_VI = `<div class="kv-grid">
  <div class="kv"><span class="k">một class</span><span class="v">Gom dữ liệu với các thao tác trên nó.</span></div>
  <div class="kv"><span class="k"><code>private</code></span><span class="v">Giấu một trường — đọc nó ngoài là TS2341.</span></div>
  <div class="kv"><span class="k"><code>readonly</code></span><span class="v">Cố định sau construction — gán lại là TS2540.</span></div>
  <div class="kv"><span class="k"><code>protected</code></span><span class="v">Chỉ chia với lớp con.</span></div>
  <div class="kv"><span class="k">lúc biên dịch</span><span class="v">Chúng bị xoá lúc chạy — giấu lúc chạy thì xem <code>#private</code> của 14.3.</span></div>
</div>`;

export default {
  title: '14.1 — Classes & access modifiers|||14.1 — Class & modifier truy cập',
  slug: 'typescript-14-1-classes-access',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mở Chương 14: class & decorator. Một class gom dữ liệu với thao tác, và modifier truy cập nói ai được chạm gì: private giấu một trường (đọc ngoài ⇒ TS2341), readonly cố định sau construction (gán lại ⇒ TS2540), protected chia với lớp con. Đây là phép kiểm lúc biên dịch (bị xoá lúc chạy) — khởi đầu của đóng gói; 14.3 có #private ép cả lúc chạy. Class native, không gói ngoài; đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.1</span>
<h2>Classes &amp; access modifiers</h2>
<p class="lead">A class groups data with the operations on it, and TypeScript adds access modifiers that say who may touch what. <code>private</code> hides a field inside the class, <code>readonly</code> fixes it after construction, <code>protected</code> shares it with subclasses. These are checked at compile time — a boundary the compiler enforces, the start of encapsulation.</p>

<h3>After Chapter 14 you can…</h3>
<ul>
<li>Use access modifiers — <code>private</code>, <code>readonly</code>, <code>protected</code> (this lesson).</li>
<li>Name a shape with an <code>abstract</code> class and check a class with <code>implements</code> (14.2).</li>
<li>Hide state at run time with <code>#private</code>, and use getters and <code>static</code> (14.3).</li>
<li>Wrap a member with a typed decorator (14.4), then design a service over an abstract repo (Lab 14).</li>
</ul>

<h3>A class groups data and operations</h3>
<p>A <code>BookingService</code> holds a private <code>count</code> and a readonly <code>lab</code>, and exposes <code>book()</code>:</p>
${ma('ts', CODE.service)}
${ra(OUT['11-service'])}
<p>From outside you call methods, not fields — the class decides what is visible.</p>

<h3>private hides internals</h3>
<p>Read a <code>private</code> field from outside the class:</p>
${ma('ts', CODE.private)}
${ra(OUT['12-private'])}
<p><strong>TS2341</strong>. The field exists at run time (TypeScript’s <code>private</code> is a compile-time check, erased in the output), but the compiler refuses the access — so callers depend on the method, not the internal state.</p>

<h3>readonly fixes a field after construction</h3>
<p>Reassign a <code>readonly</code> field after the constructor:</p>
${ma('ts', CODE.readonly)}
${ra(OUT['13-readonly'])}
<p><strong>TS2540</strong>. The field is set once, when the object is built, and never again — the <code>Readonly</code> of Chapter 8, on a single class field.</p>

<h3>At a glance</h3>
${KV_EN}

<h3>🧪 Practice</h3>
<p>A <code>Lab</code> reads its <code>private seats</code> from outside:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['14-pr-start'])}
<p>Read it through the method and it runs:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['15-pr-sol'])}

<h3>📌 Summary</h3>
<ul>
<li>A class groups data with its operations; access modifiers say who may touch what.</li>
<li><code>private</code> hides a field — reading it outside is TS2341.</li>
<li><code>readonly</code> fixes a field after construction — reassigning is TS2540.</li>
<li>These are compile-time boundaries, erased at run time; 14.3’s <code>#private</code> hides at run time too.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Classes', 'Fields, methods and access modifiers. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/classes.html')}
${nguon('📘', 'MDN — Classes', 'The JavaScript class the modifiers sit on. Read 4 Nov 2026.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes')}
${lienKet({ khoa: 'web-foundations', bai: 'wf-11-3-prototype-class', title: 'The class under the modifiers — Web Foundations 11.3: Prototypes & classes', sub: 'Same: a class groups data and the methods on it, built on JavaScript’s prototype chain. Different: there you see how the class desugars to prototypes at run time; here TypeScript adds compile-time access — a <code>private</code> field read from outside is TS2341, a <code>readonly</code> one reassigned is TS2540, all erased in the output.', cta: 'OPEN WEB FOUNDATIONS LESSON →' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.1</span>
<h2>Class &amp; modifier truy cập</h2>
<p class="lead">Một class gom dữ liệu với các thao tác trên nó, và TypeScript thêm modifier truy cập nói ai được chạm gì. <code>private</code> giấu một trường trong class, <code>readonly</code> cố định nó sau khi dựng, <code>protected</code> chia nó với lớp con. Chúng được kiểm lúc biên dịch — một ranh giới trình biên dịch ép, khởi đầu của đóng gói.</p>

<h3>Sau Chương 14 bạn có thể…</h3>
<ul>
<li>Dùng modifier truy cập — <code>private</code>, <code>readonly</code>, <code>protected</code> (bài này).</li>
<li>Đặt tên một dáng bằng một class <code>abstract</code> và kiểm một class bằng <code>implements</code> (14.2).</li>
<li>Giấu trạng thái lúc chạy bằng <code>#private</code>, và dùng getter và <code>static</code> (14.3).</li>
<li>Bọc một thành viên bằng một decorator có kiểu (14.4), rồi thiết kế một service trên một repo abstract (Lab 14).</li>
</ul>

<h3>Một class gom dữ liệu và thao tác</h3>
<p>Một <code>BookingService</code> giữ một <code>count</code> private và một <code>lab</code> readonly, và phơi <code>book()</code>:</p>
${ma('ts', CODE.service)}
${ra(OUT['11-service'])}
<p>Từ bên ngoài bạn gọi method, không gọi field — class quyết định cái gì nhìn thấy được.</p>

<h3>private giấu phần trong</h3>
<p>Đọc một trường <code>private</code> từ ngoài class:</p>
${ma('ts', CODE.private)}
${ra(OUT['12-private'])}
<p><strong>TS2341</strong>. Trường tồn tại lúc chạy (<code>private</code> của TypeScript là một phép kiểm lúc biên dịch, bị xoá ở output), nhưng trình biên dịch từ chối truy cập — nên bên gọi phụ thuộc method, không phụ thuộc trạng thái trong.</p>

<h3>readonly cố định một trường sau construction</h3>
<p>Gán lại một trường <code>readonly</code> sau constructor:</p>
${ma('ts', CODE.readonly)}
${ra(OUT['13-readonly'])}
<p><strong>TS2540</strong>. Trường được đặt một lần, khi object được dựng, và không bao giờ nữa — <code>Readonly</code> của Chương 8, trên một trường class đơn.</p>

<h3>Nhìn nhanh</h3>
${KV_VI}

<h3>🧪 Luyện tập</h3>
<p>Một <code>Lab</code> đọc <code>private seats</code> của nó từ ngoài:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['14-pr-start'])}
<p>Đọc nó qua method và nó chạy:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['15-pr-sol'])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một class gom dữ liệu với thao tác của nó; modifier truy cập nói ai được chạm gì.</li>
<li><code>private</code> giấu một trường — đọc nó ngoài là TS2341.</li>
<li><code>readonly</code> cố định một trường sau construction — gán lại là TS2540.</li>
<li>Chúng là ranh giới lúc biên dịch, bị xoá lúc chạy; <code>#private</code> của 14.3 giấu cả lúc chạy.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Classes', 'Field, method và modifier truy cập. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/classes.html')}
${nguon('📘', 'MDN — Classes', 'Class JavaScript mà modifier đặt lên. Đọc ngày 4/11/2026.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes')}
${lienKet({ khoa: 'web-foundations', bai: 'wf-11-3-prototype-class', title: 'Class dưới các modifier — Web Foundations 11.3: Prototype & class', sub: 'Giống: một class gom dữ liệu và các method trên nó, dựng trên chuỗi prototype của JavaScript. Khác: ở đó bạn thấy class rã thành prototype lúc chạy ra sao; ở đây TypeScript thêm truy cập lúc biên dịch — một trường <code>private</code> đọc từ ngoài là TS2341, một <code>readonly</code> gán lại là TS2540, tất cả bị xoá ở output.', cta: 'MỞ BÀI WEB FOUNDATIONS →' })}
</div>
`,
};
