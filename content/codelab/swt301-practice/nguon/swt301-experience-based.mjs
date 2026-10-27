/**
 * SWT301 · 6.1 — Experience-based techniques: error guessing, exploratory (session-based), checklist-based (SWT4 slide 100–108).
 */
import { doiDau, KHOA, hai, giai, lc, preMa } from './_chung.mjs';
import { tinhDe, jsDe, kiemTuy, dotBienDe, TN_TEST } from './_de.mjs';

const KT = ['Error guessing', 'Exploratory testing', 'Checklist-based testing', 'Black-box (specification-based)', 'White-box (structure-based)'];
const E1 = tinhDe({
  tieuDe: 'Experience-based 1 — Which technique is the tester using?',
  doKho: 'EASY', phut: 7,
  moTa: { en: '<p>Black-box tests come from a specification, white-box tests from the structure, experience-based tests from the tester’s skill, intuition and knowledge of past failures. Name the technique in each LabBook situation.</p>', vi: '<p>Test black-box lấy từ đặc tả, white-box từ cấu trúc, dựa kinh nghiệm từ kỹ năng, trực giác và hiểu biết về các lần hỏng trước của tester. Gọi tên kỹ thuật trong từng tình huống LabBook.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Situation → technique', 'Tình huống → kỹ thuật'),
    cot: [{ ma: 's', ten: 'Situation' }, { ma: 'k', ten: 'Technique', luaChon: KT }],
    hang: [
      'From last semester’s bug tracker the tester lists “double click on Book”, “29 February”, “emoji in the note” and designs a test for each',
      'With a 90-minute time-box and the charter “explore the waitlist with three students”, the tester designs the next test from what the last one revealed',
      'Using the team’s UI checklist (“every error message tells how to fix it”, “required fields are marked”…) the tester checks the new booking screen',
      'The tester derives tests for the start hour from the partitions 7–20 and its boundaries in the SRS',
      'The tester adds tests until every decision in calcRefund has been true and false',
      'The tester tries a booking at 23:59 on Sunday, because time-zone and week-boundary code broke in two earlier projects',
    ].map((s, i) => ({ ma: `r${i}`, o: { s } })),
    dapAn: { 'r0.k': KT[0], 'r1.k': KT[1], 'r2.k': KT[2], 'r3.k': KT[3], 'r4.k': KT[4], 'r5.k': KT[0] },
    giaiThich: giai('A list of likely mistakes turned into tests = error guessing; time-box + charter + learning loop = exploratory (session-based); checklist items = checklist-based; partitions from the SRS = black-box; decision coverage = white-box.', 'Danh sách sai sót dễ gặp biến thành test = error guessing; khung giờ + charter + vòng học = exploratory (theo phiên); mục checklist = checklist-based; phân vùng từ SRS = black-box; độ phủ quyết định = white-box.'),
  }],
  goiY: ['“time-box”, “charter”, “thiết kế test kế tiếp từ kết quả trước” ⇒ exploratory.', '“danh sách lỗi hay gặp / lỗi từng thấy” ⇒ error guessing.'],
  loiHayGap: ['Gọi error guessing là “đoán bừa” — nó là danh sách tấn công có phương pháp.', 'Nhầm checklist-based testing với review theo checklist của chương 3 (ở đây CHẠY phần mềm).'],
  giaiThich: '<p>Error guessing · Exploratory · Checklist-based · Black-box · White-box · Error guessing.</p>',
  thuatNgu: [{ en: 'error guessing', vi: 'đoán lỗi — danh sách tấn công từ kinh nghiệm' }, { en: 'fault attack', vi: 'đòn tấn công lỗi' }, { en: 'exploratory testing', vi: 'kiểm thử khám phá' }, { en: 'checklist-based testing', vi: 'kiểm thử theo checklist' }],
  khaiNiem: ['experience-based techniques'],
});

