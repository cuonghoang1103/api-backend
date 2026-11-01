/** Giảng theo slide — bài 12.2 "Migration, ràng buộc và dữ liệu mẫu" (deck api-12-2, 6 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-12-2', 'Migrations, constraints and seed data', 'Migration, ràng buộc và dữ liệu mẫu', [
  [1, 'Cover', `<p>The schema changes only through numbered files that run once.</p>`, `<p>Lược đồ chỉ đổi qua các tệp đánh số chạy đúng một lần.</p>`],
  [2, 'Runner', `<p>A lock, a history table, a checksum, one transaction per file.</p>`, `<p>Một khoá, một bảng lịch sử, một checksum, mỗi tệp một transaction.</p>`],
  [3, 'Run twice', `<p>The second run does nothing, so a deploy can always call it.</p>`, `<p>Lần chạy thứ hai không làm gì, nên lần triển khai nào cũng gọi được.</p>`],
  [4, 'Mistakes', `<p>Edited history is refused; a broken file rolls back whole; two runners queue.</p>`, `<p>Lịch sử bị sửa thì bị từ chối; tệp hỏng rollback trọn; hai bộ chạy xếp hàng.</p>`],
  [5, 'Locks', `<p>A volatile default or a plain index locks writes for seconds; CONCURRENTLY does not.</p>`, `<p>Mặc định thay đổi theo dòng hay index thường khoá ghi vài giây; CONCURRENTLY thì không.</p>`],
  [6, 'Constraints', `<p>The database refuses bad rows even from raw SQL; expand, then contract.</p>`, `<p>CSDL từ chối dòng sai kể cả từ SQL tay; mở rộng trước, thu gọn sau.</p>`],
]);
