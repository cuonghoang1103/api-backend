/**
 * SWT301 · DỰ ÁN LabBook — mốc chương 5: white-box cho thuật toán còn-chỗ isSeatFree (hai vòng lặp lồng, điều kiện ghép
 * bốn vế) — chỉ số, phủ vòng lặp 0/1/nhiều, MC/DC đo thật + góc phỏng vấn về coverage.
 */
import { doiDau, KHOA, hai, giai, lc, kiemPhu, kiemKhoa, sach, preSo, NOP_BAI, tn } from './_chung.mjs';
import { tinhDe, kiemTuy } from './_de.mjs';

const DO = `function isSeatFree(bookings, seats, date, start, duration) {
  $s('S1'); for (let h = start; $d('D1', h < start + duration); h++) {
    $s('S2'); let used = 0;
    $s('S3'); for (let k = 0; $d('D2', k < bookings.length); k++) {
      $s('S4'); const b = bookings[k];
      $s('S5'); if ($d('D3', $c('D3.A', b.status === 'CONFIRMED') && $c('D3.B', b.date === date) && $c('D3.C', b.startHour <= h) && $c('D3.D', h < b.startHour + b.duration))) { $s('S6'); used++; }
    }
    $s('S7'); if ($d('D4', used >= seats)) { $s('S8'); return false; }
  }
  $s('S9'); return true;
}`;
const DEM = function (input) {
  const { bookings, seats, date, start, duration } = input;
  let ngoai = 0; const trong = [];
  for (let h = start; h < start + duration; h++) {
    ngoai++; let used = 0, k = 0;
    for (; k < bookings.length; k++) { const b = bookings[k]; if (b.status === 'CONFIRMED' && b.date === date && b.startHour <= h && h < b.startHour + b.duration) used++; }
    trong.push(k);
    if (used >= seats) return { ngoai, trong, som: true };
  }
  return { ngoai, trong, som: false };
};
const kVong = (ma, moTa, dk) => kiemTuy(moTa, new Function(`const dem = ${DEM.toString()}; if (!Array.isArray(TESTS)) return 'TESTS is missing'; return TESTS.some((t) => { try { const r = dem(t.input); return ${dk}; } catch (e) { return false; } }) ? 'OK' : 'no test makes ${ma} yet';`), { nhom: 'f2' });

const KIEM = [
  ...kiemKhoa([
    { moTa: { en: 'A — number of decisions', vi: 'A — số quyết định' }, bieuThuc: 'METRICS.decisions', chap: [4], kieu: 'so', nhom: 'f1' },
    { moTa: { en: 'A — V(G)', vi: 'A — V(G)' }, bieuThuc: 'METRICS.vg', chap: [5], kieu: 'so', nhom: 'f1' },
    { moTa: { en: 'A — minimum tests for 100% decision coverage', vi: 'A — số test tối thiểu cho 100% decision' }, bieuThuc: 'METRICS.minDC', chap: [2], kieu: 'so', nhom: 'f1' },
    { moTa: { en: 'A — minimum vectors for MC/DC of line 6', vi: 'A — số vector tối thiểu cho MC/DC dòng 6' }, bieuThuc: 'METRICS.mcdcVectors', chap: [5], kieu: 'so', nhom: 'f1' },
  ]),
  kVong('the outer loop run exactly once', { en: 'B — outer loop: exactly one iteration (1-hour booking)', vi: 'B — vòng ngoài: đúng một lần lặp (đặt 1 giờ)' }, 'r.ngoai === 1'),
  kVong('the outer loop run several times', { en: 'B — outer loop: several iterations (multi-hour booking)', vi: 'B — vòng ngoài: nhiều lần lặp (đặt nhiều giờ)' }, 'r.ngoai >= 2'),
  kVong('the inner loop run zero times', { en: 'B — inner loop: zero iterations (no booking yet)', vi: 'B — vòng trong: không lần lặp nào (chưa có booking)' }, 'r.trong.some((x) => x === 0)'),
  kVong('the inner loop run several times', { en: 'B — inner loop: several iterations', vi: 'B — vòng trong: nhiều lần lặp' }, 'r.trong.some((x) => x >= 2)'),
  kVong('the outer loop exit early in a later hour', { en: 'B — early exit from the outer loop in a later hour (not the first)', vi: 'B — thoát sớm vòng ngoài ở một giờ sau (không phải giờ đầu)' }, 'r.som && r.ngoai >= 2'),
  ...kiemPhu({
    code: DO, ham: 'isSeatFree', thamSo: ['bookings', 'seats', 'date', 'start', 'duration'],
    do: { lenh: true, nhanh: true, mcdc: ['D3'], kyVong: true },
    nhom: { lenh: 'f3', nhanh: 'f3', mcdc: 'f3', kyVong: 'f3' },
  }),
];

