/**
 * SWR302 · 4.6 — Flow and behavioural models: swimlane and state-transition diagrams (Wiegers Ch.12 slides 10–17 + LAB L.3, L.4).
 */
import { tn, CU_PHAP } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';
import { kiemState, kiemSwimlane } from './_kiemmh.mjs';
import { khoiThamChieu } from './_ve.mjs';

const E1 = phanLoai({
  tieuDe: 'Behaviour models 1 — state or activity?',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>A <b>state</b> is where an object sits still (adjective or past participle: Submitted, Approved, Paid). An <b>activity</b> is work being done (Checking, Approving, Paying) — it belongs on a swimlane, not on a state diagram. Classify each name proposed for the life of a <b>Leave Request</b>.</p>', vi: '<p><b>Trạng thái</b> là chỗ đối tượng nằm yên (tính từ/quá khứ phân từ: Submitted, Approved, Paid). <b>Hoạt động</b> là việc đang làm (Checking, Approving, Paying) — thuộc swimlane, không thuộc sơ đồ trạng thái. Phân loại từng tên đề xuất cho đời sống một <b>Đơn xin nghỉ</b>.</p>' },
  cot: 'Kind', luaChon: ['State', 'Activity'],
  hang: [['Submitted', 'State'], ['Checking balance', 'Activity'], ['Approved', 'State'], ['Rejected', 'State'], ['Approving', 'Activity'], ['Pending manager review', 'State'], ['Send email to HR', 'Activity'], ['Cancelled', 'State']],
  giaiThich: '<p>States name conditions; activities name work. "Pending manager review" is a condition (waiting), so it is a state.</p>',
  goiY: ['Đọc: "đơn đang ở trạng thái …" — nếu nghe tự nhiên ⇒ state.', 'Động từ dạng -ing hay mệnh lệnh ⇒ activity.'],
  loiHayGap: ['Đặt "Approving" làm trạng thái.', 'Coi "Pending manager review" là activity vì có chữ review.'],
  thuatNgu: tn('stateDiagram', 'swimlane'),
  khaiNiem: ['states vs activities'],
});

const E2 = tracNghiem({
  tieuDe: 'Behaviour models 2 — swimlane basics',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>A swimlane (activity) diagram shows who does what, in what order. Lanes are <b>roles</b>, actions sit in the lane of whoever performs them, and every line crossing a lane boundary is a hand-off — where delays usually hide.</p>', vi: '<p>Swimlane (sơ đồ hoạt động) cho thấy ai làm gì, theo thứ tự nào. Lane là <b>vai trò</b>, hành động nằm trong lane của người làm, và mỗi đường cắt qua ranh giới lane là một điểm bàn giao — nơi chậm trễ thường ẩn.</p>' },
  cau: [
    { en: 'What should a lane represent?', vi: 'Một lane nên đại diện cho gì?', lc: [['a', 'A department'], ['b', 'A role (or a system) that performs actions'], ['c', 'A screen'], ['d', 'A data store']], dap: 'b', giai: ['Roles, not departments.', 'Vai trò, không phải phòng ban.'] },
    { en: 'Why count the hand-offs in a swimlane?', vi: 'Vì sao đếm điểm bàn giao trong swimlane?', lc: [['a', 'To decorate the diagram'], ['b', 'Hand-offs are where work waits — fewer hand-offs usually means a faster process'], ['c', 'It is required by UML'], ['d', 'To count the developers']], dap: 'b', giai: ['They turn "slow process" into evidence.', 'Chúng biến "quy trình chậm" thành bằng chứng.'] },
    { en: 'Which question does a swimlane answer that a DFD does not?', vi: 'Swimlane trả lời câu hỏi nào mà DFD không trả lời?', lc: [['a', 'Where is the data stored?'], ['b', 'Who acts, and in which order?'], ['c', 'What are the entities and their cardinality?'], ['d', 'Which states can an object be in?']], dap: 'b', giai: ['DFD = data; swimlane = who and when.', 'DFD = dữ liệu; swimlane = ai và khi nào.'] },
  ],
  goiY: ['Lane = vai trò; hành động ở lane của người thực hiện.', 'Swimlane ≠ DFD.'],
  loiHayGap: ['Vẽ kho dữ liệu trong swimlane.', 'Lane theo phòng ban thay vì vai trò.'],
  giaiThich: '<p>Answers: b · b · b.</p>',
  thuatNgu: tn('swimlane'),
  khaiNiem: ['swimlane diagram'],
});

