/**
 * SWR302 · 19B.1 — Beyond requirements development: effects on development, effort, and project plans (Wiegers Ch.19 slides 1–6).
 */
import { tn, kiemTuy } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';

const E1 = tracNghiem({
  tieuDe: 'Beyond RD 1 — requirements as the hub',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Figure 19-1: requirements are the hub — they drive project planning, design, coding and testing. Every downstream activity traces back to them, which is why a requirement defect ripples so widely. Requirements effort is spread differently by life cycle: a sequential project front-loads it; an iterative or incremental project spreads it across iterations.</p>', vi: '<p>Yêu cầu là trung tâm dẫn dắt lập kế hoạch, thiết kế, code, kiểm thử.</p>' },
  cau: [
    { en: 'Which four activities does Figure 19-1 show requirements driving?', vi: 'Hình 19-1 cho thấy yêu cầu dẫn dắt bốn hoạt động nào?', lc: [['a', 'Project planning, design, coding and testing'], ['b', 'Marketing, sales, HR and finance'], ['c', 'Only testing'], ['d', 'Only coding']], dap: 'a', giai: ['The four arrows of the hub.', 'Bốn mũi tên từ trung tâm.'] },
    { en: 'On an incremental project, requirements effort is…', vi: 'Trong dự án tăng dần, công sức làm yêu cầu…', lc: [['a', 'spread across the iterations, revisiting requirements as the product grows'], ['b', 'all in the first month'], ['c', 'all at the end'], ['d', 'zero']], dap: 'a', giai: ['Distributed by life cycle.', 'Phân bổ theo vòng đời.'] },
  ],
  goiY: ['Yêu cầu → kế hoạch, thiết kế, code, test.', 'Lặp/tăng dần ⇒ rải đều.'],
  loiHayGap: ['Nghĩ yêu cầu chỉ ảnh hưởng code.', 'Dồn hết công yêu cầu vào đầu dự án agile.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: tn('requirement'),
  khaiNiem: ['effects of requirements on development'],
});

const E2 = phanLoai({
  tieuDe: 'Beyond RD 2 — size measures from requirements',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Estimating size and effort from requirements can use: the number of individually testable requirements; function points; story points or use case points; the number, type and complexity of UI elements; or estimated lines of code per requirement. Name the measure each team uses.</p>', vi: '<p>Các thước đo kích thước suy từ yêu cầu.</p>' },
  cot: 'Size measure', luaChon: ['Testable requirements count', 'Function points', 'Story points', 'UI elements', 'Lines of code per requirement'],
  hang: [
    ['"We counted 140 individually testable functional requirements."', 'Testable requirements count'],
    ['"Inputs, outputs, inquiries, internal files and interfaces gave 320."', 'Function points'],
    ['"The backlog totals 210 points at our usual relative scale."', 'Story points'],
    ['"38 screens: 12 simple, 20 average, 6 complex."', 'UI elements'],
    ['"Each requirement averages about 150 lines of Java in our history."', 'Lines of code per requirement'],
  ],
  giaiThich: '<p>Any of these works if the team has historical productivity data for that measure — size × productivity ⇒ effort ⇒ schedule.</p>',
  goiY: ['Đầu vào/đầu ra/truy vấn/tệp/giao diện ⇒ function points.', 'Thang tương đối của đội agile ⇒ story points.'],
  loiHayGap: ['Nhầm function points với số yêu cầu.', 'Ước lượng không có dữ liệu năng suất quá khứ.'],
  thuatNgu: [{ en: 'function point', vi: 'điểm chức năng' }, { en: 'story point', vi: 'điểm story' }],
  khaiNiem: ['estimation from requirements'],
});

const E3 = baiJs({
  tieuDe: 'Beyond RD 3 — from size to effort and schedule',
  doKho: 'MEDIUM', phut: 10,
  moTa: { en: '<p>Effective scheduling needs an estimated product size, the team’s known productivity from history, and the effort for every task. Write <code>function plan(size, hoursPerUnit, teamHoursPerWeek, contingencyPct)</code> that returns <code>{ effortHours, weeks }</code>: effort = size × hoursPerUnit, increased by <code>contingencyPct</code> percent and rounded up to a whole hour; weeks = effort ÷ team hours per week, rounded up. Then set <code>CLINIC_PLAN</code> for ClinicCare: 140 testable requirements, 6.5 hours each, a team of 4 people × 30 productive hours per week, 20% contingency.</p>', vi: '<p>Viết <code>plan(size, hoursPerUnit, teamHoursPerWeek, contingencyPct)</code> trả { effortHours, weeks } (làm tròn lên), rồi <code>CLINIC_PLAN</code> cho ClinicCare.</p>' },
  yeuCau: [{ en: 'plan(100, 5, 120, 10) ⇒ { effortHours: 550, weeks: 5 }.', vi: 'plan(100, 5, 120, 10) ⇒ { effortHours: 550, weeks: 5 }.' }],
  viDu: [{ input: 'plan(100, 5, 120, 10)', output: '{ effortHours: 550, weeks: 5 }', explanation: '100 × 5 × 1.1 = 550; 550 / 120 = 4.6 ⇒ 5|||' }],
  tep: { 'plan.js': ["function plan(size, hoursPerUnit, teamHoursPerWeek, contingencyPct) {\n  return { effortHours: 0, weeks: 0 };\n}\nconst CLINIC_PLAN = null;\n", "function plan(size, hoursPerUnit, teamHoursPerWeek, contingencyPct) {\n  var effortHours = Math.ceil(size * hoursPerUnit * (1 + contingencyPct / 100) - 1e-9);\n  return { effortHours: effortHours, weeks: Math.ceil(effortHours / teamHoursPerWeek) };\n}\n// 140 × 6.5 = 910 h; +20% = 1092 h; team = 4 × 30 = 120 h/week ⇒ 9.1 ⇒ 10 weeks\nconst CLINIC_PLAN = plan(140, 6.5, 4 * 30, 20);\n"] },
  kiem: [
    kiemTuy({ en: 'plan() on the example', vi: 'plan() với ví dụ' }, function () {
      if (typeof plan !== 'function') return 'plan is not a function';
      var r = plan(100, 5, 120, 10) || {};
      return r.effortHours === 550 && r.weeks === 5 ? 'OK' : 'expected { effortHours: 550, weeks: 5 }, got ' + JSON.stringify(r);
    }),
    kiemTuy({ en: 'rounding up', vi: 'làm tròn lên' }, function () {
      if (typeof plan !== 'function') return 'plan is not a function';
      var r = plan(7, 3.3, 10, 0) || {};
      return r.effortHours === 24 && r.weeks === 3 ? 'OK' : '7 × 3.3 = 23.1 ⇒ 24 h; 24 / 10 ⇒ 3 weeks; got ' + JSON.stringify(r);
    }),
    kiemTuy({ en: 'CLINIC_PLAN', vi: 'CLINIC_PLAN' }, function () {
      if (typeof CLINIC_PLAN === 'undefined' || !CLINIC_PLAN) return 'CLINIC_PLAN is missing';
      return CLINIC_PLAN.effortHours === 1092 && CLINIC_PLAN.weeks === 10 ? 'OK' : 'expected 1092 hours and 10 weeks, got ' + JSON.stringify(CLINIC_PLAN);
    }),
  ],
  goiY: ['Math.ceil cho cả giờ và tuần.', 'Đội 4 người × 30 giờ = 120 giờ/tuần.'],
  loiHayGap: ['Quên dự phòng 20%.', 'Làm tròn xuống số tuần.'],
  giaiThich: '<p>Requirements size × historical productivity, plus contingency for uncertainty, gives an estimate you can defend — and update as requirements become clearer.</p>',
  thuatNgu: [{ en: 'contingency', vi: 'dự phòng' }],
  khaiNiem: ['from requirements to plans'],
  boYeu: [{ ten: 'quên dự phòng, làm tròn xuống', tep: { 'plan.js': "function plan(s,h,t,c){ var e=Math.round(s*h); return {effortHours:e,weeks:Math.floor(e/t)}; }\nconst CLINIC_PLAN = plan(140,6.5,120,20);\n" } }],
});

const E4 = tracNghiem({
  tieuDe: 'Beyond RD 4 — plans that follow the requirements',
  doKho: 'MEDIUM', phut: 4,
  moTa: { en: '<p>Base plans on requirements and refine them as requirements become clearer; early estimates from fuzzy requirements are uncertain. If planning shows the full feature set cannot fit the available time and resources, reduce scope or stage the releases — on agile, scope is adjusted to the time-boxes.</p>', vi: '<p>Kế hoạch theo yêu cầu, tinh chỉnh dần; không vừa thì giảm phạm vi hoặc chia bản phát hành.</p>' },
  cau: [
    { en: 'The estimate is 10 weeks but the deadline is in 7. Reasonable options?', vi: 'Ước lượng 10 tuần nhưng hạn còn 7. Lựa chọn hợp lý?', lc: [['a', 'Reduce scope by priority or stage the delivery into releases'], ['b', 'Cut testing'], ['c', 'Promise 7 weeks anyway'], ['d', 'Ignore the estimate']], dap: 'a', giai: ['Scope, staging, resources — not wishful thinking.', 'Phạm vi, chia đợt, nguồn lực — không phải mơ ước.'] },
  ],
  goiY: ['Không vừa ⇒ giảm phạm vi hoặc chia đợt.', 'Đừng cắt kiểm thử.'],
  loiHayGap: ['Hứa theo hạn mà không đổi gì.', 'Cắt kiểm thử để kịp.'],
  giaiThich: '<p>Answers: a.</p>',
  thuatNgu: tn('scope'),
  khaiNiem: ['project plans'],
});

export default moDun({
  slug: 'swr302-19b-1-ch19-plans',
  ten: '8.2 Beyond requirements: estimates and project plans',
  moTaModule: 'Yêu cầu là trung tâm của kế hoạch/thiết kế/code/test, thước đo kích thước suy từ yêu cầu, tự tính công và lịch từ kích thước + năng suất + dự phòng có chấm, khi kế hoạch không vừa hạn.',
  de: [E1, E2, E3, E4],
});
