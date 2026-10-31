/** API Design · Lab 2 — Báo hỏng phiên bản 2: bảng thiết kế; tự viết reportIssueV2 (401 → 404 → 400 → 409 → 201) và resolveIssueV2. */
import { doiDau, KHOA, cs, bang1, tn, jsBai, nguon, goi } from './_api.mjs';

/* ── 1. Thiết kế ── */
const TANG = ['door', 'shape', 'rule'];
const MA = ['400 VALIDATION_FAILED', '400 INVALID_QUERY', '404 DEVICE_NOT_FOUND', '409 DUPLICATE_ISSUE', '415 UNSUPPORTED_MEDIA_TYPE'];
const B1 = cs({
  ten: 'Lab 2.1 — Part A: layer and code for each input', kho: 'EASY', phut: 10, loai: 'table',
  en: 'Part A of Lab 2, answered from the real transcript. For each input choose the layer that refuses it and the status + code.',
  vi: 'Phần A của Lab 2, trả lời theo transcript thật. Với mỗi đầu vào, chọn tầng chặn nó và mã trạng thái + code.',
  bang: [bang1('b1', ['Input → layer → answer', 'Đầu vào → tầng → câu trả lời'], [{ ma: 'x', ten: 'Input' }, { ma: 't', ten: 'Layer', luaChon: TANG }, { ma: 'c', ten: 'Answer', luaChon: MA }], [
    { o: { x: '{"title":"x","severity":"URGENT","reporter":"usr_2"} on dev_1' }, a: { t: TANG[1], c: MA[0] } },
    { o: { x: 'empty body on dev_9' }, a: { t: TANG[2], c: MA[2] } },
    { o: { x: '"cong CONSOLE khong len den" while iss_1 is OPEN on dev_1' }, a: { t: TANG[2], c: MA[3] } },
    { o: { x: 'Content-Type: text/plain' }, a: { t: TANG[0], c: MA[4] } },
    { o: { x: 'GET /issues?status=open' }, a: { t: TANG[1], c: MA[1] } },
  ], ['The device is loaded before the body is validated, so dev_9 answers 404 even with a bad body (Lab 1’s order). The duplicate is a rule that needs data; lower-case “open” is a shape error of the query.', 'Thiết bị được nạp trước khi kiểm body, nên dev_9 trả 404 kể cả khi body sai (thứ tự của Lab 1). Trùng tiêu đề là luật cần tra dữ liệu; "open" chữ thường là lỗi hình dạng của query.'])],
  goiY: [['Recall the order 401 → 404 → 400.', 'Nhớ thứ tự 401 → 404 → 400.'], ['Enum values are exact: OPEN, not open.', 'Giá trị enum phải chính xác: OPEN, không phải open.']],
  loi: [['Answering 400 for dev_9 with a bad body.', 'Trả 400 cho dev_9 có body sai.'], ['Calling the duplicate a shape error.', 'Gọi lỗi trùng là lỗi hình dạng.']],
  tns: [tn('rubric', 'thang chấm'), tn('transcript', 'bản ghi lệnh và output')],
  kn: ['API design'],
});

