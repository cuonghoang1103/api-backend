/** Giảng theo slide — bài 6.4 Generics thực chiến: suy kiểu & bẫy (deck ts-06-4, 8 slide). */
import { walkTs } from '../_slides.mjs';

export default walkTs('ts-06-4', 'Generics in practice: inference &amp; pitfalls', 'Generics thực chiến: suy kiểu &amp; bẫy', [
  [1, 'Generics in practice: inference &amp; pitfalls',
    `<p>Generics are easy to write and easy to misuse. Inference does most of the work — you call groupBy(users, u => u.role) and tsc fills in both parameters. But a generic can look safe while checking nothing. This lesson shows inference, then three traps: the return-only parameter, the needless parameter, and literal widening.</p>`,
    `<p>Generics dễ viết và dễ dùng sai. Suy kiểu làm phần lớn việc — bạn gọi groupBy(users, u => u.role) và tsc điền cả hai tham số. Nhưng một generic có thể trông an toàn mà không kiểm gì. Bài này cho thấy suy kiểu, rồi ba bẫy: tham số chỉ-trả-về, tham số thừa, và nới rộng literal.</p>`],
  [2, 'Inference does the work',
    `<p>groupBy(users, u => u.role) — no type arguments. tsc infers T = User from the array and K = Role from the key function’s return, so byRole is Map<Role, User[]>. This is Lab 6’s groupBy, used exactly as you will use it — the generics are invisible because inference carried them.</p>`,
    `<p>groupBy(users, u => u.role) — không đối số kiểu. tsc suy T = User từ mảng và K = Role từ kiểu trả về của hàm khoá, nên byRole là Map<Role, User[]>. Đây là groupBy của Lab 6, dùng đúng như bạn sẽ dùng — generic vô hình vì suy kiểu gánh hết.</p>`],
  [3, 'Trap 1: a return-only generic checks nothing',
    `<p>If T appears in the return but not in any parameter, tsc has nothing to check it against — parseJson<User[]>(…) reads like a check but is a cast in disguise, as unsafe as JSON.parse(…) as User[]. 0 errors, and id is the string "oops" where a number was promised. Return unknown and narrow with a guard.</p>`,
    `<p>Nếu T ở kiểu trả về mà không ở tham số nào, tsc chẳng có gì để kiểm — parseJson<User[]>(…) đọc như một phép kiểm nhưng là một phép ép kiểu trá hình, không an toàn y như JSON.parse(…) as User[]. 0 lỗi, và id là chuỗi "oops" ở chỗ hứa một number. Trả unknown và narrow bằng một guard.</p>`],
  [4, 'Trap 2: a type parameter used once is noise',
    `<p>A generic earns its keep only when T connects parts of the signature — usually input to output. countGeneric<T> never uses T in its result, so it buys nothing; count(items: readonly unknown[]) is honest and shorter. Rule of thumb: a type parameter used exactly once is not needed.</p>`,
    `<p>Một generic chỉ đáng khi T nối các phần của chữ ký — thường là in→out. countGeneric<T> không bao giờ dùng T ở kết quả, nên chẳng mua được gì; count(items: readonly unknown[]) trung thực và ngắn hơn. Quy tắc: một tham số kiểu dùng đúng một lần thì không cần.</p>`],
  [5, 'Trap 3: literals widen',
    `<p>A plain array literal widens its elements, so firstOf([\'BE-201\', \'AL-301\']) infers T = string and the result is string | undefined — the exact codes are gone. Add as const at the call and the literals are kept: T = \'BE-201\' | \'AL-301\'.</p>`,
    `<p>Một mảng literal thường nới rộng phần tử, nên firstOf([\'BE-201\', \'AL-301\']) suy T = string và kết quả là string | undefined — các mã chính xác mất. Thêm as const ở lời gọi thì literal được giữ: T = \'BE-201\' | \'AL-301\'.</p>`],
  [6, 'A const type parameter keeps literals',
    `<p>Since TypeScript 5.0 you can put the preference on the parameter: firstOf<const T>(…) infers the narrowest type, as if the caller wrote as const. So firstOf([\'BE-201\', \'AL-301\']) is \'BE-201\' | \'AL-301\' | undefined with nothing extra written. Use it when a helper should keep the exact literals.</p>`,
    `<p>Từ TypeScript 5.0 bạn đặt được ý muốn trên tham số: firstOf<const T>(…) suy kiểu hẹp nhất, như thể người gọi viết as const. Nên firstOf([\'BE-201\', \'AL-301\']) là \'BE-201\' | \'AL-301\' | undefined mà không viết thêm gì. Dùng khi một hàm nên giữ đúng literal.</p>`],
  [7, 'Generic smells &amp; fixes',
    `<p>f<T>(): T checks nothing — return unknown and narrow. A type parameter used once is needless — use unknown[]. Literals widen — as const or a const type parameter. Mixing f<T>(x: T, y: T) infers the common type and hides a mismatch — use two parameters. Inference handles the rest.</p>`,
    `<p>f<T>(): T không kiểm gì — trả unknown và narrow. Một tham số kiểu dùng một lần là thừa — dùng unknown[]. Literal nới rộng — as const hoặc một const type parameter. Trộn f<T>(x: T, y: T) suy kiểu chung và giấu một chỗ lệch — dùng hai tham số. Suy kiểu lo phần còn lại.</p>`],
  [8, 'Practice &amp; Lab 6',
    `<p>Practice: loadUsers<T> returns T, a type nobody checked — remove the generic, return User[] and verify the data with a real guard. Next is Lab 6: build Result<T, E>, Repo<T extends { id }> and groupBy; the any version scores 4.5, the constraint catches wrong types, the reference scores 10.</p>`,
    `<p>Luyện tập: loadUsers<T> trả T, một kiểu không ai kiểm — bỏ generic, trả User[] và kiểm dữ liệu bằng một guard thật. Tiếp là Lab 6: dựng Result<T, E>, Repo<T extends { id }> và groupBy; bản any được 4.5, ràng buộc bắt kiểu sai, bản tham khảo được 10.</p>`],
]);