const BAN_IN = {
  tieuDe: 'LabBook Project · Milestone 5 — White-box Testing of the Seat-availability Algorithm',
  phu: { en: 'Running project · chapter 5 · nested loops · 4-condition decision · loop coverage · MC/DC · 10 marks', vi: 'Dự án xuyên suốt · chương 5 · vòng lặp lồng · quyết định bốn điều kiện · phủ vòng lặp · MC/DC · 10 điểm' },
  moTa: {
    en: `<p>When a student books, LabBook decides CONFIRMED or PENDING with <code>isSeatFree</code>: for every booked hour it counts the CONFIRMED bookings of that lab and date that cover the hour; if they already fill every seat, there is no free seat. It is the heart of the waitlist — and a classic white-box target: two nested loops, a four-condition decision and an early exit.</p>${preSo(sach(DO))}`,
    vi: `<p>Khi sinh viên đặt chỗ, LabBook quyết định CONFIRMED hay PENDING bằng <code>isSeatFree</code>: với mỗi giờ đặt, đếm các booking CONFIRMED của phòng và ngày đó phủ giờ ấy; nếu đã kín mọi chỗ thì không còn chỗ. Đây là tim của danh sách chờ — và là mục tiêu white-box kinh điển: hai vòng lặp lồng, một quyết định bốn điều kiện và một lối thoát sớm.</p>${preSo(sach(DO))}`,
  },
  chucNangChinh: [
    { en: 'A. Metrics: decisions, V(G), minimum DC, MC/DC vectors.', vi: 'A. Chỉ số: số quyết định, V(G), DC tối thiểu, số vector MC/DC.' },
    { en: 'B. Loop coverage: zero / one / many iterations, early exit.', vi: 'B. Phủ vòng lặp: không / một / nhiều lần lặp, thoát sớm.' },
    { en: 'C. Decision coverage + MC/DC of the four-condition decision, measured on the code.', vi: 'C. Decision coverage + MC/DC cho quyết định bốn điều kiện, đo trên mã.' },
  ],
  yeuCauChung: [{ en: 'One test = one call: <code>{ id, input: { bookings, seats, date, start, duration }, expected: true | false }</code>. A booking is <code>{ status, date, startHour, duration }</code>.', vi: 'Một test = một lần gọi: <code>{ id, input: { bookings, seats, date, start, duration }, expected: true | false }</code>. Một booking là <code>{ status, date, startHour, duration }</code>.' }],
  cayThuMuc: `answers/
├── metrics.js   ← const METRICS = { decisions, vg, minDC, mcdcVectors }
└── tests.js     ← const TESTS = [ { id, input: { bookings, seats, date, start, duration }, expected } ]`,
  moHinh: {
    ten: 'booking (element of bookings)',
    truong: [
      ['status', "'CONFIRMED' | 'PENDING' | 'CANCELLED'", { en: 'only CONFIRMED takes a seat', vi: 'chỉ CONFIRMED chiếm chỗ' }],
      ['date', 'YYYY-MM-DD', { en: 'must equal the requested date', vi: 'phải trùng ngày đang xét' }],
      ['startHour · duration', 'integers', { en: 'covers hours startHour … startHour + duration − 1', vi: 'phủ các giờ startHour … startHour + duration − 1' }],
    ],
  },
  chucNang: [
    { ten: { en: 'A. Metrics', vi: 'A. Chỉ số' }, diem: 2, yeuCau: [{ en: 'Two loop conditions + two IFs; the IF on line 6 has four conditions joined by &&.', vi: 'Hai điều kiện lặp + hai IF; IF dòng 6 có bốn điều kiện nối bằng &&.' }], hook: ['V(G)'] },
    { ten: { en: 'B. Loop coverage', vi: 'B. Phủ vòng lặp' }, diem: 3, yeuCau: [{ en: 'Outer loop once and several times; inner loop zero times and several times; an early exit in a hour AFTER the first (e.g. the seat is free at 9:00 but taken at 10:00).', vi: 'Vòng ngoài một lần và nhiều lần; vòng trong không lần và nhiều lần; thoát sớm ở một giờ SAU giờ đầu (vd 9:00 còn chỗ nhưng 10:00 hết).' }], hook: ['loop testing'] },
    { ten: { en: 'C. Decision coverage + MC/DC', vi: 'C. Decision coverage + MC/DC' }, diem: 5, yeuCau: [{ en: 'Every statement, every decision outcome, and an independence pair for each of the four conditions of line 6 — a single call can provide many vectors (one per booking per hour). Expected results from the rule above.', vi: 'Mọi câu lệnh, mọi kết quả quyết định, và một cặp độc lập cho mỗi điều kiện của dòng 6 — một lần gọi có thể cho nhiều vector (mỗi booking mỗi giờ một vector). Kết quả mong đợi theo luật ở trên.' }], hook: ['MC/DC'] },
  ],
  idBatBuoc: [['METRICS', 'answers/metrics.js'], ['TESTS', 'answers/tests.js']],
  truDiem: [{ en: 'Only testing an empty bookings list — the inner loop never runs and line 6 is never reached.', vi: 'Chỉ test danh sách booking rỗng — vòng trong không chạy, dòng 6 không bao giờ tới.' }],
  nopBai: NOP_BAI,
};

