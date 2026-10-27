/**
 * SWT301 · DEEP LAB CHƯƠNG 6 — Tự động hoá error guessing: viết bộ sinh "giá trị tấn công" từ đặc tả trường (int / string /
 * date); chấm bằng các validator lỗi (lệch biên, nhận số thực, chuỗi số, NaN, null, khoảng trắng, Unicode, năm nhuận…).
 */
import { doiDau, KHOA, NOP_BAI, preMa } from './_chung.mjs';
import { kiemTuy } from './_de.mjs';

const DUNG = {
  int: '(s, v) => typeof v === "number" && Number.isInteger(v) && v >= s.min && v <= s.max',
  string: '(s, v) => typeof v === "string" && v.length >= s.minLen && v.length <= s.maxLen && /^[A-Za-z][A-Za-z0-9]*$/.test(v)',
  date: `(s, v) => {
    if (typeof v !== "string" || !/^\\d{4}-\\d{2}-\\d{2}$/.test(v)) return false;
    const [y, m, d] = v.split("-").map(Number);
    if (m < 1 || m > 12 || d < 1) return false;
    const leap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
    const dim = m === 2 ? (leap ? 29 : 28) : [4, 6, 9, 11].includes(m) ? 30 : 31;
    if (d > dim) return false;
    return v >= s.from && v <= s.to;
  }`,
};
const DOI_NGAY = 'const add = (iso, n) => { const t = new Date(Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10) + n)); return t.toISOString().slice(0, 10); };';

const SPEC = {
  iA: { type: 'int', min: 1, max: 60 }, iB: { type: 'int', min: 0, max: 3 }, iC: { type: 'int', min: -10, max: 10 },
  sA: { type: 'string', minLen: 5, maxLen: 30 }, sB: { type: 'string', minLen: 1, maxLen: 8 },
  dA: { type: 'date', from: '2026-11-02', to: '2026-11-16' }, dB: { type: 'date', from: '2028-02-20', to: '2028-03-05' },
};