/* E2 — error guessing bằng code: isValidDate, chấm bằng mutant "lỗi developer hay mắc" */
const DUNG = `function isValidDate(s) {
  if (typeof s !== 'string') return false;
  const m = /^(\\d{4})-(\\d{2})-(\\d{2})$/.exec(s);
  if (!m) return false;
  const y = +m[1], mo = +m[2], d = +m[3];
  if (mo < 1 || mo > 12 || d < 1) return false;
  const leap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  const days = mo === 2 ? (leap ? 29 : 28) : [4, 6, 9, 11].includes(mo) ? 30 : 31;
  return d <= days;
}`;
const doi = (a, b) => { if (!DUNG.includes(a)) throw new Error('mutant: ' + a); return DUNG.replace(a, b); };
const E2 = dotBienDe({
  tieuDe: 'Experience-based 2 — Error guessing: attack isValidDate with a fault attack list',
  doKho: 'MEDIUM', phut: 20,
  moTa: { en: `<p>LabBook validates booking dates with <code>isValidDate(s)</code>: <code>s</code> must be a string <code>YYYY-MM-DD</code> (exactly 4-2-2 digits, nothing around it) naming a real calendar day — Gregorian leap years: divisible by 4, except centuries, except multiples of 400. Anything else (including <code>null</code>) returns <code>false</code>, never throws.</p>${preMa(DUNG)}<p>Use <b>error guessing</b>: list the mistakes developers typically make with dates (leap years, month ends, month 0/13, day 0, missing zero padding, spaces, null…) and write a Jest-like test for each. The grader runs your suite on the correct function and on versions containing those typical mistakes.</p>`, vi: `<p>LabBook kiểm ngày đặt chỗ bằng <code>isValidDate(s)</code>: <code>s</code> phải là chuỗi <code>YYYY-MM-DD</code> (đúng 4-2-2 chữ số, không có gì xung quanh) chỉ một ngày có thật — năm nhuận Gregory: chia hết cho 4, trừ năm tròn thế kỷ, trừ bội của 400. Mọi thứ khác (kể cả <code>null</code>) trả <code>false</code>, không bao giờ ném lỗi.</p><p>Dùng <b>error guessing</b>: liệt kê các sai sót developer hay mắc với ngày tháng (năm nhuận, cuối tháng, tháng 0/13, ngày 0, thiếu số 0 đệm, khoảng trắng, null…) và viết một test cho mỗi sai sót. Máy chấm chạy bộ test của bạn trên hàm đúng và trên các phiên bản chứa những sai sót điển hình đó.</p>` },
  yeuCau: [{ en: 'Use <code>test.each</code> for the attack table — one row per guessed mistake.', vi: 'Dùng <code>test.each</code> cho bảng tấn công — mỗi dòng một sai sót đoán được.' }],
  viDu: [{ input: "expect(isValidDate('2100-02-29')).toBe(false)", output: 'kills the “every 4th year is leap” mutant', explanation: '2100 is a century not divisible by 400.|||2100 là năm tròn thế kỷ không chia hết cho 400.' }],
  goiY: ['Năm nhuận: 2028-02-29 đúng, 2026-02-29 sai, 2100-02-29 sai, 2000-02-29 đúng.', 'Cuối tháng: 2026-04-31 sai, 2026-01-31 đúng; tháng 00 và 13; ngày 00.', 'Định dạng: "2026-2-3", " 2026-11-02", "", null, undefined, 20261102.'],
  loiHayGap: ['Chỉ test một ngày hợp lệ và một chuỗi rác — các mutant năm nhuận sống sót.', 'Quên trường hợp null/số: hàm phải trả false, không ném lỗi.'],
  giaiThich: '<p>Error guessing is methodical: the attack list comes from experience, defect data and common knowledge of why software fails. Each guessed mistake becomes one row of a parameterised test. JUnit 5: <code>@ParameterizedTest @CsvSource({"2100-02-29,false", …})</code>.</p>',
  thuatNgu: [...TN_TEST(), { en: 'leap year', vi: 'năm nhuận' }, { en: 'zero padding', vi: 'đệm số 0 (02 thay vì 2)' }],
  ten: ['isValidDate'], dung: DUNG, minTest: 8,
  dotBien: [
    { ma: 'M1', moTa: { en: 'every year divisible by 4 is a leap year', vi: 'năm nào chia hết cho 4 cũng nhuận' }, code: doi('(y % 4 === 0 && y % 100 !== 0) || y % 400 === 0', 'y % 4 === 0') },
    { ma: 'M2', moTa: { en: 'all months have 31 days', vi: 'tháng nào cũng 31 ngày' }, code: doi('return d <= days;', 'return d <= 31;') },
    { ma: 'M3', moTa: { en: 'month 13 is accepted', vi: 'nhận tháng 13' }, code: doi('mo > 12', 'mo > 13') },
    { ma: 'M4', moTa: { en: 'day 0 is accepted', vi: 'nhận ngày 0' }, code: doi('d < 1', 'd < 0') },
    { ma: 'M5', moTa: { en: 'null crashes instead of returning false', vi: 'null làm sập thay vì trả false' }, code: doi("if (typeof s !== 'string') return false;", 'if (s.length !== 10) return false;') },
    { ma: 'M6', moTa: { en: 'surrounding spaces are accepted', vi: 'nhận khoảng trắng bao quanh' }, code: doi('/^(\\d{4})-(\\d{2})-(\\d{2})$/.exec(s)', '/^(\\d{4})-(\\d{2})-(\\d{2})$/.exec(s.trim())') },
    { ma: 'M7', an: true, moTa: { en: 'single-digit month or day is accepted', vi: 'nhận tháng/ngày một chữ số' }, code: doi('/^(\\d{4})-(\\d{2})-(\\d{2})$/', '/^(\\d{4})-(\\d{1,2})-(\\d{1,2})$/') },
    { ma: 'M8', an: true, moTa: { en: 'year 2000 is not leap (the 400 rule is missing)', vi: 'năm 2000 không nhuận (thiếu luật 400)' }, code: doi('(y % 4 === 0 && y % 100 !== 0) || y % 400 === 0', 'y % 4 === 0 && y % 100 !== 0') },
    { ma: 'M9', an: true, moTa: { en: 'February always has 28 days', vi: 'tháng Hai luôn 28 ngày' }, code: doi('(leap ? 29 : 28)', '28') },
  ],
  dauTest: "// Fault attack list for isValidDate — one row per guessed mistake.\ntest.each([\n  ['2026-11-02', true],\n])('isValidDate(%p) is %p', (s, ok) => {\n  expect(isValidDate(s)).toBe(ok);\n});\n",
  giaiTest: `// Fault attack list for isValidDate — one row per mistake developers typically make with dates.
test.each([
  ['2026-11-02', true],   // a normal valid date
  ['2026-01-31', true],   // a 31-day month end
  ['2026-04-31', false],  // April has 30 days (month-end mistake)
  ['2026-04-30', true],
  ['2028-02-29', true],   // leap year divisible by 4
  ['2026-02-29', false],  // not a leap year
  ['2026-02-28', true],
  ['2100-02-29', false],  // century, not divisible by 400
  ['2000-02-29', true],   // divisible by 400 → leap
  ['2026-13-01', false],  // month 13
  ['2026-00-10', false],  // month 0
  ['2026-11-00', false],  // day 0
  ['2026-2-3', false],    // missing zero padding
  [' 2026-11-02', false], // leading space
  ['2026-11-02 ', false], // trailing space
  ['', false],            // empty string
  ['02/11/2026', false],  // another format
])('isValidDate(%p) is %p', (s, ok) => {
  expect(isValidDate(s)).toBe(ok);
});

test.each([[null], [undefined], [20261102], [{}]])('isValidDate(%p) returns false and never throws', (v) => {
  expect(() => isValidDate(v)).not.toThrow();
  expect(isValidDate(v)).toBe(false);
});
`,
});

