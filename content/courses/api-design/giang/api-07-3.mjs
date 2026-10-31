/** Giảng theo slide — bài 7.3 "Sinh tài liệu, client và bộ validate" (deck api-07-3, 8 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-07-3', "Generating docs, clients and validators", "Sinh tài liệu, client và bộ validate", [
  [1, "Cover",
    `<p>Lesson 7.3 turns the document into things people, client code and the server can use.</p>`,
    `<p>Bài 7.3 biến tài liệu thành thứ mà người đọc, code client và server dùng được.</p>`],
  [2, "One file, three outputs",
    `<p>A documentation page for people, TypeScript types for client code, and a comparison with the server’s Zod validators.</p>`,
    `<p>Trang tài liệu cho người, kiểu TypeScript cho code client, và phép so với bộ validate Zod của server.</p>`],
  [3, "Docs the server publishes",
    `<p>Two routes publish the Redoc page and the raw YAML at fixed URLs. The page is 280 KiB and loads its script from a CDN unless you inline it.</p>`,
    `<p>Hai route công bố trang Redoc và tệp YAML gốc ở URL cố định. Trang nặng 280 KiB và tải script từ CDN trừ khi bạn nhúng sẵn.</p>`],
  [4, "Types for the client",
    `<p>openapi-typescript writes 813 lines of types, openapi-fetch uses them; the typed client books a lab and gets 201, then 409. It needed TypeScript 5, not 7.</p>`,
    `<p>openapi-typescript viết 813 dòng kiểu, openapi-fetch dùng chúng; client có kiểu đặt phòng nhận 201, rồi 409. Nó cần TypeScript 5, không phải 7.</p>`],
  [5, "What the types catch",
    `<p>A typo, a possible null, an impossible status and a missing path parameter all fail at compile time — each would have been a real failure at run time.</p>`,
    `<p>Gõ sai tên, một giá trị có thể null, một trạng thái không tồn tại và một tham số đường dẫn bị quên đều trượt lúc biên dịch — cái nào cũng là một lỗi thật lúc chạy.</p>`],
  [6, "When the contract changes",
    `<p>Renaming period to slot breaks the client’s build at the exact line, before any user sees it. Never edit the generated file; whether a rename may ship is the next lesson.</p>`,
    `<p>Đổi period thành slot làm build của client đỏ đúng dòng đó, trước khi người dùng nào thấy. Đừng sửa tay tệp sinh ra; đổi tên có được phát hành hay không là chuyện bài sau.</p>`],
  [7, "Validators",
    `<p>The document and Zod agree on shape but not on trimming, and neither checks business rules — the handler does, with 422. A v1 field name in a v2 message was found by reading.</p>`,
    `<p>Tài liệu và Zod đồng ý về hình dạng nhưng không về trim, và không bên nào kiểm luật nghiệp vụ — handler kiểm, trả 422. Tên trường v1 trong câu báo v2 là do người đọc phát hiện.</p>`],
  [8, "Summary",
    `<p>Published docs, compile-time safety for clients, and three validation layers. Next: design-first.</p>`,
    `<p>Tài liệu được công bố, client an toàn ngay lúc biên dịch, và ba lớp validate. Bài sau: thiết kế trước.</p>`],
]);
