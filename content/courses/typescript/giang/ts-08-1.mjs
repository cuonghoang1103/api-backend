/** Giảng theo slide — bài 8.1 Partial, Required & Readonly (deck ts-08-1, 8 slide). */
import { walkTs } from '../_slides.mjs';

export default walkTs('ts-08-1', 'Partial, Required &amp; Readonly', 'Partial, Required &amp; Readonly', [
  [1, 'Partial, Required &amp; Readonly',
    `<p>Chapter 7 built mapped types by hand; Chapter 8 is their library. TypeScript ships the everyday ones with names — Partial, Required, Readonly, Pick, Omit, Record, Exclude, ReturnType, Awaited — so you write one word instead of a mapped or conditional type. Today the three that change the modifiers of every field: Partial, Required and Readonly.</p>`,
    `<p>Chương 7 dựng mapped type bằng tay; Chương 8 là thư viện của chúng. TypeScript dựng sẵn những cái hay dùng kèm tên — Partial, Required, Readonly, Pick, Omit, Record, Exclude, ReturnType, Awaited — nên bạn viết một từ thay vì một mapped hay conditional type. Hôm nay là ba cái đổi modifier của mọi trường: Partial, Required và Readonly.</p>`],
  [2, 'What you will take away from this chapter',
    `<p>By the end you reach for the right built-in by name: Partial and Required for optionality, Readonly for immutability, Pick and Omit to shape a DTO, Record for a table, Exclude and NonNullable to narrow a union, ReturnType, Parameters and Awaited to read types out of code. And in Lab 8 you rebuild Partial, Pick and Omit yourself, then use them to build the API DTO layer.</p>`,
    `<p>Cuối chương bạn gọi đúng built-in theo tên: Partial và Required cho tính tuỳ chọn, Readonly cho bất biến, Pick và Omit để tạo DTO, Record cho một bảng, Exclude và NonNullable để thu hẹp union, ReturnType, Parameters và Awaited để đọc kiểu ra từ code. Và ở Lab 8 bạn tự dựng lại Partial, Pick, Omit rồi dùng chúng dựng tầng DTO của API.</p>`],
  [3, 'Partial: every field optional',
    `<p>Partial of T makes every field optional — the shape of a PATCH body. applyPatch takes a Partial of Booking, so a caller may send only the fields they change: { seats: 30 } compiles, and so does { lab, seats }. This is exactly the mapped type { [K in keyof T]?: T[K] } from 7.2, now one word.</p>`,
    `<p>Partial của T làm mọi trường tuỳ chọn — dáng của một PATCH body. applyPatch nhận một Partial của Booking, nên người gọi chỉ gửi những trường mình đổi: { seats: 30 } biên dịch được, và { lab, seats } cũng vậy. Đây đúng là mapped type { [K in keyof T]?: T[K] } của 7.2, giờ một từ.</p>`],
  [4, 'Required: every field mandatory',
    `<p>Required of T is the mirror image — it strips every ?, so a type full of optionals becomes fully mandatory. A value with only title is TS2739: body and tags are missing. Reach for it after validation, when you have confirmed a loose draft is now complete. This is { [K in keyof T]-?: T[K] } named.</p>`,
    `<p>Required của T là ảnh gương — nó gỡ mọi ?, nên một kiểu đầy optional thành bắt buộc hết. Một giá trị chỉ có title là TS2739: thiếu body và tags. Dùng nó sau khi kiểm lệ, khi đã chắc một draft lỏng giờ đã đủ. Đây là { [K in keyof T]-?: T[K] } được đặt tên.</p>`],
  [5, 'Readonly: every field frozen',
    `<p>Readonly of T makes every field read-only — assignable when you build the value, immutable after. Reassigning cfg.port is TS2540. It is compile-time only (Node strips it; the object is not frozen at run time — Object.freeze does that), and it is one level deep, exactly { readonly [K in keyof T]: T[K] } from 7.1.</p>`,
    `<p>Readonly của T làm mọi trường chỉ đọc — gán được lúc dựng giá trị, bất biến sau đó. Gán lại cfg.port là TS2540. Nó chỉ có lúc biên dịch (Node bỏ nó; object không bị đóng băng lúc chạy — Object.freeze mới làm vậy), và nó nông một tầng, đúng { readonly [K in keyof T]: T[K] } của 7.1.</p>`],
  [6, 'Utility types compose',
    `<p>They are ordinary types, so they nest: Readonly of Partial of Booking is a read-only patch — every field optional and read-only. You stack them the way you stack functions, and the order matters only in that the outer one wraps the inner. This composition is what makes a small vocabulary cover so many shapes.</p>`,
    `<p>Chúng là kiểu bình thường nên lồng được: Readonly của Partial của Booking là một patch chỉ-đọc — mọi trường optional và read-only. Bạn xếp chồng như xếp hàm, và thứ tự chỉ quan trọng ở chỗ cái ngoài bọc cái trong. Phép ghép này là thứ làm một bộ từ vựng nhỏ phủ được rất nhiều dáng.</p>`],
  [7, 'Which of the three, when',
    `<p>Partial for a body where fields may be omitted (a PATCH); Required for a value that must now be complete; Readonly for a snapshot that must not change after creation. Each is a one-word mapped type, and knowing they are mapped types is how you read the rest of the library.</p>`,
    `<p>Partial cho một body mà trường có thể bỏ (một PATCH); Required cho một giá trị giờ phải đủ; Readonly cho một ảnh chụp không được đổi sau khi tạo. Mỗi cái là một mapped type một-từ, và biết chúng là mapped type là cách bạn đọc phần còn lại của thư viện.</p>`],
  [8, 'Practice &amp; what is next',
    `<p>Practice: a hand-written UserEdit forces the caller to resend every field (TS2739) — change the patch parameter to Partial of User so any subset is accepted. Next, 8.2: Pick and Omit shape one type into another — the create DTO, the public view — which is the heart of a typed API layer.</p>`,
    `<p>Luyện tập: một UserEdit viết tay bắt người gọi gửi lại mọi trường (TS2739) — đổi tham số patch thành Partial của User để nhận tập con bất kỳ. Tiếp, 8.2: Pick và Omit nắn một kiểu thành kiểu khác — DTO tạo, bản công khai — chính là trái tim của một tầng API có kiểu.</p>`],
]);
