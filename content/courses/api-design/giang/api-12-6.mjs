/** Giảng theo slide — bài 12.6 "Đo tải lại" (deck api-12-6, 6 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-12-6', 'Re-measuring the load', 'Đo tải lại', [
  [1, 'Cover', `<p>Did PostgreSQL make LabFlow slower? Measure, then explain.</p>`, `<p>PostgreSQL có làm LabFlow chậm đi không? Đo, rồi giải thích.</p>`],
  [2, 'Setups', `<p>Four setups, three rounds, load average recorded; one round discarded.</p>`, `<p>Bốn cấu hình, ba lượt, có ghi load average; bỏ một lượt.</p>`],
  [3, 'Raw result', `<p>The bookings list: about 1,300 requests per second in RAM, 2,900 on PostgreSQL.</p>`, `<p>Danh sách lượt đặt: chừng 1.300 request mỗi giây trong RAM, 2.900 trên PostgreSQL.</p>`],
  [4, 'Table', `<p>Lists and writes got faster, the tiny labs list slower, logins unchanged.</p>`, `<p>Danh sách và lệnh ghi nhanh hơn, danh sách phòng nhỏ chậm hơn, đăng nhập không đổi.</p>`],
  [5, 'Why', `<p>Indexes beat array scans; one laptop adds no capacity; publish ranges.</p>`, `<p>Index thắng quét mảng; một máy không thêm sức chứa; công bố khoảng.</p>`],
  [6, 'Contract', `<p>2.4.0 with zero breaking changes; drift checks shapes, not truth.</p>`, `<p>2.4.0 không thay đổi phá vỡ nào; kiểm trôi kiểm hình dạng, không kiểm sự thật.</p>`],
]);
