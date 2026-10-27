/**
 * SWT301 · LAB CHƯƠNG 4 — Black-box test design trọn bộ trên một hệ thống nhỏ: thẻ căng tin FPT.
 * A. EP + BVA (condition template) cho số tiền nạp · B. bảng quyết định giá suất ăn · C. chuyển trạng thái thẻ
 * D. use case "Mua suất ăn" chạy qua hệ thống tham chiếu. Thang 10, chấm tự động từng phần.
 */
import { doiDau, KHOA, svg, bangHtml, kiemTestCase, NOP_BAI, tn } from './_chung.mjs';
import { kiemTuy } from './_de.mjs';

/* ─────────── A. Nạp tiền ─────────── */
const VUNG_NAP = function (x) {
  if (typeof x !== 'number' || !Number.isInteger(x) || x % 1000 !== 0) return 'MULT';
  if (x < 20000) return 'LOW';
  if (x < 500000) return 'NOBONUS';
  if (x <= 2000000) return 'BONUS';
  return 'HIGH';
};
const kA = (() => {
  const lay = `const c = typeof TOPUP !== 'undefined' ? TOPUP : null; if (!c) return 'TOPUP is missing'; const vung = ${VUNG_NAP.toString()};`;
  const tap = (k) => `const a = c.${k}; if (!Array.isArray(a)) return 'TOPUP.${k} must be an array';`;
  const bo = (k, mong, moTa) => kiemTuy(moTa, new Function(`${lay} ${tap(k)} const m = ${JSON.stringify(mong)}; const s = [...new Set(a)].sort((x, y) => x - y); return JSON.stringify(s) === JSON.stringify(m) && a.length === m.length ? 'OK' : 'expected ' + m.length + ' value(s) — got ' + JSON.stringify(a);`), { nhom: 'f1' });
  const vung = (k, can, moTa) => kiemTuy(moTa, new Function(`${lay} ${tap(k)} const p = a.map(vung); const can = ${JSON.stringify(can)}; if (p.some((x) => can.indexOf(x) < 0)) return 'a value is in the wrong kind of partition'; return can.every((x) => p.filter((y) => y === x).length === 1) && a.length === can.length ? 'OK' : 'need exactly one value in each of the ' + can.length + ' partition(s)';`), { nhom: 'f1' });
  return [
    vung('validPartitions', ['NOBONUS', 'BONUS'], { en: 'A — one value per valid partition (no bonus · bonus)', vi: 'A — mỗi vùng hợp lệ một giá trị (không thưởng · có thưởng)' }),
    vung('invalidPartitions', ['LOW', 'HIGH', 'MULT'], { en: 'A — one value per invalid partition (too small · too large · not a multiple of 1,000)', vi: 'A — mỗi vùng không hợp lệ một giá trị (quá nhỏ · quá lớn · không phải bội 1.000)' }),
    bo('validBoundaries', [20000, 499000, 500000, 2000000], { en: 'A — valid boundaries (including the bonus boundary)', vi: 'A — biên hợp lệ (kể cả biên thưởng)' }),
    bo('invalidBoundaries', [19000, 2001000], { en: 'A — invalid boundaries', vi: 'A — biên không hợp lệ' }),
    kiemTuy({ en: 'A — bonus of the smallest top-up that earns a bonus', vi: 'A — tiền thưởng của lần nạp nhỏ nhất có thưởng' }, new Function("return TOPUP.bonusAtThreshold === 25000 ? 'OK' : 'not right: 5% of the smallest amount of the bonus partition';"), { nhom: 'f1' }),
  ];
})();

