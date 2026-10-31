/** API Design · 1.2 — Phương thức và lời hứa: safe/idempotent, PUT vs PATCH, DELETE hai lần, 405 + Allow; tự viết mergePatch (RFC 7396). */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi } from './_api.mjs';

/* ── 1. Bảng lời hứa ── */
const YN = ['yes', 'no'];
const row = (m, s, i) => ({ o: { m }, a: { s, i } });
const M1 = cs({
  ten: 'Methods 1 — Safe and idempotent, per RFC 9110', kho: 'EASY', phut: 8, loai: 'table',
  en: 'Safe = the client does not ask for any change. Idempotent = sending the same request twice leaves the server in the same state as once (the responses may differ). Fill in the table as RFC 9110 §9.2 defines it.',
  vi: 'Safe (an toàn) = client không yêu cầu thay đổi gì. Idempotent (lặp lại an toàn) = gửi cùng một request hai lần để lại trạng thái server như gửi một lần (response có thể khác). Điền bảng đúng như RFC 9110 §9.2 định nghĩa.',
  bang: [bang1('b1', ['Method guarantees', 'Lời hứa của phương thức'], [{ ma: 'm', ten: 'Method' }, { ma: 's', ten: 'Safe?', luaChon: YN }, { ma: 'i', ten: 'Idempotent?', luaChon: YN }], [
    row('GET', 'yes', 'yes'), row('HEAD', 'yes', 'yes'), row('OPTIONS', 'yes', 'yes'), row('POST', 'no', 'no'), row('PUT', 'no', 'yes'), row('PATCH', 'no', 'no'), row('DELETE', 'no', 'yes'),
  ], ['Every safe method is idempotent. PUT and DELETE are idempotent but not safe. POST and PATCH are neither in general — a PATCH like “add 1 to capacity” changes the state again each time. That is why clients and proxies retry GET/PUT/DELETE automatically but never POST.', 'Mọi phương thức an toàn đều idempotent. PUT và DELETE idempotent nhưng không an toàn. POST và PATCH nói chung không phải cả hai — một PATCH kiểu "cộng 1 vào sức chứa" đổi trạng thái thêm mỗi lần. Vì thế client và proxy tự thử lại GET/PUT/DELETE nhưng không bao giờ thử lại POST.'])],
  goiY: [['Idempotent is about the state after the request, not the response.', 'Idempotent nói về trạng thái sau request, không phải response.'], ['RFC 9110 does not promise PATCH is idempotent.', 'RFC 9110 không hứa PATCH idempotent.']],
  loi: [['Saying DELETE is not idempotent because the second call gives 404.', 'Nói DELETE không idempotent vì lần gọi thứ hai trả 404.'], ['Marking PATCH idempotent because JSON Merge Patch with fixed values happens to be.', 'Đánh dấu PATCH idempotent vì JSON Merge Patch với giá trị cố định tình cờ là vậy.']],
  tns: [tn('safe', 'an toàn', 'Không yêu cầu thay đổi trạng thái.'), tn('idempotent', 'lặp lại an toàn', 'Gửi N lần = gửi 1 lần (về trạng thái).')],
  kn: ['HTTP methods'],
});

