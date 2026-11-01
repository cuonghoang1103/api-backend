/** Giảng theo slide — bài 11.1 "Khung trả lời câu hỏi phỏng vấn thiết kế API" (deck api-11-1, 6 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-11-1', 'A 45-minute framework', 'Khung trả lời 45 phút', [
  [1, 'Cover', `<p>Five steps, one rubric, and your own numbers.</p>`, `<p>Năm bước, một thang chấm, và con số của chính bạn.</p>`],
  [2, 'What is scored', `<p>Six habits, not one right answer: ask, structure, think about failure, state trade-offs, communicate.</p>`, `<p>Sáu thói quen, không phải một đáp án đúng: hỏi, có cấu trúc, nghĩ tới chỗ hỏng, nói ra đánh đổi (trade-off), giao tiếp.</p>`],
  [3, 'The plan', `<p>Clarify and size, contract, failures, security, scale — glance at the clock at each step.</p>`, `<p>Làm rõ và ước lượng, hợp đồng, chỗ hỏng, bảo mật, quy mô — liếc đồng hồ ở mỗi bước.</p>`],
  [4, 'Size it', `<p>The average is useless; the 07:00 peak against a measured capacity points to the real risk.</p>`, `<p>Trung bình vô nghĩa; đỉnh (peak) lúc 07:00 so với công suất đã đo mới chỉ ra rủi ro thật.</p>`],
  [5, 'The contract', `<p>One line per endpoint; each failure gets a code and a header that fixes it.</p>`, `<p>Mỗi endpoint một dòng; mỗi chỗ hỏng có một mã và một header sửa nó.</p>`],
  [6, 'The rubric', `<p>Six rows, 1–3 each; 13 of 18 is strong. Next: the URL shortener.</p>`, `<p>Sáu dòng, mỗi dòng 1–3 điểm; 13/18 là mạnh. Tiếp theo: rút gọn link.</p>`],
]);
