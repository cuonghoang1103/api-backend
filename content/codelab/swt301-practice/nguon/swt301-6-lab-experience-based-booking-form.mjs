/**
 * SWT301 · LAB CHƯƠNG 6 — Kỹ thuật dựa kinh nghiệm trên form đặt chỗ LabBook: A. error guessing (bộ test chấm bằng mutant
 * parseTimeRange) · B. checklist-based testing màn hình đặt chỗ · C. chọn kỹ thuật cho 6 tính năng.
 */
import { doiDau, KHOA, kiemKhoa, preMa, NOP_BAI } from './_chung.mjs';
import { dotBienDe, TN_TEST } from './_de.mjs';

const DUNG = `function parseTimeRange(s) {
  if (typeof s !== 'string') return null;
  const m = /^(\\d{2}):(\\d{2})-(\\d{2}):(\\d{2})$/.exec(s);
  if (!m) return null;
  const [h1, m1, h2, m2] = m.slice(1).map(Number);
  if (h1 > 23 || h2 > 23 || m1 > 59 || m2 > 59) return null;
  const start = h1 * 60 + m1;
  const end = h2 * 60 + m2;
  if (end <= start) return null;
  if (end - start > 180) return null;
  return { start, end };
}`;
const doi = (a, b) => { if (!DUNG.includes(a)) throw new Error('mutant: ' + a); return DUNG.replace(a, b); };
const DOT_BIEN = [
  { ma: 'M1', moTa: { en: 'hour 24 is accepted', vi: 'nhận giờ 24' }, code: doi('h1 > 23 || h2 > 23', 'h1 > 24 || h2 > 24'), nhom: 'f1' },
  { ma: 'M2', moTa: { en: 'minute 60 is accepted', vi: 'nhận phút 60' }, code: doi('m1 > 59 || m2 > 59', 'm1 > 60 || m2 > 60'), nhom: 'f1' },
  { ma: 'M3', moTa: { en: 'a zero-length range is accepted', vi: 'nhận khoảng dài 0' }, code: doi('if (end <= start) return null;', 'if (end < start) return null;'), nhom: 'f1' },
  { ma: 'M4', moTa: { en: 'a reversed range (end before start) is accepted', vi: 'nhận khoảng ngược (kết thúc trước bắt đầu)' }, code: doi('  if (end <= start) return null;\n', ''), nhom: 'f1' },
  { ma: 'M5', moTa: { en: 'exactly 3 hours is rejected', vi: 'từ chối đúng 3 giờ' }, code: doi('end - start > 180', 'end - start >= 180'), nhom: 'f1' },
  { ma: 'M6', moTa: { en: 'null crashes instead of returning null', vi: 'null làm sập thay vì trả null' }, code: doi("if (typeof s !== 'string') return null;", 'if (s.length > 11) return null;'), nhom: 'f1' },
  { ma: 'M7', an: true, moTa: { en: 'single-digit hours are accepted', vi: 'nhận giờ một chữ số' }, code: doi('/^(\\d{2}):(\\d{2})-(\\d{2}):(\\d{2})$/', '/^(\\d{1,2}):(\\d{2})-(\\d{1,2}):(\\d{2})$/'), nhom: 'f2' },
  { ma: 'M8', an: true, moTa: { en: 'spaces around the dash are accepted', vi: 'nhận khoảng trắng quanh dấu gạch' }, code: doi('/^(\\d{2}):(\\d{2})-(\\d{2}):(\\d{2})$/', '/^(\\d{2}):(\\d{2})\\s*-\\s*(\\d{2}):(\\d{2})$/'), nhom: 'f2' },
  { ma: 'M9', an: true, moTa: { en: 'times are converted as h·100 + m instead of minutes', vi: 'đổi giờ thành h·100 + m thay vì phút' }, code: doi('const start = h1 * 60 + m1;\n  const end = h2 * 60 + m2;', 'const start = h1 * 100 + m1;\n  const end = h2 * 100 + m2;'), nhom: 'f2' },
];