const PHONG_VAN = tinhDe({
  tieuDe: 'LabBook Interview corner 5 — Talking about code coverage',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p><b>Interview corner.</b> Coverage questions you will meet in QA and developer interviews — and in code reviews of your own pull requests.</p>', vi: '<p><b>Góc phỏng vấn.</b> Câu hỏi về coverage gặp trong phỏng vấn QA lẫn developer — và khi review pull request của chính bạn.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('“Our project has 95% line coverage. Is it well tested?”', '“Dự án có 95% line coverage. Vậy là test tốt chưa?”'), luaChon: lc(['a', 'Yes, anything above 80% is well tested'], ['b', 'Not necessarily — coverage shows what was executed, not what was asserted; I would check branch coverage, the assertions, boundary cases and a mutation score'], ['c', 'No, only 100% counts'], ['d', 'Coverage is meaningless']), dapAn: ['b'], giaiThich: giai('Executed ≠ verified. Mutation testing measures whether the tests would notice a change.', 'Đã chạy ≠ đã kiểm. Mutation testing đo xem test có nhận ra thay đổi hay không.') },
    { ma: 'q2', de: hai('“What is the difference between line and branch coverage?”', '“Line coverage và branch coverage khác nhau thế nào?”'), luaChon: lc(['a', 'There is none'], ['b', 'Line (statement) coverage counts executed lines; branch (decision) coverage counts both outcomes of every decision — an IF without ELSE can be 100% line-covered with its False branch never taken'], ['c', 'Branch coverage counts Git branches'], ['d', 'Line coverage is stronger']), dapAn: ['b'], giaiThich: giai('Give the IF-without-ELSE example: that is what the interviewer wants to hear.', 'Nêu ví dụ IF không ELSE: đó là điều người phỏng vấn muốn nghe.') },
    { ma: 'q3', de: hai('“How do you test a loop?”', '“Bạn test một vòng lặp thế nào?”'), luaChon: lc(['a', 'Once with a typical value'], ['b', 'Zero, one and many iterations, plus the maximum if there is one, and any early exit (break/return) — e.g. LabBook’s seat check with no booking, one hour and three hours'], ['c', 'Only with the maximum'], ['d', 'Loops cannot be tested']), dapAn: ['b'], giaiThich: giai('Loop testing heuristics: skip, once, twice/typical, max − 1, max, early exit.', 'Kinh nghiệm test vòng lặp: bỏ qua, một lần, hai lần/điển hình, max − 1, max, thoát sớm.') },
    { ma: 'q4', de: hai('“Which tool would you use to measure coverage on a Spring Boot project?”', '“Bạn dùng công cụ gì đo coverage cho dự án Spring Boot?”'), luaChon: lc(['a', 'Postman'], ['b', 'JaCoCo (with the Maven/Gradle plugin and its HTML report), optionally PIT for mutation testing'], ['c', 'Selenium'], ['d', 'Jira']), dapAn: ['b'], giaiThich: giai('JaCoCo measures line and branch coverage of JUnit runs; PIT mutates bytecode and reports the mutation score.', 'JaCoCo đo line và branch coverage khi chạy JUnit; PIT đột biến bytecode và báo mutation score.') },
    { ma: 'q5', de: hai('“The team sets a rule: no merge below 80% branch coverage. Any risk?”', '“Nhóm đặt luật: không merge nếu branch coverage dưới 80%. Có rủi ro gì?”'), luaChon: lc(['a', 'No risk at all'], ['b', 'People may write tests without real assertions just to reach the number; combine the gate with code review of the tests and, ideally, a mutation-score check'], ['c', 'Coverage gates make tests slower'], ['d', 'It forbids black-box testing']), dapAn: ['b'], giaiThich: giai('Goodhart’s law: when a measure becomes a target it stops being a good measure.', 'Định luật Goodhart: khi một chỉ số thành mục tiêu, nó không còn là chỉ số tốt.') },
  ],
  goiY: ['Luôn phân biệt “đã chạy” và “đã kiểm”.', 'Có ví dụ cụ thể (IF không ELSE, vòng lặp 0/1/nhiều).'],
  loiHayGap: ['Trả lời “80% là đủ” mà không giải thích.', 'Không biết tên công cụ (JaCoCo, PIT).'],
  giaiThich: '<p>All answers: b.</p>',
  thuatNgu: tn('statement', 'decision', 'mutant'),
  khaiNiem: ['interview', 'code coverage'],
});

