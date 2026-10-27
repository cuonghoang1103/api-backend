/**
 * SWT301 · 4.3 — Boundary value analysis & the condition template (SWT4 slide 29–42, LO-4.2.2 K3).
 * Bảng "Condition · Valid Partitions · Invalid Partitions · Valid Boundaries · Invalid Boundaries" = Bảng 3.1 của PE câu 3 cũ.
 */
import { doiDau, KHOA, hai, giai, lc, tn } from './_chung.mjs';
import { tinhDe, jsDe, kiemTuy, dotBienDe, TN_TEST } from './_de.mjs';

const v = (...xs) => xs; // nhiều cách ghi được chấp nhận
const E1 = tinhDe({
  tieuDe: 'BVA 1 — Two-value boundary values of five ranges',
  doKho: 'EASY', phut: 8,
  moTa: {
    en: '<p><b>Two-value BVA</b> (the CTFL default): every boundary gives two values — the edge of the partition and its closest neighbour in the next partition. For a range there are four values: <i>lower invalid · lower valid · upper valid · upper invalid</i>. Mind the <b>precision</b> of each field: the neighbour of 0.01 with two decimals is 0.00, not 0.</p>',
    vi: '<p><b>BVA hai giá trị</b> (mặc định của CTFL): mỗi biên cho hai giá trị — mép của vùng và giá trị gần nhất ở vùng kế bên. Một khoảng có bốn giá trị: <i>biên dưới sai · biên dưới đúng · biên trên đúng · biên trên sai</i>. Để ý <b>độ chính xác</b> của từng trường: hàng xóm của 0.01 với hai chữ số thập phân là 0.00, không phải 0.</p>',
  },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Fill the four boundary values of each range (use - for negative numbers).', 'Điền bốn giá trị biên của mỗi khoảng (số âm dùng dấu -).'),
    cot: [{ ma: 'r', ten: 'Range' }, { ma: 'li', ten: 'Lower invalid' }, { ma: 'lv', ten: 'Lower valid' }, { ma: 'uv', ten: 'Upper valid' }, { ma: 'ui', ten: 'Upper invalid' }],
    hang: [
      { ma: 'a', o: { r: 'Age: whole number 18–60' } },
      { ma: 'b', o: { r: 'Quantity: whole number 1–99' } },
      { ma: 'c', o: { r: 'Unit price: 0.01–999.99 (2 decimals)' } },
      { ma: 'd', o: { r: 'Password length: 8–64 characters' } },
      { ma: 'e', o: { r: 'Exam mark: 0.0–10.0 (1 decimal)' } },
    ],
    dapAn: {
      'a.li': '17', 'a.lv': '18', 'a.uv': '60', 'a.ui': '61',
      'b.li': '0', 'b.lv': '1', 'b.uv': '99', 'b.ui': '100',
      'c.li': v('0.00', '0', '0.0'), 'c.lv': '0.01', 'c.uv': '999.99', 'c.ui': v('1000.00', '1000', '1000.0'),
      'd.li': '7', 'd.lv': '8', 'd.uv': '64', 'd.ui': '65',
      'e.li': v('-0.1', '−0.1'), 'e.lv': v('0.0', '0'), 'e.uv': v('10.0', '10'), 'e.ui': '10.1',
    },
    giaiThich: giai('Each neighbour is one step of the field’s precision away: 1 for whole numbers, 0.01 for two decimals, 0.1 for one decimal, one character for lengths.', 'Mỗi hàng xóm cách đúng một bước độ chính xác: 1 với số nguyên, 0.01 với hai chữ số thập phân, 0.1 với một chữ số, một ký tự với độ dài.'),
  }],
  goiY: ['Biên đúng = min và max của vùng hợp lệ. Biên sai = bước kế tiếp ra ngoài.', 'Bước = độ chính xác: 0.01 cho giá, 0.1 cho điểm thi.'],
  loiHayGap: ['Ghi 0 thay vì 0.00 rồi nghĩ “0 với 0.00 khác nhau” — cả hai đều được chấp nhận, nhưng 0.001 hay 0.009 thì sai bước.', 'Lấy 999 làm biên trên sai của 0.01–999.99 — hàng xóm đúng là 1000.00.'],
  giaiThich: '<p>17/18/60/61 · 0/1/99/100 · 0.00/0.01/999.99/1000.00 · 7/8/64/65 · −0.1/0.0/10.0/10.1.</p>',
  thuatNgu: tn('bva', 'boundary'),
  khaiNiem: ['boundary value analysis', 'two-value BVA', 'precision'],
});

