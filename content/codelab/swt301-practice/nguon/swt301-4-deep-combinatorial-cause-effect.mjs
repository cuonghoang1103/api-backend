/**
 * SWT301 · DEEP LAB CHƯƠNG 4 — vượt syllabus: kiểm thử tổ hợp (pairwise có ràng buộc), đồ thị nhân–quả
 * (cause–effect graph ⇒ bảng quyết định), kiểm thử miền 2 chiều (điểm ON/OFF, ràng buộc thừa).
 */
import { doiDau, KHOA, svg, bangHtml, NOP_BAI, tn } from './_chung.mjs';
import { kiemTuy } from './_de.mjs';

/* ───────── A. Pairwise ───────── */
const YT = { browser: ['Chrome', 'Firefox', 'Safari', 'Edge'], os: ['Windows', 'macOS', 'Ubuntu'], language: ['EN', 'VI'], role: ['Student', 'Manager', 'Admin'] };
const HOP_LE = function (r) {
  if (r.browser === 'Safari' && r.os !== 'macOS') return false;
  if (r.browser === 'Edge' && r.os === 'Ubuntu') return false;
  return true;
};
const kA = (() => {
  const chung = `const YT = ${JSON.stringify(YT)}; const hopLe = ${HOP_LE.toString()};
    if (!Array.isArray(CONFIGS) || !CONFIGS.length) return 'CONFIGS must be a non-empty array';
    const K = Object.keys(YT);
    for (let i = 0; i < CONFIGS.length; i++) for (const k of K) if (YT[k].indexOf(CONFIGS[i][k]) < 0) return 'row #' + (i + 1) + ': ' + k + ' must be one of ' + YT[k].join(', ');
    const thieu = (a, b) => { const can = []; for (const x of YT[a]) for (const y of YT[b]) { const r = {}; r[a] = x; r[b] = y; const okRang = !((a === 'browser' && b === 'os') && !hopLe({ browser: x, os: y })); if (!okRang) continue; if (!CONFIGS.some((c) => c[a] === x && c[b] === y)) can.push(x + '+' + y); } return can; };`;
  const cap = (a, b) => kiemTuy({ en: `A — every valid ${a} × ${b} pair appears`, vi: `A — mọi cặp ${a} × ${b} hợp lệ đều xuất hiện` }, new Function(`${chung} const t = thieu('${a}', '${b}'); return t.length ? 'missing pairs: ' + t.slice(0, 6).join(', ') : 'OK';`), { nhom: 'f1' });
  return [
    kiemTuy({ en: 'A — every row respects the constraints (Safari only on macOS, no Edge on Ubuntu)', vi: 'A — mọi dòng tôn trọng ràng buộc (Safari chỉ trên macOS, không có Edge trên Ubuntu)' }, new Function(`${chung} const i = CONFIGS.findIndex((r) => !hopLe(r)); return i < 0 ? 'OK' : 'row #' + (i + 1) + ' is an impossible configuration';`), { nhom: 'f1' }),
    cap('browser', 'os'), cap('browser', 'language'), cap('browser', 'role'), cap('os', 'language'), cap('os', 'role'), cap('language', 'role'),
    kiemTuy({ en: 'A — at most 14 rows (the full product has 72; 13 is the minimum here)', vi: 'A — tối đa 14 dòng (tích đầy đủ 72; tối thiểu ở đây là 13)' }, new Function("return CONFIGS.length <= 14 ? 'OK' : CONFIGS.length + ' rows — pairwise should need at most 14';"), { nhom: 'f1' }),
    kiemTuy({ en: 'A — size of the full (unconstrained) product', vi: 'A — kích thước tích đầy đủ (chưa ràng buộc)' }, new Function("return FULL_PRODUCT === 72 ? 'OK' : 'not right: 4 × 3 × 2 × 3';"), { nhom: 'f1' }),
  ];
})();

