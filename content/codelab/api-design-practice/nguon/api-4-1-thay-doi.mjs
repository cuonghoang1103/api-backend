/** API Design · 4.1 — Thay đổi phá vỡ và không phá vỡ: thí nghiệm client cũ, bảng phân loại, tự viết bộ so hợp đồng + người đọc khoan dung. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi } from './_api.mjs';

/* ── 1. Thí nghiệm của bài ── */
const E1 = cs({
  ten: 'Changes 1 — What the old client did', kho: 'EASY', phut: 10,
  en: 'Facts from lesson 4.1: client-v1.mjs (never updated) against five server changes, real runs.',
  vi: 'Những điều từ bài 4.1: client-v1.mjs (không bao giờ cập nhật) chạy trên năm thay đổi ở server, chạy thật.',
  cau: [
    q('c1', ['CHANGE=add (new members floor, checkedInAt). client-v1.mjs printed …', 'CHANGE=add (thêm trường floor, checkedInAt). client-v1.mjs in ra …'], ['exactly the baseline output — it never reads the new members', 'an error “unknown member floor”', 'Invalid Date for every booking', 'nothing, because the response was rejected'], ['A client that reads only what it knows is unaffected by additions — the tolerant-reader behaviour.', 'Client chỉ đọc thứ nó biết thì không bị ảnh hưởng bởi trường thêm — đúng hành vi người đọc khoan dung.']),
    q('c2', ['CHANGE=rename (startAt → start). What did users see, and what did the error tracker see?', 'CHANGE=rename (startAt → start). Người dùng thấy gì, hệ thống báo lỗi thấy gì?'], ['Users: Invalid Date–Invalid Date; tracker: nothing, no exception', 'Users: a crash screen; tracker: TypeError', 'Users: the old times from cache; tracker: a warning', 'Users: 400; tracker: VALIDATION_FAILED'], ['new Date(undefined) is an Invalid Date, not an exception — a silent break.', 'new Date(undefined) là Invalid Date chứ không phải ngoại lệ — vỡ lặng lẽ.']),
    q('c3', ['CHANGE=type: capacity became the string "30". The sum of three labs printed …', 'CHANGE=type: capacity thành chuỗi "30". Tổng ba phòng in ra …'], ['0243040', '94', 'NaN', '303030'], ['0 + "24" = "024", then every + concatenates: "0" + "24" + "30" + "40".', '0 + "24" = "024", rồi mọi dấu + đều nối chuỗi: "0" + "24" + "30" + "40".']),
    q('c4', ['client-strict.mjs (strictObject on GET /labs/lab_1) failed with CHANGE=add. What is the lesson?', 'client-strict.mjs (strictObject cho GET /labs/lab_1) hỏng với CHANGE=add. Bài học là gì?'], ['“Adding is non-breaking” holds only if the contract tells clients to ignore unknown members', 'Never add members to an existing API, whatever the docs say', 'Clients should validate every response strictly to be safe', 'The server should send floor only to clients that ask for it'], ['Document the tolerant-reader rule; strict validation belongs on the server’s input.', 'Ghi rõ luật tolerant reader; kiểm chặt thuộc về dữ liệu vào của server.']),
    q('c5', ['Why is changing the default limit from 20 to 10 a breaking change?', 'Vì sao đổi limit mặc định từ 20 xuống 10 là thay đổi phá vỡ?'], ['Clients rely on observable behaviour, documented or not (Hyrum’s law)', 'Because limit is a required parameter', 'Because 10 is below the documented maximum of 100', 'It is not — defaults are never part of a contract'], ['A client that assumed one page of 20 now silently shows half the list.', 'Client vốn coi một trang là 20 giờ lặng lẽ chỉ hiện một nửa danh sách.']),
  ],
  goiY: [['Every answer was printed in lesson 4.1.', 'Mọi đáp án đã được in trong bài 4.1.'], ['Ask: did it throw, or did it show something wrong?', 'Hỏi: nó ném lỗi, hay hiện ra thứ sai?']],
  loi: [['Assuming every break is loud.', 'Cho rằng mọi lần vỡ đều ồn ào.'], ['Treating defaults as free to change.', 'Coi giá trị mặc định là đổi thoải mái.']],
  tns: [tn('silent break', 'vỡ lặng lẽ'), tn('tolerant reader', 'người đọc khoan dung')],
  kn: ['breaking changes'],
});

