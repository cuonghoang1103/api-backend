/**
 * SWT301 · DEEP LAB CHƯƠNG 7 — Tự viết lõi một công cụ quản lý lỗi: báo lỗi + chống trùng, vòng đời có phân quyền theo vai trò,
 * priority do lead đặt, lịch sử (audit trail), số liệu (thời gian chu trình, tỉ lệ mở lại). Kiểm ẩn nhiều.
 */
import { doiDau, KHOA, NOP_BAI, preMa } from './_chung.mjs';
import { kiemTuy } from './_de.mjs';

const GIAI = `// Deep Lab 7 — the core of a defect-tracking tool.
const SEVERITIES = ['Critical', 'Major', 'Minor', 'Trivial'];
const PRIORITIES = ['P1', 'P2', 'P3', 'P4'];
const TRANSITIONS = {
  New: { accept: 'Open', reject: 'Rejected' },
  Open: { defer: 'Deferred', repair: 'Fixed' },
  Deferred: { reconsider: 'Open' },
  Fixed: { pass: 'Closed', fail: 'Reopened' },
  Reopened: { repair: 'Fixed' },
  Closed: { reappear: 'Reopened' },
  Rejected: {},
};
const ROLE_OF = { accept: 'lead', reject: 'lead', defer: 'lead', reconsider: 'lead', repair: 'developer', pass: 'tester', fail: 'tester', reappear: 'tester' };
const norm = (s) => String(s).trim().toLowerCase().replace(/\\s+/g, ' ');
const isOpen = (d) => d.status !== 'Closed' && d.status !== 'Rejected';
const r1 = (x) => Math.round(x * 10) / 10;

class DefectTracker {
  constructor(clock) {
    this.clock = clock || (() => 0);
    this.items = [];
    this.next = 1;
  }

  report({ title, component, severity, reporter } = {}) {
    if (!String(title || '').trim() || !String(component || '').trim()) throw new Error('INVALID_REPORT');
    if (!SEVERITIES.includes(severity)) throw new Error('INVALID_SEVERITY');
    const dup = this.items.find((d) => isOpen(d) && d.component === component && norm(d.title) === norm(title));
    if (dup) throw new Error('DUPLICATE ' + dup.id);
    const id = 'D-' + this.next++;
    this.items.push({
      id, title: String(title).trim(), component, severity, priority: null, status: 'New', reopenCount: 0,
      history: [{ event: 'report', from: null, to: 'New', by: reporter, at: this.clock() }],
    });
    return id;
  }

  find(id) {
    const d = this.items.find((x) => x.id === id);
    if (!d) throw new Error('NOT_FOUND');
    return d;
  }

  act(id, event, actor) {
    const d = this.find(id);
    if (!actor || ROLE_OF[event] !== actor.role) throw new Error('FORBIDDEN');
    const to = TRANSITIONS[d.status][event];
    if (!to) throw new Error('INVALID_TRANSITION');
    d.history.push({ event, from: d.status, to, by: actor.name, at: this.clock() });
    if (to === 'Reopened') d.reopenCount++;
    d.status = to;
    return to;
  }

  setPriority(id, priority, actor) {
    const d = this.find(id);
    if (!actor || actor.role !== 'lead') throw new Error('FORBIDDEN');
    if (!PRIORITIES.includes(priority)) throw new Error('INVALID_PRIORITY');
    d.history.push({ event: 'priority', from: d.priority, to: priority, by: actor.name, at: this.clock() });
    d.priority = priority;
    return priority;
  }

  get(id) {
    const d = this.items.find((x) => x.id === id);
    return d ? JSON.parse(JSON.stringify(d)) : null;
  }

  metrics() {
    const byStatus = {};
    const openBySeverity = { Critical: 0, Major: 0, Minor: 0, Trivial: 0 };
    let open = 0, closedN = 0, cycle = 0, nonRejected = 0, reopened = 0;
    for (const d of this.items) {
      byStatus[d.status] = (byStatus[d.status] || 0) + 1;
      if (isOpen(d)) { open++; openBySeverity[d.severity]++; }
      if (d.status === 'Closed') {
        const last = d.history.filter((h) => h.to === 'Closed').pop();
        closedN++;
        cycle += last.at - d.history[0].at;
      }
      if (d.status !== 'Rejected') { nonRejected++; if (d.reopenCount > 0) reopened++; }
    }
    return {
      total: this.items.length,
      open,
      byStatus,
      openBySeverity,
      avgCycleDays: closedN ? r1(cycle / closedN) : null,
      reopenRate: nonRejected ? r1((reopened / nonRejected) * 100) : 0,
    };
  }
}
`;