const DAU_TEST = "// Part A — fault attack list for parseTimeRange (error guessing).\ntest.each([\n  ['09:00-11:00', { start: 540, end: 660 }],\n])('parseTimeRange(%p)', (s, want) => {\n  expect(parseTimeRange(s)).toEqual(want);\n});\n";
const GIAI_TEST = `// Part A — fault attack list for parseTimeRange: one row per mistake developers make with time ranges.
test.each([
  ['09:00-11:00', { start: 540, end: 660 }],   // normal
  ['09:30-10:15', { start: 570, end: 615 }],   // minutes are converted to minutes since midnight
  ['09:00-12:00', { start: 540, end: 720 }],   // exactly 3 hours is allowed
  ['00:00-00:01', { start: 0, end: 1 }],       // first minute of the day
  ['22:59-23:59', { start: 1379, end: 1439 }], // last valid minute
])('valid: parseTimeRange(%p)', (s, want) => {
  expect(parseTimeRange(s)).toEqual(want);
});

test.each([
  ['09:00-12:01'],   // 3 h 1 min — too long
  ['09:00-09:00'],   // zero length
  ['11:00-09:00'],   // reversed
  ['23:00-24:00'],   // hour 24
  ['09:60-10:30'],   // minute 60
  ['9:00-10:00'],    // single-digit hour
  ['09:00 - 10:00'], // spaces around the dash
  ['09:00-'],        // missing end
  [''],              // empty
  ['0900-1000'],     // no colon
])('invalid: parseTimeRange(%p) is null', (s) => {
  expect(parseTimeRange(s)).toBeNull();
});

test.each([[null], [undefined], [930]])('parseTimeRange(%p) returns null and never throws', (v) => {
  expect(() => parseTimeRange(v)).not.toThrow();
  expect(parseTimeRange(v)).toBeNull();
});
`;

const MUC_CL = [
  ['C1', 'Every required field is marked with *', 'FAIL'],
  ['C2', 'Every error message says what is wrong and how to fix it', 'FAIL'],
  ['C3', 'Submit buttons are disabled while a request is in progress (no double submission)', 'FAIL'],
  ['C4', 'Dates use one consistent format everywhere', 'FAIL'],
  ['C5', 'The tab order follows the visual order', 'PASS'],
  ['C6', 'Colour contrast meets WCAG AA', 'PASS'],
  ['C7', 'Destructive actions ask for confirmation', 'PASS'],
  ['C8', 'Fields have sensible defaults where possible', 'PASS'],
];
const MAN_HINH = [
  'Fields: Lab (dropdown, required, marked *), Date (date picker, required, marked *), Start hour (dropdown 07–20, required, not marked), Duration (1–3, default 1).',
  'Pressing Book with an empty Date shows “Error 400” in red at the top of the page.',
  'When the weekly limit would be exceeded: “You have 5 of 6 hours this week. Choose at most 1 hour.” next to Duration.',
  'The Book button stays enabled while the request is in progress; a double click sends two requests.',
  'The form shows the date as 2026-11-02; the confirmation dialog shows 02/11/2026.',
  'Tab moves Lab → Date → Start hour → Duration → Book, the order in which they appear.',
  'Text contrast was measured with a WCAG checker: all ratios ≥ 4.5:1.',
  'The “Cancel booking” link opens “Cancel BK0001? Yes / No” before cancelling.',
];

const KTH = ['Equivalence partitioning', 'Boundary value analysis', 'Decision table testing', 'State transition testing', 'Use case testing', 'Decision coverage', 'Exploratory testing', 'Checklist-based testing'];
const TINH_NANG = [
  ['F1', 'The late-cancellation fee depends on hours before the start (≥ 24, 2–24, < 2) × booking status × whether the student is a teaching assistant', KTH[2]],
  ['F2', 'An account is locked after 3 wrong passwords and unlocked by an admin; a locked account rejects old tokens', KTH[3]],
  ['F3', 'The lab capacity field accepts integers from 1 to 60', KTH[1]],
  ['F4', 'A new statistics dashboard arrived without any specification; the demo is tomorrow', KTH[6]],
  ['F5', 'The contract requires a measured structural coverage of the payment module', KTH[5]],
  ['F6', 'The lab department wants evidence that the end-to-end “set up next semester’s labs” scenario works', KTH[4]],
];

