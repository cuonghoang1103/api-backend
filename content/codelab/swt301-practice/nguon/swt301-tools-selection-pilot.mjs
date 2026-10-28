/**
 * SWT301 · 8.4 — Effective use of tools: selection, pilot project, success factors (SWT6 slide 48–54, LO-6.2.1–6.2.3).
 */
import { doiDau, KHOA, hai, giai, lc } from './_chung.mjs';
import { tinhDe, jsDe, kiemTuy } from './_de.mjs';

const PHA = ['Selection principle', 'Pilot project objective', 'Success factor for deployment'];
const E1 = tinhDe({
  tieuDe: 'Tool introduction 1 — Select, pilot or deploy?',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p>Introducing a tool is a change-management project: <b>select</b> it against real needs, prove it in a <b>pilot</b>, then <b>deploy</b> it with the success factors in place. Each item comes from one of the three lists of slides 49–54.</p>', vi: '<p>Đưa công cụ vào là một dự án quản lý thay đổi: <b>chọn</b> theo nhu cầu thật, chứng minh trong <b>pilot</b>, rồi <b>triển khai</b> với đủ yếu tố thành công. Mỗi mục thuộc một trong ba danh sách của slide 49–54.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Item → list', 'Mục → danh sách'),
    cot: [{ ma: 'i', ten: 'Item' }, { ma: 'l', ten: 'List', luaChon: PHA }],
    hang: [
      'Assess the maturity of the organisation, its strengths and weaknesses',
      'Gain in-depth knowledge about the tool, its strengths and weaknesses',
      'Roll the tool out to the rest of the organisation incrementally',
      'Understand the technologies used by the test objects, to choose a compatible tool',
      'Evaluate how the tool fits with existing processes and practices, and what would need to change',
      'Provide training, coaching and mentoring for new users',
      'Evaluate the vendor (training, support, commercial aspects) or the support of an open-source tool',
      'Decide standard ways of using, managing, storing and maintaining the tool and the test assets',
      'Monitor tool use and benefits; gather lessons learned from all users',
      'Do a cost-benefit analysis based on a concrete business case',
      'Assess whether the benefits will be achieved at reasonable cost',
      'Define usage guidelines and adapt the processes to fit the tool',
    ].map((i, k) => ({ ma: `r${k}`, o: { i } })),
    dapAn: { 'r0.l': PHA[0], 'r1.l': PHA[1], 'r2.l': PHA[2], 'r3.l': PHA[0], 'r4.l': PHA[1], 'r5.l': PHA[2], 'r6.l': PHA[0], 'r7.l': PHA[1], 'r8.l': PHA[2], 'r9.l': PHA[0], 'r10.l': PHA[1], 'r11.l': PHA[2] },
    giaiThich: giai('Selection: maturity, needs, technology, compatibility, vendor, licensing, cost-benefit, proof of concept. Pilot: knowledge of the tool, fit with processes, standard ways of use, benefits at reasonable cost, metrics. Deployment success factors: incremental roll-out, adapted processes, training, guidelines, monitoring, support, lessons learned.', 'Chọn: độ trưởng thành, nhu cầu, công nghệ, tương thích, nhà cung cấp, giấy phép, chi phí–lợi ích, chứng minh khái niệm. Pilot: hiểu công cụ, độ khớp quy trình, cách dùng chuẩn, lợi ích với chi phí hợp lý, số liệu. Yếu tố thành công: triển khai từng bước, chỉnh quy trình, đào tạo, hướng dẫn, giám sát, hỗ trợ, bài học.'),
  }],
  goiY: ['Trước khi mua ⇒ selection; một dự án nhỏ ⇒ pilot; toàn tổ chức ⇒ success factors.', '“Cách dùng chuẩn” được QUYẾT ĐỊNH trong pilot; “hướng dẫn sử dụng” được ÁP DỤNG khi triển khai.'],
  loiHayGap: ['Đưa “phân tích chi phí–lợi ích” vào pilot.', 'Đưa “đào tạo người dùng mới” vào selection.'],
  giaiThich: '<p>S · P · D · S · P · D · S · P · D · S · P · D.</p>',
  thuatNgu: [{ en: 'pilot project', vi: 'dự án thử điểm' }, { en: 'proof of concept', vi: 'chứng minh khái niệm' }, { en: 'roll-out', vi: 'triển khai rộng' }],
  khaiNiem: ['tool selection', 'pilot project'],
});

