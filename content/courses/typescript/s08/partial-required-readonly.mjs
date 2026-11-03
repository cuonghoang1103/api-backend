/**
 * TypeScript · Chương 8 · 8.1 — Partial, Required & Readonly. Slug giữ: typescript-8-1-partial-required-readonly.
 * BÀI MỞ CHƯƠNG 8 (soạn lại TRỌN 04/11/2026 theo ./_HOP-DONG.md). Code/output từ ./_ma-ts-08-1.mjs (demo8/ts-08-1, Node 22.23.3 + tsc 7.0.2).
 */
import G from '../giang/ts-08-1.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-08-1.mjs';

const KV_EN = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>Partial&lt;T&gt;</code></span><span class="v">Every field optional — <code>{ [K in keyof T]?: T[K] }</code>. A PATCH body.</span></div>
  <div class="kv"><span class="k"><code>Required&lt;T&gt;</code></span><span class="v">Every field mandatory — removes <code>?</code> (<code>-?</code>). A completed draft.</span></div>
  <div class="kv"><span class="k"><code>Readonly&lt;T&gt;</code></span><span class="v">Every field read-only (compile-time, one level deep). A snapshot.</span></div>
  <div class="kv"><span class="k">compose</span><span class="v">They are types, so they nest: <code>Readonly&lt;Partial&lt;T&gt;&gt;</code>.</span></div>
  <div class="kv"><span class="k">named mapped types</span><span class="v">Each is one word for a mapped type from Chapter 7.</span></div>
</div>`;
const KV_VI = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>Partial&lt;T&gt;</code></span><span class="v">Mọi trường optional — <code>{ [K in keyof T]?: T[K] }</code>. Một PATCH body.</span></div>
  <div class="kv"><span class="k"><code>Required&lt;T&gt;</code></span><span class="v">Mọi trường bắt buộc — gỡ <code>?</code> (<code>-?</code>). Một draft đã đủ.</span></div>
  <div class="kv"><span class="k"><code>Readonly&lt;T&gt;</code></span><span class="v">Mọi trường chỉ đọc (lúc biên dịch, nông một tầng). Một ảnh chụp.</span></div>
  <div class="kv"><span class="k">ghép</span><span class="v">Chúng là kiểu, nên lồng được: <code>Readonly&lt;Partial&lt;T&gt;&gt;</code>.</span></div>
  <div class="kv"><span class="k">mapped type có tên</span><span class="v">Mỗi cái là một từ cho một mapped type của Chương 7.</span></div>
</div>`;