const goc = dotBienDe({
  tieuDe: 'Lab 6 — Experience-based Testing of the LabBook Booking Form',
  doKho: 'HARD', phut: 80,
  moTa: { en: 'Lab 6', vi: 'Lab 6' },
  viDu: [{ input: "expect(parseTimeRange('23:00-24:00')).toBeNull()", output: 'kills M1 (hour 24 accepted)', explanation: 'A classic guess: 24:00 is not a valid clock time here.|||Đoán kinh điển: 24:00 không phải giờ hợp lệ ở đây.' }],
  goiY: [
    'A: liệt kê sai sót hay gặp với khoảng giờ: 24:00, phút 60, độ dài 0, khoảng ngược, đúng 3 giờ, giờ một chữ số, khoảng trắng, null, đổi đơn vị.',
    'A: kiểm GIÁ TRỊ trả về (start/end tính bằng phút), không chỉ null hay khác null.',
    'B: một mục checklist FAIL nếu có BẤT KỲ chỗ nào trên màn hình vi phạm.',
    'C: tổ hợp điều kiện → decision table; trạng thái → state transition; khoảng số → BVA; không đặc tả + gấp → exploratory.',
  ],
  loiHayGap: ['Chỉ test chuỗi hợp lệ và một chuỗi rác.', 'Đánh C2 là PASS vì thông báo giới hạn tuần tốt — thông báo “Error 400” vẫn làm mục này FAIL.', 'Chọn EP cho F3 — có biên rõ thì BVA.'],
  giaiThich: '<p>A: one test row per guessed mistake (hour 24, minute 60, zero length, reversed, exactly 180 minutes, single digit, spaces, null, unit). B: C1–C4 FAIL (start hour not marked; “Error 400”; button not disabled; two date formats), C5–C8 PASS. C: DT · ST · BVA · Exploratory · Decision coverage · Use case.</p>',
  thuatNgu: [...TN_TEST(), { en: 'fault attack list', vi: 'danh sách tấn công lỗi' }, { en: 'WCAG', vi: 'chuẩn khả năng tiếp cận nội dung web' }, { en: 'double submission', vi: 'gửi trùng do bấm đúp' }],
  ten: ['parseTimeRange'], dung: DUNG, minTest: 10,
  dotBien: DOT_BIEN, dauTest: DAU_TEST, giaiTest: GIAI_TEST,
});

const kiemA = goc.tests.kiem.map((k, i) => ({ ...k, nhom: i < 2 ? 'f1' : DOT_BIEN[i - 2].nhom }));
const KIEM = [
  ...kiemA,
  ...kiemKhoa(MUC_CL.map(([m, , v], i) => ({ moTa: { en: `B — checklist item ${m}`, vi: `B — mục checklist ${m}` }, bieuThuc: `CHECKLIST.${m}`, chap: [v], nhom: 'f3', ...(i >= 6 ? { an: true } : {}) }))),
  ...kiemKhoa(TINH_NANG.map(([m, , v]) => ({ moTa: { en: `C — technique for ${m}`, vi: `C — kỹ thuật cho ${m}` }, bieuThuc: `TECHNIQUES.${m}`, chap: [v], nhom: 'f4' }))),
];