/* Mỗi mutant: validator lỗi (s, v) => boolean, trên một đặc tả. */
const MUT = [
  { ma: 'I1', nhom: 'f1', spec: 'iA', ten: 'rejects the minimum', vi: 'từ chối giá trị nhỏ nhất', code: '(s, v) => typeof v === "number" && Number.isInteger(v) && v > s.min && v <= s.max' },
  { ma: 'I2', nhom: 'f1', spec: 'iA', ten: 'rejects the maximum', vi: 'từ chối giá trị lớn nhất', code: '(s, v) => typeof v === "number" && Number.isInteger(v) && v >= s.min && v < s.max' },
  { ma: 'I3', nhom: 'f1', spec: 'iA', ten: 'accepts min − 1', vi: 'nhận min − 1', code: '(s, v) => typeof v === "number" && Number.isInteger(v) && v >= s.min - 1 && v <= s.max' },
  { ma: 'I4', nhom: 'f1', spec: 'iA', ten: 'accepts max + 1', vi: 'nhận max + 1', code: '(s, v) => typeof v === "number" && Number.isInteger(v) && v >= s.min && v <= s.max + 1' },
  { ma: 'I5', nhom: 'f1', spec: 'iA', ten: 'accepts non-integers such as 2.5', vi: 'nhận số không nguyên như 2.5', code: '(s, v) => typeof v === "number" && v >= s.min && v <= s.max' },
  { ma: 'I6', nhom: 'f1', spec: 'iA', ten: 'accepts numeric strings such as "5"', vi: 'nhận chuỗi số như "5"', code: '(s, v) => Number.isInteger(Number(v)) && v !== "" && v !== null && Number(v) >= s.min && Number(v) <= s.max' },
  { ma: 'I7', nhom: 'f1', spec: 'iA', an: true, ten: 'NaN passes the range check', vi: 'NaN lọt kiểm khoảng', code: '(s, v) => typeof v === "number" && (Number.isInteger(v) || Number.isNaN(v)) && !(v < s.min) && !(v > s.max)' },
  { ma: 'I8', nhom: 'f1', spec: 'iB', an: true, ten: 'null is coerced to 0', vi: 'null bị ép thành 0', code: '(s, v) => (v === null || (typeof v === "number" && Number.isInteger(v))) && Number(v) >= s.min && Number(v) <= s.max' },
  { ma: 'I9', nhom: 'f1', spec: 'iC', an: true, ten: 'rejects the (negative) minimum', vi: 'từ chối giá trị nhỏ nhất (âm)', code: '(s, v) => typeof v === "number" && Number.isInteger(v) && v > s.min && v <= s.max' },
  { ma: 'S1', nhom: 'f2', spec: 'sA', ten: 'rejects exactly minLen characters', vi: 'từ chối đúng minLen ký tự', code: '(s, v) => typeof v === "string" && v.length > s.minLen && v.length <= s.maxLen && /^[A-Za-z][A-Za-z0-9]*$/.test(v)' },
  { ma: 'S2', nhom: 'f2', spec: 'sA', ten: 'rejects exactly maxLen characters', vi: 'từ chối đúng maxLen ký tự', code: '(s, v) => typeof v === "string" && v.length >= s.minLen && v.length < s.maxLen && /^[A-Za-z][A-Za-z0-9]*$/.test(v)' },
  { ma: 'S3', nhom: 'f2', spec: 'sA', ten: 'accepts minLen − 1 characters', vi: 'nhận minLen − 1 ký tự', code: '(s, v) => typeof v === "string" && v.length >= s.minLen - 1 && v.length <= s.maxLen && /^[A-Za-z][A-Za-z0-9]*$/.test(v)' },
  { ma: 'S4', nhom: 'f2', spec: 'sA', ten: 'accepts maxLen + 1 characters', vi: 'nhận maxLen + 1 ký tự', code: '(s, v) => typeof v === "string" && v.length >= s.minLen && v.length <= s.maxLen + 1 && /^[A-Za-z][A-Za-z0-9]*$/.test(v)' },
  { ma: 'S5', nhom: 'f2', spec: 'sA', ten: 'accepts a digit as the first character', vi: 'nhận chữ số ở ký tự đầu', code: '(s, v) => typeof v === "string" && v.length >= s.minLen && v.length <= s.maxLen && /^[A-Za-z0-9]+$/.test(v)' },
  { ma: 'S6', nhom: 'f2', spec: 'sA', ten: 'trims surrounding spaces before checking', vi: 'cắt khoảng trắng hai đầu rồi mới kiểm', code: '(s, v) => typeof v === "string" && v.trim().length >= s.minLen && v.trim().length <= s.maxLen && /^[A-Za-z][A-Za-z0-9]*$/.test(v.trim())' },
  { ma: 'S7', nhom: 'f2', spec: 'sA', an: true, ten: 'accepts special characters', vi: 'nhận ký tự đặc biệt', code: '(s, v) => typeof v === "string" && v.length >= s.minLen && v.length <= s.maxLen && /^[A-Za-z]\\S*$/.test(v)' },
  { ma: 'S8', nhom: 'f2', spec: 'sA', an: true, ten: 'accepts accented / Unicode letters', vi: 'nhận chữ có dấu / Unicode', code: '(s, v) => typeof v === "string" && v.length >= s.minLen && v.length <= s.maxLen && /^\\p{L}[\\p{L}\\d]*$/u.test(v)' },
  { ma: 'S9', nhom: 'f2', spec: 'sB', an: true, ten: 'rejects a 1-character value when minLen is 1', vi: 'từ chối giá trị 1 ký tự khi minLen là 1', code: '(s, v) => typeof v === "string" && v.length > s.minLen && v.length <= s.maxLen && /^[A-Za-z][A-Za-z0-9]*$/.test(v)' },
  { ma: 'D1', nhom: 'f3', spec: 'dA', ten: 'rejects the first day of the window', vi: 'từ chối ngày đầu cửa sổ', code: DUNG.date.replace('v >= s.from', 'v > s.from') },
  { ma: 'D2', nhom: 'f3', spec: 'dA', ten: 'rejects the last day of the window', vi: 'từ chối ngày cuối cửa sổ', code: DUNG.date.replace('v <= s.to', 'v < s.to') },
  { ma: 'D3', nhom: 'f3', spec: 'dA', ten: 'accepts the day before the window', vi: 'nhận ngày trước cửa sổ', code: DUNG.date.replace('return v >= s.from && v <= s.to;', `${DOI_NGAY} return v >= add(s.from, -1) && v <= s.to;`) },
  { ma: 'D4', nhom: 'f3', spec: 'dA', ten: 'accepts the day after the window', vi: 'nhận ngày sau cửa sổ', code: DUNG.date.replace('return v >= s.from && v <= s.to;', `${DOI_NGAY} return v >= s.from && v <= add(s.to, 1);`) },
  { ma: 'D5', nhom: 'f3', spec: 'dB', ten: 'every month has 31 days (window 2028-02-20 … 2028-03-05)', vi: 'tháng nào cũng 31 ngày (cửa sổ 2028-02-20 … 2028-03-05)', code: DUNG.date.replace('if (d > dim) return false;', 'if (d > 31) return false;') },
  { ma: 'D6', nhom: 'f3', spec: 'dB', ten: 'no leap years (window 2028-02-20 … 2028-03-05)', vi: 'không có năm nhuận (cửa sổ 2028-02-20 … 2028-03-05)', code: DUNG.date.replace('(leap ? 29 : 28)', '28') },
  { ma: 'D7', nhom: 'f3', spec: 'dA', an: true, ten: 'accepts dates without zero padding', vi: 'nhận ngày không đệm số 0', code: `(s, v) => { if (typeof v !== "string" || !/^\\d{4}-\\d{1,2}-\\d{1,2}$/.test(v)) return false; const [y, m, d] = v.split("-").map(Number); const t = new Date(Date.UTC(y, m - 1, d)); if (t.getUTCMonth() !== m - 1 || t.getUTCDate() !== d) return false; const iso = t.toISOString().slice(0, 10); return iso >= s.from && iso <= s.to; }` },
  { ma: 'D8', nhom: 'f3', spec: 'dA', an: true, ten: 'trims surrounding spaces', vi: 'cắt khoảng trắng hai đầu', code: DUNG.date.replace('(s, v) => {', '(s, v0) => { const v = typeof v0 === "string" ? v0.trim() : v0;') },
];

