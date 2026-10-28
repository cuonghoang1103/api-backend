/**
 * SWR302 · LAB 4C — Behaviour models: QuickFix Campus IT Helpdesk.
 * A. sơ đồ chuyển trạng thái của Ticket (Mermaid) · B. swimlane xử lý ticket (PlantUML activity) ·
 * C. bảng quyết định độ ưu tiên: đủ 2³ = 8 cột trước, rồi rút gọn (LAB L.6 "write eight, then reduce").
 */
import { CU_PHAP, tn, jsLit, kiemTuy, bangHtml } from './_chung.mjs';
import { deLon } from './_lab.mjs';
import { kiemState, kiemSwimlane } from './_kiemmh.mjs';
import { khoiThamChieu } from './_ve.mjs';

const BOI_CANH = {
  en: `<p><b>QuickFix</b> is the IT helpdesk system of the campus. A <b>user</b> (student or staff) submits a ticket describing a problem and its category (network, account, hardware, software). QuickFix computes the ticket's priority with the rule below. A <b>helpdesk agent</b> triages every new ticket: when the agent can solve it directly (for example a password reset) the agent resolves it at once; otherwise the agent assigns it to a <b>technician</b> of the right team. A user can cancel a ticket as long as it has not been assigned.</p>
<p>The technician starts work on an assigned ticket. If information from the user is needed, the technician puts the ticket on hold; when the user replies, work resumes, and if the user does not reply within 3 days the ticket is closed automatically. When the technician has fixed the problem, the ticket is resolved and the user is asked to confirm: confirming closes it, reopening it within 5 days sends it back to the technician, and with no answer after 5 days it is closed automatically.</p>
<p><b>Priority rule (BR-07).</b> A ticket that blocks teaching or an exam <i>and</i> affects more than 10 users is P1. Otherwise, a ticket that affects more than 10 users <i>or</i> blocks teaching or an exam is P2 when no workaround exists and P3 when a workaround exists. A ticket that neither affects more than 10 users nor blocks teaching is P3 without a workaround and P4 with a workaround.</p>`,
  vi: `<p><b>QuickFix</b> là hệ thống helpdesk CNTT của trường. <b>Người dùng</b> (sinh viên hoặc cán bộ) gửi ticket mô tả sự cố và nhóm sự cố (mạng, tài khoản, phần cứng, phần mềm). QuickFix tính độ ưu tiên của ticket theo luật bên dưới. <b>Nhân viên helpdesk (agent)</b> phân loại mọi ticket mới: nếu tự xử lý được (vd đặt lại mật khẩu) thì giải quyết ngay; nếu không thì giao cho <b>kỹ thuật viên</b> của đội phù hợp. Người dùng huỷ được ticket khi nó chưa được giao.</p>
<p>Kỹ thuật viên bắt đầu xử lý ticket được giao. Nếu cần thông tin từ người dùng, kỹ thuật viên chuyển ticket sang tạm giữ; khi người dùng trả lời thì tiếp tục, còn nếu 3 ngày không trả lời thì ticket tự động đóng. Khi sửa xong, ticket ở trạng thái đã giải quyết và người dùng được hỏi xác nhận: xác nhận thì đóng, mở lại trong 5 ngày thì quay về kỹ thuật viên, quá 5 ngày không trả lời thì tự động đóng.</p>
<p><b>Luật ưu tiên (BR-07).</b> Ticket chặn việc dạy hoặc một kỳ thi <i>và</i> ảnh hưởng hơn 10 người là P1. Ngoài ra, ticket ảnh hưởng hơn 10 người <i>hoặc</i> chặn việc dạy/thi là P2 khi không có cách tạm thời (workaround) và P3 khi có. Ticket không ảnh hưởng hơn 10 người và không chặn việc dạy là P3 khi không có workaround và P4 khi có.</p>`,
};