const E2 = tinhDe({
  tieuDe: 'Tool introduction 2 — Exam questions (K1)',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>Five FE-style questions on SWT6 slides 48–54 about selecting a tool, running a pilot project and making the roll-out succeed.</p>', vi: '<p>Năm câu kiểu FE về slide SWT6 48–54: chọn công cụ, chạy dự án pilot và triển khai thành công.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('What is the main objective of a pilot project for a test tool?', 'Mục tiêu chính của dự án pilot cho công cụ test là gì?'), luaChon: lc(['a', 'To negotiate a lower price'], ['b', 'To learn the tool in practice and see how it fits the existing processes before deciding a wide roll-out'], ['c', 'To test the vendor’s software for free'], ['d', 'To replace the test team']), dapAn: ['b'], giaiThich: giai('Plus deciding standard ways of use and assessing benefits vs cost.', 'Cùng với quyết định cách dùng chuẩn và đánh giá lợi ích so với chi phí.') },
    { ma: 'q2', de: hai('Which is a principle of tool selection?', 'Đâu là nguyên tắc chọn công cụ?'), luaChon: lc(['a', 'Choose the most popular tool'], ['b', 'Identify opportunities for an improved test process supported by tools, against clear requirements and objective criteria'], ['c', 'Buy first, decide later'], ['d', 'Let the vendor decide']), dapAn: ['b'], giaiThich: giai('Needs first, tool second.', 'Nhu cầu trước, công cụ sau.') },
    { ma: 'q3', de: hai('Which is a success factor when deploying a tool?', 'Đâu là yếu tố thành công khi triển khai công cụ?'), luaChon: lc(['a', 'Roll it out to everybody on the same day'], ['b', 'Roll it out incrementally, provide training and support, and monitor its use and benefits'], ['c', 'Avoid changing any process'], ['d', 'Skip guidelines']), dapAn: ['b'], giaiThich: giai('Change management, not a purchase.', 'Quản lý thay đổi, không phải mua hàng.') },
    { ma: 'q4', de: hai('Why should licensing and support of an open-source tool be evaluated?', 'Vì sao phải đánh giá giấy phép và hỗ trợ của công cụ mã nguồn mở?'), luaChon: lc(['a', 'Open source is always free of risk'], ['b', 'Because the project may be abandoned and the licence may restrict use or modification'], ['c', 'It does not need to be'], ['d', 'Only for paid tools']), dapAn: ['b'], giaiThich: giai('One of the risks of lesson 8.3.', 'Một rủi ro của bài 8.3.') },
    { ma: 'q5', de: hai('A proof of concept during selection is used to…', 'Proof of concept trong lúc chọn công cụ dùng để…'), luaChon: lc(['a', 'show the tool works with the software under test and the current infrastructure'], ['b', 'train all users'], ['c', 'replace the pilot'], ['d', 'write the test plan']), dapAn: ['a'], giaiThich: giai('It reduces the risk of buying a tool that cannot work in your context.', 'Giảm rủi ro mua công cụ không chạy được trong bối cảnh của mình.') },
  ],
  goiY: ['Pilot = học và đánh giá độ khớp; triển khai = từng bước + đào tạo + giám sát.', 'Mã nguồn mở vẫn có rủi ro.'],
  loiHayGap: ['Cho rằng pilot để mặc cả giá.', 'Triển khai cho mọi người cùng lúc.'],
  giaiThich: '<p>Answers: b · b · b · b · a.</p>',
  thuatNgu: [{ en: 'change management', vi: 'quản lý thay đổi' }],
  khaiNiem: ['tool introduction'],
});

