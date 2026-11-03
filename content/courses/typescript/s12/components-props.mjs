/**
 * TypeScript · Chương 12 · 12.1 — Components & props. Slug giữ: typescript-12-1-components-props.
 * BÀI MỞ CHƯƠNG 12 (soạn lại TRỌN 04/11/2026). Code/output từ ./_ma-ts-12-1.mjs (demo12/ts-12-1, Node 22.23.3 + tsc 7.0.2).
 * Mô hình React tự-chứa (react.ts) — cùng dáng @types/react cho, để mọi ví dụ chạy với @types/node (KHÔNG cài @types/react, KHÔNG JSX).
 */
import G from '../giang/ts-12-1.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-12-1.mjs';

const KV_EN = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>FC&lt;Props&gt;</code></span><span class="v">A function of a typed props object returning an element.</span></div>
  <div class="kv"><span class="k">typed props</span><span class="v"><code>props.code</code> is checked; an undeclared prop is TS2339.</span></div>
  <div class="kv"><span class="k">a required prop</span><span class="v">Calling without it is TS2741 — a compile error, not a blank spot.</span></div>
  <div class="kv"><span class="k"><code>children</code></span><span class="v">Just another prop, typed <code>ReactNode</code> — add it only when you render it.</span></div>
  <div class="kv"><span class="k">the real thing</span><span class="v"><code>@types/react</code> is this, with JSX and more props.</span></div>
</div>`;
const KV_VI = `<div class="kv-grid">
  <div class="kv"><span class="k"><code>FC&lt;Props&gt;</code></span><span class="v">Một hàm của một object props có kiểu trả về một element.</span></div>
  <div class="kv"><span class="k">props có kiểu</span><span class="v"><code>props.code</code> được kiểm; một prop không khai là TS2339.</span></div>
  <div class="kv"><span class="k">một prop bắt buộc</span><span class="v">Gọi mà thiếu nó là TS2741 — một lỗi biên dịch, không phải một khoảng trống.</span></div>
  <div class="kv"><span class="k"><code>children</code></span><span class="v">Chỉ là một prop khác, kiểu <code>ReactNode</code> — chỉ thêm khi bạn vẽ nó.</span></div>
  <div class="kv"><span class="k">cái thật</span><span class="v"><code>@types/react</code> là cái này, với JSX và nhiều prop hơn.</span></div>
