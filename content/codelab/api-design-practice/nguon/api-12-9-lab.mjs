/** API Design · Lab 12 — Báo hỏng thiết bị lên PostgreSQL: khoá tiêu đề, xử lý có If-Match (output thật Lab 12: lab/grade-lab12.mjs 0/10 ⇒ 10/10). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = {
  ...cs({
    ten: 'Lab 12 · 1 — Why the starter scored 0/10', kho: 'EASY', phut: 8,
    en: 'Lab 12: issues still lived in each instance’s RAM while devices were already in PostgreSQL; graded on two instances.',
    vi: 'Lab 12: báo hỏng vẫn nằm trong RAM của từng instance trong khi thiết bị đã ở PostgreSQL; chấm trên hai instance.',
    cau: [
      q('c1', ['Six reports with the same title were sent at once to A and B. The starter answered 201, 201, 409 × 4. Why two 201s?', 'Sáu báo hỏng cùng tiêu đề gửi cùng lúc vào A và B. Bản khởi đầu trả 201, 201, 409 × 4. Vì sao có hai 201?'],
        ['Each instance checked duplicates only in its own array, so each accepted one', 'The duplicate check compares titles case-sensitively in the starter', 'The rate limit let two through before 409 started', 'PostgreSQL allowed one duplicate because the index was not unique'],
        ['The fix is a UNIQUE (device_id, title_key) WHERE status = ’OPEN’ index that every instance hits.', 'Cách sửa là index UNIQUE (device_id, title_key) WHERE status = ’OPEN’ mà instance nào cũng phải qua.']),
      q('c2', ['Why is title_key computed by the app with fold() instead of an index on lower(unaccent(title))?', 'Vì sao title_key do ứng dụng tính bằng fold() thay vì index trên lower(unaccent(title))?'],
        ['unaccent() is not IMMUTABLE, and PostgreSQL only accepts immutable functions in an index', 'lower() is too slow to run on every insert into the issues table', 'Generated columns cannot use text functions in PostgreSQL 18', 'The API must store the title exactly as the user typed it'],
        ['Same reason as 11.6’s expired holds: index predicates and expressions must not depend on anything that can change.', 'Cùng lý do với chỗ giữ hết hạn ở 11.6: biểu thức và điều kiện của index không được phụ thuộc thứ có thể đổi.']),
      q('c3', ['A HIGH report must put the device in MAINTENANCE. Where does that belong in the solution?', 'Báo hỏng HIGH phải đặt thiết bị về MAINTENANCE. Trong lời giải, việc đó nằm ở đâu?'],
        ['In the same transaction as the INSERT, with version = version + 1 on the device', 'In the route after the response, so the report is not slowed down', 'In a nightly job that scans HIGH issues and updates devices', 'In the worker, triggered by the issue event from the outbox'],
        ['Both rows change together or not at all; bumping the version keeps the device’s ETag honest.', 'Hai dòng cùng đổi hoặc cùng không; tăng version giữ ETag của thiết bị trung thực.']),
    ],
    goiY: [['Ask what each instance can see.', 'Hỏi: mỗi instance thấy được gì.'], ['Indexes need immutable expressions.', 'Index cần biểu thức bất biến.']],
    loi: [['Checking duplicates in JavaScript only.', 'Chỉ kiểm trùng bằng JavaScript.'], ['Updating the device outside the transaction.', 'Cập nhật thiết bị ngoài transaction.']],
    tns: [tn('partial unique index', 'index duy nhất có điều kiện'), tn('IMMUTABLE', 'bất biến')],
    kn: ['databases', 'concurrency'],
  }),
  dangBai: 'lab',
};

function foldTitle(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim().replace(/\s+/g, ' ');
}
const E2 = jsBai({
  ten: 'Lab 12 · 2 — Write foldTitle(s): the key of the unique index', kho: 'MEDIUM', phut: 10, dangBai: 'lab',
  en: `<p>Compute <code>title_key</code> “the way a reader compares”: Unicode NFD, remove combining marks (U+0300–U+036F), turn <code>đ/Đ</code> into <code>d/D</code>, lower-case, trim, and collapse runs of spaces to one.</p>`,
  vi: `<p>Tính <code>title_key</code> “như người đọc so”: Unicode NFD, bỏ dấu kết hợp (U+0300–U+036F), đổi <code>đ/Đ</code> thành <code>d/D</code>, chữ thường, cắt khoảng trắng hai đầu, gộp nhiều dấu cách liền nhau thành một.</p>`,
  dauVao: ['s — string', 's — chuỗi'], dauRa: ['string', 'chuỗi'],
  goiY: [['NFD splits “ò” into “o” + a combining mark.', 'NFD tách “ò” thành “o” + một dấu kết hợp.'], ['đ is a separate letter, not o + mark: replace it by hand.', 'đ là chữ riêng, không phải chữ + dấu: thay tay.']],
  loi: [['Forgetting đ, so “Đèn” and “den” stay different.', 'Quên đ nên “Đèn” và “den” vẫn khác nhau.'], ['Comparing before normalising, so NFC and NFD forms differ.', 'So trước khi chuẩn hoá nên dạng NFC và NFD khác nhau.']],
  gt: ['src/text.js fold() is the same rule since Lab 1; in Lab 12 its result goes into title_key so the partial unique index sees “Quạt kêu to” and “quat keu to” as one title.', 'fold() trong src/text.js là cùng luật từ Lab 1; ở Lab 12 kết quả của nó vào title_key để index duy nhất có điều kiện coi “Quạt kêu to” và “quat keu to” là một tiêu đề.'],
  kn: ['text', 'databases'], tns: [tn('NFD', 'dạng tách dấu'), tn('combining mark', 'dấu kết hợp')],
  dau: `/** title as a reader compares it */
