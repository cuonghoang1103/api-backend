/**
 * TypeScript · Chương 14 · 14.3 — Native #private, getters & static. Slug giữ: typescript-14-3-hash-private-static.
 * Code/output từ ./_ma-ts-14-3.mjs (demo14/ts-14-3, Node 22.23.3 + tsc 7.0.2). Soạn lại TRỌN 04/11/2026. Class native.
 */
import G from '../giang/ts-14-3.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-14-3.mjs';

const KV_EN = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>#private</code></span><span class="v">Hidden by the language at run time — reading it outside is TS18013.</span></div>
  <div class="kv"><span class="k">vs <code>private</code></span><span class="v"><code>private</code> is compile-time only; <code>#private</code> is real.</span></div>
  <div class="kv"><span class="k">a getter</span><span class="v"><code>get x()</code> — a read-only computed view.</span></div>
  <div class="kv"><span class="k"><code>static</code></span><span class="v">Belongs to the class, not an instance.</span></div>
  <div class="kv"><span class="k">no escape</span><span class="v">Even plain JavaScript cannot read a <code>#</code> field.</span></div>
</div>`;
const KV_VI = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>#private</code></span><span class="v">Ngôn ngữ giấu lúc chạy — đọc nó ngoài là TS18013.</span></div>
  <div class="kv"><span class="k">so với <code>private</code></span><span class="v"><code>private</code> chỉ lúc biên dịch; <code>#private</code> là thật.</span></div>
  <div class="kv"><span class="k">một getter</span><span class="v"><code>get x()</code> — một view chỉ-đọc được tính.</span></div>
  <div class="kv"><span class="k"><code>static</code></span><span class="v">Thuộc về class, không thuộc một instance.</span></div>
  <div class="kv"><span class="k">không lối thoát</span><span class="v">Cả JavaScript thuần cũng không đọc được một trường <code>#</code>.</span></div>
</div>`;

export default {
  title: '14.3 — Native #private, getters & static|||14.3 — #private thật, getter & static',
  slug: 'typescript-14-3-hash-private-static',
  type: 'LESSON',
  isFreePreview: false,
  description: 'private của 14.1 là phép kiểm lúc biên dịch (bị xoá ở output). #private khác: một trường JavaScript chính ngôn ngữ giấu lúc chạy — không code nào ngoài class với tới được (đọc svc.#x ngoài ⇒ TS18013), cả JavaScript thuần cũng không. Thêm getter (get x() — view chỉ-đọc được tính) và static (thành viên cấp-class). Dùng #private khi trạng thái ẩn phải thật sự ở ẩn. Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.3</span>
<h2>Native <code>#private</code>, getters &amp; static</h2>
<p class="lead">Lesson 14.1’s <code>private</code> is a compile-time check, erased in the output. <code>#private</code> is different: it is a JavaScript field the language itself hides at run time — no code outside the class can reach it, ever. Add getters for read-only views and <code>static</code> members for class-level constants, and a class controls exactly what the world sees.</p>

<h3>#private is enforced at run time</h3>
<p>A <code>BookingService</code> with a <code>#count</code>, a <code>get booked()</code> and a <code>static readonly MAX</code>:</p>
${ma('ts', CODE.hashprivate)}
${ra(OUT['11-hashprivate'])}
<p>The <code>#</code> field is reachable only from inside the class body — not by types alone, but by the language itself.</p>

<h3>#private cannot be read from outside</h3>
<p>Write <code>svc.#count</code> outside the class:</p>
${ma('ts', CODE.access)}
${ra(OUT['12-access'])}
<p><strong>TS18013</strong>. Unlike <code>private</code> (which only the type checker knows), <code>#private</code> is real encapsulation: even plain JavaScript cannot read it, so there is no cast, no bracket trick, no run-time escape. Reach for it when the hidden state must truly stay hidden.</p>

<h3>getters and static members</h3>
<p>A <code>get booked()</code> exposes a computed, read-only view of the private count — callers read <code>svc.booked</code> like a field but cannot set it. A <code>static readonly MAX</code> belongs to the class, not an instance, so it is a shared constant read as <code>BookingService.MAX</code>. Together they shape the class’s public surface.</p>

<h3>At a glance</h3>
${KV_EN}

<h3>🧪 Practice</h3>
<p>A <code>Counter</code> reads its <code>#n</code> from outside:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['13-pr-start'])}
<p>Read it through the getter and it runs:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['14-pr-sol'])}

