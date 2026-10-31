/** API Design · 1.3 — Mã trạng thái: tình huống ⇒ mã, 400 vs 422 vs 409, 401 vs 403; tự viết overlaps + validateBooking theo đúng thứ tự LabFlow. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi } from './_api.mjs';

/* ── 1. Tình huống ⇒ mã ── */
const MA = ['200', '201', '204', '400', '401', '403', '404', '405', '409', '410', '422'];
const S1 = cs({
  ten: 'Status 1 — Situation to status code (real LabFlow runs)', kho: 'EASY', phut: 10, loai: 'table',
  en: 'Every row is a request that was really sent to LabFlow in lesson 1.3. Choose the status code it returned.',
  vi: 'Mỗi dòng là một request đã thật sự gửi tới LabFlow trong bài 1.3. Chọn mã trạng thái nó trả về.',
  bang: [bang1('b1', ['What LabFlow answered', 'LabFlow đã trả lời gì'], [{ ma: 'x', ten: 'Request / situation' }, { ma: 'c', ten: 'Status', luaChon: MA }], [
    { o: { x: 'POST /bookings with no Authorization header' }, a: { c: '401' } },
    { o: { x: 'POST /bookings, valid token, new booking stored (Location: /bookings/bk_1)' }, a: { c: '201' } },
    { o: { x: 'POST /bookings with body {"labId": "lab_1",} (trailing comma)' }, a: { c: '400' } },
    { o: { x: 'POST /bookings with startAt "02/11/2026 8:00"' }, a: { c: '400' } },
    { o: { x: 'POST /bookings with endAt before startAt' }, a: { c: '422' } },
    { o: { x: 'POST /bookings for lab_1 at a time already booked' }, a: { c: '409' } },
    { o: { x: 'Bình (tok_bin) reads An’s booking GET /bookings/bk_1' }, a: { c: '403' } },
    { o: { x: 'GET /labs/lab_4 — a lab retired since 2026-09-01' }, a: { c: '410' } },
    { o: { x: 'GET /labs/lab_9 — never existed' }, a: { c: '404' } },
    { o: { x: 'DELETE /labs/lab_1 — the route exists, the method does not' }, a: { c: '405' } },
    { o: { x: 'DELETE /devices/dev_2 succeeded, nothing to return' }, a: { c: '204' } },
  ], ['400 = the request cannot be read as intended (syntax, shape); 422 = well-formed but meaningless for the business; 409 = valid but clashes with the current state. 401 = who are you?; 403 = I know you, and no. 404 = no such thing; 410 = it existed and is gone for good.', '400 = không đọc được request như ý (cú pháp, hình dạng); 422 = đúng hình dạng nhưng vô nghĩa với nghiệp vụ; 409 = hợp lệ nhưng đụng trạng thái hiện tại. 401 = bạn là ai?; 403 = biết bạn rồi, và không. 404 = không có; 410 = từng có và đã mất hẳn.'])],
  goiY: [['Ask in order: can I read it? do I know who you are? may you? does it exist? does it make sense? does it clash?', 'Hỏi theo thứ tự: đọc được không? biết bạn là ai không? bạn có được phép? nó có tồn tại? có hợp lý? có đụng độ?'], ['201 always comes with a Location header pointing to the new resource.', '201 luôn đi kèm header Location trỏ tới tài nguyên mới.']],
  loi: [['401 for “not your booking” — the user is authenticated, so it is 403.', '401 cho "không phải booking của bạn" — người dùng đã xác thực, nên là 403.'], ['400 for end-before-start: the JSON is well-formed, the meaning is wrong (422).', '400 cho kết thúc trước bắt đầu: JSON đúng dạng, ý nghĩa mới sai (422).']],
  tns: [tn('401 Unauthorized', 'chưa xác thực'), tn('403 Forbidden', 'không có quyền'), tn('422 Unprocessable Content', 'không xử lý được nội dung'), tn('410 Gone', 'đã mất hẳn')],
  kn: ['status codes'],
});

