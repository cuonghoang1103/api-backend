/** Giảng theo slide — bài 7.4 Template literal types (deck ts-07-4, 8 slide). */
import { walkTs } from '../_slides.mjs';

export default walkTs('ts-07-4', 'Template literal types', 'Template literal types (kiểu chuỗi mẫu)', [
  [1, 'Template literal types',
    `<p>A template literal type builds a string type out of other types, the way a template string builds a value. booking: plus an action turns a union of actions into a union of event names; two unions make every combination; Uppercase and friends transform the string; and as in a mapped type renames keys.</p>`,
    `<p>Một template literal type dựng một kiểu chuỗi từ kiểu khác, như một template string dựng một giá trị. booking: cộng một action biến một union action thành một union tên sự kiện; hai union cho mọi tổ hợp; Uppercase và bạn bè biến đổi chuỗi; và as trong một mapped type đổi tên khoá.</p>`],
  [2, 'One string per union member',
    `<p>The template reads like a template string, but at the type level: for each member of BookingAction it produces booking: plus the member, so the type is booking:created | booking:confirmed | booking:cancelled. Add an action and the event names grow with it — one source of truth for the whole set.</p>`,
    `<p>Mẫu đọc như một template string, nhưng ở tầng kiểu: với mỗi thành viên của BookingAction nó sinh booking: cộng thành viên, nên kiểu là booking:created | booking:confirmed | booking:cancelled. Thêm một action thì các tên sự kiện lớn theo — một nguồn sự thật cho cả tập.</p>`],
  [3, 'Two unions: every combination',
    `<p>With two unions in one template, the type is the cartesian product — 2 x 2 = 4 keys. A Record over MessageKey then forces every combination to have a value, so a missing footer.vi would be a compile error. This is how a translation table or a design-token map stays complete.</p>`,
    `<p>Với hai union trong một mẫu, kiểu là tích Descartes — 2 x 2 = 4 khoá. Một Record qua MessageKey rồi ép mọi tổ hợp phải có giá trị, nên thiếu footer.vi sẽ là lỗi biên dịch. Đây là cách một bảng dịch hay một bản đồ design-token giữ đủ.</p>`],
  [4, 'Transforming the string',
    `<p>TypeScript ships four intrinsic string types — Uppercase, Lowercase, Capitalize, Uncapitalize — that transform a string type. Combined with a template, get plus Capitalize of code is getCode. These are the building blocks for the key renaming next.</p>`,
    `<p>TypeScript dựng sẵn bốn kiểu chuỗi nội tại — Uppercase, Lowercase, Capitalize, Uncapitalize — biến đổi một kiểu chuỗi. Kết hợp với một mẫu, get cộng Capitalize của code là getCode. Đây là mảnh ghép cho việc đổi tên khoá ngay dưới.</p>`],
  [5, 'Renaming keys with as',
    `<p>In a mapped type, [K in keyof T as newKey] computes a new key for each field (7.1 renamed the value; this renames the key). Getters of Lab has getCode and getCapacity, each a function returning the original field. This is exactly how a library turns a shape into getX methods or onX handlers.</p>`,
    `<p>Trong một mapped type, [K in keyof T as newKey] tính một khoá mới cho mỗi trường (7.1 đổi tên giá trị; cái này đổi tên khoá). Getters của Lab có getCode và getCapacity, mỗi cái một hàm trả về trường gốc. Đây đúng là cách một thư viện biến một dáng thành method getX hay handler onX.</p>`],
  [6, 'The payoff: a typo is caught',
    `<p>Because the event names are a closed union, a misspelling is refused with a suggestion: TS2820, Did you mean booking:created? A plain string would accept booking:creatd and the handler would silently never fire. The template literal type makes the set exact — the whole value of Lab 7’s typed on/emit.</p>`,
    `<p>Vì các tên sự kiện là một union đóng, một lỗi gõ bị từ chối kèm gợi ý: TS2820, Did you mean booking:created? Một string trơn sẽ nhận booking:creatd và handler âm thầm không chạy. Template literal type làm tập này chính xác — chính giá trị của on/emit có kiểu ở Lab 7.</p>`],
  [7, 'Which pattern, when',
    `<p>One union gives one string per member (event names); two unions give the product (message keys, route keys); Uppercase and Capitalize transform the string; as renames mapped keys; and a Resource:Method template gives a closed set of valid keys. All checked, all autocompleted.</p>`,
    `<p>Một union cho một chuỗi mỗi thành viên (tên sự kiện); hai union cho tích (khoá câu chữ, khoá route); Uppercase và Capitalize biến đổi chuỗi; as đổi tên khoá ánh xạ; và một mẫu Resource:Method cho một tập khoá hợp lệ đóng. Đều được kiểm, đều tự gợi ý.</p>`],
  [8, 'Practice &amp; Lab 7',
    `<p>Practice: a PermissionKey typed string accepts labget — make it a template literal Resource:Method and a malformed key becomes TS2820. Next is Lab 7: combine template literal event names, a payload map, a conditional PayloadOf, and two mapped types into a typed event system — string/any scores 5, the reference 10.</p>`,
    `<p>Luyện tập: một PermissionKey kiểu string nhận labget — làm nó một template literal Resource:Method và một khoá sai dạng thành TS2820. Tiếp là Lab 7: gộp tên sự kiện template literal, một bản đồ payload, một PayloadOf conditional, và hai mapped type thành một hệ sự kiện có kiểu — string/any được 5, bản tham khảo 10.</p>`],
]);