/* ───────── B. Cause–effect graph ───────── */
const HIEU_UNG = function (k) {
  const [c1, c2, c3, c4] = k.split('').map((x) => x === 'T');
  const e = [];
  if (!c1) e.push('E3');
  if (c1 && !c2) e.push('E2');
  if (c1 && c2 && (c3 || c4)) e.push('E1');
  if (c1 && c2 && !c3 && !c4) e.push('E4');
  return e;
};
const TO_HOP = ['FTTT', 'TFTT', 'TTTF', 'TTFT', 'TTFF', 'TFFF', 'FFFF'];
const kB = [
  ...TO_HOP.map((k) => kiemTuy({ en: `B — effects for causes ${k}`, vi: `B — hiệu ứng cho nguyên nhân ${k}` }, new Function(`const f = ${HIEU_UNG.toString()}; if (!EFFECTS || !Array.isArray(EFFECTS['${k}'])) return 'EFFECTS["${k}"] must be an array such as ["E1"]'; const a = [...new Set(EFFECTS['${k}'].map(String))].sort().join(','); const m = f('${k}').sort().join(','); return a === m ? 'OK' : 'not right for ${k}';`), { nhom: 'f2' })),
  kiemTuy({ en: 'B — number of rules of the collapsed decision table derived from the graph', vi: 'B — số luật của bảng quyết định rút gọn suy ra từ đồ thị' }, new Function("return RULE_COUNT === 5 ? 'OK' : 'not right — collapse with don\\'t-care entries: an invalid ID decides everything by itself';"), { nhom: 'f2' }),
];

/* ───────── C. Domain testing ───────── */
const MIEN = function (p) { const [s, d] = p; return Number.isInteger(s) && Number.isInteger(d) && s >= 7 && s <= 20 && d >= 1 && d <= 3 && s + d <= 21; };
const BIEN = {
  B1: { ten: 'start = 7', tren: 'p[0] === 7', vuot: 'p[0] === 6 && p[1] >= 1 && p[1] <= 3 && p[0] + p[1] <= 21' },
  B3: { ten: 'duration = 1', tren: 'p[1] === 1', vuot: 'p[1] === 0 && p[0] >= 7 && p[0] <= 20' },
  B4: { ten: 'duration = 3', tren: 'p[1] === 3', vuot: 'p[1] === 4 && p[0] >= 7 && p[0] <= 20 && p[0] + p[1] <= 21' },
  B5: { ten: 'start + duration = 21', tren: 'p[0] + p[1] === 21', vuot: 'p[0] + p[1] === 22 && p[0] >= 7 && p[0] <= 20 && p[1] >= 1 && p[1] <= 3' },
};
const kC = [
  ...Object.entries(BIEN).flatMap(([k, b]) => [
    kiemTuy({ en: `C — ON point of ${b.ten}`, vi: `C — điểm ON của ${b.ten}` }, new Function(`const mien = ${MIEN.toString()}; const x = DOMAIN && DOMAIN.${k}; if (!x || !Array.isArray(x.on)) return 'DOMAIN.${k}.on must be [start, duration]'; const p = x.on; return mien(p) && (${b.tren}) ? 'OK' : 'the ON point must be VALID and lie exactly on ${b.ten}';`), { nhom: 'f3' }),
    kiemTuy({ en: `C — OFF point of ${b.ten}`, vi: `C — điểm OFF của ${b.ten}` }, new Function(`const mien = ${MIEN.toString()}; const x = DOMAIN && DOMAIN.${k}; if (!x || !Array.isArray(x.off)) return 'DOMAIN.${k}.off must be [start, duration]'; const p = x.off; if (mien(p)) return 'the OFF point must be INVALID'; return (${b.vuot}) ? 'OK' : 'the OFF point must be one step outside ${b.ten} and break ONLY that constraint';`), { nhom: 'f3' }),
  ]),
  kiemTuy({ en: 'C — the redundant constraint', vi: 'C — ràng buộc thừa' }, new Function("return String(REDUNDANT).replace(/\\s+/g, '') === 'start<=20' ? 'OK' : 'not right — which constraint can never be the ONLY one that a booking breaks?';"), { nhom: 'f3' }),
];