/* ── 2. Tình huống khó ── */
const S2 = cs({
  ten: 'Status 2 — The hard calls', kho: 'MEDIUM', phut: 10,
  en: 'Design questions where two codes both look plausible.',
  vi: 'Những câu hỏi thiết kế mà hai mã đều có vẻ hợp lý.',
  cau: [
    q('c1', ['A student asks for another student’s booking. Some APIs answer 404 instead of 403. Why?', 'Một sinh viên hỏi booking của người khác. Có API trả 404 thay vì 403. Vì sao?'], ['403 confirms the booking exists; 404 hides even that from someone who may not know', 'Because 403 is deprecated in RFC 9110', 'Because 404 is cached and 403 is not', 'Because 403 requires a WWW-Authenticate header'], ['RFC 9110 allows an origin server to answer 404 to hide a forbidden resource. LabFlow answers 403 because booking ids are not secret — a documented choice.', 'RFC 9110 cho phép server trả 404 để giấu một tài nguyên bị cấm. LabFlow trả 403 vì id booking không bí mật — một lựa chọn có ghi rõ.']),
    q('c2', ['Why does a 401 from LabFlow carry WWW-Authenticate: Bearer realm="labflow"?', 'Vì sao 401 của LabFlow kèm WWW-Authenticate: Bearer realm="labflow"?'], ['RFC 9110 requires it: it tells the client which scheme to use', 'It makes browsers show a login page for JSON APIs', 'It is only for debugging and may be removed', 'It carries the correct token back to the client'], ['A server generating 401 MUST send WWW-Authenticate with at least one challenge (RFC 9110 §15.5.2).', 'Server tạo 401 PHẢI gửi WWW-Authenticate với ít nhất một thách thức (RFC 9110 §15.5.2).']),
    q('c3', ['In lesson 1.3 a route crashed in an app WITHOUT our error handler. Express 5 answered …', 'Trong bài 1.3, một route bị crash trong app KHÔNG có bộ xử lý lỗi của ta. Express 5 trả về …'], ['500 as text/html with the whole stack trace and server file paths — a leak, and not JSON', '500 JSON {"error": "INTERNAL"} automatically', '400, because the client caused the crash', 'nothing — the process exited and the connection was reset'], ['That is the real output (Content-Type: text/html, Content-Length: 2066, “TypeError … at file:///…”). LabFlow’s four-argument handler answers 500 JSON INTERNAL with a generic message and keeps the stack in the server log.', 'Đó là output thật (Content-Type: text/html, Content-Length: 2066, "TypeError … at file:///…"). Bộ xử lý bốn tham số của LabFlow trả 500 JSON INTERNAL với câu chung chung và giữ stack trong log server.']),
    q('c4', ['Cancelling a booking that is already cancelled should return …', 'Huỷ một booking đã huỷ rồi nên trả về …'], ['409 ALREADY_CANCELLED — the request is valid, the current state prevents it', '404, because the booking no longer exists', '422, because the JSON is wrong', '204, because DELETE-like actions are idempotent'], ['The booking still exists (history), the action is valid in general, but not in this state: 409 Conflict.', 'Booking vẫn tồn tại (lịch sử), hành động hợp lệ nói chung, nhưng không ở trạng thái này: 409 Conflict.']),
  ],
  goiY: [['Ask what the status code tells the CLIENT to do next.', 'Hỏi mã trạng thái bảo CLIENT làm gì tiếp theo.'], ['4xx = change your request; 5xx = not your fault.', '4xx = sửa request; 5xx = không phải lỗi của bạn.']],
  loi: [['Returning stack traces “to help debugging”.', 'Trả stack trace "để dễ gỡ lỗi".'], ['Using 404 for an existing resource in the wrong state.', 'Dùng 404 cho tài nguyên có tồn tại nhưng sai trạng thái.']],
  tns: [tn('challenge', 'thách thức xác thực'), tn('information leak', 'lộ thông tin')],
  kn: ['status codes'],
});