/* ─────────── B. Giá suất ăn ─────────── */
const GIA = function (t) {
  const base = t.isCombo ? 50000 : 35000;
  let p = t.isStudent ? (base * 90) / 100 : base;
  if (t.isCombo && t.beforeEleven) p -= 5000;
  return p;
};
const LUAT = function (t) {
  if (!t.isCombo) return t.isStudent ? 'R1' : 'R2';
  return t.isStudent ? (t.beforeEleven ? 'R3' : 'R4') : (t.beforeEleven ? 'R5' : 'R6');
};
const kB = (() => {
  const chung = `if (!Array.isArray(MEAL_TESTS) || !MEAL_TESTS.length) return 'MEAL_TESTS must be a non-empty array';
    const bad = MEAL_TESTS.findIndex((t) => ['isStudent', 'isCombo', 'beforeEleven'].some((k) => typeof t[k] !== 'boolean'));
    if (bad >= 0) return 'test #' + (bad + 1) + ': isStudent, isCombo and beforeEleven must be true/false';
    const gia = ${GIA.toString()}; const luat = ${LUAT.toString()};`;
  const R = { R1: 'R1 student · single meal', R2: 'R2 staff · single meal', R3: 'R3 student · combo · before 11:00', R4: 'R4 student · combo · from 11:00', R5: 'R5 staff · combo · before 11:00', R6: 'R6 staff · combo · from 11:00' };
  return [
    kiemTuy({ en: 'B — every expected price is right', vi: 'B — mọi giá mong đợi đều đúng' }, new Function(`${chung} const i = MEAL_TESTS.findIndex((t) => Number(t.expected) !== gia(t)); return i < 0 ? 'OK' : 'test #' + (i + 1) + ': expected ' + gia(MEAL_TESTS[i]);`), { nhom: 'f2' }),
    ...Object.entries(R).map(([k, ten]) => kiemTuy({ en: `B — collapsed rule ${ten}`, vi: `B — luật rút gọn ${ten}` }, new Function(`${chung} return MEAL_TESTS.some((t) => luat(t) === '${k}' && Number(t.expected) === gia(t)) ? 'OK' : 'rule ${k} not covered yet';`), { nhom: 'f2' })),
    kiemTuy({ en: 'B — one test per collapsed rule (6 tests)', vi: 'B — mỗi luật rút gọn một test (6 test)' }, new Function(`${chung} return MEAL_TESTS.length === 6 && new Set(MEAL_TESTS.map(luat)).size === 6 ? 'OK' : MEAL_TESTS.length + ' tests — the collapsed table has 6 rules';`), { nhom: 'f2' }),
  ];
})();

/* ─────────── C. Trạng thái thẻ ─────────── */
const SIM_THE = function () {
  const T = [['T1', 'ACTIVE', 'lock', 'LOCKED'], ['T2', 'LOCKED', 'unlock', 'ACTIVE'], ['T3', 'ACTIVE', 'reportLost', 'BLOCKED'], ['T4', 'LOCKED', 'reportLost', 'BLOCKED'],
    ['T5', 'ACTIVE', 'expire', 'EXPIRED'], ['T6', 'LOCKED', 'expire', 'EXPIRED'], ['T7', 'EXPIRED', 'renew', 'ACTIVE']];
  return { T, buoc: (s, e) => T.find((t) => t[1] === s && t[2] === e) || null };
};
const kC = (() => {
  const chung = `const { T, buoc } = (${SIM_THE.toString()})();
    if (!Array.isArray(CARD_SEQUENCES) || !CARD_SEQUENCES.length) return 'CARD_SEQUENCES must be a non-empty array';
    const chay = (ev) => { let s = 'ACTIVE'; const d = []; for (let i = 0; i < ev.length; i++) { const t = buoc(s, ev[i]); if (!t) return { loi: '"' + ev[i] + '" is not valid in ' + s }; d.push(t[0]); s = t[3]; } return { d, s }; };
    const kq = CARD_SEQUENCES.map((q) => chay(Array.isArray(q) ? q : []));`;
  return [
    kiemTuy({ en: 'C — every sequence is valid', vi: 'C — mọi chuỗi hợp lệ' }, new Function(`${chung} const i = kq.findIndex((r) => r.loi); return i < 0 ? 'OK' : 'sequence #' + (i + 1) + ': ' + kq[i].loi;`), { nhom: 'f3' }),
    kiemTuy({ en: 'C — 0-switch coverage: all 7 valid transitions', vi: 'C — phủ 0-switch: đủ 7 chuyển đổi hợp lệ' }, new Function(`${chung} const c = new Set(); kq.forEach((r) => (r.d || []).forEach((x) => c.add(x))); const thieu = T.map((t) => t[0]).filter((x) => !c.has(x)); return thieu.length ? 'not covered: ' + thieu.join(', ') : 'OK';`), { nhom: 'f3' }),
    kiemTuy({ en: 'C — minimum number of sequences (2)', vi: 'C — số chuỗi tối thiểu (2)' }, new Function(`${chung} return CARD_SEQUENCES.length === 2 ? 'OK' : CARD_SEQUENCES.length + ' sequences — two transitions lead into the final state BLOCKED';`), { nhom: 'f3' }),
    kiemTuy({ en: 'C — number of invalid state/event pairs', vi: 'C — số cặp trạng thái/sự kiện không hợp lệ' }, new Function("return CARD_INVALID_COUNT === 13 ? 'OK' : 'not right — 4 states × 5 events, minus the valid transitions';"), { nhom: 'f3' }),
    kiemTuy({ en: 'C — the negative test for a BLOCKED card', vi: 'C — test âm cho thẻ BLOCKED' }, new Function(`const { buoc } = (${SIM_THE.toString()})(); const q = CARD_NEGATIVE; if (!q || !Array.isArray(q.events) || !q.events.length) return 'CARD_NEGATIVE must be { events: [...], expectedState }'; let s = 'ACTIVE'; for (let i = 0; i < q.events.length - 1; i++) { const t = buoc(s, q.events[i]); if (!t) return 'only the last event may be invalid'; s = t[3]; } if (s !== 'BLOCKED') return 'the prefix must bring the card to BLOCKED (it reaches ' + s + ')'; if (buoc(s, q.events[q.events.length - 1])) return 'the last event must be invalid'; return q.expectedState === 'BLOCKED' ? 'OK' : 'a rejected event leaves the card BLOCKED';`), { nhom: 'f3' }),
  ];
})();