const DAU = `// Deep Lab 7 — implement the DefectTracker described on the left.
class DefectTracker {
  constructor(clock) {
    this.clock = clock || (() => 0);
  }
  report(defect) { return 'D-1'; }
  act(id, event, actor) { return 'Open'; }
  setPriority(id, priority, actor) { return priority; }
  get(id) { return null; }
  metrics() { return { total: 0, open: 0, byStatus: {}, openBySeverity: { Critical: 0, Major: 0, Minor: 0, Trivial: 0 }, avgCycleDays: null, reopenRate: 0 }; }
}
`;

/* Đoạn dựng chung cho mọi kiểm: đồng hồ giả + ba vai trò. */
const DUNG = "let day = 0; const T = new DefectTracker(() => day); const L = { name: 'Lan', role: 'lead' }, D = { name: 'Duc', role: 'developer' }, Q = { name: 'Quynh', role: 'tester' }; const err = (f) => { try { f(); return null; } catch (e) { return e && e.message; } };";
const k = (en, vi, body, nhom, an) => kiemTuy({ en, vi }, new Function(`${DUNG}\n${body}`), { nhom, ...(an ? { an: true } : {}) });
const BUG = (sev, t, c) => `{ title: ${JSON.stringify(t || 'Booking 500 on LAB02')}, component: ${JSON.stringify(c || 'booking')}, severity: '${sev || 'Major'}', reporter: 'Quynh' }`;