const GIAI_TESTS = `// Line 5 vectors come from (booking × hour) pairs, so one call can carry many of them.
const TESTS = [
  // free: two hours, no booking at all (inner loop 0 iterations), outer loop several times → true
  { id: 'T1', input: { bookings: [], seats: 1, date: '2026-11-04', start: 9, duration: 2 }, expected: true },
  // MC/DC: hour 9 sees every vector, but only booking 1 covers 9:00 → used 1 < 2 seats; at 10:00 two bookings cover → full → false (early exit in a later hour)
  { id: 'T2', input: {
    bookings: [
      { status: 'CONFIRMED', date: '2026-11-04', startHour: 9, duration: 2 },   // (T,T,T,T) at 9 and 10
      { status: 'PENDING', date: '2026-11-04', startHour: 9, duration: 2 },     // (F,·,·,·)
      { status: 'CONFIRMED', date: '2026-11-05', startHour: 9, duration: 2 },   // (T,F,·,·)
      { status: 'CONFIRMED', date: '2026-11-04', startHour: 10, duration: 1 },  // at 9: (T,T,F,·); at 10: (T,T,T,T)
      { status: 'CONFIRMED', date: '2026-11-04', startHour: 7, duration: 2 },   // at 9: (T,T,T,F)
    ],
    seats: 2, date: '2026-11-04', start: 9, duration: 2 }, expected: false },
  // one hour only (outer loop once), seat free → true
  { id: 'T3', input: { bookings: [{ status: 'CONFIRMED', date: '2026-11-04', startHour: 9, duration: 1 }], seats: 2, date: '2026-11-04', start: 9, duration: 1 }, expected: true },
];
`;