/* ─────────── D. Use case Mua suất ăn ─────────── */
const KIOSK = function (d) {
  const s = (k) => String(d[k] == null ? '' : d[k]).trim();
  const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const st = s('cardState');
  if (st === 'BLOCKED') return 'Card is blocked. Please contact the canteen office.';
  if (st === 'LOCKED') return 'Card is locked. Unlock it at the counter.';
  if (st === 'EXPIRED') return 'Card has expired. Renew it for the new term.';
  const bal = Number(s('balance')), price = Number(s('price'));
  if (bal < price) return 'Insufficient balance. Please top up ' + fmt(price - bal) + ' VND.';
  return 'Paid. New balance: ' + fmt(bal - price) + ' VND.';
};
const NHAN_KIOSK = function (d, out) {
  const t = [];
  if (out.indexOf('Card is blocked') === 0) t.push('E_BLOCKED');
  if (out.indexOf('Card is locked') === 0) t.push('E_LOCKED');
  if (out.indexOf('Card has expired') === 0) t.push('E_EXPIRED');
  if (out.indexOf('Insufficient') === 0) { t.push('E_FUNDS'); if (Number(d.price) - Number(d.balance) === 1000) t.push('B_SHORT_1000'); }
  if (out.indexOf('Paid') === 0) { t.push('MAIN'); if (Number(d.balance) === Number(d.price)) t.push('B_EXACT'); }
  return t;
};
const DS_D = [
  ['UC-MAIN', 'Main scenario: an active card with enough balance pays for the meal', { cardState: 'ACTIVE', balance: '100000', price: '45000' }, 'Paid. New balance: 55,000 VND.'],
  ['UC-E1', 'Extension: the card is locked', { cardState: 'LOCKED', balance: '100000', price: '45000' }, 'Card is locked. Unlock it at the counter.'],
  ['UC-E2', 'Extension: the card is blocked (reported lost)', { cardState: 'BLOCKED', balance: '100000', price: '45000' }, 'Card is blocked. Please contact the canteen office.'],
  ['UC-E3', 'Extension: the card has expired', { cardState: 'EXPIRED', balance: '100000', price: '45000' }, 'Card has expired. Renew it for the new term.'],
  ['UC-E4', 'Extension: the balance is lower than the price', { cardState: 'ACTIVE', balance: '20000', price: '45000' }, 'Insufficient balance. Please top up 25,000 VND.'],
  ['UC-B1', 'Boundary: the balance equals the price', { cardState: 'ACTIVE', balance: '45000', price: '45000' }, 'Paid. New balance: 0 VND.'],
  ['UC-B2', 'Boundary: the balance is 1,000 VND short', { cardState: 'ACTIVE', balance: '44000', price: '45000' }, 'Insufficient balance. Please top up 1,000 VND.'],
].map(([id, description, data, expected]) => ({ id, description, data, expected }));
const tcJs = (t) => `  {
    id: '${t.id}', description: '${t.description}',
    precondition: 'Kiosk is open; the card is placed on the reader',
    steps: ['Place the card on the reader', 'Choose a meal of ${Number(t.data.price).toLocaleString('en-US')} VND', 'Confirm the payment'],
    data: { cardState: '${t.data.cardState}', balance: '${t.data.balance}', price: '${t.data.price}' },
    expected: '${t.expected}',
  },`;
const kD = kiemTestCase({
  bien: 'MEAL_UC_TESTS', heThong: KIOSK.toString(), nhan: NHAN_KIOSK.toString(), truongData: ['cardState', 'balance', 'price'],
  nhomCauTruc: 'f4', nhomKyVong: 'f4', toiDa: 20,
  khoi: [{
    moTa: { en: 'D — use case path', vi: 'D — đường của use case' }, nhom: 'f4', tungMuc: true,
    can: [
      { ma: 'MAIN', ten: 'main success scenario' }, { ma: 'E_LOCKED', ten: 'extension: card locked' }, { ma: 'E_BLOCKED', ten: 'extension: card blocked' },
      { ma: 'E_EXPIRED', ten: 'extension: card expired' }, { ma: 'E_FUNDS', ten: 'extension: insufficient balance' },
      { ma: 'B_EXACT', ten: 'boundary: balance = price' }, { ma: 'B_SHORT_1000', ten: 'boundary: 1,000 VND short' },
    ],
  }],
});