const KIEM = [
  /* f1 — báo lỗi */
  k('f1 — report returns D-1, D-2… and the defect starts New without priority', 'f1 — report trả D-1, D-2… và lỗi bắt đầu ở New, chưa có priority', `const a = T.report(${BUG()}); const b = T.report(${BUG('Minor', 'Typo on login page', 'ui')}); const g = T.get(a); if (a !== 'D-1' || b !== 'D-2') return 'ids must be D-1, D-2 — got ' + a + ', ' + b; if (!g) return 'get(D-1) returned nothing'; return g.status === 'New' && g.priority === null && g.reopenCount === 0 ? 'OK' : 'got ' + JSON.stringify(g);`, 'f1'),
  k('f1 — invalid severity and missing fields are refused', 'f1 — từ chối severity sai và thiếu trường', `const a = err(() => T.report({ title: 'x crash', component: 'booking', severity: 'Blocker', reporter: 'Q' })); const b = err(() => T.report({ title: '  ', component: 'booking', severity: 'Major', reporter: 'Q' })); return a === 'INVALID_SEVERITY' && b === 'INVALID_REPORT' ? 'OK' : 'got ' + a + ' and ' + b;`, 'f1'),
  k('f1 — a duplicate of an open defect is refused with its id', 'f1 — trùng với lỗi đang mở bị từ chối kèm mã', `T.report(${BUG()}); const e = err(() => T.report({ title: '  booking 500   on lab02 ', component: 'booking', severity: 'Critical', reporter: 'An' })); return e === 'DUPLICATE D-1' ? 'OK' : 'expected "DUPLICATE D-1", got ' + e;`, 'f1'),
  k('f1 — same title in another component, or after the first was closed/rejected, is not a duplicate', 'f1 — cùng tiêu đề ở thành phần khác, hoặc khi lỗi cũ đã đóng/từ chối, không phải trùng', `T.report(${BUG()}); const b = T.report(${BUG('Major', 'Booking 500 on LAB02', 'api')}); T.act('D-1', 'reject', L); const c = T.report(${BUG()}); return b === 'D-2' && c === 'D-3' ? 'OK' : 'got ' + b + ', ' + c;`, 'f1', true),
  /* f2 — vòng đời + quyền */
  k('f2 — the happy path New → Open → Fixed → Closed with the right roles', 'f2 — đường chính New → Open → Fixed → Closed với đúng vai trò', `T.report(${BUG()}); const s = [T.act('D-1', 'accept', L), T.act('D-1', 'repair', D), T.act('D-1', 'pass', Q)]; return s.join('>') === 'Open>Fixed>Closed' && T.get('D-1').status === 'Closed' ? 'OK' : 'got ' + s.join('>');`, 'f2'),
  k('f2 — wrong role is FORBIDDEN', 'f2 — sai vai trò bị FORBIDDEN', `T.report(${BUG()}); const a = err(() => T.act('D-1', 'accept', Q)); T.act('D-1', 'accept', L); const b = err(() => T.act('D-1', 'repair', Q)); T.act('D-1', 'repair', D); const c = err(() => T.act('D-1', 'pass', D)); return a === 'FORBIDDEN' && b === 'FORBIDDEN' && c === 'FORBIDDEN' ? 'OK' : 'got ' + [a, b, c].join(', ');`, 'f2'),
  k('f2 — an event not allowed in the state is INVALID_TRANSITION', 'f2 — sự kiện không hợp lệ ở trạng thái là INVALID_TRANSITION', `T.report(${BUG()}); const a = err(() => T.act('D-1', 'repair', D)); const b = err(() => T.act('D-1', 'pass', Q)); return a === 'INVALID_TRANSITION' && b === 'INVALID_TRANSITION' ? 'OK' : 'got ' + a + ', ' + b;`, 'f2'),
  k('f2 — unknown id is NOT_FOUND (checked before the role)', 'f2 — mã lạ là NOT_FOUND (kiểm trước vai trò)', `const a = err(() => T.act('D-9', 'accept', Q)); const b = err(() => T.setPriority('D-9', 'P1', Q)); return a === 'NOT_FOUND' && b === 'NOT_FOUND' ? 'OK' : 'got ' + a + ', ' + b;`, 'f2'),
  k('f2 — fail and reappear reopen the defect and count it', 'f2 — fail và reappear mở lại lỗi và được đếm', `T.report(${BUG()}); T.act('D-1', 'accept', L); T.act('D-1', 'repair', D); T.act('D-1', 'fail', Q); T.act('D-1', 'repair', D); T.act('D-1', 'pass', Q); T.act('D-1', 'reappear', Q); const g = T.get('D-1'); return g.status === 'Reopened' && g.reopenCount === 2 ? 'OK' : 'got status ' + g.status + ', reopenCount ' + g.reopenCount;`, 'f2', true),
  k('f2 — the role is checked before the transition', 'f2 — kiểm vai trò trước khi kiểm chuyển trạng thái', `T.report(${BUG()}); const e = err(() => T.act('D-1', 'pass', D)); return e === 'FORBIDDEN' ? 'OK' : 'a developer passing a New defect must give FORBIDDEN first, got ' + e;`, 'f2', true),
  k('f2 — Rejected is final; Deferred can be reconsidered', 'f2 — Rejected là cuối; Deferred xem lại được', `T.report(${BUG()}); T.report(${BUG('Minor', 'Other', 'ui')}); T.act('D-1', 'reject', L); const a = err(() => T.act('D-1', 'accept', L)); T.act('D-2', 'accept', L); T.act('D-2', 'defer', L); const s = T.act('D-2', 'reconsider', L); return a === 'INVALID_TRANSITION' && s === 'Open' ? 'OK' : 'got ' + a + ', ' + s;`, 'f2', true),
  /* f3 — priority, lịch sử, get */
  k('f3 — only the lead sets a priority P1–P4', 'f3 — chỉ lead đặt priority P1–P4', `T.report(${BUG()}); const a = err(() => T.setPriority('D-1', 'P1', D)); const b = err(() => T.setPriority('D-1', 'P0', L)); const c = T.setPriority('D-1', 'P2', L); return a === 'FORBIDDEN' && b === 'INVALID_PRIORITY' && c === 'P2' && T.get('D-1').priority === 'P2' ? 'OK' : 'got ' + [a, b, c].join(', ');`, 'f3'),
  k('f3 — the history records every change with who and when', 'f3 — lịch sử ghi mọi thay đổi kèm ai và khi nào', `T.report(${BUG()}); day = 2; T.act('D-1', 'accept', L); day = 3; T.setPriority('D-1', 'P1', L); const h = T.get('D-1').history; const w = [{ event: 'report', from: null, to: 'New', by: 'Quynh', at: 0 }, { event: 'accept', from: 'New', to: 'Open', by: 'Lan', at: 2 }, { event: 'priority', from: null, to: 'P1', by: 'Lan', at: 3 }]; return JSON.stringify(h) === JSON.stringify(w) ? 'OK' : 'got ' + JSON.stringify(h);`, 'f3'),
  k('f3 — a refused action leaves no trace', 'f3 — hành động bị từ chối không để lại dấu vết', `T.report(${BUG()}); err(() => T.act('D-1', 'repair', D)); err(() => T.act('D-1', 'accept', Q)); err(() => T.setPriority('D-1', 'P7', L)); const g = T.get('D-1'); return g.history.length === 1 && g.status === 'New' && g.priority === null ? 'OK' : 'refused actions changed the defect: ' + JSON.stringify(g);`, 'f3', true),
  k('f3 — get returns a copy; unknown id gives null', 'f3 — get trả bản sao; mã lạ trả null', `T.report(${BUG()}); const g = T.get('D-1'); g.status = 'Closed'; g.history.push({}); const h = T.get('D-1'); return h.status === 'New' && h.history.length === 1 && T.get('D-7') === null ? 'OK' : 'changing the object returned by get() changed the tracker, or get(unknown) is not null';`, 'f3', true),
  /* f4 — số liệu */
  k('f4 — metrics: total, open, byStatus, openBySeverity', 'f4 — số liệu: tổng, mở, theo trạng thái, theo mức', `T.report(${BUG('Critical')}); T.report(${BUG('Minor', 'Typo', 'ui')}); T.report(${BUG('Major', 'Slow list', 'labs')}); T.act('D-2', 'reject', L); T.act('D-3', 'accept', L); T.act('D-3', 'repair', D); T.act('D-3', 'pass', Q); const m = T.metrics(); return m.total === 3 && m.open === 1 && JSON.stringify(m.byStatus) === JSON.stringify({ New: 1, Rejected: 1, Closed: 1 }) && JSON.stringify(m.openBySeverity) === JSON.stringify({ Critical: 1, Major: 0, Minor: 0, Trivial: 0 }) ? 'OK' : 'got ' + JSON.stringify(m);`, 'f4'),
  k('f4 — avgCycleDays from report to the last closing', 'f4 — avgCycleDays từ lúc báo tới lần đóng cuối', `day = 1; T.report(${BUG()}); day = 2; T.report(${BUG('Minor', 'Typo', 'ui')}); T.act('D-1', 'accept', L); T.act('D-2', 'accept', L); T.act('D-1', 'repair', D); T.act('D-2', 'repair', D); day = 4; T.act('D-1', 'pass', Q); day = 6; T.act('D-2', 'pass', Q); const m = T.metrics(); return m.avgCycleDays === 3.5 ? 'OK' : 'expected (3 + 4) / 2 = 3.5, got ' + m.avgCycleDays;`, 'f4'),
  k('f4 — reopenRate among non-rejected defects', 'f4 — reopenRate trên các lỗi không bị từ chối', `T.report(${BUG()}); T.report(${BUG('Minor', 'Typo', 'ui')}); T.report(${BUG('Trivial', 'Old', 'x')}); T.report(${BUG('Major', 'Q', 'y')}); T.act('D-3', 'reject', L); T.act('D-1', 'accept', L); T.act('D-1', 'repair', D); T.act('D-1', 'fail', Q); const m = T.metrics(); return m.reopenRate === 33.3 ? 'OK' : 'expected 1 of 3 = 33.3, got ' + m.reopenRate;`, 'f4'),
  k('f4 — empty tracker', 'f4 — chưa có lỗi', `const m = T.metrics(); return m.total === 0 && m.open === 0 && m.avgCycleDays === null && m.reopenRate === 0 && JSON.stringify(m.byStatus) === '{}' ? 'OK' : 'got ' + JSON.stringify(m);`, 'f4', true),
  k('f4 — a reappeared-then-closed defect uses its LAST closing', 'f4 — lỗi quay lại rồi đóng dùng lần đóng CUỐI', `T.report(${BUG()}); T.act('D-1', 'accept', L); T.act('D-1', 'repair', D); day = 2; T.act('D-1', 'pass', Q); day = 5; T.act('D-1', 'reappear', Q); T.act('D-1', 'repair', D); day = 9; T.act('D-1', 'pass', Q); const m = T.metrics(); return m.avgCycleDays === 9 && m.reopenRate === 100 ? 'OK' : 'got ' + JSON.stringify(m);`, 'f4', true),
];