const E2 = tinhDe({
  tieuDe: 'BVA 2 — Three-value boundary values',
  doKho: 'MEDIUM', phut: 8,
  moTa: {
    en: '<p><b>Three-value BVA</b> takes three values per boundary: just below, on, and just above the boundary. A range therefore gives six values. Fill them for three fields.</p>',
    vi: '<p><b>BVA ba giá trị</b> lấy ba giá trị mỗi biên: ngay dưới, đúng biên, ngay trên. Một khoảng cho sáu giá trị. Điền cho ba trường.</p>',
  },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Six three-value BVA values per range', 'Sáu giá trị BVA ba giá trị cho mỗi khoảng'),
    cot: [{ ma: 'r', ten: 'Range' }, { ma: 'l1', ten: 'Lower − 1 step' }, { ma: 'l2', ten: 'Lower' }, { ma: 'l3', ten: 'Lower + 1 step' }, { ma: 'u1', ten: 'Upper − 1 step' }, { ma: 'u2', ten: 'Upper' }, { ma: 'u3', ten: 'Upper + 1 step' }],
    hang: [
      { ma: 'a', o: { r: 'Thermostat: whole °C from −10 to 40' } },
      { ma: 'b', o: { r: 'Delivery days: 1–7' } },
      { ma: 'c', o: { r: 'Discount: 0%–50% in steps of 5%' } },
    ],
    dapAn: {
      'a.l1': v('-11', '−11'), 'a.l2': v('-10', '−10'), 'a.l3': v('-9', '−9'), 'a.u1': '39', 'a.u2': '40', 'a.u3': '41',
      'b.l1': '0', 'b.l2': '1', 'b.l3': '2', 'b.u1': '6', 'b.u2': '7', 'b.u3': '8',
      'c.l1': v('-5', '−5', '-5%', '−5%'), 'c.l2': v('0', '0%'), 'c.l3': v('5', '5%'), 'c.u1': v('45', '45%'), 'c.u2': v('50', '50%'), 'c.u3': v('55', '55%'),
    },
    giaiThich: giai('The step is the smallest meaningful change: 1 °C, 1 day, 5 percentage points (the field only accepts multiples of 5).', 'Bước là thay đổi nhỏ nhất có nghĩa: 1 °C, 1 ngày, 5 điểm phần trăm (trường chỉ nhận bội của 5).'),
  }],
  goiY: ['Với −10: dưới một bước là −11, trên một bước là −9.', 'Giảm giá theo bước 5% ⇒ hàng xóm của 0% là −5% và 5%.'],
  loiHayGap: ['Lấy −9 làm “dưới biên” của −10 (ngược chiều với số âm).', 'Dùng bước 1% cho trường chỉ nhận bội của 5%.'],
  giaiThich: '<p>−11/−10/−9/39/40/41 · 0/1/2/6/7/8 · −5/0/5/45/50/55.</p>',
  thuatNgu: tn('bva', 'boundary'),
  khaiNiem: ['three-value BVA'],
});

