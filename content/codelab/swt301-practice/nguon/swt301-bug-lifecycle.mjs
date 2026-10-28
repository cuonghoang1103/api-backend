/**
 * SWT301 · 7.6 — Defect management: defect reports, severity vs priority, the lifecycle, metrics (SWT5 slide 89–101, LO-5.6.1 K3).
 */
import { doiDau, KHOA, hai, giai, lc, svg } from './_chung.mjs';
import { tinhDe, jsDe, kiemTuy } from './_de.mjs';

const SP = ['High severity · High priority', 'High severity · Low priority', 'Low severity · High priority', 'Low severity · Low priority'];
const E1 = tinhDe({
  tieuDe: 'Defects 1 — Severity and priority are different things',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p><b>Severity</b> = impact of the failure on the system and stakeholders (usually set by the tester). <b>Priority</b> = urgency to fix (set by the product owner, project manager or triage board). Rate each LabBook defect.</p>', vi: '<p><b>Severity</b> = tác động của failure lên hệ thống và các bên (thường do tester đặt). <b>Priority</b> = độ khẩn cấp phải sửa (do product owner, quản lý dự án hay hội đồng phân loại đặt). Đánh giá từng lỗi của LabBook.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Defect → severity · priority', 'Lỗi → severity · priority'),
    cot: [{ ma: 'd', ten: 'Defect' }, { ma: 'k', ten: 'Rating', luaChon: SP }],
    hang: [
      'Booking crashes with HTTP 500 for every student, one day before registration week',
      'The hidden “export bookings to XML” feature, not used by anyone yet, crashes the server',
      'The university’s name is misspelled on the login page; the rector will demo the system tomorrow',
      'A tooltip on the admin statistics page has a grammar mistake',
    ].map((d, i) => ({ ma: `r${i}`, o: { d } })),
    dapAn: { 'r0.k': SP[0], 'r1.k': SP[1], 'r2.k': SP[2], 'r3.k': SP[3] },
    giaiThich: giai('The classic mismatch examples of SWT5: a crash in an unused feature is severe but not urgent; a misspelled name on a highly visible page is cosmetic but urgent.', 'Ví dụ lệch kinh điển của SWT5: crash ở tính năng chưa ai dùng thì nặng nhưng không gấp; sai tên trên trang ai cũng thấy thì nhẹ nhưng gấp.'),
  }],
  goiY: ['Severity hỏi “hỏng nặng tới đâu?”; priority hỏi “phải sửa gấp tới đâu?”.', 'Lỗi chữ trên trang demo cho hiệu trưởng: nhẹ nhưng gấp.'],
  loiHayGap: ['Cho rằng severity cao thì priority luôn cao.', 'Cho rằng tester quyết định priority.'],
  giaiThich: '<p>H·H · H·L · L·H · L·L.</p>',
  thuatNgu: [{ en: 'severity', vi: 'mức nghiêm trọng' }, { en: 'priority', vi: 'mức ưu tiên sửa' }, { en: 'triage', vi: 'phân loại, sắp ưu tiên lỗi' }],
  khaiNiem: ['severity vs priority'],
});

