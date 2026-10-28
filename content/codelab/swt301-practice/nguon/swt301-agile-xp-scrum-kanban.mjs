/**
 * SWT301 · 9.2 — XP, Scrum, Kanban (Topic 8 slide 23–47, FA-1.2.1).
 */
import { doiDau, KHOA, hai, giai, lc } from './_chung.mjs';
import { tinhDe, jsDe, kiemTuy } from './_de.mjs';

const PP = ['XP', 'Scrum', 'Kanban'];
const E1 = tinhDe({
  tieuDe: 'Agile approaches 1 — XP, Scrum or Kanban?',
  doKho: 'EASY', phut: 7,
  moTa: { en: '<p>XP focuses on engineering practices, Scrum is a management framework with fixed sprints, Kanban visualises and limits the flow of work. Name the approach of each practice or term.</p>', vi: '<p>XP tập trung thực hành kỹ thuật, Scrum là khung quản lý với sprint cố định, Kanban trực quan hoá và giới hạn dòng công việc. Gọi tên cách tiếp cận của từng thực hành/thuật ngữ.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Practice → approach', 'Thực hành → cách tiếp cận'),
    cot: [{ ma: 'p', ten: 'Practice / term' }, { ma: 'a', ten: 'Approach', luaChon: PP }],
    hang: ['Pair programming and collective code ownership', 'Product Owner, Scrum Master and Developers', 'A work-in-progress limit per board column', 'Sprint of 1–4 weeks with a protected sprint goal', 'Test-first: unit tests for all code before release', 'Lead time measured from request to delivery', 'Definition of Done and the sprint review', 'Five values, fourteen principles, thirteen practices'].map((p, i) => ({ ma: `r${i}`, o: { p } })),
    dapAn: { 'r0.a': PP[0], 'r1.a': PP[1], 'r2.a': PP[2], 'r3.a': PP[1], 'r4.a': PP[0], 'r5.a': PP[2], 'r6.a': PP[1], 'r7.a': PP[0] },
    giaiThich: giai('XP: engineering practices and testing guidance; Scrum: roles, artefacts, timeboxes, no testing guidance; Kanban: board, WIP limits, pull, lead time, optional iterations.', 'XP: thực hành kỹ thuật và hướng dẫn test; Scrum: vai trò, artefact, timebox, không hướng dẫn test; Kanban: bảng, giới hạn WIP, kéo, lead time, iteration không bắt buộc.'),
  }],
  goiY: ['Chỉ XP có hướng dẫn kiểm thử cụ thể.', 'WIP limit, lead time ⇒ Kanban.'],
  loiHayGap: ['Gán Definition of Done cho XP.', 'Cho rằng Kanban bắt buộc có sprint.'],
  giaiThich: '<p>XP · Scrum · Kanban · Scrum · XP · Kanban · Scrum · XP.</p>',
  thuatNgu: [{ en: 'WIP limit', vi: 'giới hạn việc đang làm' }, { en: 'lead time', vi: 'thời gian từ lúc yêu cầu tới lúc giao' }, { en: 'Definition of Done', vi: 'định nghĩa “xong”' }],
  khaiNiem: ['Agile approaches'],
});