const BAN_IN = {
  tieuDe: 'Lab 6 — Experience-based Testing of the LabBook Booking Form',
  phu: { en: 'Chapter 6 lab · error guessing in code, checklist-based testing, choosing techniques · 10 marks', vi: 'Lab chương 6 · error guessing bằng code, kiểm thử theo checklist, chọn kỹ thuật · 10 điểm' },
  moTa: {
    en: `<p><b>A. Error guessing.</b> The booking form sends the chosen slot as a text range. <code>parseTimeRange(s)</code> accepts exactly <code>HH:MM-HH:MM</code> (two digits each, no spaces), times 00:00–23:59, end strictly after start, at most 180 minutes, and returns minutes since midnight <code>{ start, end }</code>; anything else returns <code>null</code> (never throws).</p>${preMa(DUNG)}<p>Write a fault attack list as tests in <code>tests.js</code>. The grader runs them on the correct function and on 9 versions with typical developer mistakes (6 listed, 3 hidden).</p>
<p><b>B. Checklist-based testing.</b> Run the team’s UI checklist against the new “Book a seat” screen. What the tester observed:</p><ol>${MAN_HINH.map((x) => `<li>${x}</li>`).join('')}</ol><p>Checklist: ${MUC_CL.map(([m, t]) => `<b>${m}</b> ${t}`).join(' · ')}. Mark every item PASS or FAIL.</p>
<p><b>C. Choosing techniques.</b> ${TINH_NANG.map(([m, t]) => `<b>${m}</b> ${t}`).join(' · ')}.</p>`,
    vi: `<p><b>A. Error guessing.</b> Form đặt chỗ gửi khung giờ đã chọn dưới dạng chuỗi. <code>parseTimeRange(s)</code> chỉ nhận đúng <code>HH:MM-HH:MM</code> (mỗi phần hai chữ số, không khoảng trắng), giờ 00:00–23:59, kết thúc sau bắt đầu, tối đa 180 phút, trả số phút tính từ nửa đêm <code>{ start, end }</code>; mọi thứ khác trả <code>null</code> (không ném lỗi). Viết danh sách tấn công dưới dạng test trong <code>tests.js</code>; máy chấm chạy trên hàm đúng và 9 phiên bản chứa sai sót điển hình (6 công khai, 3 ẩn).</p>
<p><b>B. Kiểm thử theo checklist.</b> Áp checklist UI của nhóm lên màn hình “Đặt chỗ” mới; quan sát của tester và các mục C1–C8 ở trên. Đánh mỗi mục PASS hoặc FAIL.</p>
<p><b>C. Chọn kỹ thuật</b> cho sáu tính năng F1–F6 ở trên.</p>`,
  },
  chucNangChinh: [
    { en: 'A. A fault attack list that kills the typical-mistake versions of parseTimeRange.', vi: 'A. Danh sách tấn công giết được các phiên bản sai sót điển hình của parseTimeRange.' },
    { en: 'B. PASS/FAIL for eight checklist items.', vi: 'B. PASS/FAIL cho tám mục checklist.' },
    { en: 'C. The best technique for six features.', vi: 'C. Kỹ thuật hợp nhất cho sáu tính năng.' },
  ],
  yeuCauChung: [{ en: 'Do not declare parseTimeRange in tests.js — the grader provides it.', vi: 'Không khai báo parseTimeRange trong tests.js — máy chấm cung cấp.' }],
  cayThuMuc: `lib/testkit.js           ← Jest-like runner (do not edit)
tests.js                 ← Part A: your fault attack list
answers/b-checklist.js   ← const CHECKLIST = { C1: 'PASS' | 'FAIL', … }
answers/c-techniques.js  ← const TECHNIQUES = { F1: '…', … }`,
  moHinh: {
    ten: 'Allowed values',
    truong: [
      ['CHECKLIST.*', 'string', { en: 'PASS · FAIL', vi: 'PASS · FAIL' }],
      ['TECHNIQUES.*', 'string', { en: KTH.join(' · '), vi: KTH.join(' · ') }],
    ],
  },
  chucNang: [
    { ten: { en: 'A1 Attack list — listed mistakes', vi: 'A1 Danh sách tấn công — sai sót công khai' }, diem: 4, yeuCau: [{ en: 'A valid suite (≥ 10 tests, all pass on the correct function) that kills M1–M6.', vi: 'Bộ test hợp lệ (≥ 10 test, đạt hết trên hàm đúng) giết M1–M6.' }], hook: ['error guessing'] },
    { ten: { en: 'A2 Attack list — hidden mistakes', vi: 'A2 Danh sách tấn công — sai sót ẩn' }, diem: 1, yeuCau: [{ en: 'Three more typical mistakes you must guess.', vi: 'Ba sai sót điển hình nữa bạn phải tự đoán.' }], hook: ['error guessing'] },
    { ten: { en: 'B. Checklist-based testing', vi: 'B. Kiểm thử theo checklist' }, diem: 3, yeuCau: [{ en: 'Eight items.', vi: 'Tám mục.' }], hook: ['checklist-based testing'] },
    { ten: { en: 'C. Choosing techniques', vi: 'C. Chọn kỹ thuật' }, diem: 2, yeuCau: [{ en: 'Six features.', vi: 'Sáu tính năng.' }], hook: ['choosing test techniques'] },
  ],
  idBatBuoc: [['tests.js', 'tests.js'], ['CHECKLIST', 'answers/b-checklist.js'], ['TECHNIQUES', 'answers/c-techniques.js']],
  truDiem: [
    { en: 'Never guessing null or a non-string input — the version that crashes on null survives.', vi: 'Không đoán đầu vào null hay không phải chuỗi — phiên bản sập khi gặp null sống sót.' },
    { en: 'Passing a checklist item because MOST of the screen complies.', vi: 'Cho mục checklist PASS vì PHẦN LỚN màn hình đúng.' },
  ],
  nopBai: NOP_BAI,
};

