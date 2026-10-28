/**
 * SWR302 · 7.5 — Change control: why, policy, the process description, the CCB and renegotiating commitments (Wiegers Ch.28 slides 1–10).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, moDun } from './_bai.mjs';

const E1 = tracNghiem({
  tieuDe: 'Change process 1 — why manage changes?',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>A serious organisation ensures that proposed changes are evaluated before commitment; the appropriate people make informed business decisions; change activity is visible to affected stakeholders; approved changes are communicated to all affected participants; and changes are incorporated consistently.</p>', vi: '<p>Vì sao phải quản lý thay đổi.</p>' },
  cau: [
    { en: 'Which is NOT a goal of change control?', vi: 'Đâu KHÔNG phải mục tiêu của kiểm soát thay đổi?', lc: [['a', 'Preventing every change to the requirements'], ['b', 'Evaluating changes before committing to them'], ['c', 'Making change activity visible'], ['d', 'Communicating approved changes to everyone affected']], dap: 'a', giai: ['Change control manages change; it does not forbid it.', 'Kiểm soát thay đổi là quản lý, không phải cấm.'] },
    { en: 'Under a typical change control policy, a request not submitted through the process is…', vi: 'Theo chính sách điển hình, yêu cầu không gửi qua quy trình thì…', lc: [['a', 'not considered'], ['b', 'implemented first'], ['c', 'approved automatically'], ['d', 'given top priority']], dap: 'a', giai: ['One door for all changes.', 'Một cửa cho mọi thay đổi.'] },
    { en: 'Before a change is approved, developers may…', vi: 'Trước khi thay đổi được duyệt, dev có thể…', lc: [['a', 'explore its feasibility, but not design or implement it'], ['b', 'implement it to save time'], ['c', 'deploy it to production'], ['d', 'nothing at all']], dap: 'a', giai: ['Feasibility exploration only.', 'Chỉ thăm dò khả thi.'] },
  ],
  goiY: ['Kiểm soát ≠ cấm.', 'Không qua quy trình ⇒ không xét.'],
  loiHayGap: ['Cho dev làm trước rồi xin duyệt.', 'Nghĩ mục tiêu là chặn mọi thay đổi.'],
  giaiThich: '<p>Answers: a · a · a.</p>',
  thuatNgu: tn('ccb'),
  khaiNiem: ['change control policy'],
});

const E2 = phanLoai({
  tieuDe: 'Change process 2 — the four components of a process description',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Any process description should contain: <b>entry criteria</b> (conditions before the process can begin), <b>tasks</b> (with the responsible role and participants), <b>verification steps</b> (confirm the tasks were done correctly) and <b>exit criteria</b> (conditions indicating successful completion). Classify each line of a change control process description.</p>', vi: '<p>Bốn thành phần của mô tả quy trình. Phân loại từng dòng của mô tả quy trình kiểm soát thay đổi.</p>' },
  cot: 'Component', luaChon: ['Entry criteria', 'Tasks', 'Verification', 'Exit criteria'],
  hang: [
    ['A change request has been submitted with all required fields filled.', 'Entry criteria'],
    ['The evaluator performs an impact analysis; the CCB chair schedules the decision.', 'Tasks'],
    ['The tester confirms the change works and the affected tests pass.', 'Verification'],
    ['The request status is Closed or Rejected, and the originator has been notified.', 'Exit criteria'],
    ['The modifier updates the requirements, design, code and trace links.', 'Tasks'],
  ],
  giaiThich: '<p>These four make a process repeatable rather than heroic (Wiegers Figure 28-1).</p>',
  goiY: ['Điều kiện để bắt đầu ⇒ entry.', 'Điều kiện để kết thúc ⇒ exit.'],
  loiHayGap: ['Nhầm verification với exit criteria.', 'Quên entry criteria.'],
  thuatNgu: [{ en: 'entry / exit criteria', vi: 'tiêu chí vào / ra' }],
  khaiNiem: ['process description'],
});

const E3 = phanLoai({
  tieuDe: 'Change process 3 — the CCB charter',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>A CCB charter covers <b>purpose</b>, <b>scope of authority</b> (what it decides vs escalates), <b>membership</b>, <b>operating procedures</b> (meeting frequency, triggers for special meetings) and the <b>decision process</b> (quorum, decision rules, whether the chair can overrule, whether management must ratify). Classify each clause.</p>', vi: '<p>Điều lệ CCB gồm mục đích, phạm vi quyền hạn, thành viên, thủ tục vận hành, quy trình ra quyết định.</p>' },
  cot: 'Charter section', luaChon: ['Purpose', 'Scope of authority', 'Membership', 'Operating procedures', 'Decision process'],
  hang: [
    ['"Changes over 40 hours of effort are escalated to the steering committee."', 'Scope of authority'],
    ['"The board meets every Tuesday; any member can call an urgent meeting for production defects."', 'Operating procedures'],
    ['"Members: product owner (chair), lead developer, test lead, clinic manager."', 'Membership'],
    ['"Three members including the chair form a quorum; decisions are by consensus, otherwise the chair decides."', 'Decision process'],
    ['"The board decides which proposed changes to requirements and baselined documents are accepted."', 'Purpose'],
  ],
  giaiThich: '<p>Every project has a de facto group making these calls; the charter makes its composition, authority and procedures explicit.</p>',
  goiY: ['Cái gì phải chuyển lên cấp trên ⇒ phạm vi quyền hạn.', 'Túc số, quy tắc quyết định ⇒ decision process.'],
  loiHayGap: ['Nhầm thủ tục họp với quy trình quyết định.', 'Không ghi quyền hạn.'],
  thuatNgu: tn('ccb'),
  khaiNiem: ['CCB charter'],
});

const E4 = tracNghiem({
  tieuDe: 'Change process 4 — renegotiating commitments',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Stakeholders cannot keep adding functionality to a project with fixed schedule, staff, budget and quality and still succeed. Before accepting a significant change, renegotiate commitments — more time, or defer lower-priority requirements. If no adjustment is granted, document the threat to success in the risk list.</p>', vi: '<p>Trước khi nhận thay đổi lớn, thương lượng lại cam kết; không được thì ghi rủi ro.</p>' },
  cau: [
    { en: 'The CCB approves a large change but management refuses to move the date. What should the PM do?', vi: 'CCB duyệt một thay đổi lớn nhưng quản lý không cho dời ngày. PM nên làm gì?', lc: [['a', 'Propose deferring lower-priority requirements; if refused, record the threat in the risk list'], ['b', 'Silently ask the team to work weekends'], ['c', 'Lower the quality without telling anyone'], ['d', 'Ignore the change']], dap: 'a', giai: ['Make the trade-off visible.', 'Làm sự đánh đổi hiện rõ.'] },
    { en: 'Saying yes to a change without adjusting commitments usually leads to…', vi: 'Nhận thay đổi mà không điều chỉnh cam kết thường dẫn tới…', lc: [['a', 'a project that quietly fails its schedule, budget or quality'], ['b', 'a happier team'], ['c', 'nothing'], ['d', 'fewer defects']], dap: 'a', giai: ['How projects quietly fail.', 'Cách dự án âm thầm thất bại.'] },
  ],
  goiY: ['Thêm việc ⇒ thêm thời gian hoặc bớt việc khác.', 'Không thương lượng được ⇒ ghi rủi ro.'],
  loiHayGap: ['Ép đội làm thêm giờ âm thầm.', 'Hạ chất lượng mà không nói.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: tn('ccb', 'scopeCreep'),
  khaiNiem: ['renegotiating commitments'],
});

export default moDun({
  slug: 'swr302-7-5-ch28-change-control',
  ten: '7.5 Change control: policy, process and the CCB',
  moTaModule: 'Vì sao quản lý thay đổi, điều khoản chính sách, bốn thành phần của mô tả quy trình (entry/tasks/verification/exit), điều lệ CCB, thương lượng lại cam kết.',
  de: [E1, E2, E3, E4],
});
