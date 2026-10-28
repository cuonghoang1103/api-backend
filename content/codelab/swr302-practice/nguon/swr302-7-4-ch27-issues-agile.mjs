/**
 * SWR302 · 7.4 — Requirements issues, measuring requirements effort, and managing requirements on agile projects (Wiegers Ch.27 slides 8–13).
 */
import { tn, kiemTuy } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';

const E1 = phanLoai({
  tieuDe: 'Issues 1 — what kind of requirements issue?',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Early in a project nearly all logged issues relate to requirements: <b>requests for clarification</b>, <b>scope decisions</b>, <b>feasibility questions</b> and <b>to-do items</b> on the requirements. Categorising them helps route each to the right owner and spot patterns (many feasibility questions may signal over-ambitious requirements).</p>', vi: '<p>Các loại vấn đề yêu cầu thường gặp.</p>' },
  cot: 'Issue type', luaChon: ['Request for clarification', 'Scope decision', 'Feasibility question', 'To-do item'],
  hang: [
    ['"What does ‘active member’ mean in FR-14?"', 'Request for clarification'],
    ['"Is the loyalty programme in release 1 or not?"', 'Scope decision'],
    ['"Can the old database really return 10,000 rows in one second?"', 'Feasibility question'],
    ['"Add the missing exception flow to UC-07."', 'To-do item'],
    ['"Should the mobile app support tablets in this release?"', 'Scope decision'],
  ],
  giaiThich: '<p>Each type has a natural owner: clarifications → the BA and the source stakeholder; scope → the decision makers; feasibility → developers; to-dos → the author.</p>',
  goiY: ['"Trong hay ngoài bản này" ⇒ scope.', '"Có làm được không" ⇒ feasibility.'],
  loiHayGap: ['Nhầm câu hỏi phạm vi với câu hỏi làm rõ.', 'Để vấn đề không có người phụ trách.'],
  thuatNgu: [{ en: 'issue tracking', vi: 'theo dõi vấn đề' }],
  khaiNiem: ['requirements issues'],
});

const E2 = phanLoai({
  tieuDe: 'Issues 2 — development or management effort?',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Track the effort spent on requirements. <b>Requirements development</b> effort: planning requirements activities, workshops and interviews, analysis, writing, reviews, prototypes. <b>Requirements management</b> effort: configuring an RM tool, submitting and evaluating changes, updating the repository, communicating changes, tracking and reporting status, creating trace information.</p>', vi: '<p>Công sức phát triển yêu cầu vs quản lý yêu cầu.</p>' },
  cot: 'Effort type', luaChon: ['Requirements development', 'Requirements management'],
  hang: [
    ['Running two elicitation workshops', 'Requirements development'],
    ['Performing impact analysis of a change request', 'Requirements management'],
    ['Writing the use case specifications', 'Requirements development'],
    ['Updating trace links after a change', 'Requirements management'],
    ['Inspecting the SRS', 'Requirements development'],
    ['Reporting how many requirements are verified', 'Requirements management'],
  ],
  giaiThich: '<p>Management effort is an investment in project success, not overhead: it protects the agreed requirements and makes change affordable.</p>',
  goiY: ['Tạo ra yêu cầu ⇒ phát triển.', 'Giữ, đổi, theo dõi yêu cầu ⇒ quản lý.'],
  loiHayGap: ['Coi inspection là quản lý.', 'Coi công quản lý là lãng phí.'],
  thuatNgu: tn('impactAnalysis', 'rtm'),
  khaiNiem: ['measuring requirements effort'],
});

