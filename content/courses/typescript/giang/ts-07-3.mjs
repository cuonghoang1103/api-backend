/** Giảng theo slide — bài 7.3 Conditional types & infer (deck ts-07-3, 8 slide). */
import { walkTs } from '../_slides.mjs';

export default walkTs('ts-07-3', 'Conditional types &amp; infer', 'Conditional types &amp; infer', [
  [1, 'Conditional types &amp; infer',
    `<p>Mapped types rebuild a shape; conditional types choose a type based on a condition — an if at the type level. Write T extends U ? X : Y and the result depends on T. Add infer and you can pull a type out of another: the element of an array, the return of a function, the payload for an event.</p>`,
    `<p>Mapped type dựng lại một dáng; conditional type chọn một kiểu dựa trên một điều kiện — một if ở tầng kiểu. Viết T extends U ? X : Y và kết quả phụ thuộc T. Thêm infer là bạn rút được một kiểu ra khỏi kiểu khác: phần tử của mảng, kiểu trả về của hàm, payload của một sự kiện.</p>`],
  [2, 'A condition at the type level',
    `<p>T extends U ? X : Y reads "if T is assignable to U, the type is X, otherwise Y". IsArray of string[] is \'array\', IsArray of number is \'single\' — so assigning \'array\' to IsArray of number is TS2322. The same extends as a generic constraint, used to branch instead of to restrict.</p>`,
    `<p>T extends U ? X : Y đọc là "nếu T gán được vào U thì kiểu là X, không thì Y". IsArray của string[] là \'array\', IsArray của number là \'single\' — nên gán \'array\' cho IsArray của number là TS2322. Cùng extends như một ràng buộc generic, dùng để rẽ nhánh thay vì giới hạn.</p>`],
  [3, 'infer: capture a type inside a pattern',
    `<p>infer E introduces a type variable in the extends pattern: "if T is some array E[], capture that E". ElementType of string[] is string, of number[] is number, of boolean is boolean (not an array, so the : T branch). Assigning a string to ElementType of number[] is TS2322.</p>`,
    `<p>infer E giới thiệu một biến kiểu trong mẫu extends: "nếu T là một mảng E[] nào đó, bắt E đó". ElementType của string[] là string, của number[] là number, của boolean là boolean (không phải mảng, nên nhánh : T). Gán một string cho ElementType của number[] là TS2322.</p>`],
  [4, 'Capture a function’s return type',
    `<p>F extends (...args) => infer R ? R : never captures the type after the arrow. Return of typeof checkSlot is SlotResult — the compiler reads the function’s own signature, so this stays correct even when checkSlot changes. This is the built-in ReturnType&lt;F>.</p>`,
    `<p>F extends (...args) => infer R ? R : never bắt kiểu sau mũi tên. Return của typeof checkSlot là SlotResult — trình biên dịch đọc chính chữ ký của hàm, nên cái này vẫn đúng ngay cả khi checkSlot đổi. Đây là ReturnType&lt;F> dựng sẵn.</p>`],
  [5, 'Conditionals distribute over a union',
    `<p>When T is a union, a conditional is applied to each member separately, then joined: NoNull of (string | null | undefined) becomes never | never | string = string. So assigning null is TS2322 — the null was removed. This is NonNullable&lt;T>, and this distribution is why conditionals over unions are so useful.</p>`,
    `<p>Khi T là một union, một conditional được áp cho từng thành viên riêng, rồi nối lại: NoNull của (string | null | undefined) thành never | never | string = string. Nên gán null là TS2322 — null đã bị bỏ. Đây là NonNullable&lt;T>, và phép distribute này là vì sao conditional qua union hữu dụng.</p>`],
  [6, 'Looking up a payload by key (Lab 7)',
    `<p>EventPayloads extends Record&lt;E, infer P> ? P : never captures the payload stored under event name E. PayloadOf of booking:created is { id; lab }, of booking:cancelled is { id; reason } — the exact data each event carries. This is the conditional type at the heart of Lab 7’s typed emit.</p>`,
    `<p>EventPayloads extends Record&lt;E, infer P> ? P : never bắt payload lưu dưới tên sự kiện E. PayloadOf của booking:created là { id; lab }, của booking:cancelled là { id; reason } — đúng dữ liệu mỗi sự kiện mang. Đây là conditional type ở trái tim của emit có kiểu ở Lab 7.</p>`],
  [7, 'Which pattern, when',
    `<p>A plain conditional chooses a type; with infer you capture an array’s element or a function’s return; over a union it distributes (NonNullable); and a Record pattern looks a payload up by key. Together they compute types the way functions compute values.</p>`,
    `<p>Một conditional trơn chọn một kiểu; với infer bạn bắt phần tử của mảng hay kiểu trả về của hàm; qua một union nó distribute (NonNullable); và một mẫu Record tra một payload theo khoá. Gộp lại chúng tính kiểu như hàm tính giá trị.</p>`],
  [8, 'Practice &amp; what is next',
    `<p>Practice: UnwrapArray is typed any, so a wrong value slips — write it with T extends (infer E)[] ? E : T and the string value fails. Next, 7.4: template literal types build string types from other types — event names, route keys, getter names — so a typo is a compile error.</p>`,
    `<p>Luyện tập: UnwrapArray có kiểu any, nên một giá trị sai lọt — viết nó bằng T extends (infer E)[] ? E : T và giá trị chuỗi trượt. Tiếp, 7.4: template literal types dựng kiểu chuỗi từ kiểu khác — tên sự kiện, khoá route, tên getter — nên một lỗi gõ là lỗi biên dịch.</p>`],
]);