const kiemMut = (m) => kiemTuy(
  m.an ? { en: `Hidden faulty validator ${m.ma} is caught`, vi: `Validator lỗi ẩn ${m.ma} bị bắt` } : { en: `${m.ma} — catches a validator that ${m.ten} (spec ${JSON.stringify(SPEC[m.spec])})`, vi: `${m.ma} — bắt validator ${m.vi} (đặc tả ${JSON.stringify(SPEC[m.spec])})` },
  new Function(`const spec = ${JSON.stringify(SPEC[m.spec])};
    let vals; try { vals = attackValues(JSON.parse(JSON.stringify(spec))); } catch (e) { return 'attackValues threw: ' + e.message; }
    if (!Array.isArray(vals)) return 'attackValues must return an array';
    if (vals.length > 20) return 'at most 20 values per field — choose them, do not brute-force';
    const ok = ${DUNG[SPEC[m.spec].type]};
    const bad = ${m.code};
    const hit = vals.some((v) => { try { return ok(spec, v) !== bad(spec, v); } catch (e) { return true; } });
    return hit ? 'OK' : 'no value in your list tells this faulty validator apart from the correct one';`),
  { nhom: m.nhom, ...(m.an ? { an: true } : {}) },
);

const KIEM = [
  ...MUT.map(kiemMut),
  kiemTuy({ en: 'f4 — at most 20 distinct values for each visible spec', vi: 'f4 — tối đa 20 giá trị khác nhau cho mỗi đặc tả công khai' }, new Function(`const specs = ${JSON.stringify([SPEC.iA, SPEC.sA, SPEC.dA])};
    for (const s of specs) { let v; try { v = attackValues(s); } catch (e) { return 'threw on ' + s.type + ': ' + e.message; }
      if (!Array.isArray(v) || v.length === 0 || v.length > 20) return s.type + ': return 1–20 values';
      const k = v.map((x) => typeof x + ':' + String(x)); if (new Set(k).size !== k.length) return s.type + ': duplicate values'; }
    return 'OK';`), { nhom: 'f4' }),
  kiemTuy({ en: 'f4 — unknown field type returns [] without throwing', vi: 'f4 — kiểu trường lạ trả [] không ném lỗi' }, new Function("let v; try { v = attackValues({ type: 'email' }); } catch (e) { return 'threw: ' + e.message; } return Array.isArray(v) && v.length === 0 ? 'OK' : 'expected []';"), { nhom: 'f4' }),
  kiemTuy({ en: 'f4 — deterministic (same spec ⇒ same list) and does not modify the spec', vi: 'f4 — tất định (cùng đặc tả ⇒ cùng danh sách) và không sửa đặc tả' }, new Function(`const s = ${JSON.stringify(SPEC.dB)}; const k = JSON.stringify(s);
    const a = attackValues(s).map((x) => typeof x + ':' + String(x)).join('|'); const b = attackValues(s).map((x) => typeof x + ':' + String(x)).join('|');
    return a === b && JSON.stringify(s) === k ? 'OK' : 'two calls gave different lists, or the spec was modified';`), { nhom: 'f4', an: true }),
];