const E2 = jsDe({
  tieuDe: 'Agile approaches 2 — Measure a Kanban board',
  doKho: 'MEDIUM', phut: 15,
  moTa: { en: `<p>The LabBook team runs Kanban with columns <code>Todo → Dev → Test → Done</code>. Each card is <code>{ id, column, created, started, done }</code> (day numbers; <code>started</code>/<code>done</code> null until then).</p>
<p>Write <code>kanban(cards, wip)</code> where <code>wip</code> = <code>{ Dev, Test }</code> limits. Return:</p>
<ul><li><code>wipViolations</code> — the columns (Dev, Test, in this order) whose number of cards exceeds the limit;</li>
<li><code>leadTime</code> — average of done − created over Done cards (1 decimal, null if none);</li>
<li><code>cycleTime</code> — average of done − started over Done cards (1 decimal, null if none);</li>
<li><code>canPull</code> — <code>{ Dev: boolean, Test: boolean }</code>: whether one more card can be pulled into the column without breaking its limit.</li></ul>`, vi: `<p>Nhóm LabBook dùng Kanban với các cột <code>Todo → Dev → Test → Done</code>. Viết <code>kanban(cards, wip)</code> trả: cột vượt giới hạn WIP, lead time trung bình (done − created), cycle time trung bình (done − started) của thẻ Done (1 chữ số), và cột nào còn kéo thêm được một thẻ.</p>` },
  yeuCau: [{ en: 'Kanban is a pull system: a column with room pulls the next card; a full column must finish work first.', vi: 'Kanban là hệ thống kéo: cột còn chỗ mới kéo thẻ kế tiếp; cột đầy phải làm xong trước.' }],
  viDu: [{ input: "kanban([{id:'A',column:'Done',created:1,started:2,done:5},{id:'B',column:'Test',created:2,started:3,done:null},{id:'C',column:'Dev',created:3,started:4,done:null},{id:'D',column:'Dev',created:3,started:5,done:null}], {Dev:2,Test:1})", output: "{ wipViolations: [], leadTime: 4, cycleTime: 3, canPull: { Dev: false, Test: false } }", explanation: 'Dev holds 2 of 2, Test 1 of 1: both full but not over the limit.|||Dev 2/2, Test 1/1: đầy nhưng chưa vượt.' }],
  goiY: ['Đếm số thẻ theo cột trước.', 'canPull: số thẻ hiện tại + 1 ≤ giới hạn.'],
  loiHayGap: ['Tính lead time từ started (đó là cycle time).', 'Coi cột đầy (bằng giới hạn) là vi phạm.'],
  giaiThich: '<p>Lead time is what the customer feels; cycle time is what the team controls. WIP limits keep cycle time short and expose bottlenecks — often the Test column, a signal to swarm on testing.</p>',
  thuatNgu: [{ en: 'cycle time', vi: 'thời gian từ lúc bắt đầu làm tới lúc xong' }, { en: 'pull system', vi: 'hệ thống kéo' }, { en: 'bottleneck', vi: 'nút thắt' }],
  khaiNiem: ['Kanban'],
  tep: {
    'kanban.js': [
      'function kanban(cards, wip) {\n  return { wipViolations: [], leadTime: null, cycleTime: null, canPull: { Dev: true, Test: true } };\n}\n',
      `function kanban(cards, wip) {
  const count = (c) => cards.filter((x) => x.column === c).length;
  const done = cards.filter((x) => x.column === 'Done');
  const avg = (f) => (done.length ? Math.round((done.reduce((s, x) => s + f(x), 0) / done.length) * 10) / 10 : null);
  return {
    wipViolations: ['Dev', 'Test'].filter((c) => count(c) > wip[c]),
    leadTime: avg((x) => x.done - x.created),
    cycleTime: avg((x) => x.done - x.started),
    canPull: { Dev: count('Dev') + 1 <= wip.Dev, Test: count('Test') + 1 <= wip.Test },
  };
}
`,
    ],
  },
  kiem: [
    kiemTuy({ en: 'the example', vi: 'ví dụ' }, () => { const r = kanban([{ id: 'A', column: 'Done', created: 1, started: 2, done: 5 }, { id: 'B', column: 'Test', created: 2, started: 3, done: null }, { id: 'C', column: 'Dev', created: 3, started: 4, done: null }, { id: 'D', column: 'Dev', created: 3, started: 5, done: null }], { Dev: 2, Test: 1 }); return JSON.stringify(r) === JSON.stringify({ wipViolations: [], leadTime: 4, cycleTime: 3, canPull: { Dev: false, Test: false } }) ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'violations in order Dev, Test', vi: 'vi phạm theo thứ tự Dev, Test' }, () => { const C = (id, column) => ({ id, column, created: 0, started: 0, done: null }); const r = kanban([C('a', 'Test'), C('b', 'Test'), C('c', 'Dev'), C('d', 'Dev'), C('e', 'Dev')], { Dev: 2, Test: 1 }); return JSON.stringify(r.wipViolations) === '["Dev","Test"]' && !r.canPull.Dev ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'lead and cycle times are averaged and rounded', vi: 'lead time và cycle time được lấy trung bình và làm tròn' }, () => { const r = kanban([{ id: 'a', column: 'Done', created: 0, started: 1, done: 4 }, { id: 'b', column: 'Done', created: 2, started: 2, done: 5 }, { id: 'c', column: 'Done', created: 1, started: 3, done: 4 }], { Dev: 3, Test: 3 }); return r.leadTime === 3.3 && r.cycleTime === 2.3 && r.canPull.Dev && r.canPull.Test ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'no Done cards', vi: 'chưa có thẻ Done' }, () => { const r = kanban([{ id: 'a', column: 'Todo', created: 0, started: null, done: null }], { Dev: 1, Test: 1 }); return r.leadTime === null && r.cycleTime === null ? 'OK' : 'got ' + JSON.stringify(r); }, { an: true }),
  ],
});