const BAN_IN = {
  tieuDe: 'Deep Lab 7 — Build the Core of a Defect-Tracking Tool',
  phu: { en: 'Chapter 7 deep lab · defect lifecycle with role permissions, duplicates, audit trail and metrics · 10 marks', vi: 'Deep Lab chương 7 · vòng đời lỗi có phân quyền, chống trùng, nhật ký và số liệu · 10 điểm' },
  moTa: {
    en: `<p>Jira, Azure DevOps or CT Work enforce the defect lifecycle so that nobody closes a defect that was never repaired and every change is traceable. Build that core as <code>class DefectTracker</code>:</p>
${preMa(`new DefectTracker(clock)            // clock() returns the current day number (default () => 0)
report({ title, component, severity, reporter })  → 'D-1', 'D-2', …
act(id, event, actor)               → the new status          actor = { name, role: 'lead' | 'developer' | 'tester' }
setPriority(id, priority, actor)    → priority ('P1'…'P4')
get(id)                             → a COPY of the defect, or null
metrics()                           → { total, open, byStatus, openBySeverity, avgCycleDays, reopenRate }`)}
<ul>
<li><b>report</b>: severity ∈ Critical · Major · Minor · Trivial (else <code>INVALID_SEVERITY</code>); title and component required (else <code>INVALID_REPORT</code>); if a defect that is neither Closed nor Rejected has the same component and the same title (ignoring case, surrounding spaces and repeated spaces), throw <code>'DUPLICATE ' + its id</code>. A new defect is <code>New</code>, priority <code>null</code>, reopenCount 0, history <code>[{ event: 'report', from: null, to: 'New', by: reporter, at: clock() }]</code>.</li>
<li><b>act</b>: transitions as lesson 7.6 (accept, reject, defer, reconsider, repair, pass, fail, reappear). Roles: <b>lead</b> accept/reject/defer/reconsider, <b>developer</b> repair, <b>tester</b> pass/fail/reappear. Errors, checked in this order: <code>NOT_FOUND</code>, <code>FORBIDDEN</code>, <code>INVALID_TRANSITION</code>. Each success appends <code>{ event, from, to, by: actor.name, at: clock() }</code>; reaching <code>Reopened</code> increments reopenCount.</li>
<li><b>setPriority</b>: <code>NOT_FOUND</code>, then lead only (<code>FORBIDDEN</code>), then P1–P4 (<code>INVALID_PRIORITY</code>); appends <code>{ event: 'priority', from: old, to: new, by, at }</code>.</li>
<li><b>metrics</b>: open = not Closed and not Rejected; byStatus counts only statuses present; openBySeverity has all four keys; avgCycleDays = mean over Closed defects of (time of the LAST transition to Closed − time of report), 1 decimal, null if none; reopenRate = % of non-rejected defects with reopenCount &gt; 0, 1 decimal, 0 if none.</li>
<li>Refused actions must change nothing.</li></ul>`,
    vi: `<p>Jira, Azure DevOps hay CT Work ép vòng đời lỗi để không ai đóng được lỗi chưa từng được sửa và mọi thay đổi đều truy vết được. Dựng lõi đó thành <code>class DefectTracker</code> với API và luật như bản tiếng Anh: báo lỗi kèm kiểm severity và chống trùng (không phân biệt hoa thường, khoảng trắng), chuyển trạng thái theo bài 7.6 với phân quyền theo vai trò (lead/developer/tester) và thứ tự lỗi NOT_FOUND → FORBIDDEN → INVALID_TRANSITION, priority chỉ lead đặt, lịch sử ghi ai/khi nào, get trả bản sao, số liệu (mở, theo trạng thái, theo mức, thời gian chu trình, tỉ lệ mở lại). Hành động bị từ chối không được thay đổi gì.</p>`,
  },
  chucNangChinh: [
    { en: 'f1 Reporting and duplicate detection.', vi: 'f1 Báo lỗi và chống trùng.' },
    { en: 'f2 Lifecycle with role permissions and error order.', vi: 'f2 Vòng đời có phân quyền và thứ tự lỗi.' },
    { en: 'f3 Priority, audit trail, safe copies.', vi: 'f3 Priority, nhật ký, bản sao an toàn.' },
    { en: 'f4 Metrics.', vi: 'f4 Số liệu.' },
  ],
  yeuCauChung: [{ en: 'Hidden checks combine many actions — a refused action must leave the defect exactly as it was.', vi: 'Kiểm ẩn kết hợp nhiều thao tác — hành động bị từ chối phải để lỗi y như cũ.' }],
  cayThuMuc: `src/
└── defect-tracker.js   ← class DefectTracker`,
  moHinh: {
    ten: 'Roles and events',
    truong: [
      ['lead', 'role', { en: 'accept · reject · defer · reconsider · setPriority', vi: 'accept · reject · defer · reconsider · setPriority' }],
      ['developer', 'role', { en: 'repair', vi: 'repair' }],
      ['tester', 'role', { en: 'report · pass · fail · reappear', vi: 'report · pass · fail · reappear' }],
    ],
  },
  chucNang: [
    { ten: { en: 'f1 Reporting', vi: 'f1 Báo lỗi' }, diem: 2, yeuCau: [{ en: 'Ids, validation, duplicates.', vi: 'Mã, kiểm hợp lệ, chống trùng.' }], hook: ['defect report'] },
    { ten: { en: 'f2 Lifecycle', vi: 'f2 Vòng đời' }, diem: 3, yeuCau: [{ en: 'Transitions, roles, errors.', vi: 'Chuyển trạng thái, vai trò, lỗi.' }], hook: ['defect lifecycle'] },
    { ten: { en: 'f3 Priority and history', vi: 'f3 Priority và lịch sử' }, diem: 2, yeuCau: [{ en: 'Lead-only priority, audit trail, copies.', vi: 'Priority chỉ lead, nhật ký, bản sao.' }], hook: ['traceability'] },
    { ten: { en: 'f4 Metrics', vi: 'f4 Số liệu' }, diem: 3, yeuCau: [{ en: 'Open counts, cycle time, reopen rate.', vi: 'Số lỗi mở, thời gian chu trình, tỉ lệ mở lại.' }], hook: ['defect metrics'] },
  ],
  idBatBuoc: [['class DefectTracker', 'src/defect-tracker.js']],
  truDiem: [
    { en: 'Checking the transition before the role — a tester then learns about states she is not allowed to change.', vi: 'Kiểm chuyển trạng thái trước vai trò — tester biết được trạng thái mình không được đổi.' },
    { en: 'Returning the internal object from get() — any caller can then corrupt the audit trail.', vi: 'get() trả đối tượng bên trong — ai cũng có thể làm hỏng nhật ký.' },
  ],
  nopBai: NOP_BAI,
};

