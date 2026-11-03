/** Giảng theo slide — bài 11.2 Typed responses (deck ts-11-2, 6 slide). */
import { walkTs } from '../_slides.mjs';
export default walkTs('ts-11-2', 'Typed responses', 'Response có kiểu', [
  [1, 'Typed responses',
    `<p>A handler reads a typed request; it should also send a typed response. When the response type is part of the handler, res.json checks that what you send matches the shape the route promises — so a missing field or a wrong type is caught before the response ever leaves the server.</p>`,
    `<p>Một handler đọc một request có kiểu; nó cũng nên gửi một response có kiểu. Khi kiểu response là một phần của handler, res.json kiểm thứ bạn gửi khớp dáng route hứa — nên một trường thiếu hay một kiểu sai bị bắt trước khi response rời máy chủ.</p>`],
  [2, 'res.json checks the shape',
    `<p>Give the handler a response type of Booking and res.json takes a Booking — nothing else. Send { id, lab, seats } with the right types and it compiles and runs. The response is no longer "whatever object you happen to build"; it is a value the compiler verifies against the contract.</p>`,
    `<p>Cho handler một kiểu response là Booking và res.json nhận một Booking — không gì khác. Gửi { id, lab, seats } với đúng kiểu và nó biên dịch và chạy. Response thôi là "object nào bạn tình cờ dựng"; nó là một giá trị trình biên dịch kiểm với hợp đồng.</p>`],
  [3, 'A wrong field is refused',
    `<p>Send seats as a string and it is TS2322 — the typed response will not let a wrong type through. This is the server-side mirror of a typed API client: the handler cannot send a shape the route did not declare, so the response and its documentation can never drift apart.</p>`,
    `<p>Gửi seats là một string và nó là TS2322 — response có kiểu không cho một kiểu sai lọt. Đây là ảnh gương phía máy chủ của một API client có kiểu: handler không gửi được một dáng route không khai, nên response và tài liệu của nó không bao giờ lệch nhau.</p>`],
  [4, 'A missing field is refused too',
    `<p>Leave out a required field — a Lab without its seats — and it is TS2741. Together with the wrong-type check, the typed response guarantees completeness and correctness: every field the route promises is present, and each has the right type. The client that reads this response can trust its shape.</p>`,
    `<p>Bỏ sót một trường bắt buộc — một Lab không có seats — và nó là TS2741. Cùng với phép kiểm sai-kiểu, response có kiểu bảo đảm đầy đủ và đúng đắn: mọi trường route hứa đều có, và mỗi cái đúng kiểu. Client đọc response này tin được dáng của nó.</p>`],
  [5, 'The response, at a glance',
    `<p>Res&lt;T&gt; carries the body type through status() and into json(). A handler whose response type is Booking sends a Booking or does not compile. The lesson is the same as every typed boundary in this course: make the contract a type, and the two sides cannot drift — here the handler and the client that consumes it.</p>`,
    `<p>Res&lt;T&gt; mang kiểu body qua status() và vào json(). Một handler mà kiểu response là Booking gửi một Booking hoặc không biên dịch. Bài học như mọi biên giới có kiểu trong khoá: làm hợp đồng thành một kiểu, và hai phía không lệch được — ở đây là handler và client tiêu thụ nó.</p>`],
  [6, 'Practice &amp; what is next',
    `<p>Practice: a handler sends a Lab without its seats field — TS2741; add the field and it compiles and runs. Next, 11.3: the API envelope — a result type that is either success with data or a failure with an error, so the client is forced to handle both.</p>`,
    `<p>Luyện tập: một handler gửi một Lab không có trường seats — TS2741; thêm trường và nó biên dịch và chạy. Tiếp, 11.3: envelope API — một kiểu kết quả hoặc là thành công có data hoặc là thất bại có error, để client buộc phải xử lý cả hai.</p>`],
]);