const E3 = tinhDe({
  tieuDe: 'Agile approaches 3 — Exam questions (K1)',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Five FE-style questions on Topic 8 slides 23–47 about XP, Scrum and Kanban and the practices all Agile teams share.</p>', vi: '<p>Năm câu kiểu FE về slide Topic 8 23–47 về XP, Scrum, Kanban và các thực hành chung của mọi đội Agile.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('Which approach gives explicit guidance on how to test?', 'Cách tiếp cận nào hướng dẫn rõ cách kiểm thử?'), luaChon: lc(['a', 'Scrum'], ['b', 'XP'], ['c', 'Kanban'], ['d', 'None']), dapAn: ['b'], giaiThich: giai('Scrum and Kanban do not prescribe testing practices.', 'Scrum và Kanban không quy định thực hành test.') },
    { ma: 'q2', de: hai('In Scrum, who owns the product backlog?', 'Trong Scrum, ai sở hữu product backlog?'), luaChon: lc(['a', 'The Scrum Master'], ['b', 'The Product Owner'], ['c', 'The testers'], ['d', 'The customer’s lawyer']), dapAn: ['b'], giaiThich: giai('The PO orders the backlog by value.', 'PO sắp backlog theo giá trị.') },
    { ma: 'q3', de: hai('Which is shared by most Agile approaches (slide 25)?', 'Thực hành nào chung cho hầu hết cách tiếp cận Agile (slide 25)?'), luaChon: lc(['a', 'Collaborative user story creation, retrospectives, continuous integration, release and iteration planning'], ['b', 'Big up-front design'], ['c', 'Separate test phase at the end'], ['d', 'Fixed-price contracts']), dapAn: ['a'], giaiThich: giai('The four common practices.', 'Bốn thực hành chung.') },
    { ma: 'q4', de: hai('What happens in Kanban when the Test column reaches its WIP limit?', 'Trong Kanban, khi cột Test đạt giới hạn WIP thì sao?'), luaChon: lc(['a', 'Developers keep pushing cards into it'], ['b', 'No new card is pulled into Test; the team helps finish testing first'], ['c', 'The limit is removed'], ['d', 'The sprint ends']), dapAn: ['b'], giaiThich: giai('Limits expose bottlenecks and focus the team.', 'Giới hạn làm lộ nút thắt và giúp đội tập trung.') },
    { ma: 'q5', de: hai('In Scrum, the sprint goal during the sprint is…', 'Trong Scrum, mục tiêu sprint trong lúc sprint chạy…'), luaChon: lc(['a', 'changed daily'], ['b', 'protected — no changes that endanger it'], ['c', 'set by the testers'], ['d', 'optional']), dapAn: ['b'], giaiThich: giai('Unlike XP, where the customer may swap stories.', 'Khác XP, nơi khách hàng có thể đổi story.') },
  ],
  goiY: ['XP = kỹ thuật + test; Scrum = quản lý; Kanban = dòng chảy.', 'PO sở hữu backlog.'],
  loiHayGap: ['Cho rằng Scrum quy định cách test.', 'Cho rằng Scrum Master sở hữu backlog.'],
  giaiThich: '<p>Answers: b · b · a · b · b.</p>',
  thuatNgu: [{ en: 'Product Owner', vi: 'chủ sản phẩm' }, { en: 'Scrum Master', vi: 'người hỗ trợ quy trình Scrum' }],
  khaiNiem: ['Agile approaches'],
});

export default doiDau({
  slug: 'swt301-agile-xp-scrum-kanban',
  ten: '9.2 Agile approaches: XP, Scrum, Kanban',
  moTaModule: 'Phân biệt thực hành XP, Scrum, Kanban, viết code đo bảng Kanban (vi phạm WIP, lead time, cycle time, có kéo thêm được không), câu thi.',
  khoa: KHOA,
  baiHoc: 'swt301-agile-xp-scrum-kanban',
  de: [E1, E2, E3],
});
