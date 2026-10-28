/**
 * Kỹ năng nghề · 📝 Bài lớn chương 3 — "Bản in": phần Summary + Conclusion của Report 5.3 Lab 4 (SWT301, hạn T7 31/10/2026).
 * Số liệu thật (~/Documents/SWT301-SportShop/bao-cao, ON-TAP-REVIEW.md mục 5): 5 workflow A-WF1…A-WF5, 18 ca, 48 bước, 3 round,
 * 144 ảnh, mỗi round 12 P / 6 F; fail: RG01 SS-33 · AC05 SS-27 · AC06, AC07 SS-31 · FP01 SS-32 · RL02 SS-19.
 * Máy chấm kiểm CẤU TRÚC + đối chiếu SỐ với bảng; chất lượng câu chữ = rubric tự chấm (LUU_Y).
 */
import { moDun, kiemVB, LUU_Y, TN } from './_chung.mjs';

const DAU = `// SWT301 Lab 4 — Report 5.3, module A: write the Summary and the Conclusion (≤ 200 words together).
// English or Vietnamese. Write inside the backticks (no backtick or \${ in your text).

// 1) Copy the numbers from YOUR Test Statistics sheet (latest round).
const RESULTS = { workflows: 0, cases: 0, steps: 0, rounds: 0, passed: 0, failed: 0 };

// 2) Summary: first sentence = the result with numbers (someone who reads only it knows the outcome).
const SUMMARY = ´´;

// 3) Conclusion: verdict + residual risk + recommendation (what to fix first, what to re-run).
const CONCLUSION = ´´;

// 4) Self-check, honestly (true / false).
const RUBRIC = {
  thirtySeconds: null,     // a classmate who reads it for 30 s can tell the result
  numbersMatchTable: null, // every number appears in the statistics sheet
  residualRisk: null,      // the conclusion names the biggest remaining risk for users
  recommendation: null,    // it says what to fix first and what to re-run
  noBlame: null,           // no person or team is blamed
  ticketsTraceable: null,  // every defect id can be found in CT Work / the bug list
};
`;

const GIAI = `// SWT301 Lab 4 — Report 5.3, module A — Summary + Conclusion (model answer, run of 28/10/2026).

const RESULTS = { workflows: 5, cases: 18, steps: 48, rounds: 3, passed: 12, failed: 6 };

const SUMMARY = ´Module A passes 12 of 18 system test cases (66.67%) in each of 3 rounds; the 6 failures trace to 5 open defects. The 5 customer workflows (A-WF1 to A-WF5, 48 steps) were run end to end in Chromium with one screenshot per step and round, 144 in total. Results were identical across rounds on a freshly loaded database, so the failures are reproducible. Failed cases: RL02 (SS-19, a guest gets HTTP 500 on /dashboard), AC05 (SS-27, a duplicate e-mail is reported as saved), AC06 and AC07 (SS-31, logout fails from two pages), FP01 (SS-32, password reset is not implemented) and RG01 (SS-33, “Member Since” shows the birth date).´;

const CONCLUSION = ´Module A is not ready for release. The highest residual risk is SS-31: a customer who cannot log out on a shared computer leaves the account open to the next person. We recommend fixing SS-31 and SS-19 first, then SS-27, and re-running AC05 to AC07 and RL02 in round 4; SS-32 and SS-33 can follow in the next release.´;

const RUBRIC = {
  thirtySeconds: true, numbersMatchTable: true, residualRisk: true,
  recommendation: true, noBlame: true, ticketsTraceable: true,
};
`;

