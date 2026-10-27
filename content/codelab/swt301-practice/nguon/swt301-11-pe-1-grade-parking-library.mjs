/**
 * SWT301 · PE PRACTICE 1 (định dạng SU26 — template SWT301_SU26_Template.xlsx: Q1 issue list · Q2 UTCID grid · Q3 test cases).
 * Đề MỚI viết theo DẠNG đề thật PE23/PE24 (không chép đề thật): review GradeCalculator (≥ 8 lỗi) · bộ test tối thiểu
 * statement + decision + MC/DC cho calcParkingFee · test hộp đen "Library Late-Return Fine" (hợp lệ · bảng quyết định · biên).
 * Sâu hơn đề trường: Q1 còn bắt SỬA mã (bản JS chạy thật), Q2 đo độ phủ THẬT trên mã đã gắn đo, Q3 chạy từng test case
 * qua hệ thống tham chiếu (chấp nhận mọi bộ ca hợp lệ, không ép một bảng cố định).
 */
import {
  doiDau, KHOA, TESTKIT_JS, kiemPhu, kiemReview, kiemTestCase, svg, preSo, bangHtml, sach, LOAI_LOI, LOAI_LOI_HTML, NOP_BAI, tn,
} from './_chung.mjs';

/* ════════════════════════════════ Q1 — GradeCalculator ════════════════════════════════ */
const Q1_JAVA = `public class GradeCalculator {
    public static String finalResult(double[] labs, double pe, double fe) {
        double sum = 0;
        for (int i = 1; i < labs.length; i++) {
            sum += labs[i];
        }
        double labAvg = sum / labs.length;
        double total = labAvg * 0.25 + pe * 0.25 + fe * 0.05;
        total = Math.round(total * 10) / 10;
        if (pe > 4 && fe >= 4 || total >= 5) {
            return "PASS " + total;
        }
        String result = "FAIL ";
        result + total;
        return result;
    }

    public static void main(String[] args) {
        double[] labs = {8, 9, 7};
        System.out.println(finalResult(labs, 3.5, 11));
    }
}`;

const Q1_KHOA = [
  { ma: 'K1', dong: [2, 3, 4], loai: ['VALIDATION', 'EXCEPTION'], ten: 'no null check for labs (NullPointerException at labs.length)' },
  { ma: 'K2', dong: [2, 4, 7], loai: ['VALIDATION', 'LOGIC'], ten: 'labs.length is never checked to be exactly 4' },
  { ma: 'K3', dong: [2, 5], loai: ['VALIDATION'], ten: 'lab scores are not checked to be in [0, 10]' },
  { ma: 'K4', dong: [2, 8], loai: ['VALIDATION'], ten: 'pe / fe are not checked to be in [0, 10]' },
  { ma: 'K5', dong: [4, 5], loai: ['BOUNDARY', 'LOGIC', 'CALCULATION'], ten: 'loop starts at i = 1, so the first lab is skipped', tenVi: 'vòng lặp bắt đầu từ i = 1 nên bỏ mất bài lab đầu tiên', nang: true },
  { ma: 'K6', dong: [8], loai: ['CALCULATION', 'LOGIC'], ten: 'FE weight is 0.05 instead of 0.5', tenVi: 'trọng số FE là 0.05 thay vì 0.5', nang: true },
  { ma: 'K7', dong: [9], loai: ['CALCULATION', 'DATA_TYPE'], ten: 'Math.round(...) / 10 is long / int division — the decimal is lost', tenVi: 'Math.round(...) / 10 là phép chia long / int — mất phần thập phân', nang: true },
  { ma: 'K8', dong: [10], loai: ['BOUNDARY'], ten: 'pe > 4 should be pe >= 4 (PE of exactly 4.0 passes)' },
  { ma: 'K9', dong: [10], loai: ['LOGIC'], ten: '"|| total >= 5" lets a student pass with PE/FE below 4; the total rule must be AND-ed', tenVi: '"|| total >= 5" cho qua cả khi PE/FE dưới 4; điều kiện tổng phải nối bằng AND', nang: true },
  { ma: 'K10', dong: [14], loai: ['COMPILE'], ten: '"result + total;" is not a statement — compile error', tenVi: '"result + total;" không phải câu lệnh — lỗi biên dịch', nang: true },
  { ma: 'K11', dong: [19], loai: ['TEST_DATA'], ten: 'demo data has 3 lab scores instead of 4' },
  { ma: 'K12', dong: [20], loai: ['TEST_DATA'], ten: 'demo call uses fe = 11 (out of range) and prints without any expected value' },
  { ma: 'K13', dong: [8, 9, 10], loai: ['CONVENTION'], ten: 'magic numbers (0.25, 0.5, 4, 5) instead of named constants' },
];
const Q1_SAI = [
  { dong: [7], loai: ['CALCULATION', 'DATA_TYPE'], ten: 'line 7 is NOT an integer division: sum is a double' },
  { dong: [10], loai: ['COMPILE'], ten: 'line 10 compiles — mixing && and || is legal Java (the defect is logical, not syntactic)' },
];

const Q1_FIX_DAU = `// Question 1 (deeper) — the JavaScript twin of GradeCalculator.finalResult, WITH the same defects
// (line 14's compile error becomes a statement that does nothing). Fix it so it follows the specification.
// The grader calls finalResult(labs, pe, fe) with valid and invalid data.
class IllegalArgumentException extends Error {
  constructor(message) { super(message); this.name = 'IllegalArgumentException'; }
}

function finalResult(labs, pe, fe) {
  let sum = 0;
  for (let i = 1; i < labs.length; i++) {
    sum += labs[i];
  }
  const labAvg = sum / labs.length;
  let total = labAvg * 0.25 + pe * 0.25 + fe * 0.05;
  total = Math.trunc(Math.round(total * 10) / 10); // Java: long / int division
  if (pe > 4 && fe >= 4 || total >= 5) {
    return 'PASS ' + total.toFixed(1);
  }
  const result = 'FAIL ';
  result + total; // Java: "not a statement" — compile error
  return result;
}
`;
const Q1_FIX_GIAI = `// Question 1 (deeper) — corrected finalResult. Every rule of the specification is enforced:
//  · labs: not null, exactly 4 scores, each in [0, 10]; pe and fe in [0, 10]  → else IllegalArgumentException
//  · total = 25% lab average + 25% PE + 50% FE, rounded to ONE decimal (no integer division)
//  · PASS only when total >= 5.0 AND PE >= 4.0 AND FE >= 4.0
class IllegalArgumentException extends Error {
  constructor(message) { super(message); this.name = 'IllegalArgumentException'; }
}

const LAB_COUNT = 4;
const LAB_WEIGHT = 0.25;
const PE_WEIGHT = 0.25;
const FE_WEIGHT = 0.5;
const PASS_TOTAL = 5.0;
const MIN_EXAM_SCORE = 4.0;

function inRange(x) {
  return typeof x === 'number' && !Number.isNaN(x) && x >= 0 && x <= 10;
}

function finalResult(labs, pe, fe) {
  if (!Array.isArray(labs) || labs.length !== LAB_COUNT) {
    throw new IllegalArgumentException('labs must hold exactly 4 scores');
  }
  if (!labs.every(inRange) || !inRange(pe) || !inRange(fe)) {
    throw new IllegalArgumentException('every score must be in [0, 10]');
  }
  let sum = 0;
  for (let i = 0; i < labs.length; i++) sum += labs[i];          // i starts at 0
  const labAvg = sum / labs.length;
  const raw = labAvg * LAB_WEIGHT + pe * PE_WEIGHT + fe * FE_WEIGHT;
  const total = Math.round(raw * 10) / 10;                        // keep one decimal
  const pass = total >= PASS_TOTAL && pe >= MIN_EXAM_SCORE && fe >= MIN_EXAM_SCORE;
  return (pass ? 'PASS ' : 'FAIL ') + total.toFixed(1);
}
`;

