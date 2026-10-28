/**
 * SWT301 · 9.5 — Agile testing principles, status (burndown, task board), roles and skills (Agile Tester syllabus ch.2).
 */
import { doiDau, KHOA, hai, giai, lc } from './_chung.mjs';
import { tinhDe, jsDe, kiemTuy } from './_de.mjs';

const KIEU = ['Traditional (sequential) project', 'Agile project'];
const E1 = tinhDe({
  tieuDe: 'Agile testing 1 — Traditional or Agile?',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>FA-2.1.1: how testing activities differ. Decide in which kind of project each statement is typical.</p>', vi: '<p>FA-2.1.1: hoạt động kiểm thử khác nhau thế nào. Xác định mỗi phát biểu điển hình cho loại dự án nào.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Statement → project', 'Phát biểu → dự án'),
    cot: [{ ma: 's', ten: 'Statement' }, { ma: 'k', ten: 'Typical of', luaChon: KIEU }],
    hang: [
      'Testing happens inside every iteration, in parallel with coding; test levels overlap',
      'A separate test team receives the build after development is finished',
      'The test basis is a signed, complete requirements document',
      'Automated tests act as living documentation; test documentation is lightweight',
      'Regression testing is one cycle just before the release',
      'Testers pair with developers and share the Definition of Done',
    ].map((s, i) => ({ ma: `r${i}`, o: { s } })),
    dapAn: { 'r0.k': KIEU[1], 'r1.k': KIEU[0], 'r2.k': KIEU[0], 'r3.k': KIEU[1], 'r4.k': KIEU[0], 'r5.k': KIEU[1] },
    giaiThich: giai('Agile: testing in every iteration, whole team, stories as basis, lightweight documentation, continuous automated regression, pairing. Traditional: a phase, a separate team, complete documents, a regression cycle before release.', 'Agile: test trong mọi iteration, cả đội, story làm cơ sở, tài liệu nhẹ, hồi quy tự động liên tục, làm cặp. Truyền thống: một pha, nhóm riêng, tài liệu đầy đủ, một vòng hồi quy trước phát hành.'),
  }],
  goiY: ['“Mỗi iteration, song song, làm cặp” ⇒ Agile.', '“Sau khi phát triển xong, tài liệu ký duyệt” ⇒ truyền thống.'],
  loiHayGap: ['Cho rằng Agile không có tài liệu test nào.', 'Cho rằng Agile không có tester độc lập — có thể có, tuỳ ngữ cảnh.'],
  giaiThich: '<p>A · T · T · A · T · A.</p>',
  thuatNgu: [{ en: 'living documentation', vi: 'tài liệu sống — test tự động mô tả hành vi' }],
  khaiNiem: ['Agile testing'],
});

