/**
 * FER202 · 3.1 — JSX: HTML inside JavaScript (bài luyện, máy chấm React — render App.js).
 * Dễ → khó: biểu thức trong JSX → thuộc tính JSX (className/htmlFor/style) → danh sách + key → sửa lỗi cú pháp JSX
 * → danh sách lồng.
 */
import { doiDau, KHOA, reactNho } from './_chung.mjs';

export default doiDau({
  slug: 'fer202-3-1-jsx-basics',
  ten: '3.1 JSX: HTML inside JavaScript',
  khoa: KHOA,
  baiHoc: 'fer202-3-1-jsx-basics',
  de: [
    reactNho({
      tieuDe: 'Render a profile card with JSX expressions',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['JSX expression', 'template literal', 'join'], the: ['jsx'],
      moTa: {
        en: '<p>Show the data of <code>user</code> using <code>{ }</code> expressions inside JSX. Anything that produces a value can go inside the braces — variables, calculations, function calls.</p>',
        vi: '<p>Hiển thị dữ liệu của <code>user</code> bằng biểu thức <code>{ }</code> trong JSX. Mọi thứ ra một giá trị đều đặt được trong ngoặc nhọn — biến, phép tính, lời gọi hàm.</p>',
      },
      yeuCau: [
        { en: '<code>#full-name</code> ⇒ <code>An Nguyen</code>, <code>#age</code> ⇒ <code>Age: 20</code>.', vi: '<code>#full-name</code> ⇒ <code>An Nguyen</code>, <code>#age</code> ⇒ <code>Age: 20</code>.' },
        { en: '<code>#skills</code> ⇒ <code>Skills: React, Node, Git</code> (array joined), <code>#born</code> ⇒ <code>Born in 2006</code> (<code>CURRENT_YEAR - age</code>).', vi: '<code>#skills</code> ⇒ <code>Skills: React, Node, Git</code> (ghép mảng), <code>#born</code> ⇒ <code>Born in 2006</code> (<code>CURRENT_YEAR - age</code>).' },
      ],
      viDu: [{ input: "user = { firstName: 'An', lastName: 'Nguyen', age: 20, skills: ['React', 'Node', 'Git'] }", output: '<h2 id="full-name">An Nguyen</h2> …', explanation: 'Expressions are evaluated; statements (if, for) are not allowed inside { }.|||Biểu thức được tính; câu lệnh (if, for) không đặt trong { } được.' }],
      goiY: ['<h2 id="full-name">{user.firstName} {user.lastName}</h2> — khoảng trắng giữa hai { } được giữ.', 'Mảng: {user.skills.join(", ")}. Phép tính: {CURRENT_YEAR - user.age}.'],
      loiHayGap: ['Viết <code>{user.skills}</code> ⇒ React ghép các phần tử SÁT nhau ("ReactNodeGit").', 'Đặt <code>if</code> trong <code>{ }</code> ⇒ lỗi cú pháp; dùng toán tử 3 ngôi hoặc tính trước khi return.'],
      thuatNgu: [{ en: 'expression', vi: 'biểu thức (ra một giá trị)' }, { en: 'statement', vi: 'câu lệnh (if, for…)' }],
      giaiThich: '<p>JSX biên dịch thành lời gọi <code>React.createElement</code>, nên trong <code>{ }</code> chỉ đặt được BIỂU THỨC. Chuỗi, số được hiển thị; mảng được vẽ từng phần tử (không có dấu phẩy) — vì vậy phải <code>join</code> khi muốn câu có dấu phẩy.</p>',
      dau: `// src/App.js — STARTER
const CURRENT_YEAR = 2026;
const user = { firstName: 'An', lastName: 'Nguyen', age: 20, skills: ['React', 'Node', 'Git'] };

export default function App() {
  // TODO: #full-name, #age, #skills, #born
  return (
    <div className="profile">
      <h2>Profile</h2>
    </div>
  );
}
`,
      giai: `// src/App.js — mọi giá trị đặt trong { } là BIỂU THỨC JavaScript
const CURRENT_YEAR = 2026;
const user = { firstName: 'An', lastName: 'Nguyen', age: 20, skills: ['React', 'Node', 'Git'] };

export default function App() {
  return (
    <div className="profile">
      <h2 id="full-name">{user.firstName} {user.lastName}</h2>
      <p id="age">Age: {user.age}</p>
      {/* mảng phải join — {user.skills} sẽ in dính liền "ReactNodeGit" */}
      <p id="skills">Skills: {user.skills.join(', ')}</p>
      <p id="born">Born in {CURRENT_YEAR - user.age}</p>
    </div>
  );
}
`,
      kiem: [
        { moTa: '#full-name', kiem: 'text', selector: '#full-name', giaTri: 'An Nguyen' },
        { moTa: '#age and #born', kiem: 'danh-sach-text', selector: '#age, #born', mongDoi: ['Age: 20', 'Born in 2006'] },
        { moTa: '#skills joined with commas', kiem: 'text', selector: '#skills', giaTri: 'Skills: React, Node, Git' },
        { an: true, moTa: 'Computed from data (not hard-coded)', kiem: 'ma-nguon', khop: 'CURRENT_YEAR\\s*-\\s*user\\.age' },
      ],
    }),
    reactNho({
      tieuDe: 'JSX attributes: className, htmlFor and style objects',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['className', 'htmlFor', 'style object', 'self-closing tag'], the: ['jsx', 'attributes'],
      moTa: {
        en: '<p>The starter was pasted from an HTML file and crashes: <code>style</code> is a string, attributes use HTML names. Convert it to valid JSX.</p>',
        vi: '<p>Starter được dán từ tệp HTML và bị lỗi: <code>style</code> là chuỗi, thuộc tính dùng tên HTML. Chuyển nó thành JSX hợp lệ.</p>',
      },
      yeuCau: [
        { en: '<code>class</code> ⇒ <code>className</code>, <code>for</code> ⇒ <code>htmlFor</code>, <code>tabindex</code> ⇒ <code>tabIndex</code>.', vi: '<code>class</code> ⇒ <code>className</code>, <code>for</code> ⇒ <code>htmlFor</code>, <code>tabindex</code> ⇒ <code>tabIndex</code>.' },
        { en: '<code>style</code> is an object with camelCase keys: <code>#title</code> has color <code>#2563eb</code> and <code>font-size: 24px</code>.', vi: '<code>style</code> là object, khoá camelCase: <code>#title</code> có màu <code>#2563eb</code> và <code>font-size: 24px</code>.' },
        { en: 'Void elements are self-closed: <code>&lt;img /&gt;</code>, <code>&lt;input /&gt;</code>, <code>&lt;br /&gt;</code>.', vi: 'Thẻ rỗng phải tự đóng: <code>&lt;img /&gt;</code>, <code>&lt;input /&gt;</code>, <code>&lt;br /&gt;</code>.' },
      ],
      viDu: [{ input: '<h1 style="color: #2563eb; font-size: 24px">', output: '<h1 style={{ color: \'#2563eb\', fontSize: 24 }}>', explanation: 'Outer braces = JS expression, inner braces = object.|||Ngoặc ngoài = biểu thức JS, ngoặc trong = object.' }],
      goiY: ['style={{ color: "#2563eb", fontSize: 24 }} — số không đơn vị được hiểu là px.', 'Tìm-thay: class= ⇒ className=, for= ⇒ htmlFor=.'],
      loiHayGap: ['<code>style="color: red"</code> ⇒ React báo lỗi "The style prop expects a mapping from style properties to values".', '<code>font-size</code> trong object (gạch nối) ⇒ cú pháp sai; phải <code>fontSize</code>.'],
      thuatNgu: [{ en: 'camelCase', vi: 'viết liền, chữ đầu từ sau viết hoa (fontSize)' }, { en: 'void element', vi: 'thẻ không có nội dung (img, input, br)' }],
      giaiThich: '<p>JSX là JavaScript, nên các tên trùng từ khoá JS được đổi: <code>class</code> → <code>className</code>, <code>for</code> → <code>htmlFor</code>; thuộc tính nhiều chữ viết camelCase. <code>style</code> nhận object (khoá camelCase, số được hiểu là px). Mọi thẻ phải đóng, kể cả thẻ rỗng.</p>',
      dau: `// src/App.js — STARTER: dán từ HTML, chưa phải JSX hợp lệ
export default function App() {
  return (
    <div class="card highlight">
      <h1 id="title" style="color: #2563eb; font-size: 24px">Sign up</h1>
      <img src="https://api.dicebear.com/9.x/shapes/svg?seed=logo" alt="Logo" width="64">
      <label for="email">Email</label>
      <input id="email" type="email" tabindex="1">
      <br>
      <button class="btn">Send</button>
    </div>
  );
}
`,
      giai: `// src/App.js — JSX hợp lệ: className/htmlFor/tabIndex, style là object, thẻ rỗng tự đóng
const titleStyle = { color: '#2563eb', fontSize: 24 }; // số không đơn vị ⇒ px

export default function App() {
  return (
    <div className="card highlight">
      <h1 id="title" style={titleStyle}>Sign up</h1>
      <img src="https://api.dicebear.com/9.x/shapes/svg?seed=logo" alt="Logo" width="64" />
      <label htmlFor="email">Email</label>
      <input id="email" type="email" tabIndex={1} />
      <br />
      <button className="btn">Send</button>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Wrapper has class "card highlight"', kiem: 'ton-tai', selector: 'div.card.highlight' },
        { moTa: '#title is blue and 24px', kiem: 'css', selector: '#title', thuocTinh: 'color', giaTri: 'rgb(37, 99, 235)' },
        { moTa: 'Font size 24px', kiem: 'css', selector: '#title', thuocTinh: 'font-size', giaTri: '24px' },
        { moTa: 'Label points to #email (htmlFor)', kiem: 'thuoc-tinh', selector: 'label', thuocTinh: 'for', giaTri: 'email' },
        { an: true, moTa: 'No HTML-only attribute names left', kiem: 'ma-nguon', khop: '\\s(class|for)=|\\stabindex="', phuDinh: true },
      ],
    }),
    reactNho({
      tieuDe: 'Render a menu list with stable keys',
      doKho: 'MEDIUM', phut: 10,
      khaiNiem: ['map', 'key', 'toLocaleString'], the: ['jsx', 'lists', 'key'],
      moTa: {
        en: '<p>Render <code>MENU</code> as a list. Every element produced by <code>map</code> needs a <b>stable, unique</b> <code>key</code> — use the item id, not the array index.</p>',
        vi: '<p>Hiển thị <code>MENU</code> thành danh sách. Mỗi phần tử sinh từ <code>map</code> cần <code>key</code> <b>ổn định, duy nhất</b> — dùng id của món, không dùng chỉ số mảng.</p>',
      },
      yeuCau: [
        { en: '<code>ul#menu</code> with one <code>li.menu-item</code> per item: <code>Espresso — 35,000 VND</code>.', vi: '<code>ul#menu</code> mỗi món một <code>li.menu-item</code>: <code>Espresso — 35,000 VND</code>.' },
        { en: '<code>#count</code> ⇒ <code>3 items</code>; <code>key={item.id}</code>.', vi: '<code>#count</code> ⇒ <code>3 items</code>; <code>key={item.id}</code>.' },
      ],
      viDu: [{ input: "{ id: 'e1', name: 'Espresso', price: 35000 }", output: '<li class="menu-item">Espresso — 35,000 VND</li>', explanation: 'price.toLocaleString(\'en-US\') adds the commas.|||price.toLocaleString(\'en-US\') thêm dấu phẩy.' }],
      goiY: ['{MENU.map((item) => <li key={item.id} className="menu-item">…</li>)}', 'Định dạng: {item.price.toLocaleString("en-US")} VND.'],
      loiHayGap: ['Quên <code>key</code> ⇒ cảnh báo "Each child in a list should have a unique key prop".', '<code>key={index}</code> — sai khi danh sách bị xoá/sắp xếp lại (React gắn nhầm state cho phần tử).'],
      thuatNgu: [{ en: 'key prop', vi: 'khoá định danh của phần tử trong danh sách' }, { en: 'reconciliation', vi: 'React so sánh cây cũ/mới để cập nhật DOM' }],
      giaiThich: '<p>React dùng <code>key</code> để biết phần tử nào là phần tử nào giữa hai lần render. Key phải ổn định (không đổi giữa các lần render) và duy nhất trong danh sách — id dữ liệu là lựa chọn đúng; index chỉ tạm được khi danh sách không bao giờ thêm/xoá/sắp xếp.</p>',
      dau: `// src/App.js — STARTER
const MENU = [
  { id: 'e1', name: 'Espresso', price: 35000 },
  { id: 'c2', name: 'Cappuccino', price: 45000 },
  { id: 't3', name: 'Peach Tea', price: 40000 },
];

export default function App() {
  // TODO: ul#menu > li.menu-item (key = id), #count
  return <h2>Menu</h2>;
}
`,
      giai: `// src/App.js — map ra danh sách, key = id ổn định
const MENU = [
  { id: 'e1', name: 'Espresso', price: 35000 },
  { id: 'c2', name: 'Cappuccino', price: 45000 },
  { id: 't3', name: 'Peach Tea', price: 40000 },
];

export default function App() {
  return (
    <section>
      <h2>Menu</h2>
      <ul id="menu">
        {MENU.map((item) => (
          <li key={item.id} className="menu-item">
            {item.name} — {item.price.toLocaleString('en-US')} VND
          </li>
        ))}
      </ul>
      <p id="count">{MENU.length} items</p>
    </section>
  );
}
`,
      kiem: [
        { moTa: '3 .menu-item in data order', kiem: 'danh-sach-text', selector: '#menu .menu-item', mongDoi: ['Espresso — 35,000 VND', 'Cappuccino — 45,000 VND', 'Peach Tea — 40,000 VND'] },
        { moTa: '#count', kiem: 'text', selector: '#count', giaTri: '3 items' },
        { moTa: 'key uses the item id', kiem: 'ma-nguon', khop: 'key=\\{\\s*\\w+\\.id\\s*\\}' },
        { an: true, moTa: 'Not keyed by index', kiem: 'ma-nguon', khop: 'key=\\{\\s*(i|idx|index)\\s*\\}', phuDinh: true },
      ],
    }),
    reactNho({
      tieuDe: 'Fix the JSX: one root, closed tags, camelCase events',
      doKho: 'MEDIUM', phut: 10,
      khaiNiem: ['single root', 'Fragment', 'closing tags', 'onClick'], the: ['jsx', 'syntax'],
      moTa: {
        en: '<p>The starter does not even compile. Fix the three JSX rules it breaks: a component returns <b>one</b> root element (use a Fragment), every tag is <b>closed</b>, and event props are <b>camelCase</b> functions.</p>',
        vi: '<p>Starter không biên dịch được. Sửa ba luật JSX nó vi phạm: component trả về <b>một</b> phần tử gốc (dùng Fragment), mọi thẻ phải <b>đóng</b>, prop sự kiện viết <b>camelCase</b> và nhận hàm.</p>',
      },
      yeuCau: [
        { en: 'Render <code>h1#title</code> "Notice board", <code>p#date</code> "Monday", <code>hr</code> and <code>button#btn-read</code> "Mark as read" side by side — no extra <code>div</code> wrapper.', vi: 'Hiển thị <code>h1#title</code> "Notice board", <code>p#date</code> "Monday", <code>hr</code> và <code>button#btn-read</code> "Mark as read" — không thêm <code>div</code> bọc.' },
        { en: 'The button uses <code>onClick={…}</code> with a function (it may just log).', vi: 'Nút dùng <code>onClick={…}</code> với một hàm (có thể chỉ log).' },
      ],
      viDu: [{ input: 'return (<h1/> <p/>)', output: 'return (<>  <h1/> <p/>  </>)', explanation: 'Two siblings need a parent; a Fragment adds no DOM node.|||Hai phần tử ngang hàng cần một cha; Fragment không sinh thẻ DOM.' }],
      goiY: ['Bọc bằng <> … </> (Fragment) thay vì div.', '<hr> ⇒ <hr />; onclick="…" ⇒ onClick={() => console.log("read")}.'],
      loiHayGap: ['Bọc thêm <code>&lt;div&gt;</code> chỉ để hết lỗi — thừa thẻ, phá bố cục flex/grid và bảng.', '<code>onClick="markRead()"</code> (chuỗi) ⇒ React cần HÀM, không phải chuỗi.'],
      thuatNgu: [{ en: 'root element', vi: 'phần tử gốc' }, { en: 'Fragment', vi: 'nhóm phần tử không sinh thẻ' }],
      giaiThich: '<p>Một biểu thức JSX là MỘT lời gọi <code>createElement</code>, nên không thể trả về hai phần tử ngang hàng — Fragment gom chúng mà không thêm nút DOM. Parser JSX bắt buộc mọi thẻ đóng. Sự kiện là prop camelCase nhận hàm, không phải chuỗi mã như HTML.</p>',
      dau: `// src/App.js — STARTER: KHÔNG biên dịch được
export default function App() {
  return (
    <h1 id="title">Notice board</h1>
    <p id="date">Monday</p>
    <hr>
    <button id="btn-read" onclick="markRead()">Mark as read</button>
  );
}
`,
      giai: `// src/App.js — một gốc (Fragment), thẻ đóng đủ, sự kiện camelCase nhận HÀM
export default function App() {
  const markRead = () => console.log('read');
  return (
    <>
      <h1 id="title">Notice board</h1>
      <p id="date">Monday</p>
      <hr />
      <button id="btn-read" type="button" onClick={markRead}>Mark as read</button>
    </>
  );
}
`,
      kiem: [
        { moTa: 'Title, date and button render', kiem: 'danh-sach-text', selector: '#title, #date, #btn-read', mongDoi: ['Notice board', 'Monday', 'Mark as read'] },
        { moTa: 'No extra wrapper: h1 is a direct child of #root', kiem: 'ton-tai', selector: '#root > h1#title' },
        { moTa: 'Click handler is a function (logs "read")', kiem: 'console', mongDoi: ['read'], truoc: [{ hanhDong: 'click', selector: '#btn-read' }] },
        { an: true, moTa: 'hr is rendered', kiem: 'so-luong', selector: '#root > hr', giaTri: 1 },
      ],
    }),
    reactNho({
      tieuDe: 'Nested lists: categories and their products',
      doKho: 'HARD', phut: 15,
      khaiNiem: ['nested map', 'key scope', 'component extraction'], the: ['jsx', 'lists'],
      moTa: {
        en: '<p>Render a two-level list: each category is a <code>section.category</code> with its products. Extract a <code>Category</code> component; keys only need to be unique among siblings.</p>',
        vi: '<p>Hiển thị danh sách hai tầng: mỗi danh mục là một <code>section.category</code> kèm sản phẩm. Tách component <code>Category</code>; key chỉ cần duy nhất giữa các anh em cùng cấp.</p>',
      },
      yeuCau: [
        { en: 'Each <code>section.category</code>: <code>h2</code> <code>Name (n)</code>, then <code>ul</code> of <code>li.product</code> <code>Name — price</code>.', vi: 'Mỗi <code>section.category</code>: <code>h2</code> <code>Tên (n)</code>, rồi <code>ul</code> các <code>li.product</code> <code>Tên — giá</code>.' },
        { en: 'A category without products shows <code>p.empty</code> "No products yet" instead of the list.', vi: 'Danh mục không có sản phẩm hiện <code>p.empty</code> "No products yet" thay cho danh sách.' },
        { en: '<code>#total</code> ⇒ <code>5 products in 3 categories</code>.', vi: '<code>#total</code> ⇒ <code>5 products in 3 categories</code>.' },
      ],
      viDu: [{ input: "{ id: 'c1', name: 'Coffee', products: [ … 3 … ] }", output: '<section class="category"><h2>Coffee (3)</h2><ul>…</ul></section>', explanation: 'Product ids may repeat across categories — keys are local.|||Id sản phẩm có thể trùng giữa các danh mục — key chỉ tính trong cùng cấp.' }],
      goiY: ['function Category({ category }) { … } rồi trong App: {CATEGORIES.map((c) => <Category key={c.id} category={c} />)}.', 'Tổng sản phẩm: CATEGORIES.reduce((n, c) => n + c.products.length, 0).'],
      loiHayGap: ['Đặt key ở <code>&lt;section&gt;</code> BÊN TRONG Category thay vì ở <code>&lt;Category key&gt;</code> nơi gọi map ⇒ vẫn cảnh báo key.', 'Render <code>&lt;ul&gt;</code> rỗng cho danh mục không có sản phẩm.'],
      thuatNgu: [{ en: 'sibling', vi: 'phần tử cùng cấp (anh em)' }, { en: 'extract a component', vi: 'tách một phần giao diện thành component riêng' }],
      giaiThich: '<p>Key đặt ở phần tử do <code>map</code> trả về — với component là ngay tại <code>&lt;Category key=… /&gt;</code>. Key chỉ cần duy nhất giữa các phần tử anh em, nên id sản phẩm trùng ở hai danh mục là bình thường. Tách component giúp mỗi tầng map ngắn gọn và đọc được.</p>',
      dau: `// src/App.js — STARTER
const CATEGORIES = [
  { id: 'c1', name: 'Coffee', products: [{ id: 1, name: 'Espresso', price: 35000 }, { id: 2, name: 'Latte', price: 45000 }, { id: 3, name: 'Mocha', price: 50000 }] },
  { id: 'c2', name: 'Tea', products: [{ id: 1, name: 'Green Tea', price: 30000 }, { id: 2, name: 'Peach Tea', price: 40000 }] },
  { id: 'c3', name: 'Cake', products: [] },
];

export default function App() {
  // TODO: section.category cho từng danh mục, li.product, p.empty, #total
  return <h1>Shop</h1>;
}
`,
      giai: `// src/App.js — danh sách hai tầng: App map danh mục, Category map sản phẩm
const CATEGORIES = [
  { id: 'c1', name: 'Coffee', products: [{ id: 1, name: 'Espresso', price: 35000 }, { id: 2, name: 'Latte', price: 45000 }, { id: 3, name: 'Mocha', price: 50000 }] },
  { id: 'c2', name: 'Tea', products: [{ id: 1, name: 'Green Tea', price: 30000 }, { id: 2, name: 'Peach Tea', price: 40000 }] },
  { id: 'c3', name: 'Cake', products: [] },
];

const vnd = (n) => ´@{n.toLocaleString('en-US')} VND´;

function Category({ category }) {
  const { name, products } = category;
  return (
    <section className="category">
      <h2>{name} ({products.length})</h2>
      {products.length === 0 ? (
        <p className="empty">No products yet</p>
      ) : (
        <ul>
          {/* key chỉ cần duy nhất trong CÙNG danh sách này */}
          {products.map((p) => <li key={p.id} className="product">{p.name} — {vnd(p.price)}</li>)}
        </ul>
      )}
    </section>
  );
}

export default function App() {
  const total = CATEGORIES.reduce((n, c) => n + c.products.length, 0);
  return (
    <main>
      <h1>Shop</h1>
      {CATEGORIES.map((c) => <Category key={c.id} category={c} />)}
      <p id="total">{total} products in {CATEGORIES.length} categories</p>
    </main>
  );
}
`,
      kiem: [
        { moTa: 'Category headings with counts', kiem: 'danh-sach-text', selector: '.category h2', mongDoi: ['Coffee (3)', 'Tea (2)', 'Cake (0)'] },
        { moTa: 'Products under Tea', kiem: 'danh-sach-text', selector: '.category:nth-of-type(2) .product', mongDoi: ['Green Tea — 30,000 VND', 'Peach Tea — 40,000 VND'] },
        { moTa: 'Empty category message, no empty ul', kiem: 'danh-sach-text', selector: '.category:nth-of-type(3) .empty, .category:nth-of-type(3) ul', mongDoi: ['No products yet'] },
        { moTa: '#total', kiem: 'text', selector: '#total', giaTri: '5 products in 3 categories' },
        { an: true, moTa: 'A Category component is extracted', kiem: 'ma-nguon', khop: 'function\\s+Category\\s*\\(|const\\s+Category\\s*=' },
      ],
    }),
  ],
});
