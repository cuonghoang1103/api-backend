/** Bộ luyện bài 13.1 — Kiểm thử để làm gì. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI".
 *  Ý tưởng: người học viết CA KIỂM (dữ liệu) và một expect tí hon — máy chấm kiểm ca kiểm đó có đúng, có phủ biên không. */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 13.1 — Kiểm thử để làm gì.</em> Máy chấm chạy code của bạn trong realm mới cho mỗi kiểm. Ở module này bạn vừa sửa code, vừa tự viết các ca kiểm.</p>';
const CART = `// cart.js — các luật của giỏ hàng (bài 13.1)
function subtotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}
function applyCoupon(amount, percent) {
  if (!Number.isInteger(percent) || percent < 1 || percent > 50) {
    throw new RangeError('coupon must be an integer from 1 to 50');
  }
  return Math.round(amount * (100 - percent) / 100);
}
`;

export default doiDau({
  slug: 'wf-13-1-why-test',
  ten: '13.1 Kiểm thử để làm gì',
  baiHoc: 'Nền tảng Web — Bài 13.1 Kiểm thử để làm gì',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'BEGINNER',
  moTa: 'Sửa lỗi hồi quy ở giá trị biên, viết bảng ca kiểm phủ đủ biên, tự viết expect().toBe(), luật miễn phí ship sau mã giảm giá, đọc báo cáo đỏ, chạy cả bảng ca kiểm — 6 bài.',
  de: [
    {
      tieuDe: 'Sửa lỗi hồi quy: > hay >=',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['giá trị biên', 'hồi quy'], tienQuyet: ['if', 'toán tử so sánh'], the: ['javascript', 'testing'],
      moTa: `${BAI}<p>Luật: phí ship 30 000đ, <strong>miễn phí từ 500 000đ trở lên</strong> (tính cả đúng 500 000đ). Một đồng đội "dọn dẹp" ${c('shipping(amount)')} và gõ nhầm ${c('>')}. Máy chấm chính là bộ test của nhóm: sửa hàm để mọi ca biên đều đúng.</p>`,
      yeuCau: [`${c('shipping(500000)')} là 0.`, `${c('shipping(499999)')} là 30000.`, 'Các giá trị xa mốc vẫn đúng.'],
      dauVao: 'amount: số nguyên đồng ≥ 0.', dauRa: '0 hoặc 30000.',
      rangBuoc: ['Không đổi mốc 500000.'],
      viDu: [{ input: 'shipping(500000)', output: '0', explanation: 'Đúng mốc được miễn phí.' }],
      goiY: ['"Từ 500 000đ trở lên" nghĩa là lớn hơn HOẶC bằng.', 'return amount >= 500_000 ? 0 : 30_000;'],
      khoiDau: { 'main.js': `// Bài 13.1 — phí ship (có lỗi hồi quy)
function shipping(amount) {
  return amount > 500_000 ? 0 : 30_000;
}
` },
      loiGiai: { 'main.js': `// Bài 13.1 — phí ship: miễn phí TỪ 500 000đ (tính cả đúng mốc)
// Luật nghiệp vụ: "từ 500 000đ trở lên" ⇒ so sánh LỚN HƠN HOẶC BẰNG.
// Hai cách viết > và >= chỉ khác nhau đúng tại mốc — nên bộ test phải có ca 500 000.
function shipping(amount) {
  return amount >= 500_000 ? 0 : 30_000;   // >= chứ không phải > : đúng mốc vẫn miễn phí
}
` },
      giaiThich: `<p>Hai phiên bản cho cùng kết quả với mọi giá trị trừ đúng mốc — vì vậy test ở 800 000đ không bao giờ bắt được lỗi này, còn test ở 500 000đ bắt ngay. Đó là lý do bộ test luôn có các giá trị biên.</p>`,
      loiHayGap: ['Đổi mốc thành 499999 — đúng ở đây nhưng sai nghĩa và vỡ khi mốc đổi.', 'Chỉ thử với 800000 rồi kết luận "chạy rồi".'],
      thamKhao: 'https://en.wikipedia.org/wiki/Boundary-value_analysis',
      kiem: [
        { moTa: 'Exactly the threshold is free|||Đúng mốc được miễn phí', goi: 'shipping(500000)', mongDoi: 0 },
        { moTa: 'One đồng below pays|||Dưới mốc một đồng phải trả', goi: 'shipping(499999)', mongDoi: 30000 },
        { moTa: 'Far values|||Giá trị xa mốc', goi: '[shipping(0), shipping(1200000)]', mongDoi: [30000, 0] },
      ],
    },
    {
      tieuDe: 'Viết bảng ca kiểm phủ đủ biên',
      doKho: 'EASY', phut: 12,
      khaiNiem: ['ca kiểm', 'giá trị biên', 'tính tay giá trị mong đợi'], tienQuyet: ['mảng'], the: ['javascript', 'testing'],
      moTa: `${BAI}<p>Bạn KHÔNG viết hàm — bạn viết các ca kiểm. Điền mảng ${c('cases')} gồm các cặp ${c('[amount, expected]')} cho ${c('shipping')} (30 000đ, miễn phí từ 500 000đ). Máy chấm kiểm: (1) mọi expected bạn tự tính đều đúng, (2) có đủ ba giá trị biên ${c('0')}, ${c('499999')}, ${c('500000')}, (3) có ít nhất 5 ca.</p>`,
      yeuCau: ['Ít nhất 5 ca, mỗi ca [amount, expected].', 'Có các amount 0, 499999 và 500000.', 'Mọi expected đúng theo luật.'],
      dauVao: 'Không.', dauRa: 'cases: [number, number][].',
      rangBuoc: ['expected là số viết tay, không gọi hàm.'],
      viDu: [{ input: '[499999, 30000]', output: 'một ca đúng', explanation: 'Dưới mốc một đồng vẫn trả ship.' }],
      goiY: ['Chọn: 0, dưới mốc 1 đồng, đúng mốc, trên mốc 1 đồng, rất lớn.', 'const cases = [[0, 30000], [499999, 30000], [500000, 0], [500001, 0], [2000000, 0]];'],
      khoiDau: { 'main.js': `// Bài 13.1 — bảng ca kiểm cho shipping(amount)
const cases = [
  [800000, 0],
];
` },
      loiGiai: { 'main.js': `// Bài 13.1 — bảng ca kiểm: mỗi giá trị mong đợi được TÍNH TAY, không gọi hàm
const cases = [
  [0, 30000],          // giỏ rỗng vẫn tính ship (theo luật hiện tại)
  [499999, 30000],     // ngay dưới mốc
  [500000, 0],         // đúng mốc: miễn phí
  [500001, 0],         // ngay trên mốc
  [2000000, 0],        // rất lớn
];
` },
      giaiThich: `<p>Một bảng tốt phủ cả hai phía của mỗi ranh giới và các đầu mút (0, rất lớn). Giá trị mong đợi viết tay là thứ làm test độc lập với code: nếu bạn gọi ${c('shipping')} để tính expected, bảng sẽ sai y như code.</p>`,
      loiHayGap: ['Chỉ ghi các giá trị "đẹp" như 100000, 800000.', 'Tính expected bằng chính hàm cần kiểm.'],
      thamKhao: 'https://martinfowler.com/articles/practical-test-pyramid.html',
      kiem: [
        { moTa: 'At least 5 cases|||Ít nhất 5 ca', goi: 'cases.length >= 5', mongDoi: true },
        { moTa: 'Includes the boundaries 0, 499999, 500000|||Có các biên 0, 499999, 500000', goi: '[0, 499999, 500000].every((v) => cases.some(([a]) => a === v))', mongDoi: true },
        { moTa: 'Every expected value is correct|||Mọi giá trị mong đợi đúng', goi: 'cases.every(([a, e]) => e === (a >= 500000 ? 0 : 30000))', mongDoi: true },
        { moTa: 'No function calls in the table|||Bảng không gọi hàm', kiem: 'ma-nguon', tep: 'main.js', khop: 'shipping\\s*\\(', phuDinh: true },
      ],
    },
    {
      tieuDe: 'Tự viết expect(x).toBe(y)',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['assertion', 'Object.is', 'throw'], tienQuyet: ['hàm', 'object', 'throw'], the: ['javascript', 'testing'],
      moTa: `${BAI}<p>Một matcher chỉ là một hàm ném lỗi khi điều kiện sai. Viết ${c('expect(actual)')} trả về object có ${c('toBe(expected)')}: nếu ${c('Object.is(actual, expected)')} thì không làm gì (trả ${c('true')}); nếu không thì ném ${c('Error')} có thông điệp đúng dạng ${c('"expected 30000 to be 0"')} (dùng ${c('JSON.stringify')} cho hai giá trị). Thêm ${c('toBe')} ngược: ${c('expect(x).not.toBe(y)')}.</p>`,
      yeuCau: ['toBe đúng ⇒ trả true; sai ⇒ ném Error với thông điệp "expected A to be B".', 'Dùng Object.is: NaN bằng NaN, 0 khác -0.', 'not.toBe đảo ngược.'],
      dauVao: 'actual, expected: bất kỳ.', dauRa: 'true hoặc ném Error.',
      rangBuoc: ['Không dùng thư viện.'],
      viDu: [{ input: 'expect(shipping(500000)).toBe(0)', output: 'true', explanation: 'Khớp ⇒ im lặng.' }],
      goiY: ['return { toBe(e) { if (Object.is(actual, e)) return true; throw new Error(...) }, not: { toBe(e) {...} } };', 'Thông điệp: "expected " + JSON.stringify(actual) + " to be " + JSON.stringify(e)'],
      khoiDau: { 'main.js': `// Bài 13.1 — expect tí hon
function expect(actual) {
  return {
    toBe(expected) {
      return actual == expected;   // sai: == và không ném lỗi
    },
  };
}
` },
      loiGiai: { 'main.js': `// Bài 13.1 — expect tí hon: matcher = hàm NÉM LỖI khi điều kiện sai
function expect(actual) {
  const show = (v) => JSON.stringify(v);
  return {
    toBe(expected) {
      if (Object.is(actual, expected)) return true;            // cùng phép so với Vitest
      throw new Error('expected ' + show(actual) + ' to be ' + show(expected));
    },
    not: {
      toBe(expected) {
        if (!Object.is(actual, expected)) return true;
        throw new Error('expected ' + show(actual) + ' not to be ' + show(expected));
      },
    },
  };
}
` },
      giaiThich: `<p>Test runner bắt lỗi ném ra và đánh dấu test đỏ — vì vậy matcher không trả false mà NÉM. ${c('Object.is')} giống ${c('===')} trừ hai chỗ: ${c('NaN')} bằng ${c('NaN')}, và ${c('0')} khác ${c('-0')}. Thông điệp rõ là nửa giá trị của một test.</p>`,
      loiHayGap: ['Trả false thay vì ném — test runner sẽ coi là qua.', 'Dùng == — "0" bằng 0.'],
      thamKhao: 'https://vitest.dev/api/expect.html#tobe',
      kiem: [
        { moTa: 'Passing assertion returns true|||Khẳng định đúng trả true', goi: 'expect(2 + 2).toBe(4)', mongDoi: true },
        { moTa: 'Failing assertion throws with a clear message|||Khẳng định sai ném lỗi với thông điệp rõ', goi: 'expect(30000).toBe(0)', mongDoi: { loi: 'Error', thongDiep: '^expected 30000 to be 0$' } },
        { moTa: 'Uses Object.is (no type coercion)|||Dùng Object.is (không ép kiểu)', goi: '[(() => { try { expect("0").toBe(0); return "no throw"; } catch { return "threw"; } })(), expect(NaN).toBe(NaN)]', mongDoi: ['threw', true] },
        { moTa: 'not.toBe|||not.toBe', goi: '[expect(1).not.toBe(2), (() => { try { expect(1).not.toBe(1); return "no"; } catch (e) { return e.message; } })()]', mongDoi: [true, 'expected 1 not to be 1'] },
      ],
    },
    {
      tieuDe: 'Luật tinh tế: miễn phí ship SAU mã giảm',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['thứ tự áp luật', 'tài liệu sống'], tienQuyet: ['hàm', 'throw'], the: ['javascript', 'testing'],
      moTa: `${BAI}<p>Có sẵn ${c('subtotal')} và ${c('applyCoupon')} (đừng sửa). Viết ${c('total(items, couponPercent)')}: tổng sau mã giảm (nếu có), cộng phí ship tính trên số tiền ĐÃ GIẢM (30 000đ, miễn phí từ 500 000đ). Giày 520 000đ giảm 10% ⇒ 468 000đ ⇒ phải trả ship ⇒ 498 000đ.</p>`,
      yeuCau: ['Không mã: tổng + ship.', 'Có mã: ship tính trên số đã giảm.', 'Mã sai vẫn ném RangeError (từ applyCoupon).'],
      dauVao: 'items: {price, qty}[]; couponPercent?: number.', dauRa: 'number (đồng).',
      rangBuoc: ['Không sửa applyCoupon/subtotal.'],
      viDu: [{ input: 'total([{ price: 520000, qty: 1 }], 10)', output: '498000', explanation: '468 000 + 30 000.' }],
      goiY: ['const sub = subtotal(items); const after = couponPercent ? applyCoupon(sub, couponPercent) : sub;', 'return after + (after >= 500000 ? 0 : 30000);'],
      khoiDau: { 'main.js': `${CART}
// Bài 13.1 — total (sai: ship tính trước khi giảm)
function total(items, couponPercent) {
  const sub = subtotal(items);
  const ship = sub >= 500_000 ? 0 : 30_000;
  return (couponPercent ? applyCoupon(sub, couponPercent) : sub) + ship;
}
` },
      loiGiai: { 'main.js': `${CART}
// Bài 13.1 — total: GIẢM trước, rồi mới xét miễn phí ship trên số đã giảm
function total(items, couponPercent) {
  const sub = subtotal(items);
  const discounted = couponPercent ? applyCoupon(sub, couponPercent) : sub;
  const ship = discounted >= 500_000 ? 0 : 30_000;
  return discounted + ship;
}
` },
      giaiThich: `<p>Thứ tự áp luật là một luật nghiệp vụ — và là loại dễ bị "đơn giản hoá" sai nhất. Một test tên "free shipping applies AFTER the coupon" ghi luật đó lại dưới dạng không thể lỗi thời: nếu ai đổi thứ tự, test đỏ.</p>`,
      loiHayGap: ['Tính ship trên subtotal gốc — đơn 520 000đ giảm 10% được miễn ship sai.', 'Quên trường hợp không có mã (undefined).'],
      thamKhao: 'https://vitest.dev/guide/',
      kiem: [
        { moTa: 'Shipping is charged again after the coupon|||Sau mã giảm lại phải trả ship', goi: 'total([{ price: 520000, qty: 1 }], 10)', mongDoi: 498000 },
        { moTa: 'No coupon|||Không mã', goi: '[total([{ price: 15000, qty: 2 }]), total([{ price: 600000, qty: 1 }])]', mongDoi: [60000, 600000] },
        { moTa: 'Still free when the discounted sum stays above|||Vẫn miễn phí khi số đã giảm còn trên mốc', goi: 'total([{ price: 1000000, qty: 1 }], 50)', mongDoi: 500000 },
        { moTa: 'A bad coupon still throws|||Mã sai vẫn ném lỗi', goi: 'total([{ price: 1, qty: 1 }], 51)', mongDoi: { loi: 'RangeError' } },
      ],
    },
    {
      tieuDe: 'Đọc báo cáo đỏ',
      doKho: 'MEDIUM', phut: 10,
      khaiNiem: ['đọc báo cáo test', 'Expected/Received'], tienQuyet: ['chuỗi', 'regex'], the: ['javascript', 'testing'],
      moTa: `${BAI}<p>Viết ${c('readFailure(report)')} nhận chuỗi báo cáo Vitest (như trong bài) và trả object ${c('{ test, expected, received, line }')}: ${c('test')} là phần sau dấu ${c('>')} cuối cùng của dòng ${c('FAIL')}; ${c('expected')}/${c('received')} là số trên dòng ${c('- ')} và ${c('+ ')} (number); ${c('line')} là số dòng trong ${c('❯ file:dòng:cột')}.</p>`,
      yeuCau: ['Trích đúng tên test từ dòng FAIL.', 'expected và received là number.', 'line là number.'],
      dauVao: 'report: string nhiều dòng.', dauRa: '{ test, expected, received, line }.',
      rangBuoc: ['Không dùng thư viện.'],
      viDu: [{ input: 'báo cáo lỗi hồi quy của bài', output: '{ test: "an order of exactly 500 000đ ships free", expected: 0, received: 30000, line: 6 }', explanation: 'Ba chỗ cần đọc của một báo cáo đỏ.' }],
      goiY: ['Tách dòng: report.split("\\n"); tìm dòng bắt đầu " FAIL", dòng bắt đầu "- " (không phải "- Expected").', 'Dùng regex /❯ \\S+?:(\\d+):\\d+/ để lấy số dòng.'],
      khoiDau: { 'main.js': `// Bài 13.1 — đọc báo cáo đỏ
function readFailure(report) {
  return {};
}
` },
      loiGiai: { 'main.js': `// Bài 13.1 — đọc ba chỗ quan trọng của một báo cáo đỏ
function readFailure(report) {
  const lines = report.split('\\n');
  const fail = lines.find((l) => l.trim().startsWith('FAIL'));
  const test = fail.slice(fail.lastIndexOf('>') + 1).trim();          // tên test = sau dấu > cuối
  const num = (prefix) => Number(lines.find((l) => l.startsWith(prefix) && !/Expected|Received/.test(l)).slice(2));
  const expected = num('- ');                                          // dòng "- 0"
  const received = num('+ ');                                          // dòng "+ 30000"
  const m = report.match(/❯ \\S+?:(\\d+):\\d+/);                          // "❯ demo/x.test.js:6:29"
  return { test, expected, received, line: m ? Number(m[1]) : null };
}
` },
      giaiThich: `<p>Báo cáo đỏ có cấu trúc ổn định: dòng FAIL (file &gt; tên test), khối diff (- mong đợi, + nhận được), và mũi tên tới file:dòng:cột. Đọc đủ ba chỗ đó trước khi sửa code thường đã cho thấy bug.</p>`,
      loiHayGap: ['Lấy nhầm dòng "- Expected" (nhãn) thay vì dòng giá trị.', 'Để expected là chuỗi "0".'],
      thamKhao: 'https://vitest.dev/guide/reporters.html',
      kiem: [
        { moTa: 'Reads the regression report|||Đọc được báo cáo hồi quy', chuanBi: 'const r = ["", " FAIL  demo/cart-buggy.test.js > an order of exactly 500 000đ ships free", "AssertionError: expected 30000 to be +0 // Object.is equality", "", "- Expected", "+ Received", "", "- 0", "+ 30000", "", " ❯ demo/cart-buggy.test.js:6:29"].join("\\n");', goi: 'readFailure(r)', mongDoi: { test: 'an order of exactly 500 000đ ships free', expected: 0, received: 30000, line: 6 } },
        { moTa: 'Works with nested describe names|||Chạy với tên describe lồng', chuanBi: 'const r = [" FAIL  test/cart.test.js > shipping > order of 500000 đ ships for 0 đ", "- Expected", "+ Received", "- 0", "+ 30000", " ❯ test/cart.test.js:28:25"].join("\\n");', goi: 'readFailure(r)', mongDoi: { test: 'order of 500000 đ ships for 0 đ', expected: 0, received: 30000, line: 28 } },
        { moTa: 'Numbers, not strings|||Là số, không phải chuỗi', chuanBi: 'const r = [" FAIL  a.test.js > x", "- 7", "+ 8", " ❯ a.test.js:3:1"].join("\\n");', goi: 'Object.values(readFailure(r)).map((v) => typeof v)', mongDoi: ['string', 'number', 'number', 'number'] },
      ],
    },
    {
      tieuDe: 'Chạy cả bảng ca kiểm',
      doKho: 'HARD', phut: 20,
      khaiNiem: ['test runner', 'try/catch', 'báo cáo'], tienQuyet: ['vòng lặp', 'try/catch'], the: ['javascript', 'testing'],
      moTa: `${BAI}<p>Viết một "test runner" tí hon: ${c('runCases(fn, cases)')} chạy ${c('fn(input)')} cho từng ${c('[input, expected]')}, so bằng ${c('Object.is')}, và trả báo cáo ${c('{ passed, failed, failures }')} — ${c('failures')} là mảng ${c('{ input, expected, actual }')} (nếu ${c('fn')} ném lỗi thì ${c('actual')} là chuỗi ${c('"threw <Tên>: <thông điệp>"')}). Một ca lỗi không được làm dừng các ca sau.</p>`,
      yeuCau: ['Đếm passed/failed đúng.', 'failures ghi input, expected, actual.', 'fn ném lỗi ⇒ ca đó failed, các ca sau vẫn chạy.'],
      dauVao: 'fn: hàm 1 tham số; cases: [input, expected][].', dauRa: '{ passed, failed, failures }.',
      rangBuoc: ['Không dùng thư viện.'],
      viDu: [{ input: 'runCases(shippingBuggy, [[499999, 30000], [500000, 0]])', output: '{ passed: 1, failed: 1, failures: [{ input: 500000, expected: 0, actual: 30000 }] }', explanation: 'Đúng ca biên bị đỏ.' }],
      goiY: ['for (const [input, expected] of cases) { let actual; try { actual = fn(input); } catch (e) { actual = "threw " + e.name + ": " + e.message; } … }', 'So bằng Object.is(actual, expected); đẩy vào failures khi sai.'],
      khoiDau: { 'main.js': `// Bài 13.1 — test runner tí hon
function runCases(fn, cases) {
  let passed = 0;
  for (const [input, expected] of cases) {
    if (fn(input) === expected) passed++;
  }
  return { passed };
}
` },
      loiGiai: { 'main.js': `// Bài 13.1 — test runner tí hon: mỗi ca độc lập, lỗi của một ca không chặn ca sau
function runCases(fn, cases) {
  let passed = 0;
  const failures = [];
  for (const [input, expected] of cases) {
    let actual;
    try {
      actual = fn(input);
    } catch (e) {
      actual = 'threw ' + e.name + ': ' + e.message;   // ghi lại thay vì làm sập cả bảng
    }
    if (Object.is(actual, expected)) passed++;
    else failures.push({ input, expected, actual });
  }
  return { passed, failed: failures.length, failures };
}
` },
      giaiThich: `<p>Đây chính là việc Vitest làm ở quy mô nhỏ: chạy từng ca trong try/catch để một ca sập không giết cả bộ, so bằng ${c('Object.is')}, và gom thông tin đủ để người đọc sửa được (input, mong đợi, thực tế).</p>`,
      loiHayGap: ['Không bọc try/catch — ca đầu tiên ném lỗi làm dừng cả bảng.', 'Dùng === — NaN không bao giờ bằng NaN.'],
      thamKhao: 'https://vitest.dev/api/#test-each',
      kiem: [
        { moTa: 'Counts and records the failing boundary|||Đếm và ghi lại ca biên đỏ', goi: 'runCases((a) => (a > 500000 ? 0 : 30000), [[499999, 30000], [500000, 0], [900000, 0]])', mongDoi: { passed: 2, failed: 1, failures: [{ input: 500000, expected: 0, actual: 30000 }] } },
        { moTa: 'A throwing case does not stop the rest|||Ca ném lỗi không chặn các ca sau', goi: 'runCases((x) => { if (x < 0) throw new RangeError("negative"); return x * 2; }, [[-1, 0], [2, 4]])', mongDoi: { passed: 1, failed: 1, failures: [{ input: -1, expected: 0, actual: 'threw RangeError: negative' }] } },
        { moTa: 'Uses Object.is (NaN case)|||Dùng Object.is (ca NaN)', goi: 'runCases((x) => x / 0 * 0, [[1, NaN]]).passed', mongDoi: 1 },
        { moTa: 'Hidden: empty table|||Ẩn: bảng rỗng', an: true, goi: 'runCases((x) => x, [])', mongDoi: { passed: 0, failed: 0, failures: [] } },
      ],
    },
  ],
});