const E3 = baiJs({
  tieuDe: 'Issues 3 — read an iteration burndown',
  doKho: 'MEDIUM', phut: 10,
  moTa: { en: '<p>A burndown chart shows the story points <b>remaining</b> in the backlog after each iteration — which, unlike "percent done", also reveals scope growth. Write <code>function forecastEnd(remaining)</code>: given the points remaining after each completed iteration (e.g. <code>[120, 100, 85, 60]</code>, the first value is the starting backlog), compute the average burn per iteration over all completed iterations and return how many <b>more</b> iterations are needed to reach zero (rounded up); return <code>Infinity</code> if the average burn is 0 or negative (scope is growing as fast as work is done). Also set <code>SCOPE_GREW</code> to <code>true</code> if any iteration ended with more points than the previous one, for the sample <code>BURNDOWN</code>.</p>', vi: '<p>Viết <code>forecastEnd(remaining)</code>: tốc độ "đốt" trung bình mỗi vòng, số vòng CÒN cần (làm tròn lên), Infinity nếu không giảm; và <code>SCOPE_GREW</code> cho dữ liệu mẫu.</p>' },
  yeuCau: [{ en: 'forecastEnd([120, 100, 85, 60]) = 3 (average burn 20 per iteration).', vi: 'forecastEnd([120, 100, 85, 60]) = 3 (trung bình 20 điểm/vòng).' }],
  viDu: [{ input: 'forecastEnd([50, 50])', output: 'Infinity', explanation: 'No progress.|||Không tiến triển.' }],
  tep: { 'burndown.js': ["const BURNDOWN = [140, 118, 125, 101, 80];\nfunction forecastEnd(remaining) {\n  return 0;\n}\nconst SCOPE_GREW = false;\n", "const BURNDOWN = [140, 118, 125, 101, 80];\nfunction forecastEnd(remaining) {\n  var n = remaining.length - 1;\n  if (n < 1) return Infinity;\n  var burn = (remaining[0] - remaining[n]) / n;\n  if (burn <= 0) return Infinity;\n  return Math.ceil(remaining[n] / burn);\n}\nconst SCOPE_GREW = BURNDOWN.some(function (v, i) { return i > 0 && v > BURNDOWN[i - 1]; });\n"] },
  kiem: [
    kiemTuy({ en: 'forecastEnd on regular data', vi: 'forecastEnd với dữ liệu thường' }, function () {
      if (typeof forecastEnd !== 'function') return 'forecastEnd is not a function';
      if (forecastEnd([120, 100, 85, 60]) !== 3) return 'forecastEnd([120, 100, 85, 60]) should be 3';
      return forecastEnd([100, 70]) === 3 ? 'OK' : 'forecastEnd([100, 70]) should be 3 (70 / 30 rounded up)';
    }),
    kiemTuy({ en: 'no progress ⇒ Infinity', vi: 'không tiến triển ⇒ Infinity' }, function () {
      if (typeof forecastEnd !== 'function') return 'forecastEnd is not a function';
      return forecastEnd([50, 50]) === Infinity && forecastEnd([40, 45]) === Infinity && forecastEnd([30]) === Infinity ? 'OK' : 'flat, growing, or a single value ⇒ Infinity';
    }),
    kiemTuy({ en: 'SCOPE_GREW for the sample burndown', vi: 'SCOPE_GREW cho dữ liệu mẫu' }, function () {
      if (typeof SCOPE_GREW === 'undefined') return 'SCOPE_GREW is missing';
      return SCOPE_GREW === true ? 'OK' : 'iteration 2 ended with more points (125) than iteration 1 (118)';
    }),
    kiemTuy({ en: 'hidden: zero remaining ⇒ 0 more iterations', vi: 'ẩn: còn 0 điểm ⇒ 0 vòng nữa' }, function () {
      if (typeof forecastEnd !== 'function') return 'forecastEnd is not a function';
      return forecastEnd([30, 10, 0]) === 0 ? 'OK' : 'nothing left ⇒ 0';
    }, { an: true }),
  ],
  goiY: ['Tốc độ trung bình = (đầu − cuối) ÷ số vòng đã xong.', 'Số vòng còn = ceil(còn lại ÷ tốc độ).'],
  loiHayGap: ['Chia cho độ dài mảng thay vì số vòng.', 'Không xử lý trường hợp không giảm.'],
  giaiThich: '<p>Because the chart tracks work remaining, scope growth shows up as a flatter slope — the "90% done" syndrome becomes visible.</p>',
  thuatNgu: [{ en: 'burndown chart', vi: 'biểu đồ burndown — điểm còn lại theo thời gian' }, { en: 'story point', vi: 'điểm story' }],
  khaiNiem: ['burndown chart'],
  boYeu: [{ ten: 'chia sai số vòng', tep: { 'burndown.js': "const BURNDOWN=[140,118,125,101,80];\nfunction forecastEnd(r){ var b=(r[0]-r[r.length-1])/r.length; return Math.round(r[r.length-1]/b); }\nconst SCOPE_GREW=false;\n" } }],
});

const E4 = tracNghiem({
  tieuDe: 'Issues 4 — managing requirements on agile projects',
  doKho: 'EASY', phut: 4,
  moTa: { en: '<p>Agile accommodates change through iterations and a dynamic product backlog: new stories that arrive mid-iteration are prioritised against the remaining backlog and allocated to future iterations; the team always works on the highest-priority stories.</p>', vi: '<p>Agile đón thay đổi qua backlog động: story mới giữa vòng được xếp ưu tiên và đưa vào các vòng sau.</p>' },
  cau: [
    { en: 'A new story arrives in the middle of a sprint. What normally happens?', vi: 'Một story mới tới giữa sprint. Bình thường xử lý thế nào?', lc: [['a', 'It is added to the backlog, prioritised, and planned into a future iteration'], ['b', 'The team starts it immediately'], ['c', 'It is rejected'], ['d', 'The sprint is cancelled']], dap: 'a', giai: ['The current sprint’s commitment is protected.', 'Cam kết của sprint hiện tại được bảo vệ.'] },
  ],
  goiY: ['Story mới ⇒ backlog.', 'Sprint hiện tại giữ nguyên.'],
  loiHayGap: ['Làm ngay story mới chen ngang.', 'Từ chối mọi story mới.'],
  giaiThich: '<p>Answers: a.</p>',
  thuatNgu: tn('backlog'),
  khaiNiem: ['agile requirements management'],
});

export default moDun({
  slug: 'swr302-7-4-ch27-issues-agile',
  ten: '7.4 Requirements issues, effort and agile management',
  moTaModule: 'Bốn loại vấn đề yêu cầu, công sức phát triển vs quản lý yêu cầu, tự viết dự báo từ biểu đồ burndown (phát hiện phạm vi phình), story mới giữa sprint.',
  de: [E1, E2, E3, E4],
});
