/** API Design · 9.4 — Định danh và phân trang qua nhiều mảnh: UUIDv7, gộp trang theo cursor (output thật bài 9.4). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Sharding 1 — IDs and pages across shards', kho: 'EASY', phut: 8,
  en: 'Facts from lesson 9.4 (1,000,000 rows in PostgreSQL 18, two shards by hash(lab_id)).',
  vi: 'Những điều từ bài 9.4 (1.000.000 dòng trong PostgreSQL 18, hai mảnh theo hash(lab_id)).',
  cau: [
    q('c1', ['Which primary-key index was the largest for 1,000,000 rows?', 'Chỉ mục khoá chính nào lớn nhất với 1.000.000 dòng?'],
      ['UUIDv4 — 37 MB', 'UUIDv7 — 30 MB', 'bigint identity — 21 MB', 'All the same — 30 MB'],
      ['Random v4 keys split pages all over the index; v7 keys arrive in time order like a counter.', 'Khoá v4 ngẫu nhiên làm tách trang khắp chỉ mục; khoá v7 tới theo thứ tự thời gian như bộ đếm.']),
    q('c2', ['Each shard ran OFFSET 19980 LIMIT 20 and the results were merged. The page was…', 'Mỗi mảnh chạy OFFSET 19980 LIMIT 20 rồi gộp. Trang nhận được…'],
      ['wrong', 'correct and fast', 'correct but slow', 'empty'],
      ['The correct offset needs offset+limit rows from every shard (40,000 rows); the cursor needs 20 per shard and is right.', 'Offset đúng cần offset+limit dòng từ mọi mảnh (40.000 dòng); cursor cần 20 dòng mỗi mảnh và đúng.']),
    q('c3', ['Bookings of one user (user_id is NOT the shard key). How many shards are asked?', 'Lượt đặt của một người dùng (user_id KHÔNG phải khoá phân mảnh). Bao nhiêu mảnh bị hỏi?'],
      ['All of them, then the results are merged', 'Only the shard of the user’s first booking', 'One random shard', 'None — the API returns 400'],
      ['Scatter-gather: cost × number of shards, and the slowest shard decides the response time.', 'Scatter-gather: chi phí × số mảnh, và mảnh chậm nhất quyết định thời gian trả lời.']),
  ],
  goiY: [['Random vs time-ordered keys.', 'Khoá ngẫu nhiên và khoá theo thời gian.'], ['Which rows are “the newest 19,980” overall?', '“19.980 dòng mới nhất” của cả bảng là những dòng nào?']],
  loi: [['Offsetting each shard by the global offset.', 'Lệch mỗi mảnh theo offset toàn cục.'], ['Putting a global counter id in the contract.', 'Đưa id bộ đếm toàn cục vào hợp đồng.']],
  tns: [tn('shard key', 'khoá phân mảnh'), tn('scatter-gather', 'hỏi mọi mảnh rồi gộp')],
  kn: ['sharding'],
});

function mergePage(shards, limit) {
  const newer = (a, b) => (b.createdAt < a.createdAt ? -1 : b.createdAt > a.createdAt ? 1 : (b.id < a.id ? -1 : b.id > a.id ? 1 : 0));
  const all = shards.flat().sort(newer);
  const page = all.slice(0, limit);
  const last = page[page.length - 1];
  return { ids: page.map((r) => r.id), next: all.length > limit && last ? { createdAt: last.createdAt, id: last.id } : null };
}
const E2 = jsBai({
  ten: 'Sharding 2 — Write mergePage(shards, limit)', kho: 'MEDIUM', phut: 15,
  en: `<p>Each shard has already returned up to <code>limit</code> rows after the cursor, newest first. Merge them into one page: order by <code>createdAt</code> descending (ISO strings compare correctly as text), ties by <code>id</code> descending; keep <code>limit</code> rows. Return <code>{ ids, next }</code> where <code>next</code> is the <code>{ createdAt, id }</code> of the last row if more rows were available than <code>limit</code>, else <code>null</code>.</p>`,
  vi: `<p>Mỗi mảnh đã trả tối đa <code>limit</code> dòng sau cursor, mới nhất trước. Gộp thành một trang: sắp theo <code>createdAt</code> giảm dần (chuỗi ISO so theo chữ là đúng), hoà thì theo <code>id</code> giảm dần; giữ <code>limit</code> dòng. Trả <code>{ ids, next }</code> với <code>next</code> là <code>{ createdAt, id }</code> của dòng cuối nếu có nhiều dòng hơn <code>limit</code>, ngược lại <code>null</code>.</p>`,
  dauVao: ['shards — array of row arrays [{ id, createdAt }]; limit — number', 'shards — mảng các mảng dòng [{ id, createdAt }]; limit — số'],
  dauRa: ['{ ids: string[], next: { createdAt, id } | null }', '{ ids: string[], next: { createdAt, id } | null }'],
  goiY: [['Flatten, sort, slice.', 'Làm phẳng, sắp, cắt.'], ['The cursor is the position of the last row KEPT.', 'Cursor là vị trí của dòng cuối được GIỮ.']],
  loi: [['Taking limit rows from each shard and concatenating without sorting.', 'Lấy limit dòng mỗi mảnh rồi nối mà không sắp.'], ['Building the cursor from the last row fetched instead of the last row kept.', 'Dựng cursor từ dòng cuối đã lấy thay vì dòng cuối được giữ.']],
  gt: ['This is the “cursor” line of lesson 9.4: 40 rows pulled, 20 kept, correct on any page.', 'Đây là dòng “cursor” của bài 9.4: kéo 40 dòng, giữ 20, đúng ở mọi trang.'],
  kn: ['sharding', 'pagination'],
  tns: [tn('merge', 'gộp kết quả đã sắp'), tn('cursor', 'vị trí tiếp tục')],
  dau: `/** merge per-shard pages into one page */