/* ─────────── Bản in ─────────── */
const SO_DO_THE = svg({
  w: 620, h: 300, tieuDe: 'Canteen card — states',
  nut: [
    { id: 's', x: 30, y: 150, hinh: 'dau', nhan: '' },
    { id: 'ACTIVE', x: 130, y: 150, hinh: 'tt', nhan: 'ACTIVE', rong: 90 },
    { id: 'LOCKED', x: 340, y: 70, hinh: 'tt', nhan: 'LOCKED', rong: 90 },
    { id: 'EXPIRED', x: 340, y: 240, hinh: 'tt', nhan: 'EXPIRED', rong: 100 },
    { id: 'BLOCKED', x: 545, y: 150, hinh: 'tt', nhan: 'BLOCKED', rong: 100, mau: '#fee2e2' },
  ],
  canh: [
    { tu: 's', den: 'ACTIVE' },
    { tu: 'ACTIVE', den: 'LOCKED', nhan: 'T1 lock', cong: 22 }, { tu: 'LOCKED', den: 'ACTIVE', nhan: 'T2 unlock', cong: 22 },
    { tu: 'ACTIVE', den: 'BLOCKED', nhan: 'T3 reportLost' }, { tu: 'LOCKED', den: 'BLOCKED', nhan: 'T4 reportLost' },
    { tu: 'ACTIVE', den: 'EXPIRED', nhan: 'T5 expire', cong: -22 }, { tu: 'LOCKED', den: 'EXPIRED', nhan: 'T6 expire' },
    { tu: 'EXPIRED', den: 'ACTIVE', nhan: 'T7 renew', cong: -22 },
  ],
  chu: [{ x: 545, y: 185, nhan: 'final (cannot be undone)', co: 11 }],
});
const BANG_GIA = bangHtml(['Meal', 'Base price', 'Student', 'Before 11:00'], [['Single meal', '35,000', '10% off', 'no change'], ['Combo meal', '50,000', '10% off', '−5,000 after the student discount']]);