const BAN_IN = {
  tieuDe: 'Capstone — Summary and Conclusion of Report 5.3 (Lab 4)',
  phu: { en: 'Technical writing · SportShop module A · ≤ 200 words · numbers checked against the real statistics · 10 marks (structural grading + self-rubric)', vi: 'Viết kỹ thuật · SportShop module A · ≤ 200 từ · số liệu đối chiếu với thống kê thật · 10 điểm (máy chấm cấu trúc + rubric tự chấm)' },
  moTa: {
    en: `<p>Report 5.3 is due on Saturday. Most readers — the teacher, a reviewer, your future OJT mentor — read only the <b>Summary</b> and the <b>Conclusion</b>. Write both for your real Lab 4 run, in at most <b>200 words together</b>.</p>
<p>Your statistics (Report 5.3, module A, run of 28/10/2026): <b>5</b> workflows (A-WF1…A-WF5), <b>18</b> cases, <b>48</b> steps, <b>3</b> rounds, one screenshot per step per round (144), every round <b>12 pass / 6 fail</b>. Failed: RG01 (SS-33 “Member Since” shows the birth date) · AC05 (SS-27 duplicate e-mail reported as saved) · AC06, AC07 (SS-31 logout returns 405 / does not log out) · FP01 (SS-32 password reset not implemented, /reset 404) · RL02 (SS-19 guest on /dashboard gets HTTP 500).</p>
<p><b>What the grader can and cannot do.</b> It checks length, the first-sentence rule, that every number and percentage agrees with the statistics above, that the defect ids are the Lab 4 ones, and that the conclusion has a verdict, a risk and a recommendation. It cannot tell whether your sentences are clear — the 6-point self-rubric and a classmate reading it for 30 seconds can. AI grading is not available yet.</p>`,
    vi: `<p>Report 5.3 nộp thứ Bảy. Phần lớn người đọc — cô, người review, mentor OJT sau này — chỉ đọc <b>Summary</b> và <b>Conclusion</b>. Viết cả hai cho lần chạy Lab 4 thật của bạn, tổng cộng tối đa <b>200 từ</b>.</p>
<p>Thống kê (Report 5.3, module A, lần chạy 28/10/2026): <b>5</b> workflow, <b>18</b> ca, <b>48</b> bước, <b>3</b> round, mỗi bước mỗi round một ảnh (144), mỗi round <b>12 đạt / 6 fail</b>. Fail: RG01 (SS-33) · AC05 (SS-27) · AC06, AC07 (SS-31) · FP01 (SS-32) · RL02 (SS-19).</p>
<p><b>Máy chấm làm được gì và không.</b> Nó kiểm độ dài, luật câu đầu, mọi con số/phần trăm khớp thống kê, mã lỗi đúng của Lab 4, và kết luận có phán quyết, rủi ro, đề xuất. Nó không biết câu của bạn có rõ không — rubric 6 điểm và một bạn đọc thử 30 giây mới biết. Chưa có chấm bằng AI.</p>`,
  },
  chucNangChinh: [
    { en: 'RESULTS: the six numbers copied from the statistics sheet.', vi: 'RESULTS: sáu con số chép từ sheet thống kê.' },
    { en: 'SUMMARY: result first, then scope and method, then the failed cases with their tickets.', vi: 'SUMMARY: kết quả trước, rồi phạm vi và cách làm, rồi các ca fail kèm mã lỗi.' },
    { en: 'CONCLUSION: verdict, the biggest residual risk, what to fix and re-run first.', vi: 'CONCLUSION: phán quyết, rủi ro còn lại lớn nhất, sửa và chạy lại gì trước.' },
    { en: 'RUBRIC: six honest self-checks.', vi: 'RUBRIC: sáu tự kiểm trung thực.' },
  ],
  yeuCauChung: [
    LUU_Y,
    { en: 'Use the numbers of THIS lab only — 72.73% (Lab 3) or 82.30% (Lab 2) in a Lab 4 summary is a classic copy-paste error.', vi: 'Chỉ dùng số của lab NÀY — 72,73% (Lab 3) hay 82,30% (Lab 2) trong tóm tắt Lab 4 là lỗi chép-dán kinh điển.' },
    { en: 'Run your text through your Linter 2 (lesson 3.5) before submitting.', vi: 'Chạy văn bản qua Linter 2 của bạn (bài 3.5) trước khi nộp.' },
  ],
  cayThuMuc: `report53.js
├── RESULTS     ← { workflows, cases, steps, rounds, passed, failed }
├── SUMMARY     ← string
├── CONCLUSION  ← string
└── RUBRIC      ← { 6 self-checks: true | false }`,
  moHinh: {
    ten: 'report53.js — the four constants',
    truong: [
      ['RESULTS', 'object of numbers', { en: 'must equal the statistics sheet', vi: 'phải bằng sheet thống kê' }],
      ['SUMMARY', 'string', { en: 'first sentence ≤ 35 words with a number; names the failed cases’ tickets', vi: 'câu đầu ≤ 35 từ có số; nêu mã lỗi của các ca fail' }],
      ['CONCLUSION', 'string', { en: 'verdict + residual risk + recommendation; no vague or blame words', vi: 'phán quyết + rủi ro còn lại + đề xuất; không từ mơ hồ/đổ lỗi' }],
      ['RUBRIC.<check>', 'boolean', { en: 'all six answered', vi: 'trả lời đủ sáu' }],
    ],
  },
  duLieuMau: `SUMMARY    = ´Module A passes 12 of 18 system test cases (66.67%) in each of 3 rounds; … ´
CONCLUSION = ´Module A is not ready for release. The highest residual risk is … We recommend … ´`,
  chucNang: [
    {
      ten: { en: 'Length and first sentence', vi: 'Độ dài và câu đầu' }, diem: 2,
      yeuCau: [
        { en: 'SUMMARY + CONCLUSION: 60–200 words.', vi: 'SUMMARY + CONCLUSION: 60–200 từ.' },
        { en: 'The first sentence of SUMMARY has ≤ 35 words and contains a number.', vi: 'Câu đầu của SUMMARY ≤ 35 từ và có con số.' },
      ],
      hook: ['BLUF'],
    },
    {
      ten: { en: 'Numbers agree with the table', vi: 'Số liệu khớp bảng' }, diem: 3,
      yeuCau: [
        { en: 'RESULTS equals the statistics; passed + failed = cases.', vi: 'RESULTS bằng thống kê; passed + failed = cases.' },
        { en: 'SUMMARY states 12, 18 and the pass rate 66.67% (66.7% accepted).', vi: 'SUMMARY nêu 12, 18 và tỉ lệ đạt 66.67% (chấp nhận 66.7%).' },
        { en: 'Every percentage in the text is one the table supports (66.67 / 66.7 / 33.33 / 33.3 / 100).', vi: 'Mọi phần trăm trong văn bản đều được bảng chứng minh (66.67 / 66.7 / 33.33 / 33.3 / 100).' },
      ],
    },
    {
      ten: { en: 'Defects named correctly', vi: 'Nêu đúng lỗi' }, diem: 2,
      yeuCau: [
        { en: 'At least 3 of the Lab 4 tickets SS-19, SS-27, SS-31, SS-32, SS-33; no ticket from another lab.', vi: 'Ít nhất 3 trong các thẻ Lab 4 SS-19, SS-27, SS-31, SS-32, SS-33; không có thẻ của lab khác.' },
      ],
    },
    {
      ten: { en: 'A real conclusion', vi: 'Kết luận đúng nghĩa' }, diem: 2,
      yeuCau: [
        { en: 'CONCLUSION gives a verdict (ready / not ready / release…), a residual risk and a recommendation.', vi: 'CONCLUSION có phán quyết (sẵn sàng / chưa / phát hành…), rủi ro còn lại và đề xuất.' },
        { en: 'No vague words and no blame in SUMMARY or CONCLUSION.', vi: 'Không từ mơ hồ, không đổ lỗi trong SUMMARY và CONCLUSION.' },
      ],
    },
    {
      ten: { en: 'Self-rubric', vi: 'Rubric tự chấm' }, diem: 1,
      yeuCau: [{ en: 'All six checks answered true or false.', vi: 'Cả sáu mục trả lời true hoặc false.' }],
    },
  ],
  truDiem: [
    { en: 'Using the Lab 3 rate (72.73%) or counting 6 failures as 6 defects (AC06 and AC07 share SS-31).', vi: 'Dùng tỉ lệ Lab 3 (72,73%) hoặc đếm 6 ca fail thành 6 lỗi (AC06 và AC07 chung SS-31).' },
    { en: '“We learned a lot” as the conclusion.', vi: '"Em học được nhiều" làm kết luận.' },
    { en: 'Statistics taken from Round 1 when the report is about the latest round.', vi: 'Thống kê lấy Round 1 trong khi báo cáo nói về round mới nhất.' },
  ],
  nopBai: { en: 'Submit report53.js; paste the two texts into Report 5.3 (or the Docs page on CT Work).', vi: 'Nộp report53.js; dán hai đoạn vào Report 5.3 (hoặc trang Docs trên CT Work).' },
};

