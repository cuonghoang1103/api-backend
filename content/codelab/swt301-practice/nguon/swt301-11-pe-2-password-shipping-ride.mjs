/**
 * SWT301 · PE PRACTICE 2 (định dạng SU26). Đề MỚI theo dạng PE23/PE24:
 *   Q1 review PasswordPolicy.isStrong (chuỗi, vòng lặp, so sánh chuỗi, ưu tiên toán tử) + sửa bản JS chạy thật;
 *   Q2 calcShippingFee — điều kiện ghép 3 vế OR (MC/DC cần 3 ca không hợp lệ) + AND 2 vế ⇒ tối thiểu 6 ca;
 *   Q3 Ride Fare Estimate — hợp lệ (có trường TUỲ CHỌN), bảng quyết định 3 điều kiện + luật trần khuyến mãi, BVA số thập phân.
 */
import { svg, bangHtml } from './_chung.mjs';
import { deThiPE, tien } from './_pe.mjs';

/* ═══════════════════════ Q1 ═══════════════════════ */
const Q1_JAVA = `public class PasswordPolicy {
    public static boolean isStrong(String password, String username) {
        if (password.length() < 8 || password.length() > 64) {
            return false;
        }
        boolean hasUpper = false, hasLower = false, hasDigit = false;
        for (int i = 0; i <= password.length(); i++) {
            char c = password.charAt(i);
            if (Character.isUpperCase(c)) hasUpper = true;
            if (Character.isLowerCase(c)) hasLower = true;
            if (Character.isLetter(c)) hasDigit = true;
        }
        if (password.contains(username)) {
            return false;
        }
        return hasUpper || hasLower && hasDigit;
    }

    public static void main(String[] args) {
        String p = "Abcdef12";
        if (isStrong(p, "abc") == "true") {
            System.out.println("OK");
        }
    }
}`;
const Q1_KHOA = [
  { ma: 'K1', dong: [2, 3], loai: ['VALIDATION', 'EXCEPTION'], ten: 'null password is not handled (NullPointerException on line 3)' },
  { ma: 'K2', dong: [2, 13], loai: ['VALIDATION', 'EXCEPTION', 'LOGIC'], ten: 'null or empty username is not handled (contains(null) throws; contains("") is always true)' },
  { ma: 'K3', dong: [7, 8], loai: ['BOUNDARY', 'EXCEPTION', 'LOGIC'], ten: 'i <= password.length() reads one char too far (StringIndexOutOfBoundsException)', tenVi: 'i <= password.length() đọc quá một ký tự (StringIndexOutOfBoundsException)', nang: true },
  { ma: 'K4', dong: [11], loai: ['LOGIC'], ten: 'isLetter instead of isDigit — digits are never detected, letters count as digits', tenVi: 'isLetter thay vì isDigit — chữ số không bao giờ được nhận, chữ cái lại tính là số', nang: true },
  { ma: 'K5', dong: [13], loai: ['LOGIC', 'VALIDATION', 'SECURITY'], ten: 'username check is case-sensitive; the spec says case-insensitive', tenVi: 'so tên đăng nhập phân biệt hoa/thường; đặc tả yêu cầu không phân biệt', nang: true },
  { ma: 'K6', dong: [16], loai: ['LOGIC'], ten: 'hasUpper || hasLower && hasDigit — all three are required (&&)', tenVi: 'hasUpper || hasLower && hasDigit — phải đủ cả ba (&&)', nang: true },
  { ma: 'K7', dong: [21], loai: ['COMPILE'], ten: 'boolean == "true" compares a boolean with a String — compile error', tenVi: 'boolean == "true" so boolean với String — lỗi biên dịch', nang: true },
  { ma: 'K8', dong: [20, 21, 22], loai: ['TEST_DATA'], ten: 'the demo checks nothing against an expected result ("Abcdef12" contains "abc" ignoring case → expected false)' },
  { ma: 'K9', dong: [3], loai: ['CONVENTION'], ten: 'magic numbers 8 and 64 instead of MIN_LENGTH / MAX_LENGTH' },
  { ma: 'K10', dong: [2], loai: ['SECURITY'], ten: 'password kept in an immutable String (stays in memory) — char[] is the recommended type' },
  { ma: 'K11', dong: [9, 10, 11], loai: ['PERFORMANCE', 'CONVENTION'], ten: 'the loop keeps scanning after all three flags are set; three independent ifs instead of else-if' },
];
const Q1_SAI = [
  { dong: [3], loai: ['BOUNDARY'], ten: 'line 3 is correct: lengths 8 and 64 are valid and are accepted' },
  { dong: [16], loai: ['COMPILE'], ten: 'line 16 compiles — the defect is the operator, not the syntax' },
];
const FIX_DAU = `// Question 1 (deeper) — JavaScript twin of PasswordPolicy.isStrong WITH the same defects.
// (Java line 21 does not compile; the demo is not part of the twin.)
// Fix it so it follows the specification. The grader calls isStrong(password, username).
class IllegalArgumentException extends Error {
  constructor(message) { super(message); this.name = 'IllegalArgumentException'; }
}
const isUpperCase = (c) => c >= 'A' && c <= 'Z';
const isLowerCase = (c) => c >= 'a' && c <= 'z';
const isDigit = (c) => c >= '0' && c <= '9';
const isLetter = (c) => isUpperCase(c) || isLowerCase(c);

function isStrong(password, username) {
  if (password.length < 8 || password.length > 64) {
    return false;
  }
  let hasUpper = false, hasLower = false, hasDigit = false;
  for (let i = 0; i <= password.length; i++) {
    const c = password.charAt(i);
    if (isUpperCase(c)) hasUpper = true;
    if (isLowerCase(c)) hasLower = true;
    if (isLetter(c)) hasDigit = true;
  }
  if (password.includes(username)) {
    return false;
  }
  return hasUpper || hasLower && hasDigit;
}
`;
const FIX_GIAI = `// Question 1 (deeper) — corrected isStrong.
//  · null password, null/empty username → IllegalArgumentException
//  · length 8..64 inclusive · at least one upper, one lower, one digit (ALL three)
//  · must not contain the username, ignoring case
class IllegalArgumentException extends Error {
  constructor(message) { super(message); this.name = 'IllegalArgumentException'; }
}
const MIN_LENGTH = 8;
const MAX_LENGTH = 64;
const isUpperCase = (c) => c >= 'A' && c <= 'Z';
const isLowerCase = (c) => c >= 'a' && c <= 'z';
const isDigit = (c) => c >= '0' && c <= '9';

function isStrong(password, username) {
  if (password == null) throw new IllegalArgumentException('password must not be null');
  if (username == null || username === '') throw new IllegalArgumentException('username must not be null or empty');
  if (password.length < MIN_LENGTH || password.length > MAX_LENGTH) return false;
  let hasUpper = false, hasLower = false, hasDigit = false;
  for (let i = 0; i < password.length; i++) {              // < , not <=
    const c = password.charAt(i);
    if (isUpperCase(c)) hasUpper = true;
    else if (isLowerCase(c)) hasLower = true;
    else if (isDigit(c)) hasDigit = true;                    // isDigit, not isLetter
  }
  if (password.toLowerCase().includes(username.toLowerCase())) return false;   // case-insensitive
  return hasUpper && hasLower && hasDigit;                   // all three
}
`;
const GIAI_ISSUES = `// Question 1 — sheet Q1. Eleven issues; any 8 correct ones earn the list marks.
const ISSUES = [
  { line: 3, type: 'EXCEPTION', severity: 'Medium', description: 'A null password throws NullPointerException at password.length(); the spec requires IllegalArgumentException.', fix: 'if (password == null) throw new IllegalArgumentException(...);' },
  { line: 13, type: 'VALIDATION', severity: 'Medium', description: 'username is never validated: contains(null) throws, and contains("") is always true so every password is rejected.', fix: 'Reject a null or empty username with IllegalArgumentException before the checks.' },
  { line: 7, type: 'BOUNDARY', severity: 'High', description: 'Off-by-one: i <= password.length() makes charAt(length) throw StringIndexOutOfBoundsException on every call that reaches the loop.', fix: 'for (int i = 0; i < password.length(); i++)' },
  { line: 11, type: 'LOGIC', severity: 'High', description: 'Character.isLetter sets hasDigit: digits are never detected and any letter counts as a digit.', fix: 'if (Character.isDigit(c)) hasDigit = true;' },
  { line: 13, type: 'LOGIC', severity: 'High', description: 'contains() is case-sensitive; the spec forbids the username ignoring case ("JOHN" inside "xxJOHN123" for user "john").', fix: 'password.toLowerCase().contains(username.toLowerCase())' },
  { line: 16, type: 'LOGIC', severity: 'High', description: '&& binds tighter than ||: a password with only an uppercase letter is "strong".', fix: 'return hasUpper && hasLower && hasDigit;' },
  { line: 21, type: 'COMPILE', severity: 'High', description: 'isStrong(...) == "true" compares a boolean with a String: incomparable types, the class does not compile.', fix: 'if (isStrong(p, "abc")) or assertFalse(isStrong(p, "abc")) in a test.' },
  { line: 20, type: 'TEST_DATA', severity: 'Low', description: 'The demo prints instead of checking an expected value; "Abcdef12" contains "abc" ignoring case, so the expected result is false.', fix: 'Move the case into a unit test: assertFalse(PasswordPolicy.isStrong("Abcdef12", "abc")).' },
  { line: 3, type: 'CONVENTION', severity: 'Low', description: 'Magic numbers 8 and 64.', fix: 'private static final int MIN_LENGTH = 8, MAX_LENGTH = 64;' },
  { line: 2, type: 'SECURITY', severity: 'Low', description: 'The password is passed as an immutable String that stays in memory until garbage collection.', fix: 'Accept char[] and clear it after use (Arrays.fill(pwd, \\'\\\\0\\')).' },
  { line: 9, type: 'PERFORMANCE', severity: 'Low', description: 'Three independent ifs and no early exit: the loop keeps scanning after all flags are true.', fix: 'Use else-if and break once hasUpper && hasLower && hasDigit.' },
];
`;
const kf = (goi, mongDoi, en, vi) => ({ moTa: { en, vi }, goi, mongDoi });
const KIEM_FIX = [
  kf("isStrong('Abcdefg1', 'john')", true, 'isStrong("Abcdefg1", "john") → true (8 characters, upper + lower + digit)', 'isStrong("Abcdefg1", "john") → true (8 ký tự, đủ hoa + thường + số)'),
  kf("isStrong('ABCDEFG1', 'john')", false, 'no lowercase letter → false', 'không có chữ thường → false'),
  kf("isStrong('Abcdef1', 'john')", false, '7 characters → false', '7 ký tự → false'),
  kf("isStrong('A' + 'b'.repeat(62) + '1', 'john')", true, '64 characters → true', '64 ký tự → true'),
  kf("isStrong('A' + 'b'.repeat(63) + '1', 'john')", false, '65 characters → false', '65 ký tự → false'),
  kf("isStrong('Abcdefgh', 'john')", false, 'no digit → false', 'không có chữ số → false'),
  kf("isStrong('abcdefg1', 'john')", false, 'no uppercase → false', 'không có chữ hoa → false'),
  kf("isStrong('xxJOHN123a', 'john')", false, 'contains the username ignoring case → false', 'chứa tên đăng nhập (không phân biệt hoa/thường) → false'),
  kf('isStrong(null, "john")', { loi: 'IllegalArgumentException' }, 'null password → IllegalArgumentException', 'password null → IllegalArgumentException'),
  kf('isStrong("Abcdefg1", "")', { loi: 'IllegalArgumentException' }, 'empty username → IllegalArgumentException', 'username rỗng → IllegalArgumentException'),
  kf('isStrong("Abcdefg1", null)', { loi: 'IllegalArgumentException' }, 'null username → IllegalArgumentException', 'username null → IllegalArgumentException'),
];

