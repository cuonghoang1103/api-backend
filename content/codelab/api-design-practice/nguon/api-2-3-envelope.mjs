/** API Design · 2.3 — Hình dạng phản hồi: view, null hay vắng, bọc danh sách, envelope luôn 200; tự viết toBookingView + shapeDiff. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi } from './_api.mjs';

/* ── 1. Tình huống ── */
const E1 = cs({
  ten: 'Responses 1 — What goes out, and how', kho: 'EASY', phut: 10,
  en: 'Facts from lesson 2.3 (real LabFlow runs).',
  vi: 'Những điều từ bài 2.3 (chạy thật trên LabFlow).',
  cau: [
    q('c1', ['GET /me first returned res.json(req.user) and sent passwordHash. The robust fix is …', 'GET /me ban đầu trả res.json(req.user) và gửi cả passwordHash. Cách sửa bền vững là …'], ['a view that names the four public members (allow-list)', 'delete passwordHash before res.json (deny-list)', 'renaming passwordHash to _passwordHash', 'encrypting passwordHash before sending it'], ['A deny-list fails open: the next internal field (resetToken) leaks on the day it is added. An allow-list fails closed.', 'Danh sách cấm hỏng theo kiểu mở cửa: trường nội bộ tiếp theo (resetToken) lộ ngay ngày được thêm. Danh sách cho phép hỏng theo kiểu đóng cửa.']),
    q('c2', ['A booking had 8 members when created and 9 after cancelling. LabFlow’s rule fixes it by …', 'Một lượt đặt có 8 trường lúc tạo và 9 trường sau khi huỷ. Luật của LabFlow sửa bằng cách …'], ['always sending cancelledAt, null until it is set', 'removing cancelledAt from the API', 'sending cancelledAt only to managers', 'returning a different resource after cancelling'], ['Documented optional members are always present, null when empty — one shape for the whole life of a resource.', 'Trường tuỳ chọn có tài liệu luôn có mặt, rỗng thì null — một hình dạng cho cả đời tài nguyên.']),
    q('c3', ['Why does LabFlow answer lists as {"data": [...]} instead of a bare array?', 'Vì sao LabFlow trả danh sách dạng {"data": [...]} thay vì mảng trần?'], ['Paging metadata can be added next to data without breaking clients', 'Bare arrays are not valid JSON', 'Express cannot send arrays with res.json', 'Browsers block JSON responses that start with ['], ['Adding a member is additive; turning an array into an object breaks every client. (Express sends arrays fine.)', 'Thêm một trường là thay đổi thêm vào; biến mảng thành object làm vỡ mọi client. (Express gửi mảng bình thường.)']),
    q('c4', ['The always-200 envelope answered lab_9 with {"success":false,"code":404,…}. fetch reported …', 'Envelope luôn-200 trả lab_9 bằng {"success":false,"code":404,…}. fetch báo …'], ['res.ok = true, so the app showed “Thành công!”', 'res.ok = false, because fetch reads the code member', 'a network error', 'res.status = 404'], ['Measured with client200.mjs. Generic tools read the status line only.', 'Đo bằng client200.mjs. Công cụ chung chỉ đọc dòng trạng thái.']),
    q('c5', ['DELETE /devices/dev_2 succeeded. What does LabFlow send?', 'DELETE /devices/dev_2 thành công. LabFlow gửi gì?'], ['204 with no body and no Content-Type', '200 with {"ok": true}', '200 with the deleted device', '202 with a message'], ['Nothing to say ⇒ 204, no body. A message such as {"ok": true} adds a shape clients must parse for no information.', 'Không có gì để nói ⇒ 204, không body. Một câu như {"ok": true} thêm một hình dạng client phải đọc mà chẳng có thông tin gì.']),
  ],
  goiY: [['Ask what a client written today will see in a year.', 'Hỏi một client viết hôm nay sẽ thấy gì sau một năm.'], ['Every answer was measured in lesson 2.3.', 'Mọi đáp án đã được đo trong bài 2.3.']],
  loi: [['Deny-lists for sensitive fields.', 'Danh sách cấm cho trường nhạy cảm.'], ['Putting the real status inside a 200 body.', 'Đặt mã trạng thái thật vào trong body của 200.']],
  tns: [tn('DTO / view', 'đối tượng chuyển dữ liệu / view'), tn('envelope', 'phong bì bọc dữ liệu')],
  kn: ['response shape'],
});