export default {
  title: '8.1 — Partial, Required & Readonly|||8.1 — Partial, Required & Readonly',
  slug: 'typescript-8-1-partial-required-readonly',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mở Chương 8: thư viện utility types. Ba cái đổi modifier của mọi trường — Partial<T> làm tất cả optional (một PATCH body, { seats } biên dịch), Required<T> gỡ mọi ? (thiếu trường ⇒ TS2739), Readonly<T> làm tất cả read-only (gán lại ⇒ TS2540, chỉ lúc biên dịch, nông một tầng). Chúng là kiểu nên ghép được (Readonly<Partial<T>>). Chính là các mapped type của Chương 7, giờ một từ. Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>Partial, Required &amp; Readonly</h2>
<p class="lead">Chapter 7 built mapped types by hand; Chapter 8 is their library. TypeScript ships the everyday ones with names, so you write one word — <code>Partial</code>, <code>Required</code>, <code>Readonly</code>, <code>Pick</code>, <code>Omit</code>, <code>Record</code>, <code>Exclude</code>, <code>ReturnType</code>, <code>Awaited</code> — instead of a mapped or conditional type. This lesson covers the three that change the <em>modifiers</em> of every field.</p>

<h3>After Chapter 8 you can…</h3>
<ul>
<li>Reach for <code>Partial</code>/<code>Required</code> for optionality and <code>Readonly</code> for immutability (this lesson).</li>
<li>Shape a type into a DTO with <code>Pick</code> and <code>Omit</code> (8.2).</li>
<li>Build a complete table with <code>Record</code> (8.3); filter a union and read types out of functions — <code>Exclude</code>, <code>NonNullable</code>, <code>ReturnType</code>, <code>Parameters</code>, <code>Awaited</code> (8.4).</li>
<li>Rebuild <code>Partial</code>/<code>Pick</code>/<code>Omit</code> yourself and build the API DTO layer (Lab 8).</li>
</ul>

<h3>Partial: every field optional</h3>
<p><code>Partial&lt;T&gt;</code> makes every field of <code>T</code> optional — the shape of a PATCH body. <code>applyPatch</code> takes a <code>Partial&lt;Booking&gt;</code>, so a caller may send only the fields they change:</p>
${ma('ts', CODE.partialPatch)}
${ra(OUT['11-partial'])}
<p><code>{ seats: 30 }</code> compiles, and so does <code>{ lab, seats }</code> — omitting the rest is fine. This is exactly <code>{ [K in keyof T]?: T[K] }</code> from 7.2, now one word. Its home is any “update” shape, where a client changes a few fields and leaves the rest.</p>

<h3>Required: every field mandatory</h3>
<p><code>Required&lt;T&gt;</code> is the mirror image — it strips every <code>?</code>, so a type full of optionals becomes fully mandatory. A value with only <code>title</code> is refused:</p>
${ma('ts', CODE.requiredComplete)}
${ra(OUT['12-required'])}
<p><strong>TS2739</strong>: <code>body</code> and <code>tags</code> are missing. Reach for <code>Required</code> after validation, when you have confirmed a loose draft is now complete. It is <code>{ [K in keyof T]-?: T[K] }</code> named.</p>

<h3>Readonly: every field frozen</h3>
<p><code>Readonly&lt;T&gt;</code> makes every field read-only — assignable when you build the value, immutable after:</p>
${ma('ts', CODE.readonlyConfig)}
${ra(OUT['13-readonly'])}
<p><strong>TS2540</strong>: you cannot reassign <code>cfg.port</code>. Two caveats you met in Chapter 2: it is <strong>compile-time only</strong> (Node strips it; the object is not frozen at run time — <code>Object.freeze</code> does that), and it is <strong>one level deep</strong> (a nested object or array is still mutable). It is <code>{ readonly [K in keyof T]: T[K] }</code> from 7.1.</p>

<h3>Utility types compose</h3>
<p>They are ordinary types, so they nest. <code>Readonly&lt;Partial&lt;Booking&gt;&gt;</code> is a read-only patch — every field optional <em>and</em> read-only:</p>
${ma('ts', CODE.combineSnapshot)}
${ra(OUT['14-combine'])}
<p>You stack them the way you stack functions; the outer one wraps the inner. A small vocabulary covers a lot of shapes precisely because it composes.</p>

<h3>The three, and what each promises</h3>
${KV_EN}

<h3>🧪 Practice</h3>
<p>A hand-written <code>UserEdit</code> types the patch as the full <code>User</code>, so the caller must resend every field — <code>edit(u, { name: 'Ada' })</code> is refused:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['15-pr-start'])}
<p>Change the patch parameter to <code>Partial&lt;User&gt;</code> so any subset is accepted, and it runs:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['16-pr-sol'])}

