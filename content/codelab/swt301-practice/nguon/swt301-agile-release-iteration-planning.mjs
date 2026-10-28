/**
 * SWT301 · 9.4 — Release planning vs iteration planning, and the tester in both (Topic 8 slide 65–74, FA-1.2.5).
 */
import { doiDau, KHOA, hai, giai, lc } from './_chung.mjs';
import { tinhDe, jsDe, kiemTuy } from './_de.mjs';

const KH = ['Release planning', 'Iteration planning'];
const E1 = tinhDe({
  tieuDe: 'Planning 1 — Release planning or iteration planning?',
  doKho: 'EASY', phut: 7,
  moTa: { en: '<p>Release planning looks months ahead and decides which features go into a release; iteration planning looks one sprint ahead and turns the selected stories into tasks. The tester adds value in both. Classify each activity.</p>', vi: '<p>Release planning nhìn trước vài tháng và quyết định tính năng nào vào bản phát hành; iteration planning nhìn trước một sprint và biến story đã chọn thành task. Tester đóng góp ở cả hai. Phân loại từng hoạt động.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Activity → level', 'Hoạt động → tầng'),
    cot: [{ ma: 'a', ten: 'Activity' }, { ma: 'l', ten: 'Level', luaChon: KH }],
    hang: [
      'Define the release backlog of LabBook 2.0 and estimate its stories at high level',
      'Break the story “cancel a booking” into tasks of about one day, including testing tasks',
      'Write the release test plan: test levels, environments and a quality-risk analysis of the features',
      'Check each selected story for testability and write its acceptance tests',
      'Estimate the test effort of every task in the sprint',
      'Decide that the exam-week rule goes into release 2.1, not 2.0',
    ].map((a, i) => ({ ma: `r${i}`, o: { a } })),
    dapAn: { 'r0.l': KH[0], 'r1.l': KH[1], 'r2.l': KH[0], 'r3.l': KH[1], 'r4.l': KH[1], 'r5.l': KH[0] },
    giaiThich: giai('Release: backlog, high-level estimates, release test plan, quality-risk analysis of features. Iteration: detailed risk analysis, testability check, acceptance tests, testing tasks and their estimates.', 'Release: backlog, ước lượng mức cao, kế hoạch test của bản phát hành, rủi ro chất lượng theo tính năng. Iteration: rủi ro chi tiết, soát tính kiểm thử được, acceptance test, task test và ước lượng.'),
  }],
  goiY: ['Vài tháng, tính năng ⇒ release; một sprint, task ⇒ iteration.', 'Acceptance test chi tiết viết ở iteration planning.'],
  loiHayGap: ['Gán kế hoạch test của bản phát hành cho iteration.', 'Cho rằng tester không dự release planning.'],
  giaiThich: '<p>R · I · R · I · I · R.</p>',
  thuatNgu: [{ en: 'release backlog / iteration backlog', vi: 'backlog bản phát hành / backlog sprint' }],
  khaiNiem: ['release and iteration planning'],
});