const E2 = jsDe({
  tieuDe: 'Agile testing 2 — Read the sprint burndown',
  doKho: 'MEDIUM', phut: 15,
  moTa: { en: `<p>FA-2.2.1: Agile teams show test status with burndown charts and task boards. Write <code>burndown(total, days, remaining)</code>: a sprint of <code>days</code> working days starts with <code>total</code> story points; <code>remaining[i]</code> is the remaining work at the end of day <i>i+1</i> (as many entries as days elapsed so far).</p>
<ul><li><code>ideal</code> — the ideal remaining work at the end of each elapsed day: total − total × (i+1) ÷ days, rounded to 1 decimal.</li>
<li><code>gap</code> — last remaining − last ideal (1 decimal; positive = behind).</li>
<li><code>forecastDays</code> — at the average burn rate so far ((total − last remaining) ÷ elapsed days), how many more days are needed for the rest (ceil); null if nothing was burnt.</li>
<li><code>status</code> — <code>'DONE'</code> if remaining is 0, <code>'ON_TRACK'</code> if elapsed + forecastDays ≤ days, otherwise <code>'AT_RISK'</code>.</li></ul>`, vi: `<p>FA-2.2.1: đội Agile cho thấy tình trạng test bằng burndown và task board. Viết <code>burndown(total, days, remaining)</code> trả: đường lý tưởng của các ngày đã qua, độ lệch so với lý tưởng, số ngày cần thêm theo tốc độ trung bình, và trạng thái DONE / ON_TRACK / AT_RISK như bản tiếng Anh.</p>` },
  yeuCau: [{ en: 'Do not count non-integer days: forecastDays is an integer (Math.ceil).', vi: 'forecastDays là số nguyên (Math.ceil).' }],
  viDu: [{ input: 'burndown(40, 10, [38, 36, 33, 31])', output: "{ ideal: [36, 32, 28, 24], gap: 7, forecastDays: 14, status: 'AT_RISK' }", explanation: 'Burnt 9 in 4 days = 2.25/day; 31 left needs 14 more days, but only 6 remain.|||Đốt 9 điểm trong 4 ngày = 2,25/ngày; còn 31 cần 14 ngày nữa, mà chỉ còn 6 ngày.' }],
  goiY: ['ideal[i] = total − total·(i+1)/days.', 'forecastDays = ceil(lastRemaining ÷ rate).'],
  loiHayGap: ['So với lý tưởng của ngày cuối sprint thay vì ngày hiện tại.', 'Chia cho 0 khi chưa đốt được điểm nào.'],
  giaiThich: '<p>The burndown makes progress visible to the whole team every day; a growing gap triggers a conversation in the daily stand-up (drop scope, swarm on testing, remove an impediment).</p>',
  thuatNgu: [{ en: 'burndown chart', vi: 'biểu đồ công việc còn lại' }, { en: 'burn rate', vi: 'tốc độ hoàn thành' }, { en: 'task board', vi: 'bảng công việc' }],
  khaiNiem: ['test status in Agile'],
  tep: {
    'burndown.js': [
      "function burndown(total, days, remaining) {\n  return { ideal: [], gap: 0, forecastDays: null, status: 'ON_TRACK' };\n}\n",
      `function burndown(total, days, remaining) {
  const r1 = (x) => Math.round(x * 10) / 10;
  const n = remaining.length;
  const ideal = remaining.map((_, i) => r1(total - (total * (i + 1)) / days));
  const last = n ? remaining[n - 1] : total;
  const gap = n ? r1(last - ideal[n - 1]) : 0;
  const burnt = total - last;
  const forecastDays = burnt > 0 && n > 0 ? Math.ceil(last / (burnt / n)) : null;
  let status;
  if (last === 0) status = 'DONE';
  else if (forecastDays !== null && n + forecastDays <= days) status = 'ON_TRACK';
  else status = 'AT_RISK';
  return { ideal, gap, forecastDays, status };
}
`,
    ],
  },
  kiem: [
    kiemTuy({ en: 'the example', vi: 'ví dụ' }, () => { const r = burndown(40, 10, [38, 36, 33, 31]); return JSON.stringify(r) === JSON.stringify({ ideal: [36, 32, 28, 24], gap: 7, forecastDays: 14, status: 'AT_RISK' }) ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'on track', vi: 'đúng tiến độ' }, () => { const r = burndown(30, 10, [27, 24, 20]); return r.status === 'ON_TRACK' && r.forecastDays === 6 && r.gap === -1 ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'done', vi: 'xong' }, () => { const r = burndown(10, 5, [6, 2, 0]); return r.status === 'DONE' && r.forecastDays === 0 ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'nothing burnt yet', vi: 'chưa đốt được gì' }, () => { const r = burndown(20, 10, [20, 20]); return r.forecastDays === null && r.status === 'AT_RISK' && r.gap === 4 ? 'OK' : 'got ' + JSON.stringify(r); }, { an: true }),
    kiemTuy({ en: 'ideal rounding', vi: 'làm tròn đường lý tưởng' }, () => { const r = burndown(10, 3, [7]); return JSON.stringify(r.ideal) === '[6.7]' ? 'OK' : 'got ' + JSON.stringify(r.ideal); }, { an: true }),
  ],
});

