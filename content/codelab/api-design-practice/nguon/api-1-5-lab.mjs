/** API Design · Lab 1 — Báo hỏng thiết bị: dựng lại hai endpoint của lab thành hàm thuần (thứ tự kiểm 401 → 404 → 400 → 201; 401 → 403 → 404 → 409 → 200). */
import { doiDau, KHOA, cs, bang1, tn, jsBai, nguon, goi } from './_api.mjs';

/* ── 1. Thiết kế ── */
const EP = ['POST /devices/{deviceId}/issues', 'GET /devices/{deviceId}/issues', 'GET /issues/{issueId}', 'POST /issues/{issueId}/resolve'];
const MA = ['200', '201', '400', '401', '403', '404', '405', '409'];
const B1 = cs({
  ten: 'Lab 1.1 — The issue-report contract', kho: 'EASY', phut: 10, loai: 'table',
  en: 'Lab 1 adds device issue reports to LabFlow. Each row is a request from the real lab run (tokens: tok_an = student An, tok_lan = lab manager Lan). Choose the endpoint and the status it returned.',
  vi: 'Lab 1 thêm báo hỏng thiết bị vào LabFlow. Mỗi dòng là một request trong lượt chạy thật của lab (token: tok_an = sinh viên An, tok_lan = quản lý phòng Lan). Chọn endpoint và mã trạng thái nó trả về.',
  bang: [bang1('b1', ['Request → endpoint → status', 'Request → endpoint → mã'], [{ ma: 'x', ten: 'Request' }, { ma: 'e', ten: 'Endpoint', luaChon: EP }, { ma: 'c', ten: 'Status', luaChon: MA }], [
    { o: { x: 'An reports “Cổng console không lên đèn”, severity HIGH, on dev_1' }, a: { e: EP[0], c: '201' } },
    { o: { x: 'An reports on dev_1 with body {"severity": "URGENT"}' }, a: { e: EP[0], c: '400' } },
    { o: { x: 'An reports on dev_9' }, a: { e: EP[0], c: '404' } },
    { o: { x: 'Anyone lists the reports of dev_1' }, a: { e: EP[1], c: '200' } },
    { o: { x: 'An (a student) tries to resolve iss_1' }, a: { e: EP[3], c: '403' } },
    { o: { x: 'Lan resolves iss_1' }, a: { e: EP[3], c: '200' } },
    { o: { x: 'Lan resolves iss_1 a second time' }, a: { e: EP[3], c: '409' } },
  ], ['The collection lives under the device (reports are about one device); each report also has its own top-level address /issues/{id}, so the Location header of the 201 points there. “Resolve” has rules (manager only, not twice) ⇒ an action resource, like cancel.', 'Bộ sưu tập nằm dưới thiết bị (báo hỏng là về một thiết bị); mỗi báo hỏng cũng có địa chỉ riêng ở gốc /issues/{id}, nên header Location của 201 trỏ về đó. "Resolve" có luật (chỉ quản lý, không hai lần) ⇒ một tài nguyên hành động, giống cancel.'])],
  goiY: [['A new report is created in the collection of its device.', 'Báo hỏng mới được tạo trong bộ sưu tập của thiết bị.'], ['Resolving twice is valid in general but not in the current state.', 'Resolve hai lần hợp lệ nói chung nhưng không ở trạng thái hiện tại.']],
  loi: [['PATCH /issues/{id} {"status": "RESOLVED"} — lets anyone set any status.', 'PATCH /issues/{id} {"status": "RESOLVED"} — cho ai cũng đặt được status bất kỳ.'], ['403 for a device that does not exist.', '403 cho thiết bị không tồn tại.']],
  tns: [tn('issue report', 'báo hỏng'), tn('severity', 'mức độ nghiêm trọng')],
  kn: ['resource design'],
});