/* ── 3. Tự viết: overlaps ── */
function overlaps(a, b) {
  var as = Date.parse(a.startAt), ae = Date.parse(a.endAt);
  var bs = Date.parse(b.startAt), be = Date.parse(b.endAt);
  return as < be && bs < ae;   // half-open [start, end): touching ends do not overlap
}
const S3 = jsBai({
  ten: 'Status 3 — Write overlaps(a, b): the 409 rule', kho: 'MEDIUM', phut: 10,
  en: `<p>LabFlow answers 409 when a new booking overlaps an existing one. Write <code>overlaps(a, b)</code> for two bookings <code>{ startAt, endAt }</code> (ISO 8601 strings <b>with offsets</b>, possibly different ones). Intervals are <b>half-open</b>: a booking 08:00–10:00 and another 10:00–12:00 do NOT overlap — the room is free at exactly 10:00.</p>`,
  vi: `<p>LabFlow trả 409 khi một booking mới chồng lên booking có sẵn. Viết <code>overlaps(a, b)</code> cho hai booking <code>{ startAt, endAt }</code> (chuỗi ISO 8601 <b>có độ lệch</b>, có thể khác nhau). Khoảng thời gian là <b>nửa mở</b>: booking 08:00–10:00 và booking 10:00–12:00 KHÔNG chồng nhau — đúng 10:00 phòng đã trống.</p>`,
  dauVao: ['a, b — { startAt, endAt } with start < end.', 'a, b — { startAt, endAt } với start < end.'],
  dauRa: ['true / false', 'true / false'],
  goiY: [['Compare instants, not strings: "08:00+07:00" and "01:00Z" are the same moment.', 'So thời điểm, không so chuỗi: "08:00+07:00" và "01:00Z" là cùng một lúc.'], ['Two intervals overlap exactly when each starts before the other ends.', 'Hai khoảng chồng nhau khi và chỉ khi mỗi khoảng bắt đầu trước khi khoảng kia kết thúc.']],
  loi: [['Using <= — back-to-back bookings would be refused.', 'Dùng <= — các booking nối tiếp nhau sẽ bị từ chối.'], ['Only checking whether a’s start lies inside b — misses a booking that covers b entirely.', 'Chỉ kiểm điểm đầu của a có nằm trong b — bỏ sót booking bao trùm b.']],
  gt: ['as < be && bs < ae covers every case (partial, inside, covering) in one line. Date.parse turns each string with an offset into milliseconds since 1970 UTC, so mixed offsets compare correctly.', 'as < be && bs < ae phủ mọi trường hợp (chồng một phần, nằm trong, bao trùm) trong một dòng. Date.parse đổi mỗi chuỗi có độ lệch thành mili giây từ 1970 UTC, nên độ lệch khác nhau vẫn so đúng.'],
  kn: ['time intervals'],
  tns: [tn('half-open interval', 'khoảng nửa mở', '[bắt đầu, kết thúc): gồm điểm đầu, không gồm điểm cuối.')],
  dau: `/** a, b: { startAt, endAt } ⇒ do they overlap? (half-open) */
function overlaps(a, b) {
  // Write your solution here
  return a.startAt >= b.startAt && a.startAt <= b.endAt;
}
`,
  giai: '// Reference solution\n' + nguon(overlaps),
  cases: [
    { goi: goi('overlaps', { startAt: '2026-11-02T08:00:00+07:00', endAt: '2026-11-02T10:00:00+07:00' }, { startAt: '2026-11-02T09:00:00+07:00', endAt: '2026-11-02T11:00:00+07:00' }) },
    { goi: goi('overlaps', { startAt: '2026-11-02T08:00:00+07:00', endAt: '2026-11-02T10:00:00+07:00' }, { startAt: '2026-11-02T10:00:00+07:00', endAt: '2026-11-02T12:00:00+07:00' }) },
    { goi: goi('overlaps', { startAt: '2026-11-02T07:00:00+07:00', endAt: '2026-11-02T12:00:00+07:00' }, { startAt: '2026-11-02T08:00:00+07:00', endAt: '2026-11-02T10:00:00+07:00' }), an: true },
    { goi: goi('overlaps', { startAt: '2026-11-02T01:30:00Z', endAt: '2026-11-02T02:00:00Z' }, { startAt: '2026-11-02T08:00:00+07:00', endAt: '2026-11-02T10:00:00+07:00' }), an: true },
    { goi: goi('overlaps', { startAt: '2026-11-02T03:00:00Z', endAt: '2026-11-02T04:00:00Z' }, { startAt: '2026-11-02T08:00:00+07:00', endAt: '2026-11-02T10:00:00+07:00' }), an: true },
    { goi: goi('overlaps', { startAt: '2026-11-02T10:00:00+07:00', endAt: '2026-11-02T12:00:00+07:00' }, { startAt: '2026-11-02T08:00:00+07:00', endAt: '2026-11-02T10:00:00+07:00' }), an: true },
    { goi: goi('overlaps', { startAt: '2026-11-02T08:30:00+07:00', endAt: '2026-11-02T09:00:00+07:00' }, { startAt: '2026-11-02T08:00:00+07:00', endAt: '2026-11-02T10:00:00+07:00' }), an: true },
  ],
});