const GIAI_STATE = `
stateDiagram-v2
  [*] --> Submitted : user submits ticket / compute priority
  state "In Progress" as InProgress
  state "On Hold" as OnHold
  Submitted --> Assigned : agent assigns [agent cannot solve it]
  Submitted --> Resolved : agent resolves [agent can solve it]
  Submitted --> Cancelled : user cancels [not yet assigned]
  Assigned --> InProgress : technician starts work
  InProgress --> OnHold : technician requests information
  OnHold --> InProgress : user replies
  OnHold --> Closed : 3 days elapsed [no reply from user]
  InProgress --> Resolved : technician marks fixed / ask user to confirm
  Resolved --> Closed : user confirms
  Resolved --> Closed : 5 days elapsed [no answer from user]
  Resolved --> InProgress : user reopens [within 5 days]
  Closed --> [*]
  Cancelled --> [*]
`;
const GIAI_SWIM = `
@startuml
|User|
start
:Submit ticket with category;
|QuickFix|
:Compute ticket priority;
:Notify helpdesk queue;
|Helpdesk Agent|
:Triage ticket;
if (Agent can solve it directly?) then (yes)
  :Resolve ticket;
else (no)
  :Assign ticket to technician;
  |Technician|
  :Diagnose and fix problem;
  :Mark ticket resolved;
endif
|QuickFix|
:Ask user to confirm resolution;
|User|
if (Problem solved?) then (yes)
  :Confirm resolution;
else (no)
  :Reopen ticket;
endif
stop
@enduml
`;

const TO_HOP = [];
for (const c1 of ['Y', 'N']) for (const c2 of ['Y', 'N']) for (const c3 of ['Y', 'N']) TO_HOP.push([c1, c2, c3]);
const UU_TIEN = (c1, c2, c3) => (c1 === 'Y' && c2 === 'Y' ? 'P1' : c1 === 'Y' || c2 === 'Y' ? (c3 === 'N' ? 'P2' : 'P3') : (c3 === 'N' ? 'P3' : 'P4'));
const GIAI_DT = TO_HOP.map(([c1, c2, c3]) => ({ moreThan10Users: c1, blocksTeaching: c2, workaround: c3, priority: UU_TIEN(c1, c2, c3) }));

const kiemDT = [
  kiemTuy({ en: 'C1 — the full table: all 2³ = 8 combinations, each exactly once, Y/N only', vi: 'C1 — bảng đầy đủ: đủ 2³ = 8 tổ hợp, mỗi tổ hợp đúng một lần, chỉ Y/N' }, function () {
    if (typeof DECISION_TABLE === 'undefined' || !Array.isArray(DECISION_TABLE)) return 'DECISION_TABLE is missing';
    var seen = {};
    for (var i = 0; i < DECISION_TABLE.length; i++) {
      var r = DECISION_TABLE[i] || {};
      var k = [r.moreThan10Users, r.blocksTeaching, r.workaround].map(function (x) { return String(x).toUpperCase(); });
      if (k.some(function (x) { return x !== 'Y' && x !== 'N'; })) return 'rule ' + (i + 1) + ': use only "Y" or "N" in the full table (reduce later, in C2)';
      if (seen[k.join('')]) return 'combination ' + k.join('') + ' appears twice';
      seen[k.join('')] = true;
    }
    return DECISION_TABLE.length === 8 ? 'OK' : 'the full table of 3 conditions has 2^3 = 8 columns, you have ' + DECISION_TABLE.length;
  }, { nhom: 'f5' }),
  ...TO_HOP.map(([c1, c2, c3], i) => kiemTuy({ en: `C1 — action of rule ${c1}${c2}${c3} (users > 10 · blocks teaching · workaround)`, vi: `C1 — hành động của luật ${c1}${c2}${c3}` }, new Function(`
    if (typeof DECISION_TABLE === 'undefined' || !Array.isArray(DECISION_TABLE)) return 'DECISION_TABLE is missing';
    var r = DECISION_TABLE.filter(function (x) { return x && String(x.moreThan10Users).toUpperCase() === '${c1}' && String(x.blocksTeaching).toUpperCase() === '${c2}' && String(x.workaround).toUpperCase() === '${c3}'; })[0];
    if (!r) return 'combination ${c1}${c2}${c3} is missing';
    return String(r.priority).toUpperCase().trim() === '${UU_TIEN(c1, c2, c3)}' ? 'OK' : 'reread BR-07 for this combination';`), { nhom: 'f5', ...(i >= 5 ? { an: true } : {}) })),
  kiemTuy({ en: 'C2 — the reduced table: how many columns remain', vi: 'C2 — bảng rút gọn: còn bao nhiêu cột' }, function () {
    if (typeof REDUCED === 'undefined' || !REDUCED) return 'REDUCED is missing';
    return Number(REDUCED.columns) === 7 ? 'OK' : 'only columns whose actions are equal AND that differ in exactly one condition can merge';
  }, { nhom: 'f6' }),
  kiemTuy({ en: 'C2 — the merged column, written with "-" for the condition that does not matter', vi: 'C2 — cột được gộp, ghi "-" ở điều kiện không quan trọng' }, function () {
    if (typeof REDUCED === 'undefined' || !REDUCED || !REDUCED.merged) return 'REDUCED.merged is missing';
    var m = REDUCED.merged, k = [m.moreThan10Users, m.blocksTeaching, m.workaround].map(function (x) { return String(x).toUpperCase().replace(/[–—]/, '-'); }).join('');
    return k === 'YY-' && String(m.priority).toUpperCase() === 'P1' ? 'OK' : 'which two columns have the same action and differ only in the workaround?';
  }, { nhom: 'f6' }),
];