const GIAI_ST = `
stateDiagram-v2
  [*] --> Draft : employee creates request
  state "Pending Approval" as Pending
  Draft --> Pending : submit [days requested <= remaining balance]
  Draft --> Cancelled : employee discards draft
  Pending --> Approved : manager approves
  Pending --> Rejected : manager rejects / notify employee
  Pending --> Approved : 3 working days elapsed [no manager decision] / auto-approve
  Approved --> Cancelled : employee cancels [start date not reached]
  Approved --> Taken : start date reached
  Rejected --> [*]
  Cancelled --> [*]
  Taken --> [*]
`;
const E3 = baiJs({
  tieuDe: 'Behaviour models 3 — the state machine of a leave request',
  doKho: 'HARD', phut: 15,
  moTa: { en: `<p>An employee creates a leave request as a draft and submits it — only if the days requested do not exceed the remaining balance. The manager approves or rejects it; if the manager does nothing for 3 working days the request is approved automatically. An approved request can still be cancelled by the employee before the start date; when the start date arrives the leave is taken. A draft can be discarded. Draw the state diagram of a <b>Leave Request</b>.</p><p>${CU_PHAP.state.en}</p>`, vi: `<p>Nhân viên tạo đơn nghỉ ở dạng nháp rồi gửi — chỉ khi số ngày xin không vượt số ngày còn lại. Quản lý duyệt hoặc từ chối; nếu quản lý không làm gì trong 3 ngày làm việc thì đơn tự được duyệt. Đơn đã duyệt vẫn có thể bị nhân viên huỷ trước ngày bắt đầu; tới ngày bắt đầu thì đơn thành đã nghỉ. Bản nháp có thể bị bỏ. Vẽ sơ đồ trạng thái của <b>Leave Request</b>.</p><p>${CU_PHAP.state.vi}</p>` },
  yeuCau: [{ en: 'Initial and final states; Draft, Pending, Approved, Rejected, Cancelled, Taken; guards on the balance rule, the auto-approval and the cancellation.', vi: 'Có đầu và cuối; Draft, Pending, Approved, Rejected, Cancelled, Taken; guard cho luật số dư, tự duyệt và huỷ.' }],
  viDu: [{ input: 'Draft --> Pending : submit [days requested <= remaining balance]', output: 'a guarded transition', explanation: 'The guard is the business rule.|||Guard là business rule.' }],
  tep: { 'state.js': ['const STATE_DIAGRAM = ´\nstateDiagram-v2\n  [*] --> Draft\n  Draft --> Approved : approve\n  Approved --> [*]\n´;\n', `const STATE_DIAGRAM = ´${GIAI_ST.replace(/\s+$/, '')}\n´;\n`] },
  kiem: kiemState({
    bien: 'STATE_DIAGRAM', tenDoiTuong: 'the leave request', toiThieu: 5, guardToiThieu: 3,
    st: [{ ten: 'Draft', khop: ['draft|created|new'] }, { ten: 'Pending approval', khop: ['pending|submitted|waiting'] }, { ten: 'Approved', khop: ['approv'] }, { ten: 'Rejected', khop: ['reject'] }, { ten: 'Cancelled', khop: ['cancel'] }],
    ch: [
      { ten: 'submit only within the balance (guard)', tenVi: 'chỉ gửi khi trong số dư (guard)', tu: ['draft|created|new'], den: ['pending|submitted|waiting'], guard: true, lyDo: 'the balance rule decides whether submitting is allowed', lyDoVi: 'luật số dư quyết định có được gửi không' },
      { ten: 'auto-approval after 3 working days', tenVi: 'tự duyệt sau 3 ngày làm việc', tu: ['pending|submitted|waiting'], den: ['approv'], suKien: ['3|three|day|elapse|timeout|auto'] },
      { ten: 'cancel an approved request before the start date (guard)', tenVi: 'huỷ đơn đã duyệt trước ngày bắt đầu (guard)', tu: ['approv'], den: ['cancel'], guard: true, lyDo: 'only before the start date', lyDoVi: 'chỉ trước ngày bắt đầu' },
    ],
  }),
  goiY: ['Pending có ba lối ra: duyệt, từ chối, tự duyệt sau 3 ngày.', 'Guard nằm trong [ ]: [days requested <= remaining balance], [start date not reached].'],
  loiHayGap: ['Đặt "Approving" làm trạng thái.', 'Quên chuyển theo thời gian (3 ngày) — sự kiện thời gian cũng là sự kiện.'],
  giaiThich: `<p>Six states; the business rules appear as guards; the 3-day rule is a time event.</p>${khoiThamChieu('state', GIAI_ST, 'State machine — Leave Request', { __dau: [60, 80], Draft: [190, 200], Cancelled: [190, 400], Pending: [440, 200], Rejected: [440, 400], Approved: [700, 200], Taken: [880, 360] })}`,
  thuatNgu: tn('stateDiagram', 'guard'),
  khaiNiem: ['state-transition diagram'],
  boYeu: [{ ten: 'không guard, tên hoạt động', tep: { 'state.js': 'const STATE_DIAGRAM = `\nstateDiagram-v2\n  [*] --> Draft\n  Draft --> Approving : submit\n  Approving --> Approved : approve\n  Approving --> Rejected : reject\n  Approved --> [*]\n  Rejected --> [*]\n`;\n' } }],
});

