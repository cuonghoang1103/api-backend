/** Giảng theo slide — bài 11.2 "Rút gọn link (1)" (deck api-11-2, 6 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-11-2', 'URL shortener (1)', 'Rút gọn link (1)', [
  [1, 'Cover', `<p>The warm-up question that hides real decisions.</p>`, `<p>Đề khởi động giấu những quyết định thật.</p>`],
  [2, 'Five minutes', `<p>Who, custom codes, expiry, counts, how many — four lines in the corner.</p>`, `<p>Ai tạo, mã tự chọn (alias), hết hạn, đếm lượt, bao nhiêu — bốn dòng ở góc bảng.</p>`],
  [3, 'Contract', `<p>API under /v1, redirect at the root; checks in a fixed order.</p>`, `<p>API dưới /v1, chuyển hướng ở gốc; kiểm theo thứ tự cố định.</p>`],
  [4, 'Measured', `<p>409 alias, 422 bad URL, 410 expired, 429 on the sixth link.</p>`, `<p>409 alias, 422 URL sai, 410 hết hạn, 429 ở link thứ sáu.</p>`],
  [5, 'Codes', `<p>A million codes: random and hashed collide the same; a counter is guessable.</p>`, `<p>Một triệu mã: ngẫu nhiên và băm trùng như nhau (collision); bộ đếm thì đoán được.</p>`],
  [6, 'Choose', `<p>Random 7 characters plus a unique constraint. Next: 301 or 302.</p>`, `<p>Ngẫu nhiên 7 ký tự cộng ràng buộc unique. Tiếp theo: 301 hay 302.</p>`],
]);