const VONG = svg({
  w: 640, h: 230, tieuDe: 'defect lifecycle',
  nut: [
    { id: 'n', x: 70, y: 110, nhan: 'New', hinh: 'tt', rong: 70 },
    { id: 'o', x: 200, y: 110, nhan: 'Open', hinh: 'tt', rong: 70 },
    { id: 'f', x: 330, y: 110, nhan: 'Fixed', hinh: 'tt', rong: 70 },
    { id: 'c', x: 470, y: 110, nhan: 'Closed', hinh: 'tt', rong: 70 },
    { id: 'rj', x: 130, y: 200, nhan: 'Rejected', hinh: 'tt', rong: 80 },
    { id: 'd', x: 200, y: 30, nhan: 'Deferred', hinh: 'tt', rong: 80 },
    { id: 'ro', x: 400, y: 200, nhan: 'Reopened', hinh: 'tt', rong: 85 },
  ],
  canh: [
    { tu: 'n', den: 'o', nhan: 'accepted' }, { tu: 'n', den: 'rj', nhan: 'not a defect' }, { tu: 'o', den: 'd', nhan: 'postponed' }, { tu: 'd', den: 'o', nhan: 'reconsidered', cong: 30 },
    { tu: 'o', den: 'f', nhan: 'repaired' }, { tu: 'f', den: 'c', nhan: 'confirmation passed' }, { tu: 'f', den: 'ro', nhan: 'confirmation failed' }, { tu: 'ro', den: 'f', nhan: 'repaired', cong: 30 }, { tu: 'c', den: 'ro', nhan: 'came back' },
  ],
});
const E2 = jsDe({
  tieuDe: 'Defects 2 — Implement the defect lifecycle as a state machine',
  doKho: 'MEDIUM', phut: 16,
  moTa: { en: `<p>The defect lifecycle of SWT5 (simplified):</p>${VONG}<p>Write <code>apply(state, event)</code> returning the new state, or throwing an <code>Error</code> whose message is <code>'INVALID'</code> when the event is not allowed in that state. Events: <code>accept</code> (New→Open), <code>reject</code> (New→Rejected), <code>defer</code> (Open→Deferred), <code>reconsider</code> (Deferred→Open), <code>repair</code> (Open→Fixed, Reopened→Fixed), <code>pass</code> (Fixed→Closed), <code>fail</code> (Fixed→Reopened), <code>reappear</code> (Closed→Reopened). Then write <code>history(events)</code> that starts at <code>New</code>, applies the events in order and returns the list of states visited (including <code>New</code>), or <code>null</code> as soon as one event is invalid.</p>`, vi: `<p>Vòng đời lỗi của SWT5 (rút gọn) như sơ đồ. Viết <code>apply(state, event)</code> trả trạng thái mới, hoặc ném <code>Error</code> có message <code>'INVALID'</code> khi sự kiện không được phép ở trạng thái đó (danh sách sự kiện như bản tiếng Anh). Rồi viết <code>history(events)</code> bắt đầu từ <code>New</code>, áp các sự kiện theo thứ tự, trả danh sách trạng thái đã đi qua (kể cả <code>New</code>), hoặc <code>null</code> ngay khi gặp một sự kiện không hợp lệ.</p>` },
  yeuCau: [{ en: 'Rejected is a final state: no event is allowed after it.', vi: 'Rejected là trạng thái cuối: không sự kiện nào được phép sau nó.' }],
  viDu: [{ input: "history(['accept', 'repair', 'fail', 'repair', 'pass'])", output: "['New','Open','Fixed','Reopened','Fixed','Closed']", explanation: 'A fix that failed confirmation once.|||Một bản sửa trượt confirmation một lần.' }],
  goiY: ['Bảng chuyển: { New: { accept: "Open", reject: "Rejected" }, Open: { … }, … }.', 'history: try/catch quanh apply, gặp lỗi thì trả null.'],
  loiHayGap: ['Cho phép pass từ Open (chưa sửa đã đóng).', 'Quên Closed → Reopened khi lỗi quay lại.'],
  giaiThich: '<p>A defect-tracking tool enforces exactly this table — which is why a tester cannot close a defect that was never repaired, and why “reopened” counts are a useful quality metric.</p>',
  thuatNgu: [{ en: 'defect lifecycle', vi: 'vòng đời lỗi' }, { en: 'reopened', vi: 'mở lại — bản sửa không đạt hoặc lỗi quay lại' }, { en: 'deferred', vi: 'tạm hoãn' }],
  khaiNiem: ['defect lifecycle'],
  tep: {
    'lifecycle.js': [
      "function apply(state, event) {\n  if (state === 'New' && event === 'accept') return 'Open';\n  throw new Error('INVALID');\n}\n\nfunction history(events) {\n  return ['New'];\n}\n",
      `const T = {
  New: { accept: 'Open', reject: 'Rejected' },
  Open: { defer: 'Deferred', repair: 'Fixed' },
  Deferred: { reconsider: 'Open' },
  Fixed: { pass: 'Closed', fail: 'Reopened' },
  Reopened: { repair: 'Fixed' },
  Closed: { reappear: 'Reopened' },
  Rejected: {},
};

function apply(state, event) {
  const next = T[state] && T[state][event];
  if (!next) throw new Error('INVALID');
  return next;
}

function history(events) {
  const out = ['New'];
  let s = 'New';
  for (const e of events) {
    try { s = apply(s, e); } catch (err) { return null; }
    out.push(s);
  }
  return out;
}
`,
    ],
  },
  kiem: [
    kiemTuy({ en: 'history — the example', vi: 'history — ví dụ' }, () => { const r = history(['accept', 'repair', 'fail', 'repair', 'pass']); return JSON.stringify(r) === '["New","Open","Fixed","Reopened","Fixed","Closed"]' ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'apply — every valid transition', vi: 'apply — mọi chuyển hợp lệ' }, () => { const c = [['New', 'accept', 'Open'], ['New', 'reject', 'Rejected'], ['Open', 'defer', 'Deferred'], ['Deferred', 'reconsider', 'Open'], ['Open', 'repair', 'Fixed'], ['Fixed', 'pass', 'Closed'], ['Fixed', 'fail', 'Reopened'], ['Reopened', 'repair', 'Fixed'], ['Closed', 'reappear', 'Reopened']]; for (const [s, e, w] of c) { let g; try { g = apply(s, e); } catch (x) { g = 'threw'; } if (g !== w) return s + ' -' + e + '-> expected ' + w + ', got ' + g; } return 'OK'; }),
    kiemTuy({ en: 'apply — invalid transitions throw INVALID', vi: 'apply — chuyển không hợp lệ ném INVALID' }, () => { const c = [['Open', 'pass'], ['New', 'repair'], ['Rejected', 'accept'], ['Closed', 'repair'], ['Deferred', 'repair']]; for (const [s, e] of c) { try { apply(s, e); return s + ' -' + e + '-> should throw'; } catch (x) { if (x.message !== 'INVALID') return 'message must be INVALID'; } } return 'OK'; }),
    kiemTuy({ en: 'history — an invalid event gives null', vi: 'history — sự kiện không hợp lệ trả null' }, () => (history(['accept', 'pass']) === null && history(['reject', 'accept']) === null ? 'OK' : 'expected null for both')),
    kiemTuy({ en: 'history — deferred then reconsidered, closed then reappeared', vi: 'history — hoãn rồi xem lại, đóng rồi quay lại' }, () => { const r = history(['accept', 'defer', 'reconsider', 'repair', 'pass', 'reappear']); return JSON.stringify(r) === '["New","Open","Deferred","Open","Fixed","Closed","Reopened"]' ? 'OK' : 'got ' + JSON.stringify(r); }, { an: true }),
    kiemTuy({ en: 'history — no events', vi: 'history — không có sự kiện' }, () => (JSON.stringify(history([])) === '["New"]' ? 'OK' : 'expected ["New"]'), { an: true }),
  ],
});

