/**
 * FER202 · 5.1 — Components & props (bài luyện React).
 * Dễ → khó: component đầu tiên → destructuring + mặc định → children → hàm qua props → tách component lớn.
 */
import { doiDau, KHOA, reactNho } from './_chung.mjs';

const click = (selector) => ({ hanhDong: 'click', selector });

export default doiDau({
  slug: 'fer202-5-1-components-props',
  ten: '5.1 Components & props',
  khoa: KHOA,
  baiHoc: 'fer202-5-1-components-props',
  de: [
    reactNho({
      tieuDe: 'Your first component with props',
      doKho: 'EASY', phut: 6,
      khaiNiem: ['function component', 'props', 'reuse'], the: ['components', 'props'],
      moTa: {
        en: '<p>A component is a function that returns JSX; props are its arguments. Write <code>Welcome</code> and reuse it three times with different names.</p>',
        vi: '<p>Component là hàm trả về JSX; props là tham số của nó. Viết <code>Welcome</code> và dùng lại ba lần với ba tên khác nhau.</p>',
      },
      yeuCau: [
        { en: '<code>Welcome</code> renders <code>&lt;h2 className="welcome"&gt;Welcome, {name}!&lt;/h2&gt;</code>.', vi: '<code>Welcome</code> vẽ <code>&lt;h2 className="welcome"&gt;Welcome, {name}!&lt;/h2&gt;</code>.' },
        { en: '<code>App</code> renders <code>Welcome</code> for An, Binh and Cuong. Component names start with a capital letter.', vi: '<code>App</code> vẽ <code>Welcome</code> cho An, Binh và Cuong. Tên component viết hoa chữ đầu.' },
      ],
      viDu: [{ input: '<Welcome name="An" />', output: '<h2 class="welcome">Welcome, An!</h2>', explanation: 'Props arrive as one object: { name: "An" }.|||Props đến dưới dạng một object: { name: "An" }.' }],
      goiY: ['function Welcome(props) { return <h2 className="welcome">Welcome, {props.name}!</h2>; }', 'Dùng: <Welcome name="An" /> — thuộc tính JSX thành props.'],
      loiHayGap: ['Đặt tên <code>welcome</code> (chữ thường) ⇒ React coi là thẻ HTML lạ <code>&lt;welcome&gt;</code>.', 'Gọi như hàm <code>{Welcome("An")}</code> thay vì dùng thẻ JSX.'],
      thuatNgu: [{ en: 'reusable', vi: 'tái sử dụng được' }],
      giaiThich: '<p>JSX viết hoa (<code>&lt;Welcome /&gt;</code>) là component; React gọi hàm đó với object props. Một component — nhiều chỗ dùng — mỗi chỗ một bộ props.</p>',
      dau: `// src/App.js — STARTER: chữ lặp lại ba lần
export default function App() {
  return (
    <div>
      <h2>Welcome, An!</h2>
      <h2>Welcome, Binh!</h2>
      <h2>Welcome, Cuong!</h2>
    </div>
  );
}
`,
      giai: `// src/App.js — một component, ba lần dùng với props khác nhau
function Welcome({ name }) {
  return <h2 className="welcome">Welcome, {name}!</h2>;
}

export default function App() {
  return (
    <div>
      <Welcome name="An" />
      <Welcome name="Binh" />
      <Welcome name="Cuong" />
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Three .welcome headings', kiem: 'danh-sach-text', selector: '.welcome', mongDoi: ['Welcome, An!', 'Welcome, Binh!', 'Welcome, Cuong!'] },
        { moTa: 'A Welcome component is defined and used', kiem: 'ma-nguon', khop: 'function\\s+Welcome\\s*\\([\\s\\S]*<Welcome\\s+name=' },
        { an: true, moTa: 'The text is not hard-coded three times', kiem: 'ma-nguon', khop: 'Welcome, (An|Binh|Cuong)!', phuDinh: true },
      ],
    }),
    reactNho({
      tieuDe: 'Destructured props with default values',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['destructuring props', 'default props', 'className composition'], the: ['components', 'props'],
      moTa: {
        en: '<p><code>Tag</code> shows a coloured label. Destructure the props in the parameter list and give <code>color</code> a default of <code>\'gray\'</code> and <code>size</code> a default of <code>\'md\'</code>.</p>',
        vi: '<p><code>Tag</code> hiện một nhãn màu. Destructuring props ngay ở tham số, cho <code>color</code> mặc định <code>\'gray\'</code> và <code>size</code> mặc định <code>\'md\'</code>.</p>',
      },
      yeuCau: [
        { en: 'Render <code>&lt;span className="tag tag-{color} tag-{size}"&gt;{label}&lt;/span&gt;</code>.', vi: 'Vẽ <code>&lt;span className="tag tag-{color} tag-{size}"&gt;{label}&lt;/span&gt;</code>.' },
        { en: 'App (given) renders <code>React</code> (blue, lg), <code>Draft</code> (no color/size) and <code>Urgent</code> (red).', vi: 'App (đã cho) vẽ <code>React</code> (blue, lg), <code>Draft</code> (không color/size) và <code>Urgent</code> (red).' },
      ],
      viDu: [{ input: '<Tag label="Draft" />', output: '<span class="tag tag-gray tag-md">Draft</span>', explanation: 'Defaults apply when the prop is not passed.|||Giá trị mặc định áp khi không truyền prop.' }],
      goiY: ["function Tag({ label, color = 'gray', size = 'md' }) { … }", 'className={´tag tag-@{color} tag-@{size}´}'],
      loiHayGap: ['<code>Tag.defaultProps</code> trên function component — đã bị khuyến cáo bỏ (React 19 bỏ hẳn); dùng giá trị mặc định của tham số.', 'Viết <code>className="tag tag-{color}"</code> (chuỗi thường) ⇒ ra đúng chữ {color}.'],
      thuatNgu: [{ en: 'default value', vi: 'giá trị mặc định' }],
      giaiThich: '<p>Destructuring ở tham số cho biết ngay component nhận những prop nào; giá trị mặc định thay thế <code>defaultProps</code> cho function component.</p>',
      dau: `// src/App.js — STARTER
function Tag(props) {
  return <span className="tag">{props.label}</span>;
}

export default function App() {
  return (
    <div>
      <Tag label="React" color="blue" size="lg" />
      <Tag label="Draft" />
      <Tag label="Urgent" color="red" />
    </div>
  );
}
`,
      giai: `// src/App.js — destructuring + giá trị mặc định ngay ở tham số
function Tag({ label, color = 'gray', size = 'md' }) {
  return <span className={´tag tag-@{color} tag-@{size}´}>{label}</span>;
}

export default function App() {
  return (
    <div>
      <Tag label="React" color="blue" size="lg" />
      <Tag label="Draft" />
      <Tag label="Urgent" color="red" />
    </div>
  );
}
`,
      kiem: [
        { moTa: 'React tag is blue and large', kiem: 'text', selector: '.tag.tag-blue.tag-lg', giaTri: 'React' },
        { moTa: 'Draft uses both defaults', kiem: 'text', selector: '.tag.tag-gray.tag-md', giaTri: 'Draft' },
        { moTa: 'Urgent is red, default size', kiem: 'text', selector: '.tag.tag-red.tag-md', giaTri: 'Urgent' },
        { an: true, moTa: 'No defaultProps', kiem: 'ma-nguon', khop: 'defaultProps', phuDinh: true },
      ],
    }),
    reactNho({
      tieuDe: 'children: a reusable Panel',
      doKho: 'MEDIUM', phut: 10,
      khaiNiem: ['props.children', 'optional props', 'composition'], the: ['components', 'children'],
      moTa: {
        en: '<p>Everything between <code>&lt;Panel&gt;</code> and <code>&lt;/Panel&gt;</code> arrives as <code>props.children</code>. Build a <code>Panel</code> with a title, any content, and an optional footer prop.</p>',
        vi: '<p>Mọi thứ giữa <code>&lt;Panel&gt;</code> và <code>&lt;/Panel&gt;</code> đến dưới dạng <code>props.children</code>. Dựng <code>Panel</code> có tiêu đề, nội dung bất kỳ và prop footer tuỳ chọn.</p>',
      },
      yeuCau: [
        { en: '<code>section.panel</code> → <code>h3.panel-title</code>, <code>div.panel-body</code> (children), and <code>div.panel-footer</code> ONLY when <code>footer</code> is passed.', vi: '<code>section.panel</code> → <code>h3.panel-title</code>, <code>div.panel-body</code> (children), và <code>div.panel-footer</code> CHỈ khi có prop <code>footer</code>.' },
        { en: 'App (given) uses one Panel with a list and a footer button, and one without a footer.', vi: 'App (đã cho) dùng một Panel có danh sách + nút ở footer, và một Panel không có footer.' },
      ],
      viDu: [{ input: '<Panel title="News"><p>Hi</p></Panel>', output: '<section class="panel"><h3 class="panel-title">News</h3><div class="panel-body"><p>Hi</p></div></section>', explanation: 'No footer prop ⇒ no footer element.|||Không có prop footer ⇒ không có phần footer.' }],
      goiY: ['function Panel({ title, children, footer }) { … }', '{footer && <div className="panel-footer">{footer}</div>} — footer cũng có thể là JSX.'],
      loiHayGap: ['Quên vẽ <code>{children}</code> ⇒ nội dung bên trong biến mất.', 'Luôn vẽ <code>div.panel-footer</code> rỗng ⇒ thừa đường viền.'],
      thuatNgu: [{ en: 'children', vi: 'nội dung lồng bên trong thẻ component' }, { en: 'composition', vi: 'ghép component lồng nhau' }],
      giaiThich: '<p><code>children</code> biến component thành "khung" dùng lại được: Panel không cần biết bên trong là gì. Prop cũng nhận JSX (như <code>footer</code>), nên có thể có nhiều "khe" nội dung.</p>',
      dau: `// src/App.js — STARTER
function Panel({ title }) {
  return (
    <section className="panel">
      <h3 className="panel-title">{title}</h3>
    </section>
  );
}

export default function App() {
  return (
    <div>
      <Panel title="Tasks" footer={<button id="btn-add">Add task</button>}>
        <ul><li>Read chapter 5</li><li>Do Exercise 9</li></ul>
      </Panel>
      <Panel title="Notes">
        <p id="note">Props are read-only.</p>
      </Panel>
    </div>
  );
}
`,
      giai: `// src/App.js — children = phần lồng bên trong; footer là "khe" tuỳ chọn nhận JSX
function Panel({ title, children, footer }) {
  return (
    <section className="panel">
      <h3 className="panel-title">{title}</h3>
      <div className="panel-body">{children}</div>
      {footer && <div className="panel-footer">{footer}</div>}
    </section>
  );
}

export default function App() {
  return (
    <div>
      <Panel title="Tasks" footer={<button id="btn-add">Add task</button>}>
        <ul><li>Read chapter 5</li><li>Do Exercise 9</li></ul>
      </Panel>
      <Panel title="Notes">
        <p id="note">Props are read-only.</p>
      </Panel>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Children rendered inside .panel-body', kiem: 'so-luong', selector: '.panel-body li, .panel-body #note', giaTri: 3 },
        { moTa: 'Footer only on the first panel', kiem: 'so-luong', selector: '.panel-footer', giaTri: 1 },
        { moTa: 'Footer contains the button', kiem: 'ton-tai', selector: '.panel:first-child .panel-footer #btn-add' },
      ],
    }),
    reactNho({
      tieuDe: 'Callbacks: a child reports to its parent',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['callback props', 'one-way data flow', 'useState'], the: ['components', 'props', 'events'],
      moTa: {
        en: '<p>Data flows down, events flow up. <code>RatingStars</code> shows 5 star buttons; clicking one calls <code>onRate(n)</code>. The parent <code>App</code> owns the rating in state and shows a message.</p>',
        vi: '<p>Dữ liệu đi xuống, sự kiện đi lên. <code>RatingStars</code> có 5 nút sao; bấm một nút gọi <code>onRate(n)</code>. <code>App</code> (cha) giữ điểm trong state và hiện thông báo.</p>',
      },
      yeuCau: [
        { en: '<code>RatingStars({ value, onRate })</code>: 5 <code>button.star</code>; stars ≤ value have class <code>on</code> and show ★, others ☆.', vi: '<code>RatingStars({ value, onRate })</code>: 5 <code>button.star</code>; sao ≤ value có class <code>on</code> và hiện ★, còn lại ☆.' },
        { en: 'App: <code>#result</code> "No rating yet" → "You rated 4/5".', vi: 'App: <code>#result</code> "No rating yet" → "You rated 4/5".' },
      ],
      viDu: [{ input: 'click the 4th star', output: '★★★★☆ · You rated 4/5', explanation: 'The child never changes its own value — it asks the parent via onRate.|||Con không tự đổi value — nó nhờ cha qua onRate.' }],
      goiY: ['[1, 2, 3, 4, 5].map((n) => <button key={n} className={n <= value ? "star on" : "star"} onClick={() => onRate(n)}>…</button>)', 'App: const [rating, setRating] = useState(0); <RatingStars value={rating} onRate={setRating} />'],
      loiHayGap: ['Con tự <code>useState</code> riêng ⇒ cha không biết điểm, thông báo không cập nhật.', '<code>onClick={onRate(n)}</code> ⇒ gọi ngay lúc render (vòng lặp render vô hạn).'],
      thuatNgu: [{ en: 'callback prop', vi: 'prop là hàm để con gọi báo lên cha' }, { en: 'one-way data flow', vi: 'dữ liệu chảy một chiều từ cha xuống con' }],
      giaiThich: '<p>Props chỉ đọc; con muốn thay đổi thì gọi hàm cha truyền xuống. Cha đổi state ⇒ vẽ lại ⇒ con nhận <code>value</code> mới. Đây là "nâng state lên" ở dạng nhỏ nhất.</p>',
      dau: `// src/App.js — STARTER
function RatingStars({ value }) {
  return <div>{[1, 2, 3, 4, 5].map((n) => <button key={n} className="star">☆</button>)}</div>;
}

export default function App() {
  return (
    <div>
      <RatingStars value={0} />
      <p id="result">No rating yet</p>
    </div>
  );
}
`,
      giai: `// src/App.js — cha giữ state; con báo lên bằng callback onRate
import { useState } from 'react';

function RatingStars({ value, onRate }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" className={n <= value ? 'star on' : 'star'} onClick={() => onRate(n)} aria-label={´@{n} stars´}>
          {n <= value ? '★' : '☆'}
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const [rating, setRating] = useState(0);
  return (
    <div>
      <RatingStars value={rating} onRate={setRating} />
      <p id="result">{rating ? ´You rated @{rating}/5´ : 'No rating yet'}</p>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Initial message', kiem: 'text', selector: '#result', giaTri: 'No rating yet' },
        { moTa: 'Clicking star 4 rates 4', kiem: 'danh-sach-text', selector: '.star', mongDoi: ['★', '★', '★', '★', '☆'], truoc: [click('.star:nth-child(4)')] },
        { moTa: 'Parent shows the rating', kiem: 'text', selector: '#result', giaTri: 'You rated 4/5', truoc: [click('.star:nth-child(4)')] },
        { an: true, moTa: 'Re-rating lower works', kiem: 'so-luong', selector: '.star.on', giaTri: 2, truoc: [click('.star:nth-child(5)'), click('.star:nth-child(2)')] },
      ],
    }),
    reactNho({
      tieuDe: 'Split a big component into small ones',
      doKho: 'HARD', phut: 15,
      khaiNiem: ['component extraction', 'single responsibility', 'props design'], the: ['components', 'refactor'],
      moTa: {
        en: '<p>The starter is one 40-line <code>ProductPage</code>. Refactor it into four components with clear props — <code>ProductImage</code>, <code>ProductInfo</code>, <code>PriceTag</code>, <code>StockBadge</code> — without changing what the page shows.</p>',
        vi: '<p>Starter là một <code>ProductPage</code> dài 40 dòng. Tách thành bốn component với props rõ ràng — <code>ProductImage</code>, <code>ProductInfo</code>, <code>PriceTag</code>, <code>StockBadge</code> — mà không đổi những gì trang hiển thị.</p>',
      },
      yeuCau: [
        { en: 'Output identical to the starter (same classes and texts).', vi: 'Kết quả giống hệt starter (cùng class và chữ).' },
        { en: '<code>PriceTag({ price, salePrice })</code>: shows old price struck through only when <code>salePrice</code> exists. <code>StockBadge({ stock })</code>: "In stock" / "Only 3 left" (≤ 3) / "Sold out".', vi: '<code>PriceTag({ price, salePrice })</code>: chỉ gạch giá cũ khi có <code>salePrice</code>. <code>StockBadge({ stock })</code>: "In stock" / "Only 3 left" (≤ 3) / "Sold out".' },
        { en: 'App renders two products to prove the components are reusable.', vi: 'App vẽ hai sản phẩm để chứng minh component dùng lại được.' },
      ],
      viDu: [{ input: '<StockBadge stock={2} />', output: '<span class="stock low">Only 2 left</span>', explanation: 'Each component owns one small decision.|||Mỗi component lo một quyết định nhỏ.' }],
      goiY: ['Bắt đầu từ lá: PriceTag và StockBadge chỉ cần một–hai prop.', 'ProductPage chỉ còn ghép: <ProductImage …/><ProductInfo …><PriceTag …/><StockBadge …/></ProductInfo>.'],
      loiHayGap: ['Truyền cả object <code>product</code> xuống mọi con ⇒ con phụ thuộc vào hình dạng dữ liệu, khó dùng lại.', 'Đổi class/cấu trúc khi tách ⇒ CSS và bài kiểm gãy (refactor không được đổi hành vi).'],
      thuatNgu: [{ en: 'refactor', vi: 'cấu trúc lại mã, không đổi hành vi' }, { en: 'single responsibility', vi: 'mỗi phần một trách nhiệm' }],
      giaiThich: '<p>Component nhỏ, props tối thiểu dễ đọc, dễ dùng lại và dễ kiểm. <code>ProductPage</code> trở thành nơi "lắp ráp", logic hiển thị nằm trong các component lá.</p>',
      dau: `// src/App.js — STARTER: một component quá lớn (hãy tách)
const PRODUCTS = [
  { id: 1, name: 'Mechanical Keyboard', brand: 'KeyLab', price: 1200000, salePrice: 990000, stock: 2, img: 'https://api.dicebear.com/9.x/shapes/svg?seed=kb' },
  { id: 2, name: 'USB-C Hub', brand: 'Linko', price: 450000, salePrice: null, stock: 0, img: 'https://api.dicebear.com/9.x/shapes/svg?seed=hub' },
];
const fmt = (n) => n.toLocaleString('en-US');

function ProductPage({ product }) {
  return (
    <article className="product">
      <img className="product-img" src={product.img} alt={product.name} width="120" />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="brand">by {product.brand}</p>
        <p className="price">
          {product.salePrice ? <><del className="old">{fmt(product.price)}</del> <b className="now">{fmt(product.salePrice)}</b></> : <b className="now">{fmt(product.price)}</b>}
        </p>
        {product.stock === 0 ? <span className="stock out">Sold out</span> : product.stock <= 3 ? <span className="stock low">Only {product.stock} left</span> : <span className="stock">In stock</span>}
      </div>
    </article>
  );
}

export default function App() {
  return <div>{PRODUCTS.map((p) => <ProductPage key={p.id} product={p} />)}</div>;
}
`,
      giai: `// src/App.js — mỗi component một trách nhiệm; ProductPage chỉ còn lắp ráp
const PRODUCTS = [
  { id: 1, name: 'Mechanical Keyboard', brand: 'KeyLab', price: 1200000, salePrice: 990000, stock: 2, img: 'https://api.dicebear.com/9.x/shapes/svg?seed=kb' },
  { id: 2, name: 'USB-C Hub', brand: 'Linko', price: 450000, salePrice: null, stock: 0, img: 'https://api.dicebear.com/9.x/shapes/svg?seed=hub' },
];
const fmt = (n) => n.toLocaleString('en-US');

function ProductImage({ src, alt }) {
  return <img className="product-img" src={src} alt={alt} width="120" />;
}

function PriceTag({ price, salePrice }) {
  if (!salePrice) return <p className="price"><b className="now">{fmt(price)}</b></p>;
  return (
    <p className="price">
      <del className="old">{fmt(price)}</del> <b className="now">{fmt(salePrice)}</b>
    </p>
  );
}

function StockBadge({ stock }) {
  if (stock === 0) return <span className="stock out">Sold out</span>;
  if (stock <= 3) return <span className="stock low">Only {stock} left</span>;
  return <span className="stock">In stock</span>;
}

function ProductInfo({ name, brand, children }) {
  return (
    <div className="product-info">
      <h3 className="product-name">{name}</h3>
      <p className="brand">by {brand}</p>
      {children}
    </div>
  );
}

function ProductPage({ product }) {
  const { name, brand, price, salePrice, stock, img } = product;
  return (
    <article className="product">
      <ProductImage src={img} alt={name} />
      <ProductInfo name={name} brand={brand}>
        <PriceTag price={price} salePrice={salePrice} />
        <StockBadge stock={stock} />
      </ProductInfo>
    </article>
  );
}

export default function App() {
  return <div>{PRODUCTS.map((p) => <ProductPage key={p.id} product={p} />)}</div>;
}
`,
      kiem: [
        { moTa: 'Same output: names and prices', kiem: 'danh-sach-text', selector: '.product-name, .price', mongDoi: ['Mechanical Keyboard', '1,200,000 990,000', 'USB-C Hub', '450,000'] },
        { moTa: 'Stock badges', kiem: 'danh-sach-text', selector: '.stock', mongDoi: ['Only 2 left', 'Sold out'] },
        { moTa: 'The four components exist', kiem: 'ma-nguon', khop: '^(?=[\\s\\S]*(function|const)\\s+ProductImage\\b)(?=[\\s\\S]*(function|const)\\s+PriceTag\\b)(?=[\\s\\S]*(function|const)\\s+StockBadge\\b)(?=[\\s\\S]*(function|const)\\s+ProductInfo\\b)' },
        { moTa: 'StockBadge receives only stock', kiem: 'ma-nguon', khop: 'function StockBadge\\(\\s*\\{\\s*stock\\s*\\}\\s*\\)' },
        { an: true, moTa: 'PriceTag used with price/salePrice props', kiem: 'ma-nguon', khop: '<PriceTag\\s+price=\\{[^}]+\\}\\s+salePrice=' },
      ],
    }),
  ],
});
