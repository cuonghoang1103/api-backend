/** Giảng theo slide — bài 11.3 API envelope & errors (deck ts-11-3, 6 slide). */
import { walkTs } from '../_slides.mjs';
export default walkTs('ts-11-3', 'The API result envelope', 'Envelope kết quả API', [
  [1, 'The API result envelope',
    `<p>A real endpoint does not always succeed. The cleanest way to type that is a result envelope — every response is either a success with data or a failure with an error. It is the discriminated union of Chapter 5, applied to a whole API: one shape the client reads, with a tag that says which case it is.</p>`,
    `<p>Một endpoint thật không phải lúc nào cũng thành công. Cách gõ kiểu điều đó gọn nhất là một envelope kết quả — mọi response hoặc là một thành công có data hoặc là một thất bại có error. Đó là discriminated union của Chương 5, áp cho cả một API: một dáng client đọc, với một nhãn nói đó là trường hợp nào.</p>`],
  [2, 'ApiResult: ok with data, or an error',
    `<p>ApiResult&lt;T&gt; is { ok: true; data: T } or { ok: false; error: {...} }. findBooking returns one or the other, and the discriminant ok narrows the union: on the ok branch you reach data, on the else branch you reach error. The envelope makes "this might fail" part of the type, not a convention.</p>`,
    `<p>ApiResult&lt;T&gt; là { ok: true; data: T } hoặc { ok: false; error: {...} }. findBooking trả cái này hoặc cái kia, và nhãn ok thu hẹp union: ở nhánh ok bạn với tới data, ở nhánh else bạn với tới error. Envelope làm "cái này có thể thất bại" thành một phần của kiểu, không phải một quy ước.</p>`],
  [3, 'You cannot read data without checking',
    `<p>Read r.data without checking r.ok and it is TS2339 — data does not exist on the error branch. The compiler forces the narrowing: you must handle the failure before you can touch the success. An endpoint that returns an envelope cannot have its errors silently ignored by a client.</p>`,
    `<p>Đọc r.data mà không kiểm r.ok và nó là TS2339 — data không tồn tại ở nhánh error. Trình biên dịch ép phép thu hẹp: bạn phải xử lý thất bại trước khi chạm thành công. Một endpoint trả một envelope không thể bị client âm thầm bỏ qua lỗi.</p>`],
  [4, 'The error is typed too',
    `<p>The error branch has its own shape — a code and a message — so the client reads r.error.code with the same safety as r.data. Typed errors are as valuable as typed data: a client can switch on the code, show the message, and the compiler checks that every error carries both. No stringly-typed errors, no guessing.</p>`,
    `<p>Nhánh error có dáng riêng — một code và một message — nên client đọc r.error.code với cùng an toàn như r.data. Lỗi có kiểu đáng giá như data có kiểu: một client switch theo code, hiện message, và trình biên dịch kiểm mọi lỗi mang cả hai. Không lỗi kiểu-chuỗi, không đoán.</p>`],
  [5, 'The envelope, at a glance',
    `<p>One ApiResult type covers every endpoint: success carries typed data, failure carries a typed error, and a tag tells them apart. The client narrows on ok and handles both. This is the discriminated union you built in Chapter 5, now the backbone of a typed API — the same pattern, at the scale of a whole service.</p>`,
    `<p>Một kiểu ApiResult phủ mọi endpoint: thành công mang data có kiểu, thất bại mang error có kiểu, và một nhãn phân biệt chúng. Client thu hẹp theo ok và xử lý cả hai. Đây là discriminated union bạn dựng ở Chương 5, giờ là xương sống của một API có kiểu — cùng mẫu, ở quy mô một service.</p>`],
  [6, 'Practice &amp; what is next',
    `<p>Practice: a function reads r.data.code without narrowing on ok — TS2339; return r.ok ? r.data.code : r.error.message and it compiles. Next, 11.4: the service and config layer — a read-only config built once, and a service that returns an envelope instead of throwing.</p>`,
    `<p>Luyện tập: một hàm đọc r.data.code mà không thu hẹp theo ok — TS2339; trả r.ok ? r.data.code : r.error.message và nó biên dịch. Tiếp, 11.4: tầng service và config — một config chỉ-đọc dựng một lần, và một service trả một envelope thay vì ném.</p>`],
]);