const E3 = tinhDe({
  tieuDe: 'Agile testing 3 — Skills, role and independence of the Agile tester (K2)',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Six questions on FA-2.1.3, FA-2.2.2 and FA-2.3.1–2.3.2: independence in Agile teams, evolving tests across iterations and the tester’s skills and role.</p>', vi: '<p>Sáu câu về FA-2.1.3, FA-2.2.2 và FA-2.3.1–2.3.2: tính độc lập trong đội Agile, test tiến hoá qua các iteration, kỹ năng và vai trò của tester.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('What is a risk for a tester embedded in an Agile team for a long time?', 'Rủi ro của tester ở lâu trong đội Agile là gì?'), luaChon: lc(['a', 'Loss of independence — adopting the developers’ view'], ['b', 'Too much documentation'], ['c', 'No access to the code'], ['d', 'Working alone']), dapAn: ['a'], giaiThich: giai('Mitigations: an independent test team that supports several Agile teams, rotation, a test lead outside the team.', 'Cách giảm: nhóm test độc lập hỗ trợ nhiều đội, luân chuyển, trưởng nhóm test ngoài đội.') },
    { ma: 'q2', de: hai('Why is test automation so important in Agile projects?', 'Vì sao tự động hoá test rất quan trọng trong dự án Agile?'), luaChon: lc(['a', 'It replaces testers'], ['b', 'Each iteration adds features; the growing regression risk can only be managed with automated regression tests run continuously'], ['c', 'Managers like it'], ['d', 'It removes the need for acceptance criteria']), dapAn: ['b'], giaiThich: giai('FA-2.2.2.', 'FA-2.2.2.') },
    { ma: 'q3', de: hai('Which is a typical skill of an Agile tester?', 'Đâu là kỹ năng điển hình của tester Agile?'), luaChon: lc(['a', 'Working only from complete specifications'], ['b', 'Communicating well with business and developers, test automation and exploratory skills, and a positive, solution-oriented attitude'], ['c', 'Avoiding developers'], ['d', 'Writing long reports']), dapAn: ['b'], giaiThich: giai('Plus being proactive, evaluating results, responding to change.', 'Cùng với chủ động, đánh giá kết quả, phản hồi thay đổi.') },
    { ma: 'q4', de: hai('Which is part of the tester’s role in an Agile team?', 'Việc nào thuộc vai trò tester trong đội Agile?'), luaChon: lc(['a', 'Only executing manual tests at the end'], ['b', 'Coaching the team on testing, helping define acceptance criteria, reporting test results and defects, keeping the test strategy up to date'], ['c', 'Deciding priorities of the backlog'], ['d', 'Managing the budget']), dapAn: ['b'], giaiThich: giai('The PO decides backlog priorities.', 'PO quyết định ưu tiên backlog.') },
    { ma: 'q5', de: hai('Which tool best shows the status of every task of the sprint at a glance?', 'Công cụ nào cho thấy trạng thái mọi task của sprint trong một cái nhìn?'), luaChon: lc(['a', 'A task board (physical or electronic)'], ['b', 'The test plan'], ['c', 'The defect report'], ['d', 'The contract']), dapAn: ['a'], giaiThich: giai('Together with burndown charts and wikis.', 'Cùng với burndown và wiki.') },
    { ma: 'q6', de: hai('How do testing and development integrate within one iteration?', 'Phát triển và kiểm thử gắn với nhau thế nào trong một iteration?'), luaChon: lc(['a', 'Testing starts after all stories are coded'], ['b', 'Unit tests, feature verification against acceptance criteria and feature validation happen continuously as each story is built'], ['c', 'Only acceptance testing happens'], ['d', 'They are separated by a gate']), dapAn: ['b'], giaiThich: giai('FA-2.1.2.', 'FA-2.1.2.') },
  ],
  goiY: ['Độc lập vẫn quan trọng trong Agile.', 'Tự động hoá = quản lý rủi ro hồi quy.'],
  loiHayGap: ['Cho rằng tester Agile quyết định ưu tiên backlog.', 'Cho rằng test bắt đầu sau khi code hết story.'],
  giaiThich: '<p>Answers: a · b · b · b · a · b.</p>',
  thuatNgu: [{ en: 'daily stand-up', vi: 'họp đứng hằng ngày' }],
  khaiNiem: ['Agile tester role'],
});

export default doiDau({
  slug: 'swt301-agile-testing-status-roles',
  ten: '9.5 Agile testing: status, roles and skills',
  moTaModule: 'Kiểm thử truyền thống vs Agile, viết code đọc burndown (đường lý tưởng, độ lệch, dự báo, trạng thái), kỹ năng, vai trò, tính độc lập và tự động hoá hồi quy của tester Agile.',
  khoa: KHOA,
  baiHoc: 'swt301-agile-testing-status-roles',
  de: [E1, E2, E3],
});