const E3 = tinhDe({
  tieuDe: 'BVA 3 — ISTQB-style questions on boundary value analysis',
  doKho: 'MEDIUM', phut: 10,
  moTa: { en: '<p>Six exam-style questions, including the classic traps (open-ended partitions, whole grams, 2-value vs 3-value counts).</p>', vi: '<p>Sáu câu kiểu đề thi, gồm các bẫy kinh điển (vùng không có biên, đơn vị gam, đếm BVA 2 và 3 giá trị).</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('A field accepts whole numbers 1–100. Which set contains exactly the two-value boundary values?', 'Trường nhận số nguyên 1–100. Bộ nào đúng là các giá trị biên hai giá trị?'), luaChon: lc(['a', '1, 100'], ['b', '0, 1, 100, 101'], ['c', '0, 1, 2, 99, 100, 101'], ['d', '1, 50, 100']), dapAn: ['b'],
      giaiThich: giai('Two values per boundary: (0, 1) and (100, 101). (c) is three-value BVA.', 'Hai giá trị mỗi biên: (0, 1) và (100, 101). (c) là BVA ba giá trị.') },
    { ma: 'q2', de: hai('With three-value BVA, how many values are tested for one range with a lower and an upper boundary?', 'Với BVA ba giá trị, một khoảng có biên dưới và biên trên cần test bao nhiêu giá trị?'), luaChon: lc(['a', '3'], ['b', '4'], ['c', '6'], ['d', '8']), dapAn: ['c'],
      giaiThich: giai('Three per boundary × two boundaries = 6.', 'Ba mỗi biên × hai biên = 6.') },
    { ma: 'q3', de: hai('Eight boundary values were identified and six were tested. What is the BVA coverage?', 'Xác định 8 giá trị biên, đã test 6. Độ phủ BVA là bao nhiêu?'), luaChon: lc(['a', '6%'], ['b', '60%'], ['c', '75%'], ['d', '80%']), dapAn: ['c'],
      giaiThich: giai('BVA coverage = boundary values tested ÷ boundary values identified = 6/8.', 'Độ phủ BVA = số giá trị biên đã test ÷ số đã xác định = 6/8.') },
    { ma: 'q4', de: hai('Which statement about BVA is TRUE?', 'Phát biểu nào về BVA là ĐÚNG?'), luaChon: lc(['a', 'It can be applied to any partition, ordered or not'], ['b', 'It is an extension of EP that applies only when the partition is ordered (numbers, dates, lengths…)'], ['c', 'It replaces equivalence partitioning'], ['d', 'It is applicable only at component level']), dapAn: ['b'],
      giaiThich: giai('BVA needs an ordering to have a minimum and a maximum; colours or a list of cities have no boundaries. It complements EP and is used at all levels.', 'BVA cần thứ tự để có min và max; màu sắc hay danh sách thành phố không có biên. Nó bổ sung cho EP và dùng ở mọi cấp.') },
    { ma: 'q5', de: hai('Parcels up to and including 2 kg cost 20,000 VND; heavier parcels up to 10 kg cost 35,000 VND. Weight is measured in whole grams. Which pair are the boundary values of the 2 kg boundary?', 'Kiện tới 2 kg (tính cả 2 kg) giá 20.000 đ; nặng hơn tới 10 kg giá 35.000 đ. Cân theo gam nguyên. Cặp nào là giá trị biên của mốc 2 kg?'), luaChon: lc(['a', '1 kg and 2 kg'], ['b', '2,000 g and 2,001 g'], ['c', '1,999 g and 2,000 g'], ['d', '2 kg and 3 kg']), dapAn: ['b'],
      giaiThich: giai('2,000 g is the last value of the 20,000 partition, 2,001 g the first of the 35,000 partition — the step is one gram.', '2.000 g là giá trị cuối của vùng 20.000, 2.001 g là giá trị đầu của vùng 35.000 — bước là một gam.') },
    { ma: 'q6', de: hai('A requirement says “age must be 18 or more” and gives no upper limit. What should the tester do about the upper boundary?', 'Yêu cầu chỉ ghi “tuổi phải từ 18 trở lên”, không có giới hạn trên. Tester xử lý biên trên thế nào?'), luaChon: lc(['a', 'Ignore it — open partitions have no upper boundary to test'], ['b', 'Ask for the missing limit, or state an assumption based on the implementation (e.g. the field size) and test it'], ['c', 'Use 100 because people rarely live longer'], ['d', 'Use the value 18 twice']), dapAn: ['b'],
      giaiThich: giai('An open-ended partition is a requirement gap: clarify it, or document an assumption (data-type or field-size limit) and test that boundary. Inventing 100 silently is a guess, not a test basis.', 'Vùng mở là lỗ hổng yêu cầu: hỏi lại, hoặc ghi giả định (giới hạn kiểu dữ liệu/độ dài trường) rồi test biên đó. Tự đặt 100 mà không nói là đoán, không phải test basis.') },
  ],
  goiY: ['Hai giá trị: (biên, hàng xóm ngoài). Ba giá trị: (dưới, tại, trên).', 'Bước = đơn vị nhỏ nhất của dữ liệu (gam, 0.01, 1 ngày…).'],
  loiHayGap: ['Chọn (c) ở câu 1 — đó là BVA ba giá trị.', 'Ở câu 5 dùng kg làm đơn vị thay vì gam.'],
  giaiThich: '<p>Answers: b · c · c · b · b · b.</p>',
  thuatNgu: tn('bva', 'boundary', 'partition'),
  khaiNiem: ['boundary value analysis'],
});