/* ── 2. Tự viết: reportIssueV2 ── */
function reportIssueV2(db, req) {
  var fold = function (s) { return s.normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase(); };
  var text = function (v) { return typeof v === 'string' ? v.trim().normalize('NFC') : v; };
  if (!req.userId) return { status: 401, body: { code: 'UNAUTHENTICATED' } };
  var device = db.devices.find(function (d) { return d.id === req.deviceId; });
  if (!device) return { status: 404, body: { code: 'DEVICE_NOT_FOUND' } };
  var b = req.body || {};
  var errors = [], v = {};
  Object.keys(b).forEach(function (k) {
    var x = text(b[k]);
    if (k === 'title') { if (typeof x === 'string' && x.length >= 3 && x.length <= 120) v.title = x; else errors.push({ pointer: '#/title', detail: 'length 3-120' }); }
    else if (k === 'severity') { if (['LOW', 'MEDIUM', 'HIGH'].indexOf(x) >= 0) v.severity = x; else errors.push({ pointer: '#/severity', detail: 'one of LOW, MEDIUM, HIGH' }); }
    else if (k === 'description') { if (typeof x === 'string' && x.length >= 1 && x.length <= 1000) v.description = x; else errors.push({ pointer: '#/description', detail: 'length 1-1000' }); }
    else errors.push({ pointer: '#/' + k, detail: 'unknown field' });
  });
  if (!('title' in b)) errors.push({ pointer: '#/title', detail: 'required' });
  if (!('severity' in b)) errors.push({ pointer: '#/severity', detail: 'required' });
  if (errors.length) return { status: 400, body: { code: 'VALIDATION_FAILED', errors: errors } };
  var same = db.issues.find(function (i) { return i.deviceId === device.id && i.status === 'OPEN' && fold(i.title) === fold(v.title); });
  if (same) return { status: 409, body: { code: 'DUPLICATE_ISSUE', existing: same.id } };
  var issue = {
    id: 'iss_' + (db.issues.length + 1), deviceId: device.id, reportedBy: req.userId, title: v.title, severity: v.severity,
    description: v.description === undefined ? null : v.description, status: 'OPEN', createdAt: req.now, resolvedAt: null, resolution: null,
  };
  return { status: 201, location: '/issues/' + issue.id, body: issue, deviceStatus: v.severity === 'HIGH' ? 'MAINTENANCE' : device.status };
}
const DB = {
  devices: [
    { id: 'dev_1', labId: 'lab_1', name: 'Cisco Router 2901', status: 'AVAILABLE' },
    { id: 'dev_2', labId: 'lab_1', name: 'Cisco Switch 2960', status: 'AVAILABLE' },
  ],
  issues: [],
};
const DB2 = { devices: DB.devices, issues: [{ id: 'iss_1', deviceId: 'dev_1', title: 'Cổng console không lên đèn', status: 'OPEN' }] };
const NOW = '2026-10-31T17:46:03.341Z';
const B2 = jsBai({
  ten: 'Lab 2.2 — Write reportIssueV2(db, req): the whole POST in one function', kho: 'HARD', phut: 30, dangBai: 'lab',
  en: `<p>Re-create Lab 2’s <code>POST /devices/{id}/issues</code> as a pure function. <code>req = { userId, deviceId, body, now }</code>. Checks in this order; the first failing step answers:</p><ol>
<li>no <code>userId</code> ⇒ <code>{ status: 401, body: { code: 'UNAUTHENTICATED' } }</code>; no such device ⇒ <code>{ status: 404, body: { code: 'DEVICE_NOT_FOUND' } }</code></li>
<li><b>Shape</b> — go through the body keys in order; strings are trimmed and NFC-normalised first. <code>title</code> 3–120 chars else <code>'length 3-120'</code>; <code>severity</code> LOW/MEDIUM/HIGH else <code>'one of LOW, MEDIUM, HIGH'</code>; <code>description</code> 1–1000 chars else <code>'length 1-1000'</code>; other keys <code>'unknown field'</code>. After the loop: missing <code>title</code> ⇒ <code>'required'</code>, then missing <code>severity</code> ⇒ <code>'required'</code>. Any error ⇒ <code>{ status: 400, body: { code: 'VALIDATION_FAILED', errors: [{ pointer: '#/key', detail }] } }</code>.</li>
<li><b>Rule</b> — an <code>OPEN</code> issue of the same device whose title is equal after folding (NFD, no marks, đ→d, Đ→D, lower case) ⇒ <code>{ status: 409, body: { code: 'DUPLICATE_ISSUE', existing: id } }</code></li>
<li>Otherwise <code>{ status: 201, location: '/issues/iss_N', body, deviceStatus }</code>: N = existing issues + 1; <code>body</code> has the ten members <code>id, deviceId, reportedBy, title, severity, description (null if absent), status 'OPEN', createdAt = now, resolvedAt null, resolution null</code>; <code>deviceStatus</code> = <code>'MAINTENANCE'</code> for HIGH, else the device’s status.</li></ol>`,
  vi: `<p>Dựng lại <code>POST /devices/{id}/issues</code> của Lab 2 thành một hàm thuần. <code>req = { userId, deviceId, body, now }</code>. Kiểm theo thứ tự này; bước đầu tiên trượt sẽ trả lời:</p><ol>
<li>không có <code>userId</code> ⇒ <code>{ status: 401, body: { code: 'UNAUTHENTICATED' } }</code>; không có thiết bị ⇒ <code>{ status: 404, body: { code: 'DEVICE_NOT_FOUND' } }</code></li>
<li><b>Hình dạng</b> — duyệt các khoá của body theo thứ tự; chuỗi được trim và chuẩn hoá NFC trước. <code>title</code> 3–120 ký tự, ngược lại <code>'length 3-120'</code>; <code>severity</code> LOW/MEDIUM/HIGH, ngược lại <code>'one of LOW, MEDIUM, HIGH'</code>; <code>description</code> 1–1000 ký tự, ngược lại <code>'length 1-1000'</code>; khoá khác <code>'unknown field'</code>. Sau vòng lặp: thiếu <code>title</code> ⇒ <code>'required'</code>, rồi thiếu <code>severity</code> ⇒ <code>'required'</code>. Có lỗi ⇒ <code>{ status: 400, body: { code: 'VALIDATION_FAILED', errors: [{ pointer: '#/khoá', detail }] } }</code>.</li>
<li><b>Luật</b> — một báo hỏng <code>OPEN</code> cùng thiết bị có tiêu đề bằng nhau sau khi gấp (NFD, bỏ dấu, đ→d, Đ→D, viết thường) ⇒ <code>{ status: 409, body: { code: 'DUPLICATE_ISSUE', existing: id } }</code></li>
<li>Còn lại <code>{ status: 201, location: '/issues/iss_N', body, deviceStatus }</code>: N = số báo hỏng hiện có + 1; <code>body</code> có mười trường <code>id, deviceId, reportedBy, title, severity, description (null nếu thiếu), status 'OPEN', createdAt = now, resolvedAt null, resolution null</code>; <code>deviceStatus</code> = <code>'MAINTENANCE'</code> với HIGH, ngược lại là status của thiết bị.</li></ol>`,
  dauVao: ['db — { devices, issues }; req — { userId, deviceId, body, now }.', 'db — { devices, issues }; req — { userId, deviceId, body, now }.'],
  dauRa: ['{ status, body, location?, deviceStatus? }', '{ status, body, location?, deviceStatus? }'],
  goiY: [['Write it as a sequence of early returns, one per layer.', 'Viết thành chuỗi return sớm, mỗi tầng một bước.'], ['Fold both titles before comparing; normalise input to NFC before checking its length.', 'Gấp cả hai tiêu đề trước khi so; chuẩn hoá chữ vào về NFC trước khi đếm độ dài.']],
  loi: [['Validating the body before loading the device — breaks the 401 → 404 → 400 order.', 'Kiểm body trước khi nạp thiết bị — làm hỏng thứ tự 401 → 404 → 400.'], ['Comparing titles with === — misses accents, case and NFD.', 'So tiêu đề bằng === — bỏ sót dấu, hoa thường và NFD.']],
  gt: ['Every idea of Chapter 2 in one handler: the door is handled by the framework, the shape is checked in one pass with every error collected, the rule compares text the way a reader would, and the success body is a view with a fixed shape.', 'Mọi ý của Chương 2 trong một handler: cửa do framework lo, hình dạng được kiểm một lượt và gom đủ mọi lỗi, luật so chữ theo cách người đọc so, và body thành công là một view có hình dạng cố định.'],
  kn: ['validation order', 'Unicode folding', 'views'],
  tns: [tn('fold', 'gấp chữ', 'Bỏ dấu, bỏ hoa thường để so như người đọc.'), tn('early return', 'trả về sớm')],
  dau: `/** db, req ⇒ { status, body, location?, deviceStatus? } — Lab 2 */
function reportIssueV2(db, req) {
  // Write your solution here
  var b = req.body || {};
  if (!b.title || !b.severity) return { status: 400, body: { code: 'VALIDATION_FAILED' } };
  return { status: 201, body: { id: 'iss_1', title: b.title, severity: b.severity, status: 'OPEN' } };
}
`,
  giai: '// Reference solution\n' + nguon(reportIssueV2),
  cases: [
    { goi: goi('reportIssueV2', DB, { userId: 'usr_1', deviceId: 'dev_1', body: { title: 'Cổng console không lên đèn', severity: 'HIGH' }, now: NOW }), moTa: ['Transcript step 1', 'Bước 1 của transcript'] },
    { goi: goi('reportIssueV2', DB2, { userId: 'usr_1', deviceId: 'dev_1', body: { title: 'x', severity: 'URGENT', reporter: 'usr_2' }, now: NOW }), moTa: ['Transcript step 3', 'Bước 3 của transcript'] },
    { goi: goi('reportIssueV2', DB2, { userId: 'usr_2', deviceId: 'dev_1', body: { title: 'cong CONSOLE khong len den', severity: 'LOW' }, now: NOW }), moTa: ['Transcript step 5', 'Bước 5 của transcript'] },
    { goi: goi('reportIssueV2', DB, { userId: 'usr_1', deviceId: 'dev_9', body: {}, now: NOW }), an: true },
    { goi: goi('reportIssueV2', DB, { userId: null, deviceId: 'dev_9', body: {}, now: NOW }), an: true },
    { goi: goi('reportIssueV2', DB, { userId: 'usr_1', deviceId: 'dev_2', body: {}, now: NOW }), an: true },
    { goi: goi('reportIssueV2', DB2, { userId: 'usr_2', deviceId: 'dev_1', body: { title: 'Cổng console không lên đèn', severity: 'MEDIUM' }, now: NOW }), an: true, moTa: ['NFD duplicate', 'Trùng ở dạng NFD'] },
    { goi: goi('reportIssueV2', DB2, { userId: 'usr_2', deviceId: 'dev_2', body: { title: '  Cổng 24 chập chờn  ', severity: 'LOW', description: 'Đèn cổng 24 lúc sáng lúc tắt' }, now: NOW }), an: true },
    { goi: goi('reportIssueV2', { devices: DB.devices, issues: [{ id: 'iss_1', deviceId: 'dev_1', title: 'Cổng console không lên đèn', status: 'RESOLVED' }] }, { userId: 'usr_1', deviceId: 'dev_1', body: { title: 'Cổng console không lên đèn', severity: 'HIGH' }, now: NOW }), an: true, moTa: ['Resolved issues do not block', 'Báo hỏng đã xử lý không chặn'] },
    { goi: goi('reportIssueV2', DB, { userId: 'usr_1', deviceId: 'dev_1', body: { severity: 'LOW', description: '' }, now: NOW }), an: true },
  ],
});