/* ── 2. Phân loại ── */
const BR = ['breaking', 'non-breaking'];
const E2 = cs({
  ten: 'Changes 2 — Breaking or not?', kho: 'EASY', phut: 8, loai: 'table',
  en: 'Classify each change to LabFlow (clients follow the tolerant-reader rule).',
  vi: 'Phân loại từng thay đổi của LabFlow (client tuân luật tolerant reader).',
  bang: [bang1('b1', ['Change → kind', 'Thay đổi → loại'], [{ ma: 'x', ten: 'Change' }, { ma: 'k', ten: 'Kind', luaChon: BR }], [
    { o: { x: 'Add GET /labs/{id}/schedule' }, a: { k: 'non-breaking' } },
    { o: { x: 'Accept purpose up to 500 characters instead of 200' }, a: { k: 'non-breaking' } },
    { o: { x: 'Return 422 instead of 400 for an invalid time range' }, a: { k: 'breaking' } },
    { o: { x: 'Rename the error code BOOKING_CONFLICT to SLOT_TAKEN' }, a: { k: 'breaking' } },
    { o: { x: 'Make purpose required in POST /bookings' }, a: { k: 'breaking' } },
    { o: { x: 'Add an optional member note to every lab' }, a: { k: 'non-breaking' } },
    { o: { x: 'Send createdAt as Unix seconds instead of ISO 8601' }, a: { k: 'breaking' } },
  ], ['New endpoints, looser input and optional members are additive. Status codes, error codes, required inputs and formats are observable contract.', 'Endpoint mới, nới dữ liệu vào và trường tuỳ chọn là chỉ-thêm. Mã trạng thái, mã lỗi, dữ liệu bắt buộc và định dạng là hợp đồng quan sát được.'])],
  goiY: [['Would a correct existing client stop working correctly?', 'Một client đang đúng có ngừng chạy đúng không?'], ['Clients branch on status and code.', 'Client rẽ nhánh theo status và code.']],
  loi: [['Calling a status-code change “just a fix”.', 'Gọi việc đổi mã trạng thái là “chỉ sửa lỗi”.'], ['Thinking looser validation can break anyone.', 'Nghĩ rằng nới kiểm dữ liệu có thể làm hỏng ai đó.']],
  tns: [tn('additive change', 'thay đổi chỉ-thêm'), tn('contract', 'hợp đồng')],
  kn: ['breaking changes'],
});