/* ════════════════════════════════ Q2 — calcParkingFee ════════════════════════════════ */
const Q2_JAVA = `public static String calcParkingFee(int minutes, boolean isWeekend, boolean hasPass) {
    if (minutes < 1 || minutes > 1440)
        return "Invalid Duration";
    if (hasPass && !isWeekend)
        return "Free";
    int hours = minutes / 60;
    int rate = isWeekend ? 15000 : 10000;
    if (hours <= 3)
        return "Fee: " + (hours * rate) + " VND";
    return "Fee: " + (3 * rate + (hours - 3) * rate / 2) + " VND";
}`;
// Bản JS gắn đo — CÙNG số dòng với bản Java ở trên (sach(Q2_DO) có 11 dòng như Q2_JAVA).
const Q2_DO = `function calcParkingFee(minutes, isWeekend, hasPass) {
  $s('S1'); if ($d('D1', $c('D1.A', minutes < 1) || $c('D1.B', minutes > 1440)))
    { $s('S2'); return 'Invalid Duration'; }
  $s('S3'); if ($d('D2', $c('D2.A', hasPass) && $c('D2.B', !isWeekend)))
    { $s('S4'); return 'Free'; }
  $s('S5'); const hours = Math.trunc(minutes / 60);
  $s('S6'); const rate = $d('D3', isWeekend) ? 15000 : 10000;
  $s('S7'); if ($d('D4', hours <= 3))
    { $s('S8'); return 'Fee: ' + (hours * rate) + ' VND'; }
  $s('S9'); return 'Fee: ' + (3 * rate + Math.trunc((hours - 3) * rate / 2)) + ' VND';
}`;
function q2Spec(minutes, isWeekend, hasPass) {
  if (minutes < 1 || minutes > 1440) return 'Invalid Duration';
  if (hasPass && !isWeekend) return 'Free';
  const hours = Math.ceil(minutes / 60);
  const rate = isWeekend ? 15000 : 10000;
  if (hours <= 3) return 'Fee: ' + hours * rate + ' VND';
  return 'Fee: ' + (3 * rate + ((hours - 3) * rate) / 2) + ' VND';
}
function q2Loai(i) {
  const m = i.minutes;
  if (m < 1 || m > 1440) return m === 0 || m === 1441 ? ['A', 'B'] : ['A'];
  if ([1, 180, 181, 1440].includes(m)) return ['B'];
  return ['N'];
}
const Q2_CFG = svg({
  w: 600, h: 560, tieuDe: 'CFG of calcParkingFee (L = line number)',
  nut: [
    { id: 'st', x: 300, y: 42, hinh: 'dau', nhan: '' },
    { id: 'd2', x: 300, y: 92, hinh: 'thoi', nhan: 'L2', rong: 90 },
    { id: 'r3', x: 470, y: 92, hinh: 'chu', nhan: 'L3 return Invalid' },
    { id: 'd4', x: 300, y: 172, hinh: 'thoi', nhan: 'L4', rong: 90 },
    { id: 'r5', x: 470, y: 172, hinh: 'chu', nhan: 'L5 return Free' },
    { id: 's6', x: 300, y: 240, hinh: 'chu', nhan: 'L6 hours = minutes / 60' },
    { id: 'd7', x: 300, y: 305, hinh: 'thoi', nhan: 'L7', rong: 90 },
    { id: 'a', x: 160, y: 360, hinh: 'chu', nhan: 'rate = 15000' },
    { id: 'b', x: 440, y: 360, hinh: 'chu', nhan: 'rate = 10000' },
    { id: 'd8', x: 300, y: 420, hinh: 'thoi', nhan: 'L8', rong: 90 },
    { id: 'r9', x: 140, y: 485, hinh: 'chu', nhan: 'L9 return fee ≤ 3h' },
    { id: 'r10', x: 460, y: 485, hinh: 'chu', nhan: 'L10 return fee > 3h' },
    { id: 'end', x: 300, y: 530, hinh: 'cuoi', nhan: 'end', r: 16 },
  ],
  canh: [
    { tu: 'st', den: 'd2' },
    { tu: 'd2', den: 'r3', nhan: 'T' }, { tu: 'd2', den: 'd4', nhan: 'F' },
    { tu: 'd4', den: 'r5', nhan: 'T' }, { tu: 'd4', den: 's6', nhan: 'F' },
    { tu: 's6', den: 'd7' },
    { tu: 'd7', den: 'a', nhan: 'T (weekend)' }, { tu: 'd7', den: 'b', nhan: 'F' },
    { tu: 'a', den: 'd8' }, { tu: 'b', den: 'd8' },
    { tu: 'd8', den: 'r9', nhan: 'T' }, { tu: 'd8', den: 'r10', nhan: 'F' },
    { tu: 'r9', den: 'end' }, { tu: 'r10', den: 'end' },
    { tu: 'r3', den: 'end', qua: [[575, 92], [575, 530]] },
    { tu: 'r5', den: 'end', qua: [[575, 172], [575, 530]] },
  ],
});

/* ════════════════════════════════ Q3 — Library Late-Return Fine ════════════════════════════════ */
function q3HeThong(d) {
  const s = (k) => String(d[k] == null ? '' : d[k]).trim();
  const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const code = s('memberCode');
  if (code === '') return 'Member Code is required.';
  if (['LB001', 'LB002', 'LB003'].indexOf(code) < 0) return 'Invalid Member Code.';
  const p = s('bookPrice');
  if (p === '') return 'Book Price is required.';
  if (!/^\d+$/.test(p) || Number(p) <= 0) return 'Book Price must be an integer > 0.';
  const price = Number(p);
  const type = s('memberType');
  if (type === '') return 'Member Type is required.';
  const dl = s('daysLate');
  if (dl === '') return 'Days Late is required.';
  if (!/^\d+$/.test(dl)) return 'Days Late must be an integer ≥ 0.';
  const days = Number(dl);
  const lost = s('lost');
  if (lost === '') return 'Lost Status is required.';
  let fine;
  if (lost === 'Yes') fine = type === 'Student' ? price + 50000 : price;
  else {
    if (type === 'Student') fine = days === 0 ? 0 : days <= 7 ? 2000 * days : 5000 * days;
    else fine = days <= 14 ? 0 : 3000 * (days - 14);
    if (fine > price) fine = price;
  }
  return 'Fine Amount: ' + fmt(fine) + ' VND.';
}
function q3Nhan(d, out) {
  const s = (k) => String(d[k] == null ? '' : d[k]).trim();
  const t = [];
  const msg = {
    'Member Code is required.': 'V_CODE_EMPTY', 'Invalid Member Code.': 'V_CODE_INVALID', 'Book Price is required.': 'V_PRICE_EMPTY',
    'Member Type is required.': 'V_TYPE', 'Days Late is required.': 'V_DAYS_EMPTY', 'Lost Status is required.': 'V_LOST',
  };
  if (msg[out]) t.push(msg[out]);
  if (out === 'Book Price must be an integer > 0.') {
    const p = s('bookPrice');
    if (!/^-?\d+(\.\d+)?$/.test(p)) t.push('V_PRICE_TEXT');
    else if (Number(p) === 0) t.push('V_PRICE_ZERO', 'B_PRICE_0');
    else if (Number(p) < 0) t.push('V_PRICE_NEG');
    else t.push('V_PRICE_DECIMAL');
  }
  if (out === 'Days Late must be an integer ≥ 0.') {
    const x = s('daysLate');
    if (/^-\d+$/.test(x)) t.push('V_DAYS_NEG');
    else if (/^-?\d+\.\d+$/.test(x)) t.push('V_DAYS_DECIMAL');
    else t.push('V_DAYS_TEXT');
  }
  if (out.indexOf('Fine Amount') === 0) {
    const price = Number(s('bookPrice')), days = Number(s('daysLate')), type = s('memberType'), lost = s('lost') === 'Yes';
    if (lost) t.push(type === 'Student' ? 'R1' : 'R2');
    else {
      const raw = type === 'Student' ? (days === 0 ? 0 : days <= 7 ? 2000 * days : 5000 * days) : (days <= 14 ? 0 : 3000 * (days - 14));
      if (raw > price) t.push('R8');
      else if (type === 'Student') t.push(days === 0 ? 'R3' : days <= 7 ? 'R4' : 'R5');
      else t.push(days <= 14 ? 'R6' : 'R7');
      if (type === 'Student') { if (days === 0) t.push('B_S0'); if (days === 1) t.push('B_S1'); if (days === 7) t.push('B_S7'); if (days === 8) t.push('B_S8'); }
      else { if (days === 14) t.push('B_T14'); if (days === 15) t.push('B_T15'); }
      if (raw > 0 && raw === price) t.push('B_CAP_EQ');
      if (raw - price === 1) t.push('B_CAP_OVER');
    }
    if (price === 1) t.push('B_PRICE_1');
  }
  return t;
}

/* ════════════════════════════════ BẢN IN ════════════════════════════════ */
const MAU_Q3 = bangHtml(['Member', 'Type', 'Lost', 'Days late', 'Book price', 'Result'], [
  ['LB001', 'Student', 'Yes', '3', '200,000', '200,000 + 50,000 = 250,000'],
  ['LB002', 'Staff', 'Yes', '3', '200,000', '200,000'],
  ['LB001', 'Student', 'No', '5', '200,000', '5 × 2,000 = 10,000'],
  ['LB001', 'Student', 'No', '10', '200,000', '10 × 5,000 = 50,000'],
  ['LB003', 'Staff', 'No', '10', '200,000', '0 (grace period)'],
  ['LB003', 'Staff', 'No', '20', '200,000', '(20 − 14) × 3,000 = 18,000'],
  ['LB001', 'Student', 'No', '30', '100,000', '150,000 → capped at the book price = 100,000'],
  ['XX999', '—', '—', '—', '—', '"Invalid Member Code."'],
]);