/* ── 2. Tự viết: reportIssue ── */
function reportIssue(db, req) {
  if (!req.userId) return { status: 401, body: { error: 'UNAUTHENTICATED' } };
  var device = db.devices.find(function (d) { return d.id === req.deviceId; });
  if (!device) return { status: 404, body: { error: 'DEVICE_NOT_FOUND' } };
  var SEVERITIES = ['LOW', 'MEDIUM', 'HIGH'];
  var b = req.body || {};
  var details = [];
  if (typeof b.title !== 'string' || !b.title.trim()) details.push({ field: 'title', issue: 'required' });
  if (SEVERITIES.indexOf(b.severity) < 0) details.push({ field: 'severity', issue: 'one of LOW, MEDIUM, HIGH' });
  if (details.length) return { status: 400, body: { error: 'VALIDATION_FAILED', details: details } };
  var issue = {
    id: 'iss_' + (db.issues.length + 1), deviceId: device.id, reportedBy: req.userId,
    title: b.title.trim(), severity: b.severity, status: 'OPEN', createdAt: req.now,
  };
  return {
    status: 201,
    location: '/issues/' + issue.id,
    body: issue,
    deviceStatus: b.severity === 'HIGH' ? 'MAINTENANCE' : device.status,   // a HIGH report locks the device
  };
}
const DB = {
  devices: [
    { id: 'dev_1', labId: 'lab_1', name: 'Cisco Router 2901', type: 'ROUTER', serialNo: 'FTX1840ALBQ', status: 'AVAILABLE' },
    { id: 'dev_2', labId: 'lab_1', name: 'Cisco Switch 2960', type: 'SWITCH', serialNo: 'FOC1932X0K7', status: 'AVAILABLE' },
  ],
  issues: [],
};
const NOW = '2026-10-31T15:45:00.120Z';
const B2 = jsBai({
  ten: 'Lab 1.2 — Write reportIssue(db, req): POST /devices/{id}/issues', kho: 'MEDIUM', phut: 20, dangBai: 'lab',
  en: `<p>Re-create the lab’s <code>POST /devices/{deviceId}/issues</code> as a pure function. <code>req = { userId, deviceId, body, now }</code> (<code>userId</code> is null when the token is missing or wrong). Checks in the order the real router runs them:</p><ol>
<li>No <code>userId</code> ⇒ <code>{ status: 401, body: { error: 'UNAUTHENTICATED' } }</code></li>
<li>No such device ⇒ <code>{ status: 404, body: { error: 'DEVICE_NOT_FOUND' } }</code></li>
<li>Body errors, ALL of them, title first ⇒ <code>{ status: 400, body: { error: 'VALIDATION_FAILED', details } }</code>: <code>title</code> missing or blank ⇒ <code>{ field: 'title', issue: 'required' }</code>; <code>severity</code> not LOW/MEDIUM/HIGH ⇒ <code>{ field: 'severity', issue: 'one of LOW, MEDIUM, HIGH' }</code></li>
<li>Otherwise ⇒ <code>{ status: 201, location: '/issues/iss_N', body: issue, deviceStatus }</code> where N = number of existing issues + 1, <code>issue = { id, deviceId, reportedBy, title (trimmed), severity, status: 'OPEN', createdAt: now }</code>, and <code>deviceStatus</code> = <code>'MAINTENANCE'</code> for a HIGH report, otherwise the device’s current status.</li></ol>
<p>Do not modify <code>db</code> — return what the server would store.</p>`,
  vi: `<p>Dựng lại <code>POST /devices/{deviceId}/issues</code> của lab thành một hàm thuần. <code>req = { userId, deviceId, body, now }</code> (<code>userId</code> là null khi thiếu hoặc sai token). Kiểm theo đúng thứ tự router thật chạy:</p><ol>
<li>Không có <code>userId</code> ⇒ <code>{ status: 401, body: { error: 'UNAUTHENTICATED' } }</code></li>
<li>Không có thiết bị ⇒ <code>{ status: 404, body: { error: 'DEVICE_NOT_FOUND' } }</code></li>
<li>Lỗi body, TẤT CẢ, title trước ⇒ <code>{ status: 400, body: { error: 'VALIDATION_FAILED', details } }</code>: <code>title</code> thiếu hoặc rỗng ⇒ <code>{ field: 'title', issue: 'required' }</code>; <code>severity</code> không phải LOW/MEDIUM/HIGH ⇒ <code>{ field: 'severity', issue: 'one of LOW, MEDIUM, HIGH' }</code></li>
<li>Còn lại ⇒ <code>{ status: 201, location: '/issues/iss_N', body: issue, deviceStatus }</code> với N = số báo hỏng hiện có + 1, <code>issue = { id, deviceId, reportedBy, title (đã cắt khoảng trắng), severity, status: 'OPEN', createdAt: now }</code>, và <code>deviceStatus</code> = <code>'MAINTENANCE'</code> nếu báo HIGH, ngược lại là status hiện tại của thiết bị.</li></ol>
<p>Không sửa <code>db</code> — trả về thứ server sẽ lưu.</p>`,
  dauVao: ['db — { devices, issues }; req — { userId, deviceId, body, now }.', 'db — { devices, issues }; req — { userId, deviceId, body, now }.'],
  dauRa: ['{ status, body, location?, deviceStatus? }', '{ status, body, location?, deviceStatus? }'],
  goiY: [['Same three-step pattern as validateBooking: who are you → does it exist → is the body right.', 'Cùng khuôn ba bước như validateBooking: bạn là ai → nó có tồn tại → body có đúng.'], ['"   " is blank: check title.trim().', '"   " là rỗng: kiểm title.trim().']],
  loi: [['Validating the body before checking the device — the real router answers 404 for dev_9 even with a bad body.', 'Kiểm body trước khi kiểm thiết bị — router thật trả 404 cho dev_9 kể cả khi body sai.'], ['Accepting "high" in lower case: enum values are exact.', 'Nhận "high" chữ thường: giá trị enum phải khớp chính xác.']],
  gt: ['The order follows the middleware chain: requireAuth runs before the handler, the handler loads the parent (device) before reading the body. Returning deviceStatus makes the side effect of a HIGH report explicit — the lab’s rubric asks you to prove it with GET /devices/dev_1.', 'Thứ tự đi theo chuỗi middleware: requireAuth chạy trước handler, handler nạp cha (thiết bị) trước khi đọc body. Trả deviceStatus làm rõ hiệu ứng phụ của báo HIGH — thang chấm của lab yêu cầu chứng minh bằng GET /devices/dev_1.'],
  kn: ['validation order', 'side effects'],
  tns: [tn('side effect', 'hiệu ứng phụ'), tn('parent resource', 'tài nguyên cha')],
  dau: `/** db = { devices, issues }, req = { userId, deviceId, body, now } ⇒ { status, body, location?, deviceStatus? } */
function reportIssue(db, req) {
  // Write your solution here
  var b = req.body;
  if (!b.title) return { status: 400, body: { error: 'VALIDATION_FAILED' } };
  return { status: 201, body: { id: 'iss_1', title: b.title, severity: b.severity, status: 'OPEN' } };
}
`,
  giai: '// Reference solution\n' + nguon(reportIssue),
  cases: [
    { goi: goi('reportIssue', DB, { userId: 'usr_1', deviceId: 'dev_1', body: { title: 'Cổng console không lên đèn', severity: 'HIGH' }, now: NOW }), moTa: ['The real 201 of the lab', '201 thật của lab'] },
    { goi: goi('reportIssue', DB, { userId: 'usr_1', deviceId: 'dev_1', body: { severity: 'URGENT' }, now: NOW }), moTa: ['The real 400 of the lab', '400 thật của lab'] },
    { goi: goi('reportIssue', DB, { userId: 'usr_1', deviceId: 'dev_9', body: { title: 'x', severity: 'LOW' }, now: NOW }) },
    { goi: goi('reportIssue', DB, { userId: null, deviceId: 'dev_9', body: {}, now: NOW }), an: true },
    { goi: goi('reportIssue', DB, { userId: 'usr_2', deviceId: 'dev_9', body: { severity: 'URGENT' }, now: NOW }), an: true },
    { goi: goi('reportIssue', { devices: DB.devices, issues: [{ id: 'iss_1' }, { id: 'iss_2' }] }, { userId: 'usr_2', deviceId: 'dev_2', body: { title: '  Cổng 24 chập chờn  ', severity: 'LOW' }, now: NOW }), an: true },
    { goi: goi('reportIssue', DB, { userId: 'usr_1', deviceId: 'dev_2', body: { title: '   ', severity: 'high' }, now: NOW }), an: true },
    { goi: goi('reportIssue', DB, { userId: 'usr_1', deviceId: 'dev_1', now: NOW }), an: true },
  ],
});