/* ── 2. Tự viết: toBookingView ── */
function toBookingView(b) {
  return {
    id: b.id, labId: b.labId, userId: b.userId, startAt: b.startAt, endAt: b.endAt,
    purpose: b.purpose === undefined ? null : b.purpose,
    status: b.status, createdAt: b.createdAt,
    cancelledAt: b.cancelledAt === undefined ? null : b.cancelledAt,
  };
}
const BK = { id: 'bk_1', labId: 'lab_1', userId: 'usr_1', startAt: '2026-11-02T01:00:00.000Z', endAt: '2026-11-02T03:00:00.000Z', status: 'PENDING', createdAt: '2026-10-31T17:54:15.507Z' };
const E2 = jsBai({
  ten: 'Responses 2 — Write toBookingView(b): an allow-list with a stable shape', kho: 'EASY', phut: 10,
  en: `<p>Write LabFlow’s view for a booking. Return a NEW object with exactly these <b>nine</b> members, in this order: <code>id, labId, userId, startAt, endAt, purpose, status, createdAt, cancelledAt</code> — and nothing else. <code>purpose</code> and <code>cancelledAt</code> are optional: when missing (<code>undefined</code>) send <code>null</code>; when present (even <code>null</code> or <code>""</code>) send them as they are. Nothing else from the record may leave — internal fields such as <code>staffNote</code> or <code>version</code> must be dropped.</p>`,
  vi: `<p>Viết view của LabFlow cho một lượt đặt. Trả object MỚI có đúng các trường sau, theo thứ tự: <code>id, labId, userId, startAt, endAt, purpose, status, createdAt, cancelledAt</code> — đúng <b>chín</b> trường, không thêm gì khác. <code>purpose</code> và <code>cancelledAt</code> là tuỳ chọn: thiếu (<code>undefined</code>) thì gửi <code>null</code>; có (kể cả <code>null</code> hay <code>""</code>) thì gửi đúng như vậy. Không gì khác trong bản ghi được đi ra — trường nội bộ như <code>staffNote</code> hay <code>version</code> phải bị bỏ.</p>`,
  dauVao: ['b — an internal booking record.', 'b — bản ghi lượt đặt nội bộ.'],
  dauRa: ['The public representation (nine members).', 'Bản biểu diễn công khai (chín trường).'],
  goiY: [['Build a literal object naming every member — do not spread b.', 'Dựng object bằng cách gọi tên từng trường — đừng trải b ra.'], ['b.x === undefined ? null : b.x keeps "" and null as they are; ?? would too, but think about why.', 'b.x === undefined ? null : b.x giữ nguyên "" và null; ?? cũng vậy, nhưng hãy nghĩ vì sao.']],
  loi: [['{ ...b, purpose: b.purpose ?? null } — the spread leaks every internal field.', '{ ...b, purpose: b.purpose ?? null } — toán tử spread làm lộ mọi trường nội bộ.'], ['b.purpose || null — turns an empty string into null.', 'b.purpose || null — biến chuỗi rỗng thành null.']],
  gt: ['Naming the members makes the view an allow-list (new internal fields stay hidden) and fixes the shape (the same nine members whatever the state). It is LabFlow’s toBooking in views.js.', 'Gọi tên từng trường biến view thành danh sách cho phép (trường nội bộ mới vẫn bị giấu) và cố định hình dạng (cùng chín trường ở mọi trạng thái). Đó là toBooking trong views.js của LabFlow.'],
  kn: ['DTO', 'allow-list'],
  tns: [tn('allow-list', 'danh sách cho phép'), tn('representation', 'bản biểu diễn')],
  dau: `/** internal booking ⇒ public view (nine members, optional ones null) */
function toBookingView(b) {
  // Write your solution here
  return { ...b, purpose: b.purpose || null };
}
`,
  giai: '// Reference solution\n' + nguon(toBookingView),
  cases: [
    { goi: goi('toBookingView', BK), moTa: ['A new booking without purpose', 'Lượt đặt mới không có mục đích'] },
    { goi: goi('toBookingView', { ...BK, status: 'CANCELLED', purpose: 'SWT301 Lab 3', cancelledAt: '2026-10-31T17:54:15.526Z' }) },
    { goi: goi('toBookingView', { ...BK, purpose: '', staffNote: 'Hay đặt rồi không đến', version: 3 }), an: true },
    { goi: goi('toBookingView', { ...BK, purpose: null, cancelledAt: null, userEmail: 'an@student.labflow.example' }), an: true },
    { goi: `(function () { var b = ${JSON.stringify(BK)}; toBookingView(b).purpose = 'x'; return b; })()`, an: true, moTa: ['The record is not modified', 'Bản ghi không bị sửa'] },
  ],
});

