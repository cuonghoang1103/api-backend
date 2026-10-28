/**
 * SWT301 · 7.3 — Test monitoring & control: metrics, progress and summary reports (SWT5 slide 59–73, LO-5.3.1–5.3.2).
 */
import { doiDau, KHOA, hai, giai, lc } from './_chung.mjs';
import { tinhDe, jsDe, kiemTuy } from './_de.mjs';

const BC = ['Test progress report', 'Test summary report', 'Both'];
const E1 = tinhDe({
  tieuDe: 'Monitoring 1 — Progress report or summary report?',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>A <b>test progress report</b> is produced regularly during a test activity and leads to control actions; a <b>test summary report</b> is produced at the end and supports release and completion decisions. Some content appears in both. Classify each item.</p>', vi: '<p><b>Báo cáo tiến độ</b> được làm định kỳ trong lúc test và dẫn tới hành động kiểm soát; <b>báo cáo tổng kết</b> làm ở cuối và hỗ trợ quyết định phát hành, hoàn tất. Một số nội dung có ở cả hai. Phân loại từng mục.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Item → report', 'Mục → báo cáo'),
    cot: [{ ma: 'i', ten: 'Item' }, { ma: 'r', ten: 'Report', luaChon: BC }],
    hang: [
      'Testing planned for the next reporting period',
      'Factors impeding progress right now (the test server is down every afternoon)',
      'Residual risks for go-live and reusable test work products',
      'Status of test activities and progress against the test plan',
      'Metrics of defects, test cases, coverage and effort',
      'Overall evaluation of the product quality to support the release decision',
    ].map((i, k) => ({ ma: `r${k}`, o: { i } })),
    dapAn: { 'r0.r': BC[0], 'r1.r': BC[0], 'r2.r': BC[1], 'r3.r': BC[2], 'r4.r': BC[2], 'r5.r': BC[1] },
    giaiThich: giai('Only progress reports: next period, current impediments. Only summary reports: residual risks, reusable work products, overall evaluation. Both: status vs plan, metrics, deviations.', 'Chỉ báo cáo tiến độ: kỳ tới, trở ngại hiện tại. Chỉ báo cáo tổng kết: rủi ro còn lại, sản phẩm tái dùng, đánh giá tổng thể. Cả hai: tình trạng so với kế hoạch, số đo, sai lệch.'),
  }],
  goiY: ['“Kỳ tới”, “đang cản trở” ⇒ tiến độ.', '“Rủi ro còn lại, tái dùng, đánh giá tổng thể” ⇒ tổng kết.'],
  loiHayGap: ['Gán số đo chỉ cho báo cáo tổng kết.', 'Gán “kế hoạch kỳ tới” cho tổng kết.'],
  giaiThich: '<p>Progress · Progress · Summary · Both · Both · Summary.</p>',
  thuatNgu: [{ en: 'test progress report (status report)', vi: 'báo cáo tiến độ test' }, { en: 'test summary report (completion report)', vi: 'báo cáo tổng kết test' }],
  khaiNiem: ['test reports'],
});

const HD = ['Re-prioritise tests', 'Change the test execution schedule', 'Re-evaluate the exit criteria with stakeholders', 'Add resources / ask for a fix'];
const E2 = tinhDe({
  tieuDe: 'Monitoring 2 — Choose the control action',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Test control takes action when monitoring shows a deviation. The syllabus names: re-prioritising tests when an identified risk occurs, changing the execution schedule because of availability of the test environment or resources, re-evaluating whether an item meets an exit criterion after rework. Pick the most appropriate action.</p>', vi: '<p>Kiểm soát test hành động khi giám sát thấy sai lệch. Syllabus nêu: sắp lại ưu tiên khi rủi ro đã nhận diện xảy ra, đổi lịch chạy vì môi trường hay nguồn lực, đánh giá lại tiêu chí ra sau khi sửa. Chọn hành động phù hợp nhất.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Situation → control action', 'Tình huống → hành động kiểm soát'),
    cot: [{ ma: 's', ten: 'Situation' }, { ma: 'a', ten: 'Action', luaChon: HD }],
    hang: [
      'The payment gateway (a known high risk) failed in production at another university last week',
      'The load-test server is booked by another project until Thursday',
      'The PO asks whether release 2.1 can go live with 3 open Minor defects instead of 0',
      'The cancellation module blocks 40% of the planned tests because of one crash',
    ].map((s, i) => ({ ma: `r${i}`, o: { s } })),
    dapAn: { 'r0.a': HD[0], 'r1.a': HD[1], 'r2.a': HD[2], 'r3.a': HD[3] },
    giaiThich: giai('A risk materialises → re-prioritise; environment unavailable → reschedule; criteria questioned → re-evaluate with stakeholders; a blocking defect → ask for a fix (and resources).', 'Rủi ro xảy ra → sắp lại ưu tiên; môi trường không có → đổi lịch; tiêu chí bị chất vấn → đánh giá lại với các bên; lỗi chặn → xin sửa gấp (và nguồn lực).'),
  }],
  goiY: ['Môi trường/nguồn lực ⇒ đổi lịch.', 'Lỗi chặn nhiều test ⇒ xin sửa gấp.'],
  loiHayGap: ['Đổi tiêu chí ra một mình mà không có các bên liên quan.', 'Bỏ qua test bị chặn thay vì xin sửa lỗi chặn.'],
  giaiThich: '<p>Re-prioritise · Reschedule · Re-evaluate · Fix/resources.</p>',
  thuatNgu: [{ en: 'test control', vi: 'kiểm soát test — hành động điều chỉnh' }, { en: 'blocking defect', vi: 'lỗi chặn — làm nhiều test không chạy được' }],
  khaiNiem: ['test control'],
});