const GIAI_B = `// Checklist run on the "Book a seat" screen.
const CHECKLIST = {
  C1: 'FAIL', // Start hour is required but not marked
  C2: 'FAIL', // "Error 400" says neither what is wrong nor how to fix it
  C3: 'FAIL', // Book stays enabled; a double click sends two requests
  C4: 'FAIL', // 2026-11-02 on the form, 02/11/2026 in the dialog
  C5: 'PASS',
  C6: 'PASS',
  C7: 'PASS',
  C8: 'PASS', // Duration defaults to 1
};
`;
const GIAI_C = `const TECHNIQUES = {\n${TINH_NANG.map(([m, , v]) => `  ${m}: '${v}',`).join('\n')}\n};\n`;

export default doiDau({
  slug: 'swt301-6-lab-experience-based-booking-form',
  ten: 'Lab 6 — Experience-based Testing of the LabBook Booking Form',
  moTaModule: 'Lab chương 6: danh sách tấn công (error guessing) cho parseTimeRange chấm bằng 9 mutant sai sót điển hình, chạy checklist UI trên màn hình đặt chỗ, chọn kỹ thuật cho sáu tính năng LabBook.',
  khoa: KHOA,
  baiHoc: 'swt301-experience-based',
  de: [{
    ...goc,
    dangBai: 'lab', diem: 100,
    khaiNiem: ['error guessing', 'checklist-based testing', 'choosing test techniques'],
    tienQuyet: ['SWT301 chapter 6'],
    the: ['swt301', 'lab', 'experience-based'],
    banIn: BAN_IN,
    moTaNgan: 'Lab chương 6: kỹ thuật dựa kinh nghiệm trên form đặt chỗ.',
    tests: { ...goc.tests, tepNap: [...goc.tests.tepNap, 'answers/b-checklist.js', 'answers/c-techniques.js'], kiem: KIEM },
    khoiDau: { ...goc.khoiDau, 'answers/b-checklist.js': "// 'PASS' | 'FAIL'\nconst CHECKLIST = { C1: '', C2: '', C3: '', C4: '', C5: '', C6: '', C7: '', C8: '' };\n", 'answers/c-techniques.js': `// ${KTH.join(' | ')}\nconst TECHNIQUES = { F1: '', F2: '', F3: '', F4: '', F5: '', F6: '' };\n` },
    loiGiai: { ...goc.loiGiai, 'answers/b-checklist.js': GIAI_B, 'answers/c-techniques.js': GIAI_C },
    boYeu: [
      { ten: 'không đoán null/undefined', tep: { 'tests.js': GIAI_TEST.slice(0, GIAI_TEST.indexOf('test.each([[null]')) }, phaiTruot: ['Kills mutant M6'] },
      { ten: 'checklist theo đa số', tep: { 'answers/b-checklist.js': GIAI_B.replace("C2: 'FAIL'", "C2: 'PASS'") }, phaiTruot: ['B — checklist item C2'] },
    ],
  }],
});