const BAN_IN = {
  tieuDe: 'Lab 4 — Black-box Test Design: the FPT Canteen Card',
  phu: { en: 'Chapter 4 lab · EP + BVA · decision table · state transition · use case · 10 marks', vi: 'Lab chương 4 · EP + BVA · bảng quyết định · chuyển trạng thái · use case · 10 điểm' },
  moTa: {
    en: `<p>The canteen of FPT University uses a prepaid card. You are the tester of its kiosk software and you only have the specification below (black-box). Design the tests with the right technique for each part, the way SWT4 teaches: <b>EP and BVA</b> for the input fields, a <b>decision table</b> for the business rule, <b>state transition testing</b> for the card life cycle and <b>use case testing</b> for the end-to-end purchase.</p>`,
    vi: `<p>Căng tin Đại học FPT dùng thẻ trả trước. Bạn là tester của phần mềm ki-ốt và chỉ có đặc tả bên dưới (black-box). Hãy thiết kế test bằng đúng kỹ thuật cho từng phần như SWT4 dạy: <b>EP và BVA</b> cho các trường nhập, <b>bảng quyết định</b> cho quy tắc nghiệp vụ, <b>chuyển trạng thái</b> cho vòng đời thẻ và <b>use case</b> cho việc mua hàng đầu-cuối.</p>`,
  },
  chucNangChinh: [
    { en: 'A. Top-up amount — condition template (EP + BVA).', vi: 'A. Số tiền nạp — condition template (EP + BVA).' },
    { en: 'B. Meal price — collapsed decision table and its tests.', vi: 'B. Giá suất ăn — bảng quyết định rút gọn và test.' },
    { en: 'C. Card life cycle — 0-switch coverage and negative tests.', vi: 'C. Vòng đời thẻ — phủ 0-switch và test âm.' },
    { en: 'D. Use case “Buy a meal” — main scenario, extensions, boundaries.', vi: 'D. Use case “Mua suất ăn” — kịch bản chính, nhánh, biên.' },
  ],
  yeuCauChung: [
    { en: 'Concrete values everywhere; expected results from the specification.', vi: 'Giá trị cụ thể ở mọi chỗ; kết quả mong đợi theo đặc tả.' },
    { en: 'Each part is graded on its own file — a mistake in one part does not cost marks in another (unless the file does not load).', vi: 'Mỗi phần chấm trên tệp riêng — sai ở phần này không mất điểm phần khác (trừ khi tệp không nạp được).' },
  ],
  cayThuMuc: `answers/
├── a-topup.js        ← const TOPUP = { validPartitions, invalidPartitions, validBoundaries, invalidBoundaries, bonusAtThreshold }
├── b-meal.js         ← const MEAL_TESTS = [ { isStudent, isCombo, beforeEleven, expected } ]
├── c-card.js         ← const CARD_SEQUENCES = [ [...events] ]; const CARD_INVALID_COUNT; const CARD_NEGATIVE = { events, expectedState }
└── d-usecase.js      ← const MEAL_UC_TESTS = [ { id, description, precondition, steps, data, expected } ]`,
  wireframe: `+-----------------------------------------------+
|  FPT CANTEEN KIOSK              [card reader] |
+-----------------------------------------------+
|  Card: ACTIVE        Balance: 100,000 VND     |
|  [ Single meal 35,000 ]  [ Combo 50,000 ]     |
|  Student price applied: -10%                  |
|            [ Confirm payment ]                |
|  Paid. New balance: 55,000 VND.               |
+-----------------------------------------------+`,
  moHinh: {
    ten: 'Specification',
    truong: [
      ['Top-up amount', 'whole VND', { en: 'multiple of 1,000, from 20,000 to 2,000,000; from 500,000 a 5% bonus is credited', vi: 'bội của 1.000, từ 20.000 tới 2.000.000; từ 500.000 được cộng thưởng 5%' }],
      ['Meal price', 'VND', { en: 'single 35,000 · combo 50,000 · students 10% off · combos bought before 11:00 cost 5,000 less (after the student discount)', vi: 'suất thường 35.000 · combo 50.000 · sinh viên giảm 10% · combo mua trước 11:00 bớt 5.000 (sau khi giảm sinh viên)' }],
      ['Card state', 'ACTIVE · LOCKED · EXPIRED · BLOCKED', { en: 'see the diagram; BLOCKED (reported lost) is final', vi: 'xem sơ đồ; BLOCKED (báo mất) là trạng thái cuối' }],
      ['Kiosk messages', 'text', { en: 'see Part D', vi: 'xem Phần D' }],
    ],
  },
  chucNang: [
    {
      ten: { en: 'A. Top-up amount — EP + BVA', vi: 'A. Số tiền nạp — EP + BVA' }, diem: 2.5,
      moTa: { en: 'A top-up must be a <b>multiple of 1,000 VND</b> between <b>20,000</b> and <b>2,000,000</b>. Top-ups of <b>500,000 or more</b> receive a <b>5% bonus</b>.', vi: 'Lần nạp phải là <b>bội của 1.000 đ</b> trong khoảng <b>20.000</b> tới <b>2.000.000</b>. Nạp <b>từ 500.000</b> được <b>thưởng 5%</b>.' },
      yeuCau: [
        { en: 'One value per valid partition (no bonus / bonus) and per invalid partition (too small / too large / not a multiple of 1,000).', vi: 'Mỗi vùng hợp lệ (không thưởng / có thưởng) và mỗi vùng không hợp lệ (quá nhỏ / quá lớn / không phải bội 1.000) một giá trị.' },
        { en: 'All two-value boundaries (the step is 1,000): valid ones — including both sides of the bonus boundary — and invalid ones. Plus the bonus credited at the bonus threshold.', vi: 'Mọi biên hai giá trị (bước 1.000): biên hợp lệ — gồm cả hai phía của biên thưởng — và biên không hợp lệ. Cộng tiền thưởng ở ngưỡng thưởng.' },
      ],
      hook: ['equivalence partitioning', 'boundary value analysis'],
    },
    {
      ten: { en: 'B. Meal price — decision table', vi: 'B. Giá suất ăn — bảng quyết định' }, diem: 2.5,
      moTa: { en: `Conditions: Student? · Combo? · Before 11:00? ${BANG_GIA}`, vi: `Điều kiện: Sinh viên? · Combo? · Trước 11:00? ${BANG_GIA}` },
      yeuCau: [
        { en: 'Build the full table (8 rules), collapse it (the time does not matter for single meals ⇒ 6 rules) and write ONE test per collapsed rule with the expected price.', vi: 'Lập bảng đầy đủ (8 luật), rút gọn (giờ không ảnh hưởng suất thường ⇒ 6 luật) và viết MỘT test cho mỗi luật rút gọn kèm giá mong đợi.' },
      ],
      hook: ['decision table testing'],
    },
    {
      ten: { en: 'C. Card life cycle — state transition', vi: 'C. Vòng đời thẻ — chuyển trạng thái' }, diem: 2.5,
      moTa: { en: `${SO_DO_THE}`, vi: `${SO_DO_THE}` },
      yeuCau: [
        { en: '<code>CARD_SEQUENCES</code>: the minimum number of event sequences (each from ACTIVE) that covers all 7 transitions.', vi: '<code>CARD_SEQUENCES</code>: số chuỗi sự kiện tối thiểu (mỗi chuỗi từ ACTIVE) phủ đủ 7 chuyển đổi.' },
        { en: '<code>CARD_INVALID_COUNT</code>: invalid state/event pairs. <code>CARD_NEGATIVE</code>: a test that shows a BLOCKED card rejects an event.', vi: '<code>CARD_INVALID_COUNT</code>: số cặp trạng thái/sự kiện không hợp lệ. <code>CARD_NEGATIVE</code>: một test cho thấy thẻ BLOCKED từ chối sự kiện.' },
      ],
      hook: ['0-switch coverage', 'invalid transitions'],
    },
    {
      ten: { en: 'D. Use case “Buy a meal”', vi: 'D. Use case “Mua suất ăn”' }, diem: 2.5,
      moTa: {
        en: '<p>Main scenario: the student places an ACTIVE card on the reader, chooses a meal, the kiosk debits the price and shows <code>Paid. New balance: [x] VND.</code> Extensions: LOCKED card → <code>Card is locked. Unlock it at the counter.</code> · BLOCKED → <code>Card is blocked. Please contact the canteen office.</code> · EXPIRED → <code>Card has expired. Renew it for the new term.</code> · balance below the price → <code>Insufficient balance. Please top up [missing] VND.</code> (amounts with thousands separators).</p>',
        vi: '<p>Kịch bản chính: sinh viên đặt thẻ ACTIVE lên đầu đọc, chọn suất, ki-ốt trừ tiền và hiện <code>Paid. New balance: [x] VND.</code> Nhánh: thẻ LOCKED → <code>Card is locked. Unlock it at the counter.</code> · BLOCKED → <code>Card is blocked. Please contact the canteen office.</code> · EXPIRED → <code>Card has expired. Renew it for the new term.</code> · số dư nhỏ hơn giá → <code>Insufficient balance. Please top up [thiếu] VND.</code> (số tiền có dấu phân cách hàng nghìn).</p>',
      },
      yeuCau: [
        { en: 'One test case per path (main + 4 extensions) and the two boundary cases of the balance check (balance = price; 1,000 VND short).', vi: 'Mỗi đường một test case (chính + 4 nhánh) và hai ca biên của bước kiểm số dư (số dư = giá; thiếu 1.000 đ).' },
      ],
      hook: ['use case testing', 'BVA'],
    },
  ],
  idBatBuoc: [
    ['TOPUP', 'answers/a-topup.js'], ['MEAL_TESTS', 'answers/b-meal.js'],
    ['CARD_SEQUENCES · CARD_INVALID_COUNT · CARD_NEGATIVE', 'answers/c-card.js'], ['MEAL_UC_TESTS', 'answers/d-usecase.js'],
  ],
  truDiem: [
    { en: 'Forgetting that 499,000 / 500,000 is a boundary although both values are valid (the bonus partition).', vi: 'Quên 499.000 / 500.000 là biên dù cả hai đều hợp lệ (vùng có thưởng).' },
    { en: 'Testing all 8 rules of the full meal table — two of them are redundant after collapsing.', vi: 'Test cả 8 luật của bảng đầy đủ — hai luật thừa sau khi rút gọn.' },
    { en: 'Applying the −5,000 before the student discount: (50,000 − 5,000) × 90% = 40,500, but the price table applies it AFTER the discount ⇒ 40,000.', vi: 'Trừ 5.000 trước khi giảm sinh viên: (50.000 − 5.000) × 90% = 40.500, nhưng bảng giá trừ SAU khi giảm ⇒ 40.000.' },
    { en: 'One giant sequence for the card: BLOCKED is final, so two sequences are needed.', vi: 'Một chuỗi khổng lồ cho thẻ: BLOCKED là trạng thái cuối nên cần hai chuỗi.' },
  ],
  nopBai: NOP_BAI,
};