function foldTitle(s) {
  // Write your solution here
  return s.toLowerCase();
}
`,
  giai: '// Reference solution\n' + nguon(foldTitle),
  cases: [
    { goi: goi('foldTitle', 'Quạt kêu to'), moTa: ['Vietnamese marks', 'Dấu tiếng Việt'] },
    { goi: goi('foldTitle', '  Đèn   báo hỏng '), moTa: ['đ and spaces', 'đ và dấu cách'] },
    { goi: goi('foldTitle', 'CỔNG 24 CHẬP CHỜN'), an: true },
    { goi: goi('foldTitle', 'Mất nguồn ngẫu nhiên'.normalize('NFD')), an: true },
  ],
});

function resolve(issues, id, resolution, expectedVersion) {
  const i = issues.find((x) => x.id === id);
  if (!i) return { status: 404, code: 'ISSUE_NOT_FOUND' };
  if (expectedVersion !== undefined && i.version !== expectedVersion) return { status: 412, code: 'PRECONDITION_FAILED', currentETag: `"${id}-v${i.version}"` };
  if (i.status === 'RESOLVED') return { status: 409, code: 'ALREADY_RESOLVED' };
  return { status: 200, issue: { ...i, status: 'RESOLVED', resolution: resolution ?? i.resolution ?? null, version: i.version + 1 } };
}
const IS = [{ id: 'iss_61', status: 'OPEN', resolution: null, version: 1 }, { id: 'iss_4', status: 'RESOLVED', resolution: 'Đã xử lý', version: 2 }];
const E3 = jsBai({
  ten: 'Lab 12 · 3 — Write resolve(issues, id, resolution, expectedVersion)', kho: 'HARD', phut: 15, dangBai: 'lab',
  en: `<p>The answer of <code>POST /v2/issues/{id}/resolve</code> after the conditional UPDATE, in this order: unknown id ⇒ <code>{ status: 404, code: 'ISSUE_NOT_FOUND' }</code>; <code>expectedVersion</code> given and different ⇒ <code>{ status: 412, code: 'PRECONDITION_FAILED', currentETag: '"iss_61-v2"' }</code>; already RESOLVED ⇒ <code>{ status: 409, code: 'ALREADY_RESOLVED' }</code>; else <code>{ status: 200, issue }</code> with status RESOLVED, <code>resolution</code> (the new one, or the old one, or <code>null</code>) and version + 1. Do not mutate.</p>`,
  vi: `<p>Câu trả lời của <code>POST /v2/issues/{id}/resolve</code> sau câu UPDATE có điều kiện, theo thứ tự: id lạ ⇒ <code>{ status: 404, code: 'ISSUE_NOT_FOUND' }</code>; có <code>expectedVersion</code> mà khác ⇒ <code>{ status: 412, code: 'PRECONDITION_FAILED', currentETag: '"iss_61-v2"' }</code>; đã RESOLVED ⇒ <code>{ status: 409, code: 'ALREADY_RESOLVED' }</code>; còn lại <code>{ status: 200, issue }</code> với status RESOLVED, <code>resolution</code> (cái mới, hoặc cái cũ, hoặc <code>null</code>) và version + 1. Không sửa đầu vào.</p>`,
  dauVao: ['issues — {id, status, resolution, version}[]; id; resolution — string | undefined; expectedVersion — number | undefined', 'issues — {id, status, resolution, version}[]; id; resolution — chuỗi | undefined; expectedVersion — số | undefined'],
  dauRa: ['{ status, code?, currentETag?, issue? }', '{ status, code?, currentETag?, issue? }'],
  goiY: [['412 is checked before 409, like the route.', '412 kiểm trước 409, như route.'], ['?? keeps the old resolution when no new one is given.', '?? giữ resolution cũ khi không có cái mới.']],
  loi: [['Answering 409 to a manager holding a stale ETag.', 'Trả 409 cho quản lý đang giữ ETag cũ.'], ['Forgetting to bump the version.', 'Quên tăng version.']],
  gt: ['The grader sent the same If-Match from A and B at once: 200, 412 — iss_61 RESOLVED, version 2 (Lab 12 solution, 10/10).', 'Bộ chấm gửi cùng If-Match từ A và B cùng lúc: 200, 412 — iss_61 RESOLVED, version 2 (lời giải Lab 12, 10/10).'],
  kn: ['concurrency', 'http'], tns: [tn('precondition failed', 'điều kiện trước không thoả'), tn('conditional UPDATE', 'UPDATE có điều kiện')],
  dau: `/** resolve with If-Match */