const KIEM = [
  ...kiemState({
    bien: 'STATE_DIAGRAM', tenDoiTuong: 'the ticket', nhom: { cuPhap: 'f1', thanhPhan: 'f2', chuyen: 'f2' },
    toiThieu: 6, guardToiThieu: 3,
    st: [
      { ten: 'Submitted / New', khop: ['submit|new|open|created|logged'] },
      { ten: 'Assigned', khop: ['assign'] },
      { ten: 'On Hold (waiting for the user)', khop: ['hold|waiting|pending|awaiting'] },
      { ten: 'Resolved', khop: ['resolv|fixed|solved'] },
      { ten: 'Closed', khop: ['clos'] },
      { ten: 'Cancelled', khop: ['cancel'] },
    ],
    ch: [
      { ten: 'cancel only before assignment (guard)', tenVi: 'chỉ huỷ được trước khi giao (guard)', tu: ['submit|new|open|created|logged'], den: ['cancel'], guard: true, lyDo: 'the case allows cancelling only while the ticket is not assigned', lyDoVi: 'đề chỉ cho huỷ khi ticket chưa được giao' },
      { ten: 'the agent resolves directly', tenVi: 'agent giải quyết ngay', tu: ['submit|new|open|created|logged'], den: ['resolv|fixed|solved'] },
      { ten: 'on hold → closed after 3 days without reply', tenVi: 'tạm giữ → đóng sau 3 ngày không trả lời', tu: ['hold|waiting|pending|awaiting'], den: ['clos'], suKien: ['3|three|day|elapse|timeout|no reply'] },
      { ten: 'on hold → back to work when the user replies', tenVi: 'tạm giữ → làm tiếp khi người dùng trả lời', tu: ['hold|waiting|pending|awaiting'], den: ['progress|assign|work'], suKien: ['repl|answer|respond|info'] },
      { ten: 'resolved → reopened within 5 days (guard)', tenVi: 'đã giải quyết → mở lại trong 5 ngày (guard)', tu: ['resolv|fixed|solved'], den: ['progress|reopen|assign|work'], guard: true, lyDo: 'reopening is allowed only within 5 days', lyDoVi: 'chỉ mở lại được trong 5 ngày' },
      { ten: 'resolved → closed automatically after 5 days', tenVi: 'đã giải quyết → tự đóng sau 5 ngày', tu: ['resolv|fixed|solved'], den: ['clos'], suKien: ['5|five|day|elapse|timeout|confirm'] },
    ],
  }),
  ...kiemSwimlane({
    bien: 'SWIMLANE', nhom: { cuPhap: 'f3', thanhPhan: 'f3', hanhDong: 'f4' }, banGiaoToiThieu: 4,
    lanes: [{ ten: 'User', khop: ['user|student|requester'] }, { ten: 'QuickFix (the system)', khop: ['quickfix|system'] }, { ten: 'Helpdesk Agent', khop: ['agent|helpdesk'] }, { ten: 'Technician', khop: ['technician|engineer'] }],
    hd: [
      { ten: 'Submit the ticket', khop: ['submit|create ticket|report'], lane: ['user|student|requester'] },
      { ten: 'Compute the priority', khop: ['priorit'], lane: ['quickfix|system'] },
      { ten: 'Triage the ticket', khop: ['triage|classify|review ticket'], lane: ['agent|helpdesk'] },
      { ten: 'Assign to a technician', khop: ['assign'], lane: ['agent|helpdesk'] },
      { ten: 'Fix the problem', khop: ['fix|diagnose|repair|work on'], lane: ['technician|engineer'] },
      { ten: 'Confirm the resolution', khop: ['^confirm'], lane: ['user|student|requester'] },
    ],
    thuTu: [
      [{ ten: 'Submit ticket', khop: ['submit|create ticket'] }, { ten: 'Compute priority', khop: ['priorit'] }],
      [{ ten: 'Compute priority', khop: ['priorit'] }, { ten: 'Triage', khop: ['triage|classify'] }],
      [{ ten: 'Assign', khop: ['assign'] }, { ten: 'Fix problem', khop: ['fix|diagnose|repair|work on'] }],
      [{ ten: 'Fix problem', khop: ['fix|diagnose|repair|work on'] }, { ten: 'Confirm', khop: ['^confirm'] }],
    ],
  }),
  ...kiemDT,
];

