/** Giảng theo slide — bài 7.4 "Thiết kế trước hay code trước" (deck api-07-4, 8 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-07-4', "Design-first vs code-first", "Thiết kế trước hay code trước", [
  [1, "Cover", `<p>Who writes the contract first?</p>`, `<p>Ai viết hợp đồng trước?</p>`],
  [2, "Two ways", `<p>Design-first reviews and mocks the contract before code; code-first generates it from code.</p>`,
    `<p>Thiết kế trước review và dựng mock cho hợp đồng trước khi code; code trước sinh nó từ code.</p>`],
  [3, "Code-first measured", `<p>Zod exports the shape but drops trim without a warning.</p>`,
    `<p>Zod xuất được hình dạng nhưng lặng lẽ bỏ mất trim.</p>`],
  [4, "Prism mock", `<p>Examples make the mock useful; watch for 422 instead of 400 and the Accept header.</p>`,
    `<p>Ví dụ làm mock hữu ích; cẩn thận 422 thay cho 400 và header Accept.</p>`],
  [5, "Spectral", `<p>Team rules become lint rules: four errors on a bad pull request, none on LabFlow.</p>`,
    `<p>Luật của đội thành luật lint: bốn lỗi với pull request xấu, không lỗi nào với LabFlow.</p>`],
  [6, "Diff gate", `<p>openapi-diff could not read 3.1, so LabFlow’s gate applies Chapter 4’s table and exits 1 on breaking changes.</p>`,
    `<p>openapi-diff không đọc được 3.1, nên cổng của LabFlow áp bảng của Chương 4 và thoát mã 1 khi có thay đổi phá vỡ.</p>`],
  [7, "Traps", `<p>Do not trust the mock’s status codes or a tool’s claims; measure.</p>`,
    `<p>Đừng tin mã trạng thái của mock hay lời quảng cáo của công cụ; hãy đo.</p>`],
  [8, "Summary", `<p>Mock, style guide and gate make design-first work. Next: GraphQL and gRPC.</p>`,
    `<p>Mock, bộ luật phong cách và cổng chặn giúp design-first chạy được. Bài sau: GraphQL và gRPC.</p>`],
]);