/* ── 3. Tự viết: contractDiff ── */
function contractDiff(oldShape, newShape) {
  const out = [];
  for (const k of Object.keys(oldShape).sort()) {
    if (!(k in newShape)) out.push(`removed:${k}`);
    else if (oldShape[k] !== newShape[k]) out.push(`type:${k}:${oldShape[k]}->${newShape[k]}`);
  }
  return out;
}
const V1 = { id: 'string', labId: 'string', startAt: 'string', endAt: 'string', status: 'string', capacity: 'number' };
const E3 = jsBai({
  ten: 'Changes 3 — Write contractDiff(oldShape, newShape): find the breaking parts', kho: 'MEDIUM', phut: 12,
  en: `<p>A shape maps each member of a response to its type, e.g. <code>{ id: 'string', capacity: 'number' }</code>. Under the tolerant-reader rule, <b>added</b> members are safe; what breaks old readers is a member that disappeared or changed type. Return a list, in alphabetical order of the old member names:</p><ul>
<li><code>"removed:&lt;name&gt;"</code> — in the old shape, not in the new one (a rename shows up as a removal)</li>
<li><code>"type:&lt;name&gt;:&lt;old&gt;-&gt;&lt;new&gt;"</code> — in both, different type</li></ul>`,
  vi: `<p>Một hình dạng ánh xạ mỗi trường của response tới kiểu của nó, ví dụ <code>{ id: 'string', capacity: 'number' }</code>. Theo luật tolerant reader, trường <b>thêm</b> là an toàn; thứ làm vỡ người đọc cũ là trường biến mất hoặc đổi kiểu. Trả một danh sách, theo thứ tự chữ cái của tên trường cũ:</p><ul>
<li><code>"removed:&lt;tên&gt;"</code> — có ở hình dạng cũ, không có ở hình dạng mới (đổi tên hiện ra như một lần xoá)</li>
<li><code>"type:&lt;tên&gt;:&lt;cũ&gt;-&gt;&lt;mới&gt;"</code> — có ở cả hai, khác kiểu</li></ul>`,
  dauVao: ['oldShape, newShape — { member: type }', 'oldShape, newShape — { trường: kiểu }'],
  dauRa: ['string[] — empty when nothing breaks', 'mảng chuỗi — rỗng khi không có gì phá vỡ'],
  goiY: [['Loop over the OLD keys only — new keys never break a tolerant reader.', 'Chỉ duyệt các khoá CŨ — khoá mới không bao giờ làm vỡ người đọc khoan dung.'], ['Sort the old keys first, then push in that order.', 'Sắp các khoá cũ trước rồi đẩy theo thứ tự đó.']],
  loi: [['Reporting added members as breaking.', 'Báo trường thêm là phá vỡ.'], ['Missing renames — they look like one removal plus one addition.', 'Bỏ sót đổi tên — nó trông như một lần xoá cộng một lần thêm.']],
  gt: ['This is the automatic version of 4.1’s table for responses: rename ⇒ removed:startAt, removed:endAt; type ⇒ type:capacity:number->string; add ⇒ nothing.', 'Đây là phiên bản tự động của bảng 4.1 cho response: rename ⇒ removed:startAt, removed:endAt; type ⇒ type:capacity:number->string; add ⇒ không có gì.'],
  kn: ['contract testing', 'breaking changes'],
  tns: [tn('shape', 'hình dạng (trường và kiểu)'), tn('rename', 'đổi tên = xoá + thêm')],
  dau: `/** old and new response shapes ⇒ breaking differences */
function contractDiff(oldShape, newShape) {
  // Write your solution here
  return Object.keys(newShape).filter((k) => !(k in oldShape)).map((k) => 'added:' + k);
}
`,
  giai: '// Reference solution\n' + nguon(contractDiff),
  cases: [
    { goi: goi('contractDiff', V1, { ...V1, floor: 'number', checkedInAt: 'null' }), moTa: ['CHANGE=add', 'CHANGE=add'] },
    { goi: goi('contractDiff', V1, { id: 'string', labId: 'string', start: 'string', end: 'string', status: 'string', capacity: 'number' }), moTa: ['CHANGE=rename', 'CHANGE=rename'] },
    { goi: goi('contractDiff', V1, { ...V1, capacity: 'string' }), an: true, moTa: ['CHANGE=type', 'CHANGE=type'] },
    { goi: goi('contractDiff', V1, V1), an: true },
    { goi: goi('contractDiff', { b: 'number', a: 'string', c: 'boolean' }, { c: 'string', d: 'number' }), an: true },
  ],
});

