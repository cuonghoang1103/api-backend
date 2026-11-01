/** Bộ luyện bài 11.3 — Prototype & class. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI". */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 11.3 — Prototype và class.</em> Máy chấm nạp <code>main.js</code> trong realm mới cho mỗi kiểm rồi dùng class/hàm của bạn.</p>';

export default doiDau({
  slug: 'wf-11-3-prototype-class',
  ten: '11.3 Prototype và class: object kế thừa thế nào',
  baiHoc: 'Nền tảng Web — Bài 11.3 Prototype và class',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'INTERMEDIATE',
  moTa: 'Class đầu tiên, Object.create và chuỗi prototype, giỏ hàng có #private + getter, lớp con với super, lớp lỗi riêng extends Error, tự viết new — 6 bài.',
  de: [
    {
      tieuDe: 'Class đầu tiên: hình chữ nhật',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['class', 'constructor', 'method'], tienQuyet: ['object', 'this'], the: ['javascript', 'class'],
      moTa: `${BAI}<p>Viết ${c('class Rectangle')}: constructor nhận ${c('width')}, ${c('height')}; method ${c('area()')}, ${c('perimeter()')}; và method ${c('scale(k)')} nhân cả hai cạnh với ${c('k')} rồi trả về ${c('this')} để nối chuỗi. Các method phải nằm trên prototype (dùng chung), không tạo lại cho từng hình.</p>`,
      yeuCau: [
        `${c('new Rectangle(3, 4).area()')} là 12, ${c('perimeter()')} là 14.`,
        `${c('new Rectangle(1, 2).scale(3).area()')} là 18.`,
        'Hai hình dùng chung một method area (a.area === b.area).',
      ],
      dauVao: 'width, height: số dương.', dauRa: 'Một thực thể Rectangle.',
      rangBuoc: ['Dùng cú pháp class.'],
      viDu: [{ input: 'new Rectangle(3, 4).perimeter()', output: '14', explanation: '2 × (3 + 4).' }],
      goiY: ['constructor(width, height) { this.width = width; this.height = height; }', 'scale(k) { this.width *= k; this.height *= k; return this; }'],
      khoiDau: { 'main.js': `// Bài 11.3 — class Rectangle
class Rectangle {
}
` },
      loiGiai: { 'main.js': `// Bài 11.3 — class Rectangle: dữ liệu trên từng thực thể, method trên prototype
class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
  area() { return this.width * this.height; }
  perimeter() { return 2 * (this.width + this.height); }
  scale(k) {
    this.width *= k;
    this.height *= k;
    return this;               // trả chính object ⇒ nối được .area()
  }
}
` },
      giaiThich: `<p>Thân class tách hai loại thành viên: dữ liệu gán vào ${c('this')} trong constructor (mỗi hình một bản) và method (một bản trên ${c('Rectangle.prototype')}). ${c('return this')} cho phép viết ${c('r.scale(3).area()')}.</p>`,
      loiHayGap: ['Viết area = () => … làm class field — mỗi hình một hàm, kiểm "dùng chung" trượt.', 'Quên return this trong scale.'],
      thamKhao: 'https://javascript.info/class',
      kiem: [
        { moTa: 'area and perimeter|||area và perimeter', goi: '[new Rectangle(3, 4).area(), new Rectangle(3, 4).perimeter()]', mongDoi: [12, 14] },
        { moTa: 'scale is chainable|||scale nối chuỗi được', goi: 'new Rectangle(1, 2).scale(3).area()', mongDoi: 18 },
        { moTa: 'Methods are shared on the prototype|||Method dùng chung trên prototype', goi: 'new Rectangle(1, 1).area === new Rectangle(2, 2).area && Object.hasOwn(Rectangle.prototype, "area")', mongDoi: true },
        { moTa: 'Hidden: instanceof|||Ẩn: instanceof', an: true, goi: 'new Rectangle(1, 1) instanceof Rectangle', mongDoi: true },
      ],
    },
    {
      tieuDe: 'Object.create và chuỗi prototype',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['prototype', 'Object.create', 'hasOwn'], tienQuyet: ['object'], the: ['javascript', 'prototype'],
      moTa: `${BAI}<p>Có sẵn object ${c('animal')}. Viết ${c('makeRabbit(name)')} trả về một object có prototype là ${c('animal')} (dùng ${c('Object.create')}), sở hữu riêng ${c('name')} và ${c('jumps: true')}. Rồi viết ${c('ownKeys(obj)')} trả các khoá RIÊNG đã sắp xếp, và ${c('canReach(obj, key)')} cho biết khoá có với tới được qua chuỗi không.</p>`,
      yeuCau: [
        `${c('Object.getPrototypeOf(makeRabbit("Thỏ")) === animal')}.`,
        `${c('makeRabbit("Thỏ").describe()')} dùng được method của animal.`,
        `${c('ownKeys')} chỉ trả khoá riêng; ${c('canReach')} xét cả chuỗi.`,
      ],
      dauVao: 'name: string; obj, key.', dauRa: 'Object; mảng khoá; boolean.',
      rangBuoc: ['Không chép thuộc tính của animal sang rabbit.'],
      viDu: [{ input: 'ownKeys(makeRabbit("Thỏ"))', output: '["jumps", "name"]', explanation: 'eats và describe là đi mượn.' }],
      goiY: ['const r = Object.create(animal); r.name = name; r.jumps = true; return r;', 'Object.keys(obj).sort() — key in obj.'],
      khoiDau: { 'main.js': `// Bài 11.3 — Object.create
const animal = {
  eats: true,
  describe() { return this.name + ' eats: ' + this.eats; },
};

function makeRabbit(name) {
  return { ...animal, name, jumps: true };   // sai: CHÉP chứ không nối prototype
}
function ownKeys(obj) {}
function canReach(obj, key) {}
` },
      loiGiai: { 'main.js': `// Bài 11.3 — nối prototype bằng Object.create, không chép
const animal = {
  eats: true,
  describe() { return this.name + ' eats: ' + this.eats; },
};

function makeRabbit(name) {
  const r = Object.create(animal);   // prototype của r là animal
  r.name = name;                     // thuộc tính RIÊNG
  r.jumps = true;
  return r;
}
function ownKeys(obj) {
  return Object.keys(obj).sort();    // chỉ khoá riêng, liệt kê được
}
function canReach(obj, key) {
  return key in obj;                 // in đi theo cả chuỗi prototype
}
` },
      giaiThich: `<p>Spread CHÉP thuộc tính của animal sang object mới — không có chuỗi nào cả, sửa animal sau đó rabbit không thấy. ${c('Object.create(animal)')} chỉ tạo LIÊN KẾT. ${c('Object.keys')} chỉ đọc thuộc tính riêng; ${c('in')} đi theo chuỗi.</p>`,
      loiHayGap: ['Dùng spread — kiểm getPrototypeOf trượt.', 'Dùng for…in để lấy khoá riêng — nó liệt kê cả khoá đi mượn.'],
      thamKhao: 'https://javascript.info/prototype-inheritance',
      kiem: [
        { moTa: 'Prototype is animal|||Prototype là animal', goi: 'Object.getPrototypeOf(makeRabbit("Thỏ")) === animal', mongDoi: true },
        { moTa: 'Borrowed method works|||Method đi mượn chạy được', goi: 'makeRabbit("Thỏ").describe()', mongDoi: 'Thỏ eats: true' },
        { moTa: 'ownKeys lists own keys only|||ownKeys chỉ liệt kê khoá riêng', goi: 'ownKeys(makeRabbit("Thỏ"))', mongDoi: ['jumps', 'name'] },
        { moTa: 'canReach follows the chain|||canReach đi theo chuỗi', goi: '[canReach(makeRabbit("A"), "eats"), canReach(makeRabbit("A"), "flies")]', mongDoi: [true, false] },
        { moTa: 'Hidden: later changes to animal are visible|||Ẩn: đổi animal sau đó vẫn thấy', an: true, chuanBi: 'const r = makeRabbit("A"); animal.eats = "carrots";', goi: 'r.describe()', mongDoi: 'A eats: carrots' },
      ],
    },
    {
      tieuDe: 'Giỏ hàng có dữ liệu riêng tư',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['#private', 'getter', 'RangeError'], tienQuyet: ['class'], the: ['javascript', 'class'],
      moTa: `${BAI}<p>Bài luyện trong bài học. Viết ${c('class Cart')} với mảng riêng tư ${c('#items')}; ${c('add(name, price, qty = 1)')} ném ${c('RangeError')} khi ${c('qty < 1')} và trả về ${c('this')}; getter ${c('total')}; getter ${c('count')} (tổng số lượng); ${c('clear()')}. Bên ngoài không được thấy danh sách món: ${c('Object.keys(cart)')} phải rỗng.</p>`,
      yeuCau: [
        `${c('new Cart().add("pen", 50000, 2).add("book", 100000).total')} là 200000.`,
        `${c('add("x", 1, 0)')} ném RangeError; ${c('count')} là tổng qty.`,
        `${c('Object.keys(cart)')} là ${c('[]')}; ${c('clear()')} đưa total về 0.`,
      ],
      dauVao: 'name: string; price: number; qty: số nguyên ≥ 1.', dauRa: 'Cart.',
      rangBuoc: ['Danh sách món phải là #private.'],
      viDu: [{ input: 'new Cart().add("a", 10, 3).count', output: '3', explanation: 'count cộng qty.' }],
      goiY: ['#items = []; add(...) { if (qty < 1) throw new RangeError("qty"); this.#items.push({ name, price, qty }); return this; }', 'get total() { return this.#items.reduce((s, i) => s + i.price * i.qty, 0); }'],
      khoiDau: { 'main.js': `// Bài 11.3 — Cart
class Cart {
  items = [];          // công khai — ai cũng sửa được
  add(name, price, qty = 1) {
    this.items.push({ name, price, qty });
  }
}
` },
      loiGiai: { 'main.js': `// Bài 11.3 — Cart: #items riêng tư, getter tính từ dữ liệu, add nối chuỗi được
class Cart {
  #items = [];                                   // chỉ code trong class đọc/ghi được

  add(name, price, qty = 1) {
    if (qty < 1) throw new RangeError('qty must be at least 1');
    this.#items.push({ name, price, qty });
    return this;                                 // cho phép .add(...).add(...)
  }
  get total() {
    return this.#items.reduce((sum, i) => sum + i.price * i.qty, 0);
  }
  get count() {
    return this.#items.reduce((sum, i) => sum + i.qty, 0);
  }
  clear() {
    this.#items = [];
  }
}
` },
      giaiThich: `<p>${c('#items')} không phải thuộc tính thường: ${c('Object.keys')}, ${c('JSON.stringify')} và code ngoài class đều không thấy. Getter cho người dùng đọc ${c('cart.total')} như một thuộc tính nhưng giá trị luôn được tính từ dữ liệu thật, không thể lệch.</p>`,
      loiHayGap: ['Lưu total thành một số rồi quên cập nhật khi clear().', 'Quên return this — chuỗi .add().add() sập.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties',
      kiem: [
        { moTa: 'Chained adds give the total|||Nối add cho đúng tổng', goi: 'new Cart().add("pen", 50000, 2).add("book", 100000).total', mongDoi: 200000 },
        { moTa: 'count sums the quantities|||count cộng số lượng', goi: 'new Cart().add("a", 10, 3).add("b", 1).count', mongDoi: 4 },
        { moTa: 'qty < 1 throws RangeError|||qty < 1 ném RangeError', goi: 'new Cart().add("x", 1, 0)', mongDoi: { loi: 'RangeError' } },
        { moTa: 'Items are private|||Danh sách món là riêng tư', goi: 'Object.keys(new Cart().add("a", 1))', mongDoi: [] },
        { moTa: 'clear() resets|||clear() đặt lại', chuanBi: 'const k = new Cart().add("a", 5, 2); k.clear();', goi: '[k.total, k.count]', mongDoi: [0, 0] },
      ],
    },
    {
      tieuDe: 'Lớp con VipCart dùng super',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['extends', 'super', 'override'], tienQuyet: ['class', 'getter'], the: ['javascript', 'class', 'kế thừa'],
      moTa: `${BAI}<p>${c('Cart')} đã có sẵn (giống bài trước). Viết ${c('class VipCart extends Cart')}: constructor nhận ${c('discount')} (mặc định 0.1) và PHẢI gọi ${c('super()')}; ghi đè getter ${c('total')} để trả tổng của cha nhân ${c('(1 - discount)')}, làm tròn bằng ${c('Math.round')} — dùng lại ${c('super.total')}, không tính lại từ đầu.</p>`,
      yeuCau: [
        `${c('new VipCart().add("pen", 50000, 2).add("book", 100000).total')} là 180000.`,
        `${c('new VipCart(0.25)')} giảm 25%; ${c('count')} và ${c('add')} kế thừa nguyên vẹn.`,
        `${c('vip instanceof Cart')} là true; lời giải dùng ${c('super.total')}.`,
      ],
      dauVao: 'discount: 0 … 1.', dauRa: 'VipCart.',
      rangBuoc: ['Không sửa class Cart.'],
      viDu: [{ input: 'new VipCart(0.5).add("a", 101).total', output: '51', explanation: 'Math.round(50.5) = 51.' }],
      goiY: ['constructor(discount = 0.1) { super(); this.discount = discount; }', 'get total() { return Math.round(super.total * (1 - this.discount)); }'],
      khoiDau: { 'main.js': `// Bài 11.3 — VipCart
class Cart {
  #items = [];
  add(name, price, qty = 1) {
    if (qty < 1) throw new RangeError('qty must be at least 1');
    this.#items.push({ name, price, qty });
    return this;
  }
  get total() { return this.#items.reduce((s, i) => s + i.price * i.qty, 0); }
  get count() { return this.#items.reduce((s, i) => s + i.qty, 0); }
}

class VipCart extends Cart {
}
` },
      loiGiai: { 'main.js': `// Bài 11.3 — VipCart: kế thừa mọi thứ, chỉ đổi cách tính total
class Cart {
  #items = [];
  add(name, price, qty = 1) {
    if (qty < 1) throw new RangeError('qty must be at least 1');
    this.#items.push({ name, price, qty });
    return this;
  }
  get total() { return this.#items.reduce((s, i) => s + i.price * i.qty, 0); }
  get count() { return this.#items.reduce((s, i) => s + i.qty, 0); }
}

class VipCart extends Cart {
  constructor(discount = 0.1) {
    super();                          // cha dựng object (và #items) trước
    this.discount = discount;
  }
  get total() {
    return Math.round(super.total * (1 - this.discount));   // dùng lại tổng của cha
  }
}
` },
      giaiThich: `<p>Lớp con không đọc được ${c('#items')} của cha (riêng tư thật sự là riêng của class khai báo nó) — nên đường duy nhất là ${c('super.total')}. Đây chính là lợi ích: VipCart không cần biết giỏ hàng lưu món thế nào. ${c('super()')} phải chạy trước ${c('this.discount = …')}.</p>`,
      loiHayGap: ['Gán this.discount trước super() — ReferenceError.', 'Cố đọc this.#items trong VipCart — SyntaxError.'],
      thamKhao: 'https://javascript.info/class-inheritance',
      kiem: [
        { moTa: 'Default 10% off|||Mặc định giảm 10%', goi: 'new VipCart().add("pen", 50000, 2).add("book", 100000).total', mongDoi: 180000 },
        { moTa: 'Custom discount + rounding|||Giảm tuỳ chọn + làm tròn', goi: '[new VipCart(0.25).add("a", 100).total, new VipCart(0.5).add("a", 101).total]', mongDoi: [75, 51] },
        { moTa: 'Inherits add/count and instanceof|||Kế thừa add/count và instanceof', chuanBi: 'const v = new VipCart().add("a", 1, 3);', goi: '[v.count, v instanceof Cart]', mongDoi: [3, true] },
        { moTa: 'Uses super.total|||Dùng super.total', kiem: 'ma-nguon', tep: 'main.js', khop: 'super\\.total' },
        { moTa: 'Hidden: plain Cart unchanged|||Ẩn: Cart thường không đổi', an: true, goi: 'new Cart().add("a", 100).total', mongDoi: 100 },
      ],
    },
    {
      tieuDe: 'Lớp lỗi riêng: ValidationError',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['extends Error', 'instanceof', 'try/catch'], tienQuyet: ['class', 'throw'], the: ['javascript', 'class', 'error'],
      moTa: `${BAI}<p>Ứng dụng thật hay kế thừa đúng một tầng từ ${c('Error')}. Viết ${c('class ValidationError extends Error')} có thêm thuộc tính ${c('field')} và ${c('name === "ValidationError"')}. Rồi viết ${c('validateAge(value)')}: không phải số nguyên ⇒ ném ${c('ValidationError')} với field ${c('"age"')}; ngoài 0–150 ⇒ cũng ném; hợp lệ ⇒ trả số. Cuối cùng ${c('safeAge(value)')} bắt riêng ValidationError và trả ${c('{ ok: false, field, message }')}, lỗi khác thì ném tiếp.</p>`,
      yeuCau: [
        `${c('validateAge("abc")')} ném ValidationError, ${c('instanceof Error')} vẫn đúng.`,
        `${c('err.field')} là ${c('"age"')}, ${c('err.name')} là ${c('"ValidationError"')}.`,
        `${c('safeAge(20)')} ⇒ ${c('{ ok: true, value: 20 }')}; ${c('safeAge(200)')} ⇒ ok false.`,
      ],
      dauVao: 'value: bất kỳ.', dauRa: 'number / object kết quả.',
      rangBuoc: ['safeAge chỉ nuốt ValidationError.'],
      viDu: [{ input: 'safeAge(-1)', output: '{ ok: false, field: "age", message: "age must be 0-150" }', explanation: 'Lỗi xác thực được đổi thành dữ liệu.' }],
      goiY: ['constructor(message, field) { super(message); this.name = "ValidationError"; this.field = field; }', 'catch (e) { if (e instanceof ValidationError) return {...}; throw e; }'],
      khoiDau: { 'main.js': `// Bài 11.3 — ValidationError
function validateAge(value) {
  if (!Number.isInteger(value)) throw new Error('age must be an integer');
  return value;
}
function safeAge(value) {}
` },
      loiGiai: { 'main.js': `// Bài 11.3 — một tầng kế thừa từ Error, có thêm dữ liệu riêng
class ValidationError extends Error {
  constructor(message, field) {
    super(message);                 // Error đặt message + stack
    this.name = 'ValidationError';  // console sẽ in "ValidationError: <message>"
    this.field = field;
  }
}

function validateAge(value) {
  if (!Number.isInteger(value)) throw new ValidationError('age must be an integer', 'age');
  if (value < 0 || value > 150) throw new ValidationError('age must be 0-150', 'age');
  return value;
}

function safeAge(value) {
  try {
    return { ok: true, value: validateAge(value) };
  } catch (e) {
    if (e instanceof ValidationError) return { ok: false, field: e.field, message: e.message };
    throw e;                        // lỗi lạ: đừng nuốt
  }
}
` },
      giaiThich: `<p>${c('extends Error')} cho bạn message, stack và ${c('instanceof Error')} miễn phí; thêm ${c('field')} để giao diện biết ô nào sai. ${c('instanceof ValidationError')} đi theo chuỗi prototype nên phân biệt được lỗi xác thực với lỗi lập trình — chỉ nuốt cái mình hiểu.</p>`,
      loiHayGap: ['Quên super(message) — ReferenceError khi gán this.name.', 'catch mọi lỗi và trả ok:false — che mất bug thật.'],
      thamKhao: 'https://javascript.info/custom-errors',
      kiem: [
        { moTa: 'Throws ValidationError|||Ném ValidationError', goi: 'validateAge("abc")', mongDoi: { loi: 'ValidationError', thongDiep: 'integer' } },
        { moTa: 'Is still an Error, with field|||Vẫn là Error, có field', chuanBi: 'let e; try { validateAge(1.5); } catch (x) { e = x; }', goi: '[e instanceof Error, e instanceof ValidationError, e.field, e.name]', mongDoi: [true, true, 'age', 'ValidationError'] },
        { moTa: 'Range check|||Kiểm khoảng', goi: 'validateAge(151)', mongDoi: { loi: 'ValidationError', thongDiep: '0-150' } },
        { moTa: 'safeAge turns errors into data|||safeAge đổi lỗi thành dữ liệu', goi: '[safeAge(20), safeAge(-1)]', mongDoi: [{ ok: true, value: 20 }, { ok: false, field: 'age', message: 'age must be 0-150' }] },
        { moTa: 'Hidden: other errors are re-thrown|||Ẩn: lỗi khác được ném tiếp', an: true, chuanBi: 'const goc = validateAge; validateAge = () => { throw new TypeError("boom"); };', goi: 'safeAge(1)', mongDoi: { loi: 'TypeError' } },
      ],
    },
    {
      tieuDe: 'Tự viết new',
      doKho: 'HARD', phut: 20,
      khaiNiem: ['new', 'Object.create', 'apply', 'prototype'], tienQuyet: ['constructor function', 'apply'], the: ['javascript', 'prototype', 'phỏng vấn'],
      moTa: `${BAI}<p>Câu phỏng vấn: "${c('new')} làm gì?". Viết ${c('fakeNew(Ctor, ...args)')} làm đúng việc của ${c('new Ctor(...args)')} với hàm constructor kiểu cũ: (1) tạo object nối tới ${c('Ctor.prototype')}, (2) chạy ${c('Ctor')} với ${c('this')} là object đó, (3) trả object — TRỪ KHI constructor tự trả về một object khác (khi đó trả object đó). Không dùng từ khoá ${c('new')} trong lời giải.</p>`,
      yeuCau: [
        `${c('fakeNew(User, "Lan").greet()')} là ${c('"Hi, Lan"')} và ${c('instanceof User')} đúng.`,
        'Constructor trả object ⇒ fakeNew trả object đó; trả số/chuỗi ⇒ bị bỏ qua.',
        `Không có từ khoá ${c('new')} trong main.js.`,
      ],
      dauVao: 'Ctor: hàm constructor; args.', dauRa: 'Object.',
      rangBuoc: ['Không dùng new, không dùng Reflect.construct.'],
      viDu: [{ input: 'fakeNew(User, "Lan").name', output: '"Lan"', explanation: 'Constructor gán this.name.' }],
      goiY: ['const obj = Object.create(Ctor.prototype); const r = Ctor.apply(obj, args);', 'return (typeof r === "object" && r !== null) || typeof r === "function" ? r : obj;'],
      khoiDau: { 'main.js': `// Bài 11.3 — fakeNew
function User(name) { this.name = name; }
User.prototype.greet = function () { return 'Hi, ' + this.name; };

function fakeNew(Ctor, ...args) {
  const obj = {};
  Ctor.apply(obj, args);
  return obj;            // thiếu liên kết prototype
}
` },
      loiGiai: { 'main.js': `// Bài 11.3 — fakeNew: ba bước của new, viết tay
function User(name) { this.name = name; }
User.prototype.greet = function () { return 'Hi, ' + this.name; };

function fakeNew(Ctor, ...args) {
  const obj = Object.create(Ctor.prototype);        // 1. object mới nối tới prototype
  const result = Ctor.apply(obj, args);             // 2. chạy constructor với this = obj
  const laObject = (typeof result === 'object' && result !== null) || typeof result === 'function';
  return laObject ? result : obj;                   // 3. constructor trả object thì ưu tiên nó
}
` },
      giaiThich: `<p>Thiếu bước 1 thì object không có ${c('greet')} và ${c('instanceof')} sai — vì ${c('instanceof')} chỉ là đi theo chuỗi prototype. Bước 3 khớp đặc tả: constructor trả giá trị nguyên thuỷ thì bị bỏ qua, trả object (hoặc hàm) thì thay thế object mới.</p>`,
      loiHayGap: ['Trả result luôn — constructor bình thường trả undefined.', 'typeof null === "object" — quên loại null.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new#description',
      kiem: [
        { moTa: 'Prototype link: greet works|||Có liên kết prototype: greet chạy', goi: 'fakeNew(User, "Lan").greet()', mongDoi: 'Hi, Lan' },
        { moTa: 'instanceof is true|||instanceof đúng', goi: 'fakeNew(User, "A") instanceof User', mongDoi: true },
        { moTa: 'A returned object wins|||Constructor trả object thì thắng', goi: 'fakeNew(function () { this.a = 1; return { b: 2 }; })', mongDoi: { b: 2 } },
        { moTa: 'A returned primitive is ignored|||Constructor trả giá trị nguyên thuỷ bị bỏ qua', goi: 'fakeNew(function () { this.a = 1; return 5; })', mongDoi: { a: 1 } },
        { moTa: 'No new keyword|||Không có từ khoá new', kiem: 'ma-nguon', tep: 'main.js', khop: '\\bnew\\b', phuDinh: true },
        { moTa: 'Hidden: null return is ignored|||Ẩn: trả null bị bỏ qua', an: true, goi: 'fakeNew(function (x) { this.x = x; return null; }, 9).x', mongDoi: 9 },
      ],
    },
  ],
});