/* ───────────── E4 · condition template (Bảng 3.1) ───────────── */
const MAU4 = `// The condition template (PE Table 3.1) — one entry per condition.
// Give CONCRETE values: one per partition, and every boundary value exactly once.
const TEMPLATE = {
  guests: {
    validPartitions: [2],          // one value from each VALID partition
    invalidPartitions: [],         // one value from each INVALID partition
    validBoundaries: [],           // every valid boundary value (VB)
    invalidBoundaries: [],         // every invalid boundary value (IB)
  },
  nights: { validPartitions: [], invalidPartitions: [], validBoundaries: [], invalidBoundaries: [] },
  codeLength: { validPartitions: [], invalidPartitions: [], validBoundaries: [], invalidBoundaries: [] },
};
`;
const GIAI4 = `// The condition template (PE Table 3.1) for the room-booking form.
const TEMPLATE = {
  guests: {                         // whole number 1–4
    validPartitions: [2],           // 1–4
    invalidPartitions: [-1, 7, 2.5],// < 1 · > 4 · not a whole number
    validBoundaries: [1, 4],
    invalidBoundaries: [0, 5],
  },
  nights: {                         // whole number 1–30
    validPartitions: [10],
    invalidPartitions: [-3, 45, 1.5],
    validBoundaries: [1, 30],
    invalidBoundaries: [0, 31],
  },
  codeLength: {                     // optional discount code: no code (length 0) OR 6–10 characters
    validPartitions: [0, 8],        // two valid partitions: {0} and 6–10
    invalidPartitions: [3, 15],     // 1–5 and > 10
    validBoundaries: [0, 6, 10],    // 0 is a one-value partition — it is its own boundary
    invalidBoundaries: [1, 5, 11],
  },
};
`;
const K4 = (() => {
  const DK = {
    guests: { vung: 'function (x) { if (typeof x !== "number" || !Number.isInteger(x)) return "NOT_INT"; if (x < 1) return "LOW"; if (x > 4) return "HIGH"; return "OK"; }', hopLe: ['OK'], sai: ['LOW', 'HIGH', 'NOT_INT'], vb: [1, 4], ib: [0, 5] },
    nights: { vung: 'function (x) { if (typeof x !== "number" || !Number.isInteger(x)) return "NOT_INT"; if (x < 1) return "LOW"; if (x > 30) return "HIGH"; return "OK"; }', hopLe: ['OK'], sai: ['LOW', 'HIGH', 'NOT_INT'], vb: [1, 30], ib: [0, 31] },
    codeLength: { vung: 'function (x) { if (typeof x !== "number" || !Number.isInteger(x) || x < 0) return "BAD"; if (x === 0) return "NONE"; if (x <= 5) return "SHORT"; if (x <= 10) return "OK"; return "LONG"; }', hopLe: ['NONE', 'OK'], sai: ['SHORT', 'LONG'], vb: [0, 6, 10], ib: [1, 5, 11] },
  };
  const ds = [];
  for (const [ten, d] of Object.entries(DK)) {
    const lay = `const c = TEMPLATE && TEMPLATE[${JSON.stringify(ten)}]; if (!c) return 'TEMPLATE.${ten} is missing'; const vung = ${d.vung};`;
    const tap = (k) => `const a = c.${k}; if (!Array.isArray(a)) return '${ten}.${k} must be an array';`;
    ds.push(kiemTuy({ en: `${ten}: valid boundaries`, vi: `${ten}: biên hợp lệ` }, new Function(`${lay} ${tap('validBoundaries')} const mong = ${JSON.stringify(d.vb)}; const s = [...new Set(a)].sort((x, y) => x - y); return JSON.stringify(s) === JSON.stringify(mong) && a.length === mong.length ? 'OK' : '${ten}: expected ' + mong.length + ' valid boundary value(s) — got ' + JSON.stringify(a);`)));
    ds.push(kiemTuy({ en: `${ten}: invalid boundaries`, vi: `${ten}: biên không hợp lệ` }, new Function(`${lay} ${tap('invalidBoundaries')} const mong = ${JSON.stringify(d.ib)}; const s = [...new Set(a)].sort((x, y) => x - y); return JSON.stringify(s) === JSON.stringify(mong) && a.length === mong.length ? 'OK' : '${ten}: expected ' + mong.length + ' invalid boundary value(s) — got ' + JSON.stringify(a);`)));
    ds.push(kiemTuy({ en: `${ten}: one value per valid partition`, vi: `${ten}: mỗi vùng hợp lệ một giá trị` }, new Function(`${lay} ${tap('validPartitions')} const p = a.map(vung); const can = ${JSON.stringify(d.hopLe)}; if (p.some((x) => can.indexOf(x) < 0)) return '${ten}: a value in validPartitions is not valid'; return can.every((x) => p.filter((y) => y === x).length === 1) && a.length === can.length ? 'OK' : '${ten}: need exactly one value in each of the ' + can.length + ' valid partition(s)';`)));
    ds.push(kiemTuy({ en: `${ten}: one value per invalid partition`, vi: `${ten}: mỗi vùng không hợp lệ một giá trị` }, new Function(`${lay} ${tap('invalidPartitions')} const p = a.map(vung); const can = ${JSON.stringify(d.sai)}; if (p.some((x) => can.indexOf(x) < 0)) return '${ten}: a value in invalidPartitions is not invalid (or not a number)'; return can.every((x) => p.filter((y) => y === x).length === 1) && a.length === can.length ? 'OK' : '${ten}: need exactly one value in each of the ' + can.length + ' invalid partition(s)';`)));
  }
  return ds;
})();
const E4 = jsDe({
  tieuDe: 'BVA 4 — Fill the condition template (PE Table 3.1) for a room-booking form',
  doKho: 'HARD', phut: 20,
  moTa: {
    en: `<p>Old PE papers (FA23, SU24) ask for the <b>condition template</b>: for every condition, the valid partitions, the invalid partitions, the valid boundaries (VB) and the invalid boundaries (IB). Fill it — with concrete values — for this form:</p>
<ul><li><b>Guests</b>: whole number 1–4.</li><li><b>Nights</b>: whole number 1–30.</li><li><b>Discount code</b> (optional): either empty (no code) or <b>6–10 characters</b>. The condition is its <code>codeLength</code>.</li></ul>
<p>Careful with the discount code: it has <b>two</b> valid partitions.</p>`,
    vi: `<p>Đề PE cũ (FA23, SU24) yêu cầu <b>bảng condition template</b>: với mỗi điều kiện, các vùng hợp lệ, vùng không hợp lệ, biên hợp lệ (VB) và biên không hợp lệ (IB). Hãy điền — bằng giá trị cụ thể — cho form sau:</p>
<ul><li><b>Guests</b>: số nguyên 1–4.</li><li><b>Nights</b>: số nguyên 1–30.</li><li><b>Mã giảm giá</b> (tuỳ chọn): để trống (không có mã) hoặc <b>6–10 ký tự</b>. Điều kiện là <code>codeLength</code>.</li></ul>
<p>Cẩn thận với mã giảm giá: nó có <b>hai</b> vùng hợp lệ.</p>`,
  },
  yeuCau: [
    { en: 'validPartitions / invalidPartitions: exactly ONE concrete value from each partition.', vi: 'validPartitions / invalidPartitions: đúng MỘT giá trị cụ thể từ mỗi vùng.' },
    { en: 'validBoundaries / invalidBoundaries: every two-value boundary value, each once.', vi: 'validBoundaries / invalidBoundaries: mọi giá trị biên hai giá trị, mỗi cái một lần.' },
    { en: 'A whole-number field also has the invalid partition “not a whole number”.', vi: 'Trường số nguyên còn có vùng không hợp lệ “không phải số nguyên”.' },
  ],
  viDu: [{ input: 'guests: whole number 1–4', output: 'valid [2] · invalid [-1, 7, 2.5] · VB [1, 4] · IB [0, 5]', explanation: 'Three invalid partitions: below, above, not a whole number.|||Ba vùng sai: dưới, trên, không phải số nguyên.' }],
  goiY: ['Mã giảm giá: vùng {0} (không có mã) là hợp lệ VÀ là biên của chính nó; vùng 1–5 sai; 6–10 đúng; > 10 sai.', 'Biên của codeLength: VB 0, 6, 10 · IB 1, 5, 11.'],
  loiHayGap: ['Ghi validBoundaries [1, 2, 3, 4] — đó là liệt kê cả vùng, không phải biên.', 'Bỏ sót vùng {0} của mã giảm giá vì “trống là không có dữ liệu”.', 'Quên vùng “không phải số nguyên” (2.5 khách).'],
  giaiThich: '<p>guests VB {1,4} IB {0,5}; nights VB {1,30} IB {0,31}; codeLength VB {0,6,10} IB {1,5,11}. Each invalid partition gets one representative; each valid partition one value.</p>',
  thuatNgu: [...tn('bva', 'ep', 'partition', 'boundary'), { en: 'condition template', vi: 'bảng điều kiện (Bảng 3.1 của PE): vùng/biên đúng-sai cho từng điều kiện' }],
  khaiNiem: ['boundary value analysis', 'equivalence partitioning', 'condition template'],
  tep: { 'answer.js': [MAU4, GIAI4] },
  kiem: K4,
});