/* ── 4. Tự viết: người đọc khoan dung ── */
function readBooking(b) {
  const LABEL = { PENDING: 'Chờ duyệt', CANCELLED: 'Đã huỷ' };
  const hhmm = (iso) => (typeof iso === 'string' && /T(\d{2}:\d{2})/.test(iso) ? iso.match(/T(\d{2}:\d{2})/)[1] : '—');
  return {
    id: b.id,
    time: `${hhmm(b.startAt)}–${hhmm(b.endAt)}`,
    label: LABEL[b.status] ?? `Trạng thái khác (${b.status})`,
  };
}
const BK = { id: 'bk_8', labId: 'lab_2', startAt: '2026-11-02T04:00:00.000Z', endAt: '2026-11-02T06:00:00.000Z', status: 'PENDING' };
const E4 = jsBai({
  ten: 'Changes 4 — Write readBooking(b): a client that does not break', kho: 'EASY', phut: 10,
  en: `<p>Write the client side the 4.1 app should have had. Return <code>{ id, time, label }</code>:</p><ul>
<li><code>time</code> = <code>"HH:MM–HH:MM"</code> taken from the <code>T..:..</code> part of <code>startAt</code> and <code>endAt</code> (UTC, no conversion); a missing or non-string value becomes <code>"—"</code> instead of <i>Invalid Date</i></li>
<li><code>label</code>: <code>PENDING</code> → <code>"Chờ duyệt"</code>, <code>CANCELLED</code> → <code>"Đã huỷ"</code>, anything else → <code>"Trạng thái khác (&lt;value&gt;)"</code> — never throw</li>
<li>unknown members are ignored</li></ul>`,
  vi: `<p>Viết phần client mà app ở bài 4.1 lẽ ra phải có. Trả <code>{ id, time, label }</code>:</p><ul>
<li><code>time</code> = <code>"HH:MM–HH:MM"</code> lấy từ phần <code>T..:..</code> của <code>startAt</code> và <code>endAt</code> (UTC, không đổi múi giờ); giá trị thiếu hay không phải chuỗi thành <code>"—"</code> thay vì <i>Invalid Date</i></li>
<li><code>label</code>: <code>PENDING</code> → <code>"Chờ duyệt"</code>, <code>CANCELLED</code> → <code>"Đã huỷ"</code>, giá trị khác → <code>"Trạng thái khác (&lt;giá trị&gt;)"</code> — không bao giờ ném lỗi</li>
<li>trường lạ thì bỏ qua</li></ul>`,
  dauVao: ['b — a booking as the server sent it (any version)', 'b — lượt đặt như server gửi (phiên bản nào cũng được)'],
  dauRa: ['{ id, time, label }', '{ id, time, label }'],
  goiY: [['A regular expression /T(\\d{2}:\\d{2})/ finds the time part.', 'Biểu thức chính quy /T(\\d{2}:\\d{2})/ tìm ra phần giờ.'], ['LABEL[s] ?? fallback gives unknown values a label instead of an exception.', 'LABEL[s] ?? phương án dự phòng cho giá trị lạ một nhãn thay vì ngoại lệ.']],
  loi: [['throw on an unknown status — the 4.1 crash.', 'Ném lỗi khi gặp trạng thái lạ — cú sập của 4.1.'], ['new Date(undefined) — prints Invalid Date.', 'new Date(undefined) — in ra Invalid Date.']],
  gt: ['A tolerant reader degrades gracefully: the renamed server shows “—” instead of Invalid Date, CHECKED_IN gets a generic label, extra members are ignored. Exactly how app 1.4.0 in lesson 4.4 survived check-in.', 'Người đọc khoan dung xuống cấp nhẹ nhàng: server đổi tên thì hiện “—” thay vì Invalid Date, CHECKED_IN nhận nhãn chung, trường thừa bị bỏ qua. Đúng cách app 1.4.0 ở bài 4.4 sống sót qua check-in.'],
  kn: ['tolerant reader'],
  tns: [tn('fallback', 'phương án dự phòng'), tn('graceful degradation', 'xuống cấp nhẹ nhàng')],
  dau: `/** server booking ⇒ what the screen shows */
function readBooking(b) {
  // Write your solution here
  const LABEL = { PENDING: 'Chờ duyệt', CANCELLED: 'Đã huỷ' };
  if (!(b.status in LABEL)) throw new Error('trạng thái lạ: ' + b.status);
  return { id: b.id, time: b.startAt.slice(11, 16) + '–' + b.endAt.slice(11, 16), label: LABEL[b.status] };
}
`,
  giai: '// Reference solution\n' + nguon(readBooking),
  cases: [
    { goi: goi('readBooking', BK), moTa: ['A v1 booking', 'Một lượt đặt v1'] },
    { goi: goi('readBooking', { id: 'bk_8', start: BK.startAt, end: BK.endAt, status: 'PENDING' }), moTa: ['CHANGE=rename', 'CHANGE=rename'] },
    { goi: goi('readBooking', { ...BK, status: 'CHECKED_IN', checkedInAt: '2026-10-31T20:05:03.456Z' }), an: true, moTa: ['A new status', 'Một trạng thái mới'] },
    { goi: goi('readBooking', { ...BK, status: 'CANCELLED', floor: 3 }), an: true },
    { goi: goi('readBooking', { id: 'bk_1', startAt: 1793491200, endAt: null, status: 'PENDING' }), an: true },
  ],
});

export default doiDau({ slug: 'api-4-1-thay-doi', ten: '4.1 Breaking vs non-breaking changes', khoa: KHOA, baiHoc: 'api-4-1-thay-doi', de: [E1, E2, E3, E4] });