function mergePage(shards, limit) {
  // Write your solution here
  const all = shards.flat().slice(0, limit);
  return { ids: all.map((r) => r.id), next: null };
}
`,
  giai: '// Reference solution\n' + nguon(mergePage),
  cases: [
    { goi: goi('mergePage', [[{ id: 'b4', createdAt: '2026-10-04' }, { id: 'b2', createdAt: '2026-10-02' }], [{ id: 'b3', createdAt: '2026-10-03' }, { id: 'b1', createdAt: '2026-10-01' }]], 2), moTa: ['Two shards, two rows each', 'Hai mảnh, mỗi mảnh hai dòng'] },
    { goi: goi('mergePage', [[{ id: 'b1', createdAt: '2026-10-01' }], []], 2), moTa: ['Fewer rows than the limit', 'Ít dòng hơn limit'] },
    { goi: goi('mergePage', [[{ id: 'a9', createdAt: '2026-10-05' }], [{ id: 'b9', createdAt: '2026-10-05' }], [{ id: 'c1', createdAt: '2026-10-06' }]], 2), an: true },
    { goi: goi('mergePage', [[], []], 20), an: true },
  ],
});

function uuidV7Time(uuid) {
  const m = /^([0-9a-f]{8})-([0-9a-f]{4})-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.exec(uuid);
  if (!m) return null;
  return new Date(parseInt(m[1] + m[2], 16)).toISOString();
}
const E3 = jsBai({
  ten: 'Sharding 3 — Write uuidV7Time(uuid): what a public id reveals', kho: 'EASY', phut: 10,
  en: `<p>A UUIDv7 begins with a 48-bit Unix time in milliseconds: the first 12 hex digits (8 before the first dash, 4 after). Return that time as an ISO string. Not a valid version-7 UUID (version digit 7, variant digit 8, 9, a or b) ⇒ <code>null</code>.</p>`,
  vi: `<p>UUIDv7 mở đầu bằng 48 bit thời gian Unix tính bằng mili giây: 12 chữ số hex đầu tiên (8 chữ trước gạch nối đầu, 4 chữ sau). Trả thời điểm đó dạng chuỗi ISO. Không phải UUID phiên bản 7 hợp lệ (chữ số phiên bản 7, chữ số biến thể 8, 9, a hoặc b) ⇒ <code>null</code>.</p>`,
  dauVao: ['uuid — string', 'uuid — chuỗi'],
  dauRa: ['ISO string or null', 'chuỗi ISO hoặc null'],
  goiY: [['Join the first two groups and parseInt(…, 16).', 'Ghép hai nhóm đầu rồi parseInt(…, 16).'], ['Check the version and variant with a regular expression.', 'Kiểm phiên bản và biến thể bằng biểu thức chính quy.']],
  loi: [['Reading only the first 8 hex digits (32 bits).', 'Chỉ đọc 8 chữ số hex đầu (32 bit).'], ['Accepting a v4 UUID.', 'Nhận cả UUID v4.']],
  gt: ['01a19477-6093-… decodes to 2026-11-01T00:16:53.907Z — the same as uuid_extract_timestamp in lesson 9.4. Public v7 ids reveal when things were created.', '01a19477-6093-… giải ra 2026-11-01T00:16:53.907Z — trùng uuid_extract_timestamp ở bài 9.4. Id v7 công khai cho biết thứ đó được tạo khi nào.'],
  kn: ['identifiers', 'privacy'],
  tns: [tn('UUIDv7', 'UUID theo thời gian'), tn('variant', 'chữ số biến thể')],
  dau: `/** creation time inside a UUIDv7 */
function uuidV7Time(uuid) {
  // Write your solution here
  return new Date(parseInt(uuid.slice(0, 8), 16)).toISOString();
}
`,
  giai: '// Reference solution\n' + nguon(uuidV7Time),
  cases: [
    { goi: goi('uuidV7Time', '01a19477-6093-7923-b160-26b8db67326e'), moTa: ['An id from lesson 9.4', 'Một id ở bài 9.4'] },
    { goi: goi('uuidV7Time', '00000f84-f4b3-46fa-8af4-d333d95a39ea'), moTa: ['A v4 UUID', 'Một UUID v4'] },
    { goi: goi('uuidV7Time', '01A19479-E24A-7763-9165-C70F699F9C9A'), an: true },
    { goi: goi('uuidV7Time', 'note_200003'), an: true },
  ],
});

export default doiDau({ slug: 'api-9-3-sharding', ten: '9.4 IDs, pagination and filters that survive sharding', khoa: KHOA, baiHoc: 'api-9-3-sharding', de: [E1, E2, E3] });