const E3 = jsDe({
  tieuDe: 'Monitoring 3 — Compute the weekly progress report',
  doKho: 'MEDIUM', phut: 18,
  moTa: { en: `<p>Write <code>progress(p)</code> for the LabBook weekly report. Input:</p>
<pre>{ planned, plannedByNow, executed, passed, failed, blocked,
  defects: [ { severity: 'Critical'|'Major'|'Minor', open: true|false } ],
  foundBefore, foundAfterRelease, kloc }</pre>
<p>Return (percentages and densities rounded to 2 decimals):</p>
<ul>
<li><code>executedPct</code> = executed ÷ planned × 100; <code>expectedPct</code> = plannedByNow ÷ planned × 100;</li>
<li><code>passRate</code> = passed ÷ executed × 100 (0 if nothing executed);</li>
<li><code>openCritical</code>, <code>openMajor</code> — open defects of that severity;</li>
<li><code>density</code> = all defects ÷ kloc (defects per thousand lines of code);</li>
<li><code>ddp</code> = defect detection percentage = foundBefore ÷ (foundBefore + foundAfterRelease) × 100 (null if both 0);</li>
<li><code>status</code> = <code>'RED'</code> if an open Critical exists or executed is more than 20 percentage points behind expected; else <code>'AMBER'</code> if behind at all or passRate &lt; 90; else <code>'GREEN'</code>.</li></ul>`, vi: `<p>Viết <code>progress(p)</code> cho báo cáo tuần của LabBook với đầu vào và đầu ra như khối trên: % đã chạy, % lẽ ra phải chạy tới giờ, tỉ lệ đạt, số lỗi Critical/Major còn mở, mật độ lỗi trên KLOC, DDP (tỉ lệ phát hiện lỗi trước phát hành), và trạng thái RED/AMBER/GREEN theo luật trên.</p>` },
  yeuCau: [{ en: 'executedPct − expectedPct is the deviation; “more than 20 points behind” means expectedPct − executedPct &gt; 20.', vi: 'executedPct − expectedPct là sai lệch; “chậm hơn 20 điểm” nghĩa là expectedPct − executedPct &gt; 20.' }],
  viDu: [{ input: "progress({ planned: 200, plannedByNow: 100, executed: 70, passed: 52, failed: 15, blocked: 3, defects: [{severity:'Major',open:true},{severity:'Minor',open:false}], foundBefore: 180, foundAfterRelease: 20, kloc: 12.5 })", output: "{ executedPct: 35, expectedPct: 50, passRate: 74.29, openCritical: 0, openMajor: 1, density: 0.16, ddp: 90, status: 'AMBER' }", explanation: '15 points behind (not > 20) but behind ⇒ AMBER.|||Chậm 15 điểm (không > 20) nhưng vẫn chậm ⇒ AMBER.' }],
  goiY: ['Tính các con số trước, xét trạng thái sau: RED trước, rồi AMBER, cuối cùng GREEN.', 'DDP chỉ dùng hai số foundBefore và foundAfterRelease.'],
  loiHayGap: ['Tính passRate trên số test dự kiến thay vì số đã chạy.', 'Cho RED khi chậm đúng 20 điểm.'],
  giaiThich: '<p>These are the metrics of LO-5.3.1: progress against plan, test-case results, defect information (severity, density, DDP) — and a simple traffic light that tells the reader where control is needed.</p>',
  thuatNgu: [{ en: 'defect density', vi: 'mật độ lỗi — lỗi trên nghìn dòng mã' }, { en: 'DDP (defect detection percentage)', vi: 'tỉ lệ lỗi phát hiện trước khi phát hành' }, { en: 'RAG status', vi: 'trạng thái đỏ/vàng/xanh' }],
  khaiNiem: ['test metrics', 'test monitoring'],
  tep: {
    'progress.js': [
      "function progress(p) {\n  return { executedPct: 0, expectedPct: 0, passRate: 0, openCritical: 0, openMajor: 0, density: 0, ddp: null, status: 'GREEN' };\n}\n",
      `function progress(p) {
  const r2 = (x) => Math.round(x * 100) / 100;
  const executedPct = r2((p.executed / p.planned) * 100);
  const expectedPct = r2((p.plannedByNow / p.planned) * 100);
  const passRate = p.executed ? r2((p.passed / p.executed) * 100) : 0;
  const open = (s) => p.defects.filter((d) => d.open && d.severity === s).length;
  const openCritical = open('Critical');
  const openMajor = open('Major');
  const density = r2(p.defects.length / p.kloc);
  const tong = p.foundBefore + p.foundAfterRelease;
  const ddp = tong ? r2((p.foundBefore / tong) * 100) : null;
  const behind = expectedPct - executedPct;
  let status = 'GREEN';
  if (openCritical > 0 || behind > 20) status = 'RED';
  else if (behind > 0 || passRate < 90) status = 'AMBER';
  return { executedPct, expectedPct, passRate, openCritical, openMajor, density, ddp, status };
}
`,
    ],
  },
  kiem: [
    kiemTuy({ en: 'the example', vi: 'ví dụ' }, () => { const r = progress({ planned: 200, plannedByNow: 100, executed: 70, passed: 52, failed: 15, blocked: 3, defects: [{ severity: 'Major', open: true }, { severity: 'Minor', open: false }], foundBefore: 180, foundAfterRelease: 20, kloc: 12.5 }); const w = { executedPct: 35, expectedPct: 50, passRate: 74.29, openCritical: 0, openMajor: 1, density: 0.16, ddp: 90, status: 'AMBER' }; return JSON.stringify(r) === JSON.stringify(w) ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'an open Critical makes it RED', vi: 'còn Critical mở thì RED' }, () => { const r = progress({ planned: 100, plannedByNow: 50, executed: 60, passed: 59, failed: 1, blocked: 0, defects: [{ severity: 'Critical', open: true }], foundBefore: 10, foundAfterRelease: 0, kloc: 10 }); return r.status === 'RED' && r.openCritical === 1 ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'GREEN when on plan and passRate ≥ 90', vi: 'GREEN khi đúng kế hoạch và passRate ≥ 90' }, () => { const r = progress({ planned: 100, plannedByNow: 50, executed: 50, passed: 45, failed: 5, blocked: 0, defects: [{ severity: 'Critical', open: false }], foundBefore: 0, foundAfterRelease: 0, kloc: 4 }); return r.status === 'GREEN' && r.passRate === 90 && r.ddp === null && r.density === 0.25 ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'exactly 20 points behind is AMBER, 21 is RED', vi: 'chậm đúng 20 điểm là AMBER, 21 là RED' }, () => { const a = progress({ planned: 100, plannedByNow: 60, executed: 40, passed: 40, failed: 0, blocked: 0, defects: [], foundBefore: 1, foundAfterRelease: 1, kloc: 1 }); const b = progress({ planned: 100, plannedByNow: 61, executed: 40, passed: 40, failed: 0, blocked: 0, defects: [], foundBefore: 1, foundAfterRelease: 1, kloc: 1 }); return a.status === 'AMBER' && b.status === 'RED' ? 'OK' : 'got ' + a.status + ' and ' + b.status; }, { an: true }),
    kiemTuy({ en: 'nothing executed', vi: 'chưa chạy gì' }, () => { const r = progress({ planned: 80, plannedByNow: 0, executed: 0, passed: 0, failed: 0, blocked: 0, defects: [], foundBefore: 3, foundAfterRelease: 1, kloc: 2 }); return r.passRate === 0 && r.status === 'AMBER' && r.ddp === 75 ? 'OK' : 'got ' + JSON.stringify(r); }, { an: true }),
  ],
});