const E3 = jsDe({
  tieuDe: 'Defects 3 — Write a complete defect report (K3)',
  doKho: 'MEDIUM', phut: 15,
  moTa: { en: `<p>LO-5.6.1 (K3): write a defect report. During system testing of LabBook <b>2.1.3</b> (Chrome 130, test server <i>stg-2</i>, seed data D7), test case <b>ST-22</b> did this: as <i>student2</i> book LAB02 on 2026-11-04 at 09:00 for 1 hour while <i>student1</i> already holds the only seat → the booking is PENDING (correct). Then <i>student1</i> cancels her booking. Expected: student2’s booking becomes CONFIRMED and she receives “Booking confirmed”. Actual: the booking stays PENDING; no e-mail. Reproduced 3 of 3 times.</p>
<p>Write <code>REPORT</code> with the components of slide 93: <code>id, title, date, author, testItem, version, environment, phase, steps, expected, actual, severity, priority, status, references</code>.</p>`, vi: `<p>LO-5.6.1 (K3): viết defect report. Khi system test LabBook <b>2.1.3</b> (Chrome 130, máy test <i>stg-2</i>, dữ liệu D7), test case <b>ST-22</b>: <i>student2</i> đặt LAB02 ngày 2026-11-04 lúc 09:00 trong 1 giờ trong khi <i>student1</i> đang giữ chỗ duy nhất → booking PENDING (đúng). Rồi <i>student1</i> huỷ. Mong đợi: booking của student2 thành CONFIRMED và nhận thư “Booking confirmed”. Thực tế: vẫn PENDING; không có thư. Tái hiện 3/3. Viết <code>REPORT</code> đủ các thành phần của slide 93.</p>` },
  yeuCau: [
    { en: '<code>version</code> = "2.1.3"; <code>environment</code> mentions Chrome and stg-2; <code>phase</code> = "System testing"; <code>references</code> includes "ST-22".', vi: '<code>version</code> = "2.1.3"; <code>environment</code> có Chrome và stg-2; <code>phase</code> = "System testing"; <code>references</code> có "ST-22".' },
    { en: 'At least 3 steps; expected mentions CONFIRMED; actual mentions PENDING; severity and priority are each one of Critical, High, Medium, Low; status = "New".', vi: 'Ít nhất 3 bước; expected có CONFIRMED; actual có PENDING; severity và priority mỗi cái là Critical, High, Medium, Low; status = "New".' },
  ],
  viDu: [{ input: 'title', output: '"Waitlisted booking is not promoted after the confirmed booking is cancelled (LAB02)"', explanation: 'What fails + when.|||Cái gì hỏng + khi nào.' }],
  goiY: ['Thiếu phiên bản thì developer không biết build nào hỏng (nối với CM).', 'Tham chiếu test case để confirmation testing chạy lại đúng ca.'],
  loiHayGap: ['Bỏ trống phase hoặc references.', 'Gộp expected và actual vào một câu.'],
  giaiThich: '<p>Identifier, title, date, author, test item + version, environment, phase, steps, expected vs actual, severity, priority, state, references — exactly the eleven components of slide 93 (conclusions and change history are added later by the workflow).</p>',
  thuatNgu: [{ en: 'defect report', vi: 'báo cáo lỗi' }, { en: 'steps to reproduce', vi: 'các bước tái hiện' }],
  khaiNiem: ['defect report'],
  tep: {
    'report.js': [
      "const REPORT = {\n  id: 'DEF-',\n  title: '',\n  date: '2026-11-04',\n  author: '',\n  testItem: 'LabBook',\n  version: '',\n  environment: '',\n  phase: '',\n  steps: [],\n  expected: '',\n  actual: '',\n  severity: '',\n  priority: '',\n  status: '',\n  references: [],\n};\n",
      "const REPORT = {\n  id: 'DEF-57',\n  title: 'Waitlisted booking is not promoted after the confirmed booking is cancelled (LAB02)',\n  date: '2026-11-04',\n  author: 'Tester A, LabBook test team',\n  testItem: 'LabBook booking service',\n  version: '2.1.3',\n  environment: 'Chrome 130, test server stg-2, seed data D7',\n  phase: 'System testing',\n  steps: [\n    'As student1 book LAB02 on 2026-11-04 at 09:00 for 1 hour (CONFIRMED)',\n    'As student2 book LAB02 on 2026-11-04 at 09:00 for 1 hour (PENDING)',\n    'As student1 cancel the booking',\n    'As student2 open My bookings and check the mailbox',\n  ],\n  expected: 'student2 booking becomes CONFIRMED and the e-mail Booking confirmed is sent',\n  actual: 'student2 booking stays PENDING; no e-mail is sent (3 of 3 runs)',\n  severity: 'High',\n  priority: 'High',\n  status: 'New',\n  references: ['ST-22', 'US5 AC5.2'],\n};\n",
    ],
  },
  kiem: [
    kiemTuy({ en: 'identification: id, title, date, author', vi: 'định danh: id, title, date, author' }, () => (REPORT.id && /\d/.test(REPORT.id) && String(REPORT.title).length >= 15 && /^\d{4}-\d{2}-\d{2}$/.test(REPORT.date) && String(REPORT.author).trim() ? 'OK' : 'id (with a number), a real title, an ISO date and the author are required')),
    kiemTuy({ en: 'test item, version and environment', vi: 'hạng mục test, phiên bản và môi trường' }, () => (String(REPORT.testItem).trim() && REPORT.version === '2.1.3' && /chrome/i.test(REPORT.environment) && /stg-2/i.test(REPORT.environment) ? 'OK' : 'version must be "2.1.3" and the environment must name Chrome and stg-2')),
    kiemTuy({ en: 'phase and references', vi: 'giai đoạn và tham chiếu' }, () => (/^system testing$/i.test(String(REPORT.phase).trim()) && Array.isArray(REPORT.references) && REPORT.references.includes('ST-22') ? 'OK' : 'phase "System testing" and a reference to ST-22 are required')),
    kiemTuy({ en: 'steps, expected and actual', vi: 'các bước, mong đợi và thực tế' }, () => (Array.isArray(REPORT.steps) && REPORT.steps.length >= 3 && /confirmed/i.test(REPORT.expected) && /pending/i.test(REPORT.actual) && REPORT.expected !== REPORT.actual ? 'OK' : '≥ 3 steps; expected mentions CONFIRMED, actual mentions PENDING')),
    kiemTuy({ en: 'severity, priority and status', vi: 'severity, priority và trạng thái' }, () => { const L = ['Critical', 'High', 'Medium', 'Low']; return L.includes(REPORT.severity) && L.includes(REPORT.priority) && REPORT.status === 'New' ? 'OK' : 'severity and priority must be Critical, High, Medium or Low; status "New"'; }),
  ],
});