const BAN_IN = {
  tieuDe: 'SWT301 — PE Practice 1 (SU26 format)',
  phu: {
    en: 'GradeCalculator review · calcParkingFee unit tests (MC/DC) · Library Late-Return Fine black-box · 85 minutes · 10 marks',
    vi: 'Review GradeCalculator · unit test calcParkingFee (MC/DC) · test hộp đen Library Late-Return Fine · 85 phút · 10 điểm',
  },
  moTa: {
    en: `<p>This paper follows the <b>SU26 practical-exam format</b> of SWT301 (template <code>SWT301_SU26_Template.xlsx</code>: sheet <b>Q1</b> issue list · sheet <b>Q2</b> UTCID grid · sheet <b>Q3</b> test cases). It is a NEW paper written in the style of the real ones — and it goes one step further: your corrected code is executed, your coverage is measured on instrumented code, and every test case you write is run against a reference implementation of the specification.</p>
<p><b>Rules of the real paper (keep them while practising):</b> no IDE; answers in English; every answer must reflect THIS paper — irrelevant keywords give zero for that question; expected results always come from the <b>specification</b>, never from the code.</p>
<p><b>How answers are recorded here:</b> each sheet of the template becomes one JavaScript file that declares an array — one object per row/column of the template (see “Data model”). Edit only the files in <code>answers/</code>.</p>`,
    vi: `<p>Đề theo đúng <b>định dạng PE SU26</b> của SWT301 (template <code>SWT301_SU26_Template.xlsx</code>: sheet <b>Q1</b> danh sách lỗi · sheet <b>Q2</b> lưới UTCID · sheet <b>Q3</b> test case). Đây là đề MỚI viết theo dạng đề thật — và sâu hơn một bước: mã bạn sửa được chạy thật, độ phủ được đo trên mã đã gắn đo, mỗi test case bạn viết được chạy qua bản cài đặt tham chiếu của đặc tả.</p>
<p><b>Luật của đề thật (giữ khi luyện):</b> không dùng IDE; trả lời bằng tiếng Anh; câu trả lời phải bám đúng đề này — có từ khoá không liên quan thì câu đó 0 điểm; kết quả mong đợi luôn lấy từ <b>đặc tả</b>, không bao giờ lấy từ mã.</p>
<p><b>Cách ghi câu trả lời ở đây:</b> mỗi sheet của template thành một tệp JavaScript khai một mảng — mỗi dòng/cột của template là một object (xem “Mô hình dữ liệu”). Chỉ sửa các tệp trong <code>answers/</code>.</p>`,
  },
  chucNangChinh: [
    { en: '<b>Question 1 (3 marks)</b> — review <code>GradeCalculator.finalResult</code>: at least 8 issues with line, type and fix; then correct the method.', vi: '<b>Câu 1 (3 điểm)</b> — review <code>GradeCalculator.finalResult</code>: ít nhất 8 lỗi kèm dòng, loại và cách sửa; rồi sửa phương thức.' },
    { en: '<b>Question 2 (3 marks)</b> — the MINIMUM unit test cases for 100% statement coverage, 100% decision coverage and MC/DC of the compound conditions of <code>calcParkingFee</code>.', vi: '<b>Câu 2 (3 điểm)</b> — số unit test TỐI THIỂU để đạt 100% statement, 100% decision và MC/DC cho các điều kiện ghép của <code>calcParkingFee</code>.' },
    { en: '<b>Question 3 (4 marks)</b> — black-box test cases for the <i>Library Late-Return Fine</i> function: validation · business rules (decision table) · boundary values.', vi: '<b>Câu 3 (4 điểm)</b> — test case hộp đen cho chức năng <i>Library Late-Return Fine</i>: kiểm hợp lệ · luật nghiệp vụ (bảng quyết định) · giá trị biên.' },
  ],
  yeuCauChung: [
    { en: 'Expected results come from the SPECIFICATION. When the code disagrees, the test case FAILS and that is your finding.', vi: 'Kết quả mong đợi lấy từ ĐẶC TẢ. Mã trả khác ⇒ test case FAIL — đó chính là phát hiện của bạn.' },
    { en: 'Use concrete values (never “a valid price”). Strings exactly as the specification prints them.', vi: 'Dùng giá trị cụ thể (không ghi “một giá hợp lệ”). Chuỗi đúng nguyên văn đặc tả.' },
    { en: 'Question 2 is graded like the template rule: marks ÷ minimum number of tests — an extra test case costs marks.', vi: 'Câu 2 chấm theo luật template: điểm ÷ số ca tối thiểu — thừa một ca là mất điểm.' },
  ],
  cayThuMuc: `answers/
├── q1-issues.js      ← Question 1  : const ISSUES = [...]       (sheet Q1)
├── q1-fixed.js       ← Question 1  : function finalResult(...)   (corrected — JavaScript twin)
├── q2-utcid.js       ← Question 2  : const UTCIDS = [...]       (sheet Q2 — one object per UTCID column)
└── q3-testcases.js   ← Question 3  : const TEST_CASES = [...]   (sheet Q3 — one object per row)`,
  wireframe: `+----------------------------------------------------------------+
|                  LIBRARY LATE-RETURN FINE                      |
+----------------------------------------------------------------+
|  Member Code       [ e.g. LB001                            ]   |
|  Book Price (VND)  [ Enter the list price of the book      ]   |
|  Member Type       [ -- Select member type --            v ]   |  Student / Staff
|  Days Late         [ e.g. 5                                ]   |
|  Lost Book         [ -- Select --                        v ]   |  Yes / No
|                                                                |
|                       [ Calculate Fine ]                       |
|  Fine Amount: 10,000 VND.                                      |
+----------------------------------------------------------------+`,
  moHinh: {
    ten: 'Answer records — ISSUES[i] · UTCIDS[i] · TEST_CASES[i]',
    truong: [
      ['ISSUES[i].line', 'number | "2-4"', { en: 'line number(s) in the listing of Question 1', vi: 'số dòng trong đoạn mã câu 1' }],
      ['ISSUES[i].type', 'string', { en: `one of ${LOAI_LOI.join(', ')}`, vi: `một trong ${LOAI_LOI.join(', ')}` }],
      ['ISSUES[i].severity · description · fix', 'string', { en: 'High/Medium/Low · what is wrong and why · the concrete change', vi: 'High/Medium/Low · sai gì, vì sao · sửa cụ thể thế nào' }],
      ['UTCIDS[i].id · input', 'string · object', { en: 'UTCID01… · { minutes, isWeekend, hasPass } — concrete values', vi: 'UTCID01… · { minutes, isWeekend, hasPass } — giá trị cụ thể' }],
      ['UTCIDS[i].expected', 'string', { en: 'the return value required by the SPECIFICATION', vi: 'giá trị trả về theo ĐẶC TẢ' }],
      ['UTCIDS[i].type · status', '"N"|"A"|"B" · "P"|"F"', { en: 'Normal / Abnormal / Boundary · Passed / Failed when run against the code', vi: 'Normal / Abnormal / Boundary · Passed / Failed khi chạy trên mã' }],
      ['TEST_CASES[i].id · description · precondition', 'string', { en: 'e.g. "A01" · "Verify that…" · state before the test', vi: 'vd "A01" · "Verify that…" · trạng thái trước khi chạy' }],
      ['TEST_CASES[i].steps', 'string[]', { en: 'numbered procedure', vi: 'các bước' }],
      ['TEST_CASES[i].data', 'object', { en: '{ memberCode, bookPrice, memberType, daysLate, lost } — strings as typed/selected ("" = empty / not selected)', vi: '{ memberCode, bookPrice, memberType, daysLate, lost } — chuỗi như khi gõ/chọn ("" = để trống / chưa chọn)' }],
      ['TEST_CASES[i].expected', 'string', { en: 'the exact message, e.g. "Fine Amount: 10,000 VND."', vi: 'đúng nguyên văn, vd "Fine Amount: 10,000 VND."' }],
    ],
  },
  duLieuMau: `// answers/q1-issues.js
{ line: 4, type: 'BOUNDARY', severity: 'High', description: '…', fix: '…' }
// answers/q2-utcid.js
{ id: 'UTCID01', input: { minutes: 0, isWeekend: false, hasPass: false }, expected: 'Invalid Duration', type: 'A', status: 'P' }
// answers/q3-testcases.js
{ id: 'A01', description: 'Verify that an empty Member Code is rejected', precondition: 'User is on the Library Late-Return Fine screen',
  steps: ['Leave Member Code empty', 'Enter Book Price = 200000', '…', 'Click Calculate Fine'],
  data: { memberCode: '', bookPrice: '200000', memberType: 'Student', daysLate: '5', lost: 'No' },
  expected: 'Member Code is required.' }`,
  chucNang: [
    {
      ten: { en: 'Q1.1 — Issue list (code review)', vi: 'Q1.1 — Danh sách lỗi (review mã)' }, diem: 2,
      moTa: {
        en: `<p><b>Problem description — final course result.</b> <code>finalResult</code> computes a student's final result:</p>
<ul><li><code>labs</code> holds <b>exactly 4</b> lab scores; it must not be null; every score is in [0, 10]. <code>pe</code> and <code>fe</code> are in [0, 10]. Invalid input ⇒ <code>IllegalArgumentException</code>.</li>
<li>total = 25% × lab average + 25% × PE + 50% × FE, rounded to <b>one decimal</b>.</li>
<li>The student passes when <b>total ≥ 5.0 AND PE ≥ 4.0 AND FE ≥ 4.0</b>. The method returns <code>"PASS x.x"</code> or <code>"FAIL x.x"</code>.</li></ul>
${preSo(Q1_JAVA)}
<p>Issue types: ${LOAI_LOI_HTML.en}</p>`,
        vi: `<p><b>Mô tả bài toán — kết quả cuối môn.</b> <code>finalResult</code> tính kết quả cuối môn của sinh viên:</p>
<ul><li><code>labs</code> gồm <b>đúng 4</b> điểm lab; không được null; mỗi điểm trong [0, 10]. <code>pe</code> và <code>fe</code> trong [0, 10]. Dữ liệu sai ⇒ <code>IllegalArgumentException</code>.</li>
<li>total = 25% × trung bình lab + 25% × PE + 50% × FE, làm tròn <b>một chữ số thập phân</b>.</li>
<li>Sinh viên qua môn khi <b>total ≥ 5.0 VÀ PE ≥ 4.0 VÀ FE ≥ 4.0</b>. Phương thức trả <code>"PASS x.x"</code> hoặc <code>"FAIL x.x"</code>.</li></ul>
${preSo(Q1_JAVA)}
<p>Loại lỗi: ${LOAI_LOI_HTML.vi}</p>`,
      },
      yeuCau: [
        { en: 'Find <b>at least 8</b> distinct issues. One row = one issue; an issue counts when its line AND type match a real defect.', vi: 'Tìm <b>ít nhất 8</b> lỗi khác nhau. Mỗi dòng = một lỗi; lỗi được tính khi đúng dòng VÀ đúng loại.' },
        { en: 'Every issue has a concrete fix. Do not report legal code as a compile error.', vi: 'Mỗi lỗi có cách sửa cụ thể. Không báo mã hợp lệ là lỗi biên dịch.' },
      ],
      hook: ['checklist-based review', 'desk checking'],
    },
    {
      ten: { en: 'Q1.2 — Corrected method (runs for real)', vi: 'Q1.2 — Phương thức đã sửa (chạy thật)' }, diem: 1,
      yeuCau: [
        { en: 'In <code>answers/q1-fixed.js</code> fix the JavaScript twin <code>finalResult(labs, pe, fe)</code> so that it satisfies the specification above.', vi: 'Trong <code>answers/q1-fixed.js</code> sửa bản JavaScript <code>finalResult(labs, pe, fe)</code> cho đúng đặc tả ở trên.' },
        { en: 'Invalid input throws <code>IllegalArgumentException</code> (class given in the file). Output keeps exactly one decimal, e.g. <code>"PASS 5.0"</code>.', vi: 'Dữ liệu sai ném <code>IllegalArgumentException</code> (lớp có sẵn trong tệp). Kết quả giữ đúng một chữ số thập phân, vd <code>"PASS 5.0"</code>.' },
      ],
      hook: ['debugging', 'confirmation testing'],
      viDu: { en: 'finalResult([8, 9, 7, 6], 6, 7)  →  "PASS 6.9"     (7.5×0.25 + 6×0.25 + 7×0.5 = 6.875 → 6.9)', vi: 'finalResult([8, 9, 7, 6], 6, 7)  →  "PASS 6.9"     (7.5×0.25 + 6×0.25 + 7×0.5 = 6.875 → 6.9)' },
    },
    {
      ten: { en: 'Q2.1 — Coverage with the minimum test set', vi: 'Q2.1 — Đạt độ phủ với bộ test tối thiểu' }, diem: 1.5,
      moTa: {
        en: `<p><b>Method description.</b> <code>calcParkingFee</code> returns the parking fee of a car park. A stay is valid from <b>1 to 1440 minutes</b>; otherwise <code>"Invalid Duration"</code>. Monthly-pass holders park <b>free on weekdays</b>. Everybody else pays per <b>started</b> hour: 10,000 VND/h on weekdays, 15,000 VND/h at weekends; from the 4th hour on the hourly rate is halved. Result: <code>"Fee: &lt;amount&gt; VND"</code> with a plain integer amount (e.g. <code>"Fee: 20000 VND"</code>).</p>
${preSo(Q2_JAVA)}${Q2_CFG}`,
        vi: `<p><b>Mô tả phương thức.</b> <code>calcParkingFee</code> trả phí gửi xe. Thời gian gửi hợp lệ từ <b>1 tới 1440 phút</b>; ngoài khoảng ⇒ <code>"Invalid Duration"</code>. Người có vé tháng gửi <b>miễn phí ngày thường</b>. Mọi người khác trả theo <b>giờ bắt đầu</b>: 10.000 đ/giờ ngày thường, 15.000 đ/giờ cuối tuần; từ giờ thứ 4 giá mỗi giờ giảm một nửa. Kết quả: <code>"Fee: &lt;số tiền&gt; VND"</code> với số nguyên viết liền (vd <code>"Fee: 20000 VND"</code>).</p>
${preSo(Q2_JAVA)}${Q2_CFG}`,
      },
      yeuCau: [
        { en: 'Choose the <b>minimum</b> number of test cases that gives 100% statement coverage, 100% decision coverage and MC/DC for BOTH compound conditions (lines 2 and 4).', vi: 'Chọn số ca <b>tối thiểu</b> cho 100% statement, 100% decision và MC/DC cho CẢ HAI điều kiện ghép (dòng 2 và 4).' },
        { en: 'Coverage is measured on the code as written (with its defect), so pick inputs by reading the code.', vi: 'Độ phủ đo trên mã đúng như đang viết (kể cả lỗi), nên chọn input bằng cách đọc mã.' },
      ],
      hook: ['statement coverage', 'decision coverage', 'MC/DC'],
    },
    {
      ten: { en: 'Q2.2 — UTCID grid: expected, type, result', vi: 'Q2.2 — Lưới UTCID: mong đợi, loại, kết quả' }, diem: 1.5,
      yeuCau: [
        { en: '<code>expected</code> = what the SPECIFICATION says (per started hour). <code>status</code> = <code>"P"</code> when the code returns the expected value, otherwise <code>"F"</code> (log the defect).', vi: '<code>expected</code> = điều ĐẶC TẢ nói (theo giờ bắt đầu). <code>status</code> = <code>"P"</code> khi mã trả đúng mong đợi, ngược lại <code>"F"</code> (ghi defect).' },
        { en: '<code>type</code>: <code>A</code> for invalid input, <code>B</code> for a boundary value (1, 180, 181, 1440 minutes; 0 and 1441 may be A or B), otherwise <code>N</code>.', vi: '<code>type</code>: <code>A</code> cho input không hợp lệ, <code>B</code> cho giá trị biên (1, 180, 181, 1440 phút; 0 và 1441 ghi A hay B đều được), còn lại <code>N</code>.' },
      ],
      hook: ['UTCID template', 'N/A/B'],
    },
    {
      ten: { en: 'Q3.A — Validation test cases', vi: 'Q3.A — Test case kiểm hợp lệ' }, diem: 1,
      moTa: {
        en: `<p><b>Function description.</b> The function calculates the fine for a library book returned late or lost.</p>
<p><b>Fields:</b> Member Code — required; the codes in the system are <code>LB001</code>, <code>LB002</code>, <code>LB003</code>. Book Price (VND) — required, an <b>integer &gt; 0</b>. Member Type — required (Student / Staff). Days Late — required, an <b>integer ≥ 0</b>. Lost Book — required (Yes / No).</p>
<p>When the user clicks <b>Calculate Fine</b> the system performs these steps <b>in order</b> and stops at the first error:</p>
<ol><li>Member Code: empty → <code>Member Code is required.</code>; not in the system → <code>Invalid Member Code.</code></li>
<li>Book Price: empty → <code>Book Price is required.</code>; not an integer or ≤ 0 → <code>Book Price must be an integer &gt; 0.</code></li>
<li>Member Type: not selected → <code>Member Type is required.</code></li>
<li>Days Late: empty → <code>Days Late is required.</code>; not an integer or &lt; 0 → <code>Days Late must be an integer ≥ 0.</code></li>
<li>Lost Book: not selected → <code>Lost Status is required.</code></li>
<li>Calculate the fine:
<ul><li><b>Lost book</b>: Student pays the book price + 50,000 VND processing fee; Staff pays the book price (days late ignored).</li>
<li><b>Not lost — Student</b>: 0 days → 0; 1–7 days → 2,000 VND/day; 8 days or more → 5,000 VND/day for <b>every</b> day.</li>
<li><b>Not lost — Staff</b>: 0–14 days → 0 (grace period); 15 days or more → 3,000 VND for each day beyond 14.</li>
<li>The fine for a book that is <b>not lost</b> never exceeds the book price (it is capped at the price).</li></ul></li>
<li>Display <code>Fine Amount: [x] VND.</code> with thousands separators.</li></ol>
<p><b>Calculation examples</b></p>${MAU_Q3}`,
        vi: `<p><b>Mô tả chức năng.</b> Tính tiền phạt cho sách thư viện trả muộn hoặc làm mất.</p>
<p><b>Các trường:</b> Member Code — bắt buộc; mã có trong hệ thống là <code>LB001</code>, <code>LB002</code>, <code>LB003</code>. Book Price (VND) — bắt buộc, <b>số nguyên &gt; 0</b>. Member Type — bắt buộc (Student / Staff). Days Late — bắt buộc, <b>số nguyên ≥ 0</b>. Lost Book — bắt buộc (Yes / No).</p>
<p>Khi bấm <b>Calculate Fine</b> hệ thống làm các bước <b>theo thứ tự</b> và dừng ở lỗi đầu tiên:</p>
<ol><li>Member Code: trống → <code>Member Code is required.</code>; không có trong hệ thống → <code>Invalid Member Code.</code></li>
<li>Book Price: trống → <code>Book Price is required.</code>; không phải số nguyên hoặc ≤ 0 → <code>Book Price must be an integer &gt; 0.</code></li>
<li>Member Type: chưa chọn → <code>Member Type is required.</code></li>
<li>Days Late: trống → <code>Days Late is required.</code>; không phải số nguyên hoặc &lt; 0 → <code>Days Late must be an integer ≥ 0.</code></li>
<li>Lost Book: chưa chọn → <code>Lost Status is required.</code></li>
<li>Tính tiền phạt:
<ul><li><b>Mất sách</b>: Student trả giá sách + 50.000 đ phí xử lý; Staff trả giá sách (bỏ qua số ngày trễ).</li>
<li><b>Không mất — Student</b>: 0 ngày → 0; 1–7 ngày → 2.000 đ/ngày; từ 8 ngày → 5.000 đ/ngày cho <b>mọi</b> ngày.</li>
<li><b>Không mất — Staff</b>: 0–14 ngày → 0 (ân hạn); từ 15 ngày → 3.000 đ cho mỗi ngày vượt 14.</li>
<li>Tiền phạt của sách <b>không mất</b> không bao giờ vượt giá sách (bị chặn ở giá sách).</li></ul></li>
<li>Hiển thị <code>Fine Amount: [x] VND.</code> có dấu phân cách hàng nghìn.</li></ol>
<p><b>Ví dụ tính</b></p>${MAU_Q3}`,
      },
      yeuCau: [
        { en: 'One test case for EVERY message, including each different reason behind the same message (price: text, 0, negative; days: decimal, negative).', vi: 'Một test case cho MỖI thông báo, kể cả từng lý do khác nhau của cùng một thông báo (giá: chữ, 0, số âm; ngày: thập phân, số âm).' },
        { en: 'Only the field under test is invalid; every other field is valid.', vi: 'Chỉ trường đang test là sai; các trường khác hợp lệ.' },
      ],
      hook: ['equivalence partitioning', 'test case template'],
    },
    {
      ten: { en: 'Q3.B — Business rules (reduced decision table)', vi: 'Q3.B — Luật nghiệp vụ (bảng quyết định rút gọn)' }, diem: 2,
      yeuCau: [
        { en: 'Cover all 8 rules: R1 lost+Student · R2 lost+Staff · R3 Student 0 days · R4 Student 1–7 · R5 Student ≥ 8 (not capped) · R6 Staff 0–14 · R7 Staff ≥ 15 (not capped) · R8 fine capped at the book price.', vi: 'Phủ đủ 8 luật: R1 mất+Student · R2 mất+Staff · R3 Student 0 ngày · R4 Student 1–7 · R5 Student ≥ 8 (không chặn) · R6 Staff 0–14 · R7 Staff ≥ 15 (không chặn) · R8 tiền phạt bị chặn ở giá sách.' },
        { en: 'Each expected amount must be computed correctly (with thousands separators).', vi: 'Mỗi số tiền mong đợi phải tính đúng (có dấu phân cách hàng nghìn).' },
      ],
      hook: ['decision table testing'],
    },
    {
      ten: { en: 'Q3.C — Boundary values', vi: 'Q3.C — Giá trị biên' }, diem: 1,
      yeuCau: [
        { en: 'Student days 0/1 and 7/8, Staff days 14/15; the cap edge (computed fine = price, and price one below the computed fine); smallest valid price 1 and invalid price 0.', vi: 'Student 0/1 và 7/8 ngày, Staff 14/15 ngày; biên chặn (tiền phạt tính ra = giá sách, và giá sách nhỏ hơn tiền phạt 1 đồng); giá hợp lệ nhỏ nhất 1 và giá không hợp lệ 0.' },
      ],
      hook: ['2-value BVA'],
    },
  ],
  idBatBuoc: [
    ['ISSUES', { en: 'answers/q1-issues.js — Question 1 issue list', vi: 'answers/q1-issues.js — danh sách lỗi câu 1' }],
    ['finalResult(labs, pe, fe)', { en: 'answers/q1-fixed.js — corrected method', vi: 'answers/q1-fixed.js — phương thức đã sửa' }],
    ['UTCIDS', { en: 'answers/q2-utcid.js — UTCID columns of Question 2', vi: 'answers/q2-utcid.js — các cột UTCID câu 2' }],
    ['TEST_CASES', { en: 'answers/q3-testcases.js — test cases of Question 3', vi: 'answers/q3-testcases.js — test case câu 3' }],
  ],
  truDiem: [
    { en: 'Expected value copied from the code (e.g. writing the code’s 10000 for 90 minutes) — the test then “passes” and the defect is never reported.', vi: 'Chép kết quả mong đợi từ mã (vd ghi 10000 của mã cho 90 phút) — ca “đạt” và lỗi không bao giờ được báo.' },
    { en: 'Four tests for Question 2: enough for statement + decision, NOT for MC/DC of both compound conditions.', vi: 'Bốn ca cho câu 2: đủ statement + decision, KHÔNG đủ MC/DC cho cả hai điều kiện ghép.' },
    { en: 'Reporting <code>&amp;&amp;</code>/<code>||</code> mixing on line 10 as a compile error, or line 7 as integer division.', vi: 'Báo dòng 10 (trộn <code>&amp;&amp;</code>/<code>||</code>) là lỗi biên dịch, hoặc dòng 7 là phép chia nguyên.' },
    { en: 'Several invalid fields in one validation test case — you cannot tell which check rejected it.', vi: 'Nhiều trường sai trong một ca kiểm hợp lệ — không biết bước nào đã từ chối.' },
  ],
  nopBai: NOP_BAI,
};

