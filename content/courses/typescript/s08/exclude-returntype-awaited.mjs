/**
 * TypeScript · Chương 8 · 8.4 — Exclude, NonNullable, ReturnType, Parameters & Awaited. Slug giữ: typescript-8-4-exclude-returntype-awaited.
 * Code/output từ ./_ma-ts-08-4.mjs (demo8/ts-08-4, Node 22.23.3 + tsc 7.0.2). Soạn lại TRỌN 04/11/2026.
 */
import G from '../giang/ts-08-4.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-08-4.mjs';

const KV_EN = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>Exclude&lt;U, M&gt;</code></span><span class="v">The union <code>U</code> without the members <code>M</code> — distributes.</span></div>
  <div class="kv"><span class="k"><code>NonNullable&lt;U&gt;</code></span><span class="v">The union <code>U</code> without <code>null</code> and <code>undefined</code>.</span></div>
  <div class="kv"><span class="k"><code>ReturnType&lt;F&gt;</code></span><span class="v">The result type of a function, read from its signature.</span></div>
  <div class="kv"><span class="k"><code>Parameters&lt;F&gt;</code></span><span class="v">The argument types of a function, as a tuple.</span></div>
  <div class="kv"><span class="k"><code>Awaited&lt;P&gt;</code></span><span class="v">The value a <code>Promise</code> resolves to — the type after <code>await</code>.</span></div>
</div>`;
const KV_VI = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>Exclude&lt;U, M&gt;</code></span><span class="v">Union <code>U</code> bỏ các thành viên <code>M</code> — distribute.</span></div>
  <div class="kv"><span class="k"><code>NonNullable&lt;U&gt;</code></span><span class="v">Union <code>U</code> bỏ <code>null</code> và <code>undefined</code>.</span></div>
  <div class="kv"><span class="k"><code>ReturnType&lt;F&gt;</code></span><span class="v">Kiểu kết quả của một hàm, đọc từ chữ ký của nó.</span></div>
  <div class="kv"><span class="k"><code>Parameters&lt;F&gt;</code></span><span class="v">Các kiểu tham số của một hàm, dạng một tuple.</span></div>
  <div class="kv"><span class="k"><code>Awaited&lt;P&gt;</code></span><span class="v">Giá trị một <code>Promise</code> resolve tới — kiểu sau <code>await</code>.</span></div>
</div>`;

export default {
  title: '8.4 — Exclude, NonNullable, ReturnType & Awaited|||8.4 — Exclude, NonNullable, ReturnType & Awaited',
  slug: 'typescript-8-4-exclude-returntype-awaited',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Những utility cuối: lọc một union và đọc kiểu ra từ hàm. Exclude<Status,"CANCELLED"> là các trạng thái còn chuyển tới được (gán CANCELLED ⇒ TS2322); NonNullable bỏ null/undefined (gán null ⇒ TS2322). ReturnType<typeof f> đọc kiểu trả về; Parameters<typeof f> là tuple tham số; Awaited mở một Promise thành giá trị sau await. Tất cả là conditional type của Chương 7, được đặt tên — đừng khai lại một kiểu đã tồn tại. Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.4</span>
<h2>Exclude, NonNullable, ReturnType &amp; Awaited</h2>
<p class="lead">The last utilities do two jobs: <strong>filter a union</strong>, and <strong>read a type out of existing code</strong>. <code>Exclude</code> and <code>NonNullable</code> remove members from a union; <code>ReturnType</code>, <code>Parameters</code> and <code>Awaited</code> pull the result, the arguments and the resolved value out of a function. All of them are the conditional types of 7.3, named — so you never re-declare a type that already exists.</p>

<h3>Exclude: remove members from a union</h3>
<p><code>Exclude&lt;Status, 'CANCELLED'&gt;</code> is the union of the states a booking can still move to:</p>
${ma('ts', CODE.excludeStatus)}
${ra(OUT['11-exclude'])}
<p><strong>TS2322</strong>: <code>CANCELLED</code> is not in the narrowed union. <code>Exclude</code> distributes over the union, dropping the members you name — so you derive one union from another instead of writing a second list that can drift.</p>

<h3>NonNullable: drop null and undefined</h3>
<p><code>NonNullable&lt;U&gt;</code> removes <code>null</code> and <code>undefined</code> — the special case of <code>Exclude</code> you reach for after a guard:</p>
${ma('ts', CODE.nonnullFind)}
${ra(OUT['12-nonnull'])}
<p><strong>TS2322</strong>: assigning <code>null</code> is refused. You met the mechanism in 7.3 (a distributive conditional); here it is one word for the most common filter there is.</p>

<h3>ReturnType: read a function’s result</h3>
<p><code>ReturnType&lt;typeof checkSlot&gt;</code> is the result type of <code>checkSlot</code>, read straight from the function — no second declaration to keep in sync:</p>
${ma('ts', CODE.returntypeRet)}
${ra(OUT['13-returntype'])}
<p><code>typeof</code> turns the value <code>checkSlot</code> into its type (1.3), and <code>ReturnType</code> captures what comes after the arrow — the named form of the <code>infer</code> trick in 7.3. Change <code>checkSlot</code> and the type follows.</p>

<h3>Parameters: read the argument list</h3>
<p><code>Parameters&lt;typeof createBooking&gt;</code> is a tuple of its argument types:</p>
${ma('ts', CODE.parametersArgs)}
${ra(OUT['14-parameters'])}
<p>A wrapper, a logger or a retry can store the arguments in that tuple and spread them back, and it stays in step with the function — add an argument and the tuple grows. It is <code>ReturnType</code> for the other side of the arrow.</p>

<h3>Awaited: unwrap a Promise</h3>
<p>An <code>async</code> function returns a <code>Promise</code>; <code>Awaited</code> unwraps it to the value you actually have after <code>await</code>:</p>
${ma('ts', CODE.awaitedFetch)}
${ra(OUT['15-awaited'])}
<p><code>Awaited&lt;ReturnType&lt;typeof fetchBooking&gt;&gt;</code> is <code>Booking</code>, not <code>Promise&lt;Booking&gt;</code> — and it even unwraps a <code>Promise</code> of a <code>Promise</code>. This is the type you want everywhere you write <code>await</code>.</p>

<h3>The five, at a glance</h3>
${KV_EN}

<h3>🧪 Practice</h3>
<p>A wrapper re-declares <code>checkSlot</code>’s return type by hand, and it has already drifted (<code>minutes</code> typed <code>string</code>):</p>
${ma('ts', CODE.prStart)}
${ra(OUT['16-pr-start'])}
<p><strong>TS2322</strong>. Derive the return type with <code>ReturnType&lt;typeof checkSlot&gt;</code> and the wrapper tracks the function:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['17-pr-sol'])}

