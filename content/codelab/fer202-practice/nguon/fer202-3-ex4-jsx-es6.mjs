/**
 * FER202 · Exercise 4 — JSX & ES6 (array-method lab). Bài luyện React: dùng filter/map/sort/reduce/find/some/every
 * ngay khi render. Dễ → khó.
 */
import { doiDau, KHOA, reactNho } from './_chung.mjs';

export default doiDau({
  slug: 'fer202-3-ex4-jsx-es6',
  ten: '3.4 Exercise 4 — JSX & ES6 array methods',
  khoa: KHOA,
  baiHoc: 'fer202-3-ex4-jsx-es6',
  de: [
    reactNho({
      tieuDe: 'filter + map: available books',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['filter', 'map', 'key'], the: ['jsx', 'array-methods'],
      moTa: { en: '<p>A library page must list only the books that can be borrowed right now. Select them with <code>filter</code>, turn them into list items with <code>map</code>, and reuse the filtered array for a counter — one source, two outputs.</p>', vi: '<p>Trang thư viện chỉ được liệt kê sách đang cho mượn. Chọn chúng bằng <code>filter</code>, biến thành các mục danh sách bằng <code>map</code>, và dùng lại mảng đã lọc cho bộ đếm — một nguồn, hai kết quả.</p>' },
      yeuCau: [
        { en: '<code>ul#available</code> lists the titles with <code>available: true</code> (data order).', vi: '<code>ul#available</code> liệt kê tên sách có <code>available: true</code> (thứ tự dữ liệu).' },
        { en: '<code>#available-count</code> ⇒ <code>3 of 5 books available</code>.', vi: '<code>#available-count</code> ⇒ <code>3 of 5 books available</code>.' },
      ],
      viDu: [{ input: 'BOOKS.filter((b) => b.available)', output: '3 books', explanation: 'filter returns a new array; map turns it into <li> elements.|||filter trả mảng mới; map biến nó thành các <li>.' }],
      goiY: ['const available = BOOKS.filter((b) => b.available);', '{available.map((b) => <li key={b.id}>{b.title}</li>)}'],
      loiHayGap: ['Dùng <code>map</code> rồi trả <code>null</code> cho sách không có ⇒ đếm sai (length vẫn là 5).', 'Đếm bằng biến tăng dần trong vòng lặp thay vì <code>available.length</code>.'],
      thuatNgu: [{ en: 'predicate', vi: 'hàm điều kiện trả true/false' }],
      giaiThich: '<p>Lọc trước (<code>filter</code>), hiển thị sau (<code>map</code>): mảng đã lọc dùng được cho cả danh sách lẫn bộ đếm.</p>',
      dau: `// src/App.js — STARTER
const BOOKS = [
  { id: 1, title: 'Clean Code', available: true },
  { id: 2, title: 'Refactoring', available: false },
  { id: 3, title: 'The Pragmatic Programmer', available: true },
  { id: 4, title: 'Design Patterns', available: false },
  { id: 5, title: 'Eloquent JavaScript', available: true },
];

export default function App() {
  // TODO: ul#available + #available-count
  return <h2>Library</h2>;
}
`,
      giai: `// src/App.js — filter để chọn, map để hiển thị
const BOOKS = [
  { id: 1, title: 'Clean Code', available: true },
  { id: 2, title: 'Refactoring', available: false },
  { id: 3, title: 'The Pragmatic Programmer', available: true },
  { id: 4, title: 'Design Patterns', available: false },
  { id: 5, title: 'Eloquent JavaScript', available: true },
];

export default function App() {
  const available = BOOKS.filter((b) => b.available);
  return (
    <section>
      <h2>Library</h2>
      <ul id="available">
        {available.map((b) => <li key={b.id}>{b.title}</li>)}
      </ul>
      <p id="available-count">{available.length} of {BOOKS.length} books available</p>
    </section>
  );
}
`,
      kiem: [
        { moTa: 'Only available titles', kiem: 'danh-sach-text', selector: '#available li', mongDoi: ['Clean Code', 'The Pragmatic Programmer', 'Eloquent JavaScript'] },
        { moTa: 'Counter', kiem: 'text', selector: '#available-count', giaTri: '3 of 5 books available' },
        { an: true, moTa: 'Uses filter', kiem: 'ma-nguon', khop: '\\.filter\\(' },
      ],
    }),
    reactNho({
      tieuDe: 'Sort a copy: leaderboard table',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['sort', 'spread copy', 'compare function', 'tie-break'], the: ['jsx', 'array-methods', 'sort'],
      moTa: {
        en: '<p>Render a leaderboard sorted by score (highest first, ties by name A → Z) with a rank column. <code>sort</code> changes the array it is called on — the original roster below must keep its order.</p>',
        vi: '<p>Vẽ bảng xếp hạng theo điểm (cao trước, bằng điểm theo tên A → Z) có cột hạng. <code>sort</code> sửa chính mảng nó được gọi — danh sách gốc bên dưới phải giữ thứ tự.</p>',
      },
      yeuCau: [
        { en: '<code>#leaderboard tbody tr</code>: <code>#rank</code>, name, score.', vi: '<code>#leaderboard tbody tr</code>: hạng, tên, điểm.' },
        { en: '<code>ul#roster</code> lists PLAYERS in the original order.', vi: '<code>ul#roster</code> liệt kê PLAYERS theo thứ tự gốc.' },
      ],
      viDu: [{ input: '[...PLAYERS].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))', output: 'Huy 95, Lan 88, Minh 88, An 70', explanation: 'Lan and Minh tie: sorted by name.|||Lan và Minh bằng điểm: xếp theo tên.' }],
      goiY: ['Sắp trên bản sao: [...PLAYERS].sort(…).', 'b.score - a.score cho giảm dần; || a.name.localeCompare(b.name) cho tiêu chí phụ.'],
      loiHayGap: ['<code>PLAYERS.sort(…)</code> ⇒ danh sách gốc (roster) cũng bị đảo.', '<code>sort()</code> không có hàm so sánh ⇒ so như chuỗi: 100 đứng trước 95.'],
      thuatNgu: [{ en: 'compare function', vi: 'hàm so sánh (a, b) ⇒ âm/0/dương' }, { en: 'tie-break', vi: 'tiêu chí phụ khi bằng nhau' }],
      giaiThich: '<p><code>sort</code> sắp TẠI CHỖ và trả về chính mảng đó. Trong React dữ liệu props/state không được sửa, nên luôn sắp trên bản sao <code>[...arr]</code> (hoặc <code>toSorted</code> ở trình duyệt mới).</p>',
      dau: `// src/App.js — STARTER
const PLAYERS = [
  { id: 'p1', name: 'Minh', score: 88 },
  { id: 'p2', name: 'An', score: 70 },
  { id: 'p3', name: 'Huy', score: 95 },
  { id: 'p4', name: 'Lan', score: 88 },
];

export default function App() {
  const ranked = PLAYERS.sort((a, b) => b.score - a.score); // ⚠ sửa luôn PLAYERS
  return (
    <div>
      <table id="leaderboard"><tbody>{ranked.map((p, i) => <tr key={p.id}><td>{i + 1}</td><td>{p.name}</td><td>{p.score}</td></tr>)}</tbody></table>
      <ul id="roster">{PLAYERS.map((p) => <li key={p.id}>{p.name}</li>)}</ul>
    </div>
  );
}
`,
      giai: `// src/App.js — sort trên BẢN SAO; tiêu chí phụ cho các điểm bằng nhau
const PLAYERS = [
  { id: 'p1', name: 'Minh', score: 88 },
  { id: 'p2', name: 'An', score: 70 },
  { id: 'p3', name: 'Huy', score: 95 },
  { id: 'p4', name: 'Lan', score: 88 },
];

export default function App() {
  const ranked = [...PLAYERS].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  return (
    <div>
      <table id="leaderboard">
        <thead><tr><th>#</th><th>Player</th><th>Score</th></tr></thead>
        <tbody>
          {ranked.map((p, i) => (
            <tr key={p.id}>
              <td>{i + 1}</td>
              <td>{p.name}</td>
              <td>{p.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ul id="roster">{PLAYERS.map((p) => <li key={p.id}>{p.name}</li>)}</ul>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Leaderboard order with tie-break', kiem: 'danh-sach-text', selector: '#leaderboard tbody tr td:nth-child(2)', mongDoi: ['Huy', 'Lan', 'Minh', 'An'] },
        { moTa: 'Rank column 1..4', kiem: 'danh-sach-text', selector: '#leaderboard tbody tr td:first-child', mongDoi: ['1', '2', '3', '4'] },
        { moTa: 'Roster keeps the original order', kiem: 'danh-sach-text', selector: '#roster li', mongDoi: ['Minh', 'An', 'Huy', 'Lan'] },
      ],
    }),
    reactNho({
      tieuDe: 'reduce: order summary with discount and shipping',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['reduce', 'derived values', 'business rules'], the: ['jsx', 'array-methods', 'reduce'],
      moTa: {
        en: '<p>Compute an order summary from the cart lines during render. Rules: subtotal = Σ price × qty; 10% discount when subtotal ≥ 500,000; shipping 30,000 unless the discounted amount ≥ 1,000,000 (then free).</p>',
        vi: '<p>Tính phần tổng kết đơn từ các dòng giỏ ngay khi render. Luật: tạm tính = Σ giá × số lượng; giảm 10% khi tạm tính ≥ 500,000; phí ship 30,000 trừ khi số tiền sau giảm ≥ 1,000,000 (thì miễn phí).</p>',
      },
      yeuCau: [
        { en: 'Render <code>#subtotal</code>, <code>#discount</code> (<code>-60,000 VND</code> or <code>0 VND</code>), <code>#shipping</code> (<code>Free</code> or <code>30,000 VND</code>), <code>#total</code>.', vi: 'Hiện <code>#subtotal</code>, <code>#discount</code> (<code>-60,000 VND</code> hoặc <code>0 VND</code>), <code>#shipping</code> (<code>Free</code> hoặc <code>30,000 VND</code>), <code>#total</code>.' },
        { en: 'App (given) renders the summary for two carts: <code>#cart-small</code> and <code>#cart-big</code>.', vi: 'App (đã cho) vẽ tổng kết cho hai giỏ: <code>#cart-small</code> và <code>#cart-big</code>.' },
      ],
      viDu: [{ input: 'subtotal 600,000', output: 'discount -60,000 · shipping 30,000 · total 570,000', explanation: '540,000 < 1,000,000 ⇒ shipping is charged.|||540,000 < 1,000,000 ⇒ vẫn tính ship.' }],
      goiY: ['const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);', 'Tính theo thứ tự: discount → afterDiscount → shipping → total.'],
      loiHayGap: ['Quên giá trị khởi đầu <code>0</code> của reduce ⇒ phần tử đầu (object) bị cộng như chuỗi "[object Object]…".', 'Xét miễn ship theo tạm tính thay vì số tiền SAU giảm.'],
      thuatNgu: [{ en: 'subtotal', vi: 'tạm tính' }, { en: 'accumulator', vi: 'biến cộng dồn của reduce' }],
      giaiThich: '<p>Mọi con số là giá trị suy ra từ <code>lines</code> nên tính ngay trong component, không lưu state. Đặt luật nghiệp vụ thành các hằng (<code>DISCOUNT_FROM</code>, <code>FREE_SHIP_FROM</code>) cho dễ đọc và dễ đổi.</p>',
      dau: `// src/App.js — STARTER
function Summary({ lines }) {
  // TODO: #subtotal, #discount, #shipping, #total
  return <dl />;
}

export default function App() {
  const small = [{ id: 1, name: 'Notebook', price: 150000, qty: 2 }, { id: 2, name: 'Pen', price: 50000, qty: 6 }];
  const big = [{ id: 3, name: 'Keyboard', price: 900000, qty: 1 }, { id: 4, name: 'Mouse', price: 350000, qty: 1 }];
  return (
    <div>
      <section id="cart-small"><Summary lines={small} /></section>
      <section id="cart-big"><Summary lines={big} /></section>
    </div>
  );
}
`,
      giai: `// src/App.js — reduce cho tạm tính; các luật nghiệp vụ là hằng số đặt tên rõ ràng
const DISCOUNT_FROM = 500000;
const FREE_SHIP_FROM = 1000000;
const SHIPPING = 30000;
const vnd = (n) => ´@{n.toLocaleString('en-US')} VND´;

function Summary({ lines }) {
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0); // nhớ giá trị đầu 0
  const discount = subtotal >= DISCOUNT_FROM ? Math.round(subtotal * 0.1) : 0;
  const afterDiscount = subtotal - discount;
  const shipping = afterDiscount >= FREE_SHIP_FROM ? 0 : SHIPPING;
  return (
    <dl>
      <dt>Subtotal</dt><dd id="subtotal">{vnd(subtotal)}</dd>
      <dt>Discount</dt><dd id="discount">{discount ? ´-@{vnd(discount)}´ : vnd(0)}</dd>
      <dt>Shipping</dt><dd id="shipping">{shipping === 0 ? 'Free' : vnd(shipping)}</dd>
      <dt>Total</dt><dd id="total">{vnd(afterDiscount + shipping)}</dd>
    </dl>
  );
}

export default function App() {
  const small = [{ id: 1, name: 'Notebook', price: 150000, qty: 2 }, { id: 2, name: 'Pen', price: 50000, qty: 6 }];
  const big = [{ id: 3, name: 'Keyboard', price: 900000, qty: 1 }, { id: 4, name: 'Mouse', price: 350000, qty: 1 }];
  return (
    <div>
      <section id="cart-small"><Summary lines={small} /></section>
      <section id="cart-big"><Summary lines={big} /></section>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Small cart: 600,000 − 60,000 + 30,000', kiem: 'danh-sach-text', selector: '#cart-small dd', mongDoi: ['600,000 VND', '-60,000 VND', '30,000 VND', '570,000 VND'] },
        { moTa: 'Big cart: free shipping after discount ≥ 1,000,000', kiem: 'danh-sach-text', selector: '#cart-big dd', mongDoi: ['1,250,000 VND', '-125,000 VND', 'Free', '1,125,000 VND'] },
        { an: true, moTa: 'Uses reduce', kiem: 'ma-nguon', khop: '\\.reduce\\(' },
      ],
    }),
    reactNho({
      tieuDe: 'find, some and every: class status panel',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['find', 'some', 'every', 'Math.max'], the: ['jsx', 'array-methods'],
      moTa: {
        en: '<p><code>ClassStatus</code> summarises a class: the top student (<code>find</code> the first with the highest score), a warning if <b>some</b> score is below 4, a banner if <b>every</b> student passed (≥ 5).</p>',
        vi: '<p><code>ClassStatus</code> tóm tắt một lớp: sinh viên cao điểm nhất (<code>find</code> người đầu tiên có điểm cao nhất), cảnh báo nếu <b>có</b> điểm dưới 4, băng chúc mừng nếu <b>mọi</b> sinh viên đều qua (≥ 5).</p>',
      },
      yeuCau: [
        { en: '<code>.top</code> ⇒ <code>Top: Binh (9.5)</code>.', vi: '<code>.top</code> ⇒ <code>Top: Binh (9.5)</code>.' },
        { en: '<code>.warning</code> "Some students are at risk" only when some score &lt; 4; <code>.all-passed</code> "Everyone passed!" only when every score ≥ 5.', vi: '<code>.warning</code> "Some students are at risk" chỉ khi có điểm &lt; 4; <code>.all-passed</code> "Everyone passed!" chỉ khi mọi điểm ≥ 5.' },
      ],
      viDu: [{ input: 'scores [6, 9.5, 3, 9.5]', output: 'Top: Binh (9.5) · warning shown · no banner', explanation: 'find returns the FIRST match (Binh, not the second 9.5).|||find trả phần tử khớp ĐẦU TIÊN (Binh, không phải người 9.5 thứ hai).' }],
      goiY: ['const best = Math.max(...students.map((s) => s.score)); const top = students.find((s) => s.score === best);', 'students.some((s) => s.score < 4) / students.every((s) => s.score >= 5).'],
      loiHayGap: ['Dùng <code>filter(...)[0]</code> thay cho <code>find</code> — chạy hết mảng, kém rõ ý.', '<code>every</code> trên mảng rỗng trả <code>true</code> — cẩn thận với lớp chưa có ai.'],
      thuatNgu: [{ en: 'some / every', vi: 'có ít nhất một / tất cả đều' }],
      giaiThich: '<p><code>find</code> dừng ở phần tử khớp đầu tiên; <code>some</code> dừng khi gặp một phần tử đúng; <code>every</code> dừng khi gặp một phần tử sai. Kết quả boolean của some/every hợp ngay với <code>&amp;&amp;</code> trong JSX (không có bẫy số 0).</p>',
      dau: `// src/App.js — STARTER
function ClassStatus({ students }) {
  // TODO: .top, .warning, .all-passed
  return <p>{students.length} students</p>;
}

export default function App() {
  const a = [{ id: 1, name: 'An', score: 6 }, { id: 2, name: 'Binh', score: 9.5 }, { id: 3, name: 'Cuong', score: 3 }, { id: 4, name: 'Dung', score: 9.5 }];
  const b = [{ id: 1, name: 'Em', score: 7 }, { id: 2, name: 'Giang', score: 5 }, { id: 3, name: 'Hoa', score: 8 }];
  return (
    <div>
      <section id="class-a"><ClassStatus students={a} /></section>
      <section id="class-b"><ClassStatus students={b} /></section>
    </div>
  );
}
`,
      giai: `// src/App.js — find / some / every trả kết quả sớm, đúng ý định
function ClassStatus({ students }) {
  const best = Math.max(...students.map((s) => s.score));
  const top = students.find((s) => s.score === best); // người ĐẦU TIÊN đạt điểm cao nhất
  const atRisk = students.some((s) => s.score < 4);
  const allPassed = students.every((s) => s.score >= 5);
  return (
    <div>
      <p className="top">Top: {top.name} ({top.score})</p>
      {atRisk && <p className="warning">Some students are at risk</p>}
      {allPassed && <p className="all-passed">Everyone passed!</p>}
    </div>
  );
}

export default function App() {
  const a = [{ id: 1, name: 'An', score: 6 }, { id: 2, name: 'Binh', score: 9.5 }, { id: 3, name: 'Cuong', score: 3 }, { id: 4, name: 'Dung', score: 9.5 }];
  const b = [{ id: 1, name: 'Em', score: 7 }, { id: 2, name: 'Giang', score: 5 }, { id: 3, name: 'Hoa', score: 8 }];
  return (
    <div>
      <section id="class-a"><ClassStatus students={a} /></section>
      <section id="class-b"><ClassStatus students={b} /></section>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Class A: top + warning, no banner', kiem: 'danh-sach-text', selector: '#class-a p', mongDoi: ['Top: Binh (9.5)', 'Some students are at risk'] },
        { moTa: 'Class B: top + banner, no warning', kiem: 'danh-sach-text', selector: '#class-b p', mongDoi: ['Top: Hoa (8)', 'Everyone passed!'] },
        { an: true, moTa: 'Uses find, some and every', kiem: 'ma-nguon', khop: '\\.find\\([\\s\\S]*\\.some\\([\\s\\S]*\\.every\\(|\\.find\\([\\s\\S]*\\.every\\([\\s\\S]*\\.some\\(' },
      ],
    }),
    reactNho({
      tieuDe: 'Group transactions by month',
      doKho: 'HARD', phut: 20,
      khaiNiem: ['reduce groupBy', 'Object.entries', 'sort', 'derived totals'], the: ['jsx', 'array-methods', 'reduce'],
      moTa: {
        en: '<p>Render a statement grouped by month (newest month first). Each month is a <code>section.month</code> with a heading showing income, expense and balance, then its transactions (newest date first).</p>',
        vi: '<p>Vẽ sao kê nhóm theo tháng (tháng mới nhất trước). Mỗi tháng là một <code>section.month</code> có tiêu đề ghi thu, chi và số dư, rồi các giao dịch (ngày mới nhất trước).</p>',
      },
      yeuCau: [
        { en: 'Heading <code>h3</code>: <code>2026-10 · +1,500,000 · -450,000 · balance 1,050,000</code>.', vi: 'Tiêu đề <code>h3</code>: <code>2026-10 · +1,500,000 · -450,000 · balance 1,050,000</code>.' },
        { en: 'Items <code>li.tx</code>: <code>05/10 Salary +1,500,000</code> / <code>03/10 Coffee -50,000</code> (dd/MM, sign by type).', vi: 'Dòng <code>li.tx</code>: <code>05/10 Salary +1,500,000</code> / <code>03/10 Coffee -50,000</code> (dd/MM, dấu theo loại).' },
      ],
      viDu: [{ input: "{ date: '2026-10-05', type: 'income', amount: 1500000, note: 'Salary' }", output: '05/10 Salary +1,500,000', explanation: "Month key = date.slice(0, 7).|||Khoá tháng = date.slice(0, 7)." }],
      goiY: ['const byMonth = TX.reduce((acc, t) => { const m = t.date.slice(0, 7); return { ...acc, [m]: [...(acc[m] ?? []), t] }; }, {});', 'Object.entries(byMonth).sort(([a], [b]) => b.localeCompare(a)) cho tháng mới trước; trong tháng sắp [...txs] theo date giảm dần.'],
      loiHayGap: ['Sắp tháng bằng <code>new Date(m)</code> với chuỗi "2026-10" — được nhưng thừa; chuỗi yyyy-mm so sánh trực tiếp là đủ.', 'Cộng chi tiêu vào tổng thu vì quên phân loại <code>type</code>.'],
      thuatNgu: [{ en: 'statement', vi: 'sao kê' }, { en: 'balance', vi: 'số dư' }, { en: 'income / expense', vi: 'thu / chi' }],
      giaiThich: '<p>Bước 1 <code>reduce</code> nhóm theo khoá tháng; bước 2 <code>Object.entries</code> + <code>sort</code> để có thứ tự; bước 3 với mỗi nhóm tính thu/chi bằng <code>filter</code> + <code>reduce</code>. Tất cả là dữ liệu suy ra, tính trong render.</p>',
      dau: `// src/App.js — STARTER
const TX = [
  { id: 1, date: '2026-09-28', type: 'expense', amount: 200000, note: 'Books' },
  { id: 2, date: '2026-10-03', type: 'expense', amount: 50000, note: 'Coffee' },
  { id: 3, date: '2026-10-05', type: 'income', amount: 1500000, note: 'Salary' },
  { id: 4, date: '2026-09-15', type: 'income', amount: 800000, note: 'Freelance' },
  { id: 5, date: '2026-10-20', type: 'expense', amount: 400000, note: 'Rent share' },
];

export default function App() {
  // TODO: section.month (tháng mới trước) — h3 tổng kết + li.tx
  return <h2>Statement</h2>;
}
`,
      giai: `// src/App.js — nhóm bằng reduce, sắp bằng Object.entries + sort, tổng bằng filter + reduce
const TX = [
  { id: 1, date: '2026-09-28', type: 'expense', amount: 200000, note: 'Books' },
  { id: 2, date: '2026-10-03', type: 'expense', amount: 50000, note: 'Coffee' },
  { id: 3, date: '2026-10-05', type: 'income', amount: 1500000, note: 'Salary' },
  { id: 4, date: '2026-09-15', type: 'income', amount: 800000, note: 'Freelance' },
  { id: 5, date: '2026-10-20', type: 'expense', amount: 400000, note: 'Rent share' },
];

const fmt = (n) => n.toLocaleString('en-US');
const sumOf = (list, type) => list.filter((t) => t.type === type).reduce((s, t) => s + t.amount, 0);

export default function App() {
  const byMonth = TX.reduce((acc, t) => {
    const m = t.date.slice(0, 7);
    return { ...acc, [m]: [...(acc[m] ?? []), t] };
  }, {});
  const months = Object.entries(byMonth).sort(([a], [b]) => b.localeCompare(a)); // "yyyy-mm" so chuỗi = so tháng

  return (
    <main>
      <h2>Statement</h2>
      {months.map(([month, txs]) => {
        const income = sumOf(txs, 'income');
        const expense = sumOf(txs, 'expense');
        const sorted = [...txs].sort((a, b) => b.date.localeCompare(a.date));
        return (
          <section key={month} className="month">
            <h3>{month} · +{fmt(income)} · -{fmt(expense)} · balance {fmt(income - expense)}</h3>
            <ul>
              {sorted.map((t) => (
                <li key={t.id} className="tx">
                  {t.date.slice(8, 10)}/{t.date.slice(5, 7)} {t.note} {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </main>
  );
}
`,
      kiem: [
        { moTa: 'Months newest first with totals', kiem: 'danh-sach-text', selector: '.month h3', mongDoi: ['2026-10 · +1,500,000 · -450,000 · balance 1,050,000', '2026-09 · +800,000 · -200,000 · balance 600,000'] },
        { moTa: 'October transactions newest first', kiem: 'danh-sach-text', selector: '.month:first-of-type .tx', mongDoi: ['20/10 Rent share -400,000', '05/10 Salary +1,500,000', '03/10 Coffee -50,000'] },
        { an: true, moTa: 'September transactions', kiem: 'danh-sach-text', selector: '.month:nth-of-type(2) .tx', mongDoi: ['28/09 Books -200,000', '15/09 Freelance +800,000'] },
      ],
    }),
  ],
});
