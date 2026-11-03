/** Giảng theo slide — bài 11.1 Typing Express handlers (deck ts-11-1, 6 slide). */
import { walkTs } from '../_slides.mjs';
export default walkTs('ts-11-1', 'Typing Express handlers', 'Gõ kiểu handler Express', [
  [1, 'Typing Express handlers',
    `<p>Chapter 10 moved types across packages; now they meet a real backend. An Express handler is a function of a request and a response, and typing it is where most backend type safety comes from. We use a small typed model of the Express surface — the same shape the real @types/express gives you — so every example runs with Node and tsc.</p>`,
    `<p>Chương 10 đưa kiểu qua các package; giờ chúng gặp một backend thật. Một handler Express là một hàm của một request và một response, và gõ kiểu nó là nơi phần lớn an toàn kiểu của backend đến từ. Ta dùng một mô hình kiểu nhỏ của bề mặt Express — đúng dáng mà @types/express thật cho bạn — để mọi ví dụ chạy được với Node và tsc.</p>`],
  [2, 'What you will take away from this chapter',
    `<p>By the end you type a backend end to end: a handler with typed params, query and body (this lesson), a typed response so res.json cannot send the wrong shape (11.2), an API result envelope that forces you to handle errors (11.3), and a typed config and service layer (11.4). Lab 11: build a typed POST /bookings handler with a validated body and an error envelope.</p>`,
    `<p>Cuối chương bạn gõ kiểu một backend từ đầu đến cuối: một handler với params, query, body có kiểu (bài này), một response có kiểu để res.json không gửi sai dáng (11.2), một envelope kết quả API buộc bạn xử lý lỗi (11.3), và một tầng config và service có kiểu (11.4). Lab 11: dựng một handler POST /bookings có kiểu với body đã kiểm và một envelope lỗi.</p>`],
  [3, 'A handler with typed params',
    `<p>A Handler is generic over its params, query, body and response type. Give it a Params of { id: string } and req.params.id is a typed string — you read it with full autocompletion and no cast. The handler is just a function; the generics are what carry the route’s shape into the body.</p>`,
    `<p>Một Handler generic theo params, query, body và kiểu response của nó. Cho nó một Params là { id: string } và req.params.id là một string có kiểu — bạn đọc nó với gợi ý đầy đủ và không ép kiểu. Handler chỉ là một hàm; generic là thứ mang dáng của route vào thân.</p>`],
  [4, 'The typed request refuses a wrong param',
    `<p>Read a param that was not declared — req.params.labId when the route only has id — and it is TS2339. The typed request is a contract: the handler can only touch the params the route actually provides. A typo in a param name stops being a run-time undefined and becomes a compile error.</p>`,
    `<p>Đọc một param không được khai — req.params.labId khi route chỉ có id — và nó là TS2339. Request có kiểu là một hợp đồng: handler chỉ chạm được các param mà route thật sự cung cấp. Một lỗi gõ tên param thôi là một undefined lúc chạy mà thành một lỗi biên dịch.</p>`],
  [5, 'A handler, at a glance',
    `<p>Handler&lt;Params, Query, Body, Response&gt; carries four shapes: what the URL provides (params), what the query string provides, what the request body holds, and what the response sends. Typing each turns a handler from "req and res are any" into a function the compiler checks end to end. The real @types/express is this, with more overloads.</p>`,
    `<p>Handler&lt;Params, Query, Body, Response&gt; mang bốn dáng: URL cung cấp gì (params), query string cung cấp gì, body request giữ gì, và response gửi gì. Gõ kiểu mỗi cái biến một handler từ "req và res là any" thành một hàm trình biên dịch kiểm từ đầu đến cuối. @types/express thật là cái này, với nhiều overload hơn.</p>`],
  [6, 'Practice &amp; what is next',
    `<p>Practice: a handler reads req.params.code when the route declares only id — TS2339; read req.params.id instead and it runs. Next, 11.2: typing the response, so res.json is checked against the shape the route promises to send.</p>`,
    `<p>Luyện tập: một handler đọc req.params.code khi route chỉ khai id — TS2339; đọc req.params.id thay vào đó và nó chạy. Tiếp, 11.2: gõ kiểu response, để res.json được kiểm với dáng route hứa gửi.</p>`],
]);