const TEP = {
  'answers/a-ticket-states.js': [
    `// A. State machine of a Ticket (Mermaid stateDiagram-v2).\nconst STATE_DIAGRAM = ´\nstateDiagram-v2\n  [*] --> Submitted\n  Submitted --> Closed : close\n  Closed --> [*]\n´;\n`,
    `// A. Seven states; every time rule is a transition with an event (and a guard where two arrows share a source).\nconst STATE_DIAGRAM = ´${GIAI_STATE.replace(/\s+$/, '')}\n´;\n`,
  ],
  'answers/b-swimlane.js': [
    `// B. Swimlane of ticket handling (PlantUML activity: |Lane| · :action; · if/else/endif).\nconst SWIMLANE = ´\n@startuml\n|User|\nstart\n:Submit ticket;\nstop\n@enduml\n´;\n`,
    `// B. Four lanes = four roles; six hand-offs; two decisions with both branches labelled.\nconst SWIMLANE = ´${GIAI_SWIM.replace(/\s+$/, '')}\n´;\n`,
  ],
  'answers/c-decision-table.js': [
    `// C1. One object per column of the FULL decision table (Y/N only). C2. the reduced table.\nconst DECISION_TABLE = [\n  { moreThan10Users: 'Y', blocksTeaching: 'Y', workaround: 'Y', priority: '' },\n];\nconst REDUCED = { columns: 0, merged: { moreThan10Users: '', blocksTeaching: '', workaround: '', priority: '' } };\n`,
    `// C1. Write all 8 columns first, then fill each action from BR-07.\nconst DECISION_TABLE = ${jsLit(GIAI_DT)};\n// C2. Only YYY and YYN share an action (P1) and differ in one condition ⇒ merge into YY- ⇒ 7 columns.\nconst REDUCED = { columns: 7, merged: { moreThan10Users: 'Y', blocksTeaching: 'Y', workaround: '-', priority: 'P1' } };\n`,
  ],
};

