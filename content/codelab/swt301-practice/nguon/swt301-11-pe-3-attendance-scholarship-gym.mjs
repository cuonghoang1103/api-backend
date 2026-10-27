/**
 * SWT301 · PE PRACTICE 3 (định dạng SU26). Đề MỚI theo dạng PE23/PE24:
 *   Q1 review ExamEligibility.canTakeFinalExam (== so chuỗi, trường static rò trạng thái, chia nguyên hai lần, || thay &&, thiếu ;);
 *   Q2 checkScholarship — AND ba vế + AND hai vế lồng sau ⇒ MC/DC có ngắn mạch, tối thiểu 6 ca, lỗi đặc tả lộ ngay trong bộ tối thiểu;
 *   Q3 Gym Membership Fee — hợp lệ 12 lý do, bảng quyết định rút gọn (luật "không quan tâm"), BVA nhiều mốc (tuổi, buổi PT).
 */
import { svg, bangHtml } from './_chung.mjs';
import { deThiPE } from './_pe.mjs';

/* ═══════════════════════ Q1 ═══════════════════════ */
const Q1_JAVA = `import java.util.List;

public class ExamEligibility {
    static int lateCount;

    public static boolean canTakeFinalExam(List<String> statuses, boolean feePaid) {
        int absent = 0;
        for (String s : statuses) {
            if (s == "ABSENT") absent++;
            else if (s.equals("LATE")) lateCount++;
        }
        double rate = (absent + lateCount / 2) / statuses.size() * 100;
        if (rate < 20 || feePaid) {
            return true;
        }
        return false
    }

    public static void main(String[] args) {
        List<String> week = List.of("PRESENT", "ABSENT", "Late");
        System.out.println(canTakeFinalExam(week, true));
    }
}`;
const Q1_KHOA = [
  { ma: 'K1', dong: [6, 8], loai: ['VALIDATION', 'EXCEPTION'], ten: 'null list is not handled (NullPointerException in the for-each)' },
  { ma: 'K2', dong: [6, 12], loai: ['VALIDATION', 'EXCEPTION'], ten: 'empty list → integer division by zero (ArithmeticException)' },
  { ma: 'K3', dong: [9], loai: ['LOGIC'], ten: 's == "ABSENT" compares references, not text — use equals', tenVi: 's == "ABSENT" so tham chiếu chứ không so nội dung — phải dùng equals', nang: true },
  { ma: 'K4', dong: [9, 10], loai: ['VALIDATION', 'EXCEPTION'], ten: 'unknown or null statuses ("Late", null) are silently accepted / throw NPE; the spec requires IllegalArgumentException' },
  { ma: 'K5', dong: [4, 10], loai: ['LOGIC', 'DATA_TYPE'], ten: 'static lateCount is never reset — late slots leak from one call (one student) into the next', tenVi: 'lateCount static không bao giờ reset — số buổi muộn rò từ lần gọi (sinh viên) này sang lần sau', nang: true },
  { ma: 'K6', dong: [12], loai: ['CALCULATION', 'DATA_TYPE'], ten: 'lateCount / 2 is an integer division — half absences are lost', tenVi: 'lateCount / 2 là chia nguyên — mất nửa buổi vắng', nang: true },
  { ma: 'K7', dong: [12], loai: ['CALCULATION', 'DATA_TYPE'], ten: '(...) / statuses.size() is an integer division done BEFORE × 100 — the rate is always 0 or 100', tenVi: '(...) / statuses.size() là chia nguyên làm TRƯỚC khi × 100 — tỉ lệ chỉ ra 0 hoặc 100', nang: true },
  { ma: 'K8', dong: [13], loai: ['BOUNDARY'], ten: 'rate < 20 rejects exactly 20%; the spec allows "at most 20%"' },
  { ma: 'K9', dong: [13], loai: ['LOGIC'], ten: '|| feePaid lets anyone who paid sit the exam — both conditions are required (&&)', tenVi: '|| feePaid cho mọi người đã đóng phí được thi — phải đủ cả hai điều kiện (&&)', nang: true },
  { ma: 'K10', dong: [16], loai: ['COMPILE'], ten: 'missing semicolon after return false — compile error', tenVi: 'thiếu dấu chấm phẩy sau return false — lỗi biên dịch', nang: true },
  { ma: 'K11', dong: [20, 21], loai: ['TEST_DATA'], ten: '"Late" is not a valid status and the demo checks no expected value' },
  { ma: 'K12', dong: [12, 13], loai: ['CONVENTION'], ten: 'magic numbers 2, 100 and 20 instead of named constants' },
  { ma: 'K13', dong: [13, 14, 15, 16], loai: ['CONVENTION'], ten: 'if (cond) return true; return false; — return the condition directly' },
];
const Q1_SAI = [
  { dong: [12], loai: ['COMPILE'], ten: 'line 12 compiles: the int result is widened to double' },
  { dong: [20], loai: ['COMPILE'], ten: 'line 20 compiles: List.of(...) is legal since Java 9' },
];
const FIX_DAU = `// Question 1 (deeper) — JavaScript twin of ExamEligibility.canTakeFinalExam WITH the same defects.
// Java's s == "ABSENT" compares object references: for strings coming from user input it is false, so the twin
// models it with isSameReference(). The Java "static int lateCount" is a module-level variable here.
// Fix it so it follows the specification. The grader calls canTakeFinalExam(statuses, feePaid).
class IllegalArgumentException extends Error {
  constructor(message) { super(message); this.name = 'IllegalArgumentException'; }
}
const isSameReference = (a, b) => typeof a === 'object' && a === b;
let lateCount = 0;

function canTakeFinalExam(statuses, feePaid) {
  let absent = 0;
  for (const s of statuses) {
    if (isSameReference(s, 'ABSENT')) absent++;
    else if (s === 'LATE') lateCount++;
  }
  const rate = Math.trunc((absent + Math.trunc(lateCount / 2)) / statuses.length) * 100;
  if (rate < 20 || feePaid) {
    return true;
  }
  return false;
}
`;
const FIX_GIAI = `// Question 1 (deeper) — corrected canTakeFinalExam.
//  · statuses: not null, not empty, every item exactly PRESENT / ABSENT / LATE → else IllegalArgumentException
//  · rate = (ABSENT + 0.5 × LATE) ÷ slots × 100, computed in floating point, no shared state between calls
//  · eligible when rate <= 20 AND the fee is paid
class IllegalArgumentException extends Error {
  constructor(message) { super(message); this.name = 'IllegalArgumentException'; }
}
const VALID_STATUSES = ['PRESENT', 'ABSENT', 'LATE'];
const MAX_ABSENCE_PERCENT = 20;
const LATE_WEIGHT = 0.5;

function canTakeFinalExam(statuses, feePaid) {
  if (!Array.isArray(statuses) || statuses.length === 0) {
    throw new IllegalArgumentException('statuses must be a non-empty list');
  }
  let absent = 0;
  let late = 0;                                   // local — nothing leaks into the next call
  for (const s of statuses) {
    if (!VALID_STATUSES.includes(s)) throw new IllegalArgumentException('unknown status: ' + s);
    if (s === 'ABSENT') absent++;                 // compare the text (Java: "ABSENT".equals(s))
    else if (s === 'LATE') late++;
  }
  const rate = ((absent + late * LATE_WEIGHT) * 100) / statuses.length;
  return rate <= MAX_ABSENCE_PERCENT && feePaid === true;
}
`;
const GIAI_ISSUES = `// Question 1 — sheet Q1. Thirteen issues; any 8 correct ones earn the list marks.
const ISSUES = [
  { line: 8, type: 'EXCEPTION', severity: 'Medium', description: 'A null list throws NullPointerException in the for-each; the spec requires IllegalArgumentException.', fix: 'if (statuses == null || statuses.isEmpty()) throw new IllegalArgumentException(...);' },
  { line: 12, type: 'EXCEPTION', severity: 'Medium', description: 'An empty list makes statuses.size() = 0: integer division by zero throws ArithmeticException.', fix: 'Reject an empty list before the loop.' },
  { line: 9, type: 'LOGIC', severity: 'High', description: 's == "ABSENT" compares references; statuses read from a database or form are different objects, so absences are not counted.', fix: '"ABSENT".equals(s)' },
  { line: 10, type: 'VALIDATION', severity: 'Medium', description: 'Unknown statuses ("Late") are silently treated as present and a null item throws NPE; the spec requires IllegalArgumentException.', fix: 'else if (!"PRESENT".equals(s)) throw new IllegalArgumentException("unknown status " + s);' },
  { line: 4, type: 'LOGIC', severity: 'High', description: 'lateCount is static and never reset: late slots of one student are added to the next student.', fix: 'Use a local variable int late = 0; inside the method.' },
  { line: 12, type: 'CALCULATION', severity: 'High', description: 'lateCount / 2 is integer division: one late slot counts as 0 absences instead of 0.5.', fix: 'late * 0.5' },
  { line: 12, type: 'DATA_TYPE', severity: 'High', description: '(absent + ...) / statuses.size() is int / int, done before * 100: the rate is always 0 or 100.', fix: 'double rate = (absent + late * 0.5) * 100.0 / statuses.size();' },
  { line: 13, type: 'BOUNDARY', severity: 'Medium', description: 'rate < 20 rejects a rate of exactly 20%, which the spec allows ("at most 20%").', fix: 'rate <= 20' },
  { line: 13, type: 'LOGIC', severity: 'High', description: '|| feePaid: any student who paid may sit the exam, whatever the absences.', fix: 'return rate <= 20 && feePaid;' },
  { line: 16, type: 'COMPILE', severity: 'High', description: 'Missing semicolon after return false: the class does not compile.', fix: 'return false;' },
  { line: 20, type: 'TEST_DATA', severity: 'Low', description: '"Late" is not one of PRESENT/ABSENT/LATE and the demo only prints — no expected result.', fix: 'Use List.of("PRESENT", "ABSENT", "LATE") and assert the expected value in a unit test.' },
  { line: 12, type: 'CONVENTION', severity: 'Low', description: 'Magic numbers 2, 100 and 20 hide the business rules.', fix: 'LATE_WEIGHT = 0.5, MAX_ABSENCE_PERCENT = 20.' },
  { line: 14, type: 'CONVENTION', severity: 'Low', description: 'if (cond) return true; return false; is verbose.', fix: 'return rate <= MAX_ABSENCE_PERCENT && feePaid;' },
];
`;
const P = (n) => Array(n).fill("'PRESENT'").join(', ');
const kf = (goi, mongDoi, en, vi) => ({ moTa: { en, vi }, goi, mongDoi });
const KIEM_FIX = [
  kf(`canTakeFinalExam([${P(10)}], true)`, true, 'all present, fee paid → true', 'đi học đủ, đã đóng phí → true'),
  kf(`canTakeFinalExam(['ABSENT', 'ABSENT', 'ABSENT', ${P(7)}], true)`, false, '3 absences of 10 slots (30%) → false even though the fee is paid', '3 buổi vắng trên 10 (30%) → false dù đã đóng phí'),
  kf(`canTakeFinalExam(['ABSENT', ${P(4)}], true)`, true, 'exactly 20% → true (boundary)', 'đúng 20% → true (biên)'),
  kf(`canTakeFinalExam(['ABSENT', 'LATE', ${P(8)}], true)`, true, '1 absence + 1 late of 10 = 15% → true', '1 vắng + 1 muộn trên 10 = 15% → true'),
  kf(`canTakeFinalExam(['ABSENT', 'ABSENT', 'LATE', ${P(7)}], true)`, false, '2 absences + 1 late of 10 = 25% → false', '2 vắng + 1 muộn trên 10 = 25% → false'),
  kf("canTakeFinalExam(['LATE', 'PRESENT'], true)", false, 'one late of two slots = 25% → false (late counts as half)', 'một muộn trên hai buổi = 25% → false (muộn tính nửa buổi)'),
  kf(`canTakeFinalExam([${P(10)}], false)`, false, 'fee not paid → false', 'chưa đóng phí → false'),
  kf(`(canTakeFinalExam(['LATE', 'LATE', 'LATE', 'LATE', ${P(6)}], true), canTakeFinalExam(['ABSENT', ${P(4)}], true))`, true, 'no state leaks between two calls', 'không rò trạng thái giữa hai lần gọi'),
  kf('canTakeFinalExam(null, true)', { loi: 'IllegalArgumentException' }, 'null list → IllegalArgumentException', 'danh sách null → IllegalArgumentException'),
  kf('canTakeFinalExam([], true)', { loi: 'IllegalArgumentException' }, 'empty list → IllegalArgumentException', 'danh sách rỗng → IllegalArgumentException'),
  kf("canTakeFinalExam(['PRESENT', 'Late'], true)", { loi: 'IllegalArgumentException' }, 'unknown status "Late" → IllegalArgumentException', 'trạng thái lạ "Late" → IllegalArgumentException'),
  kf("canTakeFinalExam(['PRESENT', null], true)", { loi: 'IllegalArgumentException' }, 'null status → IllegalArgumentException', 'trạng thái null → IllegalArgumentException'),
];

