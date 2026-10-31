/** API Design · 5.4 — Khoá lạc quan: ETag mạnh theo version, If-Match ⇒ 412, If-None-Match ⇒ 304. */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Concurrency 1 — The lost update', kho: 'EASY', phut: 8,
  en: 'Facts from lesson 5.4 (dev_3 edited from a laptop and a phone, real runs).',
  vi: 'Những điều từ bài 5.4 (dev_3 được sửa từ laptop và điện thoại, chạy thật).',
  cau: [
    q('c1', ['Without If-Match, both PATCHes returned 200. What happened to the laptop’s note?', 'Không có If-Match, cả hai PATCH đều trả 200. Ghi chú của laptop ra sao?'], ['It was silently overwritten by the phone’s old note', 'It was merged with the phone’s note', 'The second PATCH failed with 409', 'Both notes were kept in a history list'], ['Last write wins — the lost update. Nobody was told.', 'Người ghi sau thắng — mất cập nhật. Không ai được báo.']),
    q('c2', ['The phone sent If-Match: "dev_3-v1" after the laptop had saved v2. The answer was …', 'Điện thoại gửi If-Match: "dev_3-v1" sau khi laptop đã lưu v2. Câu trả lời là …'], ['412 with currentETag "dev_3-v2", nothing changed', '200, and version v1 was restored', '409 BOOKING_CONFLICT from the rules', '428 Precondition Required, no body'], ['The precondition was false, so the write was refused; the client reloads and merges.', 'Điều kiện sai nên lần ghi bị từ chối; client tải lại rồi gộp.']),
    q('c3', ['Why are Express’s automatic ETags not used for If-Match?', 'Vì sao không dùng ETag tự động của Express cho If-Match?'], ['They are weak (W/"…") and If-Match uses strong comparison', 'They are too long to send in a header', 'They change on every single request', 'They are only sent with 304 responses'], ['RFC 9110: If-Match compares strongly; LabFlow sets its own strong tag from the version.', 'RFC 9110: If-Match so sánh mạnh; LabFlow tự đặt nhãn mạnh từ version.']),
  ],
  goiY: [['Look at the real outputs of lesson 5.4.', 'Xem lại output thật của bài 5.4.'], ['412 means the precondition you sent is false.', '412 nghĩa là điều kiện bạn gửi là sai.']],
  loi: [['Thinking 200 means nothing went wrong.', 'Nghĩ rằng 200 là không có gì sai.'], ['Mixing up 412 and 428.', 'Lẫn 412 với 428.']],
  tns: [tn('lost update', 'mất cập nhật'), tn('precondition', 'điều kiện tiên quyết')],
  kn: ['concurrency'],
});

function ifMatch(header, current) {
  if (header === undefined) return 'ok';
  const tags = header.split(',').map((s) => s.trim());
  if (tags.includes('*')) return 'ok';
  return tags.some((t) => !t.startsWith('W/') && t === current) ? 'ok' : 'precondition-failed';
}
const E2 = jsBai({
  ten: 'Concurrency 2 — Write ifMatch(header, current)', kho: 'MEDIUM', phut: 12,
  en: `<p>Evaluate an <code>If-Match</code> header against the current strong ETag (e.g. <code>"dev_3-v2"</code>, quotes included). Return <code>'ok'</code> or <code>'precondition-failed'</code>:</p><ul>
<li>no header (<code>undefined</code>) ⇒ <code>'ok'</code> (optional in LabFlow)</li>
<li>a comma-separated list of tags; <code>*</code> anywhere ⇒ <code>'ok'</code></li>
<li>otherwise <code>'ok'</code> only if one tag equals <code>current</code> <b>strongly</b>: a weak tag (<code>W/"…"</code>) never matches</li></ul>`,
  vi: `<p>Đánh giá header <code>If-Match</code> so với ETag mạnh hiện tại (ví dụ <code>"dev_3-v2"</code>, gồm cả ngoặc kép). Trả <code>'ok'</code> hoặc <code>'precondition-failed'</code>:</p><ul>
<li>không có header (<code>undefined</code>) ⇒ <code>'ok'</code> (tuỳ chọn ở LabFlow)</li>
<li>danh sách nhãn cách nhau dấu phẩy; có <code>*</code> ở bất kỳ đâu ⇒ <code>'ok'</code></li>
<li>còn lại chỉ <code>'ok'</code> khi có một nhãn bằng <code>current</code> theo kiểu <b>mạnh</b>: nhãn yếu (<code>W/"…"</code>) không bao giờ khớp</li></ul>`,
  dauVao: ['header — string | undefined; current — strong ETag string', 'header — chuỗi | undefined; current — chuỗi ETag mạnh'],
  dauRa: ["'ok' | 'precondition-failed'", "'ok' | 'precondition-failed'"],
  goiY: [['Split on commas and trim each tag.', 'Tách theo dấu phẩy rồi bỏ khoảng trắng từng nhãn.'], ['Strong comparison: exact string equality, and no W/ prefix.', 'So sánh mạnh: chuỗi bằng hệt nhau, và không có tiền tố W/.']],
  loi: [['Treating W/"dev_3-v2" as a match.', 'Coi W/"dev_3-v2" là khớp.'], ['Comparing without the quotes.', 'So mà bỏ ngoặc kép.']],
  gt: ['This is checkIfMatch of lesson 5.4 as a pure function: absent ⇒ allowed, * ⇒ any version, otherwise strong equality; anything else ⇒ 412.', 'Đây là checkIfMatch của bài 5.4 dưới dạng hàm thuần: vắng ⇒ cho qua, * ⇒ mọi phiên bản, còn lại so mạnh; khác đi ⇒ 412.'],
  kn: ['ETag', 'conditional requests'],
  tns: [tn('strong comparison', 'so sánh mạnh'), tn('weak ETag', 'ETag yếu')],
  dau: `/** If-Match header + current ETag ⇒ 'ok' | 'precondition-failed' */
function ifMatch(header, current) {
  // Write your solution here
  return header === current ? 'ok' : 'precondition-failed';
}
`,
  giai: '// Reference solution\n' + nguon(ifMatch),
  cases: [
    { goi: goi('ifMatch', '"dev_3-v1"', '"dev_3-v2"'), moTa: ['The phone, still on v1', 'Điện thoại, vẫn ở v1'] },
    { goi: `ifMatch(undefined, '"dev_3-v2"')`, moTa: ['No header', 'Không có header'] },
    { goi: goi('ifMatch', '"dev_3-v1", "dev_3-v2"', '"dev_3-v2"'), an: true },
    { goi: goi('ifMatch', '*', '"dev_3-v7"'), an: true },
    { goi: goi('ifMatch', 'W/"dev_3-v2"', '"dev_3-v2"'), an: true },
    { goi: goi('ifMatch', 'dev_3-v2', '"dev_3-v2"'), an: true },
  ],
});