export default deLon({
  slug: 'swr302-4-lab-behaviour-quickfix',
  ten: 'Lab 4C — Behaviour Models: QuickFix IT Helpdesk',
  moTaModule: 'Lab chương 4C: sơ đồ chuyển trạng thái của Ticket (guard, luật thời gian, không trạng thái cụt), swimlane xử lý sự cố theo vai trò có nhánh không thuận, bảng quyết định độ ưu tiên đủ 2³ cột rồi rút gọn.',
  baiHoc: 'swr302-4-8-ch12-flow-models',
  tieuDe: 'Lab 4C — Behaviour Models: QuickFix IT Helpdesk',
  phu: { en: 'Chapter 4 lab · state-transition diagram, swimlane, decision table · 10 marks', vi: 'Lab chương 4 · sơ đồ chuyển trạng thái, swimlane, bảng quyết định · 10 điểm' },
  moTa: BOI_CANH,
  chucNangChinh: [
    { en: 'A. Draw the state-transition diagram of a <b>Ticket</b>.', vi: 'A. Vẽ sơ đồ chuyển trạng thái của <b>Ticket</b>.' },
    { en: 'B. Draw the swimlane of ticket handling, one lane per role.', vi: 'B. Vẽ swimlane xử lý ticket, mỗi vai trò một lane.' },
    { en: 'C. Turn BR-07 into a decision table: the full table, then the reduced one.', vi: 'C. Biến BR-07 thành bảng quyết định: bảng đầy đủ, rồi bảng rút gọn.' },
  ],
  yeuCauChung: [
    { en: 'States are conditions of the ticket; swimlane actions are activities. Do not mix them.', vi: 'Trạng thái là tình trạng của ticket; hành động swimlane là hoạt động. Đừng trộn.' },
    { en: 'Write the 8 columns of the decision table BEFORE reducing it.', vi: 'Viết đủ 8 cột của bảng quyết định TRƯỚC khi rút gọn.' },
  ],
  cayThuMuc: `answers/
├── a-ticket-states.js    ← const STATE_DIAGRAM = ´stateDiagram-v2 …´
├── b-swimlane.js         ← const SWIMLANE = ´@startuml … @enduml´
└── c-decision-table.js   ← const DECISION_TABLE = [ { moreThan10Users, blocksTeaching, workaround, priority } ] · const REDUCED = { columns, merged }`,
  moHinh: {
    ten: 'Answer records',
    truong: [
      ['STATE_DIAGRAM', 'string', CU_PHAP.state],
      ['SWIMLANE', 'string', CU_PHAP.swimlane],
      ['DECISION_TABLE[i]', 'object', { en: 'one column: moreThan10Users, blocksTeaching, workaround ∈ "Y" | "N"; priority ∈ P1…P4', vi: 'một cột: ba điều kiện "Y"/"N"; priority P1…P4' }],
      ['REDUCED', 'object', { en: '{ columns: number of columns after reduction, merged: the merged column with "-" for the condition that does not matter }', vi: '{ columns: số cột sau rút gọn, merged: cột đã gộp, ghi "-" ở điều kiện không quan trọng }' }],
    ],
  },
  chucNang: [
    { ten: { en: 'A1. State machine notation', vi: 'A1. Ký pháp máy trạng thái' }, diem: 1.5, moTa: CU_PHAP.state, yeuCau: [{ en: 'Initial and final states, labelled transitions, every state reachable and with a way out, states named as conditions.', vi: 'Có đầu và cuối, chuyển có nhãn, mọi trạng thái tới được và có lối ra, trạng thái đặt tên là tình trạng.' }], hook: ['state-transition diagram'] },
    { ten: { en: 'A2. States and transitions of the case', vi: 'A2. Trạng thái và chuyển của đề' }, diem: 2.5, yeuCau: [{ en: 'Hold/reply/3-day close; resolve/confirm/reopen within 5 days/auto close; cancel only before assignment.', vi: 'Tạm giữ/trả lời/đóng sau 3 ngày; giải quyết/xác nhận/mở lại trong 5 ngày/tự đóng; chỉ huỷ trước khi giao.' }], hook: ['guard condition', 'temporal event'] },
    { ten: { en: 'B1. Swimlane notation and lanes', vi: 'B1. Ký pháp swimlane và lane' }, diem: 1, moTa: CU_PHAP.swimlane, yeuCau: [{ en: 'Start/stop, one lane per role (user, system, agent, technician), every action in a lane.', vi: 'Start/stop, mỗi vai trò một lane, mọi hành động nằm trong lane.' }], hook: ['swimlane'] },
    { ten: { en: 'B2. Actions, order and decisions', vi: 'B2. Hành động, thứ tự và rẽ nhánh' }, diem: 2, yeuCau: [{ en: 'Each action in the lane of who does it, in the order of the case, with the unhappy path.', vi: 'Mỗi hành động ở lane của người làm, đúng thứ tự đề, có đường không thuận.' }], hook: ['hand-off'] },
    { ten: { en: 'C1. Full decision table', vi: 'C1. Bảng quyết định đầy đủ' }, diem: 2, yeuCau: [{ en: '8 columns, the action of each from BR-07.', vi: '8 cột, hành động của từng cột theo BR-07.' }], hook: ['decision table'] },
    { ten: { en: 'C2. Reduced table', vi: 'C2. Bảng rút gọn' }, diem: 1, yeuCau: [{ en: 'Merge only columns with the same action that differ in one condition.', vi: 'Chỉ gộp các cột cùng hành động và khác nhau đúng một điều kiện.' }], hook: ['"don\'t care" (-)'] },
  ],
  idBatBuoc: [['STATE_DIAGRAM', 'answers/a-ticket-states.js'], ['SWIMLANE', 'answers/b-swimlane.js'], ['DECISION_TABLE · REDUCED', 'answers/c-decision-table.js']],
  truDiem: [
    { en: 'States such as "Fixing" or "Waiting for user to reply" written as activities — use "In Progress", "On Hold".', vi: 'Trạng thái kiểu "Fixing", "Waiting for user to reply" là hoạt động — dùng "In Progress", "On Hold".' },
    { en: 'Two arrows from Resolved on "5 days" and "user reopens" without a guard telling them apart.', vi: 'Hai mũi tên rời Resolved ("5 days" và "user reopens") không có guard phân biệt.' },
    { en: 'A swimlane with departments ("IT Department") instead of roles, or only the happy path.', vi: 'Swimlane theo phòng ban ("IT Department") thay vì vai trò, hoặc chỉ có đường thuận.' },
    { en: 'Reducing the decision table before writing the 8 columns — the case N/N/N is the one people forget.', vi: 'Rút gọn bảng trước khi viết đủ 8 cột — trường hợp N/N/N là cái hay quên.' },
  ],
  goiY: [
    'A: liệt kê mọi câu "khi … thì ticket …" của đề; mỗi câu một mũi tên. Hai mũi tên rời cùng một trạng thái (Submitted, Resolved) cần guard.',
    'B: lane là vai trò (User, QuickFix, Helpdesk Agent, Technician). Hành động đặt ở lane của người làm; QuickFix là lane của các bước hệ thống tự làm.',
    'C: 3 điều kiện ⇒ 8 cột. Đọc BR-07 theo thứ tự: P1 trước, rồi "hơn 10 người HOẶC chặn dạy", rồi phần còn lại.',
  ],
  loiHayGap: [
    'Quên trạng thái Cancelled hoặc cho huỷ từ mọi trạng thái — đề chỉ cho huỷ khi chưa giao.',
    'Đặt "Compute priority" vào lane Helpdesk Agent — hệ thống tự tính.',
    'Gộp cột NYN với YNN vì cùng P2 — chúng khác nhau HAI điều kiện nên không gộp được.',
  ],
  giaiThich: {
    en: `<p><b>Why this answer.</b> Every sentence "when …, the ticket …" is a transition; Submitted and Resolved each have several exits, so guards ([agent can solve it], [not yet assigned], [within 5 days]) tell them apart, and the 3-day and 5-day rules are time events. The swimlane shows who acts: the system computes the priority and asks for confirmation, the agent triages and assigns, the technician fixes — six hand-offs. In the decision table only YYY and YYN have the same action and differ in one condition, so the reduced table has 7 columns with YY- ⇒ P1.</p>${bangHtml(['>10 users', 'Blocks teaching', 'Workaround', 'Priority'], GIAI_DT.map((r) => [r.moreThan10Users, r.blocksTeaching, r.workaround, r.priority]))}${khoiThamChieu('state', GIAI_STATE, 'State machine — Ticket', { __dau: [190, 110], Submitted: [190, 220], Cancelled: [190, 400], Assigned: [420, 220], InProgress: [660, 220], OnHold: [890, 220], Resolved: [420, 420], Closed: [780, 420] })}${khoiThamChieu('swim', GIAI_SWIM, 'Swimlane — ticket handling')}`,
    vi: `<p><b>Vì sao đáp án như vậy.</b> Mỗi câu "khi …, ticket …" là một chuyển trạng thái; Submitted và Resolved có nhiều lối ra nên cần guard ([agent can solve it], [not yet assigned], [within 5 days]) để phân biệt, luật 3 ngày và 5 ngày là sự kiện thời gian. Swimlane cho thấy ai làm: hệ thống tính ưu tiên và hỏi xác nhận, agent phân loại và giao việc, kỹ thuật viên sửa — sáu điểm bàn giao. Trong bảng quyết định chỉ YYY và YYN cùng hành động và khác nhau một điều kiện, nên bảng rút gọn còn 7 cột với YY- ⇒ P1.</p>${bangHtml(['>10 users', 'Blocks teaching', 'Workaround', 'Priority'], GIAI_DT.map((r) => [r.moreThan10Users, r.blocksTeaching, r.workaround, r.priority]))}${khoiThamChieu('state', GIAI_STATE, 'State machine — Ticket', { __dau: [190, 110], Submitted: [190, 220], Cancelled: [190, 400], Assigned: [420, 220], InProgress: [660, 220], OnHold: [890, 220], Resolved: [420, 420], Closed: [780, 420] })}${khoiThamChieu('swim', GIAI_SWIM, 'Swimlane — ticket handling')}`,
  },
  khaiNiem: ['state-transition diagram', 'swimlane diagram', 'decision table', 'guard condition'],
  tienQuyet: ['SWR302 lessons 4.8–4.9 (flow, behavioural and decision models)', 'LAB L.3, L.4, L.6'],
  thuatNgu: [...tn('stateDiagram', 'guard', 'swimlane', 'decisionTable', 'businessRule')],
  moTaNgan: 'Lab chương 4C: QuickFix — state, swimlane, bảng quyết định.',
  phut: 70,
  tep: TEP,
  kiem: KIEM,
  boYeu: [
    { ten: 'state tên hoạt động, không guard, không trạng thái huỷ', tep: { 'answers/a-ticket-states.js': 'const STATE_DIAGRAM = `\nstateDiagram-v2\n  [*] --> Submitted\n  Submitted --> Fixing : assign\n  Fixing --> Resolved : fix\n  Resolved --> Closed : confirm\n  Resolved --> Fixing : reopen\n  Closed --> [*]\n`;\n' }, phaiTruot: ['states are conditions', 'key states of the case', 'at least 3 guarded'] },
    { ten: 'bảng quyết định rút gọn sớm + gộp sai', tep: { 'answers/c-decision-table.js': `const DECISION_TABLE = ${jsLit(GIAI_DT.filter((r) => !(r.moreThan10Users === 'N' && r.blocksTeaching === 'N' && r.workaround === 'N')))};\nconst REDUCED = { columns: 6, merged: { moreThan10Users: '-', blocksTeaching: '-', workaround: 'N', priority: 'P2' } };\n` }, phaiTruot: ['all 2³ = 8 combinations', 'how many columns remain'] },
  ],
});