const E3 = jsDe({
  tieuDe: 'Tool introduction 3 — The business case: when does automation pay off?',
  doKho: 'MEDIUM', phut: 15,
  moTa: { en: `<p>Selection needs a cost-benefit analysis. Model one regression suite:</p>
<ul><li>Manual: <code>manualPerRun</code> minutes each run.</li>
<li>Automated: <code>buildCost</code> minutes once (scripting), then <code>autoPerRun</code> minutes per run (start, analyse results) plus <code>maintenancePerRun</code> minutes of script maintenance per run.</li></ul>
<p>Write <code>breakEven(c)</code> — the smallest number of runs <i>n</i> ≥ 1 for which the total automated cost is <b>less than or equal to</b> the total manual cost, or <code>null</code> if automation never pays off (automated cost per run ≥ manual cost per run). Then <code>roi(c, runs)</code> = (manual total − automated total) ÷ automated total × 100, rounded to 1 decimal.</p>`, vi: `<p>Chọn công cụ cần phân tích chi phí–lợi ích. Mô hình một bộ regression: chạy tay tốn <code>manualPerRun</code> phút mỗi lần; tự động hoá tốn <code>buildCost</code> phút một lần, rồi mỗi lần chạy tốn <code>autoPerRun</code> + <code>maintenancePerRun</code> phút. Viết <code>breakEven(c)</code> — số lần chạy nhỏ nhất <i>n</i> ≥ 1 để tổng chi phí tự động ≤ tổng chi phí tay, hoặc <code>null</code> nếu không bao giờ hoà vốn; và <code>roi(c, runs)</code> = (tổng tay − tổng tự động) ÷ tổng tự động × 100, làm tròn 1 chữ số.</p>` },
  yeuCau: [{ en: 'Use integer arithmetic for break-even: compute it directly, do not loop to infinity.', vi: 'Tính hoà vốn trực tiếp, không lặp vô hạn.' }],
  viDu: [{ input: 'breakEven({ manualPerRun: 240, buildCost: 3000, autoPerRun: 20, maintenancePerRun: 40 })', output: '17', explanation: '3000 + 60n ≤ 240n ⇔ n ≥ 16.67 → 17 runs (about 4 months of weekly runs).|||3000 + 60n ≤ 240n ⇔ n ≥ 16,67 → 17 lần (khoảng 4 tháng nếu chạy hằng tuần).' }],
  goiY: ['buildCost + (auto + maint)·n ≤ manual·n ⇔ n ≥ buildCost ÷ (manual − auto − maint).', 'Math.ceil, rồi tối thiểu là 1.'],
  loiHayGap: ['Quên chi phí bảo trì — lý do phổ biến nhất khiến tự động hoá không hoà vốn (rủi ro “đánh giá thấp công bảo trì”).', 'Chia cho 0 khi chi phí mỗi lần bằng nhau.'],
  giaiThich: '<p>The model shows why automation pays off only for tests that run many times — and why underestimating maintenance (a risk of lesson 8.3) can push the break-even point beyond the life of the product.</p>',
  thuatNgu: [{ en: 'break-even', vi: 'điểm hoà vốn' }, { en: 'ROI', vi: 'tỉ suất hoàn vốn' }, { en: 'business case', vi: 'luận chứng kinh doanh' }],
  khaiNiem: ['cost-benefit analysis'],
  tep: {
    'business-case.js': [
      'function breakEven(c) {\n  return 1;\n}\n\nfunction roi(c, runs) {\n  return 0;\n}\n',
      'function breakEven(c) {\n  const saving = c.manualPerRun - c.autoPerRun - c.maintenancePerRun;\n  if (saving <= 0) return null;\n  return Math.max(1, Math.ceil(c.buildCost / saving));\n}\n\nfunction roi(c, runs) {\n  const manual = c.manualPerRun * runs;\n  const auto = c.buildCost + (c.autoPerRun + c.maintenancePerRun) * runs;\n  return Math.round(((manual - auto) / auto) * 100 * 10) / 10;\n}\n',
    ],
  },
  kiem: [
    kiemTuy({ en: 'breakEven — the example', vi: 'breakEven — ví dụ' }, () => { const v = breakEven({ manualPerRun: 240, buildCost: 3000, autoPerRun: 20, maintenancePerRun: 40 }); return v === 17 ? 'OK' : 'expected 17, got ' + v; }),
    kiemTuy({ en: 'breakEven — exact division and ≤', vi: 'breakEven — chia hết và ≤' }, () => { const v = breakEven({ manualPerRun: 100, buildCost: 500, autoPerRun: 0, maintenancePerRun: 0 }); return v === 5 ? 'OK' : 'expected 5 (500 ≤ 500), got ' + v; }),
    kiemTuy({ en: 'breakEven — never pays off', vi: 'breakEven — không bao giờ hoà vốn' }, () => { const a = breakEven({ manualPerRun: 60, buildCost: 100, autoPerRun: 20, maintenancePerRun: 40 }); const b = breakEven({ manualPerRun: 60, buildCost: 100, autoPerRun: 50, maintenancePerRun: 30 }); return a === null && b === null ? 'OK' : 'expected null and null, got ' + a + ' and ' + b; }),
    kiemTuy({ en: 'roi after 52 weekly runs', vi: 'roi sau 52 lần chạy hằng tuần' }, () => { const v = roi({ manualPerRun: 240, buildCost: 3000, autoPerRun: 20, maintenancePerRun: 40 }, 52); return v === 103.9 ? 'OK' : 'expected (12480 − 6120) ÷ 6120 × 100 = 103.9, got ' + v; }),
    kiemTuy({ en: 'breakEven — no build cost gives 1', vi: 'breakEven — không tốn dựng thì là 1' }, () => (breakEven({ manualPerRun: 10, buildCost: 0, autoPerRun: 1, maintenancePerRun: 1 }) === 1 ? 'OK' : 'expected 1'), { an: true }),
    kiemTuy({ en: 'roi can be negative', vi: 'roi có thể âm' }, () => { const v = roi({ manualPerRun: 240, buildCost: 3000, autoPerRun: 20, maintenancePerRun: 40 }, 5); return v === -63.6 ? 'OK' : 'expected (1200 − 3300) ÷ 3300 × 100 = −63.6, got ' + v; }, { an: true }),
  ],
});