export default doiDau({
  slug: 'swt301-7-deep-defect-tracker',
  ten: 'Deep Lab 7 — Build the Core of a Defect-Tracking Tool',
  moTaModule: 'Deep Lab chương 7: class DefectTracker — báo lỗi + chống trùng, vòng đời phân quyền lead/developer/tester, priority, nhật ký ai/khi nào, bản sao an toàn, số liệu (mở, theo mức, thời gian chu trình, tỉ lệ mở lại); nhiều kiểm ẩn.',
  khoa: KHOA,
  baiHoc: 'swt301-bug-lifecycle',
  de: [{
    dangBai: 'deep-lab',
    tieuDe: 'Deep Lab 7 — Build the Core of a Defect-Tracking Tool',
    doKho: 'HARD', phut: 120, diem: 100, ngonNgu: 'javascript',
    viDu: [{ input: "T.report({...}); T.act('D-1', 'accept', lead); T.act('D-1', 'repair', dev); T.act('D-1', 'pass', tester)", output: "'Open' → 'Fixed' → 'Closed'", explanation: 'The happy path, each step by the right role.|||Đường chính, mỗi bước đúng vai trò.' }],
    khaiNiem: ['defect management', 'defect lifecycle', 'test management tools'],
    tienQuyet: ['SWT301 lesson 7.6', 'JavaScript classes'],
    the: ['swt301', 'deep-lab', 'defect-management'],
    banIn: BAN_IN,
    thuatNgu: [{ en: 'audit trail', vi: 'nhật ký thay đổi truy vết được' }, { en: 'permission', vi: 'quyền' }, { en: 'cycle time', vi: 'thời gian chu trình — từ lúc báo tới lúc đóng' }, { en: 'duplicate', vi: 'báo trùng' }],
    goiY: [
      'Bảng TRANSITIONS như bài 7.6 + bảng ROLE_OF[event].',
      'act: tìm lỗi (NOT_FOUND) → kiểm vai trò (FORBIDDEN) → tra bảng (INVALID_TRANSITION) → ghi lịch sử → đổi trạng thái.',
      'get: JSON.parse(JSON.stringify(d)) là bản sao sâu đủ dùng.',
      'avgCycleDays: lần chuyển tới Closed CUỐI CÙNG trừ thời điểm báo.',
    ],
    loiHayGap: ['Ghi lịch sử trước khi kiểm hợp lệ — hành động bị từ chối vẫn để lại dấu.', 'Chống trùng cả với lỗi đã đóng.', 'Tính reopenRate trên cả lỗi bị từ chối.'],
    moTaNgan: 'Deep Lab chương 7: lõi công cụ quản lý lỗi.',
    giaiThich: {
      en: '<p>Two tables (transitions and role per event) plus a strict order of checks make the lifecycle safe; the audit trail and the copies returned by get() make it traceable; metrics come straight from the history.</p>',
      vi: '<p>Hai bảng (chuyển trạng thái và vai trò của từng sự kiện) cộng thứ tự kiểm chặt chẽ làm vòng đời an toàn; nhật ký và bản sao từ get() làm nó truy vết được; số liệu lấy thẳng từ lịch sử.</p>',
    },
    loaiKiem: 'js',
    tests: { loai: 'js', phienBan: 1, tepNap: ['src/defect-tracker.js'], kiem: KIEM },
    khoiDau: { 'src/defect-tracker.js': DAU },
    loiGiai: { 'src/defect-tracker.js': GIAI },
    boYeu: [
      { ten: 'kiểm chuyển trạng thái trước vai trò', tep: { 'src/defect-tracker.js': GIAI.replace("    if (!actor || ROLE_OF[event] !== actor.role) throw new Error('FORBIDDEN');\n    const to = TRANSITIONS[d.status][event];\n    if (!to) throw new Error('INVALID_TRANSITION');", "    const to = TRANSITIONS[d.status][event];\n    if (!to) throw new Error('INVALID_TRANSITION');\n    if (!actor || ROLE_OF[event] !== actor.role) throw new Error('FORBIDDEN');") }, phaiTruot: ['f2 — the role is checked before the transition'] },
      { ten: 'get trả đối tượng gốc', tep: { 'src/defect-tracker.js': GIAI.replace('return d ? JSON.parse(JSON.stringify(d)) : null;', 'return d || null;') }, phaiTruot: ['f3 — get returns a copy'] },
    ],
  }],
});
