/**
 * SWT301 · LAB CHƯƠNG 9 — Kiểm thử Agile trong sprint 12 của LabBook: A. bốn góc kiểm thử · B. lập sprint theo velocity ·
 * C. đọc burndown · D. planning poker + INVEST.
 */
import { doiDau, KHOA, kiemKhoa, bangHtml, NOP_BAI } from './_chung.mjs';

const QD = ['Q1', 'Q2', 'Q3', 'Q4'];
const TESTS = [
  ['T1', 'JUnit tests of the exam-week rule, written test-first', 'Q1'],
  ['T2', 'Gherkin scenarios of “waitlist position” written in the three-amigos session', 'Q2'],
  ['T3', 'Exploratory session with lab managers on the new statistics screen', 'Q3'],
  ['T4', 'Stress test: 1,000 students booking at 07:00 on Monday', 'Q4'],
  ['T5', 'Story tests of “cancel a booking” checked against its acceptance criteria', 'Q2'],
  ['T6', 'Beta test of the mobile view with 30 students', 'Q3'],
  ['T7', 'Penetration test of the login API', 'Q4'],
  ['T8', 'Component tests of BookingService with stubs', 'Q1'],
];
const BACKLOG = [['S1', 8, 1, '—', 'yes'], ['S2', 5, 1, 'S4', 'yes'], ['S3', 3, 2, '—', 'no (no acceptance criteria)'], ['S4', 3, 2, '—', 'yes'], ['S5', 2, 3, '—', 'yes'], ['S6', 5, 2, '—', 'yes']];
const INV = ['Independent', 'Negotiable', 'Valuable', 'Estimable', 'Small', 'Testable'];

const KIEM = [
  ...kiemKhoa(TESTS.map(([m, , q], i) => ({ moTa: { en: `A — quadrant of ${m}`, vi: `A — góc của ${m}` }, bieuThuc: `String(QUADRANTS.${m}).toUpperCase().slice(0, 2)`, chap: [q], nhom: 'f1', ...(i >= 6 ? { an: true } : {}) }))),
  ...kiemKhoa([
    { moTa: { en: 'B — stories taken into the sprint, in order', vi: 'B — story được nhận vào sprint, theo thứ tự' }, bieuThuc: 'JSON.stringify(SPRINT.taken)', chap: [JSON.stringify(['S1', 'S4', 'S5'])], nhom: 'f2', goiY: 'one pass in priority order; skip a story whose dependency is not taken yet' },
    { moTa: { en: 'B — points committed', vi: 'B — số điểm cam kết' }, bieuThuc: 'SPRINT.points', chap: [13], kieu: 'so', nhom: 'f2' },
    { moTa: { en: 'B — stories sent back to refinement', vi: 'B — story trả về làm mịn' }, bieuThuc: '(SPRINT.needsRefinement || []).map(String)', chap: [['S3']], kieu: 'tap', nhom: 'f2' },
  ]),
  ...kiemKhoa([
    { moTa: { en: 'C — gap to the ideal line after day 5', vi: 'C — độ lệch so với đường lý tưởng sau ngày 5' }, bieuThuc: 'BURNDOWN.gap', chap: [12], kieu: 'so', nhom: 'f3' },
    { moTa: { en: 'C — days still needed at the current rate', vi: 'C — số ngày còn cần theo tốc độ hiện tại' }, bieuThuc: 'BURNDOWN.forecastDays', chap: [15], kieu: 'so', nhom: 'f3' },
    { moTa: { en: 'C — status', vi: 'C — trạng thái' }, bieuThuc: 'BURNDOWN.status', chap: ['AT_RISK'], nhom: 'f3' },
    { moTa: { en: 'C — what the team should do at the daily stand-up', vi: 'C — đội nên làm gì ở họp hằng ngày' }, bieuThuc: 'BURNDOWN.action', chap: ['Discuss scope with the PO and swarm on the blocked stories'], nhom: 'f3', an: true },
  ]),
  ...kiemKhoa([
    { moTa: { en: 'D — outcome of round R1', vi: 'D — kết quả vòng R1' }, bieuThuc: 'POKER.R1', chap: [8], kieu: 'so', nhom: 'f4' },
    { moTa: { en: 'D — outcome of round R2', vi: 'D — kết quả vòng R2' }, bieuThuc: 'POKER.R2', chap: ['NO_CONSENSUS'], nhom: 'f4' },
    { moTa: { en: 'D — who explains in R2 (lowest, then highest)', vi: 'D — ai giải thích ở R2 (thấp nhất rồi cao nhất)' }, bieuThuc: 'JSON.stringify(POKER.R2explain)', chap: [JSON.stringify(['An', 'Dung', 'Binh'])], nhom: 'f4' },
    { moTa: { en: 'D — outcome of round R3', vi: 'D — kết quả vòng R3' }, bieuThuc: 'POKER.R3', chap: [20], kieu: 'so', nhom: 'f4' },
    ...[['I1', INV[5]], ['I2', INV[4]], ['I3', INV[2]]].map(([k, v]) => ({ moTa: { en: `D — INVEST criterion broken by ${k}`, vi: `D — tiêu chí INVEST bị ${k} vi phạm` }, bieuThuc: `POKER.invest.${k}`, chap: [v], nhom: 'f4' })),
  ]),
];