<h3>📌 Summary</h3>
<ul>
<li><code>Partial&lt;T&gt;</code> makes every field optional — a PATCH body; <code>{ seats }</code> compiles.</li>
<li><code>Required&lt;T&gt;</code> removes every <code>?</code> — a value missing a field is TS2739.</li>
<li><code>Readonly&lt;T&gt;</code> freezes every field — reassigning is TS2540; compile-time only, one level deep.</li>
<li>They compose (<code>Readonly&lt;Partial&lt;T&gt;&gt;</code>) and they are the named mapped types of Chapter 7.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Utility Types', 'Partial, Required, Readonly and the rest, each a named mapped type. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/utility-types.html')}
${nguon('📘', 'TypeScript Handbook — Mapped Types', 'The mapped and modifier syntax these utilities are built from. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/mapped-types.html')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Partial, Required &amp; Readonly</h2>
<p class="lead">Chương 7 dựng mapped type bằng tay; Chương 8 là thư viện của chúng. TypeScript dựng sẵn những cái hay dùng kèm tên, nên bạn viết một từ — <code>Partial</code>, <code>Required</code>, <code>Readonly</code>, <code>Pick</code>, <code>Omit</code>, <code>Record</code>, <code>Exclude</code>, <code>ReturnType</code>, <code>Awaited</code> — thay vì một mapped hay conditional type. Bài này là ba cái đổi <em>modifier</em> của mọi trường.</p>

<h3>Sau Chương 8 bạn có thể…</h3>
<ul>
<li>Gọi <code>Partial</code>/<code>Required</code> cho tính tuỳ chọn và <code>Readonly</code> cho bất biến (bài này).</li>
<li>Nắn một kiểu thành DTO bằng <code>Pick</code> và <code>Omit</code> (8.2).</li>
<li>Dựng một bảng đầy đủ bằng <code>Record</code> (8.3); lọc một union và đọc kiểu ra từ hàm — <code>Exclude</code>, <code>NonNullable</code>, <code>ReturnType</code>, <code>Parameters</code>, <code>Awaited</code> (8.4).</li>
<li>Tự dựng lại <code>Partial</code>/<code>Pick</code>/<code>Omit</code> và dựng tầng DTO của API (Lab 8).</li>
</ul>

<h3>Partial: mọi trường optional</h3>
<p><code>Partial&lt;T&gt;</code> làm mọi trường của <code>T</code> thành optional — dáng của một PATCH body. <code>applyPatch</code> nhận một <code>Partial&lt;Booking&gt;</code>, nên người gọi chỉ gửi những trường mình đổi:</p>
${ma('ts', CODE.partialPatch)}
${ra(OUT['11-partial'])}
<p><code>{ seats: 30 }</code> biên dịch được, và <code>{ lab, seats }</code> cũng vậy — bỏ phần còn lại là được. Đây đúng là <code>{ [K in keyof T]?: T[K] }</code> của 7.2, giờ một từ. Nhà của nó là mọi dáng “cập nhật”, nơi client đổi vài trường và để yên phần còn lại.</p>

<h3>Required: mọi trường bắt buộc</h3>
<p><code>Required&lt;T&gt;</code> là ảnh gương — nó gỡ mọi <code>?</code>, nên một kiểu đầy optional thành bắt buộc hết. Một giá trị chỉ có <code>title</code> bị từ chối:</p>
${ma('ts', CODE.requiredComplete)}
${ra(OUT['12-required'])}
<p><strong>TS2739</strong>: thiếu <code>body</code> và <code>tags</code>. Dùng <code>Required</code> sau khi kiểm lệ, khi đã chắc một draft lỏng giờ đã đủ. Nó là <code>{ [K in keyof T]-?: T[K] }</code> được đặt tên.</p>

<h3>Readonly: mọi trường đóng băng</h3>
<p><code>Readonly&lt;T&gt;</code> làm mọi trường chỉ đọc — gán được khi dựng giá trị, bất biến sau đó:</p>
${ma('ts', CODE.readonlyConfig)}
${ra(OUT['13-readonly'])}
<p><strong>TS2540</strong>: bạn không gán lại được <code>cfg.port</code>. Hai lưu ý bạn gặp ở Chương 2: nó <strong>chỉ có lúc biên dịch</strong> (Node bỏ nó; object không bị đóng băng lúc chạy — <code>Object.freeze</code> mới làm vậy), và nó <strong>nông một tầng</strong> (object/mảng lồng bên trong vẫn sửa được). Nó là <code>{ readonly [K in keyof T]: T[K] }</code> của 7.1.</p>

<h3>Utility types ghép được</h3>
<p>Chúng là kiểu bình thường nên lồng được. <code>Readonly&lt;Partial&lt;Booking&gt;&gt;</code> là một patch chỉ-đọc — mọi trường optional <em>và</em> read-only:</p>
${ma('ts', CODE.combineSnapshot)}
${ra(OUT['14-combine'])}
<p>Bạn xếp chồng như xếp hàm; cái ngoài bọc cái trong. Một bộ từ vựng nhỏ phủ được nhiều dáng chính vì nó ghép được.</p>

<h3>Ba cái, và mỗi cái hứa gì</h3>
${KV_VI}

<h3>🧪 Luyện tập</h3>
<p>Một <code>UserEdit</code> viết tay gán patch là <code>User</code> đầy đủ, nên người gọi phải gửi lại mọi trường — <code>edit(u, { name: 'Ada' })</code> bị từ chối:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['15-pr-start'])}
<p>Đổi tham số patch thành <code>Partial&lt;User&gt;</code> để nhận tập con bất kỳ, và nó chạy:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['16-pr-sol'])}

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>Partial&lt;T&gt;</code> làm mọi trường optional — một PATCH body; <code>{ seats }</code> biên dịch.</li>
<li><code>Required&lt;T&gt;</code> gỡ mọi <code>?</code> — một giá trị thiếu trường là TS2739.</li>
<li><code>Readonly&lt;T&gt;</code> đóng băng mọi trường — gán lại là TS2540; chỉ lúc biên dịch, nông một tầng.</li>
<li>Chúng ghép được (<code>Readonly&lt;Partial&lt;T&gt;&gt;</code>) và là các mapped type có tên của Chương 7.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Utility Types', 'Partial, Required, Readonly và phần còn lại, mỗi cái một mapped type có tên. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/utility-types.html')}
${nguon('📘', 'TypeScript Handbook — Mapped Types', 'Cú pháp mapped và modifier mà các utility này dựng từ đó. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/mapped-types.html')}
</div>
`,
};