/* ───────── Sơ đồ ───────── */
const DO_THI = svg({
  w: 660, h: 330, tieuDe: 'Cause–effect graph — exam registration',
  nut: [
    { id: 'C1', x: 70, y: 60, hinh: 'tron', nhan: 'C1', r: 20 }, { id: 'C2', x: 70, y: 135, hinh: 'tron', nhan: 'C2', r: 20 },
    { id: 'C3', x: 70, y: 210, hinh: 'tron', nhan: 'C3', r: 20 }, { id: 'C4', x: 70, y: 285, hinh: 'tron', nhan: 'C4', r: 20 },
    { id: 'or', x: 240, y: 248, hinh: 'thoi', nhan: 'OR', rong: 60, cao: 34 },
    { id: 'and1', x: 400, y: 170, hinh: 'thoi', nhan: 'AND', rong: 64, cao: 34 },
    { id: 'and2', x: 300, y: 100, hinh: 'thoi', nhan: 'AND', rong: 64, cao: 34 },
    { id: 'and3', x: 400, y: 290, hinh: 'thoi', nhan: 'AND', rong: 64, cao: 34 },
    { id: 'E1', x: 590, y: 170, hinh: 'tron', nhan: 'E1', r: 20, mau: '#dcfce7' }, { id: 'E2', x: 590, y: 100, hinh: 'tron', nhan: 'E2', r: 20, mau: '#fef3c7' },
    { id: 'E3', x: 590, y: 35, hinh: 'tron', nhan: 'E3', r: 20, mau: '#fee2e2' }, { id: 'E4', x: 590, y: 290, hinh: 'tron', nhan: 'E4', r: 20, mau: '#fee2e2' },
  ],
  canh: [
    { tu: 'C1', den: 'E3', nhan: 'NOT' },
    { tu: 'C1', den: 'and2' }, { tu: 'C2', den: 'and2', nhan: 'NOT' }, { tu: 'and2', den: 'E2' },
    { tu: 'C3', den: 'or' }, { tu: 'C4', den: 'or' },
    { tu: 'C1', den: 'and1' }, { tu: 'C2', den: 'and1' }, { tu: 'or', den: 'and1' }, { tu: 'and1', den: 'E1' },
    { tu: 'or', den: 'and3', nhan: 'NOT' }, { tu: 'C2', den: 'and3', cong: -40 }, { tu: 'and3', den: 'E4' },
  ],
  chu: [{ x: 330, y: 322, nhan: 'and3 also takes C1 (omitted for clarity): E4 = C1 AND C2 AND NOT(C3 OR C4)', co: 11 }],
});
const LEGEND = bangHtml(['Cause', 'Meaning', 'Effect', 'Meaning'], [
  ['C1', 'Student ID is valid', 'E1', 'Registered for the exam'],
  ['C2', 'Tuition fee is paid', 'E2', 'Message “Please pay the tuition fee”'],
  ['C3', 'Absence rate ≤ 20%', 'E3', 'Message “Invalid student ID”'],
  ['C4', 'Approved retake request', 'E4', 'Message “Not eligible: too many absences”'],
]);
const MIEN_SVG = svg({
  w: 520, h: 300, tieuDe: 'Valid domain of (start hour, duration) — integer points',
  nut: [
    { id: 'a', x: 70, y: 250, hinh: 'tron', nhan: '7,1', r: 15 }, { id: 'b', x: 70, y: 70, hinh: 'tron', nhan: '7,3', r: 15 },
    { id: 'c', x: 390, y: 70, hinh: 'tron', nhan: '18,3', r: 17 }, { id: 'd', x: 450, y: 160, hinh: 'tron', nhan: '19,2', r: 17 },
    { id: 'e', x: 480, y: 250, hinh: 'tron', nhan: '20,1', r: 17 },
  ],
  canh: [
    { tu: 'a', den: 'b', nhan: 'B1 start = 7' }, { tu: 'b', den: 'c', nhan: 'B4 duration = 3' },
    { tu: 'c', den: 'd', nhan: 'B5' }, { tu: 'd', den: 'e', nhan: 'start+dur = 21' }, { tu: 'e', den: 'a', nhan: 'B3 duration = 1' },
  ],
  chu: [{ x: 250, y: 170, nhan: 'valid bookings', co: 13, dam: true }],
});