</div>`;

export default {
  title: '12.1 — Components & props|||12.1 — Component & props',
  slug: 'typescript-12-1-components-props',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mở Chương 12: gõ kiểu một UI React. Một component là một hàm của props có kiểu, trả về một element (FC<Props>). Dùng mô hình kiểu nhỏ tự-chứa của bề mặt React (cùng dáng @types/react cho) để mọi ví dụ chạy với tsc + Node, không cần JSX. Props có kiểu ⇒ đọc một prop không khai là TS2339; gọi thiếu một prop bắt buộc là TS2741. children là một prop khác, kiểu ReactNode. Có cảnh báo về bẫy React.FC. Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.1</span>
<h2>Components &amp; props</h2>
<p class="lead">Chapter 11 typed a backend; now the same types cross to the frontend. A React component is a function that takes one argument — its <code>props</code> — and returns an element. We use a small typed model of the React surface — the same shape the real <code>@types/react</code> gives you — so every example runs with Node and tsc, no JSX required.</p>

<h3>After Chapter 12 you can…</h3>
<ul>
<li>Type a component’s props so JSX checks every attribute (this lesson).</li>
<li>Type hooks — <code>useState</code> infers the state and checks the setter (12.2).</li>
<li>Type DOM events so <code>e.target.value</code> is a checked string (12.3).</li>
<li>Type a context and a generic component (12.4), then write a typed form (Lab 12).</li>
</ul>

<h3>The model: an element and a component</h3>
<p>This is the shape <code>@types/react</code> gives you, written small so it runs here:</p>
${ma('ts', CODE.reactModel)}

<h3>A component is a function of typed props</h3>
<p>Declare a props type and read it; <code>props.code</code> and <code>props.seats</code> are typed exactly as you wrote them:</p>
${ma('ts', CODE.component)}
${ra(OUT['11-component'])}
<p>The component is just a function; the props type is what makes <code>props.code</code> a checked string and documents the component’s own API.</p>

<h3>The typed component refuses a wrong prop</h3>
<p>Read a prop that was not declared — <code>props.name</code> when the type has only <code>code</code> and <code>seats</code>:</p>
${ma('ts', CODE.wrongprop)}
${ra(OUT['12-wrongprop'])}
<p><strong>TS2339</strong>. A typo in a prop name stops being a run-time <code>undefined</code> and becomes a compile error, right where you read it.</p>

<h3>…and a missing one</h3>
<p>Call the component without a required prop — <code>seats</code> is missing:</p>
${ma('ts', CODE.missingprop)}
${ra(OUT['13-missingprop'])}
<p><strong>TS2741</strong>. The props type is a contract at every call site: you cannot render the component without giving it everything it declared it needs.</p>

<h3>A component, at a glance</h3>
${KV_EN}

<h3>🧪 Practice</h3>
<p>A <code>Button</code> reads <code>props.text</code> when the type declares only <code>label</code>:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['14-pr-start'])}
<p>Read <code>props.label</code> instead and it runs:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['15-pr-sol'])}

<h3>📌 Summary</h3>
<ul>
<li>A component is a function of its props — <code>FC&lt;Props&gt;</code>; type the props and every reader is checked.</li>
<li>Reading an undeclared prop is TS2339; calling without a required prop is TS2741.</li>
<li><code>children</code> is just another prop, typed <code>ReactNode</code> — add it only when the component renders it.</li>
<li>We use a self-contained model of the React surface; the real <code>@types/react</code> is the same shape, with JSX.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'React — Passing Props to a Component', 'What props are and how a component reads them. Read 4 Nov 2026.', 'https://react.dev/learn/passing-props-to-a-component')}
${nguon('📘', 'React TypeScript Cheatsheets — Function Components', 'How the real @types/react types a component’s props. Read 4 Nov 2026.', 'https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components/')}
${lienKet({ khoa: 'react', bai: 'rx-1-2-props', title: 'The props these types describe — React 1.2: Props', sub: 'Same: a component is a function that reads a props object. Different: there you pass and read props in real JSX at run time; here a props <em>type</em> checks every attribute, so a wrong prop is TS2339 and a missing one is TS2741 — before the component ever renders.', cta: 'OPEN REACT LESSON →' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.1</span>
<h2>Component &amp; props</h2>
<p class="lead">Chương 11 gõ kiểu một backend; giờ cùng các kiểu đó đi sang frontend. Một component React là một hàm nhận một đối số — <code>props</code> của nó — và trả về một element. Ta dùng một mô hình kiểu nhỏ của bề mặt React — đúng dáng mà <code>@types/react</code> thật cho bạn — để mọi ví dụ chạy được với Node và tsc, không cần JSX.</p>

<h3>Sau Chương 12 bạn có thể…</h3>
<ul>
<li>Gõ kiểu props của một component để JSX kiểm mọi thuộc tính (bài này).</li>
<li>Gõ kiểu hook — <code>useState</code> suy ra state và kiểm setter (12.2).</li>
<li>Gõ kiểu sự kiện DOM để <code>e.target.value</code> là một string được kiểm (12.3).</li>
<li>Gõ kiểu một context và một component generic (12.4), rồi viết một form có kiểu (Lab 12).</li>
</ul>

<h3>Mô hình: một element và một component</h3>
<p>Đây là dáng <code>@types/react</code> cho bạn, viết nhỏ để nó chạy ở đây:</p>
${ma('ts', CODE.reactModel)}

<h3>Một component là một hàm của props có kiểu</h3>
<p>Khai một kiểu props và đọc nó; <code>props.code</code> và <code>props.seats</code> có kiểu đúng như bạn viết:</p>
${ma('ts', CODE.component)}
${ra(OUT['11-component'])}
<p>Component chỉ là một hàm; kiểu props là thứ làm <code>props.code</code> thành một string được kiểm và tự ghi API của chính component.</p>

<h3>Component có kiểu từ chối một prop sai</h3>
<p>Đọc một prop không được khai — <code>props.name</code> khi kiểu chỉ có <code>code</code> và <code>seats</code>:</p>
${ma('ts', CODE.wrongprop)}
${ra(OUT['12-wrongprop'])}
<p><strong>TS2339</strong>. Một lỗi gõ tên prop thôi là một <code>undefined</code> lúc chạy mà thành một lỗi biên dịch, ngay chỗ bạn đọc.</p>

<h3>…và một prop thiếu</h3>
<p>Gọi component mà thiếu một prop bắt buộc — <code>seats</code> bị thiếu:</p>
${ma('ts', CODE.missingprop)}
${ra(OUT['13-missingprop'])}
<p><strong>TS2741</strong>. Kiểu props là một hợp đồng tại mọi chỗ gọi: bạn không vẽ được component mà không đưa cho nó mọi thứ nó đã khai là cần.</p>

<h3>Một component, nhìn nhanh</h3>
${KV_VI}

<h3>🧪 Luyện tập</h3>
<p>Một <code>Button</code> đọc <code>props.text</code> khi kiểu chỉ khai <code>label</code>:</p>
${ma('ts', CODE.prStart)}
${ra(OUT['14-pr-start'])}
<p>Đọc <code>props.label</code> thay vào đó và nó chạy:</p>
${ma('ts', CODE.prSol)}
${ra(OUT['15-pr-sol'])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một component là một hàm của props của nó — <code>FC&lt;Props&gt;</code>; gõ kiểu props và mọi chỗ đọc được kiểm.</li>
<li>Đọc một prop không khai là TS2339; gọi mà thiếu một prop bắt buộc là TS2741.</li>
<li><code>children</code> chỉ là một prop khác, kiểu <code>ReactNode</code> — chỉ thêm khi component vẽ nó.</li>
<li>Ta dùng một mô hình tự-chứa của bề mặt React; <code>@types/react</code> thật cùng dáng, có JSX.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'React — Passing Props to a Component', 'Props là gì và một component đọc chúng ra sao. Đọc ngày 4/11/2026.', 'https://react.dev/learn/passing-props-to-a-component')}
${nguon('📘', 'React TypeScript Cheatsheets — Function Components', 'Cách @types/react thật gõ kiểu props của một component. Đọc ngày 4/11/2026.', 'https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components/')}
${lienKet({ khoa: 'react', bai: 'rx-1-2-props', title: 'Props mà các kiểu này tả — React 1.2: Props', sub: 'Giống: một component là một hàm đọc một object props. Khác: ở đó bạn truyền và đọc props trong JSX thật lúc chạy; ở đây một <em>kiểu</em> props kiểm mọi thuộc tính, nên một prop sai là TS2339 và một prop thiếu là TS2741 — trước khi component vẽ ra.', cta: 'MỞ BÀI REACT →' })}
</div>
`,
};
