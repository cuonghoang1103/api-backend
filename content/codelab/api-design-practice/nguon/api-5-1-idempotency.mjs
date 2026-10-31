/** API Design · 5.1 — Idempotency key: mất response, phát lại, mã lỗi theo draft-08; tự viết bộ quyết định của middleware. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Idempotency 1 — The lost response', kho: 'EASY', phut: 10,
  en: 'Facts from lesson 5.1 (LabFlow with LABFLOW_DROP_FIRST=1, real runs).',
  vi: 'Những điều từ bài 5.1 (LabFlow với LABFLOW_DROP_FIRST=1, chạy thật).',
  cau: [
    q('c1', ['curl printed “(52) Empty reply from server” for the first POST. Was the booking created?', 'curl in “(52) Empty reply from server” cho POST đầu. Lượt đặt đã được tạo chưa?'], ['Yes — the server finished the work and then cut the connection (bk_9 existed)', 'No — without a 201 nothing can have been created', 'Only half of it, the database was rolled back', 'It depends on the Content-Type of the request'], ['A missing response tells you nothing about the work. The list showed bk_9.', 'Không có response thì chẳng biết gì về việc đã làm. Danh sách cho thấy bk_9.']),
    q('c2', ['Why must the key be scoped to the caller (usr_1:&lt;key&gt;)?', 'Vì sao khoá phải gắn với người gọi (usr_1:&lt;khoá&gt;)?'], ['So two users can never collide or read each other’s stored results', 'Because keys must be shorter than 255 characters', 'So the server can rate-limit keys', 'Because UUIDs are not unique enough'], ['Without the scope, Bin sending An’s key would receive An’s booking as a replay.', 'Không có phạm vi, Bin gửi khoá của An sẽ nhận lượt đặt của An dưới dạng phát lại.']),
    q('c3', ['Why does LabFlow record the result when the connection CLOSES?', 'Vì sao LabFlow ghi kết quả khi kết nối ĐÓNG?'], ['Because the lost-response case — client already gone — is exactly the one to remember', 'Because Express does not allow writing before close', 'To make the response faster', 'Because JSON can only be hashed after sending'], ['res.json captures the answer; close fires even when the socket was destroyed, so the next retry is a replay.', 'res.json bắt câu trả lời; sự kiện close vẫn xảy ra kể cả khi socket bị huỷ, nên lần thử sau là phát lại.']),
    q('c4', ['Two requests with the same key arrive 0.3 s apart while the first is still running. The second gets …', 'Hai request cùng khoá tới cách nhau 0,3 s khi request đầu còn chạy. Request thứ hai nhận …'], ['409 IDEMPOTENCY_IN_PROGRESS with Retry-After: 1', '201 — both requests simply run in parallel', '422 IDEMPOTENCY_KEY_REUSED for a second use', '429 Too Many Requests from the limiter'], ['Draft-08 recommends 409 for a request with the same key still in progress; LabFlow adds Retry-After so 5.2’s client knows when to come back.', 'Draft-08 khuyên 409 cho request cùng khoá còn đang chạy; LabFlow thêm Retry-After để client của bài 5.2 biết lúc nào quay lại.']),
  ],
  goiY: [['Every answer was printed in lesson 5.1.', 'Mọi đáp án đã được in trong bài 5.1.'], ['Think about what the client can and cannot know.', 'Nghĩ xem client biết được và không biết được gì.']],
  loi: [['Assuming “no answer” means “not done”.', 'Cho rằng “không có câu trả lời” nghĩa là “chưa làm”.'], ['Sharing keys between users.', 'Dùng chung khoá giữa các người dùng.']],
  tns: [tn('lost response', 'mất response'), tn('replay', 'phát lại')],
  kn: ['idempotency'],
});

function decide(store, caller, key, fp, nowMs) {
  if (key === undefined) return { action: 'execute' };
  if (!/^"?[\x21\x23-\x7e]{1,255}"?$/.test(key)) return { action: 'reject', status: 400 };
  const k = `${caller}:${key.replace(/^"|"$/g, '')}`;
  const e = store[k];
  if (!e || nowMs - e.at > 24 * 3600 * 1000) return { action: 'execute', storeKey: k };
  if (e.fp !== fp) return { action: 'reject', status: 422 };
  if (e.state === 'running') return { action: 'reject', status: 409 };
  return { action: 'replay', status: e.status };
}
const H = 3600 * 1000;
const ST = { 'usr_1:k1': { fp: 'aaa', state: 'done', status: 201, at: 0 }, 'usr_2:k2': { fp: 'bbb', state: 'running', at: 0 } };
const E2 = jsBai({
  ten: 'Idempotency 2 — Write decide(store, caller, key, fp, nowMs)', kho: 'MEDIUM', phut: 15,
  en: `<p>The decision at the top of LabFlow’s <code>idempotent()</code>. <code>store</code> maps <code>"caller:key"</code> to <code>{ fp, state: 'running' | 'done', status, at }</code> (<code>at</code> in ms). Return:</p><ul>
<li>no key (<code>undefined</code>) ⇒ <code>{ action: 'execute' }</code></li>
<li>key not 1–255 printable characters without spaces (surrounding double quotes allowed) ⇒ <code>{ action: 'reject', status: 400 }</code></li>
<li>no entry, or entry older than 24 h ⇒ <code>{ action: 'execute', storeKey: "caller:key" }</code> (key without quotes)</li>
<li>different fingerprint ⇒ reject 422; still running ⇒ reject 409; otherwise <code>{ action: 'replay', status }</code></li></ul>`,
  vi: `<p>Quyết định ở đầu <code>idempotent()</code> của LabFlow. <code>store</code> ánh xạ <code>"người_gọi:khoá"</code> tới <code>{ fp, state: 'running' | 'done', status, at }</code> (<code>at</code> tính bằng ms). Trả:</p><ul>
<li>không có khoá (<code>undefined</code>) ⇒ <code>{ action: 'execute' }</code></li>
<li>khoá không phải 1–255 ký tự in được không có dấu cách (cho phép ngoặc kép bao ngoài) ⇒ <code>{ action: 'reject', status: 400 }</code></li>
<li>không có mục, hoặc mục cũ hơn 24 giờ ⇒ <code>{ action: 'execute', storeKey: "người_gọi:khoá" }</code> (khoá bỏ ngoặc kép)</li>
<li>dấu vân tay khác ⇒ reject 422; còn đang chạy ⇒ reject 409; còn lại <code>{ action: 'replay', status }</code></li></ul>`,
  dauVao: ['store, caller, key (string | undefined), fp, nowMs', 'store, caller, key (chuỗi | undefined), fp, nowMs'],
  dauRa: ['{ action, status?, storeKey? }', '{ action, status?, storeKey? }'],
  goiY: [['Check in this order: missing, invalid, unknown/expired, fingerprint, running, replay.', 'Kiểm theo thứ tự: thiếu, sai dạng, chưa có/hết hạn, dấu vân tay, đang chạy, phát lại.'], ['The printable range without space and quote is [\\x21\\x23-\\x7e].', 'Dải ký tự in được trừ dấu cách và ngoặc kép là [\\x21\\x23-\\x7e].']],
  loi: [['Replaying when the fingerprint differs — the wrong result for the new request.', 'Phát lại khi dấu vân tay khác — kết quả sai cho request mới.'], ['Forgetting the caller in the store key.', 'Quên người gọi trong khoá lưu.']],
  gt: ['The same order as LabFlow’s middleware and draft-08’s codes: 400 malformed, 422 reused for other content, 409 in progress, otherwise replay.', 'Đúng thứ tự middleware của LabFlow và các mã của draft-08: 400 sai dạng, 422 dùng lại cho nội dung khác, 409 đang chạy, còn lại phát lại.'],
  kn: ['idempotency'],
  tns: [tn('fingerprint', 'dấu vân tay'), tn('expiry', 'hết hạn')],
  dau: `/** idempotency decision for one request */