const E2 = jsDe({
  tieuDe: 'Planning 2 — Fill the sprint within the team’s velocity',
  doKho: 'MEDIUM', phut: 15,
  moTa: { en: `<p>Iteration planning pulls stories from the release backlog. Write <code>planSprint(backlog, velocity)</code>: <code>backlog</code> = <code>[{ id, points, priority, dependsOn: [ids], testable }]</code> (priority 1 = highest).</p>
<ol><li>Stories that are <b>not testable</b> (no acceptance criteria) are never taken — they go to <code>needsRefinement</code> (in backlog order).</li>
<li>Consider the remaining stories in priority order (ties: backlog order). Take a story if its points still fit in the remaining velocity <b>and</b> all its dependencies are already taken; otherwise skip it and continue with the next one.</li></ol>
<p>Return <code>{ sprint: [ids in the order taken], points, needsRefinement }</code>.</p>`, vi: `<p>Iteration planning kéo story từ release backlog. Viết <code>planSprint(backlog, velocity)</code>: story không kiểm thử được (chưa có acceptance criteria) không bao giờ được nhận — chuyển vào <code>needsRefinement</code>; các story còn lại xét theo ưu tiên (bằng nhau theo thứ tự backlog), nhận nếu điểm còn vừa velocity VÀ mọi phụ thuộc đã được nhận, nếu không thì bỏ qua và xét story kế tiếp.</p>` },
  yeuCau: [{ en: 'One pass in priority order is enough — a skipped story is not reconsidered.', vi: 'Chỉ duyệt một lượt theo ưu tiên — story đã bỏ qua không xét lại.' }],
  viDu: [{ input: "planSprint([{id:'S1',points:5,priority:1,dependsOn:[],testable:true},{id:'S2',points:8,priority:2,dependsOn:[],testable:true},{id:'S3',points:3,priority:2,dependsOn:['S1'],testable:true},{id:'S4',points:2,priority:1,dependsOn:[],testable:false}], 10)", output: "{ sprint: ['S1','S3'], points: 8, needsRefinement: ['S4'] }", explanation: 'S2 (8) does not fit after S1 (5); S3 fits and its dependency S1 is taken.|||S2 (8) không vừa sau S1 (5); S3 vừa và phụ thuộc S1 đã nhận.' }],
  goiY: ['Sắp bản sao theo priority (sort ổn định giữ thứ tự backlog).', 'Theo dõi điểm còn lại và tập story đã nhận.'],
  loiHayGap: ['Nhận story chưa có acceptance criteria.', 'Dừng hẳn khi gặp story không vừa thay vì xét story nhỏ hơn phía sau.'],
  giaiThich: '<p>The tester’s check “is this story testable?” happens exactly here: a story without acceptance criteria goes back to refinement instead of into the sprint.</p>',
  thuatNgu: [{ en: 'velocity', vi: 'tốc độ — số điểm đội làm được mỗi sprint' }, { en: 'story points', vi: 'điểm story' }, { en: 'refinement', vi: 'làm mịn backlog' }],
  khaiNiem: ['iteration planning'],
  tep: {
    'sprint.js': [
      'function planSprint(backlog, velocity) {\n  return { sprint: [], points: 0, needsRefinement: [] };\n}\n',
      `function planSprint(backlog, velocity) {
  const needsRefinement = backlog.filter((s) => !s.testable).map((s) => s.id);
  const order = backlog.map((s, i) => ({ s, i })).filter((x) => x.s.testable)
    .sort((a, b) => a.s.priority - b.s.priority || a.i - b.i).map((x) => x.s);
  const taken = new Set();
  const sprint = [];
  let left = velocity;
  for (const s of order) {
    if (s.points <= left && (s.dependsOn || []).every((d) => taken.has(d))) {
      sprint.push(s.id);
      taken.add(s.id);
      left -= s.points;
    }
  }
  return { sprint, points: velocity - left, needsRefinement };
}
`,
    ],
  },
  kiem: [
    kiemTuy({ en: 'the example', vi: 'ví dụ' }, () => { const r = planSprint([{ id: 'S1', points: 5, priority: 1, dependsOn: [], testable: true }, { id: 'S2', points: 8, priority: 2, dependsOn: [], testable: true }, { id: 'S3', points: 3, priority: 2, dependsOn: ['S1'], testable: true }, { id: 'S4', points: 2, priority: 1, dependsOn: [], testable: false }], 10); return JSON.stringify(r) === JSON.stringify({ sprint: ['S1', 'S3'], points: 8, needsRefinement: ['S4'] }) ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'a dependency not taken blocks the story', vi: 'phụ thuộc chưa nhận thì chặn story' }, () => { const r = planSprint([{ id: 'A', points: 13, priority: 1, dependsOn: [], testable: true }, { id: 'B', points: 3, priority: 2, dependsOn: ['A'], testable: true }, { id: 'C', points: 5, priority: 3, dependsOn: [], testable: true }], 8); return JSON.stringify(r.sprint) === '["C"]' && r.points === 5 ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'ties keep backlog order', vi: 'bằng ưu tiên giữ thứ tự backlog' }, () => { const r = planSprint([{ id: 'X', points: 3, priority: 2, dependsOn: [], testable: true }, { id: 'Y', points: 3, priority: 2, dependsOn: [], testable: true }, { id: 'Z', points: 3, priority: 2, dependsOn: [], testable: true }], 6); return JSON.stringify(r.sprint) === '["X","Y"]' ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'exact fit and empty backlog', vi: 'vừa khít và backlog rỗng' }, () => { const a = planSprint([{ id: 'A', points: 10, priority: 1, dependsOn: [], testable: true }], 10); const b = planSprint([], 10); return a.points === 10 && b.sprint.length === 0 && b.points === 0 ? 'OK' : 'got ' + JSON.stringify([a, b]); }, { an: true }),
  ],
});

