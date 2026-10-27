/**
 * FER202 · 3.2 — Fragments & conditional rendering (bài luyện React).
 * Dễ → khó: return sớm → && và bẫy số 0 → bảng tra thay cho ?: lồng → Fragment trong bảng → 4 trạng thái giao diện.
 */
import { doiDau, KHOA, reactNho } from './_chung.mjs';

export default doiDau({
  slug: 'fer202-3-2-fragments-conditional',
  ten: '3.2 Fragments & conditional rendering',
  khoa: KHOA,
  baiHoc: 'fer202-3-2-fragments-conditional',
  de: [
    reactNho({
      tieuDe: 'Early return: greet a guest or a user',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['conditional rendering', 'early return', 'props'], the: ['jsx', 'conditional'],
      moTa: {
        en: '<p><code>Greeting</code> receives a <code>user</code> prop that may be <code>null</code>. Use an <code>if</code> with an early <code>return</code> before the main JSX: guests see a sign-in hint, users see a welcome with their role.</p>',
        vi: '<p><code>Greeting</code> nhận prop <code>user</code> có thể là <code>null</code>. Dùng <code>if</code> + <code>return</code> sớm trước JSX chính: khách thấy lời mời đăng nhập, người dùng thấy lời chào kèm vai trò.</p>',
      },
      yeuCau: [
        { en: 'Guest ⇒ <code>p.greeting</code> <code>Please sign in.</code>; user ⇒ <code>Welcome back, Lan (admin)!</code>.', vi: 'Khách ⇒ <code>p.greeting</code> <code>Please sign in.</code>; người dùng ⇒ <code>Welcome back, Lan (admin)!</code>.' },
        { en: 'App (given) renders three greetings: <code>null</code>, Lan/admin, Minh/student.', vi: 'App (đã cho) vẽ ba lời chào: <code>null</code>, Lan/admin, Minh/student.' },
      ],
      viDu: [{ input: '<Greeting user={null} />', output: '<p class="greeting">Please sign in.</p>', explanation: 'if (!user) return …; — the rest of the function never runs.|||if (!user) return …; — phần còn lại của hàm không chạy.' }],
      goiY: ['function Greeting({ user }) { if (!user) return <p className="greeting">Please sign in.</p>; return …; }', 'Template trong JSX: Welcome back, {user.name} ({user.role})!'],
      loiHayGap: ['Đọc <code>user.name</code> trước khi kiểm <code>user</code> ⇒ TypeError khi user là null.', 'Đặt <code>if</code> bên trong <code>{ }</code> của JSX ⇒ lỗi cú pháp.'],
      thuatNgu: [{ en: 'early return', vi: 'trả về sớm, bỏ qua phần sau' }, { en: 'guest', vi: 'khách (chưa đăng nhập)' }],
      giaiThich: '<p>Khi hai nhánh khác hẳn nhau, <code>if … return</code> trước JSX là cách rõ nhất. Nhánh nào chạy thì chỉ JSX của nhánh đó được tạo, nên không bao giờ đụng <code>user.name</code> khi user là null.</p>',
      dau: `// src/App.js — STARTER
function Greeting({ user }) {
  return <p className="greeting">Welcome back, {user.name} ({user.role})!</p>; // ⚠ user có thể null
}

export default function App() {
  return (
    <div>
      <Greeting user={null} />
      <Greeting user={{ name: 'Lan', role: 'admin' }} />
      <Greeting user={{ name: 'Minh', role: 'student' }} />
    </div>
  );
}
`,
      giai: `// src/App.js — if + return SỚM cho trường hợp đặc biệt, JSX chính ở cuối
function Greeting({ user }) {
  if (!user) return <p className="greeting">Please sign in.</p>;
  return <p className="greeting">Welcome back, {user.name} ({user.role})!</p>;
}

export default function App() {
  return (
    <div>
      <Greeting user={null} />
      <Greeting user={{ name: 'Lan', role: 'admin' }} />
      <Greeting user={{ name: 'Minh', role: 'student' }} />
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Three greetings render', kiem: 'danh-sach-text', selector: '.greeting', mongDoi: ['Please sign in.', 'Welcome back, Lan (admin)!', 'Welcome back, Minh (student)!'] },
        { moTa: 'No crash for a guest', kiem: 'khong-loi-js' },
        { an: true, moTa: 'Uses an early return', kiem: 'ma-nguon', khop: 'if\\s*\\(\\s*!\\s*user\\s*\\)\\s*return' },
      ],
    }),
    reactNho({
      tieuDe: 'The && trap: never render a stray 0',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['logical &&', 'falsy values', 'boolean conversion'], the: ['jsx', 'conditional'],
      moTa: {
        en: '<p><code>{count &amp;&amp; &lt;p&gt;…&lt;/p&gt;}</code> renders <b>0</b> when <code>count</code> is 0 — React prints numbers. Fix <code>Inbox</code> so an empty inbox renders nothing at all.</p>',
        vi: '<p><code>{count &amp;&amp; &lt;p&gt;…&lt;/p&gt;}</code> in ra <b>0</b> khi <code>count</code> = 0 — React hiển thị số. Sửa <code>Inbox</code> để hộp thư rỗng không hiện gì cả.</p>',
      },
      yeuCau: [
        { en: '<code>count &gt; 0</code> ⇒ <code>p.unread</code> <code>You have 3 new messages</code> (singular <code>1 new message</code>).', vi: '<code>count &gt; 0</code> ⇒ <code>p.unread</code> <code>You have 3 new messages</code> (số ít <code>1 new message</code>).' },
        { en: '<code>count === 0</code> ⇒ the box <code>#inbox-0</code> is completely empty.', vi: '<code>count === 0</code> ⇒ khung <code>#inbox-0</code> trống hoàn toàn.' },
      ],
      viDu: [{ input: '<Inbox count={0} />', output: '(nothing)', explanation: 'false, null and undefined render nothing; 0 renders "0".|||false, null, undefined không vẽ gì; 0 vẽ ra "0".' }],
      goiY: ['Điều kiện phải là boolean thật: {count > 0 && …} hoặc {count ? … : null}.', 'Số nhiều: message{count === 1 ? "" : "s"}.'],
      loiHayGap: ['<code>{items.length &amp;&amp; &lt;List/&gt;}</code> ⇒ mảng rỗng hiện số 0 lạc lõng trên trang.', 'Dùng <code>!!count</code> cũng được nhưng khó đọc hơn <code>count &gt; 0</code>.'],
      thuatNgu: [{ en: 'falsy', vi: 'giá trị bị coi là false (0, "", null, undefined, NaN, false)' }],
      giaiThich: '<p><code>a &amp;&amp; b</code> trả về <code>a</code> khi <code>a</code> falsy. React bỏ qua <code>false/null/undefined</code> nhưng VẼ số <code>0</code>. Vì vậy vế trái của <code>&amp;&amp;</code> trong JSX phải là boolean thật (<code>count &gt; 0</code>).</p>',
      dau: `// src/App.js — STARTER
function Inbox({ count }) {
  return <>{count && <p className="unread">You have {count} new messages</p>}</>;
}

export default function App() {
  return (
    <div>
      <div id="inbox-0"><Inbox count={0} /></div>
      <div id="inbox-1"><Inbox count={1} /></div>
      <div id="inbox-3"><Inbox count={3} /></div>
    </div>
  );
}
`,
      giai: `// src/App.js — vế trái của && phải là BOOLEAN (count > 0), không phải con số
function Inbox({ count }) {
  return <>{count > 0 && <p className="unread">You have {count} new message{count === 1 ? '' : 's'}</p>}</>;
}

export default function App() {
  return (
    <div>
      <div id="inbox-0"><Inbox count={0} /></div>
      <div id="inbox-1"><Inbox count={1} /></div>
      <div id="inbox-3"><Inbox count={3} /></div>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Empty inbox renders nothing (no "0")', kiem: 'text', selector: '#inbox-0', giaTri: '' },
        { moTa: 'Plural message', kiem: 'text', selector: '#inbox-3 .unread', giaTri: 'You have 3 new messages' },
        { moTa: 'Singular message', kiem: 'text', selector: '#inbox-1 .unread', giaTri: 'You have 1 new message' },
      ],
    }),
    reactNho({
      tieuDe: 'Replace nested ternaries with a lookup object',
      doKho: 'MEDIUM', phut: 10,
      khaiNiem: ['lookup table', 'conditional className', 'default value'], the: ['jsx', 'conditional'],
      moTa: {
        en: '<p><code>StatusBadge</code> uses three nested ternaries and is unreadable. Replace them with a <b>lookup object</b> <code>STATUS</code> mapping each status to a label and a class, with a fallback for unknown values.</p>',
        vi: '<p><code>StatusBadge</code> dùng ba toán tử 3 ngôi lồng nhau, rất khó đọc. Thay bằng <b>object tra cứu</b> <code>STATUS</code> ánh xạ mỗi trạng thái sang nhãn và class, có giá trị dự phòng cho trạng thái lạ.</p>',
      },
      yeuCau: [
        { en: '<code>paid</code> ⇒ "Paid" <code>.badge.badge-green</code>; <code>pending</code> ⇒ "Pending" <code>.badge-amber</code>; <code>cancelled</code> ⇒ "Cancelled" <code>.badge-red</code>; anything else ⇒ "Unknown" <code>.badge-gray</code>.', vi: '<code>paid</code> ⇒ "Paid" <code>.badge.badge-green</code>; <code>pending</code> ⇒ "Pending" <code>.badge-amber</code>; <code>cancelled</code> ⇒ "Cancelled" <code>.badge-red</code>; còn lại ⇒ "Unknown" <code>.badge-gray</code>.' },
        { en: 'No <code>?</code> ternary left in <code>StatusBadge</code>.', vi: 'Không còn toán tử <code>?</code> trong <code>StatusBadge</code>.' },
      ],
      viDu: [{ input: '<StatusBadge status="refunded" />', output: '<span class="badge badge-gray">Unknown</span>', explanation: 'STATUS[status] ?? FALLBACK|||STATUS[status] ?? FALLBACK' }],
      goiY: ["const STATUS = { paid: { label: 'Paid', tone: 'green' }, … };", 'const { label, tone } = STATUS[status] ?? { label: "Unknown", tone: "gray" };'],
      loiHayGap: ['Tạo object STATUS BÊN TRONG component ⇒ tạo lại mỗi lần render (không sai nhưng thừa).', 'Quên giá trị dự phòng ⇒ trạng thái lạ làm destructuring <code>undefined</code> ⇒ lỗi.'],
      thuatNgu: [{ en: 'lookup table', vi: 'bảng tra (object ánh xạ khoá → giá trị)' }, { en: 'fallback', vi: 'giá trị dự phòng' }],
      giaiThich: '<p>Khi có nhiều nhánh cùng dạng (nhãn + màu), dữ liệu hoá chúng thành object tra cứu: thêm trạng thái mới chỉ là thêm một dòng, không đụng JSX. <code>??</code> cho nhánh "còn lại".</p>',
      dau: `// src/App.js — STARTER
function StatusBadge({ status }) {
  return (
    <span className={'badge badge-' + (status === 'paid' ? 'green' : status === 'pending' ? 'amber' : 'red')}>
      {status === 'paid' ? 'Paid' : status === 'pending' ? 'Pending' : 'Cancelled'}
    </span>
  );
}

export default function App() {
  return (
    <div>
      {['paid', 'pending', 'cancelled', 'refunded'].map((s) => <StatusBadge key={s} status={s} />)}
    </div>
  );
}
`,
      giai: `// src/App.js — bảng tra thay cho ?: lồng nhau; thêm trạng thái = thêm một dòng dữ liệu
const STATUS = {
  paid: { label: 'Paid', tone: 'green' },
  pending: { label: 'Pending', tone: 'amber' },
  cancelled: { label: 'Cancelled', tone: 'red' },
};
const FALLBACK = { label: 'Unknown', tone: 'gray' };

function StatusBadge({ status }) {
  const { label, tone } = STATUS[status] ?? FALLBACK;
  return <span className={´badge badge-@{tone}´}>{label}</span>;
}

export default function App() {
  return (
    <div>
      {['paid', 'pending', 'cancelled', 'refunded'].map((s) => <StatusBadge key={s} status={s} />)}
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Labels in order', kiem: 'danh-sach-text', selector: '.badge', mongDoi: ['Paid', 'Pending', 'Cancelled', 'Unknown'] },
        { moTa: 'Tone classes', kiem: 'so-luong', selector: '.badge.badge-green, .badge.badge-amber, .badge.badge-red, .badge.badge-gray', giaTri: 4 },
        { moTa: 'Unknown status is gray', kiem: 'text', selector: '.badge-gray', giaTri: 'Unknown' },
        { an: true, moTa: 'No ternary operator in StatusBadge', kiem: 'ma-nguon', khop: "\\?\\s*'(Paid|Pending|green|amber)'", phuDinh: true },
      ],
    }),
    reactNho({
      tieuDe: 'Fragments inside a table',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['Fragment', 'valid table markup', 'keyed Fragment'], the: ['jsx', 'fragment'],
      moTa: {
        en: '<p>A <code>&lt;tr&gt;</code> may only contain <code>&lt;td&gt;</code>/<code>&lt;th&gt;</code>. <code>PriceCells</code> must return two cells WITHOUT a wrapper, and each order also needs a second "note" row — render the pair of rows with a <b>keyed Fragment</b>.</p>',
        vi: '<p><code>&lt;tr&gt;</code> chỉ được chứa <code>&lt;td&gt;</code>/<code>&lt;th&gt;</code>. <code>PriceCells</code> phải trả về hai ô KHÔNG có thẻ bọc, và mỗi đơn cần thêm một hàng "ghi chú" — vẽ cặp hàng bằng <b>Fragment có key</b>.</p>',
      },
      yeuCau: [
        { en: 'Each order ⇒ <code>tr.order</code> (id, <code>PriceCells</code> = qty cell + total cell) followed by <code>tr.note</code> (one cell spanning 3 columns).', vi: 'Mỗi đơn ⇒ <code>tr.order</code> (id, <code>PriceCells</code> = ô số lượng + ô thành tiền) rồi <code>tr.note</code> (một ô gộp 3 cột).' },
        { en: 'No <code>div</code>/<code>span</code> directly inside <code>tbody</code> or <code>tr</code>.', vi: 'Không có <code>div</code>/<code>span</code> trực tiếp trong <code>tbody</code> hay <code>tr</code>.' },
      ],
      viDu: [{ input: 'orders.map((o) => (<Fragment key={o.id}><tr…/><tr…/></Fragment>))', output: '<tr class="order">…</tr><tr class="note">…</tr> …', explanation: 'Short <> </> cannot take a key — use <Fragment key>.|||Dạng ngắn <> </> không nhận key — dùng <Fragment key>.' }],
      goiY: ['function PriceCells({ qty, price }) { return (<><td className="qty">{qty}</td><td className="total">…</td></>); }', 'import { Fragment } from "react"; orders.map((o) => <Fragment key={o.id}> … </Fragment>).'],
      loiHayGap: ['Bọc hai <code>&lt;td&gt;</code> trong <code>&lt;div&gt;</code> ⇒ HTML bảng sai, trình duyệt đẩy div ra ngoài bảng.', 'Dùng <code>&lt;&gt;</code> trong map ⇒ không gắn key được ⇒ cảnh báo key.'],
      thuatNgu: [{ en: 'colSpan', vi: 'ô gộp nhiều cột' }, { en: 'keyed Fragment', vi: 'Fragment có key' }],
      giaiThich: '<p>Fragment cho phép một component trả nhiều phần tử mà không thêm thẻ — bắt buộc trong bảng, danh sách định nghĩa, flex/grid. Trong <code>map</code> cần key nên phải viết đầy đủ <code>&lt;Fragment key&gt;</code>.</p>',
      dau: `// src/App.js — STARTER: div trong tr làm vỡ cấu trúc bảng
const ORDERS = [
  { id: 'A1', qty: 2, price: 35000, note: 'Less sugar' },
  { id: 'A2', qty: 1, price: 45000, note: 'Take away' },
];

function PriceCells({ qty, price }) {
  return (
    <div>
      <td className="qty">{qty}</td>
      <td className="total">{(qty * price).toLocaleString('en-US')}</td>
    </div>
  );
}

export default function App() {
  return (
    <table id="orders">
      <tbody>
        {ORDERS.map((o) => (
          <tr key={o.id} className="order">
            <td>{o.id}</td>
            <PriceCells qty={o.qty} price={o.price} />
          </tr>
        ))}
      </tbody>
    </table>
  );
}
`,
      giai: `// src/App.js — Fragment: trả nhiều phần tử mà không thêm thẻ (bắt buộc trong bảng)
import { Fragment } from 'react';

const ORDERS = [
  { id: 'A1', qty: 2, price: 35000, note: 'Less sugar' },
  { id: 'A2', qty: 1, price: 45000, note: 'Take away' },
];

function PriceCells({ qty, price }) {
  return (
    <>
      <td className="qty">{qty}</td>
      <td className="total">{(qty * price).toLocaleString('en-US')}</td>
    </>
  );
}

export default function App() {
  return (
    <table id="orders">
      <tbody>
        {ORDERS.map((o) => (
          // hai hàng cho mỗi đơn ⇒ Fragment CÓ KEY (dạng <> </> không nhận key)
          <Fragment key={o.id}>
            <tr className="order">
              <td>{o.id}</td>
              <PriceCells qty={o.qty} price={o.price} />
            </tr>
            <tr className="note">
              <td colSpan={3}>{o.note}</td>
            </tr>
          </Fragment>
        ))}
      </tbody>
    </table>
  );
}
`,
      kiem: [
        { moTa: 'Rows alternate order / note', kiem: 'danh-sach-text', selector: '#orders tbody > tr', mongDoi: ['A1270,000', 'Less sugar', 'A2145,000', 'Take away'] },
        { moTa: 'Each order row has exactly 3 td', kiem: 'so-luong', selector: 'tr.order > td', giaTri: 6 },
        { moTa: 'No div/span inside tr or tbody', kiem: 'so-luong', selector: 'tbody > div, tbody > span, tr > div, tr > span', giaTri: 0 },
        { an: true, moTa: 'Note cell spans 3 columns', kiem: 'thuoc-tinh', selector: 'tr.note td', thuocTinh: 'colspan', giaTri: '3' },
        { an: true, moTa: 'Keyed Fragment in the map', kiem: 'ma-nguon', khop: '<Fragment\\s+key=' },
      ],
    }),
    reactNho({
      tieuDe: 'Four UI states: loading, error, empty and data',
      doKho: 'HARD', phut: 15,
      khaiNiem: ['conditional rendering', 'UI states', 'component API'], the: ['jsx', 'conditional', 'ux'],
      moTa: {
        en: '<p>Every data screen has four states. <code>ProductList</code> receives <code>status</code> (<code>\'loading\' | \'error\' | \'success\'</code>), <code>items</code> and <code>error</code>. Render the right UI for each case — the given App shows all four side by side.</p>',
        vi: '<p>Mọi màn hình dữ liệu có bốn trạng thái. <code>ProductList</code> nhận <code>status</code> (<code>\'loading\' | \'error\' | \'success\'</code>), <code>items</code> và <code>error</code>. Vẽ đúng giao diện cho từng trường hợp — App đã cho hiển thị cả bốn cạnh nhau.</p>',
      },
      yeuCau: [
        { en: 'loading ⇒ <code>p.loading</code> "Loading products..."; error ⇒ <code>p.error</code> "Error: {message}".', vi: 'loading ⇒ <code>p.loading</code> "Loading products..."; error ⇒ <code>p.error</code> "Error: {message}".' },
        { en: 'success + empty ⇒ <code>p.empty</code> "No products found"; success + items ⇒ <code>ul</code> of <code>li.product</code> and a <code>small.count</code> "2 products".', vi: 'success + rỗng ⇒ <code>p.empty</code> "No products found"; success + có dữ liệu ⇒ <code>ul</code> các <code>li.product</code> và <code>small.count</code> "2 products".' },
        { en: 'Only ONE state is visible per list.', vi: 'Mỗi danh sách chỉ hiện MỘT trạng thái.' },
      ],
      viDu: [{ input: "<ProductList status=\"error\" error=\"Network down\" />", output: '<p class="error">Error: Network down</p>', explanation: 'Check the special states first, then the normal case.|||Kiểm các trạng thái đặc biệt trước, trường hợp bình thường sau cùng.' }],
      goiY: ['Thứ tự: if (status === "loading") return …; if (status === "error") return …; if (items.length === 0) return …; return danh sách.', 'items mặc định []: function ProductList({ status, items = [], error }).'],
      loiHayGap: ['Viết <code>{loading &amp;&amp; …}{error &amp;&amp; …}{items.map(…)}</code> cùng lúc ⇒ có thể hiện hai trạng thái một lúc.', 'Quên trạng thái rỗng ⇒ người dùng thấy trang trắng và nghĩ app hỏng.'],
      thuatNgu: [{ en: 'empty state', vi: 'trạng thái không có dữ liệu' }, { en: 'loading state', vi: 'trạng thái đang tải' }],
      giaiThich: '<p>Chuỗi <code>if … return</code> theo thứ tự ưu tiên (đang tải → lỗi → rỗng → có dữ liệu) bảo đảm chỉ một trạng thái hiện ra. Đây chính là mẫu bạn sẽ dùng ở chương 8 và 11 khi gọi API thật.</p>',
      dau: `// src/App.js — STARTER
function ProductList({ status, items, error }) {
  // TODO: loading / error / empty / data
  return <ul>{items.map((p) => <li key={p.id}>{p.name}</li>)}</ul>;
}

export default function App() {
  const items = [{ id: 1, name: 'Notebook' }, { id: 2, name: 'Pen' }];
  return (
    <div>
      <section id="s-loading"><ProductList status="loading" /></section>
      <section id="s-error"><ProductList status="error" error="Network down" /></section>
      <section id="s-empty"><ProductList status="success" items={[]} /></section>
      <section id="s-data"><ProductList status="success" items={items} /></section>
    </div>
  );
}
`,
      giai: `// src/App.js — return sớm theo thứ tự ưu tiên ⇒ luôn chỉ MỘT trạng thái hiện ra
function ProductList({ status, items = [], error }) {
  if (status === 'loading') return <p className="loading">Loading products...</p>;
  if (status === 'error') return <p className="error">Error: {error}</p>;
  if (items.length === 0) return <p className="empty">No products found</p>;
  return (
    <>
      <ul>
        {items.map((p) => <li key={p.id} className="product">{p.name}</li>)}
      </ul>
      <small className="count">{items.length} products</small>
    </>
  );
}

export default function App() {
  const items = [{ id: 1, name: 'Notebook' }, { id: 2, name: 'Pen' }];
  return (
    <div>
      <section id="s-loading"><ProductList status="loading" /></section>
      <section id="s-error"><ProductList status="error" error="Network down" /></section>
      <section id="s-empty"><ProductList status="success" items={[]} /></section>
      <section id="s-data"><ProductList status="success" items={items} /></section>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Loading state', kiem: 'text', selector: '#s-loading', giaTri: 'Loading products...' },
        { moTa: 'Error state with message', kiem: 'text', selector: '#s-error', giaTri: 'Error: Network down' },
        { moTa: 'Empty state', kiem: 'text', selector: '#s-empty', giaTri: 'No products found' },
        { moTa: 'Data state: items + count', kiem: 'danh-sach-text', selector: '#s-data .product, #s-data .count', mongDoi: ['Notebook', 'Pen', '2 products'] },
        { an: true, moTa: 'No JS error for missing items', kiem: 'khong-loi-js' },
      ],
    }),
  ],
});