const BAN_IN = {
  tieuDe: 'Lab 9 — Agile Testing in LabBook Sprint 12',
  phu: { en: 'Chapter 9 lab · testing quadrants, iteration planning, burndown, planning poker and INVEST · 10 marks', vi: 'Lab chương 9 · bốn góc kiểm thử, lập kế hoạch iteration, burndown, planning poker và INVEST · 10 điểm' },
  moTa: {
    en: `<p>You are the tester of the LabBook Scrum team in sprint 12.</p>
<p><b>A. Quadrants.</b> ${TESTS.map(([m, t]) => `<b>${m}</b> ${t}`).join(' · ')}.</p>
<p><b>B. Iteration planning.</b> Velocity 13. Rule (lesson 9.4): stories without acceptance criteria go back to refinement; the others are considered once, in priority order (ties: backlog order), and taken if they fit the remaining points and their dependencies are already taken.</p>${bangHtml(['Story', 'Points', 'Priority', 'Depends on', 'Testable'], BACKLOG)}
<p><b>C. Burndown.</b> 50 points, 10 working days. Remaining at the end of days 1–5: 47, 44, 40, 38, 37. Use the rules of lesson 9.5 (ideal = total − total × day ÷ days; forecast = ceil(remaining ÷ average burn rate)).</p>
<p><b>D. Planning poker</b> (deck 1, 2, 3, 5, 8, 13, 20, 40, 100; close = equal or neighbours; consensus = the highest card): R1 An 5, Binh 8, Chi 5 · R2 An 2, Binh 13, Chi 5, Dung 2 · R3 An 20, Binh 20. And which INVEST letter do these break? <b>I1</b> “As a student I want the app to be nice” · <b>I2</b> “As a student I want booking, cancellation, payments and statistics” · <b>I3</b> “As the DBA I want to migrate to PostgreSQL 17”.</p>`,
    vi: `<p>Bạn là tester của đội Scrum LabBook ở sprint 12. <b>A.</b> Xếp tám test T1–T8 vào bốn góc kiểm thử. <b>B.</b> Lập sprint với velocity 13 theo luật bài 9.4 cho backlog ở bảng trên. <b>C.</b> Burndown 50 điểm, 10 ngày, còn lại cuối ngày 1–5: 47, 44, 40, 38, 37 — tính độ lệch, số ngày cần thêm, trạng thái, hành động. <b>D.</b> Kết quả ba vòng planning poker và tiêu chí INVEST bị vi phạm của I1–I3.</p>`,
  },
  chucNangChinh: [
    { en: 'A. Quadrant of eight tests.', vi: 'A. Góc của tám test.' },
    { en: 'B. Sprint content, points, refinement.', vi: 'B. Nội dung sprint, số điểm, story cần làm mịn.' },
    { en: 'C. Burndown reading and action.', vi: 'C. Đọc burndown và hành động.' },
    { en: 'D. Poker outcomes and INVEST.', vi: 'D. Kết quả poker và INVEST.' },
  ],
  yeuCauChung: [{ en: 'Use exactly the allowed values listed in the data model.', vi: 'Dùng đúng giá trị cho phép trong mô hình dữ liệu.' }],
  cayThuMuc: `answers/
├── a-quadrants.js  ← const QUADRANTS = { T1: 'Q1', … }
├── b-sprint.js     ← const SPRINT = { taken: [...], points, needsRefinement: [...] }
├── c-burndown.js   ← const BURNDOWN = { gap, forecastDays, status, action }
└── d-poker.js      ← const POKER = { R1, R2, R2explain, R3, invest: { I1, I2, I3 } }`,
  moHinh: {
    ten: 'Allowed values',
    truong: [
      ['QUADRANTS.*', 'string', { en: QD.join(' · '), vi: QD.join(' · ') }],
      ['BURNDOWN.status · action', 'string', { en: "'DONE' | 'ON_TRACK' | 'AT_RISK' · 'Discuss scope with the PO and swarm on the blocked stories' | 'Wait for the sprint review' | 'Work overtime every weekend'", vi: "'DONE' | 'ON_TRACK' | 'AT_RISK' · ba hành động như bản tiếng Anh" }],
      ['POKER.R*', 'number | string', { en: "the agreed card, or 'NO_CONSENSUS'", vi: "lá đồng thuận, hoặc 'NO_CONSENSUS'" }],
      ['POKER.invest.*', 'string', { en: INV.join(' · '), vi: INV.join(' · ') }],
    ],
  },
  chucNang: [
    { ten: { en: 'A. Testing quadrants', vi: 'A. Bốn góc kiểm thử' }, diem: 3, yeuCau: [{ en: 'Eight tests.', vi: 'Tám test.' }], hook: ['testing quadrants'] },
    { ten: { en: 'B. Iteration planning', vi: 'B. Lập kế hoạch iteration' }, diem: 2, yeuCau: [{ en: 'Stories, points, refinement.', vi: 'Story, điểm, làm mịn.' }], hook: ['iteration planning'] },
    { ten: { en: 'C. Burndown', vi: 'C. Burndown' }, diem: 2, yeuCau: [{ en: 'Gap, forecast, status, action.', vi: 'Độ lệch, dự báo, trạng thái, hành động.' }], hook: ['test status'] },
    { ten: { en: 'D. Estimation and stories', vi: 'D. Ước lượng và story' }, diem: 3, yeuCau: [{ en: 'Three poker rounds and three INVEST checks.', vi: 'Ba vòng poker và ba kiểm INVEST.' }], hook: ['planning poker', 'INVEST'] },
  ],
  idBatBuoc: [['QUADRANTS', 'answers/a-quadrants.js'], ['SPRINT', 'answers/b-sprint.js'], ['BURNDOWN', 'answers/c-burndown.js'], ['POKER', 'answers/d-poker.js']],
  truDiem: [
    { en: 'Taking S2 because it has priority 1 — its dependency S4 is not taken yet when it is considered.', vi: 'Nhận S2 vì ưu tiên 1 — lúc xét, phụ thuộc S4 chưa được nhận.' },
    { en: 'Averaging the poker cards instead of discussing the extremes.', vi: 'Lấy trung bình các lá bài thay vì để hai cực giải thích.' },
  ],
  nopBai: NOP_BAI,
};