/* ═══════════════════════ Q2 ═══════════════════════ */
const Q2_JAVA = `public static int calcShippingFee(int weightGram, String zone, boolean isMember) {
    if (weightGram <= 0 || weightGram > 30000 || zone == null)
        return -1;
    int fee = zone.equals("INNER") ? 20000 : 35000;
    if (weightGram > 2000)
        fee += (weightGram - 2000) / 500 * 5000;
    if (isMember && fee > 50000)
        fee = fee * 90 / 100;
    return fee;
}`;
const Q2_DO = `function calcShippingFee(weightGram, zone, isMember) {
  $s('S1'); if ($d('D1', $c('D1.A', weightGram <= 0) || $c('D1.B', weightGram > 30000) || $c('D1.C', zone == null)))
    { $s('S2'); return -1; }
  $s('S3'); let fee = $d('D2', zone === 'INNER') ? 20000 : 35000;
  $s('S4'); if ($d('D3', weightGram > 2000))
    { $s('S5'); fee += Math.trunc((weightGram - 2000) / 500) * 5000; }
  $s('S6'); if ($d('D4', $c('D4.A', isMember) && $c('D4.B', fee > 50000)))
    { $s('S7'); fee = Math.trunc(fee * 90 / 100); }
  $s('S8'); return fee;
}`;
function q2Spec(weightGram, zone, isMember) {
  if (weightGram <= 0 || weightGram > 30000 || zone == null) return -1;
  let fee = zone === 'INNER' ? 20000 : 35000;
  if (weightGram > 2000) fee += Math.ceil((weightGram - 2000) / 500) * 5000;
  if (isMember && fee > 50000) fee = (fee * 90) / 100;
  return fee;
}
function q2Loai(i) {
  const w = i.weightGram;
  if (w <= 0 || w > 30000 || i.zone == null) return w === 0 || w === 30001 ? ['A', 'B'] : ['A'];
  if ([1, 2000, 2001, 30000].indexOf(w) >= 0) return ['B'];
  let fee = i.zone === 'INNER' ? 20000 : 35000;
  if (w > 2000) fee += Math.ceil((w - 2000) / 500) * 5000;
  return fee === 50000 || fee === 55000 ? ['N', 'B'] : ['N'];
}
const Q2_CFG = svg({
  w: 560, h: 470, tieuDe: 'CFG of calcShippingFee (L = line number)',
  nut: [
    { id: 'st', x: 280, y: 40, hinh: 'dau', nhan: '' },
    { id: 'd2', x: 280, y: 90, hinh: 'thoi', nhan: 'L2', rong: 90 },
    { id: 'r3', x: 450, y: 90, hinh: 'chu', nhan: 'L3 return -1' },
    { id: 'd4', x: 280, y: 165, hinh: 'thoi', nhan: 'L4', rong: 90 },
    { id: 'a', x: 140, y: 215, hinh: 'chu', nhan: 'fee = 20000' },
    { id: 'b', x: 420, y: 215, hinh: 'chu', nhan: 'fee = 35000' },
    { id: 'd5', x: 280, y: 270, hinh: 'thoi', nhan: 'L5', rong: 90 },
    { id: 's6', x: 450, y: 310, hinh: 'chu', nhan: 'L6 fee += …' },
    { id: 'd7', x: 280, y: 345, hinh: 'thoi', nhan: 'L7', rong: 90 },
    { id: 's8', x: 450, y: 390, hinh: 'chu', nhan: 'L8 fee × 0.9' },
    { id: 'r9', x: 280, y: 430, hinh: 'chu', nhan: 'L9 return fee' },
  ],
  canh: [
    { tu: 'st', den: 'd2' },
    { tu: 'd2', den: 'r3', nhan: 'T' }, { tu: 'd2', den: 'd4', nhan: 'F' },
    { tu: 'd4', den: 'a', nhan: 'T (INNER)' }, { tu: 'd4', den: 'b', nhan: 'F' },
    { tu: 'a', den: 'd5' }, { tu: 'b', den: 'd5' },
    { tu: 'd5', den: 's6', nhan: 'T' }, { tu: 'd5', den: 'd7', nhan: 'F' },
    { tu: 's6', den: 'd7' },
    { tu: 'd7', den: 's8', nhan: 'T' }, { tu: 'd7', den: 'r9', nhan: 'F' },
    { tu: 's8', den: 'r9' },
  ],
});
const GIAI_UTCID = `// Question 2 — the minimum is 6 test cases.
//  · MC/DC of line 2 (A || B || C): A alone true (0 g), B alone true (30001 g), C alone true (zone null) + a valid baseline → 3 invalid tests.
//  · MC/DC of line 7 (isMember && fee > 50000): (T,T), (F,T), (T,F) → 3 valid tests.
//  · The 3 valid tests also flip line 4 (INNER / other) and line 5 (> 2000 g / ≤ 2000 g).
// UTCID05: the SPEC adds 5,000 per STARTED 500 g → 8100 g = 13 steps = 85000; the code floors to 12 steps = 80000 → F (defect on line 6).
const UTCIDS = [
  { id: 'UTCID01', input: { weightGram: 0, zone: 'INNER', isMember: false }, expected: -1, type: 'A', status: 'P' },
  { id: 'UTCID02', input: { weightGram: 30001, zone: 'INNER', isMember: false }, expected: -1, type: 'A', status: 'P' },
  { id: 'UTCID03', input: { weightGram: 1500, zone: null, isMember: false }, expected: -1, type: 'A', status: 'P' },
  { id: 'UTCID04', input: { weightGram: 5000, zone: 'OUTER', isMember: true }, expected: 58500, type: 'N', status: 'P' },
  { id: 'UTCID05', input: { weightGram: 8100, zone: 'INNER', isMember: false }, expected: 85000, type: 'N', status: 'F' },
  { id: 'UTCID06', input: { weightGram: 1000, zone: 'INNER', isMember: true }, expected: 20000, type: 'N', status: 'P' },
];
`;

