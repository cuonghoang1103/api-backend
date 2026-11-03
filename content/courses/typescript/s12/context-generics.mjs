/**
 * TypeScript · Chương 12 · 12.4 — Typed context & generic components. Slug giữ: typescript-12-4-context-generics.
 * Code/output từ ./_ma-ts-12-4.mjs (demo12/ts-12-4, Node 22.23.3 + tsc 7.0.2). Soạn lại TRỌN 04/11/2026. Mô hình react.ts tự-chứa.
 */
import G from '../giang/ts-12-4.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-12-4.mjs';

const KV_EN = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>createContext&lt;T | null&gt;(null)</code></span><span class="v"><code>useContext</code> returns <code>T | null</code>.</span></div>
  <div class="kv"><span class="k">read it unchecked</span><span class="v">TS18047 — handle the no-provider case.</span></div>
  <div class="kv"><span class="k">a guard hook</span><span class="v">Throw if null, return a non-null value to every caller.</span></div>
  <div class="kv"><span class="k">generic component</span><span class="v"><code>List&lt;T&gt;</code> infers <code>T</code> from its props.</span></div>
  <div class="kv"><span class="k">Chapter 6, in a UI</span><span class="v">One component, correctly typed for every element type.</span></div>
</div>`;
const KV_VI = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>createContext&lt;T | null&gt;(null)</code></span><span class="v"><code>useContext</code> trả về <code>T | null</code>.</span></div>
  <div class="kv"><span class="k">đọc chưa kiểm</span><span class="v">TS18047 — xử lý trường hợp không-provider.</span></div>
  <div class="kv"><span class="k">một hook gác</span><span class="v">Ném nếu null, trả về một giá trị không-null cho mọi chỗ gọi.</span></div>
  <div class="kv"><span class="k">component generic</span><span class="v"><code>List&lt;T&gt;</code> suy <code>T</code> từ props của nó.</span></div>
  <div class="kv"><span class="k">Chương 6, trong một UI</span><span class="v">Một component, có kiểu đúng cho mọi kiểu phần tử.</span></div>
</div>`;

export default {
  title: '12.4 — Typed context & generic components|||12.4 — Context có kiểu & component generic',
  slug: 'typescript-12-4-context-generics',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Hai pattern đưa generic của Chương 6 vào React. createContext<T | null>(null) làm useContext trả về T | null — đọc theme.color mà không kiểm là TS18047 "possibly null"; cách sửa là một hook gác ném lỗi nếu null rồi trả về một T không-null. Component generic: List<T> suy T từ items (truyền [1,2,3] ⇒ T = number, n.toFixed(0) hợp lệ). Có cảnh báo bẫy "default nghe hợp lý che provider thiếu". Đo thật tsc 7.0.2 + Node 22.23.3. Khép lại mạch frontend-có-kiểu.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.4</span>
<h2>Typed context &amp; generic components</h2>
<p class="lead">Two patterns put Chapter 6’s generics to work in React: a typed <code>Context</code> that forces consumers to handle the “no provider” case, and a generic component that adapts to whatever data you give it. Both are the generics and unions you already know, now wearing a UI.</p>

<h3>A typed context forces the null check</h3>
<p><code>createContext</code> is generic. Type it with the value union — including the <code>null</code> default used when a consumer sits outside any provider — and <code>useContext</code> returns that union:</p>
${ma('ts', CODE.contextDemo)}
${ra(OUT['11-context'])}
<p><strong>TS18047</strong> — <code>theme</code> is possibly <code>null</code>. A component reading a context it is not wrapped in is a real bug, now caught at compile time.</p>

<h3>The guard hook returns a non-null value</h3>
<p>The common fix is a small hook that reads the context, throws if it is <code>null</code>, and returns a non-null <code>Theme</code>:</p>
${ma('ts', CODE.contextOk)}
${ra(OUT['12-context-ok'])}
<p>After the <code>throw</code>, control-flow analysis gives every caller a plain <code>Theme</code> — no consumer writes the check. Export the hook, not the context, and there is no way to bypass the guard.</p>

<h3>A generic component adapts to its data</h3>
<p>Components take type parameters too. A <code>List&lt;T&gt;</code> renders any array and infers <code>T</code> from the items you pass, so the <code>render</code> callback is typed to match:</p>
${ma('ts', CODE.generic)}
${ra(OUT['13-generic'])}
<p>From <code>items: [1, 2, 3]</code> TypeScript infers <code>T = number</code>, so <code>n</code> inside <code>render</code> is a number and <code>n.toFixed(0)</code> is valid. Pass a <code>User[]</code> and <code>render</code> receives a <code>User</code> — one component, correctly typed for every element type, exactly like the generic functions of Chapter 6.</p>

<h3>At a glance</h3>
${KV_EN}

<h3>🧪 Practice</h3>
<p>A consumer reads <code>user.fullName</code> when <code>User</code> has only <code>name</code>:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['14-pr-start'])}
<p>Read <code>user.name</code> instead and it runs:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['15-pr-sol'])}