/* ═══════════════════════ Q2 ═══════════════════════ */
const Q2_JAVA = `public static String checkScholarship(double gpa, int credits, boolean hasViolation) {
    if (gpa < 0 || gpa > 4)
        return "Invalid GPA";
    if (gpa >= 3.6 && credits >= 15 && !hasViolation)
        return "Full Scholarship";
    if (gpa >= 3.2 && credits >= 15)
        return "Half Scholarship";
    return "None";
}`;
const Q2_DO = `function checkScholarship(gpa, credits, hasViolation) {
  $s('S1'); if ($d('D1', $c('D1.A', gpa < 0) || $c('D1.B', gpa > 4)))
    { $s('S2'); return 'Invalid GPA'; }
  $s('S3'); if ($d('D2', $c('D2.A', gpa >= 3.6) && $c('D2.B', credits >= 15) && $c('D2.C', !hasViolation)))
    { $s('S4'); return 'Full Scholarship'; }
  $s('S5'); if ($d('D3', $c('D3.A', gpa >= 3.2) && $c('D3.B', credits >= 15)))
    { $s('S6'); return 'Half Scholarship'; }
  $s('S7'); return 'None';
}`;
function q2Spec(gpa, credits, hasViolation) {
  if (gpa < 0 || gpa > 4) return 'Invalid GPA';
  if (hasViolation) return 'None';
  if (gpa >= 3.6 && credits >= 15) return 'Full Scholarship';
  if (gpa >= 3.2 && credits >= 15) return 'Half Scholarship';
  return 'None';
}
function q2Loai(i) {
  const g = i.gpa;
  if (g < 0 || g > 4) return g >= -0.1 && g <= 4.1 ? ['A', 'B'] : ['A'];
  if ([0, 3.2, 3.6, 4].indexOf(g) >= 0 || [14, 15].indexOf(i.credits) >= 0) return ['B', 'N'];
  return ['N'];
}
const Q2_CFG = svg({
  w: 540, h: 420, tieuDe: 'CFG of checkScholarship (L = line number)',
  nut: [
    { id: 'st', x: 230, y: 40, hinh: 'dau', nhan: '' },
    { id: 'd2', x: 230, y: 92, hinh: 'thoi', nhan: 'L2', rong: 90 },
    { id: 'r3', x: 420, y: 92, hinh: 'chu', nhan: 'L3 return Invalid GPA' },
    { id: 'd4', x: 230, y: 178, hinh: 'thoi', nhan: 'L4', rong: 90 },
    { id: 'r5', x: 420, y: 178, hinh: 'chu', nhan: 'L5 return Full' },
    { id: 'd6', x: 230, y: 264, hinh: 'thoi', nhan: 'L6', rong: 90 },
    { id: 'r7', x: 420, y: 264, hinh: 'chu', nhan: 'L7 return Half' },
    { id: 'r8', x: 230, y: 340, hinh: 'chu', nhan: 'L8 return None' },
    { id: 'end', x: 230, y: 395, hinh: 'cuoi', nhan: 'end', r: 15 },
  ],
  canh: [
    { tu: 'st', den: 'd2' },
    { tu: 'd2', den: 'r3', nhan: 'T' }, { tu: 'd2', den: 'd4', nhan: 'F' },
    { tu: 'd4', den: 'r5', nhan: 'T' }, { tu: 'd4', den: 'd6', nhan: 'F' },
    { tu: 'd6', den: 'r7', nhan: 'T' }, { tu: 'd6', den: 'r8', nhan: 'F' },
    { tu: 'r8', den: 'end' },
    { tu: 'r3', den: 'end', qua: [[515, 92], [515, 395]] },
    { tu: 'r5', den: 'end', qua: [[515, 178], [515, 395]] },
    { tu: 'r7', den: 'end', qua: [[515, 264], [515, 395]] },
  ],
});
const GIAI_UTCID = `// Question 2 — the minimum is 6 test cases.
//  · line 2 (A || B): A alone true (-0.1), B alone true (4.1) + a valid baseline → 2 invalid tests.
//  · line 4 (A && B && C): (T,T,T)→T, then A=F, B=F, C=F each ALONE against it → 4 valid tests.
//  · line 6 (A && B) is reached only when line 4 is false; the same 4 tests give (T,T)→T [UTCID05], (F,·)→F [UTCID06],
//    (T,F)→F [UTCID04] — short-circuit masking makes a separate test unnecessary.
// UTCID05 exposes the defect: the SPEC gives no scholarship to a student with a violation, the code returns "Half Scholarship" → F.
const UTCIDS = [
  { id: 'UTCID01', input: { gpa: -0.1, credits: 20, hasViolation: false }, expected: 'Invalid GPA', type: 'A', status: 'P' },
  { id: 'UTCID02', input: { gpa: 4.1, credits: 20, hasViolation: false }, expected: 'Invalid GPA', type: 'A', status: 'P' },
  { id: 'UTCID03', input: { gpa: 3.8, credits: 20, hasViolation: false }, expected: 'Full Scholarship', type: 'N', status: 'P' },
  { id: 'UTCID04', input: { gpa: 3.8, credits: 10, hasViolation: false }, expected: 'None', type: 'N', status: 'P' },
  { id: 'UTCID05', input: { gpa: 3.8, credits: 20, hasViolation: true }, expected: 'None', type: 'N', status: 'F' },
  { id: 'UTCID06', input: { gpa: 3.0, credits: 20, hasViolation: false }, expected: 'None', type: 'N', status: 'P' },
];
`;

