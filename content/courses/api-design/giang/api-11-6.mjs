/** Giảng theo slide — bài 11.6 "Hệ thống đặt lịch" (deck api-11-6, 6 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-11-6', 'A booking system', 'Hệ thống đặt lịch', [
  [1, 'Cover', `<p>LabFlow is the answer; bring evidence.</p>`, `<p>LabFlow là câu trả lời; hãy mang bằng chứng.</p>`],
  [2, 'Evidence', `<p>Each claim with its number and lesson; use two or three.</p>`, `<p>Mỗi khẳng định kèm con số và tên bài; dùng hai ba dòng.</p>`],
  [3, 'Fifty at once', `<p>Check then insert: 50 bookings for one slot.</p>`, `<p>Kiểm rồi chèn: 50 lượt đặt cho một khung giờ.</p>`],
  [4, 'Compared', `<p>A lock, SERIALIZABLE or an exclusion constraint give exactly one.</p>`, `<p>Khoá dòng, SERIALIZABLE hay ràng buộc loại trừ đều cho đúng một.</p>`],
  [5, 'Holds', `<p>Expired holds still block; expire them where you insert.</p>`, `<p>Chỗ giữ hết hạn vẫn chặn; cho hết hạn ngay chỗ chèn.</p>`],
  [6, 'Summary', `<p>The 07:00 rush and the waitlist. Next: your mock interview.</p>`, `<p>Cú dồn 07:00 và hàng chờ. Tiếp theo: buổi phỏng vấn thử của bạn.</p>`],
]);
