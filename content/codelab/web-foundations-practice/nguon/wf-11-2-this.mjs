/** Bộ luyện bài 11.2 — this. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI". Máy chấm: realm mới mỗi kiểm, hẹn giờ GIẢ. */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 11.2 — this: bốn luật giải thích tất cả.</em> Lưu ý: máy chấm nạp <code>main.js</code> như script cổ điển; file bắt đầu bằng <code>\'use strict\'</code> để gọi trơn cho <code>this === undefined</code> giống module.</p>';

export default doiDau({
  slug: 'wf-11-2-this',
  ten: '11.2 this: bốn luật giải thích tất cả',
  baiHoc: 'Nền tảng Web — Bài 11.2 this',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'INTERMEDIATE',
  moTa: 'Mất this khi tách method, callback và bind, call/apply, arrow trong method, arrow làm method (bẫy), tự viết bind — 6 bài.',
  de: [
    {
      tieuDe: 'Giữ this khi chuyền method đi',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['this', 'bind'], tienQuyet: ['object', 'method'], the: ['javascript', 'this'],
      moTa: `${BAI}<p>${c('getGreeter(user)')} phải trả về một HÀM; gọi hàm đó (gọi trơn, không có dấu chấm) phải ra lời chào của đúng ${c('user')}. Code khởi đầu trả về ${c('user.greet')} trần nên ${c('this')} bị mất và ném TypeError.</p>`,
      yeuCau: [
        `${c('getGreeter(lan)()')} trả ${c('"Hi, I am Lan"')}.`,
        'Hàm trả về vẫn đúng khi được gán vào object khác hay đưa cho setTimeout.',
        `Không sửa method ${c('greet')}.`,
      ],
      dauVao: 'user: { name, greet() }.', dauRa: 'Hàm () => string.',
      rangBuoc: ['Không sửa object user.'],
      viDu: [{ input: 'getGreeter(makeUser("Lan"))()', output: '"Hi, I am Lan"', explanation: 'this vẫn là user dù gọi trơn.' }],
      goiY: ['Hai cách: user.greet.bind(user), hoặc () => user.greet().', 'return () => user.greet();'],
      khoiDau: { 'main.js': `'use strict';
// Bài 11.2 — giữ this
function makeUser(name) {
  return { name, greet() { return 'Hi, I am ' + this.name; } };
}

function getGreeter(user) {
  return user.greet;            // mất this khi bị gọi trơn
}
` },
      loiGiai: { 'main.js': `'use strict';
// Bài 11.2 — giữ this: bọc lời gọi để dấu chấm quay lại (hoặc dùng bind)
function makeUser(name) {
  return { name, greet() { return 'Hi, I am ' + this.name; } };
}

function getGreeter(user) {
  return () => user.greet();    // bên trong vẫn là user.greet() ⇒ luật 3: this = user
  // cách khác: return user.greet.bind(user);
}
` },
      giaiThich: `<p>${c('user.greet')} chỉ là cái hàm; ai gọi nó trơn thì ${c('this')} là ${c('undefined')} (strict). Bọc trong arrow ${c('() => user.greet()')} đặt lại dấu chấm vào lời gọi; ${c('bind')} tạo bản sao có ${c('this')} cố định. Cả hai đều qua bài.</p>`,
      loiHayGap: ['return user.greet() — trả chuỗi chứ không trả hàm.', 'return () => this.greet() — this ở đây là của getGreeter (undefined).'],
      thamKhao: 'https://javascript.info/bind',
      kiem: [
        { moTa: 'Returns a function|||Trả về một hàm', goi: 'typeof getGreeter(makeUser("Lan"))', mongDoi: 'function' },
        { moTa: 'Plain call keeps the user|||Gọi trơn vẫn đúng người', goi: 'getGreeter(makeUser("Lan"))()', mongDoi: 'Hi, I am Lan' },
        { moTa: 'Still correct on another object|||Vẫn đúng khi gắn lên object khác', chuanBi: 'const other = { name: "Minh", g: getGreeter(makeUser("An")) };', goi: 'other.g()', mongDoi: 'Hi, I am An' },
        { moTa: 'Hidden: works as a timer callback|||Ẩn: chạy đúng khi làm callback của hẹn giờ', an: true, chuanBi: 'let out = ""; setTimeout(() => { out = getGreeter(makeUser("Chi"))(); }, 10); await new Promise((r) => setTimeout(r, 20));', goi: 'out', mongDoi: 'Hi, I am Chi' },
      ],
    },
    {
      tieuDe: 'map(t.tick) làm sập — sửa callback',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['this', 'callback'], tienQuyet: ['class', 'map'], the: ['javascript', 'this'],
      moTa: `${BAI}<p>${c('tickTimes(timer, n)')} phải gọi ${c('timer.tick()')} đúng ${c('n')} lần và trả về mảng kết quả. Code khởi đầu viết ${c('Array.from({ length: n }).map(timer.tick)')} — đưa method làm callback nên ${c('this')} mất và sập. Sửa mà không đổi class ${c('Timer')}.</p>`,
      yeuCau: [
        `${c('tickTimes(new Timer("lap"), 3)')} là ${c('["lap 1", "lap 2", "lap 3"]')}.`,
        'Số tick được cộng dồn trên đúng timer đó.',
        `${c('tickTimes(t, 0)')} là mảng rỗng.`,
      ],
      dauVao: 'timer: Timer; n: số nguyên ≥ 0.', dauRa: 'Mảng chuỗi.',
      rangBuoc: ['Không sửa class Timer.'],
      viDu: [{ input: 'tickTimes(new Timer("lap"), 2)', output: '["lap 1", "lap 2"]', explanation: 'Mỗi lần tick tăng ticks.' }],
      goiY: ['map nhận một arrow bọc lời gọi.', 'return Array.from({ length: n }).map(() => timer.tick());'],
      khoiDau: { 'main.js': `'use strict';
// Bài 11.2 — callback làm mất this
class Timer {
  constructor(label) { this.label = label; this.ticks = 0; }
  tick() { this.ticks++; return this.label + ' ' + this.ticks; }
}

function tickTimes(timer, n) {
  return Array.from({ length: n }).map(timer.tick);
}
` },
      loiGiai: { 'main.js': `'use strict';
// Bài 11.2 — map gọi callback kiểu trơn ⇒ bọc lại để lời gọi có dấu chấm
class Timer {
  constructor(label) { this.label = label; this.ticks = 0; }
  tick() { this.ticks++; return this.label + ' ' + this.ticks; }
}

function tickTimes(timer, n) {
  return Array.from({ length: n }).map(() => timer.tick());   // this = timer
}
` },
      giaiThich: `<p>${c('map(timer.tick)')} trao cho ${c('map')} cái hàm trần; ${c('map')} gọi nó kiểu ${c('f(phầnTử, chỉSố, mảng)')} nên ${c('this')} là ${c('undefined')}. Arrow ${c('() => timer.tick()')} gọi lại với dấu chấm. ${c('timer.tick.bind(timer)')} cũng được.</p>`,
      loiHayGap: ['map(timer.tick())  — gọi tick một lần rồi đưa CHUỖI cho map.', 'Sửa class thành arrow field — đề cấm đổi class.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this#callbacks',
      kiem: [
        { moTa: 'Three ticks|||Ba lần tick', goi: 'tickTimes(new Timer("lap"), 3)', mongDoi: ['lap 1', 'lap 2', 'lap 3'] },
        { moTa: 'Ticks accumulate on the same timer|||Tick cộng dồn trên cùng timer', chuanBi: 'const t = new Timer("x"); tickTimes(t, 2); tickTimes(t, 1);', goi: 't.ticks', mongDoi: 3 },
        { moTa: 'n = 0 gives []|||n = 0 cho []', goi: 'tickTimes(new Timer("x"), 0)', mongDoi: [] },
        { moTa: 'Hidden: Timer class untouched|||Ẩn: class Timer giữ nguyên', an: true, kiem: 'ma-nguon', tep: 'main.js', khop: "tick\\(\\) \\{ this\\.ticks\\+\\+; return this\\.label \\+ ' ' \\+ this\\.ticks; \\}" },
      ],
    },
    {
      tieuDe: 'call, apply và bind',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['call', 'apply', 'bind'], tienQuyet: ['this'], the: ['javascript', 'this'],
      moTa: `${BAI}<p>Cho hàm ${c('introduce(greeting, punctuation)')} dùng ${c('this.name')}. Viết ba hàm: ${c('introCall(person, g, p)')} dùng ${c('call')}; ${c('introApply(person, args)')} dùng ${c('apply')} với mảng ${c('args')}; ${c('introBound(person, g)')} trả về HÀM đã ${c('bind')} sẵn ${c('this')} và greeting, chỉ còn chờ dấu câu.</p>`,
      yeuCau: [
        `${c('introCall(lan, "Hello", "!")')} là ${c('"Hello, I am Lan!"')}.`,
        `${c('introApply(lan, ["Hi", "."])')} là ${c('"Hi, I am Lan."')}.`,
        `${c('introBound(lan, "Hey")')} trả hàm; gắn nó lên object khác rồi gọi vẫn nói "Lan".`,
      ],
      dauVao: 'person: { name }; chuỗi.', dauRa: 'Chuỗi, hoặc một hàm (introBound).',
      rangBuoc: ['Dùng đúng call / apply / bind cho từng hàm.'],
      viDu: [{ input: 'introBound({ name: "Lan" }, "Hey")("?")', output: '"Hey, I am Lan?"', explanation: 'bind điền sẵn this và đối số đầu.' }],
      goiY: ['introduce.call(person, g, p) — introduce.apply(person, args)', 'return introduce.bind(person, g);'],
      khoiDau: { 'main.js': `'use strict';
// Bài 11.2 — call / apply / bind
function introduce(greeting, punctuation) {
  return greeting + ', I am ' + this.name + punctuation;
}

function introCall(person, g, p) {}
function introApply(person, args) {}
function introBound(person, g) {}
` },
      loiGiai: { 'main.js': `'use strict';
// Bài 11.2 — ba cách tự chọn this
function introduce(greeting, punctuation) {
  return greeting + ', I am ' + this.name + punctuation;
}

function introCall(person, g, p) {
  return introduce.call(person, g, p);       // chạy ngay, đối số lần lượt
}
function introApply(person, args) {
  return introduce.apply(person, args);      // chạy ngay, đối số là mảng
}
function introBound(person, g) {
  return introduce.bind(person, g);          // KHÔNG chạy: trả hàm mới, this + greeting cố định
}
` },
      giaiThich: `<p>${c('call')} và ${c('apply')} chạy hàm ngay với ${c('this')} bạn chọn — khác nhau ở cách đưa đối số. ${c('bind')} trả hàm mới; ${c('this')} của nó cố định vĩnh viễn (luật 2 thắng luật 3), nên gắn lên object khác cũng không đổi.</p>`,
      loiHayGap: ['introduce.call(person, args) với args là mảng — greeting thành cả mảng.', 'introBound gọi luôn hàm thay vì trả về.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind',
      kiem: [
        { moTa: 'call|||call', goi: 'introCall({ name: "Lan" }, "Hello", "!")', mongDoi: 'Hello, I am Lan!' },
        { moTa: 'apply with an array|||apply với mảng', goi: 'introApply({ name: "Lan" }, ["Hi", "."])', mongDoi: 'Hi, I am Lan.' },
        { moTa: 'bind returns a pre-filled function|||bind trả hàm đã điền sẵn', goi: 'introBound({ name: "Lan" }, "Hey")("?")', mongDoi: 'Hey, I am Lan?' },
        { moTa: 'A bound function ignores the new object|||Hàm đã bind bỏ qua object mới', chuanBi: 'const o = { name: "Minh", f: introBound({ name: "Lan" }, "Yo") };', goi: 'o.f("!")', mongDoi: 'Yo, I am Lan!' },
        { moTa: 'Uses call and apply|||Có dùng call và apply', kiem: 'ma-nguon', tep: 'main.js', khop: '\\.call\\([\\s\\S]*\\.apply\\(' },
      ],
    },
    {
      tieuDe: 'Arrow giữ this trong hẹn giờ',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['arrow function', 'setTimeout', 'this'], tienQuyet: ['setTimeout'], the: ['javascript', 'this', 'timer'],
      moTa: `${BAI}<p>Đồng hồ ${c('makeClock()')} có ${c('seconds')} và method ${c('startAfter(ms)')}: sau ${c('ms')} mili giây phải tăng ${c('seconds')} thêm 1 và gọi ${c('this.onTick(this.seconds)')} nếu có. Code khởi đầu dùng ${c('setTimeout(function () { … })')} nên ${c('this')} không phải đồng hồ. Máy chấm dùng đồng hồ GIẢ — không phải chờ thật.</p>`,
      yeuCau: [
        `Sau ${c('startAfter(100)')} và 100 ms, ${c('clock.seconds')} là 1.`,
        'Gọi startAfter hai lần ⇒ seconds là 2 sau khi cả hai hẹn giờ chạy.',
        `${c('onTick')} được gọi với số giây mới.`,
      ],
      dauVao: 'ms: số mili giây.', dauRa: 'Không trả về; đổi state của clock.',
      rangBuoc: ['Giữ startAfter là method (không biến thành arrow field).'],
      viDu: [{ input: 'c.startAfter(100); /* 100 ms sau */ c.seconds', output: '1', explanation: 'Callback arrow mượn this của startAfter.' }],
      goiY: ['Đổi function () { … } thành () => { … }.', 'setTimeout(() => { this.seconds++; if (this.onTick) this.onTick(this.seconds); }, ms);'],
      khoiDau: { 'main.js': `'use strict';
// Bài 11.2 — this trong hẹn giờ
function makeClock() {
  return {
    seconds: 0,
    onTick: null,
    startAfter(ms) {
      setTimeout(function () {
        this.seconds++;
        if (this.onTick) this.onTick(this.seconds);
      }, ms);
    },
  };
}
` },
      loiGiai: { 'main.js': `'use strict';
// Bài 11.2 — arrow không có this riêng ⇒ dùng this của startAfter (chính đồng hồ)
function makeClock() {
  return {
    seconds: 0,
    onTick: null,
    startAfter(ms) {
      setTimeout(() => {
        this.seconds++;                                   // this = clock vì ta gọi clock.startAfter()
        if (this.onTick) this.onTick(this.seconds);
      }, ms);
    },
  };
}
` },
      giaiThich: `<p>Hàm thường được trình duyệt/máy chấm gọi trơn khi hết giờ, nên có ${c('this')} riêng (không phải đồng hồ). Arrow không có ${c('this')}: nó dùng ${c('this')} của ${c('startAfter')}, mà ${c('startAfter')} được gọi bằng ${c('clock.startAfter()')} ⇒ đồng hồ.</p>`,
      loiHayGap: ['Đổi cả startAfter thành arrow — this của nó thành undefined.', 'Dùng biến toàn cục thay vì this.seconds.'],
      thamKhao: 'https://javascript.info/arrow-functions',
      kiem: [
        { moTa: 'One tick after 100 ms|||Một tick sau 100 ms', chuanBi: 'const c = makeClock(); c.startAfter(100); await new Promise((r) => setTimeout(r, 150));', goi: 'c.seconds', mongDoi: 1 },
        { moTa: 'Two timers ⇒ 2|||Hai hẹn giờ ⇒ 2', chuanBi: 'const c = makeClock(); c.startAfter(50); c.startAfter(80); await new Promise((r) => setTimeout(r, 100));', goi: 'c.seconds', mongDoi: 2 },
        { moTa: 'onTick receives the new value|||onTick nhận giá trị mới', chuanBi: 'const got = []; const c = makeClock(); c.onTick = (s) => got.push(s); c.startAfter(10); c.startAfter(20); await new Promise((r) => setTimeout(r, 30));', goi: 'got', mongDoi: [1, 2] },
        { moTa: 'Nothing happens before the delay|||Chưa tới giờ thì chưa đổi', chuanBi: 'const c = makeClock(); c.startAfter(100); await new Promise((r) => setTimeout(r, 50));', goi: 'c.seconds', mongDoi: 0 },
        { moTa: 'startAfter stays a method|||startAfter vẫn là method', kiem: 'ma-nguon', tep: 'main.js', khop: 'startAfter\\s*\\(ms\\)\\s*\\{' },
      ],
    },
    {
      tieuDe: 'Bẫy arrow làm method',
      doKho: 'MEDIUM', phut: 10,
      khaiNiem: ['arrow function', 'method shorthand'], tienQuyet: ['object'], the: ['javascript', 'this'],
      moTa: `${BAI}<p>Object ${c('shop')} viết các method bằng arrow nên ${c('this')} không phải shop. Sửa để ${c('shop.title()')} trả ${c('"CT Shop (3 items)"')}, ${c('shop.add("pen")')} thêm vào giỏ và trả số món, và ${c('shop.names()')} trả tên viết HOA — trong ${c('names')} có một callback cần ${c('this')}.</p>`,
      yeuCau: [
        `${c('shop.title()')} dùng ${c('this.name')} và số món hiện tại.`,
        `${c('shop.add(x)')} thêm vào ${c('this.items')} và trả độ dài mới.`,
        `${c('shop.names()')} trả mảng ${c('"<TÊN SHOP>: <món>"')} — callback trong map dùng ${c('this.name')}.`,
      ],
      dauVao: 'Không.', dauRa: 'Như mô tả.',
      rangBuoc: ['Giữ nguyên dữ liệu ban đầu của shop.'],
      viDu: [{ input: 'shop.names()', output: '["CT SHOP: book", …]', explanation: 'Callback arrow mượn this của names.' }],
      goiY: ['Method: title() { … } (không phải title: () => …).', 'names() { return this.items.map((x) => this.name.toUpperCase() + ": " + x); }'],
      khoiDau: { 'main.js': `'use strict';
// Bài 11.2 — arrow làm method (hỏng)
const shop = {
  name: 'CT Shop',
  items: ['book', 'pen', 'bag'],
  title: () => this.name + ' (' + this.items.length + ' items)',
  add: (item) => { this.items.push(item); return this.items.length; },
  names: () => this.items.map(function (x) { return this.name.toUpperCase() + ': ' + x; }),
};
` },
      loiGiai: { 'main.js': `'use strict';
// Bài 11.2 — method viết bằng cú pháp method; arrow chỉ dùng cho callback BÊN TRONG
const shop = {
  name: 'CT Shop',
  items: ['book', 'pen', 'bag'],
  title() {
    return this.name + ' (' + this.items.length + ' items)';   // luật 3: this = shop
  },
  add(item) {
    this.items.push(item);
    return this.items.length;
  },
  names() {
    return this.items.map((x) => this.name.toUpperCase() + ': ' + x);   // arrow mượn this của names
  },
};
` },
      giaiThich: `<p>Object literal không tạo ${c('this')}; arrow viết làm method nhìn ra cấp cao nhất của file (strict ⇒ ${c('undefined')}). Đổi thành cú pháp method để luật 3 áp dụng. Trong ${c('names')} ngược lại: callback phải là arrow để mượn ${c('this')} của method — một hàm thường ở đó lại mất ${c('this')}.</p>`,
      loiHayGap: ['Sửa title nhưng quên callback trong names.', 'Thay this bằng shop — chạy được nhưng không học được gì, và vỡ khi đổi tên biến.'],
      thamKhao: 'https://javascript.info/arrow-functions#arrow-functions-have-no-this',
      kiem: [
        { moTa: 'title() uses this|||title() dùng this', goi: 'shop.title()', mongDoi: 'CT Shop (3 items)' },
        { moTa: 'add() pushes and returns the length|||add() thêm và trả độ dài', goi: '[shop.add("cap"), shop.title()]', mongDoi: [4, 'CT Shop (4 items)'] },
        { moTa: 'names() callback keeps this|||callback trong names() giữ this', goi: 'shop.names()', mongDoi: ['CT SHOP: book', 'CT SHOP: pen', 'CT SHOP: bag'] },
        { moTa: 'Hidden: methods work on a copy with another name|||Ẩn: method chạy đúng trên bản sao có tên khác', an: true, chuanBi: 'const other = { ...shop, name: "B", items: ["x"] };', goi: 'other.title()', mongDoi: 'B (1 items)' },
        { moTa: 'No arrow methods left|||Không còn method viết bằng arrow', kiem: 'ma-nguon', tep: 'main.js', khop: '(title|add|names)\\s*:\\s*\\(', phuDinh: true },
      ],
    },
    {
      tieuDe: 'Tự viết bind',
      doKho: 'HARD', phut: 20,
      khaiNiem: ['bind', 'apply', 'closure', 'rest/spread'], tienQuyet: ['call/apply', 'closure'], the: ['javascript', 'this', 'phỏng vấn'],
      moTa: `${BAI}<p>Câu phỏng vấn kinh điển: viết ${c('myBind(fn, thisArg, ...preset)')} hoạt động như ${c('fn.bind(thisArg, ...preset)')} mà KHÔNG dùng ${c('.bind(')}. Hàm trả về nhận thêm đối số và nối sau ${c('preset')}; ${c('this')} luôn là ${c('thisArg')} dù hàm trả về được gọi kiểu method của object khác.</p>`,
      yeuCau: [
        `${c('myBind(f, obj)()')} chạy ${c('f')} với ${c('this === obj')}.`,
        'Đối số điền sẵn đứng trước đối số lúc gọi.',
        `Không dùng ${c('.bind(')}; giá trị trả về của ${c('fn')} được trả lại nguyên vẹn.`,
      ],
      dauVao: 'fn: hàm; thisArg: bất kỳ; preset: các đối số điền sẵn.', dauRa: 'Một hàm mới.',
      rangBuoc: ['Không dùng Function.prototype.bind.'],
      viDu: [{ input: 'myBind(function (a, b) { return this.x + a + b; }, { x: 1 }, 2)(3)', output: '6', explanation: 'this.x = 1, a = 2 (điền sẵn), b = 3.' }],
      goiY: ['Hàm trả về là một closure giữ fn, thisArg và preset.', 'return (...later) => fn.apply(thisArg, [...preset, ...later]);'],
      khoiDau: { 'main.js': `'use strict';
// Bài 11.2 — tự viết bind
function myBind(fn, thisArg, ...preset) {
  return fn;   // chưa gắn this, chưa điền sẵn gì
}
` },
      loiGiai: { 'main.js': `'use strict';
// Bài 11.2 — myBind: closure giữ fn, thisArg, preset; apply chọn this mỗi lần gọi
function myBind(fn, thisArg, ...preset) {
  return function bound(...later) {
    // bỏ qua this của lời gọi hiện tại — luôn dùng thisArg đã chốt
    return fn.apply(thisArg, [...preset, ...later]);
  };
}
` },
      giaiThich: `<p>${c('bind')} chẳng có gì thần bí: nó là một closure (bài 11.1) nhớ ${c('fn')}, ${c('thisArg')} và các đối số đầu, cộng một lần ${c('apply')} (luật 2) mỗi khi được gọi. Vì hàm trả về không dùng ${c('this')} của chính nó, gọi ${c('other.f()')} cũng không đổi được gì. (${c('bind')} thật còn xử lý trường hợp gọi bằng ${c('new')} — ngoài phạm vi bài này.)</p>`,
      loiHayGap: ['fn.call(thisArg, preset, later) — truyền hai MẢNG thay vì trải ra.', 'Quên return giá trị của fn.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply',
      kiem: [
        { moTa: 'this is thisArg|||this là thisArg', goi: 'myBind(function () { return this.name; }, { name: "Lan" })()', mongDoi: 'Lan' },
        { moTa: 'Preset arguments come first|||Đối số điền sẵn đứng trước', goi: 'myBind(function (a, b, c) { return [this.x, a, b, c]; }, { x: 0 }, 1, 2)(3)', mongDoi: [0, 1, 2, 3] },
        { moTa: 'Calling as another object\'s method does not change this|||Gọi như method của object khác không đổi this', chuanBi: 'const o = { name: "Minh", f: myBind(function () { return this.name; }, { name: "Lan" }) };', goi: 'o.f()', mongDoi: 'Lan' },
        { moTa: 'Return value is passed back|||Giá trị trả về được trả lại', goi: 'myBind((a, b) => a * b, null, 6)(7)', mongDoi: 42 },
        { moTa: 'Does not use .bind(|||Không dùng .bind(', kiem: 'ma-nguon', tep: 'main.js', khop: '\\.bind\\(', phuDinh: true },
        { moTa: 'Hidden: works with a class method|||Ẩn: chạy với method của class', an: true, chuanBi: 'class C { constructor() { this.v = 5; } get2(k) { return this.v * k; } } const c1 = new C(); const g = myBind(c1.get2, c1);', goi: 'g(3)', mongDoi: 15 },
      ],
    },
  ],
});
