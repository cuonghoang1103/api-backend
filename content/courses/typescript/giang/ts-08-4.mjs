/** Giảng theo slide — bài 8.4 Exclude, NonNullable, ReturnType, Parameters & Awaited (deck ts-08-4, 8 slide). */
import { walkTs } from '../_slides.mjs';

export default walkTs('ts-08-4', 'Exclude, NonNullable, ReturnType &amp; Awaited', 'Exclude, NonNullable, ReturnType &amp; Awaited', [
  [1, 'Exclude, NonNullable, ReturnType &amp; Awaited',
    `<p>The last utilities do two jobs: filter a union, and read a type out of existing code. Exclude and NonNullable remove members from a union; ReturnType, Parameters and Awaited pull the result, the arguments and the resolved value out of a function. All of them are the conditional types of 7.3, named — so you never re-declare a type that already exists.</p>`,
    `<p>Những utility cuối làm hai việc: lọc một union, và đọc một kiểu ra từ mã có sẵn. Exclude và NonNullable bỏ thành viên khỏi một union; ReturnType, Parameters và Awaited rút kết quả, tham số và giá trị đã resolve ra từ một hàm. Tất cả là conditional type của 7.3, được đặt tên — nên bạn không bao giờ khai lại một kiểu đã tồn tại.</p>`],
  [2, 'Exclude: remove members from a union',
    `<p>Exclude of Status and CANCELLED is the union of the states a booking can still move to — PENDING or CONFIRMED. Assigning CANCELLED to it is TS2322. It distributes over the union, dropping the members you name, which is how you derive one union from another instead of writing a second list that can drift.</p>`,
    `<p>Exclude của Status và CANCELLED là union các trạng thái một booking còn chuyển tới được — PENDING hoặc CONFIRMED. Gán CANCELLED cho nó là TS2322. Nó distribute qua union, bỏ các thành viên bạn nêu, đó là cách bạn suy một union từ union khác thay vì viết một danh sách thứ hai có thể trôi.</p>`],
  [3, 'NonNullable: drop null and undefined',
    `<p>NonNullable of a union removes null and undefined — the special case of Exclude you reach for after a guard. Assigning null to NonNullable of string or null is TS2322. You met the mechanism in 7.3 (a distributive conditional); here it is one word for the most common filter there is.</p>`,
    `<p>NonNullable của một union bỏ null và undefined — trường hợp đặc biệt của Exclude bạn dùng sau một guard. Gán null cho NonNullable của string hoặc null là TS2322. Bạn đã gặp cơ chế ở 7.3 (một conditional distribute); ở đây nó là một từ cho phép lọc hay gặp nhất.</p>`],
  [4, 'ReturnType: read a function’s result',
    `<p>ReturnType of typeof checkSlot is the result type of checkSlot, read straight from the function. No second declaration to keep in sync: change checkSlot and the type follows. typeof turns the value into its type (1.3), and ReturnType captures what comes after the arrow — the named form of the infer trick in 7.3.</p>`,
    `<p>ReturnType của typeof checkSlot là kiểu kết quả của checkSlot, đọc thẳng từ hàm. Không có khai báo thứ hai phải giữ đồng bộ: đổi checkSlot thì kiểu theo. typeof biến giá trị thành kiểu của nó (1.3), và ReturnType bắt cái sau mũi tên — dạng có tên của mẹo infer ở 7.3.</p>`],
  [5, 'Parameters: read the argument list',
    `<p>Parameters of typeof createBooking is a tuple of its argument types. A wrapper, a logger or a retry can store the arguments in that tuple and spread them back, and it stays in step with the function — add an argument and the tuple grows. It is ReturnType for the other side of the arrow.</p>`,
    `<p>Parameters của typeof createBooking là một tuple các kiểu tham số của nó. Một wrapper, một logger hay một retry có thể lưu các đối số trong tuple đó rồi spread lại, và nó bám theo hàm — thêm một đối số thì tuple lớn theo. Nó là ReturnType cho phía kia của mũi tên.</p>`],
  [6, 'Awaited: unwrap a Promise',
    `<p>An async function returns a Promise; Awaited unwraps it to the value you actually have after await. Awaited of ReturnType of typeof fetchBooking is Booking, not Promise of Booking. It even unwraps a Promise of a Promise. This is the type you want everywhere you write await, read straight from the async function.</p>`,
    `<p>Một hàm async trả một Promise; Awaited mở nó thành giá trị bạn thật sự có sau await. Awaited của ReturnType của typeof fetchBooking là Booking, không phải Promise của Booking. Nó mở cả một Promise của một Promise. Đây là kiểu bạn muốn ở mọi chỗ viết await, đọc thẳng từ hàm async.</p>`],
  [7, 'Read types, do not re-declare them',
    `<p>Exclude and NonNullable derive one union from another; ReturnType, Parameters and Awaited derive types from a function’s own signature. The common thread: never write by hand a type that already exists in the code — a copy drifts, a derived type cannot. This is the whole chapter in one sentence.</p>`,
    `<p>Exclude và NonNullable suy một union từ union khác; ReturnType, Parameters và Awaited suy kiểu từ chính chữ ký của một hàm. Sợi chỉ chung: đừng bao giờ viết tay một kiểu đã tồn tại trong code — một bản sao trôi, một kiểu suy ra thì không. Đây là cả chương trong một câu.</p>`],
  [8, 'Practice &amp; what is next',
    `<p>Practice: a wrapper re-declares checkSlot’s return type by hand and it has already drifted (minutes typed string) — TS2322; derive it with ReturnType of typeof checkSlot. Next is Lab 8: rebuild Partial, Pick and Omit from scratch, then use them to build the API DTO layer — the starter scores 5, the reference 10.</p>`,
    `<p>Luyện tập: một wrapper khai lại kiểu trả về của checkSlot bằng tay và nó đã trôi (minutes kiểu string) — TS2322; suy nó bằng ReturnType của typeof checkSlot. Tiếp là Lab 8: dựng lại Partial, Pick, Omit từ số 0, rồi dùng chúng dựng tầng DTO của API — starter được 5, bản tham khảo 10.</p>`],
]);