export default doiDau({
  slug: 'swt301-5-project-labbook-whitebox',
  ten: 'LabBook Project 5 — White-box Testing of isSeatFree',
  moTaModule: 'Dự án LabBook — mốc chương 5: white-box cho thuật toán còn-chỗ (hai vòng lặp lồng, quyết định bốn điều kiện): chỉ số, phủ vòng lặp 0/1/nhiều + thoát sớm, decision + MC/DC đo thật; kèm góc phỏng vấn về coverage.',
  khoa: KHOA,
  baiHoc: 'swt301-cyclomatic-complexity',
  de: [
    {
      dangBai: 'project',
      tieuDe: 'LabBook Milestone 5 — White-box Testing of the Seat-availability Algorithm',
      doKho: 'HARD', phut: 75, diem: 100, ngonNgu: 'javascript',
      viDu: [{ input: "booking { status: 'PENDING', date: '2026-11-04', startHour: 9, duration: 2 } at hour 9", output: 'line 6 vector (F, ·, ·, ·): a waitlisted booking takes no seat', explanation: 'With &&, the other three conditions are not evaluated.|||Với &&, ba điều kiện còn lại không được đánh giá.' }],
      khaiNiem: ['cyclomatic complexity', 'loop testing', 'decision coverage', 'MC/DC'],
      tienQuyet: ['SWT301 chapter 5', 'LabBook project 4'],
      the: ['swt301', 'project', 'labbook', 'white-box'],
      banIn: BAN_IN,
      thuatNgu: [...tn('cyclomatic', 'decision', 'mcdc', 'shortCircuit'), { en: 'loop testing', vi: 'kiểm thử vòng lặp — 0, 1, nhiều lần lặp, thoát sớm' }],
      goiY: [
        'A: D1 (vòng giờ), D2 (vòng booking), D3 (IF bốn vế), D4 (IF hết chỗ) ⇒ V(G) = 5. DC: một lần gọi trả true, một lần trả false ⇒ 2. MC/DC bốn điều kiện AND ⇒ 4 + 1 = 5 vector.',
        'B: danh sách rỗng ⇒ vòng trong 0 lần. duration 1 ⇒ vòng ngoài 1 lần. Thoát sớm ở giờ sau: giờ đầu còn chỗ, giờ thứ hai hết chỗ.',
        'C: MỘT lần gọi với năm booking khéo chọn cho đủ năm vector của dòng 6 (mỗi booking lệch đúng một điều kiện).',
      ],
      loiHayGap: [
        'Đặt mọi booking ở cùng giờ — điều kiện “giờ đã kết thúc” (D) không bao giờ False.',
        'Ghi expected theo cảm giác — đếm từng giờ: còn chỗ khi số CONFIRMED phủ giờ đó < seats.',
      ],
      moTaNgan: 'Mốc 5 dự án LabBook: white-box isSeatFree — vòng lặp lồng, MC/DC.',
      giaiThich: {
        en: '<p>4 decisions ⇒ V(G) = 5; min DC = 2; MC/DC of a 4-condition AND needs 5 vectors, which one call can provide because line 6 runs once per (booking, hour). T1 (empty list, 2 hours) covers inner-loop zero and outer-loop many; T2 provides all five vectors and exits early at 10:00; T3 runs the outer loop once.</p>',
        vi: '<p>4 quyết định ⇒ V(G) = 5; DC tối thiểu 2; MC/DC của AND bốn vế cần 5 vector, một lần gọi cho đủ vì dòng 6 chạy một lần mỗi (booking, giờ).</p>',
      },
      loaiKiem: 'js',
      tests: { loai: 'js', phienBan: 1, tepNap: ['answers/metrics.js', 'answers/tests.js'], kiem: KIEM },
      khoiDau: {
        'answers/metrics.js': 'const METRICS = { decisions: 0, vg: 0, minDC: 0, mcdcVectors: 0 };\n',
        'answers/tests.js': "const TESTS = [\n  { id: 'T1', input: { bookings: [], seats: 1, date: '2026-11-04', start: 9, duration: 1 }, expected: true },\n];\n",
      },
      loiGiai: {
        'answers/metrics.js': '// D1 outer loop, D2 inner loop, D3 four-condition IF, D4 seat check.\nconst METRICS = { decisions: 4, vg: 5, minDC: 2, mcdcVectors: 5 };\n',
        'answers/tests.js': GIAI_TESTS,
      },
      thamKhao: 'https://www.istqb.org/certifications/technical-test-analyst',
      boYeu: [
        { ten: 'chỉ danh sách rỗng', tep: { 'answers/tests.js': "const TESTS = [\n  { id: 'T1', input: { bookings: [], seats: 1, date: '2026-11-04', start: 9, duration: 2 }, expected: true },\n];\n" }, phaiTruot: ['MC/DC for the compound decision on line 6'] },
      ],
    },
    PHONG_VAN,
  ],
});