/* ═══════════════════════ Q3 — Gym Membership Fee ═══════════════════════ */
function q3HeThong(d) {
  const s = (k) => String(d[k] == null ? '' : d[k]).trim();
  const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const id = s('memberId');
  if (id === '') return 'Member ID is required.';
  if (['GM001', 'GM002', 'GM003'].indexOf(id) < 0) return 'Invalid Member ID.';
  const age = s('age');
  if (age === '') return 'Age is required.';
  if (!/^\d+$/.test(age) || Number(age) < 16 || Number(age) > 80) return 'Age must be an integer from 16 to 80.';
  const plan = s('plan');
  if (plan === '') return 'Plan is required.';
  const pt = s('ptSessions');
  if (pt === '') return 'PT Sessions is required.';
  if (!/^\d+$/.test(pt) || Number(pt) > 20) return 'PT Sessions must be an integer from 0 to 20.';
  const card = s('studentCard');
  if (card === '') return 'Student Card is required.';
  const price = { Monthly: 600000, Quarterly: 1620000, Yearly: 5760000 }[plan];
  const a = Number(age), n = Number(pt);
  const disc = a >= 60 ? 30 : card === 'Yes' && a <= 25 ? 20 : 0;
  const total = (price * (100 - disc)) / 100 + n * (n >= 10 ? 200000 : 250000);
  return 'Total Fee: ' + fmt(total) + ' VND.';
}
function q3Nhan(d, out) {
  const s = (k) => String(d[k] == null ? '' : d[k]).trim();
  const t = [];
  const msg = {
    'Member ID is required.': 'V_ID_EMPTY', 'Invalid Member ID.': 'V_ID_INVALID', 'Age is required.': 'V_AGE_EMPTY',
    'Plan is required.': 'V_PLAN', 'PT Sessions is required.': 'V_PT_EMPTY', 'Student Card is required.': 'V_CARD',
  };
  if (msg[out]) t.push(msg[out]);
  if (out === 'Age must be an integer from 16 to 80.') {
    const x = s('age');
    if (!/^-?\d+(\.\d+)?$/.test(x)) t.push('V_AGE_TEXT');
    else if (!/^-?\d+$/.test(x)) t.push('V_AGE_DECIMAL');
    else if (Number(x) < 16) { t.push('V_AGE_LOW'); if (x === '15') t.push('B_A15'); }
    else { t.push('V_AGE_HIGH'); if (x === '81') t.push('B_A81'); }
  }
  if (out === 'PT Sessions must be an integer from 0 to 20.') {
    const x = s('ptSessions');
    if (/^-\d+$/.test(x)) t.push('V_PT_NEG');
    else if (/^\d+$/.test(x)) { t.push('V_PT_HIGH'); if (x === '21') t.push('B_PT21'); }
    else t.push('V_PT_TEXT');
  }
  if (out.indexOf('Total Fee') === 0) {
    const a = Number(s('age')), n = Number(s('ptSessions')), card = s('studentCard'), plan = s('plan');
    if (a >= 60) { t.push('R3'); if (card === 'Yes') t.push('R3Y'); }
    else if (card === 'Yes') t.push(a <= 25 ? 'R1' : 'R2');
    else t.push('R4');
    t.push(n === 0 ? 'R5' : n <= 9 ? 'R6' : 'R7');
    t.push({ Monthly: 'E_MONTHLY', Quarterly: 'E_QUARTERLY', Yearly: 'E_YEARLY' }[plan]);
    if (a === 16) t.push('B_A16');
    if (a === 25 && card === 'Yes') t.push('B_A25');
    if (a === 26 && card === 'Yes') t.push('B_A26');
    if (a === 59) t.push('B_A59');
    if (a === 60) t.push('B_A60');
    if (a === 80) t.push('B_A80');
    if (n === 9) t.push('B_PT9');
    if (n === 10) t.push('B_PT10');
    if (n === 20) t.push('B_PT20');
  }
  return t;
}
const MAU_Q3 = bangHtml(['Age', 'Student card', 'Plan', 'PT sessions', 'Calculation', 'Result'], [
  ['20', 'Yes', 'Monthly', '0', '600,000 × 80%', '480,000'],
  ['30', 'Yes', 'Monthly', '0', 'no discount', '600,000'],
  ['65', 'No', 'Quarterly', '0', '1,620,000 × 70%', '1,134,000'],
  ['30', 'No', 'Monthly', '5', '600,000 + 5 × 250,000', '1,850,000'],
  ['30', 'No', 'Monthly', '12', '600,000 + 12 × 200,000', '3,000,000'],
  ['22', 'Yes', 'Yearly', '0', '5,760,000 × 80%', '4,608,000'],
]);
const TC = (id, description, data, expected) => ({ id, description, data, expected });
const D = (memberId, age, plan, ptSessions, studentCard) => ({ memberId, age, plan, ptSessions, studentCard });
const Q3_DS = [
  TC('A01', 'Verify that an empty Member ID is rejected', D('', '30', 'Monthly', '0', 'No'), 'Member ID is required.'),
  TC('A02', 'Verify that a Member ID not in the system is rejected', D('GM999', '30', 'Monthly', '0', 'No'), 'Invalid Member ID.'),
  TC('A03', 'Verify that an empty Age is rejected', D('GM001', '', 'Monthly', '0', 'No'), 'Age is required.'),
  TC('A04', 'Verify that a non-numeric Age is rejected', D('GM001', 'abc', 'Monthly', '0', 'No'), 'Age must be an integer from 16 to 80.'),
  TC('A05', 'Verify that Age = 15 is rejected (invalid boundary)', D('GM001', '15', 'Monthly', '0', 'No'), 'Age must be an integer from 16 to 80.'),
  TC('A06', 'Verify that Age = 81 is rejected (invalid boundary)', D('GM001', '81', 'Monthly', '0', 'No'), 'Age must be an integer from 16 to 80.'),
  TC('A07', 'Verify that a decimal Age is rejected', D('GM001', '20.5', 'Monthly', '0', 'No'), 'Age must be an integer from 16 to 80.'),
  TC('A08', 'Verify that Plan must be selected', D('GM001', '30', '', '0', 'No'), 'Plan is required.'),
  TC('A09', 'Verify that an empty PT Sessions is rejected', D('GM001', '30', 'Monthly', '', 'No'), 'PT Sessions is required.'),
  TC('A10', 'Verify that PT Sessions = -1 is rejected', D('GM001', '30', 'Monthly', '-1', 'No'), 'PT Sessions must be an integer from 0 to 20.'),
  TC('A11', 'Verify that PT Sessions = 21 is rejected (invalid boundary)', D('GM001', '30', 'Monthly', '21', 'No'), 'PT Sessions must be an integer from 0 to 20.'),
  TC('A12', 'Verify that Student Card must be selected', D('GM001', '30', 'Monthly', '0', ''), 'Student Card is required.'),
  TC('B01', 'R1 — student card and age ≤ 25: 20% off', D('GM001', '20', 'Monthly', '0', 'Yes'), 'Total Fee: 480,000 VND.'),
  TC('B02', 'R2 — student card but age 26–59: no discount', D('GM001', '30', 'Monthly', '0', 'Yes'), 'Total Fee: 600,000 VND.'),
  TC('B03', 'R3 — age ≥ 60 with a student card: only the 30% senior discount applies', D('GM002', '65', 'Quarterly', '0', 'Yes'), 'Total Fee: 1,134,000 VND.'),
  TC('B04', 'R3 — age ≥ 60 without a student card: 30% off', D('GM002', '65', 'Yearly', '0', 'No'), 'Total Fee: 4,032,000 VND.'),
  TC('B05', 'R4 — no student card, age < 60: no discount', D('GM003', '20', 'Monthly', '0', 'No'), 'Total Fee: 600,000 VND.'),
  TC('B06', 'R6 — 5 PT sessions at 250,000', D('GM003', '30', 'Monthly', '5', 'No'), 'Total Fee: 1,850,000 VND.'),
  TC('B07', 'R7 — 12 PT sessions at 200,000', D('GM003', '30', 'Monthly', '12', 'No'), 'Total Fee: 3,000,000 VND.'),
  TC('B08', 'Yearly plan with the student discount', D('GM001', '22', 'Yearly', '0', 'Yes'), 'Total Fee: 4,608,000 VND.'),
  TC('C01', 'Boundary — youngest valid age 16', D('GM001', '16', 'Monthly', '0', 'No'), 'Total Fee: 600,000 VND.'),
  TC('C02', 'Boundary — age 25 still gets the student discount', D('GM001', '25', 'Monthly', '0', 'Yes'), 'Total Fee: 480,000 VND.'),
  TC('C03', 'Boundary — age 26 loses the student discount', D('GM001', '26', 'Monthly', '0', 'Yes'), 'Total Fee: 600,000 VND.'),
  TC('C04', 'Boundary — age 59 has no senior discount', D('GM002', '59', 'Monthly', '0', 'No'), 'Total Fee: 600,000 VND.'),
  TC('C05', 'Boundary — age 60 gets the senior discount', D('GM002', '60', 'Monthly', '0', 'No'), 'Total Fee: 420,000 VND.'),
  TC('C06', 'Boundary — oldest valid age 80', D('GM002', '80', 'Monthly', '0', 'No'), 'Total Fee: 420,000 VND.'),
  TC('C07', 'Boundary — 9 PT sessions still at 250,000', D('GM003', '30', 'Monthly', '9', 'No'), 'Total Fee: 2,850,000 VND.'),
  TC('C08', 'Boundary — 10 PT sessions switch to 200,000 (cheaper than 9!)', D('GM003', '30', 'Monthly', '10', 'No'), 'Total Fee: 2,600,000 VND.'),
  TC('C09', 'Boundary — 20 PT sessions is the maximum', D('GM003', '30', 'Monthly', '20', 'No'), 'Total Fee: 4,600,000 VND.'),
];
const buoc = (d) => [
  `Enter Member ID = ${d.memberId === '' ? '(empty)' : d.memberId}`,
  `Enter Age = ${d.age === '' ? '(empty)' : d.age}`,
  `Select Plan = ${d.plan === '' ? '(not selected)' : d.plan}`,
  `Enter PT Sessions = ${d.ptSessions === '' ? '(empty)' : d.ptSessions}`,
  `Select Student Card = ${d.studentCard === '' ? '(not selected)' : d.studentCard}`,
  'Click Calculate Fee',
];

