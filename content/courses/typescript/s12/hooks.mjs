/**
 * TypeScript · Chương 12 · 12.2 — Typing hooks. Slug giữ: typescript-12-2-hooks.
 * Code/output từ ./_ma-ts-12-2.mjs (demo12/ts-12-2, Node 22.23.3 + tsc 7.0.2). Soạn lại TRỌN 04/11/2026. Mô hình react.ts tự-chứa.
 */
import G from '../giang/ts-12-2.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-12-2.mjs';

const KV_EN = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>useState(0)</code></span><span class="v">Infers <code>number</code>; nothing to write.</span></div>
  <div class="kv"><span class="k">the setter is checked</span><span class="v"><code>setCount('three')</code> is TS2345 — it only takes a number.</span></div>
  <div class="kv"><span class="k"><code>useState&lt;T | null&gt;(null)</code></span><span class="v">A null start needs the annotation, or it is stuck as <code>null</code>.</span></div>
  <div class="kv"><span class="k">read null unchecked</span><span class="v">TS18047 — the loading state must be handled.</span></div>
  <div class="kv"><span class="k"><code>ref.current</code></span><span class="v">Always <code>T | null</code> — the node exists only after render.</span></div>
</div>`;
const KV_VI = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>useState(0)</code></span><span class="v">Suy ra <code>number</code>; chẳng phải viết gì.</span></div>
  <div class="kv"><span class="k">setter được kiểm</span><span class="v"><code>setCount('three')</code> là TS2345 — nó chỉ nhận một number.</span></div>
  <div class="kv"><span class="k"><code>useState&lt;T | null&gt;(null)</code></span><span class="v">Một khởi đầu null cần chú thích, không thì kẹt ở <code>null</code>.</span></div>
  <div class="kv"><span class="k">đọc null chưa kiểm</span><span class="v">TS18047 — trạng thái loading phải được xử lý.</span></div>
  <div class="kv"><span class="k"><code>ref.current</code></span><span class="v">Luôn <code>T | null</code> — nút chỉ tồn tại sau render.</span></div>
</div>`;

export default {
  title: '12.2 — Typing hooks|||12.2 — Gõ kiểu hooks',
  slug: 'typescript-12-2-hooks',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Hook là các hàm generic. useState(0) suy ra number và gõ kiểu setter khớp theo — setCount("three") là TS2345. Khi state khởi đầu null, viết generic useState<User | null>(null): đọc .name mà không kiểm là TS18047 "possibly null", nên nhánh "chưa tải xong" buộc phải xử lý. Một ref có .current luôn là T | null (nút DOM chưa tồn tại tới khi render). Có cảnh báo bẫy stale-closure của setter. Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.2</span>
<h2>Typing hooks</h2>
<p class="lead">Hooks are generic functions, so they are typed like everything else from Chapter 6. Most of the time inference does the work; you pass a type argument only when the initial value cannot tell the whole story — above all when the state starts <code>null</code>.</p>

<h3>useState infers, and the setter is checked too</h3>
<p><code>useState(0)</code> infers <code>number</code> from the initial value — and the setter is typed to match:</p>
${ma('ts', CODE.useStateDemo)}
${ra(OUT['11-usestate'])}
<p>State and its updater come from one generic call, so they cannot drift apart.</p>

<h3>The setter refuses the wrong type</h3>
<p>Call the setter of a <code>number</code> state with a string:</p>
${ma('ts', CODE.wrongset)}
${ra(OUT['12-wrongset'])}
<p><strong>TS2345</strong> — the setter’s parameter is <code>number</code>. The state can never be set to something the rest of the component is not prepared to read, and the error is at the call, not three renders later.</p>

<h3>Nullable state forces the loading branch</h3>
<p>When the state starts <code>null</code>, write the generic explicitly — otherwise inference locks it to <code>null</code>. Read <code>.name</code> without checking:</p>
${ma('ts', CODE.nullstate)}
${ra(OUT['13-nullstate'])}
<p><strong>TS18047</strong> — <code>user</code> is possibly <code>null</code>. The <code>| null</code> is the “not loaded yet” state, and because it is in the type, you cannot read the user without handling it first.</p>

<h3>Narrow it, and a ref is the same story</h3>
<p>Check for <code>null</code> before reading; a <code>useRef&lt;T&gt;(null)</code> gives a <code>.current</code> of <code>T | null</code>, so you reach it with an optional chain:</p>
${ma('ts', CODE.nullstateOk)}
${ra(OUT['14-nullstate-ok'])}
<p>The DOM node does not exist until React attaches it — <code>ref.current</code> being <code>T | null</code> is the type describing a real timing fact, not a nuisance.</p>

<h3>Hooks, at a glance</h3>
${KV_EN}

<h3>🧪 Practice</h3>
<p>A <code>number</code> state set with a string:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['15-pr-start'])}
<p>Pass a number and it runs:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['16-pr-sol'])}

