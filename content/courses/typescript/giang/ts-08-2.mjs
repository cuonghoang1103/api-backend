/** Giảng theo slide — bài 8.2 Pick & Omit (deck ts-08-2, 8 slide). */
import { walkTs } from '../_slides.mjs';

export default walkTs('ts-08-2', 'Pick &amp; Omit', 'Pick &amp; Omit', [
  [1, 'Pick &amp; Omit',
    `<p>An API almost never sends or accepts a whole model. A create body leaves out the fields the server owns; a public view hides the password hash. Pick and Omit shape one type into another: Pick keeps only the keys you name, Omit keeps everything except them. These are how you build a DTO layer that tracks the model.</p>`,
    `<p>Một API gần như không bao giờ gửi hay nhận cả một model. Một body tạo bỏ những trường server sở hữu; một bản công khai giấu password hash. Pick và Omit nắn một kiểu thành kiểu khác: Pick giữ đúng các khoá bạn nêu, Omit giữ mọi thứ trừ chúng. Đây là cách bạn dựng một tầng DTO bám theo model.</p>`],
  [2, 'Omit: a type minus some keys',
    `<p>A create DTO is the resource minus the fields the server sets. CreateBooking is Omit of Booking without id, status and createdAt — so createBooking takes exactly what a client should send, and returns the full Booking. Add a field to Booking and CreateBooking gains it automatically; it can never drift.</p>`,
    `<p>Một DTO tạo là tài nguyên trừ những trường server đặt. CreateBooking là Omit của Booking bỏ id, status và createdAt — nên createBooking nhận đúng thứ client nên gửi, và trả về Booking đầy đủ. Thêm một trường vào Booking thì CreateBooking tự có; nó không bao giờ trôi.</p>`],
  [3, 'Omit refuses the fields it removed',
    `<p>Because Omit removed id, a client literal that carries id is TS2353 — the server owns that field, and the type says so. This is the whole point of a create DTO: it is not documentation, it is a boundary tsc enforces, so a client cannot set a field it must not.</p>`,
    `<p>Vì Omit đã bỏ id, một literal của client mang id là TS2353 — server sở hữu trường đó, và kiểu nói vậy. Đây chính là mấu chốt của một DTO tạo: nó không phải tài liệu, nó là một ranh giới tsc ép, nên client không đặt được một trường nó không được đặt.</p>`],
  [4, 'Pick: a type with only some keys',
    `<p>A public view is a type with only the safe keys. PublicUser is Pick of User with just id and name, so toPublic returns exactly those; the email, the password hash and the role are not in the type at all. Pick is the positive form — you list what stays — and Omit is the negative — you list what goes.</p>`,
    `<p>Một bản công khai là một kiểu chỉ với các khoá an toàn. PublicUser là Pick của User với chỉ id và name, nên toPublic trả đúng chúng; email, password hash và role không có trong kiểu. Pick là dạng dương — bạn liệt kê cái ở lại — và Omit là dạng âm — bạn liệt kê cái đi.</p>`],
  [5, 'Omit stops a leak at compile time',
    `<p>Make PublicUser Omit of User without passwordHash and the field is gone from the type: reading u.passwordHash is TS2339. A leak of a secret stops being a code-review question and becomes a compile error — the strongest place to catch it. Pick with the safe fields does the same thing from the other side.</p>`,
    `<p>Làm PublicUser là Omit của User bỏ passwordHash và trường biến mất khỏi kiểu: đọc u.passwordHash là TS2339. Một vụ lộ bí mật thôi là chuyện soát code mà thành một lỗi biên dịch — chỗ mạnh nhất để bắt. Pick với các trường an toàn làm điều tương tự từ phía kia.</p>`],
  [6, 'Pick and Omit only accept real keys',
    `<p>Both check their key list against keyof the source: Pick of User with a misspelt emial is TS2344, with a suggestion. So renaming a field in the model turns every stale DTO red at once — the key list cannot name a field that no longer exists. Under the hood Pick is a mapped type and Omit is Pick over Exclude of the keys.</p>`,
    `<p>Cả hai kiểm danh sách khoá với keyof của nguồn: Pick của User với emial gõ sai là TS2344, kèm gợi ý. Nên đổi tên một trường trong model làm mọi DTO cũ đỏ cùng lúc — danh sách khoá không nêu được một trường không còn tồn tại. Bên dưới Pick là một mapped type và Omit là Pick trên Exclude của các khoá.</p>`],
  [7, 'Pick or Omit, when',
    `<p>Omit when most fields stay and you remove a few (a create body minus server fields, a public view minus a secret); Pick when only a few stay and you remove many (a tiny summary of a big model). Whichever reads shorter at the call site is the right one — both derive from the model, so both track it.</p>`,
    `<p>Omit khi hầu hết trường ở lại và bạn bỏ vài cái (một body tạo trừ trường server, một bản công khai trừ một bí mật); Pick khi chỉ vài cái ở lại và bạn bỏ nhiều (một bản tóm tắt nhỏ của một model lớn). Cái nào đọc ngắn hơn ở chỗ gọi là cái đúng — cả hai suy từ model, nên cả hai bám theo.</p>`],
  [8, 'Practice &amp; what is next',
    `<p>Practice: a hand-written CreateNote still carries createdAt and forces the caller to send server-owned fields (TS2739) — derive it with Omit of Note without id and createdAt. Next, 8.3: Record, the utility for a table that must have an entry for every key.</p>`,
    `<p>Luyện tập: một CreateNote viết tay còn mang createdAt và bắt người gọi gửi trường server sở hữu (TS2739) — suy nó bằng Omit của Note bỏ id và createdAt. Tiếp, 8.3: Record, utility cho một bảng phải có một mục cho mỗi khoá.</p>`],
]);