/* E3 — phiếu phiên exploratory: tính số liệu SBTM */
const E3 = jsDe({
  tieuDe: 'Experience-based 3 — Session-based test management: compute the debrief metrics',
  doKho: 'MEDIUM', phut: 15,
  moTa: { en: `<p>Session-based testing gives exploratory testing structure: a <b>charter</b>, a <b>time-box</b> and a <b>session sheet</b> discussed at the debrief. A LabBook session sheet is <code>{ charter, minutes, setup, testing, bugInvestigation, onCharter, bugs, issues }</code>, where <code>setup</code>, <code>testing</code> and <code>bugInvestigation</code> are percentages of the session (they add up to 100), <code>onCharter</code> is the percentage spent on the charter (the rest was “opportunity” testing), and <code>bugs</code>/<code>issues</code> are arrays.</p>
<p>Write <code>debrief(sessions)</code> returning:</p>
<ul><li><code>sessions</code> — number of sessions; <code>hours</code> — total minutes ÷ 60 (2 decimals);</li>
<li><code>testPct</code>, <code>bugPct</code>, <code>setupPct</code> — time-weighted averages over all sessions (2 decimals);</li>
<li><code>onCharterPct</code> — time-weighted average of onCharter (2 decimals);</li>
<li><code>bugsPerHour</code> — total bugs ÷ hours (2 decimals; 0 when no time);</li>
<li><code>charters</code> — distinct charters sorted A→Z; <code>warnings</code> — ids-free messages in this order: <code>'SETUP_HEAVY'</code> if setupPct &gt; 30, <code>'OFF_CHARTER'</code> if onCharterPct &lt; 70, <code>'OPEN_ISSUES'</code> if any session has issues.</li></ul>`, vi: `<p>Session-based testing cho exploratory testing một cấu trúc: <b>charter</b>, <b>khung giờ</b> và <b>phiếu phiên</b> được trao đổi ở buổi debrief. Phiếu phiên LabBook là <code>{ charter, minutes, setup, testing, bugInvestigation, onCharter, bugs, issues }</code>; <code>setup</code>, <code>testing</code>, <code>bugInvestigation</code> là % thời gian phiên (cộng lại 100), <code>onCharter</code> là % dành cho charter (phần còn lại là test “cơ hội”), <code>bugs</code>/<code>issues</code> là mảng.</p>
<p>Viết <code>debrief(sessions)</code> trả các số liệu như bản tiếng Anh: số phiên, số giờ, các trung bình có trọng số theo thời gian (2 chữ số), số bug/giờ, danh sách charter (sắp, không trùng) và cảnh báo theo thứ tự SETUP_HEAVY (&gt; 30% chuẩn bị), OFF_CHARTER (&lt; 70% đúng charter), OPEN_ISSUES (có phiên còn câu hỏi).</p>` },
  yeuCau: [{ en: 'Weighted average: Σ(value × minutes) ÷ Σ minutes. Round only at the end with <code>Math.round(x * 100) / 100</code>.', vi: 'Trung bình có trọng số: Σ(giá trị × phút) ÷ Σ phút. Chỉ làm tròn ở cuối bằng <code>Math.round(x * 100) / 100</code>.' }],
  viDu: [{ input: "debrief([{ charter: 'Waitlist', minutes: 90, setup: 10, testing: 70, bugInvestigation: 20, onCharter: 80, bugs: ['B1','B2'], issues: [] }, { charter: 'Close lab', minutes: 30, setup: 50, testing: 40, bugInvestigation: 10, onCharter: 50, bugs: [], issues: ['Q1'] }])", output: "{ sessions: 2, hours: 2, testPct: 62.5, bugPct: 17.5, setupPct: 20, onCharterPct: 72.5, bugsPerHour: 1, charters: ['Close lab','Waitlist'], warnings: ['OPEN_ISSUES'] }", explanation: 'testPct = (70·90 + 40·30) ÷ 120 = 62.5.|||testPct = (70·90 + 40·30) ÷ 120 = 62,5.' }],
  goiY: ['Cộng dồn tổng phút và Σ(giá trị × phút) cho từng chỉ số trong một vòng lặp.', 'Không có phiên nào ⇒ mọi số = 0, mảng rỗng.'],
  loiHayGap: ['Lấy trung bình thường (không trọng số) — phiên 30 phút nặng ngang phiên 90 phút.', 'Làm tròn từng phiên rồi mới cộng.'],
  giaiThich: '<p>The debrief numbers (TBS: test design & execution, bug investigation, setup) tell the test manager whether sessions are productive: much setup means environment problems, low on-charter time means the charters are wrong or the product is buggier than expected.</p>',
  thuatNgu: [{ en: 'session-based testing', vi: 'kiểm thử theo phiên' }, { en: 'charter', vi: 'nhiệm vụ của phiên khám phá' }, { en: 'time-box', vi: 'khung thời gian cố định' }, { en: 'debrief', vi: 'buổi trao đổi sau phiên' }],
  khaiNiem: ['exploratory testing', 'session-based test management'],
  tep: {
    'debrief.js': [
      'function debrief(sessions) {\n  return { sessions: 0, hours: 0, testPct: 0, bugPct: 0, setupPct: 0, onCharterPct: 0, bugsPerHour: 0, charters: [], warnings: [] };\n}\n',
      `function debrief(sessions) {
  const r2 = (x) => Math.round(x * 100) / 100;
  let min = 0, t = 0, b = 0, s = 0, on = 0, bugs = 0, issues = false;
  const charters = new Set();
  for (const x of sessions) {
    min += x.minutes;
    t += x.testing * x.minutes;
    b += x.bugInvestigation * x.minutes;
    s += x.setup * x.minutes;
    on += x.onCharter * x.minutes;
    bugs += (x.bugs || []).length;
    if ((x.issues || []).length) issues = true;
    charters.add(x.charter);
  }
  const avg = (v) => (min ? r2(v / min) : 0);
  const out = {
    sessions: sessions.length,
    hours: r2(min / 60),
    testPct: avg(t), bugPct: avg(b), setupPct: avg(s), onCharterPct: avg(on),
    bugsPerHour: min ? r2(bugs / (min / 60)) : 0,
    charters: [...charters].sort(),
    warnings: [],
  };
  if (min && out.setupPct > 30) out.warnings.push('SETUP_HEAVY');
  if (min && out.onCharterPct < 70) out.warnings.push('OFF_CHARTER');
  if (issues) out.warnings.push('OPEN_ISSUES');
  return out;
}
`,
    ],
  },
  kiem: [
    kiemTuy({ en: 'the example', vi: 'ví dụ' }, () => { const r = debrief([{ charter: 'Waitlist', minutes: 90, setup: 10, testing: 70, bugInvestigation: 20, onCharter: 80, bugs: ['B1', 'B2'], issues: [] }, { charter: 'Close lab', minutes: 30, setup: 50, testing: 40, bugInvestigation: 10, onCharter: 50, bugs: [], issues: ['Q1'] }]); const w = { sessions: 2, hours: 2, testPct: 62.5, bugPct: 17.5, setupPct: 20, onCharterPct: 72.5, bugsPerHour: 1, charters: ['Close lab', 'Waitlist'], warnings: ['OPEN_ISSUES'] }; return JSON.stringify(r) === JSON.stringify(w) ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'warnings SETUP_HEAVY and OFF_CHARTER', vi: 'cảnh báo SETUP_HEAVY và OFF_CHARTER' }, () => { const r = debrief([{ charter: 'Login', minutes: 60, setup: 40, testing: 50, bugInvestigation: 10, onCharter: 60, bugs: ['B9'], issues: [] }]); return JSON.stringify(r.warnings) === '["SETUP_HEAVY","OFF_CHARTER"]' && r.bugsPerHour === 1 ? 'OK' : 'got warnings ' + JSON.stringify(r.warnings) + ', bugsPerHour ' + r.bugsPerHour; }),
    kiemTuy({ en: 'charters are distinct and sorted', vi: 'charter không trùng và đã sắp' }, () => { const S = (c) => ({ charter: c, minutes: 60, setup: 10, testing: 80, bugInvestigation: 10, onCharter: 90, bugs: [], issues: [] }); const r = debrief([S('b'), S('a'), S('b')]); return JSON.stringify(r.charters) === '["a","b"]' && r.hours === 3 ? 'OK' : 'got ' + JSON.stringify(r.charters) + ', hours ' + r.hours; }),
    kiemTuy({ en: 'no sessions', vi: 'không có phiên' }, () => { const r = debrief([]); return r.sessions === 0 && r.hours === 0 && r.bugsPerHour === 0 && r.charters.length === 0 && r.warnings.length === 0 ? 'OK' : 'got ' + JSON.stringify(r); }, { an: true }),
    kiemTuy({ en: 'rounding happens at the end', vi: 'chỉ làm tròn ở cuối' }, () => { const r = debrief([{ charter: 'x', minutes: 45, setup: 33, testing: 33, bugInvestigation: 34, onCharter: 71, bugs: ['a'], issues: [] }, { charter: 'y', minutes: 25, setup: 20, testing: 60, bugInvestigation: 20, onCharter: 100, bugs: [], issues: [] }]); return r.setupPct === 28.36 && r.testPct === 42.64 && r.onCharterPct === 81.36 && r.bugsPerHour === 0.86 && r.hours === 1.17 ? 'OK' : 'got ' + JSON.stringify(r); }, { an: true }),
  ],
});