/* ════════════════════════════════ TỆP TRẢ LỜI ════════════════════════════════ */
const DAU_Q1 = `// Question 1 — sheet Q1 of the template. One object per issue (at least 8).
// type: ${LOAI_LOI.join(' | ')}
const ISSUES = [
  { line: 4, type: 'BOUNDARY', severity: 'High', description: 'The loop starts at i = 1, so labs[0] is never added.', fix: 'Start the loop at i = 0.' },
];
`;
const GIAI_Q1 = `// Question 1 — sheet Q1. Twelve issues; any 8 correct ones earn the list marks.
const ISSUES = [
  { line: 3, type: 'VALIDATION', severity: 'Medium', description: 'labs is never checked for null: labs.length on line 4 throws NullPointerException.', fix: 'if (labs == null) throw new IllegalArgumentException("labs must not be null");' },
  { line: 4, type: 'VALIDATION', severity: 'Medium', description: 'The spec requires exactly 4 lab scores but labs.length is never checked.', fix: 'if (labs.length != 4) throw new IllegalArgumentException("exactly 4 lab scores");' },
  { line: 5, type: 'VALIDATION', severity: 'Medium', description: 'Lab scores are not checked to be in [0, 10]; 12 or -3 is accepted.', fix: 'Inside the loop reject labs[i] < 0 || labs[i] > 10.' },
  { line: 2, type: 'VALIDATION', severity: 'Medium', description: 'pe and fe are not checked to be in [0, 10] (the demo even passes fe = 11).', fix: 'Throw IllegalArgumentException when pe or fe is outside [0, 10].' },
  { line: 4, type: 'BOUNDARY', severity: 'High', description: 'Off-by-one: the loop starts at i = 1, so the first lab score is skipped and the average is too low.', fix: 'for (int i = 0; i < labs.length; i++)' },
  { line: 8, type: 'CALCULATION', severity: 'High', description: 'FE weight is 0.05; the spec says 50%.', fix: 'fe * 0.5' },
  { line: 9, type: 'CALCULATION', severity: 'High', description: 'Math.round returns long; long / int is an integer division, so 6.875 becomes 6.0 instead of 6.9.', fix: 'total = Math.round(total * 10) / 10.0;' },
  { line: 10, type: 'BOUNDARY', severity: 'Medium', description: 'pe > 4 rejects a PE of exactly 4.0, which the spec accepts.', fix: 'pe >= 4' },
  { line: 10, type: 'LOGIC', severity: 'High', description: '"|| total >= 5": && binds tighter, so a student with total >= 5 passes even with PE or FE below 4, and the total is never required in the first part.', fix: 'if (total >= 5 && pe >= 4 && fe >= 4)' },
  { line: 14, type: 'COMPILE', severity: 'High', description: '"result + total;" is not a statement: the class does not compile (and the total would never be appended).', fix: 'result = result + total; (or return "FAIL " + total;)' },
  { line: 19, type: 'TEST_DATA', severity: 'Low', description: 'Demo data holds 3 lab scores; the spec requires 4.', fix: 'double[] labs = {8, 9, 7, 6};' },
  { line: 20, type: 'TEST_DATA', severity: 'Low', description: 'fe = 11 is outside [0, 10] and the result is only printed — no expected value is checked.', fix: 'Use valid data (fe = 7 → expected "PASS 6.9") and move the check into a unit test.' },
  { line: 8, type: 'CONVENTION', severity: 'Low', description: 'Magic numbers 0.25, 0.5, 4 and 5 hide the business rules.', fix: 'Named constants LAB_WEIGHT, PE_WEIGHT, FE_WEIGHT, MIN_EXAM_SCORE, PASS_TOTAL.' },
];
`;
const DAU_Q2 = `// Question 2 — sheet Q2 (UTCID grid). One object per UTCID column.
// input: concrete values · expected: from the SPECIFICATION · type: "N" | "A" | "B" · status: "P" | "F" (run against the code)
const UTCIDS = [
  { id: 'UTCID01', input: { minutes: 0, isWeekend: false, hasPass: false }, expected: 'Invalid Duration', type: 'A', status: 'P' },
];
`;
const GIAI_Q2 = `// Question 2 — the minimum is 5 test cases.
//  · MC/DC of line 2 (A || B): A=T (0 min), B=T (1441 min) and a valid baseline with A=F,B=F → 2 invalid tests.
//  · MC/DC of line 4 (hasPass && !isWeekend): (T,T)→Free, (F,T)→fee, (T,F)→fee → 3 valid tests.
//  · Those 3 valid tests also give line 7 both outcomes (weekday/weekend) and line 8 both outcomes (≤ 3 h / > 3 h).
// UTCID04: the SPEC charges per STARTED hour → 90 min = 2 h = 20000; the code (minutes / 60) charges 1 h = 10000 → F, defect on line 6.
const UTCIDS = [
  { id: 'UTCID01', input: { minutes: 0, isWeekend: false, hasPass: false }, expected: 'Invalid Duration', type: 'A', status: 'P' },
  { id: 'UTCID02', input: { minutes: 1441, isWeekend: false, hasPass: false }, expected: 'Invalid Duration', type: 'A', status: 'P' },
  { id: 'UTCID03', input: { minutes: 120, isWeekend: false, hasPass: true }, expected: 'Free', type: 'N', status: 'P' },
  { id: 'UTCID04', input: { minutes: 90, isWeekend: false, hasPass: false }, expected: 'Fee: 20000 VND', type: 'N', status: 'F' },
  { id: 'UTCID05', input: { minutes: 300, isWeekend: true, hasPass: true }, expected: 'Fee: 60000 VND', type: 'N', status: 'P' },
];
`;
const TC = (id, description, data, expected) => ({ id, description, data, expected });
const Q3_GIAI_DS = [
  TC('A01', 'Verify that an empty Member Code is rejected', { memberCode: '', bookPrice: '200000', memberType: 'Student', daysLate: '5', lost: 'No' }, 'Member Code is required.'),
  TC('A02', 'Verify that a Member Code not in the system is rejected', { memberCode: 'XX999', bookPrice: '200000', memberType: 'Student', daysLate: '5', lost: 'No' }, 'Invalid Member Code.'),
  TC('A03', 'Verify that an empty Book Price is rejected', { memberCode: 'LB001', bookPrice: '', memberType: 'Student', daysLate: '5', lost: 'No' }, 'Book Price is required.'),
  TC('A04', 'Verify that a non-numeric Book Price is rejected', { memberCode: 'LB001', bookPrice: 'abc', memberType: 'Student', daysLate: '5', lost: 'No' }, 'Book Price must be an integer > 0.'),
  TC('A05', 'Verify that Book Price = 0 is rejected (invalid boundary)', { memberCode: 'LB001', bookPrice: '0', memberType: 'Student', daysLate: '5', lost: 'No' }, 'Book Price must be an integer > 0.'),
  TC('A06', 'Verify that a negative Book Price is rejected', { memberCode: 'LB001', bookPrice: '-5000', memberType: 'Student', daysLate: '5', lost: 'No' }, 'Book Price must be an integer > 0.'),
  TC('A07', 'Verify that a decimal Book Price is rejected', { memberCode: 'LB001', bookPrice: '12.5', memberType: 'Student', daysLate: '5', lost: 'No' }, 'Book Price must be an integer > 0.'),
  TC('A08', 'Verify that Member Type must be selected', { memberCode: 'LB001', bookPrice: '200000', memberType: '', daysLate: '5', lost: 'No' }, 'Member Type is required.'),
  TC('A09', 'Verify that an empty Days Late is rejected', { memberCode: 'LB001', bookPrice: '200000', memberType: 'Student', daysLate: '', lost: 'No' }, 'Days Late is required.'),
  TC('A10', 'Verify that a decimal Days Late is rejected', { memberCode: 'LB001', bookPrice: '200000', memberType: 'Student', daysLate: '2.5', lost: 'No' }, 'Days Late must be an integer ≥ 0.'),
  TC('A11', 'Verify that Days Late = -1 is rejected (invalid boundary)', { memberCode: 'LB001', bookPrice: '200000', memberType: 'Student', daysLate: '-1', lost: 'No' }, 'Days Late must be an integer ≥ 0.'),
  TC('A12', 'Verify that Lost Book must be selected', { memberCode: 'LB001', bookPrice: '200000', memberType: 'Student', daysLate: '5', lost: '' }, 'Lost Status is required.'),
  TC('A13', 'Verify that with every field empty only the first error is shown', { memberCode: '', bookPrice: '', memberType: '', daysLate: '', lost: '' }, 'Member Code is required.'),
  TC('B01', 'R1 — a Student who lost the book pays price + 50,000', { memberCode: 'LB001', bookPrice: '200000', memberType: 'Student', daysLate: '3', lost: 'Yes' }, 'Fine Amount: 250,000 VND.'),
  TC('B02', 'R2 — Staff who lost the book pays the price only', { memberCode: 'LB002', bookPrice: '200000', memberType: 'Staff', daysLate: '3', lost: 'Yes' }, 'Fine Amount: 200,000 VND.'),
  TC('B03', 'R3 — a Student returning on time pays nothing', { memberCode: 'LB001', bookPrice: '200000', memberType: 'Student', daysLate: '0', lost: 'No' }, 'Fine Amount: 0 VND.'),
  TC('B04', 'R4 — Student 5 days late: 2,000 per day', { memberCode: 'LB001', bookPrice: '200000', memberType: 'Student', daysLate: '5', lost: 'No' }, 'Fine Amount: 10,000 VND.'),
  TC('B05', 'R5 — Student 10 days late: 5,000 for every day', { memberCode: 'LB001', bookPrice: '200000', memberType: 'Student', daysLate: '10', lost: 'No' }, 'Fine Amount: 50,000 VND.'),
  TC('B06', 'R6 — Staff 10 days late is inside the grace period', { memberCode: 'LB003', bookPrice: '200000', memberType: 'Staff', daysLate: '10', lost: 'No' }, 'Fine Amount: 0 VND.'),
  TC('B07', 'R7 — Staff 20 days late pays 3,000 per day beyond 14', { memberCode: 'LB003', bookPrice: '200000', memberType: 'Staff', daysLate: '20', lost: 'No' }, 'Fine Amount: 18,000 VND.'),
  TC('B08', 'R8 — the fine is capped at the book price', { memberCode: 'LB001', bookPrice: '100000', memberType: 'Student', daysLate: '30', lost: 'No' }, 'Fine Amount: 100,000 VND.'),
  TC('C01', 'Boundary — Student 1 day late (first paying day)', { memberCode: 'LB001', bookPrice: '200000', memberType: 'Student', daysLate: '1', lost: 'No' }, 'Fine Amount: 2,000 VND.'),
  TC('C02', 'Boundary — Student 7 days late (last day of the 2,000 band)', { memberCode: 'LB001', bookPrice: '200000', memberType: 'Student', daysLate: '7', lost: 'No' }, 'Fine Amount: 14,000 VND.'),
  TC('C03', 'Boundary — Student 8 days late (first day of the 5,000 band)', { memberCode: 'LB001', bookPrice: '200000', memberType: 'Student', daysLate: '8', lost: 'No' }, 'Fine Amount: 40,000 VND.'),
  TC('C04', 'Boundary — Staff 14 days late (last day of grace)', { memberCode: 'LB002', bookPrice: '200000', memberType: 'Staff', daysLate: '14', lost: 'No' }, 'Fine Amount: 0 VND.'),
  TC('C05', 'Boundary — Staff 15 days late (first paying day)', { memberCode: 'LB002', bookPrice: '200000', memberType: 'Staff', daysLate: '15', lost: 'No' }, 'Fine Amount: 3,000 VND.'),
  TC('C06', 'Boundary — computed fine equals the book price (not capped)', { memberCode: 'LB001', bookPrice: '40000', memberType: 'Student', daysLate: '8', lost: 'No' }, 'Fine Amount: 40,000 VND.'),
  TC('C07', 'Boundary — computed fine is 1 VND above the book price (capped)', { memberCode: 'LB001', bookPrice: '39999', memberType: 'Student', daysLate: '8', lost: 'No' }, 'Fine Amount: 39,999 VND.'),
  TC('C08', 'Boundary — smallest valid Book Price = 1', { memberCode: 'LB002', bookPrice: '1', memberType: 'Staff', daysLate: '0', lost: 'Yes' }, 'Fine Amount: 1 VND.'),
];
const buoc = (d) => [
  `Enter Member Code = ${d.memberCode === '' ? '(empty)' : d.memberCode}`,
  `Enter Book Price = ${d.bookPrice === '' ? '(empty)' : d.bookPrice}`,
  `Select Member Type = ${d.memberType === '' ? '(not selected)' : d.memberType}`,
  `Enter Days Late = ${d.daysLate === '' ? '(empty)' : d.daysLate}`,
  `Select Lost Book = ${d.lost === '' ? '(not selected)' : d.lost}`,
  'Click Calculate Fine',
];
const inTC = (t) => `  {
    id: '${t.id}', description: '${t.description.replace(/'/g, "\\'")}',
    precondition: 'User is on the Library Late-Return Fine screen; members LB001–LB003 exist',
    steps: ${JSON.stringify(buoc(t.data))},
    data: ${JSON.stringify(t.data).replace(/"/g, "'")},
    expected: '${t.expected}',
  },`;
