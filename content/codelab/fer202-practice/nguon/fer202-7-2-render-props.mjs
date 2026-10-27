/**
 * FER202 · 7.2 — Reusable components: children & render props (bài luyện React; có HOC cho câu hỏi FE).
 */
import { doiDau, KHOA, reactNho } from './_chung.mjs';

const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });

export default doiDau({
  slug: 'fer202-7-2-render-props',
  ten: '7.2 Reusable components: children & render props',
  khoa: KHOA,
  baiHoc: 'fer202-7-2-render-props',
  de: [
    reactNho({
      tieuDe: 'Slots: a Card with header and footer props',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['children', 'named slots', 'JSX as props'], the: ['composition'],
      moTa: {
        en: '<p>Beyond <code>children</code>, any prop can hold JSX — "named slots". Build <code>Card({ header, footer, children })</code> where header and footer are optional.</p>',
        vi: '<p>Ngoài <code>children</code>, prop nào cũng có thể chứa JSX — "khe có tên". Dựng <code>Card({ header, footer, children })</code> với header và footer tuỳ chọn.</p>',
      },
      yeuCau: [
        { en: '<code>article.card</code> → <code>header.card-header</code> (if any), <code>div.card-content</code> (children), <code>footer.card-footer</code> (if any).', vi: '<code>article.card</code> → <code>header.card-header</code> (nếu có), <code>div.card-content</code> (children), <code>footer.card-footer</code> (nếu có).' },
      ],
      viDu: [{ input: '<Card header={<h3>Plan</h3>} footer={<button>Buy</button>}>…</Card>', output: 'header · content · footer', explanation: 'The Card decides WHERE, the caller decides WHAT.|||Card quyết định Ở ĐÂU, nơi dùng quyết định CÁI GÌ.' }],
      goiY: ['{header && <header className="card-header">{header}</header>}', 'Tương tự cho footer; children luôn nằm giữa.'],
      loiHayGap: ['Luôn vẽ header/footer rỗng ⇒ thừa khung.', 'Truyền chuỗi HTML cho header rồi dùng dangerouslySetInnerHTML.'],
      thuatNgu: [{ en: 'slot', vi: 'khe chứa nội dung do nơi dùng truyền vào' }],
      giaiThich: '<p>Prop nhận JSX giúp component bố cục (Card, Layout, Modal) linh hoạt mà không cần biết nội dung. <code>children</code> chỉ là khe mặc định.</p>',
      dau: `// src/App.js — STARTER
function Card({ children }) {
  return <article className="card"><div className="card-content">{children}</div></article>;
}

export default function App() {
  return (
    <div>
      <Card header={<h3>Pro plan</h3>} footer={<button id="buy">Buy</button>}><p>Unlimited projects</p></Card>
      <Card><p id="plain">Just content</p></Card>
    </div>
  );
}
`,
      giai: `// src/App.js — header/footer là "khe có tên" nhận JSX; children là khe mặc định
function Card({ header, footer, children }) {
  return (
    <article className="card">
      {header && <header className="card-header">{header}</header>}
      <div className="card-content">{children}</div>
      {footer && <footer className="card-footer">{footer}</footer>}
    </article>
  );
}

export default function App() {
  return (
    <div>
      <Card header={<h3>Pro plan</h3>} footer={<button id="buy" type="button">Buy</button>}><p>Unlimited projects</p></Card>
      <Card><p id="plain">Just content</p></Card>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'First card has header, content, footer in order', kiem: 'ton-tai', selector: '.card:first-child > header.card-header + div.card-content + footer.card-footer #buy' },
        { moTa: 'Second card has only content', kiem: 'so-luong', selector: '.card:nth-child(2) > *', giaTri: 1 },
        { moTa: 'Header text', kiem: 'text', selector: '.card-header', giaTri: 'Pro plan' },
      ],
    }),
    reactNho({
      tieuDe: 'Render prop: one counter logic, two looks',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['render prop', 'logic reuse', 'inversion of control'], the: ['render-props'],
      moTa: {
        en: '<p><code>Counter</code> owns the counting logic (min 0, max <code>max</code>) and calls <code>render({ count, inc, dec })</code>. Use it twice with completely different UIs: plain buttons and a star rating.</p>',
        vi: '<p><code>Counter</code> giữ logic đếm (nhỏ nhất 0, lớn nhất <code>max</code>) và gọi <code>render({ count, inc, dec })</code>. Dùng nó hai lần với giao diện khác hẳn: nút bấm thường và đánh giá sao.</p>',
      },
      yeuCau: [
        { en: '<code>#qty</code> UI: <code>#qty-dec</code>, <code>#qty-value</code>, <code>#qty-inc</code> (max 10).', vi: 'Giao diện <code>#qty</code>: <code>#qty-dec</code>, <code>#qty-value</code>, <code>#qty-inc</code> (tối đa 10).' },
        { en: '<code>#stars</code> UI: 5 stars text (★ for ≤ count) + <code>#stars-up</code> button (max 5).', vi: 'Giao diện <code>#stars</code>: chuỗi 5 sao (★ cho ≤ count) + nút <code>#stars-up</code> (tối đa 5).' },
      ],
      viDu: [{ input: '<Counter max={5} render={({ count, inc }) => …} />', output: 'the caller draws, Counter counts', explanation: 'Counter never decides the markup.|||Counter không bao giờ quyết định markup.' }],
      goiY: ['function Counter({ max, render }) { const [count, setCount] = useState(0); const inc = () => setCount(c => Math.min(max, c + 1)); … return render({ count, inc, dec }); }', 'Sao: "★".repeat(count) + "☆".repeat(5 - count).'],
      loiHayGap: ['Gọi <code>render</code> như component (<code>&lt;render /&gt;</code>) — nó là hàm, cứ gọi.', 'Copy logic đếm vào hai component ⇒ sửa giới hạn phải sửa hai nơi.'],
      thuatNgu: [{ en: 'render prop', vi: 'prop là hàm trả về JSX' }, { en: 'inversion of control', vi: 'đảo quyền điều khiển: nơi dùng quyết định cách vẽ' }],
      giaiThich: '<p>Render prop tách "logic" khỏi "giao diện": Counter lo state và luật, nơi dùng nhận dữ liệu + hàm để tự vẽ. Ngày nay nhiều trường hợp dùng custom hook gọn hơn, nhưng mẫu này vẫn gặp trong thư viện (Formik, React Router cũ) và trong đề FE.</p>',
      dau: `// src/App.js — STARTER: logic đếm bị chép hai lần
import { useState } from 'react';

function QuantityPicker() {
  const [count, setCount] = useState(0);
  return <div id="qty"><button id="qty-dec" onClick={() => setCount(count - 1)}>−</button><span id="qty-value">{count}</span><button id="qty-inc" onClick={() => setCount(count + 1)}>+</button></div>;
}

export default function App() {
  return <QuantityPicker />;
}
`,
      giai: `// src/App.js — Counter giữ logic; render prop để nơi dùng tự quyết định giao diện
import { useState } from 'react';

function Counter({ max, render }) {
  const [count, setCount] = useState(0);
  const inc = () => setCount((c) => Math.min(max, c + 1));
  const dec = () => setCount((c) => Math.max(0, c - 1));
  return render({ count, inc, dec });
}

export default function App() {
  return (
    <div>
      <Counter
        max={10}
        render={({ count, inc, dec }) => (
          <div id="qty">
            <button id="qty-dec" type="button" onClick={dec}>−</button>
            <span id="qty-value">{count}</span>
            <button id="qty-inc" type="button" onClick={inc}>+</button>
          </div>
        )}
      />
      <Counter
        max={5}
        render={({ count, inc }) => (
          <div id="stars">
            <span id="stars-text">{'★'.repeat(count) + '☆'.repeat(5 - count)}</span>
            <button id="stars-up" type="button" onClick={inc}>Rate up</button>
          </div>
        )}
      />
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Quantity UI counts', kiem: 'text', selector: '#qty-value', giaTri: '2', truoc: [click('#qty-inc', 3), click('#qty-dec')] },
        { moTa: 'Star UI shares the logic (max 5)', kiem: 'text', selector: '#stars-text', giaTri: '★★★★★', truoc: [click('#stars-up', 7)] },
        { moTa: 'Never below 0', kiem: 'text', selector: '#qty-value', giaTri: '0', truoc: [click('#qty-dec', 2)] },
        { an: true, moTa: 'Counter calls a render prop', kiem: 'ma-nguon', khop: 'return\\s+render\\(\\s*\\{' },
      ],
    }),
    reactNho({
      tieuDe: 'children as a function: an accessible Disclosure',
      doKho: 'MEDIUM', phut: 10,
      khaiNiem: ['function as children', 'aria-expanded', 'state ownership'], the: ['render-props', 'a11y'],
      moTa: {
        en: '<p><code>Disclosure</code> owns <code>open</code> state and calls <code>children({ open, toggle, buttonProps })</code>. <code>buttonProps</code> already contains <code>onClick</code> and the correct <code>aria-expanded</code>, so every usage is accessible for free.</p>',
        vi: '<p><code>Disclosure</code> giữ state <code>open</code> và gọi <code>children({ open, toggle, buttonProps })</code>. <code>buttonProps</code> có sẵn <code>onClick</code> và <code>aria-expanded</code> đúng, nên mọi nơi dùng đều tự động dễ tiếp cận.</p>',
      },
      yeuCau: [
        { en: 'Three FAQ items in <code>#faq</code>; each uses <code>&lt;Disclosure&gt;{({ open, buttonProps }) =&gt; …}&lt;/Disclosure&gt;</code> with <code>button.q {...buttonProps}</code> and <code>p.a</code> when open.', vi: 'Ba mục FAQ trong <code>#faq</code>; mỗi mục dùng <code>&lt;Disclosure&gt;{({ open, buttonProps }) =&gt; …}&lt;/Disclosure&gt;</code> với <code>button.q {...buttonProps}</code> và <code>p.a</code> khi mở.' },
      ],
      viDu: [{ input: 'click a question', output: 'aria-expanded="true" and its answer visible', explanation: 'The component hands out ready-made props (a "prop getter").|||Component phát sẵn props cho nút (mẫu "prop getter").' }],
      goiY: ["const buttonProps = { type: 'button', 'aria-expanded': open, onClick: toggle };", 'return children({ open, toggle, buttonProps });'],
      loiHayGap: ['Quên <code>aria-expanded</code> ⇒ trình đọc màn hình không biết mục đang mở.', 'Render <code>{children}</code> thay vì gọi <code>children(...)</code>.'],
      thuatNgu: [{ en: 'disclosure', vi: 'khối mở/đóng nội dung' }, { en: 'prop getter', vi: 'đối tượng props dựng sẵn cho phần tử' }],
      giaiThich: '<p>Children-là-hàm giống render prop nhưng đặt hàm ở vị trí children. Gói sẵn <code>buttonProps</code> giúp mọi nơi dùng đúng chuẩn truy cập mà không cần nhớ thuộc tính ARIA.</p>',
      dau: `// src/App.js — STARTER
const FAQ = [
  { q: 'Is the PE open book?', a: 'Yes, but no internet.' },
  { q: 'How long is the PE?', a: '85 minutes.' },
  { q: 'Can I use React-Bootstrap?', a: 'Yes, or plain Bootstrap.' },
];

export default function App() {
  return <div id="faq">{FAQ.map((f) => <div key={f.q}><button className="q">{f.q}</button><p className="a">{f.a}</p></div>)}</div>;
}
`,
      giai: `// src/App.js — Disclosure giữ state, phát { open, toggle, buttonProps } cho children-hàm
import { useState } from 'react';

const FAQ = [
  { q: 'Is the PE open book?', a: 'Yes, but no internet.' },
  { q: 'How long is the PE?', a: '85 minutes.' },
  { q: 'Can I use React-Bootstrap?', a: 'Yes, or plain Bootstrap.' },
];

function Disclosure({ children }) {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((o) => !o);
  const buttonProps = { type: 'button', 'aria-expanded': open, onClick: toggle };
  return children({ open, toggle, buttonProps });
}

export default function App() {
  return (
    <div id="faq">
      {FAQ.map((f) => (
        <Disclosure key={f.q}>
          {({ open, buttonProps }) => (
            <div className="item">
              <button className="q" {...buttonProps}>{f.q}</button>
              {open && <p className="a">{f.a}</p>}
            </div>
          )}
        </Disclosure>
      ))}
    </div>
  );
}
`,
      kiem: [
        { moTa: 'All answers hidden at start', kiem: 'so-luong', selector: '.a', giaTri: 0 },
        { moTa: 'Click shows only that answer', kiem: 'danh-sach-text', selector: '.a', mongDoi: ['85 minutes.'], truoc: [click('.item:nth-child(2) .q')] },
        { moTa: 'aria-expanded reflects the state', kiem: 'thuoc-tinh', selector: '.item:nth-child(2) .q', thuocTinh: 'aria-expanded', giaTri: 'true', truoc: [click('.item:nth-child(2) .q')] },
        { an: true, moTa: 'Closed questions have aria-expanded="false"', kiem: 'thuoc-tinh', selector: '.item:first-child .q', thuocTinh: 'aria-expanded', giaTri: 'false' },
      ],
    }),
    reactNho({
      tieuDe: 'Higher-order component: withLoading',
      doKho: 'HARD', phut: 15,
      khaiNiem: ['HOC', 'props forwarding', 'displayName'], the: ['hoc', 'composition'],
      moTa: {
        en: '<p>A higher-order component is a function that takes a component and returns a new one. Write <code>withLoading(Component)</code>: while <code>isLoading</code> is true it shows a spinner text; otherwise it renders the wrapped component with all other props.</p>',
        vi: '<p>Higher-order component là hàm nhận một component và trả về component mới. Viết <code>withLoading(Component)</code>: khi <code>isLoading</code> là true thì hiện chữ đang tải; ngược lại vẽ component được bọc với mọi prop còn lại.</p>',
      },
      yeuCau: [
        { en: '<code>withLoading(Component)</code> returns <code>WithLoading({ isLoading, ...rest })</code>; loading ⇒ <code>p.loading</code> "Loading…"; else <code>&lt;Component {...rest} /&gt;</code> (do NOT pass <code>isLoading</code> down).', vi: '<code>withLoading(Component)</code> trả về <code>WithLoading({ isLoading, ...rest })</code>; đang tải ⇒ <code>p.loading</code> "Loading…"; ngược lại <code>&lt;Component {...rest} /&gt;</code> (KHÔNG truyền <code>isLoading</code> xuống).' },
        { en: 'Set <code>displayName</code> to <code>withLoading(UserList)</code>. App toggles loading with <code>#btn-load</code>.', vi: 'Đặt <code>displayName</code> là <code>withLoading(UserList)</code>. App đổi trạng thái tải bằng <code>#btn-load</code>.' },
      ],
      viDu: [{ input: 'const UserListWithLoading = withLoading(UserList)', output: '<UserListWithLoading isLoading={true} users={…} />  ⇒  Loading…', explanation: 'The HOC adds behaviour without touching UserList.|||HOC thêm hành vi mà không sửa UserList.' }],
      goiY: ['function withLoading(Component) { function WithLoading({ isLoading, ...rest }) { … } WithLoading.displayName = ´withLoading(@{Component.displayName || Component.name})´; return WithLoading; }', 'Gọi withLoading Ở CẤP MODULE, không gọi trong thân component.'],
      loiHayGap: ['Gọi <code>withLoading(UserList)</code> bên trong render ⇒ mỗi lần render một component mới ⇒ mất state, nháy.', 'Không spread <code>...rest</code> ⇒ component bọc mất props.'],
      thuatNgu: [{ en: 'higher-order component (HOC)', vi: 'hàm nhận component, trả component mới có thêm hành vi' }, { en: 'cross-cutting concern', vi: 'mối quan tâm dùng chung nhiều nơi (tải, quyền…)' }],
      giaiThich: '<p>HOC là mẫu cũ hơn hooks/render props để dùng lại hành vi (vd <code>connect</code> của react-redux, <code>withRouter</code>). Ngày nay thường thay bằng custom hook, nhưng FE hay hỏi khái niệm này.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';

function UserList({ users }) {
  return <ul id="users">{users.map((u) => <li key={u}>{u}</li>)}</ul>;
}

// TODO: function withLoading(Component) { … }

export default function App() {
  const [loading, setLoading] = useState(true);
  return (
    <div>
      <button id="btn-load" onClick={() => setLoading(!loading)}>Toggle loading</button>
      <UserList users={['An', 'Binh', 'Cuong']} />
    </div>
  );
}
`,
      giai: `// src/App.js — HOC: nhận component, trả component mới có thêm hành vi "đang tải"
import { useState } from 'react';

function UserList({ users }) {
  return <ul id="users">{users.map((u) => <li key={u}>{u}</li>)}</ul>;
}

function withLoading(Component) {
  function WithLoading({ isLoading, ...rest }) {
    if (isLoading) return <p className="loading">Loading…</p>;
    return <Component {...rest} />; // isLoading không bị truyền xuống
  }
  WithLoading.displayName = ´withLoading(@{Component.displayName || Component.name})´;
  return WithLoading;
}

// gọi HOC ở CẤP MODULE (một lần), không phải trong render
const UserListWithLoading = withLoading(UserList);

export default function App() {
  const [loading, setLoading] = useState(true);
  return (
    <div>
      <button id="btn-load" type="button" onClick={() => setLoading((l) => !l)}>Toggle loading</button>
      <UserListWithLoading isLoading={loading} users={['An', 'Binh', 'Cuong']} />
      <p id="display-name">{UserListWithLoading.displayName}</p>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Loading at first', kiem: 'text', selector: '.loading', giaTri: 'Loading…' },
        { moTa: 'After toggling, the wrapped list renders with its props', kiem: 'danh-sach-text', selector: '#users li', mongDoi: ['An', 'Binh', 'Cuong'], truoc: [click('#btn-load')] },
        { moTa: 'displayName', kiem: 'text', selector: '#display-name', giaTri: 'withLoading(UserList)' },
        { an: true, moTa: 'HOC created at module level', kiem: 'ma-nguon', khop: '(^|\\n)const\\s+\\w+\\s*=\\s*withLoading\\(' },
      ],
    }),
  ],
});