/* ── 2. Tình huống ── */
const M2 = cs({
  ten: 'Methods 2 — PUT, PATCH, DELETE in real LabFlow runs', kho: 'MEDIUM', phut: 10,
  en: 'Facts measured in lesson 1.2: DELETE /devices/dev_2 ⇒ 204, then again ⇒ 404 DEVICE_NOT_FOUND; PUT /devices/dev_1 with only {"status": "AVAILABLE"} ⇒ 400 with four missing fields; OPTIONS /devices/dev_1 ⇒ 204 with Allow: GET, HEAD, PUT, PATCH, DELETE.',
  vi: 'Sự thật đo trong bài 1.2: DELETE /devices/dev_2 ⇒ 204, gọi lại ⇒ 404 DEVICE_NOT_FOUND; PUT /devices/dev_1 chỉ với {"status": "AVAILABLE"} ⇒ 400 kèm bốn trường thiếu; OPTIONS /devices/dev_1 ⇒ 204 kèm Allow: GET, HEAD, PUT, PATCH, DELETE.',
  cau: [
    q('c1', ['The second DELETE returns 404. Is DELETE still idempotent?', 'Lần DELETE thứ hai trả 404. DELETE vẫn idempotent chứ?'], ['Yes — after one call or two the device is gone; only the response differs', 'No — the response changed, so it is not idempotent', 'Only if the server returns 204 both times', 'No — DELETE is idempotent only in HTTP/2'], ['Idempotency is about the resulting state. Many APIs return 404 the second time; some return 204 again — both are allowed.', 'Idempotent nói về trạng thái kết quả. Nhiều API trả 404 lần hai; có API trả 204 lần nữa — cả hai đều được phép.']),
    q('c2', ['Why does LabFlow’s PUT answer 400 when fields are missing instead of keeping the old values?', 'Vì sao PUT của LabFlow trả 400 khi thiếu trường thay vì giữ giá trị cũ?'], ['PUT means “replace with this”; guessing hides client bugs and blurs it with PATCH', 'Express cannot read a body that has fewer fields than the stored device', 'Missing fields would make the JSON body syntactically invalid', 'RFC 9110 forbids optional fields in any request body sent with PUT'], ['A strict PUT makes the contract clear: send everything, or use PATCH for a partial change.', 'PUT chặt làm hợp đồng rõ ràng: gửi đủ, hoặc dùng PATCH cho thay đổi một phần.']),
    q('c3', ['With JSON Merge Patch, how do you remove the optional field note from a device?', 'Với JSON Merge Patch, làm sao xoá trường tuỳ chọn note khỏi một thiết bị?'], ['PATCH {"note": null}', 'PATCH {"note": ""}', 'PATCH {} — omitted fields are removed', 'DELETE /devices/dev_3/note'], ['RFC 7396: null in the patch means “remove this member”; an omitted member means “leave it unchanged”.', 'RFC 7396: null trong bản vá nghĩa là "xoá trường này"; trường không nhắc tới nghĩa là "giữ nguyên".']),
    q('c4', ['A mobile app on a flaky network sends POST /bookings, gets a timeout, and retries automatically. Risk?', 'App mobile mạng chập chờn gửi POST /bookings, bị timeout rồi tự thử lại. Rủi ro?'], ['Two bookings may be created — POST is not idempotent (Chapter 5 adds idempotency keys)', 'None — HTTP drops duplicate requests', 'The second request always gets 409, so it is harmless', 'The server will merge the two bookings'], ['The first request may have succeeded before the timeout. Without an idempotency key the retry creates another booking (here the overlap check would 409 — but not every POST has one).', 'Request đầu có thể đã thành công trước khi timeout. Không có idempotency key thì lần thử lại tạo thêm booking (ở đây kiểm trùng giờ sẽ 409 — nhưng không phải POST nào cũng có).']),
    q('c5', ['What must a 405 response carry, per RFC 9110 §15.5.6?', 'Theo RFC 9110 §15.5.6, response 405 phải kèm gì?'], ['An Allow header listing the methods the resource supports', 'A Location header pointing to the right URL', 'A Retry-After header', 'A WWW-Authenticate header'], ['The origin server MUST send Allow with 405. LabFlow’s onlyAllow() sets it, and OPTIONS returns 204 with the same Allow (as measured above).', 'Server gốc PHẢI gửi Allow cùng 405. onlyAllow() của LabFlow đặt nó, và OPTIONS trả 204 với cùng Allow (như đã đo ở trên).']),
  ],
  goiY: [['Separate “what the server state is” from “what the response says”.', 'Tách "trạng thái server là gì" khỏi "response nói gì".'], ['null and “absent” mean different things in a merge patch.', 'null và "vắng mặt" có nghĩa khác nhau trong merge patch.']],
  loi: [['Sending "" to clear a field — it sets an empty string.', 'Gửi "" để xoá trường — nó đặt chuỗi rỗng.'], ['Retrying POST automatically like GET.', 'Tự thử lại POST như GET.']],
  tns: [tn('JSON Merge Patch', 'bản vá gộp JSON', 'RFC 7396, Content-Type application/merge-patch+json.'), tn('Allow header', 'header Allow')],
  kn: ['PUT vs PATCH', 'idempotency'],
});