function guardedUpdate(rows, id, expectedVersion, patch) {
  const i = rows.findIndex((r) => r.id === id && r.version === expectedVersion);
  if (i === -1) return { updated: 0, rows };
  const next = rows.map((r, j) => (j === i ? { ...r, ...patch, version: r.version + 1 } : r));
  return { updated: 1, rows: next };
}
const ROWS = [{ id: 'dev_3', note: 'Thiếu thẻ nhớ', status: 'AVAILABLE', version: 1 }, { id: 'dev_1', note: null, status: 'AVAILABLE', version: 4 }];
const E3 = jsBai({
  ten: 'Concurrency 3 — Write guardedUpdate(rows, id, expectedVersion, patch)', kho: 'MEDIUM', phut: 12,
  en: `<p>Simulate the one SQL statement of lesson 5.4: <code>UPDATE devices SET …, version = version + 1 WHERE id = $1 AND version = $2</code>. Return <code>{ updated, rows }</code>: if a row has that <code>id</code> <b>and</b> that <code>version</code>, apply <code>patch</code>, increase its version and return <code>updated: 1</code> with a new array; otherwise <code>updated: 0</code> and the original rows. Never modify the arguments.</p>`,
  vi: `<p>Mô phỏng câu SQL duy nhất của bài 5.4: <code>UPDATE devices SET …, version = version + 1 WHERE id = $1 AND version = $2</code>. Trả <code>{ updated, rows }</code>: nếu có dòng mang đúng <code>id</code> <b>và</b> đúng <code>version</code> thì áp <code>patch</code>, tăng version và trả <code>updated: 1</code> với mảng mới; ngược lại <code>updated: 0</code> và các dòng ban đầu. Không bao giờ sửa đối số.</p>`,
  dauVao: ['rows — [{ id, …, version }]; id; expectedVersion; patch — object', 'rows — [{ id, …, version }]; id; expectedVersion; patch — object'],
  dauRa: ['{ updated: 0 | 1, rows }', '{ updated: 0 | 1, rows }'],
  goiY: [['Find the row with BOTH conditions in one step.', 'Tìm dòng thoả CẢ HAI điều kiện trong một bước.'], ['rows.map with a spread creates the new array.', 'rows.map kèm spread tạo mảng mới.']],
  loi: [['Checking the version in one step and updating in another — the race is back.', 'Kiểm version một bước rồi cập nhật bước khác — cuộc đua quay lại.'], ['Letting patch overwrite the version.', 'Để patch ghi đè version.']],
  gt: ['updated: 0 is how the database tells you somebody else won the race; the API turns it into 412.', 'updated: 0 là cách cơ sở dữ liệu báo có người khác thắng cuộc đua; API biến nó thành 412.'],
  kn: ['optimistic locking', 'SQL'],
  tns: [tn('guarded update', 'cập nhật có điều kiện'), tn('affected rows', 'số dòng bị ảnh hưởng')],
  dau: `/** UPDATE … WHERE id = $1 AND version = $2, simulated */
function guardedUpdate(rows, id, expectedVersion, patch) {
  // Write your solution here
  const r = rows.find((x) => x.id === id);
  Object.assign(r, patch);
  return { updated: 1, rows };
}
`,
  giai: '// Reference solution\n' + nguon(guardedUpdate),
  cases: [
    { goi: goi('guardedUpdate', ROWS, 'dev_3', 1, { note: 'Đã thay thẻ nhớ 32 GB' }), moTa: ['The laptop, on v1', 'Laptop, ở v1'] },
    { goi: goi('guardedUpdate', [{ ...ROWS[0], note: 'Đã thay thẻ nhớ 32 GB', version: 2 }, ROWS[1]], 'dev_3', 1, { status: 'MAINTENANCE' }), moTa: ['The phone, still on v1', 'Điện thoại, vẫn ở v1'] },
    { goi: goi('guardedUpdate', ROWS, 'dev_9', 1, { note: 'x' }), an: true },
    { goi: goi('guardedUpdate', ROWS, 'dev_1', 4, { status: 'IN_USE', version: 99 }), an: true },
    { goi: `(function () { var r = ${JSON.stringify(ROWS)}; guardedUpdate(r, 'dev_3', 1, { note: 'x' }); return r; })()`, an: true, moTa: ['The input is not modified', 'Đầu vào không bị sửa'] },
  ],
});

export default doiDau({ slug: 'api-5-4-dong-thoi', ten: '5.4 Concurrency: optimistic locking and ETags', khoa: KHOA, baiHoc: 'api-5-4-dong-thoi', de: [E1, E2, E3] });