const GIAI_D = `// D. Use case “Buy a meal”: main scenario + 4 extensions + 2 boundary cases of the balance check.
const MEAL_UC_TESTS = [
${DS_D.map(tcJs).join('\n')}
];
`;

export default doiDau({
  slug: 'swt301-4-lab-blackbox-canteen-card',
  ten: 'Lab 4 — Black-box Test Design (FPT Canteen Card)',
  moTaModule: 'Lab chương 4 dạng bản in: thẻ căng tin FPT — condition template EP/BVA cho số tiền nạp, bảng quyết định rút gọn giá suất ăn, phủ 0-switch + test âm cho vòng đời thẻ, use case mua suất ăn chạy qua hệ thống tham chiếu. Thang 10.',
  khoa: KHOA,
  baiHoc: 'swt301-blackbox-use-case',
  de: [{
    dangBai: 'lab',
    tieuDe: 'Lab 4 — Black-box Test Design for the FPT Canteen Card',
    doKho: 'HARD', phut: 100, diem: 100, ngonNgu: 'javascript',
    viDu: [{ input: 'Combo, student, before 11:00', output: '50,000 × 90% − 5,000 = 40,000 VND', explanation: 'Collapsed rule R3 of the meal decision table.|||Luật rút gọn R3 của bảng giá.' }],
    khaiNiem: ['equivalence partitioning', 'boundary value analysis', 'decision table testing', 'state transition testing', 'use case testing'],
    tienQuyet: ['SWT301 4.2–4.6'],
    the: ['swt301', 'lab', 'black-box'],
    banIn: BAN_IN,
    thuatNgu: tn('ep', 'bva', 'decisionTable', 'stateTransition', 'expected', 'precondition'),
    goiY: [
      'A: vùng có thưởng tạo một biên NẰM GIỮA vùng hợp lệ: 499.000 (không thưởng) | 500.000 (có thưởng) — cả hai là biên hợp lệ.',
      'B: suất thường không phụ thuộc giờ ⇒ 2 luật (sinh viên / nhân viên); combo phụ thuộc cả ba ⇒ 4 luật. Tổng 6.',
      'C: hai chuyển đổi đi vào BLOCKED (T3, T4) ⇒ 2 chuỗi. Gắn mọi chuyển đổi còn lại vào hai chuỗi đó (EXPIRED không phải trạng thái cuối — renew đưa về ACTIVE).',
      'D: dữ liệu là chuỗi như ki-ốt nhận: cardState, balance, price. Hai ca biên: balance = price và balance = price − 1.000.',
    ],
    loiHayGap: [
      'A: ghi validBoundaries = [20000, 2000000] mà quên cặp 499.000 / 500.000.',
      'B: tính combo sinh viên trước 11:00 = (50.000 − 5.000) × 90% = 40.500 — đặc tả trừ 5.000 SAU khi giảm sinh viên ⇒ 40.000.',
      'C: viết reportLost ở giữa chuỗi rồi tiếp tục sự kiện khác — BLOCKED không đi đâu được nữa.',
      'D: quên hai ca biên số dư — lỗi "<" thay vì "<=" khi so số dư với giá nằm đúng ở đó.',
    ],
    moTaNgan: 'Lab chương 4: thiết kế test hộp đen trọn bộ cho thẻ căng tin FPT — EP/BVA, bảng quyết định, chuyển trạng thái, use case.',
    giaiThich: {
      en: '<p><b>A.</b> Partitions: &lt; 20,000 · 20,000–499,000 · 500,000–2,000,000 · &gt; 2,000,000 · not a multiple of 1,000. VB 20,000 / 499,000 / 500,000 / 2,000,000, IB 19,000 / 2,001,000; bonus at 500,000 = 25,000. <b>B.</b> 6 collapsed rules: student single 31,500 · staff single 35,000 · student combo before 11 40,000 · student combo later 45,000 · staff combo before 11 45,000 · staff combo later 50,000. <b>C.</b> lock·unlock·expire·renew·lock·expire·renew·reportLost and lock·reportLost cover T1–T7; 20 − 7 = 13 invalid pairs; e.g. reportLost then unlock stays BLOCKED. <b>D.</b> one test per path + balance = price (0 left) + 1,000 short.</p>',
      vi: '<p><b>A.</b> Vùng: &lt; 20.000 · 20.000–499.000 · 500.000–2.000.000 · &gt; 2.000.000 · không phải bội 1.000. VB 20.000 / 499.000 / 500.000 / 2.000.000, IB 19.000 / 2.001.000; thưởng tại 500.000 = 25.000. <b>B.</b> 6 luật rút gọn như bảng. <b>C.</b> hai chuỗi phủ T1–T7; 20 − 7 = 13 cặp sai. <b>D.</b> mỗi đường một ca + hai ca biên số dư.</p>',
    },
    loaiKiem: 'js',
    tests: { loai: 'js', phienBan: 1, tepNap: ['answers/a-topup.js', 'answers/b-meal.js', 'answers/c-card.js', 'answers/d-usecase.js'], kiem: [...kA, ...kB, ...kC, ...kD] },
    khoiDau: {
      'answers/a-topup.js': 'const TOPUP = {\n  validPartitions: [],\n  invalidPartitions: [],\n  validBoundaries: [],\n  invalidBoundaries: [],\n  bonusAtThreshold: 0,   // the bonus credited for the smallest top-up that earns a bonus\n};\n',
      'answers/b-meal.js': '// One test per COLLAPSED rule of the meal-price decision table.\nconst MEAL_TESTS = [\n  { isStudent: false, isCombo: false, beforeEleven: false, expected: 35000 },\n];\n',
      'answers/c-card.js': "// Event sequences, each starting from a new ACTIVE card.\nconst CARD_SEQUENCES = [\n  ['lock', 'unlock'],\n];\nconst CARD_INVALID_COUNT = 0;\nconst CARD_NEGATIVE = { events: [], expectedState: '' };\n",
      'answers/d-usecase.js': `const MEAL_UC_TESTS = [\n${tcJs(DS_D[0])}\n];\n`,
    },
    loiGiai: {
      'answers/a-topup.js': '// A. Top-up amount: 5 partitions (2 valid, 3 invalid), step 1,000.\nconst TOPUP = {\n  validPartitions: [100000, 800000],                 // 20,000–499,000 (no bonus) · 500,000–2,000,000 (bonus)\n  invalidPartitions: [10000, 2500000, 150500],       // too small · too large · not a multiple of 1,000\n  validBoundaries: [20000, 499000, 500000, 2000000], // edges of both valid partitions\n  invalidBoundaries: [19000, 2001000],\n  bonusAtThreshold: 25000,                           // 5% of 500,000\n};\n',
      'answers/b-meal.js': "// B. Collapsed decision table: single meals ignore the time ⇒ 2 + 4 = 6 rules.\nconst MEAL_TESTS = [\n  { isStudent: true, isCombo: false, beforeEleven: false, expected: 31500 },  // R1 (time: don't care)\n  { isStudent: false, isCombo: false, beforeEleven: true, expected: 35000 },  // R2 (time: don't care)\n  { isStudent: true, isCombo: true, beforeEleven: true, expected: 40000 },    // R3 50,000 × 90% − 5,000\n  { isStudent: true, isCombo: true, beforeEleven: false, expected: 45000 },   // R4\n  { isStudent: false, isCombo: true, beforeEleven: true, expected: 45000 },   // R5\n  { isStudent: false, isCombo: true, beforeEleven: false, expected: 50000 },  // R6\n];\n",
      'answers/c-card.js': "// C. Two transitions (T3, T4) enter the final state BLOCKED ⇒ two sequences.\nconst CARD_SEQUENCES = [\n  ['lock', 'unlock', 'expire', 'renew', 'lock', 'expire', 'renew', 'reportLost'], // T1 T2 T5 T7 T1 T6 T7 T3\n  ['lock', 'reportLost'],                                                        // T1 T4\n];\nconst CARD_INVALID_COUNT = 13;   // 4 states × 5 events = 20 − 7 valid\nconst CARD_NEGATIVE = { events: ['reportLost', 'unlock'], expectedState: 'BLOCKED' };\n",
      'answers/d-usecase.js': GIAI_D,
    },
    thamKhao: 'https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/',
    boYeu: [
      { ten: 'A thiếu biên thưởng', tep: { 'answers/a-topup.js': "const TOPUP = { validPartitions: [100000, 800000], invalidPartitions: [10000, 2500000, 150500], validBoundaries: [20000, 2000000], invalidBoundaries: [19000, 2001000], bonusAtThreshold: 25000 };\n" }, phaiTruot: ['A — valid boundaries'] },
      { ten: 'B đủ 8 luật (không rút gọn)', tep: { 'answers/b-meal.js': "const MEAL_TESTS = [\n  { isStudent: true, isCombo: false, beforeEleven: false, expected: 31500 },\n  { isStudent: true, isCombo: false, beforeEleven: true, expected: 31500 },\n  { isStudent: false, isCombo: false, beforeEleven: true, expected: 35000 },\n  { isStudent: false, isCombo: false, beforeEleven: false, expected: 35000 },\n  { isStudent: true, isCombo: true, beforeEleven: true, expected: 40000 },\n  { isStudent: true, isCombo: true, beforeEleven: false, expected: 45000 },\n  { isStudent: false, isCombo: true, beforeEleven: true, expected: 45000 },\n  { isStudent: false, isCombo: true, beforeEleven: false, expected: 50000 },\n];\n" }, phaiTruot: ['B — one test per collapsed rule'] },
      { ten: 'B trừ 5.000 trước khi giảm', tep: { 'answers/b-meal.js': "const MEAL_TESTS = [\n  { isStudent: true, isCombo: false, beforeEleven: false, expected: 31500 },\n  { isStudent: false, isCombo: false, beforeEleven: true, expected: 35000 },\n  { isStudent: true, isCombo: true, beforeEleven: true, expected: 40500 },\n  { isStudent: true, isCombo: true, beforeEleven: false, expected: 45000 },\n  { isStudent: false, isCombo: true, beforeEleven: true, expected: 45000 },\n  { isStudent: false, isCombo: true, beforeEleven: false, expected: 50000 },\n];\n" }, phaiTruot: ['B — every expected price is right'] },
    ],
  }],
});