/* ── 3. Tự viết: shapeDiff ── */
function shapeDiff(a, b) {
  var ka = Object.keys(a), kb = Object.keys(b);
  return {
    missing: ka.filter(function (k) { return kb.indexOf(k) < 0; }).sort(),
    extra: kb.filter(function (k) { return ka.indexOf(k) < 0; }).sort(),
    typeChanged: ka.filter(function (k) {
      if (kb.indexOf(k) < 0 || a[k] === null || b[k] === null) return false;   // null is allowed for any member
      var t = function (v) { return Array.isArray(v) ? 'array' : typeof v; };
      return t(a[k]) !== t(b[k]);
    }).sort(),
  };
}
const E3 = jsBai({
  ten: 'Responses 3 — Write shapeDiff(a, b): catch shape changes in a test', kho: 'MEDIUM', phut: 15,
  en: `<p>A contract test compares two responses of the same resource — say, a booking before and after cancelling — and fails if the <b>shape</b> changed. Write <code>shapeDiff(a, b)</code> for two plain objects (top level only):</p><ul>
<li><code>missing</code>: keys of <code>a</code> not in <code>b</code>; <code>extra</code>: keys of <code>b</code> not in <code>a</code></li>
<li><code>typeChanged</code>: keys in both whose type differs — types are <code>'array'</code> for arrays, otherwise <code>typeof</code>. A <code>null</code> on either side never counts as a change (null is a legal value of any optional member).</li>
<li>Each list sorted alphabetically. Return <code>{ missing, extra, typeChanged }</code>.</li></ul>
<p>Real data from lesson 2.3: before the views, the cancelled booking had an <i>extra</i> <code>cancelledAt</code>; after, nothing differs.</p>`,
  vi: `<p>Một bài test hợp đồng so hai response của cùng một tài nguyên — chẳng hạn lượt đặt trước và sau khi huỷ — và báo hỏng nếu <b>hình dạng</b> thay đổi. Viết <code>shapeDiff(a, b)</code> cho hai object thường (chỉ tầng ngoài cùng):</p><ul>
<li><code>missing</code>: khoá của <code>a</code> không có trong <code>b</code>; <code>extra</code>: khoá của <code>b</code> không có trong <code>a</code></li>
<li><code>typeChanged</code>: khoá có ở cả hai mà kiểu khác nhau — kiểu là <code>'array'</code> với mảng, còn lại là <code>typeof</code>. <code>null</code> ở bất kỳ bên nào không bao giờ tính là thay đổi (null là giá trị hợp lệ của mọi trường tuỳ chọn).</li>
<li>Mỗi danh sách sắp theo bảng chữ cái. Trả <code>{ missing, extra, typeChanged }</code>.</li></ul>
<p>Dữ liệu thật từ bài 2.3: trước khi có view, lượt đặt đã huỷ có <i>thêm</i> <code>cancelledAt</code>; sau khi có view, không còn khác biệt.</p>`,
  dauVao: ['a, b — two plain objects.', 'a, b — hai object thường.'],
  dauRa: ['{ missing: string[], extra: string[], typeChanged: string[] }', '{ missing: mảng chuỗi, extra: mảng chuỗi, typeChanged: mảng chuỗi }'],
  goiY: [['Object.keys + filter + indexOf, then .sort().', 'Object.keys + filter + indexOf, rồi .sort().'], ['typeof [] is "object" — handle arrays first.', 'typeof [] là "object" — xử lý mảng trước.']],
  loi: [['Counting "note": null vs "note": "Thiếu thẻ nhớ" as a type change.', 'Tính "note": null so với "note": "Thiếu thẻ nhớ" là đổi kiểu.'], ['Forgetting to sort — order of keys is not part of the shape.', 'Quên sắp xếp — thứ tự khoá không thuộc về hình dạng.']],
  gt: ['This is the check that would have caught problems 2 and 3 of lesson 2.3 automatically. Run it in your tests over pairs of real responses (created vs cancelled, list item vs single item) and a shape change can no longer ship by accident.', 'Đây là phép kiểm lẽ ra đã tự động bắt được vấn đề 2 và 3 của bài 2.3. Chạy nó trong test trên các cặp response thật (vừa tạo và đã huỷ, phần tử trong danh sách và phần tử đơn) thì một thay đổi hình dạng không thể vô tình lên production nữa.'],
  kn: ['contract testing'],
  tns: [tn('contract test', 'kiểm thử hợp đồng'), tn('shape', 'hình dạng (tập trường và kiểu)')],
  dau: `/** two responses ⇒ { missing, extra, typeChanged } (sorted) */
function shapeDiff(a, b) {
  // Write your solution here
  return { missing: [], extra: Object.keys(b).filter(function (k) { return !(k in a); }), typeChanged: [] };
}
`,
  giai: '// Reference solution\n' + nguon(shapeDiff),
  cases: [
    { goi: goi('shapeDiff', { id: 'bk_1', purpose: null, status: 'PENDING' }, { id: 'bk_1', purpose: null, status: 'CANCELLED', cancelledAt: '2026-10-31T17:42:07.598Z' }), moTa: ['Before the views (lesson 2.3)', 'Trước khi có view (bài 2.3)'] },
    { goi: goi('shapeDiff', { id: 'dev_1', note: null }, { id: 'dev_3', note: 'Thiếu thẻ nhớ' }) },
    { goi: goi('shapeDiff', { capacity: 30, tags: [] }, { capacity: '30', tags: {} }), an: true },
    { goi: goi('shapeDiff', { b: 1, a: 2, c: 3 }, { d: 1, e: 2 }), an: true },
    { goi: goi('shapeDiff', { data: [] }, { data: [{ id: 'lab_1' }], page: { next: null } }), an: true },
    { goi: goi('shapeDiff', { x: true, y: 'a' }, { x: false, y: null }), an: true },
  ],
});