/* ── 3. Tự viết: resolveIssueV2 ── */
function resolveIssueV2(db, req) {
  if (!req.user) return { status: 401, body: { code: 'UNAUTHENTICATED' } };
  if (req.user.role !== 'LAB_MANAGER') return { status: 403, body: { code: 'FORBIDDEN' } };
  var b = req.body || {};
  var errors = [];
  Object.keys(b).forEach(function (k) {
    if (k !== 'resolution') errors.push({ pointer: '#/' + k, detail: 'unknown field' });
    else if (typeof b[k] !== 'string' || b[k].trim().length < 1 || b[k].trim().length > 500) errors.push({ pointer: '#/resolution', detail: 'length 1-500' });
  });
  if (errors.length) return { status: 400, body: { code: 'VALIDATION_FAILED', errors: errors } };
  var issue = db.issues.find(function (i) { return i.id === req.issueId; });
  if (!issue) return { status: 404, body: { code: 'ISSUE_NOT_FOUND' } };
  if (issue.status === 'RESOLVED') return { status: 409, body: { code: 'ALREADY_RESOLVED' } };
  return {
    status: 200,
    body: {
      id: issue.id, deviceId: issue.deviceId, reportedBy: issue.reportedBy, title: issue.title, severity: issue.severity,
      description: issue.description === undefined ? null : issue.description, status: 'RESOLVED', createdAt: issue.createdAt,
      resolvedAt: req.now, resolution: b.resolution === undefined ? null : b.resolution.trim(),
    },
  };
}
const ISS = [
  { id: 'iss_1', deviceId: 'dev_1', reportedBy: 'usr_1', title: 'Cổng console không lên đèn', severity: 'HIGH', status: 'OPEN', createdAt: NOW, internalNote: 'kiểm lại cáp' },
  { id: 'iss_2', deviceId: 'dev_2', reportedBy: 'usr_2', title: 'Cổng 24 chập chờn', severity: 'LOW', description: 'Đèn cổng 24 lúc sáng lúc tắt', status: 'RESOLVED', createdAt: NOW },
];
const LAN = { id: 'usr_3', role: 'LAB_MANAGER' };
const B3 = jsBai({
  ten: 'Lab 2.3 — Write resolveIssueV2(db, req): action + optional body + view', kho: 'MEDIUM', phut: 20, dangBai: 'lab',
  en: `<p><code>POST /issues/{id}/resolve</code> in Lab 2. <code>req = { user, issueId, body, now }</code>. Order (the real middleware chain: auth → role → validate → handler):</p><ol>
<li>no user ⇒ 401 <code>UNAUTHENTICATED</code>; role not <code>LAB_MANAGER</code> ⇒ 403 <code>FORBIDDEN</code></li>
<li>body (may be missing ⇒ <code>{}</code>): the only allowed key is <code>resolution</code>, a string of 1–500 chars after trim, else <code>'length 1-500'</code>; other keys <code>'unknown field'</code> ⇒ 400 <code>VALIDATION_FAILED</code> with <code>errors</code></li>
<li>no such issue ⇒ 404 <code>ISSUE_NOT_FOUND</code>; already <code>RESOLVED</code> ⇒ 409 <code>ALREADY_RESOLVED</code></li>
<li>otherwise 200 with the issue’s <b>view</b> (the ten members of <code>toIssue</code>, in order <code>id, deviceId, reportedBy, title, severity, description, status, createdAt, resolvedAt, resolution</code>): status <code>'RESOLVED'</code>, <code>resolvedAt = now</code>, <code>resolution</code> trimmed or <code>null</code>, <code>description</code> or <code>null</code>. Internal fields never leave. Do not modify <code>db</code>.</li></ol>
<p>Errors are <code>{ status, body: { code, errors? } }</code>.</p>`,
  vi: `<p><code>POST /issues/{id}/resolve</code> trong Lab 2. <code>req = { user, issueId, body, now }</code>. Thứ tự (đúng chuỗi middleware thật: xác thực → vai trò → validate → handler):</p><ol>
<li>không có user ⇒ 401 <code>UNAUTHENTICATED</code>; vai trò không phải <code>LAB_MANAGER</code> ⇒ 403 <code>FORBIDDEN</code></li>
<li>body (có thể thiếu ⇒ <code>{}</code>): khoá duy nhất được phép là <code>resolution</code>, chuỗi 1–500 ký tự sau trim, ngược lại <code>'length 1-500'</code>; khoá khác <code>'unknown field'</code> ⇒ 400 <code>VALIDATION_FAILED</code> kèm <code>errors</code></li>
<li>không có báo hỏng ⇒ 404 <code>ISSUE_NOT_FOUND</code>; đã <code>RESOLVED</code> ⇒ 409 <code>ALREADY_RESOLVED</code></li>
<li>còn lại 200 với <b>view</b> của báo hỏng (mười trường của <code>toIssue</code>, theo thứ tự <code>id, deviceId, reportedBy, title, severity, description, status, createdAt, resolvedAt, resolution</code>): status <code>'RESOLVED'</code>, <code>resolvedAt = now</code>, <code>resolution</code> đã trim hoặc <code>null</code>, <code>description</code> hoặc <code>null</code>. Trường nội bộ không bao giờ đi ra. Không sửa <code>db</code>.</li></ol>
<p>Lỗi có dạng <code>{ status, body: { code, errors? } }</code>.</p>`,
  dauVao: ['db — { issues }; req — { user, issueId, body, now }.', 'db — { issues }; req — { user, issueId, body, now }.'],
  dauRa: ['{ status, body }', '{ status, body }'],
  goiY: [['Same guard-clause structure as Lab 1’s resolveIssue, plus a validation step and a view.', 'Cùng khuôn chốt chặn như resolveIssue ở Lab 1, thêm bước kiểm dữ liệu và view.'], ['Build the response object member by member — do not spread the issue.', 'Dựng object trả về từng trường — đừng trải issue ra.']],
  loi: [['Spreading the issue: internalNote leaks.', 'Trải issue ra: internalNote bị lộ.'], ['Checking the issue before validating the body — the chain validates first.', 'Kiểm báo hỏng trước khi kiểm body — chuỗi middleware kiểm body trước.']],
  gt: ['The order follows the middleware chain of the reference solution: requireAuth, requireRole, validate(IssueResolve), then the handler. The 200 body is a view, so it has the same ten members as every other issue response.', 'Thứ tự đi theo chuỗi middleware của lời giải mẫu: requireAuth, requireRole, validate(IssueResolve), rồi handler. Body 200 là một view, nên có đúng mười trường như mọi response báo hỏng khác.'],
  kn: ['action endpoints', 'views'],
  tns: [tn('guard clause', 'chốt chặn đầu hàm'), tn('view', 'bản biểu diễn công khai')],
  dau: `/** db, req ⇒ { status, body } */
function resolveIssueV2(db, req) {
  // Write your solution here
  var issue = db.issues.find(function (i) { return i.id === req.issueId; });
  return { status: 200, body: Object.assign({}, issue, { status: 'RESOLVED', resolvedAt: req.now }) };
}
`,
  giai: '// Reference solution\n' + nguon(resolveIssueV2),
  cases: [
    { goi: goi('resolveIssueV2', { issues: ISS }, { user: LAN, issueId: 'iss_1', body: { resolution: 'Thay cáp console mới' }, now: '2026-10-31T17:46:03.473Z' }), moTa: ['Transcript step 8 (Lan)', 'Bước 8 của transcript (Lan)'] },
    { goi: goi('resolveIssueV2', { issues: ISS }, { user: { id: 'usr_1', role: 'STUDENT' }, issueId: 'iss_1', now: 'T' }) },
    { goi: goi('resolveIssueV2', { issues: ISS }, { user: LAN, issueId: 'iss_2', body: {}, now: 'T' }) },
    { goi: goi('resolveIssueV2', { issues: ISS }, { user: null, issueId: 'iss_1', now: 'T' }), an: true },
    { goi: goi('resolveIssueV2', { issues: ISS }, { user: LAN, issueId: 'iss_9', body: { resolution: 'x' }, now: 'T' }), an: true },
    { goi: goi('resolveIssueV2', { issues: ISS }, { user: LAN, issueId: 'iss_1', body: { resolution: '   ', fixedBy: 'usr_3' }, now: 'T' }), an: true },
    { goi: goi('resolveIssueV2', { issues: ISS }, { user: LAN, issueId: 'iss_1', now: '2026-11-01T00:00:00.000Z' }), an: true },
    { goi: `(function () { var db = { issues: [{ id: 'iss_5', status: 'OPEN', title: 'x' }] }; resolveIssueV2(db, { user: { id: 'usr_3', role: 'LAB_MANAGER' }, issueId: 'iss_5', now: 'T' }); return db; })()`, an: true, moTa: ['db is not modified', 'Không sửa db'] },
  ],
});

export default doiDau({ slug: 'api-2-5-lab', ten: 'Lab 2 — Issue reports, version 2', khoa: KHOA, baiHoc: 'api-2-5-lab', de: [B1, B2, B3] });
