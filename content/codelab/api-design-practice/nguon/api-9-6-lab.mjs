/** API Design · Lab 9 — Luồng ghi chú: id công khai UUIDv7, cursor, ETag rẻ (output thật Lab 9). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Lab 9 · 1 — The reference run', kho: 'EASY', phut: 8,
  en: 'GET /v2/labs/lab_1/notes with 200,000 notes, primary + replica, Lab 9.',
  vi: 'GET /v2/labs/lab_1/notes với 200.000 ghi chú, primary + replica, Lab 9.',
  cau: [
    q('c1', ['The first version of the ETag query used max(public_id) and failed. Why?', 'Bản đầu của truy vấn ETag dùng max(public_id) và hỏng. Vì sao?'],
      ['PostgreSQL has no max() aggregate for uuid', 'uuidv7 values cannot be compared', 'The replica had no lab_notes table', 'max() needs a GROUP BY'],
      ['ORDER BY public_id DESC LIMIT 1 — one index lookup — gives the same answer.', 'ORDER BY public_id DESC LIMIT 1 — một lần dò chỉ mục — cho cùng kết quả.']),
    q('c2', ['Why res.vary(“LabFlow-Consistency”) instead of res.set(“Vary”, …)?', 'Vì sao res.vary(“LabFlow-Consistency”) thay vì res.set(“Vary”, …)?'],
      ['res.set replaces the Vary: Origin that the CORS middleware had set', 'res.set does not work on 304 responses', 'Vary must be lower-case', 'res.vary also sets Cache-Control'],
      ['Vary must list every header that changes the response; vary() appends.', 'Vary phải liệt kê mọi header làm đổi response; vary() nối thêm.']),
    q('c3', ['The first note’s UUIDv7 decoded to 07:19:38 on 1 Nov, while its created_at was much earlier. Why?', 'UUIDv7 của ghi chú đầu giải ra 07:19:38 ngày 1/11, trong khi created_at sớm hơn nhiều. Vì sao?'],
      ['The ids were backfilled by ALTER TABLE, so they carry the migration time', 'uuidv7() uses the server’s time zone incorrectly', 'The replica rewrote the ids', 'created_at was wrong'],
      ['Backfill with uuidv7(created_at - now()) if the id should carry the creation time.', 'Điền bằng uuidv7(created_at - now()) nếu id phải mang thời điểm tạo.']),
  ],
  goiY: [['Read the error messages of the reference run.', 'Đọc thông báo lỗi của lần chạy tham khảo.'], ['What does a DEFAULT on ADD COLUMN do to old rows?', 'DEFAULT khi ADD COLUMN làm gì với các dòng cũ?']],
  loi: [['Overwriting Vary with res.set.', 'Ghi đè Vary bằng res.set.'], ['Assuming every UUIDv7 says when the row was created.', 'Cho rằng UUIDv7 nào cũng cho biết dòng được tạo lúc nào.']],
  tns: [tn('backfill', 'điền giá trị cho dòng cũ'), tn('Vary', 'header làm đổi response')],
  kn: ['caching', 'identifiers'],
});

function pageAfter(ids, cursor, limit) {
  const sorted = [...ids].sort().reverse();                       // UUIDv7 dạng chuỗi xếp đúng theo thời gian
  const rest = cursor ? sorted.filter((x) => x < cursor) : sorted;
  const page = rest.slice(0, limit);
  return { data: page, next: rest.length > limit ? page[page.length - 1] : null };
}
const E2 = jsBai({
  ten: 'Lab 9 · 2 — Write pageAfter(ids, cursor, limit) with UUIDv7 cursors', kho: 'MEDIUM', phut: 15,
  en: `<p>Notes are identified by lower-case UUIDv7 strings, which sort by time as text. Return the page of newest notes after <code>cursor</code> (exclusive; no cursor ⇒ from the newest): <code>{ data: ids (newest first, at most limit), next }</code>, where <code>next</code> is the last id of the page when more notes remain, otherwise <code>null</code>. Do not modify <code>ids</code>.</p>`,
  vi: `<p>Ghi chú được định danh bằng chuỗi UUIDv7 chữ thường, xếp theo thời gian khi so như chữ. Trả trang các ghi chú mới nhất sau <code>cursor</code> (không gồm cursor; không có cursor ⇒ từ mới nhất): <code>{ data: các id (mới nhất trước, tối đa limit), next }</code>, với <code>next</code> là id cuối của trang khi còn ghi chú, ngược lại <code>null</code>. Không sửa <code>ids</code>.</p>`,
  dauVao: ['ids — string[] (any order); cursor — string | null; limit — number', 'ids — string[] (thứ tự bất kỳ); cursor — chuỗi | null; limit — số'],
  dauRa: ['{ data: string[], next: string | null }', '{ data: string[], next: string | null }'],
  goiY: [['[...ids].sort().reverse() gives newest first.', '[...ids].sort().reverse() cho mới nhất trước.'], ['Exclusive: keep ids strictly less than the cursor.', 'Không gồm cursor: giữ id nhỏ hơn hẳn cursor.']],
  loi: [['Including the cursor itself — the same note twice.', 'Gồm cả chính cursor — một ghi chú hai lần.'], ['Sorting the input array in place.', 'Sắp thẳng mảng đầu vào.']],
  gt: ['This is the SQL of Lab 9 — WHERE public_id < $cursor ORDER BY public_id DESC LIMIT 21 — in JavaScript: 1.8 ms 100,000 notes deep.', 'Đây là câu SQL của Lab 9 — WHERE public_id < $cursor ORDER BY public_id DESC LIMIT 21 — viết bằng JavaScript: 1,8 ms ở sâu 100.000 ghi chú.'],
  kn: ['pagination', 'identifiers'],
  tns: [tn('cursor', 'vị trí tiếp tục'), tn('exclusive', 'không gồm')],
  dau: `/** next page of notes after the cursor */
function pageAfter(ids, cursor, limit) {
  // Write your solution here
  const start = cursor ? ids.indexOf(cursor) : 0;
  return { data: ids.slice(start, start + limit), next: null };
}
`,
  giai: '// Reference solution\n' + nguon(pageAfter),
  cases: [
    { goi: goi('pageAfter', ['01a1-0001', '01a1-0003', '01a1-0002'], null, 2), moTa: ['First page', 'Trang đầu'] },
    { goi: goi('pageAfter', ['01a1-0001', '01a1-0003', '01a1-0002'], '01a1-0002', 2), moTa: ['After the cursor', 'Sau cursor'] },
    { goi: goi('pageAfter', [], null, 20), an: true },
    { goi: goi('pageAfter', ['a', 'b', 'c', 'd', 'e'], 'e', 2), an: true },
    { goi: goi('pageAfter', ['a', 'b'], 'a', 2), an: true },
  ],
});

export default doiDau({ slug: 'api-9-6-lab', ten: 'Lab 9 — A notes feed ready for scale', khoa: KHOA, baiHoc: 'api-9-6-lab', de: [E1, E2] });