const GIAI = `// Deep Lab 6 — automated error guessing: attack values from a field specification.
function attackValues(spec) {
  if (!spec || typeof spec !== 'object') return [];
  if (spec.type === 'int') return intAttacks(spec);
  if (spec.type === 'string') return stringAttacks(spec);
  if (spec.type === 'date') return dateAttacks(spec);
  return [];
}

function uniq(list) {
  const seen = new Set();
  return list.filter((v) => {
    const k = typeof v + ':' + String(v);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

// Integers: both boundaries ±1 (BVA), a middle value, then the guesses —
// zero/negative, non-integer, NaN, Infinity, null/undefined, numeric string, empty string.
function intAttacks({ min, max }) {
  const mid = Math.floor((min + max) / 2);
  return uniq([min - 1, min, min + 1, mid, max - 1, max, max + 1, 0, -1, min + 0.5, NaN, Infinity, null, undefined, String(min), '']);
}

// Strings: lengths min−1, min, min+1, max, max+1 (all made of allowed characters),
// then one guessed mistake each: digit first, special character, spaces, accented letter, empty, null.
function stringAttacks({ minLen, maxLen }) {
  const word = (n) => (n <= 0 ? '' : 'A' + 'b1'.repeat(n).slice(0, n - 1));
  const base = word(Math.max(minLen, 2));
  return uniq([
    word(minLen - 1), word(minLen), word(minLen + 1), word(maxLen), word(maxLen + 1),
    '1' + base.slice(1), base.slice(0, -1) + '#', ' ' + base, base + ' ', 'Đ' + base.slice(1), '', null,
  ]);
}

// Dates: window boundaries ±1 day, the day after each month end inside the window,
// 29 February of every year in it, then format guesses (no padding, spaces, month 13, day 00, time suffix).
function dateAttacks({ from, to }) {
  const add = (iso, n) => new Date(Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10) + n)).toISOString().slice(0, 10);
  const pad = (n) => String(n).padStart(2, '0');
  const out = [add(from, -1), from, to, add(to, 1)];
  let y = +from.slice(0, 4), m = +from.slice(5, 7);
  const endY = +to.slice(0, 4), endM = +to.slice(5, 7);
  while (y < endY || (y === endY && m <= endM)) {
    const dim = new Date(Date.UTC(y, m, 0)).getUTCDate();
    out.push(y + '-' + pad(m) + '-' + pad(dim + 1));
    if (m === 2) out.push(y + '-02-29');
    m++; if (m > 12) { m = 1; y++; }
  }
  const [fy, fm, fd] = from.split('-').map(Number);
  out.push(fy + '-' + fm + '-' + fd, ' ' + from, from + ' ', fy + '-13-' + pad(fd), fy + '-' + pad(fm) + '-00', from + 'T00:00', '', null);
  return uniq(out);
}
`;

