/**
 * FER202 · 2.2 — Destructuring, spread & modules (bài luyện; js + một bài ES module).
 * Dễ → khó: destructuring mảng → object (đổi tên, mặc định) → cập nhật bất biến kiểu React → rest trong object
 * → ES modules (named/default) → pipeline dữ liệu.
 */
import { doiDau, jsNho, KHOA, moduleNho } from './_chung.mjs';

export default doiDau({
  slug: 'fer202-2-2-destructuring-spread-modules',
  ten: '2.2 Destructuring, spread & modules',
  khoa: KHOA,
  baiHoc: 'fer202-2-2-destructuring-spread-modules',
  de: [
    jsNho({
      tieuDe: 'Array destructuring: swap, first and rest',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['array destructuring', 'rest element'], the: ['es6', 'destructuring'],
      moTa: {
        en: '<p>Use <b>array destructuring</b> — exactly what <code>const [count, setCount] = useState(0)</code> does in React.</p>',
        vi: '<p>Dùng <b>destructuring mảng</b> — đúng thứ <code>const [count, setCount] = useState(0)</code> làm trong React.</p>',
      },
      yeuCau: [
        { en: '<code>swap([a, b])</code> ⇒ <code>[b, a]</code>.', vi: '<code>swap([a, b])</code> ⇒ <code>[b, a]</code>.' },
        { en: '<code>firstAndRest(arr)</code> ⇒ <code>{ first, rest }</code> (rest element <code>...rest</code>).', vi: '<code>firstAndRest(arr)</code> ⇒ <code>{ first, rest }</code> (phần tử rest <code>...rest</code>).' },
        { en: '<code>parsePoint(\'10,20\')</code> ⇒ <code>{ x: 10, y: 20 }</code> (numbers).', vi: '<code>parsePoint(\'10,20\')</code> ⇒ <code>{ x: 10, y: 20 }</code> (kiểu số).' },
      ],
      viDu: [{ input: 'firstAndRest([5, 6, 7])', output: '{ first: 5, rest: [6, 7] }', explanation: 'const [first, ...rest] = arr|||const [first, ...rest] = arr' }],
      goiY: ['const swap = ([a, b]) => [b, a]; — destructuring ngay trong tham số.', "parsePoint: const [x, y] = s.split(',').map(Number);"],
      loiHayGap: ['Quên đổi sang số: <code>{ x: \'10\', y: \'20\' }</code>.', 'Đặt <code>...rest</code> ở giữa (<code>[...rest, last]</code>) ⇒ SyntaxError.'],
      thuatNgu: [{ en: 'destructuring', vi: 'tách giá trị ra biến' }, { en: 'rest element', vi: 'phần tử gom phần còn lại' }],
      giaiThich: '<p>Destructuring mảng lấy theo VỊ TRÍ: <code>[a, b]</code>. <code>...rest</code> gom phần còn lại thành mảng mới (phải đứng cuối). Đây là cú pháp của <code>useState</code>: phần tử 0 là giá trị, phần tử 1 là hàm đặt.</p>',
      dau: `// main.js — STARTER
function swap(pair) {
  // TODO
}
function firstAndRest(arr) {
  // TODO
}
function parsePoint(text) {
  // TODO
}
`,
      giai: `// main.js — destructuring mảng lấy theo VỊ TRÍ
const swap = ([a, b]) => [b, a];

function firstAndRest(arr) {
  const [first, ...rest] = arr; // ...rest phải đứng cuối
  return { first, rest };
}

function parsePoint(text) {
  const [x, y] = text.split(',').map(Number); // chuỗi ⇒ số
  return { x, y };
}
`,
      kiem: [
        { moTa: 'swap([1, 2])', goi: 'swap([1, 2])', mongDoi: [2, 1] },
        { moTa: 'firstAndRest([5, 6, 7])', goi: 'firstAndRest([5, 6, 7])', mongDoi: { first: 5, rest: [6, 7] } },
        { moTa: "parsePoint('10,20')", goi: "parsePoint('10,20')", mongDoi: { x: 10, y: 20 } },
        { an: true, moTa: 'firstAndRest([]) ⇒ first undefined, rest []', goi: 'firstAndRest([])', mongDoi: { first: { $js: 'undefined' }, rest: [] } },
      ],
    }),
    jsNho({
      tieuDe: 'Object destructuring with rename and defaults',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['object destructuring', 'rename', 'default value'], the: ['es6', 'destructuring'],
      moTa: {
        en: '<p>React components receive props as one object; you destructure it in the parameter list. Practise it: <code>describe(product)</code> reads <code>name</code> (renamed to <code>title</code>), <code>price</code> and <code>stock</code> (default <code>0</code>).</p>',
        vi: '<p>Component React nhận props là MỘT object; ta destructuring ngay ở tham số. Luyện: <code>describe(product)</code> đọc <code>name</code> (đổi tên thành <code>title</code>), <code>price</code> và <code>stock</code> (mặc định <code>0</code>).</p>',
      },
      yeuCau: [
        { en: 'Return <code>"Pen costs 5000 VND (12 in stock)"</code>; missing stock ⇒ <code>(0 in stock)</code>.', vi: 'Trả <code>"Pen costs 5000 VND (12 in stock)"</code>; thiếu stock ⇒ <code>(0 in stock)</code>.' },
        { en: 'Destructure in the parameter: <code>({ name: title, price, stock = 0 })</code>.', vi: 'Destructuring ở tham số: <code>({ name: title, price, stock = 0 })</code>.' },
      ],
      viDu: [{ input: "describe({ name: 'Pen', price: 5000 })", output: '"Pen costs 5000 VND (0 in stock)"', explanation: 'stock = 0 default.|||stock mặc định 0.' }],
      goiY: ['Cú pháp đổi tên: { name: title } nghĩa là "lấy name, đặt vào biến title".', 'Giá trị mặc định đặt sau: { stock = 0 }.'],
      loiHayGap: ['Viết <code>{ title: name }</code> (ngược chiều) ⇒ đọc thuộc tính title không có.', 'Mặc định chỉ áp với undefined — stock: null vẫn là null.'],
      thuatNgu: [{ en: 'rename', vi: 'đổi tên biến khi destructuring' }],
      giaiThich: '<p>Trong object destructuring, vế TRÁI dấu hai chấm là tên thuộc tính cần đọc, vế PHẢI là tên biến mới. Giá trị mặc định dùng <code>=</code>. React dùng y hệt: <code>function Card({ title, onClose = () =&gt; {} })</code>.</p>',
      dau: `// main.js — STARTER
function describe(product) {
  return product.name + ' costs ' + product.price + ' VND'; // TODO
}
`,
      giai: `// main.js — destructuring ngay ở tham số: đổi tên (name ⇒ title) + mặc định (stock = 0)
function describe({ name: title, price, stock = 0 }) {
  return ´@{title} costs @{price} VND (@{stock} in stock)´;
}
`,
      kiem: [
        { moTa: 'All fields', goi: "describe({ name: 'Pen', price: 5000, stock: 12 })", mongDoi: 'Pen costs 5000 VND (12 in stock)' },
        { moTa: 'Default stock', goi: "describe({ name: 'Ruler', price: 8000 })", mongDoi: 'Ruler costs 8000 VND (0 in stock)' },
        { moTa: 'Destructured in the parameter', kiem: 'ma-nguon', khop: 'describe\\(\\s*\\{\\s*name\\s*:\\s*title' },
      ],
    }),
    jsNho({
      tieuDe: 'Immutable updates with spread (React-style)',
      doKho: 'MEDIUM', phut: 18,
      khaiNiem: ['spread', 'immutable update', 'map', 'filter'], the: ['es6', 'spread', 'immutability'],
      moTa: {
        en: '<p>React only re-renders when it receives a <b>new</b> object/array. Write four cart helpers that never mutate their input and always return a new cart. Cart shape: <code>{ items: [{ id, qty }], coupon: null }</code>.</p>',
        vi: '<p>React chỉ vẽ lại khi nhận object/mảng <b>MỚI</b>. Viết bốn hàm giỏ hàng không bao giờ sửa dữ liệu vào và luôn trả về giỏ mới. Dạng giỏ: <code>{ items: [{ id, qty }], coupon: null }</code>.</p>',
      },
      yeuCau: [
        { en: '<code>addItem(cart, id)</code>: existing id ⇒ qty + 1, otherwise append <code>{ id, qty: 1 }</code>.', vi: '<code>addItem(cart, id)</code>: id đã có ⇒ qty + 1, chưa có ⇒ thêm <code>{ id, qty: 1 }</code> vào cuối.' },
        { en: '<code>removeItem(cart, id)</code>, <code>setQty(cart, id, qty)</code> (qty ≤ 0 ⇒ remove), <code>applyCoupon(cart, code)</code> (upper-case code).', vi: '<code>removeItem(cart, id)</code>, <code>setQty(cart, id, qty)</code> (qty ≤ 0 ⇒ bỏ), <code>applyCoupon(cart, code)</code> (mã viết hoa).' },
        { en: 'The input cart, its <code>items</code> array and its item objects must stay unchanged.', vi: 'Giỏ vào, mảng <code>items</code> và từng object món phải giữ nguyên.' },
      ],
      viDu: [{ input: 'addItem({ items: [{ id: 1, qty: 1 }], coupon: null }, 1)', output: '{ items: [{ id: 1, qty: 2 }], coupon: null }', explanation: 'A new cart, a new items array, a new item object.|||Giỏ mới, mảng items mới, object món mới.' }],
      goiY: ['Mẫu chung: return { ...cart, items: cart.items.map(…) } — spread object ngoài, map/filter mảng trong.', 'addItem: cart.items.some(i => i.id === id) ? map tăng qty : [...cart.items, { id, qty: 1 }].'],
      loiHayGap: ['<code>cart.items.push(…)</code> hoặc <code>item.qty++</code> ⇒ sửa dữ liệu cũ, React không thấy thay đổi.', '<code>{ ...cart }</code> rồi sửa <code>copy.items[0].qty</code> ⇒ spread chỉ sao chép NÔNG, items vẫn dùng chung.'],
      thuatNgu: [{ en: 'shallow copy', vi: 'sao chép nông (chỉ tầng ngoài)' }, { en: 'immutable', vi: 'bất biến' }],
      giaiThich: '<p>Spread <code>{ ...obj }</code> / <code>[...arr]</code> chỉ sao chép MỘT tầng, nên tầng nào thay đổi thì phải tạo mới tầng đó: giỏ mới → mảng <code>items</code> mới (<code>map</code>/<code>filter</code>/spread) → object món mới (<code>{ ...i, qty }</code>). Những món không đổi được giữ nguyên tham chiếu — rẻ và đúng ý React.</p>',
      dau: `// main.js — STARTER: các hàm đang SỬA giỏ cũ
function addItem(cart, id) {
  const found = cart.items.find((i) => i.id === id);
  if (found) found.qty += 1;
  else cart.items.push({ id, qty: 1 });
  return cart;
}
function removeItem(cart, id) {}
function setQty(cart, id, qty) {}
function applyCoupon(cart, code) {}
`,
      giai: `// main.js — mỗi tầng thay đổi đều được TẠO MỚI: giỏ → mảng items → object món
function addItem(cart, id) {
  const has = cart.items.some((i) => i.id === id);
  const items = has
    ? cart.items.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
    : [...cart.items, { id, qty: 1 }];
  return { ...cart, items };
}

const removeItem = (cart, id) => ({ ...cart, items: cart.items.filter((i) => i.id !== id) });

function setQty(cart, id, qty) {
  if (qty <= 0) return removeItem(cart, id);
  return { ...cart, items: cart.items.map((i) => (i.id === id ? { ...i, qty } : i)) };
}

const applyCoupon = (cart, code) => ({ ...cart, coupon: code.trim().toUpperCase() });
`,
      kiem: [
        { moTa: 'addItem: existing id ⇒ qty + 1', goi: 'addItem({ items: [{ id: 1, qty: 1 }], coupon: null }, 1)', mongDoi: { items: [{ id: 1, qty: 2 }], coupon: null } },
        { moTa: 'addItem: new id appended', goi: 'addItem({ items: [{ id: 1, qty: 1 }], coupon: null }, 2).items', mongDoi: [{ id: 1, qty: 1 }, { id: 2, qty: 1 }] },
        { moTa: 'Input cart is not mutated', chuanBi: 'const c = { items: [{ id: 1, qty: 1 }], coupon: null }; const n = addItem(c, 1);', goi: '[c.items[0].qty, c.items.length, n !== c, n.items !== c.items]', mongDoi: [1, 1, true, true] },
        { moTa: 'setQty 0 removes; applyCoupon upper-cases', goi: "applyCoupon(setQty({ items: [{ id: 1, qty: 3 }, { id: 2, qty: 1 }], coupon: null }, 1, 0), ' sale10 ')", mongDoi: { items: [{ id: 2, qty: 1 }], coupon: 'SALE10' } },
        { an: true, moTa: 'removeItem keeps other items by reference', chuanBi: 'const keep = { id: 2, qty: 5 }; const c = { items: [{ id: 1, qty: 1 }, keep], coupon: null }; const n = removeItem(c, 1);', goi: '[n.items[0] === keep, c.items.length]', mongDoi: [true, 2] },
        { an: true, moTa: 'setQty changes only that item', goi: 'setQty({ items: [{ id: 1, qty: 1 }, { id: 2, qty: 1 }], coupon: null }, 2, 7).items', mongDoi: [{ id: 1, qty: 1 }, { id: 2, qty: 7 }] },
      ],
    }),
    jsNho({
      tieuDe: 'Rest in objects: omit and pick',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['object rest', 'Object.entries', 'Object.fromEntries'], the: ['es6', 'rest'],
      moTa: {
        en: '<p>Hide sensitive fields before sending data to the UI. <code>withoutPassword(user)</code> uses object rest (<code>const { password, ...safe } = user</code>). Then generalise: <code>omit(obj, ...keys)</code> and <code>pick(obj, ...keys)</code> — both return a new object and never use <code>delete</code>.</p>',
        vi: '<p>Ẩn trường nhạy cảm trước khi đưa dữ liệu lên giao diện. <code>withoutPassword(user)</code> dùng object rest (<code>const { password, ...safe } = user</code>). Rồi tổng quát hoá: <code>omit(obj, ...keys)</code> và <code>pick(obj, ...keys)</code> — đều trả object mới và không dùng <code>delete</code>.</p>',
      },
      yeuCau: [
        { en: '<code>withoutPassword</code> with object rest.', vi: '<code>withoutPassword</code> dùng object rest.' },
        { en: '<code>omit</code> / <code>pick</code> with <code>Object.entries</code> + <code>filter</code> + <code>Object.fromEntries</code>; keys not present are ignored.', vi: '<code>omit</code> / <code>pick</code> bằng <code>Object.entries</code> + <code>filter</code> + <code>Object.fromEntries</code>; khoá không có thì bỏ qua.' },
      ],
      viDu: [{ input: "pick({ id: 1, name: 'An', role: 'admin' }, 'id', 'name', 'age')", output: "{ id: 1, name: 'An' }", explanation: "'age' is not in the object.|||'age' không có trong object." }],
      goiY: ['const { password, ...safe } = user; return safe;', 'omit: Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k))).'],
      loiHayGap: ['<code>delete user.password</code> ⇒ sửa object gốc (dữ liệu ở nơi khác cũng mất password).', 'pick tạo khoá <code>age: undefined</code> cho khoá không có.'],
      thuatNgu: [{ en: 'object rest', vi: 'gom các thuộc tính còn lại thành object mới' }],
      giaiThich: '<p>Object rest tạo object MỚI chứa các thuộc tính còn lại, rất hợp để "bỏ một trường". Với danh sách khoá động, chuyển object thành mảng cặp <code>[khoá, giá trị]</code>, lọc, rồi ghép lại — không đụng object gốc.</p>',
      dau: `// main.js — STARTER
function withoutPassword(user) {
  delete user.password; // ⚠ sửa object gốc
  return user;
}
function omit(obj, keys) {}
function pick(obj, keys) {}
`,
      giai: `// main.js — tạo object MỚI, không bao giờ delete trên object gốc
function withoutPassword(user) {
  const { password, ...safe } = user; // password bị "tách" ra, safe là phần còn lại
  return safe;
}

const omit = (obj, ...keys) => Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)));
const pick = (obj, ...keys) => Object.fromEntries(Object.entries(obj).filter(([k]) => keys.includes(k)));
`,
      kiem: [
        { moTa: 'withoutPassword hides password', goi: "withoutPassword({ id: 1, email: 'a@b.c', password: 'x' })", mongDoi: { id: 1, email: 'a@b.c' } },
        { moTa: 'Original user still has password', chuanBi: "const u = { id: 1, password: 'x' }; withoutPassword(u);", goi: 'u.password', mongDoi: 'x' },
        { moTa: 'omit several keys', goi: "omit({ a: 1, b: 2, c: 3 }, 'a', 'c')", mongDoi: { b: 2 } },
        { moTa: 'pick ignores unknown keys', goi: "pick({ id: 1, name: 'An', role: 'admin' }, 'id', 'name', 'age')", mongDoi: { id: 1, name: 'An' } },
        { an: true, moTa: 'No delete operator', kiem: 'ma-nguon', khop: '\\bdelete\\s', phuDinh: true },
      ],
    }),
    moduleNho({
      tieuDe: 'ES modules: named and default exports',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['export', 'import', 'named export', 'default export'], the: ['es6', 'modules'],
      moTa: {
        en: '<p>Every React file is an ES module. Split the code: <code>math.js</code> has <b>named</b> exports <code>sum</code> and <code>VAT_RATE</code>; <code>format.js</code> has a <b>default</b> export <code>formatMoney</code>; <code>cart.js</code> imports both and exports <code>cartTotal(items)</code>; <code>main.js</code> prints the total. (Graded on the web; the desktop app skips ES-module checks.)</p>',
        vi: '<p>Mỗi tệp React là một ES module. Tách mã: <code>math.js</code> có export <b>có tên</b> <code>sum</code> và <code>VAT_RATE</code>; <code>format.js</code> có export <b>mặc định</b> <code>formatMoney</code>; <code>cart.js</code> import cả hai và export <code>cartTotal(items)</code>; <code>main.js</code> in tổng. (Chấm trên web; app desktop bỏ qua kiểm ES module.)</p>',
      },
      yeuCau: [
        { en: '<code>math.js</code>: <code>export const VAT_RATE = 0.1</code>, <code>export function sum(list)</code>.', vi: '<code>math.js</code>: <code>export const VAT_RATE = 0.1</code>, <code>export function sum(list)</code>.' },
        { en: '<code>format.js</code>: <code>export default function formatMoney(n)</code> ⇒ <code>"110,000 VND"</code>.', vi: '<code>format.js</code>: <code>export default function formatMoney(n)</code> ⇒ <code>"110,000 VND"</code>.' },
        { en: '<code>cart.js</code>: <code>cartTotal(items)</code> = sum of price × qty, plus VAT, formatted. <code>main.js</code> logs <code>cartTotal([{ price: 50000, qty: 2 }])</code>.', vi: '<code>cart.js</code>: <code>cartTotal(items)</code> = tổng price × qty, cộng VAT, đã định dạng. <code>main.js</code> in <code>cartTotal([{ price: 50000, qty: 2 }])</code>.' },
      ],
      viDu: [{ input: 'cartTotal([{ price: 50000, qty: 2 }])', output: '"110,000 VND"', explanation: '100,000 + 10% VAT.|||100,000 + 10% VAT.' }],
      goiY: ["import formatMoney from './format.js'; (default — tên tuỳ đặt) và import { sum, VAT_RATE } from './math.js'; (named — đúng tên).", 'Trong trình duyệt, đường dẫn import phải có đuôi .js.'],
      loiHayGap: ["<code>import { formatMoney } from './format.js'</code> khi format.js dùng export default ⇒ SyntaxError: does not provide an export named.", "Thiếu đuôi: <code>from './math'</code> ⇒ trình duyệt không tìm thấy module (bundler như Vite thì tự thêm)."],
      thuatNgu: [{ en: 'named export', vi: 'export có tên — import đúng tên trong { }' }, { en: 'default export', vi: 'export mặc định — mỗi tệp tối đa một' }],
      giaiThich: '<p>Named export dùng khi một tệp chia sẻ nhiều thứ (import phải đúng tên, trong ngoặc nhọn). Default export dành cho "thứ chính" của tệp (mỗi component React thường là default export). Module chỉ chạy một lần và được cache, nên <code>VAT_RATE</code> là cùng một giá trị ở mọi nơi import.</p>',
      dau: {
        'main.js': `// main.js — STARTER
import { cartTotal } from './cart.js';
console.log(cartTotal([{ price: 50000, qty: 2 }]));
`,
        'math.js': `// math.js — STARTER: chưa export gì
const VAT_RATE = 0.1;
function sum(list) {
  return list.reduce((a, b) => a + b, 0);
}
`,
        'format.js': `// format.js — STARTER
function formatMoney(n) {
  return n + ' VND';
}
`,
        'cart.js': `// cart.js — STARTER
export function cartTotal(items) {
  // TODO: import sum, VAT_RATE, formatMoney và tính tổng
  return '';
}
`,
      },
      giai: {
        'main.js': `// main.js — điểm vào: import named export từ cart.js
import { cartTotal } from './cart.js';

console.log(cartTotal([{ price: 50000, qty: 2 }]));
`,
        'math.js': `// math.js — NAMED exports: một tệp chia sẻ nhiều thứ
export const VAT_RATE = 0.1;

export function sum(list) {
  return list.reduce((a, b) => a + b, 0);
}
`,
        'format.js': `// format.js — DEFAULT export: "thứ chính" của tệp (tên khi import do nơi dùng đặt)
export default function formatMoney(n) {
  return ´@{Math.round(n).toLocaleString('en-US')} VND´;
}
`,
        'cart.js': `// cart.js — import named (đúng tên, trong { }) và default (không ngoặc)
import formatMoney from './format.js';
import { sum, VAT_RATE } from './math.js';

export function cartTotal(items) {
  const subtotal = sum(items.map((it) => it.price * it.qty));
  return formatMoney(subtotal * (1 + VAT_RATE));
}
`,
      },
      kiem: [
        { moTa: 'main.js loads (imports match exports)', kiem: 'nap-duoc' },
        { moTa: 'main.js prints 110,000 VND', so: 'console', mongDoi: ['110,000 VND'] },
        { moTa: 'math.js exports exactly sum and VAT_RATE', goi: 'Object.keys(__module("./math.js")).sort()', mongDoi: ['VAT_RATE', 'sum'] },
        { moTa: 'format.js has only a default export', goi: 'Object.keys(__module("./format.js"))', mongDoi: ['default'] },
        { an: true, moTa: 'cartTotal works on an empty cart', goi: '__module("./cart.js").cartTotal([])', mongDoi: '0 VND' },
      ],
    }),
    jsNho({
      tieuDe: 'Data pipeline: revenue by category',
      doKho: 'HARD', phut: 20,
      khaiNiem: ['destructuring', 'filter', 'reduce', 'Object.entries', 'sort'], the: ['es6', 'array-methods'],
      moTa: {
        en: '<p>Combine everything: from a list of orders, compute the revenue of each category for <b>paid</b> orders only, and return a ranking <code>[{ category, revenue }]</code> sorted by revenue (highest first, ties by name A → Z). Each order: <code>{ id, status, lines: [{ category, price, qty }] }</code>.</p>',
        vi: '<p>Gộp mọi thứ: từ danh sách đơn, tính doanh thu từng danh mục CHỈ của đơn <b>paid</b>, trả bảng xếp hạng <code>[{ category, revenue }]</code> sắp theo doanh thu (cao trước, bằng nhau theo tên A → Z). Mỗi đơn: <code>{ id, status, lines: [{ category, price, qty }] }</code>.</p>',
      },
      yeuCau: [
        { en: '<code>revenueByCategory(orders)</code> — no <code>for</code> loops: <code>filter</code> → <code>flatMap</code> → <code>reduce</code> → <code>Object.entries</code> → <code>map</code> → <code>sort</code>.', vi: '<code>revenueByCategory(orders)</code> — không dùng vòng <code>for</code>: <code>filter</code> → <code>flatMap</code> → <code>reduce</code> → <code>Object.entries</code> → <code>map</code> → <code>sort</code>.' },
        { en: 'Orders with another status are ignored; empty input ⇒ <code>[]</code>.', vi: 'Đơn trạng thái khác bị bỏ qua; đầu vào rỗng ⇒ <code>[]</code>.' },
      ],
      viDu: [{ input: "revenueByCategory([{ id: 1, status: 'paid', lines: [{ category: 'Book', price: 100, qty: 2 }, { category: 'Pen', price: 10, qty: 5 }] }, { id: 2, status: 'cancelled', lines: [{ category: 'Book', price: 100, qty: 9 }] }])", output: "[{ category: 'Book', revenue: 200 }, { category: 'Pen', revenue: 50 }]", explanation: 'The cancelled order is ignored.|||Đơn cancelled bị bỏ qua.' }],
      goiY: ["orders.filter(o => o.status === 'paid').flatMap(o => o.lines) cho mảng phẳng các dòng.", 'reduce((acc, { category, price, qty }) => ({ ...acc, [category]: (acc[category] ?? 0) + price * qty }), {}) rồi Object.entries(…).map(([category, revenue]) => ({ category, revenue })).'],
      loiHayGap: ['Dùng <code>map</code> thay <code>flatMap</code> ⇒ mảng lồng mảng.', 'Sắp xếp chỉ theo doanh thu, quên tiêu chí phụ ⇒ thứ tự các danh mục bằng nhau không ổn định với yêu cầu.'],
      thuatNgu: [{ en: 'pipeline', vi: 'chuỗi biến đổi dữ liệu nối tiếp' }, { en: 'flatMap', vi: 'map rồi làm phẳng một tầng' }],
      giaiThich: '<p>Mỗi bước nhận mảng và trả mảng/obj mới: lọc đơn paid → làm phẳng các dòng → gộp theo danh mục bằng <code>reduce</code> → đổi object thành mảng xếp hạng → sắp xếp có tiêu chí phụ. Không biến nào bị gán lại, không dữ liệu nào bị sửa — đúng cách các selector React/Redux tính dữ liệu suy ra.</p>',
      dau: `// main.js — STARTER
function revenueByCategory(orders) {
  // TODO: filter paid → flatMap lines → reduce theo category → mảng { category, revenue } → sort
  return [];
}
`,
      giai: `// main.js — một chuỗi biến đổi, mỗi bước trả dữ liệu MỚI
function revenueByCategory(orders) {
  const totals = orders
    .filter((o) => o.status === 'paid')
    .flatMap((o) => o.lines)
    .reduce((acc, { category, price, qty }) => ({ ...acc, [category]: (acc[category] ?? 0) + price * qty }), {});
  return Object.entries(totals)
    .map(([category, revenue]) => ({ category, revenue }))
    .sort((a, b) => b.revenue - a.revenue || a.category.localeCompare(b.category));
}
`,
      kiem: [
        { moTa: 'Example from the statement', goi: "revenueByCategory([{ id: 1, status: 'paid', lines: [{ category: 'Book', price: 100, qty: 2 }, { category: 'Pen', price: 10, qty: 5 }] }, { id: 2, status: 'cancelled', lines: [{ category: 'Book', price: 100, qty: 9 }] }])", mongDoi: [{ category: 'Book', revenue: 200 }, { category: 'Pen', revenue: 50 }] },
        { moTa: 'Several paid orders are summed', goi: "revenueByCategory([{ id: 1, status: 'paid', lines: [{ category: 'Pen', price: 10, qty: 3 }] }, { id: 2, status: 'paid', lines: [{ category: 'Pen', price: 10, qty: 2 }, { category: 'Ink', price: 25, qty: 4 }] }])", mongDoi: [{ category: 'Ink', revenue: 100 }, { category: 'Pen', revenue: 50 }] },
        { moTa: 'Empty input', goi: 'revenueByCategory([])', mongDoi: [] },
        { an: true, moTa: 'Ties sorted by name', goi: "revenueByCategory([{ id: 1, status: 'paid', lines: [{ category: 'Zip', price: 5, qty: 2 }, { category: 'Art', price: 10, qty: 1 }] }])", mongDoi: [{ category: 'Art', revenue: 10 }, { category: 'Zip', revenue: 10 }] },
        { an: true, moTa: 'No for loops', kiem: 'ma-nguon', khop: '\\bfor\\s*\\(', phuDinh: true },
      ],
    }),
  ],
});
