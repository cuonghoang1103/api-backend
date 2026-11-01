/** Giảng theo slide — bài Lab 9 "Lab 9 — Luồng ghi chú" (deck api-lab-9, 5 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-lab-9', 'Lab 9 — Notes feed', 'Lab 9 — Luồng ghi chú', [
  [1, 'Cover', `<p>Change the contract and measure every step.</p>`, `<p>Đổi hợp đồng và đo từng bước.</p>`],
  [2, 'Six tasks', `<p>IDs, cursor, revalidation, consistency, contract.</p>`, `<p>Định danh, cursor, kiểm lại, nhất quán, hợp đồng.</p>`],
  [3, 'The solution', `<p>One index lookup decides the 304.</p>`, `<p>Một lần dò chỉ mục quyết định 304.</p>`],
  [4, 'Measured', `<p>Deep pages as fast as the first; polling costs a 304.</p>`, `<p>Trang sâu nhanh như trang đầu; hỏi lại chỉ tốn một 304.</p>`],
  [5, 'Rubric', `<p>Ten points across six tasks; next: Chapter 10.</p>`, `<p>Mười điểm cho sáu nhiệm vụ; tiếp theo: Chương 10.</p>`],
]);