const DAU_Q3 = `// Question 3 — sheet Q3. One object per test case row.
// data: the five fields exactly as typed / selected ("" = left empty / not selected)
const TEST_CASES = [
${inTC(Q3_GIAI_DS[0])}
];
`;
const GIAI_Q3 = `// Question 3 — 29 test cases: A = validation (every message and every reason), B = the 8 decision-table rules,
// C = boundary values. Assumptions: validation stops at the first error; amounts use "," as thousands separator.
const TEST_CASES = [
${Q3_GIAI_DS.map(inTC).join('\n')}
];
`;

/* ════════════════════════════════ BỘ KIỂM ════════════════════════════════ */
const KIEM_Q1 = kiemReview({
  bien: 'ISSUES', khoa: Q1_KHOA, sai: Q1_SAI, toiThieu: 8, nhom: 'f1', loaiHopLe: LOAI_LOI,
});
const goiQ1 = (args, mong, moTa, an = true) => ({ moTa, goi: `finalResult(${args})`, mongDoi: mong, nhom: 'f2', ...(an ? { an: true } : {}) });
const KIEM_Q1FIX = [
  goiQ1('[8, 9, 7, 6], 6, 7', 'PASS 6.9', { en: 'finalResult([8,9,7,6], 6, 7) → "PASS 6.9" (all four labs, FE weight 0.5, one decimal)', vi: 'finalResult([8,9,7,6], 6, 7) → "PASS 6.9"' }, false),
  goiQ1('[4, 4, 4, 4], 4, 6', 'PASS 5.0', { en: 'finalResult([4,4,4,4], 4, 6) → "PASS 5.0" (total exactly 5.0, PE exactly 4)', vi: 'finalResult([4,4,4,4], 4, 6) → "PASS 5.0" (tổng đúng 5.0, PE đúng 4)' }, false),
  goiQ1('[10, 10, 10, 10], 3.5, 9', 'FAIL 7.9', { en: 'PE below 4 fails even with a high total', vi: 'PE dưới 4 thì trượt dù tổng cao' }),
  goiQ1('[9, 9, 9, 9], 9, 3.5', 'FAIL 6.3', { en: 'FE below 4 fails even with a high total', vi: 'FE dưới 4 thì trượt dù tổng cao' }),
  goiQ1('[5, 5, 5, 5], 4, 6', 'PASS 5.3', { en: 'rounding to one decimal (5.25 → 5.3)', vi: 'làm tròn một chữ số (5.25 → 5.3)' }),
  goiQ1('[4, 4, 4, 4], 4, 5.5', 'FAIL 4.8', { en: 'total just below 5 fails', vi: 'tổng ngay dưới 5 thì trượt' }),
  goiQ1('null, 5, 5', { loi: 'IllegalArgumentException' }, { en: 'null labs → IllegalArgumentException', vi: 'labs null → IllegalArgumentException' }),
  goiQ1('[8, 9, 7], 5, 5', { loi: 'IllegalArgumentException' }, { en: '3 lab scores → IllegalArgumentException', vi: '3 điểm lab → IllegalArgumentException' }),
  goiQ1('[8, 9, 7, 11], 5, 5', { loi: 'IllegalArgumentException' }, { en: 'a lab score of 11 → IllegalArgumentException', vi: 'điểm lab 11 → IllegalArgumentException' }),
  goiQ1('[8, 9, 7, 6], -0.5, 5', { loi: 'IllegalArgumentException' }, { en: 'PE below 0 → IllegalArgumentException', vi: 'PE dưới 0 → IllegalArgumentException' }),
  goiQ1('[8, 9, 7, 6], 5, 10.5', { loi: 'IllegalArgumentException' }, { en: 'FE above 10 → IllegalArgumentException', vi: 'FE trên 10 → IllegalArgumentException' }),
];
const KIEM_Q2 = kiemPhu({
  code: Q2_DO, ham: 'calcParkingFee', thamSo: ['minutes', 'isWeekend', 'hasPass'], spec: q2Spec.toString(), bien: 'UTCIDS',
  do: { mcdc: ['D1', 'D2'], toiThieu: 5, loai: q2Loai.toString(), trangThai: true },
  nhom: { lenh: 'f3', nhanh: 'f3', mcdc: 'f3', toiThieu: 'f3', kyVong: 'f4', loai: 'f4', trangThai: 'f4' },
});
const KIEM_Q3 = kiemTestCase({
  bien: 'TEST_CASES', heThong: q3HeThong.toString(), nhan: q3Nhan.toString(),
  truongData: ['memberCode', 'bookPrice', 'memberType', 'daysLate', 'lost'],
  nhomCauTruc: 'f5', nhomKyVong: 'f5', toiDa: 45,
  khoi: [
    {
      moTa: { en: 'Validation', vi: 'Kiểm hợp lệ' }, nhom: 'f5', tungMuc: true,
      can: [
        { ma: 'V_CODE_EMPTY', ten: 'empty Member Code' }, { ma: 'V_CODE_INVALID', ten: 'Member Code not in the system' },
        { ma: 'V_PRICE_EMPTY', ten: 'empty Book Price' }, { ma: 'V_PRICE_TEXT', ten: 'non-numeric Book Price' },
        { ma: 'V_PRICE_ZERO', ten: 'Book Price = 0' }, { ma: 'V_PRICE_NEG', ten: 'negative Book Price' },
        { ma: 'V_TYPE', ten: 'Member Type not selected' }, { ma: 'V_DAYS_EMPTY', ten: 'empty Days Late' },
        { ma: 'V_DAYS_DECIMAL', ten: 'decimal Days Late' }, { ma: 'V_DAYS_NEG', ten: 'negative Days Late' },
        { ma: 'V_LOST', ten: 'Lost Book not selected' },
      ],
    },
    {
      moTa: { en: 'Decision-table rule', vi: 'Luật bảng quyết định' }, nhom: 'f6', tungMuc: true,
      can: [
        { ma: 'R1', ten: 'R1 lost + Student' }, { ma: 'R2', ten: 'R2 lost + Staff' }, { ma: 'R3', ten: 'R3 Student, 0 days' },
        { ma: 'R4', ten: 'R4 Student, 1–7 days' }, { ma: 'R5', ten: 'R5 Student, ≥ 8 days (not capped)' }, { ma: 'R6', ten: 'R6 Staff, 0–14 days' },
        { ma: 'R7', ten: 'R7 Staff, ≥ 15 days (not capped)' }, { ma: 'R8', ten: 'R8 fine capped at the book price' },
      ],
    },
    {
      moTa: { en: 'Boundary value', vi: 'Giá trị biên' }, nhom: 'f7', tungMuc: true,
      can: [
        { ma: 'B_S0', ten: 'Student 0 days' }, { ma: 'B_S1', ten: 'Student 1 day' }, { ma: 'B_S7', ten: 'Student 7 days' }, { ma: 'B_S8', ten: 'Student 8 days' },
        { ma: 'B_T14', ten: 'Staff 14 days' }, { ma: 'B_T15', ten: 'Staff 15 days' }, { ma: 'B_CAP_EQ', ten: 'computed fine = book price' },
        { ma: 'B_CAP_OVER', ten: 'computed fine = book price + 1 (capped)' }, { ma: 'B_PRICE_1', ten: 'Book Price = 1' }, { ma: 'B_PRICE_0', ten: 'Book Price = 0' },
      ],
    },
  ],
});
// một số kiểm ẩn như đề thật: giữ nguyên thứ tự, ẩn các mục biên khó + mutant
const KIEM = [...KIEM_Q1, ...KIEM_Q1FIX, ...KIEM_Q2, ...KIEM_Q3].map((k) => {
  const en = typeof k.moTa === 'object' ? k.moTa.en : k.moTa;
  return /CAP_OVER|computed fine = book price \+ 1|Book Price = 0$/.test(en) ? { ...k, an: true } : k;
});