export default deThiPE({
  so: 3,
  slug: 'swt301-11-pe-3-attendance-scholarship-gym',
  ten: 'PE Practice 3 — ExamEligibility · checkScholarship · Gym Fee',
  tieuDe: 'SWT301 PE Practice 3 — ExamEligibility review, checkScholarship MC/DC, Gym Membership Fee',
  phu: {
    en: 'ExamEligibility review · checkScholarship unit tests (3-condition AND, short-circuit MC/DC) · Gym Membership Fee black-box · 85 minutes · 10 marks',
    vi: 'Review ExamEligibility · unit test checkScholarship (AND ba vế, MC/DC có ngắn mạch) · test hộp đen Gym Membership Fee · 85 phút · 10 điểm',
  },
  moTaNgan: 'PE luyện định dạng SU26: review ExamEligibility (== so chuỗi, static rò trạng thái, chia nguyên hai lần…) + sửa mã chạy thật, MC/DC AND ba vế với ngắn mạch cho checkScholarship (tối thiểu 6 ca, lỗi đặc tả lộ trong bộ tối thiểu), test hộp đen Gym Membership Fee với bảng quyết định rút gọn và BVA nhiều mốc.',
  q1: {
    tenLop: 'ExamEligibility.canTakeFinalExam',
    hamFix: 'canTakeFinalExam',
    java: Q1_JAVA,
    moTa: {
      en: `<p><b>Problem description — final-exam eligibility.</b> <code>canTakeFinalExam(statuses, feePaid)</code> decides whether a student may sit the final exam:</p>
<ul><li><code>statuses</code> holds one status per class slot: exactly <code>"PRESENT"</code>, <code>"ABSENT"</code> or <code>"LATE"</code>. A null or empty list, or any other value (including null items), is invalid ⇒ <code>IllegalArgumentException</code>.</li>
<li>Absence rate = (ABSENT + 0.5 × LATE) ÷ number of slots × 100.</li>
<li>The student may take the exam when the absence rate is <b>at most 20%</b> <b>and</b> the fee is paid.</li>
<li>The method is called once per student; one call must not influence the next.</li></ul>`,
      vi: `<p><b>Mô tả bài toán — điều kiện dự thi cuối kỳ.</b> <code>canTakeFinalExam(statuses, feePaid)</code> quyết định sinh viên có được thi cuối kỳ:</p>
<ul><li><code>statuses</code> có một trạng thái cho mỗi buổi học: đúng <code>"PRESENT"</code>, <code>"ABSENT"</code> hoặc <code>"LATE"</code>. Danh sách null hoặc rỗng, hay bất kỳ giá trị nào khác (kể cả phần tử null), là dữ liệu sai ⇒ <code>IllegalArgumentException</code>.</li>
<li>Tỉ lệ vắng = (ABSENT + 0,5 × LATE) ÷ số buổi × 100.</li>
<li>Sinh viên được thi khi tỉ lệ vắng <b>không quá 20%</b> <b>và</b> đã đóng học phí.</li>
<li>Phương thức được gọi một lần cho mỗi sinh viên; lần gọi này không được ảnh hưởng lần sau.</li></ul>`,
    },
    khoa: Q1_KHOA, sai: Q1_SAI,
    mauIssue: { line: 16, type: 'COMPILE', severity: 'High', description: 'Missing semicolon after return false.', fix: 'return false;' },
    giaiIssues: GIAI_ISSUES,
    fixDau: FIX_DAU, fixGiai: FIX_GIAI,
    yeuCauFix: [
      { en: 'In <code>answers/q1-fixed.js</code> fix the twin <code>canTakeFinalExam(statuses, feePaid)</code> so that it satisfies the specification — including “one call must not influence the next”.', vi: 'Trong <code>answers/q1-fixed.js</code> sửa bản sinh đôi <code>canTakeFinalExam(statuses, feePaid)</code> cho đúng đặc tả — kể cả “lần gọi này không ảnh hưởng lần sau”.' },
      { en: 'Invalid input throws <code>IllegalArgumentException</code>.', vi: 'Dữ liệu sai ném <code>IllegalArgumentException</code>.' },
    ],
    viDuFix: { en: "canTakeFinalExam(['ABSENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT'], true) → true   (exactly 20%)", vi: "canTakeFinalExam(['ABSENT', 'PRESENT', 'PRESENT', 'PRESENT', 'PRESENT'], true) → true   (đúng 20%)" },
    kiemFix: KIEM_FIX,
  },
  q2: {
    ham: 'checkScholarship',
    java: Q2_JAVA,
    code: Q2_DO,
    cfg: Q2_CFG,
    thamSo: ['gpa', 'credits', 'hasViolation'],
    kieuInput: '{ gpa, credits, hasViolation }',
    spec: q2Spec, loai: q2Loai, mcdc: ['D1', 'D2', 'D3'], toiThieu: 6,
    moTa: {
      en: `<p><b>Method description.</b> <code>checkScholarship</code> decides the scholarship of a student for the next term. A GPA outside <b>0.0–4.0</b> returns <code>"Invalid GPA"</code>. A student with a <b>disciplinary violation gets no scholarship</b> (<code>"None"</code>). Otherwise: GPA ≥ 3.6 with at least 15 credits this term → <code>"Full Scholarship"</code>; GPA ≥ 3.2 with at least 15 credits → <code>"Half Scholarship"</code>; else <code>"None"</code>. The caller guarantees credits ≥ 0.</p>`,
      vi: `<p><b>Mô tả phương thức.</b> <code>checkScholarship</code> quyết định học bổng kỳ sau. GPA ngoài <b>0.0–4.0</b> trả <code>"Invalid GPA"</code>. Sinh viên <b>vi phạm kỷ luật không nhận học bổng nào</b> (<code>"None"</code>). Ngược lại: GPA ≥ 3.6 và ít nhất 15 tín chỉ trong kỳ → <code>"Full Scholarship"</code>; GPA ≥ 3.2 và ít nhất 15 tín chỉ → <code>"Half Scholarship"</code>; còn lại <code>"None"</code>. Bên gọi đảm bảo credits ≥ 0.</p>`,
    },
    yeuCau: [
      { en: 'Choose the <b>minimum</b> number of test cases for 100% statement coverage, 100% decision coverage and MC/DC of ALL THREE compound conditions (lines 2, 4 and 6).', vi: 'Chọn số ca <b>tối thiểu</b> cho 100% statement, 100% decision và MC/DC cho CẢ BA điều kiện ghép (dòng 2, 4 và 6).' },
      { en: 'Short-circuit: a condition that is not evaluated may differ freely inside an independence pair (masking MC/DC — the rule accepted for Java/C/JS).', vi: 'Ngắn mạch: điều kiện không được đánh giá thì được phép khác nhau trong cặp độc lập (MC/DC có che — luật được chấp nhận cho Java/C/JS).' },
    ],
    yeuCau2: [
      { en: '<code>expected</code> = the SPECIFICATION (read the violation rule carefully). <code>status</code> = <code>"P"</code> when the code returns it, else <code>"F"</code>.', vi: '<code>expected</code> = theo ĐẶC TẢ (đọc kỹ luật vi phạm). <code>status</code> = <code>"P"</code> khi mã trả đúng, ngược lại <code>"F"</code>.' },
      { en: '<code>type</code>: <code>A</code> for an invalid GPA, <code>B</code> or <code>N</code> on the edges (GPA 0, 3.2, 3.6, 4.0 or 14/15 credits), otherwise <code>N</code>.', vi: '<code>type</code>: <code>A</code> cho GPA sai, <code>B</code> hay <code>N</code> ở các mép (GPA 0, 3.2, 3.6, 4.0 hoặc 14/15 tín chỉ), còn lại <code>N</code>.' },
    ],
    mauUtcid: { id: 'UTCID01', input: { gpa: -0.1, credits: 20, hasViolation: false }, expected: 'Invalid GPA', type: 'A', status: 'P' },
    giaiUtcid: GIAI_UTCID,
  },
  q3: {
    ten: 'Gym Membership Fee',
    moTa: {
      en: `<p><b>Function description.</b> A gym computes the fee of a new membership.</p>
<p><b>Fields:</b> Member ID — required; IDs in the system: <code>GM001</code>, <code>GM002</code>, <code>GM003</code>. Age — required, an <b>integer 16–80</b>. Plan — required (Monthly / Quarterly / Yearly). PT Sessions (personal-trainer sessions) — required, an <b>integer 0–20</b>. Student Card — required (Yes / No).</p>
<p>When the user clicks <b>Calculate Fee</b> the system performs these steps <b>in order</b> and stops at the first error:</p>
<ol><li>Member ID: empty → <code>Member ID is required.</code>; not in the system → <code>Invalid Member ID.</code></li>
<li>Age: empty → <code>Age is required.</code>; not an integer 16–80 → <code>Age must be an integer from 16 to 80.</code></li>
<li>Plan: not selected → <code>Plan is required.</code></li>
<li>PT Sessions: empty → <code>PT Sessions is required.</code>; not an integer 0–20 → <code>PT Sessions must be an integer from 0 to 20.</code></li>
<li>Student Card: not selected → <code>Student Card is required.</code></li>
<li>Calculate the fee:
<ul><li>Plan price: Monthly 600,000 · Quarterly 1,620,000 · Yearly 5,760,000 VND.</li>
<li>Discount on the plan price — <b>only one applies</b>: age ≥ 60 → 30%; otherwise a student card with age ≤ 25 → 20%; otherwise none.</li>
<li>PT sessions: 250,000 VND each; when 10 or more sessions are bought, <b>every</b> session costs 200,000.</li>
<li>Total = discounted plan price + PT sessions.</li></ul></li>
<li>Display <code>Total Fee: [x] VND.</code> with thousands separators.</li></ol>
<p><b>Calculation examples</b></p>${MAU_Q3}`,
      vi: `<p><b>Mô tả chức năng.</b> Phòng tập tính phí đăng ký hội viên mới.</p>
<p><b>Các trường:</b> Member ID — bắt buộc; mã có trong hệ thống: <code>GM001</code>, <code>GM002</code>, <code>GM003</code>. Age — bắt buộc, <b>số nguyên 16–80</b>. Plan — bắt buộc (Monthly / Quarterly / Yearly). PT Sessions (số buổi huấn luyện viên riêng) — bắt buộc, <b>số nguyên 0–20</b>. Student Card — bắt buộc (Yes / No).</p>
<p>Khi bấm <b>Calculate Fee</b> hệ thống làm các bước <b>theo thứ tự</b> và dừng ở lỗi đầu tiên:</p>
<ol><li>Member ID: trống → <code>Member ID is required.</code>; không có trong hệ thống → <code>Invalid Member ID.</code></li>
<li>Age: trống → <code>Age is required.</code>; không phải số nguyên 16–80 → <code>Age must be an integer from 16 to 80.</code></li>
<li>Plan: chưa chọn → <code>Plan is required.</code></li>
<li>PT Sessions: trống → <code>PT Sessions is required.</code>; không phải số nguyên 0–20 → <code>PT Sessions must be an integer from 0 to 20.</code></li>
<li>Student Card: chưa chọn → <code>Student Card is required.</code></li>
<li>Tính phí:
<ul><li>Giá gói: Monthly 600.000 · Quarterly 1.620.000 · Yearly 5.760.000 đ.</li>
<li>Giảm giá trên giá gói — <b>chỉ áp một mức</b>: tuổi ≥ 60 → 30%; nếu không, có thẻ sinh viên và tuổi ≤ 25 → 20%; còn lại không giảm.</li>
<li>Buổi PT: 250.000 đ/buổi; mua từ 10 buổi trở lên thì <b>mọi</b> buổi giá 200.000.</li>
<li>Tổng = giá gói sau giảm + tiền buổi PT.</li></ul></li>
<li>Hiển thị <code>Total Fee: [x] VND.</code> có dấu phân cách hàng nghìn.</li></ol>
<p><b>Ví dụ tính</b></p>${MAU_Q3}`,
    },
    wireframe: `+----------------------------------------------------------------+
|                     GYM MEMBERSHIP FEE                         |
+----------------------------------------------------------------+
|  Member ID       [ e.g. GM001                              ]   |
|  Age             [ 16 - 80                                 ]   |
|  Plan            [ -- Select plan --                     v ]   |  Monthly / Quarterly / Yearly
|  PT Sessions     [ 0 - 20                                  ]   |
|  Student Card    [ -- Select --                          v ]   |  Yes / No
|                                                                |
|                       [ Calculate Fee ]                        |
|  Total Fee: 480,000 VND.                                       |
+----------------------------------------------------------------+`,
    heThong: q3HeThong, nhan: q3Nhan,
    truongData: ['memberId', 'age', 'plan', 'ptSessions', 'studentCard'],
    dataMoTa: { en: '{ memberId, age, plan, ptSessions, studentCard } — strings as typed/selected ("" = empty / not selected)', vi: '{ memberId, age, plan, ptSessions, studentCard } — chuỗi như khi gõ/chọn ("" = để trống / chưa chọn)' },
    viDuKyVong: 'Total Fee: 480,000 VND.',
    precondition: 'User is on the Gym Membership Fee screen; members GM001–GM003 exist',
    buoc,
    ds: Q3_DS,
    toiDa: 50,
    giaDinh: 'Assumptions: validation stops at the first error; the senior discount wins over the student discount (only one applies).',
    anMa: ['senior WITH a student card (only 30% applies)', 'PT Sessions = 21', 'Age = 81'],
    khoiA: {
      yeuCau: [
        { en: 'One test case for EVERY message, and for each different reason behind a shared message (age: text, decimal, too low, too high; PT: negative, too high).', vi: 'Một ca cho MỖI thông báo, và cho từng lý do khác nhau của cùng một thông báo (tuổi: chữ, thập phân, quá nhỏ, quá lớn; PT: âm, quá lớn).' },
      ],
      can: [
        { ma: 'V_ID_EMPTY', ten: 'empty Member ID' }, { ma: 'V_ID_INVALID', ten: 'Member ID not in the system' },
        { ma: 'V_AGE_EMPTY', ten: 'empty Age' }, { ma: 'V_AGE_TEXT', ten: 'non-numeric Age' }, { ma: 'V_AGE_DECIMAL', ten: 'decimal Age' },
        { ma: 'V_AGE_LOW', ten: 'Age below 16' }, { ma: 'V_AGE_HIGH', ten: 'Age above 80' }, { ma: 'V_PLAN', ten: 'Plan not selected' },
        { ma: 'V_PT_EMPTY', ten: 'empty PT Sessions' }, { ma: 'V_PT_NEG', ten: 'negative PT Sessions' }, { ma: 'V_PT_HIGH', ten: 'PT Sessions above 20' },
        { ma: 'V_CARD', ten: 'Student Card not selected' },
      ],
    },
    khoiB: {
      yeuCau: [
        { en: 'Reduced decision table for the discount: R1 card + age ≤ 25 · R2 card + age 26–59 · R3 age ≥ 60 (card does not matter — test it WITH a card too) · R4 no card, age &lt; 60.', vi: 'Bảng quyết định rút gọn cho giảm giá: R1 có thẻ + tuổi ≤ 25 · R2 có thẻ + tuổi 26–59 · R3 tuổi ≥ 60 (thẻ không quan trọng — test cả khi CÓ thẻ) · R4 không thẻ, tuổi &lt; 60.' },
        { en: 'PT rules R5 (0 sessions), R6 (1–9), R7 (10–20) and every plan (Monthly, Quarterly, Yearly).', vi: 'Luật PT R5 (0 buổi), R6 (1–9), R7 (10–20) và mọi gói (Monthly, Quarterly, Yearly).' },
      ],
      can: [
        { ma: 'R1', ten: 'R1 student card, age ≤ 25 (20%)' }, { ma: 'R2', ten: 'R2 student card, age 26–59 (no discount)' }, { ma: 'R3', ten: 'R3 age ≥ 60 (30%)' },
        { ma: 'R3Y', ten: 'R3 senior WITH a student card (only 30% applies)' }, { ma: 'R4', ten: 'R4 no card, age < 60 (no discount)' },
        { ma: 'R5', ten: 'R5 no PT session' }, { ma: 'R6', ten: 'R6 1–9 PT sessions at 250,000' }, { ma: 'R7', ten: 'R7 10–20 PT sessions at 200,000' },
        { ma: 'E_MONTHLY', ten: 'Monthly plan' }, { ma: 'E_QUARTERLY', ten: 'Quarterly plan' }, { ma: 'E_YEARLY', ten: 'Yearly plan' },
      ],
    },
    khoiC: {
      yeuCau: [
        { en: 'Age 15 | 16, 25 | 26 (with a card), 59 | 60, 80 | 81; PT 9 | 10 and 20 | 21.', vi: 'Tuổi 15 | 16, 25 | 26 (có thẻ), 59 | 60, 80 | 81; PT 9 | 10 và 20 | 21.' },
      ],
      can: [
        { ma: 'B_A16', ten: 'Age = 16' }, { ma: 'B_A25', ten: 'Age = 25 with a student card' }, { ma: 'B_A26', ten: 'Age = 26 with a student card' },
        { ma: 'B_A59', ten: 'Age = 59' }, { ma: 'B_A60', ten: 'Age = 60' }, { ma: 'B_A80', ten: 'Age = 80' },
        { ma: 'B_PT9', ten: 'PT Sessions = 9' }, { ma: 'B_PT10', ten: 'PT Sessions = 10' }, { ma: 'B_PT20', ten: 'PT Sessions = 20' },
        { ma: 'B_A15', ten: 'Age = 15' }, { ma: 'B_A81', ten: 'Age = 81' }, { ma: 'B_PT21', ten: 'PT Sessions = 21' },
      ],
    },
  },
  boYeu: [
    { ten: 'Q2: thêm ca (T,T) riêng cho dòng 6 (7 ca)', tep: { 'answers/q2-utcid.js': GIAI_UTCID.replace('];', "  { id: 'UTCID07', input: { gpa: 3.4, credits: 20, hasViolation: false }, expected: 'Half Scholarship', type: 'N', status: 'P' },\n];") }, phaiTruot: ['Minimal set'] },
    { ten: 'Q2: expected chép từ mã (Half cho ca vi phạm)', tep: { 'answers/q2-utcid.js': GIAI_UTCID.replace("expected: 'None', type: 'N', status: 'F'", "expected: 'Half Scholarship', type: 'N', status: 'P'") }, phaiTruot: ['Every "expected" value comes from the SPECIFICATION'] },
    { ten: 'Q2: thiếu ca thiếu tín chỉ', tep: { 'answers/q2-utcid.js': GIAI_UTCID.replace(/\n  \{ id: 'UTCID04'[^\n]*/, '') }, phaiTruot: ['MC/DC for the compound decision on line 4'] },
    { ten: 'Q1.2: vẫn để lateCount ngoài hàm', tep: { 'answers/q1-fixed.js': FIX_GIAI.replace('let late = 0;', '').replace('function canTakeFinalExam', 'let late = 0;\nfunction canTakeFinalExam') }, phaiTruot: ['no state leaks between two calls'] },
    { ten: 'Q1.2: vẫn < 20', tep: { 'answers/q1-fixed.js': FIX_GIAI.replace('rate <= MAX_ABSENCE_PERCENT', 'rate < MAX_ABSENCE_PERCENT') } },
    { ten: 'Q3: không test người cao tuổi có thẻ', q3: (ds) => ds.filter((t) => t.id !== 'B03'), phaiTruot: ['senior WITH a student card'] },
    { ten: 'Q3: thiếu biên PT 9|10', q3: (ds) => ds.filter((t) => !['C07', 'C08'].includes(t.id)), phaiTruot: ['Boundary value — PT Sessions = 9', 'Boundary value — PT Sessions = 10'] },
  ],
  truDiem: [
    { en: 'Q2 with 7 tests: a separate (T,T) test for line 6 is redundant — the violation case already reaches line 6 with (T,T).', vi: 'Câu 2 viết 7 ca: ca (T,T) riêng cho dòng 6 là thừa — ca vi phạm đã đi tới dòng 6 với (T,T).' },
    { en: 'Q2: writing "Half Scholarship" as expected for a student with a violation (copied from the code).', vi: 'Câu 2: ghi "Half Scholarship" là mong đợi cho sinh viên vi phạm (chép từ mã).' },
    { en: 'Q1: reporting List.of as a compile error, or saying "== works because literals are interned" — it works only by accident.', vi: 'Câu 1: báo List.of là lỗi biên dịch, hoặc cho rằng "== chạy được vì literal được intern" — chỉ đúng do may mắn.' },
    { en: 'Q3: testing the senior discount only without a card — the conflict “card + age ≥ 60” is exactly where implementations go wrong (50% instead of 30%).', vi: 'Câu 3: chỉ test giảm giá người cao tuổi khi không có thẻ — tình huống “có thẻ + ≥ 60” mới là chỗ cài đặt hay sai (giảm 50% thay vì 30%).' },
  ],
  goiY: [
    'Q1: nhìn kỹ những thứ "trông vẫn chạy": == với String, biến static, chia nguyên (có HAI chỗ ở dòng 12), toán tử || / &&, dấu chấm phẩy, dữ liệu demo.',
    'Q2: AND ba vế cần 4 ca: (T,T,T) và mỗi vế sai MỘT MÌNH. Với ngắn mạch, vế sau không được đánh giá thì coi như "không quan tâm" trong cặp độc lập.',
    'Q2: dòng 6 chỉ chạy khi dòng 4 sai — tận dụng chính 4 ca của dòng 4: ca vi phạm cho (T,T), ca thiếu tín chỉ cho (T,F), ca GPA thấp (< 3.2) cho (F,·). Thêm 2 ca GPA sai ⇒ 6.',
    'Q3: giảm giá chỉ áp MỘT mức — người ≥ 60 có thẻ sinh viên vẫn chỉ 30%. Mua 10 buổi PT rẻ hơn 9 buổi: biên này phải có ca test.',
  ],
  loiHayGap: [
    'Bỏ qua cặp "vế không được đánh giá": cố tạo ca (F,T,T) cho dòng 4 bằng tay khiến bộ test dư một ca.',
    'Ghi status "P" cho ca vi phạm có GPA cao vì "mã chạy không lỗi" — mã trả Half Scholarship, đặc tả nói None ⇒ F.',
    'Câu 1 chỉ báo MỘT lỗi ở dòng 12 — có hai phép chia nguyên khác nhau (lateCount / 2 và ... / size()).',
    'Câu 3 ghi mong đợi cho 10 buổi PT bằng 600.000 + 2.500.000 (giá 250.000) — từ 10 buổi mọi buổi giá 200.000.',
  ],
  giaiThich: {
    en: `<h4>Question 1</h4><p>Line 9 compares references; line 4 + 10 keep late slots in a static field that leaks into the next student; line 12 has TWO integer divisions (late / 2, then ÷ size before × 100); line 13 uses <code>&lt;</code> instead of <code>&lt;=</code> and <code>||</code> instead of <code>&amp;&amp;</code>; line 16 misses a semicolon. Lines 12 (widening) and 20 (<code>List.of</code>) compile — reporting them as compile errors is a false claim.</p>
<h4>Question 2</h4><p>Line 4 is <code>A &amp;&amp; B &amp;&amp; C</code> ⇒ (T,T,T) plus each condition false alone: 4 valid tests. Line 6 needs (T,T), (T,F) and (F,·) — all three come from the same four tests thanks to short-circuit masking: the violation case reaches line 6 with (T,T), the low-credit case with (T,F), the GPA-3.0 case with (F,·). Two invalid GPAs for line 2 ⇒ <b>6</b>. The violation case is <b>F</b>: the spec says "None", the code says "Half Scholarship" (defect: line 6 forgets the violation rule).</p>
<pre>@ParameterizedTest
@CsvSource({ "-0.1,20,false,Invalid GPA", "4.1,20,false,Invalid GPA", "3.8,20,false,Full Scholarship",
             "3.8,10,false,None", "3.8,20,true,None", "3.0,20,false,None" })
void checkScholarship(double gpa, int credits, boolean violation, String expected) {
    assertEquals(expected, Scholarship.checkScholarship(gpa, credits, violation)); // row 5 fails → BUG on line 6
}</pre>
<h4>Question 3</h4><p>The discount rule has two conditions (card, age band with three values) but only four distinct outcomes, so the reduced decision table has four rules with one "don't care" (age ≥ 60). Test the don't-care BOTH ways — that is where "applied both discounts" bugs hide. BVA: 15|16, 25|26 with a card, 59|60, 80|81, PT 9|10 (10 sessions are cheaper than 9 — a real finding to report) and 20|21.</p>`,
    vi: `<h4>Câu 1</h4><p>Dòng 9 so tham chiếu; dòng 4 + 10 giữ số buổi muộn trong biến static rò sang sinh viên sau; dòng 12 có HAI phép chia nguyên (late / 2, rồi ÷ size trước khi × 100); dòng 13 dùng <code>&lt;</code> thay <code>&lt;=</code> và <code>||</code> thay <code>&amp;&amp;</code>; dòng 16 thiếu chấm phẩy. Dòng 12 (nới kiểu) và dòng 20 (<code>List.of</code>) vẫn biên dịch — báo chúng là lỗi biên dịch là khẳng định sai.</p>
<h4>Câu 2</h4><p>Dòng 4 là <code>A &amp;&amp; B &amp;&amp; C</code> ⇒ (T,T,T) và mỗi điều kiện sai một mình: 4 ca hợp lệ. Dòng 6 cần (T,T), (T,F), (F,·) — cả ba lấy từ chính 4 ca đó nhờ che do ngắn mạch. Hai GPA sai cho dòng 2 ⇒ <b>6</b> ca. Ca vi phạm là <b>F</b>: đặc tả nói "None", mã trả "Half Scholarship" (lỗi: dòng 6 quên luật vi phạm).</p>
<h4>Câu 3</h4><p>Luật giảm giá có hai điều kiện (thẻ, nhóm tuổi ba giá trị) nhưng chỉ bốn kết quả khác nhau, nên bảng quyết định rút gọn còn bốn luật với một ô "không quan tâm" (tuổi ≥ 60). Hãy test ô không quan tâm theo CẢ hai phía — lỗi "cộng dồn hai mức giảm" nấp ở đó. BVA: 15|16, 25|26 khi có thẻ, 59|60, 80|81, PT 9|10 (10 buổi rẻ hơn 9 — phát hiện đáng báo) và 20|21.</p>`,
  },
});
