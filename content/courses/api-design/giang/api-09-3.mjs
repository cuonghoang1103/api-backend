/** Giảng theo slide — bài 9.3 "Đọc-sau-ghi" (deck api-09-3, 6 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-09-3', 'Read-after-write', 'Đọc-sau-ghi', [
  [1, 'Cover', `<p>A real replica, and a fix in the contract.</p>`, `<p>Một replica thật, và cách sửa trong hợp đồng.</p>`],
  [2, 'Primary and replica', `<p>The replica applies commits two seconds late.</p>`, `<p>Replica áp dụng commit trễ hai giây.</p>`],
  [3, 'Write, then read', `<p>The new note is 404 on the replica.</p>`, `<p>Ghi chú mới là 404 trên replica.</p>`],
  [4, 'Three fixes', `<p>Return the result, read your writes, or send a token.</p>`, `<p>Trả kết quả, đọc cái mình ghi, hoặc gửi token.</p>`],
  [5, 'The token, measured', `<p>Primary while lagging, replica once caught up.</p>`, `<p>Primary khi còn chậm, replica khi đã kịp.</p>`],
  [6, 'Summary', `<p>Next: IDs and sharding.</p>`, `<p>Tiếp theo: định danh và sharding.</p>`],
]);