function decide(store, caller, key, fp, nowMs) {
  // Write your solution here
  if (store[caller + ':' + key]) return { action: 'replay', status: 201 };
  return { action: 'execute' };
}
`,
  giai: '// Reference solution\n' + nguon(decide),
  cases: [
    { goi: goi('decide', ST, 'usr_1', '"k1"', 'aaa', 5 * H), moTa: ['Retry after a lost response', 'Thử lại sau khi mất response'] },
    { goi: goi('decide', ST, 'usr_1', '"k1"', 'zzz', 5 * H), moTa: ['Same key, other body', 'Cùng khoá, body khác'] },
    { goi: `decide(${JSON.stringify(ST)}, 'usr_1', undefined, 'aaa', 0)`, an: true },
    { goi: goi('decide', ST, 'usr_2', '"k2"', 'bbb', H), an: true },
    { goi: goi('decide', ST, 'usr_2', '"k1"', 'aaa', H), an: true, moTa: ['Another user, same key', 'Người khác, cùng khoá'] },
    { goi: goi('decide', ST, 'usr_1', '"k1"', 'aaa', 25 * H), an: true, moTa: ['Older than 24 h', 'Cũ hơn 24 giờ'] },
    { goi: goi('decide', ST, 'usr_1', '"xin chào"', 'aaa', 0), an: true },
  ],
});

const ANS = ['201 replayed', '400', '409', '422', 'executes normally'];
const E3 = cs({
  ten: 'Idempotency 3 — Which answer?', kho: 'EASY', phut: 6, loai: 'table',
  en: 'POST /v2/bookings on LabFlow after lesson 5.1. Choose the answer for each situation.',
  vi: 'POST /v2/bookings trên LabFlow sau bài 5.1. Chọn câu trả lời cho từng tình huống.',
  bang: [bang1('b1', ['Situation → answer', 'Tình huống → câu trả lời'], [{ ma: 'x', ten: 'Situation' }, { ma: 'a', ten: 'Answer', luaChon: ANS }], [
    { o: { x: 'Retry with the same key and body after a lost response' }, a: { a: '201 replayed' } },
    { o: { x: 'Same key, different labId' }, a: { a: '422' } },
    { o: { x: 'Same key while the first request is still running' }, a: { a: '409' } },
    { o: { x: 'Idempotency-Key: "xin chào"' }, a: { a: '400' } },
    { o: { x: 'No Idempotency-Key header at all' }, a: { a: 'executes normally' } },
  ], ['The key is optional on existing endpoints (requiring it would be a breaking change); when present, draft-08’s codes apply.', 'Khoá là tuỳ chọn trên endpoint đang có (bắt buộc sẽ là thay đổi phá vỡ); khi có, áp các mã của draft-08.'])],
  goiY: [['Ask: same request or a different one?', 'Hỏi: cùng một request hay request khác?'], ['A missing optional key changes nothing.', 'Thiếu khoá tuỳ chọn thì không đổi gì.']],
  loi: [['422 and 409 swapped.', 'Lẫn 422 với 409.'], ['Refusing requests without a key on an existing endpoint.', 'Từ chối request không có khoá trên endpoint đang có.']],
  tns: [tn('Idempotency-Key', 'header khoá lặp-an-toàn'), tn('Idempotent-Replayed', 'dấu hiệu phát lại của LabFlow')],
  kn: ['idempotency'],
});

export default doiDau({ slug: 'api-5-1-idempotency', ten: '5.1 Idempotency keys for POST', khoa: KHOA, baiHoc: 'api-5-1-idempotency', de: [E1, E2, E3] });