const GIAI_SW = `
@startuml
|Employee|
start
:Submit leave request;
|HR System|
:Check remaining balance;
if (Balance sufficient?) then (yes)
  :Forward request to manager;
  |Manager|
  :Review leave request;
  if (Approve?) then (yes)
    :Approve request;
    |HR System|
    :Update leave balance;
  else (no)
    :Reject request with reason;
  endif
else (no)
  :Return request to employee;
endif
|Employee|
:Read decision;
stop
@enduml
`;
const E4 = baiJs({
  tieuDe: 'Behaviour models 4 — the swimlane of leave approval',
  doKho: 'HARD', phut: 15,
  moTa: { en: `<p>The <b>employee</b> submits a leave request; the <b>HR system</b> checks the remaining balance — if it is not enough the request goes back to the employee; otherwise it is forwarded to the <b>manager</b>, who approves or rejects it (with a reason). After an approval the HR system updates the balance. Finally the employee reads the decision. Draw the swimlane.</p><p>${CU_PHAP.swimlane.en}</p>`, vi: `<p><b>Nhân viên</b> gửi đơn nghỉ; <b>hệ thống HR</b> kiểm tra số ngày còn lại — không đủ thì trả đơn về nhân viên; đủ thì chuyển cho <b>quản lý</b>, quản lý duyệt hoặc từ chối (kèm lý do). Sau khi duyệt, hệ thống HR cập nhật số dư. Cuối cùng nhân viên đọc quyết định. Vẽ swimlane.</p><p>${CU_PHAP.swimlane.vi}</p>` },
  yeuCau: [{ en: 'Three lanes (Employee, HR System, Manager), each action in the right lane, two decisions with both branches labelled.', vi: 'Ba lane (Employee, HR System, Manager), mỗi hành động đúng lane, hai rẽ nhánh có đủ nhãn hai nhánh.' }],
  viDu: [{ input: '|Manager|\n:Review leave request;', output: 'the review happens in the Manager lane', explanation: 'Actions sit in the lane of who does them.|||Hành động nằm ở lane của người làm.' }],
  tep: { 'swimlane.js': ['const SWIMLANE = ´\n@startuml\n|Employee|\nstart\n:Submit leave request;\nstop\n@enduml\n´;\n', `const SWIMLANE = ´${GIAI_SW.replace(/\s+$/, '')}\n´;\n`] },
  kiem: kiemSwimlane({
    bien: 'SWIMLANE', banGiaoToiThieu: 3,
    lanes: [{ ten: 'Employee', khop: ['employee|staff'] }, { ten: 'HR System', khop: ['hr|system'] }, { ten: 'Manager', khop: ['manager'] }],
    hd: [
      { ten: 'Submit the request', khop: ['submit'], lane: ['employee|staff'] },
      { ten: 'Check the balance', khop: ['balance|check'], lane: ['hr|system'] },
      { ten: 'Approve / reject', khop: ['approve|review'], lane: ['manager'] },
      { ten: 'Update the balance', khop: ['update'], lane: ['hr|system'] },
    ],
    thuTu: [[{ ten: 'Submit', khop: ['submit'] }, { ten: 'Check balance', khop: ['check|balance'] }], [{ ten: 'Check balance', khop: ['check|balance'] }, { ten: 'Review/approve', khop: ['review|approve'] }]],
  }),
  goiY: ['Ba lane; "Check remaining balance" và "Update leave balance" ở lane HR System.', 'Hai if: số dư đủ không? và duyệt không?'],
  loiHayGap: ['Đặt "Check balance" ở lane Manager.', 'Chỉ vẽ đường duyệt, quên đường bị trả về.'],
  giaiThich: `<p>The system acts in its own lane; the manager decides; two decisions, both branches labelled.</p>${khoiThamChieu('swim', GIAI_SW, 'Swimlane — leave approval')}`,
  thuatNgu: tn('swimlane'),
  khaiNiem: ['swimlane diagram'],
  boYeu: [{ ten: 'hành động sai lane, không nhánh else', tep: { 'swimlane.js': 'const SWIMLANE = `\n@startuml\n|Employee|\nstart\n:Submit leave request;\n|Manager|\n:Check remaining balance;\n:Approve request;\n|HR System|\n:Update leave balance;\nstop\n@enduml\n`;\n' } }],
});

export default moDun({
  slug: 'swr302-4-8-ch12-flow-models',
  ten: '4.8 Behaviour models: swimlane and state-transition diagrams',
  moTaModule: 'Trạng thái hay hoạt động, cơ bản về swimlane (lane là vai trò, điểm bàn giao), tự vẽ máy trạng thái Leave Request có guard và sự kiện thời gian, tự vẽ swimlane duyệt nghỉ phép có hai rẽ nhánh — chấm bằng máy đọc Mermaid/PlantUML.',
  de: [E1, E2, E3, E4],
});