const GIAI_THICH = {
  en: `<h4>Question 1</h4><p>The decisive defects: the loop skips <code>labs[0]</code> (line 4), FE weighs 0.05 instead of 0.5 (line 8), <code>Math.round(...) / 10</code> is a <code>long / int</code> division (line 9), <code>&amp;&amp;</code> binds tighter than <code>||</code> so any total ≥ 5 passes (line 10) and line 14 does not even compile. Two classic false claims: line 7 is a <code>double</code> division, and mixing <code>&amp;&amp;</code>/<code>||</code> compiles. The corrected method validates first, sums from index 0, keeps one decimal with <code>/ 10.0</code> and ANDs the three pass conditions.</p>
<h4>Question 2</h4><p>Five decisions are reachable; two of them are compound. MC/DC of <code>A || B</code> on line 2 needs A alone true (0) and B alone true (1441) against an all-false baseline; MC/DC of <code>hasPass &amp;&amp; !isWeekend</code> needs (T,T), (F,T) and (T,F). The three valid tests also flip lines 7 and 8, so <b>5 tests are the minimum</b> (4 are enough for statement + decision only). Expected values follow the spec (<i>per started hour</i>): 90 minutes = 2 hours = 20,000, while the code computes <code>90 / 60 = 1</code> → UTCID04 is <b>F</b> and a defect is logged against line 6.</p>
<pre>@ParameterizedTest
@CsvSource({ "0,false,false,Invalid Duration", "1441,false,false,Invalid Duration",
             "120,false,true,Free", "90,false,false,Fee: 20000 VND", "300,true,true,Fee: 60000 VND" })
void calcParkingFee(int minutes, boolean weekend, boolean pass, String expected) {
    assertEquals(expected, Parking.calcParkingFee(minutes, weekend, pass)); // UTCID04 fails → BUG on line 6
}</pre>
<h4>Question 3</h4><p>Block A gives every message one case and every <i>reason</i> behind a shared message its own case (text / 0 / negative price; decimal / negative days). Block B is the reduced decision table: lost (2 rules, days irrelevant) + Student (3 bands) + Staff (2 bands) + the cap rule = 8 rules. Block C tests both sides of every edge: 0|1 and 7|8 days for students, 14|15 for staff, and the cap edge (fine = price vs price one below the fine).</p>`,
  vi: `<h4>Câu 1</h4><p>Các lỗi quyết định: vòng lặp bỏ <code>labs[0]</code> (dòng 4), FE nhân 0.05 thay vì 0.5 (dòng 8), <code>Math.round(...) / 10</code> là phép chia <code>long / int</code> (dòng 9), <code>&amp;&amp;</code> ưu tiên hơn <code>||</code> nên tổng ≥ 5 là qua (dòng 10), và dòng 14 không biên dịch được. Hai khẳng định sai kinh điển: dòng 7 là phép chia <code>double</code>, còn trộn <code>&amp;&amp;</code>/<code>||</code> vẫn biên dịch. Bản sửa kiểm hợp lệ trước, cộng từ chỉ số 0, giữ một chữ số thập phân bằng <code>/ 10.0</code> và nối ba điều kiện qua môn bằng AND.</p>
<h4>Câu 2</h4><p>Có năm quyết định, hai cái là điều kiện ghép. MC/DC của <code>A || B</code> ở dòng 2 cần A đúng một mình (0) và B đúng một mình (1441) so với ca nền đều sai; MC/DC của <code>hasPass &amp;&amp; !isWeekend</code> cần (T,T), (F,T), (T,F). Ba ca hợp lệ đó cũng lật được dòng 7 và 8, nên <b>tối thiểu 5 ca</b> (chỉ statement + decision thì 4 ca là đủ). Kết quả mong đợi theo đặc tả (<i>theo giờ bắt đầu</i>): 90 phút = 2 giờ = 20.000, còn mã tính <code>90 / 60 = 1</code> → UTCID04 là <b>F</b>, ghi defect ở dòng 6.</p>
<h4>Câu 3</h4><p>Khối A: mỗi thông báo một ca, và mỗi <i>lý do</i> dùng chung một thông báo một ca riêng (giá dạng chữ / 0 / âm; ngày thập phân / âm). Khối B là bảng quyết định rút gọn: mất sách (2 luật, bỏ qua số ngày) + Student (3 khoảng) + Staff (2 khoảng) + luật chặn = 8 luật. Khối C test hai phía của mọi biên: 0|1 và 7|8 ngày cho sinh viên, 14|15 cho cán bộ, và biên chặn (phạt = giá vs giá nhỏ hơn phạt 1 đồng).</p>`,
};

