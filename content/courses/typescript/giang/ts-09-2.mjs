/** Giảng theo slide — bài 9.2 strict mode (deck ts-09-2, 7 slide). */
import { walkTs } from '../_slides.mjs';

export default walkTs('ts-09-2', 'strict mode', 'Chế độ strict', [
  [1, 'strict mode',
    `<p>One flag, strict, turns on the checks that make TypeScript worth using. It is an umbrella over several flags; the two you feel most are noImplicitAny (no untyped value slips in) and strictNullChecks (null and undefined are their own types). With strict off, most of this course’s bugs compile silently.</p>`,
    `<p>Một cờ, strict, bật các phép kiểm làm TypeScript đáng dùng. Nó là một chiếc ô trên vài cờ; hai cái bạn cảm nhận rõ nhất là noImplicitAny (không giá trị nào lọt vào mà không có kiểu) và strictNullChecks (null và undefined là kiểu riêng). Tắt strict, phần lớn bug của khoá này biên dịch âm thầm.</p>`],
  [2, 'noImplicitAny: no silent any',
    `<p>parse takes raw with no type. Under strict that is TS7006 — a parameter that would otherwise be any, which turns off every check inside the function. noImplicitAny forces you to say what raw is, so the compiler can check the .trim() and .toUpperCase() you call on it. A silent any is a hole in the type system; this flag closes it.</p>`,
    `<p>parse nhận raw không có kiểu. Dưới strict đó là TS7006 — một tham số lẽ ra là any, thứ tắt mọi phép kiểm trong hàm. noImplicitAny buộc bạn nói raw là gì, để trình biên dịch kiểm được .trim() và .toUpperCase() bạn gọi trên nó. Một any âm thầm là một lỗ trong hệ kiểu; cờ này bịt nó.</p>`],
  [3, 'strictNullChecks: null is its own type',
    `<p>find may return undefined, so reading u.name is TS18048, u is possibly undefined. Without strictNullChecks, null and undefined are assignable to everything and this crash ships. With it, undefined is a type you must handle — a guard, a default, or ?. — before you touch the value. This single flag prevents the most common run-time error there is.</p>`,
    `<p>find có thể trả undefined, nên đọc u.name là TS18048, u có thể undefined. Không có strictNullChecks, null và undefined gán được vào mọi thứ và cú sập này lên sản phẩm. Có nó, undefined là một kiểu bạn phải xử lý — một guard, một mặc định, hay ?. — trước khi chạm giá trị. Một cờ này ngăn lỗi lúc chạy hay gặp nhất.</p>`],
  [4, 'The same file, loose vs strict',
    `<p>greet has an implicit any and an unguarded possibly-undefined value. Under strict:false it compiles with 0 errors — both bugs hidden. Flip strict on and the same file reports both: TS7006 and TS18048. The code did not change; the question tsc was asked did. strict is the question "is this actually safe?".</p>`,
    `<p>greet có một implicit any và một giá trị có-thể-undefined không chặn. Dưới strict:false nó biên dịch 0 lỗi — cả hai bug ẩn. Bật strict và cùng tệp đó báo cả hai: TS7006 và TS18048. Code không đổi; câu hỏi đặt cho tsc đổi. strict là câu hỏi "cái này thật sự an toàn chưa?".</p>`],
  [5, 'What the strict umbrella turns on',
    `<p>strict is shorthand for a set: noImplicitAny, strictNullChecks, strictFunctionTypes, strictBindCallApply, strictPropertyInitialization, noImplicitThis, useUnknownInCatchVariables and alwaysStrict. You can toggle one off by name, but the course — like most real projects — leaves the whole umbrella on. It is the default even when you run tsc with no config at all.</p>`,
    `<p>strict là cách gọi tắt một tập: noImplicitAny, strictNullChecks, strictFunctionTypes, strictBindCallApply, strictPropertyInitialization, noImplicitThis, useUnknownInCatchVariables và alwaysStrict. Bạn tắt được một cái theo tên, nhưng khoá — như hầu hết dự án thật — để cả chiếc ô bật. Nó là mặc định kể cả khi bạn chạy tsc không có config nào.</p>`],
  [6, 'Why the umbrella matters',
    `<p>Each flag closes a different hole, and they reinforce each other: strictNullChecks is only useful if noImplicitAny stops an any from erasing the null in the first place. Turning strict off "to make the build pass" does not fix anything — it just stops asking the questions. The honest move is strict on, then fix what it finds.</p>`,
    `<p>Mỗi cờ bịt một lỗ khác nhau, và chúng củng cố nhau: strictNullChecks chỉ hữu ích nếu noImplicitAny chặn một any xoá mất cái null ngay từ đầu. Tắt strict "để build qua" không sửa gì — nó chỉ ngừng hỏi. Nước đi trung thực là bật strict, rồi sửa những gì nó tìm ra.</p>`],
  [7, 'Practice &amp; what is next',
    `<p>Practice: a label function with an implicit-any parameter and an unguarded lookup fails under strict — type the parameter and guard the value, and it runs. Next, 9.3: the safety flags that are not in the strict umbrella but are worth adding — noUncheckedIndexedAccess, noImplicitReturns, noUnusedLocals.</p>`,
    `<p>Luyện tập: một hàm label với tham số implicit-any và một lần tra không chặn trượt dưới strict — gán kiểu cho tham số và chặn giá trị, và nó chạy. Tiếp, 9.3: các cờ an toàn không nằm trong chiếc ô strict nhưng đáng thêm — noUncheckedIndexedAccess, noImplicitReturns, noUnusedLocals.</p>`],
]);