const BAN_IN = {
  tieuDe: 'Deep Lab 4 — Combinatorial, Cause–Effect and Domain Testing',
  phu: { en: 'Beyond the syllabus · pairwise with constraints · cause–effect graph · 2-D domain boundaries · 10 marks', vi: 'Vượt syllabus · pairwise có ràng buộc · đồ thị nhân–quả · biên miền 2 chiều · 10 điểm' },
  moTa: {
    en: '<p>Three techniques that professional testers use when EP/BVA/decision tables become too large or too one-dimensional. They appear in the ISTQB Advanced Test Analyst syllabus and in every serious test-design interview. Each part is a real situation from the LabBook project.</p>',
    vi: '<p>Ba kỹ thuật tester chuyên nghiệp dùng khi EP/BVA/bảng quyết định quá lớn hoặc chỉ một chiều. Chúng nằm trong syllabus ISTQB Advanced Test Analyst và mọi buổi phỏng vấn thiết kế test nghiêm túc. Mỗi phần là một tình huống thật của dự án LabBook.</p>',
  },
  chucNangChinh: [
    { en: 'A. Pairwise configuration testing of the LabBook web client with constraints.', vi: 'A. Kiểm thử cấu hình pairwise cho web client LabBook có ràng buộc.' },
    { en: 'B. Cause–effect graph → effects → collapsed decision table.', vi: 'B. Đồ thị nhân–quả → hiệu ứng → bảng quyết định rút gọn.' },
    { en: 'C. Domain testing of a two-variable rule: ON/OFF points, redundant constraint.', vi: 'C. Kiểm thử miền của luật hai biến: điểm ON/OFF, ràng buộc thừa.' },
  ],
  yeuCauChung: [
    { en: 'Answers are data structures; the grader checks properties, so any correct design is accepted.', vi: 'Câu trả lời là cấu trúc dữ liệu; máy chấm kiểm tính chất, nên mọi thiết kế đúng đều được nhận.' },
  ],
  cayThuMuc: `answers/
├── a-pairwise.js      ← const CONFIGS = [ { browser, os, language, role } ]; const FULL_PRODUCT
├── b-cause-effect.js  ← const EFFECTS = { 'TTTF': ['E1'], … }; const RULE_COUNT
└── c-domain.js        ← const DOMAIN = { B1: { on: [s, d], off: [s, d] }, B3, B4, B5 }; const REDUNDANT`,
  moHinh: {
    ten: 'Inputs of the three parts',
    truong: [
      ['browser · os · language · role', 'enum', { en: 'Chrome/Firefox/Safari/Edge · Windows/macOS/Ubuntu · EN/VI · Student/Manager/Admin', vi: 'Chrome/Firefox/Safari/Edge · Windows/macOS/Ubuntu · EN/VI · Student/Manager/Admin' }],
      ['C1…C4 / E1…E4', 'boolean', { en: 'causes and effects of the exam-registration rule (Part B)', vi: 'nguyên nhân và hiệu ứng của luật đăng ký thi (Phần B)' }],
      ['(start, duration)', 'integers', { en: '7 ≤ start ≤ 20 · 1 ≤ duration ≤ 3 · start + duration ≤ 21', vi: '7 ≤ start ≤ 20 · 1 ≤ duration ≤ 3 · start + duration ≤ 21' }],
    ],
  },
  chucNang: [
    {
      ten: { en: 'A. Pairwise configuration testing', vi: 'A. Kiểm thử cấu hình pairwise' }, diem: 4,
      moTa: {
        en: '<p>The LabBook web client must be checked on 4 browsers × 3 operating systems × 2 languages × 3 roles = 72 configurations. Testing all is too expensive; <b>pairwise</b> testing covers every pair of values of every two factors at least once. Constraints from the test lab: <b>Safari runs only on macOS</b>; <b>Edge is not installed on Ubuntu</b>. Impossible configurations must not appear, and their pairs need not be covered.</p>',
        vi: '<p>Web client LabBook phải kiểm trên 4 trình duyệt × 3 hệ điều hành × 2 ngôn ngữ × 3 vai trò = 72 cấu hình. Test hết quá tốn; kiểm thử <b>pairwise</b> phủ mọi cặp giá trị của mọi hai yếu tố ít nhất một lần. Ràng buộc của phòng test: <b>Safari chỉ chạy trên macOS</b>; <b>Ubuntu không cài Edge</b>. Cấu hình không thể có thì không được xuất hiện, và các cặp của nó không cần phủ.</p>',
      },
      yeuCau: [
        { en: 'Every valid pair of the 6 factor pairs appears in at least one row; no row breaks a constraint; at most 14 rows.', vi: 'Mọi cặp hợp lệ của 6 cặp yếu tố xuất hiện ít nhất một dòng; không dòng nào phạm ràng buộc; tối đa 14 dòng.' },
        { en: 'Why 13 at least? browser × role alone needs 12 rows, and only Chrome and Firefox can run on Ubuntu — think about Ubuntu × role.', vi: 'Vì sao tối thiểu 13? riêng browser × role cần 12 dòng, và chỉ Chrome, Firefox chạy được Ubuntu — nghĩ về Ubuntu × role.' },
      ],
      hook: ['pairwise testing', 'combinatorial testing', 'constraints'],
    },
    {
      ten: { en: 'B. Cause–effect graph', vi: 'B. Đồ thị nhân–quả' }, diem: 3,
      moTa: { en: `${DO_THI}${LEGEND}<p>The graph says: E3 = NOT C1 · E2 = C1 AND NOT C2 · E1 = C1 AND C2 AND (C3 OR C4) · E4 = C1 AND C2 AND NOT (C3 OR C4).</p>`, vi: `${DO_THI}${LEGEND}<p>Đồ thị nói: E3 = NOT C1 · E2 = C1 AND NOT C2 · E1 = C1 AND C2 AND (C3 OR C4) · E4 = C1 AND C2 AND NOT (C3 OR C4).</p>` },
      yeuCau: [
        { en: '<code>EFFECTS</code>: for each cause combination written C1C2C3C4 (e.g. <code>"TTFT"</code>), the list of effects that fire: FTTT, TFTT, TTTF, TTFT, TTFF, TFFF, FFFF.', vi: '<code>EFFECTS</code>: với mỗi tổ hợp C1C2C3C4 (vd <code>"TTFT"</code>), danh sách hiệu ứng xảy ra: FTTT, TFTT, TTTF, TTFT, TTFF, TFFF, FFFF.' },
        { en: '<code>RULE_COUNT</code>: the number of rules of the decision table after collapsing with “–”.', vi: '<code>RULE_COUNT</code>: số luật của bảng quyết định sau khi rút gọn bằng “–”.' },
      ],
      hook: ['cause–effect graphing', 'decision table'],
    },
    {
      ten: { en: 'C. Domain testing (two variables)', vi: 'C. Kiểm thử miền (hai biến)' }, diem: 3,
      moTa: { en: `<p>A booking is valid when <code>7 ≤ start ≤ 20</code>, <code>1 ≤ duration ≤ 3</code> and <code>start + duration ≤ 21</code> (integers). In domain testing each boundary gets an <b>ON point</b> (on the boundary, valid) and an <b>OFF point</b> (one step outside, breaking ONLY that boundary).</p>${MIEN_SVG}`, vi: `<p>Booking hợp lệ khi <code>7 ≤ start ≤ 20</code>, <code>1 ≤ duration ≤ 3</code> và <code>start + duration ≤ 21</code> (số nguyên). Trong kiểm thử miền mỗi biên có một <b>điểm ON</b> (trên biên, hợp lệ) và một <b>điểm OFF</b> (ra ngoài một bước, CHỈ phạm biên đó).</p>${MIEN_SVG}` },
      yeuCau: [
        { en: 'ON and OFF points for the four real boundaries B1 (start = 7), B3 (duration = 1), B4 (duration = 3), B5 (start + duration = 21).', vi: 'Điểm ON và OFF cho bốn biên thật B1 (start = 7), B3 (duration = 1), B4 (duration = 3), B5 (start + duration = 21).' },
        { en: '<code>REDUNDANT</code>: the constraint that never forms a boundary of the domain (write it like <code>"start <= 20"</code>).', vi: '<code>REDUNDANT</code>: ràng buộc không bao giờ tạo biên của miền (ghi dạng <code>"start <= 20"</code>).' },
      ],
      hook: ['domain testing', 'ON/OFF points'],
    },
  ],
  idBatBuoc: [['CONFIGS · FULL_PRODUCT', 'answers/a-pairwise.js'], ['EFFECTS · RULE_COUNT', 'answers/b-cause-effect.js'], ['DOMAIN · REDUNDANT', 'answers/c-domain.js']],
  truDiem: [
    { en: 'A configuration matrix that includes Safari on Windows — it cannot be executed.', vi: 'Ma trận cấu hình có Safari trên Windows — không chạy được.' },
    { en: 'Treating OFF points of a slanted boundary like 1-D BVA (changing only one variable may cross another boundary).', vi: 'Coi điểm OFF của biên xiên như BVA một chiều (đổi một biến có thể vượt biên khác).' },
  ],
  nopBai: NOP_BAI,
};