/* ───────────── E5 · test theo biên giết mutant off-by-one ───────────── */
const DUNG5 = `function bookingOk(guests, nights, code) {
  if (!Number.isInteger(guests) || guests < 1 || guests > 4) return false;
  if (!Number.isInteger(nights) || nights < 1 || nights > 30) return false;
  const n = String(code).length;
  if (n !== 0 && (n < 6 || n > 10)) return false;
  return true;
}`;
const doi5 = (a, b) => { if (!DUNG5.includes(a)) throw new Error('mutant 4.3: ' + a); return DUNG5.replace(a, b); };
const E5 = dotBienDe({
  tieuDe: 'BVA 5 — Boundary tests that kill off-by-one mutants (bookingOk)',
  doKho: 'HARD', phut: 18,
  moTa: {
    en: `<p><code>bookingOk(guests, nights, code)</code> returns <code>true</code> when the form of BVA 4 is valid (guests 1–4, nights 1–30, code empty or 6–10 characters), otherwise <code>false</code>.</p>
<p>Nine mutants each move <b>one boundary by one step</b> (<code>&lt;</code> ↔ <code>&lt;=</code>, 4 → 5…). A test set with only “middle” values (EP) kills none of them — that is why BVA exists. Write boundary tests that kill them all.</p>`,
    vi: `<p><code>bookingOk(guests, nights, code)</code> trả <code>true</code> khi form của BVA 4 hợp lệ (khách 1–4, đêm 1–30, mã trống hoặc 6–10 ký tự), ngược lại <code>false</code>.</p>
<p>Chín mutant, mỗi cái dời <b>một biên đi một bước</b> (<code>&lt;</code> ↔ <code>&lt;=</code>, 4 → 5…). Bộ test chỉ có giá trị “giữa vùng” (EP) không giết được cái nào — đó là lý do có BVA. Viết test theo biên để giết hết.</p>`,
  },
  yeuCau: [
    { en: 'Use two-value BVA on every boundary: guests 0|1, 4|5; nights 0|1, 30|31; code length 0 (empty), 5|6, 10|11.', vi: 'Dùng BVA hai giá trị cho mọi biên: khách 0|1, 4|5; đêm 0|1, 30|31; độ dài mã 0 (trống), 5|6, 10|11.' },
    { en: 'At least 8 tests (test.each rows count as tests).', vi: 'Ít nhất 8 test (mỗi dòng test.each là một test).' },
  ],
  viDu: [{ input: "expect(bookingOk(4, 2, '')).toBe(true); expect(bookingOk(5, 2, '')).toBe(false)", output: 'kills both mutants on the guests upper boundary', explanation: 'A mutant that rejects 4 fails the first, one that accepts 5 fails the second.|||Mutant từ chối 4 trượt câu đầu, mutant nhận 5 trượt câu sau.' }],
  goiY: ['Viết hai test.each: một bảng các giá trị PHẢI được nhận (biên đúng), một bảng các giá trị PHẢI bị từ chối (biên sai).', 'Mã dài 6 ký tự: "ABCDEF"; 5 ký tự: "ABCDE"; 11 ký tự: "ABCDEFGHIJK".'],
  loiHayGap: ['Chỉ test 2 khách, 10 đêm, mã 8 ký tự — giữa vùng, không giết được mutant nào.', 'Đổi nhiều giá trị cùng lúc trong một test — test trượt nhưng không biết biên nào.'],
  giaiThich: '<p>Eight valid boundary rows (1 and 4 guests, 1 and 30 nights, empty / 6 / 10-character code) and six invalid boundary rows (0, 5 guests; 0, 31 nights; 5, 11 characters) kill all nine mutants. JUnit 5: <code>@ParameterizedTest @ValueSource(ints = {1, 4})</code> for accepted guests, <code>@ValueSource(ints = {0, 5})</code> for rejected ones.</p>',
  thuatNgu: [...TN_TEST(), ...tn('bva', 'offByOne')],
  ten: ['bookingOk'], dung: DUNG5, minTest: 8,
  dotBien: [
    { ma: 'M1', moTa: { en: '1 guest rejected (guests <= 1)', vi: '1 khách bị từ chối (guests <= 1)' }, code: doi5('guests < 1', 'guests <= 1') },
    { ma: 'M2', moTa: { en: '4 guests rejected (guests >= 4)', vi: '4 khách bị từ chối (guests >= 4)' }, code: doi5('guests > 4', 'guests >= 4') },
    { ma: 'M3', moTa: { en: '5 guests accepted (guests > 5)', vi: '5 khách được nhận (guests > 5)' }, code: doi5('guests > 4', 'guests > 5') },
    { ma: 'M4', moTa: { en: '0 nights accepted (nights < 0)', vi: '0 đêm được nhận (nights < 0)' }, code: doi5('nights < 1', 'nights < 0') },
    { ma: 'M5', moTa: { en: '31 nights accepted (nights > 31)', vi: '31 đêm được nhận (nights > 31)' }, code: doi5('nights > 30', 'nights > 31') },
    { ma: 'M6', moTa: { en: 'a 6-character code rejected (n < 7)', vi: 'mã 6 ký tự bị từ chối (n < 7)' }, code: doi5('n < 6', 'n < 7') },
    { ma: 'M7', moTa: { en: 'an 11-character code accepted (n > 11)', vi: 'mã 11 ký tự được nhận (n > 11)' }, code: doi5('n > 10', 'n > 11') },
    { ma: 'M8', an: true, moTa: { en: 'an empty code rejected', vi: 'mã trống bị từ chối' }, code: doi5('n !== 0 && ', '') },
    { ma: 'M9', an: true, moTa: { en: 'a 5-character code accepted (n < 5)', vi: 'mã 5 ký tự được nhận (n < 5)' }, code: doi5('n < 6', 'n < 5') },
  ],
  dauTest: `// Write boundary-value tests for bookingOk(guests, nights, code).
test('a typical booking is accepted', () => {
  expect(bookingOk(2, 10, 'SUMMER25')).toBe(true);
});
`,
  giaiTest: `// Two-value BVA on every boundary of bookingOk(guests, nights, code).
describe('bookingOk — boundary values', () => {
  test.each([
    [1, 10, ''], [4, 10, ''],              // guests: lower and upper valid boundary
    [2, 1, ''], [2, 30, ''],               // nights
    [2, 10, 'ABCDEF'], [2, 10, 'ABCDEFGHIJ'], // code length 6 and 10
  ])('accepts guests=%i nights=%i code=%p', (g, n, c) => {
    expect(bookingOk(g, n, c)).toBe(true);
  });

  test.each([
    [0, 10, ''], [5, 10, ''],              // guests: invalid boundaries
    [2, 0, ''], [2, 31, ''],               // nights
    [2, 10, 'ABCDE'], [2, 10, 'ABCDEFGHIJK'], // code length 5 and 11
  ])('rejects guests=%i nights=%i code=%p', (g, n, c) => {
    expect(bookingOk(g, n, c)).toBe(false);
  });
});
`,
  boYeu: [{
    ten: 'chỉ giá trị giữa vùng (EP)', tep: { 'tests.js': "test.each([[2, 10, 'SUMMER25', true], [-2, 10, '', false], [9, 10, '', false], [2, 40, '', false], [2, 10, 'ABC', false], [2, 10, 'ABCDEFGHIJKLMNOP', false], [2, -5, '', false], [2, 10, '', true]])('%i %i %p', (g, n, c, e) => { expect(bookingOk(g, n, c)).toBe(e); });\n" },
    phaiTruot: ['Kills mutant M1', 'Kills mutant M2', 'Kills mutant M3'],
  }],
});

export default doiDau({
  slug: 'swt301-blackbox-bva-template',
  ten: '4.3 Boundary value analysis & the condition template',
  moTaModule: 'BVA hai và ba giá trị (để ý độ chính xác), câu hỏi kiểu ISTQB, điền bảng condition template của PE câu 3 cũ (có vùng tuỳ chọn hai vùng hợp lệ) và viết test theo biên giết 9 mutant off-by-one.',
  khoa: KHOA,
  baiHoc: 'swt301-blackbox-bva-template',
  de: [E1, E2, E3, E4, E5],
});