const E4 = jsDe({
  tieuDe: 'Defects 4 — Defect metrics for the retrospective',
  doKho: 'MEDIUM', phut: 14,
  moTa: { en: `<p>Slide 95 uses defect data to answer management questions. Write <code>defectStats(defects)</code> where each defect is <code>{ id, status, severity, opened, closed, reopenCount }</code> (<code>opened</code>/<code>closed</code> are day numbers; <code>closed</code> is null if not closed). Return:</p>
<ul><li><code>byStatus</code> — object counting each status;</li>
<li><code>openCount</code> — defects whose status is not Closed and not Rejected;</li>
<li><code>avgDaysToClose</code> — mean of closed − opened over Closed defects (1 decimal; null if none);</li>
<li><code>reopenRate</code> — % of defects with reopenCount &gt; 0 among all non-Rejected defects (1 decimal; 0 if none);</li>
<li><code>rejectRate</code> — % Rejected among all defects (1 decimal) — a high value suggests poor reports or unclear requirements.</li></ul>`, vi: `<p>Slide 95 dùng dữ liệu lỗi để trả lời câu hỏi quản lý. Viết <code>defectStats(defects)</code> trả các số như bản tiếng Anh: đếm theo trạng thái, số lỗi còn mở, số ngày trung bình để đóng, tỉ lệ mở lại và tỉ lệ bị từ chối.</p>` },
  yeuCau: [{ en: 'Round with <code>Math.round(x * 10) / 10</code>.', vi: 'Làm tròn bằng <code>Math.round(x * 10) / 10</code>.' }],
  viDu: [{ input: "defectStats([{id:'D1',status:'Closed',severity:'High',opened:1,closed:4,reopenCount:1},{id:'D2',status:'Open',severity:'Low',opened:2,closed:null,reopenCount:0},{id:'D3',status:'Rejected',severity:'Low',opened:3,closed:null,reopenCount:0},{id:'D4',status:'Closed',severity:'Medium',opened:2,closed:4,reopenCount:0}])", output: "{ byStatus: { Closed: 2, Open: 1, Rejected: 1 }, openCount: 1, avgDaysToClose: 2.5, reopenRate: 33.3, rejectRate: 25 }", explanation: '(3 + 2) ÷ 2 = 2.5 days; 1 of 3 non-rejected reopened.|||(3 + 2) ÷ 2 = 2,5 ngày; 1 trên 3 lỗi không bị từ chối từng mở lại.' }],
  goiY: ['Một vòng lặp gom mọi bộ đếm.', 'Rejected không tính vào mẫu số của reopenRate.'],
  loiHayGap: ['Tính avgDaysToClose cả với lỗi chưa đóng.', 'Đếm Fixed là đã đóng.'],
  giaiThich: '<p>Reopen rate tells how good the fixes and confirmation tests are; reject rate tells how good the reports and the requirements are; time-to-close tells how fast the team reacts.</p>',
  thuatNgu: [{ en: 'reopen rate', vi: 'tỉ lệ mở lại' }, { en: 'reject rate', vi: 'tỉ lệ bị từ chối' }],
  khaiNiem: ['defect metrics'],
  tep: {
    'stats.js': [
      'function defectStats(defects) {\n  return { byStatus: {}, openCount: 0, avgDaysToClose: null, reopenRate: 0, rejectRate: 0 };\n}\n',
      `function defectStats(defects) {
  const r1 = (x) => Math.round(x * 10) / 10;
  const byStatus = {};
  let openCount = 0, closedN = 0, closedDays = 0, nonRejected = 0, reopened = 0, rejected = 0;
  for (const d of defects) {
    byStatus[d.status] = (byStatus[d.status] || 0) + 1;
    if (d.status !== 'Closed' && d.status !== 'Rejected') openCount++;
    if (d.status === 'Closed') { closedN++; closedDays += d.closed - d.opened; }
    if (d.status === 'Rejected') rejected++;
    else { nonRejected++; if (d.reopenCount > 0) reopened++; }
  }
  return {
    byStatus,
    openCount,
    avgDaysToClose: closedN ? r1(closedDays / closedN) : null,
    reopenRate: nonRejected ? r1((reopened / nonRejected) * 100) : 0,
    rejectRate: defects.length ? r1((rejected / defects.length) * 100) : 0,
  };
}
`,
    ],
  },
  kiem: [
    kiemTuy({ en: 'the example', vi: 'ví dụ' }, () => { const r = defectStats([{ id: 'D1', status: 'Closed', severity: 'High', opened: 1, closed: 4, reopenCount: 1 }, { id: 'D2', status: 'Open', severity: 'Low', opened: 2, closed: null, reopenCount: 0 }, { id: 'D3', status: 'Rejected', severity: 'Low', opened: 3, closed: null, reopenCount: 0 }, { id: 'D4', status: 'Closed', severity: 'Medium', opened: 2, closed: 4, reopenCount: 0 }]); return JSON.stringify(r) === '{"byStatus":{"Closed":2,"Open":1,"Rejected":1},"openCount":1,"avgDaysToClose":2.5,"reopenRate":33.3,"rejectRate":25}' ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'Fixed and Reopened still count as open', vi: 'Fixed và Reopened vẫn tính là mở' }, () => { const r = defectStats([{ id: 'a', status: 'Fixed', opened: 1, closed: null, reopenCount: 0 }, { id: 'b', status: 'Reopened', opened: 1, closed: null, reopenCount: 2 }, { id: 'c', status: 'Deferred', opened: 1, closed: null, reopenCount: 0 }]); return r.openCount === 3 && r.avgDaysToClose === null && r.reopenRate === 33.3 ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'empty list', vi: 'danh sách rỗng' }, () => { const r = defectStats([]); return JSON.stringify(r) === '{"byStatus":{},"openCount":0,"avgDaysToClose":null,"reopenRate":0,"rejectRate":0}' ? 'OK' : 'got ' + JSON.stringify(r); }, { an: true }),
    kiemTuy({ en: 'all rejected', vi: 'tất cả bị từ chối' }, () => { const r = defectStats([{ id: 'a', status: 'Rejected', opened: 1, closed: null, reopenCount: 0 }]); return r.reopenRate === 0 && r.rejectRate === 100 ? 'OK' : 'got ' + JSON.stringify(r); }, { an: true }),
  ],
});