export default doiDau({
  slug: 'swt301-4-deep-combinatorial-cause-effect',
  ten: 'Deep Lab 4 — Pairwise, Cause–Effect & Domain Testing',
  moTaModule: 'Deep Lab chương 4 (vượt syllabus): pairwise có ràng buộc cho ma trận cấu hình LabBook (72 → ≤ 14 dòng), đồ thị nhân–quả ra bảng quyết định rút gọn, kiểm thử miền hai biến với điểm ON/OFF và ràng buộc thừa.',
  khoa: KHOA,
  baiHoc: 'swt301-blackbox-use-case',
  de: [{
    dangBai: 'deep-lab',
    tieuDe: 'Deep Lab 4 — Pairwise, Cause–Effect Graph and Domain Testing',
    doKho: 'HARD', phut: 90, diem: 100, ngonNgu: 'javascript',
    viDu: [{ input: "{ browser: 'Safari', os: 'Windows', … }", output: 'rejected: Safari runs only on macOS', explanation: 'Constrained pairwise: impossible combinations are excluded, not covered.|||Pairwise có ràng buộc: tổ hợp không thể bị loại, không cần phủ.' }],
    khaiNiem: ['pairwise testing', 'combinatorial testing', 'cause-effect graphing', 'domain testing'],
    tienQuyet: ['SWT301 4.2–4.5'],
    the: ['swt301', 'deep-lab', 'test-design'],
    banIn: BAN_IN,
    thuatNgu: [
      { en: 'pairwise testing', vi: 'kiểm thử theo cặp — mọi cặp giá trị của mọi hai yếu tố xuất hiện ít nhất một lần' },
      { en: 'constraint', vi: 'ràng buộc — tổ hợp không thể xảy ra' },
      { en: 'cause–effect graph', vi: 'đồ thị nhân–quả — nối nguyên nhân với hiệu ứng bằng AND/OR/NOT' },
      { en: 'domain testing', vi: 'kiểm thử miền — kiểm các biên của miền nhiều biến' },
      { en: 'ON / OFF point', vi: 'điểm trên biên (hợp lệ) / điểm ngay ngoài biên (không hợp lệ)' },
      { en: 'redundant constraint', vi: 'ràng buộc thừa — bị ràng buộc khác bao trọn' },
      ...tn('decisionTable'),
    ],
    goiY: [
      'A: bắt đầu bằng 12 dòng browser × role (mỗi trình duyệt ba vai trò), rồi gán OS và ngôn ngữ để phủ các cặp còn lại; Safari luôn macOS. Thêm một dòng Chrome hoặc Firefox trên Ubuntu cho vai trò còn thiếu.',
      'B: C1 = F ⇒ chỉ E3 (mọi thứ khác “–”) — một luật. C1 = T, C2 = F ⇒ E2 — một luật. Còn lại C3, C4 quyết định E1 hay E4.',
      'C: tại start = 21 mọi duration ≥ 1 đều cho start + duration ≥ 22 ⇒ không có điểm nào CHỈ phạm “start ≤ 20”.',
    ],
    loiHayGap: [
      'Phủ cặp Safari + Windows bằng cách thêm dòng Safari/Windows — cặp bị ràng buộc không cần phủ.',
      'B: cho TTFT ra E4 — C4 (có đơn thi lại được duyệt) cứu sinh viên vắng nhiều ⇒ E1.',
      'C: điểm OFF của B4 là (19, 4) — phạm cả duration ≤ 3 lẫn start + duration ≤ 21.',
    ],
    moTaNgan: 'Deep Lab chương 4: pairwise có ràng buộc, đồ thị nhân–quả, kiểm thử miền hai biến.',
    giaiThich: {
      en: '<p><b>A.</b> 13 rows: the 12 browser × role combinations plus one extra Ubuntu row (only Chrome and Firefox reach Ubuntu, so two rows cannot cover three roles). <b>B.</b> FTTT E3 · TFTT E2 · TTTF E1 · TTFT E1 · TTFF E4 · TFFF E2 · FFFF E3; collapsed table: (F,–,–,–) E3 · (T,F,–,–) E2 · (T,T,T,–) E1 · (T,T,F,T) E1 · (T,T,F,F) E4 = 5 rules. <b>C.</b> B1 on (7,2) off (6,2) · B3 on (10,1) off (10,0) · B4 on (10,3) off (10,4) · B5 on (18,3) off (19,3); “start ≤ 20” is implied by start + duration ≤ 21 with duration ≥ 1.</p>',
      vi: '<p><b>A.</b> 13 dòng: 12 tổ hợp browser × role cộng một dòng Ubuntu (chỉ Chrome, Firefox chạy Ubuntu). <b>B.</b> 5 luật rút gọn. <b>C.</b> “start ≤ 20” bị start + duration ≤ 21 với duration ≥ 1 bao trọn.</p>',
    },
    loaiKiem: 'js',
    tests: { loai: 'js', phienBan: 1, tepNap: ['answers/a-pairwise.js', 'answers/b-cause-effect.js', 'answers/c-domain.js'], kiem: [...kA, ...kB, ...kC] },
    khoiDau: {
      'answers/a-pairwise.js': "// Pairwise configurations: { browser, os, language, role }\nconst CONFIGS = [\n  { browser: 'Chrome', os: 'Windows', language: 'EN', role: 'Student' },\n];\nconst FULL_PRODUCT = 0;\n",
      'answers/b-cause-effect.js': "// Effects that fire for each cause combination C1C2C3C4.\nconst EFFECTS = {\n  FTTT: [],\n  TFTT: [],\n  TTTF: [],\n  TTFT: [],\n  TTFF: [],\n  TFFF: [],\n  FFFF: [],\n};\nconst RULE_COUNT = 0;\n",
      'answers/c-domain.js': "// Points are [start, duration].\nconst DOMAIN = {\n  B1: { on: [7, 2], off: [] },   // start = 7\n  B3: { on: [], off: [] },       // duration = 1\n  B4: { on: [], off: [] },       // duration = 3\n  B5: { on: [], off: [] },       // start + duration = 21\n};\nconst REDUNDANT = '';\n",
    },
    loiGiai: {
      'answers/a-pairwise.js': `// 13 rows instead of 72. Rows 1–12 = every browser × role; row 13 adds the missing Ubuntu × Admin pair.
const CONFIGS = [
  { browser: 'Chrome', os: 'Ubuntu', language: 'EN', role: 'Student' },
  { browser: 'Chrome', os: 'Windows', language: 'VI', role: 'Manager' },
  { browser: 'Chrome', os: 'macOS', language: 'EN', role: 'Admin' },
  { browser: 'Firefox', os: 'Windows', language: 'EN', role: 'Student' },
  { browser: 'Firefox', os: 'Ubuntu', language: 'VI', role: 'Manager' },
  { browser: 'Firefox', os: 'macOS', language: 'VI', role: 'Admin' },
  { browser: 'Safari', os: 'macOS', language: 'VI', role: 'Student' },
  { browser: 'Safari', os: 'macOS', language: 'EN', role: 'Manager' },
  { browser: 'Safari', os: 'macOS', language: 'EN', role: 'Admin' },
  { browser: 'Edge', os: 'macOS', language: 'VI', role: 'Student' },
  { browser: 'Edge', os: 'Windows', language: 'EN', role: 'Manager' },
  { browser: 'Edge', os: 'Windows', language: 'VI', role: 'Admin' },
  { browser: 'Chrome', os: 'Ubuntu', language: 'VI', role: 'Admin' },
];
const FULL_PRODUCT = 72; // 4 × 3 × 2 × 3
`,
      'answers/b-cause-effect.js': "// From the graph: E3 = ¬C1 · E2 = C1∧¬C2 · E1 = C1∧C2∧(C3∨C4) · E4 = C1∧C2∧¬(C3∨C4)\nconst EFFECTS = {\n  FTTT: ['E3'],\n  TFTT: ['E2'],\n  TTTF: ['E1'],\n  TTFT: ['E1'],   // the approved retake request (C4) makes up for too many absences\n  TTFF: ['E4'],\n  TFFF: ['E2'],\n  FFFF: ['E3'],\n};\nconst RULE_COUNT = 5; // (F,–,–,–) (T,F,–,–) (T,T,T,–) (T,T,F,T) (T,T,F,F)\n",
      'answers/c-domain.js': "// ON point: valid, exactly on the boundary. OFF point: one step outside, breaking ONLY that boundary.\nconst DOMAIN = {\n  B1: { on: [7, 2], off: [6, 2] },     // start = 7\n  B3: { on: [10, 1], off: [10, 0] },   // duration = 1\n  B4: { on: [10, 3], off: [10, 4] },   // duration = 3 (10 + 4 = 14 still satisfies the sum)\n  B5: { on: [18, 3], off: [19, 3] },   // start + duration = 21\n};\n// start <= 20 is implied: start + duration <= 21 and duration >= 1 give start <= 20.\nconst REDUNDANT = 'start <= 20';\n",
    },
    thamKhao: 'https://www.istqb.org/certifications/test-analyst',
    boYeu: [
      { ten: 'A: 12 dòng thiếu Ubuntu × Admin', tep: { 'answers/a-pairwise.js': "const CONFIGS = [\n  { browser: 'Chrome', os: 'Ubuntu', language: 'EN', role: 'Student' },\n  { browser: 'Chrome', os: 'Windows', language: 'VI', role: 'Manager' },\n  { browser: 'Chrome', os: 'macOS', language: 'EN', role: 'Admin' },\n  { browser: 'Firefox', os: 'Windows', language: 'EN', role: 'Student' },\n  { browser: 'Firefox', os: 'Ubuntu', language: 'VI', role: 'Manager' },\n  { browser: 'Firefox', os: 'macOS', language: 'VI', role: 'Admin' },\n  { browser: 'Safari', os: 'macOS', language: 'VI', role: 'Student' },\n  { browser: 'Safari', os: 'macOS', language: 'EN', role: 'Manager' },\n  { browser: 'Safari', os: 'macOS', language: 'EN', role: 'Admin' },\n  { browser: 'Edge', os: 'macOS', language: 'VI', role: 'Student' },\n  { browser: 'Edge', os: 'Windows', language: 'EN', role: 'Manager' },\n  { browser: 'Edge', os: 'Windows', language: 'VI', role: 'Admin' },\n];\nconst FULL_PRODUCT = 72;\n" }, phaiTruot: ['A — every valid os × role pair appears'] },
      { ten: 'C: điểm OFF của B4 phạm hai ràng buộc', tep: { 'answers/c-domain.js': "const DOMAIN = { B1: { on: [7, 2], off: [6, 2] }, B3: { on: [10, 1], off: [10, 0] }, B4: { on: [18, 3], off: [19, 4] }, B5: { on: [18, 3], off: [19, 3] } };\nconst REDUNDANT = 'start <= 20';\n" }, phaiTruot: ['C — OFF point of duration = 3'] },
    ],
  }],
});