/* ── 3. Tự viết: mergePatch ── */
function mergePatch(target, patch) {
  if (patch === null || typeof patch !== 'object' || Array.isArray(patch)) return patch; // not an object ⇒ replace
  var base = target !== null && typeof target === 'object' && !Array.isArray(target) ? target : {};
  var out = {};
  Object.keys(base).forEach(function (k) { out[k] = base[k]; });
  Object.keys(patch).forEach(function (k) {
    if (patch[k] === null) delete out[k];             // null ⇒ remove the member
    else out[k] = mergePatch(out[k], patch[k]);       // recurse into objects
  });
  return out;
}
const DEV3 = { id: 'dev_3', labId: 'lab_2', name: 'Raspberry Pi 5', type: 'BOARD', serialNo: 'RPI5-00421', status: 'AVAILABLE', note: 'Thiếu thẻ nhớ' };
const M3 = jsBai({
  ten: 'Methods 3 — Write mergePatch(target, patch): RFC 7396', kho: 'HARD', phut: 20,
  en: `<p>LabFlow’s PATCH uses JSON Merge Patch (RFC 7396). Write <code>mergePatch(target, patch)</code> that returns the NEW document, following the algorithm of RFC 7396 §2:</p><ul>
<li>If <code>patch</code> is not a plain object (a string, number, boolean, <code>null</code> or an <b>array</b>) ⇒ the result is <code>patch</code> itself.</li>
<li>Otherwise start from a copy of <code>target</code> (or <code>{}</code> if <code>target</code> is not a plain object). For each member of the patch: value <code>null</code> ⇒ remove that member; any other value ⇒ set it to <code>mergePatch(old value, value)</code>.</li>
<li>Arrays are replaced as a whole, never merged. Do not modify <code>target</code> or <code>patch</code>.</li></ul>`,
  vi: `<p>PATCH của LabFlow dùng JSON Merge Patch (RFC 7396). Viết <code>mergePatch(target, patch)</code> trả về tài liệu MỚI, theo thuật toán ở RFC 7396 §2:</p><ul>
<li>Nếu <code>patch</code> không phải object thường (chuỗi, số, boolean, <code>null</code> hoặc <b>mảng</b>) ⇒ kết quả là chính <code>patch</code>.</li>
<li>Ngược lại, bắt đầu từ bản sao của <code>target</code> (hoặc <code>{}</code> nếu <code>target</code> không phải object thường). Với mỗi trường của bản vá: giá trị <code>null</code> ⇒ xoá trường đó; giá trị khác ⇒ đặt bằng <code>mergePatch(giá trị cũ, giá trị mới)</code>.</li>
<li>Mảng bị thay nguyên, không bao giờ gộp. Không sửa <code>target</code> hay <code>patch</code>.</li></ul>`,
  dauVao: ['target, patch — any JSON values.', 'target, patch — giá trị JSON bất kỳ.'],
  dauRa: ['The patched JSON value.', 'Giá trị JSON sau khi vá.'],
  goiY: [['Write it recursively — it is almost a line-by-line copy of the RFC’s pseudo-code.', 'Viết đệ quy — gần như chép từng dòng mã giả trong RFC.'], ['Array.isArray must be checked before typeof === "object".', 'Phải kiểm Array.isArray trước typeof === "object".']],
  loi: [['Object.assign({}, target, patch) — shallow, and it stores null instead of removing.', 'Object.assign({}, target, patch) — nông, và lưu null thay vì xoá.'], ['Merging arrays element by element: RFC 7396 replaces them.', 'Gộp mảng từng phần tử: RFC 7396 thay nguyên mảng.']],
  gt: ['RFC 7396 trades power for simplicity: you cannot set a member to null or edit one array element (JSON Patch, RFC 6902, can), but a client just sends the fields it wants changed. Applying the patch to a copy also makes PATCH easy to validate before anything is saved.', 'RFC 7396 đổi sức mạnh lấy sự đơn giản: không đặt được một trường thành null hay sửa một phần tử mảng (JSON Patch, RFC 6902, làm được), nhưng client chỉ cần gửi các trường muốn đổi. Vá trên bản sao còn giúp kiểm hợp lệ trước khi lưu bất cứ thứ gì.'],
  kn: ['JSON Merge Patch', 'recursion'],
  tns: [tn('recursive', 'đệ quy'), tn('shallow copy', 'sao chép nông')],
  dau: `/** RFC 7396: mergePatch(target, patch) ⇒ new document */
function mergePatch(target, patch) {
  // Write your solution here
  return Object.assign({}, target, patch);
}
`,
  giai: '// Reference solution\n' + nguon(mergePatch),
  cases: [
    { goi: goi('mergePatch', DEV3, { status: 'MAINTENANCE' }), moTa: ['Change one field of dev_3', 'Đổi một trường của dev_3'] },
    { goi: goi('mergePatch', DEV3, { note: null }), moTa: ['null removes note', 'null xoá note'] },
    { goi: goi('mergePatch', { a: 'b', c: { d: 'e', f: 'g' } }, { a: 'z', c: { f: null } }) },
    { goi: goi('mergePatch', { a: [{ b: 'c' }] }, { a: [1] }), an: true },
    { goi: goi('mergePatch', { e: null }, { a: 1 }), an: true },
    { goi: goi('mergePatch', ['a', 'b'], ['c', 'd']), an: true },
    { goi: goi('mergePatch', { a: 'b' }, ['c']), an: true },
    { goi: goi('mergePatch', { a: 'foo' }, null), an: true },
    { goi: goi('mergePatch', [1, 2], { a: 'b', c: null }), an: true },
    { goi: goi('mergePatch', {}, { a: { bb: { ccc: null } } }), an: true },
    { goi: goi('mergePatch', { title: 'Hello!', author: { givenName: 'John', familyName: 'Doe' }, tags: ['example', 'sample'], content: 'This will be unchanged' }, { title: 'Hello!', phoneNumber: '+01-123-456-7890', author: { familyName: null }, tags: ['example'] }), an: true },
    { goi: `(function () { var t = { a: { b: 1 } }; var p = { a: { b: null } }; mergePatch(t, p); return [t, p]; })()`, an: true, moTa: ['Arguments are not modified', 'Không sửa đối số'] },
  ],
});

export default doiDau({ slug: 'api-1-2-phuong-thuc', ten: '1.2 Methods and their guarantees', khoa: KHOA, baiHoc: 'api-1-2-phuong-thuc', de: [M1, M2, M3] });
