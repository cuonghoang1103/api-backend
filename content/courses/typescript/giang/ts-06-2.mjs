/** Giảng theo slide — bài 6.2 Ràng buộc, keyof & truy cập theo chỉ mục (deck ts-06-2, 8 slide). */
import { walkTs } from '../_slides.mjs';

export default walkTs('ts-06-2', 'Constraints, keyof &amp; indexed access', 'Ràng buộc, keyof &amp; truy cập theo chỉ mục', [
  [1, 'Constraints, keyof &amp; indexed access',
    `<p>A plain type parameter is powerful because it knows nothing — but inside the function you may not read any property of T, because not every type has one. A constraint says "any type that has at least this", and keyof plus indexed access let you take a key and return exactly that property’s type.</p>`,
    `<p>Một tham số kiểu trơn mạnh vì không biết gì — nhưng trong hàm bạn không được đọc thuộc tính nào của T, vì không phải kiểu nào cũng có. Một ràng buộc nói "kiểu nào có ít nhất thế này", và keyof cùng truy cập theo chỉ mục cho bạn nhận một khoá và trả đúng kiểu của thuộc tính đó.</p>`],
  [2, 'An unconstrained T cannot read a property',
    `<p>T could be number, string, anything — most types have no id — so item.id is TS2339. Without a constraint you can only pass the value around, not look inside it. That is the price of "any type".</p>`,
    `<p>T có thể là number, string, gì cũng được — phần lớn kiểu không có id — nên item.id là TS2339. Không có ràng buộc, bạn chỉ chuyền giá trị đi được, không nhìn vào bên trong. Đó là cái giá của "kiểu bất kỳ".</p>`],
  [3, 'A constraint: "any type that has an id"',
    `<p><T extends { id: number }> is a constraint: T may be any type, as long as it has a numeric id. Inside, item.id is allowed; at the call, the type is kept — byId(users, 2) returns User | undefined. extends here means "is assignable to", not class inheritance.</p>`,
    `<p><T extends { id: number }> là một ràng buộc: T có thể là kiểu bất kỳ, miễn có một id kiểu số. Bên trong, item.id được phép; ở lời gọi, kiểu được giữ — byId(users, 2) trả User | undefined. extends ở đây nghĩa là "gán được vào", không phải kế thừa lớp.</p>`],
  [4, 'keyof and a key parameter',
    `<p>keyof T is the union of T’s property names. Constrain a second parameter K extends keyof T and a caller must pass a real key: getProp(an, \'role\') returns a Role, and a typo getProp(an, \'ghost\') is TS2345. The return type T[K] is that exact property’s type.</p>`,
    `<p>keyof T là union tên các thuộc tính của T. Ràng buộc tham số thứ hai K extends keyof T thì người gọi phải truyền một khoá có thật: getProp(an, \'role\') trả một Role, và lỗi gõ getProp(an, \'ghost\') là TS2345. Kiểu trả về T[K] là kiểu của đúng thuộc tính đó.</p>`],
  [5, 'Indexed access as a type',
    `<p>User[\'role\'] is Role — pull a property’s type out of a shape instead of repeating the union, and it stays in sync when the model changes. keyof User is the union of its keys. These are type-level and vanish at runtime; the program prints ordinary strings.</p>`,
    `<p>User[\'role\'] chính là Role — rút kiểu của một thuộc tính ra khỏi dáng thay vì chép lại union, và nó tự đồng bộ khi model đổi. keyof User là union các khoá của nó. Đây là tầng kiểu và biến mất lúc chạy; chương trình in chuỗi thường.</p>`],
  [6, 'The constraint is checked at the call',
    `<p>Pass a type that does not satisfy T extends { id: number } and tsc stops you at the call site: a lab has a code, not an id, so { code, name }[] is TS2345. The constraint is a promise both sides keep — inside you may use id, outside you may only pass something that has it. This is Lab 6’s Repo.</p>`,
    `<p>Truyền một kiểu không thoả T extends { id: number } thì tsc chặn bạn ngay tại chỗ gọi: một lab có code, không có id, nên { code, name }[] là TS2345. Ràng buộc là một lời hứa cả hai phía giữ — bên trong dùng được id, bên ngoài chỉ truyền được thứ có nó. Đây là Repo của Lab 6.</p>`],
  [7, 'Which tool, when',
    `<p>Plain <T> for pass-through; <T extends { id }> to use the shape; keyof T for the union of names; K extends keyof T for a checked key argument; T[K] for the type of a property. Together they let a helper take a key and return exactly that property’s type.</p>`,
    `<p><T> trơn cho truyền thẳng; <T extends { id }> để dùng dáng; keyof T cho union tên; K extends keyof T cho một đối số khoá được kiểm; T[K] cho kiểu của một thuộc tính. Gộp lại chúng cho một hàm nhận một khoá và trả đúng kiểu của thuộc tính đó.</p>`],
  [8, 'Practice &amp; what is next',
    `<p>Practice: pick is any and casts, so a typo slips — make it <T, K extends keyof T> returning T[K] and \'eemail\' becomes TS2345. Next, 6.3: type aliases, interfaces and classes all take type parameters — Result<T, E> and Repo<T>, with default type parameters.</p>`,
    `<p>Luyện tập: pick là any và cast, nên một lỗi gõ lọt — làm nó <T, K extends keyof T> trả về T[K] và \'eemail\' thành TS2345. Tiếp, 6.3: type alias, interface và class đều nhận tham số kiểu — Result<T, E> và Repo<T>, với tham số kiểu mặc định.</p>`],
]);