const E3 = tinhDe({
  tieuDe: 'Planning 3 — The tester in planning (K1)',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>Five questions on Topic 8 slides 65–74: what testers contribute to release and iteration planning and how plans change during a release.</p>', vi: '<p>Năm câu về slide Topic 8 65–74: tester đóng góp gì cho release và iteration planning, và kế hoạch thay đổi thế nào trong một bản phát hành.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('Which is a tester contribution to release planning?', 'Đâu là đóng góp của tester trong release planning?'), luaChon: lc(['a', 'Writing all the code'], ['b', 'Defining testable stories with high-level acceptance criteria and a quality-risk analysis of the features'], ['c', 'Choosing the programming language'], ['d', 'Approving the budget']), dapAn: ['b'], giaiThich: giai('Plus test effort per story, test levels, the release test plan.', 'Cùng với công sức test mỗi story, các cấp test, kế hoạch test bản phát hành.') },
    { ma: 'q2', de: hai('Which is a tester contribution to iteration planning?', 'Đâu là đóng góp của tester trong iteration planning?'), luaChon: lc(['a', 'Breaking stories into testing tasks and estimating them, and checking testability'], ['b', 'Signing the contract'], ['c', 'Setting the release date'], ['d', 'Nothing']), dapAn: ['a'], giaiThich: giai('Detailed risk analysis, acceptance tests, tasks and estimates.', 'Phân tích rủi ro chi tiết, acceptance test, task và ước lượng.') },
    { ma: 'q3', de: hai('A release plan changes after sprint 3 because of new business needs. What should testers do?', 'Kế hoạch bản phát hành đổi sau sprint 3 vì nhu cầu mới. Tester nên làm gì?'), luaChon: lc(['a', 'Refuse the change'], ['b', 'Adapt: update the risk analysis, the test plan and the regression scope'], ['c', 'Ignore it until the end'], ['d', 'Stop testing']), dapAn: ['b'], giaiThich: giai('Plans are revised continuously in Agile.', 'Kế hoạch được điều chỉnh liên tục trong Agile.') },
    { ma: 'q4', de: hai('Which may change the content of an iteration plan?', 'Điều gì có thể thay đổi nội dung kế hoạch iteration?'), luaChon: lc(['a', 'Defects found in the previous iteration and changes in risk'], ['b', 'Nothing can'], ['c', 'Only the CEO'], ['d', 'The colour of the board']), dapAn: ['a'], giaiThich: giai('Fixing defects and new risks compete with new stories.', 'Sửa lỗi và rủi ro mới cạnh tranh với story mới.') },
    { ma: 'q5', de: hai('What is a typical size of a task after iteration planning?', 'Kích thước điển hình của task sau iteration planning?'), luaChon: lc(['a', 'About one day or less'], ['b', 'A whole sprint'], ['c', 'A month'], ['d', 'One minute']), dapAn: ['a'], giaiThich: giai('Small tasks make progress visible every day.', 'Task nhỏ giúp tiến độ thấy được mỗi ngày.') },
  ],
  goiY: ['Release = tính năng, rủi ro chất lượng, kế hoạch test bản phát hành.', 'Iteration = task test, acceptance test, ước lượng.'],
  loiHayGap: ['Cho rằng kế hoạch Agile cố định.', 'Chọn “cả sprint” cho kích thước task.'],
  giaiThich: '<p>Answers: b · a · b · a · a.</p>',
  thuatNgu: [{ en: 'task', vi: 'việc nhỏ trong sprint' }],
  khaiNiem: ['release and iteration planning'],
});

export default doiDau({
  slug: 'swt301-agile-release-iteration-planning',
  ten: '9.4 Release planning and iteration planning',
  moTaModule: 'Phân biệt release planning và iteration planning trên LabBook, viết code lập sprint theo velocity, ưu tiên, phụ thuộc và tính kiểm thử được, câu thi về vai trò tester trong lập kế hoạch.',
  khoa: KHOA,
  baiHoc: 'swt301-agile-release-iteration-planning',
  de: [E1, E2, E3],
});