const KIEM = [
  kiemVB({ en: 'Length: SUMMARY + CONCLUSION 60–200 words', vi: 'Độ dài: SUMMARY + CONCLUSION 60–200 từ' }, () => { const n = __V.w(SUMMARY) + __V.w(CONCLUSION); return n >= 60 && n <= 200 ? 'OK' : n + ' words — need 60–200'; }, { nhom: 'f1' }),
  kiemVB({ en: 'First sentence: ≤ 35 words with a number', vi: 'Câu đầu: ≤ 35 từ, có số' }, () => { const c = __V.cau(SUMMARY)[0] || ''; if (!c) return 'SUMMARY is empty'; if (__V.w(c) > 35) return 'the first sentence has ' + __V.w(c) + ' words'; return /\d/.test(c) ? 'OK' : 'the first sentence has no number — put the result first'; }, { nhom: 'f1' }),
  kiemVB({ en: 'RESULTS equals the statistics sheet', vi: 'RESULTS bằng sheet thống kê' }, () => { const w = { workflows: 5, cases: 18, steps: 48, rounds: 3, passed: 12, failed: 6 }; const sai = Object.keys(w).filter((k) => !RESULTS || RESULTS[k] !== w[k]); if (sai.length) return 'check: ' + sai.join(', '); return RESULTS.passed + RESULTS.failed === RESULTS.cases ? 'OK' : 'passed + failed ≠ cases'; }, { nhom: 'f2' }),
  kiemVB({ en: 'SUMMARY states 12, 18 and 66.67%', vi: 'SUMMARY nêu 12, 18 và 66.67%' }, () => { const co = (x) => __V.coTu(SUMMARY, [x]).length > 0; const t = []; if (!co('12')) t.push('12'); if (!co('18')) t.push('18'); if (!(co('66.67%') || co('66.7%') || co('66,67%') || co('66,7%'))) t.push('66.67%'); return t.length ? 'missing: ' + t.join(', ') : 'OK'; }, { nhom: 'f2' }),
  kiemVB({ en: 'Every percentage is supported by the table', vi: 'Mọi phần trăm đều có trong bảng' }, () => { const all = __V.s(SUMMARY) + ' ' + __V.s(CONCLUSION); const ps = (all.match(/\d+(?:[.,]\d+)?\s*%/g) || []).map((p) => parseFloat(p.replace(',', '.'))); const ok = [66.67, 66.7, 33.33, 33.3, 100]; const la = ps.filter((p) => ok.indexOf(p) < 0); return la.length ? 'not from this table: ' + la.join('%, ') + '%' : 'OK'; }, { nhom: 'f2' }),
  kiemVB({ en: 'Defects: ≥ 3 Lab 4 tickets, none from other labs', vi: 'Lỗi: ≥ 3 thẻ Lab 4, không thẻ của lab khác' }, () => { const all = __V.s(SUMMARY) + ' ' + __V.s(CONCLUSION); const ids = Array.from(new Set((all.match(/SS-\d+/gi) || []).map((x) => x.toUpperCase()))); const lab4 = ['SS-19', 'SS-27', 'SS-31', 'SS-32', 'SS-33']; const la = ids.filter((x) => lab4.indexOf(x) < 0); if (la.length) return 'not a Lab 4 failure: ' + la.join(', '); return ids.length >= 3 ? 'OK' : 'name at least 3 of ' + lab4.join(', '); }, { nhom: 'f3' }),
  kiemVB({ en: 'Conclusion: verdict + residual risk + recommendation', vi: 'Kết luận: phán quyết + rủi ro còn lại + đề xuất' }, () => { const c = __V.s(CONCLUSION); const t = []; if (!__V.coTu(c, ['ready', 'not ready', 'release', 'go', 'no-go', 'sẵn sàng', 'phát hành', 'chưa đạt', 'đạt']).length) t.push('a verdict'); if (!__V.coTu(c, ['risk', 'rủi ro']).length) t.push('the residual risk'); if (!__V.coTu(c, ['recommend', 'should', 'must', 'fix', 'đề xuất', 'nên', 'cần', 'sửa']).length) t.push('a recommendation'); return t.length ? 'the conclusion needs ' + t.join(', ') : 'OK'; }, { nhom: 'f4' }),
  kiemVB({ en: 'No vague words, no blame', vi: 'Không từ mơ hồ, không đổ lỗi' }, () => { const all = __V.s(SUMMARY) + ' ' + __V.s(CONCLUSION); const f = __V.vague(all).concat(__V.blame(all)); return f.length ? 'remove: ' + f.join(', ') : 'OK'; }, { nhom: 'f4' }),
  kiemVB({ en: 'Self-rubric: all six checks answered', vi: 'Rubric tự chấm: đủ sáu mục' }, () => { const r = RUBRIC || {}; const ks = ['thirtySeconds', 'numbersMatchTable', 'residualRisk', 'recommendation', 'noBlame', 'ticketsTraceable']; const chua = ks.filter((k) => typeof r[k] !== 'boolean'); return chua.length ? 'answer true/false: ' + chua.join(', ') : 'OK'; }, { nhom: 'f5' }),
];