const GIAI = {
  'answers/a-quadrants.js': `const QUADRANTS = {\n${TESTS.map(([m, , q]) => `  ${m}: '${q}',`).join('\n')}\n};\n`,
  'answers/b-sprint.js': "// Priority order: S1, S2, S4, S6, S5 (S3 has no acceptance criteria).\n// S1 (8) → left 5 · S2 skipped (S4 not taken yet) · S4 (3) → left 2 · S6 (5) does not fit · S5 (2) → left 0.\nconst SPRINT = { taken: ['S1', 'S4', 'S5'], points: 13, needsRefinement: ['S3'] };\n",
  'answers/c-burndown.js': "// Ideal after day 5 = 50 − 25 = 25 → gap 37 − 25 = 12. Burnt 13 in 5 days = 2.6/day → ceil(37 / 2.6) = 15 days > 5 left.\nconst BURNDOWN = { gap: 12, forecastDays: 15, status: 'AT_RISK', action: 'Discuss scope with the PO and swarm on the blocked stories' };\n",
  'answers/d-poker.js': "// R1: 5 and 8 are neighbours → 8. R2: 2 and 13 are far apart → An and Dung (2), then Binh (13) explain. R3: 20.\nconst POKER = {\n  R1: 8,\n  R2: 'NO_CONSENSUS',\n  R2explain: ['An', 'Dung', 'Binh'],\n  R3: 20,\n  invest: { I1: 'Testable', I2: 'Small', I3: 'Valuable' },\n};\n",
};

