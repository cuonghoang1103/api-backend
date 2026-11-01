/** Bộ luyện bài 11.1 — Closure. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI" (01/11/2026). */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 11.1 — Closure: hàm nhớ được nơi nó sinh ra.</em> Máy chấm nạp <code>main.js</code> như một script cổ điển trong một realm mới cho MỖI kiểm, rồi gọi hàm của bạn.</p>';

export default doiDau({
  slug: 'wf-11-1-closure',
  ten: '11.1 Closure: hàm nhớ được nơi nó sinh ra',
  baiHoc: 'Nền tảng Web — Bài 11.1 Closure',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'INTERMEDIATE',
  moTa: 'Bộ đếm riêng tư, hàm nhà máy, bộ giới hạn lượt gọi, bẫy var trong vòng lặp, once và memoize — 6 bài, mỗi lần kiểm chạy trong realm mới.',
  de: [
    /* ───────────── 1 · EASY ───────────── */
    {
      tieuDe: 'Bộ đếm riêng của mỗi người',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['closure', 'phạm vi hàm'], tienQuyet: ['hàm', 'let'], the: ['javascript', 'closure'],
      moTa: `${BAI}<p>Code khởi đầu dùng MỘT biến <code>count</code> toàn cục, nên hai bộ đếm tạo bởi ${c('makeCounter()')} giẫm lên nhau: đếm ở bộ này làm bộ kia nhảy số. Hãy sửa để mỗi lần gọi ${c('makeCounter()')} tạo ra một bộ đếm có biến riêng, không ai ở ngoài đọc hay ghi được.</p>`,
      yeuCau: [
        `${c('makeCounter()')} trả về một hàm; mỗi lần gọi hàm đó trả 1, 2, 3, …`,
        'Hai bộ đếm không dùng chung số.',
        `Không còn biến ${c('count')} ở cấp cao nhất của file.`,
      ],
      dauVao: 'Không có.', dauRa: 'Một hàm () => number.',
      rangBuoc: ['Không dùng biến toàn cục để lưu số đếm.'],
      viDu: [{ input: 'const a = makeCounter(); a(); a(); a()', output: '3', explanation: 'Lần gọi thứ ba của cùng một bộ đếm.' },
        { input: 'const b = makeCounter(); b()', output: '1', explanation: 'Bộ đếm mới bắt đầu lại từ 1.' }],
      goiY: ['Biến đếm phải sinh ra MỖI lần makeCounter chạy — tức là nằm bên trong makeCounter.', 'function makeCounter() { let count = 0; return () => { count++; return count; }; }'],
      khoiDau: { 'main.js': `// Bài 11.1 — bộ đếm (đang hỏng: hai bộ đếm dùng chung một biến)
let count = 0;

function makeCounter() {
  return function () {
    count = count + 1;
    return count;
  };
}
` },
      loiGiai: { 'main.js': `// Bài 11.1 — bộ đếm riêng: mỗi lần gọi makeCounter tạo một biến count MỚI
function makeCounter() {
  let count = 0;                 // sống trong phạm vi của lần gọi này
  return function () {
    count = count + 1;           // closure: vẫn với tới count sau khi makeCounter đã return
    return count;
  };
}
` },
      giaiThich: `<p>Mỗi lần ${c('makeCounter()')} chạy, JavaScript tạo một phạm vi mới chứa một ${c('count')} mới. Hàm trả về mang theo phạm vi đó (closure), nên hai bộ đếm có hai biến khác nhau. Bên ngoài không có tên nào trỏ tới ${c('count')} — muốn đổi số chỉ có cách gọi hàm.</p>`,
      loiHayGap: ['Để let count = 0 ở ngoài hàm — mọi bộ đếm dùng chung.', 'Đặt let count = 0 BÊN TRONG hàm được trả về — mỗi lần gọi lại về 0, luôn trả 1.'],
      thamKhao: 'https://javascript.info/closure',
      kiem: [
        { moTa: 'Three calls return 1, 2, 3|||Ba lần gọi trả 1, 2, 3', chuanBi: 'const a = makeCounter();', goi: '[a(), a(), a()]', mongDoi: [1, 2, 3] },
        { moTa: 'Two counters are independent|||Hai bộ đếm độc lập', chuanBi: 'const a = makeCounter(); const b = makeCounter(); a(); a(); a();', goi: '[a(), b()]', mongDoi: [4, 1] },
        { moTa: 'No global count variable|||Không có biến count toàn cục', goi: 'typeof count', mongDoi: 'undefined' },
        { moTa: 'A new counter after many calls still starts at 1|||Bộ đếm mới tạo sau nhiều lần gọi vẫn bắt đầu từ 1', an: true, chuanBi: 'const a = makeCounter(); for (let i = 0; i < 50; i++) a();', goi: 'makeCounter()()', mongDoi: 1 },
      ],
    },
    /* ───────────── 2 · EASY ───────────── */
    {
      tieuDe: 'Hàm nhà máy: nhân và chào',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['factory function', 'closure'], tienQuyet: ['arrow function'], the: ['javascript', 'closure'],
      moTa: `${BAI}<p>Một <strong>hàm nhà máy</strong> nhận cấu hình rồi trả về một hàm đã "nướng sẵn" cấu hình đó. Viết hai hàm: ${c('multiplyBy(factor)')} trả về hàm nhân một số với ${c('factor')}; ${c('makeGreeter(greeting)')} trả về hàm nhận một tên và trả chuỗi ${c('"<greeting>, <tên>!"')}.</p>`,
      yeuCau: [
        `${c('multiplyBy(3)(5)')} là 15; các hàm tạo ra không ảnh hưởng lẫn nhau.`,
        `${c('makeGreeter("Xin chào")("Lan")')} là ${c('"Xin chào, Lan!"')}.`,
        'Hàm trả về đúng là một hàm (typeof === "function").',
      ],
      dauVao: 'factor: number; greeting: string.', dauRa: 'Một hàm.',
      rangBuoc: ['Không dùng biến toàn cục để giữ factor hay greeting.'],
      viDu: [{ input: 'const double = multiplyBy(2); double(21)', output: '42', explanation: 'factor = 2 được bắt giữ.' },
        { input: 'makeGreeter("Hello")("An")', output: '"Hello, An!"', explanation: 'Ghép greeting, dấu phẩy, tên, dấu chấm than.' }],
      goiY: ['return (n) => n * factor;', 'return (name) => greeting + ", " + name + "!";'],
      khoiDau: { 'main.js': `// Bài 11.1 — hàm nhà máy
function multiplyBy(factor) {
  // trả về một hàm nhân với factor
}

function makeGreeter(greeting) {
  // trả về một hàm nhận name
}
` },
      loiGiai: { 'main.js': `// Bài 11.1 — hàm nhà máy: cấu hình được bắt giữ một lần, dùng ở mọi lần gọi
function multiplyBy(factor) {
  return (n) => n * factor;                       // factor nằm trong "ba lô" của hàm trả về
}

function makeGreeter(greeting) {
  return (name) => greeting + ', ' + name + '!';  // mỗi greeter nhớ greeting riêng
}
` },
      giaiThich: `<p>Hàm trả về được tạo bên trong ${c('multiplyBy')}, nên nó nhìn thấy ${c('factor')} của đúng lần gọi đó. ${c('multiplyBy(2)')} và ${c('multiplyBy(3)')} là hai lần gọi ⇒ hai closure với hai giá trị factor khác nhau.</p>`,
      loiHayGap: ['Trả về n * factor (một con số) thay vì một hàm.', 'Quên dấu cách sau dấu phẩy trong lời chào.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures',
      kiem: [
        { moTa: 'multiplyBy(3)(5) is 15|||multiplyBy(3)(5) bằng 15', goi: 'multiplyBy(3)(5)', mongDoi: 15 },
        { moTa: 'Two factories do not interfere|||Hai hàm tạo ra không ảnh hưởng nhau', chuanBi: 'const d = multiplyBy(2); const t = multiplyBy(3);', goi: '[d(10), t(10), d(1)]', mongDoi: [20, 30, 2] },
        { moTa: 'makeGreeter builds the greeting|||makeGreeter ghép đúng lời chào', goi: 'makeGreeter("Xin chào")("Lan")', mongDoi: 'Xin chào, Lan!' },
        { moTa: 'Returns a function|||Trả về một hàm', goi: 'typeof multiplyBy(1) + "/" + typeof makeGreeter("Hi")', mongDoi: 'function/function' },
        { moTa: 'Hidden: greeters keep their own greeting|||Ẩn: mỗi greeter giữ lời chào riêng', an: true, chuanBi: 'const a = makeGreeter("Hi"); const b = makeGreeter("Yo");', goi: '[b("X"), a("Y")]', mongDoi: ['Yo, X!', 'Hi, Y!'] },
      ],
    },
    /* ───────────── 3 · MEDIUM ───────────── */
    {
      tieuDe: 'Bộ giới hạn lượt gọi',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['closure', 'state riêng tư'], tienQuyet: ['object', 'closure'], the: ['javascript', 'closure'],
      moTa: `${BAI}<p>Đây là bài luyện cuối bài học. Viết ${c('makeRateLimiter(limit)')} trả về object ${c('{ tryCall, remaining }')}. ${c('tryCall()')} trả ${c('true')} khi số lượt đã cho phép còn ít hơn ${c('limit')} (và tính lượt đó), sau đó trả ${c('false')}. ${c('remaining()')} cho biết còn bao nhiêu lượt. Số đếm phải riêng tư: gán ${c('limiter.count = 99')} không được làm thay đổi gì.</p>`,
      yeuCau: [
        `${c('makeRateLimiter(2)')}: ba lần ${c('tryCall()')} ⇒ true, true, false.`,
        `${c('remaining()')} giảm dần và dừng ở 0 (không âm).`,
        'Hai bộ giới hạn độc lập; ghi đè thuộc tính trên object trả về không ảnh hưởng số đếm thật.',
      ],
      dauVao: 'limit: số nguyên ≥ 0.', dauRa: 'Object { tryCall(): boolean, remaining(): number }.',
      rangBuoc: ['Số đếm không được là thuộc tính công khai của object trả về.'],
      viDu: [{ input: 'const l = makeRateLimiter(2); [l.tryCall(), l.tryCall(), l.tryCall()]', output: '[true, true, false]', explanation: 'Hết hai lượt thì từ chối.' },
        { input: 'l.remaining()', output: '0', explanation: 'Không xuống số âm.' }],
      goiY: ['let used = 0; nằm trong makeRateLimiter, hai hàm trả về cùng nhìn thấy nó.', 'tryCall: if (used < limit) { used++; return true; } return false; — remaining: return limit - used;'],
      khoiDau: { 'main.js': `// Bài 11.1 — bộ giới hạn lượt gọi
function makeRateLimiter(limit) {
  return {
    tryCall() {},
    remaining() {},
  };
}
` },
      loiGiai: { 'main.js': `// Bài 11.1 — bộ giới hạn lượt gọi: used sống trong closure, không phải trên object
function makeRateLimiter(limit) {
  let used = 0;                       // riêng tư: chỉ tryCall/remaining với tới
  return {
    tryCall() {
      if (used < limit) {
        used++;                       // tính lượt này
        return true;
      }
      return false;                   // đã hết lượt
    },
    remaining() {
      return limit - used;            // used không bao giờ vượt limit ⇒ không âm
    },
  };
}
` },
      giaiThich: `<p>Hai method cùng được tạo trong một lần gọi ${c('makeRateLimiter')}, nên chúng chia sẻ CÙNG một biến ${c('used')}. Biến đó không phải thuộc tính, nên ${c('l.count = 99')} hay ${c('l.used = 0')} chỉ thêm thuộc tính mới vô dụng — số đếm thật không đổi.</p>`,
      loiHayGap: ['Lưu số đếm thành this.used — người ngoài sửa được.', 'Tăng used cả khi đã hết lượt ⇒ remaining() âm.'],
      thamKhao: 'https://javascript.info/closure',
      kiem: [
        { moTa: 'limit 2: true, true, false|||limit 2: true, true, false', chuanBi: 'const l = makeRateLimiter(2);', goi: '[l.tryCall(), l.tryCall(), l.tryCall()]', mongDoi: [true, true, false] },
        { moTa: 'remaining() counts down and stops at 0|||remaining() giảm dần và dừng ở 0', chuanBi: 'const l = makeRateLimiter(2); const r = [l.remaining()]; l.tryCall(); r.push(l.remaining()); l.tryCall(); l.tryCall(); r.push(l.remaining());', goi: 'r', mongDoi: [2, 1, 0] },
        { moTa: 'Two limiters are independent|||Hai bộ giới hạn độc lập', chuanBi: 'const a = makeRateLimiter(1); a.tryCall(); const b = makeRateLimiter(1);', goi: '[a.tryCall(), b.tryCall()]', mongDoi: [false, true] },
        { moTa: 'The count is private|||Số đếm là riêng tư', chuanBi: 'const l = makeRateLimiter(1); l.tryCall(); l.count = 0; l.used = 0;', goi: 'l.tryCall()', mongDoi: false },
        { moTa: 'Hidden: limit 0 refuses at once|||Ẩn: limit 0 từ chối ngay', an: true, chuanBi: 'const l = makeRateLimiter(0);', goi: '[l.tryCall(), l.remaining()]', mongDoi: [false, 0] },
      ],
    },
    /* ───────────── 4 · MEDIUM ───────────── */
    {
      tieuDe: 'Sửa bẫy var trong vòng lặp',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['var vs let', 'closure trong vòng lặp'], tienQuyet: ['vòng lặp for'], the: ['javascript', 'closure', 'var'],
      moTa: `${BAI}<p>${c('makeHandlers(n)')} phải trả về mảng ${c('n')} hàm; hàm thứ ${c('i')} trả về ${c('"button " + i')}. Code khởi đầu dùng ${c('var')} nên MỌI hàm đều trả ${c('"button " + n')} — đúng bẫy 3, 3, 3 trong bài học. Sửa cho đúng và bỏ hẳn ${c('var')}.</p>`,
      yeuCau: [
        `${c('makeHandlers(3).map((h) => h())')} là ${c('["button 0", "button 1", "button 2"]')}.`,
        `Không còn từ khoá ${c('var')} trong file.`,
        `${c('makeHandlers(0)')} trả mảng rỗng.`,
      ],
      dauVao: 'n: số nguyên ≥ 0.', dauRa: 'Mảng n hàm () => string.',
      rangBuoc: ['Không dùng var.'],
      viDu: [{ input: 'makeHandlers(2)[1]()', output: '"button 1"', explanation: 'Mỗi hàm nhớ chỉ số riêng của nó.' }],
      goiY: ['let trong for tạo một biến mới cho mỗi vòng.', 'for (let i = 0; i < n; i++) handlers.push(() => "button " + i);'],
      khoiDau: { 'main.js': `// Bài 11.1 — bẫy var (mọi hàm đều trả "button n")
function makeHandlers(n) {
  var handlers = [];
  for (var i = 0; i < n; i++) {
    handlers.push(function () {
      return 'button ' + i;
    });
  }
  return handlers;
}
` },
      loiGiai: { 'main.js': `// Bài 11.1 — let tạo một i MỚI cho mỗi vòng ⇒ mỗi closure giữ i của vòng đó
function makeHandlers(n) {
  const handlers = [];
  for (let i = 0; i < n; i++) {
    handlers.push(() => 'button ' + i);   // bắt giữ i của RIÊNG vòng này
  }
  return handlers;
}
` },
      giaiThich: `<p>Với ${c('var')} chỉ có một ${c('i')} cho cả hàm; khi các hàm được gọi thì vòng lặp đã xong và ${c('i')} bằng ${c('n')}. Với ${c('let')}, vòng ${c('for')} tạo một biến mới cho mỗi lần lặp, nên mỗi closure giữ đúng chỉ số của mình. Cách khác (kiểu cũ): ${c('Array.from({ length: n }, (_, i) => () => "button " + i)')} — mỗi lần gọi callback cũng tạo một ${c('i')} mới.</p>`,
      loiHayGap: ['Chỉ đổi var handlers thành const mà vẫn giữ var i.', 'Gọi hàm ngay khi push (push(f())) ⇒ mảng chuỗi chứ không phải mảng hàm.'],
      thamKhao: 'https://javascript.info/closure#closures-in-loops',
      kiem: [
        { moTa: 'Each handler returns its own index|||Mỗi hàm trả đúng chỉ số của nó', goi: 'makeHandlers(3).map((h) => h())', mongDoi: ['button 0', 'button 1', 'button 2'] },
        { moTa: 'Elements are functions|||Các phần tử là hàm', goi: 'makeHandlers(2).every((h) => typeof h === "function")', mongDoi: true },
        { moTa: 'n = 0 gives an empty array|||n = 0 cho mảng rỗng', goi: 'makeHandlers(0)', mongDoi: [] },
        { moTa: 'No var keyword|||Không còn từ khoá var', kiem: 'ma-nguon', tep: 'main.js', khop: '\\bvar\\b', phuDinh: true },
        { moTa: 'Hidden: handler 7 of 10|||Ẩn: hàm thứ 7 trong 10', an: true, goi: 'makeHandlers(10)[7]()', mongDoi: 'button 7' },
      ],
    },
    /* ───────────── 5 · MEDIUM ───────────── */
    {
      tieuDe: 'once: chỉ chạy một lần',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['closure', 'hàm bậc cao'], tienQuyet: ['rest parameter'], the: ['javascript', 'closure'],
      moTa: `${BAI}<p>Viết ${c('once(fn)')}: trả về một hàm mới; lần gọi ĐẦU TIÊN chạy ${c('fn')} với đúng các đối số được đưa và nhớ kết quả; mọi lần gọi sau KHÔNG chạy ${c('fn')} nữa mà trả lại kết quả đã nhớ. Dùng cho việc "khởi tạo kết nối một lần", "gửi form một lần".</p>`,
      yeuCau: [
        `${c('fn')} chỉ được gọi đúng một lần dù hàm trả về bị gọi nhiều lần.`,
        'Mọi lần gọi trả cùng kết quả của lần đầu.',
        'Đối số của lần đầu được chuyển nguyên cho fn; hai hàm once khác nhau độc lập.',
      ],
      dauVao: 'fn: một hàm bất kỳ.', dauRa: 'Một hàm có cùng cách gọi.',
      rangBuoc: ['Không dùng biến toàn cục.'],
      viDu: [{ input: 'const init = once((x) => x * 2); [init(5), init(100)]', output: '[10, 10]', explanation: 'Lần hai không chạy lại, trả kết quả cũ.' }],
      goiY: ['Hai biến riêng: let done = false; let result;', 'return (...args) => { if (!done) { done = true; result = fn(...args); } return result; };'],
      khoiDau: { 'main.js': `// Bài 11.1 — once
function once(fn) {
  return fn;   // sai: chạy fn mỗi lần
}
` },
      loiGiai: { 'main.js': `// Bài 11.1 — once: done và result sống trong closure của MỖI lần gọi once
function once(fn) {
  let done = false;
  let result;
  return (...args) => {
    if (!done) {
      done = true;             // đánh dấu TRƯỚC khi gọi, kể cả fn ném lỗi cũng không chạy lại
      result = fn(...args);
    }
    return result;
  };
}
` },
      giaiThich: `<p>${c('done')} và ${c('result')} là trạng thái riêng của từng hàm do ${c('once')} tạo ra. Lần đầu chuyển ${c('done')} thành true, chạy ${c('fn')}, cất kết quả; các lần sau chỉ trả kết quả đã cất. Đối số được chuyển bằng rest/spread ${c('(...args)')} ⇒ ${c('fn(...args)')}.</p>`,
      loiHayGap: ['Kiểm if (result) thay vì một cờ riêng — fn trả 0 hay undefined sẽ bị gọi lại.', 'Quên chuyển đối số cho fn.'],
      thamKhao: 'https://javascript.info/closure',
      kiem: [
        { moTa: 'fn runs exactly once|||fn chạy đúng một lần', chuanBi: 'let n = 0; const f = once(() => { n++; return "ok"; }); f(); f(); f();', goi: 'n', mongDoi: 1 },
        { moTa: 'Later calls return the first result|||Các lần sau trả kết quả lần đầu', chuanBi: 'const f = once((x) => x * 2);', goi: '[f(5), f(100), f(7)]', mongDoi: [10, 10, 10] },
        { moTa: 'Arguments reach fn|||Đối số tới được fn', goi: 'once((a, b, c) => a + b + c)(1, 2, 3)', mongDoi: 6 },
        { moTa: 'Hidden: a falsy result is not re-run|||Ẩn: kết quả "falsy" không làm chạy lại', an: true, chuanBi: 'let n = 0; const f = once(() => { n++; return 0; }); f(); f();', goi: 'n', mongDoi: 1 },
        { moTa: 'Hidden: two once functions are independent|||Ẩn: hai hàm once độc lập', an: true, chuanBi: 'const a = once(() => "a"); const b = once(() => "b"); a();', goi: '[b(), a()]', mongDoi: ['b', 'a'] },
      ],
    },
    /* ───────────── 6 · HARD ───────────── */
    {
      tieuDe: 'memoize: nhớ kết quả theo đối số',
      doKho: 'HARD', phut: 20,
      khaiNiem: ['memoization', 'Map', 'closure'], tienQuyet: ['Map', 'JSON.stringify'], the: ['javascript', 'closure', 'hiệu năng'],
      moTa: `${BAI}<p>Viết ${c('memoize(fn)')}: trả về hàm có cùng kết quả với ${c('fn')}, nhưng gọi lại với CÙNG đối số thì trả kết quả đã nhớ thay vì chạy lại ${c('fn')}. Hàm có thể nhận nhiều đối số (số, chuỗi). Ngoài ra hàm trả về có method ${c('clear()')} xoá bộ nhớ đệm. Mỗi hàm memoize có bộ nhớ đệm RIÊNG.</p>`,
      yeuCau: [
        `Gọi ${c('m(9)')} ba lần chỉ chạy ${c('fn')} một lần.`,
        `Phân biệt được ${c('m(1, 2)')} với ${c('m(12)')} và ${c('m("1", 2)')}.`,
        `${c('m.clear()')} làm lần gọi sau chạy lại ${c('fn')}; hai hàm memoize không dùng chung bộ nhớ đệm.`,
      ],
      dauVao: 'fn: hàm thuần nhận số/chuỗi.', dauRa: 'Hàm có thêm method clear().',
      rangBuoc: ['Bộ nhớ đệm không được là biến toàn cục.'],
      viDu: [{ input: 'const sq = memoize((n) => n * n); sq(9); sq(9)', output: '81 (fn chỉ chạy 1 lần)', explanation: 'Lần hai lấy từ Map.' },
        { input: 'const add = memoize((a, b) => a + b); add(1, 2); add(12)', output: '3 rồi NaN (12 + undefined)', explanation: 'Hai khoá khác nhau: "[1,2]" và "[12]" — không được trả nhầm 3.' }],
      goiY: ['Khoá = JSON.stringify(args) — "[1,2]" khác "[12]" và khác "[\\"1\\",2]".', 'const cache = new Map(); const g = (...args) => { const k = JSON.stringify(args); if (!cache.has(k)) cache.set(k, fn(...args)); return cache.get(k); }; g.clear = () => cache.clear(); return g;'],
      khoiDau: { 'main.js': `// Bài 11.1 — memoize
function memoize(fn) {
  const g = (...args) => fn(...args);   // chưa nhớ gì cả
  return g;
}
` },
      loiGiai: { 'main.js': `// Bài 11.1 — memoize: một Map riêng cho MỖI hàm được memoize
function memoize(fn) {
  const cache = new Map();                    // nằm trong closure, ngoài không với tới
  const g = (...args) => {
    const key = JSON.stringify(args);         // [1,2] -> "[1,2]", [12] -> "[12]", ["1",2] -> "[\\"1\\",2]"
    if (!cache.has(key)) {
      cache.set(key, fn(...args));            // chỉ chạy fn khi chưa có
    }
    return cache.get(key);
  };
  g.clear = () => cache.clear();              // hàm cũng là object: gắn thêm method được
  return g;
}
` },
      giaiThich: `<p>Closure giữ ${c('cache')} sống chừng nào ${c('g')} còn sống, và mỗi lần gọi ${c('memoize')} tạo một ${c('Map')} mới. Khoá phải mô tả ĐỦ các đối số: nối bằng ${c('args.join("")')} sẽ biến ${c('(1, 2)')} và ${c('(12)')} thành cùng "12"; ${c('JSON.stringify')} giữ được ranh giới và kiểu (chuỗi có nháy). Dùng ${c('cache.has')} thay vì kiểm giá trị, để kết quả 0 hay ${c('undefined')} vẫn được nhớ.</p>`,
      loiHayGap: ['Khoá là args[0] — bỏ qua đối số thứ hai.', 'if (cache.get(k)) — kết quả 0 bị tính lại mãi.', 'Đặt cache ở ngoài memoize — mọi hàm dùng chung, kết quả lẫn nhau.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Glossary/Memoization',
      kiem: [
        { moTa: 'Same argument runs fn once|||Cùng đối số chỉ chạy fn một lần', chuanBi: 'let n = 0; const sq = memoize((x) => { n++; return x * x; }); sq(9); sq(9); sq(9);', goi: '[sq(9), n]', mongDoi: [81, 1] },
        { moTa: 'Different arguments are cached separately|||Đối số khác nhau được nhớ riêng', chuanBi: 'let n = 0; const add = memoize((a, b) => { n++; return String(a) + "|" + String(b); });', goi: '[add(1, 2), add(12), add("1", 2), add(1, 2), n]', mongDoi: ['1|2', '12|undefined', '1|2', '1|2', 3] },
        { moTa: 'clear() empties the cache|||clear() xoá bộ nhớ đệm', chuanBi: 'let n = 0; const f = memoize(() => ++n); f(); f(); f.clear(); f();', goi: 'n', mongDoi: 2 },
        { moTa: 'A result of 0 is remembered|||Kết quả 0 vẫn được nhớ', chuanBi: 'let n = 0; const z = memoize(() => { n++; return 0; }); z(); z();', goi: 'n', mongDoi: 1 },
        { moTa: 'Hidden: two memoized functions have separate caches|||Ẩn: hai hàm memoize có bộ nhớ đệm riêng', an: true, chuanBi: 'const a = memoize((x) => "a" + x); const b = memoize((x) => "b" + x); a(1);', goi: 'b(1)', mongDoi: 'b1' },
      ],
    },
  ],
});