export default moDun({
  slug: 'ssg105-3-lab-report53-summary',
  ten: 'Capstone 3 — Summary + Conclusion of your Report 5.3 (Lab 4)',
  moTaModule: 'Bài lớn chương 3 (bản in): viết Summary + Conclusion ≤ 200 từ cho Report 5.3 Lab 4 thật (5 workflow, 18 ca, 3 round, 12 đạt / 6 fail, 66,67%) — câu đầu nói kết quả, số khớp bảng, đúng mã lỗi Lab 4, kết luận có phán quyết/rủi ro/đề xuất, rubric tự chấm. Máy chấm kiểm cấu trúc và số liệu.',
  baiHoc: 'ssg105-3-1-writing',
  de: [{
    dangBai: 'lab',
    tieuDe: 'Capstone 3 — Summary + Conclusion of Report 5.3 (Lab 4)',
    doKho: 'HARD', phut: 60, diem: 50,
    ngonNgu: 'javascript',
    viDu: [{ input: 'SUMMARY = ´In this report we present the system testing of module A …´', output: '✗ First sentence: ≤ 35 words with a number', explanation: 'Start with the result: “Module A passes 12 of 18 system test cases (66.67%) in each of 3 rounds …”|||Mở bằng kết quả: "Module A đạt 12/18 ca test hệ thống (66,67%) ở cả 3 round …"' }],
    khaiNiem: ['executive summary', 'conclusion', 'numbers consistency', 'residual risk'],
    tienQuyet: ['3.1 Technical writing', '3.2 Lab report structure', '3.5 Report linter'],
    the: ['swt301', 'report-5.3', 'technical-writing', 'capstone'],
    banIn: BAN_IN,
    thuatNgu: [TN.bluf, TN.residualRisk, TN.successfulCoverage, TN.measurable, { en: 'verdict', vi: 'phán quyết — sẵn sàng / chưa sẵn sàng phát hành' }, { en: 'executive summary', vi: 'tóm tắt cho người đọc bận — kết quả trước, chi tiết sau' }],
    goiY: [
      'Câu đầu: "Module A passes 12 of 18 … (66.67%) in each of 3 rounds; the 6 failures trace to 5 open defects."',
      'Đếm mã lỗi KHÁC NHAU: AC06 và AC07 cùng SS-31 ⇒ 6 ca fail = 5 lỗi.',
      'Rủi ro còn lại = lỗi nào hại người dùng nhất nếu phát hành hôm nay — giải thích bằng một hậu quả cụ thể.',
      'Đề xuất = sửa gì trước + chạy lại ca nào ở round 4.',
    ],
    loiHayGap: [
      'Chép tỉ lệ 72,73% của Lab 3 sang Lab 4.',
      'Mở bằng "In this report we present…" — câu đầu không có kết quả.',
      'Nêu SS-28 (lỗi của Lab 3) trong báo cáo Lab 4.',
      'Kết luận "the system works quite well" — vừa mơ hồ vừa sai với 6 ca fail.',
    ],
    giaiThich: {
      en: '<p>The model summary puts the outcome, the ratio and the defect count in its first sentence, then scope and method in one sentence, the stability argument in one, and the failed cases with their tickets and user-visible symptoms. The conclusion gives a verdict, explains the biggest residual risk as a user consequence (a shared computer), and orders the fixes and the re-runs. 160-odd words, every number traceable to the statistics sheet.</p>',
      vi: `<p>Bản tóm tắt mẫu đặt kết quả, tỉ lệ và số lỗi ngay câu đầu, rồi phạm vi và cách làm trong một câu, lập luận về độ ổn định một câu, và các ca fail kèm mã lỗi và triệu chứng người dùng thấy. Kết luận có phán quyết, giải thích rủi ro còn lại lớn nhất bằng hậu quả cho người dùng (máy dùng chung), và sắp thứ tự sửa và chạy lại. Khoảng 160 từ, mọi con số truy được về sheet thống kê.</p>
<p>Bản tiếng Việt tham khảo: "Module A đạt 12/18 ca kiểm thử hệ thống (66,67%) ở cả 3 round; 6 ca fail ứng với 5 lỗi đang mở. … Module A chưa sẵn sàng phát hành. Rủi ro còn lại lớn nhất là SS-31: khách không đăng xuất được trên máy dùng chung thì tài khoản bị người sau dùng tiếp. Đề xuất sửa SS-31 và SS-19 trước, rồi SS-27, chạy lại AC05–AC07 và RL02 ở round 4; SS-32, SS-33 để bản sau."</p>`,
    },
    loaiKiem: 'js',
    tests: { loai: 'js', phienBan: 1, tepNap: ['report53.js'], kiem: KIEM },
    khoiDau: { 'report53.js': DAU },
    loiGiai: { 'report53.js': GIAI },
    boYeu: [
      { ten: 'chép tỉ lệ Lab 3', tep: { 'report53.js': GIAI.replace('(66.67%)', '(72.73%)') }, phaiTruot: ['percentage'] },
      { ten: 'RESULTS sai (lấy số Lab 3)', tep: { 'report53.js': GIAI.replace('cases: 18, steps: 48, rounds: 3, passed: 12', 'cases: 22, steps: 48, rounds: 3, passed: 16') }, phaiTruot: ['RESULTS equals'] },
      { ten: 'kết luận không có rủi ro', tep: { 'report53.js': GIAI.replace('The highest residual risk is SS-31: a customer who cannot log out on a shared computer leaves the account open to the next person. ', '') }, phaiTruot: ['Conclusion'] },
      { ten: 'nêu SS-28 của Lab 3', tep: { 'report53.js': GIAI.replace('fixing SS-31 and SS-19 first', 'fixing SS-28, SS-31 and SS-19 first') }, phaiTruot: ['Defects'] },
      { ten: 'mở bằng câu không có kết quả', tep: { 'report53.js': GIAI.replace('const SUMMARY = ´Module A passes', 'const SUMMARY = ´In this report we present the system testing of module A of SportShop. Module A passes') }, phaiTruot: ['First sentence'] },
      { ten: 'kết luận mơ hồ', tep: { 'report53.js': GIAI.replace('Module A is not ready for release.', 'Module A works quite well but is not ready for release.') }, phaiTruot: ['No vague words'] },
    ],
  }],
});