export default doiDau({
  slug: 'swt301-11-pe-1-grade-parking-library',
  ten: 'PE Practice 1 — GradeCalculator · calcParkingFee · Library Fine',
  khoa: KHOA,
  baiHoc: 'swt301-pe-how-it-works',
  de: [
    {
      dangBai: 'pe',
      tieuDe: 'SWT301 PE Practice 1 — GradeCalculator review, calcParkingFee MC/DC, Library Late-Return Fine',
      doKho: 'HARD',
      phut: 85,
      diem: 100,
      ngonNgu: 'javascript',
      khaiNiem: ['code review', 'statement coverage', 'decision coverage', 'MC/DC', 'UTCID template', 'equivalence partitioning', 'boundary value analysis', 'decision table'],
      tienQuyet: ['SWT301 Chapter 3 (reviews)', 'Chapter 4 (black-box)', 'Chapter 5 (white-box)'],
      the: ['swt301', 'pe', 'su26', 'exam-practice'],
      banIn: BAN_IN,
      thuatNgu: tn('expected', 'spec', 'statement', 'decision', 'mcdc', 'utcid', 'nab', 'ep', 'bva', 'decisionTable', 'offByOne', 'shortCircuit', 'precondition'),
      goiY: [
        'Q1: đọc từng dòng với ba câu hỏi — dữ liệu vào đã được kiểm chưa? vòng lặp/biên có lệch không? công thức có khớp đặc tả không? Đừng quên dòng không biên dịch được và dữ liệu demo trong main.',
        'Q2: đếm theo MC/DC: điều kiện ghép n điều kiện cần n+1 ca. Dòng 2 (||) cần 2 ca không hợp lệ + 1 ca nền; dòng 4 (&&) cần 3 ca hợp lệ. Xếp các quyết định đơn (dòng 7, 8) vào chính 3 ca hợp lệ đó.',
        'Q2: expected theo ĐẶC TẢ "per started hour" (làm tròn LÊN). Chọn một số phút không chia hết cho 60 để lộ lỗi dòng 6 — ca đó status "F".',
        'Q3: viết khối A theo đúng thứ tự bước kiểm (một trường sai, còn lại hợp lệ), khối B một ca cho mỗi luật R1–R8, khối C hai phía của mỗi biên (0|1, 7|8, 14|15, phạt = giá / giá = phạt − 1).',
      ],
      loiHayGap: [
        'Lấy kết quả mong đợi từ mã (vd 90 phút → 10000) — ca "đạt" và bỏ lọt lỗi; đề thật trừ điểm nặng chỗ này.',
        'Q2 viết 4 ca (đủ statement + decision) — thiếu ca (T,F) cho <code>hasPass &amp;&amp; !isWeekend</code> hoặc ca 1441 cho <code>minutes &gt; 1440</code> ⇒ không đạt MC/DC.',
        'Q1 báo dòng 10 là lỗi biên dịch (trộn &amp;&amp; và || vẫn biên dịch) hoặc dòng 7 là chia nguyên (sum là double).',
        'Q3 gộp nhiều trường sai trong một ca kiểm hợp lệ, hoặc chỉ test "giá ≤ 0" bằng một ca trong khi 0, số âm và chữ là ba lý do khác nhau.',
        'Q3 quên luật chặn (tiền phạt không vượt giá sách) — luật R8 và hai ca biên của nó.',
      ],
      moTaNgan: 'PE luyện định dạng SU26: review GradeCalculator (≥8 lỗi + sửa mã chạy thật), bộ test tối thiểu MC/DC cho calcParkingFee đo độ phủ thật, test hộp đen Library Late-Return Fine chạy qua hệ thống tham chiếu.',
      giaiThich: GIAI_THICH,
      loaiKiem: 'js',
      tests: {
        loai: 'js',
        phienBan: 1,
        tepNap: ['answers/q1-issues.js', 'answers/q1-fixed.js', 'answers/q2-utcid.js', 'answers/q3-testcases.js'],
        kiem: KIEM,
      },
      khoiDau: { 'answers/q1-issues.js': DAU_Q1, 'answers/q1-fixed.js': Q1_FIX_DAU, 'answers/q2-utcid.js': DAU_Q2, 'answers/q3-testcases.js': DAU_Q3 },
      loiGiai: { 'answers/q1-issues.js': GIAI_Q1, 'answers/q1-fixed.js': Q1_FIX_GIAI, 'answers/q2-utcid.js': GIAI_Q2, 'answers/q3-testcases.js': GIAI_Q3 },
      thamKhao: 'https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/',
      boYeu: [
        { ten: 'Q2: 4 ca — đủ statement + decision, thiếu MC/DC', tep: { 'answers/q2-utcid.js': GIAI_Q2.replace(/\n  \{ id: 'UTCID02'[^\n]*/, '') }, phaiTruot: ['MC/DC for the compound decision on line 2', 'Minimal set'] },
        { ten: 'Q2: expected chép từ mã', tep: { 'answers/q2-utcid.js': GIAI_Q2.replace("expected: 'Fee: 20000 VND', type: 'N', status: 'F'", "expected: 'Fee: 10000 VND', type: 'N', status: 'P'") }, phaiTruot: ['Every "expected" value comes from the SPECIFICATION'] },
        { ten: 'Q2: thừa một ca', tep: { 'answers/q2-utcid.js': GIAI_Q2.replace('];', "  { id: 'UTCID06', input: { minutes: 60, isWeekend: false, hasPass: false }, expected: 'Fee: 10000 VND', type: 'N', status: 'P' },\n];") }, phaiTruot: ['Minimal set'] },
        { ten: 'Q1: báo dòng 10 là lỗi biên dịch', tep: { 'answers/q1-issues.js': GIAI_Q1.replace("{ line: 10, type: 'LOGIC'", "{ line: 10, type: 'COMPILE'") }, phaiTruot: ['No false claims'] },
        { ten: 'Q1.2: sửa thiếu (vẫn > 4)', tep: { 'answers/q1-fixed.js': Q1_FIX_GIAI.replace('pe >= MIN_EXAM_SCORE', 'pe > MIN_EXAM_SCORE') }, phaiTruot: ['"PASS 5.0"'] },
        { ten: 'Q3: chỉ có ca hợp lệ, thiếu biên', tep: { 'answers/q3-testcases.js': GIAI_Q3.replace(/\n  \{\n    id: 'C0[0-9]'[\s\S]*?\n  \},/g, '') }, phaiTruot: ['Boundary value — Student 7 days', 'Boundary value — computed fine = book price'] },
        { ten: 'Q3: số tiền sai một ca', tep: { 'answers/q3-testcases.js': GIAI_Q3.replace("expected: 'Fine Amount: 50,000 VND.'", "expected: 'Fine Amount: 34,000 VND.'") }, phaiTruot: ['Every expected result matches the specification'] },
      ],
    },
  ],
});

// Kiểm nội bộ khi chạy trực tiếp: mã sạch của Q2 phải trùng số dòng với bản Java.
if (process.argv[1] && process.argv[1].endsWith('swt301-11-pe-1-grade-parking-library.mjs')) {
  console.log(sach(Q2_DO).split('\n').length, Q2_JAVA.split('\n').length);
  void TESTKIT_JS;
}