/* ═══════════════════════ Q3 — Ride Fare Estimate ═══════════════════════ */
function q3HeThong(d) {
  const s = (k) => String(d[k] == null ? '' : d[k]).trim();
  const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const code = s('bookingCode');
  if (code === '') return 'Booking Code is required.';
  if (['RB001', 'RB002', 'RB003'].indexOf(code) < 0) return 'Invalid Booking Code.';
  const dist = s('distance');
  if (dist === '') return 'Distance is required.';
  if (!/^\d+(\.\d)?$/.test(dist) || Number(dist) <= 0 || Number(dist) > 100) return 'Distance must be a number greater than 0 and at most 100.';
  const car = s('carType');
  if (car === '') return 'Car Type is required.';
  const h = s('pickupHour');
  if (h === '') return 'Pickup Hour is required.';
  if (!/^\d+$/.test(h) || Number(h) > 23) return 'Pickup Hour must be an integer from 0 to 23.';
  const promo = s('promoCode');
  if (promo !== '' && promo !== 'SAVE10') return 'Invalid Promo Code.';
  const t = Math.round(Number(dist) * 10);
  let fare = 20000;
  if (t > 20) fare += 12000 * Math.ceil((Math.min(t, 250) - 20) / 10);
  if (t > 250) fare += 9000 * Math.ceil((t - 250) / 10);
  if (car === '7-seat') fare = (fare * 13) / 10;
  const hour = Number(h);
  if (hour >= 22 || hour <= 5) fare = (fare * 12) / 10;
  if (promo === 'SAVE10') fare -= Math.min(fare / 10, 20000);
  return 'Estimated Fare: ' + fmt(fare) + ' VND.';
}
function q3Nhan(d, out) {
  const s = (k) => String(d[k] == null ? '' : d[k]).trim();
  const t = [];
  const msg = {
    'Booking Code is required.': 'V_CODE_EMPTY', 'Invalid Booking Code.': 'V_CODE_INVALID', 'Distance is required.': 'V_DIST_EMPTY',
    'Car Type is required.': 'V_CAR', 'Pickup Hour is required.': 'V_HOUR_EMPTY', 'Invalid Promo Code.': 'V_PROMO',
  };
  if (msg[out]) t.push(msg[out]);
  if (out === 'Distance must be a number greater than 0 and at most 100.') {
    const x = s('distance');
    if (!/^-?\d+(\.\d+)?$/.test(x)) t.push('V_DIST_TEXT');
    else if (Number(x) === 0) t.push('V_DIST_ZERO');
    else if (Number(x) < 0) t.push('V_DIST_NEG');
    else if (Number(x) > 100) { t.push('V_DIST_OVER'); if (Number(x) === 100.1) t.push('B_D1001'); }
    else t.push('V_DIST_PRECISION');
  }
  if (out === 'Pickup Hour must be an integer from 0 to 23.') {
    const x = s('pickupHour');
    if (/^-\d+$/.test(x)) t.push('V_HOUR_NEG');
    else if (/^\d+$/.test(x)) { t.push('V_HOUR_OVER'); if (x === '24') t.push('B_H24'); }
    else t.push('V_HOUR_TEXT');
  }
  if (out.indexOf('Estimated Fare') === 0) {
    const dist = Number(s('distance')), car = s('carType'), hour = Number(s('pickupHour')), promo = s('promoCode') === 'SAVE10';
    const night = hour >= 22 || hour <= 5;
    t.push('R' + (1 + (car === '7-seat' ? 4 : 0) + (night ? 2 : 0) + (promo ? 1 : 0)));
    const x = Math.round(dist * 10);
    let fare = 20000;
    if (x > 20) fare += 12000 * Math.ceil((Math.min(x, 250) - 20) / 10);
    if (x > 250) fare += 9000 * Math.ceil((x - 250) / 10);
    if (car === '7-seat') fare = (fare * 13) / 10;
    if (night) fare = (fare * 12) / 10;
    if (promo && fare / 10 > 20000) t.push('R9');
    if (promo && fare === 200000) t.push('B_CAP_EQ');
    if (promo && fare > 200000 && fare < 215000) t.push('B_CAP_OVER');
    const bien = { 1: 'B_D01', 20: 'B_D2', 21: 'B_D21', 250: 'B_D25', 251: 'B_D251', 1000: 'B_D100' };
    if (bien[x]) t.push(bien[x]);
    const bh = { 5: 'B_H5', 6: 'B_H6', 21: 'B_H21', 22: 'B_H22', 0: 'B_H0', 23: 'B_H23' };
    if (s('pickupHour') in bh) t.push(bh[s('pickupHour')]);
  }
  return t;
}
const MAU_Q3 = bangHtml(['Distance', 'Car', 'Pickup hour', 'Promo', 'Calculation', 'Result'], [
  ['1.5 km', '4-seat', '14', '—', 'opening fare', '20,000'],
  ['10 km', '4-seat', '14', '—', '20,000 + 8 × 12,000', '116,000'],
  ['10 km', '7-seat', '14', '—', '116,000 × 1.3', '150,800'],
  ['10 km', '4-seat', '23', '—', '116,000 × 1.2', '139,200'],
  ['30 km', '4-seat', '14', '—', '20,000 + 23 × 12,000 + 5 × 9,000', '341,000'],
  ['10 km', '4-seat', '14', 'SAVE10', '116,000 − 11,600', '104,400'],
  ['30 km', '4-seat', '14', 'SAVE10', '341,000 − min(34,100; 20,000)', '321,000'],
]);
const TC = (id, description, data, expected) => ({ id, description, data, expected });
const D = (bookingCode, distance, carType, pickupHour, promoCode) => ({ bookingCode, distance, carType, pickupHour, promoCode });
const Q3_DS = [
  TC('A01', 'Verify that an empty Booking Code is rejected', D('', '10', '4-seat', '14', ''), 'Booking Code is required.'),
  TC('A02', 'Verify that a Booking Code not in the system is rejected', D('RB999', '10', '4-seat', '14', ''), 'Invalid Booking Code.'),
  TC('A03', 'Verify that an empty Distance is rejected', D('RB001', '', '4-seat', '14', ''), 'Distance is required.'),
  TC('A04', 'Verify that a non-numeric Distance is rejected', D('RB001', 'ten', '4-seat', '14', ''), 'Distance must be a number greater than 0 and at most 100.'),
  TC('A05', 'Verify that Distance = 0 is rejected (invalid boundary)', D('RB001', '0', '4-seat', '14', ''), 'Distance must be a number greater than 0 and at most 100.'),
  TC('A06', 'Verify that a negative Distance is rejected', D('RB001', '-3', '4-seat', '14', ''), 'Distance must be a number greater than 0 and at most 100.'),
  TC('A07', 'Verify that Distance = 100.1 is rejected (invalid boundary)', D('RB001', '100.1', '4-seat', '14', ''), 'Distance must be a number greater than 0 and at most 100.'),
  TC('A08', 'Verify that Car Type must be selected', D('RB001', '10', '', '14', ''), 'Car Type is required.'),
  TC('A09', 'Verify that an empty Pickup Hour is rejected', D('RB001', '10', '4-seat', '', ''), 'Pickup Hour is required.'),
  TC('A10', 'Verify that Pickup Hour = -1 is rejected', D('RB001', '10', '4-seat', '-1', ''), 'Pickup Hour must be an integer from 0 to 23.'),
  TC('A11', 'Verify that Pickup Hour = 24 is rejected (invalid boundary)', D('RB001', '10', '4-seat', '24', ''), 'Pickup Hour must be an integer from 0 to 23.'),
  TC('A12', 'Verify that a decimal Pickup Hour is rejected', D('RB001', '10', '4-seat', '7.5', ''), 'Pickup Hour must be an integer from 0 to 23.'),
  TC('A13', 'Verify that an unknown Promo Code is rejected', D('RB001', '10', '4-seat', '14', 'SAVE20'), 'Invalid Promo Code.'),
  TC('B01', 'R1 — 4-seat, daytime, no promo', D('RB001', '10', '4-seat', '14', ''), 'Estimated Fare: 116,000 VND.'),
  TC('B02', 'R2 — 4-seat, daytime, SAVE10', D('RB001', '10', '4-seat', '14', 'SAVE10'), 'Estimated Fare: 104,400 VND.'),
  TC('B03', 'R3 — 4-seat, night, no promo', D('RB002', '10', '4-seat', '23', ''), 'Estimated Fare: 139,200 VND.'),
  TC('B04', 'R4 — 4-seat, night, SAVE10', D('RB002', '10', '4-seat', '23', 'SAVE10'), 'Estimated Fare: 125,280 VND.'),
  TC('B05', 'R5 — 7-seat, daytime, no promo', D('RB003', '10', '7-seat', '14', ''), 'Estimated Fare: 150,800 VND.'),
  TC('B06', 'R6 — 7-seat, daytime, SAVE10', D('RB003', '10', '7-seat', '14', 'SAVE10'), 'Estimated Fare: 135,720 VND.'),
  TC('B07', 'R7 — 7-seat, night, no promo', D('RB003', '10', '7-seat', '2', ''), 'Estimated Fare: 180,960 VND.'),
  TC('B08', 'R8 — 7-seat, night, SAVE10', D('RB003', '10', '7-seat', '2', 'SAVE10'), 'Estimated Fare: 162,864 VND.'),
  TC('B09', 'R9 — the SAVE10 discount is capped at 20,000', D('RB001', '30', '4-seat', '14', 'SAVE10'), 'Estimated Fare: 321,000 VND.'),
  TC('C01', 'Boundary — smallest valid distance 0.1 km (opening fare)', D('RB001', '0.1', '4-seat', '14', ''), 'Estimated Fare: 20,000 VND.'),
  TC('C02', 'Boundary — 2.0 km is still the opening fare', D('RB001', '2', '4-seat', '14', ''), 'Estimated Fare: 20,000 VND.'),
  TC('C03', 'Boundary — 2.1 km adds the first started kilometre', D('RB001', '2.1', '4-seat', '14', ''), 'Estimated Fare: 32,000 VND.'),
  TC('C04', 'Boundary — 25.0 km is the last kilometre at 12,000', D('RB001', '25', '4-seat', '14', ''), 'Estimated Fare: 296,000 VND.'),
  TC('C05', 'Boundary — 25.1 km starts the 9,000 band', D('RB001', '25.1', '4-seat', '14', ''), 'Estimated Fare: 305,000 VND.'),
  TC('C06', 'Boundary — 100 km is the largest valid distance', D('RB001', '100', '4-seat', '14', ''), 'Estimated Fare: 971,000 VND.'),
  TC('C07', 'Boundary — 05:00 is still night', D('RB002', '10', '4-seat', '5', ''), 'Estimated Fare: 139,200 VND.'),
  TC('C08', 'Boundary — 06:00 is daytime', D('RB002', '10', '4-seat', '6', ''), 'Estimated Fare: 116,000 VND.'),
  TC('C09', 'Boundary — 21:00 is daytime', D('RB002', '10', '4-seat', '21', ''), 'Estimated Fare: 116,000 VND.'),
  TC('C10', 'Boundary — 22:00 is night', D('RB002', '10', '4-seat', '22', ''), 'Estimated Fare: 139,200 VND.'),
  TC('C11', 'Boundary — fare 200,000 gets exactly the 20,000 cap', D('RB001', '17', '4-seat', '14', 'SAVE10'), 'Estimated Fare: 180,000 VND.'),
  TC('C12', 'Boundary — fare just above 200,000: discount capped', D('RB001', '17.1', '4-seat', '14', 'SAVE10'), 'Estimated Fare: 192,000 VND.'),
];
const buoc = (d) => [
  `Enter Booking Code = ${d.bookingCode === '' ? '(empty)' : d.bookingCode}`,
  `Enter Distance = ${d.distance === '' ? '(empty)' : d.distance}`,
  `Select Car Type = ${d.carType === '' ? '(not selected)' : d.carType}`,
  `Enter Pickup Hour = ${d.pickupHour === '' ? '(empty)' : d.pickupHour}`,
  `Enter Promo Code = ${d.promoCode === '' ? '(empty)' : d.promoCode}`,
  'Click Estimate Fare',
];

