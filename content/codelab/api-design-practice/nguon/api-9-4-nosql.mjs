/** API Design · 9.5 — SQL vs NoSQL nhìn từ API: tài liệu JSONB và bảng theo mẫu truy cập (output thật bài 9.5). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Documents vs tables 1 — Read the measurements', kho: 'EASY', phut: 8,
  en: 'Facts from lesson 9.5 (1,000 labs × 30 devices × 5 issues, tables vs one JSONB document per lab, PostgreSQL 18).',
  vi: 'Những điều từ bài 9.5 (1.000 phòng × 30 thiết bị × 5 báo hỏng, bảng so với mỗi phòng một tài liệu JSONB, PostgreSQL 18).',
  cau: [
    q('c1', ['Which request was FASTER with the document model?', 'Request nào NHANH hơn với mô hình tài liệu?'],
      ['GET one lab with its devices inside (0.17 vs 0.24 ms)', 'PATCH one device (0.45 vs 0.10 ms)', 'All devices in MAINTENANCE across labs (8.3 vs 0.25 ms)', 'The 20 newest issues of a device (8.9 vs 0.11 ms)'],
      ['A document wins when the endpoint reads one aggregate whole: the stored shape is the response.', 'Tài liệu thắng khi endpoint đọc nguyên một khối: hình dạng lưu chính là response.']),
    q('c2', ['Why did updating one device cost more in the document model?', 'Vì sao sửa một thiết bị tốn hơn trong mô hình tài liệu?'],
      ['The array position must be found and the whole document is rewritten', 'JSONB cannot be updated, only replaced by DELETE + INSERT', 'GIN indexes lock the whole table on update', 'Documents are stored on a different disk'],
      ['jsonb_set rewrites the row with the full document (10 KB of JSON for one status change).', 'jsonb_set ghi lại cả dòng với toàn bộ tài liệu (10 KB JSON cho một lần đổi trạng thái).']),
    q('c3', ['A lab with 20,000 embedded issues: what is the API problem?', 'Một phòng nhúng 20.000 báo hỏng: vấn đề với API là gì?'],
      ['Every read or update moves the whole 1.2 MB document — unbounded lists belong in their own rows', 'JSONB cannot hold more than 10,000 items in one array, so the insert silently fails', 'The GIN index stops working above 1 MB and every query becomes a full scan', 'Nothing — TOAST compression makes a large document as cheap as a small one'],
      ['Read 8.9 ms vs 0.11 ms for “20 newest issues” from a table. MongoDB caps documents at 16 MB for the same reason.', 'Đọc 8,9 ms so với 0,11 ms cho “20 báo hỏng mới nhất” từ bảng. MongoDB giới hạn tài liệu 16 MB cũng vì lẽ đó.']),
  ],
  goiY: [['What shape does each endpoint return?', 'Mỗi endpoint trả hình dạng gì?'], ['Which lists keep growing?', 'Danh sách nào cứ lớn mãi?']],
  loi: [['Choosing the store by slogan.', 'Chọn kho bằng khẩu hiệu.'], ['Exposing only PUT on the whole document.', 'Chỉ mở PUT cho cả tài liệu.']],
  tns: [tn('aggregate', 'khối đọc/sửa cùng nhau'), tn('embed', 'nhúng')],
  kn: ['data modeling'],
});

function devicePath(doc, deviceId) {
  const i = (doc.devices ?? []).findIndex((d) => d.id === deviceId);
  return i === -1 ? null : ['devices', String(i), 'status'];
}
const E2 = jsBai({
  ten: 'Documents vs tables 2 — Write devicePath(doc, deviceId) for jsonb_set', kho: 'EASY', phut: 10,
  en: `<p>To update one device inside a lab document with <code>jsonb_set(doc, path, value)</code> you need the <em>array position</em>, not the id. Return the path <code>['devices', '&lt;index&gt;', 'status']</code> (index as a string) for the device with <code>id === deviceId</code>, or <code>null</code> if the lab has no such device or no <code>devices</code> array.</p>`,
  vi: `<p>Muốn sửa một thiết bị bên trong tài liệu phòng bằng <code>jsonb_set(doc, path, value)</code>, bạn cần <em>vị trí trong mảng</em>, không phải id. Trả đường dẫn <code>['devices', '&lt;chỉ số&gt;', 'status']</code> (chỉ số dạng chuỗi) cho thiết bị có <code>id === deviceId</code>, hoặc <code>null</code> nếu phòng không có thiết bị đó hay không có mảng <code>devices</code>.</p>`,
  dauVao: ['doc — { devices?: [{ id, status }] }; deviceId — number', 'doc — { devices?: [{ id, status }] }; deviceId — số'],
  dauRa: ['string[] | null', 'string[] | null'],
  goiY: [['findIndex returns −1 when nothing matches.', 'findIndex trả −1 khi không khớp.'], ['?? [] handles a missing array.', '?? [] xử lý mảng bị thiếu.']],
  loi: [['Using the device id as the array index.', 'Dùng id thiết bị làm chỉ số mảng.'], ['Returning ["devices", -1, …] for a missing device.', 'Trả ["devices", -1, …] cho thiết bị không tồn tại.']],
  gt: ['This lookup is the extra step that made the document update 0.45 ms against 0.10 ms for a row (lesson 9.5).', 'Bước tra này là phần thêm làm việc sửa tài liệu tốn 0,45 ms so với 0,10 ms của một dòng (bài 9.5).'],
  kn: ['data modeling', 'PostgreSQL'],
  tns: [tn('jsonb_set', 'sửa một chỗ trong JSONB'), tn('path', 'đường dẫn tới phần tử')],
  dau: `/** jsonb_set path for one device's status */
function devicePath(doc, deviceId) {
  // Write your solution here
  return ['devices', String(deviceId), 'status'];
}
`,
  giai: '// Reference solution\n' + nguon(devicePath),
  cases: [
    { goi: goi('devicePath', { devices: [{ id: 31, status: 'AVAILABLE' }, { id: 32, status: 'AVAILABLE' }] }, 32), moTa: ['Second device', 'Thiết bị thứ hai'] },
    { goi: goi('devicePath', { devices: [{ id: 31, status: 'AVAILABLE' }] }, 99), moTa: ['Not in this lab', 'Không thuộc phòng này'] },
    { goi: goi('devicePath', {}, 1), an: true },
    { goi: goi('devicePath', { devices: [{ id: 5 }, { id: 4 }, { id: 3 }] }, 3), an: true },
  ],
});

export default doiDau({ slug: 'api-9-4-nosql', ten: '9.5 SQL vs NoSQL seen from the API', khoa: KHOA, baiHoc: 'api-9-4-nosql', de: [E1, E2] });