<h3>📌 Summary</h3>
<ul>
<li><code>Exclude&lt;U, M&gt;</code> removes members from a union (distributes); <code>NonNullable&lt;U&gt;</code> drops <code>null</code>/<code>undefined</code>.</li>
<li><code>ReturnType&lt;F&gt;</code> reads a function’s result; <code>Parameters&lt;F&gt;</code> its argument tuple; <code>Awaited&lt;P&gt;</code> a Promise’s value.</li>
<li>All are named conditional types from 7.3 — never re-declare a type that already exists in the code.</li>
<li>A hand-written copy drifts; a derived type cannot — the whole chapter in one sentence.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Utility Types', 'Exclude, NonNullable, ReturnType, Parameters, Awaited. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/utility-types.html')}
${nguon('📘', 'TypeScript Handbook — Conditional Types', 'The infer machinery behind ReturnType and Awaited. Read 4 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/conditional-types.html')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-1-4-bat-dong-bo', title: 'What you have after await, in the type — Node.js 1.4: Asynchronous JavaScript', sub: 'Same: an async function hands back a <code>Promise</code>, and you only have the value once you <code>await</code> it. Different: there you learn to await and not forget it; here <code>Awaited&lt;ReturnType&lt;typeof fetchBooking&gt;&gt;</code> is the resolved type — <code>Booking</code>, not <code>Promise&lt;Booking&gt;</code> — read straight from the function, and <code>ReturnType</code>/<code>Parameters</code> read the rest of its signature.', cta: 'OPEN NODE.JS LESSON →' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.4</span>
<h2>Exclude, NonNullable, ReturnType &amp; Awaited</h2>
<p class="lead">Những utility cuối làm hai việc: <strong>lọc một union</strong>, và <strong>đọc một kiểu ra từ mã có sẵn</strong>. <code>Exclude</code> và <code>NonNullable</code> bỏ thành viên khỏi một union; <code>ReturnType</code>, <code>Parameters</code> và <code>Awaited</code> rút kết quả, tham số và giá trị đã resolve ra từ một hàm. Tất cả là conditional type của 7.3, được đặt tên — nên bạn không bao giờ khai lại một kiểu đã tồn tại.</p>

<h3>Exclude: bỏ thành viên khỏi một union</h3>
<p><code>Exclude&lt;Status, 'CANCELLED'&gt;</code> là union các trạng thái một booking còn chuyển tới được:</p>
${ma('ts', CODE.excludeStatus)}
${ra(OUT['11-exclude'])}
<p><strong>TS2322</strong>: <code>CANCELLED</code> không có trong union đã thu hẹp. <code>Exclude</code> distribute qua union, bỏ các thành viên bạn nêu — nên bạn suy một union từ union khác thay vì viết một danh sách thứ hai có thể trôi.</p>

<h3>NonNullable: bỏ null và undefined</h3>
<p><code>NonNullable&lt;U&gt;</code> bỏ <code>null</code> và <code>undefined</code> — trường hợp đặc biệt của <code>Exclude</code> bạn dùng sau một guard:</p>
${ma('ts', CODE.nonnullFind)}
${ra(OUT['12-nonnull'])}
<p><strong>TS2322</strong>: gán <code>null</code> bị từ chối. Bạn đã gặp cơ chế ở 7.3 (một conditional distribute); ở đây nó là một từ cho phép lọc hay gặp nhất.</p>

<h3>ReturnType: đọc kết quả của một hàm</h3>
<p><code>ReturnType&lt;typeof checkSlot&gt;</code> là kiểu kết quả của <code>checkSlot</code>, đọc thẳng từ hàm — không có khai báo thứ hai phải giữ đồng bộ:</p>
${ma('ts', CODE.returntypeRet)}
${ra(OUT['13-returntype'])}
<p><code>typeof</code> biến giá trị <code>checkSlot</code> thành kiểu của nó (1.3), và <code>ReturnType</code> bắt cái sau mũi tên — dạng có tên của mẹo <code>infer</code> ở 7.3. Đổi <code>checkSlot</code> thì kiểu theo.</p>

<h3>Parameters: đọc danh sách tham số</h3>
<p><code>Parameters&lt;typeof createBooking&gt;</code> là một tuple các kiểu tham số của nó:</p>
${ma('ts', CODE.parametersArgs)}
${ra(OUT['14-parameters'])}
<p>Một wrapper, một logger hay một retry có thể lưu các đối số trong tuple đó rồi spread lại, và nó bám theo hàm — thêm một đối số thì tuple lớn theo. Nó là <code>ReturnType</code> cho phía kia của mũi tên.</p>

<h3>Awaited: mở một Promise</h3>
<p>Một hàm <code>async</code> trả một <code>Promise</code>; <code>Awaited</code> mở nó thành giá trị bạn thật sự có sau <code>await</code>:</p>
${ma('ts', CODE.awaitedFetch)}
${ra(OUT['15-awaited'])}
<p><code>Awaited&lt;ReturnType&lt;typeof fetchBooking&gt;&gt;</code> là <code>Booking</code>, không phải <code>Promise&lt;Booking&gt;</code> — và nó mở cả một <code>Promise</code> của một <code>Promise</code>. Đây là kiểu bạn muốn ở mọi chỗ viết <code>await</code>.</p>

<h3>Năm cái, nhìn nhanh</h3>
${KV_VI}

<h3>🧪 Luyện tập</h3>
<p>Một wrapper khai lại kiểu trả về của <code>checkSlot</code> bằng tay, và nó đã trôi (<code>minutes</code> kiểu <code>string</code>):</p>
${ma('ts', CODE.prStart)}
${ra(OUT['16-pr-start'])}
<p><strong>TS2322</strong>. Suy kiểu trả về bằng <code>ReturnType&lt;typeof checkSlot&gt;</code> và wrapper bám theo hàm:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['17-pr-sol'])}

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>Exclude&lt;U, M&gt;</code> bỏ thành viên khỏi một union (distribute); <code>NonNullable&lt;U&gt;</code> bỏ <code>null</code>/<code>undefined</code>.</li>
<li><code>ReturnType&lt;F&gt;</code> đọc kết quả của một hàm; <code>Parameters&lt;F&gt;</code> tuple tham số; <code>Awaited&lt;P&gt;</code> giá trị của một Promise.</li>
<li>Tất cả là conditional type có tên của 7.3 — đừng khai lại một kiểu đã tồn tại trong code.</li>
<li>Một bản sao viết tay trôi; một kiểu suy ra thì không — cả chương trong một câu.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Utility Types', 'Exclude, NonNullable, ReturnType, Parameters, Awaited. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/utility-types.html')}
${nguon('📘', 'TypeScript Handbook — Conditional Types', 'Bộ máy infer đằng sau ReturnType và Awaited. Đọc ngày 4/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/conditional-types.html')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-1-4-bat-dong-bo', title: 'Thứ bạn có sau await, trong kiểu — Node.js 1.4: JavaScript bất đồng bộ', sub: 'Giống: một hàm async trả về một <code>Promise</code>, và bạn chỉ có giá trị khi đã <code>await</code> nó. Khác: ở đó bạn học await và đừng quên nó; ở đây <code>Awaited&lt;ReturnType&lt;typeof fetchBooking&gt;&gt;</code> là kiểu đã resolve — <code>Booking</code>, không phải <code>Promise&lt;Booking&gt;</code> — đọc thẳng từ hàm, và <code>ReturnType</code>/<code>Parameters</code> đọc phần còn lại của chữ ký.', cta: 'MỞ BÀI NODE.JS →' })}
</div>
`,
};
