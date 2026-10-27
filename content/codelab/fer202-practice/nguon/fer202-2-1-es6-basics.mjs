/**
 * FER202 · 2.1 — let/const, arrow functions, template literals (bài luyện, máy chấm JS gọi hàm).
 * Dễ → khó: var trong vòng lặp → arrow → template literal → this trong callback → tham số mặc định/rest → closure.
 */
import { doiDau, jsNho, KHOA } from './_chung.mjs';

const VAR_BUG = `// main.js — STARTER: bug kinh điển của var trong vòng lặp
function makeCounters(n) {
  var fns = [];
  for (var i = 0; i < n; i++) {
    fns.push(function () {
      return i;
    });
  }
  return fns;
}
`;

export default doiDau({
  slug: 'fer202-2-1-es6-basics',
  ten: '2.1 let/const, arrow functions & template literals',
  khoa: KHOA,
  baiHoc: 'fer202-2-1-es6-basics',
  de: [
    jsNho({
      tieuDe: 'Fix the closure bug with let',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['let vs var', 'block scope', 'closure'], the: ['es6', 'let'],
      moTa: {
        en: '<p><code>makeCounters(n)</code> should return <code>n</code> functions; the <code>i</code>-th function returns <code>i</code>. With <code>var</code> every function returns <code>n</code>, because all of them share ONE variable. Rewrite it with block-scoped declarations.</p>',
        vi: '<p><code>makeCounters(n)</code> phải trả về <code>n</code> hàm; hàm thứ <code>i</code> trả về <code>i</code>. Với <code>var</code> mọi hàm đều trả <code>n</code>, vì chúng dùng chung MỘT biến. Hãy viết lại bằng khai báo phạm vi khối.</p>',
      },
      yeuCau: [
        { en: '<code>makeCounters(3).map((f) =&gt; f())</code> returns <code>[0, 1, 2]</code>.', vi: '<code>makeCounters(3).map((f) =&gt; f())</code> trả <code>[0, 1, 2]</code>.' },
        { en: 'No <code>var</code> anywhere: use <code>let</code> for the loop counter and <code>const</code> for the array.', vi: 'Không còn <code>var</code>: dùng <code>let</code> cho biến đếm và <code>const</code> cho mảng.' },
      ],
      viDu: [{ input: 'makeCounters(3).map((f) => f())', output: '[0, 1, 2]', explanation: 'With var: [3, 3, 3] — each closure reads the same i after the loop ended.|||Với var: [3, 3, 3] — mọi closure đọc cùng một i sau khi vòng lặp kết thúc.' }],
      goiY: ['let tạo một biến i MỚI cho mỗi vòng lặp — mỗi hàm "nhớ" biến của vòng của nó.', 'Chỉ cần đổi var thành let (vòng lặp) và const (mảng fns) — logic giữ nguyên.'],
      loiHayGap: ['Đổi <code>var fns</code> thành <code>const</code> nhưng vẫn để <code>var i</code> ⇒ vẫn [3, 3, 3].', 'Dùng <code>const i</code> trong <code>for (…; i++)</code> ⇒ TypeError: Assignment to constant variable.'],
      thuatNgu: [{ en: 'block scope', vi: 'phạm vi khối { … }' }, { en: 'closure', vi: 'hàm "nhớ" biến của nơi nó được tạo' }, { en: 'hoisting', vi: 'kéo khai báo var lên đầu hàm' }],
      giaiThich: '<p><code>var</code> có phạm vi HÀM: cả vòng lặp chỉ có một biến <code>i</code>, khi các hàm được gọi thì <code>i</code> đã là <code>n</code>. <code>let</code> có phạm vi KHỐI và vòng <code>for</code> tạo một bản <code>i</code> mới cho mỗi lần lặp, nên mỗi closure giữ đúng giá trị của nó. Đây cũng là lý do React khuyên <code>const</code>/<code>let</code>: phạm vi rõ ràng, ít bất ngờ.</p>',
      dau: VAR_BUG,
      giai: `// main.js — let tạo biến mới cho MỖI vòng lặp ⇒ mỗi closure nhớ đúng giá trị của nó
function makeCounters(n) {
  const fns = []; // const: không gán lại biến fns (vẫn push được — const ≠ bất biến)
  for (let i = 0; i < n; i++) {
    fns.push(() => i);
  }
  return fns;
}
`,
      kiem: [
        { moTa: 'makeCounters(3) ⇒ [0, 1, 2]', goi: 'makeCounters(3).map((f) => f())', mongDoi: [0, 1, 2] },
        { moTa: 'makeCounters(0) ⇒ []', goi: 'makeCounters(0)', mongDoi: [] },
        { moTa: 'No var in the code', kiem: 'ma-nguon', khop: '\\bvar\\s', phuDinh: true },
        { an: true, moTa: 'makeCounters(5) ⇒ [0..4]', goi: 'makeCounters(5).map((f) => f())', mongDoi: [0, 1, 2, 3, 4] },
      ],
    }),
    jsNho({
      tieuDe: 'Arrow functions with implicit return',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['arrow function', 'implicit return'], the: ['es6', 'arrow'],
      moTa: {
        en: '<p>Rewrite four helpers as <b>arrow functions</b> stored in <code>const</code>. Use the short form (implicit return) when the body is a single expression. <code>toUser</code> must return an object literal — wrap it in parentheses.</p>',
        vi: '<p>Viết lại bốn hàm dưới dạng <b>arrow function</b> gán vào <code>const</code>. Dùng dạng ngắn (trả về ngầm) khi thân hàm chỉ là một biểu thức. <code>toUser</code> trả về object literal — phải bọc trong ngoặc tròn.</p>',
      },
      yeuCau: [
        { en: '<code>double(n)</code>, <code>isEven(n)</code>, <code>squareAll(arr)</code> (uses <code>map</code>), <code>toUser(name, age)</code> ⇒ <code>{ name, age }</code>.', vi: '<code>double(n)</code>, <code>isEven(n)</code>, <code>squareAll(arr)</code> (dùng <code>map</code>), <code>toUser(name, age)</code> ⇒ <code>{ name, age }</code>.' },
        { en: 'No <code>function</code> keyword in the file.', vi: 'Không dùng từ khoá <code>function</code> trong tệp.' },
      ],
      viDu: [{ input: "toUser('An', 20)", output: "{ name: 'An', age: 20 }", explanation: '() => ({ … }) — without the parentheses the braces are read as a function body.|||() => ({ … }) — thiếu ngoặc tròn thì cặp { } bị hiểu là thân hàm.' }],
      goiY: ['const double = (n) => n * 2; — không cần return khi không có { }.', 'Trả object: const toUser = (name, age) => ({ name, age }); (shorthand property).'],
      loiHayGap: ['<code>(name, age) =&gt; { name, age }</code> ⇒ trả về undefined (dấu { } là thân hàm).', 'Viết <code>(n) =&gt; { n * 2 }</code> có ngoặc nhọn mà quên <code>return</code>.'],
      thuatNgu: [{ en: 'implicit return', vi: 'trả về ngầm (không viết return)' }, { en: 'shorthand property', vi: 'viết tắt { name } thay cho { name: name }' }],
      giaiThich: '<p>Arrow function không có thân <code>{ }</code> trả về luôn giá trị của biểu thức. Với object literal phải bọc ngoặc tròn để không bị hiểu nhầm là khối lệnh. Cách viết này là mặc định trong React: <code>items.map((x) =&gt; &lt;li …/&gt;)</code>, <code>onClick={() =&gt; …}</code>.</p>',
      dau: `// main.js — STARTER: viết lại bằng arrow function (const + =>)
function double(n) {
  return n * 2;
}
function isEven(n) {
  return n % 2 === 0;
}
function squareAll(arr) {
  const out = [];
  for (let i = 0; i < arr.length; i++) out.push(arr[i] * arr[i]);
  return out;
}
function toUser(name, age) {
  return { name: name, age: age };
}
`,
      giai: `// main.js — arrow function: ngắn gọn, trả về ngầm khi thân là MỘT biểu thức
const double = (n) => n * 2;
const isEven = (n) => n % 2 === 0;
const squareAll = (arr) => arr.map((x) => x * x); // map trả mảng MỚI, không sửa arr
// object literal phải bọc ( ) — nếu không { } bị hiểu là thân hàm
const toUser = (name, age) => ({ name, age });
`,
      kiem: [
        { moTa: 'double(21) = 42, isEven(7) = false', goi: '[double(21), isEven(7), isEven(10)]', mongDoi: [42, false, true] },
        { moTa: 'squareAll([1, 2, 3]) = [1, 4, 9]', goi: 'squareAll([1, 2, 3])', mongDoi: [1, 4, 9] },
        { moTa: "toUser('An', 20) returns an object", goi: "toUser('An', 20)", mongDoi: { name: 'An', age: 20 } },
        { moTa: 'No function keyword', kiem: 'ma-nguon', khop: '\\bfunction\\b', phuDinh: true },
        { an: true, moTa: 'squareAll does not change its input', chuanBi: 'const a = [2, 3]; squareAll(a);', goi: 'a', mongDoi: [2, 3] },
      ],
    }),
    jsNho({
      tieuDe: 'Template literals: build a receipt',
      doKho: 'EASY', phut: 12,
      khaiNiem: ['template literal', 'toLocaleString', 'join'], the: ['es6', 'template-literal'],
      moTa: {
        en: '<p>Build human-readable strings with <b>template literals</b> instead of <code>+</code> concatenation. <code>formatVnd(n)</code> formats money; <code>receipt(items)</code> returns a <b>multi-line</b> string (lines separated by <code>\\n</code>).</p>',
        vi: '<p>Dựng chuỗi dễ đọc bằng <b>template literal</b> thay vì nối bằng <code>+</code>. <code>formatVnd(n)</code> định dạng tiền; <code>receipt(items)</code> trả chuỗi <b>nhiều dòng</b> (các dòng cách nhau bằng <code>\\n</code>).</p>',
      },
      yeuCau: [
        { en: '<code>formatVnd(115000)</code> ⇒ <code>"115,000 VND"</code> (use <code>toLocaleString(\'en-US\')</code>).', vi: '<code>formatVnd(115000)</code> ⇒ <code>"115,000 VND"</code> (dùng <code>toLocaleString(\'en-US\')</code>).' },
        { en: '<code>receipt([{ name, price, qty }])</code>: first line <code>Receipt</code>, one line <code>- Coffee x2: 70,000 VND</code> per item, last line <code>Total: 115,000 VND</code>.', vi: '<code>receipt([{ name, price, qty }])</code>: dòng đầu <code>Receipt</code>, mỗi món một dòng <code>- Coffee x2: 70,000 VND</code>, dòng cuối <code>Total: 115,000 VND</code>.' },
        { en: 'No <code>+</code> string concatenation.', vi: 'Không nối chuỗi bằng <code>+</code>.' },
      ],
      viDu: [{ input: "receipt([{ name: 'Coffee', price: 35000, qty: 2 }, { name: 'Cake', price: 45000, qty: 1 }])", output: '"Receipt\\n- Coffee x2: 70,000 VND\\n- Cake x1: 45,000 VND\\nTotal: 115,000 VND"', explanation: 'Line total = price × qty.|||Thành tiền một dòng = price × qty.' }],
      goiY: ['const formatVnd = (n) => ´@{n.toLocaleString("en-US")} VND´.', 'Dựng mảng các dòng rồi .join("\\n"): ["Receipt", ...items.map(...), ´Total: …´].'],
      loiHayGap: ['Dùng dấu nháy đơn <code>\'Total: ${x}\'</code> ⇒ in nguyên chữ <code>${x}</code>; template literal phải dùng dấu huyền.', 'Thêm dấu cách/xuống dòng thừa khi viết template nhiều dòng trực tiếp ⇒ chuỗi lệch so với đề.'],
      thuatNgu: [{ en: 'template literal', vi: 'chuỗi trong dấu huyền ` ` có chèn ${…}' }, { en: 'concatenation', vi: 'nối chuỗi' }, { en: 'line break (\\n)', vi: 'ký tự xuống dòng' }],
      giaiThich: '<p>Template literal chèn biểu thức bằng <code>${…}</code> và đọc tự nhiên hơn nối <code>+</code>. Ghép nhiều dòng an toàn nhất là tạo mảng dòng rồi <code>join(\'\\n\')</code> — không lo thụt lề thừa. Trong React bạn dùng nó suốt: <code>className={´card @{active ? \'is-active\' : \'\'}´}</code>.</p>',
      dau: `// main.js — STARTER
function formatVnd(n) {
  return n + ' VND'; // TODO: "115,000 VND" bằng template literal
}

function receipt(items) {
  // TODO: "Receipt" / "- Coffee x2: 70,000 VND" / "Total: 115,000 VND" nối bằng "\\n"
  return '';
}
`,
      giai: `// main.js — template literal ´…@{biểu thức}…´ thay cho nối chuỗi bằng +
const formatVnd = (n) => ´@{n.toLocaleString('en-US')} VND´;

function receipt(items) {
  const lines = items.map((it) => ´- @{it.name} x@{it.qty}: @{formatVnd(it.price * it.qty)}´);
  const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  // gom dòng vào mảng rồi join: không lo thụt lề thừa như khi gõ template nhiều dòng
  return ['Receipt', ...lines, ´Total: @{formatVnd(total)}´].join('\\n');
}
`,
      kiem: [
        { moTa: 'formatVnd(115000)', goi: 'formatVnd(115000)', mongDoi: '115,000 VND' },
        { moTa: 'Receipt with two items', goi: "receipt([{ name: 'Coffee', price: 35000, qty: 2 }, { name: 'Cake', price: 45000, qty: 1 }])", mongDoi: 'Receipt\n- Coffee x2: 70,000 VND\n- Cake x1: 45,000 VND\nTotal: 115,000 VND' },
        { moTa: 'Empty receipt still has a total', goi: 'receipt([])', mongDoi: 'Receipt\nTotal: 0 VND' },
        { an: true, moTa: 'No + concatenation with strings', kiem: 'ma-nguon', khop: "['\"]\\s*\\+|\\+\\s*['\"]", phuDinh: true },
      ],
    }),
    jsNho({
      tieuDe: 'Arrow functions and this: a ticking timer',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['this', 'arrow function', 'setInterval', 'clearInterval'], the: ['es6', 'this'],
      moTa: {
        en: '<p><code>createTimer(limit)</code> returns an object whose <code>start()</code> adds 1 to <code>this.seconds</code> every second and stops by itself after <code>limit</code> ticks. The starter uses a normal <code>function</code> callback, so <code>this</code> is not the timer. Fix it with an arrow function (arrows take <code>this</code> from the surrounding method).</p>',
        vi: '<p><code>createTimer(limit)</code> trả về object có <code>start()</code> cộng 1 vào <code>this.seconds</code> mỗi giây và tự dừng sau <code>limit</code> lần. Starter dùng callback <code>function</code> thường nên <code>this</code> không phải timer. Sửa bằng arrow function (arrow lấy <code>this</code> của phương thức bao ngoài).</p>',
      },
      yeuCau: [
        { en: 'After <code>start()</code> and 3.5 s: <code>seconds</code> is 3 when <code>limit = 3</code>, and it stays 3 later (interval cleared).', vi: 'Sau <code>start()</code> và 3,5 giây: <code>seconds</code> = 3 khi <code>limit = 3</code>, và giữ 3 về sau (đã dừng interval).' },
        { en: '<code>stop()</code> stops early; calling <code>start()</code> twice must not double the speed.', vi: '<code>stop()</code> dừng sớm; gọi <code>start()</code> hai lần không được làm nhanh gấp đôi.' },
      ],
      viDu: [{ input: 'const t = createTimer(3); t.start(); /* wait 5 s */ t.seconds', output: '3', explanation: 'Ticks at 1 s, 2 s, 3 s, then clearInterval.|||Tăng ở giây 1, 2, 3 rồi clearInterval.' }],
      goiY: ['Trong start(): this.id = setInterval(() => { … this.seconds += 1 … }, 1000) — arrow giữ this của start().', 'Nếu đang chạy (this.id khác null) thì start() return ngay; đạt limit ⇒ this.stop().'],
      loiHayGap: ['<code>setInterval(function () { this.seconds++ })</code> ⇒ <code>this</code> là undefined (strict) / window ⇒ NaN hoặc lỗi.', 'Viết chính <code>start</code> bằng arrow (<code>start: () =&gt; {…}</code>) ⇒ <code>this</code> lại KHÔNG phải object.', 'Quên clearInterval ⇒ bộ đếm chạy mãi (rò rỉ, trong React là bug kinh điển của useEffect).'],
      thuatNgu: [{ en: 'lexical this', vi: 'this lấy từ phạm vi bao ngoài (arrow function)' }, { en: 'callback', vi: 'hàm truyền vào để được gọi sau' }, { en: 'interval', vi: 'lặp lại theo chu kỳ' }],
      giaiThich: '<p>Hàm thường xác định <code>this</code> theo CÁCH GỌI — <code>setInterval</code> gọi callback không gắn object nên <code>this</code> mất. Arrow function không có <code>this</code> riêng mà dùng <code>this</code> của nơi định nghĩa (phương thức <code>start</code>), nên <code>this.seconds</code> đúng là timer. Còn chính <code>start</code> phải là phương thức thường để <code>this</code> = object khi gọi <code>t.start()</code>.</p>',
      dau: `// main.js — STARTER: this bị mất trong callback
function createTimer(limit) {
  return {
    seconds: 0,
    id: null,
    start() {
      this.id = setInterval(function () {
        this.seconds += 1; // ⚠ this KHÔNG phải timer ở đây
      }, 1000);
    },
    stop() {
      clearInterval(this.id);
      this.id = null;
    },
  };
}
`,
      giai: `// main.js — arrow function lấy this của start() ⇒ this.seconds đúng là của timer
function createTimer(limit) {
  return {
    seconds: 0,
    id: null,
    start() {
      if (this.id !== null) return; // đang chạy ⇒ không tạo thêm interval
      this.id = setInterval(() => {
        this.seconds += 1;
        if (this.seconds >= limit) this.stop();
      }, 1000);
    },
    stop() {
      clearInterval(this.id);
      this.id = null;
    },
  };
}
`,
      kiem: [
        { moTa: '3 ticks then stops', chuanBi: 'const t = createTimer(3); t.start(); await new Promise((r) => setTimeout(r, 5000));', goi: 't.seconds', mongDoi: 3 },
        { moTa: 'After 1.5 s the timer shows 1', chuanBi: 'const t = createTimer(10); t.start(); await new Promise((r) => setTimeout(r, 1500));', goi: 't.seconds', mongDoi: 1 },
        { moTa: 'stop() stops early', chuanBi: 'const t = createTimer(10); t.start(); await new Promise((r) => setTimeout(r, 2500)); t.stop(); await new Promise((r) => setTimeout(r, 3000));', goi: 't.seconds', mongDoi: 2 },
        { an: true, moTa: 'start() twice does not double the speed', chuanBi: 'const t = createTimer(10); t.start(); t.start(); await new Promise((r) => setTimeout(r, 2500));', goi: 't.seconds', mongDoi: 2 },
      ],
    }),
    jsNho({
      tieuDe: 'Default and rest parameters',
      doKho: 'MEDIUM', phut: 10,
      khaiNiem: ['default parameters', 'rest parameters', 'undefined vs null'], the: ['es6', 'parameters'],
      moTa: {
        en: '<p><code>createUser(name, role, ...skills)</code> builds <code>{ name, role, skills }</code>. <code>role</code> defaults to <code>\'student\'</code>; all remaining arguments are collected into <code>skills</code>. Remember: a default applies only when the argument is <code>undefined</code> — <code>null</code> is a real value.</p>',
        vi: '<p><code>createUser(name, role, ...skills)</code> tạo <code>{ name, role, skills }</code>. <code>role</code> mặc định <code>\'student\'</code>; mọi đối số còn lại gom vào <code>skills</code>. Nhớ: giá trị mặc định chỉ áp khi đối số là <code>undefined</code> — <code>null</code> là một giá trị thật.</p>',
      },
      yeuCau: [
        { en: 'Use a default parameter and a rest parameter (no <code>arguments</code>, no <code>||</code>).', vi: 'Dùng tham số mặc định và rest parameter (không dùng <code>arguments</code>, không dùng <code>||</code>).' },
        { en: '<code>skills</code> is always an array (empty when none).', vi: '<code>skills</code> luôn là mảng (rỗng khi không có).' },
      ],
      viDu: [{ input: "createUser('An', undefined, 'React', 'Node')", output: "{ name: 'An', role: 'student', skills: ['React', 'Node'] }", explanation: 'undefined ⇒ default; null would stay null.|||undefined ⇒ dùng mặc định; null thì giữ null.' }],
      goiY: ['function createUser(name, role = "student", ...skills) { return { name, role, skills }; }', 'Rest parameter phải đứng CUỐI danh sách tham số.'],
      loiHayGap: ['Viết <code>role = role || \'student\'</code> ⇒ chuỗi rỗng <code>\'\'</code> cũng bị thay.', 'Dùng <code>arguments.slice</code> — arguments không phải mảng thật và không có trong arrow function.'],
      thuatNgu: [{ en: 'default parameter', vi: 'tham số mặc định' }, { en: 'rest parameter', vi: 'tham số gom phần còn lại thành mảng' }],
      giaiThich: '<p>Tham số mặc định chỉ kích hoạt khi giá trị là <code>undefined</code> (không truyền hoặc truyền <code>undefined</code>). Rest parameter gom mọi đối số còn lại thành một MẢNG thật — thay thế cho <code>arguments</code> cũ.</p>',
      dau: `// main.js — STARTER
function createUser(name, role) {
  // TODO: role mặc định 'student'; các đối số còn lại ⇒ skills (mảng)
  return { name, role };
}
`,
      giai: `// main.js — tham số mặc định (chỉ áp khi undefined) + rest parameter (mảng thật)
function createUser(name, role = 'student', ...skills) {
  return { name, role, skills };
}
`,
      kiem: [
        { moTa: 'Only a name', goi: "createUser('An')", mongDoi: { name: 'An', role: 'student', skills: [] } },
        { moTa: 'Role + skills', goi: "createUser('Binh', 'mentor', 'React', 'Redux')", mongDoi: { name: 'Binh', role: 'mentor', skills: ['React', 'Redux'] } },
        { moTa: 'undefined role ⇒ default, skills kept', goi: "createUser('An', undefined, 'React', 'Node')", mongDoi: { name: 'An', role: 'student', skills: ['React', 'Node'] } },
        { an: true, moTa: 'null is a real value (no default)', goi: "createUser('Cuong', null).role", mongDoi: null },
        { an: true, moTa: 'Uses default + rest syntax', kiem: 'ma-nguon', khop: "=\\s*['\"]student['\"][\\s\\S]*\\.\\.\\.skills" },
      ],
    }),
    jsNho({
      tieuDe: 'Closures: once and memoize',
      doKho: 'HARD', phut: 20,
      khaiNiem: ['closure', 'higher-order function', 'Map', 'cache'], the: ['es6', 'closure'],
      moTa: {
        en: '<p>Write two <b>higher-order functions</b> that remember data in a closure. <code>once(fn)</code> returns a function that calls <code>fn</code> only the first time and then always returns that first result. <code>memoize(fn)</code> returns a function that caches results by arguments (use a <code>Map</code>, key = <code>JSON.stringify(args)</code>).</p>',
        vi: '<p>Viết hai <b>hàm bậc cao</b> nhớ dữ liệu trong closure. <code>once(fn)</code> trả về hàm chỉ gọi <code>fn</code> lần đầu, các lần sau luôn trả kết quả lần đầu. <code>memoize(fn)</code> trả về hàm nhớ kết quả theo đối số (dùng <code>Map</code>, khoá = <code>JSON.stringify(args)</code>).</p>',
      },
      yeuCau: [
        { en: '<code>once</code>: <code>fn</code> runs at most once, even if it returns <code>undefined</code>.', vi: '<code>once</code>: <code>fn</code> chạy nhiều nhất một lần, kể cả khi nó trả <code>undefined</code>.' },
        { en: '<code>memoize</code>: same arguments ⇒ no new call; different arguments ⇒ computed and cached separately.', vi: '<code>memoize</code>: cùng đối số ⇒ không gọi lại; khác đối số ⇒ tính và lưu riêng.' },
      ],
      viDu: [{ input: 'const slowSquare = memoize((n) => { calls++; return n * n; }); slowSquare(4); slowSquare(4); slowSquare(5); calls', output: '2', explanation: '4 is cached; 5 is new.|||4 đã có trong cache; 5 là mới.' }],
      goiY: ['once: giữ hai biến trong closure — let done = false, result; lần đầu đặt done = true.', 'memoize: const cache = new Map(); return (...args) => { const key = JSON.stringify(args); if (cache.has(key)) return cache.get(key); … }.'],
      loiHayGap: ['Kiểm <code>if (result)</code> thay vì cờ <code>done</code> ⇒ fn trả 0/undefined thì bị gọi lại.', 'Đặt <code>cache</code> BÊN TRONG hàm trả về ⇒ mỗi lần gọi một cache mới, không nhớ gì.'],
      thuatNgu: [{ en: 'higher-order function', vi: 'hàm nhận hoặc trả về hàm' }, { en: 'memoize', vi: 'ghi nhớ kết quả để khỏi tính lại' }, { en: 'cache', vi: 'bộ nhớ đệm' }],
      giaiThich: '<p>Biến khai trong hàm ngoài (<code>done</code>, <code>result</code>, <code>cache</code>) sống tiếp nhờ closure của hàm được trả về — mỗi lần gọi <code>once(fn)</code> có bộ nhớ riêng. <code>Map</code> (ES6) có <code>has/get/set</code> rõ ràng. Đây chính là ý tưởng của <code>useMemo</code>/<code>React.memo</code> sau này: nhớ kết quả theo đầu vào.</p>',
      dau: `// main.js — STARTER
function once(fn) {
  // TODO
  return fn;
}

function memoize(fn) {
  // TODO
  return fn;
}
`,
      giai: `// main.js — closure: biến của hàm ngoài sống tiếp trong hàm được trả về
function once(fn) {
  let done = false; // dùng CỜ, không dựa vào giá trị result (fn có thể trả 0/undefined)
  let result;
  return (...args) => {
    if (!done) {
      done = true;
      result = fn(...args);
    }
    return result;
  };
}

function memoize(fn) {
  const cache = new Map(); // tạo MỘT lần cho mỗi hàm được memoize
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const value = fn(...args);
    cache.set(key, value);
    return value;
  };
}
`,
      kiem: [
        { moTa: 'once calls fn a single time', chuanBi: 'let n = 0; const init = once(() => ++n);', goi: '[init(), init(), init(), n]', mongDoi: [1, 1, 1, 1] },
        { moTa: 'memoize caches by arguments', chuanBi: 'let calls = 0; const sq = memoize((x) => { calls++; return x * x; });', goi: '[sq(4), sq(4), sq(5), calls]', mongDoi: [16, 16, 25, 2] },
        { moTa: 'memoize works with several arguments', chuanBi: 'let calls = 0; const add = memoize((a, b) => { calls++; return a + b; });', goi: '[add(1, 2), add(1, 2), add(2, 1), calls]', mongDoi: [3, 3, 3, 2] },
        { an: true, moTa: 'once remembers an undefined result', chuanBi: 'let n = 0; const f = once(() => { n++; });', goi: '[f(), f(), n]', mongDoi: [{ $js: 'undefined' }, { $js: 'undefined' }, 1] },
        { an: true, moTa: 'Each memoized function has its own cache', chuanBi: 'let a = 0; let b = 0; const f = memoize((x) => { a++; return x; }); const g = memoize((x) => { b++; return x; }); f(1); g(1); f(1); g(1);', goi: '[a, b]', mongDoi: [1, 1] },
      ],
    }),
  ],
});