/* ── 4. Tự viết: validateBooking ── */
function validateBooking(body, labs, bookings) {
  var ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/;
  var b = body || {};
  // 1) shape ⇒ 400, every field at once
  var details = [];
  if (typeof b.labId !== 'string') details.push({ field: 'labId', issue: 'required' });
  if (!ISO.test(b.startAt || '')) details.push({ field: 'startAt', issue: 'must be ISO 8601 with timezone' });
  if (!ISO.test(b.endAt || '')) details.push({ field: 'endAt', issue: 'must be ISO 8601 with timezone' });
  if (details.length) return { status: 400, error: 'VALIDATION_FAILED', details: details };
  // 2) meaning ⇒ 422
  var start = Date.parse(b.startAt), end = Date.parse(b.endAt);
  if (end <= start) return { status: 422, error: 'INVALID_TIME_RANGE' };
  var lab = labs.find(function (l) { return l.id === b.labId && !l.retiredAt; });
  if (!lab) return { status: 422, error: 'UNKNOWN_LAB' };
  // 3) current state ⇒ 409
  var clash = bookings.find(function (x) {
    return x.labId === b.labId && x.status !== 'CANCELLED' && start < Date.parse(x.endAt) && Date.parse(x.startAt) < end;
  });
  if (clash) return { status: 409, error: 'BOOKING_CONFLICT', conflictWith: clash.id };
  return { status: 201 };
}
const LABS = [{ id: 'lab_1', building: 'Alpha' }, { id: 'lab_2', building: 'Alpha' }, { id: 'lab_4', building: 'Beta', retiredAt: '2026-09-01T00:00:00.000Z' }];
const BK = [
  { id: 'bk_1', labId: 'lab_1', startAt: '2026-11-02T01:00:00.000Z', endAt: '2026-11-02T03:00:00.000Z', status: 'PENDING' },
  { id: 'bk_2', labId: 'lab_1', startAt: '2026-11-02T05:00:00.000Z', endAt: '2026-11-02T07:00:00.000Z', status: 'CANCELLED' },
];
const ok = { labId: 'lab_1', startAt: '2026-11-02T10:00:00+07:00', endAt: '2026-11-02T11:00:00+07:00' };
const S4 = jsBai({
  ten: 'Status 4 — Write validateBooking(): 400, then 422, then 409', kho: 'HARD', phut: 25,
  en: `<p>Re-create the decision of <code>POST /bookings</code> from lesson 1.3 as a pure function <code>validateBooking(body, labs, bookings)</code>. Checks run in this order and the first failing step decides:</p><ol>
<li><b>Shape ⇒ 400</b> <code>{ status: 400, error: 'VALIDATION_FAILED', details }</code>, listing EVERY bad field in the order labId, startAt, endAt: <code>labId</code> not a string ⇒ <code>{ field: 'labId', issue: 'required' }</code>; <code>startAt</code>/<code>endAt</code> not matching<br><code>/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}(:\\d{2}(\\.\\d{1,3})?)?(Z|[+-]\\d{2}:\\d{2})$/</code> ⇒ <code>issue: 'must be ISO 8601 with timezone'</code>. A missing body counts as <code>{}</code>.</li>
<li><b>Meaning ⇒ 422</b>: end not after start ⇒ <code>{ status: 422, error: 'INVALID_TIME_RANGE' }</code>; then a lab that does not exist or has <code>retiredAt</code> ⇒ <code>{ status: 422, error: 'UNKNOWN_LAB' }</code>.</li>
<li><b>State ⇒ 409</b>: the first booking of the same lab, not <code>CANCELLED</code>, that overlaps (half-open) ⇒ <code>{ status: 409, error: 'BOOKING_CONFLICT', conflictWith: id }</code>.</li>
<li>Otherwise <code>{ status: 201 }</code>.</li></ol>`,
  vi: `<p>Dựng lại quyết định của <code>POST /bookings</code> trong bài 1.3 thành hàm thuần <code>validateBooking(body, labs, bookings)</code>. Các bước kiểm chạy theo thứ tự này và bước đầu tiên trượt quyết định kết quả:</p><ol>
<li><b>Hình dạng ⇒ 400</b> <code>{ status: 400, error: 'VALIDATION_FAILED', details }</code>, liệt kê MỌI trường sai theo thứ tự labId, startAt, endAt: <code>labId</code> không phải chuỗi ⇒ <code>{ field: 'labId', issue: 'required' }</code>; <code>startAt</code>/<code>endAt</code> không khớp<br><code>/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}(:\\d{2}(\\.\\d{1,3})?)?(Z|[+-]\\d{2}:\\d{2})$/</code> ⇒ <code>issue: 'must be ISO 8601 with timezone'</code>. Không có body thì coi như <code>{}</code>.</li>
<li><b>Ý nghĩa ⇒ 422</b>: kết thúc không sau bắt đầu ⇒ <code>{ status: 422, error: 'INVALID_TIME_RANGE' }</code>; rồi phòng không tồn tại hoặc có <code>retiredAt</code> ⇒ <code>{ status: 422, error: 'UNKNOWN_LAB' }</code>.</li>
<li><b>Trạng thái ⇒ 409</b>: booking đầu tiên cùng phòng, không <code>CANCELLED</code>, chồng giờ (nửa mở) ⇒ <code>{ status: 409, error: 'BOOKING_CONFLICT', conflictWith: id }</code>.</li>
<li>Còn lại <code>{ status: 201 }</code>.</li></ol>`,
  dauVao: ['body — the request JSON (may be undefined); labs; bookings (times stored in UTC).', 'body — JSON của request (có thể undefined); labs; bookings (giờ lưu bằng UTC).'],
  dauRa: ['{ status, error?, details?, conflictWith? }', '{ status, error?, details?, conflictWith? }'],
  goiY: [['Return as soon as a step fails — but inside step 1 collect all fields before returning.', 'Trả về ngay khi một bước trượt — nhưng trong bước 1 phải gom đủ mọi trường rồi mới trả.'], ['Cancelled bookings free the room: skip them in the overlap search.', 'Booking đã huỷ trả phòng lại: bỏ qua chúng khi tìm chồng giờ.']],
  loi: [['Stopping at the first bad field — the client then fixes one error per round trip.', 'Dừng ở trường sai đầu tiên — client phải sửa từng lỗi một qua mỗi lượt gọi.'], ['Checking the lab before the time range: the order in the spec is part of the contract.', 'Kiểm phòng trước khoảng giờ: thứ tự trong đặc tả là một phần hợp đồng.']],
  gt: ['The order mirrors cost and meaning: first “can I even read this?” (cheap, no database), then “does it make sense?”, and only then the query against existing bookings. Reporting all shape errors at once saves the client round trips; Chapter 2 turns this result into an RFC 9457 problem document.', 'Thứ tự đi theo chi phí và ý nghĩa: trước là "đọc được không?" (rẻ, không cần cơ sở dữ liệu), rồi "có hợp lý không?", và chỉ sau đó mới truy vấn các booking có sẵn. Báo mọi lỗi hình dạng một lần giúp client bớt lượt gọi; Chương 2 biến kết quả này thành tài liệu lỗi RFC 9457.'],
  kn: ['validation order', '400 vs 422 vs 409'],
  tns: [tn('validation', 'kiểm tra dữ liệu'), tn('round trip', 'một lượt gọi đi-về')],
  dau: `/** body, labs, bookings ⇒ { status, error?, details?, conflictWith? } */
function validateBooking(body, labs, bookings) {
  // Write your solution here
  if (!body.labId) return { status: 400, error: 'VALIDATION_FAILED', details: [{ field: 'labId', issue: 'required' }] };
  return { status: 201 };
}
`,
  giai: '// Reference solution\n' + nguon(validateBooking),
  cases: [
    { goi: goi('validateBooking', ok, LABS, BK), moTa: ['A free slot ⇒ 201', 'Khung giờ trống ⇒ 201'] },
    { goi: goi('validateBooking', { labId: 'lab_1', startAt: '02/11/2026 8:00' }, LABS, BK), moTa: ['The real 400 of lesson 1.3', '400 thật của bài 1.3'] },
    { goi: goi('validateBooking', { labId: 'lab_1', startAt: '2026-11-02T08:00:00+07:00', endAt: '2026-11-02T10:00:00+07:00' }, LABS, BK), moTa: ['Same slot as bk_1 ⇒ 409', 'Trùng giờ bk_1 ⇒ 409'] },
    { goi: goi('validateBooking', { labId: 'lab_1', startAt: '2026-11-02T10:00:00+07:00', endAt: '2026-11-02T08:00:00+07:00' }, LABS, BK), an: true },
    { goi: goi('validateBooking', { labId: 'lab_4', startAt: '2026-11-02T08:00:00+07:00', endAt: '2026-11-02T10:00:00+07:00' }, LABS, BK), an: true },
    { goi: goi('validateBooking', { labId: 'lab_9', startAt: '2026-11-02T10:00:00+07:00', endAt: '2026-11-02T08:00:00+07:00' }, LABS, BK), an: true },
    { goi: `validateBooking(undefined, ${JSON.stringify(LABS)}, ${JSON.stringify(BK)})`, an: true, moTa: ['No body at all', 'Không có body'] },
    { goi: goi('validateBooking', { labId: 7, startAt: '2026-11-02T08:00:00', endAt: '2026-11-02T10:00:00Z' }, LABS, BK), an: true },
    { goi: goi('validateBooking', { labId: 'lab_1', startAt: '2026-11-02T12:00:00+07:00', endAt: '2026-11-02T13:00:00+07:00' }, LABS, BK), an: true, moTa: ['Overlaps only a CANCELLED booking ⇒ 201', 'Chỉ chồng booking đã huỷ ⇒ 201'] },
    { goi: goi('validateBooking', { labId: 'lab_1', startAt: '2026-11-02T03:00:00Z', endAt: '2026-11-02T04:00:00Z' }, LABS, BK), an: true },
    { goi: goi('validateBooking', { labId: 'lab_2', startAt: '2026-11-02T08:00:00+07:00', endAt: '2026-11-02T10:00:00+07:00' }, LABS, BK), an: true },
  ],
});

export default doiDau({ slug: 'api-1-3-status', ten: '1.3 Status codes that tell the truth', khoa: KHOA, baiHoc: 'api-1-3-status', de: [S1, S2, S3, S4] });