<h3>📌 Summary</h3>
<ul>
<li>Hooks are generics; <code>useState(x)</code> infers from <code>x</code> and types the setter to match.</li>
<li>Setting the wrong type is TS2345 — state and updater cannot drift.</li>
<li>A <code>null</code> start needs <code>useState&lt;T | null&gt;(null)</code>; reading it unchecked is TS18047.</li>
<li>A ref’s <code>.current</code> is always <code>T | null</code> — narrow it or use optional chaining.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'React — useState', 'The hook and its setter. Read 4 Nov 2026.', 'https://react.dev/reference/react/useState')}
${nguon('📘', 'React TypeScript Cheatsheets — Hooks', 'Typing useState, nullable state and refs. Read 4 Nov 2026.', 'https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks/')}
${lienKet({ khoa: 'react', bai: 'rx-2-1-use-state', title: 'The hook these types describe — React 2.1: useState', sub: 'Same: <code>useState</code> holds a value and gives a setter. Different: there you wire state into a live component and watch it re-render; here the types do the checking — the setter rejects a wrong value (TS2345) and a nullable state forces you to handle “not loaded yet” (TS18047).', cta: 'OPEN REACT LESSON →' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.2</span>
<h2>Gõ kiểu hooks</h2>
<p class="lead">Hook là các hàm generic, nên chúng được gõ kiểu như mọi thứ ở Chương 6. Đa số thời gian suy kiểu làm việc; bạn chỉ truyền một đối số kiểu khi giá trị khởi đầu không kể hết câu chuyện — nhất là khi state khởi đầu bằng <code>null</code>.</p>

<h3>useState suy kiểu, và setter cũng bị kiểm</h3>
<p><code>useState(0)</code> suy ra <code>number</code> từ giá trị đầu — và setter được gõ kiểu khớp theo:</p>
${ma('ts', CODE.useStateDemo)}
${ra(OUT['11-usestate'])}
<p>State và bộ cập nhật của nó đến từ một lời gọi generic, nên chúng không thể trôi lệch nhau.</p>

<h3>Setter từ chối sai kiểu</h3>
<p>Gọi setter của một state <code>number</code> với một string:</p>
${ma('ts', CODE.wrongset)}
${ra(OUT['12-wrongset'])}
<p><strong>TS2345</strong> — tham số của setter là <code>number</code>. State không bao giờ bị đặt thành thứ mà phần còn lại của component chưa sẵn sàng đọc, và lỗi ở ngay chỗ gọi, không phải ba lần render sau.</p>

<h3>State nullable buộc nhánh loading</h3>
<p>Khi state khởi đầu <code>null</code>, viết generic tường minh — không thì suy kiểu khoá nó thành <code>null</code>. Đọc <code>.name</code> mà không kiểm:</p>
${ma('ts', CODE.nullstate)}
${ra(OUT['13-nullstate'])}
<p><strong>TS18047</strong> — <code>user</code> có thể là <code>null</code>. Cái <code>| null</code> là trạng thái “chưa tải xong”, và vì nó nằm trong kiểu, bạn không đọc được user mà chưa xử lý nó trước.</p>

<h3>Thu hẹp nó, và một ref cũng vậy</h3>
<p>Kiểm <code>null</code> trước khi đọc; một <code>useRef&lt;T&gt;(null)</code> cho một <code>.current</code> là <code>T | null</code>, nên bạn với tới nó bằng một optional chain:</p>
${ma('ts', CODE.nullstateOk)}
${ra(OUT['14-nullstate-ok'])}
<p>Nút DOM chưa tồn tại tới khi React gắn nó — <code>ref.current</code> là <code>T | null</code> là kiểu đang mô tả một sự thật về thời điểm, không phải một phiền toái.</p>

<h3>Hook, nhìn nhanh</h3>
${KV_VI}

<h3>🧪 Luyện tập</h3>
<p>Một state <code>number</code> đặt bằng một string:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['15-pr-start'])}
<p>Truyền một số và nó chạy:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['16-pr-sol'])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Hook là generic; <code>useState(x)</code> suy từ <code>x</code> và gõ kiểu setter khớp theo.</li>
<li>Đặt sai kiểu là TS2345 — state và bộ cập nhật không trôi lệch được.</li>
<li>Một khởi đầu <code>null</code> cần <code>useState&lt;T | null&gt;(null)</code>; đọc nó chưa kiểm là TS18047.</li>
<li><code>.current</code> của một ref luôn là <code>T | null</code> — thu hẹp nó hoặc dùng optional chaining.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'React — useState', 'Hook và setter của nó. Đọc ngày 4/11/2026.', 'https://react.dev/reference/react/useState')}
${nguon('📘', 'React TypeScript Cheatsheets — Hooks', 'Gõ kiểu useState, state nullable và ref. Đọc ngày 4/11/2026.', 'https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks/')}
${lienKet({ khoa: 'react', bai: 'rx-2-1-use-state', title: 'Hook mà các kiểu này tả — React 2.1: useState', sub: 'Giống: <code>useState</code> giữ một giá trị và cho một setter. Khác: ở đó bạn nối state vào một component sống và nhìn nó render lại; ở đây kiểu làm việc kiểm — setter từ chối một giá trị sai (TS2345) và một state nullable buộc bạn xử lý “chưa tải xong” (TS18047).', cta: 'MỞ BÀI REACT →' })}
</div>
`,
};