const E4 = tinhDe({
  tieuDe: 'Monitoring 4 — Metrics and audiences (exam)',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Five FE-style questions on SWT5 slides 59–73: the purposes of test metrics, the common metrics, and how the audience changes the content of a report.</p>', vi: '<p>Năm câu kiểu FE về slide SWT5 59–73: mục đích của số đo, các số đo thường gặp và đối tượng đọc làm thay đổi nội dung báo cáo thế nào.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('Which is NOT a typical purpose of test metrics?', 'Đâu KHÔNG phải mục đích điển hình của số đo test?'), luaChon: lc(['a', 'Assess progress against the schedule and budget'], ['b', 'Determine the current quality of the test object'], ['c', 'Rank developers by the number of defects they caused'], ['d', 'Assess the effectiveness of the test approach']), dapAn: ['c'], giaiThich: giai('Using defect counts to blame people destroys trust (lesson 1.5).', 'Dùng số lỗi để đổ lỗi cho người phá hỏng niềm tin (bài 1.5).') },
    { ma: 'q2', de: hai('Which is a metric of defect information?', 'Đâu là số đo về thông tin lỗi?'), luaChon: lc(['a', 'Percentage of the test environment prepared'], ['b', 'Defect density, defects found and fixed, failure rate, confirmation test results'], ['c', 'Hours of test effort'], ['d', 'Number of test cases designed']), dapAn: ['b'], giaiThich: giai('The syllabus groups metrics: progress, defect information, coverage, cost.', 'Syllabus nhóm số đo: tiến độ, thông tin lỗi, độ phủ, chi phí.') },
    { ma: 'q3', de: hai('How should a report for the university’s board differ from one for the test team?', 'Báo cáo cho ban giám hiệu nên khác báo cáo cho nhóm test thế nào?'), luaChon: lc(['a', 'It should be identical'], ['b', 'A short summary of status, residual risk and the decision needed; detailed defect data goes to the team'], ['c', 'It should contain all test logs'], ['d', 'It should hide all problems']), dapAn: ['b'], giaiThich: giai('The content of a report varies with its audience and the project context.', 'Nội dung báo cáo thay đổi theo người đọc và ngữ cảnh dự án.') },
    { ma: 'q4', de: hai('Monitoring is to control as…', 'Monitoring so với control giống như…'), luaChon: lc(['a', 'looking is to acting'], ['b', 'planning is to designing'], ['c', 'testing is to debugging'], ['d', 'they are the same']), dapAn: ['a'], giaiThich: giai('Monitoring looks, control acts.', 'Giám sát là nhìn, kiểm soát là hành động.') },
    { ma: 'q5', de: hai('Which standard names these reports “test status report” and “test completion report”?', 'Chuẩn nào gọi hai báo cáo là “test status report” và “test completion report”?'), luaChon: lc(['a', 'ISO/IEC 25010'], ['b', 'ISO/IEC/IEEE 29119-3'], ['c', 'IEEE 829 only'], ['d', 'ISO 9001']), dapAn: ['b'], giaiThich: giai('29119-3 covers test documentation.', '29119-3 là phần về tài liệu test.') },
  ],
  goiY: ['Số đo dùng để cải tiến và quyết định, không để đổ lỗi.', 'Báo cáo theo người đọc.'],
  loiHayGap: ['Gửi toàn bộ log cho ban lãnh đạo.', 'Nhầm 29119 với 25010.'],
  giaiThich: '<p>Answers: c · b · b · a · b.</p>',
  thuatNgu: [{ en: 'audience', vi: 'người đọc / đối tượng nhận báo cáo' }],
  khaiNiem: ['test metrics', 'test reports'],
});

export default doiDau({
  slug: 'swt301-test-monitoring-control',
  ten: '7.3 Test monitoring and control: metrics and reports',
  moTaModule: 'Báo cáo tiến độ và báo cáo tổng kết, chọn hành động kiểm soát, viết code tính báo cáo tuần (tiến độ, tỉ lệ đạt, mật độ lỗi, DDP, trạng thái RAG), câu thi về số đo và người đọc.',
  khoa: KHOA,
  baiHoc: 'swt301-test-monitoring-control',
  de: [E1, E2, E3, E4],
});