const E4 = tinhDe({
  tieuDe: 'Experience-based 4 — Exam questions (K2)',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p>Six questions in the style of SWT4 slides 106–108 and the FE: why experience-based testing is used, when exploratory testing fits best, what a checklist is built from and what the weaknesses of each technique are.</p>', vi: '<p>Sáu câu theo kiểu slide SWT4 106–108 và đề FE: vì sao dùng test dựa kinh nghiệm, khi nào exploratory hợp nhất, checklist được xây từ đâu và điểm yếu của từng kỹ thuật.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('Which is a good reason to use experience-based testing?', 'Đâu là lý do tốt để dùng test dựa kinh nghiệm?'), luaChon: lc(['a', 'It is easy to automate'], ['b', 'It can find defects that other, more systematic techniques miss'], ['c', 'It uses the experience of the end users'], ['d', 'Its coverage is easy to measure']), dapAn: ['b'], giaiThich: giai('Slide 101, bullet 2.', 'Slide 101, gạch đầu dòng 2.') },
    { ma: 'q2', de: hai('Exploratory testing with time-boxes and charters is called…', 'Exploratory testing với khung giờ và charter được gọi là…'), luaChon: lc(['a', 'checklist-based testing'], ['b', 'session-based testing'], ['c', 'error guessing'], ['d', 'ad hoc testing']), dapAn: ['b'], giaiThich: giai('Time-box + charter = session-based testing.', 'Khung giờ + charter = session-based testing.') },
    { ma: 'q3', de: hai('When is exploratory testing most useful?', 'Khi nào exploratory testing hữu ích nhất?'), luaChon: lc(['a', 'When there are few or inadequate specifications or significant time pressure'], ['b', 'When regulators require full traceability'], ['c', 'When the system is safety-critical and fully specified'], ['d', 'Only after all other techniques']), dapAn: ['a'], giaiThich: giai('It complements formal techniques and suits reactive strategies.', 'Nó bổ sung kỹ thuật chính thức và hợp chiến lược phản ứng.') },
    { ma: 'q4', de: hai('A checklist for checklist-based testing is built from…', 'Checklist cho kiểm thử theo checklist được xây từ…'), luaChon: lc(['a', 'the source code only'], ['b', 'experience, knowledge of what is important for the user, and an understanding of why and how software fails'], ['c', 'the test summary report'], ['d', 'random ideas']), dapAn: ['b'], giaiThich: giai('Slide 105.', 'Slide 105.') },
    { ma: 'q5', de: hai('Which is a typical weakness of checklist-based testing?', 'Đâu là điểm yếu điển hình của test theo checklist?'), luaChon: lc(['a', 'It cannot be used for non-functional testing'], ['b', 'High-level items lead to variability between testers and less repeatability'], ['c', 'It needs detailed test cases'], ['d', 'It only works for code']), dapAn: ['b'], giaiThich: giai('Variability gives somewhat more coverage but less repeatability.', 'Biến thiên cho coverage rộng hơn chút nhưng khó lặp lại.') },
    { ma: 'q6', de: hai('Error guessing is best described as…', 'Mô tả đúng nhất về error guessing là…'), luaChon: lc(['a', 'random input generation'], ['b', 'a methodical approach: list possible mistakes, defects and failures, then design tests to expose them'], ['c', 'guessing the expected results'], ['d', 'testing without any preparation']), dapAn: ['b'], giaiThich: giai('The fault attack list.', 'Danh sách fault attack.') },
  ],
  goiY: ['Đọc lại 4 phát biểu của slide 101: nguồn, sức mạnh, biến thiên, khó đo.', 'Session-based = khung giờ + charter + phiếu phiên + debrief.'],
  loiHayGap: ['Chọn “kinh nghiệm của người dùng cuối” cho câu 1.', 'Chọn “ad hoc” cho câu 2 — exploratory có mục tiêu và ghi chép.'],
  giaiThich: '<p>Answers: b · b · a · b · b · b.</p>',
  thuatNgu: [{ en: 'reactive test strategy', vi: 'chiến lược test phản ứng — thiết kế test khi đã có phần mềm' }],
  khaiNiem: ['experience-based techniques'],
});

export default doiDau({
  slug: 'swt301-experience-based',
  ten: '6.1 Experience-based techniques: error guessing, exploratory, checklist',
  moTaModule: 'Nhận diện ba kỹ thuật dựa kinh nghiệm trên LabBook, viết danh sách tấn công (error guessing) cho isValidDate chấm bằng mutant, tính số liệu debrief của session-based testing, câu thi.',
  khoa: KHOA,
  baiHoc: 'swt301-experience-based',
  de: [E1, E2, E3, E4],
});
