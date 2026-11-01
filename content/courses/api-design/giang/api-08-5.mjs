/** Giảng theo slide — bài 8.5 "SLO và bỏ bớt tải" (deck api-08-5, 9 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-08-5', 'SLOs and load shedding', 'SLO và bỏ bớt tải', [
  [1, 'Cover', `<p>Accepting fewer requests got more people in.</p>`, `<p>Nhận ít request hơn lại cho nhiều người vào hơn.</p>`],
  [2, 'What you will get', `<p>SLOs in minutes, then overload measured and fixed.</p>`, `<p>SLO đổi ra phút, rồi đo và sửa quá tải.</p>`],
  [3, 'SLI, SLO, SLA', `<p>99.9% is 43 minutes a month; chains multiply.</p>`, `<p>99,9% là 43 phút mỗi tháng; chuỗi phụ thuộc nhân với nhau.</p>`],
  [4, 'Measure like a user', `<p>A probe from outside sees what logs miss.</p>`, `<p>Bộ đo từ bên ngoài thấy thứ log bỏ sót.</p>`],
  [5, 'Overload', `<p>Goodput fell to 12/s while the server stayed busy.</p>`, `<p>Goodput tụt còn 12/s trong khi server vẫn bận.</p>`],
  [6, 'Load shedding', `<p>Refuse early with 503 and Retry-After.</p>`, `<p>Từ chối sớm bằng 503 kèm Retry-After.</p>`],
  [7, 'Measured with shedding', `<p>123 answered logins per second, no abandoned work.</p>`, `<p>123 lượt được trả lời mỗi giây, không còn việc bị bỏ rơi.</p>`],
  [8, 'Interview answers', `<p>429 is your quota; 503 is the service.</p>`, `<p>429 là hạn mức của bạn; 503 là của dịch vụ.</p>`],
  [9, 'Summary', `<p>Next: the database goes down.</p>`, `<p>Tiếp theo: CSDL sập.</p>`],
]);
