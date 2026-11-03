/** Bộ luyện bài 13.2 — Unit test đầu tiên. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI".
 *  Người học viết hàm có nhiều biên, rồi tự cài lại vài matcher và một describe/it tí hon để hiểu Vitest làm gì bên trong. */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 13.2 — Những unit test đầu tiên.</em> Máy chấm gọi hàm của bạn với từng ca và so sâu kết quả — đúng kiểu một bộ unit test.</p>';

export default doiDau({
  slug: 'wf-13-2-unit-tests',
  ten: '13.2 Những unit test đầu tiên',
  baiHoc: 'Nền tảng Web — Bài 13.2 Unit test với Vitest',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'BEGINNER',
  moTa: 'Hàm xếp loại nhiều biên, so sâu kiểu toEqual, toBeCloseTo đúng quy tắc Vitest, bọc lời gọi để kiểm ném lỗi, định dạng tên it.each, và một describe/it tí hon — 6 bài.',
  de: [
    {
      tieuDe: 'Xếp loại điểm: mọi giá trị biên',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['giá trị biên', 'RangeError'], tienQuyet: ['if/else'], the: ['javascript', 'testing'],
      moTa: `${BAI}<p>Bài luyện của bài học. Viết ${c('grade(score)')}: điểm 0–10 trả ${c('"A"')} từ 8.5, ${c('"B"')} từ 7, ${c('"C"')} từ 5.5, ${c('"D"')} từ 4, còn lại ${c('"F"')}; điểm ngoài 0–10 (hoặc không phải số) ném ${c('RangeError')}. Máy chấm thử cả hai phía của mọi mốc.</p>`,
      yeuCau: ['Đúng mọi mốc 8.5 / 7 / 5.5 / 4 (cả hai phía).', '0 và 10 hợp lệ.', 'Ngoài khoảng hoặc NaN ⇒ RangeError.'],
      dauVao: 'score: number.', dauRa: '"A" | "B" | "C" | "D" | "F".',
      rangBuoc: ['Dùng >= cho các mốc.'],
      viDu: [{ input: 'grade(8.5)', output: '"A"', explanation: 'Đúng mốc thuộc bậc trên.' }, { input: 'grade(8.4)', output: '"B"', explanation: 'Ngay dưới mốc.' }],
      goiY: ['Kiểm lỗi trước: if (!(score >= 0 && score <= 10)) throw new RangeError(...) — bắt luôn NaN.', 'Rồi if (score >= 8.5) return "A"; if (score >= 7) return "B"; …'],
      khoiDau: { 'main.js': `// Bài 13.2 — xếp loại
function grade(score) {
  if (score > 8.5) return 'A';
  if (score > 7) return 'B';
  if (score > 5.5) return 'C';
  if (score > 4) return 'D';
  return 'F';
}
` },
      loiGiai: { 'main.js': `// Bài 13.2 — xếp loại: kiểm đầu vào trước, rồi các mốc từ cao xuống thấp, đều dùng >=
function grade(score) {
  // !(a && b) bắt cả NaN: mọi phép so với NaN đều false
  if (!(score >= 0 && score <= 10)) throw new RangeError('score must be between 0 and 10');
  if (score >= 8.5) return 'A';
  if (score >= 7) return 'B';
  if (score >= 5.5) return 'C';
  if (score >= 4) return 'D';
  return 'F';
}
` },
      giaiThich: `<p>"Từ 8.5" nghĩa là ${c('>=')}. Viết ${c('>')} sai đúng tại mốc — chỉ ca biên mới lộ ra. Kiểm đầu vào bằng ${c('!(score >= 0 && score <= 10)')} còn bắt được ${c('NaN')}, thứ mà ${c('score < 0 || score > 10')} để lọt.</p>`,
      loiHayGap: ['Dùng > ở các mốc.', 'Kiểm score < 0 || score > 10 — NaN lọt qua và ra "F".'],
      thamKhao: 'https://vitest.dev/api/#test-each',
      kiem: [
        { moTa: 'Upper side of each boundary|||Phía trên mỗi mốc', goi: '[10, 8.5, 7, 5.5, 4].map(grade)', mongDoi: ['A', 'A', 'B', 'C', 'D'] },
        { moTa: 'Lower side of each boundary|||Phía dưới mỗi mốc', goi: '[8.4, 6.9, 5.4, 3.9, 0].map(grade)', mongDoi: ['B', 'C', 'D', 'F', 'F'] },
        { moTa: 'Out of range throws RangeError|||Ngoài khoảng ném RangeError', goi: 'grade(10.5)', mongDoi: { loi: 'RangeError' } },
        { moTa: 'Negative and NaN throw too|||Số âm và NaN cũng ném', goi: '[-1, NaN].map((v) => { try { grade(v); return "no"; } catch (e) { return e.name; } })', mongDoi: ['RangeError', 'RangeError'] },
      ],
    },
    {
      tieuDe: 'So sâu như toEqual',
      doKho: 'EASY', phut: 15,
      khaiNiem: ['so sánh sâu', 'đệ quy', 'tham chiếu'], tienQuyet: ['object', 'mảng', 'đệ quy'], the: ['javascript', 'testing'],
      moTa: `${BAI}<p>${c('toBe')} so tham chiếu nên hai ${c('{ id: 1 }')} riêng biệt là khác nhau. Viết ${c('deepEqual(a, b)')} so NỘI DUNG như ${c('toEqual')}: giá trị nguyên thuỷ so bằng ${c('Object.is')}; mảng cùng độ dài và từng phần tử bằng nhau; object thường cùng tập khoá (không kể thứ tự) và từng giá trị bằng nhau — lồng bao nhiêu tầng cũng được.</p>`,
      yeuCau: ['Object/mảng lồng nhau so theo nội dung.', 'Mảng khác object; [1,2] khác [2,1].', 'NaN bằng NaN; khoá thiếu là khác.'],
      dauVao: 'a, b: số, chuỗi, boolean, null, mảng, object thường.', dauRa: 'boolean.',
      rangBuoc: ['Không dùng JSON.stringify (thứ tự khoá làm sai kết quả).'],
      viDu: [{ input: 'deepEqual({ id: 1, tags: ["a"] }, { tags: ["a"], id: 1 })', output: 'true', explanation: 'Thứ tự khoá không quan trọng.' }],
      goiY: ['Nếu Object.is(a, b) ⇒ true. Nếu một bên không phải object (hoặc null) ⇒ false.', 'Array.isArray hai bên phải giống nhau; so Object.keys rồi đệ quy từng khoá.'],
      khoiDau: { 'main.js': `// Bài 13.2 — so sâu
function deepEqual(a, b) {
  return a === b;
}
` },
      loiGiai: { 'main.js': `// Bài 13.2 — so sâu: giống toEqual ở các trường hợp cơ bản
function deepEqual(a, b) {
  if (Object.is(a, b)) return true;                                   // cùng giá trị / cùng object, NaN = NaN
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;             // [] khác {}
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  // mỗi khoá của a phải có ở b và giá trị bằng nhau (đệ quy cho tầng sâu)
  return ka.every((k) => Object.hasOwn(b, k) && deepEqual(a[k], b[k]));
}
` },
      giaiThich: `<p>So sâu là đệ quy: hai container bằng nhau khi chúng cùng loại, cùng khoá, và từng giá trị con bằng nhau. Với mảng, khoá chính là chỉ số nên thứ tự phần tử được giữ. ${c('JSON.stringify')} trông tiện nhưng phụ thuộc thứ tự khoá và nuốt ${c('undefined')}.</p>`,
      loiHayGap: ['So bằng JSON.stringify — {a:1,b:2} khác {b:2,a:1}.', 'Quên trường hợp null (typeof null === "object").'],
      thamKhao: 'https://vitest.dev/api/expect.html#toequal',
      kiem: [
        { moTa: 'Look-alike objects are equal|||Object trông giống nhau thì bằng', goi: 'deepEqual({ id: 1, tags: ["a"] }, { tags: ["a"], id: 1 })', mongDoi: true },
        { moTa: 'Nested difference is found|||Tìm ra khác biệt ở tầng sâu', goi: 'deepEqual({ a: { b: [1, 2, { c: 3 }] } }, { a: { b: [1, 2, { c: 4 }] } })', mongDoi: false },
        { moTa: 'Order matters in arrays, [] is not {}|||Thứ tự trong mảng quan trọng, [] khác {}', goi: '[deepEqual([1, 2], [2, 1]), deepEqual([], {}), deepEqual({ a: 1 }, { a: 1, b: undefined })]', mongDoi: [false, false, false] },
        { moTa: 'Primitives and NaN|||Giá trị nguyên thuỷ và NaN', goi: '[deepEqual(NaN, NaN), deepEqual("1", 1), deepEqual(null, {})]', mongDoi: [true, false, false] },
      ],
    },
    {
      tieuDe: 'toBeCloseTo đúng quy tắc',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['số thực', 'sai số'], tienQuyet: ['Math.abs', '**'], the: ['javascript', 'testing'],
      moTa: `${BAI}<p>${c('0.1 + 0.2')} là ${c('0.30000000000000004')}. Viết ${c('closeTo(actual, expected, digits = 2)')} theo đúng quy tắc của ${c('toBeCloseTo')}: đạt khi ${c('|actual − expected| < 10^(−digits) / 2')}. Thêm trường hợp đặc biệt: hai vô cực cùng dấu thì đạt.</p>`,
      yeuCau: ['closeTo(0.1 + 0.2, 0.3) là true.', 'Đúng ngưỡng: digits = 2 ⇒ sai số phải < 0.005.', 'Infinity với Infinity là true; NaN là false.'],
      dauVao: 'actual, expected: number; digits?: number.', dauRa: 'boolean.',
      rangBuoc: ['Không làm tròn hai số rồi so (sai ở biên).'],
      viDu: [{ input: 'closeTo(0.3049, 0.3, 2)', output: 'true', explanation: '0.0049 < 0.005.' }, { input: 'closeTo(0.305, 0.3, 2)', output: 'false', explanation: '0.005 không nhỏ hơn 0.005.' }],
      goiY: ['Math.abs(actual - expected) < 10 ** -digits / 2', 'if (actual === expected) return true; — bắt Infinity === Infinity trước khi trừ (Infinity − Infinity là NaN).'],
      khoiDau: { 'main.js': `// Bài 13.2 — closeTo
function closeTo(actual, expected, digits = 2) {
  return actual.toFixed(digits) === expected.toFixed(digits);
}
` },
      loiGiai: { 'main.js': `// Bài 13.2 — closeTo: đúng quy tắc của Vitest toBeCloseTo
function closeTo(actual, expected, digits = 2) {
  if (actual === expected) return true;                     // gồm Infinity === Infinity
  return Math.abs(actual - expected) < 10 ** -digits / 2;    // NaN ⇒ false (mọi so sánh với NaN là false)
}
` },
      giaiThich: `<p>Làm tròn hai số rồi so (${c('toFixed')}) sai ở biên: 0.305 và 0.304 làm tròn thành 0.31 và 0.30 dù chỉ lệch 0.001. Quy tắc "sai số nhỏ hơn nửa đơn vị của chữ số cuối" là thứ Vitest và Jest dùng.</p>`,
      loiHayGap: ['Dùng <= thay vì < — 0.305 bị tính là gần 0.3.', 'Trừ hai Infinity ra NaN rồi trả false.'],
      thamKhao: 'https://vitest.dev/api/expect.html#tobecloseto',
      kiem: [
        { moTa: '0.1 + 0.2 is close to 0.3|||0.1 + 0.2 gần 0.3', goi: 'closeTo(0.1 + 0.2, 0.3)', mongDoi: true },
        { moTa: 'Exact threshold behaviour|||Đúng ngưỡng', goi: '[closeTo(0.3049, 0.3), closeTo(0.305, 0.3), closeTo(0.304, 0.305)]', mongDoi: [true, false, true] },
        { moTa: 'Custom digits|||Số chữ số tuỳ chọn', goi: '[closeTo(3.14159, 3.14, 2), closeTo(3.14159, 3.14, 3)]', mongDoi: [true, false] },
        { moTa: 'Infinity and NaN|||Vô cực và NaN', goi: '[closeTo(Infinity, Infinity), closeTo(NaN, NaN), closeTo(-Infinity, Infinity)]', mongDoi: [true, false, false] },
      ],
    },
    {
      tieuDe: 'Kiểm ném lỗi: bọc lời gọi',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['toThrow', 'try/catch', 'hàm làm đối số'], tienQuyet: ['try/catch', 'instanceof'], the: ['javascript', 'testing'],
      moTa: `${BAI}<p>Viết ${c('throwsWith(fn, expected)')} giống ${c('expect(fn).toThrow(expected)')}: gọi ${c('fn()')}; trả ${c('true')} nếu nó ném lỗi khớp — ${c('expected')} có thể là một lớp lỗi (so ${c('instanceof')}), một chuỗi (thông điệp CHỨA chuỗi đó), hoặc vắng (lỗi gì cũng được). Không ném ⇒ ${c('false')}. Nếu ${c('fn')} không phải hàm ⇒ ném ${c('TypeError')} với thông điệp ${c('"pass a function, not its result"')}.</p>`,
      yeuCau: ['Lớp lỗi: so bằng instanceof (lớp con cũng khớp).', 'Chuỗi: message chứa chuỗi đó.', 'fn không phải hàm ⇒ TypeError với thông điệp đúng.'],
      dauVao: 'fn: hàm; expected?: lớp lỗi | string.', dauRa: 'boolean.',
      rangBuoc: ['Không dùng thư viện.'],
      viDu: [{ input: 'throwsWith(() => applyCoupon(1, 0), RangeError)', output: 'true', explanation: 'Lời gọi được bọc trong hàm.' }],
      goiY: ['if (typeof fn !== "function") throw new TypeError("pass a function, not its result");', 'try { fn(); return false; } catch (e) { if (typeof expected === "string") return String(e.message).includes(expected); … }'],
      khoiDau: { 'main.js': `// Bài 13.2 — throwsWith
function throwsWith(fn, expected) {
  try {
    fn();
  } catch (e) {
    return true;
  }
}
` },
      loiGiai: { 'main.js': `// Bài 13.2 — throwsWith: phiên bản nhỏ của expect(fn).toThrow(expected)
function throwsWith(fn, expected) {
  // lỗi kinh điển: expect(applyCoupon(1, 0)) — đã GỌI hàm trước khi kịp bắt lỗi
  if (typeof fn !== 'function') throw new TypeError('pass a function, not its result');
  try {
    fn();
  } catch (e) {
    if (expected === undefined) return true;                       // lỗi gì cũng được
    if (typeof expected === 'string') return String(e && e.message).includes(expected);
    return e instanceof expected;                                  // lớp con cũng khớp
  }
  return false;                                                    // không ném ⇒ không đạt
}
` },
      giaiThich: `<p>Vì phải BẮT lỗi, matcher cần tự gọi hàm bên trong try/catch — nên bạn đưa hàm, không đưa kết quả. Kiểm ${c('typeof fn')} trước giúp người dùng thấy ngay lỗi kinh điển "đã gọi rồi mới đưa".</p>`,
      loiHayGap: ['Quên return false khi không có lỗi (trả undefined).', 'So e.constructor === expected — lớp con không khớp.'],
      thamKhao: 'https://vitest.dev/api/expect.html#tothrowerror',
      kiem: [
        { moTa: 'Matches by class (and subclasses)|||Khớp theo lớp (cả lớp con)', goi: '[throwsWith(() => { throw new RangeError("x"); }, RangeError), throwsWith(() => { throw new RangeError("x"); }, Error), throwsWith(() => { throw new TypeError("x"); }, RangeError)]', mongDoi: [true, true, false] },
        { moTa: 'Matches by message substring|||Khớp theo một phần thông điệp', goi: '[throwsWith(() => { throw new Error("coupon must be 1-50"); }, "1-50"), throwsWith(() => { throw new Error("boom"); }, "1-50")]', mongDoi: [true, false] },
        { moTa: 'No throw ⇒ false|||Không ném ⇒ false', goi: 'throwsWith(() => 42)', mongDoi: false },
        { moTa: 'Passing a result is rejected|||Đưa kết quả thay vì hàm bị từ chối', goi: 'throwsWith(42, RangeError)', mongDoi: { loi: 'TypeError', thongDiep: 'pass a function, not its result' } },
      ],
    },
    {
      tieuDe: 'Định dạng tên it.each',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['it.each', 'định dạng chuỗi'], tienQuyet: ['replace với hàm'], the: ['javascript', 'testing'],
      moTa: `${BAI}<p>Trong ${c('it.each([...])("order of %i đ ships for %i đ", …)')}, Vitest thay từng ${c('%…')} bằng giá trị của dòng theo thứ tự. Viết ${c('formatName(template, row)')} hỗ trợ: ${c('%i')} (số nguyên, ${c('Math.trunc')}), ${c('%s')} (chuỗi ${c('String(v)')}), ${c('%j')} (${c('JSON.stringify')}), và ${c('%%')} thành một dấu ${c('%')} (không ăn giá trị).</p>`,
      yeuCau: ['Thay lần lượt theo thứ tự các giá trị trong row.', '%i cắt phần thập phân; %j dùng JSON.', '%% thành % và không tiêu thụ giá trị.'],
      dauVao: 'template: string; row: mảng giá trị.', dauRa: 'string.',
      rangBuoc: ['Một lần duyệt bằng replace với regex.'],
      viDu: [{ input: 'formatName("order of %i đ ships for %i đ", [500000, 0])', output: '"order of 500000 đ ships for 0 đ"', explanation: 'Đúng như báo cáo Vitest.' }],
      goiY: ['template.replace(/%[isj%]/g, (tok) => …) với một biến đếm i.', 'tok === "%%" ⇒ "%"; "%i" ⇒ String(Math.trunc(row[i++])).'],
      khoiDau: { 'main.js': `// Bài 13.2 — định dạng tên it.each
function formatName(template, row) {
  return template.replace('%i', row[0]);
}
` },
      loiGiai: { 'main.js': `// Bài 13.2 — định dạng tên it.each: mỗi %x lấy giá trị KẾ TIẾP của dòng
function formatName(template, row) {
  let i = 0;
  return template.replace(/%[isj%]/g, (tok) => {
    if (tok === '%%') return '%';                       // dấu % thật, không ăn giá trị
    const v = row[i++];
    if (tok === '%i') return String(Math.trunc(v));
    if (tok === '%j') return JSON.stringify(v);
    return String(v);                                   // %s
  });
}
` },
      giaiThich: `<p>${c('replace')} với regex có cờ ${c('g')} và một hàm thay thế duyệt mọi token theo thứ tự xuất hiện; biến đếm ${c('i')} nằm trong closure (bài 11.1) để mỗi token lấy giá trị kế tiếp.</p>`,
      loiHayGap: ['replace với chuỗi chỉ thay token đầu tiên.', '%% cũng tăng i — các giá trị sau bị lệch.'],
      thamKhao: 'https://vitest.dev/api/#test-each',
      kiem: [
        { moTa: 'The shipping names from the lesson|||Tên các test ship trong bài', goi: 'formatName("order of %i đ ships for %i đ", [500000, 0])', mongDoi: 'order of 500000 đ ships for 0 đ' },
        { moTa: '%i truncates, %s stringifies|||%i cắt thập phân, %s thành chuỗi', goi: 'formatName("rejects %s (%i)", [12.5, 12.5])', mongDoi: 'rejects 12.5 (12)' },
        { moTa: '%j and %%|||%j và %%', goi: 'formatName("%j gives 100%%, then %s", [{ a: 1 }, "ok"])', mongDoi: '{"a":1} gives 100%, then ok' },
      ],
    },
    {
      tieuDe: 'describe / it tí hon',
      doKho: 'HARD', phut: 25,
      khaiNiem: ['test runner', 'describe lồng', 'async test'], tienQuyet: ['closure', 'async/await', 'try/catch'], the: ['javascript', 'testing'],
      moTa: `${BAI}<p>Viết ${c('createSuite()')} trả về ${c('{ describe, it, run }')}. ${c('describe(name, fn)')} gom các test (lồng được); ${c('it(name, fn)')} đăng ký một test (fn có thể là async); ${c('await run()')} chạy theo đúng thứ tự khai báo và trả mảng dòng: ${c('"✓ subtotal > is 0 for an empty cart"')} hoặc ${c('"× subtotal > … — <thông điệp lỗi>"')}. Tên nối bằng ${c('" > "')}. Một test đỏ không làm dừng test sau.</p>`,
      yeuCau: ['Tên đầy đủ gồm các describe lồng, nối bằng " > ".', 'Test async được await; test ném lỗi ⇒ dòng "×" kèm thông điệp.', 'Đúng thứ tự khai báo.'],
      dauVao: 'Không.', dauRa: 'Promise<string[]>.',
      rangBuoc: ['Không dùng thư viện.'],
      viDu: [{ input: 'describe("a", () => it("b", () => {})); await run()', output: '["✓ a > b"]', explanation: 'Một test qua.' }],
      goiY: ['Giữ một mảng tests [{ name, fn }] và một ngăn xếp tên describe; describe đẩy tên, gọi fn, rồi bỏ tên ra.', 'run: for (const t of tests) { try { await t.fn(); out.push("✓ " + t.name); } catch (e) { out.push("× " + t.name + " — " + e.message); } }'],
      khoiDau: { 'main.js': `// Bài 13.2 — describe / it tí hon
function createSuite() {
  const tests = [];
  return {
    describe(name, fn) { fn(); },
    it(name, fn) { tests.push({ name, fn }); },
    async run() { return tests.map((t) => '✓ ' + t.name); },
  };
}
` },
      loiGiai: { 'main.js': `// Bài 13.2 — describe / it tí hon: đăng ký trước, chạy sau, mỗi test độc lập
function createSuite() {
  const tests = [];        // [{ name: "a > b > c", fn }] theo thứ tự khai báo
  const stack = [];        // tên các describe đang mở

  return {
    describe(name, fn) {
      stack.push(name);
      try { fn(); } finally { stack.pop(); }   // describe chạy NGAY để đăng ký các it bên trong
    },
    it(name, fn) {
      tests.push({ name: [...stack, name].join(' > '), fn });
    },
    async run() {
      const out = [];
      for (const t of tests) {
        try {
          await t.fn();                         // await được cả test đồng bộ lẫn async
          out.push('✓ ' + t.name);
        } catch (e) {
          out.push('× ' + t.name + ' — ' + (e && e.message));   // ghi lại, chạy tiếp
        }
      }
      return out;
    },
  };
}
` },
      giaiThich: `<p>Test runner thật chia làm hai pha: <strong>thu thập</strong> (chạy các describe để biết có những it nào, tên đầy đủ là gì) và <strong>thực thi</strong> (chạy từng it trong try/catch). ${c('stack')} cho tên lồng nhau; ${c('finally')} đảm bảo tên được bỏ ra kể cả khi describe ném lỗi; ${c('await')} trên kết quả đồng bộ vẫn chạy bình thường.</p>`,
      loiHayGap: ['Chạy test ngay trong it() — thứ tự và báo cáo sai, describe sau chưa kịp đăng ký.', 'Quên await — test async đỏ vẫn hiện ✓.'],
      thamKhao: 'https://vitest.dev/api/#describe',
      kiem: [
        { moTa: 'Nested names joined with " > "|||Tên lồng nối bằng " > "', chuanBi: 'const s = createSuite(); s.describe("cart", () => { s.describe("subtotal", () => { s.it("is 0 for an empty cart", () => {}); }); s.it("works", () => {}); });', goi: 'await s.run()', mongDoi: ['✓ cart > subtotal > is 0 for an empty cart', '✓ cart > works'] },
        { moTa: 'A failing test is reported and the rest still run|||Test đỏ được báo và các test sau vẫn chạy', chuanBi: 'const s = createSuite(); s.it("a", () => { throw new Error("expected 30000 to be 0"); }); s.it("b", () => {});', goi: 'await s.run()', mongDoi: ['× a — expected 30000 to be 0', '✓ b'] },
        { moTa: 'Async tests are awaited|||Test async được await', chuanBi: 'const s = createSuite(); s.it("async red", async () => { await new Promise((r) => setTimeout(r, 50)); throw new Error("late"); }); s.it("async green", async () => { await Promise.resolve(); });', goi: 'await s.run()', mongDoi: ['× async red — late', '✓ async green'] },
        { moTa: 'Hidden: names reset after describe|||Ẩn: tên được trả lại sau describe', an: true, chuanBi: 'const s = createSuite(); s.describe("x", () => {}); s.it("top", () => {});', goi: 'await s.run()', mongDoi: ['✓ top'] },
      ],
    },
  ],
});