const E5 = tinhDe({
  tieuDe: 'Defects 5 — Exam questions on defect management',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Six FE-style questions on SWT5 slides 89–101: the objectives of a defect report, false positives, what a report needs to be useful, and how defect data is used.</p>', vi: '<p>Sáu câu kiểu FE về slide SWT5 89–101: mục tiêu của defect report, dương tính giả, báo cáo cần gì để hữu ích và dữ liệu lỗi được dùng thế nào.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('Which is NOT an objective of a defect report?', 'Đâu KHÔNG phải mục tiêu của defect report?'), luaChon: lc(['a', 'Provide developers with information to identify, isolate and correct the defect'], ['b', 'Provide test managers a means of tracking the quality of the work product and the impact on testing'], ['c', 'Provide ideas for development and test process improvement'], ['d', 'Measure the productivity of individual developers']), dapAn: ['d'], giaiThich: giai('The first three are the syllabus objectives.', 'Ba ý đầu là mục tiêu theo syllabus.') },
    { ma: 'q2', de: hai('A test reported a failure, but the test data was wrong. In defect management this is…', 'Test báo failure nhưng dữ liệu test sai. Trong quản lý lỗi đây là…'), luaChon: lc(['a', 'a true defect'], ['b', 'a false positive, which should also be tracked (e.g. as rejected) because it costs effort'], ['c', 'a regression'], ['d', 'a deferred defect']), dapAn: ['b'], giaiThich: giai('False positives are part of the anomaly flow.', 'Dương tính giả cũng là một phần của luồng xử lý bất thường.') },
    { ma: 'q3', de: hai('Who usually decides the priority of a defect?', 'Ai thường quyết định priority của lỗi?'), luaChon: lc(['a', 'The tester alone'], ['b', 'The product owner, project manager or a triage board, from a business view'], ['c', 'The developer who caused it'], ['d', 'The tool']), dapAn: ['b'], giaiThich: giai('Severity is technical, priority is business.', 'Severity là kỹ thuật, priority là nghiệp vụ.') },
    { ma: 'q4', de: hai('Defects found per week rise, peak and fall towards zero. What must you check before saying the product is good?', 'Lỗi tìm được mỗi tuần tăng, đạt đỉnh rồi giảm về 0. Phải kiểm gì trước khi nói sản phẩm tốt?'), luaChon: lc(['a', 'Nothing'], ['b', 'Whether the tests are still finding new kinds of defects or the suite is worn out (pesticide paradox)'], ['c', 'The number of testers'], ['d', 'The release date']), dapAn: ['b'], giaiThich: giai('Slide 95, top-left corner.', 'Slide 95, góc trên bên trái.') },
    { ma: 'q5', de: hai('Which detail makes a defect report reproducible?', 'Chi tiết nào làm defect report tái hiện được?'), luaChon: lc(['a', 'The tester’s opinion of the developer'], ['b', 'Steps from a known state, test data, environment and the exact build'], ['c', 'A long title'], ['d', 'The priority']), dapAn: ['b'], giaiThich: giai('Plus logs, screenshots, database dumps.', 'Cộng log, ảnh chụp, dump CSDL.') },
    { ma: 'q6', de: hai('Defects can be reported during…', 'Lỗi có thể được báo trong…'), luaChon: lc(['a', 'dynamic testing only'], ['b', 'coding, static analysis, reviews, dynamic testing and use of the product'], ['c', 'acceptance testing only'], ['d', 'production only']), dapAn: ['b'], giaiThich: giai('Any work product, any activity.', 'Mọi sản phẩm, mọi hoạt động.') },
  ],
  goiY: ['Defect report phục vụ developer, quản lý và cải tiến quy trình — không phải chấm điểm cá nhân.', 'Đường cong lỗi giảm có thể do bộ test mòn.'],
  loiHayGap: ['Chọn “tester quyết định priority”.', 'Cho rằng dương tính giả không cần ghi nhận.'],
  giaiThich: '<p>Answers: d · b · b · b · b · b.</p>',
  thuatNgu: [{ en: 'anomaly', vi: 'bất thường — kết quả khác mong đợi' }, { en: 'false positive', vi: 'dương tính giả' }],
  khaiNiem: ['defect management'],
});

export default doiDau({
  slug: 'swt301-bug-lifecycle',
  ten: '7.6 Defect management: reports, severity vs priority, lifecycle',
  moTaModule: 'Severity khác priority, viết code máy trạng thái vòng đời lỗi, viết defect report đủ thành phần (K3), tính số liệu lỗi (thời gian đóng, tỉ lệ mở lại, tỉ lệ từ chối), câu thi.',
  khoa: KHOA,
  baiHoc: 'swt301-bug-lifecycle',
  de: [E1, E2, E3, E4, E5],
});