export default doiDau({
  slug: 'swt301-9-lab-agile-sprint12',
  ten: 'Lab 9 — Agile Testing in LabBook Sprint 12',
  moTaModule: 'Lab chương 9: xếp tám test vào bốn góc kiểm thử, lập sprint theo velocity/ưu tiên/phụ thuộc/tính kiểm thử được, đọc burndown và chọn hành động, ba vòng planning poker và kiểm INVEST.',
  khoa: KHOA,
  baiHoc: 'swt301-agile-risk-estimation',
  de: [{
    dangBai: 'lab',
    tieuDe: 'Lab 9 — Agile Testing in LabBook Sprint 12',
    doKho: 'HARD', phut: 60, diem: 100, ngonNgu: 'javascript',
    viDu: [{ input: 'T4 — stress test with 1,000 students', output: "'Q4'", explanation: 'Technology-facing, critiquing the product.|||Hướng kỹ thuật, phê bình sản phẩm.' }],
    khaiNiem: ['testing quadrants', 'iteration planning', 'burndown', 'planning poker', 'INVEST'],
    tienQuyet: ['SWT301 chapter 9'],
    the: ['swt301', 'lab', 'agile'],
    banIn: BAN_IN,
    thuatNgu: [{ en: 'velocity', vi: 'tốc độ của đội' }, { en: 'swarm', vi: 'cả đội dồn vào một việc' }, { en: 'refinement', vi: 'làm mịn backlog' }],
    goiY: [
      'A: ai đánh giá được kết quả? test dẫn dắt việc xây hay đánh giá sản phẩm đã xong?',
      'B: duyệt một lượt theo ưu tiên, story bị bỏ qua không xét lại.',
      'C: tốc độ trung bình = (50 − 37) ÷ 5.',
      'D: “gần” nghĩa là bằng hoặc kề nhau trong bộ bài.',
    ],
    loiHayGap: ['Đặt beta test vào Q4.', 'Nhận S2 trước S4.', 'Chọn 5 cho R1 (phải lấy lá cao hơn).'],
    moTaNgan: 'Lab chương 9: kiểm thử Agile trong sprint 12.',
    giaiThich: {
      en: '<p><b>A.</b> Q1 · Q2 · Q3 · Q4 · Q2 · Q3 · Q4 · Q1. <b>B.</b> S1, S4, S5 · 13 · S3. <b>C.</b> 12 · 15 · AT_RISK · discuss scope and swarm. <b>D.</b> 8 · NO_CONSENSUS (An, Dung, Binh) · 20 · Testable, Small, Valuable.</p>',
      vi: '<p>Xem bản tiếng Anh.</p>',
    },
    loaiKiem: 'js',
    tests: { loai: 'js', phienBan: 1, tepNap: Object.keys(GIAI), kiem: KIEM },
    khoiDau: {
      'answers/a-quadrants.js': `// 'Q1' | 'Q2' | 'Q3' | 'Q4'\nconst QUADRANTS = { T1: 'Q1', T2: '', T3: '', T4: '', T5: '', T6: '', T7: '', T8: '' };\n`,
      'answers/b-sprint.js': 'const SPRINT = { taken: [], points: 0, needsRefinement: [] };\n',
      'answers/c-burndown.js': "const BURNDOWN = { gap: 0, forecastDays: 0, status: '', action: '' };\n",
      'answers/d-poker.js': `// invest: ${INV.join(' | ')}\nconst POKER = { R1: 0, R2: '', R2explain: [], R3: 0, invest: { I1: '', I2: '', I3: '' } };\n`,
    },
    loiGiai: GIAI,
    boYeu: [
      { ten: 'nhận S2 bất chấp phụ thuộc', tep: { 'answers/b-sprint.js': "const SPRINT = { taken: ['S1', 'S2'], points: 13, needsRefinement: ['S3'] };\n" }, phaiTruot: ['B — stories taken'] },
      { ten: 'lấy lá thấp hơn khi đồng thuận', tep: { 'answers/d-poker.js': GIAI['answers/d-poker.js'].replace('R1: 8', 'R1: 5') }, phaiTruot: ['D — outcome of round R1'] },
    ],
  }],
});