export default deThiPE({
  so: 2,
  slug: 'swt301-11-pe-2-password-shipping-ride',
  ten: 'PE Practice 2 — PasswordPolicy · calcShippingFee · Ride Fare',
  tieuDe: 'SWT301 PE Practice 2 — PasswordPolicy review, calcShippingFee MC/DC, Ride Fare Estimate',
  phu: {
    en: 'PasswordPolicy review · calcShippingFee unit tests (3-condition MC/DC) · Ride Fare Estimate black-box · 85 minutes · 10 marks',
    vi: 'Review PasswordPolicy · unit test calcShippingFee (MC/DC 3 điều kiện) · test hộp đen Ride Fare Estimate · 85 phút · 10 điểm',
  },
  moTaNgan: 'PE luyện định dạng SU26: review PasswordPolicy (≥8 lỗi + sửa mã chạy thật), MC/DC cho điều kiện OR ba vế của calcShippingFee (tối thiểu 6 ca), test hộp đen Ride Fare Estimate với trường tuỳ chọn, bảng quyết định 3 điều kiện + trần khuyến mãi và BVA số thập phân.',
  q1: {
    tenLop: 'PasswordPolicy.isStrong',
    hamFix: 'isStrong',
    java: Q1_JAVA,
    moTa: {
      en: `<p><b>Problem description — password strength.</b> <code>isStrong(password, username)</code> returns <code>true</code> when the password is strong:</p>
<ul><li>A <code>null</code> password, or a <code>null</code>/empty username, is invalid input ⇒ <code>IllegalArgumentException</code>.</li>
<li>Length from <b>8 to 64</b> characters inclusive.</li>
<li>At least one uppercase letter, one lowercase letter <b>and</b> one digit.</li>
<li>It must not contain the username, compared <b>ignoring case</b>.</li></ul>`,
      vi: `<p><b>Mô tả bài toán — độ mạnh mật khẩu.</b> <code>isStrong(password, username)</code> trả <code>true</code> khi mật khẩu mạnh:</p>
<ul><li>Mật khẩu <code>null</code>, hoặc tên đăng nhập <code>null</code>/rỗng là dữ liệu sai ⇒ <code>IllegalArgumentException</code>.</li>
<li>Độ dài từ <b>8 tới 64</b> ký tự (tính cả hai đầu).</li>
<li>Có ít nhất một chữ hoa, một chữ thường <b>và</b> một chữ số.</li>
<li>Không được chứa tên đăng nhập, so <b>không phân biệt hoa/thường</b>.</li></ul>`,
    },
    khoa: Q1_KHOA, sai: Q1_SAI,
    mauIssue: { line: 7, type: 'BOUNDARY', severity: 'High', description: 'i <= password.length() reads one character too far.', fix: 'Use i < password.length().' },
    giaiIssues: GIAI_ISSUES,
    fixDau: FIX_DAU, fixGiai: FIX_GIAI,
    yeuCauFix: [
      { en: 'In <code>answers/q1-fixed.js</code> fix the twin <code>isStrong(password, username)</code> so that it satisfies the specification (character helpers are given).', vi: 'Trong <code>answers/q1-fixed.js</code> sửa bản sinh đôi <code>isStrong(password, username)</code> cho đúng đặc tả (đã có sẵn hàm kiểm ký tự).' },
      { en: 'Invalid input throws <code>IllegalArgumentException</code>.', vi: 'Dữ liệu sai ném <code>IllegalArgumentException</code>.' },
    ],
    viDuFix: { en: 'isStrong("Abcdefg1", "john") → true      isStrong("xxJOHN123a", "john") → false', vi: 'isStrong("Abcdefg1", "john") → true      isStrong("xxJOHN123a", "john") → false' },
    kiemFix: KIEM_FIX,
  },
  q2: {
    ham: 'calcShippingFee',
    java: Q2_JAVA,
    code: Q2_DO,
    cfg: Q2_CFG,
    thamSo: ['weightGram', 'zone', 'isMember'],
    kieuInput: '{ weightGram, zone, isMember }',
    spec: q2Spec, loai: q2Loai, mcdc: ['D1', 'D4'], toiThieu: 6,
    moTa: {
      en: `<p><b>Method description.</b> <code>calcShippingFee</code> returns the delivery fee of a parcel in VND. A parcel is valid when it weighs <b>1–30,000 g</b> and has a non-null zone; otherwise the method returns <code>-1</code>. Zone <code>"INNER"</code> (inner city) starts at 20,000 VND; every other zone starts at 35,000 VND. Above 2,000 g, each <b>started</b> 500 g adds 5,000 VND. Members get 10% off when the fee is <b>above 50,000 VND</b>.</p>`,
      vi: `<p><b>Mô tả phương thức.</b> <code>calcShippingFee</code> trả phí giao một kiện hàng (VND). Kiện hợp lệ khi nặng <b>1–30.000 g</b> và zone khác null; ngược lại trả <code>-1</code>. Zone <code>"INNER"</code> (nội thành) bắt đầu 20.000 đ; mọi zone khác bắt đầu 35.000 đ. Trên 2.000 g, mỗi 500 g <b>bắt đầu</b> cộng 5.000 đ. Thành viên được giảm 10% khi phí <b>trên 50.000 đ</b>.</p>`,
    },
    yeuCau: [
      { en: 'Choose the <b>minimum</b> number of test cases for 100% statement coverage, 100% decision coverage and MC/DC of BOTH compound conditions (line 2 has THREE conditions, line 7 has two).', vi: 'Chọn số ca <b>tối thiểu</b> cho 100% statement, 100% decision và MC/DC cho CẢ HAI điều kiện ghép (dòng 2 có BA điều kiện, dòng 7 có hai).' },
      { en: 'Coverage is measured on the code as written. A null zone is written <code>zone: null</code>.', vi: 'Độ phủ đo trên mã đúng như đang viết. Zone null ghi <code>zone: null</code>.' },
    ],
    yeuCau2: [
      { en: '<code>expected</code> = the SPECIFICATION (per <b>started</b> 500 g). <code>status</code> = <code>"P"</code> when the code returns it, else <code>"F"</code>.', vi: '<code>expected</code> = theo ĐẶC TẢ (mỗi 500 g <b>bắt đầu</b>). <code>status</code> = <code>"P"</code> khi mã trả đúng, ngược lại <code>"F"</code>.' },
      { en: '<code>type</code>: <code>A</code> invalid input, <code>B</code> for 1, 2000, 2001, 30000 g (0 and 30001 may be A or B), otherwise <code>N</code>.', vi: '<code>type</code>: <code>A</code> input sai, <code>B</code> cho 1, 2000, 2001, 30000 g (0 và 30001 ghi A hay B đều được), còn lại <code>N</code>.' },
    ],
    mauUtcid: { id: 'UTCID01', input: { weightGram: 0, zone: 'INNER', isMember: false }, expected: -1, type: 'A', status: 'P' },
    giaiUtcid: GIAI_UTCID,
  },
  q3: {
    ten: 'Ride Fare Estimate',
    moTa: {
      en: `<p><b>Function description.</b> A ride-hailing app estimates the fare of a booked ride.</p>
<p><b>Fields:</b> Booking Code — required; codes in the system: <code>RB001</code>, <code>RB002</code>, <code>RB003</code>. Distance (km) — required, a number with at most one decimal, <b>&gt; 0 and ≤ 100</b>. Car Type — required (4-seat / 7-seat). Pickup Hour — required, an <b>integer 0–23</b>. Promo Code — <b>optional</b>; when given it must be <code>SAVE10</code>.</p>
<p>When the user clicks <b>Estimate Fare</b> the system performs these steps <b>in order</b> and stops at the first error:</p>
<ol><li>Booking Code: empty → <code>Booking Code is required.</code>; not in the system → <code>Invalid Booking Code.</code></li>
<li>Distance: empty → <code>Distance is required.</code>; not a number, ≤ 0 or &gt; 100 → <code>Distance must be a number greater than 0 and at most 100.</code></li>
<li>Car Type: not selected → <code>Car Type is required.</code></li>
<li>Pickup Hour: empty → <code>Pickup Hour is required.</code>; not an integer 0–23 → <code>Pickup Hour must be an integer from 0 to 23.</code></li>
<li>Promo Code: not empty and not <code>SAVE10</code> → <code>Invalid Promo Code.</code></li>
<li>Calculate the fare:
<ul><li>Distance fare: the opening fare <b>20,000 VND covers the first 2 km</b>; each <b>started</b> km from 2 to 25 km costs 12,000; each started km beyond 25 km costs 9,000.</li>
<li>7-seat car: distance fare × 1.3. Night pickup (<b>22:00–05:59</b>, i.e. hour ≥ 22 or ≤ 5): × 1.2.</li>
<li><code>SAVE10</code>: 10% off the fare, <b>at most 20,000 VND</b>.</li></ul></li>
<li>Display <code>Estimated Fare: [x] VND.</code> with thousands separators.</li></ol>
<p><b>Calculation examples</b></p>${MAU_Q3}`,
      vi: `<p><b>Mô tả chức năng.</b> Ứng dụng gọi xe ước tính giá một chuyến đã đặt.</p>
<p><b>Các trường:</b> Booking Code — bắt buộc; mã có trong hệ thống: <code>RB001</code>, <code>RB002</code>, <code>RB003</code>. Distance (km) — bắt buộc, số có tối đa một chữ số thập phân, <b>&gt; 0 và ≤ 100</b>. Car Type — bắt buộc (4-seat / 7-seat). Pickup Hour — bắt buộc, <b>số nguyên 0–23</b>. Promo Code — <b>tuỳ chọn</b>; nếu nhập thì phải là <code>SAVE10</code>.</p>
<p>Khi bấm <b>Estimate Fare</b> hệ thống làm các bước <b>theo thứ tự</b> và dừng ở lỗi đầu tiên:</p>
<ol><li>Booking Code: trống → <code>Booking Code is required.</code>; không có trong hệ thống → <code>Invalid Booking Code.</code></li>
<li>Distance: trống → <code>Distance is required.</code>; không phải số, ≤ 0 hoặc &gt; 100 → <code>Distance must be a number greater than 0 and at most 100.</code></li>
<li>Car Type: chưa chọn → <code>Car Type is required.</code></li>
<li>Pickup Hour: trống → <code>Pickup Hour is required.</code>; không phải số nguyên 0–23 → <code>Pickup Hour must be an integer from 0 to 23.</code></li>
<li>Promo Code: có nhập mà khác <code>SAVE10</code> → <code>Invalid Promo Code.</code></li>
<li>Tính giá:
<ul><li>Giá theo quãng đường: giá mở cửa <b>20.000 đ cho 2 km đầu</b>; mỗi km <b>bắt đầu</b> từ km 2 tới km 25 giá 12.000; mỗi km bắt đầu sau km 25 giá 9.000.</li>
<li>Xe 7 chỗ: × 1,3. Đón ban đêm (<b>22:00–05:59</b>, tức giờ ≥ 22 hoặc ≤ 5): × 1,2.</li>
<li><code>SAVE10</code>: giảm 10% giá, <b>tối đa 20.000 đ</b>.</li></ul></li>
<li>Hiển thị <code>Estimated Fare: [x] VND.</code> có dấu phân cách hàng nghìn.</li></ol>
<p><b>Ví dụ tính</b></p>${MAU_Q3}`,
    },
    wireframe: `+----------------------------------------------------------------+
|                     RIDE FARE ESTIMATE                         |
+----------------------------------------------------------------+
|  Booking Code    [ e.g. RB001                              ]   |
|  Distance (km)   [ e.g. 12.5                               ]   |
|  Car Type        [ -- Select car type --                 v ]   |  4-seat / 7-seat
|  Pickup Hour     [ 0 - 23                                  ]   |
|  Promo Code      [ optional, e.g. SAVE10                   ]   |
|                                                                |
|                      [ Estimate Fare ]                         |
|  Estimated Fare: 116,000 VND.                                  |
+----------------------------------------------------------------+`,
    heThong: q3HeThong, nhan: q3Nhan,
    truongData: ['bookingCode', 'distance', 'carType', 'pickupHour', 'promoCode'],
    dataMoTa: { en: '{ bookingCode, distance, carType, pickupHour, promoCode } — strings as typed/selected ("" = empty)', vi: '{ bookingCode, distance, carType, pickupHour, promoCode } — chuỗi như khi gõ/chọn ("" = để trống)' },
    viDuKyVong: 'Estimated Fare: 116,000 VND.',
    precondition: 'User is on the Ride Fare Estimate screen; bookings RB001–RB003 exist',
    buoc,
    ds: Q3_DS,
    toiDa: 50,
    giaDinh: 'Assumptions: validation stops at the first error; "started km" means any part of a km counts as a whole km.',
    anMa: ['fare just above 200,000 (capped)', 'Distance = 100.1', 'Pickup Hour = 24'],
    khoiA: {
      yeuCau: [
        { en: 'One test case for EVERY message, and for each different reason behind a shared message (distance: text, 0, negative, above 100; hour: negative, 24, decimal).', vi: 'Một ca cho MỖI thông báo, và cho từng lý do khác nhau của cùng một thông báo (quãng đường: chữ, 0, âm, trên 100; giờ: âm, 24, thập phân).' },
        { en: 'The optional Promo Code: test both “empty” (allowed) and an unknown code.', vi: 'Promo Code tuỳ chọn: test cả “để trống” (được phép) và một mã lạ.' },
      ],
      can: [
        { ma: 'V_CODE_EMPTY', ten: 'empty Booking Code' }, { ma: 'V_CODE_INVALID', ten: 'Booking Code not in the system' },
        { ma: 'V_DIST_EMPTY', ten: 'empty Distance' }, { ma: 'V_DIST_TEXT', ten: 'non-numeric Distance' }, { ma: 'V_DIST_ZERO', ten: 'Distance = 0' },
        { ma: 'V_DIST_NEG', ten: 'negative Distance' }, { ma: 'V_DIST_OVER', ten: 'Distance above 100' }, { ma: 'V_CAR', ten: 'Car Type not selected' },
        { ma: 'V_HOUR_EMPTY', ten: 'empty Pickup Hour' }, { ma: 'V_HOUR_NEG', ten: 'negative Pickup Hour' }, { ma: 'V_HOUR_OVER', ten: 'Pickup Hour above 23' },
        { ma: 'V_HOUR_TEXT', ten: 'decimal or text Pickup Hour' }, { ma: 'V_PROMO', ten: 'unknown Promo Code' },
      ],
    },
    khoiB: {
      yeuCau: [
        { en: 'Cover the 8 combinations of Car Type × Night × Promo (R1–R8) and R9 — the promo discount capped at 20,000.', vi: 'Phủ 8 tổ hợp Car Type × Ban đêm × Khuyến mãi (R1–R8) và R9 — giảm giá bị chặn ở 20.000.' },
        { en: 'Compute every expected amount exactly (multiply in this order: 7-seat, night, then promo).', vi: 'Tính đúng mọi số tiền mong đợi (nhân theo thứ tự: 7 chỗ, ban đêm, rồi khuyến mãi).' },
      ],
      can: [
        { ma: 'R1', ten: 'R1 4-seat · day · no promo' }, { ma: 'R2', ten: 'R2 4-seat · day · SAVE10' }, { ma: 'R3', ten: 'R3 4-seat · night · no promo' },
        { ma: 'R4', ten: 'R4 4-seat · night · SAVE10' }, { ma: 'R5', ten: 'R5 7-seat · day · no promo' }, { ma: 'R6', ten: 'R6 7-seat · day · SAVE10' },
        { ma: 'R7', ten: 'R7 7-seat · night · no promo' }, { ma: 'R8', ten: 'R8 7-seat · night · SAVE10' }, { ma: 'R9', ten: 'R9 promo discount capped at 20,000' },
      ],
    },
    khoiC: {
      yeuCau: [
        { en: 'Distance 0.1 / 2.0 / 2.1 / 25.0 / 25.1 / 100; hour 5 / 6 and 21 / 22; the cap edge (fare = 200,000 and a fare just above it).', vi: 'Quãng đường 0,1 / 2,0 / 2,1 / 25,0 / 25,1 / 100; giờ 5 / 6 và 21 / 22; biên trần (giá = 200.000 và giá ngay trên đó).' },
      ],
      can: [
        { ma: 'B_D01', ten: 'Distance = 0.1' }, { ma: 'B_D2', ten: 'Distance = 2.0' }, { ma: 'B_D21', ten: 'Distance = 2.1' }, { ma: 'B_D25', ten: 'Distance = 25.0' },
        { ma: 'B_D251', ten: 'Distance = 25.1' }, { ma: 'B_D100', ten: 'Distance = 100' }, { ma: 'B_H5', ten: 'Pickup Hour = 5 (night)' }, { ma: 'B_H6', ten: 'Pickup Hour = 6 (day)' },
        { ma: 'B_H21', ten: 'Pickup Hour = 21 (day)' }, { ma: 'B_H22', ten: 'Pickup Hour = 22 (night)' }, { ma: 'B_CAP_EQ', ten: 'fare = 200,000 with SAVE10' },
        { ma: 'B_CAP_OVER', ten: 'fare just above 200,000 (capped)' }, { ma: 'B_D1001', ten: 'Distance = 100.1' }, { ma: 'B_H24', ten: 'Pickup Hour = 24' },
      ],
    },
  },
  boYeu: [
    { ten: 'Q2: thiếu ca zone null (MC/DC dòng 2)', tep: { 'answers/q2-utcid.js': GIAI_UTCID.replace(/\n  \{ id: 'UTCID03'[^\n]*/, '') }, phaiTruot: ['MC/DC for the compound decision on line 2', 'Minimal set'] },
    { ten: 'Q2: thiếu ca (T,F) dòng 7', tep: { 'answers/q2-utcid.js': GIAI_UTCID.replace(/\n  \{ id: 'UTCID06'[^\n]*/, '') }, phaiTruot: ['MC/DC for the compound decision on line 7'] },
    { ten: 'Q2: expected chép từ mã (80000)', tep: { 'answers/q2-utcid.js': GIAI_UTCID.replace("expected: 85000, type: 'N', status: 'F'", "expected: 80000, type: 'N', status: 'P'") }, phaiTruot: ['Every "expected" value comes from the SPECIFICATION'] },
    { ten: 'Q1.2: vẫn so phân biệt hoa/thường', tep: { 'answers/q1-fixed.js': FIX_GIAI.replace('password.toLowerCase().includes(username.toLowerCase())', 'password.includes(username)') }, phaiTruot: ['contains the username ignoring case'] },
    { ten: 'Q3: không có ca trần khuyến mãi', q3: (ds) => ds.filter((t) => !['B09', 'C11', 'C12'].includes(t.id)), phaiTruot: ['Decision-table rule — R9', 'Boundary value — fare = 200,000'] },
    { ten: 'Q3: thiếu ca promo sai', q3: (ds) => ds.filter((t) => t.id !== 'A13'), phaiTruot: ['Validation — unknown Promo Code'] },
  ],
  truDiem: [
    { en: 'Q2 with 4 tests for line 2: MC/DC of a three-condition OR needs each condition true ALONE — 0 g, 30001 g and a null zone are three different tests.', vi: 'Câu 2 viết 1–2 ca cho dòng 2: MC/DC của OR ba vế cần MỖI điều kiện đúng MỘT MÌNH — 0 g, 30001 g và zone null là ba ca khác nhau.' },
    { en: 'Expected fee copied from the code (floor division) instead of the spec (“started 500 g”).', vi: 'Chép phí mong đợi từ mã (chia lấy phần nguyên) thay vì đặc tả (“500 g bắt đầu”).' },
    { en: 'Q1: reporting line 3 as a boundary error (8 and 64 ARE accepted) or line 16 as a compile error.', vi: 'Câu 1: báo dòng 3 sai biên (8 và 64 ĐƯỢC chấp nhận) hoặc dòng 16 là lỗi biên dịch.' },
    { en: 'Q3: forgetting that an EMPTY promo code is valid, or computing the 7-seat and night factors in the wrong order and rounding.', vi: 'Câu 3: quên rằng promo để TRỐNG là hợp lệ, hoặc nhân hệ số 7 chỗ / ban đêm sai thứ tự rồi làm tròn.' },
  ],
  goiY: [
    'Q1: dò từng dòng — null/rỗng ở tham số? biên vòng lặp? hàm thư viện đúng tên chưa (isLetter/isDigit)? so chuỗi có phân biệt hoa/thường không? ưu tiên && / ||? kiểu so sánh trong main có biên dịch được không?',
    'Q2: MC/DC cho OR ba vế: mỗi vế cần một ca chỉ MÌNH nó đúng (0 g · 30001 g · zone null) + một ca hợp lệ làm nền ⇒ 3 ca không hợp lệ. AND hai vế ở dòng 7: (T,T) (F,T) (T,F) ⇒ 3 ca hợp lệ. Xếp INNER/OUTER và ≤/> 2000 g vào ba ca đó.',
    'Q2: muốn lộ lỗi dòng 6 thì chọn khối lượng mà (w − 2000) không chia hết cho 500 — mong đợi theo đặc tả lớn hơn mã ⇒ status "F".',
    'Q3: tính theo "phần mười km": 2,1 km ⇒ 1 km bắt đầu sau km 2. Giá 7 chỗ × 1,3 rồi ban đêm × 1,2 rồi mới trừ khuyến mãi (tối đa 20.000).',
  ],
  loiHayGap: [
    'Viết ca không hợp lệ dòng 2 với hai điều kiện cùng đúng (vd 0 g và zone null) — không chứng minh được điều kiện nào quyết định ⇒ hỏng MC/DC.',
    'Quên ca (T,F) của <code>isMember &amp;&amp; fee &gt; 50000</code>: thành viên nhưng phí ≤ 50.000.',
    'Câu 1 nói "dùng <code>==</code> so chuỗi" ở dòng 13 — dòng 13 dùng <code>contains</code>; lỗi thật ở đó là phân biệt hoa/thường và username null/rỗng.',
    'Câu 3 bỏ qua trường tuỳ chọn: không có ca promo để trống hợp lệ và ca promo sai.',
    'Đổi 25,1 km thành "26 km" khi tính: chỉ có <b>một</b> km bắt đầu sau km 25 ⇒ +9.000, không phải +12.000.',
  ],
  giaiThich: {
    en: `<h4>Question 1</h4><p>The loop condition <code>i &lt;= length()</code> makes every call that reaches it throw; <code>isLetter</code> is used where <code>isDigit</code> was meant; the username check is case-sensitive and never validated (null throws, empty matches everything); <code>&amp;&amp;</code> binds tighter than <code>||</code>; and the demo compares a boolean with a String, which does not compile. Line 3 is a trap — it is correct.</p>
<h4>Question 2</h4><p>Line 2 is <code>A || B || C</code>: MC/DC needs each condition to be true <i>alone</i> against the all-false baseline ⇒ 0 g, 30001 g and <code>zone == null</code> are three separate tests (with short-circuiting, B is only evaluated when A is false, C only when A and B are false). Line 7 is <code>isMember &amp;&amp; fee &gt; 50000</code> ⇒ (T,T), (F,T), (T,F). Total <b>6</b>. Expected values follow the spec: 8,100 g = 13 started 500 g steps ⇒ 85,000, but the code computes 12 ⇒ 80,000 ⇒ <b>F</b>, defect on line 6.</p>
<pre>@ParameterizedTest
@CsvSource({ "0,INNER,false,-1", "30001,INNER,false,-1", "1500,,false,-1",
             "5000,OUTER,true,58500", "8100,INNER,false,85000", "1000,INNER,true,20000" })
void calcShippingFee(int w, String zone, boolean member, int expected) {
    assertEquals(expected, Shipping.calcShippingFee(w, zone, member));   // the empty CSV cell is null
}</pre>
<h4>Question 3</h4><p>Validation: every message, every reason, and the OPTIONAL field both ways. Business rules: three binary conditions (car, night, promo) = 8 rules + the cap rule R9. Boundaries: the edges of each distance band in tenths of a km (0.1 · 2.0|2.1 · 25.0|25.1 · 100|100.1), of the night window (5|6, 21|22) and of the promo cap (200,000 exactly vs just above).</p>`,
    vi: `<h4>Câu 1</h4><p>Điều kiện vòng lặp <code>i &lt;= length()</code> làm mọi lời gọi chạy tới đó văng lỗi; dùng <code>isLetter</code> ở chỗ cần <code>isDigit</code>; kiểm username phân biệt hoa/thường và không hề kiểm null/rỗng; <code>&amp;&amp;</code> ưu tiên hơn <code>||</code>; main so boolean với String nên không biên dịch. Dòng 3 là bẫy — nó đúng.</p>
<h4>Câu 2</h4><p>Dòng 2 là <code>A || B || C</code>: MC/DC cần mỗi điều kiện đúng <i>một mình</i> so với ca nền đều sai ⇒ 0 g, 30001 g và <code>zone == null</code> là ba ca riêng. Dòng 7 là <code>isMember &amp;&amp; fee &gt; 50000</code> ⇒ (T,T), (F,T), (T,F). Tổng <b>6</b> ca. Mong đợi theo đặc tả: 8.100 g = 13 bước 500 g bắt đầu ⇒ 85.000, mã tính 12 ⇒ 80.000 ⇒ <b>F</b>, lỗi ở dòng 6.</p>
<h4>Câu 3</h4><p>Hợp lệ: mọi thông báo, mọi lý do, và trường TUỲ CHỌN theo cả hai phía. Luật nghiệp vụ: ba điều kiện nhị phân (loại xe, ban đêm, khuyến mãi) = 8 luật + luật trần R9. Biên: mép mỗi khoảng quãng đường tính theo phần mười km (0,1 · 2,0|2,1 · 25,0|25,1 · 100|100,1), khung giờ đêm (5|6, 21|22) và trần khuyến mãi (đúng 200.000 vs ngay trên).</p>`,
  },
});

void tien;