function resolve(issues, id, resolution, expectedVersion) {
  // Write your solution here
  const i = issues.find((x) => x.id === id);
  if (i.status === 'RESOLVED') return { status: 409, code: 'ALREADY_RESOLVED' };
  return { status: 200, issue: { ...i, status: 'RESOLVED', resolution } };
}
`,
  giai: '// Reference solution\n' + nguon(resolve),
  cases: [
    { goi: goi('resolve', IS, 'iss_61', 'Thay quạt', 1), moTa: ['First manager', 'Quản lý thứ nhất'] },
    { goi: goi('resolve', [{ id: 'iss_61', status: 'RESOLVED', resolution: 'Thay quạt', version: 2 }], 'iss_61', 'Tra dầu', 1), moTa: ['Second manager, stale ETag', 'Quản lý thứ hai, ETag cũ'] },
    { goi: 'resolve(' + JSON.stringify(IS) + ', "iss_4", undefined, undefined)', an: true },
    { goi: goi('resolve', IS, 'iss_99', 'x', 1), an: true },
    { goi: 'resolve(' + JSON.stringify(IS) + ', "iss_61", undefined, undefined)', an: true },
  ],
});

export default doiDau({ slug: 'api-12-9-lab', ten: 'Lab 12 — Move device issues to PostgreSQL', khoa: KHOA, baiHoc: 'api-12-9-lab', de: [E1, E2, E3] });