<h3>📌 Summary</h3>
<ul>
<li><code>#private</code> is real run-time encapsulation — reading it outside is TS18013, and even JavaScript cannot reach it.</li>
<li>It is stronger than compile-time <code>private</code>; use it when the secret must never leak.</li>
<li>A <code>get x()</code> is a read-only computed view; a <code>static</code> member belongs to the class.</li>
<li>Together, getters, statics and <code>#private</code> shape exactly what a class exposes.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'MDN — Private class features', 'The #private field, enforced by JavaScript at run time. Read 4 Nov 2026.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties')}
${nguon('📘', 'TypeScript Handbook — Classes (static & accessors)', 'Getters, setters and static members. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/classes.html#static-members')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.3</span>
<h2><code>#private</code> thật, getter &amp; static</h2>
<p class="lead"><code>private</code> của bài 14.1 là một phép kiểm lúc biên dịch, bị xoá ở output. <code>#private</code> khác: nó là một trường JavaScript chính ngôn ngữ giấu lúc chạy — không code nào ngoài class với tới được, bao giờ. Thêm getter cho view chỉ-đọc và thành viên <code>static</code> cho hằng cấp-class, và một class kiểm soát đúng cái thế giới thấy.</p>

<h3>#private được ép lúc chạy</h3>
<p>Một <code>BookingService</code> với một <code>#count</code>, một <code>get booked()</code> và một <code>static readonly MAX</code>:</p>
${ma('ts', CODE.hashprivate)}
${ra(OUT['11-hashprivate'])}
<p>Trường <code>#</code> chỉ với tới được từ trong thân class — không bởi kiểu một mình, mà bởi chính ngôn ngữ.</p>

<h3>#private không đọc được từ ngoài</h3>
<p>Viết <code>svc.#count</code> ngoài class:</p>
${ma('ts', CODE.access)}
${ra(OUT['12-access'])}
<p><strong>TS18013</strong>. Khác <code>private</code> (chỉ bộ kiểm kiểu biết), <code>#private</code> là đóng gói thật: cả JavaScript thuần cũng không đọc được, nên không phép ép, không mẹo ngoặc, không lối thoát lúc chạy. Dùng nó khi trạng thái ẩn phải thật sự ở ẩn.</p>

<h3>getter và thành viên static</h3>
<p>Một <code>get booked()</code> phơi một view chỉ-đọc được tính từ count private — bên gọi đọc <code>svc.booked</code> như một field nhưng không đặt được. Một <code>static readonly MAX</code> thuộc về class, không thuộc một instance, nên nó là một hằng dùng chung đọc là <code>BookingService.MAX</code>. Cùng nhau chúng nắn bề mặt công khai của class.</p>

<h3>Nhìn nhanh</h3>
${KV_VI}

<h3>🧪 Luyện tập</h3>
<p>Một <code>Counter</code> đọc <code>#n</code> của nó từ ngoài:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['13-pr-start'])}
<p>Đọc nó qua getter và nó chạy:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['14-pr-sol'])}

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>#private</code> là đóng gói thật lúc chạy — đọc nó ngoài là TS18013, và cả JavaScript cũng không với tới được.</li>
<li>Nó mạnh hơn <code>private</code> lúc biên dịch; dùng nó khi bí mật không bao giờ được rò.</li>
<li>Một <code>get x()</code> là một view chỉ-đọc được tính; một thành viên <code>static</code> thuộc về class.</li>
<li>Cùng nhau, getter, static và <code>#private</code> nắn đúng cái một class phơi ra.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'MDN — Private class features', 'Trường #private, được JavaScript ép lúc chạy. Đọc ngày 4/11/2026.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties')}
${nguon('📘', 'TypeScript Handbook — Classes (static & accessors)', 'Getter, setter và thành viên static. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/classes.html#static-members')}
</div>
`,
};