const E4 = tinhDe({
  tieuDe: 'Tool introduction 4 — Put the introduction of a tool in order',
  doKho: 'EASY', phut: 4,
  moTa: { en: '<p>The LabBook team wants a test management tool. Order the steps of introducing it the way SWT6 recommends.</p>', vi: '<p>Nhóm LabBook muốn có công cụ quản lý test. Sắp các bước đưa công cụ vào theo khuyến nghị của SWT6.</p>' },
  loai: 'order',
  cauHoi: [{ ma: 'o1', de: hai('First to last', 'Từ đầu tới cuối'), muc: lc(['c', 'Run a pilot on the LabBook 2.1 release and decide standard ways of use'], ['a', 'Analyse the needs and the maturity of the test process'], ['e', 'Monitor use and benefits, gather lessons learned'], ['b', 'Evaluate candidate tools against criteria, with a proof of concept'], ['d', 'Roll out incrementally with training and guidelines']), dapAn: ['a', 'b', 'c', 'd', 'e'], giaiThich: giai('Needs → selection → pilot → incremental deployment → monitoring and continuous improvement.', 'Nhu cầu → chọn → pilot → triển khai từng bước → giám sát và cải tiến liên tục.') }],
  goiY: ['Nhu cầu luôn đi trước công cụ.', 'Giám sát và bài học là bước cuối (và liên tục).'],
  loiHayGap: ['Chọn công cụ trước khi phân tích nhu cầu.', 'Triển khai rộng trước pilot.'],
  giaiThich: '<p>a → b → c → d → e.</p>',
  thuatNgu: [{ en: 'incremental roll-out', vi: 'triển khai từng bước' }],
  khaiNiem: ['tool introduction'],
});

export default doiDau({
  slug: 'swt301-tools-selection-pilot',
  ten: '8.4 Effective use of tools: selection, pilot, success factors',
  moTaModule: 'Phân biệt nguyên tắc chọn, mục tiêu pilot và yếu tố thành công, câu thi, viết code luận chứng chi phí–lợi ích (điểm hoà vốn, ROI của tự động hoá), sắp các bước đưa công cụ vào.',
  khoa: KHOA,
  baiHoc: 'swt301-tools-selection-pilot',
  de: [E1, E2, E3, E4],
});