/* ── 3. Tự viết: resolveIssue ── */
function resolveIssue(db, req) {
  if (!req.user) return { status: 401, body: { error: 'UNAUTHENTICATED' } };
  if (req.user.role !== 'LAB_MANAGER') return { status: 403, body: { error: 'FORBIDDEN' } };
  var issue = db.issues.find(function (i) { return i.id === req.issueId; });
  if (!issue) return { status: 404, body: { error: 'ISSUE_NOT_FOUND' } };
  if (issue.status === 'RESOLVED') return { status: 409, body: { error: 'ALREADY_RESOLVED' } };
  var out = {};
  Object.keys(issue).forEach(function (k) { out[k] = issue[k]; });
  out.status = 'RESOLVED';
  out.resolvedAt = req.now;
  return { status: 200, body: out };
}
const ISS = [
  { id: 'iss_1', deviceId: 'dev_1', reportedBy: 'usr_1', title: 'Cổng console không lên đèn', severity: 'HIGH', status: 'OPEN', createdAt: NOW },
  { id: 'iss_2', deviceId: 'dev_2', reportedBy: 'usr_2', title: 'Cổng 24 chập chờn', severity: 'LOW', status: 'RESOLVED', createdAt: NOW, resolvedAt: '2026-10-31T16:00:00.000Z' },
];
const AN = { id: 'usr_1', role: 'STUDENT' };
const LAN = { id: 'usr_3', role: 'LAB_MANAGER' };
const R_NOW = '2026-10-31T15:45:00.191Z';
const B3 = jsBai({
  ten: 'Lab 1.3 — Write resolveIssue(db, req): POST /issues/{id}/resolve', kho: 'MEDIUM', phut: 15, dangBai: 'lab',
  en: `<p>The action endpoint of the lab. <code>req = { user, issueId, now }</code>, <code>user</code> = <code>{ id, role }</code> or null. The real chain is <code>requireAuth → requireRole('LAB_MANAGER') → handler</code>, so:</p><ol>
<li>no user ⇒ 401 <code>UNAUTHENTICATED</code></li>
<li>role is not <code>LAB_MANAGER</code> ⇒ 403 <code>FORBIDDEN</code> (even for an issue that does not exist)</li>
<li>no such issue ⇒ 404 <code>ISSUE_NOT_FOUND</code></li>
<li>already <code>RESOLVED</code> ⇒ 409 <code>ALREADY_RESOLVED</code></li>
<li>otherwise 200 with a copy of the issue whose <code>status</code> is <code>'RESOLVED'</code> and <code>resolvedAt</code> = <code>now</code>.</li></ol>
<p>Every error is <code>{ status, body: { error } }</code>; success is <code>{ status: 200, body }</code>.</p>`,
  vi: `<p>Endpoint hành động của lab. <code>req = { user, issueId, now }</code>, <code>user</code> = <code>{ id, role }</code> hoặc null. Chuỗi thật là <code>requireAuth → requireRole('LAB_MANAGER') → handler</code>, nên:</p><ol>
<li>không có user ⇒ 401 <code>UNAUTHENTICATED</code></li>
<li>vai trò không phải <code>LAB_MANAGER</code> ⇒ 403 <code>FORBIDDEN</code> (kể cả với báo hỏng không tồn tại)</li>
<li>không có báo hỏng ⇒ 404 <code>ISSUE_NOT_FOUND</code></li>
<li>đã <code>RESOLVED</code> ⇒ 409 <code>ALREADY_RESOLVED</code></li>
<li>còn lại 200 với bản sao của báo hỏng có <code>status</code> là <code>'RESOLVED'</code> và <code>resolvedAt</code> = <code>now</code>.</li></ol>
<p>Lỗi nào cũng là <code>{ status, body: { error } }</code>; thành công là <code>{ status: 200, body }</code>.</p>`,
  dauVao: ['db — { issues }; req — { user, issueId, now }.', 'db — { issues }; req — { user, issueId, now }.'],
  dauRa: ['{ status, body }', '{ status, body }'],
  goiY: [['Write the four guards as early returns, in the order of the middleware chain.', 'Viết bốn chốt chặn thành các return sớm, theo thứ tự chuỗi middleware.'], ['Copy the issue before changing it — db must stay untouched.', 'Sao chép báo hỏng trước khi đổi — db phải giữ nguyên.']],
  loi: [['Looking up the issue first: a student would then learn which issue ids exist (404 vs 403).', 'Tìm báo hỏng trước: sinh viên sẽ biết id báo hỏng nào tồn tại (404 hay 403).'], ['Returning 200 again for an already resolved issue — the client cannot tell nothing happened.', 'Trả 200 lần nữa cho báo hỏng đã xử lý — client không biết là không có gì xảy ra.']],
  gt: ['Checking the role before loading the resource is what the real router does, and it also avoids telling unauthorised users which ids exist. 409 makes the second resolve visible instead of silently re-stamping resolvedAt.', 'Kiểm vai trò trước khi nạp tài nguyên là đúng việc router thật làm, và còn tránh cho người không có quyền biết id nào tồn tại. 409 làm lần resolve thứ hai hiện rõ thay vì lặng lẽ đóng lại dấu resolvedAt.'],
  kn: ['authorisation order', 'action endpoints'],
  tns: [tn('role', 'vai trò'), tn('guard clause', 'chốt chặn đầu hàm')],
  dau: `/** db = { issues }, req = { user, issueId, now } ⇒ { status, body } */
function resolveIssue(db, req) {
  // Write your solution here
  var issue = db.issues.find(function (i) { return i.id === req.issueId; });
  if (!issue) return { status: 404, body: { error: 'ISSUE_NOT_FOUND' } };
  issue.status = 'RESOLVED';
  return { status: 200, body: issue };
}
`,
  giai: '// Reference solution\n' + nguon(resolveIssue),
  cases: [
    { goi: goi('resolveIssue', { issues: ISS }, { user: AN, issueId: 'iss_1', now: R_NOW }), moTa: ['The real 403 of the lab (An)', '403 thật của lab (An)'] },
    { goi: goi('resolveIssue', { issues: ISS }, { user: LAN, issueId: 'iss_1', now: R_NOW }), moTa: ['The real 200 of the lab (Lan)', '200 thật của lab (Lan)'] },
    { goi: goi('resolveIssue', { issues: ISS }, { user: LAN, issueId: 'iss_2', now: R_NOW }) },
    { goi: goi('resolveIssue', { issues: ISS }, { user: null, issueId: 'iss_1', now: R_NOW }), an: true },
    { goi: goi('resolveIssue', { issues: ISS }, { user: AN, issueId: 'iss_9', now: R_NOW }), an: true },
    { goi: goi('resolveIssue', { issues: ISS }, { user: LAN, issueId: 'iss_9', now: R_NOW }), an: true },
    { goi: `(function () { var db = { issues: [{ id: 'iss_5', status: 'OPEN' }] }; resolveIssue(db, { user: { id: 'usr_3', role: 'LAB_MANAGER' }, issueId: 'iss_5', now: 'T' }); return db; })()`, an: true, moTa: ['db is not modified', 'Không sửa db'] },
  ],
});

export default doiDau({ slug: 'api-1-5-lab', ten: 'Lab 1 — Device issue reports', khoa: KHOA, baiHoc: 'api-1-5-lab', de: [B1, B2, B3] });