/* ── 4. Mã và body ── */
const BODY = ['the resource or the list (through its view)', 'the created resource + Location header', 'nothing at all', 'a problem document'];
const E4 = cs({
  ten: 'Responses 4 — Status and body must agree', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Match each LabFlow answer to the body it carries after lesson 2.3.',
  vi: 'Ghép mỗi câu trả lời của LabFlow với body nó mang sau bài 2.3.',
  bang: [bang1('b1', ['Status → body', 'Mã → body'], [{ ma: 'x', ten: 'Answer' }, { ma: 'b', ten: 'Body', luaChon: BODY }], [
    { o: { x: '200 OK — GET /labs, POST /bookings/bk_1/cancel' }, a: { b: BODY[0] } },
    { o: { x: '201 Created — POST /bookings' }, a: { b: BODY[1] } },
    { o: { x: '204 No Content — DELETE /devices/dev_2' }, a: { b: BODY[2] } },
    { o: { x: '409 Conflict — overlapping booking' }, a: { b: BODY[3] } },
  ], ['A success body is always a view; 204 sends nothing (not even Content-Type); every 4xx/5xx is an RFC 9457 problem.', 'Body của thành công luôn là view; 204 không gửi gì (kể cả Content-Type); mọi 4xx/5xx là một problem theo RFC 9457.'])],
  goiY: [['204 literally means “no content”.', '204 nghĩa đen là "không có nội dung".'], ['Errors have one shape since lesson 2.1.', 'Lỗi chỉ có một hình dạng từ bài 2.1.']],
  loi: [['Returning {"ok": true} with 200 for a delete.', 'Trả {"ok": true} kèm 200 cho thao tác xoá.'], ['Forgetting Location on 201.', 'Quên Location khi trả 201.']],
  tns: [tn('204 No Content', 'không có nội dung'), tn('Location', 'header chỉ địa chỉ tài nguyên mới')],
  kn: ['status codes'],
});

export default doiDau({ slug: 'api-2-3-envelope', ten: '2.3 Response shapes and envelopes', khoa: KHOA, baiHoc: 'api-2-3-envelope', de: [E1, E2, E3, E4] });