const BAN_IN = {
  tieuDe: 'Deep Lab 6 — Automate Error Guessing: an Attack-Value Generator',
  phu: { en: 'Chapter 6 deep lab · error guessing + BVA turned into code · graded by faulty validators · 10 marks', vi: 'Deep Lab chương 6 · error guessing + BVA thành code · chấm bằng validator lỗi · 10 điểm' },
  moTa: {
    en: `<p>Error guessing becomes much stronger when the fault attack list is generated, not typed. Tools such as property-based testing libraries and fuzzers do this. Write <code>attackValues(spec)</code> that returns <b>at most 20</b> distinct values for a field specification:</p>
${preMa(`{ type: 'int',    min, max }          // integer, both ends included
{ type: 'string', minLen, maxLen }    // a letter, then letters or digits; length within [minLen, maxLen]
{ type: 'date',   from, to }          // 'YYYY-MM-DD' (zero-padded), a real calendar day, from ≤ date ≤ to`)}
<p>The grader holds the <b>correct validator</b> of each type and <b>26 faulty validators</b>, each with one mistake developers really make (boundaries off by one, non-integers, numeric strings, NaN, null coerced to 0, trimming, special or accented characters, month ends, leap years, missing zero padding…). A faulty validator is <b>caught</b> when at least one of your values gets a different answer from it than from the correct validator (or makes it throw). Hidden checks use other ranges, so the list must be computed from the spec, not hard-coded.</p>`,
    vi: `<p>Error guessing mạnh hơn nhiều khi danh sách tấn công được SINH ra chứ không gõ tay — các thư viện property-based testing và fuzzer làm đúng việc đó. Viết <code>attackValues(spec)</code> trả <b>tối đa 20</b> giá trị khác nhau cho một đặc tả trường (int, string, date như khối trên). Máy chấm giữ <b>validator đúng</b> của từng kiểu và <b>26 validator lỗi</b>, mỗi cái một sai sót developer hay mắc. Validator lỗi bị <b>bắt</b> khi ít nhất một giá trị của bạn cho kết quả khác với validator đúng (hoặc làm nó ném lỗi). Kiểm ẩn dùng khoảng khác, nên danh sách phải TÍNH từ đặc tả, không viết cứng.</p>`,
  },
  chucNangChinh: [
    { en: 'f1 Integer fields.', vi: 'f1 Trường số nguyên.' },
    { en: 'f2 String fields.', vi: 'f2 Trường chuỗi.' },
    { en: 'f3 Date fields.', vi: 'f3 Trường ngày.' },
    { en: 'f4 List rules: ≤ 20 distinct values, unknown type → [], deterministic.', vi: 'f4 Luật danh sách: ≤ 20 giá trị khác nhau, kiểu lạ → [], tất định.' },
  ],
  yeuCauChung: [{ en: 'Values may be of any JavaScript type (numbers, strings, null, undefined, NaN). Two values are the same when typeof and String() are equal.', vi: 'Giá trị có thể thuộc mọi kiểu JavaScript (số, chuỗi, null, undefined, NaN). Hai giá trị trùng khi typeof và String() bằng nhau.' }],
  cayThuMuc: `src/
└── attack-values.js   ← function attackValues(spec)`,
  moHinh: {
    ten: 'Field specifications',
    truong: [
      ['int', '{ type, min, max }', { en: 'valid: typeof number, integer, min ≤ v ≤ max', vi: 'hợp lệ: kiểu number, số nguyên, min ≤ v ≤ max' }],
      ['string', '{ type, minLen, maxLen }', { en: 'valid: /^[A-Za-z][A-Za-z0-9]*$/ and length in range', vi: 'hợp lệ: /^[A-Za-z][A-Za-z0-9]*$/ và độ dài trong khoảng' }],
      ['date', '{ type, from, to }', { en: 'valid: YYYY-MM-DD, a real Gregorian day, inside the window', vi: 'hợp lệ: YYYY-MM-DD, ngày Gregory có thật, trong cửa sổ' }],
    ],
  },
  chucNang: [
    { ten: { en: 'f1 Integers', vi: 'f1 Số nguyên' }, diem: 3, yeuCau: [{ en: 'Catch 9 faulty validators (6 listed).', vi: 'Bắt 9 validator lỗi (6 công khai).' }], hook: ['BVA', 'error guessing'] },
    { ten: { en: 'f2 Strings', vi: 'f2 Chuỗi' }, diem: 3, yeuCau: [{ en: 'Catch 9 faulty validators (6 listed).', vi: 'Bắt 9 validator lỗi (6 công khai).' }], hook: ['error guessing'] },
    { ten: { en: 'f3 Dates', vi: 'f3 Ngày' }, diem: 3, yeuCau: [{ en: 'Catch 8 faulty validators (6 listed).', vi: 'Bắt 8 validator lỗi (6 công khai).' }], hook: ['error guessing'] },
    { ten: { en: 'f4 List rules', vi: 'f4 Luật danh sách' }, diem: 1, yeuCau: [{ en: 'Size, uniqueness, unknown type, determinism.', vi: 'Kích thước, không trùng, kiểu lạ, tất định.' }], hook: ['test design'] },
  ],
  idBatBuoc: [['attackValues(spec)', 'src/attack-values.js']],
  truDiem: [
    { en: 'Hard-coding the values of the visible specs — hidden specs use other ranges.', vi: 'Viết cứng giá trị cho đặc tả công khai — đặc tả ẩn dùng khoảng khác.' },
    { en: 'Random values: a fuzzer without boundary knowledge rarely hits min − 1 exactly.', vi: 'Giá trị ngẫu nhiên: fuzzer không biết biên hiếm khi trúng đúng min − 1.' },
  ],
  nopBai: NOP_BAI,
};

export default doiDau({
  slug: 'swt301-6-deep-attack-generator',
  ten: 'Deep Lab 6 — Automate Error Guessing: an Attack-Value Generator',
  moTaModule: 'Deep Lab chương 6: viết attackValues(spec) sinh tối đa 20 giá trị tấn công cho trường int/string/date (BVA + đoán lỗi), chấm bằng 26 validator lỗi thật (lệch biên, số thực, chuỗi số, NaN, null, trim, Unicode, cuối tháng, năm nhuận, thiếu đệm 0); kiểm ẩn đổi khoảng.',
  khoa: KHOA,
  baiHoc: 'swt301-experience-based',
  de: [{
    dangBai: 'deep-lab',
    tieuDe: 'Deep Lab 6 — Automate Error Guessing: an Attack-Value Generator',
    doKho: 'HARD', phut: 120, diem: 100, ngonNgu: 'javascript',
    viDu: [{ input: "attackValues({ type: 'int', min: 1, max: 60 })", output: "[0, 1, 2, 30, 59, 60, 61, -1, 1.5, NaN, Infinity, null, undefined, '1', '']", explanation: 'BVA values plus guessed mistakes, computed from min and max.|||Giá trị BVA cộng các đoán lỗi, tính từ min và max.' }],
    khaiNiem: ['error guessing', 'boundary value analysis', 'fuzzing', 'test automation'],
    tienQuyet: ['SWT301 lessons 4.3 and 6.1'],
    the: ['swt301', 'deep-lab', 'error-guessing'],
    banIn: BAN_IN,
    thuatNgu: [{ en: 'fuzzing', vi: 'kiểm thử mờ — bơm đầu vào bất thường' }, { en: 'property-based testing', vi: 'kiểm thử dựa thuộc tính — thư viện tự sinh đầu vào' }, { en: 'validator', vi: 'hàm kiểm hợp lệ' }, { en: 'zero padding', vi: 'đệm số 0' }],
    goiY: [
      'Bắt đầu bằng BVA: min−1, min, min+1, max−1, max, max+1 (với chuỗi là độ dài).',
      'Thêm đoán lỗi theo kiểu: số không nguyên, NaN, chuỗi số, null; chuỗi bắt đầu bằng số, ký tự đặc biệt, khoảng trắng, chữ có dấu; ngày sau cuối tháng, 29/2, không đệm 0.',
      'Với ngày, dùng Date.UTC để cộng/trừ ngày và tìm số ngày của tháng (new Date(Date.UTC(y, m, 0)).getUTCDate()).',
      'Khử trùng theo typeof + String(v) để không vượt 20 giá trị.',
    ],
    loiHayGap: ['Chuỗi biên được tạo bằng ký tự không hợp lệ (vd toàn chữ số) nên không phân biệt được lỗi độ dài.', 'Quên 29/2 khi cửa sổ có tháng Hai.', 'Sinh quá 20 giá trị vì vét cạn.'],
    moTaNgan: 'Deep Lab chương 6: bộ sinh giá trị tấn công.',
    giaiThich: {
      en: '<p>The reference solution combines BVA (both edges ±1, computed from the spec) with a fixed catalogue of typical mistakes for each type. Each catalogue entry exists because one faulty validator needs it: NaN for range checks written with negations, numeric strings for loose coercion, a leading space for trimming, an accented letter for Unicode-aware regexes, “day after month end” and 29 February for date arithmetic.</p>',
      vi: '<p>Lời giải tham chiếu kết hợp BVA (hai biên ±1, tính từ đặc tả) với danh mục cố định các sai sót điển hình của từng kiểu. Mỗi mục có mặt vì một validator lỗi cần nó: NaN cho kiểm khoảng viết bằng phủ định, chuỗi số cho ép kiểu lỏng, khoảng trắng đầu cho trim, chữ có dấu cho regex Unicode, “ngày sau cuối tháng” và 29/2 cho tính ngày.</p>',
    },
    loaiKiem: 'js',
    tests: { loai: 'js', phienBan: 1, tepNap: ['src/attack-values.js'], kiem: KIEM },
    khoiDau: { 'src/attack-values.js': "// Return at most 20 distinct attack values for the field specification.\nfunction attackValues(spec) {\n  if (spec.type === 'int') return [spec.min, spec.max];\n  return [];\n}\n" },
    loiGiai: { 'src/attack-values.js': GIAI },
    boYeu: [
      { ten: 'chỉ BVA, không đoán lỗi', tep: { 'src/attack-values.js': GIAI.replace("0, -1, min + 0.5, NaN, Infinity, null, undefined, String(min), ''", '0, -1') }, phaiTruot: ['I5', 'I6'] },
      { ten: 'quên 29/2', tep: { 'src/attack-values.js': GIAI.replace("    if (m === 2) out.push(y + '-02-29');\n", '') }, phaiTruot: ['D6'] },
    ],
  }],
});
