/** Giảng theo slide — bài 12.3 Typing events (deck ts-12-3, 6 slide). */
import { walkTs } from '../_slides.mjs';
export default walkTs('ts-12-3', 'Typing events', 'Gõ kiểu sự kiện', [
  [1, 'Typing events',
    `<p>A handler receives an event, and a typed event is where the frontend meets the DOM safely. In our model a ChangeEvent carries a target with a value — a string — the same shape the real React types give you, specialised in the full library by the element that fired the event.</p>`,
    `<p>Một handler nhận một sự kiện, và một sự kiện có kiểu là nơi frontend gặp DOM một cách an toàn. Trong mô hình của ta, một ChangeEvent mang một target với một value — một string — đúng dáng mà kiểu React thật cho bạn, được chuyên biệt hoá trong thư viện đầy đủ theo phần tử phát ra sự kiện.</p>`],
  [2, 'A change handler: e.target.value is a string',
    `<p>Type the parameter as ChangeEvent and e.target.value is a string — so e.target.value.toUpperCase() is valid. The value of an input is always a string, even for a number input; the type says so, and the handler is checked against it.</p>`,
    `<p>Gõ kiểu tham số là ChangeEvent và e.target.value là một string — nên e.target.value.toUpperCase() hợp lệ. Value của một input luôn là một string, kể cả với input số; kiểu nói vậy, và handler được kiểm dựa trên nó.</p>`],
  [3, 'The typed event refuses a wrong read',
    `<p>Read e.value instead of e.target.value and it is TS2339 — the value is nested under target, not on the event. Assign e.target.value to a number and it is TS2322 — the value is a string, so you must parse it with Number() before you can treat it as a number.</p>`,
    `<p>Đọc e.value thay vì e.target.value và nó là TS2339 — value nằm trong target, không ở trên sự kiện. Gán e.target.value cho một number và nó là TS2322 — value là một string, nên bạn phải phân tích nó bằng Number() trước khi coi nó là số.</p>`],
  [4, 'The real React event types',
    `<p>In the full library the event is generic over its element: ChangeEvent&lt;HTMLInputElement&gt; for inputs, FormEvent&lt;HTMLFormElement&gt; for a form’s onSubmit, MouseEvent for clicks. That generic is what makes e.target.value a string and e.target.checked a boolean. Written inline in JSX, TypeScript infers all of it; you name the type only for a standalone handler.</p>`,
    `<p>Trong thư viện đầy đủ, sự kiện là generic trên phần tử của nó: ChangeEvent&lt;HTMLInputElement&gt; cho input, FormEvent&lt;HTMLFormElement&gt; cho onSubmit của form, MouseEvent cho click. Cái generic đó làm e.target.value thành string và e.target.checked thành boolean. Viết thẳng trong JSX, TypeScript suy ra hết; bạn chỉ đặt tên kiểu cho một handler riêng.</p>`],
  [5, 'At a glance — and target vs currentTarget',
    `<p>A typed event gives a typed target: value is a string, an undeclared field is a compile error. The trap: e.currentTarget is the element you bound the handler to; e.target is whatever was actually hit, which may be a child. On an input onChange they coincide; on a div wrapping a button they do not. Read currentTarget when you mean "the element I bound to".</p>`,
    `<p>Một sự kiện có kiểu cho một target có kiểu: value là một string, một trường không khai là một lỗi biên dịch. Bẫy: e.currentTarget là element bạn gắn handler vào; e.target là thứ thật sự bị chạm, có thể là một con. Trên onChange của input thì chúng trùng; trên một div bọc một nút thì không. Hãy đọc currentTarget khi bạn muốn nói "element tôi gắn vào".</p>`],
  [6, 'Practice & what is next',
    `<p>Practice: a handler returns Number(e.value) — TS2339; read e.target.value and it runs, returning the parsed number. Next, 12.4: a typed context that forces the no-provider check, and a generic component that adapts to any data.</p>`,
    `<p>Luyện tập: một handler trả Number(e.value) — TS2339; đọc e.target.value và nó chạy, trả về số đã phân tích. Tiếp, 12.4: một context có kiểu buộc phép kiểm không-provider, và một component generic thích ứng với mọi dữ liệu.</p>`],
]);