<h3>📌 Summary</h3>
<ul>
<li><code>createContext&lt;T | null&gt;(null)</code> makes <code>useContext</code> return <code>T | null</code>, forcing the no-provider case; reading it unchecked is TS18047.</li>
<li>A guard hook throws on <code>null</code> and returns a non-null value, so consumers never write the check.</li>
<li>A generic component (<code>List&lt;T&gt;</code>) infers <code>T</code> from its props — one component for every element type.</li>
<li>This closes the typed-frontend arc: props, hooks, events, context — each a generic or a union from earlier chapters.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'React — useContext', 'The context hook and its default value. Read 4 Nov 2026.', 'https://react.dev/reference/react/useContext')}
${nguon('📘', 'React TypeScript Cheatsheets — Context', 'Typing a context and the guard-hook pattern. Read 4 Nov 2026.', 'https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context/')}
${lienKet({ khoa: 'react', bai: 'rx-5-1-context', title: 'The context these types describe — React 5.1: Context', sub: 'Same: a context carries a value to any component below a provider. Different: there you build the provider and read it live; here the <em>type</em> carries the <code>| null</code> for “no provider”, so reading it unchecked is TS18047 and a guard hook turns that into one clear error.', cta: 'OPEN REACT LESSON →' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.4</span>
<h2>Context có kiểu &amp; component generic</h2>
<p class="lead">Hai pattern đưa generic của Chương 6 vào làm việc trong React: một <code>Context</code> có kiểu buộc bên tiêu thụ xử lý trường hợp “không provider”, và một component generic thích ứng với bất cứ dữ liệu nào bạn đưa vào. Cả hai là generic và union bạn đã biết, giờ khoác một UI.</p>

<h3>Một context có kiểu buộc phép kiểm null</h3>
<p><code>createContext</code> là generic. Gõ kiểu nó bằng union giá trị — gồm cả mặc định <code>null</code> dùng khi một bên tiêu thụ nằm ngoài mọi provider — và <code>useContext</code> trả về union đó:</p>
${ma('ts', CODE.contextDemo)}
${ra(OUT['11-context'])}
<p><strong>TS18047</strong> — <code>theme</code> có thể là <code>null</code>. Một component đọc một context nó không được bọc trong đó là một lỗi thật, giờ bị bắt lúc biên dịch.</p>

<h3>Hook gác trả về một giá trị không-null</h3>
<p>Cách sửa phổ biến là một hook nhỏ đọc context, ném nếu nó là <code>null</code>, và trả về một <code>Theme</code> không-null:</p>
${ma('ts', CODE.contextOk)}
${ra(OUT['12-context-ok'])}
<p>Sau <code>throw</code>, phân tích luồng điều khiển cho mọi chỗ gọi một <code>Theme</code> thuần — không bên tiêu thụ nào viết phép kiểm. Hãy xuất hook, đừng xuất context, và không có cách nào lách qua chốt chặn.</p>

<h3>Một component generic thích ứng với dữ liệu của nó</h3>
<p>Component cũng nhận tham số kiểu. Một <code>List&lt;T&gt;</code> render bất kỳ mảng nào và suy <code>T</code> từ các item bạn truyền, nên callback <code>render</code> được gõ kiểu khớp theo:</p>
${ma('ts', CODE.generic)}
${ra(OUT['13-generic'])}
<p>Từ <code>items: [1, 2, 3]</code> TypeScript suy <code>T = number</code>, nên <code>n</code> trong <code>render</code> là một number và <code>n.toFixed(0)</code> hợp lệ. Truyền một <code>User[]</code> và <code>render</code> nhận một <code>User</code> — một component, có kiểu đúng cho mọi kiểu phần tử, y như các hàm generic của Chương 6.</p>

<h3>Nhìn nhanh</h3>
${KV_VI}

<h3>🧪 Luyện tập</h3>
<p>Một bên tiêu thụ đọc <code>user.fullName</code> khi <code>User</code> chỉ có <code>name</code>:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['14-pr-start'])}
<p>Đọc <code>user.name</code> thay vào đó và nó chạy:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['15-pr-sol'])}

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>createContext&lt;T | null&gt;(null)</code> làm <code>useContext</code> trả về <code>T | null</code>, buộc trường hợp không-provider; đọc nó chưa kiểm là TS18047.</li>
<li>Một hook gác ném khi <code>null</code> và trả về một giá trị không-null, nên bên tiêu thụ không bao giờ viết phép kiểm.</li>
<li>Một component generic (<code>List&lt;T&gt;</code>) suy <code>T</code> từ props của nó — một component cho mọi kiểu phần tử.</li>
<li>Điều này khép lại mạch frontend-có-kiểu: props, hook, sự kiện, context — mỗi cái là một generic hay một union từ các chương trước.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'React — useContext', 'Hook context và giá trị mặc định của nó. Đọc ngày 4/11/2026.', 'https://react.dev/reference/react/useContext')}
${nguon('📘', 'React TypeScript Cheatsheets — Context', 'Gõ kiểu một context và pattern hook-gác. Đọc ngày 4/11/2026.', 'https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context/')}
${lienKet({ khoa: 'react', bai: 'rx-5-1-context', title: 'Context mà các kiểu này tả — React 5.1: Context', sub: 'Giống: một context mang một giá trị tới mọi component dưới một provider. Khác: ở đó bạn dựng provider và đọc nó sống; ở đây <em>kiểu</em> mang cái <code>| null</code> cho “không provider”, nên đọc nó chưa kiểm là TS18047 và một hook gác biến điều đó thành một lỗi rõ ràng.', cta: 'MỞ BÀI REACT →' })}
</div>
`,
};
